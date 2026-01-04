// ==UserScript==
// @name        CLtoLTB
// @description Propose en lien la fiche Letterboxd depuis une fiche CL
// @author      teragneau
// @match       https://www.cinelounge.org/Film/*
// @match       https://www.cinelounge.org/film/*
// @match       https://www.cinelounge.org/page.php?page=film*
// @version     1.2
// @namespace https://greasyfork.org/users/753408
// @downloadURL https://update.greasyfork.org/scripts/425713/CLtoLTB.user.js
// @updateURL https://update.greasyfork.org/scripts/425713/CLtoLTB.meta.js
// ==/UserScript==
var tt = document.getElementsByClassName("text-extra-dark")[0].nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling.firstChild.nextSibling.firstChild.nextSibling.nextSibling.nextSibling.nextSibling.getAttribute("href").split("tt")[2]
console.log(tt)
var tuyau = document.getElementsByClassName("text-extra-dark")[0].innerHTML.split('<a id="searchTMDb"')
document.getElementsByClassName("text-extra-dark")[0].innerHTML = tuyau[0] + `
    <a 
        href='https://letterboxd.com/imdb/tt` + tt + `' 
        target="_blank"
        >
        <img 
            src="https://letterboxd.com/favicon.ico" 
            width="22" 
            height="23" 
            title="Page Letterboxd" 
            alt="Letterboxd">
     </a>
     <a id="searchTMDb"` + tuyau[1];

