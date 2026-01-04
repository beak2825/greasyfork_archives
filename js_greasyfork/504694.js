// ==UserScript==
// @name         魂+图床
// @namespace    http://himg.ezyro.com/t/
// @version      2.6
// @description  为Imoutolove论坛添加图片上传功能
// @author       嗷呜
// @match        https://bbs.imoutolove.me/*
// @match        *://*.blue-plus.net/*
// @match        *://*.summer-plus.net/*
// @match        *://*.spring-plus.net/*
// @match        *://*.soul-plus.net/*
// @match        *://*.south-plus.net/*
// @match        *://*.north-plus.net/*
// @match        *://*.snow-plus.net/*
// @match        *://*.level-plus.net/*
// @match        *://*.www.level-plus.net/*
// @match        *://*.white-plus.net/*
// @match        *://*.south-plus.org/*
// @match        *://*.east-plus.net/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/504694/%E9%AD%82%2B%E5%9B%BE%E5%BA%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/504694/%E9%AD%82%2B%E5%9B%BE%E5%BA%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

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
        var popupUrl = 'http://himg.ezyro.com/t/';
        var popupWidth = 960;
        var popupHeight = 833;

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
