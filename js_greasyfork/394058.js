// ==UserScript==
// @name         Munzee Time Zone
// @namespace    https://greasyfork.org/users/156194
// @version      0.1
// @description  Change the time zone for the (mouseover) times at the munzee website
// @author       rabe85
// @match        https://www.munzee.com/m/
// @match        https://www.munzee.com/m/*
// @match        https://statzee.munzee.com/player/day/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/394058/Munzee%20Time%20Zone.user.js
// @updateURL https://update.greasyfork.org/scripts/394058/Munzee%20Time%20Zone.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function munzee_time_zone() {

        const TimeString = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'Europe/Berlin', hour12: false };

        // Munzee - Player pages
        function change_all(type) {
            var classname_at0 = document.getElementsByClassName(type + '-at');
            for(var at = 0, classname_at; !!(classname_at=classname_at0[at]); at++) {
                var classname;
                if(type == 'expires') {
                    classname = new Date(parseInt(classname_at.getAttribute('data-' + type + '-at')));
                } else {
                    classname = new Date(classname_at.getAttribute('data-' + type + '-at'));
                }
                classname_at.setAttribute('title', classname.toLocaleDateString('de-DE', TimeString));
            }
        }

        change_all('deployed');
        change_all('expires');
        change_all('captured');
        change_all('wrote');


        // Statzee - Daily Stats
        var stats_table0 = document.querySelectorAll('td');
        for(var hq = 0, stats_table; !!(stats_table=stats_table0[hq]); hq++) {
            if(stats_table.innerHTML.endsWith('HQ Time')) {
                var hq_date = window.location.pathname.split('/')[window.location.pathname.split('/').length - 1];
                var hq_timezone = document.getElementById('hqtime').parentNode.innerHTML.split(')')[0].substr(-1);
                var hq_time = new Date(hq_date + 'T' + stats_table.innerHTML.substr(0, 8) + '-0' + hq_timezone + ':00');
                stats_table.setAttribute('title', hq_time.toLocaleDateString('de-DE', TimeString));
            }
        }

    }

    // DOM vollständig aufgebaut?
    if (/complete|interactive|loaded/.test(document.readyState)) {
        munzee_time_zone();
    } else {
        document.addEventListener("DOMContentLoaded", munzee_time_zone, false);
    }

})();