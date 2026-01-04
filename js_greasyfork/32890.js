// ==UserScript==
// @name         抢淘宝众筹
// @namespace    https://github.com/clhey/tampermonkey/tree/master/izhongchou
// @version      0.2.3
// @description  狗日的迅雷耍猴，玩客云抢了几天没抢到，没办法撸了个脚本半自动抢，果真抢到了。我不是黄牛撸1个就够，共享出来大家玩下。注意：我不是前端程序员，代码Low不许喷。
// @author       查理
// @match        https://izhongchou.taobao.com/dreamdetail.htm?*
// @require      https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/32890/%E6%8A%A2%E6%B7%98%E5%AE%9D%E4%BC%97%E7%AD%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/32890/%E6%8A%A2%E6%B7%98%E5%AE%9D%E4%BC%97%E7%AD%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('Fuck淘宝众筹loaded!');

    var id = getQueryString('id');
    var buyUrl = 'https://izhongchou.taobao.com/order/confirm_order.htm?itemId=';

    window.setInterval(checkStock, 500);


    //functions---------------------------------------------------------------------
    function checkStock() {
        $.ajax({
            type: 'get',
            url: '/dream/ajax/getProjectForDetail.htm?id=' + id,
            dataType: 'json',
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