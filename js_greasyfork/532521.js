// ==UserScript==
// @name         鼠标效果
// @namespace    http://tampermonkey.net/
// @version      2025-08-13
// @description  添加适用于所有网页的鼠标点击和移动动画效果
// @author       bossmei
// @match        https://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/532521/%E9%BC%A0%E6%A0%87%E6%95%88%E6%9E%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/532521/%E9%BC%A0%E6%A0%87%E6%95%88%E6%9E%9C.meta.js
// ==/UserScript==

(function() {
   function init() {
       // 创建和应用样式
        const style = document.createElement('style');
        style.textContent = `
            .particle {
                position: absolute;
                pointer-events: none;
                animation: particle 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
                background: linear-gradient(45deg, #ff0080, #ff00ff, #00ff00, #00ffff, #ff8000);
                background-size: 400% 400%;
                animation: particle 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards,
                         gradient 4s ease infinite;
            }

            @keyframes gradient {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
            }

            @keyframes particle {
                0% {
                    transform: scale(0) rotate(0deg) translateY(0);
                    opacity: 1;
                }
                50% {
                    transform: scale(0.7) rotate(180deg) translateY(-20px);
                }
                100% {
                    transform: scale(1) rotate(360deg) translateY(-40px);
                    opacity: 0;
                }
            }

            .trail-particle {
                position: absolute;
                pointer-events: none;
                animation: trail-fade 0.8s ease-out forwards;
                filter: blur(1px);
            }

            @keyframes trail-fade {
                0% {
                    transform: scale(1) translateY(0);
                    opacity: 0.8;
                }
                50% {
                    transform: scale(0.8) translateY(-10px) rotate(45deg);
                }
                100% {
                    transform: scale(0.5) translateY(-20px) rotate(90deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);

        let isDragging = false;
        let lastX = 0;
        let lastY = 0;

        // 创建粒子效果函数
        function createParticle(x, y, isTrail = false) {
            const colors = ['#ff0080', '#ff00ff', '#00ff00', '#00ffff', '#ff8000'];
            const shapes = ['50%', '0', '30% 70% 70% 30% / 30% 30% 70% 70%'];
            const particle = document.createElement('div');
            particle.className = isTrail ? 'trail-particle' : 'particle';
            const size = Math.random() * (isTrail ? 12 : 20) + (isTrail ? 4 : 8);
            const color = colors[Math.floor(Math.random() * colors.length)];

            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            particle.style.background = isTrail ? color : '';
            particle.style.left = (x + window.scrollX - size/2) + 'px';
            particle.style.top = (y + window.scrollY - size/2) + 'px';
            particle.style.borderRadius = shapes[Math.floor(Math.random() * shapes.length)];

            document.body.appendChild(particle);
            particle.addEventListener('animationend', () => particle.remove());

            if (!isTrail && Math.random() > 0.5) {
                setTimeout(() => {
                    const angle = Math.random() * Math.PI * 2;
                    const distance = Math.random() * 50 + 20;
                    const childX = x + Math.cos(angle) * distance;
                    const childY = y + Math.sin(angle) * distance;
                    createParticle(childX, childY, true);
                }, Math.random() * 200);
            }
        }

        document.addEventListener('mousedown', function(event) {
            isDragging = true;
            lastX = event.clientX;
            lastY = event.clientY;
        });

        document.addEventListener('mousemove', function(event) {
            const currentX = event.clientX;
            const currentY = event.clientY;
            const distance = Math.hypot(currentX - lastX, currentY - lastY);

            if (distance > 5) {
                for (let i = 0; i < 2; i++) {
                    const offsetX = (Math.random() - 0.5) * 20;
                    const offsetY = (Math.random() - 0.5) * 20;
                    createParticle(currentX + offsetX, currentY + offsetY, true);
                }
                lastX = currentX;
                lastY = currentY;
            }
        });

        document.addEventListener('mouseup', function() {
            isDragging = false;
        });

        document.addEventListener('click', function(event) {
            // 创建波纹效果
            const ripple = document.createElement('div');
            ripple.className = 'ripple';
            const rippleSize = 20;
            ripple.style.left = (event.clientX + window.scrollX - rippleSize/2) + 'px';
            ripple.style.top = (event.clientY + window.scrollY - rippleSize/2) + 'px';
            ripple.style.width = rippleSize + 'px';
            ripple.style.height = rippleSize + 'px';
            document.body.appendChild(ripple);

            // 创建粒子效果
            const colors = ['#ff0080', '#ff00ff', '#00ff00', '#00ffff', '#ff8000'];
            for (let i = 0; i < 8; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                const size = Math.random() * 15 + 5;
                const color = colors[Math.floor(Math.random() * colors.length)];
                particle.style.width = size + 'px';
                particle.style.height = size + 'px';
                particle.style.background = color;
                particle.style.left = (event.clientX + window.scrollX - size/2) + 'px';
                particle.style.top = (event.clientY + window.scrollY - size/2) + 'px';
                particle.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
                document.body.appendChild(particle);

                // 动画结束后移除元素
                particle.addEventListener('animationend', () => particle.remove());
            }

            // 移除波纹
            setTimeout(() => ripple.remove(), 600);
        });
   }
    setTimeout(() => {
        console.log('梅老板无处不在')
        init()
    }, 1000)

})();