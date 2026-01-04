// ==UserScript==
// @name         Ubisoft-35-AutoReg
// @description  Automatic script for ubisoft.
// @version      0.11
// @author       You
// @include      https://store.ubi.com/cn/ubisoft-35th-contest*
// @include      https://cn.bing.com/chrome/newtab
// @icon         https://store.ubi.com/favicon.ico
// @run-at       document-end
// @namespace https://greasyfork.org/users/831224
// @downloadURL https://update.greasyfork.org/scripts/434857/Ubisoft-35-AutoReg.user.js
// @updateURL https://update.greasyfork.org/scripts/434857/Ubisoft-35-AutoReg.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const isUbisoftPage = (window.location.href.toString().indexOf('store.ubi.com/cn/ubisoft-35th-contest') != -1)
    function DoClick() {
        document.getElementsByClassName('btn__register')[0].click()
    }
    function DetectAndRun(){
        if (!isUbisoftPage) {
            const date = new Date().getDate()
            if (localStorage.getItem('UBI-SCRIPT-LAST-RUN') != date) {
                localStorage.setItem('UBI-SCRIPT-LAST-RUN', date)
                window.location.href='https://store.ubi.com/cn/ubisoft-35th-contest'
            }
            return
        }
        const loading = true
        var timer = setInterval(() => {
            if (document.getElementsByClassName('btn__register').length != 0){
                if (!document.getElementsByClassName('btn__register')[0].innerHTML.includes('svg')) {
                    if (document.getElementById('accountMenu').getAttribute('data-tc100') != 'login') {
                        DoClick()
                    } else {
                        document.getElementsByClassName('btn__register')[0].innerText = '未登录，正在跳转'
                        DoClick()
                    }
                    clearInterval(timer)
                }
            } else if (document.getElementsByClassName('btn__registered').length != 0) {
                clearInterval(timer)
            } else if (document.getElementsByClassName('registration-error-message').length != 0) {
                location.reload()
                clearInterval(timer)
            }
        }, 3000)
    }
    DetectAndRun()
})();