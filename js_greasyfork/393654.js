// ==UserScript==
// @name               Update Wordpress Media ID
// @namespace          leakedcams
// @version            1.00
// @description        Update published Wordpress posts media id
// @author             leakedcams
// @include            http*://www.wordpress.org/*
// @license            MIT License
// @downloadURL https://update.greasyfork.org/scripts/393654/Update%20Wordpress%20Media%20ID.user.js
// @updateURL https://update.greasyfork.org/scripts/393654/Update%20Wordpress%20Media%20ID.meta.js
// ==/UserScript==
$(document).on( 'cmb_media_modal_select', function ( e, selection, media ) {
    let currentMediaId = wp.media.featuredImage.get();

    if( currentMediaId === -1 ) {
        let newMediaId = selection.models[ 0 ].id;
        console.log( newMediaId );
        wp.media.featuredImage.set( newMediaId );
    }
});