// ==UserScript==
// @name         World Language Games - Automation for "Chinese Wordle" and "Pinyin Wordle"
// @license      MIT
// @namespace    https://github.com/engelthehyp/Automation-for-World-Language-Games
// @version      1.1
// @description  This script will automatically complete "Chinese Wordle" or "Pinyin Wordle" (whichever game you started) as soon as it is launched, giving the maximum of 4 points by default. You can change the number of points given to be any number, but under normal circumstances the maximum number of points is 4, so if you don't want to blow your cover, it may be better keep it that way.
// @author       https://github.com/engelthehyp
// @match        *://wlangames.net/ChineseWordle.php*
// @match        *://wlangames.net/PinyinWordle*.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wlangames.net
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/481125/World%20Language%20Games%20-%20Automation%20for%20%22Chinese%20Wordle%22%20and%20%22Pinyin%20Wordle%22.user.js
// @updateURL https://update.greasyfork.org/scripts/481125/World%20Language%20Games%20-%20Automation%20for%20%22Chinese%20Wordle%22%20and%20%22Pinyin%20Wordle%22.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const earnedPoints = 4;

    [window.Minutes, window.Seconds] = [getRandomInt(1, 3), getRandomInt(0, 59)];
    window.OneSecond();
    window.OnlyGetServerKeys(window.WonPts = earnedPoints);

    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
})();
