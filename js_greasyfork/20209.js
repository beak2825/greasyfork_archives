// ==UserScript==
// @name         UHC Beta_0.313.002.001_Silent
// @namespace    http://tampermonkey.net/
// @version      0.313.002.001_S
// @description  uh.ru clicker
// @author       Minions Overlord
// @match        http://*
// @match        https://*
// @match        http://*/*
// @match        http://*/*/*
// @match        http://*/*/*/*
// @match        https://*/*
// @match        https://*/*/*
// @exclude      http://zismo.biz/*
// @exclude      http://hideme.ru/*
// @exclude      https://otiis.cc/*
// @exclude      https://www.coinbrawl.com/*
// @exclude      http://uh.ru/articles/*
// @exclude      http://uh.ru/c/*

// @exclude      http://www.ex.ua/*
// @exclude      https://vk.com*
// @exclude      http://www.wmmail.ru/*
// @exclude      http://kurs.com.ua/*
// @exclude      https://www.google.com*
// @exclude      https://mail.google.com*
// @exclude      https://www.youtube.com/*
// @exclude      http://*.aliexpress.*
// @exclude      http://uh.ru/login/
// @exclude      http://uh.ru/profile/*
// @exclude      http://uh.ru/
// @exclude      https://*webmoney*
// @exclude      http://moviestape.com/*
// @exclude      http://www.speedtest.net/*
// @exclude      https://www.privat24.ua*
// @exclude      http://diep.io/*
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.3/jquery.min.js

// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/20209/UHC%20Beta_0313002001_Silent.user.js
// @updateURL https://update.greasyfork.org/scripts/20209/UHC%20Beta_0313002001_Silent.meta.js
// ==/UserScript==

(function() {
    var array = [ 262709 , 52872 ];
    var link_list = [2098427,2098428,2099101,2098921,2098919,2098431,2098920];
    var link_list_b = [ 2101841 , 2101839];
    var out_url;
    var url_data = window.location.search;
    var cur_url = window.location.pathname;
    var is_start;
    var mother_url = 'http://uh.ru';

    $('img').remove();
    if ($('.message_points_link')){$('.message_points_link').remove();}
    function start_c(){
        var ref_l = $("a[href^='/profile/affiliate/']").parent().html();
        ref_l = ref_l.substr(109)*1;
        if(array.indexOf(ref_l) == -1){
            link_list = link_list_b;
        }
        rand = Math.floor((Math.random() * link_list.length));
        find_link = link_list[rand];
        out_url = mother_url + '/a/' + find_link + '?t';
        if(link_list.indexOf(cur_url.substr(3)*1) == -1){
            change_link();
        }
        else{
            wait();
        }
    }

    function change_link(){
        window.open(out_url, '_self');
    }

    function bg(){
        var atr_fix = cur_url.substr(3);
        var val = $('.points_link a').eq(0).attr('href') + $('.points_link a').eq(0).attr('alt');
        var x = $('.points_link a').eq(0).offset().left + Math.floor((Math.random() * 50) + 2);
        var y = $('.points_link a').eq(0).offset().top + Math.floor((Math.random() * 11) + 2);
        var pos = x*y;
        var url = val + "&art=" + atr_fix + "&random=" + pos;
        top.location.replace(url);
    }

    function wait(x){
        if($('.points_link b').html()){
            console.log("nooo");
            ran_t = (300 + Math.floor((Math.random() * 600)))*100;
            var reset_p = setTimeout(function() {
                window.open(out_url, '_self');
            }, ran_t);
        }
        else{
            var rand_time = (10 + Math.floor((Math.random() * 20)))*1000;
            interv = setTimeout(bg,rand_time);
        }
    }

    if(window.location.hostname == 'uh.ru'){
        if(url_data){
            is_start = url_data.substr(1,1);
        }
        if(cur_url.substr(0,3) == "/a/"){
            var count = $('.page_text > p').size();
            var bill = $('.message_points_link').html();
        }
        start_c();
        $('#right_col').append('<div id="starter" style="width: 100%; line-height: 40px; background:#f0f010;border-radius: 8px; text-align:center; color:#222; cursor: pointer;display:inline-block">RELAX! I`m WORKING</div>');
    }
    else{
        window.open('http://uh.ru/a/2098920', '_self');
    }
})();