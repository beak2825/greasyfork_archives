// ==UserScript==
// @name         Animate Triple Autodarts
// @version      0.4
// @description  Animate Triple, Double and Bull hits
// @author       aMAZiNGJiN
// @match        *://play.autodarts.io/*
// @grant        none
// @license      MIT
// @namespace    https://greasyfork.org/users/1275557
// @downloadURL https://update.greasyfork.org/scripts/490067/Animate%20Triple%20Autodarts.user.js
// @updateURL https://update.greasyfork.org/scripts/490067/Animate%20Triple%20Autodarts.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Settings
    const triplesToAnimate = [20, 19, 18, 17, 16, 15]; // Add the triples you like to animate
    const doublesToAnimate = [20, 16, 12, 8, 4, 1]; // Add the doubles you like to animate
    const animateBull = true; // Enable or disable the bull animation

    function injectCSS() {
        const css = `
        .highlight {
            color: red;
            font-weight: bold;
        }

        .animate-hit {
            border: unset;
            outline: unset;
            position: relative;
            color: #fff;
            font-size: 20px;
            font-weight: 400;
            letter-spacing: 2px;
            word-spacing: 4px;
            text-transform: uppercase;
            background: linear-gradient(270deg, #0ebeff, #ffdd40, #ae63e4, #47cf73, #0ebeff, #ffdd40, #ae63e4, #47cf73);
            animation: rainbow-border 5s ease-in-out infinite;
            background-size: 400% 400%;
            z-index: 1;
        }

        .animate-hit::before, .glowing-border::after {
            content: "";
            position: absolute;
            inset: 0;
            z-index: -1;
        }

        .animate-hit::before {
            animation: rainbow-border 5s ease-in-out infinite;
            border-radius: 4px;
            background: linear-gradient(270deg, #0ebeff, #ffdd40, #ae63e4, #47cf73, #0ebeff, #ffdd40, #ae63e4, #47cf73);
            width: 100%;
            height: 100%;
            background-size: 400% 400%;
        }

        .animate-hit::after {
            border-radius: 3px;
            margin: 3px;
            background: inherit;
        }

        @keyframes rainbow-border {
            0% {
                background-position: 0% 50%;
            }
            50% {
                background-position: 100% 50%;
            }
            100% {
                background-position: 0% 50%;
            }
        }
        `;

        const style = document.createElement('style');
        style.type = 'text/css';
        style.textContent = css;
        document.head.appendChild(style);
    }

    function animateHits() {
        document.querySelectorAll('.ad-ext-turn-throw p.chakra-text').forEach(pElement => {
            let shouldAnimate = false;
            let prefix = '';
            let hitNumber = 0;

            if (pElement.textContent.startsWith('T')) {
                prefix = 'T';
                hitNumber = parseInt(pElement.textContent.slice(1), 10);
                shouldAnimate = triplesToAnimate.includes(hitNumber);
            } else if (pElement.textContent.startsWith('D')) {
                prefix = 'D';
                hitNumber = parseInt(pElement.textContent.slice(1), 10);
                shouldAnimate = doublesToAnimate.includes(hitNumber);
            } else if (animateBull && pElement.textContent === 'BULL') {
                shouldAnimate = true;
            }

            if (shouldAnimate) {
                const parentDiv = pElement.closest('.ad-ext-turn-throw');
                if (parentDiv) {
                    parentDiv.classList.add('animate-hit');
                    if (prefix && !pElement.innerHTML.includes('<span class="highlight">')) {
                        const updatedHTML = pElement.textContent.replace(new RegExp(`^${prefix}`), `<span class="highlight">${prefix}</span>`);
                        pElement.innerHTML = updatedHTML;
                    } else if (pElement.textContent === 'BULL' && !pElement.innerHTML.includes('<span class="highlight">')) {
                        pElement.innerHTML = '<span class="">BULL</span>';
                    }
                }
            }
        });
    }

    const observer = new MutationObserver(mutationsList => {
        let isRelevantMutation = mutationsList.some(mutation =>
            Array.from(mutation.addedNodes).some(node =>
                node.nodeType === Node.ELEMENT_NODE &&
                (node.matches('.chakra-text') || node.querySelector('.chakra-text'))
            )
        );

        if (isRelevantMutation) {
            animateHits();
        }
    });

    function periodicCheck() {
        animateHits();
    }

    window.onload = () => {
        injectCSS();
        animateHits();
        observer.observe(document.body, { childList: true, subtree: true, characterData: true });
        setInterval(periodicCheck, 3000);
    };
})();
