// ==UserScript==
// @name             Letterboxd Runtime
// @version          0.1.0
// @author           fawn
// @namespace        https://fawn.moe
// @match            https://letterboxd.com/film/*
// @description      Displays the runtime in hours and minutes instead of total minutes
// @license          Apache-2.0
// @downloadURL https://update.greasyfork.org/scripts/509860/Letterboxd%20Runtime.user.js
// @updateURL https://update.greasyfork.org/scripts/509860/Letterboxd%20Runtime.meta.js
// ==/UserScript==

(function() {
  let footerEl = document.querySelector('p.text-footer');
  const [minutesText, minutes] = /(\d+).+mins/.exec(footerEl.innerHTML);

  let hours = Math.floor(minutes / 60);
  let remaining = minutes % 60;

  let formatted;
  if (hours === 0) {
    formatted = `${remaining} mins`;
  } else if (remaining === 0) {
    formatted = `${hours} hours`;
  } else {
    formatted = `${hours} hours, ${remaining} mins`;
  }

  footerEl.innerHTML = footerEl.innerHTML.replace(minutesText, formatted);

  footerEl.classList.add("tooltip");
  footerEl.setAttribute("data-original-title", `${minutes} mins`);
})();