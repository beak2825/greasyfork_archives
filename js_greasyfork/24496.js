// ==UserScript==
// @name          Bublinove okienka s ceskym prekladom OOTS
// @description   Nacita preklady a zobrazi ich v hranatych bublinach nad povodnymi bublinami.
// @include       http://www.giantitp.com/comics/oots*.html*
// @include       http://oots.cz/bubbles/preview.php?view=*
// @copyright     cache.slovakia, free to use or modify, only show my nick as part of licence
// @version 0.0.1.20161101174012
// @namespace https://greasyfork.org/users/77286
// @downloadURL https://update.greasyfork.org/scripts/24496/Bublinove%20okienka%20s%20ceskym%20prekladom%20OOTS.user.js
// @updateURL https://update.greasyfork.org/scripts/24496/Bublinove%20okienka%20s%20ceskym%20prekladom%20OOTS.meta.js
// ==/UserScript==

//vyparsovanie cisla stripu
var stripNumber = "0001";
if(window.location.href.indexOf("oots.cz") != -1) stripNumber = window.location.href.substring(40,44);
else stripNumber = window.location.href.substring(35,39);

// vlozeni skriptu z oots.cz
var sc = document.createElement("script");
sc.src = "http://oots.cz/bubbles/new/bubblesJS.php?strip=" + stripNumber;
sc.type = "text/javascript";
sc.setAttribute("onLoad", "try{start();}catch(e){alert(decodeURIComponent('P%C5%99eklad%20nenalezen%20nebo%20nastala%20chyba%20p%C5%99i%20na%C4%8D%C3%ADt%C3%A1n%C3%AD.'));}");
document.body.appendChild(sc);

// ==/UserScript==
