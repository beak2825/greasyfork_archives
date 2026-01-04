// ==UserScript==
// @name         UrlShower
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Muestra las url de cualquier imagen en el trabajo de F8
// @author       SStvAA!
// @match        https://render.figure-eight.io/assignments/*
// @match        https://tasks.figure-eight.work/assignments/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389907/UrlShower.user.js
// @updateURL https://update.greasyfork.org/scripts/389907/UrlShower.meta.js
// ==/UserScript==

(function() {
    'use strict';
    /*pedir imagenes*/
	var imagenes = document.getElementsByTagName("img");
	var no_repeat = document.getElementsByClassName("_--no repeat--_");

	for(var i=0;imagenes.length>i;i++){
		if(i==0 && no_repeat.length>0){
			/*ya se ejecuto el script*/
			console.log("ERR: Ya se ejecuto");
			break;
		}
		/*crear el nodo a insertar*/
		var newNode = document.createElement("span");
		var newContent = document.createTextNode(imagenes[i].src);
		newNode.appendChild(newContent);
		newNode.className = "_--no repeat--_";

		/*obtener una referencia al nodo padre*/
		var parentDiv = imagenes[i].parentNode;

		/*agregar url*/
		var sp2 = imagenes[i];
		parentDiv.insertBefore(newNode,sp2);
	}
	console.log("Powered By SStvAA!")
})();