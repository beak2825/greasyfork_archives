// ==UserScript==
// @name         add video download func in m.facebook.com
// @namespace    add video download func in m.facebook.com
// @version      0.2
// @description  add video download func in m.facebook.com,plus add video height to window height.
// @author       zero0evolution
// @include      /^https\:\/\/m\.facebook\.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40671/add%20video%20download%20func%20in%20mfacebookcom.user.js
// @updateURL https://update.greasyfork.org/scripts/40671/add%20video%20download%20func%20in%20mfacebookcom.meta.js
// ==/UserScript==


// remove controlslist="nodownload"

var addVideoDownloadFunc = (videoElem)=>{
	if(videoElem.hasAttribute("controlslist")){
		videoElem.controlsList.value = videoElem.controlsList.value.replace(/nodownload/img,"")
	}
	videoElem.style.setProperty("height","100vh","important")
	videoElem.style.setProperty("width","auto","important")


	var nextImgElem = videoElem.nextElementSibling
	if(nextImgElem instanceof Element && nextImgElem.matches(".img")){
		nextImgElem.style.setProperty("height","100vh","important")
		nextImgElem.style.setProperty("width","auto","important")
		nextImgElem.style.setProperty("background-size","auto","important")
	}
}

var videoFilter = (topElem) =>{
	if(topElem.matches("video")){
		addVideoDownloadFunc(topElem)
	}
	for(let eachElem of topElem.querySelectorAll("video")){
		addVideoDownloadFunc(eachElem)
	}
}

videoFilter(document.documentElement)

//建立新的觀察物件
var observerObj = new MutationObserver(
	function (mutationObjs){
		for(let eachMutationObj of mutationObjs){
			for(let eachAddNode of eachMutationObj.addedNodes){
				if(eachAddNode.nodeType === 1){
					videoFilter(eachAddNode)
				}
			}
		}
	}
)

observerObj.observe(
	document.documentElement,{
		childList:true,
		subtree:true,
	}
)