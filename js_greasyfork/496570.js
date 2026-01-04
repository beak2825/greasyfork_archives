// ==UserScript==
// @name         Auto Walk[NumPad 1], Walk+Jump[NumPad 2], and Walk Left+Right[NumPad 3] Mod For Shell Shockers
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Auto Walk, Walk+Jump, and Walk Left+Right script triggered by numpad keys (1, 2, and 3), initially disabled.
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
// @icon         -
// @run-at       document-start
// @require      https://cdn.jsdelivr.net/npm/babylonjs@3.3.0/babylon.min.js
// @downloadURL https://update.greasyfork.org/scripts/496570/Auto%20Walk%5BNumPad%201%5D%2C%20Walk%2BJump%5BNumPad%202%5D%2C%20and%20Walk%20Left%2BRight%5BNumPad%203%5D%20Mod%20For%20Shell%20Shockers.user.js
// @updateURL https://update.greasyfork.org/scripts/496570/Auto%20Walk%5BNumPad%201%5D%2C%20Walk%2BJump%5BNumPad%202%5D%2C%20and%20Walk%20Left%2BRight%5BNumPad%203%5D%20Mod%20For%20Shell%20Shockers.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let autoWalkActive = false;
    let autoWalkJumpInterval;
    let autoWalkLeftRightInterval;
    let walkingLeft = true;

    function triggerKeyDown(key) {
        document.dispatchEvent(new KeyboardEvent('keydown', { 'key': key }));
    }

    function triggerKeyUp(key) {
        document.dispatchEvent(new KeyboardEvent('keyup', { 'key': key }));
    }

    function autoWalk() {
        if (autoWalkActive) {
            triggerKeyDown('w');
        } else {
            triggerKeyUp('w');
        }
    }

    function autoWalkJump() {
        triggerKeyDown('w');
        triggerKeyDownUp(' ');
    }

    function triggerKeyDownUp(key) {
        document.dispatchEvent(new KeyboardEvent('keydown', { 'key': key }));
        setTimeout(() => {
            document.dispatchEvent(new KeyboardEvent('keyup', { 'key': key }));
        }, 100);
    }

    function walkLeftRight() {
        if (walkingLeft) {
            triggerKeyDown('a');
            triggerKeyUp('d');
        } else {
            triggerKeyDown('d');
            triggerKeyUp('a');
        }
        walkingLeft = !walkingLeft;
    }

    document.addEventListener('keydown', function(event) {
        // Toggle auto walk on Numpad1
        if (event.code === 'Numpad1' && !event.ctrlKey && !event.altKey && !event.shiftKey && !event.metaKey) {
            autoWalkActive = !autoWalkActive;
            autoWalk();
        }
        // Toggle auto walk+jump on Numpad2
        else if (event.code === 'Numpad2' && !event.ctrlKey && !event.altKey && !event.shiftKey && !event.metaKey) {
            if (!autoWalkJumpInterval) {
                triggerKeyDown('w');
                autoWalkJumpInterval = setInterval(autoWalkJump, 500);
            } else {
                clearInterval(autoWalkJumpInterval);
                triggerKeyUp('w');
                autoWalkJumpInterval = null;
            }
        }
        // Toggle walk left and right on Numpad3
        else if (event.code === 'Numpad3' && !event.ctrlKey && !event.altKey && !event.shiftKey && !event.metaKey) {
            if (!autoWalkLeftRightInterval) {
                autoWalkLeftRightInterval = setInterval(walkLeftRight, 3000);
            } else {
                clearInterval(autoWalkLeftRightInterval);
                triggerKeyUp('a');
                triggerKeyUp('d');
                autoWalkLeftRightInterval = null;
            }
        }
    });
})();
