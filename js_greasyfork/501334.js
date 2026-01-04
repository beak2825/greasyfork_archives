// ==UserScript==
// @name         DM5 ZEN MODE
// @namespace    https://www.dm5.com/
// @version      2024-07-21
// @description  Zen Read mode for manga
// @author       Tommy Chan
// @match        https://www.dm5.com/*
// @icon         https://www.dm5.com/favicon.ico
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/501334/DM5%20ZEN%20MODE.user.js
// @updateURL https://update.greasyfork.org/scripts/501334/DM5%20ZEN%20MODE.meta.js
// ==/UserScript==

/* globals ShowPre, ShowNext, DM5_CID  DM5_CID, DM5_MID, DM5_VIEWSIGN_DT, DM5_VIEWSIGN, DM5_CURL, DM5_IMAGE_COUNT, $ */

const isNormalReadingPage = !!DM5_CURL;

const css = `
.view-header-2,
.new-tip.normal,
.view-ad+.view-paging,
.view-ad,
.rightToolBar,
.view-comment-sub,
#lb-win,
#last-win > a > img,
.lb-win-con,
footer,
.index-right-float {
  display: none !important;
}

#showimage,
#cp_img,
#cp_img > img {
  min-height:  100vh !important;
  height: 100vh !important;
  max-height: 100vh !important;
  margin: 0 !important;
  object-fit: contain;
  pointer-events: none !important;
}

.view-paging {
  margin-top: 24px !important;
}

${isNormalReadingPage ? `
.view-comment,
.view-comment > .container {
  display:  flex;
  justify-content: center;
}
`
    : ""
  }

#monkey-left-title {
  position: fixed;
  left: 8px;
  top: 8px;
  display: flex;
}

#monkey-left-title > a,
#monkey-left-title > a:visited,
#monkey-left-title > a:hover,
#monkey-left-title > a:focus,
#monkey-left-title > a:active {
  text-decoration: none;
 color:rgb(23, 103, 152);
}
`;

function preloadImages(imageUrls) {
  const loadedImages = [];
  for (let url of imageUrls) {
    const img = new Image();
    img.onload = () => console.log(`Loaded ${url}`);
    img.onerror = () => console.error(`Failed to load ${url}`);
    img.src = url;
    loadedImages.push(img);
  }
  console.log('Preload Images', loadedImages);
}

function getChapterImageUrls() {
  return new Promise((resolve, reject) => {
    let imageUrls = [];
    for (let i = 1; i <= DM5_IMAGE_COUNT; i++) {
      const params = new URLSearchParams({
        cid: DM5_CID,
        page: i,
        key: $("#dm5_key").val(),
        language: 1,
        gtk: 6,
        _cid: DM5_CID,
        _mid: DM5_MID,
        _dt: DM5_VIEWSIGN_DT,
        _sign: DM5_VIEWSIGN
      });

      fetch(`chapterfun.ashx?${params.toString()}`, {
        method: 'GET'
      })
      .then(response => response.text())
      .then(data => {
        // eslint-disable-next-line no-eval
        const imgSrc = eval(data)?.[0] ?? "";
        imageUrls.push(imgSrc);
        if (imageUrls.length === DM5_IMAGE_COUNT) {
          resolve(imageUrls);
        }
      })
      .catch(error => {
        console.error('Error fetching image URLs:', error);
        reject(error);
      });
    }
  })
}
const preloadChapters = [];

function preloadChapterImages() {
  if (preloadChapters.includes(DM5_CURL)) return;
  getChapterImageUrls()
    .then(imageUrls => preloadImages(imageUrls))
    .then(() => { preloadChapters.push(DM5_CURL); })
    .catch(() => {
      console.error('Failed to preload chapter images');
    });
}

(function () {
  'use strict';
  console.log('DM5 Script is running');
  GM_addStyle(css);
  // Your code here...

  const titleEl = document.querySelector("body > div.view-header-2 > div.title > span:nth-child(2) > a");
  const episodeEl = document.querySelector("body > div.view-header-2 > div.title > span.active.right-arrow");

  const el = document.createElement('div');
  el.innerHTML = `<div id="monkey-left-title"><a href="${titleEl.href}">${titleEl.textContent.trim()}</a><span> > ${episodeEl.textContent.trim()}</span></div>`;
  document.body.appendChild(el);

  document.addEventListener('mousedown', function (event) {
    switch (event.button) {
      case 0:
        console.log('Left mouse button clicked');
        ShowNext();
        break;
      case 2:
        console.log('Right mouse button clicked');
        ShowPre();
        break;
    }
  });

  document.addEventListener('contextmenu', function (event) {
    event.preventDefault();
  });

  if (DM5_CURL) {
    preloadChapterImages();
  }
})();