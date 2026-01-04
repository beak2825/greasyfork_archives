// ==UserScript==
// @name           Glassdoor Paywall Remover
// @description    Hide the Glassdoor Paywall
// @author         Bernardas Ališauskas <bernardas.alisauskas@pm.me>
// @version        1.0
// @include        http*://*glassdoor.*
// @namespace      http://www.greasyfork.org
// @downloadURL https://update.greasyfork.org/scripts/405624/Glassdoor%20Paywall%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/405624/Glassdoor%20Paywall%20Remover.meta.js
// ==/UserScript==

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
function disableScrollHack(){
    window.onscroll = null;
}
disableScrollHack();
window.addEventListener(
    'load', 
    disableScrollHack,
    true);
