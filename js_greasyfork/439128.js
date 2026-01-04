// ==UserScript==
// @name         Couleur Pseudo
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Met en couleur tout les messages de l'auteur et de notre pseudo
// @author       You
// @match        https://www.jeuxvideo.com/forums/*
// @icon         https://www.google.com/s2/favicons?domain=jeuxvideo.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/439128/Couleur%20Pseudo.user.js
// @updateURL https://update.greasyfork.org/scripts/439128/Couleur%20Pseudo.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let pseudoAuteur = localStorage.getItem('pseudoAuteur') || "";
    let monPseudo = document.querySelector('.headerAccount__pseudo').innerText
    window.addEventListener('click', function(e){
        if(e.target.tagName === "A"){
            pseudoAuteur = e.target.parentNode.parentNode.querySelector('.topic-author').innerText;
            localStorage.setItem('pseudoAuteur', pseudoAuteur)
        }

    });
    let msgUserNameColor = "#c39d48";

   document.querySelectorAll('.xXx.bloc-pseudo-msg.text-user').forEach(msgUserName => {
       if(msgUserName.innerText.match(pseudoAuteur) || (msgUserName.innerText.match(monPseudo))){
           msgUserName.style.color = msgUserNameColor;
       }
   });
})();