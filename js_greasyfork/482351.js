// ==UserScript==
// @name         豆瓣音乐人歌曲下载
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  舍弃了自动下载，修改为了手动下载。pc\手持端均可使用
// @author       zephyrus
// @match        *://music.douban.com/*
// @match        *://site.douban.com/*
// @match        *://artist.douban.com/m/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=douban.com
// @grant        none
// @match        *://*.douban.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/482351/%E8%B1%86%E7%93%A3%E9%9F%B3%E4%B9%90%E4%BA%BA%E6%AD%8C%E6%9B%B2%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/482351/%E8%B1%86%E7%93%A3%E9%9F%B3%E4%B9%90%E4%BA%BA%E6%AD%8C%E6%9B%B2%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 输出调试信息
    console.log('脚本被执行了，你可以放心了！');

    // 获取原始路径部分
    var path = window.location.pathname;

    // 判断是否包含 '/m/'
    if (path.includes('/m/')) {
        // 移除路径中的 '/m'
        path = path.replace('/m', '');

        // 重定向到指定网址
        window.location.href = 'https://site.douban.com' + path;
    }

    // 在 Audio 元素加载完成时显示下载链接
    function displayDownloadLink(url) {
        console.log('[Audio Monitor] Audio loaded:', url);

        // 如果 URL 是 MP3 文件，则创建下载链接
        if (url.endsWith('.mp3')) {
            createDownloadLink(url);
        }
    }

    // 创建下载链接的函数
    function createDownloadLink(url) {
        // 创建包含下载链接的容器
        var linkContainer = document.createElement('button');
        linkContainer.style.cssText = 'position: fixed; top: 43px; left: 10px; z-index: 9999; font-size: 13px;';
        linkContainer.className = 'pure-button btn-playlist';

        // 创建下载链接
        var downloadLink = document.createElement('a');

        // 将文件内容转成 Data URI，并设置为 href
        fetch(url)
          .then(response => response.blob())
          .then(blob => {
              var reader = new FileReader();
              reader.onload = function() {
                  downloadLink.href = reader.result;
              };
              reader.readAsDataURL(blob);
          });

        // 获取 URL 的最后一段字符作为文件名
        var fileName = url.split('/').pop();
        downloadLink.download = fileName;

        // 设置下载链接的样式和文本内容
        downloadLink.style.cssText = 'color: #53cbaa; text-decoration: none; font-weight: bold; cursor: pointer;';
        downloadLink.textContent = '下载当前歌曲';

        // 将下载链接添加到容器中
        linkContainer.appendChild(downloadLink);

        // 将容器添加到文档的 body 中
        document.body.appendChild(linkContainer);
    }

    // 重写 Audio 构造函数，添加 canplaythrough 事件监听器
    var nativeAudio = Audio;
    Audio = function(src) {
        var audio = new nativeAudio(src);

        // 在 canplaythrough 事件触发时显示下载链接
        audio.addEventListener('canplaythrough', function() {
            displayDownloadLink(audio.src);
            console.log(audio.src);
        });

        return audio;
    };
})();
