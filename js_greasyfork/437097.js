// ==UserScript==
// @name        Full image from screenshoters
// @namespace   Neur0toxine
// @license     MIT
// @include     /^https?:\/\/prnt\.sc\/[\w\-]+$/
// @include     /^https?:\/\/skr\.sh\/\w+$/
// @include     /^https?:\/\/ibb\.co\/\w+$/
// @include     /^https?:\/\/monosnap\.com\/file\/\w+$/
// @include     /^https?:\/\/nimbusweb\.me\/nimbus\-screenshots\/\w+$/
// @include     /^https?:\/\/joxi\.ru\/\w+$/
// @exclude     /^https?:\/\/joxi\.ru\/\w+\.jpg$/
// @grant       none
// @version     0.4
// @author      Neur0toxine
// @description Opens the image itself while opening different screenshot services (you won't see their bloated webpages).
// @downloadURL https://update.greasyfork.org/scripts/437097/Full%20image%20from%20screenshoters.user.js
// @updateURL https://update.greasyfork.org/scripts/437097/Full%20image%20from%20screenshoters.meta.js
// ==/UserScript==
switch (location.host) {
  case 'prnt.sc':
    location.assign(document.querySelector('.no-click.screenshot-image').src);
    break;
  case 'skr.sh':
    location.assign(document.getElementById('screenshot-image').src);
    break;
  case 'joxi.ru':
    location.assign(location.href + '.' + document.querySelector('.tile-preview > img').src.split('.').pop());
    break;
  case 'ibb.co':
    location.assign(document.querySelector('#image-viewer-container > img').src);
    break;
  case 'monosnap.com':
    location.assign(`https://api.monosnap.com/file/download?id=${location.pathname.replace('/file/', '')}`);
    break;
  case 'nimbusweb.me':
    location.assign(document.querySelector('nns-note > .nns-adds-wrapper > .wrapper > .note-content > nns-note-text img').src);
    break;
}
