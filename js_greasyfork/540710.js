// ==UserScript==
// @name neopets_2020
// @namespace http://neopets.com
// @version 1.0
// @description Neopets CSS Styling
// @author Max van Doorn
// @license neopets.com
// @grant GM_addStyle
// @run-at document-start
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/540710/neopets_2020.user.js
// @updateURL https://update.greasyfork.org/scripts/540710/neopets_2020.meta.js
// ==/UserScript==

(function() {
let css = `body {
	/*height:100%;*/
	width:100%;
	margin:0;
}

.container {
	background:#fff; /* NEED TO ADD classes for standard container width and color. */
    overflow-x:hidden;
}

/* USER PET IMAGES */

.pet150__2020 {
    background-size: 100%;
    background-repeat: no-repeat;
    background-position: center;
    width:90%;
    height:0;
    padding-bottom:90%;
    margin:10px auto;
}
@media screen and (min-width:167px) {
    .pet150__2020 {
        width:150px;
        height:150px;
        padding-bottom:0;
    }
}

.item-single__2020 {
	background-size:100%;
	background-position:center;
	background-repeat:no-repeat;
	width:80px;
	height:80px;
	padding-bottom:0;
	margin: 10px auto;
}

@media screen and (max-width:89px) {
	.item-single__2020 {
		width:90%;
		height:0;
		padding-bottom:90%;
	}
}

/* DROPDOWN AND POPUP STYLING */

.nav-dropdown__2020 {} /* DO NOT STYLE THIS CLASS
This is used to identify all dropdowns that clicking on the shade layer should close
*/

.nav-dropdown-shade__2020,.nav-popup-shade__2020,.nav-popup-shade-open__2020 {
	position:fixed;
	width:100%;
	height:100%;
	top:0;
	left:0;
	background:#000;
	opacity:0.5;
	cursor:pointer;
}

.nav-dropdown-shade__2020 {
	z-index:97;
}

.nav-popup-shade__2020,.nav-popup-shade-open__2020 {
	z-index:99;
}
.nav-popup-shade-open__2020 {
    display:none;
}
.nav-popup-nested-shade__2020 {
	position:absolute;
	width:100%;
	height:100%;
	top:0;
	left:0;
	background:#000;
	opacity:0.5;
	cursor:pointer;
	z-index:2;
}

.container {
	position:relative;
	width:100%;
	margin:auto;
	max-width:1080px;
	min-height:100vh;
	/*min-height:calc(100vh - 220px);*/ /* This makes sure that the footer never floats partway up the page, but still scrolls with the body contents. */
	height:auto;
	z-index:2;
}

.container::before {
    content: '';
    display: block;
}

.center {
	align-items: center;
    display: flex;
    justify-content: center;
}

/* FONTS */

@font-face {
	font-family: "Cafeteria";
	src:url(../../../js/fonts/cafeteria-black.ttf) format("truetype");
	src:url(../../../js/fonts/cafeteria-black.otf) format("opentype");
}

@font-face{
	font-family:"MuseoSansRounded700";
	font-style:normal;
	src:url("../../../js/fonts/museosansrounded-700.woff") format("woff"),url("../../../js/fonts/museosansrounded-700.ttf") format("truetype");
}

@font-face{
	font-family:"MuseoSansRounded500";
	font-style:normal;
	src:url("../../../js/fonts/museosansrounded-500.woff") format("woff"),url("../../../js/fonts/museosansrounded-500.ttf") format("truetype");
}

@font-face{
	font-family:"Palanquin";
	font-style:normal;
	src:url("../../../js/fonts/Palanquin.ttf") format("truetype");
}

@font-face{
	font-family:"8bit";
	font-style:normal;
	src:url("../../../js/fonts/8bit.ttf") format("truetype");
}

/* Leaving Beta Popup */

.togglePopup__2020 {
	display:none;
	position:fixed;
	width:90%;
	max-width:600px;
	height:auto;
	/*max-height:90vh;*/
	z-index:100;
	top:50%;
	left:50%;
}
.movePopup__2020 {} /* This class is only used for Javascript to reference and move popups to the top of the DOM, so that they cover any other page elements (nav & body). */
/* Some Default styling for popups. Can/should be overridden on a case by case basis. */
.popup-header__2020 {
	position: relative;
	text-align: center;
	font-family: "Cafeteria", 'Arial Bold', sans-serif;
	padding: 10px 0;
	border-radius: 15px 15px 0 0;
	background: #fed123;
	z-index: 0; /* Ensures that pattern within this div will appear in front of background but behind other interior elements. */
}

.popup-header__2020 h3 {
	color: #363636;
	font-size: 20pt;
	max-width: calc(90% - 50px - .5em) !important;
	margin: 0 auto;
}

@media screen and (max-width: 400px) {
	.popup-header__2020 h3 {
		font-size: 18pt !important;
	}
}

.popup-header-pattern__2020, .popup-footer-pattern__2020 {
	position: absolute;
	width: 100%;
	background: url(../basic/images/pattern-basic.svg) center -10px;
	background-size: 121px 58px;
	top: 0px;
	left: 0px;
	height: 100%;
	z-index: -1; /* Ensures that pattern within this div will appear in front of background but behind other interior elements. */
}

.popup-header-pattern__2020 {
	border-radius: 15px 15px 0 0;
}

.popup-footer-pattern__2020 {
	border-radius: 0 0 15px 15px;
}

.popup-body__2020 {
	position: relative;
	overflow: auto;
	background: #fff;
	text-align: center;
	font-family: "MuseoSansRounded500", 'Arial', sans-serif;
	padding: 20px 0;
	/* max-height: calc(70vh - 60px); */
}

.popup-image__2020 {
	margin: auto;
	width: 90%;
}

.popup-body__2020 p {
	width: 90%;
	margin: 20px auto auto;
	position: relative;
}

.popup-footer__2020 {
	position: relative;
	border-radius: 0 0 15px 15px;
	background: #fed123;
	padding: 10px;
	z-index: 0; /* Ensures that pattern within this div will appear in front of background but behind other interior elements. */
}

.popup-grid2__2020 { /* Grid layout for popup footers with 2 buttons. */
	display:grid;
	grid-template-columns: 45% 45%;
	grid-column-gap: 10%;
}
.button-grid2__2020 {
	display:grid;
	grid-template: auto / repeat(2, 1fr);
	grid-gap:10px;
	margin:10px auto;
	width:90%;
	max-width:480px;
}
.button-grid3__2020 {
	display:grid;
	grid-template: auto / repeat(3, 1fr);
	grid-gap:10px;
	margin:10px auto;
	width:90%;
	max-width:720px;
}
.popup-grid3__2020 { /* Grid layout for popup footers with 3 buttons. */
	display:grid;
	grid-template-columns: 25% 40% 25%;
	grid-column-gap: 5%;
}

@media screen and (max-width: 440px) {
	.popup-grid2__2020, .button-grid2__2020 {
		grid-template: repeat(2, 1fr) / auto;
		gap: 1em;
	}
	.popup-grid2__2020 .button-default__2020, .button-grid2__2020 .button-default__2020 {
		max-width: 200px;
		margin: auto;
	}
}

/* Leaving Beta confirmation popup. */
.beta-exit-popup-image__2020 {
	background:url(../../../images/beta/beta-exit.jpg) center center no-repeat;
	background-size:100%;
	height:0;
	padding-bottom:45%;
}

#leaveBetaPopup__2020 .popup-left-button__2020 {
	max-width:60px;
}

/*
.beta-exit-backbutton__2020 {
	height:25px;
	width:80px;
	position:absolute;
	top:10px;
	left:10px;
	font-family: "Cafeteria", 'Arial Bold', sans-serif;
	cursor:pointer;
	text-align:center;
	filter:hue-rotate(180deg);
	background: #48f938;
	background: -webkit-linear-gradient(#48f938, #13b310);
	background: -o-linear-gradient(#48f938, #13b310);
	background: linear-gradient(#48f938, #13b310);
	border-radius: 15px;
	-webkit-box-shadow: inset 0px 0px 0px 1px rgba(2, 255, 0),inset 0px -4px 0px 3px rgba(44, 111, 0),inset 0px 2px 0px 1px rgba(255,255,255,1),inset 0px -7px 0px 1px rgba(153, 255, 150);
	-moz-box-shadow: inset 0px 0px 0px 1px rgba(2, 255, 0),inset 0px -4px 0px 3px rgba(44, 111, 0),inset 0px 2px 0px 1px rgba(255,255,255,1),inset 0px -7px 0px 1px rgba(153, 255, 150);
	box-shadow: inset 0px 0px 0px 1px rgba(2, 255, 0),inset 0px -4px 0px 3px rgba(44, 111, 0),inset 0px 2px 0px 1px rgba(255,255,255,1),inset 0px -7px 0px 1px rgba(153, 255, 150);
	/*border: #000000 solid 2px;*/
/*	padding:7px 0px 10px;
}
.beta-exit-confirmbutton__2020 {
	height:25px;
	width:calc(100% - 190px);
	max-width:150px;
	margin: auto;
	font-family: "Cafeteria", 'Arial Bold', sans-serif;
	cursor:pointer;
	text-align:center;
	background: #48f938;
	background: -webkit-linear-gradient(#48f938, #13b310);
	background: -o-linear-gradient(#48f938, #13b310);
	background: linear-gradient(#48f938, #13b310);
	border-radius: 15px;
	-webkit-box-shadow: inset 0px 0px 0px 1px rgba(2, 255, 0),inset 0px -4px 0px 3px rgba(44, 111, 0),inset 0px 2px 0px 1px rgba(255,255,255,1),inset 0px -7px 0px 1px rgba(153, 255, 150);
	-moz-box-shadow: inset 0px 0px 0px 1px rgba(2, 255, 0),inset 0px -4px 0px 3px rgba(44, 111, 0),inset 0px 2px 0px 1px rgba(255,255,255,1),inset 0px -7px 0px 1px rgba(153, 255, 150);
	box-shadow: inset 0px 0px 0px 1px rgba(2, 255, 0),inset 0px -4px 0px 3px rgba(44, 111, 0),inset 0px 2px 0px 1px rgba(255,255,255,1),inset 0px -7px 0px 1px rgba(153, 255, 150);
	/*border: #000000 solid 2px;*/
	/*padding:7px 0px 10px;
}*/

/* Experimentation with Popper */
/*#comingSoonPopper {
	background:#fff;
	color:#363636;
	font-family: "MuseoSansRounded700", 'Arial', sans-serif;
	padding:4px 8px;
	font-size:13pt;
	border-radius:5px;
}
#popperTail, #popperTail::before {
	position:absolute;
	width:8px;
	height:8px;
	z-index:-1;
	display:none;
}
#popperTail::before { /* Pseudo-element needed to transform the arrow independently of popper's transforms. */
/*	content:'';
	transform:rotate(45deg);
	background:#fff;
}
#comingSoonPopper[data-show] {
	display:block;
}
#comingSoonPopper[data-popper-placement^='top'] > #arrow {
  bottom: -4px;
}

#comingSoonPopper[data-popper-placement^='bottom'] > #arrow {
  top: -4px;
}

#comingSoonPopper[data-popper-placement^='left'] > #arrow {
  right: -4px;
}

#comingSoonPopper[data-popper-placement^='right'] > #arrow {
  left: -4px;
}*/

/* POPPER ALTERNATIVE FROM SCRATCH */

.coming-soon__2020 {
	background:#fff;
	color:#363636;
	font-family: "MuseoSansRounded700", 'Arial', sans-serif;
	padding:4px 8px;
	font-size:13pt;
	border-radius:5px;
	display:none;
}
.coming-soon-tail__2020 {
	position:absolute;
	width:8px;
	height:8px;
	z-index:-1;
	transform:rotate(45deg);
	background:#fff;
}

/* GENERIC BUTTONS, CLASSIC STYLING */
.page-title__2020 {
	position:relative;
	min-height:39px; /* To contain an absolutely positioned info button. */
	margin-bottom:5px;
	margin-top: 10px;
	display:flex;
}
.page-title__2020 h1 {
	width:calc(100% - 100px);
	font-family: "Cafeteria", 'Arial Bold', sans-serif;
    margin:auto;
    text-align:center;
}

.q-button__2020 { /* Important styling here is needed to override some default button styling*/
	width:35px !important;
	height:35px !important;
	position:absolute !important;
	right:10px;
	top:2px;
	border-radius:50% !important;
	padding:10%;
	box-sizing:border-box;
}
.page-title__2020 .q-button__2020.faq-button.desc-button {
	display:none !important;
}
.q-icon__2020 {
	background:url(../basic/images/question-icon.svg) center center no-repeat;
	background-size:contain;
	width:100%;
	height:100%;
}
.back-button-circle__2020 {
	width: 35px !important;
    height: 35px !important;
    position: absolute !important;
    left: 10px;
    top: 2px;
    border-radius: 50% !important;
}

#infoPopup2020 .button-default__2020 {
	min-height:40px;
}
#infoPopup2020 .popup-body__2020 p {
	margin:5px auto !important;
}
@media screen and (max-width:481px) {
	#pageDesc,
	.mobileBtns {
		display:none;
	}
    #mobileDesc {
        display:block;
	}
	/* .popup-body__2020 {
		max-height: calc(70vh - 80px);
	} */
}
@media screen and (min-width:482px) {
	.page-title__2020 .q-button__2020:not(.faq-button) {
		display:none !important;
	}
	.page-title__2020 .q-button__2020.faq-button.desc-button {
		display:unset !important;
	}
    #mobileDesc {
        display:none;
    }
}

.button-x__2020 {
	background:url(../basic/images/x-icon.svg) center center no-repeat;
	background-size:100%;
	position:absolute;
	width:20px;
	height:20px;
	margin-top:-12px;
	margin-left:-10px;
	top:50%;
	left:50%;
}
.icon-back__2020 {
	background:url(../basic/images/back-icon.svg) center center no-repeat;
	background-size:100%;
	position:absolute;
	width:20px;
	height:20px;
	margin-top:-12px;
	margin-left:-10px;
	top:50%;
	left:50%;
}

.button-default__2020 {
	display: block;
	height:auto;
	position:relative;
	box-sizing:border-box;
	width:100%;
	padding:5px 5px 10px 5px;
	border: #fff solid 1px;
	text-align:center;
	font-family: "Cafeteria", 'Arial Bold', sans-serif;
	font-size:14pt;
    overflow:hidden;
	cursor:pointer;
	outline:none;
}

.btn-single__2020 {
    width:90% !important;
	max-width:250px;
	display:block;
	margin:20px auto;
}

.btn-grain__2020 {
    position:absolute;
    top:0;
    left:0;
    width:100%;
    height:100%;
    opacity:0.75;
}

@supports (mix-blend-mode: overlay) {
    .btn-grain__2020 {
        background:url(../common/btn-grain.jpg);
        mix-blend-mode: overlay;
    }
}

.button-yellow__2020 {
	color:#363636;
	background: #f6e250;
	background: -webkit-linear-gradient(#f6e250,#ebb233);
	background: -moz-linear-gradient(#f6e250,#ebb233);
	background: linear-gradient(#f6e250,#ebb233);
	border-radius: 15px;
	-webkit-box-shadow: inset 0 0 0 1px rgba(246,226,80,1), /* Same as top of gradient */
		inset 0 -3px 2px 3px rgba(196,124,25,1), /* Bottom Shadow */
		inset 0 2px 0 1px rgba(253,249,220,1), /* Top Shine */
		0 0 0 2px rgba(0,0,0,1); /* black outside border */
	-moz-box-shadow: inset 0 0 0 1px rgba(246,226,80,1), /* Same as top of gradient */
		inset 0 -3px 2px 3px rgba(196,124,25,1), /* Bottom Shadow */
		inset 0 2px 0 1px rgba(253,249,220,1), /* Top Shine */
		0 0 0 2px rgba(0,0,0,1); /* black outside border */
	box-shadow: inset 0 0 0 1px rgba(246,226,80,1), /* Same as top of gradient */
		inset 0 -3px 2px 3px rgba(196,124,25,1), /* Bottom Shadow */
		inset 0 2px 0 1px rgba(253,249,220,1), /* Top Shine */
		0 0 0 2px rgba(0,0,0,1); /* black outside border */
}
.button-yellow__2020:hover, .button-yellow__2020:focus, a:focus > .button-yellow__2020 {
	color:#363636;
	background: #ffff54;
	background: -webkit-linear-gradient(#ffff54,#ffd328);
	background: -moz-linear-gradient(#ffff54,#ffd328);
	background: linear-gradient(#ffff54,#ffd328);
	border-radius: 15px;
	-webkit-box-shadow: inset 0 0 0 1px rgba(255,255,84,1), /* Same as top of gradient */
		inset 0 -3px 2px 3px rgba(234,143,9,1), /* Bottom Shadow */
		inset 0 2px 0 1px rgba(255,255,243,1), /* Top Shine */
		0 0 0 2px rgba(0,0,0,1); /* black outside border */
	-moz-box-shadow: inset 0 0 0 1px rgba(255,255,84,1), /* Same as top of gradient */
		inset 0 -3px 2px 3px rgba(234,143,9,1), /* Bottom Shadow */
		inset 0 2px 0 1px rgba(255,255,243,1), /* Top Shine */
		0 0 0 2px rgba(0,0,0,1); /* black outside border */
	box-shadow: inset 0 0 0 1px rgba(255,255,84,1), /* Same as top of gradient */
		inset 0 -3px 2px 3px rgba(234,143,9,1), /* Bottom Shadow */
		inset 0 2px 0 1px rgba(255,255,243,1), /* Top Shine */
		0 0 0 2px rgba(0,0,0,1); /* black outside border */
}
.button-yellow__2020:active {
	color:#363636;
	background: #ebb233;
	background: -webkit-linear-gradient(#ebb233,#f6e250);
	background: -moz-linear-gradient(#ebb233,#f6e250);
	background: linear-gradient(#ebb233,#f6e250);
	border-radius: 15px;
	-webkit-box-shadow: inset 0 0 0 1px rgba(235,178,51,1), /* Same as top of gradient */
		inset 0 -1px 2px 3px rgba(196,124,25,1), /* Bottom Shadow */
		inset 0 2px 0 1px rgba(253,249,220,1), /* Top Shine */
		0 0 0 2px rgba(0,0,0,1); /* black outside border */
	-moz-box-shadow: inset 0 0 0 1px rgba(246,226,80,1), /* Same as top of gradient */
		inset 0 -1px 2px 3px rgba(196,124,25,1), /* Bottom Shadow */
		inset 0 2px 0 1px rgba(253,249,220,1), /* Top Shine */
		0 0 0 2px rgba(0,0,0,1); /* black outside border */
	box-shadow: inset 0 0 0 1px rgba(246,226,80,1), /* Same as top of gradient */
		inset 0 -1px 2px 3px rgba(196,124,25,1), /* Bottom Shadow */
		inset 0 2px 0 1px rgba(253,249,220,1), /* Top Shine */
		0 0 0 2px rgba(0,0,0,1); /* black outside border */
}
.button-blue__2020 {
	color:#fff;
    text-shadow: 0 0 4px #000;
	background: #539ff3;
	background: -webkit-linear-gradient(#539ff3,#2556ba);
	background: -moz-linear-gradient(#539ff3,#2556ba);
	background: linear-gradient(#539ff3,#2556ba);
	border-radius: 15px;
	-webkit-box-shadow: inset 0 0 0 1px rgba(83,159,243,1), /* Same as top of gradient */
		inset 0 -3px 2px 3px rgba(29,63,112,1), /* Bottom Shadow */
		inset 0 2px 0 1px rgba(208,229,252,1), /* Top Shine */
		0 0 0 2px rgba(0,0,0,1); /* black outside border */
	-moz-box-shadow: inset 0 0 0 1px rgba(83,159,243,1), /* Same as top of gradient */
		inset 0 -3px 2px 3px rgba(29,63,112,1), /* Bottom Shadow */
		inset 0 2px 0 1px rgba(208,229,252,1), /* Top Shine */
		0 0 0 2px rgba(0,0,0,1); /* black outside border */
	box-shadow: inset 0 0 0 1px rgba(83,159,243,1), /* Same as top of gradient */
		inset 0 -3px 2px 3px rgba(29,63,112,1), /* Bottom Shadow */
		inset 0 2px 0 1px rgba(208,229,252,1), /* Top Shine */
		0 0 0 2px rgba(0,0,0,1); /* black outside border */
}
.button-blue__2020:hover, .button-blue__2020:focus, a:focus > .button-blue__2020 {
	color:#fff;
    text-shadow: 0 0 4px #000;
	background: #59c2ff;
	background: -webkit-linear-gradient(#59c2ff,#195de0);
	background: -moz-linear-gradient(#59c2ff,#195de0);
	background: linear-gradient(#59c2ff,#195de0);
	border-radius: 15px;
	-webkit-box-shadow: inset 0 0 0 1px rgba(89,194,255,1), /* Same as top of gradient */
		inset 0 -3px 2px 3px rgba(15,61,130,1), /* Bottom Shadow */
		inset 0 2px 0 1px rgba(245,255,255,1), /* Top Shine */
		0 0 0 2px rgba(0,0,0,1); /* black outside border */
	-moz-box-shadow: inset 0 0 0 1px rgba(89,194,255,1), /* Same as top of gradient */
		inset 0 -3px 2px 3px rgba(15,61,130,1), /* Bottom Shadow */
		inset 0 2px 0 1px rgba(245,255,255,1), /* Top Shine */
		0 0 0 2px rgba(0,0,0,1); /* black outside border */
	box-shadow: inset 0 0 0 1px rgba(89,194,255,1), /* Same as top of gradient */
		inset 0 -3px 2px 3px rgba(15,61,130,1), /* Bottom Shadow */
		inset 0 2px 0 1px rgba(245,255,255,1), /* Top Shine */
		0 0 0 2px rgba(0,0,0,1); /* black outside border */
}
.button-blue__2020:active {
	color:#fff;
    text-shadow: 0 0 4px #000;
	background: #2556ba;
	background: -webkit-linear-gradient(#2556ba,#539ff3);
	background: -moz-linear-gradient(#2556ba,#539ff3);
	background: linear-gradient(#2556ba,#539ff3);
	border-radius: 15px;
	-webkit-box-shadow: inset 0 0 0 1px rgba(37,86,186,1), /* Same as top of gradient */
		inset 0 -1px 2px 3px rgba(29,63,112,1), /* Bottom Shadow */
		inset 0 2px 0 1px rgba(208,229,252,1), /* Top Shine */
		0 0 0 2px rgba(0,0,0,1); /* black outside border */
	-moz-box-shadow: inset 0 0 0 1px rgba(37,86,186,1), /* Same as top of gradient */
		inset 0 -1px 2px 3px rgba(29,63,112,1), /* Bottom Shadow */
		inset 0 2px 0 1px rgba(208,229,252,1), /* Top Shine */
		0 0 0 2px rgba(0,0,0,1); /* black outside border */
	box-shadow: inset 0 0 0 1px rgba(37,86,186,1), /* Same as top of gradient */
		inset 0 -1px 2px 3px rgba(29,63,112,1), /* Bottom Shadow */
		inset 0 2px 0 1px rgba(208,229,252,1), /* Top Shine */
		0 0 0 2px rgba(0,0,0,1); /* black outside border */
}
.button-green__2020 {
	color:#000;
	background: #3bc92e;
	background: -webkit-linear-gradient(#3bc92e,#2b8a27);
	background: -moz-linear-gradient(#3bc92e,#2b8a27);
	background: linear-gradient(#3bc92e,#2b8a27);
	border-radius: 15px;
	-webkit-box-shadow: inset 0 0 0 1px rgba(59,201,46,1), /* Same as top of gradient */
		inset 0 -3px 2px 3px rgba(36,103,23,1), /* Bottom Shadow */
		inset 0 2px 0 1px rgba(201,240,198,1), /* Top Shine */
		0 0 0 2px rgba(0,0,0,1); /* black outside border */
	-moz-box-shadow: inset 0 0 0 1px rgba(59,201,46,1), /* Same as top of gradient */
		inset 0 -3px 2px 3px rgba(36,103,23,1), /* Bottom Shadow */
		inset 0 2px 0 1px rgba(201,240,198,1), /* Top Shine */
		0 0 0 2px rgba(0,0,0,1); /* black outside border */
	box-shadow: inset 0 0 0 1px rgba(59,201,46,1), /* Same as top of gradient */
		inset 0 -3px 2px 3px rgba(36,103,23,1), /* Bottom Shadow */
		inset 0 2px 0 1px rgba(201,240,198,1), /* Top Shine */
		0 0 0 2px rgba(0,0,0,1); /* black outside border */
}
.button-green__2020:hover, .button-green__2020:focus, a:focus > .button-green__2020 {
	color:#000;
	background: #37ef26;
	background: -webkit-linear-gradient(#37ef26,#2b8a27);
	background: -moz-linear-gradient(#37ef26,#2b8a27);
	background: linear-gradient(#37ef26,#2b8a27);
	border-radius: 15px;
	-webkit-box-shadow: inset 0 0 0 1px rgba(55,239,38,1), /* Same as top of gradient */
		inset 0 -3px 2px 3px rgba(24,118,7,1), /* Bottom Shadow */
		inset 0 2px 0 1px rgba(239,255,235,1), /* Top Shine */
		0 0 0 2px rgba(0,0,0,1); /* black outside border */
	-moz-box-shadow: inset 0 0 0 1px rgba(55,239,38,1), /* Same as top of gradient */
		inset 0 -3px 2px 3px rgba(24,118,7,1), /* Bottom Shadow */
		inset 0 2px 0 1px rgba(239,255,235,1), /* Top Shine */
		0 0 0 2px rgba(0,0,0,1); /* black outside border */
	box-shadow: inset 0 0 0 1px rgba(55,239,38,1), /* Same as top of gradient */
		inset 0 -3px 2px 3px rgba(24,118,7,1), /* Bottom Shadow */
		inset 0 2px 0 1px rgba(239,255,235,1), /* Top Shine */
		0 0 0 2px rgba(0,0,0,1); /* black outside border */
}
.button-green__2020:active {
	color:#000;
	background: #2b8a27;
	background: -webkit-linear-gradient(#2b8a27,#3bc92e);
	background: -moz-linear-gradient(#2b8a27,#3bc92e);
	background: linear-gradient(#2b8a27,#3bc92e);
	border-radius: 15px;
	-webkit-box-shadow: inset 0 0 0 1px rgba(43,138,39,1), /* Same as top of gradient */
		inset 0 -1px 2px 3px rgba(36,103,23,1), /* Bottom Shadow */
		inset 0 2px 0 1px rgba(201,240,198,1), /* Top Shine */
		0 0 0 2px rgba(0,0,0,1); /* black outside border */
	-moz-box-shadow: inset 0 0 0 1px rgba(43,138,39,1), /* Same as top of gradient */
		inset 0 -1px 2px 3px rgba(36,103,23,1), /* Bottom Shadow */
		inset 0 2px 0 1px rgba(201,240,198,1), /* Top Shine */
		0 0 0 2px rgba(0,0,0,1); /* black outside border */
	box-shadow: inset 0 0 0 1px rgba(43,138,39,1), /* Same as top of gradient */
		inset 0 -1px 2px 3px rgba(36,103,23,1), /* Bottom Shadow */
		inset 0 2px 0 1px rgba(201,240,198,1), /* Top Shine */
		0 0 0 2px rgba(0,0,0,1); /* black outside border */
}
.button-red__2020 {
	color:#fff;
    text-shadow: 0 0 4px #000;
	background: #f0311e;
	background: -webkit-linear-gradient(#f0311e,#ac2f1d);
	background: -moz-linear-gradient(#f0311e,#ac2f1d);
	background: linear-gradient(#f0311e,#ac2f1d);
	border-radius: 15px;
	-webkit-box-shadow: inset 0 0 0 1px rgba(240,49,30,1), /* Same as top of gradient */
		inset 0 -3px 2px 3px rgba(130,14,13,1), /* Bottom Shadow */
		inset 0 2px 0 1px rgba(252,219,214,1), /* Top Shine */
		0 0 0 2px rgba(0,0,0,1); /* black outside border */
	-moz-box-shadow: inset 0 0 0 1px rgba(240,49,30,1), /* Same as top of gradient */
		inset 0 -3px 2px 3px rgba(130,14,13,1), /* Bottom Shadow */
		inset 0 2px 0 1px rgba(252,219,214,1), /* Top Shine */
		0 0 0 2px rgba(0,0,0,1); /* black outside border */
	box-shadow: inset 0 0 0 1px rgba(240,49,30,1), /* Same as top of gradient */
		inset 0 -3px 2px 3px rgba(130,14,13,1), /* Bottom Shadow */
		inset 0 2px 0 1px rgba(252,219,214,1), /* Top Shine */
		0 0 0 2px rgba(0,0,0,1); /* black outside border */
}
.button-red__2020:hover, .button-red__2020:focus, a:focus > .button-red__2020 {
	color:#fff;
	background: #ff3721;
	background: -webkit-linear-gradient(#ff3721,#cf270b);
	background: -moz-linear-gradient(#ff3721,#cf270b);
	background: linear-gradient(#ff3721,#cf270b);
	border-radius: 15px;
	-webkit-box-shadow: inset 0 0 0 1px rgba(255,55,33,1), /* Same as top of gradient */
		inset 0 -3px 2px 3px rgba(143,2,0,1), /* Bottom Shadow */
		inset 0 2px 0 1px rgba(255,245,246,1), /* Top Shine */
		0 0 0 2px rgba(0,0,0,1); /* black outside border */
	-moz-box-shadow: inset 0 0 0 1px rgba(255,55,33,1), /* Same as top of gradient */
		inset 0 -3px 2px 3px rgba(143,2,0,1), /* Bottom Shadow */
		inset 0 2px 0 1px rgba(255,245,246,1), /* Top Shine */
		0 0 0 2px rgba(0,0,0,1); /* black outside border */
	box-shadow: inset 0 0 0 1px rgba(255,55,33,1), /* Same as top of gradient */
		inset 0 -3px 2px 3px rgba(143,2,0,1), /* Bottom Shadow */
		inset 0 2px 0 1px rgba(255,245,246,1), /* Top Shine */
		0 0 0 2px rgba(0,0,0,1); /* black outside border */
}
.button-red__2020:active {
	color:#fff;
	background: #ac2f1d;
	background: -webkit-linear-gradient(#ac2f1d,#f0311e);
	background: -moz-linear-gradient(#ac2f1d,#f0311e);
	background: linear-gradient(#ac2f1d,#f0311e);
	border-radius: 15px;
	-webkit-box-shadow: inset 0 0 0 1px rgba(172,47,29,1), /* Same as top of gradient */
		inset 0 -1px 2px 3px rgba(130,14,13,1), /* Bottom Shadow */
		inset 0 2px 0 1px rgba(252,219,214,1), /* Top Shine */
		0 0 0 2px rgba(0,0,0,1); /* black outside border */
	-moz-box-shadow: inset 0 0 0 1px rgba(172,47,29,1), /* Same as top of gradient */
		inset 0 -1px 2px 3px rgba(130,14,13,1), /* Bottom Shadow */
		inset 0 2px 0 1px rgba(252,219,214,1), /* Top Shine */
		0 0 0 2px rgba(0,0,0,1); /* black outside border */
	box-shadow: inset 0 0 0 1px rgba(172,47,29,1), /* Same as top of gradient */
		inset 0 -1px 2px 3px rgba(130,14,13,1), /* Bottom Shadow */
		inset 0 2px 0 1px rgba(252,219,214,1), /* Top Shine */
		0 0 0 2px rgba(0,0,0,1); /* black outside border */
}
.button-purple__2020 {
	color:#fff;
    text-shadow: 0 0 4px #000;
	background: #9153f3;
	background: -webkit-linear-gradient(#9153f3,#7223b7);
	background: -moz-linear-gradient(#9153f3,#7223b7);
	background: linear-gradient(#9153f3,#7223b7);
	border-radius: 15px;
	-webkit-box-shadow: inset 0 0 0 1px rgba(145,83,243,1), /* Same as top of gradient */
		inset 0 -3px 2px 3px rgba(67,29,112,1), /* Bottom Shadow */
		inset 0 2px 0 1px rgba(225,208,252,1), /* Top Shine */
		0 0 0 2px rgba(0,0,0,1); /* black outside border */
	-moz-box-shadow: inset 0 0 0 1px rgba(145,83,243,1), /* Same as top of gradient */
		inset 0 -3px 2px 3px rgba(67,29,112,1), /* Bottom Shadow */
		inset 0 2px 0 1px rgba(225,208,252,1), /* Top Shine */
		0 0 0 2px rgba(0,0,0,1); /* black outside border */
	box-shadow: inset 0 0 0 1px rgba(145,83,243,1), /* Same as top of gradient */
		inset 0 -3px 2px 3px rgba(67,29,112,1), /* Bottom Shadow */
		inset 0 2px 0 1px rgba(225,208,252,1), /* Top Shine */
		0 0 0 2px rgba(0,0,0,1); /* black outside border */
}
.button-purple__2020:hover, .button-purple__2020:focus, a:focus > .button-purple__2020 {
	color:#fff;
    text-shadow: 0 0 4px #000;
	background: #ac7bff;
	background: -webkit-linear-gradient(#ac7bff,#ad22f6);
	background: -moz-linear-gradient(#ac7bff,#ad22f6);
	background: linear-gradient(#ac7bff,#ad22f6);
	border-radius: 15px;
	-webkit-box-shadow: inset 0 0 0 1px rgba(172,123,255,1), /* Same as top of gradient */
		inset 0 -3px 2px 3px rgba(94,21,174,1), /* Bottom Shadow */
		inset 0 2px 0 1px rgba(253,253,255,1), /* Top Shine */
		0 0 0 2px rgba(0,0,0,1); /* black outside border */
	-moz-box-shadow: inset 0 0 0 1px rgba(172,123,255,1), /* Same as top of gradient */
		inset 0 -3px 2px 3px rgba(94,21,174,1), /* Bottom Shadow */
		inset 0 2px 0 1px rgba(253,253,255,1), /* Top Shine */
		0 0 0 2px rgba(0,0,0,1); /* black outside border */
	box-shadow: inset 0 0 0 1px rgba(172,123,255,1), /* Same as top of gradient */
		inset 0 -3px 2px 3px rgba(94,21,174,1), /* Bottom Shadow */
		inset 0 2px 0 1px rgba(253,253,255,1), /* Top Shine */
		0 0 0 2px rgba(0,0,0,1); /* black outside border */
}
.button-purple__2020:active {
	color:#fff;
    text-shadow: 0 0 4px #000;
	background: #7223b7;
	background: -webkit-linear-gradient(#7223b7,#9153f3);
	background: -moz-linear-gradient(#7223b7,#9153f3);
	background: linear-gradient(#7223b7,#9153f3);
	border-radius: 15px;
	-webkit-box-shadow: inset 0 0 0 1px rgba(114,35,183,1), /* Same as top of gradient */
		inset 0 -1px 2px 3px rgba(67,29,112,1), /* Bottom Shadow */
		inset 0 2px 0 1px rgba(225,208,252,1), /* Top Shine */
		0 0 0 2px rgba(0,0,0,1); /* black outside border */
	-moz-box-shadow: inset 0 0 0 1px rgba(114,35,183,1), /* Same as top of gradient */
		inset 0 -1px 2px 3px rgba(67,29,112,1), /* Bottom Shadow */
		inset 0 2px 0 1px rgba(225,208,252,1), /* Top Shine */
		0 0 0 2px rgba(0,0,0,1); /* black outside border */
	box-shadow: inset 0 0 0 1px rgba(114,35,183,1), /* Same as top of gradient */
		inset 0 -1px 2px 3px rgba(67,29,112,1), /* Bottom Shadow */
		inset 0 2px 0 1px rgba(225,208,252,1), /* Top Shine */
		0 0 0 2px rgba(0,0,0,1); /* black outside border */
}

a:focus > .button-yellow__2020, a:focus > .button-blue__2020, a:focus > .button-green__2020, a:focus > .button-red__2020, a:focus > .button-purple__2020 {
	outline:none !important;
}

.button-default__2020:disabled {
	filter: grayscale(100);
}

.popup-exit {
	width: 40px;
	height: 35px;
	position: absolute;
	right: 5px;
	top: 5px;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 0;
}

.popup-exit-icon {
	background: url(../basic/images/x-icon.svg) center center / contain no-repeat;
	width: 18px;
	height: 20px;
	margin: 5px auto auto;
}`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
