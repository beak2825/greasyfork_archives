// ==UserScript==
// @name         PDD一键下载
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  抓图
// @author       You
// @include        https://*.yangkeduo.com/*
// @include        https://yangkeduo.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @grant        GM_download
// @require      https://code.jquery.com/jquery-3.6.1.js
// @require      https://cdn.bootcdn.net/ajax/libs/jszip/3.10.0/jszip.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/451686/PDD%E4%B8%80%E9%94%AE%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/451686/PDD%E4%B8%80%E9%94%AE%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';


    $("#main").prepend('<span id="loading">正在解析...<span>')
    setTimeout(()=>{
        let imgs = [];
        $("[class*='goods-container'] > div:nth-child(1)").find("img").each( (index,item)=>{
            const img_src = $(item).attr('src') ?  $(item).attr('src') : $(item).attr('data-src');
            imgs.push(img_src.split('?')[0]);
        })

        let detail_index = -1;
        let children = $("[class*='goods-container'] > div:nth-child(2)").children();
        Array.from(children).forEach((item,index)=>{
            if (item.innerText.indexOf('商品详情')>-1){
                detail_index = index + 2;
            }
        })

        let detail_imgs = [];

        $("[class*='goods-container'] > div:nth-child(2) > div:nth-child("+detail_index+")").find('img').each((index,item)=>{
            const img_src = $(item).attr('src') ?  $(item).attr('src') : $(item).attr('data-src');
            detail_imgs.push(img_src);
        })



        $("#loading").html(`${imgs.length}张主图，${detail_imgs.length}张详情图`)
        $("#main").append("<button id='download_img'  style='position:fixed;top:20px;padding: 5px;border: 1px solid #000;'>下载主图</button>")
        $("#main").append("<button id='download_detail'  style='position:fixed;top:55px;padding: 5px;border: 1px solid #000;''>下载详情</button>")
        if( $("[class*='goods-container'] > div:nth-child(1)").find("video").length>0 )
            $("#main").append("<button id='download_video'  style='position:absolute;right:0;top:20px'>下载视频</button>")

        $("#download_img").on('click',function(){
            imgs.forEach( (item,index)=>{
                GM_download({
                    url: item,
                    name: `主图${index}.jpg`,
                    saveAs: false,
                })
            })
        /*
            let promises = [];
            imgs.forEach( (item,index)=>{
                let base64 = getBase64(item,index);
                promises.push(base64);

            })
           let result = Promise.all(promises).then((r) => {


           })
       */




        })
        $("#download_video").on('click',function(){
            let video_url = $("[class*='goods-container'] > div:nth-child(1)").find("video").attr('src');
                  GM_download({
                      url: video_url,
                      name: "img1.mp4",
                      saveAs: false,
                  })
        })

        $("#download_detail").on('click',function(){
            detail_imgs.forEach( (item,index)=>{
                GM_download({
                    url: item,
                    name: `详情${index}.jpg`,
                    saveAs: false,
                    onload: () => {

                    }
                })
            })

       })

    },2000)


    function getBase64(imgUrl,index) {
        return new Promise((resolve) => {
            const image = new Image();
            image.crossOrigin = ""; // 解决跨域问题
            image.src = imgUrl;
            image.onload = function () {
                let canvas = document.createElement("canvas");
                canvas.width = image.width;
                canvas.height = image.height;
                let context = canvas.getContext("2d");
                context.drawImage(image, 0, 0, image.width, image.height);

                const base64 = canvas.toDataURL("image/png", 1).split(",")[1];
                img.file(`image${index}.jpg`, base64, {base64: true});
                resolve(base64);
            };
        });
    }

})();