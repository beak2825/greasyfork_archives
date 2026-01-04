// ==UserScript==
// @name        4chanX String Replacement
// @version     2.1
// @description Replaces text in 4chan posts. Supports literal strings and simplified regex with automatic case-insensitivity. Fully compatible with 4chanX and Oneechan themes.
// @author      kpganon
// @license     MIT
// @namespace   https://github.com/kpg-anon/scripts
// @include     /^https?://boards\.4chan(nel)?\.org/\w+/thread/\d+/
// @grant       GM_addStyle
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_download
// @grant       GM_xmlhttpRequest
// @run-at      document-idle
// @downloadURL https://update.greasyfork.org/scripts/483286/4chanX%20String%20Replacement.user.js
// @updateURL https://update.greasyfork.org/scripts/483286/4chanX%20String%20Replacement.meta.js
// ==/UserScript==

(function() {

    function applyStaticStyles() {
        GM_addStyle(`
            #wordReplacerMenu {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                z-index: 9999;
                background-color: #282a36;
                color: #f8f8f2;
                border: 1px solid #6272a4;
                padding: 10px;
                width: auto;
                max-height: 800px;
                overflow-y: auto;
                display: none;
            }
            #wordReplacerMenu #rulesContainer {
                margin-top: 10px;
            }
            #wordReplacerMenu #rulesContainer div {
                display: flex;
                justify-content: space-between;
                margin-top: 5px;
            }
            #wordReplacerMenu input {
                flex: 1;
                margin-right: 10px;
                max-width: 45%;
                text-align: center;
                position: relative;
                border: 1px solid #6272a4;
                color: #c5c8c6;
            }
            #wordReplacerMenu #buttonContainer {
                text-align: center;
                width: 100%;
                margin-top: 12px;
            }
            #wordReplacerMenu button {
                margin: 0 2px;
                display: inline-block;
                cursor: pointer;
                border-radius: 2px;
            }
            #wordReplacerMenu button:hover {
                filter: brightness(1.2);
            }

            #wordReplacerMenu button:active {
                transform: scale(0.95);
            }
        `);
    }

    function applyDynamicStyles() {
        const nameElementColor = window.getComputedStyle(document.querySelector('.name')).color;
        const rgbaBorderColor = nameElementColor.replace('rgb', 'rgba').replace(')', ', 0.75)');
        GM_addStyle(`#wordReplacerMenu { border: 1px solid ${nameElementColor}; }`);

        const replyElement = document.querySelector('.reply');
        if (replyElement) {
            const computedReplyBgColor = window.getComputedStyle(replyElement).backgroundColor;
            const replyRgbaColor = computedReplyBgColor.replace('rgb', 'rgba').replace(')', ', 0.9)');
            GM_addStyle(`#wordReplacerMenu { background-color: ${replyRgbaColor} !important; }`);
        }

        const textareaElement = document.querySelector('textarea');
        if (textareaElement) {
            const computedTextareaBgColor = window.getComputedStyle(textareaElement).backgroundColor;
            const textareaRgbMatch = computedTextareaBgColor.match(/\d+, \d+, \d+/);
            if (textareaRgbMatch) {
                const textareaRgbaColor = `rgba(${textareaRgbMatch[0]}, 0.9)`;
                GM_addStyle(`#wordReplacerMenu input { background-color: ${textareaRgbaColor}; }`);
            }
        }

        const submitButton = document.querySelector('input[type="submit"]');
        const bodyColor = window.getComputedStyle(document.body).color;
        let buttonTextColor;

        if (bodyColor === 'rgb(197, 200, 198)') {
            buttonTextColor = 'black';
        } else {
            buttonTextColor = bodyColor;
        }

        if (submitButton) {
            const buttonBgColor = window.getComputedStyle(submitButton).backgroundColor;
            GM_addStyle(`
                #wordReplacerMenu button {
                    background-color: ${buttonBgColor};
                    color: ${buttonTextColor};
                    border-radius: 2px;
                    border: 1px solid ${rgbaBorderColor};
                }
            `);
        }
    }

    function observeStyleChanges() {
        const styleElement = document.getElementById('ch4SS'); 
        if (!styleElement) {
            return;
        }

        const observerOptions = {
            childList: true,
            subtree: true
        };

        const styleChangeObserver = new MutationObserver((mutations) => {
            for (let mutation of mutations) {
                if (mutation.type === 'childList') {
                    applyDynamicStyles();
                }
            }
        });

        styleChangeObserver.observe(styleElement, observerOptions);
    }

    function createMenu() {
        const menu = document.createElement('div');
        menu.id = 'wordReplacerMenu';

        const rulesContainer = document.createElement('div');
        rulesContainer.id = 'rulesContainer';
        menu.appendChild(rulesContainer);

        const buttonContainer = document.createElement('div');
        buttonContainer.id = 'buttonContainer';
        menu.appendChild(buttonContainer);

        document.body.appendChild(menu);

        addRuleRow();
        addButtons(buttonContainer);
        applyDynamicStyles();
    }

    function addButtons(container) {
        const buttons = ['Add Rule', 'Save and Apply', 'Import', 'Export', 'Close'];
        const functions = [() => addRuleRow(), saveRules, importRules, exportRules, toggleMenu];

        buttons.forEach((text, index) => {
            const button = document.createElement('button');
            button.textContent = text;
            button.addEventListener('click', functions[index]);
            container.appendChild(button);
        });
    }

    function addRuleRow(pattern = '', replacement = '') {
        const inputContainer = document.createElement('div');
        const patternInput = createInput('Text/pattern to replace', pattern);
        const replacementInput = createInput('Replacement text', replacement);

        inputContainer.appendChild(patternInput);
        inputContainer.appendChild(replacementInput);

        const rulesContainer = document.getElementById('rulesContainer');
        rulesContainer.appendChild(inputContainer);
    }

    function createInput(placeholder, value) {
        const input = document.createElement('input');
        input.placeholder = placeholder;
        input.value = value;
        return input;
    }

    function saveRules() {
        const rulesContainer = document.getElementById('rulesContainer');
        const inputRows = Array.from(rulesContainer.children);
        const rules = inputRows.reduce((acc, row) => {
            const pattern = row.children[0].value;
            const replacement = row.children[1].value;
            if (pattern || replacement) {
                acc.push({ pattern, replacement });
            }
            return acc;
        }, []);
        GM_setValue('wordReplacerRules', JSON.stringify(rules));
    }

    function importRules() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const data = JSON.parse(e.target.result);
                    clearRules();
                    data.forEach(rule => {
                        addRuleRow(rule.pattern, rule.replacement);
                    });
                    if (data.length >= 4) {
                        addRuleRow();
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    }

    function exportRules() {
        const savedRules = GM_getValue('wordReplacerRules');
        const blob = new Blob([savedRules], {type: "application/json"});
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `${Date.now()}-replacer-config.json`;

        document.body.appendChild(a);
        a.click();

        URL.revokeObjectURL(url);
        document.body.removeChild(a);
    }

    function clearRules() {
        const rulesContainer = document.getElementById('rulesContainer');
        rulesContainer.innerHTML = '';
    }

    function loadRules() {
        clearRules();
        const savedRules = GM_getValue('wordReplacerRules');
        if (savedRules) {
            const rules = JSON.parse(savedRules);
            rules.forEach(rule => {
                addRuleRow(rule.pattern, rule.replacement);
            });
            if (rules.length >= 4) {
                addRuleRow();
            } else {
                for (let i = rules.length; i < 4; i++) {
                    addRuleRow();
                }
            }
        } else {
            for (let i = 0; i < 4; i++) {
                addRuleRow();
            }
        }
    }

    function toggleMenu() {
        const menu = document.getElementById('wordReplacerMenu');
        const toggleButtonIcon = document.querySelector('.fa-pencil');

        if (menu.style.display === 'none') {
            loadRules();
            menu.style.display = 'block';
            toggleButtonIcon.classList.remove('disabled');
            applyDynamicStyles();
        } else {
            menu.style.display = 'none';
            toggleButtonIcon.classList.add('disabled');
        }
    }

    function createToggleButton() {
        const toggleButtonIcon = document.createElement('a');
        toggleButtonIcon.className = 'fa fa-pencil';
        toggleButtonIcon.title = 'Toggle Replacer';
        toggleButtonIcon.href = 'javascript:;';
        toggleButtonIcon.addEventListener('click', toggleMenu);

        toggleButtonIcon.classList.add('disabled');

        const toggleButtonContainer = document.createElement('span');
        toggleButtonContainer.className = 'shortcut brackets-wrap';
        toggleButtonContainer.appendChild(toggleButtonIcon);

        const waitForHeader = setInterval(() => {
            const shortcutsContainer = document.getElementById('shortcuts');
            const statsShortcut = document.getElementById('shortcut-stats');
            if (shortcutsContainer && statsShortcut) {
                clearInterval(waitForHeader);
                shortcutsContainer.insertBefore(toggleButtonContainer, statsShortcut.nextSibling);
            }
        }, 100);
    }


    applyStaticStyles();
    createMenu();
    createToggleButton();
    observeStyleChanges();

    function reconnectObserver() {
        if (observer && !document.body.contains(observer.target)) {
            observer.disconnect();
            observer.observe(document.body, observerConfig);
        }
    }

    function handleNewPosts() {
        const newPosts = document.querySelectorAll('.postMessage:not(.processed)');
        newPosts.forEach(post => {
            replaceTextInPost(post);
            post.classList.add('processed');
        });
    }

    function handleVisibilityChange() {
        if (!document.hidden) {
            reconnectObserver();
            posts.forEach(replaceTextInPost);
        }
    }

    function updateAndProcessPosts() {
        const posts = document.querySelectorAll('.postMessage');
        posts.forEach(replaceTextInPost);
    }

    function replaceTextInNode(node) {
    if (node.parentElement && node.parentElement.tagName === 'A') {
        return;
    }
        const savedRules = GM_getValue('wordReplacerRules');
        if (savedRules) {
            const rules = JSON.parse(savedRules);
            rules.forEach(rule => {
                if (rule.pattern) {
                    const pattern = new RegExp(rule.pattern, 'gi');
                    if (node.nodeType === 3) {
                        node.nodeValue = node.nodeValue.replace(pattern, rule.replacement);
                    }
                }
            });
        }
    }

    function replaceTextInPost(postElement) {
        Array.from(postElement.childNodes).forEach(replaceTextInNode);

        let greentexts = postElement.querySelectorAll('.quote');
        greentexts.forEach(quoteElement => {
            Array.from(quoteElement.childNodes).forEach(replaceTextInNode);
        });
    }

    function processMutations(mutations) {
        for (let mutation of mutations) {
            if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        let postNodes = node.querySelectorAll('.postMessage');
                        if (postNodes.length > 0) {
                            postNodes.forEach(replaceTextInPost);
                        } else if (node.classList && node.classList.contains('postMessage')) {
                            replaceTextInPost(node);
                        }
                    }
                });
            }
        }
    }

    const observerConfig = {
        childList: true,
        subtree: true
    };

    const observer = new MutationObserver((mutations) => {
        processMutations(mutations);
        reconnectObserver();
    });
    observer.observe(document.body, observerConfig);

    const posts = document.querySelectorAll('.postMessage');
    posts.forEach(replaceTextInPost);

    updateAndProcessPosts();

    document.addEventListener('visibilitychange', handleVisibilityChange);

    document.addEventListener('ThreadUpdate', handleNewPosts);

    document.addEventListener('click', (e) => {
        if (e.target && e.target.innerText === 'Save and Apply') {
            setTimeout(updateAndProcessPosts, 500);
        }
    });
})();
