// ==UserScript==
// @name        F
// @version     0.1.1
// @description Userscript to retrieve archived versions of dead links 
// @license     GPL-3.0
// @author      Heterosexual
// @namespace   https://github.com/heterosexual
// @include     *
// @grant       GM_registerMenuCommand
// @grant       GM_xmlhttpRequest
// @icon        data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAB4CAMAAAAOusbgAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAB3RJTUUH4QgVEBkmE1ABfgAAAR1QTFRFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////xWCkcwAAAF10Uk5TAAECAwQFBggJCw4PEBESFhobHh8hIyQnKSosLS83OTs+P0ZKVVZcXV5fbm9wgoeOkJObn6CjpKWmqqusra+wsba4vcPExsvMzc/S29ze3+Lj5ufs7e7v8PP09fj51vb7RgAAAAFiS0dEXgTWYbsAAAJwSURBVGje7Zv9d5JQGMclmIpQFMkQV+oqt2VZpHNWul60pXNbuDndaPn//xt5wRP38HJA8I7U5/OT93vO9fMD3OfAcx4SCQAA1oZULm/CoxUl7uQtFBZltIRnchJlSRmLdiQaZayCZyKFMn6+zKUc4tzZeGRQRiumfjP6x7VWQFmmM7Gy8SCLsuxgbGWTTgZlBe3aym7qDMrK811nOYc4P5qa7Bni1hTjtoQyrodnmoQyScOzHoey0i2etQzx3nw1yvuJ2/hm3Vs8dBHrC4svGjOKxvWsNBsWNRll6SqWHakCygT1yMqa1TTK5Bq2tVkxrnsR/b7wFDfI3r8NEMcr5sv7B0Wy4uLBfpmHUr2BUAzD0GQV9ExBOVLxsH1cISuuHLfrIhQQEIM4fjFFe0IRFb9sffbg4zOi4rdTL/68ICp+szZiRdPvamTFtTtdUxwpWyjtyoHFk95PByfPfbbKu6UCG/owmuJvAv/QDr9FtAqY4i9kJestpjMclyYrTnNcxvlYJ3X6p1Wy4uppvyNFLCChxMuoXCAGMYhBvHri708f23jyKKRYHgwv1cBi/dzOrw++/QT1cjhwPl0ls9K2EFjswifGb6uwLWWTibBEEEdjU8Xn6nsb6usH4f5wsZsr1Dl2v7lmx+lKJStWr9yOE5RMEIMYxCD+/8WxvZjH1ooICrSbVle8WBM1lNi9iapovwO1jc0O/dcwbwTubeOgBeTVj263e/IuzEN0tMq1xSJSiXsXRwDEIAYxiJcsFusxDaDENnIDrD+xDQtC5doMcWxjzj6D3X1ig91LGmVfTGwb3j+8t+H92D5XAABgZfkLa+RAgNiSWKYAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTctMDgtMjFUMTY6MjU6MTkrMDA6MDC2yHQ/AAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE3LTA4LTIxVDE2OjI1OjE5KzAwOjAwx5XMgwAAABt0RVh0U29mdHdhcmUAQVBORyBBc3NlbWJsZXIgMy4wXkUsHAAAAABJRU5ErkJggg==
// @downloadURL https://update.greasyfork.org/scripts/39050/F.user.js
// @updateURL https://update.greasyfork.org/scripts/39050/F.meta.js
// ==/UserScript==

(() => {
  "use strict";

  const archives = {
    "archive.org": 'https://archive.org/wayback/available?url=%s',
    "archive.is": 'https://archive.is/timegate/%s'
  };

  function findArchived(url, id) {
    GM_xmlhttpRequest({
      method: "GET",
      url: url,
      onload: (data) => {
        if (id === "archive.org") {
          const decoded = JSON.parse(data.response);
          if(decoded.archived_snapshots.closest) {
            window.location.href = decoded.archived_snapshots.closest.url.replace("http://", "https://");
          }
        }
        if (id === "archive.is") {
          if (data.finalUrl != url) {
            window.location.href = data.finalUrl.replace("http://", "https://");
          }
        }
      },
      onerror: (data) => {
        console.log(data.response);
      }
    });
  }

  GM_registerMenuCommand("F. Search for archived pages", () => {
    let link = prompt("Enter a link or leave blank to search for the current page");

    /* Cancel */
    if (link === null) {
      return;
    }

    /* Current page */
    if (link === "") {
      link = window.location.href;
    }

    for (const id in archives) {
      findArchived(archives[id].replace(/%s/g, link), id);
    }
  });
})();
