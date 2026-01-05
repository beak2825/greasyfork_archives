// ==UserScript==
// @name        TallChat
// @namespace   TallChat1
// @description Changes the height of the chat window to something more useable
// @include     https://politicsandwar.com/inbox/message/id=*
// @version     1.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/25910/TallChat.user.js
// @updateURL https://update.greasyfork.org/scripts/25910/TallChat.meta.js
// ==/UserScript==


document.body.innerHTML = document.body.innerHTML.replace('style="width:98%;margin:0 auto;overflow:auto;height:350px;padding:5px;"','style="width:98%;margin:0 auto;overflow:auto;height:710px;padding:5px;"');