// ==UserScript==
// @name         Manganelo/Mangakalot, no image spacing
// @namespace    ;_;
// @version      0.3
// @description  Removes image spacing on reader
// @author       rawkins
// @include      /^https?:\/\/(?:www\.)?(manganelo\.com|mangakakalot\.com)(?:.*)$/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392156/ManganeloMangakalot%2C%20no%20image%20spacing.user.js
// @updateURL https://update.greasyfork.org/scripts/392156/ManganeloMangakalot%2C%20no%20image%20spacing.meta.js
// ==/UserScript==

function modifyCSS(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}
modifyCSS (
' .container-chapter-reader img { display:block !important; margin: 0px auto 0px !important; }'
);