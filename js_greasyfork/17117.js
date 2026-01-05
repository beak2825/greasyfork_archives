// ==UserScript==
// @name         Inspector&Editor
// @namespace    http://tampermonkey.net/
// @version      1.3.0
// @description  see full description here:  https://openuserjs.org/users/pietro.giucastro/scripts
// @author       Speep pietrogiucastro@alice.it
// @match        */*
// @grant        none
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/17117/InspectorEditor.user.js
// @updateURL https://update.greasyfork.org/scripts/17117/InspectorEditor.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

// Your code here...
$('head').append("<style> .inspect_selector_ { border: 1px solid black !important; background-color: rgba(0,100,255,0.2) !important; }</style>");

$('head').append("<style> .inspect_style_  { position:relative; }</style>");
$('head').append("<style> .console_style_  { position:relative; }</style>");
$('head').append("<style> .log_style_      { position:relative; margin-bottom:5px; }</style>");
$('head').append("<style> .shortcut_style_ { position:relative; width:24px; line-height:24px; background-color:rgba(50,50,50,0.8); color:white; padding:0px; border-radius:5px; border:0px; margin-left:5px; }</style>");
$('head').append("<style> .css_input_      { position:relative; }</style>");

$('head').append("<style> .log_box_html         { padding-left:5px; color:#fff !important; resize:none; width:500px; margin-left:1px; border-radius:3px; resize:vertical; font-size:13px; line-height:25px; word-wrap:break-word; }</style>");
$('head').append("<style> .console_box_textarea { padding-left:5px; color:#fff !important; resize:none; width:470px; border-radius:3px; resize:vertical; font-size:13px; word-wrap:break-word; float:left; margin-bottom:3px; }</style>");
$('head').append("<style> .inspect_box_textarea { padding-left:5px; color:#fff !important; resize:none; width:500px; border-radius:3px; resize:vertical; font-size:13px; word-wrap:break-word; }</style>");
$('head').append("<style> .css_box_textarea     { padding-left:5px; color:#fff !important; resize:none; width:485px; border-radius:3px; resize:vertical; font-size:13px; word-wrap:break-word; height:20px; }</style>");

$('head').append("<style> .box_container_ { position:fixed; bottom:10px; right:20px; z-index:1000000000000000000000; }</style>");

$('body').append("<div class='box_container_'></div>");

$('.box_container_').append("<div id = 'inspect_box' class='inspect_style_'><textarea class='inspect_box_textarea' style='background-color:rgba(50,50,50,0.6) !important;'></textarea></div>");
$('.box_container_').append("<div id = 'log_box' class='log_style_'><xmp class='log_box_html' style='background-color:rgba(255,0,0, 0.5) !important;'></xmp></div>");
$('.box_container_').append("<div id = 'console_box' class='console_style_'><textarea class='console_box_textarea' placeholder='console' style='background-color:rgba(100,30,0,0.6) !important;'></textarea></div>");
$('.box_container_').append("<button id = 'shortcut_button' class='shortcut_style_' type='button'>+</button>");

setHeight($('#console_box textarea'));

var key = false;
var selected;
var map = [];
$('#inspect_box, #log_box, #console_box, #shortcut_button').hide();
var err_iter = 0;
var hover_iter = 0;
var fadeTimeout;
var hover_interval;

$(document).keydown(function(e){
    if (e.which == 8) map[e.keyCode] = e.type == 'keydown';
    else if (e.which == 18) key = true;

    var canDelete = !(e.target == $('#inspect_box textarea')[0] ||
                      e.target == $('#console_box textarea')[0]);

    if (key && map[8] && canDelete ) deleteSelected();

});

$(document).keyup(function(e){
    if (e.which == 18) key = false;
    else if (e.which == 8 || e.which == 16 || e.which == 13) {
        map[e.keyCode] = e.type == 'keydown';
    }

});

$('#shortcut_button').click(function(){
    var css_value = $('#console_box textarea').val();
    if (!css_value) {fadeFunction('You must type in the console box the css property name!\n(e.g. "background-color")', 'err'); return;}
    $('#console_box textarea').val('');
    var tmp_css_input = $("<div class='css_input_'><textarea class='css_box_textarea' style='background-color:rgba(0,30,100,0.6) !important;' placeholder='"+css_value+"' data-css='"+css_value+"'></textarea><div class ='remove_btn_'  style='position:relative; margin-top:-2px; float:right; cursor:pointer;'>x</div></div>")[0];
    $('.box_container_').append(tmp_css_input);
    setHeight($(tmp_css_input).find('textarea'));
    $(tmp_css_input).mousemove(function(e){ if (key) return false;}).click(function(){return false;}).keydown(function(e){

        if (e.which == 16 || e.which == 13) {
            map[e.keyCode] = e.type == 'keydown';
        }
        if (map[16] && map[13]) {
            var css_text = $(this).find('textarea').data('css');
            var css_value = $(this).find('textarea').val();
            setElement(css_text, css_value);
            refreshSelected();
            return false;
        }

        setHeight($(this).find('textarea'));
    });

    $(tmp_css_input).find('.remove_btn_').click(function() {
        $(tmp_css_input).remove();
        return false;
    });

    $('body').click(function() { $('.css_input_').hide(); });
});

$('#inspect_box textarea').keydown(function(e){
    if (e.which == 16 || e.which == 13) {
        map[e.keyCode] = e.type == 'keydown';
    }
    if (map[16] && map[13]) {setElement(); return false;}
}).keyup(function(e){setHeight($(this));});

$('#console_box textarea').keydown(function(e){
    if (e.which == 16 || e.which == 13) {
        map[e.keyCode] = e.type == 'keydown';
    }
    if (map[16] && map[13]) {evaluate($(this).val()); return false;}
}).keyup(function(e){setHeight($(this));});

$('#log_box').mouseover(function(){
    clearFadeTime();
    logHover('in', 0.80);
}).mouseleave(function(){
    fadeFunction();
    logHover('out', 0.50);
});


$(document).mousemove(function(e){
    if (!key) return;
    else $('#inspect_box, #console_box, #shortcut_button, .css_input_').show();
    var text = $(e.target).clone().html('').wrap('<div/>').parent().html();
    if (selected != e.target){
        $(selected).removeClass('inspect_selector_');
        selected = e.target;
        $('#inspect_box textarea').val(text);
        setHeight($('#inspect_box textarea'));
        $(selected).addClass('inspect_selector_');
    }
}).find('#inspect_box, #console_box, #log_box, #shortcut_button, .box_container_').mousemove(function(e){ if (key) return false;});

$('body').click(function(e){$('#inspect_box, #console_box, #shortcut_button').hide(); $(selected).removeClass('inspect_selector_');}).find('#inspect_box, #console_box, #log_box, #shortcut_button, .css_input_').click(function(e){return false;});

function setElement(css_text, css_value) {
    try {
        var html_content = $(selected).html();
        var new_element = $($('#inspect_box textarea').val())[0];
        if (css_text && css_value) new_element = $(new_element).css(css_text, css_value)[0];
        $(selected).replaceWith(new_element);
        selected = new_element;
        if (!($(new_element).html())) selected = ($(new_element).html(html_content))[0];
    }
    catch(e) {
        var interval = setInterval(function(){
            var red = Math.floor(50+Math.sin(err_iter)*50);
            var gb = Math.floor(50-Math.sin(err_iter)*50);
            var alpha = 0.6+Math.sin(err_iter)*0.15;
            $('#inspect_box textarea').css('background-color', 'rgba('+red+','+gb+','+gb+','+alpha+')');
            err_iter+=0.1;
            if (err_iter>3.14) {
                err_iter = 0;
                clearInterval(interval);
                $('#inspect_box textarea').css('background-color', 'rgba(50,50,50,0.6)');
            }
        },5);
    }
}

function evaluate(js_evaluation_inner_text) {
    try {
        try {if ($(js_evaluation_inner_text).length) {fadeFunction('can\'t write dom elements here!', 'err'); return;}} //this try prevent from errors given by functions (log()) inside $ brackets.
        catch(e) {
            eval(js_evaluation_inner_text);
            refreshSelected();
        }
    }
    catch(e) {fadeFunction(e, 'err')}
}

function logHover(str, target) {

    clearInterval(hover_interval);
    var bgcolor = $('#log_box xmp').css('background-color');
    var std_alpha = Math.round(parseFloat(bgcolor.split(',')[3].replace(')','').trim())*100)/100;

    var sign = str=='in'? 1:-1;

    var str_bg = $('#log_box xmp').css('background-color').split(',')[0]
    +','+$('#log_box xmp').css('background-color').split(',')[1]
    +','+$('#log_box xmp').css('background-color').split(',')[2]+',';

    hover_interval = setInterval(function(){
        var alpha = Math.round(parseFloat(std_alpha + sign*Math.sin(hover_iter)*Math.abs(target - std_alpha))*100)/100;
        if (hover_iter >= 1.57) { $('#log_box xmp').css('background-color', str_bg+' '+target+')'); hover_iter = 0; clearInterval(hover_interval); }
        else {
            $('#log_box xmp').css('background-color', str_bg+' '+alpha+')');
            hover_iter+=0.05;
        }
    }, 5);

}

function fadeFunction(e_text, type) {
    if (type=='err') $('#log_box xmp').css('background-color', 'rgba(255,0,0,0.5');
    else if (type=='log') $('#log_box xmp').css('background-color', 'rgba(0,100,30,0.5');
    $('#log_box').fadeIn('fast').find('.log_box_html').html(e_text);
    clearFadeTime();
    fadeTimeout = setTimeout(function() {$('#log_box').fadeOut('fast')}, 2000);
}


function clearFadeTime() {
    clearTimeout(fadeTimeout);   
}

function deleteSelected() {
    $(selected).replaceWith('');
    selected = undefined;
    console.log(selected);
    $('#inspect_box textarea').html('');
}

function log(text) {
    if (!text) {fadeFunction ('undefined', 'err'); return;}
    if (text instanceof HTMLElement || text[0] instanceof HTMLElement) {text = $(text).clone().html('').wrap('<div/>').parent().html();}
    else if (text == []) text = 'null';
    fadeFunction(text, 'log');
}

function setHeight(e) {
    e.height(0);
    var newHeight = Math.min(e[0].scrollHeight, 400);
    e.height(newHeight);
}

function refreshSelected() {
    var new_text = $(selected).clone().html('').wrap('<div/>').parent().html();
    $('#inspect_box textarea').val(new_text);
    setHeight($('#inspect_box textarea'));   
}