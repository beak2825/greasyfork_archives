// ==UserScript==
// @name         FarmotivationBox
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Do it all
// @include https://*.the-west.*/game.php*
// @include https://*.the-west.*.*/game.php*
// @exclude https://*.the-west.net/*
// @icon         https://westru.innogamescdn.com/images/items/yield/item_51775.png?6
// @grant        none
// @run-at document-body
// @license MIT
// @require https://update.greasyfork.org/scripts/490628/1468386/Ajax%20Async%20Lib.js
// @downloadURL https://update.greasyfork.org/scripts/516986/FarmotivationBox.user.js
// @updateURL https://update.greasyfork.org/scripts/516986/FarmotivationBox.meta.js
// ==/UserScript==


(function () {

    $(document).ready(function () {
        try {
            west.character.levelup.newFeatureUnlocked.showInfoForLevel = function (lvl) { }
            Player.protection.showMessage_ = function (type) { };


            setTimeout(function () {
                Introduction.FarmMotivationBox();
            }, 5000);


        } catch (e) {
            console.log("exception occured");
            console.log(e);
        }
    });
})();
