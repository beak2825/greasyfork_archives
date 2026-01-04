// ==UserScript==
// @name         YouTube Playlist Time Length
// @namespace    https://violentmonkey.github.io/
// @version      1.0.0
// @description  Adds the overall playlist length.
// @description  Adapted from script https://greasyfork.org/en/scripts/439291-youtube-playlist-length
// @author       André Augusto
// @match        *://www.youtube.com/playlist?list=*
// @grant        none
// @require      https://code.jquery.com/jquery-2.2.4.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/439802/YouTube%20Playlist%20Time%20Length.user.js
// @updateURL https://update.greasyfork.org/scripts/439802/YouTube%20Playlist%20Time%20Length.meta.js
// ==/UserScript==

(function() {
  document.onreadystatechange = function () {
    if (document.readyState === 'complete') {
      setTimeout(function() {
        function convertS(sec) {var hrs = Math.floor(sec / 3600); var min = Math.floor((sec - (hrs * 3600)) / 60); var seconds = sec - (hrs * 3600) - (min * 60); seconds = Math.round(seconds * 100) / 100;var result = (hrs < 10 ? "0" + hrs : hrs) + ':'; result += (min < 10 ? "0" + min : min) + ":"; result += (seconds < 10 ? "0" + seconds : seconds); return result; }; var ytp = document.querySelectorAll("ytd-playlist-video-list-renderer > #contents > ytd-playlist-video-renderer");var time = 0; for (var i = 0; i < ytp.length; i++) {var a = ytp[i].getElementsByTagName('ytd-thumbnail-overlay-time-status-renderer')[0].innerText;var tx = a.split(':'); if (tx.length < 3) {time = time + Number(tx[0]) * 60 + Number(tx[1]);} else if (tx.length = 3) {time = time + Number(tx[0]) * 60 * 60 + Number(tx[1]) * 60 + Number(tx[2]);}}; var ytpT = convertS(time);
        time=document.createElement('span');
        time.innerText=ytpT;
        time.className='testing';
        time.style='color:#AAAAAA; font-family:"Roboto","Arial",sans-serif; font-size:1.4rem; line-height:2rem;';

        const stats = document.getElementById('stats');
        stats.appendChild(time);
        let timestyle = document.createElement('style');
        timestyle.innerText='.testing::before {content: "•"; margin: 0 4px}'
        time.appendChild(timestyle);
      }, 2000)
    }
  }
})();