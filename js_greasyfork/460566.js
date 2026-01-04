// ==UserScript==
// @name         网页latex公式解析(解决ChatGPT回答的latex格式无法解析)
// @namespace    http://tampermonkey.net/
// @version      1.4.1
// @description  hello！
// @author       season
// @match              https://chat.openai.com/*
// @match              https://www.bing.com/search?*
// @match              https://you.com/search?*&tbm=youchat*
// @match              https://www.you.com/search?*&tbm=youchat*
// @icon               https://chat.openai.com/favicon.ico
// @license GPL
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @run-at             document-end
// @downloadURL https://update.greasyfork.org/scripts/460566/%E7%BD%91%E9%A1%B5latex%E5%85%AC%E5%BC%8F%E8%A7%A3%E6%9E%90%28%E8%A7%A3%E5%86%B3ChatGPT%E5%9B%9E%E7%AD%94%E7%9A%84latex%E6%A0%BC%E5%BC%8F%E6%97%A0%E6%B3%95%E8%A7%A3%E6%9E%90%29.user.js
// @updateURL https://update.greasyfork.org/scripts/460566/%E7%BD%91%E9%A1%B5latex%E5%85%AC%E5%BC%8F%E8%A7%A3%E6%9E%90%28%E8%A7%A3%E5%86%B3ChatGPT%E5%9B%9E%E7%AD%94%E7%9A%84latex%E6%A0%BC%E5%BC%8F%E6%97%A0%E6%B3%95%E8%A7%A3%E6%9E%90%29.meta.js
// ==/UserScript==



(function() {
    'use strict';
    // Load MathJax library
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.7/MathJax.js?config=TeX-AMS_HTML";
    document.getElementsByTagName("head")[0].appendChild(script);

    // Configure MathJax to render LaTeX formulas
    window.MathJax = {
        tex2jax: {
            inlineMath: [ ['$','$'], ['\\(','\\)'] ],
            processEscapes: true
        },
        CommonHTML: { scale: 100 }
    };

    // Wait for MathJax to load and render LaTeX formulas
    var checkLoaded = setInterval(function() {
        if (typeof MathJax !== "undefined" && MathJax.Hub.queue.queue.length === 0) {
            clearInterval(checkLoaded);
            MathJax.Hub.Queue(["Typeset", MathJax.Hub, document.body]);
        }
    }, 100);

    // Listen for changes to the page content and re-render LaTeX formulas
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === "childList" || mutation.type === "subtree") {
                MathJax.Hub.Queue(["Typeset", MathJax.Hub, mutation.target]);
            }
        });
    });
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
