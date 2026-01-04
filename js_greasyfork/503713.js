// ==UserScript==
// @name         51cto屏蔽不登录不让复制
// @version      1.0.1
// @namespace    http://tampermonkey.net/
// @description  xt
// @license      MIT
// @author       xt
// @match        *://blog.51cto.com/*
// @connect      blog.51cto.com
// @require      https://static2.51cto.com/edu/sa-sdk-js/sensorsdata.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=51cto.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/503713/51cto%E5%B1%8F%E8%94%BD%E4%B8%8D%E7%99%BB%E5%BD%95%E4%B8%8D%E8%AE%A9%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/503713/51cto%E5%B1%8F%E8%94%BD%E4%B8%8D%E7%99%BB%E5%BD%95%E4%B8%8D%E8%AE%A9%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log("开始执行51cto屏蔽不登录不让复制脚本")

    console.log("window.addEventListener 执行")
    window.articleCopy_xt = function originalCopyHandler() {
        return true
    }

    let intervalId = setInterval(() => {
        if (window.articleCopy != null && window.articleCopy !== 'undefined') {
            window.articleCopy = window.articleCopy_xt;
            clearEvent()
            clearInterval(intervalId)
        }
    }, 10)


    function clearEvent() {
        let count = 0
        let intervalId = setInterval(() => {
            $("#result").off("copy")
            let wrap = $(".article-content-wrap")
            wrap.off("copy")
            wrap.bind("copy", window.articleCopy_xt);
            wrap.off("keydown")
            wrap.bind("keydown", keydownCopyHandel)
            if (count > 100) {
                clearInterval(intervalId)
            }
            count++
            console.log("重置copy函数")
        }, 10)
    }

    function keydownCopyHandel(t) {
        if (t.preventDefault(),
            t.stopPropagation(),
        t.ctrlKey && 67 === t.keyCode) {
            try {
                var selectedText = window.getSelection()
                    .toString();
                copyToClipboard(selectedText)
                console.log('Copied text:', selectedText)
            } catch (t) {
                console.log(t)
            }
            return true
        }
    }

// language-markdown

    function copyToClipboard(text) {
        var textarea = document.createElement('textarea')
        textarea.value = text
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand('copy')
        document.body.removeChild(textarea)
    }

})
();
