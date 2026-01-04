// ==UserScript==
// @name         Full img gallery (right) SLT
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  try to take over the world!
// @author       You
// @match        https://cms.sletat.ru/HotelCard.aspx?hotel=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/388198/Full%20img%20gallery%20%28right%29%20SLT.user.js
// @updateURL https://update.greasyfork.org/scripts/388198/Full%20img%20gallery%20%28right%29%20SLT.meta.js
// ==/UserScript==

(function() {
    'use strict';
//right gallery

document.querySelector("#SLT_Description").setAttribute("style", "float: left; margin: 0;");

var imgs = document.querySelectorAll("#file-list > ul > li .preview")
var fullLinks = new Array;

for (var i = 0; i < imgs.length; i++) {
fullLinks[i] = imgs[i].getAttribute('data-src');
fullLinks[i] = fullLinks[i].replace('/i/p/', '/i/f/');
}

var imgContainerParrent = document.querySelector("#tabs-1")
var imgContainer = document.createElement("div");
imgContainerParrent.appendChild(imgContainer);
imgContainer.style.float = 'left';

for (var i = 0; i < fullLinks.length; i++) {
var fullImg = document.createElement("img");
fullImg.setAttribute("src", fullLinks[i]);
fullImg.setAttribute("style", "padding: 5px; width: 360px; height: 270px;");
imgContainer.appendChild(fullImg);
}

// всплывающее окно с картинкой при хавере на миниатюру
var hoverImgContainer = document.createElement("div");
hoverImgContainer.setAttribute("style", "padding: 5px; width: 1280px; height: 800px; position: fixed; top: 0; z-index: 10");
document.querySelector("#SLT_Description").appendChild(hoverImgContainer);
hoverImgContainer.style.display = 'none';

for (var i = 0; i < imgs.length; i++) {
imgs[i].addEventListener("mouseenter", hoverOn, false);
imgs[i].addEventListener("mouseleave", hoverOff, false);
}

function hoverOn() {
var hoverImgSrc = this.getAttribute('data-src');
hoverImgContainer.style.display = 'block';
hoverImgContainer.innerHTML = '<img src="' + hoverImgSrc + '"/>'
	}
function hoverOff() {
var hoverImgSrc = this.getAttribute('data-src');
hoverImgContainer.style.display = 'none';
}

})();