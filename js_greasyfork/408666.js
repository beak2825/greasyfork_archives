// ==UserScript==
// @name         TestShowUrl
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       SStvAA
// @match        https://view.appen.io/assignments/*
// @grant        none
// @require https://code.jquery.com/jquery-3.3.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/408666/TestShowUrl.user.js
// @updateURL https://update.greasyfork.org/scripts/408666/TestShowUrl.meta.js
// ==/UserScript==

(function() {
    'use strict';
$( document ).ready(function() {
	inicia();
});
  
   function inicia(){
      var cml = document.getElementsByClassName("cml jsawesome");
for(var i=0;cml.length>i;i++){
	//script
	var script = cml[i].getElementsByTagName('script')[1].innerText;
	var position = script.search("image_url") + 12;
	var part1 = script.slice(position);
	//Aqui tenemos la url
	var url = part1.slice(0,part1.search('"'));
	//DOM
	var linkElement = document.createElement("a");
    var spanElement = document.createElement("span");
    linkElement.setAttribute("href", url);
    linkElement.appendChild(document.createTextNode(url));
    spanElement.setAttribute("class", "newclass");
    spanElement.appendChild(linkElement);
	var box = cml[i].getElementsByClassName('shapes cml_field validate_hidden js-controlled')[0];
	box.insertBefore(spanElement,null)
}


   }
   
})();