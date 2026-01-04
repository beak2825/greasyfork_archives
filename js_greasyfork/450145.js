// ==UserScript==
// @name         百度文库VIP
// @namespace    Baiduwenkuvip 
// @version      0.5
// @description  这是一个百度文库VIP
// @author       Hei Ma
// @match        https://wenku.baidu.com/view/*
// @match        https://wenku.baidu.com/*
// @icon         https://www.baidu.com/favicon.ico
// @grant        none
// @run-at       document-start
// @license      The MIT License (MIT); http://opensource.org/licenses/MIT    
// @downloadURL https://update.greasyfork.org/scripts/450145/%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93VIP.user.js
// @updateURL https://update.greasyfork.org/scripts/450145/%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93VIP.meta.js
// ==/UserScript==

(function() {
    //定义中间变量
    let data;
    //监控pageData
    Object.defineProperty(window,'pageData',{
        set(newObj){
            data=newObj;
        },
        get(){
            if('vipInfo' in data){
                data.vipInfo.isVip=1;
                data.vipInfo.global_svip_status=1;
                data.vipInfo.global_vip_status=1;
                data.vipInfo.isClassicVip=1;
                data.vipInfo.isSuperVip=1;
                data.vipInfo.isJiaoyuVip=1;
                data.mixVipAndUserInfo.downloadLimit=100;
            }
            return data;
        }
    })

})();