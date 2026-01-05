// ==UserScript==
// @name        CSS Fixes for certain sites
// @author		TheArkive
// @namespace   None
// @description Modify CSS for certain sites
// @include     *
// @version     1.05
// @grant       GM_addStyle
// @grant		GM_getValue
// @grant		GM_setValue
// @grant		unsafeWindow
// @require		http://code.jquery.com/jquery-1.11.3.js
// @downloadURL https://update.greasyfork.org/scripts/13331/CSS%20Fixes%20for%20certain%20sites.user.js
// @updateURL https://update.greasyfork.org/scripts/13331/CSS%20Fixes%20for%20certain%20sites.meta.js
// ==/UserScript==

/*
	I wrote this script because I like to theme windows, but I
	hate to have some of the web pages I frequent almost turn
	unreadable as a result of the OS color changes.  So I
	wrote this to fix the sites that go wonky for me.
	
	I may expand this in the future to try and accommodate
	more user friendly settings, but for now it's just an
	experiment / quick fix.
*/

var debug = 1;
var URL = document.URL;
var maxLoads = 0;
var enableThemes = 1;

var ArkScriptRun = GM_getValue("ArkScriptRun",0);
var ArkScriptRun = ArkScriptRun + 1;
GM_setValue("ArkScriptRun",ArkScriptRun);

// alert('its working!\n' + 'ArkScriptRun: ' + ArkScriptRun);

// die.net
var dienet = /ttps?:\/\/.*\.die\.net/i;
var dienetRES = URL.search(dienet);

// gnu.org
var gnu1 = /ttps?:\/\/.*\.gnu\.org\/.*Option-Summary\.html/i;
var gnu1RES = URL.search(gnu1);
var gnu2 = /ttps?:\/\/.*\.gnu\.org\/gcc\//i;

// google.com
var google = /ttps?:\/\/.*\.google\.com/i;
var googleRES = URL.search(google);

// greasyfork
var greasyfork = /ttps?:\/\/greasyfork\.org/i;
var greasyforkRES = URL.search(greasyfork);

// man7.org
var man7 = /ttps?:\/\/man7\.org/i;
var man7RES = URL.search(man7);

// pizzahut
var pizzahut = /ttps?:\/\/.*\.pizzahut\.com\//i;
var pizzahutRES = URL.search(pizzahut);

// chan.sankakucomplex.com
var sankaku = /ttps?:\/\/chan\.sankakucomplex\.com\//i;
var sankakuRES = URL.search(sankaku);

// stackoverflow.com
var stackof = /ttps?:\/\/stackoverflow\.com/i;
var stackofRES = URL.search(stackof);

// superuser.com
var superuser = /ttps?:\/\/.*superuser\.com/i;
var superuserRES = URL.search(superuser);

// w3schools
var w3 = /ttps?:\/\/.*\.w3schools\.com\//i;
var w3RES = URL.search(w3);

// WindowsStyleBuilder (aka VistaStyleBuilder)
var Wsb = /ttps?:\/\/vistastylebuilder\.com\//i;
var WsbRES = URL.search(Wsb);

// alert('pizzahut: ' + pizzahutRES + '\n' + 
      // 'WsbRES: ' + WsbRES + '\n' +
	  // 'gnu1: ' + gnu1RES + '\n' + 
	  // 'w3: ' + w3RES);

var glbCSS = "";
var usualCSS = "\
	input, textarea, .commentArea, button, select, .selectboxit-container *, .spInstrWrap, .login_input input_rounded_corners {\n\
		color: #008CFF !important;\n\
		background-color: #000C17 !important;\n\
	}\n\
	#categories, .category {\n\
		color: red; !important;\n\
	}\n\
	a:hover {\n\
		color: white; !important;\n\
	}\n\
	";

var siteCSS = "";
var maxLoads = 1;

if (dienetRES > 0) {
	var maxLoads = 1;
	
	var siteCSS = usualCSS + "\
	h1 {\n\
		color: gold !important;\n\
		border-bottom: 2px solid #001066 !important;\n\
	}\n\
	h2 {\n\
		color: goldenrod !important;\n\
	}\n\
	#menu, #bg, html, #news, #logo, .highlight {\n\
		background-color: #000C17 !important;\n\
	}\n\
	i {\n\
		color: greenyellow !important;\n\
	}\n\
	b {\n\
		color: yellow !important;\n\
	}\n\
	a {\n\
		color: cyan !important;\n\
	}\n\
	.gsc-webResult.gsc-result, .gsc-results, .gsc-imageResult {\n\
		border-color: #000C17 !important;\n\
		background-color: #000C17 !important;\n\
	}\n\
	.gs-bidi-start-align, .gs-visibleUrl, .gs-visibleUrl-long {\n\
		color: #009900 !important;\n\
	}\n\
	html, body, .gsc-control-cse, .gs-webResult, .gs-snippet, .gs-imageResult, .gs-snippet, .gs-fileFormatType, .gsc-cursor-page {\n\
		background-color: #000C17 !important;\n\
		color: #008CFF !important;\n\
		font-family: courier new !important\n\
	}\n\
	";
} else if (gnu1RES > 0) {
	var maxLoads = 1;
	
	var siteCSS = usualCSS + "\
	a.visited {\n\
		color: #00FF00 !important;\n\
	}\n\
	.smallexample {\n\
		color: #00FF00 !important;\n\
		font-size: 10pt !important;\n\
	}\n\
	";
} else if (googleRES > 0) {
	var maxLoads = 1;
	
	var siteCSS = usualCSS + "\
	body, form, div#stb, div#loading, #_og, .gsas_e, #sb_ifc0, .fbar, .sfbgg, #hdtbSum, #topabar, .sbsb_b, #sblsbb, #fbar, #ifbc, #rg, #center_col, .no-name, .card-mask, .rc-button, .rc-button-submit, .card, .signin-card, .jfk-bubble, #profile-name, .gb_ha, .gb_ga, .gb_za, .gb_g, .gb_ia, .gb_ja, .gb_aa, .gb_fa, .gb_Ad, .gb_P, .gb_R, .gb_1b, .gb_xb, .Bu, .a3s, .amn, h2, .nH, .oy8Mbf, .nn, .aeN, .gb_La, .gb_oe, .gb_R, .gb_ne, .gb_X, .gb_T, .gD, .g3, .Kj-JD, .LW-JD, .LW-KX, .Kj-JD-K7, .Kj-JD-K7-GIHV4, .Kj-JD-Jz, .J-KU-Jz, .J-KU-Jg, .g6, .iA, .adf, .ads, .crp, .action-menu-item, .ab_dropdownitem, .action-menu, .ab_ctl, ._Fmb, .ab_button, #ss-box, #ss-moderate, #ss-strict, .gbmc, #gbmpdv, .KQc, .fc, .rd, .Rd, .Bia, .UK, .ul, .kc, .g-h-f-vc-B, .b-K b-K-Xb, .URaP8, .hdtb-td-o, .hdtbU, .hdtb-mn-o, .hdtb-mn-c, .hdtbItm, .hdtbSel, .anQ, .ajA, .SK, .Wx, .Ji, .Z6, .av, .cf, .anr, .anu, .gb_ab, .gb_Ba, .gb_yd, .gb_Fd, .gb_9a, .J-M, .asi, .aYO, .jQjAxd, .J-awr, .J-N, .J-Ks, .aMP, .aMT, .aMV, .J-Ks-KO, .J-N, .SK, .AX, .aAT, .aAU {\n\
		background-color: #000C17 !important;\n\
		color: #FFFFFF !important;\n\
	}\n\
	#sblsbb {\n\
		border: 1px solid !important;\n\
	}\n\
	.T-I-KE {\n\
		background-image: -moz-linear-gradient(center top, #000229, #444343) !important;\n\
		color: #008CFF !important;\n\
	}\n\
	.gb_da, .gbqfqw, .gbqfqw, .gb_X, .gbqfqw, .gbqfqw {\n\
		background-color: #000000 !important;\n\
		border-color: #0E29F6 !important;\n\
	}\n\
	.Am, .Al, .editable, .LW-avf, .et, .Ar, .Au, .IG, .vR, .oj, .aA6, .wO, .nr, .qz, .aoD, .hl, .Ap, .Aq, .aMS, .aMU, .J-N-JT, .J-KS-KO {\n\
		background-color: #000000 !important;\n\
		color: #FFFFFF !important;\n\
	}\n\
	.a8X, .gU, .J-Z {\n\
		background-color: #003355 !important;\n\
	}\n\
	.Kj-JD-Jh {\n\
		opacity: 0.1 !important;\n\
	}\n\
	a:link, .ss-link, .ss-unselected {\n\
		color: cyan !important;\n\
	}\n\
	._Rm {\n\
		color: greenyellow !important;\n\
	}\n\
	.st, em, .crl {\n\
		color: goldenrod !important;\n\
	}\n\
	";
} else if (greasyforkRES > 0) {
	var maxLoads = 1;
	
	var siteCSS = usualCSS + "\
	body {\n\
		color: #008CFF !important;\n\
		background-color: #000C17 !important;\n\
	}\n\
	a {\n\
		color: #ABE4F7 !important;\n\
	}\n\
	#additional-info > div {\n\
		background-color: #042442 !important;\n\
	}\n\
	#script-links li:not(.current) {\n\
		background-color: #000C17\n\
	}\n\
	#script-links .current {\n\
		background-color: #000C17\n\
	}\n\
	#script-content {\n\
		border-top: 1px solid #008CFF !important;\n\
	}\n\
	code, #code-container {\n\
		background-color: #000C17 !important;\n\
	}\n\
	";
} else if (man7RES > 0) {
	var maxLoads = 1;
	
	var siteCSS = usualCSS + "\
	html, body, table, div {\n\
		color: cyan !important;\n\
		background-color: #000C17 !important;\n\
	}\n\
	i {\n\
		color: greenyellow !important;\n\
	}\n\
	b {\n\
		color: goldenrod !important;\n\
	}\n\
	a:link {\n\
		color: yellow !important;\n\
		background-color: #000C17 !important;\n\
	}\n\
	a:hover {\n\
		color: white !important;\n\
	}\n\
	";
} else if (sankakuRES > 0) {
	var maxLoads = 1;
	
	var siteCSS = usualCSS + "\
	body, body.en, body.ja, html {\n\
		color: #008CFF !important;\n\
		background-color: #000C17 !important;\n\
	}\n\
	div#header {\n\
		background-color: #000C17 !important;\n\
	}\n\
	div#header ul#subnavbar {\n\
		background-color: #000C17 !important;\n\
	}\n\
	div#header ul#navbar li.current-page {\n\
		background-color: #000C17;\n\
		border-color: #3C60DE #3C60DE #3C60DE !important;\n\
	}\n\
	div#header ul#navbar li > ul {\n\
		background-color: #000C17;\n\
	}\n\
	div.status-notice {\n\
		background-color: #000C17 !important;\n\
	}\n\
	div#post-content {\n\
		padding-top: 0px !important;\n\
	}\n\
	#image {\n\
		max-width: 100% !important;\n\
		height: auto !important;\n\
	}\n\
	";
} else if (stackofRES > 0) {
	var maxLoads = 1;
	
	var siteCSS = usualCSS + "\
	html, body, table, div, .owner, #tabs a, .question-hyperlink, pre {\n\
		background-color: #000C17 !important;\n\
		color: #008CFF !important;\n\
	}\n\
	#content {\n\
		width: 1500px !important;\n\
	}\n\
	#answers, #mainbar, .answer {\n\
		width: 1200px !important;\n\
	}\n\
	.post-text {\n\
		width: 1150px !important;\n\
	}\n\
	#tabs a {\n\
		border-width: 1px !important;\n\
		border-color: #000099 #000099 #000099 !important;\n\
	}\n\
	#tabs a:hover{\n\
		color: #FFFFFF !important;\n\
	}\n\
	#tabs a.youarehere {\n\
		border-color: #0077FF #0077FF #0077FF !important;\n\
	}\n\
	.container, .post-tag {\n\
		background-color: #000C17 !important;\n\
	}\n\
	td.owner {\n\
		border: 1px solid !important;\n\
		border-color: white !important;\n\
	}\n\
	code {\n\
		background-color: #000C17 !important;\n\
		color: white !important;\n\
	}\n\
	#herobox-mini {\n\
		border: 0px none !important;\n\
	}\n\
	#hero-content {\n\
		border: 1px solid !important;\n\
		background-image: none !important;\n\
	}\n\
	.pln {\n\
		color: #909090 !important;\n\
	}\n\
	.pun {\n\
		color: red; !important;\n\
	}\n\
	.lit {\n\
		color: #FFFFFF !important;\n\
	\n\
	.kwd {\n\
		color: green !important;\n\
	}\n\
	";
} else if (superuserRES > 0) {
	var maxLoads = 1;
	
	var siteCSS = usualCSS + "\
	html, body, table, div, .owner, #tabs a, .question-hyperlink {\n\
		background-color: #000C17 !important;\n\
		color: #008CFF !important;\n\
	}\n\
	#tabs a {\n\
		border-width: 1px !important;\n\
		border-color: #000099 #000099 #000099 !important;\n\
	}\n\
	#tabs a:hover{\n\
		color: #FFFFFF !important;\n\
	}\n\
	#tabs a.youarehere {\n\
		border-color: #0077FF #0077FF #0077FF !important;\n\
	}\n\
	.container, .post-tag {\n\
		background-color: #000C17 !important;\n\
	}\n\
	td.owner {\n\
		border: 1px solid !important;\n\
		border-color: white !important;\n\
	}\n\
	#herobox-mini {\n\
		border: 0px none !important;\n\
	}\n\
	#hero-content {\n\
		border: 1px solid !important;\n\
		background-image: none !important;\n\
	}\n\
	#hlogo a {\n\
		background-image: url('http://i.imgur.com/2pXXVaI.png') !important;\n\
		background-size: 100% !important;\n\
	}\n\
	code {\n\
		background-color: #000C17 !important;\n\
		color: white !important;\n\
	}\n\
	";
} else if (w3RES > 0) {
	var maxLoads = 6;
	
	var siteCSS = usualCSS + "\
	body {\n\
		color: #008CFF !important;\n\
		background-color: #072663 !important;\n\
	}\n\
	.intro {\n\
		color: #008CFF !important;\n\
	}\n\
	.example {\n\
		background-color: #000000 !important;\n\
	}\n\
	.menyenScroll {\n\
		background-color: #000000 !important;\n\
	}\n\
	";
} else if (WsbRES > 0) {
	var siteCSS = usualCSS + "\
	body {\n\
		color: #008CFF !important;\n\
		background-color: #072663 !important;\n\
	}\n\
	.catbg, .catbg2, .catbg3, tr.catbg td, tr.catbg2, tr.catbg3 td {\n\
		background-color: #072663 !important;\n\
	}\n\
	.titlebg, tr.titlebg th, tr.titlebg td, .titlebg2, tr.titlebg2 th, tr.titlebg2 {\n\
		background-color: #072663 !important;\n\
	}\n\
	.windowbg, .windowbg2 {\n\
		background-color: #072663 !important;\n\
	}\n\
	#menu {\n\
		background-color: #072663 !important;\n\
	}\n\
	#logoheader {\n\
		background-color: #072663 !important;\n\
	}\n\
	.codeheader, .quoteheader {\n\
		font-size: medium !important;\n\
	}\n\
	.code, .quote {\n\
		font-size: small !important;\n\
	}\n\
	";
};

var CSS = glbCSS + siteCSS;
var CssLen = CSS.length;

if ((CssLen > 0) && (ArkScriptRun == maxLoads) && (enableThemes == 1)) {
	GM_addStyle(CSS);
	GM_setValue("ArkScriptRun",1);
};

if (ArkScriptRun >= maxLoads ) {
	GM_setValue("ArkScriptRun",0);
};

if (debug == 1) {
	var msg = 'CSS Len: ' + CssLen + '\n' + 
			  'ArkScript CSS:\n' + CSS + '\n' +
			  'ArkScriptRun = ' + ArkScriptRun;
	unsafeWindow.console.log(msg);
};

// -=-=-=-=-


// window.addEventListener("load", function(e) {
	// var ArkScriptRun = GM_getValue("ArkScriptRun",0);
	
	// var ArkScriptRun = ArkScriptRun + 1;
	// GM_setValue("ArkScriptRun",ArkScriptRun);
	
	// if (ArkScriptRun >= 6) { GM_setValue("ArkScriptRun",0); }
	
	// alert('Page Load: ' + ArkScriptRun);
// }, false);


// $(document).load(function(CSS) {
	// alert('load once!\n' + URL)
// });
