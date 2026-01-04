// ==UserScript==
// @name         Kast: Unclickable GIFs
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Transforms GIFs from Kast's chat into pure GIFs, rather than clickable versions that take you to another webpage.
// @author       Rasutei
// @match        https://w.kast.live/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kast.live
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/444576/Kast%3A%20Unclickable%20GIFs.user.js
// @updateURL https://update.greasyfork.org/scripts/444576/Kast%3A%20Unclickable%20GIFs.meta.js
// ==/UserScript==
/* eslint-disable curly */
var prev
const observer = new MutationObserver(OnUpdate)
window.addEventListener('load', function(){
	let toobserve
	let interval = setInterval(function(){
		if (document.querySelector(".lobby-chat-messages")){
			toobserve = document.querySelector(".lobby-chat-messages")
			console.warn(toobserve)
			observer.observe(toobserve, {subtree:false, childList:true})
			setInterval(Ungiffify(toobserve.children), 1000)
			clearInterval(interval)
		}
	}, 200)
})

function OnUpdate(){
	let cur = Array.from(document.querySelector(".lobby-chat-messages").children)
	if (!prev){
		prev = cur
		Ungiffify(cur)
		return
	}
	if (cur != prev)
		Ungiffify(cur)
}
function Ungiffify(a){
	a = Array.from(a)
	a.forEach(e => {
		if(e.querySelector(".giphy-gif-img")){
			console.warn("Ungiffifying:")
			console.warn(e.innerHTML)
			console.warn(e.querySelector(".giphy-gif-img").innerHTML)
			e.querySelector(".lobby-chat-message-text").innerHTML = e.parentElement.querySelector(".giphy-gif-img").innerHTML
		}
	})
}