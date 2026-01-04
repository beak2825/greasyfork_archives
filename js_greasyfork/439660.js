// ==UserScript==
// @name         HDBits Showing Free Leech Info
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  Let HDB torrent list show freeleech information (and auto download).
// @author       MewX
// @match        https://hdbits.org/browse.php*
// @icon         https://hdbits.org/pic/favicon/favicon.ico
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @grant        GM_download
// @grant        GM_info
// @downloadURL https://update.greasyfork.org/scripts/439660/HDBits%20Showing%20Free%20Leech%20Info.user.js
// @updateURL https://update.greasyfork.org/scripts/439660/HDBits%20Showing%20Free%20Leech%20Info.meta.js
// ==/UserScript==

// Configure your global variables here.
// Note that to allow download management, you will need to config TamperMonkey to:
// 1. Set Config mode to Advanced.
// 2. Search Download Mode and set it to Browser API.
// 3. Add "*.torrent" to the whitelist.
// 4. Disable brower's "ask everytime" when downloading. (Note, this is must as saveAs arg doesn't disable this.)
const mewxShowDownloadURL = false;
const mewxDownloadToLocal = false;
const mewxAutoRandomReload = false;
const mewxDownloadPath = 'torrents/hdb/';
const mewxTagsToSkip = ['LEECHING', 'SEEDING', 'COMPLETED'];
const mewxMinSizeToDownload = '0B';
const mewxMaxSizeToDownload = '1ZB'; // Format: [0-9][ZEPTGMK]?(B|iB)

function randomTime(from, to) {
    return Math.floor(Math.random() * (to-from)) + from;
}

function checkSeen(elem) {
    let t = elem.text().toLowerCase();
    for (let i = 0; i < mewxTagsToSkip.length; i ++) {
        if (t.indexOf(mewxTagsToSkip[i].toLowerCase()) !== -1) {
            return true; // Seen.
        }
    }
    return false;
}

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}
addGlobalStyle('.tag.tag_mewx_free { background-color: #d50000; margin-left: 0px; margin-right: 5px; }');
addGlobalStyle('.tag.tag_mewx_50 { background-color: #6200ea; margin-left: 0px; margin-right: 5px; }');
addGlobalStyle('.tag.tag_mewx_25 { background-color: #5d4037; margin-left: 0px; margin-right: 5px; }');
addGlobalStyle('.tag.tag_mewx_neutral { background-color: #616161; margin-left: 0px; margin-right: 5px; }');

// Copied from: https://github.com/ronggang/PT-Plugin-Plus/blob/fe1ee0e81c7d7b3eafd71e4d706c0233d648b42b/public/libs/types.expand.js
function sizeToNumber(num) {
  let _size_raw_match = num.match(
    /^(\d*\.?\d+)(.*[^ZEPTGMK])?([ZEPTGMK](B|iB))$/i
  );
  if (_size_raw_match) {
    let _size_num = parseFloat(_size_raw_match[1]);
    let _size_type = _size_raw_match[3];
    switch (true) {
      case /Zi?B/i.test(_size_type):
        return _size_num * Math.pow(2, 70);
      case /Ei?B/i.test(_size_type):
        return _size_num * Math.pow(2, 60);
      case /Pi?B/i.test(_size_type):
        return _size_num * Math.pow(2, 50);
      case /Ti?B/i.test(_size_type):
        return _size_num * Math.pow(2, 40);
      case /Gi?B/i.test(_size_type):
        return _size_num * Math.pow(2, 30);
      case /Mi?B/i.test(_size_type):
        return _size_num * Math.pow(2, 20);
      case /Ki?B/i.test(_size_type):
        return _size_num * Math.pow(2, 10);
      default:
        return _size_num;
    }
  }
  return 0;
};

function downloadLink(url, filename) {
    // Trying to download to reletive folder.
    // Credits: https://github.com/Tampermonkey/tampermonkey/issues/442#issuecomment-327568681
    let dlArg = {
        url: url,
        name: filename
    };
    let result= GM_download(dlArg);
    console.log(result);
}

(function ($, undefined) {
  $(function () {
      const prefix100off = '100% FL';
      const prefix50off = '50% Free Leech';
      const prefix25off = '25% Free Leech';
      const prefixNeutral = 'Neutral Leech';
      const prefixNone = 'All download counts';

      // Pre-computate user inputs.
      const minSize = sizeToNumber(mewxMinSizeToDownload);
      const maxSize = sizeToNumber(mewxMaxSizeToDownload);
      // console.log("Min size set - " + mewxMinSizeToDownload + "; i.e. " + minSize);
      // console.log("Max size set - " + mewxMaxSizeToDownload + "; i.e. " + maxSize);

      let tbody = $('table[id="torrent-list"]').find('tbody').eq(0);
      let cells = tbody.find('tr');
      for (let i = 0; i < cells.length; i ++) {
          let row = cells.eq(i).find('td:not([class="catcell"])');
          let td = row.eq(0);
          let link = td.find('a').eq(0);

          let sizeText = row.eq(3).text();
          let size = sizeToNumber(sizeText);

          let title = link.attr('title');
          if (title == null) {
              continue;
          } else if (title.startsWith(prefix100off)) {
              let dl = td.find('img[title="Download"]').eq(0).parents(".js-download");
              let dlURL = ('https://hdbits.org' + dl.attr('href')).replaceAll(' ', '%20');
              let torrentId = /id=(\d+)/g.exec(dlURL)[1];

              let seen = checkSeen(td);
              console.log((seen ? 'Seen' : 'NEW') + ' - Torrent ' + torrentId + ' is FREE.');
              if (mewxShowDownloadURL && !seen) {
                  console.log(dlURL);
              }

              // Trying to download to reletive folder.
              // Credits: https://github.com/Tampermonkey/tampermonkey/issues/442#issuecomment-327568681
              if (mewxDownloadToLocal && !seen) {
                  // Size check to see if we do want to download this file.
                  if (minSize > maxSize) {
                      console.log("Error: minSize " + mewxMinSizeToDownload + " is greater than maxSize " + mewxMaxSizeToDownload);
                      continue;
                  }
                  if (!(minSize <= size && size <= maxSize)) {
                      console.log("Size NOT accepted - " + sizeText + "; i.e. " + size);
                      continue;
                  }
                  console.log("Size accepted: " + sizeText);

                  let wait = randomTime(0, 10000); // Download after 0-10s randomly.
                  console.log('Will download ' + torrentId + '.torrent after ' + (wait/1000) + ' seconds.');
                  setTimeout(function(){ downloadLink(dlURL, mewxDownloadPath + torrentId + '.torrent'); }, wait);
              }
              td.prepend('<span class="tag tag_mewx_free">100% FREE</span>');
          } else if (title.startsWith(prefix50off)) {
              td.prepend('<span class="tag tag_mewx_50">50% OFF</span>');
          } else if (title.startsWith(prefix25off)) {
              td.prepend('<span class="tag tag_mewx_25">25% OFF</span>');
          } else if (title.startsWith(prefixNeutral)) {
              td.prepend('<span class="tag tag_mewx_neutral">Neutral</span>');
          } else if (title.startsWith(prefixNone)) {
              // Do nothing.
          } else {
              console.log('Unknown discount: ' + title);
          }
      }

      // Need to autoreload the page.
      if (mewxAutoRandomReload) {
          let wait = randomTime(31, 2 * 60); // Refresh after 30min to 2h.
          console.log('Will refresh the page after: ' + wait + ' minutes.');
          setTimeout(function(){ location.reload(); }, wait * 60 * 1000);
      }
  });
})(window.jQuery.noConflict(true));
