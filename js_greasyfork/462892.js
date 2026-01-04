// ==UserScript==
// @name Pter Post Cache
// @namespace https://pterclub.com
// @version 0.0.4
// @description 猫站发种缓存
// @match https://pterclub.com/upload.php*
// @match https://pterclub.com/offers.php?add_offer=1
// @match https://pterclub.com/uploadgame.php?id=*
// @match https://pterclub.com/uploadgameinfo.php*
// @require https://cdn.staticfile.org/jquery/3.6.4/jquery.min.js
// @require https://cdn.jsdelivr.net/npm/sweetalert2@11.6.2/dist/sweetalert2.all.min.js
// @icon https://pterclub.com/favicon.ico
// @author freefrank
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/462892/Pter%20Post%20Cache.user.js
// @updateURL https://update.greasyfork.org/scripts/462892/Pter%20Post%20Cache.meta.js
// ==/UserScript==
/* global $ */
(function () {
    'use strict';
    var currentPage = window.location.pathname;
    var descr = "textarea[name='descr']";
    if (currentPage.includes("offers.php")) {
        descr = "textarea[name='body']";
    }
    $(document).ready(function () {
        var TOKEN_KEY_TITLE = 'newpost_title';
        var TOKEN_KEY_SUBTITLE = 'newpost_subtitle';
        var TOKEN_KEY_IMDB = 'newpost_imdb';
        var TOKEN_KEY_DOUBAN = 'newpost_douban';
        var TOKEN_KEY_DESCRIPTION = 'newpost_description';

        // Set cache
        var setpostca = function () {
            window.localStorage.setItem(TOKEN_KEY_TITLE, $("input[name='name']").val());
            window.localStorage.setItem(TOKEN_KEY_SUBTITLE, $("input[name='small_descr']").val());
            window.localStorage.setItem(TOKEN_KEY_IMDB, $("input[name='url']").val());
            window.localStorage.setItem(TOKEN_KEY_DOUBAN, $("input[name='douban']").val());
            window.localStorage.setItem(TOKEN_KEY_DESCRIPTION, $(descr).val());
        };

        // Delete cache
        var delpostca = function () {
            window.localStorage.removeItem(TOKEN_KEY_TITLE);
            window.localStorage.removeItem(TOKEN_KEY_SUBTITLE);
            window.localStorage.removeItem(TOKEN_KEY_IMDB);
            window.localStorage.removeItem(TOKEN_KEY_DOUBAN);
            window.localStorage.removeItem(TOKEN_KEY_DESCRIPTION);
            $("input[name='name']").val("");
            $("input[name='small_descr']").val("");
            $("input[name='url']").val("");
            $("input[name='douban']").val("");
            $("textarea[name='descr']").val("");
        };

        // Restore content
        var recpostca = function () {
            let title = window.localStorage.getItem(TOKEN_KEY_TITLE);
            let subtitle = window.localStorage.getItem(TOKEN_KEY_SUBTITLE);
            let imdb = window.localStorage.getItem(TOKEN_KEY_IMDB);
            let douban = window.localStorage.getItem(TOKEN_KEY_DOUBAN);
            let description = window.localStorage.getItem(TOKEN_KEY_DESCRIPTION);

            if (title) { $("input[name='name']").val(title); }
            if (subtitle) { $("input[name='small_descr']").val(subtitle); }
            if (imdb) { $("input[name='url']").val(imdb); }
            if (douban) { $("input[name='douban']").val(douban); }
            if (description) { $(descr).val(description); }
        };

        // Input content updates cache
        $("input[name='name'], input[name='small_descr'], input[name='url'], input[name='douban'], " + descr).bind("input", setpostca);

        // Focus updates cache
        $("input[name='name'], input[name='small_descr'], input[name='url'], input[name='douban'], " + descr).focus(setpostca);

// 默认发布时不删除缓存，所以不需要任何操作
//         // Delete cache on publish
//         $(document).on("click", "#qr", async function (e) {
//             e.preventDefault(); // Prevent the default behavior of the button

//             const result = await Swal.fire({
//                 title: '删除缓存',
//                 text: "是否在发布时删除已缓存内容？",
//                 icon: 'warning',
//                 showCancelButton: true,
//                 confirmButtonColor: '#3085d6',
//                 cancelButtonColor: '#d33',
//                 confirmButtonText: '是',
//                 cancelButtonText: '否'
//             });

//             if (result.isConfirmed) {
//                 delpostca();
//             }

//             // Submit the form after the decision is made
//             $(this).closest("form").submit();
//         });

        // Add buttons
        $("#qr").after('&nbsp;&nbsp;<a class="btn2" id="del_localstorage" href="javascript:void(0);">&#8855 删除缓存</a>');
        $("#qr").after('&nbsp;&nbsp;<a class="btn2" id="get_localstorage" href="javascript:void(0);">&#8634 恢复缓存</a>');

        // Restore content
        recpostca();
        // Click event handlers for buttons
        $(document).on("click", "#get_localstorage", function () {
            recpostca();

        }).on("click", "#del_localstorage", function () {
            delpostca();
        })
    });
})();