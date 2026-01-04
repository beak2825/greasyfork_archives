// ==UserScript==
// @name Crédit Agricole - Reduce download delay
// @description Ce script réduit le temps d'attente entre chaque téléchargement de documents dans un compte Crédit Agricole
// @version 2019.01.1
// @namespace Violentmonkey Scripts
// @match https://www.credit-agricole.fr/
// @grant none
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/375515/Cr%C3%A9dit%20Agricole%20-%20Reduce%20download%20delay.user.js
// @updateURL https://update.greasyfork.org/scripts/375515/Cr%C3%A9dit%20Agricole%20-%20Reduce%20download%20delay.meta.js
// ==/UserScript==
// 

// Own implementation of selectionLiens
// The only change is the delaiEdoc value
function selectionLiensGM (id){
	var lien = document.getElementById(id).getAttribute("href");
	if (lien !== null){
		document.getElementById(id).removeAttribute("href");
		document.getElementById(id).setAttribute("href_bak", lien);
		var srctab = document.getElementById(id).getElementsByTagName("span");
		srctab[0].setAttribute("class_bak", srctab[0].getAttribute("class"));
		srctab[0].removeAttribute("class");
		srctab[0].setAttribute("class","icon imgbam-ajax-loader");
		srctab[0].setAttribute("title_bak", srctab[0].getAttribute("title"));
		srctab[0].removeAttribute("title");
		srctab[0].setAttribute("title","Téléchargement en cours");
	}
	var page = document.getElementById("e-doc");
	var allAnchors = page.getElementsByTagName("a");
	for (var i = 0; i < allAnchors.length; i++) {
		if (allAnchors[i].getAttribute("href") !== null && allAnchors[i].getAttribute("href").indexOf('ouvreTelechargement') != -1 && allAnchors[i].getAttribute("href_bak") === null) {
			allAnchors[i].setAttribute("href_bak", allAnchors[i].getAttribute("href"));
			allAnchors[i].removeAttribute("href");
		}
	}

	var delaiEdoc = 1000;
	setTimeout("activerLiens()",delaiEdoc);
}

// Insert function in the document
var script = document.createElement('script');
script.appendChild(document.createTextNode(selectionLiensGM));
(document.body || document.head || document.documentElement).appendChild(script);

// Replace href function calls by our own
var links = document.getElementsByTagName('a');
for(var i = 0; i < links.length; i++) {
    var href = links[i].getAttribute('href');
    if (href === null) {continue;}
    href = href.replace('selectionLiens(', 'selectionLiensGM(');
    links[i].setAttribute('href', href);
}