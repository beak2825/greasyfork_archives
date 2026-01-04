// ==UserScript==
// @name         JIRA Image Repalce With Link
// @namespace    http://tampermonkey.net/
// @version      0.0.4
// @description  将所有jira中的不能预览的图片替换成可以点击预览的图片
// @author       梅有人
// @match        http://jira.nhsoft.cn:8080/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nhsoft.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/474722/JIRA%20Image%20Repalce%20With%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/474722/JIRA%20Image%20Repalce%20With%20Link.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getSecureAttachmentImages() {
        var images = document.getElementsByTagName('img');
        var secureAttachmentImages = [];

        for (var i = 0; i < images.length; i++) {
            if (images[i].src.includes('/secure/attachment')) {
                secureAttachmentImages.push(images[i]);
            }
        }

        return secureAttachmentImages;
    }

    function replaceImagesWithLinks() {
        var images = getSecureAttachmentImages();

        for (var i = 0; i < images.length; i++) {
            var img = images[i];
            var parent = img.parentNode;
            var link = document.createElement('a');
            if(parent.tagName === 'A') continue;

            var strArray = img.src.split('/');
            var originTitle = strArray[strArray.length-1];
            var num = originTitle.split('_')[0];
            var title = originTitle.split('_')[1];
            link.href = img.src;
            link.id = num + '_thumb';
            link.title = title;
            link.setAttribute('file-preview-type', 'image');
            link.setAttribute('file-preview-id', num);
            link.setAttribute('file-preview-title', title);
            link.appendChild(img.cloneNode(true));
            parent.replaceChild(link, img);
        }
    }

    window.onload = function() {
        var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver

        const options = {
            characterData: true,
            attributes: true,
            childList: true,
            subtree: true
        }

        setTimeout(() => {
            console.log('页面加载后2秒钟我执行了');
            replaceImagesWithLinks();
            const container = document.querySelector('.issue-container');
            const mutation = new MutationObserver(function(mutationRecoards, observer) {
                setTimeout(() => {
                    console.log('问题区域发生变更后2秒钟我执行了')
                    replaceImagesWithLinks();
                }, 2000)
            })
            mutation.observe(container, options);
        }, 2000)
    }

})();