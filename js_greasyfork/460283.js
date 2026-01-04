// ==UserScript==
// @name         JD Thief_Zip
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  适用于京东JD.com图片抓取与下载打包。在商品详情页输入Ctrl+Q，即可触发爬取下载。
// @author       Soul_Yin
// @match       *://item.jd.com/*
// @require      https://cdn.bootcdn.net/ajax/libs/jszip/3.10.0/jszip.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/460283/JD%20Thief_Zip.user.js
// @updateURL https://update.greasyfork.org/scripts/460283/JD%20Thief_Zip.meta.js
// ==/UserScript==


(function () {
    'use strict';

    // Your code here...
    // jszip打包下载图片
    function saveImgZip(imgUrlArrs) {
        var imgUrlArr = []; // 图片列表
        imgUrlArr = imgUrlArrs
        var imgBase64 = {};//存放转成base64的图片，采用键值对形式就行存储，不采用数组。因为数组在异步中会导致存取数据的无序，数据混乱
        var imgNameArr = [];  // 图片名称
        var imageSuffix = []; // 图片后缀
        for (var i = 0; i < imgUrlArrs.length; i++) {
            // 图片后缀
            var suffix = imgUrlArrs[i].substring(imgUrlArrs[i].lastIndexOf("."));
            imageSuffix.push(suffix);
            //获取文件的名称
            var startIndex = imgUrlArrs[i].lastIndexOf("/");
            var endIndex = imgUrlArrs[i].lastIndexOf(".");
            var fileName = imgUrlArrs[i].substring(startIndex + 1, endIndex);
            imgNameArr.push(fileName);
        }
        // 创建JSZip对象
        var zip = new JSZip();
        // 创建文件夹
        var img = zip.folder("images");
        // 读取图片返回base64
        for (var i = 0; i < imgUrlArr.length; i++) {
            getBase64(imgUrlArr[i], i).then(function (base64, index) {
                //imgBase64.push(base64.substring(22));  // 去掉base64的图片格式前缀
                imgBase64[index] = base64.substring(22);
            }, function (err) {
                console.log(err);
            });
        }
        function downloadZip() {
            setTimeout(function () {
                if (imgUrlArr.length == Object.keys(imgBase64).length) {
                    for (var i = 0; i < imgUrlArr.length; i++) {
                        img.file(imgNameArr[i] + imageSuffix[i], imgBase64[i], { base64: true });
                    }
                    zip.generateAsync({ type: "blob" }).then(function (content) {
                        saveAs(content, "JD_Thief打包下载.zip"); // zip包命名
                    });
                } else {
                    downloadZip();
                }
            }, 100);
        }

        downloadZip();
    }


    //图片转base64; 传入图片路径，返回base64
    function getBase64(img, index) {
        function getBase64Image(img, width, height) {
            var canvas = document.createElement("canvas");
            canvas.width = width ? width : img.width;
            canvas.height = height ? height : img.height;
            var ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            var dataURL = canvas.toDataURL();
            return dataURL;
        }

        var image = new Image();
        image.crossOrigin = 'Anonymous';
        image.src = img;
        /*
        * deferred对象是一个延迟对象，意思是函数延迟到某个点才开始执行，改变执行状态的方法有两个（成功：resolve和失败：reject），
        * 分别对应两种执行回调（成功回调函数：done和失败回调函数fail）
        * */
        var deferred = $.Deferred();
        if (img) {
            image.onload = function () {
                // 执行成功回调
                deferred.resolve(getBase64Image(image), index);
            }
            return deferred.promise();
        }
    }



    $(document).keyup(function (event) {

        if (event.ctrlKey && event.keyCode === 81) {    //KeyCode Q=81
            let ul = document.getElementsByClassName("lh")[0];
            let li = ul.getElementsByTagName("li");
            let li_list = new Array();
            //获取所有主图链接
            for (var x of li) {
                li_list.push(x.getElementsByTagName("img")[0].currentSrc);
            };
            
            //获取所有详情图
            let main_div_list = document.getElementsByClassName("detail-content clearfix")[0].getElementsByClassName("ssd-module-wrap")[0].getElementsByTagName("div");
            for (var i of main_div_list) {
                let raw = window.getComputedStyle(i).backgroundImage
                raw = raw.slice(5)
                raw = raw.substring(0, raw.length - 2)
                if (raw == '') {
                    continue
                }
                li_list.push(raw)
            }
            //获取所有详情图（京东页面数据获取有的时候会改变，写两个保证获取）
            let raw=document.getElementsByClassName("ssd-module-wrap")
            raw=raw[raw.length-1].getElementsByTagName("div")
            for (var m of raw) {
                let raw = window.getComputedStyle(m).backgroundImage
                raw = raw.slice(5)
                raw = raw.substring(0, raw.length - 2)
                if (raw == '') {
                    continue
                }
                li_list.push(raw)
            }




            //处理所有链接
            let final_list = new Array()
            for (let [name, url] of li_list.entries()) {

                let urll = url;
                if (urll.includes("avif")) {
                    urll = url.substring(0, url.length - 5)
                }
                if (urll.includes("/n5/s54x54_jfs/")) {
                    urll = urll.replace("/n5/s54x54_jfs/", "/n1/s450x450_jfs/")
                }
                if (urll.includes("/n5/jfs/")) {
                    urll = urll.replace("/n5/jfs/", "/n1/jfs/")
                }
                final_list.push(urll)
            }
            console.log(final_list)
            alert("下载请求已拉取，请耐心等待")
            //图片打包下载
            saveImgZip(final_list)

        }
    })

})();