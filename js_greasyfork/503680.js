// ==UserScript==
// @name         Hide Hulu Player Controls on Pause
// @author       kayleighember
// @license      MIT
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Modify Hulu player controls to only hide based on idle state
// @match        https://www.hulu.com/watch/*
// @match        *hulu.com/watch/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/503680/Hide%20Hulu%20Player%20Controls%20on%20Pause.user.js
// @updateURL https://update.greasyfork.org/scripts/503680/Hide%20Hulu%20Player%20Controls%20on%20Pause.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function modifyPlayerControls() {
        var originalEk = window.Ek;
        if (typeof originalEk !== 'function') return;

        window.Ek = function(e) {
            var result = originalEk(e);
            var n = e.appState;
            var i = e.playerState;

            // Modify the visibility logic
            var isVisible = n.pointerMonitorState === 'active' || i.paused;

            // Create a new object with the modified properties
            var newResult = Object.assign({}, result, {
                isViewModeControlsVisible: isVisible,
                isBottomControlsVisible: isVisible
            });

            return newResult;
        };

        // Override the setUserInteractionState action
        if (window.Cg && window.Cg.setUserInteractionState) {
            var originalSetUserInteractionState = window.Cg.setUserInteractionState;
            window.Cg.setUserInteractionState = function(state) {
                // Only allow 'active' or 'idle' states
                var newState = state === 'active' ? 'active' : 'idle';
                return originalSetUserInteractionState(newState);
            };
        }
    }

    function waitForHuluPlayer() {
        if (typeof window.Ek === 'function') {
            modifyPlayerControls();
        } else {
            setTimeout(waitForHuluPlayer, 1000);
        }
    }

    waitForHuluPlayer();
})();