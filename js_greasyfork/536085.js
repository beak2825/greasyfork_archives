// ==UserScript==
// @name         落雷
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  雷霆万钧！
// @author       TaichiSlippers (Modified by whosyourdaddy)
// @match        https://www.milkywayidle.com/*
// @match        https://test.milkywayidle.com/*
// @icon         https://www.milkywayidle.com/favicon.svg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536085/%E8%90%BD%E9%9B%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/536085/%E8%90%BD%E9%9B%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 页面可见性检测
    let isPageVisible = true;
    const visibilityChangeEvent = (() => {
        if (typeof document.hidden !== 'undefined') {
            return 'visibilitychange';
        } else if (typeof document.msHidden !== 'undefined') {
            return 'msvisibilitychange';
        } else if (typeof document.webkitHidden !== 'undefined') {
            return 'webkitvisibilitychange';
        }
        return null;
    })();

    const hiddenProp = (() => {
        if (typeof document.hidden !== 'undefined') {
            return 'hidden';
        } else if (typeof document.msHidden !== 'undefined') {
            return 'msHidden';
        } else if (typeof document.webkitHidden !== 'undefined') {
            return 'webkitHidden';
        }
        return null;
    })();

    if (visibilityChangeEvent && hiddenProp) {
        document.addEventListener(visibilityChangeEvent, () => {
            isPageVisible = !document[hiddenProp];
            console.log(`页面可见性变化: ${isPageVisible ? '可见' : '隐藏'}`);
        });
    }

    // 创建全屏 Canvas
    const canvas = document.createElement('canvas');
    canvas.id = 'eggTrackerCanvas';
    Object.assign(canvas.style, { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 999 });
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
    resize(); window.addEventListener('resize', resize);

    // ===== 复合特效类 =====
    class CombinedThunderEffect {
        constructor(canvas) {
            this.canvas = canvas;
            this.ctx = canvas.getContext('2d');
            this.thunders = [];
            this.particles = [];
            this.explosions = [];

            // 全局时间倍率
            this.timeScale = 1.2; //按需求修改 ←←←←←← timeScale > 1 会减慢所有动画（包括消失速度） timeScale < 1 会加速所有动画

            // 融合颜色配置
            this.lightningColors = [
                '#3B82F6', // 主蓝（千鸟）
                '#87CEFA', // 天蓝
                '#FFFFFF', // 白色
                '#DBEAFE', // 淡蓝
                '#1E40AF', // 深蓝
            ];

            // 爆炸颜色配置
            this.explosionColors = [
                '#3B82F6', // 蓝色
                '#2563EB', // 中蓝
                '#FFFFFF', // 白色
                '#93C5FD', // 浅蓝
            ];

            // 绑定事件处理函数
            this.animate = this.animate.bind(this);
            this.resize = this.resize.bind(this);

            // 监听窗口大小变化
            window.addEventListener('resize', this.resize);

            // 开始动画循环
            this.isPaused = false;
            this.lastTimestamp = 0;
            requestAnimationFrame(this.animate);
        }

        // 暂停/恢复渲染
        setPaused(paused) {
            this.isPaused = paused;
            if (!paused) {
                // 恢复时重置时间戳，避免大的时间跳跃
                this.lastTimestamp = 0;
                requestAnimationFrame(this.animate);
            }
            console.log(`特效渲染 ${paused ? '已暂停' : '已恢复'}`);
        }

        // 调整Canvas大小
        resize() {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        }

        // 创建复合特效
        createCombinedEffect(targetX, targetY, radius, intensity = 1, damage = 100) {
            // 如果页面不可见或渲染已暂停，不创建新特效
            if (!isPageVisible || this.isPaused) return;

            // 计算攻击范围
            const minX = Math.max(0, targetX - radius);
            const maxX = Math.min(this.canvas.width, targetX + radius);
            const minY = 0; // 从屏幕顶部开始
            const maxY = targetY;

            // 计算闪电数量
            const count = 10 + Math.floor(intensity * 8);//按需求修改 ←←←←←← 10为闪电数量

            // 生成闪电的时间间隔
            const interval = 2 / count;//按需求修改 ←←←←←←

            // 创建多道闪电

           for (var i = 0; i < count; i++) {
           const currentIsPageVisible = isPageVisible;
           setTimeout(() => {
        // 如果页面不可见或渲染已暂停，不创建新闪电
           if (!currentIsPageVisible || this.isPaused) return;
        // 随机闪电起点和终点
           const startX = minX + Math.random() * (maxX - minX);
           const startY = minY + Math.random() * (maxY * 0.3); // 从屏幕上方开始
           const endX = targetX - radius*0.7 + Math.random() * (radius*1.4);
           const endY = targetY - radius*0.5 + Math.random() * (radius);
        // 创建融合闪电
        const thunder = this.createCombinedLightning(startX, startY, endX, endY, damage);
        // 调整闪电参数
        thunder.alpha = 1;//1不透明 0透明
        thunder.fadeSpeed = 0.03 / this.timeScale;
    }, i * interval);
}

            // 创建中心主闪电
            setTimeout(() => {
                // 如果页面不可见或渲染已暂停，不创建新闪电
                if (!isPageVisible || this.isPaused) return;

                const thunder = this.createCombinedLightning(
                    targetX,
                    -50, // 从屏幕外开始
                    targetX,
                    targetY,
                    25, // 增加主闪电分段数    按需求修改 ←←←←←← 默认20分段
                    0.4, // 增加主闪电分支概率 按需求修改 ←←←←←← 默认40%概率分支
                    3, // 增加主闪电分支层级   按需求修改 ←←←←←← 默认层级3
                    damage
                );

                // 调整主闪电参数
                thunder.alpha = 1; //1不透明 0透明
                thunder.fadeSpeed = 0.04 / this.timeScale;

                // 创建中心爆炸效果
                const explosion = this.createCombinedExplosion(targetX, targetY, 40 + Math.min(60, 15 * intensity), damage);

                // 创建千鸟风格粒子
                this.createChidoriParticles(targetX, targetY, damage);
            }, 1); // 延迟时间
        }

        // 创建融合闪电
        createCombinedLightning(startX, startY, endX, endY, segments = 15, branchChance = 0.2, branchLevel = 2, damage = 100) {
            const thunder = {
                startX,
                startY,
                endX,
                endY,
                segments,
                branchChance,
                branchLevel,
                alpha: 1,
                fadeSpeed: 0.05,
                damage,
                color: this.lightningColors[Math.floor(Math.random() * this.lightningColors.length)],
                branches: [],
                isMain: Math.random() < 0.4, // 40%概率出现主闪电 按需求修改 ←←←←←←
            };

            // 生成主闪电路径
            thunder.points = this.generateCombinedLightningPath(startX, startY, endX, endY, segments);

            // 生成分支闪电
            if (branchLevel > 0) {
                this.generateCombinedBranches(thunder, branchLevel);
            }

            this.thunders.push(thunder);
            return thunder;
        }

        // 生成融合闪电路径
        generateCombinedLightningPath(startX, startY, endX, endY, segments) {
            const points = [{ x: startX, y: startY }];
            const dx = endX - startX;
            const dy = endY - startY;
            const totalLength = Math.sqrt(dx * dx + dy * dy);
            const segmentLength = totalLength / segments;
            const angle = Math.atan2(dy, dx);

            // 生成中间点
            for (let i = 1; i < segments; i++) {
                const posOnLine = i / segments;
                const baseX = startX + dx * posOnLine;
                const baseY = startY + dy * posOnLine;

                // 添加随机偏移
                const offset = (Math.random() - 0.5) * totalLength * 0.1 * (1 - posOnLine);
                const perpAngle = angle + Math.PI / 2;

                // 千鸟风格的不规则偏移
                const zigzagOffset = (Math.random() - 0.5) * totalLength * 0.08 * (1 - posOnLine);

                const x = baseX + Math.cos(perpAngle) * offset + Math.sin(angle) * zigzagOffset;
                const y = baseY + Math.sin(perpAngle) * offset + Math.cos(angle) * zigzagOffset;

                points.push({ x, y });
            }

            points.push({ x: endX, y: endY });
            return points;
        }

        // 生成分支闪电
        generateCombinedBranches(thunder, branchLevel) {
            const points = thunder.points;
            const branchLengthFactor = 0.5;

            // 从主路径上选择一些点作为分支起点
            const branchPoints = [];
            for (let i = 1; i < points.length - 2; i += 2) {
                if (Math.random() < thunder.branchChance) {
                    branchPoints.push(i);
                }
            }

            // 为每个分支点创建分支
            for (const idx of branchPoints) {
                const startPoint = points[idx];
                const endPoint = points[idx + 1];

                // 计算分支方向
                const angle = Math.atan2(endPoint.y - startPoint.y, endPoint.x - startPoint.x);
                const branchAngle = angle + (Math.random() - 0.5) * Math.PI / 2;
                const branchLength = Math.sqrt(
                    Math.pow(endPoint.x - startPoint.x, 2) +
                    Math.pow(endPoint.y - startPoint.y, 2)
                ) * branchLengthFactor;

                const branchEndX = startPoint.x + Math.cos(branchAngle) * branchLength;
                const branchEndY = startPoint.y + Math.sin(branchAngle) * branchLength;

                // 创建分支
                const branch = {
                    startX: startPoint.x,
                    startY: startPoint.y,
                    endX: branchEndX,
                    endY: branchEndY,
                    segments: Math.max(3, Math.floor(thunder.segments * 0.5)),
                    alpha: 0.8,
                    color: thunder.color,
                    points: this.generateCombinedLightningPath(startPoint.x, startPoint.y, branchEndX, branchEndY, Math.max(3, Math.floor(thunder.segments * 0.5))),
                    branches: []
                };

                // 递归生成子分支
                if (branchLevel > 1) {
                    this.generateCombinedBranches(branch, branchLevel - 1);
                }

                thunder.branches.push(branch);
            }
        }

        // 创建融合爆炸效果
        createCombinedExplosion(x, y, size, damage) {
            const explosion = {
                x,
                y,
                size,
                maxSize: size * 2,
                alpha: 1,
                fadeSpeed: 0.05 / this.timeScale,
                color: this.explosionColors[Math.floor(Math.random() * this.explosionColors.length)],
                damage
            };

            this.explosions.push(explosion);

            // 创建爆炸粒子
            this.createCombinedExplosionParticles(x, y, size, damage);

            return explosion;
        }

        // 创建融合爆炸粒子
        createCombinedExplosionParticles(x, y, size, damage) {
            // 如果页面不可见或渲染已暂停，不创建新粒子
            if (!isPageVisible || this.isPaused) return;

            // 雷霆风格粒子
            const thunderParticleCount = 20 + Math.floor(Math.random() * 10);
            for (let i = 0; i < thunderParticleCount; i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = 1 + Math.random() * 3;
                const particle = {
                    x,
                    y,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    size: 1.5 + Math.random() * 2,
                    alpha: 1,
                    fadeSpeed: 0.03 / this.timeScale,
                    color: this.explosionColors[Math.floor(Math.random() * this.explosionColors.length)],
                    type: 'thunder'
                };
                this.particles.push(particle);
            }

            // 千鸟风格粒子
            const chidoriParticleCount = Math.min(100, damage / 2);
            for (let i = 0; i < chidoriParticleCount; i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = 0.5 + Math.random() * 2;
                const particle = {
                    x,
                    y,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    size: 0.8 + Math.random(),
                    alpha: 1,
                    fadeSpeed: 0.02 / this.timeScale,
                    color: this.lightningColors[Math.floor(Math.random() * this.lightningColors.length)],
                    type: 'chidori'
                };
                this.particles.push(particle);
            }
        }

        // 创建千鸟风格粒子
        createChidoriParticles(x, y, damage) {
            // 如果页面不可见或渲染已暂停，不创建新粒子
            if (!isPageVisible || this.isPaused) return;

            const particleCount = Math.min(150, damage);
            for (let i = 0; i < particleCount; i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = 1 + Math.random() * 2;
                const size = 0.8 + Math.random();

                this.particles.push({
                    x, y,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed,
                    size,
                    alpha: 1,
                    fadeSpeed: 0.02 / this.timeScale,
                    color: this.lightningColors[Math.floor(Math.random() * this.lightningColors.length)],
                    type: 'chidori'
                });
            }
        }

        // 绘制融合闪电
        drawLightning(lightning) {
            if (lightning.alpha <= 0) return;

            const points = lightning.points;

            // 绘制主路径
            this.ctx.beginPath();
            this.ctx.moveTo(points[0].x, points[0].y);
            for (let i = 1; i < points.length; i++) {
                this.ctx.lineTo(points[i].x, points[i].y);
            }

            // 根据闪电强度调整线条粗细
            const baseWidth = lightning.isMain ? // 判断是否为主闪电（从天而降的核心闪电）
                2.5 + Math.min(3, lightning.damage / 150) ://按需求修改 ←←←←←← //主闪电的线条宽度计算：基础值2.5px + 最小化后的伤害比例（伤害/150，最高3px） 基础宽度越大视觉上更粗更明显
                1.5 + Math.min(2, lightning.damage / 300);//按需求修改 ←←←←←←// 普通闪电的线条宽度计算：基础值1.5px + 最小化后的伤害比例（伤害/300，最高2px）

            // 主闪电使用多层渲染增强视觉效果
            if (lightning.isMain) {
                // 外层光晕
                this.ctx.strokeStyle = this.getAlphaColor('#DBEAFE', lightning.alpha * 0.3);
                this.ctx.lineWidth = baseWidth * 2.5;
                this.ctx.stroke();

                // 中层
                this.ctx.strokeStyle = this.getAlphaColor('#93C5FD', lightning.alpha * 0.6);
                this.ctx.lineWidth = baseWidth * 1.5;
                this.ctx.stroke();
            }

            // 内层核心
            this.ctx.strokeStyle = this.getAlphaColor(lightning.color, lightning.alpha);
            this.ctx.lineWidth = baseWidth;
            this.ctx.stroke();

            // 白色高光
            this.ctx.strokeStyle = this.getAlphaColor('#FFFFFF', lightning.alpha * 0.8);
            this.ctx.lineWidth = baseWidth * 0.5;
            this.ctx.stroke();

            // 绘制分支
            for (const branch of lightning.branches) {
                this.drawLightning(branch);
            }
        }

        // 绘制融合爆炸
        drawExplosion(explosion) {
            if (explosion.alpha <= 0) return;

            // 爆炸扩展然后收缩
            if (explosion.size < explosion.maxSize) {
                explosion.size += explosion.maxSize * 0.03 / this.timeScale;
            }

            // 绘制爆炸光圈
            this.ctx.beginPath();
            this.ctx.arc(explosion.x, explosion.y, explosion.size, 0, Math.PI * 2);

            const gradient = this.ctx.createRadialGradient(
                explosion.x, explosion.y, 0,
                explosion.x, explosion.y, explosion.size
            );

            // 爆炸核心使用更亮的颜色
            const coreColor = this.getAlphaColor(
                explosion.color === '#FFFFFF' ? '#DBEAFE' : explosion.color,
                explosion.alpha * 0.9
            );

            gradient.addColorStop(0, coreColor);
            gradient.addColorStop(1, this.getAlphaColor(explosion.color, 0));

            this.ctx.fillStyle = gradient;
            this.ctx.fill();

            // 绘制冲击波
            this.ctx.beginPath();
            this.ctx.arc(explosion.x, explosion.y, explosion.size * 1.2, 0, Math.PI * 2);

            const shockGradient = this.ctx.createRadialGradient(
                explosion.x, explosion.y, explosion.size * 1.1,
                explosion.x, explosion.y, explosion.size * 1.2
            );

            shockGradient.addColorStop(0, this.getAlphaColor('#DBEAFE', explosion.alpha * 0.3));
            shockGradient.addColorStop(1, this.getAlphaColor('#DBEAFE', 0));

            this.ctx.strokeStyle = shockGradient;
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
        }

        // 绘制粒子
        drawParticle(particle) {
            if (particle.alpha <= 0) return;

            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);

            // 不同类型的粒子使用不同的绘制方式
            if (particle.type === 'chidori') {
                // 千鸟粒子添加辉光效果
                const gradient = this.ctx.createRadialGradient(
                    particle.x, particle.y, 0,
                    particle.x, particle.y, particle.size * 2
                );

                gradient.addColorStop(0, this.getAlphaColor(particle.color, particle.alpha));
                gradient.addColorStop(1, this.getAlphaColor(particle.color, 0));

                this.ctx.fillStyle = gradient;
            } else {
                this.ctx.fillStyle = this.getAlphaColor(particle.color, particle.alpha);
            }

            this.ctx.fill();
        }

        // 更新闪电
        updateLightning(lightning) {
            lightning.alpha -= lightning.fadeSpeed;

            // 更新分支
            for (let i = lightning.branches.length - 1; i >= 0; i--) {
                const branch = lightning.branches[i];
                this.updateLightning(branch);
                if (branch.alpha <= 0) {
                    lightning.branches.splice(i, 1);
                }
            }
        }

        // 更新爆炸
        updateExplosion(explosion) {
            explosion.alpha -= explosion.fadeSpeed;
        }

        // 更新粒子
        updateParticle(particle) {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.alpha -= particle.fadeSpeed;
        }

        // 颜色工具函数 - 添加透明度
        getAlphaColor(color, alpha) {
            // 处理rgb和rgba格式
            if (color.startsWith('rgba')) {
                return color.replace(/rgba\(([^,]+,[^,]+,[^,]+),[^)]+\)/, `rgba($1,${alpha})`);
            } else if (color.startsWith('rgb')) {
                return color.replace(/rgb\(([^)]+)\)/, `rgba($1,${alpha})`);
            } else if (color.startsWith('#')) {
                // 将#RGB或#RGBA转换为rgba
                let r, g, b;
                if (color.length === 4) {
                    r = parseInt(color.charAt(1) + color.charAt(1), 16);
                    g = parseInt(color.charAt(2) + color.charAt(2), 16);
                    b = parseInt(color.charAt(3) + color.charAt(3), 16);
                } else if (color.length === 7) {
                    r = parseInt(color.substring(1, 3), 16);
                    g = parseInt(color.substring(3, 5), 16);
                    b = parseInt(color.substring(5, 7), 16);
                }
                return `rgba(${r},${g},${b},${alpha})`;
            }
            return color;
        }

        // 动画循环
        animate(timestamp) {
            // 如果页面不可见或渲染已暂停，跳过渲染但保持动画循环
            if (!isPageVisible || this.isPaused) {
                this.lastTimestamp = 0;
                requestAnimationFrame(this.animate);
                return;
            }

            // 计算时间增量
            if (!this.lastTimestamp) {
                this.lastTimestamp = timestamp;
            }
            const deltaTime = (timestamp - this.lastTimestamp) / 1000;
            this.lastTimestamp = timestamp;

            // 清除画布
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            // 更新和绘制闪电
            for (let i = this.thunders.length - 1; i >= 0; i--) {
                const thunder = this.thunders[i];
                this.updateLightning(thunder);
                this.drawLightning(thunder);

                if (thunder.alpha <= 0 && thunder.branches.length === 0) {
                    this.thunders.splice(i, 1);
                }
            }

            // 更新和绘制爆炸
            for (let i = this.explosions.length - 1; i >= 0; i--) {
                const explosion = this.explosions[i];
                this.updateExplosion(explosion);
                this.drawExplosion(explosion);

                if (explosion.alpha <= 0) {
                    this.explosions.splice(i, 1);
                }
            }

            // 更新和绘制粒子
            for (let i = this.particles.length - 1; i >= 0; i--) {
                const particle = this.particles[i];
                this.updateParticle(particle);
                this.drawParticle(particle);

                if (particle.alpha <= 0) {
                    this.particles.splice(i, 1);
                }
            }

            // 继续动画循环
            requestAnimationFrame(this.animate);
        }
    }

    // 计算元素中心位置
    function center(el) {
        const r = el.getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    }

    // 创建复合特效实例
    const combinedEffect = new CombinedThunderEffect(canvas);

    // 监听页面可见性变化，控制特效渲染
    if (visibilityChangeEvent && hiddenProp) {
        document.addEventListener(visibilityChangeEvent, () => {
            if (document[hiddenProp]) {
                combinedEffect.setPaused(true);
            } else {
                combinedEffect.setPaused(false);
            }
        });
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

                            // 根据伤害值计算攻击强度（控制闪电数量、粗细等）
                            // 公式：伤害 / 1000，强度上限为5
                            // 例如：伤害1000对应强度1，伤害5000对应强度5（超过5000伤害强度不再增加）
                            // 可按需更改 👇
                            const intensity = Math.min(5, dmg / 1000);//按需求修改 ←←←←←←


                            // 计算攻击范围（像素）
                            // 基础范围60px，加上最小化后的伤害比例（伤害 / 5），但最多叠加150px
                            // 可按需更改 👇 500伤害可以获得60+100=160的范围像素，伤害超过750到达150px上限
                            const radius = 60 + Math.min(150, dmg / 5);//按需求修改 ←←←←←←

                            // 创建融合特效
                            combinedEffect.createCombinedEffect(t.x, t.y, radius, intensity, dmg);
                        }
                        if (caster < 0) autoIdx++;
                    }
                }
                prev.mHP[i] = newHP;
            });
        }
        return message;
    }

    // 动画循环
    let deltaTime = 0;
    let lastTime = 0;
    function animate(timestamp) {
        deltaTime = (timestamp - lastTime) / 1000;
        lastTime = timestamp;

        requestAnimationFrame(animate);
    }

    animate(0);
})();