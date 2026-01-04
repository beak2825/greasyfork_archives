// ==UserScript==
// @name           去除网易云课堂二维码
// @namespace      https://gitee.com/LPD_DreamDeparture
// @version        1.0.1
// @description    去除网易云课堂视频页面的二维码
// @author         LiZhuiMeng
// @include        https://study.163.com/course/courseLearn.htm?courseId=1004573059#/learn/video?lessonId=/^\d{10}$/&courseId=/^\d{10}$/
// @match          https://study.163.com/course/courseLearn.htm?courseId=1004573059
// @require        http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @icon           http://img.25pp.com/uploadfile/soft/images/2014/0812/20140812123859499.jpg
// @run-at         document-end
// @grant          unsafeWindow
// @grant          GM_getValue
// @grant          GM.getValue
// @grant          GM_setValue
// @grant          GM.setValue
// @grant	       GM_addStyle
// @grant          GM_xmlhttpRequest
// @grant          GM_getResourceText
// @grant          GM_registerMenuCommand
// @create         2019-01-23
// @copyright      2019, ZM
// @lastmodified   2019-01-24
// @license        MIT
// @homepageURL    https://gitee.com/LPD_DreamDeparture
// @supportURL     https://gitee.com/LPD_DreamDeparture/yunketang_clearLayer
// @downloadURL https://update.greasyfork.org/scripts/377044/%E5%8E%BB%E9%99%A4%E7%BD%91%E6%98%93%E4%BA%91%E8%AF%BE%E5%A0%82%E4%BA%8C%E7%BB%B4%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/377044/%E5%8E%BB%E9%99%A4%E7%BD%91%E6%98%93%E4%BA%91%E8%AF%BE%E5%A0%82%E4%BA%8C%E7%BB%B4%E7%A0%81.meta.js
// ==/UserScript==

window.onload = function(){
    //声明变量
    var timer = null;
    var flag = false;
    //开启计时器
    timer = setTimeout(getLayer,5000);
    //获取对象的方法
    function getLayer(){
        //获取对象
        var oLayer = document.querySelector(".ux-modal-fadeIn");
        //alert("2333去除毒瘤成功");
        if(oLayer){
            oLayer.style.display = "none";
        }else{
            alert("没获取到遮罩层元素");
            return;
        }
        flag = confirm("毒瘤是否成功去除？");
        return flag;
    };
    //判断毒瘤是否成功去除
    setTimeout(function(){
        if(flag){
            clearTimeout(timer);
            alert("恭喜毒瘤去除成功");
        }else{
            alert("没关系再来一次");
            clearTimeout(timer);
            timer = setTimeout(getLayer,500);
        }
    },5500);
    //
    document.body.onclick = function (ev){
        ev = ev || window.event;
        var target = ev.target || ev.srcElement;
        console.log("zm"+target);
        if(hasClass(target,"ux-modal-fadeIn")){
            target.style.display = "none";
        };

    }
    //判断是否包含某个类名
    function hasClass(ele,className) {
        if(ele.classList){
            return ele.classList.contains(className);
        }else{
            return new RegExp('(^| )' + className + '( |$)', 'gi').test(ele.className);
        }
    }

}
