// ==UserScript==
// @name         Sonkwo-AutoCheckin
// @namespace    https://www.sonkwo.cn/
// @license      WTFPL
// @description  Auto Checkin Script for Sonkwo
// @version      0.01
// @author       You
// @match        https://www.sonkwo.cn/
// @match        https://cn.bing.com/chrome/newtab
// @icon         https://www.sonkwo.cn/favicon.ico
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/448204/Sonkwo-AutoCheckin.user.js
// @updateURL https://update.greasyfork.org/scripts/448204/Sonkwo-AutoCheckin.meta.js
// ==/UserScript==


(function() {
    'use strict';
    const isSonkwoPage = (window.location.href.toString().indexOf('https://www.sonkwo.cn/') != -1)
    const date = new Date().getDate()
    function SetDateStore() {
        localStorage.setItem('SONKWO-SCRIPT-LAST-RUN', date)
    }
    function CompareDateStore(){
        return localStorage.getItem('SONKWO-SCRIPT-LAST-RUN') == date
    }
    function DoCheckin() {
        document.getElementsByClassName('store_user_card_action_check')[0].click()
    }
    function DetectAndRun(){
        if (CompareDateStore()) {
            return
        }
        if (!isSonkwoPage) {
            SetDateStore()
            window.location.href='https://www.sonkwo.cn/'
        }
        var timer = setInterval(() => {
            if (document.getElementsByClassName('click_to_login').length != 0 && document.getElementsByClassName('store_user_card_action_check').length == 0){
                window.location.href='https://www.sonkwo.cn/sign_in?return_addr=%2F'
                clearInterval(timer)
            } else if (document.getElementsByClassName('store_user_card_action_check').length != 0) {
                if (document.getElementsByClassName('store_user_card_action_check')[0].innerHTML == '签到赚积分') {
                    DoCheckin()
                    SetDateStore()
                    clearInterval(timer)
                } else if (document.getElementsByClassName('store_user_card_action_check')[0].innerHTML == '已签到') {
                    SetDateStore()
                    clearInterval(timer)
                }
            }
        }, 3000)
    }
    DetectAndRun()
})();
