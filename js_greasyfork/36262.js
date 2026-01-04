// ==UserScript==
// @name        InoReader Thumbnail Replacer
// @version     1.0
// @description Replace Thumbnails with full-sized images on Inoreader
// @include     http://inoreader.com/*
// @include     http://www.inoreader.com/*
// @include     https://inoreader.com/*
// @include     https://www.inoreader.com/*
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @require     https://greasyfork.org/scripts/5392-waitforkeyelements/code/WaitForKeyElements.js?version=115012
// @grant       GM_addStyle
// @namespace https://greasyfork.org/users/7864
// @downloadURL https://update.greasyfork.org/scripts/36262/InoReader%20Thumbnail%20Replacer.user.js
// @updateURL https://update.greasyfork.org/scripts/36262/InoReader%20Thumbnail%20Replacer.meta.js
// ==/UserScript==

waitForKeyElements (
    "#reader_pane div.article_full_contents div.article_content img",
    swapOutThumbnails
);

function swapOutThumbnails (jNode) {
    var imgSrc      = jNode[0].src;

    //-- The necessary regex changes depending on where the images are hosted.

    if (/staticflickr/.test (imgSrc) ) {
        /*-- Change src from:   https://*.staticflickr ... _m.jpg
                          to:   https://*.staticflickr ... _b.jpg
        */
        imgSrc      = imgSrc.replace (/_m\.jpg$/, "_b.jpg");
    }
    else if (/blogspot/.test (imgSrc) ) {
        imgSrc      = imgSrc.replace (/s400/, "s900");
    }
    else if (/amazonaws/.test (imgSrc) ) {
        /*-- Change src from:   https://*.amazonaws.com ... _6.jpg
                          to:   https://*.amazonaws.com ... _7.jpg
        */
        imgSrc      = imgSrc.replace (/_6\.jpg$/, "_7.jpg");
    }
    else if (/fbcdn\-photos/.test (imgSrc) ) {
        /*-- Change src from:   https://fbcdn-photos- ... _s.jpg
                          to:   https://fbcdn-sphotos- ... _
        */
        imgSrc      = imgSrc.replace (/fbcdn\-photos\-/, "fbcdn-sphotos-");
        imgSrc      = imgSrc.replace (/_s\.jpg$/, "_n.jpg");
    }
    else if (/pinimg\.com.*_b\.\w+$/.test (imgSrc) || /pinimg\.com\/192x\//.test (imgSrc) ) {
        /*-- Change src from:   http://*.pinimg.com/192x/...
                          to:   http://*.pinimg.com/550x/...
        */
        imgSrc      = imgSrc.replace(/\.com\/192x\//, ".com/550x/");
    }
    else if (/pinterest\.com.*_b\.\w+$/.test (imgSrc) || /pinterest\.com\/192x\//.test (imgSrc) ) {
        /*-- Change src from:   http://*.pinterest.com/192x/...
                          to:   http://*.pinterest.com/550x/...
        */
        imgSrc      = imgSrc.replace(/\.com\/192x\//, ".com/550x/");
    }

    jNode[0].src    = imgSrc;

    jNode[0].removeAttribute('width');
    jNode[0].removeAttribute('height');
    jNode[0].removeAttribute('style');
}