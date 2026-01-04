4//
// Written by Glenn Wiking
// Script Version: 0.1.4
//
//
// ==UserScript==
// @name        Shuttle Pro
// @namespace   SP
// @description Eye-friendly magic in your browser for Shuttle API
// @version     0.1.35
// @icon        https://dlw0tascjxd4x.cloudfront.net/assets/img/symbol.svg

// @include     *.shuttle.be/admin/*
// @include			*app.shuttle.be/*
// @require			https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js 
// @require			https://cdn.jsdelivr.net/npm/js-cookie@2/src/js.cookie.min.js

// @downloadURL https://update.greasyfork.org/scripts/394742/Shuttle%20Pro.user.js
// @updateURL https://update.greasyfork.org/scripts/394742/Shuttle%20Pro.meta.js
// ==/UserScript==

$(window).on("load", function() {
  /* Dark mode */
  	let proClone;
  	if ( Cookies.get("Dark") != 0 && Cookies.get("Dark") != 1 ) {
      Cookies.set("Dark",1);
    }

 		if ( $(".dark").length > 0 ) {
      $(".dark").clone();
    }
  
  	function toggleMode() {
      if ( Cookies.get("Dark") == 0 ) {
        proClone = $(".dark").clone();
        $(".dark").remove();
      } else {
        $("head").append(proClone);
      }
      console.log("Dark mode: " + Cookies.get("Dark"));
    };
  
  	console.log("Dark mode: " + Cookies.get("Dark"));
  	let modeSwitch = document.createElement("div");
  	modeSwitch.className = "modeswitch";
  	if ( window.location.href == "https://app.shuttle.be/sites" ) {
      $(".shuttle-Header > .Container > div:last-child").prepend(modeSwitch);
    } else {
      $("#open_website").parents(".ButtonGroup").prepend(modeSwitch);
    }  	
  	$(".modeswitch").html('<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 40 40" style="enable background:new 0 0 40 40;" xml:space="preserve"> <path class="st1" d="M20,0"/> <path class="st0" d="M14.1,39.1c10.6,3.2,21.7-2.7,25-13.3s-2.7-21.7-13.3-25L14.1,39.1z"/> </svg>');
  
  	$(".modeswitch").on("click", function() {
    		if ( Cookies.get("Dark") == 0 ) {
          Cookies.set("Dark",1);
          toggleMode();
        } else {
          Cookies.set("Dark",0);
          toggleMode();
        }
    });
  
  	toggleMode();
  /* Settings menu */
  	let settingsExists = 0;
  	let inSettings = 0;
  	let settings = document.createElement("div");
  	settings.className = "settings";
  
  	function beInSettings() {
      let ifInSettings = setInterval( function() {
        if ( $("a[data-active-id='general']").length > 0 ) {
          console.log("Found");
          inSettings = 1;
          clearInterval(ifInSettings);
        };
      });
    }
  	
  
  	let ifSettingsExists = setInterval( function() {
      $(".shuttle-MainNav-itemTarget[data-active-id='settings']").on("click", function() {
        beInSettings();
      });
      
      	console.log("D");
      if ( $("a[data-active-id='settings']").length > 0 ) {
        settingsExists = 1;
        if ( $("a[data-active-id='settings']").attr("class").includes("is-selected") ) {
          beInSettings();
        };
        clearInterval(ifSettingsExists);
      }
    }, 100);
  
  /* Auto select dark style bg */
  	let inEdit = 0;
  	
  	function ifStyleButtons() {
      console.log("Running");
      $("button[data-original-title='Edit style']").on("click", function() {
        console.log("Style");
        let ifInEdit = setInterval( function() {
          if ( $("#element_swatches").length > 0 ) {
            console.log("S");
            inEdit = 1;
            $("#element_swatches > div:last-child").trigger("click");
            clearInterval(ifInEdit);
          }
        }, 100);
      });
    }
  
  	$(".shuttle-Panel *, .preview-style tr").on("click", function() {
    	ifStyleButtons();
    });
  	
  	ifStyleButtons();
  	
});
  
function ShuttlePro(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
  	style.className = "pro";
    head.appendChild(style);
}

function Dark(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
  	style.className = "dark";
    head.appendChild(style);
}

ShuttlePro(
  '.shuttle-Header > div > div:last-child > div > div:last-child .Button::after {content: "Pro"; position: absolute; text-transform: uppercase; font-size: 10.5px; color: #EEE !important; background: #3788ff; opacity: 1 !important; padding: 1px 4px; border-radius: 7px; top: 1px; right: -3px; pointer-events: none;}'
  +
  '.shuttle-Header > div > div:last-child > div > div:last-child .Button {opacity: 1 !important; color: #939393 !important;}'
  +
  '.shuttle-Header > div > div:last-child > div > div:last-child .Button svg {fill: #939393 !important;}'
  +
  '.shuttle-Header > div > div:last-child > div > div:last-child .Button:hover {opacity: 1 !important; color: #D5D5D5 !important;}'
  +
  '.shuttle-Header > div > div:last-child > div > div:last-child .Button:hover svg {fill: #D5D5D5 !important;}'
  +
  '.modeswitch {height: 28px; width: 28px; position: absolute; fill: #FFF; left: -30px; opacity: .5; top: 9px; padding: 5px; cursor: pointer; transition: all 175ms ease-in-out 0s;}'
  +
  '.modeswitch:hover {opacity: 1; transition: all 175ms ease-in-out 0s;}'
  +
  '.modeswitch svg {position: absolute; top: 0; transform: scale(1.05); border: 2px solid #FFF; border-radius: 50%; height: 16px; width: 16px;}'
);
Dark(
  'body {background: #222528 !important;}'
  +
	'body, .Table--actions thead th a, .selectize-control {color: #E2E2E2 !important}'
  +
  '::selection {background-color: #359fe3; color: #0F1115;}'
  +
  '.shuttle-Panels, #element_container {background: #222528 !important;}'
  +
  '.shuttle-Panel {background: #222528 !important; scrollbar-color: #666 #2b2e33 !important;}'
  +
  '.shuttle-Panel--subNav, .TokenDropdown li {background-color: #2b2E33 !important;}'
  +
  '.shuttle-Panel-header {background-color: #2B2E33 !important; border-bottom: 1px solid #1B1E20 !important;}'
  +
  '.shuttle-Panel > .Form-item--actions {background-color: #2B2E33 !important; border-top: 1px solid #1B1E20 !important;}'
  +
  '.shuttle-page {border: 3px solid #666 !important;}'
  +
  '.PanelNav-itemTarget {color: #77c3f4 !important;}'
  +
  '.PanelNav-itemTarget .Icon svg {fill: #77c3f4;}'
  +
  '.PanelNav-itemTarget.is-selected {color: #4192EC !important;}' /* #3A93F6 */
  +
  '.PanelNav-itemTarget.is-selected .Icon svg, .PanelNav-itemTarget:hover .Icon svg {fill: #4192EC !important;}'
  +
  '.PanelNav .Button .Icon svg {fill: #E9E9E9 !important;}'
  +
  'body a:active, body a:focus, body a:hover {color: #73c0f9;}'
  +
  '.selectize-dropdown {background: #222528 !important;}'
  +
  '.selectize-dropdown .optgroup-header, .selectize-dropdown [data-selectable] {background: #2B2E33 !important; color: #D5D5D5 !important;}'
  +
  '.selectize-input, input[type="date"], input[type="email"], input[type="number"], input[type="password"], input[type="search"], input[type="text"], textarea {color: #E2E2E2 !important; background-color: #2B2E33 !important; border: 1px solid #5B6268;}'
  +
  '.selectize-dropdown .selected, .TokenDropdown li.is-selected {background-color: #0f2E57 !important;}'
  +
  '.selectize-control.single .selectize-input::after {border-color: #5B6268 transparent transparent !important;}'
  +
  '.selectize-dropdown-content .active {background: #454545 !important; color: #E9E9E9 !important;}'
  +
  '.selectize-dropdown .optgroup {border-top: 1px solid #666 !important;}'
  +
  '.selectize-input.dropdown-active::before {background: #666 !important;}'
  +
  '.Table--actions tbody, .SiteList-image {background: #2B2E33 !important;}'
  +
  '.Table--actions tbody tr td {border-top: 1px solid #5B6268 !important;}'
  +
  '.Table--actions tbody tr.ui-sortable-helper td, .Table--actions tbody tr:last-child td {border-bottom: 1px solid #5B6268 !important;}'
  +
  '.Table--actions tbody tr td:last-child {border-right: 1px solid #5B6268 !important;}'
  +
  '.Table--actions tbody tr td:first-child, .Pagination-item + .Pagination-item {border-left: 1px solid #5B6268 !important;}'
  +
  '.Table--actions tbody tr.is-selected td {border-bottom: 1px solid #359fe3 !important; border-color: #225198 !important; background: #143663 !important;}'
  +
  '.Table--actions tbody tr.is-selected:hover td {border-bottom: 1px solid #359fe3 !important; border-color: #225198 !important; background: #143663 !important; filter: brightness(1.15);}'
  +
  '.Table--actions .is-disabled td {color: #666 !important;}'
  +
  '.shuttle-block-title-col {background: #666 !important;}'
  +
  '.shuttle-block-title:hover > div {background: #393C42 !important;}'
  +
  '.shuttle-widget, .TokenDropdown {background: #2B2E33 !important; border: 1px solid #5B6268 !important;}'
  +
  '.shuttle-widget:hover, .Table--actions tbody tr:hover td {border-top: 1px solid #888 !important; background: #323435 !important; border-bottom: 1px solid #888 !important;}'
  +
  '.shuttle-widget.selected, .Drop-menu-itemTarget.is-selected {background: #143663 !important; border-color: #2B6BCC !important;}'
  +
  '.shuttle-widget .shuttle-widget-properties a .Icon, .Drop-menu-itemTarget .Icon {fill: #E9E9E9 !important;}'
  +
  '.shuttle-widget-icon .Icon, .Button--default > .Icon > svg, div[data-original-title="Row settings"] svg {fill: #E9E9E9 !important;}'
  +
  '.shuttle-widget img.shuttle-widget-thumbnail[src*="/thumbnails/"], .shuttle-widget img.shuttle-widget-thumbnail[src*="/assets/img/"], .Table tr[data-id] > td > img[onerror], .shuttle-widget-icon svg {filter: brightness(2.4);}'
  +
  '.shuttle-widget.selected:hover, .Drop-menu-itemTarget.is-selected:hover {filter: brightness(1.15) !important;}'
  +
  '.TokenDropdown ul li.is-system {border-top: 1px solid #666 !important;}'
  +
  'svg.svg-DeleteAlt, .Close > .Icon {fill: #FFF !important; opacity: 1 !important;}'
  +
  '.Button--default, .Pagination-wrapItems {color: #D9D9D9 !important; background-color: #143663 !important; border-color: #225198 !important;}'
  +
  '.Button--default.is-active, .Button--default.is-focused, .Button--default.is-hovered, .Button--default:active, .Button--default:focus, .Button--default:hover {border-color: #AAA !important; background: #323435 !important;}'
  +
  '.Form-controls #criteria_segment_id > div[style]:nth-of-type(2n+1), #criteria > div[class*="js"], .shuttle-EntryAssets .FieldGroup-field, #conditions > div[style]:nth-of-type(2n+1), .TreeScroller + #criteria > div:nth-of-type(2n+1), div[id^="criteria"] > div[style]:nth-of-type(2n+1) {border: 1px solid #225198 !important; background: #283141 none repeat scroll 0% 0% !important;}'
  +
  '.FieldGroup .FieldGroup-button:hover {filter: brightness(1.15);}'
  +
  '.SiteList .SiteList-url a {opacity: 1 !important; color: #D5D5D5 !important;}'
  +
  '.SiteList-image {border: 1px solid #666 !important;}'
  +
  'img#logo {opacity: .25 !important;}'
  +
  '#Level_down, .shuttle-col div[class*="Spinner"] * {fill: #FFF !important;}'
  +
  '.Pagination-itemTarget {color: #D5D5D5 !important;}'
  +
  '.Pagination-itemTarget.is-disabled {background-color: #2b2e33 !important; color: #D5D5D5 !important;}'
  +
  '.shuttle-col-splitter-inner {background: #666 !important;}'
  +
  '.switchery[style="background-color: rgb(91, 183, 83); border-color: rgb(91, 183, 83); box-shadow: rgb(91, 183, 83) 0px 0px 0px 15.5px inset; transition: border 0.4s ease 0s, box-shadow 0.4s ease 0s, background-color 1.2s ease 0s;"] {background-color: #359FE3 !important; border-color: #5ca1e8 !important; box-shadow: #359fe3 0px 0px 0px 15.5px inset !important;}'
  +
  '.switchery[style="box-shadow: rgb(91, 183, 83) 0px 0px 0px 15.5px inset; border-color: rgb(91, 183, 83); background-color: rgb(91, 183, 83); transition: border 0.4s ease 0s, box-shadow 0.4s ease 0s, background-color 1.2s ease 0s;"] {background-color: #359FE3 !important; border-color: #5ca1e8 !important; box-shadow: #359fe3 0px 0px 0px 15.5px inset !important;}'
  +
  '.switchery[style="box-shadow: rgb(223, 223, 223) 0px 0px 0px 0px inset; border-color: rgb(223, 223, 223); background-color: rgb(255, 255, 255); transition: border 0.4s ease 0s, box-shadow 0.4s ease 0s;"] {background: #373c44 !important; border: 1px solid #747a80 !important;}'
  +
  '.switchery[style="background-color: rgb(255, 255, 255); border-color: rgb(223, 223, 223); box-shadow: rgb(223, 223, 223) 0px 0px 0px 0px inset; transition: border 0.4s ease 0s, box-shadow 0.4s ease 0s;"] {background: #373c44 !important; border: 1px solid #747a80 !important;}'
  +
  '.switchery small {background: #E9E9E9 !important;}'
  +
  '.shuttle-Panel-inner .TreeScroller {border: 1px solid #43484e !important; background: #2b2e33 !important;}'
  +
  '.shuttle-Tree--dark .is-selected .shuttle-Tree-title {color: #D5D5D5 !important;}'
  +
  '.shuttle-Tree-level {filter: brightness(2.4);}'
  +
  '.shuttle-Panel--subNav #tree .shuttle-Tree-level {filter: brightness(1) !important;}'
  +
  '.shuttle-Tree--dark .shuttle-Tree-title {color: #D5D5D5 !important;}'
  +
  '.cke_top {background-image: linear-gradient(to bottom,#CFCFCF,#F5F5F5) !important; filter: invert(0.92) !important;}'
  +
  '.cke_chrome {border: 1px solid #626771 !important;}'
  +
  '.shuttle-widget .shuttle-widget-properties a.is-disabled {opacity: 0.3 !important;}'
  +
  '.FormSlider-slider {background: #666 !important; border: 12px solid #222528 !important;}'
  +
  '.Drop-menu {background-color: #2b2e33 !important; border: 1px solid #666 !important;}'
  +
  '.Drop-menu a {color: #D5D5D5 !important;}'
  +
  '.Drop-menu-itemTarget:focus, .Drop-menu-itemTarget:hover {background: #143663 !important;}'
  +
  '.Table--actions .Icon--check svg {fill: #359fe3 !important;}'
  +
  '.shuttle-Panel--login .shuttle-Panel-inner {background: #393939 !important;}'
  +
  '.Drop-menu-item--divider {background-color: #666 !important;}'
  +
  '.cke_reset.cke_inner {opacity: .8;}'
  +
  '.cke_button:hover {filter: brightness(0.85) !important;}'
  +
  'label[for="settings[backgroundPosition]"] + .Form-controls .FieldGroup-button button, label[for="settings[watermark][position]"] + .Form-controls .FieldGroup-button button {border: 0px !important;}'
  +
  '.ace_scrollbar-inner {background: #FFF !important;}'
  +
  '.ace_scrollbar-h, .ace_scrollbar-v {filter: invert(0.85);}'
  +
  '.Style-title {background: #2B2E33 !important; border-top: 1px solid #666 !important;}'
  +
  '.Style-title#title_name {border-top: none !important;}'
  +
  '.Style-title.Style-title--last, .Style-title.Style-title--open {border-bottom: #666 !important;}'
  +
  '.Style-title:hover {background: #143663 !important; color: #E9E9E9 !important;}'
  +
  '.js-preview {color: #E9E9E9 !important;}'
  +
  '#element_container > div:not(.js-preview) {color: #E9E9E9 !important; font-size: 12px !important;}'
  +
  '.Progress {background: #2B2E33 !important;}'
  +
  '.Alert--default {color: #D5D5D5 !important; background-color: #2b2e33 !important; border-color: #666 !important;}'
  +
  '.shuttle-block-empty.shuttle-block-empty-hover .shuttle-block-inner {background: #333 !important;}'
  +
  '.ace-monokai .ace_marker-layer .ace_bracket {border: 1px solid #C8BC45 !important;}'
  +
  '.cke_dialog_background_cover {background-color: #000 !important;}'
  +
  '.Alert--danger {color: #359fe3; background-color: #2b2e33; border-color: #359FE3;}'
  +
  '.Form-controls input::placeholder {color: #CCC !important; opacity: 1 !important;}'
);