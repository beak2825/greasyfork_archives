// ==UserScript==
// @name             Letterboxd runtime in hours and minutes
// @version          1.0.2
// @author           salad: https://greasyfork.org/en/users/241444-salad
// @match            https://letterboxd.com/film/*
// @description      Mouse over the runtime to show it in hours and minutes
// @namespace        https://greasyfork.org/users/241444
// @license          GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/465414/Letterboxd%20runtime%20in%20hours%20and%20minutes.user.js
// @updateURL https://update.greasyfork.org/scripts/465414/Letterboxd%20runtime%20in%20hours%20and%20minutes.meta.js
// ==/UserScript==

(function() {
  // clone the node: removes tracking event handlers from the IMDB/TMDB buttons
  let timeEl = document.querySelector('p.text-footer');

  // remove tracking from buttons
  timeEl.querySelectorAll('.track-event').forEach(buttonNode => {
    buttonNode.classList.remove('track-event');
    delete buttonNode.dataset.trackAction;
  });

  const cloned = timeEl.cloneNode(true);
  timeEl.replaceWith(cloned);
  timeEl = cloned;

  const timeElHtml = timeEl.innerHTML;

  const [minutesText, minutes] = /(\d+).+mins/.exec(timeElHtml);

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
    timeEl.innerHTML = timeElHtml.replace(minutesText, formatted);
  });

  timeEl.addEventListener('mouseout', () => {
    setTimeout(() => {
      timeEl.innerHTML = timeElHtml;
    }, 500);

  });

})();