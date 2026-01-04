// ==UserScript==
// @name         idlepoe全能助手
// @namespace
// @version      1.0.3.2
// @description  idlepoe助手，真.疯狂修改版！！！
// @author       winter
// @match        *://*.idlepoe.com/*
// @match        *://idlepoe.com/*
// @match        *://poe.faith.wang/*
// @icon         https://www.google.com/s2/favicons?domain=idlepoe.com
// @grant        unsafeWindow
// @license      MIT
// @namespace https://idlepoe.com
// @downloadURL https://update.greasyfork.org/scripts/478278/idlepoe%E5%85%A8%E8%83%BD%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/478278/idlepoe%E5%85%A8%E8%83%BD%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==



(function() {
    'use strict';
    var xiaohao = "";
    var WAIT_MAX = 0;
    var checkInterval = 150; // 等待改造/机会结果的检查间隔 单位为毫秒, 太低会卡死, 建议50+
    var checkIlvl = 1;
    var lastName = "";
    var lastDetail = [];
    var ClipboardText = "";
    var AudioContext = window.AudioContext || window.webkitAudioContext;
    var audioCtx = new AudioContext();
    //装备数组
    var ES = {"头部":3,"胸甲":4,"腰带":5,"手套":6,"鞋子":7,"项链":8,"戒指":910,"饰品":11}
    var PSL = 0;
    var AUTO_DEL_STATUS=0;// 自动删除启动状态
    var showScriptFlag = false; //是否显示脚本
    var Loot_STATUS = false;//是否奴隶主模式
       // Loot_STATUS = localStorage.getItem("Loot_STATUS")==='true'?true:false;
    var swBut = false;
    var Chaos_STATUS= false;// 自动混沌启用状态
    var Alc_STATUS= false;// 自动点金启用状态
    var Alt_STATUS= false;// 完美改造启用状态
    var Alt2_STATUS= false;
    var Chaos_STATUS1= false;// 自动混沌启用状态
    var Alc_STATUS1= false;// 自动点金启用状态
    var Alt_STATUS1= false;// 完美改造启用状态
    var Alt2_STATUS1= false;// 自动改造启用状态
    var LINK_STATUS= false;// 自动连接启用状态
    var Chrom_STATUS= false;// 自动洗色启用状态
//    var PERFECT_ROLL = false;
    var BACKPACK_ES; // 缓存查找背包装备数据
    var BACKPACK_INDEX; // 查找背包索引
    var BACKPACK_KEY; // 缓存查找背包装备关键字
    var BACKPACK_NAME; // 缓存查找背包装备名字
    var BACKPACK_STATUS = 0; //查找背包状态
    var LAST_SETTIME_ID = 0; //上个settime的Id 保证立刻停止roll
    var LAST_SETTIME_ID2 = 0; //上个settime的Id 保证立刻停止roll
    var LAST_SETTIME_ID3 = 0; //上个settime的Id 保证立刻停止roll
    var LAST_SETTIME_ID4 = 0; //上个settime的Id 保证立刻停止roll
    var lastName = "";
    var fazhang = "艾许的,电离的,重击的,托沃的,冰霜法师的,结晶的,索伏的,火屑的,熔岩的,锋芒的,雕纹的,魔咒师的,导师的,娴熟之,巫术之,伎俩之,解构之,灭绝之,灾难之,毁灭之,凶暴之,狂暴之,电极的";
//byId("scriptDiv").style.display = 'none';

//for()
//
//
    // 定义装备类型和对应的前缀和后缀数据，包括最大等级
    var equipmentData = {
        "爪": {
            "前缀": [
                { "name": "最大魔力(单手)", "maxLevel": 12 },
                { "name": "物理伤害提高和命中值", "maxLevel": 8 },
                { "name": "物理伤害提高", "maxLevel": 8 },
                { "name": "基础物理伤害(单手)", "maxLevel": 9 },
                { "name": "基础火焰伤害(单手)", "maxLevel": 10 },
                { "name": "基础冰霜伤害(单手)", "maxLevel": 10 },
                { "name": "基础闪电伤害(单手)", "maxLevel": 10 },
                { "name": "基础混沌伤害(单手)", "maxLevel": 1 },
                { "name": "攻击技能的元素伤害提高(单手)", "maxLevel": 6 },
                { "name": "所有技能石等级", "maxLevel": 1 },
                { "name": "近战技能石等级", "maxLevel": 2 },
                { "name": "物理攻击伤害转化为生命偷取", "maxLevel": 1 },
                { "name": "物理攻击伤害转化为魔力偷取", "maxLevel": 1 }
            ],
            "后缀": [
                { "name": "敏捷", "maxLevel": 9 },
                { "name": "智慧", "maxLevel": 9 },
                { "name": "攻击速度加快", "maxLevel": 8 },
                { "name": "火焰抗性", "maxLevel": 8 },
                { "name": "冰霜抗性", "maxLevel": 8 },
                { "name": "闪电抗性", "maxLevel": 8 },
                { "name": "混沌抗性", "maxLevel": 6 },
                { "name": "敌人被晕眩时间延长", "maxLevel": 5 },
                { "name": "击中回血", "maxLevel": 4 },
                { "name": "击败回血", "maxLevel": 3 },
                { "name": "击败回蓝", "maxLevel": 3 },
                { "name": "武器攻击暴击率", "maxLevel": 6 },
                { "name": "全域暴击伤害加成", "maxLevel": 6 },
                { "name": "命中值(武器)", "maxLevel": 6 },
                { "name": "命中值和照亮范围扩大", "maxLevel": 3},
                { "name": "属性需求降低", "maxLevel": 2 },
                { "name": "中毒伤害和中毒几率", "maxLevel": 3 },
                { "name": "所有持续伤害加成(单手和项链)", "maxLevel": 5 }
            ]
        },
        "匕首": {
            "前缀": [
                { "name": "最大魔力(单手)", "maxLevel": 12 },
                { "name": "物理伤害提高和命中值", "maxLevel": 8 },
                { "name": "物理伤害提高", "maxLevel": 8 },
                { "name": "基础物理伤害(单手)", "maxLevel": 9 },
                { "name": "基础火焰伤害(单手)", "maxLevel": 10 },
                { "name": "基础冰霜伤害(单手)", "maxLevel": 10 },
                { "name": "基础闪电伤害(单手)", "maxLevel": 10 },
                { "name": "基础混沌伤害(单手)", "maxLevel": 1 },
                { "name": "攻击技能的元素伤害提高(单手)", "maxLevel": 6 },
                { "name": "所有技能石等级", "maxLevel": 1 },
                { "name": "元素&混沌技能石等级", "maxLevel": 2 },
                { "name": "近战技能石等级", "maxLevel": 2 },
                { "name": "物理攻击伤害转化为生命偷取", "maxLevel": 1 },
                { "name": "物理攻击伤害转化为魔力偷取", "maxLevel": 1 }
            ],
            "后缀": [
                { "name": "敏捷", "maxLevel": 9 },
                { "name": "智慧", "maxLevel": 9 },
                { "name": "攻击速度加快", "maxLevel": 8 },
                { "name": "火焰抗性", "maxLevel": 8 },
                { "name": "冰霜抗性", "maxLevel": 8 },
                { "name": "闪电抗性", "maxLevel": 8 },
                { "name": "混沌抗性", "maxLevel": 6 },
                { "name": "敌人被晕眩时间延长", "maxLevel": 5 },
                { "name": "击中回血", "maxLevel": 4 },
                { "name": "击败回血", "maxLevel": 3 },
                { "name": "击败回蓝", "maxLevel": 3 },
                { "name": "武器攻击暴击率", "maxLevel": 6 },
                { "name": "全域暴击伤害加成", "maxLevel": 6 },
                { "name": "命中值(武器)", "maxLevel": 6 },
                { "name": "命中值和照亮范围扩大", "maxLevel": 3},
                { "name": "属性需求降低", "maxLevel": 2 },
                { "name": "中毒伤害和中毒几率", "maxLevel": 3 },
                { "name": "持续伤害加成(单手)", "maxLevel": 5 }
            ]
        },
        "符文匕首": {
            "前缀": [
                { "name": "最大魔力(单手)", "maxLevel": 12 },
                { "name": "物理伤害提高和命中值", "maxLevel": 8 },
                { "name": "物理伤害提高", "maxLevel": 8 },
                { "name": "基础物理伤害(单手)", "maxLevel": 9 },
                { "name": "基础火焰伤害(单手)", "maxLevel": 10 },
                { "name": "基础冰霜伤害(单手)", "maxLevel": 10 },
                { "name": "基础闪电伤害(单手)", "maxLevel": 10 },
                { "name": "基础混沌伤害(单手)", "maxLevel": 1 },
                { "name": "攻击技能的元素伤害提高(单手)", "maxLevel": 6 },
                { "name": "所有技能石等级", "maxLevel": 1 },
                { "name": "近战技能石等级", "maxLevel": 1 },
                { "name": "所有法术主动技能石等级(单手)", "maxLevel": 1 },
                { "name": "法术主动技能石等级(单手)", "maxLevel": 1},
                { "name": "物理攻击伤害转化为生命偷取", "maxLevel": 3 },
                { "name": "物理攻击伤害转化为魔力偷取", "maxLevel": 1 },
                { "name": "法术附加伤害(单手)", "maxLevel": 27}
            ],
            "后缀": [
                { "name": "敏捷", "maxLevel": 9 },
                { "name": "智慧", "maxLevel": 9 },
                { "name": "施法速度加快", "maxLevel": 7 },
                { "name": "攻击速度加快", "maxLevel": 8 },
                { "name": "火焰抗性", "maxLevel": 8 },
                { "name": "冰霜抗性", "maxLevel": 8 },
                { "name": "闪电抗性", "maxLevel": 8 },
                { "name": "混沌抗性", "maxLevel": 6 },
                { "name": "敌人被晕眩时间延长", "maxLevel": 5 },
                { "name": "击中回血", "maxLevel": 4 },
                { "name": "击败回血", "maxLevel": 3 },
                { "name": "击败回蓝", "maxLevel": 3 },
                { "name": "武器攻击暴击率", "maxLevel": 6 },
                { "name": "全域暴击伤害加成", "maxLevel": 6 },
                { "name": "命中值(武器)", "maxLevel": 6 },
                { "name": "命中值和照亮范围扩大", "maxLevel": 3},
                { "name": "属性需求降低", "maxLevel": 2 },
                { "name": "中毒伤害和中毒几率", "maxLevel": 3 },
                { "name": "所有持续伤害加成(单手和项链)", "maxLevel": 5 },
                { "name": "持续伤害加成(单手)", "maxLevel": 5 }
            ]
        },
        "单手剑": {
            "前缀": [
                { "name": "物理伤害提高和命中值", "maxLevel": 8 },
                { "name": "物理伤害提高", "maxLevel": 8 },
                { "name": "基础物理伤害(单手)", "maxLevel": 9 },
                { "name": "基础火焰伤害(单手)", "maxLevel": 10 },
                { "name": "基础冰霜伤害(单手)", "maxLevel": 10 },
                { "name": "基础闪电伤害(单手)", "maxLevel": 10 },
                { "name": "基础混沌伤害(单手)", "maxLevel": 1 },
                { "name": "攻击技能的元素伤害提高(单手)", "maxLevel": 6 },
                { "name": "所有技能石等级", "maxLevel": 1 },
                { "name": "近战技能石等级", "maxLevel": 2 },
                { "name": "物理攻击伤害转化为生命偷取", "maxLevel": 1 },
                { "name": "物理攻击伤害转化为魔力偷取", "maxLevel": 1 }
            ],
            "后缀": [
                { "name": "力量", "maxLevel": 9 },
                { "name": "敏捷", "maxLevel": 9 },
                { "name": "攻击速度加快", "maxLevel": 8 },
                { "name": "敌人晕眩门槛降低", "maxLevel": 5 },
                { "name": "火焰抗性", "maxLevel": 8 },
                { "name": "冰霜抗性", "maxLevel": 8 },
                { "name": "闪电抗性", "maxLevel": 8 },
                { "name": "混沌抗性", "maxLevel": 6 },
                { "name": "敌人被晕眩时间延长", "maxLevel": 5 },
                { "name": "击中回血", "maxLevel": 4 },
                { "name": "击败回血", "maxLevel": 3 },
                { "name": "击败回蓝", "maxLevel": 3 },
                { "name": "武器攻击暴击率", "maxLevel": 6 },
                { "name": "全域暴击伤害加成", "maxLevel": 6 },
                { "name": "命中值(武器)", "maxLevel": 6 },
                { "name": "命中值和照亮范围扩大", "maxLevel": 3},
                { "name": "属性需求降低", "maxLevel": 2 },
                { "name": "中毒伤害和中毒几率", "maxLevel": 3 },
                { "name": "流血伤害和流血几率", "maxLevel": 3 },
                { "name": "所有持续伤害加成(单手和项链)", "maxLevel": 5 }
            ]
        },
        "细剑": {
            "前缀": [
                { "name": "物理伤害提高和命中值", "maxLevel": 8 },
                { "name": "物理伤害提高", "maxLevel": 8 },
                { "name": "基础物理伤害(单手)", "maxLevel": 9 },
                { "name": "基础火焰伤害(单手)", "maxLevel": 10 },
                { "name": "基础冰霜伤害(单手)", "maxLevel": 10 },
                { "name": "基础闪电伤害(单手)", "maxLevel": 10 },
                { "name": "基础混沌伤害(单手)", "maxLevel": 1 },
                { "name": "攻击技能的元素伤害提高(单手)", "maxLevel": 6 },
                { "name": "所有技能石等级", "maxLevel": 1 },
                { "name": "近战技能石等级", "maxLevel": 2 },
                { "name": "物理攻击伤害转化为生命偷取", "maxLevel": 1 },
                { "name": "物理攻击伤害转化为魔力偷取", "maxLevel": 1 }
            ],
            "后缀": [
                { "name": "力量", "maxLevel": 9 },
                { "name": "敏捷", "maxLevel": 9 },
                { "name": "攻击速度加快", "maxLevel": 8 },
                { "name": "敌人晕眩门槛降低", "maxLevel": 5 },
                { "name": "火焰抗性", "maxLevel": 8 },
                { "name": "冰霜抗性", "maxLevel": 8 },
                { "name": "闪电抗性", "maxLevel": 8 },
                { "name": "混沌抗性", "maxLevel": 6 },
                { "name": "敌人被晕眩时间延长", "maxLevel": 5 },
                { "name": "击中回血", "maxLevel": 4 },
                { "name": "击败回血", "maxLevel": 3 },
                { "name": "击败回蓝", "maxLevel": 3 },
                { "name": "武器攻击暴击率", "maxLevel": 6 },
                { "name": "全域暴击伤害加成", "maxLevel": 6 },
                { "name": "命中值(武器)", "maxLevel": 6 },
                { "name": "命中值和照亮范围扩大", "maxLevel": 3},
                { "name": "属性需求降低", "maxLevel": 2 },
                { "name": "中毒伤害和中毒几率", "maxLevel": 3 },
                { "name": "流血伤害和流血几率", "maxLevel": 3 },
                { "name": "所有持续伤害加成(单手和项链)", "maxLevel": 5 }
            ]
        },
        "单手斧": {
            "前缀": [
                { "name": "物理伤害提高和命中值", "maxLevel": 8 },
                { "name": "物理伤害提高", "maxLevel": 8 },
                { "name": "基础物理伤害(单手)", "maxLevel": 9 },
                { "name": "基础火焰伤害(单手)", "maxLevel": 10 },
                { "name": "基础冰霜伤害(单手)", "maxLevel": 10 },
                { "name": "基础闪电伤害(单手)", "maxLevel": 10 },
                { "name": "基础混沌伤害(单手)", "maxLevel": 1 },
                { "name": "攻击技能的元素伤害提高(单手)", "maxLevel": 6 },
                { "name": "所有技能石等级", "maxLevel": 1 },
                { "name": "近战技能石等级", "maxLevel": 2 },
                { "name": "物理攻击伤害转化为生命偷取", "maxLevel": 1 },
                { "name": "物理攻击伤害转化为魔力偷取", "maxLevel": 1 }
            ],
            "后缀": [
                { "name": "力量", "maxLevel": 9 },
                { "name": "敏捷", "maxLevel": 9 },
                { "name": "攻击速度加快", "maxLevel": 8 },
                { "name": "敌人晕眩门槛降低", "maxLevel": 5 },
                { "name": "火焰抗性", "maxLevel": 8 },
                { "name": "冰霜抗性", "maxLevel": 8 },
                { "name": "闪电抗性", "maxLevel": 8 },
                { "name": "混沌抗性", "maxLevel": 6 },
                { "name": "敌人被晕眩时间延长", "maxLevel": 5 },
                { "name": "击中回血", "maxLevel": 4 },
                { "name": "击败回血", "maxLevel": 3 },
                { "name": "击败回蓝", "maxLevel": 3 },
                { "name": "武器攻击暴击率", "maxLevel": 6 },
                { "name": "全域暴击伤害加成", "maxLevel": 6 },
                { "name": "命中值(武器)", "maxLevel": 6 },
                { "name": "命中值和照亮范围扩大", "maxLevel": 3},
                { "name": "属性需求降低", "maxLevel": 2 },
                { "name": "流血伤害和流血几率", "maxLevel": 3 },
                { "name": "所有持续伤害加成(单手和项链)", "maxLevel": 5 }
            ]
        },
        "单手锤": {
            "前缀": [
                { "name": "物理伤害提高和命中值", "maxLevel": 8 },
                { "name": "物理伤害提高", "maxLevel": 8 },
                { "name": "基础物理伤害(单手)", "maxLevel": 9 },
                { "name": "基础火焰伤害(单手)", "maxLevel": 10 },
                { "name": "基础冰霜伤害(单手)", "maxLevel": 10 },
                { "name": "基础闪电伤害(单手)", "maxLevel": 10 },
                { "name": "基础混沌伤害(单手)", "maxLevel": 1 },
                { "name": "攻击技能的元素伤害提高(单手)", "maxLevel": 6 },
                { "name": "所有技能石等级", "maxLevel": 1 },
                { "name": "近战技能石等级", "maxLevel": 2 },
                { "name": "物理攻击伤害转化为生命偷取", "maxLevel": 1 },
                { "name": "物理攻击伤害转化为魔力偷取", "maxLevel": 1 }
            ],
            "后缀": [
                { "name": "力量", "maxLevel": 9 },
                { "name": "攻击速度加快", "maxLevel": 8 },
                { "name": "敌人晕眩门槛降低", "maxLevel": 5 },
                { "name": "火焰抗性", "maxLevel": 8 },
                { "name": "冰霜抗性", "maxLevel": 8 },
                { "name": "闪电抗性", "maxLevel": 8 },
                { "name": "混沌抗性", "maxLevel": 6 },
                { "name": "敌人被晕眩时间延长", "maxLevel": 5 },
                { "name": "击中回血", "maxLevel": 4 },
                { "name": "击败回血", "maxLevel": 3 },
                { "name": "击败回蓝", "maxLevel": 3 },
                { "name": "武器攻击暴击率", "maxLevel": 6 },
                { "name": "全域暴击伤害加成", "maxLevel": 6 },
                { "name": "命中值(武器)", "maxLevel": 6 },
                { "name": "命中值和照亮范围扩大", "maxLevel": 3},
                { "name": "属性需求降低", "maxLevel": 2 },
                { "name": "中毒伤害和中毒几率", "maxLevel": 3 },
                { "name": "流血伤害和流血几率", "maxLevel": 3 },
                { "name": "所有持续伤害加成(单手和项链)", "maxLevel": 5 }
            ]
        },
        "弓": {
            "前缀": [
                { "name": "物理伤害提高和命中值", "maxLevel": 8 },
                { "name": "物理伤害提高", "maxLevel": 8 },
                { "name": "基础物理伤害(双手)", "maxLevel": 9 },
                { "name": "基础火焰伤害(双手)", "maxLevel": 10 },
                { "name": "基础冰霜伤害(双手)", "maxLevel": 10 },
                { "name": "基础闪电伤害(双手)", "maxLevel": 10 },
                { "name": "基础混沌伤害(双手)", "maxLevel": 1 },
                { "name": "攻击技能的元素伤害提高(双手)", "maxLevel": 6 },
                { "name": "所有技能石等级", "maxLevel": 1 },
                { "name": "弓技能石等级", "maxLevel": 2 },
                { "name": "物理攻击伤害转化为生命偷取", "maxLevel": 1 },
                { "name": "物理攻击伤害转化为魔力偷取", "maxLevel": 1 }
            ],
            "后缀": [
                { "name": "敏捷", "maxLevel": 9 },
                { "name": "攻击速度加快", "maxLevel": 5 },
                { "name": "火焰抗性", "maxLevel": 8 },
                { "name": "冰霜抗性", "maxLevel": 8 },
                { "name": "闪电抗性", "maxLevel": 8 },
                { "name": "混沌抗性", "maxLevel": 6 },
                { "name": "敌人被晕眩时间延长", "maxLevel": 5 },
                { "name": "击中回血", "maxLevel": 4 },
                { "name": "击败回血", "maxLevel": 3 },
                { "name": "击败回蓝", "maxLevel": 3 },
                { "name": "武器攻击暴击率", "maxLevel": 6 },
                { "name": "全域暴击伤害加成", "maxLevel": 6 },
                { "name": "命中值(武器)", "maxLevel": 6 },
                { "name": "命中值和照亮范围扩大", "maxLevel": 3},
                { "name": "额外箭矢", "maxLevel": 2 },
                { "name": "属性需求降低", "maxLevel": 2 },
                { "name": "中毒伤害和中毒几率", "maxLevel": 3 },
                { "name": "流血伤害和流血几率", "maxLevel": 3 },
                { "name": "投射物速度加快", "maxLevel": 6 },
                { "name": "所有持续伤害加成(双手)", "maxLevel": 5 }
            ]
        },
        "双手剑": {
            "前缀": [
                { "name": "物理伤害提高和命中值", "maxLevel": 8 },
                { "name": "物理伤害提高", "maxLevel": 8 },
                { "name": "基础物理伤害(双手)", "maxLevel": 9 },
                { "name": "基础火焰伤害(双手)", "maxLevel": 10 },
                { "name": "基础冰霜伤害(双手)", "maxLevel": 10 },
                { "name": "基础闪电伤害(双手)", "maxLevel": 10 },
                { "name": "基础混沌伤害(双手)", "maxLevel": 1 },
                { "name": "攻击技能的元素伤害提高(双手)", "maxLevel": 6 },
                { "name": "所有技能石等级", "maxLevel": 1 },
                { "name": "近战技能石等级", "maxLevel": 2 },
                { "name": "物理攻击伤害转化为生命偷取", "maxLevel": 1 },
                { "name": "物理攻击伤害转化为魔力偷取", "maxLevel": 1 }
            ],
            "后缀": [
                { "name": "力量", "maxLevel": 9 },
                { "name": "敏捷", "maxLevel": 9 },
                { "name": "攻击速度加快", "maxLevel": 8 },
                { "name": "敌人晕眩门槛降低", "maxLevel": 5 },
                { "name": "火焰抗性", "maxLevel": 8 },
                { "name": "冰霜抗性", "maxLevel": 8 },
                { "name": "闪电抗性", "maxLevel": 8 },
                { "name": "混沌抗性", "maxLevel": 6 },
                { "name": "敌人被晕眩时间延长", "maxLevel": 5 },
                { "name": "击中回血", "maxLevel": 4 },
                { "name": "击败回血", "maxLevel": 3 },
                { "name": "击败回蓝", "maxLevel": 3 },
                { "name": "武器攻击暴击率", "maxLevel": 6 },
                { "name": "全域暴击伤害加成", "maxLevel": 6 },
                { "name": "命中值(武器)", "maxLevel": 5 },
                { "name": "命中值和照亮范围扩大", "maxLevel": 3},
                { "name": "属性需求降低", "maxLevel": 2 },
                { "name": "中毒伤害和中毒几率", "maxLevel": 3 },
                { "name": "流血伤害和流血几率", "maxLevel": 3 },
                { "name": "所有持续伤害加成(双手)", "maxLevel": 5 }
            ]
        },
        "双手斧": {
            "前缀": [
                { "name": "物理伤害提高和命中值", "maxLevel": 8 },
                { "name": "物理伤害提高", "maxLevel": 8 },
                { "name": "基础物理伤害(双手)", "maxLevel": 9 },
                { "name": "基础火焰伤害(双手)", "maxLevel": 10 },
                { "name": "基础冰霜伤害(双手)", "maxLevel": 10 },
                { "name": "基础闪电伤害(双手)", "maxLevel": 10 },
                { "name": "基础混沌伤害(双手)", "maxLevel": 1 },
                { "name": "攻击技能的元素伤害提高(双手)", "maxLevel": 6 },
                { "name": "所有技能石等级", "maxLevel": 1 },
                { "name": "近战技能石等级", "maxLevel": 2 },
                { "name": "物理攻击伤害转化为生命偷取", "maxLevel": 1 },
                { "name": "物理攻击伤害转化为魔力偷取", "maxLevel": 1 }
            ],
            "后缀": [
                { "name": "力量", "maxLevel": 9 },
                { "name": "敏捷", "maxLevel": 9 },
                { "name": "攻击速度加快", "maxLevel": 8 },
                { "name": "敌人晕眩门槛降低", "maxLevel": 5 },
                { "name": "火焰抗性", "maxLevel": 8 },
                { "name": "冰霜抗性", "maxLevel": 8 },
                { "name": "闪电抗性", "maxLevel": 8 },
                { "name": "混沌抗性", "maxLevel": 6 },
                { "name": "敌人被晕眩时间延长", "maxLevel": 5 },
                { "name": "击中回血", "maxLevel": 4 },
                { "name": "击败回血", "maxLevel": 3 },
                { "name": "击败回蓝", "maxLevel": 3 },
                { "name": "武器攻击暴击率", "maxLevel": 6 },
                { "name": "全域暴击伤害加成", "maxLevel": 6 },
                { "name": "命中值(武器)", "maxLevel": 5 },
                { "name": "命中值和照亮范围扩大", "maxLevel": 3},
                { "name": "属性需求降低", "maxLevel": 2 },
                { "name": "流血伤害和流血几率", "maxLevel": 3 },
                { "name": "所有持续伤害加成(双手)", "maxLevel": 5 }
            ]
        },
        "双手锤": {
            "前缀": [
                { "name": "物理伤害提高和命中值", "maxLevel": 8 },
                { "name": "物理伤害提高", "maxLevel": 8 },
                { "name": "基础物理伤害(双手)", "maxLevel": 9 },
                { "name": "基础火焰伤害(双手)", "maxLevel": 10 },
                { "name": "基础冰霜伤害(双手)", "maxLevel": 10 },
                { "name": "基础闪电伤害(双手)", "maxLevel": 10 },
                { "name": "基础混沌伤害(双手)", "maxLevel": 1 },
                { "name": "攻击技能的元素伤害提高(双手)", "maxLevel": 6 },
                { "name": "所有技能石等级", "maxLevel": 1 },
                { "name": "近战技能石等级", "maxLevel": 2 },
                { "name": "物理攻击伤害转化为生命偷取", "maxLevel": 1 },
                { "name": "物理攻击伤害转化为魔力偷取", "maxLevel": 1 }
            ],
            "后缀": [
                { "name": "力量", "maxLevel": 9 },
                { "name": "攻击速度加快", "maxLevel": 8 },
                { "name": "敌人晕眩门槛降低", "maxLevel": 5 },
                { "name": "火焰抗性", "maxLevel": 8 },
                { "name": "冰霜抗性", "maxLevel": 8 },
                { "name": "闪电抗性", "maxLevel": 8 },
                { "name": "混沌抗性", "maxLevel": 6 },
                { "name": "敌人被晕眩时间延长", "maxLevel": 5 },
                { "name": "击中回血", "maxLevel": 4 },
                { "name": "击败回血", "maxLevel": 3 },
                { "name": "击败回蓝", "maxLevel": 3 },
                { "name": "武器攻击暴击率", "maxLevel": 6 },
                { "name": "全域暴击伤害加成", "maxLevel": 6 },
                { "name": "命中值(武器)", "maxLevel": 5 },
                { "name": "命中值和照亮范围扩大", "maxLevel": 3},
                { "name": "属性需求降低", "maxLevel": 2 },
                { "name": "流血伤害和流血几率", "maxLevel": 3 },
                { "name": "所有持续伤害加成(双手)", "maxLevel": 5 }
            ]
        },
        "长杖": {
            "前缀": [
                { "name": "最大魔力(双手)", "maxLevel": 12 },
                { "name": "物理伤害提高和命中值", "maxLevel": 8 },
                { "name": "物理伤害提高", "maxLevel": 8 },
                { "name": "基础物理伤害(双手)", "maxLevel": 9 },
                { "name": "基础火焰伤害(双手)", "maxLevel": 10 },
                { "name": "基础冰霜伤害(双手)", "maxLevel": 10 },
                { "name": "基础闪电伤害(双手)", "maxLevel": 10 },
                { "name": "基础混沌伤害(双手)", "maxLevel": 1 },
                { "name": "法术伤害提高(双手)", "maxLevel": 8},
                { "name": "法术伤害与魔力(双手)", "maxLevel": 7 },
                { "name": "物理攻击伤害转化为生命偷取", "maxLevel": 3 },
                { "name": "物理攻击伤害转化为魔力偷取", "maxLevel": 1 },
                { "name": "攻击技能的元素伤害提高(双手)", "maxLevel": 6 },
                { "name": "所有法术主动技能石等级(双手)", "maxLevel": 1 },
                { "name": "法术主动技能石等级(双手)", "maxLevel": 2},
                { "name": "近战技能石等级", "maxLevel": 2},
                { "name": "法术附加伤害(双手)", "maxLevel": 27}
            ],
            "后缀": [
                { "name": "力量", "maxLevel": 9 },
                { "name": "智慧", "maxLevel": 9 },
                { "name": "施法速度加快(长杖)", "maxLevel": 7 },
                { "name": "攻击速度加快", "maxLevel": 8 },
                { "name": "魔力再生率提高", "maxLevel": 6 },
                { "name": "敌人晕眩门槛降低", "maxLevel": 5 },
                { "name": "火焰抗性", "maxLevel": 8 },
                { "name": "冰霜抗性", "maxLevel": 8 },
                { "name": "闪电抗性", "maxLevel": 8 },
                { "name": "混沌抗性", "maxLevel": 6 },
                { "name": "敌人被晕眩时间延长", "maxLevel": 5 },
                { "name": "法术暴击率提高", "maxLevel": 6 },
                { "name": "击中回血", "maxLevel": 4 },
                { "name": "击败回血", "maxLevel": 3 },
                { "name": "击败回蓝", "maxLevel": 3 },
                { "name": "火焰伤害", "maxLevel": 6 },
                { "name": "冰霜伤害", "maxLevel": 6 },
                { "name": "闪电伤害", "maxLevel": 6 },
                { "name": "武器攻击暴击率", "maxLevel": 6 },
                { "name": "全域暴击伤害加成", "maxLevel": 6 },
                { "name": "命中值(武器)", "maxLevel": 5 },
                { "name": "属性需求降低", "maxLevel": 2 },
                { "name": "命中值和照亮范围扩大", "maxLevel": 3 },
                { "name": "点燃概率(双手)", "maxLevel": 3 },
                { "name": "冻结概率(双手)", "maxLevel": 3 },
                { "name": "感电概率(双手)", "maxLevel": 3 },
                { "name": "燃烧伤害提高(双手)", "maxLevel": 3 },
                { "name": "所有持续伤害加成(双手)", "maxLevel": 5 },
                { "name": "持续伤害加成(双手)", "maxLevel": 5}
            ]
        },
        "战杖": {
            "前缀": [
                { "name": "最大魔力", "maxLevel": 12 },
                { "name": "物理伤害提高和命中值", "maxLevel": 8 },
                { "name": "物理伤害提高", "maxLevel": 8 },
                { "name": "基础物理伤害(双手)", "maxLevel": 9 },
                { "name": "基础火焰伤害(双手)", "maxLevel": 10 },
                { "name": "基础冰霜伤害(双手)", "maxLevel": 10 },
                { "name": "基础闪电伤害(双手)", "maxLevel": 10 },
                { "name": "基础混沌伤害(双手)", "maxLevel": 1 },
                { "name": "物理攻击伤害转化为生命偷取", "maxLevel": 3 },
                { "name": "物理攻击伤害转化为魔力偷取", "maxLevel": 1 },
                { "name": "攻击技能的元素伤害提高(双手)", "maxLevel": 6 },
                { "name": "所有技能石等级", "maxLevel": 1 },
                { "name": "近战技能石等级", "maxLevel": 2 },
                { "name": "元素&混沌技能石等级", "maxLevel": 2}
            ],
            "后缀": [
                { "name": "力量", "maxLevel": 9 },
                { "name": "智慧", "maxLevel": 9 },
                { "name": "攻击速度加快", "maxLevel": 8 },
                { "name": "魔力再生率提高", "maxLevel": 6 },
                { "name": "敌人晕眩门槛降低", "maxLevel": 5 },
                { "name": "火焰抗性", "maxLevel": 8 },
                { "name": "冰霜抗性", "maxLevel": 8 },
                { "name": "闪电抗性", "maxLevel": 8 },
                { "name": "混沌抗性", "maxLevel": 6 },
                { "name": "敌人被晕眩时间延长", "maxLevel": 5 },
                { "name": "法术暴击率提高", "maxLevel": 6 },
                { "name": "击中回血", "maxLevel": 4 },
                { "name": "击败回血", "maxLevel": 3 },
                { "name": "击败回蓝", "maxLevel": 3 },
                { "name": "火焰伤害", "maxLevel": 6 },
                { "name": "冰霜伤害", "maxLevel": 6 },
                { "name": "闪电伤害", "maxLevel": 6 },
                { "name": "武器攻击暴击率", "maxLevel": 6 },
                { "name": "全域暴击伤害加成", "maxLevel": 6 },
                { "name": "命中值(武器)", "maxLevel": 5 },
                { "name": "属性需求降低", "maxLevel": 2 },
                { "name": "命中值和照亮范围扩大", "maxLevel": 3 },
                { "name": "点燃概率(双手)", "maxLevel": 3 },
                { "name": "冻结概率(双手)", "maxLevel": 3 },
                { "name": "感电概率(双手)", "maxLevel": 3 },
                { "name": "燃烧伤害提高(双手)", "maxLevel": 3 },
                { "name": "所有持续伤害加成(双手)", "maxLevel": 5 },
                { "name": "持续伤害加成(双手)", "maxLevel": 5}
            ]
        },
        "短杖": {
            "前缀": [
                { "name": "最大魔力(单手)", "maxLevel": 12 },
                { "name": "物理伤害提高和命中值", "maxLevel": 8 },
                { "name": "物理伤害提高", "maxLevel": 8 },
                { "name": "基础物理伤害(单手)", "maxLevel": 9 },
                { "name": "基础火焰伤害(单手)", "maxLevel": 10 },
                { "name": "基础冰霜伤害(单手)", "maxLevel": 10 },
                { "name": "基础闪电伤害(单手)", "maxLevel": 10 },
                { "name": "基础混沌伤害(单手)", "maxLevel": 1 },
                { "name": "攻击技能的元素伤害提高(单手)", "maxLevel": 6 },
                { "name": "法术伤害提高(单手)", "maxLevel": 8},
                { "name": "法术伤害与魔力(单手)", "maxLevel": 7 },
                { "name": "物理攻击伤害转化为生命偷取", "maxLevel": 3 },
                { "name": "物理攻击伤害转化为魔力偷取", "maxLevel": 1 },
                { "name": "攻击技能的元素伤害提高", "maxLevel": 6 },
                { "name": "所有法术主动技能石等级(单手)", "maxLevel": 1 },
                { "name": "近战技能石等级", "maxLevel": 2 },
                { "name": "法术主动技能石等级(单手)", "maxLevel": 1},
                { "name": "法术附加伤害(单手)", "maxLevel": 27}
            ],
            "后缀": [
                { "name": "力量", "maxLevel": 9 },
                { "name": "智慧", "maxLevel": 9 },
                { "name": "施法速度加快", "maxLevel": 7 },
                { "name": "攻击速度加快", "maxLevel": 8 },
                { "name": "魔力再生率提高", "maxLevel": 6 },
                { "name": "敌人晕眩门槛降低", "maxLevel": 5 },
                { "name": "火焰抗性", "maxLevel": 8 },
                { "name": "冰霜抗性", "maxLevel": 8 },
                { "name": "闪电抗性", "maxLevel": 8 },
                { "name": "混沌抗性", "maxLevel": 6 },
                { "name": "敌人被晕眩时间延长", "maxLevel": 5 },
                { "name": "法术暴击率提高", "maxLevel": 6 },
                { "name": "击中回血", "maxLevel": 4 },
                { "name": "击败回血", "maxLevel": 3 },
                { "name": "击败回蓝", "maxLevel": 3 },
                { "name": "火焰伤害", "maxLevel": 6 },
                { "name": "冰霜伤害", "maxLevel": 6 },
                { "name": "闪电伤害", "maxLevel": 6 },
                { "name": "武器攻击暴击率", "maxLevel": 6 },
                { "name": "全域暴击伤害加成", "maxLevel": 6 },
                { "name": "命中值(武器)", "maxLevel": 6 },
                { "name": "属性需求降低", "maxLevel": 2 },
                { "name": "命中值和照亮范围扩大", "maxLevel": 3 },
                { "name": "点燃概率(单手)", "maxLevel": 3 },
                { "name": "冻结概率(单手)", "maxLevel": 3 },
                { "name": "感电概率(单手)", "maxLevel": 3 },
                { "name": "燃烧伤害提高(单手)", "maxLevel": 3 },
                { "name": "所有持续伤害加成(单手和项链)", "maxLevel": 5 },
                { "name": "持续伤害加成(单手)", "maxLevel": 5}
            ]
        },
        "法杖": {
            "前缀": [
                { "name": "最大魔力(单手)", "maxLevel": 12 },
                { "name": "物理伤害提高和命中值", "maxLevel": 8 },
                { "name": "物理伤害提高", "maxLevel": 8 },
                { "name": "基础物理伤害(单手)", "maxLevel": 9 },
                { "name": "基础火焰伤害(单手)", "maxLevel": 10 },
                { "name": "基础冰霜伤害(单手)", "maxLevel": 10 },
                { "name": "基础闪电伤害(单手)", "maxLevel": 10 },
                { "name": "基础混沌伤害(单手)", "maxLevel": 1 },
                { "name": "攻击技能的元素伤害提高(单手)", "maxLevel": 6 },
                { "name": "法术伤害提高(单手)", "maxLevel": 8},
                { "name": "法术伤害与魔力(单手)", "maxLevel": 7 },
                { "name": "物理攻击伤害转化为生命偷取", "maxLevel": 3 },
                { "name": "物理攻击伤害转化为魔力偷取", "maxLevel": 1 },
                { "name": "攻击技能的元素伤害提高", "maxLevel": 6 },
                { "name": "所有法术主动技能石等级(单手)", "maxLevel": 1 },
                { "name": "近战技能石等级", "maxLevel": 2 },
                { "name": "法术主动技能石等级(单手)", "maxLevel": 1},
                { "name": "法术附加伤害(单手)", "maxLevel": 27}
            ],
            "后缀": [
                { "name": "力量", "maxLevel": 9 },
                { "name": "智慧", "maxLevel": 9 },
                { "name": "施法速度加快", "maxLevel": 7 },
                { "name": "攻击速度加快", "maxLevel": 8 },
                { "name": "魔力再生率提高", "maxLevel": 6 },
                { "name": "敌人晕眩门槛降低", "maxLevel": 5 },
                { "name": "火焰抗性", "maxLevel": 8 },
                { "name": "冰霜抗性", "maxLevel": 8 },
                { "name": "闪电抗性", "maxLevel": 8 },
                { "name": "混沌抗性", "maxLevel": 6 },
                { "name": "敌人被晕眩时间延长", "maxLevel": 5 },
                { "name": "法术暴击率提高", "maxLevel": 6 },
                { "name": "击中回血", "maxLevel": 4 },
                { "name": "击败回血", "maxLevel": 3 },
                { "name": "击败回蓝", "maxLevel": 3 },
                { "name": "火焰伤害", "maxLevel": 6 },
                { "name": "冰霜伤害", "maxLevel": 6 },
                { "name": "闪电伤害", "maxLevel": 6 },
                { "name": "武器攻击暴击率", "maxLevel": 6 },
                { "name": "全域暴击伤害加成", "maxLevel": 6 },
                { "name": "命中值(武器)", "maxLevel": 6 },
                { "name": "属性需求降低", "maxLevel": 2 },
                { "name": "命中值和照亮范围扩大", "maxLevel": 3 },
                { "name": "点燃概率(单手)", "maxLevel": 3 },
                { "name": "冻结概率(单手)", "maxLevel": 3 },
                { "name": "感电概率(单手)", "maxLevel": 3 },
                { "name": "燃烧伤害提高(单手)", "maxLevel": 3 },
                { "name": "所有持续伤害加成(单手和项链)", "maxLevel": 5 },
                { "name": "持续伤害加成(单手)", "maxLevel": 5},
                { "name": "投射物速度加快", "maxLevel": 5 }
            ]
        },

        "箭袋": {
            "前缀": [
                { "name": "最大生命", "maxLevel": 10 },
                { "name": "基础物理伤害(箭袋)", "maxLevel": 9 },
                { "name": "基础火焰伤害(箭袋)", "maxLevel": 9 },
                { "name": "基础冰霜伤害(箭袋)", "maxLevel": 9 },
                { "name": "基础闪电伤害(箭袋)", "maxLevel": 9 },
                { "name": "基础混沌伤害(箭袋)", "maxLevel": 1 },
                { "name": "物理攻击伤害转化为生命偷取", "maxLevel": 1 },
                { "name": "物理攻击伤害转化为魔力偷取", "maxLevel": 1 },
                { "name": "弓类技能伤害提高", "maxLevel": 6 }
            ],
            "后缀": [
                { "name": "敏捷", "maxLevel": 10 },
                { "name": "攻击速度加快", "maxLevel": 4 },
                { "name": "命中值(非武器)", "maxLevel": 6 },
                { "name": "火焰抗性", "maxLevel": 8 },
                { "name": "冰霜抗性", "maxLevel": 8 },
                { "name": "闪电抗性", "maxLevel": 8 },
                { "name": "混沌抗性", "maxLevel": 6 },
                { "name": "弓类攻击暴击率提高", "maxLevel": 8 },
                { "name": "弓类攻击暴击伤害加成", "maxLevel": 6 },
                { "name": "投射物速度加快", "maxLevel": 5 },
                { "name": "敌人被晕眩时间延长", "maxLevel": 5 },
                { "name": "击败回血", "maxLevel": 3 },
                { "name": "击败回蓝", "maxLevel": 3 },
                { "name": "额外箭矢", "maxLevel": 1 },
                { "name": "攻击技能的持续伤害加成", "maxLevel": 5 }
            ]
        },

        "项链": {
            "前缀": [
                { "name": "最大生命", "maxLevel": 9 },
                { "name": "最大魔力(非武器)", "maxLevel": 13 },
                { "name": "最大能量护盾", "maxLevel": 11 },
                { "name": "基础物理伤害(项链)", "maxLevel": 9 },
                { "name": "基础火焰伤害(项链)", "maxLevel": 9 },
                { "name": "基础冰霜伤害(项链)", "maxLevel": 9 },
                { "name": "基础闪电伤害(项链)", "maxLevel": 9 },
                { "name": "物理攻击伤害转化为生命偷取", "maxLevel": 3 },
                { "name": "物理攻击伤害转化为魔力偷取", "maxLevel": 2 },
                { "name": "护甲提高(饰品)", "maxLevel": 7 },
                { "name": "闪避值提高(饰品)", "maxLevel": 7 },
                { "name": "能量护盾上限提高(饰品)", "maxLevel": 7 },
                { "name": "法术伤害提高(饰品)", "maxLevel": 5 },
                { "name": "攻击技能的元素伤害提高(非武器)", "maxLevel": 6 },
                { "name": "物品稀有度提高(前缀)", "maxLevel": 4 },
                { "name": "所有主动技能石等级", "maxLevel": 1 },
                { "name": "主动技能石等级", "maxLevel": 1 }
            ],
            "后缀": [
                { "name": "力量", "maxLevel": 9 },
                { "name": "敏捷", "maxLevel": 9 },
                { "name": "智慧", "maxLevel": 9 },
                { "name": "全属性", "maxLevel": 9 },
                { "name": "物品稀有度提高(后缀)", "maxLevel": 4 },
                { "name": "命中值(非武器)", "maxLevel": 5 },
                { "name": "施法速度加快", "maxLevel": 4 },
                { "name": "生命每秒再生", "maxLevel": 8 },
                { "name": "魔力再生率提高", "maxLevel": 6 },
                { "name": "全域暴击率提高", "maxLevel": 6 },
                { "name": "全域暴击伤害加成", "maxLevel": 6 },
                { "name": "所有元素抗性", "maxLevel": 6 },
                { "name": "火焰抗性", "maxLevel": 8 },
                { "name": "冰霜抗性", "maxLevel": 8 },
                { "name": "闪电抗性", "maxLevel": 8 },
                { "name": "混沌抗性", "maxLevel": 6 },
                { "name": "击中回血", "maxLevel": 4 },
                { "name": "击败回血", "maxLevel": 3 },
                { "name": "击败回蓝", "maxLevel": 3 },
                { "name": "火焰伤害", "maxLevel": 5 },
                { "name": "冰霜伤害", "maxLevel": 5 },
                { "name": "闪电伤害", "maxLevel": 5 },
                { "name": "所有持续伤害加成(单手和项链)", "maxLevel": 5 }
            ]
        },
        "戒指": {
            "前缀": [
                { "name": "最大生命", "maxLevel": 8 },
                { "name": "最大魔力(非武器)", "maxLevel": 13 },
                { "name": "最大能量护盾", "maxLevel": 11 },
                { "name": "基础物理伤害(戒指和手套)", "maxLevel": 6 },
                { "name": "基础火焰伤害(戒指和手套)", "maxLevel": 9 },
                { "name": "基础冰霜伤害(戒指和手套)", "maxLevel": 9 },
                { "name": "基础闪电伤害(戒指和手套)", "maxLevel": 9 },
                { "name": "物理攻击伤害转化为生命偷取", "maxLevel": 1 },
                { "name": "物理攻击伤害转化为魔力偷取", "maxLevel": 1 },
                { "name": "攻击技能的元素伤害提高(非武器)", "maxLevel": 5 },
                { "name": "物品稀有度提高(前缀)", "maxLevel": 4 },
                { "name": "闪避值", "maxLevel": 7 }
            ],
            "后缀": [
                { "name": "力量", "maxLevel": 9 },
                { "name": "敏捷", "maxLevel": 9 },
                { "name": "智慧", "maxLevel": 9 },
                { "name": "全属性", "maxLevel": 4 },
                { "name": "物品稀有度提高(后缀)", "maxLevel": 4 },
                { "name": "命中值(非武器)", "maxLevel": 5 },
                { "name": "施法速度加快", "maxLevel": 3 },
                { "name": "攻击速度加快", "maxLevel": 1 },
                { "name": "生命每秒再生", "maxLevel": 7 },
                { "name": "魔力再生率提高", "maxLevel": 6 },
                { "name": "所有元素抗性", "maxLevel": 5 },
                { "name": "火焰抗性", "maxLevel": 8 },
                { "name": "冰霜抗性", "maxLevel": 8 },
                { "name": "闪电抗性", "maxLevel": 8 },
                { "name": "混沌抗性", "maxLevel": 6 },
                { "name": "击中回血", "maxLevel": 1 },
                { "name": "击败回血", "maxLevel": 3 },
                { "name": "击败回蓝", "maxLevel": 3 },
                { "name": "火焰伤害", "maxLevel": 4 },
                { "name": "冰霜伤害", "maxLevel": 4 },
                { "name": "闪电伤害", "maxLevel": 4 },
                { "name": "命中值和照亮范围扩大", "maxLevel": 3},
                { "name": "受伤吸纳为生命", "maxLevel": 4}
            ]
        },
        "腰带": {
            "前缀": [
                { "name": "最大生命", "maxLevel": 10 },
                { "name": "最大魔力(非武器)", "maxLevel": 11 },
                { "name": "最大能量护盾", "maxLevel": 12 },
                { "name": "护甲", "maxLevel": 8 },
                { "name": "攻击技能的元素伤害提高(非武器)", "maxLevel": 6 },
                { "name": "反射物理伤害", "maxLevel": 2 },
                { "name": "药剂效果提高", "maxLevel": 3 },
                { "name": "药剂生命/魔力回复", "maxLevel": 6 }
            ],
            "后缀": [
                { "name": "力量", "maxLevel": 10 },
                { "name": "生命每秒再生", "maxLevel": 9 },
                { "name": "敌人晕眩门槛降低", "maxLevel": 5 },
                { "name": "敌人被晕眩时间延长", "maxLevel": 5 },
                { "name": "火焰抗性", "maxLevel": 8 },
                { "name": "冰霜抗性", "maxLevel": 8 },
                { "name": "闪电抗性", "maxLevel": 8 },
                { "name": "混沌抗性", "maxLevel": 6 },
                { "name": "晕眩和格挡回复提高", "maxLevel": 6 },
                { "name": "药剂充能获取提高/使用降低", "maxLevel": 6 },
                { "name": "药剂效果持续时间延长", "maxLevel": 5 }
            ]
        },

        "手套(str)": {
            "前缀": [
                { "name": "最大生命", "maxLevel": 9 },
                { "name": "基础物理伤害(戒指和手套)", "maxLevel": 4 },
                { "name": "基础火焰伤害(戒指和手套)", "maxLevel": 6 },
                { "name": "基础冰霜伤害(戒指和手套)", "maxLevel": 6 },
                { "name": "基础闪电伤害(戒指和手套)", "maxLevel": 6 },
                { "name": "物理攻击伤害转化为生命偷取", "maxLevel": 1 },
                { "name": "物理攻击伤害转化为魔力偷取", "maxLevel": 1 },
                { "name": "物品稀有度提高(前缀)", "maxLevel": 2 },
                { "name": "该装备的护甲提高", "maxLevel": 7 },
                { "name": "该装备的护甲提高 晕眩回复和格挡回复提高", "maxLevel": 6 },
                { "name": "护甲(防具)", "maxLevel": 7 },
                { "name": "护甲和最大生命(防具)", "maxLevel": 2 }
            ],
            "后缀": [
                { "name": "敏捷", "maxLevel": 10 },
                { "name": "力量", "maxLevel": 9 },
                { "name": "物品稀有度提高(后缀)", "maxLevel": 2 },
                { "name": "生命每秒再生", "maxLevel": 8 },
                { "name": "火焰抗性", "maxLevel": 8 },
                { "name": "冰霜抗性", "maxLevel": 8 },
                { "name": "闪电抗性", "maxLevel": 8 },
                { "name": "混沌抗性", "maxLevel": 6 },
                { "name": "攻击速度加快", "maxLevel": 4 },
                { "name": "命中值(非武器)", "maxLevel": 6 },
                { "name": "击中回血", "maxLevel": 1 },
                { "name": "击败回血", "maxLevel": 3 },
                { "name": "击败回蓝", "maxLevel": 3 },
                { "name": "属性需求降低", "maxLevel": 2 },
                { "name": "生命再生率提高", "maxLevel": 5 }
            ]
        },
        "手套(dex)": {
            "前缀": [
                { "name": "最大生命", "maxLevel": 9 },
                { "name": "基础物理伤害(戒指和手套)", "maxLevel": 4 },
                { "name": "基础火焰伤害(戒指和手套)", "maxLevel": 6 },
                { "name": "基础冰霜伤害(戒指和手套)", "maxLevel": 6 },
                { "name": "基础闪电伤害(戒指和手套)", "maxLevel": 6 },
                { "name": "物理攻击伤害转化为生命偷取", "maxLevel": 1 },
                { "name": "物理攻击伤害转化为魔力偷取", "maxLevel": 1 },
                { "name": "物品稀有度提高(前缀)", "maxLevel": 2 },
                { "name": "该装备的闪避值提高", "maxLevel": 7 },
                { "name": "该装备的闪避值提高 晕眩回复和格挡回复提高", "maxLevel": 6 },
                { "name": "闪避值(防具)", "maxLevel": 7 },
                { "name": "闪避值和最大生命(防具)", "maxLevel": 2 }
            ],
            "后缀": [
                { "name": "敏捷", "maxLevel": 10 },
                { "name": "物品稀有度提高(后缀)", "maxLevel": 2 },
                { "name": "生命每秒再生", "maxLevel": 8 },
                { "name": "火焰抗性", "maxLevel": 8 },
                { "name": "冰霜抗性", "maxLevel": 8 },
                { "name": "闪电抗性", "maxLevel": 8 },
                { "name": "混沌抗性", "maxLevel": 6 },
                { "name": "攻击速度加快", "maxLevel": 4 },
                { "name": "命中值(非武器)", "maxLevel": 6 },
                { "name": "击中回血", "maxLevel": 1 },
                { "name": "击败回血", "maxLevel": 3 },
                { "name": "击败回蓝", "maxLevel": 3 },
                { "name": "属性需求降低", "maxLevel": 2 },
                { "name": "法术伤害压制率", "maxLevel": 5 }
            ]
        },
        "手套(int)": {
            "前缀": [
                { "name": "最大生命", "maxLevel": 9 },
                { "name": "最大魔力(非武器)", "maxLevel": 12 },
                { "name": "最大能量护盾(防具)", "maxLevel": 7 },
                { "name": "基础物理伤害(戒指和手套)", "maxLevel": 4 },
                { "name": "基础火焰伤害(戒指和手套)", "maxLevel": 6 },
                { "name": "基础冰霜伤害(戒指和手套)", "maxLevel": 6 },
                { "name": "基础闪电伤害(戒指和手套)", "maxLevel": 6 },
                { "name": "物理攻击伤害转化为生命偷取", "maxLevel": 1 },
                { "name": "物理攻击伤害转化为魔力偷取", "maxLevel": 1 },
                { "name": "物品稀有度提高(前缀)", "maxLevel": 2 },
                { "name": "该装备的能量护盾提高", "maxLevel": 7 },
                { "name": "该装备的能量护盾提高 晕眩回复和格挡回复提高", "maxLevel": 6 },
                { "name": "能量护盾和最大生命(防具)", "maxLevel": 2 },
                { "name": "能量护盾和最大魔力(防具)", "maxLevel": 2 }
            ],
            "后缀": [
                { "name": "敏捷", "maxLevel": 10 },
                { "name": "智慧", "maxLevel": 9 },
                { "name": "物品稀有度提高(后缀)", "maxLevel": 2 },
                { "name": "生命每秒再生", "maxLevel": 8 },
                { "name": "火焰抗性", "maxLevel": 8 },
                { "name": "冰霜抗性", "maxLevel": 8 },
                { "name": "闪电抗性", "maxLevel": 8 },
                { "name": "混沌抗性", "maxLevel": 6 },
                { "name": "攻击速度加快", "maxLevel": 4 },
                { "name": "命中值(非武器)", "maxLevel": 6 },
                { "name": "击中回血", "maxLevel": 1 },
                { "name": "击败回血", "maxLevel": 3 },
                { "name": "击败回蓝", "maxLevel": 3 },
                { "name": "属性需求降低", "maxLevel": 2 },
                { "name": "能量护盾充能率提高", "maxLevel": 5 }
            ]
        },
        "手套(str_dex)": {
            "前缀": [
                { "name": "最大生命", "maxLevel": 9 },
                { "name": "基础物理伤害(戒指和手套)", "maxLevel": 4 },
                { "name": "基础火焰伤害(戒指和手套)", "maxLevel": 6 },
                { "name": "基础冰霜伤害(戒指和手套)", "maxLevel": 6 },
                { "name": "基础闪电伤害(戒指和手套)", "maxLevel": 6 },
                { "name": "物理攻击伤害转化为生命偷取", "maxLevel": 1 },
                { "name": "物理攻击伤害转化为魔力偷取", "maxLevel": 1 },
                { "name": "物品稀有度提高(前缀)", "maxLevel": 2 },
                { "name": "该装备的护甲,闪避提高", "maxLevel": 7 },
                { "name": "该装备的护甲,闪避提高 晕眩回复和格挡回复提高", "maxLevel": 6 },
                { "name": "护甲和闪避值(防具)", "maxLevel": 4 },
                { "name": "护甲和最大生命(防具)", "maxLevel": 2 },
                { "name": "闪避值和最大生命(防具)", "maxLevel": 2 }
            ],
            "后缀": [
                { "name": "敏捷", "maxLevel": 10 },
                { "name": "力量", "maxLevel": 9 },
                { "name": "物品稀有度提高(后缀)", "maxLevel": 2 },
                { "name": "生命每秒再生", "maxLevel": 8 },
                { "name": "火焰抗性", "maxLevel": 8 },
                { "name": "冰霜抗性", "maxLevel": 8 },
                { "name": "闪电抗性", "maxLevel": 8 },
                { "name": "混沌抗性", "maxLevel": 6 },
                { "name": "攻击速度加快", "maxLevel": 4 },
                { "name": "命中值(非武器)", "maxLevel": 6 },
                { "name": "击中回血", "maxLevel": 1 },
                { "name": "击败回血", "maxLevel": 3 },
                { "name": "击败回蓝", "maxLevel": 3 },
                { "name": "属性需求降低", "maxLevel": 2 },
                { "name": "生命再生率提高", "maxLevel": 5 },
                { "name": "法术伤害压制率", "maxLevel": 5 }
            ]
        },
        "手套(str_int)": {
            "前缀": [
                { "name": "最大生命", "maxLevel": 9 },
                { "name": "最大魔力(非武器)", "maxLevel": 12 },
                { "name": "基础物理伤害(戒指和手套)", "maxLevel": 4 },
                { "name": "基础火焰伤害(戒指和手套)", "maxLevel": 6 },
                { "name": "基础冰霜伤害(戒指和手套)", "maxLevel": 6 },
                { "name": "基础闪电伤害(戒指和手套)", "maxLevel": 6 },
                { "name": "物理攻击伤害转化为生命偷取", "maxLevel": 1 },
                { "name": "物理攻击伤害转化为魔力偷取", "maxLevel": 1 },
                { "name": "物品稀有度提高(前缀)", "maxLevel": 2 },
                { "name": "该装备的护甲,能量护盾提高", "maxLevel": 7 },
                { "name": "该装备的护甲,能量护盾提高 晕眩回复和格挡回复提高", "maxLevel": 6 },
                { "name": "护甲和能量护盾(防具)", "maxLevel": 4 },
                { "name": "护甲和最大生命(防具)", "maxLevel": 2 },
                { "name": "能量护盾和最大生命(防具)", "maxLevel": 2 },
                { "name": "能量护盾和最大魔力(防具)", "maxLevel": 2 }
            ],
            "后缀": [
                { "name": "敏捷", "maxLevel": 10 },
                { "name": "力量", "maxLevel": 9 },
                { "name": "智慧", "maxLevel": 9 },
                { "name": "物品稀有度提高(后缀)", "maxLevel": 2 },
                { "name": "生命每秒再生", "maxLevel": 8 },
                { "name": "火焰抗性", "maxLevel": 8 },
                { "name": "冰霜抗性", "maxLevel": 8 },
                { "name": "闪电抗性", "maxLevel": 8 },
                { "name": "混沌抗性", "maxLevel": 6 },
                { "name": "攻击速度加快", "maxLevel": 4 },
                { "name": "命中值(非武器)", "maxLevel": 6 },
                { "name": "击中回血", "maxLevel": 1 },
                { "name": "击败回血", "maxLevel": 3 },
                { "name": "击败回蓝", "maxLevel": 3 },
                { "name": "属性需求降低", "maxLevel": 2 },
                { "name": "生命再生率提高", "maxLevel": 5 },
                { "name": "能量护盾充能率提高", "maxLevel": 5 }
            ]
        },
        "手套(dex_int)": {
            "前缀": [
                { "name": "最大生命", "maxLevel": 9 },
                { "name": "最大魔力(非武器)", "maxLevel": 12 },
                { "name": "基础物理伤害(戒指和手套)", "maxLevel": 4 },
                { "name": "基础火焰伤害(戒指和手套)", "maxLevel": 6 },
                { "name": "基础冰霜伤害(戒指和手套)", "maxLevel": 6 },
                { "name": "基础闪电伤害(戒指和手套)", "maxLevel": 6 },
                { "name": "物理攻击伤害转化为生命偷取", "maxLevel": 1 },
                { "name": "物理攻击伤害转化为魔力偷取", "maxLevel": 1 },
                { "name": "物品稀有度提高(前缀)", "maxLevel": 2 },
                { "name": "该装备的闪避,能量护盾提高", "maxLevel": 7 },
                { "name": "该装备的闪避,能量护盾提高 晕眩回复和格挡回复提高", "maxLevel": 6 },
                { "name": "闪避值和能量护盾(防具)", "maxLevel": 4 },
                { "name": "闪避值和最大生命(防具)", "maxLevel": 2 },
                { "name": "能量护盾和最大生命(防具)", "maxLevel": 2 },
                { "name": "能量护盾和最大魔力(防具)", "maxLevel": 2 }
            ],
            "后缀": [
                { "name": "敏捷", "maxLevel": 10 },
                { "name": "智慧", "maxLevel": 9 },
                { "name": "物品稀有度提高(后缀)", "maxLevel": 2 },
                { "name": "生命每秒再生", "maxLevel": 8 },
                { "name": "火焰抗性", "maxLevel": 8 },
                { "name": "冰霜抗性", "maxLevel": 8 },
                { "name": "闪电抗性", "maxLevel": 8 },
                { "name": "混沌抗性", "maxLevel": 6 },
                { "name": "攻击速度加快", "maxLevel": 4 },
                { "name": "命中值(非武器)", "maxLevel": 6 },
                { "name": "击中回血", "maxLevel": 1 },
                { "name": "击败回血", "maxLevel": 3 },
                { "name": "击败回蓝", "maxLevel": 3 },
                { "name": "属性需求降低", "maxLevel": 2 },
                { "name": "法术伤害压制率", "maxLevel": 5 },
                { "name": "能量护盾充能率提高", "maxLevel": 5 }
            ]
        },

        "鞋子(str)": {
            "前缀": [
                { "name": "最大生命", "maxLevel": 9 },
                { "name": "物品稀有度提高(前缀)", "maxLevel": 2 },
                { "name": "该装备的护甲提高", "maxLevel": 7 },
                { "name": "该装备的护甲提高 晕眩回复和格挡回复提高", "maxLevel": 6 },
                { "name": "护甲(防具)", "maxLevel": 7 },
                { "name": "护甲和最大生命(防具)", "maxLevel": 2 },
                { "name": "移动速度", "maxLevel": 7 }
            ],
            "后缀": [
                { "name": "力量", "maxLevel": 9 },
                { "name": "物品稀有度提高(后缀)", "maxLevel": 2 },
                { "name": "生命每秒再生", "maxLevel": 8 },
                { "name": "火焰抗性", "maxLevel": 8 },
                { "name": "冰霜抗性", "maxLevel": 8 },
                { "name": "闪电抗性", "maxLevel": 8 },
                { "name": "混沌抗性", "maxLevel": 6 },
                { "name": "晕眩和格挡回复提高", "maxLevel": 6 },
                { "name": "属性需求降低", "maxLevel": 2 },
                { "name": "生命再生率提高", "maxLevel": 5 }
            ]
        },
        "鞋子(dex)": {
            "前缀": [
                { "name": "最大生命", "maxLevel": 9 },
                { "name": "物品稀有度提高(前缀)", "maxLevel": 2 },
                { "name": "该装备的闪避值提高", "maxLevel": 7 },
                { "name": "该装备的闪避值提高 晕眩回复和格挡回复提高", "maxLevel": 6 },
                { "name": "闪避值(防具)", "maxLevel": 7 },
                { "name": "闪避值和最大生命(防具)", "maxLevel": 2 },
                { "name": "移动速度", "maxLevel": 7 }
            ],
            "后缀": [
                { "name": "敏捷", "maxLevel": 9 },
                { "name": "物品稀有度提高(后缀)", "maxLevel": 2 },
                { "name": "生命每秒再生", "maxLevel": 8 },
                { "name": "火焰抗性", "maxLevel": 8 },
                { "name": "冰霜抗性", "maxLevel": 8 },
                { "name": "闪电抗性", "maxLevel": 8 },
                { "name": "混沌抗性", "maxLevel": 6 },
                { "name": "晕眩和格挡回复提高", "maxLevel": 6 },
                { "name": "属性需求降低", "maxLevel": 2 },
                { "name": "法术伤害压制率", "maxLevel": 5 }
            ]
        },
        "鞋子(int)": {
            "前缀": [
                { "name": "最大生命", "maxLevel": 9 },
                { "name": "最大魔力(非武器)", "maxLevel": 12 },
                { "name": "物品稀有度提高(前缀)", "maxLevel": 2 },
                { "name": "该装备的能量护盾提高", "maxLevel": 7 },
                { "name": "该装备的能量护盾提高 晕眩回复和格挡回复提高", "maxLevel": 6 },
                { "name": "最大能量护盾(防具)", "maxLevel": 7 },
                { "name": "能量护盾和最大生命(防具)", "maxLevel": 2 },
                { "name": "能量护盾和最大魔力(防具)", "maxLevel": 2 },
                { "name": "移动速度", "maxLevel": 7 }
            ],
            "后缀": [
                { "name": "智慧", "maxLevel": 9 },
                { "name": "物品稀有度提高(后缀)", "maxLevel": 2 },
                { "name": "生命每秒再生", "maxLevel": 8 },
                { "name": "火焰抗性", "maxLevel": 8 },
                { "name": "冰霜抗性", "maxLevel": 8 },
                { "name": "闪电抗性", "maxLevel": 8 },
                { "name": "混沌抗性", "maxLevel": 6 },
                { "name": "晕眩和格挡回复提高", "maxLevel": 6 },
                { "name": "属性需求降低", "maxLevel": 2 },
                { "name": "能量护盾充能率提高", "maxLevel": 5 }
            ]
        },
        "鞋子(str_dex)": {
            "前缀": [
                { "name": "最大生命", "maxLevel": 9 },
                { "name": "物品稀有度提高(前缀)", "maxLevel": 2 },
                { "name": "该装备的护甲,闪避提高", "maxLevel": 7 },
                { "name": "该装备的护甲,闪避提高 晕眩回复和格挡回复提高", "maxLevel": 6 },
                { "name": "护甲和闪避值(防具)", "maxLevel": 4 },
                { "name": "护甲和最大生命(防具)", "maxLevel": 2 },
                { "name": "闪避值和最大生命(防具)", "maxLevel": 2 },
                { "name": "移动速度", "maxLevel": 7 }
            ],
            "后缀": [
                { "name": "力量", "maxLevel": 9 },
                { "name": "敏捷", "maxLevel": 9 },
                { "name": "物品稀有度提高(后缀)", "maxLevel": 2 },
                { "name": "生命每秒再生", "maxLevel": 8 },
                { "name": "火焰抗性", "maxLevel": 8 },
                { "name": "冰霜抗性", "maxLevel": 8 },
                { "name": "闪电抗性", "maxLevel": 8 },
                { "name": "混沌抗性", "maxLevel": 6 },
                { "name": "晕眩和格挡回复提高", "maxLevel": 6 },
                { "name": "属性需求降低", "maxLevel": 2 },
                { "name": "生命再生率提高", "maxLevel": 5 },
                { "name": "法术伤害压制率", "maxLevel": 5 }
            ]
        },
        "鞋子(str_int)": {
            "前缀": [
                { "name": "最大生命", "maxLevel": 9 },
                { "name": "物品稀有度提高(前缀)", "maxLevel": 2 },
                { "name": "该装备的护甲,能量护盾提高", "maxLevel": 7 },
                { "name": "该装备的护甲,能量护盾提高 晕眩回复和格挡回复提高", "maxLevel": 6 },
                { "name": "护甲和能量护盾(防具)", "maxLevel": 4 },
                { "name": "护甲和最大生命(防具)", "maxLevel": 2 },
                { "name": "能量护盾和最大生命(防具)", "maxLevel": 2 },
                { "name": "能量护盾和最大魔力(防具)", "maxLevel": 2 },
                { "name": "移动速度", "maxLevel": 7 }
            ],
            "后缀": [
                { "name": "力量", "maxLevel": 9 },
                { "name": "智慧", "maxLevel": 9 },
                { "name": "物品稀有度提高(后缀)", "maxLevel": 2 },
                { "name": "生命每秒再生", "maxLevel": 8 },
                { "name": "火焰抗性", "maxLevel": 8 },
                { "name": "冰霜抗性", "maxLevel": 8 },
                { "name": "闪电抗性", "maxLevel": 8 },
                { "name": "混沌抗性", "maxLevel": 6 },
                { "name": "晕眩和格挡回复提高", "maxLevel": 6 },
                { "name": "属性需求降低", "maxLevel": 2 },
                { "name": "生命再生率提高", "maxLevel": 5 },
                { "name": "能量护盾充能率提高", "maxLevel": 5 }
            ]
        },
        "鞋子(dex_int)": {
            "前缀": [
                { "name": "最大生命", "maxLevel": 9 },
                { "name": "最大魔力(非武器)", "maxLevel": 12 },
                { "name": "物品稀有度提高(前缀)", "maxLevel": 2 },
                { "name": "该装备的闪避,能量护盾提高", "maxLevel": 7 },
                { "name": "该装备的闪避,能量护盾提高 晕眩回复和格挡回复提高", "maxLevel": 6 },
                { "name": "闪避值和能量护盾(防具)", "maxLevel": 4 },
                { "name": "闪避值和最大生命(防具)", "maxLevel": 2 },
                { "name": "能量护盾和最大生命(防具)", "maxLevel": 2 },
                { "name": "能量护盾和最大魔力(防具)", "maxLevel": 2 },
                { "name": "移动速度", "maxLevel": 7 }
            ],
            "后缀": [
                { "name": "敏捷", "maxLevel": 9 },
                { "name": "智慧", "maxLevel": 9 },
                { "name": "物品稀有度提高(后缀)", "maxLevel": 2 },
                { "name": "生命每秒再生", "maxLevel": 8 },
                { "name": "火焰抗性", "maxLevel": 8 },
                { "name": "冰霜抗性", "maxLevel": 8 },
                { "name": "闪电抗性", "maxLevel": 8 },
                { "name": "混沌抗性", "maxLevel": 6 },
                { "name": "晕眩和格挡回复提高", "maxLevel": 6 },
                { "name": "属性需求降低", "maxLevel": 2 },
                { "name": "法术伤害压制率", "maxLevel": 5 },
                { "name": "能量护盾充能率提高", "maxLevel": 5 }
            ]
        },

        "头部(str)": {
            "前缀": [
                { "name": "最大生命", "maxLevel": 10 },
                { "name": "物品稀有度提高(前缀)", "maxLevel": 3 },
                { "name": "该装备的护甲提高", "maxLevel": 7 },
                { "name": "该装备的护甲提高 晕眩回复和格挡回复提高", "maxLevel": 6 },
                { "name": "护甲(防具)", "maxLevel": 8 },
                { "name": "护甲和最大生命(防具)", "maxLevel": 3 },
                { "name": "召唤主动技能石", "maxLevel": 2 },
                { "name": "反射物理伤害", "maxLevel": 2 }
            ],
            "后缀": [
                { "name": "力量", "maxLevel": 9 },
                { "name": "智慧", "maxLevel": 10 },
                { "name": "物品稀有度提高(后缀)", "maxLevel": 2 },
                { "name": "生命每秒再生", "maxLevel": 9 },
                { "name": "火焰抗性", "maxLevel": 8 },
                { "name": "冰霜抗性", "maxLevel": 8 },
                { "name": "闪电抗性", "maxLevel": 8 },
                { "name": "混沌抗性", "maxLevel": 6 },
                { "name": "晕眩和格挡回复提高", "maxLevel": 6 },
                { "name": "属性需求降低", "maxLevel": 2 },
                { "name": "命中值(非武器)", "maxLevel": 6 },
                { "name": "命中值和照亮范围扩大", "maxLevel": 3 },
                { "name": "生命再生率提高", "maxLevel": 5 }
            ]
        },
        "头部(dex)": {
            "前缀": [
                { "name": "最大生命", "maxLevel": 10 },
                { "name": "物品稀有度提高(前缀)", "maxLevel": 3 },
                { "name": "该装备的闪避值提高", "maxLevel": 7 },
                { "name": "该装备的闪避值提高 晕眩回复和格挡回复提高", "maxLevel": 6 },
                { "name": "闪避值(防具)", "maxLevel": 8 },
                { "name": "闪避值和最大生命(防具)", "maxLevel": 3 },
                { "name": "召唤主动技能石", "maxLevel": 2 },
                { "name": "反射物理伤害", "maxLevel": 2 }
            ],
            "后缀": [
                { "name": "敏捷", "maxLevel": 9 },
                { "name": "智慧", "maxLevel": 10 },
                { "name": "物品稀有度提高(后缀)", "maxLevel": 2 },
                { "name": "生命每秒再生", "maxLevel": 9 },
                { "name": "火焰抗性", "maxLevel": 8 },
                { "name": "冰霜抗性", "maxLevel": 8 },
                { "name": "闪电抗性", "maxLevel": 8 },
                { "name": "混沌抗性", "maxLevel": 6 },
                { "name": "晕眩和格挡回复提高", "maxLevel": 6 },
                { "name": "属性需求降低", "maxLevel": 2 },
                { "name": "命中值(非武器)", "maxLevel": 6 },
                { "name": "命中值和照亮范围扩大", "maxLevel": 3 },
                { "name": "法术伤害压制率", "maxLevel": 5 }
            ]
        },
        "头部(int)": {
            "前缀": [
                { "name": "最大生命", "maxLevel": 10 },
                { "name": "最大魔力(非武器)", "maxLevel": 12 },
                { "name": "物品稀有度提高(前缀)", "maxLevel": 3 },
                { "name": "该装备的能量护盾提高", "maxLevel": 7 },
                { "name": "该装备的能量护盾提高 晕眩回复和格挡回复提高", "maxLevel": 6 },
                { "name": "最大能量护盾(防具)", "maxLevel": 8 },
                { "name": "能量护盾和最大生命(防具)", "maxLevel": 3 },
                { "name": "能量护盾和最大魔力(防具)", "maxLevel": 3 },
                { "name": "召唤主动技能石", "maxLevel": 2 },
                { "name": "反射物理伤害", "maxLevel": 2 }
            ],
            "后缀": [
                { "name": "智慧", "maxLevel": 10 },
                { "name": "物品稀有度提高(后缀)", "maxLevel": 2 },
                { "name": "生命每秒再生", "maxLevel": 9 },
                { "name": "火焰抗性", "maxLevel": 8 },
                { "name": "冰霜抗性", "maxLevel": 8 },
                { "name": "闪电抗性", "maxLevel": 8 },
                { "name": "混沌抗性", "maxLevel": 6 },
                { "name": "晕眩和格挡回复提高", "maxLevel": 6 },
                { "name": "属性需求降低", "maxLevel": 2 },
                { "name": "命中值(非武器)", "maxLevel": 6 },
                { "name": "命中值和照亮范围扩大", "maxLevel": 3 },
                { "name": "能量护盾充能率提高", "maxLevel": 5 }
            ]
        },
        "头部(str_dex)": {
            "前缀": [
                { "name": "最大生命", "maxLevel": 10 },
                { "name": "物品稀有度提高(前缀)", "maxLevel": 3 },
                { "name": "该装备的护甲,闪避提高", "maxLevel": 7 },
                { "name": "该装备的护甲,闪避提高 晕眩回复和格挡回复提高", "maxLevel": 6 },
                { "name": "护甲和闪避值(防具)", "maxLevel": 5 },
                { "name": "护甲和最大生命(防具)", "maxLevel": 3 },
                { "name": "闪避值和最大生命(防具)", "maxLevel": 3 },
                { "name": "召唤主动技能石", "maxLevel": 2 },
                { "name": "反射物理伤害", "maxLevel": 2 }
            ],
            "后缀": [
                { "name": "力量", "maxLevel": 9 },
                { "name": "敏捷", "maxLevel": 9 },
                { "name": "智慧", "maxLevel": 10 },
                { "name": "物品稀有度提高(后缀)", "maxLevel": 2 },
                { "name": "生命每秒再生", "maxLevel": 9 },
                { "name": "火焰抗性", "maxLevel": 8 },
                { "name": "冰霜抗性", "maxLevel": 8 },
                { "name": "闪电抗性", "maxLevel": 8 },
                { "name": "混沌抗性", "maxLevel": 6 },
                { "name": "晕眩和格挡回复提高", "maxLevel": 6 },
                { "name": "属性需求降低", "maxLevel": 2 },
                { "name": "命中值(非武器)", "maxLevel": 6 },
                { "name": "命中值和照亮范围扩大", "maxLevel": 3 },
                { "name": "生命再生率提高", "maxLevel": 5 },
                { "name": "法术伤害压制率", "maxLevel": 5 }
            ]
        },
        "头部(str_int)": {
            "前缀": [
                { "name": "最大生命", "maxLevel": 10 },
                { "name": "最大魔力(非武器)", "maxLevel": 12 },
                { "name": "物品稀有度提高(前缀)", "maxLevel": 3 },
                { "name": "该装备的护甲,能量护盾提高", "maxLevel": 7 },
                { "name": "该装备的护甲,能量护盾提高 晕眩回复和格挡回复提高", "maxLevel": 6 },
                { "name": "护甲和能量护盾(防具)", "maxLevel": 5 },
                { "name": "护甲和最大生命(防具)", "maxLevel": 3 },
                { "name": "能量护盾和最大生命(防具)", "maxLevel": 3 },
                { "name": "能量护盾和最大魔力(防具)", "maxLevel": 3 },
                { "name": "召唤主动技能石", "maxLevel": 2 },
                { "name": "反射物理伤害", "maxLevel": 2 }
            ],
            "后缀": [
                { "name": "力量", "maxLevel": 9 },
                { "name": "智慧", "maxLevel": 10 },
                { "name": "物品稀有度提高(后缀)", "maxLevel": 2 },
                { "name": "生命每秒再生", "maxLevel": 9 },
                { "name": "火焰抗性", "maxLevel": 8 },
                { "name": "冰霜抗性", "maxLevel": 8 },
                { "name": "闪电抗性", "maxLevel": 8 },
                { "name": "混沌抗性", "maxLevel": 6 },
                { "name": "晕眩和格挡回复提高", "maxLevel": 6 },
                { "name": "属性需求降低", "maxLevel": 2 },
                { "name": "命中值(非武器)", "maxLevel": 6 },
                { "name": "命中值和照亮范围扩大", "maxLevel": 3 },
                { "name": "生命再生率提高", "maxLevel": 5 },
                { "name": "能量护盾充能率提高", "maxLevel": 5 }
            ]
        },
        "头部(dex_int)": {
            "前缀": [
                { "name": "最大生命", "maxLevel": 10 },
                { "name": "最大魔力(非武器)", "maxLevel": 12 },
                { "name": "物品稀有度提高(前缀)", "maxLevel": 3 },
                { "name": "该装备的闪避,能量护盾提高", "maxLevel": 7 },
                { "name": "该装备的闪避,能量护盾提高 晕眩回复和格挡回复提高", "maxLevel": 6 },
                { "name": "闪避值和能量护盾(防具)", "maxLevel": 5 },
                { "name": "闪避值和最大生命(防具)", "maxLevel": 3 },
                { "name": "能量护盾和最大生命(防具)", "maxLevel": 3 },
                { "name": "能量护盾和最大魔力(防具)", "maxLevel": 3 },
                { "name": "召唤主动技能石", "maxLevel": 2 },
                { "name": "反射物理伤害", "maxLevel": 2 }
            ],
            "后缀": [
                { "name": "敏捷", "maxLevel": 9 },
                { "name": "智慧", "maxLevel": 10 },
                { "name": "物品稀有度提高(后缀)", "maxLevel": 2 },
                { "name": "生命每秒再生", "maxLevel": 9 },
                { "name": "火焰抗性", "maxLevel": 8 },
                { "name": "冰霜抗性", "maxLevel": 8 },
                { "name": "闪电抗性", "maxLevel": 8 },
                { "name": "混沌抗性", "maxLevel": 6 },
                { "name": "晕眩和格挡回复提高", "maxLevel": 6 },
                { "name": "属性需求降低", "maxLevel": 2 },
                { "name": "命中值(非武器)", "maxLevel": 6 },
                { "name": "命中值和照亮范围扩大", "maxLevel": 3 },
                { "name": "法术伤害压制率", "maxLevel": 5 },
                { "name": "能量护盾充能率提高", "maxLevel": 5 }
            ]
        },

        "盾牌(str)": {
            "前缀": [
                { "name": "最大生命", "maxLevel": 11 },
                { "name": "该装备的护甲提高", "maxLevel": 8 },
                { "name": "该装备的护甲提高 晕眩回复和格挡回复提高", "maxLevel": 6 },
                { "name": "护甲(防具)", "maxLevel": 10 },
                { "name": "护甲和最大生命(防具)", "maxLevel": 3 },
                { "name": "近战技能石等级", "maxLevel": 2 },
                { "name": "反射物理伤害", "maxLevel": 4 }
            ],
            "后缀": [
                { "name": "力量", "maxLevel": 9 },
                { "name": "生命每秒再生", "maxLevel": 10 },
                { "name": "所有元素抗性", "maxLevel": 6 },
                { "name": "火焰抗性", "maxLevel": 8 },
                { "name": "冰霜抗性", "maxLevel": 8 },
                { "name": "闪电抗性", "maxLevel": 8 },
                { "name": "混沌抗性", "maxLevel": 6 },
                { "name": "全部抗性上限", "maxLevel": 2 },
                { "name": "火焰抗性上限", "maxLevel": 3 },
                { "name": "冰霜抗性上限", "maxLevel": 3 },
                { "name": "闪电抗性上限", "maxLevel": 3 },
                { "name": "混沌抗性上限", "maxLevel": 3 },
                { "name": "晕眩和格挡回复提高", "maxLevel": 6 },
                { "name": "属性需求降低", "maxLevel": 2 },
                { "name": "攻击格挡率", "maxLevel": 7 },
                { "name": "格挡回复", "maxLevel": 6 },
                { "name": "避免元素异常", "maxLevel": 4 },
                { "name": "受到暴击伤害减少", "maxLevel": 4 },
                { "name": "额外物理伤害减免", "maxLevel": 5 }
            ]
        },
        "盾牌(dex)": {
            "前缀": [
                { "name": "最大生命", "maxLevel": 11 },
                { "name": "该装备的闪避值提高", "maxLevel": 8 },
                { "name": "该装备的闪避值提高 晕眩回复和格挡回复提高", "maxLevel": 6 },
                { "name": "闪避值(防具)", "maxLevel": 10 },
                { "name": "闪避值和最大生命(防具)", "maxLevel": 3 },
                { "name": "近战技能石等级", "maxLevel": 2 },
                { "name": "反射物理伤害", "maxLevel": 4 }
            ],
            "后缀": [
                { "name": "敏捷", "maxLevel": 9 },
                { "name": "攻击速度加快", "maxLevel": 4 },
                { "name": "命中值(非武器)", "maxLevel": 5 },
                { "name": "生命每秒再生", "maxLevel": 10 },
                { "name": "所有元素抗性", "maxLevel": 6 },
                { "name": "火焰抗性", "maxLevel": 8 },
                { "name": "冰霜抗性", "maxLevel": 8 },
                { "name": "闪电抗性", "maxLevel": 8 },
                { "name": "混沌抗性", "maxLevel": 6 },
                { "name": "全部抗性上限", "maxLevel": 2 },
                { "name": "火焰抗性上限", "maxLevel": 3 },
                { "name": "冰霜抗性上限", "maxLevel": 3 },
                { "name": "闪电抗性上限", "maxLevel": 3 },
                { "name": "混沌抗性上限", "maxLevel": 3 },
                { "name": "晕眩和格挡回复提高", "maxLevel": 6 },
                { "name": "属性需求降低", "maxLevel": 2 },
                { "name": "攻击格挡率", "maxLevel": 7 },
                { "name": "法术伤害压制率", "maxLevel": 5 },
                { "name": "避免元素异常", "maxLevel": 4 }
            ]
        },
        "盾牌(int)": {
            "前缀": [
                { "name": "最大生命", "maxLevel": 11 },
                { "name": "最大魔力(非武器)", "maxLevel": 12 },
                { "name": "该装备的能量护盾提高", "maxLevel": 8 },
                { "name": "该装备的能量护盾提高 晕眩回复和格挡回复提高", "maxLevel": 6 },
                { "name": "最大能量护盾(防具)", "maxLevel": 10 },
                { "name": "能量护盾和最大生命(防具)", "maxLevel": 3 },
                { "name": "能量护盾和最大魔力(防具)", "maxLevel": 3 },
                { "name": "法术伤害提高(单手)", "maxLevel": 8},
                { "name": "所有法术主动技能石等级(单手)", "maxLevel": 1 },
                { "name": "反射物理伤害", "maxLevel": 4 }
            ],
            "后缀": [
                { "name": "智慧", "maxLevel": 9 },
                { "name": "生命每秒再生", "maxLevel": 10 },
                { "name": "魔力再生率提高", "maxLevel": 6 },
                { "name": "所有元素抗性", "maxLevel": 6 },
                { "name": "火焰抗性", "maxLevel": 8 },
                { "name": "冰霜抗性", "maxLevel": 8 },
                { "name": "闪电抗性", "maxLevel": 8 },
                { "name": "混沌抗性", "maxLevel": 6 },
                { "name": "全部抗性上限", "maxLevel": 2 },
                { "name": "火焰抗性上限", "maxLevel": 3 },
                { "name": "冰霜抗性上限", "maxLevel": 3 },
                { "name": "闪电抗性上限", "maxLevel": 3 },
                { "name": "混沌抗性上限", "maxLevel": 3 },
                { "name": "晕眩和格挡回复提高", "maxLevel": 6 },
                { "name": "属性需求降低", "maxLevel": 2 },
                { "name": "攻击格挡率", "maxLevel": 7 },
                { "name": "法术格挡率", "maxLevel": 4 },
                { "name": "避免元素异常", "maxLevel": 4 },
                { "name": "法术暴击率提高", "maxLevel": 6 },
                { "name": "能量护盾充能时间提前", "maxLevel": 5 }
            ]
        },
        "盾牌(str_dex)": {
            "前缀": [
                { "name": "最大生命", "maxLevel": 11 },
                { "name": "该装备的护甲,闪避提高", "maxLevel": 8 },
                { "name": "该装备的护甲,闪避提高 晕眩回复和格挡回复提高", "maxLevel": 6 },
                { "name": "护甲和闪避值(防具)", "maxLevel": 7 },
                { "name": "护甲和最大生命(防具)", "maxLevel": 3 },
                { "name": "闪避值和最大生命(防具)", "maxLevel": 3 },
                { "name": "近战技能石等级", "maxLevel": 2 },
                { "name": "反射物理伤害", "maxLevel": 4 }
            ],
            "后缀": [
                { "name": "力量", "maxLevel": 9 },
                { "name": "敏捷", "maxLevel": 9 },
                { "name": "攻击速度加快", "maxLevel": 4 },
                { "name": "命中值(非武器)", "maxLevel": 5 },
                { "name": "生命每秒再生", "maxLevel": 10 },
                { "name": "所有元素抗性", "maxLevel": 6 },
                { "name": "火焰抗性", "maxLevel": 8 },
                { "name": "冰霜抗性", "maxLevel": 8 },
                { "name": "闪电抗性", "maxLevel": 8 },
                { "name": "混沌抗性", "maxLevel": 6 },
                { "name": "全部抗性上限", "maxLevel": 2 },
                { "name": "火焰抗性上限", "maxLevel": 3 },
                { "name": "冰霜抗性上限", "maxLevel": 3 },
                { "name": "闪电抗性上限", "maxLevel": 3 },
                { "name": "混沌抗性上限", "maxLevel": 3 },
                { "name": "晕眩和格挡回复提高", "maxLevel": 6 },
                { "name": "属性需求降低", "maxLevel": 2 },
                { "name": "攻击格挡率", "maxLevel": 7 },
                { "name": "格挡回复", "maxLevel": 6 },
                { "name": "避免元素异常", "maxLevel": 4 },
                { "name": "受到暴击伤害减少", "maxLevel": 4 },
                { "name": "法术伤害压制率", "maxLevel": 5 },
                { "name": "额外物理伤害减免", "maxLevel": 5 }
            ]
        },
        "盾牌(str_int)": {
            "前缀": [
                { "name": "最大生命", "maxLevel": 11 },
                { "name": "最大魔力(非武器)", "maxLevel": 12 },
                { "name": "该装备的护甲,能量护盾提高", "maxLevel": 8 },
                { "name": "该装备的护甲,能量护盾提高 晕眩回复和格挡回复提高", "maxLevel": 6 },
                { "name": "护甲和能量护盾(防具)", "maxLevel": 7 },
                { "name": "护甲和最大生命(防具)", "maxLevel": 3 },
                { "name": "能量护盾和最大生命(防具)", "maxLevel": 3 },
                { "name": "能量护盾和最大魔力(防具)", "maxLevel": 3 },
                { "name": "近战技能石等级", "maxLevel": 2 },
                { "name": "反射物理伤害", "maxLevel": 4 }
            ],
            "后缀": [
                { "name": "力量", "maxLevel": 9 },
                { "name": "智慧", "maxLevel": 9 },
                { "name": "生命每秒再生", "maxLevel": 10 },
                { "name": "魔力再生率提高", "maxLevel": 6 },
                { "name": "法术暴击率提高", "maxLevel": 6 },
                { "name": "所有元素抗性", "maxLevel": 6 },
                { "name": "火焰抗性", "maxLevel": 8 },
                { "name": "冰霜抗性", "maxLevel": 8 },
                { "name": "闪电抗性", "maxLevel": 8 },
                { "name": "混沌抗性", "maxLevel": 6 },
                { "name": "全部抗性上限", "maxLevel": 2 },
                { "name": "火焰抗性上限", "maxLevel": 3 },
                { "name": "冰霜抗性上限", "maxLevel": 3 },
                { "name": "闪电抗性上限", "maxLevel": 3 },
                { "name": "混沌抗性上限", "maxLevel": 3 },
                { "name": "晕眩和格挡回复提高", "maxLevel": 6 },
                { "name": "属性需求降低", "maxLevel": 2 },
                { "name": "攻击格挡率", "maxLevel": 7 },
                { "name": "法术格挡率", "maxLevel": 4 },
                { "name": "格挡回复", "maxLevel": 6 },
                { "name": "能量护盾充能时间提前", "maxLevel": 5 },
                { "name": "避免元素异常", "maxLevel": 4 },
                { "name": "受到暴击伤害减少", "maxLevel": 4 },
                { "name": "额外物理伤害减免", "maxLevel": 5 }
            ]
        },
        "盾牌(dex_int)": {
            "前缀": [
                { "name": "最大生命", "maxLevel": 11 },
                { "name": "最大魔力(非武器)", "maxLevel": 12 },
                { "name": "该装备的闪避,能量护盾提高", "maxLevel": 8 },
                { "name": "该装备的闪避,能量护盾提高 晕眩回复和格挡回复提高", "maxLevel": 6 },
                { "name": "闪避值和能量护盾(防具)", "maxLevel": 7 },
                { "name": "闪避值和最大生命(防具)", "maxLevel": 3 },
                { "name": "能量护盾和最大生命(防具)", "maxLevel": 3 },
                { "name": "能量护盾和最大魔力(防具)", "maxLevel": 3 },
                { "name": "近战技能石等级", "maxLevel": 2 },
                { "name": "反射物理伤害", "maxLevel": 4 }
            ],
            "后缀": [
                { "name": "敏捷", "maxLevel": 9 },
                { "name": "智慧", "maxLevel": 9 },
                { "name": "生命每秒再生", "maxLevel": 10 },
                { "name": "攻击速度加快", "maxLevel": 4 },
                { "name": "命中值(非武器)", "maxLevel": 5 },
                { "name": "魔力再生率提高", "maxLevel": 6 },
                { "name": "所有元素抗性", "maxLevel": 6 },
                { "name": "火焰抗性", "maxLevel": 8 },
                { "name": "冰霜抗性", "maxLevel": 8 },
                { "name": "闪电抗性", "maxLevel": 8 },
                { "name": "混沌抗性", "maxLevel": 6 },
                { "name": "全部抗性上限", "maxLevel": 2 },
                { "name": "火焰抗性上限", "maxLevel": 3 },
                { "name": "冰霜抗性上限", "maxLevel": 3 },
                { "name": "闪电抗性上限", "maxLevel": 3 },
                { "name": "混沌抗性上限", "maxLevel": 3 },
                { "name": "晕眩和格挡回复提高", "maxLevel": 6 },
                { "name": "属性需求降低", "maxLevel": 2 },
                { "name": "攻击格挡率", "maxLevel": 7 },
                { "name": "避免元素异常", "maxLevel": 4 },
                { "name": "法术格挡率", "maxLevel": 4 },
                { "name": "法术暴击率提高", "maxLevel": 6 },
                { "name": "能量护盾充能时间提前", "maxLevel": 5 },
                { "name": "法术伤害压制率", "maxLevel": 5 }
            ]
        },

        "胸甲(str)": {
            "前缀": [
                { "name": "最大生命", "maxLevel": 13 },
                { "name": "该装备的护甲提高", "maxLevel": 8 },
                { "name": "该装备的护甲提高 晕眩回复和格挡回复提高", "maxLevel": 6 },
                { "name": "护甲(防具)", "maxLevel": 11},
                { "name": "护甲和最大生命(防具)", "maxLevel": 4 },
                { "name": "反射物理伤害", "maxLevel": 4 }
            ],
            "后缀": [
                { "name": "力量", "maxLevel": 9 },
                { "name": "生命每秒再生", "maxLevel": 11 },
                { "name": "火焰抗性", "maxLevel": 8 },
                { "name": "冰霜抗性", "maxLevel": 8 },
                { "name": "闪电抗性", "maxLevel": 8 },
                { "name": "混沌抗性", "maxLevel": 6 },
                { "name": "晕眩和格挡回复提高", "maxLevel": 6 },
                { "name": "属性需求降低", "maxLevel": 2 },
                { "name": "额外物理伤害减免", "maxLevel": 5 }
            ]
        },
        "胸甲(dex))": {
            "前缀": [
                { "name": "最大生命", "maxLevel": 13 },
                { "name": "该装备的闪避值提高", "maxLevel": 8 },
                { "name": "该装备的闪避值提高 晕眩回复和格挡回复提高", "maxLevel": 6 },
                { "name": "闪避值(防具)", "maxLevel": 11 },
                { "name": "闪避值和最大生命(防具)", "maxLevel": 4 },
                { "name": "反射物理伤害", "maxLevel": 4 }
            ],
            "后缀": [
                { "name": "敏捷", "maxLevel": 9 },
                { "name": "生命每秒再生", "maxLevel": 11 },
                { "name": "火焰抗性", "maxLevel": 8 },
                { "name": "冰霜抗性", "maxLevel": 8 },
                { "name": "闪电抗性", "maxLevel": 8 },
                { "name": "混沌抗性", "maxLevel": 6 },
                { "name": "晕眩和格挡回复提高", "maxLevel": 6 },
                { "name": "属性需求降低", "maxLevel": 2 },
                { "name": "法术伤害压制率", "maxLevel": 5 }
            ]
        },
        "胸甲(int)": {
            "前缀": [
                { "name": "最大生命", "maxLevel": 13 },
                { "name": "最大魔力(非武器)", "maxLevel": 12 },
                { "name": "该装备的能量护盾提高", "maxLevel": 8 },
                { "name": "该装备的能量护盾提高 晕眩回复和格挡回复提高", "maxLevel": 6 },
                { "name": "最大能量护盾(防具)", "maxLevel": 11 },
                { "name": "能量护盾和最大生命(防具)", "maxLevel": 4 },
                { "name": "能量护盾和最大魔力(防具)", "maxLevel": 4 },
                { "name": "反射物理伤害", "maxLevel": 4 }
            ],
            "后缀": [
                { "name": "智慧", "maxLevel": 9 },
                { "name": "生命每秒再生", "maxLevel": 11 },
                { "name": "火焰抗性", "maxLevel": 8 },
                { "name": "冰霜抗性", "maxLevel": 8 },
                { "name": "闪电抗性", "maxLevel": 8 },
                { "name": "混沌抗性", "maxLevel": 6 },
                { "name": "晕眩和格挡回复提高", "maxLevel": 6 },
                { "name": "属性需求降低", "maxLevel": 2 },
                { "name": "能量护盾充能时间提前", "maxLevel": 5 }
            ]
        },
        "胸甲(str_dex)": {
            "前缀": [
                { "name": "最大生命", "maxLevel": 13 },
                { "name": "该装备的护甲,闪避提高", "maxLevel": 8 },
                { "name": "该装备的护甲,闪避提高 晕眩回复和格挡回复提高", "maxLevel": 6 },
                { "name": "护甲和闪避值(防具)", "maxLevel": 8 },
                { "name": "护甲和最大生命(防具)", "maxLevel": 4 },
                { "name": "闪避值和最大生命(防具)", "maxLevel": 4 },
                { "name": "反射物理伤害", "maxLevel": 4 }
            ],
            "后缀": [
                { "name": "力量", "maxLevel": 9 },
                { "name": "敏捷", "maxLevel": 9 },
                { "name": "生命每秒再生", "maxLevel": 11 },
                { "name": "火焰抗性", "maxLevel": 8 },
                { "name": "冰霜抗性", "maxLevel": 8 },
                { "name": "闪电抗性", "maxLevel": 8 },
                { "name": "混沌抗性", "maxLevel": 6 },
                { "name": "晕眩和格挡回复提高", "maxLevel": 6 },
                { "name": "属性需求降低", "maxLevel": 2 },
                { "name": "法术伤害压制率", "maxLevel": 5 },
                { "name": "额外物理伤害减免", "maxLevel": 5 }
            ]
        },
        "胸甲(str_int)": {
            "前缀": [
                { "name": "最大生命", "maxLevel": 13 },
                { "name": "最大魔力(非武器)", "maxLevel": 12 },
                { "name": "该装备的护甲,能量护盾提高", "maxLevel": 8 },
                { "name": "该装备的护甲,能量护盾提高 晕眩回复和格挡回复提高", "maxLevel": 6 },
                { "name": "护甲和能量护盾(防具)", "maxLevel": 8 },
                { "name": "护甲和最大生命(防具)", "maxLevel": 4 },
                { "name": "能量护盾和最大生命(防具)", "maxLevel": 4 },
                { "name": "能量护盾和最大魔力(防具)", "maxLevel": 4 },
                { "name": "反射物理伤害", "maxLevel": 4 }
            ],
            "后缀": [
                { "name": "力量", "maxLevel": 9 },
                { "name": "智慧", "maxLevel": 9 },
                { "name": "生命每秒再生", "maxLevel": 11 },
                { "name": "火焰抗性", "maxLevel": 8 },
                { "name": "冰霜抗性", "maxLevel": 8 },
                { "name": "闪电抗性", "maxLevel": 8 },
                { "name": "混沌抗性", "maxLevel": 6 },
                { "name": "晕眩和格挡回复提高", "maxLevel": 6 },
                { "name": "属性需求降低", "maxLevel": 2 },
                { "name": "额外物理伤害减免", "maxLevel": 5 },
                { "name": "能量护盾充能时间提前", "maxLevel": 5 }
            ]
        },
        "胸甲(dex_int)": {
            "前缀": [
                { "name": "最大生命", "maxLevel": 13 },
                { "name": "最大魔力(非武器)", "maxLevel": 12 },
                { "name": "该装备的闪避,能量护盾提高", "maxLevel": 8 },
                { "name": "该装备的闪避,能量护盾提高 晕眩回复和格挡回复提高", "maxLevel": 6 },
                { "name": "闪避值和能量护盾(防具)", "maxLevel": 8 },
                { "name": "闪避值和最大生命(防具)", "maxLevel": 4 },
                { "name": "能量护盾和最大生命(防具)", "maxLevel": 4 },
                { "name": "能量护盾和最大魔力(防具)", "maxLevel": 4 },
                { "name": "反射物理伤害", "maxLevel": 4 }
            ],
            "后缀": [
                { "name": "敏捷", "maxLevel": 9 },
                { "name": "智慧", "maxLevel": 9 },
                { "name": "生命每秒再生", "maxLevel": 11 },
                { "name": "火焰抗性", "maxLevel": 8 },
                { "name": "冰霜抗性", "maxLevel": 8 },
                { "name": "闪电抗性", "maxLevel": 8 },
                { "name": "混沌抗性", "maxLevel": 6 },
                { "name": "晕眩和格挡回复提高", "maxLevel": 6 },
                { "name": "属性需求降低", "maxLevel": 2 },
                { "name": "法术伤害压制率", "maxLevel": 5 },
                { "name": "能量护盾充能时间提前", "maxLevel": 5 }
            ]
        },
        "胸甲(str_dex_int)": {
            "前缀": [
                { "name": "最大生命", "maxLevel": 13 },
                { "name": "最大魔力(非武器)", "maxLevel": 12 },
                { "name": "该装备的护甲,闪避,能量护盾提高", "maxLevel": 7 },
                { "name": "该装备的护甲,闪避,能量护盾提高 晕眩回复和格挡回复提高", "maxLevel": 6 },
                { "name": "护甲和闪避值(防具)", "maxLevel": 8 },
                { "name": "护甲和能量护盾(防具)", "maxLevel": 8 },
                { "name": "闪避值和能量护盾(防具)", "maxLevel": 8 },
                { "name": "护甲和最大生命(防具)", "maxLevel": 4 },
                { "name": "闪避值和最大生命(防具)", "maxLevel": 4 },
                { "name": "能量护盾和最大生命(防具)", "maxLevel": 4 },
                { "name": "能量护盾和最大魔力(防具)", "maxLevel": 4 },
                { "name": "反射物理伤害", "maxLevel": 4 }
            ],
            "后缀": [
                { "name": "力量", "maxLevel": 9 },
                { "name": "敏捷", "maxLevel": 9 },
                { "name": "智慧", "maxLevel": 9 },
                { "name": "生命每秒再生", "maxLevel": 11 },
                { "name": "火焰抗性", "maxLevel": 8 },
                { "name": "冰霜抗性", "maxLevel": 8 },
                { "name": "闪电抗性", "maxLevel": 8 },
                { "name": "混沌抗性", "maxLevel": 6 },
                { "name": "晕眩和格挡回复提高", "maxLevel": 6 },
                { "name": "属性需求降低", "maxLevel": 2 },
                { "name": "额外物理伤害减免", "maxLevel": 5 },
                { "name": "法术伤害压制率", "maxLevel": 5 },
                { "name": "能量护盾充能时间提前", "maxLevel": 5 }
            ]
        }
    };

    var affixLevels = {
    "物品稀有度提高(前缀)": [
        { "name": "喜鹊的", "value": "(8–12)% 物品稀有度提高", "level": 1 },
        { "name": "海盗的", "value": "(13–18)% 物品稀有度提高", "level": 2 },
        { "name": "龙的", "value": "(19–24)% 物品稀有度提高", "level": 3 },
        { "name": "普兰德斯的", "value": "(25–28)% 物品稀有度提高", "level": 4 }
    ],
    "物品稀有度提高(后缀)": [
        { "name": "掠夺之", "value": "(6–10)% 物品稀有度提高", "level": 1 },
        { "name": "扫荡之", "value": "(11–14)% 物品稀有度提高", "level": 2 },
        { "name": "考古之", "value": "(15–20)% 物品稀有度提高", "level": 3 },
        { "name": "挖掘之", "value": "(21–26)% 物品稀有度提高", "level": 4 }
    ],

    "移动速度": [
        { "name": "跑步的", "value": "移动速度加快 10%", "level": 1 },
        { "name": "短跑的", "value": "移动速度加快 15%", "level": 2 },
        { "name": "种马的", "value": "移动速度加快 20%", "level": 3 },
        { "name": "瞪羚的", "value": "移动速度加快 25%", "level": 4 },
        { "name": "猎豹的", "value": "移动速度加快 30%", "level": 5 },
        { "name": "地狱的", "value": "移动速度加快 35%", "level": 6 }
    ],
    "反射物理伤害": [
        { "name": "多刺的", "value": "反射 (1–4) 物理伤害给近战攻击者", "level": 1 },
        { "name": "带刺的", "value": "反射 (5–10) 物理伤害给近战攻击者", "level": 10 },
        { "name": "尖刺的", "value": "反射 (11–24) 物理伤害给近战攻击者", "level": 20 },
        { "name": "锯齿的", "value": "反射 (25–50) 物理伤害给近战攻击者", "level": 35 }
    ],

    "法术伤害压制率": [
        { "name": "辩驳之", "value": "法术伤害压制率 +(5–6)%", "level": 1 },
        { "name": "响鼻之", "value": "法术伤害压制率 +(7–8)%", "level": 2 },
        { "name": "撤销之", "value": "法术伤害压制率 +(9–10)%", "level": 3 },
        { "name": "放弃之", "value": "法术伤害压制率 +(11–12)%", "level": 4 },
        { "name": "保命之", "value": "法术伤害压制率 +(13–14)%", "level": 5 }
    ],
    "晕眩和格挡回复提高": [
        { "name": "厚皮之", "value": "(11–13)% 晕眩回复和格挡回复提高", "level": 1 },
        { "name": "石皮之", "value": "(14–16)% 晕眩回复和格挡回复提高", "level": 2 },
        { "name": "金属皮之", "value": "(17–19)% 晕眩回复和格挡回复提高", "level": 3 },
        { "name": "钢皮之", "value": "(20–22)% 晕眩回复和格挡回复提高", "level": 4 },
        { "name": "金刚皮之", "value": "(23–25)% 晕眩回复和格挡回复提高", "level": 5 },
        { "name": "玉皮之", "value": "(26–28)% 晕眩回复和格挡回复提高", "level": 6 }
    ],
    "额外物理伤害减免": [
        { "name": "巡夜人之", "value": "4% 额外物理伤害减免", "level": 1 },
        { "name": "哨兵之", "value": "5% 额外物理伤害减免", "level": 2 },
        { "name": "护卫之", "value": "6% 额外物理伤害减免", "level": 3 },
        { "name": "保卫者之", "value": "7% 额外物理伤害减免", "level": 4 },
        { "name": "保护者之", "value": "8% 额外物理伤害减免", "level": 5 }
    ],
    "受伤吸纳为生命": [
        { "name": "包扎之", "value": "将所受伤害的(4–6)%吸纳为生命", "level": 1 },
        { "name": "缝针之", "value": "将所受伤害的(7–9)%吸纳为生命", "level": 2 },
        { "name": "缝合之", "value": "将所受伤害的(10–12)%吸纳为生命", "level": 3 },
        { "name": "补肉之", "value": " 将所受伤害的(13–15)%吸纳为生命", "level": 4 }
    ],

    "攻击格挡率":[
        {"name": "拦截之", "value": "攻击格挡率提高 (1–3)%", "level": 1},
        {"name": "墙面之", "value": "攻击格挡率提高 (4–5)%", "level": 2},
        {"name": "阻断之", "value": "攻击格挡率提高 (6–7)%", "level": 3},
        {"name": "坚定之", "value": "攻击格挡率提高 (8–9)%", "level": 4},
        {"name": "扶壁之", "value": "攻击格挡率提高 (10–11)%", "level": 5},
        {"name": "哨兵之", "value": "攻击格挡率提高 (12–13)%", "level": 6},
        {"name": "要塞之", "value": "攻击格挡率提高 (14–15)%", "level": 7}
    ],
    "法术格挡率":[
        {"name": "障碍之", "value": "(4–6)% 法术伤害格挡几率", "level": 30},
        {"name": "堡垒之", "value": "(7–9)% 法术伤害格挡几率", "level": 52},
        {"name": "木栅之", "value": "(10–12)% 法术伤害格挡几率", "level": 71},
        {"name": "壁垒之", "value": "(13–15)% 法术伤害格挡几率", "level": 84}
    ],
    "格挡回复":[
        {"name": "修复之", "value": "生命在你格挡时 (5–15)", "level": 1},
        {"name": "回潮之", "value": "生命在你格挡时 (16–25)", "level": 2},
        {"name": "重续之", "value": "生命在你格挡时 (26–40)", "level": 3},
        {"name": "重生之", "value": "生命在你格挡时 (41–60)", "level": 4},
        {"name": "反弹之", "value": "生命在你格挡时 (61–85)", "level": 5},
        {"name": "新生之", "value": "生命在你格挡时 (86–100)", "level": 6}
    ],
    "避免元素异常":[
        {"name": "坚忍之", "value": "(16–20)% 几率避免元素异常状态", "level": 1},
        {"name": "解决之", "value": "(21–25)% 几率避免元素异常状态", "level": 2},
        {"name": "刚毅之", "value": "(26–30)% 几率避免元素异常状态", "level": 3},
        {"name": "意志之", "value": "(31–35)% 几率避免元素异常状态", "level": 4}
    ],
    "受到暴击伤害减少":[
        {"name": "晦暗之", "value": "(21–30)% 受到的暴击伤害降低", "level": 1},
        {"name": "隔音之", "value": "(31–40)% 受到的暴击伤害降低", "level": 2},
        {"name": "干涉之", "value": "(41–50)% 受到的暴击伤害降低", "level": 3},
        {"name": "阻挠之", "value": "(51–60)% 受到的暴击伤害降低", "level": 4}
    ],
    "火焰抗性上限": [
        {"name": "树火之", "value": "+1% 火焰抗性上限", "level": 1},
        {"name": "熔火核心之", "value": "+2% 火焰抗性上限", "level": 2},
        {"name": "太阳风暴之", "value": "+3% 火焰抗性上限", "level": 3}
    ],
    "冰霜抗性上限": [
        {"name": "皮草之", "value": "+1% 冰霜抗性上限", "level": 1},
        {"name": "苔原之", "value": "+2% 冰霜抗性上限", "level": 2},
        {"name": "猛犸之", "value": "+3% 冰霜抗性上限", "level": 3}
    ],
    "闪电抗性上限":[
        {"name": "抗阻之", "value": "+1% 闪电抗性上限", "level": 1},
        {"name": "电证之", "value": "+2% 闪电抗性上限", "level": 2},
        {"name": "电棒之", "value": "+3% 闪电抗性上限", "level": 3}
    ],
    "混沌抗性上限":[
        {"name": "极宝之", "value": "+1% 混沌抗性上限", "level": 1},
        {"name": "规整之", "value": "+2% 混沌抗性上限", "level": 2},
        {"name": "和谐之", "value": "+3% 混沌抗性上限", "level": 3}
    ],
    "全部抗性上限":[
        {"name": "永久之", "value": "+1% 全部抗性上限", "level": 75},
        {"name": "不死之", "value": "+2% 全部抗性上限", "level": 81}
    ],

    "法术伤害提高(单手)": [
        { "level": 1, "name": "学徒的", "value": "法术伤害提高 (10–19)%" },
        { "level": 2, "name": "娴熟的", "value": "法术伤害提高 (20–29)%" },
        { "level": 3, "name": "学者的", "value": "法术伤害提高 (30–39)%" },
        { "level": 4, "name": "教授的", "value": "法术伤害提高 (40–54)%" },
        { "level": 5, "name": "神秘学者的", "value": "法术伤害提高 (55–69)%" },
        { "level": 6, "name": "魔咒师的", "value": "法术伤害提高 (70–84)%" },
        { "level": 7, "name": "雕纹的", "value": "法术伤害提高 (85–99)%" },
        { "level": 8, "name": "锋芒的", "value": "法术伤害提高 (100–109)%" },
        { "level": 1, "name": "灼烧的", "value": "火焰伤害提高 (10–19)%" },
        { "level": 2, "name": "酷热的", "value": "火焰伤害提高 (20–29)%" },
        { "level": 3, "name": "酷暑的", "value": "火焰伤害提高 (30–39)%" },
        { "level": 4, "name": "炙烤的", "value": "火焰伤害提高 (40–54)%" },
        { "level": 5, "name": "火山的", "value": "火焰伤害提高 (55–69)%" },
        { "level": 6, "name": "熔岩的", "value": "火焰伤害提高 (70–84)%" },
        { "level": 7, "name": "火屑的", "value": "火焰伤害提高 (85–99)%" },
        { "level": 8, "name": "索伏的", "value": "火焰伤害提高 (100–109)%" },
        { "level": 1, "name": "苦涩的", "value": "冰霜伤害提高 (10–19)%" },
        { "level": 2, "name": "刻薄的", "value": "冰霜伤害提高 (20–29)%" },
        { "level": 3, "name": "高山的", "value": "冰霜伤害提高 (30–39)%" },
        { "level": 4, "name": "如雪的", "value": "冰霜伤害提高 (40–54)%" },
        { "level": 5, "name": "颂扬的", "value": "冰霜伤害提高 (55–69)%" },
        { "level": 6, "name": "结晶的", "value": "冰霜伤害提高 ((70–84)%" },
        { "level": 7, "name": "冰霜法师的", "value": "冰霜伤害提高 (85–99)%" },
        { "level": 8, "name": "托沃的", "value": "冰霜伤害提高 (100–109)%" },
        { "level": 1, "name": "充能的", "value": "闪电伤害提高 (10–19)%" },
        { "level": 2, "name": "嘶鸣的", "value": "闪电伤害提高 (20–29)%" },
        { "level": 3, "name": "离弦的", "value": "闪电伤害提高 (30–39)%" },
        { "level": 4, "name": "追逐的", "value": "闪电伤害提高 (40–54)%" },
        { "level": 5, "name": "显著的", "value": "闪电伤害提高 (55–69)%" },
        { "level": 6, "name": "重击的", "value": "闪电伤害提高 (70–84)%" },
        { "level": 7, "name": "电离的", "value": "闪电伤害提高 (85–99)%" },
        { "level": 8, "name": "艾许的", "value": "闪电伤害提高 (100–109)%" }
    ],
    "法术伤害提高(双手)": [
        { "level": 1, "name": "学徒的", "value": "法术伤害提高 (15–29)%" },
        { "level": 2, "name": "娴熟的", "value": "法术伤害提高 (30–44)%" },
        { "level": 3, "name": "学者的", "value": "法术伤害提高 (45–59)%" },
        { "level": 4, "name": "教授的", "value": "法术伤害提高 (60–84)%" },
        { "level": 5, "name": "神秘学者的", "value": "法术伤害提高 (85–104)%" },
        { "level": 6, "name": "魔咒师的", "value": "法术伤害提高 (105–124)%" },
        { "level": 7, "name": "雕纹的", "value": "法术伤害提高 (125–149)%" },
        { "level": 8, "name": "锋芒的", "value": "法术伤害提高 (150–164)%" },
        { "level": 1, "name": "灼烧的", "value": "火焰伤害提高 (15–29)%" },
        { "level": 2, "name": "酷热的", "value": "火焰伤害提高 (30–44)%" },
        { "level": 3, "name": "酷暑的", "value": "火焰伤害提高 (45–59)%" },
        { "level": 4, "name": "炙烤的", "value": "火焰伤害提高 (60–84)%" },
        { "level": 5, "name": "火山的", "value": "火焰伤害提高 (85–104)%" },
        { "level": 6, "name": "熔岩的", "value": "火焰伤害提高 (105–124)%" },
        { "level": 7, "name": "火屑的", "value": "火焰伤害提高 (125–149)%" },
        { "level": 8, "name": "索伏的", "value": "火焰伤害提高 (150–164)%" },
        { "level": 1, "name": "苦涩的", "value": "冰霜伤害提高 (15–29)%" },
        { "level": 2, "name": "刻薄的", "value": "冰霜伤害提高 (30–44)%" },
        { "level": 3, "name": "高山的", "value": "冰霜伤害提高 (45–59)%" },
        { "level": 4, "name": "如雪的", "value": "冰霜伤害提高 (60–84)%" },
        { "level": 5, "name": "颂扬的", "value": "冰霜伤害提高 (85–104)%" },
        { "level": 6, "name": "结晶的", "value": "冰霜伤害提高 (105–124)%" },
        { "level": 7, "name": "冰霜法师的", "value": "冰霜伤害提高 (125–149)%" },
        { "level": 8, "name": "托沃的", "value": "冰霜伤害提高 (150–164)%" },
        { "level": 1, "name": "充能的", "value": "闪电伤害提高 (15–29)%" },
        { "level": 2, "name": "嘶鸣的", "value": "闪电伤害提高 (30–44)%" },
        { "level": 3, "name": "离弦的", "value": "闪电伤害提高 (45–59)%" },
        { "level": 4, "name": "追逐的", "value": "闪电伤害提高 (60–84)%" },
        { "level": 5, "name": "显著的", "value": "闪电伤害提高 (85–104)%" },
        { "level": 6, "name": "重击的", "value": "闪电伤害提高 (105–124)%" },
        { "level": 7, "name": "电离的", "value": "闪电伤害提高 (125–149)%" },
        { "level": 8, "name": "艾许的", "value": "闪电伤害提高 (150–164)%" }
    ],
    "法术伤害提高(饰品)": [
        { "name": "护法的", "value": "(3–7)% 法术伤害提高", "level": 1 },
        { "name": "法师的", "value": "(8–12)% 法术伤害提高", "level": 2 },
        { "name": "术者的", "value": "(13–17)% 法术伤害提高", "level": 3 },
        { "name": "奇术师的", "value": "(18–22)% 法术伤害提高", "level": 4 },
        { "name": "巫师的", "value": "(23–26)% 法术伤害提高", "level": 5 }
    ],

    "法术伤害与魔力(单手)": [
        { "level": 1, "name": "施放者的", "value": "法术伤害提高 (5–9)% +(17–20) 最大魔力" },
        { "level": 2, "name": "咒术师的", "value": "法术伤害提高 (10–14)% +(21–24) 最大魔力" },
        { "level": 3, "name": "巫师的", "value": "法术伤害提高 (15–19)% +(25–28) 最大魔力" },
        { "level": 4, "name": "术士的", "value": "法术伤害提高 (20–24)% +(29–33) 最大魔力" },
        { "level": 5, "name": "魔导师的", "value": "法术伤害提高 (25–29)% +(34–37) 最大魔力" },
        { "level": 6, "name": "大法师的", "value": "法术伤害提高 (30–34)% +(38–41) 最大魔力" },
        { "level": 7, "name": "巫妖的", "value": "法术伤害提高 (35–39)% +(42–45) 最大魔力" }
    ],
    "法术伤害与魔力(双手)": [
        { "level": 1, "name": "施放者的", "value": "法术伤害提高 (8–14)% +(26–30) 最大魔力" },
        { "level": 2, "name": "咒术师的", "value": "法术伤害提高 (15–22)% +(31–35) 最大魔力" },
        { "level": 3, "name": "巫师的", "value": "法术伤害提高 (23–29)% +(36–41) 最大魔力" },
        { "level": 4, "name": "术士的", "value": "法术伤害提高 (30–37)% +(42–47) 最大魔力" },
        { "level": 5, "name": "魔导师的", "value": "法术伤害提高 (38–44)% +(48–53) 最大魔力" },
        { "level": 6, "name": "大法师的", "value": "法术伤害提高 (45–50)% +(54–59) 最大魔力" },
        { "level": 7, "name": "巫妖的", "value": "法术伤害提高 (51–55)% +(60–64) 最大魔力" }
    ],

    "基础混沌伤害(单手)": [
        { "level": 1, "name": "恶意的", "value": "该装备附加 (56–87) - (105–160) 基础混沌伤害" }
    ],
    "基础混沌伤害(双手)": [
        { "level": 1, "name": "恶意的", "value": "该装备附加 (98–149) - (183–280) 基础混沌伤害" }
    ],
    "基础混沌伤害(箭袋)": [
        { "level": 1, "name": "恶意的", "value": "该装备附加 (27–41) - (55–69) 基础混沌伤害" }
    ],

    "基础物理伤害(单手)": [
        { "name": "反光的", "value": "该装备附加 1 - (2–3) 基础物理伤害", "level": 1 },
        { "name": "磨光的", "value": "该装备附加 (4–5) - (8–9) 基础物理伤害", "level": 2 },
        { "name": "抛光的", "value": "该装备附加 (6–9) - (13–15) 基础物理伤害", "level": 3 },
        { "name": "砥砺的", "value": "该装备附加 (8–12) - (17–20) 基础物理伤害", "level": 4 },
        { "name": "熠熠的", "value": "该装备附加 (11–14) - (21–25) 基础物理伤害", "level": 5 },
        { "name": "韧炼的", "value": "该装备附加 (13–18) - (27–31) 基础物理伤害", "level": 6 },
        { "name": "锋利的", "value": "该装备附加 (16–21) - (32–38) 基础物理伤害", "level": 7 },
        { "name": "锻炼的", "value": "该装备附加 (19–25) - (39–45) 基础物理伤害", "level": 8 },
        { "name": "迸出的", "value": "该装备附加 (22–29) - (45–52) 基础物理伤害", "level": 9 }
    ],
    "基础物理伤害(双手)": [
        { "name": "反光的", "value": "该装备附加 2 - (4–5) 基础物理伤害", "level": 1 },
        { "name": "磨光的", "value": "该装备附加 (6–8) - (12–15) 基础物理伤害", "level": 2 },
        { "name": "抛光的", "value": "该装备附加 (10–13) - (21–25) 基础物理伤害", "level": 3 },
        { "name": "砥砺的", "value": "该装备附加 (13–17) - (28–32) 基础物理伤害", "level": 4 },
        { "name": "熠熠的", "value": "该装备附加 (16–22) - (35–40) 基础物理伤害", "level": 5 },
        { "name": "韧炼的", "value": "该装备附加 (20–28) - (43–51) 基础物理伤害", "level": 6 },
        { "name": "锋利的", "value": "该装备附加 (25–33) - (52–61) 基础物理伤害", "level": 7 },
        { "name": "锻炼的", "value": "该装备附加 (30–40) - (63–73) 基础物理伤害", "level": 8 },
        { "name": "迸出的", "value": "该装备附加 (34–47) - (72–84) 基础物理伤害", "level": 9 }
    ],
    "基础物理伤害(箭袋)": [
        { "name": "微烁的", "value": "攻击附加 (1–2) - 3 基础物理伤害", "level": 1 },
        { "name": "光亮的", "value": "攻击附加 (3–4) - (6–8) 基础物理伤害", "level": 2 },
        { "name": "抛光的", "value": "攻击附加 (5–6) - (9–10) 基础物理伤害", "level": 3 },
        { "name": "硬索的", "value": "攻击附加 (6–9) - (13–16) 基础物理伤害", "level": 4 },
        { "name": "熠熠的", "value": "攻击附加 (8–11) - (16–18) 基础物理伤害", "level": 5 },
        { "name": "韧炼的", "value": "攻击附加 (10–13) - (19–23) 基础物理伤害", "level": 6 },
        { "name": "锋利的", "value": "攻击附加 (11–16) - (23–26) 基础物理伤害", "level": 7 },
        { "name": "锻炼的", "value": "攻击附加 (14–19) - (28–33) 基础物理伤害", "level": 8 },
        { "name": "迸出的", "value": "攻击附加 (17–23) - (34–39) 基础物理伤害", "level": 9 }
    ],
    "基础物理伤害(项链)": [
        { "name": "反光的", "value": "攻击附加 1 - 2 基础物理伤害", "level": 1 },
        { "name": "磨光的", "value": "攻击附加 (2–3) - (4–5) 基础物理伤害", "level": 2 },
        { "name": "抛光的", "value": "攻击附加 (3–4) - (6–7) 基础物理伤害", "level": 3 },
        { "name": "砥砺的", "value": "攻击附加 (4–6) - (9–10) 基础物理伤害", "level": 4 },
        { "name": "熠熠的", "value": "攻击附加 (5–7) - (11–12) 基础物理伤害", "level": 5 },
        { "name": "韧炼的", "value": "攻击附加 (6–9) - (13–15) 基础物理伤害", "level": 6 },
        { "name": "锋利的", "value": "攻击附加 (7–10) - (15–18) 基础物理伤害", "level": 7 },
        { "name": "锻炼的", "value": "攻击附加 (9–12) - (19–22) 基础物理伤害", "level": 8 },
        { "name": "迸出的", "value": "攻击附加 (11–15) - (22–26) 基础物理伤害", "level": 9 }
    ],
    "基础物理伤害(戒指和手套)": [
        { "name": "反光的", "value": "攻击附加 1 - 2 基础物理伤害", "level": 1 },
        { "name": "磨光的", "value": "攻击附加 (2–3) - (4–5) 基础物理伤害", "level": 2 },
        { "name": "抛光的", "value": "攻击附加 (3–4) - (6–7) 基础物理伤害", "level": 3 },
        { "name": "砥砺的", "value": "攻击附加 (4–6) - (9–10) 基础物理伤害", "level": 4 },
        { "name": "熠熠的", "value": "攻击附加 (5–7) - (11–12) 基础物理伤害", "level": 5 },
        { "name": "韧炼的", "value": "攻击附加 (6–9) - (13–15) 基础物理伤害", "level": 6 }
    ],

    "基础火焰伤害(单手)": [
        { "name": "加热的", "value": "该装备附加 (1–2) - (3–4) 基础火焰伤害", "level": 1 },
        { "name": "闷烧的", "value": "该装备附加 (8–10) - (15–18) 基础火焰伤害", "level": 2 },
        { "name": "冒烟的", "value": "该装备附加 (12–17) - (25–29) 基础火焰伤害", "level": 3 },
        { "name": "燃烧的", "value": "该装备附加 (17–24) - (35–41) 基础火焰伤害", "level": 4 },
        { "name": "火焰的", "value": "该装备附加 (24–33) - (49–57) 基础火焰伤害", "level": 5 },
        { "name": "酷热的", "value": "该装备附加 (34–46) - (68–80) 基础火焰伤害", "level": 6 },
        { "name": "焚烧的", "value": "该装备附加 (46–62) - (93–107) 基础火焰伤害", "level": 7 },
        { "name": "爆破的", "value": "该装备附加 (59–81) - (120–140) 基础火焰伤害", "level": 8 },
        { "name": "火化的", "value": "该装备附加 (74–101) - (150–175) 基础火焰伤害", "level": 9 },
        { "name": "焦化的", "value": "该装备附加 (89–121) - (180–210) 基础火焰伤害", "level": 10 }
    ],
    "基础火焰伤害(双手)": [
        { "level": 1, "name": "加热的", "value": "该装备附加 (3–5) - (6–7) 基础火焰伤害" },
        { "level": 2, "name": "闷烧的", "value": "该装备附加 (14–20) - (29–33) 基础火焰伤害" },
        { "level": 3, "name": "冒烟的", "value": "该装备附加 (23–31) - (47–54) 基础火焰伤害" },
        { "level": 4, "name": "燃烧的", "value": "该装备附加 (32–44) - (65–76) 基础火焰伤害" },
        { "level": 5, "name": "火焰的", "value": "该装备附加 (45–61) - (91–106) 基础火焰伤害" },
        { "level": 6, "name": "酷热的", "value": "该装备附加 (63–85) - (128–148) 基础火焰伤害" },
        { "level": 7, "name": "焚烧的", "value": "该装备附加 (85–115) - (172–200) 基础火焰伤害" },
        { "level": 8, "name": "爆破的", "value": "该装备附加 (110–150) - (223–260) 基础火焰伤害" },
        { "level": 9, "name": "火化的", "value": "该装备附加 (137–188) - (279–325) 基础火焰伤害" },
        { "level": 10, "name": "焦化的", "value": "该装备附加 (165–225) - (335–390) 基础火焰伤害" }
    ],
    "基础火焰伤害(箭袋)": [
        { "name": "加热的", "value": "攻击附加 (1–2) - 3 基础火焰伤害", "level": 1 },
        { "name": "闷烧的", "value": "攻击附加 (5–7) - (10–12) 基础火焰伤害", "level": 2 },
        { "name": "冒烟的", "value": "攻击附加 (8–10) - (15–18) 基础火焰伤害", "level": 3 },
        { "name": "燃烧的", "value": "攻击附加 (11–14) - (21–25) 基础火焰伤害", "level": 4 },
        { "name": "烈火的", "value": "攻击附加 (13–18) - (27–31) 基础火焰伤害", "level": 5 },
        { "name": "酷热的", "value": "攻击附加 (17–22) - (33–38) 基础火焰伤害", "level": 6 },
        { "name": "焚烧的", "value": "攻击附加 (20–27) - (40–47) 基础火焰伤害", "level": 7 },
        { "name": "爆破的", "value": "攻击附加 (27–35) - (53–62) 基础火焰伤害", "level": 8 },
        { "name": "火化的", "value": "攻击附加 (37–50) - (74–87) 基础火焰伤害", "level": 9 }
    ],
    "基础火焰伤害(项链)": [
        { "name": "加热的", "value": "攻击附加 (1–2) - 2 基础火焰伤害", "level": 1 },
        { "name": "闷烧的", "value": "攻击附加 (3–5) - (7–8) 基础火焰伤害", "level": 2 },
        { "name": "冒烟的", "value": "攻击附加 (5–7) - (11–13) 基础火焰伤害", "level": 3 },
        { "name": "燃烧的", "value": "攻击附加 (7–10) - (15–18) 基础火焰伤害", "level": 4 },
        { "name": "火焰的", "value": "攻击附加 (9–12) - (19–22) 基础火焰伤害", "level": 5 },
        { "name": "酷热的", "value": "攻击附加 (11–15) - (23–27) 基础火焰伤害", "level": 6 },
        { "name": "焚烧的", "value": "攻击附加 (13–18) - (27–31) 基础火焰伤害", "level": 7 },
        { "name": "爆破的", "value": "攻击附加 (16–22) - (32–38) 基础火焰伤害", "level": 8 },
        { "name": "火化的", "value": "攻击附加 (19–25) - (39–45) 基础火焰伤害", "level": 9 }
    ],
    "基础火焰伤害(戒指和手套)": [
        { "name": "加热的", "value": "攻击附加 1 - 2 基础火焰伤害", "level": 1 },
        { "name": "闷烧的", "value": "攻击附加 (3–5) - (7–8) 基础火焰伤害", "level": 2 },
        { "name": "冒烟的", "value": "攻击附加 (5–7) - (11–13) 基础火焰伤害", "level": 3 },
        { "name": "燃烧的", "value": "攻击附加 (7–10) - (15–18) 基础火焰伤害", "level": 4 },
        { "name": "火焰的", "value": "攻击附加 (9–12) - (19–22) 基础火焰伤害", "level": 5 },
        { "name": "酷热的", "value": "攻击附加 (11–15) - (23–27) 基础火焰伤害", "level": 6 },
        { "name": "焚烧的", "value": "攻击附加 (13–18) - (27–31) 基础火焰伤害", "level": 7 },
        { "name": "爆破的", "value": "攻击附加 (16–22) - (32–38) 基础火焰伤害", "level": 8 },
        { "name": "火化的", "value": "攻击附加 (19–25) - (39–45) 基础火焰伤害", "level": 9 }
    ],

    "基础冰霜伤害(单手)": [
        { "name": "结霜的", "value": "该装备附加 (1–2) - (3–4) 基础冰霜伤害", "level": 1 },
        { "name": "冷冻的", "value": "该装备附加 (7–9) - (14–16) 基础冰霜伤害", "level": 2 },
        { "name": "结冰的", "value": "该装备附加 (11–15) - (23–26) 基础冰霜伤害", "level": 3 },
        { "name": "寒风的", "value": "该装备附加 (16–21) - (31–37) 基础冰霜伤害", "level": 4 },
        { "name": "急冻的", "value": "该装备附加 (22–30) - (44–51) 基础冰霜伤害", "level": 5 },
        { "name": "冻结的", "value": "该装备附加 (31–42) - (62–71) 基础冰霜伤害", "level": 6 },
        { "name": "冰河的", "value": "该装备附加 (41–57) - (83–97) 基础冰霜伤害", "level": 7 },
        { "name": "极地的", "value": "该装备附加 (54–74) - (108–126) 基础冰霜伤害", "level": 8 },
        { "name": "埋葬的", "value": "该装备附加 (68–92) - (136–157) 基础冰霜伤害", "level": 9 },
        { "name": "晶化的", "value": "该装备附加 (81–111) - (163–189) 基础冰霜伤害", "level": 10 }
    ],
    "基础冰霜伤害(双手)": [
        { "level": 1, "name": "结霜的", "value": "该装备附加 (2–3) - (6–7) 基础冰霜伤害" },
        { "level": 2, "name": "冷冻的", "value": "该装备附加 (12–17) - (26–30) 基础冰霜伤害" },
        { "level": 3, "name": "结冰的", "value": "该装备附加 (21–28) - (42–48) 基础冰霜伤害" },
        { "level": 4, "name": "寒风的", "value": "该装备附加 (29–40) - (58–68) 基础冰霜伤害" },
        { "level": 5, "name": "急冻的", "value": "该装备附加 (41–55) - (81–95) 基础冰霜伤害" },
        { "level": 6, "name": "冻结的", "value": "该装备附加 (57–77) - (114–132) 基础冰霜伤害" },
        { "level": 7, "name": "冰河的", "value": "该装备附加 (77–104) - (154–178) 基础冰霜伤害" },
        { "level": 8, "name": "极地的", "value": "该装备附加 (99–136) - (200–232) 基础冰霜伤害" },
        { "level": 9, "name": "埋葬的", "value": "该装备附加 (124–170) - (250–290) 基础冰霜伤害" },
        { "level": 10, "name": "晶化的", "value": "该装备附加 (149–204) - (300–348) 基础冰霜伤害" }
    ],
    "基础冰霜伤害(箭袋)": [
        { "name": "结霜的", "value": "攻击附加 (1–2) - (2–3) 基础冰霜伤害", "level": 1 },
        { "name": "冰缓", "value": "攻击附加 (5–6) - (9–10) 基础冰霜伤害", "level": 2 },
        { "name": "结冰的", "value": "攻击附加 (7–9) - (14–16) 基础冰霜伤害", "level": 3 },
        { "name": "寒风之", "value": "攻击附加 (10–13) - (19–22) 基础冰霜伤害", "level": 4 },
        { "name": "急冻的", "value": "攻击附加 (12–16) - (24–28) 基础冰霜伤害", "level": 5 },
        { "name": "冰冻的", "value": "攻击附加 (15–20) - (30–35) 基础冰霜伤害", "level": 6 },
        { "name": "冰河的", "value": "攻击附加 (18–24) - (36–42) 基础冰霜伤害", "level": 7 },
        { "name": "极地的", "value": "攻击附加 (23–32) - (48–55) 基础冰霜伤害", "level": 8 },
        { "name": "埋葬的", "value": "攻击附加 (33–45) - (67–78) 基础冰霜伤害", "level": 9 }
    ],
    "基础冰霜伤害(项链)": [
        { "name": "结霜的", "value": "攻击附加 1 - 2 基础冰霜伤害", "level": 1 },
        { "name": "冷冻的", "value": "攻击附加 (3–4) - (7–8) 基础冰霜伤害", "level": 2 },
        { "name": "结冰的", "value": "攻击附加 (5–7) - (10–12) 基础冰霜伤害", "level": 3 },
        { "name": "寒风的", "value": "攻击附加 (6–9) - (13–16) 基础冰霜伤害", "level": 4 },
        { "name": "急冻的", "value": "攻击附加 (8–11) - (16–19) 基础冰霜伤害", "level": 5 },
        { "name": "冻结的", "value": "攻击附加 (10–13) - (20–24) 基础冰霜伤害", "level": 6 },
        { "name": "冰河的", "value": "攻击附加 (12–16) - (24–28) 基础冰霜伤害", "level": 7 },
        { "name": "极地的", "value": "攻击附加 (14–19) - (29–34) 基础冰霜伤害", "level": 8 },
        { "name": "埋葬的", "value": "攻击附加 (17–22) - (34–40) 基础冰霜伤害", "level": 9 }
    ],
    "基础冰霜伤害(戒指和手套)": [
        { "name": "结霜的", "value": "攻击附加 1 - 2 基础冰霜伤害", "level": 1 },
        { "name": "冷冻的", "value": "攻击附加 (3–4) - (7–8) 基础冰霜伤害", "level": 2 },
        { "name": "结冰的", "value": "攻击附加 (5–7) - (10–12) 基础冰霜伤害", "level": 3 },
        { "name": "寒风的", "value": "攻击附加 (6–9) - (13–16) 基础冰霜伤害", "level": 4 },
        { "name": "急冻的", "value": "攻击附加 (8–11) - (16–19) 基础冰霜伤害", "level": 5 },
        { "name": "冻结的", "value": "攻击附加 (10–13) - (20–24) 基础冰霜伤害", "level": 6 },
        { "name": "冰河的", "value": "攻击附加 (12–16) - (24–28) 基础冰霜伤害", "level": 7 },
        { "name": "极地的", "value": "攻击附加 (14–19) - (29–34) 基础冰霜伤害", "level": 8 },
        { "name": "埋葬的", "value": "攻击附加 (17–22) - (34–40) 基础冰霜伤害", "level": 9 }
    ],

    "基础闪电伤害(单手)": [
        { "name": "低鸣的", "value": "该装备附加 1 - (5–6) 基础闪电伤害", "level": 1 },
        { "name": "嗡嗡的", "value": "该装备附加 2 - (25–29) 基础闪电伤害", "level": 2 },
        { "name": "捕捉的", "value": "该装备附加 2 - (41–48) 基础闪电伤害", "level": 3 },
        { "name": "劈哩啪啦的", "value": "该装备附加 3 - (57–67) 基础闪电伤害", "level": 4 },
        { "name": "火花的", "value": "该装备附加 (4–5) - (80–94) 基础闪电伤害", "level": 5 },
        { "name": "电弧的", "value": "该装备附加 (5–8) - (112–131) 基础闪电伤害", "level": 6 },
        { "name": "电震的", "value": "该装备附加 (8–10) - (152–176) 基础闪电伤害", "level": 7 },
        { "name": "放电的", "value": "该装备附加 (10–14) - (197–229) 基础闪电伤害", "level": 8 },
        { "name": "电极的", "value": "该装备附加 (13–17) - (247–286) 基础闪电伤害", "level": 9 },
        { "name": "汽化的", "value": "该装备附加 (15–21) - (296–344) 基础闪电伤害", "level": 10 }
    ],
    "基础闪电伤害(双手)": [
        { "level": 1, "name": "低鸣的", "value": "该装备附加 2 - (10–11) 基础闪电伤害" },
        { "level": 2, "name": "嗡嗡的", "value": "该装备附加 3 - (46–53) 基础闪电伤害" },
        { "level": 3, "name": "捕捉的", "value": "该装备附加 (4–5) - (76–88) 基础闪电伤害" },
        { "level": 4, "name": "劈哩啪啦的", "value": "该装备附加 (5–8) - (106–123) 基础闪电伤害" },
        { "level": 5, "name": "火花的", "value": "该装备附加 (8–10) - (148–173) 基础闪电伤害" },
        { "level": 6, "name": "电弧的", "value": "该装备附加 (11–14) - (208–242) 基础闪电伤害" },
        { "level": 7, "name": "电震的", "value": "该装备附加 (14–20) - (281–327) 基础闪电伤害" },
        { "level": 8, "name": "放电的", "value": "该装备附加 (19–25) - (366–425) 基础闪电伤害" },
        { "level": 9, "name": "电极的", "value": "该装备附加 (23–32) - (458–531) 基础闪电伤害" },
        { "level": 10, "name": "汽化的", "value": "该装备附加 (28–38) - (549–638) 基础闪电伤害" }
    ],
    "基础闪电伤害(箭袋)": [
        { "name": "雷电的", "value": "攻击附加 1 - (3–4) 基础闪电伤害", "level": 1 },
        { "name": "嗡嗡的", "value": "攻击附加 2 - (16–18) 基础闪电伤害", "level": 2 },
        { "name": "捕捉的", "value": "攻击附加 (1–3) - (25–28) 基础闪电伤害", "level": 3 },
        { "name": "劈哩啪啦的", "value": "攻击附加 (2–3) - (35–40) 基础闪电伤害", "level": 4 },
        { "name": "火花的", "value": "攻击附加 (2–4) - (44–50) 基础闪电伤害", "level": 5 },
        { "name": "电弧的", "value": "攻击附加 (2–5) - (56–62) 基础闪电伤害", "level": 6 },
        { "name": "电震的", "value": "攻击附加 (2–6) - (66–75) 基础闪电伤害", "level": 7 },
        { "name": "放电的", "value": "攻击附加 (3–8) - (89–99) 基础闪电伤害", "level": 8 },
        { "name": "电极的", "value": "攻击附加 (5–11) - (124–140) 基础闪电伤害", "level": 9 }
    ],
    "基础闪电伤害(项链)": [
        { "name": "低鸣的", "value": "攻击附加 1 - 5 基础闪电伤害", "level": 1 },
        { "name": "嗡嗡的", "value": "攻击附加 1 - (14–15) 基础闪电伤害", "level": 2 },
        { "name": "捕捉的", "value": "攻击附加 (1–2) - (22–23) 基础闪电伤害", "level": 3 },
        { "name": "劈哩啪啦的", "value": "攻击附加 (1–2) - (27–28) 基础闪电伤害", "level": 4 },
        { "name": "火花的", "value": "攻击附加 (1–3) - (33–34) 基础闪电伤害", "level": 5 },
        { "name": "电弧的", "value": "攻击附加 (1–4) - (40–43) 基础闪电伤害", "level": 6 },
        { "name": "电震的", "value": "攻击附加 (2–5) - (47–50) 基础闪电伤害", "level": 7 },
        { "name": "放电的", "value": "攻击附加 (3–6) - (57–61) 基础闪电伤害", "level": 8 },
        { "name": "电极的", "value": "攻击附加 (3–7) - (68–72) 基础闪电伤害", "level": 9 }
    ],
    "基础闪电伤害(戒指和手套)": [
        { "name": "低鸣的", "value": "攻击附加 1 - 5 基础闪电伤害", "level": 1 },
        { "name": "嗡嗡的", "value": "攻击附加 1 - (14–15) 基础闪电伤害", "level": 2 },
        { "name": "捕捉的", "value": "攻击附加 (1–2) - (22–23) 基础闪电伤害", "level": 3 },
        { "name": "劈哩啪啦的", "value": "攻击附加 (1–2) - (27–28) 基础闪电伤害", "level": 4 },
        { "name": "火花的", "value": "攻击附加 (1–3) - (33–34) 基础闪电伤害", "level": 5 },
        { "name": "电弧的", "value": "攻击附加 (1–4) - (40–43) 基础闪电伤害", "level": 6 },
        { "name": "电震的", "value": "攻击附加 (2–5) - (47–50) 基础闪电伤害", "level": 7 },
        { "name": "放电的", "value": "攻击附加 (3–6) - (57–61) 基础闪电伤害", "level": 8 },
        { "name": "电极的", "value": "攻击附加 (3–7) - (68–72) 基础闪电伤害", "level": 9 }
    ],

    "法术附加伤害(单手)": [
        { "level": 1, "name": "加热的", "value": "给法术附加 (1–2) 到 (3–4) 点火焰伤害" },
        { "level": 2, "name": "闷烧的", "value": "给法术附加 (6–8) 到 (12–14) 点火焰伤害" },
        { "level": 3, "name": "冒烟的", "value": "给法术附加 (10–12) 到 (19–23) 点火焰伤害" },
        { "level": 4, "name": "燃烧的", "value": "给法术附加 (13–18) 到 (27–31) 点火焰伤害" },
        { "level": 5, "name": "烈火的", "value": "给法术附加 (19–25) 到 (37–44) 点火焰伤害" },
        { "level": 6, "name": "酷热的", "value": "给法术附加 (24–33) 到 (48–57) 点火焰伤害" },
        { "level": 7, "name": "焚烧的", "value": "给法术附加 (31–42) 到 (64–73) 点火焰伤害" },
        { "level": 8, "name": "爆破的", "value": "给法术附加 (40–52) 到 (79–91) 点火焰伤害" },
        { "level": 9, "name": "火化的", "value": "给法术附加 (49–66) 到 (98–115) 点火焰伤害" },
        { "level": 10, "name": "结霜的", "value": "法术附加 1 - (2–3) 基础冰霜伤害" },
        { "level": 11, "name": "冷冻的", "value": "法术附加 (5–7) - (10–12) 基础冰霜伤害" },
        { "level": 12, "name": "结冰的", "value": "法术附加 (8–10) - (16–18) 基础冰霜伤害" },
        { "level": 13, "name": "寒风的", "value": "法术附加 (11–15) - (22–25) 基础冰霜伤害" },
        { "level": 14, "name": "冷冻的", "value": "法术附加 (16–20) - (30–36) 基础冰霜伤害" },
        { "level": 15, "name": "冻结的", "value": "法术附加 (20–26) - (40–46) 基础冰霜伤害" },
        { "level": 16, "name": "冰河的", "value": "法术附加 (26–35) - (51–60) 基础冰霜伤害" },
        { "level": 17, "name": "极地的", "value": "法术附加 (33–43) - (64–75) 基础冰霜伤害" },
        { "level": 18, "name": "埋葬的", "value": "法术附加 (41–54) - (81–93) 基础冰霜伤害" },
        { "level": 19, "name": "雷电的", "value": "法术附加 1 - (4–5) 基础闪电伤害" },
        { "level": 20, "name": "嗡嗡的", "value": "法术附加 (1–2) - (21–22) 基础闪电伤害" },
        { "level": 21, "name": "捕捉的", "value": "法术附加 (1–2) - (33–35) 基础闪电伤害" },
        { "level": 22, "name": "劈哩啪啦的", "value": "法术附加 (1–4) - (46–48) 基础闪电伤害" },
        { "level": 23, "name": "火花的", "value": "法术附加 (2–5) - (64–68) 基础闪电伤害" },
        { "level": 24, "name": "电弧的", "value": "法术附加 (2–7) - (84–88) 基础闪电伤害" },
        { "level": 25, "name": "导电的", "value": "法术附加 (2–9) - (109–115) 基础闪电伤害" },
        { "level": 26, "name": "放电的", "value": "法术附加 (4–11) - (136–144) 基础闪电伤害" },
        { "level": 27, "name": "电极的", "value": "法术附加 (4–14) - (170–179) 基础闪电伤害" }
    ],
    "法术附加伤害(双手)": [
        { "level": 1, "name": "加热的", "value": "给法术附加 (1–2) 到 (4–5) 点火焰伤害" },
        { "level": 2, "name": "闷烧的", "value": "给法术附加 (8–11) 到 (17–19) 点火焰伤害" },
        { "level": 3, "name": "冒烟的", "value": "给法术附加 (13–17) 到 (26–29) 点火焰伤害" },
        { "level": 4, "name": "燃烧的", "value": "给法术附加 (18–23) 到 (36–42) 点火焰伤害" },
        { "level": 5, "name": "烈火的", "value": "给法术附加 (25–33) 到 (50–59) 点火焰伤害" },
        { "level": 6, "name": "酷热的", "value": "给法术附加 (32–44) 到 (65–76) 点火焰伤害" },
        { "level": 7, "name": "焚烧的", "value": "给法术附加 (42–56) 到 (85–99) 点火焰伤害" },
        { "level": 8, "name": "爆破的", "value": "给法术附加 (53–70) 到 (107–123) 点火焰伤害" },
        { "level": 9, "name": "火化的", "value": "给法术附加 (66–88) 到 (132–155) 点火焰伤害" },
        { "level": 1, "name": "结霜的", "value": "法术附加 (1–2) - (3–4) 基础冰霜伤害" },
        { "level": 2, "name": "冷冻的", "value": "法术附加 (8–10) - (15–18) 基础冰霜伤害" },
        { "level": 3, "name": "结冰的", "value": "法术附加 (12–15) - (23–28) 基础冰霜伤害" },
        { "level": 4, "name": "寒风的", "value": "法术附加 (16–22) - (33–38) 基础冰霜伤害" },
        { "level": 5, "name": "冷冻的", "value": "法术附加 (24–30) - (45–53) 基础冰霜伤害" },
        { "level": 6, "name": "冻结的", "value": "法术附加 (30–40) - (59–69) 基础冰霜伤害" },
        { "level": 7, "name": "冰河的", "value": "法术附加 (39–52) - (77–90) 基础冰霜伤害" },
        { "level": 8, "name": "极地的", "value": "法术附加 (49–64) - (96–113) 基础冰霜伤害" },
        { "level": 9, "name": "埋葬的", "value": "法术附加 (61–81) - (120–140) 基础冰霜伤害" },
        { "level": 1, "name": "雷电的", "value": "法术附加 1 - (6–7) 基础闪电伤害" },
        { "level": 2, "name": "嗡嗡的", "value": "法术附加 (1–3) - (32–34) 基础闪电伤害" },
        { "level": 3, "name": "捕捉的", "value": "法术附加 (1–4) - (49–52) 基础闪电伤害" },
        { "level": 4, "name": "劈哩啪啦的", "value": "法术附加 (2–5) - (69–73) 基础闪电伤害" },
        { "level": 5, "name": "火花的", "value": "法术附加 (2–8) - (97–102) 基础闪电伤害" },
        { "level": 6, "name": "电弧的", "value": "法术附加 (3–10) - (126–133) 基础闪电伤害" },
        { "level": 7, "name": "导电的", "value": "法术附加 (5–12) - (164–173) 基础闪电伤害" },
        { "level": 8, "name": "放电的", "value": "法术附加 (5–17) - (204–216) 基础闪电伤害" },
        { "level": 9, "name": "电极的", "value": "法术附加 (7–20) - (255–270) 基础闪电伤害" }
    ],

    "攻击技能的元素伤害提高(单手)": [
        { "level": 1, "name": "催化的", "value": "攻击技能的元素伤害提高 (11–20)%" },
        { "level": 2, "name": "注入的", "value": "攻击技能的元素伤害提高 (21–30)%" },
        { "level": 3, "name": "驾驭的", "value": "攻击技能的元素伤害提高 (31–36)%" },
        { "level": 4, "name": "释放的", "value": "攻击技能的元素伤害提高 (37–42)%" },
        { "level": 5, "name": "狂暴的", "value": "攻击技能的元素伤害提高 (43–50)%" },
        { "level": 6, "name": "毁灭的", "value": "攻击技能的元素伤害提高 (51–59)%" }
    ],
    "攻击技能的元素伤害提高(双手)": [
        { "level": 1, "name": "催化的", "value": "攻击技能的元素伤害提高 (19–34)%" },
        { "level": 2, "name": "注入的", "value": "攻击技能的元素伤害提高 (36–51)%" },
        { "level": 3, "name": "赋能的", "value": "攻击技能的元素伤害提高 (53–61)%" },
        { "level": 4, "name": "释放的", "value": "攻击技能的元素伤害提高 (63–71)%" },
        { "level": 5, "name": "狂暴的", "value": "攻击技能的元素伤害提高 (73–85)%" },
        { "level": 6, "name": "毁灭的", "value": "攻击技能的元素伤害提高 (87–100)%" }
    ],
    "攻击技能的元素伤害提高(非武器)": [
        { "name": "催化的", "value": "(5–10)% 攻击技能的元素伤害提高", "level": 1 },
        { "name": "注入的", "value": "(11–20)% 攻击技能的元素伤害提高", "level": 2 },
        { "name": "赋予的", "value": "(21–30)% 攻击技能的元素伤害提高", "level": 3 },
        { "name": "释放的", "value": "(31–36)% 攻击技能的元素伤害提高", "level": 4 },
        { "name": "强盛的", "value": "(37–42)% 攻击技能的元素伤害提高", "level": 5 },
        { "name": "毁灭的", "value": "(43-50)% 攻击技能的元素伤害提高", "level": 6 }
    ],

    "所有技能石等级":[
        { "level": 1, "name": "模范的", "value": "此物品上装备的技能石等级 +1"}
    ],
    "所有主动技能石等级":[
        { "level": 1, "name": "交变者的", "value": "所有主动技能石等级 +1"}
    ],
    "主动技能石等级": [
        { "name": "伏尔甘教徒的", "value": "所有火焰主动技能石等级 +1", "level": 1 },
        { "name": "霜民的", "value": "所有冰霜主动技能石等级 +1", "level": 1 },
        { "name": "风民的", "value": "所有闪电主动技能石等级 +1", "level": 1 },
        { "name": "比蒙的", "value": "所有物理主动技能石等级 +1", "level": 1 },
        { "name": "内奸的", "value": "所有混沌主动技能石等级 +1", "level": 1 }
    ],
    "所有法术主动技能石等级(双手)": [
        { "level": 1, "name": "导师的", "value": "所有法术主动技能石等级 +(1–2)" }
    ],
    "所有法术主动技能石等级(单手)": [
        { "level": 1, "name": "导师的", "value": "所有法术主动技能石等级 + 1" }
    ],
    "弓技能石等级": [
        { "level": 1, "name": "弓箭专家的", "value": "此物品上装备的【弓技能石】等级 +1" },
        { "level": 2, "name": "神枪手的", "value": "此物品上装备的【弓技能石】等级 +2" }
    ],
    "近战技能石等级": [
        { "level": 1, "name": "战斗的", "value": "此物品上装备的近战技能石等级 +1" },
        { "level": 2, "name": "武器大师的", "value": "此物品上装备的近战技能石等级 +2" }
    ],
    "召唤主动技能石": [
        { "level": 1, "name": "监工之", "value": "所有召唤生物主动技能石等级 +1" },
        { "level": 2, "name": "狱卒之", "value": "所有召唤生物主动技能石等级 +2" }
    ],
    "法术主动技能石等级(双手)": [
        { "level": 1, "name": "塑焰的", "value": "所有火焰法术主动技能石等级 +(1–2)" },
        { "level": 2, "name": "熔咒的", "value": "所有火焰法术主动技能石等级 +3" },
        { "level": 1, "name": "霜颂的", "value": "所有冰霜法术主动技能石等级 +(1–2)" },
        { "level": 2, "name": "迎冬的", "value": "所有冰霜法术主动技能石等级 +3" },
        { "level": 1, "name": "雷手的", "value": "所有闪电法术主动技能石等级 +(1–2)" },
        { "level": 2, "name": "风伯的", "value": "所有闪电法术主动技能石等级 +3" },
        { "level": 1, "name": "疯王的", "value": "所有混沌法术主动技能石等级 +(1–2)" },
        { "level": 2, "name": "碎志的", "value": "所有混沌法术主动技能石等级 +3" },
        { "level": 1, "name": "石卜师的", "value": "所有物理主动法术技能石等级 +(1–2)" },
        { "level": 2, "name": "破釜的", "value": "所有物理主动法术技能石等级 +3" }
    ],
    "法术主动技能石等级(单手)": [
        { "level": 1, "name": "塑焰的", "value": "所有火焰法术主动技能石等级 +1" },
        { "level": 2, "name": "熔咒的", "value": "所有火焰法术主动技能石等级 +2" },
        { "level": 1, "name": "霜颂的", "value": "所有冰霜法术主动技能石等级 +1" },
        { "level": 2, "name": "迎冬的", "value": "所有冰霜法术主动技能石等级 +2" },
        { "level": 1, "name": "雷手的", "value": "所有闪电法术主动技能石等级 +1" },
        { "level": 2, "name": "风伯的", "value": "所有闪电法术主动技能石等级 +2" },
        { "level": 1, "name": "疯王的", "value": "所有混沌法术主动技能石等级 +1" },
        { "level": 2, "name": "碎志的", "value": "所有混沌法术主动技能石等级 +2" },
        { "level": 1, "name": "石卜师的", "value": "所有物理主动法术技能石等级 +1" },
        { "level": 2, "name": "破釜的", "value": "所有物理主动法术技能石等级 +2" }
    ],
    "元素&混沌技能石等级": [
        { "level": 1, "name": "火焰飞旋的", "value": "此物品上装备的【火焰技能石】等级 +1" },
        { "level": 2, "name": "岩浆呼唤的", "value": "此物品上装备的【火焰技能石】等级 +2" },
        { "level": 1, "name": "冰霜织女的", "value": "此物品上装备的【冰霜技能石】等级 +1" },
        { "level": 2, "name": "寒冰使者的", "value": "此物品上装备的【冰霜技能石】等级 +2" },
        { "level": 1, "name": "雷神的", "value": "此物品上装备的【闪电技能石】等级 +1" },
        { "level": 2, "name": "风暴王者的", "value": "此物品上装备的【闪电技能石】等级 +2" },
        { "level": 1, "name": "虚无主义的", "value": "此物品上装备的【混沌技能石】等级 +1" },
        { "level": 2, "name": "无序的", "value": "此物品上装备的【混沌技能石】等级 +2" }
    ],

    "物理攻击伤害转化为生命偷取": [
        { "level": 1, "name": "鲫鱼的", "value": "物理攻击伤害的 (0.2–0.4)% 会转化为生命偷取" },
        { "level": 2, "name": "七鳃鳗的", "value": "物理攻击伤害的 (0.6–0.8)% 会转化为生命偷取" },
        { "level": 3, "name": "吸血鬼的", "value": "物理攻击伤害的 (1–1.2)% 会转化为生命偷取" }
    ],
    "物理攻击伤害转化为魔力偷取": [
        { "level": 1, "name": "口渴的", "value": "物理攻击伤害的 (0.2–0.4)% 转化为魔力偷取" },
        { "level": 2, "name": "燥热的", "value": "物理攻击伤害的 (0.6–0.8)% 转化为魔力偷取" }
    ],

    "物理伤害提高": [
        { "name": "重量的", "value": "物理伤害提高 (40–49)%", "level": 1 },
        { "name": "锯齿的", "value": "物理伤害提高 (50–64)%", "level": 2 },
        { "name": "邪恶的", "value": "物理伤害提高 (65–84)%", "level": 3 },
        { "name": "狠毒的", "value": "物理伤害提高 (85–109)%", "level": 4 },
        { "name": "嗜血的", "value": "物理伤害提高 (110–134)%", "level": 5 },
        { "name": "残酷的", "value": "物理伤害提高 (135–154)%", "level": 6 },
        { "name": "强横的", "value": "物理伤害提高 (155–169)%", "level": 7 },
        { "name": "无情的", "value": "物理伤害提高 (170–179)%", "level": 8 }
    ],
    "物理伤害提高和命中值": [
        { "name": "侍从的", "value": "物理伤害提高(15–19)% & +(16–20) 命中值", "level": 1 },
        { "name": "旅人的", "value": "物理伤害提高(20–24)% & +(21–46) 命中值", "level": 2 },
        { "name": "掠夺者的", "value": "物理伤害提高(25–34)% & +(47–72) 命中值", "level": 3 },
        { "name": "佣兵的", "value": "物理伤害提高(35–44)% & +(73–97) 命中值", "level": 4 },
        { "name": "冠军的", "value": "物理伤害提高(45–54)% & +(98–123) 命中值", "level": 5 },
        { "name": "征服者的", "value": "物理伤害提高(55–64)% & +(124–149) 命中值", "level": 6 },
        { "name": "帝王的", "value": "物理伤害提高(65–74)% & +(150–174) 命中值", "level": 7 },
        { "name": "独裁者的", "value": "物理伤害提高(75–79)% & +(175–200) 命中值", "level": 8 }
    ],

    "弓类技能伤害提高": [
        { "name": "急性的", "value": "弓类技能伤害提高 (5–10)%", "level": 1 },
        { "name": "尖刻的", "value": "弓类技能伤害提高 (11–20)%", "level": 2 },
        { "name": "凿击的", "value": "弓类技能伤害提高 (21–30)%", "level": 3 },
        { "name": "锋尖的", "value": "弓类技能伤害提高 (31–36)%", "level": 4 },
        { "name": "破空的", "value": "弓类技能伤害提高 (37–42)%", "level": 5 },
        { "name": "穿刺的", "value": "弓类技能伤害提高 (43–50)%", "level": 6 }
    ],
    "额外箭矢": [
        { "level": 1, "name": "碎片之", "value": "弓类攻击发射一支额外箭矢" },
        { "level": 2, "name": "繁多之", "value": "弓类攻击发射2支额外箭矢" }
    ],
    "投射物速度加快":[
        { "name": "疾速之", "value": "投射物速度加快 (10–17)%", "level": 1 },
        { "name": "飞行之", "value": "投射物速度加快 (18–25)%", "level": 2 },
        { "name": "推进之", "value": "投射物速度加快 (26–33)%", "level": 3 },
        { "name": "和风之", "value": "投射物速度加快 (34–41)%", "level": 4 },
        { "name": "劲风之", "value": "投射物速度加快 (42–46)%", "level": 5 }
    ],
    "弓类攻击暴击伤害加成": [
        { "name": "怒火之", "value": "弓类攻击 +(8–12)% 暴击伤害加成", "level": 1 },
        { "name": "愤怒之", "value": "弓类攻击 +(13–19)% 暴击伤害加成", "level": 2 },
        { "name": "狂怒之", "value": "弓类攻击 +(20–24)% 暴击伤害加成", "level": 3 },
        { "name": "狂暴之", "value": "弓类攻击 +(25–29)% 暴击伤害加成", "level": 4 },
        { "name": "凶暴之", "value": "弓类攻击 +(30–34)% 暴击伤害加成", "level": 5 },
        { "name": "毁灭之", "value": "弓类攻击 +(35–38)% 暴击伤害加成", "level": 6 }
    ],
    "弓类攻击暴击率提高": [
        { "name": "针刺之", "value": "弓类攻击的暴击率提高 (10–14)%", "level": 1 },
        { "name": "刺痛之", "value": "弓类攻击的暴击率提高 (15–19)%", "level": 2 },
        { "name": "刺穿之", "value": "弓类攻击的暴击率提高 (20–24)%", "level": 3 },
        { "name": "破裂之", "value": "弓类攻击的暴击率提高 (25–29)%", "level": 4 },
        { "name": "穿透之", "value": "弓类攻击的暴击率提高 (30–34)%", "level": 5 },
        { "name": "手术之", "value": "弓类攻击的暴击率提高 (35–38)%", "level": 6 },
        { "name": "撕碎之", "value": "弓类攻击的暴击率提高 (39–44)%", "level": 7 }
    ],

    "最大生命": [
        { "level": 1, "value": "+(3–9) 最大生命", "name": "健壮的" },
        { "level": 2, "value": "+(10–19) 最大生命", "name": "健康的" },
        { "level": 3, "value": "+(20–29) 最大生命", "name": "乐观的" },
        { "level": 4, "value": "+(30–39) 最大生命", "name": "坚定的" },
        { "level": 5, "value": "+(40–49) 最大生命", "name": "粗壮的" },
        { "level": 6, "value": "+(50–59) 最大生命", "name": "健壮的" },
        { "level": 7, "value": "+(60–69) 最大生命", "name": "丰腴的" },
        { "level": 8, "value": "+(70–79) 最大生命", "name": "阳刚的" },
        { "name": "运动员的", "value": "+(80–89) 最大生命", "level": 9 },
        { "name": "丰饶的", "value": "+(90–99) 最大生命", "level": 10 },
        { "name": "蓬勃的", "value": "+(100–109) 最大生命", "level": 11 },
        { "name": "狂喜的", "value": "+(110–119) 最大生命", "level": 12 },
        { "name": "全盛的", "value": "+(120–129) 最大生命", "level": 13 }
    ],

    "最大魔力(单手)":[
        { "level": 1, "name": "绿宝石的", "value": "+(30–39) 最大魔力" },
        { "level": 2, "name": "钴蓝的", "value": "+(40–49) 最大魔力" },
        { "level": 3, "name": "湛蓝的", "value": "+(50–59) 最大魔力" },
        { "level": 4, "name": "蓝宝石的", "value": "+(60–69) 最大魔力" },
        { "level": 5, "name": "天蓝的", "value": "+(70–79) 最大魔力" },
        { "level": 6, "name": "水星的", "value": "+(80–89) 最大魔力" },
        { "level": 7, "name": "乳白色的", "value": "+(90–99) 最大魔力" },
        { "level": 8, "name": "龙胆的", "value": "+(100–109) 最大魔力" },
        { "level": 9, "name": "靛蓝的", "value": "+(110–119) 最大魔力" },
        { "level": 10, "name": "深蓝的", "value": "+(120–129) 最大魔力" },
        { "level": 11, "name": "蓝色的", "value": "+(130–139) 最大魔力" },
        { "level": 12, "name": "蓝釉的", "value": "+(140–159) 最大魔力" }
    ],
    "最大魔力(双手)": [
        { "level": 1, "name": "绿宝石的", "value": "+(40–49) 最大魔力" },
        { "level": 2, "name": "钴蓝的", "value": "+(50–59) 最大魔力" },
        { "level": 3, "name": "湛蓝的", "value": "+(60–69) 最大魔力" },
        { "level": 4, "name": "蓝宝石的", "value": "+(70–79) 最大魔力" },
        { "level": 5, "name": "天蓝的", "value": "+(80–89) 最大魔力" },
        { "level": 6, "name": "水星的", "value": "+(90–99) 最大魔力" },
        { "level": 7, "name": "乳白色的", "value": "+(100–119) 最大魔力" },
        { "level": 8, "name": "龙胆的", "value": "+(120–139) 最大魔力" },
        { "level": 9, "name": "靛蓝的", "value": "+(140–159) 最大魔力" },
        { "level": 10, "name": "深蓝的", "value": "+(160–179) 最大魔力" },
        { "level": 11, "name": "蓝色的", "value": "+(180–199) 最大魔力" },
        { "level": 12, "name": "蓝釉的", "value": "+(200–229) 最大魔力" }
    ],
    "最大魔力(非武器)": [
        { "name": "绿宝石的", "value": "+(15–19) 最大魔力", "level": 1 },
        { "name": "钴蓝的", "value": "+(20–24) 最大魔力", "level": 2 },
        { "name": "湛蓝的", "value": "+(25–29) 最大魔力", "level": 3 },
        { "name": "蓝宝石的", "value": "+(30–34) 最大魔力", "level": 4 },
        { "name": "天蓝的", "value": "+(35–39) 最大魔力", "level": 5 },
        { "name": "水星的", "value": "+(40–44) 最大魔力", "level": 6 },
        { "name": "乳白色的", "value": "+(45–49) 最大魔力", "level": 7 },
        { "name": "龙胆的", "value": "+(50–54) 最大魔力", "level": 8 },
        { "name": "靛蓝的", "value": "+(55–59) 最大魔力", "level": 9 },
        { "name": "深蓝的", "value": "+(60–64) 最大魔力", "level": 10 },
        { "name": "纯蓝的", "value": "+(65–68) 最大魔力", "level": 11 },
        { "name": "钴蓝的", "value": "+(69–73) 最大魔力", "level": 12 },
        { "name": "群青的", "value": "+(74–78) 最大魔力", "level": 13 }
    ],

    "最大能量护盾": [
        { "name": "发光的", "value": "+(1–3) 最大能量护盾", "level": 1 },
        { "name": "微光的", "value": "+(4–8) 最大能量护盾", "level": 2 },
        { "name": "闪闪发亮的", "value": "+(9–12) 最大能量护盾", "level": 3 },
        { "name": "泛光的", "value": "+(13–15) 最大能量护盾", "level": 4 },
        { "name": "辐射的", "value": "+(16–19) 最大能量护盾", "level": 5 },
        { "name": "脉冲的", "value": "+(20–22) 最大能量护盾", "level": 6 },
        { "name": "沸腾的", "value": "+(23–26) 最大能量护盾", "level": 7 },
        { "name": "炽烈的", "value": "+(27–31) 最大能量护盾", "level": 8 },
        { "name": "夺目的", "value": "+(32–37) 最大能量护盾", "level": 9 },
        { "name": "炽焰的", "value": "+(38–43) 最大能量护盾", "level": 10 },
        { "name": "灿烂的", "value": "+(44–47) 最大能量护盾", "level": 11 },
        { "name": "眩目的", "value": "+(48–51) 最大能量护盾", "level": 12 }
    ],
    "能量护盾上限提高(饰品)": [
        { "name": "保护的", "value": "(2–4)% 能量护盾上限提高", "level": 1 },
        { "name": "意志坚强的", "value": "(5–7)% 能量护盾上限提高", "level": 2 },
        { "name": "坚决的", "value": "(8–10)% 能量护盾上限提高", "level": 3 },
        { "name": "无惧的", "value": "(11–13)% 能量护盾上限提高", "level": 4 },
        { "name": "无畏的", "value": "(14–16)% 能量护盾上限提高", "level": 5 },
        { "name": "无法征服的", "value": "(17–19)% 能量护盾上限提高", "level": 6 },
        { "name": "坚不可摧的", "value": "(20–22)% 能量护盾上限提高", "level": 7 }
    ],
    "能量护盾充能时间提前": [
        { "name": "精力之", "value": "能量护盾充能时间提前 (27–34)%", "level": 1 },
        { "name": "风味之", "value": "能量护盾充能时间提前 (35–42)%", "level": 2 },
        { "name": "通电之", "value": "能量护盾充能时间提前 (43–50)%", "level": 3 },
        { "name": "活力之", "value": "能量护盾充能时间提前 (51–58)%", "level": 4 },
        { "name": "助力之风之", "value": "能量护盾充能时间提前 (59–66)%", "level": 5 }
    ],
    "能量护盾充能率提高":[
        {"name": "消减之", "value": "能量护盾充能率提高 (24–26)%", "level": 1},
        {"name": "扩散之", "value": "能量护盾充能率提高 (27–29)%", "level": 2},
        {"name": "散播之", "value": "能量护盾充能率提高 (30–32)%", "level": 3},
        {"name": "缓冲之", "value": "能量护盾充能率提高 (33–35)%", "level": 4},
        {"name": "灼情之", "value": "能量护盾充能率提高 (36–38)%", "level": 5}
    ],

    "护甲": [
        { "name": "上漆的", "value": "+(3–10) 护甲", "level": 1 },
        { "name": "镶嵌的", "value": "+(11–35) 护甲", "level": 2 },
        { "name": "螺纹的", "value": "+(36–60) 护甲", "level": 3 },
        { "name": "强化的", "value": "+(61–138) 护甲", "level": 4 },
        { "name": "电镀的", "value": "+(139–322) 护甲", "level": 5 },
        { "name": "装甲化的", "value": "+(323–400) 护甲", "level": 6 },
        { "name": "围绕的", "value": "+(401–460) 护甲", "level": 7 },
        { "name": "包围的", "value": "+(461–540) 护甲", "level": 8 }
    ],

    "护甲提高(饰品)": [
        { "name": "增强的", "value": "(4–8)% 护甲提高", "level": 1 },
        { "name": "分层的", "value": "(9–13)% 护甲提高", "level": 2 },
        { "name": "甲壳的", "value": "(14–18)% 护甲提高", "level": 3 },
        { "name": "支持的", "value": "(19–23)% 护甲提高", "level": 4 },
        { "name": "加厚的", "value": "(24–28)% 护甲提高", "level": 5 },
        { "name": "围城的", "value": "(29–32)% 护甲提高", "level": 6 },
        { "name": "坚不可摧的", "value": "(33–36)% 护甲提高", "level": 7 }
    ],
    "闪避值提高(饰品)": [
        { "name": "敏捷的", "value": "(4–8)% 闪避值提高", "level": 1 },
        { "name": "舞者的", "value": "(9–13)% 闪避值提高", "level": 2 },
        { "name": "杂技的", "value": "(14–18)% 闪避值提高", "level": 3 },
        { "name": "飘忽的", "value": "(19–23)% 闪避值提高", "level": 4 },
        { "name": "模糊的", "value": "(24–28)% 闪避值提高", "level": 5 },
        { "name": "相位的", "value": "(29–32)% 闪避值提高", "level": 6 },
        { "name": "气态的", "value": "(33–36)% 闪避值提高", "level": 7 }
    ],

    "闪避值": [
        { "name": "敏捷的", "value": "(3–10) 点", "level": 1 },
        { "name": "舞者的", "value": "(11–35) 点", "level": 2 },
        { "name": "杂技的", "value": "(36–60) 点", "level": 3 },
        { "name": "飘忽的", "value": "(61–80) 点", "level": 4 },
        { "name": "模糊的", "value": "(81–120) 点", "level": 5 },
        { "name": "相位的", "value": "(121–150) 点", "level": 6 },
        { "name": "气态的", "value": "(151–170) 点", "level": 7 }
    ],

    "最大能量护盾(防具)": [
        { "name": "发光的", "value": "3-5 最大能量护盾", "level": 1 },
        { "name": "微光的", "value": "6-11 最大能量护盾", "level": 2 },
        { "name": "闪闪发亮的", "value": "12-16 最大能量护盾", "level": 3 },
        { "name": "泛光的", "value": "17-23 最大能量护盾", "level": 4 },
        { "name": "辐射的", "value": "24-30 最大能量护盾", "level": 5 },
        { "name": "脉冲的", "value": "31-38 最大能量护盾", "level": 6 },
        { "name": "沸腾的", "value": "39-49 最大能量护盾", "level": 7 },
        { "name": "炽烈的", "value": "50-61 最大能量护盾", "level": 8 },
        { "name": "夺目的", "value": "62-76 最大能量护盾", "level": 9 },
        { "name": "炽焰的", "value": "77-90 最大能量护盾", "level": 10 },
        { "name": "灿烂的", "value": "91-100 最大能量护盾", "level": 11 }
    ],
    "闪避值(防具)": [
        { "name": "敏捷的", "value": "6-12 点闪避值", "level": 1 },
        { "name": "舞者的", "value": "13-35 点闪避值", "level": 2 },
        { "name": "杂技的", "value": "36-63 点闪避值", "level": 3 },
        { "name": "飘忽的", "value": "64-82 点闪避值", "level": 4 },
        { "name": "模糊的", "value": "83-101 点闪避值", "level": 5 },
        { "name": "相位的", "value": "102-120 点闪避值", "level": 6 },
        { "name": "气态的", "value": "121-150 点闪避值", "level": 7 },
        { "name": "不可捉摸的", "value": "151-200 点闪避值", "level": 8 },
        { "name": "灵敏的", "value": "201-300 点闪避值", "level": 9 },
        { "name": "柔软的", "value": "301-400 点闪避值", "level": 10 },
        { "name": "易变的", "value": "401-500 点闪避值", "level": 11 }
    ],
    "护甲(防具)": [
        { "name": "上漆的", "value": "6-12 护甲", "level": 1 },
        { "name": "镶嵌的", "value": "13-35 护甲", "level": 2 },
        { "name": "螺纹的", "value": "36-63 护甲", "level": 3 },
        { "name": "强化的", "value": "64-82 护甲", "level": 4 },
        { "name": "电镀的", "value": "83-101 护甲", "level": 5 },
        { "name": "装甲化的", "value": "102-120 护甲", "level": 6 },
        { "name": "围绕的", "value": "121-150 护甲", "level": 7 },
        { "name": "包围的", "value": "151-200 护甲", "level": 8 },
        { "name": "柔缓的", "value": "201-300 护甲", "level": 9 },
        { "name": "不动的", "value": "301-400 护甲", "level": 10 },
        { "name": "无懈的", "value": "401-500 护甲", "level": 11 }
    ],
    "护甲和闪避值(防具)": [
        { "name": "柔韧的", "value": "5-9 护甲, 5-9 点闪避值", "level": 1 },
        { "name": "软绵的", "value": "10-27 护甲, 10-27 点闪避值", "level": 2 },
        { "name": "弹性的", "value": "28-48 护甲, 13-22 点闪避值", "level": 3 },
        { "name": "耐久的", "value": "49-85 护甲, 23-28 点闪避值", "level": 4 },
        { "name": "结实的", "value": "86-145 护甲, 29-48 点闪避值", "level": 5 },
        { "name": "弹力的", "value": "146-220 护甲, 49-60 点闪避值", "level": 6 },
        { "name": "可调的", "value": "221-300 护甲, 61-72 点闪避值", "level": 7 },
        { "name": "多用的", "value": "301-375 护甲, 73-80 点闪避值", "level": 8 }
    ],
    "护甲和能量护盾(防具)": [
        { "name": "受福的", "value": "5-9 护甲, 3-4 最大能量护盾", "level": 1 },
        { "name": "受膏的", "value": "10-27 护甲, 5-12 最大能量护盾", "level": 2 },
        { "name": "圣化的", "value": "28-48 护甲, 13-22 最大能量护盾", "level": 3 },
        { "name": "崇圣的", "value": "49-85 护甲, 23-28 最大能量护盾", "level": 4 },
        { "name": "赐福的", "value": "86-145 护甲, 29-48 最大能量护盾", "level": 5 },
        { "name": "奉献的", "value": "146-220 护甲, 49-60 最大能量护盾", "level": 6 },
        { "name": "圣洁的", "value": "221-300 护甲, 61-72 最大能量护盾", "level": 7 },
        { "name": "神样的", "value": "301-375 护甲, 73-80 最大能量护盾", "level": 8 }
    ],
    "闪避值和能量护盾(防具)": [
        { "name": "幽焰的", "value": "5-9 点闪避值, 3-4 最大能量护盾", "level": 1 },
        { "name": "仙子的", "value": "10-27 点闪避值, 5-12 最大能量护盾", "level": 2 },
        { "name": "仙精的", "value": "28-48 点闪避值, 13-22 最大能量护盾", "level": 3 },
        { "name": "仙灵的", "value": "49-85 点闪避值, 23-28 最大能量护盾", "level": 4 },
        { "name": "精魂的", "value": "86-145 点闪避值, 29-48 最大能量护盾", "level": 5 },
        { "name": "幻灵的", "value": "146-220 点闪避值, 49-60 最大能量护盾", "level": 6 },
        { "name": "容貌的", "value": "221-300 点闪避值, 61-72 最大能量护盾", "level": 7 },
        { "name": "幻象的", "value": "301-375 点闪避值, 73-80 最大能量护盾", "level": 8 }
    ],
    "护甲和最大生命(防具)": [
        { "name": "牡蛎的", "value": " +(20–32) 护甲, +(18–23) 最大生命", "level": 1 },
        { "name": "顽童的", "value": " +(33–48) 护甲, +(24–28) 最大生命", "level": 2 },
        { "name": "菊石的", "value": " +(49–96) 护甲, +(29–33) 最大生命", "level": 3 },
        { "name": "鳄鱼的", "value": " +(97–144) 护甲, +(34–38) 最大生命", "level": 4 }
    ],
    "闪避值和最大生命(防具)": [
        { "name": "跳蚤的", "value": "30 +(14–20) 点闪避值, +(18–23) 最大生命", "level": 1 },
        { "name": "幼鹿的", "value": "46 +(21–42) 点闪避值, +(24–28) 最大生命", "level": 2 },
        { "name": "公羊的", "value": "62 +(43–95) 点闪避值, +(29–33) 最大生命", "level": 3 },
        { "name": "山羊的", "value": "78 +(96–120) 点闪避值, +(34–38) 最大生命", "level": 4 }
    ],
    "能量护盾和最大生命(防具)": [
        { "name": "僧侣的", "value": "30 +(8–10) 最大能量护盾, +(18–23) 最大生命", "level": 1 },
        { "name": "院长的", "value": "46 +(11–15) 最大能量护盾, +(24–28) 最大生命", "level": 2 },
        { "name": "尊长的", "value": "62 +(16–25) 最大能量护盾, +(29–33) 最大生命", "level": 3 },
        { "name": "总督的", "value": "78 +(26–30) 最大能量护盾, +(34–38) 最大生命", "level": 4 }
    ],
    "能量护盾和最大魔力(防具)": [
        { "name": "侍僧的", "value": "30 +(8–10) 最大能量护盾, +(11–15) 最大魔力", "level": 1 },
        { "name": "辅祭的", "value": "46 +(11–15) 最大能量护盾, +(16–19) 最大魔力", "level": 2 },
        { "name": "祭司的", "value": "62 +(16–25) 最大能量护盾, +(20–22) 最大魔力", "level": 3 },
        { "name": "主教的", "value": "78 +(26–30) 最大能量护盾, +(23–25) 最大魔力", "level": 4 }
    ],

    "该装备的护甲,闪避,能量护盾提高":[
        { "name": "阴影的", "value": "该装备的护甲、闪避和能量护盾提高 (27–42)%", "level": 1 },
        { "name": "空灵的", "value": "该装备的护甲、闪避和能量护盾提高 (43–55)%", "level": 2 },
        { "name": "脱俗的", "value": "该装备的护甲、闪避和能量护盾提高 (56–67)%", "level": 3 },
        { "name": "无常的", "value": "该装备的护甲、闪避和能量护盾提高 (68–79)%", "level": 4 },
        { "name": "逝去的", "value": "该装备的护甲、闪避和能量护盾提高 (80–91)%", "level": 5 },
        { "name": "虚幻的", "value": "该装备的护甲、闪避和能量护盾提高 (92–100)%", "level": 6 },
        { "name": "无形的", "value": "该装备的护甲、闪避和能量护盾提高 (101–110)%", "level": 7 }
    ],
    "该装备的护甲,闪避,能量护盾提高 晕眩回复和格挡回复提高":[
        { "name": "蚊子的", "value": "该装备的护甲、闪避和能量护盾提高 (6–13)% 晕眩回复和格挡回复提高 (6–7)%", "level": 1 },
        { "name": "飞蛾的", "value": "该装备的护甲、闪避和能量护盾提高 (14–20)% 晕眩回复和格挡回复提高 (8–9)%", "level": 2 },
        { "name": "蝴蝶的", "value": "该装备的护甲、闪避和能量护盾提高 (21–26)% 晕眩回复和格挡回复提高 (10–11)%", "level": 3 },
        { "name": "黄蜂的", "value": "该装备的护甲、闪避和能量护盾提高 (27–32)% 晕眩回复和格挡回复提高 (12–13)%", "level": 4 },
        { "name": "蜻蜓的", "value": "该装备的护甲、闪避和能量护盾提高 (33–38)% 晕眩回复和格挡回复提高 (14–15)%", "level": 5 },
        { "name": "蜂鸟的", "value": "该装备的护甲、闪避和能量护盾提高 (39–42)% 晕眩回复和格挡回复提高 (16–17)%", "level": 6 }
    ],

    "该装备的护甲提高":[
        { "name": "增强的", "value": "该装备的护甲提高 (15–26)%", "level": 1 },
        { "name": "分层的", "value": "该装备的护甲提高 (27–42)%", "level": 2 },
        { "name": "甲壳的", "value": "该装备的护甲提高 (43–55)%", "level": 3 },
        { "name": "支持的", "value": "该装备的护甲提高 (56–67)%", "level": 4 },
        { "name": "加厚的", "value": "该装备的护甲提高 (68–79)%", "level": 5 },
        { "name": "围城的", "value": "该装备的护甲提高 (80–91)%", "level": 6 },
        { "name": "坚不可摧的", "value": "该装备的护甲提高 (92–100)%", "level": 7 },
        { "name": "无法通过的", "value": "该装备的护甲提高 (101–110)%", "level": 8 }
    ],
    "该装备的护甲提高 晕眩回复和格挡回复提高":[
        { "name": "甲虫的", "value": "该装备的护甲提高 (6–13)%, 晕眩回复和格挡回复提高 (6–7)%", "level": 1 },
        { "name": "螃蟹的", "value": "该装备的护甲提高 (14–20)%, 晕眩回复和格挡回复提高 (8–9)%", "level": 2 },
        { "name": "犰狳的", "value": "该装备的护甲提高 (21–26)%, 晕眩回复和格挡回复提高 (10–11)%", "level": 3 },
        { "name": "犀牛的", "value": "该装备的护甲提高 (27–32)%, 晕眩回复和格挡回复提高 (12–13)%", "level": 4 },
        { "name": "大象的", "value": "该装备的护甲提高 (33–38)%, 晕眩回复和格挡回复提高 (14–15)%", "level": 5 },
        { "name": "长毛象的", "value": "该装备的护甲提高 (39–42)%, 晕眩回复和格挡回复提高 (16–17)%", "level": 6 }
    ],
    "该装备的闪避提高":[
        { "name": "阴影的", "value": "该装备的护甲、闪避和能量护盾提高 (27–42)%", "level": 1 },
        { "name": "空灵的", "value": "该装备的护甲、闪避和能量护盾提高 (43–55)%", "level": 2 },
        { "name": "脱俗的", "value": "该装备的护甲、闪避和能量护盾提高 (56–67)%", "level": 3 },
        { "name": "无常的", "value": "该装备的护甲、闪避和能量护盾提高 (68–79)%", "level": 4 },
        { "name": "逝去的", "value": "该装备的护甲、闪避和能量护盾提高 (80–91)%", "level": 5 },
        { "name": "虚幻的", "value": "该装备的护甲、闪避和能量护盾提高 (92–100)%", "level": 6 },
        { "name": "无形的", "value": "该装备的护甲、闪避和能量护盾提高 (101–110)%", "level": 7 }
    ],
    "该装备的闪避提高 晕眩回复和格挡回复提高":[
        { "name": "蚊子的", "value": "该装备的护甲、闪避和能量护盾提高 (6–13)% 晕眩回复和格挡回复提高 (6–7)%", "level": 1 },
        { "name": "飞蛾的", "value": "该装备的护甲、闪避和能量护盾提高 (14–20)% 晕眩回复和格挡回复提高 (8–9)%", "level": 2 },
        { "name": "蝴蝶的", "value": "该装备的护甲、闪避和能量护盾提高 (21–26)% 晕眩回复和格挡回复提高 (10–11)%", "level": 3 },
        { "name": "黄蜂的", "value": "该装备的护甲、闪避和能量护盾提高 (27–32)% 晕眩回复和格挡回复提高 (12–13)%", "level": 4 },
        { "name": "蜻蜓的", "value": "该装备的护甲、闪避和能量护盾提高 (33–38)% 晕眩回复和格挡回复提高 (14–15)%", "level": 5 },
        { "name": "蜂鸟的", "value": "该装备的护甲、闪避和能量护盾提高 (39–42)% 晕眩回复和格挡回复提高 (16–17)%", "level": 6 }
    ],
    "该装备的能量护盾提高":[
        { "name": "保护的", "value": "该装备的能量护盾提高 (11–28)%", "level": 1 },
        { "name": "意志坚强的", "value": "该装备的能量护盾提高 (27–42)%", "level": 2 },
        { "name": "坚决的", "value": "该装备的能量护盾提高 (43–55)%", "level": 3 },
        { "name": "无惧的", "value": "该装备的能量护盾提高 (56–67)%", "level": 4 },
        { "name": "无畏的", "value": "该装备的能量护盾提高 (68–79)%", "level": 5 },
        { "name": "无法征服的", "value": "该装备的能量护盾提高 (80–91)%", "level": 6 },
        { "name": "坚不可摧的", "value": "该装备的能量护盾提高 (92–100)%", "level": 7 },
        { "name": "稳步坚决的", "value": "该装备的能量护盾提高 (101–110)%", "level": 8 }
    ],
    "该装备的能量护盾提高 晕眩回复和格挡回复提高":[
        { "name": "妖精的", "value": "该装备的能量护盾提高 (6–13)% 晕眩回复和格挡回复提高 (6–7)%", "level": 1 },
        { "name": "小魔怪的", "value": "该装备的能量护盾提高 (14–20)% 晕眩回复和格挡回复提高 (8–9)%", "level": 2 },
        { "name": "幻形怪的", "value": "该装备的能量护盾提高 (21–26)% 晕眩回复和格挡回复提高 (10–11)%", "level": 3 },
        { "name": "纳迦的", "value": "该装备的能量护盾提高 (27–32)% 晕眩回复和格挡回复提高 (12–13)%", "level": 4 },
        { "name": "巨灵的", "value": "该装备的能量护盾提高 (33–38)% 晕眩回复和格挡回复提高 (14–15)%", "level": 5 },
        { "name": "六翼天使的", "value": "该装备的能量护盾提高 (39–42)% 晕眩回复和格挡回复提高 (16–17)%", "level": 6 }
    ],

    "该装备的护甲,闪避提高":[
        { "name": "拆解的", "value": "该装备的护甲与闪避提高 (15–26)%", "level": 1 },
        { "name": "打斗者的", "value": "该装备的护甲与闪避提高 (27–42)%", "level": 2 },
        { "name": "击剑士的", "value": "该装备的护甲与闪避提高 (43–55)%", "level": 3 },
        { "name": "角斗士的", "value": "该装备的护甲与闪避提高 (56–67)%", "level": 4 },
        { "name": "决斗的", "value": "该装备的护甲与闪避提高 (68–79)%", "level": 5 },
        { "name": "英雄的", "value": "该装备的护甲与闪避提高 (80–91)%", "level": 6 },
        { "name": "传说的", "value": "该装备的护甲与闪避提高 (92–100)%", "level": 7 },
        { "name": "胜利的", "value": "该装备的护甲与闪避提高 (101–110)%", "level": 8 }
    ],
    "该装备的护甲,闪避提高 晕眩回复和格挡回复提高":[
        { "name": "甲虫的", "value": "该装备的护甲与闪避提高 (6–13)% 晕眩回复和格挡回复提高 (6–7)%", "level": 1 },
        { "name": "螃蟹的", "value": "该装备的护甲与闪避提高 (14–20)% 晕眩回复和格挡回复提高 (8–9)%", "level": 2 },
        { "name": "犰狳的", "value": "该装备的护甲与闪避提高 (21–26)% 晕眩回复和格挡回复提高 (10–11)%", "level": 3 },
        { "name": "犀牛的", "value": "该装备的护甲与闪避提高 (27–32)% 晕眩回复和格挡回复提高 (12–13)%", "level": 4 },
        { "name": "大象的", "value": "该装备的护甲与闪避提高 (33–38)% 晕眩回复和格挡回复提高 (14–15)%", "level": 5 },
        { "name": "长毛象的", "value": "该装备的护甲与闪避提高 (39–42)% 晕眩回复和格挡回复提高 (16–17)%", "level": 6 }
    ],
    "该装备的护甲,能量护盾提高":[
        { "name": "嵌入的", "value": "该装备的护甲与能量护盾提高 (15–26)%", "level": 1 },
        { "name": "扎根的", "value": "该装备的护甲与能量护盾提高 (27–42)%", "level": 2 },
        { "name": "灌输的", "value": "该装备的护甲与能量护盾提高 (43–55)%", "level": 3 },
        { "name": "灌注的", "value": "该装备的护甲与能量护盾提高 (56–67)%", "level": 4 },
        { "name": "重灌的", "value": "该装备的护甲与能量护盾提高 (68–79)%", "level": 5 },
        { "name": "窜改的", "value": "该装备的护甲与能量护盾提高 (80–91)%", "level": 6 },
        { "name": "鼓舞的", "value": "该装备的护甲与能量护盾提高 (92–100)%", "level": 7 },
        { "name": "渗入的", "value": "该装备的护甲与能量护盾提高 (101–110)%", "level": 8 }
    ],
    "该装备的护甲,能量护盾提高 晕眩回复和格挡回复提高":[
        { "name": "妖精的", "value": "该装备的护甲与能量护盾提高 (6–13)% 晕眩回复和格挡回复提高 (6–7)%", "level": 1 },
        { "name": "小魔怪的", "value": "该装备的护甲与能量护盾提高 (14–20)% 晕眩回复和格挡回复提高 (8–9)%", "level": 2 },
        { "name": "幻形怪的", "value": "该装备的护甲与能量护盾提高 (21–26)% 晕眩回复和格挡回复提高 (10–11)%", "level": 3 },
        { "name": "纳迦的", "value": "该装备的护甲与能量护盾提高 (27–32)% 晕眩回复和格挡回复提高 (12–13)%", "level": 4 },
        { "name": "巨灵的", "value": "该装备的护甲与能量护盾提高 (33–38)% 晕眩回复和格挡回复提高 (14–15)%", "level": 5 },
        { "name": "六翼天使的", "value": "该装备的护甲与能量护盾提高 (39–42)% 晕眩回复和格挡回复提高 (16–17)%", "level": 6 }
    ],
    "该装备的闪避,能量护盾提高":[
        { "name": "阴影的", "value": "该装备的闪避与能量护盾提高 (15–26)%", "level": 1 },
        { "name": "空灵的", "value": "该装备的闪避与能量护盾提高 (27–42)%", "level": 2 },
        { "name": "脱俗的", "value": "该装备的闪避与能量护盾提高 (43–55)%", "level": 3 },
        { "name": "无常的", "value": "该装备的闪避与能量护盾提高 (56–67)%", "level": 4 },
        { "name": "逝去的", "value": "该装备的闪避与能量护盾提高 (68–79)%", "level": 5 },
        { "name": "虚幻的", "value": "该装备的闪避与能量护盾提高 (80–91)%", "level": 6 },
        { "name": "幻觉的", "value": "该装备的闪避与能量护盾提高 (92–100)%", "level": 7 },
        { "name": "无形的", "value": "该装备的闪避与能量护盾提高 (101–110)%", "level": 8 }
    ],
    "该装备的闪避,能量护盾提高 晕眩回复和格挡回复提高":[
        {"name": "蚊子的", "value": "该装备的闪避与能量护盾提高 (6–13)% 晕眩回复和格挡回复提高 (6–7)%", "level": 1},
        {"name": "飞蛾的", "value": "该装备的闪避与能量护盾提高 (14–20)% 晕眩回复和格挡回复提高 (8–9)%", "level": 2},
        {"name": "蝴蝶的", "value": "该装备的闪避与能量护盾提高 (21–26)% 晕眩回复和格挡回复提高 (10–11)%", "level": 3},
        {"name": "黄蜂的", "value": "该装备的闪避与能量护盾提高 (27–32)% 晕眩回复和格挡回复提高 (12–13)%", "level": 4},
        {"name": "蜻蜓的", "value": "该装备的闪避与能量护盾提高 (33–38)% 晕眩回复和格挡回复提高 (14–15)%", "level": 5},
        {"name": "蜂鸟的", "value": "该装备的闪避与能量护盾提高 (39–42)% 晕眩回复和格挡回复提高 (16–17)%", "level": 6}
    ],

    "力量": [
        { "level": 1, "name": "野蛮之", "value": "+(8–12) 力量" },
        { "level": 2, "name": "摔角手之", "value": "+(13–17) 力量" },
        { "level": 3, "name": "熊之", "value": "+(18–22) 力量" },
        { "level": 4, "name": "狮子之", "value": "+(23–27) 力量" },
        { "level": 5, "name": "大猩猩之", "value": "+(28–32) 力量" },
        { "level": 6, "name": "巨人之", "value": "+(33–37) 力量" },
        { "level": 7, "name": "海兽之", "value": "+(38–42) 力量" },
        { "level": 8, "name": "泰坦之", "value": "+(43–50) 力量" },
        { "level": 9, "name": "众神之", "value": "+(51–55) 力量" },
        { "level": 10, "name": "弑神之", "value": "+(56–60) 力量" }
    ],
    "敏捷": [
        { "level": 1, "name": "猫鼬之", "value": "+(8–12) 敏捷" },
        { "level": 2, "name": "山猫之", "value": "+(13–17) 敏捷" },
        { "level": 3, "name": "狐狸之", "value": "+(18–22) 敏捷" },
        { "level": 4, "name": "猎鹰之", "value": "+(23–27) 敏捷" },
        { "level": 5, "name": "豹之", "value": "+(28–32) 敏捷" },
        { "level": 6, "name": "花豹之", "value": "+(33–37) 敏捷" },
        { "level": 7, "name": "美洲豹之", "value": "+(38–42) 敏捷" },
        { "level": 8, "name": "幻影之", "value": "+(43–50) 敏捷" },
        { "level": 9, "name": "风之", "value": "+(51–55) 敏捷" },
        { "level": 10, "name": "迷幻之", "value": "+(56–60) 敏捷" }
    ],
    "智慧": [
        { "level": 1, "name": "瞳孔之", "value": "+(8–12) 智慧" },
        { "level": 2, "name": "学徒之", "value": "+(13–17) 智慧" },
        { "level": 3, "name": "奇才之", "value": "+(18–22) 智慧" },
        { "level": 4, "name": "预言之", "value": "+(23–27) 智慧" },
        { "level": 5, "name": "哲学家之", "value": "+(28–32) 智慧" },
        { "level": 6, "name": "圣人之", "value": "+(33–37) 智慧" },
        { "level": 7, "name": "大学者之", "value": "+(38–42) 智慧" },
        { "level": 8, "name": "神技之", "value": "+(43–50) 智慧" },
        { "level": 9, "name": "天才之", "value": "+(51–55) 智慧" },
        { "level": 10, "name": "博学之", "value": "+(56–60) 智慧" }
    ],
    "全属性": [
        { "name": "云端之", "value": "+(1–4) 全属性", "level": 1 },
        { "name": "天空之", "value": "+(5–8) 全属性", "level": 2 },
        { "name": "流星之", "value": "+(9–12) 全属性", "level": 3 },
        { "name": "彗星之", "value": "+(13–16) 全属性", "level": 4 },
        { "name": "天堂之", "value": "+(17–20) 全属性", "level": 5 },
        { "name": "银河之", "value": "+(21–24) 全属性", "level": 6 },
        { "name": "宇宙之", "value": "+(25–28) 全属性", "level": 7 },
        { "name": "无限之", "value": "+(29–32) 全属性", "level": 8 },
        { "name": "多维之", "value": "+(33–35) 全属性", "level": 9 }
    ],

    "攻击速度加快": [
        { "level": 1, "name": "技巧之", "value": "攻击速度加快 (5–7)%" },
        { "level": 2, "name": "轻松之", "value": "攻击速度加快 (8–10)%" },
        { "level": 3, "name": "成熟之", "value": "攻击速度加快 (11–13)%" },
        { "level": 4, "name": "声望之", "value": "攻击速度加快 (14–16)%" },
        { "level": 5, "name": "喝采之", "value": "攻击速度加快 (17–19)%" },
        { "level": 6, "name": "名声之", "value": "攻击速度加快 (20–22)%" },
        { "level": 7, "name": "恶名之", "value": "攻击速度加快 (23–25)%" },
        { "level": 8, "name": "庆祝之", "value": "攻击速度加快 (26–27)%" }
    ],
    "施法速度加快": [
        { "level": 1, "value": "施法速度加快 (5–8)%", "name": "人才之" },
        { "level": 2, "value": "施法速度加快 (9–12)%", "name": "灵活应变之" },
        { "level": 3, "value": "施法速度加快 (13–16)%", "name": "有经验之" },
        { "level": 4, "value": "施法速度加快 (17–20)%", "name": "障眼法之" },
        { "level": 5, "value": "施法速度加快 (21–24)%", "name": "伎俩之" },
        { "level": 6, "value": "施法速度加快 (25–28)%", "name": "巫术之" },
        { "level": 7, "value": "施法速度加快 (29–32)%", "name": "娴熟之" }
    ],
    "施法速度加快(长杖)": [
        { "level": 1, "value": "施法速度加快 (8-13)%", "name": "人才之" },
        { "level": 2, "value": "施法速度加快 (14-19)%", "name": "灵活应变之" },
        { "level": 3, "value": "施法速度加快 (20-25)%", "name": "有经验之" },
        { "level": 4, "value": "施法速度加快 (26-31)%", "name": "障眼法之" },
        { "level": 5, "value": "施法速度加快 (32-37)%", "name": "伎俩之" },
        { "level": 6, "value": "施法速度加快 (38-43)%", "name": "巫术之" },
        { "level": 7, "value": "施法速度加快 (44-49)%", "name": "娴熟之" }
    ],

    "火焰抗性": [
        { "level": 1, "name": "幼龙之", "value": "+(6–11)% 火焰抗性" },
        { "level": 2, "name": "火蜥蜴之", "value": "+(12–17)% 火焰抗性" },
        { "level": 3, "name": "火龙之", "value": "+(18–23)% 火焰抗性" },
        { "level": 4, "name": "窑炉之", "value": "+(24–29)% 火焰抗性" },
        { "level": 5, "name": "炉火之", "value": "+(30–35)% 火焰抗性" },
        { "level": 6, "name": "火山之", "value": "+(36–41)% 火焰抗性" },
        { "level": 7, "name": "岩浆之", "value": "+(42–45)% 火焰抗性" },
        { "level": 8, "name": "提耶须之", "value": "+(46–48)% 火焰抗性" }
    ],
    "冰霜抗性": [
        { "level": 1, "name": "北方民族之", "value": "+(6–11)% 冰霜抗性" },
        { "level": 2, "name": "海豹之", "value": "+(12–17)% 冰霜抗性" },
        { "level": 3, "name": "企鹅之", "value": "+(18–23)% 冰霜抗性" },
        { "level": 4, "name": "雪人之", "value": "+(24–29)% 冰霜抗性" },
        { "level": 5, "name": "海象之", "value": "+(30–35)% 冰霜抗性" },
        { "level": 6, "name": "北极熊之", "value": "+(36–41)% 冰霜抗性" },
        { "level": 7, "name": "冰之", "value": "+(42–45)% 冰霜抗性" },
        { "level": 8, "name": "哈斯特之", "value": "+(46–48)% 冰霜抗性" }
    ],
    "闪电抗性": [
        { "level": 1, "name": "云朵之", "value": "+(6–11)% 闪电抗性" },
        { "level": 2, "name": "冰雹之", "value": "+(12–17)% 闪电抗性" },
        { "level": 3, "name": "暴风之", "value": "+(18–23)% 闪电抗性" },
        { "level": 4, "name": "积雨云之", "value": "+(24–29)% 闪电抗性" },
        { "level": 5, "name": "暴风雨之", "value": "+(30–35)% 闪电抗性" },
        { "level": 6, "name": "台风之", "value": "+(36–41)% 闪电抗性" },
        { "level": 7, "name": "电之", "value": "+(42–45)% 闪电抗性" },
        { "level": 8, "name": "艾菲吉之", "value": "+(46–48)% 闪电抗性" }
    ],
    "混沌抗性": [
        { "level": 1, "name": "失落之", "value": "+(5–10)% 混沌抗性" },
        { "level": 2, "name": "放逐之", "value": "+(11–15)% 混沌抗性" },
        { "level": 3, "name": "驱逐之", "value": "+(16–20)% 混沌抗性" },
        { "level": 4, "name": "出境之", "value": "+(21–25)% 混沌抗性" },
        { "level": 5, "name": "流亡之", "value": "+(26–30)% 混沌抗性" },
        { "level": 6, "name": "巴曼斯之", "value": "+(31–35)% 混沌抗性" }
    ],
    "所有元素抗性": [
        { "name": "水晶之", "value": "所有元素抗性(3–5)%", "level": 1 },
        { "name": "棱镜之", "value": "所有元素抗性(6–8)%", "level": 2 },
        { "name": "万花筒之", "value": "所有元素抗性(9–11)%", "level": 3 },
        { "name": "多彩之", "value": "所有元素抗性(12–14)%", "level": 4 },
        { "name": "彩虹之", "value": "所有元素抗性(15–16)%", "level": 5 },
        { "name": "博色之", "value": "所有元素抗性(17–18)%", "level": 6 }
    ],

    "火焰伤害": [
        { "level": 1, "name": "余烬之", "value": "(3–7)% 火焰伤害提高" },
        { "level": 2, "name": "煤之", "value": "(8–12)% 火焰伤害提高" },
        { "level": 3, "name": "灰烬之", "value": "(13–17)% 火焰伤害提高" },
        { "level": 4, "name": "烈焰之", "value": "(18–22)% 火焰伤害提高" },
        { "level": 5, "name": "献祭之", "value": "(23–26)% 火焰伤害提高" },
        { "level": 6, "name": "骨灰之", "value": "(27–30)% 火焰伤害提高" }
    ],
    "冰霜伤害": [
        { "level": 1, "name": "雪之", "value": "(3–7)% 冰霜伤害提高" },
        { "level": 2, "name": "雨雪之", "value": "(8–12)% 冰霜伤害提高" },
        { "level": 3, "name": "冰之", "value": "(13–17)% 冰霜伤害提高" },
        { "level": 4, "name": "雾凇之", "value": "(18–22)% 冰霜伤害提高" },
        { "level": 5, "name": "浮冰之", "value": "(23–26)% 冰霜伤害提高" },
        { "level": 6, "name": "冰河时期之", "value": "(27–30)% 冰霜伤害提高" }
    ],
    "闪电伤害": [
        { "level": 1, "name": "火花之", "value": "(3–7)% 闪电伤害提高" },
        { "level": 2, "name": "静电之", "value": "(8–12)% 闪电伤害提高" },
        { "level": 3, "name": "电能之", "value": "(13–17)% 闪电伤害提高" },
        { "level": 4, "name": "伏特之", "value": "(18–22)% 闪电伤害提高" },
        { "level": 5, "name": "放电之", "value": "(23–26)% 闪电伤害提高" },
        { "level": 6, "name": "电弧之", "value": "(27–30)% 闪电伤害提高" }
    ],

    "敌人被晕眩时间延长": [
        { "level": 1, "name": "冲击之", "value": "敌人被晕眩时间延长 (11–15)%" },
        { "level": 2, "name": "晕眩之", "value": "敌人被晕眩时间延长 (16–20)%" },
        { "level": 3, "name": "击晕之", "value": "敌人被晕眩时间延长 (21–25)%" },
        { "level": 4, "name": "轰击之", "value": "敌人被晕眩时间延长 (26–30)%" },
        { "level": 5, "name": "蹒跚之", "value": "敌人被晕眩时间延长 (31–35)%" }
    ],
    "敌人晕眩门槛降低": [
        { "level": 1, "name": "拳击之", "value": "敌人晕眩门槛降低 (5–7)%" },
        { "level": 2, "name": "打斗之", "value": "敌人晕眩门槛降低 (8–9)%" },
        { "level": 3, "name": "格斗家之", "value": "敌人晕眩门槛降低 (10–11)%" },
        { "level": 4, "name": "战斗之", "value": "敌人晕眩门槛降低 (12–13)%" },
        { "level": 5, "name": "角斗士之", "value": "敌人晕眩门槛降低 (14–15)%" }
    ],

    "击中回血": [
        { "level": 1, "name": "回春之", "value": "每击中一名敌人获得 2 点生命" },
        { "level": 2, "name": "恢复之", "value": "每击中一名敌人获得 3 点生命" },
        { "level": 3, "name": "再生之", "value": "每击中一名敌人获得 4 点生命" },
        { "level": 4, "name": "营养之", "value": "每击中一名敌人获得 5 点生命" }
    ],
    "击败回血": [
        { "level": 1, "name": "成功之", "value": "每击败一名敌人获得 (3–6) 点生命" },
        { "level": 2, "name": "胜利之", "value": "每击败一名敌人获得 (7–10) 点生命" },
        { "level": 3, "name": "凯旋之", "value": "每击败一名敌人获得 (11–14) 点生命" }
    ],
    "击败回蓝": [
        { "level": 1, "name": "吸收之", "value": "每击败一名敌人获得 1 点魔力" },
        { "level": 2, "name": "逆渗透之", "value": "每击败一名敌人获得 (2–3) 点魔力" },
        { "level": 3, "name": "消耗之", "value": "每击败一名敌人获得 (4–6) 点魔力" }
    ],

    "生命每秒再生": [
        { "name": "蝾螈之", "value": "生命每秒再生 (1–2)", "level": 1 },
        { "name": "蜥蜴之", "value": "生命每秒再生 (2.1–8)", "level": 2 },
        { "name": "海星之", "value": "生命每秒再生 (8.1–16)", "level": 3 },
        { "name": "九头蛇之", "value": "生命每秒再生 (16.1–24)", "level": 4 },
        { "name": "食人妖之", "value": "生命每秒再生 (24.1–32)", "level": 5 },
        { "name": "食人之", "value": "生命每秒再生 (32.1–48)", "level": 6 },
        { "name": "瑞斯拉萨之", "value": "生命每秒再生 (48.1–64)", "level": 7 },
        { "name": "凤凰之", "value": "生命每秒再生 (64.1–96)", "level": 8 },
        { "name": "复原之", "value": "生命每秒再生 (96.1–128)", "level": 9 }
    ],
    "魔力再生率提高": [
        { "level": 1, "name": "兴奋之", "value": "魔力再生率提高 (10–19)%" },
        { "level": 2, "name": "喜悦之", "value": "魔力再生率提高 (20–29)%" },
        { "level": 3, "name": "兴高采烈之", "value": "魔力再生率提高 (30–39)%" },
        { "level": 4, "name": "极乐之", "value": "魔力再生率提高 (40–49)%" },
        { "level": 5, "name": "幸福之", "value": "魔力再生率提高 (50–59)%" },
        { "level": 6, "name": "涅盘之", "value": "魔力再生率提高 (60–69)%" }
    ],
    "生命再生率提高": [
        {"name": "精神之", "value": "生命再生率提高 (9–11)%", "level": 1},
        {"name": "永恒之", "value": "生命再生率提高 (12–14)%", "level": 2},
        {"name": "苏生之", "value": "生命再生率提高 (15–17)%", "level": 3},
        {"name": "年轻之", "value": "生命再生率提高 (18–19)%", "level": 4},
        {"name": "恒久之", "value": "生命再生率提高 (20–21)%", "level": 5}
    ],

    "点燃概率(单手)": [
        { "level": 1, "name": "点燃之", "value": "有 10% 的几率点燃" },
        { "level": 2, "name": "灼烧之", "value": "有 15% 的几率点燃" },
        { "level": 3, "name": "燃爆之", "value": "有 20% 的几率点燃" }
    ],
    "冻结概率(单手)": [
        { "level": 1, "name": "冰冻之", "value": "有 10% 的几率造成冻结状态" },
        { "level": 2, "name": "黯淡之", "value": "有 15% 的几率造成冻结状态" },
        { "level": 3, "name": "北风呼啸之", "value": "有 20% 的几率造成冻结状态" }
    ],
    "感电概率(单手)": [
        { "level": 1, "name": "导电之", "value": "闪电伤害击中时有 10% 的几率使敌人受到感电效果影响" },
        { "level": 2, "name": "摧毁之", "value": "闪电伤害击中时有 15% 的几率使敌人受到感电效果影响" },
        { "level": 3, "name": "电殛之", "value": "闪电伤害击中时有 20% 的几率使敌人受到感电效果影响" }
    ],

    "点燃概率(双手)": [
        { "level": 1, "name": "点燃之", "value": "有 20% 的几率点燃" },
        { "level": 2, "name": "灼烧之", "value": "有 25% 的几率点燃" },
        { "level": 3, "name": "燃爆之", "value": "有 30% 的几率点燃" }
    ],
    "冻结概率(双手)": [
        { "level": 1, "name": "冰冻之", "value": "有 20% 的几率造成冻结状态" },
        { "level": 2, "name": "黯淡之", "value": "有 25% 的几率造成冻结状态" },
        { "level": 3, "name": "北风呼啸之", "value": "有 30% 的几率造成冻结状态" }
    ],
    "感电概率(双手)": [
        { "level": 1, "name": "导电之", "value": "闪电伤害击中时有 20% 的几率使敌人受到感电效果影响" },
        { "level": 2, "name": "摧毁之", "value": "闪电伤害击中时有 25% 的几率使敌人受到感电效果影响" },
        { "level": 3, "name": "电殛之", "value": "闪电伤害击中时有 30% 的几率使敌人受到感电效果影响" }
    ],

    "武器攻击暴击率": [
        { "level": 1, "name": "针刺之", "value": "该装备的攻击暴击率提高 (10–14)%" },
        { "level": 2, "name": "刺痛之", "value": "该装备的攻击暴击率提高 (15–19)%" },
        { "level": 3, "name": "刺穿之", "value": "该装备的攻击暴击率提高 (20–24)%" },
        { "level": 4, "name": "穿孔之", "value": "该装备的攻击暴击率提高 (25–29)%" },
        { "level": 5, "name": "穿透之", "value": "该装备的攻击暴击率提高 (30–34)%" },
        { "level": 6, "name": "手术之", "value": "该装备的攻击暴击率提高 (35–38)%" }
    ],
    "法术暴击率提高": [
        { "level": 1, "name": "威胁之", "value": "(10–19)% 法术暴击率提高" },
        { "level": 2, "name": "浩劫之", "value": "(20–39)% 法术暴击率提高" },
        { "level": 3, "name": "灾害之", "value": "(40–59)% 法术暴击率提高" },
        { "level": 4, "name": "灾难之", "value": "(60–79)% 法术暴击率提高" },
        { "level": 5, "name": "灭绝之", "value": "(80–99)% 法术暴击率提高" },
        { "level": 6, "name": "解构之", "value": "(100–109)% 法术暴击率提高" }
    ],
    "全域暴击伤害加成": [
        { "level": 1, "name": "怒火之", "value": "全域暴击伤害加成 +(10–14)%" },
        { "level": 2, "name": "愤怒之", "value": "全域暴击伤害加成 +(15–19)%" },
        { "level": 3, "name": "狂怒之", "value": "全域暴击伤害加成 +(20–24)%" },
        { "level": 4, "name": "狂暴之", "value": "全域暴击伤害加成 +(25–29)%" },
        { "level": 5, "name": "凶暴之", "value": "全域暴击伤害加成 +(30–34)%" },
        { "level": 6, "name": "毁灭之", "value": "全域暴击伤害加成 +(35–38)%" }
    ],
    "全域暴击率提高": [
        { "name": "针刺之", "value": "全域暴击率提高(10–14)%", "level": 1 },
        { "name": "刺痛之", "value": "全域暴击率提高(15–19)%", "level": 2 },
        { "name": "刺穿之", "value": "全域暴击率提高(20–24)%", "level": 3 },
        { "name": "破裂之", "value": "全域暴击率提高(25–29)%", "level": 4 },
        { "name": "穿透之", "value": "全域暴击率提高(30–34)%", "level": 5 },
        { "name": "手术之", "value": "全域暴击率提高(35–38)%", "level": 6 }
    ],

    "属性需求降低": [
        { "level": 1, "name": "价值之", "value": "属性需求降低 18%" },
        { "level": 2, "name": "容易之", "value": "属性需求降低 32%" }
    ],

    "命中值(武器)": [
        { "level": 1, "name": "稳健之", "value": "+(80–130) 命中值" },
        { "level": 2, "name": "精密之", "value": "+(131–215) 命中值" },
        { "level": 3, "name": "狙击手之", "value": "+(216–325) 命中值" },
        { "level": 4, "name": "神射手之", "value": "+(326–455) 命中值" },
        { "level": 5, "name": "游侠之", "value": "+(456–624) 命中值" },
        { "level": 6, "name": "狮眼之", "value": "+(625–780) 命中值" }
    ],
    "命中值(非武器)": [
        { "level": 1, "name": "稳健之", "value": "+(50–100) 命中值" },
        { "level": 2, "name": "精密之", "value": "+(100–165) 命中值" },
        { "level": 3, "name": "狙击手之", "value": "+(166–250) 命中值" },
        { "level": 4, "name": "神射手之", "value": "+(251–350) 命中值" },
        { "level": 5, "name": "游侠之", "value": "+(351–480) 命中值" },
        { "level": 6, "name": "狮眼之", "value": "+(481–600) 命中值" }
    ],
    "命中值和照亮范围扩大": [
        { "level": 3, "name": "光辉之", "value": "命中值提高 (16–20)%，照亮范围扩大 15%" },
        { "level": 1, "name": "闪亮之", "value": "命中值提高 (9–11)%，照亮范围扩大 5%" },
        { "level": 2, "name": "光明之", "value": "命中值提高 (12–15)%，照亮范围扩大 10%" }
    ],

    "中毒伤害和中毒几率": [
        { "level": 1, "name": "有毒之", "value": "中毒伤害提高 (21–30)%，击中时有 20% 的几率使目标中毒" },
        { "level": 2, "name": "猛毒之", "value": "中毒伤害提高 (31–40)%，击中时有 25% 的几率使目标中毒" },
        { "level": 3, "name": "烈毒之", "value": "中毒伤害提高 (41–50)%，击中时有 30% 的几率使目标中毒" }
    ],
    "流血伤害和流血几率": [
        { "level": 1, "name": "有血之", "value": "攻击有 20% 的几率导致流血，流血伤害提高 (21–30)%" },
        { "level": 2, "name": "出血之", "value": "攻击有 25% 的几率导致流血，流血伤害提高 (31–40)%" },
        { "level": 3, "name": "放血之", "value": "攻击有 30% 的几率导致流血，流血伤害提高 (41–50)%" }
    ],

    "攻击技能的持续伤害加成": [
        { "name": "尖刻之", "value": "攻击技能的持续伤害加成 +(7–11)%", "level": 1 },
        { "name": "分散之", "value": "攻击技能的持续伤害加成 +(12–15)%", "level": 2 },
        { "name": "液化之", "value": "攻击技能的持续伤害加成 +(16–19)%", "level": 3 },
        { "name": "融化之", "value": "攻击技能的持续伤害加成 +(20–23)%", "level": 4 },
        { "name": "溶解之", "value": "攻击技能的持续伤害加成 +(24–26)%", "level": 5 }
    ],
    "所有持续伤害加成(单手和项链)": [
        { "level": 1, "name": "尖刻之", "value": "+(7–11)% 持续伤害加成" },
        { "level": 2, "name": "分散之", "value": "+(12–15)% 持续伤害加成" },
        { "level": 3, "name": "液化之", "value": "+(16–19)% 持续伤害加成" },
        { "level": 4, "name": "融化之", "value": "+(20–23)% 持续伤害加成" },
        { "level": 5, "name": "溶解之", "value": "+(24–26)% 持续伤害加成" }
    ],
    "所有持续伤害加成(双手)": [
        { "level": 1, "name": "尖刻之", "value": "+(16–21)% 持续伤害加成" },
        { "level": 2, "name": "分散之", "value": "+(24–29)% 持续伤害加成" },
        { "level": 3, "name": "液化之", "value": "+(31–35)% 持续伤害加成" },
        { "level": 4, "name": "融化之", "value": "+(36–40)% 持续伤害加成" },
        { "level": 5, "name": "溶解之", "value": "+(41–45)% 持续伤害加成" }
    ],

    "燃烧伤害(单手)": [
        { "level": 1, "name": "燃烧之", "value": "燃烧伤害提高 (26–30)%" },
        { "level": 2, "name": "烫伤之", "value": "燃烧伤害提高 (31–35)%" },
        { "level": 3, "name": "重灼之", "value": "燃烧伤害提高 (36–40)%" }
    ],
    "燃烧伤害(双手)": [
        { "level": 1, "name": "燃烧之", "value": "燃烧伤害提高 (31–40)%" },
        { "level": 2, "name": "烫伤之", "value": "燃烧伤害提高 (41–50)%" },
        { "level": 3, "name": "重灼之", "value": "燃烧伤害提高 (51–60)%" }
    ],

    "持续伤害加成(单手)": [
        { "level": 1, "name": "衰损之", "value": "+(14–18)% 混沌持续伤害加成" },
        { "level": 2, "name": "荒废之", "value": "+(19–23)% 混沌持续伤害加成" },
        { "level": 3, "name": "退化之", "value": "+(24–28)% 混沌持续伤害加成" },
        { "level": 4, "name": "萎减之", "value": "+(29–33)% 混沌持续伤害加成" },
        { "level": 5, "name": "崩离之", "value": "+(34–38)% 混沌持续伤害加成" },
        { "level": 1, "name": "阴酷之", "value": "+(14–18)% 冰霜持续伤害加成" },
        { "level": 2, "name": "阴黯之", "value": "+(19–23)% 冰霜持续伤害加成" },
        { "level": 3, "name": "北风之", "value": "+(24–28)% 冰霜持续伤害加成" },
        { "level": 4, "name": "极冷之", "value": "+(29–33)% 冰霜持续伤害加成" },
        { "level": 5, "name": "凝心之", "value": "+(34–38)% 冰霜持续伤害加成" },
        { "level": 1, "name": "热忱之", "value": "+(14–18)% 火焰持续伤害加成" },
        { "level": 2, "name": "激昂之", "value": "+(19–23)% 火焰持续伤害加成" },
        { "level": 3, "name": "热切之", "value": "+(24–28)% 火焰持续伤害加成" },
        { "level": 4, "name": "狂热之", "value": "+(29–33)% 火焰持续伤害加成" },
        { "level": 5, "name": "狂信之", "value": "+(34–38)% 火焰持续伤害加成" },
        { "level": 1, "name": "渗出之", "value": "+(14–18)% 物理持续伤害加成" },
        { "level": 2, "name": "渗漏之", "value": "+(19–23)% 物理持续伤害加成" },
        { "level": 3, "name": "抽血之", "value": "+(24–28)% 物理持续伤害加成" },
        { "level": 4, "name": "溢血之", "value": "+(29–33)% 物理持续伤害加成" },
        { "level": 5, "name": "放血之", "value": "+(34–38)% 物理持续伤害加成" }
    ],
    "持续伤害加成(双手)": [
        { "level": 1, "name": "衰损之", "value": "(26–35)% 混沌持续伤害加成" },
        { "level": 2, "name": "荒废之", "value": "(36–45)% 混沌持续伤害加成" },
        { "level": 3, "name": "退化之", "value": "(46–55)% 混沌持续伤害加成" },
        { "level": 4, "name": "萎减之", "value": "(56–65)% 混沌持续伤害加成" },
        { "level": 5, "name": "崩离之", "value": "(66–75)% 混沌持续伤害加成" },
        { "level": 1, "name": "阴酷之", "value": "(26–35)% 冰霜持续伤害加成" },
        { "level": 2, "name": "阴黯之", "value": "(36–45)% 冰霜持续伤害加成" },
        { "level": 3, "name": "北风之", "value": "(46–55)% 冰霜持续伤害加成" },
        { "level": 4, "name": "极冷之", "value": "(56–65)% 冰霜持续伤害加成" },
        { "level": 5, "name": "凝心之", "value": "(66–75)% 冰霜持续伤害加成" },
        { "level": 1, "name": "热忱之", "value": "(26–35)% 火焰持续伤害加成" },
        { "level": 2, "name": "激昂之", "value": "(36–45)% 火焰持续伤害加成" },
        { "level": 3, "name": "热切之", "value": "(46–55)% 火焰持续伤害加成" },
        { "level": 4, "name": "狂热之", "value": "(56–65)% 火焰持续伤害加成" },
        { "level": 5, "name": "狂信之", "value": "(66–75)% 火焰持续伤害加成" },
        { "level": 1, "name": "渗出之", "value": "(26–35)% 物理持续伤害加成" },
        { "level": 2, "name": "渗漏之", "value": "(36–45)% 物理持续伤害加成" },
        { "level": 3, "name": "抽血之", "value": "(46–55)% 物理持续伤害加成" },
        { "level": 4, "name": "溢血之", "value": "(56–65)% 物理持续伤害加成" },
        { "level": 5, "name": "放血之", "value": "(66–75)% 物理持续伤害加成" }
    ]
};

    // 同步显示装备属性bug版本
    /*setInterval(function(){
        let ps = document.getElementsByClassName("stats");
        if(ps && ps.length>0){
            //console.log(ps.length+":"+PSL);
            if(ps.length>PSL){
                //清空准备区属性层
                for(let i=1;i<12;i++){
                    hideProperty(i);
                }
                ps = document.getElementsByClassName("stats");
                PSL=ps.length;
                let type = ps[ps.length-1].getElementsByClassName("property")[0].innerHTML;
                let e = ES[type];
                //console.log(type+":"+e);
                if(e){
                    if(e==910){
                        showProperty(9);
                        showProperty(10);
                    }else{
                        showProperty(e);
                    }
                }else{
                    showProperty(1);
                    showProperty(2);
                }
            }else if(ps.length<PSL){
                //console.log("clr");
                PSL=0;
                //清空准备区属性层
                for(let i=1;i<12;i++){
                    hideProperty(i);
                }
            }
        }
    },100);*/



    function showProperty(i){
        let em = document.querySelector("#rc-tabs-0-panel-0 > div.group-pane > div:nth-child("+i+") > div.equipment-container");
        if(em){
            em.dispatchEvent(new Event("mouseenter"));
        }
    }
    function hideProperty(i){
        let em = document.querySelector("#rc-tabs-0-panel-0 > div.group-pane > div:nth-child("+i+") > div.equipment-container");
        if(em){
            em.dispatchEvent(new Event("mouseleave"));
        }
    }
    // 设置id对应显示内容
    function setTxt(id, txt){
        document.getElementById(id).innerText = txt;
    }
    // help
    unsafeWindow.help = function help(){
        let html = "<div id='ixxhelp' style='position: absolute;top: 40px;left: 10px;z-index:99999;background:#222;text-align:left;color:#c1ae85'>";
        html += "工匠石：重置插槽数量<br/>";
        html += "幻色石：随机插槽颜色<br/>";
        html += "链接石：随机连接插槽<br/>";
        html += "脱变石：<span style='color:#aaa'>普通</span>升<span style='color:#88f'>魔法</span>装备<br/>";
        html += "机会石：<span style='color:#aaa'>普通</span>随机升<span style='color:#88f'>魔法</span>、<span style='color:#ff7'>稀有</span>、<span style='color:orange'>传奇</span><br/>";
        html += "点金石：<span style='color:#aaa'>普通</span>升<span style='color:#ff7'>稀有</span>装备<br/>";
        html += "增幅石：为<span style='color:#88f'>魔法</span>装备添加词条<br/>";
        html += "改造石：重置<span style='color:#88f'>魔法</span>装备词条<br/>";
        html += "重铸石：还原为<span style='color:#aaa'>普通</span><br/>";
        html += "富豪石：<span style='color:#88f'>魔法</span>升<span style='color:#ff7'>稀有</span><br/>";
        html += "混沌石：重置<span style='color:#ff7'>稀有</span>物品词条<br/>";
        html += "崇高石：<span style='color:#ff6'>稀有</span>装备添加词条<br/>";
        html += "神圣石：重铸装备上词条数值<br/>";
        html += "神圣石：重铸装备上词条数值<br/>";
        html += "<button onclick='closeHelp();'>关闭</button></div>";
        let p = document.createElement("div");
        p.innerHTML = html;
        byId("app").appendChild(p);
    }
    unsafeWindow.closeHelp = function closeHelp(){
        byId("ixxhelp").remove();
    }

    function delay(time){
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, time);
    });
}

  function addSound(duration, frequency, volume, type, callback) {
    let oscillator = audioCtx.createOscillator();
    let gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    if (volume) {
        gainNode.gain.value = volume;
    }

    if (frequency) {
        oscillator.frequency.value = frequency;
    }else{
      oscillator.frequency.value = 800;
    }

    if (type) {
        oscillator.type = type;
    }

    if (callback) {
        oscillator.onended = callback;
    }

    oscillator.start(audioCtx.currentTime);
    oscillator.stop(audioCtx.currentTime + ((duration || 50) / 1000));
}


function show(){
    let parts = [];
    let tta = document.getElementsByClassName("container")[1];
    let ta = tta.getElementsByClassName("stats")[0];
    if(ta.getElementsByClassName("magics").length > 0){
      for(let i = 0 ;i < ta.getElementsByClassName("magics").length;i++){
        parts.push(ta.getElementsByClassName("magics")[i].innerText)
      }
    console.log(parts.join("\n"));
    }
}
    // roll属性
    async function tryRoll_chaos(){
        let attrKeyword = getVal("rolltxt");
        let bre = false;
//        let affixKeyword = getVal("rollname");

        // 判断名字和属性是否都为空为空则停止
        if(!attrKeyword){
            stopRoll_chaos();
        }
        //尝试改造
        if(Chaos_STATUS){
            //获取装备词缀名

              if(byId('dasInput').checked){
                if(isMatched_das()){
                  console.log("伤害够用了");
              addSound();
              show();
              bre = true;
             stopRoll_chaos();
                }
              }

              if(!bre){
            if(isMatched_chaos()){




            if(byId('T1Input2').checked){

            if(isMatched_T1_chaos()){
              //
              //
                if(byId('EEEbutton').checked){
                useExalted();
                await delay(1000);
                useExalted();
                await delay(1000);
                useExalted();
                await delay(200);
                show();
                if(isMatched_EEE()){
                  console.log("我丢！！！镜子？？？");
              addSound();
             stopRoll_chaos();
                }
                else{
                  console.log("EEE重铸");
                  useScouring();
            await safeUse();
                          //用点金石
            useAlchemy();
            await delay(checkInterval);
                  rollIt_Chaos();
                }
              }else{
              //
              //
             console.log("我丢，终于出了");
              addSound();
              show();
             stopRoll_chaos();}
            }else{
            console.log("出4条都不满足啊？");
            await delay(checkInterval);
                rollIt_Chaos();
            }

            }
              else{
                //
                //
                if(byId('EEEbutton').checked){
                useExalted();
                await delay(1000);
                useExalted();
                await delay(1000);
                useExalted();
                await delay(200);
                show();
                if(isMatched_EEE()){
                  console.log("我丢！！！镜子？？？");
              addSound();
             stopRoll_chaos();
                }
                else{
                  console.log("EEE重铸");
                  useScouring();
            await safeUse();
                          //用点金石
            useAlchemy();
            await delay(checkInterval);
                  rollIt_Chaos();
                }
              }else{
                //
                //
                console.log("我丢，终于出了");
                addSound();
                show();
                stopRoll_chaos();}
                }

            }else{
                rollIt_Chaos();
            }}
        }
      else{
                       stopRoll_chaos();
      }
    }

    function stopRoll_chaos(){
        //停止roll
        Chaos_STATUS = false
    //  checkInterval = 150;
    //  checkIlvl = 3;
        buttonNameAutoChange();
    }

    async function rollIt_Chaos(){
        //使用混沌石
      let tta = document.getElementsByClassName("container")[1];
      if(Chaos_STATUS != false){
        useChaos();
      //console.log("混沌");
        await safeUse();
      }else{
      if(tta.getElementsByClassName("equipment normal").length > 0 && Chaos_STATUS1){
            useAlchemy();
        await safeUse();
        Chaos_STATUS = !Chaos_STATUS
          }else{
            stopRoll_chaos();
          }
        }

        //准备混沌石
        tryRoll_chaos();
    }


     function isMatched_chaos(){
       let tta = document.getElementsByClassName("container")[1];
       if(tta.getElementsByClassName("stats").length > 0)
          {
        let ta = tta.getElementsByClassName("stats")[0].innerText;;
        let matchedText = [];
		    let matchedTextList = [];
            //搜索装备词缀名
        let checkFixNumber = getVal("checkFixNumber");
        let rotxt = getVal("rolltxt");
        let rotxtList = rotxt.split("|")

       for(let fixListNumber = 0 ; fixListNumber < rotxtList.length; fixListNumber++){
        for(let i = 0 , l = 0 , attrKeywordArray = rotxtList[fixListNumber].split(",") ; i < attrKeywordArray.length ; i++){
           let keyword = attrKeywordArray[i];
           let index = ta.indexOf(keyword);
           if(index >= 0){
             if(keyword =="导师的" && index > 0 && ta.substring(index - 1, index + keyword.length) == "魔" + keyword){
              // console.log("又是魔导师");
             }else{
             matchedTextList = ta.split("\n")
				    for(let ii = 0; ii < matchedTextList.length; ii++){
					  if(matchedTextList[ii] == attrKeywordArray[i])
						matchedText.push(ii);
				}
                l++;}
              if( l >= checkFixNumber){
                //orderListText(matchedText);
                return true;
              }
            }
        }}
    }}

          function isMatched_T1_chaos(){
            let tta = document.getElementsByClassName("container")[1];
            if(tta.getElementsByClassName("stats").length > 0)
          {
        let ta = tta.getElementsByClassName("stats")[0].innerText;
            //搜索装备词缀名
        let checkFixNumber = getVal("checkFixNumber1");
        let rotxt = getVal("T1txt2");
        for(let i = 0 , l = 0, attrKeywordArray = rotxt.split(",") ; i < attrKeywordArray.length ; i++){
           let keyword = attrKeywordArray[i];
           let index = ta.indexOf(keyword);
           if(index >= 0){
             l++;}
           if( l >= checkFixNumber){
                return true;}
        }
    }}



    async function safeUse(){
      if(byId('autofaz').checked){
        await delay(checkInterval);
      }else{
        await delay(checkInterval/2);
        let tta = document.getElementsByClassName("container")[1];
        //let names = tta.getElementsByClassName("title-bar")[0].innerText;
        let equipmentName = tta.getElementsByClassName("title-bar")[0].innerText;
        let ta = tta.getElementsByClassName("stats")[0].innerText;
        let equipmentDetail = ta.substr(ta.lastIndexOf("物品等级"));
        //卡顿, 装备无变化时等待

        if (lastName === equipmentName && lastDetail === equipmentDetail){
        //if (lastName === equipmentName && lastDetail === equipmentDetail){
          for(let i = 0 , l = 0 ; i < 20 ; i++){
        await delay(50);
        //names = byClass("title-bar");
        equipmentName = tta.getElementsByClassName("title-bar")[0].innerText;
        ta = tta.getElementsByClassName("stats")[0].innerText;
        equipmentDetail = ta.substr(ta.lastIndexOf("物品等级"));
          if (lastName != equipmentName || lastDetail != equipmentDetail){
                await delay(checkInterval);
                //names = byClass("title-bar");
                equipmentName = tta.getElementsByClassName("title-bar")[0].innerText;
                ta = tta.getElementsByClassName("stats")[0].innerText;
                equipmentDetail = ta.substr(ta.lastIndexOf("物品等级"));
                i = 20;
            }else{
              l++;
            }
          if(l >= 20){
                console.log(lastName + "<>"+equipmentName)
                console.log("等待改造/机会结果超时，重新执行");
                //自动改变 按钮状态
                //if(LINK_STATUS){LINK_STATUS1 = false;}
                if(Chaos_STATUS){Chaos_STATUS = false;}// 自动混沌启用状态
                if(Alc_STATUS){Alc_STATUS = false;}// 自动点金启用状态
                if(Alt_STATUS){Alt_STATUS = false;}// 完美改造启用状态
                if(Alt2_STATUS){Alt2_STATUS = false;}// 自动改造启用状态
          }



/*            if (lastName === equipmentName && lastDetail === equipmentDetail){
                console.log("等待改造/机会结果超时");
                //自动改变 按钮状态
                LINK_STATUS = false;
                stopRoll_chaos();
                stopRoll_Alc();
                stopRoll_Alt();
                stopRoll_Alt2();
            }else
            {
                await delay(checkInterval);
                names = byClass("title-bar");
                equipmentName = names[names.length-1].innerText;
                ta = document.getElementsByClassName("stats")[0].innerText;
                equipmentDetail = ta.substr(ta.lastIndexOf("需求"));
            }*/
            }
        }else{
        await delay(checkInterval/2);
        lastName = equipmentName;
        lastDetail = equipmentDetail;
       ;
       }
    }}



    function sleep(duration) {
        return new Promise(resolve => {
            setTimeout(resolve, duration);
        })
    }

 console.log(lastDetail)

    function buttonNameAutoChange(){

      localStorage.setItem("Loot_STATUS",Loot_STATUS);
      localStorage.setItem("checkIlvl",checkIlvl);
      lastDetail = [];
      lastName = "";
//      Loot_STATUS?'上架任意通货即可替换成存款':

      if(Loot_STATUS){
            setTxt("slaveButton","获取成功！");
        }else {
            setTxt("slaveButton","获取存款");
        }

        if(Chaos_STATUS){
            setTxt("rollbtn","停止混沌");
        }else {
            setTxt("rollbtn","自动混沌");
        }

        if(Alc_STATUS){
            setTxt("rollbtn2","停止点金");
        }else {
            setTxt("rollbtn2","自动点金");
        }

         if(Alt_STATUS){
            setTxt("rollbtn3","停止改造");
        }else {
            setTxt("rollbtn3","完美改造");
        }

        if (Alt2_STATUS){
            setTxt("chancebtn","停止改造");
        }else {
            setTxt("chancebtn","自动改造");
        }

        if (LINK_STATUS){
            setTxt("linkbtn","停止链接");
        }else {
            setTxt("linkbtn","自动链接");
        }

        if (Chrom_STATUS){
            setTxt("colorButton","停止洗色");
        }else {
            setTxt("colorButton","自动洗色");
        }


        /*if(checkIlvl != 1){
            checkInterval = 150;
            setTxt("burstbtn","加速");
            checkIlvl = 1;
        }*/

    }


  	/*function //orderListText(matchedText){

let tta = document.getElementsByClassName("container")[1];
let affixesList = tta.getElementsByClassName("stats");

			clearHistoryStyle();
			for(let i=0;i<matchedText.length;i++) {
				if(affixesList.length>0){

					affixesList[0].children[matchedText[i]].style.border = 'solid 2px'
					affixesList[0].children[matchedText[i]].style.borderImage = 'linear-gradient(to right, #8f41e9, #578aef) 1'
				}
			}
			affixesList[0].style.width = '70px'
			for(let j=0;j<affixesList[0].children.length;j++){
				affixesList[0].children[j].style.width = '70px'
			}
	}*/

	function	clearHistoryStyle(){
let tta = document.getElementsByClassName("container")[1];
let affixesList = tta.getElementsByClassName("stats");
		for(let a=0;a<affixesList[0].children.length;a++){
			affixesList[0].children[a].style.border = ''
			affixesList[0].children[a].style.borderImage = ''
		}
	}


//document.getElementsByClassName("editor")[0].getElementsByTagName("button")[0];
    //使用幻色石
  //出售
    unsafeWindow.sell = function sell(){
        (document.getElementsByClassName("editor")[0].getElementsByTagName("button")[0]).dispatchEvent(new Event("click"));
        }

    unsafeWindow.useChromatic = function useChromatic(){
        (document.getElementsByClassName("actions")[0].getElementsByTagName("button")[3]).dispatchEvent(new Event("click"));
        }
    //使用蜕变石
    unsafeWindow.useTransmutation = function useTransmutation(){
        (document.getElementsByClassName("actions")[0].getElementsByTagName("button")[5]).dispatchEvent(new Event("click"));
    };
    //使用改造石
    unsafeWindow.useAlteration = function useAlteration(){
        (document.getElementsByClassName("actions")[0].getElementsByTagName("button")[9]).dispatchEvent(new Event("click"));
    }
    //使用增幅石
    unsafeWindow.useAugmentation = function useAugmentation(){
        (document.getElementsByClassName("actions")[0].getElementsByTagName("button")[8]).dispatchEvent(new Event("click"));
    }
    //使用机会石
    unsafeWindow.useChance = function useChance(){
        (document.getElementsByClassName("actions")[0].getElementsByTagName("button")[6]).dispatchEvent(new Event("click"));
    }
    //使用重铸石
    unsafeWindow.useScouring = function useScouring(){
        (document.getElementsByClassName("actions")[0].getElementsByTagName("button")[10]).dispatchEvent(new Event("click"));
    }
    //使用链接石
    unsafeWindow.useFusing = function useFusing(){
        (document.getElementsByClassName("actions")[0].getElementsByTagName("button")[4]).dispatchEvent(new Event("click"));
    }
    //使用混沌石
    unsafeWindow.useChaos = function useChaos(){
        (document.getElementsByClassName("actions")[0].getElementsByTagName("button")[13]).dispatchEvent(new Event("click"));
    }
    //使用崇高石
      unsafeWindow.useExalted = function useExalted(){
        (document.getElementsByClassName("actions")[0].getElementsByTagName("button")[14]).dispatchEvent(new Event("click"));
    }
    //使用点金石
    unsafeWindow.useAlchemy = function useAlchemy(){
        (document.getElementsByClassName("actions")[0].getElementsByTagName("button")[7]).dispatchEvent(new Event("click"));
    }
    //使用富豪
      unsafeWindow.useRegal = function useRegal(){
        (document.getElementsByClassName("actions")[0].getElementsByTagName("button")[11]).dispatchEvent(new Event("click"));
    }

    //把每次确认关闭
    unsafeWindow.noConfirm = function noConfirm(){
        let confirmButton = document.getElementsByClassName("ant-switch css-1x7fa7i")[ document.getElementsByClassName("ant-switch css-1x7fa7i").length - 1];
        if(confirmButton.className.includes("checked")){
            confirmButton.dispatchEvent(new Event("click"));
        }
    }

 //       unsafeWindow.xuanze = function xuanze(){
          //ant-select-selector
  //      (document.getElementsByClassName("editor")[0]).document.getElementsByClassName("ant-select")[0].dispatchEvent(new Event("click"));
     //     .dispatchEvent(new Event("click"));
 //        }

        unsafeWindow.tianjia = function tianjia(){
        (document.getElementsByClassName("editor")[0].getElementsByTagName("button")[0]).dispatchEvent(new Event("click"));
    }

function stopRoll_Alt(){
        //停止roll
        Alt_STATUS = false;
        lastName = "";
     // checkInterval = 150;
    //  checkIlvl = 3;
        //checkFixNumberInput.readOnly  = false;
        //checkFixNumberInput.value = 3;
      //  clearTimeout(LAST_SETTIME_ID3);
        buttonNameAutoChange();
    }


          function stopRoll_Alt2(){
        //停止roll
        Alt2_STATUS = false;
        lastName = "";

        buttonNameAutoChange();
    }

         async function rollIt_Alt2(){
           let tta = document.getElementsByClassName("container")[1];
         //使用改造石
           if(Alt2_STATUS != false){
        useAlteration();
        await safeUse();}else{
          if(tta.getElementsByClassName("equipment normal").length > 0 && Alt2_STATUS1){
            useTransmutation();
            await safeUse();
            Alt2_STATUS = !Alt2_STATUS
          }else{
            stopRoll_Alt2();
          }
        }
         //准备改造石
        tryRoll_Alt2();
    }

        async function tryRoll_Alt2(){
        let attrKeyword4 = getVal("rolltxt");

        // 判断名字和属性是否都为空为空则停止
        if(!attrKeyword4){
            stopRoll_Alt2();
        }
        //尝试普通改造
        if(Alt2_STATUS){
          let tta = document.getElementsByClassName("container")[1];
          //console.log(tta)
          let ta = tta.getElementsByClassName("stats")[0].innerText;
          if(ta.indexOf("的") < 0 || ta.indexOf("之")< 0){

            //console.log(ta)
            useAugmentation();
        await safeUse();}
            //获取装备词缀名
            if(isMatched_Alt()){
               console.log("出了一条");
        await delay(checkInterval);
              show();
        if(byId('autoRegal').checked){
        useRegal();
       await safeUse();
          show();
        if(isMatched_Alt2()){

          if(byId('T1Input2').checked){

            if(isMatched_T1_chaos()){
             console.log("我丢，终于出了");
              addSound();
              show();
             stopRoll_Alt2();;
            }else{
            useScouring();
if(tta.getElementsByClassName("affix locked").length == 0){
            await safeUse();
        //用蜕变石
            useTransmutation();}
          await delay(100);
              //重铸+蜕变
        tryRoll_Alt2();
            }

            }
              else{
          show();
        console.log("我丢，双词出了")
                addSound();
        stopRoll_Alt2();
        }
        }
          else{

//检测是否勾选保留词缀
            if(byId('T1Input').checked){
              //勾选了保留
              //检测是否匹配保留词缀
              if(isMatched_T1()){
                //匹配保留
                console.log("保留特定词")
                addSound();
            stopRoll_Alt2();
                //停下
            }
            else
              //没匹配保留
            {
            console.log("没出，重铸吧");
            useScouring();
              if(tta.getElementsByClassName("affix locked").length == 0){
            await safeUse();
        //用蜕变石
            useTransmutation();}
          await delay(100);
              //重铸+蜕变
        tryRoll_Alt2();
            }

        }
            else{

       console.log("没出，重铸吧");

        useScouring();
              if(tta.getElementsByClassName("affix locked").length == 0){
       await safeUse();
//        await delay(checkInterval);
        //用蜕变石
        useTransmutation();}
         await delay(100);
        tryRoll_Alt2();}
        }
        }
        else{
          addSound();
          stopRoll_Alt2();

        }
              }
              else{
                rollIt_Alt2();
            }
        }
          else{
          stopRoll_Alt2();
        }
    }


    function autoLink(){
        if(LINK_STATUS){
            setTimeout(() => {LinkAllCheck();useFusing();autoLink()},70);
        }else {
            buttonNameAutoChange();
        }
    }

    function LinkAllCheck(){
        let tta = document.getElementsByClassName("container")[1];
        let groupNumber = tta.getElementsByClassName("stats")[0].getElementsByClassName("socket-group").length;
        if (groupNumber === 1){
            LINK_STATUS = false;
        }
    }

  function autolevelup(){
    if(swBut){
    // 定时器，用于每隔一定时间点击一次升级按钮
    let clickTimersj = setInterval(function() {
        // 查找升级按钮，可以根据实际页面的 HTML 结构进行修改
        let upgradeButton = Array.from(document.querySelectorAll('button span')).find(button => button.textContent === '升级')
        // 如果找到升级按钮，则模拟点击
        if (upgradeButton ){
            upgradeButton.click();
          //console.log(swBut)
        }
      if(!swBut){
        clearInterval(clickTimersj)
      }
    }, 30);
      }
}






      async function tryRoll_Alc(){
        let attrKeyword2 = getVal("rolltxt");
        let bre = false ;
//        let affixKeyword = getVal("rollname");

        // 判断名字和属性是否都为空为空则停止
        if(!attrKeyword2){
            stopRoll_Alc();
        }
        //尝试重铸点金
        if(Alc_STATUS){
            //获取装备词缀名

              if(byId('dasInput').checked){
                if(isMatched_das()){
                  console.log("伤害够用了");
              addSound();
              show();
              bre = true;
             stopRoll_Alc();
                }
              }

             if(!bre){
            if(isMatched_Alc()){
            if(byId('T1Input2').checked){
            if(isMatched_T1_chaos()){
              //
              //
              if(byId('EEEbutton').checked){
                useExalted();
                await delay(1000);
                useExalted();
                await delay(1000);
                useExalted();
                await delay(200);
                show();
                if(isMatched_EEE()){
                  console.log("我丢！！！镜子？？？");
              addSound();
             stopRoll_Alc();
                }
                else{
                  console.log("EEE重铸");
                  useScouring();
                  await delay(checkInterval);
            await safeUse();
                          //用点金石
            useAlchemy();
            await delay(checkInterval);
                  rollIt_Alc();
                }
              }else{
              //
              //
            console.log("我丢，终于出了");
              addSound();
              show();
             stopRoll_Alc();
            }}
            else{
            console.log("出4条都不满足啊？");
              show();
              useScouring();
              await delay(checkInterval);
              await safeUse();
                rollIt_Alc();
            }
            }
            else{
              //
              //
              if(byId('EEEbutton').checked){
                useExalted();
                await delay(1000);
                useExalted();
                await delay(1000);
                useExalted();
                await delay(200);
                show();
                if(isMatched_EEE()){
                  console.log("我丢！！！镜子？？？");
              addSound();
             stopRoll_Alc();
                }
                else{
                  console.log("EEE重铸");
                  useScouring();
                  await delay(checkInterval);
            await safeUse();
                          //用点金石
            useAlchemy();
            await delay(checkInterval);
                  rollIt_Alc();
                }
              }else{
              //
              //
                console.log("我丢，终于出了");
              addSound();
              show();
               stopRoll_Alc();
              }
            }
            }
            else{
                useScouring();
              await delay(checkInterval);
              await safeUse();
              console.log("没出");
                rollIt_Alc();
            }}
        }
        else{
               stopRoll_Alc();
        }
    }

        function stopRoll_Alc(){
        //停止roll
        Alc_STATUS = false;
        lastName = "";
     // checkInterval = 150;
     // checkIlvl = 3;
      //  clearTimeout(LAST_SETTIME_ID2);
        buttonNameAutoChange();
    }


  //      async function doIt(){
       async function rollIt_Alc(){
          let tta = document.getElementsByClassName("container")[1];
        //使用重铸石
//        useScouring();
//        await delay(100);
      if(Alc_STATUS != false){
         //使用点金石
        useAlchemy();
        await delay(checkInterval);
          await safeUse();}else{
            if(tta.getElementsByClassName("equipment normal").length > 0 && Alc_STATUS1){
              useAlchemy();
              await delay(checkInterval);
        await safeUse();
        Alc_STATUS = !Alc_STATUS
            }else{
              stopRoll_Alc();
            }
          }
         //准备点金石
        tryRoll_Alc();
    }

      async function tryRoll_Alt(){
        let attrKeyword3 = getVal("rolltxt");
//        let attrKeyword4 = getVal("rolltxt");


//        let affixKeyword = getVal("rollname");

        // 判断名字和属性是否都为空为空则停止
        if(!attrKeyword3){
            stopRoll_Alt();
        }


        //尝试完美改造
        if(Alt_STATUS){
           let tta = document.getElementsByClassName("container")[1];


            //获取装备词缀名
             if(isMatched_Alt()){
             let ta = tta.getElementsByClassName("stats")[0].innerText;
             if(ta.indexOf("的") < 0 || ta.indexOf("之")< 0){
             useAugmentation();
             await safeUse();
             }
               //show();

              //检测是否匹配2条
              if(isMatched_Alt2()){
                //匹配2条
               console.log("出了两！");
                show();
                //是否勾选富豪
        if(byId('autoRegal').checked){
          //勾选了
          useRegal();
          await safeUse();
                show();
          //检测是否匹配3条词缀
        if(isMatched_Reg()){


            if(byId('T1Input2').checked){

            if(isMatched_T1_chaos()){
              //
              //
              if(byId('EEEbutton').checked){
                useExalted();
                await delay(1000);
                useExalted();
                await delay(1000);
                useExalted();
                await delay(200);
                show();
                if(isMatched_EEE()){
                  console.log("我丢！！！镜子？？？");
              addSound();
             stopRoll_Alt();
                }
                else{
                  console.log("EEE重铸");
                  useScouring();
                  if(tta.getElementsByClassName("affix locked").length == 0){
            await safeUse();
                          //用蜕变石
            useTransmutation();}
            await delay(checkInterval);
                  rollIt_Alt();
                }
              }else{
              //
              //
                //匹配3条+保底词
                show();
             console.log("我丢，终于出了");
              addSound();
             stopRoll_Alt();}
            }else{
                    useScouring();
              if(tta.getElementsByClassName("affix locked").length == 0){
            await safeUse();
                          //用蜕变石
            useTransmutation();}
            await delay(checkInterval);
                rollIt_Alt();
            }

            }else{
              //
              //
              if(byId('EEEbutton').checked){
                if(isMatched_EEE()){
                  console.log("我丢！！！镜子？？？");
                  show();
              addSound();
             stopRoll_Alt();
                }
                else{
                useExalted();
                await delay(1000);
                if(isMatched_EEE()){
                  console.log("我丢！！！镜子？？？");
                  show();
              addSound();
             stopRoll_Alt();
                }
                else{
                useExalted();
                await delay(1000);
                if(isMatched_EEE()){
                  console.log("我丢！！！镜子？？？");
                  show();
              addSound();
             stopRoll_Alt();
                }
                else{
                useExalted();
                await delay(200);
                show();
                if(isMatched_EEE()){
                  console.log("我丢！！！镜子？？？");
              addSound();
              show();
             stopRoll_Alt();
                }
                else{
                  console.log("EEE重铸");
                  useScouring();
                  if(tta.getElementsByClassName("affix locked").length == 0){
                  await safeUse();
                          //用蜕变石
            useTransmutation();}
            await delay(checkInterval);
                  rollIt_Alt();
                }}}}
              }else{
              //
              //
          //匹配3条
        console.log("我丢，出3条了")
          addSound();
        stopRoll_Alt();}}
          //停下
        }
        else
          //不匹配3条
        {
          //判断是否勾选保留词缀
            if(byId('T1Input').checked){
              //勾选了保留
              //检测是否匹配保留词缀
              if(isMatched_T1()){
                //匹配保留
            Alt_STATUS = false;
            buttonNameAutoChange();
                //停下
            }
            else
              //没匹配保留
            {
            console.log("没出，重铸吧");
            useScouring();
              if(tta.getElementsByClassName("affix locked").length == 0){
            await safeUse();
        //用蜕变石
            useTransmutation();}
            await delay(checkInterval);

              //重铸+蜕变
        tryRoll_Alt();

            }

        }
          //没勾选
          else{
            console.log("没出，重铸吧");
            useScouring();
            if(tta.getElementsByClassName("affix locked").length == 0){
            await safeUse();
        //用蜕变石
            useTransmutation();}
            //console.log(".")
            await delay(checkInterval);
//            await delay(checkInterval);

              //重铸+蜕变
        tryRoll_Alt();
        }
               //自动改变 自动混沌/停止混沌 按钮状态
              }
              }
              else{
                addSound();
               stopRoll_Alt();

              }
              }
          else{
//               console.log("没出两条");

                rollIt_Alt();
               }

            }
            else{
                console.log("没出");
                rollIt_Alt();
            }
        }
        else{
             stopRoll_Alt();
        }

    }



    async function rollIt_Alt(){
      let tta = document.getElementsByClassName("container")[1];
         //使用改造石
      if(Alt_STATUS != false){
        useAlteration();
        //delay(checkInterval)
        await safeUse();
      }else{
          if(tta.getElementsByClassName("equipment normal").length > 0 && Alt_STATUS1){
            useTransmutation();
            //delay(checkInterval)
            await safeUse();
            Alt_STATUS = !Alt_STATUS
          }else{
            stopRoll_Alt();
          }
        }
         //准备改造石
        tryRoll_Alt();
    }

      function isMatched_Alc(){
        let tta = document.getElementsByClassName("container")[1];
        if(tta.getElementsByClassName("stats").length > 0)
          {
        let ta = tta.getElementsByClassName("stats")[0].innerText;
            //搜索装备词缀名
		    let matchedText = [];
		    let matchedTextList = [];
        let checkFixNumber = getVal("checkFixNumber");
        let rotxt = getVal("rolltxt");
        let rotxtList = rotxt.split("|")
        for(let fixListNumber = 0 ; fixListNumber < rotxtList.length; fixListNumber++){
        for(let i = 0 , l = 0 , attrKeywordArray = rotxtList[fixListNumber].split(",") ; i < attrKeywordArray.length ; i++){
           let keyword = attrKeywordArray[i];
           let index = ta.indexOf(keyword);

           if(index >= 0){
            if(keyword =="导师的" && index > 0 && ta.substring(index - 1, index + keyword.length) == "魔" + keyword){
             }else{
				    matchedTextList = ta.split("\n")
				    for(let ii = 0; ii < matchedTextList.length; ii++){
					  if(matchedTextList[ii] == attrKeywordArray[i])
						matchedText.push(ii);
				}
                l++;

             }
              if( l >= checkFixNumber ){
                //orderListText(matchedText);
                return true;
              }
            }

        }}
    }
    }




        function isMatched_Alt(){
          let tta = document.getElementsByClassName("container")[1];
          if(tta.getElementsByClassName("stats").length > 0)
          {
            let ta = tta.getElementsByClassName("stats")[0].innerText;
            //搜索装备词缀名
		    let matchedText = [];
		    let matchedTextList = [];
        let rotxt = getVal("rolltxt");
        let rotxtList = rotxt.split("|") //多份需匹配词缀

          for(let fixListNumber = 0 ; fixListNumber < rotxtList.length; fixListNumber++){
        for(let i = 0 ,  attrKeywordArray = rotxtList[fixListNumber].split(",") ; i < attrKeywordArray.length ; i++){
           let keyword = attrKeywordArray[i];
           let index = ta.indexOf(keyword);
           let ttta = tta.getElementsByClassName("stats")[0].innerText
           if(index >= 0){
             if(keyword =="导师的" && index > 0 && ta.substring(index - 1, index + keyword.length) == "魔" + keyword){
             }
               else if(ttta.indexOf("攻击附加") >=0 && ttta.indexOf("法杖") >=0){
             }
             else{
            matchedTextList = ta.split("\n");
				    for(let ii = 0; ii < matchedTextList.length; ii++){
					  if(matchedTextList[ii] == attrKeywordArray[i])
						matchedText.push(ii);
				};
               	//orderListText(matchedText);
                return true;
            }
        }
                  }}
          }}


        function isMatched_Alt2(){
          let tta = document.getElementsByClassName("container")[1];
          if(tta.getElementsByClassName("stats").length > 0)
          {
            let ta = tta.getElementsByClassName("stats")[0].innerText;;
            //搜索装备词缀名
		    let matchedText = [];
		    let matchedTextList = [];
        let rotxt = getVal("rolltxt");
        let rotxtList = rotxt.split("|") //多份需匹配词缀

          for(let fixListNumber = 0 ; fixListNumber < rotxtList.length; fixListNumber++){
        for(let i = 0, l = 0 , attrKeywordArray = rotxtList[fixListNumber].split(",") ; i < attrKeywordArray.length ; i++){
           let keyword = attrKeywordArray[i];
           let index = ta.indexOf(keyword);
           let ttta = tta.getElementsByClassName("stats")[0].innerText
           if(index >= 0){
             if(keyword =="导师的" && index > 0 && ta.substring(index - 1, index + keyword.length) == "魔" + keyword){
               l = l;
             }
             else if(ttta.indexOf("攻击附加") >=0 && ttta.indexOf("法杖") >=0){
                 l = l;
             }
             else{

				    matchedTextList = ta.split("\n")
				    for(let ii = 0; ii < matchedTextList.length; ii++){
					  if(matchedTextList[ii] == attrKeywordArray[i])
						matchedText.push(ii);
				}

                l++;
             }
              if( l >= 2 ){
                //orderListText(matchedText);
                return true;
              }
            }
        }}
    }}

            function isMatched_Reg(){
              let tta = document.getElementsByClassName("container")[1];
              if(tta.getElementsByClassName("stats").length > 0)
          {
            let ta = tta.getElementsByClassName("stats")[0].innerText;
            //搜索装备词缀名

		    let matchedText = [];
		    let matchedTextList = [];
        let rotxt = getVal("rolltxt");
        let rotxtList = rotxt.split("|") //多份需匹配词缀
              for(let fixListNumber = 0 ; fixListNumber < rotxtList.length; fixListNumber++){
        for(let i = 0 , l = 0 ,  attrKeywordArray = rotxtList[fixListNumber].split(",") ; i < attrKeywordArray.length ; i++){
           let keyword = attrKeywordArray[i];
           let index = ta.indexOf(keyword);
           let ttta = tta.getElementsByClassName("stats")[0].innerText
           if(index >= 0){
             if(keyword =="导师的" && index > 0 && ta.substring(index - 1, index + keyword.length) == "魔" + keyword){
               l = l;
             }else if(ttta.indexOf("攻击附加") >=0 && ttta.indexOf("法杖") >=0){
                 l = l;
             }
             else{
                l++;

				    matchedTextList = ta.split("\n")
				    for(let ii = 0; ii < matchedTextList.length; ii++){
					  if(matchedTextList[ii] == attrKeywordArray[i])
						matchedText.push(ii);
				}

             }
              if( l >= 3 ){
						//orderListText(matchedText);
                return true;
              }
            }
        }}
    }}

  //保留词缀功能废弃
          function isMatched_T1(){
            let tta = document.getElementsByClassName("container")[1];
            if(tta.getElementsByClassName("stats").length > 0)
          {
        let ta = tta.getElementsByClassName("stats")[0].innerText;
            //搜索装备词缀名
        let rotxt = getVal("T1txt");

        for(let i = 0 , attrKeywordArray = rotxt.split(",") ; i < attrKeywordArray.length ; i++){
           let keyword = attrKeywordArray[i];
           let index = ta.indexOf(keyword);
           if(index >= 0){
                return true;

        }
                  }
    }}

  //EEE
function isMatched_EEE(){
  let tta = document.getElementsByClassName("container")[1];
        if(tta.getElementsByClassName("stats").length > 0)
          {
        let ta = tta.getElementsByClassName("stats")[0].innerText;
            //搜索装备词缀名
		    let matchedText = [];
		    let matchedTextList = [];
        let checkFixNumber = getVal("EEEInput");
        let rotxt = getVal("rolltxt");
        let rotxtList = rotxt.split("|")
        for(let fixListNumber = 0 ; fixListNumber < rotxtList.length; fixListNumber++){
        for(let i = 0 , l = 0 , attrKeywordArray = rotxtList[fixListNumber].split(",") ; i < attrKeywordArray.length ; i++){
           let keyword = attrKeywordArray[i];
           let index = ta.indexOf(keyword);
           if(index >= 0){
				    matchedTextList = ta.split("\n")
				    for(let ii = 0; ii < matchedTextList.length; ii++){
					  if(matchedTextList[ii] == attrKeywordArray[i])
						matchedText.push(ii);
				}
                l++;
              if( l >= checkFixNumber ){
                //orderListText(matchedText);
                return true;
              }
            }

        }}
    }
    }


  function isMatched_das(){
    let tta = document.getElementsByClassName("container")[1];
        if(tta.getElementsByClassName("stats").length > 0)
          {
        let a = tta.getElementsByClassName("stats")[0];
            //搜索装备词缀名
        let ta = a.getElementsByClassName("property")[3].innerText;
            if(ta.indexOf("物理伤害") < 0){
              ta = a.getElementsByClassName("property")[2].innerText
            }
        let rotxt = getVal("shanghai");
        let das = ta.split("-");
            if(parseInt(das[1]) >= parseInt(rotxt)){
              console.log("大伤：" + das[1]);
              return true;
            }
    }
    }



/*    function checkAll(rolltxt, t){
        let rolltxts = rolltxt.split(",");
        for(let i=0;i<rolltxts.length;i++){
            if(rolltxts[i] && t.indexOf(rolltxts[i])>=0){
                return 0;
            }
        }
        return 1;
    }*/
    //unsafeWindow.roll = function roll(){
    //    if(Chaos_STATUS){
    //       click(byClass("actions")[0].getElementsByTagName("button")[12]);
   //         setTimeout(check, 200);
  //      }
  //  }
    // 搜索本页面装备属性
    unsafeWindow.search = function search(){
        BACKPACK_STATUS = 0;
        BACKPACK_ES = byClass("backpack")[0].querySelectorAll("div.equip-name");
        BACKPACK_KEY = getVal("rolltxt");
        BACKPACK_NAME = getVal("rollname");
        BACKPACK_INDEX = 0;
        nextSearch();
    }
    unsafeWindow.nextSearch = function nextSearch(){
        if(BACKPACK_STATUS){
            return;
        }
        if(BACKPACK_INDEX>0){
            mouseLeave(BACKPACK_ES[BACKPACK_INDEX-1].parentElement);
        }
        if(BACKPACK_INDEX>=BACKPACK_ES.length){
            let np = document.getElementsByClassName("ant-pagination-next")[0];
            if(np.outerHTML.indexOf("aria-disabled=\"false\"")>0){
                np.dispatchEvent(new Event("click"));
                setTimeout(search, 100);
                return;
            } else {
                return;
            }
        }
        mouseEnter(BACKPACK_ES[BACKPACK_INDEX++].parentElement);
        setTimeout(checkSearch, 90);
    }
    unsafeWindow.stopSearch = function stopSearch(){
        BACKPACK_STATUS = 1;
    }
    function checkSearch(){
        let txts = byClass("stats");
        let txtAll = txts[txts.length-1].innerText;
        let names = byClass("title-bar");
        let name = names[names.length-1].innerText;
        let txt = txtAll.substr(txtAll.indexOf("需求"));
        let keys = BACKPACK_KEY.split(",");
        if(!BACKPACK_NAME || name.indexOf(BACKPACK_NAME)<0){
            if(!BACKPACK_KEY){
                setTimeout(nextSearch,100);
                return;
            }
            for(let i=0;i<keys.length;i++){
                if(txt.indexOf(keys[i])<0){
                    setTimeout(nextSearch,100);
                    return;
                }
            }
        }
    }
    // 基础方法
    function byId(id){
        return document.getElementById(id);
    }
    function byClass(cls){
        return document.getElementsByClassName(cls);
    }
    function mouseEnter(dom){
        dom.dispatchEvent(new Event("mouseenter"));
    }
    function mouseLeave(dom){
        dom.dispatchEvent(new Event("mouseleave"));
    }
    function click(dom){
        dom.dispatchEvent(new Event("click"));
    }

    function focus(dom){
        dom.dispatchEvent(new Event("focus"));
    }
    function getVal(id){
        return byId(id).value;
    }
    // init
    function init(){
        console.log("init...");



// 创建一个按钮元素
       var hideScriptButton = document.createElement('button');
        hideScriptButton.id = 'autoDelete';
        hideScriptButton.textContent = '显示脚本';
        hideScriptButton.onclick = function() {
            showScriptFlag = !showScriptFlag
            hideScriptButton.textContent = showScriptFlag?'隐藏脚本':'显示脚本';
          localStorage.setItem("showScriptFlag",showScriptFlag);
            if(!showScriptFlag){
                byId("scriptDiv").style.display = 'none';
//                byId("scriptDiv0").style.display = 'none';
//                byId("scriptDiv1").style.display = 'none';
            }else {
                byId("scriptDiv").style.display = 'block';
//                byId("scriptDiv0").style.display = 'block';
//                byId("scriptDiv1").style.display = 'block';
            }
        }



// 创建有效词缀数量
        var checkFixNumberInput = document.createElement('input');
        checkFixNumberInput.style.width = '32px';
        checkFixNumberInput.id = 'checkFixNumber';
        checkFixNumberInput.value = '3' //3T1，可以收手了
        checkFixNumberInput.type = 'number'
        checkFixNumberInput.max = '6' //欧皇？
        checkFixNumberInput.min = '1'
      	checkFixNumberInput.style.margin = '0 10px 0 0';

      	var checkFixNumberInput1 = document.createElement('input');
        checkFixNumberInput1.style.width = '32px';
        checkFixNumberInput1.id = 'checkFixNumber1';
        checkFixNumberInput1.value = '0' //3T1，可以收手了
        checkFixNumberInput1.type = 'number'
        checkFixNumberInput1.max = '5' //欧皇？
        checkFixNumberInput1.min = '0'
      	checkFixNumberInput1.style.margin = '0 0px 0 0';


// 创建属性关键字输入框
        var rollTxtInput = document.createElement('input');
        rollTxtInput.style.width = '120px';
        rollTxtInput.id = 'rolltxt';
        rollTxtInput.style.margin = '0 10px 0 0';
        rollTxtInput.style.color = 'black'



      //自动富豪按钮
        var regalInput = document.createElement('input');
        regalInput.type = 'checkbox'
        regalInput.name = '自动富豪'
        regalInput.id = 'autoRegal';
		    regalInput.style.margin = '2px 2px 2px 2px';


      //自动崇高
        var EEEInput = document.createElement('input');
        EEEInput.style.width = '32px';
        EEEInput.id = 'EEEInput';
        EEEInput.value = '5' //3T1，可以收手了
        EEEInput.type = 'number'
        EEEInput.max = '6' //欧皇？
        EEEInput.min = '3'
      	EEEInput.style.margin = '0 10px 0 0';

        var EEEbutton = document.createElement('input');
        EEEbutton.type = 'checkbox'
        EEEbutton.name = '自动崇高'
        EEEbutton.id = 'EEEbutton';
		    EEEbutton.style.margin = '2px 2px 2px 2px';


/*        regalInput.addEventListener("change", function() {
        if (this.checked) {
          if(Alt_STATUS){
        //checkFixNumberInput.value = 3;
        //checkFixNumberInput.readOnly  = true;
          }
          if(Alt2_STATUS){
            //checkFixNumberInput.value = 2;
            //checkFixNumberInput.readOnly  = true;
          }

        } else {

          if(Alt_STATUS){
        //checkFixNumberInput.value = 2;
        //checkFixNumberInput.readOnly  = true;
          }
          else{
        //checkFixNumberInput.value = 3;
        //checkFixNumberInput.readOnly  = false;
          }
          if(Alt2_STATUS){
            //checkFixNumberInput.value = 1;
            //checkFixNumberInput.readOnly  = true;
          }else{
            //checkFixNumberInput.value = 3;
            //checkFixNumberInput.readOnly  = false;
          }

         }
        });
*/






      var fazInput = document.createElement('input');
        fazInput.type = 'checkbox'
        fazInput.name = '洗法杖T1T2T3'
        fazInput.id = 'autofaz';
		    fazInput.style.margin = '0 0 0 5px';

      var dasInput = document.createElement('input');
        dasInput.type = 'checkbox'
        dasInput.name = '洗物理大伤'
        dasInput.id = 'dasInput';
		    dasInput.style.margin = '0 0 0 5px';

      var shanghai = document.createElement('input');
        shanghai.style.width = '60px';
        shanghai.id = 'shanghai';
        shanghai.type = 'number'

// 添加复选框的改变事件监听器
        /*fazInput.addEventListener("change", function() {
        if (this.checked) {
        // 如果复选框被选中，将预设的文本输入到输入框中，并设置为只读
        rollTxtInput.value = fazhang;
        rollTxtInput.readOnly = true;
        } else {
        // 如果复选框未被选中，清空输入框并取消只读
        rollTxtInput.readOnly = false;
        rollTxtInput.value = "";
         }
        });*/


        var T1ciInput = document.createElement('input');
        T1ciInput.style.width = '60px';
        T1ciInput.id = 'T1txt';
        T1ciInput.style.display = 'none';


        var T1Input = document.createElement('input');
        T1Input.type = 'checkbox'
        T1Input.name = '保留词缀'
        T1Input.id = 'T1Input';
	    	T1Input.style.margin = '0 0 0 15px';
       T1Input.style.display = 'none';

      T1Input.addEventListener('change', function() {
      if (T1Input.checked) {
        regalInput.checked = true;
      }
      });


        var T1ciInput2 = document.createElement('input');
        T1ciInput2.style.width = '60px';
        T1ciInput2.id = 'T1txt2';

        var T1Input2 = document.createElement('input');
        T1Input2.type = 'checkbox'
        T1Input2.name = '保底词缀'
        T1Input2.id = 'T1Input2';
		    T1Input2.style.margin = '0 0 0 0px';



//      document.body.appendChild(fazInput);
//      document.body.appendChild(rollTxtInput);




// 创建“自动混沌”按钮
        var rollButton = document.createElement('button');
        rollButton.id = 'rollbtn';
        rollButton.textContent = '自动混沌';
        rollButton.style.margin = '2px 2px 2px 0';
        rollButton.onclick = async function() {
            Chaos_STATUS = !Chaos_STATUS;
          Chaos_STATUS1 = !Chaos_STATUS1;
//            PERFECT_ROLL = false;
            //变更按钮状态
            buttonNameAutoChange();
            if (Chaos_STATUS){
                //先关闭确认
                noConfirm();
                //用下点金石
                useAlchemy();
              await safeUse();
                //等待返回结果并判断是否继续roll
                rollIt_Chaos();
            }else{
                //给我停下!
                stopRoll_chaos();
            }
        };

 //创建"自动点金"按钮
        var rollButton2 = document.createElement('button');
        rollButton2.id = 'rollbtn2';
        rollButton2.textContent = '自动点金';
        rollButton2.style.margin = '2px 2px 2px 2px';
        rollButton2.onclick = async function() {
            Alc_STATUS = !Alc_STATUS;
          Alc_STATUS1 = !Alc_STATUS1;
//            PERFECT_ROLL = true;
            //变更按钮状态
            buttonNameAutoChange();
            if (Alc_STATUS){
                //先关闭确认
                noConfirm();
                //用下重铸石
                useScouring();
                await safeUse();
                //等待返回结果并判断是否继续roll
                rollIt_Alc();
            }else{
                //给我停下!
                stopRoll_Alc();
            }
        };

        //创建自动改造按钮
        var rollButton1 = document.createElement('button');
        rollButton1.id = "chancebtn"
        rollButton1.textContent = '普通改造';
        rollButton1.style.margin = '2px 2px 2px 0px';
        rollButton1.onclick = async function() {
          let tta = document.getElementsByClassName("container")[1];
            Alt2_STATUS = !Alt2_STATUS;
          Alt2_STATUS1 = !Alt2_STATUS1;
            buttonNameAutoChange();
            if (Alt2_STATUS){
                //先关闭确认
                noConfirm();
                useScouring();
              if(tta.getElementsByClassName("affix locked").length == 0){
                await safeUse();
                //用下蜕变石
                useTransmutation();}
                //checkFixNumberInput.value = 1;
                //checkFixNumberInput.readOnly  = true;

                //等待返回结果并判断是否继续roll
                rollIt_Alt2();
            }else{
                //给我停下!

                stopRoll_Alt2();
            }
        };

//创建"完美改造"按钮
        var rollButton3 = document.createElement('button');
        rollButton3.id = 'rollbtn3';
        rollButton3.textContent = '完美改造';
        rollButton3.style.margin = '2px 2px 2px 2px';
        rollButton3.onclick = async function() {
          let tta = document.getElementsByClassName("container")[1];
            Alt_STATUS = !Alt_STATUS;
          Alt_STATUS1 = !Alt_STATUS1;
//            PERFECT_ROLL = true;
            //变更按钮状态
            buttonNameAutoChange();
            if (Alt_STATUS){
                //先关闭确认
                noConfirm();
                useScouring();
              if(tta.getElementsByClassName("affix locked").length == 0){
                await safeUse();
                //用下蜕变石
                useTransmutation();}
                //checkFixNumberInput.value = 2;
                //checkFixNumberInput.readOnly  = true;
                //等待返回结果并判断是否继续roll
                LAST_SETTIME_ID3 = setTimeout(() => rollIt_Alt(),checkInterval);
            }else{
                //给我停下!
                stopRoll_Alt();
            }
        };



        //创建自动链接按钮
        var linkButton = document.createElement('button');
        linkButton.textContent = '自动链接';
        linkButton.id = "linkbtn"
        linkButton.style.margin = '0px 0px 0px 0px';

        linkButton.onclick = function() {
            LINK_STATUS = !LINK_STATUS;
            buttonNameAutoChange();
            if (LINK_STATUS){
                noConfirm();
                autoLink();
            }
        };


      // 等待改造/机会结果的检查间隔 单位为毫秒, 太低会卡死, 建议50+
    //var checkInterval = 250;
    //var checkIlvl = 1;
      //setTxt("burstbtn","一档");




        var burstButton = document.createElement('button');
        burstButton.textContent = '加速';
        burstButton.id = "burstbtn"
        burstButton.onclick = function() {
          if(checkIlvl == 1){
            checkInterval = 100;
            setTxt("burstbtn","150ms");
            checkIlvl = checkIlvl + 1;}else{
//2+200
          if(checkIlvl == 2){
            checkInterval = 80;
            setTxt("burstbtn","100ms");
            checkIlvl =  checkIlvl + 1;}else{
//3+150
          if(checkIlvl == 3){
            checkInterval = 50;
            setTxt("burstbtn","80ms");
            checkIlvl = checkIlvl + 1;}else{
//4+100
          if(checkIlvl >= 4){
            checkInterval = 150;
            setTxt("burstbtn","200ms");
            checkIlvl = 1;};
        }}}
          }



        var audioButton = document.createElement('button');
        audioButton.id = 'audioButton';
        audioButton.textContent = '提示音';
        audioButton.style.margin = '2px 2px 2px 0';

      // 创建一个变量来跟踪AudioContext的状态
var isPlaying = false;

// 为按钮添加点击事件监听器
audioButton.addEventListener('click', function() {
    if (isPlaying) {
        // 如果AudioContext已经启动，那么关闭它
        audioCtx.suspend().then(function() {
            console.log('提示音 关');
        });
    } else {
        // 如果AudioContext已经关闭，那么启动它
        audioCtx.resume().then(function() {
            console.log('提示音 开');
        });
    }
    // 切换AudioContext的状态
    isPlaying = !isPlaying;
});
//useChromatic()



         async function AutoChrom(){

        if(Chrom_STATUS){
          useChromatic();
          await delay(100);
          socketsCheck();

        }else {
            buttonNameAutoChange();
        }
            }



        var colorButton = document.createElement('button');
        colorButton.textContent = '自动洗色';
        colorButton.id = "colorButton"
        colorButton.style.margin = '2px 0px 0px 0px';
        colorButton.onclick = function(){
            Chrom_STATUS = !Chrom_STATUS;
            buttonNameAutoChange();
            if (Chrom_STATUS){
                noConfirm();
                AutoChrom();
            }
        }





        function socketsCheck(){
        let tta = document.getElementsByClassName("container")[1];

        let sockets = tta.getElementsByClassName('sockets')[0];

// 获取class名为'socket red'，'socket green'和'socket blue'的元素数量
        let redCount = sockets.querySelectorAll('.socket.red').length;
        let greenCount = sockets.querySelectorAll('.socket.green').length;
        let blueCount = sockets.querySelectorAll('.socket.blue').length;
        console.log(redCount);
        console.log(greenCount);
        console.log(blueCount);
// 获取前面代码红绿蓝选项的数量
          //console.log(scriptDiv4);
        let selectElements0 = document.getElementById('select0');
        let selectElements1 = document.getElementById('select1');
        let selectElements2 = document.getElementById('select2');
        let redSelectCount = selectElements0.value;
        let greenSelectCount = selectElements1.value;
        let blueSelectCount = selectElements2.value;
        console.log(redSelectCount);
        console.log(greenSelectCount);
        console.log(blueSelectCount);
// 比较这些数量是否相等
        if ((redCount == redSelectCount) &&
        (greenCount == greenSelectCount) &&
        (blueCount == blueSelectCount))
        {
          Chrom_STATUS = !Chrom_STATUS;
            buttonNameAutoChange();
        }else
        {
         AutoChrom();
        }
}

      //
      //
      //
      //
      //
      //功能开发区域
      //
      //
      //
      //
      //
       /*       var savecurrencies = document.createElement('button');
        savecurrencies.textContent = '获取奴隶存款';
        savecurrencies.id = "savecurrencies"
        savecurrencies.style.margin = '0px 0px 0px 0px';

        savecurrencies.onclick = function() {
        let currencies = document.getElementsByClassName("currency")[0].innerText.replaceAll("\n", ",");
        let currencyList = currencies.split(",");
        let todoList = []
				for(let i = 0; i < currencyList.length ; i++){
					todoList.push(currencyList[i].split('：')[1])
				}
				localStorage.setItem("slaveCurrencyList",todoList);
// 使用Clipboard API将字符串复制到粘贴板
      navigator.clipboard.writeText(currencyList).then(function() {
      console.log(currencyList);



        console.log(todoList);
       });
      }*/

      async function getClipboardText(){
    try {
        ClipboardText = await navigator.clipboard.readText();
     // console.log(ClipboardText);
    } catch (err) {
        ClipboardText = "";
        console.log("剪切板出错");
    }
}





        var slaveButton = document.createElement('button');
        slaveButton.textContent = '获取存款'
        slaveButton.id = "slaveButton"
        slaveButton.style.margin = '0px 0px 0px 0px';
        slaveButton.onclick = function(){
        if(Loot_STATUS == false){
        if(document.getElementsByClassName("currency").length > 0){
        Loot_STATUS = !Loot_STATUS;
        buttonNameAutoChange();
        let currencies = document.getElementsByClassName("currency")[0].innerText.replaceAll("\n", ",");
        let currencyList = currencies.split(",");
        let todoList = []
				for(let i = 0; i < currencyList.length ; i++){



				todoList.push(currencyList[i].split('：')[1])
				}
				localStorage.setItem("slaveCurrencyList",todoList);
// 使用Clipboard API将字符串复制到粘贴板
        navigator.clipboard.writeText("你有："+todoList).then(function() {
        console.log(currencies.replaceAll(",", "\n"));
//        console.log(Loot_STATUS);
        });}else{

            if(byId('EEEbutton').checked && byId('autoRegal').checked && byId('T1Input2').checked && byId('dasInput').checked){
            let rotxt = getVal("rolltxt");
            localStorage.setItem("xiaohao",rotxt);
            console.log("小号存储成功")
            console.log(rotxt);
          }

          if(document.getElementsByClassName("character").length > 0){
            let rotxt = (localStorage.getItem("xiaohao")).split(".");
            let a = (document.getElementsByClassName("character")[0].getElementsByClassName("name")[0]).innerText;
          console.log(a);
            if(rotxt.indexOf(a) < 0){
              let x = localStorage.getItem("xiaohao");
              x = x +  "." + a ;
              localStorage.setItem("xiaohao",x);
              //console.log(x);
            }
            console.log(localStorage.getItem("xiaohao"))
        }


        console.log("不许反抗！！打开你的存折！！！！")
        //  }
        }
        }else
        {
        Loot_STATUS = !Loot_STATUS;
        buttonNameAutoChange();
        }
}

//document.querySelector (".ant-select-selector");

//一键上架
      /*
      navigator.clipboard.readText()
    .then(text => {
        let a = text;
        console.log(a);
    })
    .catch(err => {
        console.error('Failed to read clipboard contents: ', err);
    });
      */

        var swButton = document.createElement('button');
        swButton.textContent = swBut? "奴隶主" : "黑奴";
        swButton.id = "swButton"
        swButton.style.margin = '0px 0px 0px 0px';
        swButton.onclick = function(){
          //autolevelup;
        swBut = !swBut
        swButton.textContent = swBut ?  "奴隶主" : "黑奴";
        autolevelup();
        }





const { fetch: originalFetch } = window;

unsafeWindow.fetch = async (...args) => {
    let [resource, config ] = args;
  //console.log(resource);
  //console.log(config);
  if(resource === '/api/market/sell' && swBut == true) {
    	let evilBody = config.body;
			let evilList = JSON.parse(evilBody);
      let itemList = [];
      await getClipboardText();
      let rotxt = ClipboardText;
      if(rotxt.indexOf("你有：") >= 0){
        itemList = rotxt.split('：')[1];
      }else{
        console.log("剪切板无数据");
       itemList = localStorage.getItem("slaveCurrencyList");}//读取缓存
			let currencyList = itemList.split(',');//现有通货数组
   //"price":{"1":3,"2":4,"3":5,"4":6,"5":7,"6":8,"7":9,"8":10,"9":11,"10":13,"11":14,"12":15,"13":16,"14":17,"15":18,"16":1,"17":2,"18":12}}"
    //磨刀石1 护甲片2 工匠石3 幻色石4 链结石5 蜕变石6 机会石7 点金石8 增幅石9 改造石10 崇高石11 剥离石12 混沌石13 富豪石14 重铸石15 神圣石16 瓦尔宝珠17 卡兰德的魔镜18
    //磨刀石0 护甲片1 工匠石2 幻色石3 链结石4 蜕变石5 机会石6 点金石7 增幅石8 改造石9  重铸石10 富豪石11 剥离石12 混沌石13 崇高石14 神圣石15 瓦尔宝珠16 卡兰德的魔镜17
//你有：5636,6868,1906,1987,477,9830,585,816,5039,1741,16,80,320,50,21,13,457,0


    evilList.price = {
        "1":parseInt(currencyList[2]),//
				"2":parseInt(currencyList[3]),//
				"3":parseInt(currencyList[4]),//
				"4":parseInt(currencyList[5]),//
				"5":parseInt(currencyList[6]),//
				"6":parseInt(currencyList[7]),//
				"7":parseInt(currencyList[8]),//
				"8":parseInt(currencyList[9]),//
				"9":parseInt(currencyList[14]),//
				"10":parseInt(currencyList[13]),//
				"11":parseInt(currencyList[11]),//
				"12":parseInt(currencyList[10]),//
				"13":parseInt(currencyList[15]),//
				"14":parseInt(currencyList[16]),//
				"15":parseInt(currencyList[18]),//
				"16":parseInt(currencyList[0]),//
				"17":parseInt(currencyList[1]),//
        "18":parseInt(currencyList[12]),//
        "19":parseInt(currencyList[17])//

			}

    Object.keys(evilList.price).forEach(key => {
  if (evilList.price[key] === 0) {
    delete evilList.price[key];
  }
});
console.log(evilList);
    config.body = JSON.stringify(evilList)
		Loot_STATUS = false
    buttonNameAutoChange();
  }
  if(resource === '/api/market/buy' && swBut == false) {
    Loot_STATUS = false
    buttonNameAutoChange();
  }
    if(resource === '/api/skilltree' && swBut == false){
      console.log(config.body)
      if(config.body != undefined){
      navigator.clipboard.writeText(config.body).then(function() {
      console.log(config.body);
    })}}

    if(resource === '/api/skilltree' && swBut == true){
      let evilList = "";
      await getClipboardText();
      if(ClipboardText.indexOf("passives") >= 0){
        config.body = ClipboardText;
        swBut = false;
      swButton.textContent = swBut? "奴隶主" : "黑奴";
      }else{
        console.log("剪切板无数据");
        let a = getVal("rolltxt");
        config.body = a;
      }

    }

  if(resource.includes("/api/rank/wealth?page=")){
    jingzi();
  }



    let response = await originalFetch(resource, config);

    return response;
};


      //
      //
      //
      //
      //测试按钮
        var ceshi = document.createElement('button');
        ceshi.textContent = "测试";
        ceshi.id = "ceshi"
        ceshi.style.margin = '0px 0px 0px 0px';
        ceshi.onclick = function(){
        }

      //
      //
      //
      //
      //
      //



 async function jingzi(){
    await delay(600);
    let a = document.getElementsByClassName("rank-container")[1].innerText;
    //console.log(a)
    let b = a.split("\n");
    let e = false;
    let b3 = Number(b[3].replace(/,/g, ""));
   if(b3 <= 600000){
     console.log("当前页面财富值低于60W，不存在镜子")
     if(b3 <= 300000){
            console.log("当前页面财富值低于30W，不存在破溃")
            e =  true;
     }
   }
 //   console.log(xiaohao)
    let x = xiaohao.split(".")
   // console.log(b)
    let c = [];
    let d = false;
    for(let i = 0 ; i < 50 ; i++ ){
      c.push(b[i*4 + 2]);
    }
   // console.log(c)
   for(let l = 0 ; l < x.length; l++){
     if(c.indexOf(x[l]) >= 0 && !e){
       addSound();
       d = true;
       console.log(x[l]+"有镜子或者破溃！！");
     }
   }
   if(!d && !e){
     console.log("别想了，你的黑奴没掉到镜子破溃");
   }
 }



      //
      //
      //
      //
      //
      //
      //

      //功能开发区域
      //
      //
      //
      //
      //







        // 创建第一个<select>元素，装备类型
        var selectEquipment = document.createElement('select');
        selectEquipment.style.margin = '0px 0px 0px 80px';

        // 创建第二个<select>元素，前缀/后缀
        var selectAffixType = document.createElement('select');

        // 创建第三个<select>元素，词缀
        var selectAffix = document.createElement('select');

        // 创建第四个<select>元素，词缀等级
        var selectAffixLevel = document.createElement('select');
        selectAffixLevel.id = "affixLeveLSelect";
        //可以支持多选, 一次添加多个词缀, 但是会变得很丑
        //selectAffixLevel.multiple = "true";

        // 添加默认值到<select>元素
        selectEquipment.options.add(new Option("选择装备类型", ""));
        selectAffixType.options.add(new Option("选择词缀位置", ""));
        selectAffix.options.add(new Option("选择词缀类型", ""));
        selectAffixLevel.options.add(new Option("选择词缀等阶", ""));

// 添加事件处理程序，实现级联选择
        selectEquipment.addEventListener('change', function() {
            // 清空第二个、第三个和第四个<select>的选项
            selectAffixType.innerHTML = '';
            selectAffix.innerHTML = '';
            selectAffixLevel.innerHTML = '';

            // 添加默认值到第二个<select>
            selectAffixType.options.add(new Option("选择词缀位置", ""));

            // 根据第一个<select>的选择，动态创建第二个<select>的前缀和后缀选项
            var selectedEquipment = selectEquipment.value;
            var affixTypes = equipmentData[selectedEquipment];

            for (var type in affixTypes) {
                var option = document.createElement('option');
                option.value = type;
                option.text = type;
                selectAffixType.appendChild(option);
            }
        });

// 添加事件处理程序，实现前缀/后缀的级联选择
        selectAffixType.addEventListener('change', function() {
            // 清空第三个和第四个<select>的选项
            selectAffix.innerHTML = '';
            selectAffixLevel.innerHTML = '';

            // 添加默认值到第三个<select>
            selectAffix.options.add(new Option("选择词缀类型", ""));

            // 根据第二个<select>的选择，动态创建第三个<select>的词缀选项
            var selectedEquipment = selectEquipment.value;
            var selectedAffixType = selectAffixType.value;
            var affixes = equipmentData[selectedEquipment][selectedAffixType];

            //限制maxlevel
            for (var i = 0; i < affixes.length; i++) {
                var option = document.createElement('option');
                option.value = affixes[i].name;
                option.text = affixes[i].name;
                option.maxLevel = affixes[i].maxLevel;
                selectAffix.appendChild(option);
            }
        });

// 添加事件处理程序，实现级联选择
        selectAffix.addEventListener('change', function() {
            // 清空第四个<select>的选项
            selectAffixLevel.innerHTML = '';

            // 添加默认值到第四个<select>
            selectAffixLevel.options.add(new Option("选择词缀等阶", ""));

            // 根据第三个<select>的选择，动态创建第四个<select>的词缀等级选项
            var selectedAffix = selectAffix[selectAffix.selectedIndex];
            var levels = affixLevels[selectedAffix.value];

            for (let i = (levels.length - 1) ; i >= 0 ; i --) {
                if(levels[i].level <= selectedAffix.maxLevel){
                    var option = document.createElement('option');
                    option.value = levels[i].name;
                    option.text = levels[i].value;
                    selectAffixLevel.appendChild(option);
                }
            }
        });

// 创建一个按钮元素，添加词缀到名字关键字输入框
        var addAffixButton = document.createElement('button');
        addAffixButton.textContent = '添加';
        addAffixButton.onclick = function() {
            let selectAffix = document.getElementById("affixLeveLSelect");
            var selectedAffixOptions = selectAffix.selectedOptions;
            var selectedAffixValues = [];

            for (var i = 0; i < selectedAffixOptions.length; i++) {
                var selectedAffix = selectedAffixOptions[i];
                selectedAffixValues.push(selectedAffix.value);
            }

            let affixName = selectedAffixValues.join(','); // 将选中的值以逗号分隔

            var rollTxtInput = document.getElementById('rolltxt');

            // 不添加空词缀破坏结构
            if (affixName !== '') {
                if (rollTxtInput.value === '') {
                    rollTxtInput.value = affixName;
                } else {
                  if(rollTxtInput.value.indexOf("|") == 0){
                    rollTxtInput.value = affixName + rollTxtInput.value;
                  }else{
//                    rollTxtInput.value += ',' + affixName;
                  rollTxtInput.value = affixName + ',' + rollTxtInput.value;
                  }
                }
            }
        };


        var lButton = document.createElement('button');
        lButton.textContent = '|';
        lButton.onclick = function() {
              rollTxtInput.value = '|'+ rollTxtInput.value
        }


        var cleanAffixButton = document.createElement('button');
        cleanAffixButton.textContent = '清空';
        cleanAffixButton.onclick = function() {
        var rollTxtInput = document.getElementById('rolltxt');
        rollTxtInput.value = "";
        };





        var appDiv = document.getElementById("app");



        var hideScriptDiv = document.createElement('div');
        hideScriptDiv.style.position = 'absolute';
        hideScriptDiv.style.top = '8px';
        hideScriptDiv.style.left = '10px';
        hideScriptDiv.style.zIndex = '99999';
        hideScriptDiv.id='scriptDiv0';

        hideScriptDiv.appendChild(hideScriptButton);



        var thisdiv = document.createElement('div');
        thisdiv.style.position = 'absolute';
        thisdiv.style.top = '10px';
        thisdiv.style.left = '10px';
        thisdiv.style.zIndex = '99998';
        thisdiv.id='scriptDiv';
        thisdiv.style.textAlign = 'left'
        thisdiv.style.width = "430px";
        //thisdiv.style.display = 'none';

        var thisdiv2 = document.createElement('div');
//        thisdiv2.style.left = '100px';

        thisdiv.appendChild(thisdiv2);

        thisdiv2.appendChild(selectEquipment);// 添加第一个<select>元素，装备类型

        thisdiv2.appendChild(selectAffixType);// 添加第二个<select>元素，前缀/后缀

        thisdiv2.appendChild(selectAffix);// 添加第三个<select>元素，词缀

        thisdiv2.appendChild(selectAffixLevel);// 添加第四个<select>元素，词缀等级

        thisdiv2.appendChild(addAffixButton);// 添加 添加按钮

        thisdiv2.appendChild(lButton);

        thisdiv2.appendChild(cleanAffixButton);//添加清空按钮
        thisdiv2.appendChild(document.createElement("br"));
        thisdiv2.appendChild(audioButton);
        thisdiv2.appendChild(document.createTextNode("有效词数："));
        thisdiv2.appendChild(checkFixNumberInput);//匹配词缀数
        thisdiv2.appendChild(document.createTextNode("词缀："));
        thisdiv2.appendChild(rollTxtInput);//词缀输入框

        var thisdiv1 = document.createElement('div');


        thisdiv.appendChild(thisdiv1);
/*     var thisdiv1 = document.createElement('div');
        thisdiv1.style.position = 'absolute';
        thisdiv1.style.top = '40px';
        thisdiv1.style.left = '10px';
        thisdiv1.style.zIndex = '99999';
        thisdiv1.id='scriptDiv2';*/

//        var appDiv1 = document.getElementById("scriptDiv1");
        thisdiv1.appendChild(burstButton);
        thisdiv1.appendChild(linkButton);//自动连接
        //thisdiv1.appendChild(savecurrencies);

        thisdiv1.appendChild(fazInput);
        thisdiv1.appendChild(document.createTextNode("解除限制"));//改造后自动富豪，再判断词缀，不对回炉
        thisdiv1.appendChild(dasInput);
        thisdiv1.appendChild(document.createTextNode("最大伤>"));//改造后自动富豪，再判断词缀，不对回炉
        thisdiv1.appendChild(shanghai);

        var thisdiv3 = document.createElement('div');
//        thisdiv2.style.left = '100px';

        thisdiv.appendChild(thisdiv3);
//        thisdiv1.appendChild(inputcurrencies);

//        thisdiv1.appendChild(document.createElement("br"));

        thisdiv3.appendChild(rollButton);//自动混沌
        thisdiv3.appendChild(rollButton2);//自动点金

        thisdiv3.appendChild(T1Input2);
        thisdiv3.appendChild(document.createTextNode("至少包含:"));
        thisdiv3.appendChild(checkFixNumberInput1);
        thisdiv3.appendChild(T1ciInput2);//词缀输入框


        thisdiv.style.color = 'coral'

//        appDiv1.appendChild(thisdiv1);

//        thisdiv.appendChild(document.createElement("br"));

/*        thisdiv.appendChild(selectEquipment);// 添加第一个<select>元素，装备类型

        thisdiv.appendChild(selectAffixType);// 添加第二个<select>元素，前缀/后缀

        thisdiv.appendChild(selectAffix);// 添加第三个<select>元素，词缀

        thisdiv.appendChild(selectAffixLevel);// 添加第四个<select>元素，词缀等级

        thisdiv.appendChild(addAffixButton);// 添加 添加按钮

        thisdiv.appendChild(cleanAffixButton);//添加清空按钮*/
        var thisdiv4 = document.createElement('div');
        thisdiv4.id='scriptDiv4';

//        thisdiv2.style.left = '100px';scriptDiv4

        thisdiv.appendChild(thisdiv4);

//        thisdiv.appendChild(document.createElement("br"));

        //添加延迟调整按钮
        thisdiv4.appendChild(rollButton1);//自动
        thisdiv4.appendChild(rollButton3);
 //       thisdiv4.appendChild(document.createTextNode(">>>"));//改造后自动富豪，再判断词缀，不对回炉

        thisdiv4.appendChild(regalInput);
        thisdiv4.appendChild(document.createTextNode("富豪拼词 "));
        thisdiv4.appendChild(EEEbutton);
        thisdiv4.appendChild(document.createTextNode("EEE"));//改造后自动富豪，再判断词缀，不对回炉
        thisdiv4.appendChild(EEEInput);
        thisdiv4.appendChild(T1Input);
     //   thisdiv4.appendChild(document.createTextNode("词缀是"));//改造后自动富豪，再判断词缀，不对回炉
        thisdiv4.appendChild(T1ciInput);
      //  thisdiv4.appendChild(document.createTextNode("也停 "));//改造后自动富豪，再判断词缀，不对回炉
        thisdiv4.appendChild(document.createElement("br"));
        thisdiv4.appendChild(colorButton);

    var colors = ["红", "绿", "蓝"];
// 遍历颜色数组
for (let i = 0; i < colors.length; i++) {
    // 创建一个select元素
    let colorselect = document.createElement("select");
        colorselect.id = 'select'
        colorselect.style.width = '50px';
      colorselect.options.add(new Option(colors[i],"0"));
    // 为select元素添加1-6的选项
    for (let j = 1; j <= 6; j++) {
        let option = document.createElement("option");
        option.value = j;
        option.text = j;
        colorselect.appendChild(option);
    }

    // 设置select元素的默认选项为对应的颜色
    //colorselect.value = colors[i];
    colorselect.id = "select" + i;

    // 将select元素添加到页面中
    thisdiv4.appendChild(colorselect);
}
        thisdiv4.appendChild(document.createElement("br"));
//      thisdiv.appendChild(linkButton);//自动连接
		    thisdiv4.appendChild(document.createTextNode("普通改造富豪未匹配2词回炉，完美改造拼3词"));//混沌/点金后自动崇高，再判断词缀，不对回炉
        thisdiv4.appendChild(document.createElement("br"));
        thisdiv4.appendChild(document.createTextNode("大号上架选奴隶主，小号获取通货选黑奴"));
        thisdiv4.appendChild(document.createElement("br"));
        thisdiv4.appendChild(document.createTextNode("按F12点开console能看到改造出的词缀"));
        thisdiv4.appendChild(document.createElement("br"));
        thisdiv4.appendChild(document.createTextNode("显示黑奴保存天赋会将天赋代码输出到F12控制台"));
        thisdiv4.appendChild(document.createElement("br"));
        thisdiv4.appendChild(document.createTextNode("显示奴隶主保存天赋可以替换剪切板代码的天赋"));
        thisdiv4.appendChild(document.createElement("br"));
        thisdiv4.appendChild(slaveButton);
        thisdiv4.appendChild(swButton);
        thisdiv4.appendChild(ceshi);
        thisdiv4.appendChild(document.createElement("br"));
        thisdiv4.appendChild(document.createTextNode("version 1.0.3.2"));
        thisdiv4.style.color = 'coral'



        var appDiv = document.getElementById("app");
        appDiv.appendChild(hideScriptDiv);
        appDiv.appendChild(thisdiv);



        // 初始化第一个<select>的选项
        for (var equipment in equipmentData) {
            var option = document.createElement('option');
            option.value = equipment;
            option.text = equipment;
            selectEquipment.appendChild(option);
        };

    xiaohao = localStorage.getItem("xiaohao");
//		Loot_STATUS.textContent = Loot_STATUS?'上架任意通货即可替换成存款':'获取奴隶存款';
    selectAffixType.innerHTML = '';
		selectAffix.innerHTML = '';
		selectAffixLevel.innerHTML = '';

    showScriptFlag = localStorage.getItem("showScriptFlag")  === 'true'?true:false;
		hideScriptButton.textContent = showScriptFlag?'隐藏脚本':'显示脚本';
		if(!showScriptFlag){
			byId("scriptDiv").style.display = 'none';
			//byId("scriptDiv2").style.display = 'none';
		//	byId("scriptDiv3").style.display = 'none';
		}else {
			byId("scriptDiv").style.display = 'block';
			//byId("scriptDiv2").style.display = 'block';
			//byId("scriptDiv3").style.display = 'block';
		}
      //////////////////////////
      //////////////////////////
      //////////////////////////
      //////////////////////////
      //////////////////////////
      //////////////////////////
      //////////////////////////
      //////////////////////////


      //////////////////////////
      //////////////////////////
      //////////////////////////
      //////////////////////////
      //////////////////////////
      //////////////////////////
      //////////////////////////

        console.log("init success!");
    }

    window.onload =  function(){
        init();
    };

    //todo 全自动改造
    //todo 多个添加, 可保存

})();
//精神之,永恒之,苏生之,年轻之,恒久之,价值之,容易之,厚皮之,石皮之,金属皮之,钢皮之,金刚皮之,玉皮之,失落之,放逐之,驱逐之,出境之,流亡之,巴曼斯之,云朵之,冰雹之,暴风之,积雨云之,暴风雨之,台风之,电之,艾菲吉之,北方民族之,海豹之,企鹅之,雪人之,海象之,北极熊之,冰之,哈斯特之,幼龙之,火蜥蜴之,火龙之,窑炉之,炉火之,火山之,岩浆之,提耶须之,蝾螈之,蜥蜴之,海星之,九头蛇之,食人妖之,食人之,瑞斯拉萨之,凤凰之,掠夺之,扫荡之,野蛮之,摔角手之,熊之,狮子之,大猩猩之,巨人之,海兽之,泰坦之,众神之,跑步的,短跑的,种马的,瞪羚的,猎豹的,地狱的,牡蛎的,顽童的,上漆的,镶嵌的,螺纹的,强化的,电镀的,装甲化的,围绕的,甲虫的,螃蟹的,犰狳的,犀牛的,大象的,长毛象的,增强的,分层的,甲壳的,支持的,加厚的,围城的,坚不可摧的,喜鹊的,海盗的,健壮的,健康的,乐观的,坚定的,粗壮的,健壮的,丰腴的,阳刚的,运动员的