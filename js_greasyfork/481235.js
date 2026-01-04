// ==UserScript==
// @name         Pter Post Cache
// @namespace    https://pterclub.com
// @version      0.0.6
// @description  猫站论坛缓存
// @author       BbLaCk
// @credits      soleil
// @include      http*://*pterclub.com/forums.php?action=newtopic&forumid=*
// @include      http*://pterclub.com/forums.php?action=reply*
// @include      http*://*pterclub.com/forums.php?action=editpost&postid=*
// @include      http*://pterclub.com/forums.php?action=quotepost*
// @require      https://cdn.staticfile.org/jquery/3.5.1/jquery.min.js
// @charset		 UTF-8
// @downloadURL https://update.greasyfork.org/scripts/481235/Pter%20Post%20Cache.user.js
// @updateURL https://update.greasyfork.org/scripts/481235/Pter%20Post%20Cache.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $(document).ready(function() {
        var TOKEN_KEY_TITLE = 'newpost_title';
        var TOKEN_KEY_CONTENT = 'newpost_content';

        //设置缓存
        var setpostca = function () {
            window.localStorage.setItem(TOKEN_KEY_TITLE, $("input[name='subject']").val());
            window.localStorage.setItem(TOKEN_KEY_CONTENT, $("#body").val());
        };
        //删除缓存
        var delpostca = function () {
            let msg = "真的要删除缓存吗？删除缓存后文章内容将消失！";
            if (confirm(msg)===true){
                window.localStorage.removeItem(TOKEN_KEY_TITLE);
                window.localStorage.removeItem(TOKEN_KEY_CONTENT);
                $("input[name='subject']").val("");
                $("#body").val("");
            }

        };
        //恢复内容
        var recpostca = function () {
            let title = window.localStorage.getItem(TOKEN_KEY_TITLE);
            let post = window.localStorage.getItem(TOKEN_KEY_CONTENT);
            if (title){$("input[name='subject']").val(title);}
            if (post){$("#body").val(post);}
            console.log(window.localStorage.getItem(TOKEN_KEY_CONTENT))
        };
        //输入内容更新缓存
        $("input[name='subject'],#body").bind("input", setpostca );
        //鼠标聚焦更新缓存
        $("input[name='subject'],#body").focus( setpostca );
        //发布文章删除缓存
        //$('#submit_button').on("click", delpostca );
        $(document).on("click", "#get_localstorage", function() {//一键恢复
            recpostca();
        }).on("click", "#del_localstorage", function() {//删除缓存
            delpostca();
        });
        //增加按钮
        $("#previewbutton").after('&nbsp;&nbsp;<a class="btn2" id="del_localstorage"  href="javascript:void(0);">&#8855 删除缓存</a>');
        $("#previewbutton").after('&nbsp;&nbsp;<a class="btn2" id="get_localstorage"  href="javascript:void(0);">&#8634 恢复缓存</a>');
        //恢复内容
        if (window.location.href.includes('forums.php?action=editpost&postid=') === false && window.location.href.includes('forums.php?action=quotepost&postid=') === false){recpostca()}
    });
})();

