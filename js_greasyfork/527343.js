// ==UserScript==
// @name         水木过滤器v1.0
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  屏蔽水木指定用户的帖子，可对用户点赞和备注
// @author
// @match        *://*.newsmth.net/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527343/%E6%B0%B4%E6%9C%A8%E8%BF%87%E6%BB%A4%E5%99%A8v10.user.js
// @updateURL https://update.greasyfork.org/scripts/527343/%E6%B0%B4%E6%9C%A8%E8%BF%87%E6%BB%A4%E5%99%A8v10.meta.js
// ==/UserScript==

/*
功能：
1. 隐藏用户：隐藏后，该用户的所有帖子都只能看到标题，不能看到内容。眼不见为静。
2. 点赞：用于记录自己对该用户的好评度。
3. 备注：添加额外的备注。

4.附加功能：方向键上下左右，可以滚动页面，前后翻页
*/

(function() {
    'use strict';

    // 全局布尔变量，控制功能开关
    var enableAutoRefresh = false; // 是否启用自动刷新功能
    var enableKeyboardNavigation = true; // 是否启用键盘方向键功能


    function initScript() {

        const MAX_NOTE_LENGTH = 100; // 备注的最大字数

        function getStorageData(key) {
            return GM_getValue(key);
        }

        function setStorageData(key, value) {
            GM_setValue(key, value);
        }

        const hiddenUsersKey = 'hiddenUsers';
        const likeCountsKey = 'likeCounts';

        let hiddenUsers = {};
        let likeCounts = {};

        // 初始化数据
        hiddenUsers = getStorageData(hiddenUsersKey) || {};
        updatePostVisibility();
        updateLikeListVisibility();

        likeCounts = getStorageData(likeCountsKey) || {};
        updateLikeDisplays();

        function hideUser(username) {
            hiddenUsers[username] = true;
            setStorageData(hiddenUsersKey, hiddenUsers);
            updatePostVisibility();
            updateLikeListVisibility();
        }

        function showUser(username) {
            delete hiddenUsers[username];
            setStorageData(hiddenUsersKey, hiddenUsers);
            updatePostVisibility();
            updateLikeListVisibility();
        }

        function updateLikeCount(username, delta) {
            if (likeCounts[username] === undefined) {
                likeCounts[username] = delta;
            } else {
                likeCounts[username] += delta;
            }
            setStorageData(likeCountsKey, likeCounts);
            updateLikeDisplay(username);
        }

        function updateLikeDisplay(username) {
            const posts = document.querySelectorAll('.a-wrap');
            posts.forEach(post => {
                const postUsername = post.querySelector('.a-u-name a').textContent;
                if (postUsername === username) {
                    const likeCountSpan = post.querySelector('.like-count-span');
                    if (likeCountSpan) {
                        const count = likeCounts[username];
                        if (count === undefined) {
                            likeCountSpan.textContent = '无';
                            likeCountSpan.style.color = 'gray';
                        } else {
                            likeCountSpan.textContent = count;
                            if (count > 0) {
                                likeCountSpan.style.color = 'green';
                            } else if (count < 0) {
                                likeCountSpan.style.color = 'red';
                            } else {
                                likeCountSpan.style.color = 'black';
                            }
                        }
                    }
                }
            });
        }

        function updateLikeDisplays() {
            const usernames = Object.keys(likeCounts);
            usernames.forEach(username => {
                updateLikeDisplay(username);
            });
        }

        function updateNoteDisplay(username) {
            const posts = document.querySelectorAll('.a-wrap');
            posts.forEach(post => {
                const postUsername = post.querySelector('.a-u-name a').textContent;
                if (postUsername === username) {
                    const noteButton = post.querySelector('.note-button');
                    if (noteButton) {
                        let note = getStorageData(`note_${username}`) || '';
                        // 去除空白字符
                        let trimmedNote = note.replace(/\s/g, '');
                        if (trimmedNote.length > 0) {
                            noteButton.textContent = '备注*';
                        } else {
                            noteButton.textContent = '备注';
                        }
                    }
                }
            });
        }

        function updatePostVisibility() {
            const posts = document.querySelectorAll('.a-wrap');
            posts.forEach(post => {
                const username = post.querySelector('.a-u-name a').textContent;
                const isHidden = hiddenUsers[username];

                if (isHidden) {
                    const rows = post.querySelectorAll('.article tr');
                    for (let i = 1; i < rows.length; i++) {
                        rows[i].style.display = 'none';
                    }
                } else {
                    const rows = post.querySelectorAll('.article tr');
                    for (let i = 1; i < rows.length; i++) {
                        rows[i].style.display = '';
                    }
                }

                // 更新点赞数显示
                updateLikeDisplay(username);

                // 更新备注按钮显示
                updateNoteDisplay(username);

                // 更新“隐藏/显示”按钮文本和提示
                const hideButton = post.querySelector('.hide-show-button');
                if (hideButton) {
                    hideButton.textContent = isHidden ? '显示' : '隐藏';
                    hideButton.title = isHidden ? '显示该用户的所有帖子' : '隐藏该用户的所有帖子';
                }

            });
        }

        // 修改后的函数，更新点赞列表的可见性
        function updateLikeListVisibility() {
            const likeItems = document.querySelectorAll('.like_list li');
            likeItems.forEach(item => {
                const usernameSpan = item.querySelector('.like_user');
                if (usernameSpan) {
                    let usernameText = usernameSpan.textContent.trim();
                    // 去掉末尾的冒号
                    if (usernameText.endsWith(':')) {
                        usernameText = usernameText.slice(0, -1);
                    }
                    const isHidden = hiddenUsers[usernameText];

                    // 获取 like_msg 元素
                    const likeMsgSpan = item.querySelector('.like_msg');

                    if (isHidden) {
                        // 隐藏 like_msg
                        if (likeMsgSpan) likeMsgSpan.style.display = 'none';
                    } else {
                        // 显示 like_msg
                        if (likeMsgSpan) likeMsgSpan.style.display = '';
                    }

                    // 更新隐藏按钮文本和提示
                    const hideButton = item.querySelector('.hide-like-user-button');
                    if (hideButton) {
                        hideButton.textContent = isHidden ? '显' : '隐';
                        hideButton.title = isHidden ? `显示用户 ${usernameText} 的所有帖子` : `隐藏用户 ${usernameText} 的所有帖子`;
                    }
                }
            });
        }

        function checkAndRun() {

            const posts = document.querySelectorAll('.a-wrap');

            if (posts.length > 0) {
                posts.forEach(post => {
                    const username = post.querySelector('.a-u-name a').textContent;

                    const posSpan = post.querySelector('.a-pos');
                    if (posSpan && !post.querySelector('.hide-show-button')) {
                        // 创建按钮容器
                        const newButtonsContainer = document.createElement('ul');
                        newButtonsContainer.style.cssText = 'float: right; margin-right: 10px;';

                        // 添加“隐藏/显示”按钮
                        let hideButton = document.createElement('li');
                        hideButton.style.cssText = 'display: inline-block;margin-right: 10px;';
                        hideButton.innerHTML = `<a href="#" class="hide-show-button" style="font-size: 12px;color:#2244bb;padding-right: 5px;padding-top: 2px;">Loading...</a>`;
                        hideButton.addEventListener('click', (event) => {
                            event.preventDefault();
                            if (hiddenUsers[username]) {
                                showUser(username);
                            } else {
                                hideUser(username);
                            }
                        });
                        newButtonsContainer.appendChild(hideButton);

                        // 添加“点赞”按钮
                        let thumbsUpButton = document.createElement('li');
                        thumbsUpButton.style.cssText = 'display: inline-block;margin-right: 3px;';
                        thumbsUpButton.innerHTML = `<a href="#" style='font-size: 16px;color:#2244bb;padding-right: 5px;padding-top: 2px;' title="点赞">&#128077;</a>`;
                        thumbsUpButton.addEventListener('click', (event) => {
                            event.preventDefault();
                            updateLikeCount(username, 1);
                        });
                        newButtonsContainer.appendChild(thumbsUpButton);

                        // 添加“点赞数”显示
                        let likeCountItem = document.createElement('li');
                        likeCountItem.style.cssText = 'display: inline-block;margin-right: 3px;';
                        let likeCountSpan = document.createElement('span');
                        likeCountSpan.className = 'like-count-span';
                        likeCountSpan.style.cssText = 'font-size: 12px;padding-top: 2px;';
                        likeCountSpan.title = '点赞数';
                        likeCountItem.appendChild(likeCountSpan);
                        newButtonsContainer.appendChild(likeCountItem);

                        // 初始化点赞数显示
                        const count = likeCounts[username];
                        if (count === undefined) {
                            likeCountSpan.textContent = '无';
                            likeCountSpan.style.color = 'gray';
                        } else {
                            likeCountSpan.textContent = count;
                            if (count > 0) {
                                likeCountSpan.style.color = 'green';
                            } else if (count < 0) {
                                likeCountSpan.style.color = 'red';
                            } else {
                                likeCountSpan.style.color = 'black';
                            }
                        }

                        // 添加“点踩”按钮
                        let thumbsDownButton = document.createElement('li');
                        thumbsDownButton.style.cssText = 'display: inline-block;margin-right: 10px;';
                        thumbsDownButton.innerHTML = `<a href="#" style='font-size: 16px;color:#2244bb;padding-right: 5px;padding-top: 2px;' title="点踩">&#128078;</a>`;
                        thumbsDownButton.addEventListener('click', (event) => {
                            event.preventDefault();
                            updateLikeCount(username, -1);
                        });
                        newButtonsContainer.appendChild(thumbsDownButton);

                        // 添加“备注”按钮
                        let noteButton = document.createElement('li');
                        noteButton.style.cssText = 'display: inline-block;margin-right: 10px;';
                        noteButton.innerHTML = `<a href="#" class="note-button" style='font-size: 12px;color:#2244bb;padding-right: 5px;padding-top: 2px;' title="为该用户添加备注">备注</a>`;
                        noteButton.addEventListener('click', (event) => {
                            event.preventDefault();
                            let note = getStorageData(`note_${username}`) || '';
                            let newNote = prompt(`请输入备注信息 (最多${MAX_NOTE_LENGTH}个字):`, note);
                            if (newNote !== null) {
                                if (newNote.length > MAX_NOTE_LENGTH) {
                                    newNote = newNote.substring(0, MAX_NOTE_LENGTH);
                                    alert(`备注已超过${MAX_NOTE_LENGTH}个字，已被截断。`);
                                }
                                setStorageData(`note_${username}`, newNote);
                                updateNoteDisplay(username); // 更新备注按钮显示
                            }
                        });
                        newButtonsContainer.appendChild(noteButton);

                        // 将按钮容器插入到页面中
                        posSpan.parentNode.insertBefore(newButtonsContainer, posSpan.nextSibling);
                    }

                    // 添加点赞列表中的隐藏按钮
                    if (post.querySelector('.like_list')) {
                        const likeItems = post.querySelectorAll('.like_list li');
                        likeItems.forEach(item => {
                            const usernameSpan = item.querySelector('.like_user');
                            if (usernameSpan) {
                                // 防止重复添加
                                if (!item.querySelector('.hide-like-user-button')) {
                                    let usernameText = usernameSpan.textContent.trim();
                                    // 去掉末尾的冒号
                                    if (usernameText.endsWith(':')) {
                                        usernameText = usernameText.slice(0, -1);
                                    }

                                    // 创建“隐藏”按钮
                                    let hideButton = document.createElement('span');
                                    hideButton.className = 'hide-like-user-button';
                                    hideButton.style.cssText = 'font-size: 12px;color:#2244bb;cursor:pointer;margin-right:5px;';
                                    hideButton.textContent = '隐';
                                    hideButton.title = `隐藏用户 ${usernameText} 的所有帖子`;

                                    hideButton.addEventListener('click', (event) => {
                                        event.preventDefault();
                                        if (hiddenUsers[usernameText]) {
                                            showUser(usernameText);
                                        } else {
                                            hideUser(usernameText);
                                        }
                                    });

                                    // 将隐藏按钮插入到 like_score 和 like_user 之间
                                    const likeScoreSpan = item.querySelector('span[class^="like_score_"]');
                                    item.insertBefore(hideButton, likeScoreSpan);

                                    // 更新按钮文本
                                    const isHidden = hiddenUsers[usernameText];
                                    hideButton.textContent = isHidden ? '显' : '隐';
                                    hideButton.title = isHidden ? `显示用户 ${usernameText} 的所有帖子` : `隐藏用户 ${usernameText} 的所有帖子`;

                                    // 根据是否隐藏，更新 like_msg 的显示
                                    const likeMsgSpan = item.querySelector('.like_msg');
                                    if (likeMsgSpan) {
                                        likeMsgSpan.style.display = isHidden ? 'none' : '';
                                    }
                                }
                            }
                        });
                    }
                });

                updatePostVisibility();
                updateLikeListVisibility();
            }

            setTimeout(checkAndRun, 500);
        }

        checkAndRun();

        // 以下是其他功能代码，例如自动刷新和键盘映射

        // 初始化刷新时间
        function initRefreshTime() {
            if (getStorageData('refreshTime') === undefined) {
                setStorageData('refreshTime', Date.now());
            }
        }

        function refreshPage() {
            if (enableAutoRefresh) {
                let refreshTime = getStorageData('refreshTime');
                var now = Date.now();
                // 5分钟刷新状态一次
                if (now > refreshTime + 300000) {
                    setStorageData('refreshTime', now);
                    fetch(location.href, {
                        method: 'GET',
                        credentials: 'include'
                    }).then(response => {
                        if (response.ok) {
                            console.log("页面已刷新");
                        }
                    }).catch(error => {
                        console.error("刷新页面时出错:", error);
                    });
                }
            }
        }

        if (enableAutoRefresh) {
            initRefreshTime();
            setInterval(refreshPage, 30000); // 每30秒检查一次
        }

        // 绑定键盘左右箭头键，实现翻页功能

        function keyMapping() {
            if (enableKeyboardNavigation) {
                document.addEventListener("keydown", (event) => {
                    if (event.target.tagName.toLowerCase() === 'input' || event.target.tagName.toLowerCase() === 'textarea') {
                        // 如果焦点在输入框或文本域中，不执行键盘映射
                        return;
                    }
                    switch (event.key) {
                        case "ArrowLeft":
                            navigateLeft();
                            break;
                        case "ArrowRight":
                            navigateRight();
                            break;
                        case "ArrowUp":
                            pageUp();
                            break;
                        case "ArrowDown":
                            pageDown();
                            break;
                    }
                });
            }
        }

        function navigateLeft() {
            var x = document.querySelector("ol.page-main > li:first-child > a");
            if (x) {
                x.click();
            }
        }

        function navigateRight() {
            var x = document.querySelector("ol.page-main > li:last-child > a");
            if (x) {
                x.click();
            }
        }

        // 上/下箭头键模拟 Page Up 和 Page Down

        function pageUp() {
            window.scrollBy(0, -window.innerHeight*0.5);
        }

        function pageDown() {
            window.scrollBy(0, window.innerHeight*0.5);
        }

        if (enableKeyboardNavigation) {
            keyMapping();
        }


    }

    initScript();
})();