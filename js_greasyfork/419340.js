// ==UserScript==
// @name         广西科技大学自动评教测试版
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  广西科技大学教学自动评教脚本
// @author       dota_st
// @match        http://172.16.129.117/web_jxpj/jxpj_xspj.aspx
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419340/%E5%B9%BF%E8%A5%BF%E7%A7%91%E6%8A%80%E5%A4%A7%E5%AD%A6%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99%E6%B5%8B%E8%AF%95%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/419340/%E5%B9%BF%E8%A5%BF%E7%A7%91%E6%8A%80%E5%A4%A7%E5%AD%A6%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99%E6%B5%8B%E8%AF%95%E7%89%88.meta.js
// ==/UserScript==

function dianzan(){
    for(var i = 2;i<=200;i++){
        var num = i;if(i<10)num = '0'+i;
        var rname = 'GVpjzb$ctl'+num+'$RaBxz';
        var obj = document.getElementsByName(rname);
        if(i==2)obj[1].checked = true;
        else obj[0].checked = true;
    }
}
window.scrollBy(0,600);
prompt("开始评教");
window.setInterval(dianzan);

(function() {
    'use strict';

})();