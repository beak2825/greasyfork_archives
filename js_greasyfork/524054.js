// ==UserScript==
// @name         hsptv_forum_mute-plus
// @namespace    https://github.com/ze-n-a
// @version      1.1.2
// @description  HSPTV!掲示板のミュート機能です
// @author       ze-n-a
// @match        https://hsp.tv/play/pforum.php*
// @icon         https://hsp.tv/favicon.ico
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/524054/hsptv_forum_mute-plus.user.js
// @updateURL https://update.greasyfork.org/scripts/524054/hsptv_forum_mute-plus.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const defaultMuteList = `ユーザ名1
ユーザ名2
ユーザ名3`;
    let muteUserList = GM_getValue('muteUserList', defaultMuteList)
        .split(/\r?\n/)
        .map(pattern => pattern.trim())
        .filter(pattern => pattern.length > 0)
        .map(pattern => new RegExp(pattern));
    let isMuteDisabled = GM_getValue('isMuteDisabled', false);
    function saveMuteList(newList, muteDisabled) {
        const trimmedList = newList.trim().split(/\r?\n/)
            .map(pattern => pattern.trim())
            .filter(pattern => pattern.length > 0);
        GM_setValue('muteUserList', trimmedList.join('\n'));
        GM_setValue('isMuteDisabled', muteDisabled);
        muteUserList = trimmedList.map(pattern => new RegExp(pattern));
        isMuteDisabled = muteDisabled;
        location.reload();
    }
    function createMuteListUI() {
        const container = document.createElement('div');
        container.id = 'muteListContainer';
        container.style = `
            position: fixed;
            top: 10px;
            right: 10px;
            width: 250px;
            height: 350px;
            background-color: white;
            border: 1px solid gray;
            padding: 10px;
            z-index: 10000;
            display: none;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            border-radius: 10px;
        `;
        const title = document.createElement('h3');
        title.textContent = 'Mute Keywords and Usernames';
        title.style = `
            margin: 0;
            font-size: 14px;
            font-weight: bold;
            text-align: center;
        `;
        const label = document.createElement('p');
        label.textContent = '正規表現で記入して下さい';
        label.style = `
            margin: 5px 0;
            font-size: 12px;
            color: gray;
        `;
        const textarea = document.createElement('textarea');
        textarea.style = `
            width: 100%;
            height: 200px;
            border: 1px solid gray;
            border-radius: 5px;
            resize: none;
        `;
        textarea.value = GM_getValue('muteUserList', defaultMuteList);
        const checkboxLabel = document.createElement('label');
        checkboxLabel.style = `
            display: block;
            margin-top: 10px;
            font-size: 14px;
        `;
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = isMuteDisabled;
        checkbox.style.marginRight = '5px';
        checkboxLabel.appendChild(checkbox);
        checkboxLabel.appendChild(document.createTextNode('キーワードミュートをしない'));
        const saveButton = document.createElement('button');
        saveButton.textContent = '保存';
        saveButton.style.margin = '5px';
        saveButton.onclick = () => saveMuteList(textarea.value, checkbox.checked);
        const closeButton = document.createElement('button');
        closeButton.textContent = '閉じる';
        closeButton.style.margin = '5px';
        closeButton.onclick = () => {
            container.style.display = 'none';
        };
        container.appendChild(title);
        container.appendChild(label);
        container.appendChild(textarea);
        container.appendChild(checkboxLabel);
        container.appendChild(saveButton);
        container.appendChild(closeButton);
        document.body.appendChild(container);
    }
    function createToggleButton() {
        const button = document.createElement('div');
        button.id = 'muteToggleButton';
        button.style = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            background-color: #60aaa0;
            color: white;
            border-radius: 50%;
            text-align: center;
            line-height: 50px;
            cursor: pointer;
            z-index: 10000;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        `;
        button.textContent = 'M';
        button.onclick = () => {
            const container = document.getElementById('muteListContainer');
            container.style.display = container.style.display === 'none' ? 'block' : 'none';
        };
        document.body.appendChild(button);
    }
    createMuteListUI();
    createToggleButton();
    function replaceMutedUserNames() {
        const currentURL = window.location.href;
        const isTargetURL = /^https:\/\/hsp\.tv\/play\/pforum\.php(\?|$)/.test(currentURL) &&
                            (!currentURL.includes('mode=') ||
                             currentURL.includes('mode=all') ||
                             currentURL.includes('mode=pastwch'));
        if (!isTargetURL) return;
        const tables = document.querySelectorAll('table[width="800"]');
        if (tables.length < 3) return;
        const targetTable = tables[2];
        const userElements = targetTable.querySelectorAll('.date + .text');
        userElements.forEach(element => {
            const userName = element.textContent.trim();
            if (muteUserList.some(regex => regex.test(userName))) {
                element.textContent = '[ミュート]';
            }
        });
    }
    function replaceMutedUserNames2() {
        const currentURL = window.location.href;
        const isTargetURL = /^https:\/\/hsp\.tv\/play\/pforum\.php\?mode=/.test(currentURL);
        if (!isTargetURL) return;
        const mainTable = document.querySelectorAll('table[width="800"]')[2];
        if (!mainTable) return;
        const articles = mainTable.querySelectorAll('table[width="756"]');
        articles.forEach(article => {
            const userInfo = article.querySelector('#info table[width="130"] td p');
            if (!userInfo) return;
            const username = userInfo.textContent.trim();
            const isMutedUser = muteUserList.some(regex => regex.test(username));
            if (isMutedUser) {
                const infoDiv = article.querySelector('#info');
                if (infoDiv) {
                    infoDiv.remove();
                }
                const articleContent = article.querySelector('div.main');
                if (articleContent) {
                    articleContent.textContent = 'ミュートユーザの記事です';
                }
            } else {
                if (!isMuteDisabled) {
                    const articleContent = article.querySelector('div.main');
                    if (articleContent) {
                        muteUserList.forEach(pattern => {
                            const regex = new RegExp(pattern.source, 'g');
                            articleContent.innerHTML = articleContent.innerHTML.replace(regex, '[ミュート]');
                        });
                    }
                }
            }
        });
    }
    replaceMutedUserNames();
    replaceMutedUserNames2();
})();
