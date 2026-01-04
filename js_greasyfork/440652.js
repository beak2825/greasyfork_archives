// ==UserScript==
// @name         ZType Bot
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Bot for typing game ZType
// @author       Deltaspace
// @match        https://zty.pe/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zty.pe
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/440652/ZType%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/440652/ZType%20Bot.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener('keydown', function(e) {
        if (e.key !== ' ') {
            return;
        }
        if (!window.ig.game.currentTarget) {
            var nearestDistance = -1;
            var nearestTargetKey = null;
            Object.keys(window.ig.game.targets).forEach(function(key) {
                var potentialTargets = window.ig.game.targets[key];
                for (var i = 0; i < potentialTargets.length; i++) {
                    var distance = window.ig.game.player.distanceTo(potentialTargets[i]);
                    if (distance < nearestDistance || !nearestTargetKey) {
                        nearestDistance = distance;
                        nearestTargetKey = key;
                    }
                }
            });
            window.ig.game.bufferLetter(nearestTargetKey);
        } else {
            var currentTargetKey = window.ig.game.currentTarget.remainingWord.charAt(0);
            var letter = window.ig.game.translateUmlaut(currentTargetKey.toLowerCase());
            window.ig.game.bufferLetter(letter);
        }
    });
})();