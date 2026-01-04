// ==UserScript==
// @name         gelbooru去广告
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  删除大多数广告，经过测试就一个弹窗广告删不掉，不过不影响使用
// @author       mianfa
// @match        https://gelbooru.com/index.php?page=post&s=list&tags=*
// @match        https://gelbooru.com/index.php?page=post&s=view&id=*
// @icon         https://gelbooru.com/favicon.png
// @grant        none
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/479811/gelbooru%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/479811/gelbooru%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 检查DOM是否已准备好
    function checkDOM() {
        if (document.body) {
            // 执行操作，例如隐藏具有类名为"headerAd"的元素
            var elements = document.getElementsByClassName("headerAd");
            for (var i = 0; i < elements.length; i++) {
                elements[i].style.display = "none";
            }
        } else {
            // 如果DOM还未准备好，则等待一段时间后重新检查
            setTimeout(checkDOM, 100);
        }
    }

    // 开始检查DOM
    checkDOM();

    // 创建MutationObserver实例
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
             // 检查DOM是否已准备好
            if (document.body) {
                // 执行操作，例如隐藏具有类名为"headerAd"的元素
                var elementh = document.getElementsByClassName("headerAd");
                for (var h = 0; h < elementh.length; h++) {
                    elementh[h].style.display = "none";
                }
                // 执行操作，例如隐藏具有类名为"footerAd"的元素
                var elementf = document.getElementsByClassName("footerAd");
                for (var f = 0; f < elementf.length; f++) {
                    elementf[f].style.display = "none";
                }
                // 执行操作，例如隐藏main.div下的第一个div
                var mainDiv = document.querySelector(".mainBodyPadding");
                if (mainDiv) {
                    var firstChild = mainDiv.firstElementChild;
                    if (firstChild) {
                        firstChild.style.display = "none";
                    }
                    var lastChild = mainDiv.lastElementChild;
                    if (lastChild) {
                        lastChild.style.display = "none";
                    }
                }
                // 停止观察变化，因为我们已经完成了我们的任务
                observer.disconnect();
            }
            // 检查DOM是否已准备好
            if (document.body) {
                // 获取所有图片元素
                var images = document.querySelectorAll('img');

                // 遍历图片元素
                images.forEach(function(image) {
                    // 检查图片链接是否匹配目标链接
                    if (image.src === 'https://gelbooru.com/extras/store/728/72890-4.jpg') {
                        // 隐藏匹配的图片
                        image.style.display = 'none';
                    }
                });

                // 停止观察变化，因为我们已经完成了我们的任务
                observer.disconnect();
            }
                        if (document.body) {
                // 获取所有超链接元素
                var links = document.querySelectorAll('a');

                // 遍历超链接元素
                links.forEach(function(link) {
                    // 检查超链接的href属性是否匹配目标链接
                    if (link.href === 'https://www.soulgen.net/landing/real-page?utm_source=link-gbr&cp_id=banner') {
                        // 隐藏匹配的超链接
                        link.style.display = 'none';
                    }
                });

                // 停止观察变化，因为我们已经完成了我们的任务
                observer.disconnect();
            }
        });
    });

    // 配置观察器以监视DOM树的变化
    var config = { childList: true, subtree: true };
    observer.observe(document.documentElement, config);
})();