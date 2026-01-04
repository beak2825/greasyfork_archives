// ==UserScript==
// @name         安乐码
// @author       Jones Miller
// @version      23.04.01
// @namespace    https://t.me/jsday
// @description  网页生成二维码；电脑端、移动端通用。
// @icon         https://dss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/qrcode/qrcode@2x-daf987ad02.png
// @include      *
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/428174/%E5%AE%89%E4%B9%90%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/428174/%E5%AE%89%E4%B9%90%E7%A0%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

  /* 调用外部的api，若有自己喜欢的或是api失效 可自行更换 */
  var jmQRapi='https://api.pwmqr.com/qrcode/create/?url='

  /**/
  function createjmwebQR() {
    var jmQRstyle='display:block;position:fixed;width:30px;height:30px;bottom:256px;right:1vmin;transition:0.3s all;background-color:#fff;background-image:url(https://dss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/qrcode/qrcode@2x-daf987ad02.png);background-position:center;background-repeat:no-repeat;background-size:100%;box-shadow:0 0 0 2px red !important;cursor:pointer;z-index:9999999;border-radius:6px;';
    var jmQRcode='width:149px;height:149px;border-radius:10px;';
    var jmwebQR=document.createElement('div');
    jmwebQR.style=jmQRstyle; jmwebQR.onclick=function() { if (jmwebQR.style.width=='30px') { this.style=jmQRstyle+jmQRcode+'background-image:url('+jmQRapi+location.href+');'} else { this.style=jmQRstyle; } }; document.body.appendChild(jmwebQR); }; if (location.href.match('^http(s)?://')) { createjmwebQR();};
})();