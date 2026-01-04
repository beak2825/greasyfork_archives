// ==UserScript==
// @name         order meals
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  moring
// @author       Caron Zheng
// @match        https://ele.vbhledger.com/
// @icon         https://www.google.com/s2/favicons?domain=tampermonkey.net
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
// @grant GM_openInTab
// @grant GM_notification

// @downloadURL https://update.greasyfork.org/scripts/424255/order%20meals.user.js
// @updateURL https://update.greasyfork.org/scripts/424255/order%20meals.meta.js
// ==/UserScript==

(function() {
    'use strict';
let sys = {
    isOrderPage: undefined,
    isOrderTime: [9, 15, 16].includes(new Date().getHours()),
    isOrdered: undefined, // 点了
    notOrder: undefined, // 拒绝点
    init: function() {
        this.isOrderPage = window.location.hostname.includes('ele.vbhledger.com')
        this.isOrdered = localStorage.getItem('isOrdered')
        this.notOrder = localStorage.getItem('notOrder')
        if (this.isOrderPage) {
            this.leaveConfirm()
            if (this.isOrderTime && !this.isOrdered && !this.notOrder) {
                this.order()
            }
            if (!this.isOrderTime) return alert('_不在订餐时间_')
            if (this.notOrder == true) {
                let again = confirm('_又想点了_?')
                localStorage.setItem('isOrdered', again)
                localStorage.setItem('notOrder', !again)
            }
            if (this.isOrdered) {
                localStorage.setItem('isOrdered', true)
                return alert('_已点勿重复_')
            }
        }
    },
    leaveConfirm: function() {
        let _this = this
        $(window).bind('beforeunload',function(){
            if (!_this.isOrdered && _this.isOrderTime) {
                let notOrder = confirm('确定不点餐?')
                localStorage.setItem('notOrder', notOrder)
            }
        })
    },
    order: function() {
        $.ajax({
            type: 'post',
            url: 'https://ele.vbhledger.com/eat/save',
            data: {
                deptId: 33,
                empId: 166,
                eatDate: $('#today').val()
            }
        }).done(res=> {
            if (res === 1) {
                localStorage.setItem('isOrdered', true)
                return alert('_自动订餐成功_')
            }
            if (res === 0) {
                localStorage.setItem('isOrdered', true)
                return alert('_已点勿重复_')
            }
            console.log(res)
            return alert('_自动订餐未成功, 请尝试手动点餐_')
        }).fail(err=> {
            alert(err.responseText)
        })
    }
}
 sys.init()
    // Your code here...
})();