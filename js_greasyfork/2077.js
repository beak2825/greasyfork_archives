// ==UserScript==
// @name        creation chat mover
// @namespace   jiggmin
// @include     http://jiggmin.com/forum.php
// @version     1
// @grant       none
// @description relocates creation-chat
// @downloadURL https://update.greasyfork.org/scripts/2077/creation%20chat%20mover.user.js
// @updateURL https://update.greasyfork.org/scripts/2077/creation%20chat%20mover.meta.js
// ==/UserScript==
var oldc = document.getElementsByClassName("creation")
oldc[0].parentNode.removeChild(oldc[0])

var newChat = document.createElement("div");
newChat.innerHTML = '<div class="creation"><embed width="960" height="300" src="http://cdn.jiggmin.com/games/borderless/borderless-loader-v4.swf" wmode="opaque"></embed></div>';
document.body.insertBefore(newChat, document.getElementsByName("forums")[0])
forums.parentNode.insertBefore(newChat, forums);