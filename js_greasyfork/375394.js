// ==UserScript==
// @name         Webnovel Autoscroll
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       Corbi
// @homepage     https://fb.com/jrcorbil
// @match        https://www.webnovel.com/book/*
// @match        https://www.webnovel.com/comic/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @require      https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.2/jquery-ui.min.js
// @resource     jqueryCSS https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.2/themes/smoothness/jquery-ui.css
// @resource     bootstrapCSS https://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/css/bootstrap.min.css
// @grant       GM_addStyle
// @grant       GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/375394/Webnovel%20Autoscroll.user.js
// @updateURL https://update.greasyfork.org/scripts/375394/Webnovel%20Autoscroll.meta.js
// ==/UserScript==

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css.replace(/;/g, ' !important;');
    head.appendChild(style);
}

(function(){
    'use strict';
    var $ = window.jQuery;
    var scrolltimer = 5;
    var scrollscreenskip = 10;
    var newCSS = GM_getResourceText ("jqueryCSS");
    GM_addStyle (newCSS);
    addGlobalStyle('.j_theme_setting .ui-slider-range{ background:#4c5fe2; }');
    addGlobalStyle('.j_theme_setting .bar{display:block;}');
    addGlobalStyle('.j_theme_setting .ui-slider-handle{background: none; background-color: #fff; border: 1px solid #4c5fe2; border-radius: 100%;}')
    addGlobalStyle('.j_theme_setting .bar{border: 1px solid #dcdcdc;}');
    addGlobalStyle('.j_theme_setting .percent{color:#4c5fe2}');
    addGlobalStyle('#astarter {padding:0 1em; color:#4c5fe2; border:1px solid #4c5fe2; border-radius:2px; line-height:36px; height:36px; display:inline-block; font-weight:600;} #astarter.started{color:#1f2129;border:1px solid #dcdcdc;}');
    addGlobalStyle('.as-progress{background-color: #4c5fe2; height: 2px; position: absolute; bottom: -1px; left: 0;}');
    addGlobalStyle('#scrolltimer{border: 1px solid #dcdcdc;width: 60px;padding: 8px 10px;}');
    $('.g_header').append('<div class="as-progress"></div>');
    $('.j_theme_setting').append('<p style="margin-top:20px;">' +
                                 '<label class="db c_s mb8 fs14">Auto Scroll</label>' +
                                 '<span >Scroll at <span class="percent">10%</span> of the screen height</span>' +
                                 '<span class="bar mb8"></span>' +
                                 '<label class="db c_s mb8 fs14">Interval in seconds</label>' +
                                 '<input type="number" id="scrolltimer" value="5">' +
                                 '<label id="astarter">Start</label>' +
                                 '</p>');
    $('.j_theme_setting').each(function() {
        var $projectBar = $(this).find('.bar');
        var $projectPercent = $(this).find('.percent');
        var $projectRange = $(this).find('.ui-slider-range');
        $projectBar.slider({
            range: "min",
            animate: true,
            value: 10,
            min: 1,
            max: 100,
            step: 1,
            slide: function(event, ui) {
                $projectPercent.html(ui.value + "%");
            },
            change: function(event, ui) {
                scrollscreenskip = ui.value;
            }
        });
    });
    $('#astarter').click(function(){
        if(!$(this).hasClass('started')){
            $(this).addClass('started');
            $(this).html("Stop");
            scrolltimer = $("#scrolltimer").val();
            asStart();
        }else{
            $(this).removeClass('started');
            $(this).html("Start");
            $(".as-progress").stop();
            $(".as-progress").css('width','0%');
        }
    });
    function asStart(){
        $(".as-progress").animate({width: '100%'}, scrolltimer * 1000,function() {
            $(".as-progress").animate({width: '0%'},300);
            var screen_height = $(window).height() - 50;
            var current_height = $(window).scrollTop();
            var next_skip = current_height + screen_height* scrollscreenskip/100;
            var body = $("html, body");
            body.stop().animate({scrollTop:next_skip}, 500, 'swing');
            asStart();
        });
    }

})();