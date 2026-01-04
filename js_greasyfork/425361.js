// ==UserScript==
// @name        Ltb2CL
// @description Propose en lien la fiche CL (et IMDB) depuis une fiche Letterboxd
// @author      teragneau
// @match       https://*letterboxd.com/film/*
// @version     1.0
// @namespace https://greasyfork.org/users/753408
// @downloadURL https://update.greasyfork.org/scripts/425361/Ltb2CL.user.js
// @updateURL https://update.greasyfork.org/scripts/425361/Ltb2CL.meta.js
// ==/UserScript==

var tt = document.getElementsByClassName("micro-button")[0].href.split("tt")[2].split("/")[0]
var tuyau = document.getElementsByClassName("text-link")[0].innerHTML.split("<span")
document.getElementsByClassName("text-link")[0].innerHTML = tuyau[0]+`<a href='https://www.cinelounge.org/imdb2cl/` + tt + `' target="_blank" class="micro-button track-event" data-track-action="CL">CL</a>`+`<span`+tuyau[1];