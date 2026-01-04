// ==UserScript==
// @name         HioDoc Helper
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  help you better to read
// @author       yaochuan
// @match        https://hio.oppo.com/app/ozone/*
// @icon         https://hio.oppo.com/user/user.png
// @grant        GM_addStyle
// @run-at       document-end
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/447532/HioDoc%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/447532/HioDoc%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('########## start');

    // 侧边栏左移
    let css = `
        .leftHoverButton {
            left:0% !important;
            margin-left:1px !important
        }
    `
    GM_addStyle(css);

    // 阅读区域宽度调整
    var kmContent = document.querySelector('body > div.xyd-wrapper > div');
    kmContent.style.width = "90%";

    // 阅读区域高度调整
    var documentContent = document.querySelector('#documentContent');
    documentContent.style.height = document.body.clientHeight + 'px';
    console.log('########## clientHeight=%d', document.body.clientHeight);

    // 标题增加新页面打开
    var elem3 = document.querySelector('body > div.ozoneDetailHeader > div');
    let open = document.createElement('a');
    open.classList.add("title-class");
    open.innerHTML = ' 新页面打开';
    open.onclick = function(event) {
        var e = document.getElementById('office-iframe');
        window.open(e.src,'_blank');
        console.log('########## %s, %s', typeof e, e.src);
    }
    elem3.append(' |   \t\t\t\t\t\t\t\t\t');
    elem3.appendChild(open);

    // todo: auto scroll
    console.log('########## done');
})();

function animateScroll(element, speed) {
    let rect = element.getBoundingClientRect();
    //获取元素相对窗口的top值，此处应加上窗口本身的偏移
    let top = window.pageYOffset + rect.top;
    let currentTop = 0;
    let requestId;
    //采用requestAnimationFrame，平滑动画
    function step(timestamp) {
        currentTop += speed;
        if(currentTop <= top){
            window.scrollTo(0, currentTop);
            requestId=window.requestAnimationFrame(step);
        }else{
            window.cancelAnimationFrame(requestId);
        }
    }
    window.requestAnimationFrame(step);
}
