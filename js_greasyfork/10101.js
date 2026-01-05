// ==UserScript==
// @name    		 Angel Beats! Skin
// @namespace		 http://myanimelist.net/animelist/HanSolo
// @description	     MAL Custom Skin
// @version			 1.0
// @include			 http://myanimelist.net/*
// @exclude			 http://myanimelist.net/animelist/HanSolo
// @exclude			 http://myanimelist.net/mangalist/HanSolo
// @downloadURL https://update.greasyfork.org/scripts/10101/Angel%20Beats%21%20Skin.user.js
// @updateURL https://update.greasyfork.org/scripts/10101/Angel%20Beats%21%20Skin.meta.js
// ==/UserScript==

//Resources
bodybg = "http://i.imgur.com/mWNVG28.jpg"

//CSS
function addGlobalStyle(css) {
	var head, style;
	head = document.getElementsByTagName('head')[0];

	if (!head) { 
		return; 
	}

	style = document.createElement('style');
	style.type = 'text/css';
	style.innerHTML = css;
	head.appendChild(style);
}

//Body background
if (!document.location.href.match('info.php|hidenav|hideheader')) {
  addGlobalStyle('body {background-image: url(" '+bodybg+' "); background-size: cover; background-repeat: no-repeat; background-position: top center; background-attachment: fixed;}')
}

//Moving buttons
if (!document.location.href.match('info.php|hidenav|hideheader')) {
  addGlobalStyle('#nav li.small:nth-child(2), #nav li.small:nth-child(3), #nav li:nth-child(4), #nav li.medium:nth-child(5), #nav li.smaller {transform:translate(70px);}')
  addGlobalStyle('#nav li.medium:nth-child(1) > ul:nth-child(2) > li:nth-child(4), #nav li.small:nth-child(2) > ul:nth-child(2) > li:nth-child(4), #nav li.small:nth-child(3) > ul:nth-child(2) > li:nth-child(4), #nav > li:nth-child(4) > ul:nth-child(2) > li:nth-child(4), #nav li.medium:nth-child(5) > ul:nth-child(2) > li:nth-child(4), #nav li.smaller > ul:nth-child(2) > li:nth-child(4) {transform:translate(0px);}')
}

//Adding button
var input = document.createElement("input");
document.body.appendChild(input);

input.type = "button";
input.value = "My List";
input.onclick = myListClick;
input.onmouseover = myListOver;
input.onmouseout = myListOut
  input.style.backgroundColor = "#2E51A2";
  input.style.backgroundClip = "border-box";
  input.style.backgroundPosition = "10% 10%";
  input.style.borderStyle = "none";
  input.style.color = "#FFF";
  input.style.fontFamily = "Verdana, Ariel";
  input.style.fontSize = "13px";
  input.style.height = "34px";
  input.style.top = "-1273px";
  input.style.left = "-405px";
  input.style.position = "relative";
  input.style.fontWeight = "bold";
  input.style.padding = "3px 0px 0px 0px";
  input.style.width = "70px";
  input.style.zIndex = "80";

function myListClick() {
  window.location = "http://myanimelist.net/animelist/HanSolo";
}

function myListOver() {
  input.style.backgroundColor = "#E1E7F5";
  input.style.color = "#000";
  input.style.zIndex = "90";
}

function myListOut() {
  input.style.backgroundColor = "#2E51A2";
  input.style.color = "#FFF";
  input.style.zIndex = "80";
}
  
//Removing Footer
if (!document.location.href.match('info.php|hidenav|hideheader')) {
  addGlobalStyle('#footer-block {display: none;}')
}


