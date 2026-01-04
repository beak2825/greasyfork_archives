// ==UserScript==
// @name         Cheeseroller AP
// @namespace    https://greasyfork.org/en/users/145271-aybecee
// @license MIT
// @version      2025-05-15
// @description  Autoplays Cheeseroller
// @match        https://www.grundos.cafe/medieval/cheeseroller/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/536663/Cheeseroller%20AP.user.js
// @updateURL https://update.greasyfork.org/scripts/536663/Cheeseroller%20AP.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getRandomInt(min, max) {
        const minCeiled = Math.ceil(min);
        const maxFloored = Math.floor(max);
        return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
    }
    function dailyClick(url, button) {
        if (window.location.href.indexOf(url) > -1 && $(button).length > 0) {
        }
    }


    var np_earned = GM_getValue('np_earnedkey', []);

    if (        $(`[value="Go!!!!"]`).length > 0) {
        $(`[name="cheese_action"]`).val(getRandomInt(4,6));
        setTimeout(function () {
            $(`[value="Go!!!!"]`).click()
        }, getRandomInt(1000, 3000));
    } else if ($(`strong:contains(You Finished in )`).length == 1) {
        var score = $(`p:contains(Your Score : )`).text()
        np_earned.push(score);
        console.log(score)
        GM_setValue('np_earnedkey', np_earned);
        setTimeout(function () {
            window.location.href = "https://www.grundos.cafe/medieval/cheeseroller/"
        }, getRandomInt(1000, 3000));
    } else if ($(`[name="cheese_name"]`).length == 1) {
        setTimeout(function () {
            $(`[name="cheese_name"]`).val("Honey");
            $(`[value="Submit"]`).click();
        }, getRandomInt(1000, 3000));
    } else if ($(`[type="submit"][value*="Buy "]`).length == 1) {
        setTimeout(function () {
            $(`[type="submit"][value*="Buy "]`).click();
        }, getRandomInt(1000, 3000));
    }
})();