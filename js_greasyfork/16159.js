// ==UserScript==
// @name        Afficher images WebMail EMA
// @author      Gadcam
// @namespace   http://gadcam.fr/
// @description Permet de voir les images dans le webmail de l'EMA.
// @include     https://webmail.mines-ales.org/*
// @version     1
// @downloadURL https://update.greasyfork.org/scripts/16159/Afficher%20images%20WebMail%20EMA.user.js
// @updateURL https://update.greasyfork.org/scripts/16159/Afficher%20images%20WebMail%20EMA.meta.js
// ==/UserScript==
document.body.innerHTML = document.body.innerHTML.replace(/_embed=1&/g, '');