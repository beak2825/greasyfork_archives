// ==UserScript==
// @name         8shuake
// @namespace    http://tampermonkey.net/
// @version      2.7
// @description  八大员刷课辅助代码（计时改变识别色块颜色、删除遮罩层等）
// @author       mumu
// @match        http://online.hncen.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hncen.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/469682/8shuake.user.js
// @updateURL https://update.greasyfork.org/scripts/469682/8shuake.meta.js
// ==/UserScript==

(function() {
    'use strict';

let styleSheet = document.styleSheets[0];
styleSheet.insertRule(".layui-layer-shade{height: 0px !important;}");
//设置首页布局
new Promise(function(){
document.getElementsByClassName("login_box")[0].setAttribute("style","margin-left: -1450px;");
});

//设置全部刷完标记
new Promise(function(){
let yqxs = document.getElementById("lblState");//是否完成
let headerbg = document.getElementsByClassName("layadmin-header")[0];
//setTimeout(function(){if(yqxs.innerHTML=='该培训已经结束'){window.alert("判断成功啦！")};}, 50);
setTimeout(function(){if(yqxs.innerHTML=='该培训已经结束'){headerbg.setAttribute("style","background: #1eff00");};}, 50);
});
//设置时间段色块
let colorbiaoji = document.getElementById("l_tip");
new Promise(function(resolve, reject){
    setTimeout(function(){colorbiaoji.innerHTML="初始";colorbiaoji.setAttribute("style","background-color: #ffc600;padding: 4px 12px 4px 50px;");}, 100);
    setTimeout(function(){colorbiaoji.innerHTML="大于1分钟";colorbiaoji.setAttribute("style","background-color: #ff00fc;padding: 4px 12px 4px 50px;");}, 0.5*60*1000);
    setTimeout(function(){colorbiaoji.innerHTML="已15分钟";colorbiaoji.setAttribute("style","background-color: #ff0000;padding: 4px 12px 4px 50px;");}, 15*60*1000);
});


    //隐藏已经刷完的大章节
    let dazhangjie = document.getElementsByClassName("num2");
    new Promise(function(resolve, reject){
        setTimeout(function(){if(dazhangjie[0].previousElementSibling.innerHTML=='8'){dazhangjie[0].parentElement.parentElement.parentElement.style.display="none";};}, 50);
        setTimeout(function(){if(dazhangjie[2].previousElementSibling.innerHTML=='9'){dazhangjie[2].parentElement.parentElement.parentElement.style.display="none";};}, 50);
        setTimeout(function(){if(dazhangjie[6].previousElementSibling.innerHTML=='8'){dazhangjie[6].parentElement.parentElement.parentElement.style.display="none";};}, 50);//BIM中国发展战略(8)
        setTimeout(function(){if(dazhangjie[5].previousElementSibling.innerHTML=='7'){dazhangjie[5].parentElement.parentElement.parentElement.style.display="none";};}, 50);
        setTimeout(function(){if(dazhangjie[14].previousElementSibling.innerHTML=='8'){dazhangjie[14].parentElement.parentElement.parentElement.style.display="none";};}, 50);//基于BIM的管线综合在施工阶段的应用(8课时，小于15分钟)
        setTimeout(function(){if(dazhangjie[17].previousElementSibling.innerHTML=='11'){dazhangjie[17].parentElement.parentElement.parentElement.style.display="none";};}, 50);//装配式混凝土基本介绍(11)
        setTimeout(function(){if(dazhangjie[18].previousElementSibling.innerHTML=='12'){dazhangjie[18].parentElement.parentElement.parentElement.style.display="none";};}, 50);//装配式混凝土建筑施工技术(12)
        setTimeout(function(){if(dazhangjie[20].previousElementSibling.innerHTML=='6'){dazhangjie[20].parentElement.parentElement.parentElement.style.display="none";};}, 50);//装配式混凝土建筑主体施工技术与施工项目案例分析(6课时)
        setTimeout(function(){if(dazhangjie[22].previousElementSibling.innerHTML=='10'){dazhangjie[22].parentElement.parentElement.parentElement.style.display="none";};}, 50);//装配式建筑概述（10课时）
        setTimeout(function(){if(dazhangjie[23].previousElementSibling.innerHTML=='6'){dazhangjie[23].parentElement.parentElement.parentElement.style.display="none";};}, 50);//（小于16分钟）
        setTimeout(function(){if(dazhangjie[24].previousElementSibling.innerHTML=='10'){dazhangjie[24].parentElement.parentElement.parentElement.style.display="none";};}, 50);//装配式建筑工程造价（小于16分钟）
    });

    //隐藏课时少的章节
    new Promise(function(){
        setTimeout(function(){dazhangjie[29].parentElement.parentElement.parentElement.style.display="none";}, 50);
        setTimeout(function(){dazhangjie[28].parentElement.parentElement.parentElement.style.display="none";}, 50);
        setTimeout(function(){dazhangjie[27].parentElement.parentElement.parentElement.style.display="none";}, 50);
        setTimeout(function(){dazhangjie[26].parentElement.parentElement.parentElement.style.display="none";}, 50);
        setTimeout(function(){dazhangjie[25].parentElement.parentElement.parentElement.style.display="none";}, 50);
        setTimeout(function(){dazhangjie[21].parentElement.parentElement.parentElement.style.display="none";}, 50);
        setTimeout(function(){dazhangjie[19].parentElement.parentElement.parentElement.style.display="none";}, 50);
        setTimeout(function(){dazhangjie[16].parentElement.parentElement.parentElement.style.display="none";}, 50);
        setTimeout(function(){dazhangjie[15].parentElement.parentElement.parentElement.style.display="none";}, 50);
        setTimeout(function(){dazhangjie[13].parentElement.parentElement.parentElement.style.display="none";}, 50);
        setTimeout(function(){dazhangjie[12].parentElement.parentElement.parentElement.style.display="none";}, 50);
        setTimeout(function(){dazhangjie[11].parentElement.parentElement.parentElement.style.display="none";}, 50);
        setTimeout(function(){dazhangjie[10].parentElement.parentElement.parentElement.style.display="none";}, 50);
        setTimeout(function(){dazhangjie[9].parentElement.parentElement.parentElement.style.display="none";}, 50);
        setTimeout(function(){dazhangjie[8].parentElement.parentElement.parentElement.style.display="none";}, 50);
        setTimeout(function(){dazhangjie[7].parentElement.parentElement.parentElement.style.display="none";}, 50);
        setTimeout(function(){dazhangjie[4].parentElement.parentElement.parentElement.style.display="none";}, 50);
        setTimeout(function(){dazhangjie[3].parentElement.parentElement.parentElement.style.display="none";}, 50);
        setTimeout(function(){dazhangjie[1].parentElement.parentElement.parentElement.style.display="none";}, 50);
    });

            //删除已经刷完的单节课
        let keok = document.getElementsByClassName("icon_ok");
        new Promise(function(){
            setTimeout(function(){if(keok[11]){keok[11].parentElement.parentElement.parentElement.remove()};}, 20);
            setTimeout(function(){if(keok[10]){keok[10].parentElement.parentElement.parentElement.remove()};}, 20);
            setTimeout(function(){if(keok[9]){keok[9].parentElement.parentElement.parentElement.remove()};}, 20);
            setTimeout(function(){if(keok[8]){keok[8].parentElement.parentElement.parentElement.remove()};}, 20);
            setTimeout(function(){if(keok[7]){keok[7].parentElement.parentElement.parentElement.remove()};}, 20);
            setTimeout(function(){if(keok[6]){keok[6].parentElement.parentElement.parentElement.remove()};}, 20);
            setTimeout(function(){if(keok[5]){keok[5].parentElement.parentElement.parentElement.remove()};}, 20);
            setTimeout(function(){if(keok[4]){keok[4].parentElement.parentElement.parentElement.remove()};}, 20);
            setTimeout(function(){if(keok[3]){keok[3].parentElement.parentElement.parentElement.remove()};}, 20);
            setTimeout(function(){if(keok[2]){keok[2].parentElement.parentElement.parentElement.remove()};}, 20);
            setTimeout(function(){if(keok[1]){keok[1].parentElement.parentElement.parentElement.remove()};}, 20);
            setTimeout(function(){if(keok[0]){keok[0].parentElement.parentElement.parentElement.remove()};}, 20);
        });

})();

   /*      let timenn = document.getElementsByClassName("duration")[0];
        new Promise(function(){
             setTimeout(function(){if(timenn.innerHTML >= "16:00"){document.getElementById("l_item").setAttribute("style","background-color: #660066")};}, 5000);
        });
         */

//显示视频播放进度条
/* let styleSheet1 = document.styleSheets[1];
styleSheet1.insertRule(".prism-controlbar{display: block !important;}"); */