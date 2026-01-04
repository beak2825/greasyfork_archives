// ==UserScript==
// @name         Chat text selection
// @namespace    none
// @version      0.1
// @description  none
// @author       ℋℒ քǟɨքɛ
// @match        http://zombs.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418717/Chat%20text%20selection.user.js
// @updateURL https://update.greasyfork.org/scripts/418717/Chat%20text%20selection.meta.js
// ==/UserScript==


var changeHeight = document.createElement("style")
changeHeight.type = "text/css"
changeHeight.innerHTML = "@keyframes hud-popup-message {0% { max-height: 0; margin-bottom: 0; opacity: 0; }100% { max-height: 1000px; margin-bottom: 10px; opacity: 1; }} .hud-map .hud-map-spot {display: none;position: absolute;width: 4px;height: 4px;margin: -2px 0 0 -2px;background: #ff5b5b;border-radius: 50%;z-index: 2;} .hud-chat .hud-chat-message { -moz-user-select: text; -khtml-user-select: text; -webkit-user-select: text; -ms-user-select: text; user-select: text; }"
document.body.appendChild(changeHeight)
var widget = '<iframe src="https://discordapp.com/widget?id=509768077932625920&amp;theme=dark" width="350" height="500" allowtransparency="true" frameborder="0" style="width: 300px;height: 320px;"></iframe>'


//Custom Message Maker
let Settings = ''
Settings += `
<h3>Custom Message Maker</h3>
<hr />
<input type="search" placeholder="name" maxlength="16" id="myName">
<input type="search" placeholder="message" maxlength="140" id="myMessage">
<button onclick="customMessage();">Send</button>
`