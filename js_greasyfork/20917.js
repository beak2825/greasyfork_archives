// ==UserScript==
// @name        Canal Zero Remove brighter
// @namespace   Canal Zero
// @description:en ccccccccc
// @include     http://*verplusonline.com/*
// @include     http://*.playerhd1.pw*
// @version     1
// @grant       none
// @description ccccccccc
// @downloadURL https://update.greasyfork.org/scripts/20917/Canal%20Zero%20Remove%20brighter.user.js
// @updateURL https://update.greasyfork.org/scripts/20917/Canal%20Zero%20Remove%20brighter.meta.js
// ==/UserScript==

//GM_addStyle("#divPanel { visibility: hidden !important; }");

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

////addGlobalStyle('.entryBody { max-width: 900px !important; }');
////addGlobalStyle('#feedlyFrame { width: 100% !important; }');
addGlobalStyle('#divPanel { visibility: hidden !important; }');

document.getElementById("divPanel").style.visibility="hidden";
document.getElementById('total').style.visibility="hidden";
document.getElementById('divpubli').style.visibility="hidden";
document.getElementById('mbody_ads').style.visibility="hidden";
