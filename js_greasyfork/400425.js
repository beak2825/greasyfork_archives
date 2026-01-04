// ==UserScript==
// @name         Swatch Internet Time
// @author       Nik Rolls
// @description  Convert times to Swatch Internet Time .beats
// @match        *://*/*
// @require      https://greasyfork.org/scripts/395037-monkeyconfig-modern/code/MonkeyConfig%20Modern.js?version=764968
// @grant        GM_getMetadata
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @namespace https://greasyfork.org/users/503103
// @version 0.0.1.20200412044545
// @downloadURL https://update.greasyfork.org/scripts/400425/Swatch%20Internet%20Time.user.js
// @updateURL https://update.greasyfork.org/scripts/400425/Swatch%20Internet%20Time.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const cfg = new MonkeyConfig({
    menuCommand: true,
    params: {
      global_timezone: {
        label: 'Use global BMT timezone',
        type: 'checkbox',
        default: true
      }
    }
  });

  let interval = null;

  document.addEventListener('visibilitychange', detectVisibility);
  detectVisibility();

  function detectVisibility() {
    if (document.visibilityState === 'visible') {
      startWatching();
    } else {
      stopWatching();
    }
  }

  function startWatching() {
    augmentAllTimes();
    interval = window.setInterval(augmentAllTimes, 1000);
  }

  function stopWatching() {
    if (interval) {
      window.clearInterval(interval);
    }
  }

  function augmentAllTimes() {
    do {} while (augmentTimes())
  }

  function augmentTimes() {
    let replacements = 0;
    const items = document.evaluate('/html/body//*[not(self::style or self::script or self::time or self::input or self::textarea or boolean(@contenteditable)) and text()[contains(.,":0") or contains(.,":1") or contains(.,":2") or contains(.,":3") or contains(.,":4") or contains(.,":5") or contains(.,":6") or contains(.,":7") or contains(.,":8") or contains(.,":9") or contains(.,"0pm") or contains(.,"1pm") or contains(.,"2pm") or contains(.,"3pm") or contains(.,"4pm") or contains(.,"5pm") or contains(.,"6pm") or contains(.,"7pm") or contains(.,"8pm") or contains(.,"9pm") or contains(.,"0 pm") or contains(.,"1 pm") or contains(.,"2 pm") or contains(.,"3 pm") or contains(.,"4 pm") or contains(.,"5 pm") or contains(.,"6 pm") or contains(.,"7 pm") or contains(.,"8 pm") or contains(.,"9 pm") or contains(.,"0am") or contains(.,"1am") or contains(.,"2am") or contains(.,"3am") or contains(.,"4am") or contains(.,"5am") or contains(.,"6am") or contains(.,"7am") or contains(.,"8am") or contains(.,"9am") or contains(.,"0 am") or contains(.,"1 am") or contains(.,"2 am") or contains(.,"3 am") or contains(.,"4 am") or contains(.,"5 am") or contains(.,"6 am") or contains(.,"7 am") or contains(.,"8 am") or contains(.,"9 am")]]', document.body, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

    for (var i = 0; i < items.snapshotLength; i++) {
      const item = items.snapshotItem(i);
      const pattern = /(?:(?:([1-9][0-9]?(?::\d{2})*)\s*(a\.?m\.?|p\.?m\.?))|(\d{1,2}?:\d{2}(?::\d{2}(?:\.\d+)?)?))/i;
      const match = item.innerText.match(pattern);
      if (match) {
        let dateTime;

        if (match[1]) {
          const time = match[1];
          const meridiem = match[2].replace(/\./g, '');
          dateTime = createDateTime(time, meridiem);
        } else if (match[3]) {
          dateTime = createDateTime(match[3]);
        }

        if (dateTime) {
          const internetTime = convertToInternetTime(dateTime);
          const textNodes = Array.from(item.childNodes).filter(node => node.nodeType === Node.TEXT_NODE);
          textNodes.forEach((textNode) => {
            const textParts = textNode.textContent.match(new RegExp(`(.*)(${match[0]})(.*)`));
            if (textParts) {
              const newParts = [];

              if (textParts[1]) {
                newParts.push(document.createTextNode(textParts[1]));
              }

              if (textParts[2]) {
                const timeNode = document.createElement('time');
                timeNode.dateTime = dateTime.toISOString().replace(/^.*T|\+.*$|Z.*$/g, '');
                timeNode.title = match[0];
                timeNode.textContent = '@' + internetTime;
                newParts.push(timeNode);
              }

              if (textParts[3]) {
                newParts.push(document.createTextNode(textParts[3]));
              }
              newParts.forEach(part => item.insertBefore(part, textNode));
              textNode.remove();
              replacements++;
            }
          });
        }
      }
    }

    return replacements;
  }

  function createDateTime(time, meridiem) {
    const timeParts = time.match(/\d+/g);
    const dateTime = new Date();
    dateTime.setHours(meridiem && timeParts[0] == 12 ? 0 : timeParts[0], timeParts[1] || 0, timeParts[2] || 0, timeParts[3] || 0);
    if (meridiem && meridiem.startsWith('p')) {
      dateTime.setHours(dateTime.getHours() + 12);
    }
    return dateTime;
  }

  function convertToInternetTime(dateTime) {
    dateTime = new Date(dateTime.getTime());

    if (cfg.get('global_timezone')) {
      dateTime.setMinutes(dateTime.getMinutes() + dateTime.getTimezoneOffset() + 60);
    }

    const midnight = new Date(dateTime.getTime());
    midnight.setHours(0, 0, 0, 0);

    const msPastMidnight = dateTime - midnight;
    const decimal = (msPastMidnight / 86400000) * 1000;
    return Math.floor((decimal + Number.EPSILON) * 100) / 100
  }
})();