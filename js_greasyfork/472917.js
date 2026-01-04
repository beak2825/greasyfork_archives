// ==UserScript==
// @name         Format time strings in crt.sh
// @namespace    https://chat.openai.com/
// @version      1.0
// @description  Format time strings to local time in an ISO-like format
// @author       ChatGPT
// @license      The Unlicense
// @match        https://crt.sh/?id=*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/472917/Format%20time%20strings%20in%20crtsh.user.js
// @updateURL https://update.greasyfork.org/scripts/472917/Format%20time%20strings%20in%20crtsh.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const nodes = document.querySelectorAll('.text');
  for (const node of nodes) {
    for (const childNode of node.childNodes) {
      if (childNode.nodeType === Node.TEXT_NODE) {
        let text = childNode.textContent;
        const regex = /\w{3}\u00A0[\u00A0\d]\d\u00A0\d{2}:\d{2}:\d{2}\u00A0\d{4}\u00A0GMT/;
        const match = regex.exec(text);
        if (match !== null) {
          const timeString = match[0];
          const time = new Date(timeString);
          const formattedTime = formatTime(time);
          text = text.replace(timeString, formattedTime);
          childNode.textContent = text;
        }
      }
    }
  }

  function formatTime(date) {
    function pad(number) {
      if (number < 10) {
        return '0' + number;
      }
      return number;
    }

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());
    const timezoneOffset = date.getTimezoneOffset();
    const timezoneOffsetHours = Math.floor(Math.abs(timezoneOffset) / 60);
    const timezoneOffsetMinutes = Math.abs(timezoneOffset) % 60;
    const timezoneSign = timezoneOffset <= 0 ? '+' : '-';
    const timezone = timezoneSign + pad(timezoneOffsetHours) + pad(timezoneOffsetMinutes);

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds} ${timezone}`;
  }
})();