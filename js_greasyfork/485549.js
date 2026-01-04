// ==UserScript==
// @name        NG Replacer
// @namespace   Violentmonkey Scripts
// @match       *://twitter.com/*
// @match       *://x.com/*
// @grant       none
// @version     1.02
// @author      critatonic
// @description On Twitter, replaces the NG emoji with a Newgrounds tank.
// @icon        https://i.ibb.co/7y2RxLR/ngemoji.png
// @run-at      document-idle
// @require     https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2
// @downloadURL https://update.greasyfork.org/scripts/485549/NG%20Replacer.user.js
// @updateURL https://update.greasyfork.org/scripts/485549/NG%20Replacer.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const disconnect = VM.observe(document.body, () => {
    // Find the target node
    const node = document.querySelector(`img[src="${'https://abs-0.twimg.com/emoji/v2/svg/1f196.svg'}"]`);

    if (node) {
      node.src = "https://pbs.twimg.com/media/GEp6U85a0AAOf7o?format=png&name=orig";
    }
  })
})();