// ==UserScript==
// @name                chatgpt-prompts
// @namespace           https://github.com/linyimin0812/chatgpt-prompts
// @supportURL          https://github.com/linyimin0812/chatgpt-prompts
// @version             1.0.0
// @author              linyimin
// @description         在 ChatGPT 输入框中输入 '/' 时列出提示词(Display a list of prompts When '/' is entered in the ChatGPT input box)
// @description:en      Display a list of prompts When '/' is entered in the ChatGPT input box
// @description:zh-CN   在 ChatGPT 输入框中输入 '/' 时列出提示词
// @require             https://ajax.aspnetcdn.com/ajax/jQuery/jquery-3.6.4.min.js
// @require             https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.12/js/select2.min.js
// @resource css        https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.12/css/select2.min.css
// @match               https://chat.openai.com/*
// @grant               GM_addStyle
// @grant               GM_getResourceText
// @license             MIT
// @downloadURL https://update.greasyfork.org/scripts/467943/chatgpt-prompts.user.js
// @updateURL https://update.greasyfork.org/scripts/467943/chatgpt-prompts.meta.js
// ==/UserScript==

(function() {

    'use strict';

    const cdnUrl = 'https://cdn.jsdelivr.net/gh/linyimin0812/chatgpt-prompts@v1.0.0/prompts-data.js'

    fetch(cdnUrl).then(response => {
        if (!response.ok) {
            alert(`fetch prompt from cdn error plase check if the cdn: ${cdnUrl} is available.`)
        }
    }).catch(error => {
        alert('fetch prompt from cdn error:' + error);
    });

    const script = document.createElement('script');

    script.src = cdnUrl;

    script.onload = function() {

        const promptTextareaMap = new Map();
        const languageSet = new Set();

        // Store the languages of prompt
        for (const prompt of CHAT_GPT_PROMPTS) {
            if (languageSet.has(prompt.language)) {
                continue;
            }
            languageSet.add(prompt.language);
        }

        document.addEventListener('keydown', function(event) {
            const promptTextarea = document.getElementById('prompt-textarea');
            const dropdownVisible = promptTextareaMap.get(promptTextarea);
            if (event.key === 'Escape' && dropdownVisible) {
                hideDropdown();
                promptTextarea.focus();
            }
        });

        setInterval(() => {

            const promptTextarea = document.getElementById('prompt-textarea');
            
            if (promptTextarea && !promptTextareaMap.has(promptTextarea)) {

                promptTextareaMap.set(promptTextarea, false);

                promptTextarea.addEventListener('input', function(event) {
                    const value = event.target.value.trim();

                    const dropdownVisible = promptTextareaMap.get(event.target);

                    if (value === '/') {
                        if (!dropdownVisible) {
                            showDropdown("en");
                        }
                    } else {
                        if (dropdownVisible) {
                            hideDropdown();
                        }
                    }
                });
            }

        }, 1000);

        function showDropdown(language) {

            const promptTextarea = document.getElementById('prompt-textarea');
            promptTextareaMap.set(promptTextarea, true);

            const dropdownContainer = document.createElement('div');
            dropdownContainer.id = 'prompt-dropdown-container';
            dropdownContainer.classList.add('custom-dropdown-container');

            const dropdown = document.createElement('select');
            dropdown.id = 'prompt-dropdown';
            dropdown.classList.add('custom-dropdown');

            const prompts = CHAT_GPT_PROMPTS.filter(prompt => prompt.language === language);

            const placeholderOption = document.createElement('option');
            placeholderOption.disabled = true;
            placeholderOption.selected = true;
            placeholderOption.text = `Total ${prompts.length} prompts`;
            placeholderOption.hidden = true;
            dropdown.add(placeholderOption);

            for (const prompt of prompts) {
                const option = document.createElement('option');
                option.text = prompt.label;
                option.value = prompt.value;
                dropdown.add(option);
            }

            dropdownContainer.appendChild(dropdown);
            document.body.appendChild(dropdownContainer);

            const $select = $(dropdown);
            $select.select2();

            setThemeColor();

            $select.on('select2:open', () => {
                createLanguageAndDescription($select, language);
            });

            $select.on('select2:close', e => {

                hideDropdown();

                if (e.target.selectedIndex <= 0) {
                    return;
                }

                const promptTextarea = document.getElementById('prompt-textarea');

                promptTextarea.focus();
                promptTextarea.value = e.target.options[e.target.selectedIndex].value;
                promptTextarea.style.overflowY = 'auto';
                
            });

            positionDropdown();

            $select.select2('open');

            setTimeout(() => {
                document.querySelector('.select2-search__field').focus();
            }, 100);

        }

        function createLanguageAndDescription(select2, selectedLanguage) {

            const parentSpan = document.createElement('span');
            parentSpan.style.display = 'flex';
            parentSpan.style.alignItems = 'center';
            parentSpan.style.justifyContent = 'space-between';

            // language selector
            const languageDropdown = document.createElement('select');
            languageDropdown.style.marginBottom = '4px';
            languageDropdown.style.paddingTop = '2px';
            languageDropdown.style.paddingBottom = '2px';

            const languages = Array.from(languageSet).sort();

            for (const language of languages) {
                const option = document.createElement('option');
                option.text = language;
                option.value = language;
                if (language === selectedLanguage) {
                    option.selected = true;
                }
                languageDropdown.add(option);
            }

            languageDropdown.addEventListener('change', event => {
                select2.select2('close');
                showDropdown(event.target.value);
            });

            // prompts description
            const descSpan = document.createElement('span');
            descSpan.style.float = 'right';
            const linkElement = document.createElement('a');
            linkElement.href = 'https://www.aishort.top/en/';
            linkElement.target = '_blank';
            linkElement.textContent = 'AI Short';
            linkElement.style.textDecoration = 'underline';
            linkElement.style.color = 'blue';

            descSpan.appendChild(linkElement);

            parentSpan.appendChild(languageDropdown);
            parentSpan.appendChild(descSpan);

            const referenceElement = document.getElementsByClassName('select2-search__field')[0];
            document.getElementsByClassName("select2-search--dropdown")[0].insertBefore(parentSpan, referenceElement);

        }

        function hideDropdown() {
            const dropdownContainer = document.getElementById('prompt-dropdown-container');
            if (dropdownContainer) {
                dropdownContainer.remove();
            }
            const promptTextarea = document.getElementById('prompt-textarea');
            promptTextareaMap.set(promptTextarea, false);
        }

        function positionDropdown() {

            const dropdownContainer = document.getElementById('prompt-dropdown-container');
            if (!dropdownContainer) {
                return;
            }

            const promptTextarea = document.getElementById('prompt-textarea');

            const textareaRect = promptTextarea.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            dropdownContainer.style.top = '';
            dropdownContainer.style.bottom = windowHeight - textareaRect.top + 'px';
            dropdownContainer.style.maxHeight = textareaRect.top + 'px';

            dropdownContainer.style.left = textareaRect.left + 'px';
            dropdownContainer.style.width = textareaRect.width + 'px';
        }

        function setThemeColor() {
            const computedStyle = getComputedStyle(document.querySelector('html'));
            const scheme = computedStyle.getPropertyValue('color-scheme');
            const color = scheme === 'light' ? 'white' : 'grey';

            GM_addStyle(`
                    .select2-results__options {
                        background-color: ${color};
                    }
            `);

        }

        window.addEventListener('resize', function() {
            positionDropdown();
        });

        GM_addStyle(`
            .custom-dropdown-container {
                position: absolute;
                z-index: 9999;
            }

            .custom-dropdown {
                width: 100%;
                background: #fff;
                border: 0px;
                padding: 4px;
                font-family: inherit;
                font-size: inherit;
                color: inherit;
                box-sizing: border-box;
                overflow-y: auto;
            }
        `);

        GM_addStyle(GM_getResourceText('css'));
    };

    document.head.appendChild(script);

})();