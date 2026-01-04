// ==UserScript==
// @name         Stimulation Clicker Enhancer
// @namespace    kaizenclickerenhancer
// @license      MIT
// @version      1.1
// @author       Kaizenfrfr
// @description  Adds a personal test mode to Stimulation Clicker for experimenting with click speeds and stimulation scaling.
// @match        https://neal.fun/stimulation-clicker/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/545968/Stimulation%20Clicker%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/545968/Stimulation%20Clicker%20Enhancer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function tryHook() {
        const container = document.querySelector('.container');
        if (!container || !container.__vue__) return false;

        const vueState = container.__vue__.stimulation === undefined
            ? container.__vue__.$children.find(child => child.stimulation !== undefined)
            : container.__vue__;

        if (!vueState || typeof vueState.addStimulation !== 'function') return false;

        // Save original addStimulation
        const originalAddStim = vueState.addStimulation;

        // Replace with scaled version
        vueState.addStimulation = function(amount) {
            return originalAddStim.call(this, amount * 1000); // scale factor ×1000 for testing
        };

        // Auto-click loop (adjustable for experiments)
        setInterval(() => {
            vueState.onMainClick();
        }, 1); // 1ms loop

        console.log('[StimClick] Enhancement hooked successfully!');
        return true;
    }

    // Keep trying until Vue state is ready
    const waitVue = setInterval(() => {
        if (tryHook()) clearInterval(waitVue);
    }, 500);
})();

