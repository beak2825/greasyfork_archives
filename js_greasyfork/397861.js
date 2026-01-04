// ==UserScript==
// @name         JVChat Anti Cigarette
// @namespace    http://tampermonkey.net/
// @version      0.1.11
// @description  Quelques options en plus pour JVChat Premium
// @author       NY_Yankees
// @match        http://*.jeuxvideo.com/forums/42-*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/397861/JVChat%20Anti%20Cigarette.user.js
// @updateURL https://update.greasyfork.org/scripts/397861/JVChat%20Anti%20Cigarette.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // CSS quasi c/c du code de JVChat pour garder le même style
    let css = `<style type="text/css">
    .jvchat-option {
    display: inline-block;
    cursor: pointer;
    margin-top: 0.3rem;
    -webkit-tap-highlight-color: transparent;
    position: relative;
}

.jvchat-option i {
    position: relative;
    display: inline-block;
    margin-right: .5rem;
    width: 46px;
    height: 26px;
    background-color: #e6e6e6;
    border-radius: 23px;
    vertical-align: text-bottom;
    transition: all 0.3s linear;
}

.jvchat-option i::before {
    content: "";
    position: absolute;
    left: 0;
    width: 42px;
    height: 22px;
    background-color: #fff;
    border-radius: 11px;
    transform: translate3d(2px, 2px, 0) scale3d(1, 1, 1);
    transition: all 0.25s linear;
}

.jvchat-option i::after {
    content: "";
    position: absolute;
    left: 0;
    width: 22px;
    height: 22px;
    background-color: #fff;
    border-radius: 11px;
    box-shadow: 0 2px 2px rgba(0, 0, 0, 0.24);
    transform: translate3d(2px, 2px, 0);
    transition: all 0.2s ease-in-out;
}

.jvchat-option:active i::after {
    width: 28px;
    transform: translate3d(2px, 2px, 0);
}

.jvchat-option:active input:checked + i::after {
    transform: translate3d(16px, 2px, 0);
}

.jvchat-option input {
    display: none;
}

.jvchat-option input:checked + i {
    background-color: #4BD763;
}

.jvchat-option input:checked + i::before {
    transform: translate3d(18px, 2px, 0) scale3d(0, 0, 0);
}

.jvchat-option input:checked + i::after {
    transform: translate3d(22px, 2px, 0);
}

#jvchat-option-span, #jvchat-highlight-span {
    position: absolute;
    margin-top: 4px;
}
</style>`

    // Bloc HTML des options
    const blocOptions =`
    <label id="jvchat-highlight" class="jvchat-option" title="Met le post en surbrillance quand on vous cite">
           <input id="jvchat-highlight-checkbox" type="checkbox">
           <i></i>
           <span id="jvchat-highlight-span">Surbrillance Citation</span>
     </label>
     <label id="jvchat-ignore" class="jvchat-option" title="Ignorer ce fdp de cigarette">
           <input id="jvchat-ignore-checkbox" type="checkbox">
           <i></i>
           <span id="jvchat-ignore-span">Ignorer Cigarette</span>
     </label>`;


    let pseudoPerso = "aloalol";

    // Supprime les posts de ce fdp de cigarette
    function ignorerCigarette(message, auteur) {
        const cigarette = /^[0-9]*c[il]ga?re?[lt]{1,2}e[0-9]*$/;
        if (cigarette.test(auteur.toLowerCase())) {
            message.style.display = "none";
            console.log(`Post de ${auteur} supprimé`);
        }
    }

    // Met le post en surbrillance si l'on vous cite
    function surbrillance(message, auteur) {
        const text = message.querySelector(".txt-msg").textContent;
        if (text.toLowerCase().includes(pseudoPerso.toLowerCase()) && pseudoPerso.toLowerCase() !== auteur.toLowerCase()) {
            message.style.backgroundColor = "rgba(206, 209, 239, 0.6)";
        }
    }

    // Met à jour les valeurs des checkbox dans le storage
    function updateIgnore() {
        GM_setValue("ignore", document.querySelector("#jvchat-ignore-checkbox").checked);
    }

    function updateHighlight() {
        GM_setValue("highlight", document.querySelector("#jvchat-highlight-checkbox").checked);
    }


    addEventListener("jvchat:activation", () => {
        pseudoPerso = document.querySelector("#jvchat-user-pseudo").textContent.trim();

        const blocInfo = document.querySelector("#jvchat-topic-info");
        blocInfo.insertAdjacentHTML("beforeend", blocOptions);

        // Applique le css
        document.head.insertAdjacentHTML("beforeend", css);

        const ignoreCheckbox = document.querySelector("#jvchat-ignore-checkbox");
        const highlightCheckbox = document.querySelector("#jvchat-highlight-checkbox");
        highlightCheckbox.checked = GM_getValue("highlight", false);
        ignoreCheckbox.checked = GM_getValue("ignore", false);
        highlightCheckbox.onchange = updateHighlight;
        ignoreCheckbox.onchange = updateIgnore;
    });

    addEventListener("jvchat:newmessage", event => {
        const isIgnore = document.querySelector("#jvchat-ignore-checkbox").checked;
        const isHighlightOn = document.querySelector("#jvchat-highlight-checkbox").checked;
        const message = document.querySelector(`.jvchat-message[jvchat-id="${event.detail.id}"]`);
        const auteur = message.querySelector(".jvchat-author").textContent.trim();
        if (isHighlightOn) {
            surbrillance(message, auteur);
        }
        if (isIgnore) {
            ignorerCigarette(message, auteur);
        }
    })
})();