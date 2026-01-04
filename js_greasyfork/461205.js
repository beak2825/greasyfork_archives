// ==UserScript==
// @name         LaTeX Formula Parser (Suitable for ChatGPT,NewBing,You,etc.)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  hello！LaTeX Formula Parser  (solving the issue of incapability of Chat GPT, Bing, YOU models to parse La Te X formats in their answers)
// @author       season
// @match        *://*/*
// @license GPL
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @run-at             document-end
// @downloadURL https://update.greasyfork.org/scripts/461205/LaTeX%20Formula%20Parser%20%28Suitable%20for%20ChatGPT%2CNewBing%2CYou%2Cetc%29.user.js
// @updateURL https://update.greasyfork.org/scripts/461205/LaTeX%20Formula%20Parser%20%28Suitable%20for%20ChatGPT%2CNewBing%2CYou%2Cetc%29.meta.js
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