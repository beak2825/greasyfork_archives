// ==UserScript==
// @name pixelplanet.fun green tema
// @namespace none
// @version 1.0.0
// @description green tema for pixelplanet
// @author Pixel Master
// @grant GM_addStyle
// @run-at document-start
// @match *://*.https://pixelplanet.fun/*/*
// @downloadURL https://update.greasyfork.org/scripts/478955/pixelplanetfun%20green%20tema.user.js
// @updateURL https://update.greasyfork.org/scripts/478955/pixelplanetfun%20green%20tema.meta.js
// ==/UserScript==

(function() {
let css = `
	
	
tr:nth-child(2n) {
	background-color: #008000
}

tr:nth-child(odd) {
	background-color: #000000
}

#historyselect,
.actionbuttons,
.cooldownbox,
.notifybox,
.onlinebox {
	background: #008000;
	border-radius: 10px
}

.overlay {
	background: #008000
}

.chatname {
	background: #008000
}

.msg.info {
	color: #ff91a6
}

.popup,
.window {
	background: #000000
}

.actionbuttons:hover,
.channeldd,
.contextmenu,
.menu > div:hover {
	background: #008000
}

.chn,
.chntype,
.contextmenu > div {
	background-color: #ebebeb80
}

#chatbutton {
	background: linear-gradient(135deg, #000, #008000, #000, #008000, #000, #008000)
}

#chatbutton:hover {
	background: linear-gradient(135deg, #000, #008000, #000, #008000, #000, #008000)
}

.coorbox {
	background: linear-gradient(135deg, #000, #008000, #000, #008000, #000, #008000)
}

.coorbox:hover {
	background: linear-gradient(135deg, #000, #008000, #000, #008000, #000, #008000)
}

.modal {
	background: #f4edf0 none repeat scroll 0 0;
	background-image: url("https://cdn.discordapp.com/attachments/1012740507262263306/1169648963553591378/image.png?ex=65562b7b&is=6543b67b&hm=7578d2e41df597a2898be5f628fd6b546516eddd09e2afa1dbe962eb31f6f36c&");
	background-repeat: no-repeat;
	background-size: cover;
	border-radius: 10px
}

.Alert {
	background: #f4edf0 none repeat scroll 0 0;
	border-radius: 7px
}

#palettebox {
	z-index: 1;
	bottom: 50px;
	padding: 5px;
	position: fixed;
	right: 16px;
	margin-left: 10px;
	margin-right: 1px;
	overflow: hidden
}

#palettebox,
#palettebox span {
	transition: .2s
}

#palettebox .selected,
#palettebox span:hover {
	z-index: 2!important;
	outline: #0000006b solid 1px;
	box-shadow: #008000 0 0 5px 2px;
	-ms-transform: scale(1.1, 1.1);
	-webkit-transform: scale(1.1, 1.1);
	transform: scale(1.1, 1.1)
}

#palselbutton {
	bottom: 6px;
	right: 16px
}

#chatbutton {
	bottom: 6px;
	right: 57px
}

#historyselect {
	top: 16px;
	left: 0;
	right: 0;
	height: 70px;
	width: 140px;
	background-color: rgb(255 255 255 / 80%);
	color: #000000;
	font-size: 14px;
	line-height: 26px;
	text-align: center;
	border: solid #00000099;
	border-width: thin;
	padding: 0 24px;
	margin-left: auto;
	margin-right: auto;
	z-index: 2
}
h3 {
	color: #930000;
}

.modalinfo {
	color: #ff0000;
	font-size: 15px;
	font-weight: 500;
	position: relative;
	text-align: inherit;
	float: none
}
a:link {
	color: #0089ff
}

a:visited {
	color: #0089ff
}
.modal-content,
.popup-content,
.win-content {
	color: hsl(0deg 100% 50%);
}
.menu > div {
	background-color: #2fbd00
}

`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
