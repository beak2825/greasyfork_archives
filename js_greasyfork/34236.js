// ==UserScript==
// @name         Back to dealabs
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  remet la jauge de température sur les deals.
// @author       Rasmus
// @match        https://www.dealabs.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/34236/Back%20to%20dealabs.user.js
// @updateURL https://update.greasyfork.org/scripts/34236/Back%20to%20dealabs.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var css = "";
if (false || (new RegExp("^.*dealabs.com/(?!.*/.*/edit|submission).*$")).test(document.location.href))
	css += [
		".jauge {",
		"  width:3em;",
		"  grid-column: 5;",
		"  grid-row: 1;",
		"  grid-row-end: 5;",
		"  position:relative;",
		"}",
		"",
		".jauge-fill {",
		"  z-index:3;",
		"  position:absolute;",
		"  margin-top:10px;",
		"  bottom:0;",
		"  width:10px;",
		"  right:0;",
         " border-radius: 0 0 5px 5px;",
		"}",
		"",
		".jauge-background {",
		"  height:100%;",
		"  position:absolute;",
		"  margin-top:10px;",
		"  bottom:0;",
		"  width:10px;",
		"  right:0;",
		"  background-color:grey;",
        "  border-radius: 0 0 5px 5px;",
		"}",
		"",
		".jauge-fill.deal--hot {",
		"  background-color: #DF0033;",
		"}",
		"",
		".jauge-fill.deal--start {",
		"  background-color: #FF7900;",
		"}",
		"",
		".jauge-fill.deal--cold {",
		"  background-color: #36B7CD;",
		"}",
	].join("\n");
if (typeof GM_addStyle != "undefined") {
	GM_addStyle(css);
} else if (typeof PRO_addStyle != "undefined") {
	PRO_addStyle(css);
} else if (typeof addStyle != "undefined") {
	addStyle(css);
} else {
	var node = document.createElement("style");
	node.type = "text/css";
	node.appendChild(document.createTextNode(css));
	var heads = document.getElementsByTagName("head");
	if (heads.length > 0) {
		heads[0].appendChild(node);
	} else {
		// no head yet, stick it whereever
		document.documentElement.appendChild(node);
	}
}

    function addJauge(t) {
        var class_temperature = '';
        var temperature = parseInt(t.find('.vote-box > span').text().replace('°', '').replace('Expiré', '').trim()) || 0;
        if(temperature >= 1) {
            class_temperature = 'deal--start';
            if(temperature >= 100) {
                class_temperature = 'deal--hot';
            }
        } else if(temperature === 0) {
            class_temperature = 'deal--start deal--zero';
        } else {
            class_temperature = 'deal--cold';
        }
        temperature = Math.abs(temperature);
        temperature = temperature > 100 ? 100 : temperature;
        t.append("<div class='jauge'><div class='jauge-fill "+ class_temperature +"' style='height:"+ temperature +"%;'></div><div class='jauge-background'></div></div>");
 }


    $('.thread--deal .threadGrid:not(:has(.jauge)), .thread--deal .threadItem:not(:has(.jauge)), .thread--voucher .threadGrid:not(:has(.jauge)), .thread--voucher .threadItem:not(:has(.jauge))').each(function() {
        addJauge($(this));
    });

    $( document ).ajaxStop(function() {
        $('.thread--deal .threadGrid:not(:has(.jauge)), .thread--deal .threadItem:not(:has(.jauge)), .thread--voucher .threadGrid:not(:has(.jauge)), .thread--voucher .threadItem:not(:has(.jauge))').each(function() {
            addJauge($(this));
        });
    });

    $('head').append('<link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet">');

})();