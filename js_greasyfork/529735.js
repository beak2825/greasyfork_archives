// ==UserScript==
// @name         neverlose v1.5
// @namespace    http://tampermonkey.net/
// @version      2025-02-26
// @description  test
// @author       futurism
// @match        https://mine-craft.io
// @match        https://mine-craft.io/worlds
// @match        https://vanilla.mine-craft.io/
// @match        https://vanilla.mine-craft.io/worlds
// @icon         https://minecraft.wiki/images/Enchanted_Netherite_Sword.gif
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/529735/neverlose%20v15.user.js
// @updateURL https://update.greasyfork.org/scripts/529735/neverlose%20v15.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const initOptimization = () => {
        const style = document.createElement('style');
        style.innerHTML = `* { animation: none !important; transition: none !important; }`;
        document.head.appendChild(style);

        const canvasElements = document.querySelectorAll('canvas');
        canvasElements.forEach(canvas => {
            const ctx = canvas.getContext('2d');
            if (ctx) ctx.imageSmoothingEnabled = false;
        });

        const garbageSelectors = ['.particle', '.effect', '.fps-hog', '.temp-element', '.ad', '.overlay'];
        const cleanUpDOM = () => garbageSelectors.forEach(selector => document.querySelectorAll(selector).forEach(el => el.remove()));

        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    // Проверяем, является ли node элементом
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (garbageSelectors.some(selector => node.matches(selector))) {
                            node.remove();
                        }
                    }
                });
            });
        });
        observer.observe(document.body, { childList: true, subtree: true });

        const limitFPS = (fpsLimit = 60) => {
            let lastCallTime = performance.now();
            const frameDuration = 1000 / fpsLimit;
            const originalRequestAnimationFrame = window.requestAnimationFrame;

            window.requestAnimationFrame = function(callback) {
                const currentTime = performance.now();
                const delta = currentTime - lastCallTime;
                if (delta >= frameDuration) {
                    originalRequestAnimationFrame(() => {
                        lastCallTime = performance.now();
                        callback(currentTime);
                    });
                } else {
                    setTimeout(() => {
                        lastCallTime = performance.now();
                        callback(performance.now());
                    }, frameDuration - delta);
                }
            };
        };
        limitFPS(60);

        cleanUpDOM();
    };

    const neverloseStyles = `
        .top-left-hidden { display: none !important; }
        .top-right-hidden { display: none !important; }
        .login-container {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            padding: 10px;
        }
        .inventories-wrap.full-inventories .inventories {
            background: rgba(0, 0, 0, 0.5) !important;
        }
        .range-container {
            display: none;
        }
        .inventories-wrap .inventory.INVENTORY_PLAYER.fast-inventory .row .slot,
        .inventories-wrap .inventory.INVENTORY_SECOND_ARM.fast-inventory .row .slot {
            background-color: rgba(0, 0, 0, 0.5) !important;
            border-radius: 4px !important;
            box-shadow:
                inset .2vw .2vw rgba(0, 0, 0, 0.3),
                inset .4vw .4vw rgba(255, 255, 255, 0),
                inset .2vw .2vw rgba(255, 255, 255, 0.2),
                inset .4vw .4vw rgba(0, 0, 0, 0.6) !important;
        }
        .inventories-wrap.full-inventories .slot {
            box-shadow:
                inset -.2vw -.2vw #2E2C2C,inset .2vw .2vw rgba(0,0,0,0.5) !important;
        }
        .button.open-game-menu.button.small.only-icon,
        .button.camera-2d.button.small.only-icon,
        .button.open-profile.button.small.only-icon,
        .button.open-players.button.small.only-icon,
        .button.button.friends.small,
        .button.open-teams.button.small.only-icon,
        .button.open-trades.button.small.only-icon,
        .button.open-worlds.button.small.only-icon,
        .button.open-auctions.button.small.only-icon,
        .button.combat-mode.button.small.only-icon,
        .button.craft.button.small,
        .button.back-to-spawn.button.small,
        .button.players-control.button.small.only-icon,
        .mini-map-container .button {
            background-color: rgba(0, 0, 0, 0.5) !important;
            border-radius: 4px !important;
            background-image: none !important;
            color: #fff !important;
            box-shadow:
                inset .15vw .15vw rgba(255,255,255,0.4),inset -.15vw -.15vw rgba(0,0,0,0.5) !important;
        }
        .game-mod.liteCraft .modal .container .content-wrap,
        .game-mod.liteCraft .modal .container .content-wrap .content.scroll .button.settings,
        .game-mod.liteCraft .modal .container .content-wrap .content.scroll .button.exit-to-main-menu,
        .game-mod.liteCraft .screens .screens-container .screen.settings {
            background: rgba(0, 0, 0, 0.5) !important;
            box-shadow:
                inset .15vw .15vw rgba(255,255,255,0.4),inset -.15vw -.15vw rgba(0,0,0,0.5) !important;
        }
        .game-mod.liteCraft .modal .container .content-wrap .title {
            color: #ffffff !important;
        }
        .inventories-wrap.full-inventories .inventories {
            box-shadow:
                inset .15vw .15vw rgba(255,255,255,0.4),inset -.15vw -.15vw rgba(0,0,0,0.5) !important;
        }
    `;

    const hideElements = () => {
        const selectorsToHide = [
            'div.col.left-col.flex-height-fit',
            'button.turn-fullscreen.button.small.only-icon',
            'button.open-how-to-play.button.small.only-icon',
            'button.camera-under-roof.button.small.only-icon',
            '#leave-game-feedback.show',
            '.row.row2',
            '.buttons.top-buttons'
        ];

        const homeButton = Array.from(document.querySelectorAll('button.back-to-spawn.button.small')).find(button => {
            return button.querySelector('.text')?.textContent.trim() === 'Домой';
        });
        if (homeButton) homeButton.remove();

        const claimButton = document.querySelector('button.claim-reward.button.small.claimable');
        if (claimButton) claimButton.remove();

        selectorsToHide.forEach(selector => {
            const element = document.querySelector(selector);
            if (element) element.remove();
        });

        document.querySelectorAll('p.header-text, p').forEach(p => {
            if (p.textContent.includes("Онлайн") || p.textContent.includes("Ванильный режим") || p.textContent.includes("Регион EU") || p.textContent.includes("Регион RU") || p.textContent.includes("Регион US")) {
                p.style.display = 'none';
            }
        });

        document.querySelectorAll('.slot').forEach(slot => slot.style.backgroundColor = 'rgba(0, 0, 0, 0.5)');
    };

    let topLeftHidden = false;
    let bottomRightHidden = false;
    let topHidden = false;

    const toggleHUD = () => {
        topLeftHidden = !topLeftHidden;
        document.querySelector('.top-left')?.classList.toggle('top-left-hidden', topLeftHidden);
        document.querySelector('.top-right')?.classList.toggle('top-right-hidden', topLeftHidden);
    };

    const toggleBottomRight = () => {
        bottomRightHidden = !bottomRightHidden;
        const bottomRightElement = document.querySelector('.bottom-right');
        if (bottomRightElement) {
            bottomRightElement.style.display = bottomRightHidden ? 'none' : 'block';
        }
    };

    const toggleTop = () => {
        topHidden = !topHidden;
        const topElement = document.querySelector('.screen.game .top');
        if (topElement) {
            topElement.style.display = topHidden ? 'none' : 'block';
        }
    };

    const init = () => {
        initOptimization();

        const style = document.createElement('style');
        style.innerHTML = neverloseStyles;
        document.head.appendChild(style);

        hideElements();

        const observer = new MutationObserver(hideElements);
        observer.observe(document.body, { childList: true, subtree: true });

        document.addEventListener('keydown', event => {
            if (event.key === 'F4') {
                toggleHUD();
                toggleBottomRight();
                toggleTop();
            }
        });

        const removeAds = () => {
            const ads = document.querySelectorAll('.ad-item');
            ads.forEach(ad => ad.remove());
        };

        const adObserver = new MutationObserver(removeAds);
        adObserver.observe(document.body, { childList: true, subtree: true });

        window.addEventListener('load', removeAds);
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
