// ==UserScript==
// @name        debugPPdofus
// @version     2
// @description Remplace l'image du premier slot de dofus des pages persos par une image provenant de dofusroom parce que ces demeurés n'ont
//              toujours pas donné le privilège de lecture aux utilisateurs 2 ans après la sortie des items.
// @grant       none
// @author      Rolf-Peter Früschke
// @match       https://www.dofus.com/fr/mmorpg/communaute/annuaires/pages-persos/*
// @icon        https://www.dofusroom.com/img/assets/items/217002.png
// @namespace   https://greasyfork.org/users/752738
// @downloadURL https://update.greasyfork.org/scripts/433550/debugPPdofus.user.js
// @updateURL https://update.greasyfork.org/scripts/433550/debugPPdofus.meta.js
// ==/UserScript==

console.log('[debugPPdofus] - debugPPdofus lancé !');

// Prytek
var pryfus = document.querySelectorAll('[class="ak-linker"]')[10].innerHTML;
var id = pryfus.split('52/')[1].split('.png')[0];
document.querySelectorAll('[class="ak-linker"]')[10].innerHTML = '<img src=\"https://www.dofusroom.com/img/assets/items/'+id+'.png\">';

// Anneau de Brouce
var brouce = document.querySelector('[data-hasqtip="linker_item_13115"]').innerHTML;
id = 9249;
document.querySelector('[data-hasqtip="linker_item_13115"]').innerHTML = '<img src=\"https://www.dofusroom.com/img/assets/items/'+id+'.png\">';