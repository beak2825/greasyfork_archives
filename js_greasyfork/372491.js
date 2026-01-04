// ==UserScript==
// @name         EN timeouts
// @namespace    http://tampermonkey.net/
// @version      0.4 
// @author       Ton
// @match        *.en.cx/GameStat.aspx*
// @require	 https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js 
// @grant        none
// @description try to take over the world!
// @downloadURL https://update.greasyfork.org/scripts/372491/EN%20timeouts.user.js
// @updateURL https://update.greasyfork.org/scripts/372491/EN%20timeouts.meta.js
// ==/UserScript==

(function($){var a=$.fn.jquery.split("."),b;for(b in a)a[b]=parseInt(a[b]);if(!$.browser&&(1<a[0]||9<=a[1])){a={browser:void 0,version:void 0,mobile:!1};navigator&&navigator.userAgent&&(a.ua=navigator.userAgent,a.webkit=/WebKit/i.test(a.ua),a.browserArray="MSIE Chrome Opera Kindle Silk BlackBerry PlayBook Android Safari Mozilla Nokia".split(" "),/Sony[^ ]*/i.test(a.ua)?a.mobile="Sony":/RIM Tablet/i.test(a.ua)?a.mobile="RIM Tablet":/BlackBerry/i.test(a.ua)?a.mobile="BlackBerry":/iPhone/i.test(a.ua)?
a.mobile="iPhone":/iPad/i.test(a.ua)?a.mobile="iPad":/iPod/i.test(a.ua)?a.mobile="iPod":/Opera Mini/i.test(a.ua)?a.mobile="Opera Mini":/IEMobile/i.test(a.ua)?a.mobile="IEMobile":/BB[0-9]{1,}; Touch/i.test(a.ua)?a.mobile="BlackBerry":/Nokia/i.test(a.ua)?a.mobile="Nokia":/Android/i.test(a.ua)&&(a.mobile="Android"),/MSIE|Trident/i.test(a.ua)?(a.browser="MSIE",a.version=/MSIE/i.test(navigator.userAgent)&&0<parseFloat(a.ua.split("MSIE")[1].match(/[0-9\.]{1,}/)[0])?parseFloat(a.ua.split("MSIE")[1].match(/[0-9\.]{1,}/)[0]):
"Edge",/Trident/i.test(a.ua)&&/rv:([0-9]{1,}[\.0-9]{0,})/.test(a.ua)&&(a.version=parseFloat(a.ua.match(/rv:([0-9]{1,}[\.0-9]{0,})/)[1].match(/[0-9\.]{1,}/)[0]))):/Chrome/.test(a.ua)?(a.browser="Chrome",a.version=parseFloat(a.ua.split("Chrome/")[1].split("Safari")[0].match(/[0-9\.]{1,}/)[0])):/Opera/.test(a.ua)?(a.browser="Opera",a.version=parseFloat(a.ua.split("Version/")[1].match(/[0-9\.]{1,}/)[0])):/Kindle|Silk|KFTT|KFOT|KFJWA|KFJWI|KFSOWI|KFTHWA|KFTHWI|KFAPWA|KFAPWI/i.test(a.ua)?(a.mobile="Kindle",
/Silk/i.test(a.ua)?(a.browser="Silk",a.version=parseFloat(a.ua.split("Silk/")[1].split("Safari")[0].match(/[0-9\.]{1,}/)[0])):/Kindle/i.test(a.ua)&&/Version/i.test(a.ua)&&(a.browser="Kindle",a.version=parseFloat(a.ua.split("Version/")[1].split("Safari")[0].match(/[0-9\.]{1,}/)[0]))):/BlackBerry/.test(a.ua)?(a.browser="BlackBerry",a.version=parseFloat(a.ua.split("/")[1].match(/[0-9\.]{1,}/)[0])):/PlayBook/.test(a.ua)?(a.browser="PlayBook",a.version=parseFloat(a.ua.split("Version/")[1].split("Safari")[0].match(/[0-9\.]{1,}/)[0])):
/BB[0-9]{1,}; Touch/.test(a.ua)?(a.browser="Blackberry",a.version=parseFloat(a.ua.split("Version/")[1].split("Safari")[0].match(/[0-9\.]{1,}/)[0])):/Android/.test(a.ua)?(a.browser="Android",a.version=parseFloat(a.ua.split("Version/")[1].split("Safari")[0].match(/[0-9\.]{1,}/)[0])):/Safari/.test(a.ua)?(a.browser="Safari",a.version=parseFloat(a.ua.split("Version/")[1].split("Safari")[0].match(/[0-9\.]{1,}/)[0])):/Firefox/.test(a.ua)?(a.browser="Mozilla",a.version=parseFloat(a.ua.split("Firefox/")[1].match(/[0-9\.]{1,}/)[0])):
/Nokia/.test(a.ua)&&(a.browser="Nokia",a.version=parseFloat(a.ua.split("Browser")[1].match(/[0-9\.]{1,}/)[0])));if(a.browser)for(var c in a.browserArray)a[a.browserArray[c].toLowerCase()]=a.browser==a.browserArray[c];$.extend(!0,$.browser={},a)}})(jQuery);
/* - - - - - - - - - - - - - - - - - - - */

$.noConflict();
jQuery(document).ready(function($) {
    'use strict';
    let style='.floatBlock{position: fixed;right: 0;top: 0;background: #000;padding: 5px;text-align:right;}';

    $('<div/>', {id: 'floatBlock',class:'floatBlock'}).appendTo('body');
    $('<a/>',{'href':'#',text: 'Скрыть уровни с таймаутами',id: 'hideTimoutLnk'}).appendTo('#floatBlock');
    let hideTimoutLnk=$('#hideTimoutLnk');

    hideTimoutLnk.on('click',function(){
        if($(this).hasClass('hided')){
            $(this).removeClass('hided').html('Скрыть уровни с таймаутами');
            $('.dataCell .timeout').parent().show();
            $('.dataCell .timeout').parent().parent().css('background-color','');
        }else{
            $(this).addClass('hided').html('Показать уровни с таймаутами');
            $('.dataCell .timeout').parent().hide();
            $('.dataCell .timeout').parent().parent().prop('style','background-color:transparent!important;'); 
        }
        return false;
    });

    $('<br/>').appendTo('#floatBlock');
    $('<a/>',{'href':'#',text: 'Раскрасить команды',id: 'colorCommandsLnk'}).appendTo('#floatBlock');
    let colorCommandsLnk=$('#colorCommandsLnk');

    colorCommandsLnk.on('click',function(){
        let td=$('.DataTable tr:not(levelsRow) td:nth-last-child(2)');
        td.each(function(indx, element){
            $(element).trigger('click');
        });
        return false;
    });


    let colors=['#171f86','#861717','#867e17','#3c8617','#178644','#178677','#176686','#571786','#7b1786','#861768','#861744','#b52041'
                ,'#b520a8','#a620b5','#6120b5','#4620b5','#2054b5','#2098b5','#b55f20','#401203','#4a4e15','#284e15','#154e44','#15434e'
                ,'#36154e','#46154e','#4e1547','#4e1534','#4e1527','#290e17','#83848c','#0006ff','#000000' ];

    colors.forEach(function(element,indx){
        style+='.DataTable td.highlight'+(indx+1)+'{background:'+element+'!important;}';
    });
    $('head').append('<style>'+style+'</style>');
    window.ColorsCnt=colors.length;
    window.highLight=function(a) {
        if (window.PreviousTeam[a] && window.PreviousTeam[a] != 0) {
            $(".id" + a).removeClass("highlight" + window.PreviousTeam[a]);
            window.PreviousTeam[a] = 0
        } else {
            window.ColorNum = (window.ColorNum % window.ColorsCnt) + 1;
            window.PreviousTeam[a] = window.ColorNum;
            $(".id" + a).addClass("highlight" + window.ColorNum);
        }
        return false
    };

});
