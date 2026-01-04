// ==UserScript==
// @name         ad研究所
// @namespace    http://tampermonkey.net/
// @version      10.4
// @description  aido优化+破解
// @author       kk1223
// @match        https://*.aidou.pro/*
// @match        https://*.aidou.art/*
// @match        https://*.aido2.cc/*
// @match        https://*.aidoo.info/*
// @icon         https://www6.aidou.pro/static/img/logo.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/501933/ad%E7%A0%94%E7%A9%B6%E6%89%80.user.js
// @updateURL https://update.greasyfork.org/scripts/501933/ad%E7%A0%94%E7%A9%B6%E6%89%80.meta.js
// ==/UserScript==

(function() {
'use strict';

//点击优化，每次点击在新的窗口打开
setTimeout(function(){
    const herfs = document.querySelectorAll(".videoListStyle"); console.log("herfs",herfs)
    const herfArr = Array.from(herfs);console.log("herfArr",herfArr)
    herfArr && herfArr.some(h=>{
        h.target = '_blank';
    })
},500)

//操作优化 箭头左右翻页
setTimeout(function(){
    document.addEventListener('keydown', function(event) {
        if (event.keyCode === 37) {
            console.log('左箭头键被按下');
            const paging = document.getElementById("paging");
            const last = paging.querySelector('a');
            console.log("last",last);
            last.click();
        }

        if(event.keyCode == 39){
            console.log('右箭头键被按下');
            const paging = document.getElementById("paging");
            const next = paging.querySelectorAll('a')[paging.querySelectorAll('a').length - 1];
            console.log("next",next);
            next.click();
        }
    });
},0)


setTimeout(function(){
    var url = location.href
    var id = url.split('/').pop().split('.')[0];
    var giturl = "https://knciik123.gitlab.io/-/test_aido/-/jobs/7443374469/artifacts/public/index.html?id="+id
    //window.open(giturl, '_blank')

    const div =document.getElementById("formatVideo");
    if(div){
        div.innerHTML = "<iframe src='"+giturl+"' style='width:100%;height:100%' />"
    }
},1000)

})();