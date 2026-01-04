// ==UserScript==
// @name        Show Twitter Image Alt Text
// @name:en     Show Twitter Image Alt Text
// @namespace   Violentmonkey Scripts
// @match       https://twitter.com/
// @include     https://twitter.com/*
// @grant       none
// @version     2.1
// @author      Antonin Roussel 2020 / Adrian Roselli 2019
// @description Montre le texte alternatif des images publiées sur Twitter quand disponible
// @description:en Show Twitter image alternative text when available.
// @downloadURL https://update.greasyfork.org/scripts/417864/Show%20Twitter%20Image%20Alt%20Text.user.js
// @updateURL https://update.greasyfork.org/scripts/417864/Show%20Twitter%20Image%20Alt%20Text.meta.js
// ==/UserScript==

(function(){
var a=document.createElement('style'),b;
document.head.appendChild(a);
b=a.sheet;

// Au survol images miniatures, afficher le texte alternatif (aria-label) écrit en blanc sur fond sombre 
b.insertRule('a[role=link]:hover div[aria-label]::after{'+
    'content:attr(aria-label);'+
    'display:block;'+
    'overflow-y:scroll;'+
    'background-color:rgba(0,0,0,.8);'+
    'color:#fff;'+
    'font-size:smaller;'+
    'font-family:\'Segoe UI\',-apple-system,BlinkMacSystemFont,Roboto,Oxygen-Sans,Ubuntu,Cantarell,\'Helvetica Neue\',sans-serif;'+
    'padding:.5em;'+
    'max-height:calc(100% - 0.5em * 2);'+
    'position:absolute;'+
    'bottom:0;'+
    'left:0;'+
    'right:0;'+
    'z-index:1'+
  '}',0);

// ?
b.insertRule('a[role=link] div[aria-label][style*=margin-left]::after{left:60%}',0);

// ?
//b.insertRule('[dir=auto]>svg{display:none}',0);

// ?
b.insertRule('a[role=link] div[aria-label]{display:contents;margin-top:unset !important;margin-bottom:unset !important}',0);

// Au survol images plein écran, afficher le texte alternatif (aria-label) écrit en blanc sur fond sombre 
b.insertRule('ul[role=list] li[role=listitem] div[aria-label]:hover::after{'+
    'content:attr(aria-label);'+
    'display:block;'+
    'overflow-y:scroll;'+
    'background-color:rgba(0,0,0,.8);'+
    'color:#fff;'+
    'font-size:smaller;'+
    'font-family:\'Segoe UI\',-apple-system,BlinkMacSystemFont,Roboto,Oxygen-Sans,Ubuntu,Cantarell,\'Helvetica Neue\',sans-serif;'+
    'padding:.5em;'+
    'max-height:calc(100% - 0.5em * 2);'+
    'position:absolute;'+
    'bottom:0;'+
    'left:0;'+
    'right:0;'+
    'z-index:1'+
  '}',0);
  
// Ne pas masquer les boutons de navigation 
b.insertRule('div[aria-label][role=button]::after{'+
    'display:none;'+
  '}',b.cssRules.length);
  
// Ne pas afficher de texte alternatif pour le peu d'information qu'apporte la mention "Image"
b.insertRule('a[role=link]:hover div[aria-label="Image"]::after{'+
     'display:none;'+
  '}',b.cssRules.length);
  
// Ne pas afficher de zone de texte alternatif quand il n'y a pas de texte
b.insertRule('a[role=link]:hover div[aria-label=""]::after{'+
     'display:none;'+
  '}',b.cssRules.length);
  
// Ne pas altérer la cloche de notifications (peu mieux faire)
b.insertRule('a[role=link]:hover div[aria-label$="non lus"]::after{'+
     'display:none;'+
  '}',b.cssRules.length);
  
// Cacher le marqueur ALT qui indique la présence d'un texte alternatif, mais qui en masque aussi une partie 
b.insertRule('a[role=link]:hover > div:nth-child(2){'+
     'display:none;'+
  '}',b.cssRules.length);

})();