// ==UserScript==
// @name        Shortcut to toggle Watchlist - tradingview.com
// @namespace   Violentmonkey Scripts
// @match       https://www.tradingview.com/chart/*/
// @grant       none
// @version     1.0
// @author      -
// @description 11/17/2023, 8:26:39 PM
// @require https://cdn.jsdelivr.net/npm/@violentmonkey/shortcut@1
// @downloadURL https://update.greasyfork.org/scripts/480160/Shortcut%20to%20toggle%20Watchlist%20-%20tradingviewcom.user.js
// @updateURL https://update.greasyfork.org/scripts/480160/Shortcut%20to%20toggle%20Watchlist%20-%20tradingviewcom.meta.js
// ==/UserScript==

// Toggle watch when command|window key + letter b is clicked.
// Just change m-b to your desired key combo.
// To find the key combo,
// 1. go to https://violentmonkey.github.io/vm-shortcut/
// 2. Press your key combo
// 3. The webpage will show the key combo. Copy that and replace 'm-b'
VM.shortcut.register('m-b', () => {
  document.querySelector('[aria-label="Watchlist, details and news"]').click();
});
