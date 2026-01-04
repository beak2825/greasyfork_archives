// ==UserScript==
// @name         Web刷新访问
// @namespace    http://tampermonkey.net/
// @version      0.1.6
// @description  自动刷网页并访问
// @author       zhaiwei
// @match        https://jdydt.ccdi.gov.cn/*
// @icon         https://jdydt.ccdi.gov.cn/favicon.ico
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/450920/Web%E5%88%B7%E6%96%B0%E8%AE%BF%E9%97%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/450920/Web%E5%88%B7%E6%96%B0%E8%AE%BF%E9%97%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('~~~~~~重新加载页面完毕！~~~~~~');
    let time=suiji(0.8,1.1)
    function suiji(start,end) {
        return Math.round((Math.random()*(end-start)+start)*1000)
    }

    console.log(time);
    window.setInterval(function() {

        console.log('开始访问网页==》');
        console.log(time);
        
         if(document.getElementsByClassName('el-button--danger')){
        setTimeout("document.getElementsByClassName('el-button--danger')[0].click()",time * 0.125);
        } else{
        setTimeout("document.getElementsByClassName('el-button--text')[0].click()",time * 0.125);
        }
        
        setTimeout("document.getElementsByClassName('van-tab__text')[3].click()",time * 0.525);

        setTimeout("document.getElementsByClassName('custom-title')[11].click()",time * 1);

        setTimeout("document.getElementsByClassName('custom-title')[11].click()",time * 2);
        
        //setTimeout('document.querySelectorAll(".van-tab__text")[5].click()',time * 3);

        setTimeout("document.getElementsByClassName('custom-title')[4].click()",time * 3);

        setTimeout("document.getElementsByClassName('custom-title')[3].click()",time * 4);

        setTimeout("document.getElementsByClassName('custom-title')[9].click()",time * 5);

        setTimeout("$('.common-item-body')[parseInt(Math.random()*14)].click()",time * 6);

        setTimeout("window.location.href= 'https://jdydt.ccdi.gov.cn/#/'",time * 7);

        setTimeout("window.location.reload()",time * 7.5);

    },time * 8);

    
})();