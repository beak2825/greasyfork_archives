
// ==UserScript==
// @name          Flixtor (Main Page)
// @description	  Flixtor
// @author      OctopusExpert
// @namespace   Flixtor (Main Page)
// @license	MIT 
// @match       http://flixtor.to/*
// @match       https://flixtor.to/*
// @match       http://*.flixtor.to/*
// @match       https://*.flixtor.to/*
// @match       http://flixtor.fm/*
// @match       http://*.flixtor.fm/*
// @match       https://flixtor.fm/*
// @match       https://*.flixtor.fm/*
// @version       1.0
// @downloadURL https://update.greasyfork.org/scripts/541170/Flixtor%20%28Main%20Page%29.user.js
// @updateURL https://update.greasyfork.org/scripts/541170/Flixtor%20%28Main%20Page%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

// Set our list of sites and elements to block
var blockList = [

// Footer
"flixtor.to##div.p-5:nth-child(8)",
//
"flixtor.to###playerwrapper > div.d-flex.justify-content-between:last-child > div.p-0.pl-1.pxt2.t10.text-info:first-child > div.d-flex.flex-nowrap > span.switch2legacy.pointer",

//
"flixtor.to###content > div.d-flex.row.justify-content-center.mb-3.flex-wrap:nth-child(7)",
//
"flixtor.to###content > div.d-flex.row.justify-content-center.mb-3.flex-wrap:nth-child(4)",
//
"flixtor.to###content > div.contentListR:nth-child(4)",
    //
"flixtor.to###content > h1.text-center.pt-4.text-info.header1:first-child",
    //
"flixtor.to###content > div.d-flex.row.p-3.justify-content-center:first-child",
    //
"flixtor.to###content > div.d-flex.row.justify-content-center.mb-3.flex-wrap:first-child",
    //
"flixtor.to###content > h2.text-center.pt-4.text-info.header2:first-child",
    //
"flixtor.to###content > div.contentListT:nth-child(6)",
    //
"flixtor.to###content > h2.text-center.pt-4.text-info.header2:nth-child(3)",
    //
"flixtor.to###content > div.d-flex.row.p-3.justify-content-center:nth-child(3)",
    //
"flixtor.to###content > div.d-flex.row.justify-content-center.mb-3.flex-wrap:nth-child(3)",
    //
"flixtor.to###content > div.d-flex.row.p-3.justify-content-center:first-child",
    //
"flixtor.to##div.d-flex.justify-content-center.mt-4:nth-child(5) > div.d-flex.section-watch.flex-column.mt-4 > div.d-flex.justify-content-center.text-center:first-child"

    ];

    // Get the window's hostname
    var windowHostname = window.location.hostname;

    // Iterate through the blocklist, hiding elements as needed
    for(var i = 0; i < blockList.length; i++) {
        var entryParts = blockList[i].split('##');

        // Compare the hostnames; Only remove elements if they match
        if(windowHostname === entryParts[0]) {
            // Find the elements if they exists
            var matchedElements = document.querySelectorAll(entryParts[1]);

            // Actually remove the element(s) that match
            for(var j = 0; j < matchedElements.length; j++) {
                var matchedElem = matchedElements[j];

                matchedElem.parentNode.removeChild(matchedElem);
            }
        }
    }
})();

(function() {var css = [

// Progress Bar
"#player > div.jw-wrapper.jw-reset:nth-child(2) > div.jw-controls.jw-reset:last-child > div.jw-controlbar.jw-reset:last-child > div.jw-slider-time.jw-chapter-slider-time.jw-background-color.jw-reset.jw-slider-horizontal:first-child > div.jw-slider-container.jw-reset > div.jw-reset.jw-old-rail:first-child > div.jw-timesegment.jw-reset > div.jw-timesegment-resetter.jw-reset > div.jw-timesegment-container.jw-reset > div.jw-timesegment-bar.jw-progress.jw-timesegment-progress.jw-reset:last-child {",
"background-color: #0433FF; ;",
"}",
"    ",
// Progress Bar for Episode List
    ".progressInner {",
"background-color: #ff0000; ;",
	"}",
	"    ",
//
".flip {",
    "color: #DCDCDC; ;",
    "transition: 1s; ;",
	"}",
	"    ",

".bsh1 {",
    "box-shadow: 0.1rem 0.1rem 0.4rem #202020; ;",
    "background-color: #36454f; ;",
    "color: #DCDCDC; ;",
	"}",
	"    ",

".btn-info {",
    "color: #DCDCDC; ;",
    "background-color: #36454f; ;",
    "border-color: #202020; ;",
	"}",
	"    ",

    
    ".table {",
    "color: #DCDCDC; ;",
	"}",
	"    ",

".table:hover {",
    "color: #DCDCDC; ;",
	"}",
	"    ",

".table-active, .table-active>td, .table-active>th {",
    "background-color: rgb(220 220 220 / .08); ;",
	"}",
	"    ",

".table td, .table th {",
    "border-top: none; ;",
	"}",
	"    ",

".table-hover tbody tr:hover {",
    "color: white; ;",
    "background-color: rgba(0,0,0,.075); ;",
	"}",
	"    ",

".page-item.disabled .page-link, .pagination-sm .page-link {",
    "background-color: #202020; ;",
	"}",
	"    ",

".page-link {",
    "border: none; ;",
	"}",
	"    ",

".main .card.back, .main .card.front, .show .card.back, .show .card.front {",
    "box-shadow: 0.1rem 0.1rem 0.4rem #202020; ;",
	"}",
	"    ",

".section-watch-season {",
    "background-color: rgb(0 0 0 / .70); ;",
    "color: #DCDCDC; ;",
	"}",
	"    ",

    
    ".filter .dropdown-menu {",
   "background-color: #202020; ;",
	"}",
	"    ",

".dropdown-item {",
   "color: #DCDCDC; ;",
	"}",
	"    ",

".text-center {",
    "color: #DCDCDC; ;",
	"}",
	"    ",
    

"body {",
    "background-color: #000000; ;",
	"}",
	"    ",

".back, .front {",
"background-color: #202020; ;",
	"}",
	"    ",


".searchinput, .searchinput:focus {",
    "border-color: #DCDCDC; ;",
	"}",
	"    ",

".btn-outline-info:not([disabled]):not(.disabled).active, .btn-outline-info:not([disabled]):not(.disabled):active, .show>.btn-outline-info.dropdown-toggle {",
    "color: #dcdcdc !important; ;",
	"}",
	"    ",

".btn-outline-info:not(:disabled):not(.disabled).active, .btn-outline-info:not(:disabled):not(.disabled):active, .show>.btn-outline-info.dropdown-toggle {",
    "color: #fff; ;",
    "background-color: #36454f; ;",
    "border-color: #202020; ;",
	"}",
	"    ",

".btn-outline-info {",
    "color: #DCDCDC; ;",
    "border-color: #202020; ;",
	"}",
	"    ",




    
    
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
})();
