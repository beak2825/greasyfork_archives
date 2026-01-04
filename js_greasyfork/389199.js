// ==UserScript==
// @name         淘宝订单导入
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  一键导入淘宝订单到erp系统 嘻嘻
// @author       huayou
// @match        https://trade.taobao.com/trade/detail/trade_order_detail.htm*
// @match        https://wuliu.taobao.com/user/consign.htm*
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389199/%E6%B7%98%E5%AE%9D%E8%AE%A2%E5%8D%95%E5%AF%BC%E5%85%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/389199/%E6%B7%98%E5%AE%9D%E8%AE%A2%E5%8D%95%E5%AF%BC%E5%85%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var host = 'https://sale2.324.com'
    // var host = 'http://localhost:8080'
    var apihost = 'https://sale2.324.com'
    switch (window.location.pathname) {
        case '/trade/detail/trade_order_detail.htm':
            window.erpWindow = null
            var button = jQuery('<button>导入订单</button>');
            button.css({
                position: 'fixed',
                right: '30px',
                bottom: '300px',
                height: '30px',
                lineHeight: '30px',
                background: '#118ADB',
                color: '#fff',
                border: 'none',
                padding: '0 15px',
                borderRadius: '8px',
                outline: 'none'
            });
            jQuery('body').append(button);
            button.click(function() {
                window.erpWindow = window.open(host + '/#/order/add?hideaside=1', 'erpwin', "height=800, width=1320, top=100, left=300, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no, status=no");
                window.erpWindow.focus();
                window.erpWindow.postMessage({data: window.data, type: 'taobao'}, host)
            });
            window.addEventListener("message", function(e){
                if (e.data === 'opened') {
                    window.erpWindow.postMessage({data: window.data, type: 'taobao'}, host)
                }
            }, false)
            break;
        case '/user/consign.htm':
            var orderNo = jQuery('.order-number').text().match(/\d+/)[0];
            jQuery.ajax({
                url: apihost + '/backend/order/order-taobao',
                type: 'GET',
                data: {
                    taobao_sn: orderNo
                },
                headers: {
                    token: 'thisissystemusertoken'
                },
                success: function(res) {
                    if (res.status === 1) {
                        setTimeout(function() {
                            var waybillNo = res.data.info.orderno
                            jQuery('.ks-combobox-input').focus()
                            jQuery('.ks-combobox-input').val(waybillNo)
                        }, 1500)
                    }
                }
            })
            break;
     }
})();