// ==UserScript==
// @name         skyscrapercity.com large images fix
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Fix the layout problem caused by large images on skyscrapercity.com
// @author       Anonymous
// @match        http://www.skyscrapercity.com/showthread.php*
// @match        https://www.skyscrapercity.com/showthread.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389183/skyscrapercitycom%20large%20images%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/389183/skyscrapercitycom%20large%20images%20fix.meta.js
// ==/UserScript==

// org:
// https://greasyfork.org/en/scripts/33460-skyscrapercity-com-large-images-fix

// greasemonkey4 jest wredny :/ i wywlalił @grant GM_addStyle
// based on https://github.com/greasemonkey/gm4-polyfill/blob/master/gm4-polyfill.js
function GM_addStyle(aCss) {
    var head = document.getElementsByTagName('head')[0];
    if (head) {
      var style = document.createElement('style');
      style.setAttribute('type', 'text/css');
      style.textContent = aCss;
      head.appendChild(style);
      return style;
    }
    return null;
}

GM_addStyle('.alt1 img { max-width: 99%; max-height: 720px; }');
 