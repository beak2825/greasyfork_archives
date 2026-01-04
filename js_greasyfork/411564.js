// ==UserScript==
// @name         SimpleStile
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  UwU
// @author       MASSA ATOMICA
// @match        http://bloble.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411564/SimpleStile.user.js
// @updateURL https://update.greasyfork.org/scripts/411564/SimpleStile.meta.js
// ==/UserScript==
var Css = document.createElement("style")
Css.innerText =
`
// MUDANDO DE COR
#menuContainer {
    background-color: #000000;
	width: 100%;
	height: 100%;
	display: flex;
	position: absolute;
	top: 10px;
	z-index: 100;
	align-items: center;
	text-align: center;
}
#leaderboardList {
    background-color: #FF0000;
	width: 100%;
	height: 100%;
}
#chatBox {
   background-color: #FF00FF;
}
#leaderboardContainer {
   background-color: #B22222

`
// COMANDOS DE "STYLE"
$("#gameTitle").html('ScriptSimpleStylev1')

