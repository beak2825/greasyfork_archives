// ==UserScript==
// @name         Auto Walk[Key 1], Jump[Key 2], Dodge[Key 3], Melee[Key 4] Mod For Shell Shockers
// @namespace
// @description   Combined auto-actions script triggers different actions (auto-walk, auto-jump, auto-dodge, auto-whisk) based on key presses (1, 2, 3, 4). Each action toggles on/off independently.
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
// @discord      https://discord.gg/Szy5vGhWwQ/*
// @version   4.0.0
// @grant        none
// @icon         https://t3.ftcdn.net/jpg/06/21/52/32/240_F_621523283_93JNEJ1v1X2OjTRnN31vNUVIwivyyOx9.jpg
// @run-at       document-start
// @require      https://cdn.jsdelivr.net/npm/babylonjs@3.3.0/babylon.min.js
// @namespace https://greasyfork.org/users/1228152
// @downloadURL https://update.greasyfork.org/scripts/494015/Auto%20Walk%5BKey%201%5D%2C%20Jump%5BKey%202%5D%2C%20Dodge%5BKey%203%5D%2C%20Melee%5BKey%204%5D%20Mod%20For%20Shell%20Shockers.user.js
// @updateURL https://update.greasyfork.org/scripts/494015/Auto%20Walk%5BKey%201%5D%2C%20Jump%5BKey%202%5D%2C%20Dodge%5BKey%203%5D%2C%20Melee%5BKey%204%5D%20Mod%20For%20Shell%20Shockers.meta.js
// ==/UserScript==

(function() {
  const addScript = () => {
    document.title = ' ঔৣƗNĐƗȺ»Official Mod in Use!';setTimeout(function(){
    document.getElementById("logo").innerHTML = "<img src='https://t3.ftcdn.net/jpg/06/21/52/32/240_F_621523283_93JNEJ1v1X2OjTRnN31vNUVIwivyyOx9.jpg'>";
}, 4000);
let style = document.createElement('link');
style.rel = 'stylesheet';
style.href = 'https://t3.ftcdn.net/jpg/06/21/52/32/240_F_621523283_93JNEJ1v1X2OjTRnN31vNUVIwivyyOx9.jpg';
document.head.appendChild(style);
  };
  document.body ? addScript() : document.addEventListener("DOMContentLoaded", e => addScript());
})();

(function() {
    setTimeout(()=>{document.getElementById("chatOut").style.userSelect="text"},5e3);
})();

(function() {
    'use strict';

    let autoDodgeInterval;
    const keySequence = ['a', 'w', 'd', ' '];
    let currentIndex = 0;

    function triggerKey(key) {
        document.dispatchEvent(new KeyboardEvent('keydown', {'key': key}));
        setTimeout(() => {
            document.dispatchEvent(new KeyboardEvent('keyup', {'key': key}));
        }, 500);
    }

    function autoDodge() {
        triggerKey(keySequence[currentIndex]);
        currentIndex = (currentIndex + 1) % keySequence.length;
    }

    let autoWhiskInterval;

    function autoWhisk() {
        document.dispatchEvent(new KeyboardEvent('keydown', {'key': 'f'})); // W key
        setTimeout(() => {
            document.dispatchEvent(new KeyboardEvent('keyup', {'key': 'f'}));
        }, 100);
    }

    let autoJumpInterval;

    function autoJump() {
        document.dispatchEvent(new KeyboardEvent('keydown', {'key': ' '})); // W key
        setTimeout(() => {
            document.dispatchEvent(new KeyboardEvent('keyup', {'key': ' '}));
        }, 100); // Adjust duration as needed
    }

    let autoWalkInterval;

    function autoWalk() {
        document.dispatchEvent(new KeyboardEvent('keydown', {'key': 'w'})); // W key
        setTimeout(() => {
            document.dispatchEvent(new KeyboardEvent('keyup', {'key': 'w'}));
        }, 100);
    }

    document.addEventListener('keydown', function(event) {
        if (event.key === '1' && !event.ctrlKey && !event.altKey && !event.shiftKey && !event.metaKey) {
            if (!autoWalkInterval) {
                autoWalkInterval = setInterval(autoWalk, 200);
            } else {
                clearInterval(autoWalkInterval);
                autoWalkInterval = null;
            }
        } else if (event.key === '2' && !event.ctrlKey && !event.altKey && !event.shiftKey && !event.metaKey) {
            if (!autoJumpInterval) {
                autoJumpInterval = setInterval(autoJump, 200);
            } else {
                clearInterval(autoJumpInterval);
                autoJumpInterval = null;
            }
        } else if (event.key === '3' && !event.ctrlKey && !event.altKey && !event.shiftKey && !event.metaKey) {
            if (!autoDodgeInterval) {
                autoDodgeInterval = setInterval(autoDodge, 500);
            } else {
                clearInterval(autoDodgeInterval);
                autoDodgeInterval = null;
            }
        } else if (event.key === '4' && !event.ctrlKey && !event.altKey && !event.shiftKey && !event.metaKey) {
            if (!autoWhiskInterval) {
                autoWhiskInterval = setInterval(autoWhisk, 200);
            } else {
                clearInterval(autoWhiskInterval);
                autoWhiskInterval = null;
            }
        }
    });
})();
