// ==UserScript==
// @name        Fuck April 1st DGG Chat CSS
// @namespace   Violentmonkey Scripts
// @match       https://www.destiny.gg/bigscreen
// @match       https://www.destiny.gg/bigscreen*
// @match       https://www.destiny.gg/embed/chat
// @match       https://www.omniliberal.dev/bigscreen
// @match       https://www.omniliberal.dev/bigscreen*
// @match       https://www.omniliberal.dev/embed/chat
// @grant       none
// @version     1.0.1
// @author      mif
// @license     MIT
// @description 04/01/2025, OBAMNA
// @downloadURL https://update.greasyfork.org/scripts/531511/Fuck%20April%201st%20DGG%20Chat%20CSS.user.js
// @updateURL https://update.greasyfork.org/scripts/531511/Fuck%20April%201st%20DGG%20Chat%20CSS.meta.js
// ==/UserScript==

function GM_addStyle (cssStr) {
    var D               = document;
    var newNode         = D.createElement ('style');
    newNode.textContent = cssStr;

    var targ    = D.getElementsByTagName ('head')[0] || D.body || D.documentElement;
    targ.appendChild (newNode);
}


GM_addStyle('.stream-panel__embed--offline                  { background-color: #000!important; }');
GM_addStyle('.stream-panel__embed--offline .offline-image   { display: None; }');
GM_addStyle('#chat-input-frame                              { background-color: unset; }');
GM_addStyle('#chat-input-control                            { background-color: unset; }');
GM_addStyle('#chat                                          { background-color: unset; }');
GM_addStyle('.msg-chat                                      { color: unset; }');
GM_addStyle('.#chat-event-bar                               { color: unset; }');
GM_addStyle('.msg-chat, .msg-chat .user                     { color: unset; }');
GM_addStyle('#msg-pinned                                    { background-color: #222; }');
GM_addStyle('#chat-win-main.vyneer-util-sticky-mentions-on .msg-highlight { background-color: #222; color: unset; }');
GM_addStyle('.msg-chat                                      { border-radius: 0px!important; }');
GM_addStyle('.msg-own, .chat-unpinned .chat-scroll-notify   { background-color: #151535; }');
