// ==UserScript==
// @name        5ch.net Image Inserter
// @name:ja     5ch.net Image Inserter
// @namespace   Violentmonkey Scripts
// @include     */r/*/*/*
// @include     */test/read.cgi/*/*
// @include     */read.php/*/*
// @include     */log/*/*/*/
// @include     *.5ch.net/*/*
// @grant       unsafeWindow
// @version     1.2
// @author      -
// @description Insert images found in 5ch threads.
// @description:ja 5chのスレッドにあるイメージをインサートする。
// @license     MIT
// @icon        https://5ch.net/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/468685/5chnet%20Image%20Inserter.user.js
// @updateURL https://update.greasyfork.org/scripts/468685/5chnet%20Image%20Inserter.meta.js
// ==/UserScript==

function fileExtension(url) {
  const parts = url.split('/')
  const fileParts = parts[parts.length - 1].split('.')
  let ext = fileParts[fileParts.length - 1]
  ext = ext.replace(/\?.*$/, '')
  return ext
}

const imageExtensions = [
  'gif',
  'jpg',
  'jpeg',
  'png',
  'webp'
]
const videoExtensions = [
  'webm',
  'mp4'
]
function typeOf(url) {
  const ext = fileExtension(url).toLowerCase()
  if (imageExtensions.includes(ext)) {
    return 'image'
  } else if (videoExtensions.includes(ext)) {
    return 'video'
  } else {
    return 'other'
  }
}

function cleanUrl(url) {
  const newUrl = url.replace(/^http.*jump.5ch.net\/\?/, '')
  return newUrl
}

function insertImage(a) {
  const newUrl = cleanUrl(a.href)
  a.innerHTML = `<img class="inserted" src="${newUrl}" loading="lazy" />`
}

function insertVideo(a) {
  const newUrl = cleanUrl(a.href)
  a.innerHTML = `<video controls loop class="inserted"><source src="${newUrl}" /></video>`
}

// main _______________________________________________________________

// Apply CSS
let css = `
video {
  max-width: 100%;
}
`
let style = document.createElement("style");
style.type = "text/css";
style.appendChild(document.createTextNode(css));
document.head.appendChild(style);

// scan 2023-04+ era DOM
document.querySelectorAll('article .post-content a').forEach((a) => {
  const t = typeOf(a.href)
  switch (t) {
  case 'image':
    insertImage(a)
    break;
  case 'video':
    insertVideo(a)
    break;
  }
})
