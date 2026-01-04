// ==UserScript==
// @name         SWDR alternative EAP sound
// @namespace    zordem.com
// @version      2024-08-04
// @description  Changes the EAP Sound to an alternative one.
// @author       zordem
// @grant        none
// @match        https://rj.td2.info.pl/*
// @match        https://rjdev.td2.info.pl/*
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/502605/SWDR%20alternative%20EAP%20sound.user.js
// @updateURL https://update.greasyfork.org/scripts/502605/SWDR%20alternative%20EAP%20sound.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const EAPSound = document.getElementById("signalBlockEAPAudioPlayer");

    console.log(EAPSound.children);

    for (let i = 0; i < EAPSound.children.length; i++) {
        EAPSound.removeChild(EAPSound.children[i]);
    }

    EAPSound.appendChild(document.createElement("source"));

    const EAPSoundChild = EAPSound.children[0];

    EAPSoundChild.src = "https://up.td2.info.pl/f/a76e816048d04ac59a9b/?dl=1";

    EAPSound.loop = true;

    EAPSound.load();

})();