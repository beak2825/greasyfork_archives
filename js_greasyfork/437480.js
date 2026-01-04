// ==UserScript==
// @name         小红书图片放大
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  放大小红书的图片
// @author       fivemz
// @match        <$URL$>
// @icon         https://www.xiaohongshu.com/favicon.ico
// @include      http*://www.xiaohongshu.com/*
// @grant        none
// @require      http://libs.baidu.com/jquery/2.1.3/jquery.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/layer/3.5.1/layer.js
// @downloadURL https://update.greasyfork.org/scripts/437480/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E5%9B%BE%E7%89%87%E6%94%BE%E5%A4%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/437480/%E5%B0%8F%E7%BA%A2%E4%B9%A6%E5%9B%BE%E7%89%87%E6%94%BE%E5%A4%A7.meta.js
// ==/UserScript==

(function() {
    'use strict';
      $(document.body).append(`<link href="https://cdn.bootcdn.net/ajax/libs/layer/3.5.1/theme/default/layer.min.css" rel="stylesheet">`)
	$(document).ready(function() {
        var res = {
            title: "图片", //相册标题
            id: 123, //相册id
            start: 0, //初始显示的图片序号，默认0
        }
        var data = [];
        $('.carousel ul.slide li').each(function(i,item){
            console.log($(item));
            var url2 = $(item).children().css('background-image');
            var url = url2.substring(5,url2.length-2);
            var newUrl = {
                "alt": "图片"+(i+1),
                    "pid": i,
                    "src": url,
                    "thumb": ""
            }
            data.push(newUrl);
        });
        $("body").bind('keypress', function(event){
            if(event.key.toLowerCase() == "a"){
                $(".layui-layer-imgprev").click();
            }
            if(event.key.toLowerCase() == "d"){
                $(".layui-layer-imgnext").click();
            }
        })
        $(".change-pic, .inner").on("click",function(){
            var i1 = 0;
            $('.carousel ul.slide li').each(function(i,item){
                if($(this).css('display')!='none'){
                    i1 = i;
                }
            });
            res.start = i1;
            layer.photos({
                photos:res,
                success: function(){
                    //以鼠标位置为中心的图片滚动放大缩小
                    $(document).on("mousewheel",".layui-layer-photos",function(ev){
                        var oImg = this;
                        var ev = event || window.event;//返回WheelEvent
                        //ev.preventDefault();
                        var delta = ev.detail ? ev.detail > 0 : ev.wheelDelta < 0;
                        var ratioL = (ev.clientX - oImg.offsetLeft) / oImg.offsetWidth,
                            ratioT = (ev.clientY - oImg.offsetTop) / oImg.offsetHeight,
                            ratioDelta = !delta ? 1 + 0.1 : 1 - 0.1,
                            w = parseInt(oImg.offsetWidth * ratioDelta),
                            h = parseInt(oImg.offsetHeight * ratioDelta),
                            l = Math.round(ev.clientX - (w * ratioL)),
                            t = Math.round(ev.clientY - (h * ratioT));
                        $(".layui-layer-photos").css({
                            width: w, height: h
                            ,left: l, top: t
                        });
                        $("#layui-layer-photos").css({width: w, height: h});
                        $("#layui-layer-photos>img").css({width: w, height: h});
                    });
                }
            });
        });
        res.data = data;
    });
    // Your code here...
})();