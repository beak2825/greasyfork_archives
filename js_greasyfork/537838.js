// ==UserScript==
// @name         AO3: Score
// @namespace    https://codeberg.org/schegge
// @description  'Engagement' score - it's calculated as follows: (Bookmarks + (Comments / Chapters)) / Kudos * 100, for works with a minimum of 1 bookmark and 6 kudos.
// @version      1.0
// @author       Schegge
// @match        *://archiveofourown.org/*
// @match        *://www.archiveofourown.org/*
// @downloadURL https://update.greasyfork.org/scripts/537838/AO3%3A%20Score.user.js
// @updateURL https://update.greasyfork.org/scripts/537838/AO3%3A%20Score.meta.js
// ==/UserScript==

(function() {

   const SN = 'escore'

   const DATA = {
      levels: [ 40,        20,        10,        0],
      colors: ['#8E7DBE', '#A6D6D6', '#FFF1D5', '#F7CFD8']
   };

   document.head.insertAdjacentHTML('beforeend', `<style>
      dd.${SN} { color: #000 !important; padding-inline: .35em !important; border-radius: .5em; }
      dl.stats.${SN} .collections, dl.stats.${SN} .hits { display: none !important; }
   </style>`);

   function count(el, split = false) {
      let num = el.textContent.trim();
      if (split) num = num.split(split)[0];
      else num = num.replace(/,/g, '');
      return parseInt(num);
   }

	for (const work of document.querySelectorAll('dl.stats')) {
      const kudos = work.querySelector('dd.kudos');
      const bookmarks = work.querySelector('dd.bookmarks');
      const comments = work.querySelector('dd.comments');
      const chapters = work.querySelector('dd.chapters');

      if (!kudos || !bookmarks) continue;
      let ku = count(kudos);
      if (ku < 6) continue;

      work.classList.add(SN);

      let ch = count(chapters, '/');
      let co = comments ? count(comments) / ch : 0;

      const score = Math.round(100 * (count(bookmarks) + co) / ku);

      let color = '';
      for (const [index, level] of DATA.levels.entries()) {
         if (score > level) {
            color = DATA.colors[index];
            break;
         }
      }

      work.insertAdjacentHTML('beforeend',
         `<dt>Score:</dt> <dd class="${SN}" style="background-color: ${color}">${score}</dd>`);
   }

})();