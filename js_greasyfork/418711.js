// ==UserScript==
// @name         imgur redirector
// @version      0.4
// @description  Redirige imgur a la original que se muestra en Twitter.
// @author       ArtEze
// @match        https://imgur.com/*
// @grant        none
// @run-at       document-start
// @namespace https://greasyfork.org/users/163524
// @downloadURL https://update.greasyfork.org/scripts/418711/imgur%20redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/418711/imgur%20redirector.meta.js
// ==/UserScript==

function descargar(url,llamada){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            llamada(xhttp.responseText);
        }
    };
    xhttp.open("GET", url, true);
    xhttp.send();
}

descargar(location.href,function(x){
	var html = document.createElement("html");
	html.innerHTML = x;
	location.href=html.querySelector("meta[name='twitter:image']").content;
});
