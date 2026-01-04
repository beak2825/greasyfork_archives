// ==UserScript==
// @name        webnovel.com skip video ads
// @namespace   http://forum.novelupdates.com/
// @version     1
// @run-at      document-end
// @grant       GM_xmlhttpRequest
// @match       http://www.webnovel.com/book/*
// @match       https://www.webnovel.com/book/*
// @connect     www.webnovel.com
// @icon        http://i.imgur.com/8Jv6GOz.png
// @description skips chapter ads on webnovel.com
// @downloadURL https://update.greasyfork.org/scripts/32330/webnovelcom%20skip%20video%20ads.user.js
// @updateURL https://update.greasyfork.org/scripts/32330/webnovelcom%20skip%20video%20ads.meta.js
// ==/UserScript==
  
function main() {
  Array.from(
    document.querySelectorAll('.cha-content._lock')
  ).forEach((lock) => {
    lock.classList.remove('_lock');

    const v = lock.closest('.chapter_content').querySelector('.lock-video');
    if (v) {
      v.remove();
    }

    const contentElement = lock.querySelector('.cha-words');
    contentElement.style.opacity = '0.1';

    const bid = window.location.href.split('/book/')[1].split('/')[0];
    const { cid } = lock.querySelector('[data-cid]').dataset;

    if (!bid || !cid) {
      return;
    }

    return fetch(
      `https://www.webnovel.com/apiajax/chapter/GetChapterContentToken?bookId=${bid}&chapterId=${cid}`
    )
      .then(resp => resp.json())
      .then(data => data.data.token)
      .then(token => encodeURIComponent(token))
      .then(token => new Promise((resolve) => {
        let content = '';

        function tick() {
          const url = `https://www.webnovel.com/apiajax/chapter/GetChapterContentByToken?token=${token}`;

          fetch(url)
            .then(resp => resp.json())
            .then((data) => {
              content = data.data.content.trim();

              if (content) {
                resolve(content);
              } else {
                setTimeout(tick, 1000);
              }
            })
            .catch((err) => {
              console.error(err.stack);

              tick();
            });
        }

        tick();
      }))
      .then((content) => {
        let chapterHtml = content.replace(/\r?\n/g, '\n');

        chapterHtml = chapterHtml
          .split('\n')
          .map(p => p.trim())
          .filter(p => !!p)
          .map(p => `<p>${p}</p>`)
          .join('');

        contentElement.innerHTML = chapterHtml;
        contentElement.style.opacity = '1';
      })
      .catch((err) => {
        console.error(err.stack);
      });
  });
}

setInterval(main, 1000);