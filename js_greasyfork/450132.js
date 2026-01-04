// ==UserScript==
// @name         百度搜索屏蔽多余部分
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  第一次比着葫芦画瓢
// @author       老五
// @match        https://www.baidu.com/?tn=15007414_12_dg
// @match        https://www.baidu.com/
// @icon         http://zhouql.vip/images/icon/clear.png
// @grant        none
// @run-at       document-start
// @license      wwd all
// @downloadURL https://update.greasyfork.org/scripts/450132/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E5%B1%8F%E8%94%BD%E5%A4%9A%E4%BD%99%E9%83%A8%E5%88%86.user.js
// @updateURL https://update.greasyfork.org/scripts/450132/%E7%99%BE%E5%BA%A6%E6%90%9C%E7%B4%A2%E5%B1%8F%E8%94%BD%E5%A4%9A%E4%BD%99%E9%83%A8%E5%88%86.meta.js
// ==/UserScript==

(function () {

    // 在此处定义需要隐藏元素
    var clearElementArr = [
        '百度一下','.s-hotsearch-title','#bottom_layer','.title-text c-font-medium c-color-t','.s-top-nav','.s-hotsearch-title','.title-content-noindex','.s-center-box','#u1','#s-top-left','#s_side_wrapper'
    ];

    // 这是架子代码，不用改动
    console.log("准备隐藏以下元素 >>> " + clearElementArr);
    window.pageC = function (clearElements) {
        let style = document.createElement("style");
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