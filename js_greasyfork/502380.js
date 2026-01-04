// ==UserScript==
// @name         自动搜索油叉脚本
// @namespace    http://tampermonkey.net/
// @version      0.6.2
// @description  根据当前网页的域名自动在 Greasy Fork 上搜索脚本，并显示可移动的按钮，支持设置语言限制和搜索引擎
// @author       OB_BUFF
// @license      CC BY-NC-ND 4.0
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?domain=greasyfork.org
// @grant        GM_openInTab
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/502380/%E8%87%AA%E5%8A%A8%E6%90%9C%E7%B4%A2%E6%B2%B9%E5%8F%89%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/502380/%E8%87%AA%E5%8A%A8%E6%90%9C%E7%B4%A2%E6%B2%B9%E5%8F%89%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取当前网页的域名
    var domain = window.location.hostname;

    // 获取按钮显示设置
    var showButton = GM_getValue('showButton', true);

    // 获取用户设置
    var useLanguageRestriction = GM_getValue('useLanguageRestriction', false);
    var selectedSearchEngine = GM_getValue('selectedSearchEngine', 'greasyfork');

    // 创建按钮
    var button = document.createElement('div');
    button.style.position = 'fixed';
    button.style.bottom = '10px';
    button.style.right = '10px';
    button.style.width = '100px';
    button.style.height = '30px';
    button.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    button.style.color = 'white';
    button.style.textAlign = 'center';
    button.style.lineHeight = '30px';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    button.style.zIndex = '9999';
    button.innerText = '搜索脚本';
    button.style.display = showButton ? 'block' : 'none';

    // 鼠标悬停和离开效果
    button.onmouseover = function() {
        button.style.backgroundColor = 'rgba(0, 0, 0, 1)';
    };
    button.onmouseout = function() {
        button.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    };

    let isDragging = false;

    // 按钮点击事件
    button.onclick = function() {
        if (!isDragging) {
            var searchURL;
            if (selectedSearchEngine === 'greasyfork') {
                searchURL = `https://greasyfork.org/zh-CN/scripts/by-site/${domain}${useLanguageRestriction ? '?filter_locale=0' : ''}`;
            } else if (selectedSearchEngine === 'sleazyfork') {
                searchURL = `https://sleazyfork.org/zh-CN/scripts/by-site/${domain}${useLanguageRestriction ? '?filter_locale=0' : ''}`;
            }
            GM_openInTab(searchURL, { active: true });
        }
    };

    // 使按钮可移动
    button.onmousedown = function(event) {
        isDragging = false;
        var shiftX = event.clientX - button.getBoundingClientRect().left;
        var shiftY = event.clientY - button.getBoundingClientRect().top;

        function moveAt(pageX, pageY) {
            isDragging = true;
            button.style.left = pageX - shiftX + 'px';
            button.style.top = pageY - shiftY + 'px';
        }

        function onMouseMove(event) {
            moveAt(event.pageX, event.pageY);
        }

        document.addEventListener('mousemove', onMouseMove);

        button.onmouseup = function() {
            document.removeEventListener('mousemove', onMouseMove);
            button.onmouseup = null;
        };
    };

    button.ondragstart = function() {
        return false;
    };

    document.body.appendChild(button);

    // 创建设置窗口
    var settingsWindow = document.createElement('div');
    settingsWindow.style.position = 'fixed';
    settingsWindow.style.bottom = '50px';
    settingsWindow.style.right = '10px';
    settingsWindow.style.width = '220px';
    settingsWindow.style.height = '150px';
    settingsWindow.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    settingsWindow.style.color = 'white';
    settingsWindow.style.padding = '10px';
    settingsWindow.style.borderRadius = '5px';
    settingsWindow.style.display = 'none';
    settingsWindow.style.zIndex = '10000';

    // 创建关闭按钮
    var closeButton = document.createElement('span');
    closeButton.style.position = 'absolute';
    closeButton.style.top = '5px';
    closeButton.style.right = '10px';
    closeButton.style.cursor = 'pointer';
    closeButton.innerHTML = '&#10005;';
    closeButton.onclick = function() {
        settingsWindow.style.display = 'none';
    };
    settingsWindow.appendChild(closeButton);

    var languageCheckbox = document.createElement('input');
    languageCheckbox.type = 'checkbox';
    languageCheckbox.checked = useLanguageRestriction;
    languageCheckbox.onchange = function() {
        useLanguageRestriction = languageCheckbox.checked;
        GM_setValue('useLanguageRestriction', useLanguageRestriction);
    };
    settingsWindow.appendChild(languageCheckbox);

    var languageLabel = document.createElement('label');
    languageLabel.innerText = ' 启用语言限制';
    settingsWindow.appendChild(languageLabel);

    settingsWindow.appendChild(document.createElement('br'));

    var engineLabel = document.createElement('label');
    engineLabel.innerText = '选择搜索引擎:';
    settingsWindow.appendChild(engineLabel);

    settingsWindow.appendChild(document.createElement('br'));

    var greasyforkOption = document.createElement('input');
    greasyforkOption.type = 'radio';
    greasyforkOption.name = 'searchEngine';
    greasyforkOption.value = 'greasyfork';
    greasyforkOption.checked = selectedSearchEngine === 'greasyfork';
    greasyforkOption.onchange = function() {
        selectedSearchEngine = 'greasyfork';
        GM_setValue('selectedSearchEngine', selectedSearchEngine);
    };
    settingsWindow.appendChild(greasyforkOption);

    var greasyforkLabel = document.createElement('label');
    greasyforkLabel.innerText = ' Greasy Fork';
    settingsWindow.appendChild(greasyforkLabel);

    settingsWindow.appendChild(document.createElement('br'));

    var sleazyforkOption = document.createElement('input');
    sleazyforkOption.type = 'radio';
    sleazyforkOption.name = 'searchEngine';
    sleazyforkOption.value = 'sleazyfork';
    sleazyforkOption.checked = selectedSearchEngine === 'sleazyfork';
    sleazyforkOption.onchange = function() {
        selectedSearchEngine = 'sleazyfork';
        GM_setValue('selectedSearchEngine', selectedSearchEngine);
    };
    settingsWindow.appendChild(sleazyforkOption);

    var sleazyforkLabel = document.createElement('label');
    sleazyforkLabel.innerText = ' Sleazy Fork';
    settingsWindow.appendChild(sleazyforkLabel);

    document.body.appendChild(settingsWindow);

    // 注册菜单命令
    GM_registerMenuCommand('显示/隐藏搜索按钮', function() {
        showButton = !showButton;
        button.style.display = showButton ? 'block' : 'none';
        GM_setValue('showButton', showButton);
    });

    GM_registerMenuCommand('设置搜索选项', function() {
        settingsWindow.style.display = settingsWindow.style.display === 'none' ? 'block' : 'none';
    });

})();
