// ==UserScript==
// @name                YouTube Video Random Seek
// @version             0.2.9
// @author              workingProgress8
// @description         Seek randomly in a YouTube video
// @namespace           youtubeRandomSeeker
// @match             https://*.youtube.com/watch*
// @match             http://*.youtube.com/watch*
// @exclude             https://*.youtube.com/results?search_query*
// @exclude             http://*.youtube.com/results?search_query*
// @run-at              document-end
// @license             MIT
// @downloadURL https://update.greasyfork.org/scripts/455513/YouTube%20Video%20Random%20Seek.user.js
// @updateURL https://update.greasyfork.org/scripts/455513/YouTube%20Video%20Random%20Seek.meta.js
// ==/UserScript==
 
function addRListener()
{
    if (document.querySelector('video').src=='')
    {
        return;
    }
    document.addEventListener('keypress', function rForRandom(event)
                              {
                                  if (event.key == 'r' && event.target != document.querySelector('input#search.ytd-searchbox'))
                                  {
                                      let max = document.querySelector('video').duration;
                                      if (isNaN(max))
                                      {
                                          return;
                                      }
                                      document.querySelector('video').currentTime = Math.random() * (max -1);
                                  }
                              });
}

addRListener();
