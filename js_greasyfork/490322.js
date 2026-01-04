// ==UserScript==
// @name         哔哩哔哩封面下载
// @namespace    https://greasyfork.org/zh-CN/users/1276860-nangua-pie
// @version      v1.0.1
// @description  在详情页面添加下载封面按钮，支持视频封面、专栏封面、番剧封面
// @author       Syed
// @license      GPL-3.0 License
// @match        https://www.bilibili.com/video*
// @match        https://www.bilibili.com/read*
// @match        https://www.bilibili.com/bangumi*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/490322/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E5%B0%81%E9%9D%A2%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/490322/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E5%B0%81%E9%9D%A2%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var dlBtn = document.createElement("button");
    dlBtn.innerHTML = "下载封面";
    dlBtn.className = "download-cover-button";

    dlBtn.style.position = 'fixed';
    dlBtn.style.zIndex = '9999';
    dlBtn.style.width = '100px';
    dlBtn.style.height = '30px';
    dlBtn.style.top = '100px';
    dlBtn.style.border = '1px solid #007bff';
    dlBtn.style.borderRadius = '5px';
    dlBtn.style.color = '#007bff';
    // 鼠标进入按钮时改变背景颜色
    dlBtn.addEventListener('mouseenter', () => {
        dlBtn.style.backgroundColor = '#C4DEF8';
    });

    // 鼠标离开按钮时恢复初始背景颜色
    dlBtn.addEventListener('mouseleave', () => {
        dlBtn.style.backgroundColor = '#ffffff';
    });

    dlBtn.addEventListener('click',() => {downLoadImg();});
    document.body.appendChild(dlBtn);
})();

const downLoadImg = () => {
    var imgUrl = getImgUrl();
    //console.log(imgUrl);
    fetchImageAsBlob(imgUrl, (blob) => {
        var link = document.createElement('a');
        //console.log(blob);
        link.href = URL.createObjectURL(blob);
        link.download = imgUrl.split('/').pop();
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
}

const getUrlType = () => {
    return window.location.href.split('/')[3];
}

const getImgUrl = () => {
    const content = getMetaContentByProperty('og:image');
    //console.log(content);
    var imgUrl = content.split('@')[0];
    if (getUrlType() === 'video')
    {
        imgUrl = "https:" + imgUrl;
    }
    return imgUrl;
}

const getMetaContentByProperty = (property) => {
    const metaTags = document.getElementsByTagName('meta');

    for (let i = 0; i < metaTags.length; i++) {
        const metaTag = metaTags[i];
        if (metaTag.getAttribute('property') === property) {
            return metaTag.getAttribute('content');
        }
    }
    return null;
}

function fetchImageAsBlob(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.responseType = "blob";
    xhr.onload = function () {
        if (xhr.status === 200) {
            callback(xhr.response);
        }
    };
    xhr.send();
}
/*
function getBrowserType() {
    var userAgent = navigator.userAgent;
    var browserType = "Unknown";

    if (userAgent.indexOf("Opera") || userAgent.indexOf("OPR/")) {
        browserType = "Opera";
    } else if (userAgent.indexOf("Edge") > -1) {
        browserType = "Edge";
    } else if (userAgent.indexOf("Chrome") > -1 && !userAgent.match("OPR/")) {
        browserType = "Chrome";
    } else if (userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") == -1) {
        browserType = "Safari";
    } else if (userAgent.indexOf("Firefox") > -1) {
        browserType = "Firefox";
    } else if (userAgent.indexOf("MSIE") > -1 || userAgent.indexOf("Trident") > -1) {
        browserType = "IE";
    }

    return browserType;
}
*/