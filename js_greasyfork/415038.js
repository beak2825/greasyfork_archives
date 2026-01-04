// ==UserScript==
// @name         Download Visitor detail data form Alibaba.com
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Insert a button after mass send message button, click to switch to the next page, if the button find that it reach the end of the page, it will download what you saw on the page(all data) to your computer(with csv and JSON). Unreadable code you saw in csv with be normal in JSON.
// @author       Leevege
// @match        http://data.alibaba.com/*
// @match        https://data.alibaba.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/415038/Download%20Visitor%20detail%20data%20form%20Alibabacom.user.js
// @updateURL https://update.greasyfork.org/scripts/415038/Download%20Visitor%20detail%20data%20form%20Alibabacom.meta.js
// ==/UserScript==
'use strict';
var globalAllresult = [];
var onlyKeyWordResult = [];
var downloaded = false;
// Function below generate a download method
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
        //var text = await blob.text()
        a.download = filename
        a.href = window.URL.createObjectURL(blob)
        a.dataset.downloadurl = ['text/json', a.download, a.href].join(':')
        e = new MouseEvent ("click");
        //e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null) !!!deprecated!!!
        a.dispatchEvent(e)
    }
})(console)
// Define tag replace method
function removeTag(source){
    const regexOpen = /<[^(\/)|(>)]+>/g;
    const regexCLose = /<\/[^>]+>/g;
    source = source.replace(regexOpen,"");
    source = source.replace(regexCLose,",");
    return source;
}

// Collect Visitor detail data
function collectKeywords(){
    var IDSource = document.getElementsByClassName("td-visitor align-left");//.innerText
    var CountrySource = document.getElementsByClassName('ui2-flag');//.title
    var ViewCountSource = document.getElementsByClassName('td-pv-span');//.innerText
    var PeriodTimeSource = document.getElementsByClassName('td-stay-duration align-center');//.innerText
    var KeywordSource = document.getElementsByClassName("td-search-keywords align-left");//.getElementsByTagName('div')[0].getAttribute('data-text')
    var storeActionSource = document.getElementsByClassName('td-minisite-active align-left');//.innerText
    var aliActionSource = document.getElementsByClassName('td-website-active align-left');//.innerHTML -span
    var result=[];
    for (var i = 0; i < IDSource.length; i++) {
        let temp = (KeywordSource[i].getElementsByTagName('div')[0])?(KeywordSource[i].getElementsByTagName('div')[0].getAttribute('data-text')):'-';
        result.push({
            'VisitorID':IDSource[i].innerText,
            'Area':CountrySource[i].title,
            'ViewCount':ViewCountSource[i].innerText,
            'StayTime':PeriodTimeSource[i].innerText,
            'Keywords':removeTag(temp),
            'StoreActivities':storeActionSource[i].innerText||'No activity',
            'WebActivities':removeTag(aliActionSource[i].innerHTML).replace(/(^\s*)|(\s*$)/gm, "")//Remove blanks
        });
    }
    return result;
}
//Match the @grant parameter to genterate a style
GM_addStyle('#down_video_btn{color:#fa7d3c;}');
//Generate a Download button
var down_btn_html = '<span>';
down_btn_html += '<a href="javascript:void(0);" id="down_video_btn" class="S_txt2" title="Auto filp, start download when it detect the last page, refresh if this button does not work.">Download Visitor Data</a>';
down_btn_html += '</span>';
var inner = document.createElement('span');
inner.innerHTML = down_btn_html;
//Insert the tag into the page
var ul_tag = document.getElementsByClassName('batch-btn')[0].parentNode;
console.log(ul_tag);
if (ul_tag) {
    ul_tag.append(inner);
}
var btn = document.getElementById('down_video_btn');

btn.onclick = function(){
    if(downloaded) return;//In case someone download repeatedly
    //let header = ['访客编号','国家及地区','浏览次数','停留时长','全站偏好关键词','旺铺行为','网站行为\n']
    var nextBtn = document.getElementsByClassName('ui-pagination-next')[0];
    if(!(nextBtn.classList.contains('ui-pagination-disabled'))){
        let result = collectKeywords();
        for (let i = 0; i < result.length; i++) {
            console.log(result[i]);
            onlyKeyWordResult.push(result[i].Keywords);
        }
        globalAllresult.push(result);
        nextBtn.click();
    }else{
        let result = collectKeywords();
        for (let i = 0; i < result.length; i++) {
            console.log(result[i]);
            onlyKeyWordResult.push(result[i].Keywords);
        }
        globalAllresult.push(result);
        globalAllresult = [].concat(...globalAllresult);
        onlyKeyWordResult = [].concat(...onlyKeyWordResult);
        console.save(globalAllresult,"collectedVisitorInform.json");
        console.save(onlyKeyWordResult.join('\n'),"collectedKeyWords.csv");
        downloaded = true;
    }
}