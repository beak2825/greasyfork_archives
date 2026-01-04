// ==UserScript==
// @name         uCertify Helper
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Enjoy your study
// @match        *.ucertify.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/524268/uCertify%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/524268/uCertify%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let enableAutoCard = false;
    let enableMarkAsRead = false;

    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    function createSmallSpinner() {
        const spinner = document.createElement('div');
        spinner.className = 'quiz-helper-small-spinner';
        spinner.style.border = '4px solid #f3f3f3';
        spinner.style.borderTop = '4px solid #3498db';
        spinner.style.borderRadius = '50%';
        spinner.style.width = '24px';
        spinner.style.height = '24px';
        spinner.style.animation = 'spin 1s linear infinite';

        const style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = '@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }';
        document.getElementsByTagName('head')[0].appendChild(style);

        return spinner;
    }

    function showSmallSpinner() {
        let answerElement = document.querySelector('.quiz-helper-answer');
        if (!answerElement) {
            answerElement = document.createElement('div');
            answerElement.className = 'quiz-helper-answer';
            const questionElement = document.querySelector('.test-question ._title') || document.querySelector('.test-question [data-itemtype="question"]');
            if (questionElement) {
                questionElement.appendChild(answerElement);
            }
        }
        const spinner = createSmallSpinner();
        answerElement.innerHTML = '';
        answerElement.appendChild(spinner);
    }

    function hideSmallSpinner() {
        const spinner = document.querySelector('.quiz-helper-small-spinner');
        if (spinner) {
            spinner.remove();
        }
    }

    function enableAndClickButton() {
        const correctButton = document.getElementById('correct');
        if (correctButton && correctButton.disabled) {
            correctButton.disabled = false;
            correctButton.click();
        }
    }

    function startAutoCard() {
        const interval = setInterval(() => {
            if (enableAutoCard) {
                enableAndClickButton();
            }
        }, 500);
    }

    function clickMarkAsRead() {
        if (!enableMarkAsRead) return;

        const readingIndicators = document.querySelectorAll('.dropdown.reset_reading_time.pointer > div[data-bs-toggle="dropdown"]');
        readingIndicators.forEach(indicator => {
            if (!indicator.classList.contains('show')) {
                indicator.click();
            }
            const markAsReadLink = indicator.nextElementSibling?.querySelector('.dropdown-item.mark_read');
            if (markAsReadLink) {
                markAsReadLink.click();
            }
        });
    }

    function startMarkAsRead() {
        window.addEventListener('load', clickMarkAsRead);

        (function() {
            let originalXHR = window.XMLHttpRequest;
            window.XMLHttpRequest = function() {
                let xhr = new originalXHR();
                let originalSend = xhr.send;
                xhr.send = function() {
                    this.addEventListener('load', function() {
                        clickMarkAsRead();
                    });
                    originalSend.apply(xhr, arguments);
                };
                return xhr;
            };
        })();

        setInterval(clickMarkAsRead, 500);
    }

    function getQuizTitle() {
        const titleElement = document.querySelector('a.nav-link.text-body.text-truncate');
        return titleElement ? titleElement.innerText.trim() : 'Quiz';
    }

    function getQuestionAndOptions() {
        const questionElement = document.querySelector('.test-question ._title') || document.querySelector('.test-question [data-itemtype="question"]');
        const question = questionElement ? questionElement.innerText.trim() : '';
        console.log('Question:', question); // Debug output

        let options = [];
        const optionElementsLeft = document.querySelectorAll('.shuffleList1 .matchlist_list');
        const optionElementsRight = document.querySelectorAll('.shuffleList2 .matchlist_list');

        if (optionElementsLeft.length > 0 && optionElementsRight.length > 0) {
            options = {
                left: Array.from(optionElementsLeft).map(option => option.innerText.trim()),
                right: Array.from(optionElementsRight).map(option => option.innerText.trim())
            };
            console.log('Matching options:', options); // Debug output
        } else {
            const optionsElements = document.querySelectorAll('#item_answer .radio_label, #item_answer .chekcbox_label');
            options = Array.from(optionsElements).map(option => option.innerText.trim().replace(/^\w\./, '').trim());
            console.log('Multiple choice options:', options); // Debug output
        }

        return { question, options };
    }

    // Function to perform DuckDuckGo search using GM_xmlhttpRequest
    async function duckDuckGoSearch(query) {
        const url = `https://duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                onload: function(response) {
                    if (response.status === 200) {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(response.responseText, 'text/html');

                        const results = Array.from(doc.querySelectorAll('.result')).slice(0, 5).map(result => ({
                            title: result.querySelector('.result__a')?.innerText,
                            snippet: result.querySelector('.result__snippet')?.innerText,
                            link: result.querySelector('.result__a')?.href
                        }));

                        resolve(results);
                    } else {
                        console.error('Error fetching search results:', response);
                        reject('Error fetching search results');
                    }
                },
                onerror: function(error) {
                    console.error('Network error:', error);
                    reject('Network error');
                }
            });
        });
    }

    // Function to get search suggestions from GPT
    async function getSearchSuggestions(title, question, options) {
        const apiUrl = GM_getValue('openai_api_url');
        const apiKey = GM_getValue('openai_api_key');
        const apimodel = GM_getValue('openai_api_model');

        let prompt;
        if (options.left && options.right) {
            prompt = `Quiz Title: ${title}\nQuestion: ${question}\nMatch the following terms to their definitions:\nTerms:\n${options.left.join('\n')}\nDefinitions:\n${options.right.join('\n')}\nPlease provide only the search keywords.`;
        } else if (options.length > 0) {
            prompt = `Quiz Title: ${title}\nQuestion: ${question}\nOptions:\n${options.map((opt, index) => String.fromCharCode(65 + index) + '. ' + opt).join('\n')}\nPlease provide only the search keywords.`;
        }

        console.log('Prompt for search suggestions:', prompt);

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: apimodel,
                    messages: [
                        {"role": "system", "content": "You are a helpful assistant."},
                        {"role": "user", "content": prompt}
                    ]
                })
            });
            const data = await response.json();
            console.log('Search suggestions API Response:', data);

            if (data.choices && data.choices.length > 0) {
                return data.choices[0].message.content.trim();
            } else {
                console.error('No search suggestions found in API response');
                return 'No search suggestions found';
            }
        } catch (error) {
            console.error('Error fetching search suggestions:', error);
            return 'Error fetching search suggestions';
        }
    }

    // Function to get answer from GPT with search results
    async function getChatGPTAnswerWithSearchResults(title, question, options, searchResults) {
        const apiUrl = GM_getValue('openai_api_url');
        const apiKey = GM_getValue('openai_api_key');
        const apimodel = GM_getValue('openai_api_model');

        let prompt;
        if (options.left && options.right) {
            prompt = `Please provide only the correct matches in the format "1-A\\n2-B\\n3-C". Do not include any additional text.\n\nQuiz Title: ${title}\nQuestion: ${question}\nMatch the following terms to their definitions:\nTerms:\n${options.left.join('\n')}\nDefinitions:\n${options.right.join('\n')}\nSearch Results:\n${searchResults.map(result => `${result.title}\n${result.snippet}`).join('\n\n')}`;
        } else if (options.length > 0) {
            prompt = `Please provide only the letter(s) of the correct answer(s) (e.g., A, B, C, or D) without any explanation.\n\nQuiz Title: ${title}\nQuestion: ${question}\nOptions:\n${options.map((opt, index) => String.fromCharCode(65 + index) + '. ' + opt).join('\n')}\nSearch Results:\n${searchResults.map(result => `${result.title}\n${result.snippet}`).join('\n\n')}`;
        }

        console.log('Prompt for final answer:', prompt);

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: apimodel,
                    messages: [
                        {"role": "system", "content": "You are a helpful assistant."},
                        {"role": "user", "content": prompt}
                    ],
                    max_tokens: 1000
                })
            });
            const data = await response.json();
            console.log('Final answer API Response:', data);

            if (data.choices && data.choices.length > 0) {
                return data.choices[0].message.content.trim();
            } else {
                console.error('No choices found in API response');
                return 'No answer found';
            }
        } catch (error) {
            console.error('Error fetching final answer:', error);
            return 'Error fetching final answer';
        }
    }

    function displayAnswer(answer) {
        const answerElement = document.querySelector('.quiz-helper-answer');

        if (!answerElement) {
            const newAnswerElement = document.createElement('div');
        }
        const newAnswerElement = document.createElement('div');
        newAnswerElement.className = 'quiz-helper-answer';
        newAnswerElement.innerHTML = answer;
        newAnswerElement.style.color = 'red';
        newAnswerElement.style.fontWeight = 'bold';

        const questionElement = document.querySelector('.test-question ._title') || document.querySelector('.test-question [data-itemtype="question"]');
        if (questionElement) {
            questionElement.appendChild(newAnswerElement);
        }

        hideSmallSpinner();
    }

    async function answerMain() {
        if (!document.querySelector('.quiz-helper-answer')) {

            const title = getQuizTitle();
            const { question, options } = getQuestionAndOptions();

            if (question && ((options.left && options.left.length > 0) || options.length > 0)) {
                showSmallSpinner();

                const searchSuggestions = await getSearchSuggestions(title, question, options);
                console.log('Search Suggestions:', searchSuggestions);

                const searchResults = await duckDuckGoSearch(searchSuggestions);
                console.log('Search Results:', searchResults);

                const answer = await getChatGPTAnswerWithSearchResults(title, question, options, searchResults);
                displayAnswer(answer);
            }

            hideSmallSpinner();
        } else {
            console.log('No question or options found');
        }
    }

    function createControlPanel() {
        const panel = document.createElement('div');
        panel.style.position = 'fixed';
        panel.style.top = '10px';
        panel.style.right = '10px';
        panel.style.width = '300px';
        panel.style.height = '300px';
        panel.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        panel.style.color = 'white';
        panel.style.padding = '10px';
        panel.style.borderRadius = '5px';
        panel.style.zIndex = '10000';
        panel.style.fontSize = '14px';
        panel.style.display = 'none'; // Initially hidden

        const autoCardToggle = document.createElement('label');
        autoCardToggle.innerHTML = `Auto Card: <input type="checkbox" ${enableAutoCard ? 'checked' : ''}>`;
        autoCardToggle.style.display = 'block';
        autoCardToggle.style.marginBottom = '5px';
        autoCardToggle.querySelector('input').addEventListener('change', (e) => {
            enableAutoCard = e.target.checked;
        });

        const markAsReadToggle = document.createElement('label');
        markAsReadToggle.innerHTML = `Mark as Read: <input type="checkbox" ${enableMarkAsRead ? 'checked' : ''}>`;
        markAsReadToggle.style.display = 'block';
        markAsReadToggle.style.marginBottom = '5px';
        markAsReadToggle.querySelector('input').addEventListener('change', (e) => {
            enableMarkAsRead = e.target.checked;
            if (enableMarkAsRead) {
                startMarkAsRead();
            }
        });

        const apiURLInput = document.createElement('input');
        apiURLInput.type = 'text';
        apiURLInput.placeholder = 'OpenAI API URL';
        apiURLInput.style.width = '100%';
        apiURLInput.style.marginBottom = '5px';
        apiURLInput.value = GM_getValue('openai_api_url', 'https://api.openai.com/v1/chat/completions');

        const apiKeyInput = document.createElement('input');
        apiKeyInput.type = 'text';
        apiKeyInput.placeholder = 'OpenAI API Key';
        apiKeyInput.style.width = '100%';
        apiKeyInput.style.marginBottom = '5px';
        apiKeyInput.value = GM_getValue('openai_api_key', '');

        const apiModelSelect = document.createElement('select');
        apiModelSelect.style.width = '100%';
        apiModelSelect.style.marginBottom = '10px';
        const models = ['', 'gpt-4o', 'gpt-4o-mini', 'gpt-4o-all', 'gpt-4-turbo', 'claude-3-5-sonnet-latest', 'gemini-2.0-flash-thinking-exp', 'gemini-2.0-flash-exp', 'gemini-1.5-flash'];
        models.forEach(model => {
            const option = document.createElement('option');
            option.value = model;
            option.textContent = model || 'Select a model';
            if (model === GM_getValue('openai_api_model')) {
                option.selected = true;
            }
            apiModelSelect.appendChild(option);
        });

        const saveButton = document.createElement('button');
        saveButton.textContent = 'Save Settings';
        saveButton.style.marginTop = '10px';
        saveButton.style.backgroundColor = 'green';
        saveButton.style.color = 'white';
        saveButton.style.border = 'none';
        saveButton.style.padding = '5px 10px';
        saveButton.style.cursor = 'pointer';
        saveButton.addEventListener('click', () => {
            GM_setValue('openai_api_url', apiURLInput.value);
            GM_setValue('openai_api_key', apiKeyInput.value);
            GM_setValue('openai_api_model', apiModelSelect.value);
            alert('OpenAI settings saved!');
        });

        panel.appendChild(autoCardToggle);
        panel.appendChild(markAsReadToggle);
        panel.appendChild(apiURLInput);
        panel.appendChild(apiKeyInput);
        panel.appendChild(apiModelSelect);
        panel.appendChild(saveButton);

        document.body.appendChild(panel);

        const dragIcon = document.createElement('div');
        dragIcon.style.position = 'fixed';
        dragIcon.style.top = '10px';
        dragIcon.style.right = '10px';
        dragIcon.style.width = '40px';
        dragIcon.style.height = '40px';
        dragIcon.style.backgroundImage = 'url(https://rcdn.tonyha7.com/sliver__wolf_playing.jpg)';
        dragIcon.style.backgroundSize = 'cover';
        dragIcon.style.backgroundPosition = 'center';
        dragIcon.style.borderRadius = '50%';
        dragIcon.style.cursor = 'pointer';
        dragIcon.style.opacity = '0.5';
        dragIcon.style.zIndex = '10001';

        dragIcon.addEventListener('mouseover', () => {
            dragIcon.style.opacity = '1';
        });

        dragIcon.addEventListener('mouseout', () => {
            dragIcon.style.opacity = '0.5';
        });

        dragIcon.addEventListener('click', () => {
            panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
        });

        let isDragging = false;
        let offsetX, offsetY;

        dragIcon.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.offsetX;
            offsetY = e.offsetY;
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                const x = e.clientX - offsetX;
                const y = e.clientY - offsetY;
                dragIcon.style.top = `${y}px`;
                dragIcon.style.left = `${x}px`;
                panel.style.top = `${y}px`;
                panel.style.left = `${x + 50}px`;
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });

        document.body.appendChild(dragIcon);
    }

    // Call the createSmallSpinner function once to initialize the spinner element
    createSmallSpinner();

    // Observe changes in the DOM and rerun main function with debounce
    const debouncedMain = debounce(answerMain, 500);
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length || mutation.removedNodes.length) {
                console.log('DOM changed, running main function');
                debouncedMain();
            }
        });
    });

    // Start observing the entire document for changes
    observer.observe(document.body, { childList: true, subtree: true });

    // Init
    if (window.location.href.includes('get_flash_card')) {
        startAutoCard();
    }

    if (window.location.href.includes('func=ebook') && enableMarkAsRead) {
        startMarkAsRead();
    }

    if (window.location.href.includes('app')) {
        window.addEventListener('load', answerMain);
    }

    if (window.location.href.includes('ucertify.com')) {
        createControlPanel();
    }
})();