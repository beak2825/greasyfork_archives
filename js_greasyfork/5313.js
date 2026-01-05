// ==UserScript==
// @name       The Way of Communism
// @namespace  http://instasynch.com/
// @version    0.1
// @description  Removes all concept of grey/red/blacknames in chat and userlist in InstaSynch rooms
// @match      http://instasynch.com/rooms/*
// @copyright  Nyet
// @downloadURL https://update.greasyfork.org/scripts/5313/The%20Way%20of%20Communism.user.js
// @updateURL https://update.greasyfork.org/scripts/5313/The%20Way%20of%20Communism.meta.js
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

addGlobalStyle("#chat .left .messages .message .username.registered { color: #666; }");
addGlobalStyle("#chat .right .users .m { color: black; font-weight: normal; }");
addGlobalStyle("#chat .right .users .registered { font-weight:normal; }");
