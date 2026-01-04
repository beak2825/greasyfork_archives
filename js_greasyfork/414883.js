// ==UserScript==
// @name         appleAcount
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  注册日本地区appleid
// @author       LYH
// @include      https://appleid.apple.com/account/manage
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/414883/appleAcount.user.js
// @updateURL https://update.greasyfork.org/scripts/414883/appleAcount.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    window.setTimeout(function(){
        let button = document.querySelector('.not-mobile .button-link-reset-alignment')
        button.addEventListener('click',function(){
            let maileCode = document.querySelector('.idms-address-postal-code .idms-address-postal-code')
            if(!maileCode){
            console.log("请点击添加付款方式")
            }else{
                maileCode.value = "103-0014"
                let address = document.querySelector(".idms-address-state-province")
                address.value = "東京都"
                let city = document.querySelector(".form-element .idms-address-city")
                city.value = "中央区"
                let jiedao = document.querySelector(".idms-address-line1")
                jiedao = "日本橋蛎殻町"
                let louhao = document.querySelector(".idms-address-line2")
                louhao = "04-45-45"
                let quhao = document.querySelector(".payment-phonenumber-areaCode")
                quhao = "81"
                let tell = document.querySelector(".payment-phonenumber-number")
                tell = "332496226"
                let save = document.querySelector(".acdn-btn-save")
            }
        })
        button.style.border = "4px solid red"
    },5000)
})();