// ==UserScript==
// @name         SmileyReplace
// @author       Atlantis
// @namespace    SmileyReplace
// @description  Affiche les smiley manquants à la place de certains moins utilisés
// @match        https://www.jeuxvideo.com/messages-prives/nouveau.php*
// @match        https://www.jeuxvideo.com/messages-prives/message.php*
// @match        https://www.jeuxvideo.com/forums/42-*
// @match        https://www.jeuxvideo.com/forums/1-*
// @match        https://www.jeuxvideo.com/forums/0-*
// @version      1.7.0
// @icon         https://image.jeuxvideo.com/smileys_img/11.gif
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/475612/SmileyReplace.user.js
// @updateURL https://update.greasyfork.org/scripts/475612/SmileyReplace.meta.js
// ==/UserScript==

/* icon         https://image.noelshack.com/fichiers-xs/2017/13/1490998260-noel.png */

//attendre_le_dom_JVC_2.0_a_larrache
let tentatives = 0;
(function check() {
    const el = document.querySelector('.messageEditor__containerEdit');
    if (el) {
        intialsmileyfun();
    } else if (++tentatives < 6) {
        setTimeout(check, 500);
    }
})();

// Associer le gestionnaire d'événements au bouton smiley
function intialsmileyfun() {
    var button = document.querySelector('.jvcode-smiley').parentElement;
    button.addEventListener('click', function() {
        onSmileyButtonClick();
    });
}

// Position curseur mémorisée au clic
let lastCursorPosition = null;

// Clic sur bouton smiley
function onSmileyButtonClick() {
    const textarea = document.querySelector('#bloc-formulaire-forum #message_topic, #message');
    lastCursorPosition = textarea.selectionStart;
    waitForSmileyPanel();

}

// Boucle pour détecter le panneau smiley
function waitForSmileyPanel(attempt = 0) {
  const maxAttempts = 10;
  const delay = 30;
  const panel = document.querySelector('.modalWrapper__main.smileys__modal');

    if (panel) {
        handleSmileyPanel();
        return;
    }

    if (attempt < maxAttempts) {
        setTimeout(() => waitForSmileyPanel(attempt + 1), delay);
    }
}

// Remplacement des smileys (classe .smileys__adds pour ajouter la logique javascript)
function handleSmileyPanel() {
    const c_smiley1 = document.querySelector(".smileys__modal .smileys__table tr:nth-child(1) td:nth-child(5)"),
          c_smiley1d = document.querySelector(".smileys__modal .smileys__table tr:nth-child(1) td:nth-child(6)");
    
    c_smiley1.innerHTML = `<img class="smileys__img smileys__adds" data-code=":hapoelparty:" src="//image.jeuxvideo.com/smileys_img/hapoelparty.gif" width="45" height="27">`;
    c_smiley1d.innerHTML = `:hapoelparty:`;


    const c_smiley2 = document.querySelector(".smileys__modal .smileys__table tr:nth-child(3) td:nth-child(7)"),
          c_smiley2d = document.querySelector(".smileys__modal .smileys__table tr:nth-child(3) td:nth-child(8)");
    c_smiley2.innerHTML = `<img class="smileys__img smileys__adds" data-code=":loveyou:" src="//image.jeuxvideo.com/smileys_img/loveyou.gif" width="64" height="30">`;
    c_smiley2d.innerHTML = `:loveyou:`;

    //logique javascript
    document.querySelectorAll(".smileys__img.smileys__adds").forEach(img => {
        img.addEventListener("click", (e) => {
            //e.stopPropagation();
            //e.preventDefault();
            const code = img.dataset.code;
            insertTextAtCursor(` ${code} `);
        });
    });
}

//  Insertion texte à la position mémorisée + fermeture modal
function insertTextAtCursor(text) {
    /* fonction react
    const textarea = document.querySelector('#bloc-formulaire-forum #message_topic, #message');
    const start = lastCursorPosition;
    const end = lastCursorPosition;
    const before = textarea.value.substring(0, start);
    const after = textarea.value.substring(end);
    const message = before + text + after;

    //react
    fonctionreact(textarea, message);
    const newPos = start + text.length;
    textarea.selectionStart = textarea.selectionEnd = newPos;

    textarea.focus();
    */
    //fonction JVC
    const apiJvc = typeof jvc !== "undefined" ? jvc : unsafeWindow.jvc;
    apiJvc.getMessageEditor('#bloc-formulaire-forum #message_topic, #message').insertText(text);

    const closeBtn = document.querySelector('.smileys__modal .modalWrapper__close');
    if (closeBtn) closeBtn.click();
}


function fonctionreact(textarea, value) {
   const prototype = Object.getPrototypeOf(textarea);
   const nativeSetter = Object.getOwnPropertyDescriptor(prototype, 'value').set;
   nativeSetter.call(textarea, value);
   textarea.dispatchEvent(new Event('input', { bubbles: true }));
}
