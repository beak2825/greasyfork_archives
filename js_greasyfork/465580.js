// ==UserScript==
// @name         河南大学IOS校园网自动登录
// @description  自动登录校园网
// @author       rio813
// @match        http://222.89.104.123:9999/portal.do?wlanuserip=10.22.*&wlanacname=henu-zz
// @grant        none
// @version 0.0.1.20230505121748
// @namespace https://greasyfork.org/users/1050330
// @downloadURL https://update.greasyfork.org/scripts/465580/%E6%B2%B3%E5%8D%97%E5%A4%A7%E5%AD%A6IOS%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/465580/%E6%B2%B3%E5%8D%97%E5%A4%A7%E5%AD%A6IOS%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==
    var username = document.getElementById('userName');
    var password = document.getElementById('passwd');
    var rememberMe = document.getElementById('isRmbPwd');
    var ISP = document.getElementById('henuyd');//yd移动，lt联通，dx电信。
    var checkButton = document.getElementById('checkButton');
        
    // 模拟填写表单
    username.value = '2024030134ls';
    password.value = 'Wmy20020808';
    rememberMe.checked = true;
    ISP.value = "@henuyd";
    
    // 模拟点击登录按钮
    checkButton.click();           