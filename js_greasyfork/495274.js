// ==UserScript==
// @name         Show FPS
// @namespace    https://discord.gg/gmQZpuneKh
// @version      1.0
// @description  Hiển thị FPS trên tất cả các trang web
// @match        *://*/*
// @author       ! 3sut2z !
// @icon         https://media.discordapp.net/attachments/1223491413786890240/1240466088802783323/3s.png?ex=6647fb12&is=6646a992&hm=89cdb265807c91a6a344ff4f2620a75108f83cca48adfb84e0971ba264618e01&=&format=webp&quality=lossless&width=427&height=427
// @grant        none
// @license MIT2
// @downloadURL https://update.greasyfork.org/scripts/495274/Show%20FPS.user.js
// @updateURL https://update.greasyfork.org/scripts/495274/Show%20FPS.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Tạo một div để hiển thị FPS
    const fpsDiv = document.createElement('div');
    fpsDiv.style.position = 'fixed';
    fpsDiv.style.top = '10px';
    fpsDiv.style.left = '10px';
    fpsDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    fpsDiv.style.color = 'white';
    fpsDiv.style.padding = '5px';
    fpsDiv.style.zIndex = '10000';
    document.body.appendChild(fpsDiv);

    let lastFrameTime = performance.now();
    let frameCount = 0;
    let fps = 0;

    function updateFPS() {
        const now = performance.now();
        frameCount++;
        const delta = now - lastFrameTime;

        if (delta >= 1000) {
            fps = (frameCount / delta) * 1000;
            fpsDiv.textContent = `FPS: ${fps.toFixed(1)}`;
            frameCount = 0;
            lastFrameTime = now;
        }

        requestAnimationFrame(updateFPS);
    }

    // Bắt đầu đo lường FPS
    requestAnimationFrame(updateFPS);
})();
