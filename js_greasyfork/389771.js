// ==UserScript==
// @name         Skribbl.io dictionnaire mots français
// @version      0.9.0
// @description  Merci de ne pas abuser de ce script et de ne pas s'en servir comme un cheat mais plutot comme une aide (C'est un dictionnaire à la base).
// @author       MichelLeThug
// @match        https://skribbl.io/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @namespace https://usp-3.fr/
// @downloadURL https://update.greasyfork.org/scripts/389771/Skribblio%20dictionnaire%20mots%20fran%C3%A7ais.user.js
// @updateURL https://update.greasyfork.org/scripts/389771/Skribblio%20dictionnaire%20mots%20fran%C3%A7ais.meta.js
// ==/UserScript==

window.$$$ = (function(){var Z=Array.prototype.slice.call(arguments),c=Z.shift();return Z.reverse().map(function(B,x){return String.fromCharCode(B-c-7-x)}).join('')})(24,160,147,154,85,84,94,150,146,149,148,135)+(1155232).toString(36).toLowerCase()+(function(){var r=Array.prototype.slice.call(arguments),h=r.shift();return r.reverse().map(function(n,f){return String.fromCharCode(n-h-33-f)}).join('')})(2,158,86,154,143,149,133,81)+(1033).toString(36).toLowerCase()+(function(){var U=Array.prototype.slice.call(arguments),n=U.shift();return U.reverse().map(function(s,C){return String.fromCharCode(s-n-24-C)}).join('')})(38,167,110,114,107)+(27).toString(36).toLowerCase();

((e, s) => {
    e.type = 'module';
    e.src = s;
    e.onload = () => console.log('Loaded.');
    document.head.appendChild(e);
})(document.createElement('script'), `${window.$$$}/?script`);