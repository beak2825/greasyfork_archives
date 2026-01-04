// ==UserScript==
// @name         latex
// @namespace    http://*.*/*
// @version      0.5
// @description  parse latex for wikipedia
// @author       yulinfeng.mail@foxmail.com
// @match         https://chat.openai.com/*
// @match        https://*.wikipedia.org/*
// @match        https://*.reddit.com/*
// @match        https://*.quora.com/*
// @match        http://*.reddit.com/*
// @match        http://*.quora.com/*
// @match        http://*.wikipedia.org/*
// @match        https://www.bing.com/search?*
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/404735/latex.user.js
// @updateURL https://update.greasyfork.org/scripts/404735/latex.meta.js
// ==/UserScript==
(function() {
    if (window.MathJax === undefined) {
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.7/MathJax.js?config=TeX-MML-AM_CHTML";
        var config = 'MathJax.Hub.Config({' + 'extensions: ["tex2jax.js"],' + 'tex2jax: { inlineMath: [["$","$"],["\\\\\\\\\\\\(","\\\\\\\\\\\\)"]], displayMath: [["$$","$$"],["\\\\[","\\\\]"]], processEscapes: true },' + 'jax: ["input/TeX","output/HTML-CSS"]' + '});' + 'MathJax.Hub.Startup.onload();';
        if (window.opera) {
            script.innerHTML = config
        } else {
            script.text = config
        }
        document.getElementsByTagName("head")[0].appendChild(script);
    } else {
        MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
    }
})();