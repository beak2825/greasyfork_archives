// ==UserScript==
// @name         定制网站去广告净化架子
// @namespace    http://tampermonkey.net/
// @version      1.2.8
// @description  写了一个小架子，不管你是编程老手还是小白，都可以根据这个架子定制自己的网站净化
// @author       王子周棋洛
// @match        https://blog.csdn.net/*/article/details/*
// @match        https://www.baidu.com/
// @match        https://www.baidu.com/s*
// @match        https://www.zhihu.com/explore
// @match        https://www.zhihu.com/question/*
// @match        https://zhuanlan.zhihu.com/*
// @icon         http://zhouql.vip/images/icon/clear.png
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/449990/%E5%AE%9A%E5%88%B6%E7%BD%91%E7%AB%99%E5%8E%BB%E5%B9%BF%E5%91%8A%E5%87%80%E5%8C%96%E6%9E%B6%E5%AD%90.user.js
// @updateURL https://update.greasyfork.org/scripts/449990/%E5%AE%9A%E5%88%B6%E7%BD%91%E7%AB%99%E5%8E%BB%E5%B9%BF%E5%91%8A%E5%87%80%E5%8C%96%E6%9E%B6%E5%AD%90.meta.js
// ==/UserScript==

(function () {

    // 只需要在此处定义需要隐藏元素
    var clearElementArr = [
        'csdn', '.passport-container', 'passport-login-mark',
        '知乎', '.css-1izy64v', '.css-ysn1om','.Modal-wrapper','.signFlowModal','.Modal-backdrop',
        '百度搜索', '#s-top-left', '#s_top_wrap', '.s-top-right', '#s_main', '.s-bottom-layer-content','#content_right'
    ];

    // 这是架子代码，不用改动
    console.log("准备隐藏以下元素 >>> " + clearElementArr);

    window.pageC = function (clearElements) {
        let style = document.createElement("style");
        style.innerText += `html {overflow: auto !important;} `;
        if (typeof (clearElements) === "object") {
            clearElements.forEach(cE => {
                style.innerText += `${cE} {display: none !important;} `
            });
        } else { 
            console.error("param error,require array!"); 
        }
        document.head.appendChild(style);
    };
    pageC(clearElementArr);
    console.log("清理完成！");
})();