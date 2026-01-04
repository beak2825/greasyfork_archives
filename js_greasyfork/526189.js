// ==UserScript==
// @name         知乎评论区显示momo/用户唯一ID
// @namespace    https://zhufn.fun
// @version      1.8
// @license      AGPL3
// @description  可配置显示所有用户id或只显示指定用户名(如momo)的。可切换使用人类可读id（需发送请求，可能有反爬）或一串16进制id
// @author       zhufengning
// @match        https://www.zhihu.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/526189/%E7%9F%A5%E4%B9%8E%E8%AF%84%E8%AE%BA%E5%8C%BA%E6%98%BE%E7%A4%BAmomo%E7%94%A8%E6%88%B7%E5%94%AF%E4%B8%80ID.user.js
// @updateURL https://update.greasyfork.org/scripts/526189/%E7%9F%A5%E4%B9%8E%E8%AF%84%E8%AE%BA%E5%8C%BA%E6%98%BE%E7%A4%BAmomo%E7%94%A8%E6%88%B7%E5%94%AF%E4%B8%80ID.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let targetName = GM_getValue('targetName', 'momo');
    let showAllUsers = GM_getValue('showAllUsers', false);
    let fetchHumanReadable = GM_getValue('fetchHumanReadable', true);
    let userIdCache = GM_getValue('userIdCache', {});
    let maxIdLength = GM_getValue('maxIdLength', 4);

    function saveUserIdCache() {
        GM_setValue('userIdCache', userIdCache);
    }

    function clearUserIdCache() {
        userIdCache = {};
        GM_setValue('userIdCache', userIdCache);
        alert('已清除用户ID缓存');
    }

    function fetchHumanReadableID(userId, callback) {
        if (!fetchHumanReadable) {
            callback(userId.substring(0, maxIdLength));
            return;
        }

        if (userIdCache[userId]) {
            callback(userIdCache[userId]);
            return;
        }

        GM_xmlhttpRequest({
            method: 'GET',
            url: `https://www.zhihu.com/people/${userId}`,
            onload: function(response) {
                try {
                    const jsonMatch = response.responseText.match(/<script id="js-initialData" type="text\/json">(.*?)<\/script>/);
                    if (jsonMatch) {
                        const jsonData = JSON.parse(jsonMatch[1]);
                        const profileStatus = jsonData?.initialState?.people?.profileStatus;
                        if (profileStatus) {
                            const userKey = Object.keys(profileStatus)[0];
                            const urlToken = profileStatus[userKey]?.token?.urlToken;
                            if (urlToken) {
                                userIdCache[userId] = urlToken;
                                saveUserIdCache();
                                callback(urlToken);
                                return;
                            }
                        }
                    }
                    callback(userId);
                } catch (error) {
                    console.error('Error parsing profile response:', error);
                    callback(userId.substring(0, maxIdLength));
                }
            },
            onerror: function() {
                callback(userId.substring(0, maxIdLength));
            }
        });
    }

    function appendUserId() {
        document.querySelectorAll('a[href^="https://www.zhihu.com/people/"], a.UserLink-link').forEach(anchor => {
            if (anchor.children.length > 0) {
                return;
            }

            const match = anchor.href.match(/people\/([a-zA-Z0-9\-]+)/);
            if (match) {
                const userId = match[1];

                if (showAllUsers || anchor.textContent.trim() === targetName) {
                    fetchHumanReadableID(userId, (humanReadableId) => {
                        if (!anchor.nextElementSibling || !anchor.nextElementSibling.classList.contains('zhihu-user-id')) {
                            const span = document.createElement('span');
                            span.textContent = ` ${humanReadableId}`;
                            span.style.color = 'blue';
                            span.style.border = '1px solid blue';
                            span.style.padding = '2px 5px';
                            span.style.marginLeft = '5px';
                            span.style.borderRadius = '3px';
                            span.classList.add('zhihu-user-id');
                            anchor.after(span);
                        }
                    });
                }
            }
        });
        
    }

    function setUserName() {
        const newName = prompt('请输入要匹配的用户名：', targetName);
        if (newName) {
            GM_setValue('targetName', newName);
            targetName = newName;
            alert(`当前匹配的用户名: ${targetName}`);
            appendUserId();
        }
    }

    function toggleShowAllUsers() {
        showAllUsers = !showAllUsers;
        GM_setValue('showAllUsers', showAllUsers);
        alert(`显示所有用户ID: ${showAllUsers ? '开启' : '关闭'}`);
        appendUserId();
    }

    function toggleFetchHumanReadable() {
        fetchHumanReadable = !fetchHumanReadable;
        GM_setValue('fetchHumanReadable', fetchHumanReadable);
        alert(`提取人类可读ID: ${fetchHumanReadable ? '开启' : '关闭'}`);
        appendUserId();
    }

    function setMaxIdLength() {
        const newLength = prompt('请输入ID最大显示长度（当前：' + maxIdLength + '）：', maxIdLength);
        if (newLength && !isNaN(newLength)) {
            maxIdLength = parseInt(newLength);
            GM_setValue('maxIdLength', maxIdLength);
            alert(`ID最大显示长度已设置为: ${maxIdLength}`);
            appendUserId();
        }
    }

    GM_registerMenuCommand(`设置匹配的用户名（当前: ${targetName}）`, setUserName);
    GM_registerMenuCommand(`切换是否显示所有用户ID（当前: ${showAllUsers ? '开启' : '关闭'}）`, toggleShowAllUsers);
    GM_registerMenuCommand(`切换是否提取人类可读ID（当前: ${fetchHumanReadable ? '开启' : '关闭'}）`, toggleFetchHumanReadable);
    GM_registerMenuCommand(`设置Hex ID最大显示长度（当前: ${maxIdLength}）`, setMaxIdLength);
    GM_registerMenuCommand(`清除用户ID缓存`, clearUserIdCache);

    const observer = new MutationObserver(appendUserId);
    observer.observe(document.body, { childList: true, subtree: true });
    appendUserId();
})();
