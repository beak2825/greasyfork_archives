// ==UserScript==
// @name         Cinema Trailer - PLEX
// @namespace    https://greasyfork.org/en/users/670188-hacker09?sort=daily_installs
// @version      1
// @description  Attempts to add the video trailer on all video pages on Plex!
// @author       hacker09
// @match        http://127.0.0.1:32400/*
// @icon         https://i.imgur.com/h1NnzTI.png
// @grant        GM.xmlHttpRequest
// @connect      youtube.googleapis.com
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/505386/Cinema%20Trailer%20-%20PLEX.user.js
// @updateURL https://update.greasyfork.org/scripts/505386/Cinema%20Trailer%20-%20PLEX.meta.js
// ==/UserScript==

(function() {
  'use strict';
  const APIKEY = 'YOUR_KEY_HERE';

  document.body.addEventListener('mousemove', function() {
    if (document.querySelector('#ShowYT') === null && document.querySelector('[data-testid="metadata-title"]')) {
      document.querySelector('[aria-label="More"]').insertAdjacentHTML('afterend', `<button id="ShowYT" style="width: 40px;background: url('https://www.youtube.com/s/desktop/03f86491/img/favicon.ico');background-size: cover;cursor: pointer;"></button>`);

      document.querySelector('#ShowYT').onclick = function() {
        GM.xmlHttpRequest({
          method: "GET",
          url: `https://youtube.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(`${document.querySelector('[data-testid="metadata-title"]').innerText} ${document.querySelector('[data-testid="metadata-line1"]').childNodes[0].data} trailer`)}&type=video&key=${APIKEY}&maxResults=1`,
          onload: (response) => {
            document.querySelector('#ShowYT').remove(); //Remove YT icon
            document.querySelector('[aria-label="More"]').insertAdjacentHTML('afterend', `<div class='YTScript' style="resize: both; overflow: hidden; width: 555px; height: 373px; position: relative;"> <div class="closeButton" style="position: absolute; right: 0px; cursor: pointer; z-index: 10000;">❌</div> ${JSON.parse(response.responseText).error?.message ? `<span>${JSON.parse(response.responseText).error.message}</span>` : `<iframe style="z-index: 9999; position: absolute; width: 100%; height: 100%;" src="https://www.youtube.com/embed/${JSON.parse(response.responseText).items[0].id.videoId}?autoplay=1" allow="picture-in-picture;" allowfullscreen></iframe>`} <div style="position: absolute; bottom: -11px; right: -7px; width: 20px; height: 28px; background-color: red; z-index: 10001; transform: rotate(-135deg);"></div> </div> `);
            document.querySelector('.closeButton').onclick = function() {
              document.querySelector('.YTScript').remove(); //Remove embedded YT video
            };
          }
        });
      };
    }
  });
})();