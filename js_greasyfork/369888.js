// ==UserScript==
// @name         Dynalist Image Resizer V1
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  A simple vanisher
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.11.2/jquery-ui.min.js
// @author       Vincent Tang
// @match        https://dynalist.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369888/Dynalist%20Image%20Resizer%20V1.user.js
// @updateURL https://update.greasyfork.org/scripts/369888/Dynalist%20Image%20Resizer%20V1.meta.js
// ==/UserScript==


$(document).ready(function() {
(function() {

    var startingMaxWidth = 150;
    var startingMaxHeight = 150;
    var css = [ //START OF STYLISH TEMPLATED FILE
	"/* i really want this to be global */",
	"",
  "/* Body color */",
	"#slider_wrap {",
    "	position: fixed;",
    "   left: 30px;",
    "   width: 100px;",
    "	top:8px;",
    "   z-index: 99999;",
	"}",
	"#currentSize {",
    "	position: fixed;",
    "   left: 140px;",
    "   width: 100px;",
    "	top:5px;",
    "   z-index: 99999;",
	"}",
    "/* this part doesn't actually work */",
	".node-displayed-image {",
    "	max-width:150px;",
    "	max-height: 150px;",
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
} // END OF STYLISH TEMPLATE FILE


$("head").append('<link rel="stylesheet" href="https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/themes/smoothness/jquery-ui.css">');
// Custom HTML injection
document.querySelector('header').innerHTML += '<div id="slider_wrap">'+
  '<div id="slider"></div>'+
  '</div>'+
  '<div id="currentSize"></div>';

$(function() {
    $( "#slider" ).slider({
        min: startingMaxWidth,
        max: 1200,
        value: 300
    });
    // Set it to an initial size (OPTIONAL)
    setTimeout(function(){
        $('.node-displayed-image').css('cssText', "max-width: " + startingMaxWidth + 'px !important;' + "max-height: "+ startingMaxHeight + 'px !important;');
    }, 2000);
    // Slider Controls
    $( "#slider" ).on( "slidechange", function( event, ui ) {
        // $('img:not([src="https://icons.veryicon.com/32/System/Small%20%26%20Flat/lightning.png"]').css('max-width: ', ui.value + 'px !important;');
        $('.node-displayed-image').css('cssText', "max-width: " +ui.value + 'px !important;' + "max-height: "+ui.value + 'px !important;');
        $('#currentSize').html(ui.value + 'px').show().fadeOut(1000);
    });
});
})();
});
