// ==UserScript==
// @name        fapforfun图片点击放大
// @namespace   https://github.com/syhyz1990/baiduyun
// @version     0.1.3
// @author      时代
// @description 自动替换小图链接为大图，可直接查看大图。
// @homepage    https://greasyfork.org/zh-CN/scripts
// @icon        https://fapforfun.net/wp-content/uploads/2018/07/icon2.png
// @match       https://fapforfun.net/archives/*
// @require     https://cdnjs.cloudflare.com/ajax/libs/viewerjs/1.9.0/viewer.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/localforage/1.9.0/localforage.js
// @grant       GM_xmlhttpRequest
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @encoding    utf-8
// @downloadURL https://update.greasyfork.org/scripts/421194/fapforfun%E5%9B%BE%E7%89%87%E7%82%B9%E5%87%BB%E6%94%BE%E5%A4%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/421194/fapforfun%E5%9B%BE%E7%89%87%E7%82%B9%E5%87%BB%E6%94%BE%E5%A4%A7.meta.js
// ==/UserScript==
/*  【API文档】
    图像浏览插件：https://github.com/fengyuanchen/viewerjs   
    离线存储大数据：https://github.com/localForage/localForage 中文文档：https://localforage.docschina.org/
    简单的油猴脚本编写教程 https://www.52pojie.cn/thread-614101-1-1.html
    最新Tampermonkey中文文档解析 https://blog.csdn.net/github_35631540/article/details/102638553
    GM_xmlhttpRequest中文文档说明 https://blog.csdn.net/github_35631540/article/details/102638553#GM_getResourceURL(name)
    官方文档说明 https://violentmonkey.github.io/api/gm/#gm_xmlhttprequest
    请求头文档说明 https://www.atool99.com/httptest.php
*/
(function () {
    'use strict';
    let imgsrc = new Array();
    let boloUrl = {};
    localforage.config({
        storeName: 'archives',
        description: '从数据库提取图片，减少页面图片请求',
    });

   //document.querySelector('a.no-lightbox img');
    var dom=document.getElementsByTagName('img');
    if (dom != null) {
        AddMeta('referrer', 'no-referrer');//解除多次请求图片限制
        AddStyle('https://cdnjs.cloudflare.com/ajax/libs/viewerjs/1.9.0/viewer.css');
       
        dom.forEach((item, index) => {
            //排除磁力链接地址
            if (item.parentNode.href.indexOf("magnet:?xt=urn:btih:") == -1) {
               //document.querySelector("a.no-lightbox");
                item.parentNode.href = 'javascript:';
                item.parentNode.removeAttribute("target"); //移除点击链接新标签打开
              
                item.id = 'sd_picture'; //设置标识ID
                item.referrerPolicy = 'no-referrer'; //解决防盗链导致图片显示异常
                var fileName = GetFileName(item.src);
                var bigUrl = item.src.replace("small", "big");
                localforage.getItem(fileName).then(function (value) {
                    boloUrl[fileName] = (window.URL || window.webkitURL).createObjectURL(value);
                    item.setAttribute("data-original", boloUrl[fileName]);
                    console.log('已有文件：', fileName);

                }).catch(function (err) {
                    console.log(err);
                    //异步请求图片实现懒加载
                    GetImg(bigUrl, function (res) {
                        SaveData(fileName, res);
                        boloUrl[fileName] = (window.URL || window.webkitURL).createObjectURL(res);
                        item.setAttribute("data-original", boloUrl[fileName]);
                        console.log('下载完成：', bigUrl,boloUrl[fileName]);
                    });
                });
            }
        });

    }
    var jsq = setInterval(function(){ 
        var lg=Object.getOwnPropertyNames(boloUrl).length;
        
        if (lg>=dom.length-1) {
            console.log(`选择的document有${dom.length}个   成功获取图片数量${lg}`);
            clearInterval(jsq);
            InitViewer();
        }
     }, 1000);


    function SaveData(key, value) {
        localforage.setItem(key, value).then(function (data) {
            //console.log(data);
        }).catch(function (err) {
            console.log(err);
        });
    }
    function InitViewer() {
        const viewer = new Viewer(document.body, {
            url: 'data-original',
            title: [0, function (image, imageData) {
                document.getElementById('viewerTitle0').style = 'color: #37fd58;font-size:24px;';
                return `${document.title} (${imageData.naturalWidth} × ${imageData.naturalHeight})`;
            }],
            interval: 3000, //自动播放间隔
            show: function () { // 动态加载图片后，更新实例
                viewer.update();
            },
            //关闭时销毁viewer
            hiden: function () {
                //viewer.destroy();
            }

        });
    }
    //添加mate标签
    function AddMeta(name, content) {
        var metas = document.createElement('meta');
        metas.name = name;
        metas.content = content;
        var dom = document.getElementsByTagName('head')[0]
        dom.appendChild(metas);
    }
    //css动态加载
    function AddStyle(url) {
        var link = document.createElement('link');
        link.rel = "stylesheet";
        link.type = "text/css";
        link.href = url;
        var head = document.getElementsByTagName("head")[0];
        head.appendChild(link);
    }
    //异步请求图片
    function GetImg(url, callback) {
        var request = {
            method: 'GET',
            url: url,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3100.0 Safari/537.36',
                'Etag': '',
                'If-None-Match': '',
                'If-Modified-Since': '',
                'Cache-Control': 'no-cache',
                'Content-Security-Policy': 'no-referrer',
            },
            timeout: 100000,
            responseType: 'blob',
            onerror: function (response) {
                console.log(response.status);
            },
            onload: function (res) {
                var rh = res.responseHeaders; //请求头信息
                //console.log(rh);
                callback(res.response);
            },
            ontimeout: function (response) {
                console.log('请求超时！', url);
            },
        };
        setTimeout(function () { GM_xmlhttpRequest(request); }, 500);
    }
    // 获取文件名
    function GetFileName(name) {
        var realname = name.substring(name.lastIndexOf("/") + 1, name.lastIndexOf("."));
        return realname;
    }
    //blob转base64 其它Blob、base64、ArrayBuffer相互转换：https://www.cnblogs.com/liumingwang/p/12069207.html
    function blobToBase64(blob, callback) {
        var reader = new FileReader();
        reader.onload = function (e) {
            callback(e.target.result);
        }
        reader.readAsDataURL(blob);
    }
})();