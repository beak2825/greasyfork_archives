// ==UserScript==
// @name             Mubi runtime in hours and minutes
// @version          1.0.0
// @author           salad: https://greasyfork.org/en/users/241444-salad
// @match            https://mubi.com/*/films/*
// @description      Mouse over the runtime to show it in hours and minutes
// @namespace        https://greasyfork.org/users/241444
// @license          GPL-3.0-only
// @run-at           document-idle
// @downloadURL https://update.greasyfork.org/scripts/474009/Mubi%20runtime%20in%20hours%20and%20minutes.user.js
// @updateURL https://update.greasyfork.org/scripts/474009/Mubi%20runtime%20in%20hours%20and%20minutes.meta.js
// ==/UserScript==

  function bindTimeChanger() {
    const timeEl = document.querySelector('time[datetime]');
    const timeElHtml = timeEl.innerHTML;
    const minutes = timeElHtml;

    let hours = Math.floor(minutes / 60);
    let remainingMinutes = minutes % 60;

    let formatted;
    if (hours === 0) {
      formatted = `${remainingMinutes} min`;
    } else if (remainingMinutes === 0) {
      formatted = `${hours} hr`;
    } else {
      formatted = `${hours} hr ${remainingMinutes} min`;
    }

    timeEl.addEventListener('mouseover', () => {
      timeEl.innerHTML = timeElHtml.replace(minutes, formatted);
    });

    timeEl.addEventListener('mouseout', () => {
      setTimeout(() => {
        timeEl.innerHTML = timeElHtml;
      }, 500);

    });
  }

// wait 1s for (something to happen?)
setTimeout(bindTimeChanger, 1000);