// ==UserScript==
// @name         Emoji Hit Tracker
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  我说君子六艺，有没有懂的
// @license MIT
// @author       Ratatatata
// @match        https://www.milkywayidle.com/*
// @match        https://test.milkywayidle.com/*
// @icon         https://www.milkywayidle.com/favicon.svg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535485/Emoji%20Hit%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/535485/Emoji%20Hit%20Tracker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 鸡蛋图片
    const emojiImg1 = new Image();
    const emojiImg2 = new Image();
    const emojiImg3 = new Image();
    const emojiImg4 = new Image();
    const emojiImg5 = new Image();

    emojiImg1.src = 'https://tupian.li/images/2025/05/09/681df8331e01d.png';
    emojiImg2.src = 'https://tupian.li/images/2025/05/09/681df85629f50.png';
    emojiImg3.src = 'https://tupian.li/images/2025/05/09/681df8583d73e.webp';
    emojiImg4.src = 'https://tupian.li/images/2025/05/09/681df8584b8bc.webp';
    emojiImg5.src = 'https://tupian.li/images/2025/05/09/681df863d2c3b.png';

    const emojiImages = [
       emojiImg1,emojiImg2,emojiImg3,emojiImg4,emojiImg5
    ];

    // 创建全屏 Canvas
    const canvas = document.createElement('canvas');
    canvas.id = 'eggTrackerCanvas';
    Object.assign(canvas.style, { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 999 });
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
    resize(); window.addEventListener('resize', resize);

    // 抛物线鸡蛋类+抖动
    class EggProjectile {
        constructor(sx, sy, tx, ty, dmg, targetEl) {
            /*
            this.x = sx; this.y = sy; this.tx = tx; this.ty = ty; this.targetEl = targetEl; this.gravity = 0.3;
            const dx = tx - sx, dy = ty - sy, t = 60*5;
            this.vx = dx / t; this.vy =( dy / t - 0.5 * this.gravity * t);
            this.rot = 0;
            const minSize = 20, maxSize = 80, minDmg = 1, maxDmg = 1200;
            const ratio = Math.min(Math.max((dmg - minDmg) / (maxDmg - minDmg), 0), 1);
            this.size = ratio * (maxSize - minSize) + minSize;
            */

        this.x = sx; this.y = sy; this.tx = tx; this.ty = ty; this.targetEl = targetEl;
        this.gravity = 0.3; // 保持原版重力

        const dx = tx - sx;
        const dy = ty - sy;

        const horizontalSlowdownFactor = 1.8+Math.random()*0.4;

        const originalHorizontalTime = 60;
        const horizontalTime = originalHorizontalTime * horizontalSlowdownFactor;
        this.vx = dx / horizontalTime;

        const heightReductionFactor = 0.1+Math.random()*0.2;

        const verticalTime = horizontalTime;
        const peakTime = verticalTime / 2;
        const originalVy = dy / verticalTime - 0.5 * this.gravity * verticalTime;
        this.vy = originalVy * heightReductionFactor;
        this.gravity = this.gravity * heightReductionFactor;

        this.rot = 0;
        const minSize = 20, maxSize = 80, minDmg = 1, maxDmg = 1200;
        const ratio = Math.min(Math.max((dmg - minDmg) / (maxDmg - minDmg), 0), 1);
        this.size = ratio * (maxSize - minSize) + minSize;
        this.emojiType=emojiImages[ Math.floor(Math.random() * 5)];
        }
        update() {
            this.vy += this.gravity;
            this.x += this.vx;
            this.y += this.vy;
            this.rot += 0.05;
        }
        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rot);
            ctx.drawImage(this.emojiType, -this.size / 2, -this.size / 2, this.size, this.size);
            ctx.restore();
        }
        done() {
            return this.y > canvas.height || Math.hypot(this.x - this.tx, this.y - this.ty) < 20;
        }
    }

    let projectiles = [];
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = projectiles.length - 1; i >= 0; i--) {
            const p = projectiles[i];
            p.update();
            p.draw();
            if (p.done()) {
                // 命中抖动特效
                if (p.targetEl) {
                    const shakeAmt = Math.min(10, p.size / 4);
                    p.targetEl.animate([
                        { transform: 'translate(0,0)' },
                        { transform: `translate(-${shakeAmt}px,0)` },
                        { transform: `translate(${shakeAmt}px,0)` },
                        { transform: 'translate(0,0)' }
                    ], { duration: 200, iterations: 2, easing: 'ease-in-out' });
                }
                projectiles.splice(i, 1);
            }
        }
        requestAnimationFrame(animate);
    }
    animate();

    function center(el) {
        const r = el.getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    }

    // Websocket 劫持
    (function() {
        const desc = Object.getOwnPropertyDescriptor(MessageEvent.prototype, 'data');
        const orig = desc.get;
        desc.get = function() {
            const sock = this.currentTarget;
            const msg = orig.call(this);
            if (sock instanceof WebSocket && sock.url.includes('api.milkywayidle.com/ws')) {
                return handle(msg);
            }
            return msg;
        };
        Object.defineProperty(MessageEvent.prototype, 'data', desc);
    })();

    // 上一帧状态
    const prev = { pMP: [], mHP: [] };
    let autoIdx = 0;
    function handle(message) {
        let obj;
        try { obj = JSON.parse(message); } catch { return message; }
        if (obj.type === 'new_battle') {
            prev.pMP = obj.players.map(p => p.currentManapoints);
            prev.mHP = obj.monsters.map(m => m.currentHitpoints);
            autoIdx = 0;
        } else if (obj.type === 'battle_updated' && prev.mHP.length) {
            const pMap = obj.pMap, mMap = obj.mMap;
            // 检测施法者
            let caster = -1;
            Object.keys(pMap).forEach(i => {
                if (pMap[i].cMP < prev.pMP[i]) caster = +i;
                prev.pMP[i] = pMap[i].cMP;
            });
            const players = document.querySelectorAll('[class*="BattlePanel_playersArea"] [class*="CombatUnit_unit"]');
            const monsters = document.querySelectorAll('[class*="BattlePanel_monstersArea"] [class*="CombatUnit_unit"]');
            const playerCount = players.length;
            Object.keys(mMap).forEach(idx => {
                const i = +idx;
                const oldHP = prev.mHP[i], newHP = mMap[i].cHP;
                if (newHP < oldHP) {
                    const dmg = oldHP - newHP;
                    if (dmg > 0) {
                        const src = caster >= 0 ? caster : autoIdx % playerCount;
                        const fromEl = players[src], toEl = monsters[i];
                        if (fromEl && toEl) {
                            const s = center(fromEl), t = center(toEl);
                            projectiles.push(new EggProjectile(s.x, s.y, t.x, t.y, dmg, toEl));
                        }
                        if (caster < 0) autoIdx++;
                    }
                }
                prev.mHP[i] = newHP;
            });
        }
        return message;
    }
})();
