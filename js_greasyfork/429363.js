// ==UserScript==
// @name        9dm自动填写计算
// @namespace   https://greasyfork.org/scripts/429363
// @icon        data:image/png;base64,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
// @match       *://www.9dmdamaomod.net/*
// @grant       GM_info
// @grant       GM_registerMenuCommand
// @grant       GM_unregisterMenuCommand
// @grant       GM_openInTab
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_notification
// @version     1.1
// @author      六记
// @description 9大妈自动计算并填写
// @downloadURL https://update.greasyfork.org/scripts/429363/9dm%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E8%AE%A1%E7%AE%97.user.js
// @updateURL https://update.greasyfork.org/scripts/429363/9dm%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E8%AE%A1%E7%AE%97.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var notification = {text: "", title:`${GM_info.script.name}`, image:`${GM_info.script.icon}`, timeout: 3000};
    var debug = GM_getValue('debug'), menu_debug_toggle_ID, menu_feedBack_ID;
    registerMenuCommand();
  
    console.log(`-->${GM_info.script.name} 脚本启动<--`);

    let formulaButton = document.querySelector("[valign='middle']>b")
    if(formulaButton){
        try{
            debugging("-->获取获取算式<--");
            let formula = formulaButton.innerText;
            formula = formula.replace("?","");
            formula = formula.replace(new RegExp(/( )/g),"");
            formula = formula.replace("=","");
            debugging(`-->获取算式成功: ${formula}<--`);
            debugging("-->字符串转换算式<--");
            let value = eval(formula);
            debugging(`-->计算成功, 算式值: ${value}<--`);
            let inputButton = document.querySelector("input[name='answer']");
            inputButton.value = value;
            let submitButton = document.querySelector("input[name='secqsubmit']");
            debugging("-->验证完毕<--");
            submitButton.click();
        }catch(err){
            console.log(`-->计算失败, 失败原因: ${err}<--`);
        }
    }

    // 打印调试信息
    function debugging(str){
        debug = GM_getValue('debug');
        if(debug){
            console.log(str)
        }
    }

    // -------- 脚本菜单-----------
    debugging("-->创建脚本菜单<--");
    // 注册脚本菜单
    function registerMenuCommand() {
        if (menu_feedBack_ID || menu_debug_toggle_ID){ // 如果反馈菜单ID不是 null，则删除所有脚本菜单
            GM_unregisterMenuCommand(menu_debug_toggle_ID);
            GM_unregisterMenuCommand(menu_feedBack_ID);
            debug = GM_getValue('debug');
        }
        menu_feedBack_ID = GM_registerMenuCommand('💬 反馈 & 建议 [Github]', function () {window.GM_openInTab('https://github.com/ACG-Q/script/issues/2', {active: true,insert: true,setParent: true});});
        menu_debug_toggle_ID = GM_registerMenuCommand(`🔄 ${debug?'开启':'关闭'} 调试 - 点击切换`,  menu_debug_toggle);
    }
    // 切换事件
    function menu_debug_toggle(){
        debug = GM_getValue('debug');
        GM_setValue('debug', !debug);
        notification.text = `已${debug?'关闭':'开启'} 调试`
        GM_notification(notification); // 提示消息
        registerMenuCommand(); // 重新注册脚本菜单
    }

})();