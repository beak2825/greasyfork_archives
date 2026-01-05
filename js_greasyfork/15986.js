// ==UserScript==
// @name        VOLKS Yen Converter
// @namespace   pendevin
// @description converts stuff on things
// @include     http://www.volks.co.jp/page_ex.jsp*
// @include     https://www.volks.co.jp/page_ex.jsp*
// @version     1.2
// @grant       GM_xmlhttpRequest
// @grant       GM_setValue
// @grant       GM_getValue
// @require     http://code.jquery.com/jquery-2.1.4.min.js
// @downloadURL https://update.greasyfork.org/scripts/15986/VOLKS%20Yen%20Converter.user.js
// @updateURL https://update.greasyfork.org/scripts/15986/VOLKS%20Yen%20Converter.meta.js
// ==/UserScript==

//mayb mandarake uses jquery idk
this.$ = this.jQuery = jQuery.noConflict(true);

//greasemonkey friendly ajax. requires @grant GM_xmlhttpRequest and jquery
var XHR = {
	//sends the XHR request then parses the json and runs callback on the returned object.
	json: function(url, callback, optional) {
		if (optional == undefined) {
			optional = null;
		}
		GM_xmlhttpRequest({
			method: 'GET',
			url: url,
			onload: function(r) {
				callback($.parseJSON(r.responseText), optional);
			}
		});
	}
};

//adds a style to a document and returns the style object *JQUERY
//css is a string, id is an optional string that determines the object's id
function addStyle(css, id) {
	//create a style
	var style = $('<style type="text/css">');
	//add the css data to it
	style.html(css);
	if (id) {
		//remove any style that has our id
		$('#' + id).remove();
		//give our style the id after removing the other stuff. idk if it matters, but i'm too lazy to find out
		style.attr('id', id);
	}
	//add the style into the head
	$('head').append(style);
	//we're outta here
	return style;
}

var css = "\
	.convertedPrice{\
		font-size:13px!important;\
		font-weight:bold;\
	}\
";
addStyle(css);

//actually converts the prices and adds them to our page
function applyConversions() {
	//multiply by the magic number
	$(jpys).each(function(i, jpy) {
		usds.push((jpy * conversion).toFixed(2));
	});

	//insert our conversions
	prices.each(function(i, price) {
		$(price).append('<span class="convertedPrice"> ($' + usds[i] + ')</span>');
	});
}

//find our prices
var jpys = [];

//grab our prices
var prices = $('#itmPrc, .icMdvnView0 + h5');
prices.each(function(i, raw) {
	var price = $(raw).text();
	//hopefully this consistently gets rid of all that whitespace plus the extra text
	price = parseInt(price.match(/([\d\,]+)\s?(yen|円)/)[1].replace(',', ''));
	jpys.push(price);
});

//get conversion rate
var conversion = parseFloat(GM_getValue('conversion', '.01'));
var now = Date.now();
var conversionDate = parseInt(GM_getValue('date', Date.now() - 30 * 60 * 1000 - 1));

var usds = [];
//only grab a new conversion rate every 30 minutes so we don't get banned
if (conversionDate + 30 * 60 * 1000 < now) {
	XHR.json('http://free.currencyconverterapi.com/api/v3/convert?q=USD_JPY&compact=ultra', function(r) {
		conversion = 1 / r["USD_JPY"];
		//save our conversion data
		GM_setValue('conversion', conversion);
		GM_setValue('date', now);
		//insert our conversions
		applyConversions();
	});
}
//using a known conversion rate
else {
	//insert our conversions
	applyConversions();
}
