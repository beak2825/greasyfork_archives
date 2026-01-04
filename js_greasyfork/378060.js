// ==UserScript==
// @name        Pichunterfix
// @description Este script corrige bugs na tela de favoritos do Pichunter, durante 30 segundos, antes de parar de rodar.
// @match 	    *://*.pichunter.com/favorites/*
// @run-at      document-end
// @version     1.0.2
// @grant       none
// @namespace https://greasyfork.org/users/248858
// @downloadURL https://update.greasyfork.org/scripts/378060/Pichunterfix.user.js
// @updateURL https://update.greasyfork.org/scripts/378060/Pichunterfix.meta.js
// ==/UserScript==

setTimeout(fun, 2000);
setTimeout(fun, 4000);
setTimeout(fun, 6000);
setTimeout(fun, 8000); 
setTimeout(fun, 10000); 
setTimeout(fun, 12000); 
setTimeout(fun, 14000); 
setTimeout(fun, 16000); 
setTimeout(fun, 18000); 
setTimeout(fun, 20000); 
setTimeout(fun, 22000); 
setTimeout(fun, 24000); 
setTimeout(fun, 26000); 
setTimeout(fun, 28000); 
setTimeout(fun, 30000);


function fun() {
	var x = document.getElementsByClassName("wlGal"), i;
	for (i = 0; i < x.length; i++) {
  	x[i].style.display = "inline-block"; 
	} 
	var x = document.getElementsByClassName("wlRemove"), i;
	for (i = 0; i < x.length; i++) {
  	x[i].style.display = "inline-block"; 
	} 
}