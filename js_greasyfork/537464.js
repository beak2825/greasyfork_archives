// ==UserScript==
// @name         WTFMeleeMugButton
// @namespace    http://tampermonkey.net/
// @version      2025-05-27
// @description  WTFMugOverMeleeAttackLoader
// @author       LT
// @match        https://www.torn.com/loader.php?sid=attack&user2ID=*
// @icon         https://www.google.com/s2/favicons?sz=32&domain=duckopedia.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/537464/WTFMeleeMugButton.user.js
// @updateURL https://update.greasyfork.org/scripts/537464/WTFMeleeMugButton.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let proxyBtn = null;
    let meleeSlotRect = null;

    function updateButtonPosition() {
        const meleeSlot = document.getElementById('weapon_melee');
        if (!meleeSlot || !proxyBtn) return;

        meleeSlotRect = meleeSlot.getBoundingClientRect();
        Object.assign(proxyBtn.style, {
            top: `${meleeSlotRect.top + window.scrollY}px`,
            left: `${meleeSlotRect.left + window.scrollX}px`,
            width: `${meleeSlotRect.width}px`,
            height: `${meleeSlotRect.height}px`
        });
    }

    function createProxyButton(label, onClick) {
        const button = document.createElement('button');
        button.innerText = label;
        button.className = 'torn-btn btn___RxE8_ silver';
        Object.assign(button.style, {
            position: 'absolute',
            zIndex: 9999,
            margin: 0,
            padding: 0,
            cursor: 'pointer'
        });
        button.addEventListener('click', onClick);
        document.body.appendChild(button);
        proxyBtn = button;
        updateButtonPosition();
    }

    function injectStartFightProxy() {
        const realBtn = document.querySelector('.modal___lMj6N .dialogButtons___nX4Bz button');
        if (!realBtn || proxyBtn) return;

        createProxyButton(realBtn.innerText, () => {
            realBtn.click();

            const buttonRemovalObserver = new MutationObserver(() => {
                const stillExists = document.body.contains(realBtn);
                if (!stillExists) {
                    if (proxyBtn) {
                        proxyBtn.remove();
                        proxyBtn = null;
                    }

                    waitForMugButton();
                    buttonRemovalObserver.disconnect();
                }
            });

            buttonRemovalObserver.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }

    function waitForMugButton() {
        const mugObserver = new MutationObserver(() => {
            const mugBtn = Array.from(document.querySelectorAll('.dialogButtons___nX4Bz button'))
                .find(btn => btn.innerText.toLowerCase().includes('mug'));
            if (mugBtn) {
                injectMugButtonProxy(mugBtn);
                mugObserver.disconnect();
            }
        });

        mugObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    function injectMugButtonProxy(realMugBtn) {
        if (!realMugBtn || proxyBtn) return;

        createProxyButton(realMugBtn.innerText, () => {
            realMugBtn.click();
        });
    }

    function watchLayoutChanges() {
        const layoutRoot = document.querySelector('.player___wiE8R');
        if (!layoutRoot) return;

        const layoutShiftObserver = new MutationObserver(() => {
            updateButtonPosition();
        });

        layoutShiftObserver.observe(layoutRoot, {
            childList: true,
            subtree: true,
            attributes: true
        });
    }

    const initObserver = new MutationObserver(() => {
        const melee = document.getElementById('weapon_melee');
        const startBtn = document.querySelector('.modal___lMj6N .dialogButtons___nX4Bz button');
        if (melee && startBtn && startBtn.innerText.toLowerCase().includes('start')) {
            injectStartFightProxy();
            watchLayoutChanges();
            initObserver.disconnect();
        }
    });

    initObserver.observe(document.body, { childList: true, subtree: true });
    window.addEventListener('resize', updateButtonPosition);
    window.addEventListener('scroll', updateButtonPosition);
})();