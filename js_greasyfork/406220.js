// ==UserScript==
// @name         dic-post-autobackup
// @namespace    https://dicmusic.club
// @version      0.0.1
// @description  海豚新帖自动备份
// @author       soleil
// @include      http*://*dicmusic.club/forums.php?action=new&forumid=*
// @grant        none
// @charset		 UTF-8
// @downloadURL https://update.greasyfork.org/scripts/406220/dic-post-autobackup.user.js
// @updateURL https://update.greasyfork.org/scripts/406220/dic-post-autobackup.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $(document).ready(function() {
        var TOKEN_KEY_TITLE = 'newpost_title';
        var TOKEN_KEY_CONTENT = 'newpost_content';

        //设置缓存
        var setpostca = function () {
            window.localStorage.setItem(TOKEN_KEY_TITLE, $("#title").val());
            window.localStorage.setItem(TOKEN_KEY_CONTENT, $("#posttext").val());
        }
        //删除缓存
        var delpostca = function () {
            window.localStorage.removeItem(TOKEN_KEY_TITLE);
            window.localStorage.removeItem(TOKEN_KEY_CONTENT);
            $("#title").val("");
            $("#posttext").val("");
        }
        //恢复内容
        var recpostca = function () {
            $("#title").val(window.localStorage.getItem(TOKEN_KEY_TITLE));
            $("#posttext").val(window.localStorage.getItem(TOKEN_KEY_CONTENT));
        }
        //输入内容更新缓存
        $("#title,#posttext").bind("input", setpostca );
        //鼠标聚焦更新缓存
        $("#title,#posttext").focus( setpostca );
        //发布文章删除缓存
        //$('#submit_button').on("click", delpostca );
        $(document).on("click", "#get_localstorage", function() {//一键恢复
            recpostca();
        }).on("click", "#del_localstorage", function() {//删除缓存
            $("#title").val("");
            $("#posttext").val("");
            delpostca();
        });
        //增加按钮
        $("#buttons").prepend('&nbsp;&nbsp;<a class="button button-primary" id="del_localstorage"  href="javascript:void(0);">&#8855 删除缓存</a>');
        $("#buttons").prepend('&nbsp;&nbsp;<a class="button button-primary" id="get_localstorage"  href="javascript:void(0);">&#8634 一键恢复</a>');

        //恢复内容
        recpostca();
    });
})();