// ==UserScript==
// @name         Haxball Public Room Ball Trajectory (Safe Version)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Works in public Haxball rooms - predicts ball bounce trajectory on kick (compatible version)
// @match        https://www.haxball.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    let canvas, ctx, gameCanvas;
    let ball = { x: 0, y: 0, vx: 0, vy: 0 };
    let lastBall = { x: 0, y: 0 };
    let trail = [];
    let showTrail = false;
    const radius = 3;
    const dt = 1 / 60;
    const bounceLimit = 4;

    function predict(pos, vel, bounds) {
        let path = [];
        let bounces = 0;

        for (let i = 0; i < 300 && bounces < bounceLimit; i++) {
            pos.x += vel.x * dt;
            pos.y += vel.y * dt;

            if (pos.y < bounds.minY || pos.y > bounds.maxY) {
                vel.y *= -1;
                bounces++;
            }
            if (pos.x < bounds.minX || pos.x > bounds.maxX) {
                vel.x *= -1;
                bounces++;
            }

            path.push({ x: pos.x, y: pos.y });
        }
        return path;
    }

    function setupCanvas() {
        canvas = document.createElement('canvas');
        canvas.style.position = 'absolute';
        canvas.style.top = 0;
        canvas.style.left = 0;
        canvas.style.pointerEvents = 'none';
        canvas.style.zIndex = 9999;
        document.body.appendChild(canvas);
        ctx = canvas.getContext('2d');
        resize();
        window.addEventListener('resize', resize);
    }

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function drawTrail() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (!showTrail || trail.length < 2) return;

        ctx.beginPath();
        ctx.moveTo(trail[0].x, trail[0].y);
        for (let i = 1; i < trail.length; i++) {
            ctx.lineTo(trail[i].x, trail[i].y);
        }
        ctx.strokeStyle = 'lime';
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    function trackBall() {
        const ballElem = document.querySelector("canvas");
        if (!ballElem) return;

        const rect = ballElem.getBoundingClientRect();
        const center = {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
        };

        ball.vx = (center.x - lastBall.x);
        ball.vy = (center.y - lastBall.y);

        const speed = Math.sqrt(Math.pow(ball.vx, 2) + Math.pow(ball.vy, 2));
        if (speed > 2.5) {
            ball.x = center.x;
            ball.y = center.y;

            const bounds = {
                minX: rect.left + 30,
                maxX: rect.right - 30,
                minY: rect.top + 30,
                maxY: rect.bottom - 30
            };

            const scaleVel = 10;
            trail = predict(
                { x: ball.x, y: ball.y },
                { x: ball.vx * scaleVel, y: ball.vy * scaleVel },
                bounds
            );
            showTrail = true;

            setTimeout(() => {
                showTrail = false;
            }, 2500);
        }

        lastBall.x = center.x;
        lastBall.y = center.y;
    }

    setupCanvas();
    setInterval(() => {
        trackBall();
        drawTrail();
    }, 1000 / 60);
})();
