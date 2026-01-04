// ==UserScript==
// @name         解除禁止复制粘贴和右键菜单
// @namespace    https://github.com/LaLa-HaHa-Hei/
// @version      1.0.0
// @description  解除网页的禁止选择、复制、粘贴和右键菜单。注意：这个脚本可能严重影响某些网站功能！
// @author       代码见三
// @license      GPL-3.0-or-later
// @match        *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/536309/%E8%A7%A3%E9%99%A4%E7%A6%81%E6%AD%A2%E5%A4%8D%E5%88%B6%E7%B2%98%E8%B4%B4%E5%92%8C%E5%8F%B3%E9%94%AE%E8%8F%9C%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/536309/%E8%A7%A3%E9%99%A4%E7%A6%81%E6%AD%A2%E5%A4%8D%E5%88%B6%E7%B2%98%E8%B4%B4%E5%92%8C%E5%8F%B3%E9%94%AE%E8%8F%9C%E5%8D%95.meta.js
// ==/UserScript==

(function() {
    'use strict';
 
    console.log("运行了Disable Restriction")
    const checkAllElementsForOnEvents = false // 解除限制时检查全部元素，值为true且网页复杂时将导致严重性能问题
    let autoDisableAllRestriction = GM_getValue("dr-autoDisableAllRestriction", false) // 启动页面后自动解除所有限制
    let injectIframesWrittenByJs = GM_getValue("dr-injectIframesWrittenByJs", false) // 部分iframe是由js写入的，不是通过src获取的

    let id1 = GM_registerMenuCommand(
        "自动解除限制：" + (autoDisableAllRestriction === true ? "已开" : "未开"),
        menu1Click,
    "a");
    function menu1Click() {
        GM_unregisterMenuCommand(id1)
        autoDisableAllRestriction = !autoDisableAllRestriction
        GM_setValue("dr-autoDisableAllRestriction", autoDisableAllRestriction)
        
        id1 = GM_registerMenuCommand(
            "自动解除限制：" + (autoDisableAllRestriction === true ? "已开" : "未开"),
            menu1Click,
        "a");
    }
    
    let id2 = GM_registerMenuCommand(
        "包括js写入的iframe：" + (injectIframesWrittenByJs === true ? "已开" : "未开"),
        menu2Click,
    "i");
    function menu2Click() {
        GM_unregisterMenuCommand(id2)
        injectIframesWrittenByJs = !injectIframesWrittenByJs
        GM_setValue("dr-injectIframesWrittenByJs", injectIframesWrittenByJs)
        
        id2 = GM_registerMenuCommand(
            "包括js写入的iframe：" + (injectIframesWrittenByJs === true ? "已开" : "未开"),
            menu2Click,
        "i");
    }

    drMain(autoDisableAllRestriction, checkAllElementsForOnEvents)

    if (injectIframesWrittenByJs)
    {
        injectToAllIframes()
        const injectToAllIframesInterval = setInterval(injectToAllIframes, 2 * 1000)
    }

    // 注入所有js写入的iframe，带有src的ifrmae用match *://*/*匹配
    function injectToAllIframes() {
        const iframes = document.querySelectorAll('iframe');
        iframes.forEach(iframe => {
            try {
                const doc = iframe.contentDocument || iframe.contentWindow.document;
                if (!doc) 
                    return;

                // 避免重复注入
                if (doc.body && doc.body.getAttribute("dr-injected"))
                    return;

                // 注入 drMain()
                const script = doc.createElement('script');
                script.type = 'text/javascript';
                script.textContent = `(${drMain.toString()})(${autoDisableAllRestriction}, ${checkAllElementsForOnEvents});`
                doc.head.appendChild(script);
                doc.body.setAttribute("dr-injected", "true");
                // console.log("已注入 iframe：", iframe);
                console.log("已注入 iframe");
            } catch (e) {
                console.warn("无法注入 iframe（可能是跨域）：", e);
            }
        })
    }

    function drMain(autoDisableAllRestriction, checkAllElementsForOnEvents = false){
        if (document.body && document.body.getAttribute("dr-injected-main")) {
            console.log("drMain已经在此frame运行过");
            return;
        }
        if (document.body) {
            document.body.setAttribute("dr-injected-main", "true");
        }
        
        injectCSS()
        injectHTML()

        if (autoDisableAllRestriction)
        {
            disableSelectionRestriction(checkAllElementsForOnEvents)
            disableCopyRestriction(checkAllElementsForOnEvents)
            disablePasteRestriction(checkAllElementsForOnEvents)
            disableContextMenuRestriction(checkAllElementsForOnEvents)
        }

        // 直接绑定会导致找不到元素
        setTimeout(() => {
            bindEvents()
        }, 0);
        
        // 防止被覆盖，重新注入，每2秒检测一次，
        const preventCoveredInterval = setInterval(() => {
            if (!document.querySelector('#dr-html')) {
                console.log('检测到UI被移除，重新注入...');
                injectHTML();
                setTimeout(() => {
                    bindEvents()
                }, 0);
                if (autoDisableAllRestriction)
                {
                    disableSelectionRestriction(checkAllElementsForOnEvents)
                    disableCopyRestriction(checkAllElementsForOnEvents)
                    disablePasteRestriction(checkAllElementsForOnEvents)
                    disableContextMenuRestriction(checkAllElementsForOnEvents)
                }
            }
            if (!document.querySelector('style[dr-style]')) {
                console.log('选择样式被移除，重新注入...');
                injectCSS();
            }
        }, 2 * 1000)
        setTimeout(() => clearInterval(preventCoveredInterval), 7 * 1000); // 监听7秒后不再防止覆盖
        
        // 解除禁止选择，对于实现了拖动功能的元素可能造成影响
        function disableSelectionRestriction(checkAllElementsForOnEvents) {
            // 设置全局css可选则
            const styleId = 'enable-selection-style';
            if (document.getElementById(styleId)) {
                console.log('允许选择css已存在.');
            }
            else {
                const style = document.createElement('style');
                style.id = styleId;
                // 使用 !important 提高优先级，覆盖网站可能使用的 !important
                style.innerHTML = `
                * {
                    user-select: auto !important;
                    -webkit-user-select: auto !important;
                    -moz-user-select: auto !important;
                    -ms-user-select: auto !important;
                }
            `;
                (document.head || document.documentElement).appendChild(style);
                console.log('允许选择css注入完成')
            }

            // 阻止其他addEventListener事件执行
            document.addEventListener('selectstart', e => e.stopImmediatePropagation(), true)
            // onxxx事件和addEventListener本质不同，需要单独阻止
            const elements = checkAllElementsForOnEvents ? document.querySelectorAll('*') : [document, document.body]
            elements.forEach(element => {
                if (typeof element.onselectstart === 'function') {
                    element.onselectstart = null
                }
            })
            console.log('允许选择js注入完成')
        }
        
        // 解除禁止复制
        function disableCopyRestriction(checkAllElementsForOnEvents) {
            document.addEventListener('copy', e => e.stopImmediatePropagation(), true)
            const elements = checkAllElementsForOnEvents ? document.querySelectorAll('*') : [document, document.body]
            elements.forEach(element => {
                if (typeof element.oncopy === 'function') {
                    element.oncopy = null
                }
            })
            console.log('允许复制js注入完成')
        }

        // 解除禁止粘贴
        function disablePasteRestriction(checkAllElementsForOnEvents) {
            document.addEventListener('paste', e => e.stopImmediatePropagation(), true)
            const elements = checkAllElementsForOnEvents ? document.querySelectorAll('*') : document.querySelectorAll('textarea, input, [contenteditable="true"]')
            elements.forEach(element => {
                if (typeof element.onpaste === 'function') {
                    element.onpaste = null
                }
            })
            console.log('允许粘贴js注入完成')
        }
        
        // 解除禁止右键菜单，对于带有特殊菜单的网页可能造成影响
        function disableContextMenuRestriction(checkAllElementsForOnEvents) {
            document.addEventListener('contextmenu', e => e.stopImmediatePropagation(), true)
            // 尝试移除 body/document 上的 oncontextmenu
            const elements = checkAllElementsForOnEvents ? document.querySelectorAll('*') : [document, document.body]
            elements.forEach(element => {
                if (typeof element.oncontextmenu === 'function') {
                    element.oncontextmenu = null
                }
            });
            console.log('允许右键菜单js注入完成');
        }

        function bindEvents(){
            const btn = document.querySelector('#dr-floating-btn');
            const menu = document.querySelector('#dr-menu');
            document.querySelector('#dr-allow-all-btn')?.addEventListener('click', () => {
                disableSelectionRestriction(checkAllElementsForOnEvents)
                disableCopyRestriction(checkAllElementsForOnEvents)
                disablePasteRestriction(checkAllElementsForOnEvents)
                disableContextMenuRestriction(checkAllElementsForOnEvents)
                menu.style.display = 'none'
            });
            document.querySelector('#dr-allow-select-copy-paste-btn')?.addEventListener('click', () => {
                disableSelectionRestriction(checkAllElementsForOnEvents)
                disableCopyRestriction(checkAllElementsForOnEvents)
                disablePasteRestriction(checkAllElementsForOnEvents)
                menu.style.display = 'none'
            });
            document.querySelector('#dr-allow-select-btn')?.addEventListener('click', () => {
                disableSelectionRestriction(checkAllElementsForOnEvents)
                menu.style.display = 'none'
            });
            document.querySelector('#dr-allow-copy-btn')?.addEventListener('click', () => {
                disableCopyRestriction(checkAllElementsForOnEvents)
                menu.style.display = 'none'
            });
            document.querySelector('#dr-allow-paste-btn')?.addEventListener('click', () => {
                disablePasteRestriction(checkAllElementsForOnEvents)
                menu.style.display = 'none'
            });
            document.querySelector('#dr-allow-context-menu-btn')?.addEventListener('click', () => {
                disableContextMenuRestriction(checkAllElementsForOnEvents)
                menu.style.display = 'none'
            });

            // 按钮拖动，点击按钮弹出窗口
            let isDragging = false;
            let isClick = false;
            let offsetY = 0;

            // 点击菜单外关闭菜单
            // 电脑
            document.addEventListener('mousedown', function (e) {
                if (!btn.contains(e.target) && !menu.contains(e.target)) {
                    menu.style.display = 'none';
                }
            });
            // 手机
            document.addEventListener('touchstart', function (e) {
                // 对于触摸事件，e.target 也是触发事件的元素
                if (!btn.contains(e.target) && !menu.contains(e.target)) {
                    menu.style.display = 'none';
                }
            }, { passive: true });

            // 电脑端拖动
            btn.addEventListener('mousedown', handleDragStart);
            document.addEventListener('mousemove', handleDragMove);
            document.addEventListener('mouseup', handleDragEnd);
            // 手机端拖动
            btn.addEventListener("touchstart", handleDragStart);
            document.addEventListener("touchmove", handleDragMove);
            document.addEventListener("touchend", handleDragEnd);

            function handleDragStart(event){
                isDragging = true;
                isClick = true;
                offsetY = (event.clientY || event.touches[0].clientY) - btn.getBoundingClientRect().top;
                menu.style.display = 'none';
                event.preventDefault();
            }
            function handleDragMove(event){
                if (isDragging) {
                    isClick = false;
                    let newTop = (event.clientY || event.touches[0].clientY) - offsetY;
                    // 限制按钮不超出窗口
                    newTop = Math.max(0, Math.min(window.innerHeight - btn.offsetHeight, newTop));
                    btn.style.top = newTop + 'px';
                    event.preventDefault();
                }
            }
            function handleDragEnd(event){
                isDragging = false;
                if (isClick){
                    // 菜单位置跟随按钮
                    const rect = btn.getBoundingClientRect();
                    menu.style.top = rect.top + 'px';
                    menu.style.display = menu.style.display = 'block';
                }
                isClick = false;
            }
        }
            
        // 注入按钮和菜单
        function injectHTML() {
            const injectedTHML = `
                <button id="dr-floating-btn">解除限制</button>
                <div id="dr-menu">
                    <button class="dr-menu-item" id="dr-allow-all-btn">解除所有限制</button>
                    <button class="dr-menu-item" id="dr-allow-select-copy-paste-btn">允许选择复制粘贴</button>
                    <button class="dr-menu-item" id="dr-allow-select-btn">允许选择</button>
                    <button class="dr-menu-item" id="dr-allow-copy-btn">允许复制</button>
                    <button class="dr-menu-item" id="dr-allow-paste-btn">允许粘贴</button>
                    <button class="dr-menu-item" id="dr-allow-context-menu-btn">允许右键菜单</button>
                </div>
            `
            const divElement = document.createElement('div')
            divElement.innerHTML = injectedTHML
            divElement.id = "dr-html"
            document.body.appendChild(divElement)
            // document.body.insertAdjacentHTML('afterbegin', injectedTHML)
        }
        // 注入css
        function injectCSS(){
            const injectedCSS = `
                #dr-floating-btn {
                    position: fixed;
                    left: 0;
                    top: 40%;
                    z-index: 9999;
                    background: #007bff;
                    color: #fff;
                    border: none;
                    border-radius: 0 20px 20px 0;
                    padding: 6px 14px;
                    cursor: pointer;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
                    user-select: none;
                    transition: background 0.2s;
                }

                #dr-floating-btn:active {
                    background: #0056b3;
                }

                #dr-menu {
                    display: none;
                    position: fixed;
                    left: 60px;
                    top: 40%;
                    background: #fff;
                    border-radius: 8px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
                    padding: 8px 0;
                    z-index: 10000;
                    min-width: 160px;
                }

                .dr-menu-item {
                    display: block;
                    width: 100%;
                    background: none;
                    border: none;
                    text-align: left;
                    padding: 8px 16px;
                    font-size: 15px;
                    color: #333;
                    cursor: pointer;
                    transition: background 0.2s;
                }

                .dr-menu-item:hover {
                    background: #f0f0f0;
                }
            `
            const styleElement = document.createElement('style')
            styleElement.textContent = injectedCSS
            styleElement.setAttribute('dr-style', '')
            document.head.appendChild(styleElement)
        }
    }
})();