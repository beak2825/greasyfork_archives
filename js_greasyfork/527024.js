// ==UserScript==
// @name         AniList improve button accessibility
// @namespace    https://greasyfork.org/en/users/96096-purple-pinapples
// @version      0.0.1
// @description  Updates progress divs on the homepage to make the '+' buttons clickable
// @author       PurplePinapples
// @match        https://anilist.co/home
// @license      MIT License
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/527024/AniList%20improve%20button%20accessibility.user.js
// @updateURL https://update.greasyfork.org/scripts/527024/AniList%20improve%20button%20accessibility.meta.js
// ==/UserScript==

(() => {
  // retry func 'times' times until func returns true
  const retryTimes = (func, times, interval) => {
    if (times < 1) {
      return;
    }
    const res = func();
    if (res === true) {
      return;
    } else {
      setTimeout(() => retryTimes(func, times - 1, interval), interval);
    }
  };

  // make the '+' button on the hompeage clickable by screen readers
  const plusProgress = () => {
    const items = document.querySelectorAll(".plus-progress");
    items.forEach((item) => {
      item.role = "button";
    });
    return items.length > 0;
  };

	retryTimes(plusProgress, 5, 1000);
})();