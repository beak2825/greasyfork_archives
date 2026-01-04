// ==UserScript==
// @name         魂+图片查看
// @namespace    http://himg.ezyro.com/lb/
// @version      2.6
// @description  魂+图片查看图片查看
// @author       ohao
// @license      ohao
// @match        https://bbs.imoutolove.me/read.php*
// @match        *://*.blue-plus.net/read.php*
// @match        *://*.summer-plus.net/read.php*
// @match        *://*.spring-plus.net/read.php*
// @match        *://*.soul-plus.net/read.php*
// @match        *://*.south-plus.net/read.php*
// @match        *://*.north-plus.net/read.php*
// @match        *://*.snow-plus.net/read.php*
// @match        *://*.level-plus.net/read.php*
// @match        *://*.www.level-plus.net/read.php*
// @match        *://*.white-plus.net/read.php*
// @match        *://*.south-plus.org/read.php*
// @match        *://*.east-plus.net/read.php*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/494469/%E9%AD%82%2B%E5%9B%BE%E7%89%87%E6%9F%A5%E7%9C%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/494469/%E9%AD%82%2B%E5%9B%BE%E7%89%87%E6%9F%A5%E7%9C%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var allImageUrls = [];

    // 查找所有图片链接
    var images = document.querySelectorAll('.tpc_content img[src]');
    if (images.length > 0) {
        // 遍历所有图片链接
        images.forEach(function(image, index) {
            var imageUrl = image.getAttribute('src');
            // 排除带有特定路径的链接
            if (!imageUrl.includes('images/post/smile/smallface/')) {
                allImageUrls.push(imageUrl); // 添加图片链接
            }
        });
    }


    // 以下是原始脚本中的代码
    var stickerWaifu = document.createElement('img');
    stickerWaifu.src = 'https://pic.ziyuan.wang/2023/09/17/guest_e21c2889c4de1.gif';
    stickerWaifu.style.position = 'fixed';
    stickerWaifu.style.zIndex = '9999';
    stickerWaifu.style.cursor = 'move';
    stickerWaifu.draggable = true;
    stickerWaifu.style.width = '4%';
    stickerWaifu.style.left = '230px';
    stickerWaifu.style.top = '230px';

    var storedPosition = localStorage.getItem('stickerPosition');
    if (storedPosition) {
        var position = JSON.parse(storedPosition);
        stickerWaifu.style.left = position.x + 'px';
        stickerWaifu.style.top = position.y + 'px';
    } else {
        stickerWaifu.style.bottom = '0';
        stickerWaifu.style.right = '0';
    }

    var offsetX, offsetY;

    stickerWaifu.addEventListener('mousedown', function(event) {
        offsetX = event.clientX - stickerWaifu.getBoundingClientRect().left;
        offsetY = event.clientY - stickerWaifu.getBoundingClientRect().top;
        document.addEventListener('mousemove', onMouseMove);
    });

    document.addEventListener('mouseup', function() {
        document.removeEventListener('mousemove', onMouseMove);
        var position = {
            x: parseInt(stickerWaifu.style.left),
            y: parseInt(stickerWaifu.style.top)
        };
        localStorage.setItem('stickerPosition', JSON.stringify(position));
    });

    function onMouseMove(event) {
        var x = event.clientX - offsetX;
        var y = event.clientY - offsetY;
        stickerWaifu.style.left = x + 'px';
        stickerWaifu.style.top = y + 'px';
    }

    // 添加双击事件处理程序
    stickerWaifu.addEventListener('dblclick', openPopup);

    // 弹窗函数
    function openPopup() {
        var popupUrl = 'http://himg.ezyro.com/lb/?img=' + allImageUrls.join('|');
        var popupWidth = 1000;
        var popupHeight = 1000;

        // 居中计算
        var left = (window.innerWidth - popupWidth) / 2;
        var top = (window.innerHeight - popupHeight) / 2;

        // 打开新窗口
        window.open(popupUrl, 'popup', 'width=' + popupWidth + ',height=' + popupHeight + ',left=' + left + ',top=' + top);
    }

    document.body.appendChild(stickerWaifu);

  var currentDomain = window.location.hostname;
  var redirectToDomain = 'bbs.imoutolove.me';

  if (currentDomain !== redirectToDomain) {
    var newURL = window.location.href.replace(currentDomain, redirectToDomain);
    window.location.href = newURL;
  }

})();