// ==UserScript==
// @name         绅士漫画左右翻页
// @namespace    http://tampermonkey.net/
// @version      5.5
// @description  把下拉式漫画变成左右翻页，更加方便和护眼，适配绅士漫画
// @author       Cooper
// @match        *://*/photos-slide-aid-*
// @match        *://*/photos-slist-aid-*
// @icon         https://s21.ax1x.com/2025/02/20/pEQ3VY9.jpg
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527499/%E7%BB%85%E5%A3%AB%E6%BC%AB%E7%94%BB%E5%B7%A6%E5%8F%B3%E7%BF%BB%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/527499/%E7%BB%85%E5%A3%AB%E6%BC%AB%E7%94%BB%E5%B7%A6%E5%8F%B3%E7%BF%BB%E9%A1%B5.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    const flip = document.createElement("button");
    flip.textContent = "ON";
    flip.style = `
        position:fixed; top:5%; right:5%;
        width:40px; height:40px; border-radius:20px;
        border:1px dashed #0d6efd;
        color:#0d6efd; font-size:16px; padding:3px 3px;
        background-color:transparent; z-index:10000;
    `;
    const body = document.body;
    body.appendChild(flip);

    function turnON(){
        // 创建遮罩层和翻页界面
        const createOverlay = () => {
            // 创建遮罩层
            const overlay = document.createElement("div");
            overlay.id = "comic-overlay";
            // 半透明黑色是0.5，0.8更不透明
            // 确保遮罩层在最上层
            overlay.style = `
                position:fixed; top:0; left:0;
                width:100%; height:100%;
                background-color:rgba(0, 0, 0, 0.8);
                display:flex; justify-content:center;
                z-index:9999;
            `; 
            body.appendChild(overlay);

            // 创建漫画图片容器
            const comicContainer = document.createElement("div");
            comicContainer.style = `
                position:relative;
                width:100%; height:100%;
                max-width:800px; margin:0;
            `;
            overlay.appendChild(comicContainer);

            const currentComic = document.createElement("img");
            currentComic.style =`
                width:100%; height:100%;
                object-fit:contain; display:block;
            `;
            comicContainer.appendChild(currentComic);

            return { overlay, currentComic };
        };

        // 初始化漫画翻页功能
        const initComicViewer = () => {
            // 获取页面上所有图片的 src
            const comicImages = imglist;  // imglist是原网站的全局变量
            console.log('图片数组:',comicImages);
            
            let currentIndex = 0;
            let num = prompt(`输入跳转的页数：1~${comicImages.length}`);
            if (num) { currentIndex = num - 1; }
            const { overlay, currentComic } = createOverlay();

            // 显示当前图片
            const showCurrentComic = () => {
                currentComic.src = comicImages[currentIndex].url;
                currentComic.alt = `加载失败 ${currentIndex + 1}/${comicImages.length}`;
                currentComic.style.color = 'white';
                flip.textContent = currentIndex + 1;
            };

            // 初始化显示第一张图片
            showCurrentComic();

            // 左右点击翻页
	        overlay.addEventListener("click", (e) => {
                e.stopPropagation(); // 阻止事件冒泡到底层

		        const screenWidth = window.innerWidth; // 获取屏幕宽度
                const clickX = e.clientX; // 获取点击事件的 X 坐标

                if (clickX < screenWidth / 2) {
                    // 点击在屏幕左半部分
                    if (currentIndex > 0) { currentIndex--; }
                } else {
                    // 点击在屏幕右半部分
                    if (currentIndex < comicImages.length - 1) { currentIndex++; }
                }
                showCurrentComic();
			});
        };

        // 初始化漫画查看器
        initComicViewer();
    }

    function turnOFF(){
        const overlay = document.getElementById("comic-overlay");
        body.removeChild(overlay);
        flip.textContent = "ON";
    }

    let flag = false;
    flip.addEventListener("click", (e) => {
        e.stopPropagation();
        if (!flag){
            turnON();
        }else{
            turnOFF();
        }
        flag = !flag;
        flip.style.border = flag ? 'none' : '1px dashed #0d6efd';
    });
})();