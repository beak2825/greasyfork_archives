

    // ==UserScript==
    // @name         PKaBoot
    // @namespace    https://tampermonkey.net
    // @version      0.15
    // @description  A configurable script that maps keyboard keys (1, 2, 3, 4 and Space by default) to the answer buttons on Kahoot
    // @author       AshKmo
    // @match        https://kahoot.it/*
    // @grant        GM_getValue
    // @grant        GM_setValue
    // @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/429669/PKaBoot.user.js
// @updateURL https://update.greasyfork.org/scripts/429669/PKaBoot.meta.js
    // ==/UserScript==

    (function(){
        var keybinds = GM_getValue('keys');

        if (keybinds == null) {
            keybinds = ['1', '2', '3', '4', 'Space'];
        }

        var tkb = keybinds.map(e => e.toUpperCase());

        var menuEl = document.createElement('div');

        menuEl.innerHTML = '<style>.pkbInKeys {display:inline-block;width:44px !important;color:white;}</style><p style="margin:0;">PKaBoot keys:&nbsp<input type="text" class="pkbInKeys" style="background-color:rgb(208, 25, 55);"><input type="text" class="pkbInKeys" style="background-color:rgb(18, 96, 190);"><input type="text" class="pkbInKeys" style="background-color:rgb(199, 146, 0);"><input type="text" class="pkbInKeys" style="background-color:rgb(35, 126, 11);"><input type="text" class="pkbInKeys" style="background-color:black;"><button id="pkbSubmit" style="width: auto !important;">Apply</button></p>';

        menuEl.setAttribute('style', 'position:absolute;z-index:5;top:0px;left:15%;background-color:white;');

        var pkbInKeys = menuEl.querySelectorAll('.pkbInKeys');

        pkbInKeys.forEach((k,i) => (k.value = keybinds[i]));

        menuEl.querySelector('#pkbSubmit').onclick = () => {
            pkbInKeys.forEach((k,i) => (keybinds[i] = k.value));

            tkb = keybinds.map(e => e.toUpperCase());

            GM_setValue('keys', keybinds);
        };

        document.body.appendChild(menuEl);

        keybinds.map(k => k.toUpperCase());

        document.addEventListener('keydown', e => {
            var index = tkb.indexOf(e.key.toUpperCase());

            index = index == -1 ? tkb.indexOf(e.code.toUpperCase()) : index;

            try {
                document.querySelector(`[data-functional-selector="${index == 4 ? 'multi-select-submit-button' : 'answer-' + index}"]`).click();
            } catch {}
        });
    })();

