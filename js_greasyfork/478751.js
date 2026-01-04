// ==UserScript==
// @name         JVC Clean Citation
// @namespace    JVC Clean Citation
// @version      3.0.2
// @description  Reduire Cascade citations imbriquées (Reduit taille message / Evite les msg d'erreur)
// @author       Atlantis
// @icon         https://images.emojiterra.com/google/android-11/128px/1f4ac.png
// @match        *://www.jeuxvideo.com/forums/42-*
// @match        *://www.jeuxvideo.com/forums/1-*
// @match        *://www.jeuxvideo.com/forums/0-*
// @match        *://www.jeuxvideo.com/recherche/forums/0-*
// @match        *://www.jeuxvideo.com/messages-prives/nouveau.php*
// @match        *://www.jeuxvideo.com/messages-prives/message.php*
// @grant        none
// @license      CC0-1.0
// @downloadURL https://update.greasyfork.org/scripts/478751/JVC%20Clean%20Citation.user.js
// @updateURL https://update.greasyfork.org/scripts/478751/JVC%20Clean%20Citation.meta.js
// ==/UserScript==

//attendre_le_dom_JVC_2.0_a_larrache
let tentatives = 0;
(function check() {
    const el = document.querySelector('.messageEditor__containerEdit');
    if (el) {
        createboutonetwo12();
    } else if (++tentatives < 6) {
        setTimeout(check, 500);
    }
})();

function createboutonetwo12() {

    const buttonsGroup2 = document.querySelectorAll(".buttonsEditor > .buttonsEditor__group")[1];
    //bouton_html
    buttonsGroup2.insertAdjacentHTML("beforeend", `
        <button class="buttonsEditor__button"
            type="button"
            title="Réduire au message cité"
            id="cc-cite-one"
            style="padding-top:.35em; width:1.1rem;">
                <span style="font-size:1.22em;">”</span>
        </button>
        <button class="buttonsEditor__button"
            type="button"
            title="Réduire au message cité + citation imbriquée"
            id="cc-cite-two"
            style="padding-top:.35em; width:1.1rem;">
                <span style="font-size:1.22em;">“&hairsp;”</span>
        </button>
    `);

    // Réduction taille btn Spoiler déjà existant => via parent
    let spoilerButton = buttonsGroup2.querySelector('.jvcode-eye-blocked').parentElement;
    spoilerButton.style.fontSize = "1.3em";

    //fonction_js
    document.getElementById("cc-cite-one").addEventListener("click", () => eraseCitation("one"));
    document.getElementById("cc-cite-two").addEventListener("click", () => eraseCitation("two"));

}


function eraseCitation(niveauCitation) {

    //message_topic = fofo - message = mp
    const messageArea = document.querySelector("#bloc-formulaire-forum #message_topic, #message");

    //choix de la regex.
    let regexClean;
    if (niveauCitation === "one") {
        regexClean = /^(\s*>>|\s*> >).*\n?/gm;
    } else if (niveauCitation === "two") {
        regexClean = /^(\s*>>>|\s*> >>|\s*>> >|\s*> > >).*\n?/gm;
    }
    const cleanText = messageArea.value.replace(regexClean, '');

    //v1_respawn
    //messageArea.value = cleanText;
    //v2_respawn_react
    Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, "value")
        .set.call(messageArea, cleanText);
    messageArea.dispatchEvent(new Event("input", { bubbles: true }));

    //replacer_selecteur_sur_pc
    var userAgent = navigator.userAgent.toLowerCase();
    if (!userAgent.includes('mobile')) {
        messageArea.selectionStart = messageArea.value.length;
        messageArea.focus();
    }
}

/*CSS mobile*/

//mobile_CSS (reduit les marge sur petit ecran)
if (window.innerWidth <= 410) {
    const style = document.createElement('style');
    style.setAttribute('id', 'mobile-style-citation');
    style.setAttribute('type', 'text/css');
    style.appendChild(document.createTextNode(`
        .buttonsEditor > .buttonsEditor__group:nth-of-type(1),
        .buttonsEditor > .buttonsEditor__group:nth-of-type(2) {
            gap: 0.28rem;
            margin-right: 0.225rem;
        }
    `));
    document.head.appendChild(style);
}