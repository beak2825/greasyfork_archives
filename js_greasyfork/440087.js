// ==UserScript==
// @name        mouseWheel, mouseMove, touchMove on left side to change time - meteociel.fr
// @namespace   Violentmonkey Scripts
// @match       https://www.meteociel.fr/observations-meteo/radarzoom.php
// @grant       none
// @version     1.1
// @author      Antonin Roussel 2022
// @license     MIT
// @description:fr Permet de faire défiler les heures:minutes avec la souris (molette, clic-déplace)
// @description Allows to scroll time with mouse (wheel, clic-move)
// @downloadURL https://update.greasyfork.org/scripts/440087/mouseWheel%2C%20mouseMove%2C%20touchMove%20on%20left%20side%20to%20change%20time%20-%20meteocielfr.user.js
// @updateURL https://update.greasyfork.org/scripts/440087/mouseWheel%2C%20mouseMove%2C%20touchMove%20on%20left%20side%20to%20change%20time%20-%20meteocielfr.meta.js
// ==/UserScript==

var zone = document.querySelector("td[width='60px']") ;
var imgNb = document.querySelectorAll("span.echnotselected").length + 1;
var imgId = 0 ;
var imgIdd = imgIdf = 0 ;

var sI;
var Yd, Ym;

zone.onmouseover = function(evt) {
  zone.style.cursor = 'grab' ; 
  zone.style.backgroundColor = 'mediumturquoise' ;
}

zone.onwheel = function(evt) {
  evt.preventDefault();
  stopAnim(); 
  
  zone.style.cursor = 'ns-resize' ; 
  zone.style.backgroundColor = 'lightskyblue' ;
  
  imgId = Number.parseInt(document.querySelector("span.echselected").id.substr(3), 10) ;
  if (evt.deltaY<0) {
    changeImage();
  }
  else {
    changeImageReverse();
  }
  switchEch(imgId);
}

zone.onmousedown = 
zone.ontouchstart = 
function(evt){
  evt.preventDefault();
  Ym = Yd = evt.clientY || evt.touches[0].pageY
  imgIdd = Number.parseInt(document.querySelector("span.echselected").id.substr(3), 10) ;

  clearInterval(sI);
  sI=setInterval(function () {
    moveImage(Ym-Yd);
    zone.style.cursor = 'grabbing' ; 
    zone.style.backgroundColor = 'lightblue' ;
  }, 50);
}

zone.onmousemove = 
zone.ontouchmove = 
function(evt){
  evt.preventDefault();
  Ym = evt.clientY || evt.touches[0].pageY
}

zone.onmouseout =
zone.onmouseup =
zone.ontouchend =
zone.ontouchcancel =
function(evt){
  evt.preventDefault();
  clearInterval(sI);
  zone.style.cursor = 'grab' ; 
  zone.style.backgroundColor = 'mediumturquoise' ;
}

function changeImage() {
  imgId = (imgId+1)%imgNb
}
function changeImageReverse() {
  imgId = (imgId+imgNb-1)%imgNb
}

function moveImage(deltaM) {
	decalage = -deltaM/100*imgNb/2;
	if(decalage<0) {
		decalage = Math.floor(decalage + imgNb)%imgNb
	}
	else if (0<decalage) {
		decalage = Math.floor(decalage)%imgNb
	}
	imgIdf = (imgIdd + decalage)%imgNb
	//if (imgIdf < imgId) imgIdf+=imgNb;
	
	//for(i=imgId ; i<imgIdf ; i++) {changeImage();}
  console.log(imgIdf)
  switchEch(imgIdf);
}
