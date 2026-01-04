// ==UserScript==
// @name         个性化去广告升级配置版
// @namespace    http://tampermonkey.net/
// @version      1.2.3
// @description  写了一个小架子，不管你是编程老手还是小白，都可以根据这个架子定制自己的网站净化
// @author       王子周棋洛
// @match        https://blog.csdn.net/*/article/details/*
// @match        https://www.baidu.com/
// @match        https://www.zhihu.com/explore
// @match        https://www.zhihu.com/question/*
// @match        https://zhuanlan.zhihu.com/p/*
// @match        https://webpack.docschina.org/concepts/
// @icon         http://zhouql.vip/images/icon/clear.png
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/452077/%E4%B8%AA%E6%80%A7%E5%8C%96%E5%8E%BB%E5%B9%BF%E5%91%8A%E5%8D%87%E7%BA%A7%E9%85%8D%E7%BD%AE%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/452077/%E4%B8%AA%E6%80%A7%E5%8C%96%E5%8E%BB%E5%B9%BF%E5%91%8A%E5%8D%87%E7%BA%A7%E9%85%8D%E7%BD%AE%E7%89%88.meta.js
// ==/UserScript==

// 这个版本做了性能优化，简单版本将配置全部注入，这个版本会在特定的网站上注入特定的配置
// 只是配置有了约束，使用了对象配置，对象的key就是网站域名，value是一个数组，数组的值就是需要隐藏的元素
(function () {
    // 只需要在此处定义需要隐藏元素
    var clearElementArr = [
        // csdn
        { "csdn.net": ['.passport-container', '.passport-login-mark'] },
        // 知乎
        { "zhihu.com": ['.css-1izy64v', '.css-ysn1om', '.Modal-wrapper'] },
        // 百度搜索
        { "baidu.com": ['#s-top-left', '#s_top_wrap', '.s-top-right', '#s_main', '.s-bottom-layer-content'] },
        // webpack官网
        { "webpack.docschina.org": ['.sponsors']}
    ];

    // 这是架子代码，不用改动
    console.log("准备隐藏以下元素 >>> " + clearElementArr);
    let style = document.createElement("style");
    window.location.href.includes("zhihu.com") ? style.innerText += `html {overflow: auto !important;} ` : '';
    window.pageC = function (clearElements) {
        if (typeof (clearElements) === "object") {
            clearElementArr.forEach(o => {
                let key = Object.keys(o);
                if (window.location.href.includes(key)) {
                    o[key].forEach(el => {
                        style.innerText += `${el} {display: none !important;} `;
                    })
                }
            })
        } else {
            console.error("param error,require array!");
        }
        style.innerText != '' ? document.head.appendChild(style) : '';
    };
    pageC(clearElementArr);
    console.log("清理完成！");
})();

