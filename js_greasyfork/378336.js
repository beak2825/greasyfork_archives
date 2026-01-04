// ==UserScript==
// @name         京东手机众筹领券工具
// @namespace    https://www.abmbio.xin/
// @version      1.0.1
// @description  京东手机众筹领券工具，自动填写验证码，自动提交
// @author       Tony Liu
// @include      http*://vip.jr.jd.com/mCoupon/*
// @grant        none
// @icon         https://www.abmbio.xin/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/378336/%E4%BA%AC%E4%B8%9C%E6%89%8B%E6%9C%BA%E4%BC%97%E7%AD%B9%E9%A2%86%E5%88%B8%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/378336/%E4%BA%AC%E4%B8%9C%E6%89%8B%E6%9C%BA%E4%BC%97%E7%AD%B9%E9%A2%86%E5%88%B8%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';
        if(document.getElementsByClassName("verCodeDiv").length){
            setTimeout(function(){
                var tonycaptcha = document.getElementsByClassName("verCodeDiv")[0].innerText;
                document.getElementById("VerificationCodeId").value = tonycaptcha;
                document.getElementById("confirmBtnId").click();
            },100);
        }else if(document.getElementById("immediateUseBtnId")){
            console.log('已领');
        }else if(document.getElementsByClassName("lootAllDiv")){
            console.log('已领');
        }else{
            location.reload();
        }

})();