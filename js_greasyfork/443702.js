// ==UserScript==
// @name         IndeXXX -  Search -  HI-RES Pics v.3
// @description  Higher resolution thumbnails in search results
// @version      3.2
// @author       Janvier56
// @namespace    https://greasyfork.org/users/7434
// @icon        https://www.indexxx.com/apple-touch-icon.png
// @include      https://www.indexxx.com/*
// @license       unlicense
// @downloadURL https://update.greasyfork.org/scripts/443702/IndeXXX%20-%20%20Search%20-%20%20HI-RES%20Pics%20v3.user.js
// @updateURL https://update.greasyfork.org/scripts/443702/IndeXXX%20-%20%20Search%20-%20%20HI-RES%20Pics%20v3.meta.js
// ==/UserScript==

// SMALL :
//<img class="photo-element" loading="lazy" src="https://img.indexxx.com/images/thumbs/85x85/models/ilona-a-295873.jpg" title="Ilona A">

// BIG ORIGNAL:
//<img src="https://img.indexxx.com/images/models/sabina-dimitra-1318746.jpg">


$('.floatingElementsContainer.d-flex.flex-wrap .photo-element').attr('src', function(i, val) {
    return val.replace('/images/thumbs/85x85/', '/images/')
});

// SET
// SMALL - .photoSection.card-img-top.d-flex.align-items-end.justify-content-center>div>img
//img src="https://img.indexxx.com/images/thumbs/160x181/sets/813001-goddessnudes.jpg"
// BIG ORIGNAL:
//<img class="hoverImg" src="https://img.indexxx.com/images/sets/812373-domai.jpg">
$('.photoSection.card-img-top.d-flex.align-items-end.justify-content-center>div>img').attr('src', function(i, val) {
    return val.replace('/images/thumbs/160x181/', '/images/')
});

// add CSS
$('head').append(`
<style type='text/css'>
/* === IndeXXX -  Search -  HI-RES Pics - v.3.65 ==== */

.floatingElementsContainer.d-flex.flex-wrap  .modelPanel.card.border-0.text-center.align-items-center {
    background: rgba(0, 0, 0, 0.07) !important;
    border: 1px solid #333 !important;
}


.floatingElementsContainer.d-flex.flex-wrap .d-flex.card-img.align-items-end.justify-content-center a {
    display: inline-block !important;
    height: 100% !important;
    min-height: 100% !important;
    max-height: 100% !important;
    width: 100% !important;
    min-width: 100% !important;
    max-width: 100% !important;
/*border: 1px solid aqua !important;*/
}
.floatingElementsContainer.d-flex.flex-wrap .d-flex.card-img.align-items-end.justify-content-center a img.photo-element {
    display: inline-block !important;
    height: 100% !important;
    min-height: 100% !important;
    max-height: 100% !important;
    width: 100% !important;
    min-width: 100% !important;
    max-width: 100% !important;
    background-repeat: no-repeat !important;
background-size: contain !important;
background-position: center center !important;
background-color: #111 !important;
object-fit: contain !important;
/* border: 1px solid yellow !important; */
}

/*=== END == IndeXXX -  Search -  HI-RES Pics ==== */
}
</style>
`)

    console.log('IndeXXX Hight: CSS added')