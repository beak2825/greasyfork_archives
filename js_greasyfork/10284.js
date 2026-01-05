// ==UserScript==
// @name	Github Word Wrapping for CODE blocks
// @namespace	gihubpre
// @run-at	document-start
// @description	Switches word wrapping for CODE blocks in comments on github.com
// @author	Mak Alexey (S-ed, Sedokun)
// @match	http://github.com/*
// @match	https://github.com/*
// @version	1.220705.1
// @grant	none
// @license	MIT License
// @downloadURL https://update.greasyfork.org/scripts/10284/Github%20Word%20Wrapping%20for%20CODE%20blocks.user.js
// @updateURL https://update.greasyfork.org/scripts/10284/Github%20Word%20Wrapping%20for%20CODE%20blocks.meta.js
// ==/UserScript==

// if Local Storage used, uncomment to reset default setting or type line in console
// localStorage.removeItem("wrapDefault")

// wrapDefault = true; if no Local Storage available, will enable word wrapping by default
// will reset on script update obviously

var wrapDefault = false;

var preCSS = '\
.preButtonDiv {\
	cursor: pointer;\
	display: block;\
	left: 0px;\
	margin: 2px 0 0 2px;\
	position: absolute;\
	width: 16px;\
	height: 16px;\
	line-height: 16px;\
	border-radius: 8px;\
	text-align: center;\
	transition: .5s;\
}\
.comment-body .preButtonDiv{\
	margin-left: 5px\
}\
.preButtonDiv:hover {\
	transition: .3s;\
	background-color: #ccc;\
}'

if(typeof(localStorage) !== "undefined") {
	wrapDefault = localStorage.getItem("wrapDefault");
    if( wrapDefault == null ){
		if(confirm("github-pre userscript:\nWould You like to set word wrapping to 'enabled' by default?")){
			wrapDefault = true;
		} else wrapDefault = false;
		localStorage.setItem("wrapDefault", wrapDefault);
	}
} else { console.warn( "Sorry, no Local Storage Available\n\
Hardcoded 'wrapDefault' variable will be used instead (edit script to set)" ); }


//Intercepting fetch to trigger DOM parse on navigation events
const { fetch: originalFetch } = window;
window.fetch = async (...args) => {
  let [resource, config] = args;

  let response = await originalFetch(resource, config);

  initGithubPre();

  return response;
};


var preStyleSheet = document.createElement("style");
preStyleSheet.type = "text/css";
preStyleSheet.appendChild(document.createTextNode(preCSS));
document.head.appendChild(preStyleSheet);

//Trigger once on page load
document.addEventListener("DOMContentLoaded", initGithubPreDOM());

function initGithubPreDOM(){
    document.removeEventListener("DOMContentLoaded", initGithubPreDOM);
    initGithubPre();
    console.warn( "waka");
}

//Parse the page, find all code containers change the wrap, and add swith buttons
function initGithubPre(){
	var preCollection = document.querySelectorAll(".markdown-body pre");
	for (var i = 0; i < preCollection.length; ++i) {
		if( !preCollection[i].parentNode.firstChild.classList.contains('preButtonDiv') ) addPreButton(preCollection[i]);
		if (wrapDefault) preCollection[i].firstChild.style.whiteSpace = "pre-wrap";
	}
}


//Function to embed button switches in each code container
function addPreButton(element){
	var preButtonDiv = document.createElement("div");
	var preButtonText = document.createTextNode("▾");
	preButtonDiv.appendChild(preButtonText);
	preButtonDiv.className = "preButtonDiv";
	element.parentNode.insertBefore(preButtonDiv, element);
	preButtonDiv.addEventListener("click", switchPreStyle, false);
}

//Function to handle Click events
function switchPreStyle(){
	var pre = this.nextSibling.firstChild.style;
	pre.whiteSpace = (pre.whiteSpace != "pre-wrap")?"pre-wrap":"pre";
    this.style.transform = (this.style.transform != "rotate(-90deg)")?"rotate(-90deg)":"";
}
