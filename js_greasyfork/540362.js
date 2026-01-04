// ==UserScript==
// @name        Layout Rearrange
// @namespace   Violentmonkey Scripts
// @match       https://game8.jp/stellar-blade/*
// @grant       none
// @version     1.0
// @author      Whiter
// @description 2025/6/22 上午11:02:53
// @downloadURL https://update.greasyfork.org/scripts/540362/Layout%20Rearrange.user.js
// @updateURL https://update.greasyfork.org/scripts/540362/Layout%20Rearrange.meta.js
// ==/UserScript==


var style = document.createElement('style');
style.innerHTML = `
  .l-content > .l-3col {
    display: flex;
  }

  .l-3colMain, .l-3colMain__center {
    width: 100%;
  }

  .l-3colMain {
    position: relative;
  }

  .l-3colMain__left {
    position: absolute;
    left: -220px;
  }
`
document.body.appendChild(style);
