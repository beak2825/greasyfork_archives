// ==UserScript==
// @name         腾讯企业邮箱助手
// @namespace    tag:URI
// @version      1.0.0
// @description  账号登录，精简
// @author       kizi
// @match        https://exmail.qq.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387195/%E8%85%BE%E8%AE%AF%E4%BC%81%E4%B8%9A%E9%82%AE%E7%AE%B1%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/387195/%E8%85%BE%E8%AE%AF%E4%BC%81%E4%B8%9A%E9%82%AE%E7%AE%B1%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==


(function(){
    'use strick'

    var ExMailUtil = {
        skipLoginPage : function() {
            location.href='https://exmail.qq.com/login'
        },

        autoLogin : function() {
            $('div[data-panel="qrcode"]').hide()
            $('div[data-panel="pwd"]').show()
            setTimeout(function(){
                if ($('#inputuin')[0].value != '' && $('#pp')[0].value != '') {
                    $('#loginForm').submit()
                }
            }, 2000)
        },

        redirectParallelView : function() {
            location.href += '?view=parallel'
        }
    }

    //写入cookie阻止微信绑定全屏弹框
    window['getTop'] && getTop().setCookie("dm_login_weixin_scan", "", new Date((+new Date()) + 12 * 24 * 3600 * 1000 ), "/", "qq.com" )

    if (location.href.indexOf('/cgi-bin/loginpage') > 0) {
        ExMailUtil.skipLoginPage()
    }
    else if (location.href.indexOf('//exmail.qq.com/login') > 0) {
        ExMailUtil.autoLogin()
    }
})()