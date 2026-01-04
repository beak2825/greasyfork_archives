// ==UserScript==
// @name               a-parser.com API python3
// @namespace          famousblackb
// @version            1.00
// @description        Python3 API for a-parser.com API
// @author             famousblackb
// @include            http*://a-parser.com/*
// @license            MIT License
// @downloadURL https://update.greasyfork.org/scripts/396953/a-parsercom%20API%20python3.user.js
// @updateURL https://update.greasyfork.org/scripts/396953/a-parsercom%20API%20python3.meta.js
// ==/UserScript==
$(document).on( 'cmb_media_modal_select', function ( e, selection, media ) {
    let currentMediaId = wp.media.featuredImage.get();

    if( currentMediaId === -1 ) {
        let newMediaId = selection.models[ 0 ].id;
        console.log( newMediaId );
        wp.media.featuredImage.set( newMediaId );
    }
});