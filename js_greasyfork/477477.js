// ==UserScript==
// @name         407自动
// @namespace    dd
// @version      0.1.3
// @description  407试用脚本
// @author       hk
// @include       *://172.16.1.11/*
// @grant        None
// @run-at document-idle
// @downloadURL https://update.greasyfork.org/scripts/477477/407%E8%87%AA%E5%8A%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/477477/407%E8%87%AA%E5%8A%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var username = '账号';//需修改
    var password = '密码';//需修改
    //isp  空-> 校园网(免费)， 暂无-> 电信, @cmcc-> 移动， 暂无-> 联通
    var type = '运营商';//校园网isp选择（需修改）

    setTimeout(() => {
        var selectElement =document.querySelector('.edit_lobo_cell.edit_select');

        if (document.getElementsByClassName('edit_lobo_cell')[1]
           && document.getElementsByClassName('edit_lobo_cell')[1].name !== 'logout') {
            document.getElementsByClassName('edit_lobo_cell')[1].value = username;
        }

        if (document.getElementsByClassName('edit_lobo_cell')[2]) {
            document.getElementsByClassName('edit_lobo_cell')[2].value = password;
        }

        if (selectElement) {
            for (var i= 0;i <selectElement.options.length; i++ ){
                var option = selectElement.options[i];
                if(option.value == type){
                option.selected = true;
                break;
               }
            }
           
        }
        if(document.getElementsByClassName('edit_lobo_cell')[1].name !== 'logout'){
            if (document.getElementsByClassName('edit_lobo_cell')[0]) {
            document.getElementsByClassName('edit_lobo_cell')[0].click();
             }
        }
        
    }, 500);
})();