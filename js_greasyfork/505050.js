// ==UserScript==
// @name    AO3 ePub Download Button
// @description Adds a direct download button for EPUB format to each work blurb on AO3's works index pages.
// @namespace   ao3
// @match     http*://archiveofourown.org/*works*
// @match     http*://archiveofourown.org/*bookmarks*
// @match     http*://archiveofourown.org/*readings*
// @match     http*://archiveofourown.org/series/*
// @grant       none
// @version     2.5
// @downloadURL https://update.greasyfork.org/scripts/505050/AO3%20ePub%20Download%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/505050/AO3%20ePub%20Download%20Button.meta.js
// ==/UserScript==

(function () {
  const blurbs = Array.from(document.querySelectorAll('li.blurb'));

  if (!blurbs.length) {
    return;
  }

  const style = document.createElement('style');

  style.innerHTML = `
    .blurb .download.actions {
      position: absolute;
      right: 0.5em;
      top: 2.2em;
      white-space: nowrap;
    }

    @media only screen and (min-width: 800px) {
      .blurb .download.actions {
        right: 7em;
        top: 0.5em;
      }
    }
  `;

  document.head.appendChild(style);

  blurbs.forEach(blurb => {
    let workId;
    let title;

    try {
      const titleLink = blurb.querySelector('.header.module .heading a');

      title = titleLink.textContent.trim();
      workId = (titleLink.href.match(/\/works\/(\d+)\b/) || [])[1];
    } catch (ex) {
      console.log('[ao3 download buttons] - error extracting workId and title:', ex);
    }

    if (!workId) {
      console.log('[ao3 download buttons] - skipping non-downloadable blurb:', blurb);
      return;
    }

    const epubHref = `/downloads/${workId}/${encodeURIComponent(title)}.epub?updated_at=${Date.now()}`;

    blurb.innerHTML += `
      <div class="download actions">
        <a href="${epubHref}" class="download-link" download="true">save ↓</a>
      </div>
    `;
  });
})();
