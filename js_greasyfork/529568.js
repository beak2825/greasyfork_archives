// ==UserScript==
// @name         微博黑名单
// @version      2.12
// @description  根据页面规则隐藏黑名单内用户的评论和博文，并支持右键屏蔽用户功能
// @author       AI
// @match        *://*.weibo.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/529568/%E5%BE%AE%E5%8D%9A%E9%BB%91%E5%90%8D%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/529568/%E5%BE%AE%E5%8D%9A%E9%BB%91%E5%90%8D%E5%8D%95.meta.js
// ==/UserScript==

/*
==============================================
微博屏蔽黑名单逻辑说明（共8种情况）
==============================================

1. 在主页，用户A评论了博文，没有人评论A；
   如果A在黑名单中，隐藏A的评论：
   <div class="wbpro-list">                      // A的评论
       <div class="item1">
           <div class="item1in woo-box-flex">
               <div class="con1 woo-box-item-flex">
                   <div class="text">
                       <a href="/u/2285157814" class="ALink_default_2ibt1" usercard="2285157814" to="/u/2285157814">HY玩家</a>
           <div class="list2">
               ::before

2. 在主页，用户A评论了博文，B评论了A；
   如果A在黑名单中，隐藏A的评论：
   <div class="wbpro-list">
       <div class="item1">
           <div class="item1in woo-box-flex">    // A的评论
           <div class="list2">
               ::before
               <div class="item2">              // B对A的评论

3. 在主页，用户A评论了博文，B评论了A；
   如果B在黑名单中，隐藏B对A的评论：
   <div class="wbpro-list">
       <div class="item1">
           <div class="item1in woo-box-flex">    // A的评论
           <div class="list2">
               ::before
               <div class="item2">              // B对A的评论

4. 在主页弹出评论框，用户A评论了博文，B评论了A；
   如果A在黑名单中，隐藏A的评论：
   <div class="wbpro-list">
       <div class="item1">
           <div class="item1in woo-box-flex">    // A的评论
           <div class="wbpro-tab3">			
           <div class="list2">					
               ::before
               <div class="item2">              // B对A的评论

5. 在主页弹出评论框，用户A评论了博文，B评论了A；
   如果B在黑名单中，隐藏B对A的评论：
   <div class="wbpro-list">
       <div class="item1">
           <div class="item1in woo-box-flex">    // A的评论
           <div class="wbpro-tab3">			
           <div class="list2">					
               ::before
               <div class="item2">              // B对A的评论

6. 在搜索页，出现A的博文；
   如果A在黑名单中，隐藏A的博文：
   <div action-type="feed_list_item" mid="5154559505995989" class="card-wrap">  // A的博文

7. 在搜索页，用户A评论了博文；
   如果A在黑名单中，隐藏A的评论：
   <div class="card-review s-ptb10" comment_id="5154565900993183">  // A的评论

8. 在推荐页，出现A的博文；
   如果A在黑名单中，隐藏A的博文：
   <div class="vue-recycle-scroller__item-view" style="transform: translateY(0px);">  // A的博文

--------------------------------------------------
右键菜单：屏蔽用户功能说明
--------------------------------------------------

在以上所有情况中，用户头像或用户名的 <a> 标签上右键点击，可弹出“屏蔽该用户”菜单。

点击后，会将该用户信息保存在 GM_setValue 的黑名单对象中：

黑名单示例结构：
{
    "blockedUsers": {
        "小米玩具车": "66686609"
    }
}

菜单样式参考：
menu.id = "customBlockMenu";
menu.style.position = "fixed";
menu.style.left = (x + 5) + "px";
menu.style.top = (y + 5) + "px";
menu.style.background = "#fff";
menu.style.border = "1px solid #dcdcdc";
menu.style.borderRadius = "4px";
menu.style.padding = "8px 16px";
menu.style.cursor = "pointer";
menu.style.zIndex = "99999";
menu.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
menu.style.fontFamily = "Arial, sans-serif";
menu.style.fontSize = "14px";
menu.style.color = "#333";
menu.style.transition = "background-color 0.2s ease";
menu.textContent = "屏蔽 " + username;
*/



(function () {
    'use strict';

    // 定义黑名单的键名
    const BLOCKED_KEY = 'blockedUsers';

    // 获取当前保存的黑名单（没有时返回空对象）
    function getBlockedUsers() {
        const obj = GM_getValue(BLOCKED_KEY, {});
        return typeof obj === 'object' ? obj : {};
    }

    // 将指定用户加入黑名单并保存
    function addBlockedUser(userName, userId) {
        const blockedUsers = getBlockedUsers();
        // 如果已有该用户则不重复添加
        if (!blockedUsers[userName]) {
            blockedUsers[userName] = userId;
            GM_setValue(BLOCKED_KEY, blockedUsers);
        }
    }

    // 判断传入的用户名和 userId 是否在黑名单中
    function isUserBlocked(userName, userId) {
        const blockedUsers = getBlockedUsers();
        // 此处我们将用户名作为 key，同时验证 userId 是否匹配
        return blockedUsers[userName] && blockedUsers[userName] === userId;
    }

    // 根据目标元素所在的区域自动决定隐藏哪个祖先容器
    // 优先规则：先查找包含 .item1in（用于第2种情况隐藏A的评论），
    //         再检查是否在 .item2（用于第4/5种情况隐藏B的评论），
    //         否则再查找 .item1 或备用容器
    function getHideContainer(anchorElem) {
        let container = anchorElem.closest('.item1in');
        if (container) return container;

        container = anchorElem.closest('.item2');
        if (container) return container;

        container = anchorElem.closest('.item1');
        if (container) return container;

        container = anchorElem.closest('.card-wrap, .card-review, .vue-recycle-scroller__item-view');
        return container;
    }

    // 对单个用户名锚点进行处理：
    // 1. 如果该用户已被屏蔽，则隐藏其所在的容器；
    // 2. 如果用户标签没有 usercard 属性，则尝试从 to 或 href 中提取用户ID，支持格式 "/u/数字" 或 "weibo.com/数字"；
    // 3. 给该锚点绑定右键菜单事件（右键后显示“屏蔽该用户”的菜单）
    function processUserAnchor(anchorElem) {
        let userId = anchorElem.getAttribute("usercard");
        if (!userId) {
            // 尝试从 to 或 href 属性中提取，例如格式为 "/u/7746061639"
            let attr = anchorElem.getAttribute("to") || anchorElem.getAttribute("href") || "";
            let match = attr.match(/\/u\/(\d+)/);
            if (!match) {
                // 如果没匹配到，则尝试匹配像 "//weibo.com/3626485974" 这种形式
                match = attr.match(/weibo\.com\/(\d+)/);
            }
            if (match) {
                userId = match[1];
            }
        }
        if (!userId) return;  // 如果无法获得用户ID，则跳过

        const userName = anchorElem.textContent.trim();
        // 如果该用户在黑名单中，则隐藏所在的容器
        if (isUserBlocked(userName, userId)) {
            const container = getHideContainer(anchorElem);
            if (container) {
                container.style.display = 'none';
            }
        }
        // 为当前链接绑定右键菜单事件
        anchorElem.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            showBlockMenu(e.clientX, e.clientY, userName, userId);
        });
    }

    // 对页面中所有可能的用户链接进行扫描
    function processAllUserAnchors(context = document) {
        const anchors = context.querySelectorAll('a');
        anchors.forEach(anchor => {
            // 判断是否为用户链接：
            // 如果具有 usercard，或其 to/href 属性以 "/u/"或包含 "weibo.com/数字" 则认为是用户链接
            if (
                anchor.hasAttribute("usercard") ||
                ((anchor.hasAttribute("to") && (/^\/u\/\d+/.test(anchor.getAttribute("to")) || /weibo\.com\/\d+/.test(anchor.getAttribute("to")))) ||
                 (anchor.hasAttribute("href") && (/^\/u\/\d+/.test(anchor.getAttribute("href")) || /weibo\.com\/\d+/.test(anchor.getAttribute("href"))))) ||
                anchor.classList.contains("name") // 添加了对 .name 类名的检查
            ) {
                processUserAnchor(anchor);
            }
        });
    }

    // 自定义的右键屏蔽菜单（单例模式）
    let blockMenu = null;
    function createBlockMenu() {
        blockMenu = document.createElement('div');
        blockMenu.id = 'customBlockMenu';
        // 设置样式（参考你的要求）
        blockMenu.style.position = "fixed";
        blockMenu.style.background = "#fff";
        blockMenu.style.border = "1px solid #dcdcdc";
        blockMenu.style.borderRadius = "4px";
        blockMenu.style.padding = "8px 16px";
        blockMenu.style.cursor = "pointer";
        blockMenu.style.zIndex = "99999";
        blockMenu.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
        blockMenu.style.fontFamily = "Arial, sans-serif";
        blockMenu.style.fontSize = "14px";
        blockMenu.style.color = "#333";
        blockMenu.style.transition = "background-color 0.2s ease";
        blockMenu.textContent = "屏蔽该用户";
        document.body.appendChild(blockMenu);
        // 点击菜单后，隐藏菜单并执行屏蔽操作
        blockMenu.addEventListener('click', function () {
            const userName = blockMenu.getAttribute('data-username');
            const userId = blockMenu.getAttribute('data-userid');
            if (userName && userId) {
                addBlockedUser(userName, userId);
                // 添加后重新扫描页面，将黑名单内的内容隐藏
                processAllUserAnchors();
            }
            hideBlockMenu();
        });
    }

    // 显示右键菜单，设置自定义属性保存用户信息
    function showBlockMenu(x, y, userName, userId) {
        if (!blockMenu) {
            createBlockMenu();
        }
        blockMenu.setAttribute('data-username', userName);
        blockMenu.setAttribute('data-userid', userId);
        // 在鼠标点击的位置显示菜单（使用 e.clientX 和 e.clientY）
        blockMenu.style.left = x + "px";
        blockMenu.style.top = y + "px";
        blockMenu.style.display = "block";
    }

    function hideBlockMenu() {
        if (blockMenu) {
            blockMenu.style.display = "none";
        }
    }

    // 使用 document 级别的事件代理监听右键点击（捕获阶段，确保覆盖所有情况）
    document.addEventListener('contextmenu', function(e) {
        const anchor = e.target.closest('a');
        if (anchor &&
            (anchor.hasAttribute("usercard") ||
             (anchor.hasAttribute("to") && (/^\/u\/\d+/.test(anchor.getAttribute("to")) || /weibo\.com\/\d+/.test(anchor.getAttribute("to")))) ||
             (anchor.hasAttribute("href") && (/^\/u\/\d+/.test(anchor.getAttribute("href")) || /weibo\.com\/\d+/.test(anchor.getAttribute("href"))))) ||
            anchor.classList.contains("name") // 添加了对 .name 类名的检查
        ) {
            e.preventDefault();
            let userId = anchor.getAttribute("usercard");
            if (!userId) {
                let attr = anchor.getAttribute("to") || anchor.getAttribute("href") || "";
                let match = attr.match(/\/u\/(\d+)/) || attr.match(/weibo\.com\/(\d+)/);
                if (match) {
                    userId = match[1];
                }
            }
            const userName = anchor.textContent.trim();
            if (userName && userId) {
                showBlockMenu(e.clientX, e.clientY, userName, userId);
            }
        }
    }, true);

    // 点击其他区域时隐藏右键菜单
    document.addEventListener('click', function () {
        hideBlockMenu();
    });

    // 初次扫描页面
    processAllUserAnchors();

    // 针对页面动态加载的情况，使用 MutationObserver 对新增节点进行处理
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    processAllUserAnchors(node);
                }
            });
        });
    });
    observer.observe(document.body, { childList: true, subtree: true });

})();
