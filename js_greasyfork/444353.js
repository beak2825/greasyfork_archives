// ==UserScript==
// @name        TUM Live Auto-Dark
// @namespace   Violentmonkey Scripts
// @match       https://live.rbg.tum.de/*
// @grant       none
// @version     0.1
// @author      Max Lang
// @license     0BSD
// @description Automatically switches between light and dark mode on TUM Live.
// @downloadURL https://update.greasyfork.org/scripts/444353/TUM%20Live%20Auto-Dark.user.js
// @updateURL https://update.greasyfork.org/scripts/444353/TUM%20Live%20Auto-Dark.meta.js
// ==/UserScript==

/*
License (BSD Zero Clause License):
Copyright (C) 2022 by Max Lang
Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted.
THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR
CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT,
NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
*/

(function() {
  function isDarkColorScheme() {
    let isDark = localStorage.getItem('darkTheme');
    if (isDark == null) { localStorage.setItem('darkTheme', JSON.stringify(true)); isDark = true; }
    return JSON.parse(isDark ?? 'true');
  }
  function updateColorScheme() {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches != isDarkColorScheme())
      global.toggleColorScheme();
  }

  const style = document.createElement('style');
  style.textContent = '.tum-live-auto-dark-hidden { display: none; }';
  document.head.appendChild(style);

  document.querySelectorAll('[title="Toggle color scheme"]')
    .forEach(n => n.classList.add('tum-live-auto-dark-hidden'));

  updateColorScheme();
  window.matchMedia("(prefers-color-scheme: dark)")
    .addEventListener('change', () => updateColorScheme());
})();
