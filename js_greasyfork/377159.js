// ==UserScript==
// @name         WordPress编辑器文章备份
// @namespace    https://gitcafe.net
// @version      0.3.2
// @description  给WordPress网站站长提供文章自动容灾备份的小脚本
// @author       云落
// @include      */wp-admin/post*
// @require      https://lf3-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/1.9.1/jquery.min.js
// @grant        none
// @charset		 UTF-8
// @run-at		 document-end
// @downloadURL https://update.greasyfork.org/scripts/377159/WordPress%E7%BC%96%E8%BE%91%E5%99%A8%E6%96%87%E7%AB%A0%E5%A4%87%E4%BB%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/377159/WordPress%E7%BC%96%E8%BE%91%E5%99%A8%E6%96%87%E7%AB%A0%E5%A4%87%E4%BB%BD.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const GetId = name => {
        const searchParams = new URLSearchParams(window.location.search);
        return searchParams.get(name);
    };

    const postid = GetId('post');
    const TOKEN_KEY = postid ? postid : 'newpost';

    const setPostCa = function () {
        window.localStorage.setItem(TOKEN_KEY, $("#content").val());
    };

    const delPostCa = function () {
        window.localStorage.removeItem(TOKEN_KEY);
    };

    const restoreFromLocalStorage = function () {
        let c = window.localStorage.getItem(TOKEN_KEY);
        $("#content").val(c);
        delPostCa();
    };

    $(document).ready(function () {
        $("#content").on("input focus", setPostCa);

        $('#save-post, #delete-action, #publish').on("click", delPostCa);

        $('<a>', {
            href: 'javascript:void(0);',
            id: 'get_localstorage',
            class: 'button button-primary'
        }).html('&#8634 一键恢复').appendTo("#wp-content-media-buttons");

        jQuery(document).on("click", "#get_localstorage", restoreFromLocalStorage);
    });
})();