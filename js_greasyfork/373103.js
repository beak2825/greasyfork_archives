// ==UserScript==
// @name         闲鱼/咸鱼-助手
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  适应新版闲鱼首页，添加搜索框，改变移动端二维码出现位置，删除下载推广连接，删除修正咸鱼宝贝图片的大小
// @author       ruibty
// @require      https://cdn.bootcss.com/jquery/3.1.1/jquery.min.js
// @match        https://2.taobao.com/*
// @match        https://s.2.taobao.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373103/%E9%97%B2%E9%B1%BC%E5%92%B8%E9%B1%BC-%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/373103/%E9%97%B2%E9%B1%BC%E5%92%B8%E9%B1%BC-%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var locationPage = "home";
    if(document.URL.indexOf("taobao.com/list") != -1){
        //搜索列表
        locationPage = "list";
    }else if(document.URL.indexOf("taobao.com/item") != -1){
        //宝贝详情页
        locationPage = "item";
    }


    var assistant = {
        ready : function(){
            switch(locationPage){
                case "home":
                    $('div[data-v-0bf36d39]').remove();
                    $('div[data-v-2f52e05e]').remove();
                    $('div[data-v-6f55242a]').remove();
                    assistant.addSearchBar();
                    break;
                case "list":
                    assistant.removeXYGuide();
                    break;
                case "item":
                    assistant.removeTheMauGuide();
                    assistant.removeXYGuide();
                    assistant.removeGuarantee();
                    assistant.removeIdleFooter();
                    assistant.setDisplayContact();
                    break;
                default:
                    break;
            }
        },
        onload : function(){
            switch(locationPage){
                case "home":
                    assistant.initSearchBar();
                    break;
                case "list":
                    assistant.changeImgWidthAndHeight();
                    break;
                case "item":
                    assistant.changeImgWidthAndHeight();
                    break;
                default:
                    break;
            }
            assistant.removeTheDownloadLayer();
        },
        removeTheMauGuide : function(){
            //去掉宝贝轮播图第一张碍眼的遮挡文字，放到最后
            var imgSrc = $('.guide-img').attr("src");
            $('.mau-guide').remove();

            //放到轮播图最后
            var lastLi = $('ul[class="album"] li:last');
            var reg = /(?<=(lazyload-img="))[^"]*?(?=")/ig;
            var guideHtml = lastLi[0].outerHTML.replace(reg, imgSrc);
            $('ul[class="album"]').append(guideHtml);

            //处理thumb
            var thumbUl = $('.thumb-list ul');
            var thumbUlLastLiHtml = thumbUl.children('li')[0].outerHTML;
            var thumbReg = /(?<=(src="))[^"]*?(?=")/ig;
            thumbUl.append(thumbUlLastLiHtml.replace(thumbReg, imgSrc));
        },
        removeTheDownloadLayer : function(){
            //宝贝详情页-去掉遮挡推广链接
            $('.download-layer').remove();
        },
        removeXYGuide : function(){
            //宝贝详情页-去掉介绍页咸鱼app的推广广告
            $('.xy-guide').remove();
        },
        removeGuarantee : function(){
            //宝贝详情页-去掉“安全保障”说明
            $('#guarantee').remove();
        },
        removeIdleFooter : function(){
            //宝贝详情页-去掉底部灰色的淘宝官方推广
            $('.idle-footer').remove();
        },
        setDisplayContact : function(){
            //宝贝详情页-增加联系窗口
            $('.contact div').show();
        },
        changeImgWidthAndHeight : function(){
            //修正图片的大小
            $('img').each(function(){
                var imgSrc = $(this).attr("src");
                if(imgSrc && imgSrc.length >= 3){
                    var imgSrcEnd = imgSrc.substr(imgSrc.length - 3, imgSrc.length);
                    if(imgSrcEnd == "jpg"){

                        var imgWidth = $(this)[0].naturalWidth     //图片真实宽度
                        var imgHeight = $(this)[0].naturalHeight   //图片真实高度
                        $(this).attr("width",imgWidth);
                        $(this).attr("height",imgHeight);
                    }
                }
            });
        },
        addSearchBar : function(){
            var searchBar = "<div id='searchBar' style='position: absolute; padding: 0; margin: 0; box-sizing: border-box; height: 42px; width: 300px; border: solid 1px #000000;'>";
            searchBar += "<input type='text' style='padding: 0; margin: 0; border: 0; height: 40px; width: 80%; background-color: #EEEEEE;'>";
            searchBar += "<button style='padding: 0; margin: 0; border: 0; height: 40px; width: 20%; background-color: #59b3f3;'>查询</button>";
            searchBar += "</div>"
            $("body").append(searchBar);
        },
        initSearchBar : function(){

            var marginRight = 50;
            var marginTop = 150;
            var searchBarDiv = document.getElementById("searchBar");

            searchBarDiv.getElementsByTagName("button")[0].onclick = function () {
                var inputText = searchBarDiv.getElementsByTagName("input")[0].value.trim();
                window.location.href = "https://s.2.taobao.com/list/list.htm?q=" + inputText;
            };

            //var top = document.documentElement.scrollTop + marginTop;
            var top = document.documentElement.clientHeight - marginTop;
            searchBarDiv.style.bottom = top + "px";
            var left = document.documentElement.clientWidth - searchBarDiv.offsetWidth - marginRight;
            searchBarDiv.style.left = left + "px";
            // setTimeout(this,100);
        }
    }

    function changeState() {
        if(document.readyState == "complete"){
            assistant.changeImgWidthAndHeight();
        }
    }

    document.onreadystatechange = changeState;

    $(function(){
        assistant.ready();
    });

    window.onload = function(){
        assistant.onload();
    }

})();