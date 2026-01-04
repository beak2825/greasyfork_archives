// ==UserScript==
// @name     Ajout variété bourse Fruitier
// @version  1
// @grant    none
// @description Ajoute un bouton pour ajouter une variété à son verger depuis la fiche descriptive
// @include https://www.fruitiers.net/fiche.php?id=*
// @namespace https://greasyfork.org/users/706557
// @downloadURL https://update.greasyfork.org/scripts/416341/Ajout%20vari%C3%A9t%C3%A9%20bourse%20Fruitier.user.js
// @updateURL https://update.greasyfork.org/scripts/416341/Ajout%20vari%C3%A9t%C3%A9%20bourse%20Fruitier.meta.js
// ==/UserScript==

const urlParams = new URLSearchParams(window.location.search);
const idVar = urlParams.get('id')

var titles = document.getElementsByTagName('h1');
var h1 = titles[0]

var ajout = document.createElement('a');
ajout.href = 'https://www.fruitiers.net/ajouter_au_verger.php?id='+idVar;
var ajoutTxt = document.createTextNode('[Ajouter]');
ajout.appendChild(ajoutTxt);
h1.appendChild(ajout)
ajout.style.fontSize='small'