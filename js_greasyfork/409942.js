// ==UserScript==
// @name         MyNoise autosetup
// @description  Randomizes levels and configures the player to my tastes
// @namespace    http://tampermonkey.net/
// @version      0.1
// @match        https://mynoise.net/NoiseMachines/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/409942/MyNoise%20autosetup.user.js
// @updateURL https://update.greasyfork.org/scripts/409942/MyNoise%20autosetup.meta.js
// ==/UserScript==

const prevFinishedLoading = window.finishedLoading;

finishedLoading = function() {
    prevFinishedLoading();
    for (var i = 0; i < iNUMBERBANDS; ++i) currentLevel[i]=0.5;
    setAnimationMode(3);
    setAnimationSpeed(80);
    setTimeout(() => setAnimationSpeed(0.25), 2000);
}