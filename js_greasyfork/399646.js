// ==UserScript==
// @name         图虫网社区图片下载
// @namespace    https://greasyfork.org/zh-CN/users/475811-criticj
// @version      0.2
// @author       CriticJ
// @description  仅适用于社区内的图片下载
// @match        *://*.tuchong.com/*
// @match        *://tuchong.com/*
// @grant        GM_setClipboard
// @grant        GM_xmlhttpRequest
// @grant        GM_info
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_notification
// @grant        GM_listValues
// @grant        GM_openInTab
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @grant        GM_getResourceURL
// @grant        GM_unregisterMenuCommand
// @grant        GM_download
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/399646/%E5%9B%BE%E8%99%AB%E7%BD%91%E7%A4%BE%E5%8C%BA%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/399646/%E5%9B%BE%E8%99%AB%E7%BD%91%E7%A4%BE%E5%8C%BA%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==


(function () {
    'use strict';
    var currentUrl = window.location.href;
    var currentHost = window.location.host;

    // 图虫网无水印下载
    downloadTuChong(currentUrl, currentHost);

})();

// 图虫网无水印下载
function downloadTuChong(currentUrl, currentHost) {
    if (currentUrl.indexOf('tuchong.com') > 0) {
        var retry = 0;
        var maxRetryTimes = 3;
        var timer;
        timer = setInterval(function () {
            if (retry < maxRetryTimes) {
                var imgsContainer = $('.scene-container-next');
                if (imgsContainer.length > 0) {
                    getOneImages(imgsContainer);
                    getAllImages(imgsContainer);
                    clearInterval(timer);
                }
                retry++;
            } else {
                clearInterval(timer);
            }
        }, 1000)

        // 下载单页按钮
        function createdownloadBtn(imgHref, imgName) {
            $('.icon-download').before('<span id="diy-downloadOneImg" style="border-radius: 4px 8px;color:#fff;background:#4CAF50;padding:10px;cursor:pointer">单页下载</span>');
            $('#diy-downloadOneImg').on('click', function () {
                GM_download(imgHref, imgName)
            })
        }

        // 下载套图按钮
        function createdownloadAllBtn(allImages) {
            $('.icon-download').before('<span id="diy-downloadAllImg" style="border-radius: 4px 8px;margin-left:15px;color:#fff;background:#008CBA;padding:10px;cursor:pointer">图集下载</span>');
            $('#diy-downloadAllImg').on('click', function () {
                for (var i = 0; i < allImages.length; i++) {
                    var imgNames = $('.aside-post-title').text() + (i + 1);
                    GM_download(allImages[i], imgNames)
                }
            })
        }

        // 获取单页地址
        function getOneImages(container) {
            var imgHref = container.find('.scene-item').not('.prev-scene').not('.next-scene').find('img').attr('src');
            var imgName = $('.aside-post-title').text() + imgHref.split('/f/')[1];
            var re = /http/;
            if (!re.test(imgHref)) {
                imgHref = 'http:' + imgHref
            }
            createdownloadBtn(imgHref, imgName);
        }

        // 获取套图地址
        function getAllImages(container) {
            var imgHrefs = container.find('.scene-item');
            var allImages = [];
            for (var i = 0; i < imgHrefs.length; i++) {
                var curHref = $(imgHrefs[i]).find('img').attr('src');
                var re = /http/;
                if (!re.test(curHref)) {
                    curHref = 'http:' + curHref
                }
                allImages.push(curHref)
            }
            createdownloadAllBtn(allImages);
        }
    }
}

