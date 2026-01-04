// ==UserScript==
// @name         Milky way idle汉化
// @namespace    http://tampermonkey.net/
// @version      2024-03-29
// @description  try to take over the world!
// @license      hewilson Sweety 夜凌 好阳光的小锅巴
// @match        https://www.milkywayidle.com/*
// @match        https://mwisim.github.io/*
// @match        https://mooneycalc.vercel.app/
// @match        https://cowculator.info/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=milkywayidle.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/490242/Milky%20way%20idle%E6%B1%89%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/490242/Milky%20way%20idle%E6%B1%89%E5%8C%96.meta.js
// ==/UserScript==

const excludeRegs = [
    // 一个字母都不包含
    /^[^a-zA-Z]*$/,
    // 排除时间
    /^(\d+h )?(\d+m )?(\d+s)*$/,
    // 等级
    /^Lv.\d+$/,
];

const excludes = [
    "K",
    "M",
    "B",
    "D",
    "H",
    "S",
    "Lv",
    "MAX",
    "wiki",
    "discord",
    "XP",
    "N/A",
];

const excludeSelectors = [
    // 排除人名相关
    '[class^="CharacterName"]',
    // 排除共享链接
    '[class^="SocialPanel_referralLink"]',
    // 排除工会介绍
    '[class^="GuildPanel_message"]',
    // 排除工会名字
    '[class^="GuildPanel_guildName"]',
    // 排除排行榜工会名字
    '[class^="LeaderboardPanel_guildName"]',
    // 排除个人信息工会名字
    '[class^="SharableProfile_guildInfo"]',
    // 排除战斗中的玩家名
    '[class^="BattlePanel_playersArea"] [class^="CombatUnit_name"]',
    // 排除消息内容
    '[class^="ChatMessage_chatMessage"] span',
    // 社区buff贡献者名字
    '[class^="CommunityBuff_contributors"] div',
    // 选择队伍中的队伍名
    '[class^="FindParty_partyName"]',
    // 队伍中的队伍名
    '[class^="Party_partyName"]',
];

const tranCommon = {
    "Reroll": "重置",
    "Back": "返回",
    "level": "等级",
    "Gather": "收集",
    "Produce": "生产",
    "Fight": "战斗",
    "times": "次数",
    "Queued": "排队中",
    "Purple": "紫色",
    "Task": "任务",
    "Reward": "奖励",
    "Go": "前往",
    "Open": "打开",
    "Right Click": "右键点击",
    "enemy": "敌人",
    "all enemies": "所有敌人",
    "physical damage": "物理伤害",
    "ranged damage": "远程伤害",
    "magic damage": "魔法伤害",
    "water damage": "流水伤害",
    "nature damage": "自然伤害",
    "fire damage": "火焰伤害",
    "stun": "眩晕",
    "silence": "沉默",
    "bleed": "流血",
    "burn": "燃烧",
    "total accuracy": "总精准",
    "self": "自己",
    "blind": "致盲",
    "Casts heal on yourself": "对自己施放治疗术",
    "lowest HP ally": "生命值最低的盟友",
    "all allies": "所有盟友",
    "physical reflect power": "物理反伤",
    "physical amplify": "物理伤害增幅",
    "Queued Actions": "排队中的操作",
    "Increases quantity of combat loot": "增加战斗战利品数量",
    "Elite": "精英",
    "Are you sure you want to run away from combat": "你想从战斗中逃跑",
    "No": "否",
    "Yes": "是",
    "Stop": "停止",
    "in combat": "战斗中",
    "unlimited": "无限制",
    "Opened Loot": "打开战利品",
    "You found": "你找到",
    "Are you sure you want to replace your queued actions": "你确定要替换你的排队操作吗",
    "Learn": "学习",

    "Create Party": "创建队伍",
    "Support": "支援",
    "Tank": "坦克",
    "Join": "加入",
    "Party created": "队伍已创建",
    "My Party": "我的队伍",
    "Disband Party": "解散队伍",
    "Any Role": "任意角色",
    "Lv. Req": "等级要求",
    "Slot": "位置",
    "Add Slot": "添加位置",
    "Party disbanded": "队伍已解散",
    "Save": "保存",
    "Edit Party": "编辑队伍",
    "Ready": "准备",
    "Party options saved": "队伍选项已保存",
    "Party is open for recruiting": "队伍正在招募中",
    "You are ready to battle": "你已准备好战斗",
    "You are not ready to battle": "你未准备好战斗",
    "give leadership": "转让领队",
    "Defeat": "击败",
    "Start": "开始",
    "disabled": "已禁用",
    "off": "关",
    "gain": "获得",
    "No Items available": "无物品可用",
    "Respawn": "重生",
}

const tranSkill = {
    "milking": "挤奶",
    "mooooooooo": "哞哞哞...",
    "foraging": "采集",
    "Master the skill of picking up things": "掌握拾取物品的技巧",
    "woodcutting": "伐木",
    "Chop chop": "咔嚓、咔嚓",
    "cheesesmithing": "奶酪锻造",
    "Did you know you can make equipment using these special hardened cheeses": "你知道你可以使用这些特殊的硬质奶酪来制作装备吗？",
    "crafting": "制作",
    "Create weapons, jewelry, and more": "制作武器、珠宝等等",
    "tailoring": "裁缝",
    "Create ranged and magic clothing": "制作远程和魔法服装",
    "cooking": "烹饪",
    "The art of making healthy food": "制作健康食品的艺术",
    "brewing": "冲泡",
    "The art of making tasty drinks": "制作美味饮料的艺术",
    "enhancing": "强化",
    "Make your equipment more powerful": "使你的装备更加强大",
    "combat": "战斗",
    "Fight monsters. Your combat level represents your overall combat effectiveness based on the combination of individual combat skill levels": "与怪物战斗。你的战斗等级代表了你基于个人战斗技能水平组合的整体战斗效果",
    "stamina": "生命",
    "Increases max HP by 10 per level. You gain experience mainly from taking damage and slightly from avoiding damage": "每级增加10点最大生命值。你主要通过受到伤害获得经验，稍微通过避免伤害获得经验",
    "intelligence": "智力",
    "Increases max MP by 10 per level. You gain experience when consuming mana while using abilities": "每级增加10点最大魔力值。你在使用技能时消耗魔力时获得经验",
    "attack": "攻击",
    "Increases your melee accuracy and base attack speed. You gain experience when dealing melee damage, with more experience gained from stab and less from smash": "增加你的近战准确度和基础攻击速度。你在造成近战伤害时获得经验，从刺击中获得更多经验，从钝击中获得较少经验",
    "power": "力量",
    "Increases your melee damage. You gain experience when dealing melee damage, with more experience gained from smash and less from stab": "增加你的近战伤害。你在造成近战伤害时获得经验，从钝击中获得更多经验，从刺击中获得较少经验",
    "defense": "防御",
    "Increases your evasion, armor, and elemental resistances. You gain experience when dodging or mitigating damage": "增加你的闪避、护甲和元素抗性。你在闪避或减轻伤害时获得经验",
    "ranged": "远程",
    "Increases your ranged accuracy, ranged damage, and magic evasion. Ranged attacks can critical strike. You gain experience when dealing ranged damage": "增加你的远程准确度、远程伤害和魔法闪避。远程攻击可以暴击。你在造成远程伤害时获得经验",
    "magic": "魔法",
    "Increases your magic accuracy, magic damage, and elemental resistances. You gain experience when dealing magic damage": "增加你的魔法准确度、魔法伤害和元素抗性。你在造成魔法伤害时获得经验",
}

const transEquip = {
    "Main Hand": "主手",
    "Off Hand": "副手",
    "Two Hand": "双手",
    "Earrings": "耳环",
    "Head": "头部",
    "Neck": "项链",
    "Body": "身体",
    "Legs": "腿部",
    "Hands": "手部",
    "Ring": "戒指",
    "Feet": "脚部",
    "Pouch": "袋子",
    "Milking Tool": "挤奶工具",
    "Foraging Tool": "采集工具",
    "Woodcutting Tool": "伐木工具",
    "Cheese Smithing Tool": "奶酪锻造工具",
    "Cheesesmithing Tool": "奶酪锻造工具",
    "Crafting Tool": "制作工具",
    "Tailoring Tool": "裁缝工具",
    "Cooking Tool": "烹饪工具",
    "Brewing Tool": "冲泡工具",
    "Enhancing Tool": "强化工具"
}

const tranItemCate = {
    "Currencie": "货币",
    "Food": "食物",
    "Drink": "饮料",
    "Resource": "资源",
    "Consumable": "消耗品",
    "Ability Book": "技能书",
    "Equipment": "装备",
    "Tool": "工具"
}

const tranCombatStyle = {
    "Physical": "物理",
    // "ranged": "远程",
    // "magic": "魔法",
}

const tranDamageType = {
    "Slash": "斩击",
    "Stab": "刺击",
    "Smash": "钝击",
    "Water": "水",
    "Nature": "自然",
    "Fire": "火",
}

//货币
const tranItemCurrencies = {
    "Coin": "硬币",
    "Basic currency": "基础货币",
    "Task Token": "任务代币",
    "Task currency. Spend these in the Task Shop": "任务货币。在任务商店中使用这些货币",
    "Cowbell": "牛铃",
    "Premium currency. Buy or spend these in the Cowbell Store": "高级货币。在牛铃商店购买或使用这些货币",
}

//资源(商店顺序)
const tranItemResources = {
    "Bag Of 10 Cowbells": "10牛铃包",
    "Tradable bag of 10 Cowbells. Once opened, the Cowbells can no longer be sold on the market": "可交易的10个牛铃的袋子。一旦打开，牛铃将无法再在市场上出售",
    "Milk": "牛奶",
    "mooo": "哞",
    "Verdant Milk": "翠绿牛奶",
    "moooo": "哞哞",
    "Azure Milk": "蔚蓝牛奶",
    "mooooo": "哞哞哞",
    "Burble Milk": "深紫牛奶",
    "moooooo": "哞哞哞哞",
    "Crimson Milk": "深红牛奶",
    "mooooooo": "哞哞哞哞哞",
    "Rainbow Milk": "彩虹牛奶",
    "moooooooo": "哞哞哞哞哞哞",
    "Holy Milk": "圣奶",
    "mooooooooo": "哞哞哞哞哞哞哞",
    "Cheese": "奶酪",
    "Verdant Cheese": "翠绿奶酪",
    "Azure Cheese": "蔚蓝奶酪",
    "Burble Cheese": "深紫奶酪",
    "Crimson Cheese": "深红奶酪",
    "Rainbow Cheese": "彩虹奶酪",
    "Holy Cheese": "圣奶酪",
    "Log": "原木",
    "Birch Log": "白桦原木",
    "Cedar Log": "雪松原木",
    "Purpleheart Log": "紫心原木",
    "Ginkgo Log": "银杏原木",
    "Redwood Log": "红木",
    "Arcane Log": "神秘原木",
    "Lumber": "木板",
    "Birch Lumber": "白桦木板",
    "Cedar Lumber": "雪松木板",
    "Purpleheart Lumber": "紫心木板",
    "Ginkgo Lumber": "银杏木板",
    "Redwood Lumber": "红木板",
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
    "Cocoon": "茧",
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
    "Mooberry": "月梅",
    "Marsberry": "火星梅",
    "Spaceberry": "太空梅",
    "Apple": "苹果",
    "Orange": "橙子",
    "Plum": "李子",
    "Peach": "桃子",
    "Dragon Fruit": "火龙果",
    "Star Fruit": "杨桃",
    "Arabica Coffee Bean": "小果咖啡豆",
    "Robusta Coffee Bean": "中果咖啡豆",
    "Liberica Coffee Bean": "大果咖啡豆",
    "Excelsa Coffee Bean": "高产咖啡豆",
    "Fieriosa Coffee Bean": "火山咖啡豆",
    "Spacia Coffee Bean": "太空咖啡豆",
    "Green Tea Leaf": "绿茶叶",
    "Black Tea Leaf": "黑茶叶",
    "Burble Tea Leaf": "紫茶叶",
    "Moolong Tea Leaf": "月亮茶叶",
    "Red Tea Leaf": "红茶叶",
    "Emp Tea Leaf": "虚空茶叶",
    "Snake Fang": "蛇牙",
    "Material used in smithing Snake Fang Dirk": "用于锻造蛇牙短剑的材料",
    "Shoebill Feather": "鲸头鹳羽毛",
    "Material used in tailoring Shoebill Shoes": "用于缝鲸头鹳鞋的材料",
    "Snail Shell": "蜗牛壳",
    "Material used in smithing Snail Shell Helmet": "用于锻造蜗牛壳头盔的材料",
    "Crab Pincer": "蟹钳",
    "Material used in smithing Pincer Gloves": "用于锻造螯钳手套的材料",
    "Turtle Shell": "乌龟壳",
    "Material used in smithing Turtle Shell Plate Body or Legs": "用于锻造龟壳胸甲或护腿的材料",
    "Marine Scale": "海洋鳞片",
    "Material used in tailoring Marine Tunic or Chaps": "用于缝航海束腰或裤子的材料",
    "Treant Bark": "树皮",
    "Material used in crafting Treant Shield": "用于制作树人盾的材料",
    "Centaur Hoof": "半人马蹄",
    "Material used in tailoring Centaur Boots": "用于缝半人马靴的材料",
    "Luna Wing": "月神翼",
    "Material used in tailoring Luna Robe Top or Bottoms": "用于缝月亮长袍或裙子的材料",
    "Gobo Rag": "哥布林破布",
    "Material used in tailoring Collector's Boots": "用于缝收藏家靴的材料",
    "Goggles": "护目镜",
    "Material used in smithing Vision Helmet": "用于锻造视觉头盔的材料",
    "Magnifying Glass": "放大镜",
    "Material used in smithing Vision Shield or tailoring Sighted Bracers": "用于锻造视觉盾或缝视觉护腕的材料",
    "Eye Of The Watcher": "观察者之眼",
    "Material used in crafting Eye Watch or Watchful Relic": "用于制作眼睛手表或警戒遗物的材料",
    "Icy Cloth": "冰霜布料",
    "Material used in tailoring Icy Robe Top or Bottoms": "用于缝冰霜长袍上衣或下装的材料",
    "Flaming Cloth": "燃烧的布料",
    "Material used in tailoring Flaming Robe Top or Bottoms": "用于缝燃烧长袍上衣或下装的材料",
    "Sorcerer's Sole": "魔法师的鞋底",
    "Material used in tailoring Sorcerer Boots": "用于缝魔法师靴的材料",
    "Chrono Sphere": "时空球",
    "Material used in tailoring Enchanted Gloves or Chrono Gloves": "用于缝附魔手套或时空手套的材料",
    "Frost Sphere": "冰霜球",
    "Material used in crafting Frost Staff": "用于制作霜之法杖的材料",
    "Panda Fluff": "熊猫绒",
    "Material used in smithing Panda Gloves": "用于锻造熊猫手套的材料",
    "Black Bear Fluff": "黑熊绒",
    "Material used in smithing Black Bear Shoes": "用于锻造黑熊鞋的材料",
    "Grizzly Bear Fluff": "灰熊绒",
    "Material used in smithing Grizzly Bear Shoes": "用于锻造灰熊鞋的材料",
    "Polar Bear Fluff": "北极熊绒",
    "Material used in smithing Polar Bear Shoes": "用于锻造北极熊鞋的材料",
    "Red Panda Fluff": "小熊猫绒",
    "Material used in tailoring Red Chef's Hat or Fluffy Red Hat": "用于缝红色厨师帽或蓬松红帽的材料",
    "Magnet": "磁铁",
    "Material used in smithing Magnetic Gloves": "用于锻造磁力手套的材料",
    "Stalactite Shard": "钟乳石碎片",
    "Material used in smithing Stalactite Spear or Spiked Bulwark": "用于锻造钟乳石长矛或尖刺盾的材料",
    "Living Granite": "活花岗岩",
    "Material used in smithing Granite Bludgeon or Spiked Bulwark": "用于锻造花岗岩重击或尖刺盾的材料",
    "Colossus Core": "巨像核心",
    "Material used in smithing Colossus Plate Body or Legs": "用于锻造巨像板甲胸甲或护腿的材料",
    "Vampire Fang": "吸血鬼牙",
    "Material used in smithing Vampire Fang Dirk or crafting Vampiric Bow": "用于锻造吸血鬼獠牙短剑或制作吸血弓的材料",
    "Werewolf Claw": "狼爪",
    "Material used in smithing Werewolf Slasher or crafting Vampiric Bow": "用于锻造狼人关刀或制作吸血弓的材料",
    "Revenant Anima": "亡者之魂",
    "Material used in tailoring Revenant Tunic or Chaps": "用于缝亡灵束腰外套或裤子的材料",
    "Soul Fragment": "灵魂碎片",
    "Material used in crafting Soul Hunter Crossbow": "用于制作灵魂猎手弩的材料",
    "Infernal Ember": "地狱余烬",
    "Material used in crafting Infernal Battlestaff": "用于制作地狱战斗法杖的材料",
    "Demonic Core": "恶魔核心",
    "Material used in smithing Demonic Plate Body or Legs": "用于锻造恶魔板甲胸甲或护腿的材料",
    "Swamp Essence": "沼泽精华",
    "Used for enhancing special equipment from Swamp Planet": "用于强化沼泽星球的特殊装备",
    "Aqua Essence": "海洋精华",
    "Used for enhancing special equipment from Aqua Planet": "用于强化海洋星球的特殊装备",
    "Jungle Essence": "丛林精华",
    "Used for enhancing special equipment from Jungle Planet": "用于强化丛林星球的特殊装备",
    "Gobo Essence": "哥布林精华",
    "Used for enhancing special equipment from Gobo Planet": "用于强化哥布林星球的特殊装备",
    "Eyessence": "眼球精华",
    "Used for enhancing special equipment from Planet Of The Eyes": "用于强化眼球星球的特殊装备",
    "Sorcerer Essence": "法师精华",
    "Used for enhancing special equipment from Sorcerer's Tower": "用于强化巫师之塔的特殊装备",
    "Bear Essence": "熊精华",
    "Used for enhancing special equipment from Bear With It": "用于强化熊熊星球的特殊装备",
    "Golem Essence": "魔像精华",
    "Used for enhancing special equipment from Golem Cave": "用于强化魔像洞穴的特殊装备",
    "Twilight Essence": "暮光之城精华",
    "Used for enhancing special equipment from Twilight Zone": "用于强化暮光之城的特殊装备",
    "Abyssal Essence": "地狱精华",
    "Used for enhancing special equipment from Infernal Abyss": "用于强化地狱深渊的特殊装备",
    "Star Fragment": "星星碎片",
    "Fragments with a celestial origin found in Meteorite Caches. They can be used to craft jewelry": "在陨石中发现的天体起源的碎片。它们可以用于制作珠宝",
    "Pearl": "珍珠",
    "A shiny gem often found from Treasure Chests": "经常在宝箱中找到的闪亮物品",
    "Amber": "琥珀",
    "Garnet": "石榴石",
    "Jade": "翡翠",
    "Amethyst": "紫水晶",
    "Moonstone": "月亮石",
    "Crushed Pearl": "珍珠碎片",
    "Used to be a piece of pearl": "曾经是一颗珍珠",
    "Crushed Amber": "琥珀碎片",
    "Used to be a piece of amber": "曾经是一块琥珀",
    "Crushed Garnet": "石榴石碎片",
    "Used to be a piece of garnet": "曾经是一颗石榴石",
    "Crushed Jade": "翡翠碎片",
    "Used to be a piece of jade": "曾经是一块翡翠",
    "Crushed Amethyst": "紫水晶碎片",
    "Used to be a piece of amethyst": "曾经是一颗紫水晶",
    "Crushed Moonstone": "月亮石碎片",
    "Used to be a piece of moonstone": "曾经是一块月亮石",
    "Shard Of Protection": "保护碎片",
    "Found from Artisan's Crates. They are used for crafting Mirror of Protection": "从工匠的箱子中获得。它们用于制作保护之镜",
    "Mirror Of Protection": "保护之镜",
    "A rare artifact that functions as a copy of any equipment for enhancing protection": "一种罕见的文物，可以作为任何装备的副本，用于强化保护",
}

// 消耗品(商店顺序)
let tranItemConsumable = {
    "Donut": "甜甜圈",
    "Blueberry Donut": "蓝莓甜甜圈",
    "Blackberry Donut": "黑莓甜甜圈",
    "Strawberry Donut": "草莓甜甜圈",
    "Mooberry Donut": "月莓甜甜圈",
    "Marsberry Donut": "火星莓甜甜圈",
    "Spaceberry Donut": "太空莓甜甜圈",

    "Cupcake": "纸杯蛋糕",
    "Blueberry Cake": "蓝莓蛋糕",
    "Blackberry Cake": "黑莓蛋糕",
    "Strawberry Cake": "草莓蛋糕",
    "Mooberry Cake": "月莓蛋糕",
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
    "Foraging Tea": "采集茶",
    "Woodcutting Tea": "伐木茶",
    "Cooking Tea": "烹饪茶",
    "Brewing Tea": "冲泡茶",
    "Enhancing Tea": "强化茶",
    "Cheesesmithing Tea": "奶酪锻造茶",
    "Crafting Tea": "制作茶",
    "Tailoring Tea": "裁缝茶",

    "Super Milking Tea": "超级挤奶茶",
    "Super Foraging Tea": "超级采集茶",
    "Super Woodcutting Tea": "超级伐木茶",
    "Super Cooking Tea": "超级烹饪茶",
    "Super Brewing Tea": "超级冲泡茶",
    "Super Enhancing Tea": "超级强化茶",
    "Super Cheesesmithing Tea": "超级奶酪锻造茶",
    "Super Crafting Tea": "超级制作茶",
    "Super Tailoring Tea": "超级裁缝茶",

    "Gathering Tea": "收集茶",
    "Gourmet Tea": "双倍茶",
    "Wisdom Tea": "经验茶",
    "Processing Tea": "加工茶",
    "Efficiency Tea": "效率茶",
    "Artisan Tea": "工匠茶",
    "Blessed Tea": "祝福茶",

    "Stamina Coffee": "体力咖啡",
    "Intelligence Coffee": "智力咖啡",
    "Defense Coffee": "防御咖啡",
    "Attack Coffee": "攻击咖啡",
    "Power Coffee": "力量咖啡",
    "Ranged Coffee": "远程咖啡",
    "Magic Coffee": "魔法咖啡",

    "Super Stamina Coffee": "超级体力咖啡",
    "Super Intelligence Coffee": "超级智力咖啡",
    "Super Defense Coffee": "超级防御咖啡",
    "Super Attack Coffee": "超级攻击咖啡",
    "Super Power Coffee": "超级力量咖啡",
    "Super Ranged Coffee": "超级远程咖啡",
    "Super Magic Coffee": "超级魔法咖啡",

    "Wisdom Coffee": "经验咖啡",
    "Lucky Coffee": "幸运咖啡",
    "Swiftness Coffee": "迅捷咖啡",
    "Channeling Coffee": "引导咖啡",
    "Critical Coffee": "暴击咖啡",
}

// 技能书(商店顺序)
let tranItemBook = {
    "Poke": "戳",
    "Pokes the targeted enemy": "戳向目标敌人",
    "Pierce": "刺",
    "Pierces the targeted enemy": "刺穿目标敌人",
    "Puncture": "穿刺",
    "Punctures the targeted enemy's armor, dealing damage and temporarily reducing its armor": "刺破目标敌人的护甲，造成伤害并临时降低其护甲",

    "Scratch": "抓挠",
    "Scratches the targeted enemy": "抓伤目标敌人",
    "Cleave": "劈砍",
    "Cleaves all enemies": "劈砍所有敌人",
    "Maim": "重砍",
    "Maims the targeted enemy and causes bleeding": "重伤目标敌人使之流血",

    "Smack": "锤击",
    "Smacks the targeted enemy": "猛击目标敌人",
    "Sweep": "横扫",
    "Performs a sweeping attack on all enemies": "对所有敌人进行横扫攻击",
    "Stunning Blow": "重锤",
    "Smashes the targeted enemy and has a chance to stun": "击碎目标敌人并有几率眩晕",

    "Quick Shot": "快速射击",
    "Takes a quick shot at the targeted enemy": "对目标敌人进行快速射击",
    "Aqua Arrow": "流水箭",
    "Shoots an arrow made of water at the targeted enemy": "向目标敌人射出水箭",
    "Flame Arrow": "火焰箭",
    "Shoots a flaming arrow at the targeted enemy": "向目标敌人射出火焰箭",
    "Rain Of Arrows": "箭雨",
    "Shoots a rain of arrows on all enemies": "向所有敌人射出箭雨",
    "Silencing Shot": "沉默箭",
    "Takes a shot at the targeted enemy, temporarily silencing them": "对目标敌人进行射击，并沉默目标",
    "Steady Shot": "稳定射击",
    "Takes a shot at the targeted enemy with greatly enhanced accuracy": "以极高的准确性对目标敌人进行射击",

    "Water Strike": "流水冲击",
    "Casts a water strike at the targeted enemy": "对目标敌人射出流水",
    "Ice Spear": "冰矛",
    "Casts an ice spear at the targeted enemy": "对目标敌人施放冰矛",
    "Frost Surge": "冰霜激涌",
    "Casts frost surge at all enemies": "对所有敌人施放冰霜激涌",

    "Entangle": "缠绕",
    "Entangles the targeted enemy": "缠绕目标敌人",
    "Toxic Pollen": "毒性花粉",
    "Casts toxic pollen at all enemies": "对所有敌人施放毒性花粉",
    "Nature's Veil": "自然面纱",
    "Cast's a veil over all enemies, causing damage and temporary blindness": "给所有敌人穿上面纱，造成伤害和暂时致盲",

    "Fireball": "火球",
    "Casts a fireball at the targeted enemy": "对目标敌人施放火球",
    "Flame Blast": "火焰冲击",
    "Casts a flame blast at all enemies": "对所有敌人施放火焰冲击",
    "Firestorm": "火焰风暴",
    "Casts a firestorm at all enemies": "对所有敌人施放火焰风暴",

    "Minor Heal": "小治疗",
    "Casts minor heal on yourself": "对自己施放小治疗术",
    "Heal": "治疗",
    "Casts heal on yourself": "对自己施放治疗术",
    "Quick Aid": "快速援助",
    "Casts heal on the ally with the lowest HP percentage": "对生命值百分比最低的队友施放治疗术",
    "Rejuvenate": "恢复活力",
    "Heals all allies": "治疗所有队友",

    "Taunt": "嘲讽",
    "Greatly increases threat rating": "大幅增加威胁等级",
    "Provoke": "挑衅",
    "Tremendously increases threat rating": "极大地增加威胁等级",
    "Toughness": "坚韧",
    "Greatly increases armor and resistances temporarily": "临时大幅增加护甲和抗性",
    "Elusiveness": "闪避",
    "Greatly increases evasion temporarily": "临时大幅增加闪避",
    "Precision": "精确",
    "Greatly increases accuracy temporarily": "临时大幅增加准确性",
    "Berserk": "狂暴",
    "Greatly increases physical damage temporarily": "临时大幅增加物理伤害",
    "Frenzy": "狂躁",
    "Greatly increases attack speed temporarily": "临时大幅增加攻击速度",
    "Elemental Affinity": "元素亲和",
    "Greatly increases elemental damage temporarily": "临时大幅增加元素伤害",
    "Spike Shell": "尖刺壳",
    "Gains physical reflect power temporarily": "临时获得物理反射能力",
    "Vampirism": "吸血",
    "Gains lifesteal temporarily": "临时获得生命偷取",

    "Revive": "复活",
    "Revives a dead ally": "复活一个死亡的队友",
    "Insanity": "疯狂",
    "Increases damage, attack speed, and cast speed temporarily at the cost of HP": "以生命值为代价，临时增加伤害、攻击速度和施法速度",
    "Invincible": "坚毅",
    "Tremendously increases armor, resistances, and tenacity temporarily": "临时极大增加护甲、抗性和坚韧",
    "Fierce Aura": "物理光环",
    "Increases physical amplify and armor for all allies": "增加所有队友的物理强化和护甲",
    "Aqua Aura": "流水光环",
    "Increases water amplify and resistance for all allies": "增加所有队友的水属性强化和抗性",
    "Sylvan Aura": "自然光环",
    "Increases nature amplify and resistance for all allies": "增加所有队友的自然属性强化和抗性",
    "Flame Aura": "火焰光环",
    "Increases fire amplify and resistance for all allies": "增加所有队友的火属性强化和抗性",
    "Speed Aura": "速度光环",
    "Increases attack speed and cast speed for all allies": "增加所有队友的攻击速度和施法速度",
    "Critical Aura": "暴击光环",
    "Increases critical rate for all allies": "增加所有队友的暴击率",
}

//装备(商店顺序)
const tranItemEquipment = {
    "Gobo Stabber": "哥布林长剑",
    "Gobo Slasher": "哥布林关刀",
    "Gobo Smasher": "哥布林狼牙棒",
    "Spiked Bulwark": "尖刺盾",
    "Werewolf Slasher": "狼人关刀",
    "Gobo Shooter": "哥布林弹弓",
    "Vampiric Bow": "吸血弓",
    "Gobo Boomstick": "哥布林火枪",

    "Cheese Bulwark": "奶酪盾",
    "Verdant Bulwark": "翠绿盾",
    "Azure Bulwark": "蔚蓝盾",
    "Burble Bulwark": "深紫盾",
    "Crimson Bulwark": "深红盾",
    "Rainbow Bulwark": "彩虹盾",
    "Holy Bulwark": "神圣盾",

    "Wooden Bow": "木弓",
    "Birch Bow": "桦木弓",
    "Cedar Bow": "雪松弓",
    "Purpleheart Bow": "紫心弓",
    "Ginkgo Bow": "银杏弓",
    "Redwood Bow": "红木弓",
    "Arcane Bow": "神秘弓",

    "Stalactite Spear": "钟乳石长矛",
    "Granite Bludgeon": "花岗岩大棒",
    "Soul Hunter Crossbow": "灵魂猎手弩",
    "Frost Staff": "冰霜法杖",
    "Infernal Battlestaff": "炼狱法杖",

    "Cheese Sword": "奶酪剑",
    "Verdant Sword": "翠绿剑",
    "Azure Sword": "蔚蓝剑",
    "Burble Sword": "深紫剑",
    "Crimson Sword": "深红剑",
    "Rainbow Sword": "彩虹剑",
    "Holy Sword": "神圣剑",

    "Cheese Spear": "奶酪矛",
    "Verdant Spear": "翠绿矛",
    "Azure Spear": "蔚蓝矛",
    "Burble Spear": "深紫矛",
    "Crimson Spear": "深红矛",
    "Rainbow Spear": "彩虹矛",
    "Holy Spear": "神圣矛",

    "Cheese Mace": "奶酪狼牙棒",
    "Verdant Mace": "翠绿狼牙棒",
    "Azure Mace": "蔚蓝狼牙棒",
    "Burble Mace": "深紫狼牙棒",
    "Crimson Mace": "深红狼牙棒",
    "Rainbow Mace": "彩虹狼牙棒",
    "Holy Mace": "神圣狼牙棒",

    "Wooden Crossbow": "木弩",
    "Birch Crossbow": "桦木弩",
    "Cedar Crossbow": "雪松弩",
    "Purpleheart Crossbow": "紫心木弩",
    "Ginkgo Crossbow": "银杏弩",
    "Redwood Crossbow": "红木弩",
    "Arcane Crossbow": "神秘弩",

    "Wooden Water Staff": "木水法杖",
    "Birch Water Staff": "桦木水法杖",
    "Cedar Water Staff": "雪松水法杖",
    "Purpleheart Water Staff": "紫心木水法杖",
    "Ginkgo Water Staff": "银杏水法杖",
    "Redwood Water Staff": "红木水法杖",
    "Arcane Water Staff": "神秘水法杖",

    "Wooden Nature Staff": "木自然法杖",
    "Birch Nature Staff": "桦木自然法杖",
    "Cedar Nature Staff": "雪松自然法杖",
    "Purpleheart Nature Staff": "紫心木自然法杖",
    "Ginkgo Nature Staff": "银杏自然法杖",
    "Redwood Nature Staff": "红木自然法杖",
    "Arcane Nature Staff": "神秘自然法杖",

    "Wooden Fire Staff": "木火法杖",
    "Birch Fire Staff": "桦木火法杖",
    "Cedar Fire Staff": "雪松火法杖",
    "Purpleheart Fire Staff": "紫心木火法杖",
    "Ginkgo Fire Staff": "银杏火法杖",
    "Redwood Fire Staff": "红木火法杖",
    "Arcane Fire Staff": "神秘火法杖",

    "Eye Watch": "眼睛手表",
    "Snake Fang Dirk": "蛇牙短剑",
    "Vision Shield": "视觉盾",
    "Gobo Defender": "哥布林防御者",
    "Vampire Fang Dirk": "吸血鬼短剑",
    "Treant Shield": "树人盾",
    "Tome Of Healing": "治疗之书",
    "Tome Of The Elements": "元素之书",
    "Watchful Relic": "警戒遗物",

    "Cheese Buckler": "奶酪圆盾",
    "Verdant Buckler": "翠绿圆盾",
    "Azure Buckler": "蔚蓝圆盾",
    "Burble Buckler": "深紫圆盾",
    "Crimson Buckler": "深红圆盾",
    "Rainbow Buckler": "彩虹圆盾",
    "Holy Buckler": "神圣圆盾",

    "Wooden Shield": "木盾",
    "Birch Shield": "桦木盾",
    "Cedar Shield": "雪松盾",
    "Purpleheart Shield": "紫心木盾",
    "Ginkgo Shield": "银杏盾",
    "Redwood Shield": "红木盾",
    "Arcane Shield": "神秘盾",

    "Red Chef's Hat": "红色厨师帽",
    "Snail Shell Helmet": "蜗牛壳头盔",
    "Vision Helmet": "视觉头盔",
    "Fluffy Red Hat": "蓬松红帽子",

    "Cheese Helmet": "奶酪头盔",
    "Verdant Helmet": "翠绿头盔",
    "Azure Helmet": "蔚蓝头盔",
    "Burble Helmet": "深紫头盔",
    "Crimson Helmet": "深红头盔",
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

    "Gator Vest": "鳄鱼背心",
    "Turtle Shell Body": "龟壳板甲",
    "Colossus Plate Body": "巨像板甲",
    "Demonic Plate Body": "恶魔板甲",
    "Marine Tunic": "航海束腰",
    "Revenant Tunic": "亡灵外套",
    "Icy Robe Top": "冰霜长袍",
    "Flaming Robe Top": "燃烧长袍",
    "Luna Robe Top": "月亮长袍",

    "Cheese Plate Body": "奶酪板甲",
    "Verdant Plate Body": "翠绿板甲",
    "Azure Plate Body": "蔚蓝板甲",
    "Burble Plate Body": "深紫板甲",
    "Crimson Plate Body": "深红板甲",
    "Rainbow Plate Body": "彩虹板甲",
    "Holy Plate Body": "神圣板甲",

    "Rough Tunic": "粗糙束腰",
    "Reptile Tunic": "爬行动物束腰",
    "Gobo Tunic": "哥布林束腰",
    "Beast Tunic": "野兽束腰",
    "Umbral Tunic": "暗影束腰",

    "Cotton Robe Top": "棉布上衣",
    "Linen Robe Top": "亚麻上衣",
    "Bamboo Robe Top": "竹上衣",
    "Silk Robe Top": "丝绸上衣",
    "Radiant Robe Top": "光辉上衣",

    "Turtle Shell Legs": "龟壳护腿",
    "Colossus Plate Legs": "巨像板甲护腿",
    "Demonic Plate Legs": "恶魔板甲护腿",
    "Marine Chaps": "航海护腿",
    "Revenant Chaps": "亡灵护腿",
    "Icy Robe Bottoms": "冰霜下装",
    "Flaming Robe Bottoms": "燃烧下装",
    "Luna Robe Bottoms": "月亮下装",

    "Cheese Plate Legs": "奶酪板甲护腿",
    "Verdant Plate Legs": "翠绿板甲护腿",
    "Azure Plate Legs": "蔚蓝板甲护腿",
    "Burble Plate Legs": "深紫板甲护腿",
    "Crimson Plate Legs": "深红板甲护腿",
    "Rainbow Plate Legs": "彩虹板甲护腿",
    "Holy Plate Legs": "神圣板甲护腿",

    "Rough Chaps": "粗糙护腿",
    "Reptile Chaps": "爬行动物护腿",
    "Gobo Chaps": "哥布林护腿",
    "Beast Chaps": "野兽护腿",
    "Umbral Chaps": "暗影护腿",

    "Cotton Robe Bottoms": "棉长袍下装",
    "Linen Robe Bottoms": "亚麻长袍下装",
    "Bamboo Robe Bottoms": "竹长袍下装",
    "Silk Robe Bottoms": "丝长袍下装",
    "Radiant Robe Bottoms": "光辉长袍下装",

    "Enchanted Gloves": "附魔手套",
    "Pincer Gloves": "螯钳手套",
    "Panda Gloves": "熊猫手套",
    "Magnetic Gloves": "磁力手套",
    "Sighted Bracers": "瞄准护腕",
    "Chrono Gloves": "时空手套",

    "Cheese Gauntlets": "奶酪臂铠",
    "Verdant Gauntlets": "翠绿臂铠",
    "Azure Gauntlets": "蔚蓝臂铠",
    "Burble Gauntlets": "深紫臂铠",
    "Crimson Gauntlets": "深红臂铠",
    "Rainbow Gauntlets": "彩虹臂铠",
    "Holy Gauntlets": "神圣臂铠",

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
    "Grizzly Bear Shoes": "灰熊鞋",
    "Polar Bear Shoes": "北极熊鞋",
    "Centaur Boots": "半人马靴",
    "Sorcerer Boots": "巫师靴",

    "Cheese Boots": "奶酪靴",
    "Verdant Boots": "翠绿靴",
    "Azure Boots": "蔚蓝靴",
    "Burble Boots": "深紫靴",
    "Crimson Boots": "深红靴",
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

    "Necklace Of Efficiency": "效率项链",
    "Fighter Necklace": "战士项链",
    "Ranger Necklace": "游侠项链",
    "Wizard Necklace": "巫师项链",
    "Necklace Of Wisdom": "智慧项链",

    "Earrings Of Gathering": "采集耳环",
    "Earrings Of Armor": "护甲耳环",
    "Earrings Of Regeneration": "回复耳环",
    "Earrings Of Resistance": "抗性耳环",
    "Earrings Of Rare Find": "稀有发现耳环",

    "Ring Of Gathering": "采集戒指",
    "Ring Of Armor": "护甲戒指",
    "Ring Of Regeneration": "回复戒指",
    "Ring Of Resistance": "抗性戒指",
    "Ring Of Rare Find": "稀有发现戒指",

    "Small Pouch": "小袋子",
    "Medium Pouch": "中袋子",
    "Large Pouch": "大袋子",
    "Giant Pouch": "巨大袋子",
}

//工具(商店顺序)
const tranItemTool = {
    "Cheese Brush": "奶酪刷子",
    "Verdant Brush": "翠绿刷子",
    "Azure Brush": "蔚蓝刷子",
    "Burble Brush": "深紫刷子",
    "Crimson Brush": "深红刷子",
    "Rainbow Brush": "彩虹刷子",
    "Holy Brush": "神圣刷子",

    "Cheese Shears": "奶酪剪刀",
    "Verdant Shears": "翠绿剪刀",
    "Azure Shears": "蔚蓝剪刀",
    "Burble Shears": "深紫剪刀",
    "Crimson Shears": "深红剪刀",
    "Rainbow Shears": "彩虹剪刀",
    "Holy Shears": "神圣剪刀",

    "Cheese Hatchet": "奶酪斧头",
    "Verdant Hatchet": "翠绿斧头",
    "Azure Hatchet": "蔚蓝斧头",
    "Burble Hatchet": "深紫斧头",
    "Crimson Hatchet": "深红斧头",
    "Holy Hatchet": "神圣斧头",
    "Rainbow Hatchet": "彩虹斧头",

    "Cheese Hammer": "奶酪锤",
    "Verdant Hammer": "翠绿锤",
    "Azure Hammer": "蔚蓝锤",
    "Burble Hammer": "深紫锤",
    "Crimson Hammer": "深红锤",
    "Rainbow Hammer": "彩虹锤",
    "Holy Hammer": "神圣锤",

    "Cheese Chisel": "奶酪凿子",
    "Verdant Chisel": "翠绿凿子",
    "Azure Chisel": "蔚蓝凿子",
    "Burble Chisel": "深紫凿子",
    "Crimson Chisel": "深红凿子",
    "Rainbow Chisel": "彩虹凿子",
    "Holy Chisel": "神圣凿子",

    "Cheese Spatula": "奶酪铲子",
    "Verdant Spatula": "翠绿铲子",
    "Azure Spatula": "蔚蓝铲子",
    "Burble Spatula": "深紫铲子",
    "Crimson Spatula": "深红铲子",
    "Rainbow Spatula": "彩虹铲子",
    "Holy Spatula": "神圣铲子",

    "Cheese Needle": "奶酪针",
    "Verdant Needle": "翠绿针",
    "Azure Needle": "蔚蓝针",
    "Burble Needle": "深紫针",
    "Crimson Needle": "深红针",
    "Rainbow Needle": "彩虹针",
    "Holy Needle": "神圣针",

    "Cheese Pot": "奶酪锅",
    "Verdant Pot": "翠绿锅",
    "Azure Pot": "蔚蓝锅",
    "Burble Pot": "深紫锅",
    "Crimson Pot": "深红锅",
    "Rainbow Pot": "彩虹锅",
    "Holy Pot": "神圣锅",

    "Cheese Enhancer": "奶酪强化器",
    "Verdant Enhancer": "翠绿强化器",
    "Azure Enhancer": "蔚蓝强化器",
    "Burble Enhancer": "深紫强化器",
    "Crimson Enhancer": "赤红强化器",
    "Rainbow Enhancer": "彩虹强化器",
    "Holy Enhancer": "神圣强化器",
}

// 宝箱
let tranItemBox = {
    "Small Meteorite Cache": "小型陨石",
    "Can be found while gathering. Looks like it contains items inside": "在采集时可以找到。看起来里面装着物品！",
    "Medium Meteorite Cache": "中型陨石",
    "Large Meteorite Cache": "大型陨石",

    "Small Artisan's Crate": "工匠的小型箱子",
    "Can be found during production skills. Looks like it contains items inside": "在生产时可以找到。看起来里面装着物品！",
    "Medium Artisan's Crate": "工匠的中型箱子",
    "Large Artisan's Crate": "工匠的大型箱子",

    "Small Treasure Chest": "小型宝箱",
    "Can be found from monsters. Looks like it contains items inside": "可以从怪物身上找到。看起来里面装有物品！",
    "Medium Treasure Chest": "中型宝箱",
    "Large Treasure Chest": "大型宝箱",

    "Purple's Gift": "紫色的礼物",
}

// 挤奶奶牛
let tranCow = {
    "Cow": "奶牛",
    "Verdant Cow": "翠绿奶牛",
    "Azure Cow": "蔚蓝奶牛",
    "Burble Cow": "深紫奶牛",
    "Crimson Cow": "深红奶牛",
    "Unicow": "彩虹奶牛",
    "Holy Cow": "圣牛",
}

// 采集地点
let tranForagPlace = {
    "farmland": "农场",
    "shimmering lake": "波光湖",
    "misty forest": "迷失森林",
    "burble beach": "深紫沙滩",
    "silly cow valley": "傻牛谷",
    "olympus mons": "奥林匹斯山",
    "asteroid belt": "小行星带",
}

// 怪物
let tranMonster = {
    "Smelly Planet": "臭臭星球",
    "Fly": "苍蝇",
    "Jerry": "杰瑞",
    "Skunk": "臭鼬",
    "Porcupine": "豪猪",
    "Slimy": "史莱姆",

    "Swamp Planet": "沼泽星球",
    "Frogger": "青蛙",
    "Thnake": "蛇",
    "Swampy": "蜘蛛",
    "Sherlock": "鳄鱼",
    "Giant Shoebill": "大鲸头鹳",

    "Aqua Planet": "海洋星球",
    "Gary": "蜗牛",
    "I Pinch": "螃蟹",
    "Aquahorse": "海马",
    "Nom Nom": "鲫鱼",
    "Turuto": "乌龟",
    "Marine Huntress": "海洋猎手",

    "Jungle Planet": "丛林星球",
    "Jungle Sprite": "丛林精灵",
    "Myconid": "蘑菇人",
    "Treant": "树人",
    "Centaur Archer": "半人马弓箭手",
    "Luna Empress": "月神蝴蝶",

    "Gobo Planet": "哥布林星球",
    "Stabby": "哥布林穿刺手",
    "Slashy": "哥布林战士",
    "Smashy": "哥布林大锤手",
    "Shooty": "哥布林弓箭手",
    "Boomy": "哥布林法师",
    "Gobo Chieftain": "哥布林酋长",

    "Planet Of The Eyes": "眼球星球",
    "Eye": "独眼",
    "Eyes": "竖眼",
    "Veyes": "复眼",
    "The Watcher": "观察者",

    "Sorcerer's Tower": "巫师之塔",
    "Novice Sorcerer": "新手巫师",
    "Ice Sorcerer": "冰霜巫师",
    "Flame Sorcerer": "火焰巫师",
    "Elementalist": "元素法师",
    "Chronofrost Sorcerer": "时空霜巫",

    "Bear With It": "熊熊星球",
    "Gummy Bear": "果冻熊",
    "Panda": "熊猫",
    "Black Bear": "黑熊",
    "Grizzly Bear": "灰熊",
    "Polar Bear": "北极熊",
    "Red Panda": "小熊猫",

    "Golem Cave": "魔像洞穴",
    "Magnetic Golem": "磁力魔像",
    "Stalactite Golem": "钟乳石魔像",
    "Granite Golem": "花岗岩魔像",
    "Crystal Colossus": "水晶巨像",

    "Twilight Zone": "暮光之城",
    "Zombie": "僵尸",
    "Vampire": "吸血鬼",
    "Werewolf": "狼人",
    "Dusk Revenant": "黄昏亡灵",

    "Infernal Abyss": "地狱深渊",
    "Abyssal Imp": "深渊小鬼",
    "Soul Hunter": "灵魂猎手",
    "Infernal Warlock": "地狱术士",
    "Demonic Overlord": "恶魔霸主",
}

// 其他
let tranOther = {
    // Other
    "Attempting to connect": "正在尝试连接...",
    "loading": "加载中...",
    "mmmmmmmmmmlli": "mmmmmmmmmmlli",
    "Start Now": "现在开始",
    "Upgrade Queue Capacity": "升级队列容量",
    "Total Experience": "总经验值",
    "Exp to Level Up": "升级所需经验值",
    "You need to enable JavaScript to run this app": "你需要启用JavaScript才能运行此应用程序",
    "Require Bigger Pouch": "需要更大的袋子",

    // 页面

    // -状态栏
    "active players": "在线玩家数",
    "total level": "总等级",
    "run away": "逃跑",

    // -左侧边栏
    "marketplace": "市场",
    "player-driven market where you can buy and sell items with coins": "玩家驱动的市场，你可以用金币购买和出售物品",
    "tasks": "任务",
    "Randomly generated tasks that players can complete for rewards": "玩家可以完成的随机生成任务，以获取奖励",
    "cowbell store": "牛铃商店",
    "Purchase and spend cowbells": "购买和使用牛铃",
    "social": "社交",
    "Friends, referrals, and block list": "好友、推荐和屏蔽列表",
    "guild": "工会",
    "Join forces with a community of players": "与玩家社区合作",
    "leaderboard": "排行榜",
    "Shows the top ranked players of each skill": "显示每个技能的排名前几位的玩家",
    "settings": "设置",
    "Update account information and other settings": "更新账户信息和其他设置",
    "news": "新闻",
    "patch notes": "补丁说明",
    "game guide": "游戏引导",
    "rule": "规则",
    "merch store": "周边商店",
    "test server": "测试服务器",
    "privacy policy": "隐私政策",
    "switch character": "选择角色",
    "logout": "退出登陆",

    // -右侧边栏
    "Inventory": "库存",
    "Abilitie": "技能",
    "House": "房子",
    // --库存
    "Chat Link": "聊天链接",
    "Item Dictionary": "物品字典",
    "Equip": "装备",
    "Cannot During Combat": "战斗中无法使用",
    "Level Not Met": "等级未达到",
    // --装备
    "View Stats": "查看状态",
    "Combat Stats": "战斗状态",
    "Non-combat Stats": "非战斗状态",
    "Attack Interval": "攻击间隔",
    "How fast you can auto-attack": "自动攻击的速度",
    "Ability Haste": "技能加速",
    "Reduces ability cooldowns": "减少技能冷却时间",
    "Accuracy": "准确度",
    "Increases chance to successfully attack": "增加成功攻击的几率",
    "Damage": "伤害",
    "Auto-attack damage is random between 1 and the maximum damage": "自动攻击的伤害在1和最大伤害之间随机",
    "Critical Hit": "暴击",
    "Always rolls maximum damage. Ranged style has passive critical chance": "总是造成最大伤害。远程攻击风格具有被动暴击几率",
    "Task Damage": "任务伤害",
    "Increases damage to monsters assigned as tasks": "增加对作为任务分配的怪物的伤害",
    "Amplify": "增幅",
    "Increases damage of that type": "增加该类型的伤害",
    "Evasion": "闪避",
    "Increases chance to dodge an attack": "增加闪避攻击的几率",
    "Armor": "护甲",
    "Mitigates % of physical damage": "减少%的物理伤害",
    "Resistance": "抗性",
    "Mitigates % of elemental damage": "减少%的元素伤害",
    "Penetration": "穿透",
    "Ignores % of enemy armor/resistance": "无视%的敌方护甲/抗性",
    "Life Steal": "生命窃取",
    "Heal for % of auto-attack": "自动攻击时恢复%的生命值",
    "Mana Leech": "法力吸取",
    "Leeches for % of auto-attack": "自动攻击时吸取%的法力值",
    "Reflect Power": "反弹力量",
    "When attacked by physical damage, reflects % of your Armor as damage back to the attacker": "受到物理伤害时，将%的护甲作为伤害反弹给攻击者",
    "Tenacity": "韧性",
    "Reduces chance of being blinded, silenced, or stunned": "减少被致盲、沉默或眩晕的几率",
    "Threat": "威胁",
    "Increases chance of being targeted by monsters": "增加成为怪物目标的几率",
    "HP Regen": "生命值回复",
    "Recover % of Max HP per 10s": "每10秒恢复最大生命值的%",
    "MP Regen": "法力值回复",
    "Recover % of Max MP per 10s": "每10秒恢复最大法力值的%",
    "Drop Rate": "掉落率",
    "Increase regular item drop rate": "增加普通物品的掉落率",
    "Combat Rare Find": "战斗稀有物品发现",
    "Increase chance of finding treasure chests": "增加发现宝箱的几率",
    "Combat Style": "战斗风格",
    "Damage Type": "伤害类型",
    "Attack Interval": "攻击间隔",
    "Smash Accuracy": "钝击准确度",
    "Smash Damage": "钝击伤害",
    "Max HP": "最大生命值",
    "Max MP": "最大法力值",
    "Stab Evasion": "刺击闪避",
    "Slash Evasion": "斩击闪避",
    "Smash Evasion": "钝击闪避",
    "Ranged Evasion": "远程闪避",
    "Magic Evasion": "魔法闪避",
    "Armor": "护甲",
    "Water Resistance": "水属性抗性",
    "Nature Resistance": "自然属性抗性",
    "Fire Resistance": "火属性抗性",
    "Tenacity": "韧性",
    "Threat": "威胁",
    "HP Regen": "生命值回复",
    "MP Regen": "法力值回复",
    "Speed": "速度",
    "Increases action speed": "增加行动速度",
    "Task Speed": "任务速度",
    "Increases speed on actions assigned as tasks": "增加分配为任务的行动速度",
    "Increases gathering quantity": "增加采集数量",
    "Efficiency": "效率",
    "Chance of repeating the action instantly": "立即重复行动的几率",
    "Skilling Rare Find": "技能稀有物品发现",
    "Increases chance of finding meteorite caches or artisan's crates": "增加发现陨石或工匠箱子的几率",
    "Milking Speed": "挤奶速度",
    "Foraging Speed": "采集速度",
    "Woodcutting Speed": "伐木速度",
    "Cheesesmithing Speed": "奶酪制作速度",
    "Crafting Speed": "制作速度",
    "Tailoring Speed": "裁缝速度",
    "Cooking Speed": "烹饪速度",
    "Brewing Speed": "酿造速度",
    "Enhancing Success": "强化成功率",
    // --技能
    "Abilities can be learned from ability books. You can acquire ability books as drops from monsters or purchase them from other players in the marketplace": "技能可以从技能书中学习。你可以从怪物身上获得技能书，或者在市场上从其他玩家那里购买",
    "Abilities can be placed into slots to be used in combat. You unlock more slots as your intelligence skill level increases": "技能可以放置在槽位中用于战斗。随着你的智力技能等级的提升，你将解锁更多的槽位",
    "Abilities can level up as you gain experience. You get 0.1 experience for every use in combat and a much larger amount from consuming duplicate ability books": "随着你获得经验，技能可以升级。每次在战斗中使用技能可以获得0.1点经验，并且从消耗重复的技能书中可以获得更多经验",
    "Ability Slots": "技能槽",
    "Learned Abilities": "已学习的技能",
    "Special Ability Slot": "特殊技能槽",
    "Description": "描述",
    "Cooldown": "冷却",
    "Cast Time": "准备时间",
    "MP Cost": "MP消耗",
    "Combat Triggers": "战斗触发",
    "Activate when": "激活在",
    "Cannot change in combat": "不能在战斗中改变",
    // --房子
    "View Buffs": "查看Buff",
    "House Buffs": "房子Buff",
    "Not built": "未建造",
    "None": "无",
    "Buff": "Buff",
    "Global Buffs": "全局Buff",
    "Dairy Barn": "奶牛棚",
    "Garden": "花园",
    "Log Shed": "木材棚",
    "Forge": "锻造台",
    "Workshop": "工作间",
    "Sewing Parlor": "缝纫工作室",
    "Kitchen": "厨房",
    "Brewery": "酿酒厂",
    "Laboratory": "实验室",
    "Dining Room": "餐厅",
    "Library": "图书馆",
    "Dojo": "道场",
    "Gym": "健身房",
    "Armory": "军械库",
    "Archery Range": "射箭场",
    "Mystical Study": "神秘研究室",
    "Wisdom": "智慧",
    "Rare Find": "稀有发现",
    "Construction Costs": "建造消耗",
    "Build": "建造",
    "Rooms in your house can be built to give you permanent bonuses": "你的房子里的房间可以建造，以给予你永久的加成",
    "Each room can be leveled up to a maximum of level 8 with increasing costs": "每个房间可以升级到最高8级，但升级成本逐渐增加",

    // -聊天
    "General": "常规",
    "Trade": "交易",
    "Recruit": "招募",
    "Beginner": "新手",
    "party": "队伍",
    "Whisper": "私聊",
    "Send": "发送",

    // -主页面
    // --市场
    "The marketplace allows players to make buy or sell listings for any tradable item. You can click on any item listed to view existing listings or to create your own": "市场允许玩家为任何可交易的物品创建买入或卖出列表。你可以点击任何列出的物品来查看现有的列表或创建自己的列表",
    "New listings will always be fulfilled by the best matching prices on market when possible. If no immediate fulfillment is possible, the listing will appear on the marketplace": "新的列表将尽可能由市场上最匹配的价格来满足。如果无法立即满足，该列表将出现在市场上",
    "When a trade is successful, a tax of 2% coins is taken and the received items can be collected from \"My Listings\" tab": "当交易成功时，会收取2%的金币作为税收，并且可以从“我的列表”选项卡中收取所获得的物品",
    "Asks": "询问",
    "existing sell listings": "现有的卖出列表",
    "Bids": "竞价",
    "existing buy listings": "现有的买入列表",
    "market listings": "市场列表",
    "my listings": "我的列表",
    "Listings": "列表",
    "item filter": "项目筛选器",
    "New Sell Listing": "新出售单",
    "New Buy Listing": "新收购单",
    "Listing Limit Reached": "达到上市限制",
    "view all items": "查看所有物品",
    "upgrade capacity": "去增加长度",
    "Collect All": "收集全部",
    "Item": "项目",
    "Best Ask Price": "最佳出售价",
    "Best Bid Price": "最佳收购价",
    "View All": "查看全部",
    "Quantity": "数量",
    "Ask Price": "出售价",
    "Bid Price": "收购价",
    "Action": "操作",
    "View All Enhancement Levels": "查看所有强化级别",
    "status": "状态",
    "type": "类型",
    "progress": "进度",
    "tax taken": "收税",
    "collect": "收集",
    "active": "有效",
    "Inactive": "无效",
    "sell": "出售",
    "buy": "收购",
    "price": "价格",
    "cancel": "取消",
    "Refresh": "刷新",
    "Sell Listing": "出售列表",
    "Enhancement Level": "强化等级",
    "Price (Best Sell Offer": "价格(最佳售价",
    "Quantity (You Have": "数量(你拥有",
    "You don't have enough items": "你没有足够的物品",
    "You Get": "你获得",
    "Taxed": "扣税",
    "Or more if better offers exist": "或更多, 如果有更好的报价",
    "Post Sell Listing": "发布出售列表",
    "Buy Listing": "购买列表",
    "You can't afford this many": "你负担不起这么多",
    "You Pay": "你支付",
    "Or less if better offers exist": "或更少, 如果有更好的报价",
    "Post Buy Listing": "发布购买列表",
    "Sell Now": "立即出售",
    "All": "全部",
    "Post Sell Order": "发布出售订单",
    "Buy Now": "立即购买",
    "Post Buy Order": "发布购买订单",
    "Filled": "完成",
    "Must be at least": "必须至少",
    "You Have": "你有",
    "You Can Afford": "你能负担",
    "Price (Best Buy Offer": "价格 (最好的买价",
    // --Task
    "Task Board": "任务板",
    "Task Shop": "任务商店",
    "Next Task": "下一个任务",
    "Upgrades": "升级",
    "Items": "项目",
    "Lifetime Task Points": "终身任务点数",
    "Task Points": "任务点数",
    "Claim": "领取",
    "Claim Reward": "领取报酬",
    "Hour Task Cooldown": "每小时任务冷却",
    "Block Slot": "屏蔽槽位",
    "Unlock Combat Block": "解锁战斗屏蔽",
    "Buy Task Upgrade": "购买任务升级",
    "Permanently reduces the waiting time between tasks by 1 hour": "永久减少任务间的等待时间1小时",
    "Adds a block slot, allowing you to block a non-combat skill from being selected for tasks": "增加一个屏蔽槽位，允许你屏蔽非战斗技能被选择为任务",
    "Unlocks the ability to block combat tasks. You need at least 1 available block slot to use this": "解锁屏蔽战斗任务的能力。你至少需要1个可用的屏蔽槽位来使用此功能",
    "Buy Task Shop Item": "购买任务商店物品",
    "unread task": "未读的任务",
    "read": "阅读",
    // --挤奶
    "The milks from these magical cows have a wide variety of functions. They can be used to produce consumables or craft into special cheese to make equipment": "这些魔法奶牛的奶有各种功能。它们可以用来制作消耗品，或者制作成特殊奶酪以制作装备",
    "Cows love to be brushed. Equipping a brush will boost your milking skill": "奶牛喜欢被刷。装备刷子会提升你的挤奶技能",
    "Requires": "需求",
    "Outputs": "输出",
    "Rares": "稀有",
    "Duration": "持续时间",
    "Bonuses": "奖励",
    "Detail": "详情",
    "Action Speed": "行动速度",
    "Decreases time cost for the action": "降低行动的时间成本",
    "Milking Level": "挤奶等级",
    "Buffs milking level": "增益挤奶等级",
    "Increases experience gained": "增加获得的经验",
    "Increases drop rate of meteorite caches, artisan's crates, and treasure chests": "增加陨石储藏、艺术家的箱子和宝藏箱的掉落率",
    "Upgrade": "升级",
    "From": "从",
    "Basic Task Ring": "基础任务戒指",
    "Advanced Task Ring": "高级任务戒指",
    "Expert Task Ring": "专家任务戒指",
    "Collectors Boots": "收藏家之靴",
    // --采集
    "You can find many different resources while foraging in the various areas. These resources can be used for cooking and brewing consumables": "在各个地区采集时，你可以找到许多不同的资源。这些资源可以用于烹饪和酿造消耗品",
    "Equipping shears will boost your foraging skill": "装备剪刀会提升你的采集技能",
    // --伐木
    "You can gather logs from different types of trees. Logs are used for crafting various equipments": "你可以从不同类型的树木中获取木材。木材用于制作各种装备",
    "Equipping a hatchet will boost your woodcutting skill": "装备一把斧头会提升你的伐木技能",
    "Tree": "树",
    "Birch Tree": "桦树",
    "Cedar Tree": "雪松树",
    "Purpleheart Tree": "紫心木树",
    "Ginkgo Tree": "银杏树",
    "Redwood Tree": "红木树",
    "Arcane Tree": "奥秘树",
    // --奶酪锻造
    "The hardened cheeses made with milks from the magical cows are as tough as metal. You can smith them into equipment that gives you bonuses in combat or skilling": "用魔法牛的奶制作的硬质奶酪坚硬如金属。你可以将它们锻造成在战斗或技能中给你加成的装备",
    "Equipment is upgradable from one tier to the next, often requiring increasing amount of cheese. There is also special equipment that can be crafted with items found from monsters in combat": "装备可以从一级升级到下一级，通常需要越来越多的奶酪。还有一些特殊的装备可以用在战斗中从怪物身上获得的物品来制作",
    "Equipping a hammer will boost your cheesesmithing skill": "装备锤子会提升你的奶酪锻造技能",
    "Material": "材料",
    // --制作
    "You can craft weapons, offhands, and jewelry": "你可以制作武器、副手物品和珠宝",
    "Equipping a chisel will boost your crafting skill": "装备凿子会提升你的制作技能",
    "Crossbow": "弩",
    "Bow": "弓",
    "Staff": "法杖",
    "Special": "特殊",
    // --裁缝
    "You can tailor ranged and magic clothing using raw materials gathered from combat and foraging": "你可以使用从战斗和采集中获得的原材料来制作远程和魔法服装",
    "Equipping a needle will boost your tailoring skill": "装备针会提升你的裁缝技能",
    // --烹饪
    "Food can be used to recover your HP or MP. They can be brought with you to combat": "食物可以用来恢复你的生命值(HP)或法力值(MP)。它们可以随身携带在战斗中使用",
    "Equipping a spatula will boost your cooking skill": "装备铲子会提升你的烹饪技能",
    "Instant Heal": "即时治疗",
    "Heal Over Time": "持续治疗",
    "Instant Mana": "即时回蓝",
    "Mana Over Time": "持续回蓝",
    // --酿造
    "Drinks can provide you with temporary buffs. Coffee can be brought with you to combat and tea can be used while skilling": "饮料可以给你提供临时增益效果。咖啡可以在战斗中携带，茶可以在技能训练时使用",
    "Equipping a pot will boost your brewing skill": "装备一个锅可以提升你的酿造技能",
    "Tea": "茶",
    "Coffee": "咖啡",
    // 强化
    "Enhancing allows you to permanently improve your equipment, giving them increasing bonuses as their enhancement level go up": "强化可以让你永久提升装备，随着强化等级的提升，装备的奖励效果也会增加",
    "Enhancing costs a small amount of materials for each attempt": "每次尝试强化都需要消耗少量材料",
    "The success rate depends on your enhancing skill level, the tier of the equipment, and the equipment's current enhancement level. A successful enhancement will increase the level by 1 and failure will reset the level back to": "成功率取决于你的强化技能等级、装备的等级和当前的强化等级。成功的强化将使等级增加1，失败将使等级重置为0",
    "You can optionally use copies of the base equipment for protection. Failure with protection will only reduce the enhancement level by 1 but consume 1 protection item": "你可以选择使用基础装备的副本进行保护。带有保护的失败只会将强化等级减少1，但会消耗1个保护道具",
    "Equipping an enhancer will boost your enhancing skill": "装备一个强化器会提升你的强化技能",
    "Enhance Item": "强化物品",
    "Select an equipment to enhance": "选择一个装备进行强化",
    "Success": "成功",
    "increases the item's enhancement level by": "将物品的强化等级增加",
    "Failure": "失败",
    "resets the enhancement level to 0 unless protection is used": "除非使用保护道具，否则将重置强化等级为0",
    "Next Level Bonuses": "下一级奖励",
    "Enhancement Costs": "强化费用",
    "Rare Drops": "稀有掉落",
    "Success Rate": "成功率",
    "Stop At Level": "停止等级",
    "Use Protection": "使用保护",
    "Only Decrease": "仅减少",
    "Level On Failure": "失败时等级",
    "Consumed Item": "消耗物品",
    "Start Protect At Level": "从等级开始保护",
    "Enhance": "强化",
    "Multiplicative bonus to success rate while enhancing": "在强化过程中的乘法成功率奖励",
    "setup queue": "设置队列",
    // 社交
    "Friends": "好友",
    "Referrals": "推荐",
    "Block List": "屏蔽列表",
    "Add Friend": "添加好友",
    "Activity": "活动",
    "Online": "在线",
    "Offline": "离线",
    "When someone signs up using your referral link, you'll be eligible for the following rewards": "当有人使用你的推荐链接注册时，你将有资格获得以下奖励",
    "if they reach Total Level": "如果他们达到总等级200",
    "Additional": "额外的",
    "if they reach Total Level": "如果他们达到总等级400",
    "of any Cowbells they purchase": "他们购买的任何牛铃",
    "Copy Link": "复制链接",
    "So far": "到目前为止，",
    "players have signed up using your referral link": "玩家已经使用你的推荐链接注册",
    "Block Player": "屏蔽玩家",
    "Blocked Players": "被屏蔽的玩家",


    // 战斗
    "combat zone": "战斗区域",
    "find party": "寻找队伍",
    "battle": "战斗",
    "auto attack": "自动攻击",
    "select zone": "选择区域",
    "fighting monsters will earn you experience and item drops": "击败怪物将使你获得经验和物品掉落",
    "your combat stats are based on a combination of your combat skill levels and your equipment bonuses": "你的战斗属性由战斗技能水平和装备加成的综合决定",
    "you can bring food to recover HP or MP, drinks to give you buffs, and abilities that can be cast. you can change the automation configuration from the settings icon below them": "你可以携带食物恢复生命值或魔法值，饮料可以提供增益效果，还可以施放各种技能。你可以通过下方的设置图标来更改自动化配置",
    "if you are defeated in combat, your character will wait through a respawn timer before automatically continuing combat": "如果你在战斗中被击败，你的角色会在等待重生计时器结束后自动继续战斗",


    // 未整理
    "Ranged Accuracy": "远程准确性",
    "Ranged Damage": "远程伤害",
    "Magic Damage": "魔法伤害",
    "Fire Amplify": "火焰强化",
    "Water Amplify": "水属性强化",
    "Water Penetration": "水属性穿透",
    "Nature Amplify": "自然属性强化",
    "Max Hitpoints": "最大生命值",
    "Milking Efficiency": "挤奶效率",
    "Foraging Efficiency": "采集效率",
    "Woodcutting Efficiency": "伐木效率",
    "Max Manapoints": "最大魔力值",
    "Combat Experience": "战斗经验",
    "Skilling Experience": "技能经验",
    "Loots": "战利品",
    "Food Slots": "食物槽位",
    "Drink Slots": "饮料槽位",
    "Sell Price": "售价",
    "Traveling To Battle": "踏上战斗之旅",
    "My Stuff": "我的物品",
    "Ability Slot": "技能槽",
    "Unlock at Lv. 20 INT": "在20级智力解锁",
    "Unlock at Lv. 50 INT": "在50级智力解锁",
    "Tip": "提示",
    "Feel free to ask questions or chat with other players here. Useful links": "请随意在此处提问或与其他玩家聊天。有用的链接",
    "Game Rules": "游戏规则",
    "You can whisper other players using the command \"/w [playerName] [message]\" or simply click on a player's name and select whisper": "你可以使用命令 \"/w [玩家名称] [消息]\" 来私聊其他玩家，或者直接点击玩家名称并选择私聊",
    "Recruit channel is for advertising guild/party recruitment and players seeking to join a guild/party. Please use whispers for conversations": "招募频道用于宣传公会/队伍招募和寻找加入公会/队伍的玩家。请使用私聊进行对话",
    "General channel is for game-related discussions and friendly chats. To maintain a positive and respectful atmosphere, please adhere to the": "常规频道用于游戏相关讨论和友好聊天。为了保持积极和尊重的氛围，请遵守",
    "You need at least 200 total level or 1,000,000 XP to use general chat": "你需要至少200总等级或1,000,000经验值才能使用常规聊天",
    "Unlock at Lv. 90 INT": "在90级智力解锁",
    "Supporter Points": "支持者点数",
    "Fame Points": "名望点数",
    "Buy Cowbells": "购买牛铃",
    "Convenience": "便利",
    "Chat Icons": "聊天图标",
    "Name Colors": "名称颜色",
    "Community Buffs": "社区加成",
    "Name Change": "更改名称",
    "Cowbells can be purchased to help support the game. You can use them to buy convenience upgrades, chat icons, name colors, community buffs, or change your name": "可以购买牛铃来支持游戏。你可以使用它们购买便利升级、聊天图标、名称颜色、社区加成或更改你的名称",
    "NOTE": "注意",
    "Purchased Cowbells will appear in your inventory as Bags of 10 Cowbells which can be sold on the market (coin tax) to other players. Once opened, they are no longer tradable": "购买的牛铃将以10个牛铃的袋子出现在你的库存中，可以在市场上（带有硬币税）卖给其他玩家。一旦打开，就无法再进行交易",
    "Select Currency": "选择货币",
    "USD": "美元",
    "Upgrades permanently increases limits. Your current limits can be viewed in Settings": "升级永久增加限制。你当前的限制可以在设置中查看",
    "Increase offline progress limit": "增加离线进度限制",
    "Hour Offline Progress": "每小时离线进度",
    "Buy limit": "购买限制",
    "Increase action queue limit": "增加动作队列限制",
    "Action Queue": "动作队列",
    "Increase market listing limit": "增加市场挂单限制",
    "Market Listing": "市场挂单",
    "Increase task slot limit": "增加任务槽限制",
    "Task Slot": "任务槽",
    "Chat icons are displayed in front of your name in the chat. Unlocked chat icons can be changed in Settings -> Profile": "聊天图标显示在聊天中你的名称前面。已解锁的聊天图标可以在设置 -> 个人资料中更改",
    "Upon reaching 50K, 100K, and 200K supporter points, players can request a custom chat icon for each tier reached. The icon must fit the theme of the game and can be requested via #new-ticket on Discord. Each player is eligible for a maximum of three custom icons": "达到50K、100K和200K支持者点数后，玩家可以为达到的每个层级请求一个自定义聊天图标。图标必须符合游戏的主题，并可以通过 Discord 的 #new-ticket 请求。每个玩家最多可以获得三个自定义图标",
    "Clover": "四叶草",
    "Task Crystal": "任务水晶",
    "Sword": "剑",
    "Spear": "矛",
    "Mace": "狼牙棒",
    "Bulwark": "壁垒",
    "Book": "书",
    "Mage's Hat": "法师帽",
    "Panda Paw": "熊猫爪",


    "Golden Cupcake": "金纸杯蛋糕",
    "Iron Cow": "铁牛",
    "Duckling": "小鸭",
    "Whale": "鲸鱼",
    "Golden Coin": "金币",
    "Golden Egg": "金蛋",
    "Golden Berry": "金浆果",
    "Golden Apple": "金苹果",
    "Golden Donut": "金甜甜圈",
    "Golden Clover": "金四叶草",
    "Golden Frog": "金青蛙",
    "Golden Piggy": "金小猪",
    "Golden Duckling": "金小鸭",
    "Golden Whale": "金鲸鱼",
    "Click any of the colors to see a preview with your name. Unlocked colors can be changed in Settings -> Profile": "点击任何颜色以预览带有你的名称。已解锁的颜色可以在设置 -> 个人资料中更改",
    "Upon reaching 150K supporter points, players can request a one-time custom name color(or gradient pattern) . This can be requested via #new-ticket on Discord": "达到150K支持者点数后，玩家可以请求一次性自定义名称颜色（或渐变图案）。可以通过 Discord 的 #new-ticket 请求",
    "Burble": "泡泡",
    "Blue": "蓝色",
    "Green": "绿色",
    "Yellow": "黄色",
    "Coral": "珊瑚",
    "Pink": "粉色",
    "Fancy Burble": "华丽泡泡",
    "Fancy Blue": "华丽蓝色",
    "Fancy Green": "华丽绿色",
    "Fancy Yellow": "华丽黄色",
    "Fancy Coral": "华丽珊瑚",
    "Fancy Pink": "华丽粉色",
    "Iron": "铁色",
    "Rainbow": "彩虹色",
    "Golden": "金色",
    "Community buffs are bonuses granted to all players on the server. For every Cowbell spent on community buffs, you will gain 1 fame point. Fame points are ranked on the leaderboard": "社区加成是授予服务器上所有玩家的奖励。每花费一个牛铃购买社区加成，你将获得1个名望点数。名望点数在排行榜上排名",
    "Fame Leaderboard": "名望排行榜",
    "Opt In": "选择加入",
    "Experience": "经验",
    "Minute": "分钟",
    "Gathering Quantity": "采集数量",
    "Production Efficiency": "生产效率",
    "Enhancing Speed": "强化速度",
    "Combat Drop Quantity": "战斗掉落数量",
    "Current Name": "当前名称",
    "New Name": "新名称",
    "Check Availability": "检查可用性",
    "Cost": "费用",
    "Change Name": "更改名称",
    "Moderator": "管理员",
    "Moderators": "管理员",
    "Chat": "聊天",
    "Inspect": "检查",
    "Mutes": "禁言",
    "Bans": "封禁",
    "Role": "角色",
    "Chat Min Level": "聊天最低等级",
    "General Chat Min Level": "普通聊天最低等级",
    "General Chat Min Exp": "普通聊天最低经验",
    "Update": "更新",
    "Character Name": "角色名称",
    "Mute Duration": "禁言时长",
    "minute": "分钟",
    "minutes": "分钟",
    "hour": "小时",
    "hours": "小时",
    "day": "天",
    "days": "天",
    "year": "年",
    "years": "年",
    "Mute Reason": "禁言原因",
    "Mute": "禁言",
    "Expire Time": "过期时间",
    "Reason": "原因",
    "Unmute": "解除禁言",
    "Ban Duration": "封禁时长",
    "Ban Reason": "封禁原因",
    "Ban": "封禁",
    "Unban": "解封",
    "Purchased Cowbells will appear in your inventory as Bags of 10 Cowbells which can be sold on the market": "购买的牛铃将以每袋10个牛铃的形式出现在你的库存中, 可以在市场上(带有",
    "coin tax) to other players. Once opened, they are no longer tradable": "的硬币税)卖给其他玩家。一旦打开，它们将无法再进行交易",
    "Name": "名称",
    "Stunned": "被眩晕",
    "Silenced": "被沉默",
    "Amount": "数量",
    "Consumable": "消耗品",
    "Usable In": "可用于",
    "HP": "生命值",
    "MP": "魔力值",
    "HP Restore": "恢复生命值",
    "HP over 30s": "30秒内恢复生命值",
    "MP Restore": "恢复魔法值",
    "MP over 30s": "30秒内恢复魔法值",
    "Foraging Level": "采集等级",
    "Buffs foraging level": "增益采集等级",

    "Woodcutting Level": "伐木等级",
    "Buffs woodcutting level": "增益伐木等级",
    "Cooking Level": "烹饪等级",
    "Buffs cooking level": "增益烹饪等级",
    "Brewing Level": "酿造等级",
    "Buffs brewing level": "增益酿造等级",
    "Enhancing Level": "强化等级",
    "Buffs enhancing level": "增益强化等级",
    "Cheesesmithing Level": "奶酪锻造等级",
    "Buffs cheesesmithing level": "增益奶酪锻造等级",
    "Crafting Level": "制作等级",
    "Buffs crafting level": "增益制作等级",
    "Tailoring Level": "裁缝等级",
    "Buffs tailoring level": "增益裁缝等级",


    "Gathering": "采集",
    "Gourmet": "美食",
    "Chance to produce an additional item for free": "有机会额外获得一个免费物品",
    "Processing": "加工",
    "Chance to instantly convert gathered resource into processed material": "有机会立即将采集的资源转化为加工材料",
    "cheese, fabric, and lumber": "奶酪、织物和木材",
    "Artisan": "工匠",
    "Reduces required materials during production": "减少生产过程中所需材料",
    "Action Level": "行动等级",
    "Increases required levels for the action": "增加行动所需等级",
    "Blessed": "祝福",
    "Chance to gain +2 instead of +1 on enhancing success": "有机会在强化成功时获得+2而不是+1",
    "Stamina Level": "体力等级",
    "Buffs stamina level": "增益体力等级",
    "Increases HP regeneration": "增加生命值恢复速度",
    "Intelligence Level": "智力等级",
    "Buffs intelligence level": "增益智力等级",
    "Increases MP regeneration": "增加魔法值恢复速度",
    "Defense Level": "防御等级",
    "Buffs defense level": "增益防御等级",
    "Attack Level": "攻击等级",
    "Buffs attack level": "增益攻击等级",
    "Power Level": "力量等级",
    "Buffs power level": "增益力量等级",
    "Ranged Level": "远程等级",
    "Buffs ranged level": "增益远程等级",
    "Magic Level": "魔法等级",
    "Buffs magic level": "增益魔法等级",
    "Combat Drop Rate": "战斗掉落率",
    "Increases drop rate of combat loot": "增加战斗战利品的掉落率",
    "Attack Speed": "攻击速度",
    "Increases auto attack speed": "增加自动攻击速度",
    "Cast Speed": "施法速度",
    "Increases ability casting speed": "增加技能施法速度",

    "Critical Rate": "暴击率",
    "Increases critical rate": "增加暴击率",
    "Critical Damage": "暴击伤害",
    "Increases critical damage": "增加暴击伤害",
    "Ability Book": "技能书",
    "Effect": "效果",
    "Ability Exp Per Book": "每本书的技能经验",
    "Stab Accuracy": "刺击准确性",
    "Stab Damage": "刺击伤害",
    "Slash Accuracy": "斩击准确性",
    "Slash Damage": "斩击伤害",
    "Magic Accuracy": "魔法准确性",
    "Cheesesmithing Efficiency": "奶酪锻造效率",
    "Crafting Efficiency": "制作效率",
    "Tailoring Efficiency": "裁缝效率",
    "Nature Penetration": "自然属性穿透",
    "Fire Penetration": "火焰穿透",
    "Healing Amplify": "治疗强化",
    "Cooking Efficiency": "烹饪效率",
    "Brewing Efficiency": "酿造效率",

    "Skilling Efficiency": "技能效率",
    "Armor Penetration": "护甲穿透",
    "Global": "全局",
    "Welcome Back": "欢迎回来！",
    "You were offline for": "你离线了",
    "You consumed": "你消耗了",
    "Close": "关闭",
    "Items gained": "获得物品",
    "Experience gained": "获得经验",
    "View Cowbell Store": "查看牛铃商店",
    "Dropped By Monsters": "怪物掉落",
    "Enhancing Cost": "强化费用",
    "Recommended": "推荐",
    "Gathered From": "采集自",
    "Used For Cooking": "用于烹饪",
    "Used For Brewing": "用于酿造",
    "Produced From Brewing": "通过酿造产生",
    "Produced From Cooking": "通过烹饪产生",
    "Produced From Tailoring": "通过裁缝产生",
    "Used For Tailoring": "用于裁缝",
    "Produced From Cheesesmithing": "通过奶酪锻造产生",
    "Used For Cheesesmithing": "用于奶酪锻造",
    "Produced From Crafting": "通过制作产生",
    "Monsters": "怪物",
    "Boss Fight": "首领战斗",
    "Every": "每个",
    "Battles": "战斗",
    "Travel": "旅行",
    "Combat Level": "战斗等级",
    "Drops": "掉落",
    "Standard": "标准",
    "Ironcow": "铁牛",
    "Legacy Ironcow": "传统铁牛",
    "Updates approximately every 20 minutes": "大约每20分钟更新一次",
    "Rank": "等级",
    "Profile": "个人资料",
    "Game": "游戏",
    "Account": "账户",
    "Preview": "预览",
    "View My Profile": "查看我的个人资料",
    "Chat Icon": "聊天图标",
    "None Owned": "未拥有",
    "Unlock": "解锁",
    "Name Color": "名称颜色",
    "Online Status": "在线状态",
    "Public": "公开",
    "Show": "显示",
    "Game Mode": "游戏模式",
    "Offline Progress": "离线进度",
    "actions": "操作",
    "Task Slots": "任务槽",
    "Profanity Filter": "脏话过滤器",
    "Enabled": "已启用",
    "CSS Animation": "CSS动画",
    "On": "开",
    "Account Type": "账户类型",
    "Registered User": "注册用户",
    "Current Password": "当前密码",
    "Email": "邮箱",
    "New Password": "新密码",
    "Confirm Password": "确认密码",
    "Hide": "隐藏",
    "Friends/Guildmates": "好友/公会成员",
    "Private": "私密",
    "A new tab will be opened to process the purchase": "将打开一个新标签页进行购买",
    "Continue": "继续",
    "Buy Convenience Upgrade": "购买便利升级",
    "Quantity (Limit": "数量（限制",
    "You don't have enough cowbells": "你没有足够的铃铛",
    "After Purchase": "购买后",
    "Hours Offline Progress": "离线进度小时数",
    "Buy Chat Icon": "购买聊天图标",
    "Buy Name Color": "购买名称颜色",
    "Buy Community Buff": "购买社区增益",
    "Minutes to Add": "要添加的分钟数",
    "Minutes To Add For Next Level": "升级所需分钟数",
    "Doing nothing": "什么都不做",
    "Remove": "移除",
    "Overview": "概览",
    "Members": "成员",
    "Manage": "管理",
    "Guild Level": "公会等级",
    "Guild Experience": "公会经验",
    "Guild Members": "公会成员",
    "Edit": "编辑",
    "Invite to Guild": "邀请加入公会",
    "Guild Exp": "公会经验",
    "Leader": "领导者",
    "Officer": "官员",
    "Hidden": "隐藏",
    "Member": "成员",
    "There are no penalties for leaving": "离开没有任何惩罚",
    "Leave Guild": "离开公会",
    "Battle Info": "战斗信息",
    "Stats": "统计数据",
    "Combat Duration": "战斗时长",
    "Deaths": "死亡次数",
    "Items looted": "掠夺的物品",
    "Drop Quantity": "掉落数量",
    "Skill": "技能",
    "Unfriend": "解除好友关系",
    "Promote": "晋升",
    "Kick": "踢出",
    "Enemies' Total # of Active Units": "敌人的活跃单位总数",
    "AND": "并且",
    "Enemies' Total Current Hp": "敌人的总当前生命值",
    "Target Enemy's Current Hp": "目标敌人的当前生命值",
    "My": "我的",
    "Target Enemy's": "目标敌人的",
    "Enemies' Total": "敌人的总",
    "Allies' Total": "盟友的总",
    "of Active Units": "个活跃单位",
    "of Dead Units": "个死亡单位",
    "Lowest HP": "最低生命值",
    "Missing Hp": "缺失生命值",
    "Current Hp": "当前生命值",
    "Missing Mp": "缺失魔法值",
    "Current Mp": "当前魔法值",
    "Condition": "条件",
    "Reset Default": "重置为默认",
    "Rate": "比率",
    "CriticalAura": "致命光环",
    "Puncture Debuff": "穿刺减益",
    "Ice Spear Debuff": "冰矛减益",
    "Frost Surge Debuff": "寒霜冲击减益",
    "Toxic Pollen Debuff": "毒性花粉减益",
    "Blind Status": "致盲状态",
    "Silence Status": "沉默状态",
    "Stun Status": "眩晕状态",
    "My Missing Mp": "我的缺失魔法值",
    "My Missing Hp": "我的缺失生命值",
    "Is Active": "已激活",
    "Is Inactive": "未激活",
    "New Ability": "新技能",
    "Available At Price": "在这个价格可用",



    "Home": "主页",
    "Multiplayer Idle RPG": "多人放置RPG",
    "Embark on a journey through the Milky Way Idle universe, a unique multiplayer idle game. Whether you enjoy resource gathering, item crafting, or engaging in epic battles against alien monsters, we have something to offer for everyone. Immerse yourself in our thriving community, where you can trade in the player-driven marketplace, form a guild with friends, chat with fellow players, or climb to the top of the leaderboards": "踏上一段穿越银河奶牛放置的旅程，这是一款独特的多人闲置游戏。无论你喜欢收集资源、制作物品，还是参与与外星怪物的史诗战斗，我们都能为每个人提供一些乐趣。沉浸在我们繁荣的社区中，你可以在由玩家驱动的市场交易，与朋友组建公会，与其他玩家聊天，或者登上排行榜的顶端。",
    "Gather and Craft": "收集和制作",
    "Milking, Foraging, Woodcutting, Cheesesmithing, Crafting, Tailoring, Cooking, Brewing, Enhancing": "挤奶、觅食、砍木、奶酪制作、制作、裁缝、烹饪、酿造、强化",
    "Multiple styles of combat with highly customizable consumable and ability auto-usage": "多种战斗风格，可高度自定义消耗品和能力的自动使用",
    "Buy and sell resources, consumables, and equipment": "购买和出售资源、消耗品和装备",
    "Community": "社区",
    "Play and chat with friends. Compete for a spot on the leaderboard": "与朋友一起玩耍和聊天。争夺排行榜上的位置",
    "Terms of Use": "使用条款",
    "Play As Guest": "以游客身份玩",
    "Register": "注册",
    "Login": "登录",
    "Your session will be saved in this browser. To play across multiple devices, you can go in": "你的会话将保存在此浏览器中。要在多个设备上玩游戏，你可以进入",
    "in game to find your": "游戏中找到你的",
    "guest password": "游客密码",
    "or to fully": "或者完全",
    "register": "注册",
    "I Agree to the": "我同意",
    "Terms": "条款",
    "I am 13 years of age or older": "我年满13岁或以上",
    "Play": "开始游戏",
    "Password": "密码",
    "Password Confirmation": "确认密码",
    "Email or Name": "电子邮件或用户名",
    "Forgot Password": "忘记密码",



    "Loading characters": "正在加载角色",
    "Select Character": "选择角色",
    "Empty": "空",
    "Create Character": "创建角色",
    "The Standard game mode is recommended for new players. There are no feature restrictions. You can only have 1 Standard character": "标准游戏模式适合新玩家。没有功能限制。你只能创建一个标准角色",
    "Last Online": "上次在线",
    "New Tutorial Message": "新教程消息",
    "Tutorial": "教程",
    "where magical cows mooo! I'm Purple, the Chief Training Officer (CTO), and also your tour guide today": "这里是神奇的奶牛世界！我是紫色，首席培训官（CTO），也是你的导游",
    "I'll sprinkle some glowing magical dust to guide you through the training": "我会撒些闪闪发光的魔法粉尘来引导你完成训练",
    "Hi Purple": "嗨，紫色",
    "You need at least 30 total level to chat": "你需要至少30总等级才能聊天",
    "spam protection": "垃圾邮件保护",
    "New Tutorial Task": "新教程任务",
    "Let me first show you what we magical cows are best known for": "让我先向你展示我们神奇的奶牛最擅长的事情",
    "producing magical milk! By the way, my cousin Burble also works here. Hi Burble": "生产神奇的牛奶！顺便说一下，我的表弟Burble也在这里工作。嗨，Burble",
    "First, try and gather some milk": "首先，尝试收集一些牛奶",
    "Accept": "接受",
    "OK": "好的",
    "Good job! Here's some extra milk and a brush. Magical cows love to be brushed, and happy cows produce milk faster": "干得好！这是一些额外的牛奶和一把刷子。神奇的奶牛喜欢被刷，快乐的奶牛产奶更快",
    "Let's make some cheese with the milk! These special cheeses are very durable and can be turned into many useful things through cheesesmithing": "让我们用牛奶做些奶酪！这些特殊的奶酪非常耐用，可以通过奶酪制作变成许多有用的东西",
    "Great! Take some extra cheese with you for the next task": "太棒了！带一些额外的奶酪继续下一个任务",
    "Cheeses are essential resources for making tools, weapons, and armor. Let me show you how to make a cheese sword. I know it might sound crazy and maybe a little bit smelly too, but trust me": "奶酪是制作工具、武器和盔甲的重要资源。让我来教你如何制作奶酪剑。我知道这听起来可能很疯狂，也可能有点臭，但请相信我",
    "Awesome! As you level up, equipment can be upgraded to higher tiers! Tools can also be made to improve each of your skills": "太棒了！随着你的等级提升，装备可以升级到更高的阶级！工具也可以制作来提高你的每项技能",
    "Now let's go forage for some more resources. Head to Farmland and see what items you can gather": "现在让我们去寻找更多的资源。前往农田，看看你能收集到什么物品",
    "That was fast! Foraging gives you resources used in many skills, including cooking, brewing, and tailoring": "速度很快！寻找资源可以用于许多技能，包括烹饪、冲泡和裁缝",
    "It's time to make use of your cooking skill and whip up a delicious donut using some eggs, wheat, and sugar. What? You can't cook? Of course you can! There's a rat from Earth that can cook, and if he can do it, so can you! Give it a try": "现在是时候利用你的烹饪技能，用一些鸡蛋、小麦和糖制作美味的甜甜圈。什么？你不会做饭？当然你会！地球上有只老鼠会做饭，如果他能做到，你也能！试试看",
    "Fantastic! Food can heal you while in combat. Here's a dozen more donuts for free": "太棒了！食物可以在战斗中治疗你。这里还有一打免费的甜甜圈",
    "Now I want to take you on an expedition to one of our neighboring planets": "现在我想带你去我们的邻近行星之一进行探险",
    "the Smelly Planet! I hear there are lots of flies, and they bite! You'll want to bring your sword and some donuts. Let's go": "臭臭星球！我听说那里有很多苍蝇，它们会叮咬！你会想带上你的剑和一些甜甜圈。我们走吧",
    "Battling aliens earns you coins, resources, ability books, and even rare items": "与外星人战斗可以获得硬币、资源、能力书籍，甚至是稀有物品",
    "If you are knocked out during combat, you will recover in 150 seconds and continue fighting": "如果在战斗中被击倒，你将在150秒内恢复并继续战斗",
    "Looks like the tour is almost over. There's still much more to explore, but don't worry, you won't be alone! Once you level up a little more, you can chat with or get help from other players": "看起来游览快要结束了。还有很多地方可以探索，但不用担心，你不会孤单！一旦你再升级一点，你就可以与其他玩家聊天或寻求帮助",
    "You can also buy or sell items in our player-driven marketplace, unless you are playing Ironcow mode": "你还可以在由玩家驱动的市场上买卖物品，除非你在玩铁牛模式",
    "Before I go, here's a few more tips": "在我离开之前，再给你几个提示",
    "A Game Guide can be found at the bottom of the navigation menu on the left": "游戏指南可以在左侧导航菜单的底部找到",
    "If you go offline, you'll continue to make progress for 10 hours (upgradable": "如果你离线，你将继续进行10小时的进度（可升级",
    "Items, abilities, skills, and enemies can be hovered over (long press on mobile) to see more detailed tooltips": "可以将鼠标悬停在物品、能力、技能和敌人上（在移动设备上长按）以查看更详细的工具提示",
    "Bye Purple": "再见，紫色",
}

let translates = {}

for (let trans of [
    tranCommon,
    tranSkill,
    transEquip,
    tranItemCate,
    tranCombatStyle,
    tranDamageType,
    tranItemCurrencies,
    tranItemResources,
    tranItemConsumable,
    tranItemBook,
    tranItemEquipment,
    tranItemTool,
    tranItemBox,
    tranCow,
    tranForagPlace,
    tranMonster,
    tranOther,
]) {
    for (let key in trans) {
        translates[key.toLowerCase()] = trans[key];
    }
}

var transTaskMgr = {
    tasks: [],
    addTask: function (node, attr, text) {
        this.tasks.push({
            node,
            attr,
            text
        })
    },
    doTask: function () {
        let task = null;
        while (task = this.tasks.pop())
            task.node[task.attr] = task.text;
    },
}

function TransSubTextNode(node) {
    if (node.childNodes.length > 0) {
        for (let subnode of node.childNodes) {
            if (subnode.nodeName === "#text") {
                let text = subnode.textContent;
                let cnText = cnItem(text, subnode);
                cnText !== text && transTaskMgr.addTask(subnode, 'textContent', cnText);
            } else if (subnode.nodeName !== "SCRIPT" && subnode.nodeName !== "STYLE" && subnode.nodeName !== "TEXTAREA") {
                if (!subnode.childNodes || subnode.childNodes.length == 0) {
                    let text = subnode.innerText;
                    let cnText = cnItem(text, subnode);
                    cnText !== text && transTaskMgr.addTask(subnode, 'innerText', cnText);
                } else {
                    TransSubTextNode(subnode);
                }
            }
        }
    }
}

var cnItem = function (text, node) {
    if (typeof (text) != "string")
        return text;

    // 排除不需要翻译的
    for (const exclude of excludes) {
        if (exclude.toLowerCase() === text.toLocaleLowerCase()) {
            return text
        }
    }

    // 排除不需要翻译的(使用正则)
    for (const excludeReg of excludeRegs) {
        if (excludeReg.test(text)) {
            return text
        }
    }

    // 排除不需要翻译的(使用css选择器)
    for (const excludeSelector of excludeSelectors) {
        if (
            (node.nodeName !== "#text" && node.matches(excludeSelector))
            || (node.parentNode && node.parentNode.matches(excludeSelector))
        ) {
            return text
        }
    }

    // 消除后面空格
    if (/^(.+?)(\s+)$/.test(text)) {
        let res = /^(.+?)(\s+)$/.exec(text)
        return cnItem(res[1], node) + res[2]
    }

    // 消除前面空格
    if (/^(\s+)(.+)$/.test(text)) {
        let res = /^(\s+)(.+)$/.exec(text)
        return res[1] + cnItem(res[2], node)
    }

    //特殊处理技能效果
    if (
        (
            (node.nodeName !== "#text" && (node.matches('[class^="Ability_abilityDetail"] *') || node.matches('[class^="ItemTooltipText_abilityDetail"] *')))
            || (node.parentNode && (node.parentNode.matches('[class^="Ability_abilityDetail"] *') || node.parentNode.matches('[class^="ItemTooltipText_abilityDetail"] *')))
        )
        && text.startsWith('Effect: ')
    ) {
        text = text.substring(8)
        if (text.includes('. ')) {
            let newText = '';
            for (const part of text.split(". ")) {
                newText += translateAbilityEffect(part, node) + '. '
            }
            return "效果: " + newText;
        }
        return "效果: " + translateAbilityEffect(text, node)
    }

    //特殊处理触发器详细信息
    if (
        (node.nodeName !== "#text" && (node.matches('[class^="CombatTriggersSetting_detail"] *')))
        || (node.parentNode && (node.parentNode.matches('[class^="CombatTriggersSetting_detail"] *')))

    ) {
        //My Wisdom Coffee Is Inactive
        if (/^My (.+) Is (.+)$/.test(text)) {
            let res = /^My (.+) Is (.+)$/.exec(text)
            return "我的 " + cnItem(res[1], node) + " 是 " + cnItem(res[2], node)
        }
    }

    // You have reached level 32 Enhancing
    if (/^You have reached level (\d+) (.+)$/.test(text)) {
        let res = /^You have reached level (\d+) (.+)$/.exec(text)
        return "你已到达 " + cnItem(res[1], node) + " 级 " + cnItem(res[2], node)
    }

    // You have 1 unread task
    if (/^You have (\d+) unread tasks?$/.test(text)) {
        let res = /^You have (\d+) unread tasks?$/.exec(text)
        return "你有 " + cnItem(res[1], node) + " 个未读任务"
    }

    // like "test (Elite)"
    if (/^(.+)(\s*)\((.+)\)$/.test(text)) {
        let res = /^(.+)(\s*)\((.+)\)$/.exec(text)
        return cnItem(res[1], node) + res[2] + "(" + cnItem(res[3], node) + ")"
    }

    // 打怪任务翻译
    if (/^(Defeat)( [\S ]+)$/.test(text)) {
        let res = /^(Defeat)( [\S ]+)$/.exec(text)
        return cnItem(res[1], node) + cnItem(res[2], node)
    }

    // "Fight unlimited times"
    // "Gather up to 1 times"
    // "Fight up to 10 times"
    // "Produce up to 10 times"
    if (/^(Gather|Produce|Fight)(?: up to)? (\d+|unlimited) times$/.test(text)) {
        let res = /^(Gather|Produce|Fight)(?: up to)? (\d+|unlimited) times$/.exec(text)
        return cnItem(res[1], node) + " " + cnItem(res[2], node) + " 次"
    }

    // like "Add Queue #2"
    if (/^Add Queue #(\d+)$/.test(text)) {
        let res = /^Add Queue #(\d+)$/.exec(text)
        return "加入队列 #" + res[1]
    }

    // 你离线了 xxx时间
    if (/^(You were offline for)(.+)$/.test(text)) {
        let res = /^(You were offline for)(.+)$/.exec(text)
        return cnItem(res[1], node) + res[2]
    }

    // "Hi wilsonhe1, Welcome to Milky Way": "嗨，wilsonhe1，欢迎来到奶牛银河",
    if (/^Hi (.+), Welcome to Milky Way$/.test(text)) {
        let res = /^Hi (.+), Welcome to Milky Way$/.exec(text)
        return '嗨，' + res[1] + '，欢迎来到奶牛银河'
    }
    // "Ok wilsonhe1, I have to go now. It's time for my second lunch, and I have four stomachs to fill. Now go explore the Milky Way": "好的，wilsonhe1，我现在要走了。是我第二顿午餐的时间了，我有四个胃要填饱。现在去探索奶牛银河吧",
    if (/^Ok (.+), I have to go now. It's time for my second lunch, and I have four stomachs to fill. Now go explore the Milky Way$/.test(text)) {
        let res = /^Ok (.+), I have to go now. It's time for my second lunch, and I have four stomachs to fill. Now go explore the Milky Way$/.exec(text)
        return '好的，' + res[1] + '，我现在要走了。是我第二顿午餐的时间了，我有四个胃要填饱。现在去探索奶牛银河吧'
    }

    // Sell For 20000 Coins
    if (/^Sell For (\S+) Coins$/.test(text)) {
        let res = /^Sell For (\S+) Coins$/.exec(text)
        return "卖出" + res[1] + "硬币"
    }

    // like "Milking - Cow (99)"
    if (/^(.+)(\s+\(\d+\))$/.test(text)) {
        let res = /^(.+)(\s+\(\d+\))$/.exec(text)
        return cnItem(res[1], node) + res[2]
    }

    // like "Milking - Cow"
    if (/^(.+)( - )(.+)$/.test(text)) {
        let res = /^(.+)( - )(.+)$/.exec(text)
        return cnItem(res[1], node) + res[2] + cnItem(res[3], node)
    }

    // like "players: user"
    if (/^(.+)(:\s*)(.+)$/.test(text)) {
        let res = /^(.+)(:\s*)(.+)$/.exec(text)
        return cnItem(res[1], node) + res[2] + cnItem(res[3], node)
    }

    // like "Not built → Level 1"
    if (/^(.+)(\s+→\s+)(.+)$/.test(text)) {
        let res = /^(.+)(\s+→\s+)(.+)$/.exec(text)
        return cnItem(res[1], node) + res[2] + cnItem(res[3], node)
    }

    // 消除后面的非字母
    if (/^(.+?)([^a-zA-Z]+)$/.test(text)) {
        let res = /^(.+?)([^a-zA-Z]+)$/.exec(text)
        return cnItem(res[1], node) + res[2]
    }

    // 消除前面的非字母
    if (/^([^a-zA-Z]+)(.+)$/.test(text)) {
        let res = /^([^a-zA-Z]+)(.+)$/.exec(text)
        return res[1] + cnItem(res[2], node)
    }

    return baseTranslate(text)
};

function translateAbilityEffect(text, node) {
    if (text.endsWith('.')) {
        text = text.slice(0, -1)
    }
    // "attacks enemy for 10 HP + 60% stab damage as physical damage": "对敌人造成10点生命值 + 60% 刺伤伤害的物理伤害",
    // "attacks enemy for 20 HP + 90% stab damage as physical damage": "对敌人造成20点生命值 + 90% 刺伤伤害的物理伤害",
    // "attacks enemy for 30 HP + 110% stab damage as physical damage. Decreases target's armor by -20% for 10s": "对敌人造成30点生命值 + 110% 刺伤伤害的物理伤害。使目标的护甲降低 -20%，持续10秒",
    // "attacks enemy for 10 HP + 60% slash damage as physical damage": "对敌人造成10点生命值 + 60% 斩击伤害的物理伤害",
    // "attacks all enemies for 20 HP + 50% slash damage as physical damage": "对所有敌人造成20点生命值 + 50% 斩击伤害的物理伤害",
    // "attacks enemy for 10 HP + 60% smash damage as physical damage": "对敌人造成10点生命值 + 60% 粉碎伤害的物理伤害",
    // "attacks all enemies for 20 HP + 50% smash damage as physical damage": "对所有敌人造成20点生命值 + 50% 粉碎伤害的物理伤害",
    // "attacks enemy for 10 HP + 55% ranged damage as physical damage": "对敌人造成10点生命值 + 55% 远程伤害的物理伤害",
    // "attacks enemy for 20 HP + 90% ranged damage as water damage": "对敌人造成20点生命值 + 90% 远程伤害的水属性伤害",
    // "attacks enemy for 20 HP + 90% ranged damage as fire damage": "对敌人造成20点生命值 + 90% 远程伤害的火属性伤害",
    // "attacks all enemies for 20 HP + 50% ranged damage as physical damage": "对所有敌人造成20点生命值 + 50% 远程伤害的物理伤害",
    // "attacks enemy for 10 HP + 55% magic damage as water damage": "对敌人造成10点生命值 + 55% 魔法伤害的水属性伤害",
    // "attacks enemy for 20 HP + 120% magic damage as water damage. Decreases target's attack speed by -25% for 8s": "对敌人造成20点生命值 + 120% 魔法伤害的水属性伤害。使目标的攻击速度降低 -25%，持续8秒",
    // "attacks all enemies for 30 HP + 100% magic damage as water damage. Decreases target's evasion by -20% for 9s": "对所有敌人造成30点生命值 + 100% 魔法伤害的水属性伤害。使目标的闪避率降低 -20%，持续9秒",
    // "attacks all enemies for 20 HP + 80% magic damage as nature damage. Decreases target's armor by -12 for 12s. Decreases target's water resistance by -15 for 12s. Decreases target's nature resistance by -20 for 12s. Decreases target's fire resistance by -15 for 12s": "对所有敌人造成20点生命值 + 80% 魔法伤害的自然属性伤害。使目标的护甲降低 -12，持续12秒。使目标的水属性抗性降低 -15，持续12秒。使目标的自然属性抗性降低 -20，持续12秒。使目标的火属性抗性降低 -15，持续12秒",
    // "attacks enemy for 10 HP + 55% magic damage as fire damage": "对敌人造成10点生命值 + 55% 魔法伤害的火属性伤害",
    // "attacks all enemies for 20 HP + 80% magic damage as fire damage": "对所有敌人造成20点生命值 + 80% 魔法伤害的火属性伤害",
    let reg = /^attacks (enemy|all enemies) for ([\d.]+(?: HP|MP|%|s)?) \+ ([\d.]+(?: HP|MP|%|s)?) ([a-zA-Z ]+) as ([a-zA-Z ]+)$/
    if (reg.test(text)) {
        let res = reg.exec(text)
        return "对" + cnItem(res[1], node) + "造成 " + res[2] + " + " + res[3] + " " + cnItem(res[4], node) + "作为" + cnItem(res[5], node)
    }
    // "attacks enemy for 30 HP + 110% stab damage as physical damage. Decreases target's armor by -20% for 10s": "对敌人造成30点生命值 + 110% 刺伤伤害的物理伤害。使目标的护甲降低 -20%，持续10秒",
    // "attacks enemy for 20 HP + 120% magic damage as water damage. Decreases target's attack speed by -25% for 8s": "对敌人造成20点生命值 + 120% 魔法伤害的水属性伤害。使目标的攻击速度降低 -25%，持续8秒",
    // "attacks all enemies for 30 HP + 100% magic damage as water damage. Decreases target's evasion by -20% for 9s": "对所有敌人造成30点生命值 + 100% 魔法伤害的水属性伤害。使目标的闪避率降低 -20%，持续9秒",
    // "attacks all enemies for 20 HP + 80% magic damage as nature damage. Decreases target's armor by -12 for 12s. Decreases target's water resistance by -15 for 12s. Decreases target's nature resistance by -20 for 12s. Decreases target's fire resistance by -15 for 12s": "对所有敌人造成20点生命值 + 80% 魔法伤害的自然属性伤害。使目标的护甲降低 -12，持续12秒。使目标的水属性抗性降低 -15，持续12秒。使目标的自然属性抗性降低 -20，持续12秒。使目标的火属性抗性降低 -15，持续12秒",
    reg = /^Decreases target's ([a-zA-Z ]+) by (-[\d.]+?(?: HP|MP|%|s)?) for ([\d.]+(?: HP|MP|%|s)?)$/
    if (reg.test(text)) {
        let res = reg.exec(text)
        return "使目标的" + cnItem(res[1], node) + "降低 " + res[2] + " 持续 " + res[3]
    }
    // "attacks enemy for 30 HP + 100% smash damage as physical damage and 70% chance to stun for 3s": "对敌人造成30点生命值 + 100% 粉碎伤害的物理伤害，并有70%的几率眩晕3秒",
    // "attacks enemy for 30 HP + 100% ranged damage as physical damage and 60% chance to silence for 5s": "对敌人造成30点生命值 + 100% 远程伤害的物理伤害，并有60%的几率沉默5秒",
    // "attacks enemy for 10 HP + 90% magic damage as nature damage and 40% chance to stun for 3s": "对敌人造成10点生命值 + 90% 魔法伤害的自然属性伤害，并有40%的几率眩晕3秒",
    // "attacks all enemies for 30 HP + 100% magic damage as nature damage and 60% chance to blind for 5s": "对所有敌人造成30点生命值 + 100% 魔法伤害的自然属性伤害，并有60%的几率致盲5秒",
    reg = /^attacks (enemy|all enemies) for ([\d.]+(?: HP|MP|%|s)?) \+ ([\d.]+(?: HP|MP|%|s)?) ([a-zA-Z ]+) as ([a-zA-Z ]+) and ([\d.]+(?: HP|MP|%|s)?) chance to ([a-zA-Z ]+) for ([\d.]+(?: HP|MP|%|s)?)$/
    if (reg.test(text)) {
        let res = reg.exec(text)
        return "对" + cnItem(res[1], node) + "造成 " + res[2] + " + " + res[3] + " " + cnItem(res[4], node) + "作为" + cnItem(res[5], node) + "并有 " + res[6] + " 的几率" + cnItem(res[7], node) + " " + res[8]
    }
    // "attacks enemy for 20 HP + 65% slash damage as physical damage and bleeds for 100% dealt damage over 15s": "对敌人造成20点生命值 + 65% 斩击伤害作为物理伤害，并在15秒内造成等同于所造成伤害100%的出血伤害",
    // "attacks all enemies for 20 HP + 60% magic damage as fire damage and burns for 100% dealt damage over 10s": "对所有敌人造成20点生命值 + 60% 魔法伤害作为火焰伤害，并在10秒内造成等同于所造成伤害100%的燃烧伤害",
    reg = /^attacks (enemy|all enemies) for ([\d.]+(?: HP|MP|%|s)?) \+ ([\d.]+(?: HP|MP|%|s)?) ([a-zA-Z ]+) as ([a-zA-Z ]+) and ([a-zA-Z ]+) for ([\d.]+(?: HP|MP|%|s)?) dealt damage over ([\d.]+(?: HP|MP|%|s)?)$/
    if (reg.test(text)) {
        let res = reg.exec(text)
        return "对" + cnItem(res[1], node) + "造成 " + res[2] + " + " + res[3] + " " + cnItem(res[4], node) + "作为" + cnItem(res[5], node) + "并在 " + res[8] + " 内造成等同于所造成伤害 " + res[7] + " 的" + cnItem(res[6], node) + "伤害"
    }
    // "attacks enemy with 200% total accuracy for 30 HP + 100% ranged damage as physical damage": "对敌人以200%总命中率造成30点生命值 + 100%远程伤害作为物理伤害",
    reg = /^attacks (enemy|all enemies) with ([\d.]+(?: HP|MP|%|s)?) ([a-zA-Z ]+) for ([\d.]+(?: HP|MP|%|s)?) \+ ([\d.]+(?: HP|MP|%|s)?) ([a-zA-Z ]+) as ([a-zA-Z ]+)$/
    if (reg.test(text)) {
        let res = reg.exec(text)
        return "对" + cnItem(res[1], node) + "以 " + res[2] + " " + cnItem(res[3], node) + "造成 " + res[4] + " + " + res[5] + " " + cnItem(res[6], node) + "作为" + cnItem(res[7], node)
    }
    // "heals self for 20 HP + 30% magic damage": "对自己恢复20点生命值 + 30% 魔法伤害",
    // "heals self for 30 HP + 45% magic damage": "为自己恢复30点生命值 + 45% 魔法伤害",
    // "heals lowest HP ally for 40 HP + 25% magic damage": "为生命值最低的盟友恢复40点生命值 + 25% 魔法伤害",
    // "heals all allies for 30 HP + 25% magic damage": "为所有盟友恢复30点生命值 + 25% 魔法伤害",
    reg = /^heals (self|all allies|lowest HP ally) for ([\d.]+(?: HP|MP|%|s)?) \+ ([\d.]+(?: HP|MP|%|s)?) ([a-zA-Z ]+)$/
    if (reg.test(text)) {
        let res = reg.exec(text)
        return "对" + cnItem(res[1], node) + "恢复 " + res[2] + " + " + res[3] + " " + cnItem(res[4], node)
    }
    // "Increases all allies critical rate by 3% for 120s": "增加所有盟友的暴击率3%，持续120秒",
    // "Increases all allies nature amplify by 6% for 120s. Increases all allies healing amplify by 6% for 120s. Increases all allies nature resistance by 4 for 120s": "增加所有盟友的自然属性强化6%，持续120秒。增加所有盟友的治疗强化6%，持续120秒。增加所有盟友的自然属性抗性4，持续120秒",
    // "Increases all allies attack speed by 3% for 120s. Increases all allies cast speed by 3% for 120s": "增加所有盟友的攻击速度3%，持续120秒。增加所有盟友的施法速度3%，持续120秒",
    // "Increases all allies physical amplify by 6% for 120s. Increases all allies armor by 4 for 120s": "增加所有盟友的物理强化6%，持续120秒。增加所有盟友的护甲4，持续120秒",
    // "Increases all allies water amplify by 8% for 120s. Increases all allies water resistance by 4 for 120s": "增加所有盟友的水属性强化8%，持续120秒。增加所有盟友的水属性抗性4，持续120秒",
    // "Increases all allies fire amplify by 8% for 120s. Increases all allies fire resistance by 4 for 120s": "增加所有盟友的火属性强化8%，持续120秒。增加所有盟友的火属性抗性4，持续120秒",
    reg = /^Increases all allies ([a-zA-Z ]+) by ([\d.]+(?: HP|MP|%|s)?) for ([\d.]+(?: HP|MP|%|s)?)$/
    if (reg.test(text)) {
        let res = reg.exec(text)
        return "增加所有盟友的" + cnItem(res[1], node) + " " + res[2] + " 持续 " + res[3]
    }
    // "Increases threat by 200% for 60s": "增加200%的威胁等级，持续60秒",
    // "Increases threat by 400% for 60s": "增加400%的威胁等级，持续60秒",
    // "Increases evasion by 20% for 20s": "增加20%的闪避，持续20秒",
    // "Increases accuracy by 30% for 20s": "增加30%的准确性，持续20秒",
    // "Increases physical amplify by 18% for 20s": "增加18%的物理强化，持续20秒",
    // "Increases attack speed by 20% for 20s": "增加20%的攻击速度，持续20秒",
    // "Increases physical reflect power by 20% for 20s": "增加20%的物理反射能力，持续20秒",
    // "Increases life steal by 8% for 20s": "增加8%的生命偷取，持续20秒",
    // "Increases water amplify by 40% for 20s. Increases nature amplify by 40% for 20s. Increases fire amplify by 40% for 20s": "增加40%的水属性强化，持续20秒。增加40%的自然属性强化，持续20秒。增加40%的火属性强化，持续20秒",
    // "Increases damage by 30% for 12s. Increases attack speed by 30% for 12s. Increases cast speed by 30% for 12s": "增加30%的伤害，持续12秒。增加30%的攻击速度，持续12秒。增加30%的施法速度，持续12秒",
    // "Increases armor by 700 for 12s. Increases water resistance by 700 for 12s. Increases nature resistance by 700 for 12s. Increases fire resistance by 700 for 12s. Increases tenacity by 700 for 12s": "增加700的护甲，持续12秒。增加700的水属性抗性，持续12秒。增加700的自然属性抗性，持续12秒。增加700的火属性抗性，持续12秒。增加700的坚韧，持续12秒",
    reg = /^Increases ([a-zA-Z ]+) by ([\d.]+(?: HP|MP|%|s)?) for ([\d.]+(?: HP|MP|%|s)?)$/
    if (reg.test(text)) {
        let res = reg.exec(text)
        return "增加" + cnItem(res[1], node) + " " + res[2] + " 持续 " + res[3]
    }
    // "Increases armor by 20% + 20 for 20s. Increases water resistance by 20% + 20 for 20s. Increases nature resistance by 20% + 20 for 20s. Increases fire resistance by 20% + 20 for 20s": "增加20% + 20的护甲，持续20秒。增加20% + 20的水属性抗性，持续20秒。增加20% + 20的自然属性抗性，持续20秒。增加20% + 20的火属性抗性，持续20秒",
    reg = /^Increases ([a-zA-Z ]+) by ([\d.]+(?: HP|MP|%|s)?) \+ ([\d.]+(?: HP|MP|%|s)?) for ([\d.]+(?: HP|MP|%|s)?)$/
    if (reg.test(text)) {
        let res = reg.exec(text)
        return "增加" + cnItem(res[1], node) + " " + res[2] + " + " + res[3] + " 持续 " + res[4]
    }
    // "revives and heals a dead ally for 100 HP + 40% magic damage": "复活并为一个死亡的盟友恢复100点生命值 + 40% 魔法伤害",
    reg = /^revives and heals a dead ally for ([\d.]+(?: HP|MP|%|s)?) \+ ([\d.]+(?: HP|MP|%|s)?) ([a-zA-Z ]+)$/
    if (reg.test(text)) {
        let res = reg.exec(text)
        return "复活并为一个死亡的盟友恢复" + res[1] + " 持续 " + res[2]
    }
    // "costs 30% of current HP": "消耗当前生命值的30%",
    reg = /^costs ([\d.]+(?: HP|MP|%|s)?) of current HP$/
    if (reg.test(text)) {
        let res = reg.exec(text)
        return "耗当前生命值的 " + res[1]
    }


    return baseTranslate(text)
}

var unSet = new Set()

function baseTranslate(text) {
    if (translates[text.toLowerCase()]) {
        return translates[text.toLowerCase()]
    } else if (text.toLowerCase().endsWith("es") && translates[text.toLowerCase().slice(0, -2)]) {
        return translates[text.toLowerCase().slice(0, -2)]
    } else if (text.toLowerCase().endsWith("s") && translates[text.toLowerCase().slice(0, -1)]) {
        return translates[text.toLowerCase().slice(0, -1)]
    } else {
        unSet.add(text)
        return text
    }
}

! function () {
    let observer_config = {
        attributes: false,
        characterData: true,
        childList: true,
        subtree: true
    };
    let targetNode = document.body;
    //汉化静态页面内容
    TransSubTextNode(targetNode);
    transTaskMgr.doTask();
    //监听页面变化并汉化动态内容
    let observer = new MutationObserver(function (e) {
        //window.beforeTransTime = performance.now();
        observer.disconnect();
        for (let mutation of e) {
            if (mutation.target.nodeName === "SCRIPT" || mutation.target.nodeName === "STYLE" || mutation.target.nodeName === "TEXTAREA") continue;
            if (mutation.target.nodeName === "#text") {
                mutation.target.textContent = cnItem(mutation.target.textContent, mutation.target);
            } else if (!mutation.target.childNodes || mutation.target.childNodes.length == 0) {
                mutation.target.innerText = cnItem(mutation.target.innerText, mutation.target);
            } else if (mutation.addedNodes.length > 0) {
                for (let node of mutation.addedNodes) {
                    if (node.nodeName === "#text") {
                        node.textContent = cnItem(node.textContent, node);
                    } else if (node.nodeName !== "SCRIPT" && node.nodeName !== "STYLE" && node.nodeName !== "TEXTAREA") {
                        if (!node.childNodes || node.childNodes.length == 0) {
                            if (node.innerText)
                                node.innerText = cnItem(node.innerText, node);
                        } else {
                            TransSubTextNode(node);
                            transTaskMgr.doTask();
                            // console.log(JSON.stringify(Array.from(unSet)))
                        }
                    }
                }
            }
        }
        observer.observe(targetNode, observer_config);
        itemFilter();
        //window.afterTransTime = performance.now();
        //console.log("捕获到页面变化并执行汉化，耗时" + (afterTransTime - beforeTransTime) + "毫秒");
    });
    observer.observe(targetNode, observer_config);

    itemFilter()
}();

let reverseTranslates = {}

for (let trans of [
    tranItemCurrencies,
    tranItemResources,
    tranItemConsumable,
    tranItemBook,
    tranItemEquipment,
    tranItemTool,
    tranItemBox,
]) {
    for (let key in trans) {
        reverseTranslates[trans[key]] = key.toLowerCase();
    }
}

function itemFilter() {
    const itemFilterSelectors = [['[class^="Inventory_itemFilterContainer"]', '[class^="Inventory_inventoryFilterInput"]'], ['[class^="MarketplacePanel_itemFilterContainer"]', '[class^="MarketplacePanel_itemFilterInput"]']];
    for (const [divSelector, inputSelector] of itemFilterSelectors) {
        // 获取原始的div和input元素
        const nodes = document.querySelectorAll(divSelector);

        // 如果节点数量不唯一，则跳过
        if (nodes.length !== 1) {
            return;
        }

        // 获取原始的div和input元素
        const originalDiv = nodes[0];;
        const originalInput = originalDiv.querySelector(inputSelector);

        // 创建新的div和input元素
        const newDiv = originalDiv.cloneNode(true);
        const newInput = newDiv.querySelector(inputSelector);

        // 修改新input的placeholder内容
        newInput.placeholder = "项目过滤器";

        // 将新的div插入到原始div的上方
        originalDiv.parentNode.insertBefore(newDiv, originalDiv);

        // 监听新input的change事件
        newInput.addEventListener('change', function () {
            if (newInput.value) {
                for (let key in reverseTranslates) {
                    if (key.includes(newInput.value.trim())) {
                        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
                            window.HTMLInputElement.prototype,
                            'value').set;
                        nativeInputValueSetter.call(originalInput, reverseTranslates[key]);
                        const event = new Event('input', { bubbles: true });
                        originalInput.dispatchEvent(event);
                        break
                    }
                }
            }
        });
    }
}