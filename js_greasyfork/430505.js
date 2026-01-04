// ==UserScript==
// @name         Gmail Inbox Narrower
// @description  Limits the size of inbox to 1200px
// @version      1.0
// @include      https://mail.google.com/*
// @namespace https://greasyfork.org/users/153157
// @downloadURL https://update.greasyfork.org/scripts/430505/Gmail%20Inbox%20Narrower.user.js
// @updateURL https://update.greasyfork.org/scripts/430505/Gmail%20Inbox%20Narrower.meta.js
// ==/UserScript==

function GM_addStyle_from_string(str) {
    var node = document.createElement('style');
    node.innerHTML = str;
    document.body.appendChild(node);
}
GM_addStyle_from_string(`
  .nH.bkK.nn {
    width: 1200px !important;
    margin: 0 auto;
  }
`);