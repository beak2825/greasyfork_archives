// ==UserScript==
// @name               国服特色
// @namespace          http://github.com/impasse
// @version            0.15
// @match              https://uwuowo.mathi.moe/stats/raids
// @description         为 uwuowo 增加国服特色数值
// @description:zh-CN   为 uwuowo 增加国服特色数值
// @license            MIT
// @grant              none
// @run-at            document-start
// @downloadURL https://update.greasyfork.org/scripts/544524/%E5%9B%BD%E6%9C%8D%E7%89%B9%E8%89%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/544524/%E5%9B%BD%E6%9C%8D%E7%89%B9%E8%89%B2.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const enable_characteristic = !!localStorage.getItem('enable_characteristic');

    window.addEventListener('load', () => {
        const toggleCharacteristic = document.createElement('button');
        toggleCharacteristic.textContent = enable_characteristic ? '关闭国服特色' : '开启国服特色';
        toggleCharacteristic.style.position = 'fixed';
        toggleCharacteristic.style.top = '14px';
        toggleCharacteristic.style.right = '18px';
        toggleCharacteristic.style.zIndex = 1000;
        toggleCharacteristic.style.padding = '6px 10px';
        toggleCharacteristic.style.backgroundColor = '#5865f2';
        toggleCharacteristic.style.color = '#fff';
        toggleCharacteristic.style.border = 'none';
        toggleCharacteristic.style.fontSize = '13px';
        toggleCharacteristic.style.borderRadius = '5px';
        toggleCharacteristic.style.cursor = 'pointer';

        toggleCharacteristic.addEventListener('click', () => {
            if (enable_characteristic) {
                localStorage.removeItem('enable_characteristic');
                window.location.reload();
            } else {
                localStorage.setItem('enable_characteristic', true);
                window.location.reload();
            }
        });
        document.body.appendChild(toggleCharacteristic);
    });

    const originalFetch = window.fetch;

    const statsConfig = {
        "Drizzle": { multiplier: 1.045, name: "绵绵细雨" },
        "Wind Fury": { multiplier: 1.061, name: "狂风暴雨" },
        "Grace of the Empress": { multiplier: 1 * 1.08, name: "王后恩赐" },
        "Order of the Emperor": { multiplier: 1 * 1.05, name: "国王圣谕" },
        "Barrage Enhancement": { multiplier: 1.05, name: "炮击强化" },
        "Firepower Enhancement": { multiplier: 1.02, name: "火力强化" },
        "Recurrence": { multiplier: 1, name: "归元" },
        "True Courage": { multiplier: 1, name: "勇气激发" },
        "Berserker Technique": { multiplier: 1.06, name: "狂战士秘技" },
        "Mayhem": { multiplier: 1.06, name: "疯狂" },
        "Asura's Path": { multiplier: 1.03, name: "修罗之路" },
        "Brawl King Storm": { multiplier: 1.05, name: "拳王破天舞" },
        "Enhanced Weapon": { multiplier: 1.02, name: "强化武器" },
        "Pistoleer": { multiplier: 1.02 * 1.02, name: "手枪手" },
        "Remaining Energy": { multiplier: 1.047 * 1.022, name: "弥留之息" },
        "Surge": { multiplier: 1.047 * 1.022, name: "爆裂" },
        "Gravity Training": { multiplier: 1.134 * 0.965, name: "重力修练" },
        "Rage Hammer": { multiplier: 1.12 * 0.965, name: "愤怒之锤" },
        "Control": { multiplier: 1.04 * 1.08 * 0.96, name: "节制" },
        "Pinnacle": { multiplier: 1.04 * 1.08 * 0.96, name: "巅峰" },
        "Combat Readiness": { multiplier: 1.08, name: "战斗姿态" },
        "Lone Knight": { multiplier: 1.08, name: "孤独的骑士" },
        "Peacemaker": { multiplier: 1.02, name: "和平之光" },
        "Time to Hunt": { multiplier: 1.02, name: "狩猎时刻" },
        "Arthetinean Skill": { multiplier: 1.05, name: "阿尔泰因科技" },
        "Evolutionary Legacy": { multiplier: 1.08, name: "超同步核心" },
        "Judgment": { multiplier: 1, name: "裁决许可" },
        "Hunger": { multiplier: 1.12 * 0.975, name: "饥渴" },
        "Lunar Voice": { multiplier: 1.12 * 0.975, name: "月声" },
        "Shock Training": { multiplier: 1.04 * 1.058 * 0.98, name: "冲击修炼" },
        "Ultimate Skill: Taijutsu": { multiplier: 1.04 * 1.058 * 0.98, name: "极义：体术" },
        "Demonic Impulse": { multiplier: 1.08, name: "无尽冲动" },
        "Perfect Suppression": { multiplier: 1.05, name: "完美抑制" },
        "Death Strike": { multiplier: 1.06, name: "终结袭击" },
        "Loyal Companion": { multiplier: 1.06, name: "第二个伙伴" },
        "Predator": { multiplier: 1.03 * 1.03, name: "捕食者" },
        "Punisher": { multiplier: 1.03, name: "处决者" },
        "Igniter": { multiplier: 1.02, name: "点火" },
        "Reflux": { multiplier: 1.02, name: "环流" },
        "Full Moon Harvester": { multiplier: 1.03, name: "满月鬼门开" },
        "Night's Edge": { multiplier: 1.03, name: "晦朔边界" },
        "Energy Overflow": { multiplier: 1.02 * 1.056, name: "经脉打通" },
        "Robust Spirit": { multiplier: 1.02 * 1.056, name: "逆天之体" },
        "Deathblow": { multiplier: 1.12 * 0.95, name: "一击必杀" },
        "Esoteric Flurry": { multiplier: 1.06, name: "奥义乱舞" },
        "Communication Overflow": { multiplier: 1.053, name: "心有灵犀" },
        "Master Summoner": { multiplier: 1.053, name: "高阶召唤" },
        "Esoteric Skill Enhancement": { multiplier: 0.98 * 1.02 * 1.03, name: "奥义精通" },
        "First Intention": { multiplier: 0.98 * 1.02 * 1.03, name: "赤子之心" },
        "Ferality": { multiplier: 1 * 1.03, name: "野性" },
        "Phantom Beast Awakening": { multiplier: 1 * 1.03, name: "幻兽觉醒" },
        "Liberator": { multiplier: 1, name: "解放者" },
        "Shining Knight": { multiplier: 1, name: "光之骑士" },
        "Princess": { multiplier: 1, name: "公主骑" }
    };


    window.fetch = function (url, ...options) {
        return originalFetch.apply(this, [url, ...options])
            .then(response => {
                const clonedResponse = response.clone();

                if (url.startsWith('/api/stats/raids?boss') && !url.includes('support=true')) {
                    return clonedResponse.json().then(data => {
                        const newStats = data.stats.map(item => {
                            const config = statsConfig[item.spec];
                            if (config) {
                                if (enable_characteristic) {
                                    ['q1', 'q3', 'lowerWhisker', 'upperWhisker', 'max', 'median'].forEach(key => {
                                        item[key] = item[key] * config.multiplier;
                                    });

                                    item.topEncounters = item.topEncounters.map(encounter => {
                                        return {
                                            ...encounter,
                                            dps: encounter.dps * config.multiplier,
                                        };
                                    });
                                }

                                item.spec = config.name;
                            }
                            return item;
                        });
                        const newResponse = new Response(JSON.stringify({ ...data, stats: newStats }), {
                            status: response.status,
                            statusText: response.statusText,
                            headers: response.headers
                        });
                        Object.defineProperty(newResponse, 'url', {
                            value: response.url
                        });
                        return newResponse;
                    });
                } else if (url.startsWith('/api/stats/raids/combat-power')) {
                    return clonedResponse.json().then(data => {
                        const newData = data.map(item => {
                            const config = statsConfig[item.spec];
                            if (config) {
                                if (enable_characteristic) {
                                    item.avg = item.avg * config.multiplier;
                                }
                                item.spec = config.name;
                            }
                            return item;
                        });
                        const newResponse = new Response(JSON.stringify(newData), {
                            status: response.status,
                            statusText: response.statusText,
                            headers: response.headers
                        });
                        Object.defineProperty(newResponse, 'url', {
                            value: response.url
                        });
                        return newResponse;
                    });
                } else {
                    return response;
                }
            })
            .catch(error => {
                console.error('Fetch error:', error);
                throw error;
            });
    };
})();
