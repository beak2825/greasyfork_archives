// ==UserScript==
// @name         Dev tools for Jira
// @namespace    http://tampermonkey.net/
// @version      0.4.2
// @description  This tools can help you calculate TCD in jira.
// @author       Lucius Tan
// @match        https://jira.mmm.com/browse/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mmm.com
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/449350/Dev%20tools%20for%20Jira.user.js
// @updateURL https://update.greasyfork.org/scripts/449350/Dev%20tools%20for%20Jira.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let holiday= ['2024-1-1','2024-2-12','2024-2-13','2024-2-14','2024-2-15','2024-2-16','2024-4-4','2024-4-5','2024-5-1','2024-5-2','2024-5-3','2024-6-10','2025-10-1','2025-10-2','2025-10-3','2025-10-6','2025-10-7','2025-10-8'];
    let weekworkday = ['2024-2-4','2024-2-18','2024-4-7','2024-4-7','2024-4-28','2024-5-11','2024-9-14','2024-9-29','2024-10-12','2025-9-28','2025-10-11'];
    let tcdBox = document.querySelector('.type-jpo-custom-field-baseline-end span:nth-child(1)');
    let newPageCount = document.querySelector('#customfield_13740-val');
    let type = document.querySelector('#type-val');
    let ticType = type.querySelector('img');
    let pageEnhanceCount = document.querySelector('#customfield_32539-val');
    let location = document.querySelector('#customfield_11137-val').innerText;
    let loc_EN = ['Singapore','Malaysia','Philippines','Australia','New Zealand','Indonesia','India'];
    let loc_NoEN = ['Japan','Korea','Vietnam','Thailand'];
    let ticStatus = document.querySelector('#resolution-val');
    let totalPageCount,proSize,DevTime,noEnDevTime,SLA,RSLA,totalWorkday = undefined;
    var curDate = new Date();
    function countDown(time) {
        var nowTime = +new Date();
        var inputTime = +new Date(time);
        var times = (inputTime - nowTime) / 1000;
        var d = parseInt(times / 60 / 60 / 24 + 1);
        return d;
    }
    function getworkday(date,workDays){
        var millisceonds =date.getTime();
        for(var i=1;i<= workDays;i++){
            millisceonds+=24*60*60*1000;
            date.setTime(millisceonds);
            var dateStr = date.getFullYear().toString()+'-'+(date.getMonth()+1).toString()+'-'+date.getDate().toString();
            var a = true;
            weekworkday.forEach(v=>{
                if(v === dateStr){
                    i++;
                    return false;
                }
            })
            for(var hd=0;hd<holiday.length;hd++){
                if(holiday[hd] == dateStr){
                    date.getDay()==0||date.getDay()==6 ? a=false : a = true
                    i--;
                }
            }
            if(a==true&&(date.getDay()==0||date.getDay()==6)){
                i--;
            }
        }
        return dateStr;
    }
    if(tcdBox){
        let tcd = tcdBox.querySelector('span:nth-child(1)');
        let dateTime = tcd.querySelector('time');
        let tct = dateTime.getAttribute('datetime');
        let tctCount = countDown(tct);
        if (tctCount <=3 && tctCount >= 0){
            alert('距离TCD剩余 '+tctCount+ ' 天 \n' + tctCount + ' days left until TCD');
        }else if (ticStatus.classList[1] != 'resolved' && tctCount < 0){
            alert('已经超过TCD '+Math.abs(tctCount)+ ' 天 \n It has exceeded TCD '+Math.abs(tctCount)+ ' days');
        }else {
            return false;
        }
    }else{
        if(newPageCount&&pageEnhanceCount){
            totalPageCount = parseInt(newPageCount.innerText)+parseInt(pageEnhanceCount.innerText);
        }else if (newPageCount&&pageEnhanceCount==null){
            totalPageCount = parseInt(newPageCount.innerText);
        }else if(newPageCount==null&&pageEnhanceCount){
            totalPageCount = parseInt(pageEnhanceCount.innerText)
        }else if(newPageCount==null&&pageEnhanceCount==null){
            alert('Please fill Page Count');
            return false;
        }
        if (totalPageCount >= 1 && totalPageCount<=3){
            proSize = 'S - 1-3 page'
            if(ticType.getAttribute("title") === 'Development - Replication'){
                DevTime = 1
                SLA = 1
                RSLA = 6
            }else {
                DevTime = 1
                noEnDevTime = 1
                SLA = 1
                RSLA = 4
            }
        }else if(totalPageCount>=4 && totalPageCount<=10){
            proSize = 'M - 4-10 pages'
            if(ticType.getAttribute("title") === 'Development - Replication'){
                DevTime = 4
                SLA = 3
                RSLA = 11
            }else {
                DevTime = 2
                noEnDevTime = 3
                SLA = 2
                RSLA = 6
            }
        }else if(totalPageCount>=11 && totalPageCount<=19){
            proSize = 'L - 11-19 pages'
            if(ticType.getAttribute("title") === 'Development - Replication'){
                DevTime = 8
                SLA = 3.5
                RSLA = 15
            }else {
                DevTime = 4
                noEnDevTime = 5
                SLA = 3
                RSLA = 9
            }
        }else if(totalPageCount>=20){
            proSize = 'XL - 20+ pages'
            if(ticType.getAttribute("title") === 'Development - Replication'){
                DevTime = 14
                SLA = 4
                RSLA = 22
            }else {
                DevTime = 6
                noEnDevTime = 8
                SLA = 5
                RSLA = 16
            }

        }
        loc_NoEN.forEach(l=>{
            if(l === location && ticType.getAttribute("title") === 'Development - Replication'){
                DevTime = DevTime*2;
            }else if(l === location){
                DevTime = noEnDevTime
            }
        })
        totalWorkday = DevTime + SLA + RSLA;
        console.log('总计需要工作日 Total working days required：'+totalWorkday)
        console.log()
        let deadline = getworkday(curDate,totalWorkday);
        var msg = ' 总页面 PageCount：'+totalPageCount+'\n 总计需要工作日 Total working days required：'+totalWorkday+'\n 请填写 Please fill： \n Project Size: '+proSize+'\n Target Complete Date: '+deadline;
        alert(msg)
    }


})();