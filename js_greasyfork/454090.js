// ==UserScript==
// @name         获取本机外网IP地址
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  获取本机的外网IP地址
// @author       jflmao
// @match        *://*/*
// @icon         https://www.ipip.net/favicon.ico
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @grant        GM_notification
// @connect      myip.ipip.net
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/454090/%E8%8E%B7%E5%8F%96%E6%9C%AC%E6%9C%BA%E5%A4%96%E7%BD%91IP%E5%9C%B0%E5%9D%80.user.js
// @updateURL https://update.greasyfork.org/scripts/454090/%E8%8E%B7%E5%8F%96%E6%9C%AC%E6%9C%BA%E5%A4%96%E7%BD%91IP%E5%9C%B0%E5%9D%80.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_xmlhttpRequest({
        url:"https://myip.ipip.net/",
        method :"GET",
        headers: {
            "Content-type": "application/x-www-form-urlencoded"
        },
        onload:function(xhr){
            console.log(xhr.responseText);
            GM_registerMenuCommand(xhr.responseText, () => {
              var reg = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/;
              var str = xhr.responseText.match(reg);
              console.log(str);
              GM_setClipboard(str);
              GM_notification("IP地址已复制到剪切板！");
            });
        }
    });
})();