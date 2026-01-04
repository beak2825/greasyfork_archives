// ==UserScript==
// @name         Codeforces_spoiler_tutorial
// @version      0.2.0
// @description  Wrap spoilers in Codeforces tutorial in spoiler blocks
// @match        *://codeforces.com/blog/entry/*
// @match        *://codeforces.com/blog/entry/*
// @match        *://codeforces.com/contest/*
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-start
// @namespace    https://greasyfork.org/users/410786
// @downloadURL https://update.greasyfork.org/scripts/402454/Codeforces_spoiler_tutorial.user.js
// @updateURL https://update.greasyfork.org/scripts/402454/Codeforces_spoiler_tutorial.meta.js
// ==/UserScript==

(function(){

if(location.pathname.startsWith("/contest/")){
	window.addEventListener("DOMContentLoaded", function(){
		// Stores tutorial links. Sometimes it's not linked in some old contests, see  https://codeforces.com/blog/entry/7749?locale=en
		for(const element of document.querySelectorAll(".roundbox ul li a[href*='/blog/entry/'"))
			if(element.innerText.match(/Tutorial|Разбор задач/))
				GM_setValue("isTutorial"+element.href.match(/\/blog\/entry\/(\d+)/)[1], true)
	})
	return
}



function wrappedInSpoiler(node){
	while(node!==null){
		if(node.classList && node.classList.contains("spoiler")) return true;
		node=node.parentNode;
	}
	return false;
}

var newStyle=false

function wrapInSpoiler(nodes, spoilerTitle){
	if(!Array.isArray(nodes)) nodes=[nodes]
	if(nodes.length==0) return

	const spoilerElement=document.createElement("div")
	spoilerElement.classList.add("spoiler")
	spoilerElement.innerHTML='<b class="spoiler-title"></b><div class="spoiler-content" style="display: none;"></div>'
	spoilerElement.firstElementChild.innerText=spoilerTitle

	//console.log("Wrapping in spoiler: ", nodes)
	//nodes[0].insertAdjacentElement('beforebegin', spoilerElement);
	nodes[0].parentNode.insertBefore(spoilerElement, nodes[0]);
	nodes.forEach(function(node){
		spoilerElement.lastElementChild.appendChild(node) // "If the given child is a reference to an existing node in the document, appendChild() moves it from its current position to the new position"
	})
}

function wrapOldStyle(){
	//const headerSelector="h2,h3,a[href^='/contest'][href*='/problem/']"
	const headerSelector="h1,h2,h3,hr"
	for(const element of document.getElementsByClassName("content")[0].querySelectorAll(headerSelector)){
		const elements=[]
		let tmp=element.nextSibling
		while(tmp!==null && ((tmp instanceof Text) || !tmp.matches(headerSelector))){
			elements.push(tmp)
			tmp=tmp.nextSibling
		}
		wrapInSpoiler(elements, "Tutorial")
	}
}

const observer=new MutationObserver(function(mutationList, observer){
	for(const mutation of mutationList){
		for(const node of mutation.addedNodes){
			if(node instanceof Element && node.matches("div.roundbox.meta")){
				if(GM_getValue("isTutorial"+location.href.match(/\/blog\/entry\/(\d+)/)[1])){
					if(!newStyle) wrapOldStyle()
				}
				observer.disconnect()
				return
			}

			if(
				node.tagName==="SPAN" && node.style.padding==="0px 0.35em" &&
				node.firstChild instanceof Text &&
				["Tutorial of ", "Разбор задач "].includes(node.firstChild.nodeValue)
				//node.previousElementSibling.tagName==="IMG" && node.previousElementSibling.src.includes("paperclip")
			){
				if(!newStyle) wrapOldStyle()
				observer.disconnect()
				return
			}

			if(node.classList!==undefined && node.classList.contains("problemTutorial")){
				newStyle=true
				if(!wrappedInSpoiler(node)){
					var spoilerTitle='Tutorial'
					const problemcode=node.getAttribute("problemcode")
					if(problemcode) spoilerTitle+=' - '+problemcode

					wrapInSpoiler(node, spoilerTitle)
				}
			}
		}
	}
})
observer.observe(document, { childList: true, subtree: true });



})()
