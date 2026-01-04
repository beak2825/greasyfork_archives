// ==UserScript==
// @name         AutoBrowse
// @namespace    http://tampermonkey.net/
// @version      0.4.13
// @description  自动刷新网页
// @author       zhaiwei
// @match        https://jdydt.ccdi.gov.cn/*
// @icon         https://jdydt.ccdi.gov.cn/favicon.ico
// @grant        none
// @run-at       document-end

// @downloadURL https://update.greasyfork.org/scripts/450818/AutoBrowse.user.js
// @updateURL https://update.greasyfork.org/scripts/450818/AutoBrowse.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('开始访问网页！');
    let time=suiji(0.9,1.1)
    function suiji(start,end) {
        return Math.round((Math.random()*(end-start)+start)*1000)
    }

    window.setInterval(function() {
        //location.reload();
        var wt = 800;
        
        console.log(time);
        if($('span:contains(去选择)')){
        setTimeout("$('span:contains(去选择)')[0].click();",wt * 0.125);
        }else{
            setTimeout("document.querySelector('.el-icon-location').click();",wt * 0.125);
        }
        
        setTimeout("$('span:contains(全国)')[0].click()",wt * 0.525);

        setTimeout("$('span:contains(安徽省)')[0].click()",wt * 1);

        setTimeout("$('span:contains(宿州市)')[0].click()",wt * 2);

        setTimeout("$('span:contains(泗县)')[0].click()",wt * 3);

        setTimeout("$('span:contains(草沟镇)')[0].click()",wt * 4);

        setTimeout("$('span:contains(于城村)')[0].click()",wt * 5);
        
        setTimeout("$('.common-item-body')[parseInt(Math.random()*14)].click()",time * 7);
        
        setTimeout("window.location.href= 'https://jdydt.ccdi.gov.cn/#/'",time * 8);
        
        setTimeout("window.location.reload()",time * 8.5);

    },time * 9);

    // Your code here...
})();