// ==UserScript==
// @name         SplitScreenTranslateHalf
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Split the screen but only allow one iframe to be translated.
// @author       daydreamorama
// @match        http://*/*
// @include     *://archiveofourown.org/*works/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/480976/SplitScreenTranslateHalf.user.js
// @updateURL https://update.greasyfork.org/scripts/480976/SplitScreenTranslateHalf.meta.js
// ==/UserScript==


// I stole this from a 2011 script that didn't work anymore.
if (window.top == window) {
    /* Get current location */
    var loc = window.location + "";

    /*
         * The contents won't be loaded if the location of the iframe is exactly
         * the same as the main document (that's probably to protect against
         * infinite nesting of iframes), so we need to modify it slightly.
         */
    if (loc.match(/\?/))
        loc = loc.replace(/\?/, '?%20=&');
    else
        loc = loc + '?';

    document.documentElement.innerHTML =  '<head></head>' +
        '<body><iframe id="f1" translate=no></iframe><iframe id="f2"></iframe>' +
        '<div id="ov">&nbsp;</div></body>';

    var body = document.querySelector('body'),  /* Document body */
        f1 = document.querySelector('#f1'),     /* First iframe */
        f2 = document.querySelector('#f2'),     /* Second iframe */
        ov = document.querySelector('#ov');     /* Overlay */

    f1.src = f2.src = loc;

    body.style.margin="0"
    body.style.padding="0"
    body.style.height="100%"
    body.style.width="100%"
    body.style.background="#bbb"
    body.style.overflow="hidden"

    f1.style.width="50%"
    f1.style.height="100%"
    f1.style.border=f2.style.border="none"
    f1.style.left="0%"
    f1.style.position="absolute"

    f2.style.width="50%"
    f2.style.height="100%"
    f2.style.left="50%"
    f2.style.position="absolute"
   // f2.style.borderRight="solid 1px #ddd"

    ov.style.height="100%"
    ov.style.width="100%"
    ov.style.position="absolute"
    ov.style.zindex="999"
    ov.style.display="none"


}

