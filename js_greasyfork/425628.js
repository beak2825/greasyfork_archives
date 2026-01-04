// ==UserScript==
// @name         CC98 Tools - MathJax
// @namespace    https://www.cc98.org/
// @version      0.1.3
// @description  为CC98网页版添加MathJax数学公式支持
// @author       ml98
// @match        https://www.cc98.org/*
// @require      https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @require      https://greasyfork.org/scripts/2199-waitforkeyelements/code/waitForKeyElements.js?version=6349
// @downloadURL https://update.greasyfork.org/scripts/425628/CC98%20Tools%20-%20MathJax.user.js
// @updateURL https://update.greasyfork.org/scripts/425628/CC98%20Tools%20-%20MathJax.meta.js
// ==/UserScript==

// ref
// https://docs.mathjax.org/en/latest/web/configuration.html
// https://docs.mathjax.org/en/v2.7-latest/advanced/dynamic.html
// https://docs.mathjax.org/en/latest/advanced/typeset.html
// https://stackoverflow.com/a/45763146
// https://www.cc98.org/topic/2803718/695#4

var log = console.log; //function(){};

function loadMathJaxV2(){
    log("loadMathJax");
    let script = document.createElement("script");
    script.type = "text/x-mathjax-config";
    script.innerHTML =
        `MathJax.Hub.Config({
    // skipStartupTypeset: true,
    messageStyle: "none",
    "fast-preview": {disabled: true},
    extensions: ["tex2jax.js", "TeX/AMSmath.js"],
    jax: ["input/TeX", "output/HTML-CSS"],
    tex2jax: {
        inlineMath: [ ["$", "$"], ["[m]", "[/m]"]],
        displayMath: [ ['$$','$$'], ["[math]", "[/math]"] ],
        processEscapes: true,
        preview: "none"
    }
});`;
    document.head.appendChild(script);

    script = document.createElement('script');
    script.id = "MathJax-script";
    script.src = 'https://cdn.jsdelivr.net/npm/mathjax@2.7.8/MathJax.js?config=TeX-MML-AM_CHTML';
    document.head.appendChild(script);
}

function loadMathJaxV3(){
    log("loadMathJaxScript");
    let script = document.createElement('script');
    script.type = "text/x-mathjax-config";
    script[(window.opera ? "innerHTML" : "text")] =
        `window.MathJax = {
    tex: { inlineMath: [ ["{{","}}"] ],
            displayMath: [ ['$$','$$'], ["\\[","\\]"] ],
        processEscapes: true
    },
    svg: { fontCache: 'global'}
};`;
    document.head.appendChild(script);

    script = document.createElement('script');
    script.id = "MathJax-script";
    script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3.1.2/es5/tex-mml-chtml.js';
    document.head.appendChild(script);
}

function refresh(){
    log('refresh');
    if(!unsafeWindow.MathJax) init();
    else MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
}

function addRefreshButton(){
    'use strict';
    log("addRefreshButton");
    let essayProp = document.querySelector("#essayProp");
    if(essayProp){
        let btn = document.createElement("div");
        btn.className = "followTopic";
        btn.style = "width: 4.5rem;";
        btn.onclick = refresh;
        btn.textContent = "渲染公式";
        essayProp.appendChild(btn);
    }
}

function init(){
    'use strict';
    log("%cCC98 Tools - MathJax", "font-size: large");
    if(init.flag) return;
    init.flag = true;
    setTimeout(loadMathJaxV2, 100);
    setTimeout(addRefreshButton, 100);
}

waitForKeyElements("#\\31", init, true);
waitForKeyElements(".ubb-preview", refresh, false);
waitForKeyElements(".mde-preview", refresh, false);
