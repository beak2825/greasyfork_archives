// ==UserScript==
// @name         Block the Blocked
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Block blocked messages in the replies of tweets.
// @author       You
// @match        https://tampermonkey.net/scripts.php
// @downloadURL https://update.greasyfork.org/scripts/381305/Block%20the%20Blocked.user.js
// @updateURL https://update.greasyfork.org/scripts/381305/Block%20the%20Blocked.meta.js
// ==/UserScript==

var css = document.createElement("style");
css.type = "text/css";
css.innerHTML = "div[data-component-context=\"stream-tombstone-container ThreadedConversation-tweet \"] { display: none }";

document.head.appendChild(css);