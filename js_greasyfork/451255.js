// ==UserScript==
// @name         让csdn不登陆也能复制代码
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  让你不登陆csdn也能复制里面的代码
// @author       You
// @match        **://**.csdn.net/**
// @icon         https://www.google.com/s2/favicons?sz=64&domain=csdn.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/451255/%E8%AE%A9csdn%E4%B8%8D%E7%99%BB%E9%99%86%E4%B9%9F%E8%83%BD%E5%A4%8D%E5%88%B6%E4%BB%A3%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/451255/%E8%AE%A9csdn%E4%B8%8D%E7%99%BB%E9%99%86%E4%B9%9F%E8%83%BD%E5%A4%8D%E5%88%B6%E4%BB%A3%E7%A0%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    function tick() {
        // find copy buttons and replace sign event.
        let buttons = document.getElementsByClassName("hljs-button");
        let size = buttons.length;
        for (let buttonIdx = 0; buttonIdx < size; ++buttonIdx) {
            try {
                let button = buttons[buttonIdx];
                let dataTitle;
                for (let idx in button.attributes) {
                    if (button.attributes[idx].nodeName === "data-title") {
                        button.attributes[idx].value = "Copy";
                        dataTitle = button.attributes[idx];
                    } else if (button.attributes[idx].nodeName === "onclick") {
                        button.attributes[idx].value = "hljs.copyCode(event);";
                    }
                }
                button.onclick = (event) => {
                    let code = event.target.parentElement.innerText;
                    if (navigator.clipboard.writeText(code) && dataTitle) {
                        dataTitle.value = "Success";
                    } else {
                        dataTitle.value = "Failed";
                    }
                    setTimeout(() => {
                        let divs = document.getElementsByClassName("passport-login-container");
                        for (let idx in divs) {
                            try {
                                let div = divs[idx];
                                div.remove();
                            } catch (err) { }
                        }
                    }, 100);
                    setTimeout(() => {
                        if (dataTitle) {
                            dataTitle.value = "Copy";
                        }
                    }, 1000);
                }
            } catch (err) {}
        }
        // auto click show more code.
        buttons = document.getElementsByClassName("hide-preCode-bt");
        size = buttons.length;
        for (let buttonIdx = 0; buttonIdx < size; ++buttonIdx) {
            let button = buttons[buttonIdx];
            button.click();

        }

        // allow to select text in pre tag
        let pres = document.getElementsByTagName("pre");
        for (let idx in pres) {
            try {
                let pre = pres[idx];
                pre.style = "user-select: auto"
            } catch (err) {}
        }

        // allow to select text in code tag
        let codes = document.getElementsByTagName("code");
        for (let idx in codes) {
            try {
                let code = codes[idx];
                code.style = "user-select: auto"
            } catch (err) {}
        }
    }

    setInterval(tick, 1000);

})();