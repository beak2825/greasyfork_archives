// ==UserScript==
// @name         Rasutei's Kastfix
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Fixes laggy chat input box.
// @author       Rasutei
// @license      MIT
// @match        https://w.kast.live/link/group/*
// @icon         https://www.google.com/s2/favicons?domain=w.kast.live
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/435776/Rasutei%27s%20Kastfix.user.js
// @updateURL https://update.greasyfork.org/scripts/435776/Rasutei%27s%20Kastfix.meta.js
// ==/UserScript==


var inject = document.createElement("script")
inject.innerHTML = `
var realchat
var fakechat
var loopinterval
function enter(e, fake){
	if(e.which == 13){
		if(fake){
			realchat.value = fakechat.value
			fakechat.value = ''
			fakechat.setAttribute("placeholder","Press Enter again...")
			realchat.focus();
		}else{
			fakechat.value = ''
			fakechat.setAttribute("placeholder","Type a message here...")
			fakechat.focus();
		}
	}
}
function loop(){
	if(!document.getElementsByClassName("lobby-chat-message-compose-textarea")[1]){
		realchat = document.getElementsByClassName("lobby-chat-message-compose-textarea")[0]
		fakechat = realchat.cloneNode()
		fakechat.setAttribute("onkeypress","return enter(event, true)")
		realchat.setAttribute("onkeypress","return enter(event, false)")
		realchat.addEventListener("focus", function(){this.style.boxShadow = "0 0 10px red"})
		realchat.addEventListener("focusout", function(){this.style.boxShadow = ""})
		realchat.style.position = "absolute"
		realchat.style.width = "250px"
		realchat.style.zIndex = "-1"
		realchat.parentElement.appendChild(fakechat)
		clearInterval(loopinterval)
		console.log("Chat duplicated")
	}
}
loopinterval = setInterval(loop, 1000)
`
document.head.appendChild(inject)