// ==UserScript==
// @name         安全保密考试自动填充脚本
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  安全保密考试!
// @author       You
// @match        *://*.miap.cc/*
// @resource txt1 file:///D:/2.txt
// @grant        GM_getResourceText
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/455435/%E5%AE%89%E5%85%A8%E4%BF%9D%E5%AF%86%E8%80%83%E8%AF%95%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/455435/%E5%AE%89%E5%85%A8%E4%BF%9D%E5%AF%86%E8%80%83%E8%AF%95%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    function getAnswer(){
        var questionss = document.querySelectorAll('.el-card__body')[0].querySelectorAll('.qcontent');
        const txt = GM_getResourceText('txt1');
        var data = JSON.parse(txt)
        var quee = JSON.parse(data.data)[0].questions;
        var anss = JSON.parse(data.sData);
        for (var entry of questionss.entries()) {
            //console.log(entry[1].querySelector('div').innerText.replaceAll('(','').replaceAll(')','').replaceAll(',','，').trim().split('，')[0]);
            let a;
            for(let item of quee){
                if(item.content.indexOf(entry[1].querySelector('div').innerText) != -1){
                    a = item;
                    //console.log('命中答案')
                    break;
                }

            }
            var test = document.createElement('div');
            test.innerHTML=a.content+' '+a.id+' '+anss[a.id]
            entry[1].append(test);
            switch(anss[a.id]){
                case 'A':
                    entry[1].nextElementSibling.querySelectorAll('.el-radio')[0].click();
                    break;
                case 'B':
                    entry[1].nextElementSibling.querySelectorAll('.el-radio')[1].click();
                    break;
                case 'C':
                    entry[1].nextElementSibling.querySelectorAll('.el-radio')[2].click();
                    break;
                case 'D':
                    entry[1].nextElementSibling.querySelectorAll('.el-radio')[3].click();
                    break;
            }

        }
    }

    function test(){
    var aaa = function (event){
        if(event.path[0].className !== undefined && event.path[0].className.indexOf('el-card') != -1)
        {
            console.log('存在做题区域')
            if(document.querySelector('.el-container').innerHTML.indexOf('距离考试结束') != -1){
                console.log(event.path[0])}
                console.log('当前是考试页面')
            getAnswer();
            }
        };
        document.querySelector('body').addEventListener('DOMNodeInserted',aaa)
    };
    test();
})();