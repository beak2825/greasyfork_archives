// ==UserScript==
// @name         Smash Karts Infinite Minigun Ammo
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Attempts to give infinite minigun bullets in Smash Karts
// @author       You
// @match        *://smashkarts.io/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/538360/Smash%20Karts%20Infinite%20Minigun%20Ammo.user.js
// @updateURL https://update.greasyfork.org/scripts/538360/Smash%20Karts%20Infinite%20Minigun%20Ammo.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Wait for the game to load
    const interval = setInterval(() => {
        let game = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
        if (!game) return;

        try {
            for (const r of Object.values(game.renderers)) {
                for (const [id, inst] of r.findFiberRoots(1).entries()) {
                    let props = inst.current.memoizedProps;
                    if (props && props.children && props.children.props && props.children.props.kart) {
                        const kart = props.children.props.kart;
                        // Overwrite minigun data
                        setInterval(() => {
                            if (kart.weapon && kart.weapon.ammo !== Infinity) {
                                kart.weapon.ammo = Infinity;
                            }
                        }, 100);
                        clearInterval(interval);
                        console.log('[Tampermonkey] Infinite ammo script injected.');
                        return;
                    }
                }
            }
        } catch (e) {
            console.warn('Smash Karts script waiting:', e);
        }
    }, 1000);
})();
