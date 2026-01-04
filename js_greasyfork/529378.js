// ==UserScript==
// @name         全局网页回到顶部Top/底部Down
// @description  便捷的全局回到顶部/底部按钮（Top and Down buttons everywhere）
// @version      3.1
// @author       Max Max
// @license      MIT
// @include      *
// @match        https://*.baidu.com/*
// @match        https://segmentfault.com/*
// @match        https://*.v2ex.com/*
// @match        https://hacpai.com/*
// @match        https://github.com/*
// @match        https://*.zhihu.com/*
// @match        https://*.cnblogs.com/*
// @match        https://*.jianshu.com/*
// @match        http://*.163.com/*
// @run-at       document-end
// @grant        none
// @namespace    https://greasyfork.org/users/1267557
// @downloadURL https://update.greasyfork.org/scripts/529378/%E5%85%A8%E5%B1%80%E7%BD%91%E9%A1%B5%E5%9B%9E%E5%88%B0%E9%A1%B6%E9%83%A8Top%E5%BA%95%E9%83%A8Down.user.js
// @updateURL https://update.greasyfork.org/scripts/529378/%E5%85%A8%E5%B1%80%E7%BD%91%E9%A1%B5%E5%9B%9E%E5%88%B0%E9%A1%B6%E9%83%A8Top%E5%BA%95%E9%83%A8Down.meta.js
// ==/UserScript==

(function () {
    if (window.self !== window.top) return; // 跳过 iframe

    // 创建样式
    const addStyle = (css) => {
        const style = document.createElement("style");
        style.type = "text/css";
        style.appendChild(document.createTextNode(css));
        document.head.appendChild(style);
    };

    // 按钮样式
    addStyle(`
        .scroll-btn {
            position: fixed;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            width: 40px;
            height: 40px;
            background: rgba(0, 0, 0, 0.6);
            color: #fff;
            font-size: 18px;
            text-align: center;
            line-height: 40px;
            cursor: pointer;
            border-radius: 5px;
            z-index: 9999;
            opacity: 1; /* 默认透明度 100% */
            transition: opacity 0.3s;
        }
        .scroll-btn:hover {
            opacity: 1; /* 悬浮时完全显示 */
        }
        #scroll-top {
            margin-top: -40px; /* 顶部按钮向上移动 40px */
        }
        #scroll-bottom {
            margin-top: 40px; /* 底部按钮向下移动 40px */
        }
    `);

    // 创建按钮
    const createButton = (id, text) => {
        const btn = document.createElement("div");
        btn.id = id;
        btn.className = "scroll-btn";
        btn.innerHTML = text;
        document.body.appendChild(btn);
        return btn;
    };

    const btnTop = createButton("scroll-top", "▲");
    const btnBottom = createButton("scroll-bottom", "▼");

    // 平滑滚动函数
    const smoothScroll = (targetY) => {
        window.scrollTo({
            top: targetY,
            behavior: "smooth"
        });
    };

    // 监听滚动，修改透明度
    const updateButtons = () => {
        const scrollY = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

        // 处于顶部时降低透明度
        btnTop.style.opacity = scrollY <= 100 ? "0.3" : "0.5";
        btnBottom.style.opacity = scrollY >= maxScroll - 100 ? "0.3" : "0.5";
    };

    // 绑定点击事件
    btnTop.addEventListener("click", () => smoothScroll(0));
    btnBottom.addEventListener("click", () => smoothScroll(document.body.scrollHeight));

    // 监听滚动事件
    window.addEventListener("scroll", updateButtons);

    // 初始化按钮状态
    updateButtons();
})();
