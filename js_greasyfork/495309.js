// ==UserScript==
// @name        Dizipal ad remover
// @namespace   Muhammed Kaplan
// @description Remove ad on dizipal
// @match       *://dizipal735.com/*
// @version     0.0.1
// @author      Muhammed Kaplan
// @license GPL3
// @downloadURL https://update.greasyfork.org/scripts/495309/Dizipal%20ad%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/495309/Dizipal%20ad%20remover.meta.js
// ==/UserScript==

(function () {
'use strict';

const adElements = document.querySelectorAll('.bb');
const newCommentForm = document.querySelector('.add-comment-form');
const episodes = document.querySelector('aside.episodes');
for (const ad of adElements) {
  ad.remove();
}
const pathName = unsafeWindow.location.pathname;
let isOnWatchPage = false;
if (pathName.match(`/dizi/(.*)/(.*)+/(.*)`) !== null) {
  try {
    //@ts-expect-error A function from the website itself
    unsafeWindow.playVideo();
  } catch (error) {
    console.error(error);
  }
  isOnWatchPage = true;
}
if (isOnWatchPage) {
  //@ts-expect-error Unsafe window
  episodes.style.display = 'none';
  newCommentForm.remove();

  // Video player improvements
  try {
    var _unsafeWindow, _unsafeWindow2;
    //@ts-expect-error A function from the website itself
    (_unsafeWindow = unsafeWindow) == null || _unsafeWindow.PlayerjsEvents();
    //@ts-expect-error A function from the website itself
    (_unsafeWindow2 = unsafeWindow) == null || (_unsafeWindow2 = _unsafeWindow2.player) == null ? void 0 : _unsafeWindow2.api('play');
  } catch (error) {
    console.error('Error', error);
  }
}

})();
