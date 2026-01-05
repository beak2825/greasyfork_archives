// ==UserScript==
// @name         WK Colored Meaning/Reading
// @namespace    wkcoloredmr
// @version      0.52
// @description  Meaning/Reading writen in diferent colors so you don't get confused
// @author       lararal 
// @include      https://www.wanikani.com/review/session
// @license      MIT; http://opensource.org/licenses/MIT
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/24619/WK%20Colored%20MeaningReading.user.js
// @updateURL https://update.greasyfork.org/scripts/24619/WK%20Colored%20MeaningReading.meta.js
// ==/UserScript==

/*
 * WK Colored Meaning/Reading
 *
 * I often write the reading instead of the meaning and vice versa, getting
 * a wrong answer even if I would get it right. I decided to color it differently
 * so I woud do it less often.
 *
 * Used the following script as a reference: 
 * https://www.wanikani.com/chat/api-and-third-party-apps/11700
 *
 */

/*
 * Changelog
 *
 * 0.1 (6 Nov 2016)
 *  - Started Working On The script.
 *
 */

wkcoloredmr = {};

(function(gobj){

    var css =
        '#question #question-type.reading {'+
        'color: green;'+
        '}'+

        '#question #question-type.meaning {'+
        'color: #E6880F;'+
        '}';

    function addStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (head) {
            style = document.createElement('style');
            style.setAttribute('type', 'text/css');
            style.textContent = css;
            head.appendChild(style);
            return style;
        }
        return null;
    }
    
    addStyle(css);

}(wkcoloredmr));

