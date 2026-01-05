// ==UserScript==
// @name        AMZONsampleADDER
// @namespace   Andrew
// @description Adds send sample button after amazon links (FOR BOOKS)
// @include     http://www.amazon.com.au/*
// @version     1
// @require     http://code.jquery.com/jquery-latest.min.js
// @grant       GM_log
// @downloadURL https://update.greasyfork.org/scripts/10432/AMZONsampleADDER.user.js
// @updateURL https://update.greasyfork.org/scripts/10432/AMZONsampleADDER.meta.js
// ==/UserScript==

// adapted from https://greasyfork.org/en/scripts/6862-ch-amazon-asin-adder


// create :childof selector - from http://andreasnylin.com/blog/2011/09/jquery-not-child-of/
$.expr[':'].childof = function(obj, index, meta, stack){
    return $(obj).parent().is(meta[3]);
};

// create variables for sample request so far i havnt implemented scraping so youll have to fin them on your own. HINT just go to the sample request link and see what they are.
//
//!!!!RIGHT HERE!!!!
//
var name = '';
var Name = '';
var device = '';

// get the ASIN
function getASIN(href) {
  var asinMatch;
  asinMatch = href.match(/\/exec\/obidos\/ASIN\/(\w{10})/i);
  if (!asinMatch) { asinMatch = href.match(/\/gp\/product\/(\w{10})/i); }
  if (!asinMatch) { asinMatch = href.match(/\/exec\/obidos\/tg\/detail\/\-\/(\w{10})/i); }
  if (!asinMatch) { asinMatch = href.match(/\/dp\/(\w{10})/i); }
  if (!asinMatch) { return null; }
  return asinMatch[1];
}

// add ASIN after most absolute product links that aren't an image, price, or Other Colors link
$('a[href*="www.amazon.com.au/"]').not(':has(img)').not(':has(span.a-color-secondary)').not(':has(span.s-price)').not(':childof(td.toeOurPrice)').each(function(){
	var asin = getASIN( $(this).attr('href') );
	if (asin != null) {
		$(this).after(' <a href="http://www.amazon.com.au/gp/digital/' + name + '/clarification/sample-downloaded?ie=UTF8&action=&asin=' + asin + '&target' + Name + '=' + device + '">&ndash; <span style="color:rgb(130, 130, 130)"> Send Sample </span> </a>');
	}
});

// add ASIN after most relative product links that aren't an image, price, Other Colors, Try Prime, or Buy Kindle link
$('a[href^="/gp/product/"]').not(':has(img)').not(':has(span.a-color-secondary)').not(':has(span.s-price)').not(':childof(td.toeOurPrice)').not('a.nav-prime-try').not('a.nav-link-prime').not(':contains("Buy a Kindle")').each(function(){
	var asin = getASIN( $(this).attr('href') );
	if ( (asin != null) && (asin != 'B00DBYBNEE') )  {
		$(this).after(' <a href="http://www.amazon.com.au/gp/digital/' + name + '/clarification/sample-downloaded?ie=UTF8&action=&asin=' + asin + '&target' + Name + '=' + device + '">&ndash; <span style="color:rgb(130, 130, 130)"> Send Sample </span> </a>');
	}
});

// add ASIN after top-of-page product title on individual product pages
$('span#productTitle').each(function(){
	var asin = getASIN( document.location.href );
	if (asin != null) {
		$(this).after(' <a href="http://www.amazon.com.au/gp/digital/' + name + '/clarification/sample-downloaded?ie=UTF8&action=&asin=' + asin + '&target' + Name + '=' + device + '">&ndash; <span style="color:rgb(130, 130, 130)"> Send Sample </span> </a>');
	}
});
$('span#btAsinTitle').each(function(){
	var asin = getASIN( document.location.href );
	if (asin != null) {
		$(this).after(' <a href="http://www.amazon.com.au/gp/digital/' + name + '/clarification/sample-downloaded?ie=UTF8&action=&asin=' + asin + '&target' + Name + '=' + device + '">&ndash; <span style="color:rgb(130, 130, 130)"> Send Sample </span> </a>');
	}
});

// add ASIN after relative product links in carousels (first page only) on individual product pages
$('li.a-carousel-card > div.a-section > a.a-link-normal').each(function(){
	var asin = getASIN( $(this).attr('href') );
	if (asin != null) {
		$(this).after(' <a href="http://www.amazon.com.au/gp/digital/' + name + '/clarification/sample-downloaded?ie=UTF8&action=&asin=' + asin + '&target' + Name + '=' + device + '">&ndash; <span style="color:rgb(130, 130, 130)"> Send Sample </span> </a>');
	}
});

// add ASIN after relative product links in 'after viewing this item' at bottom of individual product pages
$('div.asinDetails > a').each(function(){
	var asin = getASIN( $(this).attr('href') );
	if (asin != null) {
		$(this).after(' <a href="http://www.amazon.com.au/gp/digital/' + name + '/clarification/sample-downloaded?ie=UTF8&action=&asin=' + asin + '&target' + Name + '=' + device + '">&ndash; <span style="color:rgb(130, 130, 130)"> Send Sample </span> </a>');
	}
});

// add ASIN after relative product links in 'more to explore' on bestsellers pages
$('div.zg_more_item > a').each(function(){
	var asin = getASIN( $(this).attr('href') );
	if (asin != null) {
		$(this).after(' <a href="http://www.amazon.com.au/gp/digital/' + name + '/clarification/sample-downloaded?ie=UTF8&action=&asin=' + asin + '&target' + Name + '=' + device + '">&ndash; <span style="color:rgb(130, 130, 130)"> Send Sample </span> </a>');
	}
});