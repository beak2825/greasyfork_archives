// ==UserScript==
// @name       RYM: Weighted average track rating (updated)
// @version    2.4.2
// @description  calculate weighted average track rating based on track lengths
// @match      https://rateyourmusic.com/release/*
// @match      https://rateyourmusic.com/song/*
// @copyright  2021, w_biggs (originally by thought_house)
// @namespace https://greasyfork.org/users/170755
// @downloadURL https://update.greasyfork.org/scripts/38450/RYM%3A%20Weighted%20average%20track%20rating%20%28updated%29.user.js
// @updateURL https://update.greasyfork.org/scripts/38450/RYM%3A%20Weighted%20average%20track%20rating%20%28updated%29.meta.js
// ==/UserScript==

const addWeightedAvg = function addWeightedAvg(selector, trackLengths) {
  const areas = document.querySelectorAll(selector);
  areas.forEach((area) => {
    const weightedRow = area.querySelector('.avg-rating');
    if (weightedRow) {
      weightedRow.remove();
    }

    let rating = 0;
    let rawRating = 0;
    let trackCount = 0;
    let rated = 0;

    let allFound = true;

    const tracks = area.querySelectorAll('.tracklist_line');
    tracks.forEach((track) => {
      const n = track.querySelector('.tracklist_num').textContent.trim();
      const name = track.querySelector('.tracklist_title').textContent.trim();

      let starsVal = 0;


      const ratingNum = track.querySelector('.rating_num');
      if (ratingNum) {
        starsVal = parseFloat(ratingNum.textContent.trim(), 10);
      } else {
        const starsImg = track.querySelector('.track_rating_disp img');
        if (starsImg) {
          starsVal = parseFloat(starsImg.getAttribute('title'), 10);
        }
      }

      if (starsVal > 0) {
        if (n in trackLengths && trackLengths[n].name.includes(name)) {
          rating += trackLengths[n].duration * starsVal;
          rated += trackLengths[n].duration * 1;
        } else {
          allFound = false;
        }

        rawRating += starsVal;
        trackCount += 1;
      }
    });

    let unweightedRating = rawRating / trackCount;

    let weightedRating = 0;

    if (allFound) {
      weightedRating = rating / rated;
    }

    let avgHTML = '';

    if (unweightedRating > 0) {
      avgHTML += 'Average: <b>' + unweightedRating.toFixed(2) + '</b>';
    }
    if (weightedRating > 0) {
      avgHTML += ', Weighted: <b>' + weightedRating.toFixed(2) + '</b>';
    }

    const row = document.createElement('li');
    row.classList.add('track');
    row.classList.add('avg-rating');
    const text = document.createElement('span');
    text.style = 'float:right;margin-right:10px;color:var(--mono-2);font-size:1.1em;margin-top:6px;margin-bottom:6px;';
    text.innerHTML = avgHTML;
    row.appendChild(text);
    area.appendChild(row);
  });
};

const initRatings = function initRatings() {
  const tracklistTracks = document.querySelectorAll('#tracks li.track');

  const trackLengths = {};

  let prevNum = 0;

  tracklistTracks.forEach((track) => {
    const numEl = track.querySelector('.tracklist_num');

    // skip non track rows
    if (numEl) {
      const num = numEl.textContent.trim();

      const nameEl = track.querySelector('.tracklist_title');
      let name = nameEl.textContent.trim();

      const durationEl = track.querySelector('span.tracklist_duration');
      let duration = 0;

      if (durationEl) {
        duration = parseInt(durationEl.dataset.inseconds, 10);
        name = name.replace(new RegExp(`${durationEl.textContent.trim()}$`, 'g'), '').trim();
      }

      // if track number is blank, add duration to last song with a track number
      if (num === '') {
        // exclude silence tracks or first track cd titles
        if (!(name.includes('[silence]')) && prevNum !== 0) {
          trackLengths[prevNum].duration += duration;
        }
      } else {
        trackLengths[num] = {
          name,
          duration,
        };
        prevNum = num;
      }
    }
  });

  console.log(trackLengths);

  addWeightedAvg('#track_ratings', trackLengths);
  addWeightedAvg('.track_rating_hide ul', trackLengths);

  const catalogList = document.getElementById('catalog_list');
  if (catalogList) {
    const catalogObserver = new MutationObserver(function(records, observer) {
      records.forEach((mutation) => {
        if (mutation.type === 'childList') {
          addWeightedAvg('.track_rating_hide ul', trackLengths);
        }
      });
    });

    catalogObserver.observe(catalogList, {
      childList: true,
      attributes: false,
      subtree: false
    });
  }


  const ratingStarButtons = document.querySelectorAll('.my_catalog_rating');
  ratingStarButtons.forEach((button) => {
    button.addEventListener('click', function() {
      addWeightedAvg('#track_ratings', trackLengths);
    });
  });
};

if (document.readyState === 'complete') {
  initRatings();
} else {
  window.addEventListener('load', function() {
    initRatings();
  });
}
