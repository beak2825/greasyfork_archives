// ==UserScript==
// @name         禅道粘贴图片去重
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  解决禅道备注中粘贴图片重复的问题
// @author       You
// @match        *://*/zentao/*
// @icon         https://www.zentao.net/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/471747/%E7%A6%85%E9%81%93%E7%B2%98%E8%B4%B4%E5%9B%BE%E7%89%87%E5%8E%BB%E9%87%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/471747/%E7%A6%85%E9%81%93%E7%B2%98%E8%B4%B4%E5%9B%BE%E7%89%87%E5%8E%BB%E9%87%8D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener("load", function() {
        createCommentBoxListen()
    })

    // 监听编辑框插入
    function listenImgInsert() {
        var elementToObserve = this.querySelector(".article-content");
        var observer = new MutationObserver(() => {
            removeImg.apply(this)
        });
        elementToObserve && observer.observe(elementToObserve, { subtree: true, childList: true });
    }

    // 删除多余图片
    function removeImg() {
        this.querySelectorAll(".article-content img").forEach(function(img) {
            if (img.hasAttribute("data-ke-src") && img.getAttribute("src").indexOf("base64") > -1) {
                img.remove()
            }
        })
    }

    // 批量监听评论框操作
    function createCommentBoxListen() {
        document.querySelectorAll("iframe").forEach(iframe => {
            var doc = iframe.contentWindow.document
            listenImgInsert.apply(doc)
        })
    }

})();