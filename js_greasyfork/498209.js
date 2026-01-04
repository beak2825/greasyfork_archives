// ==UserScript==
// @name         [银河奶牛]DPS显示 - DPS Display for Milky Way
// @namespace    destiny
// @version      1.03
// @description:en  Display DPS, modified from ponchain Ched's code
// @description:zh-CN 显示DPS，魔改自ponchain Ched佬的代码
// @author       Truth_Light
// @match        https://www.milkywayidle.com/*
// @grant        none
// @license      Truth_Light
// @description 显示DPS，魔改自ponchain Ched佬的代码
// @downloadURL https://update.greasyfork.org/scripts/498209/%5B%E9%93%B6%E6%B2%B3%E5%A5%B6%E7%89%9B%5DDPS%E6%98%BE%E7%A4%BA%20-%20DPS%20Display%20for%20Milky%20Way.user.js
// @updateURL https://update.greasyfork.org/scripts/498209/%5B%E9%93%B6%E6%B2%B3%E5%A5%B6%E7%89%9B%5DDPS%E6%98%BE%E7%A4%BA%20-%20DPS%20Display%20for%20Milky%20Way.meta.js
// ==/UserScript==

(function () {
    "use strict";
    // 代理 WebSocket
    const OriginalWebSocket = window.WebSocket;
    const handlerQueue = [];
    function MyWebSocket(url, protocols) {
        const ws = new OriginalWebSocket(url, protocols);
        ws.addEventListener("message", function (event) {
            const msgData = JSON.parse(event.data);
            handlerQueue.reduce((prev, handler) => {
                return handler(prev);
            }, msgData);
        });
        return ws;
    }
    window.WebSocket = MyWebSocket;

    let totalDamage = [];
    let totalDuration = 0;
    let startTime = null;
    let endTime = null;
    let monstersHP = [];
    let players = [];

    function formatNumber(num) {
        if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
        if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
        if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
        return num.toString();
    }

    const updatePlayerDPS = () => {
        const totalTime = totalDuration + ((endTime - startTime) / 1000); // 总时间，秒
        const dps = totalDamage.map((damage) => (totalTime ? Math.round(damage / totalTime) : 0));

        const playersContainer = document.querySelector('.BattlePanel_combatUnitGrid__2hTAM');
        if (playersContainer) {
            players.forEach((player, index) => {
                const playerElement = playersContainer.children[index];
                if (playerElement) {
                    const statusElement = playerElement.querySelector('.CombatUnit_status__3bH7W');
                    if (statusElement) {
                        let dpsElement = statusElement.querySelector('.dps-info');
                        if (!dpsElement) {
                            dpsElement = document.createElement('div');
                            dpsElement.className = 'dps-info';
                            statusElement.appendChild(dpsElement);
                        }
                        const formattedTotalDamage = formatNumber(totalDamage[index]);
                        dpsElement.textContent = `DPS: ${dps[index].toLocaleString()}(${formattedTotalDamage})`;
                    }
                }
            });
        }
    };

    const calculateDamage = (msgData) => {
        if (msgData.type === "new_battle") {
            if (startTime && endTime) {
                totalDuration += (endTime - startTime) / 1000;
            }
            startTime = Date.now();
            endTime = null;
            monstersHP = msgData.monsters.map((monster) => monster.currentHitpoints);
            players = msgData.players;
            if (!totalDamage.length) {
                totalDamage = new Array(players.length).fill(0);
            }
        } else if (msgData.type === "battle_updated" && monstersHP.length) {
            const mMap = msgData.mMap;
            monstersHP.forEach((mHP, mIndex) => {
                const monster = mMap[mIndex];
                if (monster) {
                    const playerIndices = Object.keys(msgData.pMap);
                    playerIndices.forEach((userIndex) => {
                        const hpDiff = mHP - monster.cHP;
                        if (hpDiff > 0) {
                            totalDamage[userIndex] += hpDiff;
                        }
                    });
                    monstersHP[mIndex] = monster.cHP;
                }
            });
            endTime = Date.now();
            updatePlayerDPS();
        } else if (msgData.type === "actions_updated") {
            monstersHP = [];
            startTime = null;
            endTime = null;
        }
    };

    handlerQueue.push(calculateDamage);
})();
