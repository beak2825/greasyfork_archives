// ==UserScript==
// @name         SecretUtil
// @namespace    https://greasyfork.org/zh-CN/scripts/387227-secretutil
// @version      0.0.1
// @match        *://lbfa.suning.cn/lbfa-web/suningIM/*
// @description  SN/SecretUtil
// @author
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/387227/SecretUtil.user.js
// @updateURL https://update.greasyfork.org/scripts/387227/SecretUtil.meta.js
// ==/UserScript==

(function() {
    var deviceScript = document.createElement('script');
    var deviceScriptStr = `
 function randomNum(maxNum, minNum, decimalNum) {
        var max = 0, min = 0;
        minNum <= maxNum ? (min = minNum, max = maxNum) : (min = maxNum, max = minNum);
        switch (arguments.length) {
            case 1:
                return Math.floor(Math.random() * (max + 1));
                break;
            case 2:
                return Math.floor(Math.random() * (max - min + 1) + min);
                break;
            case 3:
                return (Math.random() * (max - min) + min).toFixed(decimalNum);
                break;
            default:
                return Math.random();
                break;
        }
    }
  var longitude = 900024 + randomNum(100,650);
  var latitude = 95461 + randomNum(-800,300);
    var deviceInfo = {
  "mobileId":"",
  "longitude":"118." + longitude,
  "latitude":"32.0" + latitude,
  "accuracy":"" + randomNum(200,888,13),
  "AppSource":"Android",
  "bssid":"",
  "AddrStr":"中国江苏省南京市玄武区环园东路"};
  var imJsInterface = {
  getLocationAndWIFIInfo:function(){
  jsLocationAndWIFIInfoFunc(JSON.stringify(deviceInfo));
  },
  getMobileUniqueID:function(){
            return deviceInfo.mobileId;
        },
        getDeviceInfoJson:function(){
        return deviceInfo;
        }
        }
`;
    deviceScript.innerText =  deviceScriptStr;
    document.head.appendChild(deviceScript);
})();