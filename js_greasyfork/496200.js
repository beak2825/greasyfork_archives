// ==UserScript==
// @name         思特奇门户账号密码登录
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @description  门户账号密码登录
// @description  try to take over the world!
// @author       fankq
// @match        https://sso.teamshub.com/samesitenone/*
// @icon         https://www.google.com/s2/favicons?domain=teamshub.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/496200/%E6%80%9D%E7%89%B9%E5%A5%87%E9%97%A8%E6%88%B7%E8%B4%A6%E5%8F%B7%E5%AF%86%E7%A0%81%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/496200/%E6%80%9D%E7%89%B9%E5%A5%87%E9%97%A8%E6%88%B7%E8%B4%A6%E5%8F%B7%E5%AF%86%E7%A0%81%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';
    vm.verifyIp = function (enterId, orgNoTmp, username_plain) {
        var paraData = {
            enterId: enterId,
            username_plain: username_plain
        };
        utils.postForm(paraData, configs.getVerifyIpApi(), (resp) => {
            if(resp != null && resp.httpStatus != null &&  resp.httpStatus != undefined && resp.httpStatus != 'success'){
                $('#orgNo').val("");
                this.setTipsInfo(resp.httpMsg) ;
                this.loginType = this.loginMode;
                this.enterFlag = null;
                if(this.loginMode == 0){
                    this.showRefreshCode();
                }
                return ;
            }
            let reqService = utils.getUrlParameter("service");
            let vpnInnore;
            if (reqService !== null) {
                vpnInnore = ((reqService.indexOf("yiyunapp.teamshub.com/easyTake/mLogin/854") > 0) || (reqService.indexOf("yiyunapp.teamshub.com/easyTake/login/854") > 0));
            } else {
                vpnInnore = false;
            }
            vpnInnore = true;
            enterId = '111';
            if (resp.data == true || vpnInnore) {
                if (this.loginMode == 1 && enterId == "10000") {
                    $('#orgNo').val("");
                    this.setTipsInfo("请使用扫码登录" );
                    this.loginType = this.loginMode;
                    this.enterFlag = null;
                } else {
                    formLoginSubmit()
                    setCookie("username", this.mobileValue, 7 * 24, "/");
                }
            } else {
                $('#orgNo').val("");
                this.setTipsInfo("本次登录需要连接VPN安全网关，请检查您的VPN设置") ;
                this.loginType = this.loginMode;
                this.enterFlag = null;
                if(this.loginMode == 0){
                    this.showRefreshCode();
                }
            }
        })
    };

    // window.onload=function(){
        vm.changeType();
        vm.getAgree(1);
    // };




    // Your code here...
})();