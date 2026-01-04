// ==UserScript==
// @name         虎牙(一键送礼)
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  抢原石脚本
// @author       小叮当
// @match        https://www.huya.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=huya.com
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/450130/%E8%99%8E%E7%89%99%28%E4%B8%80%E9%94%AE%E9%80%81%E7%A4%BC%29.user.js
// @updateURL https://update.greasyfork.org/scripts/450130/%E8%99%8E%E7%89%99%28%E4%B8%80%E9%94%AE%E9%80%81%E7%A4%BC%29.meta.js
// ==/UserScript==
var f1 //弹幕
var f2=setInterval(function(){document.getElementById('J_spbg').setAttribute("style","height: 100px;");;},1000) //修改页面

function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = decodeURI(window.location.search).substr(1).match(reg);
    if(r != null) return (r[2]);
    return null;
}
var room=getQueryString("room")
var gift_num=getQueryString("gift_num")
setTimeout(function(){
    var f0 = setInterval(function(){
        if(room == "ok"){
            clearInterval(f0);
            clearInterval(f2);
            f1 = setInterval(send_danmu,1000); //1秒执行一次函数
            setTimeout(function(){send_gift(gift_num);},4*1000)
        }
},1000)},2000)

function send_danmu() {
    var input = document.querySelector('#player-full-input-txt'); //获取文本框
    input.value = "giegie！！窝要给恁生猴仔"; //设置文本框的内容
    var btn = document.querySelector('#player-full-input-btn'); //获取发送按钮
    btn.click(); //点击发送按钮
}


function send_gift(gift_num){
setTimeout(function(){
    for(let i=0;i<=document.getElementsByClassName('player-face-gift').length;i++){
        // console.log("length= "+document.getElementsByClassName('player-face-gift').length)
        console.log("i=="+i)
        if(document.getElementsByClassName('player-face-gift')[i].children[1].currentSrc == 'https://huyaimg.msstatic.com/cdnimage/actprop/20427_1__45_1601194513.jpg'){
            for(let j=1;j<=gift_num;j++){
                console.log("送礼成功"+j)
                setTimeout(function(){console.log(j);document.getElementsByClassName('player-face-gift')[i].click()},j*1500)
            }
            setTimeout(function(){window.close()},2*60*1000) //关闭当前网页
            break;
        }
    }
},1000)}
