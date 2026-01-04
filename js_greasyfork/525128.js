// ==UserScript==
// @name         替换zi.tools的首页为2024愚人节样式
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Replace the zi.tools main page with the 2024 April Fools' Day styles
// @author       SkyEye_FAST
// @match        *://zi.tools/*
// @license      Apache-2.0
// @downloadURL https://update.greasyfork.org/scripts/525128/%E6%9B%BF%E6%8D%A2zitools%E7%9A%84%E9%A6%96%E9%A1%B5%E4%B8%BA2024%E6%84%9A%E4%BA%BA%E8%8A%82%E6%A0%B7%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/525128/%E6%9B%BF%E6%8D%A2zitools%E7%9A%84%E9%A6%96%E9%A1%B5%E4%B8%BA2024%E6%84%9A%E4%BA%BA%E8%8A%82%E6%A0%B7%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function replaceImages() {
        const topBarsImg = document.querySelector('.top-bars img');
        if (topBarsImg && (topBarsImg.src.includes('zi2025.svg') || topBarsImg.src.includes('zi-tools.svg'))) {
            topBarsImg.src = 'https://ziphoenicia-1300189285.cos.ap-shanghai.myqcloud.com/home_svg/zt1.jpg';
            topBarsImg.style = '';
            topBarsImg.style.width = '500px';
            topBarsImg.style.maxWidth = '80%';
        }

        const fixedHeaderImgs = document.querySelector('.fixedHeader img');
        if (fixedHeaderImgs && fixedHeaderImgs.src.includes('zi-tools.svg')) {
            fixedHeaderImgs.src = 'https://ziphoenicia-1300189285.cos.ap-shanghai.myqcloud.com/home_svg/zt2.png';
        }

        const pcScreenImg = document.querySelector('.pc-screen img');
        if (pcScreenImg) {
            pcScreenImg.style = '';
            pcScreenImg.style.width = '100px';
            pcScreenImg.style.opacity = '1';
            pcScreenImg.style.position = 'relative';
            pcScreenImg.style.left = '-50px';
        }

        const mobileScreenImg = document.querySelector('.mobile-screen img');
        if (mobileScreenImg) {
            mobileScreenImg.style = '';
            mobileScreenImg.style.width = '50px';
            mobileScreenImg.style.opacity = '1';
        }
    }

    function addBouncingImage() {
        let bouncingImage = document.getElementById('bouncingImage');
        let animationId;
        let isAnimating = true;

        if (!bouncingImage) {
            bouncingImage = document.createElement('img');
            bouncingImage.id = 'bouncingImage';
            bouncingImage.src = 'https://ziphoenicia-1300189285.cos.ap-shanghai.myqcloud.com/home_svg/dtzz.gif';
            bouncingImage.alt = '動態組字';
            bouncingImage.style.cssText = 'cursor: pointer; position: absolute; z-index: 100; display: none;';
            document.body.appendChild(bouncingImage);
        }

        const updateVisibility = () => {
            const queryParams = new URLSearchParams(window.location.search);
            if (window.location.pathname === '/' && !queryParams.has('secondary')) {
                bouncingImage.style.display = '';
                isAnimating = true;
                bounce();
            } else {
                bouncingImage.style.display = 'none';
                isAnimating = false;
                if (animationId) cancelAnimationFrame(animationId);
            }
        };

        let posX = 0, posY = 0, speedX = 2, speedY = 2;

        function bounce() {
            if (!isAnimating) return;

            const windowWidth = document.documentElement.clientWidth;
            const windowHeight = document.documentElement.clientHeight;
            const imageWidth = bouncingImage.offsetWidth;
            const imageHeight = bouncingImage.offsetHeight;

            posX += speedX;
            posY += speedY;

            if (posX + imageWidth >= windowWidth || posX <= 0) speedX *= -1;
            if (posY + imageHeight >= windowHeight || posY <= 0) speedY *= -1;

            bouncingImage.style.left = posX + 'px';
            bouncingImage.style.top = posY + 'px';
            animationId = requestAnimationFrame(bounce);
        }

        updateVisibility();

        bouncingImage.addEventListener('click', () => {
            isAnimating = false;
            bouncingImage.style.display = 'none';
            if (window.location.pathname === '/') {
                const queryParams = new URLSearchParams(window.location.search);
                queryParams.set('secondary', 'ids');
                window.location.search = queryParams.toString();
            }
        });

        window.addEventListener('resize', () => {
            posX = Math.min(posX, document.documentElement.clientWidth - bouncingImage.offsetWidth);
            posY = Math.min(posY, document.documentElement.clientHeight - bouncingImage.offsetHeight);
        });
    }

    function init() {
        replaceImages();
        addBouncingImage();
    }

    window.addEventListener('load', init);

    const observer = new MutationObserver((mutations) => {
        if (mutations.some(m => m.addedNodes.length || m.removedNodes.length)) {
            init();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();