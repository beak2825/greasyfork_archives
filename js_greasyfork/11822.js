// ==UserScript==
// @name        Marktplaats Clean and Fast
// @namespace   Doesntmatter2015
// @include     http://www.marktplaats.*/*
// @grant       none
// @version     2.0
// @description Speeds up the use of Marktplaats by removing adds and streamlining display. Combines parts from other scripts, thanks to their authors.
// @downloadURL https://update.greasyfork.org/scripts/11822/Marktplaats%20Clean%20and%20Fast.user.js
// @updateURL https://update.greasyfork.org/scripts/11822/Marktplaats%20Clean%20and%20Fast.meta.js
// ==/UserScript==

// LOADING JQUERY

function addJQuery(callback) {
  var script = document.createElement("script");
  script.setAttribute("src", "//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js");
  script.addEventListener('load', function() {
    var script = document.createElement("script");
    script.textContent = "window.jQ=jQuery.noConflict(true);(" + callback.toString() + ")();";
    document.body.appendChild(script);
  }, false);
  document.body.appendChild(script);
}

// the guts of this userscript
function main() {
  // Note, jQ replaces $ to avoid conflicts.


// REMOVING ADDS AND DISTRACTIONS
// Adds are gettign really out of hand at Marktplaats.

var alliFrames, thisiFrame;
alliFrames = document.getElementsByTagName('iframe');
for (var i = 0; i < alliFrames.length; i++) {
    thisiFrame = alliFrames[i];
    // do something with iFrame
	thisiFrame.width = 0;
	thisiFrame.height = 0;
}


// --Search results page, list tab
jQ('.listing-cas').remove();
jQ('#banner').remove();
jQ('#banner-top').remove();
jQ('#banner-viptop').remove();
jQ('#banner-viptop').css({'display':'none'})
jQ('#saved-searches-widget').remove();
jQ('#banner-rubrieks').remove();
jQ('#adsenceContainerTop').remove();
jQ('.ad').remove();
jQ('.adsense-csa').remove();
jQ('.adsense-top').remove();
jQ('.adsense-block').remove();
jQ('#adsense-top').remove();
jQ('.admarkt-cards').remove();
jQ('.adsense-bottom').remove();
jQ('#cookie-opt-in-footer').remove();
jQ('.bottomlisting').remove();
jQ('#clickthrough').remove();
jQ('#adBlock').remove();
jQ('#googleActiveViewClass').remove();

// Remove adds from Foto's tab
jQ("div[data-bubble-model*='Bezorgt in']" ).parent().remove();
jQ("#bottom-listings-divider").remove();
jQ(".bottom-item").remove();

// Item Detail page
jQ('.premium-content').remove();
jQ('.cas-other-items').remove();
jQ('.mp-adsense-header').css({'display':'none'});
jQ('#footer').remove();
jQ('#banner-mr').remove();
jQ('#action-block-banners').remove();

// Home page
jQ('.aanbieding-widget-container').remove();
jQ('#banner-marketing').remove();
jQ('#home-footer').remove();



// USABILITY / SPEED MODIFICATIONS
// Decreasing the number of clicks and mouse movements needed.

// --Search results page, list tab

// Slightly increases the size of images on the search results list page. Also check out the "Foto's" tab.
jQ('.column-thumb').css({
    'float': 'left',
    'width': 'auto',
    'height': 'auto',
    'max-height': 'none'
});
jQ('.listing-image').css({
    'width': 'auto',
    'height': 'auto',
    'max-height': 'none'
});
jQ('body').css({
    'background-color': '#ff0000'
});
jQ('.listing-image img').css({
    'width': 'auto',
    'height': 'auto',
    'max-height': 'none',
    'max-width': 'none',
    'margin-right': '10px'
});


// --Item detail page

// Repositions the price-tag to the top-left for quick vertical scanning. A bit hacky..
jQ('#vip-action-block').css({'width':'1%','background-color':'white','position':'relative','left':'-99%'});
jQ('#vip-gallery').css({'width':'99%','padding-top':'60px','margin-right':'0'});
jQ('#vip-ad-shipping-cost').css({'width':'400px'});
jQ('#vip-ad-shipping-cost').children('div').remove();
jQ('#vip-ad-price-container').css({'width':'400px'});

// Shows all pictures underneath eachother, so they quickly be scrolled past. Faster than mouse-over on small icons.
jQ('.image-viewer-wrapper .image img').css({
    'width': 'auto',
    'height': 'auto',
    'max-height': 'none',
    'max-width': '100%',
    'border':'none'
});
jQ('.image-viewer-wrapper .image').css({
    'display': 'block'
});
jQ('.image-viewer-wrapper .image-viewer').css({'overflow':'visible'})

jQ('#large-image-viewer .image img').css({
    'width': 'auto',
    'height': 'auto',
    'max-height': 'none',
    'max-width': 'none'
});
jQ('#vip-carousel').remove();

// Show phonenumber
jQ('.phone-link').css({'text-overflow':'inherit','overflow':'visible'})
jQ('.show-phonenumber').remove();


// OTHER

// Remove ads with "Heel Nederland". Thanks to CookieFootsie
jQ(".cas-listing-location:contains('Heel Nederland')").parent().parent().parent().remove();
jQ(".cas-listing-location:contains('Bezorgt in')").parent().parent().parent().remove();
    
    
    
} // Now closing the main part of the script in which jQuery does its thing.

// load jQuery and execute the main function
addJQuery(main);    