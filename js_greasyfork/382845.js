// ==UserScript==
// @name         DLSite Quick EX
// @namespace    DLSiteQuickEX
// @version      1.0
// @description  Easy DLSite game search
// @author       Aziien
// @match        *://www.dlsite.com/*/work/=/product_id/*
// @match        *://www.dlsite.com/*/announce/=/product_id/*
// @match        *://www.dlsite.com/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.4.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382845/DLSite%20Quick%20EX.user.js
// @updateURL https://update.greasyfork.org/scripts/382845/DLSite%20Quick%20EX.meta.js
// ==/UserScript==

(function() {
    'use strict';
    Number.prototype.pad = function(size) {
        var s = String(this);
        while (s.length < (size || 2)) {s = "0" + s;}
        return s;
    }
    var asiaTime = new Date().toLocaleString("en-US", {timeZone: "Asia/Tokyo"});
    asiaTime = new Date(asiaTime);
    var timeSplit = asiaTime.toLocaleString("da-DK").split(' ');
    var time = 'Japan time | Date ' + timeSplit[0].replace('.', ' / ').replace('.', ' - ') + ' | Time ' + timeSplit[1].replace('.', ':');

    $('.eisysGroupHeaderService').append('<li class="is-active"><a href="#" class="pro notranslate JapanTime" style="color:#e6e6e6;">' + time + '</a></li>');

    setInterval(function() {
        var asiaTime = new Date().toLocaleString("en-US", {timeZone: "Asia/Tokyo"});
        asiaTime = new Date(asiaTime);
        var timeSplit = asiaTime.toLocaleString("da-DK").split(' ');
        var countDown = timeSplit[1].split('.');
        var time = 'Japan time | Date ' + timeSplit[0].replace('.', ' / ').replace('.', ' - ') + ' | Time ' + timeSplit[1].replace('.', ':').replace('.', ':') + ' [' + (23 - countDown[0]).pad() + ':' + (60 - countDown[1]).pad() + ':' + (60 - countDown[2]).pad() + ']';
        $('.JapanTime').text(time);
    }, 100);


    var engURL = window.location.href.replace('product_id/RJ', 'product_id/RE');
    var jaURL = window.location.href.replace('product_id/RE', 'product_id/RJ');
    //$('#work_name a').attr('target', '_blank');
    var eng = window.location.href.indexOf('product_id/RE') >= 0;
    if(eng){
        $('#work_name a').prepend('\
<a title="ExHentai" href="https://exhentai.org/?f_doujinshi=1&f_manga=1&f_artistcg=1&f_gamecg=1&f_western=1&f_non-h=1&f_imageset=1&f_cosplay=1&f_asianporn=1&f_misc=1&f_search=' + $('#work_name a').text() + '&f_apply=Apply+Filter" target="_blank" class="dlsite_quick"><img src="https://exhentai.org/favicon.ico"></a>\
<a title="F95Zone" href="https://f95zone.com/search/1/?q=' + $('#work_name a').text() + '&o=relevance&c[title_only]=1" target="_blank" class="dlsite_quick"><img src="https://f95zone.com/favicon.ico" class="small"></a>\
<a title="Erokuni" href="http://dou.erokuni.net/?s=' + $('#work_name a').text() + '" target="_blank" class="dlsite_quick"><img src="data:image/png;base64,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"></a>\
<a title="Mikocon" href="https://bbs.mikocon.com/search.php?mod=forum&searchsubmit=yes&scform_submit=true&srchtxt=' + $('#work_name a').text() + '" target="_blank" class="dlsite_quick"><img src="https://bbs.mikocon.com/favicon.ico" class="small"></a>\
<a title="Switch to DLSite Japan" href="' + jaURL + '" class="dlsite_quick_JA">JA</a>\
');
    } else {
        $('#work_name a').prepend('\
<a title="ExHentai" href="https://exhentai.org/?f_doujinshi=1&f_manga=1&f_artistcg=1&f_gamecg=1&f_western=1&f_non-h=1&f_imageset=1&f_cosplay=1&f_asianporn=1&f_misc=1&f_search=' + $('#work_name a').text() + '&f_apply=Apply+Filter" target="_blank" class="dlsite_quick"><img src="https://exhentai.org/favicon.ico"></a>\
<a title="F95Zone" href="https://f95zone.com/search/1/?q=' + $('#work_name a').text() + '&o=relevance&c[title_only]=1" target="_blank" class="dlsite_quick"><img src="https://f95zone.com/favicon.ico" class="small"></a>\
<a title="Erokuni" href="http://dou.erokuni.net/?s=' + $('#work_name a').text() + '" target="_blank" class="dlsite_quick"><img src="data:image/png;base64,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"></a>\
<a title="Mikocon" href="https://bbs.mikocon.com/search.php?mod=forum&searchsubmit=yes&scform_submit=true&srchtxt=' + $('#work_name a').text() + '" target="_blank" class="dlsite_quick"><img src="https://bbs.mikocon.com/favicon.ico" class="small"></a>\
<a title="Switch to DLSite English" href="' + engURL + '" class="dlsite_quick_ENG">EN</a>\
');
    }
    $('.base_title_br div, .base_title_br a').addClass("notranslate");

    //$('#work_name a').attr('href', '');
    $('#work_name a').replaceWith(function(){
        return $('<span class="dlsite_quicker">' + $(this).html() + '</span>');
    });
    $('.dlsite_quick').css({
        'float':'left',
        'width':'auto',
        'display':'inline'
    });
    $('.dlsite_quicker a').css({
        'margin-right':'3px'
    });
    $('.dlsite_quick img').css({
        'float':'left',
        'width':'22px',
        'object-fit':'scale-down',
        'object-position':'center center',
        'margin-top':'2px'
    });
    $('.dlsite_quick img.small').css({
        'float':'left',
        'width':'18px',
        'object-fit':'scale-down',
        'object-position':'center center',
        'margin-top':'4px',
        'padding' : '1px 2px'
    });
    $('.dlsite_quick_ENG').css({
        'float' : 'left',
        'margin-top' : '4px',
        'color':'#fff',
        'background':'#e46479',
        'border-radius':'2px',
        'height':'18px',
        'display':'inline-block',
        'font-size' : '11px',
        'height' : '18px',
        'line-height' : '18px',
        'padding' : '0 5px',
        'width' : '15px',
        'font-style' : 'normal'
    });
    $('.dlsite_quick_JA').css({
        'float' : 'left',
        'margin-top' : '4px',
        'color':'#56842a',
        'background':'#e6f7d6',
        'border-radius':'2px',
        'height':'18px',
        'display':'inline-block',
        'font-size' : '11px',
        'height' : '18px',
        'line-height' : '18px',
        'padding' : '0 5px',
        'width' : '15px',
        'font-style' : 'normal'
    });
})();