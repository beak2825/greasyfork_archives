// ==UserScript==
// @name         Burlington English Cheat - Made By iron web10
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  Made by iron web10
// @author       iron web10
// @match        https://app.burlingtonenglish.com/*
// @icon         https://greasyfork.s3.us-east-2.amazonaws.com/l4mkbqjlftekzy22fuh43t6namfg
// @grant        none
// @license      Iron web10 2025
// @downloadURL https://update.greasyfork.org/scripts/528987/Burlington%20English%20Cheat%20-%20Made%20By%20iron%20web10.user.js
// @updateURL https://update.greasyfork.org/scripts/528987/Burlington%20English%20Cheat%20-%20Made%20By%20iron%20web10.meta.js
// ==/UserScript==

(function() {
    let modMenuCreated = false;
    let toggleButtonCreated = false;
    let correctAnswers = [];
    let autoFillEnabled = localStorage.getItem('autoFillEnabled') === 'true';
    let currentActivityId = null;
    let interceptedAnswers = {};
    let autoFillObserver = null;
let autoCompleteEnabled = localStorage.getItem('autoCompleteEnabled') === 'true';
let isAutoCompleting = false;
    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;

    function getActivityIdFromUrl() {
        let match = window.location.href.match(/\/activities\/(\d+)/);
        if (match) return match[1];
        
        match = window.location.href.match(/activityId[=:](\d+)/);
        if (match) return match[1];
        
        const token = extractTokenFromUrl(window.location.href);
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                if (payload.activityId) return payload.activityId.toString();
            } catch (e) {
                console.log('Could not decode token:', e);
            }
        }
        
        const randomId = 'activity_' + Math.random().toString(36).substr(2, 9);
        return randomId;
    }

    function getStorageKey(activityId) {
        return `activity_${activityId}_data`;
    }

    function extractTokenFromUrl(url) {
        if (!url) return null;
        
        const tokenMatch = url.match(/token=([^&/#]+)/);
        if (tokenMatch && tokenMatch[1].length > 50) {
            return tokenMatch[1];
        }
        return null;
    }

    function initializeFromCurrentUrl() {
        const token = extractTokenFromUrl(window.location.href);
        if (token) {
            const activityId = getActivityIdFromUrl();
            currentActivityId = activityId;
            const storageKey = getStorageKey(activityId);
            const storedData = JSON.parse(localStorage.getItem(storageKey) || '{}');
            
            if (!storedData.token) {
                storedData.token = token;
                localStorage.setItem(storageKey, JSON.stringify(storedData));
                createNotification('Token captured from URL!', 'success');
            }
            
            waitForBody(createModMenuOnce);
        }
    }

    function checkIframesForToken() {
        const iframes = document.querySelectorAll('iframe');
        iframes.forEach(iframe => {
            try {
                const iframeSrc = iframe.src;
                if (iframeSrc && iframeSrc.includes('TypingCloze')) {
                    const token = extractTokenFromUrl(iframeSrc);
                    if (token) {
                        const activityId = getActivityIdFromUrl();
                        currentActivityId = activityId;
                        const storageKey = getStorageKey(activityId);
                        const storedData = localStorage.getItem(storageKey);
                        
                        if (!storedData) {
                            localStorage.setItem(storageKey, JSON.stringify({ token: token }));
                            createNotification('Token captured from iframe!', 'success');
                        }
                    }
                }
            } catch (e) {
                console.log('Cannot access iframe:', e);
            }
        });
    }

    const observer = new MutationObserver(() => {
        checkIframesForToken();
    });

    if (document.body) {
        observer.observe(document.body, { childList: true, subtree: true });
        checkIframesForToken();
    }

    initializeFromCurrentUrl();

    XMLHttpRequest.prototype.open = function(method, url) {
        this._method = method;
        this._url = url;
        return originalOpen.apply(this, arguments);
    };

    XMLHttpRequest.prototype.send = function(body) {
        const self = this;
        
        if (this._url && this._url.includes('token=')) {
            const token = extractTokenFromUrl(this._url);
            const activityId = getActivityIdFromUrl();
            
            if (token && activityId) {
                currentActivityId = activityId;
                const storageKey = getStorageKey(activityId);
                const storedData = localStorage.getItem(storageKey);
                
                if (!storedData) {
                    localStorage.setItem(storageKey, JSON.stringify({ token: token }));
                }
                
                waitForBody(createModMenuOnce);
            }
        }

        if (this._method === 'POST' && (this._url.includes('/CompleteActivity?token='))) {
            const originalOnLoad = self.onload;
            const originalOnReadyStateChange = self.onreadystatechange;
            
            self.onreadystatechange = function() {
                if (self.readyState === 4 && self.status === 200) {
                    try {
                        const responseData = JSON.parse(self.responseText);
                        const activityId = getActivityIdFromUrl();
                        
                        if (responseData && responseData.correctData && activityId) {
                            let answers = [];
                            responseData.correctData.objects.forEach(object => {
                                object.answers.forEach(answer => {
                                    answers.push(answer.value);
                                });
                            });
                            
                            const storageKey = getStorageKey(activityId);
                            const storedData = JSON.parse(localStorage.getItem(storageKey) || '{}');
                            storedData.answers = answers;
                            localStorage.setItem(storageKey, JSON.stringify(storedData));
                            
                            correctAnswers = answers;
                            interceptedAnswers[activityId] = answers;
                            
                            createNotification('Answers captured from page request!', 'success');
                            
                            if (autoFillEnabled) {
                                setTimeout(() => {
                                    fillAnswersInInputs();
                                    startAutoFillMonitoring();
                                }, 500);
                            }
                        }
                    } catch (error) {
                        console.error('Error parsing response:', error);
                    }
                }
                
                if (originalOnReadyStateChange) {
                    originalOnReadyStateChange.apply(self, arguments);
                }
            };
            
            self.onload = function() {
                if (originalOnLoad) {
                    originalOnLoad.apply(self, arguments);
                }
            };
        }

        return originalSend.apply(this, arguments);
    };
function startAutoComplete() {
    if (isAutoCompleting) {
        return;
    }
    
    isAutoCompleting = true;
    
    const checkInterval = setInterval(() => {
        if (!autoCompleteEnabled) {
            clearInterval(checkInterval);
            isAutoCompleting = false;
            return;
        }
        
        const checkBtn = document.querySelector('#checkBtn');
        const isVisible = checkBtn && window.getComputedStyle(checkBtn).display !== 'none';
        const isEnabled = checkBtn && !checkBtn.classList.contains('disabled') && !checkBtn.hasAttribute('disabled');
        
        if (isVisible && isEnabled) {
            clearInterval(checkInterval);
            checkBtn.click();
            
            const modal1Interval = setInterval(() => {
                const modal1 = document.querySelector('#okCancelMsg:not(.manual-completion)[style*="inline-block"], #okCancelMsg[aria-hidden="false"]:not(.manual-completion)');
                if (modal1) {
                    clearInterval(modal1Interval);
                    const okBtn1 = modal1.querySelector('#okCancelMsgOkBtn, .ok');
                    if (okBtn1) okBtn1.click();
                    
                    const modal2Interval = setInterval(() => {
                        const modal2 = document.querySelector('#okCancelMsg.manual-completion[style*="inline-block"], #okCancelMsg.manual-completion[aria-hidden="false"]');
                        if (modal2) {
                            clearInterval(modal2Interval);
                            const cancelBtn = modal2.querySelector('.cancel');
                            if (cancelBtn) cancelBtn.click();
                            
                            fetchAndDisplayAnswers().then(() => {
                                setTimeout(() => {
                                    const resetBtn = document.querySelector('#resetBtn');
                                    if (resetBtn) {
                                        resetBtn.click();
                                        
                                        setTimeout(() => {
                                            fillAnswersInInputs();
                                            
                                            setTimeout(() => {
                                                const checkBtn2 = document.querySelector('#checkBtn');
                                                const isVisible2 = checkBtn2 && window.getComputedStyle(checkBtn2).display !== 'none';
                                                const isEnabled2 = checkBtn2 && !checkBtn2.classList.contains('disabled') && !checkBtn2.hasAttribute('disabled');
                                                
                                                if (isVisible2 && isEnabled2) {
                                                    checkBtn2.click();
                                                    isAutoCompleting = false;
                                                    
                                                    if (autoCompleteEnabled) {
                                                        setTimeout(() => startAutoComplete(), 2000);
                                                    }
                                                } else {
                                                    isAutoCompleting = false;
                                                }
                                            }, 500);
                                        }, 2500);
                                    }
                                }, 500);
                            });
                        }
                    }, 100);
                }
            }, 100);
        }
    }, 500);
}
    function makeDraggable(element) {
        let offsetX, offsetY;

        element.onmousedown = function(event) {
            event.preventDefault();

            offsetX = event.clientX - element.getBoundingClientRect().left;
            offsetY = event.clientY - element.getBoundingClientRect().top;

            document.onmousemove = function(event) {
                element.style.left = event.clientX - offsetX + 'px';
                element.style.top = event.clientY - offsetY + 'px';
            };

            document.onmouseup = function() {
                document.onmousemove = null;
                document.onmouseup = null;
            };
        };
    }

    function createNotification(message, type = 'info') {
        let existingNotification = document.getElementById('custom-notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        let notification = document.createElement('div');
        notification.id = 'custom-notification';
        notification.className = `notification ${type}`;
        notification.innerHTML = `<span class="icon"></span> ${message}`;

        document.body.appendChild(notification);

        requestAnimationFrame(() => {
            notification.classList.add('show');
        });

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 500);
        }, 3000);
    }

    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translate(-50%, 40px);
            padding: 16px 32px;
            border-radius: 12px;
            font-family: 'Arial', sans-serif;
            font-size: 16px;
            font-weight: bold;
            color: white;
            z-index: 10001;
            display: flex;
            align-items: center;
            justify-content: center;
            min-width: 280px;
            max-width: 90%;
            text-align: center;
            box-shadow: 0px 6px 15px rgba(0, 0, 0, 0.3);
            opacity: 0;
            transition: opacity 0.4s ease-out, transform 0.4s ease-out;
            cursor: pointer;
            user-select: none;
            overflow: hidden;
            animation: pulse 3s infinite;
        }

        .notification.show {
            opacity: 1;
            transform: translate(-50%, 0);
        }

        .notification:hover {
            filter: brightness(1.2);
        }

        .notification.info { background: linear-gradient(45deg, #2196F3, #1976D2); }
        .notification.success { background: linear-gradient(45deg, #4CAF50, #388E3C); }
        .notification.warning { background: linear-gradient(45deg, #FFC107, #FFA000); }
        .notification.error { background: linear-gradient(45deg, #F44336, #D32F2F); }

        .notification .icon {
            margin-right: 10px;
            font-size: 18px;
        }

        .notification.info .icon::before { content: 'ℹ️'; }
        .notification.success .icon::before { content: '✅'; }
        .notification.warning .icon::before { content: '⚠️'; }
        .notification.error .icon::before { content: '❌'; }

        @keyframes pulse {
            0% { box-shadow: 0px 6px 15px rgba(0, 0, 0, 0.3); }
            50% { box-shadow: 0px 8px 18px rgba(0, 0, 0, 0.5); }
            100% { box-shadow: 0px 6px 15px rgba(0, 0, 0, 0.3); }
        }

        .toggle-switch {
            position: relative;
            display: inline-block;
            width: 50px;
            height: 24px;
            margin: 10px 0;
        }

        .toggle-switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }

        .slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #ccc;
            transition: .4s;
            border-radius: 24px;
        }

        .slider:before {
            position: absolute;
            content: "";
            height: 18px;
            width: 18px;
            left: 3px;
            bottom: 3px;
            background-color: white;
            transition: .4s;
            border-radius: 50%;
        }

        input:checked + .slider {
            background-color: #4CAF50;
        }

        input:checked + .slider:before {
            transform: translateX(26px);
        }
    `;
    document.head.appendChild(style);

    function createModMenuOnce() {
        if (modMenuCreated) return;

        if (window.self !== window.top) {
            console.log('Script running in iframe - UI will be created');
        } else {
            console.log('Script running in main page - UI will be hidden');
            modMenuCreated = true;
            return;
        }

        let menu = document.createElement('div');
        menu.id = 'mod-menu';
        Object.assign(menu.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: 'linear-gradient(135deg, #333, #111)',
            padding: '20px',
            borderRadius: '12px',
            color: 'white',
            fontFamily: 'Arial, sans-serif',
            zIndex: '10000',
            boxShadow: '0 6px 12px rgba(0, 0, 0, 0.5)',
            display: 'none',
            flexDirection: 'column',
            alignItems: 'center',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(8px)',
        });
        
        let logo = document.createElement('img');
        logo.src = 'https://greasyfork.s3.us-east-2.amazonaws.com/l4mkbqjlftekzy22fuh43t6namfg';
        Object.assign(logo.style, {
            width: '90px',
            height: '90px',
            marginBottom: '10px',
        });
        menu.appendChild(logo);
        
        menu.innerHTML += '<h3 style="margin: 10px 0; text-align: center; font-size: 18px; font-weight: bold;">Mod Menu</h3>';
        
        document.body.appendChild(menu);
        createMenuButton(menu, 'Get Answers', '#28a745', fetchAndDisplayAnswers);
        createMenuButton(menu, 'Get Token', '#007bff', showToken);
        createMenuButton(menu, 'Fill Answers', '#6f42c1', fillAnswersInInputs);
        
        let autoFillContainer = document.createElement('div');
        autoFillContainer.style.display = 'flex';
        autoFillContainer.style.alignItems = 'center';
        autoFillContainer.style.margin = '10px 0';
        
        let autoFillLabel = document.createElement('label');
        autoFillLabel.textContent = 'Auto Fill: ';
        autoFillLabel.style.marginRight = '10px';
        
        let toggleContainer = document.createElement('label');
        toggleContainer.className = 'toggle-switch';
        
        let toggleInput = document.createElement('input');
        toggleInput.type = 'checkbox';
        toggleInput.checked = autoFillEnabled;
        toggleInput.onchange = function() {
            autoFillEnabled = this.checked;
            localStorage.setItem('autoFillEnabled', autoFillEnabled);
            
            if (autoFillEnabled) {
                startAutoFillMonitoring();
                createNotification('Auto Fill enabled', 'success');
            } else {
                stopAutoFillMonitoring();
                createNotification('Auto Fill disabled', 'info');
            }
        };
        
        let slider = document.createElement('span');
        slider.className = 'slider';
        
        toggleContainer.appendChild(toggleInput);
        toggleContainer.appendChild(slider);
        autoFillContainer.appendChild(autoFillLabel);
        autoFillContainer.appendChild(toggleContainer);
        menu.appendChild(autoFillContainer);
let autoCompleteContainer = document.createElement('div');
autoCompleteContainer.style.display = 'flex';
autoCompleteContainer.style.alignItems = 'center';
autoCompleteContainer.style.margin = '10px 0';

let autoCompleteLabel = document.createElement('label');
autoCompleteLabel.textContent = 'Auto Complete: ';
autoCompleteLabel.style.marginRight = '10px';

let toggleCompleteContainer = document.createElement('label');
toggleCompleteContainer.className = 'toggle-switch';

let toggleCompleteInput = document.createElement('input');
toggleCompleteInput.type = 'checkbox';
toggleCompleteInput.checked = autoCompleteEnabled;
toggleCompleteInput.onchange = function() {
    autoCompleteEnabled = this.checked;
    localStorage.setItem('autoCompleteEnabled', autoCompleteEnabled);
    
    console.log('Auto Complete toggled:', autoCompleteEnabled);
    
    if (autoCompleteEnabled) {
        createNotification('Auto Complete enabled', 'success');
        isAutoCompleting = false; // Reset flag
        startAutoComplete();
    } else {
        isAutoCompleting = false;
        createNotification('Auto Complete disabled', 'info');
    }
};

let sliderComplete = document.createElement('span');
sliderComplete.className = 'slider';

toggleCompleteContainer.appendChild(toggleCompleteInput);
toggleCompleteContainer.appendChild(sliderComplete);
autoCompleteContainer.appendChild(autoCompleteLabel);
autoCompleteContainer.appendChild(toggleCompleteContainer);
menu.appendChild(autoCompleteContainer);
        let credits = document.createElement('div');
        credits.textContent = 'Made by iron web10';
        Object.assign(credits.style, {
            marginTop: '15px',
            fontSize: '12px',
            color: '#aaa',
            textAlign: 'center',
            fontStyle: 'italic',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            paddingTop: '10px',
            width: '100%'
        });
        menu.appendChild(credits);

        if (!toggleButtonCreated) {
            let toggleButton = document.createElement('button');
            toggleButton.innerHTML = '<img src="https://greasyfork.s3.us-east-2.amazonaws.com/l4mkbqjlftekzy22fuh43t6namfg" style="width: 100%; height: 100%; object-fit: contain;">';
            toggleButton.style.position = 'fixed';
            toggleButton.style.top = '10px';
            toggleButton.style.right = '20px';
            toggleButton.style.width = '50px';
            toggleButton.style.height = '50px';
            toggleButton.style.background = '#333';
            toggleButton.style.border = 'none';
            toggleButton.style.borderRadius = '10px';
            toggleButton.style.cursor = 'pointer';
            toggleButton.style.zIndex = '10001';
            toggleButton.style.padding = '5px';
            toggleButton.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
            toggleButton.onclick = () => {
                menu.style.display = menu.style.display === 'none' ? 'flex' : 'none';
            };
            document.body.appendChild(toggleButton);
            toggleButtonCreated = true;
            makeDraggable(toggleButton);
        }

        modMenuCreated = true;
    }

    function createMenuButton(menu, text, color, onClick) {
        let button = document.createElement('button');
        button.textContent = text;
        button.style.margin = '5px';
        button.style.padding = '10px 15px';
        button.style.background = color;
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.onclick = onClick;
        menu.appendChild(button);
    }

    function showToken() {
        const activityId = getActivityIdFromUrl();
        
        const storageKey = getStorageKey(activityId);
        const storedData = JSON.parse(localStorage.getItem(storageKey) || '{}');
        const token = storedData.token;
        
        createNotification(token ? `Token: ${token.substring(0, 30)}...` : 'No token found for this activity!', token ? 'success' : 'error');
    }

    async function fetchAndDisplayAnswers() {
        const activityId = getActivityIdFromUrl();

        const storageKey = getStorageKey(activityId);
        const storedData = JSON.parse(localStorage.getItem(storageKey) || '{}');
        
        if (storedData.answers && storedData.answers.length > 0) {
            correctAnswers = storedData.answers;
            createNotification('Using cached answers for this activity!', 'info');
            navigator.clipboard.writeText(JSON.stringify(correctAnswers));
            return;
        }

        const token = storedData.token;
        if (!token) {
            createNotification('No token found for this activity!', 'error');
            return;
        }

        const apiUrl = `/Activities/api/TypingCloze/CompleteActivity?token=${token}`;
        let data = null;
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });

            if (!response.ok) {
                if (response.status === 500) {
                    const fallbackApiUrl = `https://app.burlingtonenglish.com/Activities/api/TypingSentence/CompleteActivity?token=${token}`;
                    const fallbackResponse = await fetch(fallbackApiUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' }
                    });

                    if (!fallbackResponse.ok) {
                        throw new Error(`Fallback API error: ${fallbackResponse.status} ${fallbackResponse.statusText}`);
                    }

                    data = await fallbackResponse.json();
                } else {
                    throw new Error(`Request error: ${response.status} ${response.statusText}`);
                }
            } else {
                data = await response.json();
            }

            if (!data || !data.correctData) {
                createNotification('No correct answers found!', 'error');
                return;
            }

            correctAnswers = [];
            data.correctData.objects.forEach(object => {
                object.answers.forEach(answer => {
                    correctAnswers.push(answer.value);
                });
            });

            storedData.answers = correctAnswers;
            localStorage.setItem(storageKey, JSON.stringify(storedData));

            const correctAnswersJson = JSON.stringify(correctAnswers);
            navigator.clipboard.writeText(correctAnswersJson).then(() => {
                createNotification('Answers fetched successfully!', 'success');
            }).catch(err => {
                createNotification('Failed to copy answers!', 'error');
            });
            
        } catch (error) {
            console.error('Error fetching answers:', error);
            createNotification('Failed to fetch answers!', 'error');
        }
    }

    function fillAnswersInInputs() {
        const activityId = getActivityIdFromUrl();
        
        if (correctAnswers.length === 0) {
            if (activityId) {
                const storageKey = getStorageKey(activityId);
                const storedData = JSON.parse(localStorage.getItem(storageKey) || '{}');
                if (storedData.answers) {
                    correctAnswers = storedData.answers;
                }
            }
            
            if (correctAnswers.length === 0) {
                createNotification('No answers found! Fetch answers first.', 'error');
                return;
            }
        }

        const inputFields = document.querySelectorAll('input[type="text"].blank, input[type="text"][ng-model*="answers"]');
        
        if (inputFields.length === 0) {
            createNotification('No input fields found!', 'warning');
            return;
        }

        let filledCount = 0;
        inputFields.forEach((input, index) => {
            if (index < correctAnswers.length) {
                const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
                nativeInputValueSetter.call(input, correctAnswers[index]);
                
                const inputEvent = new Event('input', { bubbles: true });
                input.dispatchEvent(inputEvent);
                
                const changeEvent = new Event('change', { bubbles: true });
                input.dispatchEvent(changeEvent);
                
                filledCount++;
            }
        });

        createNotification(`${filledCount} answers filled successfully!`, 'success');
    }

    function startAutoFillMonitoring() {
        if (autoFillObserver) {
            autoFillObserver.disconnect();
        }

        const targetNode = document.body;
        const config = { attributes: true, childList: true, subtree: true };

        autoFillObserver = new MutationObserver((mutationsList) => {
            if (!autoFillEnabled || correctAnswers.length === 0) return;

            const inputFields = document.querySelectorAll('input[type="text"].blank, input[type="text"][ng-model*="answers"]');
            let hasEmptyField = false;

            inputFields.forEach((input, index) => {
                if (index < correctAnswers.length && (!input.value || input.value.trim() === '')) {
                    hasEmptyField = true;
                }
            });

            if (hasEmptyField) {
                setTimeout(() => {
                    inputFields.forEach((input, index) => {
                        if (index < correctAnswers.length && (!input.value || input.value.trim() === '')) {
                            const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
                            nativeInputValueSetter.call(input, correctAnswers[index]);
                            
                            const inputEvent = new Event('input', { bubbles: true });
                            input.dispatchEvent(inputEvent);
                            
                            const changeEvent = new Event('change', { bubbles: true });
                            input.dispatchEvent(changeEvent);
                        }
                    });
                }, 100);
            }
        });

        autoFillObserver.observe(targetNode, config);
    }

    function stopAutoFillMonitoring() {
        if (autoFillObserver) {
            autoFillObserver.disconnect();
            autoFillObserver = null;
        }
    }

    waitForBody(createModMenuOnce);

    if (autoFillEnabled) {
        setTimeout(() => {
            const activityId = getActivityIdFromUrl();
            if (activityId) {
                const storageKey = getStorageKey(activityId);
                const storedData = JSON.parse(localStorage.getItem(storageKey) || '{}');
                if (storedData.answers) {
                    correctAnswers = storedData.answers;
                    fillAnswersInInputs();
                    startAutoFillMonitoring();
                }
            }
        }, 2000);
    }
if (autoCompleteEnabled) {
    console.log('Auto complete was enabled, starting in 3 seconds...');
    setTimeout(() => {
        isAutoCompleting = false; // Reset flag
        startAutoComplete();
    }, 1000);
}
    function waitForBody(callback) {
        if (document.body) callback();
        else new MutationObserver((_, observer) => {
            if (document.body) {
                observer.disconnect();
                callback();
            }
        }).observe(document.documentElement, { childList: true, subtree: true });
    }
})();