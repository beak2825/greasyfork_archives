// ==UserScript==
// @name         JVC Better Post
// @namespace    JVC Better Post
// @version      12.5.0
// @description  Corrige post (Cadre Noelshack "🔗" + vire les erreurs ".com.com")
// @author       Atlantis
// @icon         https://images.emojiterra.com/mozilla/128px/1f517.png
// @match        *://www.jeuxvideo.com/forums/42-*
// @match        *://www.jeuxvideo.com/forums/1-*
// @match        *://www.jeuxvideo.com/forums/0-*
// @match        *://www.jeuxvideo.com/recherche/forums/0-*
// @match        *://www.jeuxvideo.com/messages-prives/nouveau.php*
// @match        *://www.jeuxvideo.com/messages-prives/message.php*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/517688/JVC%20Better%20Post.user.js
// @updateURL https://update.greasyfork.org/scripts/517688/JVC%20Better%20Post.meta.js
// ==/UserScript==


//attendre_le_dom_JVC_2.0_a_larrache
let tentatives = 0;
(function check() {
    const el = document.querySelector('.messageEditor__containerEdit');
    if (el) {
        fontextandshack();
        createboutontextandshack();
    } else if (++tentatives < 6) {
        setTimeout(check, 500);
    }
})();

function fontextandshack() {
    var button = document.querySelector(".btn-poster-msg, .postMessage");
    button.addEventListener("click", cleantextandshack, true);

    window.addEventListener('jvchat:activation', function(event) {
        var button = document.querySelector("#jvchat-post") || document.querySelector(".btn-poster-msg, .postMessage");
        button.addEventListener("click", cleantextandshack, true);
    });
}

function createboutontextandshack() {

    let buttonsGroup3 = document.querySelectorAll(".buttonsEditor > .buttonsEditor__group")[2];
    buttonsGroup3.insertAdjacentHTML("beforeend", `
        <button class="buttonsEditor__button"
            title="Enlever Cadre NoelShack"
            type="button"
            id="recovery-noelshack">
            <span class="jvcode-link" style="position:relative; font-size:0.7em; top:-0.25em;"></span>
        </button>
    `);

    var first1 = 0;
    var other1 = 500;

    buttonsGroup3.querySelector("#recovery-noelshack").addEventListener("click", () => {
        var currentTime = new Date().getTime();
        var clickkfonction = currentTime - first1;

        if (clickkfonction < other1) {
            testoretextandshack();
        } else {
            cleantextandshack();
        }
        first1 = currentTime;
    });

}

function cleantextandshack() {

    const messageP = document.querySelector("#bloc-formulaire-forum #message_topic, #message");

    var text = messageP.value;
    text = text.replace(/\b(?:https?:\/\/)?www\.noelshack\.com\/(\d{4})-(\d{0,2})-(\d{0,2})-(\d+)-([\w-]+)\.(\w+)\b/gi, "https://image.noelshack.com/fichiers/$1/$2/$3/$4-$5.$6");
    text = text.replace(/\b(?:https?:\/\/)?www\.noelshack\.com\/(\d{4})-(\d{0,2})-(\d+)-([\w-]+)\.(\w+)\b/gi, "https://image.noelshack.com/fichiers/$1/$2/$3-$4.$5");
    //*/
    text = text.replace(/(jeuxvideo\.com)(\.com)+(?=\/)/g, '$1');
    //*/
    //messageP.value = text;
    Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, "value")
        .set.call(messageP, text);
    messageP.dispatchEvent(new Event("input", { bubbles: true }));
}


function testoretextandshack() {

    const messageP = document.querySelector("#bloc-formulaire-forum #message_topic, #message");

    var text = messageP.value;
    text = text.replace(/\b(?:https?:\/\/)?image\.noelshack\.com\/fichiers\/(\d{4})\/(\d{0,2})\/(\d{0,2})\/(\d+)\/([\w-]+)\.(\w+)\b/gi, "https://www.noelshack.com/$1-$2-$3-$4-$5.$6");
    text = text.replace(/\b(?:https?:\/\/)?image\.noelshack\.com\/fichiers\/(\d{4})\/(\d{0,2})\/(\d+)\/([\w-]+)\.(\w+)\b/gi, "https://www.noelshack.com/$1-$2-$3-$4.$5");
    text = text.replace(/\b(?:https?:\/\/)?image\.noelshack\.com\/fichiers\/(\d{4})\/(\d+)\/([\w-]+)\.(\w+)\b/gi, "https://www.noelshack.com/$1-$2-$3.$4");
    //messageP.value = text;
    Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, "value")
        .set.call(messageP, text);
    messageP.dispatchEvent(new Event("input", { bubbles: true }));
}
