// ==UserScript==
// @name        .M3U8 HLS support for HTML5 video
// @namespace   https://greasyfork.org/users/4813-swyter
// @description Lets you play fragmented Apple-style adaptive videos in browsers like Firefox, by making use of Media Source Extensions. No Flash needed.
// @include     *
// @version     1
// @require     https://cdn.jsdelivr.net/hls.js/latest/hls.min.js
// @grant       none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/21813/M3U8%20HLS%20support%20for%20HTML5%20video.user.js
// @updateURL https://update.greasyfork.org/scripts/21813/M3U8%20HLS%20support%20for%20HTML5%20video.meta.js
// ==/UserScript==

/* makes use of DailyMotion's MSE-based HLS client:
   https://github.com/dailymotion/hls.js */

/* example page: http://walterebert.com/playground/video/hls/*/

/* wait until the page is ready for the code snipped to run */
document.addEventListener('DOMContentLoaded', function()
{
  var hls_elements = document.querySelectorAll(`video[src*='.m3u8'], video > source[src*='.m3u8']`);

  if (hls_elements.length === 0 || !Hls || !Hls.isSupported())
   return;

  console.log(`[i] enabling M3U8 HLS shim user script on this page.`);

  for(i of hls_elements)
  {
    var video_elem = i.localName.toLowerCase() == "source" && i.parentElement || i;
    
    /* if the element is not visible, in typical JS kludge syntax */
    if (`offsetParent` in video_elem && video_elem.offsetParent === null)
      continue;
    
    console.log(i, i.src, video_elem);
    
    var hls = new Hls();

    /* get the original source + get the video element and attach the HLS.js script to it */
    hls.loadSource(i.src);
    hls.attachMedia(video_elem);
  }
}, false);