// ==UserScript==
// @name         LinkShower
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Muestra las url de cualquier enlace en el trabajo de F8
// @author       SStvAA!
// @match        https://render.figure-eight.io/assignments/*
// @match        https://tasks.figure-eight.work/assignments/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390985/LinkShower.user.js
// @updateURL https://update.greasyfork.org/scripts/390985/LinkShower.meta.js
// ==/UserScript==


(function() {
    'use strict';
    /*pedir enlaces a*/
	var links = document.getElementsByTagName("a");
	var no_repeat = document.getElementsByClassName("_--no repeat--_");

	for(var i=0;links.length>i;i++){
		if(i==0 && no_repeat.length>0){
			/*ya se ejecuto el script*/
			console.log("ERR: Ya se ejecuto");
			break;
		}
        console.log("valor en ",i,"array",links[i].href);
        if(links[i].target=="_blank" && links[i].href!=="https://figureeightcommunity.tumblr.com/"){
            /*crear el nodo a insertar*/
            var newNode = document.createElement("span");
            var newContent = document.createTextNode(links[i].href);
            newNode.appendChild(newContent);
            newNode.className = "_--no repeat--_";

            /*obtener una referencia al nodo padre*/
            var parentDiv = links[i].parentNode;

            /*agregar url*/
            var sp2 = links[i];
            parentDiv.insertBefore(newNode,sp2);
        }
	}
	console.log("Powered By SStvAA!")
})();