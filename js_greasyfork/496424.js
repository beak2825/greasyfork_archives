// ==UserScript==
// @name         粒子特效
// @namespace    http://tampermonkey.net/
// @version      2024-05-29-2
// @description  覆盖全屏的交互式粒子特效
// @author       You
// @match        *://*/**
// @icon         https://www.google.com/s2/favicons?sz=64&domain=undefined.localhost
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/496424/%E7%B2%92%E5%AD%90%E7%89%B9%E6%95%88.user.js
// @updateURL https://update.greasyfork.org/scripts/496424/%E7%B2%92%E5%AD%90%E7%89%B9%E6%95%88.meta.js
// ==/UserScript==

(function() {
    'use strict';
            // 创建并配置canvas
            const canvas = document.createElement('canvas');
            canvas.id = 'particleCanvas';
            canvas.style.position = 'fixed';
            canvas.style.top = '0';
            canvas.style.left = '0';
            canvas.style.width = '100%';
            canvas.style.height = '100%';
            canvas.style.zIndex = '999999999'; // 确保z-index足够大
            canvas.style.pointerEvents = 'none'; // 使事件穿透
            document.body.appendChild(canvas);
            console.log("粒子特效")
            const ctx = canvas.getContext('2d');
            resizeCanvas();

            const particles = [];
            const numParticles = 100;
            const mouse = {x: null, y: null};
            const mouseRadius = 100;
            const maxSpeed = 1; // 调整后的速度
            const repelSpeed = 3; // 调整后的速度

            class Particle {
                constructor() {
                    this.reset();
                    this.color = this.randomColor(); // 初始化颜色
                }

                reset() {
                    this.x = Math.random() * canvas.width;
                    this.y = Math.random() * canvas.height;
                    this.speed = maxSpeed;
                    this.directionAngle = Math.random() * 2 * Math.PI;
                    this.vx = Math.cos(this.directionAngle) * this.speed;
                    this.vy = Math.sin(this.directionAngle) * this.speed;
                }

                randomColor() {
                    const r = Math.floor(Math.random() * 256);
                    const g = Math.floor(Math.random() * 256);
                    const b = Math.floor(Math.random() * 256);
                    const a = Math.random()
                    return `rgba(${r},${g},${b},${a})`;
                }

                update() {
                    if (mouse.x !== null && mouse.y !== null) {
                        const dx = this.x - mouse.x;
                        const dy = this.y - mouse.y;
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        if (distance < mouseRadius) {
                            const angle = Math.atan2(dy, dx);
                            this.vx = Math.cos(angle) * repelSpeed;
                            this.vy = Math.sin(angle) * repelSpeed;
                            this.directionAngle = angle;
                        } else {
                            this.vx = Math.cos(this.directionAngle) * maxSpeed;
                            this.vy = Math.sin(this.directionAngle) * maxSpeed;
                        }
                    } else {
                        this.vx = Math.cos(this.directionAngle) * maxSpeed;
                        this.vy = Math.sin(this.directionAngle) * maxSpeed;
                    }

                    this.x += this.vx;
                    this.y += this.vy;

                    if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                        this.reset();
                    }
                }

                draw() {
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, 2, 0, Math.PI * 2); // 调整后的粒子大小
                    ctx.fillStyle = this.color; // 使用随机颜色
                    ctx.fill();
                }
            }

            function init() {
                for (let i = 0; i < numParticles; i++) {
                    particles.push(new Particle());
                }
            }

            function animate() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                particles.forEach(particle => {
                    particle.update();
                    particle.draw();
                });
                requestAnimationFrame(animate);
            }

            function resizeCanvas() {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            }

            window.addEventListener('resize', resizeCanvas);

            document.addEventListener('mousemove', (event) => {
                mouse.x = event.clientX;
                mouse.y = event.clientY;
            });

            document.addEventListener('mouseleave', () => {
                mouse.x = null;
                mouse.y = null;
            });

            init();
            animate();
    // Your code here...
})();