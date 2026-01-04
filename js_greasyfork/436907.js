// ==UserScript==
// @name         View Star Rating
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Show the star rating of a YouTube video
// @author       DeltAndy
// @match        *://www.youtube.com/watch*
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/436907/View%20Star%20Rating.user.js
// @updateURL https://update.greasyfork.org/scripts/436907/View%20Star%20Rating.meta.js
// ==/UserScript==

function wait(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(ms)
    }, ms )
  })
}

(async function() {
    'use strict';
    await wait(2500)
    document.querySelector('#dot').outerHTML = document.querySelector('#dot').outerHTML +
        '<span class="style-scope ytd-video-primary-info-renderer" id="rating">Fetching Star Rating...</span>' +
        document.querySelector('#dot').outerHTML

    document.querySelector('#rating').innerHTML =
        JSON.parse(document.evaluate('//script[contains(., \'var ytInitialPlayerResponse\')]', document).iterateNext()
                   .innerHTML.split('= ')[1].split(';var')[0])
        .videoDetails.averageRating
        .toFixed(2)
        + " stars"
})();