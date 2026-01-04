// ==UserScript==
// @name         笔趣阁往后下载
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  辅助下载到本地
// @author       AustinYoung
// @match        https://www.biquge365.net/*
// @icon         https://icons.duckduckgo.com/ip2/biquge365.net.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/486850/%E7%AC%94%E8%B6%A3%E9%98%81%E5%BE%80%E5%90%8E%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/486850/%E7%AC%94%E8%B6%A3%E9%98%81%E5%BE%80%E5%90%8E%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    addFloat()
    checkGet();
})();
function addFloat()
{
    window.searchCount++;
    let searchNote = document.querySelector(".gongneng1")
    if(searchNote==null)
    {
        console.log('没有搜索框')
        if(window.searchCount<10)
        {
            setTimeout( addFloat,1000);
        }
        return;
    }
    let myFloat=document.createElement("div");
    myFloat.innerHTML ="<div>截止章节名<input id='myDownloadSearch' type='text'/><a id='myDownload'  href='#' style='cursor:pointer'>下载</a> <a id='myStop'  href='#' style='cursor:pointer'>停止</a></div>"

    searchNote.appendChild(myFloat)
    document.getElementById('myDownload').addEventListener('click',statGet);
    document.getElementById('myStop').addEventListener('click',stopGet);
}
function saveToLocal(){
   localStorage.setItem('myDownaload','')
}
function stopGet(){
    localStorage.setItem('myDownloadStart','0')
    clearInterval(window.downloadFlag)
    window.downloadFlag = null
     // 将数据保存组合
    downloadFile()
}
function statGet(){
    localStorage.setItem('myDownload','')
    localStorage.setItem('myDownloadStart',1)
    localStorage.setItem('myDownloadSearch', document.getElementById('myDownloadSearch').value)
    window.downloadFlag = 1;
    saveText();
}
function checkGet(){
    // https://www.biquge365.net/chapter/
   // 需要自动下载
    let chaptNum = parseInt(localStorage.getItem('myDownloadStart'))
    if( chaptNum> 0 ){
        if(location.href.indexOf('/chapter/')>0){
            document.getElementById('myStop').innerHTML ='停止(已取'+chaptNum+'章节)'
            document.getElementById('myDownloadSearch').value = localStorage.getItem('myDownloadSearch')
            window.downloadFlag = setTimeout(saveText,1000);
            console.log('window.downloadFlag',window.downloadFlag)
            chaptNum++;
            localStorage.setItem('myDownloadStart',chaptNum)
        }else if(location.href.indexOf('/book/')>0)
        {
            alert('全部章节结束，完成')
            stopGet();
        }
    }
}
// 返回题目和内容
function getText(){
    var title = '',txt='';
    if(document.getElementById('txt')!=null){
        title = document.getElementById('neirong').querySelector('h1').innerText
        txt = document.getElementById('txt').innerText.replace('一秒记住【笔趣阁】biquge365.net，更新快，无弹窗！','') // 去掉特殊字符串
    }
    return {title,txt};
}
function saveText(){
    var book = getText();
    var titleSearch = document.getElementById('myDownloadSearch').value
    if(book.title==''){
        alert('未找到章节标题，完成！')
        stopGet()
        return;
    }
    var content = localStorage.getItem('myDownload')
    if(content==null || content=='' ){
        content = JSON.stringify(book)
    }else{
        content = content +'|mydownload|' + JSON.stringify(book)
    }
    localStorage.setItem('myDownload',content)
    console.log(book.title)
    console.log(titleSearch)
    if(titleSearch!=''&&book.title.indexOf(titleSearch)>-1)
    {
        alert('找到目标，完成！')
        stopGet()
    }else if(window.downloadFlag!=null){
        // document.getElementById('fanye1').querySelector('li a').click()
        document.getElementById('fanye1').querySelector('li:nth-child(4) a').click() // 往后翻页
    }
    console.log(window.downloadFlag)
}
// 将 localStorage 的 内容下载
function downloadFile(){
    var content = localStorage.getItem('myDownload')
    var title = document.title.substring(0,document.title.indexOf('_'))
    // 需要处理数据
    if(content==null || content==''){
        alert('没有任何内容')
        return
    }
    var arr = content.split('|mydownload|')
    var myData =''
    for(let v of arr){
       let book = JSON.parse(v)
       myData +='\n'+ book.title.trim() +'\n'+book.txt
    }
    // let searchNote = document.querySelector(".gongneng1")
    // 创建Blob对象
    var blob = new Blob([myData], { type: "text/plain;charset=utf-8" });

    // 创建URL
    var url = URL.createObjectURL(blob);

    // 创建<a>标签并设置属性
    var downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.download = title+".txt"; // 指定下载文件的名称

    // 模拟点击进行下载
    document.body.appendChild(downloadLink); // 需要将链接添加到页面中才能触发点击
    downloadLink.click();

    // 清理/撤销URL
    document.body.removeChild(downloadLink); // 下载后从页面中移除链接
    URL.revokeObjectURL(url); // 释放由createObjectURL创建的URL
}