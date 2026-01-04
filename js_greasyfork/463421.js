// ==UserScript==
// @name         Egg Finder
// @namespace    http://lazerpent.com/
// @version      1.1.0
// @description  Makes finding eggs a little bit easier...
// @author       Lazerpent [2112641]
// @match        https://www.torn.com/*
// @downloadURL https://update.greasyfork.org/scripts/463421/Egg%20Finder.user.js
// @updateURL https://update.greasyfork.org/scripts/463421/Egg%20Finder.meta.js
// ==/UserScript==
'use strict';

window.addEventListener('load', () => {
    const egg = document.getElementById('easter-egg-hunt-root');
    if (egg) {
        if (egg.classList.contains('egg-finder-found')) {
            return;
        }
        egg.classList.add('egg-finder-found');
        alert('There appears to be an egg on this page!');

        function moveEgg() {
            const buttons = egg.querySelectorAll('button');
            if (buttons.length === 0) {
                setTimeout(moveEgg, 50);
                return;
            }

            buttons.forEach(b => {
                b.style.top = '40%';
                b.style.left = '40%';
                b.style.height = '20%';
                b.style.width = '20%';
                b.style.position = 'fixed';
                b.style.border = '5px solid red';

                const children = b.children;

                children[0].style.height = '100%';

                const particles = children[children.length - 1];
                particles.style.left = '0';
                particles.style.width = '100%';
                particles.style.height = '100%';
            })
        }

        moveEgg();
    }
});