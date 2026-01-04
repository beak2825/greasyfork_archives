// ==UserScript==
// @name         FreeOK 网页全屏按钮 播放失败自动刷新
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  在freeok.vip网页的添加网页全屏按钮 并且自动刷新播放失败的页面
// @author       hubit123
// @match        *://www.freeok.vip/*
// @match        *://www.freeok.pro/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/477588/FreeOK%20%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F%E6%8C%89%E9%92%AE%20%E6%92%AD%E6%94%BE%E5%A4%B1%E8%B4%A5%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/477588/FreeOK%20%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F%E6%8C%89%E9%92%AE%20%E6%92%AD%E6%94%BE%E5%A4%B1%E8%B4%A5%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 查找iframe
    var player_box_main = document.querySelector('.player-box-main');
    var playleft = document.querySelector('#playleft');
    var iframe = document.querySelector('#playleft > iframe');

    if (iframe) {
        // 等待iframe加载完成
        iframe.onload = function() {
            var iframeDocument = iframe.contentDocument;

            setTimeout(function() {
                // 在iframe中查找#mplayer-header元素
                var mplayerHeader = iframeDocument.querySelector('#mplayer-header');
                if (mplayerHeader) {
                    // 创建新的div元素
                    var newDiv = iframeDocument.createElement('div');
                    newDiv.className = 'title-groupt';
                    newDiv.style.textAlign = 'right'; // 靠右对齐

                    // 创建网页全屏按钮
                    var fullscreenButton = iframeDocument.createElement('button');
                    fullscreenButton.className = 'player-btn header-control back-button keyboard-input';
                    fullscreenButton.id = 'full-screen-btn';
                    fullscreenButton.setAttribute('control', '');

                    var titleName = iframeDocument.createElement('div');
                    titleName.className = 'title-name';
                    titleName.textContent = '网页全屏';

                    fullscreenButton.addEventListener('click', function() {
                        // 切换#playleft元素的大小
                        if (playleft.style.width === '100%') {
                            player_box_main.style = '';
                            playleft.style = '';

                            localStorage.setItem('full-screen-tag', '');
                        } else {
                            player_box_main.style.width = '100%';
                            player_box_main.style.height = '100%';
                            player_box_main.style.position = 'fixed'; // 悬浮在页面上
                            player_box_main.style.zIndex = '9999'; // 设置z-index确保悬浮在其他元素之上
                            player_box_main.style.top = '0';
                            player_box_main.style.left = '0';

                            playleft.style.width = '100%';
                            playleft.style.height = '100%';
                            playleft.style.position = 'fixed'; // 悬浮在页面上
                            playleft.style.zIndex = '9999'; // 设置z-index确保悬浮在其他元素之上
                            playleft.style.top = '0';
                            playleft.style.left = '0';

                            localStorage.setItem('full-screen-tag', '1');
                        }
                    });

                    fullscreenButton.appendChild(titleName);
                    newDiv.appendChild(fullscreenButton);

                    // 在#mplayer-header元素中添加新元素
                    mplayerHeader.appendChild(newDiv);

                    if(localStorage.getItem('full-screen-tag') == '1') fullscreenButton.click();
                }
            }, 3000);

            var mplayerError = iframeDocument.querySelector('#mplayer-error');
            if(mplayerError && mplayerError.style){
                // 检测播放失败重新刷新界面
                setInterval(function() {
                    var logo = iframeDocument.querySelector('.logo');
                    if (mplayerError.style.display === 'block') {
                        location.reload();
                    }
                }, 1000); // 每秒检查一次，可以根据需要调整间隔时间
            }
        };
    }
})();
