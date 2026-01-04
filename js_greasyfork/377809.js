// ==UserScript==
// @name         Show Absolute Datetime in Gitlab
// @namespace    http://tampermonkey.net/
// @version      0.3.5
// @description  Show absolute datetime in custom gitlab page.
// @author       Priestch
// @match        https://gitpd.paodingai.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377809/Show%20Absolute%20Datetime%20in%20Gitlab.user.js
// @updateURL https://update.greasyfork.org/scripts/377809/Show%20Absolute%20Datetime%20in%20Gitlab.meta.js
// ==/UserScript==

(function() {
  'use strict';
  document.onreadystatechange = function () {
    if (document.readyState == "complete") {
      replaceRelativeDateTime();
    }
  }

  function padStart(string, length, pad) {
    const s = String(string)
    if (!s || s.length >= length) return string
    return `${Array((length + 1) - s.length).join(pad)}${string}`
  }

  const datetimePattern = /(\w+)\s(\d+),\s(\d{4}) (\d+):(\d+)([a|p]m) GMT([+-]\d{4})/;
  const datetimeFormatPattern = /\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/

  const monthMap = {
    'Jan': 1,
    'Feb': 2,
    'Mar': 3,
    'Apr': 4,
    'May': 5,
    'Jun': 6,
    'Jul': 7,
    'Aug': 8,
    'Sep': 9,
    'Oct': 10,
    'Nov': 11,
    'Dec': 12,
  }

  const timezonePattern = /([-|+])(\d{2})(\d{2})/;

  function parseTimezone(timezone) {
    const matched = timezone.match(timezonePattern);
    if (matched) {
      return `${matched[1]}${matched[2]}:${matched[3]}`;
    } else {
      return timezone;
    }
  }

  function parseDatetime(datetimeString) {
    const matched = datetimeString.match(datetimePattern);
    if (matched) {
      let hours = Number(matched[4]);
      if (matched[6] === 'pm') {
        hours += 12;
      }

      const timezone = parseTimezone( matched[7]);
      const datetime = {
        year: matched[3],
        day: padStart(matched[2], 2, '0'),
        month: padStart(`${monthMap[matched[1]]}`, 2, '0'),
        hours: padStart(hours, 2, '0'),
        minutes: padStart(matched[5], 2, '0'),
        seconds: '00',
        milliseconds: '000',
        timezone
      };

      return `${datetime.year}-${datetime.month}-${datetime.day}T${datetime.hours}:${datetime.minutes}:${datetime.seconds}.${datetime.milliseconds}${datetime.timezone}`;
    }
    return datetimeString;
  }

  function getDatetime(el) {
    if (el.tagName === 'TIME') {
      const datetimeAttr = el.getAttribute('datetime');
      if (datetimeAttr !== 'date') {
        return datetimeAttr;
      }
    }

    return el.dataset.title || el.dataset.originalTitle;
  }

  function formatDatetime(datetime) {
    const month = padStart(`${datetime.getMonth() + 1}`, 2, '0');
    const day = padStart(`${datetime.getDate()}`, 2, '0');
    const hours = padStart(`${datetime.getHours()}`, 2, '0')
    const minutes = padStart(`${datetime.getMinutes()}`, 2, '0')
    const seconds = padStart(`${datetime.getSeconds()}`, 2, '0')
    let formatted = `${datetime.getFullYear()}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    return formatted;
  }

  function replaceRelativeDateTime() {
    const targetNode = document.getElementsByTagName('body')[0];

    // Options for the observer (which mutations to observe)
    const config = { attributes: true, childList: true, subtree: true };

    // Callback function to execute when mutations are observed
    const callback = function(mutationsList, observer) {
      for(let mutation of mutationsList) {
        const timeChildren = mutation.target.querySelectorAll('time');
        if (timeChildren.length > 0) {
          for (let t of timeChildren) {
            if (!t.textContent.match(datetimeFormatPattern)) {
              const datetimeValue = getDatetime(t);
              if (datetimeValue) {
                const parsedDatetime = Date.parse(parseDatetime(datetimeValue));
                t.textContent = formatDatetime(new Date(parsedDatetime));
              }
            }
          }
          continue;
        } else {
          if (mutation.target.nodeName !== 'TIME') {
            continue;
          }
          if (mutation.type == 'childList' && mutation.target.nodeName === 'TIME') {
            if (!mutation.target.textContent.match(datetimeFormatPattern)) {
              const utcDatetime = mutation.target.getAttribute('datetime');
              const textContent = utcDatetime ? formatDatetime(new Date(utcDatetime)) : getDatetime(mutation.target);
              mutation.target.textContent = textContent;
            }
          }
        }
      }
    };

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(targetNode, config);

    const relativeDatetimeElements = document.getElementsByTagName('time');
    for (let element of relativeDatetimeElements) {
      element.textContent = getDatetime(element);
    }
  }
})();
