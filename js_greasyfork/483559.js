// ==UserScript==
// @name         Новойгодой
// @namespace    http://tampermonkey.net/
// @version      2023-12-31
// @description  САЛЮТ ЕБАТЬ
// @author       Wen
// @match        https://zelenka.guru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelenka.guru
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/483559/%D0%9D%D0%BE%D0%B2%D0%BE%D0%B9%D0%B3%D0%BE%D0%B4%D0%BE%D0%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/483559/%D0%9D%D0%BE%D0%B2%D0%BE%D0%B9%D0%B3%D0%BE%D0%B4%D0%BE%D0%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function checkNewYear() {
        var now = new Date();
        var newYearMoscow = new Date(now.getUTCFullYear() + 1, 0, 1, 21, 0, 0, 0); // 00:00 01.01 МСК
        return now >= newYearMoscow;
    }

    function setupFireworks() {
        var canvas = document.createElement('canvas');
        canvas.id = 'fireworksCanvas';
        canvas.style.position = 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.zIndex = '9999';
        canvas.style.pointerEvents = 'none';
        document.body.appendChild(canvas);

        var ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        var particles = [];

        function createFirework() {
            var x = Math.random() * canvas.width;
            var y = canvas.height;
            var color = ['#ff0000', '#00ff00', '#0000ff', '#ffffff', '#ffff00', '#00ffff', '#ff00ff'][Math.floor(Math.random() * 7)];

            for (var i = 0; i < 50; i++) {
                particles.push({
                    x: x,
                    y: y,
                    vx: Math.random() * 5 - 2.5,
                    vy: Math.random() * -15 - 5,
                    age: 0,
                    color: color
                });
            }
        }

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(function(p, index) {
                ctx.beginPath();
                ctx.arc(p.x, p.y, 3, 0, Math.PI * 2, false);
                ctx.fillStyle = p.color;
                ctx.fill();

                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.1;
                p.age++;

                if (p.age > 100) {
                    particles.splice(index, 1);
                }
            });
        }

        setInterval(createFirework, 1000);
        setInterval(draw, 16);
    }

    // Проверяем каждую минуту
    var checkInterval = setInterval(function() {
        if (checkNewYear()) {
            clearInterval(checkInterval);
            setupFireworks();
        }
    }, 60000);
})();