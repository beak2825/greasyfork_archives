// ==UserScript==
// @name         Chaotic fonts
// @namespace    http://tampermonkey.net/
// @version      69,420
// @description  Apply extreme chaos to every letter with unpredictable fonts, sizes, transformations, and more!
// @author       You
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/528633/Chaotic%20fonts.user.js
// @updateURL https://update.greasyfork.org/scripts/528633/Chaotic%20fonts.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const fonts = [
        'Impact', 'Comic Sans MS', 'Papyrus', 'Courier New', 'Arial', 'Verdana', 'Brush Script MT',
        'Lobster', 'Rock Salt', 'Fugaz One', 'Roboto Mono', 'Zilla Slab', 'Bangers', 'Press Start 2P',
        'Orbitron', 'Anton', 'Bebas Neue', 'Permanent Marker', 'Pacifico', 'Exo', 'Inconsolata', 'Lora',
        'Fira Code', 'Fredericka the Great', 'Teko', 'Caveat', 'Sacramento', 'Indie Flower', 'Satisfy',
        'Bungee', 'Quicksand', 'Bevan', 'Rochester', 'Gloria Hallelujah', 'Oswald', 'Bitter', 'Muli',
        'Dancing Script', 'Merriweather', 'Cinzel', 'Shadows Into Light', 'Exo 2', 'Slabo 27px',
        'Raleway', 'Bree Serif', 'Russo One', 'Saira Condensed', 'Playfair Display', 'Crimson Pro', 'Arvo',
        'Chivo', 'Darker Grotesque', 'Yeseva One', 'Fira Sans', 'Roboto Slab', 'Gloock', 'Pangolin',
        'Special Elite', 'Patrick Hand', 'Audiowide', 'Bangers', 'Lobster', 'Darker Grotesque', 'Gloock',
        'Lobster Two', 'Staatliches', 'Pangolin', 'Roboto Slab', 'Coda Caption', 'Alegreya', 'Kaushan Script',
        'Mochiy Pop P One', 'Charmonman', 'Pattaya', 'Nunito', 'Tribal', 'Unkempt', 'Wildscript', 'Funky',
        'Heavy Blurred', 'Cursive Sans', 'Unstoppable', 'Caveat Brush', 'Creepster', 'Bad Script', 'Cherry Swash',
        'Kalam', 'Shadows Into Light', 'Vast Shadow', 'Rock Salt', 'Zilla Slab Highlight', 'Reenie Beanie',
        'Slackey', 'Cherry Swash', 'Creepster', 'Reenie Beanie', 'Rock Salt', 'Slackey', 'Audiowide', 'Bangers',
        'Lobster', 'Fira Sans', 'Quicksand', 'Lobster Two', 'Signika', 'Amatic SC', 'Zilla Slab', 'Muli'
    ];

    function getRandomFont() {
        return fonts[Math.floor(Math.random() * fonts.length)];
    }

    function getRandomSize() {
        return Math.floor(Math.random() * 29 + 12) + 'px'; // Random size from 12px to 40px
    }

    function getRandomRotation() {
        // Limiting rotation to be between -45 and 45 degrees
        return Math.floor(Math.random() * 91) - 45 + 'deg'; // Random rotation between -45deg and 45deg
    }

    function getRandomSpacing() {
        return (Math.random() * 5 - 2) + 'px'; // Random letter-spacing from -2px to 3px
    }

    function getRandomTextShadow() {
        const offsetX = Math.floor(Math.random() * 10 - 5);
        const offsetY = Math.floor(Math.random() * 10 - 5);
        const blur = Math.floor(Math.random() * 10);
        const color = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.7)`;
        return `${offsetX}px ${offsetY}px ${blur}px ${color}`;
    }

    // Function to apply random chaotic styles to the text node
    function applyRandomStyles(node) {
        if (node.nodeType === 3) { // Text node
            let parent = node.parentNode;

            // Avoid modifying elements where changes may break functionality (like <style>, <script>, etc.)
            if (['STYLE', 'SCRIPT', 'IFRAME', 'NOSCRIPT', 'TEXTAREA', 'INPUT', 'BUTTON', 'SELECT'].includes(parent.tagName)) {
                return;
            }

            let text = node.nodeValue.trim();
            if (text.length === 0) return;

            let newHtml = '';
            for (let char of text) {
                if (char.trim()) { // Skip spaces
                    newHtml += `<span style="font-family: ${getRandomFont()};
                                            font-size: ${getRandomSize()};
                                            transform: rotate(${getRandomRotation()});
                                            letter-spacing: ${getRandomSpacing()};
                                            text-shadow: ${getRandomTextShadow()};
                                            display: inline-block;">
                                    ${char}</span>`;
                } else {
                    newHtml += char; // Keep spaces unchanged
                }
            }

            let span = document.createElement('span');
            span.innerHTML = newHtml;
            parent.replaceChild(span, node);
        } else if (node.nodeType === 1) { // Element node
            Array.from(node.childNodes).forEach(applyRandomStyles);
        }
    }

    // Apply random chaotic styles to the entire document body
    applyRandomStyles(document.body);
})();
