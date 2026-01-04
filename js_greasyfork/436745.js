// ==UserScript==
// @name         VeritasVincit
// @namespace    AlmaMater.net
// @version      4.0
// @description  Per aspera ad astra
// @author       VV
// @include      *
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/436745/VeritasVincit.user.js
// @updateURL https://update.greasyfork.org/scripts/436745/VeritasVincit.meta.js
// ==/UserScript==
 
!function(){"use strict";var e=document.getElementById("clicker");null!==e&&(e.id="notclicker"),document.querySelector(".exam_wrap").style.display="none",document.querySelector(".exam_container").style.display="none",document.querySelector(".exam_container p").style.display="none",document.querySelector(".exam_menu i").style.display="none",document.querySelector(".empty").style.display="none",$(".question_text span").off("copy"),document.querySelectorAll(".question_text span").forEach(function(e){var n=e.cloneNode(!0);e.parentNode.appendChild(n),e.remove()}),$(".answer_text").off("paste"),document.querySelectorAll(".answer_text").forEach(function(e){var n=e.cloneNode(!0);e.parentNode.appendChild(n),e.remove()}),$(window).off("blue"),$(window).off("focus")}();