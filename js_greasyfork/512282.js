// ==UserScript==
// @name         微信PC横屏网页旋转
// @description  针对微信PC上横屏的长图文章，从此不用歪脖子了😁
// @namespace    http://study365.free.nf
// @version      2
// @match        https://mp.weixin.qq.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/512282/%E5%BE%AE%E4%BF%A1PC%E6%A8%AA%E5%B1%8F%E7%BD%91%E9%A1%B5%E6%97%8B%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/512282/%E5%BE%AE%E4%BF%A1PC%E6%A8%AA%E5%B1%8F%E7%BD%91%E9%A1%B5%E6%97%8B%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
    let div = document.createElement("div");
    div.innerHTML = "<div style='z-index:999999999999;position:fixed;top:0;right:0;padding:5px;background:rgba(0,255,0,0.5);color:blue;cursor:pointer;'><span id='b123456789' title='旋转后请横着拖动页面查看'>旋转页面</span></div>";
    document.body.appendChild(div);
    let b1=document.getElementById('b123456789');
    b1.addEventListener('click', function(event) {
        document.body.style.cssText+='-webkit-transform:rotate(-90deg);-moz-transform:rotate(-90deg);height:700px';
    });
})();