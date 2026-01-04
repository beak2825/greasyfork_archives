// ==UserScript==
// @name         网址生成二维码（方便手机扫码查看）
// @description  点击按钮，自动在屏幕中间显示当前网页链接生成的二维码，直接使用手机扫码即可打开网页浏览，非常适合微信扫码打开网页进行分享。
// @icon         https://i.loli.net/2020/02/22/NWPMBYT51rcQauL.jpg
// @namespace    https://greasyfork.org/zh-CN/users/393603-tsing
// @version      1.2
// @author       Tsing
// @run-at       document-body
// @match        http://*/*
// @include      https://*/*
// @require      https://greasyfork.org/scripts/373256-qrcode-js/code/QRCode-Js.js
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/396571/%E7%BD%91%E5%9D%80%E7%94%9F%E6%88%90%E4%BA%8C%E7%BB%B4%E7%A0%81%EF%BC%88%E6%96%B9%E4%BE%BF%E6%89%8B%E6%9C%BA%E6%89%AB%E7%A0%81%E6%9F%A5%E7%9C%8B%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/396571/%E7%BD%91%E5%9D%80%E7%94%9F%E6%88%90%E4%BA%8C%E7%BB%B4%E7%A0%81%EF%BC%88%E6%96%B9%E4%BE%BF%E6%89%8B%E6%9C%BA%E6%89%AB%E7%A0%81%E6%9F%A5%E7%9C%8B%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function showQrcode(){
        var qrcode;
        return function(){
            if(qrcode){
                qrcode.style.display = qrcode.style.display=='none'?'block':'none'; // 此处代码参考：https://greasyfork.org/zh-CN/scripts/370203
                return qrcode;
            }
            qrcode = document.createElement('div');
            qrcode.innerHTML = "<div style='position:fixed; top:30px; left:0; right:0; margin:0 auto; width:180px !important; height:210px !important; background-color:#ffffff !important; box-shadow:0 0 10px #444444;'><div style='width:180px; height:40px; line-height:40px; font-size:14px; color:#222222 !important; font-weight:bold; text-align:center;'>手机扫码访问当前网址</div><style type='text/css'>#qr img{margin:0 !important; border-radius:0 !important; max-width:100% !important;}</style><div id='qr' style='width:160px !important; height:160px !important; margin:0 auto;'></div></div>"
            qrcode.style.cssText ="display:block; position:fixed; top:0; bottom:0; left:0; right:0; background-color:rgba(10,10,10,.8); z-index:999999;";
            qrcode.setAttribute('title', '点击任意位置即可关闭二维码');
            qrcode.onclick = function(){ this.style.display = 'none'; };
            document.body.append(qrcode);
            new QRCode(document.getElementById("qr"), {width : 160, height : 160, text:window.location.href});
            return qrcode;
        }
    }

    GM_registerMenuCommand("网址生成二维码", showQrcode(), "");

})();