// ==UserScript==
// @name        quora-adblock
// @description Quora adblock
// @namespace   tz
// @include     https://www.quora.com/*
// @version     7
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/400511/quora-adblock.user.js
// @updateURL https://update.greasyfork.org/scripts/400511/quora-adblock.meta.js
// ==/UserScript==

const func = () => {
  var removed = 0;
  for (let el of document.querySelectorAll('.advertiser_endpoint')) {
    for (let i = 0; i < 8; ++i) {
      el = el.parentNode;
    }
    el.parentNode.removeChild(el);
    removed++;
  }

  if (!removed) {
    window.setTimeout(func, 1000);
  }
};

func();

var style = document.createElement('style');
style.innerHTML = `
  div[style*=blur], .signup_wall_prevent_scroll, #root {
    filter: none !important;
    overflow: scroll;
  }
  .qu-zIndex--modal_desktop, div[id*=signup_wall] {
    display: none !important;
  }
`;
document.head.appendChild(style);
