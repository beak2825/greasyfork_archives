// ==UserScript==
// @name         Spiegel DisableAllPodcasts
// @namespace    http://www.biermann.org/scripts/spiegel/
// @version      0.9
// @description  Remove PodCast items on spiegel hompage
// @author       Phil
// @match        https://www.spiegel.de/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395393/Spiegel%20DisableAllPodcasts.user.js
// @updateURL https://update.greasyfork.org/scripts/395393/Spiegel%20DisableAllPodcasts.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var badSpans = document.querySelectorAll('section[data-area="block>podcastslider:alle_podcasts"]')
    badSpans.forEach((s) => {
    if(s !== undefined) {
        //s.style.backgroundColor = 'rgb(255,0,0)'
        s.remove()
      }
    })
})();





