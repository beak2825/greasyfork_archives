// ==UserScript==
// @name         chatgpt - 调整chat宽度
// @namespace    http://tampermonkey.net/
// @version      2024-07-19
// @description  调整chatgpt的对话框宽度
// @author       pan
// @match        https://chatgpt.com/c/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chatgpt.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/501664/chatgpt%20-%20%E8%B0%83%E6%95%B4chat%E5%AE%BD%E5%BA%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/501664/chatgpt%20-%20%E8%B0%83%E6%95%B4chat%E5%AE%BD%E5%BA%A6.meta.js
// ==/UserScript==

(function() {

    function applyStyles() {
        // console.log("applyStyles");
        const targetElements = document.querySelectorAll("div.xl\\:max-w-\\[48rem\\]");

        targetElements.forEach(element => {
            const style = window.getComputedStyle(element);
            const maxWidth = style.maxWidth;
            // console.log("Max width of element:", maxWidth);
            if (maxWidth != "1900px"){
                console.log("Max width of element:", maxWidth, ", set to 1900px");
                element.style.maxWidth = "1900px";
            }
        });
    }

    setInterval(function(){
        applyStyles();
    }, 1000);
})();


