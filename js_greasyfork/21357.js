// ==UserScript==
// @name        Marktplaats Clean and Fast 2.0
// @namespace   jex
// @include     *marktplaats.nl*
// @grant       none
// @version     2.4.1
// @description Verwijderd alle commerciële partijen en geeft marktplaats weer terug aan de particulieren.
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.6/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/21357/Marktplaats%20Clean%20and%20Fast%2020.user.js
// @updateURL https://update.greasyfork.org/scripts/21357/Marktplaats%20Clean%20and%20Fast%2020.meta.js
// ==/UserScript==


// REMOVING ADDS AND DISTRACTIONS
// Adds are gettign really out of hand at Marktplaats.

// Remove 'Topadvertenties' (by pettenstein - jquery)
$("span.mp-listing-priority-product:contains('Topadvertentie')").parent().parent().parent().remove();
$("span.mp-listing-priority-product:contains('Dagtopper')").parent().parent().parent().remove();
$("td.inline-listings-banner").parent().remove();

// Remove stupid saved searches widget
$("#saved-searches-widget.saved-searches-widget").remove();

// Remove ads with "gezocht"
$("span.mp-listing-title.wrapped:contains('Gezocht')").parent().parent().parent().parent().parent().remove();
$("div.listing-title-description:contains('Gezocht')").parent().parent().parent().remove();

// Remove Admarkt zut
$("#bottom-listings-divider").remove();
$("tr.bottom-listing").remove();
$("#adsense-top.adsense-block").remove();
$("#adsense-bottom.adsense-block").remove();
$("div.row.bottom-group-1.search-result.bottom-listing.listing-cas").remove();
$("div.row.bottom-group-0.search-result.bottom-listing.listing-cas").remove();
$("div.mp-adsense-header-top").remove();
$("#superCasContainerTop.adsense-csa").remove();

// --Search results page, list tab
$('.listing-cas').remove();
$('#saved-searches-widget').remove();
$('#adsenceContainerTop').remove();
$('.adsense-csa').remove();
$('#cookie-opt-in-footer').remove();
$('.price-discount').parent().parent().parent().parent().remove();

// Remove adds from Foto's tab
$("div[data-bubble-model*='Bezorgt in']" ).parent().remove();
$("#bottom-listings-divider").remove();
$(".bottom-item").remove();

// Item Detail page
$('.premium-content').remove();
$('.cas-other-items').remove();
$('.mp-adsense-header').css({'display':'none'});
$('#footer').remove();
$('#banner-mr').remove();
$('#action-block-banners').remove();

// Home page
$('.aanbieding-widget-container').remove();
$('#banner-marketing').remove();
$('#home-footer').remove();


// USABILITY / SPEED MODIFICATIONS
// Decreasing the number of clicks and mouse movements needed.


$('.mp-SearchForm-options.mp-header').css({
    'max-height': '60px'
});

$('.mp-SearchForm-options.mp-SearchForm-options-right.mp-header').css({
    'text-align': 'left'
});

// --Search results page


// Slightly increases the size of images on the search results list page. Also check out the "Foto's" tab.
$('.column-thumb').css({
    'float': 'left',
    'width': 'auto',
    'height': 'auto',
    'max-height': 'none'
});
$('.listing-image').css({
    'width': 'auto',
    'height': 'auto',
    'max-height': 'none'
});
$('.listing-image img').css({
    'width': 'auto',
    'height': 'auto',
    'max-height': 'none',
    'max-width': 'none',
    'margin-right': '10px'
});


// --Item detail page

// Show phonenumber
$('.phone-link').css({'text-overflow':'inherit','overflow':'visible'});
$('.show-phonenumber').remove();


// OTHER

// Remove banners
$('#banner-skyscraper').remove();
$('#banner-bottom').remove();
$('#google_image_div').remove();
$('.split-skyscrapers').remove();
$('#banner-vipleft').remove();
$('#banner-vipbottom').remove();
$('#banner-top').remove();
$('#banner-viptop').remove();
$('#banner-viptop').css({'display':'none'});
$('#banner-rubrieks').remove();

// Remove ads with "Heel Nederland". Thanks to CookieFootsie
$(".cas-listing-location:contains('Heel Nederland')").parent().parent().parent().remove();
$("div.location-name:contains('Heel Nederland')").parent().parent().parent().parent().remove();
$(".location-name:contains('Bezorgt in')").parent().parent().parent().parent().remove();
$("span.mp-listing-priority-product:contains('Dagtopper')").parent().parent().parent().remove();

// Remove ads with thumbs-up icon
$("span.icon-thumb-up").parent().parent().parent().remove();
$("span.thumb").parent().parent().parent().parent().remove();

// Remove ads with other ads of same buyer cause it's mostly commercial
$("div.listing-extension").parent().remove();
$("TR.search-result.horizontalRichSnippet.group-0").remove();
$("TR.search-result.horizontalRichSnippet.group-1").remove();
$("TR.horizontal-extended-listing.group-0").remove();
$("TR.horizontal-extended-listing.group-1").remove();

// remove cookie notice footer (black bar at bottom)
var CookieFoetsie = document.getElementById('layover-target');
CookieFoetsie.parentElement.removeChild(CookieFoetsie);