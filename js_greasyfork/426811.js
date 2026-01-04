// ==UserScript==
// @name       MathJax for All
// @version    0.4
// @description Uses MathJax to properly display LaTeX code, on any site
// @namespace 1993.uk
// @match https://mail.google.com/*
// @match file:///*
// @downloadURL https://update.greasyfork.org/scripts/426811/MathJax%20for%20All.user.js
// @updateURL https://update.greasyfork.org/scripts/426811/MathJax%20for%20All.meta.js
// ==/UserScript==
if (window.MathJax === undefined) {
    var mjscr = document.createElement("script");
    mjscr.type = "text/javascript";
    mjscr.src = "https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/MathJax.js";
    mjscr.text = 'MathJax.Hub.Config({extensions:["tex2jax.js"],'+"tex2jax:{inlineMath:[['$','$']]"
        +',skipTags:["script","noscript","pre","code"]},jax:["input/TeX","output/CommonHTML"],'
        +'TeX:{extensions:["autoload-all.js","noUndefined.js"]}'
        +'});MathJax.Hub.Startup.onload();';
    document.getElementsByTagName("head")[0].appendChild(mjscr);

    (new MutationObserver(function(mutationsList, observer) {
        let el = [];
        for (const mutation of mutationsList) {
            const node = mutation.addedNodes.item(0);
            if (node === null || node.nodeType !== 1 || node.className == "MathJax_Preview" || node.id.substring(0,7) == "MathJax" || node.className.substring(0,4) == "mjx-" || node.isContentEditable) break;
            if (node.offsetParent !== null && node.innerText != "") el.push(node);
        }
        if (el.length != 0) MathJax.Hub.Queue(["Typeset", MathJax.Hub,el,{}]);
    })).observe(document,{subtree: true, childList: true});
}