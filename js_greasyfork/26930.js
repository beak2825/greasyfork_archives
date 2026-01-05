// ==UserScript==
// @name CollabVM Autopaste
// @description Press Ctrl+Shift+V to paste your clipboard into the VM
// @namespace collabvm
// @version 2017.01.30
// @match http://computernewb.com/*
// @run-at document-end
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/26930/CollabVM%20Autopaste.user.js
// @updateURL https://update.greasyfork.org/scripts/26930/CollabVM%20Autopaste.meta.js
// ==/UserScript==

var pastelock=0
function paste(string,interval){
	if(pastelock){
		return
	}
	pastelock=1
	var keys={
		shift:65505,
		enter:65293,
		tab:65289
	}
	var releasekeys=[65505,65506,65507,65508,65509,65513,65514,65515]
	var i=0
	var length=string.length
	var shift=0
	var checkkeys=1
	var iterate=()=>{
		if(checkkeys){
			for(var j in pressedkeys){
				if(pressedkeys[j]){
					requestAnimationFrame(iterate)
					return
				}
			}
			checkkeys=0
			for(var j in releasekeys){
				tunnel.sendMessage("key",releasekeys[j],0)
			}
			setFocus(1)
		}
		if(pressedkeys.ctrl){
			exit()
			return
		}
		if(pressedkeys.shift){
			setTimeout(iterate,50)
			return
		}
		var thischar=string.charAt(i)
		var charcode=string.charCodeAt(i)
		if(/[~!@#$%^&*()_+{}:"|<>?A-Z]/.test(thischar)){
			if(!shift){
				tunnel.sendMessage("key",keys.shift,1)
				shift=1
			}
			sendkey(charcode)
		}else{
			if(shift){
				tunnel.sendMessage("key",keys.shift,0)
				shift=0
			}
			if(thischar=="\n"){
				sendkey(keys.enter)
			}else if(thischar=="\t"){
				sendkey(keys.tab)
			}else{
				sendkey(charcode)
			}
		}
		i++
		if(i<string.length){
			if(interval){
				setTimeout(iterate,100)
			}else{
				requestAnimationFrame(iterate)
			}
		}else{
			exit()
		}
	}
	var sendkey=thiskey=>{
		tunnel.sendMessage("key",thiskey,1)
		tunnel.sendMessage("key",thiskey,0)
	}
	var exit=()=>{
		if(shift){
			tunnel.sendMessage("key",keys.shift,0)
		}
		pastelock=0
	}
	iterate()
}
var pressedkeys={}
function keylistener(event){
	var keys={
		shift:16,
		ctrl:17,
		alt:18
	}
	for(var i in keys){
		if(event.keyCode==keys[i]){
			pressedkeys[i]=event.type=="keydown"
		}
	}
}
addEventListener("keydown",keylistener)
addEventListener("keyup",keylistener)
addEventListener("blur",()=>{
	pressedkeys={}
})
addEventListener("paste",event=>{
	var cliptext=event.clipboardData.getData("Text")
	if(pressedkeys.shift&&cliptext){
		paste(cliptext,pressedkeys.alt)
	}
},true)
