// ==UserScript==
// @name         银联强制开启扫码支付
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  为不支持扫码支付的订单银联强制开启扫码支付
// @author       苦苦守候
// @match        https://*.95516.com/b2c/index.action?transNumber=*
// @icon         https://www.google.com/s2/favicons?domain=95516.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/432309/%E9%93%B6%E8%81%94%E5%BC%BA%E5%88%B6%E5%BC%80%E5%90%AF%E6%89%AB%E7%A0%81%E6%94%AF%E4%BB%98.user.js
// @updateURL https://update.greasyfork.org/scripts/432309/%E9%93%B6%E8%81%94%E5%BC%BA%E5%88%B6%E5%BC%80%E5%90%AF%E6%89%AB%E7%A0%81%E6%94%AF%E4%BB%98.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if(!UPOP.qrcodeSupport){
        UPOP.qrcodeSupport =  true ;
        $(document).ready(function() {
            UPOP.qrcodeSupport && 0 < $("#erweima-container").length && ((new QRCode(document.getElementById("erweima"),{
                width: 400,
                height: 400
            })).makeCode($("#erweimaData").val()),
                                                                         $("#erweima").attr("title", ""),
                                                                         $(".wallet_download_block .wallet_close").click(function() {
                $(".wallet_download_overlay").addClass("dn");
                $(".wallet_download_block").addClass("dn")
            }),
                                                                         $(".wallet_download_click").click(function() {
                $(".wallet_download_overlay").removeClass("dn");
                $(".wallet_download_block").removeClass("dn")
            }),
                                                                         window.UPOP.erweima().start())
        });
    }
    $("#loginDiv").toggleClass("dn");
    $("#qrCodeDiv").toggleClass("dn");
    $(".tips_qrCode").toggleClass("dn");
})();