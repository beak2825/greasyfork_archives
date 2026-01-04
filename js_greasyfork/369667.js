// ==UserScript==
// @name         Manu Auto Correct
// @description  Changer toute référence à "Emmanuel Macron" en "Manu".
// @namespace    https://greasyfork.org/users/94925
// @version      0.4
// @author       Wonderclod | Maxime Bouveron | Roubou | ReActif (Tampermonkey)
// @include      *
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369667/Manu%20Auto%20Correct.user.js
// @updateURL https://update.greasyfork.org/scripts/369667/Manu%20Auto%20Correct.meta.js
// ==/UserScript==

// Source
// ------
// Github  : https://github.com/Bo-Duke/Manu-Auto-Correct

// Extensions
// ----------
// Chrome  : https://chrome.google.com/webstore/detail/manu-auto-correct/eamgamedjemopbnggghghnciejnbdpoe
// Firefox : https://addons.mozilla.org/fr/firefox/addon/manu-auto-correct/

// Guide (noeuds TEXT uniquement)
var textNode, walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);

// Expressions à remplacer par 'Manu'
const rExp1 = new RegExp(
      'Emmanuel Macron|'
	+ 'EmmanuelMacron|'
	+ 'M[\.r] le Président de la République|' // En cas de 'Mr' ou 'M.'
    + 'le Président de la République|'
	+ 'Monsieur le Président de la République|'
	+ 'Monsieur le Président|'
	+ 'Président de la République française|'
	+ 'Président de la République|'
    + 'Le Chef de l\'Etat|'
	+ 'Le Président Macron|'
	+ 'Emmanuel Jean-Michel Frédéric Macron|'
	+ 'M[\.r] Macron'
    , 'gi' // Recherche 'g'lobal et 'i'nsensible à la casse
);

// Expressions "que/qu'" à remplacer par 'que Manu'
const rExp2 = new RegExp(
      'qu\'Manu|' // Au cas où le nom ai déjà été changé par 'rExp1'
    + 'que Macron|'
    + 'qu\'Emmanuel Macron|'
    + 'qu\'Emmanuel Jean-Michel Frédéric Macron'
    , 'gi' // Recherche 'g'lobal et 'i'nsensible à la casse
);

// Expressions "de/d'" à remplacer par 'de Manu'
const rExp3 = new RegExp(
      'd\'Manu|' // Au cas où le nom ai déjà été changé par 'rExp1'
    + 'de Macron|'
    + 'd\'Emmanuel Macron|'
    + 'd\'Emmanuel Jean-Michel Frédéric Macron'
    , 'gi' // Recherche 'g'lobal et 'i'nsensible à la casse
);

// Appliquer les changements dans la page
while(textNode=walk.nextNode()) {
    textNode.nodeValue = textNode.nodeValue.replace(rExp1, 'Manu');
    textNode.nodeValue = textNode.nodeValue.replace(rExp2, 'que Manu');
    textNode.nodeValue = textNode.nodeValue.replace(rExp3, 'de Manu');
}

// Appliquer les changement dans la barre de titre
document.title = document.title.replace(rExp1, 'Manu');
document.title = document.title.replace(rExp2, 'que Manu');
document.title = document.title.replace(rExp3, 'de Manu');