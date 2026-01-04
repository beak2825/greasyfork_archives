// ==UserScript==
// @name         优丝库HD（YSKHD）-白嫖VIP
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  解密原图链接和只能在线看4张图的限制，新增打包下载（缓存完成后再下载，点击“下载套图”后稍微会感觉比较慢）
// @author       huqiu2
// @license      MPL-2.0
// @match        https://yskhd.com/archives/*
// @match        https://yskhd.me/archives/*
// @grant        none
// @require      https://cdn.bootcdn.net/ajax/libs/jszip/3.10.1/jszip.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/jszip-utils/0.1.0/jszip-utils.min.js
// @require      https://cdn.bootcdn.net/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js
// @namespace    https://greasyfork.org/zh-CN/scripts/481007
// @downloadURL https://update.greasyfork.org/scripts/481007/%E4%BC%98%E4%B8%9D%E5%BA%93HD%EF%BC%88YSKHD%EF%BC%89-%E7%99%BD%E5%AB%96VIP.user.js
// @updateURL https://update.greasyfork.org/scripts/481007/%E4%BC%98%E4%B8%9D%E5%BA%93HD%EF%BC%88YSKHD%EF%BC%89-%E7%99%BD%E5%AB%96VIP.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义正则表达式
    const regex = /<div class="gallery-item gallery-blur-item"><span class="img"><img loading="lazy" decoding="async" width="285" height="285" src="(.+?)" class="attachment-thumbnail size-thumbnail" alt=""><\/span><\/div>/g;

    // 获取页面内容
    var pageContent = document.body.innerHTML;

    // 使用正则表达式进行替换
    var replacedContent = pageContent.replace(regex, '<div class="gallery-item gallery-fancy-item"><a href="$1" data-fancybox="gallery-2"><img loading="lazy" decoding="async" width="285" height="285" src="$1" class="attachment-thumbnail size-thumbnail" alt></a></div>');

    // 更新页面内容
    document.body.innerHTML = replacedContent;

    // 删除所有的 "-scaled" 和 "-285x285"，并更新 href
    var fancyItems = document.querySelectorAll('.gallery-fancy-item a');
    fancyItems.forEach(function(item) {
        var originalHref = item.getAttribute('href');
        var newHref = originalHref.replace(/-scaled/g, '').replace(/-285x285/g, '');
        item.setAttribute('href', newHref);
    });

    // 获取页面的 title
    var pageTitle = document.title;

    // 创建一个用于存储图片的数组
    var imageUrls = [];

    // 查询所有的图片链接
    var galleryItems = document.querySelectorAll('.gallery-fancy-item a');
    galleryItems.forEach(function(item) {
        imageUrls.push(item.getAttribute('href'));
    });

    // 创建一个按钮来触发下载
    var downloadButton = document.createElement('button');
    downloadButton.innerHTML = '下载套图';
    downloadButton.style.border = "1px solid #64c878";
    downloadButton.style.boxShadow = "0 1px 2px #8fcaee inset,0 -1px 0 #497897 inset,0 -2px 3px #8fcaee inset";
    downloadButton.style.background = "-webkit-linear-gradient(top,#42a4e0,#2e88c0)";
    downloadButton.style.background = "-moz-linear-gradient(top,#42a4e0,#2e88c0)";
    downloadButton.style.background = "linear-gradient(top,#42a4e0,#2e88c0)";
    downloadButton.style.width = "140px";
    downloadButton.style.lineHeight = "38px";
    downloadButton.style.textAlign = "center";
    downloadButton.style.fontWeight = "bold";
    downloadButton.style.color = "#fff";
    downloadButton.style.textShadow = "1px 1px 1px #333";
    downloadButton.style.borderRadius = "5px";
    downloadButton.style.margin = "0 20px 20px 0";
    downloadButton.style.position = "relative";
    downloadButton.style.overflow = "hidden";
    downloadButton.addEventListener('click', async function() {
        // 创建一个 zip 文件
        var zip = new JSZip();

        // 使用 Promise.all 来确保所有图片都被下载
        var promises = imageUrls.map(async function(url, index) {
            var filename = 'image' + index + '.jpg';
            var data = await new Promise(function(resolve, reject) {
                JSZipUtils.getBinaryContent(url, function (err, data) {
                    if (err) {
                        console.error(err);
                        reject(err);
                    } else {
                        resolve({data, filename});
                    }
                });
            });
            zip.file(data.filename, data.data, {binary: true});
        });

        // 等待所有图片都下载完成后再生成和下载 zip 文件
        await Promise.all(promises);
        var content = await zip.generateAsync({type: "blob"});
        saveAs(content, pageTitle + ".zip");
    });

    // 添加鼠标悬停时的样式
    downloadButton.addEventListener('mouseover', function() {
        downloadButton.style.background = "-webkit-linear-gradient(top,#70bfef,#4097ce)";
        downloadButton.style.background = "-moz-linear-gradient(top,#70bfef,#4097ce)";
        downloadButton.style.background = "linear-gradient(top,#70bfef,#4097ce)";
    });

    downloadButton.addEventListener('mouseout', function() {
        downloadButton.style.background = "-webkit-linear-gradient(top,#42a4e0,#2e88c0)";
        downloadButton.style.background = "-moz-linear-gradient(top,#42a4e0,#2e88c0)";
        downloadButton.style.background = "linear-gradient(top,#42a4e0,#2e88c0)";
    });

    // 替换原有内容
    var galleryLogin = document.querySelector('.gallery-login');
    galleryLogin.innerHTML = '';
    galleryLogin.appendChild(downloadButton);
})();