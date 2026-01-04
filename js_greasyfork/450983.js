// ==UserScript==
// @name                    Genius: Back to The Original Page Layout
// @namespace               https://greatalazar.github.io
// @version                 0.1
// @description             Automatically redirect to the old page layout, I have nothing but contempt for the "new genius page", With this we can go back to the old and cool page
// @author                  greatalazar
// @match                   https://genius.com/*lyrics
// @match                   https://genius.com/*annotated
// @icon                    https://www.google.com/s2/favicons?sz=64&domain=genius.com
// @grant                   none
// @license                 MIT
// @homepage                https://github.com/greatalazar/GeniusFix#readme
// @homepageURL             https://github.com/greatalazar/GeniusFix#readme
// @supportURL              https://github.com/greatalazar/GeniusFix/issues
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/450983/Genius%3A%20Back%20to%20The%20Original%20Page%20Layout.user.js
// @updateURL https://update.greasyfork.org/scripts/450983/Genius%3A%20Back%20to%20The%20Original%20Page%20Layout.meta.js
// ==/UserScript==

if (!window.location.href.endsWith('?bagon=1'))
{
  window.location.replace(window.location.href + '?bagon=1');
}