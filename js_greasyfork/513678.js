// ==UserScript==
// @name         浏览器网页英文翻译辅助工具（按ALT显示翻译框）
// @namespace    http://tampermonkey.net/
// @version      v1.4
// @description  按ALT键显示鼠标悬停位置的翻译框，按CTRL+S保存翻译内容和URL到 Edge浏览器中的localStorage
// @author       lyz
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/513678/%E6%B5%8F%E8%A7%88%E5%99%A8%E7%BD%91%E9%A1%B5%E8%8B%B1%E6%96%87%E7%BF%BB%E8%AF%91%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7%EF%BC%88%E6%8C%89ALT%E6%98%BE%E7%A4%BA%E7%BF%BB%E8%AF%91%E6%A1%86%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/513678/%E6%B5%8F%E8%A7%88%E5%99%A8%E7%BD%91%E9%A1%B5%E8%8B%B1%E6%96%87%E7%BF%BB%E8%AF%91%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7%EF%BC%88%E6%8C%89ALT%E6%98%BE%E7%A4%BA%E7%BF%BB%E8%AF%91%E6%A1%86%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let elements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, div');
    let inputBoxes = [];
    let lastHoveredElement = null;

    function getStorageKey() {
        let url = window.location.href;
        return url.replace(/^https?:\/\//, '').replace(/[\/:*?"<>|]/g, '_');
    }

    function loadSavedTranslations() {
        let storageKey = getStorageKey();
        let savedData = localStorage.getItem(storageKey);
        if (savedData) {
            let data = JSON.parse(savedData);
            if (data && data.translations) {
                inputBoxes.forEach((item, index) => {
                    if (data.translations[index]) {
                        item.inputBox.value = data.translations[index];
                    }
                });
            }
        }
    }

    function initializeInputBoxes() {
        elements.forEach(function(element, index) {
            let inputBox = document.createElement('textarea');
            inputBox.style.width = '100%';
            inputBox.style.height = '80px';
            inputBox.placeholder = '在此输入你的中文翻译';

            inputBox.style.backgroundColor = '#000';
            inputBox.style.color = '#00FF00';
            inputBox.style.display = 'none';

            element.parentNode.insertBefore(inputBox, element.nextSibling);

            inputBoxes.push({
                element: element,
                inputBox: inputBox
            });

            element.addEventListener('mouseenter', function() {
                lastHoveredElement = element;
            });
        });

        loadSavedTranslations();
    }

    document.addEventListener('keydown', function(event) {
        if (event.altKey) {
            event.preventDefault();

            if (lastHoveredElement) {
                inputBoxes.forEach(function(item) {
                    if (item.element === lastHoveredElement) {
                        if (item.inputBox.style.display === 'none') {
                            item.inputBox.style.display = 'block';
                        } else {
                            item.inputBox.style.display = 'none';
                        }
                    }
                });
            }
        }
    });

    document.addEventListener('keydown', function(event) {
        if (event.ctrlKey && event.key === 's') {
            event.preventDefault();

            let translations = [];

            inputBoxes.forEach(function(item) {
                translations.push(item.inputBox.value);
            });

            let storageKey = getStorageKey();
            let url = window.location.href;

            let fileContent = {
                url: url,
                translations: translations
            };
            localStorage.setItem(storageKey, JSON.stringify(fileContent));
            console.log('翻译内容和URL已自动保存到 localStorage');
        }
    });

    initializeInputBoxes();
})();
