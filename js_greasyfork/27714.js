// ==UserScript==
// @name		Image Editor
// @namespace	IE
// @version		0.1
// @author		ViralityEverden aka Bluebaby
// @description:fr         Redirige vers un gdoc
// @include     http://*.grepolis.com/game/*
// @include     https://*.grepolis.com/game/*
// @require		http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js
// @copyright	2017, Bluebaby
// @grant		GM_info
// @grant		GM_setValue
// @grant		GM_getValue
// @grant		GM_deleteValue
// @grant		GM_xmlhttpRequest
// @grant		GM_getResourceURL
// @description Redirige vers un gdoc
// @downloadURL https://update.greasyfork.org/scripts/27714/Image%20Editor.user.js
// @updateURL https://update.greasyfork.org/scripts/27714/Image%20Editor.meta.js
// ==/UserScript==

var version = '0.1';

var uw = unsafeWindow || window, $ = uw.jQuery || jQuery, DATA, GM;

// GM-API?
GM = (typeof GM_info === 'object');

//

console.log('%c-Image Editor- Ready', 'color: blue; font-size: 1em; font-weight: bolder; ');

// Create the wiki button :

var dbf_tooltip = "Image Editor";

$('.gods_area').append('<div class="btn_settings circle_button dbf_btn" style="top:95px;right:0px;z-index:10;"><div class="dbf_icon js-caption" style="margin:7px 0px 0px 6px;width:20px;height:20px;background:url(http://img2.wikia.nocookie.net/__cb20150309221525/logopedia/images/e/e1/Googlemapslogo2014.png) no-repeat 0px 0px;background-size:90%"></div></div>');

$('.dbf_btn').tooltip(dbf_tooltip);

// Wiki Button click :

$('.dbf_btn').on('mousedown', function () {
    $('.dbf_icon').addClass('click');
});
$('.dbf_btn').on('mouseup', function () {
   $('.dbf_icon').removeClass('click');
});
$('.dbf_btn').click(editDBF);

//Create the html window :

$('body').append('<div id="dbfwndw" class="ui-dialog ui-widget ui-widget-content ui-corner-all ui-draggable js-window-main-container dbfwndw" tabindex="-1" style="position:relative;outline: 0px; z-index: 1031; height: auto; width: 800px; top: 96.5px; left: 124px; display: none;" role="dialog" aria-labelledby="ui-id-6"><div id="drag" class="ui-dialog-titlebar ui-widget-header ui-corner-all ui-helper-clearfix"><span id="ui-id-6" class="ui-dialog-title">Editeur de maps</span><a href="#" class="ui-dialog-titlebar-close ui-corner-all" role="button"><span class="ui-icon ui-icon-closethick">close</span></a></div><div class="gpwindow_frame ui-dialog-content ui-widget-content" style="display: block; width: auto; min-height: 0px; height: 600px;" scrolltop="0" scrollleft="0"><div class="gpwindow_left"></div><div class="gpwindow_right"></div><div class="gpwindow_bottom"><div class="gpwindow_left corner"></div><div class="gpwindow_right corner"></div></div><div class="gpwindow_top"><div class="gpwindow_left corner"></div><div class="gpwindow_right corner"></div></div><div id="gpwnd_1005" class="gpwindow_content"><div class="game_border"><div class="game_border_top"></div><div class="game_border_bottom"></div><div class="game_border_left"></div><div class="game_border_right"></div><div class="game_border_corner corner1"></div><div class="game_border_corner corner2"></div><div class="game_border_corner corner3"></div><div class="game_border_corner corner4"></div><div class="game_header bold" style="height:18px;"><div style="float:left; padding-right:10px;">GDOC :</div></div><p style="height:501;width:792;z-index=2000;min-height:501px;min-width:792;height:100%;width:100%;"><iframe src="https://docs.google.com/presentation/d/18iNKo7tsGjanNn4uqF4TbQfM6p5GVNhVUB2yBS2ygwE/edit?usp=sharing" name="dbfiframe" scrolling="yes" allowTransparency="true" frameborder="0" style="height:501;width:792;z-index=2000;min-height:501px;min-width:792;height:100%;width:100%;";></iframe></p></div></div>');

// function "open/close" (more like stop displaying/ strat displaying)

function editDBF() {
    var x = document.getElementById('dbfwndw');
    if (x.style.display === 'none') {
        x.style.display = 'block';
    } else {
        x.style.display = 'none';
    }
}

// Close button click :

$('.ui-dialog-titlebar-close').on('mousedown', function () {
    $('.dbf_icon').addClass('click');
});
$('.ui-dialog-titlebar-close').on('mouseup', function () {
   $('.dbf_icon').removeClass('click');
});
$('.ui-dialog-titlebar-close').click(editDBF);

// Make the window draggable :

$( "#dbfwndw" ).draggable();

//

