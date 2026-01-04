// ==UserScript==
// @name        DGG chat is not YouTube chat
// @namespace   Violentmonkey Scripts
// @match       https://www.destiny.gg/bigscreen
// @match       https://www.destiny.gg/bigscreen*
// @match       https://www.destiny.gg/embed/chat
// @grant       none
// @version     1.0
// @author      mif
// @license     MIT
// @description 2024-11-28, remove subscriptions from the top of the chat
// @downloadURL https://update.greasyfork.org/scripts/519091/DGG%20chat%20is%20not%20YouTube%20chat.user.js
// @updateURL https://update.greasyfork.org/scripts/519091/DGG%20chat%20is%20not%20YouTube%20chat.meta.js
// ==/UserScript==

function GM_addStyle (cssStr) {
    var D               = document;
    var newNode         = D.createElement ('style');
    newNode.textContent = cssStr;

    var targ    = D.getElementsByTagName ('head')[0] || D.body || D.documentElement;
    targ.appendChild (newNode);
}

// Generic removal of events
// GM_addStyle('#chat-event-bar { display: None!important; }');

// Special T5 only subscriptions removal :)
// GM_addStyle('#chat-event-bar > div.event-bar-event.subscription.rainbow-border { display: None!important; }');

// Generic removal of subscriptions
GM_addStyle('#chat-event-bar > div.event-bar-event.subscription { display: None!important; }');
