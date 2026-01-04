// ==UserScript==
// @name         [iqrpg]iqRPG工具
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  宝石数据统计、战斗数据统计及胜率计算
// @author       Truth_Light
// @license      Truth_Light
// @match        *://*.iqrpg.com/*
// @grant        GM_registerMenuCommand

// @downloadURL https://update.greasyfork.org/scripts/504823/%5Biqrpg%5DiqRPG%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/504823/%5Biqrpg%5DiqRPG%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';
    (function(open) {
        XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
            this.addEventListener('readystatechange', function() {
                if (this.readyState === 4 && this.responseType === '' && this.responseText) {
                    try {
                        let response = JSON.parse(this.responseText);
                        handleResponse(url, response);
                    } catch (e) {
                        console.error('响应数据解析错误:', e);
                    }
                }
            });

            open.apply(this, arguments);
        };
    })(XMLHttpRequest.prototype.open);

    function handleResponse(url, response) {
        if (/jewelcrafting\.php$/.test(url)) {
            jewelcrafting_stats(response);
        } else if (/battle\.php$/.test(url)) {
            battle_stats(response);
        }
    }


    //宝石制作统计
    let search_progress = 1;
    let gem_data = {};
    function jewelcrafting_stats(obj) {
        if (obj.data) {
            const progress = obj.data.progress;
            const progressRequired = obj.data.progressRequired;

            if (progress === search_progress) {
                search_progress++;
                gem_data[progress] = {
                    提升: obj.data.statGainedAmount,
                    类型: obj.data.power
                };
            }

            if (progress === progressRequired) {
                search_progress = 1;

                if (Object.keys(gem_data).length === progressRequired) {
                    let bad = 0, normal = 0, perfer = 0;
                    for (let key in gem_data) {
                        let type = gem_data[key].类型;
                        if (type === 1) bad++;
                        else if (type === 2) normal++;
                        else if (type === 3) perfer++;
                    }

                    let iqdata = JSON.parse(localStorage.getItem('iqrpg_tools_data')) || {};
                    iqdata["宝石制作"] = iqdata["宝石制作"] || {};
                    iqdata["宝石制作"]["提升统计"] = iqdata["宝石制作"]["提升统计"] || {};

                    iqdata["宝石制作"]["提升统计"] = {
                        差劲: (iqdata["宝石制作"]["提升统计"]["差劲"] || 0) + bad,
                        普通: (iqdata["宝石制作"]["提升统计"]["普通"] || 0) + normal,
                        完美: (iqdata["宝石制作"]["提升统计"]["完美"] || 0) + perfer,
                    };
                    iqdata["宝石制作"]["提升统计"]["总计"] = (iqdata["宝石制作"]["提升统计"]["差劲"] || 0) + (iqdata["宝石制作"]["提升统计"]["普通"] || 0) + (iqdata["宝石制作"]["提升统计"]["完美"] || 0)
                    let total = iqdata["宝石制作"]["提升统计"]["总计"];
                    iqdata["宝石制作"]["提升概率"] = {
                        差劲: total > 0 ? ((iqdata["宝石制作"]["提升统计"]["差劲"] / total)*100).toFixed(1)+"%": 0,
                        普通: total > 0 ? ((iqdata["宝石制作"]["提升统计"]["普通"] / total)*100).toFixed(1)+"%": 0,
                        完美: total > 0 ? ((iqdata["宝石制作"]["提升统计"]["完美"] / total)*100).toFixed(1)+"%": 0
                    };
                    console.log("iqrpg_tools_data",iqdata)
                    localStorage.setItem('iqrpg_tools_data', JSON.stringify(iqdata));
                }

                gem_data = {};
            }
        }
    }


    let battle_updata_count = 0;
    function battle_stats(obj) {
        if (obj.data) {
            let iqdata = JSON.parse(localStorage.getItem('iqrpg_tools_data')) || {};
            iqdata["战斗"] = iqdata["战斗"] || {};
            iqdata["战斗"]["战斗统计"] = iqdata["战斗"]["战斗统计"] || {};
            let player_win_rate = iqdata["战斗"]["战斗统计"].胜率 || 0;
            iqdata["战斗"]["战斗统计"]["玩家"] = iqdata["战斗"]["战斗统计"]["玩家"] || {
                攻击次数: 0,
                命中次数: 0,
                未命中次数: 0,
                躲闪次数: 0,
                总计伤害: 0,
                最低生命值: 100
            };

            iqdata["战斗"]["战斗统计"]["怪物"] = iqdata["战斗"]["战斗统计"]["怪物"] || {
                怪物名称:"",
                攻击次数: 0,
                命中次数: 0,
                未命中次数: 0,
                总计伤害: 0
            };

            const player = obj.data.p1;
            const monster = obj.data.p2;

            if (iqdata["战斗"]["战斗统计"]["怪物"].怪物名称 !== monster.name) {
                battle_updata_count = 0;
                player_win_rate = 0;
                iqdata["战斗"]["战斗统计"]["玩家"] = {
                    攻击次数: 0,
                    命中次数: 0,
                    未命中次数: 0,
                    躲闪次数: 0,
                    总计伤害: 0,
                    最低生命值: 100
                };

                iqdata["战斗"]["战斗统计"]["怪物"] = {
                    怪物名称:"",
                    攻击次数: 0,
                    命中次数: 0,
                    未命中次数: 0,
                    总计伤害: 0
                };
            }

            iqdata["战斗"]["战斗统计"]["玩家"].攻击次数 += (player.hits + player.missed);
            iqdata["战斗"]["战斗统计"]["玩家"].命中次数 += player.hits;
            iqdata["战斗"]["战斗统计"]["玩家"].未命中次数 += player.missed;
            iqdata["战斗"]["战斗统计"]["玩家"].躲闪次数 += player.dodged;
            iqdata["战斗"]["战斗统计"]["玩家"].总计伤害 += player.totalDamage;

            const currentHpPercentage = (player.hp / player.maxHp) * 100;
            iqdata["战斗"]["战斗统计"]["玩家"].最低生命值 = Math.min(iqdata["战斗"]["战斗统计"]["玩家"].最低生命值, currentHpPercentage);

            iqdata["战斗"]["战斗统计"]["怪物"].怪物名称 = monster.name;
            iqdata["战斗"]["战斗统计"]["怪物"].攻击次数 += (monster.hits + monster.missed + player.dodged);
            iqdata["战斗"]["战斗统计"]["怪物"].命中次数 += monster.hits;
            iqdata["战斗"]["战斗统计"]["怪物"].未命中次数 += monster.missed;
            iqdata["战斗"]["战斗统计"]["怪物"].总计伤害 += monster.totalDamage;

            const player_avg = iqdata["战斗"]["战斗统计"]["玩家"].总计伤害/iqdata["战斗"]["战斗统计"]["玩家"].命中次数;
            const player_acc = iqdata["战斗"]["战斗统计"]["玩家"].命中次数/iqdata["战斗"]["战斗统计"]["玩家"].攻击次数;
            const player_dodges = iqdata["战斗"]["战斗统计"]["玩家"].躲闪次数/(iqdata["战斗"]["战斗统计"]["玩家"].躲闪次数+iqdata["战斗"]["战斗统计"]["怪物"].命中次数);

            const monster_avg = iqdata["战斗"]["战斗统计"]["怪物"].总计伤害/iqdata["战斗"]["战斗统计"]["怪物"].命中次数;
            const monster_acc = (iqdata["战斗"]["战斗统计"]["怪物"].命中次数+iqdata["战斗"]["战斗统计"]["玩家"].躲闪次数)/iqdata["战斗"]["战斗统计"]["怪物"].攻击次数;

            const monster_hits_kill_player = Math.ceil(player.maxHp / monster_avg);
            const player_hits_kill_monster = Math.ceil(monster.maxHp / player_avg);
            const player_avg_damage_increase = (monster.maxHp / (player_hits_kill_monster - 1)) - player_avg;
            const player_avg_defence_increase = -((player.maxHp / (monster_hits_kill_player + 1)) - monster_avg);

            battle_updata_count++;
            if (battle_updata_count % 10 === 0) {
                player_win_rate = battle_rate(monster_hits_kill_player,player_hits_kill_monster,player_acc,(monster_acc*(1-player_dodges)),10000)
            }

            iqdata["战斗"]["战斗统计"].胜率 = player_win_rate;
            iqdata["战斗"]["战斗统计"].提升伤害 = player_avg_damage_increase;
            iqdata["战斗"]["战斗统计"].提升防御 = player_avg_defence_increase;


            if (document.querySelector("body > div > div.game > div.game-grid > div.main-section.main-game-section > div.main-section__body > div > div > div:nth-child(3) > table > tr:nth-child(4) > td > a")) {
                const targetEle = document.querySelector("body > div > div.game > div.game-grid > div.main-section.main-game-section > div.main-section__body > div > div").lastChild;
                if (targetEle) {
                    let battle_rate_div = document.querySelector("#display-data");

                    if (!battle_rate_div) {
                        battle_rate_div = document.createElement("div");
                        battle_rate_div.id = "display-data";
                        targetEle.parentNode.insertBefore(battle_rate_div, targetEle.nextSibling);
                    }

                    battle_rate_div.style.textAlign = "center";

                    battle_rate_div.innerHTML = `
            <p>胜率计算</p>
            <br>
            <p>胜率: ${(player_win_rate*100).toFixed(2)}%</p>
            <p>攻击增益: 你需要 ${player_hits_kill_monster} 次攻击才能击败敌人，要提高胜率，请增加平均伤害: ${formatNumber(player_avg_damage_increase)}</p>
            <p>防御增益: 你可以在 ${monster_hits_kill_player} 次攻击后死亡，要提高胜率，请减少平均受到的伤害: ${formatNumber(player_avg_defence_increase)}</p>
            <br>
            <p>数据统计</p>
            <br>
            <p>你总共造成了 ${formatNumber(iqdata["战斗"]["战斗统计"]["玩家"].总计伤害)} 点伤害，进行了 ${iqdata["战斗"]["战斗统计"]["玩家"].攻击次数} 次攻击，平均每次攻击造成 ${formatNumber(player_avg)} 点伤害，准确率为 ${(player_acc*100).toFixed(2)}%</p>
            <p>敌人每次攻击平均造成 ${formatNumber(monster_avg)} 点伤害，准确率为 ${(monster_acc*100).toFixed(2)}%，而你躲避了 ${(player_dodges*100).toFixed(2)}% 的攻击</p>
            <br>
            <button id="reset-battle-stats">重置战斗统计</button>
        `;
                    document.querySelector("#reset-battle-stats").addEventListener("click", resetBattleStats);
                }
            }

            localStorage.setItem('iqrpg_tools_data', JSON.stringify(iqdata));
        }
    }
    function resetBattleStats() {
        let iqdata = JSON.parse(localStorage.getItem('iqrpg_tools_data')) || {};
        iqdata["战斗"] = iqdata["战斗"] || {};
        iqdata["战斗"]["战斗统计"] = iqdata["战斗"]["战斗统计"] || {};

        iqdata["战斗"]["战斗统计"]["玩家"] = {
            攻击次数: 0,
            命中次数: 0,
            未命中次数: 0,
            躲闪次数: 0,
            总计伤害: 0,
            最低生命值: 100
        };

        iqdata["战斗"]["战斗统计"]["怪物"] = {
            怪物名称: "",
            攻击次数: 0,
            命中次数: 0,
            未命中次数: 0,
            总计伤害: 0
        };
        localStorage.setItem('iqrpg_tools_data', JSON.stringify(iqdata));
    }
    function battle_rate(player_hp, monster_hp, player_acc, monster_acc, n) {
        let wins = 0;

        for (let sim = 0; sim < n; sim++) {
            let playerHP = player_hp;
            let monsterHP = monster_hp;

            while (playerHP > 0 && monsterHP > 0) {
                if (Math.random() < player_acc) {
                    monsterHP--;
                }
                if (monsterHP <= 0) {
                    wins++;
                    break;
                }

                if (Math.random() < monster_acc) {
                    playerHP--;
                }
                if (playerHP <= 0) {
                    break;
                }
            }
        }

        return wins / n;
    }


    function formatNumber(num) {
        if (num === 0) return "0.00";

        const absNum = Math.abs(num);

        let formatted;
        if (absNum >= 1e13) {
            formatted = (num / 1e13).toFixed(2) + 't';
        } else if (absNum >= 1e10) {
            formatted = (num / 1e10).toFixed(2) + 'b';
        } else if (absNum >= 1e7) {
            formatted = (num / 1e6).toFixed(2) + 'm';
        } else if (absNum >= 1e4) {
            formatted = (num / 1e3).toFixed(2) + 'k';
        } else {
            formatted = num.toFixed(2);
        }

        return formatted;
    }


})();

