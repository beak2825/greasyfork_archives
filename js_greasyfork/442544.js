// ==UserScript==
// @name         河职校园网自动登录
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  一定要先配置再使用!!
// @author       猫猫没人要
// @match        http://172.16.1.38/a70.htm?wlanuserip=*&wlanacip=172.20.1.1&wlanacname=&vlanid=0&ip=*&ssid=null&areaID=null&mac=00-00-00-00-00-00&switch_url=null&ap_mac=null&client_mac=null&wlan=null
// @match        http://172.16.1.38/a70.htm?wlanuserip=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @license      Cat
// @downloadURL https://update.greasyfork.org/scripts/442544/%E6%B2%B3%E8%81%8C%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/442544/%E6%B2%B3%E8%81%8C%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    //一定要先配置再使用
   document.f3.DDDDD.value="" //""内输入账号
   document.f3.upass.value="" //""内输入密码
   document.querySelector("[name=ISP_select]").value="@unicom"//获取运行商   "@cmcc"中国移动    "@telecom"中国电信    "@unicom"中国联通
   document.querySelector('.edit_lobo_cell').click() //自动登录
   return
})();