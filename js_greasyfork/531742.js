// ==UserScript==
// @name         YT Select Captions
// @namespace    https://greasyfork.org/users/901750-gooseob
// @version      1.1
// @description  Make YouTube captions selectable
// @author       GooseOb
// @license      MIT
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @downloadURL https://update.greasyfork.org/scripts/531742/YT%20Select%20Captions.user.js
// @updateURL https://update.greasyfork.org/scripts/531742/YT%20Select%20Captions.meta.js
// ==/UserScript==

(() => {
  "use strict";

  var until = (getItem, check, timeout = 1e4, interval = 20) =>
    new Promise((res, rej) => {
      let item = getItem();
      if (check(item)) return res(item);
      const limit = timeout / interval;
      let i = 0;
      const id = setInterval(() => {
        item = getItem();
        if (check(item)) {
          clearInterval(id);
          res(item);
        } else if (++i > limit) {
          clearInterval(id);
          rej(new Error(`Timeout: item ${getItem.name} wasn't found`));
        }
      }, interval);
    });
  var untilAppear = (getItem, msToWait) => until(getItem, Boolean, msToWait);

  untilAppear(() =>
    document.getElementById("ytp-caption-window-container"),
  ).then((captionWindowCont) => {
    captionWindowCont.addEventListener(
      "mousedown",
      (e) => {
        e.stopPropagation();
      },
      { capture: true },
    );
  });

  var style = document.createElement("style");
  style.textContent = `
#ytp-caption-window-container {
  pointer-events: unset !important;
}
#ytp-caption-window-container > div {
  pointer-events: unset !important;
  user-select: text !important;
  -webkit-user-select: text !important;
}
.ytp-caption-segment {
	cursor: text !important;
}
`;
  document.head.appendChild(style);
})();
