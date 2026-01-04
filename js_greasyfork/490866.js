// ==UserScript==
// @name         Last.fm Colored Tags
// @namespace    http://thlayli.detrave.net
// @description  Colorizes the tags shown on artist and album pages
// @icon         https://www.google.com/s2/favicons?sz=64&domain=last.fm
// @require      https://greasyfork.org/scripts/383527-wait-for-key-elements/code/Wait_for_key_elements.js?version=701631
// @require      https://code.jquery.com/jquery-1.9.0.min.js
// @match        https://www.last.fm/*
// @version      1.1.1
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/490866/Lastfm%20Colored%20Tags.user.js
// @updateURL https://update.greasyfork.org/scripts/490866/Lastfm%20Colored%20Tags.meta.js
// ==/UserScript==

function main_func() {

    function convertRange( value, r1, r2 ) {
        return ( value - r1[ 0 ] ) * ( r2[ 1 ] - r2[ 0 ] ) / ( r1[ 1 ] - r1[ 0 ] ) + r2[ 0 ];
    }

    function stringToColor (string, saturation = 50, lightness = 50) {
        let hash = 0;
        for (let i = 0; i < string.length; i++) {
            hash = string.charCodeAt(i) + ((hash << 5) - hash);
            hash = hash & hash;
        }
        return `hsl(${(hash % 360)}, ${saturation}%, ${lightness}%)`;
    }

    $(".catalogue-tags .tag").each(function (i, el) {
        var color = stringToColor(el.textContent);
        $("a",this).css("color","white").css("background-color",color).css("box-shadow","none");
    });

};

waitForKeyElements(".catalogue-tags", main_func);