// ==UserScript==
// @name         建行WiFi辅助
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  建行WiFi辅助辅助
// @author       Androidcn
// @license      GPL-3.0 License
// @match        http://market.wifi.ccb.com:20070/ecpweb/page/wifi/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=www.ccb.com
// @grant        none
// @require     http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/454434/%E5%BB%BA%E8%A1%8CWiFi%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/454434/%E5%BB%BA%E8%A1%8CWiFi%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==

     var $ = window.$;
(function() {
    'use strict';
    $('.pjf-emptyMsgBox').hide();
    $('.pjf-emptyMsgBox-content').hide();
    $('.wifiProtocol').hide();
})();

$(window).load(function(){
    'use strict';
    $('.pjf-emptyMsgBox').hide();
    $('.pjf-emptyMsgBox-content').hide();
    $('.wifiProtocol').hide();
    
    $('.ipt.ipt-code').click();
    //$('.ipt.ipt-tel').attr('value', '18688948028');
    $('.ipt.ipt-tel').focus().val('18688948028');
    
/*
    var e = jQuery.Event("keyup");//模拟一个键盘事件
    e.keyCode = 49;
    $('.ipt.ipt-tel').trigger(e);//模拟按下1键
    e.keyCode = 56;
    $('.ipt.ipt-tel').trigger(e);//模拟按下8键
    e.keyCode = 54;
    $('.ipt.ipt-tel').trigger(e);//模拟按下6键
    e.keyCode = 56;
    $('.ipt.ipt-tel').trigger(e);//模拟按下8键
    e.keyCode = 56;
    $('.ipt.ipt-tel').trigger(e);//模拟按下8键
    e.keyCode = 57;
    $('.ipt.ipt-tel').trigger(e);//模拟按下9键
    e.keyCode = 52;
    $('.ipt.ipt-tel').trigger(e);//模拟按下4键
    e.keyCode = 56;
    $('.ipt.ipt-tel').trigger(e);//模拟按下8键
    e.keyCode = 48;
    $('.ipt.ipt-tel').trigger(e);//模拟按下0键
    e.keyCode = 50;
    $('.ipt.ipt-tel').trigger(e);//模拟按下2键
    e.keyCode = 56;
    $('.ipt.ipt-tel').trigger(e);//模拟按下8键
*/
});
