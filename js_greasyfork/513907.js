// ==UserScript==
// @name         掌心纵横四海-副本通用
// @namespace    http://fybgame.top/
// @version      1.0.3
// @description  进副本后再开这个脚本
// @author       fyb
// @match        http://wwvv.anxiusuo.com/wap/*
// @match        https://wwvv.anxiusuo.com/wap/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/513907/%E6%8E%8C%E5%BF%83%E7%BA%B5%E6%A8%AA%E5%9B%9B%E6%B5%B7-%E5%89%AF%E6%9C%AC%E9%80%9A%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/513907/%E6%8E%8C%E5%BF%83%E7%BA%B5%E6%A8%AA%E5%9B%9B%E6%B5%B7-%E5%89%AF%E6%9C%AC%E9%80%9A%E7%94%A8.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // 地图类，用于存储和处理地图信息
    class GameMap {
    constructor() {
        this.visitedMaps = new Set();
        this.currentPosition = { x: 0, y: 0 };
        this.mapGrid = {};
        this.dungeonType = this.detectDungeonType();
        this.checkDailyReset();
        this.loadMapData();
    }
    detectDungeonType() {
        const pageContent = document.getElementById('wap_class').textContent;
        // 根据页面内容判断副本类型
        const dungeonPatterns = {
            '温莎': ['温莎守卫', '温莎首领', '温莎(boss)'],
            '基德': ['基德'],
            '五行副本': ['五行阵'],
            // 可以继续添加其他副本的特征
        };

        for (const [dungeonKey, patterns] of Object.entries(dungeonPatterns)) {
            if (patterns.some(pattern => pageContent.includes(pattern))) {
                console.log('当前副本:', dungeonKey);
                return dungeonKey;
            }
        }

        return 'unknown'; // 未知副本类型
    }
 // 获取当前副本的存储键名
    getStorageKey() {
        return `gameMapData_${this.dungeonType}`;
    }

    // 获取当前副本的重置日期键名
    getResetDateKey() {
        return `lastResetDate_${this.dungeonType}`;
    }
    // 检查是否需要每日重置
    checkDailyReset() {
        try {
            const today = new Date().toDateString();
            const lastResetDate = localStorage.getItem(this.getResetDateKey());

            if (lastResetDate !== today) {
                console.log(`新的一天，重置${this.dungeonType}副本的地图数据`);
                localStorage.removeItem(this.getStorageKey());
                localStorage.setItem(this.getResetDateKey(), today);
            }
        } catch (error) {
            console.log('检查重置时出错：', error);
            this.reset();
        }
    }


    // 从localStorage加载地图数据
 loadMapData() {
        try {
            const savedData = localStorage.getItem(this.getStorageKey());
            if (savedData) {
                const data = JSON.parse(savedData);
                if (data && typeof data === 'object') {
                    this.visitedMaps = new Set(Array.isArray(data.visitedMaps) ? data.visitedMaps : []);
                    this.currentPosition = data.currentPosition || { x: 0, y: 0 };
                    this.mapGrid = data.mapGrid || {};
                }
            }
        } catch (error) {
            console.log('加载地图数据时出错：', error);
            this.reset();
        }
    }

        // 保存地图数据到localStorage
        saveMapData() {
        try {
            if (this.dungeonType === 'unknown') {
                console.log('未知副本类型，不保存数据');
                return;
            }
            const data = {
                visitedMaps: Array.from(this.visitedMaps),
                currentPosition: this.currentPosition,
                mapGrid: this.mapGrid
            };
            localStorage.setItem(this.getStorageKey(), JSON.stringify(data));
        } catch (error) {
            console.log('保存地图数据时出错：', error);
            this.reset();
        }
    }

        // 记录新的地图位置
        addMapLocation(mapName, direction) {
            const newPosition = { ...this.currentPosition };

            // 根据方向更新坐标
            switch(direction) {
                case '北': newPosition.y += 1; break;
                case '南': newPosition.y -= 1; break;
                case '东': newPosition.x += 1; break;
                case '西': newPosition.x -= 1; break;
            }

            // 生成地图坐标键
            const mapKey = `${newPosition.x},${newPosition.y}`;

            // 记录地图信息
            this.mapGrid[mapKey] = mapName;
            this.visitedMaps.add(mapKey);
            this.currentPosition = newPosition;

            this.saveMapData();
            return mapKey;
        }

        // 检查地图是否已访问
        isMapVisited(mapName, direction) {
            const potentialPosition = { ...this.currentPosition };

            switch(direction) {
                case '北': potentialPosition.y += 1; break;
                case '南': potentialPosition.y -= 1; break;
                case '东': potentialPosition.x += 1; break;
                case '西': potentialPosition.x -= 1; break;
            }

            const mapKey = `${potentialPosition.x},${potentialPosition.y}`;
            return this.visitedMaps.has(mapKey);
        }

        // 重置地图数据
 reset() {
        try {
            this.visitedMaps.clear();
            this.currentPosition = { x: 0, y: 0 };
            this.mapGrid = {};
            localStorage.removeItem(this.getStorageKey());
            localStorage.removeItem(this.getResetDateKey());
        } catch (error) {
            console.log('重置数据时出错：', error);
        }
    }
    }

    // 游戏控制器
    class GameController {
    constructor() {
        this.gameMap = new GameMap();
        this.attackInterval = null;
        // 输出当前副本信息
        console.log(`当前副本类型: ${this.gameMap.dungeonType}`);
        console.log(`使用存储键: ${this.gameMap.getStorageKey()}`);
    }

        // 随机延迟
        randomDelay(min, max) {
            min = Math.ceil(min * 10);
            max = Math.floor(max * 10);
            return (Math.floor(Math.random() * (max - min + 1)) + min) / 10;
        }

        // 攻击功能
        attack() {
            const attackLinks = document.querySelectorAll('a[href*="pk_info"]');
            if (attackLinks.length > 0) {
                attackLinks[0].click();
            }
        }

        // 处理战斗结束页面
        handleBattleEnd() {
            // 检查是否在战斗结束页面
            const pageContent = document.getElementById('wap_class').textContent;

                const returnLinks = Array.from(document.getElementsByTagName('a')).filter(a =>
                    a.textContent.includes('返回游戏')
                );

                if (returnLinks.length > 0) {
                    setTimeout(() => {
                        returnLinks[0].click();
                    }, this.randomDelay(700, 1200)); // 添加随机延迟
                    return true;
                }
            return false;
        }

        // 处理战斗页面
        handleBattlePage() {
            // 先检查是否在战斗结束页面
            if (this.handleBattleEnd()) {
                if (this.attackInterval) {
                    clearInterval(this.attackInterval);
                    this.attackInterval = null;
                }
                return;
            }
            // 如果不在战斗结束页面且没有攻击间隔，则开始攻击
            else{
                if (!this.attackInterval) {
                    this.attackInterval = setTimeout(() => this.attack(), this.randomDelay(800, 1200));
            }}


        }

        // 获取未访问的出口
        getUnvisitedExit() {
            const mapContent = document.getElementById('wap_class').innerHTML;
            const exitSection = mapContent.split('地图出口:')[1]?.split('<br')[1];
            if (!exitSection) return null;

            // 获取所有地图出口链接
            const exits = document.querySelectorAll('a[href*="map_get_into"]');
            for (let exit of exits) {
                // 跳过退出副本和入口链接
                if (exit.textContent.includes('退出副本') || exit.textContent.includes('入口')) {
                    continue;
                }
                // 获取该链接之前的文本内容来确定方向
                const prevText = exit.previousSibling?.textContent || '';
                const direction = prevText.replace(':', '').trim();
                if (!['东', '南', '西', '北'].includes(direction)) {
                    continue;
                }
                const mapName = exit.textContent.trim();
                if (!this.gameMap.isMapVisited(mapName, direction)) {
                    return { exit, direction, mapName };
                }
            }
            return null;
        }

        // 处理地图页面
        handleMapPage() {
            // 检查是否有怪物
            const monsters = document.querySelectorAll('a[href*="pk_get_into"]');
            if (monsters.length > 0) {
                setTimeout(() => {
                    monsters[0].click();
                }, this.randomDelay(700, 1200));
                return;
            }

            // 寻找未访问的出口
            const nextExit = this.getUnvisitedExit();
            if (nextExit) {
                this.gameMap.addMapLocation(nextExit.mapName, nextExit.direction);
                setTimeout(() => {
                    nextExit.exit.click();
                }, this.randomDelay(700, 1200));
            } else {
                // 所有出口都已访问，可以考虑重置或结束
                console.log('所有地图都已探索完毕');
                // this.gameMap.reset(); // 取消注释此行可以重置地图
            }
        }

        // 主控制循环
        start() {
            const currentUrl = window.location.href;

            if (currentUrl.includes('/wap/?pk')) {
                this.handleBattlePage();
            } else if (currentUrl.includes('/wap/?ck') || currentUrl.includes('/wap/?map')) {
                if (this.attackInterval) {
                    clearInterval(this.attackInterval);
                    this.attackInterval = null;
                }
                this.handleMapPage();
            }
        }
    }

    // 初始化并启动控制器
    const controller = new GameController();
    // 定期检查和处理游戏状态
    controller.start();
})();