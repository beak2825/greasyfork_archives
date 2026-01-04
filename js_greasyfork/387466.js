// ==UserScript==
// @name         新贵州网收费视频破解
// @namespace    http://tampermonkey.net/
// @version      0.1.5  
// @description 本脚本仅可研究学习使用、请勿用作商业用途。 【笔试】贵州省考-申论冲刺班、【笔试】行测高频考点、【笔试】行测高频考点、2019公务员/选调生/事业单位/结构化面试课程  暂未破解 第一次破解、勿喷 ，
// @author       ahl
// @include     http*://www.xgzrs.com/course/*
// @compatible        chrome
// @match        http*://www.xgzrs.com/course/online/1034/0.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387466/%E6%96%B0%E8%B4%B5%E5%B7%9E%E7%BD%91%E6%94%B6%E8%B4%B9%E8%A7%86%E9%A2%91%E7%A0%B4%E8%A7%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/387466/%E6%96%B0%E8%B4%B5%E5%B7%9E%E7%BD%91%E6%94%B6%E8%B4%B9%E8%A7%86%E9%A2%91%E7%A0%B4%E8%A7%A3.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    var baseVideoUrl="http://video.gwypxw.com/";
    var prvx=".mp4";
    // var baseUrl="https://www.xgzrs.com";

    var currUrl = window.location.href;
    var start=currUrl.lastIndexOf('/')+1;
    var end=currUrl.lastIndexOf('.');
    var fileName=currUrl.substring(start,end);

    if(fileName==0){
        $(".list-panel>.item").each(function(idx){
            if(idx==0){
                //  location.href =baseUrl+$(this).find("a").attr("href");
                location.href =$(this).find("a").attr("href");
            }
        });
    }

    var header=$(".header").html();
    var title=$(".title").html();
    var palyUrl=baseVideoUrl+title+"/"+header+prvx;

    var video = {
        checkUrl: "/course/online/video/check/"+fileName+".html",
        playUrl: "/course/online/video/play/"+fileName+".html",
        current: jQuery("#video"),
        btn: jQuery("#video_button"),
        btnEvent: function () {
            video.btn.click(function () {
                video.ajax(video.checkUrl);
            });
        },
        event: function () {
            jQuery(document.body).on("click", "#score-exchange-online-course-btn", function (e) {
                jQuery.post("/course/score/exchange/1035.html", null, function (response) {
                    // pcDialog.toast(response.statusText);
                    if (response.statusCode == 200) {
                        location.reload();
                    }
                });
            });
            jQuery(document.body).on("click", "#card-exchange-online-course-btn", function (e) {
                // alert("未实现其业务逻辑");
            });
        },
        ajax: function (url) {
            jQuery.post(url, null, function (response) {
                if (response.statusCode == 200) {
                    videojs("video", { "controls": true }).ready(function () {
                        video.btn.hide();
                        this.src(response.extra);
                        this.play();
                    });
                }
                else if (response.statusCode == 201) {
                    video.ajax(video.playUrl);
                }
                else if (response.statusCode == 202) {
                    pcDialog.confirm(response.statusText, function (result) {
                        if (result) location.href = "/user/improve.html?returnUrl=" + encodeURI(location.href) + "";
                    });
                }
                else if (response.statusCode == 401) {
                    videojs("video", { "controls": true }).ready(function () {
                        video.btn.hide();
                        if(currUrl.indexOf("online/13/")>0){
                            var name=header.split("：");

                            var titleName=name[1];
                            var titleArr2=[];
                            //医学知识

                            var titleArr1=[];
                            $("#donoter_course").find(".title").each(function(){
                                titleArr1.push($(this).html());
                            });

                            $("#donoter_course").find(".list-panel").each(function(idx){
                                var title1=titleArr1[idx];
                                $(this).find(".item").each(function(idx1){
                                    var videoEle=$(this).find("a");
                                    var vedioName=$(this).find("a").html();
                                    vedioName=vedioName.replace("[视频]","");

                                    var fix=vedioName.substring(vedioName.indexOf('[')+1,vedioName.indexOf(']'));
                                    var a= fix.split("-");
                                    var en=vedioName.substring(vedioName.indexOf(']')+1,vedioName.length);

                                    if(fix.indexOf("-")<=0){
                                        vedioName=title1+"/"+en;
                                    }else{
                                        vedioName=title1+"/"+a[1]+a[0]+"/"+en
                                    }
                                    vedioName=baseVideoUrl+"医疗知识/"+vedioName+prvx;

                                    console.log();
                                    if(vedioName.indexOf(titleName)!= -1 ){
                                        palyUrl=vedioName;
                                    }
                                });
                            });
                        }
                        this.src(palyUrl);
                        this.play();
                    });
                } else if (response.statusCode == 403) {
                    pcDialog.confirm(response.statusText, function (result) {
                        if (result) location.href = "/login.html?returnUrl=" + encodeURI(location.href) + "";
                    });
                }
                else {
                    pcDialog.toast(response.statusText);
                }
                $(".jDialog-content").hide();
                $("div.jDialog-container.animated.pcDialog.dialog-window.jDialog-container-black.linearTop").each(
                    function(){
                        $(this).attr("style:position: unset;");
                        $(this).hide();
                    }
                );
            });
        },
        init: function () {
            if (video.checkUrl && video.current) {
                video.event();
                video.ajax(video.checkUrl);
            }
        }
    };

    if(currUrl.indexOf("login.html?returnUrl=")!= -1 ){
        return;
    }


    video.init();
    video.btn.hide();

})();