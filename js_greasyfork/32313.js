// ==UserScript==
// @name                oneClickRemoveWeiboPost
// @name:zh-CN          oneClickRemoveWeiboPost 一键删除微博
// @name:zh-HK          oneClickRemoveWeiboPost 一键删除微博
// @name:zh-TW          oneClickRemoveWeiboPost 一键删除微博
// @name:en             oneClickRemoveWeiboPost
// @name:ja             oneClickRemoveWeiboPost 一键删除微博
// @namespace           https://github.com/catscarlet/oneClickRemoveWeiboPost
// @description         在新浪微博(weibo.com)的个人页面添加一个[删除]按钮，点击直接删除此条微博
// @description:zh-CN   在新浪微博(weibo.com)的个人页面添加一个[删除]按钮，点击直接删除此条微博
// @description:zh-HK   在新浪微博(weibo.com)的個人頁面添加一個[删除]按鈕，點擊直接刪除此條微博
// @description:zh-TW   在新浪微博(weibo.com)的個人頁面添加一個[删除]按鈕，點擊直接刪除此條微博
// @description:en      Add a [一键删除] button to directly delete the post by one click. No <确认/取消> any more.
// @description:ja      在フォロワーページに[X]ボタンを追加します。 ワンクリックで、迷惑なフォロワーを直接削除します。これ以上の<Y / N>はありません。
// @version             0.0.2
// @author              catscarlet
// @match               https://weibo.com/*
// @require             https://code.jquery.com/jquery-latest.min.js
// @compatible          chrome  支持
// @run-at              document-end
// @grant               none
// @downloadURL https://update.greasyfork.org/scripts/32313/oneClickRemoveWeiboPost.user.js
// @updateURL https://update.greasyfork.org/scripts/32313/oneClickRemoveWeiboPost.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var $ = $ || window.$;
    var postcount = 0;

    $(function() {
        console.log('oneClickRemoveWeiboPost loaded');

        setTimeout(f, 1000);

        function f() {
            if ($('.WB_feed.WB_feed_v3.WB_feed_v4').attr('module-type') != 'feed') {
                //console.log('page not match oneClickRemoveWeiboPost');
                setTimeout(f, 2000);
            } else {
                getPosts();
                setTimeout(f, 2000);
            };
        }
    });

    function detectPage() {
        return 0;
    }

    function getPosts() {
        var post_list = $('.WB_cardwrap.WB_feed_type.S_bg2.WB_feed_like');


        postcount = post_list.length;

        $('.WB_cardwrap.WB_feed_type.S_bg2.WB_feed_like').attr('oneClickRemoveWeiboPostCount', postcount);

        $(post_list).each(function() {
            var postdiv = $(this);
            if (postdiv.hasClass('WB_cardwrap WB_feed_type S_bg2 WB_feed_like ')) {
                var opt_box = postdiv.find('.screen_box');

                if (!opt_box.attr('oneClickRemoveWeiboPostBtn')) {
                    var mid;
                    mid = $(postdiv).attr('mid');
                    var str = '<a href="javascript:;" class="W_ficon ficon_arrow_down S_ficon removePostDirectlyBtn" style="background-color: #D0EEFE" action-type="removePostDirectly" mid="' + mid + '">删除</a>';

                    opt_box.attr('oneClickRemoveWeiboPostBtn', 1);
                    opt_box.prepend(str);

                    $('.removePostDirectlyBtn').off('click');
                    $('.removePostDirectlyBtn').on('click', removePostDirectly);
                }
            }
        });

    };


    function removePostDirectly() {
        var thisBtn = $(this);
        thisBtn.off('click');
        thisBtn.text('移除');
        thisBtn.css('background-color', '#32a2d5');

        var mid = $(this).attr('mid');
        var data = 'mid=' + mid;
        var thisli = $(this).parent().parent().parent().parent();

        $.ajax({
            type: 'POST',
            url: '/aj/mblog/del?ajwvr=6',
            data: data,
            dataType: 'json',
            async: true,
            success: function(msg) {
                var code = msg.code;
                if (code == 100000) {
                    console.log('移除微博：' + mid + '成功');
                    console.log(thisli);
                    thisli.remove();
                } else {
                    thisBtn.css('background-color', '#9e9e9e');
                    thisBtn.text('失败');
                    console.log('移除微博：' + mid + '失败，可能是网络错误，或是微博更新了界面。');
                    console.log(msg);
                }
            },
            error: function(msg) {
                thisBtn.css('background-color', '#9e9e9e');
                thisBtn.text('失败');
                console.log('移除微博：' + mid + '失败，可能是网络错误，或是微博更新了界面。');
                console.log(msg);
            }
        });
    }
})();
