// ==UserScript==
// @name         World Language Games - Automation for "Basketball"
// @license      MIT
// @namespace    https://github.com/engelthehyp/Automation-for-World-Language-Games
// @description  This script will automatically complete the game "Basketball" as soon as it is launched, giving the maximum of 3 points by default. You can change the number of points given to be any number, but under normal circumstances the maximum number of points is 3, so if you don't want to blow your cover, it may be better keep it that way.
// @version      1.0
// @author       https://www.github.com/engelthehyp
// @match        *://wlangames.net/NewBasketball.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wlangames.net
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/435957/World%20Language%20Games%20-%20Automation%20for%20%22Basketball%22.user.js
// @updateURL https://update.greasyfork.org/scripts/435957/World%20Language%20Games%20-%20Automation%20for%20%22Basketball%22.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const earnedPoints = 3;
    const getVocabularyIndex = () => getRandomInt(0, window.Vocabulary.length - 1);

    [window.minutes, window.seconds] = [getRandomInt(1, 3), getRandomInt(0, 59)];
    window.OneSecond();
    window.Words = [getVocabularyIndex(), getVocabularyIndex()];
    window.SpaceAdventuresSentenceGetServerKeys(earnedPoints);

    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
})();