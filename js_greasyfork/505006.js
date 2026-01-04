// ==UserScript==
// @name        Niconico Seiga, コメント改善(Tampermonkey用)
// @description ニコニコ静画のコメントを全て表示し邪魔な広告を消します
// @namespace   https://greasyfork.org/ja/users/662133
// @include     https://seiga.nicovideo.jp/seiga/*
// @include     https://seiga.nicovideo.jp/watch/*
// @version     1.0.0
// @grant       none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/505006/Niconico%20Seiga%2C%20%E3%82%B3%E3%83%A1%E3%83%B3%E3%83%88%E6%94%B9%E5%96%84%28Tampermonkey%E7%94%A8%29.user.js
// @updateURL https://update.greasyfork.org/scripts/505006/Niconico%20Seiga%2C%20%E3%82%B3%E3%83%A1%E3%83%B3%E3%83%88%E6%94%B9%E5%96%84%28Tampermonkey%E7%94%A8%29.meta.js
// ==/UserScript==
(function () {
    var $ = window.jQuery;
    $('#ko_comment #comment_list').css({'max-height':'500px','overflow-y':'auto','padding-top':'3px','padding-right':'11px','margin-bottom':'20px'});
    $('#ko_comment .comment_list_item li.text').css({'margin-top':'10px'});
    $('#ko_comment .comment_list_item li.date').css({'position':'static','top':'0px','left':'32px'});
    $('#ko_comment .comment_list_item li.id').css({'position':'static','top':'0px','left':'112px'});
    $('#ko_comment .comment_list_item li.count_new').css({'position':'static','top':'0px','left':'4px','Opacity':'0.8'});
    $('#ko_comment .res').css({'position':'relative','left':'-15px','margin-top':'0px','padding-top':'0px','background-color':'#fff','z-index':'1001','box-shadow':'rgb(255, 255, 255) 0px -10px 10px 10px','-webkit-box-shadow':'rgb(255, 255, 255) 0px -10px 10px 10px','-moz-box-shadow':'rgb(255, 255, 255) 0px -10px 10px 10px'});
    $('#ko_comment.illust_comment').css({'padding-right':' 1px'});
    $('div.comment_post_button').css({'margin-right':'15px'});
    $('input#comment_post_input.content').css({'width':'261px'});
    $('div.comment_text.message_target').css({'width':'296px','margin-left':'15px'});
    $('div.illust_main.cfix div.illust_side div#ads_pc_seiga_illust_watch_east').css({'display':'none'});

    var vm = window.ko.contextFor($("#ko_comment")[0]).$rawData;

    if (vm.commentShowCount() < vm.commentCount()) {
        vm.reload();
    }

})();

(function () {
    var target = document.getElementById('comment_list');

    function example() {
        var obj = document.getElementById('comment_list');
        obj.scrollTop = obj.scrollHeight;
    }

    var mo = new MutationObserver(example);
    mo.observe(target, {childList: true});

})();