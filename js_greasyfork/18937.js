//
// Written by Glenn Wiking
// Script Version: 1.1.0
// Date of issue: 01/09/15
// Date of resolution: 01/09/15
//
// ==UserScript==
// @name        ShadeRoot CAH
// @namespace   SRCAH
// @version     1.1.0
// @grant       none
// @icon        https://i.imgur.com/10kEWi1.png
// @description	Eye-friendly magic in your browser for Cards Against Humanity;

// @include     *pretendyoure.xyz*

// @downloadURL https://update.greasyfork.org/scripts/18937/ShadeRoot%20CAH.user.js
// @updateURL https://update.greasyfork.org/scripts/18937/ShadeRoot%20CAH.meta.js
// ==/UserScript==

function ShadeRootCAH(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

ShadeRootCAH(
	'body {background: #1A1919 !important; color: #8F8B86 !important;}'
	+
	'span {color: #8F8B86 !important;}'
	+
	'#nickbox input, #menubar input, #bottom input, textarea, select, .game_black_card_wrapper input, fieldset input {background: rgb(62, 62, 62) none repeat scroll 0% 0% !important; border-radius: 3px !important; border: 1px solid #555 !important; padding: 2px !important; color: #DEDEDE !important;}'
	+
	'.gamelist_lobby {background-image: linear-gradient(#242424, #1B1B1B 75%, #111) !important;}'
	+
	'.gamelist_lobby {background: #212121 !important; border: 1px solid #515151;}'
	+
	'.gamelist_lobby_join, .gamelist_lobby_spectate {border: 1px solid #535353 !important; background: #595959 linear-gradient(#454545, #333) repeat scroll 0% 0% !important; color: #BBB !important;}'
	+
	'#tabs {background: #1A1919 !important;}'
	+
	'.ui-widget-header {border: 1px solid #333 !important; background-color: #393939 !important; background: #1C1D1E url("images/ui-bg_highlight-soft_100_deedf7_1x100.png") repeat-x scroll 50% 50%;}'
	+
	'.ui-tabs .ui-tabs-nav {background: #3B3B3B !important;}'
	//+
	//'.ui-tabs .ui-tabs-nav .ui-tabs-anchor {background: #232323}'
	+
	'.ui-state-default, .ui-widget-content .ui-state-default, .ui-widget-header .ui-state-default {border: 1px solid #202020 !important;}'
	+
	'.ui-state-active, .ui-widget-content .ui-state-active, .ui-widget-header .ui-state-active {border: 1px solid #8C8C8C !important; background: #7E7E7E url("images/ui-bg_glass_50_3baae3_1x400.png") repeat-x scroll 50% 50% !important;}'
	+
	'label, dfn, .ui-tabs-panel, .legend {color: #DEDEDE !important;}'
	+
	'fieldset {border-color: rgb(57, 55, 55) !important; border: 1px solid #555 !important;}'
	+
	'.game_options {background: #2F2F2F none repeat scroll 0% 0% !important;}'
	+
	'.ui-widget-content a {color: #D7D7D7 !important;}'
	+
	'input {opacity: .85 !important;}'
	+
	'.scorecard {background: #0F0F0F none repeat scroll 0% 0% !important; border-bottom: 1px solid #3C3C3C !important;}'
	+
	'.scorecard:nth-child(2n) {background: #262525 !important;}'
	+
	'#info_area, .scorecard {border: 1px solid #424242 !important;}'
	+
	'.card {border: 1px solid #2D2D2D !important;}'
	+
	'.whitecard, .gamelist_lobby {background-image: linear-gradient(#424242, #424242 75%, #3C3C3C) !important;}'
	+
	'.card_text {color: #C9C9C9 !important;}'
	+
	'.watermark {color: #171717 !important;}'
	+
	'.confirm_card {opacity: .7 !important;}'
	+
	'.log input {padding: 0px !important;}'
	+
	'.logo_1 {transform: rotate(-0.226893rad) scale(2.1) !important;}'
	+
	'.logo_2 {transform: scale(2.1) !important;}'
	+
	'.logo_3 {transform: rotate(0.226893rad) scale(2.25) !important;}'
	+
	'.logo_text {left: 68px !important; color: rgba(0,0,0,0) !important; font-size: 0.01em;}'
	+
	'.logo_text::after {color: #C6C6C6 !important; font-size: 12px; content:"Made by Glenn Wiking";}'
	+
	'.game_hand_filter {background: rgba(23, 22, 22, 0.77) none repeat scroll 0% 0% !important;}'
	+
	'.game_hand_filter_text {background: #171515 none repeat scroll 0% 0% !important;}'
	+
	'.selected {background: #222324 none repeat scroll 0% 0% !important; color: #DDD;}'
	+
	'#menubar {background: #000 !important;}'
	+
	'.game_white_cards_binder {border: 3px solid #181818 !important;}'
	+
	'.ui-state-active, .ui-state-hover, .ui-state-active, .ui-widget-content .ui-state-active, .ui-widget-header .ui-state-active, .ui-state-default, .ui-widget-content .ui-state-default, .ui-widget-header .ui-state-default {background: #232323; border: 0px solid rgba(0,0,0,0) !important;}'
	+
	'.ui-tabs .ui-tabs-nav li.ui-tabs-active {background: #000 !important;}'
	+
	'.game_right_side_cards .selected {animation: selections 1s linear 0s infinite;}'
	+
	'@keyframes selections {0% {opacity:1;} 10% {opacity:0.3;} 100% {opacity:1;}}'
	+
	'.whitecard {box-shadow: 0 2px 8px #0C0C0C !important;}'
	+
	'.blackcard {box-shadow: 0px 2px 16px 6px #0E0E0E !important;}'
	+
	'.logo, .card_metadata {transition: opacity .25s ease-in-out;}'
	+
	'.logo:hover, .card_metadata:hover {transition: opacity .25s ease-in-out; opacity: .20 !important;}'
);