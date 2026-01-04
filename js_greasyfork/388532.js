// ==UserScript==
// @name     CampusVirtualUGD::borrarContainerSlides
// @version  3
// @grant    none
// @match https://campusvirtual.ugd.edu.ar/moodle/
// @description Borrar los slides al tope de la pagina
// @namespace https://greasyfork.org/users/325953
// @downloadURL https://update.greasyfork.org/scripts/388532/CampusVirtualUGD%3A%3AborrarContainerSlides.user.js
// @updateURL https://update.greasyfork.org/scripts/388532/CampusVirtualUGD%3A%3AborrarContainerSlides.meta.js
// ==/UserScript==
var divSlides = document.querySelector(".slider-container");
divSlides.remove();
var divSlidesInferiores = document.querySelector("#middle-blocks");
divSlidesInferiores.remove();
