// ==UserScript==
// @name          Huawei E5372 branded USSD
// @namespace     http://dluciv.name/
// @description   Добавляется пункт работы с USSD в меню GreaseMonkey для брендированных прошивок Huawei E5372 без USSD
// @author        dluciv
// @copyright     2015+, Dmitry V. Luciv
// @license       WTFPLv2; http://wtfpl.net
// @license       MIT; http://opensource.org/licenses/MIT
// @version       1.0.5
// @icon          https://raw.githubusercontent.com/dluciv/UserScripts/master/Huawei-E5372-USSD/ussd.png
// @homepage      https://github.com/dluciv/UserScripts/tree/master/Huawei-E5372-USSD
//
// @grant         GM_registerMenuCommand
//
// @include       http://status.megafon.ru/*
// @include       http://192.168.8.1/*

// @downloadURL https://update.greasyfork.org/scripts/11386/Huawei%20E5372%20branded%20USSD.user.js
// @updateURL https://update.greasyfork.org/scripts/11386/Huawei%20E5372%20branded%20USSD.meta.js
// ==/UserScript==

(function() {
    unsafeWindow.huawei_send_USSD = exportFunction(function(ussd_code){
        unsafeWindow.sendCommonByUssd(ussd_code, "CodeType");
    }, unsafeWindow);

    var addpad = function() {
        try {
            document.getElementById('huawei_ussd_keypad').remove();
        } catch (e) {}
        document.body.innerHTML +=
            '<div id="huawei_ussd_keypad" style="display:block; position: absolute; top:15px; right: 15px; border: 1px solid black; background-color: white; padding: 5px; width: 135px; z-index: 10000;">'+
            '<input type="button" onclick="document.getElementById(\'huawei_ussd_keypad\').remove();" value="X" style=""/><span style="background-color: silver; height: 20px; padding: 5px;">Send or click</span><hr/>'+
            '<input type="text" id="huawei_ussd_text" value="*100#" style="width:84px; padding:2px; border: 1px solid black;" /><input type="button" value="&gt;&gt;" onclick="huawei_send_USSD(document.getElementById(\'huawei_ussd_text\').value)" style="width:45px;" /><hr/>'+
            '<input type="button" value="1" onclick="huawei_send_USSD(\'1\')" style="width:45px;" /><input type="button" value="2" onclick="huawei_send_USSD(\'2\')" style="width:45px;" /><input type="button" value="3" onclick="huawei_send_USSD(\'3\')" style="width:45px;" /><br/>'+
            '<input type="button" value="4" onclick="huawei_send_USSD(\'4\')" style="width:45px;" /><input type="button" value="5" onclick="huawei_send_USSD(\'5\')" style="width:45px;" /><input type="button" value="6" onclick="huawei_send_USSD(\'6\')" style="width:45px;" /><br/>'+
            '<input type="button" value="7" onclick="huawei_send_USSD(\'7\')" style="width:45px;" /><input type="button" value="8" onclick="huawei_send_USSD(\'8\')" style="width:45px;" /><input type="button" value="9" onclick="huawei_send_USSD(\'9\')" style="width:45px;" /><br/>'+
            '<input type="button" value="0" onclick="huawei_send_USSD(\'0\')" style="width:45px;" /><input type="button" value="00" onclick="huawei_send_USSD(\'00\')" style="width:45px;" /><input type="button" value="000" onclick="huawei_send_USSD(\'000\')" style="width:45px;" /><br/>'+
            '</div>';
    };
   
    GM_registerMenuCommand("USSD: show pad", addpad, "u");
}).call(this);
