// ==UserScript==
// @name         查找网页中特定字符
// @namespace    https://github.com/clhey/tampermonkey/tree/master/topxie
// @version      0.2.3
// @description  只自己用。
// @author       topxie
// @match        https://izhongchou.taobao.com/dreamdetail.htm?*
// @require      https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/39743/%E6%9F%A5%E6%89%BE%E7%BD%91%E9%A1%B5%E4%B8%AD%E7%89%B9%E5%AE%9A%E5%AD%97%E7%AC%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/39743/%E6%9F%A5%E6%89%BE%E7%BD%91%E9%A1%B5%E4%B8%AD%E7%89%B9%E5%AE%9A%E5%AD%97%E7%AC%A6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('开始查找 loaded!');

    var str = '对不起';
    var buyUrl = 'http://www.weiletong.cn/index.php?s=/addon/WeiYiLiao/Web/registration_order/token/gh_121a0b327ab3/openid/o2gTRsjlHadKN0Oqagn1ACkPP3a8/doctor_id/8/time/11/showwxpaytitle/1.html';

    window.setInterval(checkStock, 10000);


    //functions---------------------------------------------------------------------
    function checkStock() {
        $.ajax({
            type: 'get',
            url: buyUrl,
            success: function(data) {
                for (var i in data.data.items) {
                    var item = data.data.items[i];
                    if (item.can_buy > 0) {
                        window.location.href = buyUrl + item.item_id;
                        return;
                    }
                }
                console.log('not start, recheck!');
            }
        });
    }


    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r !== null) return unescape(r[2]);
        return null;
    }


})();