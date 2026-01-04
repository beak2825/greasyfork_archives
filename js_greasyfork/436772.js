// ==UserScript==
// @name         JDY_Scroll_X
// @namespace    http://www.liftnova-cranes.com/
// @version      0.3
// @description  使简道云仪表盘中的明细表自动滚动forX
// @author       Bruce
// @match        https://u4c0fh51hz.jiandaoyun.com/dash/*
// @icon         https://www.google.com/s2/favicons?domain=jiandaoyun.com
// @grant        GM_addStyle
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/436772/JDY_Scroll_X.user.js
// @updateURL https://update.greasyfork.org/scripts/436772/JDY_Scroll_X.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var web_height = 1080; //页面高度，默认1080P的高度
    var delay_time = 15000; //单位毫秒，根据原本页面载入用时判断
setTimeout(function(){
alert("(您的浏览器的分辨率为："+($(document).width()+"*"+$(document).height())+")");  
document.querySelector('meta[name="viewport"]').setAttribute('content','width=device-width, initial-scale=0.67, maximum-scale=0.67, user-scalable=no,target-densitydpi=400');
alert("(您的浏览器的分辨率为："+($(document).width()+"*"+$(document).height())+")"); 
    var scroll_speed = 50; //滚动速度，越小越快
    var stop_time = 10000; //单位毫秒，滚到底部时页面停留时间，默认10秒
    var delay_time = 5000; //单位毫秒，根据原本页面载入用时判断
    var reload_time = 14400000; //单位毫秒，4小时为14400000，页面刷新时间间隔
    var objCount = document.getElementsByClassName("count")[0];//状态栏中记录数文本，例如‘共32条’
    var str = objCount.innerHTML;
    var num = parseInt(str.substring(1));
    //根据滚动速度，行高判断，滚动到底部时需要多少时间。
    //默认字体font-size=13px,padding:7px 10px,line-height:18px,因此行高18+7+7+1=33px，改字体font-size=20px,padding:9px 10px,line-height:28px后行高28+9+9+1=47px。
    var line_height = 33;
    //1920*1080分辨率下，明细表高应为1080-60-12-10=998px。无法通过添加css改，只能通过js改。
    //单页显示高度为998-(top40被改为5)-(bottom10)-(上下边线2)-5-47-6=847px，847/47=18.02，约18条。
    //滚动一行所需时间为scroll_speed*47=2.35秒
    //即需要滚动时间为(num-18)*2.35
    var table_height = web_height-60-12-10-5-10-2-5-47-6; //表格显示高度
    var line_count = Math.trunc(table_height / line_height);

//css start
    let css = `
.x-data-table.size-small td .cell-wrapper,.x-data-table.size-small th .cell-wrapper {
font-size: 13px;/*表头及表格文字大小、对齐*/
padding: 4px 5px;
line-height: 18px;
text-align: center;
}
.entry-name {
text-align:center;/*仪表盘标题居中*/
}
i.iconfont-fx-pc {
display:none;/*顶部全屏等图标去除*/
}
.fx-dashboard-entry-view.dash-theme-dark .content-header .header-btn .x-button {
display:none;/*顶部全屏文字去除*/
}
.jdy-page-dash-public-view .fx-dashboard-entry-view .content-header .entry-name, .jdy-page-dash-public-view .fx-dashboard-entry-view .content-header .header-btn .x-button {
font-size:16px;/*仪表盘标题文字大小*/
}
.header-title {
display:none;/*明细表标题栏隐藏*/
}
.fx-dash-data-table .x-pagination {
display:none;/*明细表状态栏隐藏*/
}
.fx-dash-container .container-content {
top:5px;/*隐藏标题栏后提高表格，原来40*/
}
.fx-dash-data-table .table-wrapper {
bottom: 5px;/*隐藏状态栏后拉伸表格，原来46*/
}
.x-tag .tag-wrapper {
font-size:12px;/*条件格式文字大小*/
}
    `
    GM_addStyle(css);
    var div=document.getElementsByClassName("fx-dash-container dash-widget dash-theme-dark")[0];
    div.style.height="998px";
//css end

//scroll start
    if (num>line_count) {
    var my_time;
    var stopframe = 0;
    var objDiv = document.getElementsByClassName("x-table-body")[0]; //滚动明细表的class
    var pageScroll = function() {
        objDiv.scrollTop = objDiv.scrollTop + 1;
        //console.log(objDiv.scrollTop);
        if (objDiv.scrollTop > (objDiv.scrollHeight - table_height)) {
            stopframe = stopframe +1;
            //console.log(stopframe);
            if (stopframe > stop_time/scroll_speed ) {
                objDiv.scrollTop = 0;
                stopframe = 0;
            }
        }
        my_time = setTimeout(pageScroll, scroll_speed);
    }
    pageScroll();
    }
//scroll end

//reload start
    setTimeout(() => {
        location.reload()
    },reload_time);
//reload end

//FullScreen start
    //自动全屏，chrome下可能失效
    // 判断各种浏览器，找到正确的方法
var launchFullscreen = function(element) {
 if(element.requestFullscreen) {
  element.requestFullscreen();
 } else if(element.mozRequestFullScreen) {
  element.mozRequestFullScreen();
 } else if(element.webkitRequestFullscreen) {
  element.webkitRequestFullscreen();
 } else if(element.msRequestFullscreen) {
  element.msRequestFullscreen();
 }
}
 
    // 启动全屏!
launchFullscreen(document.documentElement); // 整个网页
//FullScreen end

} , delay_time)
    // Your code here...
})();