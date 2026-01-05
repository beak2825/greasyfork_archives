// ==UserScript==
// @name         掘金文章免登录展开全文
// @namespace    haseeer@gmail.com
// @version      0.1.3
// @description  显示全文
// @author       泥壕
// @match        https://juejin.im/post/*
// @downloadURL https://update.greasyfork.org/scripts/29251/%E6%8E%98%E9%87%91%E6%96%87%E7%AB%A0%E5%85%8D%E7%99%BB%E5%BD%95%E5%B1%95%E5%BC%80%E5%85%A8%E6%96%87.user.js
// @updateURL https://update.greasyfork.org/scripts/29251/%E6%8E%98%E9%87%91%E6%96%87%E7%AB%A0%E5%85%8D%E7%99%BB%E5%BD%95%E5%B1%95%E5%BC%80%E5%85%A8%E6%96%87.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function ready(fn) {
        if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading") {
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    }
    function clearBlock() {
        setTimeout(()=>{
            document.querySelector(".show-full").remove();
            document.querySelector(".show-full-block").remove();
            document.querySelector(".post-content-container").style.maxHeight = "";
        },300);
    }
    ready(clearBlock);
})();
