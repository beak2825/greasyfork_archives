// ==UserScript==
// @name         手机看网页（地址生成二维码）
// @namespace    http://tampermonkey.net/
// @version      0.31
// @description  将网页链接转化成二维码，方便使用手机浏览*__*
// @author       yang
// @match        http://*/*
// @include      https://*/*
// @require      https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/370203/%E6%89%8B%E6%9C%BA%E7%9C%8B%E7%BD%91%E9%A1%B5%EF%BC%88%E5%9C%B0%E5%9D%80%E7%94%9F%E6%88%90%E4%BA%8C%E7%BB%B4%E7%A0%81%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/370203/%E6%89%8B%E6%9C%BA%E7%9C%8B%E7%BD%91%E9%A1%B5%EF%BC%88%E5%9C%B0%E5%9D%80%E7%94%9F%E6%88%90%E4%BA%8C%E7%BB%B4%E7%A0%81%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload=function(){

        var createQrcode = function(){
            var qrcode;
            return function(){
                if(qrcode){
                  qrcode.style.display = qrcode.style.display=='none'?'block':'none';
                  return qrcode;
                };
                qrcode = document.createElement('div');
                qrcode.id = "tm_qrcode";
                qrcode.style.cssText ="display:block;position: fixed;top: 3px;z-index: 999;right: 210px;";

                qrcode.addEventListener("click",function(){
                    qrcode.style.display='none';
                });
                document.body.append(qrcode);
                new QRCode(document.getElementById("tm_qrcode"), window.location.href);
                return qrcode;
            }
       };


      GM_registerMenuCommand("手机看网页",createQrcode(), "");
    }

})();