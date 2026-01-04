// ==UserScript==
// @name         Bloxd.io Performance Booster
// @namespace    https://bloxd.io/
// @version      1.0
// @description  Reduce lag and cap FPS in Bloxd.io (No maximum cap depending on your PC)
// @author       iTzPenzAr
// @match        *://bloxd.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535557/Bloxdio%20Performance%20Booster.user.js
// @updateURL https://update.greasyfork.org/scripts/535557/Bloxdio%20Performance%20Booster.meta.js
// ==/UserScript==

(function() {
    'use strict';

// Define performance settings
const config = {
shadows: false, // Disable shadows
particles: false, // Remove particles
postProcessing: false, // Disable post-processing effects
fpsCap: 15000000 // Set FPS cap (can be adjusted as needed)
};

// Save settings to local storage
localStorage.setItem('shadows', JSON.stringify(config.shadows));
localStorage.setItem('particles', JSON.stringify(config.particles));
localStorage.setItem('postProcessing', JSON.stringify(config.postProcessing));
localStorage.setItem('fpsCap', JSON.stringify(config.fpsCap));

// Reload the page to apply the settings
    window.location.reload();
})();