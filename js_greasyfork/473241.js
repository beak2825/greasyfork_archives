// ==UserScript==
// @name         按“/”键打开ChatGPT自定义提示词模板
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automatically expands a styled menu above the input box in OpenAI Chat when "/" or "、" is typed and fills the input with selected option, after clearing the input.
// @author       ChatGPT&Yukon
// @match        https://chat.openai.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/473241/%E6%8C%89%E2%80%9C%E2%80%9D%E9%94%AE%E6%89%93%E5%BC%80ChatGPT%E8%87%AA%E5%AE%9A%E4%B9%89%E6%8F%90%E7%A4%BA%E8%AF%8D%E6%A8%A1%E6%9D%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/473241/%E6%8C%89%E2%80%9C%E2%80%9D%E9%94%AE%E6%89%93%E5%BC%80ChatGPT%E8%87%AA%E5%AE%9A%E4%B9%89%E6%8F%90%E7%A4%BA%E8%AF%8D%E6%A8%A1%E6%9D%BF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const inputBox = document.querySelector("#prompt-textarea");
    let menuVisible = false;
    let menuContainer = null;
    let filteredOptions = {};

    const optionsDict = {
        "测试1": "123456\"7890abc",
        "测试2": "4567890abc\"def",
        "选项3": "xyzabcdef12\"3",
        "选项4": "12345uvwxyz",
        "选项5": "7890efghijk",
        "选项6": "ijklmnopqrs",
        "选项7": "tuvwxyz12\"34",
        "选项8": "5678ijklmno",
        "选项9": "pqrstuvwx",
        "选项10": "yz567890"
        // You can add more options here
    };

    inputBox.addEventListener('input', function(event) {
        const inputValue = inputBox.value.trim();
        if ((inputValue.startsWith('/') || inputValue.startsWith('、')) && !menuVisible) {
            const filterText = inputValue.substring(1).toLowerCase();
            filteredOptions = Object.fromEntries(
                Object.entries(optionsDict).filter(([key]) =>
                    key.toLowerCase().includes(filterText)
                )
            );
            showMenu(filteredOptions);
        } else if ((inputValue !== '/' && inputValue !== '、') && menuVisible) {
            hideMenu();
        }
    });

    inputBox.addEventListener('blur', function(event) {
        if (menuVisible) {
            hideMenu();
        }
    });

    function showMenu(options) {
        hideMenu(); // Close any existing menu
        menuVisible = true;
        menuContainer = document.createElement('div');
        menuContainer.id = 'menu-container';
        menuContainer.style.position = 'absolute';
        menuContainer.style.bottom = '100%';
        menuContainer.style.left = '0';
        menuContainer.style.zIndex = '1000';
        menuContainer.style.backgroundColor = 'rgb(47, 49, 59)';
        menuContainer.style.border = '1px solid #ccc';
        menuContainer.style.display = 'none';
        menuContainer.style.opacity = '0';
        menuContainer.style.borderRadius = '5px';
        menuContainer.style.overflowY = 'auto';
        menuContainer.style.maxHeight = '180px'; // Limit maximum height to 6 rows
        menuContainer.style.transform = 'scale(0.8)';
        menuContainer.style.transformOrigin = 'bottom';
        menuContainer.style.transition = 'opacity 0.3s, transform 0.3s';

        const optionKeys = Object.keys(options);
        for (let i = 0; i < optionKeys.length; i++) {
            if (i >= 6) {
                break; // Limit to 6 rows
            }
            const optionText = optionKeys[i];
            const optionValue = options[optionText];
            const option = createMenuItem(optionText, optionValue);
            menuContainer.appendChild(option);
            if (i < optionKeys.length - 1) {
                const separator = createSeparator();
                menuContainer.appendChild(separator);
            }
        }

        inputBox.parentElement.insertBefore(menuContainer, inputBox);

        setTimeout(() => {
            menuContainer.style.display = 'block';
            setTimeout(() => {
                menuContainer.style.opacity = '1';
                menuContainer.style.transform = 'scale(1)';
            }, 10);
        }, 10);
    }

    function hideMenu() {
        if (!menuVisible) return;

        menuContainer.style.opacity = '0';
        menuContainer.style.transform = 'scale(0.8)';
        setTimeout(() => {
            if (menuContainer) {
                menuContainer.remove();
                menuContainer = null;
                menuVisible = false;
            }
        }, 300);
    }

    function createMenuItem(text, inputValue) {
        const menuItem = document.createElement('div');
        menuItem.style.padding = '5px 10px';
        menuItem.style.cursor = 'pointer';
        menuItem.style.color = 'rgb(250, 230, 158)';
        menuItem.style.backgroundColor = 'rgb(47, 49, 59)';
        menuItem.style.borderRadius = '5px';

        if (inputValue.length > 30) {
            menuItem.textContent = `${text}: ${inputValue.substring(0, 27)}...`;
        } else {
            menuItem.textContent = `${text}: ${inputValue}`;
        }

        menuItem.addEventListener('click', function() {
            inputBox.value = inputValue;
            hideMenu();
        });

        menuItem.addEventListener('mouseover', function() {
            menuItem.style.backgroundColor = 'rgb(107, 108, 123)';
        });

        menuItem.addEventListener('mouseout', function() {
            menuItem.style.backgroundColor = 'rgb(47, 49, 59)';
        });

        return menuItem;
    }

    function createSeparator() {
        const separator = document.createElement('div');
        separator.style.height = '1px';
        separator.style.backgroundColor = '#ccc';
        return separator;
    }
})();
