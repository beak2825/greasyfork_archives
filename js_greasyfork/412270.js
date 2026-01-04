// ==UserScript==
// @name         Torn: Bigger Activity Log
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Overwrite CSS to make activity log bigger
// @author       Untouchable [1360035]
// @match        https://www.torn.com/*
// @downloadURL https://update.greasyfork.org/scripts/412270/Torn%3A%20Bigger%20Activity%20Log.user.js
// @updateURL https://update.greasyfork.org/scripts/412270/Torn%3A%20Bigger%20Activity%20Log.meta.js
// ==/UserScript==

GM_addStyle ( `

.recentHistory {
  left: -900px !important;
  width: 1000px !important;
  height:700px
}

.scrollArea{
  height:7000px;
  max-height:700px !important;
}

.scrollArea___2f-9H {
  max-height:700px !important;
}

`);

function GM_addStyle (cssStr) {
    var D = document;
    var newNode = D.createElement ('style');
    newNode.textContent = cssStr;

    var targ = D.getElementsByTagName ('head')[0] || D.body || D.documentElement;
    targ.appendChild (newNode);
}