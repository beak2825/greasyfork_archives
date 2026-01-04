// ==UserScript==
// @name		Fix link in www.facebook.com
// @version	 1.3
// @include		/^https?\:\/\/(?:m|www)\.facebook\.com/
// @description	連結轉為原網址
// @author zero0evolution
// @namespace Fix link in facebook.com
// @downloadURL https://update.greasyfork.org/scripts/38272/Fix%20link%20in%20wwwfacebookcom.user.js
// @updateURL https://update.greasyfork.org/scripts/38272/Fix%20link%20in%20wwwfacebookcom.meta.js
// ==/UserScript==


if(document.readyState === "loading"){
	document.addEventListener(
		"DOMContentLoaded",function(event){
			init()
		}
	)
}
else{
	init()
}


function init(){
	fixAllHref(document.documentElement)

	const newNodeObserverObj = new MutationObserver(
		function (mutationObjs){
			for(const eachMutationObj of mutationObjs){
				for(eachAddNode of eachMutationObj.addedNodes){
					if(eachAddNode.nodeType === 1){
						fixAllHref(eachAddNode)
					}
				}
			}
		}
	)

	newNodeObserverObj.observe(
		//監視目標
		document.documentElement,{
			childList:true,
			subtree:true,
		}
	)
}


function fixAllHref(topElem){
	if(topElem.matches("a[href]")){
		fixHref(topElem)
		createHrefMutationObserver(topElem)
	}
	for (const childElem of topElem.querySelectorAll("a[href]")) {
		fixHref(childElem)
		createHrefMutationObserver(childElem)
	}
}



function fixHref(elem){
	let oldHref = elem.href
	const linkMatchObj = oldHref.match(
		/^https\:\/\/lm?\.facebook\.com\/l\.php\?(.*)$/im)
	if(linkMatchObj){
		const innerLinkMatchObj = linkMatchObj[1].match(
			/u\=(.*?)(?=\&|$)/im)
		if(innerLinkMatchObj){
			let newHref = decodeURIComponent(innerLinkMatchObj[1])

			newHref = newHref
				.replace(/fbclid\=.*?(?:\&|$)/im,"")
				.replace(/(?:\&|\?)$/im,"")

			elem.href = newHref

			console.log("更換連結",oldHref,"=>",newHref)
			return(null)
		}
	}

	oldHref = elem.href
	const fbclidMatchObj = oldHref.match(/fbclid\=.*?(?:\&|$)/im)
	if(fbclidMatchObj){
		let newHref = oldHref
			.replace(/fbclid\=.*?(?:\&|$)/im,"")
			.replace(/(?:\&|\?)$/im,"")

		console.log("更換連結",oldHref,"=>",newHref)
		elem.href = newHref
	}

	// const videoLinkPatten = /^(.*?\/videos\/\d+)(\/\?.*?)$/im
	// const videoLinkMatchObj = oldHref.match(videoLinkPatten)

	// if(videoLinkMatchObj){
	// 	let newHref = videoLinkMatchObj[1]
	// 	// let newHref = oldHref.replace(videoLinkMatchObj,(matchStr,p1)=>{
	// 	// 	return("/videos/"+p1)
	// 	// })
	// 	elem.href = newHref

	// 	// console.log(oldHref)
	// 	// console.log("==>")
	// 	// console.log(newHref)
	// 	// console.log()
	// 	return(null)
	// }
}


function createHrefMutationObserver(elem){
	`
		if href has been changed
		fix href again!!
	`
	const hrefMutationObserver = new MutationObserver(
		function(mutationObjs){
			for(const eachMutationObj of mutationObjs){
				fixHref(eachMutationObj.target)
			}
		}
	)
	hrefMutationObserver.observe(
		elem,{
			attributes:true,
			attributeFilter:["href"],
		}
	)
}



