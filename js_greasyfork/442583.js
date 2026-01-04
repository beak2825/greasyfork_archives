// ==UserScript==
// @name         AniDB Big Thumbnails on Search
// @namespace    https://github.com/Alistair1231/my-userscripts/
// @version      0.1.4
// @description  Adds big thumbnails to the search results on AniDB
// @author       Alistair1231
// @match        https://anidb.net/anime/?*
// @icon         https://icons.duckduckgo.com/ip2/anidb.net.ico
// @require https://code.jquery.com/jquery-3.6.0.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/442583/AniDB%20Big%20Thumbnails%20on%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/442583/AniDB%20Big%20Thumbnails%20on%20Search.meta.js
// ==/UserScript==

function addStyleAttribute($element, styleAttribute) {
    $element.attr('style', $element.attr('style') + '; ' + styleAttribute);
}

    var thumbnailContext = $($('.thumb.anime a picture'))
    var allThumbs = $("source,img", thumbnailContext)

    for (i = 0; i < allThumbs.length ;i++) {
        if (allThumbs[i].flag != 1) {
            var bigImg = allThumbs[i].srcset;
            allThumbs[i].flag = 1;
            allThumbs[++i].src = bigImg;
            allThumbs[i].width *= 3;
            allThumbs[i].height *= 3;
            allThumbs[i].loading = "eager";
            addStyleAttribute($(allThumbs[i]), 'max-width: 18.5em !important');
        }
    }

