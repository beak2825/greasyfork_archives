// ==UserScript==
// @name         Lofter下载助手
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  一键下载Lofter原图，每张图片左下角有一个下载原图按钮
// @author       Robert-Stackflow
// @match        *://*.lofter.com/*
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://cdn.staticfile.org/jquery-cookie/1.4.1/jquery.cookie.min.js
// @grant        GM_info
// @grant        GM_download
// @grant        GM_openInTab
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/487679/Lofter%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/487679/Lofter%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
var $ = $ || window.$; //获得jquery的$标识符
const window_url = window.location.href;
const window_host = window.location.host;
(function() {
    'use strict';
    window.getOriginUrl=(img)=>{
        var url=img.attr("src");
        if(url==undefined)
            url=img.attr("imgsrc");
        return url.split("?imageView")[0];
    }
    window.getFileName=(url)=>{
        var list=url.split("/")
        return list[list.length-1]
    }
    window.downloadImage=(url)=>{
        const x = new XMLHttpRequest()
        x.open("GET", url, true)
        x.responseType = 'blob'
        x.onload=function(e) {
            const url = window.URL.createObjectURL(x.response)
            const a = document.createElement('a')
            a.href = url
            a.target = '_blank'
            a.download = getFileName(url)
            a.click()
            a.remove()
        }
        x.send()
    }
  if (window_url.indexOf("lofter.com") != -1) {
    $("div[title='其他'] > div > div:nth-of-type(2) > div > div > a:nth-of-type(1) > span").html("大图/小图切换")
    $("div[title='其他'] > div > div:nth-of-type(2) > div > div > a:nth-of-type(1)").attr("href","javascript:void(0)")
    $("div[title='其他'] > div > div:nth-of-type(2) > div > div > a:nth-of-type(1)").click(function() {
      $("div.imgc > a > img").each(function () {
        $(this).click();
      });
    });
    $("div[title='其他'] > div > div:nth-of-type(2) > div > div > a:nth-of-type(2) > span").html("下载所有图片")
    $("div[title='其他'] > div > div:nth-of-type(2) > div > div > a:nth-of-type(2)").attr("href","javascript:void(0)")
    $("div[title='其他'] > div > div:nth-of-type(2) > div > div > a:nth-of-type(2)").click(function() {
      var originUrls=[];
      $("div.imgc > a > img").each(function () {
        var originUrl=getOriginUrl($(this))
        if(originUrls.indexOf(originUrl)==-1){
          originUrls.push(originUrl);
        }
      });
      for(let item of originUrls) {
        downloadImage(item);
      }
    });
    $("body").append("<style>.pic-div,.pic{position: relative;}.hoverlyr,.lnk{display:none !important;}.download-button{backdrop-filter: saturate(180%) blur(20px);background:rgba(222, 222, 222, 0.3);border-radius: 50px;padding:7px;display: inline-block;position: absolute;bottom:12px;font-size: 12px;color:#fff;left:12px;}</style>")
    setInterval(function(){
        $("div.imgc > a > img").each(function () {
            $(this).attr("src",getOriginUrl($(this)));
        });
        $("div.pic > a > img").each(function () {
            $(this).attr("src",getOriginUrl($(this)));
        });
        $("#application div[role='button'] > img").each(function () {
            $(this).attr("src",getOriginUrl($(this)));
            $(this).attr("data-origin-src",getOriginUrl($(this)));
        });
        $("div.imgc").each(function() {
            var downloadButtonDom=$(this).find(".download-button");
            if(downloadButtonDom.length==0){
                var originUrl=getOriginUrl($(this).find("a > img"));
                var dom=$(`<a class="download-button" href="javascript:void(0)">下载原图</span>`);
                dom.click(function(){downloadImage(originUrl)});
                $(this).append(dom);
            }
        });
        $("div.pic").each(function() {
            var downloadButtonDom=$(this).find(".download-button");
            if(downloadButtonDom.length==0){
                var originUrl=getOriginUrl($(this).find("a > img"));
                var dom=$(`<a class="download-button" href="javascript:void(0)">下载原图</span>`);
                dom.click(function(){downloadImage(originUrl)});
                $(this).append(dom);
            }
        });
        $(".m-photo .photo:has(img)").each(function() {
            var existDom=$(this).find(".pic-div");
            var originUrl=getOriginUrl($(this).find("img"));
            if(existDom.length==0){
                var divDom=document.createElement("div");
                $(divDom).attr("class","pic-div");
                var aDom=document.createElement("a");
                $(this).find("img").attr("src",originUrl);
                $(aDom).append($(this).find("img"));
                $(aDom).attr("href",originUrl);
                $(divDom).append(aDom);
                var downloadButtonDom=$(`<a class="download-button" href="javascript:void(0)">下载原图</span>`);
                downloadButtonDom.click(function(){downloadImage(originUrl)});
                $(divDom).append(downloadButtonDom);
                $(this).append(divDom);
            }
        });
        $("#application div[role='button']:has(img)").each(function() {
            if($(this).children().length>2){
                $(this).find("img").each(function(imgDom){
                });
                var existDom=$(this).find(".pic-div");
                var originUrl=getOriginUrl($(this).find("img"));
                if(existDom.length==0){
                    var divDom=document.createElement("div");
                    $(divDom).attr("class","pic-div");
                    var aDom=document.createElement("a");
                    $(this).find("img").attr("src",originUrl);
                    $(aDom).append($(this).find("img"));
                    $(aDom).attr("href",originUrl);
                    $(divDom).append(aDom);
                    var downloadButtonDom=$(`<a class="download-button" href="javascript:void(0)">下载原图</span>`);
                    downloadButtonDom.click(function(){downloadImage(originUrl)});
                    $(divDom).append(downloadButtonDom);
                    $(this).children("p").after(divDom);
                }
            }else{
                existDom=$(this).find(".pic-div");
                originUrl=getOriginUrl($(this).find("img"));
                if(existDom.length==0){
                    divDom=document.createElement("div");
                    $(divDom).attr("class","pic-div");
                    aDom=document.createElement("a");
                    $(this).find("img").attr("src",originUrl);
                    $(aDom).append($(this).find("img"));
                    $(aDom).attr("href",originUrl);
                    $(divDom).append(aDom);
                    downloadButtonDom=$(`<a class="download-button" href="javascript:void(0)">下载原图</span>`);
                    downloadButtonDom.click(function(){downloadImage(originUrl)});
                    $(divDom).append(downloadButtonDom);
                    $(this).append(divDom);
                }
            }
        });
    },100);
  }
})();