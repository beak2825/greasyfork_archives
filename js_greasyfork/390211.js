// ==UserScript==
// @name         Luogu-Benben-Deleter
// @version      1.0
// @description  一键删除洛谷系统生成的所有犇犇
// @author       Llf0703
// @match        *://www.luogu.org/*
// @match        *://www.luogu.com.cn/*
// @grant        none
// @namespace https://greasyfork.org/users/372864
// @downloadURL https://update.greasyfork.org/scripts/390211/Luogu-Benben-Deleter.user.js
// @updateURL https://update.greasyfork.org/scripts/390211/Luogu-Benben-Deleter.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let uid = window._feInjection.currentUser.uid;

    $('.popup-button').click(function () {
        $('.apps').append('<a id="bb-del" data-v-1f4667be="" data-v-1758e89a="" href="javascript:void 0" class="color-none">清理犇犇</a>');
        $('#bb-del').click(function () {
            $.get('https://www.luogu.org/feed/user/' + uid, function (data) {
                for (let i = 0; ; i += 2) {
                    let cur = $(data)[i];
                    if (cur.children[1] === undefined) {
                        break;
                    }
                    if (cur.children[1].children[1].children[0].firstChild.toString() !== "[object Text]") {
                        continue;
                    }
                    let id = cur.children[1].children[0].children[0].children[1].dataset.feedId;
                    $.post("/api/feed/delete/" + id);
                }
            });
        });
    })
})();