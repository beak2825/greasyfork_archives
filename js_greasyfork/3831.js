// ==UserScript==
// @name        creation chat inserter
// @namespace   jiggmin
// @include     http://jiggmin.com/forum.php
// @version     1
// @grant       none
// @description inserts a creation chat into the page. For use with the 4.0 stock skin.
// @downloadURL https://update.greasyfork.org/scripts/3831/creation%20chat%20inserter.user.js
// @updateURL https://update.greasyfork.org/scripts/3831/creation%20chat%20inserter.meta.js
// ==/UserScript==

var newChat = document.createElement("div");
newChat.innerHTML = '<div class="creation"><embed width="960" height="300" src="http://cdn.jiggmin.com/games/borderless/borderless-loader-v4.swf" wmode="opaque"></embed></div>';
document.body.insertBefore(newChat, document.getElementsByName("forums")[0])
forums.parentNode.insertBefore(newChat, forums);