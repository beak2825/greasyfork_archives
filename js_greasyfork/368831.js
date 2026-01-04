/* global $ */
// ==UserScript==
// @name         hack gold
// @version      0.1
// @description  Auto submit
// @author       You
// @match        https://dc4u.eu/games/dragon-city
// @grant        none
// @namespace https://greasyfork.org/users/188746
// @downloadURL https://update.greasyfork.org/scripts/368831/hack%20gold.user.js
// @updateURL https://update.greasyfork.org/scripts/368831/hack%20gold.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    $("input[name='ss_id']").attr('type','text')
    setTimeout(function() { hahaha(); }, 1500);
    function hahaha() {
        if($('.dlRequest:visible').is(':visible'))
        {
            $('.dlResources').val("gold");
            $('.dlRequest')[0].click();
            var checkExist = setInterval(function() {
                if ($('.dlSkipAd:visible').is(':visible')) {
                    $('.dlSkipAd')[0].click();
                    clearInterval(checkExist);
                }
            }, 100); // check every 100ms
        }
        else
        {
            $('.dlSkipAd')[0].click();
        }
    }
})();