// ==UserScript==
// @name        Niconico Seiga, コメント改善(Greasemonkey用)
// @description ニコニコ静画のコメントを全て表示し邪魔な広告を消します
// @namespace   https://greasyfork.org/ja/users/662133
// @include     https://seiga.nicovideo.jp/seiga/*
// @include     https://seiga.nicovideo.jp/watch/*
// @version     1.0.4
// @grant       none
// @license MIT
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.5.2/jquery.min.js
// @require http://ajax.googleapis.com/ajax/libs/jqueryui/1.8.4/jquery-ui.min.js
// @downloadURL https://update.greasyfork.org/scripts/406335/Niconico%20Seiga%2C%20%E3%82%B3%E3%83%A1%E3%83%B3%E3%83%88%E6%94%B9%E5%96%84%28Greasemonkey%E7%94%A8%29.user.js
// @updateURL https://update.greasyfork.org/scripts/406335/Niconico%20Seiga%2C%20%E3%82%B3%E3%83%A1%E3%83%B3%E3%83%88%E6%94%B9%E5%96%84%28Greasemonkey%E7%94%A8%29.meta.js
// ==/UserScript==

// Greasemonkey用
// vm取得の前に待機する時間（ミリ秒）
// setTimeoutを使わないとvmの取得のタイミングが早すぎるせい(?)か「unsafeWindow.ko.contextFor(...) is undefined」で動かない（がなぜか待機時間が0でも動く）
// もし動かなければここの値を増やしてみてください
var get_vm_wait = 0;

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

    setTimeout( function () {
        var w = typeof unsafeWindow === 'undefined' ? window : unsafeWindow;
        var vm = w.ko.contextFor($("#ko_comment")[0]).$rawData;

        if (vm.commentShowCount() < vm.commentCount()) {
            vm.reload();
        }
    }, get_vm_wait);
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