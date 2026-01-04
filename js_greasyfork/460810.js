// ==UserScript==
// @name    ao3 mark as read
// @description Adds mark as read button to history page
// @namespace   ao3
// @match       http*://archiveofourown.org/users/*/readings?*show=to-read
// @grant       none
// @version     1.1
// @downloadURL https://update.greasyfork.org/scripts/460810/ao3%20mark%20as%20read.user.js
// @updateURL https://update.greasyfork.org/scripts/460810/ao3%20mark%20as%20read.meta.js
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
      top: 2.2em;
      white-space: nowrap;
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


    try {
      const titleLink = blurb.querySelector('.header.module .heading a');
      workId = (titleLink.href.match(/\/works\/(\d+)\b/) || [])[1];
    } catch (ex) {
    }

    if (!workId) {
      console.log('[ao3 mark as read] - skipping blurb: ', blurb);
      return;
    }
    let section;
    section = blurb.querySelector('.actions')

    section.innerHTML += `
      <div class="mark">
        <ul class="work navigation actions" role="menu">
              <li>
                <a href=https://archiveofourown.org/works/${workId}/mark_as_read>Mark as Read</a>
              </li>
        </ul>
      </div>
    `;
  });
})();