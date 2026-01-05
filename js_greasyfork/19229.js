// ==UserScript==
// @name         PersonalSkipper
// @namespace    http://tampermonkey.net/
// @version      0.21
// @description  2chアンテナサイトをスキップ。広告画面の「スキップ」ボタンを自動で押す
// @author       You
// @match        http://gihyo.jp/*?*ard=*
// @match        http://newmofu.doorblog.jp/*
// @match        http://newser.cc/date-20160505.html*
// @match        http://matome-alpha.com/*
// @match        http://2ch-c.net/*
// @require      https://code.jquery.com/jquery-2.2.3.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/19229/PersonalSkipper.user.js
// @updateURL https://update.greasyfork.org/scripts/19229/PersonalSkipper.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // aタグのjqueryオブジェクトを受け取り、hrefのアドレスに遷移する
    function gotoHref(a) {
        if(a[0]){
            location.href = a.attr('href');
            // [http://~~/]の部分が記載されていないリンクの場合の対応
            // TODO この処理はいずれ整理
            if(location.href.indexOf('http://matome-alpha.com/') != -1) {
                location.href = location.protocol + '//' + location.hostname + '/' + a.find('.entry_title_eid a').attr('href');
            }
        }
        else{
            console.log("no link found");
        }
    }
    // クエリ文字列の指定したパラメータを取得
    function getQueryParam(key) {
        if(location.search.length === 0 || key.length === 0) {
            return "";
        }
        var params = location.search.slice(1).split('&');
        var i;
        for(i = 0; i < params.length; i++) {
            var pair = params[i].split('=');
            if(pair[0] == key) {
                return pair[1];
            }
        }
        return "";
    }

    // ----------------------main----------------------
    var i;
    for(i = 0; i < 10; i++) {
        if(location.href.indexOf('http://gihyo.jp') != -1){
            if($("#skip a")[0]){
                var event = document.createEvent("MouseEvents");
                event.initEvent("click", false, true);
                $("#skip a")[0].dispatchEvent(event);
            }
        }
        else if(location.href.indexOf('http://newmofu.doorblog.jp/archives') != -1) {
            $(".title_link a").each(function(){
                if($(this).is(':visible')){
                    gotoHref($(".title_link a"));
                }
            });
        }
        else if(location.href.indexOf('http://newser.cc/date-20160505.html') != -1) {
            var id = getQueryParam('ni');
            $(".news-link").each(function(){
                if($(this).attr('data-id') === id) {
                    gotoHref($(this).find('a'));
                }
            });
        }
        else if(location.href.indexOf('http://matome-alpha.com/') != -1) {
            $(".entry_list_box").each(function(){
                if($(this).attr('ei') == getQueryParam('eid')) {
                    gotoHref($(this).find('.entry_title_eid a'));
                }
            });
        }
        else if(location.href.indexOf('http://2ch-c.net/') != -1) {
            gotoHref($('.widget-content a[style="color: rgb(255, 85, 85); font-weight: bold;"]'));
        }
    }
})();
