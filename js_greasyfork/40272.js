// ==UserScript==
// @name         Image viewer
// @version      1.0.0
// @description  Permet de prévisualiser directement les images du forum
// @author       UnCapitalist2
// @match        http://www.jeuxvideo.com/forums/*
// @match        http://m.jeuxvideo.com/forums/*
// @run-at document-end
// @grant        none
// @namespace https://greasyfork.org/users/177986
// @downloadURL https://update.greasyfork.org/scripts/40272/Image%20viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/40272/Image%20viewer.meta.js
// ==/UserScript==

(function() {

function create(evt){

  if (evt.type == 'mouseover') {

    var img = new Image();

    var svg = document.createElement('div');
    svg.innerHTML = '<?xml version="1.0" encoding="UTF-8" standalone="no"?><svg xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.0" width="64px" height="64px" viewBox="0 0 128 128" xml:space="preserve"><rect x="0" y="0" width="100%" height="100%" fill="#FFFFFF" /><g><circle cx="16" cy="64" r="16" fill="#000000" fill-opacity="1"/><circle cx="16" cy="64" r="16" fill="#555555" fill-opacity="0.67" transform="rotate(45,64,64)"/><circle cx="16" cy="64" r="16" fill="#949494" fill-opacity="0.42" transform="rotate(90,64,64)"/><circle cx="16" cy="64" r="16" fill="#cccccc" fill-opacity="0.2" transform="rotate(135,64,64)"/><circle cx="16" cy="64" r="16" fill="#e1e1e1" fill-opacity="0.12" transform="rotate(180,64,64)"/><circle cx="16" cy="64" r="16" fill="#e1e1e1" fill-opacity="0.12" transform="rotate(225,64,64)"/><circle cx="16" cy="64" r="16" fill="#e1e1e1" fill-opacity="0.12" transform="rotate(270,64,64)"/><circle cx="16" cy="64" r="16" fill="#e1e1e1" fill-opacity="0.12" transform="rotate(315,64,64)"/><animateTransform attributeName="transform" type="rotate" values="0 64 64;315 64 64;270 64 64;225 64 64;180 64 64;135 64 64;90 64 64;45 64 64" calcMode="discrete" dur="720ms" repeatCount="indefinite"></animateTransform></g></svg>';
    var url = this.src;

    var extension = this.parentNode.href.match(/\.[0-9a-z]+$/i)[0];

    url = url.replace("minis","fichiers");
    url = url.replace(/\.[0-9a-z]+$/i,extension);

    img.src = url;

    var imgDiv = document.createElement('div');
    imgDiv.id = "block-hover";

    this.parentNode.appendChild(imgDiv);
    svg.style.cssText = "position:absolute;z-index:9999;top:-50px;left:100%;";
    imgDiv.appendChild(svg);

    img.onload = function () {

        imgDiv.removeChild(imgDiv.firstChild);

        imgDiv.appendChild(img);

        img.style.cssText = "max-width:"+window.innerWidth/2+"px; max-height:"+window.innerHeight/1.3+"px;";

        var leftPosition = 100;
        var topPosition = img.clientHeight/2;

        imgDiv.style.cssText = "position:absolute;z-index:9999;top:-"+topPosition+"px;left:"+leftPosition+"%;";
    };
  }

  if (evt.type == 'mouseout') {
    document.getElementById("block-hover").remove();
  }

}

function addEventListenerByClass(className) {
    var list = document.getElementsByClassName(className);

    for (var i = 0, len = list.length; i < len; i++) {
        list[i].addEventListener("mouseover", create, false);
        list[i].addEventListener("mouseout", create, false);
    }
}



window.setInterval(function(){
  initCss();
  addEventListenerByClass('img-shack');
}, 1000);


function initCss(){
  var addRelative = document.getElementsByClassName("bloc-contenu");
  var addOverFlow = document.querySelectorAll(".conteneur-message, .text-enrichi-forum");
  for (var i = 0; i < addRelative.length; i++) {
    addRelative[i].style.position="relative";
  }
   for (var i = 0; i < addOverFlow.length; i++) {
    addOverFlow[i].style.overflow="visible";
  }

}

})();
