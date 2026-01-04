// ==UserScript==
// @name         学城头像效果
// @namespace    http://tampermonkey.net/
// @version      0.21
// @description  学城右上角头像下金币，点击切换帽子 & 按住拖动帽子
// @author       Gemini
// @match        *://km.sankuai.com/*
// @grant        none
// @run-at       document-end // 確保DOM加載完成後執行
// @downloadURL https://update.greasyfork.org/scripts/521619/%E5%AD%A6%E5%9F%8E%E5%A4%B4%E5%83%8F%E6%95%88%E6%9E%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/521619/%E5%AD%A6%E5%9F%8E%E5%A4%B4%E5%83%8F%E6%95%88%E6%9E%9C.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (!document.body) {
        window.addEventListener('DOMContentLoaded', addImage);
    } else {
        addImage();
    }

    function addImage() {
        const imgContainer = document.createElement('div');
        imgContainer.style.position = 'fixed';
        imgContainer.style.top = '0px';
        imgContainer.style.right= '22px';
        //imgContainer.style.cursor = 'pointer';
        imgContainer.style.zIndex = 9999;
        imgContainer.style.userSelect = 'none'; // 防止拖拽时选中文字

        const img = document.createElement('img');
        img.src = "https://pic1.imgdb.cn/item/677359c0d0e0a243d4ecf458.png";
        img.style.display = 'block';
        img.style.maxWidth = '20px';
        img.style.maxHeight = 'auto';
        imgContainer.appendChild(img);

        document.body.appendChild(imgContainer);

        const imgUrls = [
            "https://pic1.imgdb.cn/item/677359c0d0e0a243d4ecf458.png",
            "https://pic.imgdb.cn/item/676a3defd0e0a243d4e8fa0a.png",
            "https://pic.imgdb.cn/item/676a5aecd0e0a243d4e91f8c.png",
            "https://pic.imgdb.cn/item/676a5aecd0e0a243d4e91f8d.png",
            "https://pic.imgdb.cn/item/676a3df0d0e0a243d4e8fa0d.png",
            "https://pic.imgdb.cn/item/676a3df1d0e0a243d4e8fa0e.png"
        ];
        let currentImgIndex = 0;

        let isDragging = false;
        let startX = 0;
        let startY = 0;
        let moved = false;
        let initialLeft = 0;
        let initialTop = 0;

        imgContainer.addEventListener('mousedown', (e) => {
            e.preventDefault(); // 阻止默认拖拽行为
            e.stopPropagation(); // 阻止事件冒泡
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            moved = false;
            initialLeft = imgContainer.offsetLeft;
            initialTop = imgContainer.offsetTop;

            const moveHandler = (e) => {
                if (isDragging) {
                    const deltaX = Math.abs(e.clientX - startX);
                    const deltaY = Math.abs(e.clientY - startY);

                    if (deltaX > 2 || deltaY > 2) {
                        moved = true;
                        imgContainer.style.left = (initialLeft + (e.clientX - startX)) + 'px';
                        imgContainer.style.top = (initialTop + (e.clientY - startY)) + 'px';
                    }
                }
            };

            const upHandler = (e) => {
                e.preventDefault(); // 阻止默认行为
                e.stopPropagation(); // 阻止事件冒泡
                isDragging = false;

                document.removeEventListener('mousemove', moveHandler);
                document.removeEventListener('mouseup', upHandler);

                if (!moved) {
                    currentImgIndex = (currentImgIndex + 1) % imgUrls.length;
                    img.src = imgUrls[currentImgIndex];
                    imgContainer.style.left = initialLeft + 'px';
                    imgContainer.style.top = initialTop + 'px';
                }
                //imgContainer.style.cursor = 'grab';
            };

            document.addEventListener('mousemove', moveHandler);
            document.addEventListener('mouseup', upHandler);
        });

        img.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
        });
    }

    // 檢查 body 是否存在，如果不存在則稍後再執行
    if (!document.body) {
        window.addEventListener('DOMContentLoaded', function() {
            addChristmasEffects();
        });
    } else {
        addChristmasEffects();
    }

    function addChristmasEffects() {
        // 创建雪花容器
        const snowContainer = document.createElement('div');
        snowContainer.id = 'snow-container'; // 添加 ID 方便查找和调试
        snowContainer.style.position = 'fixed';
        snowContainer.style.top = '8px';
        snowContainer.style.right = '20px';
        snowContainer.style.width = '28px';
        snowContainer.style.height = '28px';
        snowContainer.style.borderRadius = '50%';
        snowContainer.style.overflow = 'hidden';
        snowContainer.style.pointerEvents = 'none';
        snowContainer.style.zIndex = 9999; // 確保在最上層
        document.body.appendChild(snowContainer);

        // 创建雪花
        function createSnowflake() {
            const snowflake = document.createElement('div');
            let wht = Math.random() + 1 + 'px'
            snowflake.style.position = 'absolute';
            snowflake.style.backgroundColor = '#FFDD00';
            snowflake.style.borderRadius = '50%';
            snowflake.style.width = wht;
            snowflake.style.height = wht;
            snowflake.style.left = Math.random() * 28 + 'px';
            snowflake.style.top = '-2px';
            snowflake.style.opacity = Math.random() * 0.5 + 0.7;
            snowContainer.appendChild(snowflake);

            let y = -2;
            //let xOffset = (Math.random() - 0.25) * 1;
            //let ySpeed = Math.random() * 0.25 + 0.25;
            let ySpeed = Math.random() * 0.4 + 0.4;

            function animateSnowflake() {
                y += ySpeed;
                snowflake.style.top = y + 'px';
                snowflake.style.left = parseFloat(snowflake.style.left) + 'px';
                //snowflake.style.left = parseFloat(snowflake.style.left) + xOffset + 'px';

                if (y > 28) {
                    snowflake.remove();
                    createSnowflake();
                    return;
                }
                requestAnimationFrame(animateSnowflake);
            }
            animateSnowflake();
        }

        // 创建多个雪花
        for (let i = 0; i < 20; i++) {
            createSnowflake();
        }
    }
})();