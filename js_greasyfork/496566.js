// ==UserScript==
// @name         Auto Walk[NumPad 1] and Walk+Jump[NumPad 2] Mod For Shell Shockers
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Auto Walk and Walk+Jump script triggered by numpad keys (1 and 2).
// @match        *://algebra.best/*
// @match        *://algebra.vip/*
// @match        *://biologyclass.club/*
// @match        *://deadlyegg.com/*
// @match        *://deathegg.world/*
// @match        *://eggcombat.com/*
// @match        *://egg.dance/*
// @match        *://eggfacts.fun/*
// @match        *://egghead.institute/*
// @match        *://eggisthenewblack.com/*
// @match        *://eggsarecool.com/*
// @match        *://geometry.best/*
// @match        *://geometry.monster/*
// @match        *://geometry.pw/*
// @match        *://geometry.report/*
// @match        *://hardboiled.life/*
// @match        *://hardshell.life/*
// @match        *://humanorganising.org/*
// @match        *://mathdrills.info/*
// @match        *://mathfun.rocks/*
// @match        *://mathgames.world/*
// @match        *://math.international/*
// @match        *://mathlete.fun/*
// @match        *://mathlete.pro/*
// @match        *://overeasy.club/*
// @match        *://scrambled.best/*
// @match        *://scrambled.tech/*
// @match        *://scrambled.today/*
// @match        *://scrambled.us/*
// @match        *://scrambled.world/*
// @match        *://shellshockers.club/*
// @match        *://shellshockers.site/*
// @match        *://shellshockers.us/*
// @match        *://shellshockers.world/*
// @match        *://softboiled.club/*
// @match        *://violentegg.club/*
// @match        *://violentegg.fun/*
// @match        *://yolk.best/*
// @match        *://yolk.life/*
// @match        *://yolk.rocks/*
// @match        *://yolk.tech/*
// @match        *://shellshock.io/*
// @match        *://zygote.cafe/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/496566/Auto%20Walk%5BNumPad%201%5D%20and%20Walk%2BJump%5BNumPad%202%5D%20Mod%20For%20Shell%20Shockers.user.js
// @updateURL https://update.greasyfork.org/scripts/496566/Auto%20Walk%5BNumPad%201%5D%20and%20Walk%2BJump%5BNumPad%202%5D%20Mod%20For%20Shell%20Shockers.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let autoWalkInterval;
    let autoWalkJumpInterval;

    function triggerKeyDownUp(key) {
        document.dispatchEvent(new KeyboardEvent('keydown', {'key': key}));
        setTimeout(() => {
            document.dispatchEvent(new KeyboardEvent('keyup', {'key': key}));
        }, 100);
    }

    function autoWalk() {
        triggerKeyDownUp('w');
    }

    function autoWalkJump() {
        triggerKeyDownUp('w');
        triggerKeyDownUp(' ');
    }

    document.addEventListener('keydown', function(event) {
        if (event.code === 'Numpad1' && !event.ctrlKey && !event.altKey && !event.shiftKey && !event.metaKey) {
            if (!autoWalkInterval) {
                autoWalkInterval = setInterval(autoWalk, 1);
            } else {
                clearInterval(autoWalkInterval);
                autoWalkInterval = null;
            }
        } else if (event.code === 'Numpad2' && !event.ctrlKey && !event.altKey && !event.shiftKey && !event.metaKey) {
            if (!autoWalkJumpInterval) {
                autoWalkJumpInterval = setInterval(autoWalkJump, 1);
            } else {
                clearInterval(autoWalkJumpInterval);
                autoWalkJumpInterval = null;
            }
        }
    });
})();
