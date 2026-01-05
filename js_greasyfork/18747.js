// ==UserScript==
// @name         WIKI zeroSpaceRemover
// @namespace    https://github.com/gremi64
// @version      0.1
// @description  Supprime les espace de largeur nulle présent dans la page
// @author       Gremi64
// @match        http://teams.lyon.fr.sopra/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/18747/WIKI%20zeroSpaceRemover.user.js
// @updateURL https://update.greasyfork.org/scripts/18747/WIKI%20zeroSpaceRemover.meta.js
// ==/UserScript==

window.addEventListener('load', function() {
    document.body.innerHTML = document.body.innerHTML.replace(/\u200B/g,'');
}, false);