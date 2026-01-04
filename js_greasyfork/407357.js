// ==UserScript==
// @name        Niconico Seiga, コメント改善(Greasemonkey 3.17ver)
// @description ニコニコ静画のコメントを全て表示し邪魔な広告を消します
// @namespace   https://greasyfork.org/ja/users/662133
// @include     https://seiga.nicovideo.jp/seiga/*
// @version     1.0.2
// @grant       none
// @license     Copyright (c) 2014 Bunnelby
// @downloadURL https://update.greasyfork.org/scripts/407357/Niconico%20Seiga%2C%20%E3%82%B3%E3%83%A1%E3%83%B3%E3%83%88%E6%94%B9%E5%96%84%28Greasemonkey%20317ver%29.user.js
// @updateURL https://update.greasyfork.org/scripts/407357/Niconico%20Seiga%2C%20%E3%82%B3%E3%83%A1%E3%83%B3%E3%83%88%E6%94%B9%E5%96%84%28Greasemonkey%20317ver%29.meta.js
// ==/UserScript==
(function () {
    var window = typeof unsafeWindow == "undefined" ? window : unsafeWindow, document = window.document;
    var $ = window.jQuery;
    $(function () {
        var css = '\
#ko_comment #comment_list { max-height: 500px!important; overflow-y: auto; padding-top: 3px; padding-right: 11px; margin-bottom: 20px; }\
#ko_comment .comment_list_item li.text { margin-top: 10px; margin-bottom: 0px!important; }\
#ko_comment .comment_list_item li.date { display: inline!important;position: static; top: 0px; left: 32px; }\
#ko_comment .comment_list_item li.id { display: inline!important; position: static; top: 0px; left: 112px; }\
#ko_comment .comment_list_item li.count_new { position: static!important; top: 0px;left: 4px; Opacity: 0.8; }\
#ko_comment .res { position: relative; left: -15px!important; margin-top: 0px!important; padding-top:0px;background-color: #fff; z-index: 1001; \
box-shadow:rgb(255, 255, 255) 0px -10px 10px 10px;\
-webkit-box-shadow:rgb(255, 255, 255) 0px -10px 10px 10px;\
-moz-box-shadow:rgb(255, 255, 255) 0px -10px 10px 10px;\
}\
#ko_comment.illust_comment{padding-right: 1px;}\
div.comment_post_button{margin-right: 15px;}\
input#comment_post_input.content{width: 261px;}\
div.comment_text.message_target{width: 296px; margin-left: 15px;}\
div[id^="ads_pc_seiga"] {display:none !important;}\
';
        $("head").append($("<style />").text(css));
        
        var vm = window.ko.contextFor($("#ko_comment")[0]).$rawData;
        if (vm.commentShowCount() < vm.commentCount()) {
            vm.reload();
        }
    });
})();

(window.onload = function () {
    setTimeout(function(){
        var obj = document.getElementById('comment_list');
        obj.scrollTop = obj.scrollHeight;
    },700);
})();