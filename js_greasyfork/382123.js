// ==UserScript==
// @name         Realtime relative time on Twitter
// @namespace    https://twitter.com/shimafuri
// @version      0.0.7
// @description  Refresh relative time every second.
// @author       shimafuri
// @match        https://twitter.com/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.24.0/moment.min.js
// @downloadURL https://update.greasyfork.org/scripts/382123/Realtime%20relative%20time%20on%20Twitter.user.js
// @updateURL https://update.greasyfork.org/scripts/382123/Realtime%20relative%20time%20on%20Twitter.meta.js
// ==/UserScript==

// from https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
const numberWithCommas = (x) => {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

window.setInterval(() => {
  let timestamps;
  timestamps = Array.prototype.slice.call(document.querySelectorAll('time, .js-relative-timestamp, .js-short-timestamp'));

  for (const timestamp of timestamps) {
    const now = moment();
    const tweetTime = moment(timestamp.getAttribute('datetime') || parseInt(timestamp.getAttribute('data-time-ms') || (timestamp.getAttribute('data-time') + '000')));

    const timeParts = [];
    {
      const seconds = now.diff(tweetTime, 'seconds')
      if (seconds >= 60) {
        const minutes = Math.floor(seconds / 60);
        
        if (minutes >= 60) {
          const hours = Math.floor(minutes / 60);
          
          if (hours >= 24) {
            const days = Math.floor(hours / 24);

            timeParts.push(numberWithCommas(days) + ' 日');
          }
          timeParts.push(numberWithCommas(hours % 24) + ' 時間');
        }
        timeParts.push(numberWithCommas(minutes % 60) + ' 分');
      }
      timeParts.push(numberWithCommas(seconds % 60) + ' 秒');
    }
    timestamp.innerHTML = timeParts.join(' ');
  }
}, 1000);
