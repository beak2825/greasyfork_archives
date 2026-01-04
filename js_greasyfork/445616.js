// ==UserScript==
// @name         微商相册快速下载图片并裁剪
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  微商相册一键打包下载图片
// @author       You
// @license MIT
// @match       https://www.szwego.com/static/*
// @grant        none
// @require      https://cdn.bootcdn.net/ajax/libs/jszip/3.6.0/jszip.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @downloadURL https://update.greasyfork.org/scripts/445616/%E5%BE%AE%E5%95%86%E7%9B%B8%E5%86%8C%E5%BF%AB%E9%80%9F%E4%B8%8B%E8%BD%BD%E5%9B%BE%E7%89%87%E5%B9%B6%E8%A3%81%E5%89%AA.user.js
// @updateURL https://update.greasyfork.org/scripts/445616/%E5%BE%AE%E5%95%86%E7%9B%B8%E5%86%8C%E5%BF%AB%E9%80%9F%E4%B8%8B%E8%BD%BD%E5%9B%BE%E7%89%87%E5%B9%B6%E8%A3%81%E5%89%AA.meta.js
// ==/UserScript==

(function() {
    'use strict';
     function urlToBase64(url) {
         return new Promise((resolve) => {
             let canvas = document.createElement('canvas')
             let ctx = canvas.getContext('2d')
             let img = new Image()
             img.crossOrigin = 'Anonymous';
             img.onload = function () {
                 canvas.height = img.height;
                 canvas.width = img.width;
                 ctx?.drawImage(img, 0, 0);
                 // 获取Base64
                 var dataURL = canvas.toBlob(resolve)
                 canvas = null
                 // console.log('base64地址：', dataURL)
                 //resolve(dataURL)
             };
             img.src = url;
         })
  }

    function getImgs () {
        console.log('123')
        // Your code here...
        var imgs = document.querySelectorAll('.w-1-3 img')
        console.log(imgs)
        let zip = new JSZip();
        let title = parseInt(Math.random()*10000000)
        let folder = zip.folder(title)
        for (let i = 0;  i < imgs.length; i++) {
            downloadIamge(imgs[i].src.split('?')[0]+'?imageMogr2/auto-orient/thumbnail/!700x700r/quality/100/format/jpg', i+1).then(([url1, url2]) => {
                 folder.file(i+'.jpg', url1.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""), {base64: true});
                 folder.file('z'+i+'_1:1'+ '.jpg', url2.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""), {base64: true});
            })
        }
        setTimeout(() => {
            if(Object.getOwnPropertyNames(folder.files).length === imgs.length*2+1) {
                zip.generateAsync({type:"blob"})
                    .then(function(content) {
                    // see FileSaver.js
                    saveAs(content, title + ".zip");
                });
            }
        }, 5000)

    }
    function downloadIamge(src, name) {
        return new Promise((res, rej) => {
            var image = new Image()
            // 解决跨域 Canvas 污染问题
            // crossorigin 是HTML5中新增的<img>标签属性
            //　crossorigin属性有两个值可选：
            //anonymous:如果使用这个值的话就会在请求中的header中的带上origin属性，但请求不会带上cookie和其他的一些认证信息。
            //use-credentials:这个同时会在跨域请求中带上cookie和其他的一些认证信息。在使用这两个值时都需要server端在response的header中带上Access-Control-Allow-Credentials属性。可以通过server的配置文件来开启这个属性：server开启Access-Control-Allow-Credentials
            image.setAttribute('crossOrigin', 'anonymous')
            image.onload = function () {
                var canvas = document.createElement('canvas')
                canvas.width = image.width
                canvas.height = image.height
                var context = canvas.getContext('2d')
                console.log(image.width, image.height)
                context.drawImage(image, 0, 0, image.width, image.height)
                var url = canvas.toDataURL('image/png')
                // 生成一个a元素
                //ar a = document.createElement('a')
                // 创建一个单击事件
                //ar event = new MouseEvent('click')

                // 将a的download属性设置为我们想要下载的图片名称，若name不存在则使用‘下载图片名称’作为默认名称
                //a.download = name || '下载图片名称'
                // 将生成的URL设置为a.href属性
               // a.href = url

                // 触发a的单击事件
                //a.dispatchEvent(event);
                canvas.width = image.width
                canvas.height = image.width
                let y = (image.height-image.width)/2
                context.drawImage(image, 0, y, image.width, image.height,0, 0, image.width, image.height)
                var newUrl = canvas.toDataURL('image/png')
                // 生成一个a元素
               // var newA = document.createElement('a')
                // 创建一个单击事件
                //ar newEvent = new MouseEvent('click')

                // 将a的download属性设置为我们想要下载的图片名称，若name不存在则使用‘下载图片名称’作为默认名称
               // newA.download = name+'_1:1' || '下载图片名称'
                // 将生成的URL设置为a.href属性
                //newA.href = newUrl

                // 触发a的单击事件
               // newA.dispatchEvent(newEvent);
                res ([url, newUrl])
            }
            image.src = src

        })
    }

    // 拼图
    function puzzleImg () {
        var imgs = document.querySelectorAll('.w-1-3 img')
        Promise.all([...imgs].map(loadImg)).then((imgs)=> {
              let imgsLength = imgs.length
              let sqrtNum = Math.floor(Math.sqrt(imgsLength))
              var width = imgs[0].width
              let dy = (imgs[0].height-imgs[0].width)/2
              var canvas = document.createElement('canvas')
              canvas.width = sqrtNum * width
             canvas.height = sqrtNum * width
             var context = canvas.getContext('2d')
             for (let i = 0; i < sqrtNum*sqrtNum; i++) {
                 //loadImg(imgs[i].src).then()
                 context.drawImage(imgs[i], 0, dy, imgs[i].width, imgs[i].height,(i%sqrtNum)*width, Math.floor(i/sqrtNum)*width , imgs[i].width, imgs[i].height)
             }
             var newUrl = canvas.toDataURL('image/png')
             saveAs(newUrl, '1.png')
         })


    }

    function loadImg (img) {
        return new Promise ((res)=> {
            var image = new Image()
            // 解决跨域 Canvas 污染问题
            // crossorigin 是HTML5中新增的<img>标签属性
            //　crossorigin属性有两个值可选：
            //anonymous:如果使用这个值的话就会在请求中的header中的带上origin属性，但请求不会带上cookie和其他的一些认证信息。
            //use-credentials:这个同时会在跨域请求中带上cookie和其他的一些认证信息。在使用这两个值时都需要server端在response的header中带上Access-Control-Allow-Credentials属性。可以通过server的配置文件来开启这个属性：server开启Access-Control-Allow-Credentials
            image.setAttribute('crossOrigin', 'anonymous')
            image.onload = function () {
              res(image)
            }
            image.src = img.src
        })
    }



    var button = document.createElement('button')
    button.innerText = '下载图片'
    document.body.prepend(button)

    button.onclick = getImgs

    var puzulleButton = document.createElement('button')
    puzulleButton.innerText = '一键拼图'
    document.body.prepend(puzulleButton)

    puzulleButton.onclick = puzzleImg

})();