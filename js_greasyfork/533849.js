// ==UserScript==
// @name        Add Google Images Link to Mullvad Search
// @namespace   Violentmonkey Scripts
// @match       https://leta.mullvad.net/search*
// @grant       none
// @version     1.0
// @author      -
// @description 4/24/2025, 2:53:21 PM
// @license unlicense
// @downloadURL https://update.greasyfork.org/scripts/533849/Add%20Google%20Images%20Link%20to%20Mullvad%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/533849/Add%20Google%20Images%20Link%20to%20Mullvad%20Search.meta.js
// ==/UserScript==

function ready(fn) {
    if (document.readyState !== 'loading') {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

ready(function() {
  setTimeout(function() {
    const searchText = document.getElementById('search').value;

    const parent = document.getElementsByClassName('radio-group')[0];
    const link = document.createElement('label');
    link.className = 'svelte-535pip';
    link.href = 'https://images.google.com';
    link.innerText = 'Google Images';
    link.onclick = function() {
      location.href = 'https://www.google.com/search?udm=2&q='+encodeURIComponent(searchText);
    }
    parent.appendChild(link);
  }, 200);
});