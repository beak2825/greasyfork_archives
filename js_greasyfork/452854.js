// ==UserScript==
// @name         体检预约
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  try to take over the world!
// @author       You
// @match        https://bank.yhchmo.com/unionPay_healthcheck_nf/fillInfo.html*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yhchmo.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/452854/%E4%BD%93%E6%A3%80%E9%A2%84%E7%BA%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/452854/%E4%BD%93%E6%A3%80%E9%A2%84%E7%BA%A6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var interval = ''
    function info(){
        if(window.app.bookInfo){
            console.log('init finish')
            window.app.bookInfo.certType=1
            window.app.bookInfo.certTypeTxt="身份证"
            window.app.bookInfo.city="黄冈市"
            window.app.bookInfo.cityid='421100'
            window.app.bookInfo.orgname='美年大健康黄冈分院'
            window.app.bookInfo.orgid='1483'
            window.app.bookInfo.date='2022-10-17'

            window.clearInterval(interval)
            //点击获取验证码
            document.querySelector('.btn-countdown').click()
            var submit = window.setInterval(function(){
                if(window.app.validateCode&&window.app.validateCode.length == 4){
                    //提交预约
                    document.querySelector('.submit_btn').click()
                    window.clearInterval(submit)
                    console.log('提交预约')
                    //window.app.popWin = true
                    var sure = window.setInterval(function(){
                        //确认预约
                        document.querySelectorAll('.pop_btn>button')[1].click()
                        window.clearInterval(sure)
                        console.log('确认预约')
                    },1000)
                }
            }, 500);

        }
    }
    interval = window.setInterval(info, 500);
})();