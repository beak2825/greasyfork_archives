// ==UserScript==
// @name    ao3 mark for later
// @description Adds mark for later buttons to work index pages. 
// @namespace   ao3
// @match       http*://archiveofourown.org/*works*
// @match       http*://archiveofourown.org/*bookmarks*
// @match       http*://archiveofourown.org/series/*
// @match       http*://archiveofourown.org/*readings*
// @match       http*://archiveofourown.org/collections*
// @match       http*://archiveofourown.org/users/*
// @exclude     http*://archiveofourown.org/*readings?*show=to-read*
// @grant       none
// @version     1.2
// @downloadURL https://update.greasyfork.org/scripts/460812/ao3%20mark%20for%20later.user.js
// @updateURL https://update.greasyfork.org/scripts/460812/ao3%20mark%20for%20later.meta.js
// ==/UserScript==

(function () {
  const blurbs = Array.from(document.querySelectorAll('li.blurb'));

  if (!blurbs.length) {
    return;
  }

  const style = document.createElement('style');

  style.innerHTML = `
    .blurb .mark {
      right: 0.5em;
      white-space: nowrap;
      test-align: center;
      clear: none;
      float: left;
      }

    @media only screen and (min-width: 800px) {
      .blurb .mark {
        right: 7em;
        top: 0.5em;
      }
    }
  `;

  document.head.appendChild(style);

  blurbs.forEach(blurb => {
    let workId;
    let notAO3;

    try {
      const titleLink = blurb.querySelector('.header.module .heading a');
      workId = (titleLink.href.match(/\/works\/(\d+)\b/) || [])[1];
      notAO3 = (titleLink.href.match(/archiveofourown.org/)||[]);
    } catch (ex) {
    }

    if (!workId || !notAO3[0]) {
      console.log('[ao3 mark for later] - skipping blurb that isn\'t a work blurb: ', blurb);
      return;
    }

    let section = blurb.querySelector('.actions')
    console.log(!section)
      if(!section)
      {
          section = blurb
      }

    section.innerHTML += `
      <div class="mark">
        <ul class="actions" role="menu">
              <li>
                <a href=https://archiveofourown.org/works/${workId}/mark_for_later>Mark for Later</a>
              </li>
        </ul>
      </div>
    `;
  });
})();