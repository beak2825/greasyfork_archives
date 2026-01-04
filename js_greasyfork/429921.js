// ==UserScript==
// @name        云锦工时全选脚本 
// @namespace   Violentmonkey Scripts
// @match       *://pms.yunjinhz.com/*
// @icon         https://www.google.com/s2/favicons?domain=yunjinhz.com
// @grant       none
// @version     1.0
// @author      Edik
// @description 2021/4/15下午3:33:55
// @downloadURL https://update.greasyfork.org/scripts/429921/%E4%BA%91%E9%94%A6%E5%B7%A5%E6%97%B6%E5%85%A8%E9%80%89%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/429921/%E4%BA%91%E9%94%A6%E5%B7%A5%E6%97%B6%E5%85%A8%E9%80%89%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('云锦工时全选脚本')
    let table = document.getElementById('rossTableId_TASK_TIME');
    if(table){
        let trs = table.getElementsByTagName('tr')
        for(let i=1;i<trs.length;i++){
            let tr = trs[i]
            let inputs = tr.getElementsByTagName('input')
            inputs[0].click()
        }
    }
})();