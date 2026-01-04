// ==UserScript==
// @name         微信书架随机滚动
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  微信书架每隔十秒随机滚动
// @author       515235972@qq.com
// @match        https://weread.qq.com/web/shelf
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/438206/%E5%BE%AE%E4%BF%A1%E4%B9%A6%E6%9E%B6%E9%9A%8F%E6%9C%BA%E6%BB%9A%E5%8A%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/438206/%E5%BE%AE%E4%BF%A1%E4%B9%A6%E6%9E%B6%E9%9A%8F%E6%9C%BA%E6%BB%9A%E5%8A%A8.meta.js
// ==/UserScript==

function scrollIntoView(traget) {
    // const tragetElem = document.querySelector(traget);
    const tragetElem = traget;
    const tragetElemPostition = tragetElem.offsetTop;

    // 当前滚动高度
    let scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop;
    // 滚动step方法
    const step = function() {
        // 距离目标滚动距离
        let distance = tragetElemPostition - scrollTop;
        // 目标滚动位置
        scrollTop = scrollTop + distance / 5;
        if (Math.abs(distance) < 1) {
            window.scrollTo(0, tragetElemPostition);
        } else
        {
            window.scrollTo(0, scrollTop);
            setTimeout(step, 20);
        }
    };
    step();
}

(function() {
    'use strict';

    var interval;
    var oldTop;
    var busy = false;

    // document.body.parentNode.style.overflowY= "hidden";

    if (window.location.href == "https://weread.qq.com/web/shelf") {
        interval = setInterval(function() {
            var bookCovers = document.getElementsByClassName("wr_bookCover","cover");
            var randomBookIndex = Math.floor(Math.random() * bookCovers.length);
            scrollIntoView(bookCovers[randomBookIndex]);
        }, 10*1000)
    }
})();
