// ==UserScript==
// @name perplexity.ai without login use
// @namespace ykhr.m
// @version 1.0.1
// @description perplexity.ai をログインせずに使う際、右下のログインモジュールを非表示、時折出るモーダルを非表示
// @grant GM_addStyle
// @run-at document-start
// @match *://*.www.perplexity.ai/*
// @downloadURL https://update.greasyfork.org/scripts/502235/perplexityai%20without%20login%20use.user.js
// @updateURL https://update.greasyfork.org/scripts/502235/perplexityai%20without%20login%20use.meta.js
// ==/UserScript==

(function() {
let css = `
    .fixed.bottom-md.right-md.w-\\[300px\\]:has(svg.svg-inline--fa.fa-google)
    {
        display: none !important;
    }

/*     main > div > .fixed.bottom-0.left-0.right-0.top-0.z-30.flex.items-center.justify-center:has(svg.svg-inline--fa.fa-google)
    ,main > div > .items-stretch.fill-mode-both.fixed.bottom-0.left-0.right-0.top-0.z-30.animate-in.fade-in.ease-outExpo.duration-200
    {
        display: none;
    } */
    html{
        overflow: unset;
    }
/*     *{
        overflow: unset !important;
    } */
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
