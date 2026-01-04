// ==UserScript==
// @name         V3rmillion Theme
// @namespace    www.v3rmillion.net
// @version      1.0.0
// @description  Theme editor for V3rmillion.net
// @author       Drachenlord
// @match        *://*.v3rmillion.net/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.js
// @downloadURL https://update.greasyfork.org/scripts/398108/V3rmillion%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/398108/V3rmillion%20Theme.meta.js
// ==/UserScript==
var css = '.postbit_buttons a.postbit_rep span:before{content:"\\f005";}.postbit_buttons a.postbit_like span:before{content:"\\f087"}.postbit_buttons a.postbit_dislike span:before{content: "\\f088"}.main_replacer{background: transparent;border:none;}.forum_on,.usercp_nav_item:before,li.current_rating[style*="20"] ~ li a.one_star,li.current_rating[style*="40"] ~ li:nth-child(n+5) a,li.current_rating[style*="60"] ~ li:nth-child(n+4) a,li.current_rating[style*="80"] ~ li:nth-child(n+3) a,li[style*="100"]~ li:nth-child(n+2) a{color:main_colour}span[style~="#CD1818"],.cRem a:visited,.cRem a:link, .inline_row a:link, .inline_row a:visited{color:main_colour!important}ul.menu li a.active{background:main_colour!important}.thead,.tfoot,.buttons:hover{background:main_colour}.postbit_buttons > a:link,.postbit_buttons > a:visited,.postbit_buttons > a:active,.pagination a,a.button:link,a.button:visited,a.button:active,button,input.button{background:main_colour;border:1px solid main_colour}.buttons{border:1px solid main_colour}.postbit_buttons > a:hover,a.button:hover{background:#404040;border:1px solid #404040}#bridge,.thread_head{border-bottom:5px solid main_colour !important}#footer,ul.menu li ul,.panel_buttons{border-top:5px solid main_colour}input.textbox:focus, textarea:focus{border-color:main_colour;box-shadow:0px 0px 10px main_colour}';
$(document).ready(function() {
    $("<style id='InternalsTheme'></style>").appendTo("head");
	$("#InternalsTheme").html(css.replace(/main_colour/g, "#3ECE00"));
	$("#logo img").attr("src", "https://i.imgur.com/o8PE3UH.png");
});