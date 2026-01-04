// ==UserScript==
// @name         当当图书排行
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @description  当当图书排行，如需重新采集可点击"清空数据"，按F12点击"显示数据"可查看已采集的数据，复制粘贴至excel，采用'|'符号分割字符串即可
// @author       qiu6406
// @match        http://bang.dangdang.com/books/bestsellers/*
// @match        http://bang.dangdang.com/books/newhotsales/*
// @match        http://bang.dangdang.com/books/childrensbooks/*
// @match        http://bang.dangdang.com/books/fivestars/*
// @match        http://product.dangdang.com/*
// @require      https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_openInTab

// @downloadURL https://update.greasyfork.org/scripts/448203/%E5%BD%93%E5%BD%93%E5%9B%BE%E4%B9%A6%E6%8E%92%E8%A1%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/448203/%E5%BD%93%E5%BD%93%E5%9B%BE%E4%B9%A6%E6%8E%92%E8%A1%8C.meta.js
// ==/UserScript==
var study_css = ".egg_study_btn{z-index:99999;outline:0;border:0;position:fixed;top:5px;left:5px;padding:12px 20px;border-radius:10px;cursor:pointer;background-color:#fff;color:#d90609;font-size:18px;font-weight:bold;text-align:center;box-shadow:0 0 9px #666777}.egg_manual_btn{transition:0.5s;outline:none;border:none;padding:12px 20px;border-radius:10px;cursor:pointer;background-color:#e3484b;color:rgb(255,255,255);font-size:18px;font-weight:bold;text-align:center;}.egg_auto_btn{transition:0.5s;outline:none;border:none;padding:12px 20px;border-radius:10px;cursor:pointer;background-color:#666777;color:rgb(255,255,255);font-size:18px;font-weight:bold;text-align:center;}.egg_setting_box{position:fixed;top:70px;left:5px;padding:12px 20px;border-radius:10px;background-color:#fff;box-shadow:0 0 9px #666777}.egg_setting_item{margin-top:5px;height:30px;width:140px;font-size:16px;display:flex;justify-items:center;justify-content:space-between}input[type='checkbox'].egg_setting_switch{cursor:pointer;margin:0;outline:0;appearance:none;-webkit-appearance:none;-moz-appearance:none;position:relative;width:40px;height:22px;background:#ccc;border-radius:50px;transition:border-color .3s,background-color .3s}input[type='checkbox'].egg_setting_switch::after{content:'';display:inline-block;width:1rem;height:1rem;border-radius:50%;background:#fff;box-shadow:0,0,2px,#999;transition:.4s;top:3px;position:absolute;left:3px}input[type='checkbox'].egg_setting_switch:checked{background:#fd5052}input[type='checkbox'].egg_setting_switch:checked::after{content:'';position:absolute;left:55%;top:3px}";
GM_addStyle(study_css);
let url = window.location.href;
//创建“开始”按钮和配置
function createStartButton(){
    let base = document.createElement("div");
    var baseInfo="";
    baseInfo += '<form id="settingData" class="egg_menu" action="" target="_blank" onsubmit="return false"><div class="egg_setting_box"><div class="egg_setting_item"><button id="listAll" style="width: 100%;">显示所有</button></div><div class="egg_setting_item"><button id="resetCache" style="width: 100%;">清空数据</button></div></div></form>';
    base.innerHTML = baseInfo;
    let body = document.getElementsByTagName("body")[0];
    body.append(base)
    let startButton = document.createElement("button");
    startButton.setAttribute("id","startButton");
    startButton.innerText = "开始采集";
    startButton.className = "egg_study_btn egg_menu";
    //添加事件监听
    try{// Chrome、FireFox、Opera、Safari、IE9.0及其以上版本
        startButton.addEventListener("click",start,false);
    }catch(e){
        try{// IE8.0及其以下版本
            startButton.attachEvent('onclick',start);
        }catch(e){// 早期浏览器
            console.log("error: 开始按钮绑定事件失败")
        }
    }
    //插入节点
    body.append(startButton)
}

//清空保存的数据
function resetCache(){
    console.log('清理数据');
    let keys = GM_listValues();
    for (let key of keys) {
      GM_deleteValue(key);
    }
}

//复制到剪贴板
function copyBookInfo(content,message){
    var aux = document.createElement("input");
    aux.setAttribute("value", content);
    document.body.appendChild(aux);
    aux.select();
    document.execCommand("copy");
    document.body.removeChild(aux);
}

//显示所有采集数据
function listAll(){
    var data = GM_listValues().map(GM_getValue)
    var content = data.join("\r");
    console.log(content);
}

//获取图书信息
function getBookInfo(){
    return new Promise(resolve => {
        var tempStr,title,author,pub,pubDate,isbn,price,format,wrap;
        title = document.getElementsByTagName("h1")[0].innerText;
        author = document.getElementById("author").innerText.substring(3);
        pub = document.getElementsByClassName("t1")[1].innerText.substring(4);
        pubDate = document.getElementsByClassName("t1")[2].innerText.substring(4);
        // tempStr = document.getElementsByClassName("key clearfix").item(0).innerHTML;
        tempStr = document.getElementsByClassName("key clearfix")[0].children[4].innerHTML;
        isbn = tempStr.substring(tempStr.indexOf("国际标准书号ISBN：")+11,tempStr.length);
        price = document.getElementById("original-price").innerText;
        format = tempStr.substring(25,28);
        wrap = tempStr.substring(57,59);
        GM_setValue("bookInfo",title+"|"+author+"|"+pub+"|"+pubDate+"|"+isbn+"|"+price+"|"+format+"|"+wrap);
        resolve('done');
    });
}


//获取登录状态

function isLogin(){
    if($(".hi").length) {
        console.log("已登录")
        return 0;
    }
    else {
        console.log("请先登录");
        return 1;
    }

}


//初始化操作:创建按钮，获取页码
function init(){
    let ul = $('.paging')[0];
    let Pages = ul.childNodes[ul.childNodes.length-3].innerText;
    let currPage = $(".current")[0].innerText;
    console.log('总页码:' + Pages + '\n' + '当前页码:' + currPage );
    GM_setValue('Pages',Pages);
    GM_setValue('currPage',currPage);
}

//等待窗口关闭
function waitingClose(newPage){
    return new Promise(resolve => {
        let doing = setInterval(function() {
            if(newPage.closed) {
                clearInterval(doing);//停止定时器
                resolve('done');
            }
        }, 1000);
    });
}

//等待时间工具函数
function waitingTime(time){
    if(!Number.isInteger(time)){
        time = 1000;
    }
    return new Promise(resolve => {
        setTimeout(function(){
            resolve('done');
        },time);
    });
}

//获取当前页面图书列表
async function getBooks(){
    let currBooks = $('.bang_list li');
    for ( let value of currBooks ){
        if(GM_getValue('paused')) return -1;
        let num =  value.children[0].innerHTML;//序号
        // let title = value.children[2].childNodes[0].attributes.title;
        let  productUrl =  value.children[2].childNodes[0].attributes.href.nodeValue;//图书详情连接
        // 打开新的tab，等待页面关闭之后保存图书信息
        let newPage = GM_openInTab(productUrl, { active: true, insert: true, setParent :true })
        await waitingClose(newPage);
        await waitingTime(1500);
        if(GM_getValue("bookInfo")){
            console.log('完成第'+num+'条');
            GM_setValue(num,GM_getValue("bookInfo"));
        }else {
            console.log("没有获取到书目信息");
        }
    }
    //跳转到下一页
    if( parseInt(GM_getValue('currPage')) <= parseInt(GM_getValue('Pages')) ){
        loadData(parseInt(GM_getValue('currPage'))+1);
    }
    else {
        console.log('总页码:' + parseInt(GM_getValue('Pages')) + '\n' + '当前页码:' + parseInt(GM_getValue('currPage')) );
        console.log('采集结束');
        listAll();
    }

}

function start(){

    if(isLogin()){
        alert("请先登录!");
        return -1;
    } else {
        let startButton = document.getElementById("startButton");
        if( startButton.innerText == "开始采集") {
            startButton.innerText = "停止采集";
            GM_setValue('paused',0);
        }else{
            startButton.innerText = "开始采集";
            GM_setValue('paused',1);//设置停止采集标记
        }
    }
    //开始
    if( url.search(new RegExp('bestsellers')) > 0 || url.search(new RegExp('newhotsales')) > 0 || url.search(new RegExp('childrensbooks')) > 0 || url.search(new RegExp('fivestars')) > 0 ) {
        //初始化
        console.log('排行榜页面');
        init();
        getBooks();
    }
}

'use strict';
$(document).ready(function(){
    createStartButton();
    //添加事件监听
    try{// Chrome、FireFox、Opera、Safari、IE9.0及其以上版本
        document.getElementById('listAll').addEventListener("click",listAll,false);
        document.getElementById('resetCache').addEventListener("click",resetCache,false);
    }catch(e){
        try{// IE8.0及其以下版本
            document.getElementById('listAll').attachEvent('onclick',listAll);
            document.getElementById('resetCache').attachEvent('onclick',resetCache);
        }catch(e){// 早期浏览器
            console.log("error: 开始按钮绑定事件失败")
        }
    }
    //详情页面
    if ( url.search(new RegExp('product')) > 0 && GM_getValue('paused') == 0 ){
        console.log('图书详情页面');
        getBookInfo();
        window.close();
    }
    //处理点击下一页
    else if(  startButton.innerText == "开始采集" && GM_getValue('paused') == 0  ){
        console.log('开始采集下一页');
        startButton.innerText = "停止采集";
        init();
        getBooks();
    }

})
