// ==UserScript==
// @name         Bulk download keyword attraction from Alibaba.com
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  This script can download all keyword data of the page.
// @author       TuffPlusOM
// @match        http://data.alibaba.com/*
// @match        https://data.alibaba.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/415044/Bulk%20download%20keyword%20attraction%20from%20Alibabacom.user.js
// @updateURL https://update.greasyfork.org/scripts/415044/Bulk%20download%20keyword%20attraction%20from%20Alibabacom.meta.js
// ==/UserScript==

'use strict';
(function(console){
    console.save = function(data, filename){
        if(!data) {
            console.error('Console.save: No data found!')
            return;
        }
        if(!filename) filename = 'console.json'
        if(typeof data === "object"){
            data = JSON.stringify(data, undefined, 4)
        }
        var blob = new Blob([data], {type: 'text/json'}),
            e = document.createEvent('MouseEvents'),
            a = document.createElement('a')
        a.download = filename
        a.href = window.URL.createObjectURL(blob)
        a.dataset.downloadurl = ['text/json', a.download, a.href].join(':')
        e = new MouseEvent ("click");
        //e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null) !!!deprecated!!!
        a.dispatchEvent(e)
    }
})(console)
let allArr = [];
GM_addStyle('#down_video_btn{color:#fa7d3c;}');
//下载按钮的html代码
var down_btn_html = '<span>';
down_btn_html += '<a href="javascript:void(0);" id="download_btn" class="S_txt2" title="自动翻页，到底自动下载，若无效请刷新重试">下载关键词数据</a>';
down_btn_html += '</span>';
var inner = document.createElement('span');
inner.innerHTML = down_btn_html;
var target_tag = document.getElementsByClassName('add-and-download')[0];
if (target_tag) {
    target_tag.append(inner);
}
var status = ['操作','已加入直通车词库','加入直通车词库','[已存在重复词]'];
var btn = document.getElementById('download_btn');
btn.onclick = function(){
    let all = document.getElementsByClassName('next-table-cell-wrapper');
    let nextBtn = document.getElementsByClassName('next-next')[1];
    if(!nextBtn.disabled){
        for(let i=0;i<all.length-22;i++){
            allArr.push(all[i].innerText);
        }
        nextBtn.click();
        console.log(allArr);
    }else{
        for(let i=0;i<all.length-22;i++){
        allArr.push(all[i].innerText);
        }
        allArr = [].concat(...allArr);
        //allArr = JSON.stringify(allArr);
        let temp = "<textarea style='height:600px;width:1000px;'>"
        temp += allArr.join('_');
        temp += "</textarea>"
        document.write(temp);
        //console.save(allArr,"collectedTraffic.csv");
    }
}