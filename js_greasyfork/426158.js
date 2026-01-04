// ==UserScript==
// @name         SteamDB Free Package Claimer
// @namespace    https://steamdb.info/
// @version      1.4
// @description  Automatically claims free packages.
// @author       Vaccaria
// @match        https://steamdb.info/freepackages/*
// @require http://code.jquery.com/jquery-3.4.1.min.js
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/426158/SteamDB%20Free%20Package%20Claimer.user.js
// @updateURL https://update.greasyfork.org/scripts/426158/SteamDB%20Free%20Package%20Claimer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var clickEvent = document.createEvent ('MouseEvents');
    clickEvent.initEvent ('click', true, false);
    var tracker = false;

    var checkExist = setInterval(function() {
        if ($('.package').length) {
            var favoriteBtn = document.querySelector (
                "#js-hide-demos"
            );
            favoriteBtn.dispatchEvent (clickEvent);
            var checkExist3 = setInterval(function() {
                if ($('p:contains("Demos and legacy media have been hidden")').length) {
                    favoriteBtn = document.querySelector (
                        "#js-activate-now"
                    );
                    setTimeout(function() {
                        favoriteBtn.dispatchEvent (clickEvent);
                    }, 500);
                    clearInterval(checkExist3);
                }
            }, 100);
            tracker = true;
            clearInterval(checkExist);
        }
    }, 100);

    var checkExist2 = setInterval(function() {
        if(tracker == true){
            if ($("div:contains('You got rate limited, try again in an hour')").length) {
                setTimeout(() => {location.reload()}, 1000 * 60 * 61);
                clearInterval(checkExist2);
            }
        }
    }, 100);

})();