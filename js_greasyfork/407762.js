// ==UserScript==
// @name         Is This A Sponsored Video? - Autofocus
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       SStvAA
// @match        https://view.appen.io/assignments/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/407762/Is%20This%20A%20Sponsored%20Video%20-%20Autofocus.user.js
// @updateURL https://update.greasyfork.org/scripts/407762/Is%20This%20A%20Sponsored%20Video%20-%20Autofocus.meta.js
// ==/UserScript==
(function() {
    'use strict';

    window.onload = inicia;
     function inicia(){
        //Verificamos que coincida el nombre
        if(document.getElementsByClassName('job-title')[0].innerText.search('Is This A Sponsored Video')>=0){
            console.log('Is This A Sponsored Video? - Autofocus: Iniciado...');
            var cml = document.getElementsByClassName('cml');
            for(var i=0;cml.length>i;i++){
            	var radio = cml[i].getElementsByTagName('input')[0];
            	//Agregamos evento
            	radio.addEventListener('click', function(event){
            		//Cml padre
            		var cmlactu = event.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
            		//Pedimos el input tipo texto
            		cmlactu.querySelector('input[type=text]').focus();
            	},false)
           	}
    	}
    }
})();