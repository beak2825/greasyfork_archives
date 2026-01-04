// ==UserScript==
// @name 無盡可樂漫畫
// @namespace http://tampermonkey.net/
// @version 2026
// @description 一直往下滾一直看
// @author 貓咪不作戰
// @match https://www.colamanga.com/*
// @icon https://www.google.com/s2/favicons?sz=64&domain=colamanga.com
// @grant none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/488450/%E7%84%A1%E7%9B%A1%E5%8F%AF%E6%A8%82%E6%BC%AB%E7%95%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/488450/%E7%84%A1%E7%9B%A1%E5%8F%AF%E6%A8%82%E6%BC%AB%E7%95%AB.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var styleElement = document.createElement("style");
    styleElement.appendChild(document.createTextNode(" ::-webkit-scrollbar {-webkit-appearance: none;width: 0px;}"));
    setTimeout(()=>{
        styleElement.appendChild(document.createTextNode(" ::-webkit-scrollbar {-webkit-appearance: none;width: 0px;}"));
    },1000);

    document.getElementsByTagName("head")[0].appendChild(styleElement);
    var newDiv = null;
    var url = window.location.href;
    var frontUrl;
    var lastSlashIndex = url.lastIndexOf('/');
    frontUrl = url.substring(0, lastSlashIndex);
    //alert(frontUrl);
    var lastSlashIndex2 = url.lastIndexOf('.html');
    var now = parseInt(url.substring(lastSlashIndex + 1, lastSlashIndex2));
    //alert(now);
    if (isNaN(now)) return;
    //alert(now);
    var last = now + 1;
    //alert(last);

    document.querySelector("body > div:nth-child(1)").style.display = "none";
    document.querySelector("body > div:nth-child(7)").style.display = "none";

    window.addEventListener('message', function (event) {
        if (event.data.action === 'changeUrl') {
            history.replaceState({}, '', event.data.newUrl);
        }
    });
    let a = setInterval(() => {
        endToBottom();
    }, 500);

    function endToBottom() {
        if (isScrollAtBottom()) {
            clearInterval(a);

            var xx = frontUrl + "/" + last + ".html";

            window.top.postMessage({ action: 'changeUrl', newUrl: new URL(xx).pathname }, '*');

            x(xx); //alert(xx);
        }
    };

    function x(url) {
        //alert(response);
        newDiv = document.createElement("iframe");
        //newDiv.className = "iframeX";
        newDiv.src = url;
        newDiv.style.cssText = ` display: block;
border: none;
height: calc(100vh);
width: 100%;`;
        document.body.appendChild(newDiv);
    }

    var allLinks = document.querySelectorAll('a');

    // 遍历所有链接，为其添加点击事件监听器
    allLinks.forEach(function (link) {
        link.addEventListener('click', function (event) {
            // 阻止默认行为，即防止跳转
            event.preventDefault();

            var linkURL = event.target.href;
            window.top.location.href = linkURL;
        });
    });

    function isScrollAtBottom() {
        const documentHeight = document.documentElement.scrollHeight;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        return scrollTop + windowHeight >= documentHeight;
    }

    function isMouseInIframe(iframe, event) {
        var iframeElement = iframe;
        var iframeRect = iframeElement.getBoundingClientRect();
        var mouseX = event.clientX;
        var mouseY = event.clientY;

        return (
            mouseX >= iframeRect.left &&
            mouseX <= iframeRect.right &&
            mouseY >= iframeRect.top &&
            mouseY <= iframeRect.bottom
        );
    }
})();