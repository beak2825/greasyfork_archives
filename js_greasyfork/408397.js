// ==UserScript==
// @name         阿里巴巴国际站批量下载访客详情数据
// @namespace    http://tampermonkey.net/
// @version      2.1.3
// @description  在访客详情页面，批量营销按钮后面插入一个下载按钮，点击可以从头开始记录每位访客所有的有效数据和关键词（所见即所得），最终输出成csv表格和JSON文件自动下载。（因为输出CSV文件会存在暂时无法解决的乱码问题，所以只能保存成JSON格式的文件）文件请看本页面的描述点击链接或自己找方法自行转换成excel表格。
// @author       TuffPlusOM
// @match        http://data.alibaba.com/*
// @match        https://data.alibaba.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/408397/%E9%98%BF%E9%87%8C%E5%B7%B4%E5%B7%B4%E5%9B%BD%E9%99%85%E7%AB%99%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD%E8%AE%BF%E5%AE%A2%E8%AF%A6%E6%83%85%E6%95%B0%E6%8D%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/408397/%E9%98%BF%E9%87%8C%E5%B7%B4%E5%B7%B4%E5%9B%BD%E9%99%85%E7%AB%99%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD%E8%AE%BF%E5%AE%A2%E8%AF%A6%E6%83%85%E6%95%B0%E6%8D%AE.meta.js
// ==/UserScript==
'use strict';
var globalAllresult = [];
var onlyKeyWordResult = [];
var downloaded = false;
// 下面这段代码生成下载方式
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
// 定义去除开和标签方法
function removeTag(source){
    const regexOpen = /<[^(\/)|(>)]+>/g;
    const regexCLose = /<\/[^>]+>/g;
    source = source.replace(regexOpen,"");
    source = source.replace(regexCLose,",");
    return source;
}

// 访客详情页收集关键词方法
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
            'StoreActivities':storeActionSource[i].innerText||'无旺铺行为',
            'WebActivities':removeTag(aliActionSource[i].innerHTML).replace(/(^\s*)|(\s*$)/gm, "")//去掉多余空格
        });
    }
    return result;
}
//与元数据块中的@grant值相对应，功能是生成一个style样式
GM_addStyle('#down_video_btn{color:#fa7d3c;}');
//下载按钮的html代码
var down_btn_html = '<span>';
down_btn_html += '<a href="javascript:void(0);" id="down_video_btn" class="S_txt2" title="自动翻页，到底自动下载，若无效请刷新重试">下载访客详情数据</a>';
down_btn_html += '</span>';
var inner = document.createElement('span');
inner.innerHTML = down_btn_html;
//将以上拼接的html代码插入到网页标签中
var ul_tag = document.getElementsByClassName('batch-btn')[0].parentNode;
console.log(ul_tag);
if (ul_tag) {
    ul_tag.append(inner);
}
var btn = document.getElementById('down_video_btn');

btn.onclick = function(){
    if(downloaded) return;//防抖，防止多次下载，刷新重启
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
    // 下载数据，第一个参数是数据对象，第二个参数是要保存成文件的名字。
}