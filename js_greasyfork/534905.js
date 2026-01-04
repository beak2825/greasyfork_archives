// ==UserScript==
// @name         [银河奶牛]食用工具-护心版
// @namespace    http://tampermonkey.net/
// @version      0.475
// @description  开箱记录、箱子期望(守护你的玻璃心)、离线统计、公会钉钉、食物警察、掉落追踪、强化统计
// @author       Truth_Light
// @license      MIT
// @match        https://www.milkywayidle.com/*
// @match        https://test.milkywayidle.com/*
// @icon         https://www.milkywayidle.com/favicon.svg
// @connect      raw.githubusercontent.com
// @grant        GM.xmlHttpRequest
// @grant        GM_registerMenuCommand
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/534905/%5B%E9%93%B6%E6%B2%B3%E5%A5%B6%E7%89%9B%5D%E9%A3%9F%E7%94%A8%E5%B7%A5%E5%85%B7-%E6%8A%A4%E5%BF%83%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/534905/%5B%E9%93%B6%E6%B2%B3%E5%A5%B6%E7%89%9B%5D%E9%A3%9F%E7%94%A8%E5%B7%A5%E5%85%B7-%E6%8A%A4%E5%BF%83%E7%89%88.meta.js
// ==/UserScript==

(async function() {
    'use strict';
    const isCN = !['en'].some(lang =>localStorage.getItem("i18nextLng")?.toLowerCase()?.startsWith(lang));
    const itemSelector = '.ItemDictionary_drop__24I5f';
    const iconSelector = '.Icon_icon__2LtL_ use';
    const chestNameSelector = '#root > div > div > div.Modal_modalContainer__3B80m > div.Modal_modal__1Jiep > div.ItemDictionary_modalContent__WvEBY > div.ItemDictionary_itemAndDescription__28_he > div.Item_itemContainer__x7kH1 > div > div > div > svg > use';
    const MARKET_API_URL = "https://raw.githubusercontent.com/holychikenz/MWIApi/refs/heads/main/milkyapi.json";
    let timer = null;
    let formattedChestDropData = {};
    let battlePlayerFood = {};
    let battlePlayerLoot = {};
    let battlePlayerData = {};
    let battlePlayerFoodConsumable = {};
    let battleDuration;
    let battleRunCount;
    let now_battle_map;
    let enhancementLevel;
    let currentEnhancingIndex = 1;
    let enhancementData = {
        [currentEnhancingIndex]: { "强化数据": {}, "其他数据": {} }
    };
    let currentPlayerID = null;
    let currentPlayerName = null;
    let item_icon_url

    let processCombatConsumablesRunCount = 0;

    let marketData = JSON.parse(localStorage.getItem('MWITools_marketAPI_json'));
    const init_Client_Data = localStorage.getItem('initClientData');
    if (!init_Client_Data) return;
    let init_Client_Data_;
    try {
        init_Client_Data_ = JSON.parse(init_Client_Data);
    } catch (error) {
        console.error('数据解析失败:', error);
        return;
    }
    if (init_Client_Data_.type !== 'init_client_data') return;
    const item_hrid_to_name = {};
    for (const key in init_Client_Data_.itemDetailMap) {
        const item = init_Client_Data_.itemDetailMap[key];
        if (item && typeof item === 'object' && item.name) {
            item_hrid_to_name[key] = item.name;
        }
    }
    console.log(item_hrid_to_name)
    const item_name_to_hrid = Object.fromEntries(
        Object.entries(item_hrid_to_name).map(([key, value]) => [value, key])
    );
    const e2c = {
        "Coin": "金币",
        "Task Token": "任务代币",
        "Chimerical Token": "奇幻代币",
        "Sinister Token": "阴森代币",
        "Enchanted Token": "秘法代币",
        "Pirate Token": "海盗代币",
        "Cowbell": "牛铃",
        "Bag Of 10 Cowbells": "牛铃袋 (10个)",
        "Purple's Gift": "小紫牛的礼物",
        "Small Meteorite Cache": "小陨石舱",
        "Medium Meteorite Cache": "中陨石舱",
        "Large Meteorite Cache": "大陨石舱",
        "Small Artisan's Crate": "小工匠匣",
        "Medium Artisan's Crate": "中工匠匣",
        "Large Artisan's Crate": "大工匠匣",
        "Small Treasure Chest": "小宝箱",
        "Medium Treasure Chest": "中宝箱",
        "Large Treasure Chest": "大宝箱",
        "Chimerical Chest": "奇幻宝箱",
        "Sinister Chest": "阴森宝箱",
        "Enchanted Chest": "秘法宝箱",
        "Pirate Chest": "海盗宝箱",
        "Blue Key Fragment": "蓝色钥匙碎片",
        "Green Key Fragment": "绿色钥匙碎片",
        "Purple Key Fragment": "紫色钥匙碎片",
        "White Key Fragment": "白色钥匙碎片",
        "Orange Key Fragment": "橙色钥匙碎片",
        "Brown Key Fragment": "棕色钥匙碎片",
        "Stone Key Fragment": "石头钥匙碎片",
        "Dark Key Fragment": "黑暗钥匙碎片",
        "Burning Key Fragment": "燃烧钥匙碎片",
        "Chimerical Entry Key": "奇幻钥匙",
        "Chimerical Chest Key": "奇幻宝箱钥匙",
        "Sinister Entry Key": "阴森钥匙",
        "Sinister Chest Key": "阴森宝箱钥匙",
        "Enchanted Entry Key": "秘法钥匙",
        "Enchanted Chest Key": "秘法宝箱钥匙",
        "Pirate Entry Key": "海盗钥匙",
        "Pirate Chest Key": "海盗宝箱钥匙",
        "Donut": "甜甜圈",
        "Blueberry Donut": "蓝莓甜甜圈",
        "Blackberry Donut": "黑莓甜甜圈",
        "Strawberry Donut": "草莓甜甜圈",
        "Mooberry Donut": "哞莓甜甜圈",
        "Marsberry Donut": "火星莓甜甜圈",
        "Spaceberry Donut": "太空莓甜甜圈",
        "Cupcake": "纸杯蛋糕",
        "Blueberry Cake": "蓝莓蛋糕",
        "Blackberry Cake": "黑莓蛋糕",
        "Strawberry Cake": "草莓蛋糕",
        "Mooberry Cake": "哞莓蛋糕",
        "Marsberry Cake": "火星莓蛋糕",
        "Spaceberry Cake": "太空莓蛋糕",
        "Gummy": "软糖",
        "Apple Gummy": "苹果软糖",
        "Orange Gummy": "橙子软糖",
        "Plum Gummy": "李子软糖",
        "Peach Gummy": "桃子软糖",
        "Dragon Fruit Gummy": "火龙果软糖",
        "Star Fruit Gummy": "杨桃软糖",
        "Yogurt": "酸奶",
        "Apple Yogurt": "苹果酸奶",
        "Orange Yogurt": "橙子酸奶",
        "Plum Yogurt": "李子酸奶",
        "Peach Yogurt": "桃子酸奶",
        "Dragon Fruit Yogurt": "火龙果酸奶",
        "Star Fruit Yogurt": "杨桃酸奶",
        "Milking Tea": "挤奶茶",
        "Foraging Tea": "采摘茶",
        "Woodcutting Tea": "伐木茶",
        "Cooking Tea": "烹饪茶",
        "Brewing Tea": "冲泡茶",
        "Alchemy Tea": "炼金茶",
        "Enhancing Tea": "强化茶",
        "Cheesesmithing Tea": "奶酪锻造茶",
        "Crafting Tea": "制作茶",
        "Tailoring Tea": "缝纫茶",
        "Super Milking Tea": "超级挤奶茶",
        "Super Foraging Tea": "超级采摘茶",
        "Super Woodcutting Tea": "超级伐木茶",
        "Super Cooking Tea": "超级烹饪茶",
        "Super Brewing Tea": "超级冲泡茶",
        "Super Alchemy Tea": "超级炼金茶",
        "Super Enhancing Tea": "超级强化茶",
        "Super Cheesesmithing Tea": "超级奶酪锻造茶",
        "Super Crafting Tea": "超级制作茶",
        "Super Tailoring Tea": "超级缝纫茶",
        "Ultra Milking Tea": "究极挤奶茶",
        "Ultra Foraging Tea": "究极采摘茶",
        "Ultra Woodcutting Tea": "究极伐木茶",
        "Ultra Cooking Tea": "究极烹饪茶",
        "Ultra Brewing Tea": "究极冲泡茶",
        "Ultra Alchemy Tea": "究极炼金茶",
        "Ultra Enhancing Tea": "究极强化茶",
        "Ultra Cheesesmithing Tea": "究极奶酪锻造茶",
        "Ultra Crafting Tea": "究极制作茶",
        "Ultra Tailoring Tea": "究极缝纫茶",
        "Gathering Tea": "采集茶",
        "Gourmet Tea": "美食茶",
        "Wisdom Tea": "经验茶",
        "Processing Tea": "加工茶",
        "Efficiency Tea": "效率茶",
        "Artisan Tea": "工匠茶",
        "Catalytic Tea": "催化茶",
        "Blessed Tea": "福气茶",
        "Stamina Coffee": "耐力咖啡",
        "Intelligence Coffee": "智力咖啡",
        "Defense Coffee": "防御咖啡",
        "Attack Coffee": "攻击咖啡",
        "Power Coffee": "力量咖啡",
        "Ranged Coffee": "远程咖啡",
        "Magic Coffee": "魔法咖啡",
        "Super Stamina Coffee": "超级耐力咖啡",
        "Super Intelligence Coffee": "超级智力咖啡",
        "Super Defense Coffee": "超级防御咖啡",
        "Super Attack Coffee": "超级攻击咖啡",
        "Super Power Coffee": "超级力量咖啡",
        "Super Ranged Coffee": "超级远程咖啡",
        "Super Magic Coffee": "超级魔法咖啡",
        "Ultra Stamina Coffee": "究极耐力咖啡",
        "Ultra Intelligence Coffee": "究极智力咖啡",
        "Ultra Defense Coffee": "究极防御咖啡",
        "Ultra Attack Coffee": "究极攻击咖啡",
        "Ultra Power Coffee": "究极力量咖啡",
        "Ultra Ranged Coffee": "究极远程咖啡",
        "Ultra Magic Coffee": "究极魔法咖啡",
        "Wisdom Coffee": "经验咖啡",
        "Lucky Coffee": "幸运咖啡",
        "Swiftness Coffee": "迅捷咖啡",
        "Channeling Coffee": "吟唱咖啡",
        "Critical Coffee": "暴击咖啡",
        "Poke": "破胆之刺",
        "Impale": "透骨之刺",
        "Puncture": "破甲之刺",
        "Penetrating Strike": "贯心之刺",
        "Scratch": "爪影斩",
        "Cleave": "分裂斩",
        "Maim": "血刃斩",
        "Crippling Slash": "致残斩",
        "Smack": "重碾",
        "Sweep": "重扫",
        "Stunning Blow": "重锤",
        "Fracturing Impact": "碎裂冲击",
        "Shield Bash": "盾击",
        "Quick Shot": "快速射击",
        "Aqua Arrow": "流水箭",
        "Flame Arrow": "烈焰箭",
        "Rain Of Arrows": "箭雨",
        "Silencing Shot": "沉默之箭",
        "Steady Shot": "稳定射击",
        "Pestilent Shot": "疫病射击",
        "Penetrating Shot": "贯穿射击",
        "Water Strike": "流水冲击",
        "Ice Spear": "冰枪术",
        "Frost Surge": "冰霜爆裂",
        "Mana Spring": "法力喷泉",
        "Entangle": "缠绕",
        "Toxic Pollen": "剧毒粉尘",
        "Nature's Veil": "自然菌幕",
        "Life Drain": "生命吸取",
        "Fireball": "火球",
        "Flame Blast": "熔岩爆裂",
        "Firestorm": "火焰风暴",
        "Smoke Burst": "烟爆灭影",
        "Minor Heal": "初级自愈术",
        "Heal": "自愈术",
        "Quick Aid": "快速治疗术",
        "Rejuvenate": "群体治疗术",
        "Taunt": "嘲讽",
        "Provoke": "挑衅",
        "Toughness": "坚韧",
        "Elusiveness": "闪避",
        "Precision": "精确",
        "Berserk": "狂暴",
        "Elemental Affinity": "元素增幅",
        "Frenzy": "狂速",
        "Spike Shell": "尖刺防护",
        "Arcane Reflection": "奥术反射",
        "Vampirism": "吸血",
        "Revive": "复活",
        "Insanity": "疯狂",
        "Invincible": "无敌",
        "Fierce Aura": "物理光环",
        "Aqua Aura": "流水光环",
        "Sylvan Aura": "自然光环",
        "Flame Aura": "火焰光环",
        "Speed Aura": "速度光环",
        "Critical Aura": "暴击光环",
        "Gobo Stabber": "哥布林长剑",
        "Gobo Slasher": "哥布林关刀",
        "Gobo Smasher": "哥布林狼牙棒",
        "Spiked Bulwark": "尖刺重盾",
        "Werewolf Slasher": "狼人关刀",
        "Griffin Bulwark": "狮鹫重盾",
        "Gobo Shooter": "哥布林弹弓",
        "Vampiric Bow": "吸血弓",
        "Cursed Bow": "咒怨之弓",
        "Gobo Boomstick": "哥布林火棍",
        "Cheese Bulwark": "奶酪重盾",
        "Verdant Bulwark": "翠绿重盾",
        "Azure Bulwark": "蔚蓝重盾",
        "Burble Bulwark": "深紫重盾",
        "Crimson Bulwark": "绛红重盾",
        "Rainbow Bulwark": "彩虹重盾",
        "Holy Bulwark": "神圣重盾",
        "Wooden Bow": "木弓",
        "Birch Bow": "桦木弓",
        "Cedar Bow": "雪松弓",
        "Purpleheart Bow": "紫心弓",
        "Ginkgo Bow": "银杏弓",
        "Redwood Bow": "红杉弓",
        "Arcane Bow": "神秘弓",
        "Stalactite Spear": "石钟长枪",
        "Granite Bludgeon": "花岗岩大棒",
        "Furious Spear": "狂怒长枪",
        "Regal Sword": "君王之剑",
        "Chaotic Flail": "混沌连枷",
        "Soul Hunter Crossbow": "灵魂猎手弩",
        "Sundering Crossbow": "裂空之弩",
        "Frost Staff": "冰霜法杖",
        "Infernal Battlestaff": "炼狱法杖",
        "Jackalope Staff": "鹿角兔之杖",
        "Rippling Trident": "涟漪三叉戟",
        "Blooming Trident": "绽放三叉戟",
        "Blazing Trident": "炽焰三叉戟",
        "Cheese Sword": "奶酪剑",
        "Verdant Sword": "翠绿剑",
        "Azure Sword": "蔚蓝剑",
        "Burble Sword": "深紫剑",
        "Crimson Sword": "绛红剑",
        "Rainbow Sword": "彩虹剑",
        "Holy Sword": "神圣剑",
        "Cheese Spear": "奶酪长枪",
        "Verdant Spear": "翠绿长枪",
        "Azure Spear": "蔚蓝长枪",
        "Burble Spear": "深紫长枪",
        "Crimson Spear": "绛红长枪",
        "Rainbow Spear": "彩虹长枪",
        "Holy Spear": "神圣长枪",
        "Cheese Mace": "奶酪钉头锤",
        "Verdant Mace": "翠绿钉头锤",
        "Azure Mace": "蔚蓝钉头锤",
        "Burble Mace": "深紫钉头锤",
        "Crimson Mace": "绛红钉头锤",
        "Rainbow Mace": "彩虹钉头锤",
        "Holy Mace": "神圣钉头锤",
        "Wooden Crossbow": "木弩",
        "Birch Crossbow": "桦木弩",
        "Cedar Crossbow": "雪松弩",
        "Purpleheart Crossbow": "紫心弩",
        "Ginkgo Crossbow": "银杏弩",
        "Redwood Crossbow": "红杉弩",
        "Arcane Crossbow": "神秘弩",
        "Wooden Water Staff": "木制水法杖",
        "Birch Water Staff": "桦木水法杖",
        "Cedar Water Staff": "雪松水法杖",
        "Purpleheart Water Staff": "紫心水法杖",
        "Ginkgo Water Staff": "银杏水法杖",
        "Redwood Water Staff": "红杉水法杖",
        "Arcane Water Staff": "神秘水法杖",
        "Wooden Nature Staff": "木制自然法杖",
        "Birch Nature Staff": "桦木自然法杖",
        "Cedar Nature Staff": "雪松自然法杖",
        "Purpleheart Nature Staff": "紫心自然法杖",
        "Ginkgo Nature Staff": "银杏自然法杖",
        "Redwood Nature Staff": "红杉自然法杖",
        "Arcane Nature Staff": "神秘自然法杖",
        "Wooden Fire Staff": "木制火法杖",
        "Birch Fire Staff": "桦木火法杖",
        "Cedar Fire Staff": "雪松火法杖",
        "Purpleheart Fire Staff": "紫心火法杖",
        "Ginkgo Fire Staff": "银杏火法杖",
        "Redwood Fire Staff": "红杉火法杖",
        "Arcane Fire Staff": "神秘火法杖",
        "Eye Watch": "掌上监工",
        "Snake Fang Dirk": "蛇牙短剑",
        "Vision Shield": "视觉盾",
        "Gobo Defender": "哥布林防御者",
        "Vampire Fang Dirk": "吸血鬼短剑",
        "Knight's Aegis": "骑士盾",
        "Treant Shield": "树人盾",
        "Manticore Shield": "蝎狮盾",
        "Tome Of Healing": "治疗之书",
        "Tome Of The Elements": "元素之书",
        "Watchful Relic": "警戒遗物",
        "Bishop's Codex": "主教法典",
        "Cheese Buckler": "奶酪圆盾",
        "Verdant Buckler": "翠绿圆盾",
        "Azure Buckler": "蔚蓝圆盾",
        "Burble Buckler": "深紫圆盾",
        "Crimson Buckler": "绛红圆盾",
        "Rainbow Buckler": "彩虹圆盾",
        "Holy Buckler": "神圣圆盾",
        "Wooden Shield": "木盾",
        "Birch Shield": "桦木盾",
        "Cedar Shield": "雪松盾",
        "Purpleheart Shield": "紫心盾",
        "Ginkgo Shield": "银杏盾",
        "Redwood Shield": "红杉盾",
        "Arcane Shield": "神秘盾",
        "Sinister Cape": "阴森斗篷",
        "Chimerical Quiver": "奇幻箭袋",
        "Enchanted Cloak": "秘法披风",
        "Red Culinary Hat": "红色厨师帽",
        "Snail Shell Helmet": "蜗牛壳头盔",
        "Vision Helmet": "视觉头盔",
        "Fluffy Red Hat": "蓬松红帽子",
        "Corsair Helmet": "掠夺者头盔",
        "Acrobatic Hood": "杂技师兜帽",
        "Magician's Hat": "魔术师帽",
        "Cheese Helmet": "奶酪头盔",
        "Verdant Helmet": "翠绿头盔",
        "Azure Helmet": "蔚蓝头盔",
        "Burble Helmet": "深紫头盔",
        "Crimson Helmet": "绛红头盔",
        "Rainbow Helmet": "彩虹头盔",
        "Holy Helmet": "神圣头盔",
        "Rough Hood": "粗糙兜帽",
        "Reptile Hood": "爬行动物兜帽",
        "Gobo Hood": "哥布林兜帽",
        "Beast Hood": "野兽兜帽",
        "Umbral Hood": "暗影兜帽",
        "Cotton Hat": "棉帽",
        "Linen Hat": "亚麻帽",
        "Bamboo Hat": "竹帽",
        "Silk Hat": "丝帽",
        "Radiant Hat": "光辉帽",
        "Dairyhand's Top": "挤奶工上衣",
        "Forager's Top": "采摘者上衣",
        "Lumberjack's Top": "伐木工上衣",
        "Cheesemaker's Top": "奶酪师上衣",
        "Crafter's Top": "工匠上衣",
        "Tailor's Top": "裁缝上衣",
        "Chef's Top": "厨师上衣",
        "Brewer's Top": "饮品师上衣",
        "Alchemist's Top": "炼金师上衣",
        "Enhancer's Top": "强化师上衣",
        "Gator Vest": "鳄鱼马甲",
        "Turtle Shell Body": "龟壳胸甲",
        "Colossus Plate Body": "巨像胸甲",
        "Demonic Plate Body": "恶魔胸甲",
        "Anchorbound Plate Body": "锚定胸甲",
        "Maelstrom Plate Body": "怒涛胸甲",
        "Marine Tunic": "海洋皮衣",
        "Revenant Tunic": "亡灵皮衣",
        "Griffin Tunic": "狮鹫皮衣",
        "Kraken Tunic": "克拉肯皮衣",
        "Icy Robe Top": "冰霜袍服",
        "Flaming Robe Top": "烈焰袍服",
        "Luna Robe Top": "月神袍服",
        "Royal Water Robe Top": "皇家水系袍服",
        "Royal Nature Robe Top": "皇家自然系袍服",
        "Royal Fire Robe Top": "皇家火系袍服",
        "Cheese Plate Body": "奶酪胸甲",
        "Verdant Plate Body": "翠绿胸甲",
        "Azure Plate Body": "蔚蓝胸甲",
        "Burble Plate Body": "深紫胸甲",
        "Crimson Plate Body": "绛红胸甲",
        "Rainbow Plate Body": "彩虹胸甲",
        "Holy Plate Body": "神圣胸甲",
        "Rough Tunic": "粗糙皮衣",
        "Reptile Tunic": "爬行动物皮衣",
        "Gobo Tunic": "哥布林皮衣",
        "Beast Tunic": "野兽皮衣",
        "Umbral Tunic": "暗影皮衣",
        "Cotton Robe Top": "棉布袍服",
        "Linen Robe Top": "亚麻袍服",
        "Bamboo Robe Top": "竹袍服",
        "Silk Robe Top": "丝绸袍服",
        "Radiant Robe Top": "光辉袍服",
        "Dairyhand's Bottoms": "挤奶工下装",
        "Forager's Bottoms": "采摘者下装",
        "Lumberjack's Bottoms": "伐木工下装",
        "Cheesemaker's Bottoms": "奶酪师下装",
        "Crafter's Bottoms": "工匠下装",
        "Tailor's Bottoms": "裁缝下装",
        "Chef's Bottoms": "厨师下装",
        "Brewer's Bottoms": "饮品师下装",
        "Alchemist's Bottoms": "炼金师下装",
        "Enhancer's Bottoms": "强化师下装",
        "Turtle Shell Legs": "龟壳腿甲",
        "Colossus Plate Legs": "巨像腿甲",
        "Demonic Plate Legs": "恶魔腿甲",
        "Anchorbound Plate Legs": "锚定腿甲",
        "Maelstrom Plate Legs": "怒涛腿甲",
        "Marine Chaps": "航海皮裤",
        "Revenant Chaps": "亡灵皮裤",
        "Griffin Chaps": "狮鹫皮裤",
        "Kraken Chaps": "克拉肯皮裤",
        "Icy Robe Bottoms": "冰霜袍裙",
        "Flaming Robe Bottoms": "烈焰袍裙",
        "Luna Robe Bottoms": "月神袍裙",
        "Royal Water Robe Bottoms": "皇家水系袍裙",
        "Royal Nature Robe Bottoms": "皇家自然系袍裙",
        "Royal Fire Robe Bottoms": "皇家火系袍裙",
        "Cheese Plate Legs": "奶酪腿甲",
        "Verdant Plate Legs": "翠绿腿甲",
        "Azure Plate Legs": "蔚蓝腿甲",
        "Burble Plate Legs": "深紫腿甲",
        "Crimson Plate Legs": "绛红腿甲",
        "Rainbow Plate Legs": "彩虹腿甲",
        "Holy Plate Legs": "神圣腿甲",
        "Rough Chaps": "粗糙皮裤",
        "Reptile Chaps": "爬行动物皮裤",
        "Gobo Chaps": "哥布林皮裤",
        "Beast Chaps": "野兽皮裤",
        "Umbral Chaps": "暗影皮裤",
        "Cotton Robe Bottoms": "棉袍裙",
        "Linen Robe Bottoms": "亚麻袍裙",
        "Bamboo Robe Bottoms": "竹袍裙",
        "Silk Robe Bottoms": "丝绸袍裙",
        "Radiant Robe Bottoms": "光辉袍裙",
        "Enchanted Gloves": "附魔手套",
        "Pincer Gloves": "蟹钳手套",
        "Panda Gloves": "熊猫手套",
        "Magnetic Gloves": "磁力手套",
        "Dodocamel Gauntlets": "渡渡驼护手",
        "Sighted Bracers": "瞄准护腕",
        "Marksman Bracers": "神射护腕",
        "Chrono Gloves": "时空手套",
        "Cheese Gauntlets": "奶酪护手",
        "Verdant Gauntlets": "翠绿护手",
        "Azure Gauntlets": "蔚蓝护手",
        "Burble Gauntlets": "深紫护手",
        "Crimson Gauntlets": "绛红护手",
        "Rainbow Gauntlets": "彩虹护手",
        "Holy Gauntlets": "神圣护手",
        "Rough Bracers": "粗糙护腕",
        "Reptile Bracers": "爬行动物护腕",
        "Gobo Bracers": "哥布林护腕",
        "Beast Bracers": "野兽护腕",
        "Umbral Bracers": "暗影护腕",
        "Cotton Gloves": "棉手套",
        "Linen Gloves": "亚麻手套",
        "Bamboo Gloves": "竹手套",
        "Silk Gloves": "丝手套",
        "Radiant Gloves": "光辉手套",
        "Collector's Boots": "收藏家靴",
        "Shoebill Shoes": "鲸头鹳鞋",
        "Black Bear Shoes": "黑熊鞋",
        "Grizzly Bear Shoes": "棕熊鞋",
        "Polar Bear Shoes": "北极熊鞋",
        "Centaur Boots": "半人马靴",
        "Sorcerer Boots": "巫师靴",
        "Cheese Boots": "奶酪靴",
        "Verdant Boots": "翠绿靴",
        "Azure Boots": "蔚蓝靴",
        "Burble Boots": "深紫靴",
        "Crimson Boots": "绛红靴",
        "Rainbow Boots": "彩虹靴",
        "Holy Boots": "神圣靴",
        "Rough Boots": "粗糙靴",
        "Reptile Boots": "爬行动物靴",
        "Gobo Boots": "哥布林靴",
        "Beast Boots": "野兽靴",
        "Umbral Boots": "暗影靴",
        "Cotton Boots": "棉靴",
        "Linen Boots": "亚麻靴",
        "Bamboo Boots": "竹靴",
        "Silk Boots": "丝靴",
        "Radiant Boots": "光辉靴",
        "Small Pouch": "小袋子",
        "Medium Pouch": "中袋子",
        "Large Pouch": "大袋子",
        "Giant Pouch": "巨大袋子",
        "Gluttonous Pouch": "贪食之袋",
        "Guzzling Pouch": "暴饮之囊",
        "Necklace Of Efficiency": "效率项链",
        "Fighter Necklace": "战士项链",
        "Ranger Necklace": "射手项链",
        "Wizard Necklace": "巫师项链",
        "Necklace Of Wisdom": "经验项链",
        "Necklace Of Speed": "速度项链",
        "Philosopher's Necklace": "贤者项链",
        "Earrings Of Gathering": "采集耳环",
        "Earrings Of Essence Find": "精华发现耳环",
        "Earrings Of Armor": "护甲耳环",
        "Earrings Of Regeneration": "恢复耳环",
        "Earrings Of Resistance": "抗性耳环",
        "Earrings Of Rare Find": "稀有发现耳环",
        "Earrings Of Critical Strike": "暴击耳环",
        "Philosopher's Earrings": "贤者耳环",
        "Ring Of Gathering": "采集戒指",
        "Ring Of Essence Find": "精华发现戒指",
        "Ring Of Armor": "护甲戒指",
        "Ring Of Regeneration": "恢复戒指",
        "Ring Of Resistance": "抗性戒指",
        "Ring Of Rare Find": "稀有发现戒指",
        "Ring Of Critical Strike": "暴击戒指",
        "Philosopher's Ring": "贤者戒指",
        "Basic Task Badge": "基础任务徽章",
        "Advanced Task Badge": "高级任务徽章",
        "Expert Task Badge": "专家任务徽章",
        "Celestial Brush": "星空刷子",
        "Cheese Brush": "奶酪刷子",
        "Verdant Brush": "翠绿刷子",
        "Azure Brush": "蔚蓝刷子",
        "Burble Brush": "深紫刷子",
        "Crimson Brush": "绛红刷子",
        "Rainbow Brush": "彩虹刷子",
        "Holy Brush": "神圣刷子",
        "Celestial Shears": "星空剪刀",
        "Cheese Shears": "奶酪剪刀",
        "Verdant Shears": "翠绿剪刀",
        "Azure Shears": "蔚蓝剪刀",
        "Burble Shears": "深紫剪刀",
        "Crimson Shears": "绛红剪刀",
        "Rainbow Shears": "彩虹剪刀",
        "Holy Shears": "神圣剪刀",
        "Celestial Hatchet": "星空斧头",
        "Cheese Hatchet": "奶酪斧头",
        "Verdant Hatchet": "翠绿斧头",
        "Azure Hatchet": "蔚蓝斧头",
        "Burble Hatchet": "深紫斧头",
        "Crimson Hatchet": "绛红斧头",
        "Rainbow Hatchet": "彩虹斧头",
        "Holy Hatchet": "神圣斧头",
        "Celestial Hammer": "星空锤子",
        "Cheese Hammer": "奶酪锤子",
        "Verdant Hammer": "翠绿锤子",
        "Azure Hammer": "蔚蓝锤子",
        "Burble Hammer": "深紫锤子",
        "Crimson Hammer": "绛红锤子",
        "Rainbow Hammer": "彩虹锤子",
        "Holy Hammer": "神圣锤子",
        "Celestial Chisel": "星空凿子",
        "Cheese Chisel": "奶酪凿子",
        "Verdant Chisel": "翠绿凿子",
        "Azure Chisel": "蔚蓝凿子",
        "Burble Chisel": "深紫凿子",
        "Crimson Chisel": "绛红凿子",
        "Rainbow Chisel": "彩虹凿子",
        "Holy Chisel": "神圣凿子",
        "Celestial Needle": "星空针",
        "Cheese Needle": "奶酪针",
        "Verdant Needle": "翠绿针",
        "Azure Needle": "蔚蓝针",
        "Burble Needle": "深紫针",
        "Crimson Needle": "绛红针",
        "Rainbow Needle": "彩虹针",
        "Holy Needle": "神圣针",
        "Celestial Spatula": "星空锅铲",
        "Cheese Spatula": "奶酪锅铲",
        "Verdant Spatula": "翠绿锅铲",
        "Azure Spatula": "蔚蓝锅铲",
        "Burble Spatula": "深紫锅铲",
        "Crimson Spatula": "绛红锅铲",
        "Rainbow Spatula": "彩虹锅铲",
        "Holy Spatula": "神圣锅铲",
        "Celestial Pot": "星空壶",
        "Cheese Pot": "奶酪壶",
        "Verdant Pot": "翠绿壶",
        "Azure Pot": "蔚蓝壶",
        "Burble Pot": "深紫壶",
        "Crimson Pot": "绛红壶",
        "Rainbow Pot": "彩虹壶",
        "Holy Pot": "神圣壶",
        "Celestial Alembic": "星空蒸馏器",
        "Cheese Alembic": "奶酪蒸馏器",
        "Verdant Alembic": "翠绿蒸馏器",
        "Azure Alembic": "蔚蓝蒸馏器",
        "Burble Alembic": "深紫蒸馏器",
        "Crimson Alembic": "绛红蒸馏器",
        "Rainbow Alembic": "彩虹蒸馏器",
        "Holy Alembic": "神圣蒸馏器",
        "Celestial Enhancer": "星空强化器",
        "Cheese Enhancer": "奶酪强化器",
        "Verdant Enhancer": "翠绿强化器",
        "Azure Enhancer": "蔚蓝强化器",
        "Burble Enhancer": "深紫强化器",
        "Crimson Enhancer": "绛红强化器",
        "Rainbow Enhancer": "彩虹强化器",
        "Holy Enhancer": "神圣强化器",
        "Milk": "牛奶",
        "Verdant Milk": "翠绿牛奶",
        "Azure Milk": "蔚蓝牛奶",
        "Burble Milk": "深紫牛奶",
        "Crimson Milk": "绛红牛奶",
        "Rainbow Milk": "彩虹牛奶",
        "Holy Milk": "神圣牛奶",
        "Cheese": "奶酪",
        "Verdant Cheese": "翠绿奶酪",
        "Azure Cheese": "蔚蓝奶酪",
        "Burble Cheese": "深紫奶酪",
        "Crimson Cheese": "绛红奶酪",
        "Rainbow Cheese": "彩虹奶酪",
        "Holy Cheese": "神圣奶酪",
        "Log": "原木",
        "Birch Log": "白桦原木",
        "Cedar Log": "雪松原木",
        "Purpleheart Log": "紫心原木",
        "Ginkgo Log": "银杏原木",
        "Redwood Log": "红杉原木",
        "Arcane Log": "神秘原木",
        "Lumber": "木板",
        "Birch Lumber": "白桦木板",
        "Cedar Lumber": "雪松木板",
        "Purpleheart Lumber": "紫心木板",
        "Ginkgo Lumber": "银杏木板",
        "Redwood Lumber": "红杉木板",
        "Arcane Lumber": "神秘木板",
        "Rough Hide": "粗糙兽皮",
        "Reptile Hide": "爬行动物皮",
        "Gobo Hide": "哥布林皮",
        "Beast Hide": "野兽皮",
        "Umbral Hide": "暗影皮",
        "Rough Leather": "粗糙皮革",
        "Reptile Leather": "爬行动物皮革",
        "Gobo Leather": "哥布林皮革",
        "Beast Leather": "野兽皮革",
        "Umbral Leather": "暗影皮革",
        "Cotton": "棉花",
        "Flax": "亚麻",
        "Bamboo Branch": "竹子",
        "Cocoon": "蚕茧",
        "Radiant Fiber": "光辉纤维",
        "Cotton Fabric": "棉花布料",
        "Linen Fabric": "亚麻布料",
        "Bamboo Fabric": "竹子布料",
        "Silk Fabric": "丝绸",
        "Radiant Fabric": "光辉布料",
        "Egg": "鸡蛋",
        "Wheat": "小麦",
        "Sugar": "糖",
        "Blueberry": "蓝莓",
        "Blackberry": "黑莓",
        "Strawberry": "草莓",
        "Mooberry": "哞莓",
        "Marsberry": "火星莓",
        "Spaceberry": "太空莓",
        "Apple": "苹果",
        "Orange": "橙子",
        "Plum": "李子",
        "Peach": "桃子",
        "Dragon Fruit": "火龙果",
        "Star Fruit": "杨桃",
        "Arabica Coffee Bean": "低级咖啡豆",
        "Robusta Coffee Bean": "中级咖啡豆",
        "Liberica Coffee Bean": "高级咖啡豆",
        "Excelsa Coffee Bean": "特级咖啡豆",
        "Fieriosa Coffee Bean": "火山咖啡豆",
        "Spacia Coffee Bean": "太空咖啡豆",
        "Green Tea Leaf": "绿茶叶",
        "Black Tea Leaf": "黑茶叶",
        "Burble Tea Leaf": "紫茶叶",
        "Moolong Tea Leaf": "哞龙茶叶",
        "Red Tea Leaf": "红茶叶",
        "Emp Tea Leaf": "虚空茶叶",
        "Catalyst Of Coinification": "点金催化剂",
        "Catalyst Of Decomposition": "分解催化剂",
        "Catalyst Of Transmutation": "转化催化剂",
        "Prime Catalyst": "至高催化剂",
        "Snake Fang": "蛇牙",
        "Shoebill Feather": "鲸头鹳羽毛",
        "Snail Shell": "蜗牛壳",
        "Crab Pincer": "蟹钳",
        "Turtle Shell": "乌龟壳",
        "Marine Scale": "海洋鳞片",
        "Treant Bark": "树皮",
        "Centaur Hoof": "半人马蹄",
        "Luna Wing": "月神翼",
        "Gobo Rag": "哥布林抹布",
        "Goggles": "护目镜",
        "Magnifying Glass": "放大镜",
        "Eye Of The Watcher": "观察者之眼",
        "Icy Cloth": "冰霜织物",
        "Flaming Cloth": "烈焰织物",
        "Sorcerer's Sole": "魔法师鞋底",
        "Chrono Sphere": "时空球",
        "Frost Sphere": "冰霜球",
        "Panda Fluff": "熊猫绒",
        "Black Bear Fluff": "黑熊绒",
        "Grizzly Bear Fluff": "棕熊绒",
        "Polar Bear Fluff": "北极熊绒",
        "Red Panda Fluff": "小熊猫绒",
        "Magnet": "磁铁",
        "Stalactite Shard": "钟乳石碎片",
        "Living Granite": "花岗岩",
        "Colossus Core": "巨像核心",
        "Vampire Fang": "吸血鬼之牙",
        "Werewolf Claw": "狼人之爪",
        "Revenant Anima": "亡者之魂",
        "Soul Fragment": "灵魂碎片",
        "Infernal Ember": "地狱余烬",
        "Demonic Core": "恶魔核心",
        "Griffin Leather": "狮鹫之皮",
        "Manticore Sting": "蝎狮之刺",
        "Jackalope Antler": "鹿角兔之角",
        "Dodocamel Plume": "渡渡驼之翎",
        "Griffin Talon": "狮鹫之爪",
        "Acrobat's Ribbon": "杂技师彩带",
        "Magician's Cloth": "魔术师织物",
        "Chaotic Chain": "混沌锁链",
        "Cursed Ball": "诅咒之球",
        "Royal Cloth": "皇家织物",
        "Knight's Ingot": "骑士之锭",
        "Bishop's Scroll": "主教卷轴",
        "Regal Jewel": "君王宝石",
        "Sundering Jewel": "裂空宝石",
        "Marksman Brooch": "神射胸针",
        "Corsair Crest": "掠夺者徽章",
        "Damaged Anchor": "破损船锚",
        "Maelstrom Plating": "怒涛甲片",
        "Kraken Leather": "克拉肯皮革",
        "Kraken Fang": "克拉肯之牙",
        "Butter Of Proficiency": "精通之油",
        "Thread Of Expertise": "专精之线",
        "Branch Of Insight": "洞察之枝",
        "Gluttonous Energy": "贪食能量",
        "Guzzling Energy": "暴饮能量",
        "Milking Essence": "挤奶精华",
        "Foraging Essence": "采摘精华",
        "Woodcutting Essence": "伐木精华",
        "Cheesesmithing Essence": "奶酪锻造精华",
        "Crafting Essence": "制作精华",
        "Tailoring Essence": "缝纫精华",
        "Cooking Essence": "烹饪精华",
        "Brewing Essence": "冲泡精华",
        "Alchemy Essence": "炼金精华",
        "Enhancing Essence": "强化精华",
        "Swamp Essence": "沼泽精华",
        "Aqua Essence": "海洋精华",
        "Jungle Essence": "丛林精华",
        "Gobo Essence": "哥布林精华",
        "Eyessence": "眼精华",
        "Sorcerer Essence": "法师精华",
        "Bear Essence": "熊熊精华",
        "Golem Essence": "魔像精华",
        "Twilight Essence": "暮光精华",
        "Abyssal Essence": "地狱精华",
        "Chimerical Essence": "奇幻精华",
        "Sinister Essence": "阴森精华",
        "Enchanted Essence": "秘法精华",
        "Pirate Essence": "海盗精华",
        "Task Crystal": "任务水晶",
        "Star Fragment": "星光碎片",
        "Pearl": "珍珠",
        "Amber": "琥珀",
        "Garnet": "石榴石",
        "Jade": "翡翠",
        "Amethyst": "紫水晶",
        "Moonstone": "月亮石",
        "Sunstone": "太阳石",
        "Philosopher's Stone": "贤者之石",
        "Crushed Pearl": "珍珠碎片",
        "Crushed Amber": "琥珀碎片",
        "Crushed Garnet": "石榴石碎片",
        "Crushed Jade": "翡翠碎片",
        "Crushed Amethyst": "紫水晶碎片",
        "Crushed Moonstone": "月亮石碎片",
        "Crushed Sunstone": "太阳石碎片",
        "Crushed Philosopher's Stone": "贤者之石碎片",
        "Shard Of Protection": "保护碎片",
        "Mirror Of Protection": "保护之镜"
    }


    let specialItemPrices = {
        'Coin': { ask: 1, bid: 1 }, // 默认的特殊物品价值，包括 ask 和 bid 价值
        'Chimerical Token': {
            ask: getSpecialItemPrice('Chimerical Essence', 'ask') || 600,
            bid: getSpecialItemPrice('Chimerical Essence', 'bid') || 600
        },
        'Sinister Token': {
            ask: getSpecialItemPrice('Sinister Essence', 'ask') || 900,
            bid: getSpecialItemPrice('Sinister Essence', 'bid') || 900
        },
        'Enchanted Token': {
            ask: getSpecialItemPrice('Enchanted Essence', 'ask') || 2000,
            bid: getSpecialItemPrice('Enchanted Essence', 'bid') || 2000
        },
        'Pirate Token': {
            ask: getSpecialItemPrice('Pirate Essence', 'ask') || 4000,
            bid: getSpecialItemPrice('Pirate Essence', 'bid') || 4000
        },
    };

    const chestCosts = {
        "Chimerical Chest": {
            keyAsk: getSpecialItemPrice('Chimerical Chest Key', 'ask') || 3000e3,
            keyBid: getSpecialItemPrice('Chimerical Chest Key', 'bid') || 3000e3,
            entryAsk: getSpecialItemPrice('Chimerical Entry Key', 'ask') || 280e3,
            entryBid: getSpecialItemPrice('Chimerical Entry Key', 'bid') || 280e3
        },
        "Sinister Chest": {
            keyAsk: getSpecialItemPrice('Sinister Chest Key', 'ask') || 5600e3,
            keyBid: getSpecialItemPrice('Sinister Chest Key', 'bid') || 5400e3,
            entryAsk: getSpecialItemPrice('Sinister Entry Key', 'ask') || 300e3,
            entryBid: getSpecialItemPrice('Sinister Entry Key', 'bid') || 280e3
        },
        "Enchanted Chest": {
            keyAsk: getSpecialItemPrice('Enchanted Chest Key', 'ask') || 7600e3,
            keyBid: getSpecialItemPrice('Enchanted Chest Key', 'bid') || 7200e3,
            entryAsk: getSpecialItemPrice('Enchanted Entry Key', 'ask') || 360e3,
            entryBid: getSpecialItemPrice('Enchanted Entry Key', 'bid') || 360e3
        },
        "Pirate Chest": {
            keyAsk: getSpecialItemPrice('Pirate Chest Key', 'ask') || 9400e3,
            keyBid: getSpecialItemPrice('Pirate Chest Key', 'bid') || 92000e3,
            entryAsk: getSpecialItemPrice('Pirate Entry Key', 'ask') || 460e3,
            entryBid: getSpecialItemPrice('Pirate Entry Key', 'bid') || 440e3
        }
    };

    const auraAbilities = new Set([
        'revive',
        'insanity',
        'invincible',
        'fierce_aura',
        'aqua_aura',
        'sylvan_aura',
        'flame_aura',
        'speed_aura',
        'critical_aura'
    ]);

    //公会部分代码
    const updataDealy = 24*60*60*1000; //数据更新时限
    let rateXPDayMap = {};

    async function fetchMarketData() {
        return new Promise((resolve, reject) => {
            GM.xmlHttpRequest({
                method: 'GET',
                url: MARKET_API_URL,
                responseType: 'json',
                timeout: 5000,
                onload: function(response) {
                    if (response.status === 200) {
                        const data = JSON.parse(response.responseText);
                        console.log('从API获取到的数据:', data);
                        resolve(data);
                    } else {
                        console.error('获取数据失败。状态码:', response.status);
                        reject(new Error('数据获取失败'));
                    }
                },
                ontimeout: function() {
                    console.error('请求超时：超过5秒未能获取到数据');
                    reject(new Error('请求超时'));
                },
                onerror: function(error) {
                    console.error('获取数据时发生错误:', error);
                    reject(error);
                }
            });
        });
    }

    hookWS();
    initObserver();

    try {
        // 尝试从 API 获取数据
        marketData = await fetchMarketData();
        marketData.market.Coin.ask = 1;
        marketData.market.Coin.bid = 1;
    } catch (error) {
        console.error('从 API 获取数据失败，尝试从本地存储获取数据。', error);

        // 从本地存储获取数据
        const marketDataStr = localStorage.getItem('MWITools_marketAPI_json');
        marketData = JSON.parse(marketDataStr);

        if (!marketData) {
            alert('无法获取 market 数据');
        } else {
            console.log('从本地存储获取到的数据:', marketData);
        }
    }

    function getSpecialItemPrice(itemName, priceType) {
        if (marketData?.market?.[itemName]) {
            const itemPrice = marketData.market[itemName][priceType];
            if (itemPrice !== undefined && itemPrice !== -1) {
                return itemPrice;
            } else if (specialItemPrices?.[itemName]) {
                const itemPrice = specialItemPrices[itemName][priceType];
                if (itemPrice !== undefined && itemPrice !== -1) {
                    return itemPrice;
                }
            }
        } else if (specialItemPrices?.[itemName]) {
            const itemPrice = specialItemPrices[itemName][priceType];
            if (itemPrice !== undefined && itemPrice !== -1) {
                return itemPrice;
            }
        }
        console.error(`未找到物品 ${itemName} 的 ${priceType} 价格信息`);
        return null;
    }

    function getItemNameFromElement(element) {
        const itemNameRaw = element.getAttribute('href').split('#').pop();
        return formatItemName(itemNameRaw);
    }

    function formatItemName(itemNameRaw) {
        return item_hrid_to_name[`/items/${itemNameRaw}`]
    }


    function formatPrice(value,n = 1) {
        const isNegative = value < 0;
        value = Math.abs(value);
        if (value >= 1e13 / n) {
            return (isNegative ? '-' : '') + (value / 1e12).toFixed(1) + 'T';
        } else if (value >= 1e10 / n) {
            return (isNegative ? '-' : '') + (value / 1e9).toFixed(1) + 'B';
        } else if (value >= 1e7 / n) {
            return (isNegative ? '-' : '') + (value / 1e6).toFixed(1) + 'M';
        } else if (value >= 1e4 / n) {
            return (isNegative ? '-' : '') + (value / 1e3).toFixed(1) + 'K';
        } else {
            return (isNegative ? '-' : '') + value.toFixed(0);
        }
    }


    function parseQuantityString(quantityStr) {
        const suffix = quantityStr.slice(-1);
        const base = parseFloat(quantityStr.slice(0, -1));
        if (suffix === 'K') {
            return base * 1000;
        } else if (suffix === 'M') {
            return base * 1000000;
        } else if (suffix === 'B') {
            return base * 1000000000;
        } else {
            return parseFloat(quantityStr);
        }
    }

    function recordChestOpening(modalElement) {
        if (document.querySelector('.ChestStatistics')) {
            return;
        }

        // 从本地存储读取数据
        let edibleTools = JSON.parse(localStorage.getItem('Edible_Tools')) || {};
        edibleTools.Chest_Open_Data = edibleTools.Chest_Open_Data || {};

        // 确保当前玩家的开箱数据结构存在
        if (!currentPlayerID || !currentPlayerName) {
            console.error("无法获取当前玩家的 ID 或昵称");
            return;
        }
        edibleTools.Chest_Open_Data[currentPlayerID] = edibleTools.Chest_Open_Data[currentPlayerID] || {
            玩家昵称: currentPlayerName,
            开箱数据: {}
        };

        let chestOpenData = edibleTools.Chest_Open_Data[currentPlayerID].开箱数据;
        const chestDropData = edibleTools.Chest_Drop_Data;

        const chestNameElement = modalElement.querySelector("div.Modal_modal__1Jiep > div.Inventory_modalContent__3ObSx > div.Item_itemContainer__x7kH1 > div > div > div.Item_iconContainer__5z7j4 > svg > use");
        const chestCountElement = modalElement.querySelector("div.Modal_modal__1Jiep > div.Inventory_modalContent__3ObSx > div.Item_itemContainer__x7kH1 > div > div > div.Item_count__1HVvv");

        if (chestNameElement && chestCountElement) {
            const chestName = getItemNameFromElement(chestNameElement);
            chestOpenData[chestName] = chestOpenData[chestName] || {};
            let chestData = chestOpenData[chestName];
            const chestCount = parseQuantityString(chestCountElement.textContent.trim());
            chestData["总计开箱数量"] = (chestData["总计开箱数量"] || 0) + chestCount;
            chestData["获得物品"] = chestData["获得物品"] || {};
            const itemsContainer = modalElement.querySelector('.Inventory_gainedItems___e9t9');
            const itemElements = itemsContainer.querySelectorAll('.Item_itemContainer__x7kH1');

            let totalAskValue = 0;
            let totalBidValue = 0;

            itemElements.forEach(itemElement => {
                const itemNameElement = itemElement.querySelector('.Item_iconContainer__5z7j4 use');
                const itemQuantityElement = itemElement.querySelector('.Item_count__1HVvv');

                if (itemNameElement && itemQuantityElement) {
                    const itemName = getItemNameFromElement(itemNameElement);
                    const itemQuantity = parseQuantityString(itemQuantityElement.textContent.trim());

                    const itemData = chestDropData[chestName].item[itemName] || {};
                    const itemAskValue = itemData["出售单价"] || 0;
                    const itemBidValue = itemData["收购单价"] || 0;
                    const color = itemData.Color || '';

                    itemQuantityElement.style.color = color;

                    const itemOpenTotalAskValue = itemAskValue * itemQuantity;
                    const itemOpenTotalBidValue = itemBidValue * itemQuantity;

                    chestData["获得物品"][itemName] = chestData["获得物品"][itemName] || {};
                    chestData["获得物品"][itemName]["数量"] = (chestData["获得物品"][itemName]["数量"] || 0) + itemQuantity;
                    chestData["获得物品"][itemName]["总计Ask价值"] = (chestData["获得物品"][itemName]["总计Ask价值"] || 0) + itemOpenTotalAskValue;
                    chestData["获得物品"][itemName]["总计Bid价值"] = (chestData["获得物品"][itemName]["总计Bid价值"] || 0) + itemOpenTotalBidValue;

                    totalAskValue += itemOpenTotalAskValue;
                    totalBidValue += itemOpenTotalBidValue;
                }
            });

            chestData["总计开箱Ask"] = (chestData["总计开箱Ask"] || 0) + totalAskValue;
            chestData["总计开箱Bid"] = (chestData["总计开箱Bid"] || 0) + totalBidValue;

            // 计算本次开箱的偏差值
            const differenceValue = totalBidValue - chestDropData[chestName]["期望产出Bid"] * chestCount;

            // 更新累计偏差值
            chestData["累计偏差值"] = (chestData["累计偏差值"] || 0) + differenceValue;

            // 地牢开箱
            let profitRange = null;
            let profitColor = 'lime'; // 默认颜色

            if (chestCosts[chestName]) {
                const { keyAsk, keyBid, entryAsk, entryBid } = chestCosts[chestName];
                const minProfit = totalBidValue - (keyAsk + entryAsk) * chestCount;
                const maxProfit = totalAskValue - (keyBid + entryBid) * chestCount;
                profitRange = `${formatPrice(minProfit)}～${formatPrice(maxProfit)}`;

                chestData["总计最高利润"] = (chestData["总计最高利润"] || 0) + maxProfit;
                chestData["总计最低利润"] = (chestData["总计最低利润"] || 0) + minProfit;

                if (minProfit > 0 && maxProfit > 0) {
                    profitColor = 'lime';
                } else if (minProfit < 0 && maxProfit < 0) {
                    profitColor = 'red';
                } else {
                    profitColor = 'orange';
                }
            }

            // 显示
            const openChestElement = document.querySelector('.Inventory_modalContent__3ObSx');

            const displayElement = document.createElement('div');
            displayElement.classList.add('ChestStatistics');
            displayElement.style.position = 'absolute';
            displayElement.style.left = `${openChestElement.offsetLeft}px`;
            displayElement.style.top = `${openChestElement.offsetTop}px`;
            displayElement.style.fontSize = '12px';
            displayElement.innerHTML = `
            总计开箱次数:<br>
            ${chestData["总计开箱数量"]}<br>
            本次开箱价值:<br>
            ${formatPrice(totalAskValue)}/${formatPrice(totalBidValue)}<br>
            总计开箱价值:<br>
            ${formatPrice(chestData["总计开箱Ask"])}/${formatPrice(chestData["总计开箱Bid"])}<br>
        `;

            const expectedOutputElement = document.createElement('div');
            expectedOutputElement.classList.add('ExpectedOutput');
            expectedOutputElement.style.position = 'absolute';
            expectedOutputElement.style.left = `${openChestElement.offsetLeft}px`;
            expectedOutputElement.style.bottom = `${openChestElement.offsetTop}px`;
            expectedOutputElement.style.fontSize = '12px';
            expectedOutputElement.innerHTML = `
            预计产出价值:<br>
            ${formatPrice(chestDropData[chestName]["期望产出Ask"]*chestCount)}/${formatPrice(chestDropData[chestName]["期望产出Bid"]*chestCount)}<br>
        `;

            const differenceOutputElement = document.createElement('div');
            differenceOutputElement.classList.add('DifferenceOutput');
            differenceOutputElement.style.position = 'absolute';
            differenceOutputElement.style.right = `${openChestElement.offsetLeft}px`;
            differenceOutputElement.style.bottom = `${openChestElement.offsetTop}px`;
            differenceOutputElement.style.fontSize = '12px';
            differenceOutputElement.style.color = differenceValue > 0 ? 'lime' : 'red';
            differenceOutputElement.innerHTML = `
            ${differenceValue > 0 ? '高于期望价值:' : '低于期望价值:'}<br>
            ${formatPrice(Math.abs(differenceValue))}<br>
        `;

            // 创建并显示累计偏差值的元素
            const cumulativeDifferenceElement = document.createElement('div');
            cumulativeDifferenceElement.classList.add('CumulativeDifference');
            cumulativeDifferenceElement.style.position = 'absolute';
            cumulativeDifferenceElement.style.right = `${openChestElement.offsetLeft}px`;
            cumulativeDifferenceElement.style.top = `${openChestElement.offsetTop}px`;
            cumulativeDifferenceElement.style.fontSize = '12px';
            cumulativeDifferenceElement.style.color = chestData["累计偏差值"] > 0 ? 'lime' : 'red';
            cumulativeDifferenceElement.innerHTML = `
            <br><br>
            <span style="color: ${profitColor};">本次开箱利润</span><br>
            ${profitRange ? `<span style="color: ${profitColor};">${profitRange}</span>` : `<span style="color: ${profitColor};">${formatPrice(totalAskValue)}/${formatPrice(totalBidValue)}</span>`}<br>
            累计${chestData["累计偏差值"] > 0 ? '高于期望:' : '低于期望:'}<br>
            ${formatPrice(Math.abs(chestData["累计偏差值"]))}<br>
            `;

            openChestElement.appendChild(displayElement);
            openChestElement.appendChild(expectedOutputElement);
            openChestElement.appendChild(differenceOutputElement);
            openChestElement.appendChild(cumulativeDifferenceElement);

            // 保存更新的数据到本地存储
            localStorage.setItem('Edible_Tools', JSON.stringify(edibleTools));
        }
    }


    function calculateTotalValues(itemElements) {
        let totalAskValue = 0;
        let totalBidValue = 0;

        itemElements.forEach(itemElement => {
            const itemNameElement = itemElement.querySelector('.Item_iconContainer__5z7j4 use');
            const itemQuantityElement = itemElement.querySelector('.Item_count__1HVvv');

            if (itemNameElement && itemQuantityElement) {
                const itemName = getItemNameFromElement(itemNameElement);
                const itemQuantity = parseQuantityString(itemQuantityElement.textContent.trim());

                let askPrice = 0;
                let bidPrice = 0;
                let priceColor = '';

                // 获取价格
                if (specialItemPrices[itemName] && specialItemPrices[itemName].ask) {
                    askPrice = parseFloat(specialItemPrices[itemName].ask);
                    bidPrice = parseFloat(specialItemPrices[itemName].bid);
                    priceColor = '';
                } else if (marketData?.market?.[itemName]) {
                    bidPrice = marketData.market[itemName].bid;
                    askPrice = marketData.market[itemName].ask;
                } else {
                    console.log(`${itemName} 的价格未找到`);
                }
                const itemTotalAskValue = askPrice * itemQuantity;
                const itemTotalBidValue = bidPrice * itemQuantity;
                totalAskValue += itemTotalAskValue;
                totalBidValue += itemTotalBidValue;
            }
        });

        //console.log(totalAskValue);
        return { totalAskValue, totalBidValue };
    }

    //更详细的战斗等级显示
    const updateCombatLevel = () => {
        const elements = document.querySelectorAll(".NavigationBar_currentExperience__3GDeX");

        if (elements.length === 17) {
            const levels = Array.from(elements).slice(10, 17).map(el => {
                const levelText = parseInt(el.parentNode.parentNode.querySelector(".NavigationBar_textContainer__7TdaI .NavigationBar_level__3C7eR").textContent);
                const decimalPart = parseFloat(el.style.width) / 100;
                return { integerPart: levelText, decimalPart: decimalPart };
            });

            let [endurance, intelligence, attack, strength, defense, ranged, magic] = levels;

            let combatTypeMax = Math.max(
                0.5 * (attack.integerPart + strength.integerPart),
                ranged.integerPart,
                magic.integerPart
            );

            if (combatTypeMax !== 0.5 * (attack.integerPart + strength.integerPart)) {
                attack.decimalPart = 0;
                strength.decimalPart = 0;
            }
            if (combatTypeMax !== ranged.integerPart) ranged.decimalPart = 0;
            if (combatTypeMax !== magic.integerPart) magic.decimalPart = 0;

            let combatLevel = 0.2 * (endurance.integerPart + intelligence.integerPart + defense.integerPart) + 0.4 * combatTypeMax;
            combatLevel = parseFloat(combatLevel.toFixed(2));
            //console.log("combatLevel",combatLevel)
            const integerPart = Math.floor(combatLevel);
            const decimalPart = combatLevel - integerPart;
            //console.log("integerPart",integerPart)
            const list1 = [
                endurance.decimalPart * 0.2,
                intelligence.decimalPart * 0.2,
                attack.decimalPart * 0.2,
                strength.decimalPart * 0.2,
                defense.decimalPart * 0.2,
                ranged.decimalPart * 0.2,
                magic.decimalPart * 0.2
            ];

            const list2 = [
                endurance.decimalPart * 0.2,
                intelligence.decimalPart * 0.2,
                attack.decimalPart * 0.2,
                strength.decimalPart * 0.2,
                defense.decimalPart * 0.2,
                ranged.decimalPart * 0.2,
                magic.decimalPart * 0.2,
                ranged.decimalPart * 0.2,
                magic.decimalPart * 0.2
            ];
            //console.log("list1",list1,"\nlist2",list2)
            list1.sort((a, b) => b - a);
            list2.sort((a, b) => b - a);

            if (decimalPart === 0.8) {
                combatLevel += list1[0];
            } else {
                let total = 0;
                const maxIterations = Math.floor((1 - decimalPart) / 0.2);
                let iterations = 0;

                for (const i of list2) {
                    if (iterations >= maxIterations) break;

                    if ((decimalPart + total + i) < 1) {
                        total += i;
                    } else {
                        break;
                    }

                    iterations++;
                }
                combatLevel = decimalPart + integerPart + total;
            }

            elements[15].parentNode.parentNode.parentNode.parentNode.parentNode.querySelector(".NavigationBar_nav__3uuUl .NavigationBar_level__3C7eR").textContent = combatLevel.toFixed(2);
        }
    };
    window.setInterval(updateCombatLevel, 10000);

    function OfflineStatistics(modalElement) {
        const itemsContainer = modalElement.querySelectorAll(".OfflineProgressModal_itemList__26h-Y");

        let timeContainer = null;
        let getItemContainer = null;
        let spendItemContainer = null;


        itemsContainer.forEach(container => {
            const labelElement = container.querySelector('.OfflineProgressModal_label__2HwFG');
            if (labelElement) {
                const textContent = labelElement.textContent.trim();
                if (textContent.startsWith("Offline duration") || textContent.startsWith("你离线了") || textContent.startsWith("离线时间")) {
                    timeContainer = container;
                } else if (textContent.startsWith("Items gained") || textContent.startsWith("获得物品:") || textContent.startsWith("获得物品")) {
                    getItemContainer = container;
                } else if (textContent.startsWith("Items consumed") || textContent.startsWith("你消耗了:") || textContent.startsWith("消耗物品")) {
                    spendItemContainer = container;
                }
            }
        });

        let TotalSec = null;
        if (timeContainer) {
            const textContent = timeContainer.textContent;
            const match = textContent.match(/(?:(\d+)d\s*)?(?:(\d+)h\s*)?(?:(\d+)m\s*)?(?:(\d+)s)/);
            if (match) {
                let days = parseInt(match[1], 10) || 0;
                let hours = parseInt(match[2], 10) || 0;
                let minutes = parseInt(match[3], 10) || 0;
                let seconds = parseInt(match[4], 10) || 0;
                TotalSec = days * 86400 + hours * 3600 + minutes * 60 + seconds;
            }
        }

        let getitemtotalAskValue = 0;
        let getitemtotalBidValue = 0;
        if (getItemContainer) {
            const getitemElements = getItemContainer.querySelectorAll('.Item_itemContainer__x7kH1');
            const { totalAskValue, totalBidValue } = calculateTotalValues(getitemElements);
            getitemtotalAskValue = totalAskValue;
            getitemtotalBidValue = totalBidValue;
        }


        let spenditemtotalAskValue = 0;
        let spenditemtotalBidValue = 0;
        if (spendItemContainer) {
            const spenditemElements = spendItemContainer.querySelectorAll('.Item_itemContainer__x7kH1');
            const { totalAskValue, totalBidValue } = calculateTotalValues(spenditemElements);
            spenditemtotalAskValue = totalAskValue;
            spenditemtotalBidValue = totalBidValue;
        }

        if (timeContainer) {
            const newElement = document.createElement('span');
            newElement.textContent = `利润: ${formatPrice(getitemtotalBidValue - spenditemtotalAskValue,10)} [${formatPrice((getitemtotalBidValue - spenditemtotalAskValue) / (TotalSec / 3600) * 24,10)}/天]`;
            newElement.style.color = 'gold';
            newElement.style.whiteSpace = 'nowrap';
            newElement.style.marginLeft = 'auto';
            timeContainer.querySelector(':first-child').appendChild(newElement);
        }
        if (getItemContainer) {
            const newElement = document.createElement('span');
            newElement.textContent = `产出:[${formatPrice(getitemtotalAskValue)}/${formatPrice(getitemtotalBidValue)}]`;
            newElement.style.float = 'right';
            newElement.style.color = 'gold';
            newElement.style.whiteSpace = 'nowrap';
            getItemContainer.querySelector(':first-child').appendChild(newElement);
        }
        if (spendItemContainer) {
            const newElement = document.createElement('span');
            newElement.textContent = `成本:[${formatPrice(spenditemtotalAskValue)}/${formatPrice(spenditemtotalBidValue)}]`;
            newElement.style.float = 'right';
            newElement.style.color = 'gold';
            newElement.style.whiteSpace = 'nowrap';
            spendItemContainer.querySelector(':first-child').appendChild(newElement);
        }
    }


    function initObserver() {
        // 选择要观察的目标节点
        const targetNode = document.body;

        // 观察器的配置（需要观察子节点的变化）
        const config = { childList: true, subtree: true };

        // 创建一个观察器实例并传入回调函数
        const observer = new MutationObserver(mutationsList => {
            for (let mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    // 监听到子节点变化
                    mutation.addedNodes.forEach(addedNode => {
                        // 检查是否是我们关注的 Modal_modalContainer__3B80m 元素被添加
                        if (addedNode.classList && addedNode.classList.contains('Modal_modalContainer__3B80m')) {
                            // Modal_modalContainer__3B80m 元素被添加，执行处理函数
                            //console.log("箱子被打开")
                            ShowChestPrice();
                            recordChestOpening(addedNode);

                            // 开始监听箱子图标的变化
                            startIconObserver();
                        }
                        if (addedNode.classList && addedNode.classList.contains('OfflineProgressModal_modalContainer__knnk7')) {
                            OfflineStatistics(addedNode);
                            console.log("离线报告已创建!")
                        }
                        if (addedNode.classList && addedNode.classList.contains('MainPanel_subPanelContainer__1i-H9')) {
                            if (addedNode.querySelector(".CombatPanel_combatPanel__QylPo")) {
                                addBattlePlayerFoodButton();
                                addBattlePlayerLootButton();
                            } else if (addedNode.querySelector('.EnhancingPanel_enhancingPanel__ysWpV')) {
                                updateEnhancementUI();
                            }
                        }

                    });

                    mutation.removedNodes.forEach(removedNode => {
                        // 检查是否是 Modal_modalContainer__3B80m 元素被移除
                        if (removedNode.classList && removedNode.classList.contains('Modal_modalContainer__3B80m')) {
                            // Modal_modalContainer__3B80m 元素被移除，停止监听箱子图标的变化
                            stopIconObserver();
                        }
                    });
                }
            }
        });

        // 以上述配置开始观察目标节点
        observer.observe(targetNode, config);

        // 定义箱子图标变化的观察器
        let iconObserver = null;

        // 开始监听箱子图标的变化
        function startIconObserver() {
            const chestNameElem = document.querySelector(chestNameSelector);
            if (!chestNameElem) return;

            // 创建一个观察器实例来监听图标的变化
            iconObserver = new MutationObserver(() => {
                // 当箱子图标变化时，执行处理函数
                ShowChestPrice();
            });

            // 配置观察器的选项
            const iconConfig = { attributes: true, attributeFilter: ['href'] };

            // 以上述配置开始观察箱子图标节点
            iconObserver.observe(chestNameElem, iconConfig);
        }

        // 停止监听箱子图标的变化
        function stopIconObserver() {
            if (iconObserver) {
                iconObserver.disconnect();
                iconObserver = null;
            }
        }
    }

    function hookWS() {
        const dataProperty = Object.getOwnPropertyDescriptor(MessageEvent.prototype, "data");
        const oriGet = dataProperty.get;

        dataProperty.get = hookedGet;
        Object.defineProperty(MessageEvent.prototype, "data", dataProperty);

        function hookedGet() {
            const socket = this.currentTarget;
            if (!(socket instanceof WebSocket)) {
                return oriGet.call(this);
            }
            if (socket.url.indexOf("api.milkywayidle.com/ws") <= -1 && socket.url.indexOf("api-test.milkywayidle.com/ws") <= -1) {
                return oriGet.call(this);
            }

            const message = oriGet.call(this);
            Object.defineProperty(this, "data", { value: message }); // Anti-loop

            return handleMessage(message);
        }
    }

    function addStatisticsButton() {
        const waitForNavi = () => {
            const targetNode = document.querySelector("div.NavigationBar_minorNavigationLinks__dbxh7");
            if (targetNode) {
                // 创建统计窗口按钮
                let statsButton = document.createElement("div");
                statsButton.setAttribute("class", "NavigationBar_minorNavigationLink__31K7Y");
                statsButton.style.color = "gold";
                statsButton.innerHTML = isCN ? "开箱统计" : "Chest Statistics";
                statsButton.addEventListener("click", () => {
                    const edibleTools = JSON.parse(localStorage.getItem('Edible_Tools')) || {};
                    const openChestData = edibleTools.Chest_Open_Data || {};
                    createVisualizationWindow(openChestData);
                });

                // 创建食用工具按钮
                let edibleToolsButton = document.createElement("div");
                edibleToolsButton.setAttribute("class", "NavigationBar_minorNavigationLink__31K7Y");
                edibleToolsButton.style.color = "gold";
                edibleToolsButton.innerHTML = isCN ? "食用工具" : "Edible Tools";
                edibleToolsButton.addEventListener("click", () => {
                    openSettings();
                });

                // 将按钮添加到目标节点
                targetNode.insertAdjacentElement("afterbegin", statsButton);
                targetNode.insertAdjacentElement("afterbegin", edibleToolsButton);

                //获取图标url格式模板
                item_icon_url = document.querySelector("div[class^='Item_itemContainer'] use")?.getAttribute("href")?.split("#")[0];

                addBattlePlayerFoodButton();
                addBattlePlayerLootButton();
            } else {
                setTimeout(waitForNavi, 200);
            }
        };

        waitForNavi(); // 开始等待目标节点出现
    }



    //奶牛钉钉
    function handleMessage(message) {
        try {
            let obj = JSON.parse(message);
            if (obj && obj.type === "new_battle") {
                processCombatConsumables(obj);
            } else if (obj && obj.type === "init_character_data") {
                now_battle_map = undefined;
                processCombatConsumablesRunCount = 0;
                processCharacterData(obj);
                addStatisticsButton();
                update_market_list(obj);
            } else if (obj && obj.type === "action_completed" && obj.endCharacterAction) {
                const actionHrid = obj.endCharacterAction.actionHrid;
                if (actionHrid === "/actions/enhancing/enhance") {
                    processEnhancementData(obj);
                } else if (actionHrid.startsWith("/actions/combat/")) {
                    now_battle_map = actionHrid;
                }
            } else if (obj && obj.type === "guild_updated") {
                const Guild_ID = obj.guild.id;
                const edibleTools = JSON.parse(localStorage.getItem('Edible_Tools')) || {};
                edibleTools.Guild_Data = edibleTools.Guild_Data || {};
                let storedData = edibleTools.Guild_Data || {};

                // 判断是否已经存在旧数据
                if (storedData[Guild_ID] && storedData[Guild_ID].guild_updated && storedData[Guild_ID].guild_updated.old.updatedAt) {
                    const oldUpdatedAt = new Date(storedData[Guild_ID].guild_updated.new.updatedAt);
                    const newUpdatedAt = new Date(obj.guild.updatedAt);

                    // 计算时间差（单位：毫秒）
                    const timeDifference = newUpdatedAt - oldUpdatedAt;

                    if (timeDifference >= updataDealy) {
                        // 更新老数据为新数据
                        storedData[Guild_ID].guild_updated.old = storedData[Guild_ID].guild_updated.new;
                        // 更新新数据为当前数据
                        storedData[Guild_ID].guild_updated.new = {
                            experience: obj.guild.experience,
                            level: obj.guild.level,
                            updatedAt: obj.guild.updatedAt
                        };
                    } else {
                        // 仅更新新数据
                        storedData[Guild_ID].guild_updated.new = {
                            experience: obj.guild.experience,
                            level: obj.guild.level,
                            updatedAt: obj.guild.updatedAt
                        };
                    }
                    //计算Δ
                    const Delta = {
                        Delta_Xp: storedData[Guild_ID].guild_updated.new.experience - storedData[Guild_ID].guild_updated.old.experience,
                        Delta_Level: storedData[Guild_ID].guild_updated.new.level - storedData[Guild_ID].guild_updated.old.level,
                        Delta_Time: (newUpdatedAt - new Date(storedData[Guild_ID].guild_updated.old.updatedAt)) / 1000, // 转换为秒
                        Rate_XP_Hours: (3600*(obj.guild.experience - storedData[Guild_ID].guild_updated.old.experience)/((newUpdatedAt - new Date(storedData[Guild_ID].guild_updated.old.updatedAt)) / 1000)).toFixed(2)
                    };
                    storedData[Guild_ID].guild_updated.Delta = Delta;

                    const Guild_TotalXp_div = document.querySelectorAll(".GuildPanel_value__Hm2I9")[1];
                    if (Guild_TotalXp_div) {
                        const xpText = isCN ? "经验值 / 小时" : "XP / Hour";

                        Guild_TotalXp_div.insertAdjacentHTML(
                            "afterend",
                            `<div>${formatPrice(Delta.Rate_XP_Hours)} ${xpText}</div>`
                        );
                        const Guild_NeedXp_div = document.querySelectorAll(".GuildPanel_value__Hm2I9")[2];
                        if (Guild_NeedXp_div) {
                            const Guild_NeedXp = document.querySelectorAll(".GuildPanel_value__Hm2I9")[2].textContent.replace(/,/g, '');
                            const Time = TimeReset(Guild_NeedXp/Delta.Rate_XP_Hours);
                            Guild_NeedXp_div.insertAdjacentHTML(
                                "afterend", // 使用 "afterend" 在元素的后面插入内容
                                `<div>${Time}</div>`
                        );
                        }
                    }
                } else {
                    // 如果没有旧数据，则直接添加新数据
                    storedData[Guild_ID] = {
                        guild_name: obj.guild.name,
                        guild_updated: {
                            old: {
                                experience: obj.guild.experience,
                                level: obj.guild.level,
                                updatedAt: obj.guild.updatedAt
                            },
                            new: {},
                        }
                    };
                }

                // 存储更新后的数据到 localStorage
                edibleTools.Guild_Data = storedData;
                localStorage.setItem('Edible_Tools', JSON.stringify(edibleTools));
            } else if (obj && obj.type === "guild_characters_updated") {
                const edibleTools = JSON.parse(localStorage.getItem('Edible_Tools')) || {};
                edibleTools.Guild_Data = edibleTools.Guild_Data || {};
                let storedData = edibleTools.Guild_Data || {};
                for (const key in obj.guildSharableCharacterMap) {
                    if (obj.guildSharableCharacterMap.hasOwnProperty(key)) {
                        const Guild_ID = obj.guildCharacterMap[key].guildID;
                        const name = obj.guildSharableCharacterMap[key].name;
                        const newUpdatedAt = new Date();
                        storedData[Guild_ID].guild_player = storedData[Guild_ID].guild_player || {};
                        if (storedData[Guild_ID] && storedData[Guild_ID].guild_player && storedData[Guild_ID].guild_player[name] && storedData[Guild_ID].guild_player[name].old && storedData[Guild_ID].guild_player[name].old.updatedAt) {
                            const oldUpdatedAt = new Date(storedData[Guild_ID].guild_player[name].old.updatedAt)
                            const timeDifference = newUpdatedAt - oldUpdatedAt
                            if (timeDifference >= updataDealy) {
                                // 更新老数据为新数据
                                storedData[Guild_ID].guild_player[name].old = storedData[Guild_ID].guild_player[name].new;
                                // 更新新数据为当前数据
                                storedData[Guild_ID].guild_player[name].new = {
                                    id: key,
                                    gameMode: obj.guildSharableCharacterMap[key].gameMode,
                                    guildExperience: obj.guildCharacterMap[key].guildExperience,
                                    updatedAt: newUpdatedAt,
                                };
                            } else {
                                // 仅更新新数据
                                storedData[Guild_ID].guild_player[name].new = {
                                    id: key,
                                    gameMode: obj.guildSharableCharacterMap[key].gameMode,
                                    guildExperience: obj.guildCharacterMap[key].guildExperience,
                                    updatedAt: newUpdatedAt,
                                };
                            }
                            //计算Δ
                            const Delta = {
                                Delta_Time:(newUpdatedAt - new Date(storedData[Guild_ID].guild_player[name].old.updatedAt)) / 1000,
                                Delta_Xp: storedData[Guild_ID].guild_player[name].new.guildExperience - storedData[Guild_ID].guild_player[name].old.guildExperience,
                                Rate_XP_Day: (24*3600*(obj.guildCharacterMap[key].guildExperience - storedData[Guild_ID].guild_player[name].old.guildExperience)/((newUpdatedAt - new Date(storedData[Guild_ID].guild_player[name].old.updatedAt)) / 1000)).toFixed(2)
                            };
                            storedData[Guild_ID].guild_player[name].Delta = Delta;
                            rateXPDayMap[name] = Delta.Rate_XP_Day;
                        }else {
                            storedData[Guild_ID].guild_player[name] = {
                                old: {
                                    id: key,
                                    gameMode: obj.guildSharableCharacterMap[key].gameMode,
                                    guildExperience: obj.guildCharacterMap[key].guildExperience,
                                    updatedAt: newUpdatedAt,
                                },
                                new:{}
                            };
                        }
                    }

                }
                //console.log("测试数据",storedData);
                //console.log("guild_characters_updated", obj);
                updateExperienceDisplay(rateXPDayMap);
                edibleTools.Guild_Data = storedData;
                localStorage.setItem('Edible_Tools', JSON.stringify(edibleTools));
            } else if (obj && obj.type === "market_listings_updated") {
                update_market_list(obj);
            } else if (obj && obj.type === "battle_consumable_ability_updated" && obj.consumable) {
                const itemHrid = obj.consumable.itemHrid
                battlePlayerFoodConsumable
            }
        } catch (error) {
            console.error("Error processing message:", error);
        }
        return message;
    }

    // 订单数据更新
    function update_market_list(date) {
        if (!date) return;

        let market_list = JSON.parse(GM_getValue('market_list', '[]'));

        // 通用更新
        function updateOrders(orders) {
            orders.forEach(newOrder => {
                const existingOrderIndex = market_list.findIndex(order => order.id === newOrder.id);
                if (existingOrderIndex !== -1) {
                    market_list[existingOrderIndex] = newOrder;
                } else {
                    market_list.push(newOrder);
                }
                // 给每个订单添加更新时间戳
                newOrder.lastUpdated = new Date().toISOString();
            });
        }

        // 更新市场数据
        if (date.type === "init_character_data" && date.myMarketListings) {
            updateOrders(date.myMarketListings);
        } else if (date.type === "market_listings_updated" && date.endMarketListings) {
            updateOrders(date.endMarketListings);
        }

        // 保存更新后的数据
        GM_setValue('market_list', JSON.stringify(market_list));
    }

    function TimeReset(hours) {
        const totalMinutes = hours * 60;
        const days = Math.floor(totalMinutes / (24 * 60));
        const yudays = totalMinutes % (24 * 60);
        const hrs = Math.floor(yudays / 60);
        const minutes = Math.floor(yudays % 60);
        const dtext = isCN ? "天" : "d";
        const htext = isCN ? "时" : "h";
        const mtext = isCN ? "分" : "m";
        return `${days}${dtext} ${hrs}${htext} ${minutes}${mtext}`;
    }

    function updateExperienceDisplay(rateXPDayMap) {
        const trElements = document.querySelectorAll(".GuildPanel_membersTable__1NwIX tbody tr");
        const idleuser_list = [];
        const dtext = isCN ? "天" : "d";

        // 将 rateXPDayMap 转换为数组并排序
        const sortedMembers = Object.entries(rateXPDayMap)
        .map(([name, XPdata]) => ({ name, XPdata }))
        .sort((a, b) => b.XPdata - a.XPdata);

        sortedMembers.forEach(({ name, XPdata }) => {
            trElements.forEach(tr => {
                const nameElement = tr.querySelector(".CharacterName_name__1amXp");
                const experienceElement = tr.querySelector("td:nth-child(3) > div");
                const activityElement = tr.querySelector('.GuildPanel_activity__9vshh');

                if (nameElement && nameElement.textContent.trim() === name) {
                    if (activityElement.childElementCount === 0) {
                        idleuser_list.push(nameElement.textContent.trim());
                    }

                    if (experienceElement) {
                        const newDiv = document.createElement('div');
                        newDiv.textContent = `${formatPrice(XPdata)}/${dtext}`;

                        // 计算颜色
                        const rank = sortedMembers.findIndex(member => member.name === name);
                        const hue = 120 - (rank * (120 / (sortedMembers.length - 1)));
                        newDiv.style.color = `hsl(${hue}, 100%, 50%)`;

                        experienceElement.insertAdjacentElement('afterend', newDiv);
                    }
                    return;
                }
            });
        });

        update_idleuser_tb(idleuser_list);
    }

    function update_idleuser_tb(idleuser_list) {
        const targetElement = document.querySelector('.GuildPanel_noticeMessage__3Txji');
        if (!targetElement) {
            console.error('公会标语元素未找到！');
            return;
        }
        const clonedElement = targetElement.cloneNode(true);

        const namesText = idleuser_list.join(', ');
        clonedElement.innerHTML = '';
        clonedElement.textContent = isCN ? `闲置的成员：${namesText}` : `Idle User : ${namesText}`;
        clonedElement.style.color = '#ffcc00';

        // 设置复制元素的高度为原元素的25%
        const originalStyle = window.getComputedStyle(targetElement);
        const originalHeight = originalStyle.height;
        const originalMinHeight = originalStyle.minHeight;
        clonedElement.style.height = `25%`;
        clonedElement.style.minHeight = `25%`; // 也设置最小高度
        targetElement.parentElement.appendChild(clonedElement);
    }


    //箱子数据获取
    function processCharacterData(init_character_data) {
        const initClientData = localStorage.getItem('initClientData');
        if (!initClientData) return;
        let init_client_data
        try {
            init_client_data = JSON.parse(initClientData);
        } catch (error) {
            console.error('数据解析失败:', error);
            return;
        }
        if (init_client_data.type !== 'init_client_data') return;
        const item_hrid_to_name = init_client_data.itemDetailMap;
        for (const key in item_hrid_to_name) {
            if (item_hrid_to_name[key] && typeof item_hrid_to_name[key] === 'object' && item_hrid_to_name[key].name) {
                item_hrid_to_name[key] = item_hrid_to_name[key].name;
            }
        }
        const item_name_to_hrid = Object.fromEntries(
            Object.entries(item_hrid_to_name).map(([key, value]) => [value, key])
        );
        const hrid2name = item_hrid_to_name;

        const character = init_character_data.character;
        if (character) {
            currentPlayerID = character.id;
            currentPlayerName = character.name;
        }

        let formattedShopData = {};
        if (init_character_data?.characterActions[0]?.actionHrid?.startsWith("/actions/combat/")) {now_battle_map = init_character_data.characterActions[0].actionHrid}
        // 处理商店数据
        for (let [key, details] of Object.entries(init_client_data.shopItemDetailMap)) {
            const { itemHrid, costs } = details;
            const itemName = hrid2name[itemHrid] || formatItemName(itemHrid.split('/').pop());

            costs.forEach(cost => {
                const costItemName = hrid2name[cost.itemHrid] || formatItemName(cost.itemHrid.split('/').pop());
                if (costItemName === "Coin") return;

                const costCount = cost.count;

                if (!formattedShopData[costItemName]) {
                    formattedShopData[costItemName] = { items: {}, 最挣钱: '', BID单价: 0 };
                }

                // 计算每种代币购买每个物品的收益
                let bidValue = getSpecialItemPrice(itemName,"bid") || 0;
                let profit = bidValue / costCount;

                formattedShopData[costItemName].items[itemName] = {
                    花费: costCount
                };
                // 更新最赚钱的物品信息
                if (profit > formattedShopData[costItemName].BID单价) {
                    formattedShopData[costItemName].最挣钱 = itemName;
                    formattedShopData[costItemName].BID单价 = profit;
                    (specialItemPrices[costItemName] ??= {}).ask = profit;
                    (specialItemPrices[costItemName] ??= {}).bid = profit;
                }
            });
        }
        const mostProfitableItems = Object.values(formattedShopData).map(item => item.最挣钱).filter(Boolean);
        //console.log(mostProfitableItems)
        // 处理箱子掉落物数据

        for (let iteration = 0; iteration < 4; iteration++) {
            for (let [key, items] of Object.entries(init_client_data.openableLootDropMap)) {
                const boxName = hrid2name[key] || formatItemName(key.split('/').pop());

                if (!formattedChestDropData[boxName]) {
                    formattedChestDropData[boxName] = { item: {} };
                }
                let TotalAsk = 0;
                let TotalBid = 0;
                let awa = 0;
                items.forEach(item => {
                    const { itemHrid, dropRate, minCount, maxCount } = item;
                    if (dropRate < 0.01) return;
                    const itemName = hrid2name[itemHrid] || formatItemName(itemHrid.split('/').pop());
                    const expectedYield = ((minCount + maxCount) / 2) * dropRate;
                    let bidPrice = -1;
                    let askPrice = -1;
                    let priceColor = '';

                    if (specialItemPrices[itemName] && specialItemPrices[itemName].ask) {
                        askPrice = parseFloat(specialItemPrices[itemName].ask);
                        bidPrice = parseFloat(specialItemPrices[itemName].bid);
                        priceColor = '';
                    } else if (marketData?.market?.[itemName]) {
                        bidPrice = marketData.market[itemName].bid;
                        askPrice = marketData.market[itemName].ask;
                    } else {
                        console.log(`${itemName} 的价格未找到`);
                    }

                    if (formattedChestDropData[boxName].item[itemName] && iteration === 0) {
                        // 如果物品已存在，更新期望掉落和相关价格
                        const existingItem = formattedChestDropData[boxName].item[itemName];
                        existingItem.期望掉落 += expectedYield;
                    } else if (iteration === 0) {
                        formattedChestDropData[boxName].item[itemName] = {
                            期望掉落: expectedYield,
                        };
                    }

                    // 判断 itemName 是否在最挣钱物品列表中
                    if (mostProfitableItems.includes(itemName)) {
                        priceColor = '#FFb3E6';
                    } else if (askPrice === -1 && bidPrice === -1) {
                        priceColor = 'yellow';
                    } else if (askPrice === -1) {
                        askPrice = bidPrice;
                        priceColor = '#D95961';
                    } else if (bidPrice === -1) {
                        priceColor = '#2FC4A7';
                    }

                    const existingItem = formattedChestDropData[boxName].item[itemName];
                    existingItem.出售单价 = askPrice;
                    existingItem.收购单价 = bidPrice;
                    existingItem.出售总价 = (existingItem.出售单价 * existingItem.期望掉落).toFixed(2);
                    existingItem.收购总价 = (existingItem.收购单价 * existingItem.期望掉落).toFixed(2);
                    existingItem.Color = priceColor;

                    // 累计总价
                    TotalAsk += (askPrice * expectedYield);
                    TotalBid += (bidPrice * expectedYield);
                });

                formattedChestDropData[boxName] = {
                    ...formattedChestDropData[boxName],
                    期望产出Ask: TotalAsk.toFixed(2),
                    期望产出Bid: TotalBid.toFixed(2),
                };

                if (!specialItemPrices[boxName]) {
                    specialItemPrices[boxName] = {}
                }
                if (chestCosts[boxName]) {
                    const { keyAsk, keyBid, entryAsk, entryBid } = chestCosts[boxName];
                    specialItemPrices[boxName].ask = formattedChestDropData[boxName].期望产出Ask - (keyBid + entryBid);
                    specialItemPrices[boxName].bid = formattedChestDropData[boxName].期望产出Bid - (keyAsk + entryAsk);
                } else {
                    specialItemPrices[boxName].ask = formattedChestDropData[boxName].期望产出Ask;
                    specialItemPrices[boxName].bid = formattedChestDropData[boxName].期望产出Bid;
                }
            }
        }

        for (let itemName in specialItemPrices) {
            if (specialItemPrices.hasOwnProperty(itemName)) {
                marketData.market[itemName] = {
                    ask: specialItemPrices[itemName].ask,
                    bid: specialItemPrices[itemName].bid
                };
            }
        }
        localStorage.setItem('MWITools_marketAPI_json', JSON.stringify(marketData));
        //处理战斗地图数据
        const combatMaps = {};
        const actionDetailMap = init_client_data.actionDetailMap;
        for (const [actionHrid, actionDetail] of Object.entries(actionDetailMap)) {
            if (!actionHrid.startsWith("/actions/combat/")) continue;
            if (!actionDetail.combatZoneInfo || actionDetail.combatZoneInfo.isDungeon) continue;

            const fightInfo = actionDetail.combatZoneInfo.fightInfo;
            const randomSpawnInfo = fightInfo?.randomSpawnInfo;
            const spawns = randomSpawnInfo?.spawns;

            if (!spawns || spawns.length === 0) continue;

            // 确定地图类型
            let mapType = "群战";
            if (spawns.length === 1) {
                mapType = "单怪";
            }
            if (actionHrid.includes("_elite") && mapType === "群战") {
                mapType = "群战(精英)";
            }

            const monsterGen = {};
            const maxSpawnCount = randomSpawnInfo.maxSpawnCount;
            const maxTotalStrength = randomSpawnInfo.maxTotalStrength;


            const expectedCounts = calculateExpectedSpawns(spawns, maxSpawnCount, maxTotalStrength);

            spawns.forEach(spawn => {
                monsterGen[spawn.combatMonsterHrid] = {
                    期望数量: expectedCounts[spawn.combatMonsterHrid],
                    精英等级: spawn.eliteTier
                };
            });

            // 处理BOSS数据
            const bossData = {};
            const bossSpawns = fightInfo.bossSpawns;
            const battlesPerBoss = fightInfo.battlesPerBoss;

            if (bossSpawns && bossSpawns.length > 0) {
                bossSpawns.forEach(boss => {
                    if (boss.combatMonsterHrid) {
                        bossData[boss.combatMonsterHrid] = {
                            精英等级: boss.eliteTier
                        };
                    }
                });
            }

            combatMaps[actionHrid] = {
                地图类型: mapType,
                BOSS波次: battlesPerBoss || 0,
                小怪生成: monsterGen,
                BOSS数据: Object.keys(bossData).length > 0 ? bossData : ""
            };
        }
        const combatMobDropData = {};
        const monsterMap = init_client_data.combatMonsterDetailMap;

        for (const [monsterHrid, monsterData] of Object.entries(monsterMap)) {
            const formattedDrops = {
                怪物名称: monsterData.name,
                普通掉落: [],
                稀有掉落: []
            };

            // 处理普通掉落表
            if (monsterData.dropTable) {
                monsterData.dropTable.forEach(drop => {
                    formattedDrops.普通掉落.push({
                        掉落物名称: item_hrid_to_name[drop.itemHrid] || drop.itemHrid,
                        掉落物Hrid: drop.itemHrid,
                        掉落几率: drop.dropRate,
                        掉落数量: (drop.minCount + drop.maxCount) / 2,
                        精英门槛: drop.minEliteTier
                    });
                });
            }

            // 处理稀有掉落表
            if (monsterData.rareDropTable) {
                monsterData.rareDropTable.forEach(drop => {
                    formattedDrops.稀有掉落.push({
                        掉落物名称: item_hrid_to_name[drop.itemHrid] || drop.itemHrid,
                        掉落物Hrid: drop.itemHrid,
                        掉落几率: drop.dropRate,
                        掉落数量: (drop.minCount + drop.maxCount) / 2,
                        精英门槛: drop.minEliteTier
                    });
                });
            }

            combatMobDropData[monsterHrid] = formattedDrops;
        }
        let edibleTools = JSON.parse(localStorage.getItem('Edible_Tools')) || {};
        edibleTools = {
            ...edibleTools,
            Chest_Drop_Data: formattedChestDropData,
            Combat_Data: {...edibleTools.Combat_Data, Combat_Map_Data: combatMaps ,Combat_Mob_Drop_Data: combatMobDropData}
        };

        edibleTools.Chest_Open_Data = edibleTools.Chest_Open_Data || {};
        if (edibleTools.Chest_Open_Data && !edibleTools.Chest_Open_Data[0]) {
            const oldData = { ...edibleTools.Chest_Open_Data };
            edibleTools.Chest_Open_Data = {};
            edibleTools.Chest_Open_Data[0] = {
                玩家昵称: "老版本开箱数据",
                开箱数据: oldData
            };
        }

        edibleTools.Chest_Open_Data[currentPlayerID] = edibleTools.Chest_Open_Data[currentPlayerID] || {
            玩家昵称: currentPlayerName,
            开箱数据: {}
        };

        try {
            localStorage.setItem('Edible_Tools', JSON.stringify(edibleTools));
        } catch (error) {
            console.error('保存数据时发生错误:', error);
        }
        // 打印结果
        //console.log("特殊物品价格表:",specialItemPrices)
        //console.log("箱子掉落物列表:", formattedChestDropData);
        //console.log("地牢商店列表:", formattedShopData);
        //console.log("战斗地图列表",combatMaps)
        //console.log("怪物掉落列表",combatMobDropData)
    }

    function calculateExpectedSpawns(spawns, maxSpawnCount, maxTotalStrength) {
        const monsterList = spawns.map(s => ({ hrid: s.combatMonsterHrid, strength: s.strength }));
        const spawnProbability = 1 / spawns.length;

        const dp = Array.from({ length: maxSpawnCount + 1 }, () => ({}));
        dp[0][0] = 1;

        const expectedCounts = {};
        monsterList.forEach(m => {
            expectedCounts[m.hrid] = 0;
        });

        for (let pos = 0; pos < maxSpawnCount; pos++) {
            const currentDP = dp[pos];
            const nextDP = dp[pos + 1] = {};

            for (const [currentStrengthStr, prob] of Object.entries(currentDP)) {
                const currentStrength = parseInt(currentStrengthStr);

                for (const monster of monsterList) {
                    const newStrength = currentStrength + monster.strength;
                    if (newStrength > maxTotalStrength) continue;

                    const transitionProb = prob * spawnProbability;
                    nextDP[newStrength] = (nextDP[newStrength] || 0) + transitionProb;

                    expectedCounts[monster.hrid] += transitionProb;
                }
            }
        }
        return expectedCounts;
    }

    function ShowChestPrice() {
        const modalContainer = document.querySelector(".Modal_modalContainer__3B80m");
        if (!modalContainer) return; // 如果不存在 Modal_modalContainer__3B80m 元素，则直接返回

        const chestNameElem = document.querySelector(chestNameSelector);
        if (!chestNameElem) return;

        const chestName = getItemNameFromElement(chestNameElem);
        const items = document.querySelectorAll(itemSelector);

        const dropListContainer = document.querySelector('.ItemDictionary_openToLoot__1krnv');
        if (!dropListContainer) return; // 检查 dropListContainer 是否存在

        const edibleTools = JSON.parse(localStorage.getItem('Edible_Tools'))
        const formattedChestDropData = edibleTools.Chest_Drop_Data;

        items.forEach(item => {
            const itemName = getItemNameFromElement(item.querySelector(iconSelector));
            if (!itemName) return; // 检查 itemName 是否存在

            const itemData = formattedChestDropData[chestName].item[itemName];
            if (!itemData) return; // 检查 itemData 是否存在

            const itemColor = itemData.Color;
            const itemNameElem = item.querySelector('.Item_name__2C42x');
            if (itemNameElem && itemColor) {
                itemNameElem.style.color = itemColor;
            }
        });

        const askPrice = formattedChestDropData[chestName]["期望产出Ask"];
        const bidPrice = formattedChestDropData[chestName]["期望产出Bid"];
        if (askPrice && bidPrice) {

            const previousResults = dropListContainer.querySelectorAll('.resultDiv');
            previousResults.forEach(result => result.remove());

            const createPriceOutput = (label, price) => {
                const priceOutput = document.createElement('div');
                priceOutput.className = 'resultDiv';
                priceOutput.textContent = `${label}: ${price}`;
                priceOutput.style.color = 'gold';
                priceOutput.style.fontSize = '14px';
                priceOutput.style.fontWeight = '400';
                priceOutput.style.paddingTop = '10px';
                return priceOutput;
            };

            const minPriceOutput = createPriceOutput(isCN ? '期望产出 (最低买入价计算)' : 'Expected Output (Ask Price)', formatPrice(askPrice));
            const maxPriceOutput = createPriceOutput(isCN ? '期望产出 (最高收购价计算)' : 'Expected Output (Bid Price)', formatPrice(bidPrice));
            dropListContainer.appendChild(minPriceOutput);
            dropListContainer.appendChild(maxPriceOutput);
            if (chestCosts[chestName]) {
                const { keyAsk, keyBid, entryAsk, entryBid } = chestCosts[chestName];
                const askProfit = askPrice - (keyBid + entryBid);
                const bidProfit = bidPrice - (keyAsk + entryAsk);
                const ProfitOutput = createPriceOutput(
                    isCN ? '期望利润' : 'Expected Profit',
                    `${formatPrice(bidProfit)}~${formatPrice(askProfit)}`
                );
                dropListContainer.appendChild(ProfitOutput);
            }

        }
    }

    function processEnhancementData(obj) {
        const now_enhancementLevel = parseInt(obj.endCharacterAction.primaryItemHash.match(/::(\d+)$/)[1]);
        const currentCount = obj.endCharacterAction.currentCount;
        // 开始新的物品的强化
        if (enhancementData[currentEnhancingIndex]["强化次数"] && currentCount <= enhancementData[currentEnhancingIndex]["强化次数"]) {
            currentEnhancingIndex++;
            enhancementData[currentEnhancingIndex] = { "强化数据": {}, "其他数据": {} };
            enhancementLevel = undefined;
        }
        //初始化数据
        if (!enhancementData[currentEnhancingIndex]["其他数据"]["物品名称"]) {
            const itemName = item_hrid_to_name[obj.endCharacterAction.primaryItemHash.match(/::([^:]+)::[^:]*$/)[1]];
            enhancementData[currentEnhancingIndex]["其他数据"] = {
                "物品名称": itemName,
                "目标强化等级": obj.endCharacterAction.enhancingMaxLevel,
                "保护消耗总数": 0,
            }
            const filteredItems = obj.endCharacterItems.filter(
                item => item.hash !== obj.endCharacterAction.primaryItemHash
            );

            const candidateItems = filteredItems.filter(
                item => item.itemHrid === obj.endCharacterAction.primaryItemHash.split('::')[2]
            );

            let prevLevelItem;
            if (candidateItems.length === 1) {
                prevLevelItem = candidateItems[0];
            } else if (candidateItems.length > 1) {
                prevLevelItem = candidateItems.find(
                    item => item.hash !== obj.endCharacterAction.secondaryItemHash
                );
            }

            enhancementLevel = prevLevelItem?.enhancementLevel ?? 0;
        }

        //统计强化次数
        const currentItem = enhancementData[currentEnhancingIndex]["强化数据"];

        if (!currentItem[enhancementLevel]) {
            currentItem[enhancementLevel] = {"祝福次数": 0, "成功次数": 0, "失败次数": 0, "成功率": 0 };
        }

        if (enhancementLevel < now_enhancementLevel) {
            currentItem[enhancementLevel]["成功次数"]++;
            if (now_enhancementLevel - enhancementLevel == 2) {
                currentItem[enhancementLevel]["祝福次数"]++;
            }
        } else {
            currentItem[enhancementLevel]["失败次数"]++;
            if (obj.endCharacterAction.enhancingProtectionMinLevel >= 2 && enhancementLevel >= obj.endCharacterAction.enhancingProtectionMinLevel) {
                enhancementData[currentEnhancingIndex]["其他数据"]["保护消耗总数"]++;
            }
        }

        const success = currentItem[enhancementLevel]["成功次数"];
        const failure = currentItem[enhancementLevel]["失败次数"];
        currentItem[enhancementLevel]["成功率"] = success / (success + failure);

        // 计算强化状态
        const highestSuccessLevel = Math.max(...Object.keys(currentItem).filter(level => currentItem[level]["成功次数"] > 0));
        const enhancementState = (highestSuccessLevel + 1 >= enhancementData[currentEnhancingIndex]["其他数据"]["目标强化等级"]) ? "强化成功" : "强化失败";
        enhancementData[currentEnhancingIndex]["强化状态"] = enhancementState;
        enhancementLevel = now_enhancementLevel;

        //console.log(enhancementData)
        enhancementData[currentEnhancingIndex]["强化次数"] = currentCount;
        updateEnhancementUI();
    }

    function updateEnhancementUI() {
        const targetElement = document.querySelector(".SkillActionDetail_enhancingComponent__17bOx");
        if (!targetElement) return;

        // 创建父容器
        let parentContainer = document.querySelector("#enhancementParentContainer");
        if (!parentContainer) {
            parentContainer = document.createElement("div");
            parentContainer.id = "enhancementParentContainer";
            parentContainer.style.display = "block"; // 设置为纵向布局（块级元素）
            parentContainer.style.borderLeft = "2px solid var(--color-divider)";
            parentContainer.style.padding = "0 4px";

            // 创建并添加标题
            const title = document.createElement("div");
            title.textContent = isCN ? "强化数据" : "Enhancement Data";
            title.style.fontWeight = "bold";
            title.style.marginBottom = "10px"; // 标题与下拉框之间的间距
            title.style.textAlign = "center";
            title.style.color = "var(--color-space-300)";
            parentContainer.appendChild(title);

            // 创建并添加下拉框
            const dropdownContainer = document.createElement("div");
            dropdownContainer.style.marginBottom = "10px"; // 下拉框与表格之间的间距

            const dropdown = document.createElement("select");
            dropdown.id = "enhancementDropdown";
            dropdown.addEventListener("change", function () {
                renderEnhancementUI(this.value);
                updateDropdownColor();
            });

            dropdownContainer.appendChild(dropdown);
            parentContainer.appendChild(dropdownContainer);

            // 创建并添加表格容器
            const enhancementStatsContainer = document.createElement("div");
            enhancementStatsContainer.id = "enhancementStatsContainer";
            enhancementStatsContainer.style.display = "grid";
            enhancementStatsContainer.style.gridTemplateColumns = "repeat(4, 1fr)";
            enhancementStatsContainer.style.gap = "10px";
            enhancementStatsContainer.style.textAlign = "center";
            enhancementStatsContainer.style.marginTop = "10px";

            parentContainer.appendChild(enhancementStatsContainer);
            targetElement.appendChild(parentContainer);
        }

        // 更新下拉框内容
        const dropdown = document.querySelector("#enhancementDropdown");
        const previousSelectedValue = dropdown.value;
        dropdown.innerHTML = ""; // 清空下拉框内容

        Object.keys(enhancementData).forEach(key => {
            const item = enhancementData[key];
            const option = document.createElement("option");
            const itemName = item["其他数据"]["物品名称"];
            const transferName = isCN && e2c[itemName] ? e2c[itemName] : itemName
            const targetLevel = item["其他数据"]["目标强化等级"];
            const currentLevel = Math.max(...Object.keys(item["强化数据"]));
            const enhancementState = item["强化状态"];

            option.text = isCN
                ? `${transferName} (目标: ${targetLevel}, 总计: ${item["强化次数"]}${item["其他数据"]["保护消耗总数"] > 0 ? `, 垫子: ${item["其他数据"]["保护消耗总数"]}` : ""})`
                : `${transferName} (Target: ${targetLevel}, Total: ${item["强化次数"]}${item["其他数据"]["保护消耗总数"] > 0 ? `, PU: ${item["其他数据"]["保护消耗总数"]}` : ""})`;

            option.value = key;
            option.style.color = enhancementState === "强化成功" ? "green"
            : (currentLevel < targetLevel && Object.keys(enhancementData).indexOf(key) === Object.keys(enhancementData).length - 1) ? "orange"
            : "red";

            dropdown.appendChild(option);
        });

        // 设置默认选中项并渲染表格数据
        if (Object.keys(enhancementData).length > 0) {
            dropdown.value = previousSelectedValue || Object.keys(enhancementData)[0];
            updateDropdownColor();
            renderEnhancementUI(dropdown.value);
        }

        function updateDropdownColor() {
            const selectedOption = dropdown.options[dropdown.selectedIndex];
            dropdown.style.color = selectedOption ? selectedOption.style.color : "black";
        }
    }

    function renderEnhancementUI(selectedKey) {
        const enhancementStatsContainer = document.querySelector("#enhancementStatsContainer");
        enhancementStatsContainer.innerHTML = ""; // 清空现有内容

        const item = enhancementData[selectedKey];

        // 表头
        const headers = ["等级", "成功", "失败", "概率"];
        headers.forEach(headerText => {
            const headerDiv = document.createElement("div");
            headerDiv.style.fontWeight = "bold";
            headerDiv.textContent = isCN ? headerText : (headerText === "等级" ? "Level" : headerText === "成功" ? "Success" : headerText === "失败" ? "Failure" : "Rate");
            enhancementStatsContainer.appendChild(headerDiv);
        });

        // 总计信息
        const totalSuccess = Object.values(item["强化数据"]).reduce((acc, val) => acc + val["成功次数"], 0);
        const totalFailure = Object.values(item["强化数据"]).reduce((acc, val) => acc + val["失败次数"], 0);
        const totalCount = totalSuccess + totalFailure;
        const totalRate = totalCount > 0 ? (totalSuccess / totalCount * 100).toFixed(2) : "0.00";

        // 将总计信息添加到表格中
        ["总计", totalSuccess, totalFailure, `${totalRate}%`].forEach((totalText, index) => {
            const totalDiv = document.createElement("div");
            totalDiv.textContent = isCN ? totalText : index === 0 ? "Total" : totalText;
            enhancementStatsContainer.appendChild(totalDiv);
        });

        // 渲染各个强化等级的数据
        Object.keys(item["强化数据"]).sort((a, b) => b - a).forEach(level => {
            const levelData = item["强化数据"][level];
            const levelDivs = [
                level,
                levelData["祝福次数"] > 0
                ? `${levelData["成功次数"]}(${levelData["祝福次数"]})`
                : `${levelData["成功次数"]}`,
                levelData["失败次数"],
                `${(levelData["成功率"] * 100).toFixed(2)}%`
            ];

            levelDivs.forEach(data => {
                const dataDiv = document.createElement("div");
                dataDiv.textContent = data;
                enhancementStatsContainer.appendChild(dataDiv);
            });
        });
    }

    function processCombatConsumables(obj) {
        battlePlayerFood = {};
        battlePlayerLoot = {};
        battlePlayerData = {};
        battleDuration = (new Date() - new Date(obj.combatStartTime)) / 1000;
        battleRunCount = obj.battleId || 1;
        obj.players.forEach(player => {
            const playerName = player.character.name;

            // 初始化玩家数据
            battlePlayerFood[playerName] = { drinkConcentration: player.combatDetails.combatStats.drinkConcentration };
            battlePlayerLoot[playerName] = {};
            battlePlayerData[playerName] = { aura: null, skillexp: {} ,combatDropQuantity: player.combatDetails.combatStats.combatDropQuantity ,combatDropRate: player.combatDetails.combatStats.combatDropRate, combatRareFind: player.combatDetails.combatStats.combatRareFind};

            // 处理消耗品
            player.combatConsumables.forEach(consumable => {
                const itemname = item_hrid_to_name[consumable.itemHrid];
                battlePlayerFood[playerName][itemname] = {
                    "数量": consumable.count,
                    "颜色": "white",
                    "ID": consumable.itemHrid
                };
            });

            // 处理战利品
            Object.values(player.totalLootMap).forEach(Loot => {
                const itemname = item_hrid_to_name[Loot.itemHrid];
                battlePlayerLoot[playerName][itemname] = {
                    "数量": Loot.count,
                    "ID": Loot.itemHrid
                };
            });

            // 处理光环
            player.combatAbilities.forEach(ability => {
                const isAura = Array.from(auraAbilities).some(aura => ability.abilityHrid.endsWith(aura));
                if (isAura) {
                    battlePlayerData[playerName].aura = ability.abilityHrid;
                }
            });

            Object.keys(player.totalSkillExperienceMap).forEach(skillPath => {
                const skillname = skillPath.replace('/skills/', '');
                battlePlayerData[playerName].skillexp[skillname] = player.totalSkillExperienceMap[skillPath];
            });
        });

        if (processCombatConsumablesRunCount % 10 === 0) {
            const edibleTools = JSON.parse(localStorage.getItem('Edible_Tools')) || {};
            edibleTools.Combat_Data = edibleTools.Combat_Data || {};
            edibleTools.Combat_Data.Combat_Player_Data = edibleTools.Combat_Data.Combat_Player_Data || {};
            obj.players.forEach(player => {
                const playerName = player.character.name;
                const combatStartTime = obj.combatStartTime;
                // 初始化玩家数据
                if (!edibleTools.Combat_Data.Combat_Player_Data[playerName]) {
                    edibleTools.Combat_Data.Combat_Player_Data[playerName] = {
                        Food_Data: {
                            Start: {
                                Food: {},
                                Time: null
                            },
                            End: {
                                Food: {},
                                Time: null
                            },
                            Statistics: {
                                Food: {},
                                Time: null
                            },
                            Start_Time: null
                        }
                    };
                }

                const playerData = edibleTools.Combat_Data.Combat_Player_Data[playerName];
                const foodData = playerData.Food_Data;
                // 初始化数据
                if (foodData.Start_Time !== combatStartTime) {
                    foodData.Start.Food = {};
                    player.combatConsumables.forEach(consumable => {
                        foodData.Start.Food[consumable.itemHrid] = consumable.count;
                    });
                    foodData.Start.Time = new Date().toISOString();
                    foodData.Start_Time = combatStartTime;

                    foodData.End = { Food: {}, Time: null };
                    foodData.Statistics = { Food: {}, Time: null };
                    //console.log(`初始化${playerName}的数据`,foodData)
                } else {
                    //console.log(`后写入${playerName}的数据`,foodData)
                    foodData.End.Food = {};
                    player.combatConsumables.forEach(consumable => {
                        foodData.End.Food[consumable.itemHrid] = consumable.count;
                    });
                    foodData.End.Time = new Date().toISOString();

                    const startTime = new Date(foodData.Start.Time).getTime();
                    const endTime = new Date(foodData.End.Time).getTime();
                    const timeDifference = (endTime - startTime) / 1000;
                    if (timeDifference > 3600) {
                        const statistics = {
                            Food: {},
                            Time: timeDifference
                        };

                        let hasInvalidData = false;

                        // 计算食物差值
                        for (const itemHrid in foodData.Start.Food) {
                            const startCount = foodData.Start.Food[itemHrid] || 0;
                            const endCount = foodData.End.Food[itemHrid] || 0;
                            const difference = startCount - endCount;

                            // 异常处理
                            if (difference < 0) {
                                hasInvalidData = true;
                                break;
                            }

                            if (difference > 0) {
                                statistics.Food[itemHrid] = difference;
                            }
                        }

                        if (hasInvalidData) {
                            //console.log(`有异常${playerName}的数据`,foodData)
                            processCombatConsumablesRunCount = -1;
                            foodData.Start = { Food: {}, Time: null };
                            foodData.End = { Food: {}, Time: null };
                            foodData.Statistics = { Food: {}, Time: null };
                            foodData.Start_Time = null;
                        } else {
                            //console.log(`无异常${playerName}的数据`,foodData)
                            foodData.Statistics = statistics;
                        }
                    }
                }
            });

            // 保存到本地存储
            localStorage.setItem('Edible_Tools', JSON.stringify(edibleTools));
            processCombatConsumablesRunCount++;
        }
    }


    function addBattlePlayerFoodButton() {
        // 出警按钮父元素路径
        var tabsContainer = document.querySelector("#root > div > div > div.GamePage_gamePanel__3uNKN > div.GamePage_contentPanel__Zx4FH > div.GamePage_middlePanel__uDts7 > div.GamePage_mainPanel__2njyb > div > div:nth-child(1) > div > div > div > div.TabsComponent_tabsContainer__3BDUp > div > div > div");
        var referenceTab = tabsContainer ? tabsContainer.children[1] : null;

        if (!tabsContainer || !referenceTab) return;
        if (tabsContainer.querySelector('.Button_battlePlayerFood__custom')) return;

        // 创建按钮
        var battlePlayerFoodButton = document.createElement('div');
        battlePlayerFoodButton.className = referenceTab.className + ' Button_battlePlayerFood__custom';
        battlePlayerFoodButton.setAttribute('script_translatedfrom', 'New Action');
        battlePlayerFoodButton.textContent = isCN ? "出警" : "Dispatch";

        battlePlayerFoodButton.addEventListener('click', function () {
            const edibleTools = JSON.parse(localStorage.getItem('Edible_Tools')) || {};
            edibleTools.Combat_Data = edibleTools.Combat_Data || {};
            edibleTools.Combat_Data.Combat_Player_Data = edibleTools.Combat_Data.Combat_Player_Data || {};

            // 计算最大数量字符长度
            let maxQuantityLength = 0;
            Object.values(battlePlayerFood).forEach(playerData => {
                Object.entries(playerData).forEach(([itemName, itemData]) => {
                    if (itemName === 'drinkConcentration') return;
                    const length = formatPrice(itemData.数量).length;
                    if (length > maxQuantityLength) maxQuantityLength = length;
                });
            });

            // 计算所有玩家的最短剩余时间
            let minTimeOverall = Infinity;
            let minTimePlayer = null;
            Object.keys(battlePlayerFood).forEach(playerName => {
                const playerData = battlePlayerFood[playerName];
                const drinkConcentration = playerData.drinkConcentration || 0;
                let minTime = Infinity;

                Object.entries(playerData).forEach(([itemName, itemData]) => {
                    if (itemName === 'drinkConcentration') return;

                    let unitTime;
                    if (itemName.includes('Coffee')) {
                        unitTime = 300 / (1 + drinkConcentration);
                    } else {
                        const playerCombatData = edibleTools.Combat_Data.Combat_Player_Data[playerName]?.Food_Data?.Statistics;
                        if (playerCombatData?.Time != null && playerCombatData?.Food[itemData.ID] != null) {
                            const totalConsumed = playerCombatData.Food[itemData.ID];
                            const totalTime = playerCombatData.Time;
                            unitTime = totalTime / totalConsumed;
                        } else {
                            unitTime = itemName.includes('Donut') || itemName.includes('Cake') || itemName.includes('cake') ? 75 :
                            itemName.includes('Gummy') || itemName.includes('Yogurt') ? 67 : 60;
                        }
                    }

                    const totalDays = (itemData.数量 * unitTime) / 86400;
                    if (totalDays < minTime) minTime = totalDays;
                });

                if (minTime < minTimeOverall) {
                    minTimeOverall = minTime;
                    minTimePlayer = playerName;
                }
            });

            // 弹窗
            let dataHtml = `<div style="display: flex; padding: 10px; gap: 15px;">`;

            Object.keys(battlePlayerFood).forEach(playerName => {
                const playerData = battlePlayerFood[playerName];
                const isMinTimePlayer = Object.keys(battlePlayerFood).length > 1 && playerName === minTimePlayer;

                dataHtml += `<div style="flex-shrink: 0; padding: 15px; border: 1px solid #98a7e9; border-radius: 10px; background-color: #1e1e2f; white-space: nowrap;">
                <h3 style="color: ${isMinTimePlayer ? 'red' : '#98a7e9'}; margin: 0 0 15px 0; text-align: center;">
                    ${playerName}
                </h3>`;

                // 计算物品时间
                const drinkConcentration = playerData.drinkConcentration || 0;
                const playerCombatData = edibleTools.Combat_Data.Combat_Player_Data[playerName]?.Food_Data?.Statistics;
                let minTime = Infinity;
                const items = [];
                let totalHpR = 0;
                let totalMpR = 0;
                let HpRegenMax = 0;
                let MpRegenMax = 0;

                Object.entries(playerData).forEach(([itemName, itemData]) => {
                    if (itemName === 'drinkConcentration') return;
                    let unitTime;

                    if (itemName.includes('Coffee')) {
                        unitTime = 300 / (1 + drinkConcentration);
                    } else {

                        if (playerCombatData?.Time != null && playerCombatData?.Food[itemData.ID] != null) {
                            const totalConsumed = playerCombatData.Food[itemData.ID];
                            const totalTime = playerCombatData.Time;
                            unitTime = totalTime / totalConsumed;
                            const itemDetail = init_Client_Data_.itemDetailMap[itemData.ID];
                            const hpr = itemDetail.consumableDetail.hitpointRestore || 0;
                            const mpr = itemDetail.consumableDetail.manapointRestore || 0;
                            totalHpR += hpr * totalConsumed;
                            totalMpR += mpr * totalConsumed;
                            HpRegenMax += hpr;
                            MpRegenMax += mpr;
                        } else {
                            unitTime = itemName.includes('Donut') || itemName.includes('Cake') || itemName.includes('cake') ? 75 :
                            itemName.includes('Gummy') || itemName.includes('Yogurt') ? 67 : 60;
                        }
                    }

                    const totalDays = (itemData.数量 * unitTime) / 86400;
                    items.push({ itemName, itemData, totalDays });
                    if (totalDays < minTime) minTime = totalDays;
                });

                const HpRegen = 60 * totalHpR / playerCombatData?.Time;
                const MpRegen = 60 * totalMpR / playerCombatData?.Time;

                // 物品显示
                items.forEach(({ itemName, itemData, totalDays }) => {
                    const isMinItem = totalDays === minTime;
                    const svgIcon = `<svg width="20" height="20" style="margin-right:8px;vertical-align:middle">
                    <use href="${item_icon_url}#${itemData.ID.split('/').pop()}"></use>
                    </svg>`;

                    // 计算每小时消耗
                    let consumptionPerHour = 0;
                    if (playerCombatData?.Time != null && playerCombatData?.Food[itemData.ID] != null) {
                        const totalConsumed = playerCombatData.Food[itemData.ID];
                        const totalTime = playerCombatData.Time;
                        consumptionPerHour = (totalConsumed / totalTime) * 3600;
                    }

                    dataHtml += `
                        <div style="display: flex; align-items: center; background-color: #2c2e45; border-radius: 5px; padding: 4px; margin-bottom: 8px; border: 1px solid #98a7e9;"
                             data-alt="${consumptionPerHour.toFixed(1)}/h">
                            <span style="color: ${isMinItem ? 'red' : 'white'};
                                min-width: ${maxQuantityLength * 10}px;
                                text-align: center;">
                                ${formatPrice(itemData.数量)}
                            </span>
                            ${svgIcon}
                            <span style="color: ${isMinItem ? 'red' : 'white'};">${isCN && e2c[itemName] ? e2c[itemName] : itemName}</span>
                        </div>`;
                });

                // 时间显示
                const timeDisplay = minTime < 1
                ? `${(minTime * 24).toFixed(1)}小时`
                    : `${minTime.toFixed(1)}天`;
                dataHtml += `
                <div style="margin-top: 15px; padding-top: 10px; border-top: 1px solid #98a7e9;">
                    <p style="color: ${isMinTimePlayer ? 'red' : '#4CAF50'}; margin: 0; font-weight: bold; text-align: center;">${isCN ? "剩余时间" : "Duration"}: ${timeDisplay}</p>
                </div>
                <div style="margin-top: 10px; text-align: center;">
                    <p style="color: gold; margin: 0; font-weight: bold;">${isCN ? "每分回血" : "HP Regen/min"}: ${isNaN(HpRegen) ? (isCN ? "等待数据稳定" : "Waiting for stable data") : `${HpRegen.toFixed(0)}(${HpRegenMax})`}</p>
                    <p style="color: gold; margin: 0; font-weight: bold;">${isCN ? "每分回蓝" : "MP Regen/min"}: ${isNaN(MpRegen) ? (isCN ? "等待数据稳定" : "Waiting for stable data") : `${MpRegen.toFixed(0)}(${MpRegenMax})`}</p>
                </div>`;

                // 光环显示
                const playerAura = battlePlayerData[playerName]?.aura;
                if (playerAura) {
                    const auraHrid = playerAura.split('/').pop();
                    const auraItemHrid = `/items/${auraHrid}`;
                    const auraName = item_hrid_to_name[auraItemHrid] || auraHrid;
                    const transferAuraName = isCN && e2c[auraName] ? e2c[auraName] : auraName;
                    dataHtml += `
                    <div style="margin-top: 10px; text-align: center;">
                    <p style="color: #98a7e9; margin: 0; font-weight: bold;">${isCN ? "光环" : "Aura"}: ${transferAuraName}</p></div>`;
                }

                dataHtml += `</div>`;
            });
            dataHtml += '</div>';

            // 弹窗容器
            let popup = document.createElement('div');
            popup.style.position = 'fixed';
            popup.style.top = '50%';
            popup.style.left = '50%';
            popup.style.transform = 'translate(-50%, -50%)';
            popup.style.backgroundColor = '#131419';
            popup.style.border = '1px solid #98a7e9';
            popup.style.borderRadius = '10px';
            popup.style.zIndex = '10000';
            popup.style.maxWidth = '90%';

            // 水平容器
            let scrollWrapper = document.createElement('div');
            scrollWrapper.style.overflowX = 'auto';
            scrollWrapper.style.padding = '20px';
            scrollWrapper.innerHTML = dataHtml;

            // 按钮区域
            let buttonContainer = document.createElement('div');
            buttonContainer.style.display = 'flex';
            buttonContainer.style.justifyContent = 'space-between';
            buttonContainer.style.padding = '10px 20px';
            buttonContainer.style.borderTop = '1px solid #98a7e9';
            buttonContainer.style.backgroundColor = '#1e1e2f';

            // 清除数据按钮
            let clearDataButton = document.createElement('button');
            clearDataButton.textContent = isCN ? '清除数据' : 'Clear Data';
            clearDataButton.style.backgroundColor = '#f44336';
            clearDataButton.style.color = 'white';
            clearDataButton.style.border = 'none';
            clearDataButton.style.padding = '10px 20px';
            clearDataButton.style.borderRadius = '5px';
            clearDataButton.style.cursor = 'pointer';
            clearDataButton.onclick = () => {
                if (confirm(isCN ? '确认清除所有数据？' : 'Are you sure you want to clear all data?')) {
                    const edibleTools = JSON.parse(localStorage.getItem('Edible_Tools')) || {};
                    edibleTools.Combat_Data = edibleTools.Combat_Data || {};
                    edibleTools.Combat_Data.Combat_Player_Data = {};
                    localStorage.setItem('Edible_Tools', JSON.stringify(edibleTools));
                    alert(isCN ? '数据已清除！' : 'Data cleared!');
                }
            };

            // 切换显示按钮
            let toggleConsumptionButton = document.createElement('button');
            toggleConsumptionButton.textContent = isCN ? '切换显示' : 'Toggle Display';
            toggleConsumptionButton.style.backgroundColor = '#4357af';
            toggleConsumptionButton.style.color = 'white';
            toggleConsumptionButton.style.border = 'none';
            toggleConsumptionButton.style.padding = '10px 20px';
            toggleConsumptionButton.style.borderRadius = '5px';
            toggleConsumptionButton.style.cursor = 'pointer';

            // 切换按钮点击事件
            toggleConsumptionButton.addEventListener('click', () => {
                const itemElements = scrollWrapper.querySelectorAll('[data-alt]');
                itemElements.forEach(itemElement => {
                    const quantityElement = itemElement.querySelector('span:first-child');
                    const currentText = quantityElement.textContent.trim();
                    const altData = itemElement.getAttribute('data-alt');
                    // 交换数据
                    itemElement.setAttribute('data-alt', currentText);
                    quantityElement.textContent = altData;
                });
            });

            // 关闭按钮
            let closeButton = document.createElement('button');
            closeButton.textContent = isCN ? '关闭' : 'Close';
            closeButton.style.backgroundColor = '#4357af';
            closeButton.style.color = 'white';
            closeButton.style.border = 'none';
            closeButton.style.padding = '10px 20px';
            closeButton.style.borderRadius = '5px';
            closeButton.style.cursor = 'pointer';
            closeButton.onclick = () => document.body.removeChild(popup);

            // 添加按钮到容器
            buttonContainer.appendChild(clearDataButton);
            buttonContainer.appendChild(toggleConsumptionButton);
            buttonContainer.appendChild(closeButton);

            // 添加到弹窗
            popup.appendChild(scrollWrapper);
            popup.appendChild(buttonContainer);
            document.body.appendChild(popup);
        });

        // 插入按钮
        var lastTab = tabsContainer.children[tabsContainer.children.length - 1];
        tabsContainer.insertBefore(battlePlayerFoodButton, lastTab.nextSibling);

        // 按钮样式
        var style = document.createElement('style');
        style.innerHTML = `
            .Button_battlePlayerFood__custom {
                background-color: #546ddb;
                color: white;
                border-radius: 5px;
                padding: 5px 10px;
                cursor: pointer;
                transition: background-color 0.3s;
            }
            .Button_battlePlayerFood__custom:hover {
                background-color: #6b84ff;
            }`;
        document.head.appendChild(style);
    }

    function addBattlePlayerLootButton() {
        // 获取按钮父元素路径
        var tabsContainer = document.querySelector("#root > div > div > div.GamePage_gamePanel__3uNKN > div.GamePage_contentPanel__Zx4FH > div.GamePage_middlePanel__uDts7 > div.GamePage_mainPanel__2njyb > div > div:nth-child(1) > div > div > div > div.TabsComponent_tabsContainer__3BDUp > div > div > div");
        var referenceTab = tabsContainer ? tabsContainer.children[1] : null;

        if (!tabsContainer || !referenceTab) {
            return;
        }

        // 如果按钮已经存在，直接返回
        if (tabsContainer.querySelector('.Button_battlePlayerLoot__custom')) {
            console.log('分赃按钮已存在');
            return;
        }

        // 创建按钮
        var battlePlayerLootButton = document.createElement('div');
        battlePlayerLootButton.className = referenceTab.className + ' Button_battlePlayerLoot__custom';
        battlePlayerLootButton.setAttribute('script_translatedfrom', 'New Action');
        battlePlayerLootButton.textContent = isCN ? "分赃" : "Loot Distribution";

        // 按钮点击事件
        battlePlayerLootButton.addEventListener('click', function() {
            const isMobile = window.innerWidth < 768; // 判断是否为移动设备
            const playerCount = Object.keys(battlePlayerLoot).length;
            let maxItemsToShow = 10; // 默认显示10个物品
            const EPH = (60 * 60 * (battleRunCount - 1) / battleDuration)

            const skillTranslation = {
                attack: isCN ? '攻击' : 'Attack',
                defense: isCN ? '防御' : 'Defense',
                intelligence: isCN ? '智力' : 'Intelligence',
                power: isCN ? '力量' : 'Power',
                stamina: isCN ? '耐力' : 'Stamina',
                magic: isCN ? '魔法' : 'Magic',
                ranged: isCN ? '远程' : 'Ranged',
            };

            if (isMobile) {
                if (playerCount === 3) {
                    maxItemsToShow = 3;
                } else if (playerCount === 2) {
                    maxItemsToShow = 5;
                } else if (playerCount === 1) {
                    maxItemsToShow = 10;
                } else if (playerCount > 3) {
                    maxItemsToShow = 1;
                }
            }

            const edibleTools = JSON.parse(localStorage.getItem('Edible_Tools')) || {};
            const combatData = edibleTools.Combat_Data || {};
            const currentMapData = combatData.Combat_Map_Data?.[now_battle_map];
            const combatDropData = combatData.Combat_Mob_Drop_Data || {};
            const Mob_Kill_List = {};
            if (currentMapData && combatDropData) {
                const bossWave = currentMapData.BOSS波次;

                if (bossWave === 0) {
                    Object.entries(currentMapData.小怪生成).forEach(([monsterHrid, data]) => {
                        Mob_Kill_List[monsterHrid] = {
                            击杀数量: data.期望数量 * (battleRunCount - 1),
                            精英等级: data.精英等级
                        };
                    });
                } else {
                    const fullCycles = Math.floor((battleRunCount - 1) / bossWave);
                    const remainingWaves = (battleRunCount - 1) % bossWave;
                    const normalWaves = fullCycles * (bossWave - 1) + remainingWaves;

                    Object.entries(currentMapData.小怪生成).forEach(([monsterHrid, data]) => {
                        Mob_Kill_List[monsterHrid] = {
                            击杀数量: data.期望数量 * normalWaves,
                            精英等级: data.精英等级
                        };
                    });

                    if (currentMapData.BOSS数据 && typeof currentMapData.BOSS数据 === 'object') {
                        Object.entries(currentMapData.BOSS数据).forEach(([bossHrid, bossData]) => {
                            const existing = Mob_Kill_List[bossHrid] || { 击杀数量: 0 };
                            Mob_Kill_List[bossHrid] = {
                                击杀数量: existing.击杀数量 + fullCycles,
                                精英等级: bossData.精英等级
                            };
                        });
                    }
                }
                console.log(Mob_Kill_List)
            }



            let dataHtml = '<div style="display: flex; flex-direction: ' + (isMobile ? 'column' : 'row') + '; flex-wrap: nowrap; background-color: #131419; padding: ' + (isMobile ? '5px' : '10px') + '; border-radius: 10px; color: white;">';
            const minPrice = 10000;

            // 获取所有玩家的总计价格
            let playerPrices = [];
            for (let player in battlePlayerLoot) {
                let totalPrice = 0;
                let lootItems = battlePlayerLoot[player];
                for (let item in lootItems) {
                    let bidPrice = getSpecialItemPrice(item,"bid") || 0;
                    totalPrice += bidPrice * lootItems[item].数量;
                }
                playerPrices.push({ player, totalPrice });
            }

            // 找到眉笔
            let minTotalPricePlayer = null;
            if (playerPrices.length > 1) {
                minTotalPricePlayer = playerPrices.reduce((min, current) =>
                                                          current.totalPrice < min.totalPrice ? current : min
                                                         ).player;
            }

            // 显示高价值物品
            for (let player in battlePlayerLoot) {
                const PlayerBonusData = battlePlayerData[player];
                const playerExpectDrops = {};

                const commonDropRateMultiplier = 1 + (PlayerBonusData.combatDropRate || 0);
                const rareDropRateMultiplier = 1 + (PlayerBonusData.combatRareFind || 0);
                const dropQuantityMultiplier = 1 + (PlayerBonusData.combatDropQuantity || 0);

                for (const [monsterHrid, killInfo] of Object.entries(Mob_Kill_List)) {
                    const monsterDrops = combatDropData[monsterHrid];
                    if (!monsterDrops) continue;

                    const processDrops = (drops, isRare) => {
                        for (const drop of drops) {
                            if (killInfo.精英等级 < drop.精英门槛) continue;

                            const rateMultiplier = isRare ? rareDropRateMultiplier : commonDropRateMultiplier;
                            const actualRate = Math.min(drop.掉落几率 * rateMultiplier, 1);
                            const actualQuantity = drop.掉落数量 * dropQuantityMultiplier / playerCount;

                            const expected = killInfo.击杀数量 * actualRate * actualQuantity;

                            if (expected > 0) {
                                const key = drop.掉落物名称;
                                playerExpectDrops[key] = (playerExpectDrops[key] || 0) + expected;
                            }
                        }
                    }

                    if (monsterDrops.普通掉落) processDrops(monsterDrops.普通掉落, false);
                    if (monsterDrops.稀有掉落) processDrops(monsterDrops.稀有掉落, true);
                }
                let totalExpectPrice = 0;
                for (const [itemName, expectedQuantity] of Object.entries(playerExpectDrops)) {
                    const unitPrice = getSpecialItemPrice(itemName, 'bid');
                    if (unitPrice !== null) {
                        totalExpectPrice += unitPrice * expectedQuantity;
                    }
                }

                const formattedExpectDrops = {};
                for (const [itemHrid, value] of Object.entries(playerExpectDrops)) {
                    formattedExpectDrops[itemHrid] = Number(value.toFixed(2));
                }
                console.log(formattedExpectDrops)

                //计算食物期望消耗
                let totalFoodPrice = 0;
                const playerFood = battlePlayerFood[player];

                for (let foodName in playerFood) {
                    if (foodName === 'drinkConcentration') continue;

                    const foodPrice = getSpecialItemPrice(foodName, 'ask') || 0;

                    let consumptionRate = 0;
                    if (foodName.endsWith('Coffee')) {
                        consumptionRate = 300 / (1 + (playerFood.drinkConcentration || 0));
                    } else if (foodName.endsWith('Donut') || foodName.endsWith('Cake') || foodName.endsWith('cake')) {
                        consumptionRate = 75;
                    } else if (foodName.endsWith('Gummy') || foodName.endsWith('Yogurt')) {
                        consumptionRate = 67;
                    }

                    const totalConsumed = (battleDuration / consumptionRate);
                    totalFoodPrice += totalConsumed * foodPrice;
                }

                let totalPrice = 0;

                dataHtml += `<div style="flex: 1 0 auto; min-width: 100px; margin: ${isMobile ? '5px 0' : '10px'}; padding: ${isMobile ? '5px' : '10px'}; border-radius: 10px; background-color: #1e1e2f; border: 1px solid #98a7e9;">`;
                dataHtml += `<h3 style="color: white; margin: ${isMobile ? '0 0 5px 0' : '0 0 10px 0'}; font-size: ${isMobile ? '12px' : '20px'};">${player}</h3>`;

                // 计算总价格
                let lootItems = battlePlayerLoot[player];
                for (let item in lootItems) {
                    let bidPrice = getSpecialItemPrice(item,"bid") || 0;
                    totalPrice += bidPrice * lootItems[item].数量;
                }
                // 显示总计价格
                if (totalPrice > 0 && playerCount <= 3) {
                    let color = '#4CAF50';
                    if (player === minTotalPricePlayer) {
                        color = '#FF0000';
                    }

                    // 计算每天价格
                    const pricePerDay = formatPrice((60 * 60 * 24 * totalPrice) / battleDuration);
                    const ExpectPricePerDay = formatPrice((60 * 60 * 24 * totalExpectPrice) / battleDuration);
                    const expectedProfit = totalExpectPrice - totalFoodPrice;
                    const expectedProfitPerDay = (60 * 60 * 24 * expectedProfit) / battleDuration;

                    dataHtml += `
                        <div style="color: ${color}; font-weight: bold; font-size: ${isMobile ? '10px' : '16px'}; margin: ${isMobile ? '2px 0' : '10px 0'};">
                            <div style="margin-bottom: ${isMobile ? '4px' : '8px'};">
                                ${isCN ? '总计价值' : 'Total Revenue'}: ${formatPrice(totalPrice)}<br>
                                ${isCN ? '每天收入' : 'Daily Revenue'}: ${pricePerDay}/d
                            </div>
                            ${totalExpectPrice > 0 ? `
                                <div style="height: 1px; background: #98a7e9; margin: ${isMobile ? '3px 0' : '6px 0'};"></div>
                                <div style="color: ${totalPrice > totalExpectPrice ? '#4CAF50':'#FF0000'}; margin-bottom: ${isMobile ? '4px' : '8px'};">
                                    ${(!isMobile) ? `${isCN ? '期望产值' : 'Expected Revenue'}: ${formatPrice(totalExpectPrice)}<br>` : ''}
                                    ${isCN ? '期望日入' : 'NoRNG Daily'}: ${ExpectPricePerDay}/d<br>
                                    ${isCN ? '期望日利' : 'Expected Daily'}: ${formatPrice(expectedProfitPerDay)}/d
                                </div>
                            ` : ''}
                        </div>`;
                }

                let maxSkill = null;
                let maxXp = 0;
                if (battlePlayerData[player]?.skillexp) {
                    for (let skill in battlePlayerData[player].skillexp) {
                        let xp = battlePlayerData[player].skillexp[skill];
                        if (xp > maxXp) {
                            maxXp = xp;
                            maxSkill = skill;
                        }
                    }
                }
                const xpPerHours = formatPrice((60 * 60 * maxXp) / battleDuration);
                const translatedSkillName = skillTranslation[maxSkill] || maxSkill;

                dataHtml += `
                <div style="height: 1px; background: #98a7e9; margin: ${isMobile ? '3px 0' : '6px 0'};"></div>
                <div style="color: #FFC107; font-size: ${isMobile ? '10px' : '16px'}; font-weight: bold; margin: ${isMobile ? '2px 0' : '10px 0'};">
                    ${isCN ? `${translatedSkillName}经验` : `${translatedSkillName} EXP`}: ${xpPerHours}/h
                </div>`;

                let sortedItems = Object.keys(lootItems)
                .map(item => {
                    let bidPrice = getSpecialItemPrice(item, "bid") || 0;
                    return {
                        item,
                        bidPrice,
                        quantity: lootItems[item].数量
                    };
                })
                .filter(item => item.bidPrice >= 10000)
                .sort((a, b) => b.bidPrice - a.bidPrice);

                let maxQuantityLength = Math.max(...sortedItems.map(item => item.quantity.toString().length));

                for (let i = 0; i < Math.min(sortedItems.length, maxItemsToShow); i++) {
                    let item = sortedItems[i].item;
                    let bidPrice = sortedItems[i].bidPrice;
                    let quantity = sortedItems[i].quantity;

                    // 创建图标
                    let svgIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                    svgIcon.setAttribute('width', isMobile ? '12' : '20');
                    svgIcon.setAttribute('height', isMobile ? '12' : '20');
                    svgIcon.style.marginRight = '3px';
                    svgIcon.style.verticalAlign = 'middle';

                    let useElement = document.createElementNS('http://www.w3.org/2000/svg', 'use');
                    useElement.setAttribute('href', `${item_icon_url}#${lootItems[item].ID.split('/').pop()}`);
                    svgIcon.appendChild(useElement);

                    // 显示物品数量、图标和名称
                    dataHtml += `
					<div style="display: flex; align-items: center; background-color: #2c2e45; border-radius: 5px; padding: ${isMobile ? '3px' : '8px'}; margin-bottom: ${isMobile ? '3px' : '8px'}; border: 1px solid #98a7e9; white-space: nowrap; flex-shrink: 0;">
						<span style="color: white; margin-right: 3px; min-width: ${isMobile ? maxQuantityLength * 5 : maxQuantityLength * 8}px; text-align: center; font-size: ${isMobile ? '10px' : '16px'}; line-height: 1.2;">${quantity}</span>
						${svgIcon.outerHTML}
						<span style="color: white; white-space: nowrap; font-size: ${isMobile ? '10px' : '16px'}; line-height: 1.2;">${isCN && e2c[item] ? e2c[item] : item}</span>
					</div>`;
                }
                dataHtml += '</div>';
            }
            dataHtml += '</div>';

            // 创建弹窗
            let popup = document.createElement('div');
            popup.style.position = 'fixed';
            popup.style.top = '50%';
            popup.style.left = '50%';
            popup.style.transform = 'translate(-50%, -50%)';
            popup.style.backgroundColor = '#131419';
            popup.style.border = '1px solid #98a7e9';
            popup.style.padding = isMobile ? '10px 10px 10px' : '20px 20px 20px';
            popup.style.borderRadius = '10px';
            popup.style.zIndex = '10000';
            popup.style.maxWidth = '90%';
            popup.style.maxHeight = '90%';
            popup.style.overflowX = 'auto';
            popup.style.overflowY = 'auto';
            popup.style.whiteSpace = 'nowrap';
            popup.innerHTML = dataHtml;

            const newElement = document.createElement('div');
            newElement.textContent = `${EPH.toFixed(1)} EPH`;
            newElement.style.position = 'absolute';
            newElement.style.top = '0';
            newElement.style.left = '50%';
            newElement.style.transform = 'translateX(-50%)';
            newElement.style.height = isMobile ? '10px' : '20px';
            newElement.style.minWidth = isMobile ? '80px' : '160px';
            newElement.style.display = 'flex';
            newElement.style.alignItems = 'center';
            newElement.style.justifyContent = 'center';
            newElement.style.backgroundColor = '#4357af';
            newElement.style.borderRadius = '0 0 5px 5px';
            newElement.style.fontSize = isMobile ? '8px' : '16px';
            newElement.style.color = 'white';
            newElement.style.fontWeight = 'bold';
            newElement.style.lineHeight = '1';
            newElement.style.zIndex = '1';

            // 添加关闭按钮
            let closeButton = document.createElement('button');
            closeButton.textContent = '关闭';
            closeButton.style.position = 'sticky';
            closeButton.style.bottom = '0';
            closeButton.style.display = 'block';
            closeButton.style.margin = '5px auto 0 auto';
            closeButton.style.backgroundColor = '#4357af';
            closeButton.style.color = 'white';
            closeButton.style.border = 'none';
            closeButton.style.padding = isMobile ? '5px 10px' : '10px 20px';
            closeButton.style.borderRadius = '5px';
            closeButton.style.cursor = 'pointer';
            closeButton.style.fontSize = isMobile ? '12px' : '14px';
            closeButton.onclick = function() {
                document.body.removeChild(popup);
            };
            popup.appendChild(newElement);
            popup.appendChild(closeButton);
            document.body.appendChild(popup);
        });

        // 将按钮插入到最后一个标签后面
        var lastTab = tabsContainer.children[tabsContainer.children.length - 1];
        tabsContainer.insertBefore(battlePlayerLootButton, lastTab.nextSibling);

        // 添加按钮样式
        var style = document.createElement('style');
        style.innerHTML = `
			.Button_battlePlayerLoot__custom {
				background-color: #db5454;
				color: white;
				border-radius: 5px;
				padding: 5px 10px;
				cursor: pointer;
				transition: background-color 0.3s ease;
			}
			.Button_battlePlayerLoot__custom:hover {
				background-color: #ff6b6b;
			}
		`;
        document.head.appendChild(style);
    }

    //菜单
    GM_registerMenuCommand('打印所有箱子掉落物', function() {
        console.log('箱子掉落物列表:', formattedChestDropData);
    });

    function createWindowBase() {
        let windowDiv = document.createElement('div');
        windowDiv.className = 'visualization-window';
        windowDiv.style.position = 'fixed';
        windowDiv.style.top = '50%';
        windowDiv.style.left = '50%';
        windowDiv.style.transform = 'translate(-50%, -50%)';
        windowDiv.style.minWidth = '300px';
        windowDiv.style.maxWidth = 'min(400px, 90vw)';
        windowDiv.style.maxHeight = '80vh';
        windowDiv.style.backgroundColor = '#131419';
        windowDiv.style.border = '1px solid #98a7e9';
        windowDiv.style.borderRadius = '10px';
        windowDiv.style.zIndex = '10000';
        windowDiv.style.padding = '20px';
        windowDiv.style.boxSizing = 'border-box';
        windowDiv.style.display = 'flex';
        windowDiv.style.flexDirection = 'column';
        windowDiv.style.gap = '15px';
        windowDiv.style.color = '#ffffff';
        windowDiv.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.25)';
        windowDiv.style.overflow = 'hidden';
        return windowDiv;
    }

    function createVisualizationWindow(chestData) {
        let oldWindow = document.querySelector('.visualization-window');
        if (oldWindow) oldWindow.remove();

        let windowDiv = createWindowBase();
        windowDiv.style.minHeight = '300px';
        windowDiv.style.maxWidth = '400px';

        // 标题
        let title = document.createElement('h1');
        title.innerText = isCN ? '选择角色' : 'Select Character';
        title.style.color = '#98a7e9';
        title.style.margin = '0';
        title.style.fontSize = '1.5em';
        title.style.textAlign = 'center';
        windowDiv.appendChild(title);

        // 内容区域
        let contentDiv = document.createElement('div');
        contentDiv.style.flex = '1';
        contentDiv.style.overflowY = 'auto';
        contentDiv.style.paddingRight = '8px';
        contentDiv.style.display = 'flex';
        contentDiv.style.flexDirection = 'column';
        contentDiv.style.gap = '10px';

        // 玩家列表
        for (let playerID in chestData) {
            const playerData = chestData[playerID];
            const playerName = playerData.玩家昵称;

            let playerBox = document.createElement('div');
            playerBox.style.display = 'flex';
            playerBox.style.alignItems = 'center';
            playerBox.style.border = '1px solid #98a7e9';
            playerBox.style.borderRadius = '8px';
            playerBox.style.padding = '12px';
            playerBox.style.cursor = 'pointer';
            playerBox.style.backgroundColor = '#1e1e2f';
            playerBox.style.transition = 'all 0.3s ease';

            // 悬停效果
            playerBox.onmouseenter = () => {
                playerBox.style.backgroundColor = '#2c2e45';
                playerBox.style.transform = 'translateX(5px)';
            };
            playerBox.onmouseleave = () => {
                playerBox.style.backgroundColor = '#1e1e2f';
                playerBox.style.transform = 'none';
            };

            playerBox.onclick = () => showChestList(playerID, playerName, playerData.开箱数据);

            // 玩家名称
            let playerText = document.createElement('span');
            playerText.style.flex = '1';
            playerText.style.fontSize = '1.1em';
            playerText.style.color = '#ffffff';
            playerText.textContent = playerName;

            // 删除按钮
            let deleteButton = document.createElement('button');
            deleteButton.textContent = '×';
            deleteButton.style.backgroundColor = 'red';
            deleteButton.style.color = 'white';
            deleteButton.style.border = 'none';
            deleteButton.style.borderRadius = '50%';
            deleteButton.style.width = '24px';
            deleteButton.style.height = '24px';
            deleteButton.style.cursor = 'pointer';
            deleteButton.onclick = (e) => {
                e.stopPropagation(); // 防止触发父元素的点击事件
                if (confirm(`是否删除 ${playerName} 的全部开箱数据？`)) {
                    deletePlayerChestData(playerID);
                    createVisualizationWindow(JSON.parse(localStorage.getItem('Edible_Tools')).Chest_Open_Data);
                }
            };

            playerBox.appendChild(playerText);
            playerBox.appendChild(deleteButton);
            contentDiv.appendChild(playerBox);
        }

        windowDiv.appendChild(contentDiv);

        // 关闭按钮
        let closeButton = document.createElement('button');
        closeButton.textContent = isCN ? '关闭' : 'Close';
        closeButton.style.marginTop = '10px';
        closeButton.style.padding = '10px';
        closeButton.style.backgroundColor = '#4357af';
        closeButton.style.color = 'white';
        closeButton.style.border = 'none';
        closeButton.style.borderRadius = '5px';
        closeButton.style.cursor = 'pointer';
        closeButton.onclick = () => document.body.removeChild(windowDiv);

        windowDiv.appendChild(closeButton);
        document.body.appendChild(windowDiv);
    }

    function deletePlayerChestData(playerID) {
        let edibleToolsData = JSON.parse(localStorage.getItem('Edible_Tools'));
        if (edibleToolsData && edibleToolsData.Chest_Open_Data) {
            delete edibleToolsData.Chest_Open_Data[playerID];
            localStorage.setItem('Edible_Tools', JSON.stringify(edibleToolsData));
        }
    }

    function showChestList(playerID, playerName, chestData) {
        let oldWindow = document.querySelector('.visualization-window');
        if (oldWindow) oldWindow.remove();

        let windowDiv = createWindowBase();
        windowDiv.style.minHeight = '300px';
        windowDiv.style.maxWidth = '400px';

        // 标题
        let title = document.createElement('h1');
        title.innerText = isCN ? '开箱记录' : 'Chest Records';
        title.style.color = '#98a7e9';
        title.style.margin = '0';
        title.style.fontSize = '1.5em';
        title.style.textAlign = 'center';
        windowDiv.appendChild(title);

        // 内容区域
        let contentDiv = document.createElement('div');
        contentDiv.style.flex = '1';
        contentDiv.style.overflowY = 'auto';
        contentDiv.style.paddingRight = '8px';
        contentDiv.style.display = 'flex';
        contentDiv.style.flexDirection = 'column';
        contentDiv.style.gap = '10px';

        // 箱子列表
        for (let chestName in chestData) {
            let chest = chestData[chestName];

            let chestBox = document.createElement('div');
            chestBox.style.display = 'flex';
            chestBox.style.alignItems = 'center';
            chestBox.style.border = '1px solid #98a7e9';
            chestBox.style.borderRadius = '8px';
            chestBox.style.padding = '12px';
            chestBox.style.cursor = 'pointer';
            chestBox.style.backgroundColor = '#1e1e2f';
            chestBox.style.transition = 'all 0.3s ease';

            // 悬停效果
            chestBox.onmouseenter = () => {
                chestBox.style.backgroundColor = '#2c2e45';
                chestBox.style.transform = 'translateX(5px)';
            };
            chestBox.onmouseleave = () => {
                chestBox.style.backgroundColor = '#1e1e2f';
                chestBox.style.transform = 'none';
            };

            chestBox.onclick = () => showChestDetails(playerID, playerName, chestName, chest);

            // 图标
            let svgIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svgIcon.setAttribute('width', '20');
            svgIcon.setAttribute('height', '20');
            svgIcon.style.marginRight = '12px';
            svgIcon.style.flexShrink = '0';

            let useElement = document.createElementNS('http://www.w3.org/2000/svg', 'use');
            try {
                let iconId = item_name_to_hrid[chestName].split('/').pop();
                useElement.setAttribute('href', `${item_icon_url}#${iconId}`);
            } catch (error) {
                useElement.setAttribute('href', `${item_icon_url}#coin`);
            }
            svgIcon.appendChild(useElement);

            // 文字
            let chestText = document.createElement('span');
            chestText.style.flex = '1';
            chestText.style.fontSize = '0.95em';
            chestText.innerHTML = `
                <div style="color: #98a7e9;">${isCN && e2c[chestName] ? e2c[chestName] : chestName}</div>
                <div style="color: #ffffff; font-size: 1.1em;">${chest['总计开箱数量']}</div>
            `;

            // 删除按钮
            let deleteButton = document.createElement('button');
            deleteButton.textContent = '×';
            deleteButton.style.backgroundColor = 'red';
            deleteButton.style.color = 'white';
            deleteButton.style.border = 'none';
            deleteButton.style.borderRadius = '50%';
            deleteButton.style.width = '24px';
            deleteButton.style.height = '24px';
            deleteButton.style.cursor = 'pointer';
            deleteButton.onclick = (e) => {
                e.stopPropagation();
                if (confirm(`是否删除 ${isCN && e2c[chestName] ? e2c[chestName] : chestName} 的开箱数据？`)) {
                    deleteChestData(playerID, chestName);
                    showChestList(playerID, playerName, JSON.parse(localStorage.getItem('Edible_Tools')).Chest_Open_Data[playerID].开箱数据);
                }
            };

            chestBox.appendChild(svgIcon);
            chestBox.appendChild(chestText);
            chestBox.appendChild(deleteButton);
            contentDiv.appendChild(chestBox);
        }

        windowDiv.appendChild(contentDiv);

        // 底部按钮
        let footerDiv = document.createElement('div');
        footerDiv.style.display = 'flex';
        footerDiv.style.gap = '10px';
        footerDiv.style.marginTop = '10px';

        const buttonStyle = {
            flex: '1',
            backgroundColor: '#4357af',
            color: 'white',
            border: 'none',
            padding: '10px',
            borderRadius: '6px',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
            fontSize: '0.95em'
        };

        // 返回按钮
        let backButton = document.createElement('button');
        Object.assign(backButton.style, buttonStyle);
        backButton.innerText = isCN ? '返回' : 'Back';
        backButton.onclick = () => {
            windowDiv.remove();
            createVisualizationWindow(JSON.parse(localStorage.getItem('Edible_Tools')).Chest_Open_Data);
        };

        // 关闭按钮
        let closeButton = document.createElement('button');
        Object.assign(closeButton.style, buttonStyle);
        closeButton.innerText = isCN ? '关闭' : 'Close';
        closeButton.onclick = () => windowDiv.remove();

        footerDiv.appendChild(backButton);
        footerDiv.appendChild(closeButton);
        windowDiv.appendChild(footerDiv);

        document.body.appendChild(windowDiv);
    }

    function deleteChestData(playerID, chestName) {
        let edibleToolsData = JSON.parse(localStorage.getItem('Edible_Tools'));
        if (edibleToolsData && edibleToolsData.Chest_Open_Data && edibleToolsData.Chest_Open_Data[playerID]) {
            delete edibleToolsData.Chest_Open_Data[playerID].开箱数据[chestName];
            localStorage.setItem('Edible_Tools', JSON.stringify(edibleToolsData));
        }
    }

    function showChestDetails(playerID, playerName, chestName, chestData) {
        let oldWindow = document.querySelector('.visualization-window');
        if (oldWindow) oldWindow.remove();

        let detailsWindow = createWindowBase();
        detailsWindow.style.minWidth = '300px';
        detailsWindow.style.maxWidth = '400px';

        // 标题
        let title = document.createElement('div');
        title.style.display = 'flex';
        title.style.alignItems = 'center';
        title.style.justifyContent = 'center';
        title.style.gap = '10px';
        title.style.margin = '0 0 15px 0';

        let titleSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        titleSvg.setAttribute('width', '28');
        titleSvg.setAttribute('height', '28');

        let iconId = item_name_to_hrid[chestName].split('/').pop();
        titleSvg.innerHTML = `<use href="${item_icon_url}#${iconId}"/>`;

        let titleText = document.createElement('span');
        titleText.style.color = '#98a7e9';
        titleText.style.fontSize = '1.4em';
        titleText.textContent = isCN && e2c[chestName] ? e2c[chestName] : chestName;

        title.appendChild(titleSvg);
        title.appendChild(titleText);
        detailsWindow.appendChild(title);

        // 内容区域
        let contentDiv = document.createElement('div');
        contentDiv.style.flex = '1';
        contentDiv.style.overflowY = 'auto';
        contentDiv.style.display = 'flex';
        contentDiv.style.flexDirection = 'column';
        contentDiv.style.gap = '12px';
        contentDiv.style.paddingRight = '8px';

        // 统计卡片
        let statsCard = document.createElement('div');
        statsCard.style.backgroundColor = '#1e1e2f';
        statsCard.style.borderRadius = '8px';
        statsCard.style.padding = '15px';
        statsCard.innerHTML = `
			<div style="color: #98a7e9; margin-bottom: 10px;">📋 ${isCN ? "统计概览" : "Statistics Overview"}</div>
			<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px;">
				<div>${isCN ? "开箱总数" : "Total Open"}</div>
				<div style="color: #ffffff; text-align: right;">${chestData['总计开箱数量']}</div>
				<div>${isCN ? "Ask 总值" : "Total Ask"}</div>
				<div style="color: #4CAF50; text-align: right;">${formatPrice(chestData['总计开箱Ask'])}</div>
				<div>${isCN ? "Bid 总值" : "Total Bid"}</div>
				<div style="color: orange; text-align: right;">${formatPrice(chestData['总计开箱Bid'])}</div>
				<div>${isCN ? (chestData['累计偏差值'] < 0 ? "低于期望" : "高于期望") : (chestData['累计偏差值'] < 0 ? "Below Expectation" : "Above Expectation")}</div>
				<div style="color: ${chestData['累计偏差值'] < 0 ? '#F44336' : '#4CAF50'}; text-align: right;">${formatPrice(Math.abs(chestData['累计偏差值'] || 0))}</div>
				${chestData['总计最高利润'] !== undefined ? `
					<div>${isCN ? "期望利润" : "Expected Profit"}</div>
					<div style="color: ${
						(chestData['总计最低利润'] > 0 && chestData['总计最高利润'] > 0) ? '#4CAF50' :
        (chestData['总计最低利润'] < 0 && chestData['总计最高利润'] < 0) ? '#F44336' :
        '#FFEB3B'
    }; text-align: right;">
						${formatPrice(chestData['总计最低利润'])}～${formatPrice(chestData['总计最高利润'])}
					</div>
				` : ''}
			</div>
		`;
        contentDiv.appendChild(statsCard);

        // 物品列表
        let itemListHeader = document.createElement('div');
        itemListHeader.style.color = '#98a7e9';
        itemListHeader.innerText = isCN ? '🎁 获得物品' : "🎁 Get Item";
        contentDiv.appendChild(itemListHeader);

        const sortedItems = Object.entries(chestData['获得物品']).sort((a, b) => {
            const getValidValue = (val) => val === -1 ? 0 : val;

            const aAsk = getValidValue(a[1]['总计Ask价值']);
            const aBid = getValidValue(a[1]['总计Bid价值']);
            const bAsk = getValidValue(b[1]['总计Ask价值']);
            const bBid = getValidValue(b[1]['总计Bid价值']);

            return (bAsk + bBid) - (aAsk + aBid);
        });

        sortedItems.forEach(([itemName, item]) => {
            let itemBox = document.createElement('div');

            itemBox.style.display = 'flex';
            itemBox.style.alignItems = 'center';
            itemBox.style.backgroundColor = '#1e1e2f';
            itemBox.style.border = '1px solid #98a7e9';
            itemBox.style.borderRadius = '8px';
            itemBox.style.padding = '12px';
            itemBox.style.gap = '10px';

            // 图标
            let svgIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svgIcon.setAttribute('width', '24');
            svgIcon.setAttribute('height', '24');

            let useElement = document.createElementNS('http://www.w3.org/2000/svg', 'use');
            try {
                let iconId = item_name_to_hrid[itemName].split('/').pop();
                useElement.setAttribute('href', `${item_icon_url}#${iconId}`);
            } catch (error) {
                useElement.setAttribute('href', `${item_icon_url}#coin`);
            }
            svgIcon.appendChild(useElement);

            // 文字
            let itemText = document.createElement('div');
            itemText.style.flex = '1';
            itemText.innerHTML = `
            <div style="color: #ffffff;">${isCN && e2c[itemName] ? e2c[itemName] : itemName}</div>
            <div style="color: #98a7e9; font-size: 0.9em;">${isCN ? "数量" : "Count"}: ${formatPrice(item['数量'])}</div>
        `;

            itemBox.appendChild(svgIcon);
            itemBox.appendChild(itemText);
            contentDiv.appendChild(itemBox);
        });

        detailsWindow.appendChild(contentDiv);

        // 底部按钮
        let footerDiv = document.createElement('div');
        footerDiv.style.display = 'flex';
        footerDiv.style.gap = '10px';
        footerDiv.style.marginTop = '10px';

        const buttonStyle = {
            flex: '1',
            backgroundColor: '#4357af',
            color: 'white',
            border: 'none',
            padding: '10px',
            borderRadius: '6px',
            cursor: 'pointer',
            transition: 'background-color 0.3s'
        };

        // 返回按钮
        let backButton = document.createElement('button');
        Object.assign(backButton.style, buttonStyle);
        backButton.innerText = isCN ? '返回' : 'Back';
        backButton.onclick = () => {
            detailsWindow.remove();
            showChestList(playerID, playerName, JSON.parse(localStorage.getItem('Edible_Tools')).Chest_Open_Data[playerID].开箱数据);
        };

        // 关闭按钮
        let closeButton = document.createElement('button');
        Object.assign(closeButton.style, buttonStyle);
        closeButton.innerText = isCN ? '关闭' : 'Close';
        closeButton.onclick = () => detailsWindow.remove();

        footerDiv.appendChild(backButton);
        footerDiv.appendChild(closeButton);
        detailsWindow.appendChild(footerDiv);

        document.body.appendChild(detailsWindow);
    }

    GM_registerMenuCommand('打印全部开箱记录', function() {
        const edibleTools = JSON.parse(localStorage.getItem('Edible_Tools')) || {};
        const openChestData = edibleTools.Chest_Open_Data || {};
        createVisualizationWindow(openChestData);
    });

    GM_registerMenuCommand('打印掉落物列表', function() {
        let dataHtml = '<div style="display: flex; flex-wrap: nowrap;">';
        const minPrice = 10000;
        for (let player in battlePlayerLoot) {
            let totalPrice = 0;
            dataHtml += `<div style="flex: 1 0 auto; min-width: 100px; margin: 10px; padding: 10px; border: 1px solid black;">`;
            dataHtml += `<h3>${player}</h3>`;

            let lootItems = battlePlayerLoot[player];
            for (let item in lootItems) {
                let bidPrice = getSpecialItemPrice(item,"bid") || 0;
                totalPrice += bidPrice*lootItems[item].数量
                if (bidPrice > minPrice) {
                    dataHtml += `<p>${item}: ${lootItems[item].数量}</p>`;
                }
            }
            if (totalPrice > 0) {
                dataHtml += `<p>总计价格: ${formatPrice(totalPrice)}</p>`;
            }
            dataHtml += '</div>';
        }
        dataHtml += '</div>';

        let popup = document.createElement('div');
        popup.style.position = 'fixed';
        popup.style.top = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.backgroundColor = 'white';
        popup.style.border = '1px solid black';
        popup.style.padding = '10px';
        popup.style.zIndex = '10000';
        popup.style.maxWidth = '75%';
        popup.style.overflowX = 'auto';
        popup.style.whiteSpace = 'nowrap';
        popup.innerHTML = dataHtml;

        let closeButton = document.createElement('button');
        closeButton.textContent = '关闭';
        closeButton.style.display = 'block';
        closeButton.style.margin = '20px auto 0 auto';
        closeButton.onclick = function() {
            document.body.removeChild(popup);
        };
        popup.appendChild(closeButton);

        document.body.appendChild(popup);
    });

    function formatToChinesetime(timestamp) {
        const date = new Date(timestamp);
        const beijingOffset = 8 * 60;
        date.setMinutes(date.getMinutes() + date.getTimezoneOffset() + beijingOffset);

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${year}/${month}/${day} ${hours}:${minutes}`;
    }

    function openSettings() {
        const tran_market_list = {
            "/market_listing_status/filled": "已完成",
            "/market_listing_status/active": "进行中",
            "/market_listing_status/cancelled": "取消",
            "/market_listing_status/expired": "超时",
        };
        const market_List_Data = JSON.parse(GM_getValue('market_list', '[]'));
        const hrid2name = item_hrid_to_name;

        // 格式化市场数据
        market_List_Data.forEach(item => {
            item.itemName = hrid2name[item.itemHrid] || item.itemHrid;
            if (item.lastUpdated) {
                item.format_lastUpdated = formatToChinesetime(item.lastUpdated);
            }
        });

        const settingsContainer = document.createElement('div');
        settingsContainer.style.position = 'fixed';
        settingsContainer.style.top = '0';
        settingsContainer.style.left = '0';
        settingsContainer.style.width = '100%';
        settingsContainer.style.height = '100%';
        settingsContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        settingsContainer.style.zIndex = '9999';
        settingsContainer.style.display = 'flex';
        settingsContainer.style.flexDirection = 'column';

        // 页面内容
        const Edible_Tools_HTML = `
            <div style="flex: 1; overflow-y: auto; background-color: #fff; padding: 20px;">
                <header style="background-color: #4CAF50; color: white; padding: 10px 20px; text-align: center;">
                    <h1>银河奶牛数据库</h1>
                </header>
                <div style="display: flex; flex: 1;">
                    <div style="width: 200px; background-color: #f4f4f4; padding: 10px;">
                        <button id="showMarketDataBtn" style="width: 100%; padding: 10px; margin: 5px 0; background-color: #f44336; border: none;">市场数据</button>
                        <button id="showOpenChestDataBtn" style="width: 100%; padding: 10px; margin: 5px 0; background-color: #f44336; border: none;">开箱数据</button>
                        <button id="showEnhancementDataBtn" style="width: 100%; padding: 10px; margin: 5px 0; background-color: #f44336; border: none;">强化数据</button>
                    </div>
                    <div style="flex: 1; padding: 20px; overflow-y: auto; display: block;" id="showMarketDataPage">
                        <h2 style="text-align: center;">市场数据</h2>
                        <div style="text-align: center; margin-bottom: 20px;">
                            <button id="deleteOldDataBtn" style="padding: 10px 20px; margin: 0 10px; background-color: #f44336; color: white; border: none;">删除过时市场数据</button>
                            <button id="deleteSpecificStatusDataBtn" style="padding: 10px 20px; margin: 0 10px; background-color: #f44336; color: white; border: none;">仅保留已完成订单</button>
                        </div>
                        <table class="marketList-table" style="width: 100%; border-collapse: collapse;">
                            <thead>
                                <tr>
                                    <th data-sort="id">订单ID</th>
                                    <th data-sort="characterID">角色ID</th>
                                    <th data-sort="status">状态</th>
                                    <th data-sort="isSell">类型</th>
                                    <th data-sort="itemName">物品</th>
                                    <th data-sort="orderQuantity">数量</th>
                                    <th data-sort="filledQuantity">已交易数量</th>
                                    <th data-sort="price">单价</th>
                                    <th data-sort="total">贸易额</th>
                                    <th data-sort="format_lastUpdated">更新时间</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody id="marketDataTableBody">
                                <!-- 数据表会在这里插入 -->
                            </tbody>
                        </table>
                    </div>
                    <div style="flex: 1; padding: 20px; overflow-y: auto; display: none;" id="OpenChestDataPage">
                        <h2 style="text-align: center;">开箱数据(咕?)</h2>
                    </div>
                    <div style="flex: 1; padding: 20px; overflow-y: auto; display: none;" id="EnhancementDataPage">
                        <h2 style="text-align: center;">强化数据(咕咕～)</h2>
                    </div>
                </div>
            </div>
            <button id="closeSettingsBtn" style="position: absolute; top: 10px; right: 10px; padding: 10px 20px; background-color: red; color: white; border: none;">关闭</button>
            `;
        settingsContainer.innerHTML = Edible_Tools_HTML;
        document.body.appendChild(settingsContainer);

        const marketDataPage = document.getElementById('showMarketDataPage');
        const OpenChestDataPage = document.getElementById('OpenChestDataPage');
        const EnhancementDataPage = document.getElementById('EnhancementDataPage');

        let currentPage = 1; // 当前页码
        let rowsPerPage = 10; // 每页显示的行数

        function showMarketData() {
            marketDataPage.style.display = 'block';
            OpenChestDataPage.style.display = 'none';
            EnhancementDataPage.style.display = 'none';

            const tableBody = document.getElementById('marketDataTableBody');
            const startIndex = (currentPage - 1) * rowsPerPage;
            const endIndex = startIndex + rowsPerPage;
            const paginatedData = market_List_Data.slice(startIndex, endIndex);

            tableBody.innerHTML = paginatedData.map((row, index) => {

                // 创建图标
                let svgIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                svgIcon.setAttribute('width', '20');
                svgIcon.setAttribute('height', '20');
                svgIcon.style.marginRight = '10px';
                svgIcon.style.verticalAlign = 'middle';

                let useElement = document.createElementNS('http://www.w3.org/2000/svg', 'use');
                try {
                    let iconId = row.itemHrid.split('/').pop();
                    useElement.setAttribute('href', `${item_icon_url}#${iconId}`);
                } catch (error) {
                    console.error(`无法找到物品的图标ID:`, error);
                    useElement.setAttribute('href', `${item_icon_url}#coin`);
                }
                svgIcon.appendChild(useElement);

                let translatedName = isCN && e2c[row.itemName] ? e2c[row.itemName] : row.itemName;
                if (row.enhancementLevel > 0) {
                    translatedName = `${translatedName} +${row.enhancementLevel}`;
                }
                let itemNameWithIcon = `${svgIcon.outerHTML}${translatedName}`;

                const globalIndex = startIndex + index; // 计算全局索引
                return `
                <tr data-index="${globalIndex}">
                    <td>${row.id}</td>
                    <td>${row.characterID}</td>
                    <td>${tran_market_list[row.status] || row.status}</td>
                    <td>${row.isSell ? '出售' : '收购'}</td>
                    <td>${itemNameWithIcon}</td>
                    <td>${(row.orderQuantity).toLocaleString()}</td>
                    <td>${(row.filledQuantity).toLocaleString()}</td>
                    <td>${(row.price).toLocaleString()}</td>
                    <td>${(row.price * row.filledQuantity).toLocaleString()}</td>
                    <td>${row.format_lastUpdated}</td>
                    <td><button class="delete-btn">删除</button></td>
                </tr>
                `;
            }).join('');

            updatePaginationControls();
            attachDeleteListeners();
        }
        // 添加分页控件
        const paginationControls = document.createElement('div');
        paginationControls.style.textAlign = 'center';
        paginationControls.style.marginTop = '20px';
        paginationControls.innerHTML = `
            <button id="prevPageBtn" style="padding: 5px 10px; margin: 0 5px;">上一页</button>
            <span id="currentPageDisplay">第 ${currentPage} 页</span>
            <button id="nextPageBtn" style="padding: 5px 10px; margin: 0 5px;">下一页</button>
            <label style="margin-left: 10px;">
                每页显示
                <input id="rowsPerPageInput" type="number" value="${rowsPerPage}" min="1" style="width: 50px; text-align: center;">
                行
            </label>
        `;

        marketDataPage.appendChild(paginationControls);

        // 更新分页控件状态
        function updatePaginationControls() {
            const totalPages = Math.ceil(market_List_Data.length / rowsPerPage);
            document.getElementById('currentPageDisplay').textContent = `第 ${currentPage} 页 / 共 ${totalPages} 页`;

            document.getElementById('prevPageBtn').disabled = currentPage === 1;
            document.getElementById('nextPageBtn').disabled = currentPage === totalPages;
        }

        // 绑定分页控件事件
        document.getElementById('prevPageBtn').addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                showMarketData();
            }
        });

        document.getElementById('nextPageBtn').addEventListener('click', () => {
            const totalPages = Math.ceil(market_List_Data.length / rowsPerPage);
            if (currentPage < totalPages) {
                currentPage++;
                showMarketData();
            }
        });

        document.getElementById('rowsPerPageInput').addEventListener('change', (event) => {
            const newRowsPerPage = parseInt(event.target.value, 10);
            if (newRowsPerPage > 0) {
                rowsPerPage = newRowsPerPage;
                currentPage = 1; // 重置到第一页
                showMarketData();
            }
        });
        function ShowOpenChestData() {
            marketDataPage.style.display = 'none';
            OpenChestDataPage.style.display = 'block';
            EnhancementDataPage.style.display = 'none';
        }

        function ShowEnhancementData() {
            marketDataPage.style.display = 'none';
            OpenChestDataPage.style.display = 'none';
            EnhancementDataPage.style.display = 'block';
        }

        showMarketData();

        // 删除单行
        function attachDeleteListeners() {
            document.querySelectorAll('.delete-btn').forEach(button => {
                button.addEventListener('click', (event) => {
                    const row = event.target.closest('tr');
                    const index = parseInt(row.getAttribute('data-index'), 10);
                    market_List_Data.splice(index, 1);

                    GM_setValue('market_list', JSON.stringify(market_List_Data));
                    showMarketData();
                });
            });
        }

        attachDeleteListeners();// 初始绑定删除按钮事件

        // 排序功能
        let sortOrder = { field: null, direction: 1 };// 1 是升序，-1 是降序

        function sortTable(column) {
            const field = column.getAttribute('data-sort');
            const direction = sortOrder.field === field && sortOrder.direction === 1 ? -1 : 1;// 切换排序方向

            market_List_Data.sort((a, b) => {
                if (field === 'total') {
                    return (a.price * a.filledQuantity - b.price * b.filledQuantity) * direction;
                }
                if (typeof a[field] === 'string') {
                    return (a[field].localeCompare(b[field])) * direction;
                }
                return (a[field] - b[field]) * direction;
            });

            // 更新排序状态
            document.querySelectorAll('th').forEach(th => {
                th.classList.remove('sort-asc', 'sort-desc');
            });
            column.classList.add(direction === 1 ? 'sort-asc' : 'sort-desc');

            sortOrder = { field, direction };

            showMarketData();
            attachDeleteListeners();
        }

        // 给每个表头添加点击事件监听器
        document.querySelectorAll('th').forEach(th => {
            th.addEventListener('click', () => {
                sortTable(th);
            });
        });

        // 切换数据库页面
        document.getElementById('showMarketDataBtn').addEventListener('click', showMarketData);
        document.getElementById('showOpenChestDataBtn').addEventListener('click', ShowOpenChestData);
        document.getElementById('showEnhancementDataBtn').addEventListener('click', ShowEnhancementData);

        // 关闭按钮
        document.getElementById('closeSettingsBtn').addEventListener('click', () => {
            document.body.removeChild(settingsContainer);
        });

        // 删除过时市场数据
        document.getElementById('deleteOldDataBtn').addEventListener('click', () => {
            const userInput = prompt("请输入要删除之前的日期 (格式：YYYY-MM-DD)", "");

            if (!userInput) return;

            // 转换用户输入的日期为 Date 对象
            const userDate = new Date(userInput);

            if (isNaN(userDate)) {
                alert("无效的日期格式，请使用 YYYY-MM-DD");
                return;
            }

            let market_list = JSON.parse(GM_getValue('market_list', '[]'));

            // 过滤出所有在用户选择日期之前的订单
            const filteredMarketList = market_list.filter(order => {
                const orderDate = new Date(order.lastUpdated);
                return orderDate >= userDate;
            });

            // 更新并保存新的数据
            GM_setValue('market_list', JSON.stringify(filteredMarketList));

            alert("删除成功，已清理日期之前的数据。");
            document.body.removeChild(settingsContainer);
        });

        document.getElementById('deleteSpecificStatusDataBtn').addEventListener('click', () => {
            let market_list = JSON.parse(GM_getValue('market_list', '[]'));
            const statusToDelete = ["/market_listing_status/active","进行中","/market_listing_status/cancelled","取消","/market_listing_status/expired","超时"];
            const deleteCount = market_list.filter(order => statusToDelete.includes(order.status)).length;

            if (deleteCount === 0) {
                alert("没有需要删除的数据。");
                return;
            }

            const isConfirmed = confirm(`即将删除 ${deleteCount} 条数据，是否继续？`);
            if (!isConfirmed) {
                return;
            }

            const filteredMarketList = market_list.filter(order => !statusToDelete.includes(order.status));

            GM_setValue('market_list', JSON.stringify(filteredMarketList));

            alert("删除成功");

            document.body.removeChild(settingsContainer);
        });

        // 表格样式
        const style = document.createElement('style');
        style.innerHTML = `
    .marketList-table {
        width: 100%;
        border-collapse: collapse;
    }

    .marketList-table, .marketList-table th, .marketList-table td {
        border: 1px solid #f44336;
    }

    .marketList-table th, .marketList-table td {
        padding: 10px;
        text-align: center;
    }

    .marketList-table th {
        background-color: #f2f2f2;
        cursor: pointer;
    }

    .marketList-table th.sort-asc::after {
        content: ' ▲';
    }

    .marketList-table th.sort-desc::after {
        content: ' ▼';
    }
    `;
        document.head.appendChild(style);
    }

function updateMarketData() {
    setInterval(() => {
        let marketData = JSON.parse(localStorage.getItem('MWITools_marketAPI_json')) || { market: {} };
        let updated = false;

        for (let itemName in specialItemPrices) {
            if (specialItemPrices.hasOwnProperty(itemName)) {
                if (!marketData.market[itemName]) {
                    marketData.market[itemName] = {
                        ask: specialItemPrices[itemName].ask,
                        bid: specialItemPrices[itemName].bid
                    };
                    updated = true;
                } else {
                    if (marketData.market[itemName].ask === -1) {
                        marketData.market[itemName].ask = specialItemPrices[itemName].ask;
                        updated = true;
                    }
                    if (marketData.market[itemName].bid === -1) {
                        marketData.market[itemName].bid = specialItemPrices[itemName].bid;
                        updated = true;
                    }
                }
            }
        }

        if (updated) {
            localStorage.setItem('MWITools_marketAPI_json', JSON.stringify(marketData));
        }
    }, 60*1000);
}

updateMarketData();
})();