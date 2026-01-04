// ==UserScript==
// @name         Auto City Index
// @version      0.1
// @description  Automatically clicks the index button from the city indexer
// @author       Ikzelf
// @match        https://*.grepolis.com/game/*
// @grant        none
// @namespace https://greasyfork.org/users/984383
// @downloadURL https://update.greasyfork.org/scripts/505763/Auto%20City%20Index.user.js
// @updateURL https://update.greasyfork.org/scripts/505763/Auto%20City%20Index.meta.js
// ==/UserScript==

(function() {
'use strict';


    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function getRandomHumanTime(){
        return getRandomInt(0, 100);
    }

    var inter = setInterval(function() {
        if($('#gd_index_rep_txt')[0] !== undefined) {
            var condition = $($('#gd_index_rep_txt')[0]).text().includes('+');
            if(condition === true) {
                setTimeout(() => {
                  $('#gd_index_rep_txt')[0].click();
                }, getRandomHumanTime());
            }
        }
    }, 1000);
})();