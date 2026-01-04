// ==UserScript==
// @name                   Roll20 Dark-Choose-Your-Color
// @description        	   A modified dark theme for Roll20.net including bug fixes and larger macrobar
// @credits to             RedReign and Justin Noon
// @author                 Cyelis1224
// @include                https://app.roll20.net/editor*
// @include                https://app.roll20.net/campaigns/chatarchive*
// @run-at                 document-start
// @version                2020.4.19.1.4
// @license                GPL-3.0-or-later
// @accent-color           var(--accent-color)
// @namespace https://greasyfork.org/users/522803
// @downloadURL https://update.greasyfork.org/scripts/401430/Roll20%20Dark-Choose-Your-Color.user.js
// @updateURL https://update.greasyfork.org/scripts/401430/Roll20%20Dark-Choose-Your-Color.meta.js
// ==/UserScript==

//Scrollbar Mod//
function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}
addGlobalStyle('\
::-webkit-scrollbar {\
width: 15px;\
height: 15px;\
}\
::-webkit-scrollbar-track-piece  {\
background-color: #1a1a1a\
}\
::-webkit-scrollbar-thumb:vertical {\
height: 30px;\
background-color: var(--accent-color);\
}\
');

(function() {var css =`

:root{
--accent-color: #35c8f5;
}

.button-2{
	background-color: hsl(0,0%,10%) !important;
}

.button-1{
	background-color: hsl(0,0%,10%) !important;
}

#color_selector{
	background-color:hsl(0,0%,10%) !important;
    border: 1px solid hsl(250,25%,15%) !important;
}

body {
    background:url(http://subtlepatterns.com/patterns/dark_leather.png)!important;
}

#initiativewindow ul li:first-child {
background-color: var(--accent-color) !important;
}

#initiativewindow ul li span.name {
color: white !important;
}

#initiativewindow ul li span.initiative {
color: white !important;
}

#textchat .message.private,
.whisper div{
background-color: transparent !important;
}

#zoompanel ul li.zoomClickBack{
background-color: var(--accent-color) !important;
}

#floatingtoolbar, #floatinglayerbar {
	background-color:hsl(0,0%,10%) !important;
	border: none !important;
	box-shadow: none !important;
	width: 40px !important;
}

#floatingtoolbar div.submenu {
	left: 40px !important;
	padding: 0 !important;
	top: 0 !important;
}

#floatingtoolbar div.submenu .pictos, #floatingtoolbar div.submenu .pictosthree, #floatingtoolbar div.submenu .pictostwo {
	left: 15px !important;
	position: absolute !important;
	text-align: center !important;
	width: 20px !important;
}

#floatingtoolbar div.submenu ul {
	background-color:#333 !important;
	border: 0 !important;
	border-radius: 0 !important;
	padding: 0 !important;
	width: 190px !important;
}

#floatingtoolbar div.submenu ul li {
	color:hsl(0,0%,80%) !important;
	padding-right: 20px !important;
    padding-left: 45px !important;
}

#floatingtoolbar div.submenu ul li span {
	padding-left: 10px !important;
}

#floatingtoolbar div.submenu ul li img {
    margin-left: -20px !important;
}

#editinglayer li.gm_slider_box {
    background-color: #333 !important;
}

#floatingtoolbar li.activebutton,
#floatingtoolbar li:hover
#floatingtoolbar div.submenu ul li:hover,
#floatinglayerbar li:hover,
#editinglayer.map div.submenu li.choosemap,
#editinglayer.objects div.submenu li.chooseobjects,
#editinglayer.foreground div.submenu li.chooseforeground,
#editinglayer.gmlayer div.submenu li.choosegmlayer,
#editinglayer.walls div.submenu li.choosewalls,
#editinglayer.weather div.submenu li.chooseweather,
#floatinglayerbar.map li.choosemap,
#floatinglayerbar.objects li.chooseobjects,
#floatinglayerbar.gmlayer li.choosegmlayer,
#floatinglayerbar.walls li.choosewalls,
#floatinglayerbar.weather li.chooseweather,
#floatinglayerbar.foreground li.chooseforeground,
#floatinglayerbar.background li.choosebackground,
#measure li.activerulermode {
    background-color: var(--accent-color) !important;
}

#floatingtoolbar li, #floatinglayerbar li {
	border: 0 !important;
	color:hsl(0,0%,80%) !important;
}

#ttaudio_results .result,
#battlebards_results .result,
#incompetech_results .result,
#jukebox_results .result,
#fanburst_results .result,
#myaudio_results .result,
.listresults .result {
    background-color: #1a1a1a !important;
}

#jukeboxfolderroot div.title:hover {
    background-color: transparent !important;
}

#floatingtoolbar li.activebutton,
#floatingtoolbar li:hover {
background-color: var(--accent-color) !important;
}

#page-toolbar {
	background-color:hsl(0,0%,10%) !important;
	border-radius: 0 !important;
}

#page-toolbar .availablepage {
	box-sizing: border-box !important;
}

#page-toolbar .availablepage span {
	color:hsl(0,0%,80%) !important;
	font-size: 12px !important;
}

#page-toolbar .handle {
	background:hsl(0,0%,10%) !important;
	border:1px solid hsl(0,0%,0%)!important;
	border-radius: 0 0 100% 100% !important;
	color:hsl(0,0%,80%) !important;
}

#editor-wrapper {
	overflow: hidden !important; /// CHANGE HIDDEN TO SCROLL FOR SCROLLBARS
}

.btn.btn-danger {
    background-color: #660000 !important;
}

.btn.btn-danger:hover,
.ui-dialog div.sheet-licensecontainer .sheet-body button.btn.btn-danger:hover,
.charsheet .repitem .itemcontrol button.btn.btn-danger:hover {
    color: white !important;
    background-color: #880000 !important;
}

.ui-widget-content {
	color:hsl(0,0%,75%)!important;
	border:1px solid black!important;
	background:hsl(0,0%,10%)!important;
}

.ui-dialog-titlebar-close {
	background:hsl(0,0%,80%)!important;
}

#rightsidebar {
	background-color:hsl(0,0%,0%)!important;
}

#sidebarcontrol {
	opacity: .7 !important;
	padding: 0 !important;
	-webkit-transform: translateX(0) rotate(-90deg) !important;
	-moz-transform: translateX(0) rotate(-90deg) !important;
	width: 50px !important;
	text-align: center !important;
	border: 2px solid hsl(0,0%,0%)!important;
	font-size: 10px !important;
	color:hsl(0,0%,80%) !important;
	background-color:hsl(0,0%,10%) !important;
	height: 24px !important;
	line-height: 35px !important;
	text-transform: uppercase !important;
	letter-spacing: 2px !important;
	-webkit-transform-origin: 100% 100% !important;
	-moz-transform-origin: 100% 100% !important;
	border-radius: 100% 100% 0 0 !important;
	top: 50% !important;
    margin-right: -1px !important;
	margin-top: -62.5px !important;
	transition: width, margin-top, opacity, height, font-size .5s,.5s,.5s,.5s,.5s !important;
}

#sidebarcontrol:hover {
	opacity: 1 !important;
	width: 75px !important;
	margin-top: -80px !important;
	height: 32px !important;
	font-size: 14px !important;
	transition: width, margin-top, opacity, height, font-size .5s,.5s,.5s,.5s,.5s !important;
}

#sidebarcontrol .fonticon-menu {
	display: none !important;
}

#sidebarcontrol:after {
	content: \'Menu\' !important;
}

code {
	color:hsl(0,0%,750%)!important;
	background-color:hsl(0,0%,10%)!important;
	border:1px solid hsl(0,0%,0%)!important;
}

#textchat .formula,#textchat .rolled {
	background:hsl(0,0%,10%)!important;
	border:1px solid hsl(0,0%,0%)!important;
}

#textchat .message {
	color:hsl(0,0%,80%)!important;
	background-color:hsl(0,0%,10%)!important;
	border:none!important;
	border-right:1px solid hsl(0,0%,50%)!important;
    height: auto !important;
}

#textchat .message.general {
    padding-top: 3px !important;
}

#textchat .by {
	color: #999 !important;
}

#textchat .rolled {
	color:hsl(0,0%,75%)!important;
}

#textchat .message.system {
	color:hsl(360,100%,100%)!important;
}

#textchat .userscript-sharelink {
	background-color:black !important;
}

#textchat .message > .userscript-sharelink:hover a {
    color: white !important;
}

#textchat .userscript-commandintro {
	color:hsl(360,100%,100%)!important;
}

#textchat .message.rollresult {
	color:hsl(0,0%,75%)!important;
}

#textchat .message .spacer {
	background-color: black !important;
	margin-right: -5px !important;
	height: 1px !important;
    margin-top: -3px !important;
}

#textchat .message.emote {
	color:hsl(30,40%,45%)!important;
}

#textchat .message.emote .spacer {
	background-color: black !important;
}

#rightsidebar ul.tabmenu {
	top: 2px!important;
	right: 1px!important;
	background-color: hsl(0,0%,10%) !important;
}

.ui-tabs .ui-tabs-nav {
	padding:1px 5px!important;
	border-bottom:none!important;
}

.ui-state-default,.ui-widget-content .ui-state-default,.ui-widget-header .ui-state-default {
	box-shadow:none !important;
	text-shadow:none !important;
}

#textchat-input {
	width:300px!important;
	right:0!important;
	bottom:0!important;
	background-color:hsl(0,0%,10%)!important;
	padding:12px 1px 5px 5px!important;
	margin:0 -5px 0 0!important;
	border-top:0 solid hsl(0,0%,0%)!important;
	text-align:left!important;
}

.btn {
background-image: none !important;
	text-shadow:none!important;
}

.btn:hover {
	color:hsl(0,0%,100%)!important;
}

textarea,select,input,table,
.ui-dialog .btn:not(.sheet-wrapper-button),
#textchat-input .btn,
#rightsidebar .btn,
.tokenactions .btn,
.ui-dialog-content .ui-dialog-buttonset > button {
	 background-color:hsl(0,0%,10%)!important;
	 color:hsl(0,0%,75%)!important;
	 border-color:black!important;
}

.ui-dialog-buttonset button {
    background-image: none !important;
}

.sheet-body .ui-dialog-buttonset button[type='button']:hover,
.sheet-body .ui-dialog .btn:not(.sheet-wrapper-button):hover,
#textchat-input .btn:hover,
#rightsidebar .btn:hover,
.tokenactions .btn:hover,
.r20es-dialog .btn:hover,
.ui-dialog-buttonset button:hover {
	background-color:hsl(0,0%,20%)!important;
	color:hsl(0,0%,100%)!important;
}

.diceroll .didroll {
	text-shadow:0 0 10px hsl(0,0%,0%)!important;
	color:hsl(0,0%,75%)!important;
}

.diceroll.critfail .didroll {
	text-shadow:0 0 10px hsl(0,100%,50%)!important;
	color:hsl(0,80%,50%)!important;
}

.diceroll.critsuccess .didroll {
	text-shadow:0 0 10px hsl(100,50%,50%)!important;
	color:hsl(100,50%,50%)!important;
}

.diceroll.importantroll .didroll {
	text-shadow:0 0 10px hsl(240,100%,65%)!important;
	color:hsl(240,100%,65%)!important;
}

.ui-dialog .ui-dialog-buttonpane {
	background-color:hsl(0,0%,15%)!important;
	border-top:none!important;
	box-shadow:none!important;
}

.ui-dialog .ui-dialog-titlebar {
	border:none!important;
	background-color:hsl(0,0%,15%)!important;
}

#initiativewindow ul li {
	border-bottom:1px solid hsl(0,0%,10%)!important;
	background-color:hsl(0,0%,25%)!important;
	text-shadow:none!important;
}

.ui-widget-content a,.ui-dialog .ui-dialog-title,label,h1,h2,h3,h4,h5,h6 {
	color:hsl(0,0%,75%)!important;
}

hr {
	border-color:hsl(0,0%,15%)!important;
}

.sheet-rolltemplate-default caption {
background-color: var(--accent-color) !important;
}

.sheet-rolltemplate-default tr:nth-child(2n),
.table-striped tbody tr:nth-child(odd) td,
.table-striped tbody tr:nth-child(odd) th {
	background-color:hsl(0,0%,15%)!important;
}

.table tbody tr:hover td,.table tbody tr:hover th {
	background-color:hsl(0,0%,30%)!important;
}

.table th,.table td {
	border-color:hsl(0,0%,10%)!important;
	background-color:hsl(0,0%,25%)!important;
}

#imagedialog .searchbox {
	background:none!important;
}

#textchat .inlinerollresult {
	background-color: hsl(0, 0%, 10%) !important;
	border: 2px solid hsl(50, 30%, 30%) !important;
	color:hsl(0,0%,90%) !important;
}

#textchat .inlinerollresult.importantroll {
	border: 2px solid hsl(240, 100%, 65%) !important;
}

#textchat .inlinerollresult.fullcrit {
	border: 2px solid hsl(104, 79%, 39%) !important;
}

#textchat .inlinerollresult.fullfail {
	border: 2px solid hsl(0, 79%, 39%) !important;
}

div.dd-content {
	color:hsl(0,0%,75%) !important;
}

div.dd-content:hover {
	background-color:hsl(0,0%,40%) !important;
}

[class=\'sheet-row\'] {
	color:hsl(0,0%,50%) !important;
}

.ui-tabs .ui-tabs-nav li:hover,
.ui-tabs .ui-tabs-nav li a:hover {
	background: hsl(0,0%,20%) !important;
	border-bottom: 2px solid var(--accent-color) !important;
}

li.ui-tabs-active.ui-state-active:focus {
	outline: none;
}

li.ui-tabs-active.ui-state-active:focus {
	border-color: transparent !important;
	outline: none;
}

li.ui-tabs-active.ui-state-active:hover,
li.ui-tabs-active.ui-state-active > a:hover {
	color:hsl(0,0%,100%) !important;
}

li.ui-tabs-active.ui-state-active > a {
	outline: none;
	border-bottom: 2px solid var(--accent-color) !important;
	color:hsl(0,0%,96%) !important;
}

.dd-item.character > div.dd-content > .name {
	color:hsl(214,100%,79%) !important;
}

.dd-item.handout .dd-content > .name {
	color:hsl(214,100%,79%) !important
}

.sheet-container {
	background-color:hsl(0,0%,10%) !important;

}

.sheet-desc {
	color:hsl(0,0%,75%) !important;
}

.sheet-header {
	color:hsl(0,0%,100%) !important;
}

.sheet-rolltemplate-dmg {
	margin-top: 0px !important;
}

.sheet-rolltemplate-dmg > .sheet-desc {
	background-color: transparent !important;
}

.sheet-sublabel {
	margin-top: 3px !important;
}

.sheet-rolltemplate-npc,
.sheet-rolltemplate-npcaction .sheet-container,
.sheet-rolltemplate-npcatk,
.sheet-rolltemplate-npcdmg,
.sheet-rolltemplate-traits {
	border: 2px solid hsl(0,0%,0%) !important;
    border-radius: 8px !important;
	background-color:transparent !important;
}

.charsheet .sheet-red,
.charsheet .sheet-npc .sheet-display .sheet-red input,
.charsheet .sheet-npc .sheet-display .sheet-red span {
	color:hsl(0,0%,80%) !important;
}

.sheet-display .sheet-row.sheet-subtitle span {
	color: hsl(0,100%,30%) !important;
}

 {
    color: var(--accent-color) !important;
}
.sheet-npc .sheet-display > button span[name*="attr_"] {
    color: hsl(0,0%,80%) !important;
    background-color: transparent !important;
}

[name=\attr_name_display\]  {
	color:hsl(0,100%,50%) !important;
	font-weight: bold;
}

.charsheet .sheet-options .sheet-row > span, [name=\attr_name\] {
	color:hsl(0,0%,80%) !important;
}

[name=\attr_desc\]  {
	color:hsl(0,0%,80%) !important;
}

.charsheet .sheet-triangle,
.sheet-row.sheet-actiontitle,
.charsheet .sheet-header input,
.charsheet .sheet-header select,
.charsheet .sheet-hp .sheet-top input,
.charsheet .sheet-hdice-dsaves-container .sheet-top input[type=text] {
	border-color:hsl(0,0%,25%) !important
}

.sheet-value > input {
	background-color: transparent !important;
	color:hsl(0,0%,0%) !important;
}

.sheet-rolltemplate-atk .sheet-sublabel span,
.sheet-rolltemplate-atkdmg .sheet-sublabel span,
.sheet-rolltemplate-dmg .sheet-sublabel span,
.charsheet {
	color:hsl(0,0%,80%) !important;
}

.ui-autocomplete-input {
	color:hsl(0,0%,80%) !important;
}

textarea {
	color:hsl(0,0%,100%) !important;
}

.nav.nav-tabs > li.active > a {
	color:hsl(0,0%,96%) !important;
	font-weight: bold;
	background-color: transparent;
	border-bottom: 2px solid var(--accent-color) !important;
}

.sheet-spell-level input {
	background-color:hsl(0,0%,10%) !important;
	color:hsl(0,0%,80%) !important;
}

.sheet-spell-level .sheet-expended {
	border-left: none !important;
}

.repcontainer {
	margin-top: 10px;
}

.repcontrol {
	margin-bottom: 5px;
}

.sheet-title > button {
	height: 40px;
}

.sheet-attr-container > button > input {
	min-width: 20px !important;
}

.dd-sortablehandle {
	color: whitesmoke !important;
}

.sheet-spell-level .sheet-label {
	color:hsl(0,0%,75%) !important;
}

.sheet-spellcard.btn.ui-draggable {
	background-color:transparent !important;
}

.nav-tabs {
	border-color:hsl(0,0%,47%) !important;
}

.nav-tabs>.active>a,
.nav-tabs>.active>a:hover {
	background-color: transparent !important;
	border-color:transparent !important;
}

.nav-tabs a:hover,
.nav-tabs a:hover {
	background-color: transparent !important;
	border-color:hsl(0,0%,100%) !important;
	border-bottom: 1px solid hsl(0,0%,100%) !important;
	color:hsl(0,0%,80%) !important;
}

.inlinerollresult {
	margin: 3px !important;
}

.sheet-rolltemplate-npc,
.sheet-rolltemplate-npcaction .sheet-container,
.sheet-rolltemplate-npcatk {
	width: 180px;
	margin-top: 5px;
}

.sheet-desc span.inlinerollresult {
	padding-top: 5px !important;
	padding-bottom: 5px !important;
    line-height: 1.5em !important;
}

color: #a11504 !important;

.sheet-savedc span.inlinerollresult {
	padding: 4px !important;
}

.sheet-savedc > span,
.sheet-save .sheet-label > span,
.sheet-rolltemplate-simple .sheet-label > span,
.message .sheet-rolltemplate-simple .sheet-header > span,
.message .sheet-rolltemplate-npc .sheet-header, [name=\'roll_npc_dex\'] > span:first-child,
[name=\'roll_npc_str\'] > span:first-child, [name=\'roll_npc_cha\'] > span:first-child,
[name=\'roll_npc_wis\'] > span:first-child, [name=\'roll_npc_int\'] > span:first-child,
[name=\'roll_npc_con\'] > span:first-child, [type=\'roll\'], [name=\attr_npcd_name\] {
	color: var(--accent-color) !important;
	border-color:hsl(0,0%,50%) !important;
}

.textchatcontainer a{
background-color: #1a1a1a !important;
}

#textchat .message {
	padding-top: 3px;
}

#textchat > div.content > div.message.general div{
background-color: #1a1a1a !important;
}

.message.general {
	overflow-x: hidden;
	height: 31px;
}

#imagedialog #librarysearchroot .googleresult {
	background-color:hsl(0,0%,10%) !important;
}

#imagedialog #librarysearchroot .marketplacead {
	background-color:hsl(0,0%,10%) !important;
}

#imagedialog #librarysearchroot .expandsearch {
	background-color:hsl(0,0%,10%) !important;
}

#imagedialog #librarysearchroot .alert.orange {
	background-color:hsl(0,0%,10%) !important;
	color:hsl(0,0%,80%) !important;
	border-color:transparent !important;
	text-shadow:none !important;
}

.sheet-arrow-right {
	border-color: hsl(0,0%,0%) !important;
	border-top: 2px solid !important;
	border-bottom: 0px transparent !important;
	padding-bottom: 4px !important;
	color: black !important;
	border-left: none !important;
}

.sheet-italics {
	color:hsl(0,0%,70%) !important;
}

.sheet-bold {
	color:hsl(0,0%,90%) !important;
}

.sheet-damagetemplate > .sheet-result:not(:last-child) {
	border-bottom: 1px solid hsl(0,50%,50%);
}

.sheet-rolltemplate-atkdmg .sheet-damagetemplate .sheet-result,
.sheet-rolltemplate-dmg .sheet-damagetemplate .sheet-result {
	padding-bottom: 5px;
}

.sheet-action sheet-compendium-drop-target ui-droppable {
	color:hsl(0,0%,80%);
}

.charsheet .sheet-attacks .sheet-options-flag:checked + span,
.charsheet .sheet-spell .sheet-options-flag:checked + span,
.charsheet .sheet-tool .sheet-options-flag:checked + span,
.charsheet .sheet-npc .sheet-npc_options-flag:checked + span,
.charsheet .sheet-trait .sheet-options-flag:checked + span,
.charsheet .sheet-action .sheet-options-flag:checked + span,
.charsheet .sheet-equipment .sheet-inventorysubflag:checked + span,
.charsheet .sheet-core .sheet-textbox .sheet-options-flag:checked + span,
.charsheet .sheet-core .sheet-complex .sheet-options-flag:checked + span,
.charsheet .sheet-core .sheet-header .sheet-options-flag:checked + span,
.sheet-rolltemplate-5e-shaped a[href^='!'],
.sheet-rolltemplate-5e-shaped a[href^='~'] {
	color: var(--accent-color) !important;
}

.keywords,
#player_displayname,
#videobroadcasttype,
#videoreceivetype,
#videoplayersize,
#videoplayerlocation,
.videotech,
#videobandwidth,
#movablevideo,
#globalvolume,
#decksize {
	background-color:hsl(0,0%,10%) !important;
	color:hsl(0,0%,75%) !important;
}

.sheet-rolltemplate-spell {
	margin-top: 10px;
}

.sheet-tab-button.sheet-core,
.sheet-advantagetoggle {
	margin-top: 1px !important;
}

.avatar {
	margin-top: 1px;
}

.charsheet .sheet-advantagetoggle input[type=radio]:checked + span,
.charsheet input[type=radio].sheet-tab-button:checked + span {
	background-color: var(--accent-color) !important;
	color:hsl(0,0%,0%) !important;
}

.charsheet .sheet-body {
	margin-top: 25px !important;
}

.charsheet .repcontrol .repcontrol_add:before {
	background-color:hsl(122,46%,54%) !important;
	margin-right: 5px;
}

.charsheet .repcontrol .repcontrol_edit:after {
	background-color:hsl(30,90%,59%) !important;
	margin-left: 5px;
}

.ui-dialog .charsheet input[type=number] {
	width: 3.5em;
	background-color:transparent !important; //FIXES USES ON CHARACTER SHEET
	color:hsl(0,0%,96%) !important;
}

.charsheet .sheet-header .sheet-header-info select {
	padding-left: 5px !important;
	padding-right: 5px !important;
}

.charsheet .sheet-cantrips > .sheet-label {
	color:hsl(0,0%,96%) !important;
	font-weight: 300 !important;
}

input[name=\attr_gp\] {
	color:hsl(51,100%,50%) !important;
}

input[name=\attr_pp\] {
	color:hsl(40,5%,89%) !important;
}

[type=\'roll\'] > span, .sheet-attr {
	color:hsl(0,0%,100%) !important;
}

input[name=\attr_sp\] {
	color:hsl(0,0%,75%) !important;
}

input[name=\attr_cp\] {
	color:hsl(29,57%,46%) !important;
}

.attributesabilities .abil {
	background-color: transparent !important;
}


[name=\roll_death_save\], [name=\roll_hit_dice\]  {
	color:hsl(0,0%,100%) !important;
}

[name=\attr_ac\], [name=\attr_initiative_bonus\], [name=\attr_speed\] {
	color:hsl(0,0%,100%) !important;
}

.sheet-label {
	color:hsl(0,0%,80%);
}

#floatingtoolbar #measure:not(.activebutton) > img {
	-webkit-filter: brightness(3) !important;
}

.sheet-wide {
	color:hsl(0,0%,90%) !important;
}

.ui-dialog-buttonset button[type='button'],
.ui-dialog-buttonset > button,
.r20es-dialog .btn {
background-color: #1a1a1a !important;
color: hsl(0,0%,80%) !important;
border: 1px solid black !important;
line-height: 18px;
border-radius: 4px !important;
padding: 4px 10px 4px !important;
box-shadow: inset 0 1px 0 rgba(255,255,255,0.2),0 1px 2px rgba(0,0,0,0.05) !important;
}

.ui-dialog .btn:not(.sheet-wrapper-button):hover,
.ui-dialog-buttonset button[type='button']:hover,
.ui-dialog-buttonset > button:hover {
    background-color: hsl(0,0%,20%) !important;
    color: white !important;
}

li.handout.compendium-item .namecontainer {
box-shadow: none !important;
}


#measure.activebutton > img {
-webkit-filter: brightness(0) !important;
}

#measure:not(.activebutton) > img {
opacity: 1 !important;
-webkit-filter: brightness(2.5) !important;
}

.searchbox > input,
.content > #player-search,
#compendium > .searchbox span input {
background-color: hsl(0,0%,30%) !important;
color: hsl(0,0%,0%) !important;
}

.tools-list .tool-row:nth-child(2n+1),
table.config-table tbody tr:nth-child(2n+1) {
background-color: hsl(0,0%,20%) !important;
}

.charsheet .sheet-death-saving-throws-proficiency-wrapper .sheet-round-checkbox-wrapper span {
background-color: #1a1a1a;
}
.dd-handle {
color: transparent !important;
background-color: #444 !important;
}

#secondary-toolbar {
background-color:#222 !important;
}

#secondary-toolbar li{
border-right: 1px solid #000 !important;
}

#measure_sticky_clear {
background-color: #111 !important;
border-color: black !important;
}

.dd-list .journalitem .name, .dd-list .library-item .name {
position: static !important;
}

#textchat .message.you {
	color:hsl(0,0%,80%)!important;
	background-color: #1a1a1a !important;
}

#textchat .message.emote {
	background-color: #303030 !important;
}

#textchat .message.private,
.charsheet .sheet-gm-info-block,
.charsheet .sheet-gm-info-flex,
.charsheet .sheet-gm-info-inline-block,
.sheet-rolltemplate-5e-shaped .sheet-gm-info-block,
.sheet-rolltemplate-5e-shaped .sheet-gm-info-flex,
.sheet-rolltemplate-5e-shaped .sheet-gm-info-inline-block {
	background-color: #303030 !important;
}

.dd-item.handout .dd-content .redactor_editor > .name {
	background-color:hsl(0,0%,20%) !important
}
li.search-choice {
background-color: #333 !important;
background-image: linear-gradient(#444444 20%,#404040 50%,#383838 52%,#3e3e3e 100%) !important;
color: #ccc !important;
}

.textboxlist-bit-box {
background: #223 !important;
}

.textboxlist-bits {
border: 1px solid #000 !important;
}

.chosen-container-multi .chosen-choices {
border: 1px solid #000 !important;
}

.textboxlist-autocomplete-placeholder, .textboxlist-autocomplete-results {
opacity: 1 !important;
filter: alpha(opacity=100) !important;
background: #111 !important;
-webkit-box-shadow: 0 3px 3px #222 !important;
-moz-box-shadow: 0 3px 3px #222 !important;
box-shadow: 0 3px 3px #222 !important;
}

.redactor_editor.content {
	background-color: hsl(0,0%,10%) !important;
}

.note-editor span[style*='color: rgb( 0 , 0 , 0 )'],
.note-editor span[style*='color: rgb( 66 , 66 , 66 )'] {
    color: hsl(0,0%,75%) !important;
}

.note-editor.note-frame .note-editing-area .note-editable {
color: inherit !important;
}

.note-editor .panel-default > .panel-heading {
background-color: #2a2a2a !important;
border-color: #111 !important;
}

.handouteditor .dropbox,
.note-statusbar > .note-resizebar {
background-color: #111 !important;
}

.note-editor.note-frame {
border: 1px solid #000 !important;
}

#containerdiv,
.redactor_box, .redactor_editor, .redactor_editor:focus, div[contenteditable], div[contenteditable]:focus {
	background: #1a1a1a !important;
}

.charactereditor .avatar {
background-color: #1a1a1a !important;
}

.folderroot .dd-content {
	border-top: 1px solid hsl(0,0%,30%) !important;
}

img[src='/images/handout.png'] {
	content: url('https://i.imgur.com/zM79lGs.png')!important;
}

img[src='/images/character.png'] {
	content: url('https://i.imgur.com/nZ5EHJd.png')!important;
}

.dd-item .playerdots {
background-color: transparent !important;
}

.chosen-container-multi .chosen-choices {
background-color: #1a1a1a !important;
background-image: none !important;
}

.textboxlist-bit-editable {
    border: 1px solid #aaaaaa !important;
}

.anm-edit__gui-row-name {
    color: black !important;
    -webkit-text-stroke: 0px rgb(85, 85, 85) !important;
}

.anm-edit__gui-row {
    border: 1px solid hsl(0,0%,30%) !important;
}

.anm-edit__gui-row:nth-child(2n) {
    background: hsl(0,0%,20%) none repeat scroll 0% 0% !important;
}

.anm-edit__gui-row .flex-v-center div input,
anm-edit__gui-row .flex-v-center div button {
    height: 24px !important;
}

.anm-win {
}

.charactereditor .avatar,
.artr__side {
    background-color: #1a1a1a !important;
}

.artr__item,
.artr__item__top,
.artr__item__bottom {
    background-color:#222 !important;
}

.artr__side__tag_header,
.artr__side__head,
.artr__side__tag_grid,
.artr__search {
    background-color:hsl(0,0%,10%) !important;
    border-bottom: 1px solid black !important;
}

.artr__side__tag[data-state="1"] {
	background-image: linear-gradient(#2a2a2a, #337ab7) !important;
}

.artr__side__tag[data-state="2"] {
	background-image: linear-gradient(#2a2a2a, #8a1a1b) !important;
}

.artr__main .artr__view_inner,
.artr__main .artr__view {
background-color: hsl(0,0%,10%) !important;
}

.charsheet {
background: #1a1a1a !important;
}
[type='roll'] > span, .sheet-attr, .sheet-bold span {
color: hsl(0,0%,80%) !important
}

.charsheet .sheet-pseudo-button-wrapper > span {
color: hsl(0,0%,90%) !important;
background-color: #444 !important;
}

.charsheet .sheet-pseudo-button-wrapper input[type='radio']:checked + span,
.charsheet .sheet-pseudo-button-wrapper.sheet-visible-button > span[class='sheet-small-label'],
.charsheet .sheet-pseudo-button-wrapper input[type='radio']:checked + span[class='sheet-pc sheet-bold'],
.charsheet .sheet-pseudo-button-wrapper input:checked + span,
.charsheet .sheet-spells .sheet-pseudo-button-wrapper input:checked + span[class='sheet-bold'],
.charsheet div .sheet-pseudo-button-wrapper input[value='settings']:checked + span[class='sheet-pictos'],
.charsheet .sheet-pseudo-button-wrapper input[type='radio']:checked ~ span[class='sheet-npc sheet-bold'],
.charsheet .sheet-pseudo-button-wrapper.sheet-visible-button > input[name$='_rest'] + span {
background-color: #313b92 !important;
}

.sheet-shaped-row .sheet-toggle-edit-mode + span {
background-color: transparent !important;
}

.charsheet .sheet-section-npc .sheet-top-stats {
color: #a1311d !important;
}

.charsheet .sheet-round-checkbox-wrapper input:checked + .sheet-pseudo-circle,
.charsheet .sheet-skill-proficiency[value='proficient'] + span {
background-color: #64b342 !important;
}

.charsheet .sheet-bubble-radio-clear[value='0'] + span.sheet-bubble-clear{
background-color:#1a1a1a !important
}

.charsheet .sheet-round-checkbox-wrapper .sheet-pseudo-circle,
.charsheet .sheet-bubble {
border: 1px solid #444 !important;
}

.charsheet .sheet-wrap-box-title {
text-shadow: none !important;
}

.charsheet .sheet-inspiration-label [type='checkbox']:checked + span {
background: url('http://imgsrv.roll20.net/?src=i.imgur.com/o20JTtU.png') center center no-repeat !important;
-webkit-filter: invert(80%)
}
.charsheet .sheet-gray-background-wrapper {
background-color: #333 !important;
}

.sheet-hit-dice, .sheet-death-saving-throws, .sheet-rest, .sheet-heart, .sheet-shield, .sheet-initiative, .sheet-speed {
background-color: #333 !important
}

.ui-dialog .charsheet .sheet-shaped-row input[type='number'] {
color: hsl(0,0%,80%) !important;
}

.charsheet span[class^='sheet-toggle-'] {
background-color: #444 !important
}

.charsheet .sheet-spells input[type='checkbox']:not(.sheet-options-flag):checked + span:not(.sheet-pictos),
.charsheet .sheet-spells .sheet-prepared-matters input:checked + span,
.charsheet .sheet-spells input.sheet-toggle-concentration:checked + span.sheet-toggle-concentration,
.charsheet .sheet-spells input.sheet-toggle-ritual:checked + span.sheet-toggle-ritual,
.charsheet .sheet-spells input[class^='sheet-toggle-filter']:checked + span[class^='sheet-toggle-filter'],
.charsheet .sheet-spells input[class^='sheet-toggle-spells-filter']:checked + span[class^='sheet-toggle-spells-filter'],
.charsheet .sheet-spells input[type='checkbox']:checked + span[data-i18n='RITUAL'] {
background-color: #591209 !important;
}

.charsheet .sheet-spells input[type='checkbox'] + span {
background-color: #444 !important;
}



.charsheet .sheet-bubble {
    background-color: #444 !important;
}

.charsheet .sheet-bubble-radio-clear:checked ~ .sheet-bubble-radio + .sheet-bubble,
.charsheet .sheet-bubble-radio:checked ~ .sheet-bubble-radio + .sheet-bubble {
    background-color: #1a1a1a !important;
}

button[name^='roll_shaped_coinage'] {
    background-color: transparent !important;
}

.charsheet label[class^='sheet-slide-toggle-'] {
    box-shadow:none !important;
}

.charsheet .sheet-section-settings .sheet-wrap-box {
    background-color: #1a1a1a !important;
}

.charsheet .sheet-zebra-rows .sheet-shaped-row:nth-child(2n),
.sheet-rolltemplate-5e-shaped .sheet-zebra {
    background-color: #242424 !important;
}

.ui-dialog .charsheet .repcontainer .repitem .itemcontrol {
    background-color: rgba(120,120,80,0.40) !important;
}

.charsheet .sheet-classes-select-wrapper {
    background: #1a1a1a !important;
}

.charsheet .sheet-spells-wrap .sheet-spells > button.btn.ui-draggable[name='roll_shaped_spell_dc'],
.charsheet .sheet-spells-wrap .sheet-spells > button.btn.ui-draggable[name='roll_shaped_spell_attack'] {
    background-color: transparent !important;
}

.sheet-rolltemplate-5e-shaped .sheet-rt-content {
color:hsl(0,0%,80%) !important;
}

.sheet-rolltemplate-5e-shaped .sheet-rt-title {
color: #a11504 !important
}

.charsheet .sheet-shaped-row div span.sheet-heading {
background-color: transparent !important;
}

.charsheet .sheet-section-npc .sheet-npc-content-wrap {
background:#1a1a1a repeat !important;
}

.charsheet .sheet-character-name {
background: url('http://imgsrv.roll20.net/?src=gistcdn.githack.com/RedReign/17bf440add2e0cdb5a6c9395961d272d/raw/8c2b58046ddde9e09d761c3c53d344e2f6d6b35f/nameRibbon.svg') no-repeat !important;
}

.charsheet .sheet-character-header {
background: url('http://imgsrv.roll20.net/?src=gistcdn.githack.com/RedReign/9514856f2d94e236e6614837cc0a3c26/raw/3a0ea72082aa81ee145d6c327994e23ffe72a83c/topRibbonBackground.svg') no-repeat !important;
}

.charsheet .sheet-pointy-end-box-bottom-left, .charsheet .sheet-pointy-end-box-bottom-right, .charsheet .sheet-pointy-end-box-top-left, .charsheet .sheet-pointy-end-box-top-right {
background: url('http://imgsrv.roll20.net/?src=gistcdn.githack.com/RedReign/c245d2673c0c466e4d99a157ad3c6a78/raw/1900f19c90dfd932c64177eed5d04cb0cc5f079f/pointyEndBoxCorner.svg') no-repeat !important;
}

.charsheet .sheet-pointy-end-box-expand-bottom, .charsheet .sheet-pointy-end-box-expand-top {
background: url('http://imgsrv.roll20.net/?src=gistcdn.githack.com/RedReign/d6c1be48e337fece14f2350d84730caf/raw/a298e60d99cfd43270bbeafeca1859fe4ef29593/pointyEndBoxExpandTop.svg') repeat-x !important;
}

.charsheet .sheet-pointy-end-box-expand-left, .charsheet .sheet-pointy-end-box-expand-right {
background: url('http://imgsrv.roll20.net/?src=gistcdn.githack.com/RedReign/a0ecf0168d1d9e909d127714fe5f4068/raw/024f2e0f366b6a5ce3eb828e91068cf483b8b90b/pointyEndBoxSideExpand.svg') left repeat-y !important;
}

.charsheet .sheet-right-ribbon {
background: url('http://imgsrv.roll20.net/?src=gistcdn.githack.com/RedReign/17f52b1c4f990cff3bf04c1ca14426e1/raw/c05dc454460d84b752b8c8841333f5f85d928094/rightRibbon.svg') no-repeat !important;
}

.charsheet .sheet-inspiration {
background: url('http://imgsrv.roll20.net/?src=gistcdn.githack.com/RedReign/5df74f374d39064c79790bba913c462a/raw/cb7a46e757ae6aad8f3383c2269d8e3a4b444f37/inspiration.svg') no-repeat !important;
}

.charsheet .sheet-very-boring-box-bottom-left, .charsheet .sheet-very-boring-box-bottom-right, .charsheet .sheet-very-boring-box-top-left, .charsheet .sheet-very-boring-box-top-right {
background: url('http://imgsrv.roll20.net/?src=gistcdn.githack.com/RedReign/a669b42284ba13ceeb4d5d1d4850b0d7/raw/ab40b145a497fddc5246b11ac22e6786f7971aa8/veryBoringBoxCorner.svg') no-repeat !important;
}

.charsheet .sheet-very-boring-box-expand-bottom, .charsheet .sheet-very-boring-box-expand-top {
background: url('http://imgsrv.roll20.net/?src=gistcdn.githack.com/RedReign/01e52f5edeea446319b96bf2e21e6723/raw/fa8e5ac2ccd63ffa7a82d7f183e26234efde55d5/veryBoringBoxLineBottomExpand.svg') repeat-x !important;
}

.charsheet .sheet-very-boring-box-expand-left, .charsheet .sheet-very-boring-box-expand-right {
background: url('http://imgsrv.roll20.net/?src=gistcdn.githack.com/RedReign/1441163b95e39a7aa9e4cb0b387eb536/raw/247464bd86f8b2d767413e902a79cb36bd742dff/veryBoringBoxLineExpand.svg') repeat-y !important;
}

.charsheet .sheet-abilities-background {
background: url('http://imgsrv.roll20.net/?src=gistcdn.githack.com/RedReign/095e81e22e2394519fff623894d4e257/raw/23590048548cd1ed67f993350a00dd031f38c47b/abilityBackgroundEnd.svg') center top no-repeat,url('http://imgsrv.roll20.net/?src=gistcdn.githack.com/RedReign/87436c1c4cdd24af9cf5b20d9079748a/raw/da1e96f25151a6eef9af6e815309b8a50ca29f96/abilityBackgroundEndBottom.svg') center bottom no-repeat,#333 !important;
}

.charsheet .sheet-ability-wrapper {
background: url('http://imgsrv.roll20.net/?src=gistcdn.githack.com/RedReign/57a9b42ab7b021fb2697b775b313a2a9/raw/4d84509e6800707db142128d418d90b345682b92/ability.svg') no-repeat !important;
}

.charsheet .sheet-shield {
background: #333 url('http://imgsrv.roll20.net/?src=gistcdn.githack.com/RedReign/0b95c6cdcaec13307e4f00d7bd3205f2/raw/5877203d71ac280e988e43abf27fdaceeefce836/ac.svg') no-repeat !important;
}

.charsheet .sheet-heart {
background: url('http://imgsrv.roll20.net/?src=gistcdn.githack.com/RedReign/e24e1aaf31d9a4c23960414afad1145b/raw/a8f266bbbf9408f91b7b9f50dfa5cff41463968c/heart.svg') no-repeat !important;
}

.charsheet .sheet-gray-background-bottom-left, .charsheet .sheet-gray-background-bottom-right, .charsheet .sheet-gray-background-top-left, .charsheet .sheet-gray-background-top-right {
background: url('http://imgsrv.roll20.net/?src=gistcdn.githack.com/RedReign/e36989cf8004ae96734de8330375a810/raw/8470eb7d7b3f4771f429f7d22b6d50525966a735/grayBackgroundCorner.svg') no-repeat !important;
}

.sheet-heart button {
background-color: transparent !important;
}

.charsheet .sheet-death-saving-throws, .charsheet .sheet-hit-dice, .charsheet .sheet-initiative, .charsheet .sheet-rest, .charsheet .sheet-speed {
background: url('http://imgsrv.roll20.net/?src=gistcdn.githack.com/RedReign/cef80b44113b2b25d6a563861ef54275/raw/b1219d2ba4a3f721df88e4a4aea5790b412bb05c/box.svg') no-repeat !important;
}

.charsheet .sheet-indented-box-horizontal-bottom-left, .charsheet .sheet-indented-box-horizontal-bottom-right, .charsheet .sheet-indented-box-horizontal-rounded-bottom-left, .charsheet .sheet-indented-box-horizontal-rounded-bottom-right, .charsheet .sheet-indented-box-horizontal-rounded-bottom-top-left, .charsheet .sheet-indented-box-horizontal-rounded-bottom-top-right, .charsheet .sheet-indented-box-horizontal-top-left, .charsheet .sheet-indented-box-horizontal-top-right {
background: url('http://imgsrv.roll20.net/?src=gistcdn.githack.com/RedReign/7802ae10fa22c302eb173ead628c83e1/raw/0aabdf83a688dcadb5979edadfd359670102c856/indentedBoxHorizontalCorner.svg') no-repeat !important;
}

.charsheet .sheet-indented-box-horizontal-rounded-bottom-bottom-left, .charsheet .sheet-indented-box-horizontal-rounded-bottom-bottom-right, .charsheet .sheet-indented-box-horizontal-rounded-top-left, .charsheet .sheet-indented-box-horizontal-rounded-top-right {
background: url('http://imgsrv.roll20.net/?src=gistcdn.githack.com/RedReign/92c7126f6400f44fed1e3cfe18814693/raw/0c708896da0a0c16f83fd29b97a4fa351cda0e18/indentedBoxHorizontalRoundedTopCorner.svg') no-repeat !important;
}

.charsheet .sheet-indented-box-horizontal-expand-bottom, .charsheet .sheet-indented-box-horizontal-expand-top, .charsheet .sheet-indented-box-horizontal-rounded-bottom-expand-bottom, .charsheet .sheet-indented-box-horizontal-rounded-bottom-expand-top, .charsheet .sheet-indented-box-horizontal-rounded-expand-bottom, .charsheet .sheet-indented-box-horizontal-rounded-expand-top,
.charsheet .sheet-indented-box-horizontal-rounded-bottom-expand-left, .charsheet .sheet-indented-box-horizontal-rounded-bottom-expand-right, .charsheet .sheet-indented-box-horizontal-rounded-expand-left, .charsheet .sheet-indented-box-horizontal-rounded-expand-right,
.charsheet .sheet-indented-box-horizontal-expand-left, .charsheet .sheet-indented-box-horizontal-expand-right {
background-color: #1a1a1a !important;
}

.charsheet .sheet-boring-box-top-left, .charsheet .sheet-boring-box-top-right,
.sheet-rolltemplate-5e-shaped .sheet-boring-box-top-left, .sheet-rolltemplate-5e-shaped .sheet-boring-box-top-right {
background: url('http://imgsrv.roll20.net/?src=gistcdn.githack.com/RedReign/fab3aa13509f03ee01b42964993a5588/raw/81b4a1a231bf7b33bdf5d48367bc0b8fcdb3b5cc/boringBoxTopCornerWhite.svg') no-repeat !important;
}

.charsheet .sheet-boring-box-expand-bottom, .charsheet .sheet-boring-box-expand-top,
.sheet-rolltemplate-5e-shaped .sheet-boring-box-expand-bottom, .sheet-rolltemplate-5e-shaped .sheet-boring-box-expand-top {
    background: #1a1a1a url('http://imgsrv.roll20.net/?src=gistcdn.githack.com/RedReign/a63fee182682ed9f41a8e35954cbd35f/raw/cdb0c1a5947549633aa106df9015b9a50e488698/boringBoxTopBottomExpandWhite.svg') repeat-x !important;
}
.sheet-rolltemplate-5e-shaped .sheet-boring-box-expand-bottom {
    transform: scaleY(-1) scaleX(1.05) !important;
}

.charsheet .sheet-boring-box-expand-left, .charsheet .sheet-boring-box-expand-right,
.sheet-rolltemplate-5e-shaped .sheet-boring-box-expand-left, .sheet-rolltemplate-5e-shaped .sheet-boring-box-expand-right {
background: url('http://imgsrv.roll20.net/?src=gistcdn.githack.com/RedReign/ca1db5c4e2e117b7501f390198f2760b/raw/510b4fcf14727a574d2b26ceaa238c5a34407bea/boringBoxSideExpandWhite.svg') repeat-y !important;
}

.charsheet .sheet-boring-box-bottom-left, .charsheet .sheet-boring-box-bottom-right,
.sheet-rolltemplate-5e-shaped .sheet-boring-box-bottom-left, .sheet-rolltemplate-5e-shaped .sheet-boring-box-bottom-right {
background: url('http://imgsrv.roll20.net/?src=gistcdn.githack.com/RedReign/0bf33662756f948ed17fcc49aa9cf908/raw/8b37d710faa267102508f8adefb0a60fd47ca08c/boringBoxBottomCornerWhite.svg') no-repeat !important;
}

.charsheet .sheet-modifier-long {
background: url('http://imgsrv.roll20.net/?src=gistcdn.githack.com/RedReign/97f47eeab64b20a9bb6c96c0be676fc5/raw/f5a240e73953285bfd9e3bff40b46d9241424ba8/modifierLong.svg') no-repeat !important;
}

.charsheet .sheet-modifier-short {
background: url('http://imgsrv.roll20.net/?src=gistcdn.githack.com/RedReign/7e006f6645f31f0e785e93ecf5c6d4f0/raw/c944f70f1669619b11367ca89bf9894804f7ccf7/modifierShort.svg') no-repeat !important;
}

.charsheet .sheet-spell-level-title-background-left-no-number, .charsheet .sheet-spell-level-title-background-right {
background: url('http://imgsrv.roll20.net/?src=gistcdn.githack.com/RedReign/d36565260acd415583c935b1bd9a1b76/raw/c494b45fd6478592ef53d4c7c1617693a9df8344/spellcastingTitleRight.svg') no-repeat !important;
}

.charsheet .sheet-spell-level-title-background-expand {
background: url('http://imgsrv.roll20.net/?src=gistcdn.githack.com/RedReign/bc92bb122820840be2883a930a3a178c/raw/4b692304ee3860a228c60e9683af2dabd2d91052/spellcastingTitleExpand.svg') repeat-x !important;
}

.charsheet .sheet-spell-level-title-background-left {
background: url('http://imgsrv.roll20.net/?src=gistcdn.githack.com/RedReign/a188dc921c2c5bb6cae4a33b322ba7b2/raw/205ced227f5a6cb2109cdc8da12c2321fb65c709/spellcastingTitleLeft.svg') no-repeat !important;
}

.charsheet .sheet-modifier {
background: url('http://imgsrv.roll20.net/?src=gistcdn.githack.com/RedReign/53588b14e229d520daa7974051f9e42d/raw/1cf648aa6f111e1d5e380eaaaa7287555f9479c9/modifier.svg') no-repeat !important;
}

.charsheet .sheet-copper, .charsheet .sheet-silver, .charsheet .sheet-electrum, .charsheet .sheet-gold, .charsheet .sheet-platinum {
background: url('http://imgsrv.roll20.net/?src=gistcdn.githack.com/RedReign/7ddb096717c32ed8ab64478918cdf44f/raw/4ca07b33a0f792570a4690665e40299b0fb17a4e/copper.svg') no-repeat !important;
}

.charsheet .sheet-indented-box-expand-bottom, .charsheet .sheet-indented-box-expand-top,
.charsheet .sheet-max-hp-wrapper, .charsheet .sheet-temp-hp-wrapper {
background-color: #1a1a1a !important;
}

.charsheet .sheet-indented-box-expand-left, .charsheet .sheet-indented-box-expand-right, .charsheet .sheet-box-middle,
.sheet-rolltemplate-5e-shaped .sheet-box-middle {
    background-color: #1a1a1a !important;
}

.sheet-inspiration-left, .sheet-inspiration-right, .sheet-proficiency-bonus button, .sheet-shaped-version > button {
    background-color: transparent !important;
}

.sheet-shaped-version > button > span {
    text-shadow: 1px 1px #1a1a1a;
}

/* CHARSHEET MDOS */

div.sheet-licensecontainer .sheet-npc_toggle[value="1"] ~ .sheet-npc .sheet-stat-block,
div.sheet-licensecontainer .sheet-npc_toggle[value="1"] ~ .sheet-npc .sheet-actions,
div.sheet-licensecontainer .sheet-npc_toggle[value="1"] + .sheet-npcspellcastingflag[value="1"] ~ .sheet-pc .sheet-page.sheet-spells .sheet-body .sheet-col {
    background: transparent !important;
}

div.sheet-licensecontainer .sheet-container .sheet-body button.btn.ui-draggable {
    color: var(--accent-color) !important;
}

div.sheet-licensecontainer .sheet-container .sheet-body button.btn.ui-draggable:hover {
    color: #3f88e6 !important;
}

div.sheet-licensecontainer .sheet-container:not(.sheet-npc) .sheet-subcontainer .sheet-row-container input[type="checkbox"]:checked {
    background-color: #444 !important;
}

div.sheet-licensecontainer .sheet-container:not(.sheet-npc) .sheet-core .sheet-col2 {
	background: url("https://gistcdn.githack.com/RedReign/70800980c89d9a8ed2029f0136ae75f0/raw/a608c0a7f952138d35717dea053529d800f2201d/vitals.svg") !important;
}

div.sheet-licensecontainer .sheet-container:not(.sheet-npc) .sheet-attributes-container {
    background: url("https://gistcdn.githack.com/RedReign/f862ed28ee28687ea3572d3a363a373e/raw/ea2e1ee747d16f1d8aa5db70baec3e3b4befab97/abilityBack.svg") !important;
}

div.sheet-licensecontainer .sheet-container:not(.sheet-npc) .sheet-attr-container {
    background: url("https://gistcdn.githack.com/RedReign/4eaabf71e6949e781d9763acea1cdd4a/raw/8c7a7fe6b406cb8ff37e1a4624f5902d301884fb/abilitySTR.svg") !important;
}

div.sheet-licensecontainer .sheet-container:not(.sheet-npc) .sheet-insp-prof-container {
    background: url("https://gistcdn.githack.com/RedReign/8a64e22b55417338b4a55bce64e2b05e/raw/5f89a978eecb33b9b4afe355ef07d50234cae4dc/OGLinspiration.svg") no-repeat !important;
}

div.sheet-licensecontainer .sheet-container:not(.sheet-npc) .sheet-insp-prof-container + .sheet-insp-prof-container {
    background: url("https://gistcdn.githack.com/RedReign/035336cbe7d5887ed93daf3d751e8972/raw/f7f8037eb44d2c4de7a6e4b5e3236865f3adc0a9/OGLproficiencyBonus.svg") no-repeat !important;
}

div.sheet-licensecontainer .sheet-container:not(.sheet-npc) .sheet-saving-throw-container,
div.sheet-licensecontainer .sheet-container:not(.sheet-npc) .sheet-skills-container {
    border-image-source: url("https://gistcdn.githack.com/RedReign/bb3b9263161822b2e7adeca6e821ab07/raw/f76ee4ec3f8afb94f64aafa4eb3a2f727da80cbe/OGLsaves.svg") !important;
}

div.sheet-licensecontainer .sheet-container:not(.sheet-npc) .sheet-col1 > .sheet-insp-prof-container {
    background-image: url("https://gistcdn.githack.com/RedReign/e8630c5958ce244ec521ac7c2b587d64/raw/f6860c443c93d7bde76067b63a913c7baf50eb93/OGLperception.svg") !important;
}

div.sheet-licensecontainer .sheet-container:not(.sheet-npc) .sheet-tool_proficiencies {
    border-image-source: url("https://gistcdn.githack.com/RedReign/23e65423c73f9cab74a6a822e642f34f/raw/bb06f1e12c567784bef0d55353b6911cdfcbf502/OGLproficiencyBlock.svg") !important;
}

div.sheet-licensecontainer .sheet-container:not(.sheet-npc) .sheet-attacks,
div.sheet-licensecontainer .sheet-container:not(.sheet-npc) .sheet-proficiencies,
div.sheet-licensecontainer .sheet-container:not(.sheet-npc) .sheet-traits,
div.sheet-licensecontainer .sheet-container:not(.sheet-npc) .sheet-equipment,
div.sheet-licensecontainer .sheet-container:not(.sheet-npc) .sheet-exhaustion {
    border-image-source: url("https://gistcdn.githack.com/RedReign/5ee291a1048ad661e3d867aafa262af0/raw/282e8573c504f09f910b7b9e07ab0cf57a60eaa7/OGL5eBorder.svg") !important;
    border-image-slice: 6% 8% 12% 8% fill !important;
}

div.sheet-licensecontainer .sheet-container:not(.sheet-npc) .sheet-bio .sheet-textbox {
    border-image-source: url("https://gistcdn.githack.com/RedReign/5ee291a1048ad661e3d867aafa262af0/raw/282e8573c504f09f910b7b9e07ab0cf57a60eaa7/OGL5eBorder.svg") !important;
}

div.sheet-licensecontainer .sheet-container:not(.sheet-npc) .sheet-coin {
    background-image: url("https://gistcdn.githack.com/RedReign/d419f81fe11fb67e7d514a648ab0889d/raw/8f78451fb73c13ad7ee9a058866af6d0d94bd5b5/OGLgold.svg") !important;
}

div.sheet-licensecontainer .sheet-container:not(.sheet-npc) .sheet-pibf {
    border-image-source: url("https://gistcdn.githack.com/RedReign/105730a1af47e85c3e5935c9507c56f9/raw/50e7167541bd35b3cd1a77425415a2e7bc6503d3/OGLvitalTop.svg") !important;
}

div.sheet-licensecontainer .sheet-container:not(.sheet-npc) .sheet-pibf + .sheet-pibf {
    border-image-source: url("https://gistcdn.githack.com/RedReign/bea2c5787339178bf23a0b47e37693a7/raw/13ca484fa6fd74f2178d3c04f3699e2d65135649/OGLvitalMid.svg") !important;
}

div.sheet-licensecontainer .sheet-container:not(.sheet-npc) .sheet-pibf + .sheet-pibf + .sheet-pibf + .sheet-pibf {
    border-image-source: url("https://gistcdn.githack.com/RedReign/05cae179d7d3cc12fbd7ed06c3a2030e/raw/381aa6c33f83b35a63024f6de999120dec47e0b7/OGLvitalBottom.svg") !important;
}

div.sheet-licensecontainer .sheet-container:not(.sheet-npc) .sheet-hp + .sheet-hp {
    background-image: url("https://gistcdn.githack.com/RedReign/05cae179d7d3cc12fbd7ed06c3a2030e/raw/381aa6c33f83b35a63024f6de999120dec47e0b7/OGLvitalBottom.svg") !important;
}

div.sheet-licensecontainer .sheet-container:not(.sheet-npc) .sheet-subcontainer {
    background-color: transparent !important;
    border-image-source: url("https://gistcdn.githack.com/RedReign/256d7e0a1d2ab439c359a1ed638b2778/raw/67a354930c383453878f4f1570623b609262e19f/OGLvitalBox.svg") !important;
    border-image-slice: 15 15 fill !important;
}

div.sheet-licensecontainer .sheet-container:not(.sheet-npc) .sheet-ac-init-speed-container .sheet-init,
div.sheet-licensecontainer .sheet-container:not(.sheet-npc) .sheet-ac-init-speed-container .sheet-speed {
    background-image: url("https://gistcdn.githack.com/RedReign/256d7e0a1d2ab439c359a1ed638b2778/raw/67a354930c383453878f4f1570623b609262e19f/OGLvitalBox.svg") !important;
}

div.sheet-licensecontainer .sheet-container:not(.sheet-npc) .sheet-hp {
    background-image: url("https://gistcdn.githack.com/RedReign/105730a1af47e85c3e5935c9507c56f9/raw/50e7167541bd35b3cd1a77425415a2e7bc6503d3/OGLvitalTop.svg") !important;
}

div.sheet-licensecontainer .sheet-container:not(.sheet-npc) .sheet-ac-init-speed-container .sheet-ac {
    background-image: url("https://gistcdn.githack.com/RedReign/80061e42296f262830cf1438164c73b7/raw/6ff4ae5fa6a452cd36c7a3ec727ba0044c84beda/OGLac.svg") !important;
}

div.sheet-licensecontainer .sheet-container:not(.sheet-npc) .sheet-col1 .sheet-spell-level:nth-child(1) {
    background-image: url("https://gistcdn.githack.com/RedReign/5fa17678f22adceac38370f55cc424bf/raw/904f94caf9d1df8e0ccd7d861e618310cab8e4cc/OGLcantrip.svg") !important;
}

div.sheet-licensecontainer .sheet-container:not(.sheet-npc) .sheet-spell-level {
    background-image: url("https://gistcdn.githack.com/RedReign/b9abd30f611eb4b015ca6dc316aebb73/raw/02538717a79c9e715ce8354619f7b7f1851703fd/OGLspellLevel.svg") !important;
}

div.sheet-licensecontainer .sheet-container.sheet-pc .sheet-spells .sheet-header .sheet-header-info .sheet-part {
    background-image: url("https://gistcdn.githack.com/RedReign/d4585ddcf78ceb581a975d860f8d52ec/raw/ceacd6383b6cc5ecb8364c61527add0f28312ef6/OGLspellHeadBlock.svg") !important;
}

div.sheet-licensecontainer .sheet-container.sheet-pc .sheet-spells .sheet-header .sheet-header-info {
    background-image: url("https://gistcdn.githack.com/RedReign/237aa9f3dfd1b7925a1e75342906a054/raw/99dcda2e8d69b47841e241c94c1e3ed7a151e991/OGLspellBox.svg") !important;
}

div.sheet-licensecontainer .sheet-container:not(.sheet-npc) div.sheet-page.sheet-spells > div.sheet-header {
    background-image: url("https://gistcdn.githack.com/RedReign/0c0a62a7718186d7ce0f1ae45f9cf9c1/raw/24c0cfe62d18b0df01efee3c8b4d1035e097022c/OGLspellScroll.svg") !important;
}

div.sheet-licensecontainer .sheet-container:not(.sheet-npc) div.sheet-page > div.sheet-header::after {
    background-image: url("https://gistcdn.githack.com/RedReign/cf1fae61a115894ffa29ed24884928aa/raw/e78c8d6d9bb5e2c080fc2cfa74f9a90d053c09d7/OGLscrollRight.svg") !important;
}

div.sheet-licensecontainer .sheet-container.sheet-pc .sheet-header .sheet-header-info {
    background-image: url("https://gistcdn.githack.com/RedReign/73b5df43e0114ff932d0e76138bd7780/raw/94f941dfe655add03e361582d290053eb66be8a2/OGLcharBox.svg") !important;
}

div.sheet-licensecontainer .sheet-container:not(.sheet-npc) div.sheet-page.sheet-bio > div.sheet-header {
    background-image: url("https://gistcdn.githack.com/RedReign/38cfe2044172cfdf65767bfd2d3472b6/raw/d15fb90aa8e01aeb586f25496ea4552f5a1e5c08/OGLbioScroll.svg") !important;
}

div.sheet-licensecontainer .sheet-container:not(.sheet-npc) div.sheet-page.sheet-core > div.sheet-header,
div.sheet-licensecontainer .sheet-container:not(.sheet-npc) div.sheet-page.sheet-options > div.sheet-header {
	background-image: url("https://gistcdn.githack.com/RedReign/e7758f7513b818ff9427a886cffc7fed/raw/45fcf8ecb0705f3352e966ed868fd57ff7c57232/OGLcharScroll.svg") !important;
}

div.sheet-licensecontainer .sheet-body .sheet-item .sheet-subitem > span {
    background-color: hsl(0,0%,15%) !important;
}

div.sheet-licensecontainer .sheet-body .sheet-item .sheet-inventorysubflag {
    background-color: transparent !important;
}

div.sheet-licensecontainer .sheet-proficiency .sheet-display button,
div.sheet-licensecontainer .sheet-body .repcontrol .btn,
div.sheet-licensecontainer .sheet-money .sheet-coin,
div.sheet-licensecontainer .sheet-money .sheet-coin > input,
.charsheet .sheet-textbox .sheet-display .sheet-desc,
div.sheet-licensecontainer .sheet-container:not(.sheet-npc) .sheet-ac-init-speed-container .sheet-ac input,
div.sheet-licensecontainer .sheet-container:not(.sheet-npc) .sheet-ac-init-speed-container .sheet-init span,
div.sheet-licensecontainer .sheet-container:not(.sheet-npc) .sheet-ac-init-speed-container .sheet-speed input,
div.sheet-licensecontainer .sheet-header-info .sheet-part select[name="attr_spellcasting_ability"],
div.sheet-licensecontainer .sheet-container:not(.sheet-npc) .sheet-ac-init-speed-container .sheet-init > button {
    background-color: transparent !important;
}

div.sheet-licensecontainer .sheet-body .sheet-spell .sheet-options .sheet-row > span[data-i18n*="spell-component-"],
div.sheet-licensecontainer .sheet-body .sheet-spell .sheet-options .sheet-row > span[data-i18n*="ritual-u"],
div.sheet-licensecontainer .sheet-body .sheet-spell .sheet-options .sheet-row > span[data-i18n*="concentration-u"] {
	background-color: transparent !important;
}

div.sheet-licensecontainer .sheet-display button:hover,
div.sheet-licensecontainer .sheet-body .repcontrol .btn:hover,
div.sheet-licensecontainer .sheet-item:hover {
    background-color: hsl(0,0%,20%) !important;
}

.sheet-body .sheet-attr-mod .sheet-baseattr {
    background-color: transparent !important;
}

div.sheet-licensecontainer .sheet-container:not(.sheet-npc) .sheet-attr-container .sheet-attr-mod {
    border: 1px solid black !important;
}

.sheet-body .sheet-attributes-container .sheet-attr-container button {
    border: 1px solid black !important;
}

.sheet-body .sheet-attributes-container .sheet-attr-container button:hover,
div.sheet-licensecontainer .sheet-body button.btn:hover {
    color: #3f88e6 !important;
    background-color: hsl(0,0%,20%) !important;
}

div.sheet-licensecontainer .sheet-trait > .sheet-display > span.sheet-title[name*="attr_"] {
    background-color: transparent !important;
}

div.sheet-licensecontainer .sheet-trait:hover > .sheet-display > span.sheet-title[name*="attr_"] {
    color: #3f88e6 !important;
}

.sheet-rolltemplate-spell .sheet-container,
.sheet-rolltemplate-npc, .sheet-rolltemplate-npcaction .sheet-container, .sheet-rolltemplate-npcatk, .sheet-rolltemplate-npcdmg, .sheet-rolltemplate-traits {
    background: #222 url('https://i.imgur.com/n7ohb4t.png') repeat scroll left top !important;
}

.sheet-rolltemplate-spell .sheet-container span {
    color: hsl(0,0%,80%) !important;
}

.sheet-display button.sheet-spellcard .sheet-innate {
    background-color: transparent !important;
}

.charsheet .sheet-spell input[type='checkbox']:checked ~ span.sheet-prep {
background-color: var(--accent-color) !important
}

.sheet-page.sheet-core .sheet-header .sheet-name-container img {
display: block;
-moz-box-sizing: border-box;
box-sizing: border-box;
background: url(http://imgsrv.roll20.net/?src=i.imgur.com/rzVfqwl.png) no-repeat;
width: 250px; /* Width of new image */
height: 45px; /* Height of new image */
padding-left: 250px; /* Equal to width of new image */
}

.charsheet .sheet-attr-mod,
.charsheet .sheet-insp-prof-container .sheet-value {
background-color: #1a1a1a !important;
}

.charsheet .sheet-insp-prof-container .sheet-value input[type='checkbox'] ~ span {
-webkit-filter: invert(80%) !important;
}

.charsheet .sheet-level::before {
color: #111 !important;
}

.sheet-pibf .sheet-display > span[name="attr_personality_traits"],
.sheet-pibf .sheet-display > span[name="attr_ideals"],
.sheet-pibf .sheet-display > span[name="attr_bonds"],
.sheet-pibf .sheet-display > span[name="attr_flaws"],
div.sheet-licensecontainer .sheet-resources .sheet-subcontainer .sheet-label[name="attr_class_resource_name"],
div.sheet-licensecontainer .sheet-resources .sheet-subcontainer .sheet-label[name="attr_other_resource_name"] {
    background-color: transparent !important;
}

.sheet-display > span[name*='attr_'] {
    background-color: #2a2a2a !important;
}

div.sheet-licensecontainer .sheet-npc_options span {
    color: hsl(0,0%,70%) !important;
}

.charsheet .sheet-attacks .sheet-display .sheet-subheader span {
    background-color:transparent !important;
}

.sheet-trait:hover,
.sheet-item input,
.sheet-display > .sheet-title,
.sheet-display > button span[name*='attr_'],
.sheet-display > button input[name*='attr_'],
.charsheet .sheet-coin,
.charsheet div.sheet-globaldisplay,
.charsheet .sheet-pc .sheet-global-mod .sheet-options-flag:not(:checked) ~ .sheet-display .sheet-subheader {
	background-color: #2a2a2a !important;
}

.charsheet .sheet-display > button .sheet-spellname[name='attr_spellname'] {
    background-color: transparent !important;
}

.ui-dialog .btn[name='roll_spell'] {
    border-color: transparent !important
}

.repitem .sheet-spell > .sheet-options-flag[type='checkbox'] + span,
.charsheet .sheet-npc .sheet-npc_options-flag + span {
    background-color: transparent !important;
    z-index: 10 !important;
}

.repitem .sheet-spell > .sheet-options-flag[type='checkbox'],
.charsheet .sheet-npc .sheet-npc_options-flag {
    z-index: 11 !important;
}

.charsheet .sheet-npc .sheet-npc_options-flag,
.charsheet .sheet-npc .sheet-npc_options-flag + span {
    top: 10px !important;
}

.repitem .itemcontrol,
.sheet-spell-container .repitem .itemcontrol .btn {
    z-index: 12 !important;
}

.charsheet input[type='radio'].sheet-tab-button + span,
.charsheet .sheet-advantagetoggle input[type='radio'] + span {
    background-color: #666 !important;
}

div.sheet-rolltemplate-simple div.sheet-container {
    background-image: url("https://i.imgur.com/FjwWl2K.png") !important;
    background-color: transparent !important;
}

div.sheet-rolltemplate-atk div.sheet-container, div.sheet-rolltemplate-atkdmg div.sheet-container.sheet-atk, div.sheet-rolltemplate-dmg div.sheet-atk {
    background: url('https://i.imgur.com/KphynRx.png') top left round !important;
}

div.sheet-rolltemplate-dmg div.sheet-container, div.sheet-rolltemplate-atkdmg div.sheet-container.sheet-damagetemplate {
    background: url('https://i.imgur.com/g6uwvqk.png') top left round !important;
}

div.sheet-rolltemplate-atk div.sheet-desc,
div.sheet-rolltemplate-atkdmg div.sheet-desc,
div.sheet-rolltemplate-dmg div.sheet-desc,
div.sheet-rolltemplate-desc div.sheet-desc {
    background-image: url('https://i.imgur.com/5ZqDAqf.png') !important;
}

div.sheet-rolltemplate-atk div.sheet-desc.sheet-info .sheet-top,
div.sheet-rolltemplate-atkdmg div.sheet-desc.sheet-info .sheet-top,
div.sheet-rolltemplate-dmg div.sheet-desc.sheet-info .sheet-top,
div.sheet-rolltemplate-desc div.sheet-desc.sheet-info .sheet-top {
    background-image: url('https://i.imgur.com/xRbZ0nw.png') !important;
}

div.sheet-rolltemplate-atk div.sheet-desc.sheet-info .sheet-middle,
div.sheet-rolltemplate-atkdmg div.sheet-desc.sheet-info .sheet-middle,
div.sheet-rolltemplate-dmg div.sheet-desc.sheet-info .sheet-middle,
div.sheet-rolltemplate-desc div.sheet-desc.sheet-info .sheet-top {
    background-image: url('https://i.imgur.com/vhjUpjD.png') !important;
}

div.sheet-rolltemplate-atk div.sheet-desc.sheet-info .sheet-bottom,
div.sheet-rolltemplate-atkdmg div.sheet-desc.sheet-info .sheet-bottom,
div.sheet-rolltemplate-dmg div.sheet-desc.sheet-info .sheet-bottom,
div.sheet-rolltemplate-desc div.sheet-desc.sheet-info .sheet-bottom {
    background-image: url('https://i.imgur.com/N1mu4tJ.png') !important;
}

.sheet-damagetemplate > .sheet-result:not(:last-child) {
    border-bottom: 1px solid #000 !important;
}

.charsheet .sheet-charmancer .sheet-bottombar {
    border-top: 1px dashed #555 !important;
    background: hsl(0,0%,20%) !important;
}

.charsheet .sheet-charmancer button, .charsheet .sheet-charmancer button[type="roll"] {
    background-color: hsl(0,0%,40%) !important;
}

.charsheet .sheet-charmancer button.sheet-exit {
    color: #800 !important;
    border-color: #800 !important;
}

.charsheet .sheet-charmancer .sheet-steps {
    background: hsl(0,0%,20%) !important;
    border-bottom: 1px dashed #555 !important;
}

.charsheet .sheet-charmancer .sheet-hilite,{
    background: #333 !important;
}

.charsheet .sheet-charmancer .sheet-levels-hp-row {
    background: #333 !important;
    border-color: black !important;
}

.charsheet .sheet-charmancer .sheet-spell-holder label,
.charsheet .sheet-charmancer .sheet-container .sheet-spell-item:nth-child(2n) {
    background-color: #2a2a2a !important;
}

.charsheet .sheet-charmancer .sheet-asi-row .sheet-switch:empty ~ .sheet-switch-container .sheet-asi-tab,
.charsheet .sheet-charmancer .sheet-asi-row .sheet-switch:not(:empty) ~ .sheet-switch-container .sheet-feat-tab {
    background-color: #1a1a1a !important;
}

.charsheet .sheet-charmancer .sheet-lp-summary .sheet-after h2 {
    background-color: #333 !important;
}

.charsheet .sheet-charmancer .sheet-lp-summary .sheet-highlight {
    background-color: #2a2a2a !important;
}

.charsheet .sheet-charmancer .sheet-levels-hp-row .sheet-hpbylevel-toggle:checked ~ span.sheet-collapse + div > div {
    background: #2a2a2a !important;
}

.charmancer .content-text, .charmancer .content-text h1, .charmancer .content-text h2, .charmancer .content-text h3, .charmancer .content-text h4 {
    color: hsl(0,0%,75%) !important;
}

.charmancer .container {
    background-color: #1a1a1a !important;
}

.charmancer .sheet-summary:nth-child(2n) {
    background: #2a2a2a !important;
}

.charsheet .sheet-charmancer .sheet-warning {
    color: rgb(160, 25, 94) !important;
}

.r20es-dialog {
    background-color: hsl(0,0%,10%) !important;
    color:hsl(0,0%,75%) !important;
}

.r20es-dialog div {
    background-color: hsl(0,0%,10%) !important;
    color:hsl(0,0%,75%) !important;
}

.r20es-clickable-text.selected {
	background-color: hsl(0,0%,20%) !important;
}

.r20es-welcome {
    background-color: hsl(0,0%,10%) !important;
    color: hsl(0,0%,75%) !important;
}
`;
if (typeof GM_addStyle != "undefined") {
	GM_addStyle(css);
} else if (typeof PRO_addStyle != "undefined") {
	PRO_addStyle(css);
} else if (typeof addStyle != "undefined") {
	addStyle(css);
} else {

    const node = document.createElement("style");
	node.type = "text/css";
	node.innerHTML = css;

    // Note(stormy): wait for document.head to be available
    const interval = 10;
    const waitForDepts = () => {
        if(!document.head) {
            setTimeout(waitForDepts, 10);
            return;
        }

        document.head.appendChild(node);

    }
    setTimeout(waitForDepts, 10);
}
})();

//This is where i merged the roll20-fixes script By Justin Noon//
//Amazing work was done here//

(function() {
    'use strict';

//Features
var TMp = {
	clickShow: false,
	macroHide: false,
	fullButt: true,
	fixPing: "1",
	css: {
		player:	false,
		zoom: false,
		sidebar: false,
		quick: false,
		turns: false,
        error: false,
		macroTok: false,
		bigQuery: false
	},
	pfCustomAttr: true,
	splitTokName: "3",
	toolbarButt: false,
	scaleToks: false,
	statusHQ: false,
	scrollPages: '2',
    perfMode: false,
	noPopouts: false
};
try {
	GM_info;
	var stored = GM_getValue('TMp', 'nah');
	if (stored == 'nah')
		GM_setValue('TMp', JSON.stringify(TMp));
	else {
		var checkVals = function(d, s) {
			for (var k in d) {
				if (typeof d[k] !== typeof s[k])
					s[k] = d[k];
				if (typeof d[k] == 'object')
					s[k] = checkVals(d[k], s[k]);
			};
			return s;
		};
		TMp = checkVals(TMp, JSON.parse(stored));
		GM_setValue('TMp', JSON.stringify(TMp));
	}
	checkLoaded();
}
catch(err) {
	checkLoaded();
}

function checkLoaded(tried) {
    if (!tried) tried = 1;
    try {
            if (Campaign && Campaign.activePage().thegraphics && Campaign.activePage().thegraphics.models[0] && Campaign.activePage().thegraphics.models[0].view && Campaign.activePage().thegraphics.models[0].view.graphic) {
                tried = 69;
				showtime();
			}
            else
                setTimeout(checkLoaded, 1000, tried);
    }
    catch(err) {
        if (++tried < 69)
            setTimeout(checkLoaded, 1000, tried);
        else {
            console.log(err);
			console.log("Couldn't load userscript. Aborting.");
		}
    }
};

function showtime() {
//For *my* players specifically. Activates all css tweaks. I'm too lazy to maintain separate code (in-person touchpad view)
////_.each(TMp.css, (c,i,l) => l[i] = true);TMp.perfMode = true;
	//Create greasemonkey preferences menu
	try {
		GM_info;
		var prefLi = document.createElement('li');
		prefLi.id = 'showfixes';
		var prefSpan = document.createElement('span');
		prefSpan.setAttribute('class', 'pictos');
		prefSpan.appendChild(document.createTextNode('x'));
		prefLi.appendChild(prefSpan);
		prefLi.appendChild(document.createTextNode("\r\n        'Fixes' Preferences\r\n"));
		document.getElementById('helpsite').childNodes[3].childNodes[1].appendChild(prefLi);
		prefLi.addEventListener('click', promptPrefs);
        $("#helpsite").off();

		function promptPrefs(e) {
			e.stopPropagation();
			var finished = false, response, responseVal, responseMod = '', ref = TMp, counter, changeKey;
			while (!finished) {
				counter = 1;
				response = prompt(_.reduce(ref, (memo, v, k) => memo + '\n' + counter++ + ':' + k + '  ::  ' + (_.isObject(v) ? '[' + _.keys(v).length + ' properties]' : v), 'Enter a number:\n0:Back'), 'Enter a number to swap value.');
				responseVal = parseInt(response.replace(/\+/g,'').replace(/-/g,''));
				responseMod = (response.indexOf('+') != -1 ? '+' : (response.indexOf('-') != -1 ? '-' : ''));
				if (/[^0-9+-]+/.test(response) || responseVal == 0 || responseVal > counter) {
					if (ref === TMp) {
						GM_setValue('TMp', JSON.stringify(TMp));
						finished = true;
						alert('Reload to see changes');
					}
					else
						ref = TMp;
				}
				else {
					changeKey = _.keys(ref)[responseVal-1];
					if (_.isObject(ref[changeKey])) {
						if (responseMod == '!')
							_.each(ref[changeKey], (e,i) => {if (typeof e == 'boolean') ref[changeKey][i] = !e});
						else if (responseMod == '+')
							_.each(ref[changeKey], (e,i) => {if (typeof e == 'boolean') ref[changeKey][i] = true});
						else if (responseMod == '-')
							_.each(ref[changeKey], (e,i) => {if (typeof e == 'boolean') ref[changeKey][i] = false});
						else
							ref = ref[changeKey];
					}
					else if (_.isBoolean(ref[changeKey]))
						ref[changeKey] = !ref[changeKey];
					else
						ref[changeKey] = prompt('Enter a new value for ' + changeKey);
				}
			}
		}
	}
	catch (err) {
		console.log('No GM. No need for preferences.');
	}

	window.myLower = Campaign.activePage().thegraphics.models[0].view.graphic.canvas.lowerCanvasEl;
	window.myUpper = Campaign.activePage().thegraphics.models[0].view.graphic.canvas.upperCanvasEl;
	window.myMain = document.getElementById('finalcanvas');

	//Display tokenname on select
	if (TMp.clickShow) {
		var toks = [];
		var muteCallback = function(mutationsList) {
			if (currentcontexttarget) {
				for(var mutation of mutationsList) {
					if (!_.isEmpty(mutation.addedNodes)) {
						let cct = currentcontexttarget.canvas;
						let cctIt = cct.lastRenderedObjectWithControlsAboveOverlay.model.attributes;
						if (!cctIt.showname) {
							cctIt.showname = true;
							toks.push([cctIt.page_id, cctIt.id]);
						}
						cct._objects.push(cct._objects.splice(cct._objects.indexOf(cct.lastRenderedObjectWithControlsAboveOverlay), 1)[0]);
						currentcontexttarget.canvas.renderAll && currentcontexttarget.canvas.renderAll();
					}
					else if (!_.isEmpty(mutation.removedNodes)) {
						_.each(toks, tok => {if (tok[0] == Campaign.activePage().id) _.find(Campaign.activePage().thegraphics.models, tokk => tokk.attributes.id == tok[1]).attributes.showname = false});
						toks = [];
						currentcontexttarget.canvas.renderAll && currentcontexttarget.canvas.renderAll();
						Campaign.activePage().reorderByZ();
					}
				}
			}
		};
		var observer = new MutationObserver(muteCallback);
		observer.observe(document.getElementById('editor-wrapper'), {childList: true});
	}

	if (TMp.css.macroTok) {
		var macroTokCallback = function(mutationsList) {
			for (var mutation of mutationsList) {
                _.delay((mutation) => {
                    let cctIt = currentcontexttarget.canvas.lastRenderedObjectWithControlsAboveOverlay.model.attributes;
                    if (mutation.target.style.display == 'block' && cctIt.gmnotes != 'blank' && cctIt.gmnotes != '%3Cp%3Eblank%3C/p%3E')
                        _.each(document.getElementsByClassName('tokenactions')[0].firstElementChild.children, ob => ob.setAttribute('data-blank', 'false'));
                }, (typeof currentcontexttarget == 'undefined' ? 1000 : 0), mutation);
			}
		};
		var macroObserver = new MutationObserver(macroTokCallback);
		macroObserver.observe(document.querySelector('.mode.tokenactions'), {attributeFilter: ['style']});
	}

	//Allow Macros to be hidden
	if (TMp.macroHide) {
		var toggleMacro = document.createElement('div');
		toggleMacro.setAttribute('class', 'macrobox');
		var toggleButton = document.createElement('button');
		toggleButton.setAttribute('class', 'btn');
		toggleButton.appendChild(document.createTextNode('Show/Hide'));
		toggleButton.id = 'toggleMacros';
		toggleMacro.appendChild(toggleButton)
		//macrobar is defined by default
		macrobar.appendChild(toggleMacro);
		document.getElementById('toggleMacros').addEventListener('click', () => macrobar.style.left = (macrobar.style.left == '' ? (macrobar.offsetWidth * -1 + 100) + 'px' : ''));
	}

	//Create fullscreen button
	if (TMp.fullButt) {
		var fullScreenLi = document.createElement('li');
		fullScreenLi.setAttribute('tip', 'Toggle Fullscreen');
		fullScreenLi.id = 'fullscreener';
		var fullScreenSpan = document.createElement('span');
		fullScreenSpan.setAttribute('class', 'pictos');
		fullScreenSpan.appendChild(document.createTextNode('`'));
		fullScreenLi.appendChild(fullScreenSpan);
		floatingtoolbar.childNodes[1].appendChild(fullScreenLi);
		fullScreenLi.addEventListener('click', toggleFullScreen);

		function toggleFullScreen() {
			var doc = window.document;
			var docEl = doc.documentElement;

			var requestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
			var cancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

			if(!doc.fullscreenElement && !doc.mozFullScreenElement && !doc.webkitFullscreenElement && !doc.msFullscreenElement) {
			requestFullScreen.call(docEl);
			}
			else {
			cancelFullScreen.call(doc);
			}
		}
	}
	//Create Floating Toolbar button
	if (TMp.toolbarButt) {
		var ToolBar = _.filter(Campaign.players.get(d20_player_id).macros.models, m => m.attributes.name.indexOf('ToolBar') > -1);
		if (_.isUndefined(ToolBar))
			ToolBar = _.filter(_.union(..._.map(Campaign.players.models, m => m.macros.models)), m => {return m.visibleToCurrentPlayer() && m.attributes.name.indexOf('ToolBar') > -1});
		_.each(ToolBar, tb => {
			var actions = tb.attributes.action.split('\n');
			var toolBarLi = document.createElement('li');
			toolBarLi.setAttribute('tip', 'Additional Macros');
			toolBarLi.id = 'ToolBar' + (tb.attributes.name == ToolBar ? tb.id : tb.attributes.name.replace('ToolBar',''));
			toolBarLi.setAttribute('style', 'display: flex; justify-content: center; align-items: center;');
			for (var k = 0, thisAction, thisSpan, thisLi, thisA, thisODiv; k < actions.length; k++) {
				thisAction = actions[k].split('||');
				thisSpan = document.createElement('span');
				thisSpan.setAttribute('class', 'pictos');
                thisSpan.setAttribute('style', 'left: -11rem;');
				//Make sure character is supported and won't unclip out of side
				var canvas = document.createElement('canvas').getContext('2d');
				canvas.font = '22px Pictos';
				var width = canvas.measureText(thisAction[0]);
				if (width.width > 31)
					thisAction[0] = _.compact([...thisAction[0].replace(/[\u200B-\u200D\uFEFF]/g, '')]).join(' ');
				thisSpan.appendChild(document.createTextNode(thisAction[0]));
				if (k == 0) {
					toolBarLi.appendChild(thisSpan);
					var thisDiv = document.createElement('div');
					thisDiv.setAttribute('class', 'submenu');
					var thisUl = document.createElement('ul');
				}
				else {
					thisLi = document.createElement('li');
					thisA = document.createElement('a');
                    if (thisAction[2].indexOf('j:') > -1) {
                     thisA.setAttribute('href', '!');
                     thisA.onclick = eval('() => {' + thisAction[2].substr(2) + '}');
                    }
                    else
                        thisA.setAttribute('href', thisAction[2]);
					thisA.appendChild(thisSpan);
					thisODiv = document.createElement('div');
					thisODiv.appendChild(document.createTextNode(thisAction[1]));
					thisA.appendChild(thisODiv);
					thisLi.appendChild(thisA);
					thisUl.appendChild(thisLi);
				}
			}
			thisDiv.appendChild(thisUl);
			thisDiv.setAttribute('style', 'top: -' + k*20 + 'px !important;');
			toolBarLi.appendChild(thisDiv);
			floatingtoolbar.childNodes[1].appendChild(toolBarLi);
		});
	}

	//Fix Pings
	if (TMp.fixPing != "0") {
		JSON.parse2 = JSON.parse;
		JSON.parse = function(e) {
			var intercept = JSON.parse2(e), api = false;
			if (intercept.type == 'mapping') {
				if (_.isUndefined(intercept.currentLayer))
                    api = true;
                if (TMp.fixPing == "2" && intercept.player == "api") {
                    if (is_gm)
                        spoofPing(intercept);
                    Object.assign(intercept, {scrollto: false, left: -100, top: -100});
                }
                intercept.currentLayer = 'objects';
                if (intercept.pageid != Campaign.activePage().id || (api && intercept.player != "api" && intercept.player != d20_player_id))
                    Object.assign(intercept, {scrollto: false, left: -100, top: -100});
			}
			return intercept;
		};
		function spoofPing(old) {
			var paddingOffset = [], currentCanvasOffset = [];
			var canvasZoom = Math.round(document.getElementById('finalcanvas').getContext('2d').getTransform().a * 10) / 10;
			var canvasWidth = document.getElementById('finalcanvas').clientWidth, canvasHeight = document.getElementById('finalcanvas').clientHeight;
			var scaledTop = document.getElementById('editor-wrapper').scrollTop / canvasZoom, scaledLeft = document.getElementById('editor-wrapper').scrollLeft / canvasZoom;
			var pageWidth = Campaign.activePage().attributes.width * 70, pageHeight = Campaign.activePage().attributes.height * 70;
			var padding = 125;
			if (scaledLeft < padding)
				(paddingOffset[0] = padding - scaledLeft, currentCanvasOffset[0] = 0);
			else {
				if (pageWidth / canvasZoom - scaledLeft - canvasWidth / canvasZoom + padding < 0)
					(paddingOffset[0] = pageWidth / canvasZoom - scaledLeft - canvasWidth / canvasZoom + padding, currentCanvasOffset[0] = scaledLeft - padding + paddingOffset[0]);
				else
					(paddingOffset[0] = 0, currentCanvasOffset[0] = scaledLeft - padding);
			}
			if (scaledTop < padding)
				(paddingOffset[1] = padding - scaledTop, currentCanvasOffset[1] = 0);
			else {
				if (pageHeight / canvasZoom - scaledTop - canvasHeight / canvasZoom + padding < 0)
					(paddingOffset[1] = pageHeight / canvasZoom - scaledTop - canvasHeight / canvasZoom + padding, currentCanvasOffset[1] = scaledTop - padding + paddingOffset[1]);
				else
					(paddingOffset[1] = 0, currentCanvasOffset[1] = scaledTop - padding);
			}
			//var m = {left: old.left, top: old.top};
            var pos = {left: canvasZoom * (old.left - currentCanvasOffset[0]) + paddingOffset[0], top: canvasZoom * (old.top - currentCanvasOffset[1]) + paddingOffset[1]};
			var evt = new MouseEvent('mousedown', {bubbles: true, cancelable: true, composed: true, buttons: 1, shiftKey: true, clientX: pos.left, clientY: pos.top});
            var maskedArr = [];
           _.each(Campaign.activePage().thegraphics.models, m => {
               if (m.attributes.layer == 'objects' && Math.abs(m.attributes.top - old.top) <= m.attributes.height / 2 && Math.abs(m.attributes.left - old.left) <= m.attributes.width / 2) {
                   //debugger;
                   maskedArr.push([m.id, m.view.graphic.selectable]);
                   m.view.graphic.selectable = false;
               }
           });
            _.delay((e, mask) => {window.myUpper.dispatchEvent(e); _.each(mask, m => Campaign.activePage().thegraphics._byId[m[0]].view.graphic.selectable = m[1]);}, 1000, new MouseEvent('mouseup', {bubbles: true, cancelable: true, composed: true, buttons: 1, clientX: 1, clientY: 1}), maskedArr);
            return !(window.myUpper.dispatchEvent(evt));
		}
	}

	//CSS override block
	if (_.contains(TMp.css, true) || TMp.toolbarButt || TMp.statusHQ) {
		var style = document.createElement('style');
		style.type = 'text/css';
		style.innerHTML = '';
		//Remove player names/ icons
		if (TMp.css.player)
			style.innerHTML += '.player.ui-droppable {display: none;} ';
		//Remove Zoom Slider
		if (TMp.css.zoom)
			style.innerHTML += '#zoomclick {display:none;} ';
		//Remove sidebar show/ hide button
		if (TMp.css.sidebar)
			style.innerHTML += '#sidebarcontrol {display: none;} ';
		//Increase quickmenu sizes
		if (TMp.css.quick)
			style.innerHTML += '.sheet-roll-cell a{padding:.5em !important;} ';
		//Permanently hide turn order
		if (TMp.css.turns)
			style.innerHTML += 'div.ui-dialog[style*="width: 160px;"] {display: none !important;} ';
        //Hides the connection error box
		if (TMp.css.error)
			style.innerHTML += '#connectionerror {display: none !important;} ';
		//Query window input box should size to the box size
		if (TMp.css.bigQuery)
			style.innerHTML += '.ui-dialog-content.ui-widget-content > p > strong + input {width: 100% !important; width: -moz-available !important; width: -webkit-fill-available !important; width: fill-available !important;} ';
		//Hide macroTokens by default
		if (TMp.css.macroTok)
			style.innerHTML += 'button[data-type="macro"]:not([data-blank="false"]) {display: none !important;} ';
		if (TMp.statusHQ)
			style.innerHTML += '#radial-menu .markermenu .markericon {background-image: url(https://files.catbox.moe/08tmts.svg) !important;} ';
		//Fills Toolbar buttons to their spaces
			style.innerHTML += '.submenu > ul > li > a {display: inline-block; width: 100%; height: 100%; color: grey; text-align: center;} .submenu > ul > li > a:hover {text-decoration: none;} .submenu > ul > li > a > .pictos {position: relative; left: -6rem; top: .1rem;} .submenu > ul > li > a > div {position: absolute; left: 3rem; top: .5rem;}';
		document.getElementsByTagName('head')[0].appendChild(style);
	}

	//Popouts and/ or dialogs create browser-behavior tabs instead of forced popups. 1 for just characters, 2 for everything.
	if (TMp.noPopouts) {
		unsafeWindow._open = unsafeWindow.open;
		if (TMp.noPopouts == 1)
			unsafeWindow.open = function(a,b,c) {if (a == "/editor/popout") return unsafeWindow._open(a, b); else return unsafeWindow._open(a,b,c);};
		else
			unsafeWindow.open = function(a,b,c) {return unsafeWindow._open(a, b);};
	}

	//Character sheets display custom attributes as name
	if (TMp.pfCustomAttr) {
		function cssInjection(charId) {
			var list = [1,2,3,10,11,12];
			var head = 'div.dialog.characterdialog[data-characterid=' + charId + '] {', foot = '';
			_.each(list, function(cK) {
				cK = 'customa' + cK;
				let val = {};
				if (!_.isUndefined(val = _.find(Campaign.characters._byId[charId].attribs.models, at => at.attributes.name == cK + '-name')))
					head += `--${cK}: "${val.attributes.current}"; `
				foot += `input[title="@{buff_${cK}-total}"] + span {visibility: hidden; top: -1.2rem;} input[title="@{buff_${cK}-total}"] + span::after {content: var(--${cK}, "${cK}"); visibility: visible; display: block;} `
			});
			return [head + '} ', foot];
		}
		function newShow(that) {
			var customOver;
			var modCss = cssInjection(that.model.attributes.id);
			if (_.isNull(document.getElementById('customOver'))) {
				customOver = document.createElement('style');
				customOver.type = 'text/css';
				customOver.id = 'customOver';
				customOver.innerHTML = modCss[1];
			}
			else {
				customOver = document.getElementById('customOver');
			}
			customOver.innerHTML += (modCss[0].indexOf('{}') > -1 ? '' : modCss[0]);
			if (that.childWindow) {
				_.delay(function() {customOver.innerHTML = modCss.join(' '); that.childWindow.document.getElementsByTagName('head')[0].appendChild(customOver)}, 4000);
			}
			else
				document.getElementsByTagName('head')[0].appendChild(customOver);
		};

		_.each(Campaign.characters.models, ch => {ch.view.showDialog2 = ch.view.showDialog; ch.view.showDialog = function(e, t) {this.showDialog2(e, t); newShow(this)}});
		_.each(Campaign.characters.models, ch => {ch.view.showPopout2 = ch.view.showPopout; ch.view.showPopout = function(e, t) {this.showPopout2(e, t); newShow(this)}});
		//Bookmarklet check then process active child windows
		if (typeof unsafeWindow == 'undefined')
			_.each(window.allChildWindows, win => {newShow(Campaign.characters._byId[win.document.getElementsByClassName('dialog characterdialog')[0].getAttribute('data-characterid')].view)});
	}

	//Tokens auto split their name to multiple lines
	if (TMp.splitTokName != "0") {
        var newFill = function(x, y, w, h) {
            if (this.font != 'bold 14px Arial' || this.fillStyle.replace(/ /g,'').indexOf('rgba(255,255,255,0.5') == -1)
                this.fillRect2(x, y, w, h);
            else if (this.fillText != this.newText)
                this.fillText = this.newText;
            //Note to self: Find where they're resetting this and stop it. A lot of wasted cycles for this.
        };
        var newText = function(t, x, y, m) {
            if (this.font != 'bold 14px Arial' || this.fillStyle != '#000000')
                this.fillText2(t, x, y, m);
            else if (this.canvas == window.myUpper)
                return;
            else {
                var g = 14, r = y - 22, n = m, max = parseInt(TMp.splitTokName), forced, tmpFix = 3;
                var texes = t.toString().split(' ');
                for (var k = 0; k < texes.length; k++) {
                    while ((this.measureText(texes[k] + ' ' + texes[k+1]).width < r*2 || k >= max - 1) && k+1 < texes.length ) {
                        texes[k] += ' ' + texes[k+1];
                        texes.splice(k+1, 1);
                    }
                    if (texes[k].indexOf('\\n') > -1) {
                        forced = texes[k].split('\\n');
                        texes[k] = forced.shift();
                        texes.splice(k+1, 0, ...forced);
                    }
                    texes[k] = texes[k].replace(/_/g, ' ');
                    n = this.measureText(texes[k]).width;
                    this.fillStyle = 'rgba(255, 255, 255, 0.50)';
                    this.fillRect2(-1 * Math.floor((n + 6) / 2), r + 8 + (g+6)*k, n + 6, g + 6);
                    this.fillStyle = 'rgb(0,0,0)';
                    this.fillText2(texes[k], x, y + tmpFix + (g+6)*k, n);
                }
            }
		};
        _.each([window.myMain, window.myUpper, window.myLower], function(c) {
            let can = c.getContext('2d');
            can.fillRect2 = can.fillRect;
            can.fillRect = newFill;
            can.newFill = newFill;
            can.fillText2 = can.fillText;
            can.fillText = newText;
            can.newText = newText;
        });
	}

	if (false && (TMp.scaleToks || TMp.statusHQ)) {
		var newRect = function(x, y, w, h) {
			var rgba = /rgba\( ?(\d*) ?, ?(\d*) ?, ?(\d*) ?, ?((?:\d|\.)*) ?\)/.exec(this.fillStyle), fillStr, offset = 24;
			if (rgba && parseFloat(rgba[4]).toFixed(2) == "0.75" && (Campaign.tokendisplay.bar3_rgb + '' == (fillStr = rgba[1] + ',' + rgba[2] + ',' + rgba[3]) || (Campaign.tokendisplay.bar2_rgb + '' == fillStr && _.isNumber(offset -= 12)) || (Campaign.tokendisplay.bar1_rgb + '' == fillStr && _.isNumber(offset -= 24)))) {
				var scale = (x - 3) * -1 / 35;
				if (scale != 1) {
					h = scale * 8;
					y = (y - offset + 20) + ((offset - 20) * scale);
					x = (x - 3) + (3 * scale);
					this.lineWidth = scale;
					w = Math.floor((70 * scale - 6 * scale) * (w / (70 * scale - 6)));
				}
			}
			this.rect2(x, y, w, h);
		};
		var newImage = function() {
			if (arguments[7] && arguments[7] == 21 && (arguments[0].src == 'https://files.catbox.moe/08tmts.svg' || arguments[0].src == 'https://app.roll20.net/images/statussheet.png' || arguments[0].src == 'https://app.roll20.net/images/statussheet_small.png')) {
				if (TMp.statusHQ) {
					if (arguments[0].src != 'https://files.catbox.moe/08tmts.svg')
						arguments[0].src = 'https://files.catbox.moe/08tmts.svg';
					arguments[3] = 24;
					arguments[4] = 24;
				}
				if (false) {
					var scaleO, scaleR, scaleH, scaleD, it, scale, k, j, pairs;
					switch(Campaign.get('markers_position')) {
						case 'bottom':
							scaleO = arguments[5];
							scaleR = arguments[6] + 19;
							it = (scaleR - scaleO);
							scale = scaleR / 35;
							for (k = 0; k <= it / 16; k++) for (j = 0; j <= it / 22; j++) if (k * 16 + j * 22 == it) pairs = [k,j];
							scaleD = scaleR - 10 * scale;
							scaleH = scaleO + 16 * pairs[0] * scale + 22 * pairs[1] * scale;
							break;
						case 'left':
							scaleO = -(arguments[5]);
							scaleR = -(arguments[6] + 19);
							it = (scaleO - scaleR);
							scale = scaleO / 35;
							for (k = 0; k <= it / 16; k++) for (j = 0; j <= it / 22; j++) if (k * 16 + j * 22 == it) pairs = [k,j];
							scaleD = -scaleR - 10 * scale + 16 * pairs * scale[0] + 22 * pairs[1] * scale;
							scaleH = -scaleO + 16 * pairs[0] * scale + 22 * pairs[1] * scale;
							break;
						case 'right':
							scaleO = arguments[5] + 18;
							scaleR = -(arguments[6] + 19);
							it = (scaleO - scaleR);
							scale = scaleO / 35;
							for (k = 0; k <= it / 16; k++) for (j = 0; j <= it / 22; j++) if (k * 16 + j * 22 == it) pairs = [k,j];
							scaleD = -scaleR - 10 * scale + 16 * pairs[0] * scale + 22 * pairs[1] * scale;
							scaleH = scaleO - 18 * scale;
							break;
						default:
							debugger;
							scaleO = arguments[5];
							scaleR = -(arguments[6] - 1);
							it = (scaleR - scaleO);
							scale = scaleR / 35;
							for (k = 0; k <= it / 16; k++) for (j = 0; j <= it / 22; j++) if (k * 16 + j * 22 == it) pairs = [k,j];
							scaleD = 10 * scale - scaleR;
							scaleH = scaleO + 16 * pairs[0] + 22 * pairs[1] - 16 * pairs[0] * scale - 22 * pairs[1] * scale;
					}
					arguments[5] = scaleH;
					arguments[6] = scaleD - 9 * scale;
					arguments[7] = 21 * scale;
					arguments[8] = 21 * scale;
				}
			}
			this.drawImage2(...arguments);
		}
		_.each([window.myMain, window.myUpper, window.myLower], function(c) {
			let can = c.getContext('2d');
			if (TMp.scaleToks) {
				can.rect2 = can.rect;
				can.rect = newRect;
			}
			can.drawImage2 = can.drawImage;
			can.drawImage = newImage;
		});

	}

	//Makes mousewheel scroll page listing at top and adds custom speed to it
	if (TMp.scrollPages != '0' && is_gm) {
		var scrollHorizontally = function(e) {
			e = window.event || e;
			document.getElementById('page-toolbar').children[1].scrollLeft -= (Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail))) * (parseFloat(TMp.scrollPages) * 40));
			e.preventDefault();
		}
        document.getElementById('page-toolbar').children[1].addEventListener("wheel", scrollHorizontally, false);
	}

	//Disables anti-aliasing on canvas if you need the performance
    if (TMp.perfMode) {
		_.each([window.myMain, window.myUpper, window.myLower], function(c) {
			c.getContext('2d').imageSmoothingEnabled = false;
		});
    }
}

})();

//this is where it ends//

(function(){
const el = document.createElement("link");
el.rel = "stylesheet";
el.href = "/css/licensed5ednd.css";
document.head.appendChild(el)
})();

//Macro Bar Mod Made by Cyelis1224//

(function() {var css =`
#macrobar {
  display: block !important;
  height: 4.6em !important;
  width: 100% !important;
  background-color: rgba(0, 0, 0, 0.44) !important;
  text-align: center !important;
  margin-left: auto !important;
  margin-bottom: 0px !important;
  overflow-y: visible;
}
div.macrobox button.btn {
    padding: 8 0 4 0;
    font-size: 3.2rem;
    line-height: 4rem;
    margin: 0px 0 0px 0;
    background-color: #1a1a1a !important;
    border: black !important;
}
#macrobar_macros {
  white-space: normal !important;
  margin-left: 1% !important;
  margin-right: 1% !important;
  padding-bottom: 0px !important;
}
#macrobar .macrobox {
    margin: 1px 5px 1px 5px ;
}
#macrobar div.macrobox:hover, #macrobar div.macrobox.ui-sortable-helper {
    padding-right: 12px;
    margin-right: -7px;
    border-radius: 3px;
    background-color: #999;
    cursor: move;
 }`;
if (typeof GM_addStyle != "undefined") {
	GM_addStyle(css);
} else if (typeof PRO_addStyle != "undefined") {
	PRO_addStyle(css);
} else if (typeof addStyle != "undefined") {
	addStyle(css);
} else {

    const node = document.createElement("style");
	node.type = "text/css";
	node.innerHTML = css;

    const interval = 10;
    const waitForDepts = () => {
        if(!document.head) {
            setTimeout(waitForDepts, 10);
            return;
        }

        document.head.appendChild(node);

    }
    setTimeout(waitForDepts, 10);
}
})();