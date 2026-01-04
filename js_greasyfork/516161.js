// ==UserScript==
// @name         扇贝快捷键映射
// @namespace    https://skymkmk.com/
// @version      v1.0.0
// @description  将快捷键 9（太简单按钮）映射到 3 上
// @author       skymkmk
// @match        https://web.shanbay.com/wordsweb/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/516161/%E6%89%87%E8%B4%9D%E5%BF%AB%E6%8D%B7%E9%94%AE%E6%98%A0%E5%B0%84.user.js
// @updateURL https://update.greasyfork.org/scripts/516161/%E6%89%87%E8%B4%9D%E5%BF%AB%E6%8D%B7%E9%94%AE%E6%98%A0%E5%B0%84.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.addEventListener("keydown", (e) => {
        if(e.key === "3") {
            const event = new KeyboardEvent("keydown", {
                key: "9"
            });
            document.dispatchEvent(event);
        }
    });
})();