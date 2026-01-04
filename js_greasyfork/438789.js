// ==UserScript==
// @name         所有网页添加二次元小姐姐（看板娘）
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  二次元小姐姐（引用看板娘）!
// @author       ziran
// @match        https://juejin.cn/*
// @match        https://www.baidu.com/*
// @match        https://*/*
// @icon         https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fup.enterdesk.com%2Fedpic%2Fb2%2Ffc%2F5d%2Fb2fc5d85ad14ccaf2e7a2cd2632d842c.jpg&refer=http%3A%2F%2Fup.enterdesk.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1645173435&t=116608116a9249ddac16a37973d07162
// @grant        GM_addStyle

// @downloadURL https://update.greasyfork.org/scripts/438789/%E6%89%80%E6%9C%89%E7%BD%91%E9%A1%B5%E6%B7%BB%E5%8A%A0%E4%BA%8C%E6%AC%A1%E5%85%83%E5%B0%8F%E5%A7%90%E5%A7%90%EF%BC%88%E7%9C%8B%E6%9D%BF%E5%A8%98%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/438789/%E6%89%80%E6%9C%89%E7%BD%91%E9%A1%B5%E6%B7%BB%E5%8A%A0%E4%BA%8C%E6%AC%A1%E5%85%83%E5%B0%8F%E5%A7%90%E5%A7%90%EF%BC%88%E7%9C%8B%E6%9D%BF%E5%A8%98%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 注意：live2d_path 参数应使用绝对路径
    const live2d_path = "https://cdn.jsdelivr.net/gh/stevenjoezhang/live2d-widget@latest/";
    //const live2d_path = "/live2d-widget/";

    // 封装异步加载资源的方法
    function loadExternalResource(url, type) {
        return new Promise((resolve, reject) => {
            let tag;

            if (type === "css") {
                tag = document.createElement("link");
                tag.rel = "stylesheet";
                tag.href = url;
            }
            else if (type === "js") {
                tag = document.createElement("script");
                tag.src = url;
            }
            if (tag) {
                tag.onload = () => resolve(url);
                tag.onerror = () => reject(url);
                document.head.appendChild(tag);
            }
        });
    }

    // 加载 waifu.css live2d.min.js waifu-tips.js
    if (screen.width >= 768) {
        Promise.all([
            loadExternalResource(live2d_path + "waifu.css", "css"),
            loadExternalResource(live2d_path + "live2d.min.js", "js"),
            loadExternalResource(live2d_path + "waifu-tips.js", "js")
        ]).then(() => {
            initWidget({
                waifuPath: live2d_path + "waifu-tips.json",
                //apiPath: "https://live2d.fghrsh.net/api/",
                cdnPath: "https://cdn.jsdelivr.net/gh/fghrsh/live2d_api/"
            });
        });
    }


    // 让人物在右边
    let styleConfig = `
     #waifu{left:100% !important;transform:translateX(-100%) !important}
     #waifu:hover{transform:translateX(-100%) !important}
    `
    GM_addStyle(styleConfig)
})();