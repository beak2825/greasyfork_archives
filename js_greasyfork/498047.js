// ==UserScript==
// @name         Optimisation_Firefox_Et_Mobile
// @namespace    Optimisation_Firefox_Et_Mobile
// @version      0.42.0
// @description  Optimisation affichage mobile.
// @author       Atlantis
// @icon         https://blog.mozilla.org/design/files/2019/06/Glyph.png
// @match        *://www.jeuxvideo.com/forums/*
// @match        *://www.jeuxvideo.com/recherche/forums/*
// @match        *://www.jeuxvideo.com/messages-prives/nouveau.php*
// @match        *://www.jeuxvideo.com/messages-prives/message.php*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/498047/Optimisation_Firefox_Et_Mobile.user.js
// @updateURL https://update.greasyfork.org/scripts/498047/Optimisation_Firefox_Et_Mobile.meta.js
// ==/UserScript==


//Patch_mobile_UNIQUEMENT_
(function() {
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes('mobile')) {
        'use strict';

        //Ameliore_JVChat_Mobile__
        window.addEventListener('jvchat:activation', function(event) {

             function hideElementIfExists(selector) {
                 const elementBtn = document.querySelector(selector);
                 if (elementBtn) elementBtn.style.display = 'none';
             }

             //Masquer boutons Souligné
             hideElementIfExists('.buttonsEditor__button[title="Italique"]');
             //Masquer boutons Listes
             hideElementIfExists('.buttonsEditor__button[title="Liste"]');
             hideElementIfExists('.buttonsEditor__button[title="Listes numérotées"]');
             //Masquer boutons clean citations
             hideElementIfExists('.buttonsEditor__button#cc-cite-one');
             hideElementIfExists('.buttonsEditor__button#cc-cite-two');
             //Masquer bouton video
             hideElementIfExists('.buttonsEditor__button[title="Vidéo"]');
             //Masquer boutons aide
             //hideElementIfExists('a[title="Aide"].xXx.btn.btn-jv-editor-toolbar');
             hideElementIfExists('.buttonsEditor__button#recovery-noelshack');

             // Modification éléments sans bar
             var boutonitalice = document.querySelector('.buttonsEditor__button[title="Italique"]');
             document.getElementById("jvchat-leftbar-reduce").onclick = () => {
                 if (boutonitalice) boutonitalice.style.display = '';
             };

             document.getElementById("jvchat-leftbar-extend").onclick = () => {
                 if (boutonitalice) boutonitalice.style.display = 'none';
             };

        }, false);
    }
})();


/*
if (window.location.href.indexOf("jeuxvideo.com/messages-prives/message.php") > -1) {
    if (userAgent.includes('firefox')) {
        resetTextFields(); //vide la zone de texte quand actualisé
    }
}


// vide la zone de texte en actualisant
function resetTextFields() {
    var textField1 = document.getElementById('message');
    if (textField1) {
        Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, "value")
          .set.call(textField1, '');
        textField1.dispatchEvent(new Event("input", { bubbles: true }));
    }
}
*/