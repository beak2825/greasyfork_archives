// ==UserScript==
// @name         Munzee Rankings
// @version      0.1
// @description  Add links to show higher and lower rankings
// @author       rabe85
// @match        https://statzee.munzee.com/player/rankings/
// @match        https://statzee.munzee.com/player/rankings/*
// @grant        none
// @namespace    https://greasyfork.org/users/156194
// @downloadURL https://update.greasyfork.org/scripts/390757/Munzee%20Rankings.user.js
// @updateURL https://update.greasyfork.org/scripts/390757/Munzee%20Rankings.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function munzee_rankings() {

        var ranking_firstline = document.getElementById('stats-table').getElementsByTagName('tbody')[0].getElementsByTagName('tr')[0];
        if(ranking_firstline) {
            if(ranking_firstline.getElementsByClassName('rank')[0].innerHTML != '#1') {
                ranking_firstline.insertAdjacentHTML('beforebegin', '<tr><td class="rank">#' + (parseInt(ranking_firstline.getElementsByClassName('rank')[0].innerHTML.substr(1)) - 1) + '</td><td colspan="6"><a href="https://statzee.munzee.com/player/rankings/' + ranking_firstline.getElementsByClassName('username')[0].querySelector('a').innerHTML.replace(' ', '%20') + '">Show more</a></td></tr>');
            }
        }

        var ranking_lastline = document.getElementById('stats-table').getElementsByTagName('tbody')[0].getElementsByTagName('tr')[document.getElementById('stats-table').getElementsByTagName('tbody')[0].getElementsByTagName('tr').length - 1];
        if(ranking_lastline) {
            if(ranking_lastline.getElementsByClassName('rank')[0].innerHTML != '#25000') { // Limit am 04.10.2019
                ranking_lastline.insertAdjacentHTML('afterend', '<tr><td class="rank">#' + (parseInt(ranking_lastline.getElementsByClassName('rank')[0].innerHTML.substr(1)) + 1) + '</td><td colspan="6"><a href="https://statzee.munzee.com/player/rankings/' + ranking_lastline.getElementsByClassName('username')[0].querySelector('a').innerHTML.replace(' ', '%20') + '">Show more</a></td></tr>');
            }
        }

    }


    // DOM vollständig aufgebaut?
    if (/complete|interactive|loaded/.test(document.readyState)) {
        munzee_rankings();
    } else {
        document.addEventListener("DOMContentLoaded", munzee_rankings, false);
    }

})();