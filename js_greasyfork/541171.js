
// ==UserScript==
// @name          Flixtor (Watch Page)
// @description	  Flixtor
// @author      OctopusExpert
// @run-at        document-start
// @namespace   Flixtor (Main Page)
// @license	MIT 
// @match       http://flixtor.to/watch/*
// @match       https://flixtor.to/watch/*
// @match       http://*.flixtor.to/watch/*
// @match       https://*.flixtor.to/watch/*
// @match       http://flixtor.fm/watch/*
// @match       http://*.flixtor.fm/watch/*
// @match       https://flixtor.fm/watch/*
// @match       https://*.flixtor.fm/watch/*
// @version       1.0
// @downloadURL https://update.greasyfork.org/scripts/541171/Flixtor%20%28Watch%20Page%29.user.js
// @updateURL https://update.greasyfork.org/scripts/541171/Flixtor%20%28Watch%20Page%29.meta.js
// ==/UserScript==


(function() {var css = [

//  NAVBAR ------------------------------------------------------------

".nav, .navbar-collapse, .navbar-expand-md, nav.navbar.transp.navbar-expand, nav.navbar.transp.navbar-expand-md.navbar-dark {",
"background-color: rgba(0,0,0,10); ;",
"width: 100% !important; ;",
"}",
"    ",
//
    
    ".jw-captions.jw-captions-enabled {",
    "font-stretch: normal; ;",
    "}",
"    ",
    
  //  
    "#playercontainer > div.d-flex:last-child {",
"background-color: rgba(0,0,0,10); ;",
"}",
"    ",
// NAVBAR HOVER-OVER TEXT ------------------------------------------------------------
".nav-link {",
"color: transparent!important; ;",
"}",
"    ",

// PLAYER BLOCK ------------------------------------------------------------
".p-2 {",
//"margin-top: 			0px!important; ;",
//"box-sizing: 			100% !important; ;",
"align: 			left !important; ;",
"padding: 			0rem!important; ;",
"margin: 			0px!important; ;",
"border: 			0px!important; ;",
"}",
	"    ",
//
".section-watch {",
"width: 			100% !important; ;",
"padding: 			0px!important; ;",
"}",
	"    ",
//
//".mt-4 {",
//"margin-top: 			0px!important; ;",
//"}",
//	"    ",
// Player Box Top
".d-flex.justify-content-center.mt-4{",
//"width: 			100% !important; ;",
"margin-top: 			0px!important; ;",
//"margin-bottom: 			0px!important; ;",
"}",
	"    ",
// ".justify-content-center{",
//"padding: 			0px!important; ;",
//"margin: 			0px!important; ;",
//"border: 			0px!important; ;",
//"}",
//	"    ",
    
//  Player Box
"#playerwrapper, #player{",
"background-color: rgba(0,0,0,10); ;",
"margin-top: 			0px!important; ;",
"width: 			100% !important; ;",
"height: 			100% !important; ;",
"padding: 			0px!important; ;",
"margin: 			0px!important; ;",
"border: 			0px!important; ;",
"}",
	"    ",
    
//    
"#playercontainer > div.d-flex:last-child{",
    "height:            75px !important; ;",
    "padding: 			0px!important; ;",
"margin: 			0px!important; ;",
"border: 			0px!important; ;",
    "}",
	"    ",

// TV BOTTOM BOX ------------------------------------------------------------

"#playerwrapper > div.d-flex.justify-content-between:last-child{",
"background-color: rgba(0,0,0,10); ;",
    "valign: 			top !important; ;",
//"height:            75px !important; ;",
"padding: 			8px!important; ;",
"margin: 			8px!important; ;",
"border: 			8px!important; ;",
"}",
	"    ",


// MOVIE BOTTOM BOX------------------------------------------------------------

"#playerwrapper > div.p-0.pl-1.pxt2.t10.text-info:last-child{",
"background-color: rgba(0,0,0,10); ;",
//"height:            75px !important; ;",
"padding: 			0px!important; ;",
"margin: 			0px!important; ;",
"border: 			0px!important; ;",
"}",
	"    ",


//------------------------------------------------------------


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


(function() {
    'use strict';
    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerText = '#playerwrapper > div.p-0.pl-1.pxt2.t10.text-info:last-child > div.d-flex.flex-nowrap > span.switch2legacy.pointer{display:none;}';
    document.head.appendChild(style)
        })();

// Search Field
(function() {
    'use strict';
    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerText = 'nav.navbar.transp.navbar-expand-md.navbar-dark:nth-child(2) > form.form-inline:last-child{display:none;}';
    document.head.appendChild(style)
})();


// VIP Login
(function() {
    'use strict';
    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerText = '#navbarCollapse > ul.navbar-nav.mr-auto > li.vipmenu.nav-item.dropdown:last-child{display:none;}';
    document.head.appendChild(style);
})();


// Legacy Player
//(function() {
//    'use strict';
//    const style = document.createElement('style');
//    style.type = 'text/css';
//    style.innerText = '#playerwrapper > div.p-0.pl-1.pxt2.t10.text-info:last-child > div.d-flex.flex-nowrap > //span.switch2legacy.pointer{display:none;}';
//    document.head.appendChild(style);
//})();


// Report Issue
(function() {
    'use strict';
    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerText = '#playercontainer > div.d-flex:last-child > div.ml-auto.pr-1.p-0.reportIssue.hidden-sm-down.text-muted.pointer:last-child > span.small.text-muted{display:none;}';
    document.head.appendChild(style);
})();

// Download Button
//(function() {
//    'use strict';
//    const style = document.createElement('style');
//    style.type = 'text/css';
 //   style.innerText = '#dlIcon{display:none;}';
//    document.head.appendChild(style);
//})();

// Fullscreen Button
(function() {
    'use strict';
    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerText = '#player > div.jw-wrapper.jw-reset:nth-child(2) > div.jw-controls.jw-reset:last-child > div.jw-controlbar.jw-reset:last-child > div.jw-reset.jw-button-container:last-child > div.jw-icon.jw-icon-inline.jw-button-color.jw-reset.jw-icon-fullscreen:nth-child(18){display:none;}';
    document.head.appendChild(style);
})();

// Settings Button
(function() {
    'use strict';
    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerText = '#player > div.jw-wrapper.jw-reset:nth-child(2) > div.jw-controls.jw-reset:last-child > div.jw-controlbar.jw-reset:last-child > div.jw-reset.jw-button-container:last-child > div.jw-icon.jw-icon-inline.jw-button-color.jw-reset.jw-icon-settings.jw-settings-submenu-button:nth-child(16){display:none;}';
    document.head.appendChild(style);
})();
