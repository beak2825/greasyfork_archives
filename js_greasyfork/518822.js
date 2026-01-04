// ==UserScript==
// @name         超苦逼冒险者修改last（基于 lichqwer）
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  修改游戏中的各项参数，基于 lichqwer 的原版脚本进行修改，提供更多便利
// @author       lbihhe
// @match        https://kubitionadvanture.sinaapp.com/
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// @originalAuthor lichqwer
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/518822/%E8%B6%85%E8%8B%A6%E9%80%BC%E5%86%92%E9%99%A9%E8%80%85%E4%BF%AE%E6%94%B9last%EF%BC%88%E5%9F%BA%E4%BA%8E%20lichqwer%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/518822/%E8%B6%85%E8%8B%A6%E9%80%BC%E5%86%92%E9%99%A9%E8%80%85%E4%BF%AE%E6%94%B9last%EF%BC%88%E5%9F%BA%E4%BA%8E%20lichqwer%EF%BC%89.meta.js
// ==/UserScript==
(function () {
    'use strict';

    // 检查所需对象是否存在
    if (typeof PLAYER_STATE_INIT === 'undefined' ||
        typeof PLACE_DATA === 'undefined' ||
        typeof BUILDING_DATA === 'undefined') {
        console.error("必要的数据对象未定义，脚本无法运行");
        return;
    }

    // 模块启用标志，从 GM_getValue 获取初始状态
    let isModuleOneEnabled = GM_getValue('moduleOneEnabled', true);
    let isModuleTwoEnabled = GM_getValue('moduleTwoEnabled', true);
    let isModuleThreeEnabled = GM_getValue('moduleThreeEnabled', true);
    let isModuleFourEnabled = GM_getValue('moduleFourEnabled', true);
    let isModuleFiveEnabled = GM_getValue('moduleFiveEnabled', true);
    let isModuleSixEnabled = GM_getValue('moduleSixEnabled', true);
    let isModuleSevenEnabled = GM_getValue('moduleSevenEnabled', true);

    // 菜单命令
    GM_registerMenuCommand("启用/禁用 玩家初始状态修改", toggleModuleOne);
    GM_registerMenuCommand("启用/禁用 采集点数据修改", toggleModuleTwo);
    GM_registerMenuCommand("启用/禁用 特殊采集点修改", toggleModuleThree);
    GM_registerMenuCommand("启用/禁用 建筑数据修改", toggleModuleFour);
    GM_registerMenuCommand("启用/禁用 建筑升级数据修改", toggleModuleFive);
    GM_registerMenuCommand("启用/禁用 技能数据修改", toggleModuleSix);
    GM_registerMenuCommand("启用/禁用 制作、科技和魔法数据修改", toggleModuleSeven);

    // 启用/禁用模块的切换函数
    function toggleModuleOne() {
        isModuleOneEnabled = !isModuleOneEnabled;
        GM_setValue('moduleOneEnabled', isModuleOneEnabled);
        console.log("玩家初始状态修改 " + (isModuleOneEnabled ? "启用" : "禁用"));
    }

    function toggleModuleTwo() {
        isModuleTwoEnabled = !isModuleTwoEnabled;
        GM_setValue('moduleTwoEnabled', isModuleTwoEnabled);
        console.log("采集点数据修改 " + (isModuleTwoEnabled ? "启用" : "禁用"));
    }

    function toggleModuleThree() {
        isModuleThreeEnabled = !isModuleThreeEnabled;
        GM_setValue('moduleThreeEnabled', isModuleThreeEnabled);
        console.log("特殊采集点修改 " + (isModuleThreeEnabled ? "启用" : "禁用"));
    }

    function toggleModuleFour() {
        isModuleFourEnabled = !isModuleFourEnabled;
        GM_setValue('moduleFourEnabled', isModuleFourEnabled);
        console.log("建筑数据修改 " + (isModuleFourEnabled ? "启用" : "禁用"));
    }

    function toggleModuleFive() {
        isModuleFiveEnabled = !isModuleFiveEnabled;
        GM_setValue('moduleFiveEnabled', isModuleFiveEnabled);
        console.log("建筑升级数据修改 " + (isModuleFiveEnabled ? "启用" : "禁用"));
    }

    function toggleModuleSix() {
        isModuleSixEnabled = !isModuleSixEnabled;
        GM_setValue('moduleSixEnabled', isModuleSixEnabled);
        console.log("技能数据修改 " + (isModuleSixEnabled ? "启用" : "禁用"));
    }

    function toggleModuleSeven() {
        isModuleSevenEnabled = !isModuleSevenEnabled;
        GM_setValue('moduleSevenEnabled', isModuleSevenEnabled);
        console.log("制作、科技和魔法数据修改 " + (isModuleSevenEnabled ? "启用" : "禁用"));
    }

    try {
        // 根据模块启用标志判断是否执行相应的模块

        // 模块一：玩家初始状态修改
        if (isModuleOneEnabled) {
            (function modifyPlayerState() {
                if (typeof PLAYER_STATE_INIT !== 'undefined') {
                    PLAYER_STATE_INIT['hp']['amount'] = 999;
                    PLAYER_STATE_INIT['full']['amount'] = 999;
                    PLAYER_STATE_INIT['moist']['amount'] = 999;
                    PLAYER_STATE_INIT['ps']['amount'] = 999;
                    PLAYER_STATE_INIT['san']['amount'] = 999;
                    //BAG_BASE_SIZE = 20;
                } else {
                    console.error("PLAYER_STATE_INIT 未定义，无法修改玩家初始状态");
                }
            })();
        }

        // 模块二：采集点数据修改
        if (isModuleTwoEnabled) {
            (function modifyPlaceData() {
                if (typeof PLACE_DATA !== 'undefined') {
                    for (let i in PLACE_DATA) {
                        if (PLACE_DATA[i].timeNeed) PLACE_DATA[i].timeNeed *= 0.01;
                        if (PLACE_DATA[i].resource) {
                            for (let j in PLACE_DATA[i].resource) {
                                let resource = PLACE_DATA[i].resource[j];
                                resource.initAmount = 999999;
                                resource.timeNeed = 0.1;
                                resource.circle = 999999;
                                if (resource.require) resource.require = { ps: 0.1 };
                                if (resource.things) {
                                    for (let k in resource.things) {
                                        resource.things[k] = 1000;
                                    }
                                }
                            }
                        }
                    }
                } else {
                    console.error("PLACE_DATA 未定义，无法修改采集点数据");
                }
            })();
        }

        // 模块三：特殊采集点修改
        if (isModuleThreeEnabled) {
            (function modifySpecialPlace() {
                if (typeof PLACE_DATA !== 'undefined' && PLACE_DATA['river']) {
                    if (PLACE_DATA['river']['resource'] && PLACE_DATA['river']['resource']['tree']) {
                        PLACE_DATA['river']['resource']['tree']['things']['crystal'] = 10000;
                        PLACE_DATA['river']['resource']['tree']['things']['blood'] = 1;
                        PLACE_DATA['river']['resource']['tree']['things']['dungeonKey'] = 1000;
                    }
                } else {
                    console.error("特殊采集点 river 未定义，无法修改特殊采集点数据");
                }
            })();
        }

        // 模块四：建筑数据修改
        if (isModuleFourEnabled) {
            (function modifyBuildingData() {
                if (typeof BUILDING_DATA !== 'undefined') {
                    for (let i in BUILDING_DATA) {
                        if (i !== 'build') {
                            BUILDING_DATA[i].require = {};       // 移除建造所需材料
                            BUILDING_DATA[i].timeNeed = 0.1;    // 建造时间缩短
                        }
                    }
                } else {
                    console.error("BUILDING_DATA 未定义，无法修改建筑数据");
                }
            })();
        }

        // 模块五：建筑升级数据修改
        if (isModuleFiveEnabled) {
            (function modifyBuildingUpgradeData() {
                if (typeof BUILDING_UPDATE_DATA !== 'undefined') {
                    for (let i in BUILDING_UPDATE_DATA) {
                        if (BUILDING_UPDATE_DATA[i]) {
                            for (let j in BUILDING_UPDATE_DATA[i]) {
                                BUILDING_UPDATE_DATA[i][j].timeNeed = 0.1; // 升级时间缩短
                                BUILDING_UPDATE_DATA[i][j].require = {};   // 移除升级所需材料
                            }
                        }
                    }
                } else {
                    console.error("BUILDING_UPDATE_DATA 未定义，无法修改建筑升级数据");
                }
            })();
        }
        // 模块六：技能数据修改
        if (isModuleSixEnabled) {
            (function modifySkillData() {
                if (typeof SKILL_DATA !== 'undefined') {
                    for (let i in SKILL_DATA) {
                        if (SKILL_DATA[i]) {
                            if (i !== 'def') {
                                SKILL_DATA[i].buff *= 100; // 非防御技能的加成倍数
                            } else {
                                SKILL_DATA[i].buff = 0.1; // 防御技能的加成设置为0.1
                            }
                        }
                    }
                } else {
                    console.error("SKILL_DATA 未定义，无法修改技能数据");
                }
            })();
        }

        // 模块七：制作、科技和魔法数据修改
        if (isModuleSevenEnabled) {
            (function modifyMakeScienceMagicData() {
                const dataGroups = [MAKE_DATA, SCIENCE_DATA, MAGIC_DATA];
                for (let data of dataGroups) {
                    if (typeof data !== 'undefined') {
                        for (let i in data) {
                            if (data[i] && data[i].timeNeed) {
                                data[i].timeNeed = 0.1; // 制作、科技和魔法的时间缩短
                                data[i].require = { wood: 1 }; // 修改制作所需材料为木材1
                            }
                        }
                    } else {
                        console.error("数据组未定义，无法修改数据");
                    }
                }
            })();
        }

        console.log("脚本运行成功，数据已修改。");
    } catch (error) {
        console.error("脚本运行时发生错误：", error);
    }
})();