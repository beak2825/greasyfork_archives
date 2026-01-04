// ==UserScript==
// @name         Vk Background-image
// @namespace     https://vk.com/id283655449
// @version      3.0
// @description  Custom buckground
// @author       AnakonDRaG(Dmitriy)
// @match        https://vk.com/*
// @require    http://code.jquery.com/jquery-latest.min.js
// @require http://code.jquery.com/jquery-latest.min.js
// @require https://cdnjs.cloudflare.com/ajax/libs/jquery-cookie/1.4.1/jquery.cookie.js
// @downloadURL https://update.greasyfork.org/scripts/370354/Vk%20Background-image.user.js
// @updateURL https://update.greasyfork.org/scripts/370354/Vk%20Background-image.meta.js
// ==/UserScript==

var src ='';
var body = $('body');
var page_l = $('#page_layout');
var left_menu = $('#side_bar_inner');
var box_container = $('#popup_setting').find('.box_body');
var setting = null;
var title = 'Настройки фона (Vk Background)';
set_bg();
create_obj();
if(localStorage.getItem('bg_src')===null){
    localStorage.setItem('bg_src', $.cookie('c_bgsrc'));
    body.addClass('agbg');
    set_bg();
}
$('[data-button="setting"]').on({click:function(){
    open_popup();
}});
$('#popup_setting').parent().find('.box_x_button').on({click:function(){
    close_popup();
}});
$(window).ready(function(){
    if(body.css('backgrund')==="url('"+localStorage.getItem('bg_src')+"')"){ body.addClass('agbg');}
});
function create_obj() {
    body.append('<button class="flat_button" style="position:fixed;top:46px;right:2px;background:url"  data-button="setting">S</button>');
    body.prepend('<div id="body_shadow"></div>');
    body.prepend(
        "<div id='popup_setting' style='display:none'>"+
        '<div class="box_title_wrap" style="">'+
        '<div class="box_x_button" aria-label="Закрыть" tabindex="0" role="button"></div>'+
        '<div class="box_title_controls"></div>'+
        '<div class="box_title">'+title+'</div>'+
        '<div class="popup_box_container">'+
        '<div>'+
        '<div class="box_body" style="box-sizing:border-box">'+
        '<center><div class="ag_error" style="color:#ff6b6b"></div></center>'+
        '<div style="color:#333;">'+
        'Ссылка на изображение:<br>'+
        '<input type="text" class="ag_search" data-input="search" style="display:block;width:100%;">'+
        '</div>'+
        '<br><center><input type="button" class="flat_button" value="Сохранить" data-button="save"><br><br><input type="button" class="flat_button" value="Удалить настройки" data-button="clear"></center>'+
        '<br><a href="https://vk.com/id283655449" style="font-size:10px;float:right">Подписаться на автора</a><br>'+
        '</div>'+
        '</div>'+
        '</div>'+
        '</div>'+
        "</div>"+
        '<div data-bg-pop style="display:none;position:fixed;background:rgba(0,0,0,0.6);width:100%;height:100%;z-index:500"></div>');
    $('#popup_setting').css({'position':'fixed','display':'none','width':'500px','zIndex':'10000','left':'50%','marginLeft':'-250px','marginTop':'100px'});
}
$('[data-button="save"]').on({click:function(){save_setting();}});
$('[data-button="clear"]').on({click:function(){clear_setting();}});
function open_popup(){
    $('#popup_setting').css('display','block');
    $('#popup_setting').find('.box_title').html(title);
    $('[data-bg-pop]').css('display','block');}
function close_popup(){
    $('#popup_setting').css('display','none');
    $('[data-bg-pop]').css('display','none');
}
function error(text){
    var timer = 3;
    $('.ag_error').html(text);
}
function save_setting() {
    src = $('[data-input="search"]').val();
    if(src!==''){
        var if_src = src.split('/');
        if(if_src[0]=="https:"||if_src[0]=="http:"||if_src[0]=='data:image'){
            error('<img width="400" height="200" src="'+src+'">');
            localStorage.setItem('bg_src', src);
            $.cookie('c_bgsrc',localStorage.getItem('bg_src'),24*60*60*1000);
            body.addClass('agbg');
            set_bg();
        }else{
            error('Данный текс не является ссылкой');
        }
    }else{
        error('Пустое поле');}
}
function clear_setting() {
    page_l.css({'background':'none'});
    localStorage.removeItem('bg_src');
    body.removeClass('agbg');
    body.css('background','#edeef0');
}
function set_bg() {
    if(body.attr('class')=='agbg'){
        page_l.css({'background':'rgba(255,255,255,0.85)'});
        $('#wrap2').css({'background':'rgba(255,255,255,0.85)'});
    }

    if(localStorage.getItem('bg_src')!==null){
        localStorage.setItem('bg_src', localStorage.getItem('bg_src'));
        if($('title').text()!=='404 Not Found'){
            var bg = window.localStorage.getItem('bg_src');
            body.css({'background':'url('+bg+')fixed no-repeat','backgroundSize':'100% 100%'});
            page_l.css({'background':'rgba(255,255,255,0.85)'});
             $('#wrap2').css({'background':'rgba(255,255,255,0.85)'});
        }else{
            localStorage.setItem('bg_src', $.cookie('c_bgsrc'));
            body.addClass('agbg');
            set_bg();
        }
    }
}
$('#top_logout_link').on({click:function(){
    if(localStorage.getItem('bg_src')!==null){
        $.cookie('c_bgsrc',localStorage.getItem('bg_src'),24*60*60*1000);
    }
}});
//script



//Если не трудно подпишитесь :D Так же предлогайте свои идеи что добаваить или изменить /// If it's not difficult to subscribe :D Also, offer your ideas what to add or change
// https://vk.com/id283655449
