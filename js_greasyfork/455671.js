// ==UserScript==
// @name         coofoUtils-iyuuUtils
// @namespace    https://github.com/coofo/someScript
// @version      0.0.3
// @license      MIT License
// @description  iyuuUtils扩展包
// @author       coofo
// @downloadURL  https://github.com/coofo/someScript/raw/main/tampermonkey/coofoUtils-iyuuUtils.user.js
// @supportURL   https://github.com/coofo/someScript/issues
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @connect      iyuu.cn
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// ==/UserScript==

(function () {
    'use strict';

    //设置按钮
    GM_registerMenuCommand("设置iyuuToken", function () {
        let iyuuToken = GM_getValue("iyuuToken", "");
        Swal.fire({
            title: '设置iyuuToken',
            text: iyuuToken,
            input: 'text',
            inputAttributes: {
                autocapitalize: 'off'
            },
            showCancelButton: true
        }).then((result) => {
            if (result.isConfirmed) {
                GM_setValue("iyuuToken", result.value);
            }
        })
    });

    window.coofoUtils.iyuuUtils = {
        sendMsg: function (title, text) {
            let iyuuToken = GM_getValue("iyuuToken", "");
            if (iyuuToken === "") {
                return;
            }
            $.ajax({
                url: `https://iyuu.cn/${iyuuToken}.send`,
                type: 'get',
                data: {
                    text: title,
                    desp: text
                }
            });
        }
    };
})();