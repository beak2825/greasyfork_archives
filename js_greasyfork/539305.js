// ==UserScript==
// @name         浏览器全局彩带效果
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在任意网页中点击生成彩带效果
// @author       一心向善
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/539305/%E6%B5%8F%E8%A7%88%E5%99%A8%E5%85%A8%E5%B1%80%E5%BD%A9%E5%B8%A6%E6%95%88%E6%9E%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/539305/%E6%B5%8F%E8%A7%88%E5%99%A8%E5%85%A8%E5%B1%80%E5%BD%A9%E5%B8%A6%E6%95%88%E6%9E%9C.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建 canvas
    const canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '10000';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let ribbons = [];

    // 调整 canvas 尺寸
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // 彩带粒子类
    class RibbonParticle {
        constructor(x, y, dx, dy, color, life) {
            this.x = x;
            this.y = y;
            this.dx = dx;
            this.dy = dy;
            this.color = color;
            this.life = life;
            this.opacity = 1;
            this.width = Math.random() * 3 + 1; // 随机宽度
        }
        update() {
            this.x += this.dx;
            this.y += this.dy;
            this.dy += 0.05; // 重力效果
            this.life--;
            this.opacity = Math.max(this.life / 100, 0); // 淡出
        }
        draw() {
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x + this.dx * 5, this.y + this.dy * 5); // 细长彩带
            ctx.strokeStyle = `rgba(${this.color}, ${this.opacity})`;
            ctx.lineWidth = this.width;
            ctx.stroke();
        }
    }

    // 彩带类
    class Ribbon {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.particles = [];
            this.createParticles();
        }
        createParticles() {
            const colors = ['255,0,0', '0,255,0', '0,0,255', '255,255,0', '255,0,255', '0,255,255'];
            const color = colors[Math.floor(Math.random() * colors.length)];
            for (let i = 0; i < 10; i++) { // 减少粒子数量，使彩带更细长
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 3 + 1;
                const dx = Math.cos(angle) * speed;
                const dy = Math.sin(angle) * speed;
                this.particles.push(new RibbonParticle(this.x, this.y, dx, dy, color, 80)); // 增加生命值，使彩带更持久
            }
        }
        update() {
            this.particles.forEach(p => p.update());
            this.particles = this.particles.filter(p => p.life > 0);
        }
        draw() {
            this.particles.forEach(p => p.draw());
        }
    }

    // 鼠标点击生成彩带
    document.addEventListener('click', (e) => {
        const x = e.clientX;
        const y = e.clientY;
        ribbons.push(new Ribbon(x, y));
    });

    // 鼠标移动生成彩带
    let lastMouseX = 0;
    let lastMouseY = 0;
    document.addEventListener('mousemove', (e) => {
        const x = e.clientX;
        const y = e.clientY;
        const distance = Math.sqrt((x - lastMouseX) ** 2 + (y - lastMouseY) ** 2);
        if (distance > 10) { // 只有当鼠标移动一定距离时才生成彩带
            const direction = Math.atan2(y - lastMouseY, x - lastMouseX);
            ribbons.push(new Ribbon(x, y));
            lastMouseX = x;
            lastMouseY = y;
        }
    });

    // 动画循环
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ribbons.forEach((rb, index) => {
            rb.update();
            rb.draw();
            if (rb.particles.length === 0) {
                ribbons.splice(index, 1);
            }
        });
        requestAnimationFrame(animate);
    }
    animate();
})();