// ==UserScript==
// @name         假日旅游大屏
// @namespace    http://tampermonkey.net/
// @version      0.7
// @author       储伟杰
// @match        http://*/
// @description  test
// @icon         https://www.google.com/s2/favicons?sz=64&domain=53.35
// @require https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @license chuweijie
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/486747/%E5%81%87%E6%97%A5%E6%97%85%E6%B8%B8%E5%A4%A7%E5%B1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/486747/%E5%81%87%E6%97%A5%E6%97%85%E6%B8%B8%E5%A4%A7%E5%B1%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';
// Your code here...
///////////开始
//$("[name='account']").val("account");
//$("[name='password']").val("password");
/*
function show1(){
console.warn("每隔1秒显示一次");
}
function show2(str){
console.warn(str);
}
setInterval(show1,1000);
setInterval(show2,2000,"每隔2秒我就会显示一次");
*/
//$(".bottom_title").attr("onmouseover", "$(this).hide()");
//$(".bottom_title").attr("onmouseout", "$(this).show()");
//localStorage.removeItem("pop-up-cishu"); 
if(confirm("是否使用储伟杰修改大屏样式\n点击确定使用\n点击取消使用平台原有样式") ==true){
var autoselect = true;
$(".tab-spjk").click();
//点击场景分组按钮
setTimeout("document.getElementsByClassName('pcl_tab pcl_tab_bg')[0].click();",1000);
setTimeout("document.getElementsByClassName('el-input__inner')[6].value='2024';",1000);
//setTimeout("$('.el-input__inner')[6].trigger('input');",1000);
setTimeout("var test = document.getElementsByClassName('el-input__inner')[6];var myEvent = new Event('input');test.dispatchEvent(myEvent);",1000);
////setTimeout("document.getElementsByClassName('el-input__icon')[0].click();",1500);

if (autoselect){
setTimeout(function() { 
setTimeout("document.getElementsByClassName('layui-layer-title')[0].innerHTML='开始选取山塘播放';$('span:contains(2024春节-山塘（定）)').parent().children()[1].click();",1000);
setTimeout("document.getElementsByClassName('btn_tab')[0].click();",5000);
setTimeout("$('span:contains(2024春节-山塘（定）)').parent().children()[1].click();",6000);
setTimeout("document.getElementsByClassName('layui-layer-title')[0].innerHTML='开始选取平江播放';$('span:contains(2024春节-平江（定）)').parent().children()[1].click();",7000);
setTimeout("document.getElementsByClassName('btn_tab')[0].click();document.getElementsByClassName('layui-layer-title')[0].innerHTML='完成自动选取并播放，稍后展示时钟'",15000);
}, 1000);
}

////$("#kmd-video-player").attr("dblclick","$(this).hide();");
////$(".bottom_title").attr("onmouseover", "$(this).hide()");
////$(".bottom_title").attr("onmouseout", "$(this).show()");

//localStorage.setItem("pop-up-cishu", "-1");

var script = document.createElement('script'); 
script.type = "text/javascript"; 
script.innerHTML = ` 

function Clock() {
    var date = new Date();
    this.year = date.getFullYear();
    this.month = date.getMonth() + 1;
    this.date = date.getDate();
    this.day = new Array('星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六')[date.getDay()];
    this.hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    this.minute = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    this.second = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();

    this.toString = function() {
        return '' + this.year + '年' + this.month + '月' + this.date + '日 ' + this.hour + ':' + this.minute + ':' + this.second + ' ' + this.day; 
    };
    
    this.toSimpleDate = function() {
        return this.year + '-' + this.month + '-' + this.date;
    };
    
    this.toDetailDate = function() {
        return this.year + '-' + this.month + '-' + this.date + ' ' + this.hour + ':' + this.minute + ':' + this.second;
    };
    
    this.display = function(ele) {
        var clock = new Clock();
        ele.innerHTML = '' + clock.toString() + '【2024  假日旅游专班   定制版】';
        window.setTimeout(function() {clock.display(ele);}, 1000);
    };
}

function left(obj){
setTimeout(console.warn("[油猴修改] 调整到左边屏幕",obj) ,3000);
setTimeout(function() { 
document.getElementsByClassName('pop-up')[obj].style='z-index: 19999999;width: 1920px;height: 1080px;position: fixed;top: 0px;left: 0px;'
$('iframe')[obj].style='width: 1920px; height: 1080px; margin-left: 0px; margin-top: -0px; border: 0px none;'
document.getElementsByClassName('video_container')[obj].style='transform: scale(1); transform-origin: left top; margin: 0px;width: 1920px;height: 1080px;'
document.getElementsByClassName('layui-layer-content')[Number(obj)+3].style='height: 1080px;'
document.getElementsByClassName('options')[obj].style='display:none;'
}, 3000);
}

function right(obj){
setTimeout(console.warn("[油猴修改] 调整到右边屏幕",obj) ,3000);
setTimeout(function() { 
document.getElementsByClassName('pop-up')[obj].style='z-index: 19999999;width: 1920px;height: 1080px;position: fixed;top: 0px;left: 3840px;'
$('iframe')[obj].style='width: 1920px; height: 1080px; margin-left: 0px; margin-top: -0px; border: 0px none;'
document.getElementsByClassName('video_container')[obj].style='transform: scale(1); transform-origin: left top; margin: 0px;width: 1920px;height: 1080px;'
document.getElementsByClassName('layui-layer-content')[Number(obj)+3].style='height: 1080px;'
document.getElementsByClassName('options')[obj].style='display:none;'
}, 3000);
}

function middle(obj){
setTimeout(console.warn("[油猴修改] 调整到中间屏幕",obj) ,3000);
setTimeout(function() { 
document.getElementsByClassName('pop-up')[obj].style='z-index: 19999999;width: 1920px;height: 1080px;position: fixed;top: 0px;left: 1920px;'
$('iframe')[obj].style='width: 1920px; height: 1080px; margin-left: 0px; margin-top: -0px; border: 0px none;'
document.getElementsByClassName('video_container')[obj].style='transform: scale(1); transform-origin: left top; margin: 0px;width: 1920px;height: 1080px;'
document.getElementsByClassName('layui-layer-content')[Number(obj)+3].style='height: 1080px;'
document.getElementsByClassName('options')[obj].style='display:none;'
}, 3000);
}

function change_spjk_content_weizhi(obj){
console.clear();
console.warn('[油猴传参] 获取到鼠标双击区域: ',obj);
//ii = Number(localStorage.getItem('pop-up-cishu'));
ii = Number(document.getElementsByClassName('pop-up').length -1);
localStorage.setItem("pop-up-cishu", ii+1);
//i = localStorage.getItem("pop-up-cishu");
i = Number(ii + 1);
if (obj == 'spjk_container_left'){
console.warn('[判断弹窗] 当前弹窗编号是: ',i);
//alert('spjk_container_left')
middle(i);
//setTimeout(left(i),3000);
} else if (obj == 'spjk_container_right'){
console.warn('[判断弹窗] 当前弹窗编号是: ',i);
//alert('spjk_container_right')
left(i);
if (ii != '-1' ){right(ii);}
//console.warn('[判断弹窗] 其他弹窗编号是: ',ii);

//setTimeout(right(i),3000);
} else if (obj == 'spjk_container_mid'){
console.warn('[判断弹窗] 当前弹窗编号是: ',i);
//alert('spjk_container_mid')
right(i);
if (ii !=  '-1' ){left(ii);}

//setTimeout(middle(i),3000);
}
}
`;
//document.getElementsByTagName('head')[0].appendChild(script);
(document.body || document.head || document.documentElement).appendChild(script);


setTimeout(function() { 
var clock = new Clock();
console.warn("[油猴修改] 当前时间",clock.toString());
clock.display(document.getElementsByClassName('layui-layer-title')[0]);
clock.display(document.getElementsByClassName('layui-layer-title')[1]);
clock.display(document.getElementsByClassName('layui-layer-title')[2]);
clock.display(document.getElementsByClassName('layui-layer-title')[3]);
//document.getElementsByClassName('layui-layer-title')[1].innerHTML=clock.toString();
//document.getElementsByClassName('layui-layer-title')[2].innerHTML=clock.toString();
//document.getElementsByClassName('layui-layer-title')[3].innerHTML=clock.toString();
}, 100000);




function check_openpop(){
$('canvas').not(":first").attr("style","display:none");//去水印
//$(".spjk_content").attr("ondblclick", "change_spjk_content_weizhi($(this).parent().attr('class'));");
if (autoselect){
document.getElementsByClassName('page-login')[0].style="position: fixed;    top: 0px;    left: 1920px;    z-index: 29999999;    width: 1920px;    height: 1080px;    background-image: url(http://2.40.220.114/%E5%A7%91%E8%8B%8F%E5%8C%BA%E5%81%87%E6%97%A5%E6%97%85%E6%B8%B8%E4%B8%93%E7%8F%AD%E8%A7%86%E9%A2%91%E7%82%B9%E8%B0%83%E4%BC%9A%E5%9C%BA.png);    background-size: 100% 100%;"
document.getElementsByClassName('section-login')[0].style="display:none";
}
//var layer2_status = document.getElementById("layui-layer2") !=null;

var section_spjk = document.getElementsByClassName('section-spjk') !=null;
if (section_spjk == true)
{
document.getElementsByClassName('section-spjk')[0].style='z-index:19999999;width:1920px;height:1080px;top:0px;left:1920px;'
////document.getElementsByClassName('section-spjk')[0].style="display:none";
}else{};

var popup_spjk= document.getElementsByClassName('popup-spjk').length ;
if (popup_spjk == '1'){
//console.warn("use require file strict success");
//console.warn("检测到打开视频监控N宫格 一");
document.getElementsByClassName('popup-spjk')[0].style="z-index: 19999999;width:1920px;height:1080px;top: 0px; left: 0px;";
//document.getElementById("layui-layer2").style="z-index: 19999999;width:1920px;height:1080px;top: 0px; left: 0px;";
//document.getElementsByClassName('spjk_container_left')[0].style="transform: scale(1); transform-origin: left top; margin: 0px;width: 1920px;height: 1080px;padding: 0rem 0rem 0rem;display: flex;flex-wrap: wrap;align-items: center;justify-content: center;";
document.getElementsByClassName('spjk_container_right')[0].style="transform: scale(1); transform-origin: left top; margin: 0px;width: 1920px;height: 1080px;padding: 0rem 0rem 0rem;display: flex;flex-wrap: wrap;align-items: center;justify-content: center;";
//document.getElementsByClassName('layui-layer-content')[1].style="height: 1080px;"

//
//$(".spjk_content").attr("ondblclick", "console.warn('[双击监测1] 获取到鼠标双击区域: ',$(this).parent());")
//$(".spjk_content").attr("ondblclick", "console.warn('[双击监测2] 获取到鼠标双击区域: ',$(this).parent().parent().parent().parent().attr('class'));")
$(".spjk_content").attr("ondblclick", "change_spjk_content_weizhi($(this).parent().attr('class'));");

//***********************************************************************************************************************************************************************************************************************************************************************************
//for (i=1;i<3;i++){
var ii=document.getElementsByClassName('layui-layer-title').length;
for (i=1;i<ii;i++){
//console.warn(["循环i已执行"]);
document.getElementsByClassName('layui-layer-title')[i].style="display:block;position: relative;opacity: 0.;z-index: 59999999;width:1920px;height:1080px;top: 0px; left: 0px;"
document.getElementsByClassName('layui-layer-close')[i].style="z-index: 59999999;"
document.getElementsByClassName('layui-layer-content')[i].style="height: 1080px;position: relative;"
}
//for (j=0;j<2;j++){
var jj=document.getElementsByClassName('change_page').length;
for (j=0;j<jj;j++){
//console.warn(["循环j已执行"]);
//document.getElementsByClassName('popup-spjk')[j].style="z-index: 19999999;width:1920px;height:1080px;top: 0px; left: 0px;"
document.getElementsByClassName('change_page')[j].style="opacity: 0.5;position: fixed;width: 500px;font-size: 3.6rem;display: flex;align-items: center;justify-content: space-between;color: #fff;top: 0.7rem;z-index: 29999999;"
}
var kk=document.getElementsByClassName('spjk_content').length;
for (k=0;k<kk;k++){
//console.warn([i]);
//console.warn(["循环k已执行"]);
document.getElementsByClassName('spjk_content')[k].style="width: 640px;height: 360px;position: relative;border: 0px solid transparent;padding:0px 0px 0px 0px;z-index: 19999999;";//调整网页内所有spjk_content的样式
document.getElementsByClassName('kmd-app-container')[k].style="width: 640px;min-width: 50%;height: 360px;min-height: 50%;position: relative;background: #000;";//
document.getElementsByClassName('bottom_title')[k].style="top: 70px;width: 100%;height: 3rem;font-size: 1.5rem;padding-left: 3rem;line-height: 3rem;z-index: 19999999;";
}

//***********************************************************************************************************************************************************************************************************************************************************************************
} else if (popup_spjk == '2' ){
//console.warn("检测到打开视频监控N宫格 二");
document.getElementsByClassName('popup-spjk')[0].style="z-index: 19999999;width:1920px;height:1080px;top: 0px; left: 0px;";

document.getElementsByClassName('popup-spjk')[1].style="z-index: 19999999;width:1920px;height:1080px;top: 0px; left: 3840px;";
//document.getElementById("layui-layer3").style="z-index: 19891016;width:1920px;height:1080px;top: 0px; left: 3840px;"
//document.getElementsByClassName('spjk_container_right')[0].style="transform: scale(1); transform-origin: right top; margin: 0px;width: 1920px;height: 1080px;padding: 0rem 0rem 0rem;display: flex;flex-wrap: wrap;align-items: center;justify-content: center;";
document.getElementsByClassName('spjk_container_mid')[0].style="transform: scale(1); transform-origin: right top; margin: 0px;width: 1920px;height: 1080px;padding: 0rem 0rem 0rem;display: flex;flex-wrap: wrap;align-items: center;justify-content: center;";
//document.getElementsByClassName('layui-layer-content')[2].style="height: 1080px;"
//$(".spjk_content").attr("ondblclick", "console.warn('[双击监测1] 获取到鼠标双击区域: ',$(this).parent());")
//$(".spjk_content").attr("ondblclick", "console.warn('[双击监测2] 获取到鼠标双击区域: ',$(this).parent().parent().parent().parent().attr('class'));")
$(".spjk_content").attr("ondblclick", "change_spjk_content_weizhi($(this).parent().attr('class'));");

//***********************************************************************************************************************************************************************************************************************************************************************************
//for (i=1;i<3;i++){
var ii=document.getElementsByClassName('layui-layer-title').length;
for (i=1;i<ii;i++){
//console.warn(["循环i已执行"]);
document.getElementsByClassName('layui-layer-title')[i].style="display:block;position: relative;opacity: 0.;z-index: 59999999;width:1920px;height:1080px;top: 0px; left: 0px;"
document.getElementsByClassName('layui-layer-close')[i].style="z-index: 59999999;"
document.getElementsByClassName('layui-layer-content')[i].style="height: 1080px;position: relative;"
}
//for (j=0;j<2;j++){
var jj=document.getElementsByClassName('change_page').length;
for (j=0;j<jj;j++){
//console.warn(["循环j已执行"]);
//document.getElementsByClassName('popup-spjk')[j].style="z-index: 19999999;width:1920px;height:1080px;top: 0px; left: 0px;"
document.getElementsByClassName('change_page')[j].style="opacity: 0.5;position: fixed;width: 500px;font-size: 3.6rem;display: flex;align-items: center;justify-content: space-between;color: #fff;top: 0.7rem;z-index: 29999999;"
}
var kk=document.getElementsByClassName('spjk_content').length;
for (k=0;k<kk;k++){
//console.warn([i]);
//console.warn(["循环k已执行"]);
document.getElementsByClassName('spjk_content')[k].style="width: 640px;height: 360px;position: relative;border: 0px solid transparent;padding:0px 0px 0px 0px;z-index: 19999999;";//调整网页内所有spjk_content的样式
document.getElementsByClassName('kmd-app-container')[k].style="width: 640px;min-width: 50%;height: 360px;min-height: 50%;position: relative;background: #000;";//
document.getElementsByClassName('bottom_title')[k].style="top: 70px;width: 100%;height: 3rem;font-size: 1.5rem;padding-left: 3rem;line-height: 3rem;z-index: 19999999;";
}

//***********************************************************************************************************************************************************************************************************************************************************************************



//console.warn($x("//*[@id='app']"));
} else {
console.warn("[油猴检测] 尚未检测到打开视频监控");
}
}

setInterval(check_openpop,1000);
}
else {
	alert("祝您假日旅游值班快乐");
	}
//////////结束
})();