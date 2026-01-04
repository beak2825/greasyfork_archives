// ==UserScript==
// @name         Bandcamp: Show publish date
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Shows Bandcamp releases' real "publish date" below the listed release date. Also shows "date modified" if different from publish date.
// @author       w_biggs (~joks)
// @match        https://*.bandcamp.com/*
// @downloadURL https://update.greasyfork.org/scripts/420662/Bandcamp%3A%20Show%20publish%20date.user.js
// @updateURL https://update.greasyfork.org/scripts/420662/Bandcamp%3A%20Show%20publish%20date.meta.js
// ==/UserScript==

const jsonElements = document.querySelectorAll('script[type="application/ld+json"]');

jsonElements.forEach((jsonElement) => {
  const jsonld = JSON.parse(jsonElement.innerText);
  const datePublished = jsonld?.datePublished;
  const dateModified = jsonld?.dateModified;
  if (datePublished) {
    const credits = document.querySelector('div.tralbum-credits');

    const publishDate = new Date(datePublished);
    const publishDateString = publishDate.toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    let dateString = `<span style="opacity: 0.7;">published ${publishDateString}<br>`;

    if (dateModified) {
      const modifiedDate = new Date(dateModified);
      const modifiedDateString = modifiedDate.toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
      if (modifiedDateString !== publishDateString) {
        dateString += `modified ${modifiedDateString}`;
      }
    }

    dateString += '</span>';

    if (credits.innerHTML.match(/\<br\>/)) {
      credits.innerHTML = credits.innerHTML.replace(/\<br\>/, `<br>${dateString}<br>`);
    } else {
      credits.innerHTML += `<br>${dateString}`;
    }
  }
});