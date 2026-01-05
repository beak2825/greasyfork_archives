// ==UserScript==
// @name        correctif bug affichage
// @namespace   newtab
// @include     https://*.the-west.*
// @version     3
// @grant       none
// @description fr
// @downloadURL https://update.greasyfork.org/scripts/12608/correctif%20bug%20affichage.user.js
// @updateURL https://update.greasyfork.org/scripts/12608/correctif%20bug%20affichage.meta.js
// ==/UserScript==

var bouton = document.createElement('button');
bouton.innerHTML = 'clic';
bouton.setAttribute('onclick', 'var text = document.getElementById("ui_topbar").innerHTML;document.getElementById("ui_topbar").innerHTML = text.replace(/&amp;nbsp;/g, " ");var text = document.getElementsByClassName("custom_unit_counter Octoberfest hasMousePopup with_log")[0].innerHTML;document.getElementsByClassName("custom_unit_counter Octoberfest hasMousePopup with_log")[0].innerHTML = text.replace(/&amp;nbsp;/g, " ");')
bouton.setAttribute('style', 'z-index: 932;position: fixed;top: 0px;');
document.body.appendChild(bouton)