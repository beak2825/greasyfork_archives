// ==UserScript==
// @name         查看图片
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  将网页中的所有图片全屏放大，通过上下点击翻页查看，更加方便和护眼
// @author       Cooper
// @match        *://*/*
// @downloadURL https://update.greasyfork.org/scripts/529054/%E6%9F%A5%E7%9C%8B%E5%9B%BE%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/529054/%E6%9F%A5%E7%9C%8B%E5%9B%BE%E7%89%87.meta.js
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
        background-color:transparent; z-index:1000000000;
    `;
    const body = document.body;
    body.appendChild(flip);
    let flag = false;
    flip.addEventListener("click", (e) => {
        e.stopPropagation(); // 阻止事件冒泡到底层
        if (!flag){
            turnON();
        }else{
            turnOFF();
        }
        flag = !flag;
    });


    function turnON(){
        const createOverlay = () => {
            const overlay = document.createElement("div");
            overlay.id = "img-overlay";
            overlay.style = `
                position:fixed; top:0; left:0;
                width:100%; height:100%;
                background-color:rgba(0, 0, 0, 0.8);
                display:flex; justify-content:center;
                z-index:999999999;
            `;
            body.appendChild(overlay);

            const imgContainer = document.createElement("div");
            imgContainer.style = `
                position:relative;
                width:100%; height:100%;
                max-width:800px; margin:0;
            `;
            overlay.appendChild(imgContainer);

            const currentImg = document.createElement("img");
            currentImg.style =`
                width:100%; height:100%;
                object-fit:contain; display:block;
            `;
            imgContainer.appendChild(currentImg);

            return { overlay, currentImg };
        };

        const initImgViewer = () => {
            // 获取页面上所有图片的 src
            const Images = Array.from(document.querySelectorAll("img")).map(img=>img.src);
            console.log('图片数组:',Images);

            let currentIndex = 0;
            const { overlay, currentImg } = createOverlay();

            const showCurrentImg = () => {
                currentImg.src = Images[currentIndex];
                currentImg.alt = `加载失败 ${currentIndex + 1}/${Images.length}`;
                currentImg.style.color='white';
                flip.textContent = currentIndex + 1;
            };
            showCurrentImg();

            overlay.addEventListener("click", (e) => {
                e.stopPropagation();
                const screenHeight = window.innerHeight;
                const clickY = e.clientY;

                if (clickY < screenHeight / 2) { 
                    if (currentIndex > 0) {currentIndex--;} // 点击在屏幕上半部分
                } else {
                    if (currentIndex < Images.length - 1) {currentIndex++;} // 点击在屏幕下半部分
                }
                showCurrentImg();
            });
        };

        initImgViewer();
    }

    function turnOFF(){
        const overlay = document.getElementById("img-overlay");
        body.removeChild(overlay);
        flip.textContent = "ON";
    }
})();