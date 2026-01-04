// ==UserScript==
// @name         下黄图
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  try to take over the world!
// @author       You
// @match        http://www.177pic.info/*
// @match        https://ahri-hentai.com/*
// @match        http://493428493428c.monster/*
// @match        https://zh.nyahentai.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426482/%E4%B8%8B%E9%BB%84%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/426482/%E4%B8%8B%E9%BB%84%E5%9B%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * 通过图片链接获取base64
     * @param url   //图片链接
     * @param ext   //图片格式
     * @param callback  //回调函数，回调base64
     */
    function getUrlBase64(url, ext, callback) {
        var canvas = document.createElement("canvas");   //创建canvas DOM元素
        var ctx = canvas.getContext("2d");
        var img = new Image;
        img.crossOrigin = 'Anonymous';
        img.src = url;
        img.onload = function () {
            console.log(img.height+","+img.width);
            canvas.height = img.height; //指定画板的高度,自定义
            canvas.width = img.width; //指定画板的宽度，自定义
            ctx.drawImage(img, 0, 0, img.width, img.height); //参数可自定义
            var dataURL = canvas.toDataURL("image/" + ext);
            callback.call(this, dataURL); //回掉函数获取Base64编码
            canvas = null;
        };
    }
    $("body").prepend("<button id='downloadH' style='z-index:999999999;position: absolute;'>开始下H图</button>");
    $("#downloadH").click(function(){
       var $area = $("#show_image_area");
       if(!$area){
         $area = $(".single-content");
       }
       if(!$area || $area.length<10){
         $area = $("#image-container");
       }
       debugger;
       var now = new Date().getTime();
       var start = prompt("从第几页开始下载？");
       $area.find("img").each(function(index){
          if(index<start){
              return true;
          }
          var imgurl = $(this).attr("src");
	      let link = document.createElement('a');
          link.download = now+"-"+index+".jpg"; 	//下载的资源重命名
          getUrlBase64(imgurl, 'jpg', function (base64Url) {
          link.href = base64Url;
          link.click();
              if(index%19==0){
                 alert("暂停一下，继续下载！")
              }
          });
    })
    });
})();