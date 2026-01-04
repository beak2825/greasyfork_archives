// ==UserScript==
// @name               Bing China Search Optimization
// @name:zh-CN         必应中国体验优化
// @name:zh-TW         必應中國體驗優化
// @namespace          https://www.imxiaoanag.com
// @version            1.0.2
// @description        Make your Bing China searches cleaner and more efficient!
// @description:zh-CN  提升必应中国搜索的简洁与高效！
// @description:zh-TW  提升必應中國(對岸版)搜尋的簡潔與高效！
// @author             imxiaoanag
// @match              http*://cn.bing.com/*
// @icon               data:image/png;base64,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
// @grant              GM_getValue
// @grant              GM_setValue
// @run-at             document-start
// @license            MIT
// @downloadURL https://update.greasyfork.org/scripts/524593/Bing%20China%20Search%20Optimization.user.js
// @updateURL https://update.greasyfork.org/scripts/524593/Bing%20China%20Search%20Optimization.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const removeElements = [
        'li.b_ad',
        'div.sb_adTA',
        'li#adstop_gradiant_separator'
    ];

    function removeAds() {
        removeElements.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                element.remove();
            });
        });
    }

    function cleanURI(url) {
        const urlObj = new URL(url);
        if (urlObj.hostname === 'cn.bing.com' && urlObj.pathname === '/search') {
            const searchQuery = urlObj.searchParams.get('q');
            const firstParam = urlObj.searchParams.get('first');

            if (searchQuery) {
                let cleanUrl = `https://cn.bing.com/search?q=${encodeURIComponent(searchQuery)}`;
                if (firstParam) {
                    cleanUrl += `&first=${firstParam}`;
                }
                return cleanUrl;
            }
        }
    }

    function checkAndCleanUrl() {
        const currentUrl = window.location.href;
        const cleanedUrl = cleanURI(currentUrl);

        if (cleanedUrl !== currentUrl) {
            window.history.replaceState(null, '', cleanedUrl);
        }
    }

    const defaultExcludedDomains = ['https://[^/]+\.csdn\.net', 'https://[^/]+\.jianshu\.com'];
    let excludedDomains = GM_getValue('excludedDomains', defaultExcludedDomains);

    function removeSpecificDomainResults() {
        excludedDomains.forEach(domainPattern => {
            const regex = new RegExp(domainPattern);
            const domainElements = document.querySelectorAll('a[href]');
            domainElements.forEach(element => {
                if (regex.test(element.href)) {
                    const liElement = element.closest('li.b_algo');
                    if (liElement) {
                        liElement.remove();
                    }
                }
            });
        });
    }

    function createSettingsUI() {
        const settingsDiv = document.createElement('div');
        settingsDiv.id = 'bingSettingsUI';
        settingsDiv.style.position = 'fixed';
        settingsDiv.style.bottom = '10px';
        settingsDiv.style.right = '60px'; // Adjusted to 60px to avoid overlapping with toggleButton
        settingsDiv.style.width = '320px';
        settingsDiv.style.height = 'auto';
        settingsDiv.style.border = '1px solid #ccc';
        settingsDiv.style.backgroundColor = '#fff';
        settingsDiv.style.padding = '10px';
        settingsDiv.style.zIndex = '10002';
        settingsDiv.style.boxShadow = '2px 2px 10px rgba(0, 0, 0, 0.2)';
        settingsDiv.style.borderRadius = '5px';
        settingsDiv.style.fontFamily = 'Arial, sans-serif';

        const settingsTitle = document.createElement('h3');
        settingsTitle.innerText = '排除域名设置'; // Default to Simplified Chinese
        settingsDiv.appendChild(settingsTitle);

        const domainList = document.createElement('ul');
        domainList.id = 'excludedDomainsList';
        domainList.style.listStyleType = 'none';
        domainList.style.padding = '0';
        domainList.style.margin = '0';

        excludedDomains.forEach((domain, index) => {
            const li = document.createElement('li');
            li.style.display = 'flex';
            li.style.alignItems = 'center';
            li.style.justifyContent = 'space-between'; // Ensure elements are right-aligned
            li.style.marginBottom = '5px';

            const input = document.createElement('input');
            input.type = 'text';
            input.value = domain;
            input.style.width = '250px';
            input.style.padding = '5px';
            input.style.border = '1px solid #ccc';
            input.style.borderRadius = '3px';

            const removeButton = document.createElement('button');
            removeButton.innerText = '删除'; // Default to Simplified Chinese
            removeButton.style.width = '60px'; // 统一设置为60px
            removeButton.style.padding = '5px 10px';
            removeButton.style.border = 'none';
            removeButton.style.backgroundColor = '#008CBA'; // Changed to teal color
            removeButton.style.color = 'white'; // Changed to white color
            removeButton.style.borderRadius = '3px';
            removeButton.style.cursor = 'pointer';
            removeButton.onclick = () => {
                excludedDomains.splice(index, 1);
                li.remove();
                GM_setValue('excludedDomains', excludedDomains);
            };

            li.appendChild(input);
            li.appendChild(removeButton);
            domainList.appendChild(li);
        });

        settingsDiv.appendChild(domainList);

        const addDomainWrapper = document.createElement('div');
        addDomainWrapper.style.display = 'flex';
        addDomainWrapper.style.alignItems = 'center';
        addDomainWrapper.style.justifyContent = 'space-between'; // Ensure elements are right-aligned
        addDomainWrapper.style.marginBottom = '10px';

        const addDomainInput = document.createElement('input');
        addDomainInput.type = 'text';
        addDomainInput.id = 'addExcludedDomainInput';
        addDomainInput.placeholder = '添加新域名'; // Default to Simplified Chinese
        addDomainInput.style.width = '250px';
        addDomainInput.style.padding = '5px';
        addDomainInput.style.border = '1px solid #ccc';
        addDomainInput.style.borderRadius = '3px';
        addDomainWrapper.appendChild(addDomainInput);

        const addButton = document.createElement('button');
        addButton.innerText = '添加'; // Default to Simplified Chinese
        addButton.style.width = '60px'; // 统一设置为60px
        addButton.style.padding = '5px 10px';
        addButton.style.border = 'none';
        addButton.style.backgroundColor = '#008CBA'; // Changed to teal color
        addButton.style.color = 'white'; // Changed to white color
        addButton.style.borderRadius = '3px';
        addButton.style.cursor = 'pointer';
        addButton.onclick = () => {
            const newDomain = addDomainInput.value.trim();
            if (newDomain && !excludedDomains.includes(newDomain)) {
                excludedDomains.push(newDomain);
                const li = document.createElement('li');
                li.style.display = 'flex';
                li.style.alignItems = 'center';
                li.style.justifyContent = 'space-between'; // Ensure elements are right-aligned
                li.style.marginBottom = '5px';

                const input = document.createElement('input');
                input.type = 'text';
                input.value = newDomain;
                input.style.width = '250px';
                input.style.padding = '5px';
                input.style.marginRight = '5px';
                input.style.border = '1px solid #ccc';
                input.style.borderRadius = '3px';

                const removeButton = document.createElement('button');
                removeButton.innerText = '删除'; // Default to Simplified Chinese
                removeButton.style.width = '60px'; // 统一设置为60px
                removeButton.style.padding = '5px 10px';
                removeButton.style.border = 'none';
                removeButton.style.backgroundColor = '#008CBA'; // Changed to teal color
                removeButton.style.color = 'white'; // Changed to white color
                removeButton.style.borderRadius = '3px';
                removeButton.style.cursor = 'pointer';
                removeButton.onclick = () => {
                    const index = excludedDomains.indexOf(newDomain);
                    if (index !== -1) {
                        excludedDomains.splice(index, 1);
                        li.remove();
                        GM_setValue('excludedDomains', excludedDomains);
                    }
                };

                li.appendChild(input);
                li.appendChild(removeButton);
                domainList.appendChild(li);
                addDomainInput.value = '';
                GM_setValue('excludedDomains', excludedDomains);
            }
        };
        addDomainWrapper.appendChild(addButton);

        settingsDiv.appendChild(addDomainWrapper);

        const saveButton = document.createElement('button');
        saveButton.id = 'bingSaveButton';
        saveButton.innerText = '保存'; // Default to Simplified Chinese
        saveButton.style.width = '45%';
        saveButton.style.padding = '10px';
        saveButton.style.margin = '10px 5px 0 0';
        saveButton.style.border = 'none';
        saveButton.style.backgroundColor = '#008CBA'; // Changed to teal color
        saveButton.style.color = 'white'; // Changed to white color
        saveButton.style.borderRadius = '3px';
        saveButton.style.cursor = 'pointer';
        saveButton.onclick = () => {
            const domainInputs = document.querySelectorAll('#excludedDomainsList input[type="text"]');
            excludedDomains = Array.from(domainInputs).map(input => input.value.trim()).filter(domain => domain.length > 0);
            GM_setValue('excludedDomains', excludedDomains);
            window.location.reload();
        };
        settingsDiv.appendChild(saveButton);

        const resetButton = document.createElement('button');
        resetButton.id = 'bingResetButton';
        resetButton.innerText = '重置'; // Default to Simplified Chinese
        resetButton.style.width = '45%';
        resetButton.style.padding = '10px';
        resetButton.style.margin = '10px 0 0 5px';
        resetButton.style.border = 'none';
        resetButton.style.backgroundColor = '#008CBA'; // Changed to teal color
        resetButton.style.color = 'white'; // Changed to white color
        resetButton.style.borderRadius = '3px';
        resetButton.style.cursor = 'pointer';
        resetButton.onclick = () => {
            excludedDomains = defaultExcludedDomains;
            GM_setValue('excludedDomains', excludedDomains);
            domainList.innerHTML = ''; // Clear the list

            excludedDomains.forEach(domain => {
                const li = document.createElement('li');
                li.style.display = 'flex';
                li.style.alignItems = 'center';
                li.style.justifyContent = 'space-between'; // Ensure elements are right-aligned
                li.style.marginBottom = '5px';

                const input = document.createElement('input');
                input.type = 'text';
                input.value = domain;
                input.style.width = '250px';
                input.style.padding = '5px';
                input.style.marginRight = '5px';
                input.style.border = '1px solid #ccc';
                input.style.borderRadius = '3px';

                const removeButton = document.createElement('button');
                removeButton.innerText = '删除'; // Default to Simplified Chinese
                removeButton.style.width = '60px'; // 统一设置为60px
                removeButton.style.padding = '5px 10px';
                removeButton.style.border = 'none';
                removeButton.style.backgroundColor = '#008CBA'; // Changed to teal color
                removeButton.style.color = 'white'; // Changed to white color
                removeButton.style.borderRadius = '3px';
                removeButton.style.cursor = 'pointer';
                removeButton.onclick = () => {
                    const index = excludedDomains.indexOf(domain);
                    if (index !== -1) {
                        excludedDomains.splice(index, 1);
                        li.remove();
                        GM_setValue('excludedDomains', excludedDomains);
                    }
                };

                li.appendChild(input);
                li.appendChild(removeButton);
                domainList.appendChild(li);
            });
            window.location.reload();
        };
        settingsDiv.appendChild(resetButton);

        // Detect language and update text accordingly
        const userLang = navigator.language || navigator.userLanguage;
        let localizedTexts = {
            settingsTitle: '排除域名设置',
            addDomainInputPlaceholder: '添加新域名',
            addButton: '添加',
            saveButton: '保存',
            resetButton: '重置',
            removeButton: '删除'
        };

        if (userLang.startsWith('zh')) {
            if (userLang === 'zh-TW') {
                localizedTexts = {
                    settingsTitle: '排除域名設定',
                    addDomainInputPlaceholder: '新增新域名',
                    addButton: '新增',
                    saveButton: '儲存',
                    resetButton: '重置',
                    removeButton: '刪除'
                };
            }
        } else {
            localizedTexts = {
                settingsTitle: 'Excluded Domains Settings',
                addDomainInputPlaceholder: 'Add new domain',
                addButton: 'Add',
                saveButton: 'Save',
                resetButton: 'Reset',
                removeButton: 'Delete'
            };
        }

        settingsTitle.innerText = localizedTexts.settingsTitle;
        addDomainInput.placeholder = localizedTexts.addDomainInputPlaceholder;
        addButton.innerText = localizedTexts.addButton;
        saveButton.innerText = localizedTexts.saveButton;
        resetButton.innerText = localizedTexts.resetButton;

        // 修改：只对非特定ID的按钮设置文本和宽度
        document.querySelectorAll('button').forEach((button, index) => {
            if (button.id !== 'bingSaveButton' && button.id !== 'bingResetButton' && button.id !== 'bingToggleButton') {
                button.innerText = localizedTexts.removeButton;
                button.style.width = '60px'; // 统一设置为60px
            }
        });

        document.body.appendChild(settingsDiv);
    }

    function createToggleButton() {
        const toggleButton = document.createElement('button');
        toggleButton.id = 'bingToggleButton';
        toggleButton.style.position = 'fixed';
        toggleButton.style.bottom = '10px';
        toggleButton.style.right = '10px';
        toggleButton.style.width = '40px';
        toggleButton.style.height = '40px';
        toggleButton.style.borderRadius = '50%';
        toggleButton.style.backgroundColor = '#008CBA';
        toggleButton.style.border = 'none';
        toggleButton.style.color = 'white';
        toggleButton.style.zIndex = '10001';
        toggleButton.innerText = '⚙';
        toggleButton.style.fontSize = '18px';

        toggleButton.onclick = () => {
            const settingsDiv = document.getElementById('bingSettingsUI');
            if (settingsDiv) {
                document.body.removeChild(settingsDiv);
            } else {
                createSettingsUI();
            }
        };
        document.body.appendChild(toggleButton);
    }

    let lastUrl = window.location.href;
    new MutationObserver(() => {
        const currentUrl = window.location.href;
        if (currentUrl !== lastUrl) {
            lastUrl = currentUrl;
            checkAndCleanUrl();
            removeAds();
            window.location.reload();
        }
    }).observe(document, {subtree: true, childList: true, attributes: true, characterData: true});

    checkAndCleanUrl();
    createToggleButton();

    window.onload = () => {
        removeAds();
        removeSpecificDomainResults();
    };
})();