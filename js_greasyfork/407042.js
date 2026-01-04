// ==UserScript==
// @name         Autoplay Embedded DailyMotion Video
// @namespace    https://greasyfork.org/en/users/85671-jcunews
// @version      1.0.1
// @license      AGPLv3
// @author       jcunews
// @description  Make embedded/iframe DailyMotion video always autoplay. Browser setting must allow video autoplay on DailyMotion site.
// @match        https://www.dailymotion.com/embed/video/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/407042/Autoplay%20Embedded%20DailyMotion%20Video.user.js
// @updateURL https://update.greasyfork.org/scripts/407042/Autoplay%20Embedded%20DailyMotion%20Video.meta.js
// ==/UserScript==

(m => {
  m = location.search.match(/[?&]autoplay(?:=([^&]*))?/i);
  if (m) {
    if (m[1] !== "1") location.search = location.search.replace(/([?&]autoplay)(?:=[^&]*)?/, "$1=1");
  } else location.search += (location.search.length > 1 ? "&" : "?") + "autoplay=1";
})();
