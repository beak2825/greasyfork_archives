// ==UserScript==
// @name         Recruiterkiller
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Schaltet Vermittlerfirmen in Xing Jobsuche aus.
// @author       You
// @match        https://www.xing.com/jobs/search?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xing.com
// @grant        none
// @license      GPL-v3
// @downloadURL https://update.greasyfork.org/scripts/516879/Recruiterkiller.user.js
// @updateURL https://update.greasyfork.org/scripts/516879/Recruiterkiller.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var bad_guys = [
        'vesterling',
        'passion for people',
        'lauter personalexperten',
        'mytalentscout',
        'rocket road',
        'franklin fitch',
        'advergy',
        'optimus search',
        'cis solutions',
        'computer futures',
        'kaiser personalberatung',
        'recruitment circle',
        'workwise',
        'platri',
        'michael page',
        'puro personaldienstleistung',
        'skybris',
        'grühn',
        'ratbacher',
        'connecting dots',
        'techbiz-global',
        'kooku',
        'ardekay',
        'hubside',
        'wematch',
        'exclusive associates',
        'austin fraser',
        'apriori - business',
        'skill-fisher',
        'techbiz-global',
        'stolzberger',
        'dienst & wenzel',
        'skilltank',
        'one agency',
        'trbe',
        'mint solutions',
        'alphacoders',
        'experis',
        'greifenberg',
        'nxt hero gmbh',
        'energize recruitment solutions',
        'symbio recruitment gmbh',
        'apriori',
        'instaffo',
        'find the best recruit',
        'duerenhoff gmbh',
        'findyou',
        'auteega',
        'k4s',
        'darwin recruitment',
        'humentum',
        'top itservices',
        'jrwg coachconsult',
        'passion for people',
        'jungwild',
        'proclinic',
        'workidentity',
        'ma data',
        'recruitit',
        'trova personal',
        'techstarter gmbh',
        'leuchtmehr gmbh',
        'recruitmentcircle.io',
        'biber & associates',
        'tergos gmbh',
        'leifeld gmbh',
        'peak one',
        'saaroluna',
        'die grüne 3',
        'akkodis'
    ];

    function doit() {
        console.log('doit');
        var company_list = document.querySelectorAll('h3+p+p[data-xds="BodyCopy"]');
        for (var i=0; i<company_list.length; i++) {
            var node = company_list[i];
            var company_name = node.textContent;
            for (var j=0; j<bad_guys.length; j++) {
                var bad_guy=bad_guys[j];
                if (company_name.toLowerCase().includes(bad_guy.toLowerCase())) {
                    break;
                }
            }
            if (j<bad_guys.length) {
                var job_block = company_list[i].parentNode.parentNode.parentNode.parentNode.parentNode.parentNode;
                job_block.style['background-color']='#fdd';
                job_block.style.height='32px';
                job_block.style.overflow='hidden';
            }
        }
        setTimeout(doit, 1000);
    }

    doit();
})();