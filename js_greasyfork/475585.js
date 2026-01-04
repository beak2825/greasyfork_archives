// ==UserScript==
// @name     Youtube live play uptime counter
// @description Shows the play position of the video from the start of a livestream. When watching at the live position, this should be the uptime.
// @author Portablejim
// @namespace https://github.com/portablejim/GMScripts
// @version  3
// @license      GPL
// @grant    none
// @match https://www.youtube.com/watch*
// @match https://youtube.com/watch*
// @match https://www.youtube.com/live/*
// @match https://youtube.com/live/*
// @downloadURL https://update.greasyfork.org/scripts/475585/Youtube%20live%20play%20uptime%20counter.user.js
// @updateURL https://update.greasyfork.org/scripts/475585/Youtube%20live%20play%20uptime%20counter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let attach = () =>
    {
      console.log('Uptime counter: Init.');
      if (document.querySelector('.ytp-live-badge') && document.querySelector('.ytp-live-badge').getAttribute('disabled') !== 'true')
      {
        let videoEl = document.querySelector('video');
        let intervalId = setInterval(() => {
          ((time) => { 
            let liveUptimeEl = document.getElementById('liveUptime');
            if(!liveUptimeEl)
            {
                // try to create the element
                console.log('Uptime counter: Trying to add live uptime element');
                let headingEl = document.querySelector('#title h1');
                if(headingEl)
                {
                    console.log('Uptime counter: Heading found');
                    let timeCodeEl = document.createElement('p');
                    timeCodeEl.id = 'liveUptime';
                    timeCodeEl.style.display = 'inline-block';
                    timeCodeEl.style.marginInlineStart = '16px';
                    timeCodeEl.timeoutId = intervalId;
                    headingEl.appendChild(timeCodeEl);
                    liveUptimeEl = timeCodeEl;
                }
            }

            if(liveUptimeEl)
            {
                const SECONDS_IN_HOUR = 60*60;
                if(time >= SECONDS_IN_HOUR)
                {
                    liveUptimeEl.innerText = '[From start: ' + Math.floor(time/SECONDS_IN_HOUR).toFixed(0) + ':' + Math.floor((time/60)%60).toFixed(0).padStart(2, '0') + ':' + Math.floor(time % 60).toFixed(0).padStart(2, '0') + ']'; 
                }
                else
                {
                    liveUptimeEl.innerText = '[From start: ' + Math.floor(time/60).toFixed(0) + ':' + Math.floor(time % 60).toFixed(0).padStart(2, '0') + ']'; 
                }
            }
          })(videoEl.currentTime);
        }, 200);
      }
      else if(!document.querySelector('h1'))
      {
        console.log('Uptime counter: No heading yet, wait.');
        setTimeout(attach, 1000);
      }
      else
      {
        console.log('Uptime counter: Not a live video');
      }
    };
    setTimeout(attach, 1000);
})();