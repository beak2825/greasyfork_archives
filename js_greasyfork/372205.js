// ==UserScript==
// @name         jsxxzx-study
// @namespace    http://www.js-study.cn
// @icon         https://www.js-study.cn/favicon.ico
// @version      2.1.2
// @description  jsxxzx自动学习，帮助你自动播放视频，自动学习课程
// @author       litao
// @match        *://*.js-study.cn/*
// @exclude      *://*.js-study.cn/certificate/CerDetil/minorCourse.bsh*
// @require      https://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @require      https://cdn.bootcss.com/jquery-cookie/1.4.1/jquery.cookie.min.js
// @run-at       document-end
// @grant        unsafeWindow
// ***********************脚本说明***********************
// ***********************1.证书详情页面：自动查找未学课程并进入视频学习页面学习***********************
// ***********************2.课程播放页面：自动查找未学课程小节并播放视频学习***********************
// @downloadURL https://update.greasyfork.org/scripts/372205/jsxxzx-study.user.js
// @updateURL https://update.greasyfork.org/scripts/372205/jsxxzx-study.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var curPlaySite = '';
    var curWords = '';
    var videoSite = window.location.href;
    var CerDetil = /js-study\.cn\/certificate\/CerDetil/i;
    var course=/js-study\.cn\/course\/resourcePlay/i;
        var cerId=GetQueryString("cerId");
        var siteId=GetQueryString("siteId");
        var urlhost=window.location.host;
    var CerAutoPlay=$.cookie("CerAutoPlay");
    var courseNum=$.cookie("courseNum");
    if(isNaN(parseInt("courseNum"))){
        courseNum=0;
        $.cookie("courseNum",0,{expires:1,path:"/"});
    }
    if(CerAutoPlay!="true"){
        var a=window.confirm("你要设置在播放页面自动选择课程进行播放吗？");
        if(a){
            $.cookie("CerAutoPlay","true",{expires:30,path:"/"});
        }
    };
    if(CerDetil.test(videoSite)){
        var listobj=$(".ced_kc_list");
        var lis=$(".ced_kc_list li");
        var radio_c=$(".radio_c");
        var weixue=new Array();
        $.each(radio_c,function(i,item){
            var fontColor=getHexColor($("i",item).css("color"));
            if(fontColor=="#000000"){
                weixue.push($("i",item));
                //window.console && console.log(typeof($("i",item)));
            }
        });
        //window.console && console.log(weixue);
        if(weixue.length!=0){
            //window.console && console.log(weixue[0]);
            if(CerAutoPlay=="true"){
                if(parseInt(courseNum)>=0){
                    var flag=0;
                    //swal("准备好!", "3分钟后开始进入播放页面学习", "info");
                        swal({
                            title: "准备好!",
                            text: "3分钟后开始进入播放页面学习",
                            type: "info",
                            showCancelButton: true,
                            cancelButtonColor:"green",
                            confirmButtonColor: "red",
                            confirmButtonText: "暂时不进入学习",
                            cancelButtonText: "不等了，立即进入学习",
                            timer:180000,
                            closeOnConfirm: true,
                            closeOnCancel: true
                        }, function (isConfirm) {
                            if (isConfirm) {
                                swal.close();
                            } else {
                                weixue[0].click();
                            }
                        });
                }
            }
            //weixue[0].click();
        }else{
            swal("提示!", "没有找到需要学习的课程", "info");
        }
        return false;
    }
    if(course.test(videoSite)){
        window.console && console.log("播放页面");
var where = document.referrer
if (where == "") {
    window.console && console.log("a bookmark or by typing in my URL");
    where=window.location.protocol+"//"+urlhost+"/certificate/CerDetil/init.bsh?cerId="+cerId+"&siteId="+siteId;
}
//else { window.console && console.log(where) }
        //return false;
        var play_ml=$(".play_ml");
        playerType=$("#playerType").val();
        window.console && console.log(playerType);
        //return false;
        if(play_ml.length !== 0){
            var counttime = setInterval(function () {
                if ($("#progressbar1").width() >= 300) {
                    var $ml_yuan = $("#progressbar1").parents("ul").find(".ml_yuan");
                    if ($ml_yuan.length > 0) {
                        $ml_yuan.first().parents("li").click()
                    } else {
                        clearInterval(counttime);
                        swal({
                            title: "本页课程已经全部学习完毕!",
                            text: "确定返回课程来源页面吗？",
                            type: "success",
                            showCancelButton: true,
                            confirmButtonColor: "green",
                            confirmButtonText: "立即到课程来源页面",
                            cancelButtonText: "关闭本页面！",
                            closeOnConfirm: false,
                            closeOnCancel: false
                        }, function (isConfirm) {
                            if (isConfirm) {
                                //history.back(-1);
                                window.location.href=where;
                            } else {
                                window.close();
                            }
                        });
                        if(CerAutoPlay=="true"){
                            window.location.href=where;
                        }
                    }
                } else {
                    window.console && console.log($("#progressbar1").width())
                }
            }, 60000);
        }else{
        	window.console && console.log("不是播放课程的页面");
        }
    }
    function getHexColor(rgb) {
        if(!$.browser.msie){
            rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
            function hex(x) {return ("0" + parseInt(x).toString(16)).slice(-2);}
            rgb= "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
        }
        return rgb;
    };
    function GetQueryString(name)
    {
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if(r!=null)return unescape(r[2]);
        return null;
    }
})();