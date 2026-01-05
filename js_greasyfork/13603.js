// ==UserScript==
// @name           Penis for Twitter
// @namespace      tuxproject.de
// @description    Replaces the "Favorite" heart by a penis.
// @description:de Ersetzt das "Gefällt mir"-Herz durch einen Penis.
// @author         @tux0r
// @license        WTFPL; http://wtfpl.net/txt/copying
// @version        1
// @include        /^https?://(www\.)?twitter\.com/.*?$/
// @downloadURL https://update.greasyfork.org/scripts/13603/Penis%20for%20Twitter.user.js
// @updateURL https://update.greasyfork.org/scripts/13603/Penis%20for%20Twitter.meta.js
// ==/UserScript==

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

addGlobalStyle('.HeartAnimation { background-image: url(http://tuxproject.de/projects/TwitterPenis/penis.png) !important; }');