// ==UserScript==
// @name         链滴社区优化
// @namespace    http://tampermonkey.net/
// @version      0.0.9
// @description  优化内容：1. 标记打赏用户和黑名单用户；2. 当前窗口打开链接；3.首页标签增加优选、最新回帖、代码片段、创造、新发布、EN等按钮；4.标签、最新、文档列表页显示文档数和分页分割线；5.链滴自动跳转；6. 聊天页面字体大小；7.聊天页面按日期增加分割线和；8.聊天页面右侧按日期增加跳转日期列表
// @author       Wilson
// @match        https://ld246.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ld246.com
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533009/%E9%93%BE%E6%BB%B4%E7%A4%BE%E5%8C%BA%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/533009/%E9%93%BE%E6%BB%B4%E7%A4%BE%E5%8C%BA%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 全局样式
    GM_addStyle(`
        /* 评论字体大小 */
        .comment2Content{font-size:15px;}
    `);

    // 全局变量和函数
    // 数组去重函数
    const uniqueArray = (array)=>[...new Set(array)];
    const isDark = !!document.querySelector('.html--dark');

    // 管理帖子和管理发帖
    if (location.href.indexOf("ld246.com/update")!==-1 || location.href.indexOf("ld246.com/post")!==-1) {
        const html = `<div class="fn__space5"></div><div class="fn__space5"></div><button id="adminArticleBtn">管理</button>`;
        const addArticleBtn = document.querySelector('#addArticleBtn');
        addArticleBtn.insertAdjacentHTML('afterend', html);
        const adminArticleBtn = document.querySelector('#adminArticleBtn');
        adminArticleBtn.onclick = ()=>{
            const id = new URLSearchParams(window.location.search).get('id');
            if(id) window.open('https://ld246.com/admin/article/' + id);
            else window.open('https://ld246.com/admin/add-article');
        };
    }

    // 复制参与者用户
    if(location.href.indexOf("ld246.com/article/")!==-1) {
        let users = [];
        const delay = 15000;
        const color = isDark ? '#48e048' : 'green';
        const showTips = (msg) => {
            const aview = document.querySelector('.article__view');
            aview.insertAdjacentHTML('beforeend', `<span style="float:left;color:${color};margin-right:10px;">${msg}</span>`);
            const tips = aview.lastElementChild;
            setTimeout(()=>tips.remove(), delay);
        }
        document.querySelector('#articleStats').addEventListener('click', (e)=>{
            const target = e.target.closest('[data-kind="reward"], [data-kind="thank"], [data-kind="watch"], [data-kind="follow"], [data-kind="voteup"]');
            if(target) {
                const supportUsers = [...document.querySelectorAll('.article__card .tooltipped__n.tooltipped')].map(u=>'@'+u.getAttribute('aria-label'));
                users.push(...supportUsers);
                users = uniqueArray(users);
                GM_setClipboard(users.join(' '));
                const title = (target.dataset.kind === 'thank' ? target.lastElementChild : target.lastChild).textContent.trim();
                showTips(`${title}已复制`);
                target.style.color = color;
                setTimeout(()=>target.style.color = "", delay);
            }
        });
        document.querySelector('.articleParticipantsBtn:not(.meta__more)').addEventListener('click', (e)=>{
            e.preventDefault();
            e.stopPropagation();
            const replayUsers = [...document.querySelectorAll('#comments .commentList .comment__info a[aria-name]')].map(u=>'@'+u.getAttribute('aria-name'));
            users.push(...replayUsers);
            users = uniqueArray(users);
            GM_setClipboard(users.join(' '));
            showTips('回帖已复制');
            e.target.style.color = color;
            setTimeout(()=>e.target.style.color = "", delay);
        }, true);
    }

    // 打赏用户列表（主要用于初始化），多个用英文逗号隔开即可，没有保持空即可，这个列表的用户头像上会有爱心标志
    var loveUsers = '';

    // 打赏用户列表（主要用于初始化），多个用英文逗号隔开即可，没有保持空即可（通常用于标记垃圾广告及骗子用户），这个用户的头像上会有红色x号
    var blackUsers = '';

    // 获取已存储用户信息
    const storeLoveUsers = GM_getValue('__love_users') || [];
    const storeBlackUsers = GM_getValue('__black_users') || [];
    const storeLoveUserReasons = GM_getValue('__love_user_reasons') || {};
    const storeBlackUserReasons = GM_getValue('__black_user_reasons') || {};

    // 打赏用户
    loveUsers = loveUsers.split(',').map(i=>i.trim()).filter(i=>i);
    loveUsers = uniqueArray([...storeLoveUsers, ...loveUsers].map(item=>item.trim()).filter(item=>item));
    GM_setValue('__love_users', loveUsers);

    // 链滴黑名单列表
    blackUsers = blackUsers.split(',').map(i=>i.trim()).filter(i=>i);
    blackUsers = uniqueArray([...storeBlackUsers, ...blackUsers].map(item=>item.trim()).filter(item=>item));
    GM_setValue('__black_users', blackUsers);

    addLoveBlackStyle(loveUsers, blackUsers);
    function addLoveBlackStyle(loveUsers, blackUsers) {
        var loveSelector = loveUsers.map(username => `[href$='/${username}'], [pjax-title^='${username} -']`).join(',\n');
        var blackSelector = blackUsers.map(username => `[href$='/${username}'], [pjax-title^='${username} -']`).join(',\n');
        addStyle(`
        /* 打赏用户 */
        a:is(
            ${loveSelector}
        ) {
           position: relative;
           &::before{
                content: "♥️";
                left: -3px;
                top: -3px;
                position: absolute;
                z-index: 10;
                color: green;
                pointer-events: none;
            }
            .user__info &.avatar-big::before {
                top: 0;
                left: 0;
            }
            .user-card &:has(.avatar-mid)::before{
                top: -40px;
            }
            .comment--perfect &::before{
                top: -12px;
                left: 0;
            }
            .article__meta &::before {
                left: -78px;
                top: 0;
            }
            .user__info &.avatar-big[style^="box-shadow"]::before{
                left:72px;
            }
            .user-card.user-card--bg & .avatar-mid{
                top: -65px!important;
            }
            .user-card.user-card--bg &::before{
                top: 0;
            }
        }
        /* 黑名单 */
        a:is(
            ${blackSelector}
        ) {
           position: relative;
           &::before{
                content: "❌";
                left: -3px;
                top: -3px;
                position: absolute;
                z-index: 10;
                color: red;
                pointer-events: none;
            }
            .user__info &.avatar-big::before {
                top: -12px;
                left: 0;
            }
            .user-card &:has(.avatar-mid)::before{
                top: -40px;
            }
            .comment--perfect &::before{
                top: 0;
                left: 0;
            }
            .article__meta &::before {
                left: -78px;
                top: 0;
            }
            .user__info &.avatar-big[style^="box-shadow"]::before{
                left:72px;
            }
            .user-card.user-card--bg & .avatar-mid{
                top: -65px!important;
            }
            .user-card.user-card--bg &::before{
                top: 0;
            }
        }
      `);
    }

    setTimeout(()=>{
        // 当前窗口打开
        var links = document.querySelectorAll('a[target="_blank"]');
        for (var i = 0; i < links.length; i++) {
            links[i].removeAttribute('target');
        }
        // 首页标签按钮
        var createButton = function(name, url, blank){
            var newSpan = document.createElement("span");
            newSpan.className = "tabs-sub__item tabs-sub__item"; // 注意这里可能有一个类名书写错误，实际使用中请检查你的类名定义
            newSpan.innerHTML = name;
            newSpan.onclick = function() {
                if(blank) window.open(url); else location.href = url;
            };
            // 获取目标元素
            var chatBtn = document.getElementById("chatBtn");
            // 检查是否存在父节点以便插入新元素
            if (chatBtn) {
                // 在#chatBtn之前插入新的span元素
                chatBtn.parentNode.insertBefore(newSpan, chatBtn);
            }
        }
        createButton('优选', 'https://ld246.com/recent/perfect');
        createButton('最新回帖', 'https://ld246.com/recent/reply');
        createButton('代码片段', 'https://ld246.com/tag/code-snippet');
        createButton('创造', 'https://ld246.com/tag/creation');
        createButton('新发布', 'https://github.com/siyuan-note/siyuan/releases', true);
        createButton('EN', 'https://liuyun.io/', true);
        // 标签列表页显示文档数和分页分割线
        if(location.href.indexOf("ld246.com/tag/")!==-1 || location.href.indexOf("ld246.com/recent")!==-1 || location.href.indexOf("ld246.com/qna")!==-1){
            GM_addStyle(`
                .listAjax li:nth-child(32n){border-bottom: 2px solid black;}
                .html--dark .listAjax li:nth-child(32n){border-bottom: 2px solid white;}
                .listAjax{counter-reset: item-counter;}
                .listAjax li::before {
                    content: counter(item-counter);
                    counter-increment: item-counter;
                    position: absolute;
                    left: 146px;
                    margin-top: 15px;
                    text-align: right;
                    color: var(--text-color);
                }
                .tabs-sub {
                    --before-left: 73px;
                }
                .tabs-sub::before {
                    content: attr(data-total);
                    position: absolute;
                    left: var(--before-left);
                    text-align: right;
                    color: var(--text-color);
                }
            `);
            function loadDocNums() {
                (async ()=>{
                    var pageSize = 32;
                    var result = await fetch(location.href + "?ajax=true&p=1");
                    result = await result.json();
                    var page1Length = document.querySelector(".listAjax").children.length;
                    if(page1Length < pageSize) document.querySelector(".tabs-sub").style.setProperty('--before-left', '146px');
                    document.querySelector(".tabs-sub").setAttribute('data-total', page1Length < pageSize ? page1Length : '~ ' + ((result.paginationPageCount+1) * pageSize +16)+' ±16');
                })();
            }
            loadDocNums();

            // 监控切换标签
            setTimeout(()=>{
                const parentEl = document.querySelector('#recent-pjax-container, #tag-pjax-container, #qna-pjax-container');
                const observer = new MutationObserver((mutations) => {
                    mutations.forEach(mutation => {
                        // 遍历新增的节点
                        mutation.addedNodes.forEach(node => {
                            //if (node.nodeType === 1) console.log(node)
                            // 确保是元素节点且符合选择器
                            if (node.nodeType === 1 && (node.matches('.module') || node.matches('.wrapper:has(.tabs-sub)'))) {
                                loadDocNums();
                            }
                        });
                    });
                });

                // 开始观察 body 的子元素变化
                observer.observe(parentEl, {
                    childList: true,  // 监听直接子元素变化
                    subtree: false    // 不监听深层子元素
                });
            }, 1000);
        }
    }, 1000);

    // 链滴自动跳转
    if (location.href.indexOf("ld246.com/forward")!==-1) {
        document.querySelector(".text button").click();
    }
    // 聊天页面字体大小
    if (location.href.indexOf("ld246.com/chats/")!==-1) {
        GM_addStyle(`.chats__content .ft-13{font-size: 16px;}.chats__content .ft__fade{font-size:14px;}`);
    }

    // 聊天界面添加分割线和右侧按日期跳转列表
    if (location.href.indexOf("ld246.com/chats/")!==-1) {
        // 生成日期列表
        generateDateList();

        // 监控新聊天消息生成
        const chatsList = document.querySelector('.chats__list');
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                // 遍历新增的节点
                mutation.addedNodes.forEach(node => {
                    //if (node.nodeType === 1) console.log(node)
                    // 确保是元素节点且符合选择器
                    if (node.nodeType === 1 && node.matches('.chats__item')) {
                        generateDateList();
                    }
                });
            });
        });
        // 开始观察 body 的子元素变化
        observer.observe(chatsList, {
            childList: true,  // 监听直接子元素变化
            subtree: false    // 不监听深层子元素
        });

        function generateDateList() {
             // ================= 原有分割线功能 =================
            GM_addStyle(`
    /* 分隔符样式 */
    .new-day-separator {
        border-top: 2px solid #ccc;
        padding-top: 10px;
        position: relative;
    }

    /* 新增悬浮列表样式 */
    #date-floating-list {
        position: fixed;
        right: 41px;
        top: 50%;
        transform: translateY(-50%);
        background-color: var(--background-color); /*rgba(255, 255, 255, 0.95);*/
        /*border: 1px solid #ddd;*/
        border: 1px solid var(--layer-border-color);
        border-radius: 3px;
        padding: 12px 16px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        max-height: 80vh;
        overflow-y: auto;
        z-index: 9999;
        font-family: Arial, sans-serif;
    }

    .date-item {
        padding: 6px 12px;
        margin: 4px 0;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.2s;
        font-size: 14px;
        color: var(--layer-color); /*#666;*/
        white-space: nowrap;
    }

    .date-item:hover {
        /*background: #f0f0f0;
        color: #333;*/
        background-color: var(--background-secondary-color);
        color: var(--toc-hover-color);
        transform: translateX(-4px);
    }

    .highlight {
        animation: highlight-fade 1s ease-out;
    }

    @keyframes highlight-fade {
        0% { background: rgba(255,235,59,0.3); }
        100% { background: transparent; }
    }
    `);

            // ================= 原有分割线逻辑 + 新增悬浮列表数据收集 =================
            const chatItems = document.querySelectorAll('.chats__list .chats__item');
            const dateMap = new Map();
            let previousDate = null;

            chatItems.forEach((item, index) => {
                // 原有分割线逻辑
                const timeElement = item.querySelector('.ft__smaller.ft__fade.fn__right');
                if (!timeElement) return;

                const timeString = timeElement.textContent.trim();
                const currentDate = new Date(timeString);
                currentDate.setHours(0, 0, 0, 0);

                // 收集日期数据用于悬浮列表
                const dateKey = currentDate.toISOString().split('T')[0];
                if (!dateMap.has(dateKey)) {
                    dateMap.set(dateKey, {
                        element: item,
                        dateStr: timeString.split(' ')[0]
                    });
                }

                // 原有日期比较逻辑
                if (index > 0 && !isSameDay(currentDate, previousDate)) {
                    item.classList.add('new-day-separator');
                }
                previousDate = currentDate;
            });

            // ================= 新增悬浮列表功能 =================
            const dateList = document.createElement('div');
            dateList.id = 'date-floating-list';

            // 按日期排序（从新到旧）
            const sortedDates = [...dateMap.entries()].sort((a, b) => new Date(b[0]) - new Date(a[0]));

            sortedDates.forEach(([dateKey, data]) => {
                const dateItem = document.createElement('div');
                dateItem.className = 'date-item';
                dateItem.textContent = data.dateStr;

                dateItem.addEventListener('click', () => {
                    data.element.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    data.element.classList.add('highlight');
                    setTimeout(() => data.element.classList.remove('highlight'), 1000);
                });

                dateList.appendChild(dateItem);
            });

            document.body.appendChild(dateList);

            // ================= 原有辅助函数 =================
            function isSameDay(date1, date2) {
                if (!date1 || !date2) return false;
                return (
                    date1.getFullYear() === date2.getFullYear() &&
                    date1.getMonth() === date2.getMonth() &&
                    date1.getDate() === date2.getDate()
                );
            }
        }
    }

    function deleteArray(array, removeValue) {
        const index = array.indexOf(removeValue);
        if (index !== -1) {
            array.splice(index, 1); // 删除一个元素
        }
    }

    // 监控用户卡片出现
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            // 遍历新增的节点
            mutation.addedNodes.forEach(node => {
                //if (node.nodeType === 1) console.log(node)
                // 确保是元素节点且符合选择器
                if (node.nodeType === 1 && node.matches('div > .user-card')) {
                    const shrink = node.querySelector('.fn__shrink');
                    if(shrink) {
                        const username = node.querySelector('.ft-gray b')?.textContent?.trim() || '';
                        if(!username) return;
                        const loveTitle = storeLoveUserReasons[username] ? `（${storeLoveUserReasons[username]}）` : '';
                        const blackTitle = storeBlackUserReasons[username] ? `（${storeBlackUserReasons[username]}）` : '';
                        const loveBtnHtml = `<button class="follow small" id="userCardLoveUser" title="添加到打赏者${loveTitle}"> ♥️ </button>`;
                        const blackBtnHtml = `<button class="follow small" id="userCardBlackUser" title="添加到黑名单${blackTitle}"> ❌ </button>`;
                        shrink.insertAdjacentHTML('beforeend', loveBtnHtml);
                        shrink.insertAdjacentHTML('beforeend', blackBtnHtml);
                        const loveBtn = node.querySelector('#userCardLoveUser');
                        if(loveUsers.includes(username)) {loveBtn.setAttribute('title', '取消打赏者');}
                        const blackBtn = node.querySelector('#userCardBlackUser');
                        if(blackUsers.includes(username)) {blackBtn.setAttribute('title', '取消黑名单');}
                        loveBtn.onclick = () => {
                            if(!loveUsers.includes(username)){
                                loveUsers.push(username);
                                GM_setValue('__love_users', uniqueArray(loveUsers));
                                loveBtn.setAttribute('title', '取消打赏者');
                            } else {
                                deleteArray(loveUsers, username);
                                GM_setValue('__love_users', loveUsers);
                                loveBtn.setAttribute('title', '添加到打赏者');
                            }
                            addLoveBlackStyle(loveUsers, blackUsers);
                        };
                        loveBtn.oncontextmenu = (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const reason = prompt('请输入原因（保存后，下次打开或刷新后显示）', storeLoveUserReasons[username]||'');
                            if(reason !== null) {
                                if(reason === '') delete storeLoveUserReasons[username];
                                else storeLoveUserReasons[username] = reason;
                                GM_setValue('__love_user_reasons', storeLoveUserReasons);
                            }
                        };
                        blackBtn.onclick = () => {
                            if(!blackUsers.includes(username)){
                                blackUsers.push(username);
                                GM_setValue('__black_users', uniqueArray(blackUsers));
                                blackBtn.setAttribute('title', '取消黑名单');
                            } else {
                                deleteArray(blackUsers, username);
                                GM_setValue('__black_users', blackUsers);
                                blackBtn.setAttribute('title', '添加到黑名单');
                            }
                            addLoveBlackStyle(loveUsers, blackUsers);
                        };
                        blackBtn.oncontextmenu = (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const reason = prompt('请输入原因（保存后，下次打开或刷新后显示）', storeBlackUserReasons[username]||'');
                            if(reason !== null) {
                                if(reason === '') delete storeBlackUserReasons[username];
                                else storeBlackUserReasons[username] = reason;
                                GM_setValue('__black_user_reasons', storeBlackUserReasons);
                            }
                        };
                    }
                }
            });
        });
    });

    // 开始观察 body 的子元素变化
    observer.observe(document.body, {
        childList: true,  // 监听直接子元素变化
        subtree: true    // 不监听深层子元素
    });

    // 监听用户页面
    if(location.href.indexOf("ld246.com/member/")!==-1){
        setTimeout(()=> {
            const userInfo = document.querySelector('.user__info');
            const userBar = userInfo.querySelector('.fn__clear');
            if(!userBar) return;
            const username = userInfo.querySelector('span.ft__gray.ft__smaller')?.textContent?.trim() || '';
            if(!username) return;
            const loveTitle = storeLoveUserReasons[username] ? `（${storeLoveUserReasons[username]}）` : '';
            const blackTitle = storeBlackUserReasons[username] ? `（${storeBlackUserReasons[username]}）` : '';
            const loveBtnHtml = `<a href="javascript:;" id="userCardLoveUser" style="float:right" class="user__site vditor-tooltipped__n vditor-tooltipped" aria-label="添加到打赏者${loveTitle}"> ♥️ </a>`;
            const blackBtnHtml = `<a href="javascript:;" id="userCardBlackUser" style="float:right" class="user__site vditor-tooltipped__n vditor-tooltipped" aria-label="添加到黑名单${blackTitle}"> ❌ </a>`;
            userBar.insertAdjacentHTML('beforeend', blackBtnHtml);
            userBar.insertAdjacentHTML('beforeend', loveBtnHtml);
            const loveBtn = userInfo.querySelector('#userCardLoveUser');
            if(loveUsers.includes(username)) {loveBtn.setAttribute('aria-label', '取消打赏者');}
            const blackBtn = userInfo.querySelector('#userCardBlackUser');
            if(blackUsers.includes(username)) {blackBtn.setAttribute('aria-label', '取消黑名单');}
            loveBtn.onclick = () => {
                if(!loveUsers.includes(username)){
                    loveUsers.push(username);
                    GM_setValue('__love_users', uniqueArray(loveUsers));
                    loveBtn.setAttribute('aria-label', '取消打赏者');
                } else {
                    deleteArray(loveUsers, username);
                    GM_setValue('__love_users', loveUsers);
                    loveBtn.setAttribute('aria-label', '添加到打赏者');
                }
                addLoveBlackStyle(loveUsers, blackUsers);
            };
            loveBtn.oncontextmenu = (e) => {
                e.preventDefault();
                e.stopPropagation();
                const reason = prompt('请输入原因（保存后，下次打开或刷新后显示）', storeLoveUserReasons[username]||'');
                if(reason !== null) {
                    if(reason === '') delete storeLoveUserReasons[username];
                    else storeLoveUserReasons[username] = reason;
                    GM_setValue('__love_user_reasons', storeLoveUserReasons);
                }
            };
            blackBtn.onclick = () => {
                if(!blackUsers.includes(username)){
                    blackUsers.push(username);
                    GM_setValue('__black_users', uniqueArray(blackUsers));
                    blackBtn.setAttribute('aria-label', '取消黑名单');
                } else {
                    deleteArray(blackUsers, username);
                    GM_setValue('__black_users', blackUsers);
                    blackBtn.setAttribute('aria-label', '添加到黑名单');
                }
                addLoveBlackStyle(loveUsers, blackUsers);
            };
            blackBtn.oncontextmenu = (e) => {
                e.preventDefault();
                e.stopPropagation();
                const reason = prompt('请输入原因（保存后，下次打开或刷新后显示）', storeBlackUserReasons[username]||'');
                if(reason !== null) {
                    if(reason === '') delete storeBlackUserReasons[username];
                    else storeBlackUserReasons[username] = reason;
                    GM_setValue('__black_user_reasons', storeBlackUserReasons);
                }
            };
        }, 1000);
    }

    function addStyle(cssRules) {
        const styleId = 'ld246-user-white-black-style'; // 定义一个固定的 id 标记

        // 如果存在上一次添加的 <style> 元素，则移除它
        const existingStyle = document.getElementById(styleId);
        if (existingStyle && existingStyle.parentNode) {
            existingStyle.parentNode.removeChild(existingStyle);
        }

        // 创建一个新的 <style> 元素
        const styleElement = document.createElement('style');
        styleElement.id = styleId; // 设置 id
        styleElement.type = 'text/css';

        // 将 CSS 规则写入 <style> 元素
        if (styleElement.styleSheet) {
            // 针对旧版 IE 浏览器
            styleElement.styleSheet.cssText = cssRules;
        } else {
            // 现代浏览器
            styleElement.appendChild(document.createTextNode(cssRules));
        }

        // 将 <style> 元素添加到 <head> 中
        document.head.appendChild(styleElement);
    }

    function getUsers() {
        console.log('打赏者用户：');
        console.log(loveUsers.join(','));
        console.log('黑名单用户：');
        console.log(blackUsers.join(','));
    }
    // console.log(getUsers());
})();