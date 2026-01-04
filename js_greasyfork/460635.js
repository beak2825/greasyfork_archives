// ==UserScript==
// @name         雪の背景
// @namespace    http://your.homepage/
// @version      0.1
// @description  Add snow effect to background
// @author       aoi
// @match        http://drrrkari.com/room/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/460635/%E9%9B%AA%E3%81%AE%E8%83%8C%E6%99%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/460635/%E9%9B%AA%E3%81%AE%E8%83%8C%E6%99%AF.meta.js
// ==/UserScript==

(function() {
    const canvas = document.createElement("canvas");
    canvas.id = "snowy-background";
    canvas.style = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
    `;

    const ctx = canvas.getContext("2d");
    const W = window.innerWidth;
    const H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;

    const flakes = [];
    for (let i = 0; i < W / 10; i++) {
        flakes.push({
            x: Math.random() * W,
            y: Math.random() * H,
            r: Math.random() * 4 + 1,
            speed: Math.random() + 1,
        });
    }

    function draw() {
        ctx.clearRect(0, 0, W, H);
        ctx.fillStyle = "rgba(255,255,255,0.5)";
        ctx.fillRect(0, 0, W, H);

        for (let i = 0; i < flakes.length; i++) {
            let flake = flakes[i];
            ctx.beginPath();
            ctx.arc(flake.x, flake.y, flake.r, 0, 2 * Math.PI);
            ctx.fillStyle = "white";
            ctx.fill();
            flake.y += flake.speed;
            if (flake.y > H) {
                flake.y = 0;
                flake.speed = Math.random() + 1;
            }
        }
        requestAnimationFrame(draw);
    }

    document.body.appendChild(canvas);
    draw();
})();
