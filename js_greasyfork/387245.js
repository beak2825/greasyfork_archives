// ==UserScript==
// @name         WaniKani no audio delay
// @description remove WaniKani audio delay by fetching the audio before you get answer
// @version      0.1
// @author       eranshabi
// @include     /^https?://(www\.)?wanikani\.com/review/session/?$/
// @homepageURL https://github.com/eranshabi/WaniKani-scripts/blob/master/no-audio-delay.js
// @grant        none
// @namespace https://greasyfork.org/users/315952
// @downloadURL https://update.greasyfork.org/scripts/387245/WaniKani%20no%20audio%20delay.user.js
// @updateURL https://update.greasyfork.org/scripts/387245/WaniKani%20no%20audio%20delay.meta.js
// ==/UserScript==

$(document).ready(function() {
var oldSet = $.jStorage.set;
        $.jStorage.set = function(key, value, options) {
            var ret = oldSet.apply(this, [key, value, options]);

            if (key === 'currentItem') {
                fetch('https://cdn.wanikani.com/subjects/audio/' + value.aud)
            }

            return ret;
        };
});