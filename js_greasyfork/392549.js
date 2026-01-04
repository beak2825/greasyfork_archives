// ==UserScript==
// @name		Grepotemas
// @namespace	Temas para Gerpolis
// @version		0.0.4
// @author		JoeMan
// @description themes for the game Grepolis
// @include        http://*.grepolis.com/*
// @include        https://*.grepolis.com/*
// @exclude        https://*.forum.grepolis.com/*
// @exclude        https://wiki.*.grepolis.com/*
// @require		http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js
// @icon		https://i.imgur.com/qYhrH44.gif
var myString = "Reload script Grepolis Themes";
alert(myString);
// @license-end
// @downloadURL https://update.greasyfork.org/scripts/392549/Grepotemas.user.js
// @updateURL https://update.greasyfork.org/scripts/392549/Grepotemas.meta.js
// ==/UserScript==
var version = '0.0.4';
/***********************************************************************************************
 *  Description :
 *  Version: 0.0.4
 *  Script created for you.
 *  Show themes blog.
 *  Grepotemas window is draggable.
 *  Open and wax your search without leaving the game.
 *  Grepotemas always near you.
 *  CONTENT LOCK: Users may need to disable protection due to "unsafe" iframe elements.
 *  Resolution: Just click on the shield icon in the address bar and enable unsafe content. USE AT YOUR OWN RISK.
 *
 **********************************************************************************************/
var uw = unsafeWindow || window, $ = uw.jQuery || jQuery, DATA, GM;
GM = (typeof GM_info === 'object');
console.log('%c-Grepotemas- Ready', 'color: blue; font-size: 1em; font-weight: bolder; ');
var dbf_tooltip = "Grepotemas";
$('.gods_area').append('<div class="btn_settings circle_button dbf_btn" style="top:55px;right:111px;z-index:10;"><div class="dbf_icon js-caption" style="margin:1px 0px 0px -3px;width:120px;height:120px;background:url(https://i.imgur.com/qYhrH44.gif) no-repeat 0px 0px;background-size:33%"></div></div>');
$('.dbf_btn').tooltip(dbf_tooltip);
$('.dbf_btn').on('mousedown', function () {
    $('.dbf_icon').addClass('click');
});
$('.dbf_btn').on('mouseup', function () {
   $('.dbf_icon').removeClass('click');
});
$('.dbf_btn').click(editDBF);
$('body').append('<div id="dbfwndw" class="ui-dialog ui-widget ui-widget-content ui-corner-all ui-draggable js-window-main-container dbfwndw" tabindex="-1" style="position:relative;outline: 0px; z-index: 1031; height: auto; width: 800px; top: 96.5px; left: 124px; display: none;" role="dialog" aria-labelledby="ui-id-6"><div id="drag" class="ui-dialog-titlebar ui-widget-header ui-corner-all ui-helper-clearfix"><span id="ui-id-6" class="ui-dialog-title">Grepotemas all themes for your game:</span><a href="#" class="ui-dialog-titlebar-close ui-corner-all" role="button"><span class="ui-icon ui-icon-closethick">close</span></a></div><div class="gpwindow_frame ui-dialog-content ui-widget-content" style="display: block; width: auto; min-height: 0px; height: 600px;" scrolltop="0" scrollleft="0"><div class="gpwindow_left"></div><div class="gpwindow_right"></div><div class="gpwindow_bottom"><div class="gpwindow_left corner"></div><div class="gpwindow_right corner"></div></div><div class="gpwindow_top"><div class="gpwindow_left corner"></div><div class="gpwindow_right corner"></div></div><div id="gpwnd_1005" class="gpwindow_content"><div class="game_border"><div class="game_border_top"></div><div class="game_border_bottom"></div><div class="game_border_left"></div><div class="game_border_right"></div><div class="game_border_corner corner1"></div><div class="game_border_corner corner2"></div><div class="game_border_corner corner3"></div><div class="game_border_corner corner4"></div><div class="game_header bold" style="height:18px;"><div style="float:left; padding-right:10px;">Grepotemas</div></div><p style="height:501;width:792;z-index=2000;min-height:501px;min-width:792;height:100%;width:100%;"><iframe src="https://grepotemas.blogspot.com/" name="dbfiframe" allowTransparency="true" frameborder="0" style="height:501;width:792;z-index=2000;min-height:501px;min-width:792;height:100%;width:100%;";></iframe></p></div></div>');
function editDBF() {
    var x = document.getElementById('dbfwndw');
    if (x.style.display === 'none') {
        x.style.display = 'block';
    } else {
        x.style.display = 'none';
    }
}
$('.ui-dialog-titlebar-close').on('mousedown', function () {
    $('.dbf_icon').addClass('click');
});
$('.ui-dialog-titlebar-close').on('mouseup', function () {
   $('.dbf_icon').removeClass('click');
});
$('.ui-dialog-titlebar-close').click(editDBF);
$( "#dbfwndw" ).draggable();