// ==UserScript==
// @name         批量删除QQ授权
// @namespace    com.uestc.rjw
// @version      0.1
// @description  批量删除QQ授权应用
// @author       rjw
// @match        https://connect.qq.com/manage.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370347/%E6%89%B9%E9%87%8F%E5%88%A0%E9%99%A4QQ%E6%8E%88%E6%9D%83.user.js
// @updateURL https://update.greasyfork.org/scripts/370347/%E6%89%B9%E9%87%8F%E5%88%A0%E9%99%A4QQ%E6%8E%88%E6%9D%83.meta.js
// ==/UserScript==

function deleteApps() {
    'use strict';
    var appAuths = document.getElementsByClassName('appAuth');
    for(let index = 0; index < appAuths.length; ++index){
        if(appAuths[index].innerText == '授权管理'){
            appAuths[index].click();
            break;
        }
    }
    var ccc = document.getElementsByTagName('a');
    for(let index = 0; index < ccc.length; ++index){
        if(ccc[index].innerText == '取消全部授权'){
            setTimeout(function(){
                ccc[index].click();
                setTimeout(function(){
                    window.location.reload();
                },1000);
            },1000);
        }
    }
};
window.onload = deleteApps;