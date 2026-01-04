// ==UserScript==
// @name         Reep QRcode
// @name:zh-CN   Reep 二维码
// @namespace    reep
// @include 	 *://reep.io/*
// @version      1.0
// @description  generate QRcode for reep.io link
// @description:zh-CN  链接转二维码
// @author       BlindingDark
// @grant        none
// @license MIT License
// @require      https://cdn.bootcss.com/jquery/3.2.1/jquery.js
// @require      https://greasyfork.org/scripts/31884-qrcode-js/code/qrcodejs.js?version=208858
// @require      https://greasyfork.org/scripts/31885-jquery-qrcode-js/code/jqueryqrcodejs.js?version=208856
// @downloadURL https://update.greasyfork.org/scripts/31886/Reep%20QRcode.user.js
// @updateURL https://update.greasyfork.org/scripts/31886/Reep%20QRcode.meta.js
// ==/UserScript==
//
// 核心代码来自 编译小僵尸 https://greasyfork.org/users/85375
// https://greasyfork.org/zh-CN/scripts/27450-%E6%98%BE%E7%A4%BA%E4%BA%8C%E7%BB%B4%E7%A0%81/code

(function() {
    var html = '<div id="showQRcodeJsCanvas" style="position:fixed;top:50%;left:50%;margin-left:-135px;margin-top:-135px;background-color:white;height:auto;padding:7px;">';
    var colsefn = '';

    function getSelect() {
        if(window.getSelection) {
            return window.getSelection().toString();
        } else {
            return document.selection.createRange().text;
        }
    }

    function checkURLFormat(string) {
        var reg = new RegExp(/^[hH][tT][tT][pP]([sS]?):\/\/(\S+\.)+\S{2,}$/);
        if(!reg.test(string)) {
            return false;
        }
        return true;
    }

    $(document).mouseup(function(event) {
        let selectString = getSelect();
        if(selectString === "") {
            return;
        }

        if(!checkURLFormat(selectString)) {
            return;
        }

        if (!document.querySelector('#showQRcodeJs')) {
            // 添加div
            var div = document.createElement('div');
            div.setAttribute('id', 'showQRcodeJs');
            div.setAttribute('style', 'position:fixed;top:0;left:0;bottom:0;right:0;z-index:99999;background-color: rgba(0, 0, 0, 0.3);');
            div.innerHTML = html;
            document.body.appendChild(div);
            // 执行QRCode
            jQuery('#showQRcodeJsCanvas').qrcode(selectString);
        } else {
            document.body.removeChild(document.querySelector('#showQRcodeJs'));
            colse.removeEventListener("click", colsefn, false);
        }
        //添加监听
        var colse = document.querySelector('#showQRcodeJs');
        colse.addEventListener('click', colsefn = function() {
            document.body.removeChild(document.querySelector('#showQRcodeJs'));
        }, false);
    });
})();
