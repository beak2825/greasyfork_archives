// ==UserScript==
// @name              HideImages
// @name:zh-CN        隐藏图片
// @namespace         https://greasyfork.org/users/1403857
// @description       Add a button to hide or show web images. Hide/show status will be remember by domain.
// @description:zh-CN 在网页增加一个快捷按钮，一键隐藏/显示图片。隐藏/显示状态会根据域名被记住。
// @author            Eric
// @license           MIT
// @match             *://*/*
// @run-at            document-end
// @grant             GM_getValue
// @grant             GM_setValue
// @version           1.1.0
// @downloadURL https://update.greasyfork.org/scripts/519225/HideImages.user.js
// @updateURL https://update.greasyfork.org/scripts/519225/HideImages.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const hiddenDomains = new Set(GM_getValue("hiddenDomains"));

    // 插入到页面中
    let btnDom = document.createElement('div');
    btnDom.className = 'hi-btn';
    if (hiddenDomains.has(document.location.hostname)) {
        btnDom.textContent = '显';
        btnDom.style.backgroundColor = '#17b978';
    } else {
        btnDom.textContent = '隐';
        btnDom.style.backgroundColor = '#ff6f3c';
    }
    document.body.appendChild(btnDom);

    // 设置按钮初始位置
    const savedPosition = GM_getValue("btnPosition_" + location.hostname);
    if (savedPosition) {
        btnDom.style.left = savedPosition.left + 'px';
        btnDom.style.top = savedPosition.top + 'px';
        btnDom.style.right = 'auto';
        btnDom.style.bottom = 'auto';
    } else {
        btnDom.style.right = '20px';
        btnDom.style.bottom = '100px';
    }

    // 再添加样式
    let style = `
      .hi-btn {
        position: fixed;
        z-index: 9999;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #ff6f3c;
        border-radius: 10px;
        cursor: move;
        font-size: 20px;
        color: #ffffff;
        user-select: none;
      }
    `

    let styleDom = document.createElement('style');
    styleDom.innerHTML = style;
    document.head.appendChild(styleDom);

    // 支持拖动
    let isDragging = false;
    btnDom.addEventListener('mousedown', function (e) {
        e.preventDefault();

        isDragging = false;
        const startX = e.clientX;
        const startY = e.clientY;
        const rect = btnDom.getBoundingClientRect();
        const startLeft = rect.left;
        const startTop = rect.top;

        function onMouseMove(e) {
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;

            if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) {
                isDragging = true;
            }

            const newLeft = startLeft + deltaX;
            const newTop = startTop + deltaY;

            const vw = window.innerWidth;
            const vh = window.innerHeight;
            const btnW = btnDom.offsetWidth;
            const btnH = btnDom.offsetHeight;

            const left = Math.min(Math.max(newLeft, 0), vw - btnW);
            const top  = Math.min(Math.max(newTop, 0), vh - btnH);

            btnDom.style.left = left + 'px';
            btnDom.style.top  = top  + 'px';
            btnDom.style.right = 'auto';
            btnDom.style.bottom = 'auto';
        }

        function onMouseUp() {
            if (isDragging) {
                GM_setValue("btnPosition_" + location.hostname, {
                    left: parseInt(btnDom.style.left, 10),
                    top: parseInt(btnDom.style.top, 10),
                });
            }
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });

    // 处理点击
    btnDom.addEventListener('click', function (e) {
        if (isDragging) {
            e.preventDefault();
            e.stopPropagation();
            return;
        }

        if (hiddenDomains.has(document.location.hostname)) {
            btnDom.textContent = '隐';
            btnDom.style.backgroundColor = '#ff6f3c';
            hiddenDomains.delete(document.location.hostname);
        } else {
            btnDom.textContent = '显';
            btnDom.style.backgroundColor = '#17b978';
            hiddenDomains.add(document.location.hostname);
        }

        GM_setValue("hiddenDomains", [...hiddenDomains]);
        hideMedia();
    });

    function hideMedia() {
        const show = !hiddenDomains.has(document.location.hostname);

        const images = document.querySelectorAll('img, image, photo, thumbnail, picture, gallery, icon, avatar, video, art-player-wrapper, imgbox-border, img-wrapper, goods');
        images.forEach(function (element) {
            element.style.display = show ? '' : 'none';
        });

        // 小红书处理
        const redImages = document.querySelectorAll('.cover.ld.mask');
        redImages.forEach(function (element) {
            element.style.display = show ? '' : 'none';
        });

        const redImagesIn = document.querySelectorAll('.media-container');
        redImagesIn.forEach(function (element) {
            element.style.display = show ? '' : 'none';
        });
    }

    function observeDOM() {
        const observer = new MutationObserver(() => {
            hideMedia();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
    }

    observeDOM();
})();
