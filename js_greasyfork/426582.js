// ==UserScript==
// @name           Glassdoor Paywall Remover Patched
// @description    Hide the Glassdoor Paywall & Remove Scroll Lock
// @author         dcodebro <noreply@noreply.org>
// @version        1.0
// @include        http*://*glassdoor.*
// @namespace      http://www.greasyfork.org
// @downloadURL https://update.greasyfork.org/scripts/426582/Glassdoor%20Paywall%20Remover%20Patched.user.js
// @updateURL https://update.greasyfork.org/scripts/426582/Glassdoor%20Paywall%20Remover%20Patched.meta.js
// ==/UserScript==

// original userscript:
// https://greasyfork.org/en/scripts/405624-glassdoor-paywall-remover
// patch code credit:
// https://antonio-ramadas.github.io/blog/2021/01/29/that-one-script-that-makes-glassdoor-browsable/

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

addGlobalStyle("#HardsellOverlay {display:none !important;}");
addGlobalStyle("body {overflow:auto !important;}");

window.addEventListener("scroll", event => event.stopPropagation(), true);
window.addEventListener("mousemove", event => event.stopPropagation(), true);

