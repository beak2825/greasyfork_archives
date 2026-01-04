// ==UserScript==
// @name        LGBT remover torn
// @namespace   LGBT remover torn
// @description Purges LGBT flag from the top left icon
// @match     http*://www.torn.com/*
// @match     http*://torn.com/*
// @version 0.0.1.20230625040233
// @downloadURL https://update.greasyfork.org/scripts/469404/LGBT%20remover%20torn.user.js
// @updateURL https://update.greasyfork.org/scripts/469404/LGBT%20remover%20torn.meta.js
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
addGlobalStyle('#tcLogo.logo { background-image: url(/images/v2/torn_logo/dark_mode/regular/desktop/logo@1x.webp) !important; }');