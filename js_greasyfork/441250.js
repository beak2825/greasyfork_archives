// ==UserScript==
// @name         Test DownLoad
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  下载图片
// @author       You
// @match        https://www.baidu.com/*
// @original-license  AGPL License
// @license           AGPL License
// @grant        GM_setValue
// @grant        GM_getValue
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/441250/Test%20DownLoad.user.js
// @updateURL https://update.greasyfork.org/scripts/441250/Test%20DownLoad.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if(jQuery)
        var $Q = jQuery;
    let DownImageHelper = {

        parseURL(url) {
            let a = document.createElement('a');
            a.href = url;
            return {
                source: url,
                protocol: a.protocol.replace(':', ''),
                host: a.hostname,
                port: a.port,
                query: a.search,
                params: (function () {
                    var ret = {},
                        seg = a.search.replace(/^\?/, '').split('&'),
                        len = seg.length, i = 0, s;
                    for (; i < len; i++) {
                        if (!seg[i]) {
                            continue;
                        }
                        s = seg[i].split('=');
                        ret[s[0]] = s[1];
                    }
                    return ret;
                })(),
                file: (a.pathname.match(/([^/?#]+)$/i) || [, ''])[1],
                hash: a.hash.replace('#', ''),
                path: a.pathname.replace(/^([^/])/, '/$1'),
                relative: (a.href.match(/tps?:\/[^/]+(.+)/) || [, ''])[1],
                segments: a.pathname.replace(/^\//, '').split('/')
            };
        },

        getFileName(name) {
            return name.substring(0, name.lastIndexOf("."))
        },
        // 获取 .后缀名
        getExtension(name) {
            return name.substring(name.lastIndexOf("."))
        },
        // 只获取后缀名
        getExtension(name) {
            return name.substring(name.lastIndexOf(".") + 1)
        },
        download(src) {
            let fileInfo = this.parseURL(src);
            let fType = this.getExtension(fileInfo.file);
            if (this.isImageInChromeNotEdge(fType)) {//判断是否为chrome里的图片
                this.ImgtodataURL(src, fileInfo.file, fType);
            } else {
                this.downloadNormalFile(src, fileInfo.file);
            }
        },
        isImageInChromeNotEdge(fType) {
            let bool = false;
            if (window.navigator.userAgent.indexOf("Chrome") !== -1 && window.navigator.userAgent.indexOf("Edge") === -1)
                (fType === "jpg" || fType === "gif" || fType === "png" || fType === "bmp" || fType === "jpeg" || fType === "svg") && (bool = true);
            return bool;
        },
        downloadNormalFile(src, filename) {
            var link = document.createElement('a');
            link.setAttribute("download", filename);
            link.href = src;
            document.body.appendChild(link);//添加到页面中，为兼容Firefox浏览器
            link.click();
            document.body.removeChild(link);//从页面移除
        },
        ImgtodataURL(url, filename, fileType) {
            this.getBase64(url, fileType, (_baseUrl) => {
                // 创建隐藏的可下载链接
                var eleLink = document.createElement('a');
                eleLink.download = filename;
                eleLink.style.display = 'none';
                // 图片转base64地址
                eleLink.href = _baseUrl;
                // 触发点击
                document.body.appendChild(eleLink);
                eleLink.click();
                // 然后移除
                document.body.removeChild(eleLink);
            });

        },
        getBase64(url, fileType, callback) {
            //通过构造函数来创建的 img 实例，在赋予 src 值后就会立刻下载图片
            var Img = new Image(),
                dataURL = '';
            Img.src = url;
            Img.setAttribute("crossOrigin", 'Anonymous');
            Img.onload = function () { //要先确保图片完整获取到，这是个异步事件
                var canvas = document.createElement("canvas"), //创建canvas元素
                    width = Img.width, //确保canvas的尺寸和图片一样
                    height = Img.height;
                canvas.width = width;
                canvas.height = height;
                canvas.getContext("2d").drawImage(Img, 0, 0, width, height); //将图片绘制到canvas中
                dataURL = canvas.toDataURL('image/' + fileType); //转换图片为dataURL
                callback ? callback(dataURL) : null;
            };
        }
    }
    let html = "<button id=\"download110\">下载</button>";
    $Q("body").prepend(html);
    $Q("#download110").on("click",function(){
        let logoImg =  $("#head").find("img.index-logo-src").attr("src");
        //window.location=logoImg;
        DownImageHelper.download(logoImg);
    })
    /*
     // 创建按钮 START
    let btn = document.createElement('a');
    btn.id = btnDownload.id;
    btn.title = btnDownload.title;
    btn.innerHTML = btnDownload.html(pageType);
    btn.style.cssText = btnDownload.style(pageType);
    btn.className = btnDownload.class(pageType);
    btn.addEventListener('click', function (e) {

    });

    // 添加按钮 START
    let parent = null;
    if (pageType === 'old') {
        let btnUpload = document.querySelector('[node-type=upload]'); // 管理页面：【上传】
        parent = btnUpload.parentNode;
        parent.insertBefore(btn, parent.childNodes[0]);
    }
    */
    
})();