// ==UserScript==
// @name         tiexiaoer_ref
// @namespace    https://tiexiaoer.ctrip.com
// @version      0.1
// @description  shining
// @author       shining
// @match        https://tiexiaoer.ctrip.com/refundticket/realele?priority=1
// @grant        unsafeWindow
// @grant        GM_log
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      ctrip.com
// @run-at       document-end

// @downloadURL https://update.greasyfork.org/scripts/426757/tiexiaoer_ref.user.js
// @updateURL https://update.greasyfork.org/scripts/426757/tiexiaoer_ref.meta.js
// ==/UserScript==


var $ = unsafeWindow.$;

(function() {
    'use strict';
    unsafeWindow.hackGrab = function () {
        ////unsafeWindow.initGrabOrderRefundCount();
        let priority=unsafeWindow.utils.request['priority'];
        var data = {
            refundType : 3,
            priority: priority
        };
        $.ajax({
            type: 'POST',
            url: '/refundticket/graborder',
            data: JSON.stringify(data),
            dataType: 'json',
            contentType: 'application/json',
            success: function (result) {
                // toastr.normal();
                if (result.success){
                    unsafeWindow.toastr.success(result.message)
                    //抢单成功后刷新页面
                    //重新刷新是否有订单状态
                    unsafeWindow.initGrabOrderRefundCount();
                    unsafeWindow.bindData();
                }else {
                    unsafeWindow.toastr.error(result.message)
                }
            }
        });
    }
    unsafeWindow.hkGrab = function (){
        window.setInterval(function() {
           hackGrab();
       },500)
    }
    $('#btn_grab_order').after('&nbsp;<button class="btn btn-primary btn-sm" onclick="hkGrab()">自动抢单</button>');

})();

