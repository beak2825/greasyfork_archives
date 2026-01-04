// ==UserScript==
// @name         Haxball 上帝模式 - 终极离谱版
// @namespace    http://tampermonkey.net/
// @version      3.14
// @description  完全掌控Haxball物理规则，成为球场上帝！
// @author       hgyann
// @match        https://www.haxball.com/*
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/544748/Haxball%20%E4%B8%8A%E5%B8%9D%E6%A8%A1%E5%BC%8F%20-%20%E7%BB%88%E6%9E%81%E7%A6%BB%E8%B0%B1%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/544748/Haxball%20%E4%B8%8A%E5%B8%9D%E6%A8%A1%E5%BC%8F%20-%20%E7%BB%88%E6%9E%81%E7%A6%BB%E8%B0%B1%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ===== 宇宙规则修改器 =====
    unsafeWindow.Physics = {
        gravity: 0,                     // 关闭重力
        ballFriction: 0,                // 球无摩擦力
        playerSpeed: 999,               // 玩家超音速
        ballMaxSpeed: Infinity,         // 球速无上限
        collisionDisabled: true,        // 关闭碰撞
        timeWarp: 1,                    // 时间流速控制
        enableAntiGravity: false,       // 反重力模式
        enableBlackHole: false,         // 黑洞模式
        enableRainbowTrail: true,       // 彩虹轨迹
        enableBallCloning: false        // 球分身术
    };

    // ===== 上帝控制面板 =====
    const divinePanel = document.createElement('div');
    divinePanel.style = `
        position: fixed;
        top: 10px;
        left: 10px;
        background: rgba(0,0,0,0.8);
        color: white;
        padding: 15px;
        border-radius: 10px;
        z-index: 999999;
        font-family: Arial;
        max-width: 300px;
        box-shadow: 0 0 20px purple;
    `;
    divinePanel.innerHTML = `
        <h2 style="color: gold; margin-top: 0;">⚡ Haxball 上帝控制台 ⚡</h2>
        <div>
            <label style="display: block; margin: 10px 0;">
                <input type="checkbox" id="godMode"> 上帝模式 (完全无敌)
            </label>
            <label style="display: block; margin: 10px 0;">
                <input type="checkbox" id="ballControl"> 意念控球
            </label>
            <label style="display: block; margin: 10px 0;">
                <input type="checkbox" id="rainbowTrail" checked> 彩虹轨迹
            </label>
            <label style="display: block; margin: 10px 0;">
                <input type="checkbox" id="infiniteBoost"> 无限加速
            </label>
            <label style="display: block; margin: 10px 0;">
                <input type="checkbox" id="blackHole"> 黑洞模式
            </label>
            <label style="display: block; margin: 10px 0;">
                <input type="checkbox" id="ballClone"> 球分身术
            </label>
            <div style="margin: 15px 0;">
                <button id="bigBang" style="background: red; color: white; border: none; padding: 8px; border-radius: 5px;">宇宙大爆炸</button>
                <button id="reset" style="background: #333; color: white; border: none; padding: 8px; border-radius: 5px; margin-left: 10px;">重置物理</button>
            </div>
            <div>
                <input type="range" id="timeWarp" min="0.1" max="5" step="0.1" value="1" style="width: 100%;">
                <div>时间流速: <span id="timeValue">1x</span></div>
            </div>
        </div>
    `;
    document.body.appendChild(divinePanel);

    // ===== 神圣变量 =====
    let divineIntervention = {
        ball: null,
        balls: [],
        players: [],
        originalPhysics: {},
        godMode: false,
        mouseControl: false,
        rainbowColors: ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3'],
        colorIndex: 0
    };

    // ===== 神迹初始化 =====
    function initDivinePowers() {
        // 保存原始物理规则
        divineIntervention.originalPhysics = {...unsafeWindow.Physics};

        // 设置控制面板事件
        document.getElementById('godMode').addEventListener('change', function(e) {
            divineIntervention.godMode = e.target.checked;
            unsafeWindow.Physics.collisionDisabled = e.target.checked;
        });

        document.getElementById('ballControl').addEventListener('change', function(e) {
            divineIntervention.mouseControl = e.target.checked;
            if (e.target.checked) {
                document.addEventListener('mousemove', moveBallWithMind);
            } else {
                document.removeEventListener('mousemove', moveBallWithMind);
            }
        });

        document.getElementById('rainbowTrail').addEventListener('change', function(e) {
            unsafeWindow.Physics.enableRainbowTrail = e.target.checked;
        });

        document.getElementById('infiniteBoost').addEventListener('change', function(e) {
            unsafeWindow.Physics.playerSpeed = e.target.checked ? 9999 : 999;
        });

        document.getElementById('blackHole').addEventListener('change', function(e) {
            unsafeWindow.Physics.enableBlackHole = e.target.checked;
            if (e.target.checked) createBlackHole();
        });

        document.getElementById('ballClone').addEventListener('change', function(e) {
            unsafeWindow.Physics.enableBallCloning = e.target.checked;
            if (e.target.checked) cloneBall();
        });

        document.getElementById('timeWarp').addEventListener('input', function(e) {
            unsafeWindow.Physics.timeWarp = parseFloat(e.target.value);
            document.getElementById('timeValue').textContent = `${e.target.value}x`;
        });

        document.getElementById('bigBang').addEventListener('click', function() {
            cosmicBigBang();
        });

        document.getElementById('reset').addEventListener('click', function() {
            unsafeWindow.Physics = {...divineIntervention.originalPhysics};
        });

        // 开始神圣监视
        setInterval(divineSurveillance, 16);
    }

    // ===== 神圣功能 =====
    function moveBallWithMind(e) {
        if (divineIntervention.ball) {
            divineIntervention.ball.x = e.clientX;
            divineIntervention.ball.y = e.clientY;
            divineIntervention.ball.vx = 0;
            divineIntervention.ball.vy = 0;
        }
    }

    function createBlackHole() {
        const blackHole = document.createElement('div');
        blackHole.style = `
            position: absolute;
            width: 50px;
            height: 50px;
            background: radial-gradient(circle at center, #000 0%, #333 70%, transparent 100%);
            border-radius: 50%;
            box-shadow: 0 0 30px darkred;
            z-index: 99999;
            pointer-events: none;
        `;
        blackHole.id = 'divineBlackHole';
        document.body.appendChild(blackHole);

        // 随机移动黑洞
        setInterval(() => {
            blackHole.style.left = `${Math.random() * window.innerWidth}px`;
            blackHole.style.top = `${Math.random() * window.innerHeight}px`;
        }, 3000);

        // 吸引所有物体
        setInterval(() => {
            if (divineIntervention.ball) {
                const bhRect = blackHole.getBoundingClientRect();
                const bhCenter = {
                    x: bhRect.left + bhRect.width / 2,
                    y: bhRect.top + bhRect.height / 2
                };

                const dx = bhCenter.x - divineIntervention.ball.x;
                const dy = bhCenter.y - divineIntervention.ball.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 500) {
                    const force = 100000 / (distance * distance);
                    divineIntervention.ball.vx += dx / distance * force;
                    divineIntervention.ball.vy += dy / distance * force;
                }
            }
        }, 16);
    }

    function cloneBall() {
        if (divineIntervention.ball) {
            const newBall = {...divineIntervention.ball};
            newBall.id = `ball-clone-${Date.now()}`;
            divineIntervention.balls.push(newBall);
            
            // 创建视觉球体
            const visualBall = document.createElement('div');
            visualBall.style = `
                position: absolute;
                width: 20px;
                height: 20px;
                background: radial-gradient(circle at center, white, ${divineIntervention.rainbowColors[divineIntervention.colorIndex]});
                border-radius: 50%;
                z-index: 9999;
                pointer-events: none;
                transform: translate(-10px, -10px);
            `;
            visualBall.id = newBall.id;
            document.body.appendChild(visualBall);
            
            divineIntervention.colorIndex = (divineIntervention.colorIndex + 1) % divineIntervention.rainbowColors.length;
        }
    }

    function cosmicBigBang() {
        // 创建爆炸效果
        for (let i = 0; i < 100; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.style = `
                    position: absolute;
                    width: 10px;
                    height: 10px;
                    background: ${divineIntervention.rainbowColors[i % divineIntervention.rainbowColors.length]};
                    border-radius: 50%;
                    left: ${window.innerWidth / 2}px;
                    top: ${window.innerHeight / 2}px;
                    z-index: 99999;
                    pointer-events: none;
                    transform: translate(-5px, -5px);
                    animation: explode ${Math.random() * 2 + 1}s forwards;
                `;
                
                document.head.insertAdjacentHTML('beforeend', `
                    <style>
                        @keyframes explode {
                            to {
                                left: ${Math.random() * window.innerWidth}px;
                                top: ${Math.random() * window.innerHeight}px;
                                opacity: 0;
                                transform: scale(3);
                            }
                        }
                    </style>
                `);
                
                document.body.appendChild(particle);
                setTimeout(() => particle.remove(), 2000);
            }, i * 20);
        }
        
        // 重置所有球的位置
        if (divineIntervention.ball) {
            divineIntervention.ball.x = window.innerWidth / 2;
            divineIntervention.ball.y = window.innerHeight / 2;
            divineIntervention.ball.vx = 0;
            divineIntervention.ball.vy = 0;
        }
        
        // 播放爆炸音效
        const boom = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-explosion-impact-1684.mp3');
        boom.volume = 0.5;
        boom.play();
    }

    function divineSurveillance() {
        // 寻找球和玩家
        if (!divineIntervention.ball) {
            const gameCanvas = document.querySelector('canvas');
            if (gameCanvas) {
                const gameCtx = gameCanvas.getContext('2d');
                
                // 劫持绘制方法
                const originalFillRect = gameCtx.fillRect;
                gameCtx.fillRect = function(x, y, width, height) {
                    // 检测球体
                    if (width === 10 && height === 10) {
                        const pixelData = gameCtx.getImageData(x + 5, y + 5, 1, 1).data;
                        if (pixelData[0] > 200 && pixelData[1] > 200 && pixelData[2] > 200) {
                            if (!divineIntervention.ball) {
                                divineIntervention.ball = {
                                    x: x + width / 2,
                                    y: y + height / 2,
                                    vx: 0,
                                    vy: 0
                                };
                                initDivinePowers();
                            } else {
                                divineIntervention.ball.x = x + width / 2;
                                divineIntervention.ball.y = y + height / 2;
                            }
                        }
                    }
                    originalFillRect.call(gameCtx, x, y, width, height);
                    
                    // 彩虹轨迹
                    if (unsafeWindow.Physics.enableRainbowTrail) {
                        gameCtx.fillStyle = divineIntervention.rainbowColors[divineIntervention.colorIndex];
                        divineIntervention.colorIndex = (divineIntervention.colorIndex + 1) % divineIntervention.rainbowColors.length;
                    }
                };
            }
        }
        
        // 更新克隆球位置
        divineIntervention.balls.forEach(ball => {
            if (Math.random() < 0.1) {
                ball.vx = (Math.random() - 0.5) * 50;
                ball.vy = (Math.random() - 0.5) * 50;
            }
            
            ball.x += ball.vx * unsafeWindow.Physics.timeWarp;
            ball.y += ball.vy * unsafeWindow.Physics.timeWarp;
            
            const visualBall = document.getElementById(ball.id);
            if (visualBall) {
                visualBall.style.left = `${ball.x}px`;
                visualBall.style.top = `${ball.y}px`;
            }
        });
    }

    // 等待游戏加载
    const divineObserver = new MutationObserver(() => {
        if (document.querySelector('canvas')) {
            divineObserver.disconnect();
            setTimeout(initDivinePowers, 1000);
        }
    });
    divineObserver.observe(document.body, { childList: true, subtree: true });
})();