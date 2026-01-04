// ==UserScript==
// @name         MoxxiMod 7 ALPHA
// @namespace    https://studiomoxxi.com/
// @description  one click at a time
// @author       Ben
// @match        *.outwar.com/*
// @version      7.0.1
// @grant        GM_xmlhttpRequest
// @license      MIT
// @run-at       document-start
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @require      http://code.jquery.com/jquery-3.6.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/457665/MoxxiMod%207%20ALPHA.user.js
// @updateURL https://update.greasyfork.org/scripts/457665/MoxxiMod%207%20ALPHA.meta.js
// ==/UserScript==
/* globals jQuery, $, waitForKeyElements */

GM_addStyle ( `
#accordionExample > li:nth-child(8) > a:hover{
	background:#1A1C2D !important;
}
body > center > div.sub-header-container2{
	display:none !important;
}
body > center > div.header-container.fixed-top{
	display:none !important;
}
body > center > div.sub-header-container{
	top:0px !important;
}
#container{
	position: relative !important;
	top: -70px !important;
}
#sidebar{
	position: fixed !important;
	top:50px !important;
}
body > center > div.sub-header-container > header > ul.navbar-nav.flex-row.mr-auto.toolbar-nav > li.nav-item.more-dropdown.little-space.hide-on-mob.progress-top{
	display:none !important;
}
#toolbaralerts > img,#toolbaralerts > a > img{
	margin-right:5px !important;
}
#content > font,#content > div.footer-wrapper{
	display:none !important;
}
body > center > div.sub-header-container > header > ul.navbar-nav.flex-row.mr-auto.toolbar-nav > li:nth-child(4){
	display:none !important;
}
.fasttravel:hover .destinations{
	display: block !important;
}
.destinations {
	display: none;
	position: absolute;
	background-color:#000000;
	max-width: 300px;
	;
	z-index: 1;
	font-size: 12px;
	margin-top: 0px;
	text-align:left !important;
	padding-right:15px !important;
}
.destination-img {
	height:25px !important;
	width:25px !important;
	border:2px SOLID #1A1C2D !important;
	margin:5px !important;
	border-radius:5px !important;
}
#t-text{
	height:40px !important;
}
body {
	color: #888ea8;
	height: 100%;
	font-size: .875rem;
	background: #131313!important;
	overflow-x: hidden;
	overflow-y: auto;
	letter-spacing: .0312rem;
	font-family: nunito,sans-serif;
}
#sidebar{
	background:#0E1726 !important;
	height:100% !important;
	box-shadow: 0 6px 10px 0 rgba(0,0,0,.14),0 1px 18px 0 rgba(0,0,0,.12),0 3px 5px -1px rgba(0,0,0,.2);
}
#divProfile > div.widget.mb-2,#dhtmltooltip{
	background-image:url('https://studiomoxxi.com/ow_themes/custom_jobs/minimal_01/mm_patern.png') !important;
}
#sessidbox{
	margin-left:12px !important;
	padding:6px !important;
}
#sessidbox::selection{
	background:#888ea8 !important;
	color:#000000 !important;
}
body img[src*="gem_green1"] {
	content: url("https://studiomoxxi.com/ow_themes/custom_jobs/classic_01/gem_green.webp") !important;
	width: 13px !important;
}
body img[src*="gem_blue2"] {
	content: url("https://studiomoxxi.com/ow_themes/custom_jobs/classic_01/gem_blue.webp") !important;
	width: 13px !important;
}
body img[src*="gem_red2"] {
	content: url("https://studiomoxxi.com/ow_themes/custom_jobs/classic_01/gem_red.webp") !important;
	width: 13px !important;
}
body img[src*="gem_white2"] {
	content: url("https://studiomoxxi.com/ow_themes/custom_jobs/classic_01/gem_white.webp") !important;
	width: 13px !important;
}
#itemtable>tbody>tr:nth-child(2)>td:nth-child(2)>img:nth-child(8) {
	width: 18px !important;
}
#itemtable>tbody>tr:nth-child(2)>td:nth-child(2)>img:nth-child(9) {
	width: 18px !important;
}
#itemtable>tbody>tr:nth-child(2)>td:nth-child(2)>img:nth-child(10) {
	width: 18px !important;
}
#itemtable>tbody>tr:nth-child(2)>td:nth-child(2)>img:nth-child(11) {
	width: 18px !important;
}
#itemtable>tbody>tr:nth-child(2)>td:nth-child(2)>img:nth-child(12) {
	width: 18px !important;
}
div.footer-wrapper{
	display:none !important;
}
.searchx::placeholder{
	font-size:12px !important;
}
.goto{
	background: #1B2E4B !important;
	border: 1px #1B2E4B SOLID !important;
	color: #FFFFFF !important;
	padding: 6px !important;
	border-radius: 6px !important;
	height:37px !important;
	margin-right:0.5rem !important;
	font-size:28px !important;
}
#content-header-row > div.col-xl-5.col-lg-12.col-md-6.col-sm-12.col-12.layout-spacing.px-1 > div:nth-child(2) > h5{
	margin-bottom:0.5rem !important;
}
.mmplus {
	padding: 0.33rem;
	padding-left:1rem !important;
	padding-right:1rem !important;
	text-shadow: none;
	font-size: 14px;
	color: #3b3f5c;
	font-weight: 400;
	white-space: normal;
	word-wrap: break-word;
	touch-action: manipulation;
	cursor: pointer;
	background-color: #f1f2f3;
	box-shadow: 0 5px 20px 0 rgba(0,0,0,.1);
	will-change: opacity,transform;
	transition: all .3s ease-out;
	-webkit-transition: all .3s ease-out;
	margin-bottom:0.5rem !important;
	margin-top:0.5rem !important;
}
img.robot{
	height:19px !important;
	width:19px !important;
	border:0px !important;
	background:transparent !important;
	margin-left:5px !important;
}
#sliderload{
	display:none !important;
}
.table>tbody tr {
	border-radius: 4px;
	-webkit-transition: all .1s ease;
	transition: all .1s ease;
	border-bottom: 1px solid #131313 !important;
	background: 0 0!important;
}
.list-group-item {
	border: 1px solid #131313 !important;
}
.border-bottom-dashed {
	border-bottom: 1px SOLID #131313;
}
.table>thead {
	border-top: 1px solid #131313;
	border-bottom: 1px solid #131313;
}
#sidebar ul.menu-categories.ps {
	border-right: 0px solid #0e1726 !important;
}
.component-card_4 {
	border: 0px solid #1b2e4b !important;
}
.widget,.widget-content-area,.widget-chart-one {
	-webkit-box-shadow: 0 6px 10px 0 rgba(0,0,0,.75),0 1px 18px 0 rgba(0,0,0,.75),0 3px 5px -1px rgba(0,0,0,.75);
	-moz-box-shadow: 0 6px 10px 0 rgba(0,0,0,.75),0 1px 18px 0 rgba(0,0,0,.75),0 3px 5px -1px rgba(0,0,0,.75);
	box-shadow: 0 6px 10px 0 rgba(0,0,0,.75),0 1px 18px 0 rgba(0,0,0,.75),0 3px 5px -1px rgba(0,0,0,.75);
}
#dropdown {
	border: 2px #131313 SOLID !important;
}
.btn,.input-group,.input-group-prepend,.input-group-text,.btn-info,.btn-group,.dropdown-menu,.btn-primary,.btn-secondary{
	box-shadow: 0px 0px 5px 2px rgba(0,0,0,0.75);
	-webkit-box-shadow: 0px 0px 5px 2px rgba(0,0,0,0.75);
	-moz-box-shadow: 0px 0px 5px 2px rgba(0,0,0,0.75);
}
.btn:hover,.input-group:hover,.input-group-prepend:hover,.input-group-text:hover,.btn-info:hover,.btn-group:hover,.dropdown-menu:hover,.btn-primary:hover,.btn-secondary:hover{
	box-shadow: 0px 0px 5px 2px rgba(0,0,0,0.75);
	-webkit-box-shadow: 0px 0px 5px 2px rgba(0,0,0,0.75);
	-moz-box-shadow: 0px 0px 5px 2px rgba(0,0,0,0.75);
}
.ftslider,.form-control,.advinput,.atkn,.goto{
	box-shadow: 0px 0px 5px 2px rgba(0,0,0,0.75);
	-webkit-box-shadow: 0px 0px 5px 2px rgba(0,0,0,0.75);
	-moz-box-shadow: 0px 0px 5px 2px rgba(0,0,0,0.75)
}
* {
	scrollbar-width: auto;
	scrollbar-color: #050716 #0e1726;
}
*::-webkit-scrollbar {
	width: 10px;
}
*::-webkit-scrollbar-track {
	background: #0e1726;
}
*::-webkit-scrollbar-thumb {
	background-color: #050716;
	border-radius: 0px;
	border: 3px none #ffffff;
}
*::-webkit-scrollbar-thumb:hover {
	background-color: #ffffff;
	border-radius: 0px;
	border: 3px none #ffffff;
}
.robot_small {
	width:17px;
    height:17px;
    margin-left:0.5rem;
}
`)

if (GM_getValue("fixhover") == true){GM_addStyle (`#dhtmltooltip{position:fixed !important;left:195px !important;background-color:#000000 !important;top:60px !important;}`)}
if (GM_getValue("ftmenu") == false){GM_addStyle (`#accordionExample > li.menu.fasttravel{display:none !important;}`)}

if (GM_getValue("wallpaper") != undefined && GM_getValue("bauth_r").match("Full") != null){
var xheight = window.screen.availHeight*1
var xwidth = window.screen.availWidth*1
var wallpaper = GM_getValue("wallpaper")
GM_addStyle (`body{background-image: url("`+wallpaper+`") !important;background-size: `+xwidth+`px `+xheight+`px !important;background-attachment: fixed !important;background-position:center !important;background-repeat:no-repeat !important;}`)}
if (GM_getValue("hex_menu") != undefined && GM_getValue("bauth_r").match("Full") != null){
var hex_menu = GM_getValue("hex_menu").replace("#","")
GM_addStyle (`#destination,#sidebar {background: #`+hex_menu+` !important;}`)}
if (GM_getValue("hex_menutext") != undefined && GM_getValue("bauth_r").match("Full") != null){
var hex_menutext = GM_getValue("hex_menutext").replace("#","")
GM_addStyle (`#sidebar ul.menu-categories li.menu>.dropdown-toggle svg,#sidebar ul.menu-categories li.menu>.dropdown-toggle {color: #`+hex_menutext+` !important;}`)}
if (GM_getValue("hex_link") != undefined && GM_getValue("bauth_r").match("Full") != null){
var hex_link = GM_getValue("hex_link").replace("#","")
GM_addStyle (`#content-header-row > div > table > tbody > tr > td > a > font,a {color: #`+hex_link+` !important;}`)}
if (GM_getValue("hex_linkhover") != undefined && GM_getValue("bauth_r").match("Full") != null){
var hex_linkhover = GM_getValue("hex_linkhover").replace("#","")
GM_addStyle (`a:hover {color: #`+hex_linkhover+` !important;}`)}
if (GM_getValue("hex_tool") != undefined && GM_getValue("bauth_r").match("Full") != null){
var hex_tool = GM_getValue("hex_tool").replace("#","")
GM_addStyle (`#dropdown,body > center > div.sub-header-container > header {background: #`+hex_tool+` !important;}`)}
if (GM_getValue("hex_content") != undefined && GM_getValue("bauth_r").match("Full") != null){
var hex_content = GM_getValue("hex_content").replace("#","")
GM_addStyle (`#sidebar ul.menu-categories li.menu>.dropdown-toggle:hover,.alert-gradient,.component-card_4,.widget,.widget-content,.widget.box, .widget-header {background: #`+hex_content+` !important;}`)}
if (GM_getValue("hex_table") != undefined && GM_getValue("bauth_r").match("Full") != null){
var hex_table = GM_getValue("hex_table").replace("#","")
GM_addStyle (`#content > div.layout-px-spacing,.wquesttable,.list-group-item,.nav-link.active,.skillsbox,.table {background-color: #`+hex_table+` !important;}`)}
if (GM_getValue("hex_track") != undefined && GM_getValue("hex_slide") != undefined && GM_getValue("bauth_r").match("Full") != null){
var hex_track = GM_getValue("hex_track").replace("#","")
var hex_slide = GM_getValue("hex_slide").replace("#","")
GM_addStyle (`* {scrollbar-color: #`+hex_slide+` #`+hex_track+`;}
*::-webkit-scrollbar-track {background: #`+hex_track+`;}
*::-webkit-scrollbar-thumb {background-color: #`+hex_slide+`;}`)}
if (GM_getValue("hex_text") != undefined && GM_getValue("bauth_r").match("Full") != null){
var hex_text = GM_getValue("hex_text").replace("#","")
GM_addStyle (`.list-group.list-group-media,.list-group.list-group-media,.list-group-item,.media,.media-body,h6,h5,h4,h3,.list-group-item,.media,.media-body,p,.table>tbody>tr>td,body,.list-group-item,.bio,.widget,.widget-content-area {color: #`+hex_text+` !important;}`)}
if (GM_getValue("hex_box") != undefined && GM_getValue("bauth_r").match("Full") != null){
var hex_box = GM_getValue("hex_box").replace("#","")
GM_addStyle (`.ftslider,#sidebar ul.menu-categories li.menu>.dropdown-toggle[aria-expanded=true]:not([data-active=true]),.form-control,.advinput,.atkn,.goto {background: #`+hex_box+` !important;border:0px !important;}`)}

if (document.URL.indexOf("home") != -1 && (document.URL.indexOf("crew_home") == -1)) {
GM_addStyle (`
img.boss,img.rga,img.god,img.mob,img.char,img.raid,img.glad{
	width:126px !important;
	height:126px !important;
	margin: 15px !important;
	-moz-box-shadow: 5px 5px 5px #000000;
	-webkit-box-shadow: 5px 5px 5px #000000;
	box-shadow: 5px 5px 5px #000000;
	-moz-border-radius:5px;
	-webkit-border-radius:5px;
	border-radius:5px;
}
#content-header-row > div.bio.col-lg-8.col-md-8.col-sm-12.col-12.layout-spacing.layout-spacing > div.widget-content.widget-content-area.text-left > h3{
	display:none !important;
}
#content-header-row > div.bio.col-lg-8.col-md-8.col-sm-12.col-12.layout-spacing.layout-spacing > div.widget-content.widget-content-area.text-left > div > div > div:nth-child(1) > div > div > div > div.w-100 > div{
	height:200px !important;
}
#content-header-row > div.bio.col-lg-8.col-md-8.col-sm-12.col-12.layout-spacing.layout-spacing > div.widget-content.widget-content-area.text-left > div > div > div:nth-child(2) > div > div:nth-child(1) > div > div.w-100 > div{
	height:300px !important;
}
#content-header-row > div.bio.col-lg-8.col-md-8.col-sm-12.col-12.layout-spacing.layout-spacing > div.widget-content.widget-content-area.text-left > div > div > div:nth-child(2) > div > div:nth-child(2) > div > div.w-100 > div{
	height:945px !important;
}
td.rankings{
	vertical-align:top !important;
	padding:5px !important;
}
#charele, #charpower, #charchaos{
	height:345px !important;
	width:254px !important;
	overflow-y:auto !important;
	font-size:10px !important;
}
#charele > li,#charpower > li,#charchaos > li{
	padding:0px !important;
}
#expchart{
	height:485px !important;
	overflow-y:auto !important;
	font-size:10px !important;
}
#divSBPost{
	display:none !important;
}
.ranking_div{
	border:1px SOLID #888ea8;
	padding:3px !important;
}
img.loading{
	text-align:center !important;
}
div.tiles{
	text-align: left !important;
	min-height:225px !important;
}
div.rankings{
	text-align: left !important;
	height:440px !important;
}
img.loader{
	width:80px;
	height:80px;
}
#content-header-row > div.bio.col-lg-8.col-md-8.col-sm-12.col-12.layout-spacing.layout-spacing > div.widget-content.widget-content-area.text-left > div > div > div > div > div > div{
	background:transparent !important;
}
#content-header-row > div.bio.col-lg-8.col-md-8.col-sm-12.col-12.layout-spacing.layout-spacing > div.widget-content.widget-content-area.text-left > div > div > div > div > div > div > div.w-100 > div{
	border:1px SOLID #888ea8 !important;
	-moz-box-shadow: 5px 5px 5px #000000;
	-webkit-box-shadow: 5px 5px 5px #000000;
	box-shadow: 5px 5px 5px #000000;
	-moz-border-radius:5px;
	-webkit-border-radius:5px;
	border-radius:5px;
}
#content > div.layout-px-spacing{
	background:transparent !important;
	box-shadow: 0px 0px 0px #000000,-0px -0px 0px #000000 !important;
}
#charele,#charpower,#charchaos,#content-header-row > div.col-lg-4.col-md-4.col-sm-12.col-12.layout-spacing.layout-spacing > div.widget.widget-table-one > div.widget-content.text-left > form {
	border: 1px SOLID #888ea8 !important;
	-moz-box-shadow: 5px 5px 5px #000000;
	-webkit-box-shadow: 5px 5px 5px #000000;
	box-shadow: 5px 5px 5px #000000;
	-moz-border-radius: 5px;
	-webkit-border-radius: 5px;
	border-radius: 5px;
}
`)}

if (document.URL.indexOf("profile") != -1 && document.URL.indexOf("crew_profile") == -1) {
GM_addStyle (`
.layout-spacing{min-width:0px !important;}
#divHeaderName > font{text-transform: uppercase;font-size: 1.5em;font-weight: bold;margin-bottom: 1rem;}
#plinks{text-align:center;padding:0.2em}
#content > div > div:nth-child(1) > div:nth-child(4){text-align:left;}
#content > div > div:nth-child(1){max-width:350px !important;}
#content > div > div:nth-child(2){max-width:900px !important;}
.widget{padding:10px !important;}
#divSkillsCast > img{margin:3px;margin-bottom:20px;width:50px !important;height:50px !important;box-shadow: 0px 0px 3px 3px rgba(000,000,000,0.25);outline: 1px SOLID #303536 !important;outline-offset: -1px !important;}
#UnderlingTable > thead > tr > th{padding:10px;margin:5px;margin-top:10px}
#UnderlingTable > tbody > tr > td{padding:10px;margin:5px}
#content > div > div:nth-child(2) > div:nth-child(5) > div > a > img,#content > div > div:nth-child(2) > div:nth-child(4) > div > a > img{width:150px !important;height:80px !important;}
#content > div > div:nth-child(2) > div:nth-child(5) > div > h5,#content > div > div:nth-child(2) > div:nth-child(4) > div > h5{margin-bottom:1rem !important;}
#pbuttons{margin-top:1rem !important;}
.bg-secondary, .bg-success, .bg-primary, .bg-danger, .bg-warning{background-color: #E7515A !important;border-color: #E7515A ;color: #fff;}
#content > div > div:nth-child(2) > div:nth-child(4) > div > a > img{border:1px SOLID #2C2F30 !important;border-radius:10px !important;}
#content > div > div:nth-child(2) > div:nth-child(5) > div > a > img{border:1px SOLID #2C2F30 !important;border-radius:10px !important;}
`)}

if (document.URL.indexOf("godstatus") != -1 ) {
GM_addStyle ( `
#content-header-row > h2{background:none !important;}
hr.hr {border-top: 1px solid #ffffff;margin: 3px;}
#content-header-row > div{display: none !important;}
.centered {position: absolute !important;top: 50% !important;left: 50% !important;transform: translate(-50%, -50%) !important;}
.godstatus > tbody > tr > td > div {font-size: 14px !important;}
.godbox {position: relative !important;text-align: center !important;color: white !important;}
#content > div.layout-px-spacing{background:transparent !important;box-shadow: 0px 0px 0px #000000,-0px -0px 0px #000000 !important;}
#content-header-row > h2 > table > tbody > tr > td > div > img{-webkit-box-shadow: 0 6px 10px 0 rgba(0,0,0,.75),0 1px 18px 0 rgba(0,0,0,.75),0 3px 5px -1px rgba(0,0,0,.75) !important;-moz-box-shadow: 0 6px 10px 0 rgba(0,0,0,.75),0 1px 18px 0 rgba(0,0,0,.75),0 3px 5px -1px rgba(0,0,0,.75) !important;box-shadow: 0 6px 10px 0 rgba(0,0,0,.75),0 1px 18px 0 rgba(0,0,0,.75),0 3px 5px -1px rgba(0,0,0,.75) !important;}
`)}

if (document.URL.indexOf("plrattack") != -1 && window.self !== window.top) {
GM_addStyle (`
#health{position:fixed !important;top:0px !important;left:0px !important;background:#0E1726 !important;border:1px SOLID !important;padding:10px !important;width:100% !important;-webkit-box-shadow: 0 6px 10px 0 rgba(0,0,0,.14),0 1px 18px 0 rgba(0,0,0,.12),0 3px 5px -1px rgba(0,0,0,.2);-moz-box-shadow: 0 6px 10px 0 rgba(0,0,0,.14),0 1px 18px 0 rgba(0,0,0,.12),0 3px 5px -1px rgba(0,0,0,.2);box-shadow: 0 6px 10px 0 rgba(0,0,0,.14),0 1px 18px 0 rgba(0,0,0,.12),0 3px 5px -1px rgba(0,0,0,.2);}
#sidebar{display:none !important;}
body > center > div.sub-header-container{display:none !important;}
#content-header-row > center > table{display:none !important;}
#result_notice_window{display:none !important;}
#battle_result{background:none !important;}
body{background:#0E1726 !important;padding:50px !important;}
body img[src*="goldcoin"]{display:none !important;}
#content {margin-top: 90px !important;transition: 0s !important;}
#auth_response{display:none !important;}
`)}

document.addEventListener ("DOMContentLoaded", DOM_ContentReady);
function DOM_ContentReady () {

function insertAfter(newNode, existingNode) {
existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);}

var char1 = '';
if (document.querySelector("#charselectdropdown > optgroup:nth-child(1) > option:nth-child(25)") != null)
{char1 = document.querySelector("#charselectdropdown > optgroup:nth-child(1) > option:nth-child(25)").innerHTML}
var charid = document.querySelector("body").innerHTML.match(/<option value="([0-9]+)" selected=""/i)[1]
var server = '';
if (document.querySelector("body").innerHTML.match(/serverid=([0-9]+)/i)[1] == 1){server = "sigil"}
if (document.querySelector("body").innerHTML.match(/serverid=([0-9]+)/i)[1] == 2){server = "torax"}
var sendmobid = "";
var sendmobattacks = "";
var brawlcop_string = ""
var atk10x_charid = ""
var auth = '';
var error = '';
if (document.querySelector("#content-header-row").innerHTML.match(`/images/ErrorImg.jpg`) != null) {error = true}
if (document.querySelector("#content-header-row").innerHTML.match(`/images/ErrorImg.jpg`) == null) {error = false}

if (document.URL.indexOf("treasury.php?type=vision") != -1 && error == false) {

var mv_mobs_post = '';

$("body").append ( `
<div id="Xmoxxivision">
LOADING GREATNESS: <span id="loading">0</span>%<p>
</div>
` );

$("body").append ( `
<div id="vision">
<span id="loading_chars"></span><p>
</div>
` );

$("body").append ( `
<div id="mv2">
MOXXI
</div>
` );

GM_addStyle ( `
#mv2 {position:fixed !important; left: 0px !important; top: 10px !important;font-size: 15vw !important;width: 100% !important;height: 100% !important;z-index:-100 !important;color:#0F0F0F !important;writing-mode: vertical-rl;}
#moxxivision {display:none !important;}
#sidebar{display:none;}
#recentraid{display:none;}
#rightbar{display:none;}
#container{position: relative !important; top: 0px !important;}
#charid{display:none !important;}
#moxxivision > tbody > tr > th{padding-top:3px;padding-bottom:3px;padding-left:5px;padding-right:10px;background:#1A1C2D;border:1px SOLID #202020;font-size:12px}
#moxxivision > tbody > tr > td{padding-top:3px;padding-bottom:3px;padding-left:5px;padding-right:10px;background:#0F0F0F;border:1px SOLID #202020;font-size:12px}
#container > div.sidebar-wrapper.sidebar-theme{display:none;}
.column > img{height:30px; width:30px; background:#060606;border: 1px solid #666666;}
.column {display:none !important;}
.home {display:revert !important;}
.spans > p{color:#666666 !important;font-size:10px !important;margin-bottom:-5px !important;}
#content{position: relative;width: 100%;flex-grow: 8;margin-top: 0px;margin-bottom: 0;margin-left: 0px;max-width: 100%;transition: .6s;}
#container {position: relative !important;margin-top: 70px !important;}
.column_button{background:#0F0F0F !important;color:#ffffff !important;padding:1px !important;font-size:9px !important;padding-right:3px !important;padding-left:3px !important;border-radius:2px !important;}
#Xmoxxivision {position:fixed !important; left: 0px !important; top: 0px !important;padding:100px !important;background:#0F0F0F !important;font-size: 28px !important;width: 100% !important;height: 100% !important;}
#vision {position:fixed !important; left: 20px !important; top: 200px !important;font-size: 10vw !important;width: 100% !important;z-index:100 !important;}
.mv2dd {position: relative;display: inline-block;}
.vision-content {text-align: center !important;display: none;position: absolute;background-color: #0F0F0F;min-width: 200px;z-index: 1;font-size: 12px;padding:0.5rem !important;border-radius:5px !important;box-shadow: 0px 0px 5px 6px rgba(0,0,0,0.75);-webkit-box-shadow: 0px 0px 5px 6px rgba(0,0,0,0.75);-moz-box-shadow: 0px 0px 5px 6px rgba(0,0,0,0.75);}
.vision-content a {color: black;text-decoration: none;display: block;}
.vision-content a:hover {background-color: #f1f1f1}
.mv2dd:hover .vision-content {display: block;}
.upgrade{background:#1B2E4B !important;}
#loading_chars{color:#202020}
body{overflow-y: hidden;}
#dropmenudiv{display:none !important;}
#gotolink{display:none !important;position:absolute;top:150px;left:150px;}
.btn {padding: 0.25rem;padding-left:0.25rem !important;padding-right:0.25rem !important;text-shadow: none;font-size: 14px;font-weight: 400;white-space: normal;word-wrap: break-word;touch-action: manipulation;cursor: pointer;background-color: #f1f2f3;box-shadow: 0 5px 20px 0 rgba(0,0,0,.1);will-change: opacity,transform;transition: all .3s ease-out;-webkit-transition: all .3s ease-out;margin-bottom:0.5rem !important;margin-top:0.5rem !important;margin-right:0.2rem !important;margin-left:0.2rem !important;box-shadow: 0px 0px 1px 1px rgba(0,0,0,0.50);-webkit-box-shadow: 0px 0px 1px 1px rgba(0,0,0,0.50);-moz-box-shadow: 0px 0px 1px 1px rgba(0,0,0,0.50);}
#button{display:inline !important;}
`);

fetch("myaccount")
  .then(res => res.text())
  .then((responseText) => {
    const doc = new DOMParser().parseFromString(responseText, 'text/html');
    const chars = doc.querySelector("#zero-config").innerHTML.matchAll(/suid=([0-9]+)&amp;serverid=[0-9]+"><strong>PLAY!/g)

var charids = '';
for (const match of chars) {charids += `<tr><td id="charid">`+match[1]+`</td></tr>`}

var content = document.querySelector("#content")

content.innerHTML = `

<div id="button">
<button id='button1' class='btn btn-primary'>HOME</button>
<button id='button2' class='btn btn-primary'>STATS</button>
<button id='button3' class='btn btn-primary'>SKILLS</button>
<button id='button26' class='btn btn-primary'>WORLD</button>
<div class="mv2dd">
<button id='buttoneq' class='btn btn-primary'>ITEMS</button>
<div class="vision-content">
<button id='button4' class='btn btn-primary'>EQUIPPED</button>
<button id='button25' class='btn btn-primary'>BACKPACK</button>
<button id='button21' class='btn btn-primary'>QUEST</button>
<button id='button31' class='btn btn-primary'>EQUIPMENT</button>
<button id='button35' class='btn btn-primary'>VAULT</button>
<button id='button30' class='btn btn-primary'>TREASURY</button>
<button id='button32' class='btn btn-primary'>AUGS</button>
<button id='button33' class='btn btn-primary' onmouseover="popup(event,'MR-UP is a value based on the max rage gained per point spent on the next gem. A higher MR-UP value indicates more efficient max rage gains when purchasing gems')" onmouseout="kill()">MR-UP</button>
</div></div>
<div class="mv2dd">
<button class="btn btn-primary">SLOTS</button>
<div class="vision-content">
<button id='button5' class='btn btn-primary'>CORE</button>
<button id='button6' class='btn btn-primary'>HEAD</button>
<button id='button7' class='btn btn-primary'>NECK</button>
<button id='button8' class='btn btn-primary'>WEAPON</button>
<button id='button9' class='btn btn-primary'>BODY</button>
<button id='button10' class='btn btn-primary'>SHIELD</button>
<button id='button11' class='btn btn-primary'>PANTS</button>
<button id='button12' class='btn btn-primary'>BELT</button>
<button id='button13' class='btn btn-primary'>RING</button>
<button id='button14' class='btn btn-primary'>FOOT</button>
</div></div>
<div class="mv2dd">
<button class="btn btn-primary">UTILITY</button>
<div class="vision-content">
<button id='button15' class='btn btn-primary'>GEM</button>
<button id='button16' class='btn btn-primary'>RUNE</button>
<button id='button17' class='btn btn-primary'>ORB</button>
<button id='button18' class='btn btn-primary'>BADGE</button>
<button id='button19' class='btn btn-primary'>BOOSTER</button>
<button id='button20' class='btn btn-primary'>CREST</button>
</div></div>
<div class="mv2dd">
<button class="btn btn-primary">POTIONS</button>
<div class="vision-content">
<button id='button27' class='btn btn-primary'>TRADABLE</button>
<button id='button22' class='btn btn-primary'>GENERIC</button>
<button id='button28' class='btn btn-primary'>PREMIUM</button>
<button id='button29' class='btn btn-primary'>RARE</button>
<button id='button34' class='btn btn-primary'>MISC</button>
</div></div>
<button id='button36' class='btn btn-primary'>MOBS</button>
<button id='button23' class='btn btn-primary'>COLLECTIONS</button>
<button id='button24' class='btn btn-primary'><a href='home'>EXIT</a></button>

<br>

<table><tr>
<td class="home stats column"><button id='buttony' class='btn btn-primary'>LVL HIGHLIGHTER</button></td>
<td class="home column"><button id='buttonx' class='btn btn-primary'>MAX ALL SUPPLIES</button></td>

<td class="crests mobs column">
<div class="mv2dd">
<button class="btn btn-primary">HOVOK</button>
<div class="vision-content">
<button id='sel_hovok' class='btn btn-primary'>SELECT ALL<img src="https://studiomoxxi.com/moxximod/bot.png" class="robot" onmouseover="popup(event,'<b><font color=#f441be>MoxxiMod+</font></b><br>Select all Hovok boxes')" onmouseout="kill()"></button>
<button id='desel_hovok' class='btn btn-primary'>DESELECT ALL<img src="https://studiomoxxi.com/moxximod/bot.png" class="robot" onmouseover="popup(event,'<b><font color=#f441be>MoxxiMod+</font></b><br>Deselect all Hovok boxes')" onmouseout="kill()"></button>
</div></div>
</td>

<td class="bdge mobs column">
<div class="mv2dd">
<button class="btn btn-primary">CORVOK</button>
<div class="vision-content">
<button id='sel_corvok' class='btn btn-primary'>SELECT ALL<img src="https://studiomoxxi.com/moxximod/bot.png" class="robot" onmouseover="popup(event,'<b><font color=#f441be>MoxxiMod+</font></b><br>Select all Corvok boxes')" onmouseout="kill()"></button>
<button id='desel_corvok' class='btn btn-primary'>DESELECT ALL<img src="https://studiomoxxi.com/moxximod/bot.png" class="robot" onmouseover="popup(event,'<b><font color=#f441be>MoxxiMod+</font></b><br>Deselect all Corvok boxes')" onmouseout="kill()"></button>
</div></div>
</td>

<td class="bdge mobs column">
<div class="mv2dd">
<button class="btn btn-primary">SKITTOR</button>
<div class="vision-content">
<button id='sel_skittor' class='btn btn-primary'>SELECT ALL<img src="https://studiomoxxi.com/moxximod/bot.png" class="robot" onmouseover="popup(event,'<b><font color=#f441be>MoxxiMod+</font></b><br>Select all Skittor boxes')" onmouseout="kill()"></button>
<button id='desel_skittor' class='btn btn-primary'>DESELECT ALL<img src="https://studiomoxxi.com/moxximod/bot.png" class="robot" onmouseover="popup(event,'<b><font color=#f441be>MoxxiMod+</font></b><br>Deselect all Skittor boxes')" onmouseout="kill()"></button>
</div></div>
</td>

<td class="bdge mobs column">
<div class="mv2dd">
<button class="btn btn-primary">ROENOV</button>
<div class="vision-content">
<button id='sel_roenov' class='btn btn-primary'>SELECT ALL<img src="https://studiomoxxi.com/moxximod/bot.png" class="robot" onmouseover="popup(event,'<b><font color=#f441be>MoxxiMod+</font></b><br>Select all Roenov boxes')" onmouseout="kill()"></button>
<button id='desel_roenov' class='btn btn-primary'>DESELECT ALL<img src="https://studiomoxxi.com/moxximod/bot.png" class="robot" onmouseover="popup(event,'<b><font color=#f441be>MoxxiMod+</font></b><br>Deselect all Roenov boxes')" onmouseout="kill()"></button>
</div></div>
</td>

<td class="bdge mobs column">
<div class="mv2dd">
<button class="btn btn-primary">ERGON</button>
<div class="vision-content">
<button id='sel_ergon' class='btn btn-primary'>SELECT ALL<img src="https://studiomoxxi.com/moxximod/bot.png" class="robot" onmouseover="popup(event,'<b><font color=#f441be>MoxxiMod+</font></b><br>Select all Ergon boxes')" onmouseout="kill()"></button>
<button id='desel_ergon' class='btn btn-primary'>DESELECT ALL<img src="https://studiomoxxi.com/moxximod/bot.png" class="robot" onmouseover="popup(event,'<b><font color=#f441be>MoxxiMod+</font></b><br>Deselect all Ergon boxes')" onmouseout="kill()"></button>
</div></div>
</td>

<td class="bdge mobs column">
<div class="mv2dd">
<button class="btn btn-primary">DEFIANT</button>
<div class="vision-content">
<button id='sel_defiant' class='btn btn-primary'>SELECT ALL<img src="https://studiomoxxi.com/moxximod/bot.png" class="robot" onmouseover="popup(event,'<b><font color=#f441be>MoxxiMod+</font></b><br>Select all Defiant Warlord boxes')" onmouseout="kill()"></button>
<button id='desel_defiant' class='btn btn-primary'>DESELECT ALL<img src="https://studiomoxxi.com/moxximod/bot.png" class="robot" onmouseover="popup(event,'<b><font color=#f441be>MoxxiMod+</font></b><br>Deselect all Defiant Warlord boxes')" onmouseout="kill()"></button>
</div></div>
</td>

<td class="bdge mobs column">
<div class="mv2dd">
<button class="btn btn-primary">ENDURING</button>
<div class="vision-content">
<button id='sel_enduring' class='btn btn-primary'>SELECT ALL<img src="https://studiomoxxi.com/moxximod/bot.png" class="robot" onmouseover="popup(event,'<b><font color=#f441be>MoxxiMod+</font></b><br>Select all Enduring Warlord boxes')" onmouseout="kill()"></button>
<button id='desel_enduring' class='btn btn-primary'>DESELECT ALL<img src="https://studiomoxxi.com/moxximod/bot.png" class="robot" onmouseover="popup(event,'<b><font color=#f441be>MoxxiMod+</font></b><br>Deselect all Enduring Warlord boxes')" onmouseout="kill()"></button>
</div></div>
</td>

<td class="bdge mobs column">
<div class="mv2dd">
<button class="btn btn-primary">PERPETUAL</button>
<div class="vision-content">
<button id='sel_perpetual' class='btn btn-primary'>SELECT ALL<img src="https://studiomoxxi.com/moxximod/bot.png" class="robot" onmouseover="popup(event,'<b><font color=#f441be>MoxxiMod+</font></b><br>Select all Perpetual Warlord boxes')" onmouseout="kill()"></button>
<button id='desel_perpetual' class='btn btn-primary'>DESELECT ALL<img src="https://studiomoxxi.com/moxximod/bot.png" class="robot" onmouseover="popup(event,'<b><font color=#f441be>MoxxiMod+</font></b><br>Deselect all Perpetual Warlord boxes')" onmouseout="kill()"></button>
</div></div>
</td>

<td class="bdge column">
<button id='mv_badgereport' class='btn btn-primary'>BADGE REPORT<img src="https://studiomoxxi.com/moxximod/bot.png" class="robot" onmouseover="popup(event,'<b><font color=#f441be>MoxxiMod+</font></b><br>Generate a report of all badge quest needs on the RGA')" onmouseout="kill()"></button>
</td>

<td class="gem mobs column">
<div class="mv2dd">
<button class="btn btn-primary">DELUGED</button>
<div class="vision-content">
<button id='sel_deluged' class='btn btn-primary'>SELECT ALL<img src="https://studiomoxxi.com/moxximod/bot.png" class="robot" onmouseover="popup(event,'<b><font color=#f441be>MoxxiMod+</font></b><br>Select all Deluged Choas Golem boxes')" onmouseout="kill()"></button>
<button id='desel_deluged' class='btn btn-primary'>DESELECT ALL<img src="https://studiomoxxi.com/moxximod/bot.png" class="robot" onmouseover="popup(event,'<b><font color=#f441be>MoxxiMod+</font></b><br>Deselect all Deluged Choas Golem boxes')" onmouseout="kill()"></button>
</div></div>
</td>

<td class="gem mobs column">
<div class="mv2dd">
<button class="btn btn-primary">SEEPING</button>
<div class="vision-content">
<button id='sel_seeping' class='btn btn-primary'>SELECT ALL<img src="https://studiomoxxi.com/moxximod/bot.png" class="robot" onmouseover="popup(event,'<b><font color=#f441be>MoxxiMod+</font></b><br>Select all Seeping Chaos Golem boxes')" onmouseout="kill()"></button>
<button id='desel_seeping' class='btn btn-primary'>DESELECT ALL<img src="https://studiomoxxi.com/moxximod/bot.png" class="robot" onmouseover="popup(event,'<b><font color=#f441be>MoxxiMod+</font></b><br>Deselect all Seeping Chaos Golem boxes')" onmouseout="kill()"></button>
</div></div>
</td>

<td class="gem mobs column">
<div class="mv2dd">
<button class="btn btn-primary">VOLATILE</button>
<div class="vision-content">
<button id='sel_volatile' class='btn btn-primary'>SELECT ALL<img src="https://studiomoxxi.com/moxximod/bot.png" class="robot" onmouseover="popup(event,'<b><font color=#f441be>MoxxiMod+</font></b><br>Select all Volatile Chaos Golem boxes')" onmouseout="kill()"></button>
<button id='desel_volatile' class='btn btn-primary'>DESELECT ALL<img src="https://studiomoxxi.com/moxximod/bot.png" class="robot" onmouseover="popup(event,'<b><font color=#f441be>MoxxiMod+</font></b><br>Deselect all Volatile Chaos Golem boxes')" onmouseout="kill()"></button>
</div></div>
</td>

<td class="gem bdge crests mobs column">
<button id='atk_mv_mobs' class='btn btn-primary gem bdge crests mobs column'>ATTACK<img src="https://studiomoxxi.com/moxximod/bot.png" class="robot" onmouseover="popup(event,'<b><font color=#f441be>MoxxiMod+</font></b><br>Attack selected mobs')" onmouseout="kill()"></button>
</td>

<td class="gem column">
<button id='mv_chaosreport' class='btn btn-primary gem column'>CHAOS REPORT<img src="https://studiomoxxi.com/moxximod/bot.png" class="robot" onmouseover="popup(event,'<b><font color=#f441be>MoxxiMod+</font></b><br>Generate a report of all chaos quest needs on the RGA')" onmouseout="kill()"></button>
</td>

</tr></table>

</div>

<table id="moxxivision"><tr>
<th id="charid">CHAR ID</th>
<th class="freeze">CHAR NAME&#9662;</th>
<th class="freeze">LVL&#9662;<span id="math_lvl" class="spans"></span></th>
<th class="home skills column">SKILLS&#9662;</th>
<th class="home column">CLASS&#9662;</th>
<th class="home world column">CREW&#9662;</th>
<th class="home column">EQ&#9662;</th>
<th class="home column">RAGE&#9662;</th>
<th class="home column">TO MAX&#9662;</th>
<th class="home column">GROWTH TODAY&#9662;<span id="math_today" class="spans"></span></th>
<th class="home column">YESTERDAY&#9662;<span id="math_yesterday" class="spans"></span></th>
<th class="home column">STRENGTH&#9662;</th>
<th class="home column">SUPPLIES&#9662;</th>
<th class="stats column">EXPERIENCE&#9662;</th>
<th class="stats column">TO LEVEL&#9662;</th>
<th class="stats column">MAX RAGE&#9662;<span id="math_mr" class="spans"></span></th>
<th class="stats column">POWER&#9662;<span id="math_power" class="spans"></span></th>
<th class="stats column">ELE DMG&#9662;<span id="math_ele" class="spans"></span></th>
<th class="stats column">ATTACK&#9662;<span id="math_atk" class="spans"></span></th>
<th class="stats column">HIT POINTS&#9662;<span id="math_hp" class="spans"></span></th>
<th class="stats column">CHAOS&#9662;<span id="math_chaos" class="spans"></span></th>
<th class="stats column"><font color=#00FFFF>RES&#9662;</th>
<th class="stats column"><font color=#FFFF00>RES&#9662;</th>
<th class="stats column"><font color=#7e01bc>RES&#9662;</th>
<th class="stats column"><font color=#FF0000>RES&#9662;</th>
<th class="stats column"><font color=#00FF00>RES&#9662;</th>
<th class="stats column">WILDERNESS&#9662;<span id="math_wilderness" class="spans"></span></th>
<th class="stats column">SLAYER&#9662;<span id="math_slayer" class="spans"></span></th>
<th class="skills column">TOME&#9662;</th>
<th class="skills column">ACTIVE</th>
<th class="world column">ROOM&#9662;</th>
<th class="world column">NUM&#9662;</th>
<th class="world column">MOBS&#9662;</th>
<th class="eq column">CORE</th>
<th class="eq column">HEAD</th>
<th class="eq column">NECK</th>
<th class="eq column">WEP</th>
<th class="eq column">BODY</th>
<th class="eq column">SHIELD</th>
<th class="eq column">PANTS</th>
<th class="eq column">BELT</th>
<th class="eq column">RING</th>
<th class="eq column">FOOT</th>
<th class="eq column">GEM</th>
<th class="eq column">RUNE</th>
<th class="eq column">ORB</th>
<th class="eq column">ORB</th>
<th class="eq column">ORB</th>
<th class="eq column">BADGE</th>
<th class="eq column">BOOST</th>
<th class="eq column">CLONED&#9662;</th>
<th class="eq column">OPEN AUG&#9662;<span id="math_openaugs" class="spans"></span></th>
<th class="alleq column">EQUIPMENT (MOUSEOVER FOR DETAILS)</th>
<th class="augs column">AUGMENTS (MOUSEOVER FOR DETAILS)</th>
<th class="backpack column">ITEMS&#9662;</th>
<th class="backpack column">CAP&#9662;</th>
<th class="backpack column">BACKPACK</th>
<th class="vault column">VAULT (MOUSEOVER FOR DETAILS)</th>
<th class="core mrup column">ITEM</th>
<th class="core column">AUGS</th>
<th class="core column">NAME&#9662;</th>
<th class="core column">MR&#9662;</th>
<th class="core column">ATK&#9662;</th>
<th class="core column">ELE&#9662;</th>
<th class="core column">CHAOS&#9662;</th>
<th class="core column">VILE&#9662;</th>
<th class="core column">HP&#9662;</th>
<th class="core column">RES&#9662;</th>
<th class="core column"><i class="fas fa-shield-alt"></i>&#9662;</th>
<th class="core column">ELE <i class="fas fa-shield-alt"></i>&#9662;</th>
<th class="core column">RPT&#9662;</th>
<th class="core column">EPT&#9662;</th>
<th class="core column">RAMP&#9662;</th>
<th class="core column">CRIT&#9662;</th>
<th class="core column">GEMS&#9662;</th>
<th class="core column">OPEN<br>AUGS&#9662;</th>
<th class="core mrup column" onmouseover="popup(event,'MR-UP is a value based on the max rage gained per point spent on the next gem. A higher MR-UP value indicates more efficient max rage gains when purchasing gems')" onmouseout="kill()">MR-UP&#9662;</th>
<th class="head mrup column">ITEM</th>
<th class="head column">AUGS</th>
<th class="head column">NAME&#9662;</th>
<th class="head column">MR&#9662;</th>
<th class="head column">ATK&#9662;</th>
<th class="head column">ELE&#9662;</th>
<th class="head column">CHAOS&#9662;</th>
<th class="head column">VILE&#9662;</th>
<th class="head column">HP&#9662;</th>
<th class="head column">RES&#9662;</th>
<th class="head column"><i class="fas fa-shield-alt"></i>&#9662;</th>
<th class="head column">ELE <i class="fas fa-shield-alt"></i>&#9662;</th>
<th class="head column">RPT&#9662;</th>
<th class="head column">EPT&#9662;</th>
<th class="head column">RAMP&#9662;</th>
<th class="head column">CRIT&#9662;</th>
<th class="head column">GEMS&#9662;</th>
<th class="head column">OPEN<br>AUGS&#9662;</th>
<th class="head mrup column" onmouseover="popup(event,'MR-UP is a value based on the max rage gained per point spent on the next gem. A higher MR-UP value indicates more efficient max rage gains when purchasing gems')" onmouseout="kill()">MR-UP&#9662;</th>
<th class="neck mrup column">ITEM</th>
<th class="neck column">AUGS</th>
<th class="neck column">NAME&#9662;</th>
<th class="neck column">MR&#9662;</th>
<th class="neck column">ATK&#9662;</th>
<th class="neck column">ELE&#9662;</th>
<th class="neck column">CHAOS&#9662;</th>
<th class="neck column">VILE&#9662;</th>
<th class="neck column">HP&#9662;</th>
<th class="neck column">RES&#9662;</th>
<th class="neck column"><i class="fas fa-shield-alt"></i>&#9662;</th>
<th class="neck column">ELE <i class="fas fa-shield-alt"></i>&#9662;</th>
<th class="neck column">RPT&#9662;</th>
<th class="neck column">EPT&#9662;</th>
<th class="neck column">RAMP&#9662;</th>
<th class="neck column">CRIT&#9662;</th>
<th class="neck column">GEMS&#9662;</th>
<th class="neck column">OPEN<br>AUGS&#9662;</th>
<th class="neck mrup column" onmouseover="popup(event,'MR-UP is a value based on the max rage gained per point spent on the next gem. A higher MR-UP value indicates more efficient max rage gains when purchasing gems')" onmouseout="kill()">MR-UP&#9662;</th>
<th class="weapon mrup column">ITEM</th>
<th class="weapon column">AUGS</th>
<th class="weapon column">NAME&#9662;</th>
<th class="weapon column">MR&#9662;</th>
<th class="weapon column">ATK&#9662;</th>
<th class="weapon column">ELE&#9662;</th>
<th class="weapon column">CHAOS&#9662;</th>
<th class="weapon column">VILE&#9662;</th>
<th class="weapon column">HP&#9662;</th>
<th class="weapon column">RES&#9662;</th>
<th class="weapon column"><i class="fas fa-shield-alt"></i>&#9662;</th>
<th class="weapon column">ELE <i class="fas fa-shield-alt"></i>&#9662;</th>
<th class="weapon column">RPT&#9662;</th>
<th class="weapon column">EPT&#9662;</th>
<th class="weapon column">RAMP&#9662;</th>
<th class="weapon column">CRIT&#9662;</th>
<th class="weapon column">GEMS&#9662;</th>
<th class="weapon column">OPEN<br>AUGS&#9662;</th>
<th class="weapon mrup column" onmouseover="popup(event,'MR-UP is a value based on the max rage gained per point spent on the next gem. A higher MR-UP value indicates more efficient max rage gains when purchasing gems')" onmouseout="kill()">MR-UP&#9662;</th>
<th class="body mrup column">ITEM</th>
<th class="body column">AUGS</th>
<th class="body column">NAME&#9662;</th>
<th class="body column">MR&#9662;</th>
<th class="body column">ATK&#9662;</th>
<th class="body column">ELE&#9662;</th>
<th class="body column">CHAOS&#9662;</th>
<th class="body column">VILE&#9662;</th>
<th class="body column">HP&#9662;</th>
<th class="body column">RES&#9662;</th>
<th class="body column"><i class="fas fa-shield-alt"></i>&#9662;</th>
<th class="body column">ELE <i class="fas fa-shield-alt"></i>&#9662;</th>
<th class="body column">RPT&#9662;</th>
<th class="body column">EPT&#9662;</th>
<th class="body column">RAMP&#9662;</th>
<th class="body column">CRIT&#9662;</th>
<th class="body column">GEMS&#9662;</th>
<th class="body column">OPEN<br>AUGS&#9662;</th>
<th class="body mrup column" onmouseover="popup(event,'MR-UP is a value based on the max rage gained per point spent on the next gem. A higher MR-UP value indicates more efficient max rage gains when purchasing gems')" onmouseout="kill()">MR-UP&#9662;</th>
<th class="shield mrup column">ITEM</th>
<th class="shield column">AUGS</th>
<th class="shield column">NAME&#9662;</th>
<th class="shield column">MR&#9662;</th>
<th class="shield column">ATK&#9662;</th>
<th class="shield column">ELE&#9662;</th>
<th class="shield column">CHAOS&#9662;</th>
<th class="shield column">VILE&#9662;</th>
<th class="shield column">HP&#9662;</th>
<th class="shield column">RES&#9662;</th>
<th class="shield column"><i class="fas fa-shield-alt"></i>&#9662;</th>
<th class="shield column">ELE <i class="fas fa-shield-alt"></i>&#9662;</th>
<th class="shield column">RPT&#9662;</th>
<th class="shield column">EPT&#9662;</th>
<th class="shield column">RAMP&#9662;</th>
<th class="shield column">CRIT&#9662;</th>
<th class="shield column">GEMS&#9662;</th>
<th class="shield column">OPEN<br>AUGS&#9662;</th>
<th class="shield mrup column" onmouseover="popup(event,'MR-UP is a value based on the max rage gained per point spent on the next gem. A higher MR-UP value indicates more efficient max rage gains when purchasing gems')" onmouseout="kill()">MR-UP&#9662;</th>
<th class="pants mrup column">ITEM</th>
<th class="pants column">AUGS</th>
<th class="pants column">NAME&#9662;</th>
<th class="pants column">MR&#9662;</th>
<th class="pants column">ATK&#9662;</th>
<th class="pants column">ELE&#9662;</th>
<th class="pants column">CHAOS&#9662;</th>
<th class="pants column">VILE&#9662;</th>
<th class="pants column">HP&#9662;</th>
<th class="pants column">RES&#9662;</th>
<th class="pants column"><i class="fas fa-shield-alt"></i>&#9662;</th>
<th class="pants column">ELE <i class="fas fa-shield-alt"></i>&#9662;</th>
<th class="pants column">RPT&#9662;</th>
<th class="pants column">EPT&#9662;</th>
<th class="pants column">RAMP&#9662;</th>
<th class="pants column">CRIT&#9662;</th>
<th class="pants column">GEMS&#9662;</th>
<th class="pants column">OPEN<br>AUGS&#9662;</th>
<th class="pants mrup column" onmouseover="popup(event,'MR-UP is a value based on the max rage gained per point spent on the next gem. A higher MR-UP value indicates more efficient max rage gains when purchasing gems')" onmouseout="kill()">MR-UP&#9662;</th>
<th class="belt mrup column">ITEM</th>
<th class="belt column">AUGS</th>
<th class="belt column">NAME&#9662;</th>
<th class="belt column">MR&#9662;</th>
<th class="belt column">ATK&#9662;</th>
<th class="belt column">ELE&#9662;</th>
<th class="belt column">CHAOS&#9662;</th>
<th class="belt column">VILE&#9662;</th>
<th class="belt column">HP&#9662;</th>
<th class="belt column">RES&#9662;</th>
<th class="belt column"><i class="fas fa-shield-alt"></i>&#9662;</th>
<th class="belt column">ELE <i class="fas fa-shield-alt"></i>&#9662;</th>
<th class="belt column">RPT&#9662;</th>
<th class="belt column">EPT&#9662;</th>
<th class="belt column">RAMP&#9662;</th>
<th class="belt column">CRIT&#9662;</th>
<th class="belt column">GEMS&#9662;</th>
<th class="belt column">OPEN<br>AUGS&#9662;</th>
<th class="belt mrup column" onmouseover="popup(event,'MR-UP is a value based on the max rage gained per point spent on the next gem. A higher MR-UP value indicates more efficient max rage gains when purchasing gems')" onmouseout="kill()">MR-UP&#9662;</th>
<th class="ring mrup column">ITEM</th>
<th class="ring column">AUGS</th>
<th class="ring column">NAME&#9662;</th>
<th class="ring column">MR&#9662;</th>
<th class="ring column">ATK&#9662;</th>
<th class="ring column">ELE&#9662;</th>
<th class="ring column">CHAOS&#9662;</th>
<th class="ring column">VILE&#9662;</th>
<th class="ring column">HP&#9662;</th>
<th class="ring column">RES&#9662;</th>
<th class="ring column"><i class="fas fa-shield-alt"></i>&#9662;</th>
<th class="ring column">ELE <i class="fas fa-shield-alt"></i>&#9662;</th>
<th class="ring column">RPT&#9662;</th>
<th class="ring column">EPT&#9662;</th>
<th class="ring column">RAMP&#9662;</th>
<th class="ring column">CRIT&#9662;</th>
<th class="ring column">GEMS&#9662;</th>
<th class="ring column">OPEN<br>AUGS&#9662;</th>
<th class="ring mrup column" onmouseover="popup(event,'MR-UP is a value based on the max rage gained per point spent on the next gem. A higher MR-UP value indicates more efficient max rage gains when purchasing gems')" onmouseout="kill()">MR-UP&#9662;</th>
<th class="foot mrup column">ITEM</th>
<th class="foot column">AUGS</th>
<th class="foot column">NAME&#9662;</th>
<th class="foot column">MR&#9662;</th>
<th class="foot column">ATK&#9662;</th>
<th class="foot column">ELE&#9662;</th>
<th class="foot column">CHAOS&#9662;</th>
<th class="foot column">VILE&#9662;</th>
<th class="foot column">HP&#9662;</th>
<th class="foot column">RES&#9662;</th>
<th class="foot column"><i class="fas fa-shield-alt"></i>&#9662;</th>
<th class="foot column">ELE <i class="fas fa-shield-alt"></i>&#9662;</th>
<th class="foot column">RPT&#9662;</th>
<th class="foot column">EPT&#9662;</th>
<th class="foot column">RAMP&#9662;</th>
<th class="foot column">CRIT&#9662;</th>
<th class="foot column">GEMS&#9662;</th>
<th class="foot column">OPEN<br>AUGS&#9662;</th>
<th class="foot mrup column" onmouseover="popup(event,'MR-UP is a value based on the max rage gained per point spent on the next gem. A higher MR-UP value indicates more efficient max rage gains when purchasing gems')" onmouseout="kill()">MR-UP&#9662;</th>
<th class="gem column">ITEM</th>
<th class="gem column">NAME&#9662;</th>
<th class="gem column">GEM LVL&#9662;<span id="math_gemlvl" class="spans"></span></th>
<th class="gem column">CHAOS&#9662;</th>
<th class="gem column">RAMP&#9662;</th>
<th class="gem column">MR&#9662;</th>
<th class="gem column">CRIT&#9662;</th>
<th class="gem column">ORE&#9662;</th>
<th class="gem mobs column">DELUGED&#9662;</th>
<th class="gem mobs column">SEEPING&#9662;</th>
<th class="gem mobs column">VOLATILE&#9662;</th>
<th class="rune column">ITEM&#9662;</th>
<th class="rune column">NAME&#9662;</th>
<th class="rune column">RUNE LVL&#9662;<span id="math_runelvl" class="spans"></span></th>
<th class="rune column">ELE DMG&#9662;</th>
<th class="rune column">FUSERS&#9662;</th>
<th class="rune column">ESSENCE&#9662;</th>
<th class="rune column">ORBSTONE&#9662;</th>
<th class="rune column">HEART&#9662;</th>
<th class="orbs column">ORB&#9662;</th>
<th class="orbs column">NAME&#9662;</th>
<th class="orbs column">ORB&#9662;</th>
<th class="orbs column">NAME&#9662;</th>
<th class="orbs column">ORB&#9662;</th>
<th class="orbs column">NAME&#9662;</th>
<th class="orbs column">ELE DMG&#9662;</th>
<th class="orbs column">CHAOS&#9662;</th>
<th class="orbs column">ATK&#9662;</th>
<th class="orbs column">HP&#9662;</th>
<th class="orbs column">MAX RAGE&#9662;</th>
<th class="orbs column">RPT&#9662;</th>
<th class="orbs column">EPT&#9662;</th>
<th class="bdge column">ITEM&#9662;</th>
<th class="bdge column">NAME&#9662;</th>
<th class="bdge column">LEVEL&#9662;<span id="math_badgelvl" class="spans"></span></th>
<th class="bdge column">ATK&#9662;</th>
<th class="bdge column">ELE&#9662;</th>
<th class="bdge column">HP&#9662;</th>
<th class="bdge column">REPS&#9662;</th>
<th class="bdge mobs column">CORVOK&#9662;</th>
<th class="bdge mobs column">SKITTOR&#9662;</th>
<th class="bdge mobs column">ROENOV&#9662;</th>
<th class="bdge mobs column">ERGON&#9662;</th>
<th class="bdge mobs column">DEFIANT&#9662;</th>
<th class="bdge mobs column">ENDURING&#9662;</th>
<th class="bdge mobs column">PERPETUAL&#9662;</th>
<th class="booster column">ITEM&#9662;</th>
<th class="booster column">NAME&#9662;</th>
<th class="booster column">EFFECT&#9662;</th>
<th class="booster column">TIME REMAINING&#9662;</th>
<th class="crests column"><font color=#A283EE>CLASS</th>
<th class="crests column"><font color=#A283EE>CREST LVL&#9662;</th>
<th class="crests column"><font color=#DD5431>FRCTY</th>
<th class="crests column"><font color=#DD5431>CREST LVL&#9662;</th>
<th class="crests column"><font color=#369B97>PRESR</th>
<th class="crests column"><font color=#369B97>CREST LVL&#9662;</th>
<th class="crests column"><font color=#E3CB02>AFLCT</th>
<th class="crests column"><font color=#E3CB02>CREST LVL&#9662;</th>
<th class="crests column">FRAGMENTS&#9662;</th>
<th class="crests column">SKULLS&#9662;</th>
<th class="crests mobs column">HOVOK&#9662;</th>
<th class="bp column"><img src=images/items/chaosore1.jpg onmouseover="popup(event,'Chaos Ore')" onmouseout="kill()">&#9662;</th>
<th class="bp column"><img src=images/items/itema22.jpg onmouseover="popup(event,'Archfiend Fragment')" onmouseout="kill()">&#9662;</th>
<th class="bp column"><img src=images/items/itema56.jpg onmouseover="popup(event,'Skull of Demonology')" onmouseout="kill()">&#9662;</th>
<th class="bp column"><img src=images/items/elementalfuser.jpg onmouseover="popup(event,'Elemental Fuser')" onmouseout="kill()">&#9662;</th>
<th class="bp column"><img src=images/items/badgeexp.jpg onmouseover="popup(event,'Badge Reputation')" onmouseout="kill()">&#9662;</th>
<th class="bp column"><img src=images/items/achievementamulet.jpg onmouseover="popup(event,'Amulet of Achievement')" onmouseout="kill()">&#9662;</th>
<th class="bp column"><img src=images/items/questshard.jpg onmouseover="popup(event,'Quest Shard')" onmouseout="kill()">&#9662;</th>
<th class="bp column"><img src=images/items/itemz94.gif onmouseover="popup(event,'Drolba Tonic')" onmouseout="kill()">&#9662;</th>
<th class="bp column"><img src=images/warshard.jpg onmouseover="popup(event,'Summoning Shard')" onmouseout="kill()">&#9662;</th>
<th class="tradable column"><img src=images/items/eleresistpotion.png onmouseover="popup(event,'Potion of Elemental Resistance')" onmouseout="kill()">&#9662;</th>
<th class="tradable column"><img src=images/potion28.jpg onmouseover="popup(event,'Kix Potion')" onmouseout="kill()">&#9662;</th>
<th class="tradable column"><img src=images/items/arelepot.jpg onmouseover="popup(event,'Potion of Amdir')" onmouseout="kill()">&#9662;</th>
<th class="tradable column"><img src=images/items/Item_SquidberryJuice.jpg onmouseover="popup(event,'Squidberry Juice')" onmouseout="kill()">&#9662;</th>
<th class="tradable column"><img src=images/items/masterbrut.jpg onmouseover="popup(event,'Master Brutality Potion')" onmouseout="kill()">&#9662;</th>
<th class="tradable column"><img src=images/items/bubblegum.png onmouseover="popup(event,'Bubble Gum')" onmouseout="kill()">&#9662;</th>
<th class="tradable column"><img src=images/items/skittles.png onmouseover="popup(event,'Skittles')" onmouseout="kill()">&#9662;</th>
<th class="tradable column"><img src=images/items/snickersbar.png onmouseover="popup(event,'Snickers Bar')" onmouseout="kill()">&#9662;</th>
<th class="tradable column"><img src=images/items/starburst.png onmouseover="popup(event,'Starbust')" onmouseout="kill()">&#9662;</th>
<th class="tradable column"><img src=images/items/mm.png onmouseover="popup(event,'M&Ms')" onmouseout="kill()">&#9662;</th>
<th class="tradable column"><img src=images/items/reesescups.png onmouseover="popup(event,'Reeses Peanut Butter Cup')" onmouseout="kill()">&#9662;</th>
<th class="tradable column"><img src=images/items/kitkatbar.png onmouseover="popup(event,'Kit Kat Bar')" onmouseout="kill()">&#9662;</th>
<th class="tradable column"><img src=images/items/tootsiepop.png onmouseover="popup(event,'Tootsie Pop')" onmouseout="kill()">&#9662;</th>
<th class="tradable column"><img src=images/items/itemz91.jpg onmouseover="popup(event,'Minor Chaos Philter')" onmouseout="kill()">&#9662;</th>
<th class="tradable column"><img src=images/items/itemz82.jpg onmouseover="popup(event,'Major Chaos Philter')" onmouseout="kill()">&#9662;</th>
<th class="tradable column"><img src=images/items/starpowerelec.jpg onmouseover="popup(event,'Star Power')" onmouseout="kill()">&#9662;</th>
<th class="generic column"><img src=images/items/Pot_NatasVile.jpg onmouseover="popup(event,'Natas Vile')" onmouseout="kill()">&#9662;</th>
<th class="generic column"><img src=images/items/Pot_WhiteVile.jpg onmouseover="popup(event,'White Vile')" onmouseout="kill()">&#9662;</th>
<th class="generic column"><img src=images/items/Pot_KineticVile.jpg onmouseover="popup(event,'Kinetic Vile')" onmouseout="kill()">&#9662;</th>
<th class="generic column"><img src=images/items/Pot_ArcaneVile.jpg onmouseover="popup(event,'Arcane Vile')" onmouseout="kill()">&#9662;</th>
<th class="generic column"><img src=images/items/Pot_ShadowVile.jpg onmouseover="popup(event,'Shadow Vile')" onmouseout="kill()">&#9662;</th>
<th class="generic column"><img src=images/items/Pot_FireVile.jpg onmouseover="popup(event,'Fire Vile')" onmouseout="kill()">&#9662;</th>
<th class="generic column"><img src=images/items/potion_1.gif onmouseover="popup(event,'Zombie Potion 1')" onmouseout="kill()">&#9662;</th>
<th class="generic column"><img src=images/items/potion_2.gif onmouseover="popup(event,'Zombie Potion 2')" onmouseout="kill()">&#9662;</th>
<th class="generic column"><img src=images/items/potion_3.gif onmouseover="popup(event,'Zombie Potion 3')" onmouseout="kill()">&#9662;</th>
<th class="generic column"><img src=images/items/potion_4.gif onmouseover="popup(event,'Zombie Potion 4')" onmouseout="kill()">&#9662;</th>
<th class="generic column"><img src=images/items/potion_5.gif onmouseover="popup(event,'Zombie Potion 5')" onmouseout="kill()">&#9662;</th>
<th class="generic column"><img src=images/items/potion_6.gif onmouseover="popup(event,'Zombie Potion 6')" onmouseout="kill()">&#9662;</th>
<th class="generic column"><img src=images/items/goldpotionzor.gif onmouseover="popup(event,'Remnant Solice Lev 7')" onmouseout="kill()">&#9662;</th>
<th class="generic column"><img src=images/items/goldpotionzorleetz.jpg onmouseover="popup(event,'Remnant Solice Lev 8')" onmouseout="kill()">&#9662;</th>
<th class="generic column"><img src=images/items/85remnant.jpg onmouseover="popup(event,'Remnant Solice Lev 9')" onmouseout="kill()">&#9662;</th>
<th class="generic column"><img src=images/items/90remnant.png onmouseover="popup(event,'Remnant Solice Lev 10')" onmouseout="kill()">&#9662;</th>
<th class="premium column"><img src=images/items/itemz28.jpg onmouseover="popup(event,'Flask of Endurance')" onmouseout="kill()">&#9662;</th>
<th class="premium column"><img src=images/items/PotionofEA.jpg onmouseover="popup(event,'Potion of Enraged Alsayic')" onmouseout="kill()">&#9662;</th>
<th class="premium column"><img src=images/pot5.jpg onmouseover="popup(event,'Sammy Sosa's Special Sauce')" onmouseout="kill()">&#9662;</th>
<th class="premium column"><img src=images/halloween/PumpkinJuice.gif onmouseover="popup(event,'Pumpkin Juice')" onmouseout="kill()">&#9662;</th>
<th class="premium column"><img src=images/pot2.jpg onmouseover="popup(event,'Dose of Destruction')" onmouseout="kill()">&#9662;</th>
<th class="premium column"><img src=images/mushroom.jpg onmouseover="popup(event,'Funny Little Mushroom')" onmouseout="kill()">&#9662;</th>
<th class="premium column"><img src=images/potion26.jpg onmouseover="popup(event,'Potion of Holy Slaughter')" onmouseout="kill()">&#9662;</th>
<th class="premium column"><img src=images/items/basicflask1.gif onmouseover="popup(event,'Flask of Burning Souls')" onmouseout="kill()">&#9662;</th>
<th class="premium column"><img src=images/basicflask4.gif onmouseover="popup(event,'Flask of Conjured Lightning')" onmouseout="kill()">&#9662;</th>
<th class="premium column"><img src=images/basicflask2.gif onmouseover="popup(event,'Flask of Flaming Death')" onmouseout="kill()">&#9662;</th>
<th class="premium column"><img src=images/basicflask3.gif onmouseover="popup(event,'Flask of Forbidden Knowledge')" onmouseout="kill()">&#9662;</th>
<th class="premium column"><img src=images/basicflask5.gif onmouseover="popup(event,'Flask of Super Nova')" onmouseout="kill()">&#9662;</th>
<th class="premium column"><img src=images/items/lesserolympian.png onmouseover="popup(event,'Olympian Juicebox')" onmouseout="kill()">&#9662;</th>
<th class="premium column"><img src=images/items/2k8.png onmouseover="popup(event,'Olympian Push')" onmouseout="kill()">&#9662;</th>
<th class="rare column"><img src=images/items/sugardaddy.png onmouseover="popup(event,'Sugar Daddy')" onmouseout="kill()">&#9662;</th>
<th class="rare column"><img src=images/items/whiskeypot.png onmouseover="popup(event,'20 Year Aged Whiskey')" onmouseout="kill()">&#9662;</th>
<th class="rare column"><img src=images/items/emblemPotion2.jpg onmouseover="popup(event,'Blazing Holiday Sauce')" onmouseout="kill()">&#9662;</th>
<th class="rare column"><img src=images/potion25.jpg onmouseover="popup(event,'Evil Scream')" onmouseout="kill()">&#9662;</th>
<th class="rare column"><img src=images/items/purepwnagepotion.png onmouseover="popup(event,'Griznix Potion')" onmouseout="kill()">&#9662;</th>
<th class="rare column"><img src=images/potion24.jpg onmouseover="popup(event,'Marsh Water')" onmouseout="kill()">&#9662;</th>
<th class="rare column"><img src=images/items/ReikavonsElixer.jpg onmouseover="popup(event,'Reikavons Elixer')" onmouseout="kill()">&#9662;</th>
<th class="rare column"><img src=images/items/wozpotionzor.jpg onmouseover="popup(event,'Zhulian Potion')" onmouseout="kill()">&#9662;</th>
<th class="rare column"><img src=images/items/h16_Pot2.png onmouseover="popup(event,'Damned Arcane Shot')" onmouseout="kill()">&#9662;</th>
<th class="rare column"><img src=images/items/h16_Pot6.png onmouseover="popup(event,'Damned Element Shot')" onmouseout="kill()">&#9662;</th>
<th class="rare column"><img src=images/items/h16_Pot4.png onmouseover="popup(event,'Damned Fire Shot')" onmouseout="kill()">&#9662;</th>
<th class="rare column"><img src=images/items/h16_Pot1.png onmouseover="popup(event,'Damned Holy Shot')" onmouseout="kill()">&#9662;</th>
<th class="rare column"><img src=images/items/h16_Pot5.png onmouseover="popup(event,'Damned Kinetic Shot')" onmouseout="kill()">&#9662;</th>
<th class="rare column"><img src=images/items/h16_Pot3.png onmouseover="popup(event,'Damned Shadow Shot')" onmouseout="kill()">&#9662;</th>
<th class="rare column"><img src=images/items/KineticShot.jpg onmouseover="popup(event,'Kinetic Potency')" onmouseout="kill()">&#9662;</th>
<th class="rare column"><img src=images/items/vaultpot1.png onmouseover="popup(event,'Vial of Insanity')" onmouseout="kill()">&#9662;</th>
<th class="rare column"><img src=images/items/vaultpot2.png onmouseover="popup(event,'Demonic Madness')" onmouseout="kill()">&#9662;</th>
<th class="rare column"><img src=images/items/Putrid%20Power%20Clusters.jpg onmouseover="popup(event,'Kombucha')" onmouseout="kill()">&#9662;</th>
<th class="rare column"><img src=images/items/pot_quantumquattro.jpg onmouseover="popup(event,'Quantum Quattro')" onmouseout="kill()">&#9662;</th>
<th class="misc column"><img src=images/items/masterbrut.jpg onmouseover="popup(event,'Master Brutality Potion')" onmouseout="kill()">&#9662;</th>
<th class="misc column"><img src=images/items/pot6.jpg onmouseover="popup(event,'Strength Potion')" onmouseout="kill()">&#9662;</th>
<th class="misc column"><img src=images/items/haste.png onmouseover="popup(event,'Haste Potion')" onmouseout="kill()">&#9662;</th>
<th class="misc column"><img src=images/items/1kragetonic.png onmouseover="popup(event,'Rage Tonic')" onmouseout="kill()">&#9662;</th>
<th class="misc column"><img src=images/items/5kragetonic.png onmouseover="popup(event,'Super Rage Tonic')" onmouseout="kill()">&#9662;</th>
<th class="misc column"><img src=images/items/10kragetonic.png onmouseover="popup(event,'Grand Rage Tonic')" onmouseout="kill()">&#9662;</th>
<th class="misc column"><img src=images/items/20kragetonic.png onmouseover="popup(event,'Alpha Rage Tonic')" onmouseout="kill()">&#9662;</th>
<th class="misc column"><img src=images/items/sfury.jpg onmouseover="popup(event,'Spark the Fury')" onmouseout="kill()">&#9662;</th>
<th class="misc column"><img src=images/rfury.jpg onmouseover="popup(event,'Recharge the Fury')" onmouseout="kill()">&#9662;</th>
<th class="misc column"><img src=images/items/itemz80.gif onmouseover="popup(event,'Quest Experience Potion')" onmouseout="kill()">&#9662;</th>
<th class="collections column" onmouseover="popup(event,'Mass mob kills')" onmouseout="kill()">ANJOU&#9662;</th>
<th class="collections column" onmouseover="popup(event,'Mass item collections')" onmouseout="kill()">REIKAR&#9662;</th>
<th class="collections column" onmouseover="popup(event,'Rare drop collections')" onmouseout="kill()">LORREN&#9662;</th>
<th class="collections column" onmouseover="popup(event,'Power mob kills')" onmouseout="kill()">LUCILE&#9662;</th>
<th class="collections column" onmouseover="popup(event,'Crew DC raids')" onmouseout="kill()">WEIMA&#9662;</th>
<th class="collections column" onmouseover="popup(event,'Crew god raids')" onmouseout="kill()">SOUMA&#9662;</th>
<th class="collections column" onmouseover="popup(event,'Treasury purchase items')" onmouseout="kill()">VANISHA&#9662;</th>
<th class="collections column" onmouseover="popup(event,'Token purchase items')" onmouseout="kill()">DROLBA&#9662;</th>
<th class="collections column" onmouseover="popup(event,'Experience wards')" onmouseout="kill()">QUIBEL&#9662;</th>
<th class="collections column">TOTAL&#9662;</th>
<th class="treasury column">TREASURY (MOUSEOVER FOR DETAILS)&#9662;</th>
<th class="treasury column">LINK</th>
</tr>`+charids+`</table>
<p style="margin-bottom:10px !important;">`

document.getElementById ("atk_mv_mobs").addEventListener("click", atk_mv_mobs, false);
function atk_mv_mobs(){
GM_addStyle (`#sliderload{display:revert !important;position:fixed !important;left:50% !important;top:50% !important;margin-top:-110px !important;margin-left: -110px !important;background:#FF0000 !important;z-index:10000 !important;}`)
$("body").append (`<div id="sliderload"><img src=https://media.tenor.com/UnFx-k_lSckAAAAM/amalie-steiness.gif></div></div>`);
setTimeout(function() {GM_addStyle (`#sliderload{display:none !important;}`)},3000)
var hovok_array = []; $("input:checkbox[name=hovok_box]:checked").each(function(){hovok_array.push($(this).val());var hovok_check_charids = hovok_array.join(",")});
var perpetual_array = []; $("input:checkbox[name=perpetual_box]:checked").each(function(){perpetual_array.push($(this).val());var perpetual_check_charids = perpetual_array.join(",")});
var enduring_array = []; $("input:checkbox[name=enduring_box]:checked").each(function(){enduring_array.push($(this).val());var enduring_check_charids = enduring_array.join(",")});
var defiant_array = []; $("input:checkbox[name=defiant_box]:checked").each(function(){defiant_array.push($(this).val());var defiant_check_charids = defiant_array.join(",")});
var seeping_array = []; $("input:checkbox[name=seeping_box]:checked").each(function(){seeping_array.push($(this).val());var seeping_check_charids = seeping_array.join(",")});
var deluged_array = []; $("input:checkbox[name=deluged_box]:checked").each(function(){deluged_array.push($(this).val());var deluged_check_charids = deluged_array.join(",")});
var volatile_array = []; $("input:checkbox[name=volatile_box]:checked").each(function(){volatile_array.push($(this).val());var volatile_check_charids = volatile_array.join(",")});
var corvok_array = []; $("input:checkbox[name=corvok_box]:checked").each(function(){corvok_array.push($(this).val());var corvok_check_charids = corvok_array.join(",")});
var skittor_array = []; $("input:checkbox[name=skittor_box]:checked").each(function(){skittor_array.push($(this).val());var skittor_check_charids = skittor_array.join(",")});
var roenov_array = []; $("input:checkbox[name=roenov_box]:checked").each(function(){roenov_array.push($(this).val());var roenov_check_charids = roenov_array.join(",")});
var ergon_array = []; $("input:checkbox[name=ergon_box]:checked").each(function(){ergon_array.push($(this).val());var ergon_check_charids = ergon_array.join(",")});
mv_mobs_post =`
hovok&28123&`+hovok_array+`
corvok&27624&`+corvok_array+`
skittor&27527&`+skittor_array+`
roenov&27528&`+roenov_array+`
ergon&27526&`+ergon_array+`
defiant&26615&`+defiant_array+`
enduring&26614&`+enduring_array+`
perpetual&26616&`+perpetual_array+`
deluged&32878&`+deluged_array+`
seeping&32876&`+seeping_array+`
volatile&32877&`+volatile_array
task13();
$('input:checkbox').prop('checked', false)}

document.getElementById ("mv_badgereport").addEventListener("click", mv_badgereport, false);
function mv_badgereport(){task10();}

document.getElementById ("mv_chaosreport").addEventListener("click", mv_chaosreport, false);
function mv_chaosreport(){task09();}

document.getElementById ("sel_perpetual").addEventListener("click", sel_perpetual, false);
function sel_perpetual(){$('input:checkbox[name=perpetual_box]').prop('checked', true);}

document.getElementById ("desel_perpetual").addEventListener("click", desel_perpetual, false);
function desel_perpetual(){$('input:checkbox[name=perpetual_box]').prop('checked', false);}

document.getElementById ("sel_enduring").addEventListener("click", sel_enduring, false);
function sel_enduring(){$('input:checkbox[name=enduring_box]').prop('checked', true);}

document.getElementById ("desel_enduring").addEventListener("click", desel_enduring, false);
function desel_enduring(){$('input:checkbox[name=enduring_box]').prop('checked', false);}

document.getElementById ("sel_defiant").addEventListener("click", sel_defiant, false);
function sel_defiant(){$('input:checkbox[name=defiant_box]').prop('checked', true);}

document.getElementById ("desel_defiant").addEventListener("click", desel_defiant, false);
function desel_defiant(){$('input:checkbox[name=defiant_box]').prop('checked', false);}

document.getElementById ("sel_hovok").addEventListener("click", sel_hovok, false);
function sel_hovok(){$('input:checkbox[name=hovok_box]').prop('checked', true);}

document.getElementById ("desel_hovok").addEventListener("click", desel_hovok, false);
function desel_hovok(){$('input:checkbox[name=hovok_box]').prop('checked', false);}

document.getElementById ("sel_seeping").addEventListener("click", sel_seeping, false);
function sel_seeping(){$('input:checkbox[name=seeping_box]').prop('checked', true);}

document.getElementById ("desel_seeping").addEventListener("click", desel_seeping, false);
function desel_seeping(){$('input:checkbox[name=seeping_box]').prop('checked', false);}

document.getElementById ("sel_deluged").addEventListener("click", sel_deluged, false);
function sel_deluged(){$('input:checkbox[name=deluged_box]').prop('checked', true);}

document.getElementById ("desel_deluged").addEventListener("click", desel_deluged, false);
function desel_deluged(){$('input:checkbox[name=deluged_box]').prop('checked', false);}

document.getElementById ("sel_volatile").addEventListener("click", sel_volatile, false);
function sel_volatile(){$('input:checkbox[name=volatile_box]').prop('checked', true);}

document.getElementById ("desel_volatile").addEventListener("click", desel_volatile, false);
function desel_volatile(){$('input:checkbox[name=volatile_box]').prop('checked', false);}

document.getElementById ("sel_corvok").addEventListener("click", sel_corvok, false);
function sel_corvok(){$('input:checkbox[name=corvok_box]').prop('checked', true);}

document.getElementById ("desel_corvok").addEventListener("click", desel_corvok, false);
function desel_corvok(){$('input:checkbox[name=corvok_box]').prop('checked', false);}

document.getElementById ("sel_skittor").addEventListener("click", sel_skittor, false);
function sel_skittor(){$('input:checkbox[name=skittor_box]').prop('checked', true);}

document.getElementById ("desel_skittor").addEventListener("click", desel_skittor, false);
function desel_skittor(){$('input:checkbox[name=skittor_box]').prop('checked', false);}

document.getElementById ("sel_roenov").addEventListener("click", sel_roenov, false);
function sel_roenov(){$('input:checkbox[name=roenov_box]').prop('checked', true);}

document.getElementById ("desel_roenov").addEventListener("click", desel_roenov, false);
function desel_roenov(){$('input:checkbox[name=roenov_box]').prop('checked', false);}

document.getElementById ("sel_ergon").addEventListener("click", sel_ergon, false);
function sel_ergon(){$('input:checkbox[name=ergon_box]').prop('checked', true);}

document.getElementById ("desel_ergon").addEventListener("click", desel_ergon, false);
function desel_ergon(){$('input:checkbox[name=ergon_box]').prop('checked', false);}

document.getElementById ("button1").addEventListener("click", Button1, false);
function Button1 (zEvent) {GM_addStyle (`.column{display:none!important}.home{display:revert!important}`);}

document.getElementById ("button2").addEventListener("click", Button2, false);
function Button2 (zEvent) {GM_addStyle (`.column{display:none!important}.stats{display:revert!important}`);}

document.getElementById ("button3").addEventListener("click", Button3, false);
function Button3 (zEvent) {GM_addStyle (`.column{display:none!important}.skills{display:revert!important}`);}

document.getElementById ("button4").addEventListener("click", Button4, false);
function Button4 (zEvent) {GM_addStyle (`.column{display:none!important}.eq{display:revert!important}`);}

document.getElementById ("button5").addEventListener("click", Button5, false);
function Button5 (zEvent) {GM_addStyle (`.column{display:none!important}.core{display:revert!important}`);}

document.getElementById ("button6").addEventListener("click", Button6, false);
function Button6 (zEvent) {GM_addStyle (`.column{display:none!important}.head{display:revert!important}`);}

document.getElementById ("button7").addEventListener("click", Button7, false);
function Button7 (zEvent) {GM_addStyle (`.column{display:none!important}.neck{display:revert!important}`);}

document.getElementById ("button8").addEventListener("click", Button8, false);
function Button8 (zEvent) {GM_addStyle (`.column{display:none!important}.weapon{display:revert!important}`);}

document.getElementById ("button9").addEventListener("click", Button9, false);
function Button9 (zEvent) {GM_addStyle (`.column{display:none!important}.body{display:revert!important}`);}

document.getElementById ("button10").addEventListener("click", Button10, false);
function Button10 (zEvent) {GM_addStyle (`.column{display:none!important}.shield{display:revert!important}`);}

document.getElementById ("button11").addEventListener("click", Button11, false);
function Button11 (zEvent) {GM_addStyle (`.column{display:none!important}.pants{display:revert!important}`);}

document.getElementById ("button12").addEventListener("click", Button12, false);
function Button12 (zEvent) {GM_addStyle (`.column{display:none!important}.belt{display:revert!important}`);}

document.getElementById ("button13").addEventListener("click", Button13, false);
function Button13 (zEvent) {GM_addStyle (`.column{display:none!important}.ring{display:revert!important}`);}

document.getElementById ("button14").addEventListener("click", Button14, false);
function Button14 (zEvent) {GM_addStyle (`.column{display:none!important}.foot{display:revert!important}`);}

document.getElementById ("button15").addEventListener("click", Button15, false);
function Button15 (zEvent) {GM_addStyle (`.column{display:none!important}.gem{display:revert!important}`);}

document.getElementById ("button16").addEventListener("click", Button16, false);
function Button16 (zEvent) {GM_addStyle (`.column{display:none!important}.rune{display:revert!important}`);}

document.getElementById ("button17").addEventListener("click", Button17, false);
function Button17 (zEvent) {GM_addStyle (`.column{display:none!important}.orbs{display:revert!important}`);}

document.getElementById ("button18").addEventListener("click", Button18, false);
function Button18 (zEvent) {GM_addStyle (`.column{display:none!important}.bdge{display:revert!important}`);}

document.getElementById ("button19").addEventListener("click", Button19, false);
function Button19 (zEvent) {GM_addStyle (`.column{display:none!important}.booster{display:revert!important}`);}

document.getElementById ("button20").addEventListener("click", Button20, false);
function Button20 (zEvent) {GM_addStyle (`.column{display:none!important}.crests{display:revert!important}`);}

document.getElementById ("button21").addEventListener("click", Button21, false);
function Button21 (zEvent) {GM_addStyle (`.column{display:none!important}.bp{display:revert!important}`);}

document.getElementById ("button22").addEventListener("click", Button22, false);
function Button22 (zEvent) {GM_addStyle (`.column{display:none!important}.generic{display:revert!important}`);}

document.getElementById ("button23").addEventListener("click", Button23, false);
function Button23 (zEvent) {GM_addStyle (`.column{display:none!important}.collections{display:revert!important}`);}

document.getElementById ("button25").addEventListener("click", Button25, false);
function Button25 (zEvent) {GM_addStyle (`.column{display:none!important}.backpack{display:revert!important}`);}

document.getElementById ("button26").addEventListener("click", Button26, false);
function Button26 (zEvent) {GM_addStyle (`.column{display:none!important}.world{display:revert!important}`);}

document.getElementById ("button27").addEventListener("click", Button27, false);
function Button27 (zEvent) {GM_addStyle (`.column{display:none!important}.tradable{display:revert!important}`);}

document.getElementById ("button28").addEventListener("click", Button28, false);
function Button28 (zEvent) {GM_addStyle (`.column{display:none!important}.premium{display:revert!important}`);}

document.getElementById ("button29").addEventListener("click", Button29, false);
function Button29 (zEvent) {GM_addStyle (`.column{display:none!important}.rare{display:revert!important}`);}

document.getElementById ("button30").addEventListener("click", Button30, false);
function Button30 (zEvent) {GM_addStyle (`.column{display:none!important}.treasury{display:revert!important}`);}

document.getElementById ("button31").addEventListener("click", Button31, false);
function Button31 (zEvent) {GM_addStyle (`.column{display:none!important}.alleq{display:revert!important}`);}

document.getElementById ("button32").addEventListener("click", Button32, false);
function Button32 (zEvent) {GM_addStyle (`.column{display:none!important}.augs{display:revert!important}`);}

document.getElementById ("button33").addEventListener("click", Button33, false);
function Button33 (zEvent) {GM_addStyle (`.column{display:none!important}.mrup{display:revert!important}`);}

document.getElementById ("button34").addEventListener("click", Button34, false);
function Button34 (zEvent) {GM_addStyle (`.column{display:none!important}.misc{display:revert!important}`);}

document.getElementById ("button35").addEventListener("click", Button35, false);
function Button35 (zEvent) {GM_addStyle (`.column{display:none!important}.vault{display:revert!important}`);}

document.getElementById ("button36").addEventListener("click", Button36, false);
function Button36 (zEvent) {GM_addStyle (`.column{display:none!important}.mobs{display:revert!important}`);}

$('th').click(function(){
    var table = $(this).parents('table').eq(0)
    var rows = table.find('tr:gt(0)').toArray().sort(comparer($(this).index()))
    this.asc = !this.asc
    if (!this.asc){rows = rows.reverse()}
    for (var i = 0; i < rows.length; i++){table.append(rows[i])}
})
function comparer(index) {
    return function(a, b) {
        var valA = getCellValue(a, index), valB = getCellValue(b, index)
        return $.isNumeric(valA) && $.isNumeric(valB) ? valA - valB : valA.toString().localeCompare(valB)
    }
}
function getCellValue(row, index){ return $(row).children('td').eq(index).text() }

var selectedID = document.querySelector("body").outerHTML.match(/value="(.*)" selected/)
var charsTable = document.querySelector("#moxxivision > tbody");
var charsTableRows = charsTable.rows.length;

function insertAfter(newNode, existingNode) {
existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);}

var tot_lvl=0;
var tot_mrage=0;
var tot_power=0;
var tot_ele=0;
var tot_atk=0;
var tot_hp=0;
var tot_chaos=0;
var tot_wilderness=0;
var tot_slayer=0;
var tot_today=0;
var tot_yesterday=0;
var tot_gemlvl=0;
var tot_runelvl=0;
var tot_badgelvl=0;
var tot_openaugs=0;
var primalready = '';
var respready = '';
var mysticready = '';
var delready = '';
var seepready = '';
var volready = '';
var hovokready = '';
var corvready = '';
var skittorready = '';
var roenovready = '';
var ergonready = '';
var enduringready = '';
var defiantready = '';
var perpetualready = '';
var fragready = '';
var oreready = '';
var badgeready = '';
var count=0;
var notome = '';

$("body").append ( `
<div id="gotolink" class="widget">
quickly go to a url on every char on your rga<p style="margin-bottom:20px">
<input type="text" id="gotolinkinput" class="form-control form-control-alternative" placeholder="" value="" size="50"><button id='gtlbtn' class='button'>GO TO LINK</button><div id="gtlresult"></div>
</div>
` );

for (let rownum = 2; rownum < (charsTableRows+1); rownum++) {

var profilelinks = "profile.php?id="+document.querySelector("#moxxivision > tbody > tr:nth-child("+rownum+") > td:nth-child(1)").innerHTML
fetch(profilelinks)
   .then(response => response.text())
   .then((response) => {
    var strength = response.match(/role="progressbar" style="width: ([0-9]+)%; height: 8px;"/i)
    var name = response.match(/<a href="\/send_ow_message\?name=(.*)">/i)
    var power = response.match(/TOTAL POWER.*[\n\r].*<font size="2">(.*)<\/font><\/b><\/td>/i)
    var eledmg = response.match(/ELEMENTAL ATTACK.*[\n\r].*<font size="2">(.*)<\/font>/i)
    var attack = response.match(/ATTACK.*[\n\r].*<font size="2">(.*)<\/font>/i)
    var hp = response.match(/HIT POINTS.*[\n\r].*<font size="2">(.*)<\/font>/i)
    var chaos = response.match(/CHAOS DAMAGE.*[\n\r].*<font size="2">(.*)<\/font>/i)
    var slayer = response.match(/GOD SLAYER LEVEL.*[\n\r].*<font size="2">(.*)<\/font>/i)
    var wilderness = response.match(/WILDERNESS LEVEL.*[\n\r].*<font size="2">(.*)<\/font>/i)
    var experience = response.match(/TOTAL EXPERIENCE.*[\n\r].*<font size="2">(.*)<\/font>/i)
    var level = response.match(/CHARACTER CLASS.*[\n\r].*<font size="2">Level ([0-9]+)(.*)<\/b><\/td>/i)
    var crew = response.match(/<font size="2">(.*) of <a href="\/crew_profile\?id=.*">(.*)<\/a><\/font>/i)
    if (crew == null) crew = "none"
    var id = response.match(/<a href="\.\.\/allies\.php\?uid=(.*)">\[View All]<\/a>/i)
    var yesterday = response.match(/GROWTH YESTERDAY.*[\n\r].*<font size="2">(.*)<\/font>/i)
    var items = '';
    if (response.match(/<div style="position:absolute; left:61px; top:12px; width:41px; height:41px;text-align:center">[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*/im).toString().match(/img/g) != null){
        items = response.match(/<div style="position:absolute; left:61px; top:12px; width:41px; height:41px;text-align:center">[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*/im).toString().match(/img/g).length}
    if (response.match(/<div style="position:absolute; left:61px; top:12px; width:41px; height:41px;text-align:center">[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*/im).toString().match(/img/g) == null){
        items = 0}
    var core = response.match(/<div style="position:absolute; left:61px; top:12px; width:41px; height:41px;text-align:center">.*[\n\r](<img .*)<\/div>/i) || "none"
    if (core != "none"){core = core[1]}
    let coreid = 'none'; if (core != "none") coreid = core.match(/itempopup\(event,'([0-9]+)'\)"/i)
    var head = response.match(/<div style="position:absolute; left:118px; top:7px; width:62px; height:46px;text-align:center">.*[\n\r](<img .*)<\/div>/i) || "none"
    if (head != "none"){head = head[1]}
    let headid = 'none'; if (head != "none") headid = head.match(/itempopup\(event,'([0-9]+)'\)"/i)
    var neck = response.match(/<div style="position:absolute; left:197px; top:12px; width:41px; height:41px;text-align:center">.*[\n\r](<img .*)<\/div>/i) || "none"
    if (neck != "none"){neck = neck[1]}
    let neckid = 'none'; if (neck != "none") neckid = neck.match(/itempopup\(event,'([0-9]+)'\)"/i)
    var weapon = response.match(/<div style="position:absolute; left:45px; top:67px; width:56px; height:96px;text-align:center">.*[\n\r](<img .*)<\/div>/i) || "none"
    if (weapon != "none"){weapon = weapon[1]}
    let weaponid = 'none'; if (weapon != "none") weaponid = weapon.match(/itempopup\(event,'([0-9]+)'\)"/i)
    var body = response.match(/<div style="position:absolute; left:121px; top:67px; width:56px; height:96px;text-align:center">.*[\n\r](<img .*)<\/div>/i) || "none"
    if (body != "none"){body = body[1]}
    let bodyid = 'none'; if (body != "none") bodyid = body.match(/itempopup\(event,'([0-9]+)'\)"/i)
    var shield = response.match(/<div style="position:absolute; left:198px; top:67px; width:56px; height:96px;text-align:center">.*[\n\r](<img .*)<\/div>/i) || "none"
    if (shield != "none"){shield = shield[1]}
    let shieldid = 'none'; if (shield != "none") shieldid = shield.match(/itempopup\(event,'([0-9]+)'\)"/i)
    var pants = response.match(/<div style="position:absolute; left:118px; top:175px; width:62px; height:75px;text-align:center">.*[\n\r](<img .*)<\/div>/i) || "none"
    if (pants != "none"){pants = pants[1]}
    let pantsid = 'none'; if (pants != "none") pantsid = pants.match(/itempopup\(event,'([0-9]+)'\)"/i)
    var belt = response.match(/<div style="position:absolute; left:61px; top:192px; width:41px; height:41px;text-align:center">.*[\n\r](<img .*)<\/div>/i) || "none"
    if (belt != "none"){belt = belt[1]}
    let beltid = 'none'; if (belt != "none") beltid = belt.match(/itempopup\(event,'([0-9]+)'\)"/i)
    var ring = response.match(/<div style="position:absolute; left:197px; top:192px; width:41px; height:41px;text-align:center">.*[\n\r](<img .*)<\/div>/i) || "none"
    if (ring != "none"){ring = ring[1]}
    let ringid = 'none'; if (ring != "none") ringid = ring.match(/itempopup\(event,'([0-9]+)'\)"/i)
    var foot = response.match(/<div style="position:absolute; left:118px; top:262px; width:62px; height:66px;text-align:center">.*[\n\r](<img .*)<\/div>/i) || "none"
    if (foot != "none"){foot = foot[1]}
    let footid = 'none'; if (foot != "none") footid = foot.match(/itempopup\(event,'([0-9]+)'\)"/i)
    var gem = response.match(/<div style="position:absolute; left:10px; top:346px; width:32px; height:32px;text-align:center">.*[\n\r](<img .*)<\/div>/i) || "none"
    if (gem != "none"){gem = gem[1]}
    let gemid = 'none'; if (gem != "none") gemid = gem.match(/itempopup\(event,'([0-9]+)'\)"/i)
    var rune = response.match(/<div style="position:absolute; left:54px; top:346px; width:32px; height:32px;text-align:center">.*[\n\r](<img .*)<\/div>/i) || "none"
    if (rune != "none"){rune = rune[1]}
    let runeid = 'none'; if (rune != "none") runeid = rune.match(/itempopup\(event,'([0-9]+)'\)"/i)
    var badge = response.match(/<div style="position:absolute; left:214px; top:346px; width:32px; height:32px;text-align:center">.*[\n\r](<img .*)<\/div>/i) || "none"
    if (badge != "none"){badge = badge[1]}
    let badgeid = 'none'; if (badge != "none") badgeid = badge.match(/itempopup\(event,'([0-9]+)'\)"/i)
    var booster = response.match(/<div style="position:absolute; left:258px; top:346px; width:32px; height:32px;text-align:center">.*[\n\r](<img .*)<\/div>/i) || "none"
    if (booster != "none"){booster = booster[1]}
    let boosterid = 'none'; if (booster != "none") boosterid = booster.match(/itempopup\(event,'([0-9]+)'\)"/i)
    var crest1 = response.match(/<div style="position:absolute; left:9px; top:9px; width:60px; height:60px;text-align:center;">.*[\n\r](<img .*)<\/div>/i) || "none"
    if (crest1 != "none"){crest1 = crest1[1]}
    var crest2 = response.match(/<div style="position:absolute; left:83px; top:9px; width:60px; height:60px; text-align:center;">.*[\n\r](<img .*)<\/div>/i) || "none"
    if (crest2 != "none"){crest2 = crest2[1]}
    var crest3 = response.match(/<div style="position:absolute; left:157px; top:9px; width:60px; height:60px; text-align:center;">.*[\n\r](<img .*)<\/div>/i) || "none"
    if (crest3 != "none"){crest3 = crest3[1]}
    var crest4 = response.match(/<div style="position:absolute; left:231px; top:9px; width:60px; height:60px; text-align:center;">.*[\n\r](<img .*)<\/div>/i) || "none"
    if (crest4 != "none"){crest4 = crest4[1]}
    var crest1lvl = 0; if(crest1.match(/Quantum/i) != null) crest1lvl += 2; if(crest1.match(/Excelled/) != null) crest1lvl += 1; if(crest1 != "none") crest1lvl += 1;
    var crest2lvl = 0; if(crest2.match(/Explosive/i) != null) crest2lvl += 2; if(crest2.match(/Excelled/) != null) crest2lvl += 1; if(crest2 != "none") crest2lvl += 1;
    var crest3lvl = 0; if(crest3.match(/Violent/i) != null) crest3lvl += 2; if(crest3.match(/Excelled/) != null) crest3lvl += 1; if(crest3 != "none") crest3lvl += 1;
    var crest4lvl = 0; if(crest4.match(/Onslaught/i) != null) crest4lvl += 2; if(crest4.match(/Excelled/) != null) crest4lvl += 1; if(crest4 != "none") crest4lvl += 1;
    var orbs = response.match(/<div style="position:absolute; left:100px; top:346px; width:99px; height:32px;text-align:center">.*[\n\r](.*)<\/div>/i)[1]
    var orbscnt = ''; if (orbs == ""){orbscnt = 0}; if (orbs != ""){orbscnt = orbs.match(/img/g).length}
    var allorbs = '';
    if (orbscnt == 1){allorbs = response.match(/<div style="position:absolute; left:100px; top:346px; width:99px; height:32px;text-align:center">.*[\n\r].*(<img .*)<\/div>/i)}
    if (orbscnt == 2){allorbs = response.match(/<div style="position:absolute; left:100px; top:346px; width:99px; height:32px;text-align:center">.*[\n\r].*(<img .*)(<img .*)<\/div>/i)}
    if (orbscnt == 3){allorbs = response.match(/<div style="position:absolute; left:100px; top:346px; width:99px; height:32px;text-align:center">.*[\n\r].*(<img .*)(<img .*)(<img .*)<\/div>/i)}
    var orb1 = ''; if (orbscnt == 0) orb1 = "none"; if (orbscnt != 0) orb1 = allorbs[1]
    var orb2 = ''; if (orbscnt <= 1) orb2 = "none"; if (orbscnt >= 2) orb2 = allorbs[2]
    var orb3 = ''; if (orbscnt != 3) orb3 = "none"; if (orbscnt == 3) orb3 = allorbs[3]
    var orb1name = ''; if (orb1 == "none") orb1name = ["none","none"]; if (orb1 != "none") orb1name = orb1.match(/alt="(.*)">/i)
    var orb2name = ''; if (orb2 == "none") orb2name = ["none","none"]; if (orb2 != "none") orb2name = orb2.match(/alt="(.*)">/i)
    var orb3name = ''; if (orb3 == "none") orb3name = ["none","none"]; if (orb3 != "none") orb3name = orb3.match(/alt="(.*)">/i)
    let orb1id = 'none'; if (orb1 != "none") orb1id = orb1.match(/itempopup\(event,'([0-9]+)'\)"/i)
    let orb2id = 'none'; if (orb2 != "none") orb2id = orb2.match(/itempopup\(event,'([0-9]+)'\)"/i)
    let orb3id = 'none'; if (orb3 != "none") orb3id = orb3.match(/itempopup\(event,'([0-9]+)'\)"/i)

var addauglink = "augmentequip.php?suid="+document.querySelector("#moxxivision > tbody > tr:nth-child("+rownum+") > td:nth-child(1)").innerHTML
fetch(addauglink)
  .then(res => res.text())
  .then((responseText) => {
    const doc = new DOMParser().parseFromString(responseText, 'text/html');
    var eqtable = doc.querySelector("#content-header-row > div > div:nth-child(2) > div:nth-child(1) > div").innerHTML
            .replaceAll(/<div class="divItem" id="item-[0-9]+" onclick="updateItemDiv\([0-9]+\)">/g,"")
            .replaceAll(/<\/div>/g,"")
            .replaceAll(/<h4>[a-zA-Z]+<\/h4>/g,"")
    var augtable = doc.querySelector("#content-header-row > div > div:nth-child(2) > div:nth-child(2) > div:nth-child(2)").innerHTML
            .replaceAll(/<div id="augment-[0-9]+">/g,"")
            .replaceAll(/<\/div>/g,"")
            .replaceAll("You have no augments in this category","")
            .replaceAll(/<h[0-9]+>.*/g,"")

var core_augs = "none";var core_name = "none";var core_cloned = "none";var core_hp=0;var core_atk=0;var core_arcane=0;var core_arcaner=0;var core_block=0;var core_chaos=0;var core_crit=0;var core_eblock=0;var core_ept=0;var core_fire=0;var core_firer=0;var core_holy=0;var core_holyr=0;var core_kinetic=0;var core_kineticr=0;var core_mr=0;var core_ramp=0;var core_rpt=0;var core_shadow=0;var core_shadowr=0;var core_vile=0;var core_openaugs=0;var core_gems=0;var core_rarity="none";var core_upgrade="";
if (core != "none"){
var corelink = `item_rollover.php?id=`+coreid[1]
fetch(corelink)
  .then(res => res.text())
  .then((responseText) => {
    const doc = new DOMParser().parseFromString(responseText, 'text/html');
    const itemtable = doc.querySelector("#itemtable").innerHTML.replaceAll(",","").replaceAll("+","").replaceAll("%","").replaceAll(/<span style="color:#[A-Za-z0-9]+"> /g,"").replaceAll("</span>","").replaceAll("&nbsp; ","").replaceAll(/<span style="color:#[A-Za-z0-9]+">/g,"").replaceAll(/\([0-9]+\)/g,"").replaceAll(/\([0-9]+ atk \/ [0-9]+ hp\)/g,"").replaceAll(/\(<span style="color:#00FF00;">[0-9]+ ATK \/ [0-9]+ HP\)/g,"");
    const name = itemtable.match(/align="left">(.*)<\/td><\/tr>/i)
    core_name = name[1]
    const cloned = itemtable.match(/Cloned/)
    if (cloned != null) core_cloned = 1;
    var atk = itemtable.match(/([0-9]+) ATK/i) || [0,0]
    core_atk += parseInt(atk[1])
    var hp = itemtable.match(/([0-9]+) HP/i) || [0,0]
    core_hp += parseInt(hp[1])
    var holy = itemtable.match(/([0-9]+) Holy/i) || [0,0]
    core_holy += parseInt(holy[1])
    var arcane = itemtable.match(/([0-9]+) Arcane/i) || [0,0]
    core_arcane += parseInt(arcane[1])
    var fire = itemtable.match(/([0-9]+) Fire/i) || [0,0]
    core_fire += parseInt(fire[1])
    var kinetic = itemtable.match(/([0-9]+) Kinetic/i) || [0,0]
    core_kinetic += parseInt(kinetic[1])
    var shadow = itemtable.match(/([0-9]+) Shadow/i) || [0,0]
    core_shadow += parseInt(shadow[1])
    var chaos = itemtable.match(/([0-9]+) Chaos/i) || [0,0]
    core_chaos += parseInt(chaos[1])
    var vile = itemtable.match(/([0-9]+) vile energy/i) || [0,0]
    core_vile += parseInt(vile[1])
    var holyr = itemtable.match(/([0-9]+) Holy Resist/i) || [0,0]
    core_holyr += parseInt(holyr[1])
    var arcaner = itemtable.match(/([0-9]+) Arcane Resist/i) || [0,0]
    core_arcaner += parseInt(arcaner[1])
    var firer = itemtable.match(/([0-9]+) Fire Resist/i) || [0,0]
    core_firer += parseInt(firer[1])
    var kineticr = itemtable.match(/([0-9]+) Kinetic Resist/i) || [0,0]
    core_kineticr += parseInt(kineticr[1])
    var shadowr = itemtable.match(/([0-9]+) Shadow Resist/i) || [0,0]
    core_shadowr += parseInt(shadowr[1])
    var block = itemtable.match(/([0-9]+) block/i) || [0,0]
    core_block += parseInt(block[1])
    var eblock = itemtable.match(/([0-9]+) elemental block/i) || [0,0]
    core_eblock += parseInt(eblock[1])
    var rpt = itemtable.match(/([0-9]+) rage per hr/i) || [0,0]
    core_rpt += parseInt(rpt[1])
    var ept = itemtable.match(/([0-9]+) exp per hr/i) || [0,0]
    core_ept += parseInt(ept[1])
    var ramp = itemtable.match(/([0-9]+) rampage/i) || [0,0]
    core_ramp += parseInt(ramp[1])
    var mr = itemtable.match(/([0-9]+) max rage/i) || [0,0]
    core_mr += parseInt(mr[1])
    var crit = itemtable.match(/([0-9]+) critical hit/i) || [0,0]
    core_crit += parseInt(crit[1])
    var openaugs = itemtable.match(/<img src="\/images\/augslot\.jpg">/g) || [undefined,undefined,undefined,undefined,undefined]
    if (openaugs[0] != undefined) core_openaugs += 1;if (openaugs[1] != undefined) core_openaugs += 1;if (openaugs[2] != undefined) core_openaugs += 1;if (openaugs[3] != undefined) core_openaugs += 1;if (openaugs[4] != undefined) core_openaugs += 1;
    var gems = 0;if (itemtable.match(/<img src="\/images\/gem_white2\.jpg">/i) != null) gems += 1;if (itemtable.match(/<img src="\/images\/gem_red2\.jpg">/i) != null) gems += 1;if (itemtable.match(/<img src="\/images\/gem_blue2\.jpg">/i) != null) gems += 1;if (itemtable.match(/<img src="\/images\/gem_green1\.jpg">/i) != null) gems += 1;
    core_gems = gems;
    var rarity = itemtable.match(/<td colspan="2" style="height:20px;font-size:12pt;text-shadow: #47462E 1px 1px 2px;color:#([A-Za-z0-9]+)" align="left">/i)
    core_rarity = rarity[1]
    var gem1 = 0;if (rarity[1] == "CCCCCC") gem1 = 1;if (rarity[1] == "FFFFFF") gem1 = 2;if (rarity[1] == "1eff00") gem1 = 5;if (rarity[1] == "ffde5b") gem1 = 10;if (rarity[1] == "CA1111") gem1 = 20;if (rarity[1] == "0070ff") gem1 = 30;if (rarity[1] == "ff8000") gem1 = 40;if (rarity[1] == "9000ba") gem1 = 50;
    var gem2 = 0;if (rarity[1] == "CCCCCC") gem2 = 2;if (rarity[1] == "FFFFFF") gem2 = 5;if (rarity[1] == "1eff00") gem2 = 10;if (rarity[1] == "ffde5b") gem2 = 20;if (rarity[1] == "CA1111") gem2 = 40;if (rarity[1] == "0070ff") gem2 = 60;if (rarity[1] == "ff8000") gem2 = 80;if (rarity[1] == "9000ba") gem2 = 100;
    var gem3 = 0;if (rarity[1] == "CCCCCC") gem3 = 3;if (rarity[1] == "FFFFFF") gem3 = 8;if (rarity[1] == "1eff00") gem3 = 15;if (rarity[1] == "ffde5b") gem3 = 30;if (rarity[1] == "CA1111") gem3 = 60;if (rarity[1] == "0070ff") gem3 = 90;if (rarity[1] == "ff8000") gem3 = 120;if (rarity[1] == "9000ba") gem3 = 150;
    var gem4 = gem2*2
    var upgrade_cost = '';if (gems==0) upgrade_cost = gem1;else if (gems==1) upgrade_cost = gem2;else if (gems==2) upgrade_cost = gem3;else if (gems==3) upgrade_cost = gem4;else if (gems==4) upgrade_cost = (core_mr*0.15);
    core_upgrade = (core_mr*0.15/upgrade_cost).toFixed(2)
    if (itemtable.match(/<img width="9" style="border:1px solid #666666;margin:2px;" src=.*onmouseout="kill\(\)">/g) != null) {core_augs = itemtable.match(/<img width="9" style="border:1px solid #666666;margin:2px;" src=.*onmouseout="kill\(\)">/g).toString().replaceAll("event","event,")}
    if (itemtable.match(/<img width="9" style="border:1px solid #666666;margin:2px;" src=.*onmouseout="kill\(\)">/g) == null) {core_augs = `<button class='tab_button'><a href="`+addauglink+`" target="BLANK">ADD AUGMENTS</a></button>`}
})}

var head_augs = "none";var head_name = "none";var head_cloned = "none";var head_hp=0;var head_atk=0;var head_arcane=0;var head_arcaner=0;var head_block=0;var head_chaos=0;var head_crit=0;var head_eblock=0;var head_ept=0;var head_fire=0;var head_firer=0;var head_holy=0;var head_holyr=0;var head_kinetic=0;var head_kineticr=0;var head_mr=0;var head_ramp=0;var head_rpt=0;var head_shadow=0;var head_shadowr=0;var head_vile=0;var head_openaugs=0;var head_gems=0;var head_rarity="none";var head_upgrade="";
if (head != "none"){
var headlink = `item_rollover.php?id=`+headid[1]
fetch(headlink)
  .then(res => res.text())
  .then((responseText) => {
    const doc = new DOMParser().parseFromString(responseText, 'text/html');
    const itemtable = doc.querySelector("#itemtable").innerHTML.replaceAll(",","").replaceAll("+","").replaceAll("%","").replaceAll(/<span style="color:#[A-Za-z0-9]+"> /g,"").replaceAll("</span>","").replaceAll("&nbsp; ","").replaceAll(/<span style="color:#[A-Za-z0-9]+">/g,"").replaceAll(/\([0-9]+\)/g,"").replaceAll(/\([0-9]+ atk \/ [0-9]+ hp\)/g,"").replaceAll(/\(<span style="color:#00FF00;">[0-9]+ ATK \/ [0-9]+ HP\)/g,"");
    const name = itemtable.match(/align="left">(.*)<\/td><\/tr>/i)
    head_name = name[1]
    const cloned = itemtable.match(/Cloned/)
    if (cloned != null) head_cloned = 1;
    var atk = itemtable.match(/([0-9]+) ATK/i) || [0,0]
    head_atk += parseInt(atk[1])
    var hp = itemtable.match(/([0-9]+) HP/i) || [0,0]
    head_hp += parseInt(hp[1])
    var holy = itemtable.match(/([0-9]+) Holy/i) || [0,0]
    head_holy += parseInt(holy[1])
    var arcane = itemtable.match(/([0-9]+) Arcane/i) || [0,0]
    head_arcane += parseInt(arcane[1])
    var fire = itemtable.match(/([0-9]+) Fire/i) || [0,0]
    head_fire += parseInt(fire[1])
    var kinetic = itemtable.match(/([0-9]+) Kinetic/i) || [0,0]
    head_kinetic += parseInt(kinetic[1])
    var shadow = itemtable.match(/([0-9]+) Shadow/i) || [0,0]
    head_shadow += parseInt(shadow[1])
    var chaos = itemtable.match(/([0-9]+) Chaos/i) || [0,0]
    head_chaos += parseInt(chaos[1])
    var vile = itemtable.match(/([0-9]+) vile energy/i) || [0,0]
    head_vile += parseInt(vile[1])
    var holyr = itemtable.match(/([0-9]+) Holy Resist/i) || [0,0]
    head_holyr += parseInt(holyr[1])
    var arcaner = itemtable.match(/([0-9]+) Arcane Resist/i) || [0,0]
    head_arcaner += parseInt(arcaner[1])
    var firer = itemtable.match(/([0-9]+) Fire Resist/i) || [0,0]
    head_firer += parseInt(firer[1])
    var kineticr = itemtable.match(/([0-9]+) Kinetic Resist/i) || [0,0]
    head_kineticr += parseInt(kineticr[1])
    var shadowr = itemtable.match(/([0-9]+) Shadow Resist/i) || [0,0]
    head_shadowr += parseInt(shadowr[1])
    var block = itemtable.match(/([0-9]+) block/i) || [0,0]
    head_block += parseInt(block[1])
    var eblock = itemtable.match(/([0-9]+) elemental block/i) || [0,0]
    head_eblock += parseInt(eblock[1])
    var rpt = itemtable.match(/([0-9]+) rage per hr/i) || [0,0]
    head_rpt += parseInt(rpt[1])
    var ept = itemtable.match(/([0-9]+) exp per hr/i) || [0,0]
    head_ept += parseInt(ept[1])
    var ramp = itemtable.match(/([0-9]+) rampage/i) || [0,0]
    head_ramp += parseInt(ramp[1])
    var mr = itemtable.match(/([0-9]+) max rage/i) || [0,0]
    head_mr += parseInt(mr[1])
    var crit = itemtable.match(/([0-9]+) critical hit/i) || [0,0]
    head_crit += parseInt(crit[1])
    var openaugs = itemtable.match(/<img src="\/images\/augslot\.jpg">/g) || [undefined,undefined,undefined,undefined,undefined]
    if (openaugs[0] != undefined) head_openaugs += 1;if (openaugs[1] != undefined) head_openaugs += 1;if (openaugs[2] != undefined) head_openaugs += 1;if (openaugs[3] != undefined) head_openaugs += 1;if (openaugs[4] != undefined) head_openaugs += 1;
    var gems = 0;if (itemtable.match(/<img src="\/images\/gem_white2\.jpg">/i) != null) gems += 1;if (itemtable.match(/<img src="\/images\/gem_red2\.jpg">/i) != null) gems += 1;if (itemtable.match(/<img src="\/images\/gem_blue2\.jpg">/i) != null) gems += 1;if (itemtable.match(/<img src="\/images\/gem_green1\.jpg">/i) != null) gems += 1;
    head_gems = gems;
    var rarity = itemtable.match(/<td colspan="2" style="height:20px;font-size:12pt;text-shadow: #47462E 1px 1px 2px;color:#([A-Za-z0-9]+)" align="left">/i)
    head_rarity = rarity[1]
    var gem1 = 0;if (rarity[1] == "CCCCCC") gem1 = 1;if (rarity[1] == "FFFFFF") gem1 = 2;if (rarity[1] == "1eff00") gem1 = 5;if (rarity[1] == "ffde5b") gem1 = 10;if (rarity[1] == "CA1111") gem1 = 20;if (rarity[1] == "0070ff") gem1 = 30;if (rarity[1] == "ff8000") gem1 = 40;if (rarity[1] == "9000ba") gem1 = 50;
    var gem2 = 0;if (rarity[1] == "CCCCCC") gem2 = 2;if (rarity[1] == "FFFFFF") gem2 = 5;if (rarity[1] == "1eff00") gem2 = 10;if (rarity[1] == "ffde5b") gem2 = 20;if (rarity[1] == "CA1111") gem2 = 40;if (rarity[1] == "0070ff") gem2 = 60;if (rarity[1] == "ff8000") gem2 = 80;if (rarity[1] == "9000ba") gem2 = 100;
    var gem3 = 0;if (rarity[1] == "CCCCCC") gem3 = 3;if (rarity[1] == "FFFFFF") gem3 = 8;if (rarity[1] == "1eff00") gem3 = 15;if (rarity[1] == "ffde5b") gem3 = 30;if (rarity[1] == "CA1111") gem3 = 60;if (rarity[1] == "0070ff") gem3 = 90;if (rarity[1] == "ff8000") gem3 = 120;if (rarity[1] == "9000ba") gem3 = 150;
    var gem4 = gem2*2
    var upgrade_cost = '';if (gems==0) upgrade_cost = gem1;else if (gems==1) upgrade_cost = gem2;else if (gems==2) upgrade_cost = gem3;else if (gems==3) upgrade_cost = gem4;else if (gems==4) upgrade_cost = (head_mr*0.15);
    head_upgrade = (head_mr*0.15/upgrade_cost).toFixed(2)
    if (itemtable.match(/<img width="9" style="border:1px solid #666666;margin:2px;" src=.*onmouseout="kill\(\)">/g) != null) {head_augs = itemtable.match(/<img width="9" style="border:1px solid #666666;margin:2px;" src=.*onmouseout="kill\(\)">/g).toString().replaceAll("event","event,")}
    if (itemtable.match(/<img width="9" style="border:1px solid #666666;margin:2px;" src=.*onmouseout="kill\(\)">/g) == null) {head_augs = `<button class='tab_button'><a href="`+addauglink+`" target="BLANK">ADD AUGMENTS</a></button>`}
})}

var neck_augs = "none";var neck_name = "none";var neck_cloned = "none";var neck_hp=0;var neck_atk=0;var neck_arcane=0;var neck_arcaner=0;var neck_block=0;var neck_chaos=0;var neck_crit=0;var neck_eblock=0;var neck_ept=0;var neck_fire=0;var neck_firer=0;var neck_holy=0;var neck_holyr=0;var neck_kinetic=0;var neck_kineticr=0;var neck_mr=0;var neck_ramp=0;var neck_rpt=0;var neck_shadow=0;var neck_shadowr=0;var neck_vile=0;var neck_openaugs=0;var neck_gems=0;var neck_rarity="none";var neck_upgrade="";
if (neck != "none"){
var necklink = `item_rollover.php?id=`+neckid[1]
fetch(necklink)
  .then(res => res.text())
  .then((responseText) => {
    const doc = new DOMParser().parseFromString(responseText, 'text/html');
    const itemtable = doc.querySelector("#itemtable").innerHTML.replaceAll(",","").replaceAll("+","").replaceAll("%","").replaceAll(/<span style="color:#[A-Za-z0-9]+"> /g,"").replaceAll("</span>","").replaceAll("&nbsp; ","").replaceAll(/<span style="color:#[A-Za-z0-9]+">/g,"").replaceAll(/\([0-9]+\)/g,"").replaceAll(/\([0-9]+ atk \/ [0-9]+ hp\)/g,"").replaceAll(/\(<span style="color:#00FF00;">[0-9]+ ATK \/ [0-9]+ HP\)/g,"");
    const name = itemtable.match(/align="left">(.*)<\/td><\/tr>/i)
    neck_name = name[1]
    const cloned = itemtable.match(/Cloned/)
    if (cloned != null) neck_cloned = 1;
    var atk = itemtable.match(/([0-9]+) ATK/i) || [0,0]
    neck_atk += parseInt(atk[1])
    var hp = itemtable.match(/([0-9]+) HP/i) || [0,0]
    neck_hp += parseInt(hp[1])
    var holy = itemtable.match(/([0-9]+) Holy/i) || [0,0]
    neck_holy += parseInt(holy[1])
    var arcane = itemtable.match(/([0-9]+) Arcane/i) || [0,0]
    neck_arcane += parseInt(arcane[1])
    var fire = itemtable.match(/([0-9]+) Fire/i) || [0,0]
    neck_fire += parseInt(fire[1])
    var kinetic = itemtable.match(/([0-9]+) Kinetic/i) || [0,0]
    neck_kinetic += parseInt(kinetic[1])
    var shadow = itemtable.match(/([0-9]+) Shadow/i) || [0,0]
    neck_shadow += parseInt(shadow[1])
    var chaos = itemtable.match(/([0-9]+) Chaos/i) || [0,0]
    neck_chaos += parseInt(chaos[1])
    var vile = itemtable.match(/([0-9]+) vile energy/i) || [0,0]
    neck_vile += parseInt(vile[1])
    var holyr = itemtable.match(/([0-9]+) Holy Resist/i) || [0,0]
    neck_holyr += parseInt(holyr[1])
    var arcaner = itemtable.match(/([0-9]+) Arcane Resist/i) || [0,0]
    neck_arcaner += parseInt(arcaner[1])
    var firer = itemtable.match(/([0-9]+) Fire Resist/i) || [0,0]
    neck_firer += parseInt(firer[1])
    var kineticr = itemtable.match(/([0-9]+) Kinetic Resist/i) || [0,0]
    neck_kineticr += parseInt(kineticr[1])
    var shadowr = itemtable.match(/([0-9]+) Shadow Resist/i) || [0,0]
    neck_shadowr += parseInt(shadowr[1])
    var block = itemtable.match(/([0-9]+) block/i) || [0,0]
    neck_block += parseInt(block[1])
    var eblock = itemtable.match(/([0-9]+) elemental block/i) || [0,0]
    neck_eblock += parseInt(eblock[1])
    var rpt = itemtable.match(/([0-9]+) rage per hr/i) || [0,0]
    neck_rpt += parseInt(rpt[1])
    var ept = itemtable.match(/([0-9]+) exp per hr/i) || [0,0]
    neck_ept += parseInt(ept[1])
    var ramp = itemtable.match(/([0-9]+) rampage/i) || [0,0]
    neck_ramp += parseInt(ramp[1])
    var mr = itemtable.match(/([0-9]+) max rage/i) || [0,0]
    neck_mr += parseInt(mr[1])
    var crit = itemtable.match(/([0-9]+) critical hit/i) || [0,0]
    neck_crit += parseInt(crit[1])
    var openaugs = itemtable.match(/<img src="\/images\/augslot\.jpg">/g) || [undefined,undefined,undefined,undefined,undefined]
    if (openaugs[0] != undefined) neck_openaugs += 1;if (openaugs[1] != undefined) neck_openaugs += 1;if (openaugs[2] != undefined) neck_openaugs += 1;if (openaugs[3] != undefined) neck_openaugs += 1;if (openaugs[4] != undefined) neck_openaugs += 1;
    var gems = 0;if (itemtable.match(/<img src="\/images\/gem_white2\.jpg">/i) != null) gems += 1;if (itemtable.match(/<img src="\/images\/gem_red2\.jpg">/i) != null) gems += 1;if (itemtable.match(/<img src="\/images\/gem_blue2\.jpg">/i) != null) gems += 1;if (itemtable.match(/<img src="\/images\/gem_green1\.jpg">/i) != null) gems += 1;
    neck_gems = gems;
    var rarity = itemtable.match(/<td colspan="2" style="height:20px;font-size:12pt;text-shadow: #47462E 1px 1px 2px;color:#([A-Za-z0-9]+)" align="left">/i)
    neck_rarity = rarity[1]
    var gem1 = 0;if (rarity[1] == "CCCCCC") gem1 = 1;if (rarity[1] == "FFFFFF") gem1 = 2;if (rarity[1] == "1eff00") gem1 = 5;if (rarity[1] == "ffde5b") gem1 = 10;if (rarity[1] == "CA1111") gem1 = 20;if (rarity[1] == "0070ff") gem1 = 30;if (rarity[1] == "ff8000") gem1 = 40;if (rarity[1] == "9000ba") gem1 = 50;
    var gem2 = 0;if (rarity[1] == "CCCCCC") gem2 = 2;if (rarity[1] == "FFFFFF") gem2 = 5;if (rarity[1] == "1eff00") gem2 = 10;if (rarity[1] == "ffde5b") gem2 = 20;if (rarity[1] == "CA1111") gem2 = 40;if (rarity[1] == "0070ff") gem2 = 60;if (rarity[1] == "ff8000") gem2 = 80;if (rarity[1] == "9000ba") gem2 = 100;
    var gem3 = 0;if (rarity[1] == "CCCCCC") gem3 = 3;if (rarity[1] == "FFFFFF") gem3 = 8;if (rarity[1] == "1eff00") gem3 = 15;if (rarity[1] == "ffde5b") gem3 = 30;if (rarity[1] == "CA1111") gem3 = 60;if (rarity[1] == "0070ff") gem3 = 90;if (rarity[1] == "ff8000") gem3 = 120;if (rarity[1] == "9000ba") gem3 = 150;
    var gem4 = gem2*2
    var upgrade_cost = '';if (gems==0) upgrade_cost = gem1;else if (gems==1) upgrade_cost = gem2;else if (gems==2) upgrade_cost = gem3;else if (gems==3) upgrade_cost = gem4;else if (gems==4) upgrade_cost = (neck_mr*0.15);
    neck_upgrade = (neck_mr*0.15/upgrade_cost).toFixed(2)
    if (itemtable.match(/<img width="9" style="border:1px solid #666666;margin:2px;" src=.*onmouseout="kill\(\)">/g) != null) {neck_augs = itemtable.match(/<img width="9" style="border:1px solid #666666;margin:2px;" src=.*onmouseout="kill\(\)">/g).toString().replaceAll("event","event,")}
    if (itemtable.match(/<img width="9" style="border:1px solid #666666;margin:2px;" src=.*onmouseout="kill\(\)">/g) == null) {neck_augs = `<button class='tab_button'><a href="`+addauglink+`" target="BLANK">ADD AUGMENTS</a></button>`}
})}

var weapon_augs = "none";var weapon_name = "none";var weapon_cloned = "none";var weapon_hp=0;var weapon_atk=0;var weapon_arcane=0;var weapon_arcaner=0;var weapon_block=0;var weapon_chaos=0;var weapon_crit=0;var weapon_eblock=0;var weapon_ept=0;var weapon_fire=0;var weapon_firer=0;var weapon_holy=0;var weapon_holyr=0;var weapon_kinetic=0;var weapon_kineticr=0;var weapon_mr=0;var weapon_ramp=0;var weapon_rpt=0;var weapon_shadow=0;var weapon_shadowr=0;var weapon_vile=0;var weapon_openaugs=0;var weapon_gems=0;var weapon_rarity="none";var weapon_upgrade="";
if (weapon != "none"){
var weaponlink = `item_rollover.php?id=`+weaponid[1]
fetch(weaponlink)
  .then(res => res.text())
  .then((responseText) => {
    const doc = new DOMParser().parseFromString(responseText, 'text/html');
    const itemtable = doc.querySelector("#itemtable").innerHTML.replaceAll(",","").replaceAll("+","").replaceAll("%","").replaceAll(/<span style="color:#[A-Za-z0-9]+"> /g,"").replaceAll("</span>","").replaceAll("&nbsp; ","").replaceAll(/<span style="color:#[A-Za-z0-9]+">/g,"").replaceAll(/\([0-9]+\)/g,"").replaceAll(/\([0-9]+ atk \/ [0-9]+ hp\)/g,"").replaceAll(/\(<span style="color:#00FF00;">[0-9]+ ATK \/ [0-9]+ HP\)/g,"");
    const name = itemtable.match(/align="left">(.*)<\/td><\/tr>/i)
    weapon_name = name[1]
    const cloned = itemtable.match(/Cloned/)
    if (cloned != null) weapon_cloned = 1;
    var atk = itemtable.match(/([0-9]+) ATK/i) || [0,0]
    weapon_atk += parseInt(atk[1])
    var hp = itemtable.match(/([0-9]+) HP/i) || [0,0]
    weapon_hp += parseInt(hp[1])
    var holy = itemtable.match(/([0-9]+) Holy/i) || [0,0]
    weapon_holy += parseInt(holy[1])
    var arcane = itemtable.match(/([0-9]+) Arcane/i) || [0,0]
    weapon_arcane += parseInt(arcane[1])
    var fire = itemtable.match(/([0-9]+) Fire/i) || [0,0]
    weapon_fire += parseInt(fire[1])
    var kinetic = itemtable.match(/([0-9]+) Kinetic/i) || [0,0]
    weapon_kinetic += parseInt(kinetic[1])
    var shadow = itemtable.match(/([0-9]+) Shadow/i) || [0,0]
    weapon_shadow += parseInt(shadow[1])
    var chaos = itemtable.match(/([0-9]+) Chaos/i) || [0,0]
    weapon_chaos += parseInt(chaos[1])
    var vile = itemtable.match(/([0-9]+) vile energy/i) || [0,0]
    weapon_vile += parseInt(vile[1])
    var holyr = itemtable.match(/([0-9]+) Holy Resist/i) || [0,0]
    weapon_holyr += parseInt(holyr[1])
    var arcaner = itemtable.match(/([0-9]+) Arcane Resist/i) || [0,0]
    weapon_arcaner += parseInt(arcaner[1])
    var firer = itemtable.match(/([0-9]+) Fire Resist/i) || [0,0]
    weapon_firer += parseInt(firer[1])
    var kineticr = itemtable.match(/([0-9]+) Kinetic Resist/i) || [0,0]
    weapon_kineticr += parseInt(kineticr[1])
    var shadowr = itemtable.match(/([0-9]+) Shadow Resist/i) || [0,0]
    weapon_shadowr += parseInt(shadowr[1])
    var block = itemtable.match(/([0-9]+) block/i) || [0,0]
    weapon_block += parseInt(block[1])
    var eblock = itemtable.match(/([0-9]+) elemental block/i) || [0,0]
    weapon_eblock += parseInt(eblock[1])
    var rpt = itemtable.match(/([0-9]+) rage per hr/i) || [0,0]
    weapon_rpt += parseInt(rpt[1])
    var ept = itemtable.match(/([0-9]+) exp per hr/i) || [0,0]
    weapon_ept += parseInt(ept[1])
    var ramp = itemtable.match(/([0-9]+) rampage/i) || [0,0]
    weapon_ramp += parseInt(ramp[1])
    var mr = itemtable.match(/([0-9]+) max rage/i) || [0,0]
    weapon_mr += parseInt(mr[1])
    var crit = itemtable.match(/([0-9]+) critical hit/i) || [0,0]
    weapon_crit += parseInt(crit[1])
    var openaugs = itemtable.match(/<img src="\/images\/augslot\.jpg">/g) || [undefined,undefined,undefined,undefined,undefined]
    if (openaugs[0] != undefined) weapon_openaugs += 1;if (openaugs[1] != undefined) weapon_openaugs += 1;if (openaugs[2] != undefined) weapon_openaugs += 1;if (openaugs[3] != undefined) weapon_openaugs += 1;if (openaugs[4] != undefined) weapon_openaugs += 1;
    var gems = 0;if (itemtable.match(/<img src="\/images\/gem_white2\.jpg">/i) != null) gems += 1;if (itemtable.match(/<img src="\/images\/gem_red2\.jpg">/i) != null) gems += 1;if (itemtable.match(/<img src="\/images\/gem_blue2\.jpg">/i) != null) gems += 1;if (itemtable.match(/<img src="\/images\/gem_green1\.jpg">/i) != null) gems += 1;
    weapon_gems = gems;
    var rarity = itemtable.match(/<td colspan="2" style="height:20px;font-size:12pt;text-shadow: #47462E 1px 1px 2px;color:#([A-Za-z0-9]+)" align="left">/i)
    weapon_rarity = rarity[1]
    var gem1 = 0;if (rarity[1] == "CCCCCC") gem1 = 1;if (rarity[1] == "FFFFFF") gem1 = 2;if (rarity[1] == "1eff00") gem1 = 5;if (rarity[1] == "ffde5b") gem1 = 10;if (rarity[1] == "CA1111") gem1 = 20;if (rarity[1] == "0070ff") gem1 = 30;if (rarity[1] == "ff8000") gem1 = 40;if (rarity[1] == "9000ba") gem1 = 50;
    var gem2 = 0;if (rarity[1] == "CCCCCC") gem2 = 2;if (rarity[1] == "FFFFFF") gem2 = 5;if (rarity[1] == "1eff00") gem2 = 10;if (rarity[1] == "ffde5b") gem2 = 20;if (rarity[1] == "CA1111") gem2 = 40;if (rarity[1] == "0070ff") gem2 = 60;if (rarity[1] == "ff8000") gem2 = 80;if (rarity[1] == "9000ba") gem2 = 100;
    var gem3 = 0;if (rarity[1] == "CCCCCC") gem3 = 3;if (rarity[1] == "FFFFFF") gem3 = 8;if (rarity[1] == "1eff00") gem3 = 15;if (rarity[1] == "ffde5b") gem3 = 30;if (rarity[1] == "CA1111") gem3 = 60;if (rarity[1] == "0070ff") gem3 = 90;if (rarity[1] == "ff8000") gem3 = 120;if (rarity[1] == "9000ba") gem3 = 150;
    var gem4 = gem2*2
    var upgrade_cost = '';if (gems==0) upgrade_cost = gem1;else if (gems==1) upgrade_cost = gem2;else if (gems==2) upgrade_cost = gem3;else if (gems==3) upgrade_cost = gem4;else if (gems==4) upgrade_cost = (weapon_mr*0.15);
    weapon_upgrade = (weapon_mr*0.15/upgrade_cost).toFixed(2)
    if (itemtable.match(/<img width="9" style="border:1px solid #666666;margin:2px;" src=.*onmouseout="kill\(\)">/g) != null) {weapon_augs = itemtable.match(/<img width="9" style="border:1px solid #666666;margin:2px;" src=.*onmouseout="kill\(\)">/g).toString().replaceAll("event","event,")}
    if (itemtable.match(/<img width="9" style="border:1px solid #666666;margin:2px;" src=.*onmouseout="kill\(\)">/g) == null) {weapon_augs = `<button class='tab_button'><a href="`+addauglink+`" target="BLANK">ADD AUGMENTS</a></button>`}
})}

var body_augs = "none";var body_name = "none";var body_cloned = "none";var body_hp=0;var body_atk=0;var body_arcane=0;var body_arcaner=0;var body_block=0;var body_chaos=0;var body_crit=0;var body_eblock=0;var body_ept=0;var body_fire=0;var body_firer=0;var body_holy=0;var body_holyr=0;var body_kinetic=0;var body_kineticr=0;var body_mr=0;var body_ramp=0;var body_rpt=0;var body_shadow=0;var body_shadowr=0;var body_vile=0;var body_openaugs=0;var body_gems=0;var body_rarity="none";var body_upgrade="";
if (body != "none"){
var bodylink = `item_rollover.php?id=`+bodyid[1]
fetch(bodylink)
  .then(res => res.text())
  .then((responseText) => {
    const doc = new DOMParser().parseFromString(responseText, 'text/html');
    const itemtable = doc.querySelector("#itemtable").innerHTML.replaceAll(",","").replaceAll("+","").replaceAll("%","").replaceAll(/<span style="color:#[A-Za-z0-9]+"> /g,"").replaceAll("</span>","").replaceAll("&nbsp; ","").replaceAll(/<span style="color:#[A-Za-z0-9]+">/g,"").replaceAll(/\([0-9]+\)/g,"").replaceAll(/\([0-9]+ atk \/ [0-9]+ hp\)/g,"").replaceAll(/\(<span style="color:#00FF00;">[0-9]+ ATK \/ [0-9]+ HP\)/g,"");
    const name = itemtable.match(/align="left">(.*)<\/td><\/tr>/i)
    body_name = name[1]
    const cloned = itemtable.match(/Cloned/)
    if (cloned != null) body_cloned = 1;
    var atk = itemtable.match(/([0-9]+) ATK/i) || [0,0]
    body_atk += parseInt(atk[1])
    var hp = itemtable.match(/([0-9]+) HP/i) || [0,0]
    body_hp += parseInt(hp[1])
    var holy = itemtable.match(/([0-9]+) Holy/i) || [0,0]
    body_holy += parseInt(holy[1])
    var arcane = itemtable.match(/([0-9]+) Arcane/i) || [0,0]
    body_arcane += parseInt(arcane[1])
    var fire = itemtable.match(/([0-9]+) Fire/i) || [0,0]
    body_fire += parseInt(fire[1])
    var kinetic = itemtable.match(/([0-9]+) Kinetic/i) || [0,0]
    body_kinetic += parseInt(kinetic[1])
    var shadow = itemtable.match(/([0-9]+) Shadow/i) || [0,0]
    body_shadow += parseInt(shadow[1])
    var chaos = itemtable.match(/([0-9]+) Chaos/i) || [0,0]
    body_chaos += parseInt(chaos[1])
    var vile = itemtable.match(/([0-9]+) vile energy/i) || [0,0]
    body_vile += parseInt(vile[1])
    var holyr = itemtable.match(/([0-9]+) Holy Resist/i) || [0,0]
    body_holyr += parseInt(holyr[1])
    var arcaner = itemtable.match(/([0-9]+) Arcane Resist/i) || [0,0]
    body_arcaner += parseInt(arcaner[1])
    var firer = itemtable.match(/([0-9]+) Fire Resist/i) || [0,0]
    body_firer += parseInt(firer[1])
    var kineticr = itemtable.match(/([0-9]+) Kinetic Resist/i) || [0,0]
    body_kineticr += parseInt(kineticr[1])
    var shadowr = itemtable.match(/([0-9]+) Shadow Resist/i) || [0,0]
    body_shadowr += parseInt(shadowr[1])
    var block = itemtable.match(/([0-9]+) block/i) || [0,0]
    body_block += parseInt(block[1])
    var eblock = itemtable.match(/([0-9]+) elemental block/i) || [0,0]
    body_eblock += parseInt(eblock[1])
    var rpt = itemtable.match(/([0-9]+) rage per hr/i) || [0,0]
    body_rpt += parseInt(rpt[1])
    var ept = itemtable.match(/([0-9]+) exp per hr/i) || [0,0]
    body_ept += parseInt(ept[1])
    var ramp = itemtable.match(/([0-9]+) rampage/i) || [0,0]
    body_ramp += parseInt(ramp[1])
    var mr = itemtable.match(/([0-9]+) max rage/i) || [0,0]
    body_mr += parseInt(mr[1])
    var crit = itemtable.match(/([0-9]+) critical hit/i) || [0,0]
    body_crit += parseInt(crit[1])
    var openaugs = itemtable.match(/<img src="\/images\/augslot\.jpg">/g) || [undefined,undefined,undefined,undefined,undefined]
    if (openaugs[0] != undefined) body_openaugs += 1;if (openaugs[1] != undefined) body_openaugs += 1;if (openaugs[2] != undefined) body_openaugs += 1;if (openaugs[3] != undefined) body_openaugs += 1;if (openaugs[4] != undefined) body_openaugs += 1;
    var gems = 0;if (itemtable.match(/<img src="\/images\/gem_white2\.jpg">/i) != null) gems += 1;if (itemtable.match(/<img src="\/images\/gem_red2\.jpg">/i) != null) gems += 1;if (itemtable.match(/<img src="\/images\/gem_blue2\.jpg">/i) != null) gems += 1;if (itemtable.match(/<img src="\/images\/gem_green1\.jpg">/i) != null) gems += 1;
    body_gems = gems;
    var rarity = itemtable.match(/<td colspan="2" style="height:20px;font-size:12pt;text-shadow: #47462E 1px 1px 2px;color:#([A-Za-z0-9]+)" align="left">/i)
    body_rarity = rarity[1]
    var gem1 = 0;if (rarity[1] == "CCCCCC") gem1 = 1;if (rarity[1] == "FFFFFF") gem1 = 2;if (rarity[1] == "1eff00") gem1 = 5;if (rarity[1] == "ffde5b") gem1 = 10;if (rarity[1] == "CA1111") gem1 = 20;if (rarity[1] == "0070ff") gem1 = 30;if (rarity[1] == "ff8000") gem1 = 40;if (rarity[1] == "9000ba") gem1 = 50;
    var gem2 = 0;if (rarity[1] == "CCCCCC") gem2 = 2;if (rarity[1] == "FFFFFF") gem2 = 5;if (rarity[1] == "1eff00") gem2 = 10;if (rarity[1] == "ffde5b") gem2 = 20;if (rarity[1] == "CA1111") gem2 = 40;if (rarity[1] == "0070ff") gem2 = 60;if (rarity[1] == "ff8000") gem2 = 80;if (rarity[1] == "9000ba") gem2 = 100;
    var gem3 = 0;if (rarity[1] == "CCCCCC") gem3 = 3;if (rarity[1] == "FFFFFF") gem3 = 8;if (rarity[1] == "1eff00") gem3 = 15;if (rarity[1] == "ffde5b") gem3 = 30;if (rarity[1] == "CA1111") gem3 = 60;if (rarity[1] == "0070ff") gem3 = 90;if (rarity[1] == "ff8000") gem3 = 120;if (rarity[1] == "9000ba") gem3 = 150;
    var gem4 = gem2*2
    var upgrade_cost = '';if (gems==0) upgrade_cost = gem1;else if (gems==1) upgrade_cost = gem2;else if (gems==2) upgrade_cost = gem3;else if (gems==3) upgrade_cost = gem4;else if (gems==4) upgrade_cost = (body_mr*0.15);
    body_upgrade = (body_mr*0.15/upgrade_cost).toFixed(2)
    if (itemtable.match(/<img width="9" style="border:1px solid #666666;margin:2px;" src=.*onmouseout="kill\(\)">/g) != null) {body_augs = itemtable.match(/<img width="9" style="border:1px solid #666666;margin:2px;" src=.*onmouseout="kill\(\)">/g).toString().replaceAll("event","event,")}
    if (itemtable.match(/<img width="9" style="border:1px solid #666666;margin:2px;" src=.*onmouseout="kill\(\)">/g) == null) {body_augs = `<button class='tab_button'><a href="`+addauglink+`" target="BLANK">ADD AUGMENTS</a></button>`}
})}

var shield_augs = "none";var shield_name = "none";var shield_cloned = "none";var shield_hp=0;var shield_atk=0;var shield_arcane=0;var shield_arcaner=0;var shield_block=0;var shield_chaos=0;var shield_crit=0;var shield_eblock=0;var shield_ept=0;var shield_fire=0;var shield_firer=0;var shield_holy=0;var shield_holyr=0;var shield_kinetic=0;var shield_kineticr=0;var shield_mr=0;var shield_ramp=0;var shield_rpt=0;var shield_shadow=0;var shield_shadowr=0;var shield_vile=0;var shield_openaugs=0;var shield_gems=0;var shield_rarity="none";var shield_upgrade="";
if (shield != "none"){
var shieldlink = `item_rollover.php?id=`+shieldid[1]
fetch(shieldlink)
  .then(res => res.text())
  .then((responseText) => {
    const doc = new DOMParser().parseFromString(responseText, 'text/html');
    const itemtable = doc.querySelector("#itemtable").innerHTML.replaceAll(",","").replaceAll("+","").replaceAll("%","").replaceAll(/<span style="color:#[A-Za-z0-9]+"> /g,"").replaceAll("</span>","").replaceAll("&nbsp; ","").replaceAll(/<span style="color:#[A-Za-z0-9]+">/g,"").replaceAll(/\([0-9]+\)/g,"").replaceAll(/\([0-9]+ atk \/ [0-9]+ hp\)/g,"").replaceAll(/\(<span style="color:#00FF00;">[0-9]+ ATK \/ [0-9]+ HP\)/g,"");
    const name = itemtable.match(/align="left">(.*)<\/td><\/tr>/i)
    shield_name = name[1]
    const cloned = itemtable.match(/Cloned/)
    if (cloned != null) shield_cloned = 1;
    var atk = itemtable.match(/([0-9]+) ATK/i) || [0,0]
    shield_atk += parseInt(atk[1])
    var hp = itemtable.match(/([0-9]+) HP/i) || [0,0]
    shield_hp += parseInt(hp[1])
    var holy = itemtable.match(/([0-9]+) Holy/i) || [0,0]
    shield_holy += parseInt(holy[1])
    var arcane = itemtable.match(/([0-9]+) Arcane/i) || [0,0]
    shield_arcane += parseInt(arcane[1])
    var fire = itemtable.match(/([0-9]+) Fire/i) || [0,0]
    shield_fire += parseInt(fire[1])
    var kinetic = itemtable.match(/([0-9]+) Kinetic/i) || [0,0]
    shield_kinetic += parseInt(kinetic[1])
    var shadow = itemtable.match(/([0-9]+) Shadow/i) || [0,0]
    shield_shadow += parseInt(shadow[1])
    var chaos = itemtable.match(/([0-9]+) Chaos/i) || [0,0]
    shield_chaos += parseInt(chaos[1])
    var vile = itemtable.match(/([0-9]+) vile energy/i) || [0,0]
    shield_vile += parseInt(vile[1])
    var holyr = itemtable.match(/([0-9]+) Holy Resist/i) || [0,0]
    shield_holyr += parseInt(holyr[1])
    var arcaner = itemtable.match(/([0-9]+) Arcane Resist/i) || [0,0]
    shield_arcaner += parseInt(arcaner[1])
    var firer = itemtable.match(/([0-9]+) Fire Resist/i) || [0,0]
    shield_firer += parseInt(firer[1])
    var kineticr = itemtable.match(/([0-9]+) Kinetic Resist/i) || [0,0]
    shield_kineticr += parseInt(kineticr[1])
    var shadowr = itemtable.match(/([0-9]+) Shadow Resist/i) || [0,0]
    shield_shadowr += parseInt(shadowr[1])
    var block = itemtable.match(/([0-9]+) block/i) || [0,0]
    shield_block += parseInt(block[1])
    var eblock = itemtable.match(/([0-9]+) elemental block/i) || [0,0]
    shield_eblock += parseInt(eblock[1])
    var rpt = itemtable.match(/([0-9]+) rage per hr/i) || [0,0]
    shield_rpt += parseInt(rpt[1])
    var ept = itemtable.match(/([0-9]+) exp per hr/i) || [0,0]
    shield_ept += parseInt(ept[1])
    var ramp = itemtable.match(/([0-9]+) rampage/i) || [0,0]
    shield_ramp += parseInt(ramp[1])
    var mr = itemtable.match(/([0-9]+) max rage/i) || [0,0]
    shield_mr += parseInt(mr[1])
    var crit = itemtable.match(/([0-9]+) critical hit/i) || [0,0]
    shield_crit += parseInt(crit[1])
    var openaugs = itemtable.match(/<img src="\/images\/augslot\.jpg">/g) || [undefined,undefined,undefined,undefined,undefined]
    if (openaugs[0] != undefined) shield_openaugs += 1;if (openaugs[1] != undefined) shield_openaugs += 1;if (openaugs[2] != undefined) shield_openaugs += 1;if (openaugs[3] != undefined) shield_openaugs += 1;if (openaugs[4] != undefined) shield_openaugs += 1;
    var gems = 0;if (itemtable.match(/<img src="\/images\/gem_white2\.jpg">/i) != null) gems += 1;if (itemtable.match(/<img src="\/images\/gem_red2\.jpg">/i) != null) gems += 1;if (itemtable.match(/<img src="\/images\/gem_blue2\.jpg">/i) != null) gems += 1;if (itemtable.match(/<img src="\/images\/gem_green1\.jpg">/i) != null) gems += 1;
    shield_gems = gems;
    var rarity = itemtable.match(/<td colspan="2" style="height:20px;font-size:12pt;text-shadow: #47462E 1px 1px 2px;color:#([A-Za-z0-9]+)" align="left">/i)
    shield_rarity = rarity[1]
    var gem1 = 0;if (rarity[1] == "CCCCCC") gem1 = 1;if (rarity[1] == "FFFFFF") gem1 = 2;if (rarity[1] == "1eff00") gem1 = 5;if (rarity[1] == "ffde5b") gem1 = 10;if (rarity[1] == "CA1111") gem1 = 20;if (rarity[1] == "0070ff") gem1 = 30;if (rarity[1] == "ff8000") gem1 = 40;if (rarity[1] == "9000ba") gem1 = 50;
    var gem2 = 0;if (rarity[1] == "CCCCCC") gem2 = 2;if (rarity[1] == "FFFFFF") gem2 = 5;if (rarity[1] == "1eff00") gem2 = 10;if (rarity[1] == "ffde5b") gem2 = 20;if (rarity[1] == "CA1111") gem2 = 40;if (rarity[1] == "0070ff") gem2 = 60;if (rarity[1] == "ff8000") gem2 = 80;if (rarity[1] == "9000ba") gem2 = 100;
    var gem3 = 0;if (rarity[1] == "CCCCCC") gem3 = 3;if (rarity[1] == "FFFFFF") gem3 = 8;if (rarity[1] == "1eff00") gem3 = 15;if (rarity[1] == "ffde5b") gem3 = 30;if (rarity[1] == "CA1111") gem3 = 60;if (rarity[1] == "0070ff") gem3 = 90;if (rarity[1] == "ff8000") gem3 = 120;if (rarity[1] == "9000ba") gem3 = 150;
    var gem4 = gem2*2
    var upgrade_cost = '';if (gems==0) upgrade_cost = gem1;else if (gems==1) upgrade_cost = gem2;else if (gems==2) upgrade_cost = gem3;else if (gems==3) upgrade_cost = gem4;else if (gems==4) upgrade_cost = (shield_mr*0.15);
    shield_upgrade = (shield_mr*0.15/upgrade_cost).toFixed(2)
    if (itemtable.match(/<img width="9" style="border:1px solid #666666;margin:2px;" src=.*onmouseout="kill\(\)">/g) != null) {shield_augs = itemtable.match(/<img width="9" style="border:1px solid #666666;margin:2px;" src=.*onmouseout="kill\(\)">/g).toString().replaceAll("event","event,")}
    if (itemtable.match(/<img width="9" style="border:1px solid #666666;margin:2px;" src=.*onmouseout="kill\(\)">/g) == null) {shield_augs = `<button class='tab_button'><a href="`+addauglink+`" target="BLANK">ADD AUGMENTS</a></button>`}
})}

var pants_augs = "none";var pants_name = "none";var pants_cloned = "none";var pants_hp=0;var pants_atk=0;var pants_arcane=0;var pants_arcaner=0;var pants_block=0;var pants_chaos=0;var pants_crit=0;var pants_eblock=0;var pants_ept=0;var pants_fire=0;var pants_firer=0;var pants_holy=0;var pants_holyr=0;var pants_kinetic=0;var pants_kineticr=0;var pants_mr=0;var pants_ramp=0;var pants_rpt=0;var pants_shadow=0;var pants_shadowr=0;var pants_vile=0;var pants_openaugs=0;var pants_gems=0;var pants_rarity="none";var pants_upgrade="";
if (pants != "none"){
var pantslink = `item_rollover.php?id=`+pantsid[1]
fetch(pantslink)
  .then(res => res.text())
  .then((responseText) => {
    const doc = new DOMParser().parseFromString(responseText, 'text/html');
    const itemtable = doc.querySelector("#itemtable").innerHTML.replaceAll(",","").replaceAll("+","").replaceAll("%","").replaceAll(/<span style="color:#[A-Za-z0-9]+"> /g,"").replaceAll("</span>","").replaceAll("&nbsp; ","").replaceAll(/<span style="color:#[A-Za-z0-9]+">/g,"").replaceAll(/\([0-9]+\)/g,"").replaceAll(/\([0-9]+ atk \/ [0-9]+ hp\)/g,"").replaceAll(/\(<span style="color:#00FF00;">[0-9]+ ATK \/ [0-9]+ HP\)/g,"");
    const name = itemtable.match(/align="left">(.*)<\/td><\/tr>/i)
    pants_name = name[1]
    const cloned = itemtable.match(/Cloned/)
    if (cloned != null) pants_cloned = 1;
    var atk = itemtable.match(/([0-9]+) ATK/i) || [0,0]
    pants_atk += parseInt(atk[1])
    var hp = itemtable.match(/([0-9]+) HP/i) || [0,0]
    pants_hp += parseInt(hp[1])
    var holy = itemtable.match(/([0-9]+) Holy/i) || [0,0]
    pants_holy += parseInt(holy[1])
    var arcane = itemtable.match(/([0-9]+) Arcane/i) || [0,0]
    pants_arcane += parseInt(arcane[1])
    var fire = itemtable.match(/([0-9]+) Fire/i) || [0,0]
    pants_fire += parseInt(fire[1])
    var kinetic = itemtable.match(/([0-9]+) Kinetic/i) || [0,0]
    pants_kinetic += parseInt(kinetic[1])
    var shadow = itemtable.match(/([0-9]+) Shadow/i) || [0,0]
    pants_shadow += parseInt(shadow[1])
    var chaos = itemtable.match(/([0-9]+) Chaos/i) || [0,0]
    pants_chaos += parseInt(chaos[1])
    var vile = itemtable.match(/([0-9]+) vile energy/i) || [0,0]
    pants_vile += parseInt(vile[1])
    var holyr = itemtable.match(/([0-9]+) Holy Resist/i) || [0,0]
    pants_holyr += parseInt(holyr[1])
    var arcaner = itemtable.match(/([0-9]+) Arcane Resist/i) || [0,0]
    pants_arcaner += parseInt(arcaner[1])
    var firer = itemtable.match(/([0-9]+) Fire Resist/i) || [0,0]
    pants_firer += parseInt(firer[1])
    var kineticr = itemtable.match(/([0-9]+) Kinetic Resist/i) || [0,0]
    pants_kineticr += parseInt(kineticr[1])
    var shadowr = itemtable.match(/([0-9]+) Shadow Resist/i) || [0,0]
    pants_shadowr += parseInt(shadowr[1])
    var block = itemtable.match(/([0-9]+) block/i) || [0,0]
    pants_block += parseInt(block[1])
    var eblock = itemtable.match(/([0-9]+) elemental block/i) || [0,0]
    pants_eblock += parseInt(eblock[1])
    var rpt = itemtable.match(/([0-9]+) rage per hr/i) || [0,0]
    pants_rpt += parseInt(rpt[1])
    var ept = itemtable.match(/([0-9]+) exp per hr/i) || [0,0]
    pants_ept += parseInt(ept[1])
    var ramp = itemtable.match(/([0-9]+) rampage/i) || [0,0]
    pants_ramp += parseInt(ramp[1])
    var mr = itemtable.match(/([0-9]+) max rage/i) || [0,0]
    pants_mr += parseInt(mr[1])
    var crit = itemtable.match(/([0-9]+) critical hit/i) || [0,0]
    pants_crit += parseInt(crit[1])
    var openaugs = itemtable.match(/<img src="\/images\/augslot\.jpg">/g) || [undefined,undefined,undefined,undefined,undefined]
    if (openaugs[0] != undefined) pants_openaugs += 1;if (openaugs[1] != undefined) pants_openaugs += 1;if (openaugs[2] != undefined) pants_openaugs += 1;if (openaugs[3] != undefined) pants_openaugs += 1;if (openaugs[4] != undefined) pants_openaugs += 1;
    var gems = 0;if (itemtable.match(/<img src="\/images\/gem_white2\.jpg">/i) != null) gems += 1;if (itemtable.match(/<img src="\/images\/gem_red2\.jpg">/i) != null) gems += 1;if (itemtable.match(/<img src="\/images\/gem_blue2\.jpg">/i) != null) gems += 1;if (itemtable.match(/<img src="\/images\/gem_green1\.jpg">/i) != null) gems += 1;
    pants_gems = gems;
    var rarity = itemtable.match(/<td colspan="2" style="height:20px;font-size:12pt;text-shadow: #47462E 1px 1px 2px;color:#([A-Za-z0-9]+)" align="left">/i)
    pants_rarity = rarity[1]
    var gem1 = 0;if (rarity[1] == "CCCCCC") gem1 = 1;if (rarity[1] == "FFFFFF") gem1 = 2;if (rarity[1] == "1eff00") gem1 = 5;if (rarity[1] == "ffde5b") gem1 = 10;if (rarity[1] == "CA1111") gem1 = 20;if (rarity[1] == "0070ff") gem1 = 30;if (rarity[1] == "ff8000") gem1 = 40;if (rarity[1] == "9000ba") gem1 = 50;
    var gem2 = 0;if (rarity[1] == "CCCCCC") gem2 = 2;if (rarity[1] == "FFFFFF") gem2 = 5;if (rarity[1] == "1eff00") gem2 = 10;if (rarity[1] == "ffde5b") gem2 = 20;if (rarity[1] == "CA1111") gem2 = 40;if (rarity[1] == "0070ff") gem2 = 60;if (rarity[1] == "ff8000") gem2 = 80;if (rarity[1] == "9000ba") gem2 = 100;
    var gem3 = 0;if (rarity[1] == "CCCCCC") gem3 = 3;if (rarity[1] == "FFFFFF") gem3 = 8;if (rarity[1] == "1eff00") gem3 = 15;if (rarity[1] == "ffde5b") gem3 = 30;if (rarity[1] == "CA1111") gem3 = 60;if (rarity[1] == "0070ff") gem3 = 90;if (rarity[1] == "ff8000") gem3 = 120;if (rarity[1] == "9000ba") gem3 = 150;
    var gem4 = gem2*2
    var upgrade_cost = '';if (gems==0) upgrade_cost = gem1;else if (gems==1) upgrade_cost = gem2;else if (gems==2) upgrade_cost = gem3;else if (gems==3) upgrade_cost = gem4;else if (gems==4) upgrade_cost = (pants_mr*0.15);
    pants_upgrade = (pants_mr*0.15/upgrade_cost).toFixed(2)
    if (itemtable.match(/<img width="9" style="border:1px solid #666666;margin:2px;" src=.*onmouseout="kill\(\)">/g) != null) {pants_augs = itemtable.match(/<img width="9" style="border:1px solid #666666;margin:2px;" src=.*onmouseout="kill\(\)">/g).toString().replaceAll("event","event,")}
    if (itemtable.match(/<img width="9" style="border:1px solid #666666;margin:2px;" src=.*onmouseout="kill\(\)">/g) == null) {pants_augs = `<button class='tab_button'><a href="`+addauglink+`" target="BLANK">ADD AUGMENTS</a></button>`}
})}

var belt_augs = "none";var belt_name = "none";var belt_cloned = "none";var belt_hp=0;var belt_atk=0;var belt_arcane=0;var belt_arcaner=0;var belt_block=0;var belt_chaos=0;var belt_crit=0;var belt_eblock=0;var belt_ept=0;var belt_fire=0;var belt_firer=0;var belt_holy=0;var belt_holyr=0;var belt_kinetic=0;var belt_kineticr=0;var belt_mr=0;var belt_ramp=0;var belt_rpt=0;var belt_shadow=0;var belt_shadowr=0;var belt_vile=0;var belt_openaugs=0;var belt_gems=0;var belt_rarity="none";var belt_upgrade="";
if (belt != "none"){
var beltlink = `item_rollover.php?id=`+beltid[1]
fetch(beltlink)
  .then(res => res.text())
  .then((responseText) => {
    const doc = new DOMParser().parseFromString(responseText, 'text/html');
    const itemtable = doc.querySelector("#itemtable").innerHTML.replaceAll(",","").replaceAll("+","").replaceAll("%","").replaceAll(/<span style="color:#[A-Za-z0-9]+"> /g,"").replaceAll("</span>","").replaceAll("&nbsp; ","").replaceAll(/<span style="color:#[A-Za-z0-9]+">/g,"").replaceAll(/\([0-9]+\)/g,"").replaceAll(/\([0-9]+ atk \/ [0-9]+ hp\)/g,"").replaceAll(/\(<span style="color:#00FF00;">[0-9]+ ATK \/ [0-9]+ HP\)/g,"");
    const name = itemtable.match(/align="left">(.*)<\/td><\/tr>/i)
    belt_name = name[1]
    const cloned = itemtable.match(/Cloned/)
    if (cloned != null) belt_cloned = 1;
    var atk = itemtable.match(/([0-9]+) ATK/i) || [0,0]
    belt_atk += parseInt(atk[1])
    var hp = itemtable.match(/([0-9]+) HP/i) || [0,0]
    belt_hp += parseInt(hp[1])
    var holy = itemtable.match(/([0-9]+) Holy/i) || [0,0]
    belt_holy += parseInt(holy[1])
    var arcane = itemtable.match(/([0-9]+) Arcane/i) || [0,0]
    belt_arcane += parseInt(arcane[1])
    var fire = itemtable.match(/([0-9]+) Fire/i) || [0,0]
    belt_fire += parseInt(fire[1])
    var kinetic = itemtable.match(/([0-9]+) Kinetic/i) || [0,0]
    belt_kinetic += parseInt(kinetic[1])
    var shadow = itemtable.match(/([0-9]+) Shadow/i) || [0,0]
    belt_shadow += parseInt(shadow[1])
    var chaos = itemtable.match(/([0-9]+) Chaos/i) || [0,0]
    belt_chaos += parseInt(chaos[1])
    var vile = itemtable.match(/([0-9]+) vile energy/i) || [0,0]
    belt_vile += parseInt(vile[1])
    var holyr = itemtable.match(/([0-9]+) Holy Resist/i) || [0,0]
    belt_holyr += parseInt(holyr[1])
    var arcaner = itemtable.match(/([0-9]+) Arcane Resist/i) || [0,0]
    belt_arcaner += parseInt(arcaner[1])
    var firer = itemtable.match(/([0-9]+) Fire Resist/i) || [0,0]
    belt_firer += parseInt(firer[1])
    var kineticr = itemtable.match(/([0-9]+) Kinetic Resist/i) || [0,0]
    belt_kineticr += parseInt(kineticr[1])
    var shadowr = itemtable.match(/([0-9]+) Shadow Resist/i) || [0,0]
    belt_shadowr += parseInt(shadowr[1])
    var block = itemtable.match(/([0-9]+) block/i) || [0,0]
    belt_block += parseInt(block[1])
    var eblock = itemtable.match(/([0-9]+) elemental block/i) || [0,0]
    belt_eblock += parseInt(eblock[1])
    var rpt = itemtable.match(/([0-9]+) rage per hr/i) || [0,0]
    belt_rpt += parseInt(rpt[1])
    var ept = itemtable.match(/([0-9]+) exp per hr/i) || [0,0]
    belt_ept += parseInt(ept[1])
    var ramp = itemtable.match(/([0-9]+) rampage/i) || [0,0]
    belt_ramp += parseInt(ramp[1])
    var mr = itemtable.match(/([0-9]+) max rage/i) || [0,0]
    belt_mr += parseInt(mr[1])
    var crit = itemtable.match(/([0-9]+) critical hit/i) || [0,0]
    belt_crit += parseInt(crit[1])
    var openaugs = itemtable.match(/<img src="\/images\/augslot\.jpg">/g) || [undefined,undefined,undefined,undefined,undefined]
    if (openaugs[0] != undefined) belt_openaugs += 1;if (openaugs[1] != undefined) belt_openaugs += 1;if (openaugs[2] != undefined) belt_openaugs += 1;if (openaugs[3] != undefined) belt_openaugs += 1;if (openaugs[4] != undefined) belt_openaugs += 1;
    var gems = 0;if (itemtable.match(/<img src="\/images\/gem_white2\.jpg">/i) != null) gems += 1;if (itemtable.match(/<img src="\/images\/gem_red2\.jpg">/i) != null) gems += 1;if (itemtable.match(/<img src="\/images\/gem_blue2\.jpg">/i) != null) gems += 1;if (itemtable.match(/<img src="\/images\/gem_green1\.jpg">/i) != null) gems += 1;
    belt_gems = gems;
    var rarity = itemtable.match(/<td colspan="2" style="height:20px;font-size:12pt;text-shadow: #47462E 1px 1px 2px;color:#([A-Za-z0-9]+)" align="left">/i)
    belt_rarity = rarity[1]
    var gem1 = 0;if (rarity[1] == "CCCCCC") gem1 = 1;if (rarity[1] == "FFFFFF") gem1 = 2;if (rarity[1] == "1eff00") gem1 = 5;if (rarity[1] == "ffde5b") gem1 = 10;if (rarity[1] == "CA1111") gem1 = 20;if (rarity[1] == "0070ff") gem1 = 30;if (rarity[1] == "ff8000") gem1 = 40;if (rarity[1] == "9000ba") gem1 = 50;
    var gem2 = 0;if (rarity[1] == "CCCCCC") gem2 = 2;if (rarity[1] == "FFFFFF") gem2 = 5;if (rarity[1] == "1eff00") gem2 = 10;if (rarity[1] == "ffde5b") gem2 = 20;if (rarity[1] == "CA1111") gem2 = 40;if (rarity[1] == "0070ff") gem2 = 60;if (rarity[1] == "ff8000") gem2 = 80;if (rarity[1] == "9000ba") gem2 = 100;
    var gem3 = 0;if (rarity[1] == "CCCCCC") gem3 = 3;if (rarity[1] == "FFFFFF") gem3 = 8;if (rarity[1] == "1eff00") gem3 = 15;if (rarity[1] == "ffde5b") gem3 = 30;if (rarity[1] == "CA1111") gem3 = 60;if (rarity[1] == "0070ff") gem3 = 90;if (rarity[1] == "ff8000") gem3 = 120;if (rarity[1] == "9000ba") gem3 = 150;
    var gem4 = gem2*2
    var upgrade_cost = '';if (gems==0) upgrade_cost = gem1;else if (gems==1) upgrade_cost = gem2;else if (gems==2) upgrade_cost = gem3;else if (gems==3) upgrade_cost = gem4;else if (gems==4) upgrade_cost = (belt_mr*0.15);
    belt_upgrade = (belt_mr*0.15/upgrade_cost).toFixed(2)
    if (itemtable.match(/<img width="9" style="border:1px solid #666666;margin:2px;" src=.*onmouseout="kill\(\)">/g) != null) {belt_augs = itemtable.match(/<img width="9" style="border:1px solid #666666;margin:2px;" src=.*onmouseout="kill\(\)">/g).toString().replaceAll("event","event,")}
    if (itemtable.match(/<img width="9" style="border:1px solid #666666;margin:2px;" src=.*onmouseout="kill\(\)">/g) == null) {belt_augs = `<button class='tab_button'><a href="`+addauglink+`" target="BLANK">ADD AUGMENTS</a></button>`}
})}

var ring_augs = "none";var ring_name = "none";var ring_cloned = "none";var ring_hp=0;var ring_atk=0;var ring_arcane=0;var ring_arcaner=0;var ring_block=0;var ring_chaos=0;var ring_crit=0;var ring_eblock=0;var ring_ept=0;var ring_fire=0;var ring_firer=0;var ring_holy=0;var ring_holyr=0;var ring_kinetic=0;var ring_kineticr=0;var ring_mr=0;var ring_ramp=0;var ring_rpt=0;var ring_shadow=0;var ring_shadowr=0;var ring_vile=0;var ring_openaugs=0;var ring_gems=0;var ring_rarity="none";var ring_upgrade="";
if (ring != "none"){
var ringlink = `item_rollover.php?id=`+ringid[1]
fetch(ringlink)
  .then(res => res.text())
  .then((responseText) => {
    const doc = new DOMParser().parseFromString(responseText, 'text/html');
    const itemtable = doc.querySelector("#itemtable").innerHTML.replaceAll(",","").replaceAll("+","").replaceAll("%","").replaceAll(/<span style="color:#[A-Za-z0-9]+"> /g,"").replaceAll("</span>","").replaceAll("&nbsp; ","").replaceAll(/<span style="color:#[A-Za-z0-9]+">/g,"").replaceAll(/\([0-9]+\)/g,"").replaceAll(/\([0-9]+ atk \/ [0-9]+ hp\)/g,"").replaceAll(/\(<span style="color:#00FF00;">[0-9]+ ATK \/ [0-9]+ HP\)/g,"");
    const name = itemtable.match(/align="left">(.*)<\/td><\/tr>/i)
    ring_name = name[1]
    const cloned = itemtable.match(/Cloned/)
    if (cloned != null) ring_cloned = 1;
    var atk = itemtable.match(/([0-9]+) ATK/i) || [0,0]
    ring_atk += parseInt(atk[1])
    var hp = itemtable.match(/([0-9]+) HP/i) || [0,0]
    ring_hp += parseInt(hp[1])
    var holy = itemtable.match(/([0-9]+) Holy/i) || [0,0]
    ring_holy += parseInt(holy[1])
    var arcane = itemtable.match(/([0-9]+) Arcane/i) || [0,0]
    ring_arcane += parseInt(arcane[1])
    var fire = itemtable.match(/([0-9]+) Fire/i) || [0,0]
    ring_fire += parseInt(fire[1])
    var kinetic = itemtable.match(/([0-9]+) Kinetic/i) || [0,0]
    ring_kinetic += parseInt(kinetic[1])
    var shadow = itemtable.match(/([0-9]+) Shadow/i) || [0,0]
    ring_shadow += parseInt(shadow[1])
    var chaos = itemtable.match(/([0-9]+) Chaos/i) || [0,0]
    ring_chaos += parseInt(chaos[1])
    var vile = itemtable.match(/([0-9]+) vile energy/i) || [0,0]
    ring_vile += parseInt(vile[1])
    var holyr = itemtable.match(/([0-9]+) Holy Resist/i) || [0,0]
    ring_holyr += parseInt(holyr[1])
    var arcaner = itemtable.match(/([0-9]+) Arcane Resist/i) || [0,0]
    ring_arcaner += parseInt(arcaner[1])
    var firer = itemtable.match(/([0-9]+) Fire Resist/i) || [0,0]
    ring_firer += parseInt(firer[1])
    var kineticr = itemtable.match(/([0-9]+) Kinetic Resist/i) || [0,0]
    ring_kineticr += parseInt(kineticr[1])
    var shadowr = itemtable.match(/([0-9]+) Shadow Resist/i) || [0,0]
    ring_shadowr += parseInt(shadowr[1])
    var block = itemtable.match(/([0-9]+) block/i) || [0,0]
    ring_block += parseInt(block[1])
    var eblock = itemtable.match(/([0-9]+) elemental block/i) || [0,0]
    ring_eblock += parseInt(eblock[1])
    var rpt = itemtable.match(/([0-9]+) rage per hr/i) || [0,0]
    ring_rpt += parseInt(rpt[1])
    var ept = itemtable.match(/([0-9]+) exp per hr/i) || [0,0]
    ring_ept += parseInt(ept[1])
    var ramp = itemtable.match(/([0-9]+) rampage/i) || [0,0]
    ring_ramp += parseInt(ramp[1])
    var mr = itemtable.match(/([0-9]+) max rage/i) || [0,0]
    ring_mr += parseInt(mr[1])
    var crit = itemtable.match(/([0-9]+) critical hit/i) || [0,0]
    ring_crit += parseInt(crit[1])
    var openaugs = itemtable.match(/<img src="\/images\/augslot\.jpg">/g) || [undefined,undefined,undefined,undefined,undefined]
    if (openaugs[0] != undefined) ring_openaugs += 1;if (openaugs[1] != undefined) ring_openaugs += 1;if (openaugs[2] != undefined) ring_openaugs += 1;if (openaugs[3] != undefined) ring_openaugs += 1;if (openaugs[4] != undefined) ring_openaugs += 1;
    var gems = 0;if (itemtable.match(/<img src="\/images\/gem_white2\.jpg">/i) != null) gems += 1;if (itemtable.match(/<img src="\/images\/gem_red2\.jpg">/i) != null) gems += 1;if (itemtable.match(/<img src="\/images\/gem_blue2\.jpg">/i) != null) gems += 1;if (itemtable.match(/<img src="\/images\/gem_green1\.jpg">/i) != null) gems += 1;
    ring_gems = gems;
    var rarity = itemtable.match(/<td colspan="2" style="height:20px;font-size:12pt;text-shadow: #47462E 1px 1px 2px;color:#([A-Za-z0-9]+)" align="left">/i)
    ring_rarity = rarity[1]
    var gem1 = 0;if (rarity[1] == "CCCCCC") gem1 = 1;if (rarity[1] == "FFFFFF") gem1 = 2;if (rarity[1] == "1eff00") gem1 = 5;if (rarity[1] == "ffde5b") gem1 = 10;if (rarity[1] == "CA1111") gem1 = 20;if (rarity[1] == "0070ff") gem1 = 30;if (rarity[1] == "ff8000") gem1 = 40;if (rarity[1] == "9000ba") gem1 = 50;
    var gem2 = 0;if (rarity[1] == "CCCCCC") gem2 = 2;if (rarity[1] == "FFFFFF") gem2 = 5;if (rarity[1] == "1eff00") gem2 = 10;if (rarity[1] == "ffde5b") gem2 = 20;if (rarity[1] == "CA1111") gem2 = 40;if (rarity[1] == "0070ff") gem2 = 60;if (rarity[1] == "ff8000") gem2 = 80;if (rarity[1] == "9000ba") gem2 = 100;
    var gem3 = 0;if (rarity[1] == "CCCCCC") gem3 = 3;if (rarity[1] == "FFFFFF") gem3 = 8;if (rarity[1] == "1eff00") gem3 = 15;if (rarity[1] == "ffde5b") gem3 = 30;if (rarity[1] == "CA1111") gem3 = 60;if (rarity[1] == "0070ff") gem3 = 90;if (rarity[1] == "ff8000") gem3 = 120;if (rarity[1] == "9000ba") gem3 = 150;
    var gem4 = gem2*2
    var upgrade_cost = '';if (gems==0) upgrade_cost = gem1;else if (gems==1) upgrade_cost = gem2;else if (gems==2) upgrade_cost = gem3;else if (gems==3) upgrade_cost = gem4;else if (gems==4) upgrade_cost = (ring_mr*0.15);
    ring_upgrade = (ring_mr*0.15/upgrade_cost).toFixed(2)
    if (itemtable.match(/<img width="9" style="border:1px solid #666666;margin:2px;" src=.*onmouseout="kill\(\)">/g) != null) {ring_augs = itemtable.match(/<img width="9" style="border:1px solid #666666;margin:2px;" src=.*onmouseout="kill\(\)">/g).toString().replaceAll("event","event,")}
    if (itemtable.match(/<img width="9" style="border:1px solid #666666;margin:2px;" src=.*onmouseout="kill\(\)">/g) == null) {ring_augs = `<button class='tab_button'><a href="`+addauglink+`" target="BLANK">ADD AUGMENTS</a></button>`}
})}

var foot_augs = "none";var foot_name = "none";var foot_cloned = "none";var foot_hp=0;var foot_atk=0;var foot_arcane=0;var foot_arcaner=0;var foot_block=0;var foot_chaos=0;var foot_crit=0;var foot_eblock=0;var foot_ept=0;var foot_fire=0;var foot_firer=0;var foot_holy=0;var foot_holyr=0;var foot_kinetic=0;var foot_kineticr=0;var foot_mr=0;var foot_ramp=0;var foot_rpt=0;var foot_shadow=0;var foot_shadowr=0;var foot_vile=0;var foot_openaugs=0;var foot_gems=0;var foot_rarity="none";var foot_upgrade="";
if (foot != "none"){
var footlink = `item_rollover.php?id=`+footid[1]
fetch(footlink)
  .then(res => res.text())
  .then((responseText) => {
    const doc = new DOMParser().parseFromString(responseText, 'text/html');
    const itemtable = doc.querySelector("#itemtable").innerHTML.replaceAll(",","").replaceAll("+","").replaceAll("%","").replaceAll(/<span style="color:#[A-Za-z0-9]+"> /g,"").replaceAll("</span>","").replaceAll("&nbsp; ","").replaceAll(/<span style="color:#[A-Za-z0-9]+">/g,"").replaceAll(/\([0-9]+\)/g,"").replaceAll(/\([0-9]+ atk \/ [0-9]+ hp\)/g,"").replaceAll(/\(<span style="color:#00FF00;">[0-9]+ ATK \/ [0-9]+ HP\)/g,"");
    const name = itemtable.match(/align="left">(.*)<\/td><\/tr>/i)
    foot_name = name[1]
    const cloned = itemtable.match(/Cloned/)
    if (cloned != null) foot_cloned = 1;
    var atk = itemtable.match(/([0-9]+) ATK/i) || [0,0]
    foot_atk += parseInt(atk[1])
    var hp = itemtable.match(/([0-9]+) HP/i) || [0,0]
    foot_hp += parseInt(hp[1])
    var holy = itemtable.match(/([0-9]+) Holy/i) || [0,0]
    foot_holy += parseInt(holy[1])
    var arcane = itemtable.match(/([0-9]+) Arcane/i) || [0,0]
    foot_arcane += parseInt(arcane[1])
    var fire = itemtable.match(/([0-9]+) Fire/i) || [0,0]
    foot_fire += parseInt(fire[1])
    var kinetic = itemtable.match(/([0-9]+) Kinetic/i) || [0,0]
    foot_kinetic += parseInt(kinetic[1])
    var shadow = itemtable.match(/([0-9]+) Shadow/i) || [0,0]
    foot_shadow += parseInt(shadow[1])
    var chaos = itemtable.match(/([0-9]+) Chaos/i) || [0,0]
    foot_chaos += parseInt(chaos[1])
    var vile = itemtable.match(/([0-9]+) vile energy/i) || [0,0]
    foot_vile += parseInt(vile[1])
    var holyr = itemtable.match(/([0-9]+) Holy Resist/i) || [0,0]
    foot_holyr += parseInt(holyr[1])
    var arcaner = itemtable.match(/([0-9]+) Arcane Resist/i) || [0,0]
    foot_arcaner += parseInt(arcaner[1])
    var firer = itemtable.match(/([0-9]+) Fire Resist/i) || [0,0]
    foot_firer += parseInt(firer[1])
    var kineticr = itemtable.match(/([0-9]+) Kinetic Resist/i) || [0,0]
    foot_kineticr += parseInt(kineticr[1])
    var shadowr = itemtable.match(/([0-9]+) Shadow Resist/i) || [0,0]
    foot_shadowr += parseInt(shadowr[1])
    var block = itemtable.match(/([0-9]+) block/i) || [0,0]
    foot_block += parseInt(block[1])
    var eblock = itemtable.match(/([0-9]+) elemental block/i) || [0,0]
    foot_eblock += parseInt(eblock[1])
    var rpt = itemtable.match(/([0-9]+) rage per hr/i) || [0,0]
    foot_rpt += parseInt(rpt[1])
    var ept = itemtable.match(/([0-9]+) exp per hr/i) || [0,0]
    foot_ept += parseInt(ept[1])
    var ramp = itemtable.match(/([0-9]+) rampage/i) || [0,0]
    foot_ramp += parseInt(ramp[1])
    var mr = itemtable.match(/([0-9]+) max rage/i) || [0,0]
    foot_mr += parseInt(mr[1])
    var crit = itemtable.match(/([0-9]+) critical hit/i) || [0,0]
    foot_crit += parseInt(crit[1])
    var openaugs = itemtable.match(/<img src="\/images\/augslot\.jpg">/g) || [undefined,undefined,undefined,undefined,undefined]
    if (openaugs[0] != undefined) foot_openaugs += 1;if (openaugs[1] != undefined) foot_openaugs += 1;if (openaugs[2] != undefined) foot_openaugs += 1;if (openaugs[3] != undefined) foot_openaugs += 1;if (openaugs[4] != undefined) foot_openaugs += 1;
    var gems = 0;if (itemtable.match(/<img src="\/images\/gem_white2\.jpg">/i) != null) gems += 1;if (itemtable.match(/<img src="\/images\/gem_red2\.jpg">/i) != null) gems += 1;if (itemtable.match(/<img src="\/images\/gem_blue2\.jpg">/i) != null) gems += 1;if (itemtable.match(/<img src="\/images\/gem_green1\.jpg">/i) != null) gems += 1;
    foot_gems = gems;
    var rarity = itemtable.match(/<td colspan="2" style="height:20px;font-size:12pt;text-shadow: #47462E 1px 1px 2px;color:#([A-Za-z0-9]+)" align="left">/i)
    foot_rarity = rarity[1]
    var gem1 = 0;if (rarity[1] == "CCCCCC") gem1 = 1;if (rarity[1] == "FFFFFF") gem1 = 2;if (rarity[1] == "1eff00") gem1 = 5;if (rarity[1] == "ffde5b") gem1 = 10;if (rarity[1] == "CA1111") gem1 = 20;if (rarity[1] == "0070ff") gem1 = 30;if (rarity[1] == "ff8000") gem1 = 40;if (rarity[1] == "9000ba") gem1 = 50;
    var gem2 = 0;if (rarity[1] == "CCCCCC") gem2 = 2;if (rarity[1] == "FFFFFF") gem2 = 5;if (rarity[1] == "1eff00") gem2 = 10;if (rarity[1] == "ffde5b") gem2 = 20;if (rarity[1] == "CA1111") gem2 = 40;if (rarity[1] == "0070ff") gem2 = 60;if (rarity[1] == "ff8000") gem2 = 80;if (rarity[1] == "9000ba") gem2 = 100;
    var gem3 = 0;if (rarity[1] == "CCCCCC") gem3 = 3;if (rarity[1] == "FFFFFF") gem3 = 8;if (rarity[1] == "1eff00") gem3 = 15;if (rarity[1] == "ffde5b") gem3 = 30;if (rarity[1] == "CA1111") gem3 = 60;if (rarity[1] == "0070ff") gem3 = 90;if (rarity[1] == "ff8000") gem3 = 120;if (rarity[1] == "9000ba") gem3 = 150;
    var gem4 = gem2*2
    var upgrade_cost = '';if (gems==0) upgrade_cost = gem1;else if (gems==1) upgrade_cost = gem2;else if (gems==2) upgrade_cost = gem3;else if (gems==3) upgrade_cost = gem4;else if (gems==4) upgrade_cost = (foot_mr*0.15);
    foot_upgrade = (foot_mr*0.15/upgrade_cost).toFixed(2)
    if (itemtable.match(/<img width="9" style="border:1px solid #666666;margin:2px;" src=.*onmouseout="kill\(\)">/g) != null) {foot_augs = itemtable.match(/<img width="9" style="border:1px solid #666666;margin:2px;" src=.*onmouseout="kill\(\)">/g).toString().replaceAll("event","event,")}
    if (itemtable.match(/<img width="9" style="border:1px solid #666666;margin:2px;" src=.*onmouseout="kill\(\)">/g) == null) {foot_augs = `<button class='tab_button'><a href="`+addauglink+`" target="BLANK">ADD AUGMENTS</a></button>`}
})}

var booster_name = "none";var booster_exp = 0;var booster_effect = "none";
if (booster != "none"){
var boosterlinks = `item_rollover.php?id=`+boosterid[1]
fetch(boosterlinks)
  .then(res => res.text())
  .then((responseText) => {
    const doc = new DOMParser().parseFromString(responseText, 'text/html');
    const itemtable = doc.querySelector("#itemtable").innerHTML.replaceAll(",","")
    const name = itemtable.match(/align="left">(.*)<\/td><\/tr>/i)
    booster_name = name[1]
    const expires = itemtable.match(/<br>Expires<br>[\n\r]([0-9]+) minutes/i)
    booster_exp += parseInt(expires[1])
    const effect = itemtable.match(/<div style="font-family:verdana;font-size:7pt;font-style:italic;color:#FFCC00">(.*).<\/div>/i)
    booster_effect = effect[1]
})}

var badge_name = "none";var badge_level = 0;var badge_hp = 0;var badge_atk = 0;var badge_ele = 0;var badge_lvl = "none";
if (badge != "none"){
var badgelinks = `item_rollover.php?id=`+badgeid[1]
fetch(badgelinks)
  .then(res => res.text())
  .then((responseText) => {
    const doc = new DOMParser().parseFromString(responseText, 'text/html');
    const itemtable = doc.querySelector("#itemtable").innerHTML.replaceAll(",","")
    const name = itemtable.match(/align="left">(.*)<\/td><\/tr>/i)
    badge_name = name[1]
    const atk = itemtable.match(/\+([0-9]+) ATK/i) || [0,0]
    badge_atk += parseInt(atk[1])
    const hp = itemtable.match(/\+([0-9]+) HP/i) || [0,0]
    badge_hp += parseInt(hp[1])
    const ele = itemtable.match(/&nbsp; \+([0-9]+) <span style="color:#FFFF00">Arcane/i) || [0,0]
    badge_ele += parseInt(ele[1])*5
    badge_level += parseInt(badge_name.replace("Badge of Absolution","26").replace("Badge Level ",""))
})}

var orb1_ele = 0;var orb1_chaos = 0;var orb1_atk = 0;var orb1_hp = 0;var orb1_mr = 0;var orb1_rpt = 0;var orb1_ept = 0;
if (orb1name[1] != "none"){
var orb1links = `item_rollover.php?id=`+orb1id[1]
fetch(orb1links)
  .then(res => res.text())
  .then((responseText) => {
    const doc = new DOMParser().parseFromString(responseText, 'text/html');
    const itemtable = doc.querySelector("#itemtable").innerHTML.replaceAll(",","")
    const chaos = itemtable.match(/&nbsp; \+([0-9]+) <span style="color:#f441be">Chaos/i) || [0,0]
    orb1_chaos += parseInt(chaos[1])
    const ele = itemtable.match(/&nbsp; \+([0-9]+) <span style="color:#FFFF00">Arcane/i) || [0,0]
    orb1_ele += parseInt(ele[1])*5
    const atk = itemtable.match(/\+([0-9]+) ATK<br>/i) || [0,0]
    orb1_atk += parseInt(atk[1])
    const hp = itemtable.match(/\+([0-9]+) HP<br>/i) || [0,0]
    orb1_hp += parseInt(hp[1])
    const mr = itemtable.match(/\+([0-9]+) max rage/i) || [0,0]
    orb1_mr += parseInt(mr[1])
    const rpt = itemtable.match(/\+([0-9]+) rage per hr/i) || [0,0]
    orb1_rpt += parseInt(rpt[1])
    const ept = itemtable.match(/\+([0-9]+) exp per hr/i) || [0,0]
    orb1_ept += parseInt(ept[1])
})}

var orb2_ele = 0;var orb2_chaos = 0;var orb2_atk = 0;var orb2_hp = 0;var orb2_mr = 0;var orb2_rpt = 0;var orb2_ept = 0;
if (orb2name[1] != "none"){
var orb2links = `item_rollover.php?id=`+orb2id[1]
fetch(orb2links)
  .then(res => res.text())
  .then((responseText) => {
    const doc = new DOMParser().parseFromString(responseText, 'text/html');
    const itemtable = doc.querySelector("#itemtable").innerHTML.replaceAll(",","")
    const chaos = itemtable.match(/&nbsp; \+([0-9]+) <span style="color:#f441be">Chaos/i) || [0,0]
    orb2_chaos += parseInt(chaos[1])
    const ele = itemtable.match(/&nbsp; \+([0-9]+) <span style="color:#FFFF00">Arcane/i) || [0,0]
    orb2_ele += parseInt(ele[1])*5
    const atk = itemtable.match(/\+([0-9]+) ATK<br>/i) || [0,0]
    orb2_atk += parseInt(atk[1])
    const hp = itemtable.match(/\+([0-9]+) HP<br>/i) || [0,0]
    orb2_hp += parseInt(hp[1])
    const mr = itemtable.match(/\+([0-9]+) max rage/i) || [0,0]
    orb2_mr += parseInt(mr[1])
    const rpt = itemtable.match(/\+([0-9]+) rage per hr/i) || [0,0]
    orb2_rpt += parseInt(rpt[1])
    const ept = itemtable.match(/\+([0-9]+) exp per hr/i) || [0,0]
    orb2_ept += parseInt(ept[1])
})}

var orb3_ele = 0;var orb3_chaos = 0;var orb3_atk = 0;var orb3_hp = 0;var orb3_mr = 0;var orb3_rpt = 0;var orb3_ept = 0;
if (orb3name[1] != "none"){
var orb3links = `item_rollover.php?id=`+orb3id[1]
fetch(orb3links)
  .then(res => res.text())
  .then((responseText) => {
    const doc = new DOMParser().parseFromString(responseText, 'text/html');
    const itemtable = doc.querySelector("#itemtable").innerHTML.replaceAll(",","")
    const chaos = itemtable.match(/&nbsp; \+([0-9]+) <span style="color:#f441be">Chaos/i) || [0,0]
    orb3_chaos += parseInt(chaos[1])
    const ele = itemtable.match(/&nbsp; \+([0-9]+) <span style="color:#FFFF00">Arcane/i) || [0,0]
    orb3_ele += parseInt(ele[1])*5
    const atk = itemtable.match(/\+([0-9]+) ATK<br>/i) || [0,0]
    orb3_atk += parseInt(atk[1])
    const hp = itemtable.match(/\+([0-9]+) HP<br>/i) || [0,0]
    orb3_hp += parseInt(hp[1])
    const mr = itemtable.match(/\+([0-9]+) max rage/i) || [0,0]
    orb3_mr += parseInt(mr[1])
    const rpt = itemtable.match(/\+([0-9]+) rage per hr/i) || [0,0]
    orb3_rpt += parseInt(rpt[1])
    const ept = itemtable.match(/\+([0-9]+) exp per hr/i) || [0,0]
    orb3_ept += parseInt(ept[1])
})}

var gem_name = "none";var gem_level = 0;var gem_chaos = 0;var gem_ramp = 0;var gem_mr = 0;var gem_crit = 0;var gem_lvl = "none";
if (gem != "none"){
var gemlinks = `item_rollover.php?id=`+gemid[1]
fetch(gemlinks)
  .then(res => res.text())
  .then((responseText) => {
    const doc = new DOMParser().parseFromString(responseText, 'text/html');
    const itemtable = doc.querySelector("#itemtable").innerHTML.replaceAll(",","")
    const name = itemtable.match(/align="left">(.*)<\/td><\/tr>/i)
    gem_name = name[1]
    const chaos = itemtable.match(/&nbsp; \+([0-9]+) <span style="color:#f441be">Chaos/i) || [0,0]
    gem_chaos += parseInt(chaos[1])
    const rampage = itemtable.match(/\+([0-9]+)% rampage/i) || [0,0] || [0,0]
    gem_ramp += parseInt(rampage[1])
    const maxrage = itemtable.match(/\+([0-9]+) max rage/i) || [0,0]
    gem_mr += parseInt(maxrage[1])
    const critical = itemtable.match(/\+([0-9]+)% critical hit/i) || [0,0]
    gem_crit += parseInt(critical[1])
    "Claw of Chaos"==gem_name&&(gem_lvl=42),"Embedded Chaos Gem"==gem_name&&(gem_lvl=41),"Flawless Chaos Gem 8"==gem_name&&(gem_lvl=40),"Flawless Chaos Gem 7"==gem_name&&(gem_lvl=39),"Flawless Chaos Gem 6"==gem_name&&(gem_lvl=38),"Flawless Chaos Gem 5"==gem_name&&(gem_lvl=37),"Flawless Chaos Gem 4"==gem_name&&(gem_lvl=36),"Flawless Chaos Gem 3"==gem_name&&(gem_lvl=35),"Flawless Chaos Gem 2"==gem_name&&(gem_lvl=34),"Flawless Chaos Gem 1"==gem_name&&(gem_lvl=33),"Lucid Chaos Gem 8"==gem_name&&(gem_lvl=32),"Lucid Chaos Gem 7"==gem_name&&(gem_lvl=31),"Lucid Chaos Gem 6"==gem_name&&(gem_lvl=30),"Lucid Chaos Gem 5"==gem_name&&(gem_lvl=29),"Lucid Chaos Gem 4"==gem_name&&(gem_lvl=28),"Lucid Chaos Gem 3"==gem_name&&(gem_lvl=27),"Lucid Chaos Gem 2"==gem_name&&(gem_lvl=26),"Lucid Chaos Gem 1"==gem_name&&(gem_lvl=25),"Smooth Chaos Gem 8"==gem_name&&(gem_lvl=24),"Smooth Chaos Gem 7"==gem_name&&(gem_lvl=23),"Smooth Chaos Gem 6"==gem_name&&(gem_lvl=22),"Smooth Chaos Gem 5"==gem_name&&(gem_lvl=21),"Smooth Chaos Gem 4"==gem_name&&(gem_lvl=20),"Smooth Chaos Gem 3"==gem_name&&(gem_lvl=19),"Smooth Chaos Gem 2"==gem_name&&(gem_lvl=18),"Smooth Chaos Gem 1"==gem_name&&(gem_lvl=17),"Meager Chaos Gem 8"==gem_name&&(gem_lvl=16),"Meager Chaos Gem 7"==gem_name&&(gem_lvl=15),"Meager Chaos Gem 6"==gem_name&&(gem_lvl=14),"Meager Chaos Gem 5"==gem_name&&(gem_lvl=13),"Meager Chaos Gem 4"==gem_name&&(gem_lvl=12),"Meager Chaos Gem 3"==gem_name&&(gem_lvl=11),"Meager Chaos Gem 2"==gem_name&&(gem_lvl=10),"Meager Chaos Gem 1"==gem_name&&(gem_lvl=9),"Paltry Chaos Gem 8"==gem_name&&(gem_lvl=8),"Paltry Chaos Gem 7"==gem_name&&(gem_lvl=7),"Paltry Chaos Gem 6"==gem_name&&(gem_lvl=6),"Paltry Chaos Gem 5"==gem_name&&(gem_lvl=5),"Paltry Chaos Gem 4"==gem_name&&(gem_lvl=4),"Paltry Chaos Gem 3"==gem_name&&(gem_lvl=3),"Paltry Chaos Gem 2"==gem_name&&(gem_lvl=2),"Paltry Chaos Gem 1"==gem_name&&(gem_lvl=1);
})}

var rune_name = "none";var rune_level = 0;var rune_ele = 0;var rune_lvl = "none";
if (rune != "none"){
var runelinks = `item_rollover.php?id=`+runeid[1]
fetch(runelinks)
  .then(res => res.text())
  .then((responseText) => {
    const doc = new DOMParser().parseFromString(responseText, 'text/html');
    const itemtable = doc.querySelector("#itemtable").innerHTML.replaceAll(",","")
    const name = itemtable.match(/align="left">(.*)<\/td><\/tr>/i)
    rune_name = name[1]
    const holy = itemtable.match(/&nbsp; \+([0-9]+) <span style="color:#00FFFF">/i)
    const arcane = itemtable.match(/&nbsp; \+([0-9]+) <span style="color:#FFFF00">/i)
    const shadow = itemtable.match(/&nbsp; \+([0-9]+) <span style="color:#7e01bc">/i)
    const fire = itemtable.match(/&nbsp; \+([0-9]+) <span style="color:#FF0000">/i)
    const kinetic = itemtable.match(/&nbsp; \+([0-9]+) <span style="color:#00FF00">/i)
    rune_ele += parseInt(holy[1])+parseInt(arcane[1])+parseInt(shadow[1])+parseInt(fire[1])+parseInt(kinetic[1])
    "Rune of Creation"==rune_name&&(rune_lvl=37),"Empyreal Rune Stage 5"==rune_name&&(rune_lvl=36),"Empyreal Rune Stage 4"==rune_name&&(rune_lvl=35),"Empyreal Rune Stage 3"==rune_name&&(rune_lvl=34),"Empyreal Rune Stage 2"==rune_name&&(rune_lvl=33),"Empyreal Rune Stage 1"==rune_name&&(rune_lvl=32),"Titanic Rune Stage 5"==rune_name&&(rune_lvl=31),"Titanic Rune Stage 4"==rune_name&&(rune_lvl=30),"Titanic Rune Stage 3"==rune_name&&(rune_lvl=29),"Titanic Rune Stage 2"==rune_name&&(rune_lvl=28),"Titanic Rune Stage 1"==rune_name&&(rune_lvl=27),"Cosmic Rune Stage 5"==rune_name&&(rune_lvl=26),"Cosmic Rune Stage 4"==rune_name&&(rune_lvl=25),"Cosmic Rune Stage 3"==rune_name&&(rune_lvl=24),"Cosmic Rune Stage 2"==rune_name&&(rune_lvl=23),"Cosmic Rune Stage 1"==rune_name&&(rune_lvl=22),"Stellar Rune Stage 5"==rune_name&&(rune_lvl=21),"Stellar Rune Stage 4"==rune_name&&(rune_lvl=20),"Stellar Rune Stage 3"==rune_name&&(rune_lvl=19),"Stellar Rune Stage 2"==rune_name&&(rune_lvl=18),"Stellar Rune Stage 1"==rune_name&&(rune_lvl=17),"Elevated Rune Stage 5"==rune_name&&(rune_lvl=16),"Elevated Rune Stage 4"==rune_name&&(rune_lvl=15),"Elevated Rune Stage 3"==rune_name&&(rune_lvl=14),"Elevated Rune Stage 2"==rune_name&&(rune_lvl=13),"Elevated Rune Stage 1"==rune_name&&(rune_lvl=12),"Astral Rune Stage 5"==rune_name&&(rune_lvl=11),"Astral Rune Stage 4"==rune_name&&(rune_lvl=10),"Astral Rune Stage 3"==rune_name&&(rune_lvl=9),"Astral Rune Stage 2"==rune_name&&(rune_lvl=8),"Astral Rune Stage 1"==rune_name&&(rune_lvl=7),"Mystic Elemental Rune"==rune_name&&(rune_lvl=6),"Resplendent Elemental Rune"==rune_name&&(rune_lvl=5),"Primal Elemental Rune"==rune_name&&(rune_lvl=4),"Amplified Kinetic Rune"==rune_name&&(rune_lvl=3),"Amplified Fire Rune"==rune_name&&(rune_lvl=3),"Amplified Shadow Rune"==rune_name&&(rune_lvl=3),"Amplified Arcane Rune"==rune_name&&(rune_lvl=3),"Amplified Holy Rune"==rune_name&&(rune_lvl=3),"Infused Kinetic Rune"==rune_name&&(rune_lvl=2),"Infused Fire Rune"==rune_name&&(rune_lvl=2),"Infused Shadow Rune"==rune_name&&(rune_lvl=2),"Infused Arcane Rune"==rune_name&&(rune_lvl=2),"Infused Holy Rune"==rune_name&&(rune_lvl=2),"Basic Elemental Rune"==rune_name&&(rune_lvl=1);
})}

var supplieslinks = "supplies?suid="+document.querySelector("#moxxivision > tbody > tr:nth-child("+rownum+") > td:nth-child(1)").innerHTML
fetch(supplieslinks)
   .then(response => response.text())
   .then((response) => {
    var supplies = response.match(/<img border="0" src="images\/suppliestriangle\.gif" width="11" height="11">[\n\r](.*)%<\/td>/i)

var homelinks = "home?suid="+document.querySelector("#moxxivision > tbody > tr:nth-child("+rownum+") > td:nth-child(1)").innerHTML
fetch(homelinks)
   .then(response => response.text())
   .then((response) => {
    var today = response.match(/<tr><td><b>Growth Today:<\/b><\/td><td>(.*)<\/td><\/tr><tr><td><b>Per Turn/i)
    var fireRes = response.match(/onmouseout="kill\(\)">Fire Resist:<\/b>.*[\n\r].*[\n\r].*[\n\r].*[\n\r](.*)<\/font>/i);
    var arcaneRes = response.match(/onmouseout="kill\(\)">Arcane Resist:<\/b>.*[\n\r].*[\n\r].*[\n\r].*[\n\r](.*)<\/font>/i);
    var shadowRes = response.match(/onmouseout="kill\(\)">Shadow Resist:<\/b>.*[\n\r].*[\n\r].*[\n\r].*[\n\r](.*)<\/font>/i);
    var holyRes = response.match(/onmouseout="kill\(\)">Holy Resist:<\/b>.*[\n\r].*[\n\r].*[\n\r].*[\n\r](.*)<\/font>/i);
    var kineticRes = response.match(/onmouseout="kill\(\)">Kinetic Resist:<\/b>.*[\n\r].*[\n\r].*[\n\r].*[\n\r](.*)<\/font>/i);
    var skillclass = response.match(/<span class="t-uppercontent">Level [0-9]+ (.*) .*<\/span>/i)
    var rage = response.match(/<span class="toolbar_rage">(.*)<\/span>/i)
    var mrage = response.match(/<b>Maximum:<\/b><\/td><td>(.*)<\/td>/i)
    var rpt = response.match(/<p class="top-rage" onmouseover="statspopup\(event,'<tr><td><b>Per Turn:<\/b><\/td><td>(.*)<\/td>/i)
    var tomax = Math.ceil((parseInt(mrage[1].replaceAll(",",""))-parseInt(rage[1].replaceAll(",","")))/parseInt(rpt[1].replaceAll(",","")))

var skillslinks = "cast_skills?suid="+document.querySelector("#moxxivision > tbody > tr:nth-child("+rownum+") > td:nth-child(1)").innerHTML
fetch(skillslinks)
  .then(res => res.text())
  .then((responseText) => {
    const doc = new DOMParser().parseFromString(responseText, 'text/html');
    const castskills = doc.querySelector("#basic > div.widget-content.widget-content-area > div:nth-child(1) > div:nth-child(1) > div > div").innerHTML

var tomelinks = "skills_info.php?suid="+document.querySelector("#moxxivision > tbody > tr:nth-child("+rownum+") > td:nth-child(1)").innerHTML+"&id=46"
fetch(tomelinks)
   .then(response => response.text())
   .then((response) => {
    var tomeShield = response.match(/<b>You have not learned this skill yet<\/b>/i)
    var tome = '';
    if (tomeShield == null){tome = "YES"}
    if (tomeShield != null){tome = "NO"}

var bp = "ajax/backpackcontents.php?suid="+document.querySelector("#moxxivision > tbody > tr:nth-child("+rownum+") > td:nth-child(1)").innerHTML+"&tab=regular"
fetch(bp)
  .then(res => res.text())
  .then((responseText) => {
    const doc = new DOMParser().parseFromString(responseText, 'text/html');
    const bptable = doc.querySelector("body").innerHTML
    var bpcnt = 0; if (bptable.match(/src="\/images\/items/g) != null) bpcnt += bptable.match(/src="\/images\/items/g).length
    var allbp = '';
    if (bpcnt >= 1 && bpcnt <= 25){allbp = bptable.replaceAll(/<div class="row ml-0 mr-0 justify-content-left backack-row">/g,"").replaceAll(/<div class="backpackSlot d-flex align-items-center justify-content-center btn-group">/g,"").replaceAll(/<\/div>/g,"")}
    if (bpcnt == 0){allbp = "empty"}
    if (bpcnt >= 26){allbp = "too many items to display"}
    var bpcap = bptable.match(/data-maxval="([0-9]+)"/i)[1]

var vault = "vault.php?suid="+document.querySelector("#moxxivision > tbody > tr:nth-child("+rownum+") > td:nth-child(1)").innerHTML
fetch(vault)
  .then(res => res.text())
  .then((responseText) => {
    const doc = new DOMParser().parseFromString(responseText, 'text/html');
    var vaulttable = '';
    if (doc.querySelector("#content-header-row > form > div.row.w-100 > div.col-12.col-lg-6.mt-3.mt-lg-0 > div:nth-child(2) > table") != null){vaulttable = doc.querySelector("#content-header-row > form > div.row.w-100 > div.col-12.col-lg-6.mt-3.mt-lg-0 > div:nth-child(2) > table").innerHTML
        .replaceAll(/<input type="checkbox" class="itemCheckbox itemId_[0-9]+" itemid="[0-9]+" name="remove\[]" value="[0-9]+">Select/g,"")
        .replaceAll(/<tbody><tr><td align="center" valign="bottom" style="padding:2px;" width="25%">/g,"")
        .replaceAll(/<a href="itemlink\?id=[0-9]+&amp;owner=[0-9]+">/g,"")
        .replaceAll(/<br>/g,"")}
    if (doc.querySelector("#content-header-row > form > div.row.w-100 > div.col-12.col-lg-6.mt-3.mt-lg-0 > div:nth-child(2) > table") == null){vaulttable = "<center>Storage account has too many items to load vault.</center>"}

var questbp = "ajax/backpackcontents.php?suid="+document.querySelector("#moxxivision > tbody > tr:nth-child("+rownum+") > td:nth-child(1)").innerHTML+"&tab=quest"
fetch(questbp)
   .then(response => response.text())
   .then((response) => {
    var archfrag = response.match(/data-name="Archfiend Soul Fragment" data-itemqty="(.*)" data-itemid/i) || [0,0]
    var demonskull = response.match(/data-name="Skull of Demonology" data-itemqty="(.*)" data-itemid/i) || [0,0]
    var chaosore = response.match(/data-name="Chaos Ore" data-itemqty="(.*)" data-itemid/i) || [0,0]
    var elefuser = response.match(/data-name="Elemental Fuser" data-itemqty="(.*)" data-itemid/i) || [0,0]
    var badgerep = response.match(/data-name="Badge Reputation" data-itemqty="(.*)" data-itemid/i) || [0,0]
    var ammy = response.match(/data-name="Amulet of Achievement" data-itemqty="(.*)" data-itemid/i) || [0,0]
    var questshard = response.match(/data-name="Quest Shard" data-itemqty="(.*)" data-itemid/i) || [0,0]
    var drolbatonic = response.match(/data-name="Drolba Tonic" data-itemqty="(.*)" data-itemid/i) || [0,0]
    var essence = response.match(/data-name="Rune Essence" data-itemqty="(.*)" data-itemid/i) || [0,0]
    var orbstone = response.match(/data-name="Astral Orbstone" data-itemqty="(.*)" data-itemid/i) || [0,0]
    var heart = response.match(/data-name="Heart of Death" data-itemqty="(.*)" data-itemid/i) || [0,0]
    var summoning = response.match(/data-name="Summoning Shard" data-itemqty="(.*)" data-itemid/i) || [0,0]

var potbp = "ajax/backpackcontents.php?suid="+document.querySelector("#moxxivision > tbody > tr:nth-child("+rownum+") > td:nth-child(1)").innerHTML+"&tab=potion"
fetch(potbp)
   .then(response => response.text())
   .then((response) => {
    var vile1 = response.match(/img data-itemidqty="([0-9]+)" data-name="Natas Vile"/i) || [0,0]
    var vile2 = response.match(/img data-itemidqty="([0-9]+)" data-name="White Vile"/i) || [0,0]
    var vile3 = response.match(/img data-itemidqty="([0-9]+)" data-name="Kinetic Vile"/i) || [0,0]
    var vile4 = response.match(/img data-itemidqty="([0-9]+)" data-name="Arcane Vile"/i) || [0,0]
    var vile5 = response.match(/img data-itemidqty="([0-9]+)" data-name="Shadow Vile"/i) || [0,0]
    var vile6 = response.match(/img data-itemidqty="([0-9]+)" data-name="Fire Vile"/i) || [0,0]
    var alsayic = response.match(/img data-itemidqty="([0-9]+)" data-name="Potion of Enraged Alsayic"/i) || [0,0]
    var sosa = response.match(/img data-itemidqty="([0-9]+)" data-name="Sammy Sosa's Special Sauce"/i) || [0,0]
    var pumpkin = response.match(/img data-itemidqty="([0-9]+)" data-name="Pumpkin Juice"/i) || [0,0]
    var zombie1 = response.match(/img data-itemidqty="([0-9]+)" data-name="Zombie Potion 1"/i) || [0,0]
    var zombie2 = response.match(/img data-itemidqty="([0-9]+)" data-name="Zombie Potion 2"/i) || [0,0]
    var zombie3 = response.match(/img data-itemidqty="([0-9]+)" data-name="Zombie Potion 3"/i) || [0,0]
    var zombie4 = response.match(/img data-itemidqty="([0-9]+)" data-name="Zombie Potion 4"/i) || [0,0]
    var zombie5 = response.match(/img data-itemidqty="([0-9]+)" data-name="Zombie Potion 5"/i) || [0,0]
    var zombie6 = response.match(/img data-itemidqty="([0-9]+)" data-name="Zombie Potion 6"/i) || [0,0]
    var daddy = response.match(/img data-itemidqty="([0-9]+)" data-name="Sugar Daddy"/i) || [0,0]
    var endurance = response.match(/img data-itemidqty="([0-9]+)" data-name="Flask of Endurance"/i) || [0,0]
    var rem75 = response.match(/img data-itemidqty="([0-9]+)" data-name="Remnant Solice Lev 7"/i) || [0,0]
    var rem80 = response.match(/img data-itemidqty="([0-9]+)" data-name="Remnant Solice Lev 8"/i) || [0,0]
    var rem85 = response.match(/img data-itemidqty="([0-9]+)" data-name="Remnant Solice Lev 9"/i) || [0,0]
    var rem90 = response.match(/img data-itemidqty="([0-9]+)" data-name="Remnant Solice Lev 10"/i) || [0,0]
    var dose = response.match(/img data-itemidqty="([0-9]+)" data-name="Dose of Destruction"/i) || [0,0]
    var mushroom = response.match(/img data-itemidqty="([0-9]+)" data-name="Funny Little Mushroom"/i) || [0,0]
    var slaughter = response.match(/img data-itemidqty="([0-9]+)" data-name="Bottle of Holy Slaughter"/i) || [0,0]
    var burning = response.match(/img data-itemidqty="([0-9]+)" data-name="Flask of Burning Souls"/i) || [0,0]
    var conjured = response.match(/img data-itemidqty="([0-9]+)" data-name="Flask of Conjured Lightning"/i) || [0,0]
    var flaming = response.match(/img data-itemidqty="([0-9]+)" data-name="Flask of Flaming Death"/i) || [0,0]
    var forbidden = response.match(/img data-itemidqty="([0-9]+)" data-name="Flask of Forbidden Knowledge"/i) || [0,0]
    var nova = response.match(/img data-itemidqty="([0-9]+)" data-name="Flask of Super Nova"/i) || [0,0]
    var juicebox = response.match(/img data-itemidqty="([0-9]+)" data-name="Olympian Juicebox"/i) || [0,0]
    var push = response.match(/img data-itemidqty="([0-9]+)" data-name="Olympian Push"/i) || [0,0]
    var whiskey = response.match(/img data-itemidqty="([0-9]+)" data-name="20 Year Aged Whiskey"/i) || [0,0]
    var marsh = response.match(/img data-itemidqty="([0-9]+)" data-name="Marsh Water"/i) || [0,0]
    var sauce = response.match(/img data-itemidqty="([0-9]+)" data-name="Blazing Holiday Sauce"/i) || [0,0]
    var scream = response.match(/img data-itemidqty="([0-9]+)" data-name="Evil Scream"/i) || [0,0]
    var griznix = response.match(/img data-itemidqty="([0-9]+)" data-name="Griznix Potion"/i) || [0,0]
    var reikavon = response.match(/img data-itemidqty="([0-9]+)" data-name="Reikavon's Elixer"/i) || [0,0]
    var zhulpot = response.match(/img data-itemidqty="([0-9]+)" data-name="Zhulian Potion"/i) || [0,0]
    var arcshot = response.match(/img data-itemidqty="([0-9]+)" data-name="Damned Arcane Shot"/i) || [0,0]
    var eleshot = response.match(/img data-itemidqty="([0-9]+)" data-name="Damned Element Shot"/i) || [0,0]
    var fireshot = response.match(/img data-itemidqty="([0-9]+)" data-name="Damned Fire Shot"/i) || [0,0]
    var holyshot = response.match(/img data-itemidqty="([0-9]+)" data-name="Damned Holy Shot"/i) || [0,0]
    var kinshot = response.match(/img data-itemidqty="([0-9]+)" data-name="Damned Kinetic Shot"/i) || [0,0]
    var shadshot = response.match(/img data-itemidqty="([0-9]+)" data-name="Damned Shadow Shot"/i) || [0,0]
    var kinpot = response.match(/img data-itemidqty="([0-9]+)" data-name="Kinetic Potency"/i) || [0,0]
    var insanity = response.match(/img data-itemidqty="([0-9]+)" data-name="Vial of Insanity"/i) || [0,0]
    var madness = response.match(/img data-itemidqty="([0-9]+)" data-name="Demonic Madness"/i) || [0,0]
    var komb = response.match(/img data-itemidqty="([0-9]+)" data-name="Kombucha"/i) || [0,0]
    var quantum = response.match(/img data-itemidqty="([0-9]+)" data-name="Quantum Quattro"/i) || [0,0]
    var elepot = response.match(/img data-itemidqty="([0-9]+)" data-name="Potion of Elemental Resistance"/i) || [0,0]
    var kixpot = response.match(/img data-itemidqty="([0-9]+)" data-name="Kix Potion"/i) || [0,0]
    var amdirpot = response.match(/img data-itemidqty="([0-9]+)" data-name="Potion of Amdir"/i) || [0,0]
    var squidpot = response.match(/img data-itemidqty="([0-9]+)" data-name="Squidberry Juice"/i) || [0,0]
    var brutpot = response.match(/img data-itemidqty="([0-9]+)" data-name="Master Brutality Potion"/i) || [0,0]
    var bubblepot = response.match(/img data-itemidqty="([0-9]+)" data-name="Bubble Gum"/i) || [0,0]
    var skittles = response.match(/img data-itemidqty="([0-9]+)" data-name="Skittles"/i) || [0,0]
    var mm = response.match(/img data-itemidqty="([0-9]+)" data-name="M&amp;Ms"/i) || [0,0]
    var reeses = response.match(/img data-itemidqty="([0-9]+)" data-name="Reeses Peanut Butter Cup"/i) || [0,0]
    var kitkat = response.match(/img data-itemidqty="([0-9]+)" data-name="Kit Kat Bar"/i) || [0,0]
    var tootsie = response.match(/img data-itemidqty="([0-9]+)" data-name="Tootsie Pop"/i) || [0,0]
    var minor = response.match(/img data-itemidqty="([0-9]+)" data-name="Minor Chaos Philter"/i) || [0,0]
    var major = response.match(/img data-itemidqty="([0-9]+)" data-name="Major Chaos Philter"/i) || [0,0]
    var starpower = response.match(/img data-itemidqty="([0-9]+)" data-name="Star Power"/i) || [0,0]
    var snickers = response.match(/img data-itemidqty="([0-9]+)" data-name="Snickers Bar"/i) || [0,0]
    var starburst = response.match(/img data-itemidqty="([0-9]+)" data-name="Starburst"/i) || [0,0]
    var brut = response.match(/img data-itemidqty="([0-9]+)" data-name="Master Brutality Potion"/i) || [0,0]
    var strengthpot = response.match(/img data-itemidqty="([0-9]+)" data-name="Strength Potion"/i) || [0,0]
    var hastepot = response.match(/img data-itemidqty="([0-9]+)" data-name="Haste Potion"/i) || [0,0]
    var ragepot1 = response.match(/img data-itemidqty="([0-9]+)" data-name="Rage Tonic"/i) || [0,0]
    var ragepot2 = response.match(/img data-itemidqty="([0-9]+)" data-name="Super Rage Tonic"/i) || [0,0]
    var ragepot3 = response.match(/img data-itemidqty="([0-9]+)" data-name="Grand Rage Tonic"/i) || [0,0]
    var ragepot4 = response.match(/img data-itemidqty="([0-9]+)" data-name="Alpha Rage Tonic"/i) || [0,0]
    var spark = response.match(/img data-itemidqty="([0-9]+)" data-name="Spark the Fury"/i) || [0,0]
    var fury = response.match(/img data-itemidqty="([0-9]+)" data-name="Recharge the Fury"/i) || [0,0]
    var questexppot = response.match(/img data-itemidqty="([0-9]+)" data-name="Quest Experience Potion"/i) || [0,0]

var collectionlinks = "collections?suid="+document.querySelector("#moxxivision > tbody > tr:nth-child("+rownum+") > td:nth-child(1)").innerHTML
fetch(collectionlinks)
  .then(res => res.text())
  .then((responseText) => {
    const doc = new DOMParser().parseFromString(responseText, 'text/html');
    const anjoutable = doc.querySelector("#divCollections > div.row > div:nth-child(1) > div > div > div.user-info.w-100.pr-3 > ul")
    const reikartable = doc.querySelector("#divCollections > div.row > div:nth-child(2) > div > div > div.user-info.w-100.pr-3 > ul")
    const lorrentable = doc.querySelector("#divCollections > div.row > div:nth-child(3) > div > div > div.user-info.w-100.pr-3 > ul")
    const luciletable = doc.querySelector("#divCollections > div.row > div:nth-child(4) > div > div > div.user-info.w-100.pr-3 > ul")
    const weimatable = doc.querySelector("#divCollections > div.row > div:nth-child(5) > div > div > div.user-info.w-100.pr-3 > ul")
    const soumatable = doc.querySelector("#divCollections > div.row > div:nth-child(6) > div > div > div.user-info.w-100.pr-3 > ul")
    const vanishatable = doc.querySelector("#divCollections > div.row > div:nth-child(7) > div > div > div.user-info.w-100.pr-3 > ul")
    const drolbatable = doc.querySelector("#divCollections > div.row > div:nth-child(8) > div > div > div.user-info.w-100.pr-3 > ul")
    const quibeltable = doc.querySelector("#divCollections > div.row > div:nth-child(9) > div > div > div.user-info.w-100.pr-3 > ul")
    var anjou = Math.ceil(((anjoutable.innerHTML.match(/img/g) || []).length)/3*100)
    var reikar = Math.ceil(((reikartable.innerHTML.match(/img/g) || []).length)/3*100)
    var lorren = Math.ceil(((lorrentable.innerHTML.match(/img/g) || []).length)/3*100)
    var lucile = Math.ceil(((luciletable.innerHTML.match(/img/g) || []).length)/3*100)
    var weima = Math.ceil(((weimatable.innerHTML.match(/img/g) || []).length)/3*100)
    var souma = Math.ceil(((soumatable.innerHTML.match(/img/g) || []).length)/3*100)
    var vanisha = Math.ceil(((vanishatable.innerHTML.match(/img/g) || []).length)/3*100)
    var drolba = Math.ceil(((drolbatable.innerHTML.match(/img/g) || []).length)/3*100)
    var quibel = Math.ceil(((quibeltable.innerHTML.match(/img/g) || []).length)/3*100)
    var collections_total = Math.ceil((anjou+reikar+lorren+lucile+weima+souma+vanisha+drolba+quibel)/9)

var worldlinks = "ajax_changeroomb?suid="+document.querySelector("#moxxivision > tbody > tr:nth-child("+rownum+") > td:nth-child(1)").innerHTML
fetch(worldlinks)
    .then (response => response.text())
    .then((response) => {
    var room = response.match(/"name":"([^"]*)"/i)[1]
    var roomnum = response.match(/"curRoom":"([0-9]+)"/i)[1]
    var moblist = response.match(/"roomDetailsNew".*tavernData/i).toString()
    var mobs = Array.from(moblist.matchAll(/"name":"[^"]*","level"/g)).toString().replaceAll(/"name":"/g,"").replaceAll(/,"level"/g,"").replaceAll(/"/g,"").replaceAll(",",", ")

var loglinks = "world_questHelper?suid="+document.querySelector("#moxxivision > tbody > tr:nth-child("+rownum+") > td:nth-child(1)").innerHTML
fetch(loglinks)
   .then(questlog_response => questlog_response.text())
   .then((questlog_response) => {

var perpetuallinks = "mob_search.php?suid="+document.querySelector("#moxxivision > tbody > tr:nth-child("+rownum+") > td:nth-child(1)").innerHTML+"&target=3731"
fetch(perpetuallinks)
    .then (crest_response => crest_response.text())
    .then((crest_response) => {var perpetual = '';
    if (questlog_response.match("Lorren Collection 3") != null && crest_response.match(/Quest help activated!/i) != null){perpetual = `READY <input type="checkbox" class="checkbox" name="perpetual_box" value=`+document.querySelector("#moxxivision > tbody > tr:nth-child("+rownum+") > td:nth-child(1)").innerHTML+`>`}
    if (questlog_response.match("Lorren Collection 3") == null || crest_response.match(/Quest help activated!/i) == null){perpetual = "--"}

var enduringlinks = "mob_search.php?suid="+document.querySelector("#moxxivision > tbody > tr:nth-child("+rownum+") > td:nth-child(1)").innerHTML+"&target=3730"
fetch(enduringlinks)
    .then (crest_response => crest_response.text())
    .then((crest_response) => {var enduring = '';
    if (questlog_response.match("Lorren Collection 2") != null && crest_response.match(/Quest help activated!/i) != null){enduring = `READY <input type="checkbox" class="checkbox" name="enduring_box" value=`+document.querySelector("#moxxivision > tbody > tr:nth-child("+rownum+") > td:nth-child(1)").innerHTML+`>`}
    if (questlog_response.match("Lorren Collection 2") == null || crest_response.match(/Quest help activated!/i) == null){enduring = "--"}

var defiantlinks = "mob_search.php?suid="+document.querySelector("#moxxivision > tbody > tr:nth-child("+rownum+") > td:nth-child(1)").innerHTML+"&target=3729"
fetch(defiantlinks)
    .then (crest_response => crest_response.text())
    .then((crest_response) => {var defiant = '';
    if (questlog_response.match("Lorren Collection 1") != null && crest_response.match(/Quest help activated!/i) != null){defiant = `READY <input type="checkbox" class="checkbox" name="defiant_box" value=`+document.querySelector("#moxxivision > tbody > tr:nth-child("+rownum+") > td:nth-child(1)").innerHTML+`>`}
    if (questlog_response.match("Lorren Collection 1") == null || crest_response.match(/Quest help activated!/i) == null){defiant = "--"}

var archlinks = "mob_search.php?suid="+document.querySelector("#moxxivision > tbody > tr:nth-child("+rownum+") > td:nth-child(1)").innerHTML+"&target=4046"
fetch(archlinks)
    .then (crest_response => crest_response.text())
    .then((crest_response) => {var hovok = '';
    if (questlog_response.match("Crest of") != null && crest_response.match(/Quest help activated!/i) != null){hovok = `READY <input type="checkbox" class="checkbox" name="hovok_box" value=`+document.querySelector("#moxxivision > tbody > tr:nth-child("+rownum+") > td:nth-child(1)").innerHTML+`>`}
    if (questlog_response.match("Crest of") == null || crest_response.match(/Quest help activated!/i) == null){hovok = "--"}

var seeplink = "mob_search.php?suid="+document.querySelector("#moxxivision > tbody > tr:nth-child("+rownum+") > td:nth-child(1)").innerHTML+"&target=4379"
fetch(seeplink)
    .then (seeping_response => seeping_response.text())
    .then((seeping_response) => {var seeping = '';
    if (seeping_response.match(/Quest help activated!/i) != null && questlog_response.match("Seeping Chaos Golem") != null) {seeping = `READY <input type="checkbox" class="checkbox" name="seeping_box" value=`+document.querySelector("#moxxivision > tbody > tr:nth-child("+rownum+") > td:nth-child(1)").innerHTML+`>`}
    if (seeping_response.match(/Quest help activated!/i) == null || questlog_response.match("Seeping Chaos Golem") == null) {seeping = "--"}

var dellink = "mob_search.php?suid="+document.querySelector("#moxxivision > tbody > tr:nth-child("+rownum+") > td:nth-child(1)").innerHTML+"&target=4380"
fetch(dellink)
    .then (deluged_response => deluged_response.text())
    .then((deluged_response) => {var deluged = '';
    if (deluged_response.match(/Quest help activated!/i) != null && questlog_response.match("Deluged Chaos Golem") != null) {deluged = `READY <input type="checkbox" class="checkbox" name="deluged_box" value=`+document.querySelector("#moxxivision > tbody > tr:nth-child("+rownum+") > td:nth-child(1)").innerHTML+`>`}
    if (deluged_response.match(/Quest help activated!/i) == null || questlog_response.match("Deluged Chaos Golem") == null) {deluged = "--"}

var vollink = "mob_search.php?suid="+document.querySelector("#moxxivision > tbody > tr:nth-child("+rownum+") > td:nth-child(1)").innerHTML+"&target=4381"
fetch(vollink)
    .then (volatile_response => volatile_response.text())
    .then((volatile_response) => {var volatile = '';
    if (volatile_response.match(/Quest help activated!/i) != null && questlog_response.match("Volatile Chaos Golem") != null) {volatile = `READY <input type="checkbox" class="checkbox" name="volatile_box" value=`+document.querySelector("#moxxivision > tbody > tr:nth-child("+rownum+") > td:nth-child(1)").innerHTML+`>`}
    if (volatile_response.match(/Quest help activated!/i) == null || questlog_response.match("Volatile Chaos Golem") == null) {volatile = "--"}

var corlink = "mob_search.php?suid="+document.querySelector("#moxxivision > tbody > tr:nth-child("+rownum+") > td:nth-child(1)").innerHTML+"&target=4050"
fetch(corlink)
    .then (corvok_response => corvok_response.text())
    .then((corvok_response) => {var corvok = '';
    if (corvok_response.match(/Quest help activated!/i) != null && questlog_response.match("Normok Reputation 2") != null) {corvok = `READY <input type="checkbox" class="checkbox" name="corvok_box" value=`+document.querySelector("#moxxivision > tbody > tr:nth-child("+rownum+") > td:nth-child(1)").innerHTML+`>`}
    if (corvok_response.match(/Quest help activated!/i) == null || questlog_response.match("Normok Reputation 2") == null) {corvok = "--"}

var skittorlink = "mob_search.php?suid="+document.querySelector("#moxxivision > tbody > tr:nth-child("+rownum+") > td:nth-child(1)").innerHTML+"&target=3921"
fetch(skittorlink)
    .then (skittor_response => skittor_response.text())
    .then((skittor_response) => {var skittor = '';
    if (skittor_response.match(/Quest help activated!/i) != null && questlog_response.match("Aestor Reputation 4") != null) {skittor = `READY <input type="checkbox" class="checkbox" name="skittor_box" value=`+document.querySelector("#moxxivision > tbody > tr:nth-child("+rownum+") > td:nth-child(1)").innerHTML+`>`}
    if (skittor_response.match(/Quest help activated!/i) == null || questlog_response.match("Aestor Reputation 4") == null) {skittor = "--"}

var roenovlink = "mob_search.php?suid="+document.querySelector("#moxxivision > tbody > tr:nth-child("+rownum+") > td:nth-child(1)").innerHTML+"&target=3920"
fetch(roenovlink)
    .then (roenov_response => roenov_response.text())
    .then((roenov_response) => {var roenov = '';
    if (roenov_response.match(/Quest help activated!/i) != null && questlog_response.match("Aestor Reputation 3") != null) {roenov = `READY <input type="checkbox" class="checkbox" name="roenov_box" value=`+document.querySelector("#moxxivision > tbody > tr:nth-child("+rownum+") > td:nth-child(1)").innerHTML+`>`}
    if (roenov_response.match(/Quest help activated!/i) == null || questlog_response.match("Aestor Reputation 3") == null) {roenov = "--"}

var ergonlink = "mob_search.php?suid="+document.querySelector("#moxxivision > tbody > tr:nth-child("+rownum+") > td:nth-child(1)").innerHTML+"&target=3922"
fetch(ergonlink)
    .then (ergon_response => ergon_response.text())
    .then((ergon_response) => {var ergon = '';
    if (ergon_response.match(/Quest help activated!/i) != null && questlog_response.match("Aestor Reputation 5") != null) {ergon = `READY <input type="checkbox" class="checkbox" name="ergon_box" value=`+document.querySelector("#moxxivision > tbody > tr:nth-child("+rownum+") > td:nth-child(1)").innerHTML+`>`}
    if (ergon_response.match(/Quest help activated!/i) == null || questlog_response.match("Aestor Reputation 5") == null) {ergon = "--"}

var treasurylink = "mytreasury.php?suid="+document.querySelector("#moxxivision > tbody > tr:nth-child("+rownum+") > td:nth-child(1)").innerHTML
fetch(treasurylink)
  .then(res => res.text())
  .then((responseText) => {
    const doc = new DOMParser().parseFromString(responseText, 'text/html');
    var treastable = doc.querySelector("#content-header-row > div.col-12.col-xl-9.pl-0.pr-0 > div.col-xl-12.col-lg-12.col-sm-12.layout-spacing > div > form").innerHTML
            .replaceAll(/<td colspan="2" style="padding: 5px; font-size:8pt;">[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*/g,"")
            .replaceAll(`<table style="border:1px solid black;background-color:#000000;max-width:700px" width="100%" cellspacing="0" cellpadding="2" border="0">`,"")
            .replaceAll(`<tbody><tr>`,"")
            .replaceAll(`<td colspan="3" align="center">`,"")
            .replaceAll(/<b>Selling [0-9]+ \/ [0-9]+ Allowed<\/b><a href="\/treasury\?search_for=Items\+for\+Sale"><img src="\/images\/button_increasestat\.gif" hspace="2" border="0" align="absmiddle"><\/a>/g,"")
            .replaceAll(/<th align="[a-zA-Z]+">[a-zA-Z]+<\/th>/g,"")
            .replaceAll(/<tr style="background-color:#[A-Za-z0-9]+;">/g,"")
            .replaceAll(`<td align="left">`,"")
            .replaceAll(`<td width="15"></td>`,"")
            .replaceAll(/<td align="right"><input style="text-align:right;" class="my-1 form-control" type="text" size="12" name="prices\[[0-9]+]" value="/g," - ")
            .replaceAll(`"></td>`,"")
            .replaceAll(/img src="[^"]*" style="max-width:35px;max-height:35px"/g,"p")
            .replaceAll(/<td width="15" align="center"><a href="mytreasury\?rem=[0-9]+"><svg xmlns="http:\/\/www\.w3\.org\/2000\/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"><\/line><line x1="6" y1="6" x2="18" y2="18"><\/line><\/svg><\/a><\/td>/g,"")
           .replaceAll(/<\/td>[\n\r]<\/tr>[\n\r]<tr>[\n\r]<td colspan="2" style="padding: 5px; font-size:8pt;">.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*/g,"")
            .replaceAll(/<table width="100%" border="0" style="border:1px solid black;background-color:#000000;max-width:700px" cellpadding="2" cellspacing="0">[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*/g,"")
            .replaceAll(/<tr style="background-color:#[0-9]+;">/g,"")
            .replaceAll(/<td align="right"><input style="text-align:right;" class="my-1 form-control" type="text" size="12" name="prices\[[0-9]+]" value="/g," - ")
            .replaceAll(/"><\/td>[\n\r]<\/tr>/g,"")
            .replaceAll(/<td align="center" width="15"><a href="mytreasury\?rem=[0-9]+"><svg xmlns="http:\/\/www\.w3\.org\/2000\/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"><\/line><line x1="6" y1="6" x2="18" y2="18"><\/line><\/svg><\/a><\/td>/g,"<br>")
            .replaceAll(/">[\n\r]<\/tbody><\/table>/g,"")
            .replaceAll(/"><\/td>[\n\r] <\/tr>/g,"")
            .replaceAll(/<table width="100%" border="0" style="border:1px solid black;background-color:#000000;max-width:700px" cellpadding="2" cellspacing="0">[\n\r].*[\n\r].*[\n\r].*/g,"No items for sale")
            .replaceAll(/<img align="absmiddle" src=".*" style="max-width:35px;max-height:35px"/g,"<p")

if (corvok != "--") corvready += name[1]+","
if (skittor != "--") skittorready += name[1]+","
if (roenov != "--") roenovready += name[1]+","
if (ergon != "--") ergonready += name[1]+","
if (parseInt(elefuser[1]) >= 10 && parseInt(rune_lvl) == 3) primalready += name[1]+",";
if (parseInt(elefuser[1]) >= 20 && parseInt(rune_lvl) == 4) respready += name[1]+",";
if (parseInt(elefuser[1]) >= 70 && parseInt(rune_lvl) == 5) mysticready += name[1]+",";
if (deluged != "--") delready += name[1]+",";
if (seeping != "--") seepready += name[1]+",";
if (volatile != "--") volready += name[1]+",";
if (hovok != "--") hovokready += name[1]+",";
if (parseInt(archfrag[1]) >= 10) fragready += name[1]+","
if (chaosore[1] >= 1 && gem_lvl <= 31) oreready += name[1]+","
if (chaosore[1] >= 2 && gem_lvl >= 32 && gem_lvl <= 40) oreready += name[1]+","
if (chaosore[1] >= 3 && gem_lvl == 40) oreready += name[1]+","
if (chaosore[1] >= 4 && gem_lvl == 41) oreready += name[1]+","
if (badgerep[1] >= 15) badgeready += name[1]+","
if (tome == "NO") notome += name[1]+","

var cloned = ''; if (core_cloned+head_cloned+neck_cloned+weapon_cloned+body_cloned+shield_cloned+pants_cloned+belt_cloned+ring_cloned+foot_cloned == 10) cloned = "YES";if (core_cloned+head_cloned+neck_cloned+weapon_cloned+body_cloned+shield_cloned+pants_cloned+belt_cloned+ring_cloned+foot_cloned != 10) cloned = "NO";

var neededtolvl = '';
90==level[1]&&(neededtolvl=0),89==level[1]&&(neededtolvl=5e10-parseInt(experience[1].replaceAll(",",""))),88==level[1]&&(neededtolvl=41e9-parseInt(experience[1].replaceAll(",",""))),87==level[1]&&(neededtolvl=33e9-parseInt(experience[1].replaceAll(",",""))),86==level[1]&&(neededtolvl=26e9-parseInt(experience[1].replaceAll(",",""))),85==level[1]&&(neededtolvl=2e10-parseInt(experience[1].replaceAll(",",""))),84==level[1]&&(neededtolvl=15e9-parseInt(experience[1].replaceAll(",",""))),83==level[1]&&(neededtolvl=1e10-parseInt(experience[1].replaceAll(",",""))),82==level[1]&&(neededtolvl=675e7-parseInt(experience[1].replaceAll(",",""))),81==level[1]&&(neededtolvl=45e8-parseInt(experience[1].replaceAll(",",""))),80==level[1]&&(neededtolvl=3e9-parseInt(experience[1].replaceAll(",",""))),79==level[1]&&(neededtolvl=2e9-parseInt(experience[1].replaceAll(",",""))),78==level[1]&&(neededtolvl=145092e4-parseInt(experience[1].replaceAll(",",""))),77==level[1]&&(neededtolvl=9956e5-parseInt(experience[1].replaceAll(",",""))),76==level[1]&&(neededtolvl=675e6-parseInt(experience[1].replaceAll(",",""))),75==level[1]&&(neededtolvl=385e6-parseInt(experience[1].replaceAll(",",""))),74==level[1]&&(neededtolvl=1849e5-parseInt(experience[1].replaceAll(",",""))),73==level[1]&&(neededtolvl=1524e5-parseInt(experience[1].replaceAll(",",""))),72==level[1]&&(neededtolvl=1264e5-parseInt(experience[1].replaceAll(",",""))),71==level[1]&&(neededtolvl=1069e5-parseInt(experience[1].replaceAll(",",""))),70==level[1]&&(neededtolvl=9065e4-parseInt(experience[1].replaceAll(",",""))),69==level[1]&&(neededtolvl=77e6-parseInt(experience[1].replaceAll(",",""))),68==level[1]&&(neededtolvl=6875e4-parseInt(experience[1].replaceAll(",",""))),67==level[1]&&(neededtolvl=6175e4-parseInt(experience[1].replaceAll(",",""))),66==level[1]&&(neededtolvl=5575e4-parseInt(experience[1].replaceAll(",",""))),65==level[1]&&(neededtolvl=4975e4-parseInt(experience[1].replaceAll(",",""))),64==level[1]&&(neededtolvl=4475e4-parseInt(experience[1].replaceAll(",",""))),63==level[1]&&(neededtolvl=3975e4-parseInt(experience[1].replaceAll(",",""))),62==level[1]&&(neededtolvl=3575e4-parseInt(experience[1].replaceAll(",",""))),61==level[1]&&(neededtolvl=3175e4-parseInt(experience[1].replaceAll(",",""))),60==level[1]&&(neededtolvl=28e6-parseInt(experience[1].replaceAll(",",""))),59==level[1]&&(neededtolvl=2475e4-parseInt(experience[1].replaceAll(",",""))),58==level[1]&&(neededtolvl=2225e4-parseInt(experience[1].replaceAll(",",""))),57==level[1]&&(neededtolvl=1975e4-parseInt(experience[1].replaceAll(",",""))),56==level[1]&&(neededtolvl=1725e4-parseInt(experience[1].replaceAll(",",""))),55==level[1]&&(neededtolvl=1475e4-parseInt(experience[1].replaceAll(",",""))),54==level[1]&&(neededtolvl=1275e4-parseInt(experience[1].replaceAll(",",""))),53==level[1]&&(neededtolvl=1105e4-parseInt(experience[1].replaceAll(",",""))),52==level[1]&&(neededtolvl=925e4-parseInt(experience[1].replaceAll(",",""))),51==level[1]&&(neededtolvl=775e4-parseInt(experience[1].replaceAll(",",""))),50==level[1]&&(neededtolvl=65e5-parseInt(experience[1].replaceAll(",",""))),49==level[1]&&(neededtolvl=525e4-parseInt(experience[1].replaceAll(",",""))),48==level[1]&&(neededtolvl=4935e3-parseInt(experience[1].replaceAll(",",""))),47==level[1]&&(neededtolvl=462e4-parseInt(experience[1].replaceAll(",",""))),46==level[1]&&(neededtolvl=4312500-parseInt(experience[1].replaceAll(",",""))),45==level[1]&&(neededtolvl=399e4-parseInt(experience[1].replaceAll(",",""))),44==level[1]&&(neededtolvl=3687500-parseInt(experience[1].replaceAll(",",""))),43==level[1]&&(neededtolvl=338e4-parseInt(experience[1].replaceAll(",",""))),42==level[1]&&(neededtolvl=3105e3-parseInt(experience[1].replaceAll(",",""))),41==level[1]&&(neededtolvl=28e5-parseInt(experience[1].replaceAll(",",""))),40==level[1]&&(neededtolvl=2537500-parseInt(experience[1].replaceAll(",",""))),39==level[1]&&(neededtolvl=2325e3-parseInt(experience[1].replaceAll(",",""))),38==level[1]&&(neededtolvl=2131250-parseInt(experience[1].replaceAll(",",""))),37==level[1]&&(neededtolvl=192e4-parseInt(experience[1].replaceAll(",",""))),36==level[1]&&(neededtolvl=1732500-parseInt(experience[1].replaceAll(",",""))),35==level[1]&&(neededtolvl=153e4-parseInt(experience[1].replaceAll(",",""))),34==level[1]&&(neededtolvl=1378125-parseInt(experience[1].replaceAll(",",""))),33==level[1]&&(neededtolvl=1224e3-parseInt(experience[1].replaceAll(",",""))),32==level[1]&&(neededtolvl=1082250-parseInt(experience[1].replaceAll(",",""))),31==level[1]&&(neededtolvl=95e4-parseInt(experience[1].replaceAll(",",""))),30==level[1]&&(neededtolvl=838500-parseInt(experience[1].replaceAll(",",""))),29==level[1]&&(neededtolvl=735e3-parseInt(experience[1].replaceAll(",",""))),28==level[1]&&(neededtolvl=625e3-parseInt(experience[1].replaceAll(",",""))),27==level[1]&&(neededtolvl=525e3-parseInt(experience[1].replaceAll(",",""))),26==level[1]&&(neededtolvl=445e3-parseInt(experience[1].replaceAll(",",""))),25==level[1]&&(neededtolvl=37e4-parseInt(experience[1].replaceAll(",",""))),24==level[1]&&(neededtolvl=31e4-parseInt(experience[1].replaceAll(",",""))),23==level[1]&&(neededtolvl=26e4-parseInt(experience[1].replaceAll(",",""))),22==level[1]&&(neededtolvl=215e3-parseInt(experience[1].replaceAll(",",""))),21==level[1]&&(neededtolvl=165e3-parseInt(experience[1].replaceAll(",",""))),20==level[1]&&(neededtolvl=13e4-parseInt(experience[1].replaceAll(",",""))),19==level[1]&&(neededtolvl=1e5-parseInt(experience[1].replaceAll(",",""))),18==level[1]&&(neededtolvl=75e3-parseInt(experience[1].replaceAll(",",""))),17==level[1]&&(neededtolvl=55e3-parseInt(experience[1].replaceAll(",",""))),16==level[1]&&(neededtolvl=4e4-parseInt(experience[1].replaceAll(",",""))),15==level[1]&&(neededtolvl=28e3-parseInt(experience[1].replaceAll(",",""))),14==level[1]&&(neededtolvl=18e3-parseInt(experience[1].replaceAll(",",""))),13==level[1]&&(neededtolvl=12e3-parseInt(experience[1].replaceAll(",",""))),12==level[1]&&(neededtolvl=8e3-parseInt(experience[1].replaceAll(",",""))),11==level[1]&&(neededtolvl=5e3-parseInt(experience[1].replaceAll(",",""))),10==level[1]&&(neededtolvl=3e3-parseInt(experience[1].replaceAll(",",""))),9==level[1]&&(neededtolvl=1500-parseInt(experience[1].replaceAll(",",""))),8==level[1]&&(neededtolvl=1e3-parseInt(experience[1].replaceAll(",",""))),7==level[1]&&(neededtolvl=700-parseInt(experience[1].replaceAll(",",""))),6==level[1]&&(neededtolvl=450-parseInt(experience[1].replaceAll(",",""))),5==level[1]&&(neededtolvl=250-parseInt(experience[1].replaceAll(",",""))),4==level[1]&&(neededtolvl=150-parseInt(experience[1].replaceAll(",",""))),3==level[1]&&(neededtolvl=50-parseInt(experience[1].replaceAll(",",""))),2==level[1]&&(neededtolvl=25-parseInt(experience[1].replaceAll(",",""))),1==level[1]&&(neededtolvl=7-parseInt(experience[1].replaceAll(",","")));

count += 1

tot_openaugs += core_openaugs+head_openaugs+neck_openaugs+weapon_openaugs+body_openaugs+shield_openaugs+pants_openaugs+belt_openaugs+ring_openaugs+foot_openaugs
document.querySelector("#math_openaugs").innerHTML = `<p>TOT: `+Math.ceil(tot_openaugs).toLocaleString("en-US")
tot_lvl += parseInt((level[1]).replaceAll(",",""))
document.querySelector("#math_lvl").innerHTML = `<p>AVG `+Math.ceil(tot_lvl/count).toLocaleString("en-US")
tot_today += parseInt((today[1]).replaceAll(",",""))
document.querySelector("#math_today").innerHTML = `<p>AVG `+Math.ceil(tot_today/count).toLocaleString("en-US")
tot_yesterday += parseInt((yesterday[1]).replaceAll(",",""))
document.querySelector("#math_yesterday").innerHTML = `<p>AVG `+Math.ceil(tot_yesterday/count).toLocaleString("en-US")
tot_gemlvl += gem_lvl
document.querySelector("#math_gemlvl").innerHTML = `<p>AVG `+Math.ceil(tot_gemlvl/count).toLocaleString("en-US")
tot_runelvl += rune_lvl
document.querySelector("#math_runelvl").innerHTML = `<p>AVG `+Math.ceil(tot_runelvl/count).toLocaleString("en-US")
tot_badgelvl += badge_level
document.querySelector("#math_badgelvl").innerHTML = `<p>AVG `+Math.ceil(tot_badgelvl/count).toLocaleString("en-US")
tot_mrage += parseInt(mrage[1].replaceAll(",",""))
document.querySelector("#math_mr").innerHTML = `<p>AVG `+Math.ceil(tot_mrage/count).toLocaleString("en-US")+`<p>TOT: `+tot_mrage.toLocaleString("en-US")
tot_power += parseInt(power[1].replaceAll(",",""))
document.querySelector("#math_power").innerHTML = `<p>AVG `+Math.ceil(tot_power/count).toLocaleString("en-US")+`<p>TOT: `+tot_power.toLocaleString("en-US")
tot_ele += parseInt(eledmg[1].replaceAll(",",""))
document.querySelector("#math_ele").innerHTML = `<p>AVG `+Math.ceil(tot_ele/count).toLocaleString("en-US")+`<p>TOT: `+tot_ele.toLocaleString("en-US")
tot_atk += parseInt(attack[1].replaceAll(",",""))
document.querySelector("#math_atk").innerHTML = `<p>AVG `+Math.ceil(tot_atk/count).toLocaleString("en-US")+`<p>TOT: `+tot_atk.toLocaleString("en-US")
tot_hp += parseInt(hp[1].replaceAll(",",""))
document.querySelector("#math_hp").innerHTML = `<p>AVG `+Math.ceil(tot_hp/count).toLocaleString("en-US")+`<p>TOT: `+tot_hp.toLocaleString("en-US")
tot_chaos += parseInt(chaos[1].replaceAll(",",""))
document.querySelector("#math_chaos").innerHTML = `<p>AVG `+Math.ceil(tot_chaos/count).toLocaleString("en-US")+`<p>TOT: `+tot_chaos.toLocaleString("en-US")
tot_wilderness += parseInt(wilderness[1].replaceAll(",",""))
document.querySelector("#math_wilderness").innerHTML = `<p>AVG `+Math.ceil(tot_wilderness/count).toLocaleString("en-US")+`<p>TOT: `+tot_wilderness.toLocaleString("en-US")
tot_slayer += parseInt(slayer[1].replaceAll(",",""))
document.querySelector("#math_slayer").innerHTML = `<p>AVG `+Math.ceil(tot_slayer/count).toLocaleString("en-US")+`<p>TOT: `+tot_slayer.toLocaleString("en-US")

var loading = Math.ceil(count/(charsTableRows-1)*100)

document.querySelector("#loading").innerHTML = loading;

document.querySelector("#loading_chars").innerHTML = name[1];

if (loading == 100){
GM_addStyle (`#moxxivision {display:revert !important;}
#button {display:revert !important;}
#Xmoxxivision {display:none !important;}
#vision {display:none !important;}
body{overflow-y: auto;}`)
$.get(selectedID[1])}

var menu = document.querySelector("#content > table > tbody > tr:nth-child("+rownum+")");

let td1 = document.createElement('td');
td1.innerHTML = `<a href="/world?suid=`+id[1]+`" target="blank">`+name[1]+`</a>`
td1.setAttribute("class","freeze")
insertAfter(td1, menu.lastElementChild);

let td2 = document.createElement('td');
td2.innerHTML = parseInt((level[1]).replaceAll(",",""));
td2.setAttribute("class","freeze")
insertAfter(td2, menu.lastElementChild);

let td45 = document.createElement('td');
td45.innerHTML = skillclass[1];
td45.setAttribute("class","home skills column")
insertAfter(td45, menu.lastElementChild);
if (skillclass[1] == "Ferocity") {
var circlinks = "skills_info.php?suid="+document.querySelector("#moxxivision > tbody > tr:nth-child("+rownum+") > td:nth-child(1)").innerHTML+"&id=3008"
fetch(circlinks)
.then (response => response.text())
.then((response) => {
if (response.match(/<input type="submit" name="cast" class="btn btn-primary" value="Cast Skill">/i) != null)
{td45.style = "color:#CE8C00";td45.innerHTML = "Ferocity: Circ Ready"};})}

let td44 = document.createElement('td');
td44.innerHTML = level[2].replace(/<\/font>/i,"");
td44.setAttribute("class","home column")
insertAfter(td44, menu.lastElementChild);

let td11 = document.createElement('td');
td11.innerHTML = crew[2];
td11.setAttribute("class","home world column")
insertAfter(td11, menu.lastElementChild);

let td39 = document.createElement('td');
td39.innerHTML = items;
td39.setAttribute("class","home column");
insertAfter(td39, menu.lastElementChild);
if (items.length <= 9) {td39.style = "color:#FF0000";}

let td41 = document.createElement('td');
td41.innerHTML = parseInt(rage[1].replaceAll(",",""));
td41.setAttribute("class","home column");
insertAfter(td41, menu.lastElementChild);

let td42 = document.createElement('td');
td42.innerHTML = tomax+` turns`;
td42.setAttribute("class","home column");
insertAfter(td42, menu.lastElementChild);
if (tomax == 0) {td42.style = "color:#00FF00";}

let td38 = document.createElement('td');
td38.innerHTML = parseInt((today[1]).replaceAll(",",""));
td38.setAttribute("class","home column");
insertAfter(td38, menu.lastElementChild);
if (parseInt((today[1]).replaceAll(",","")) <= 0) {td38.style = "color:#FF0000";}

let td37 = document.createElement('td');
td37.innerHTML = parseInt((yesterday[1]).replaceAll(",",""));
td37.setAttribute("class","home column");
insertAfter(td37, menu.lastElementChild);
if (parseInt((yesterday[1]).replaceAll(",","")) <= 0) {td37.style = "color:#FF0000";}

let td36 = document.createElement('td');
td36.innerHTML = parseInt(strength[1]);
td36.setAttribute("class","home column");
insertAfter(td36, menu.lastElementChild);
if (parseInt((strength[1]).replaceAll(",","")) <= 99) {td36.style = "color:#FF0000";}

let td43 = document.createElement('td');
td43.innerHTML = parseInt(supplies[1]);
td43.setAttribute("class","home column");
insertAfter(td43, menu.lastElementChild);
if (parseInt((supplies[1]).replaceAll(",","")) <= 99) {td43.style = "color:#FF0000";}

document.getElementById ("buttonx").addEventListener("click", ButtonX, false);
function ButtonX (zEvent) {

fetch('supplies?suid='+id[1], {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  body: new URLSearchParams({
      'buymax': 'Buy Max',
})
}).then(res => res.text())
  .then(res => {
var supplieslinks = "supplies?suid="+document.querySelector("#moxxivision > tbody > tr:nth-child("+rownum+") > td:nth-child(1)").innerHTML
fetch(supplieslinks)
   .then(response => response.text())
   .then((response) => {
    var supplies = response.match(/<img border="0" src="images\/suppliestriangle\.gif" width="11" height="11">[\n\r](.*)%<\/td>/i)
    td43.innerHTML = parseInt(supplies[1]);
    if (parseInt((supplies[1]).replaceAll(",","")) == 100) {td43.style = "color:#FFFFFF";}
    })
  });}

document.getElementById ("buttony").addEventListener("click", ButtonY, false);
function ButtonY (zEvent) {
var charlevel = document.querySelector("#moxxivision > tbody > tr:nth-child("+rownum+") > td:nth-child(3)").innerHTML
var i = '';
var els = '';
if (charlevel == 90){els = document.querySelectorAll("#moxxivision > tbody > tr:nth-child("+rownum+") > td");for (i=0; i < els.length; i++) {els[i].setAttribute('style','background:#1a0d0d;');}}
if (charlevel >= 85 && charlevel <= 89){els = document.querySelectorAll("#moxxivision > tbody > tr:nth-child("+rownum+") > td");for (i=0; i < els.length; i++) {els[i].setAttribute('style','background:#1a1a0d;');}}
if (charlevel >= 80 && charlevel <= 84){els = document.querySelectorAll("#moxxivision > tbody > tr:nth-child("+rownum+") > td");for (i=0; i < els.length; i++) {els[i].setAttribute('style','background:#0d1a13;');}}
if (charlevel <= 79){els = document.querySelectorAll("#moxxivision > tbody > tr:nth-child("+rownum+") > td");for (i=0; i < els.length; i++) {els[i].setAttribute('style','background:#0e0d1a;');}}
document.getElementById ("buttony").addEventListener("click", ButtonYoff, false);
document.getElementById ("buttony").removeEventListener("click", ButtonY, false);
}
function ButtonYoff (zEvent) {
var charlevel = document.querySelector("#moxxivision > tbody > tr:nth-child("+rownum+") > td:nth-child(3)").innerHTML
var i = '';
var els = '';
if (charlevel >= 0){els = document.querySelectorAll("#moxxivision > tbody > tr:nth-child("+rownum+") > td");for (i=0; i < els.length; i++) {els[i].setAttribute('style','background:#0F0F0F;');}}
document.getElementById ("buttony").addEventListener("click", ButtonY, false);
document.getElementById ("buttony").removeEventListener("click", ButtonYoff, false);
}

let td10 = document.createElement('td');
td10.innerHTML = parseInt(experience[1].replaceAll(",",""));
td10.setAttribute("class","stats column")
insertAfter(td10, menu.lastElementChild);

let td5 = document.createElement('td');
td5.innerHTML = neededtolvl;
if (neededtolvl == 0) td5.innerHTML = "--"
td5.setAttribute("class","stats column")
insertAfter(td5, menu.lastElementChild);

let td40 = document.createElement('td');
td40.innerHTML = parseInt(mrage[1].replaceAll(",",""));
td40.setAttribute("class","stats column")
insertAfter(td40, menu.lastElementChild);

let td3 = document.createElement('td');
td3.innerHTML = parseInt(power[1].replaceAll(",",""));
td3.setAttribute("class","stats column")
insertAfter(td3, menu.lastElementChild);

let td4 = document.createElement('td');
td4.innerHTML = parseInt(eledmg[1].replaceAll(",",""));
td4.setAttribute("class","stats column")
insertAfter(td4, menu.lastElementChild);

let td6 = document.createElement('td');
td6.innerHTML = parseInt(attack[1].replaceAll(",",""));
td6.setAttribute("class","stats column")
insertAfter(td6, menu.lastElementChild);

let td7 = document.createElement('td');
td7.innerHTML = parseInt(hp[1].replaceAll(",","")).toLocaleString("en-US");
td7.setAttribute("class","stats column")
insertAfter(td7, menu.lastElementChild);

let td8 = document.createElement('td');
td8.innerHTML = parseInt(chaos[1].replaceAll(",",""));
td8.setAttribute("class","stats column")
insertAfter(td8, menu.lastElementChild);

let td31 = document.createElement('td');
td31.innerHTML = holyRes[1];
td31.setAttribute("class","stats column");
insertAfter(td31, menu.lastElementChild);

let td32 = document.createElement('td');
td32.innerHTML = arcaneRes[1];
td32.setAttribute("class","stats column");
insertAfter(td32, menu.lastElementChild);

let td33 = document.createElement('td');
td33.innerHTML = shadowRes[1];
td33.setAttribute("class","stats column");
insertAfter(td33, menu.lastElementChild);

let td34 = document.createElement('td');
td34.innerHTML = fireRes[1];
td34.setAttribute("class","stats column");
insertAfter(td34, menu.lastElementChild);

let td35 = document.createElement('td');
td35.innerHTML = kineticRes[1];
td35.setAttribute("class","stats column");
insertAfter(td35, menu.lastElementChild);

let td9 = document.createElement('td');
td9.innerHTML = parseInt(wilderness[1].replaceAll(",",""));
td9.setAttribute("class","stats column")
insertAfter(td9, menu.lastElementChild);

let td27 = document.createElement('td');
td27.innerHTML = parseInt(slayer[1].replaceAll(",",""));
td27.setAttribute("class","stats column")
insertAfter(td27, menu.lastElementChild);

let td47 = document.createElement('td');
td47.innerHTML = tome;
td47.setAttribute("class","skills column")
insertAfter(td47, menu.lastElementChild);

let td46 = document.createElement('td');
td46.innerHTML = castskills;
td46.setAttribute("class","skills column")
insertAfter(td46, menu.lastElementChild);

let worldtd1 = document.createElement('td');
worldtd1.innerHTML = room;
worldtd1.setAttribute("class","world column")
insertAfter(worldtd1, menu.lastElementChild);

let worldtd2 = document.createElement('td');
worldtd2.innerHTML = roomnum;
worldtd2.setAttribute("class","world column")
insertAfter(worldtd2, menu.lastElementChild);

let worldtd3 = document.createElement('td');
worldtd3.innerHTML = mobs;
worldtd3.setAttribute("class","world column")
insertAfter(worldtd3, menu.lastElementChild);

let td12 = document.createElement("td");
td12.innerHTML = core;
td12.setAttribute("class","eq column");
insertAfter(td12,menu.lastElementChild);

let td13 = document.createElement('td');
td13.innerHTML = head;
td13.setAttribute("class","eq column")
insertAfter(td13, menu.lastElementChild);

let td14 = document.createElement('td');
td14.innerHTML = neck;
td14.setAttribute("class","eq column")
insertAfter(td14, menu.lastElementChild);

let td15 = document.createElement('td');
td15.innerHTML = weapon;
td15.setAttribute("class","eq column")
insertAfter(td15, menu.lastElementChild);

let td16 = document.createElement('td');
td16.innerHTML = body;
td16.setAttribute("class","eq column")
insertAfter(td16, menu.lastElementChild);

let td17 = document.createElement('td');
td17.innerHTML = shield;
td17.setAttribute("class","eq column")
insertAfter(td17, menu.lastElementChild);

let td18 = document.createElement('td');
td18.innerHTML = pants;
td18.setAttribute("class","eq column")
insertAfter(td18, menu.lastElementChild);

let td19 = document.createElement('td');
td19.innerHTML = belt;
td19.setAttribute("class","eq column")
insertAfter(td19, menu.lastElementChild);

let td20 = document.createElement('td');
td20.innerHTML = ring;
td20.setAttribute("class","eq column")
insertAfter(td20, menu.lastElementChild);

let td21 = document.createElement('td');
td21.innerHTML = foot;
td21.setAttribute("class","eq column")
insertAfter(td21, menu.lastElementChild);

let td22 = document.createElement('td');
td22.innerHTML = gem;
td22.setAttribute("class","eq column")
insertAfter(td22, menu.lastElementChild);

let td23 = document.createElement('td');
td23.innerHTML = rune;
td23.setAttribute("class","eq column")
insertAfter(td23, menu.lastElementChild);

let td24 = document.createElement('td');
td24.innerHTML = orb1;
td24.setAttribute("class","eq column")
insertAfter(td24, menu.lastElementChild);

let td30 = document.createElement('td');
td30.innerHTML = orb2;
td30.setAttribute("class","eq column")
insertAfter(td30, menu.lastElementChild);

let td28 = document.createElement('td');
td28.innerHTML = orb3;
td28.setAttribute("class","eq column")
insertAfter(td28, menu.lastElementChild);

let td25 = document.createElement('td');
td25.innerHTML = badge;
td25.setAttribute("class","eq column")
insertAfter(td25, menu.lastElementChild);

let td26 = document.createElement('td');
td26.innerHTML = booster;
td26.setAttribute("class","eq column")
insertAfter(td26, menu.lastElementChild);

let td122 = document.createElement('td');
td122.innerHTML = cloned;
td122.setAttribute("class","eq column")
insertAfter(td122, menu.lastElementChild);

let td169 = document.createElement('td');
td169.innerHTML = core_openaugs+head_openaugs+neck_openaugs+weapon_openaugs+body_openaugs+shield_openaugs+pants_openaugs+belt_openaugs+ring_openaugs+foot_openaugs
td169.setAttribute("class","eq column")
insertAfter(td169, menu.lastElementChild);

let eqall_1 = document.createElement('td');
eqall_1.innerHTML = eqtable;
eqall_1.setAttribute("class","alleq column")
eqall_1.setAttribute("width","700px")
insertAfter(eqall_1, menu.lastElementChild);

let allaugs_1 = document.createElement('td');
allaugs_1.innerHTML = augtable;
allaugs_1.setAttribute("class","augs column")
allaugs_1.setAttribute("width","700px")
insertAfter(allaugs_1, menu.lastElementChild);

let tdbp1 = document.createElement('td');
tdbp1.innerHTML = parseInt(bpcnt);
tdbp1.setAttribute("class","backpack column")
insertAfter(tdbp1, menu.lastElementChild);

let tdbp2 = document.createElement('td');
tdbp2.innerHTML = parseInt(bpcap);
tdbp2.setAttribute("class","backpack column")
insertAfter(tdbp2, menu.lastElementChild);

let tdbp3 = document.createElement('td');
tdbp3.innerHTML = allbp;
tdbp3.setAttribute("class","backpack column")
insertAfter(tdbp3, menu.lastElementChild);

let tdvault = document.createElement('td');
tdvault.innerHTML = vaulttable;
tdvault.setAttribute("class","vault column")
tdvault.setAttribute("width","700px")
insertAfter(tdvault, menu.lastElementChild);

let td_core = document.createElement('td');
td_core.innerHTML = core;
td_core.setAttribute("class","core mrup column")
insertAfter(td_core, menu.lastElementChild);

let td_coreaugs = document.createElement('td');
td_coreaugs.innerHTML = core_augs;
td_coreaugs.setAttribute("class","core column")
insertAfter(td_coreaugs, menu.lastElementChild);

let td_core_name = document.createElement('td');
td_core_name.innerHTML = core_name;
td_core_name.setAttribute("class","core column")
td_core_name.setAttribute("style","color:#"+core_rarity)
insertAfter(td_core_name, menu.lastElementChild);

let td_core_mr = document.createElement('td');
td_core_mr.innerHTML = core_mr;
td_core_mr.setAttribute("class","core column")
insertAfter(td_core_mr, menu.lastElementChild);

let td_core_atk = document.createElement('td');
td_core_atk.innerHTML = core_atk;
td_core_atk.setAttribute("class","core column")
insertAfter(td_core_atk, menu.lastElementChild);

let td_core_ele = document.createElement('td');
td_core_ele.innerHTML = core_holy+core_arcane+core_kinetic+core_shadow+core_fire;
td_core_ele.setAttribute("class","core column")
insertAfter(td_core_ele, menu.lastElementChild);

let td_core_chaos = document.createElement('td');
td_core_chaos.innerHTML = core_chaos;
td_core_chaos.setAttribute("class","core column")
insertAfter(td_core_chaos, menu.lastElementChild);

let td_core_vile = document.createElement('td');
td_core_vile.innerHTML = core_vile;
td_core_vile.setAttribute("class","core column")
insertAfter(td_core_vile, menu.lastElementChild);

let td_core_hp = document.createElement('td');
td_core_hp.innerHTML = core_hp;
td_core_hp.setAttribute("class","core column")
insertAfter(td_core_hp, menu.lastElementChild);

let td_core_resist = document.createElement('td');
td_core_resist.innerHTML = core_holyr+core_arcaner+core_shadowr+core_firer+core_kineticr;
td_core_resist.setAttribute("class","core column")
insertAfter(td_core_resist, menu.lastElementChild);

let td_core_block = document.createElement('td');
td_core_block.innerHTML = core_block;
td_core_block.setAttribute("class","core column")
insertAfter(td_core_block, menu.lastElementChild);

let td_core_eblock = document.createElement('td');
td_core_eblock.innerHTML = core_eblock;
td_core_eblock.setAttribute("class","core column")
insertAfter(td_core_eblock, menu.lastElementChild);

let td_core_rpt = document.createElement('td');
td_core_rpt.innerHTML = core_rpt;
td_core_rpt.setAttribute("class","core column")
insertAfter(td_core_rpt, menu.lastElementChild);

let td_core_ept = document.createElement('td');
td_core_ept.innerHTML = core_ept;
td_core_ept.setAttribute("class","core column")
insertAfter(td_core_ept, menu.lastElementChild);

let td_core_ramp = document.createElement('td');
td_core_ramp.innerHTML = core_ramp;
td_core_ramp.setAttribute("class","core column")
insertAfter(td_core_ramp, menu.lastElementChild);

let td_core_crit = document.createElement('td');
td_core_crit.innerHTML = core_crit;
td_core_crit.setAttribute("class","core column")
insertAfter(td_core_crit, menu.lastElementChild);

let td_core_gems = document.createElement('td');
td_core_gems.innerHTML = core_gems;
td_core_gems.setAttribute("class","core column")
insertAfter(td_core_gems, menu.lastElementChild);

let td_core_augs = document.createElement('td');
td_core_augs.innerHTML = core_openaugs;
td_core_augs.setAttribute("class","core column")
insertAfter(td_core_augs, menu.lastElementChild);

let td_core_upgrade = document.createElement('td');
td_core_upgrade.innerHTML = core_upgrade;
if (core_upgrade == 1.00) td_core_upgrade.innerHTML = '--';
td_core_upgrade.setAttribute("class","core mrup column")
insertAfter(td_core_upgrade, menu.lastElementChild);

let td_head = document.createElement('td');
td_head.innerHTML = head;
td_head.setAttribute("class","head mrup column")
insertAfter(td_head, menu.lastElementChild);

let td_headaugs = document.createElement('td');
td_headaugs.innerHTML = head_augs;
td_headaugs.setAttribute("class","head column")
insertAfter(td_headaugs, menu.lastElementChild);

let td_head_name = document.createElement('td');
td_head_name.innerHTML = head_name;
td_head_name.setAttribute("class","head column")
td_head_name.setAttribute("style","color:#"+head_rarity)
insertAfter(td_head_name, menu.lastElementChild);

let td_head_mr = document.createElement('td');
td_head_mr.innerHTML = head_mr;
td_head_mr.setAttribute("class","head column")
insertAfter(td_head_mr, menu.lastElementChild);

let td_head_atk = document.createElement('td');
td_head_atk.innerHTML = head_atk;
td_head_atk.setAttribute("class","head column")
insertAfter(td_head_atk, menu.lastElementChild);

let td_head_ele = document.createElement('td');
td_head_ele.innerHTML = head_holy+head_arcane+head_kinetic+head_shadow+head_fire;
td_head_ele.setAttribute("class","head column")
insertAfter(td_head_ele, menu.lastElementChild);

let td_head_chaos = document.createElement('td');
td_head_chaos.innerHTML = head_chaos;
td_head_chaos.setAttribute("class","head column")
insertAfter(td_head_chaos, menu.lastElementChild);

let td_head_vile = document.createElement('td');
td_head_vile.innerHTML = head_vile;
td_head_vile.setAttribute("class","head column")
insertAfter(td_head_vile, menu.lastElementChild);

let td_head_hp = document.createElement('td');
td_head_hp.innerHTML = head_hp;
td_head_hp.setAttribute("class","head column")
insertAfter(td_head_hp, menu.lastElementChild);

let td_head_resist = document.createElement('td');
td_head_resist.innerHTML = head_holyr+head_arcaner+head_shadowr+head_firer+head_kineticr;
td_head_resist.setAttribute("class","head column")
insertAfter(td_head_resist, menu.lastElementChild);

let td_head_block = document.createElement('td');
td_head_block.innerHTML = head_block;
td_head_block.setAttribute("class","head column")
insertAfter(td_head_block, menu.lastElementChild);

let td_head_eblock = document.createElement('td');
td_head_eblock.innerHTML = head_eblock;
td_head_eblock.setAttribute("class","head column")
insertAfter(td_head_eblock, menu.lastElementChild);

let td_head_rpt = document.createElement('td');
td_head_rpt.innerHTML = head_rpt;
td_head_rpt.setAttribute("class","head column")
insertAfter(td_head_rpt, menu.lastElementChild);

let td_head_ept = document.createElement('td');
td_head_ept.innerHTML = head_ept;
td_head_ept.setAttribute("class","head column")
insertAfter(td_head_ept, menu.lastElementChild);

let td_head_ramp = document.createElement('td');
td_head_ramp.innerHTML = head_ramp;
td_head_ramp.setAttribute("class","head column")
insertAfter(td_head_ramp, menu.lastElementChild);

let td_head_crit = document.createElement('td');
td_head_crit.innerHTML = head_crit;
td_head_crit.setAttribute("class","head column")
insertAfter(td_head_crit, menu.lastElementChild);

let td_head_gems = document.createElement('td');
td_head_gems.innerHTML = head_gems;
td_head_gems.setAttribute("class","head column")
insertAfter(td_head_gems, menu.lastElementChild);

let td_head_augs = document.createElement('td');
td_head_augs.innerHTML = head_openaugs;
td_head_augs.setAttribute("class","head column")
insertAfter(td_head_augs, menu.lastElementChild);

let td_head_upgrade = document.createElement('td');
td_head_upgrade.innerHTML = head_upgrade;
if (head_upgrade == 1.00) td_head_upgrade.innerHTML = '--';
td_head_upgrade.setAttribute("class","head mrup column")
insertAfter(td_head_upgrade, menu.lastElementChild);

let td_neck = document.createElement('td');
td_neck.innerHTML = neck;
td_neck.setAttribute("class","neck mrup column")
insertAfter(td_neck, menu.lastElementChild);

let td_neckaugs = document.createElement('td');
td_neckaugs.innerHTML = neck_augs;
td_neckaugs.setAttribute("class","neck column")
insertAfter(td_neckaugs, menu.lastElementChild);

let td_neck_name = document.createElement('td');
td_neck_name.innerHTML = neck_name;
td_neck_name.setAttribute("class","neck column")
td_neck_name.setAttribute("style","color:#"+neck_rarity)
insertAfter(td_neck_name, menu.lastElementChild);

let td_neck_mr = document.createElement('td');
td_neck_mr.innerHTML = neck_mr;
td_neck_mr.setAttribute("class","neck column")
insertAfter(td_neck_mr, menu.lastElementChild);

let td_neck_atk = document.createElement('td');
td_neck_atk.innerHTML = neck_atk;
td_neck_atk.setAttribute("class","neck column")
insertAfter(td_neck_atk, menu.lastElementChild);

let td_neck_ele = document.createElement('td');
td_neck_ele.innerHTML = neck_holy+neck_arcane+neck_kinetic+neck_shadow+neck_fire;
td_neck_ele.setAttribute("class","neck column")
insertAfter(td_neck_ele, menu.lastElementChild);

let td_neck_chaos = document.createElement('td');
td_neck_chaos.innerHTML = neck_chaos;
td_neck_chaos.setAttribute("class","neck column")
insertAfter(td_neck_chaos, menu.lastElementChild);

let td_neck_vile = document.createElement('td');
td_neck_vile.innerHTML = neck_vile;
td_neck_vile.setAttribute("class","neck column")
insertAfter(td_neck_vile, menu.lastElementChild);

let td_neck_hp = document.createElement('td');
td_neck_hp.innerHTML = neck_hp;
td_neck_hp.setAttribute("class","neck column")
insertAfter(td_neck_hp, menu.lastElementChild);

let td_neck_resist = document.createElement('td');
td_neck_resist.innerHTML = neck_holyr+neck_arcaner+neck_shadowr+neck_firer+neck_kineticr;
td_neck_resist.setAttribute("class","neck column")
insertAfter(td_neck_resist, menu.lastElementChild);

let td_neck_block = document.createElement('td');
td_neck_block.innerHTML = neck_block;
td_neck_block.setAttribute("class","neck column")
insertAfter(td_neck_block, menu.lastElementChild);

let td_neck_eblock = document.createElement('td');
td_neck_eblock.innerHTML = neck_eblock;
td_neck_eblock.setAttribute("class","neck column")
insertAfter(td_neck_eblock, menu.lastElementChild);

let td_neck_rpt = document.createElement('td');
td_neck_rpt.innerHTML = neck_rpt;
td_neck_rpt.setAttribute("class","neck column")
insertAfter(td_neck_rpt, menu.lastElementChild);

let td_neck_ept = document.createElement('td');
td_neck_ept.innerHTML = neck_ept;
td_neck_ept.setAttribute("class","neck column")
insertAfter(td_neck_ept, menu.lastElementChild);

let td_neck_ramp = document.createElement('td');
td_neck_ramp.innerHTML = neck_ramp;
td_neck_ramp.setAttribute("class","neck column")
insertAfter(td_neck_ramp, menu.lastElementChild);

let td_neck_crit = document.createElement('td');
td_neck_crit.innerHTML = neck_crit;
td_neck_crit.setAttribute("class","neck column")
insertAfter(td_neck_crit, menu.lastElementChild);

let td_neck_gems = document.createElement('td');
td_neck_gems.innerHTML = neck_gems;
td_neck_gems.setAttribute("class","neck column")
insertAfter(td_neck_gems, menu.lastElementChild);

let td_neck_augs = document.createElement('td');
td_neck_augs.innerHTML = neck_openaugs;
td_neck_augs.setAttribute("class","neck column")
insertAfter(td_neck_augs, menu.lastElementChild);

let td_neck_upgrade = document.createElement('td');
td_neck_upgrade.innerHTML = neck_upgrade;
if (neck_upgrade == 1.00) td_neck_upgrade.innerHTML = '--';
td_neck_upgrade.setAttribute("class","neck mrup column")
insertAfter(td_neck_upgrade, menu.lastElementChild);

let td_weapon = document.createElement('td');
td_weapon.innerHTML = weapon;
td_weapon.setAttribute("class","weapon mrup column")
insertAfter(td_weapon, menu.lastElementChild);

let td_weaponaugs = document.createElement('td');
td_weaponaugs.innerHTML = weapon_augs;
td_weaponaugs.setAttribute("class","weapon column")
insertAfter(td_weaponaugs, menu.lastElementChild);

let td_weapon_name = document.createElement('td');
td_weapon_name.innerHTML = weapon_name;
td_weapon_name.setAttribute("class","weapon column")
td_weapon_name.setAttribute("style","color:#"+weapon_rarity)
insertAfter(td_weapon_name, menu.lastElementChild);

let td_weapon_mr = document.createElement('td');
td_weapon_mr.innerHTML = weapon_mr;
td_weapon_mr.setAttribute("class","weapon column")
insertAfter(td_weapon_mr, menu.lastElementChild);

let td_weapon_atk = document.createElement('td');
td_weapon_atk.innerHTML = weapon_atk;
td_weapon_atk.setAttribute("class","weapon column")
insertAfter(td_weapon_atk, menu.lastElementChild);

let td_weapon_ele = document.createElement('td');
td_weapon_ele.innerHTML = weapon_holy+weapon_arcane+weapon_kinetic+weapon_shadow+weapon_fire;
td_weapon_ele.setAttribute("class","weapon column")
insertAfter(td_weapon_ele, menu.lastElementChild);

let td_weapon_chaos = document.createElement('td');
td_weapon_chaos.innerHTML = weapon_chaos;
td_weapon_chaos.setAttribute("class","weapon column")
insertAfter(td_weapon_chaos, menu.lastElementChild);

let td_weapon_vile = document.createElement('td');
td_weapon_vile.innerHTML = weapon_vile;
td_weapon_vile.setAttribute("class","weapon column")
insertAfter(td_weapon_vile, menu.lastElementChild);

let td_weapon_hp = document.createElement('td');
td_weapon_hp.innerHTML = weapon_hp;
td_weapon_hp.setAttribute("class","weapon column")
insertAfter(td_weapon_hp, menu.lastElementChild);

let td_weapon_resist = document.createElement('td');
td_weapon_resist.innerHTML = weapon_holyr+weapon_arcaner+weapon_shadowr+weapon_firer+weapon_kineticr;
td_weapon_resist.setAttribute("class","weapon column")
insertAfter(td_weapon_resist, menu.lastElementChild);

let td_weapon_block = document.createElement('td');
td_weapon_block.innerHTML = weapon_block;
td_weapon_block.setAttribute("class","weapon column")
insertAfter(td_weapon_block, menu.lastElementChild);

let td_weapon_eblock = document.createElement('td');
td_weapon_eblock.innerHTML = weapon_eblock;
td_weapon_eblock.setAttribute("class","weapon column")
insertAfter(td_weapon_eblock, menu.lastElementChild);

let td_weapon_rpt = document.createElement('td');
td_weapon_rpt.innerHTML = weapon_rpt;
td_weapon_rpt.setAttribute("class","weapon column")
insertAfter(td_weapon_rpt, menu.lastElementChild);

let td_weapon_ept = document.createElement('td');
td_weapon_ept.innerHTML = weapon_ept;
td_weapon_ept.setAttribute("class","weapon column")
insertAfter(td_weapon_ept, menu.lastElementChild);

let td_weapon_ramp = document.createElement('td');
td_weapon_ramp.innerHTML = weapon_ramp;
td_weapon_ramp.setAttribute("class","weapon column")
insertAfter(td_weapon_ramp, menu.lastElementChild);

let td_weapon_crit = document.createElement('td');
td_weapon_crit.innerHTML = weapon_crit;
td_weapon_crit.setAttribute("class","weapon column")
insertAfter(td_weapon_crit, menu.lastElementChild);

let td_weapon_gems = document.createElement('td');
td_weapon_gems.innerHTML = weapon_gems;
td_weapon_gems.setAttribute("class","weapon column")
insertAfter(td_weapon_gems, menu.lastElementChild);

let td_weapon_augs = document.createElement('td');
td_weapon_augs.innerHTML = weapon_openaugs;
td_weapon_augs.setAttribute("class","weapon column")
insertAfter(td_weapon_augs, menu.lastElementChild);

let td_weapon_upgrade = document.createElement('td');
td_weapon_upgrade.innerHTML = weapon_upgrade;
if (weapon_upgrade == 1.00) td_weapon_upgrade.innerHTML = '--';
td_weapon_upgrade.setAttribute("class","weapon mrup column")
insertAfter(td_weapon_upgrade, menu.lastElementChild);

let td_body = document.createElement('td');
td_body.innerHTML = body;
td_body.setAttribute("class","body mrup column")
insertAfter(td_body, menu.lastElementChild);

let td_bodyaugs = document.createElement('td');
td_bodyaugs.innerHTML = body_augs;
td_bodyaugs.setAttribute("class","body column")
insertAfter(td_bodyaugs, menu.lastElementChild);

let td_body_name = document.createElement('td');
td_body_name.innerHTML = body_name;
td_body_name.setAttribute("class","body column")
td_body_name.setAttribute("style","color:#"+body_rarity)
insertAfter(td_body_name, menu.lastElementChild);

let td_body_mr = document.createElement('td');
td_body_mr.innerHTML = body_mr;
td_body_mr.setAttribute("class","body column")
insertAfter(td_body_mr, menu.lastElementChild);

let td_body_atk = document.createElement('td');
td_body_atk.innerHTML = body_atk;
td_body_atk.setAttribute("class","body column")
insertAfter(td_body_atk, menu.lastElementChild);

let td_body_ele = document.createElement('td');
td_body_ele.innerHTML = body_holy+body_arcane+body_kinetic+body_shadow+body_fire;
td_body_ele.setAttribute("class","body column")
insertAfter(td_body_ele, menu.lastElementChild);

let td_body_chaos = document.createElement('td');
td_body_chaos.innerHTML = body_chaos;
td_body_chaos.setAttribute("class","body column")
insertAfter(td_body_chaos, menu.lastElementChild);

let td_body_vile = document.createElement('td');
td_body_vile.innerHTML = body_vile;
td_body_vile.setAttribute("class","body column")
insertAfter(td_body_vile, menu.lastElementChild);

let td_body_hp = document.createElement('td');
td_body_hp.innerHTML = body_hp;
td_body_hp.setAttribute("class","body column")
insertAfter(td_body_hp, menu.lastElementChild);

let td_body_resist = document.createElement('td');
td_body_resist.innerHTML = body_holyr+body_arcaner+body_shadowr+body_firer+body_kineticr;
td_body_resist.setAttribute("class","body column")
insertAfter(td_body_resist, menu.lastElementChild);

let td_body_block = document.createElement('td');
td_body_block.innerHTML = body_block;
td_body_block.setAttribute("class","body column")
insertAfter(td_body_block, menu.lastElementChild);

let td_body_eblock = document.createElement('td');
td_body_eblock.innerHTML = body_eblock;
td_body_eblock.setAttribute("class","body column")
insertAfter(td_body_eblock, menu.lastElementChild);

let td_body_rpt = document.createElement('td');
td_body_rpt.innerHTML = body_rpt;
td_body_rpt.setAttribute("class","body column")
insertAfter(td_body_rpt, menu.lastElementChild);

let td_body_ept = document.createElement('td');
td_body_ept.innerHTML = body_ept;
td_body_ept.setAttribute("class","body column")
insertAfter(td_body_ept, menu.lastElementChild);

let td_body_ramp = document.createElement('td');
td_body_ramp.innerHTML = body_ramp;
td_body_ramp.setAttribute("class","body column")
insertAfter(td_body_ramp, menu.lastElementChild);

let td_body_crit = document.createElement('td');
td_body_crit.innerHTML = body_crit;
td_body_crit.setAttribute("class","body column")
insertAfter(td_body_crit, menu.lastElementChild);

let td_body_gems = document.createElement('td');
td_body_gems.innerHTML = body_gems;
td_body_gems.setAttribute("class","body column")
insertAfter(td_body_gems, menu.lastElementChild);

let td_body_augs = document.createElement('td');
td_body_augs.innerHTML = body_openaugs;
td_body_augs.setAttribute("class","body column")
insertAfter(td_body_augs, menu.lastElementChild);

let td_body_upgrade = document.createElement('td');
td_body_upgrade.innerHTML = body_upgrade;
if (body_upgrade == 1.00) td_body_upgrade.innerHTML = '--';
td_body_upgrade.setAttribute("class","body mrup column")
insertAfter(td_body_upgrade, menu.lastElementChild);

let td_shield = document.createElement('td');
td_shield.innerHTML = shield;
td_shield.setAttribute("class","shield mrup column")
insertAfter(td_shield, menu.lastElementChild);

let td_shieldaugs = document.createElement('td');
td_shieldaugs.innerHTML = shield_augs;
td_shieldaugs.setAttribute("class","shield column")
insertAfter(td_shieldaugs, menu.lastElementChild);

let td_shield_name = document.createElement('td');
td_shield_name.innerHTML = shield_name;
td_shield_name.setAttribute("class","shield column")
td_shield_name.setAttribute("style","color:#"+shield_rarity)
insertAfter(td_shield_name, menu.lastElementChild);

let td_shield_mr = document.createElement('td');
td_shield_mr.innerHTML = shield_mr;
td_shield_mr.setAttribute("class","shield column")
insertAfter(td_shield_mr, menu.lastElementChild);

let td_shield_atk = document.createElement('td');
td_shield_atk.innerHTML = shield_atk;
td_shield_atk.setAttribute("class","shield column")
insertAfter(td_shield_atk, menu.lastElementChild);

let td_shield_ele = document.createElement('td');
td_shield_ele.innerHTML = shield_holy+shield_arcane+shield_kinetic+shield_shadow+shield_fire;
td_shield_ele.setAttribute("class","shield column")
insertAfter(td_shield_ele, menu.lastElementChild);

let td_shield_chaos = document.createElement('td');
td_shield_chaos.innerHTML = shield_chaos;
td_shield_chaos.setAttribute("class","shield column")
insertAfter(td_shield_chaos, menu.lastElementChild);

let td_shield_vile = document.createElement('td');
td_shield_vile.innerHTML = shield_vile;
td_shield_vile.setAttribute("class","shield column")
insertAfter(td_shield_vile, menu.lastElementChild);

let td_shield_hp = document.createElement('td');
td_shield_hp.innerHTML = shield_hp;
td_shield_hp.setAttribute("class","shield column")
insertAfter(td_shield_hp, menu.lastElementChild);

let td_shield_resist = document.createElement('td');
td_shield_resist.innerHTML = shield_holyr+shield_arcaner+shield_shadowr+shield_firer+shield_kineticr;
td_shield_resist.setAttribute("class","shield column")
insertAfter(td_shield_resist, menu.lastElementChild);

let td_shield_block = document.createElement('td');
td_shield_block.innerHTML = shield_block;
td_shield_block.setAttribute("class","shield column")
insertAfter(td_shield_block, menu.lastElementChild);

let td_shield_eblock = document.createElement('td');
td_shield_eblock.innerHTML = shield_eblock;
td_shield_eblock.setAttribute("class","shield column")
insertAfter(td_shield_eblock, menu.lastElementChild);

let td_shield_rpt = document.createElement('td');
td_shield_rpt.innerHTML = shield_rpt;
td_shield_rpt.setAttribute("class","shield column")
insertAfter(td_shield_rpt, menu.lastElementChild);

let td_shield_ept = document.createElement('td');
td_shield_ept.innerHTML = shield_ept;
td_shield_ept.setAttribute("class","shield column")
insertAfter(td_shield_ept, menu.lastElementChild);

let td_shield_ramp = document.createElement('td');
td_shield_ramp.innerHTML = shield_ramp;
td_shield_ramp.setAttribute("class","shield column")
insertAfter(td_shield_ramp, menu.lastElementChild);

let td_shield_crit = document.createElement('td');
td_shield_crit.innerHTML = shield_crit;
td_shield_crit.setAttribute("class","shield column")
insertAfter(td_shield_crit, menu.lastElementChild);

let td_shield_gems = document.createElement('td');
td_shield_gems.innerHTML = shield_gems;
td_shield_gems.setAttribute("class","shield column")
insertAfter(td_shield_gems, menu.lastElementChild);

let td_shield_augs = document.createElement('td');
td_shield_augs.innerHTML = shield_openaugs;
td_shield_augs.setAttribute("class","shield column")
insertAfter(td_shield_augs, menu.lastElementChild);

let td_shield_upgrade = document.createElement('td');
td_shield_upgrade.innerHTML = shield_upgrade;
if (shield_upgrade == 1.00) td_shield_upgrade.innerHTML = '--';
td_shield_upgrade.setAttribute("class","shield mrup column")
insertAfter(td_shield_upgrade, menu.lastElementChild);

let td_pants = document.createElement('td');
td_pants.innerHTML = pants;
td_pants.setAttribute("class","pants mrup column")
insertAfter(td_pants, menu.lastElementChild);

let td_pantsaugs = document.createElement('td');
td_pantsaugs.innerHTML = pants_augs;
td_pantsaugs.setAttribute("class","pants column")
insertAfter(td_pantsaugs, menu.lastElementChild);

let td_pants_name = document.createElement('td');
td_pants_name.innerHTML = pants_name;
td_pants_name.setAttribute("class","pants column")
td_pants_name.setAttribute("style","color:#"+pants_rarity)
insertAfter(td_pants_name, menu.lastElementChild);

let td_pants_mr = document.createElement('td');
td_pants_mr.innerHTML = pants_mr;
td_pants_mr.setAttribute("class","pants column")
insertAfter(td_pants_mr, menu.lastElementChild);

let td_pants_atk = document.createElement('td');
td_pants_atk.innerHTML = pants_atk;
td_pants_atk.setAttribute("class","pants column")
insertAfter(td_pants_atk, menu.lastElementChild);

let td_pants_ele = document.createElement('td');
td_pants_ele.innerHTML = pants_holy+pants_arcane+pants_kinetic+pants_shadow+pants_fire;
td_pants_ele.setAttribute("class","pants column")
insertAfter(td_pants_ele, menu.lastElementChild);

let td_pants_chaos = document.createElement('td');
td_pants_chaos.innerHTML = pants_chaos;
td_pants_chaos.setAttribute("class","pants column")
insertAfter(td_pants_chaos, menu.lastElementChild);

let td_pants_vile = document.createElement('td');
td_pants_vile.innerHTML = pants_vile;
td_pants_vile.setAttribute("class","pants column")
insertAfter(td_pants_vile, menu.lastElementChild);

let td_pants_hp = document.createElement('td');
td_pants_hp.innerHTML = pants_hp;
td_pants_hp.setAttribute("class","pants column")
insertAfter(td_pants_hp, menu.lastElementChild);

let td_pants_resist = document.createElement('td');
td_pants_resist.innerHTML = pants_holyr+pants_arcaner+pants_shadowr+pants_firer+pants_kineticr;
td_pants_resist.setAttribute("class","pants column")
insertAfter(td_pants_resist, menu.lastElementChild);

let td_pants_block = document.createElement('td');
td_pants_block.innerHTML = pants_block;
td_pants_block.setAttribute("class","pants column")
insertAfter(td_pants_block, menu.lastElementChild);

let td_pants_eblock = document.createElement('td');
td_pants_eblock.innerHTML = pants_eblock;
td_pants_eblock.setAttribute("class","pants column")
insertAfter(td_pants_eblock, menu.lastElementChild);

let td_pants_rpt = document.createElement('td');
td_pants_rpt.innerHTML = pants_rpt;
td_pants_rpt.setAttribute("class","pants column")
insertAfter(td_pants_rpt, menu.lastElementChild);

let td_pants_ept = document.createElement('td');
td_pants_ept.innerHTML = pants_ept;
td_pants_ept.setAttribute("class","pants column")
insertAfter(td_pants_ept, menu.lastElementChild);

let td_pants_ramp = document.createElement('td');
td_pants_ramp.innerHTML = pants_ramp;
td_pants_ramp.setAttribute("class","pants column")
insertAfter(td_pants_ramp, menu.lastElementChild);

let td_pants_crit = document.createElement('td');
td_pants_crit.innerHTML = pants_crit;
td_pants_crit.setAttribute("class","pants column")
insertAfter(td_pants_crit, menu.lastElementChild);

let td_pants_gems = document.createElement('td');
td_pants_gems.innerHTML = pants_gems;
td_pants_gems.setAttribute("class","pants column")
insertAfter(td_pants_gems, menu.lastElementChild);

let td_pants_augs = document.createElement('td');
td_pants_augs.innerHTML = pants_openaugs;
td_pants_augs.setAttribute("class","pants column")
insertAfter(td_pants_augs, menu.lastElementChild);

let td_pants_upgrade = document.createElement('td');
td_pants_upgrade.innerHTML = pants_upgrade;
if (pants_upgrade == 1.00) td_pants_upgrade.innerHTML = '--';
td_pants_upgrade.setAttribute("class","pants mrup column")
insertAfter(td_pants_upgrade, menu.lastElementChild);

let td_belt = document.createElement('td');
td_belt.innerHTML = belt;
td_belt.setAttribute("class","belt mrup column")
insertAfter(td_belt, menu.lastElementChild);

let td_beltaugs = document.createElement('td');
td_beltaugs.innerHTML = belt_augs;
td_beltaugs.setAttribute("class","belt column")
insertAfter(td_beltaugs, menu.lastElementChild);

let td_belt_name = document.createElement('td');
td_belt_name.innerHTML = belt_name;
td_belt_name.setAttribute("class","belt column")
td_belt_name.setAttribute("style","color:#"+belt_rarity)
insertAfter(td_belt_name, menu.lastElementChild);

let td_belt_mr = document.createElement('td');
td_belt_mr.innerHTML = belt_mr;
td_belt_mr.setAttribute("class","belt column")
insertAfter(td_belt_mr, menu.lastElementChild);

let td_belt_atk = document.createElement('td');
td_belt_atk.innerHTML = belt_atk;
td_belt_atk.setAttribute("class","belt column")
insertAfter(td_belt_atk, menu.lastElementChild);

let td_belt_ele = document.createElement('td');
td_belt_ele.innerHTML = belt_holy+belt_arcane+belt_kinetic+belt_shadow+belt_fire;
td_belt_ele.setAttribute("class","belt column")
insertAfter(td_belt_ele, menu.lastElementChild);

let td_belt_chaos = document.createElement('td');
td_belt_chaos.innerHTML = belt_chaos;
td_belt_chaos.setAttribute("class","belt column")
insertAfter(td_belt_chaos, menu.lastElementChild);

let td_belt_vile = document.createElement('td');
td_belt_vile.innerHTML = belt_vile;
td_belt_vile.setAttribute("class","belt column")
insertAfter(td_belt_vile, menu.lastElementChild);

let td_belt_hp = document.createElement('td');
td_belt_hp.innerHTML = belt_hp;
td_belt_hp.setAttribute("class","belt column")
insertAfter(td_belt_hp, menu.lastElementChild);

let td_belt_resist = document.createElement('td');
td_belt_resist.innerHTML = belt_holyr+belt_arcaner+belt_shadowr+belt_firer+belt_kineticr;
td_belt_resist.setAttribute("class","belt column")
insertAfter(td_belt_resist, menu.lastElementChild);

let td_belt_block = document.createElement('td');
td_belt_block.innerHTML = belt_block;
td_belt_block.setAttribute("class","belt column")
insertAfter(td_belt_block, menu.lastElementChild);

let td_belt_eblock = document.createElement('td');
td_belt_eblock.innerHTML = belt_eblock;
td_belt_eblock.setAttribute("class","belt column")
insertAfter(td_belt_eblock, menu.lastElementChild);

let td_belt_rpt = document.createElement('td');
td_belt_rpt.innerHTML = belt_rpt;
td_belt_rpt.setAttribute("class","belt column")
insertAfter(td_belt_rpt, menu.lastElementChild);

let td_belt_ept = document.createElement('td');
td_belt_ept.innerHTML = belt_ept;
td_belt_ept.setAttribute("class","belt column")
insertAfter(td_belt_ept, menu.lastElementChild);

let td_belt_ramp = document.createElement('td');
td_belt_ramp.innerHTML = belt_ramp;
td_belt_ramp.setAttribute("class","belt column")
insertAfter(td_belt_ramp, menu.lastElementChild);

let td_belt_crit = document.createElement('td');
td_belt_crit.innerHTML = belt_crit;
td_belt_crit.setAttribute("class","belt column")
insertAfter(td_belt_crit, menu.lastElementChild);

let td_belt_gems = document.createElement('td');
td_belt_gems.innerHTML = belt_gems;
td_belt_gems.setAttribute("class","belt column")
insertAfter(td_belt_gems, menu.lastElementChild);

let td_belt_augs = document.createElement('td');
td_belt_augs.innerHTML = belt_openaugs;
td_belt_augs.setAttribute("class","belt column")
insertAfter(td_belt_augs, menu.lastElementChild);

let td_belt_upgrade = document.createElement('td');
td_belt_upgrade.innerHTML = belt_upgrade;
if (belt_upgrade == 1.00) td_belt_upgrade.innerHTML = '--';
td_belt_upgrade.setAttribute("class","belt mrup column")
insertAfter(td_belt_upgrade, menu.lastElementChild);

let td_ring = document.createElement('td');
td_ring.innerHTML = ring;
td_ring.setAttribute("class","ring mrup column")
insertAfter(td_ring, menu.lastElementChild);

let td_ringaugs = document.createElement('td');
td_ringaugs.innerHTML = ring_augs;
td_ringaugs.setAttribute("class","ring column")
insertAfter(td_ringaugs, menu.lastElementChild);

let td_ring_name = document.createElement('td');
td_ring_name.innerHTML = ring_name;
td_ring_name.setAttribute("class","ring column")
td_ring_name.setAttribute("style","color:#"+ring_rarity)
insertAfter(td_ring_name, menu.lastElementChild);

let td_ring_mr = document.createElement('td');
td_ring_mr.innerHTML = ring_mr;
td_ring_mr.setAttribute("class","ring column")
insertAfter(td_ring_mr, menu.lastElementChild);

let td_ring_atk = document.createElement('td');
td_ring_atk.innerHTML = ring_atk;
td_ring_atk.setAttribute("class","ring column")
insertAfter(td_ring_atk, menu.lastElementChild);

let td_ring_ele = document.createElement('td');
td_ring_ele.innerHTML = ring_holy+ring_arcane+ring_kinetic+ring_shadow+ring_fire;
td_ring_ele.setAttribute("class","ring column")
insertAfter(td_ring_ele, menu.lastElementChild);

let td_ring_chaos = document.createElement('td');
td_ring_chaos.innerHTML = ring_chaos;
td_ring_chaos.setAttribute("class","ring column")
insertAfter(td_ring_chaos, menu.lastElementChild);

let td_ring_vile = document.createElement('td');
td_ring_vile.innerHTML = ring_vile;
td_ring_vile.setAttribute("class","ring column")
insertAfter(td_ring_vile, menu.lastElementChild);

let td_ring_hp = document.createElement('td');
td_ring_hp.innerHTML = ring_hp;
td_ring_hp.setAttribute("class","ring column")
insertAfter(td_ring_hp, menu.lastElementChild);

let td_ring_resist = document.createElement('td');
td_ring_resist.innerHTML = ring_holyr+ring_arcaner+ring_shadowr+ring_firer+ring_kineticr;
td_ring_resist.setAttribute("class","ring column")
insertAfter(td_ring_resist, menu.lastElementChild);

let td_ring_block = document.createElement('td');
td_ring_block.innerHTML = ring_block;
td_ring_block.setAttribute("class","ring column")
insertAfter(td_ring_block, menu.lastElementChild);

let td_ring_eblock = document.createElement('td');
td_ring_eblock.innerHTML = ring_eblock;
td_ring_eblock.setAttribute("class","ring column")
insertAfter(td_ring_eblock, menu.lastElementChild);

let td_ring_rpt = document.createElement('td');
td_ring_rpt.innerHTML = ring_rpt;
td_ring_rpt.setAttribute("class","ring column")
insertAfter(td_ring_rpt, menu.lastElementChild);

let td_ring_ept = document.createElement('td');
td_ring_ept.innerHTML = ring_ept;
td_ring_ept.setAttribute("class","ring column")
insertAfter(td_ring_ept, menu.lastElementChild);

let td_ring_ramp = document.createElement('td');
td_ring_ramp.innerHTML = ring_ramp;
td_ring_ramp.setAttribute("class","ring column")
insertAfter(td_ring_ramp, menu.lastElementChild);

let td_ring_crit = document.createElement('td');
td_ring_crit.innerHTML = ring_crit;
td_ring_crit.setAttribute("class","ring column")
insertAfter(td_ring_crit, menu.lastElementChild);

let td_ring_gems = document.createElement('td');
td_ring_gems.innerHTML = ring_gems;
td_ring_gems.setAttribute("class","ring column")
insertAfter(td_ring_gems, menu.lastElementChild);

let td_ring_augs = document.createElement('td');
td_ring_augs.innerHTML = ring_openaugs;
td_ring_augs.setAttribute("class","ring column")
insertAfter(td_ring_augs, menu.lastElementChild);

let td_ring_upgrade = document.createElement('td');
td_ring_upgrade.innerHTML = ring_upgrade;
if (ring_upgrade == 1.00) td_ring_upgrade.innerHTML = '--';
td_ring_upgrade.setAttribute("class","ring mrup column")
insertAfter(td_ring_upgrade, menu.lastElementChild);

let td_foot = document.createElement('td');
td_foot.innerHTML = foot;
td_foot.setAttribute("class","foot mrup column")
insertAfter(td_foot, menu.lastElementChild);

let td_footaugs = document.createElement('td');
td_footaugs.innerHTML = foot_augs;
td_footaugs.setAttribute("class","foot column")
insertAfter(td_footaugs, menu.lastElementChild);

let td_foot_name = document.createElement('td');
td_foot_name.innerHTML = foot_name;
td_foot_name.setAttribute("class","foot column")
td_foot_name.setAttribute("style","color:#"+foot_rarity)
insertAfter(td_foot_name, menu.lastElementChild);

let td_foot_mr = document.createElement('td');
td_foot_mr.innerHTML = foot_mr;
td_foot_mr.setAttribute("class","foot column")
insertAfter(td_foot_mr, menu.lastElementChild);

let td_foot_atk = document.createElement('td');
td_foot_atk.innerHTML = foot_atk;
td_foot_atk.setAttribute("class","foot column")
insertAfter(td_foot_atk, menu.lastElementChild);

let td_foot_ele = document.createElement('td');
td_foot_ele.innerHTML = foot_holy+foot_arcane+foot_kinetic+foot_shadow+foot_fire;
td_foot_ele.setAttribute("class","foot column")
insertAfter(td_foot_ele, menu.lastElementChild);

let td_foot_chaos = document.createElement('td');
td_foot_chaos.innerHTML = foot_chaos;
td_foot_chaos.setAttribute("class","foot column")
insertAfter(td_foot_chaos, menu.lastElementChild);

let td_foot_vile = document.createElement('td');
td_foot_vile.innerHTML = foot_vile;
td_foot_vile.setAttribute("class","foot column")
insertAfter(td_foot_vile, menu.lastElementChild);

let td_foot_hp = document.createElement('td');
td_foot_hp.innerHTML = foot_hp;
td_foot_hp.setAttribute("class","foot column")
insertAfter(td_foot_hp, menu.lastElementChild);

let td_foot_resist = document.createElement('td');
td_foot_resist.innerHTML = foot_holyr+foot_arcaner+foot_shadowr+foot_firer+foot_kineticr;
td_foot_resist.setAttribute("class","foot column")
insertAfter(td_foot_resist, menu.lastElementChild);

let td_foot_block = document.createElement('td');
td_foot_block.innerHTML = foot_block;
td_foot_block.setAttribute("class","foot column")
insertAfter(td_foot_block, menu.lastElementChild);

let td_foot_eblock = document.createElement('td');
td_foot_eblock.innerHTML = foot_eblock;
td_foot_eblock.setAttribute("class","foot column")
insertAfter(td_foot_eblock, menu.lastElementChild);

let td_foot_rpt = document.createElement('td');
td_foot_rpt.innerHTML = foot_rpt;
td_foot_rpt.setAttribute("class","foot column")
insertAfter(td_foot_rpt, menu.lastElementChild);

let td_foot_ept = document.createElement('td');
td_foot_ept.innerHTML = foot_ept;
td_foot_ept.setAttribute("class","foot column")
insertAfter(td_foot_ept, menu.lastElementChild);

let td_foot_ramp = document.createElement('td');
td_foot_ramp.innerHTML = foot_ramp;
td_foot_ramp.setAttribute("class","foot column")
insertAfter(td_foot_ramp, menu.lastElementChild);

let td_foot_crit = document.createElement('td');
td_foot_crit.innerHTML = foot_crit;
td_foot_crit.setAttribute("class","foot column")
insertAfter(td_foot_crit, menu.lastElementChild);

let td_foot_gems = document.createElement('td');
td_foot_gems.innerHTML = foot_gems;
td_foot_gems.setAttribute("class","foot column")
insertAfter(td_foot_gems, menu.lastElementChild);

let td_foot_augs = document.createElement('td');
td_foot_augs.innerHTML = foot_openaugs;
td_foot_augs.setAttribute("class","foot column")
insertAfter(td_foot_augs, menu.lastElementChild);

let td_foot_upgrade = document.createElement('td');
td_foot_upgrade.innerHTML = foot_upgrade;
if (foot_upgrade == 1.00) td_foot_upgrade.innerHTML = '--';
td_foot_upgrade.setAttribute("class","foot mrup column")
insertAfter(td_foot_upgrade, menu.lastElementChild);

let td90 = document.createElement('td');
td90.innerHTML = gem;
td90.setAttribute("class","gem column")
insertAfter(td90, menu.lastElementChild);

let td96 = document.createElement('td');
td96.innerHTML = gem_name;
td96.setAttribute("class","gem column")
insertAfter(td96, menu.lastElementChild);

let td91 = document.createElement('td');
td91.innerHTML = gem_lvl;
td91.setAttribute("class","gem column")
insertAfter(td91, menu.lastElementChild);

let td92 = document.createElement('td');
td92.innerHTML = gem_chaos;
td92.setAttribute("class","gem column")
insertAfter(td92, menu.lastElementChild);

let td93 = document.createElement('td');
td93.innerHTML = gem_ramp;
td93.setAttribute("class","gem column")
insertAfter(td93, menu.lastElementChild);

let td94 = document.createElement('td');
td94.innerHTML = gem_mr;
td94.setAttribute("class","gem column")
insertAfter(td94, menu.lastElementChild);

let td95 = document.createElement('td');
td95.innerHTML = gem_crit;
td95.setAttribute("class","gem column")
insertAfter(td95, menu.lastElementChild);

let td97 = document.createElement('td');
td97.innerHTML = chaosore[1];
td97.setAttribute("class","gem column")
insertAfter(td97, menu.lastElementChild);

let td99 = document.createElement('td');
td99.innerHTML = deluged;
td99.setAttribute("class","gem mobs column")
insertAfter(td99, menu.lastElementChild);
if (deluged == "alive") {td99.style = "color:#f441be";}

let td98 = document.createElement('td');
td98.innerHTML = seeping;
td98.setAttribute("class","gem mobs column")
insertAfter(td98, menu.lastElementChild);
if (seeping == "alive") {td98.style = "color:#f441be";}

let td100 = document.createElement('td');
td100.innerHTML = volatile;
td100.setAttribute("class","gem mobs column")
insertAfter(td100, menu.lastElementChild);
if (volatile == "alive") {td100.style = "color:#f441be";}

if (chaosore[1] >= 1 && gem_lvl <= 32) {td97.setAttribute("class","gem upgrade column")}
if (chaosore[1] >= 2 && gem_lvl >= 33 && gem_lvl <= 40) {td97.setAttribute("class","gem upgrade column")}
if (chaosore[1] >= 3 && gem_lvl == 41) {td97.setAttribute("class","gem upgrade column")}
if (chaosore[1] >= 4 && gem_lvl == 42) {td97.setAttribute("class","gem upgrade column")}

let td101 = document.createElement('td');
td101.innerHTML = rune;
td101.setAttribute("class","rune column")
insertAfter(td101, menu.lastElementChild);

let td102 = document.createElement('td');
td102.innerHTML = rune_name;
td102.setAttribute("class","rune column")
insertAfter(td102, menu.lastElementChild);

let td103 = document.createElement('td');
td103.innerHTML = rune_lvl;
td103.setAttribute("class","rune column")
insertAfter(td103, menu.lastElementChild);

let td104 = document.createElement('td');
td104.innerHTML = rune_ele;
td104.setAttribute("class","rune column")
insertAfter(td104, menu.lastElementChild);

let td105 = document.createElement('td');
td105.innerHTML = elefuser[1]
td105.setAttribute("class","rune column")
insertAfter(td105, menu.lastElementChild);

if (elefuser[1] >= 10 && rune_lvl == 3){td105.setAttribute("class","rune upgrade column")}
if (elefuser[1] >= 20 && rune_lvl == 4){td105.setAttribute("class","rune upgrade column")}
if (elefuser[1] >= 70 && rune_lvl == 5){td105.setAttribute("class","rune upgrade column")}

let td106 = document.createElement('td');
td106.innerHTML = essence[1]
td106.setAttribute("class","rune column")
insertAfter(td106, menu.lastElementChild);

let td107 = document.createElement('td');
td107.innerHTML = orbstone[1]
td107.setAttribute("class","rune column")
insertAfter(td107, menu.lastElementChild);

let td108 = document.createElement('td');
td108.innerHTML = heart[1]
td108.setAttribute("class","rune column")
insertAfter(td108, menu.lastElementChild);

let td109 = document.createElement('td');
td109.innerHTML = orb1;
td109.setAttribute("class","orbs column")
insertAfter(td109, menu.lastElementChild);

let td110 = document.createElement('td');
td110.innerHTML = orb1name[1];
td110.setAttribute("class","orbs column")
insertAfter(td110, menu.lastElementChild);

let td111 = document.createElement('td');
td111.innerHTML = orb2;
td111.setAttribute("class","orbs column")
insertAfter(td111, menu.lastElementChild);

let td112 = document.createElement('td');
td112.innerHTML = orb2name[1];
td112.setAttribute("class","orbs column")
insertAfter(td112, menu.lastElementChild);

let td113 = document.createElement('td');
td113.innerHTML = orb3;
td113.setAttribute("class","orbs column")
insertAfter(td113, menu.lastElementChild);

let td114 = document.createElement('td');
td114.innerHTML = orb3name[1];
td114.setAttribute("class","orbs column")
insertAfter(td114, menu.lastElementChild);

let td115 = document.createElement('td');
td115.innerHTML = orb1_ele+orb2_ele+orb3_ele;
td115.setAttribute("class","orbs column")
insertAfter(td115, menu.lastElementChild);

let td116 = document.createElement('td');
td116.innerHTML = orb1_chaos+orb2_chaos+orb3_chaos;
td116.setAttribute("class","orbs column")
insertAfter(td116, menu.lastElementChild);

let td117 = document.createElement('td');
td117.innerHTML = orb1_atk+orb2_atk+orb3_atk;
td117.setAttribute("class","orbs column")
insertAfter(td117, menu.lastElementChild);

let td118 = document.createElement('td');
td118.innerHTML = orb1_hp+orb2_hp+orb3_hp;
td118.setAttribute("class","orbs column")
insertAfter(td118, menu.lastElementChild);

let td119 = document.createElement('td');
td119.innerHTML = orb1_mr+orb2_mr+orb3_mr;
td119.setAttribute("class","orbs column")
insertAfter(td119, menu.lastElementChild);

let td120 = document.createElement('td');
td120.innerHTML = orb1_rpt+orb2_rpt+orb3_rpt;
td120.setAttribute("class","orbs column")
insertAfter(td120, menu.lastElementChild);

let td121 = document.createElement('td');
td121.innerHTML = orb1_ept+orb2_ept+orb3_ept;
td121.setAttribute("class","orbs column")
insertAfter(td121, menu.lastElementChild);

let td123 = document.createElement('td');
td123.innerHTML = badge;
td123.setAttribute("class","bdge column")
insertAfter(td123, menu.lastElementChild);

let td124 = document.createElement('td');
td124.innerHTML = badge_name;
td124.setAttribute("class","bdge column")
insertAfter(td124, menu.lastElementChild);

let td125 = document.createElement('td');
td125.innerHTML = badge_level;
td125.setAttribute("class","bdge column")
insertAfter(td125, menu.lastElementChild);

let td126 = document.createElement('td');
td126.innerHTML = badge_atk;
td126.setAttribute("class","bdge column")
insertAfter(td126, menu.lastElementChild);

let td127 = document.createElement('td');
td127.innerHTML = badge_ele;
td127.setAttribute("class","bdge column")
insertAfter(td127, menu.lastElementChild);

let td128 = document.createElement('td');
td128.innerHTML = badge_hp;
td128.setAttribute("class","bdge column")
insertAfter(td128, menu.lastElementChild);

let td129 = document.createElement('td');
td129.innerHTML = badgerep[1];
td129.setAttribute("class","bdge column")
insertAfter(td129, menu.lastElementChild);
if (badgerep[1] >= 15){td129.setAttribute("class","bdge upgrade column")}

let td_corvok = document.createElement('td');
td_corvok.innerHTML = corvok;
td_corvok.setAttribute("class","bdge mobs column")
insertAfter(td_corvok, menu.lastElementChild);

let td_skittor = document.createElement('td');
td_skittor.innerHTML = skittor;
td_skittor.setAttribute("class","bdge mobs column")
insertAfter(td_skittor, menu.lastElementChild);

let td_roenov = document.createElement('td');
td_roenov.innerHTML = roenov;
td_roenov.setAttribute("class","bdge mobs column")
insertAfter(td_roenov, menu.lastElementChild);

let td_ergon = document.createElement('td');
td_ergon.innerHTML = ergon;
td_ergon.setAttribute("class","bdge mobs column")
insertAfter(td_ergon, menu.lastElementChild);

let td_defiant = document.createElement('td');
td_defiant.innerHTML = defiant;
td_defiant.setAttribute("class","bdge mobs column")
insertAfter(td_defiant, menu.lastElementChild);

let td_enduring = document.createElement('td');
td_enduring.innerHTML = enduring;
td_enduring.setAttribute("class","bdge mobs column")
insertAfter(td_enduring, menu.lastElementChild);

let td_perpetual = document.createElement('td');
td_perpetual.innerHTML = perpetual;
td_perpetual.setAttribute("class","bdge mobs column")
insertAfter(td_perpetual, menu.lastElementChild);

let td131 = document.createElement('td');
td131.innerHTML = booster;
td131.setAttribute("class","booster column")
insertAfter(td131, menu.lastElementChild);

let td132 = document.createElement('td');
td132.innerHTML = booster_name;
td132.setAttribute("class","booster column")
insertAfter(td132, menu.lastElementChild);

let td133 = document.createElement('td');
td133.innerHTML = booster_effect;
td133.setAttribute("class","booster column")
insertAfter(td133, menu.lastElementChild);

let td134 = document.createElement('td');
td134.innerHTML = booster_exp;
td134.setAttribute("class","booster column")
insertAfter(td134, menu.lastElementChild);

let td48 = document.createElement('td');
td48.innerHTML = crest1;
td48.setAttribute("class","crests column")
insertAfter(td48, menu.lastElementChild);

let td52 = document.createElement('td');
td52.innerHTML = crest1lvl;
td52.setAttribute("class","crests column")
insertAfter(td52, menu.lastElementChild);

let td49 = document.createElement('td');
td49.innerHTML = crest2;
td49.setAttribute("class","crests column")
insertAfter(td49, menu.lastElementChild);

let td53 = document.createElement('td');
td53.innerHTML = crest2lvl;
td53.setAttribute("class","crests column")
insertAfter(td53, menu.lastElementChild);

let td50 = document.createElement('td');
td50.innerHTML = crest3;
td50.setAttribute("class","crests column")
insertAfter(td50, menu.lastElementChild);

let td54 = document.createElement('td');
td54.innerHTML = crest3lvl;
td54.setAttribute("class","crests column")
insertAfter(td54, menu.lastElementChild);

let td51 = document.createElement('td');
td51.innerHTML = crest4;
td51.setAttribute("class","crests column")
insertAfter(td51, menu.lastElementChild);

let td55 = document.createElement('td');
td55.innerHTML = crest4lvl;
td55.setAttribute("class","crests column")
insertAfter(td55, menu.lastElementChild);

let td56 = document.createElement('td');
td56.innerHTML = parseInt(archfrag[1]);
td56.setAttribute("class","crests column")
insertAfter(td56, menu.lastElementChild);

let td130 = document.createElement('td');
td130.innerHTML = parseInt(demonskull[1]);
td130.setAttribute("class","crests column")
insertAfter(td130, menu.lastElementChild);

let td57 = document.createElement('td');
td57.innerHTML = hovok;
td57.setAttribute("class","crests mobs column")
insertAfter(td57, menu.lastElementChild);

if (parseInt(archfrag[1]) >= 10){td56.setAttribute("class","crests upgrade column")}

let td58 = document.createElement('td');
td58.innerHTML = chaosore[1];
td58.setAttribute("class","bp column")
insertAfter(td58, menu.lastElementChild);

let td59 = document.createElement('td');
td59.innerHTML = archfrag[1];
td59.setAttribute("class","bp column")
insertAfter(td59, menu.lastElementChild);

let td136 = document.createElement('td');
td136.innerHTML = parseInt(demonskull[1]);
td136.setAttribute("class","bp column")
insertAfter(td136, menu.lastElementChild);

let td60 = document.createElement('td');
td60.innerHTML = elefuser[1];
td60.setAttribute("class","bp column")
insertAfter(td60, menu.lastElementChild);

let td61 = document.createElement('td');
td61.innerHTML = badgerep[1];
td61.setAttribute("class","bp column")
insertAfter(td61, menu.lastElementChild);

let td62 = document.createElement('td');
td62.innerHTML = ammy[1];
td62.setAttribute("class","bp column")
insertAfter(td62, menu.lastElementChild);

let td68 = document.createElement('td');
td68.innerHTML = questshard[1];
td68.setAttribute("class","bp column")
insertAfter(td68, menu.lastElementChild);

let td_drolba = document.createElement('td');
td_drolba.innerHTML = drolbatonic[1]
td_drolba.setAttribute("class","bp column")
insertAfter(td_drolba, menu.lastElementChild);

let td_summoning = document.createElement('td');
td_summoning.innerHTML = summoning[1];
td_summoning.setAttribute("class","bp column")
insertAfter(td_summoning, menu.lastElementChild);

let tradable1 = document.createElement('td');
tradable1.innerHTML = elepot[1];
tradable1.setAttribute("class","tradable column")
insertAfter(tradable1, menu.lastElementChild);

let tradable2 =document.createElement('td');
tradable2.innerHTML = kixpot[1];
tradable2.setAttribute("class","tradable column")
insertAfter(tradable2, menu.lastElementChild);

let tradable3 =document.createElement('td');
tradable3.innerHTML = amdirpot[1];
tradable3.setAttribute("class","tradable column")
insertAfter(tradable3, menu.lastElementChild);

let tradable4 = document.createElement('td');
tradable4.innerHTML = squidpot[1];
tradable4.setAttribute("class","tradable column")
insertAfter(tradable4, menu.lastElementChild);

let tradable5 = document.createElement('td');
tradable5.innerHTML = brutpot[1];
tradable5.setAttribute("class","tradable column")
insertAfter(tradable5, menu.lastElementChild);

let tradable6 = document.createElement('td');
tradable6.innerHTML = bubblepot[1];
tradable6.setAttribute("class","tradable column")
insertAfter(tradable6, menu.lastElementChild);

let tradable7 = document.createElement('td');
tradable7.innerHTML = skittles[1];
tradable7.setAttribute("class","tradable column")
insertAfter(tradable7, menu.lastElementChild);

let tradable15 = document.createElement('td');
tradable15.innerHTML = snickers[1];
tradable15.setAttribute("class","tradable column")
insertAfter(tradable15, menu.lastElementChild);

let tradable16 = document.createElement('td');
tradable16.innerHTML = starburst[1];
tradable16.setAttribute("class","tradable column")
insertAfter(tradable16, menu.lastElementChild);

let tradable8 = document.createElement('td');
tradable8.innerHTML = mm[1];
tradable8.setAttribute("class","tradable column")
insertAfter(tradable8, menu.lastElementChild);

let tradable9 = document.createElement('td');
tradable9.innerHTML = reeses[1];
tradable9.setAttribute("class","tradable column")
insertAfter(tradable9, menu.lastElementChild);

let tradable10 = document.createElement('td');
tradable10.innerHTML = kitkat[1];
tradable10.setAttribute("class","tradable column")
insertAfter(tradable10, menu.lastElementChild);

let tradable11 = document.createElement('td');
tradable11.innerHTML = tootsie[1];
tradable11.setAttribute("class","tradable column")
insertAfter(tradable11, menu.lastElementChild);

let tradable12 = document.createElement('td');
tradable12.innerHTML = minor[1];
tradable12.setAttribute("class","tradable column")
insertAfter(tradable12, menu.lastElementChild);

let tradable13 = document.createElement('td');
tradable13.innerHTML = major[1];
tradable13.setAttribute("class","tradable column")
insertAfter(tradable13, menu.lastElementChild);

let tradable14 = document.createElement('td');
tradable14.innerHTML = starpower[1];
tradable14.setAttribute("class","tradable column")
insertAfter(tradable14, menu.lastElementChild);

let td69 = document.createElement('td');
td69.innerHTML = vile1[1];
td69.setAttribute("class","generic column")
insertAfter(td69, menu.lastElementChild);

let td70 = document.createElement('td');
td70.innerHTML = vile2[1];
td70.setAttribute("class","generic column")
insertAfter(td70, menu.lastElementChild);

let td71 = document.createElement('td');
td71.innerHTML = vile3[1];
td71.setAttribute("class","generic column")
insertAfter(td71, menu.lastElementChild);

let td72 = document.createElement('td');
td72.innerHTML = vile4[1];
td72.setAttribute("class","generic column")
insertAfter(td72, menu.lastElementChild);

let td73 = document.createElement('td');
td73.innerHTML = vile5[1];
td73.setAttribute("class","generic column")
insertAfter(td73, menu.lastElementChild);

let td74 = document.createElement('td');
td74.innerHTML = vile6[1];
td74.setAttribute("class","generic column")
insertAfter(td74, menu.lastElementChild);

let td78 = document.createElement('td');
td78.innerHTML = zombie1[1];
td78.setAttribute("class","generic column")
insertAfter(td78, menu.lastElementChild);

let td79 = document.createElement('td');
td79.innerHTML = zombie2[1];
td79.setAttribute("class","generic column")
insertAfter(td79, menu.lastElementChild);

let td80 = document.createElement('td');
td80.innerHTML = zombie3[1];
td80.setAttribute("class","generic column")
insertAfter(td80, menu.lastElementChild);

let td81 = document.createElement('td');
td81.innerHTML = zombie4[1];
td81.setAttribute("class","generic column")
insertAfter(td81, menu.lastElementChild);

let td82 = document.createElement('td');
td82.innerHTML = zombie5[1];
td82.setAttribute("class","generic column")
insertAfter(td82, menu.lastElementChild);

let td83 = document.createElement('td');
td83.innerHTML = zombie6[1];
td83.setAttribute("class","generic column")
insertAfter(td83, menu.lastElementChild);

let td86 = document.createElement('td');
td86.innerHTML = rem75[1];
td86.setAttribute("class","generic column")
insertAfter(td86, menu.lastElementChild);

let td87 = document.createElement('td');
td87.innerHTML = rem80[1];
td87.setAttribute("class","generic column")
insertAfter(td87, menu.lastElementChild);

let td88 = document.createElement('td');
td88.innerHTML = rem85[1];
td88.setAttribute("class","generic column")
insertAfter(td88, menu.lastElementChild);

let td89 = document.createElement('td');
td89.innerHTML = rem90[1];
td89.setAttribute("class","generic column");
insertAfter(td89, menu.lastElementChild);

let td85 = document.createElement('td');
td85.innerHTML = endurance[1];
td85.setAttribute("class","premium column")
insertAfter(td85, menu.lastElementChild);

let td75 = document.createElement('td');
td75.innerHTML = alsayic[1];
td75.setAttribute("class","premium column")
insertAfter(td75, menu.lastElementChild);

let td76 = document.createElement('td');
td76.innerHTML = sosa[1];
td76.setAttribute("class","premium column")
insertAfter(td76, menu.lastElementChild);

let td77 = document.createElement('td');
td77.innerHTML = pumpkin[1];
td77.setAttribute("class","premium column")
insertAfter(td77, menu.lastElementChild);

let tdprem1 = document.createElement('td');
tdprem1.innerHTML = dose[1];
tdprem1.setAttribute("class","premium column")
insertAfter(tdprem1, menu.lastElementChild);

let tdprem10 = document.createElement('td');
tdprem10.innerHTML = mushroom[1];
tdprem10.setAttribute("class","premium column")
insertAfter(tdprem10, menu.lastElementChild);

let tdprem2 = document.createElement('td');
tdprem2.innerHTML = slaughter[1];
tdprem2.setAttribute("class","premium column")
insertAfter(tdprem2, menu.lastElementChild);

let tdprem3 = document.createElement('td');
tdprem3.innerHTML = burning[1];
tdprem3.setAttribute("class","premium column")
insertAfter(tdprem3, menu.lastElementChild);

let tdprem4 = document.createElement('td');
tdprem4.innerHTML = conjured[1];
tdprem4.setAttribute("class","premium column")
insertAfter(tdprem4, menu.lastElementChild);

let tdprem5 = document.createElement('td');
tdprem5.innerHTML = flaming[1];
tdprem5.setAttribute("class","premium column")
insertAfter(tdprem5, menu.lastElementChild);

let tdprem6 = document.createElement('td');
tdprem6.innerHTML = forbidden[1];
tdprem6.setAttribute("class","premium column")
insertAfter(tdprem6, menu.lastElementChild);

let tdprem7 = document.createElement('td');
tdprem7.innerHTML = nova[1];
tdprem7.setAttribute("class","premium column")
insertAfter(tdprem7, menu.lastElementChild);

let tdprem8 = document.createElement('td');
tdprem8.innerHTML = juicebox[1];
tdprem8.setAttribute("class","premium column")
insertAfter(tdprem8, menu.lastElementChild);

let tdprem9 = document.createElement('td');
tdprem9.innerHTML = push[1];
tdprem9.setAttribute("class","premium column")
insertAfter(tdprem9, menu.lastElementChild);

let td84 = document.createElement('td');
td84.innerHTML = daddy[1];
td84.setAttribute("class","rare column")
insertAfter(td84, menu.lastElementChild);

let rarepot1 = document.createElement('td');
rarepot1.innerHTML = whiskey[1];
rarepot1.setAttribute("class","rare column")
insertAfter(rarepot1, menu.lastElementChild);

let rarepot2 = document.createElement('td');
rarepot2.innerHTML = sauce[1];
rarepot2.setAttribute("class","rare column")
insertAfter(rarepot2, menu.lastElementChild);

let rarepot3 = document.createElement('td');
rarepot3.innerHTML = scream[1];
rarepot3.setAttribute("class","rare column")
insertAfter(rarepot3, menu.lastElementChild);

let rarepot4 = document.createElement('td');
rarepot4.innerHTML = griznix[1];
rarepot4.setAttribute("class","rare column")
insertAfter(rarepot4, menu.lastElementChild);

let rarepot5 = document.createElement('td');
rarepot5.innerHTML = marsh[1];
rarepot5.setAttribute("class","rare column")
insertAfter(rarepot5, menu.lastElementChild);

let rarepot6 = document.createElement('td');
rarepot6.innerHTML = reikavon[1];
rarepot6.setAttribute("class","rare column")
insertAfter(rarepot6, menu.lastElementChild);

let rarepot7 = document.createElement('td');
rarepot7.innerHTML = zhulpot[1];
rarepot7.setAttribute("class","rare column")
insertAfter(rarepot7, menu.lastElementChild);

let rarepot8 = document.createElement('td');
rarepot8.innerHTML = arcshot[1];
rarepot8.setAttribute("class","rare column")
insertAfter(rarepot8, menu.lastElementChild);

let rarepot9 = document.createElement('td');
rarepot9.innerHTML = eleshot[1];
rarepot9.setAttribute("class","rare column")
insertAfter(rarepot9, menu.lastElementChild);

let rarepot10 = document.createElement('td');
rarepot10.innerHTML = fireshot[1];
rarepot10.setAttribute("class","rare column")
insertAfter(rarepot10, menu.lastElementChild);

let rarepot11 = document.createElement('td');
rarepot11.innerHTML = holyshot[1];
rarepot11.setAttribute("class","rare column")
insertAfter(rarepot11, menu.lastElementChild);

let rarepot12 = document.createElement('td');
rarepot12.innerHTML = kinshot[1];
rarepot12.setAttribute("class","rare column")
insertAfter(rarepot12, menu.lastElementChild);

let rarepot13 = document.createElement('td');
rarepot13.innerHTML = shadshot[1];
rarepot13.setAttribute("class","rare column")
insertAfter(rarepot13, menu.lastElementChild);

let rarepot14 = document.createElement('td');
rarepot14.innerHTML = kinpot[1];
rarepot14.setAttribute("class","rare column")
insertAfter(rarepot14, menu.lastElementChild);

let rarepot15 = document.createElement('td');
rarepot15.innerHTML = insanity[1];
rarepot15.setAttribute("class","rare column")
insertAfter(rarepot15, menu.lastElementChild);

let rarepot16 = document.createElement('td');
rarepot16.innerHTML = madness[1];
rarepot16.setAttribute("class","rare column")
insertAfter(rarepot16, menu.lastElementChild);

let rarepot17 = document.createElement('td');
rarepot17.innerHTML = komb[1];
rarepot17.setAttribute("class","rare column")
insertAfter(rarepot17, menu.lastElementChild);

let rarepot18 = document.createElement('td');
rarepot18.innerHTML = quantum[1];
rarepot18.setAttribute("class","rare column")
insertAfter(rarepot18, menu.lastElementChild);

let miscpot1 = document.createElement('td');
miscpot1.innerHTML = brut[1];
miscpot1.setAttribute("class","misc column")
insertAfter(miscpot1, menu.lastElementChild);

let miscpot2 = document.createElement('td');
miscpot2.innerHTML = strengthpot[1];
miscpot2.setAttribute("class","misc column")
insertAfter(miscpot2, menu.lastElementChild);

let miscpot3 = document.createElement('td');
miscpot3.innerHTML = hastepot[1];
miscpot3.setAttribute("class","misc column")
insertAfter(miscpot3, menu.lastElementChild);

let miscpot4 = document.createElement('td');
miscpot4.innerHTML = ragepot1[1];
miscpot4.setAttribute("class","misc column")
insertAfter(miscpot4, menu.lastElementChild);

let miscpot5 = document.createElement('td');
miscpot5.innerHTML = ragepot2[1];
miscpot5.setAttribute("class","misc column")
insertAfter(miscpot5, menu.lastElementChild);

let miscpot6 = document.createElement('td');
miscpot6.innerHTML = ragepot3[1];
miscpot6.setAttribute("class","misc column")
insertAfter(miscpot6, menu.lastElementChild);

let miscpot7 = document.createElement('td');
miscpot7.innerHTML = ragepot4[1];
miscpot7.setAttribute("class","misc column")
insertAfter(miscpot7, menu.lastElementChild);

let miscpot8 = document.createElement('td');
miscpot8.innerHTML = spark[1];
miscpot8.setAttribute("class","misc column")
insertAfter(miscpot8, menu.lastElementChild);

let miscpot9 = document.createElement('td');
miscpot9.innerHTML = fury[1];
miscpot9.setAttribute("class","misc column")
insertAfter(miscpot9, menu.lastElementChild);

let miscpot10 = document.createElement('td');
miscpot10.innerHTML = questexppot[1];
miscpot10.setAttribute("class","misc column")
insertAfter(miscpot10, menu.lastElementChild);

let td_collection1 = document.createElement('td');
td_collection1.innerHTML = anjou+"%";
td_collection1.setAttribute("class","collections column");
insertAfter(td_collection1, menu.lastElementChild);

let td_collection2 = document.createElement('td');
td_collection2.innerHTML = reikar+"%";
td_collection2.setAttribute("class","collections column");
insertAfter(td_collection2, menu.lastElementChild);

let td_collection3 = document.createElement('td');
td_collection3.innerHTML = lorren+"%";
td_collection3.setAttribute("class","collections column");
insertAfter(td_collection3, menu.lastElementChild);

let td_collection4 = document.createElement('td');
td_collection4.innerHTML = lucile+"%";
td_collection4.setAttribute("class","collections column");
insertAfter(td_collection4, menu.lastElementChild);

let td_collection5 = document.createElement('td');
td_collection5.innerHTML = weima+"%";
td_collection5.setAttribute("class","collections column");
insertAfter(td_collection5, menu.lastElementChild);

let td_collection6 = document.createElement('td');
td_collection6.innerHTML = souma+"%";
td_collection6.setAttribute("class","collections column");
insertAfter(td_collection6, menu.lastElementChild);

let td_collection7 = document.createElement('td');
td_collection7.innerHTML = vanisha+"%";
td_collection7.setAttribute("class","collections column");
insertAfter(td_collection7, menu.lastElementChild);

let td_collection8 = document.createElement('td');
td_collection8.innerHTML = drolba+"%";
td_collection8.setAttribute("class","collections column");
insertAfter(td_collection8, menu.lastElementChild);

let td_collection9 = document.createElement('td');
td_collection9.innerHTML = quibel+"%";
td_collection9.setAttribute("class","collections column");
insertAfter(td_collection9, menu.lastElementChild);

let td_collection10 = document.createElement('td');
td_collection10.innerHTML = collections_total+"%";
td_collection10.setAttribute("class","collections column");
insertAfter(td_collection10, menu.lastElementChild);

let td_treasury_1 = document.createElement('td');
td_treasury_1.innerHTML = treastable;
td_treasury_1.setAttribute("class","treasury column");
insertAfter(td_treasury_1, menu.lastElementChild);

let td_treasury_2 = document.createElement('td');
td_treasury_2.innerHTML = `<button class='btn btn-primary'><a href="`+treasurylink+`" target="BLANK">GO TO TREASURY</a></button>`;
td_treasury_2.setAttribute("class","treasury column");
insertAfter(td_treasury_2, menu.lastElementChild);

GM_addStyle ( `
#charlists{background:#0F0F0F;position:fixed !important; left: 1px !important; bottom: 100px !important;padding:10px !important; z-index:10000 !important;}
.textbox{background:#1A1C2D !important; color:#FFFFFF !important;border:0px solid !important;font-size:14px !important;resize: none;overflow:hidden;}
`);

$("body").append ( `
<div id="charlists" class="rune column lists">
<b>Easy copy/paste to OWH...</b><br>
PRIMAL READY<br>
<textarea class="textbox" rows="1" cols="25" onclick="this.focus();this.select()" readonly="readonly">`+primalready+`</textarea><br>
RESPLENDENT READY<br>
<textarea class="textbox" rows="1" cols="25" onclick="this.focus();this.select()" readonly="readonly">`+respready+`</textarea><br>
MYSTIC READY<br>
<textarea class="textbox" rows="1" cols="25" onclick="this.focus();this.select()" readonly="readonly">`+mysticready+`</textarea>
</div>
` );

$("body").append ( `
<div id="charlists" class="skills column lists">
<b>Easy copy/paste to OWH...</b><br>
MISSING TOME<br>
<textarea class="textbox" rows="1" cols="25" onclick="this.focus();this.select()" readonly="readonly">`+notome+`</textarea>
</div>
` );

$("body").append ( `
<div id="charlists" class="gem column lists">
<b>Easy copy/paste to OWH...</b><br>
GEM UPGRADE READY<br>
<textarea class="textbox" rows="1" cols="25" onclick="this.focus();this.select()" readonly="readonly">`+oreready+`</textarea><br>
DELUGED ALIVE<br>
<textarea class="textbox" rows="1" cols="25" onclick="this.focus();this.select()" readonly="readonly">`+delready+`</textarea><br>
SEEPING ALIVE<br>
<textarea class="textbox" rows="1" cols="25" onclick="this.focus();this.select()" readonly="readonly">`+seepready+`</textarea><br>
VOLATILE ALIVE<br>
<textarea class="textbox" rows="1" cols="25" onclick="this.focus();this.select()" readonly="readonly">`+volready+`</textarea>
</div>
` );

$("body").append ( `
<div id="charlists" class="crests column lists">
<b>Easy copy/paste to OWH...</b><br>
HOVOK READY<br>
<textarea class="textbox" rows="1" cols="25" onclick="this.focus();this.select()" readonly="readonly">`+hovokready+`</textarea><br>
10+ FRAGMENTS<br>
<textarea class="textbox" rows="1" cols="25" onclick="this.focus();this.select()" readonly="readonly">`+fragready+`</textarea><br>
</div>
` );

$("body").append ( `
<div id="charlists" class="bdge column lists">
<b>Easy copy/paste to OWH...</b><br>
CORVOK ALIVE<br>
<textarea class="textbox" rows="1" cols="25" onclick="this.focus();this.select()" readonly="readonly">`+corvready+`</textarea><br>
SKITTOR ALIVE<br>
<textarea class="textbox" rows="1" cols="25" onclick="this.focus();this.select()" readonly="readonly">`+skittorready+`</textarea><br>
ROENOV ALIVE<br>
<textarea class="textbox" rows="1" cols="25" onclick="this.focus();this.select()" readonly="readonly">`+roenovready+`</textarea><br>
ERGON ALIVE<br>
<textarea class="textbox" rows="1" cols="25" onclick="this.focus();this.select()" readonly="readonly">`+defiantready+`</textarea><br>
DEFIANT ALIVE<br>
<textarea class="textbox" rows="1" cols="25" onclick="this.focus();this.select()" readonly="readonly">`+enduringready+`</textarea><br>
ENDURING ALIVE<br>
<textarea class="textbox" rows="1" cols="25" onclick="this.focus();this.select()" readonly="readonly">`+perpetualready+`</textarea><br>
PERPETUAL ALIVE<br>
<textarea class="textbox" rows="1" cols="25" onclick="this.focus();this.select()" readonly="readonly">`+ergonready+`</textarea><br>
15+ BADGE REPS<br>
<textarea class="textbox" rows="1" cols="25" onclick="this.focus();this.select()" readonly="readonly">`+badgeready+`</textarea><br>
</div>
` );

})})})})})})})})})})})})})})})})})})})})})})})})})}})}

GM_addStyle (`
#auth_response{overflow: auto;
height: 0px !important;
color:#FFFFFF !important;
padding:10px !important;
width: 100% !important;
border:0px !important;
top:0px !important;
left:0px !important;
position:fixed !important;
transition-property: all;
transition-duration: 1s;
font-size:16px !important;
font-weight:700 !important;
background: #1B2E4B !important;
z-index:0 !important;
box-shadow: 0 6px 10px 0 rgba(0,0,0,1),0 1px 18px 0 rgba(0,0,0,1),0 3px 5px -1px rgba(0,0,0,1);}
`);

$("body").append ( `
<div id="auth_response"><center>
<span id="auth_responsetxt">test</span>
</div>
`);

function sub(){
auth = GM_getValue("bauth_r")
if (auth.match("Full") != null){auth_true()}
if (auth.match("Full") == null){auth_false()}
}

function auth_true(){
document.querySelector("#auth_responsetxt").innerHTML = `<img src=https://studiomoxxi.com/moxximod/bot.png class="robot"> THANK YOU FOR SUBSCRIBING TO MOXXIMOD+`
GM_addStyle (`#auth_response{background:#008700 !important;height: 43px !important;width:100% !important;border:0px !important;left:0px !important;top:53px !important;}`);
setTimeout(function() {
GM_addStyle (`#auth_response{height: 0px !important;width:100% !important;border:0px !important;left:0px !important;top:0px !important;}`);
},4000)}

function auth_false(){
document.querySelector("#auth_responsetxt").innerHTML = `<img src=https://studiomoxxi.com/moxximod/bot.png class="robot"> THIS RGA IS NOT SUBSCRIBED TO MOXXIMOD+`
GM_addStyle (`#sliderload{display:none !important;}
#auth_response{background:#870000 !important;height: 43px !important;width:100% !important;border:0px !important;left:0px !important;top:53px !important;}`);
console.log("RGA NOT AUTHORIZED")
setTimeout(function() {
GM_addStyle (`#auth_response{height: 0px !important;width:100% !important;border:0px !important;left:0px !important;top:0px !important;}`);
},4000)}

if (document.URL.indexOf("user_preferences") != -1 && error == false) {

GM_addStyle (`
.advinput{background: #1B2E4B;border: 1px #1B2E4B SOLID;color: #FFFFFF !important;padding: 6px !important;border-radius: 6px !important;height:37px !important;margin-right:0.5rem !important;font-size:12px !important;margin-bottom:1rem !important;}
#adv{margin-top:1rem !important;}
#content > div.layout-px-spacing{background:transparent !important;box-shadow: 0px 0px 0px #000000,-0px -0px 0px #000000 !important;}
h4 {margin-bottom:1.5rem !important;margin-top:0.5rem !important;}
`)

var extra_content = `
<div class="col-12 col-md-6">
<div class="widget-content widget-content-area">
<h4>Advanced Preferences</h4>
<div class="row text-left">

<div class="col-3" style="margin-bottom:2rem !important;">
<span id="span_skillstab"></span><br  style="margin-bottom:1rem">
</div>
<div class="col-9">
<b>Skills Tooltab</b>: Adds the active skills and potions tab to most Outwar pages on the right side of the screen. Turning off will slightly improve performance.
</div>

<div class="col-3" style="margin-bottom:2rem !important;">
<span id="span_stickydrops"></span><br  style="margin-bottom:1rem">
</div>
<div class="col-9">
<b>Sticky Char Dropdown Menu</b>: When changing accounts using the character dropdown menu, outwar will stay on the same page instead of default to world.
</div>

<div class="col-3" style="margin-bottom:2rem !important;">
<span id="span_servswitch"></span><br  style="margin-bottom:1rem">
</div>
<div class="col-9">
<b>Server Switch Button</b>: Click the server switch button on the toolbar to quickly switch between Torax and Sigil. Turning off will slightly improve performance.
</div>

<div class="col-3" style="margin-bottom:2rem !important;">
<span id="span_fixhover"></span>
</div>
<div class="col-9">
<b>Fixed Hover Elements</b>: Forces all mouseover hovers on Outwar to display in the top-left corner. This prevents content from getting cut off on the sides of your screen.
</div>

<div class="col-3" style="margin-bottom:2rem !important;">
<span id="span_autotoken"></span><br  style="margin-bottom:1rem">
</div>
<div class="col-9">
<b>Auto Collect Tokens</b>: Free challenge tokens will automatically collect when available. Turning off will slightly improve performance.
</div>

<div class="col-3" style="margin-bottom:2rem !important;">
<span id="span_autoguard"></span><br  style="margin-bottom:1rem">
</div>
<div class="col-9">
<b>Auto On Guard</b>: On Guard will cast automatically when charged if not already cast. Turning off will slightly improve performance.
</div>

<div class="col-3" style="margin-bottom:2rem !important;">
<span id="span_ftmenu"></span><br  style="margin-bottom:1rem">
</div>
<div class="col-9">
<b>Fast Travel Menu</b>: Turning off will hide the fast travel trigger link from the left-hand menu. Turning on will return the menu option.
</div>

</div>
`

var walldiv_content = `
<div class="col-12 col-md-6">
<div class="widget-content widget-content-area">
<h4>MoxxiMod+ Custom Theme</h4>
<div class="row text-left">

<div class="col-6">
Outwar Wallpaper
</div>
<div class="col-6">
<input type="text" placeholder="IMAGE URL" id="wallurl" name="wallurl" class="advinput" size="38">
</div>

<div class="col-6">
Menu Colors
</div>
<div class="col-3">
<input type="text" placeholder="#background" id="menucolor" name="menucolor" class="advinput" size="14">
</div>
<div class="col-3">
<input type="text" placeholder="#text" id="menutext" name="menutext" class="advinput" size="14">
</div>

<div class="col-6">
Link Color
</div>
<div class="col-3">
<input type="text" placeholder="#color" id="linkcolor" name="linkcolor" class="advinput" size="14">
</div>
<div class="col-3">
<input type="text" placeholder="#hover" id="linkhover" name="linkhover" class="advinput" size="14">
</div>

<div class="col-6">
Toolbar Background Color
</div>
<div class="col-6">
<input type="text" placeholder="#" id="toolcolor" name="toolcolor" class="advinput" size="38">
</div>

<div class="col-6">
Content Background Color
</div>
<div class="col-6">
<input type="text" placeholder="#" id="contentcolor" name="contentcolor" class="advinput" size="38">
</div>

<div class="col-6">
Table Background Color
</div>
<div class="col-6">
<input type="text" placeholder="#" id="tablecolor" name="tablecolor" class="advinput" size="38">
</div>

<div class="col-6">
Scrollbar Colors
</div>
<div class="col-3">
<input type="text" placeholder="#slider" id="slidecolor" name="slidecolor" class="advinput" size="14">
</div>
<div class="col-3">
<input type="text" placeholder="#track" id="trackcolor" name="trackcolor" class="advinput" size="14">
</div>

<div class="col-6">
Text Color
</div>
<div class="col-6">
<input type="text" placeholder="#" id="textcolor" name="textcolor" class="advinput" size="38">
</div>

<div class="col-6">
Text Box Color
</div>
<div class="col-6">
<input type="text" placeholder="#" id="boxcolor" name="boxcolor" class="advinput" size="38">
</div>

</div>
<h4>MoxxiMod+ Custom Features</h4>
<div class="row text-left">
<div class="col-6">
Fast Travel Destination
</div>
<div class="col-3">
<input type="text" placeholder="name" maxlength="11" id="input_mydestinationname" name="boxcolor" class="advinput" size="14">
</div>
<div class="col-3">
<input type="text" placeholder="room #" id="input_mydestination" name="boxcolor" class="advinput" size="14">
</div>

</div>
All color changes must use 6-digit <a href="https://www.color-hex.com/" target="BLANK">hex color</a><p>
<button id='adv_default' class='btn btn-primary mt-3'>DEFAULT <img src="https://studiomoxxi.com/moxximod/bot.png" class="robot" onmouseover="popup(event,'<b><font color=#f441be>MoxxiMod+</font></b><br>Revert advanced preferences to default settings')" onmouseout="kill()"></button>
<button id='adv' class='btn btn-primary mt-3'>UPDATE <img src="https://studiomoxxi.com/moxximod/bot.png" class="robot" onmouseover="popup(event,'<b><font color=#f441be>MoxxiMod+</font></b><br>Advanced preferences will apply to all characters with a MoxxiMod+ subscription')" onmouseout="kill()"></button>
`

var preferences = document.querySelector("#content-header-row")

let wadddiv = document.createElement('div');
wadddiv.innerHTML = extra_content

wadddiv.setAttribute("style","margin-top:1rem !important;")
insertAfter(wadddiv, preferences.lastElementChild);

let walldiv = document.createElement('div');
walldiv.innerHTML = walldiv_content

walldiv.setAttribute("style","margin-top:1rem !important;")
insertAfter(walldiv, preferences.lastElementChild);

if (GM_getValue("ftmenu") == false || GM_getValue("ftmenu") == undefined){document.querySelector("#span_ftmenu").innerHTML = `<button id='extra_ftmenu' class='btn btn-primary mt-3'>TURN ON</button>`}
if (GM_getValue("ftmenu") == true){document.querySelector("#span_ftmenu").innerHTML = `<button id='extra_ftmenu' class='btn btn-primary mt-3'>TURN OFF</button>`}
document.querySelector("#extra_ftmenu").addEventListener("click", extra_ftmenu, false);
function extra_ftmenu(){
if (GM_getValue("ftmenu") == true){GM_setValue("ftmenu", false); return}
if (GM_getValue("ftmenu") == false || GM_getValue("ftmenu") == undefined){GM_setValue("ftmenu", true); return}}

if (GM_getValue("skillstab") == false || GM_getValue("skillstab") == undefined){document.querySelector("#span_skillstab").innerHTML = `<button id='extra_skillstab' class='btn btn-primary mt-3'>TURN ON</button>`}
if (GM_getValue("skillstab") == true){document.querySelector("#span_skillstab").innerHTML = `<button id='extra_skillstab' class='btn btn-primary mt-3'>TURN OFF</button>`}
document.querySelector("#extra_skillstab").addEventListener("click", extra_skillstab, false);
function extra_skillstab(){
if (GM_getValue("skillstab") == true){GM_setValue("skillstab", false); return}
if (GM_getValue("skillstab") == false || GM_getValue("skillstab") == undefined){GM_setValue("skillstab", true); return}}

if (GM_getValue("stickydrops") == false || GM_getValue("stickydrops") == undefined){document.querySelector("#span_stickydrops").innerHTML = `<button id='extra_stickydrops' class='btn btn-primary mt-3'>TURN ON</button>`}
if (GM_getValue("stickydrops") == true){document.querySelector("#span_stickydrops").innerHTML = `<button id='extra_stickydrops' class='btn btn-primary mt-3'>TURN OFF</button>`}
document.querySelector("#extra_stickydrops").addEventListener("click", extra_stickydrops, false);
function extra_stickydrops(){
if (GM_getValue("stickydrops") == true){GM_setValue("stickydrops", false); return}
if (GM_getValue("stickydrops") == false || GM_getValue("stickydrops") == undefined){GM_setValue("stickydrops", true); return}}

if (GM_getValue("servswitch") == false || GM_getValue("servswitch") == undefined){document.querySelector("#span_servswitch").innerHTML = `<button id='extra_servswitch' class='btn btn-primary mt-3'>TURN ON</button>`}
if (GM_getValue("servswitch") == true){document.querySelector("#span_servswitch").innerHTML = `<button id='extra_servswitch' class='btn btn-primary mt-3'>TURN OFF</button>`}
document.querySelector("#extra_servswitch").addEventListener("click", extra_servswitch, false);
function extra_servswitch(){
if (GM_getValue("servswitch") == true){GM_setValue("servswitch", false); return}
if (GM_getValue("servswitch") == false || GM_getValue("servswitch") == undefined){GM_setValue("servswitch", true); return}}

if (GM_getValue("fixhover") == false || GM_getValue("fixhover") == undefined){document.querySelector("#span_fixhover").innerHTML = `<button id='extra_fixhover' class='btn btn-primary mt-3'>TURN ON</button>`}
if (GM_getValue("fixhover") == true){document.querySelector("#span_fixhover").innerHTML = `<button id='extra_fixhover' class='btn btn-primary mt-3'>TURN OFF</button>`}
document.querySelector("#extra_fixhover").addEventListener("click", extra_fixhover, false);
function extra_fixhover(){
if (GM_getValue("fixhover") == true){GM_setValue("fixhover", false); return}
if (GM_getValue("fixhover") == false || GM_getValue("fixhover") == undefined){GM_setValue("fixhover", true); return}}

if (GM_getValue("autotoken") == false || GM_getValue("autotoken") == undefined){document.querySelector("#span_autotoken").innerHTML = `<button id='extra_autotoken' class='btn btn-primary mt-3'>TURN ON</button>`}
if (GM_getValue("autotoken") == true){document.querySelector("#span_autotoken").innerHTML = `<button id='extra_autotoken' class='btn btn-primary mt-3'>TURN OFF</button>`}
document.querySelector("#extra_autotoken").addEventListener("click", extra_autotoken, false);
function extra_autotoken(){
if (GM_getValue("autotoken") == true){GM_setValue("autotoken", false); return}
if (GM_getValue("autotoken") == false || GM_getValue("autotoken") == undefined){GM_setValue("autotoken", true); return}}

if (GM_getValue("autoguard") == false || GM_getValue("autoguard") == undefined){document.querySelector("#span_autoguard").innerHTML = `<button id='extra_autoguard' class='btn btn-primary mt-3'>TURN ON</button>`}
if (GM_getValue("autoguard") == true){document.querySelector("#span_autoguard").innerHTML = `<button id='extra_autoguard' class='btn btn-primary mt-3'>TURN OFF</button>`}
document.querySelector("#extra_autoguard").addEventListener("click", extra_autoguard, false);
function extra_autoguard(){
if (GM_getValue("autoguard") == true){GM_setValue("autoguard", false); return}
if (GM_getValue("autoguard") == false || GM_getValue("autoguard") == undefined){GM_setValue("autoguard", true); return}}

document.getElementById ("adv_default").addEventListener("click", adv_default, false);
function adv_default(){
if (GM_getValue("bauth_r").match("Full") != null){
GM.deleteValue("wallpaper")
GM.deleteValue("hex_menu")
GM.deleteValue("hex_tool")
GM.deleteValue("hex_content")
GM.deleteValue("hex_table")
GM.deleteValue("hex_track")
GM.deleteValue("hex_slide")
GM.deleteValue("hex_text")
GM.deleteValue("hex_menutext")
GM.deleteValue("hex_link")
GM.deleteValue("hex_linkhover")
GM.deleteValue("hex_box")
GM.deleteValue("mydestination")
GM.deleteValue("mydestinationname")
window.location.href = "user_preferences"
}}

var send_custom = '';
document.getElementById ("adv").addEventListener("click", adv, false);
function adv(){
if (GM_getValue("bauth_r").match("Full") != null){
send_custom = `
wallurl|`+document.querySelector("#wallurl").value+`|
menucolor|`+document.querySelector("#menucolor").value+`|
toolcolor|`+document.querySelector("#toolcolor").value+`|
contentcolor|`+document.querySelector("#contentcolor").value+`|
tablecolor|`+document.querySelector("#tablecolor").value+`|
trackcolor|`+document.querySelector("#trackcolor").value+`|
slidecolor|`+document.querySelector("#slidecolor").value+`|
textcolor|`+document.querySelector("#textcolor").value+`|
menutext|`+document.querySelector("#menutext").value+`|
linkcolor|`+document.querySelector("#linkcolor").value+`|
linkhover|`+document.querySelector("#linkhover").value+`|
boxcolor|`+document.querySelector("#boxcolor").value+`|
input_mydestination|`+document.querySelector("#input_mydestination").value+`|
input_mydestinationname|`+document.querySelector("#input_mydestinationname").value+`|`
task14()
}}

sub()}

if (document.URL.indexOf("home") == -1) {
if (document.URL.indexOf("mob") == -1) {
if (document.URL.indexOf("raidattack") == -1) {
if (document.URL.indexOf("closedpvp") == -1) {
if (document.URL.indexOf("treasury.php?type=vision") == -1) {
if (document.URL.indexOf("cast_skills") == -1) {

if (GM_getValue("skillstab") == true){

GM_addStyle ( `
#tooltab{position:fixed !important;right:7px !important;top: 50px !important;width:103px !important;}
#tooltab > center > img{margin:2px !important;width:25px !important; height:25px !important;}
`);

fetch("cast_skills")
    .then(res => res.text())
    .then((responseText) => {
    const doc = new DOMParser().parseFromString(responseText, 'text/html');
    const skillsdiv = doc.querySelector("#basic > div.widget-content.widget-content-area > div:nth-child(1) > div:nth-child(1) > div > div").innerHTML
    $("body").append (`<div id="tooltab" class="widget widget-chart-one mb-3 tiles"><center><a href=cast_skills>SKILLS</a><br>`+skillsdiv+`</div>`);})

}
}}}}}}

GM_addStyle (`#auto {background:#191B2B;position:fixed !important; left: 200px !important; top: 60px !important;padding:10px !important; z-index:10000 !important;color:#FFFFFF;box-shadow: 0 6px 10px 0 rgba(0,0,0,.14),0 1px 18px 0 rgba(0,0,0,.12),0 3px 5px -1px rgba(0,0,0,.2);}}`);

if (GM_getValue("autotoken") == true){

setTimeout(function() {
fetch("ajax/challenge_claim.php")
   .then(response => response.text())
   .then((response) => {
   if (response.match("You have been awarded 3 challenge tokens") != null){
       $("body").append (`<div id="auto">TOKENS COLLECTED</div>`);
       setTimeout(function() {GM_addStyle (`#auto{display:none !important;}`);},5000);}
})},4000);
}

if (GM_getValue("autoguard") == true){

setTimeout(function() {
fetch('cast_skills.php', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  body: new URLSearchParams({
    'castskillid': '7',
    'cast': 'Cast Skill'
  })
}).then(res => res.text())
  .then(res => {
    if (res.match("You just cast On Guard") != null) {
        $("body").append (`<div id="auto">ON GUARD CAST</div>`);
        setTimeout(function() {GM_addStyle (`#auto{display:none !important;}`);},5000);
}});},5000);
}

var toolbar = document.querySelector("body > center > div.sub-header-container > header > ul.navbar-nav.flex-row.mr-auto.toolbar-nav")

var ppcrown = document.querySelector("body > center > div.sub-header-container").innerHTML
if (ppcrown.match(/PP\.png/i) != null){

GM_addStyle (`#dropdown{-webkit-box-shadow:0px 0px 5px 3px rgba(209,156,32,0.75) !important;
-moz-box-shadow: 0px 0px 5px 3px rgba(209,156,32,0.75) !important;
box-shadow: 0px 0px 5px 3px rgba(209,156,32,0.75); !important}`);}

if (GM_getValue("servswitch") == true){

let toolbar_servers = document.createElement('li');
toolbar_servers.innerHTML = `
<p class="top-rage"><span class="toolbar_rage"><a href="javascript:void(0);" id="server_switch">SWITCH SERVERS</a></span></p>`
toolbar_servers.setAttribute("class","nav-item more-dropdown little-space hide-on-mob")
insertAfter(toolbar_servers, toolbar.lastElementChild);

document.querySelector("#server_switch").addEventListener("click", server_switch, false);
function server_switch (divid) {
var server_id = ''; if (window.location.href.replace("https://","").replace(/\.outwar\.com.*/i,"") == "sigil"){server_id = 2} if (window.location.href.replace("https://","").replace(/\.outwar\.com.*/i,"") == "torax"){server_id = 1}
fetch("myaccount.php?ac_serverid="+server_id)
    .then(res => res.text())
    .then((responseText) => {
    const doc = new DOMParser().parseFromString(responseText, 'text/html');
    const char1 = doc.querySelector("#zero-config > tbody > tr:nth-child(1) > td:nth-child(2) > a").outerHTML.match(/href="([^"]*)"/i)[1].toString().replace("amp;","")
    window.location.href=char1})}
}

if (GM_getValue("bauth_r") != undefined){
if (GM_getValue("bauth_r").match("Full") != null){
let toolbar_sub = document.createElement('li');
toolbar_sub.innerHTML = `<img src=https://studiomoxxi.com/moxximod/logo_plus.png onmouseover="statspopup(event,'<b><font color=#f441be>MoxxiMod+</font></b>')" onmouseout="kill()">`
toolbar_sub.setAttribute("class","nav-item more-dropdown little-space hide-on-mob")
insertAfter(toolbar_sub, toolbar.children[3]);
}}

function locker_button (divid) {
fetch("ajax/backpackcontents.php?tab=key")
   .then(response => response.text())
   .then((response) => {
    var key = response.match(/data-name="Veiled Teleporter".*data-iid="([0-9]+)"/i)
    if (key == null) {alert("you do not have the item required")}
fetch('ajax/backpack_action.php', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  body: new URLSearchParams({
    'action': 'activate',
    'itemids[]': key[1]
  })})
  .then(res => res.text())
  .then(res => {
    if (res.match("activated!") != null) {window.location.href="world"}
  });})}

function veldara_button (divid) {
fetch("ajax/backpackcontents.php?tab=key")
   .then(response => response.text())
   .then((response) => {
    var key = response.match(/data-name="Veldara Teleporter".*data-iid="([0-9]+)"/i)
    if (key == null) {alert("you do not have the item required")}
fetch('ajax/backpack_action.php', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  body: new URLSearchParams({
    'action': 'activate',
    'itemids[]': key[1]
  })})
  .then(res => res.text())
  .then(res => {
    if (res.match("activated!") != null) {window.location.href="world"}
  });})}

function kix_button (divid) {
fetch("ajax/backpackcontents.php?tab=key")
   .then(response => response.text())
   .then((response) => {
    var key = response.match(/data-name="Radiation Meter".*data-iid="([0-9]+)"/i)
    if (key == null) {alert("you do not have the item required")}
fetch('ajax/backpack_action.php', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  body: new URLSearchParams({
    'action': 'activate',
    'itemids[]': key[1]
  })})
  .then(res => res.text())
  .then(res => {
    if (res.match("activated!") != null) {window.location.href="world"}
  });})}

function astral_button (divid) {
fetch("ajax/backpackcontents.php?tab=key")
   .then(response => response.text())
   .then((response) => {
    var key = response.match(/data-name="Astral Teleporter".*data-iid="([0-9]+)"/i)
    if (key == null) {alert("you do not have the item required")}
fetch('ajax/backpack_action.php', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  body: new URLSearchParams({
    'action': 'activate',
    'itemids[]': key[1]
  })})
  .then(res => res.text())
  .then(res => {
    if (res.match("activated!") != null) {window.location.href="world"}
  });})}

function plane_button (divid) {
fetch("ajax/backpackcontents.php?tab=key")
   .then(response => response.text())
   .then((response) => {
    var key = response.match(/data-name="Planes Teleporter".*data-iid="([0-9]+)"/i)
    if (key == null) {alert("you do not have the item required")}
fetch('ajax/backpack_action.php', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  body: new URLSearchParams({
    'action': 'activate',
    'itemids[]': key[1]
  })})
  .then(res => res.text())
  .then(res => {
    if (res.match("activated!") != null) {window.location.href="world"}
  });})}

function underground_button (divid) {
fetch("ajax/backpackcontents.php?tab=key")
   .then(response => response.text())
   .then((response) => {
    var key = response.match(/data-name="Experimental Teleporter".*data-iid="([0-9]+)"/i)
    if (key == null) {alert("you do not have the item required")}
fetch('ajax/backpack_action.php', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  body: new URLSearchParams({
    'action': 'activate',
    'itemids[]': key[1]
  })})
  .then(res => res.text())
  .then(res => {
    if (res.match("activated!") != null) {window.location.href="world"}
  });})}

GM_xmlhttpRequest ( {
    method:     'GET',
    url:        '/ajax/backpackcontents.php?tab=quest',
    onload:     function (responseDetails) {
        const ammyID = /Amulet of Achievement" data-itemqty="([0-9]*)"/g;
        const ammyRes = ammyID.exec(responseDetails.responseText);
        const badgeID = /Badge Reputation" data-itemqty="([0-9]*)"/g;
        const badgeRes = badgeID.exec(responseDetails.responseText);

fetch('ajax/challenge_status.php')
   .then(response => response.text())
   .then((response) => {
    var claimed = response.match(/tokens":"(.*)","p_tokens"/i)
    var freeTok = '';
    if (claimed[1] < 30){freeTok = claimed[1]}
    if (claimed[1] > 29){freeTok = "<font color=#e2b300>"+claimed[1]+"</font>"}
    var ammyPrint = '';
    if (ammyRes != null){ammyPrint = ammyRes[1]}
    if (ammyRes == null){ammyPrint = "0"}
    var badgePrint = '';
    if (badgeRes != null){badgePrint = badgeRes[1]}
    if (badgeRes == null){badgePrint ="0"}
    var ammyCnt = ammyPrint
    var ammy = ammyCnt;
    var badgeCnt = badgePrint
    var badge = '';
    if (badgeCnt < 15){badge = badgeCnt}
    if (badgeCnt > 14){badge = '<font color=#79e300>'+badgeCnt+'</font>'}
    var currency = '$';
    if (badgeCnt < 15){currency += "$"}
    if (badgeCnt > 14){currency += '<font color=#00CC00>$</font>'}
    if (claimed[1] < 30){currency += "$"}
    if (claimed[1] > 29){currency += "<font color=#ff0000>$</font>"}
    var goldPrint = document.body.innerHTML.match(/<tr><td><b>Gold:<\/b><\/td><td>(.*)<\/td><\/tr>/i);
    var pbPrint = document.body.innerHTML.match(/<tr><td><b>Points:<\/b><\/td><td><font size=2 color=#00FF00>(.*)<\/font><\/td><\/tr>/i);
    var prPrint = document.body.innerHTML.match(/<tr><td><b>Premium:<\/b><\/td><td><font size=2 color=#00FF00>(.*)\.<\/font>/i);
    var tkPrint = document.body.innerHTML.match(/<tr><td><b>Tokens:<\/b><\/td><td><font size=2 color=#00FF00>(.*)<\/font>/i);
    var skPrint = document.body.innerHTML.match(/<tr><td><b>Skill:<\/b><\/td><td>(.*)<\/td><\/tr>/i);

document.querySelector("body > center > div.sub-header-container > header > ul.navbar-nav.flex-row.mr-auto.toolbar-nav > li.nav-item.more-dropdown.little-space.hide-on-mob.ml-3 > a").outerHTML =
`<a href="#" onmouseover="statspopup(event,'<table><tr><td><b>Points:</b></td><td>`+pbPrint[1]+`</td></tr><tr><td><b>Premium:</b></td><td>`+prPrint[1]+`</td></tr><tr><td><b>Free Tokens:</b></td><td>`+freeTok+`</td></tr><tr><td><b>Prem Tokens:</b></td><td>`+(tkPrint[1]-claimed[1])+`</td></tr><tr><td><b>Skill Points:</b></td><td>`+skPrint[1]+`</td></tr><tr><td><b>Badge Reps:</b></td><td>`+badge+`</td></tr><tr><td><b>Amulets:</b></td><td>`+ammy+`</td></tr><tr><td><b>Gold:</b></td><td>`+goldPrint[1]+`</td></tr></table>')" onmouseout="kill()"><img border="0" src="images/toolbar/Points.png" id="currency" align="middle"></a>`

if (badgeCnt >= 15){GM_addStyle(`#currency{filter: hue-rotate(90deg) !important;}`)}
if (claimed[1] == 30){GM_addStyle(`#currency{filter: hue-rotate(65deg) !important;}`)}

})}});

var toolbar_icons = document.querySelector("body > center > div.sub-header-container > header > ul.navbar-item.flex-row.ml-auto");

let slider_icon = document.createElement('li');
slider_icon.innerHTML = `<a href="javascript:void(0);" class="nav-link dropdown-toggle" id="slider" onmouseover="statspopup(event,'<b><font color=#f441be>MoxxiMod+</font></b><br>Skills & Potions Panel')" onmouseout="kill()">
<img src="https://studiomoxxi.com/moxximod/bot.png" width="25px" height="25px" class="navbar-logo" alt="logo">
</a>`
slider_icon.setAttribute("class","nav-item dropdown notification-dropdown hide-on-mob")
toolbar_icons.insertBefore(slider_icon, toolbar_icons.firstElementChild);

let discord_icon = document.createElement('li');
discord_icon.innerHTML = `<a href="https://discord.com/invite/f35cccbWU8?utm_source=Discord%20Widget&utm_medium=Connect" target="BLANK" class="nav-link dropdown-toggle" id="notificationDropdown" onmouseover="statspopup(event,'Studio Moxxi Discord')" onmouseout="kill()">
<img src="https://studiomoxxi.com/moxximod/disicon.png" width="25px" height="25px" class="navbar-logo" alt="logo">
</a>`
discord_icon.setAttribute("class","nav-item dropdown notification-dropdown hide-on-mob")
toolbar_icons.insertBefore(discord_icon, toolbar_icons.firstElementChild);

if (document.URL.indexOf("home") != -1 && (document.URL.indexOf("crew_home") == -1 && error == false)) {

document.querySelector("#content-header-row > div.col-lg-4.col-md-4.col-sm-12.col-12.layout-spacing.layout-spacing > div.widget.widget-table-one > div.widget-heading > h6").innerHTML = `<h6>SHOUTBOX <a href="homepost">(POST)</a>`

fetch("https://greasyfork.org/en/scripts/444107-moxximod")
   .then(response => response.text())
   .then((response) => {
    var total_installs = response.match(/<span>Total installs<\/span>.*[\n\r].*><span>([0-9]+)<\/span>/i)[1]

document.querySelector("#total_installs").innerHTML = total_installs+` INSTALLATIONS`;})

var menu_left = document.querySelector("#content-header-row > div.bio.col-lg-8.col-md-8.col-sm-12.col-12.layout-spacing.layout-spacing");

function insertAfter(newNode, existingNode) {
existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);}

let div_left = document.createElement('div');
div_left.innerHTML = `<h6>PLAYER RANKINGS</h6><span id="rankings"><center><img src=https://studiomoxxi.com/moxximod/loading-gif.gif class="loader"></center></span>`
div_left.setAttribute("class","widget widget-chart-one mb-3 rankings")
insertAfter(div_left, menu_left.children[0]);

let div_rankings = document.createElement('div');
div_rankings.innerHTML = `<h6>ALERT TILES</h6><span id="tiles"><center><img src=https://studiomoxxi.com/moxximod/loading-gif.gif class="loader"></center></span>`
div_rankings.setAttribute("class","widget widget-chart-one mb-3 tiles")
insertAfter(div_rankings, menu_left.children[0]);

var menu_right = document.querySelector("#content-header-row > div.col-lg-4.col-md-4.col-sm-12.col-12.layout-spacing.layout-spacing");
let div_right = document.createElement('div');
div_right.innerHTML = `<h6>EQUIPMENT</h6><span id="eqhome"><img src=https://studiomoxxi.com/moxximod/loading-gif.gif class="loader"></span>`
div_right.setAttribute("class","widget widget-chart-one mb-3")
menu_right.insertBefore(div_right, menu_right.firstElementChild);

let div_right_top = document.createElement('div');
div_right_top.innerHTML = `<h6>THANK YOU FOR USING MOXXIMOD</h6><span id="total_installs"></span>`
div_right_top.setAttribute("class","widget widget-chart-one mb-3")
menu_right.insertBefore(div_right_top, menu_right.firstElementChild);

let div_expchart = document.createElement('div');
div_expchart.innerHTML = `<h6>OUTWAR LEVEL CHART</h6><div id="chart">LOADING</div>`
div_expchart.setAttribute("class","widget widget-chart-one mb-3 tiles")
div_expchart.setAttribute("style","margin-top: 1rem !important;")
insertAfter(div_expchart, menu_right.children[2]);

var tiles = '';

fetch("gladiator")
    .then(res => res.text())
    .then((responseText) => {
    const doc = new DOMParser().parseFromString(responseText, 'text/html');
    const zerxtable = doc.querySelector("#divGlad > div.divData.row > div:nth-child(1) > div").innerHTML
    const vorktable = doc.querySelector("#divGlad > div.divData.row > div:nth-child(2) > div").innerHTML
    if (zerxtable.match(`<h1>Will retreat in</h1>`) != null) {tiles += `<a href=gladiator?mobid=3991 onmouseover="popup(event,'Zerx is available')" onmouseout="kill()"><img src=images/mobs/mobc34.jpg class="glad"></a>`}
    if (vorktable.match(`<h1>Will retreat in</h1>`) != null) {tiles += `<a href=gladiator?mobid=4391 onmouseover="popup(event,'Vork is available')" onmouseout="kill()"><img src=images/mobs/velgladiator.jpg class="glad"></a>`}

var gods = '';
fetch("raidtools")
    .then(res => res.text())
    .then((responseText) => {
    const doc = new DOMParser().parseFromString(responseText, 'text/html');
    const godtable = doc.querySelector("#content-header-row > div > div").innerHTML
    if (godtable.match("Teleport to") != null) {gods = godtable.match(/<img height="200" width="200" src=".*" border="0"><\/a><br>[\n\r].*Teleport to .*<\/font><\/a><\/strong>/g).toString()
    .replaceAll(/<\/a><br>[\n\r]/g,"")
    .replaceAll(/border="0"><strong><a href="#" onclick="sendTeleportRequest\('[0-9]+', '[A-Za-z0-9]+'\)"><font color="#FFFFFF">Teleport to /g,`onmouseover="popup(event,'`)
    .replaceAll(`</font></a></strong>`,` has spawned')" onmouseout="kill()">`)
    .replaceAll(`height="200" width="200"`,`class="god"`)}
    tiles += gods

fetch('closedpvp')
    .then(response => response.text())
    .then((response) => {
    var brawl_active = response.match(/<h5>Brawl ends in<\/h5>/i)
    var brawl_attacks = response.match(/images\/atk_player_icon\.jpg/i)
    if (brawl_active != null && brawl_attacks != null){tiles += `<a href="closedpvp" onmouseover="popup(event,'Brawl is active')" onmouseout="kill()"><img src="https://images.emojiterra.com/google/android-pie/512px/1f94a.png" class="glad"></a>`}
    if (brawl_active != null && brawl_attacks == null){tiles += `<a href="closedpvp" onmouseover="popup(event,'Brawl is active')" onmouseout="kill()"><img src="https://images.emojiterra.com/google/android-pie/512px/1f94a.png" style="filter:grayscale(100%)" class="glad"></a>`}

fetch('/crew_bossspawns')
   .then(response => response.text())
   .then((response) => {
    var cosmos = '';
    if (response.match(/images\/CosmosGreatAllBeing\.jpg/i) != null){cosmos = response.match(/Cosmos, Great All Being.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*p class="card-user_occupation"> (.*)[\n\r].*(<a href="boss_stats\.php\?spawnid=[0-9]+">)\(stats\)<\/a>/i)}
    if (response.match(/images\/CosmosGreatAllBeing\.jpg/i) != null){tiles += cosmos[2]+`<img src="images/CosmosGreatAllBeing.jpg" class="boss" onmouseover="popup(event,'<b>Cosmos, Great All Being</b><br>Health: `+cosmos[1]+`<br><font color=#fcfcfc>(click for stats)')" onmouseout="kill()"></a>`}
    var death = '';
    if (response.match(/images\/DeathReaperOfSouls\.jpg/i) != null){death = response.match(/Death, Reaper of Souls.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*p class="card-user_occupation"> (.*)[\n\r].*(<a href="boss_stats\.php\?spawnid=[0-9]+">)\(stats\)<\/a>/i)}
    if (response.match(/images\/DeathReaperOfSouls\.jpg/i) != null){tiles += death[2]+`<img src="images/DeathReaperOfSouls.jpg" class="boss" onmouseover="popup(event,'<b>Death, Reaper of Souls</b><br>Health: `+death[1]+`<br><font color=#fcfcfc>(click for stats)')" onmouseout="kill()"></a>`}
    var maekrix = '';
    if (response.match(/images\/MaekrixDreadedStriker\.jpg/i) != null){maekrix = response.match(/Maekrix, Dreaded Striker.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*p class="card-user_occupation"> (.*)[\n\r].*(<a href="boss_stats\.php\?spawnid=[0-9]+">)\(stats\)<\/a>/i)}
    if (response.match(/images\/MaekrixDreadedStriker\.jpg/i) != null){tiles += maekrix[2]+`<img src="images/MaekrixDreadedStriker.jpg" class="boss" onmouseover="popup(event,'<b>Maekrix, Dreaded Striker</b><br>Health: `+maekrix[1]+`<br><font color=#fcfcfc>(click for stats)')" onmouseout="kill()"></a>`}
    var blackhand = '';
    if (response.match(/images\/BlackhandReborn\.png/i) != null){blackhand = response.match(/Blackhand Reborn.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*p class="card-user_occupation"> (.*)[\n\r].*(<a href="boss_stats\.php\?spawnid=[0-9]+">)\(stats\)<\/a>/i)}
    if (response.match(/images\/BlackhandReborn\.png/i) != null){tiles += blackhand[2]+`<img src="images/BlackhandReborn.png" class="boss" onmouseover="popup(event,'<b>Blackhand Reborn</b><br>Health: `+blackhand[1]+`<br><font color=#fcfcfc>(click for stats)')" onmouseout="kill()"></a>`}
    var zyrak = '';
    if (response.match(/images\/velserverboss\.jpg/i) != null){zyrak = response.match(/Zyrak, Vision of Madness.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*p class="card-user_occupation"> (.*)[\n\r].*(<a href="boss_stats\.php\?spawnid=[0-9]+">)\(stats\)<\/a>/i)}
    if (response.match(/images\/velserverboss\.jpg/i) != null){tiles += zyrak[2]+`<img src="images/velserverboss.jpg" class="boss" onmouseover="popup(event,'<b>Zyrak, Vision of Madness</b><br>Health: `+zyrak[1]+`<br><font color=#fcfcfc>(click for stats)')" onmouseout="kill()"></a>`}
    var arkon = '';
    if (response.match(/images\/Arkron\.jpg/i) != null){arkon = response.match(/Arkron, God of Trials.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*p class="card-user_occupation"> (.*)[\n\r].*(<a href="boss_stats\.php\?spawnid=[0-9]+">)\(stats\)<\/a>/i)}
    if (response.match(/images\/Arkron\.jpg/i) != null){tiles += arkon[2]+`<img src="images/Arkron.jpg" class="boss" onmouseover="popup(event,'<b>Arkron, God of Trials</b><br>Health: `+arkon[1]+`<br><font color=#fcfcfc>(click for stats)')" onmouseout="kill()"></a>`}

fetch('supplies')
    .then(response => response.text())
    .then((response) => {
    var supplies = parseInt(response.match(/<img border="0" src="images\/suppliestriangle\.gif" width="11" height="11">[\n\r](.*)%<\/td>/i)[1]);
    if (supplies < 100) {tiles += `<a href=supplies onmouseover="popup(event,'Supplies: `+supplies+`%')" onmouseout="kill()"><img src=https://studiomoxxi.com/moxximod/supplies.png class="char"></a>`}

var strength = parseInt(document.querySelector("body > center > div.sub-header-container > header > ul.navbar-nav.flex-row.mr-auto.toolbar-nav > li.nav-item.more-dropdown.little-space.hide-on-mob.progress-top > div").innerHTML.match(/style="width: ([0-9]+)%" data-original-title/i)[1])
if (strength < 100) {tiles += `<a onmouseover="popup(event,'Strength: `+strength+`%')" onmouseout="kill()"><img src=https://studiomoxxi.com/moxximod/strength.png class="char"></a>`}

var veiledkeyid = '';
var veiledmob = 'dead';
fetch("ajax/backpackcontents.php?tab=key")
   .then(response => response.text())
   .then((response) => {
    if (response.match(/data-name="Veiled Teleporter".*data-iid="([0-9]+)"/i) != null){veiledkeyid = response.match(/data-name="Veiled Teleporter".*data-iid="([0-9]+)"/i)[1]}
fetch("mob_search.php?target=5301")
   .then(response => response.text())
   .then((response) => {
    if (response.match(/Quest help activated!/i) != null) {veiledmob = "alive"}
    if (veiledmob == "alive" && veiledkeyid != "") {tiles += `<a href="javascript:void(0);" id='vbutton'><img class="mob" src="images/mobs/veiledguard.png" onmouseover="popup(event,'<b>Veiled Guard is available!<br></b>(click to teleport)')" onmouseout="kill()"></a>`}

fetch("world_questHelper")
   .then(response => response.text())
   .then((response) => {
    if (response.match("Quantum Crest of Class") != null || response.match("Explosive Crest of Ferocity") != null || response.match("Violent Crest of Preservation") != null || response.match("Onslaught Crest of Affliction") != null)
    {var crests = "active"}
    if (response.match("Seeping Chaos Golem") != null)
    {var seepingquest = "active"}
    if (response.match("Volatile Chaos Golem") != null)
    {var volatilequest = "active"}
    if (response.match("Deluged Chaos Golem") != null)
    {var delugedquest = "active"}
    if (response.match("Normok Reputation 2") != null)
    {var normok2 = "avtive"}

fetch("mob_search.php?target=4046")
    .then(response => response.text())
    .then((response) => {
    if (response.match(/Quest help activated!/i) != null) {var hovok = "alive"}
    if (hovok == "alive" && crests == "active") {tiles += `<img class="mob" src="images/mobs/mobm91.jpg" onmouseover="popup(event,'<b>Hovok the Archfiend is available!')" onmouseout="kill()">`}

fetch("mob_search.php?target=4380")
    .then(response => response.text())
    .then((response) => {
    if (response.match(/Quest help activated!/i) != null) {var deluged = "alive"}
    if (deluged == "alive" && delugedquest == "active") {tiles += `<a href="world" onclick="getQuestHelpData2('2093', '4380', '', '9812', '21862');"><img class="mob" src="images/mobs/chaosgolem2.jpg" onmouseover="popup(event,'<b>Deluged Chaos Golem is available!<br></b>(click to build a path)')" onmouseout="kill()">`}

fetch("mob_search.php?target=4379")
   .then(response => response.text())
   .then((response) => {
    if (response.match(/Quest help activated!/i) != null) {var seeping = "alive"}
    if (seeping == "alive" && seepingquest == "active") {tiles += `<a href="world" onclick="getQuestHelpData2('2092', '4379', '', '9810', '21852');"><img class="mob" src="images/mobs/chaosgolem5.jpg" onmouseover="popup(event,'<b>Seeping Chaos Golem is available!<br></b>(click to build a path)')" onmouseout="kill()"></a>`}
fetch("mob_search.php?target=4381")
   .then(response => response.text())
   .then((response) => {
    if (response.match(/Quest help activated!/i) != null) {var volatile = "alive"}
    if (volatile == "alive" && volatilequest == "active") {tiles += `<a href="world" onclick="getQuestHelpData2('2094', '4381', '', '9814', '21864');"><img class="mob" src="images/mobs/chaosgolem4.jpg" onmouseover="popup(event,'<b>Volatile Chaos Golem is available!<br></b>(click to build a path)')" onmouseout="kill()">`}
fetch("mob_search.php?target=4050")
   .then(response => response.text())
   .then((response) => {
    if (response.match(/Quest help activated!/i) != null) {var corvok = "alive"}
    if (corvok == "alive" && normok2 == "active") {tiles += `<img class="mob" src="images/mobs/mobd12.jpg" onmouseover="popup(event,'<b>Corvok the Sinister Cyborg is available!')" onmouseout="kill()">`}

var crewid = '';
var godimg = ['','',''];
var crewname = ['','',''];
fetch('/profile')
    .then(response => response.text())
    .then((response) => {
    if (response.match(/<a href="\/crew_profile\?id=[0-9]+">/i) != null) {crewid = response.match(/<a href="\/crew_profile\?id=([0-9]+)">/i)[1]}
    const doc = new DOMParser().parseFromString(response, 'text/html');
    const eq = doc.querySelector("#divProfile > div:nth-child(2) > div > div > div.col-xl-4.col-md-5 > div > div:nth-child(2) > div").innerHTML.replace(`<h5 class="card-title">EQUIPMENT</h5>`,"")

fetch('crew_raidresults.php?all_results=Display+all+raid+results&crewid='+crewid)
    .then(res => res.text())
    .then((responseText) => {
    const doc = new DOMParser().parseFromString(responseText, 'text/html');
    if (crewid != ''){var raidid = doc.querySelector("#content-header-row > table > tbody > tr > td > div > center > div > table > tbody > tr:nth-child(2) > td:nth-child(4) > a") || ''};

if (crewid != ''){
fetch("raidattack.php?raidid="+raidid.toString().match(/[0-9]+/i))
    .then(response => response.text())
    .then((response) => {
    if (crewid != '') {godimg = response.match(/<h4 class="text-center d-flex align-items-center justify-content-center">(.*)<\/h4>.*[\n\r].*[\n\r].*<div class="defenderimage skinborder d-flex justify-content-center align-items-center mb-3">.*[\n\r](.*)/i)}
    if (crewid != '') {crewname = response.match(/.*<b>(.*) has (.*)!<\/b>/i)}
    if (raidid != '') {tiles += `<a href=raidattack.php?raidid=`+raidid.toString().replace(/https:\/\/[a-zA-Z]+\.outwar\.com\/raidattack\.php\?raidid=/i,"")+` onmouseover="popup(event,'`+crewname[1]+` `+crewname[2]+` vs. `+godimg[1]+`<br>(click to view raid)')" onmouseout="kill()">`+godimg[2].replace(`<img src=`,`<img class="raid" style="filter:grayscale(100%)" src=`)+`</a>`}
})}

document.querySelector("#rankings").innerHTML = `<table><tr>
<td class="rankings">CHAR ELE DMG<div id="charele" class="ranking_div list-group-item"></div></td>
<td class="rankings">CHAR POWER<div id="charpower" class="ranking_div list-group-item"></div></td>
<td class="rankings">CHAR CHAOS<div id="charchaos" class="ranking_div list-group-item"></div></td>
</tr></table>`

GM_xmlhttpRequest ( {
    method:     'GET',
    url:        'https://torax.outwar.com/ajax/rankings.php?type=char_power',
    onload:     function (responseDetails) {
        const EQ = /\{.*/i;
        const EQprint = EQ.exec(responseDetails.responseText);
        function selectCategory(category, title, isCrew) {
            $('#rank-title').html(title);
            $('#ranks').hide();
            $('#ranks').html('');
            $('#last-updated').html('');
           $.getJSON('ajax/rankings.php?type=char_power', function(data) {
                $.each(data.results, function(key, value) {
                    var profileUrl = 'profile.php?id=' + value.id;
                    var stat = '0';
                    if(value.stat) {stat = value.stat.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    var html = '<li class="list-group-item list-group-item-action ranksulli">'
                    + '<div class="media">'
                    + '<div class="mr-3">'
                    + '<div class="rank-row top">'
                    + '<table><tr><td width=40px class=homerankings><div class="rank-row-number"><span>&nbsp;' + value.rank + '</span></div></td><td width=215px>'
                    + '<div class="rank-row-image">'
                    + '<a href="' + profileUrl + '">'
                    + '</a>'
                    + '</div></div></div>'
                    + '<div class="media-body">'
                    + '<a href="' + profileUrl + '">' + value.name + '</a></td><td>'+ stat +'</h5></td></tr></table>'
                    + '</div>'
                    + '</li>'
                    $('#charpower').append(html);});
                $('#ranks').show();}, "json");}
        $( document ).ready(function() {
            var selO = $('option[value="char_power"]');selectCategory('char_power', selO.html());
            $( ".rank-sel2" ).change(function() {});});

GM_xmlhttpRequest ( {
    method:     'GET',
    url:        'https://torax.outwar.com/ajax/rankings.php?type=char_elepower',
    onload:     function (responseDetails) {
        const EQ = /\{.*/i;
        const EQprint = EQ.exec(responseDetails.responseText);
        function selectCategory(category, title, isCrew) {
            $('#rank-title').html(title);
            $('#ranks').hide();
            $('#ranks').html('');
            $('#last-updated').html('');
           $.getJSON('ajax/rankings.php?type=char_elepower', function(data) {
                $.each(data.results, function(key, value) {
                    var profileUrl = 'profile.php?id=' + value.id;
                    var stat = '0';
                    if(value.stat) {stat = value.stat.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    var html = '<li class="list-group-item list-group-item-action ranksulli">'
                    + '<div class="media">'
                    + '<div class="mr-3">'
                    + '<div class="rank-row top">'
                    + '<table><tr><td width=40px class=homerankings><div class="rank-row-number"><span>&nbsp;' + value.rank + '</span></div></td><td width=215px>'
                    + '<div class="rank-row-image">'
                    + '<a href="' + profileUrl + '">'
                    + '</a>'
                    + '</div></div></div>'
                    + '<div class="media-body">'
                    + '<a href="' + profileUrl + '">' + value.name + '</a></td><td>'+ stat +'</h5></td></tr></table>'
                    + '</div>'
                    + '</li>'
                    $('#charele').append(html);});
                $('#ranks').show();}, "json");}
        $( document ).ready(function() {
            var selO = $('option[value="char_power"]');selectCategory('char_power', selO.html());
            $( ".rank-sel2" ).change(function() {});});

GM_xmlhttpRequest ( {
    method:     'GET',
    url:        'https://torax.outwar.com/ajax/rankings.php?type=char_chaos',
    onload:     function (responseDetails) {
        const EQ = /\{.*/i;
        const EQprint = EQ.exec(responseDetails.responseText);
        function selectCategory(category, title, isCrew) {
            $('#rank-title').html(title);
            $('#ranks').hide();
            $('#ranks').html('');
            $('#last-updated').html('');
           $.getJSON('ajax/rankings.php?type=char_chaos', function(data) {
                $.each(data.results, function(key, value) {
                    var profileUrl = 'profile.php?id=' + value.id;
                    var stat = '0';
                    if(value.stat ) {stat = value.stat.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    var html = '<li class="list-group-item list-group-item-action ranksulli">'
                    + '<div class="media">'
                    + '<div class="mr-3">'
                    + '<div class="rank-row top">'
                    + '<table><tr><td width=40px class=homerankings><div class="rank-row-number"><span>&nbsp;' + value.rank + '</span></div></td><td width=215px>'
                    + '<div class="rank-row-image">'
                    + '<a href="' + profileUrl + '">'
                    + '</a>'
                    + '</div></div></div>'
                    + '<div class="media-body">'
                    + '<a href="' + profileUrl + '">' + value.name + '</a></td><td>'+ stat +'</h5></td></tr></table>'
                    + '</div>'
                    + '</li>'
                    $('#charchaos').append(html);});
                $('#ranks').show();}, "json");}
        $( document ).ready(function() {
            var selO = $('option[value="char_power"]');selectCategory('char_power', selO.html());
            $( ".rank-sel2" ).change(function() {});});

document.querySelector("#tiles").innerHTML = tiles
document.querySelector("#eqhome").innerHTML = eq

if (veiledmob == "alive" && veiledkeyid != "") {
document.querySelector("#vbutton").addEventListener("click", vbutton, false);
function vbutton (divid) {
fetch('ajax/backpack_action.php', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  body: new URLSearchParams({
    'action': 'activate',
    'itemids[]': veiledkeyid
  })
}).then(res => res.text())
  .then(res => {
    if (res.match("activated!") != null) {window.location.href="world"}
  });}}

document.querySelector("#chart").innerHTML =

`<table><tr><td width="45px">Level</td><td width="125px">Experience</td><td width="35px">SP</td><td width="70px">ATK</td><td width="70x">DEF</td></tr></table>
<div class="table-responsive" id="expchart"><table>
<tr><td width="45px">1</td><td width="125px">0</td><td width="35px">0</td><td width="70px">1</td><td width="70px">3</td></tr>
<tr><td>2</td><td>7</td><td>0</td><td>2</td><td>5</td></tr>
<tr><td>3</td><td>25</td><td>0</td><td>4</td><td>8</td></tr>
<tr><td>4</td><td>50</td><td>0</td><td>6</td><td>12</td></tr>
<tr><td>5</td><td>150</td><td>0</td><td>9</td><td>16</td></tr>
<tr><td>6</td><td>250</td><td>0</td><td>12</td><td>21</td></tr>
<tr><td>7</td><td>450</td><td>0</td><td>15</td><td>27</td></tr>
<tr><td>8</td><td>700</td><td>0</td><td>18</td><td>36</td></tr>
<tr><td>9</td><td>1,000</td><td>0</td><td>22</td><td>44</td></tr>
<tr><td>10</td><td>1,500</td><td>1</td><td>26</td><td>50</td></tr>
<tr><td>11</td><td>3,000</td><td>1</td><td>30</td><td>62</td></tr>
<tr><td>12</td><td>5,000</td><td>2</td><td>36</td><td>71</td></tr>
<tr><td>13</td><td>8,000</td><td>2</td><td>38</td><td>85</td></tr>
<tr><td>14</td><td>12,000</td><td>3</td><td>43</td><td>92</td></tr>
<tr><td>15</td><td>18,000</td><td>3</td><td>48</td><td>107</td></tr>
<tr><td>16</td><td>28,000</td><td>4</td><td>53</td><td>115</td></tr>
<tr><td>17</td><td>40,000</td><td>4</td><td>58</td><td>226</td></tr>
<tr><td>18</td><td>55,000</td><td>5</td><td>63</td><td>231</td></tr>
<tr><td>19</td><td>75,000</td><td>5</td><td>68</td><td>242</td></tr>
<tr><td>20</td><td>100,000</td><td>6</td><td>73</td><td>257</td></tr>
<tr><td>21</td><td>130,000</td><td>6</td><td>78</td><td>264</td></tr>
<tr><td>22</td><td>165,000</td><td>7</td><td>83</td><td>272</td></tr>
<tr><td>23</td><td>215,000</td><td>7</td><td>88</td><td>281</td></tr>
<tr><td>24</td><td>260,000</td><td>8</td><td>95</td><td>290</td></tr>
<tr><td>25</td><td>310,000</td><td>8</td><td>100</td><td>300</td></tr>
<tr><td>26</td><td>370,000</td><td>9</td><td>106</td><td>320</td></tr>
<tr><td>27</td><td>445,000</td><td>9</td><td>112</td><td>335</td></tr>
<tr><td>28</td><td>525,000</td><td>10</td><td>118</td><td>350</td></tr>
<tr><td>29</td><td>625,000</td><td>10</td><td>125</td><td>370</td></tr>
<tr><td>30</td><td>735,000</td><td>11</td><td>132</td><td>392</td></tr>
<tr><td>31</td><td>838,500</td><td>11</td><td>150</td><td>412</td></tr>
<tr><td>32</td><td>950,000</td><td>12</td><td>160</td><td>426</td></tr>
<tr><td>33</td><td>1,082,250</td><td>12</td><td>185</td><td>438</td></tr>
<tr><td>34</td><td>1,224,000</td><td>13</td><td>200</td><td>453</td></tr>
<tr><td>35</td><td>1,378,125</td><td>13</td><td>215</td><td>487</td></tr>
<tr><td>36</td><td>1,530,000</td><td>14</td><td>230</td><td>500</td></tr>
<tr><td>37</td><td>1,732,500</td><td>14</td><td>260</td><td>526</td></tr>
<tr><td>38</td><td>1,920,000</td><td>15</td><td>300</td><td>556</td></tr>
<tr><td>39</td><td>2,131,250</td><td>15</td><td>330</td><td>575</td></tr>
<tr><td>40</td><td>2,325,000</td><td>16</td><td>345</td><td>600</td></tr>
<tr><td>41</td><td>2,537,500</td><td>16</td><td>360</td><td>650</td></tr>
<tr><td>42</td><td>2,800,000</td><td>17</td><td>380</td><td>704</td></tr>
<tr><td>43</td><td>3,105,000</td><td>17</td><td>400</td><td>747</td></tr>
<tr><td>44</td><td>3,380,000</td><td>18</td><td>415</td><td>811</td></tr>
<tr><td>45</td><td>3,687,500</td><td>18</td><td>425</td><td>856</td></tr>
<tr><td>46</td><td>3,990,000</td><td>19</td><td>450</td><td>879</td></tr>
<tr><td>47</td><td>4,312,500</td><td>19</td><td>475</td><td>911</td></tr>
<tr><td>48</td><td>4,620,000</td><td>20</td><td>500</td><td>932</td></tr>
<tr><td>49</td><td>4,935,000</td><td>20</td><td>550</td><td>956</td></tr>
<tr><td>50</td><td>5,250,000</td><td>21</td><td>650</td><td>1,000</td></tr>
<tr><td>51</td><td>6,500,000</td><td>21</td><td>700</td><td>1,032</td></tr>
<tr><td>52</td><td>7,750,000</td><td>22</td><td>750</td><td>1,067</td></tr>
<tr><td>53</td><td>9,250,000</td><td>22</td><td>800</td><td>1,103</td></tr>
<tr><td>54</td><td>11,050,000</td><td>23</td><td>850</td><td>1,250</td></tr>
<tr><td>55</td><td>12,750,000</td><td>23</td><td>875</td><td>1,500</td></tr>
<tr><td>56</td><td>14,750,000</td><td>24</td><td>900</td><td>1,750</td></tr>
<tr><td>57</td><td>17,250,000</td><td>24</td><td>950</td><td>2,000</td></tr>
<tr><td>58</td><td>19,750,000</td><td>25</td><td>1,000</td><td>2,200</td></tr>
<tr><td>59</td><td>22,250,000</td><td>25</td><td>1,250</td><td>2,400</td></tr>
<tr><td>60</td><td>24,750,000</td><td>26</td><td>1,500</td><td>2,500</td></tr>
<tr><td>61</td><td>28,000,000</td><td>26</td><td>1,750</td><td>2,650</td></tr>
<tr><td>62</td><td>31,750,000</td><td>27</td><td>2,000</td><td>2,800</td></tr>
<tr><td>63</td><td>35,750,000</td><td>27</td><td>2,250</td><td>3,000</td></tr>
<tr><td>64</td><td>39,750,000</td><td>28</td><td>2,500</td><td>3,200</td></tr>
<tr><td>65</td><td>44,750,000</td><td>28</td><td>2,750</td><td>3,500</td></tr>
<tr><td>66</td><td>49,750,000</td><td>29</td><td>3,000</td><td>3,800</td></tr>
<tr><td>67</td><td>55,750,000</td><td>29</td><td>3,250</td><td>4,100</td></tr>
<tr><td>68</td><td>61,750,000</td><td>30</td><td>3,500</td><td>4,400</td></tr>
<tr><td>69</td><td>68,750,000</td><td>30</td><td>3,750</td><td>4,700</td></tr>
<tr><td>70</td><td>77,000,000</td><td>31</td><td>4,000</td><td>5,000</td></tr>
<tr><td>71</td><td>90,650,000</td><td>31</td><td>4,150</td><td>5,200</td></tr>
<tr><td>72</td><td>106,900,000</td><td>32</td><td>4,300</td><td>5,450</td></tr>
<tr><td>73</td><td>126,400,000</td><td>32</td><td>4,500</td><td>5,750</td></tr>
<tr><td>74</td><td>152,400,000</td><td>33</td><td>4,750</td><td>6,100</td></tr>
<tr><td>75</td><td>184,900,000</td><td>33</td><td>5,000</td><td>6,500</td></tr>
<tr><td>76</td><td>385,000,000</td><td>34</td><td>5,250</td><td>6,800</td></tr>
<tr><td>77</td><td>675,000,000</td><td>34</td><td>5,500</td><td>7,100</td></tr>
<tr><td>78</td><td>995,600,000</td><td>35</td><td>5,800</td><td>7,500</td></tr>
<tr><td>79</td><td>1,450,920,000</td><td>35</td><td>6,150</td><td>7,900</td></tr>
<tr><td>80</td><td>2,000,000,000</td><td>36</td><td>6,500</td><td>8,500</td></tr>
<tr><td>81</td><td>3,000,000,000</td><td>36</td><td>6,900</td><td>9,200</td></tr>
<tr><td>82</td><td>4,500,000,000</td><td>37</td><td>7,350</td><td>10,000</td></tr>
<tr><td>83</td><td>6,750,000,000</td><td>37</td><td>7,850</td><td>10,900</td></tr>
<tr><td>84</td><td>10,000,000,000</td><td>38</td><td>8,400</td><td>11,900</td></tr>
<tr><td>85</td><td>15,000,000,000</td><td>38</td><td>9,000</td><td>13,000</td></tr>
<tr><td>86</td><td>20,000,000,000</td><td>39</td><td>9,650</td><td>14,200</td></tr>
<tr><td>87</td><td>26,000,000,000</td><td>39</td><td>10,350</td><td>15,500</td></tr>
<tr><td>88</td><td>33,000,000,000</td><td>40</td><td>11,100</td><td>16,900</td></tr>
<tr><td>89</td><td>41,000,000,000</td><td>40</td><td>11,900</td><td>18,400</td></tr>
<tr><td>90</td><td>50,000,000,000</td><td>41</td><td>12,750</td><td>20,000</td></tr>
</table></div>`

}})}})}})})})})})})})})})})})})})})})})}

if (document.querySelector("body").innerHTML.match(/Expires<br>[\n\r]([0-9]+) minutes/i) != null){
var minutes = document.querySelector("body").innerHTML.match(/Expires<br>[\n\r]([0-9]+) minutes/i)[1]
var datemath = new Date();
datemath.setMinutes(datemath.getMinutes() + parseInt(minutes));
var expires = datemath.toString().match(/[a-zA-Z]+ [a-zA-Z]+ [0-9]+ [0-9]+ [0-9]+:[0-9]+/i)+" OW TIME"
var itemtable = document.querySelector("#itemtable > tbody > tr:nth-child(2) > td:nth-child(2)")
itemtable.innerHTML = itemtable.innerHTML+expires
}

if (document.URL.indexOf("spawntimeview") != -1 && error == false) {
if (document.querySelector("#content-header-row > form > input[type=submit]") != null){

GM_addStyle ( `
#content-header-row > table{width:700px !important;}
#content-header-row > table > tbody > tr:nth-child(2) > td > table > tbody > tr > td{padding:20px !important;}
#button1,#button2,#button3,#button4,#button5,#button6,#button7,#button8{border:0px !important;box-shadow: 5px 5px 14px #000000,-5px -5px 14px #000000;}
`)

var content = document.querySelector("#content-header-row")
content.innerHTML = `<table class="shortcuts"><tr><td>`+content.innerHTML+`</td></tr>
<tr><td>
<table><tr><td>
<button id='button1' class='button'><img src=/images/mobs/agnargod.png width="150px" height="150px" onmouseover="popup(event,'Agnar')" onmouseout="kill()"></button>
</td><td>
<button id='button2' class='button'><img src=/images/mobs/valzekdeathgod.png width="150px" height="150px" onmouseover="popup(event,'Valzek')" onmouseout="kill()"></button>
</td><td>
<button id='button3' class='button'><img src=/images/mobs/velendgamegod.jpg width="150px" height="150px" onmouseover="popup(event,'Thanox')" onmouseout="kill()"></button>
</td><td>
<button id='button4' class='button'><img src=/images/mobs/kinarkgod.png width="150px" height="150px" onmouseover="popup(event,'Kinark')" onmouseout="kill()"></button>
</td>
</tr><tr><td>
<button id='button5' class='button'><img src=/images/mobs/shayargod.png width="150px" height="150px" onmouseover="popup(event,'Shayar')" onmouseout="kill()"></button>
</td><td>
<button id='button6' class='button'><img src=/images/mobs/firangod.png width="150px" height="150px" onmouseover="popup(event,'Firan')" onmouseout="kill()"></button>
</td><td>
<button id='button7' class='button'><img src=/images/mobs/arcongod.png width="150px" height="150px" onmouseover="popup(event,'Arcon')" onmouseout="kill()"></button>
</td><td>
<button id='button8' class='button'><img src=/images/mobs/holgorgod.png width="150px" height="150px" onmouseover="popup(event,'Holgor')" onmouseout="kill()"></button>
</td></tr></table>
</td></tr></table>`

document.querySelector("#content-header-row > table > tbody > tr:nth-child(1) > td > form > select").setAttribute("id","godlist")

var agnar = document.querySelector("#godlist")
agnar.innerHTML = agnar.innerHTML.replace(`<option value="4789">`,`<option value="4789" id="agnar">`)
var valzek = document.querySelector("#godlist")
valzek.innerHTML = valzek.innerHTML.replace(`<option value="4790">`,`<option value="4790" id="valzek">`)
var thanox = document.querySelector("#godlist")
thanox.innerHTML = thanox.innerHTML.replace(`<option value="4389">`,`<option value="4389" id="thanox">`)
var kinark = document.querySelector("#godlist")
kinark.innerHTML = kinark.innerHTML.replace(`<option value="4787">`,`<option value="4787" id="kinark">`)
var shayar = document.querySelector("#godlist")
shayar.innerHTML = shayar.innerHTML.replace(`<option value="4788">`,`<option value="4788" id="shayar">`)
var firan = document.querySelector("#godlist")
firan.innerHTML = firan.innerHTML.replace(`<option value="4786">`,`<option value="4786" id="firan">`)
var arcon = document.querySelector("#godlist")
arcon.innerHTML = arcon.innerHTML.replace(`<option value="4785">`,`<option value="4785" id="arcon">`)
var holgor = document.querySelector("#godlist")
holgor.innerHTML = holgor.innerHTML.replace(`<option value="4784">`,`<option value="4784" id="holgor">`)

document.getElementById ("button1").addEventListener ("click", Button1, false);
function Button1 (zEvent) {
    document.querySelector("#agnar").setAttribute("selected","true");
    document.querySelector("#valzek").removeAttribute("selected");
    document.querySelector("#thanox").removeAttribute("selected");
    document.querySelector("#kinark").removeAttribute("selected");
    document.querySelector("#shayar").removeAttribute("selected");
    document.querySelector("#firan").removeAttribute("selected");
    document.querySelector("#arcon").removeAttribute("selected");
    document.querySelector("#holgor").removeAttribute("selected");
}
document.getElementById ("button2").addEventListener ("click", Button2, false);
function Button2 (zEvent) {
    document.querySelector("#agnar").removeAttribute("selected");
    document.querySelector("#valzek").setAttribute("selected","true");
    document.querySelector("#thanox").removeAttribute("selected");
    document.querySelector("#kinark").removeAttribute("selected");
    document.querySelector("#shayar").removeAttribute("selected");
    document.querySelector("#firan").removeAttribute("selected");
    document.querySelector("#arcon").removeAttribute("selected");
    document.querySelector("#holgor").removeAttribute("selected");
                          }
document.getElementById ("button3").addEventListener ("click", Button3, false);
function Button3 (zEvent) {
    document.querySelector("#agnar").removeAttribute("selected");
    document.querySelector("#valzek").removeAttribute("selected");
    document.querySelector("#thanox").setAttribute("selected","true");
    document.querySelector("#kinark").removeAttribute("selected");
    document.querySelector("#shayar").removeAttribute("selected");
    document.querySelector("#firan").removeAttribute("selected");
    document.querySelector("#arcon").removeAttribute("selected");
    document.querySelector("#holgor").removeAttribute("selected");
}
document.getElementById ("button4").addEventListener ("click", Button4, false);
function Button4 (zEvent) {
    document.querySelector("#agnar").removeAttribute("selected");
    document.querySelector("#valzek").removeAttribute("selected");
    document.querySelector("#thanox").removeAttribute("selected");
    document.querySelector("#kinark").setAttribute("selected","true");
    document.querySelector("#shayar").removeAttribute("selected");
    document.querySelector("#firan").removeAttribute("selected");
    document.querySelector("#arcon").removeAttribute("selected");
    document.querySelector("#holgor").removeAttribute("selected");
                          }
document.getElementById ("button5").addEventListener ("click", Button5, false);
function Button5 (zEvent) {
    document.querySelector("#agnar").removeAttribute("selected");
    document.querySelector("#valzek").removeAttribute("selected");
    document.querySelector("#thanox").removeAttribute("selected");
    document.querySelector("#kinark").removeAttribute("selected");
    document.querySelector("#shayar").setAttribute("selected","true");
    document.querySelector("#firan").removeAttribute("selected");
    document.querySelector("#arcon").removeAttribute("selected");
    document.querySelector("#holgor").removeAttribute("selected");
                          }
document.getElementById ("button6").addEventListener ("click", Button6, false);
function Button6 (zEvent) {
    document.querySelector("#agnar").removeAttribute("selected");
    document.querySelector("#valzek").removeAttribute("selected");
    document.querySelector("#thanox").removeAttribute("selected");
    document.querySelector("#kinark").removeAttribute("selected");
    document.querySelector("#shayar").removeAttribute("selected");
    document.querySelector("#firan").setAttribute("selected","true");
    document.querySelector("#arcon").removeAttribute("selected");
    document.querySelector("#holgor").removeAttribute("selected");
                          }
document.getElementById ("button7").addEventListener ("click", Button7, false);
function Button7 (zEvent) {
    document.querySelector("#agnar").removeAttribute("selected");
    document.querySelector("#valzek").removeAttribute("selected");
    document.querySelector("#thanox").removeAttribute("selected");
    document.querySelector("#kinark").removeAttribute("selected");
    document.querySelector("#shayar").removeAttribute("selected");
    document.querySelector("#firan").removeAttribute("selected");
    document.querySelector("#arcon").setAttribute("selected","true");
    document.querySelector("#holgor").removeAttribute("selected");
                          }
document.getElementById ("button8").addEventListener ("click", Button8, false);
function Button8 (zEvent) {
    document.querySelector("#agnar").removeAttribute("selected");
    document.querySelector("#valzek").removeAttribute("selected");
    document.querySelector("#thanox").removeAttribute("selected");
    document.querySelector("#kinark").removeAttribute("selected");
    document.querySelector("#shayar").removeAttribute("selected");
    document.querySelector("#firan").removeAttribute("selected");
    document.querySelector("#arcon").removeAttribute("selected");
    document.querySelector("#holgor").setAttribute("selected","true");
}}

var oracleMsg = document.querySelector("#content-header-row").innerHTML.match("You may view the Oracle's prediction in your message center.")
if (oracleMsg != null){

fetch("ow_messagecenter")
   .then(response => response.text())
   .then((response) => {
    var msgLink = response.match(/<a href="(view_ow_message\.php\?id=[0-9]+)/i)
    window.location.href = msgLink[1]
})}}

if (document.URL.indexOf("itemtransfer") != -1 && error == false) {

GM_addStyle ( `
#divItemtransfer > form > div > div > h3 {display:none !important;}
#content > div.layout-px-spacing{background:#1A1C2D;box-shadow: 5px 5px 14px #02030a,-5px -5px 14px #0a0d26;}
#divItemtransfer > form > div > div{padding: 5px;position: relative;background-color: #0e1726;border-bottom-left-radius: 1px;border-bottom-right-radius: 1px;}
`)

var cat4a = document.querySelector("#divItemtransfer > form > div:nth-child(2) > div").innerHTML
if (cat4a.match(/You have no items in this category/i) != null) GM_addStyle (`#divItemtransfer > form > div:nth-child(2) > div{display:none !important;}`)
var cat5a = document.querySelector("#divItemtransfer > form > div:nth-child(3) > div").innerHTML
if (cat5a.match(/You have no items in this category/i) != null) GM_addStyle (`#divItemtransfer > form > div:nth-child(3) > div{display:none !important;}`)
var cat6a = document.querySelector("#divItemtransfer > form > div:nth-child(4) > div").innerHTML
if (cat6a.match(/You have no items in this category/i) != null) GM_addStyle (`#divItemtransfer > form > div:nth-child(4) > div{display:none !important;}`)
var cat7a = document.querySelector("#divItemtransfer > form > div:nth-child(5) > div").innerHTML
if (cat7a.match(/You have no items in this category/i) != null) GM_addStyle (`#divItemtransfer > form > div:nth-child(5) > div{display:none !important;}`)
var cat8a = document.querySelector("#divItemtransfer > form > div:nth-child(6) > div").innerHTML
if (cat8a.match(/You have no items in this category/i) != null) GM_addStyle (`#divItemtransfer > form > div:nth-child(6) > div{display:none !important;}`)
var cat9a = document.querySelector("#divItemtransfer > form > div:nth-child(7) > div").innerHTML
if (cat9a.match(/You have no items in this category/i) != null) GM_addStyle (`#divItemtransfer > form > div:nth-child(7) > div{display:none !important;}`)
var cat10a = document.querySelector("#divItemtransfer > form > div:nth-child(8) > div").innerHTML
if (cat10a.match(/You have no items in this category/i) != null) GM_addStyle (`#divItemtransfer > form > div:nth-child(8) > div{display:none !important;}`)
var cat11a = document.querySelector("#divItemtransfer > form > div:nth-child(9) > div").innerHTML
if (cat11a.match(/You have no items in this category/i) != null) GM_addStyle (`#divItemtransfer > form > div:nth-child(9) > div{display:none !important;}`)
var cat12a = document.querySelector("#divItemtransfer > form > div:nth-child(10) > div").innerHTML
if (cat12a.match(/You have no items in this category/i) != null) GM_addStyle (`#divItemtransfer > form > div:nth-child(10) > div{display:none !important;}`)
var cat13a = document.querySelector("#divItemtransfer > form > div:nth-child(11) > div").innerHTML
if (cat13a.match(/You have no items in this category/i) != null) GM_addStyle (`#divItemtransfer > form > div:nth-child(11) > div{display:none !important;}`)
var cat14a = document.querySelector("#divItemtransfer > form > div:nth-child(12) > div").innerHTML
if (cat14a.match(/You have no items in this category/i) != null) GM_addStyle (`#divItemtransfer > form > div:nth-child(12) > div{display:none !important;}`)
var cat15a = document.querySelector("#divItemtransfer > form > div:nth-child(13) > div").innerHTML
if (cat15a.match(/You have no items in this category/i) != null) GM_addStyle (`#divItemtransfer > form > div:nth-child(13) > div{display:none !important;}`)
var cat16a = document.querySelector("#divItemtransfer > form > div:nth-child(14) > div").innerHTML
if (cat16a.match(/You have no items in this category/i) != null) GM_addStyle (`#divItemtransfer > form > div:nth-child(14) > div{display:none !important;}`)
var cat17a = document.querySelector("#divItemtransfer > form > div:nth-child(15) > div").innerHTML
if (cat17a.match(/You have no items in this category/i) != null) GM_addStyle (`#divItemtransfer > form > div:nth-child(15) > div{display:none !important;}`)
var cat18a = document.querySelector("#divItemtransfer > form > div:nth-child(16) > div").innerHTML
if (cat18a.match(/You have no items in this category/i) != null) GM_addStyle (`#divItemtransfer > form > div:nth-child(16) > div{display:none !important;}`)
var cat19a = document.querySelector("#divItemtransfer > form > div:nth-child(17) > div").innerHTML
if (cat19a.match(/You have no items in this category/i) != null) GM_addStyle (`#divItemtransfer > form > div:nth-child(17) > div{display:none !important;}`)

}

if (document.URL.indexOf("crew_vault") != -1 && error == false) {
if (document.querySelector("#content-header-row > form > div.row.mt-3.w-100") != null){

GM_addStyle ( `
#content-header-row > form > div.row.mt-3.w-100 > table > tbody > tr > td.actions{width:300px !important;vertical-align: top !important;background:#1A1C2D !important;box-shadow: 5px 5px 14px #02030a,-5px -5px 14px #0a0d26;}
#content-header-row > form > div.row.mt-3.w-100 > table > tbody > tr > td.vaultitems{vertical-align: top !important;}
#content-header-row > form > div.row.mt-3.w-100 > table > tbody > tr > td:nth-child(2){background:#1A1C2D !important;}
#content-header-row > form > div.row.mt-3.w-100 > table{border: 20px SOLID #1A1C2D !important;}
.col-lg-6{max-width: 100% !important;}
.custom-control-label::before{background: #060707;border-color: #060707;}
.custom-control-input:checked~.custom-control-label::before{color: #fff;border-color: #fff;background-color: #fff;}
#content-header-row > div.col-12.layout-spacing,#content-header-row > div.w-100.mb-3{display:none !important;}
#content-header-row > form > div.row.mt-3.w-100 > table > tbody > tr > td.actions > div.btn-group.show > div{background:#0F0F0F !important;}
#content-header-row > form > div.row.mt-3.w-100 > table > tbody > tr > td.actions > div.text{padding-right:20px !important;margin-bottom:20px !important;}
#content-header-row > form > div.row.mt-3.w-100 > table > tbody > tr > td.actions > div:nth-child(5) > div > div > label{color:#FFFFFF !important;}
#content-header-row > form > div.row.mt-3.w-100 > table > tbody > tr > td.actions > div:nth-child(7) > div > div > label{color:#FFFFFF !important;}
#content-header-row > form > div.row.mt-3.w-100 > table > tbody > tr > td.actions > div:nth-child(6) > div:nth-child(1) > h5{display:none !important;}
#content-header-row > form > div.row.mt-3.w-100 > table > tbody > tr > td.actions > div:nth-child(6) > div:nth-child(1) > p:nth-child(2){display:none !important;}
#content-header-row > form > div.row.mt-3.w-100 > table > tbody > tr > td.actions > div:nth-child(6) > div:nth-child(1) > p:nth-child(5){display:none !important;}
#content-header-row > form > div.row.mt-3.w-100 > table > tbody > tr > td.actions > div:nth-child(6) > div:nth-child(1) > p:nth-child(6){display:none !important;}
#content-header-row > form > div.row.mt-3.w-100 > table > tbody > tr > td.actions > div:nth-child(6) > div.widget-content.widget-content-area.w-100.text-left.mt-3 > h5{display:none !important;}
#content-header-row > form > div.row.mt-3.w-100 > table > tbody > tr > td.actions > div:nth-child(6) > div.widget-content.widget-content-area.w-100.text-left.mt-3 > p:nth-child(2){display:none !important;}
#content-header-row > form > div.row.mt-3.w-100 > table > tbody > tr > td.actions > div:nth-child(7) > div > h5{display:none !important;}
#content-header-row > form > div.row.mt-3.w-100 > table > tbody > tr > td.actions > div:nth-child(7) > div > p:nth-child(2){display:none !important;}
#content-header-row > form > div.row.mt-3.w-100 > table > tbody > tr > td.actions > div:nth-child(7) > div > font{display:none !important;}
#content-header-row > form > div.row.mt-3.w-100 > table > tbody > tr > td.actions > div.btn-group{margin-right:20px !important;}
#content-header-row > form > div.widget-content.widget-content-area.w-100.mx-3{display:none !important;}
#content > div.layout-px-spacing{margin-top:40px !important;}
#content-header-row > div.row{z-index:-1000 !important;}
#selected > img {width:28px !important;height:28px !important;margin:2px !important;}
#content-header-row > form > div.row.mt-3.w-100 > table > tbody > tr > td.actions > div.text > div > div > p{margin-top:1rem !important;}
#content-header-row > form > div.row.mt-3.w-100 > table > tbody > tr > td.actions > div:nth-child(7){margin-top:1rem !important;}
#aname{background: #1B2E4B !important;border:1px #1b2e4b SOLID !important;color:#888ea8 !important;padding:6px !important;border-radius:6px !important;height:45px}
#content > div.layout-px-spacing{background:transparent !important;box-shadow: 0px 0px 0px #000000,-0px -0px 0px #000000 !important;}
#content-header-row > div.row{margin-top:-40px !important;}
`)

document.querySelector("#content-header-row > form > div.row.mt-3.w-100 > table > tbody > tr > td.actions > div:nth-child(6) > div:nth-child(1) > select")

setTimeout(function() {
var crewvault = document.querySelector("#content-header-row > form > div.row.mt-3.w-100 > table > tbody > tr > td.vaultitems")
let observer = new MutationObserver(mutationRecords => {cvcount()});
observer.observe(crewvault, {
  attributes: true,
  attributeFilter: ['style'],
  subtree: true
});

function cvcount(){
var selected_cnt = (document.querySelector("#content-header-row > form > div.row.mt-3.w-100 > table > tbody > tr > td.vaultitems").innerHTML.match(/border: 2px solid rgb\(204, 0, 0\)/g) || []).length
var selected_item = '';
if (selected_cnt > 0){selected_item = document.querySelector("#content-header-row > form > div.row.mt-3.w-100 > table > tbody > tr > td.vaultitems").innerHTML.match(/<img alt="[^"]*" class="[^"]*" id="[^"]*" src="[^"]*" style="border: 2px solid rgb\(204, 0, 0\);" onmouseover="[^"]*" onmouseout="[^"]*" ondblclick="[^"]*" onclick="[^"]*">/g).toString().replaceAll(/class="[^"]*"/g,"").replaceAll(`rgb(204, 0, 0)`,`#131313`).replaceAll(",","").replaceAll(/onclick="[^"]*"/g,"").replaceAll(/ondblclick="[^"]*"/g,"").replaceAll(/id="[^"]*" /g,"").replaceAll(`\(event`,`\(event,`)}
document.querySelector("#cnt").innerHTML = selected_cnt
if (selected_cnt > 0){document.querySelector("#selected").innerHTML = selected_item}
if (selected_cnt == 0){document.querySelector("#selected").innerHTML = ''}
}},500);

var title = document.querySelector("#content-header-row > div.col-12.layout-spacing > div > div.row > div.col-auto.text-left > h4").innerHTML.match(/<img src="\/img\/CrewPoints\.png" onmouseover="popup\(event,'(.*) Crew Points'\);" onmouseout="kill\(\);"> (.*)/i)
var storage = document.querySelector("#content-header-row > div.w-100.mb-3").innerHTML.match(/Currently Storing <b>(.*) \/ (.*)<\/b> Items/i)
var crewid = document.querySelector("#content-header-row > div.col-12.layout-spacing > div > div.btn-group.mb-3.mr-2").innerHTML.match(/crew_raidresults\.php\?crewid=(.*)">Raid Results<\/a>/i)
var actions = document.querySelector("#content-header-row > form > div.row.mt-3.w-100").innerHTML
var items = document.querySelector("#content-header-row > form > div.widget-content.widget-content-area.w-100.mx-3 > div > div").innerHTML

document.querySelector("#content-header-row > form > div.row.mt-3.w-100").innerHTML = `<table><tr><td class="actions">

<div class="btn-group" role="group">
<button id="btnGroupDefault" type="button" class="btn btn-secondary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
Menu <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-down"><polyline points="6 9 12 15 18 9"></polyline></svg>
</button>
<div class="dropdown-menu" aria-labelledby="btnGroupDefault" style="will-change: transform;">
<a class="dropdown-item" href="/crew_pointbank">Point Bank</a>
<a class="dropdown-item" href="/crew_stones">Upgrade Stones</a>
<a class="dropdown-item" href="/crew_treasury">Treasury</a>
<a class="dropdown-item" href="/crew_actionlog.php?l=Award%20Item">Award Log</a>
<a class="dropdown-item" href="/crew_actionlog.php?l=Delete%20Item">Deleted Log</a>
</div>
</div> <a href="/crew_vault?order=1">Alpha</a> / <a href="/crew_vault?order=2">Newest</a>
<p style="margin-top:10px">
<div class="col-12 col-lg-6">
`+title[2]+` is using `+storage[1]+` of the total `+storage[2]+` item capacity and has `+title[1]+` points in crew vault.
<div class="widget-content widget-content-area w-100 text-left mt-3"><b>ITEMS SELECTED:</b> <span id="cnt">0</span><p><span id="selected"></span></div>
<div class="widget-content widget-content-area w-100 text-left mt-3" style="margin-bottom:1rem"><input type="text" placeholder="AWARD BY NAME" id="aname" name="aname" class="form-control"></div>
</div>`+actions+`</td><td class="vaultitems">`+items

document.querySelector("#content-header-row > form > div.row.mt-3.w-100 > table > tbody > tr > td.actions > div:nth-child(6) > div.widget-content.widget-content-area.w-100.text-left.mt-3 > p.mt-3 > input").setAttribute("value","Select Raidbound Items")
document.querySelector("#content-header-row > form > div.row.mt-3.w-100 > table > tbody > tr > td.actions > div:nth-child(7) > div > p.mt-3 > input").setAttribute("value","Delete Items")
document.querySelector("#content-header-row > div.col-12.layout-spacing > div > div.row > div.col-auto.text-left > h4").innerHTML = ""
document.querySelector("#content-header-row > form > div.widget-content.widget-content-area.w-100.mx-3 > div").innerHTML = ""

$("#aname").change(function(){
console.log(document.querySelector("#aname").value)
var dd = document.querySelector("#content-header-row > form > div.row.mt-3.w-100 > table > tbody > tr > td.actions > div:nth-child(6) > div:nth-child(1) > select");
var awardto_name = document.querySelector("#aname").value
for (var i = 0; i < dd.options.length; i++) {if (dd.options[i].text.toLowerCase() === awardto_name.toLowerCase()) {dd.selectedIndex = i;}}
});

var chardrop = document.querySelector("#content-header-row > form > div.row.mt-3.w-100 > table > tbody > tr > td.actions > div:nth-child(6) > div:nth-child(1) > select")
let char0 = document.createElement('option');
char0.innerHTML = ``
char0.setAttribute("value","0")
chardrop.insertBefore(char0, chardrop.firstElementChild);
document.querySelector("#content-header-row > form > div.row.mt-3.w-100 > table > tbody > tr > td.actions > div:nth-child(6) > div:nth-child(1) > select").value = "0"

}}

if (document.URL.indexOf("trade") != -1 && error == false) {
if (document.querySelector("#content-header-row > div > div").innerHTML.match("This trade has been completed") == null) {

var qnt;
if (GM_getValue("trade_qnt") == undefined){
qnt = 1}
if (GM_getValue("trade_qnt") != undefined){
qnt = GM_getValue("trade_qnt")}

var set_qnt = `Set default trade quantity<br>
<input id="trade_qnt" type="text" name="trade_qnt" placeholder="`+qnt+`" class="form-control" style="width:130px !important;margin-bottom:1rem !important;display:inline !important;">
<button id="trade_qntbtn" class="btn btn-primary " style="display:inline !important;height:39px !important;margin-bottom:4px;">SET</button>
`

setTimeout(function() {
document.querySelector("#trade_qntbtn").addEventListener("click", trade_qnt, false);
},500)
function trade_qnt(){
GM_setValue("trade_qnt", document.querySelector("#trade_qnt").value)
qnt = GM_getValue("trade_qnt")
location.reload();
}

$("#divTradeData").after(set_qnt);

var observer_trade = new MutationObserver(function(mutations) {
mutations.forEach(function(mutationRecord) {
document.querySelector("#cauldronqtyspinner").value = qnt
document.querySelector("#cauldronqtyspinner").focus()
});
});

var target = document.getElementById('cauldronqty');
observer_trade.observe(target, {
attributes: true,
attributeFilter: ['class']
});

if (document.querySelector("#content-header-row > div > div > strong") == null){

var cat6 = document.querySelector("#divTrade > div:nth-child(6)").innerHTML
if (cat6.match(/You have no items in this category/i) != null) GM_addStyle (`#divTrade > div:nth-child(6){display:none !important;}`)
var cat7 = document.querySelector("#divTrade > div:nth-child(7)").innerHTML
if (cat7.match(/You have no items in this category/i) != null) GM_addStyle (`#divTrade > div:nth-child(7){display:none !important;}`)
var cat8 = document.querySelector("#divTrade > div:nth-child(8)").innerHTML
if (cat8.match(/You have no items in this category/i) != null) GM_addStyle (`#divTrade > div:nth-child(8){display:none !important;}`)
var cat9 = document.querySelector("#divTrade > div:nth-child(9)").innerHTML
if (cat9.match(/You have no items in this category/i) != null) GM_addStyle (`#divTrade > div:nth-child(9){display:none !important;}`)
var cat10 = document.querySelector("#divTrade > div:nth-child(10)").innerHTML
if (cat10.match(/You have no items in this category/i) != null) GM_addStyle (`#divTrade > div:nth-child(10){display:none !important;}`)
var cat11 = document.querySelector("#divTrade > div:nth-child(11)").innerHTML
if (cat11.match(/You have no items in this category/i) != null) GM_addStyle (`#divTrade > div:nth-child(11){display:none !important;}`)
var cat12 = document.querySelector("#divTrade > div:nth-child(12)").innerHTML
if (cat12.match(/You have no items in this category/i) != null) GM_addStyle (`#divTrade > div:nth-child(12){display:none !important;}`)
var cat13 = document.querySelector("#divTrade > div:nth-child(13)").innerHTML
if (cat13.match(/You have no items in this category/i) != null) GM_addStyle (`#divTrade > div:nth-child(13){display:none !important;}`)
var cat14 = document.querySelector("#divTrade > div:nth-child(14)").innerHTML
if (cat14.match(/You have no items in this category/i) != null) GM_addStyle (`#divTrade > div:nth-child(14){display:none !important;}`)
var cat15 = document.querySelector("#divTrade > div:nth-child(15)").innerHTML
if (cat15.match(/You have no items in this category/i) != null) GM_addStyle (`#divTrade > div:nth-child(15){display:none !important;}`)
var cat16 = document.querySelector("#divTrade > div:nth-child(16)").innerHTML
if (cat16.match(/You have no items in this category/i) != null) GM_addStyle (`#divTrade > div:nth-child(16){display:none !important;}`)
var cat17 = document.querySelector("#divTrade > div:nth-child(17)").innerHTML
if (cat17.match(/You have no items in this category/i) != null) GM_addStyle (`#divTrade > div:nth-child(17){display:none !important;}`)
var cat18 = document.querySelector("#divTrade > div:nth-child(18)").innerHTML
if (cat18.match(/You have no items in this category/i) != null) GM_addStyle (`#divTrade > div:nth-child(18){display:none !important;}`)
var cat19 = document.querySelector("#divTrade > div:nth-child(19)").innerHTML
if (cat19.match(/You have no items in this category/i) != null) GM_addStyle (`#divTrade > div:nth-child(19){display:none !important;}`)
var cat20 = document.querySelector("#divTrade > div:nth-child(20)").innerHTML
if (cat20.match(/You have no items in this category/i) != null) GM_addStyle (`#divTrade > div:nth-child(20){display:none !important;}`)
var cat21 = document.querySelector("#divTrade > div:nth-child(21)").innerHTML
if (cat21.match(/You have no items in this category/i) != null) GM_addStyle (`#divTrade > div:nth-child(21){display:none !important;}`)
var cat22 = document.querySelector("#divTrade > div:nth-child(22)").innerHTML
if (cat22.match(/You have no items in this category/i) != null) GM_addStyle (`#divTrade > div:nth-child(22){display:none !important;}`)
var cat23 = document.querySelector("#divTrade > div:nth-child(23)").innerHTML
if (cat23.match(/You have no items in this category/i) != null) GM_addStyle (`#divTrade > div:nth-child(23){display:none !important;}`)

}}}

if (document.URL.indexOf("godstatus") != -1 && error == false) {

var Agnar = '';
if (document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Agnar.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g) != null){
Agnar = document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Agnar.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g).toString().replaceAll("<td>","").replaceAll("</td>","<br>").replace(`<a href="crew_profile`,`<hr class="hr"><a href="crew_profile`).replace(/,.*/g,"")}
if (Agnar == ""){Agnar = "Agnar"}

var Valzek = '';
if (document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Valzek.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g) != null){
Valzek = document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Valzek.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g).toString().replaceAll("<td>","").replaceAll("</td>","<br>").replace(`<a href="crew_profile`,`<hr class="hr"><a href="crew_profile`).replace(/,.*/g,"")}
if (Valzek == ""){Valzek = "Valzek"}

var Arcon = '';
if (document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Arcon.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g) != null){
Arcon = document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Arcon.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g).toString().replaceAll("<td>","").replaceAll("</td>","<br>").replace(`<a href="crew_profile`,`<hr class="hr"><a href="crew_profile`).replace(/,.*/g,"")}
if (Arcon == ""){Arcon = "Arcon"}

var Firan = '';
if (document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Firan.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g) != null){
Firan = document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Firan.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g).toString().replaceAll("<td>","").replaceAll("</td>","<br>").replace(`<a href="crew_profile`,`<hr class="hr"><a href="crew_profile`).replace(/,.*/g,"")}
if (Firan == ""){Firan = "Firan"}

var Kinark = '';
if (document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Kinark.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g) != null){
Kinark = document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Kinark.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g).toString().replaceAll("<td>","").replaceAll("</td>","<br>").replace(`<a href="crew_profile`,`<hr class="hr"><a href="crew_profile`).replace(/,.*/g,"")}
if (Kinark == ""){Kinark = "Kinark"}

var Shayar = '';
if (document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Shayar.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g) != null){
Shayar = document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Shayar.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g).toString().replaceAll("<td>","").replaceAll("</td>","<br>").replace(`<a href="crew_profile`,`<hr class="hr"><a href="crew_profile`).replace(/,.*/g,"")}
if (Shayar == ""){Shayar = "Shayar"}

var Holgor = '';
if (document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Holgor.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g) != null){
Holgor = document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Holgor.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g).toString().replaceAll("<td>","").replaceAll("</td>","<br>").replace(`<a href="crew_profile`,`<hr class="hr"><a href="crew_profile`).replace(/,.*/g,"")}
if (Holgor == ""){Holgor = "Holgor"}

var Envar = '';
if (document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Envar.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g) != null){
Envar = document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Envar.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g).toString().replaceAll("<td>","").replaceAll("</td>","<br>").replace(`<a href="crew_profile`,`<hr class="hr"><a href="crew_profile`).replace(/,.*/g,"")}
if (Envar == ""){Envar = "Envar"}

var Banok = '';
if (document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Banok.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g) != null){
Banok = document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Banok.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g).toString().replaceAll("<td>","").replaceAll("</td>","<br>").replace(`<a href="crew_profile`,`<hr class="hr"><a href="crew_profile`).replace(/,.*/g,"")}
if (Banok == ""){Banok = "Banok"}

var Rezun = '';
if (document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Rezun.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g) != null){
Rezun = document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Rezun.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g).toString().replaceAll("<td>","").replaceAll("</td>","<br>").replace(`<a href="crew_profile`,`<hr class="hr"><a href="crew_profile`).replace(/,.*/g,"")}
if (Rezun == ""){Rezun = "Rezun"}

var Rillax = '';
if (document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Rillax.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g) != null){
Rillax = document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Rillax.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g).toString().replaceAll("<td>","").replaceAll("</td>","<br>").replace(`<a href="crew_profile`,`<hr class="hr"><a href="crew_profile`).replace(/,.*/g,"")}
if (Rillax == ""){Rillax = "Rillax"}

var Villax = '';
if (document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Villax.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g) != null){
Villax = document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Villax.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g).toString().replaceAll("<td>","").replaceAll("</td>","<br>").replace(`<a href="crew_profile`,`<hr class="hr"><a href="crew_profile`).replace(/,.*/g,"")}
if (Villax == ""){Villax = "Villax"}

var Dexor = '';
if (document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Dexor.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g) != null){
Dexor = document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Dexor.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g).toString().replaceAll("<td>","").replaceAll("</td>","<br>").replace(`<a href="crew_profile`,`<hr class="hr"><a href="crew_profile`).replace(/,.*/g,"")}
if (Dexor == ""){Dexor = "Dexor"}

var Gregov = '';
if (document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Gregov.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g) != null){
Gregov = document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Gregov.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g).toString().replaceAll("<td>","").replaceAll("</td>","<br>").replace(`<a href="crew_profile`,`<hr class="hr"><a href="crew_profile`).replace(/,.*/g,"")}
if (Gregov == ""){Gregov = "Gregov"}

var Murfax = '';
if (document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Murfax.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g) != null){
Murfax = document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Murfax.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g).toString().replaceAll("<td>","").replaceAll("</td>","<br>").replace(`<a href="crew_profile`,`<hr class="hr"><a href="crew_profile`).replace(/,.*/g,"")}
if (Murfax == ""){Murfax = "Murfax"}

var Thanox = '';
if (document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Thanox.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g) != null){
Thanox = document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Thanox.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g).toString().replaceAll("<td>","").replaceAll("</td>","<br>").replace(`<a href="crew_profile`,`<hr class="hr"><a href="crew_profile`).replace(/,.*/g,"")}
if (Thanox == ""){Thanox = "Thanox"}

var Skarthul = '';
if (document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Skarthul.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g) != null){
Skarthul = document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Skarthul.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g).toString().replaceAll("<td>","").replaceAll("</td>","<br>").replace(`<a href="crew_profile`,`<hr class="hr"><a href="crew_profile`).replace(/,.*/g,"")}
if (Skarthul == ""){Skarthul = "Skarthul"}

var Straya = '';
if (document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Straya.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g) != null){
Straya = document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Straya.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g).toString().replaceAll("<td>","").replaceAll("</td>","<br>").replace(`<a href="crew_profile`,`<hr class="hr"><a href="crew_profile`).replace(/,.*/g,"")}
if (Straya == ""){Straya = "Straya"}

var Dlanod = '';
if (document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Dlanod.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g) != null){
Dlanod = document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Dlanod.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g).toString().replaceAll("<td>","").replaceAll("</td>","<br>").replace(`<a href="crew_profile`,`<hr class="hr"><a href="crew_profile`).replace(/,.*/g,"")}
if (Dlanod == ""){Dlanod = "Dlanod"}

var Viserion = '';
if (document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Viserion.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g) != null){
Viserion = document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Viserion.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g).toString().replaceAll("<td>","").replaceAll("</td>","<br>").replace(`<a href="crew_profile`,`<hr class="hr"><a href="crew_profile`).replace(/,.*/g,"")}
if (Viserion == ""){Viserion = "Viserion"}

var Balerion = '';
if (document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Balerion.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g) != null){
Balerion = document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Balerion.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g).toString().replaceAll("<td>","").replaceAll("</td>","<br>").replace(`<a href="crew_profile`,`<hr class="hr"><a href="crew_profile`).replace(/,.*/g,"")}
if (Balerion == ""){Balerion = "Balerion"}

var Xynak = '';
if (document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Xynak.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g) != null){
Xynak = document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Xynak.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g).toString().replaceAll("<td>","").replaceAll("</td>","<br>").replace(`<a href="crew_profile`,`<hr class="hr"><a href="crew_profile`).replace(/,.*/g,"")}
if (Xynak == ""){Xynak = "Xynak"}

var Crolvak = '';
if (document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Crolvak.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g) != null){
Crolvak = document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Crolvak.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g).toString().replaceAll("<td>","").replaceAll("</td>","<br>").replace(`<a href="crew_profile`,`<hr class="hr"><a href="crew_profile`).replace(/,.*/g,"")}
if (Crolvak == ""){Crolvak = "Crolvak"}

var Esquin = '';
if (document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Esquin.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g) != null){
Esquin = document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Esquin.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g).toString().replaceAll("<td>","").replaceAll("</td>","<br>").replace(`<a href="crew_profile`,`<hr class="hr"><a href="crew_profile`).replace(/,.*/g,"")}
if (Esquin == ""){Esquin = "Esquin"}

var Raiyar = '';
if (document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Raiyar, the Shadow Master.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g) != null){
Raiyar = document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Raiyar, the Shadow Master.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g).toString().replaceAll("<td>","").replaceAll("</td>","<br>").replace(`<a href="crew_profile`,`<hr class="hr"><a href="crew_profile`).replace(/,.*/g,"")}
if (Raiyar == ""){Raiyar = "Raiyar"}

var Bolkor = '';
if (document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Bolkor.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g) != null){
Bolkor = document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Bolkor.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g).toString().replaceAll("<td>","").replaceAll("</td>","<br>").replace(`<a href="crew_profile`,`<hr class="hr"><a href="crew_profile`).replace(/,.*/g,"")}
if (Bolkor == ""){Bolkor = "Bolkor"}

var Nafir = '';
if (document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Nafir.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g) != null){
Nafir = document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Nafir.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g).toString().replaceAll("<td>","").replaceAll("</td>","<br>").replace(`<a href="crew_profile`,`<hr class="hr"><a href="crew_profile`).replace(/,.*/g,"")}
if (Nafir == ""){Nafir = "Nafir"}

var Yirkon = '';
if (document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Yirkon.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g) != null){
Yirkon = document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Yirkon.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g).toString().replaceAll("<td>","").replaceAll("</td>","<br>").replace(`<a href="crew_profile`,`<hr class="hr"><a href="crew_profile`).replace(/,.*/g,"")}
if (Yirkon == ""){Yirkon = "Yirkon"}

var Keeper = '';
if (document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Keeper of Nature.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g) != null){
Keeper = document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Keeper of Nature.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g).toString().replaceAll("<td>","").replaceAll("</td>","<br>").replace(`<a href="crew_profile`,`<hr class="hr"><a href="crew_profile`).replace(/,.*/g,"")}
if (Keeper == ""){Keeper = "Keeper"}

var Akkel = '';
if (document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Akkel.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g) != null){
Akkel = document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Akkel.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g).toString().replaceAll("<td>","").replaceAll("</td>","<br>").replace(`<a href="crew_profile`,`<hr class="hr"><a href="crew_profile`).replace(/,.*/g,"")}
if (Akkel == ""){Akkel = "Akkel"}

var Nayark = '';
if (document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Nayark.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g) != null){
Nayark = document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Nayark.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g).toString().replaceAll("<td>","").replaceAll("</td>","<br>").replace(`<a href="crew_profile`,`<hr class="hr"><a href="crew_profile`).replace(/,.*/g,"")}
if (Nayark == ""){Nayark = "Nayark"}

var Apparition = '';
if (document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Apparition.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g) != null){
Apparition = document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Apparition.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g).toString().replaceAll("<td>","").replaceAll("</td>","<br>").replace(`<a href="crew_profile`,`<hr class="hr"><a href="crew_profile`).replace(/,.*/g,"")}
if (Apparition == ""){Apparition = "Apparition"}

var Zikkir = '';
if (document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Zikkir.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g) != null){
Zikkir = document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Zikkir.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g).toString().replaceAll("<td>","").replaceAll("</td>","<br>").replace(`<a href="crew_profile`,`<hr class="hr"><a href="crew_profile`).replace(/,.*/g,"")}
if (Zikkir == ""){Zikkir = "Zikkir"}

var Volgan = '';
if (document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Volgan.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g) != null){
Volgan = document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Volgan.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g).toString().replaceAll("<td>","").replaceAll("</td>","<br>").replace(`<a href="crew_profile`,`<hr class="hr"><a href="crew_profile`).replace(/,.*/g,"")}
if (Volgan == ""){Volgan = "Volgan"}

var Jorun = '';
if (document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Jorun.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g) != null){
Jorun = document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Jorun.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g).toString().replaceAll("<td>","").replaceAll("</td>","<br>").replace(`<a href="crew_profile`,`<hr class="hr"><a href="crew_profile`).replace(/,.*/g,"")}
if (Jorun == ""){Jorun = "Jorun"}

var Tarkin = '';
if (document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Tarkin.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g) != null){
Tarkin = document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Tarkin.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g).toString().replaceAll("<td>","").replaceAll("</td>","<br>").replace(`<a href="crew_profile`,`<hr class="hr"><a href="crew_profile`).replace(/,.*/g,"")}
if (Tarkin == ""){Tarkin = "Tarkin"}

var Sacrina = '';
if (document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Sacrina.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g) != null){
Sacrina = document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Sacrina.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g).toString().replaceAll("<td>","").replaceAll("</td>","<br>").replace(`<a href="crew_profile`,`<hr class="hr"><a href="crew_profile`).replace(/,.*/g,"")}
if (Sacrina == ""){Sacrina = "Sacrina"}

var Karvaz = '';
if (document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Karvaz.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g) != null){
Karvaz = document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Karvaz.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g).toString().replaceAll("<td>","").replaceAll("</td>","<br>").replace(`<a href="crew_profile`,`<hr class="hr"><a href="crew_profile`).replace(/,.*/g,"")}
if (Karvaz == ""){Karvaz = "Karvaz"}

var Felroc = '';
if (document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Felroc.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g) != null){
Felroc = document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Felroc.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g).toString().replaceAll("<td>","").replaceAll("</td>","<br>").replace(`<a href="crew_profile`,`<hr class="hr"><a href="crew_profile`).replace(/,.*/g,"")}
if (Felroc == ""){Felroc = "Felroc"}

var Kretok = '';
if (document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Kretok.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g) != null){
Kretok = document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Kretok.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g).toString().replaceAll("<td>","").replaceAll("</td>","<br>").replace(`<a href="crew_profile`,`<hr class="hr"><a href="crew_profile`).replace(/,.*/g,"")}
if (Kretok == ""){Kretok = "Kretok"}

var Drake = '';
if (document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Drake.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g) != null){
Drake = document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Drake.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g).toString().replaceAll("<td>","").replaceAll("</td>","<br>").replace(`<a href="crew_profile`,`<hr class="hr"><a href="crew_profile`).replace(/,.*/g,"")}
if (Drake == ""){Drake = "Drake"}

var Captain = '';
if (document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Captain.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g) != null){
Captain = document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Captain.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g).toString().replaceAll("<td>","").replaceAll("</td>","<br>").replace(`<a href="crew_profile`,`<hr class="hr"><a href="crew_profile`).replace(/,.*/g,"")}
if (Captain == ""){Captain = "Captain"}

var Qsec = '';
if (document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Q-SEC.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g) != null){
Qsec = document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Q-SEC.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g).toString().replaceAll("<td>","").replaceAll("</td>","<br>").replace(`<a href="crew_profile`,`<hr class="hr"><a href="crew_profile`).replace(/,.*/g,"")}
if (Qsec == ""){Qsec = "Q-SEC"}

var Dragonite = '';
if (document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Dragonite.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g) != null){
Dragonite = document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Dragonite.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g).toString().replaceAll("<td>","").replaceAll("</td>","<br>").replace(`<a href="crew_profile`,`<hr class="hr"><a href="crew_profile`).replace(/,.*/g,"")}
if (Dragonite == ""){Dragonite = "Dragonite"}

var Beast = '';
if (document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Beast.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g) != null){
Beast = document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Beast.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g).toString().replaceAll("<td>","").replaceAll("</td>","<br>").replace(`<a href="crew_profile`,`<hr class="hr"><a href="crew_profile`).replace(/,.*/g,"")}
if (Beast == ""){Beast = "Beast"}

var Slug = '';
if (document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Slug.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g) != null){
Slug = document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Slug.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g).toString().replaceAll("<td>","").replaceAll("</td>","<br>").replace(`<a href="crew_profile`,`<hr class="hr"><a href="crew_profile`).replace(/,.*/g,"")}
if (Slug == ""){Slug = "Slug"}

var Sylvanna = '';
if (document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Sylvanna.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g) != null){
Sylvanna = document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Sylvanna.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g).toString().replaceAll("<td>","").replaceAll("</td>","<br>").replace(`<a href="crew_profile`,`<hr class="hr"><a href="crew_profile`).replace(/,.*/g,"")}
if (Sylvanna == ""){Sylvanna = "Sylvanna"}

var Lacuste = '';
if (document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Lacuste.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g) != null){
Lacuste = document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Lacuste.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g).toString().replaceAll("<td>","").replaceAll("</td>","<br>").replace(`<a href="crew_profile`,`<hr class="hr"><a href="crew_profile`).replace(/,.*/g,"")}
if (Lacuste == ""){Lacuste = "Lacuste"}

var Anvilfist = '';
if (document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Anvilfist.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g) != null){
Anvilfist = document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Anvilfist.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g).toString().replaceAll("<td>","").replaceAll("</td>","<br>").replace(`<a href="crew_profile`,`<hr class="hr"><a href="crew_profile`).replace(/,.*/g,"")}
if (Anvilfist == ""){Anvilfist = "Anvilfist"}

var Gorganus = '';
if (document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Gorganus.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g) != null){
Gorganus = document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Gorganus.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g).toString().replaceAll("<td>","").replaceAll("</td>","<br>").replace(`<a href="crew_profile`,`<hr class="hr"><a href="crew_profile`).replace(/,.*/g,"")}
if (Gorganus == ""){Gorganus = "Gorganus"}

var Ormsul = '';
if (document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Ormsul.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g) != null){
Ormsul = document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Ormsul.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g).toString().replaceAll("<td>","").replaceAll("</td>","<br>").replace(`<a href="crew_profile`,`<hr class="hr"><a href="crew_profile`).replace(/,.*/g,"")}
if (Ormsul == ""){Ormsul = "Ormsul"}

var Skybrine = '';
if (document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Skybrine.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g) != null){
Skybrine = document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Skybrine.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g).toString().replaceAll("<td>","").replaceAll("</td>","<br>").replace(`<a href="crew_profile`,`<hr class="hr"><a href="crew_profile`).replace(/,.*/g,"")}
if (Skybrine == ""){Skybrine = "Skybrine"}

var Windstrike = '';
if (document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Windstrike.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g) != null){
Windstrike = document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Windstrike.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g).toString().replaceAll("<td>","").replaceAll("</td>","<br>").replace(`<a href="crew_profile`,`<hr class="hr"><a href="crew_profile`).replace(/,.*/g,"")}
if (Windstrike == ""){Windstrike = "Windstrike"}

var Grivvek = '';
if (document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Grivvek.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g) != null){
Grivvek = document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Grivvek.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g).toString().replaceAll("<td>","").replaceAll("</td>","<br>").replace(`<a href="crew_profile`,`<hr class="hr"><a href="crew_profile`).replace(/,.*/g,"")}
if (Grivvek == ""){Grivvek = "Grivvek"}

var Varsanor = '';
if (document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Varsanor.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g) != null){
Varsanor = document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Varsanor.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g).toString().replaceAll("<td>","").replaceAll("</td>","<br>").replace(`<a href="crew_profile`,`<hr class="hr"><a href="crew_profile`).replace(/,.*/g,"")}
if (Varsanor == ""){Varsanor = "Varsanor"}

var Crantos = '';
if (document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Crantos.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g) != null){
Crantos = document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Crantos.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g).toString().replaceAll("<td>","").replaceAll("</td>","<br>").replace(`<a href="crew_profile`,`<hr class="hr"><a href="crew_profile`).replace(/,.*/g,"")}
if (Crantos == ""){Crantos = "Crantos"}

var Emerald = '';
if (document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Emerald.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g) != null){
Emerald = document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Emerald.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g).toString().replaceAll("<td>","").replaceAll("</td>","<br>").replace(`<a href="crew_profile`,`<hr class="hr"><a href="crew_profile`).replace(/,.*/g,"")}
if (Emerald == ""){Emerald = "Emerald"}

var Murderface = '';
if (document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Murderface.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g) != null){
Murderface = document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Murderface.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g).toString().replaceAll("<td>","").replaceAll("</td>","<br>").replace(`<a href="crew_profile`,`<hr class="hr"><a href="crew_profile`).replace(/,.*/g,"")}
if (Murderface == ""){Murderface = "Murderface"}

var Detox = '';
if (document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Detox.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g) != null){
Detox = document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Detox.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g).toString().replaceAll("<td>","").replaceAll("</td>","<br>").replace(`<a href="crew_profile`,`<hr class="hr"><a href="crew_profile`).replace(/,.*/g,"")}
if (Detox == ""){Detox = "Detox"}

var Samatha = '';
if (document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Samatha.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g) != null){
Samatha = document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Samatha.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g).toString().replaceAll("<td>","").replaceAll("</td>","<br>").replace(`<a href="crew_profile`,`<hr class="hr"><a href="crew_profile`).replace(/,.*/g,"")}
if (Samatha == ""){Samatha = "Samatha"}

var Anguish = '';
if (document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Anguish.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g) != null){
Anguish = document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Anguish.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g).toString().replaceAll("<td>","").replaceAll("</td>","<br>").replace(`<a href="crew_profile`,`<hr class="hr"><a href="crew_profile`).replace(/,.*/g,"")}
if (Anguish == ""){Anguish = "Anguish"}

var Numerocure = '';
if (document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Numerocure.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g) != null){
Numerocure = document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Numerocure.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g).toString().replaceAll("<td>","").replaceAll("</td>","<br>").replace(`<a href="crew_profile`,`<hr class="hr"><a href="crew_profile`).replace(/,.*/g,"")}
if (Numerocure == ""){Numerocure = "Numerocure"}

var Hackerphage = '';
if (document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Hackerphage.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g) != null){
Hackerphage = document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Hackerphage.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g).toString().replaceAll("<td>","").replaceAll("</td>","<br>").replace(`<a href="crew_profile`,`<hr class="hr"><a href="crew_profile`).replace(/,.*/g,"")}
if (Hackerphage == ""){Hackerphage = "Hackerphage"}

var Howldroid = '';
if (document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Howldroid.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g) != null){
Howldroid = document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Howldroid.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g).toString().replaceAll("<td>","").replaceAll("</td>","<br>").replace(`<a href="crew_profile`,`<hr class="hr"><a href="crew_profile`).replace(/,.*/g,"")}
if (Howldroid == ""){Howldroid = "Howldroid"}

var Slashbrood = '';
if (document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Slashbrood.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g) != null){
Slashbrood = document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Slashbrood.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g).toString().replaceAll("<td>","").replaceAll("</td>","<br>").replace(`<a href="crew_profile`,`<hr class="hr"><a href="crew_profile`).replace(/,.*/g,"")}
if (Slashbrood == ""){Slashbrood = "Slashbrood"}

var Neudeus = '';
if (document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Neudeus.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g) != null){
Neudeus = document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Neudeus.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g).toString().replaceAll("<td>","").replaceAll("</td>","<br>").replace(`<a href="crew_profile`,`<hr class="hr"><a href="crew_profile`).replace(/,.*/g,"")}
if (Neudeus == ""){Neudeus = "Neudeus"}

var Baron = '';
if (document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Baron.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g) != null){
Baron = document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Baron.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g).toString().replaceAll("<td>","").replaceAll("</td>","<br>").replace(`<a href="crew_profile`,`<hr class="hr"><a href="crew_profile`).replace(/,.*/g,"")}
if (Baron == ""){Baron = "Baron"}

var Freezebreed = '';
if (document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Freezebreed.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g) != null){
Freezebreed = document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Freezebreed.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g).toString().replaceAll("<td>","").replaceAll("</td>","<br>").replace(`<a href="crew_profile`,`<hr class="hr"><a href="crew_profile`).replace(/,.*/g,"")}
if (Freezebreed == ""){Freezebreed = "Freezebreed"}

var Rotborn = '';
if (document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Rotborn.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g) != null){
Rotborn = document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Rotborn.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g).toString().replaceAll("<td>","").replaceAll("</td>","<br>").replace(`<a href="crew_profile`,`<hr class="hr"><a href="crew_profile`).replace(/,.*/g,"")}
if (Rotborn == ""){Rotborn = "Rotborn"}

var Melt = '';
if (document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Melt.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g) != null){
Melt = document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Melt.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g).toString().replaceAll("<td>","").replaceAll("</td>","<br>").replace(`<a href="crew_profile`,`<hr class="hr"><a href="crew_profile`).replace(/,.*/g,"")}
if (Melt == ""){Melt = "Melt"}

var Chaos = '';
if (document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Lady Chaos.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g) != null){
Chaos = document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Lady Chaos.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g).toString().replaceAll("<td>","").replaceAll("</td>","<br>").replace(`<a href="crew_profile`,`<hr class="hr"><a href="crew_profile`).replace(/,.*/g,"")}
if (Chaos == ""){Chaos = "Chaos"}

var Gnorb = '';
if (document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Gnorb.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g) != null){
Gnorb = document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Gnorb.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g).toString().replaceAll("<td>","").replaceAll("</td>","<br>").replace(`<a href="crew_profile`,`<hr class="hr"><a href="crew_profile`).replace(/,.*/g,"")}
if (Gnorb == ""){Gnorb = "Gnorb"}

var Nessam = '';
if (document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Nessam.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g) != null){
Nessam = document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Nessam.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g).toString().replaceAll("<td>","").replaceAll("</td>","<br>").replace(`<a href="crew_profile`,`<hr class="hr"><a href="crew_profile`).replace(/,.*/g,"")}
if (Nessam == ""){Nessam = "Nessam"}

var Crane = '';
if (document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Crane.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g) != null){
Crane = document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Crane.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g).toString().replaceAll("<td>","").replaceAll("</td>","<br>").replace(`<a href="crew_profile`,`<hr class="hr"><a href="crew_profile`).replace(/,.*/g,"")}
if (Crane == ""){Crane = "Crane"}

var Pinosis = '';
if (document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Pinosis.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g) != null){
Pinosis = document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Pinosis.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g).toString().replaceAll("<td>","").replaceAll("</td>","<br>").replace(`<a href="crew_profile`,`<hr class="hr"><a href="crew_profile`).replace(/,.*/g,"")}
if (Pinosis == ""){Pinosis = "Pinosis"}

var Tsort = '';
if (document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Tsort.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g) != null){
Tsort = document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Tsort.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g).toString().replaceAll("<td>","").replaceAll("</td>","<br>").replace(`<a href="crew_profile`,`<hr class="hr"><a href="crew_profile`).replace(/,.*/g,"")}
if (Tsort == ""){Tsort = "Tsort"}

var Shadow = '';
if (document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Shadow<\/a>.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g) != null){
Shadow = document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Shadow<\/a>.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g).toString().replaceAll("<td>","").replaceAll("</td>","<br>").replace(`<a href="crew_profile`,`<hr class="hr"><a href="crew_profile`).replace(/,.*/g,"")}
if (Shadow == ""){Shadow = "Shadow"}

var Xordam = '';
if (document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Xordam.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g) != null){
Xordam = document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Xordam.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g).toString().replaceAll("<td>","").replaceAll("</td>","<br>").replace(`<a href="crew_profile`,`<hr class="hr"><a href="crew_profile`).replace(/,.*/g,"")}
if (Xordam == ""){Xordam = "Xordam"}

var Ebliss = '';
if (document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Ebliss.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g) != null){
Ebliss = document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Ebliss.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g).toString().replaceAll("<td>","").replaceAll("</td>","<br>").replace(`<a href="crew_profile`,`<hr class="hr"><a href="crew_profile`).replace(/,.*/g,"")}
if (Ebliss == ""){
Ebliss = "Ebliss"}

var Brutalitar = '';
if (document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Brutalitar.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g) != null){
Brutalitar = document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Brutalitar.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g).toString().replaceAll("<td>","").replaceAll("</td>","<br>").replace(`<a href="crew_profile`,`<hr class="hr"><a href="crew_profile`).replace(/,.*/g,"")}
if (Brutalitar == ""){Brutalitar = "Brutalitar"}

var Dreg = '';
if (document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Dreg.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g) != null){
Dreg = document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Dreg.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g).toString().replaceAll("<td>","").replaceAll("</td>","<br>").replace(`<a href="crew_profile`,`<hr class="hr"><a href="crew_profile`).replace(/,.*/g,"")}
if (Dreg == ""){Dreg = "Dreg"}

var Ashnar = '';
if (document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Ashnar.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g) != null){
Ashnar = document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Ashnar.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g).toString().replaceAll("<td>","").replaceAll("</td>","<br>").replace(`<a href="crew_profile`,`<hr class="hr"><a href="crew_profile`).replace(/,.*/g,"")}
if (Ashnar == ""){Ashnar = "Ashnar"}

var Zhul = '';
if (document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Zhul.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g) != null){
Zhul = document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Zhul.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g).toString().replaceAll("<td>","").replaceAll("</td>","<br>").replace(`<a href="crew_profile`,`<hr class="hr"><a href="crew_profile`).replace(/,.*/g,"")}
if (Zhul == ""){Zhul = "Zhul"}

var Ganja = '';
if (document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Ganja.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g) != null){
Ganja = document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Ganja.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g).toString().replaceAll("<td>","").replaceAll("</td>","<br>").replace(`<a href="crew_profile`,`<hr class="hr"><a href="crew_profile`).replace(/,.*/g,"")}
if (Ganja == ""){Ganja = "Ganja"}

var Sibannac = '';
if (document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Sibannac.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g) != null){
Sibannac = document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Sibannac.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g).toString().replaceAll("<td>","").replaceAll("</td>","<br>").replace(`<a href="crew_profile`,`<hr class="hr"><a href="crew_profile`).replace(/,.*/g,"")}
if (Sibannac == ""){Sibannac = "Sibannac"}

var Smoot = '';
if (document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Smoot.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g) != null){
Smoot = document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Smoot.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g).toString().replaceAll("<td>","").replaceAll("</td>","<br>").replace(`<a href="crew_profile`,`<hr class="hr"><a href="crew_profile`).replace(/,.*/g,"")}
if (Smoot == ""){Smoot = "Smoot"}

var Bloodchill = '';
if (document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Bloodchill.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g) != null){
Bloodchill = document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Bloodchill.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g).toString().replaceAll("<td>","").replaceAll("</td>","<br>").replace(`<a href="crew_profile`,`<hr class="hr"><a href="crew_profile`).replace(/,.*/g,"")}
if (Bloodchill == ""){Bloodchill = "Bloodchill"}

var Nabak = '';
if (document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Nabak.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g) != null){
Nabak = document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Nabak.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g).toString().replaceAll("<td>","").replaceAll("</td>","<br>").replace(`<a href="crew_profile`,`<hr class="hr"><a href="crew_profile`).replace(/,.*/g,"")}
if (Nabak == ""){Nabak = "Nabak"}

var Shuk = '';
if (document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Shuk.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g) != null){
Shuk = document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Shuk.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g).toString().replaceAll("<td>","").replaceAll("</td>","<br>").replace(`<a href="crew_profile`,`<hr class="hr"><a href="crew_profile`).replace(/,.*/g,"")}
if (Shuk == ""){Shuk = "Shuk"}

var Varan = '';
if (document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Varan.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g) != null){
Varan = document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Varan.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g).toString().replaceAll("<td>","").replaceAll("</td>","<br>").replace(`<a href="crew_profile`,`<hr class="hr"><a href="crew_profile`).replace(/,.*/g,"")}
if (Varan == ""){Varan = "Varan"}

var Narada = '';
if (document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Narada.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g) != null){
Narada = document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Narada.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g).toString().replaceAll("<td>","").replaceAll("</td>","<br>").replace(`<a href="crew_profile`,`<hr class="hr"><a href="crew_profile`).replace(/,.*/g,"")}
if (Narada == ""){Narada = "Narada"}

var Ariella = '';
if (document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Ariella.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g) != null){
Ariella = document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Ariella.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g).toString().replaceAll("<td>","").replaceAll("</td>","<br>").replace(`<a href="crew_profile`,`<hr class="hr"><a href="crew_profile`).replace(/,.*/g,"")}
if (Ariella == ""){Ariella = "Ariella"}

var Suka = '';
if (document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Suka.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g) != null){
Suka = document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Suka.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g).toString().replaceAll("<td>","").replaceAll("</td>","<br>").replace(`<a href="crew_profile`,`<hr class="hr"><a href="crew_profile`).replace(/,.*/g,"")}
if (Suka == ""){Suka = "Suka"}

var Ganeshan = '';
if (document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Ganeshan.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g) != null){
Ganeshan = document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Ganeshan.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g).toString().replaceAll("<td>","").replaceAll("</td>","<br>").replace(`<a href="crew_profile`,`<hr class="hr"><a href="crew_profile`).replace(/,.*/g,"")}
if (Ganeshan == ""){Ganeshan = "Ganeshan"}

var Garland = '';
if (document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Garland.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g) != null){
Garland = document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Garland.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g).toString().replaceAll("<td>","").replaceAll("</td>","<br>").replace(`<a href="crew_profile`,`<hr class="hr"><a href="crew_profile`).replace(/,.*/g,"")}
if (Garland == ""){Garland = "Garland"}

var Tylos = '';
if (document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Tylos.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g) != null){
Tylos = document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Tylos.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g).toString().replaceAll("<td>","").replaceAll("</td>","<br>").replace(`<a href="crew_profile`,`<hr class="hr"><a href="crew_profile`).replace(/,.*/g,"")}
if (Tylos == ""){Tylos = "Tylos"}

var Threk = '';
if (document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Threk.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g) != null){
Threk = document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Threk.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g).toString().replaceAll("<td>","").replaceAll("</td>","<br>").replace(`<a href="crew_profile`,`<hr class="hr"><a href="crew_profile`).replace(/,.*/g,"")}
if (Threk == ""){Threk = "Threk"}

var Jazzmin = '';
if (document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Jazzmin.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g) != null){
Jazzmin = document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Jazzmin.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g).toString().replaceAll("<td>","").replaceAll("</td>","<br>").replace(`<a href="crew_profile`,`<hr class="hr"><a href="crew_profile`).replace(/,.*/g,"")}
if (Jazzmin == ""){Jazzmin = "Jazzmin"}

var Sigil = '';
if (document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Sigil.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g) != null){
Sigil = document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Sigil.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g).toString().replaceAll("<td>","").replaceAll("</td>","<br>").replace(`<a href="crew_profile`,`<hr class="hr"><a href="crew_profile`).replace(/,.*/g,"")}
if (Sigil == ""){Sigil = "Sigil"}

var Synge = '';
if (document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Synge.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g) != null){
Synge = document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Synge.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g).toString().replaceAll("<td>","").replaceAll("</td>","<br>").replace(`<a href="crew_profile`,`<hr class="hr"><a href="crew_profile`).replace(/,.*/g,"")}
if (Synge == ""){Synge = "Synge"}

var Rancid = '';
if (document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Rancid.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g) != null){
Rancid = document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Rancid.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g).toString().replaceAll("<td>","").replaceAll("</td>","<br>").replace(`<a href="crew_profile`,`<hr class="hr"><a href="crew_profile`).replace(/,.*/g,"")}
if (Rancid == ""){Rancid = "Rancid"}

var Terrance = '';
if (document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Terrance.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g) != null){
Terrance = document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Terrance.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g).toString().replaceAll("<td>","").replaceAll("</td>","<br>").replace(`<a href="crew_profile`,`<hr class="hr"><a href="crew_profile`).replace(/,.*/g,"")}
if (Terrance == ""){Terrance = "Terrance"}

var Zertan = '';
if (document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Zertan.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g) != null){
Zertan = document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Zertan.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g).toString().replaceAll("<td>","").replaceAll("</td>","<br>").replace(`<a href="crew_profile`,`<hr class="hr"><a href="crew_profile`).replace(/,.*/g,"")}
if (Zertan == ""){Zertan = "Zertan"}

var Quiver = '';
if (document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Quiver.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g) != null){
Quiver = document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Quiver.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g).toString().replaceAll("<td>","").replaceAll("</td>","<br>").replace(`<a href="crew_profile`,`<hr class="hr"><a href="crew_profile`).replace(/,.*/g,"")}
if (Quiver == ""){Quiver = "Quiver"}

var Wanhiroeaz = '';
if (document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Wanhiroeaz.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g) != null){
Wanhiroeaz = document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Wanhiroeaz.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g).toString().replaceAll("<td>","").replaceAll("</td>","<br>").replace(`<a href="crew_profile`,`<hr class="hr"><a href="crew_profile`).replace(/,.*/g,"")}
if (Wanhiroeaz == ""){Wanhiroeaz = "Wanhiroeaz"}

var Vitkros = '';
if (document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Vitkros.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g) != null){
Vitkros = document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Vitkros.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g).toString().replaceAll("<td>","").replaceAll("</td>","<br>").replace(`<a href="crew_profile`,`<hr class="hr"><a href="crew_profile`).replace(/,.*/g,"")}
if (Vitkros == ""){Vitkros = "Vitkros"}

var Hyrak = '';
if (document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Hyrak.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g) != null){
Hyrak = document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Hyrak.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g).toString().replaceAll("<td>","").replaceAll("</td>","<br>").replace(`<a href="crew_profile`,`<hr class="hr"><a href="crew_profile`).replace(/,.*/g,"")}
if (Hyrak == ""){Hyrak = "Hyrak"}

var Mistress = '';
if (document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Mistress.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g) != null){
Mistress = document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Mistress.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g).toString().replaceAll("<td>","").replaceAll("</td>","<br>").replace(`<a href="crew_profile`,`<hr class="hr"><a href="crew_profile`).replace(/,.*/g,"")}
if (Mistress == ""){Mistress = "Mistress"}

var Traxodon = '';
if (document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Traxodon.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g) != null){
Traxodon = document.querySelector("#content-header-row > div > table").innerHTML.match(/<a href="raidattack\.php\?raidid=.*">.*Traxodon.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]/g).toString().replaceAll("<td>","").replaceAll("</td>","<br>").replace(`<a href="crew_profile`,`<hr class="hr"><a href="crew_profile`).replace(/,.*/g,"")}
if (Traxodon == ""){Traxodon = "Traxodon"}

var header = document.querySelector("#content-header-row > h2")

var style2 = "height:492px;width:492px;opacity:15%;border-radius:30px;background:transparent;margin:16px;"
var style3 = "height:324px;width:324px;opacity:15%;border-radius:30px;background:transparent;margin:14px;"
var style4 = "height:241px;width:241px;opacity:15%;border-radius:30px;background:transparent;margin:12px;"
var style5 = "height:192px;width:192px;opacity:15%;border-radius:30px;background:transparent;margin:10px;"
var style6 = "height:160px;width:160px;opacity:15%;border-radius:30px;background:transparent;margin:8px;"
var style7 = "height:138px;width:138px;opacity:15%;border-radius:30px;background:transparent;margin:6px;"

var godtabs = `

GODS DEFEATED IN THE LAST 24 HOURS<p>

<table class="godstatus"><tr>
<td><div class="godbox"><img src=https://www.outwar.com/images/mobs/agnargod.png style="`+style2+`" alt="agnar"><div class="centered">`+Agnar+`</div></div></td>
<td><div class="godbox"><img src=https://www.outwar.com/images/mobs/valzekdeathgod.png style="`+style2+`" alt="valzek"><div class="centered">`+Valzek+`</div></div></td>
</tr></table>
<table class="godstatus"><tr>
<td><div class="godbox"><img src=https://www.outwar.com/images/mobs/arcongod.png style="`+style5+`" alt="arcon"><div class="centered">`+Arcon+`</div></div></td>
<td><div class="godbox"><img src=https://www.outwar.com/images/mobs/firangod.png style="`+style5+`" alt="firan"><div class="centered">`+Firan+`</div></div></td>
<td><div class="godbox"><img src=https://www.outwar.com/images/mobs/kinarkgod.png style="`+style5+`" alt="kinark"><div class="centered">`+Kinark+`</div></div></td>
<td><div class="godbox"><img src=https://www.outwar.com/images/mobs/shayargod.png style="`+style5+`" alt="shayar"><div class="centered">`+Shayar+`</div></div></td>
<td><div class="godbox"><img src=https://www.outwar.com/images/mobs/holgorgod.png style="`+style5+`" alt="holgor"><div class="centered">`+Holgor+`</div></div></td>
</tr></table>
<table class="godstatus"><tr>
<td><div class="godbox"><img src=https://www.outwar.com/images/mobs/vomgod1.jpg style="`+style5+`" alt="envar"><div class="centered">`+Envar+`</div></div></td>
<td><div class="godbox"><img src=https://www.outwar.com/images/mobs/vomgod2.jpg style="`+style5+`" alt="banok"><div class="centered">`+Banok+`</div></div></td>
<td><div class="godbox"><img src=https://www.outwar.com/images/mobs/vomgod3.jpg style="`+style5+`" alt="rezun"><div class="centered">`+Rezun+`</div></div></td>
<td><div class="godbox"><img src=https://www.outwar.com/images/mobs/Rillaxgod.png style="`+style5+`" alt="rillax"><div class="centered">`+Rillax+`</div></div></td>
<td><div class="godbox"><img src=https://www.outwar.com/images/mobs/villaxgod.png style="`+style5+`" alt="villax"><div class="centered">`+Villax+`</div></div></td>
</tr></table>
<table class="godstatus"><tr>
<td><div class="godbox"><img src=https://www.outwar.com/images/mobs/velgod1.jpg style="`+style4+`" alt="dexor"><div class="centered">`+Dexor+`</div></div></td>
<td><div class="godbox"><img src=https://www.outwar.com/images/mobs/velgod2.jpg style="`+style4+`" alt="gregov"><div class="centered">`+Gregov+`</div></div></td>
<td><div class="godbox"><img src=https://www.outwar.com/images/mobs/velgod3.jpg style="`+style4+`" alt="murfax"><div class="centered">`+Murfax+`</div></div></td>
<td><div class="godbox"><img src=https://www.outwar.com/images/mobs/velendgamegod.jpg style="`+style4+`" alt="thanox"><div class="centered">`+Thanox+`</div></div></td>
</tr></table>
<table class="godstatus"><tr>
<td><div class="godbox"><img src=https://www.outwar.com/images/mobs/moba98.jpg style="`+style5+`" alt="skarthul"><div class="centered">`+Skarthul+`</div></div></td>
<td><div class="godbox"><img src=https://www.outwar.com/images/mobs/mobb11.jpg style="`+style5+`" alt="straya"><div class="centered">`+Straya+`</div></div></td>
<td><div class="godbox"><img src=https://www.outwar.com/images/mobs/dlanod.jpg style="`+style5+`" alt="dlanod"><div class="centered">`+Dlanod+`</div></div></td>
<td><div class="godbox"><img src=https://www.outwar.com/images/mobs/winterosdragon1.jpg style="`+style5+`" alt="viserion"><div class="centered">`+Viserion+`</div></div></td>
<td><div class="godbox"><img src=https://www.outwar.com/images/mobs/mobe79.jpg style="`+style5+`" alt="balerion"><div class="centered">`+Balerion+`</div></div></td>
</tr></table>
<table class="godstatus"><tr>
<td><div class="godbox"><img src=https://www.outwar.com/images/mobs/runegod3arcane.jpg style="`+style6+`" alt="xynak"><div class="centered">`+Xynak+`</div></div></td>
<td><div class="godbox"><img src=https://www.outwar.com/images/mobs/runegod3fire.jpg style="`+style6+`" alt="crolvak"><div class="centered">`+Crolvak+`</div></div></td>
<td><div class="godbox"><img src=https://www.outwar.com/images/mobs/runegod3kinetic.jpg style="`+style6+`" alt="esquin"><div class="centered">`+Esquin+`</div></div></td>
<td><div class="godbox"><img src=https://www.outwar.com/images/mobs/runegod3shadow.jpg style="`+style6+`" alt="raiyar"><div class="centered">`+Raiyar+`</div></div></td>
<td><div class="godbox"><img src=https://www.outwar.com/images/mobs/runegod3holy.jpg style="`+style6+`" alt="bolkor"><div class="centered">`+Bolkor+`</div></div></td>
<td><div class="godbox"><img src=https://www.outwar.com/images/mobs/runegodultimate.jpg style="`+style6+`" alt="nafir"><div class="centered">`+Nafir+`</div></div></td>
</tr></table>
<table class="godstatus"><tr>
<td><div class="godbox"><img src=https://www.outwar.com/images/mobs/runegod2shadow.jpg style="`+style5+`" alt="yirkon"><div class="centered">`+Yirkon+`</div></div></td>
<td><div class="godbox"><img src=https://www.outwar.com/images/mobs/runegod2kinetic.jpg style="`+style5+`" alt="keeper"><div class="centered">`+Keeper+`</div></div></td>
<td><div class="godbox"><img src=https://www.outwar.com/images/mobs/runegod2fire.jpg style="`+style5+`" alt="akkel"><div class="centered">`+Akkel+`</div></div></td>
<td><div class="godbox"><img src=https://www.outwar.com/images/mobs/runegod2arcane.jpg style="`+style5+`" alt="nayark"><div class="centered">`+Nayark+`</div></div></td>
<td><div class="godbox"><img src=https://www.outwar.com/images/mobs/runegod2holy.jpg style="`+style5+`" alt="apparition"><div class="centered">`+Apparition+`</div></div></td>
</tr></table>
<table class="godstatus"><tr>
<td><div class="godbox"><img src=https://www.outwar.com/images/mobs/runegod1shadow.jpg style="`+style5+`" alt="zikkir"><div class="centered">`+Zikkir+`</div></div></td>
<td><div class="godbox"><img src=https://www.outwar.com/images/mobs/runegod1kinetic.jpg style="`+style5+`" alt="volgan"><div class="centered">`+Volgan+`</div></div></td>
<td><div class="godbox"><img src=https://www.outwar.com/images/mobs/runegod1fire.jpg style="`+style5+`" alt="jorun"><div class="centered">`+Jorun+`</div></div></td>
<td><div class="godbox"><img src=https://www.outwar.com/images/mobs/runegod1arcane.jpg style="`+style5+`" alt="tarkin"><div class="centered">`+Tarkin+`</div></div></td>
<td><div class="godbox"><img src=https://www.outwar.com/images/mobs/runegod1holy.jpg style="`+style5+`" alt="sacrina"><div class="centered">`+Sacrina+`</div></div></td>
</tr></table>
<table class="godstatus"><tr>
<td><div class="godbox"><img src=https://www.outwar.com/images/mobs/lordkarvazbase.jpg style="`+style3+`" alt="karvaz"><div class="centered">`+Karvaz+`</div></div></td>
<td><div class="godbox"><img src=https://www.outwar.com/images/mobs/firemob43.jpg style="`+style3+`" alt="felroc"><div class="centered">`+Felroc+`</div></div></td>
<td><div class="godbox"><img src=https://www.outwar.com/images/mobs/natureboss1.jpg style="`+style3+`" alt="kretok"><div class="centered">`+Kretok+`</div></div></td>
</tr></table>
<table class="godstatus"><tr>
<td><div class="godbox"><img src=https://www.outwar.com/images/under_undeadDragon.jpg style="`+style6+`" alt="drake"><div class="centered">`+Drake+`</div></div></td>
<td><div class="godbox"><img src=https://www.outwar.com/images/under_zombie1.jpg style="`+style6+`" alt="captain"><div class="centered">`+Captain+`</div></div></td>
<td><div class="godbox"><img src=https://www.outwar.com/images/mobs/qsecCommander.jpg style="`+style6+`" alt="qsec"><div class="centered">`+Qsec+`</div></div></td>
<td><div class="godbox"><img src=https://www.outwar.com/images/mobs/jadedragonite.jpg style="`+style6+`" alt="dragonite"><div class="centered">`+Dragonite+`</div></div></td>
<td><div class="godbox"><img src=https://www.outwar.com/images/mobs/cardBeast.jpg style="`+style6+`" alt="beast"><div class="centered">`+Beast+`</div></div></td>
<td><div class="godbox"><img src=https://www.outwar.com/images/mobs/noxSlug.jpg style="`+style6+`" alt="slug"><div class="centered">`+Slug+`</div></div></td>
</tr></table>
<table class="godstatus"><tr>
<td><div class="godbox"><img src=https://www.outwar.com/images/sylvanna_torlai.jpg style="`+style5+`" alt="sylvanna"><div class="centered">`+Sylvanna+`</div></div></td>
<td><div class="godbox"><img src=https://www.outwar.com/images/lacuste.jpg style="`+style5+`" alt="lacuste"><div class="centered">`+Lacuste+`</div></div></td>
<td><div class="godbox"><img src=https://www.outwar.com/images/anvilfist.jpg style="`+style5+`" alt="anvilfist"><div class="centered">`+Anvilfist+`</div></div></td>
<td><div class="godbox"><img src=https://www.outwar.com/images/gorganus.jpg style="`+style5+`" alt="gorganus"><div class="centered">`+Gorganus+`</div></div></td>
<td><div class="godbox"><img src=https://www.outwar.com/images/ormsul.jpg style="`+style5+`" alt="ormsul"><div class="centered">`+Ormsul+`</div></div></td>
</tr></table>
<table class="godstatus"><tr>
<td><div class="godbox"><img src=https://www.outwar.com/images/skyb.jpg style="`+style5+`" alt="skybrine"><div class="centered">`+Skybrine+`</div></div></td>
<td><div class="godbox"><img src=https://www.outwar.com/images/windstrike.jpg style="`+style5+`" alt="windstrike"><div class="centered">`+Windstrike+`</div></div></td>
<td><div class="godbox"><img src=https://www.outwar.com/images/mobs/zomg-assasinzz.jpg style="`+style5+`" alt="grivvek"><div class="centered">`+Grivvek+`</div></div></td>
<td><div class="godbox"><img src=https://www.outwar.com/images/mobs/Cave%20Bat%20Lord.jpg style="`+style5+`" alt="varsanor"><div class="centered">`+Varsanor+`</div></div></td>
<td><div class="godbox"><img src=https://www.outwar.com/images/mobs/bossqsecbloke.jpg style="`+style5+`" alt="crantos"><div class="centered">`+Crantos+`</div></div></td>
</tr></table>
<table class="godstatus"><tr>
<td><div class="godbox"><img src=https://www.outwar.com/images/zhulguardian1.gif style="`+style5+`" alt="emerald"><div class="centered">`+Emerald+`</div></div></td>
<td><div class="godbox"><img src=https://www.outwar.com/images/zhulguardian5.gif style="`+style5+`" alt="murderface"><div class="centered">`+Murderface+`</div></div></td>
<td><div class="godbox"><img src=https://www.outwar.com/images/zhulguardian4.gif style="`+style5+`" alt="detox"><div class="centered">`+Detox+`</div></div></td>
<td><div class="godbox"><img src=https://www.outwar.com/images/zhulguardian3.gif style="`+style5+`" alt="samatha"><div class="centered">`+Samatha+`</div></div></td>
<td><div class="godbox"><img src=https://www.outwar.com/images/zhulguardian2.gif style="`+style5+`" alt="anguish"><div class="centered">`+Anguish+`</div></div></td>
</tr></table>
<table class="godstatus"><tr>
<td><div class="godbox"><img src=https://www.outwar.com/images/coesmobs/mob7.jpg style="`+style4+`" alt="hackerphage"><div class="centered">`+Hackerphage+`</div></div></td>
<td><div class="godbox"><img src=https://www.outwar.com/images/coesmobs/mob8.jpg style="`+style4+`" alt="howldroid"><div class="centered">`+Howldroid+`</div></div></td>
<td><div class="godbox"><img src=https://www.outwar.com/images/coesmobs/mob9.jpg style="`+style4+`" alt="slashbrood"><div class="centered">`+Slashbrood+`</div></div></td>
<td><div class="godbox"><img src=https://www.outwar.com/images/coesmobs/mob10.jpg style="`+style4+`" alt="neudeus"><div class="centered">`+Neudeus+`</div></div></td>
</tr></table>
<table class="godstatus"><tr>
<td><div class="godbox"><img src=https://www.outwar.com/images/coesmobs/mob2.jpg style="`+style6+`" alt="baron"><div class="centered">`+Baron+`</div></div></td>
<td><div class="godbox"><img src=https://www.outwar.com/images/coesmobs/mob1.jpg style="`+style6+`" alt="freezebreed"><div class="centered">`+Freezebreed+`</div></div></td>
<td><div class="godbox"><img src=https://www.outwar.com/images/coesmobs/mob4.jpg style="`+style6+`" alt="rotborn"><div class="centered">`+Rotborn+`</div></div></td>
<td><div class="godbox"><img src=https://www.outwar.com/images/coesmobs/mob3.jpg style="`+style6+`" alt="melt"><div class="centered">`+Melt+`</div></div></td>
<td><div class="godbox"><img src=https://www.outwar.com/images/coesmobs/mob5.jpg style="`+style6+`" alt="chaos"><div class="centered">`+Chaos+`</div></div></td>
<td><div class="godbox"><img src=https://www.outwar.com/images/coesmobs/mob6.jpg style="`+style6+`" alt="numerocure"><div class="centered">`+Numerocure+`</div></div></td>
</tr></table>
<table class="godstatus"><tr>
<td><div class="godbox"><img src=https://www.outwar.com/images/LF/Gnorb.jpg style="`+style7+`" alt="gnorb"><div class="centered">`+Gnorb+`</div></div></td>
<td><div class="godbox"><img src=https://www.outwar.com/images/LF/Nessam.jpg style="`+style7+`" alt="nessam"><div class="centered">`+Nessam+`</div></div></td>
<td><div class="godbox"><img src=https://www.outwar.com/images/LF/Crane.jpg style="`+style7+`" alt="crane"><div class="centered">`+Crane+`</div></div></td>
<td><div class="godbox"><img src=https://www.outwar.com/images/LF/Pinosis.jpg style="`+style7+`" alt="pinosis"><div class="centered">`+Pinosis+`</div></div></td>
<td><div class="godbox"><img src=https://www.outwar.com/images/LF/Tsort.jpg style="`+style7+`" alt="tsort"><div class="centered">`+Tsort+`</div></div></td>
<td><div class="godbox"><img src=https://www.outwar.com/images/LF/Shadow.jpg style="`+style7+`" alt="shadow"><div class="centered">`+Shadow+`</div></div></td>
<td><div class="godbox"><img src=https://www.outwar.com/images/LF/Xordam.jpg style="`+style7+`" alt="xordam"><div class="centered">`+Xordam+`</div></div></td>
</tr></table>
<table class="godstatus"><tr>
<td><div class="godbox"><img src=https://www.outwar.com/images/stoneravenboss4.jpg style="`+style5+`" alt="ebliss"><div class="centered">`+Ebliss+`</div></div></td>
<td><div class="godbox"><img src=https://www.outwar.com/images/guardset4boss2.jpg style="`+style5+`" alt="brutalitar"><div class="centered">`+Brutalitar+`</div></div></td>
<td><div class="godbox"><img src=https://www.outwar.com/images/guardset4boss3.jpg style="`+style5+`" alt="dreg"><div class="centered">`+Dreg+`</div></div></td>
<td><div class="godbox"><img src=https://www.outwar.com/images/guardset4boss4.jpg style="`+style5+`" alt="ashnar"><div class="centered">`+Ashnar+`</div></div></td>
<td><div class="godbox"><img src=https://www.outwar.com/images/guardset4boss5.jpg style="`+style5+`" alt="zhul"><div class="centered">`+Zhul+`</div></div></td>
</tr></table>
<table class="godstatus"><tr>
<td><div class="godbox"><img src=https://www.outwar.com/images/ganja.jpg style="`+style6+`" alt="ganja"><div class="centered">`+Ganja+`</div></div></td>
<td><div class="godbox"><img src=https://www.outwar.com/images/sibannac.jpg style="`+style6+`" alt="sibannac"><div class="centered">`+Sibannac+`</div></div></td>
<td><div class="godbox"><img src=https://www.outwar.com/images/smoot.jpg style="`+style6+`" alt="smoot"><div class="centered">`+Smoot+`</div></div></td>
<td><div class="godbox"><img src=https://www.outwar.com/images/grizzlybear.jpg style="`+style6+`" alt="blood"><div class="centered">`+Bloodchill+`</div></div></td>
<td><div class="godbox"><img src=https://www.outwar.com/images/abomination.jpg style="`+style6+`" alt="ag"><div class="centered">`+Nabak+`</div></div></td>
<td><div class="godbox"><img src=https://www.outwar.com/images/newdemon6.jpg style="`+style6+`" alt="kro"><div class="centered">`+Shuk+`</div></div></td>
</tr></table>
<table class="godstatus"><tr>
<td><div class="godbox"><img src=https://www.outwar.com/images/lord_varan.gif style="`+style5+`" alt="varan"><div class="centered">`+Varan+`</div></div></td>
<td><div class="godbox"><img src=https://www.outwar.com/images/lord_narada.gif style="`+style5+`" alt="narada"><div class="centered">`+Narada+`</div></div></td>
<td><div class="godbox"><img src=https://www.outwar.com/images/lady_ariella.gif style="`+style5+`" alt="ariella"><div class="centered">`+Ariella+`</div></div></td>
<td><div class="godbox"><img src=https://www.outwar.com/images/lord_suka.gif style="`+style5+`" alt="suka"><div class="centered">`+Suka+`</div></div></td>
<td><div class="godbox"><img src=https://www.outwar.com/images/lord_ganesha.gif style="`+style5+`" alt="ganeshan"><div class="centered">`+Ganeshan+`</div></div></td>
</tr></table>
<table class="godstatus"><tr>
<td><div class="godbox"><img src=https://www.outwar.com/images/lowbiegod1.jpg style="`+style5+`" alt="wanhiroeaz"><div class="centered">`+Wanhiroeaz+`</div></div></td>
<td><div class="godbox"><img src=https://www.outwar.com/images/lowbiegod2.jpg style="`+style5+`" alt="vitkros"><div class="centered">`+Vitkros+`</div></div></td>
<td><div class="godbox"><img src=https://www.outwar.com/images/lowbiegod3.jpg style="`+style5+`" alt="hyrak"><div class="centered">`+Hyrak+`</div></div></td>
<td><div class="godbox"><img src=https://www.outwar.com/images/lowbiegod4.jpg style="`+style5+`" alt="mistress"><div class="centered">`+Mistress+`</div></div></td>
<td><div class="godbox"><img src=https://www.outwar.com/images/lowbiegod5.jpg style="`+style5+`" alt="traxodon"><div class="centered">`+Traxodon+`</div></div></td>
</tr></table>
<table class="godstatus"><tr>
<td><div class="godbox"><img src=https://www.outwar.com/images/council1.jpg style="`+style5+`" alt="garland"><div class="centered">`+Garland+`</div></div></td>
<td><div class="godbox"><img src=https://www.outwar.com/images/council2.jpg style="`+style5+`" alt="tylos"><div class="centered">`+Tylos+`</div></div></td>
<td><div class="godbox"><img src=https://www.outwar.com/images/council3.jpg style="`+style5+`" alt="threk"><div class="centered">`+Threk+`</div></div></td>
<td><div class="godbox"><img src=https://www.outwar.com/images/council4.jpg style="`+style5+`" alt="jazzmin"><div class="centered">`+Jazzmin+`</div></div></td>
<td><div class="godbox"><img src=https://www.outwar.com/images/council5.jpg style="`+style5+`" alt="sigil"><div class="centered">`+Sigil+`</div></div></td>
</tr></table>
<table class="godstatus"><tr>
<td><div class="godbox"><img src=https://www.outwar.com/images/reddragon.jpg style="`+style5+`" alt="synge"><div class="centered">`+Synge+`</div></div></td>
<td><div class="godbox"><img src=https://www.outwar.com/images/rancid.jpg style="`+style5+`" alt="rancid"><div class="centered">`+Rancid+`</div></div></td>
<td><div class="godbox"><img src=https://www.outwar.com/images/terrance.jpg style="`+style5+`" alt="terrance"><div class="centered">`+Terrance+`</div></div></td>
<td><div class="godbox"><img src=https://www.outwar.com/images/zertan.jpg style="`+style5+`" alt="zertan"><div class="centered">`+Zertan+`</div></div></td>
<td><div class="godbox"><img src=https://www.outwar.com/images/quiver.jpg style="`+style5+`" alt="quiver"><div class="centered">`+Quiver+`</div></div></td>
</tr></table>
`
header.innerHTML = godtabs
}

if (document.URL.indexOf("itemlink") != -1 && error == false) {

GM_addStyle (`#content > div.layout-px-spacing{background:transparent !important;box-shadow: 0px 0px 0px #000000,-0px -0px 0px #000000 !important;}`);

var itemID = window.location.search.replace(/\?id=/g,"").replace(/&owner=.*/g,"")

fetch("/item_rollover.php?id="+itemID+"_1")
   .then(response => response.text())
   .then((response) => {

var holyaug = response.match(/&nbsp; \+([0-9]+) <span style="color:#00FFFF/g);
if (holyaug == null){holyaug = 0}
var arcaneaug = response.match(/&nbsp; \+([0-9]+) <span style="color:#FFFF00/g);
if (arcaneaug == null){arcaneaug = 0}
var fireaug = response.match(/&nbsp; \+([0-9]+) <span style="color:#FF0000/g);
if (fireaug == null){fireaug = 0}
var kineticaug = response.match(/&nbsp; \+([0-9]+) <span style="color:#00FF00/g);
if (kineticaug == null){kineticaug = 0}
var shadowaug = response.match(/&nbsp; \+([0-9]+) <span style="color:#7e01bc/g);
if (shadowaug == null){shadowaug = 0}
var chaosaug = response.match(/&nbsp; \+([0-9]+) <span style="color:#f441be/g);
if (chaosaug == null){chaosaug = 0}
var psaug = response.match(/\+([0-9]+)% perfect strike/g);
if (psaug == null){psaug = 0}

var aug1holy = parseInt(holyaug.toString().replace(/ <span style="color:#00FFFF/i,"").replace(/&nbsp; \+/i,""))
var aug1arcane = parseInt(arcaneaug.toString().replace(/ <span style="color:#FFFF00/i,"").replace(/&nbsp; \+/i,""))
var aug1fire = parseInt(fireaug.toString().replace(/ <span style="color:#FF0000/i,"").replace(/&nbsp; \+/i,""))
var aug1kinetic = parseInt(kineticaug.toString().replace(/ <span style="color:#00FF00/i,"").replace(/&nbsp; \+/i,""))
var aug1shadow = parseInt(shadowaug.toString().replace(/ <span style="color:#7e01bc/i,"").replace(/&nbsp; \+/i,""))
var aug1chaos = parseInt(chaosaug.toString().replace(/ <span style="color:#f441be/i,"").replace(/&nbsp; \+/i,""))
var aug1ps = parseInt(psaug.toString().replace(/% perfect strike/i,"").replace(/\+/i,""))

fetch("/item_rollover.php?id="+itemID+"_2")
   .then(response => response.text())
   .then((response) => {

var holyaug = response.match(/&nbsp; \+([0-9]+) <span style="color:#00FFFF/g);
if (holyaug == null){holyaug = 0}
var arcaneaug = response.match(/&nbsp; \+([0-9]+) <span style="color:#FFFF00/g);
if (arcaneaug == null){arcaneaug = 0}
var fireaug = response.match(/&nbsp; \+([0-9]+) <span style="color:#FF0000/g);
if (fireaug == null){fireaug = 0}
var kineticaug = response.match(/&nbsp; \+([0-9]+) <span style="color:#00FF00/g);
if (kineticaug == null){kineticaug = 0}
var shadowaug = response.match(/&nbsp; \+([0-9]+) <span style="color:#7e01bc/g);
if (shadowaug == null){shadowaug = 0}
var chaosaug = response.match(/&nbsp; \+([0-9]+) <span style="color:#f441be/g);
if (chaosaug == null){chaosaug = 0}
var psaug = response.match(/\+([0-9]+)% perfect strike/g);
if (psaug == null){psaug = 0}

var aug2holy = parseInt(holyaug.toString().replace(/ <span style="color:#00FFFF/i,"").replace(/&nbsp; \+/i,""))
var aug2arcane = parseInt(arcaneaug.toString().replace(/ <span style="color:#FFFF00/i,"").replace(/&nbsp; \+/i,""))
var aug2fire = parseInt(fireaug.toString().replace(/ <span style="color:#FF0000/i,"").replace(/&nbsp; \+/i,""))
var aug2kinetic = parseInt(kineticaug.toString().replace(/ <span style="color:#00FF00/i,"").replace(/&nbsp; \+/i,""))
var aug2shadow = parseInt(shadowaug.toString().replace(/ <span style="color:#7e01bc/i,"").replace(/&nbsp; \+/i,""))
var aug2chaos = parseInt(chaosaug.toString().replace(/ <span style="color:#f441be/i,"").replace(/&nbsp; \+/i,""))
var aug2ps = parseInt(psaug.toString().replace(/% perfect strike/i,"").replace(/\+/i,""))

fetch("/item_rollover.php?id="+itemID+"_3")
   .then(response => response.text())
   .then((response) => {

var holyaug = response.match(/&nbsp; \+([0-9]+) <span style="color:#00FFFF/g);
if (holyaug == null){holyaug = 0}
var arcaneaug = response.match(/&nbsp; \+([0-9]+) <span style="color:#FFFF00/g);
if (arcaneaug == null){arcaneaug = 0}
var fireaug = response.match(/&nbsp; \+([0-9]+) <span style="color:#FF0000/g);
if (fireaug == null){fireaug = 0}
var kineticaug = response.match(/&nbsp; \+([0-9]+) <span style="color:#00FF00/g);
if (kineticaug == null){kineticaug = 0}
var shadowaug = response.match(/&nbsp; \+([0-9]+) <span style="color:#7e01bc/g);
if (shadowaug == null){shadowaug = 0}
var chaosaug = response.match(/&nbsp; \+([0-9]+) <span style="color:#f441be/g);
if (chaosaug == null){chaosaug = 0}
var psaug = response.match(/\+([0-9]+)% perfect strike/g);
if (psaug == null){psaug = 0}

var aug3holy = parseInt(holyaug.toString().replace(/ <span style="color:#00FFFF/i,"").replace(/&nbsp; \+/i,""))
var aug3arcane = parseInt(arcaneaug.toString().replace(/ <span style="color:#FFFF00/i,"").replace(/&nbsp; \+/i,""))
var aug3fire = parseInt(fireaug.toString().replace(/ <span style="color:#FF0000/i,"").replace(/&nbsp; \+/i,""))
var aug3kinetic = parseInt(kineticaug.toString().replace(/ <span style="color:#00FF00/i,"").replace(/&nbsp; \+/i,""))
var aug3shadow = parseInt(shadowaug.toString().replace(/ <span style="color:#7e01bc/i,"").replace(/&nbsp; \+/i,""))
var aug3chaos = parseInt(chaosaug.toString().replace(/ <span style="color:#f441be/i,"").replace(/&nbsp; \+/i,""))
var aug3ps = parseInt(psaug.toString().replace(/% perfect strike/i,"").replace(/\+/i,""))

fetch("/item_rollover.php?id="+itemID+"_4")
   .then(response => response.text())
   .then((response) => {

var holyaug = response.match(/&nbsp; \+([0-9]+) <span style="color:#00FFFF/g);
if (holyaug == null){holyaug = 0}
var arcaneaug = response.match(/&nbsp; \+([0-9]+) <span style="color:#FFFF00/g);
if (arcaneaug == null){arcaneaug = 0}
var fireaug = response.match(/&nbsp; \+([0-9]+) <span style="color:#FF0000/g);
if (fireaug == null){fireaug = 0}
var kineticaug = response.match(/&nbsp; \+([0-9]+) <span style="color:#00FF00/g);
if (kineticaug == null){kineticaug = 0}
var shadowaug = response.match(/&nbsp; \+([0-9]+) <span style="color:#7e01bc/g);
if (shadowaug == null){shadowaug = 0}
var chaosaug = response.match(/&nbsp; \+([0-9]+) <span style="color:#f441be/g);
if (chaosaug == null){chaosaug = 0}
var psaug = response.match(/\+([0-9]+)% perfect strike/g);
if (psaug == null){psaug = 0}

var aug4holy = parseInt(holyaug.toString().replace(/ <span style="color:#00FFFF/i,"").replace(/&nbsp; \+/i,""))
var aug4arcane = parseInt(arcaneaug.toString().replace(/ <span style="color:#FFFF00/i,"").replace(/&nbsp; \+/i,""))
var aug4fire = parseInt(fireaug.toString().replace(/ <span style="color:#FF0000/i,"").replace(/&nbsp; \+/i,""))
var aug4kinetic = parseInt(kineticaug.toString().replace(/ <span style="color:#00FF00/i,"").replace(/&nbsp; \+/i,""))
var aug4shadow = parseInt(shadowaug.toString().replace(/ <span style="color:#7e01bc/i,"").replace(/&nbsp; \+/i,""))
var aug4chaos = parseInt(chaosaug.toString().replace(/ <span style="color:#f441be/i,"").replace(/&nbsp; \+/i,""))
var aug4ps = parseInt(psaug.toString().replace(/% perfect strike/i,"").replace(/\+/i,""))

fetch("/item_rollover.php?id="+itemID+"_5")
   .then(response => response.text())
   .then((response) => {

var holyaug = response.match(/&nbsp; \+([0-9]+) <span style="color:#00FFFF/g);
if (holyaug == null){holyaug = 0}
var arcaneaug = response.match(/&nbsp; \+([0-9]+) <span style="color:#FFFF00/g);
if (arcaneaug == null){arcaneaug = 0}
var fireaug = response.match(/&nbsp; \+([0-9]+) <span style="color:#FF0000/g);
if (fireaug == null){fireaug = 0}
var kineticaug = response.match(/&nbsp; \+([0-9]+) <span style="color:#00FF00/g);
if (kineticaug == null){kineticaug = 0}
var shadowaug = response.match(/&nbsp; \+([0-9]+) <span style="color:#7e01bc/g);
if (shadowaug == null){shadowaug = 0}
var chaosaug = response.match(/&nbsp; \+([0-9]+) <span style="color:#f441be/g);
if (chaosaug == null){chaosaug = 0}
var psaug = response.match(/\+([0-9]+)% perfect strike/g);
if (psaug == null){psaug = 0}

var aug5holy = parseInt(holyaug.toString().replace(/ <span style="color:#00FFFF/i,"").replace(/&nbsp; \+/i,""))
var aug5arcane = parseInt(arcaneaug.toString().replace(/ <span style="color:#FFFF00/i,"").replace(/&nbsp; \+/i,""))
var aug5fire = parseInt(fireaug.toString().replace(/ <span style="color:#FF0000/i,"").replace(/&nbsp; \+/i,""))
var aug5kinetic = parseInt(kineticaug.toString().replace(/ <span style="color:#00FF00/i,"").replace(/&nbsp; \+/i,""))
var aug5shadow = parseInt(shadowaug.toString().replace(/ <span style="color:#7e01bc/i,"").replace(/&nbsp; \+/i,""))
var aug5chaos = parseInt(chaosaug.toString().replace(/ <span style="color:#f441be/i,"").replace(/&nbsp; \+/i,""))
var aug5ps = parseInt(psaug.toString().replace(/% perfect strike/i,"").replace(/\+/i,""))

var aholy = aug1holy+aug2holy+aug3holy+aug4holy+aug5holy
var aarcane = aug1arcane+aug2arcane+aug3arcane+aug4arcane+aug5arcane
var afire = aug1fire+aug2fire+aug3fire+aug4fire+aug5fire
var akinetic = aug1kinetic+aug2kinetic+aug3kinetic+aug4kinetic+aug5kinetic
var ashadow = aug1shadow+aug2shadow+aug3shadow+aug4shadow+aug5shadow
var achaos = aug1chaos+aug2chaos+aug3chaos+aug4chaos+aug5chaos
var aps = aug1ps+aug2ps+aug3ps+aug4ps+aug5ps

var Gslot1 = document.querySelector("#itemtable > tbody > tr:nth-child(2) > td:nth-child(2) > img:nth-child(3)").outerHTML.replace(/<img src="\/images\/gemslot2\.jpg">/i,1).replace(/<img src="\/images\/gem_.*\.jpg">/i,0)
var Gslot2 = document.querySelector("#itemtable > tbody > tr:nth-child(2) > td:nth-child(2) > img:nth-child(4)").outerHTML.replace(/<img src="\/images\/gemslot2\.jpg">/i,1).replace(/<img src="\/images\/gem_.*\.jpg">/i,0)
var Gslot3 = document.querySelector("#itemtable > tbody > tr:nth-child(2) > td:nth-child(2) > img:nth-child(5)").outerHTML.replace(/<img src="\/images\/gemslot2\.jpg">/i,1).replace(/<img src="\/images\/gem_.*\.jpg">/i,0)
var Gslot4 = document.querySelector("#itemtable > tbody > tr:nth-child(2) > td:nth-child(2) > img:nth-child(6)").outerHTML.replace(/<img src="\/images\/gemslot2\.jpg">/i,1).replace(/<img src="\/images\/gem_.*\.jpg">/i,0)

var sum = Math.round(Gslot1+Gslot2+Gslot3+Gslot4)

var gems = '';
if (sum == "0"){gems = "4"}
if (sum == "1"){gems = "3"}
if (sum == "11"){gems = "2"}
if (sum == "111"){gems = "1"}
if (sum == "1111"){gems = "0"}

var item = document.querySelector("#itemtable > tbody > tr:nth-child(2) > td:nth-child(1)").outerHTML.replace(/<span style="color:#00FF00"> \(\+[0-9]+\)<\/span>/g,"").replaceAll(",","");

var atk = item.match(/\+([0-9]+) ATK/) ?? 0
var holy = item.match(/\+([0-9]+) <span style="color:#.*">Holy/) ?? 0
var arcane = item.match(/\+([0-9]+) <span style="color:#.*">Arcane/) ?? 0
var shadow = item.match(/\+([0-9]+) <span style="color:#.*">Shadow/) ?? 0
var fire = item.match(/\+([0-9]+) <span style="color:#.*">Fire/) ?? 0
var kinetic = item.match(/\+([0-9]+) <span style="color:#.*">Kinetic/) ?? 0
var chaos = item.match(/\+([0-9]+) <span style="color:#.*">Chaos/) ?? 0
var vile = item.match(/\+([0-9]+) vile energy/) ?? 0
var hp = item.match(/\+([0-9]+) HP/) ?? 0
var holyr = item.match(/\+([0-9]+) Holy Resist/) ?? 0
var arcaner = item.match(/\+([0-9]+) Arcane Resist/) ?? 0
var shadowr = item.match(/\+([0-9]+) Shadow Resist/) ?? 0
var firer = item.match(/\+([0-9]+) Fire Resist/) ?? 0
var kineticr = item.match(/\+([0-9]+) Kinetic Resist/) ?? 0
var chaosr = item.match(/\+([0-9]+) Chaos Resist/) ?? 0
var block = item.match(/\+([0-9]+)% block/) ?? 0
var eblock = item.match(/\+([0-9]+)% elemental block/) ?? 0
var rpt = item.match(/\+([0-9]+) rage per hr/) ?? 0
var ept = item.match(/\+([0-9]+) exp per hr/) ?? 0
var ramp = item.match(/\+([0-9]+)% rampage/) ?? 0
var ps = item.match(/\+([0-9]+)% perfect strike/) ?? 0
var mr = item.match(/\+([0-9]+) max rage/) ?? 0
var crit = item.match(/\+([0-9]+)% critical hit/) ?? 0

var edititem = document.querySelector("#itemtable > tbody > tr:nth-child(2) > td:nth-child(1)");
if (aholy != 0){edititem.innerHTML = edititem.innerHTML.replace(/&nbsp; \+.* <span style="color:#00FFFF">Holy/,"&nbsp; +"+(parseInt(holy[1])-aholy)+" <font color=00FF00>(+"+aholy+")</font><font color=00FFFF> Holy</font>")}
if (aarcane != 0){edititem.innerHTML = edititem.innerHTML.replace(/&nbsp; \+.* <span style="color:#FFFF00">Arcane/,"&nbsp; +"+(parseInt(arcane[1])-aarcane)+" <font color=00FF00>(+"+aarcane+")</font><font color=FFFF00> Arcane</font>")}
if (afire != 0){edititem.innerHTML = edititem.innerHTML.replace(/&nbsp; \+.* <span style="color:#FF0000">Fire/,"&nbsp; +"+(parseInt(fire[1])-afire)+" <font color=00FF00>(+"+afire+")</font><font color=FF0000> Fire</font>")}
if (akinetic != 0){edititem.innerHTML = edititem.innerHTML.replace(/&nbsp; \+.* <span style="color:#00FF00">Kinetic/,"&nbsp; +"+(parseInt(kinetic[1])-akinetic)+" <font color=00FF00>(+"+akinetic+")</font<font color=00FF00> Kinetic</font>")}
if (ashadow != 0){edititem.innerHTML = edititem.innerHTML.replace(/&nbsp; \+.* <span style="color:#7e01bc">Shadow/,"&nbsp; +"+(parseInt(shadow[1])-ashadow)+" <font color=00FF00>(+"+ashadow+")</font><font color=7e01bc> Shadow</font>")}
if (achaos != 0){edititem.innerHTML = edititem.innerHTML.replace(/&nbsp; \+.* <span style="color:#f441be">Chaos/,"&nbsp; +"+(parseInt(chaos[1])-achaos)+" <font color=00FF00>(+"+achaos+")</font><font color=f441be> Chaos</font>")}
if (aps != 0){edititem.innerHTML = edititem.innerHTML.replace(/% perfect strike/," <font color=00FF00>(+"+aps+")</font>% perfect strike")}

var g1 = '';
var g2 = '';
var g3 = '';
var g4 = '';
    if (atk[1] > 0){
    g1 += "+"+Math.round(atk[1]*1.15)+" ATK<br>"
    g2 += "+"+Math.round(atk[1]*1.3225)+" ATK<br>"
    g3 += "+"+Math.round(atk[1]*1.520875)+" ATK<br>"
    g4 += "+"+Math.round(atk[1]*1.74900625)+" ATK<br>"}
    if (holy[1]-aholy > 0){
    g1 += "&emsp;+"+(parseInt(holy[1]))+" <font color=00FFFF>Holy</font><br>"
    g2 += "&emsp;+"+(parseInt(holy[1]))+" <font color=00FFFF>Holy</font><br>"
    g3 += "&emsp;+"+(parseInt(holy[1]))+" <font color=00FFFF>Holy</font><br>"
    g4 += "&emsp;+"+(parseInt(holy[1]))+" <font color=00FFFF>Holy</font><br>"}
    if (arcane[1]-aarcane > 0){
    g1 += "&emsp;+"+(parseInt(arcane[1]))+" <font color=FFFF00>Arcane</font><br>"
    g2 += "&emsp;+"+(parseInt(arcane[1]))+" <font color=FFFF00>Arcane</font><br>"
    g3 += "&emsp;+"+(parseInt(arcane[1]))+" <font color=FFFF00>Arcane</font><br>"
    g4 += "&emsp;+"+(parseInt(arcane[1]))+" <font color=FFFF00>Arcane</font><br>"}
    if (shadow[1]-ashadow > 0){
    g1 += "&emsp;+"+(parseInt(shadow[1]))+" <font color=7E01BC>Shadow</font><br>"
    g2 += "&emsp;+"+(parseInt(shadow[1]))+" <font color=7E01BC>Shadow</font><br>"
    g3 += "&emsp;+"+(parseInt(shadow[1]))+" <font color=7E01BC>Shadow</font><br>"
    g4 += "&emsp;+"+(parseInt(shadow[1]))+" <font color=7E01BC>Shadow</font><br>"}
    if (fire[1]-afire > 0){
    g1 += "&emsp;+"+(parseInt(fire[1]))+" <font color=FF0000>Fire</font><br>"
    g2 += "&emsp;+"+(parseInt(fire[1]))+" <font color=FF0000>Fire</font><br>"
    g3 += "&emsp;+"+(parseInt(fire[1]))+" <font color=FF0000>Fire</font><br>"
    g4 += "&emsp;+"+(parseInt(fire[1]))+" <font color=FF0000>Fire</font><br>"}
    if (kinetic[1]-akinetic > 0){
    g1 += "&emsp;+"+(parseInt(kinetic[1]))+" <font color=00FF00>Kinetic</font><br>"
    g2 += "&emsp;+"+(parseInt(kinetic[1]))+" <font color=00FF00>Kinetic</font><br>"
    g3 += "&emsp;+"+(parseInt(kinetic[1]))+" <font color=00FF00>Kinetic</font><br>"
    g4 += "&emsp;+"+(parseInt(kinetic[1]))+" <font color=00FF00>Kinetic</font><br>"}
    if (chaos[1]-achaos > 0){
    g1 += "&emsp;+"+(parseInt(chaos[1]))+" <font color=E93EB5>Chaos</font><br>"
    g2 += "&emsp;+"+(parseInt(chaos[1]))+" <font color=E93EB5>Chaos</font><br>"
    g3 += "&emsp;+"+(parseInt(chaos[1]))+" <font color=E93EB5>Chaos</font><br>"
    g4 += "&emsp;+"+(parseInt(chaos[1]))+" <font color=E93EB5>Chaos</font><br>"}
    if (vile[1] > 0){
    g1 += "&emsp;+"+vile[1]+" vile energy<br>"
    g2 += "&emsp;+"+vile[1]+" vile energy<br>"
    g3 += "&emsp;+"+vile[1]+" vile energy<br>"
    g4 += "&emsp;+"+vile[1]+" vile energy<br>"}
    if (hp[1] > 0){
    g1 += "+"+Math.round(hp[1]*1.15)+" HP<br>"
    g2 += "+"+Math.round(hp[1]*1.3225)+" HP<br>"
    g3 += "+"+Math.round(hp[1]*1.520875)+" HP<br>"
    g4 += "+"+Math.round(hp[1]*1.74900625)+" HP<br>"}
    if (holyr[1] != undefined){
    g1 += "&emsp;+"+holyr[1]+" Holy Resist<br>"
    g2 += "&emsp;+"+holyr[1]+" Holy Resist<br>"
    g3 += "&emsp;+"+holyr[1]+" Holy Resist<br>"
    g4 += "&emsp;+"+holyr[1]+" Holy Resist<br>"}
    if (arcaner[1] > 0){
    g1 += "&emsp;+"+arcaner[1]+" Arcane Resist<br>"
    g2 += "&emsp;+"+arcaner[1]+" Arcane Resist<br>"
    g3 += "&emsp;+"+arcaner[1]+" Arcane Resist<br>"
    g4 += "&emsp;+"+arcaner[1]+" Arcane Resist<br>"}
    if (shadowr[1] > 0){
    g1 += "&emsp;+"+shadowr[1]+" Shadow Resist<br>"
    g2 += "&emsp;+"+shadowr[1]+" Shadow Resist<br>"
    g3 += "&emsp;+"+shadowr[1]+" Shadow Resist<br>"
    g4 += "&emsp;+"+shadowr[1]+" Shadow Resist<br>"}
    if (firer[1] > 0){
    g1 += "&emsp;+"+firer[1]+" Fire Resist<br>"
    g2 += "&emsp;+"+firer[1]+" Fire Resist<br>"
    g3 += "&emsp;+"+firer[1]+" Fire Resist<br>"
    g4 += "&emsp;+"+firer[1]+" Fire Resist<br>"}
    if (kineticr[1] > 0){
    g1 += "&emsp;+"+kineticr[1]+" Kinetic Resist<br>"
    g2 += "&emsp;+"+kineticr[1]+" Kinetic Resist<br>"
    g3 += "&emsp;+"+kineticr[1]+" Kinetic Resist<br>"
    g4 += "&emsp;+"+kineticr[1]+" Kinetic Resist<br>"}
    if (chaosr[1] > 0){
    g1 += "&emsp;+"+chaosr[1]+" Chaos Resist<br>"
    g2 += "&emsp;+"+chaosr[1]+" Chaos Resist<br>"
    g3 += "&emsp;+"+chaosr[1]+" Chaos Resist<br>"
    g4 += "&emsp;+"+chaosr[1]+" Chaos Resist<br>"}
    if (block[1] > 0){
    g1 += "+"+block[1]+"% block<br>"
    g2 += "+"+block[1]+"% block<br>"
    g3 += "+"+block[1]+"% block<br>"
    g4 += "+"+block[1]+"% block<br>"}
    if (eblock[1] > 0){
    g1 += "+"+eblock[1]+"% elemental block<br>"
    g2 += "+"+eblock[1]+"% elemental block<br>"
    g3 += "+"+eblock[1]+"% elemental block<br>"
    g4 += "+"+eblock[1]+"% elemental block<br>"}
    if (rpt[1] > 0){
    g1 += "+"+Math.round(rpt[1]*1.15)+" rage per hour<br>"
    g2 += "+"+Math.round(rpt[1]*1.3225)+" rage per hour<br>"
    g3 += "+"+Math.round(rpt[1]*1.520875)+" rage per hour<br>"
    g4 += "+"+Math.round(rpt[1]*1.74900625)+" rage per hour<br>"}
    if (ept[1] > 0){
    g1 += "+"+Math.round(ept[1]*1.15)+" exp per hour<br>"
    g2 += "+"+Math.round(ept[1]*1.3225)+" exp per hour<br>"
    g3 += "+"+Math.round(ept[1]*1.520875)+" exp per hour<br>"
    g4 += "+"+Math.round(ept[1]*1.74900625)+" exp per hour<br>"}
    if (ramp[1] > 0){
    g1 += "+"+ramp[1]+"% rampage<br>"
    g2 += "+"+ramp[1]+"% rampage<br>"
    g3 += "+"+ramp[1]+"% rampage<br>"
    g4 += "+"+ramp[1]+"% rampage<br>"}
    if (ps[1] > 0){
    g1 += "+"+ps[1]+"<br>% perfect strike<br>"
    g2 += "+"+ps[1]+"<br>% perfect strike<br>"
    g3 += "+"+ps[1]+"<br>% perfect strike<br>"
    g4 += "+"+ps[1]+"<br>% perfect strike<br>"}
    if (mr[1] > 0){
    g1 += "+"+Math.round(mr[1]*1.15)+" max rage<br>"
    g2 += "+"+Math.round(mr[1]*1.3225)+" max rage<br>"
    g3 += "+"+Math.round(mr[1]*1.520875)+" max rage<br>"
    g4 += "+"+Math.round(mr[1]*1.74900625)+" max rage<br>"}
    if (crit[1] > 0){
    g1 += "+"+crit[1]+"% critical hit<br>"
    g2 += "+"+crit[1]+"% critical hit<br>"
    g3 += "+"+crit[1]+"% critical hit<br>"
    g4 += "+"+crit[1]+"% critical hit<br>"}

var openslot = document.querySelectorAll("img[src='/images/gemslot2.jpg']");
if (openslot[0] != null){openslot[0].setAttribute(`onmouseover`, `popup(event,'<div id=gemcalc>`+g1+`</div>');`);}
if (openslot[0] != null){openslot[0].setAttribute(`onmouseout`, `kill()`);}
if (openslot[1] != null){openslot[1].setAttribute(`onmouseover`, `popup(event,'<div id=gemcalc>`+g2+`</div>')`);}
if (openslot[1] != null){openslot[1].setAttribute(`onmouseout`, `kill()`);}
if (openslot[2] != null){openslot[2].setAttribute(`onmouseover`, `popup(event,'<div id=gemcalc>`+g3+`</div>')`);}
if (openslot[2] != null){openslot[2].setAttribute(`onmouseout`, `kill()`);}
if (openslot[3] != null){openslot[3].setAttribute(`onmouseover`, `popup(event,'<div id=gemcalc>`+g4+`</div>')`);}
if (openslot[3] != null){openslot[3].setAttribute(`onmouseout`, `kill()`);}

var itemNameColor = document.querySelector("#itemtable > tbody > tr:nth-child(1) > td").outerHTML.replace(/<td colspan="2" style="height:20px;font-size:12pt;text-shadow: #47462E 1px 1px 2px;color:#/g,"").replace(/" align="left">.*/g,"");

var itemRarity = '';
if (itemNameColor == "FFFFFF"){itemRarity = "Uncommon";}
if (itemNameColor == "1eff00"){itemRarity = "Rare";}
if (itemNameColor == "ffde5b"){itemRarity = "Elite";}
if (itemNameColor == "0070ff"){itemRarity = "Godly";}
if (itemNameColor == "CA1111"){itemRarity = "Brutal";}
if (itemNameColor == "ff8000"){itemRarity = "King";}
if (itemNameColor == "9000ba"){itemRarity = "Mythic"}

var gemTxt = `
<td colspan="2" style="padding:2px;" valign="top"><div id="itemGemCalc">
<table width=300px border=1 bordercolor=#D4D4D4 id=gemcalc><tr><td>
Item Rarity: <font color=`+itemNameColor+`>`+itemRarity+`
</td><td>
Number of Gems: `+gems+`
</td></tr></table>
<div id=mouseovergem>Mouseover empty gem slot to see gemmed stats</div><p>
</div></td>`

function insertAfter(newNode, existingNode) {
existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);}

let menu = document.querySelector("#itemtable > tbody");
let tr = document.createElement('tr');
tr.innerHTML = gemTxt;
insertAfter(tr, menu.lastElementChild);

})})})})})}

var buy_points_link = document.querySelector("#accordionExample > a").outerHTML.replace(`<a rel="shadowbox;height=494;width=775" class="sbox" href=`,"").replace(`<img src="/assets/img/getpoints.webp">`,"").replace(`</a>`,"")
var rganame = buy_points_link.match(/rg_sess_id=.*/i).toString().replace(`">`,"").replace(`rg_sess_id=`,"")
var char_id = document.querySelector("#charselectdropdown").innerHTML.match(/<option value="([0-9]+)" selected/i)[1]
var server_id = ''; if (window.location.href.replace("https://","").replace(/\.outwar\.com.*/i,"") == "sigil"){server_id = 1} if (window.location.href.replace("https://","").replace(/\.outwar\.com.*/i,"") == "torax"){server_id = 2}

document.querySelector("#sidebar").innerHTML = `
<nav id="sidebar">
<ul class="list-unstyled menu-categories ps" id="accordionExample">
<li class="menu">
<a href="#rga" data-toggle="collapse" aria-expanded="false" class="dropdown-toggle">
<div class="">
<i class="fa fa-address-card"></i>
<span> MY RGA</span>
</div>
<div>
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-right"><polyline points="9 18 15 12 9 6"></polyline></svg>
</div>
</a>
<ul class="collapse submenu list-unstyled" id="rga" data-parent="#accordionExample">
<input type="text" value=`+rganame+` class="form-control" id="sessidbox" onclick="this.select();" style="margin:3px;height:15px !important;font-size:9px !important;width:80% !important">
<li><a href="/myaccount"> MY RGA</a></li>
<li><a href="/treasury.php?type=vision"> MOXXIVISION</a></li>
<li><a href="/raffle"> MOXXIVISION+</a></li>
<li><a href="/purchasepolicy"> MOXXIMOD+</a></li>
<li><a href="?cmd=logout"> LOGOUT</a></li>
</ul>
</li>

<li class="menu">
<a href="/home" class="dropdown-toggle">
<div class="">
<i class="fa fa-home"></i>
<span> HOME</span>
</div>
</a>
</li>

<li class="menu">
<a href="#components" data-toggle="collapse" aria-expanded="false" class="dropdown-toggle">
<div class="">
<i class="fas fa-user fa-fw"></i>
<span>CHARACTER</span>
</div>
<div>
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-right"><polyline points="9 18 15 12 9 6"></polyline></svg>
</div>
</a>
<ul class="collapse submenu list-unstyled" id="components" data-parent="#accordionExample">
<li><a href="/profile"> PROFILE</a></li>
<li><a href="/ow_messagecenter"> MESSAGES</a></li>
<li><a href="/cast_skills"> SKILLS</a></li>
<li><a href="/allies"> MY ALLIES</a></li>
<li><a href="/underlings"> UNDERLINGS</a></li>
<li><a href="/user_preferences"> PREFERENCES</a></li>
<li><a href="https://rampidgaming.outwar.com/ppoverview_s2?owsrv=`+server_id+`&owchar=`+char_id+`&rg_sess_id=`+rganame+`" TARGET="BLANK"> PREFERRED PLAYER</a></li>
</ul>
</li>

<li class="menu">
<a href="#elements" data-toggle="collapse" aria-expanded="false" class="dropdown-toggle">
<div class="">
<i class="fa fa-shopping-cart fa-fw"></i>
<span>ECONOMY</span>
</div>
<div>
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-right"><polyline points="9 18 15 12 9 6"></polyline></svg>
</div>
</a>
<ul class="collapse submenu list-unstyled" id="elements" data-parent="#accordionExample">
<li><a href="/treasury?type=-1"> BUY ITEMS</a></li>
<li><a href="/mytreasury"> SELL ITEMS</a></li>
<li><a href="/supplies"> SUPPLIES</a></li>
<li><a href="/pointtransfer"> TRANSFER PNTS</a></li>
<li><a TARGET="BLANK" href=`+buy_points_link+` BUY POINTS</a></li>
</ul>
</li>

<li class="menu">
<a href="#datatables" data-toggle="collapse" aria-expanded="false" class="dropdown-toggle">
<div class="">
<i class="fas fa-location-arrow fa-fw"></i>
<span>SERVER</span>
</div>
<div>
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-right"><polyline points="9 18 15 12 9 6"></polyline></svg>
</div>
</a>
<ul class="collapse submenu list-unstyled" id="datatables" data-parent="#accordionExample">
<li><a href="/attack_search"> SEARCH</a></li>
<li><a href="/newrankings"> RANKINGS</a></li>
<li><a href="/gladiator"> GLADIATORS</a></li>
<li><a href="/event?eventid=woz"> WAR OF ZHUL</a></li>
<li><a href="/event?eventid=top"> TRIAL OF POWER</a></li>
<li><a href="/kotw"> KOTW</a></li>
<li><a href="/news"> NEWS</a></li>
</ul>
</li>

<li class="menu">
<a href="#forms" data-toggle="collapse" aria-expanded="false" class="dropdown-toggle">
<div class="">
<i class="fas fa-shield fa-fw"></i>
<span>CREW</span>
</div>
<div>
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-right"><polyline points="9 18 15 12 9 6"></polyline></svg>
</div>
</a>
<ul class="collapse submenu list-unstyled" id="forms" data-parent="#accordionExample">
<li><a href="/crew_home"> CREW HOME</a></li>
<li><a href="/crew_profile"> CREW PROFILE</a></li>
<li><a href="/crew_bossspawns"> RAID BOSSES</a></li>
<li><a href="/crew_vault"> CREW VAULT</a></li>
<li><a href="/godstatus"> GOD STATUS</a></li>
<li><a href="/crewinvites"> CREW INVITES</a></li>
<li><a href="/crew_leavecrew"> LEAVE CREW</a></li>
</ul>
</li>

<li class="menu">
<a href="#pvp" data-toggle="collapse" aria-expanded="false" class="dropdown-toggle">
<div class="">
<i class="fas fa-shield-alt fa-fw"></i>
<span> PVP</span>
</div>
<div>
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-right"><polyline points="9 18 15 12 9 6"></polyline></svg>
</div>
</a>
<ul class="collapse submenu list-unstyled" id="pvp" data-parent="#accordionExample">
<li><a href="/attacklog"> ATTACK LOG</a></li>
<li><a href="/pvptourney"> OPEN TOURNEY</a></li>
<li><a href="/closedpvp"> PVP BRAWL</a></li>
<li><a href="/bounty"> BOUNTY BOARD</a></li>
<li><a href="/crew_hitlist"> HITLIST</a></li>
</ul>
</li>

<li class="menu">
<a href="#items" data-toggle="collapse" aria-expanded="false" class="dropdown-toggle">
<div class="">
<i class="fas fa-shopping-bag fa-fw"></i>
<span>ITEMS</span>
</div>
<div>
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-right"><polyline points="9 18 15 12 9 6"></polyline></svg>
</div>
</a>
<ul class="collapse submenu list-unstyled" id="items" data-parent="#accordionExample">
<li><a href="/vault"> VAULT</a></li>
<li><a href="/blacksmith"> BLACKSMITH</a></li>
<li><a href="/augmentequip"> ADD AUGMENTS</a></li>
<li><a href="/itemtransfer"> ITEM TRANSFER</a></li>
<li><a href="/cauldron"> CAULDRON</a></li>
</ul>
</li>

<li class="menu">
<a href="#quests" data-toggle="collapse" aria-expanded="false" class="dropdown-toggle">
<div class="">
<i class="fas fa-book fa-fw"></i>
<span>QUESTS</span>
</div>
<div>
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-right"><polyline points="9 18 15 12 9 6"></polyline></svg>
</div>
</a>
<ul class="collapse submenu list-unstyled" id="quests" data-parent="#accordionExample">
<li><a href="/weeklyquests"> BOOSTERS</a></li>
<li><a href="/questlog"> QUEST LOG</a></li>
<li><a href="/collections"> COLLECTIONS</a></li>
<li><a href="/dungeons"> DUNGEONS</a></li>
<li><a href="/challenge"> CHALLENGES</a></li>
</ul>
</li>

<li class="menu fasttravel">
<a href="javascript:void(0);" class="dropdown-toggle" id="fastslide">
<div class="">
<i class="fas fa-plane fa-fw"></i>
<span>FAST TRAVEL</span>
</div>
</a>
</li>

<li class="menu">
<a href="/world" class="dropdown-toggle">
<div class="">
<i class="fas fa-globe fa-fw"></i>
<span>WORLD</span>
</div>
</a>
</li>

<p style="margin:0.5rem">
<form method="post" action="playersearch.php" target="_parent">
<input id="t-text" type="text" name="search" placeholder="player search" class="searchx form-control" style="width:130px !important;margin-left:5px !important;} required=""></form>
<p>
<form method="get" id="id_lookup" target="_parent">
<input type="text" name="procura" id="id_input" class="searchx form-control" style="width:130px !important;margin-left:5px !important;height: 40px !important;" placeholder="char id lookup"/></form>
<p>
<form method="post" action="crewsearch.php" target="_parent">
<input id="t-text" type="text" name="search" placeholder="crew search" class="searchx form-control" style="width:130px !important;margin-left:5px !important;" required=""></form>
<p style="margin:1rem">
MoxxiMod v7.0.0<p>
</nav>`

$("#id_lookup").on("submit", function(event){
event.preventDefault();
var name = $("#id_input").val();
window.location.href = "profile.php?id="+name;
});

if (document.URL.indexOf("crew_profile") != -1 && error == false) {

GM_addStyle ( `
#crewprofile > tbody > tr > td {vertical-align: top !important;padding:10px !important;}
td.crewstat {width:250px !important;height:60px !important;}
#leftcolumn > tbody > tr > td > div > center > img{height:600px !important;}
#crewlinks > div > center > button{margin:5px !important;}
#leader > a{color:#7D839C !important;}
#content > div.layout-px-spacing{background:transparent !important;box-shadow: 0px 0px 0px #000000,-0px -0px 0px #000000 !important;}
`)

var mycrewmenu = ''; if(document.querySelector("#content-header-row > div:nth-child(2)") != null) {mycrewmenu = document.querySelector("#content-header-row > div:nth-child(2)").innerHTML.replace(/<h4>.*<\/h4>/i,"").replace(/<marquee scrollamount="4" align="middle">.*<\/marquee>/i,"").replace(`<div class="widget-content widget-content-area br-6 pb-0">`,"")}

var crewpro = document.querySelector("#content-header-row")
var cid = crewpro.innerHTML.match(/tradeWith=([0-9]+)/i)[1]

if (document.querySelector("#content-header-row > div.row") != null) {window.location.href=`crew_profile.php?id=`+cid}

var crewpic = crewpro.innerHTML.match(/<div class="mt-3 pt-3" style="border-top-color:#474565;border-top-style:solid;border-top-width: 1px;">[\n\r](.*)/i)[1].replace(/<img src=/i,"").replace(/ width="[0-9]+" height="[0-9]+">/i,"").replace(/ width="" height="">/i,"")
var crewname = crewpro.innerHTML.match(/<h2>.*<\/h2>/i)
var crewdesc = crewpro.innerHTML.match(/<div class="text-left">((.|\n)*)<\/div>.*[\n\r]<div class="table-responsive">/i)[1]
var crewupgrades = crewpro.innerHTML.match(/<h5 class="card-title">CREW UPGRADES<\/h5>((.|\n)*)<div class="card mt-3">/i)[1].replace(/<div class="card mt-3(.|\n)*>/i,"")
var crewallies = crewpro.innerHTML.match(/<h5 class="card-title">(CREW ALLIES<\/h5>(.|\n)*)<div class="card mt-3">[\n\r]<div class="card-body">[\n\r]<h5 class="card-title">CREW ENEMIES<\/h5>/i)[1]
var crewenemies = crewpro.innerHTML.match(/<h5 class="card-title">(CREW ENEMIES<\/h5>(.|\n)*)<div class="col-lg-6 col-12 layout-spacing">/i)[1]
var members = document.querySelector("div.table-responsive").innerHTML.replace("<th>Rank</th>","<th>Rank&#9662;</th>").replace("<th>Name</th>","<th>Name&#9662;</th>").replace("<th>Level</th>","<th>Lvl&#9662;</th>")
var createdon = crewpro.innerHTML.match(/<b>Created On:<\/b>(.*)<\/li>/i)[1]
var leader = crewpro.innerHTML.match(/<b>Leader:<\/b>(.*)<\/li>/i)[1]
var totmembers = crewpro.innerHTML.match(/<b>Total Members:<\/b>(.*)<\/li>/i)[1]
var avglevel = crewpro.innerHTML.match(/<b>Average Level:<\/b>(.*)<\/li>/i)[1]

GM_addStyle ( `
.propic{background: #0E1726 url(`+crewpic+`); background-repeat: no-repeat;background-size: cover;background-position: center !important;}
`)

var links = '';
if (crewpro.innerHTML.match("Declare an Enemy") != null){links += `<button class="btn btn-primary"><a href=crew_profile.php?id=`+cid+`&war=1>+ ENEMY</a></button>`}
if (crewpro.innerHTML.match("Secure Relations") != null){links += `<button class="btn btn-primary"><a href=crew_profile.php?id=`+cid+`&war=2>- ENEMY</a></button>`}
if (crewpro.innerHTML.match("Form Alliance") != null){links += `<button class="btn btn-primary"><a href=crew_profile.php?id=`+cid+`&ally=1>+ ALLY</a></button>`}
if (crewpro.innerHTML.match("Break Alliance") != null){links += `<button class="btn btn-primary"><a href=crew_profile.php?id=`+cid+`&ally=2>- ALLY</a></button>`}
if (mycrewmenu == ""){links += `
<button class="btn btn-primary"><a href=crew_raidresults.php?crewid=`+cid+`&most_recent=1>RAIDS</a></button>
<button class="btn btn-primary"><a href=trade?isCrewTrade=1&tradeWith=`+cid+`>TRADE</a></button>
<button class="btn btn-primary"><a href=treasury?search_for=`+crewname.toString().replaceAll(" ","+").replace("</h2>","").replace("<h2>","")+`>TREAS</a></button>
<button class="btn btn-primary"><a href=crew_trophyroom.php?crewid=`+cid+`>TROPHIES</a></button>
<span id="atkcrew"></span>
`}

crewpro.innerHTML = `
<table id="crewprofile" border=0px>
<tr><td><table id="leftcolumn"><tr><td width="480px">
<div class="widget-chart-one mb-3 propic" style="width:480px;height:640px">
<center></center>
</div>
<table id="alliesandenemies"><tr><td width="510px">
<div class="widget widget-chart-one mb-3" style="height:65px"><center><span id="recentraid">LOADING</span></center></div>
<div class="widget widget-chart-one mb-3" style="height:140px;overflow-y:auto;overflow-x:hidden;"><center>`+crewallies+`</center></div>
<div class="widget widget-chart-one mb-3" style="height:140px;overflow-y:auto;overflow-x:hidden;"><center>`+crewenemies+`</center></div>
</td></tr></table>
</tr></td></table>
</td><td><table id="rightcolumn">
<tr><td>
<span id="mycrewmenu"></span>
<div class="widget widget-chart-one mb-3" style="height:75px"><center>`+crewname+`</center></div>
<div class="widget widget-chart-one mb-3" style="height:365px;overflow-y:auto">`+crewdesc+`</div>
<span id="crewlinks"></span>
<div class="widget widget-chart-one mb-3">
<table id="stats" style="margin-left:20px">
<tr><td class="crewstat"><b>CREATED</b><br>`+createdon+`</td><td class="crewstat"><b>MEMBERS</b><br>`+totmembers+`</td><td class="crewstat"><b>LEADER</b><br><div id=leader>`+leader+`</div></td><td class="crewstat"><b>AVG LEVEL</b><br>`+avglevel+`</td></tr>
<tr><td class="crewstat"><b>TOT POWER</b><br><span id="totpower">LOADING</span></td><td class="crewstat"><b>AVG POWER</b><br><span id="avgpower">LOADING</span></td><td class="crewstat"><b>TOT ELE DMG</b><br><span id="totele">LOADING</span></td><td class="crewstat"><b>AVG ELE DMG</b><br><span id="avgele">LOADING</span></td></tr>
<tr><td class="crewstat"><b>TOT ATK</b><br><span id="totatk">LOADING</span></td><td class="crewstat"><b>AVG ATK</b><br><span id="avgatk">LOADING</span></td><td class="crewstat"><b>TOT HP</b><br><span id="tothp">LOADING</span></td><td class="crewstat"><b>AVG HP</b><br><span id="avghp">LOADING</span></td></tr>
<tr><td class="crewstat"><b>TOT CHAOS</b><br><span id="totchaos">LOADING</span></td><td class="crewstat"><b>AVG CHAOS</b><br><span id="avgchaos">LOADING</span></td><td class="crewstat"><b>TOT WILDER</b><br><span id="totwilder">LOADING</span></td><td class="crewstat"><b>AVG WILDER</b><br><span id="avgwilder">LOADING</span></td></tr>
<tr><td class="crewstat"><b>TOT GROWTH</b><br><span id="totgrowth">LOADING</span></td><td class="crewstat"><b>AVG GROWTH</b><br><span id="avggrowth">LOADING</span></td><td class="crewstat"></td><td class="crewstat"></td></tr>
</table></div>
<div class="widget widget-chart-one mb-3"><center>`+crewupgrades+`</center></div>
</td></tr></table>
</td></tr></table>
<span id="buttons"><p>LOADING</p></span>
<div class="widget widget-chart-one mb-3" style="width:1272px;">`+members+`</div>`

if (mycrewmenu == ""){document.querySelector("#crewlinks").innerHTML = `<div class="widget widget-chart-one mb-3" style="height:90px"><center>`+links+`</center></div>`}
if (mycrewmenu != ""){document.querySelector("#mycrewmenu").innerHTML = `<div class="widget widget-chart-one mb-3" style="height:90px"><center>`+mycrewmenu+`</center></div>`}

var charsTable = document.querySelector("#content-header-row > div > table > tbody");
var charsTableRows = charsTable.rows.length;

GM_addStyle ( `
.equipment{display:none !important;}
.item{display:none !important;}
.skills{display:none !important;}
.stats{display:none !important;}
td.column{border:0px !important;}
td.column > img {height:30px !important; width:30px !important;}
td.skills > img {height:18px !important; width:18px !important;}
#members{display: none !important;}
#crew_profile_loading{position:fixed !important;bottom:25px !important;left:5px !important;z-index:100 !important;}
#tabbuts{margin-bottom:1rem !important;}
`)

function insertAfter(newNode, existingNode) {
existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);}

let memHeader = document.querySelector("#content-header-row > div > table > thead > tr");

let TD1 = document.createElement('th');
TD1.innerHTML = `POWER&#9662;`;
TD1.setAttribute("class","stats column")
insertAfter(TD1, memHeader.lastElementChild);
let TD2 = document.createElement('th');
TD2.innerHTML = `ELE&#9662;`;
TD2.setAttribute("class","stats column")
insertAfter(TD2, memHeader.lastElementChild);
let TD3 = document.createElement('th');
TD3.innerHTML = `ATK&#9662;`;
TD3.setAttribute("class","stats column")
insertAfter(TD3, memHeader.lastElementChild);
let TD4 = document.createElement('th');
TD4.innerHTML = `HP&#9662;`;
TD4.setAttribute("class","stats column")
insertAfter(TD4, memHeader.lastElementChild);
let TD5 = document.createElement('th');
TD5.innerHTML = `CHAOS&#9662;`;
TD5.setAttribute("class","stats column")
insertAfter(TD5, memHeader.lastElementChild);
let TD6 = document.createElement('th');
TD6.innerHTML = `WILDR&#9662;`;
TD6.setAttribute("class","stats column")
insertAfter(TD6, memHeader.lastElementChild);
let TD7 = document.createElement('th');
TD7.innerHTML = `GROWTH&#9662;`;
TD7.setAttribute("class","stats column")
insertAfter(TD7, memHeader.lastElementChild);
let TD8 = document.createElement('th');
TD8.innerHTML = `CORE`;
TD8.setAttribute("class","equipment column")
insertAfter(TD8, memHeader.lastElementChild);
let TD9 = document.createElement('th');
TD9.innerHTML = `HEAD`;
TD9.setAttribute("class","equipment column")
insertAfter(TD9, memHeader.lastElementChild);
let TD10 = document.createElement('th');
TD10.innerHTML = `NECK`;
TD10.setAttribute("class","equipment column")
insertAfter(TD10, memHeader.lastElementChild);
let TD11 = document.createElement('th');
TD11.innerHTML = `WEAP`;
TD11.setAttribute("class","equipment column")
insertAfter(TD11, memHeader.lastElementChild);
let TD12 = document.createElement('th');
TD12.innerHTML = `BODY`;
TD12.setAttribute("class","equipment column")
insertAfter(TD12, memHeader.lastElementChild);
let TD13 = document.createElement('th');
TD13.innerHTML = `SHLD`;
TD13.setAttribute("class","equipment column")
insertAfter(TD13, memHeader.lastElementChild);
let TD14 = document.createElement('th');
TD14.innerHTML = `BELT`;
TD14.setAttribute("class","equipment column")
insertAfter(TD14, memHeader.lastElementChild);
let TD15 = document.createElement('th');
TD15.innerHTML = `PANT`;
TD15.setAttribute("class","equipment column")
insertAfter(TD15, memHeader.lastElementChild);
let TD16 = document.createElement('th');
TD16.innerHTML = `RING`;
TD16.setAttribute("class","equipment column")
insertAfter(TD16, memHeader.lastElementChild);
let TD17 = document.createElement('th');
TD17.innerHTML = `FOOT`;
TD17.setAttribute("class","equipment column")
insertAfter(TD17, memHeader.lastElementChild);
let TD18 = document.createElement('th');
TD18.innerHTML = `GEM`;
TD18.setAttribute("class","item column")
insertAfter(TD18, memHeader.lastElementChild);
let TD19 = document.createElement('th');
TD19.innerHTML = `RUNE`;
TD19.setAttribute("class","item column")
insertAfter(TD19, memHeader.lastElementChild);
let TD20 = document.createElement('th');
TD20.innerHTML = `ORB`;
TD20.setAttribute("class","item column")
insertAfter(TD20, memHeader.lastElementChild);
let TD25 = document.createElement('th');
TD25.innerHTML = `ORB`;
TD25.setAttribute("class","item column")
insertAfter(TD25, memHeader.lastElementChild);
let TD26 = document.createElement('th');
TD26.innerHTML = `ORB`;
TD26.setAttribute("class","item column")
insertAfter(TD26, memHeader.lastElementChild);
let TD21 = document.createElement('th');
TD21.innerHTML = `BADGE`;
TD21.setAttribute("class","item column")
insertAfter(TD21, memHeader.lastElementChild);
let TD22 = document.createElement('th');
TD22.innerHTML = `BOOSTER`;
TD22.setAttribute("class","item column")
insertAfter(TD22, memHeader.lastElementChild);
let TD23 = document.createElement('th');
TD23.innerHTML = `CREST`;
TD23.setAttribute("class","item column")
insertAfter(TD23, memHeader.lastElementChild);
let TD27 = document.createElement('th');
TD27.innerHTML = `CREST`;
TD27.setAttribute("class","item column")
insertAfter(TD27, memHeader.lastElementChild);
let TD28 = document.createElement('th');
TD28.innerHTML = `CREST`;
TD28.setAttribute("class","item column")
insertAfter(TD28, memHeader.lastElementChild);
let TD29 = document.createElement('th');
TD29.innerHTML = `CREST`;
TD29.setAttribute("class","item column")
insertAfter(TD29, memHeader.lastElementChild);
let TD24 = document.createElement('th');
TD24.innerHTML = `SKILLS`;
TD24.setAttribute("class","skills column")
insertAfter(TD24, memHeader.lastElementChild);

var scrape = 0
var totpower = 0
var totele = 0
var totatk = 0
var tothp = 0
var totchaos = 0
var totwilder = 0
var totgrowth = 0

for (let rownum = 1; rownum < (charsTableRows+1); rownum++) {

var profilelinks = document.querySelector("#content-header-row > div > table > tbody > tr:nth-child("+rownum+") > td:nth-child(2)").innerHTML.match(/profile\.php\?id=[0-9]+/g)
fetch(profilelinks)
   .then(response => response.text())
   .then((response) => {
    var power = parseInt(response.match(/TOTAL POWER.*[\n\r].*<font size="2">(.*)<\/font><\/b><\/td>/i)[1].replaceAll(",",""))
    totpower += power
    var eledmg = parseInt(response.match(/ELEMENTAL ATTACK.*[\n\r].*<font size="2">(.*)<\/font>/i)[1].replaceAll(",",""))
    totele += eledmg
    var attack = parseInt(response.match(/ATTACK.*[\n\r].*<font size="2">(.*)<\/font>/i)[1].replaceAll(",",""))
    totatk += attack
    var hp = parseInt(response.match(/HIT POINTS.*[\n\r].*<font size="2">(.*)<\/font>/i)[1].replaceAll(",",""))
    tothp += hp
    var chaos = parseInt(response.match(/CHAOS DAMAGE.*[\n\r].*<font size="2">(.*)<\/font>/i)[1].replaceAll(",",""))
    totchaos += chaos
    var wilderness = parseInt(response.match(/WILDERNESS LEVEL.*[\n\r].*<font size="2">(.*)<\/font>/i)[1].replaceAll(",",""))
    totwilder += wilderness
    var yesterday = parseInt(response.match(/GROWTH YESTERDAY.*[\n\r].*<font size="2">(.*)<\/font>/i)[1].replaceAll(",",""))
    totgrowth += yesterday
    var core = response.match(/<div style="position:absolute; left:61px; top:12px; width:41px; height:41px;text-align:center">.*[\n\r](<img .*)<\/div>/i) || ["none","none"]
    var head = response.match(/<div style="position:absolute; left:118px; top:7px; width:62px; height:46px;text-align:center">.*[\n\r](<img .*)<\/div>/i) || ["none","none"]
    var neck = response.match(/<div style="position:absolute; left:197px; top:12px; width:41px; height:41px;text-align:center">.*[\n\r](<img .*)<\/div>/i) || ["none","none"]
    var weapon = response.match(/<div style="position:absolute; left:45px; top:67px; width:56px; height:96px;text-align:center">.*[\n\r](<img .*)<\/div>/i) || ["none","none"]
    var body = response.match(/<div style="position:absolute; left:121px; top:67px; width:56px; height:96px;text-align:center">.*[\n\r](<img .*)<\/div>/i) || ["none","none"]
    var shield = response.match(/<div style="position:absolute; left:198px; top:67px; width:56px; height:96px;text-align:center">.*[\n\r](<img .*)<\/div>/i) || ["none","none"]
    var pants = response.match(/<div style="position:absolute; left:118px; top:175px; width:62px; height:75px;text-align:center">.*[\n\r](<img .*)<\/div>/i) || ["none","none"]
    var belt = response.match(/<div style="position:absolute; left:61px; top:192px; width:41px; height:41px;text-align:center">.*[\n\r](<img .*)<\/div>/i) || ["none","none"]
    var ring = response.match(/<div style="position:absolute; left:197px; top:192px; width:41px; height:41px;text-align:center">.*[\n\r](<img .*)<\/div>/i) || ["none","none"]
    var foot = response.match(/<div style="position:absolute; left:118px; top:262px; width:62px; height:66px;text-align:center">.*[\n\r](<img .*)<\/div>/i) || ["none","none"]
    var gem = response.match(/<div style="position:absolute; left:10px; top:346px; width:32px; height:32px;text-align:center">.*[\n\r](<img .*)<\/div>/i) || ["none","none"]
    var rune = response.match(/<div style="position:absolute; left:54px; top:346px; width:32px; height:32px;text-align:center">.*[\n\r](<img .*)<\/div>/i) || ["none","none"]
    var badge = response.match(/<div style="position:absolute; left:214px; top:346px; width:32px; height:32px;text-align:center">.*[\n\r](<img .*)<\/div>/i) || ["none","none"]
    var booster = response.match(/<div style="position:absolute; left:258px; top:346px; width:32px; height:32px;text-align:center">.*[\n\r](<img .*)<\/div>/i) || ["none","none"]
    var crest1 = response.match(/<div style="position:absolute; left:9px; top:9px; width:60px; height:60px;text-align:center;">.*[\n\r](<img .*)<\/div>/i) || ["none","none"]
    var crest2 = response.match(/<div style="position:absolute; left:83px; top:9px; width:60px; height:60px; text-align:center;">.*[\n\r](<img .*)<\/div>/i) || ["none","none"]
    var crest3 = response.match(/<div style="position:absolute; left:157px; top:9px; width:60px; height:60px; text-align:center;">.*[\n\r](<img .*)<\/div>/i) || ["none","none"]
    var crest4 = response.match(/<div style="position:absolute; left:231px; top:9px; width:60px; height:60px; text-align:center;">.*[\n\r](<img .*)<\/div>/i) || ["none","none"]
    var orbs = response.match(/<div style="position:absolute; left:100px; top:346px; width:99px; height:32px;text-align:center">.*[\n\r](.*)<\/div>/i)[1]
    var orbscnt = ''; if (orbs == ""){orbscnt = 0}; if (orbs != ""){orbscnt = orbs.match(/img/g).length}
    var allorbs = '';
    if (orbscnt == 1){allorbs = response.match(/<div style="position:absolute; left:100px; top:346px; width:99px; height:32px;text-align:center">.*[\n\r].*(<img .*)<\/div>/i)}
    if (orbscnt == 2){allorbs = response.match(/<div style="position:absolute; left:100px; top:346px; width:99px; height:32px;text-align:center">.*[\n\r].*(<img .*)(<img .*)<\/div>/i)}
    if (orbscnt == 3){allorbs = response.match(/<div style="position:absolute; left:100px; top:346px; width:99px; height:32px;text-align:center">.*[\n\r].*(<img .*)(<img .*)(<img .*)<\/div>/i)}
    var orb1 = ''; if (orbscnt == 0) orb1 = "none"; if (orbscnt != 0) orb1 = allorbs[1]
    var orb2 = ''; if (orbscnt <= 1) orb2 = "none"; if (orbscnt >= 2) orb2 = allorbs[2]
    var orb3 = ''; if (orbscnt != 3) orb3 = "none"; if (orbscnt == 3) orb3 = allorbs[3]
    const doc = new DOMParser().parseFromString(response, 'text/html');
    var skills = doc.querySelector("#divSkillsCast").innerHTML.replace(/<img src="http:\/\/torax\.outwar\.com\/images\/profile\/ProfileSkills\.png">/i,"").replace(/<img src="http:\/\/sigil\.outwar\.com\/images\/profile\/ProfileSkills\.png">/i,"")

scrape += 1

var buttons = `<div id="tabbuts">
<button class="btn" id=btn_stats>STATS</a></button>
<button class="btn" id=btn_equipment>EQUIPMENT</a></button>
<button class="btn" id=btn_items>ITEMS</a></button>
<button class="btn" id=btn_skills>SKILLS</a></button></div>`

if (scrape == charsTableRows){
document.querySelector("#buttons").innerHTML = buttons
document.getElementById ("btn_stats").addEventListener("click", btn_stats, false);
function btn_stats (zEvent) {GM_addStyle (`.column{display:none!important}.stats{display:revert!important}`);}
document.getElementById ("btn_equipment").addEventListener("click", btn_equipment, false);
function btn_equipment (zEvent) {GM_addStyle (`.column{display:none!important}.equipment{display:revert!important}`);}
document.getElementById ("btn_items").addEventListener("click", btn_items, false);
function btn_items (zEvent) {GM_addStyle (`.column{display:none!important}.item{display:revert!important}`);}
document.getElementById ("btn_skills").addEventListener("click", btn_skills, false);
function btn_skills (zEvent) {GM_addStyle (`.column{display:none!important}.skills{display:revert!important}`);}
document.querySelector("#totpower").innerHTML = totpower.toLocaleString("en-US")
document.querySelector("#avgpower").innerHTML = Math.ceil(totpower/totmembers).toLocaleString("en-US")
document.querySelector("#totatk").innerHTML = totatk.toLocaleString("en-US")
document.querySelector("#avgatk").innerHTML = Math.ceil(totatk/totmembers).toLocaleString("en-US")
document.querySelector("#totchaos").innerHTML = totchaos.toLocaleString("en-US")
document.querySelector("#avgchaos").innerHTML = Math.ceil(totchaos/totmembers).toLocaleString("en-US")
document.querySelector("#totgrowth").innerHTML = totgrowth.toLocaleString("en-US")
document.querySelector("#avggrowth").innerHTML = Math.ceil(totgrowth/totmembers).toLocaleString("en-US")
document.querySelector("#totele").innerHTML = totele.toLocaleString("en-US")
document.querySelector("#avgele").innerHTML = Math.ceil(totele/totmembers).toLocaleString("en-US")
document.querySelector("#tothp").innerHTML = tothp.toLocaleString("en-US")
document.querySelector("#avghp").innerHTML = Math.ceil(tothp/totmembers).toLocaleString("en-US")
document.querySelector("#totwilder").innerHTML = totwilder.toLocaleString("en-US")
document.querySelector("#avgwilder").innerHTML = Math.ceil(totwilder/totmembers).toLocaleString("en-US")
GM_addStyle (`#crew_profile_loading{display:none !important;}`)
if (mycrewmenu == ""){
document.querySelector("#atkcrew").innerHTML=`<button id="pvpcrew" class="btn btn-primary">ATK <img src="https://studiomoxxi.com/moxximod/bot.png" class="robot" onmouseover="popup(event,'<b><font color=#f441be>MoxxiMod+</font></b><br>PVP attack every member of this crew')" onmouseout="kill()"></button>`
document.querySelector("#pvpcrew").addEventListener("click", task06, false);}
}

let memTable = document.querySelector("#content-header-row > div > table > tbody > tr:nth-child("+rownum+")");

let TD1 = document.createElement('td');
TD1.innerHTML = power;
TD1.setAttribute("class","stats column")
insertAfter(TD1, memTable.lastElementChild);
let TD2 = document.createElement('td');
TD2.innerHTML = eledmg;
TD2.setAttribute("class","stats column")
insertAfter(TD2, memTable.lastElementChild);
let TD3 = document.createElement('td');
TD3.innerHTML = attack;
TD3.setAttribute("class","stats column")
insertAfter(TD3, memTable.lastElementChild);
let TD4 = document.createElement('td');
TD4.innerHTML = hp;
TD4.setAttribute("class","stats column")
insertAfter(TD4, memTable.lastElementChild);
let TD5 = document.createElement('td');
TD5.innerHTML = chaos;
TD5.setAttribute("class","stats column")
insertAfter(TD5, memTable.lastElementChild);
let TD6 = document.createElement('td');
TD6.innerHTML = wilderness;
TD6.setAttribute("class","stats column")
insertAfter(TD6, memTable.lastElementChild);
let TD7 = document.createElement('td');
TD7.innerHTML = yesterday;
TD7.setAttribute("class","stats column")
insertAfter(TD7, memTable.lastElementChild);
let TD8 = document.createElement('td');
TD8.innerHTML = core[1]
TD8.setAttribute("class","equipment column")
insertAfter(TD8, memTable.lastElementChild);
let TD9 = document.createElement('td');
TD9.innerHTML = head[1];
TD9.setAttribute("class","equipment column")
insertAfter(TD9, memTable.lastElementChild);
let TD10 = document.createElement('td');
TD10.innerHTML = neck[1];
TD10.setAttribute("class","equipment column")
insertAfter(TD10, memTable.lastElementChild);
let TD11 = document.createElement('td');
TD11.innerHTML = weapon[1];
TD11.setAttribute("class","equipment column")
insertAfter(TD11, memTable.lastElementChild);
let TD12 = document.createElement('td');
TD12.innerHTML = body[1];
TD12.setAttribute("class","equipment column")
insertAfter(TD12, memTable.lastElementChild);
let TD13 = document.createElement('td');
TD13.innerHTML = shield[1];
TD13.setAttribute("class","equipment column")
insertAfter(TD13, memTable.lastElementChild);
let TD14 = document.createElement('td');
TD14.innerHTML = belt[1];
TD14.setAttribute("class","equipment column")
insertAfter(TD14, memTable.lastElementChild);
let TD15 = document.createElement('td');
TD15.innerHTML = pants[1];
TD15.setAttribute("class","equipment column")
insertAfter(TD15, memTable.lastElementChild);
let TD16 = document.createElement('td');
TD16.innerHTML = ring[1];
TD16.setAttribute("class","equipment column")
insertAfter(TD16, memTable.lastElementChild);
let TD17 = document.createElement('td');
TD17.innerHTML = foot[1];
TD17.setAttribute("class","equipment column")
insertAfter(TD17, memTable.lastElementChild);
let TD18 = document.createElement('td');
TD18.innerHTML = gem[1];
TD18.setAttribute("class","item column")
insertAfter(TD18, memTable.lastElementChild);
let TD19 = document.createElement('td');
TD19.innerHTML = rune[1];
TD19.setAttribute("class","item column")
insertAfter(TD19, memTable.lastElementChild);
let TD20 = document.createElement('td');
TD20.innerHTML = orb1;
TD20.setAttribute("class","item column")
insertAfter(TD20, memTable.lastElementChild);
let TD25 = document.createElement('td');
TD25.innerHTML = orb2;
TD25.setAttribute("class","item column")
insertAfter(TD25, memTable.lastElementChild);
let TD26 = document.createElement('td');
TD26.innerHTML = orb3;
TD26.setAttribute("class","item column")
insertAfter(TD26, memTable.lastElementChild);
let TD21 = document.createElement('td');
TD21.innerHTML = badge[1];
TD21.setAttribute("class","item column")
insertAfter(TD21, memTable.lastElementChild);
let TD22 = document.createElement('td');
TD22.innerHTML = booster[1];
TD22.setAttribute("class","item column")
insertAfter(TD22, memTable.lastElementChild);
let TD23 = document.createElement('td');
TD23.innerHTML = crest1[1];
TD23.setAttribute("class","item column")
insertAfter(TD23, memTable.lastElementChild);
let TD27 = document.createElement('td');
TD27.innerHTML = crest2[1];
TD27.setAttribute("class","item column")
insertAfter(TD27, memTable.lastElementChild);
let TD28 = document.createElement('td');
TD28.innerHTML = crest3[1];
TD28.setAttribute("class","item column")
insertAfter(TD28, memTable.lastElementChild);
let TD29 = document.createElement('td');
TD29.innerHTML = crest4[1];
TD29.setAttribute("class","item column")
insertAfter(TD29, memTable.lastElementChild);
let TD24 = document.createElement('td');
TD24.innerHTML = skills;
TD24.setAttribute("class","skills column")
insertAfter(TD24, memTable.lastElementChild);

$("body").append ( `
<div id="crew_profile_loading">
<table border="1px"><tr><td width="500px" bgcolor="#0E1726">
<table><tr><td style="padding:10px" bgcolor="#060818" height="50px" width="`+(scrape/totmembers)*500+`px">LOADING:`+Math.ceil((scrape/totmembers)*100)+`%</td></tr></table>
</td></tr></table>
</div>
` );
})}

$('th').click(function(){
    var table = $(this).parents('table').eq(0)
    var rows = table.find('tr:gt(0)').toArray().sort(comparer($(this).index()))
    this.asc = !this.asc
    if (!this.asc){rows = rows.reverse()}
    for (var i = 0; i < rows.length; i++){table.append(rows[i])}
})
function comparer(index) {
    return function(a, b) {
        var valA = getCellValue(a, index), valB = getCellValue(b, index)
        return $.isNumeric(valA) && $.isNumeric(valB) ? valA - valB : valA.toString().localeCompare(valB)
    }}
function getCellValue(row, index){ return $(row).children('td').eq(index).text() }

var godimg = '';
fetch('crew_raidresults.php?all_results=Display+all+raid+results&crewid='+cid)
    .then(res => res.text())
    .then((responseText) => {
    const doc = new DOMParser().parseFromString(responseText, 'text/html');
    var raidid = doc.querySelector("#content-header-row > table > tbody > tr > td > div > center > div > table > tbody > tr:nth-child(2) > td:nth-child(4) > a")

if (raidid == null){document.querySelector("#recentraid").innerHTML = `none`}

if (raidid != null){
fetch("raidattack.php?raidid="+raidid.toString().match(/[0-9]+/i))
    .then(response => response.text())
    .then((response) => {
    godimg = response.match(/<h4 class="text-center d-flex align-items-center justify-content-center">(.*)<\/h4>.*[\n\r].*[\n\r].*<div class="defenderimage skinborder d-flex justify-content-center align-items-center mb-3">.*[\n\r](.*)/i)
    crewname = response.match(/.*<b>(.*) has (.*)!<\/b>/i)
    document.querySelector("#recentraid").innerHTML = `<a href=raidattack.php?raidid=`+raidid.toString().replace(/https:\/\/[a-zA-Z]+\.outwar\.com\/raidattack\.php\?raidid=/i,"")+`>`+crewname[1]+` `+crewname[2]+` vs. `+godimg[1]+`</a>`


})}})}

if (GM_getValue("stickydrops") == true){

GM_addStyle (`
#dropdown{color:#FFFFFF !important;padding:2px !important;border-radius: 10px !important;}
#dropdown{text-align:left !important;}
.char_drop {
    position: relative;
    padding: 20px;
    border-radius: 8px;
    border: none;
    background: #0e1726;
    -webkit-box-shadow: 0 6px 10px 0 rgba(0,0,0,.14),0 1px 18px 0 rgba(0,0,0,.12),0 3px 5px -1px rgba(0,0,0,.2);
    -moz-box-shadow: 0 6px 10px 0 rgba(0,0,0,.14),0 1px 18px 0 rgba(0,0,0,.12),0 3px 5px -1px rgba(0,0,0,.2);
    box-shadow: 0 6px 10px 0 rgba(0,0,0,.14),0 1px 18px 0 rgba(0,0,0,.12),0 3px 5px -1px rgba(0,0,0,.2);
}
`)

var path = window.location.pathname
var dropdown = document.querySelector("body > center > div.sub-header-container > header > ul.navbar-nav.flex-row.mr-auto.toolbar-nav > li:nth-child(1)")
var charlist = document.querySelector("#charselectdropdown")
var newlist = `<select id="dropdown" name="dropdown" class="char_drop">`+charlist.innerHTML.replaceAll(`option value="`,`option value="`+path+`?suid=`)+`</select>`
dropdown.innerHTML = newlist
document.getElementById("dropdown").addEventListener('change', function () {
    window.location = this.value;
}, false);

}

if (document.URL.indexOf("crew_raidresults") != -1 && error == false) {

document.querySelector("#content-header-row > table > tbody > tr > td > form > p > input:nth-child(3)").outerHTML = `<input type="submit" class="btn btn-primary" name="most_recent" value="MoxxiMod raid results">`

if (document.URL.indexOf("crew_raidresults.php?most_recent=MoxxiMod") != -1 && error == false) {

GM_addStyle (`
#content-header-row > table > tbody > tr > td > div > center > div > table > tbody > tr > td{border:1px SOLID #131313 !important;}
#content-header-row > table > tbody > tr > td > div > center > div > table > tbody > tr:nth-child(1) > td:nth-child(1){width: 6% !important;}
#content-header-row > table > tbody > tr > td > div > center > div > table > tbody > tr:nth-child(1) > td:nth-child(2){width: 12% !important;}
#content-header-row > table > tbody > tr > td > div > center > div > table > tbody > tr:nth-child(1) > td:nth-child(3){width: 7% !important;}
#content-header-row > table > tbody > tr > td > div > center > div > table > tbody > tr:nth-child(1) > td:nth-child(4){width: 5% !important;}
#content-header-row > table > tbody > tr > td > div > center > div > table > tbody > tr > td:nth-child(5){display:none !important;}
#content-header-row > table > tbody > tr > td > div > center > div > table > tbody > tr:nth-child(1) > td:nth-child(6){width: 7% !important;}
#content-header-row > table > tbody > tr > td > div > center > div > table > tbody > tr:nth-child(1) > td:nth-child(7){width: 8% !important;}
#content-header-row > table > tbody > tr > td > div > center > div > table > tbody > tr:nth-child(1) > td:nth-child(8){width: 7% !important;}
#content-header-row > table > tbody > tr > td > div > center > div > table > tbody > tr:nth-child(1) > td:nth-child(9){width: 5% !important;}
#content-header-row > table > tbody > tr > td > div > center > div > table > tbody > tr:nth-child(1) > td:nth-child(10){width: 5% !important;}
#content-header-row > table > tbody > tr > td > div > center > div > table > tbody > tr:nth-child(1) > td:nth-child(11){width: 5% !important;}
#content-header-row > table > tbody > tr > td > div > center > div > table > tbody > tr:nth-child(1) > td:nth-child(12){width: 4% !important;}
#content-header-row > table > tbody > tr > td > div > center > div > table > tbody > tr:nth-child(1) > td:nth-child(13){width: 4% !important;}
#content-header-row > table > tbody > tr > td > div > center > div > table > tbody > tr:nth-child(1) > td:nth-child(14){width: 4% !important;}
#content-header-row > table > tbody > tr > td > div > center > div > table > tbody > tr:nth-child(1) > td:nth-child(15){width: 5% !important;}
#content-header-row > table > tbody > tr > td > div > center > div > table > tbody > tr:nth-child(1) > td:nth-child(16){width: 16% !important;}
`)

document.querySelector("#content-header-row > table > tbody > tr > td > div > center > div > table > tbody > tr:nth-child(1) > td:nth-child(1)").innerHTML = "<b>Time</b>"

document.querySelector("#content-header-row > table > tbody > tr > td > div > center > div > table").setAttribute("class","table table-bordered table-striped mb-4 moxxiraids")

let rrHead11 = document.querySelector("#content-header-row > table > tbody > tr > td > div > center > div > table > tbody > tr");
let tdHead11 = document.createElement('td');
tdHead11.innerHTML = `<a onmouseover="popup\(event,'Total chars in the raid<br>(number of chars who died)'\)" onmouseout="kill\(\)"><b>Chars`;
insertAfter(tdHead11, rrHead11.lastElementChild);

let rrHead1 = document.querySelector("#content-header-row > table > tbody > tr > td > div > center > div > table > tbody > tr");
let tdHead1 = document.createElement('td');
tdHead1.innerHTML = `<a onmouseover="popup\(event,'Total amount of attack damage<br>Mouseover to see details'\)" onmouseout="kill\(\)"><b>Dmg`;
insertAfter(tdHead1, rrHead1.lastElementChild);

let rrHead2 = document.querySelector("#content-header-row > table > tbody > tr > td > div > center > div > table > tbody > tr");
let tdHead2 = document.createElement('td');
tdHead2.innerHTML = `<a onmouseover="popup\(event,'Average amount of attack damage per char'\)" onmouseout="kill\(\)"><b>Avg`;
insertAfter(tdHead2, rrHead2.lastElementChild);

let rrHead6 = document.querySelector("#content-header-row > table > tbody > tr > td > div > center > div > table > tbody > tr");
let tdHead6 = document.createElement('td');
tdHead6.innerHTML = `<a onmouseover="popup\(event,'Average block rate of all chars'\)" onmouseout="kill\(\)"><font color="ff9e00"><b>Block`;
insertAfter(tdHead6, rrHead6.lastElementChild);

let rrHead7 = document.querySelector("#content-header-row > table > tbody > tr > td > div > center > div > table > tbody > tr");
let tdHead7 = document.createElement('td');
tdHead7.innerHTML = `<a onmouseover="popup\(event,'Average ele block rate of all chars'\)" onmouseout="kill\(\)"><font color="00ff0b"><b>Block`;
insertAfter(tdHead7, rrHead7.lastElementChild);

let rrHead13 = document.querySelector("#content-header-row > table > tbody > tr > td > div > center > div > table > tbody > tr");
let tdHead13 = document.createElement('td');
tdHead13.innerHTML = `<a onmouseover="popup\(event,'Average ele shield rate of all chars'\)" onmouseout="kill\(\)"><b>Shield`;
insertAfter(tdHead13, rrHead13.lastElementChild);

let rrHead14 = document.querySelector("#content-header-row > table > tbody > tr > td > div > center > div > table > tbody > tr");
let tdHead14 = document.createElement('td');
tdHead14.innerHTML = `<a onmouseover="popup\(event,'Total number of individual attacks executed'\)" onmouseout="kill\(\)"><b>Atks`;
insertAfter(tdHead14, rrHead14.lastElementChild);

let rrHead10 = document.querySelector("#content-header-row > table > tbody > tr > td > div > center > div > table > tbody > tr");
let tdHead10 = document.createElement('td');
tdHead10.innerHTML = `<a onmouseover="popup\(event,'Total number of rounds'\)" onmouseout="kill\(\)"><b>Rnds`;
insertAfter(tdHead10, rrHead10.lastElementChild);

let rrHead12 = document.querySelector("#content-header-row > table > tbody > tr > td > div > center > div > table > tbody > tr");
let tdHead12 = document.createElement('td');
tdHead12.innerHTML = `<a onmouseover="popup\(event,'Was SIN applied during the raid?'\)" onmouseout="kill\(\)"><b>Sin`;
insertAfter(tdHead12, rrHead12.lastElementChild);

let rrHead5 = document.querySelector("#content-header-row > table > tbody > tr > td > div > center > div > table > tbody > tr");
let tdHead5 = document.createElement('td');
tdHead5.innerHTML = `<a onmouseover="popup\(event,'Remaining health of the mob'\)" onmouseout="kill\(\)"><b>Health`;
insertAfter(tdHead5, rrHead5.lastElementChild);

let rrHead4 = document.querySelector("#content-header-row > table > tbody > tr > td > div > center > div > table > tbody > tr");
let tdHead4 = document.createElement('td');
tdHead4.innerHTML = `<a onmouseover="popup\(event,'Items dropped from raid'\)" onmouseout="kill\(\)"><b>Loot`;
insertAfter(tdHead4, rrHead4.lastElementChild);

var rrTable = document.querySelector("#content-header-row > table > tbody > tr > td > div > center > div > table");
var rrRowCount = 1+rrTable.rows.length;

for (let rownum = 2; rownum < rrRowCount; rownum++) {

let raidLink11 = '';
if (document.querySelector("#content-header-row > table > tbody > tr > td > div > center > div > table > tbody > tr:nth-child("+rownum+") > td:nth-child(5) > a") != null){
raidLink11 = document.querySelector("#content-header-row > table > tbody > tr > td > div > center > div > table > tbody > tr:nth-child("+rownum+") > td:nth-child(5) > a")}

let row11 = document.querySelector("#content-header-row > table > tbody > tr > td > div > center > div > table > tbody > tr:nth-child("+rownum+")")
let chars11 = document.querySelector("#content-header-row > table > tbody > tr > td > div > center > div > table > tbody > tr:nth-child("+rownum+") > td:nth-child(3)").innerHTML;

let raidNameCell = document.querySelector("#content-header-row > table > tbody > tr > td > div > center > div > table > tbody > tr:nth-child("+rownum+") > td:nth-child(2)");
let raidName = '';
if (raidNameCell != null){
raidNameCell.innerHTML = '<a href='+raidLink11+'>'+raidNameCell.innerHTML.replaceAll(/,.*/g,"").replaceAll(/of.*/g,"").replaceAll("The","").replaceAll(/the.*/g,"").replaceAll(/the.*/g,"")+'</a>'}

let timeStampCell = document.querySelector("#content-header-row > table > tbody > tr > td > div > center > div > table > tbody > tr:nth-child("+rownum+") > td:nth-child(1)");
let timeStampName = '';
if (timeStampCell != null){timeStampCell.innerHTML = timeStampCell.innerHTML.replaceAll(/[0-9]+-[0-9]+-[0-9]+/g,"")}

fetch(raidLink11)
   .then(response => response.text())
   .then((response) => {

var damage11 = response.match(/Damage: ([0-9,]*)/)[1];

var drops11 = '';
if (response.match(/popup\(event,'<b>(.*)<\/b>'\)" onmouseout="kill\(\)">[0-9]+ items<\/a>/i) == null){drops11 = `No items found`}
if (response.match(/popup\(event,'<b>(.*)<\/b>'\)" onmouseout="kill\(\)">[0-9]+ items<\/a>/i) != null){drops11 = response.match(/popup\(event,'<b>(.*)<\/b>'\)" onmouseout="kill\(\)">[0-9]+ items<\/a>/i)[1]}

var health11 = '';
if (response.match(/([0-9]+)%<\/span><\/div>.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]<span id=/i)[1] < 1){health11 = `<font color=#02B602><b>`+response.match(/([0-9]+)%<\/span><\/div>.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]<span id=/i)[1]+`%</font>`}
if (response.match(/([0-9]+)%<\/span><\/div>.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]<span id=/i)[1] > 0){health11 = `<font color=#FF0000><b>`+response.match(/([0-9]+)%<\/span><\/div>.*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r].*[\n\r]<span id=/i)[1]+`%</font>`}

fetch(raidLink11)
   .then(response => response.text())
   .then((response) => {

var attacks11 = response.match(/Base: [0-9]+/g).length;
var blocks11 = response.match(/images\/block\.jpg/g);
var eleblocks11 = response.match(/images\/block2\.jpg/g);
var shields11 = response.match(/_ele_shield\.jpg/g);
var dead11 = response.match(/images\/dead\.jpg/g);
var rounds11 = response.match(/\/img\/skin\/Bar_separator_little\.png/g).length;
var sincheck11 = response.match(/color:#CC0000;"><b>(.*)<\/b>/i);

const reducer = (accumulator, curr) => accumulator + curr

var BaseDmgArray = [];
var BaseMatch = response.matchAll(/onmouseover="popup\(event,.*Base: (.*)<div/g);
for (const BaseMatchLoop of BaseMatch) {
let BaseObj = [parseInt(BaseMatchLoop[1].replace(",",""))];
for (const BaseDmg of BaseObj) {
BaseDmgArray.push(BaseDmg);}}
var BaseNumbers = BaseDmgArray.map(Number)
var BaseDmgCheck = '';
if (BaseNumbers != ""){BaseDmgCheck = BaseNumbers}
if (BaseNumbers == ""){BaseDmgCheck = [0]}
var SumOfBase = BaseDmgCheck.reduce(reducer).toLocaleString("en-US");
var printBase = "<font color=#FFFFFF><b>+"+SumOfBase+" base<br>"

var FireDmgArray = [];
var FireMatch = response.matchAll(/onmouseover="popup\(event,.*\+(.*) fire/g);
for (const FireMatchLoop of FireMatch) {
let FireObj = [parseInt(FireMatchLoop[1].replace(",",""))];
for (const FireDmg of FireObj) {
FireDmgArray.push(FireDmg);}}
var FireNumbers = FireDmgArray.map(Number)
var FireDmgCheck = '';
if (FireNumbers != ""){FireDmgCheck = FireNumbers}
if (FireNumbers == ""){FireDmgCheck = [0]}
var SumOfFire = FireDmgCheck.reduce(reducer).toLocaleString("en-US");
var printFire = "<font color=#ff0000><b>+"+SumOfFire+" fire<br>"

var ShadowDmgArray = [];
var ShadowMatch = response.matchAll(/onmouseover="popup\(event,.*\+(.*) shadow/g);
for (const ShadowMatchLoop of ShadowMatch) {
let ShadowObj = [parseInt(ShadowMatchLoop[1].replace(",",""))];
for (const ShadowDmg of ShadowObj) {
ShadowDmgArray.push(ShadowDmg);}}
var ShadowNumbers = ShadowDmgArray.map(Number)
var ShadowDmgCheck = '';
if (ShadowNumbers != ""){ShadowDmgCheck = ShadowNumbers}
if (ShadowNumbers == ""){ShadowDmgCheck = [0]}
var SumOfShadow = ShadowDmgCheck.reduce(reducer).toLocaleString("en-US");
var printShadow = "<font color=#9f02d3><b>+"+SumOfShadow+" shadow<br>"

var HolyDmgArray = [];
var HolyMatch = response.matchAll(/onmouseover="popup\(event,.*\+(.*) holy/g);
for (const HolyMatchLoop of HolyMatch) {
let HolyObj = [parseInt(HolyMatchLoop[1].replace(",",""))];
for (const HolyDmg of HolyObj) {
HolyDmgArray.push(HolyDmg);}}
var HolyNumbers = HolyDmgArray.map(Number)
var HolyDmgCheck = '';
if (HolyNumbers != ""){HolyDmgCheck = HolyNumbers}
if (HolyNumbers == ""){HolyDmgCheck = [0]}
var SumOfHoly = HolyDmgCheck.reduce(reducer).toLocaleString("en-US");
var printHoly = "<font color=#00FFFF><b>+"+SumOfHoly+" holy<br>"

var ArcaneDmgArray = [];
var ArcaneMatch = response.matchAll(/onmouseover="popup\(event,.*\+(.*) arcane/g);
for (const ArcaneMatchLoop of ArcaneMatch) {
let ArcaneObj = [parseInt(ArcaneMatchLoop[1].replace(",",""))];
for (const ArcaneDmg of ArcaneObj) {
ArcaneDmgArray.push(ArcaneDmg);}}
var ArcaneNumbers = ArcaneDmgArray.map(Number)
var ArcaneDmgCheck = '';
if (ArcaneNumbers != ""){ArcaneDmgCheck = ArcaneNumbers}
if (ArcaneNumbers == ""){ArcaneDmgCheck = [0]}
var SumOfArcane = ArcaneDmgCheck.reduce(reducer).toLocaleString("en-US");
var printArcane = "<font color=#FFFF00><b>+"+SumOfArcane+" arcane<br>"

var KineticDmgArray = [];
var KineticMatch = response.matchAll(/onmouseover="popup\(event,.*\+(.*) kinetic/g);
for (const KineticMatchLoop of KineticMatch) {
let KineticObj = [parseInt(KineticMatchLoop[1].replace(",",""))];
for (const KineticDmg of KineticObj) {
KineticDmgArray.push(KineticDmg);}}
var KineticNumbers = KineticDmgArray.map(Number)
var KineticDmgCheck = '';
if (KineticNumbers != ""){KineticDmgCheck = KineticNumbers}
if (KineticNumbers == ""){KineticDmgCheck = [0]}
var SumOfKinetic = KineticDmgCheck.reduce(reducer).toLocaleString("en-US");
var printKinetic = "<font color=#00FF00><b>+"+SumOfKinetic+" kinetic<br>"

var VileDmgArray = [];
var VileMatch = response.matchAll(/onmouseover="popup\(event,.*\+(.*) vile/g);
for (const VileMatchLoop of VileMatch) {
let VileObj = [parseInt(VileMatchLoop[1].replace(",",""))];
for (const VileDmg of VileObj) {
VileDmgArray.push(VileDmg);}}
var VileNumbers = VileDmgArray.map(Number)
var VileDmgCheck = '';
if (VileNumbers != ""){VileDmgCheck = VileNumbers}
if (VileNumbers == ""){VileDmgCheck = [0]}
var SumOfVile = VileDmgCheck.reduce(reducer).toLocaleString("en-US");
var printVile = "<font color=#cccccc><b>+"+SumOfVile+" vile energy<br>"

var ChaosDmgArray = [];
var ChaosMatch = response.matchAll(/onmouseover="popup\(event,.*\+(.*) chaos/g);
for (const ChaosMatchLoop of ChaosMatch) {
let ChaosObj = [parseInt(ChaosMatchLoop[1].replace(",",""))];
for (const ChaosDmg of ChaosObj) {
ChaosDmgArray.push(ChaosDmg);}}
var ChaosNumbers = ChaosDmgArray.map(Number)
var ChaosDmgCheck = '';
if (ChaosNumbers != ""){ChaosDmgCheck = ChaosNumbers}
if (ChaosNumbers == ""){ChaosDmgCheck = [0]}
var SumOfChaos = ChaosDmgCheck.reduce(reducer).toLocaleString("en-US");
var printChaos = "<font color=#f441be><b>+"+SumOfChaos+" chaos"

var totdead11 = '';
if (dead11 != null){totdead11 = (dead11.length).toFixed(0)}
if (dead11 == null){totdead11 += "0"}

var shieldrate11 = '';
if (shields11 != null){shieldrate11 = (shields11.length/attacks11*100).toFixed(0)}
if (shields11 == null){shieldrate11 += "0"}

var sin11 = '';
if (sincheck11[1] != "0"){sin11 += "No"}
if (sincheck11[1] == "0"){sin11 += "Yes"}

var blockrate11 = '';
if (blocks11 != null){blockrate11 += (blocks11.length/attacks11*100).toFixed(0)}
if (blocks11 == null){blockrate11 += "0"}

var eleblockrate11 = '';
if (eleblocks11 != null){eleblockrate11 = (eleblocks11.length/attacks11*100).toFixed(0)}
if (eleblocks11 == null){eleblockrate11 += "0"}

let td112 = document.createElement('td');
td112.innerHTML = chars11+" (<span>&#128369;</span>"+totdead11+")";
insertAfter(td112, row11.lastElementChild);

let td11 = document.createElement('td');
td11.innerHTML = `<span class="dmgbox-text" onmouseover="popup(event,'</center>`+printBase+printFire+printShadow+printHoly+printArcane+printKinetic+printVile+printChaos+`');" onmouseout="kill();">`+damage11;
insertAfter(td11, row11.lastElementChild);

var cells11 = row11.getElementsByTagName("td");

let td12 = document.createElement('td');
var td12comma = Math.floor(damage11.replace(/,/g, '')/cells11[2].innerText);
td12.textContent = td12comma.toLocaleString("en-US");
insertAfter(td12, row11.lastElementChild);

let td61 = document.createElement('td');
td61.innerHTML = blockrate11+"%";
insertAfter(td61, row11.lastElementChild);

let td71 = document.createElement('td');
td71.innerHTML = eleblockrate11+"%";
insertAfter(td71, row11.lastElementChild);

let td111 = document.createElement('td');
td111.innerHTML = shieldrate11+"%";
insertAfter(td111, row11.lastElementChild);

let td13 = document.createElement('td');
td13.innerHTML = attacks11;
insertAfter(td13, row11.lastElementChild);

let td91 = document.createElement('td');
td91.innerHTML = rounds11;
insertAfter(td91, row11.lastElementChild);

let td101 = document.createElement('td');
td101.innerHTML = sin11;
insertAfter(td101, row11.lastElementChild);

let td51 = document.createElement('td');
td51.innerHTML = health11;
insertAfter(td51, row11.lastElementChild);

let td41 = document.createElement('td');
td41.innerHTML = drops11.replaceAll(/Amulet Chest \(.*\),/g,"").replaceAll(/,/g,"<br>");
insertAfter(td41, row11.lastElementChild);

})})}}}

if (document.URL.indexOf("world") != -1 && error == false) {

GM_addStyle (`
.ml-4{margin-left:0rem !important;}
#content-header-row > div.col-xl-5.col-lg-12.col-md-6.col-sm-12.col-12.layout-spacing.px-1 > div > div.widget-content > div.room-middle{display:none !important;}
#roomDetails > ul > li:nth-child(1) > div > div.ml-3.d-block.align-self-center > a > img[src*="atkicon"] {content: url("https://studiomoxxi.com/ow_themes/custom_jobs/classic_01/atk_1.png") !important;}
#roomDetails > ul > li:nth-child(2) > div > div.ml-3.d-block.align-self-center > a > img[src*="atkicon"] {content: url("https://studiomoxxi.com/ow_themes/custom_jobs/classic_01/atk_2.png") !important;}
#roomDetails > ul > li:nth-child(3) > div > div.ml-3.d-block.align-self-center > a > img[src*="atkicon"] {content: url("https://studiomoxxi.com/ow_themes/custom_jobs/classic_01/atk_3.png") !important;}
#roomDetails > ul > li:nth-child(4) > div > div.ml-3.d-block.align-self-center > a > img[src*="atkicon"] {content: url("https://studiomoxxi.com/ow_themes/custom_jobs/classic_01/atk_4.png") !important;}
#roomDetails > ul > li:nth-child(5) > div > div.ml-3.d-block.align-self-center > a > img[src*="atkicon"] {content: url("https://studiomoxxi.com/ow_themes/custom_jobs/classic_01/atk_5.png") !important;}
#roomDetails > ul > li:nth-child(6) > div > div.ml-3.d-block.align-self-center > a > img[src*="atkicon"] {content: url("https://studiomoxxi.com/ow_themes/custom_jobs/classic_01/atk_6.png") !important;}
#roomDetails > ul > li:nth-child(7) > div > div.ml-3.d-block.align-self-center > a > img[src*="atkicon"] {content: url("https://studiomoxxi.com/ow_themes/custom_jobs/classic_01/atk_7.png") !important;}
#roomDetails > ul > li:nth-child(8) > div > div.ml-3.d-block.align-self-center > a > img[src*="atkicon"] {content: url("https://studiomoxxi.com/ow_themes/custom_jobs/classic_01/atk_8.png") !important;}
#roomDetails > ul > li:nth-child(9) > div > div.ml-3.d-block.align-self-center > a > img[src*="atkicon"] {content: url("https://studiomoxxi.com/ow_themes/custom_jobs/classic_01/atk_9.png") !important;}
.button {background: #060818 !important;margin: 6px !important;padding: 5px !important;margin-bottom: 5px !important;font-size: 12px !important;color: #e0e6ed !important;}
.button:hover {background:#3b3f5c !important;}
#gotormtab{margin-top:0.5rem !important;}
.atkn{background: #1B2E4B;border: 1px #1B2E4B SOLID;color: #FFFFFF !important;padding: 6px !important;border-radius: 6px !important;height:37px !important;margin-right:0.5rem !important;font-size:28px !important;}
#gladtable > tbody > tr > td:nth-child(2) > img{margin:5px !important;border: 1px #1b2e4b SOLID !important;border-radius: 6px !important;}
#questhelper{display:none !important;}
#roomDetails > ul > li{box-shadow: 0px 0px 5px 2px rgba(0,0,0,0.75);-webkit-box-shadow: 0px 0px 5px 2px rgba(0,0,0,0.75);-moz-box-shadow: 0px 0px 5px 2px rgba(0,0,0,0.75);}
#content > div.layout-px-spacing{background:transparent !important;{box-shadow: 0px 0px 0px #000000,-0px -0px 0px #000000 !important;}
`)

setTimeout(function() {
var room_img = document.querySelector("#roomImage").outerHTML.match(/src="([^"]*)"/i)[1]
GM_addStyle (`
#content-header-row > div.col-xl-5.col-lg-12.col-md-6.col-sm-12.col-12.layout-spacing.px-1 > div:nth-child(1){background-image: url("`+room_img+`") !important;background-size: cover !important;min-height:400px !important;}
#roomImage{display:none !important;}
#roomDetails > ul > li{margin-bottom:0.25rem !important;}`)
},500)

var quest_button = document.querySelector("#content-header-row > div.col-xl-4.col-lg-12.col-md-12.col-sm-12.col-12.layout-spacing.px-1 > div.widget.widget-chart-two > div.widget-content.pt-0 > div > p")

quest_button.innerHTML = `</a><button id="show_quests" class="btn btn-primary mmplus" style="margin-top:1rem !important;">SHOW QUESTS</button>`
document.getElementById ("show_quests").addEventListener("click", show_quests, false);
function show_quests(){
GM_addStyle (`#questhelper{display:revert !important;}`)
quest_button.innerHTML = `</a><button id="hide_quests" class="btn btn-primary mmplus" style="margin-top:1rem !important;">HIDE QUESTS</button>`
document.getElementById ("hide_quests").addEventListener("click", hide_quests, false);
}
function hide_quests(){
GM_addStyle (`#questhelper{display:none !important;}`)
quest_button.innerHTML = `</a><button id="show_quests" class="btn btn-primary mmplus" style="margin-top:1rem !important;">SHOW QUESTS</button>`
document.getElementById ("show_quests").addEventListener("click", show_quests, false);
}

var hotkeys = true

var world_eq = document.querySelector("#content-header-row > div.col-xl-4.col-lg-12.col-md-12.col-sm-12.col-12.layout-spacing.px-1");
let div_right = document.createElement('div');
div_right.innerHTML = `<span id="eqworld">LOADING</span>`
div_right.setAttribute("class","widget widget-chart-one mb-3")
world_eq.insertBefore(div_right, world_eq.firstElementChild);

fetch('/profile')
    .then(response => response.text())
    .then((response) => {
    if (response.match(/<a href="\/crew_profile\?id=.*">/) != null) {crewid = response.match(/<a href="\/crew_profile\?id=.*">/).toString().replace(/<a href="\/crew_profile\?id=/,"").replace(/">/,"")}
    const doc = new DOMParser().parseFromString(response, 'text/html');
    const eq = doc.querySelector("#divProfile > div:nth-child(2) > div > div > div.col-xl-4.col-md-5 > div > div:nth-child(2) > div").innerHTML.replace(`<h5 class="card-title">EQUIPMENT</h5>`,"")

var roomid_display = document.querySelector("#roomid_display")
var map_display = document.querySelector("#mapHtml")

let observer1 = new MutationObserver(mutationRecords => {
  attackframe()
  automove()
  automove_btn()
  haste()
  gladroom()
  roomeq()
  roomimg()
});
observer1.observe(roomid_display, {
  childList: true,
  subtree: true,
  characterDataOldValue: true
});
let observer2 = new MutationObserver(mutationRecords => {
  attackframe()
  automove()
  automove_btn()
});
observer2.observe(map_display, {
  childList: true,
  subtree: true,
  characterDataOldValue: true
});

function roomimg(){
var room_img = document.querySelector("#roomImage").outerHTML.match(/src="([^"]*)"/i)[1]
GM_addStyle (`#content-header-row > div.col-xl-5.col-lg-12.col-md-6.col-sm-12.col-12.layout-spacing.px-1 > div:nth-child(1){background-image: url("`+room_img+`") !important;background-size: cover;}`)
}

gladroom();function gladroom(){
var room = document.querySelector("#roomid_display").innerHTML
if (room == "28031" || room == "28106" || room == "38726" || room == "38727" || room == "32878" || room == "32876" || room == "32877" || room == "28107" || room == "28105" || room == "28103" || room == "28101" || room == "28099" || room == "28097" || room == "28095" || room == "28093" || room == "28091"){

hotkeys = false

document.querySelector("#eqworld").innerHTML = `<h5>- MoxxiMod Fast Attacker -</h5><p><table id="gladtable"><tr><td></td></tr><tr><td></td></tr><tr><td></td></tr><tr><td></td></tr></table>`
var numofglad = $('#roomDetails ul li').length

for (let mobnum = 1; mobnum < (numofglad+1); mobnum++) {

var gladimg = document.querySelector("#roomDetails > ul > li:nth-child("+mobnum+") > div > div.mr-3 > img").outerHTML.replaceAll(/<img alt="[^"]*" src="/g,"").replaceAll(/" class="spawnImage">/g,"")
var gladname = document.querySelector("#roomDetails > ul > li:nth-child("+mobnum+") > div > div.media-body > h6 > a").innerHTML
var gladlink = document.querySelector("#roomDetails > ul > li:nth-child("+mobnum+") > div > div.media-body > h6 > a").outerHTML.match(/mob\.php\?id=([0-9]+)&amp;h=([A-Za-z0-9]+)">/i)
var gladid = gladlink[1]
var gladhash = gladlink[2]

var glad = document.querySelector("#gladtable > tbody > tr:nth-child("+mobnum+")");
let td1 = document.createElement('td');
td1.innerHTML = `<img src="`+gladimg+`" height="37px" width="37px" onmouseover="popup(event,'`+gladname+`');" onmouseout="kill();">`
insertAfter(td1, glad.lastElementChild);

let td2 = document.createElement('td');
td2.innerHTML = `<input type="text" placeholder="# of ATKs" id="matk`+mobnum+`" class="atkn" name="atkn" size="7">`
insertAfter(td2, glad.lastElementChild);

let td3 = document.createElement('td');
td3.innerHTML = `<button id="mobatk_btn`+mobnum+`" id="slider_all_potions" class="btn btn-primary mmplus">ATK <img src=https://studiomoxxi.com/moxximod/bot.png class="robot" onmouseover="popup(event,'<b><font color=#f441be>MoxxiMod+</font></b><br>Attack the mob multiple times')" onmouseout="kill()"></button>`
insertAfter(td3, glad.lastElementChild);

let td4 = document.createElement('td');
td4.innerHTML = gladid
td4.setAttribute("style","color:#FF0000;display:none")
insertAfter(td4, glad.lastElementChild);

let td5 = document.createElement('td');
td5.innerHTML = gladhash
td5.setAttribute("style","display:none")
insertAfter(td5, glad.lastElementChild);

document.getElementById ("mobatk_btn"+mobnum+"").addEventListener("click", gladatk, false);
function gladatk (zEvent) {
    sendmobattacks = document.querySelector("#matk"+mobnum+"").value;
    sendmobid = document.querySelector("#gladtable > tbody > tr:nth-child("+mobnum+") > td:nth-child(5)").innerHTML;
    task04();
}}}}

haste();function haste(){
var room = document.querySelector("#roomid_display").innerHTML
if (room == "42619" || room == "42620" || room == "28123" || room == "27624" || room == "32876" || room == "32878" || room == "32877"){
fetch('skills_info.php?id=3024')
    .then(response => response.text())
    .then((response) => {
    const doc = new DOMParser().parseFromString(response, 'text/html');
    const haste = doc.querySelector("body").innerHTML.replace(`<div class="text-left">`,"").replace(`<input type="submit" name="cast" class="btn btn-primary" value="Cast Skill">`,`<input type="submit" name="cast" id="casthaste" class="btn btn-primary" value="Cast Skill">`)
    document.querySelector("#eqworld").innerHTML = haste
    if(haste.match(/This skill is recharging\. [0-9]+ minutes remaining\./i) == null){document.getElementById ("casthaste").addEventListener("click", casthaste, false)}
function casthaste (zEvent) {
fetch('cast_skills', {
  method: 'POST',
  headers: {'Content-Type': 'application/x-www-form-urlencoded'},
  body: new URLSearchParams({
    'castskillid': '3024',
    'cast': 'Cast Skill'
})})}})}}

roomeq();function roomeq(){
var room = document.querySelector("#roomid_display").innerHTML
if (room != "42619" && room != "42620" && room != "28123" && room != "27624" && room != "32876" && room != "32878" && room != "32877" && room != "28031" && room != "28031" && room != "28106" && room != "38726" && room != "38727" && room != "32878" && room != "32876" && room != "32877" && room != "28107" && room != "28105" && room != "28103" && room != "28101" && room != "28099" && room != "28097" && room != "28095" && room != "28093" && room != "28091"){
    document.querySelector("#eqworld").innerHTML = eq
    hotkeys = true
}}

attackframe();
function attackframe(){
$('a[target="_blank"]').prop("target", "attack");
$('img[src="landing/atkicon.png"]').prop("id", "attack");
document.querySelectorAll('#attack').forEach(item => {item.addEventListener('click', mobAtk, false)})
function mobAtk() {
document.querySelector("#content-header-row > div.col-xl-5.col-lg-12.col-md-6.col-sm-12.col-12.layout-spacing.px-1 > div > div.widget-content > div.room-top").innerHTML = `<iframe id="atkframe" name="attack" src="" style="opacity: 0.9 !important;"></iframe>`
GM_addStyle (`#atkframe{width:100% !important;height:420px !important;border:0px !important;}`)
}};

function automove_btn(){
if (map_display.innerHTML.match(`landing/owpath`) != null){
    document.querySelector("#content-header-row > div.col-xl-3.col-lg-6.col-md-6.col-sm-12.col-12.layout-spacing.px-1 > div > div.widget-content > div.tomb-middle > div.tomb-middle-list.middle-one > div").innerHTML = `<a href=#><img src="https://studiomoxxi.com/moxximod/automovebtn.png" width="100px" height="100px" id="moveme" onmouseover="popup(event,'<img src=landing/owpath.png>Automatically follow the path');" onmouseout="kill();"></a>`;
    document.querySelector("#moveme").addEventListener ("click", automove_on, false);}
if (map_display.innerHTML.match(`landing/owpath`) == null){document.querySelector("#content-header-row > div.col-xl-3.col-lg-6.col-md-6.col-sm-12.col-12.layout-spacing.px-1 > div > div.widget-content > div.tomb-middle > div.tomb-middle-list.middle-one > div").innerHTML = ``;}
}

var automove_switch = false;

function automove_on (zEvent) {automove_switch = true; automove()}
function automove(){if (automove_switch == true){
setTimeout(function() {
var s = document.querySelector("#mapHtml > table > tbody > tr:nth-child(5) > td:nth-child(4)").innerHTML.match("landing/owpath")
var a = document.querySelector("#mapHtml > table > tbody > tr:nth-child(4) > td:nth-child(3)").innerHTML.match("landing/owpath")
var d = document.querySelector("#mapHtml > table > tbody > tr:nth-child(4) > td:nth-child(5)").innerHTML.match("landing/owpath")
var w = document.querySelector("#mapHtml > table > tbody > tr:nth-child(3) > td:nth-child(4)").innerHTML.match("landing/owpath")
if (s!=null && a==null && d==null && w==null){document.querySelector("#shref").click()}
if (s==null && a!=null && d==null && w==null){document.querySelector("#ahref").click()}
if (s==null && a==null && d!=null && w==null){document.querySelector("#dhref").click()}
if (s==null && a==null && d==null && w!=null){document.querySelector("#whref").click()}
if (a && s){document.querySelector("#ahref").click();document.querySelector("#shref").click()}
if (s && d){document.querySelector("#shref").click();document.querySelector("#dhref").click()}
if (d && w){document.querySelector("#dhref").click();document.querySelector("#whref").click()}
if (w && a){document.querySelector("#whref").click();document.querySelector("#ahref").click()}
if (document.querySelector("#mapHtml > table > tbody > tr:nth-child(4) > td:nth-child(4)").innerHTML.match("landing/YAHX.png")){automove_switch = false;}
}, 200);}}
})

var menu = document.querySelector("#content-header-row > div.col-xl-5.col-lg-12.col-md-6.col-sm-12.col-12.layout-spacing.px-1")

let attackall = document.createElement('div');
attackall.innerHTML = `<h5>- Attack All Mobs -</h5>
<button id="atkallrm" class="btn btn-primary mmplus">ATTACK ALL <img src=https://studiomoxxi.com/moxximod/bot.png class="robot" onmouseover="popup(event,'<b><font color=#f441be>MoxxiMod+</font></b><br>Click the button or type 0 to attack all mobs in this room')" onmouseout="kill()"></button><br>click button or type "x" to attack all`
attackall.setAttribute("class","widget widget-table-one")
attackall.setAttribute("style","margin-top:1rem !important;")
insertAfter(attackall, menu.lastElementChild);

document.getElementById("atkallrm").addEventListener("click", atkallrm, false);
function atkallrm(){
if (GM_getValue("bauth_r").match("Full") != null){
var atkallwait = parseInt($('#roomDetails ul li').length)*333
document.querySelector("#content-header-row > div.col-xl-5.col-lg-12.col-md-6.col-sm-12.col-12.layout-spacing.px-1").innerHTML = `<img src="https://i.giphy.com/media/39zbpCQocXLi0/giphy.webp">`
setTimeout(function(){window.location.href = "world"},atkallwait)}
task12()}

var gotormnum = '';

var arrows = document.querySelector("#content-header-row > div.col-xl-3.col-lg-6.col-md-6.col-sm-12.col-12.layout-spacing.px-1 > div > div.widget-content > div.tomb-bottom > div")
arrows.innerHTML = arrows.innerHTML + `<h5>- Go To Room -</h5>
<center><table id="gotormtab"><tr><td>
<input type="text" placeholder="room #" id="gotormnum" class="goto" name="atkn" size="7">
</td><td>
<button id="gotorm" class="btn btn-primary mmplus">GO <img src=https://studiomoxxi.com/moxximod/bot.png class="robot" onmouseover="popup(event,'<b><font color=#f441be>MoxxiMod+</font></b><br>Move directly to a room: Move time may take a few<br>seconds depending on how far away you are going')" onmouseout="kill()"></button>
</td></tr></table>`

document.getElementById("gotorm").addEventListener("click", gotorm, false);
function gotorm (zEvent) {
gotormnum = document.querySelector("#gotormnum").value.replaceAll(",","");
task08();
GM_addStyle (`#sliderload{display:revert !important;position:fixed !important;left:50% !important;top:50% !important;margin-top:-110px !important;margin-left: -110px !important;background:#FF0000 !important;z-index:10000 !important;}`)
$("body").append (`<div id="sliderload"><img src=https://media.tenor.com/UnFx-k_lSckAAAAM/amalie-steiness.gif></div></div>`);
roomcheck();
function roomcheck(){
var room = '';
fetch("ajax_changeroomb")
.then (response => response.text())
.then((response) => {
room = response.match(/"curRoom":"([0-9]+)"/i)[1]
if (room != gotormnum) {setTimeout(function() {roomcheck()},250)}
if (room == gotormnum) {window.location.href = "world";}})}}

function doc_keyUp(e) {
    if (hotkeys == true){
    if (document.querySelector("#gotormnum") != document.activeElement){
    if (e.key === 'x') {document.querySelector("#atkallrm").click();}
    if (e.key === '1') {document.querySelector("#roomDetails > ul > li:nth-child(1) > div > div.ml-3.d-block.align-self-center > a > img").click();}
    if (e.key === '2') {document.querySelector("#roomDetails > ul > li:nth-child(2) > div > div.ml-3.d-block.align-self-center > a > img").click();}
    if (e.key === '3') {document.querySelector("#roomDetails > ul > li:nth-child(3) > div > div.ml-3.d-block.align-self-center > a > img").click();}
    if (e.key === '4') {document.querySelector("#roomDetails > ul > li:nth-child(4) > div > div.ml-3.d-block.align-self-center > a > img").click();}
    if (e.key === '5') {document.querySelector("#roomDetails > ul > li:nth-child(5) > div > div.ml-3.d-block.align-self-center > a > img").click();}
    if (e.key === '6') {document.querySelector("#roomDetails > ul > li:nth-child(6) > div > div.ml-3.d-block.align-self-center > a > img").click();}
    if (e.key === '7') {document.querySelector("#roomDetails > ul > li:nth-child(7) > div > div.ml-3.d-block.align-self-center > a > img").click();}
    if (e.key === '8') {document.querySelector("#roomDetails > ul > li:nth-child(8) > div > div.ml-3.d-block.align-self-center > a > img").click();}
    if (e.key === '9') {document.querySelector("#roomDetails > ul > li:nth-child(9) > div > div.ml-3.d-block.align-self-center > a > img").click();}}}}

document.addEventListener('keyup', doc_keyUp, false);
}

if (document.URL.indexOf("plrattack") != -1 && window.self !== window.top) {

var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutationRecord) {
    var playerhealth = (parseInt(document.querySelector("#attacker_health").outerHTML.match(/width: .*px/g).toString().replace("width: ","").replace("px",""))/245*100).toFixed(2);
    document.querySelector("#attackerhealth").innerHTML = playerhealth+"%"});});

var attacker_health = document.querySelector("#attacker_health");
observer.observe(attacker_health, { attributes : true, attributeFilter : ['style'] });

var observer2 = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutationRecord) {
    var defenderhealth = (parseInt(document.querySelector("#defender_health").outerHTML.match(/width: .*px/g).toString().replace("width: ","").replace("px",""))/245*100).toFixed(1);
    document.querySelector("#defenderhealth").innerHTML = defenderhealth+"%";});});

var defender_health = document.querySelector("#defender_health");
observer2.observe(defender_health, { attributes : true, attributeFilter : ['style'] });

$("body").append (`<div id="health"><b>ATTACKER HEALTH:</b> <span id="attackerhealth">100%</span><br><b>DEFENDER HEALTH:</b> <span id="defenderhealth">100%</span></div>`);

}

if (document.URL.indexOf("somethingelse") != -1 && window.self !== window.top && error == true) {GM_addStyle (`#tooltab{display:none !important;}`)
document.querySelector("body").innerHTML = `<div align="center" class="statbox widget box box-shadow" style="max-width: 650px;">
<div class="row"><div class="col-12 col-sm"><img class="mb-3" src="/img/error.png"><br><font face="Verdana, Arial, Helvetica, sans-serif">That mob is already dead!</font>
</div><div class="col-sm col-12 justify-content-center mt-sm-0 mt-3" id="errorimagebox"><img src="/images/ErrorImg.jpg"></div></div></div>`}

if (document.URL.indexOf("user_preferences") != -1 ) {document.querySelector("#content-header-row > form > div > div > div:nth-child(8) > div.col-8").innerHTML = `Outwar Attacks Shadowbox<br><font color="#FF0000">Must be turned OFF while using moxximod<p style="margin-bottom:20px">`}

if (document.URL.indexOf("closedpvp") != -1 && error == false) {
if (document.querySelector("body").innerHTML.match(/<h2 class="w-100 mb-3 alert-light-warning py-2">BRAWL IS ACTIVE<\/h2>/i) != null) {

GM_addStyle (`
#content-header-row > div:nth-child(3) > div:nth-child(2){display:none !important;}
#content-header-row > div:nth-child(3) > div:nth-child(3){display:none !important;}
#content-header-row > div:nth-child(3) > div:nth-child(4){display:none !important;}
#content-header-row > div:nth-child(4){display:none !important;}
#content-header-row > div:nth-child(3) > div:nth-child(1) > ul{display:none !important;}
#content-header-row > div:nth-child(3) > div:nth-child(1) > p{display:none !important;}
#content-header-row > div:nth-child(3) > div:nth-child(1) > h4{display:none !important;}
#content-header-row > h2{display:none !important;}
.col-lg-6{max-width:100% !important;flex:0 0 100% !important;}
.button {background: #060818 !important;margin: 6px !important;padding: 5px !important;margin-bottom: 15px !important;font-size: 12px !important;color: #e0e6ed !important;}
.button:hover {background:#3b3f5c !important;}
#finished {display:none !important;}
.table td, .table th {padding: 0.25rem;vertical-align: top;border-top: 1px solid #dee2e6;}
#char_table > table > thead > tr > th:nth-child(5){display:none !important;}
#char_table > table > tbody > tr > td:nth-child(5){display:none !important;}
`)

fetch("profile")
    .then(res => res.text())
    .then((responseText) => {
    const doc = new DOMParser().parseFromString(responseText, 'text/html');
    const skillsdiv = doc.querySelector("#divSkillsCast").innerHTML.replace(`<img src="http://torax.outwar.com/images/profile/ProfileSkills.png">`,"").replace(`<img src="http://sigil.outwar.com/images/profile/ProfileSkills.png">`,"")
    const my_power = parseInt(responseText.match(/TOTAL POWER.*[\n\r].*<font size="2">(.*)<\/font><\/b><\/td>/i)[1].replaceAll(",",""))
    const my_name = doc.querySelector("#divHeaderName > font").innerHTML

var char_table = document.querySelector("#content-header-row > div:nth-child(4) > div").innerHTML.replace("Your Attacks","Attacks").replace(" Rank ","Rank").replace(" Character ","Character").replace(" Wins ","Wins").replace(" Damage ","Damage")
let brawl_divs = document.querySelector("#content-header-row > div:nth-child(3)");
let div0 = document.createElement('div');
div0.innerHTML = "<h5>Your skills</h5><p>"+skillsdiv;
div0.setAttribute("class","widget-content widget-content-area")
div0.setAttribute("style","margin-top:1rem !important;width:")
insertAfter(div0, brawl_divs.lastElementChild);
let div1 = document.createElement('div');
div1.innerHTML = `<div id=brawlbuttons><button id='button1' class='button'>HIDE ATTACKED</button> <button id='button2' class='button'>SHOW ALL</button></div><p style="margin-bottom:0.5rem">`+char_table;
div1.setAttribute("style","margin-top:1rem !important;")
div1.setAttribute("class","widget-content widget-content-area")
div1.setAttribute("id","char_table")
insertAfter(div1, brawl_divs.lastElementChild);

document.querySelector("#button1").addEventListener ("click", Button1, false);
function Button1 (zEvent) {GM_addStyle (`#finished {display:none !important;}`);}

document.querySelector("#button2").addEventListener ("click", Button2, false);
function Button2 (zEvent) {GM_addStyle (`#finished {display:revert !important;}`);}

let brawl_headers = document.querySelector("#char_table > table > thead > tr")
let b_header0 = document.createElement('th');
b_header0.innerHTML = ``;
insertAfter(b_header0, brawl_headers.lastElementChild);
let b_header1 = document.createElement('th');
b_header1.innerHTML = `<a onmouseover="popup(event,'<font color=#80ff80><b>Player has less power than you<br><font color=#ffff80><b>Player has similar power to you<br><font color=#ff8080><b>Player has more power than you');" onmouseout="kill();">POWER`;
insertAfter(b_header1, brawl_headers.lastElementChild);
let b_header2 = document.createElement('th');
b_header2.innerHTML = `SKILLS`;
insertAfter(b_header2, brawl_headers.lastElementChild);
let b_header3 = document.createElement('th');
b_header3.innerHTML = `PRIZE`;
insertAfter(b_header3, brawl_headers.children[1]);

if (document.querySelector("#char_table > table > thead > tr > th:nth-child(7)").innerHTML == "SKILLS"){GM_addStyle (`#content-header-row > div:nth-child(3) > div:nth-child(5),#brawlbuttons {display:none !important;}`)}

var brawl_memb = document.querySelector("#char_table > table > tbody").rows.length;
for (let rownum = 1; rownum < parseInt(brawl_memb)+1; rownum++) {

var brawl_list = document.querySelector("#char_table > table > tbody > tr:nth-child("+rownum+") > td:nth-child(2) > a").outerHTML.replace(/<a href="/i,"").replace(/">.*<\/a>/,"")

if (document.querySelector("#char_table > table > tbody > tr:nth-child("+rownum+") > td:nth-child(5)") != null){if (document.querySelector("#char_table > table > tbody > tr:nth-child("+rownum+") > td:nth-child(5)").innerHTML == "10"){document.querySelector("#char_table > table > tbody > tr:nth-child("+rownum+")").setAttribute("id", "finished")}}

fetch(brawl_list)
    .then(res => res.text())
    .then((responseText) => {
    const doc = new DOMParser().parseFromString(responseText, 'text/html');
    var power = parseInt(responseText.match(/TOTAL POWER.*[\n\r].*<font size="2">(.*)<\/font><\/b><\/td>/i)[1].replaceAll(",",""))
    var skills = ''
    if (responseText.match(/Circle of Protection<\/b><br \/>You conjure a circle of elemental energy to protect you in battle\. Reduce damage taken in PvP combat by .*.<br \/>(.*) left<br>Cast By/i) != null)
    {skills += "<font color=#ffff80>Circle of Protection:</font> "+responseText.match(/Circle of Protection<\/b><br \/>You conjure a circle of elemental energy to protect you in battle\. Reduce damage taken in PvP combat by .*.<br \/>(.*) left<br>Cast By/i)[1]+" <br>"}
    var name = doc.querySelector("#divHeaderName > font").innerHTML
    var sunderRegExp = new RegExp ("Sunder Armor<\/b><br \/>Target takes 30% more damage from you\. Only castable if you have no active Sunder debuffs cast\.<br \/>(.*)<br>Cast By "+my_name,"i")
    var sunderRegExpx = new RegExp ("Sunder Armor<\/b><br \/>Target takes 30% more damage from you\. Only castable if you have no active Sunder debuffs cast\.<br \/>(.*)<br>Cast By "+name,"i")
    if (responseText.match(sunderRegExp) != null){skills += "<font color=#80ff80>You Cast Sunder Armor:</font> "+responseText.match(sunderRegExp)[1].replace(" left","")+"<br>"}
    if (skillsdiv.match(sunderRegExpx) != null){skills += "<font color=#ff8080>Cast Sunder Armor on You:</font> "+skillsdiv.match(sunderRegExpx)[1].replace(" left","")+"<br>"}
    var dartRegExp = new RegExp ("Poison Dart<\/b><br \/>You strike your target with a poisonous dart\. Target takes 5,000 damage each time they attack you, or you attack them\.<br \/>(.*)<br>Cast By "+my_name,"i")
    var dartRegExpx = new RegExp ("Poison Dart<\/b><br \/>You strike your target with a poisonous dart\. Target takes 5,000 damage each time they attack you, or you attack them\.<br \/>(.*)<br>Cast By "+name,"i")
    if (responseText.match(dartRegExp) != null){skills += "<font color=#80ff80>You Cast Poison Dart:</font> "+responseText.match(dartRegExp)[1].replace(" left","")+"<br>"}
    if (skillsdiv.match(dartRegExpx) != null){skills += "<font color=#ff8080>Cast Poison Dart on You:</font> "+skillsdiv.match(dartRegExpx)[1].replace(" left","")+"<br>"}

var atkactive = document.querySelector("#char_table > table > tbody > tr:nth-child("+rownum+") > td:nth-child(5)").outerHTML.match(`alt="Attack!"`)
var atkcharid = document.querySelector("#char_table > table > tbody > tr:nth-child("+rownum+") > td:nth-child(2)").outerHTML.match(/id=([0-9]+)/i)[1]

var atk10x = ''
if (atkactive != null) {atk10x = `<button id='atk10x`+rownum+`' class='btn btn-primary mmplus'>ATK 10x <img src="https://studiomoxxi.com/moxximod/bot.png" class="robot" onmouseover="popup(event,'<b><font color=#f441be>MoxxiMod+</font></b><br>Attack player 10x')" onmouseout="kill()"></button>`}

setTimeout(function() {
document.querySelectorAll('#atk10x'+rownum).forEach(item => {item.addEventListener('click', tentimes, false)})
},1000);

function tentimes(){
atk10x_charid = atkcharid
task02();
}

var member_tr = document.querySelector("#char_table > table > tbody > tr:nth-child("+rownum+")")
let atk10TD = document.createElement('td');
atk10TD.innerHTML = atk10x
insertAfter(atk10TD, member_tr.lastElementChild);
let powerTD = document.createElement('td');
powerTD.innerHTML = power.toLocaleString("en-US");
insertAfter(powerTD, member_tr.lastElementChild);
if (Math.abs(my_power-power) <= (my_power*0.01)){powerTD.setAttribute("style","color:#ffff80")}
if ((power-my_power) >= (my_power*0.01)){powerTD.setAttribute("style","color:#ff8080")}
if ((my_power-power) >= (my_power*0.01)){powerTD.setAttribute("style","color:#80ff80")}
if (power == my_power){powerTD.innerHTML = "<font color=#888ea8>-</font>";}

let skillsTD = document.createElement('td');
skillsTD.innerHTML = skills;
insertAfter(skillsTD, member_tr.lastElementChild);

var copbutton = ``
var coptime = ''
var copactive = document.querySelector("#char_table > table > tbody > tr:nth-child("+rownum+") > td:nth-child(8)").outerHTML.match(`Circle of Protection`)
if (copactive != null){coptime = document.querySelector("#char_table > table > tbody > tr:nth-child("+rownum+") > td:nth-child(8)").outerHTML.match(/<font color="#ffff80">Circle of Protection:<\/font> (.*) <br>/i)[1].replaceAll(" ","").replace("mins","").replace("s","")}
if (copactive != null && atkactive != null){copbutton = `<button id='wait4cop`+rownum+`' class='btn btn-primary mmplus'>WAIT FOR COP <img src="https://studiomoxxi.com/moxximod/bot.png" class="robot" onmouseover="popup(event,'<b><font color=#f441be>MoxxiMod+</font></b><br>Attack 10x as soon as COP expires')" onmouseout="kill()"></button>`}
if (copactive == null || atkactive == null){copbutton = ""}

setTimeout(function() {
document.querySelectorAll('#wait4cop'+rownum).forEach(item => {item.addEventListener('click', wait4cop, false)})
},1000);

function wait4cop(){
brawlcop_string = atkcharid+"|"+coptime
task03();
}

let buttonTD = document.createElement('td');
buttonTD.innerHTML = copbutton;
insertAfter(buttonTD, member_tr.lastElementChild);

var rank = parseInt(document.querySelector("#char_table > table > tbody > tr:nth-child("+rownum+") > td:nth-child(1)").innerHTML.replace(".",""))
var prize = ''
if (rank == "1"){prize = "20 coins"}
if (rank == "2"){prize = "17 coins"}
if (rank == "3"){prize = "15 coins"}
if (rank == "4"){prize = "13 coins"}
if (rank == "5"){prize = "11 coins"}
if (rank == "6" || rank == "7" || rank == "8"){prize = "10 coins"}
if (rank == "9" || rank == "10" || rank == "11"){prize = "9 coins"}
if (rank == "12" || rank == "13" || rank == "14"){prize = "8 coins"}
if (rank == "15" || rank == "16" || rank == "17"){prize = "7 coins"}
if (rank == "18" || rank == "19" || rank == "20"){prize = "6 coins"}
if (rank == "21" || rank == "22" || rank == "23" || rank == "24" || rank == "25"){prize = "5 coins"}
if (rank == "26" || rank == "27" || rank == "28" || rank == "29" || rank == "30"){prize = "4 coins"}
if (rank >= 31){prize ="none"}

let prizeTD = document.createElement('td');
prizeTD.innerHTML = prize;
insertAfter(prizeTD, member_tr.children[1]);

if (char_table.match(/images\/atk_player_icon\.jpg/i) == null){GM_addStyle(`#finished {display:revert !important;}`)}

})}})}

if (document.querySelector("body").innerHTML.match(/<h2 class="w-100 mb-3 alert-light-warning py-2">BRAWL IS ACTIVE<\/h2>/i) == null) {

GM_addStyle (`
#content-header-row > div:nth-child(3) > div > table > thead > tr > th:nth-child(1){display:none !important;}
#content-header-row > div:nth-child(3) > div > table > tbody > tr > td:nth-child(1){display:none !important;}
#content-header-row > div:nth-child(3) > div > table > thead > tr > th:nth-child(3){display:none !important;}
#content-header-row > div:nth-child(3) > div > table > tbody > tr > td:nth-child(3){display:none !important;}
#content-header-row > div:nth-child(3) > div > table > thead > tr > th:nth-child(4){display:none !important;}
#content-header-row > div:nth-child(3) > div > table > tbody > tr > td:nth-child(4){display:none !important;}
`)

let brawl_headers = document.querySelector("#content-header-row > div:nth-child(3) > div > table > thead > tr")
let b_header1 = document.createElement('th');
b_header1.innerHTML = `<a onmouseover="popup(event,'<font color=#80ff80><b>Player has less power than you<br><font color=#ffff80><b>Player has similar power to you<br><font color=#ff8080><b>Player has more power than you');" onmouseout="kill();">POWER`;
insertAfter(b_header1, brawl_headers.lastElementChild);
let b_header2 = document.createElement('th');
b_header2.innerHTML = `SKILLS`;
insertAfter(b_header2, brawl_headers.lastElementChild);

fetch("profile")
    .then(res => res.text())
    .then((responseText) => {
    const doc = new DOMParser().parseFromString(responseText, 'text/html');
    const skillsdiv = doc.querySelector("#divSkillsCast").innerHTML.replace(`<img src="http://torax.outwar.com/images/profile/ProfileSkills.png">`,"").replace(`<img src="http://sigil.outwar.com/images/profile/ProfileSkills.png">`,"")
    const my_power = parseInt(responseText.match(/TOTAL POWER.*[\n\r].*<font size="2">(.*)<\/font><\/b><\/td>/i)[1].replaceAll(",",""))
    const my_name = doc.querySelector("#divHeaderName > font").innerHTML

var brawl_memb = document.querySelector("#content-header-row > div:nth-child(3) > div > table > tbody").rows.length;
for (let rownum = 1; rownum < parseInt(brawl_memb)+1; rownum++) {

var brawl_list = document.querySelector("#content-header-row > div:nth-child(3) > div > table > tbody > tr:nth-child("+rownum+") > td:nth-child(2) > a").outerHTML.replace(/<a href="/i,"").replace(/">.*<\/a>/,"")

fetch(brawl_list)
    .then(res => res.text())
    .then((responseText) => {
    const doc = new DOMParser().parseFromString(responseText, 'text/html');
    var power = parseInt(responseText.match(/TOTAL POWER.*[\n\r].*<font size="2">(.*)<\/font><\/b><\/td>/i)[1].replaceAll(",",""))
    var skills = ''
    if (responseText.match(/Circle of Protection<\/b><br \/>You conjure a circle of elemental energy to protect you in battle\. Reduce damage taken in PvP combat by .*.<br \/>(.*) left<br>Cast By/i) != null){skills += "<font color=#ffff80>Circle of Protection:</font> "+responseText.match(/Circle of Protection<\/b><br \/>You conjure a circle of elemental energy to protect you in battle\. Reduce damage taken in PvP combat by .*.<br \/>(.*) left<br>Cast By/i)[1]+"<br>"}
    var name = doc.querySelector("#divHeaderName > font").innerHTML
    var sunderRegExp = new RegExp ("Sunder Armor<\/b><br \/>Target takes 30% more damage from you\. Only castable if you have no active Sunder debuffs cast\.<br \/>(.*)<br>Cast By "+my_name,"i")
    var sunderRegExpx = new RegExp ("Sunder Armor<\/b><br \/>Target takes 30% more damage from you\. Only castable if you have no active Sunder debuffs cast\.<br \/>(.*)<br>Cast By "+name,"i")
    if (responseText.match(sunderRegExp) != null){skills += "<font color=#80ff80>You Cast Sunder Armor:</font> "+responseText.match(sunderRegExp)[1].replace(" left","")+"<br>"}
    if (skillsdiv.match(sunderRegExpx) != null){skills += "<font color=#ff8080>Cast Sunder Armor on You:</font> "+skillsdiv.match(sunderRegExpx)[1].replace(" left","")+"<br>"}
    var dartRegExp = new RegExp ("Poison Dart<\/b><br \/>You strike your target with a poisonous dart\. Target takes 5,000 damage each time they attack you, or you attack them\.<br \/>(.*)<br>Cast By "+my_name,"i")
    var dartRegExpx = new RegExp ("Poison Dart<\/b><br \/>You strike your target with a poisonous dart\. Target takes 5,000 damage each time they attack you, or you attack them\.<br \/>(.*)<br>Cast By "+name,"i")
    if (responseText.match(dartRegExp) != null){skills += "<font color=#80ff80>You Cast Poison Dart:</font> "+responseText.match(dartRegExp)[1].replace(" left","")+"<br>"}
    if (skillsdiv.match(dartRegExpx) != null){skills += "<font color=#ff8080>Cast Poison Dart on You:</font> "+skillsdiv.match(dartRegExpx)[1].replace(" left","")+"<br>"}

var member_tr = document.querySelector("#content-header-row > div:nth-child(3) > div > table > tbody > tr:nth-child("+rownum+")")
let powerTD = document.createElement('td');
powerTD.innerHTML = power.toLocaleString("en-US");
insertAfter(powerTD, member_tr.lastElementChild);
if (Math.abs(my_power-power) <= (my_power*0.01)){powerTD.setAttribute("style","color:#ffff80")}
if ((power-my_power) >= (my_power*0.01)){powerTD.setAttribute("style","color:#ff8080")}
if ((my_power-power) >= (my_power*0.01)){powerTD.setAttribute("style","color:#80ff80")}
if (power == my_power){powerTD.innerHTML = "<font color=#888ea8>-</font>";}

let skillsTD = document.createElement('td');
skillsTD.innerHTML = skills;
insertAfter(skillsTD, member_tr.lastElementChild);

})}})}}

if (document.URL.indexOf("crew_bossspawns") != -1 && error == false) {

GM_addStyle (`
#divCollections > div.row > div > div{height:360px !important;box-shadow: 0 6px 10px 0 rgba(0,0,0,.75),0 1px 18px 0 rgba(0,0,0,.75),0 3px 5px -1px rgba(0,0,0,.75);}
#divCollections > div.row > div > div > div > div.user-profile{display:none !important;}
.boss-widget{background:#131313 !important;background:rgba(0,0,0,0.9) !important;padding:10px !important;border-radius:6px !important;width:250px !important;margin-bottom:1rem !important;color:#FFFFFF !important;}
#content-header-row > div.col-12.layout-spacing{display:none !important;}
.col-xl-6 {-ms-flex: 0 0 33%;flex: 0 0 33%;max-width: 33%;}
.component-card_4 {width: 20rem;margin: 0 auto;border: 1px solid #7A0909;border-radius: 25px;}
.user-info {padding: 9px 8px 24px 0 !important;}
#divHeader{display:none !important;}
#content > div.layout-px-spacing{background: transparent !important;box-shadow: 0px 0px 0px #000000,0px 0px 0px #000000 !important;}
`);

var bossCount = $('#divCollections > div.row > div').length

for (let bossNum = 1; bossNum < 1+bossCount; bossNum++) {

var img_lnk = document.querySelector("#divCollections > div.row > div:nth-child("+bossNum+") > div > div > div.user-profile > a").outerHTML.match(/<a href=.*onmouseout="kill\(\)">/i)
document.querySelector("#divCollections > div.row > div:nth-child("+bossNum+") > div > div > div.user-info.w-100.pr-3 > h3").innerHTML = `<div class="boss-widget">`+img_lnk+document.querySelector("#divCollections > div.row > div:nth-child("+bossNum+") > div > div > div.user-info.w-100.pr-3 > h3").innerHTML

var bossimg = document.querySelector("#divCollections > div.row > div:nth-child("+bossNum+") > div > div > div.user-profile > a > img").outerHTML.match(/(images\/.*)" width="166" /i)[1]
document.querySelector("#divCollections > div.row > div:nth-child("+bossNum+") > div").setAttribute("style","background-image:url("+bossimg+") !important;background-size:100% 100% !important")

var bossLink = document.querySelector("#divCollections > div.row > div:nth-child("+bossNum+") > div > div > div.user-info.w-100.pr-3 > p.card-user_occupation > a")

var boss = '';
if (bossLink != null){boss = document.querySelector("#divCollections > div.row > div:nth-child("+bossNum+") > div > div > div.user-info.w-100.pr-3 > p.card-user_occupation > a")}
if (bossLink != null){
fetch(boss)
   .then(response => response.text())
   .then((response) => {
var bossName = response.match(/<h1 class="w-100">(.*)<\/h1>/i)
if (bossName != null){var bossHP = '';
if (bossName[1] == "Cosmos, Great All Being"){bossHP = "100000000000"}
if (bossName[1] == "Death, Reaper of Souls"){bossHP = "290000000000"}
if (bossName[1] == "Maekrix, Dreaded Striker"){bossHP = "320000000000"}
if (bossName[1] == "Blackhand Reborn"){bossHP = "570000000000"}
if (bossName[1] == "Zyrak, Vision of Madness"){bossHP = "1200000000000"}
if (bossName[1] == "Arkron, God of Trials"){bossHP = "900000000000"}
var crew1 = response.match(/<font color="#CC0000">(.*)<\/font>.*[\n\r].*<td>(.*) \(.*\)<\/font>/i);
const reducer = (accumulator, curr) => accumulator + curr
var BaseDmgArray = [];
var BaseMatch = response.matchAll(/<td>(.*) \(/g);
for (const BaseMatchLoop of BaseMatch) {
let BaseObj = [parseInt(BaseMatchLoop[1].replace(",","").replace(",","").replace(",",""))];
for (const BaseDmg of BaseObj) {
BaseDmgArray.push(BaseDmg);}}
var BaseNumbers = BaseDmgArray.map(Number)
var SumOfBase = BaseNumbers.reduce(reducer)
var cosmosPerc = ((bossHP-SumOfBase)/bossHP*100).toFixed(3)
var cosmosRemain = Math.round(SumOfBase*cosmosPerc/(100-cosmosPerc))

document.querySelector("#divCollections > div.row > div:nth-child("+bossNum+") > div > div > div.user-info.w-100.pr-3 > p.card-user_occupation").innerHTML = `
<div class="boss-widget"><b>TOTAL DAMAGE</b><br>`+SumOfBase.toLocaleString("en-US")+`<br><a href=`+document.querySelector("#divCollections > div.row > div:nth-child("+bossNum+") > div > div > div.user-info.w-100.pr-3 > p.card-user_occupation > a")+`>(details)</a></div>
<div class="boss-widget"><b>LEADING CREW</b><br>`+crew1[1]+`<br>`+crew1[2]+`</div>
<div class="boss-widget"><b>HEALTH REMAINING</b><br>`+cosmosRemain.toLocaleString("en-US")+`<br>(`+cosmosPerc+`%)</div>`

}})}}}

if (document.URL.indexOf("boss_stats") != -1 && error == false) {

let str = document.querySelector("#content-header-row > div > table")
str.innerHTML = str.innerHTML.replace("Ancestral","<font color=#FF00FF>Ancestral")
.replace("Tomb","Tomb</font>")
.replace("Boon of Vision","<font color=#FF00FF>Boon of Madness</font>")
.replace("Tier 2 Booster Upgrade","<font color=#FF8000>Tier 2 Booster Upgrade</font>")
.replace("8-Bit Banana","<font color=#FF8000>8-Bit Banana</font>")
.replace("Augment of Vision","<font color=#FF8000>Augment of Vision</font>")
.replace("Transcended Extract","<font color=#FF8000>Transcended Extract</font>")
.replace("Augment of Madness","<font color=#FF8000>Augment of Madness</font>")
.replace("Prophecy Mail Reborn","<font color=#FFDE5B>Prophecy Mail Reborn</font>")
.replace("Cord of Freezing Winds Reborn","<font color=#FFDE5B>Cord of Freezing Winds Reborn</font>")
.replace("Soul of Blackhand Reborn","<font color=#FFDE5B>Soul of Blackhand Reborn</font>")
.replace("Trinket of Aridity Reborn","<font color=#FFDE5B>Trinket of Aridity Reborn</font>")
.replace("Interstellar Leggings Reborn","<font color=#FFDE5B>Interstellar Leggings Reborn</font>")
.replace("Myrmidon Helm Reborn","<font color=#FFDE5B>Myrmidon Helm Reborn</font>")
.replaceAll("Blackhand Reborn","<font color=#FFDE5B>Blackhand Reborn</font>")
.replace("Incredible Tower Shield Reborn","<font color=#FFDE5B>Incredible Tower Shield Reborn</font>")
.replace("Ring of the Sea Reborn","<font color=#FFDE5B>Ring of the Sea Reborn</font>")
.replace("Boots of the Eagle Reborn","<font color=#FFDE5B>Boots of the Eagle Reborn</font>")
.replace("Core of Exalted Perfection","<font color=#FFDE5B>Core of Exalted Perfection</font>")
.replace("Greathelm of Exalted Perfection","<font color=#FFDE5B>Greathelm of Exalted Perfection</font>")
.replace("Brooch of Exalted Perfection","<font color=#FFDE5B>Brooch of Exalted Perfection</font>")
.replace("Launcher of Exalted Perfection","<font color=#FFDE5B>Launcher of Exalted Perfection</font>")
.replace("Cuirass of Exalted Perfection","<font color=#FFDE5B>Cuirass of Exalted Perfection</font>")
.replace("Boon of Exalted Perfection","<font color=#FFDE5B>Boon of Exalted Perfection</font>")
.replace("Link of Exalted Perfection","<font color=#FFDE5B>Link of Exalted Perfection</font>")
.replace("Scales of Exalted Perfection","<font color=#FFDE5B>Scales of Exalted Perfection</font>")
.replace("Twirl of Exalted Perfection","<font color=#FFDE5B>Twirl of Exalted Perfection</font>")
.replace("Spurs of Exalted Perfection","<font color=#FFDE5B>Spurs of Exalted Perfection</font>")

var deadCheck = document.querySelector("#content-header-row > div > table > tbody > tr:nth-child(1) > td:nth-child(3)").innerHTML;
if (deadCheck > 0){

GM_addStyle ( `
.table-bordered td, .table-bordered th {border: 0px solid !important;}
#content-header-row > div > table > thead > tr > th{display:none !important;}
#content-header-row > div > table > tbody > tr > td:nth-child(2){display:none !important;}
#content-header-row > div > table > tbody > tr > td:nth-child(3){display:none !important;}
.table>tbody tr {border-bottom: 0px solid #191e3a;}
#content-header-row > div > table > tbody > tr{border-bottom:1px SOLID !important;}
#bossloot > b{padding:5px !important;}
`);

var bossTableX = document.querySelector("#content-header-row > div > table");
var bossTableRowsX = bossTableX.rows.length;

function insertAfter(newNode, existingNode) {existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);}

var bossName = document.querySelector("#content-header-row > h1").innerHTML
var lootCount = '';
if (bossName == "Cosmos, Great All Being"){lootCount = "50"}
if (bossName == "Death, Reaper of Souls"){lootCount = "80"}
if (bossName == "Maekrix, Dreaded Striker"){lootCount = "73"}
if (bossName == "Blackhand Reborn"){lootCount = "61"}
if (bossName == "Zyrak, Vision of Madness"){lootCount = "65"}
if (bossName == "Arkron, God of Trials"){lootCount = "160"}

for (let rownumX = 1; rownumX < bossTableRowsX; rownumX++) {

var crewName = document.querySelector("#content-header-row > div > table > tbody > tr:nth-child("+rownumX+") > td:nth-child(1) > a > font").innerHTML.replace("'","");
var percentage = document.querySelector("#content-header-row > div > table > tbody > tr:nth-child("+rownumX+") > td:nth-child(2)").innerHTML.replace(/.*\(/i,"").replace("%)","");
let bossLootCnt = document.querySelector("#content-header-row > div > table > tbody > tr:nth-child("+rownumX+") > td:nth-child(3)").innerHTML
let bossLoot = document.querySelector("#content-header-row > div > table > tbody > tr:nth-child("+rownumX+") > td:nth-child(3)").outerHTML
bossLoot = `<table id=bossloottable><tr><td width=50px class="noborder"><center><span id=bossloot style='background-color: #D4D4D4; color: #202020;'><b>`+bossLootCnt+`</b><br></span><a onmouseover="popup(event,'`+crewName+`s expected items')" onmouseout="kill()"><font size=1 color=#D4D4D4>(`+Math.round(percentage/100*lootCount)+`)</td><td class="noborder"> `+bossLoot.replace(/<td onmouseover="popup\(event,'/g,"").replace(/<br>','808080'\)" onmouseout="kill\(\)>.*<\/td>/g,"").replaceAll("<br>",", ").replaceAll(/No Items','808080'\)" onmouseout="kill\(\)">0/g,"").replaceAll(/, ','808080'\)" onmouseout="kill\(\)">[0-9]+/g,"");
let menu = document.querySelector("#content-header-row > div > table > tbody > tr:nth-child("+rownumX+")");
let td = document.createElement('td');
td.innerHTML = bossLoot;
insertAfter(td, menu.lastElementChild);

}}}

if (document.URL.indexOf("boss_stats") != -1 && error == false) {

let bossName = document.querySelector("#content-header-row > h1").innerHTML

let lootCount = '';
if (bossName == "Cosmos, Great All Being"){lootCount = "50"}
if (bossName == "Death, Reaper of Souls"){lootCount = "78"}
if (bossName == "Maekrix, Dreaded Striker"){lootCount = "73"}
if (bossName == "Blackhand Reborn"){lootCount = "61"}
if (bossName == "Zyrak, Vision of Madness"){lootCount = "64"}
if (bossName == "Arkron, God of Trials"){lootCount = "160"}

var bossHP = '';
if (bossName == "Cosmos, Great All Being"){bossHP = "100000000000"}
if (bossName == "Death, Reaper of Souls"){bossHP = "290000000000"}
if (bossName == "Maekrix, Dreaded Striker"){bossHP = "320000000000"}
if (bossName == "Blackhand Reborn"){bossHP = "570000000000"}
if (bossName == "Zyrak, Vision of Madness"){bossHP = "1200000000000"}
if (bossName == "Arkron, God of Trials"){bossHP = "900000000000"}

var bossIMG = '';
if (bossName == "Cosmos, Great All Being"){bossIMG = "images/CosmosGreatAllBeing_grey.jpg"}
if (bossName == "Death, Reaper of Souls"){bossIMG = "images/DeathReaperOfSouls.jpg"}
if (bossName == "Maekrix, Dreaded Striker"){bossIMG = "images/MaekrixDreadedStriker.jpg"}
if (bossName == "Blackhand Reborn"){bossIMG = "images/BlackhandReborn.png"}
if (bossName == "Zyrak, Vision of Madness"){bossIMG = "images/velserverboss_grey.jpg"}
if (bossName == "Arkron, God of Trials"){bossIMG = ""}

var loottable = '';
if (bossName == "Cosmos, Great All Being"){loottable = `Demonic Teleporter x1<br>Recharge the Fury x4<br>Cosmos Talisman x10<br>Tome of Daily Grind x5<br>Key to Knights Horror x9<br>Astral Shard x4<br>Quest Shard x5<br>Recharge Totem x3<br>Star Power x4<br>Ticket to the Mystifying Carnival x3<br>Containment Orb x2<br>Orb of the Scepter x1<br>Amulet Chest (50) x2`}
if (bossName == "Death, Reaper of Souls"){loottable = `Recharge Totem x3<br>Recharge the Fury x10<br>Standard Issue Neuralyzer x6<br>Death Talisman x12<br>Pirate Treasure Map x6<br>Key of the Elements x6<br>Advanced Neuralyzer x2<br>Trinket Items x10<br>Elemental Vigor Orb x2<br>Elemental Assault Orb x2<br>Elemental Defense Orb x2<br>Amulet Chest (50) x4<br><font color=#fff000>Chancellor Item x20<br><font color=#fff000>Spiral Gear x10`}
if (bossName == "Maekrix, Dreaded Striker"){loottable = `Red Dragon Items x9<br>Astral Totem x10<br>Maekrix Talisman x12<br>Key to the Alsayic Ruins (Solo) x2<br>Juggernaut Talisman x8<br>Advanced Neuralyzer x2<br>Irthys Vigor Orb x3<br>Irthys Assault Orb x3<br>Irthys Defense Orb x3<br>Add Augment Slot x4<br>Remove Augment x8<br>Amulet Chest (50) x6<br><font color=#FFF000>Nobel Gear x10`}
if (bossName == "Blackhand Reborn"){loottable = `Augment of the Reborn Knight x1<br>Blackhand Reborn Items x10<br>Core of Blackhand x2<br>Essence of Reincarnation x1<br>Blackhand Talisman x4<br>Profound Ward x10<br>8-Bit Banana x1<br>Buckler of Insanity x3<br>Hauberk of Lunacy x3<br>Charm of Havoc x3<br>Unstoppable Concoction x10<br>Advanced Neuralyzer x2<br>Power Potion Pack x2<br>Flask of Endurance x5<br>Magic Gem x1<br><font color=#FFF000>Perfection Gear x10`}
if (bossName == "Zyrak, Vision of Madness"){loottable = `Augment of Madness x1<br>Unstable Jewel x6<br>Veldarabloom x3<br>Scripture of Zyrak x3<br>Pulsating Stone x2<br>Bottled Chaos x1<br>Thunder Ball x10<br>Force of Veldara x10<br>Interstellar Vessel x6<br>Vault Tear x6<br>Vial of Insanity x6<br>Demonic Madness x3<br>Infinite Tower Spheroid x1<br>Transcended Extract x1<br>Tier 2 Booster Upgrade x1<br><font color=#FFF000>Exalted Gear x10<br><font color=#FFF000>Boon of Vision x1<br><font color=#FFF000>Ancestral Tomb x3`}

var bossTable = document.querySelector("#content-header-row > div > table");
var bossTableRows = bossTable.rows.length;

function insertAfter(newNode, existingNode) {
existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);}

var aliveCheck = document.querySelector("#content-header-row > div > table > tbody > tr:nth-child(1) > td:nth-child(3)").innerHTML;
if (aliveCheck < 1){

GM_addStyle ( `
#content-header-row > div > table > thead > tr > th:nth-child(3){display:none !important;}
#content-header-row > div > table > tbody > tr > td:nth-child(3){display:none !important;}
#content-header-row > div > table > thead > tr > th:nth-child(2){display:none !important;}
#content-header-row > div > table > tbody > tr > td:nth-child(2){display:none !important;}
.table td, .table th {padding-left:0.5rem !important;padding: 0.2rem;vertical-align: top;border-top: 1px solid #dee2e6;}
#content-header-row > h1{display:none !important;}
#content-header-row > div > table > tbody > tr > td{color:#FFFFFF !important;}
#content-header-row > div > table > tbody > tr > td:nth-child(1) > a > font{color:#FFFFFF !important;}
#content-header-row > h5 > div{background-image:url('https://studiomoxxi.com/ow_themes/custom_jobs/minimal_01/mm_patern.png') !important;}
#content-header-row > div > table{box-shadow: 0 6px 10px 0 rgba(0,0,0,.14),0 1px 18px 0 rgba(0,0,0,.12),0 3px 5px -1px rgba(0,0,0,.2);}
#content > div.layout-px-spacing{background:transparent !important;box-shadow: 0px 0px 0px #000000,-0px -0px 0px #000000 !important;}
`);

let menu = document.querySelector("#content-header-row > div > table > thead > tr");

let th1= document.createElement('th');
th1.innerHTML = `DAMAGE`;
insertAfter(th1, menu.lastElementChild);
let th2= document.createElement('th');
th2.innerHTML = `PERCENT`;
insertAfter(th2, menu.lastElementChild);
let th8= document.createElement('th');
th8.innerHTML = `<a onmouseover="popup(event,'The number of items already earned based on current damage')" onmouseout="kill()">EARNED</a>`;
insertAfter(th8, menu.lastElementChild);
let th3= document.createElement('th');
th3.innerHTML = `EST TOT DMG`;
insertAfter(th3, menu.lastElementChild);
let th4= document.createElement('th');
th4.innerHTML = `EST ITEMS`;
insertAfter(th4, menu.lastElementChild);
let th5= document.createElement('th');
th5.innerHTML = `STATUS`;
insertAfter(th5, menu.lastElementChild);
let th6= document.createElement('th');
th6.innerHTML = `LAST DMG`;
insertAfter(th6, menu.lastElementChild);
let th7=document.createElement('th');
th7.innerHTML = `MARKDOWN`
insertAfter(th7, menu.lastElementChild);

var d = '';var utc = '';var nd = '';
function calcTime(city, offset) {
d = new Date();
utc = d.getTime() + (d.getTimezoneOffset() * 60000);
nd = new Date(utc + (3600000*offset));
return nd.toLocaleString();}
var OWtime = Date.parse((calcTime('Outwar', '-5.0')));

var active_total = 0;
var active_permin = 0;
var totaldmg = 0;

for (let rownum = 1; rownum < bossTableRows; rownum++) {

var crewID = document.querySelector("#content-header-row > div > table > tbody > tr:nth-child("+rownum+") > td:nth-child(1)").innerHTML.replaceAll(/"><font.*/g,"").replaceAll(/<a href="crew_profile\.php\?id=/g,"");
fetch("crew_raidresults.php?all_results=Display+all+raid+results&crewid="+crewID)
   .then(response => response.text())
   .then((response) => {
var crewName = document.querySelector("#content-header-row > div > table > tbody > tr:nth-child("+rownum+") > td:nth-child(1) > a > font").innerHTML.replace("'","");
var crewID = document.querySelector("#content-header-row > div > table > tbody > tr:nth-child("+rownum+") > td:nth-child(1)").innerHTML.replaceAll(/<a href="crew_profile\.php\?id=/g,"").replaceAll(/"><font color="#CC0000".*/g,"");
var match_time = 'valign="top">(.*)<\/td.*[\n\r].*'+bossName
var match_url = 'valign="top">.*<\/td.*[\n\r].*'+bossName+'.*[\n\r].*[\n\r].*'
var lastRaid = response.match(match_time)
var url_match = response.match(match_url)
var raidlink = url_match.toString().match(/raidattack\.php\?raidid=[0-9]+/i)

fetch(raidlink)
   .then(response => response.text())
   .then((response) => {
    var lastraid_dmg = parseInt(response.match(/<i>Total Attacker Damage: (.*)<\/i>/i)[1].replaceAll(",",""))
    const doc = new DOMParser().parseFromString(response, 'text/html');
    var raidchar = doc.querySelector("#message_0 > div > div > span > b").innerHTML.replace(/ .*/i,"")

fetch("profile.php?transnick="+raidchar)
   .then(response => response.text())
   .then((response) => {
    const doc = new DOMParser().parseFromString(response, 'text/html');
    var skills = doc.querySelector("#divSkillsCast").innerHTML
    var markdown = '';
    if (skills.match(/src="\/images\/skills\/markdown\.png" .*join raids\.<br \/>(.*[0-9]+ mins) left<br>/i) == null){markdown = "not found"}
    if (skills.match(/src="\/images\/skills\/markdown\.png" .*join raids\.<br \/>(.*[0-9]+ mins) left<br>/i) != null){markdown = skills.match(/src="\/images\/skills\/markdown\.png" .*join raids\.<br \/>(.*[0-9]+ mins) left<br>/i)[1]}

var lastRaidprint = ''
if (lastRaid != null){lastRaidprint = Date.parse(lastRaid[1].replaceAll("-","/").replace(/\/22 /g,"/2022, ").replace("am",":00 AM").replace("pm",":00 PM").replace(/ 0/i," "))}
var sinceLast = OWtime-lastRaidprint
if (sinceLast < 150000){active_total += 1}
var status = '';
if (sinceLast < 150000){status = `active`;}
if (sinceLast > 149999){status = `inactive`}
var activeRaids = '';
if (status == "active"){activeRaids = `<a href=crew_raidresults.php?most_recent=raid+results&crewid=`+crewID+` onmouseover="popup\(event,'<b>`+crewName+`</b><br>Last raid vs `+bossName+`:<br>`+Math.round(sinceLast/60000)+` minutes ago<br>(click to see raid results)'\)" onmouseout="kill\(\)"><font color=#00FF00>active</a>`;}
if (status == "inactive"){activeRaids = `<a onmouseover="popup\(event,'<b>`+crewName+`</b><br>Last raid vs `+bossName+`:<br>`+Math.round(sinceLast/60000)+` minutes ago'\)" onmouseout="kill\(\)">inactive`}

var dmg = Math.round(parseInt(document.querySelector("#content-header-row > div > table > tbody > tr:nth-child("+rownum+") > td:nth-child(2)").innerHTML.replaceAll(/ \([^)]*\)/g,"").replaceAll(",","")))
var percent = parseInt(document.querySelector("#content-header-row > div > table > tbody > tr:nth-child("+rownum+") > td:nth-child(2)").innerHTML.match(/\(([0-9]+\.[0-9]+)%\)/i)[1].replace(".",""))/100

if (status == "active"){active_permin += lastraid_dmg}
totaldmg += dmg

let menu = document.querySelector("#content-header-row > div > table > tbody > tr:nth-child("+rownum+")");

let td1 = document.createElement('td');
td1.innerHTML = dmg.toLocaleString("en-US");
insertAfter(td1, menu.lastElementChild);
let td2 = document.createElement('td');
td2.innerHTML = percent+"%";
insertAfter(td2, menu.lastElementChild);
let td8 = document.createElement('td');
td8.innerHTML = Math.round(dmg/bossHP*lootCount);
insertAfter(td8, menu.lastElementChild);
let td3 = document.createElement('td');
td3.innerHTML = (((percent/100)*bossHP)).toLocaleString("en-US");
insertAfter(td3, menu.lastElementChild);
let td4 = document.createElement('td');
td4.innerHTML = Math.round(lootCount*(percent/100));
insertAfter(td4, menu.lastElementChild);
let td5 = document.createElement('td');
td5.innerHTML = activeRaids;
if (status == "active"){td5.setAttribute("style","color:#00FF00 !important")}
insertAfter(td5, menu.lastElementChild);
let td6 = document.createElement('td');
td6.innerHTML = lastraid_dmg.toLocaleString("en-US");
if (status == "active"){td6.setAttribute("style","color:#00FF00 !important")}
insertAfter(td6, menu.lastElementChild);
let td7 = document.createElement('td');
td7.innerHTML = markdown;
if (status == "active"){td7.setAttribute("style","color:#00FF00 !important")}
if (status != "active"){td7.innerHTML = "--";}
insertAfter(td7, menu.lastElementChild);

document.querySelector("#content-header-row > h5").innerHTML = `<div class="widget widget-chart-one mb-3"><div class="headcontainer"><h2>`+bossName+` <a onmouseover="popup(event,'`+loottable+`')" onmouseout="kill\(\)"><img src=https://studiomoxxi.com/moxximod/loot.png height="20px" style="margin-bottom:10px"></a></h2><h4>Health Remaining: `+(bossHP-totaldmg).toLocaleString("en-US")+" ("+((bossHP-(totaldmg))/bossHP*100).toFixed(3)+`%)</h4><p><h7>Current dmg per min: `+active_permin.toLocaleString("en-US")+` (`+Math.round(((bossHP-totaldmg)/(active_permin))).toLocaleString("en-US")+` min remaining)</div></div>
<p style="margin-top:20px" id="atk_icon"></p>`
document.querySelector("#content-header-row > div").setAttribute("class","table-responsive mx-2 widget widget-chart-one mb-3")
let text = `<img src="https://studiomoxxi.com/moxximod/atk_icon.webp" height="30px" width="30px" onmouseover="popup(event,'`+active_total+` CREWS RAIDING')" onmouseout="kill\(\)">`;
let result = text.repeat(active_total);
document.getElementById("atk_icon").innerHTML = result;

})})})}}}

if (document.URL.indexOf("augmentequip") != -1 && error == false) {

var aug_change = document.querySelector("#item-container")

let observer = new MutationObserver(mutationRecords => {
  addaug();
});
observer.observe(aug_change, {
  childList: true,
  subtree: true,
  characterDataOldValue: true
});

function addaug(){
var open_aug = document.querySelector("#item-container").innerHTML.match(/src="\/images\/augslot\.jpg"><h5>Slot ([0-9]+)<\/h5>/i)[1]
document.querySelector("#form-slotid").value = open_aug
}}

if (document.URL.indexOf("raidattack") != -1 && error == false) {

GM_addStyle (`
[id^="message"] {visibility: visible !important;}
#outcome{position:fixed !important;right:15px !important;top: 50px !important;width:250px !important;}
#content > div.layout-px-spacing{background:transparent !important;box-shadow: 0px 0px 0px #000000,-0px -0px 0px #000000 !important;}
`);

var lastbox = document.querySelector("#content-header-row > div:last-of-type > div.col-12.col-lg-6.text-left.pl-5.mt-5.mt-md-0 > div").innerHTML.replace(/Attacks!.*[\n\r].*/i,"").replace(`style="position:absolute;right: 0px;bottom: -7px;"`,`style="position:absolute;right: 3px;bottom: 3px; font-size:12px"`)

$("body").append (`<div id="outcome" class="widget widget-chart-one mb-3 tiles"><center>`+lastbox+`</div>`);

}

if (document.URL.indexOf("profile") != -1 && error == false) {
if (document.URL.indexOf("crew_profile") == -1) {

var pheader = document.querySelector("#divProfile > div.widget.mb-2 > div > div > div.col-md-7").innerHTML
var pskills = document.querySelector("#divProfile > div.widget.mb-2 > div > div > div.col-md-12").innerHTML.replace(`<img src="http://torax.outwar.com/images/profile/ProfileSkills.png">`,"").replace(`<img src="http://sigil.outwar.com/images/profile/ProfileSkills.png">`,"")
var pinfo = document.querySelector("#divProfile > div:nth-child(2) > div > div > div.col-xl-4.col-md-5 > div > div:nth-child(1) > div").innerHTML.replace(`<h5 class="card-title">PLAYER INFO</h5>`,"").replace(`<table class="table table-striped" cellpadding="0" cellspacing="0" width="100%">`,`<table class="charinfo" cellpadding="0" cellspacing="0" width="100%">`)
var ppiclink = document.querySelector("#divProfile > div:nth-child(2) > div > div > div.col-xl-8.col-md-7 > div > div:nth-child(1) > div > img").outerHTML.replace(`<img class="profilepic" src="`,"").replace(`">`,"")

var pdesc = document.getElementsByClassName('card')[6].innerHTML
var peq = document.querySelector("#divProfile > div:nth-child(2) > div > div > div.col-xl-4.col-md-5 > div > div:nth-child(2) > div").innerHTML.replace(`<h5 class="card-title">EQUIPMENT</h5>`,"")
var pallies = document.getElementsByClassName('card')[7].innerHTML
var penemies = document.getElementsByClassName('card')[8].innerHTML
var pcrests = document.querySelector("#divProfile > div:nth-child(2) > div > div > div.col-xl-4.col-md-5 > div > div:nth-child(3) > div").innerHTML.replace(`<h5 class="card-title">SKILL CRESTS</h5>`,"")
var pmastery = document.querySelector("#divProfile > div:nth-child(2) > div > div > div.col-xl-4.col-md-5 > div > div:nth-child(4) > div").innerHTML.replace(`<h5 class="card-title">MASTERIES</h5>`,"")
var pcomment = document.querySelector("#comTable").innerHTML.replaceAll("/characters/","/profile.php?id=")
var plings = document.getElementsByClassName('card')[11].innerHTML.replace(`<table id="UnderlingTable" class="table table-striped-dark mt-1">`,`<table id="UnderlingTable" class="lings">`)

GM_addStyle (`.propic{background: #0E1726 url("`+ppiclink+`"); background-repeat: no-repeat;border-radius:8px !important;background-size: cover;background-position: center !important;}`);

var upload_pic = '';
    if (document.querySelector("#divProfile > div:nth-child(2) > div > div > div.col-xl-8.col-md-7 > div > div:nth-child(1) > div > a") != null){
        upload_pic = document.querySelector("#divProfile > div:nth-child(2) > div > div > div.col-xl-8.col-md-7 > div > div:nth-child(1) > div > a").outerHTML;}

if (document.querySelector("#divActions > a:nth-child(1)") != null){
var patk = document.querySelector("#divActions > a:nth-child(1)").outerHTML.replace(`<img src="http://torax.outwar.com/images/profile/ProfileAttack.png" alt="ATTACK" border="0">`,"").replace(`<img src="http://sigil.outwar.com/images/profile/ProfileAttack.png" alt="ATTACK" border="0">`,"").replace(`</a>`,"")
var pdata = patk.match(/<a href="javascript:void\(0\);" onclick="showAttackWindow\('([^']*)','([0-9]+)','[0-9]+','[^']*'\)">/i)
var pname = pdata[1]
var pid = pdata[2]
}

if (document.querySelector("#divActions").innerHTML.match("showAttackWindow") == null){GM_addStyle (`#pbuttons{display:none !important;}`);}

var isplayerpp = "no"

if (pheader.match(/<img src="[^"]*" onmouseover="popup\(event,'Preferred Player','808080'\)" onmouseout="kill\(\)">/i) != null){
pheader = pheader.replace(/<img src="[^"]*" onmouseover="popup\(event,'Preferred Player','808080'\)" onmouseout="kill\(\)">/i,"")
isplayerpp = "yes"}

document.querySelector("#content").innerHTML = `
<div class="row justify-content-center">
<div style="margin:1rem">
<div class="widget widget-chart-one mb-3">
`+pheader+`
<div>`+pinfo+`</div>
</div>
<div class="widget widget-chart-one mb-3">
`+peq+pcrests+`
</div>
<div class="widget widget-chart-one mb-3">
`+pmastery+`
</div>
<div class="widget widget-chart-one mb-3">
`+pcomment+`
</div>
</div>
<div style="margin:1rem">
<div class="widget widget-chart-one mb-3" id="showhide">
<div id="pbuttons">
<button id="button" class="btn btn-primary">`+patk+`ATK</a></button>
<button id="button" class="btn btn-primary"><a href=send_ow_message?name=`+pname+`>MSG</a></button>
<button id="button" class="btn btn-primary"><a href=profile?id=`+pid+`&ally=1>ALLY</a></button>
<button id="button" class="btn btn-primary"><a href=blocklist?id=`+pid+`>BLOCK</a></button>
<button id="button" class="btn btn-primary"><a href=trade?tradeWith=`+pid+`>TRADE</a></button>
<button id="button" class="btn btn-primary"><a href=crew_invites?inv=`+pname+`>INVITE</a></button>
<button id="button" class="btn btn-primary"><a href=profile?id=`+pid+`&enemy=1>ENEMY</a></button>
<button id="button" class="btn btn-primary"><a href=treasury?search_for=`+pname+`>TREAS</a></button>
</div>
`+pskills+`
</div>
<div class="widget-chart-one mb-3 propic" style="height:400px !important;width:900px !important;text-align: right !important;">`+upload_pic+`
</div>
<div class="widget widget-chart-one mb-3">
`+pdesc+`
</div>
<div class="widget widget-chart-one mb-3">
`+pallies+`
</div>
<div class="widget widget-chart-one mb-3">
`+penemies+`
</div>
<div class="widget widget-chart-one mb-3">
`+plings+`
</div>
</div>
</div>
`

if (isplayerpp == "yes"){
GM_addStyle (`
#content > div > div > div{-webkit-box-shadow:0px 0px 3px 3px rgba(209,156,32,0.5);
-moz-box-shadow: 0px 0px 3px 3px rgba(209,156,32,0.5);
box-shadow: 0px 0px 3px 3px rgba(209,156,32,0.5);}
.bg-secondary, .bg-success, .bg-primary, .bg-danger, .bg-warning{background-color: #E79A31 !important;border-color: #E79A31 !important;color: #fff !important;}
#divHeaderName{color:#E79A31 !important;}
`);}

if (isplayerpp == "no"){
GM_addStyle (`
.bg-secondary, .bg-success, .bg-primary, .bg-danger, .bg-warning{background-color: #E7515A !important;border-color: #E7515A ;color: #fff;}
`);}

}}

if (document.URL.indexOf("treasury.php?type=vision") == -1 && error == false) {

document.querySelector("#fastslide").addEventListener("click", fastslide_open, false);

function fastslide_open(){

GM_addStyle (`
.ftslider {height: 400px !important;width:230px !important;border:0px !important;left:187px !important;top:75px !important;}
.sidebar-wrapper{width:180px !important;}
#destination{background:#0E1726;border-radius:5px !important;margin-bottom:3px !important;}
#destination:hover{background:#3b3f5c;}
#mydestination{background:#230e26;border-radius:5px !important;margin-bottom:3px !important;}
#mydestination:hover{background:#5c3b5c;}
img.destination-img{border:0px !important;}
`);

document.querySelector("#locker_button").addEventListener("click", locker_button, false);
document.querySelector("#veldara_button").addEventListener("click", veldara_button, false);
document.querySelector("#kix_button").addEventListener("click", kix_button, false);
document.querySelector("#astral_button").addEventListener("click", astral_button, false);
document.querySelector("#plane_button").addEventListener("click", plane_button, false);
document.querySelector("#underground_button").addEventListener("click", underground_button, false);
document.querySelector("#fastslide").addEventListener("click", fastslide_close, false);
document.querySelector("#fastslide").removeEventListener("click", fastslide_open, false);
}

GM_addStyle (`
.ftslider {
overflow: auto;
height: 0px !important;
color:#FFFFFF !important;
padding:10px !important;
width: 0px !important;
border:0px !important;
top:450px !important;
left:20px !important;
position:fixed !important;
transition-property: all;
transition-duration: 1s;
font-size:10px !important;
background: #1B2E4B;
z-index:0 !important;
box-shadow: 0 6px 10px 0 rgba(0,0,0,1),0 1px 18px 0 rgba(0,0,0,1),0 3px 5px -1px rgba(0,0,0,1);
}`);

$("body").append ( `
<div class="ftslider" id="slider2">
<div id="mydestination"></div>
<div id="destination"><a href="world.php?room=26137" class="travel"><img class="destination-img" src="images/items/saveitem2.jpg">ASTRAL RIFT</a></div>
<div id="destination"><a href="javascript:void(0);" class="travel" id="astral_button"><img class="destination-img" src="images/items/astralteleporter.png">ASTRAL RUINS</a></div>
<div id="destination"><a href="world.php?room=25989" class="travel"><img class="destination-img" src="images/rooms/tile_chaltoken.jpg">CHALLENGE ARENA</a></div>
<div id="destination"><a href="javascript:void(0);" class="travel" id="golem_button"><img class="destination-img" src="images/mobs/chaosgolem4.jpg">CHAOS GOLEMS<img src="https://studiomoxxi.com/moxximod/bot.png" class="robot_small" onmouseover="popup(event,'<b><font color=#f441be>MoxxiMod+</font></b><br>Premium location')" onmouseout="kill()"></a></div>
<div id="destination"><a href="javascript:void(0);" class="travel" id="sanctum_button"><img class="destination-img" src="images/rooms/tile_badge.jpg">CITY SANCTUM: WADE<img src="https://studiomoxxi.com/moxximod/bot.png" class="robot_small" onmouseover="popup(event,'<b><font color=#f441be>MoxxiMod+</font></b><br>Premium location')" onmouseout="kill()"></a></div>
<div id="destination"><a href="javascript:void(0);" class="travel" id="hall_button"><img class="destination-img" src="images/rooms/tile_collections.jpg">COLLECTIONS HALL<img src="https://studiomoxxi.com/moxximod/bot.png" class="robot_small" onmouseover="popup(event,'<b><font color=#f441be>MoxxiMod+</font></b><br>Premium location')" onmouseout="kill()"></a></div>
<div id="destination"><a href="world.php?room=24284" class="travel"><img class="destination-img" src="images/rooms/storeroom38.jpg">DEATHBAT GRAVEYARD</a></div>
<div id="destination"><a href="javascript:void(0);" class="travel" id="overlord_button"><img class="destination-img" src="images/mobs/runenpc4.jpg">ELEMENTAL OVERLORD<img src="https://studiomoxxi.com/moxximod/bot.png" class="robot_small" onmouseover="popup(event,'<b><font color=#f441be>MoxxiMod+</font></b><br>Premium location')" onmouseout="kill()"></a></div>
<div id="destination"><a href="world.php?room=4249" class="travel"><img class="destination-img" src="images/eob/Eob13.jpg">EYES OF BURN SANDS</a></div>
<div id="destination"><a href="javascript:void(0);" class="travel" id="arena_button"><img class="destination-img" src="images/rooms/tile_glad1.png">GLADIATOR ARENA<img src="https://studiomoxxi.com/moxximod/bot.png" class="robot_small" onmouseover="popup(event,'<b><font color=#f441be>MoxxiMod+</font></b><br>Premium location')" onmouseout="kill()"></a></div>
<div id="destination"><a href="javascript:void(0);" class="travel" id="infinite_button"><img class="destination-img" src="images/rooms/tile_infinity.png">INFINITE TOWER<img src="https://studiomoxxi.com/moxximod/bot.png" class="robot_small" onmouseover="popup(event,'<b><font color=#f441be>MoxxiMod+</font></b><br>Premium location')" onmouseout="kill()"></a></div>
<div id="destination"><a href="world.php?room=11" class="travel"><img class="destination-img" src="images/4way.jpg">INTERSECTION ROOM 11</a></div>
<div id="destination"><a href="javascript:void(0);" class="travel" id="kix_button"><img class="destination-img" src="images/items/meter.jpg">KIX WOODS</a></div>
<div id="destination"><a href="world.php?room=23311" class="travel"><img class="destination-img" src="images/rooms/naturecave1.jpg">MOUNTAIN CAVE</a></div>
<div id="destination"><a href="world.php?room=111" class="travel"><img class="destination-img" src="images/rallisdocks.jpg">PIER 2 RALLIS</a></div>
<div id="destination"><a href="javascript:void(0);" class="travel" id="plane_button"><img class="destination-img" src="images/items/PlanesTele.jpg">PLANE OF DARKNESS</a></div>
<div id="destination"><a href="javascript:void(0);" class="travel" id="prison_button"><img class="destination-img" src="images/rooms/DenTile1.jpg">PRISON: CRESTS<img src="https://studiomoxxi.com/moxximod/bot.png" class="robot_small" onmouseover="popup(event,'<b><font color=#f441be>MoxxiMod+</font></b><br>Premium location')" onmouseout="kill()"></a></div>
<div id="destination"><a href="world.php?room=23471" class="travel"><img class="destination-img" src="images/rooms/pristinedepths.jpg">PRISTINE DEPTHS</a></div>
<div id="destination"><a href="world.php?room=6640" class="travel"><img class="destination-img" src="images/enviro_city.jpg">SCIENTIFIC DISTRICT</a></div>
<div id="destination"><a href="javascript:void(0);" class="travel" id="underground_button"><img class="destination-img" src="images/items/Portable-Teleporter.jpg">UNDERGROUND CAVERN</a></div>
<div id="destination"><a href="world.php?room=17321" class="travel"><img class="destination-img" src="images/rooms/undergroundqsec.jpg">Q-SEC BASE</a></div>
<div id="destination"><a href="world.php?room=10697" class="travel"><img class="destination-img" src="images/rooms/valleydeath.jpg">VALLEY OF DEATH</a></div>
<div id="destination"><a href="world.php?room=42550" class="travel"><img class="destination-img" src="images/rooms/tile_vault.png">VAULT OF MADNESS</a></div>
<div id="destination"><a href="javascript:void(0);" class="travel" id="locker_button"><img class="destination-img" src="images/items/veiledtp.png">VEILED PASSAGE</a></div>
<div id="destination"><a href="javascript:void(0);" class="travel" id="veldara_button"><img class="destination-img" src="images/items/veldarateleporter.jpg">VELDARA GARRISON</a></div>
<div id="destination"><a href="wilderness" class="travel"><img class="destination-img" src="images/event_military5.jpg">WILDERNESS</a></div>
<span id="no_custom_set"></span>
</div>`);

var custom_num = GM_getValue("mydestination")
var custom_name = GM_getValue("mydestinationname")
if (custom_num != undefined && custom_name != undefined){
document.querySelector("#mydestination").innerHTML = `<a href="javascript:void(0);" class="travel" id="custom_button"><img class="destination-img" src="https://studiomoxxi.com/moxximod/logo_plus.png">`+custom_name+`<img src="https://studiomoxxi.com/moxximod/bot.png" class="robot_small" onmouseover="popup(event,'<b><font color=#f441be>MoxxiMod+</font></b><br>Premium location')" onmouseout="kill()"></a>`
document.getElementById("custom_button").addEventListener("click", custom_button, false);}
function custom_button (zEvent) {
gotormnum = custom_num;
task08();
fastslide_close();
GM_addStyle (`#sliderload{display:revert !important;position:fixed !important;left:50% !important;top:50% !important;margin-top:-110px !important;margin-left: -110px !important;background:#FF0000 !important;z-index:10000 !important;}`)
$("body").append (`<div id="sliderload"><img src=https://media.tenor.com/UnFx-k_lSckAAAAM/amalie-steiness.gif></div></div>`);
roomcheck();
function roomcheck(){
var room = '';
fetch("ajax_changeroomb")
.then (response => response.text())
.then((response) => {
room = response.match(/"curRoom":"([0-9]+)"/i)[1]
if (room != gotormnum) {setTimeout(function() {roomcheck()},250)}
if (room == gotormnum) {window.location.href = "world";}})}}

if (custom_num == undefined || custom_name == undefined){document.querySelector("#no_custom_set").innerHTML = `<center>MoxxiMod+ subscribers can set a custom fast travel destination in <a href="user_preferences">preferences</a>`}

document.getElementById("hall_button").addEventListener("click", hall_button, false);
function hall_button (zEvent) {
gotormnum = 26555;
task08();
fastslide_close();
GM_addStyle (`#sliderload{display:revert !important;position:fixed !important;left:50% !important;top:50% !important;margin-top:-110px !important;margin-left: -110px !important;background:#FF0000 !important;z-index:10000 !important;}`)
$("body").append (`<div id="sliderload"><img src=https://media.tenor.com/UnFx-k_lSckAAAAM/amalie-steiness.gif></div></div>`);
roomcheck();
function roomcheck(){
var room = '';
fetch("ajax_changeroomb")
.then (response => response.text())
.then((response) => {
room = response.match(/"curRoom":"([0-9]+)"/i)[1]
if (room != gotormnum) {setTimeout(function() {roomcheck()},250)}
if (room == gotormnum) {window.location.href = "world";}})}}

document.getElementById("golem_button").addEventListener("click", golem_button, false);
function golem_button (zEvent) {
gotormnum = 32877;
task08();
fastslide_close();
GM_addStyle (`#sliderload{display:revert !important;position:fixed !important;left:50% !important;top:50% !important;margin-top:-110px !important;margin-left: -110px !important;background:#FF0000 !important;z-index:10000 !important;}`)
$("body").append (`<div id="sliderload"><img src=https://media.tenor.com/UnFx-k_lSckAAAAM/amalie-steiness.gif></div></div>`);
roomcheck();
function roomcheck(){
var room = '';
fetch("ajax_changeroomb")
.then (response => response.text())
.then((response) => {
room = response.match(/"curRoom":"([0-9]+)"/i)[1]
if (room != gotormnum) {setTimeout(function() {roomcheck()},250)}
if (room == gotormnum) {window.location.href = "world";}})}}

document.getElementById("infinite_button").addEventListener("click", infinite_button, false);
function infinite_button (zEvent) {
gotormnum = 28040;
task08();
fastslide_close();
GM_addStyle (`#sliderload{display:revert !important;position:fixed !important;left:50% !important;top:50% !important;margin-top:-110px !important;margin-left: -110px !important;background:#FF0000 !important;z-index:10000 !important;}`)
$("body").append (`<div id="sliderload"><img src=https://media.tenor.com/UnFx-k_lSckAAAAM/amalie-steiness.gif></div></div>`);
roomcheck();
function roomcheck(){
var room = '';
fetch("ajax_changeroomb")
.then (response => response.text())
.then((response) => {
room = response.match(/"curRoom":"([0-9]+)"/i)[1]
if (room != gotormnum) {setTimeout(function() {roomcheck()},250)}
if (room == gotormnum) {window.location.href = "world";}})}}

document.getElementById("sanctum_button").addEventListener("click", sanctum_button, false);
function sanctum_button (zEvent) {
gotormnum = 27496;
task08();
fastslide_close();
GM_addStyle (`#sliderload{display:revert !important;position:fixed !important;left:50% !important;top:50% !important;margin-top:-110px !important;margin-left: -110px !important;background:#FF0000 !important;z-index:10000 !important;}`)
$("body").append (`<div id="sliderload"><img src=https://media.tenor.com/UnFx-k_lSckAAAAM/amalie-steiness.gif></div></div>`);
roomcheck();
function roomcheck(){
var room = '';
fetch("ajax_changeroomb")
.then (response => response.text())
.then((response) => {
room = response.match(/"curRoom":"([0-9]+)"/i)[1]
if (room != gotormnum) {setTimeout(function() {roomcheck()},250)}
if (room == gotormnum) {window.location.href = "world";}})}}

document.getElementById("prison_button").addEventListener("click", prison_button, false);
function prison_button (zEvent) {
gotormnum = 23332;
task08();
fastslide_close();
GM_addStyle (`#sliderload{display:revert !important;position:fixed !important;left:50% !important;top:50% !important;margin-top:-110px !important;margin-left: -110px !important;background:#FF0000 !important;z-index:10000 !important;}`)
$("body").append (`<div id="sliderload"><img src=https://media.tenor.com/UnFx-k_lSckAAAAM/amalie-steiness.gif></div></div>`);
roomcheck();
function roomcheck(){
var room = '';
fetch("ajax_changeroomb")
.then (response => response.text())
.then((response) => {
room = response.match(/"curRoom":"([0-9]+)"/i)[1]
if (room != gotormnum) {setTimeout(function() {roomcheck()},250)}
if (room == gotormnum) {window.location.href = "world";}})}}

document.getElementById("overlord_button").addEventListener("click", overlord_button, false);
function overlord_button (zEvent) {
gotormnum = 26201;
task08();
fastslide_close();
GM_addStyle (`#sliderload{display:revert !important;position:fixed !important;left:50% !important;top:50% !important;margin-top:-110px !important;margin-left: -110px !important;background:#FF0000 !important;z-index:10000 !important;}`)
$("body").append (`<div id="sliderload"><img src=https://media.tenor.com/UnFx-k_lSckAAAAM/amalie-steiness.gif></div></div>`);
roomcheck();
function roomcheck(){
var room = '';
fetch("ajax_changeroomb")
.then (response => response.text())
.then((response) => {
room = response.match(/"curRoom":"([0-9]+)"/i)[1]
if (room != gotormnum) {setTimeout(function() {roomcheck()},250)}
if (room == gotormnum) {window.location.href = "world";}})}}

document.getElementById("arena_button").addEventListener("click", arena_button, false);
function arena_button (zEvent) {
gotormnum = 28031;
task08();
fastslide_close();
GM_addStyle (`#sliderload{display:revert !important;position:fixed !important;left:50% !important;top:50% !important;margin-top:-110px !important;margin-left: -110px !important;background:#FF0000 !important;z-index:10000 !important;}`)
$("body").append (`<div id="sliderload"><img src=https://media.tenor.com/UnFx-k_lSckAAAAM/amalie-steiness.gif></div></div>`);
roomcheck();
function roomcheck(){
var room = '';
fetch("ajax_changeroomb")
.then (response => response.text())
.then((response) => {
room = response.match(/"curRoom":"([0-9]+)"/i)[1]
if (room != gotormnum) {setTimeout(function() {roomcheck()},250)}
if (room == gotormnum) {window.location.href = "world";}})}}

function fastslide_close(){
GM_addStyle (`.ftslider {height: 0px !important;width:0px !important;border:0px !important;left:20px !important;top:450px !important;}`);
document.querySelector("#fastslide").addEventListener("click", fastslide_open, false);
document.querySelector("#fastslide").removeEventListener("click", fastslide_close, false);
}}

document.querySelector("#slider").addEventListener("click", slider_open, false);

var cast_selected = '';

function slider_open(){

GM_addStyle (`#sliderload{display:revert !important;position:fixed !important;left:50% !important;top:50% !important;margin-top:-110px !important;margin-left: -110px !important;background:#FF0000 !important;z-index:10000 !important;}`)

$("body").append (`<div id="sliderload"><img src=https://media.tenor.com/UnFx-k_lSckAAAAM/amalie-steiness.gif></div></div>`);

var fetch_count = 0;

fetch("ajax/backpackcontents.php?tab=potion")
   .then(response => response.text())
   .then((response) => {
    const doc = new DOMParser().parseFromString(response, 'text/html');
    var allpots = doc.querySelector("body").innerHTML.match(/<img data-itemidqty="[0-9]+".*>/g)
    var pots_count = 0; if (allpots != null){pots_count = allpots.length}
    fetch_count += 1;
    var pots_icons = '';
    for (let potnum = 0; potnum < pots_count; potnum++) {pots_icons += allpots[potnum].replaceAll(/onclick="kill\(\);makemenu\([^)]*\);">/g,">").replaceAll(/class="itemimage backpackslot" /g,"").replaceAll(/id="item[0-9]+"/g,"").replaceAll(/data-iid=/g,"id=")}

var skills_icons = '';
var skills_count = 0;

fetch("skills_info.php?id=3")
   .then(response => response.text())
   .then((response) => {
    const doc = new DOMParser().parseFromString(response, 'text/html');
    const name = doc.querySelector("body > div.text-left > h5").innerHTML
    const details = response.match(/<\/h5>[\n\r](.*) <\/div>/i)[1].replaceAll("'","")
    if (doc.querySelector("body").innerHTML.match(/<input type="submit" name="cast" class="btn btn-primary" value="Cast Skill">/i) != null){skills_count += 1;skills_icons += `<img src="images/skills/empower.png" id="3" onmouseover="statspopup(event,'<h5>`+name+`</h5><p>`+details+`')" onmouseout="kill()">`}
    fetch_count += 1;

fetch("skills_info.php?id=4")
   .then(response => response.text())
   .then((response) => {
    const doc = new DOMParser().parseFromString(response, 'text/html');
    const name = doc.querySelector("body > div.text-left > h5").innerHTML
    const details = response.match(/<\/h5>[\n\r](.*) <\/div>/i)[1].replaceAll("'","")
    if (doc.querySelector("body").innerHTML.match(/<input type="submit" name="cast" class="btn btn-primary" value="Cast Skill">/i) != null){skills_count += 1;skills_icons += `<img src="images/skills/stealth.png" id="4" onmouseover="statspopup(event,'<h5>`+name+`</h5><p>`+details+`')" onmouseout="kill()">`}
    fetch_count += 1;

fetch("skills_info.php?id=7")
   .then(response => response.text())
   .then((response) => {
    const doc = new DOMParser().parseFromString(response, 'text/html');
    const name = doc.querySelector("body > div.text-left > h5").innerHTML
    const details = response.match(/<\/h5>[\n\r](.*) <\/div>/i)[1].replaceAll("'","")
    if (doc.querySelector("body").innerHTML.match(/<input type="submit" name="cast" class="btn btn-primary" value="Cast Skill">/i) != null){skills_count += 1;skills_icons += `<img src="images/skills/onguard.png" id="7" onmouseover="statspopup(event,'<h5>`+name+`</h5><p>`+details+`')" onmouseout="kill()">`}
    fetch_count += 1;

fetch("skills_info.php?id=22")
   .then(response => response.text())
   .then((response) => {
    const doc = new DOMParser().parseFromString(response, 'text/html');
    const name = doc.querySelector("body > div.text-left > h5").innerHTML
    const details = response.match(/<\/h5>[\n\r](.*) <\/div>/i)[1].replaceAll("'","")
    if (doc.querySelector("body").innerHTML.match(/<input type="submit" name="cast" class="btn btn-primary" value="Cast Skill">/i) != null){skills_count += 1;skills_icons += `<img src="images/skills/vitaminx.png" id="22" onmouseover="statspopup(event,'<h5>`+name+`</h5><p>`+details+`')" onmouseout="kill()">`}
    fetch_count += 1;

fetch("skills_info.php?id=28")
   .then(response => response.text())
   .then((response) => {
    const doc = new DOMParser().parseFromString(response, 'text/html');
    const name = doc.querySelector("body > div.text-left > h5").innerHTML
    const details = response.match(/<\/h5>[\n\r](.*) <\/div>/i)[1].replaceAll("'","")
    if (doc.querySelector("body").innerHTML.match(/<input type="submit" name="cast" class="btn btn-primary" value="Cast Skill">/i) != null){skills_count += 1;skills_icons += `<img src="images/skills/fortify.png" id="28" onmouseover="statspopup(event,'<h5>`+name+`</h5><p>`+details+`')" onmouseout="kill()">`}
    fetch_count += 1;

fetch("skills_info.php?id=25")
   .then(response => response.text())
   .then((response) => {
    const doc = new DOMParser().parseFromString(response, 'text/html');
    const name = doc.querySelector("body > div.text-left > h5").innerHTML
    const details = response.match(/<\/h5>[\n\r](.*) <\/div>/i)[1].replaceAll("'","")
    if (doc.querySelector("body").innerHTML.match(/<input type="submit" name="cast" class="btn btn-primary" value="Cast Skill">/i) != null){skills_count += 1;skills_icons += `<img src="images/skills/streetsmarts.png" id="25" onmouseover="statspopup(event,'<h5>`+name+`</h5><p>`+details+`')" onmouseout="kill()">`}
    fetch_count += 1;

fetch("skills_info.php?id=3182")
   .then(response => response.text())
   .then((response) => {
    const doc = new DOMParser().parseFromString(response, 'text/html');
    const name = doc.querySelector("body > div.text-left > h5").innerHTML
    const details = response.match(/<\/h5>[\n\r](.*) <\/div>/i)[1].replaceAll("'","")
    if (doc.querySelector("body").innerHTML.match(/<input type="submit" name="cast" class="btn btn-primary" value="Cast Skill">/i) != null){skills_count += 1;skills_icons += `<img src="images/skills/masteraffskill.png" id="3182" onmouseover="statspopup(event,'<h5>`+name+`</h5><p>`+details+`')" onmouseout="kill()">`}
    fetch_count += 1;

fetch("skills_info.php?id=3183")
   .then(response => response.text())
   .then((response) => {
    const doc = new DOMParser().parseFromString(response, 'text/html');
    const name = doc.querySelector("body > div.text-left > h5").innerHTML
    const details = response.match(/<\/h5>[\n\r](.*) <\/div>/i)[1].replaceAll("'","")
    if (doc.querySelector("body").innerHTML.match(/<input type="submit" name="cast" class="btn btn-primary" value="Cast Skill">/i) != null){skills_count += 1;skills_icons += `<img src="images/skills/masterpresskill.png" id="3183" onmouseover="statspopup(event,'<h5>`+name+`</h5><p>`+details+`')" onmouseout="kill()">`}
    fetch_count += 1;

fetch("skills_info.php?id=3184")
   .then(response => response.text())
   .then((response) => {
    const doc = new DOMParser().parseFromString(response, 'text/html');
    const name = doc.querySelector("body > div.text-left > h5").innerHTML
    const details = response.match(/<\/h5>[\n\r](.*) <\/div>/i)[1].replaceAll("'","")
    if (doc.querySelector("body").innerHTML.match(/<input type="submit" name="cast" class="btn btn-primary" value="Cast Skill">/i) != null){skills_count += 1;skills_icons += `<img src="images/skills/masterferoskill.png" id="3184" onmouseover="statspopup(event,'<h5>`+name+`</h5><p>`+details+`')" onmouseout="kill()">`}
    fetch_count += 1;

fetch("skills_info.php?id=9")
   .then(response => response.text())
   .then((response) => {
    const doc = new DOMParser().parseFromString(response, 'text/html');
    const name = doc.querySelector("body > div.text-left > h5").innerHTML
    const details = response.match(/<\/h5>[\n\r](.*) <\/div>/i)[1].replaceAll("'","")
    if (doc.querySelector("body").innerHTML.match(/<input type="submit" name="cast" class="btn btn-primary" value="Cast Skill">/i) != null){skills_count += 1;skills_icons += `<img src="images/skills/boost.png" id="9" onmouseover="statspopup(event,'<h5>`+name+`</h5><p>`+details+`')" onmouseout="kill()">`}
    fetch_count += 1;

fetch("skills_info.php?id=26")
   .then(response => response.text())
   .then((response) => {
    const doc = new DOMParser().parseFromString(response, 'text/html');
    const name = doc.querySelector("body > div.text-left > h5").innerHTML
    const details = response.match(/<\/h5>[\n\r](.*) <\/div>/i)[1].replaceAll("'","")
    if (doc.querySelector("body").innerHTML.match(/<input type="submit" name="cast" class="btn btn-primary" value="Cast Skill">/i) != null){skills_count += 1;skills_icons += `<img src="images/skills/protection.png" id="26" onmouseover="statspopup(event,'<h5>`+name+`</h5><p>`+details+`')" onmouseout="kill()">`}
    fetch_count += 1;

fetch("skills_info.php?id=29")
   .then(response => response.text())
   .then((response) => {
    const doc = new DOMParser().parseFromString(response, 'text/html');
    const name = doc.querySelector("body > div.text-left > h5").innerHTML
    const details = response.match(/<\/h5>[\n\r](.*) <\/div>/i)[1].replaceAll("'","")
    if (doc.querySelector("body").innerHTML.match(/<input type="submit" name="cast" class="btn btn-primary" value="Cast Skill">/i) != null){skills_count += 1;skills_icons += `<img src="images/skills/accuratestrike.png" id="29" onmouseover="statspopup(event,'<h5>`+name+`</h5><p>`+details+`')" onmouseout="kill()">`}
    fetch_count += 1;

fetch("skills_info.php?id=312")
   .then(response => response.text())
   .then((response) => {
    const doc = new DOMParser().parseFromString(response, 'text/html');
    const name = doc.querySelector("body > div.text-left > h5").innerHTML
    const details = response.match(/<\/h5>[\n\r](.*) <\/div>/i)[1].replaceAll("'","")
    if (doc.querySelector("body").innerHTML.match(/<input type="submit" name="cast" class="btn btn-primary" value="Cast Skill">/i) != null){skills_count += 1;skills_icons += `<img src="images/skills/darkstrength.png" id="312" onmouseover="statspopup(event,'<h5>`+name+`</h5><p>`+details+`')" onmouseout="kill()">`}
    fetch_count += 1;

fetch("skills_info.php?id=87")
   .then(response => response.text())
   .then((response) => {
    const doc = new DOMParser().parseFromString(response, 'text/html');
    const name = doc.querySelector("body > div.text-left > h5").innerHTML
    const details = response.match(/<\/h5>[\n\r](.*) <\/div>/i)[1].replaceAll("'","")
    if (doc.querySelector("body").innerHTML.match(/<input type="submit" name="cast" class="btn btn-primary" value="Cast Skill">/i) != null){skills_count += 1;skills_icons += `<img src="images/skills/swiftness.png" id="87" onmouseover="statspopup(event,'<h5>`+name+`</h5><p>`+details+`')" onmouseout="kill()">`}
    fetch_count += 1;

fetch("skills_info.php?id=3024")
   .then(response => response.text())
   .then((response) => {
    const doc = new DOMParser().parseFromString(response, 'text/html');
    const name = doc.querySelector("body > div.text-left > h5").innerHTML
    const details = response.match(/<\/h5>[\n\r](.*) <\/div>/i)[1].replaceAll("'","")
    if (doc.querySelector("body").innerHTML.match(/<input type="submit" name="cast" class="btn btn-primary" value="Cast Skill">/i) != null){skills_count += 1;skills_icons += `<img src="images/skills/haste.png" id="3024" onmouseover="statspopup(event,'<h5>`+name+`</h5><p>`+details+`')" onmouseout="kill()">`}
    fetch_count += 1;

fetch("skills_info.php?id=17")
   .then(response => response.text())
   .then((response) => {
    const doc = new DOMParser().parseFromString(response, 'text/html');
    const name = doc.querySelector("body > div.text-left > h5").innerHTML
    const details = response.match(/<\/h5>[\n\r](.*) <\/div>/i)[1].replaceAll("'","")
    if (doc.querySelector("body").innerHTML.match(/<input type="submit" name="cast" class="btn btn-primary" value="Cast Skill">/i) != null){skills_count += 1;skills_icons += `<img src="images/skills/masterfullooting.png" id="17" onmouseover="statspopup(event,'<h5>`+name+`</h5><p>`+details+`')" onmouseout="kill()">`}
    fetch_count += 1;

fetch("skills_info.php?id=3008")
   .then(response => response.text())
   .then((response) => {
    const doc = new DOMParser().parseFromString(response, 'text/html');
    const name = doc.querySelector("body > div.text-left > h5").innerHTML
    const details = response.match(/<\/h5>[\n\r](.*) <\/div>/i)[1].replaceAll("'","")
    if (doc.querySelector("body").innerHTML.match(/<input type="submit" name="cast" class="btn btn-primary" value="Cast Skill">/i) != null){skills_count += 1;skills_icons += `<img src="images/skills/circumspect.png" id="3008" onmouseover="statspopup(event,'<h5>`+name+`</h5><p>`+details+`')" onmouseout="kill()">`}
    fetch_count += 1;

fetch("skills_info.php?id=5")
   .then(response => response.text())
   .then((response) => {
    const doc = new DOMParser().parseFromString(response, 'text/html');
    const name = doc.querySelector("body > div.text-left > h5").innerHTML
    const details = response.match(/<\/h5>[\n\r](.*) <\/div>/i)[1].replaceAll("'","")
    if (doc.querySelector("body").innerHTML.match(/<input type="submit" name="cast" class="btn btn-primary" value="Cast Skill">/i) != null){skills_count += 1;skills_icons += `<img src="images/skills/bloodlust.png" id="5" onmouseover="statspopup(event,'<h5>`+name+`</h5><p>`+details+`')" onmouseout="kill()">`}
    fetch_count += 1;

fetch("skills_info.php?id=3007")
   .then(response => response.text())
   .then((response) => {
    const doc = new DOMParser().parseFromString(response, 'text/html');
    const name = doc.querySelector("body > div.text-left > h5").innerHTML
    const details = response.match(/<\/h5>[\n\r](.*) <\/div>/i)[1].replaceAll("'","")
    if (doc.querySelector("body").innerHTML.match(/<input type="submit" name="cast" class="btn btn-primary" value="Cast Skill">/i) != null){skills_count += 1;skills_icons += `<img src="images/skills/stoneskin.png" id="3007" onmouseover="statspopup(event,'<h5>`+name+`</h5><p>`+details+`')" onmouseout="kill()">`}
    fetch_count += 1;

fetch("skills_info.php?id=3013")
   .then(response => response.text())
   .then((response) => {
    const doc = new DOMParser().parseFromString(response, 'text/html');
    const name = doc.querySelector("body > div.text-left > h5").innerHTML
    const details = response.match(/<\/h5>[\n\r](.*) <\/div>/i)[1].replaceAll("'","")
    if (doc.querySelector("body").innerHTML.match(/<input type="submit" name="cast" class="btn btn-primary" value="Cast Skill">/i) != null){skills_count += 1;skills_icons += `<img src="images/skills/masterfulraiding.png" id="3013" onmouseover="statspopup(event,'<h5>`+name+`</h5><p>`+details+`')" onmouseout="kill()">`}
    fetch_count += 1;

fetch("skills_info.php?id=3014")
   .then(response => response.text())
   .then((response) => {
    const doc = new DOMParser().parseFromString(response, 'text/html');
    const name = doc.querySelector("body > div.text-left > h5").innerHTML
    const details = response.match(/<\/h5>[\n\r](.*) <\/div>/i)[1].replaceAll("'","")
    if (doc.querySelector("body").innerHTML.match(/<input type="submit" name="cast" class="btn btn-primary" value="Cast Skill">/i) != null){skills_count += 1;skills_icons += `<img src="images/skills/markdown.png" id="3014" onmouseover="statspopup(event,'<h5>`+name+`</h5><p>`+details+`')" onmouseout="kill()">`}
    fetch_count += 1;

fetch("skills_info.php?id=3010")
   .then(response => response.text())
   .then((response) => {
    const doc = new DOMParser().parseFromString(response, 'text/html');
    const name = doc.querySelector("body > div.text-left > h5").innerHTML
    const details = response.match(/<\/h5>[\n\r](.*) <\/div>/i)[1].replaceAll("'","")
    if (doc.querySelector("body").innerHTML.match(/<input type="submit" name="cast" class="btn btn-primary" value="Cast Skill">/i) != null){skills_count += 1;skills_icons += `<img src="images/skills/laststand.png" id="3010" onmouseover="statspopup(event,'<h5>`+name+`</h5><p>`+details+`')" onmouseout="kill()">`}
    fetch_count += 1;

fetch("skills_info.php?id=3015")
   .then(response => response.text())
   .then((response) => {
    const doc = new DOMParser().parseFromString(response, 'text/html');
    const name = doc.querySelector("body > div.text-left > h5").innerHTML
    const details = response.match(/<\/h5>[\n\r](.*) <\/div>/i)[1].replaceAll("'","")
    if (doc.querySelector("body").innerHTML.match(/<input type="submit" name="cast" class="btn btn-primary" value="Cast Skill">/i) != null){skills_count += 1;skills_icons += `<img src="images/skills/strengthinnumbers.png" id="3015" onmouseover="statspopup(event,'<h5>`+name+`</h5><p>`+details+`')" onmouseout="kill()">`}
    fetch_count += 1;

fetch("skills_info.php?id=3009")
   .then(response => response.text())
   .then((response) => {
    const doc = new DOMParser().parseFromString(response, 'text/html');
    const name = doc.querySelector("body > div.text-left > h5").innerHTML
    const details = response.match(/<\/h5>[\n\r](.*) <\/div>/i)[1].replaceAll("'","")
    if (doc.querySelector("body").innerHTML.match(/<input type="submit" name="cast" class="btn btn-primary" value="Cast Skill">/i) != null){skills_count += 1;skills_icons += `<img src="images/skills/forcefield.png" id="3009" onmouseover="statspopup(event,'<h5>`+name+`</h5><p>`+details+`')" onmouseout="kill()">`}
    fetch_count += 1;

fetch("skills_info.php?id=2")
   .then(response => response.text())
   .then((response) => {
    const doc = new DOMParser().parseFromString(response, 'text/html');
    const name = doc.querySelector("body > div.text-left > h5").innerHTML
    const details = response.match(/<\/h5>[\n\r](.*) <\/div>/i)[1].replaceAll("'","")
    if (doc.querySelector("body").innerHTML.match(/<input type="submit" name="cast" class="btn btn-primary" value="Cast Skill">/i) != null){skills_count += 1;skills_icons += `<img src="images/skills/blessingfromabove.png" id="2" onmouseover="statspopup(event,'<h5>`+name+`</h5><p>`+details+`')" onmouseout="kill()">`}
    fetch_count += 1;

fetch("skills_info.php?id=3011")
   .then(response => response.text())
   .then((response) => {
    const doc = new DOMParser().parseFromString(response, 'text/html');
    const name = doc.querySelector("body > div.text-left > h5").innerHTML
    const details = response.match(/<\/h5>[\n\r](.*) <\/div>/i)[1].replaceAll("'","")
    if (doc.querySelector("body").innerHTML.match(/<input type="submit" name="cast" class="btn btn-primary" value="Cast Skill">/i) != null){skills_count += 1;skills_icons += `<img src="images/skills/enchantarmor.png" id="3011" onmouseover="statspopup(event,'<h5>`+name+`</h5><p>`+details+`')" onmouseout="kill()">`}
    fetch_count += 1;

fetch("skills_info.php?id=3012")
   .then(response => response.text())
   .then((response) => {
    const doc = new DOMParser().parseFromString(response, 'text/html');
    const name = doc.querySelector("body > div.text-left > h5").innerHTML
    const details = response.match(/<\/h5>[\n\r](.*) <\/div>/i)[1].replaceAll("'","")
    if (doc.querySelector("body").innerHTML.match(/<input type="submit" name="cast" class="btn btn-primary" value="Cast Skill">/i) != null){skills_count += 1;skills_icons += `<img src="images/skills/elementalpower.png" id="3012" onmouseover="statspopup(event,'<h5>`+name+`</h5><p>`+details+`')" onmouseout="kill()">`}
    fetch_count += 1;

fetch("skills_info.php?id=3025")
   .then(response => response.text())
   .then((response) => {
    const doc = new DOMParser().parseFromString(response, 'text/html');
    const name = doc.querySelector("body > div.text-left > h5").innerHTML
    const details = response.match(/<\/h5>[\n\r](.*) <\/div>/i)[1].replaceAll("'","")
    if (doc.querySelector("body").innerHTML.match(/<input type="submit" name="cast" class="btn btn-primary" value="Cast Skill">/i) != null){skills_count += 1;skills_icons += `<img src="images/skills/executioner.png" id="3025" onmouseover="statspopup(event,'<h5>`+name+`</h5><p>`+details+`')" onmouseout="kill()">`}
    fetch_count += 1;

fetch("skills_info.php?id=3006")
   .then(response => response.text())
   .then((response) => {
    const doc = new DOMParser().parseFromString(response, 'text/html');
    const name = doc.querySelector("body > div.text-left > h5").innerHTML
    const details = response.match(/<\/h5>[\n\r](.*) <\/div>/i)[1].replaceAll("'","")
    if (doc.querySelector("body").innerHTML.match(/<input type="submit" name="cast" class="btn btn-primary" value="Cast Skill">/i) != null){skills_count += 1;skills_icons += `<img src="images/skills/elementalbarrier.png" id="3006" onmouseover="statspopup(event,'<h5>`+name+`</h5><p>`+details+`')" onmouseout="kill()">`}
    fetch_count += 1;

fetch("skills_info.php?id=36")
   .then(response => response.text())
   .then((response) => {
    const doc = new DOMParser().parseFromString(response, 'text/html');
    const name = doc.querySelector("body > div.text-left > h5").innerHTML
    const details = response.match(/<\/h5>[\n\r](.*) <\/div>/i)[1].replaceAll("'","")
    if (doc.querySelector("body").innerHTML.match(/<input type="submit" name="cast" class="btn btn-primary" value="Cast Skill">/i) != null){skills_count += 1;skills_icons += `<img src="images/skills/hitman.png" id="36" onmouseover="statspopup(event,'<h5>`+name+`</h5><p>`+details+`')" onmouseout="kill()">`}
    fetch_count += 1;

fetch("skills_info.php?id=33")
   .then(response => response.text())
   .then((response) => {
    const doc = new DOMParser().parseFromString(response, 'text/html');
    const name = doc.querySelector("body > div.text-left > h5").innerHTML
    const details = response.match(/<\/h5>[\n\r](.*) <\/div>/i)[1].replaceAll("'","")
    if (doc.querySelector("body").innerHTML.match(/<input type="submit" name="cast" class="btn btn-primary" value="Cast Skill">/i) != null){skills_count += 1;skills_icons += `<img src="images/skills/uproar.png" id="33" onmouseover="statspopup(event,'<h5>`+name+`</h5><p>`+details+`')" onmouseout="kill()">`}
    fetch_count += 1;

fetch("skills_info.php?id=35")
   .then(response => response.text())
   .then((response) => {
    const doc = new DOMParser().parseFromString(response, 'text/html');
    const name = doc.querySelector("body > div.text-left > h5").innerHTML
    const details = response.match(/<\/h5>[\n\r](.*) <\/div>/i)[1].replaceAll("'","")
    if (doc.querySelector("body").innerHTML.match(/<input type="submit" name="cast" class="btn btn-primary" value="Cast Skill">/i) != null){skills_count += 1;skills_icons += `<img src="images/skills/killingspree.png" id="35" onmouseover="statspopup(event,'<h5>`+name+`</h5><p>`+details+`')" onmouseout="kill()">`}
    fetch_count += 1;

fetch("skills_info.php?id=8")
   .then(response => response.text())
   .then((response) => {
    const doc = new DOMParser().parseFromString(response, 'text/html');
    const name = doc.querySelector("body > div.text-left > h5").innerHTML
    const details = response.match(/<\/h5>[\n\r](.*) <\/div>/i)[1].replaceAll("'","")
    if (doc.querySelector("body").innerHTML.match(/<input type="submit" name="cast" class="btn btn-primary" value="Cast Skill">/i) != null){skills_count += 1;skills_icons += `<img src="images/skills/ambush.png" id="8" onmouseover="statspopup(event,'<h5>`+name+`</h5><p>`+details+`')" onmouseout="kill()">`}
    fetch_count += 1;

fetch("skills_info.php?id=14")
   .then(response => response.text())
   .then((response) => {
    const doc = new DOMParser().parseFromString(response, 'text/html');
    const name = doc.querySelector("body > div.text-left > h5").innerHTML
    const details = response.match(/<\/h5>[\n\r](.*) <\/div>/i)[1].replaceAll("'","")
    if (doc.querySelector("body").innerHTML.match(/<input type="submit" name="cast" class="btn btn-primary" value="Cast Skill">/i) != null){skills_count += 1;skills_icons += `<img src="images/skills/circleofprotection.png" id="14" onmouseover="statspopup(event,'<h5>`+name+`</h5><p>`+details+`')" onmouseout="kill()">`}
    fetch_count += 1;

fetch("skills_info.php?id=3016")
   .then(response => response.text())
   .then((response) => {
    const doc = new DOMParser().parseFromString(response, 'text/html');
    const name = doc.querySelector("body > div.text-left > h5").innerHTML
    const details = response.match(/<\/h5>[\n\r](.*) <\/div>/i)[1].replaceAll("'","")
    if (doc.querySelector("body").innerHTML.match(/<input type="submit" name="cast" class="btn btn-primary" value="Cast Skill">/i) != null){skills_count += 1;skills_icons += `<img src="images/skills/vanish.png" id="3016" onmouseover="statspopup(event,'<h5>`+name+`</h5><p>`+details+`')" onmouseout="kill()">`}
    fetch_count += 1;

fetch("skills_info.php?id=46")
   .then(response => response.text())
   .then((response) => {
    const doc = new DOMParser().parseFromString(response, 'text/html');
    const name = doc.querySelector("body > div.text-left > h5").innerHTML
    const details = response.match(/<\/h5>[\n\r](.*) <\/div>/i)[1].replaceAll("'","")
    if (doc.querySelector("body").innerHTML.match(/<input type="submit" name="cast" class="btn btn-primary" value="Cast Skill">/i) != null){skills_count += 1;skills_icons += `<img src="images/skills/shieldwall.png" id="46" onmouseover="statspopup(event,'<h5>`+name+`</h5><p>`+details+`')" onmouseout="kill()">`}
    fetch_count += 1;

fetch("skills_info.php?id=3174")
   .then(response => response.text())
   .then((response) => {
    const doc = new DOMParser().parseFromString(response, 'text/html');
    const name = doc.querySelector("body > div.text-left > h5").innerHTML
    const details = response.match(/<\/h5>[\n\r](.*) <\/div>/i)[1].replaceAll("'","")
    if (doc.querySelector("body").innerHTML.match(/<input type="submit" name="cast" class="btn btn-primary" value="Cast Skill">/i) != null){skills_count += 1;skills_icons += `<img src="images/skills/GodSlayerSkill.png" id="3174" onmouseover="statspopup(event,'<h5>`+name+`</h5><p>`+details+`')" onmouseout="kill()">`}
    fetch_count += 1;

fetch("skills_info.php?id=2996")
   .then(response => response.text())
   .then((response) => {
    const doc = new DOMParser().parseFromString(response, 'text/html');
    const name = doc.querySelector("body > div.text-left > h5").innerHTML
    const details = response.match(/<\/h5>[\n\r](.*) <\/div>/i)[1].replaceAll("'","")
    if (doc.querySelector("body").innerHTML.match(/<input type="submit" name="cast" class="btn btn-primary" value="Cast Skill">/i) != null){skills_count += 1;skills_icons += `<img src="images/skills/dailygrind.png" id="2996" onmouseover="statspopup(event,'<h5>`+name+`</h5><p>`+details+`')" onmouseout="kill()">`}
    fetch_count += 1;

fetch("profile")
   .then(response => response.text())
   .then((response) => {
    const doc = new DOMParser().parseFromString(response, 'text/html');
    const skills = doc.querySelector("#divSkillsCast").innerHTML.replace("skills/potion28.jpg","potion28.jpg").match(/src="[^"]*"/g)
    var skills_length = 0; if (skills != null){skills_length = skills.length-1}
    var active_img = '';
    for (let active = 0; active < skills_length+1; active++) {
    active_img = skills[active].replaceAll(`src="/`,"").replaceAll(`"`,"").replaceAll(/\.[a-zA-Z]+/g,"").replaceAll(/.*\.\./g,"")
    GM_addStyle (`#potsslider img[src*="`+active_img+`"]{opacity: 0.2 !important;filter: grayscale(1) !important;}`)}
    fetch_count += 1;

document.querySelector("#potsslider").innerHTML = skills_icons+`<p>`+pots_icons+`<div id="buttons">
<button id="slider_all_skills" class="btn btn-primary mmplus">SELECT ALL SKILLS <img src=https://studiomoxxi.com/moxximod/bot.png class="robot" id="icon"></button>
<button id="slider_none_skills" class="btn btn-primary mmplus">DESELECT ALL SKILLS <img src=https://studiomoxxi.com/moxximod/bot.png class="robot" id="icon"></button>
<button id="slider_all_potions" class="btn btn-primary mmplus">SELECT ALL POTIONS <img src=https://studiomoxxi.com/moxximod/bot.png class="robot" id="icon"></button>
<button id="slider_none_potions" class="btn btn-primary mmplus">DESELECT ALL POTIONS <img src=https://studiomoxxi.com/moxximod/bot.png class="robot" id="icon"></button>
<button id="slider_cast" class="btn btn-primary mmplus">CAST SELECTED <img src=https://studiomoxxi.com/moxximod/bot.png class="robot" id="icon"></button></div>`
var sliderheight = (Math.ceil((pots_count)/25)*80)+(Math.ceil((skills_count)/25)*80)+50

$(function () {
  $('#potsslider').on('click','img',(function() {
      $(this).toggleClass("selected");
  }));});

function slider_all_skills() {
$(function () {
  $("#potsslider > img").addClass("selected");
  });};

function slider_all_potions() {
$(function () {
  $("#potsslider > p > img").addClass("selected");
  });};

function slider_none_skills() {
$(function () {
  $("#potsslider > img").removeClass("selected");
  });};

function slider_none_potions() {
$(function () {
  $("#potsslider > p > img").removeClass("selected");
  });};

document.querySelector("#slider_all_skills").addEventListener("click", slider_all_skills, false);
document.querySelector("#slider_none_skills").addEventListener("click", slider_none_skills, false);
document.querySelector("#slider_all_potions").addEventListener("click", slider_all_potions, false);
document.querySelector("#slider_none_potions").addEventListener("click", slider_none_potions, false);
document.querySelector("#slider_cast").addEventListener("click", slider_cast, false);

function slider_cast(){
const ids = Array.from(
document.getElementsByClassName("selected"), ({ id }) => id)
cast_selected = ids.toString();
task07();}

GM_addStyle (`
#icon{width:25px !important; height:25px !important;background:transparent !important;}
.pmslider {height: `+sliderheight+`px !important;width:100%;border:0px !important;}
#potsslider > img {background:#131313 !important;height:55px !important;width:55px !important;margin:10px !important;border-radius:10px !important;box-shadow: 0px 0px 24px -6px rgba(0,0,0,0.57);-webkit-box-shadow: 0px 0px 24px -6px rgba(0,0,0,0.57);-moz-box-shadow: 0px 0px 24px -6px rgba(0,0,0,0.57);}
#potsslider > p > img {background:#131313 !important;height:55px !important;width:55px !important;margin:10px !important;border-radius:10px !important;box-shadow: 0px 0px 24px -6px rgba(0,0,0,0.57);-webkit-box-shadow: 0px 0px 24px -6px rgba(0,0,0,0.57);-moz-box-shadow: 0px 0px 24px -6px rgba(0,0,0,0.57);}
.itemimage {max-width: 55px !important;max-height: 55px !important;min-width: 55px !important;min-height: 55px !important;}
body > cloudflare-app{display:none !important;}
#sliderload{display:none !important;}
#potsslider > img.selected{border:4px #00CC00 SOLID !important;width:55px !important;height:55px !important;padding:5px !important;}
#potsslider > p > img.selected{border:4px #00CC00 SOLID !important;width:55px !important;height:55px !important;padding:5px !important;}
.btn-primary{margin-left:5px !important;margin-right:5px !important;}
`)
})})})})})})})})})})})})})})})})})})})})})})})})})})})})})})})})})})})})})})})})

document.querySelector("#slider").addEventListener("click", slider_close, false);
document.querySelector("#slider").removeEventListener("click", slider_open, false);

} 

function slider_close(){
GM_addStyle (`.pmslider {height: 0px !important;width:100%;border:0px !important;}body > cloudflare-app{display:revert !important;}`);
document.querySelector("#slider").addEventListener("click", slider_open, false);
document.querySelector("#slider").removeEventListener("click", slider_close, false);
}

GM_addStyle (`
.pmslider {
height: 0px !important;
width:100%;
border:0px !important;
bottom:0px !important;
position:fixed !important;
transition-property: all;
transition-duration: 1s;
background: linear-gradient(97deg, rgba(46,46,46,1) 0%, rgba(124,124,124,1) 92%, rgba(85,85,85,1) 100%);
z-index:1000 !important;
box-shadow: 0 6px 10px 0 rgba(0,0,0,1),0 1px 18px 0 rgba(0,0,0,1),0 3px 5px -1px rgba(0,0,0,1);
}`);

$("body").append ( `
<div class="pmslider" id="slider"><center>
<div id="potsslider">loading</div>
</div>`);

if (document.URL.indexOf("wilderness") != -1 && error == false) {

document.querySelector("#divWildernessContainer > div.row.mx-3.mt-3").setAttribute("class","wilderness")

GM_addStyle (`
#divWildernessContainer > div.wilderness > div:nth-child(1){display:none !important;}
#divHeader{display:none !important;}
#divWildernessContainer > div.wilderness > div:nth-child(3) > h5{margin-bottom:0.5rem !important;}
#divWildernessContainer > div.wilderness > div:nth-child(2){width:824px !important;}
`);

var wild = document.querySelector("#divWildernessContainer > div.wilderness");
var wild_level = document.querySelector("#divHeader > h1").innerHTML
document.querySelector("#divWildernessContainer > div.wilderness > div:nth-child(2) > h3").innerHTML = "YOUR LEVEL: "+wild_level

let wilddiv = document.createElement('div');
wilddiv.innerHTML = `<h5>- Wilderness Auto Attack -</h5>
<center><table id="gotormtab"><tr><td>
<input type="text" placeholder="rage stop" id="wild_ragetouse" class="goto" name="atkn" size="9">
</td><td>
<button id="wilderness" class="btn btn-primary mmplus">ATK <img src=https://studiomoxxi.com/moxximod/bot.png class="robot" onmouseover="popup(event,'<b><font color=#f441be>MoxxiMod+</font></b><br>Enter the amount of rage you would like to use')" onmouseout="kill()"></button>
</td></tr></table>(account will stop attacking when rage stop is met)`
wilddiv.setAttribute("class","col-12 col-lg-6 statbox widget box box-shadow")
wilddiv.setAttribute("style","margin-top:1rem")
insertAfter(wilddiv, wild.lastElementChild);

var ragefloor = 0;
document.querySelector("#wilderness").addEventListener("click", wilderness, false);
function wilderness(){
var rage = parseInt(document.querySelector("body").innerHTML.replaceAll(",","").match(/<span class="toolbar_rage">([0-9]+)<\/span>/i)[1])
var ragetouse = parseInt(document.querySelector("#wild_ragetouse").value.replaceAll(",",""))
if (rage-ragetouse >= 1000){ragefloor = ragetouse}
if (rage-ragetouse <= 999){ragefloor = 1000}
task05();
}}

if (document.URL.indexOf("dungeons") != -1 && error == false) {

var num_of_sets = document.querySelector("#Items").childElementCount

for (let rownum = 1; rownum < (num_of_sets+1); rownum++) {

var dungeon_data = document.querySelector("#Items > div:nth-child("+rownum+") > div:nth-child(1) > div.four.columns > h3:nth-child(4)")

dungeon_data.innerHTML = dungeon_data.innerHTML
.replace(`<a href="/world.php?room=26032">Blazing Challenge Master</a>`,`<a href="/world.php?room=26032">Blazing Challenge Master</h3></a><h3>625 tokens ($50.00 USD) per`)
.replace(`<a href="/world.php?room=28892">Ghostly Challenge Master</a>`,`<a href="/world.php?room=28892">Ghostly Challenge Master</h3></a><h3>440 tokens ($35.20 USD) per`)
.replace(`<a href="/world.php?room=26013">Exalted Challenge Master</a>`,`<a href="/world.php?room=26013">Exalted Challenge Master</h3></a><h3>165 tokens ($13.20 USD) per + perfection item`)
.replace(`<a href="/world.php?room=25994">Perfectionist Challenge Master</a>`,`<a href="/world.php?room=25994">Perfectionist Challenge Master</h3></a><h3>165 tokens ($13.20 USD) per`)
.replace(`<a href="/world.php?room=25989">Ultra Challenge Master</a>`,`<a href="/world.php?room=25989">Ultra Challenge Master</h3></a><h3>125 tokens ($10.00 USD) per`)
.replace(`<a href="/world.php?room=25989">Challenge King</a>`,`<a href="/world.php?room=25989">Challenge King</h3></a><h3>90 tokens ($7.20 USD) per`)

}}

var task = "AuthCheck|"+rganame;
var misc = '';

function task01(){task = "AuthCheck|"+rganame; server_go();}
function task02(){task = "Atk10x|"+rganame+"|"+server+"|"+charid+"|"+atk10x_charid; server_go();}
function task03(){task = "AtkCOP|"+rganame+"|"+server+"|"+charid+"|"+brawlcop_string; server_go();}
function task04(){task = "MultiMobAtk|"+rganame+"|"+server+"|"+charid+"|"+sendmobattacks+"|"+sendmobid; server_go();}
function task05(){task = "Wilderness|"+rganame+"|"+server+"|"+charid+"|"+ragefloor; server_go();}
function task06(){task = "PvpCrew|"+rganame+"|"+server+"|"+charid+"|"+cid; server_go();}
function task07(){task = "Cast|"+rganame+"|"+server+"|"+charid+"|"+cast_selected; server_go();}
function task08(){task = "GoToRm|"+rganame+"|"+server+"|"+charid+"|"+gotormnum; server_go();}
function task09(){task = "ChaosNeeds|"+rganame+"|"+server; server_go();}
function task10(){task = "BadgeNeeds|"+rganame+"|"+server; server_go();}
function task11(){task = "Vision|"+rganame+"|"+server+"|"+sessids; server_go();}
function task12(){task = "RoomAtk|"+rganame+"|"+server+"|"+charid; server_go();}
function task13(){task = "MobAtk|"+rganame+"|"+server+mv_mobs_post; server_go();}

var sess_auth = GM_getValue("bauth_rga")
if (sess_auth != rganame) {window.onload = server_go;}
if (sess_auth == undefined) {window.onload = server_go;}

function server_go(){
GM_setValue("bauth_rga", rganame);
if (char1 !== "BenStorage"){
GM_xmlhttpRequest({
  method: 'POST',
  url: 'http://boss.outwar.link:8001/',
  data: task,
  headers: {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'},
  onload: function(r){
      console.log("TASK SENT TO SERVER: "+task);
      GM_setValue("bauth_r", r.response);
      sub();
}})}}

function task14(){task = "Custom|"+rganame+"|"+send_custom; server_custom();}

function server_custom(){
GM_setValue("bauth_rga", rganame);
if (char1 !== "BenStorage"){
GM_xmlhttpRequest({
  method: 'POST',
  url: 'http://boss.outwar.link:8001/',
  data: task,
  headers: {'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8'},
  onload: function(r){
var palette = r.response;
if (palette.match("wallurl") != null){var wallurl = palette.match(/wallurl\|(.*)\|/i)[1];GM_setValue("wallpaper",wallurl)}
if (palette.match("contentcolor") != null){var contentcolor = palette.match(/contentcolor\|(.*)\|/i)[1];GM_setValue("hex_content",contentcolor)}
if (palette.match("menucolor") != null){var menucolor = palette.match(/menucolor\|(.*)\|/i)[1];GM_setValue("hex_menu",menucolor)}
if (palette.match("toolcolor") != null){var toolcolor = palette.match(/toolcolor\|(.*)\|/i)[1];GM_setValue("hex_tool",toolcolor)}
if (palette.match("tablecolor") != null){var tablecolor = palette.match(/tablecolor\|(.*)\|/i)[1];GM_setValue("hex_table",tablecolor)}
if (palette.match("trackcolor") != null){var trackcolor = palette.match(/trackcolor\|(.*)\|/i)[1];GM_setValue("hex_track",trackcolor)}
if (palette.match("slidecolor") != null){var slidecolor = palette.match(/slidecolor\|(.*)\|/i)[1];GM_setValue("hex_slide",slidecolor)}
if (palette.match("textcolor") != null){var textcolor = palette.match(/textcolor\|(.*)\|/i)[1];GM_setValue("hex_text",textcolor)}
if (palette.match("menutext") != null){var menutext = palette.match(/menutext\|(.*)\|/i)[1];GM_setValue("hex_menutext",menutext)}
if (palette.match("linkcolor") != null){var linkcolor = palette.match(/linkcolor\|(.*)\|/i)[1];GM_setValue("hex_link",linkcolor)}
if (palette.match("linkhover") != null){var linkhover = palette.match(/linkhover\|(.*)\|/i)[1];GM_setValue("hex_linkhover",linkhover)}
if (palette.match("boxcolor") != null){var boxcolor = palette.match(/boxcolor\|(.*)\|/i)[1];GM_setValue("hex_box",boxcolor)}
if (palette.match("input_mydestination") != null){var input_mydestination = palette.match(/input_mydestination\|(.*)\|/i)[1];GM_setValue("mydestination",input_mydestination)}
if (palette.match("input_mydestinationname") != null){var input_mydestinationname = palette.match(/input_mydestinationname\|(.*)\|/i)[1];GM_setValue("mydestinationname",input_mydestinationname)}
window.location.href = "user_preferences"
sub();
}})}}

if (document.URL.indexOf("purchasepolicy") != -1 && error == false) {

GM_addStyle (`
.mmplustxt{text-align:left !important;font-size:20px !important;}
.robot{margin-right:0.5rem !important;}
#content > div.layout-px-spacing > div > img{width:100% !important;margin-bottom:1rem !important;box-shadow: 0 6px 10px 0 rgba(0,0,0,.14),0 1px 18px 0 rgba(0,0,0,.12),0 3px 5px -1px rgba(0,0,0,.2);border:#1B2E4B SOLID 1px !important;}
#content > div.layout-px-spacing{background:transparent !important;box-shadow: 0px 0px 0px #000000,-0px -0px 0px #000000 !important;}
`);

document.querySelector("#content > div.layout-px-spacing").innerHTML = `
<div class="widget" style="margin-bottom:1rem !important;">
<h3><img src="https://studiomoxxi.com/moxximod/logo_plus.png"> MoxxiMod+ is an premium subscription service <img src="https://studiomoxxi.com/moxximod/logo_plus.png"></h3><br>
<h5></h5>
To subscribe to MoxxiMod+ please send Ben a DM on <a href=https://discord.com/invite/f35cccbWU8?utm_source=Discord%20Widget&utm_medium=Connect target="BLANK">Discord</a><p style="margin-top:1rem !important;">
</div>

<div class="widget" style="margin-bottom:1rem !important;">
<p>Premium features are found on outwar with the robot icon<p>
<img src=https://studiomoxxi.com/moxximod/bot.png><p>
Mouseover the robot for more information</div>

<div class="widget" style="margin-bottom:1rem !important;"><h4>- FEATURES -</h4>
<p class="mmplustxt"><img src=https://studiomoxxi.com/moxximod/bot.png class="robot">Auto-skiller and auto-pot-caster dashboard to select and cast skills and potions with one click.
<p class="mmplustxt"><img src=https://studiomoxxi.com/moxximod/bot.png class="robot">Char-mover based on room number will auto-move an account to a specific room number.
<p class="mmplustxt"><img src=https://studiomoxxi.com/moxximod/bot.png class="robot">10x PVP attacker from Brawl will attack a char 10 times with one click.
<p class="mmplustxt"><img src=https://studiomoxxi.com/moxximod/bot.png class="robot">Attack on COP expire from Brawl will automatically attack a char 10 times as soon as their COP expires.
<p class="mmplustxt"><img src=https://studiomoxxi.com/moxximod/bot.png class="robot">Mob multi attacker let's the user select the number of times they want to attack the mob and then automatically attacks that many times. This feature is available for gladiators, towers, and other hard-to-kill mobs.
<p class="mmplustxt"><img src=https://studiomoxxi.com/moxximod/bot.png class="robot">Fast wilderness attacker let's the user decide how much rage they want to use and then attack wilderness repeatedly until they've used that amount of rage.
<p class="mmplustxt"><img src=https://studiomoxxi.com/moxximod/bot.png class="robot">Badge report is a feature added to MoxxiVision that generates a report for all accounts on the RGA. The badge report includes a list of what badge quests are available for every char on the RGA. <a href="https://studiomoxxi.com/moxximod/plus_screens/2023.01.05_07.42.43.537_Badge_Pull.txt" target="BLANK">VIEW SAMPLE</a>
<p class="mmplustxt"><img src=https://studiomoxxi.com/moxximod/bot.png class="robot">Chaos report is a feature added to MoxxiVision that generates a report for all accounts on the RGA. The chaos report includes a list of what chaos quests are available for every char on the RGA. <a href="https://studiomoxxi.com/moxximod/plus_screens/2022.12.28_07.13.22.834_Chaotic_Pull.txt" target="BLANK">VIEW SAMPLE</a>
<p class="mmplustxt"><img src=https://studiomoxxi.com/moxximod/bot.png class="robot">Attack all mobs in a room let's players click one button or type "0" to attack all mobs in their current room.
<p class="mmplustxt"><img src=https://studiomoxxi.com/moxximod/bot.png class="robot">PVP entire crew with one click is a button added to crew profiles that will attack every member of the crew when clicked.
<p class="mmplustxt"><img src=https://studiomoxxi.com/moxximod/bot.png class="robot">Mob attacking via MoxxiVision allows users to select long-spawn mobs for each char that they want to attack and then attack them with one click. This feature will move all selected chars to the mob and then attack them.
<p class="mmplustxt"><img src=https://studiomoxxi.com/moxximod/bot.png class="robot">More fast travel destinations available through fast travel menu. Additionally, players can set a custom fast travel destination on the user preferences page.
<p class="mmplustxt"><img src=https://studiomoxxi.com/moxximod/bot.png class="robot">Custom Outwar wallpaper and color preferences have been added to the player preferences tab and allows users to add their own wallpaper and adjust the colors on outwar.
</div>
`
}

if (document.URL.indexOf("raffle") != -1 && error == false) {

GM_addStyle (`
.mmplus_ids {background: #1B2E4B !important;border: 1px #1B2E4B SOLID !important;color: #FFFFFF !important;padding: 6px !important;border-radius: 6px !important;margin-right: 0.5rem !important;font-size: 12px !important;}
#content > div.layout-px-spacing{background:transparent !important;box-shadow: 0px 0px 0px #000000,-0px -0px 0px #000000 !important;}
`);

document.querySelector("#content > div.layout-px-spacing").innerHTML = `
<div class="widget">
<h3>MOXXIVISION+</h3>
<h6>Enter session IDs seperated by commas or paste session list from OWH to generate a moxxivision+ page and send it to you on discord</h6><p style="margin-top:1rem !important;">
<textarea name="mmplus_ids" id="mmplus_ids" class="mmplus_ids" cols="119" rows="22"></textarea><p style="margin-top:1rem !important;">
<span id="count"></span><p style="margin-top:1rem !important;">
<button style="display:none" class="btn btn-primary" id="mmplus_submit">SUBMIT<img src="https://studiomoxxi.com/moxximod/bot.png" class="robot" onmouseover="popup(event,'<b><font color=#f441be>MoxxiMod+</font></b><br>Generate MoxxiVision+ page')" onmouseout="kill()"></button>
coming soon</div>
`

var mvp_error = "<font color=#FF0000>ERROR: SESSIONS ARE NOT READABLE</font>"

$("#mmplus_ids").keyup(function(){
if ($(this).val().match(":") != null){
$("#mmplus_ids").val(function(i, v){
return v.replaceAll(/[A-Za-z0-9]+:/g,"").replaceAll("\n",",").replaceAll(" ","")})};
var count = $(this).val().replaceAll(",","").length/32;
var commas = ($(this).val().match(/,/g)||[]).length;
var spaces = ($(this).val().match(/ /g)||[]).length;
$("#count").text(count+" sessions found");
if(count!=commas+1 || spaces >= 1){
document.querySelector("#count").innerHTML = mvp_error
}
});

document.getElementById ("mmplus_submit").addEventListener("click", mmplus_submit, false);
var sessids = '';
function mmplus_submit(){
sessids = document.querySelector("#mmplus_ids").value;
if (document.querySelector("#count").innerHTML.match(/[0-9]+ sessions found/i) != null){task11()}
}}

if (document.URL.indexOf("cast_skills") != -1 ) {
GM_addStyle (`#content > div.layout-px-spacing{background:transparent !important;box-shadow: 0px 0px 0px #000000,-0px -0px 0px #000000 !important;}`);
}

if (document.URL.indexOf("treasury") != -1 ) {
GM_addStyle (`#content > div.layout-px-spacing{background:transparent !important;box-shadow: 0px 0px 0px #000000,-0px -0px 0px #000000 !important;}`);
}

if (document.URL.indexOf("pointtransfer") != -1 ) {
GM_addStyle (`#content > div.layout-px-spacing{background:transparent !important;box-shadow: 0px 0px 0px #000000,-0px -0px 0px #000000 !important;}`);
}

if (document.URL.indexOf("pointtransfer") != -1 ) {
GM_addStyle (`#content > div.layout-px-spacing{background:transparent !important;box-shadow: 0px 0px 0px #000000,-0px -0px 0px #000000 !important;}`);
}

if (document.URL.indexOf("gladiator") != -1 ) {
GM_addStyle (`#content > div.layout-px-spacing{background:transparent !important;box-shadow: 0px 0px 0px #000000,-0px -0px 0px #000000 !important;}`);
}

if (document.URL.indexOf("crew_home") != -1 ) {
GM_addStyle (`#content > div.layout-px-spacing{background:transparent !important;box-shadow: 0px 0px 0px #000000,-0px -0px 0px #000000 !important;}`);
}

if (document.URL.indexOf("myaccount") != -1 ) {
GM_addStyle (`#content > div.layout-px-spacing{background:transparent !important;box-shadow: 0px 0px 0px #000000,-0px -0px 0px #000000 !important;}`);
}

if (document.URL.indexOf("crew_raidresults") != -1 ) {
GM_addStyle (`#content > div.layout-px-spacing{background:transparent !important;box-shadow: 0px 0px 0px #000000,-0px -0px 0px #000000 !important;}`);
}

if (document.URL.indexOf("news") != -1 ) {
GM_addStyle (`#content > div.layout-px-spacing{background:transparent !important;box-shadow: 0px 0px 0px #000000,-0px -0px 0px #000000 !important;}`);
}

if (document.URL.indexOf("security_prompt") != -1 ) {
GM_addStyle (`#content > div.layout-px-spacing{background:transparent !important;box-shadow: 0px 0px 0px #000000,-0px -0px 0px #000000 !important;}`);
}

if (document.URL.indexOf("plrattack") != -1 ) {
GM_addStyle (`#content > div.layout-px-spacing{background:transparent !important;box-shadow: 0px 0px 0px #000000,-0px -0px 0px #000000 !important;}`);
}

if (document.URL.indexOf("attacklog") != -1 ) {
GM_addStyle (`
#content > div.layout-px-spacing{background:transparent !important;box-shadow: 0px 0px 0px #000000,-0px -0px 0px #000000 !important;}
#content-header-row > div.table-responsive{box-shadow: 0 6px 10px 0 rgba(0,0,0,.75),0 1px 18px 0 rgba(0,0,0,.75),0 3px 5px -1px rgba(0,0,0,.75);}
.mb-4{margin-bottom: 0rem!important;}
`)}

if (document.URL.indexOf("playersearch") != -1 ) {
GM_addStyle (`#content-header-row > center{margin-top:1rem !important;}`);
}

}