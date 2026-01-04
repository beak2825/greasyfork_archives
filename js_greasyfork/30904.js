// ==UserScript==
// @name        MathJax on 小説になろう・ハーメルン
// @description Enables use of MathJax on 小説になろう・ハーメルン
// @include     http://*syosetu.com/*
// @include     http://*syosetu.org/*
// @version     0.1
// @grant       none
// @namespace https://greasyfork.org/users/135617
// @downloadURL https://update.greasyfork.org/scripts/30904/MathJax%20on%20%E5%B0%8F%E8%AA%AC%E3%81%AB%E3%81%AA%E3%82%8D%E3%81%86%E3%83%BB%E3%83%8F%E3%83%BC%E3%83%A1%E3%83%AB%E3%83%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/30904/MathJax%20on%20%E5%B0%8F%E8%AA%AC%E3%81%AB%E3%81%AA%E3%82%8D%E3%81%86%E3%83%BB%E3%83%8F%E3%83%BC%E3%83%A1%E3%83%AB%E3%83%B3.meta.js
// ==/UserScript==

function loadMathJax() {
    var mathjax = document.createElement('script');
    var mathjaxconf=document.createElement('script');
    var head    = (document.head) ? document.head : document.querySelector('head');
    mathjaxconf.setAttribute("type","text/x-mathjax-config");
    mathjaxconf.innerHTML=[
        'MathJax.Hub.Config({',
        'jax: ["input/TeX","output/HTML-CSS"],',
        'extensions: ["tex2jax.js"],',
        'tex2jax: {',
        'inlineMath: [["$","$"],["\\\\(","\\\\)"]],',
        'displayMath: [ ["$$","$$"], ["\\\\[","\\\\]"] ],',
        'processEscapes: true,',
        'processEnvironments: true',
        '},',
        //'TeX: {',
        //'extensions: ["AMSmath.js"],',
        //'equationNumbers: {  autoNumber: "AMS"  },  //automatic eqn numbering !!!',
        //'noErrors: { disabled: true }',
        //'}',
        '});'
    ].join("\n");
    mathjax.setAttribute("type", "text/javascript");
    mathjax.setAttribute("src", "https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/MathJax.js?config=TeX-MML-AM_CHTML");
    mathjax.async=true;
    head.appendChild(mathjaxconf);
    head.appendChild(mathjax);
}

loadMathJax();