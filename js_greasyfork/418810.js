// ==UserScript==
// @name           copy title
// @description    alt+c to copy title link
// @name:en        copy title
// @description:en alt+c to copy title link
// @name:ko        페이지 제목 복사
// @description:ko alt+c로 페이지 제목 링크 복사
// @namespace      https://greasyfork.org/ko/users/713014-nanikit
// @version        240207
// @author         nanikit
// @match          *://*/*
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/418810/copy%20title.user.js
// @updateURL https://update.greasyfork.org/scripts/418810/copy%20title.meta.js
// ==/UserScript==
'use strict';

addEventListener('keydown', (event) => {
  if (event.altKey && event.code === 'KeyC') {
    copyTitle();
  }
});

async function copyTitle() {
  const anchor = createTitleAnchor();
  await setClipboard([
    new Blob([anchor.outerHTML], { type: 'text/html' }),
    new Blob([anchor.innerText], { type: 'text/plain' })
  ]);
}

async function setClipboard(blobs) {
  const item = blobs.reduce((data, blob) => (data[blob.type] = blob, data), {});
  await navigator.clipboard.write([new ClipboardItem(item)]);
}

function createTitleAnchor(){
  const titleText = document.title;
  const anchor = document.createElement('a');
  anchor.href = document.location.href;
  anchor.innerText = titleText;
  return anchor
}