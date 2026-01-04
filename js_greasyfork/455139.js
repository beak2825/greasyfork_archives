// ==UserScript==
// @name             Empornium thumbnail preload
// @version          1.4.0
// @description      Preloads thumbnail images in the torrent table.
// @namespace        https://greasyfork.org/users/241444
// @author           salad: https://greasyfork.org/en/users/241444-salad
// @license          GPL-3.0-only
// @match            https://www.empornium.is/torrents.php*
// @match            https://www.empornium.is/top10.php*
// @match            https://www.empornium.is/bookmarks.php*
// @match            https://www.empornium.sx/torrents.php*
// @match            https://www.empornium.sx/top10.php*
// @match            https://www.empornium.sx/bookmarks.php*
// @icon             https://www.google.com/s2/favicons?domain=empornium.is
// @downloadURL https://update.greasyfork.org/scripts/455139/Empornium%20thumbnail%20preload.user.js
// @updateURL https://update.greasyfork.org/scripts/455139/Empornium%20thumbnail%20preload.meta.js
// ==/UserScript==

(async () => {

  if (document.querySelectorAll('#torrent_table, .torrent_table').length === 0) {
    return;
  }

  const torrentLinks = document.querySelectorAll('#torrent_table td a[onmouseover], .torrent_table td a[onmouseover]');

  const torrentUrls = Array.from(torrentLinks)
    .map(el => new URL(el.href));
  const torrentIds = torrentUrls.map(url => url.searchParams.get('id'));

  const domParser = new DOMParser();
  const previewHtmls = torrentIds.map(id => unsafeWindow[`overlay${id}`])
    .map(html => domParser.parseFromString(html, 'text/html'));
  const thumbnailUrls = previewHtmls.map(html => html.querySelector('img').src);

  console.info('Preloading %s thumbnails...', thumbnailUrls.length);
  console.time('Preloading thumbnails');

  const thumbnailElements = thumbnailUrls.map(src => {
    return new Promise(resolve => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.src = src;
    });
  });

  await Promise.all(thumbnailElements);
  console.timeEnd('Preloading thumbnails');

})();