// ==UserScript==
// @name         TW QuickBar
// @namespace    ILLEGAL
// @version      1.0
// @description  Script that creates a premium-like quickbar with the things you need the most.
// @author       GamateKID
// @include      https://*.fyletikesmaxes.gr/*
// @icon         http://s3.amazonaws.com/uso_ss/icon/129407/large.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27664/TW%20QuickBar.user.js
// @updateURL https://update.greasyfork.org/scripts/27664/TW%20QuickBar.meta.js
// ==/UserScript==

function getParameter(name) {
  name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
  results = regex.exec(location.search);
  return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

var villageID = getParameter('village');

var bgColor = '#333';
var bgColorHover = '#666';
var borderColor = '#666';
var borderColorHover = '#666';
var textColor = 'aliceblue';
var textColorHover = '';
var textShadow = '1px 1px #111, 2px 2px #111';
var textShadowHover =' 1px 1px 2px aqua';

var quickbar=
    '<br><ul id="tw-quickbar">' +
        '<li name="http://gr45.tribalwarsmap.com/gr/" target="_blank">' +
            '<a href="http://gr45.tribalwarsmap.com/gr/" target="_blank"></a>'+
            '<img src="https://s14.postimg.org/mwpywnc8h/mapico.png">' +
            '<div>TW Map</div>' +
        '</li>' +
        '<li name="http://gr.twstats.com/gr45/index.php" target="_blank">' +
            '<a href="http://gr.twstats.com/gr45/index.php" target="_blank"></a>'+
            '<img src="https://s21.postimg.org/9swfi8j1z/twstats.png">' +
            '<div>TW Stats</div>' +
        '</li>' +
        '<li name="/game.php?screen=event_royalty" target="_self">' +
            '<a href="/game.php?screen=event_royalty" target="_self"></a>'+
            '<img src="https://dsgr.innogamescdn.com/8.74/32382/graphic/events/easter2014/logo.png">' +
            '<div>Event</div>' +
        '</li>' +
        '<li name="/game.php?screen=main" target="_self">' +
            '<a href="/game.php?screen=main" target="_self"></a>'+
            '<img src="/graphic/buildings/main.png">' +
            '<div>Επιτελείο</div>' +
        '</li>' +
        '<li name="/game.php?screen=train" target="_self">' +
            '<a href="/game.php?screen=train" target="_self"></a>'+
            '<img src="/graphic/buildings/barracks.png">' +
            '<div>Στρατολόγηση</div>' +
        '</li>' +
        '<li name="/game.php?village='+villageID+'&screen=place" target="_self">' +
            '<a href="/game.php?village='+villageID+'&screen=place" target="_self"></a>'+
            '<img src="/graphic/buildings/place.png">' +
            '<div>Εντολές</div>' +
            '<ul>' +
                '<li name="/game.php?screen=place&mode=sim" target="_self" rowspan="1">' +
                 '<a href="/game.php?screen=place&mode=sim" target="_self">'+
                    '<div>' +
                        '<img src="/graphic/big_buildings/place1.png">' +
                        '&nbsp;&nbsp;Προσομοιωτής' +
                    '</div>' +
                  '</a>'+
                '</li>' +
                '<li name="/game.php?screen=place&mode=units" target="_self" rowspan="1">' +
                 '<a href="/game.php?screen=place&mode=units" target="_self">'+
                    '<div>' +
                        '<img src="/graphic/unit/unit_spear.png">' +
                        '&nbsp;&nbsp;     Στρατεύματα' +
                    '</div>' +
                  '</a>'+
                '</li>' +
            '</ul>' +
        '</li>' +
    '</ul><br><br><br>';

$('.maincell').prepend(quickbar);

$('#tw-quickbar').css({
    'margin':'0px',
    'padding':'0px',
    'position':'fixed',
    'list-style':'none',
    'display':'inline-table',
    'z-index':'666',
    'width':'inherit'
});

$('#tw-quickbar li').css({
    'background-color':bgColor,
    'border-color':borderColor,
    'border-width':'1px',
    'border-radius':'0px',
    'border-style':'solid',
    'text-align':'center',
    'display':'block'
});
$('#tw-quickbar >li').css({
    'width':'161px',
    'height':'50px',
    'display':'table-cell',
    'vertical-align':'middle'
});
$('#tw-quickbar li a').css({
    'width':'inherit',
    'height':'inherit',
    'margin-left': '-72px',
    'position': 'fixed',
    'margin-top':'-6px'
});
$('#tw-quickbar ul').css({
    'margin':'-1px',
    'padding':'0px',
    'top':'53px',
    'position':'absolute',
    'display':'none',
    'list-style':'none'
});

$('#tw-quickbar ul>li').css({
    'width':'157px',
    'height':'30px',
    'display':'block'
});
$('#tw-quickbar li ul li div').css({
    'padding-top':'12px'
});
$('#tw-quickbar li ul li div img').css({
    'float':'left',
    'margin-left': '3px'
});
$('#tw-quickbar li ul li div span').css({
    'margin-top':'5px',
    'float':'right'
});

$('#tw-quickbar div').css({
    'font-family':'verdana',
    'font-weight':'bold',
    'font-size':'14px',
    'text-shadow': textShadow,
    'color':textColor
});
$('#tw-quickbar img').css({
    'width':'18px',
    'height':'18px'
});

$('#tw-quickbar li').hover(function(){
        $(this).css({
            'cursor':'pointer',
            'border-color':borderColorHover,
            'background-color':bgColorHover
        }).find('ul').show();
        $('>div',this).css('text-shadow',textShadowHover);
},
function(){
    $(this).css({
        'cursor':'default',
        'border-color':borderColor,
        'background-color':bgColor
    }).find('ul').hide();
    $('>div',this).css('text-shadow',textShadow);
});

$('#tw-quickbar li').click(function(){
    window.open($(this).attr('name'),$(this).attr('target'));
});

$('#menu_row2 td b.nowrap').css('color','white');
$('#menu_row2 td b.nowrap').hover(function(){
    $(this).css('text-shadow',textShadowHover);
},
function(){
   $(this).css('text-shadow',textShadow);
});

$('#menu_row2 td.box-item').eq(1).prepend('<a id="maplink" class="nowrap tooltip-delayed" href="/game.php?village='+villageID+'&screen=map">');
$('#menu_row2 td b.nowrap').prependTo("#maplink");

$("#menu_row > td.menu-item:not(#topdisplay)").hover(function(){
    $(this).css({'background':'none','text-shadow':'2px 2px 2px black,3px 3px 3px aqua'});
});
$("#menu_row > td.menu-item:not(#topdisplay) > a").hover(function(){
    $(this).css({'background':'none','text-shadow':'2px 2px 2px black,3px 3px 3px black'});
});

$( "#rtr_silver_balance" ).parent().css( "margin-top", "-5px" );
