// ==UserScript==
// @name        DGG chat - no new ✨
// @namespace   Violentmonkey Scripts
// @match       https://www.destiny.gg/bigscreen
// @match       https://www.destiny.gg/bigscreen*
// @match       https://www.destiny.gg/embed/chat
// @grant       none
// @version     1.0
// @author      mif
// @license     MIT
// @description 2024-11-28, imagine still waiting for native features in DGG - LMAO
// @downloadURL https://update.greasyfork.org/scripts/523420/DGG%20chat%20-%20no%20new%20%E2%9C%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/523420/DGG%20chat%20-%20no%20new%20%E2%9C%A8.meta.js
// ==/UserScript==

function css_overwrite (cssStr) {
    var D               = document;
    var newNode         = D.createElement ('style');
    newNode.textContent = cssStr;

    var targ    = D.getElementsByTagName ('head')[0] || D.body || D.documentElement;
    targ.appendChild (newNode);
}

css_overwrite('.msg-chat.msg-user.flair58       { display:none!important; }');
