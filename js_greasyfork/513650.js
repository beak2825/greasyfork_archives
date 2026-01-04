// ==UserScript==
// @name         Milky way idle汉化插件stable
// @namespace    http://tampermonkey.net/
// @version      2.17.0
// @description  为Milky way idle汉化并兼容MWITool插件，汉化问题请游戏内私聊Stella
// @license      hewilson Sweety 夜凌 好阳光的小锅巴 bot740 Stella 七包茶
// @match        https://www.milkywayidle.com/*
// @match        https://milkywayidle.wiki.gg/*
// @match        https://test.milkywayidle.com/*
// @match        https://mooneycalc.vercel.app/
// @match        https://cowculator.info/
// @match        https://mwisim.github.io/
// @match        https://mwisim.github.io/test/
// @match        http://43.129.194.214:5000/mwisim.github.io
// @match        https://amvoidguy.github.io/MWICombatSimulatorTest/dist/index.html
// @match        https://kobayashi7777.github.io/simTest/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=milkywayidle.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/513650/Milky%20way%20idle%E6%B1%89%E5%8C%96%E6%8F%92%E4%BB%B6stable.user.js
// @updateURL https://update.greasyfork.org/scripts/513650/Milky%20way%20idle%E6%B1%89%E5%8C%96%E6%8F%92%E4%BB%B6stable.meta.js
// ==/UserScript==
//目录
//1.排除非翻译部分
//2.中文对照部分
	//2.1通用页面
		//2.1.1
	//2.2 专业
	//2.3 装备栏
	//2.4 物品目录
		//2.4.1 货币
		//2.4.2资源(商店顺序)
		//2.4.3消耗品
		//2.4.4技能书
		//2.4.5资源(商店顺序)
		//2.4.6装备(商店顺序)
		//2.4.7工具
	 // 2.5宝箱
	// 2.6奶牛
	// 2.7采摘地点
	// 2.8怪物
	// 2.9其他


//1.排除非翻译部分
const excludeRegs = [
    // 一个字母都不包含
    /^[^a-zA-Z]*$/,
    // 排除时间
    /^(\d+h )?(\d+m )?(\d+s)*$/,
    // 等级
    /^Lv.\d+$/,
];
const excludes = ["K", "M", "B", "D", "H", "S", "Lv", "MAX", "wiki", "discord", "XP", "N/A"];
const excludeSelectors = [
    // 排除人名相关
    '[class^="CharacterName"]',
    // 排除排行榜人名
    '[class^="CharacterName_name__1amXp"] span',
    // 排除共享链接
    '[class^="SocialPanel_referralLink"]',
    // 排除工会介绍
    '[class^="GuildPanel_message"]',
    // 排除工会名字
    '[class^="GuildPanel_guildName"]',
    // 排除排行榜工会名字
    '[class^="LeaderboardPanel_guildName"]',
    // 排除个人信息工会名字
    '[class^="CharacterName_characterName__2FqyZ CharacterName_xlarge__1K-fn"]',
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

//2.1通用页面
const tranCommon = {
    Reroll: "重随任务",
    Back: "返回",
    level: "等级",
    Gather: "收集",
    Produce: "生产",
    Fight: "战斗",
    times: "次数",
    Queued: "生产队列",
    Purple: "紫色",
    Task: "任务",
    Reward: "奖励",
    Go: "前往",
    Open: "打开",
    "Right Click": "点击右键",
    enemy: "敌人",
    "all enemies": "所有敌人",
    "physical damage": "物理伤害",
    "ranged damage": "远程伤害",
    "magic damage": "魔法伤害",
    "water damage": "水系伤害",
    "nature damage": "自然伤害",
    "fire damage": "火焰伤害",
    "Physical Amplify": "物理伤害增幅",
    stun: "眩晕",
    silence: "沉默",
    bleed: "流血",
    burn: "燃烧",
    "total accuracy": "总精准",
    self: "自己",
    blind: "致盲",
    "Queued Actions": "队列中的动作",
    "Increases quantity of combat loot": "增加战斗战利品数量",
    Elite: "精英",
    "Are you sure you want to run away from combat": "你确定要跑路吗",
    No: "否",
    Yes: "是",
    Stop: "停止",
    "in combat": "战斗中",
    unlimited: "无限制",
    "Opened Loot": "打开战利品",
    "You found": "你找到",
    "Are you sure you want to replace your queued actions": "这样做将清空目前的队列",
    Learn: "学习",

    use: "使用",

    "Create Party": "创建队伍",
    Support: "支援",
    Tank: "坦克",
    Join: "加入",
    "Party created": "队伍已创建",
    "My Party": "我的队伍",
    "Disband Party": "解散队伍",
    "Leave Party": "离开队伍",
    "Added friend": "新增好友",
    "Removed friend": "已删除好友",
    "Friend already added": "已添加为好友",
    "Character name not found": "未找到角色名称",
    "Any Role": "任意角色",
    "Lv. Req": "等级要求",
    Slot: "位置",
    "Add Slot": "添加位置",
    "Party disbanded": "队伍已解散",
    Save: "保存",
    "Edit Party": "编辑队伍",
    Ready: "准备",
    "Party options saved": "队伍选项已保存",
    "Party is open for recruiting": "队伍正在招募中",
    "You are ready to battle": "你已准备好战斗",
    "You are not ready to battle": "你未准备好战斗",
    "You have joined the party": "你加入了队伍",
    "You have left the party": "你离开了队伍",
    "give leadership": "转让队长",
    Defeat: "击败",
    Start: "开始",
    disabled: "已禁用",
    off: "关",
    gain: "获得",
    "NO items available": "无物品可用",
    Weapon: "主手/双手武器",
    Offhand: "副手",
    Presets:"预设套装",
    Physical: "物理",
    ranged: "远程",
    magic: "魔法",
    Slash: "斩击",
    Stab: "刺击",
    Smash: "钝击",
    Water: "水",
    Nature: "自然",
    Fire: "火",

};


//2.2 专业
const tranSkill = {
    milking: "挤奶",
    mooooooooo: "哞哞哞...",
    foraging: "采摘",
    "Master the skill of picking up things": "我在小小的花园里面挖呀挖呀挖",
    woodcutting: "伐木",
    "Chop chop": "请时刻警惕周围的光头强",
    cheesesmithing: "奶酪锻造",
    "Did you know you can make equipment using these special hardened cheeses": "芝士就是...打铁！",
    crafting: "制作",
    "Create weapons, jewelry, and more": "加工远程和魔法武器、以及碎掉刚买的宝石",
    tailoring: "裁缝",
    "Create ranged and magic clothing": "魔法缝纫，定制您的传奇装束！",
    cooking: "烹饪",
    "The art of making healthy food": "制作各种碳水炸弹",
    brewing: "冲泡",
    "The art of making tasty drinks": "我在牛牛007的最佳伴侣",
    Alchemy: "炼金",
    "Transform items into other items": "摇，摇，晃，摇",
    enhancing: "强化",
    "Make your equipment more powerful": "强化...然后狗叫,汪~汪~汪!!!",
    combat: "战斗",
    "Fight monsters. Your combat level represents your overall combat effectiveness based on the combination of individual combat skill levels":
    "战斗等级代表了目前攻击方式的各个小项等级水平的综合评估",
    stamina: "耐力",
    "Increases max HP by 10 per level. You gain experience mainly from taking damage and slightly from avoiding damage": "每级+10点最大生命值。经验获取方式：受到伤害【大量】/避免伤害【少量】",
    intelligence: "智力",
    "Increases max MP by 10 per level. You gain experience when consuming mana while using abilities": "每级增加10点最大魔力值。经验获取方式：消耗法力",
    attack: "攻击",
    "Increases your melee accuracy and base attack speed. You gain experience when dealing melee damage, with more experience gained from stab and less from smash":
        "增加你的近战精准和基础攻击速度。经验获取方式：造成刺击伤害【大量】/造成斩击伤害【适量】/造成钝击伤害【少量】",
    power: "力量",
    "Increases your melee damage. You gain experience when dealing melee damage, with more experience gained from smash and less from stab":
        "增加你的近战伤害。经验获取方式：造成钝击伤害【大量】/造成斩击伤害【适量】/造成刺击伤害【少量】",
    defense: "防御",
    "Increases your evasion, armor, and elemental resistances. You gain experience when dodging or mitigating damage": "增加你的闪避、护甲和元素抗性。经验获取方式：闪避/减免伤害",
    ranged: "远程",
    "Increases your ranged accuracy, ranged damage, and magic evasion. Ranged attacks can critical strike. You gain experience when dealing ranged damage":
        "增加你的远程精准、远程伤害和魔法闪避。远程攻击可以暴击。经验获取方式：造成远程伤害",
    magic: "魔法",
    "Increases your magic accuracy, magic damage, and elemental resistances. You gain experience when dealing magic damage": "增加你的魔法精准、魔法伤害和元素抗性。经验获取方式：造成魔法伤害",
};

//2.3 装备栏
const transEquip = {
    "Main Hand": "主手",
    "Off Hand": "副手",
    "Two Hand": "双手",
    Earrings: "耳环",
    Head: "头部",
    Neck: "项链",
    Body: "身体",
    Legs: "腿部",
    Hands: "手部",
    Ring: "戒指",
    Feet: "脚部",
    Trinket:"饰品",
    Pouch: "袋子",
    "Milking Tool": "挤奶工具",
    "Foraging Tool": "采摘工具",
    "Woodcutting Tool": "伐木工具",
    "Wood-Cutting Tool": "伐木工具",
    "Cheese Smithing Tool": "奶酪锻造工具",
    "Cheesesmithing Tool": "奶酪锻造工具",
    "Cheese-Smithing Tool": "奶酪锻造工具",
    "Crafting Tool": "制作工具",
    "Tailoring Tool": "裁缝工具",
    "Cooking Tool": "烹饪工具",
    "Brewing Tool": "冲泡工具",
    "Alchemy Tool": "炼金工具",
    "Enhancing Tool": "强化工具",
};

//2.4 物品目录
const tranItemCate = {
    Currencie: "货币",
    Food: "食物",
    Drink: "饮料",
    Resource: "资源",
    Consumable: "消耗品",
    "Ability Book": "技能书",
    Equipment: "装备",
    Tool: "工具",
};

//2.4.1 货币
const tranItemCurrencies = {
    Coin: "硬币",
    "Basic currency": "基础货币",
    "Task Token": "任务代币",
    "Task currency. Spend these in the Task Shop": "任务货币。在任务商店中使用这些货币",
    "Chimerical Token": "奇幻代币",
    "Chimerical Tokens": "奇幻代币",
    "Dungeon currency from the Chimerical Den. Spend these in the Shop": "来自【奇幻洞穴】的地下城货币。可以在商店里消费",
    "Sinister Token": "邪恶代币",
    "Sinister Tokens": "邪恶代币",
    "Dungeon currency from the Sinister Circus. Spend these in the Shop": "来自【邪恶马戏团】的地下城货币。可以在商店里消费",
    "Enchanted Token": "秘法代币",
    "Enchanted Tokens": "秘法代币",
    "Dungeon currency from the Enchanted Fortress. Spend these in the Shop": "来自【秘法要塞】的地下城货币。可以在商店里消费",
    Cowbell: "牛铃",
    "Premium currency. Buy or spend these in the Cowbell Store": "高级货币。在牛铃商店购买或使用这些货币",
};

//2.4.2资源(商店顺序)
const tranItemResources = {
    "Bag Of 10 Cowbells": "10牛铃包",
    "Tradable bag of 10 Cowbells. Once opened, the Cowbells can no longer be sold on the market": "可交易的10个牛铃的袋子。一旦打开，牛铃将无法在市场上出售",
    Milk: "牛奶",
    mooo: "哞",
    "Verdant Milk": "翠绿牛奶",
    moooo: "哞哞",
    "Azure Milk": "蔚蓝牛奶",
    mooooo: "哞哞哞",
    "Burble Milk": "深紫牛奶",
    moooooo: "哞哞哞哞",
    "Crimson Milk": "深红牛奶",
    mooooooo: "哞哞哞哞哞",
    "Rainbow Milk": "彩虹牛奶",
    moooooooo: "哞哞哞哞哞哞",
    "Holy Milk": "神圣牛奶",
    mooooooooo: "哞哞哞哞哞哞哞",
    Cheese: "奶酪",
    "Verdant Cheese": "翠绿奶酪",
    "Azure Cheese": "蔚蓝奶酪",
    "Burble Cheese": "深紫奶酪",
    "Crimson Cheese": "深红奶酪",
    "Rainbow Cheese": "彩虹奶酪",
    "Holy Cheese": "神圣奶酪",
    Log: "原木",
    "Birch Log": "白桦原木",
    "Cedar Log": "雪松原木",
    "Purpleheart Log": "紫心原木",
    "Ginkgo Log": "银杏原木",
    "Redwood Log": "红杉原木",
    "Arcane Log": "神秘原木",
    Lumber: "木板",
    "Birch Lumber": "白桦木板",
    "Cedar Lumber": "雪松木板",
    "Purpleheart Lumber": "紫心木板",
    "Ginkgo Lumber": "银杏木板",
    "Redwood Lumber": "红杉木板",
    "Arcane Lumber": "神秘木板",
    "Rough Hide": "粗糙兽皮",
    "Gobo": "哥布林",
    "Reptile Hide": "爬行动物皮",
    "Gobo Hide": "哥布林皮",
    "Beast Hide": "野兽皮",
    "Umbral Hide": "暗影皮",
    "Rough Leather": "粗糙皮革",
    "Reptile Leather": "爬行动物皮革",
    "Gobo Leather": "哥布林皮革",
    "Beast Leather": "野兽皮革",
    "Umbral Leather": "暗影皮革",
    Cotton: "棉花",
    Flax: "亚麻",
    "Bamboo Branch": "竹子",
    Cocoon: "茧",
    "Radiant Fiber": "光辉纤维",
    "Cotton Fabric": "棉花布料",
    "Linen Fabric": "亚麻布料",
    "Bamboo Fabric": "竹子布料",
    "Silk Fabric": "丝绸",
    "Radiant Fabric": "光辉布料",
    Egg: "鸡蛋",
    Wheat: "小麦",
    Sugar: "糖",
    Blueberry: "蓝莓",
    Blackberry: "黑莓",
    Strawberry: "草莓",
    Mooberry: "月梅",
    Marsberry: "火星梅",
    Spaceberry: "太空梅",
    Apple: "苹果",
    Orange: "橙子",
    Plum: "李子",
    Peach: "桃子",
    "Dragon Fruit": "火龙果",
    "Star Fruit": "杨桃",
    "Arabica Coffee Bean": "次级咖啡豆",
    "Robusta Coffee Bean": "低级咖啡豆",
    "Liberica Coffee Bean": "中级咖啡豆",
    "Excelsa Coffee Bean": "高级咖啡豆",
    "Fieriosa Coffee Bean": "火山咖啡豆",
    "Spacia Coffee Bean": "太空咖啡豆",
    "Green Tea Leaf": "绿茶叶",
    "Black Tea Leaf": "黑茶叶",
    "Burble Tea Leaf": "紫茶叶",
    "Moolong Tea Leaf": "月亮茶叶",
    "Red Tea Leaf": "红茶叶",
    "Emp Tea Leaf": "虚空茶叶",

    "Catalyst Of Coinification": "点金催化剂",
    "Used in alchemy to increase the coinifying success rate by 15% (multiplicative). One catalyst is consumed on success": "用于炼金，使【点金】成功率提高15%（乘法计算），成功时会消耗一个。",
    "Catalyst Of Decomposition": "分解催化剂",
    "Used in alchemy to increase the decomposition success rate by 15% (multiplicative). One catalyst is consumed on success": "用于炼金，使【分解】成功率提高15%（乘法计算），成功时会消耗一个",
    "Catalyst Of Transmutation": "重组催化剂",
    "Used in alchemy to increase the transmutation success rate by 15% (multiplicative). One catalyst is consumed on success": "用于炼金，使【重组】成功率提高15%（乘法计算），成功时会消耗一个",
    "Prime Catalyst": "主要催化剂",
    "Used in alchemy to increase the success rate of any action by 25% (multiplicative). One catalyst is consumed on success": "用于炼金，使任何炼金行动的成功率提高 25%（乘法计算），成功时会消耗一个",

    "Gluttonous Energy": "贪食能量",
    "Guzzling Energy": "暴饮能量",
    "Snake Fang": "蛇牙",
    "Material used in smithing Snake Fang Dirk": "用于锻造蛇牙短剑的材料",
    "Shoebill Feather": "靴嘴鹳羽毛",
    "Material used in tailoring Shoebill Shoes": "用于缝纫靴嘴鹳鞋的材料",
    "Snail Shell": "蜗牛壳",
    "Material used in smithing Snail Shell Helmet": "用于锻造蜗牛壳头盔的材料",
    "Crab Pincer": "蟹钳",
    "Material used in smithing Pincer Gloves": "用于锻造螃蟹手套的材料",
    "Turtle Shell": "乌龟壳",
    "Material used in smithing Turtle Shell Plate Body or Legs": "用于锻造龟壳胸甲或护腿的材料",
    "Marine Scale": "海洋鳞片",
    "Material used in tailoring Marine Tunic or Chaps": "用于缝纫航海束腰或裤子的材料",
    "Treant Bark": "树皮",
    "Material used in crafting Treant Shield": "用于制作树人盾的材料",
    "Centaur Hoof": "半人马蹄",
    "Material used in tailoring Centaur Boots": "用于缝纫半人马靴的材料",
    "Luna Wing": "月神翼",
    "Material used in tailoring Luna Robe Top or Bottoms": "用于缝纫月神长袍或裙子的材料",
    "Gobo Rag": "哥布林破布",
    "Material used in tailoring Collector's Boots": "用于缝纫收藏家靴的材料",
    "Goggles": "护目镜",
    "Material used in smithing Vision Helmet": "用于锻造视觉头盔的材料",
    "Magnifying Glass": "放大镜",
    "Material used in smithing Vision Shield or tailoring Sighted Bracers": "用于锻造视觉盾或缝视觉护腕的材料",
    "Eye Of The Watcher": "观察者之眼",
    "Material used in crafting Eye Watch or Watchful Relic": "用于制作掌上监工或警戒遗物的材料",
    "Icy Cloth": "冰霜碎布",
    "Material used in tailoring Icy Robe Top or Bottoms": "用于缝纫冰霜长袍或衬裙的材料",
    "Flaming Cloth": "烈焰碎布",
    "Material used in tailoring Flaming Robe Top or Bottoms": "用于缝纫烈焰长袍或衬裙的材料",
    "Sorcerer's Sole": "魔法师的鞋底",
    "Material used in tailoring Sorcerer Boots": "用于缝纫魔法师靴的材料",
    "Chrono Sphere": "时空球",
    "Material used in tailoring Enchanted Gloves or Chrono Gloves": "用于缝纫附魔手套或时空手套的材料",
    "Frost Sphere": "冰霜球",
    "Material used in crafting Frost Staff": "用于制作冰霜法杖的材料",
    "Panda Fluff": "熊猫绒",
    "Material used in smithing Panda Gloves": "用于锻造熊猫手套的材料",
    "Black Bear Fluff": "黑熊绒",
    "Material used in smithing Black Bear Shoes": "用于锻造黑熊鞋的材料",
    "Grizzly Bear Fluff": "灰熊绒",
    "Material used in smithing Grizzly Bear Shoes": "用于锻造灰熊鞋的材料",
    "Polar Bear Fluff": "北极熊绒",
    "Material used in smithing Polar Bear Shoes": "用于锻造北极熊鞋的材料",
    "Red Panda Fluff": "小熊猫绒",
    "Material used in tailoring Red Culinary Hat or Fluffy Red Hat": "用于缝纫红色厨师帽或蓬松红帽的材料",
    Magnet: "磁铁",
    "Material used in smithing Magnetic Gloves": "用于锻造磁力手套的材料",
    "Stalactite Shard": "钟乳石碎片",
    "Material used in smithing Stalactite Spear or Spiked Bulwark": "用于锻造石钟长枪或尖刺盾的材料",
    "Living Granite": "花岗岩",
    "Material used in smithing Granite Bludgeon or Spiked Bulwark": "用于锻造花岗岩大棒或尖刺盾的材料",
    "Colossus Core": "巨像核心",
    "Material used in smithing Colossus Plate Body or Legs": "用于锻造巨像板甲胸甲或护腿的材料",
    "Vampire Fang": "吸血鬼之牙",
    "Material used in smithing Vampire Fang Dirk or crafting Vampiric Bow": "用于锻造吸血鬼短剑或制作吸血弓的材料",
    "Werewolf Claw": "狼人之爪",
    "Material used in smithing Werewolf Slasher or crafting Vampiric Bow": "用于锻造狼人关刀或制作吸血弓的材料",
    "Revenant Anima": "亡者之魂",
    "Material used in tailoring Revenant Tunic or Chaps": "用于缝纫亡灵束腰外套或裤子的材料",
    "Soul Fragment": "灵魂碎片",
    "Material used in crafting Soul Hunter Crossbow": "用于制作灵魂猎手弩的材料",
    "Infernal Ember": "地狱余烬",
    "Material used in crafting Infernal Battlestaff": "用于制作炼狱法杖的材料",
    "Demonic Core": "恶魔核心",
    "Material used in smithing Demonic Plate Body or Legs": "用于锻造恶魔板甲胸甲或护腿的材料",
    "Dodocamel Plume": "渡驼之羽",
    "Material used in smithing Dodocamel Gauntlets": "用于锻造渡驼护手的材料",
    "Manticore Sting": "蝎狮之刺",
    "Material used in crafting Manticore Shield": "用于制作蝎狮盾的材料",
    "Griffin Leather": "狮鹫之皮",
    "Material used in cheesesmithing Griffin Bulwark and tailoring Griffin Tunic or Chaps": "用于锻造狮鹫盾跟缝纫狮鹫紧身衣或护腿的材料",
    "Jackalope Antler": "鹿角兔之角",
    "Material used in crafting Jackalope Staff": "用于制作鹿角兔之杖的材料",
    "Acrobat's Ribbon": "杂技师之带",
    "Material used in tailoring Acrobatic Hood": "用于制作杂技师兜帽的材料",
    "Griffin Talon": "狮鹫之爪",
    "Material used in smithing Griffin Bulwark": "用于锻造狮鹫盾的材料",
    "Magician's Cloth": "魔术师碎布",
    "Material used in tailoring Magician's Hat": "用于制作魔术师之帽的材料",
    "Chaotic Chain": "混沌锁链",
    "Material used in smithing Chaotic Flail": "用于锻造混沌连枷的材料",
    "Cursed Ball": "诅咒之球",
    "Material used in crafting Cursed Bow": "用于制作咒怨之弓的材料",
    "Knight's Ingot": "骑士之锭",
    "Material used in smithing Knight's Aegis": "用于锻造骑士之盾的材料",
    "Bishop's Scroll": "主教卷轴",
    "Material used in crafting Bishop's Codex": "用于制作主教之书的材料",
    "Royal Cloth": "皇家碎布",
    "Material used in tailoring Royal Robe Top or Bottoms": "用于缝纫皇家长袍和皇家衬裙的材料",
    "Regal Jewel": "君王宝石",
    "Material used in smithing Regal Sword": "用于锻造君王之剑的材料",
    "Sundering Jewel": "裂空宝石",
    "Material used in crafting Sundering Crossbow": "用于制作裂空之弩的材料",
    
    "Butter of Proficiency":"精通之油",
    "Material used in producing special skilling tools and outfits": "用于生产特殊专业工具和装备的材料",
    "Thread Of Expertise":"专精之线",
    "Material used in producing special skilling outfits": "用于生产特殊专业服装的材料",
    "Branch of Insight":"明悟之枝",
    "Material used in producing special skilling tools and outfits": "用于生产特殊专业工具和服装的材料",
    "Chimerical Essence": "奇幻精华",
    "Used for enhancing special equipment from the Chimerical Den": "用于强化奇幻洞穴特殊装备的材料",
    "Sinister Essence": "邪恶精华",
    "Used for enhancing special equipment from the Sinister Circus": "用于强化邪恶马戏团特殊装备的材料",
    "Enchanted Essence": "秘法精华",
    "Used for enhancing special equipment from the Enchanted Fortress": "用于强化秘法要塞特殊装备的材料",
    "Milking Essence": "挤奶精华",
    "Used for brewing milking tea and crafting alchemy catalyst": "用于冲泡奶茶和制作炼金催化剂",
    "Foraging Essence": "采摘精华",
    "Used for brewing foraging tea and crafting alchemy catalyst": "用于冲泡采摘茶和制作炼金催化剂",
    "Woodcutting Essence": "伐木精华",
    "Used for brewing woodcutting tea and crafting alchemy catalyst": "用于冲泡伐木茶和制作炼金催化剂",
    "Cheesesmithing Essence": "奶酪锻造精华",
    "Used for brewing cheesesmithing tea and crafting alchemy catalyst": "用于冲泡奶酪锻造茶和制作炼金催化剂",
    "Crafting Essence": "制作精华",
    "Used for brewing crafting tea and crafting alchemy catalyst": "用于冲泡制作茶和制作炼金催化剂",
    "Tailoring Essence": "裁缝精华",
    "Used for brewing tailoring tea and crafting alchemy catalyst": "用于冲泡裁缝茶和制作炼金催化剂",
    "Cooking Essence": "烹饪精华",
    "Used for brewing cooking tea and crafting alchemy catalyst": "用于冲泡烹饪茶和制作炼金催化剂",
    "Brewing Essence": "冲泡精华",
    "Used for brewing brewing tea and crafting alchemy catalyst": "用于冲泡冲泡茶和制作炼金催化剂",
    "Alchemy Essence": "炼金精华",
    "Used for brewing alchemy tea and crafting alchemy catalyst": "用于冲泡炼金茶和制作炼金催化剂",
    "Enhancing Essence": "强化精华",
    "Used for brewing enhancing tea and crafting alchemy catalyst": "用于冲泡强化茶和制作炼金催化剂",
    "Swamp Essence": "沼泽精华",
    "Used for enhancing special equipment from Swamp Planet": "用于强化沼泽星球特殊装备的材料",
    "Aqua Essence": "海洋精华",
    "Used for enhancing special equipment from Aqua Planet": "用于强化海洋星球特殊装备的材料",
    "Jungle Essence": "丛林精华",
    "Used for enhancing special equipment from Jungle Planet": "用于强化丛林星球特殊装备的材料",
    "Gobo Essence": "哥布林精华",
    "Used for enhancing special equipment from Gobo Planet": "用于强化哥布林星球特殊装备的材料",
    Eyessence: "眼球精华",
    "Used for enhancing special equipment from Planet Of The Eyes": "用于强化眼球星球特殊装备的材料",
    "Sorcerer Essence": "法师精华",
    "Used for enhancing special equipment from Sorcerer's Tower": "用于强化巫师之塔特殊装备的材料",
    "Bear Essence": "熊熊精华",
    "Used for enhancing special equipment from Bear With It": "用于强化熊熊星球特殊装备的材料",
    "Golem Essence": "魔像精华",
    "Used for enhancing special equipment from Golem Cave": "用于强化魔像洞穴特殊装备的材料",
    "Twilight Essence": "暮光精华",
    "Used for enhancing special equipment from Twilight Zone": "用于强化暮光之城特殊装备的材料",
    "Abyssal Essence": "地狱精华",
    "Used for enhancing special equipment from Infernal Abyss": "用于强化地狱深渊特殊装备的材料",
    "Task Crystal": "任务水晶",
    "Crystals obtained from Purple. They can be used to craft special trinkets": "从紫色中获得的晶体。可以用来制作特殊的饰品",
    "Star Fragment": "星光碎片",
    "Fragments with a celestial origin found in Meteorite Caches. They can be used to craft jewelry": "在陨石中发现的天体起源的碎片。可用于制作珠宝",
//石头
    Pearl: "珍珠",
    "A shiny gem often found from Treasure Chests": "经常在宝箱中找到的闪亮物品",
    Amber: "琥珀",
    Garnet: "石榴石",
    Jade: "翡翠",
    Amethyst: "紫水晶",
    Moonstone: "月亮石",
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
  "Sunstone": "太阳石",
    "A shiny gem in the shape of the sun": "一颗太阳形状的闪亮宝石",
    "Crushed Sunstone": "太阳石碎片",
    "Used to be a piece of sunstone": "曾经是一块太阳石",
 "Philosopher's Stone": "贤者之石",
    "A legendary stone of immense power": "传说中的石头，拥有巨大的力量",
    "Crushed Philosopher's Stone": "贤者之石碎片",
    "Used to be a piece of a philosopher's stone": "曾经是一块贤者之石",
    "Shard Of Protection": "保护碎片",
    "Found from Artisan's Crates. They are used for crafting Mirror of Protection": "从工匠的箱子中获得。它们用于合成保护之镜",
    "Mirror Of Protection": "保护之镜",
    "A rare artifact that functions as a copy of any equipment for enhancing protection": "一种罕见的文物，可以作为任何装备的副本，用于强化保护",
};


// 2.4.3消耗品
let tranItemConsumable = {
    Donut: "甜甜圈",
    "Blueberry Donut": "蓝莓甜甜圈",
    "Blackberry Donut": "黑莓甜甜圈",
    "Strawberry Donut": "草莓甜甜圈",
    "Mooberry Donut": "月莓甜甜圈",
    "Marsberry Donut": "火星莓甜甜圈",
    "Spaceberry Donut": "太空莓甜甜圈",

    Cupcake: "纸杯蛋糕",
    "Blueberry Cake": "蓝莓蛋糕",
    "Blackberry Cake": "黑莓蛋糕",
    "Strawberry Cake": "草莓蛋糕",
    "Mooberry Cake": "月莓蛋糕",
    "Marsberry Cake": "火星莓蛋糕",
    "Spaceberry Cake": "太空莓蛋糕",

    Gummy: "软糖",
    "Apple Gummy": "苹果软糖",
    "Orange Gummy": "橙子软糖",
    "Plum Gummy": "李子软糖",
    "Peach Gummy": "桃子软糖",
    "Dragon Fruit Gummy": "火龙果软糖",
    "Star Fruit Gummy": "杨桃软糖",

    Yogurt: "酸奶",
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
    "Tailoring Tea": "裁缝茶",

    "Super Milking Tea": "超级挤奶茶",
    "Super Foraging Tea": "超级采摘茶",
    "Super Woodcutting Tea": "超级伐木茶",
    "Super Cooking Tea": "超级烹饪茶",
    "Super Brewing Tea": "超级冲泡茶",
    "Super Alchemy Tea": "超级炼金茶",
    "Super Enhancing Tea": "超级强化茶",
    "Super Cheesesmithing Tea": "超级奶酪锻造茶",
    "Super Crafting Tea": "超级制作茶",
    "Super Tailoring Tea": "超级裁缝茶",

    "Ultra Milking Tea": "究极挤奶茶",
    "Ultra Foraging Tea": "究极采摘茶",
    "Ultra Woodcutting Tea": "究极伐木茶",
    "Ultra Cooking Tea": "究极烹饪茶",
    "Ultra Brewing Tea": "究极冲泡茶",
    "Ultra Alchemy Tea": "究极炼金茶",
    "Ultra Enhancing Tea": "究极强化茶",
    "Ultra Cheesesmithing Tea": "究极奶酪锻造茶",
    "Ultra Crafting Tea": "究极制作茶",
    "Ultra Tailoring Tea": "究极裁缝茶",

    "Gathering Tea": "采集茶",
    "Gourmet Tea": "双倍茶",
    "Wisdom Tea": "经验茶",
    "Processing Tea": "加工茶",
    "Efficiency Tea": "效率茶",
    "Artisan Tea": "工匠茶",
    "Blessed Tea": "祝福茶",
    "Catalytic Tea": "催化茶",

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
};
// 2.4.4技能书
let tranItemBook = {
    Poke: "破胆之刺",
    "Pokes the targeted enemy": "猛猛地戳向目标敌人",
    Impale: "透骨之刺",
    "Impales the targeted enemy": "猛猛地刺击目标敌人",
    Puncture: "破甲之刺",
    "Punctures the targeted enemy's armor, dealing damage and temporarily reducing its armor": "击破目标敌人的护甲，造成伤害并临时降低其护甲",
    "Penetrating Strike": "贯心之刺(贯穿)",
    "Strikes the targeted enemy. on each successful hit, will pierce and hit the next enemy": "刺击目标敌人。如果成功命中敌人，则贯穿并命中下一个敌人",

    Scratch: "爪影斩",
    "Scratches the targeted enemy": "抓伤目标敌人",
    Cleave: "分裂斩(群体)",
    "Cleaves all enemies": "劈砍所有敌人",
    Maim: "血刃斩",
    "Maims the targeted enemy and causes bleeding": "划伤目标敌人使之流血",
   "Crippling Slash": "致残斩",
    "Slashes the targeted enemy and reduce their damage": "斩击目标敌人并减少它的伤害",

    Smack: "重碾",
    "Smacks the targeted enemy": "猛击目标敌人",
    Sweep: "重扫(群体)",
    "Performs a sweeping attack on all enemies": "对所有敌人进行横扫攻击",
    "Stunning Blow": "重锤",
    "Smashes the targeted enemy and has a chance to stun": "重锤目标敌人并有几率眩晕",


    "Quick Shot": "快速射击",
    "Takes a quick shot at the targeted enemy": "对目标敌人进行快速射击",
    "Aqua Arrow": "流水箭",
    "Shoots an arrow made of water at the targeted enemy": "向目标敌人射出水箭",
    "Flame Arrow": "烈焰箭",
    "Shoots a flaming arrow at the targeted enemy": "向目标敌人射出火焰箭",
    "Rain Of Arrows": "箭雨（群体）",
    "Shoots a rain of arrows on all enemies": "向所有敌人射出箭雨",
    "Silencing Shot": "沉默之箭",
    "Takes a shot at the targeted enemy, temporarily silencing them": "对目标敌人射击并沉默目标",
    "Steady Shot": "稳定射击",
    "Takes a shot at the targeted enemy with greatly enhanced accuracy": "以极高的精准对目标敌人进行射击",
    "Pestilent Shot": "疫病射击",
    "Shoots the targeted enemy, dealing damage and decreasing regeneration": "对目标敌人射击并减少生命/法力回复",
    "Penetrating Shot": "贯穿射击(贯穿)",
    "Shoots the targeted enemy. on each successful hit, will pierce and hit the next enemy": "射击目标敌人。如果成功命中敌人，则贯穿并命中到下一个敌人",
    "Water Strike": "流水冲击",
    "Casts a water strike at the targeted enemy": "对目标敌人发射流水冲击",
    "Ice Spear": "冰枪术",
    "Casts an ice spear at the targeted enemy, dealing damage and reducing attack speed": "对目标敌人投掷冰矛，造成伤害并降低攻击速度",
    "Frost Surge": "冰霜爆裂(群体)",
    "Casts frost surge at all enemies, dealing damage and reducing evasion": "对所有敌人施放冰霜爆裂,造成伤害并减少闪避",
    "Mana Spring": "法力喷泉(群体)",
    "Casts mana spring at all enemies, dealing damage and increasing ally MP regeneration": "对所有敌人释放法力喷泉，造成伤害并增加友方法力恢复值",
    Entangle: "缠绕",
    "Entangles the targeted enemy, dealing damage with chance to stun": "缠绕目标敌人，造成伤害并有几率眩晕敌人",
    "Toxic Pollen": "剧毒粉尘(群体)",
    "Casts toxic pollen at all enemies, dealing damage and decreasing armor and resistances": "对所有敌人施放剧毒粉尘，造成伤害并减少护甲和魔抗",
    "Nature's Veil": "自然菌幕(群体)",
    "Cast's a veil over all enemies, dealing damage with a chance to blind": "给所有敌人蒙上一层菌幕，造成伤害并有几率致盲",

    Fireball: "火球",
    "Casts a fireball at the targeted enemy": "对目标敌人施放火球",
    "Flame Blast": "熔岩爆裂(群体)",
    "Casts a flame blast at all enemies": "对所有敌人施放熔岩爆裂",
    Firestorm: "火焰风暴(群体)",
    "Casts a firestorm at all enemies": "对所有敌人施放火焰风暴",
    "Smoke Burst": "爆尘灭影",
    "Casts a smoke burst at the targeted enemy, dealing damage and decreasing their accuracy": "对目标敌人释放爆尘灭影，造成伤害并减少精准",

    "Minor Heal": "次级自愈术",
    "Casts minor heal on yourself": "对【自己】施放次级治疗术",
    Heal: "自愈术",
    "Casts heal on yourself": "对【自己】施放治疗术",
    "Quick Aid": "快速治疗术",
    "Casts heal on the ally with the lowest HP percentage": "对生命值百分比最低的队友施放治疗术",
    Rejuvenate: "群体治疗术",
    "Heals all allies": "治疗所有队友",

    "all allies": "所有队友",
    "lowest HP ally": "生命值最少的队友",

    Taunt: "嘲讽",
    "Greatly increases threat rating": "大幅增加威胁等级",
    Provoke: "挑衅",
    "Tremendously increases threat rating": "极大地增加威胁等级",
    Toughness: "坚韧",
    "Greatly increases armor and resistances temporarily": "临时大幅增加护甲和抗性",
    Elusiveness: "闪避",
    "Greatly increases evasion temporarily": "临时大幅增加闪避",
    Precision: "精确",
    "Greatly increases accuracy temporarily": "临时大幅增加精准",
    Berserk: "狂暴",
    "Greatly increases physical damage temporarily": "临时大幅增加物理伤害",
    Frenzy: "狂热",
    "Greatly increases attack speed temporarily": "临时大幅增加攻击速度",
    "Elemental Affinity": "元素亲和",
    "Greatly increases elemental damage temporarily": "临时大幅增加元素伤害",
    "Spike Shell": "尖刺防护",
    "Gains physical thorns temporarily": "临时获得护盾荆棘（物理）",
    "Arcane Reflection": "奥术反射",
    "Gains elemental thorns temporarily": "临时获得元素荆棘（魔法）",
    Vampirism: "吸血",
    "Gains lifesteal temporarily": "临时获得生命偷取",

    Revive: "复活",
    "Revives a dead ally": "复活一个死亡的队友",
    Insanity: "疯狂",
    "Increases damage, attack speed, and cast speed temporarily at the cost of HP": "以生命值为代价，临时增加伤害、攻击速度和施法速度",
    Invincible: "无敌",
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
};

//2.4.5钥匙
let tranItemKey = {
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
"Sinister Entry Key": "邪恶钥匙",
"Sinister Chest Key": "邪恶宝箱钥匙",
"Enchanted Entry Key": "秘法钥匙",
"Enchanted Chest Key": "秘法宝箱钥匙",
"Allows 1 entry into the Chimerical Den dungeon": "允许进入1次：地下城【奇幻洞穴】",
"Allows 1 entry into the Sinister Circus dungeon": "允许进入1次：地下城【邪恶马戏团】",
"Allows 1 entry into the Enchanted Fortress dungeon": "允许进入1次：地下城【秘法要塞】",
"Can be used to craft dungeon keys": "看起来是某种钥匙的碎片，可以制作地下城钥匙",
"Opens 1 Chimerical Chest": "开启一个奇幻宝箱",
"Opens 1 Sinister Chest": "开启一个邪恶宝箱",
"Opens 1 Enchanted Chest": "开启一个秘法宝箱",

};

//2.4.6装备(商店顺序)
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
    "Redwood Bow": "红杉弓",
    "Arcane Bow": "神秘弓",

     "Regal Sword": "君王之剑",
     "Chaotic Flail": "混沌连枷",
     "Sundering Crossbow": "裂空之弩",
     "Cursed Bow": "咒怨之弓",

    "Stalactite Spear": "石钟长枪",
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

    "Cheese Spear": "奶酪长枪",
    "Verdant Spear": "翠绿长枪",
    "Azure Spear": "蔚蓝长枪",
    "Burble Spear": "深紫长枪",
    "Crimson Spear": "深红长枪",
    "Rainbow Spear": "彩虹长枪",
    "Holy Spear": "神圣长枪",

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

    "Wooden Fire Staff": "木火法杖",
    "Birch Fire Staff": "桦木火法杖",
    "Cedar Fire Staff": "雪松火法杖",
    "Purpleheart Fire Staff": "紫心火法杖",
    "Ginkgo Fire Staff": "银杏火法杖",
    "Redwood Fire Staff": "红杉火法杖",
    "Arcane Fire Staff": "神秘火法杖",
    "Jackalope Staff": "鹿角兔之杖",

    "Eye Watch": "掌上监工",
    "Snake Fang Dirk": "蛇牙短剑",
    "Vision Shield": "视觉盾",
    "Gobo Defender": "哥布林防御者",
    "Vampire Fang Dirk": "吸血鬼短剑",
    "Knights Aegis": "骑士盾",
    "Knight's Aegis": "骑士盾",
    "Manticore Shield": "蝎狮盾",
    "Treant Shield": "树人盾",
    "Tome Of Healing": "治疗之书",
    "Tome Of The Elements": "元素之书",
    "Bishops Codex": "主教之书",
    "Bishop's Codex": "主教之书",
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
    "Redwood Shield": "红杉盾",
    "Arcane Shield": "神秘盾",

    "Red Chef's Hat": "红色厨师帽",
    "Red Culinary Hat":"红色厨师帽",
    "Snail Shell Helmet": "蜗牛壳头盔",
    "Vision Helmet": "视觉头盔",
    "Fluffy Red Hat": "蓬松红帽子",
    "Acrobatic Hood": "杂技师兜帽",
    "Magician's Hat": "魔术师之帽",

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
    "Griffin Tunic": "狮鹫紧身衣",
    "Icy Robe Top": "冰霜长袍",
    "Flaming Robe Top": "烈焰长袍",
    "Luna Robe Top": "月神长袍",
    "Royal Water Robe Top": "皇家流水长袍",
    "Royal Fire Robe Top": "皇家火焰长袍",
    "Royal Nature Robe Top": "皇家自然长袍",
    "From Fire":"从【火焰】款裁改",
    "From Water":"从【流水】款裁改",
    "From Nature":"从【自然】款裁改",

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
    "Griffin Chaps": "狮鹫护腿",
    "Icy Robe Bottoms": "冰霜衬裙",
    "Flaming Robe Bottoms": "烈焰衬裙",
    "Luna Robe Bottoms": "月神衬裙",
    "Royal Water Robe Bottoms": "皇家流水衬裙",
    "Royal Fire Robe Bottoms": "皇家火焰衬裙",
    "Royal Nature Robe Bottoms": "皇家自然衬裙",

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

    "Cotton Robe Bottoms": "棉衬裙",
    "Linen Robe Bottoms": "亚麻衬裙",
    "Bamboo Robe Bottoms": "竹布衬裙",
    "Silk Robe Bottoms": "丝绸衬裙",
    "Radiant Robe Bottoms": "光辉衬裙",

    "Enchanted Gloves": "附魔手套",
    "Pincer Gloves": "螯钳手套",
    "Panda Gloves": "熊猫手套",
    "Magnetic Gloves": "磁力手套",
    "Sighted Bracers": "瞄准护腕",
    "Chrono Gloves": "时空手套",
    "Dodocamel Gauntlets": "渡驼护手",

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
    "Shoebill Shoes": "靴嘴鹳鞋",
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
    "Necklace Of Wisdom": "经验项链",
    "Necklace Of Speed": "速度项链",
    "Philosopher's Necklace": "贤者项链",

    "Earrings Of Gathering": "采集耳环",
    "Earrings Of Essence Find": "精华发现耳环",
    "Earrings Of Armor": "护甲耳环",
    "Earrings Of Regeneration": "回复耳环",
    "Earrings Of Resistance": "抗性耳环",
    "Earrings Of Rare Find": "稀有发现耳环",
    "Earrings Of Threat": "威胁耳环",
    "Earrings Of Critical Strike": "暴击耳环",
    "Philosopher's Earrings": "贤者耳环",

    "Ring Of Gathering": "采集戒指",
    "Ring Of Essence Find":"精华发现戒指",
    "Ring Of Regeneration": "回复戒指",
    "Ring Of Armor": "护甲戒指",
    "Ring Of Resistance": "抗性戒指",
    "Ring Of Rare Find": "稀有发现戒指",
    "Ring Of Threat": "威胁戒指",
    "Ring Of Critical Strike": "暴击戒指",
    "Philosopher's Ring": "贤者戒指",

    "Small Pouch": "小袋子",
    "Medium Pouch": "中袋子",
    "Large Pouch": "大袋子",
    "Giant Pouch": "巨大袋子",
    "Gluttonous Pouch": "贪食之袋",
    "Guzzling Pouch": "暴饮之囊",

    "Chimerical Quiver": "奇幻箭袋",
    "Enchanted Cloak": "秘法披风",
    "Sinister Cape": "邪恶斗篷",

    "Dairyhand's Top": "挤奶工的上衣",
    "Forager's Top": "采摘者的上衣",
    "Lumberjack's Top": "伐木工的上衣",
    "Cheesemaker's Top": "奶酪师的上衣",
    "Crafter's Top": "工匠的上衣",
    "Tailor's Top": "裁缝的上衣",
    "Chef's Top": "厨师的上衣",
    "Brewer's Top": "饮品师的上衣",
    "Alchemist's Top": "炼金师的上衣",
    "Enhancer's Top": "强化师的上衣",

    "Dairyhand's Bottom": "挤奶工的下装",
    "Forager's Bottom": "采摘者的下装",
    "Lumberjack's Bottom": "伐木工的下装",
    "Cheesemaker's Bottom": "奶酪师的下装",
    "Crafter's Bottom": "工匠的下装",
    "Tailor's Bottom": "裁缝的下装",
    "Chef's Bottom": "厨师的下装",
    "Brewer's Bottom": "饮品师的下装",
    "Alchemist's Bottom": "炼金师的下装",
    "Enhancer's Bottom": "强化师的下装",



};
//2.4.7工具
const tranItemTool = {
    "Cheese Brush": "奶酪刷子",
    "Verdant Brush": "翠绿刷子",
    "Azure Brush": "蔚蓝刷子",
    "Burble Brush": "深紫刷子",
    "Crimson Brush": "深红刷子",
    "Rainbow Brush": "彩虹刷子",
    "Holy Brush": "神圣刷子",
    "Celestial Brush": "星空刷子",

    "Cheese Shears": "奶酪剪刀",
    "Verdant Shears": "翠绿剪刀",
    "Azure Shears": "蔚蓝剪刀",
    "Burble Shears": "深紫剪刀",
    "Crimson Shears": "深红剪刀",
    "Rainbow Shears": "彩虹剪刀",
    "Holy Shears": "神圣剪刀",
    "Celestial Shears": "星空剪刀",

    "Cheese Hatchet": "奶酪斧头",
    "Verdant Hatchet": "翠绿斧头",
    "Azure Hatchet": "蔚蓝斧头",
    "Burble Hatchet": "深紫斧头",
    "Crimson Hatchet": "深红斧头",
    "Rainbow Hatchet": "彩虹斧头",
    "Holy Hatchet": "神圣斧头",
    "Celestial Hatchet": "星空斧头",

    "Cheese Hammer": "奶酪锤",
    "Verdant Hammer": "翠绿锤",
    "Azure Hammer": "蔚蓝锤",
    "Burble Hammer": "深紫锤",
    "Crimson Hammer": "深红锤",
    "Rainbow Hammer": "彩虹锤",
    "Holy Hammer": "神圣锤",
    "Celestial Hammer": "星空锤",

    "Cheese Chisel": "奶酪凿子",
    "Verdant Chisel": "翠绿凿子",
    "Azure Chisel": "蔚蓝凿子",
    "Burble Chisel": "深紫凿子",
    "Crimson Chisel": "深红凿子",
    "Rainbow Chisel": "彩虹凿子",
    "Holy Chisel": "神圣凿子",
    "Celestial Chisel": "星空凿子",

    "Cheese Spatula": "奶酪铲子",
    "Verdant Spatula": "翠绿铲子",
    "Azure Spatula": "蔚蓝铲子",
    "Burble Spatula": "深紫铲子",
    "Crimson Spatula": "深红铲子",
    "Rainbow Spatula": "彩虹铲子",
    "Holy Spatula": "神圣铲子",
    "Celestial Spatula": "星空铲子",

    "Cheese Needle": "奶酪针",
    "Verdant Needle": "翠绿针",
    "Azure Needle": "蔚蓝针",
    "Burble Needle": "深紫针",
    "Crimson Needle": "深红针",
    "Rainbow Needle": "彩虹针",
    "Holy Needle": "神圣针",
    "Celestial Needle": "星空针",

    "Cheese Pot": "奶酪锅",
    "Verdant Pot": "翠绿锅",
    "Azure Pot": "蔚蓝锅",
    "Burble Pot": "深紫锅",
    "Crimson Pot": "深红锅",
    "Rainbow Pot": "彩虹锅",
    "Holy Pot": "神圣锅",
    "Celestial Pot": "星空锅",

    "Cheese Alembic": "奶酪蒸馏器",
    "Verdant Alembic": "翠绿蒸馏器",
    "Azure Alembic": "蔚蓝蒸馏器",
    "Burble Alembic": "深紫蒸馏器",
    "Crimson Alembic": "深红蒸馏器",
    "Rainbow Alembic": "彩虹蒸馏器",
    "Holy Alembic": "神圣蒸馏器",
    "Celestial Alembic": "星空蒸馏器",

    "Cheese Enhancer": "奶酪强化器",
    "Verdant Enhancer": "翠绿强化器",
    "Azure Enhancer": "蔚蓝强化器",
    "Burble Enhancer": "深紫强化器",
    "Crimson Enhancer": "赤红强化器",
    "Rainbow Enhancer": "彩虹强化器",
    "Holy Enhancer": "神圣强化器",
    "Celestial Enhancer": "星空强化器",

};

   // 2.5宝箱
let tranItemBox = {
    "Small Meteorite Cache": "小型陨石",
    "Can be found while gathering. Looks like it contains items inside": "在采集时可以找到，看起来里面装着物品",
    "Medium Meteorite Cache": "中型陨石",
    "Large Meteorite Cache": "大型陨石",

    "Small Artisan's Crate": "工匠的小型箱子",
    "Can be found during production skills. Looks like it contains items inside": "在生产时可以找到，看起来里面装着物品",
    "Medium Artisan's Crate": "工匠的中型箱子",
    "Large Artisan's Crate": "工匠的大型箱子",

    "Small Treasure Chest": "小型宝箱",
    "Can be found from monsters. Looks like it contains items inside": "可以从怪物身上找到，看起来里面装着物品",
    "Medium Treasure Chest": "中型宝箱",
    "Large Treasure Chest": "大型宝箱",

    "Purple's Gift": "紫色的礼物",
    "Gifted by Purple after earning task points. Looks like it contains items inside": "获得任务点后新手引导员紫色赠送的礼物，看起来里面装着物品",

    "Chimerical Chest": "奇幻宝箱",
    "Received from completion of the Chimerical Den dungeon. Can be opened with Chimerical Chest Key": "攻克地牢★【奇幻洞穴】后的奖励，可以用【奇幻宝箱钥匙】打开",

    "Sinister Chest": "邪恶宝箱",
    "Received from completion of the Sinister Circus dungeon. Can be opened with Sinister Chest Key": "攻克地牢★【邪恶马戏团】后的奖励，可以用【邪恶宝箱钥匙】打开",

    "Enchanted Chest": "秘法宝箱",
    "Received from completion of the Enchanted Fortress dungeon. Can be opened with Enchanted Chest Key": "攻克地牢★【秘法要塞】后的奖励，可以用【秘法宝箱钥匙】打开",

};


  // 2.6奶牛
let tranCow = {
    Cow: "奶牛",
    "Verdant Cow": "翠绿奶牛",
    "Azure Cow": "蔚蓝奶牛",
    "Burble Cow": "深紫奶牛",
    "Crimson Cow": "深红奶牛",
    Unicow: "彩虹奶牛",
    "Holy Cow": "圣牛",
};

// 2.7采摘地点
let tranForagPlace = {
    farmland: "农场",
    "shimmering lake": "波光湖",
    "misty forest": "迷失森林",
    "burble beach": "深紫沙滩",
    "silly cow valley": "傻牛谷",
    "olympus mons": "奥林匹斯山",
    "asteroid belt": "小行星带",
};

// 2.8怪物
let tranMonster = {
//批量模拟
Rat:"杰瑞",
Frog: "青蛙",
Snake: "蛇",
Alligator: "鳄鱼",
"Sea Snail": "蜗牛",
Crab: "螃蟹",
Turtle: "乌龟",
"Gobo Stabby": "哥布林斥候",
"Gobo Slashy": "哥布林战士",
"Gobo Smashy": "哥布林斗士",
"Gobo Shooty": "哥布林射手",
"Gobo Boomy": "哥布林法师",

    "Smelly Planet": "臭臭星球",
    "Smelly Planet Elite": "臭臭星球(精英)",
    Fly: "苍蝇",
    Jerry: "杰瑞",
    Skunk: "臭鼬",
    Porcupine: "豪猪",
    Slimy: "史莱姆",

    "Swamp Planet": "沼泽星球",
    "Swamp Planet Elite": "沼泽星球(精英)",
    Frogger: "青蛙",
    Thnake: "蛇",
    Swampy: "蜘蛛",
    Sherlock: "鳄鱼",
    "Giant Shoebill": "大靴嘴鹳",

    "Aqua Planet": "海洋星球",
    "Aqua Planet Elite": "海洋星球(精英)",
    Gary: "蜗牛",
    "I Pinch": "螃蟹",
    Aquahorse: "海马",
    "Nom Nom": "鲫鱼",
    Turuto: "乌龟",
    "Marine Huntress": "海洋猎手",

    "Jungle Planet": "丛林星球",
    "Jungle Planet Elite": "丛林星球(精英)",
    "Jungle Sprite": "丛林精灵",
    Myconid: "蘑菇人",
    Treant: "树人",
    "Centaur Archer": "半人马弓箭手",
    "Luna Empress": "月神之蝶",

    "Gobo Planet": "哥布林星球",
    "Gobo Planet Elite": "哥布林星球(精英)",
    Stabby: "哥布林穿刺手",
    Slashy: "哥布林战士",
    Smashy: "哥布林大锤手",
    Shooty: "哥布林弓箭手",
    Boomy: "哥布林法师",
    "Gobo Chieftain": "哥布林酋长",

    "Planet Of The Eyes": "眼球星球",
    "Planet Of The Eyes Elite": "眼球星球(精英)",
    Eye: "独眼",
    Eyes: "竖眼",
    Veyes: "复眼",
    "The Watcher": "观察者",

    "Sorcerer's Tower": "巫师之塔",
    "Sorcerer's Tower Elite": "巫师之塔(精英)",
    "Sorcerers Tower": "巫师之塔",
    "Sorcerers Tower Elite": "巫师之塔(精英)",
    "Novice Sorcerer": "新手巫师",
    "Ice Sorcerer": "冰霜巫师",
    "Flame Sorcerer": "火焰巫师",
    Elementalist: "元素法师",
    "Chronofrost Sorcerer": "时空霜巫",

    "Bear With It": "熊熊星球",
    "Bear With It Elite": "熊熊星球(精英)",
    "Gummy Bear": "果冻熊",
    Panda: "熊猫",
    "Black Bear": "黑熊",
    "Grizzly Bear": "灰熊",
    "Polar Bear": "北极熊",
    "Red Panda": "小熊猫",

    "Golem Cave": "魔像洞穴",
    "Golem Cave Elite": "魔像洞穴(精英)",
    "Magnetic Golem": "磁力魔像",
    "Stalactite Golem": "钟乳石魔像",
    "Granite Golem": "花岗岩魔像",
    "Crystal Colossus": "水晶巨像",

    "Twilight Zone": "暮光之地",
    "Twilight Zone Elite": "暮光之地(精英)",
    Zombie: "僵尸",
    Vampire: "吸血鬼",
    Werewolf: "狼人",
    "Dusk Revenant": "黄昏亡灵",

    "Infernal Abyss": "地狱深渊",
    "Infernal Abyss Elite": "地狱深渊(精英)",
    "Abyssal Imp": "深渊小鬼",
    "Soul Hunter": "灵魂猎手",
    "Infernal Warlock": "地狱术士",
    "Demonic Overlord": "恶魔霸主",

"Cannot afford": "无法购买",

    "Dungeons": "地下城",
    "Dungeon Keys": "地下城钥匙",
    "Chimerical Den": "奇幻洞穴",
    "Received from completion of the Chimerical Den dungeon": "通关奇幻洞穴的战利品",
    "Butterjerry": "蝶鼠",
    "Jackalope": "鹿角兔",
    "Dodocamel": "渡驼",
    "Manticore": "蝎狮",
    "Griffin": "狮鹫",

    "Sinister Circus": "邪恶马戏团",
    "Received from completion of the Sinister Circus dungeon": "通关邪恶马戏团的战利品",
    "Rabid Rabbit": "疯魔兔",
    "Zombie Bear": "僵尸熊",
    "Acrobat": "杂技师",
    "Juggler": "杂耍者",
    "Magician": "魔术师",
    "Deranged Jester": "小丑皇",

    "Enchanted Fortress": "秘法要塞",
    "Received from completion of the Enchanted Fortress dungeon": "通关秘法要塞的战利品",
    "Enchanted Pawn": "秘法之兵",
    "Enchanted Knight": "秘法之马",
    "Enchanted Bishop": "秘法之相",
    "Enchanted Rook": "秘法之车",
    "Enchanted Queen": "秘法之后",
    "Enchanted King": "秘法之王",

};



// 2.9其他
let tranOther = {
    // Other
    "Attempting to connect": "正在连接牛牛星球...",
    "Disconnected. The game was opened from another device or window": "与服务器断开连接，游戏已从其他设备或窗口开启",
    "Game update available. Please refresh your browser": "游戏有更新，请刷新浏览器",
    "Game server has been restarted. Please refresh the page": "游戏服务器已重启。请刷新页面",
    loading: "加载中...",
    mmmmmmmmmmlli: "mmmmmmmmmmlli",
    "Start Now": "现在开始",
    "Upgrade Queue Capacity": "升级队列容量",
    "Total Experience": "总经验值",
    "Exp to Level Up": "升级所需经验值",
    "You need to enable JavaScript to run this app": "你需要启用JavaScript才能运行此应用程序",
    "Require Bigger Pouch": "需要更大的袋子",


    // 页面

    // -状态栏
    "active players": "活跃玩家数",
    "total level": "总等级",
    "flee": "退出战斗",

    // -左侧边栏
    marketplace: "市场",
    "player-driven market where you can buy and sell items with coins": "玩家驱动的市场，你可以用金币购买和出售物品",
    tasks: "任务",
    "Randomly generated tasks that players can complete for rewards": "随机生成的任务，玩家可以完成以获得奖励",
    shop: "商店",
    "Purchase items from the vendor": "贩售各类杂物",
    "Buy Item": "购买商品",
    "cowbell store": "牛铃商店",
    "Purchase and spend cowbells": "购买和使用牛铃",
    social: "社交",
    "Friends, referrals, and block list": "好友、推荐和屏蔽列表",
    guild: "公会",
    "Join forces with a community of players": "看看是谁在idle里面idle",
    leaderboard: "排行榜",
    "Shows the top ranked players of each skill": "显示每个技能的排名前几位的玩家",
    settings: "设置",
    "Update account information and other settings": "更新账户信息和其他设置",
    news: "新闻",
    "patch notes": "补丁说明",
    "game guide": "新手指引",
    rule: "游戏守则",
    "The rules for Milky Way Idle are designed to ensure an enjoyable and fair experience for all players. Breaking the rules would result in appropriate penalties dependent on the type and severity of the offense. Penalties include verbal warning, mute, item removal, trading ban, or account ban.":
        "Milky Way Idle 的规则旨在确保所有玩家都能享受公平愉快的游戏体验。违规将根据违规类型和严重程度受到相应的惩罚。惩罚包括口头警告、禁言、移除物品、交易禁令或账号封禁。",
    "merch store": "周边商店",
    "test server": "测试服务器",
    "privacy policy": "隐私政策",
    "switch character": "选择角色",
    logout: "退出登陆",

    // -右侧边栏
    Inventory: "库存",
    Abilities: "技能",
    House: "房子",

    // -配装
    Loadout: "配装",
    "New Loadout": "新建配装",
    "All Skills": "所有专业",
    "Create Loadout": "创建配装",
    "Upgrade Capacity": "升级容量",
    "Import Current Setup": "导入当前配置",
    "Equip Loadout": "装备配装",
    "Loadout equipped": "配装已装备",
    "Loadout created": "配装已创建",
    "Loadout deleted": "配装已删除",
    "Loadout Updated": "配装已更新",
    "Do not notify when items are unavailable": "关闭【预设物品不足】的警告",
    "Imported current setup to loadout": "将当前设定导入配置",
    "Cannot equip loadout in combat": "战斗中无法装载",
    "Delete Loadout": "删除配装",
    "View All Loadouts": "查看所有配装",
    "Loadout:":"配装",
    "No Loadout":"不使用配装",

    // --库存
    "Chat Link": "聊天链接",
    "Item Dictionary": "物品字典",
    Equip: "装备",
    "Cannot During Combat": "战斗中无法使用",
    "Level Not Met": "等级未达到",

    // --装备
    "View Stats": "查看状态",
    "Auto Attack Damage": "自动攻击伤害",
    "Auto-Attack Damage": "自动攻击伤害",
    "Combat Stats": "战斗状态",
    "Non-combat Stats": "非战斗状态",
    "Attack Interval": "攻击间隔",
    "How fast you can auto-attack": "自动攻击的速度",
    "Ability Haste": "技能加速",
    "Reduces ability cooldown": "减少技能冷却时间",
    Accuracy: "精准",
    "Increases chance to successfully attack": "增加攻击成功的几率",
    Damage: "伤害",
    "Auto-attack damage is random between 1 and the maximum damage": "自动攻击的伤害在1和最大伤害之间随机",
    "Critical Hit": "暴击",
    "Always rolls maximum damage. Ranged style has passive critical chance": "总是造成最大伤害。远程攻击风格具有被动暴击几率",
    "Task Damage": "任务伤害",
    "Increases damage to monsters assigned as tasks": "增加对作为任务分配的怪物的伤害",
    Amplify: "增幅",
    "Increases damage of that type": "增加该类型的伤害",
    Evasion: "闪避",
    "Increases chance to dodge an attack": "增加闪避攻击的几率",
    Armor: "护甲",
    "Mitigates % of physical damage": "减少%的物理伤害",
    Resistance: "抗性",
    "Mitigates % of elemental damage": "减少%的元素伤害",
    Penetration: "穿透",
    "Ignores % of enemy armor/resistance": "无视%的敌方护甲/抗性",
    "Life Steal": "生命窃取",
    "Heal for % of auto-attack": "自动攻击时恢复%的生命值",
    "Mana Leech": "法力吸取",
    "Leeches for % of auto-attack": "自动攻击时吸取%的法力值",
    "elemental thorns": "元素荊棘",
    "physical thorns": "护盾荊棘",
    Thorn:"荆棘",
    "When attacked, reflects a percentage of your armor or resistance (corresponding to the attack type) as damage back to the attacker": "受到攻击时，依护甲/抗性（对应攻击类型）以一定%作为伤害反弹给攻击者",
    Tenacity: "韧性",
    "Reduces chance of being blinded, silenced, or stunned": "降低被致盲、沉默或眩晕的几率",
    Threat: "威胁",
    "Increases chance of being targeted by monsters": "增加成为怪物目标的几率",
    "HP Regen": "生命值回复",
    "Recover % of Max HP per 10s": "每10秒恢复最大生命值的%",
    "MP Regen": "法力值回复",
    "Recover % of Max MP per 10s": "每10秒恢复最大法力值的%",
    "Drop Rate": "掉落率",
    "Increase regular item drop rate": "增加普通物品的掉落率",
    "Combat Rare Find": "战斗稀有发现",
    "Increase chance of finding treasure chests": "增加发现宝箱的几率",
    "Combat Style": "战斗风格",
    "Damage Type": "伤害类型",
    "Attack Interval": "攻击间隔",
    "Smash Accuracy": "钝击精准",
    "Smash Damage": "钝击伤害",
    "Max HP": "最大生命值",
    "Max MP": "最大法力值",
    "Stab Evasion": "刺击闪避",
    "Slash Evasion": "斩击闪避",
    "Smash Evasion": "钝击闪避",
    "Ranged Evasion": "远程闪避",
    "Magic Evasion": "魔法闪避",
    Armor: "护甲",
    "Water Resistance": "水属性抗性",
    "Nature Resistance": "自然属性抗性",
    "Fire Resistance": "火属性抗性",
    Tenacity: "韧性",
    Threat: "威胁",
    "HP Regen": "生命值回复",
    "MP Regen": "法力值回复",
    Speed: "速度",
    "Increases action speed": "增加行动速度",
    "Task Speed": "任务速度",
    "Increases speed on actions assigned as tasks": "增加分配为任务的行动速度",
    "Increases gathering quantity": "增加采集数量",
    "Increases chance of finding essences": "增加精华掉落率",
    Efficiency: "效率",
    "Chance of repeating the action instantly": "立即重复行动的几率",
    "Skilling Rare Find": "技能稀有发现",
    "Skilling Essence Find": "技能精华发现",
    "Increases chance of finding meteorite caches or artisan's crates": "增加发现陨石或工匠箱子的几率",
    "Milking Speed": "挤奶速度",
    "Foraging Speed": "采摘速度",
    "Woodcutting Speed": "伐木速度",
    "Cheesesmithing Speed": "奶酪锻造速度",
    "Crafting Speed": "制作速度",
    "Tailoring Speed": "裁缝速度",
    "Cooking Speed": "烹饪速度",
    "Brewing Speed": "冲泡速度",
    "Alchemy Speed": "炼金速度",
    "Milking Experience": "挤奶经验",
    "Foraging Experience": "采摘经验",
    "Woodcutting Experience": "伐木经验",
    "Cheesesmithing Experience": "奶酪锻造经验",
    "Crafting Experience": "制作经验",
    "Tailoring Experience": "裁缝经验",
    "Cooking Experience": "烹饪经验",
    "Brewing Experience": "冲泡经验",
    "Alchemy Experience": "炼金经验",
    "Enhancing Experience": "强化经验",
    "Milking Rare Find": "挤奶稀有发现率",
    "Foraging Rare Find": "采摘稀有发现率",
    "Woodcutting Rare Find": "伐木稀有发现率",
    "Cheesesmithing Rare Find": "奶酪锻造稀有发现率",
    "Crafting Rare Find": "制作稀有发现率",
    "Tailoring Rare Find": "裁缝稀有发现率",
    "Cooking Rare Find": "烹饪稀有发现率",
    "Brewing Rare Find": "冲泡稀有发现率",
    "Alchemy Rare Find": "炼金稀有发现率",
    "Enhancing Rare Find": "强化稀有发现率",
    "Enhancing Success": "强化成功率",
    // --技能
    "Abilities can be learned from ability books. You can acquire ability books as drops from monsters or purchase them from other players in the marketplace":
        "技能可以从技能书中学习。技能书可以从怪物身上获得，或者在市场上从其他玩家那里购买",
    "Abilities can be placed into slots to be used in combat. You unlock more slots as your intelligence skill level increases":
        "技能可以放置在槽位中用于战斗。随着智力技能等级的提升，你将解锁更多的槽位",
    "Abilities can level up as you gain experience. You get 0.1 experience for every use in combat and a much larger amount from consuming duplicate ability books":
        "随着经验的获得，技能将可以升级。每次在战斗中使用技能时可以获得0.1点经验，并且从消耗重复的技能书中可以获得更多经验",
    "Ability Slots": "技能槽",
    "Learned Abilities": "已学习的技能",
    "Special Ability Slot": "特殊技能槽",
    Description: "描述",
    Cooldown: "冷却",
    "Cast Time": "施法时间",
    "MP Cost": "MP消耗",
    "Combat Triggers": "触发器",
    "Activate when": "激活在",
    "Cannot change in combat": "不能在战斗中改变",

    // --房子
    "View Buffs": "查看Buff",
    "House Buffs": "房子Buff",
    "Not built": "未建造",
    None: "无",
    Buff: "Buff",
    "Global Buffs": "全局Buff",
    "Dairy Barn": "奶牛棚",
    Garden: "花园",
    "Log Shed": "木材棚",
    Forge: "锻造台",
    Workshop: "工作间",
    "Sewing Parlor": "缝纫工作室",
    Kitchen: "厨房",
    Brewery: "酿酒厂",
    Laboratory: "实验室",
    Observatory: "天文台",
    "Dining Room": "餐厅",
    Library: "图书馆",
    Dojo: "道场",
    Gym: "健身房",
    Armory: "军械库",
    "Archery Range": "射箭场",
    "Mystical Study": "神秘研究室",
    Wisdom: "经验",
    "Rare Find": "稀有发现",
    "Construction Costs": "建造消耗",
    Build: "建造",
    "Rooms in your house can be built to give you permanent bonuses": "你的房子里的房间可以建造，以给予你永久的加成",
    "Each room can be leveled up to a maximum of level 8 with increasing costs": "每个房间可以升级到最高8级，但升级成本逐渐增加",

    // -聊天
    General: "常规",
    Trade: "交易",
    Recruit: "招募",
    Beginner: "新手",
    party: "队伍",
    Whisper: "私聊",
    Send: "发送",
    "Are you sure you want to open an external link": "您确定要开启外部链接吗",

    // -主页面
    // --市场
    "The marketplace allows players to make buy or sell listings for any tradable item. You can click on any item listed to view existing listings or to create your own":
        "市场允许玩家为任何可交易的物品创建买入或卖出列表。你可以点击任何列出的物品来查看现有的列表或创建自己的列表",
    "New listings will always be fulfilled by the best matching prices on market when possible. If no immediate fulfillment is possible, the listing will appear on the marketplace":
        "新的列表将尽可能由市场上最匹配的价格来满足。如果无法立即满足，该列表将出现在市场上",
    'When a trade is successful, a tax of 2% coins is taken and the received items can be collected from "My Listings" tab':
        "当交易成功时，会收取2%的金币作为税收，并且可以从“我的列表”选项卡中收取所获得的物品",
    Asks: "询问",
    "existing sell listings": "现有的卖出列表",
    Bids: "竞价",
    "existing buy listings": "现有的买入列表",
    "market listings": "市场列表",
    "my listings": "我的列表",
    Listings: "列表",
    "item filter": "搜索（中文）",
    "New Sell Listing": "新出售单",
    "New Buy Listing": "新收购单",
    "Listing Limit Reached": "达到上市限制",
    "view all items": "查看所有物品",
    "Collect All": "收集全部",
    Item: "项目",
    "Best Ask Price": "最佳出售价",
    "Best Bid Price": "最佳收购价",
    "View All": "查看全部",
    Quantity: "数量",
    "Ask Price": "出售价",
    "Bid Price": "收购价",
    Action: "操作",
    "View All Enhancement Levels": "查看所有强化级别",
    status: "状态",
    type: "类型",
    progress: "进度",
    "tax taken": "收税",
    collect: "收集",
    active: "有效",
    Inactive: "无效",
    sell: "出售",
    buy: "收购",
    price: "价格",
    cancel: "取消",
    Refresh: "刷新",
    "Sell Listing": "出售列表",
    "Enhancement Level": "强化等级",
    "Price (Best Sell Offer": "价格(最佳售价",
    "Quantity (You Have": "数量(你拥有",
    "You don't have enough items": "你没有足够的物品",
    "You Get": "你获得",
    Taxed: "扣税",
    "Or more if better offers exist": "或更多, 如果有更好的报价",
    "Post Sell Listing": "发布出售列表",
    "Buy Listing": "购买列表",
    "You can't afford this many": "你负担不起这么多",
    "You Pay": "你支付",
    "Or less if better offers exist": "或更少, 如果有更好的报价",
    "Post Buy Listing": "发布购买列表",
    "Sell Now": "立即出售",
    All: "全部",
    "Post Sell Order": "发布出售订单",
    "Buy Now": "立即购买",
    "Post Buy Order": "发布购买订单",
    Filled: "完成",
    "Must be at least": "必须至少",
    "You Have": "你有",
    "You Can Afford": "你能负担",
    "Price (Best Buy Offer": "价格 (最好的买价",
    // --Task
    "Task Board": "任务板",
    "Task Shop": "任务商店",
    "Next Task": "下一个任务",
    "Blocked Skills": "屏蔽技能",
    Upgrades: "升级",
    Items: "项目",
    "Lifetime Task Points": "终身任务点数",
    "Task Points": "任务点数",
    Claim: "领取",
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
    read: "阅读",
    // --挤奶
    "The milks from these magical cows have a wide variety of functions. They can be used to produce consumables or craft into special cheese to make equipment":
    "这些魔法奶牛的奶有各种功能。它们可以用来制作消耗品，或者做成特殊奶酪以制作装备",
    "Cows love to be brushed. Equipping a brush will boost your milking skill": "奶牛喜欢被刷。装备刷子会提升你的挤奶技能",
    Requires: "需求",
    "Output": "产出",
    Outputs: "产出",
    Rares: "稀有",
    Duration: "持续时间",
    Bonuses: "加成",
    "Entry Key": "门票",
    Bosses: "首领",
    Detail: "详情",
    "Action Speed": "行动速度",
    "Decreases time cost for the action": "降低行动的时间成本",
    "Milking Level": "挤奶等级",
    "Buffs milking level": "增益挤奶等级",
    "Increases experience gained": "增加获得的经验",
    "Increases drop rate of meteorite caches, artisan's crates, and treasure chests": "增加陨石储藏、艺术家的箱子和宝藏箱的掉落率",
    Upgrade: "升级",
    From: "从",
    "Basic Task Badge": "基础任务徽章",
    "Advanced Task Badge": "高级任务徽章",
    "Expert Task Badge": "专家任务徽章",
    "Collectors Boots": "收藏家之靴",
    // --采摘
    "You can find many different resources while foraging in the various areas. These resources can be used for cooking and brewing consumables":
        "在各个地区采摘时，你可以找到许多不同的资源。这些资源可以用于烹饪和冲泡消耗品",
    "Equipping shears will boost your foraging skill": "装备剪刀会提升你的采摘技能",
    // --伐木
    "You can gather logs from different types of trees. Logs are used for crafting various equipments": "你可以从不同类型的树木中获取木材。木材用于制作各种装备",
    "Equipping a hatchet will boost your woodcutting skill": "装备一把斧头会提升你的伐木技能",
    Tree: "树",
    "Birch Tree": "桦树",
    "Cedar Tree": "雪松树",
    "Purpleheart Tree": "紫心木树",
    "Ginkgo Tree": "银杏树",
    "Redwood Tree": "红杉树",
    "Arcane Tree": "奥秘树",
    // --奶酪锻造
    "The hardened cheeses made with milks from the magical cows are as tough as metal. You can smith them into equipment that gives you bonuses in combat or skilling":
    "用魔法牛的奶制作的硬质奶酪坚硬如金属。你可以将它们锻造成在战斗或技能中给你加成的装备",
    "Equipment is upgradable from one tier to the next, often requiring increasing amount of cheese. There is also special equipment that can be crafted with items found from monsters in combat":
        "装备可以从一级升级到下一级，通常需要越来越多的奶酪。还有一些特殊的装备可以用在战斗中从怪物身上获得的物品来制作",
    "Equipping a hammer will boost your cheesesmithing skill": "装备锤子会提升你的奶酪锻造技能",
    Material: "材料",
    // --制作
    "You can craft weapons, offhands, and jewelry": "你可以制作武器、副手物品和珠宝",
    "Equipping a chisel will boost your crafting skill": "装备凿子会提升你的制作技能",
    Crossbow: "弩",
    Bow: "弓",
    Staff: "法杖",
    Special: "特殊",
    // --裁缝
    "You can tailor ranged and magic clothing using raw materials gathered from combat and foraging": "你可以使用从战斗和采摘中获得的原材料来制作远程和魔法服装",
    "Equipping a needle will boost your tailoring skill": "装备针会提升你的裁缝技能",
    // --烹饪
    "Food can be used to recover your HP or MP. They can be brought with you to combat": "食物可以用来恢复你的生命值(HP)或法力值(MP)。它们可以随身携带在战斗中使用",
    "Equipping a spatula will boost your cooking skill": "装备铲子会提升你的烹饪技能",
    "Instant Heal": "即时治疗",
    "Heal Over Time": "持续治疗",
    "Instant Mana": "即时回蓝",
    "Mana Over Time": "持续回蓝",
    // --酿造
    "Drinks can provide you with temporary buffs. Coffee can be brought with you to combat and tea can be used while skilling":
        "饮品可以给你提供临时增益效果。咖啡可以在战斗中携带，茶可以在使用技能时使用",
    "Equipping a pot will boost your brewing skill": "装备一个锅可以提升你的冲泡技能",
    Tea: "茶",
    Coffee: "咖啡",
    // --炼金
    "Target": "目标",
    "Target Level": "目标等级",
    Attempt: "尝试",
    Transform: "转换",
    Catalyst: "催化剂",
    "Essence Drop": "精华掉落",
    "Coinify": "点金",
    "Decompose": "分解",
    "Transmute": "重组",
    "Alchemize": "炼金",
    "Using Catalyst": "使用催化剂",
    "Alchemy Efficiency":"炼金效率",
    "Alchemize Item": "炼金物品",
    "Alchemy Catalyst":"炼金催化剂",


    "Catalyst increases success rate. One catalyst is consumed on success only":"催化剂可提高成功率。仅在成功时消耗一个",
    "Select an item to alchemize": "选择要炼金的物品",
    "You are currently not alchemizing anything":"当前无炼金",
    "This item cannot be decomposed": "该物品无法被分解",
    "This item cannot be transmuted": "该物品无法被重组",
    "Alchemy allows you to transform items into other items. Each action has a different success rate, and the input item and coin cost will always be consumed regardless of success or failure":
    "炼金允许您将物品转换为其他物品。每个动作都有不同的成功率，无论成功或失败，输入的物品和金币成本都会被消耗",
    "coinify, decompose, and transmute":"点金，分解和重组",
    "Converts item into a random related item":"将物品转换为随机相关物",
    "Converts item into coins":"将物品转换为金币",
    "Converts item into component materials":"将物品分解为原材料 ",
    "Converts item into a random related item, and in some cases unique items that cannot be acquired elsewhere":"将物品重组为随机相关物品，在某些情况下可重组为无法在其他地方获得的独特物品",
    "Each transformation has a base success rate. The success rate is lower if your alchemy level is lower than the item level. Catalyst and tea can be used to increase the success rate":
    "每次转换都有一个基础成功率。如果你的炼金等级低于物品等级，成功率就会较低。可以使用催化剂和茶来提高成功率",
    "One catalyst is consumed each action to increase success rate": "每次动作消耗1个催化剂并提高成功率",
    "Equipping an Alembic will boost your alchemy skill":"装备炼金蒸馏器将提升你的炼金技能",

    // --强化
    "Enhancing allows you to permanently improve your equipment, giving them increasing bonuses as their enhancement level go up":
        "强化可以让你永久提升装备，随着强化等级的提升，装备的奖励效果也会增加",
    "Enhancing costs a small amount of materials for each attempt": "每次尝试强化都需要消耗少量材料",
    "The success rate depends on your enhancing skill level, the tier of the equipment, and the equipment's current enhancement level. A successful enhancement will increase the level by 1 and failure will reset the level back to":
        "成功率取决于你的强化技能等级、装备的等级和当前的强化等级。成功的强化将使等级增加1，失败将使等级重置为",
    "If the item's enhancement level exceeds the minimum protection level, one protection item is used per attempt to ensure only one enhancement level is lost on failure. The protection item is only consumed on failures":
    "如果物品的强化等级超过最低防护等级，每次尝试只会消耗一个防护物品，以确保失败时只会损失一个强化等级。保护时的消耗物品仅在失败时消耗",
    Protect: "保护",
    Protection: "保护",
    "Protect From level": "保护等级",

    "Protect From": "保护自",
    "Item not available": "道具无法使用",
    "Must Be >= 2 To Be Effective": "必须 >= 2 才能生效",
    Instructions: "指引",
    "Enhancement Bonus": "强化加成",
    "You can optionally use copies of the base equipment for protection. Failure with protection will only reduce the enhancement level by 1 but consume 1 protection item":
        "你可以选择使用基础装备的副本进行保护。带有保护的失败只会将强化等级减少1，但会消耗1个保护道具",
    "Equipping an enhancer will boost your enhancing skill": "装备一个强化器会提升你的强化技能",
    "Not": "未",
    "Used": "使用",
    "Not Used": "未使用",
    "Enhance Item": "强化物品",
    "Enhancing Protection": "强化保护",
    "Current Action": "当前操作",
    "You are currently not enhancing anything": "当前无强化",
    "Select an equipment to enhance": "选择一个装备进行强化",
    Success: "成功",
    "increases the item's enhancement level by": "将使物品的强化等级增加",
    Failure: "失败",
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
    Enhance: "强化",
    "Multiplicative bonus to success rate while enhancing": "在强化时对成功率的乘法加成",
    "setup queue": "设置队列",

    // --社交
    Friends: "好友",
    Referrals: "推荐",
    "Block List": "屏蔽列表",
    "Add Friend": "添加好友",
    Activity: "活动",
    Online: "在线",
    Offline: "离线",
    "When someone signs up using your referral link, you'll be eligible for the following rewards": "当有人使用你的推荐链接注册时，你将有资格获得以下奖励",
    "if they reach Total Level": "如果他们总等级达到",
    Additional: "再加",
    "if they reach Total Level": "如果他们总等级达到",
    "of any Cowbells they purchase": "他们购买的任何牛铃",
    "Copy Link": "复制链接",
    "Link Copied":"链接已复制",
    "So far": "到目前为止，已经有",
    "players have signed up using your referral link": "位玩家使用你的推荐链接注册",
    "A referred player reached Total Level": "推荐玩家总等级达到",
    "Block Player": "屏蔽玩家",
    "Blocked Players": "被屏蔽的玩家",
    "A new player joined with your referral link. Thanks for sharing": "一位新玩家透过您的推荐链接加入了，感谢分享",

    // --战斗
    "combat zone": "战斗区域",
    "find party": "寻找队伍",
    "Private party":"私人队伍",
    "Public party":"公开队伍",
    "Auto-kick disabled":"自动踢除已禁用",
    "Auto-kick if not ready over 5 minutes":"自动踢出5分钟未准备的队员",
     battle: "战斗",
    "auto attack": "自动攻击",
    "select zone": "选择区域",
    "fighting monsters will earn you experience and item drops": "击败怪物将使你获得经验和物品掉落",
    "your combat stats are based on a combination of your combat skill levels and your equipment bonuses": "你的战斗属性由战斗技能水平和装备加成的综合决定",
    "you can bring food to recover HP or MP, drinks to give you buffs, and abilities that can be cast. you can change the automation configuration from the settings icon below them":
        "你可以携带食物恢复生命值或魔法值，饮品可以提供增益效果，还可以施放各种技能。你可以通过下方的设置图标来更改自动化配置",
    "if you are defeated in combat, your character will wait through a respawn timer before automatically continuing combat": "如果你在战斗中被击败，你的角色会在等待重生计时器结束后自动继续战斗",

    // 未整理
    parry: "招架",
    Essences: "精华",
    "Essence Find": "精华发现",
    "Increases drop rate of essences": "增加精华的掉落率",
    "Ranged Accuracy": "远程精准",
    "Ranged Damage": "远程伤害",
    "Magic Damage": "魔法伤害",
    "Fire Amplify": "火焰强化",
    "Water Amplify": "水属性强化",
    "Water Penetration": "水属性穿透",
    "Nature Amplify": "自然属性强化",
    "Max Hitpoints": "最大生命值",
    "Milking Efficiency": "挤奶效率",
    "Foraging Efficiency": "采摘效率",
    "Woodcutting Efficiency": "伐木效率",
    "Max Manapoints": "最大魔力值",
    "Combat Experience": "战斗经验",
    "Skilling Experience": "技能经验",
    Loots: "战利品",
    "Food Slots": "食物槽位",
    "Drink Slots": "饮料槽位",
    "Food Haste": "食物急速",
    "Drink Concentration": "饮料浓度",
    "Sell Price": "售价",
    "Traveling To Battle": "踏上战斗之旅",
    "My Stuff": "我的物品",
    "Ability Slot": "技能槽",
    "Unlock at Lv. 20 INT": "在智力20解锁",
    "Unlock at Lv. 50 INT": "在智力50解锁",


    
    Tip: "提示",
    "Game Rules": "游戏规则",
        "You need at least 200 total level or 1,000,000 XP to use general chat": "你需要至少200总等级或1,000,000经验值才能使用常规聊天",
    "Feel free to ask questions or chat with other players here. Useful links": "请随意在此处提问或与其他玩家聊天。有用的链接",
    "General channel is for game-related discussions and friendly chats. To maintain a positive and respectful atmosphere, please adhere to the":
        "常规频道用于游戏相关讨论和友好聊天。为了保持积极和尊重的氛围，请遵守",
    "Trade channel is for advertising item trading and services. Please use whispers for conversations and negotiations":
        "交易频道用于广告物品交易和服务。对话和谈判时请使用私聊",
    "Recruit channel is for advertising guild/party recruitment and players seeking to join a guild/party. Please use whispers for conversations":
        "招募频道用于宣传公会/队伍招募和寻找加入公会/队伍的玩家。请使用私聊进行对话",
    'You can whisper other players using the command "/w [playerName] [message]" or simply click on a player\'s name and select whisper':
        '你可以使用命令 "/w [玩家名称] [消息]" 来私聊其他玩家，或者直接点击玩家名称并选择私聊',


    "Unlock at Lv. 90 INT": "在智力90解锁",
    "Supporter Points": "支持者点数",
    "Fame Points": "名望点数",
    "Buy Cowbells": "购买牛铃",
    Convenience: "便利性升级",
    "Chat Icons": "聊天图标",
    "Avatars": "头像",
"Avatar": "头像",
"Avatar Outfit": "头像装扮",
Unlocked: "已解锁",
"Click any of the colors to see a preview with your name. Unlocked colors can be changed in Settings -> Profile": "点击任意颜色以查看带有你名字的预览。解锁的颜色可以在设置 -> 个人资料中更改",
"Upon reaching 150K supporter points, players can request a custom name color(or gradient pattern) . This can be requested via #new-ticket on Discord": "达到150K支持者点数后，玩家可以请求一次自定义名字颜色（或渐变图案）。可以通过Discord上的#new-ticket请求",
"Buy Avatar": "购买头像",
"Buy Avatar Outfit": "购买头像装扮",
"Click any of the avatar to see a larger preview. Unlocked avatars can be changed in Settings -> Profile": "点击任意头像以查看更大预览。解锁的头像可以在设置 -> 个人资料中更改",
"Upon reaching 250K supporter points, players can request a custom avatar. The avatar design must fit the theme of the game and can be requested via #new-ticket on Discord": "达到250K支持者点数后，玩家可以请求一次自定义头像。头像设计必须符合游戏主题，可以通过Discord上的#new-ticket请求",
"Click any of the outfit to see a preview with your avatar. Unlocked outfits can be changed in Settings -> Profile": "点击任意装扮以查看与你头像的预览。解锁的装扮可以在设置 -> 个人资料中更改",
"Upon reaching 350K supporter points, players can request a custom avatar outfit. The outfit design must fit the theme of the game and can be requested via #new-ticket on Discord": "达到350K支持者点数后，玩家可以请求一次自定义头像装扮。装扮设计必须符合游戏主题，可以通过Discord上的#new-ticket请求",
"Community buffs are bonuses granted to all players on the server. For every Cowbell spent on community buffs, you will gain 1 fame point. Fame points are ranked on the leaderboard": "社区增益是授予服务器上所有玩家的奖励。每消耗一个Cowbell在社区增益上，你将获得1点声望。声望点数在排行榜上排名",
"Unlock More Avatars": "解锁更多头像",
"Unlock More Outfits": "解锁更多装扮",

    "Name Colors": "名称颜色",
    "Community Buffs": "社区加成",
    "Name Change": "更改名称",
    "Cowbells can be purchased to help support the game. You can use them to buy convenience upgrades, chat icons, name colors, community buffs, or change your name":
        "可以购买牛铃来支持游戏。你可以使用它们购买便利升级、聊天图标、名称颜色、社区加成或更改你的名称",
    NOTE: "注意",
    "Purchased Cowbells will appear in your inventory as Bags of 10 Cowbells which can be sold on the market (coin tax) to other players. Once opened, they are no longer tradable":
        "购买的牛铃将以10个牛铃的袋子出现在你的库存中，可以在市场上（带有硬币税）卖给其他玩家。一旦打开，就无法再进行交易",
    "Select Currency": "选择货币",
    USD: "美元",
    EUR: "欧元",
    "Upgrades permanently increases limits. Your current limits can be viewed in Settings": "升级永久增加上限。你当前的上限可以在设置中查看",
    "Increase offline progress limit": "增加离线进度上限",
    "Hour Offline Progress": "每小时离线进度",
    "Buy limit": "购买限制",
    "Increase action queue limit": "增加动作队列上限",
    "Action Queue": "动作队列",
    "Increase market listing limit": "增加市场挂单上限",
    "Market Listing": "市场挂单",
    "Increase task slot limit": "增加任务槽上限",
    "Task Slot": "任务槽",
    "Increase loadout slot limit": "增加配装槽上限",
    "Loadout Slot": "配装槽",
    "Limit": "上限",
    "Loadout Slots": "配装槽",

    "Chat icons are displayed in front of your name in the chat. Unlocked chat icons can be changed in Settings -> Profile":
        "聊天图标显示在聊天中你的名称前面。已解锁的聊天图标可以在设置 -> 个人资料中更改",
    "Upon reaching 50K, 100K, and 200K supporter points, players can request a custom chat icon for each tier reached. The icon must fit the theme of the game and can be requested via #new-ticket on Discord. Each player is eligible for a maximum of three custom icons":
        "达到50K、100K和200K支持者点数后，玩家可以为达到的每个层级请求一个自定义聊天图标。图标必须符合游戏的主题，并可以通过 Discord 的 #new-ticket 请求。每个玩家最多可以获得三个自定义图标",
    Clover: "四叶草",
    "Task Crystal": "任务水晶",
    Sword: "剑",
    Spear: "枪",
    Mace: "狼牙棒",
    Bulwark: "大盾",
    Book: "书籍",
    keys: "钥匙",
    "Mage's Hat": "法师帽",
    "Panda Paw": "熊猫爪",

    "Santa Hat":"圣诞帽",
    "Jack-o'-lantern":"南瓜灯",
    "Iron Cow": "铁牛",
    Duckling: "小鸭",
    Whale: "鲸鱼",
    Bamboo: "竹子",
    "Golden Coin": "金币",
    "Golden Egg": "金蛋",
    "Golden Berry": "黄金浆果",
    "Golden Apple": "黄金苹果",
    "Golden Donut": "黄金甜甜圈",
    "Golden Cupcake": "黄金纸杯蛋糕",
    "Golden Clover": "黄金四叶草",
    "Golden Marketplace": "黄金市场",
    "Golden Biceps": "黄金二头肌",
    "Golden Frog": "黄金青蛙",
    "Golden Piggy": "黄金小猪",
    "Golden Duckling": "黄金小鸭",
    "Golden Whale": "黄金鲸鱼",
    "Click any of the colors to see a preview with your name. Unlocked colors can be changed in Settings -> Profile": "点击任何颜色以预览带有你的名称。已解锁的颜色可以在设置 -> 个人资料中更改",
    "Upon reaching 150K supporter points, players can request a one-time custom name color(or gradient pattern) . This can be requested via #new-ticket on Discord":
        "达到150K支持者点数后，玩家可以请求一次性自定义名称颜色（或渐变图案）。可以通过 Discord 的 #new-ticket 请求",
    Burble: "泡泡",
    Blue: "蓝色",
    Green: "绿色",
    Yellow: "黄色",
    Coral: "珊瑚",
    Pink: "粉色",
    "Fancy Burble": "华丽泡泡",
    "Fancy Blue": "华丽蓝色",
    "Fancy Green": "华丽绿色",
    "Fancy Yellow": "华丽黄色",
    "Fancy Coral": "华丽珊瑚",
    "Fancy Pink": "华丽粉色",
    Iron: "铁色",
    Rainbow: "彩虹色",
    Golden: "金色",
    "Community buffs are bonuses granted to all players on the server. For every Cowbell spent on community buffs, you will gain 1 fame point. Fame points are ranked on the leaderboard":
        "社区加成是授予服务器上所有玩家的加成。每花费一个牛铃购买社区加成，你将获得1个名望点数。名望点数在排行榜上排名",
    "Fame Leaderboard": "名望排行榜",
    "Opt In": "选择加入",
    "Opt Out": "选择退出",
    Experience: "经验",
    Minute: "分钟",
    "Gathering Quantity": "采集数量",
    "Production Efficiency": "生产效率",
    "Enhancing Speed": "强化速度",
    "Combat Drop Quantity": "战斗掉落数量",
    "Current Name": "当前名称",
    "New Name": "新名称",
    "Check Availability": "检查可用性",
    Cost: "费用",
    "Change Name": "更改名称",
    Moderator: "管理员",
    Moderators: "管理员",
    Chat: "聊天",
    Inspect: "检查",
    Mutes: "禁言",
    Bans: "封禁",
    Role: "角色",
    "Chat Min Level": "聊天最低等级",
    "General Chat Min Level": "普通聊天最低等级",
    "General Chat Min Exp": "普通聊天最低经验",
    Update: "更新",
    "Character Name": "角色名称",
    "Mute Duration": "禁言时长",
    minute: "分钟",
    minutes: "分钟",
    hour: "小时",
    hours: "小时",
    day: "天",
    days: "天",
    year: "年",
    years: "年",
    "Mute Reason": "禁言原因",
    Mute: "禁言",
    "Expire Time": "过期时间",
    Reason: "原因",
    Unmute: "解除禁言",
    "Ban Duration": "封禁时长",
    "Ban Reason": "封禁原因",
    Ban: "封禁",
    Unban: "解封",
    "Purchased Cowbells will appear in your inventory as Bags of 10 Cowbells which can be sold on the market": "购买的牛铃将以每袋10个牛铃的形式出现在你的库存中, 可以在市场上(带有",
    "coin tax) to other players. Once opened, they are no longer tradable": "的硬币税)卖给其他玩家。一旦打开，它们将无法再进行交易",
    Name: "名称",
    Stunned: "被眩晕",
    Silenced: "被沉默",
    Amount: "数量",
    Consumable: "消耗品",
    "Usable In": "可用于",
    HP: "生命值",
    MP: "魔力值",
    "HP Restore": "恢复生命值",
    "HP over 30s": "30秒内恢复生命值",
    "MP Restore": "恢复魔法值",
    "MP over 30s": "30秒内恢复魔法值",
    "Foraging Level": "采摘等级",
    "Buffs foraging level": "增益采摘等级",

    "Woodcutting Level": "伐木等级",
    "Buffs woodcutting level": "增益伐木等级",
    "Cooking Level": "烹饪等级",
    "Buffs cooking level": "增益烹饪等级",
    "Brewing Level": "冲泡等级",
    "Buffs brewing level": "增益冲泡等级",
    "Enhancing Level": "强化等级",
    "Buffs enhancing level": "增益强化等级",
    "Alchemy Level": "炼金等级",
    "Buffs Alchemy level": "增益炼金等级",
    "Cheesesmithing Level": "奶酪锻造等级",
    "Buffs cheesesmithing level": "增益奶酪锻造等级",
    "Crafting Level": "制作等级",
    "Buffs crafting level": "增益制作等级",
    "Tailoring Level": "裁缝等级",
    "Buffs tailoring level": "增益裁缝等级",

    Gathering: "采集类",
    Gourmet: "美食",
    "Chance to produce an additional item for free": "有机会额外获得一个免费物品",
    Processing: "加工",
    "Chance to instantly convert gathered resource into processed material": "有机会立即将采集的资源转化为加工材料",
    "cheese, fabric, and lumber": "奶酪、织物和木材",
    Artisan: "工匠",
    "Reduces required materials during production": "减少生产过程中所需材料",
    "Alchemy Success": "炼金成功",
    "Multiplicative bonus to success rate while alchemizing": "在炼金时对成功率的乘法加成",
    "Action Level": "行动所需等级",
    "Increases required levels for the action": "增加行动所需等级",
    Blessed: "祝福",
    "Chance to gain +2 instead of +1 on enhancing success": "有机会在强化成功时获得+2而不是+1",
    "Stamina Level": "耐力等级",
    "Buffs stamina level": "增益耐力等级",
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
    Effect: "效果",
    "Ability Exp Per Book": "每本书的技能经验",
    "Stab Accuracy": "刺击精准",
    "Stab Damage": "刺击伤害",
    "Slash Accuracy": "斩击精准",
    "Slash Damage": "斩击伤害",
    "Magic Accuracy": "魔法精准",
    "Cheesesmithing Efficiency": "奶酪锻造效率",
    "Crafting Efficiency": "制作效率",
    "Tailoring Efficiency": "裁缝效率",
    "Nature Penetration": "自然属性穿透",
    "Fire Penetration": "火焰穿透",
    "Healing Amplify": "治疗强化",
    "Cooking Efficiency": "烹饪效率",
    "Brewing Efficiency": "冲泡效率",

    "Skilling Efficiency": "技能效率",
    "Skilling Speed": "技能速度",
    "Armor Penetration": "护甲穿透",
    Global: "全局",
    "Welcome Back": "欢迎回来！",
    "You were offline for": "你离线了",
    "You made progress for": "你已离线至当前上限",
    "You consumed": "你消耗了",
    Close: "关闭",
    "Items gained": "获得物品",
    "Experience gained": "获得经验",
    "View Cowbell Store": "查看牛铃商店",
    "Dropped By Monsters": "怪物掉落",


    "Almost all monsters drop coins": "几乎所有的怪物都会掉落金币",
    "Dropped By Elite Monsters": "精英怪物掉落",
    "Looted From Container": "获取自箱子",
    "Open To Loot": "战利品",
    "Rare Drop From": "稀有掉落自",
    "Any low level gathering actions": "任何低级采集活动",
    "Any medium level gathering actions": "任何中级采集活动",
    "Any high level gathering actions": "任何高级采集活动",
    "Any medium level production, alchemy, and enhancing actions": "任何中级生产、炼金与强化活动",
    "Any high level production, alchemy, and enhancing actions": "任何高级生产、炼金与强化活动",
    "Any low level monster in normal combat": "普通战斗中的任意低级怪物",
    "Any medium level monsters in normal combat": "普通战斗中的任意中级怪物",
    "Any high level monsters in normal combat": "普通战斗中的任意高级怪物",

    "Enhancing Cost": "强化费用",
    Recommended: "推荐",
    "Any Milking action": "任何挤奶动作",
    "Any Foraging action": "任何采摘动作",
    "Any Woodcutting action": "任何伐木动作",
    "Any Cheesesmithing action": "任何奶酪锻造动作",
    "Any Crafting action": "任何制作动作",
    "Any tailoring action": "任何裁缝动作",
    "Any cooking action": "任何烹饪动作",
    "Any brewing action": "任何冲泡动作",
    "Any Alchemy action": "任何炼金动作",
    "Any enhancing action": "任何强化动作",
    "Used For Cooking": "用于烹饪",
    "Used For Brewing": "用于冲泡",
    "Used For Crafting": "用于制作",
    "Gathered From": "获取自采集",
    "Produced From Brewing": "通过冲泡产生",
    "Produced From Cooking": "通过烹饪产生",
    "Produced From Cheesesmithing": "通过奶酪锻造产生",
    "Produced From Crafting": "通过制作产生",
    "Produced From Tailoring": "通过裁缝产生",
    "Produced From Alchemy": "通过炼金产生",
    "Produced From Enhancing": "通过强化产生",
    "Used For Cheesesmithing": "用于奶酪锻造",
    "Used For Tailoring": "用于裁缝",
    "Transmuted From(Alchemy": "重组自（炼金  ",
    "Decomposed From(Alchemy": "分解自（炼金  ",
    "Decomposes Into(Alchemy": "分解（炼金  ",
    "Transmutes Into(Alchemy": "重组（炼金  ",
    Monsters: "怪物",
    "Boss Fight": "首领战斗",
    Every: "每个",
    Battles: "战斗",
    Travel: "旅行",
    "Combat Level": "战斗等级",
    Drops: "掉落",
    Standard: "标准",
    Ironcow: "铁牛",
    "Legacy Ironcow": "传统铁牛",
    "Updates approximately every 20 minutes": "大约每20分钟更新一次",

    Rank: "排名",
    Profile: "个人资料",
    Mention: "提及@",
    Block: "屏蔽",
    Game: "游戏",
    Account: "账户",
    Preview: "预览",
    "Mod Inspect": "审查",
    "Delete Msg": "删除消息",
    Warn: "警告",
    "View My Profile": "查看我的个人资料",
    "Chat Icon": "聊天图标",
    "None Owned": "未拥有",
    Unlock: "解锁",
    "Name Color": "名称颜色",
    "Online Status": "在线状态",
    Public: "公开",
    Show: "显示",
    actions: "操作",
    Repeat: "重复",
    "Task Slots": "任务槽",

    
    // 设置----游戏
    "Game Mode": "游戏模式",
    "Offline Progress": "离线进度",
    "General Chat": "常规频道",
    "Non-English Language Chat": "非英语语言频道",
    "Ironcow Chat": "铁牛频道",
    "Trade Chat": "交易频道",
    "Recruit Chat": "招募频道",
    "Beginner Chat": "新手频道",
    "Chat URL Warning": "聊天网址警告",
    "Profanity Filter": "脏话过滤器",
    "CSS Animation": "CSS动画",

    Enabled: "已启用",
    On: "开",
    "Account Type": "账户类型",
    "Registered User": "注册用户",
    "Current Password": "当前密码",
    Email: "邮箱",
    "New Password": "新密码",
    "Confirm Password": "确认密码",
    Hide: "隐藏",
    "Friends/Guildmates": "好友/公会成员",
    Private: "私密",
    "A new tab will be opened to process the purchase": "将打开一个新标签页进行购买",
    Continue: "继续",
    "Buy Convenience Upgrade": "购买便利性升级",
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
    Remove: "移除",
    Overview: "概览",
    Members: "成员",
    Manage: "管理",
    "Guild Level": "公会等级",
    "Guild Experience": "公会经验",
    "Guild Members": "公会成员",
    Edit: "编辑",
    "Guild Invitation": "邀请公会",
    "Invited by": "受邀自",
    Decline: "拒绝",
    "Invite to Guild": "邀请加入公会",
    "Guild joined": "已加入公会",
    "Guild Exp": "公会经验",
    Leader: "会长",
    Officer: "官员",
    Hidden: "隐藏",
    Member: "成员",
    "There are no penalties for leaving": "离开没有任何惩罚",
    "Leave Guild": "离开公会",
    "Battle Info": "战斗信息",
    Stats: "统计数据",
    "Combat Duration": "战斗时长",
    Deaths: "死亡次数",
    "Items looted": "掠夺的物品",
    "Drop Quantity": "掉落数量",
    Skill: "技能",
    Unfriend: "解除好友关系",
    "Confirm Unfriend": "确认解除好友关系",
    Promote: "晋升",
    Demote: "降级",
    Kick: "踢出",
    "Enemies' Total # of Active Units": "敌人的活跃单位总数",
    AND: "并且",
    "Enemies' Total Current Hp": "敌人的总当前生命值",
    "Target Enemy's Current Hp": "目标敌人的当前生命值",
    My: "我的",
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
    Condition: "条件",
    "Reset Default": "重置为默认",
    Rate: "比率",
    CriticalAura: "致命光环",
    "Puncture Debuff": "穿刺减益(护甲)",
    "Ice Spear Debuff": "冰枪减益(速度)",
    "Frost Surge Debuff": "冰霜爆裂减益(闪避)",
    "Toxic Pollen Debuff": "剧毒粉尘减益",
    "Crippling Slash Debuff": "致残减益(伤害)",
    "Pestilent Shot Debuff": "疫病减益",
    "Smoke Burst Debuff": "爆尘灭影减益(命中)",
    "Blind Status": "致盲状态",
    "Silence Status": "沉默状态",
    "Stun Status": "眩晕状态",
    "Weaken": "虚弱状态",
    "Curse": "诅咒状态",
    "My Missing Mp": "我的缺失魔法值",
    "My Missing Hp": "我的缺失生命值",
    "Is Active": "已激活",
    "Is Inactive": "未激活",
    "New Ability": "新技能",
    "Available At Price": "在这个价格可用",


    Home: "主页",
    "Multiplayer Idle RPG": "多人放置RPG",
    "Embark on a journey through the Milky Way Idle universe, a unique multiplayer idle game. Whether you enjoy resource gathering, item crafting, or engaging in epic battles against alien monsters, we have something to offer for everyone. Immerse yourself in our thriving community, where you can trade in the player-driven marketplace, form a guild with friends, chat with fellow players, or climb to the top of the leaderboards":
        "踏上一段穿越银河奶牛放置的旅程，这是一款独特的多人放置游戏。无论你喜欢收集资源、制作物品，还是参与与外星怪物的史诗战斗，我们都能为每个人提供一些乐趣。沉浸在我们繁荣的社区中，你可以在由玩家驱动的市场交易，与朋友组建公会，与其他玩家聊天，或者登上排行榜的顶端。",
    "Gather and Craft": "收集和制作",
    "Milking, Foraging, Woodcutting, Cheesesmithing, Crafting, Tailoring, Cooking, Brewing, Enhancing": "挤奶、采摘、伐木、奶酪锻造、制作、裁缝、烹饪、冲泡、强化",
    "Multiple styles of combat with highly customizable consumable and ability auto-usage. Battle solo or with a party": "多种战斗风格，可高度自定义消耗品和能力的自动使用。单人或组队战斗",
    "Buy and sell resources, consumables, and equipment": "购买和出售资源、消耗品和装备",
    Community: "社区",
    "Play and chat with friends. Compete for a spot on the leaderboard": "与朋友一起玩耍和聊天。争夺排行榜上的位置",
    "Terms of Use": "使用条款",
    "Play As Guest": "以游客身份玩",
    Register: "注册",
    Login: "登录",
    "Your session will be saved in this browser. To play across multiple devices, you can go in": "你的会话将保存在此浏览器中。要在多个设备上玩游戏，你可以进入",
    "in game to find your": "游戏中找到你的",
    "guest password": "游客密码",
    "or to fully": "或者完全",
    register: "注册",
    "I Agree to the": "我同意",
    Terms: "条款",
    "I am 13 years of age or older": "我年满13岁或以上",
    Play: "开始游戏",
    Password: "密码",
    "Password Confirmation": "确认密码",
    "Email or Name": "电子邮件或用户名",
    "Forgot Password": "忘记密码",

    "Loading characters": "正在加载角色",
    "Select Character": "选择角色",
    Empty: "空",
    "Create Character": "创建角色",
    "The Standard game mode is recommended for new players. There are no feature restrictions. You can only have 1 Standard character": "标准游戏模式适合新玩家。没有功能限制。你只能创建一个标准角色",
    "Last Online": "上次在线",
    "New Tutorial Message": "新教程消息",
    Tutorial: "教程",
    "where magical cows mooo! I'm Purple, the Chief Training Officer (CTO), and also your tour guide today": "这里是神奇的奶牛世界！我是紫色，首席培训官（CTO），也是你的导游",
    "I'll sprinkle some glowing magical dust to guide you through the training": "我会撒些闪闪发光的魔法粉尘来引导你完成训练",
    "Hi Purple": "嗨，紫色",
    "You need at least 30 total level to chat": "你需要至少30总等级才能聊天",
    "spam protection": "垃圾邮件保护",
    "Please do not make requests too quickly": "请不要太快提出请求",
    "New Tutorial Task": "新教程任务",
    "Complete your tutorial tasks to unlock the task board": "完成教程任务即可解锁任务板",
    "Your current task can be found in the top-right corner": "您目前的任务可以在右上角找到",
    "Let me first show you what we magical cows are best known for": "让我先向你展示我们神奇的奶牛最擅长的事情",
    "producing magical milk! By the way, my cousin Burble also works here. Hi Burble": "生产神奇的牛奶！顺便说一下，我的表弟Burble也在这里工作。嗨，Burble",
    "First, try and gather some milk": "首先，尝试收集一些牛奶",
    Accept: "接受",
    OK: "好的",
    "Good job! Here's some extra milk and a brush. Magical cows love to be brushed, and happy cows produce milk faster": "干得好！这是一些额外的牛奶和一把刷子。神奇的奶牛喜欢被刷，快乐的奶牛产奶更快",
    "Let's make some cheese with the milk! These special cheeses are very durable and can be turned into many useful things through cheesesmithing":
        "让我们用牛奶做些奶酪！这些特殊的奶酪非常耐用，可以通过奶酪制作变成许多有用的东西",
    "Great! Take some extra cheese with you for the next task": "太棒了！带一些额外的奶酪继续下一个任务",
    "Cheeses are essential resources for making tools, weapons, and armor. Let me show you how to make a cheese sword. I know it might sound crazy and maybe a little bit smelly too, but trust me":
        "奶酪是制作工具、武器和盔甲的重要资源。让我来教你如何制作奶酪剑。我知道这听起来可能很疯狂，也可能有点臭，但请相信我",
    "Awesome! As you level up, equipment can be upgraded to higher tiers! Tools can also be made to improve each of your skills":
        "太棒了！随着你的等级提升，装备可以升级到更高的阶级！工具也可以制作来提高你的每项技能",
    "Now let's go forage for some more resources. Head to Farmland and see what items you can gather": "现在让我们去寻找更多的资源。前往农田，看看你能收集到什么物品",
    "That was fast! Foraging gives you resources used in many skills, including cooking, brewing, and tailoring": "速度很快！寻找资源可以用于许多技能，包括烹饪、冲泡和裁缝",
    "It's time to make use of your cooking skill and whip up a delicious donut using some eggs, wheat, and sugar. What? You can't cook? Of course you can! There's a rat from Earth that can cook, and if he can do it, so can you! Give it a try":
        "现在是时候利用你的烹饪技能，用一些鸡蛋、小麦和糖制作美味的甜甜圈。什么？你不会做饭？当然你会！地球上有只老鼠会做饭，如果他能做到，你也能！试试看",
    "Fantastic! Food can heal you while in combat. Here's a dozen more donuts for free": "太棒了！食物可以在战斗中治疗你。这里还有一打免费的甜甜圈",
    "Now I want to take you on an expedition to one of our neighboring planets": "现在我想带你去我们的邻近行星之一进行探险",
    "the Smelly Planet! I hear there are lots of flies, and they bite! You'll want to bring your sword and some donuts. Let's go":
        "臭臭星球！我听说那里有很多苍蝇，它们会叮咬！你会想带上你的剑和一些甜甜圈。我们走吧",
    "Battling aliens earns you coins, resources, ability books, and even rare items": "与外星人战斗可以获得硬币、资源、能力书籍，甚至是稀有物品",
    "If you are knocked out during combat, you will recover in 150 seconds and continue fighting": "如果在战斗中被击倒，你将在150秒内恢复并继续战斗",
    "Looks like the tour is almost over. There's still much more to explore, but don't worry, you won't be alone! Once you level up a little more, you can chat with or get help from other players":
        "看起来游览快要结束了。还有很多地方可以探索，但不用担心，你不会孤单！一旦你再升级一点，你就可以与其他玩家聊天或寻求帮助",
    "You can also buy or sell items in our player-driven marketplace, unless you are playing Ironcow mode": "你还可以在由玩家驱动的市场上买卖物品，除非你在玩铁牛模式",
    "Before I go, here's a few more tips": "在我离开之前，再给你几个提示",
    "A Game Guide can be found at the bottom of the navigation menu on the left": "游戏指南可以在左侧导航菜单的底部找到",
    "If you go offline, you'll continue to make progress for 10 hours (upgradable": "如果你离线，你将继续进行10小时的进度（可升级",
    "Items, abilities, skills, and enemies can be hovered over (long press on mobile) to see more detailed tooltips":
        "可以将鼠标悬停在物品、能力、技能和敌人上（在移动设备上长按）以查看更详细的工具提示",
    "Bye Purple": "再见，紫色",

    //规则
"Single Account Only":"一人一号",
"Each person can only play on 1 account. Guests are also considered accounts": "每人只能使用一个账户玩游戏。访客也被视为账户",
"No Account Sharing":"禁止账号共享",
"Do not share account with other players": "不要与其他玩家共享账户",
"No Inappropriate Name":"禁止不当名称",
"Names should not be offensive, sexual, or impersonating others. Inappropriate name may result in mutes or forced name change": "名称不应具攻击性、色情或冒充他人。不当名称可能导致禁言或强制更名",

"Age 13+ Only":"仅限13岁以上玩家游玩",
"In compliance with COPPA(Children's Online Privacy Protection Act), you must be at least age 13+ to register and play": "根据 COPPA（儿童在线隐私保护法案），您必须年满 13 岁才能注册和玩游戏",

Trading:"交易",
"No Real World Trading / Cross-Trading":"禁止现实世界交易/跨游戏交易",
"Do not trade items or services within Milky Way Idle for anything outside of the game": "不要用 Milky Way Idle 内的物品或服务换取游戏外的任何东西",

"No Boosting":"禁止倾斜资源",
"Do not funnel wealth to any player, giving them an unfair advantage over others. Gifts to other players and contests involving prizes should be limited to value of 10M coins or less": "不要向任何玩家转移财富，使其获得不公平优势。送礼和比赛奖品应限于10M金币或以下。",
 "No Scamming": "禁止诈骗",
  "Do not use deception or scamming to gain items from other players. Actions will be taken against scammers given sufficient evidence. However, items lost to scams will not be refunded": "不要使用欺骗手段获取其他玩家的物品。只要有足够的证据将对骗子将采取措施。然而，被诈骗损失的物品将不予退还",
  "Repay Loans Within 7 Days": "贷款需在 7 天内偿还",
  "Loans are at your own risk. Loans not repaid within 7 days can be considered boosting/scamming": "贷款风险自负，未在 7 天内偿还的贷款视为倾斜资源/诈骗",

"Use Respectful Language":"注意言辞",
"The #1 chat rule is to respect other players. Our goal is to create a friendly community space everyone can enjoy. Please avoid intentionally antagonizing or harassing others. While the occasional use of profanity is not against the rule, please don't do so excessively, especially when directed at other players":"首要的聊天规则是尊重其他玩家。我们的目标是创建一个友好的社区空间，让每个人都能享受。请避免故意挑衅或骚扰他人。虽然偶尔使用粗话不违反规则，但请不要过度使用，尤其是针对其他玩家时。",

"English in General Chat":"常规频道仅限使用英语",
"Please use only English in the General chat channel. Different languages are acceptable in other channels": "常规聊天频道中仅限使用英语。其他语言可在交易、招募或私人频道中使用",

"No Discrimination":"禁止歧视",
"Do not use slurs, slangs, or any offensive phrases that target any person or group of people":"不要使用针对任何人或群体的侮辱性语言、俚语或攻击性短语",

"No Illegal or Sexual Topics":"禁止讨论非法或性话题",
"Do not link or discuss illegal activities or sexual topics":"不要发送链接或讨论非法活动或性话题",

"No Spamming":"禁止刷屏",
"Do not spam the chat with large number of unnecessary messages, overuse CAPSLOCK, or beg others for free items":"不要发送大量不必要的信息、过度使用大写字母或乞讨免费物品",

"Do Not Encourage Others to Break Rules":"禁止鼓励他人违反规则",
"Do not mislead or instigate other players into breaking game rules":"不要误导或煽动其他玩家违反游戏规则",

"Do Not Disclose Personal Information":"禁止披露个人信息",
"Do not disclose identifying personal information about yourself, including, but not limited to, your full name, address, phone number, and email address. Furthermore, do not disclose ANY personal information about other players that they have not made public themselves, such as their name, age, or location":"不要披露关于您自己的任何个人识别信息，包括但不限于您的全名、地址、电话号码和电子邮件地址。此外，不要披露其他玩家未公开的任何个人信息，如他们的姓名、年龄或位置",

"All Advertisements Must be in Appropriate Channels":"所有广告必须在适当的频道中",
"All buying, selling, or service requests should be in trade chat. Guild/Party recruitment or seeking to join guild/party requests should be in recruit channel. Price checks are allowed in general or beginner chat. No referral links": "所有购买、出售或服务请求应在交易聊天中进行。公会/队伍招募或寻找加入公会/队伍的请求应在招募频道中进行。价格查询允许在常规或初学者聊天中进行。禁止推荐链接",

"Listen to":"听从",
"Moderators have the discretion to moderate chat as they see fit in order to maintain a positive environment. Please cooperate and respect their requests to avoid certain topics (excessive drama, political/religious discussions, mute/ban discussion, etc). If anyone has any issues or complaints regarding a moderator, please submit a ticket on Discord":"管理员有权根据需要管理聊天，以维持积极的环境。请合作并尊重他们要求避免的特定话题（过度争吵、政治/宗教讨论、禁言/封禁讨论等）。如果有人对管理员有任何问题或投诉，请在 Discord 上提交工单",
"Bots, Scripts, and Extensions":"自动化，脚本和插件",
"No Botting":"禁止使用机器人",
"Do not use any automation that plays the game for you":"禁止使用任何自动化工具来代替玩家进行游戏",

"Scripts and Extensions":"脚本和插件",
"Any scripts or extensions must not take any actions for the player (send any requests to server). You are allowed to use them purely for information display purposes or UI improvements":"任何脚本或扩展不得为玩家采取任何行动（发送任何请求到服务器）。您可以纯粹用于信息显示或用户界面改进。",
"ex":"例如",
    "Display combat summary, track drops, move buttons to different location":"显示战斗总结、追踪掉落、移动按钮位置",
"Bugs and Exploits":"漏洞和利用",
"No Bug Abusing":"禁止滥用漏洞",
"Do not abuse game bugs or exploits to your advantage. Please report them on Discord":"不要利用游戏漏洞或不正当行为来获取优势。请在 Discord 上报告这些问题",
"The rules for Milky Way Idle are designed to ensure an enjoyable and fair experience for all players. Breaking the rules would result in appropriate penalties dependent on the type and severity of the offense. Penalties include verbal warning, mute, item removal, trading ban, or account ban":"银河放置的规则旨在确保所有玩家都能享受公平的游戏体验。违反规则将根据违规类型和严重程度受到相应处罚。处罚包括口头警告、禁言、物品移除、交易禁令或账户封禁",

//引导
"FAQ":"常见问题",
"How does offline progress work":"离线也能玩吗",
"Your character continues to make progress even when you're offline. By default, you get up to 10 hours of offline progress anytime you close the browser or go offline. However, you can extend this time with convenience upgrades available in the Cowbell Store":"即使您离线，您的角色也会继续取得进展。默认情况下，每次关闭浏览器或离线时，您可以获得最多10小时的离线进度。然而，您可以在牛铃商店购买便捷升级来延长这一时间",
"Can I log in from another device":"我可以从其他设备登录吗",
"If you have registered an account, you can log in from any device using your email and password. If you are playing as a guest, you can find your guest password in Settings and use it to log in with your username":"如果您已注册账户，您可以使用您的电子邮件和密码从任何设备登录。如果您以游客身份玩游戏，您可以在设置中找到您的游客密码并使用它与您的用户名一起登录",

"Can I play the game without an internet connection or as a single player":"我可以在没有互联网连接或单人模式下玩游戏吗",
"No, you must be connected to the internet to play the game. However, you do continue to make progress while offline for up to 10 hours by default. If you prefer to not interact with other players, you can collapse the chat and choose not to use the marketplace":"不，您必须连接互联网才能玩游戏。然而，默认情况下，即使离线，您也会继续取得进展，最多可达10小时。如果您不想与其他玩家互动，您可以折叠聊天窗口并选择不使用市场",

"Can I change my username":"我可以更改用户名吗",
"Yes, you can change your username by going to the Cowbell Store and clicking on the \"Name Change\" tab. It costs 500 cowbells to change your username":"是的，您可以通过前往牛铃商店并点击\"更改名称\"标签来更改您的用户名。更改用户名需要花费500个牛铃",


"How can I get a chat icon or different name color":"我怎样才能获得聊天图标或不同的名字颜色",
"You can purchase a chat icon or name color from the Cowbell Store using cowbells. You can change your displayed icon and color in Settings":"您可以使用牛铃在牛铃商店购买聊天图标或名字颜色。您可以在设置中更改显示的图标和颜色",

"How do I send a private message to another player":"我如何向其他玩家发送私信",
"To send a private message to another player, click on their name next to their chat message and click \"Whisper\". You can also use the chat command \"/w player_name chat_message":"要向另一位玩家发送私信，请点击他们的聊天消息旁边的名字，然后点击\"私聊\"。您也可以使用聊天命令\"/w 玩家名 聊天消息",
 "You can also use the chat command":"您也可以使用聊天命令",
"To block a player and stop seeing their chat messages, click on their name next to their message and click \"Block\". You can also use the chat command \"/block player_name\". You can find your block list in the Settings menu and unblock players from the list or with the chat command \"/unblock player_name":"要屏蔽某位玩家并停止显示他们的聊天消息，请点击他们的消息旁边的名字，然后点击\"屏蔽\"。您也可以使用聊天命令\"/block 玩家名\"。您可以在设置菜单中找到您的屏蔽列表，并通过列表解除屏蔽，或使用聊天命令\"/unblock 玩家名",
"What is the action queue":"什么是动作队列",
"The action queue is a feature that allows you to set up a sequence of actions for your character to perform. To use it, click the \"Add Queue\" button instead of \"Start\". Queue slots can be unlocked or upgraded from the Cowbell Store":"动作队列是一项功能，允许您设置一连串的动作供您的角色执行。要使用它，请点击'添加队列'按钮而不是'开始'。队列槽可以在牛铃商店解锁或升级",
"How do I block another player":"我如何屏蔽其他玩家",


"Gameplay":"游戏玩法",


"What are cowbells and how can I get more":"什么是牛铃？我怎样才能获得",
"Cowbells are the premium currency of the game. They allow players to purchase convenience upgrades, cosmetics, community buffs that benefit the whole server, and name changes. There are three ways to get Cowbells":"牛铃是游戏的高级货币。它们允许玩家购买便利升级、装饰品、惠及整个服务器的社区增益和更改名称。有三种方式可以获得牛铃",
"Finish the tutorial":"完成教程",
"You will receive 80 cowbells as a reward":"您将获得80个牛铃作为奖励",
"Rare drops":"稀有掉落",
"You have a chance to get cowbells from rare loot boxes found while skilling or battling enemies in combat":"在使用技能或战斗中击败敌人时，您有机会从战利品箱中获得牛铃",
"Purchase from Cowbell Store":"在牛铃商店购买",
"You can purchase cowbells with real money from the Cowbell Store to help support the game":"您可以用现金在牛铃商店购买牛铃以支持游戏",
"Buy from the marketplace":"在市场上购买",
"You can buy tradable \"Bag of 10 Cowbells\" with coins from other players in the Marketplace":"您可以用游戏内的货币从其他玩家那里购买可交易的“10个牛铃袋”",

"What are rare drops":"什么是稀有掉落",
"Rare drops are loot boxes that can be obtained while engaging in different activities in the game":"稀有掉落是指在游戏中进行不同活动时可以获得的战利品箱",
"Gathering skills":"采集技能",
"You get meteorite caches which contain star fragments":"您可以获得包含星光碎片的陨石箱",
"Production skills and enhancing":"生产技能和强化",
"You get artisan's crates which contain shards of protection and gems":"您可以获得包含保护碎片和宝石的工匠箱",
"Combat":"战斗",
"You get treasure chests which contain gems":"您可以获得包含宝石的宝箱",
"All boxes also contain coins and occasionally cowbells. You get larger boxes when doing higher level skills or from higher level enemies":"所有箱子还包含金币，有时也包含牛铃.进行高级技能或击败高级敌人时，您会获得更大的箱子",


"What are gems used for":"宝石有什么用",
"Gems can be used to craft different jewelry that gives small bonuses. Additionally, you can crush gems into smaller pieces with the Crafting skill and use them to brew stronger versions of coffee and tea. Gems can be obtained from treasure chests in combat":"宝石可以用来制作不同的珠宝，提供小额加成。此外，您可以使用制作技能将宝石粉碎成小块，用它们来酿造更强版本的咖啡和茶。宝石可以从战斗中的宝箱中获得",

"Where do I get tea leaves":"我在哪里可以获得茶叶",
"You can get tea leaves from defeating enemies in combat. When viewing combat zones, you can hover over an enemy (long press on mobile) to see what items it drops. Tea leaves are an essential ingredient for brewing tea, which can buff non-combat skills":"您可以通过在战斗中击败敌人获得茶叶。在查看战斗区域时，您可以将鼠标悬停在敌人上（移动设备上长按）查看它掉落的物品。茶叶是冲泡茶的重要成分，可以增强非战斗技能",

"What are essences":"什么是精华",
"Essences are used to enhance special equipment with the Enhancing skill. Enemies from each combat zone drop a different type of essence":"精华用于通过强化技能来增强特殊装备。每个战斗区域的敌人都会掉落不同类型的精华",

"Milking magical cows yields different types of milk, which can be used in a various ways":
"挤奶可以得到不同类型的牛奶，每种奶都有多种用途。",

"Milk can be turned into cheese, which can then be used to craft melee equipment or skilling tools":
"牛奶可以制成奶酪，然后用于制作近战装备或生产工具。",

"Milk is an essential ingredient for many recipes":
"牛奶是许多蛋糕或者酸奶的必不可少的原料。",

"Milk is used in a small number of coffee and tea recipes":
"牛奶在少数咖啡和茶的配方中使用。",

"You can help magical cows produce milk faster by equipping a brush":
"您可以通过装备刷子来帮助牛更快地产奶。",

"Foraging allows you to gather different resources from various areas. You can forage for a specific item in an area or forage the entire area to get a bit of everything":
"采摘允许您从各个地区收集不同的资源。您可以在特定区域采集特定物品。",

"Foraged resources can be used in":
"采摘的资源可以用于",

"Eggs, wheat, sugar, berries, and fruits are essential ingredients for many recipes":
"鸡蛋、小麦、糖、浆果和水果是许多食谱的必不可少的成分。",

"Berries, fruits, and coffee beans are used to brew coffee and tea":
"浆果、水果和咖啡豆用于冲泡咖啡和茶。",

"Flax, bamboo branches, cocoons, and other materials can be processed into fabric to make magical clothing":
"亚麻、竹子、茧等材料可以加工成面料，用于裁缝。",

"You can increase foraging speed by equipping shears":
"您可以通过装备剪刀来增加采摘速度。",

"You can chop logs from different kinds of trees":
"您可以从不同种类的树木上砍伐木材。",

"Logs can be used in":
"木材可以用于",

"Logs are part of the recipe for making a number of melee weapons and skilling tools":
"木材是制作许多近战武器和技能工具的配方的一部分。",

"Logs can be processed into lumber to craft ranged and magic weapons":
"木材可以加工成木材，用于制作弓弩和法杖。",

"You can increase woodcutting speed by equipping a hatchet":
"您可以通过装备斧头来增加砍伐速度。",
"Level Bonus":"等级碾压加成",
"You gain 1% efficiency bonus for each level you have above the action's level requirement":
"您每超过操作等级要求一级，就会获得1%的效率加成。",

"Cheesesmithing is the process of creating melee equipment and skilling tools":
"奶酪锻造是制作近战装备和生产工具的过程。",

"Milk is processed into different tiers of cheese. The cheese is then used (sometimes in combination with other resources) to craft equipment. Equipment can be upgraded into higher tiers as you level up":
"牛奶被加工成不同等级的奶酪，然后奶酪被用于制造工具。随着等级提升你将可以升级你的工具",

"You can increase cheesesmithing speed by equipping a hammer":
"您可以通过装备锤子来增加奶酪锻造速度。",

"Crafting produces a variety of items, including ranged and magic weapons, jewelry, and other special resources":
"制作生产各种物品，包括远程和魔法武器、珠宝和其他特殊资源。",

"Logs can be processed into different tiers of lumber, which is then used to craft ranged and magic weapons":
"木材可以加工成不同等级的木材，然后用于制作弓弩和魔法武器。",

"Jewelry can be crafted using star fragments and gems, which are rare drops found while gathering or from combat":
"珠宝可以使用星光碎片和宝石制作，这些都是在采集或战斗中发现的稀有掉落物品。",

"You can increase crafting speed by equipping a chisel":
"您可以通过装备凿子来增加制作速度。",
"Production":"生产类",
"Tailoring produces ranged and magic clothing as well as pouches":
"裁缝生产远程和魔法服装以及袋子。",

"Raw resources from foraging, such as flax, bamboo branches, and cocoons, can be processed into fabric. Hides from combat enemies can also be processed into leather":
"来自采摘的原始资源，如亚麻、竹子和茧，可以加工成面料。来自怪物的毛皮也可以被加工为皮革",

"Fabric is primarily used to make magic clothing, such as robes and hats, while leather is used to make ranged clothing, such as leather armor and boots":
"面料主要用于制作魔法服装，如长袍和帽子，而皮革则用于制作弓手服装。",

"In addition to clothing, you can craft pouches which increase your maximum HP and MP in combat. Pouches also provide additional consumable slots for both skilling and combat":
"除了服装，您还可以制作袋子，它们可以增加您在战斗中的最大HP和MP。袋子还提供额外的消耗品（战斗+非战斗）槽位",

"You can increase sewing speed by equipping a needle":
"您可以通过装备针来增加缝制速度。",

"Cooking produces food that can be used during combat":
"烹饪生产可以在战斗中使用的食物。",

"Donuts and cakes restore HP, while gummies and yogurt restore MP":
"甜甜圈和蛋糕恢复HP，而软糖和酸奶恢复MP。",

"You can increase cooking speed by equipping a spatula":
"您可以通过装备铲子来增加烹饪速度。",

"Brewing produces drinks that provide buffs with limited durations":
"冲泡生产提供具有有限持续时间的增益效果的饮料。",

"Coffee can be consumed during combat to improve combat-related stats, while tea can be consumed to improve non-combat skills":
"咖啡可以在战斗中消耗以提高与战斗相关的统计数据，而茶可以在非战斗情况下消耗以提高生产技能",

"You can increase brewing speed by equipping a pot":
"您可以通过装备锅来增加冲泡速度。",

"You gain 1% efficiency bonus for each level you have above the action's level requirement":
"您每超过操作等级要求一级，就会获得1%的效率加成。",

//新手指引---炼金
"Alchemy allows you to transform items into other items using the actions Coinify, Decompose, or Transmute. Each action has a different success rate, and the input item and coin cost will always be consumed regardless of success or failure":
"炼金可让您使用 【点金】、【分解】或【重组】将物品转换为其他物品。每个动作都有不同的成功率，无论成功或失败，输入的物品和金币成本都会被消耗",
"Coinify lets you to convert items into coins. The amount of coins received is 5 times the item's sell price. The base success rate is":
"【点金】可以让您将物品转换成硬币。所获得的金币数量为商品售价的 5 倍。基础成功率为",
"Decompose lets you to break down items. Equipment can be turned into their base components, and non-equipment items can be turned into skilling essences. Decomposing enhanced equipment yields bonus enhancing essences, with the quantity doubling for each enhancement level. The base success rate is":
"【分解】可让您分解物品。装备可以转化为基础组件，非装备的物品可以转化为技能精华。分解强化过的装备会产生额外的强化精华，每强化一级则数量加倍。基础成功率为",
"Transmute lets you to change items into other related items or rare uniques, such as the Philosopher's Stone. The base success rate varies depending on the item being transmuted":
"【重组】可让您将物品转换为其他相关物品或稀有的独特物品，例如贤者之石。基础成功率会根据转换的物品而变化",
"The base success rate depends on the alchemy action and the specific item being alchemized. If your Alchemy skill level is lower than the item's level, there will be a penalty to the success rate. The success rate can be increased by using catalysts and catalytic tea":
"基本成功率取决于炼金行动和炼金的具体物品。如果你的炼金技能等级低于物品等级，成功率将会受到惩罚。使用催化剂和催化茶可以提高成功率",
"Catalysts are special items that can be used to improve the success rates of Alchemy actions. One catalyst is consumed on success only. Regular catalysts can be crafted using skilling essences. Prime catalysts can be obtained by transmuting regular catalysts":
"催化剂是一种特殊物品，可以用来提高炼金时的成功率。仅在成功时才会消耗一个催化剂。常规催化剂可以使用专业精华来制作。主要催化剂可以透过转化常规催化剂来获得",
"You gain 1% efficiency bonus for each level you have above the item's recommended level":
"高于该物品推荐等级的每个等级都会获得 1% 的效率加成",
"Here is a list of steps to follow when alchemizing items":
"以下是炼金时要遵循的步骤列表",
"Select the item that you want to alchemize":"选择您想要炼金的物品",
"Select the alchemy action that you want to perform":"选择您要执行的炼金操作",
"Decide whether or not to use a catalyst. If you do, select the catalyst":"决定是否使用催化剂。如果要这样做，请选择催化剂",
"Click the \"Start\" button and the alchemy process will begin":"点选「开始」按钮，炼金过程将开始",


//新手指引---强化
"Enhancing is the process of increasing the stats of any equipment, such as armor, weapons, tools, pouches, or jewelry. When you successfully enhance an equipment, its enhancement level increases by 1. However, if the enhancement process fails, the level is reset to":
"强化是增加任何装备数值的过程，例如盔甲、武器、工具、袋子或珠宝。当你成功增强一件装备时，其增强等级会增加1。然而，如果增强过程失败，等级将被重置为",

"The success rate of enhancing depends on several factors, including your enhancing skill level, the tier of the equipment, and the equipment's current enhancement level. Generally, the higher the tier and enhancement level of the equipment, the lower the success rate will be. Equipping an enhancer can improve your success rate":
"强化的成功率取决于几个因素，包括你的强化技能水平、装备的品级和当前的强化等级。通常情况下，装备的品级和强化等级越高，成功率就越低。装备一个强化器可以提高你的成功率。",

"You gain 1% action speed bonus for each level you have above the item's item level. The item level is usually the same as the level requirement to equip, but it may be different for some special items such as jewelry":
"你会因为每个等级超过物品等级的等级而获得1%的强化速度加成。物品等级通常与装备所需的等级相同，但对于一些特殊物品，比如珠宝，可能会有所不同。",

"The protection mechanic is a feature that allows players to use copies of the base equipment, mirrors of protection, or crafting components (for special equipment only) to add protection to each enhancing attempt. If the enhancement fails, the equipment's level is only decreased by 1, but 1 protection item is consumed. This can be a cost-effective way to reach high enhancement levels for endgame players":
"保护机制是允许玩家在每次强化尝试中使用另一件相同装备或者保护之镜，或者（仅适用于特殊装备的）制作组件来进行强化保护（俗称“垫子”）。如果强化失败，装备的等级只会降低1级，但会消耗1个保护物品。对于后期玩家来说，这是一种经济高效的方式来达到高等级的强化。",

"You gain 1% action speed bonus for each level you have above the item's recommended level":
"高于该物品推荐等级的每一个等级都会获得 1% 的行动速度加成",

"Here is a list of steps to follow when enhancing equipment":
"以下是增强装备时要遵循的步骤列表",

"Select the piece of equipment that you want to enhance":
"选择要增强的装备",

"Set the target enhancement level that you would like to stop at. Be realistic about what level you can reach with your current resources":
"理智地设置您希望停止的目标级别。",

"Decide whether or not to use protection. If you do then select the protection item and a minimum enhancement level where protection will be used. Generally, protection is more cost-effective when the item is at higher enhancement levels":
"决定是否使用保护。如果是，则选择垫子和开始使用垫子的级别",

"Click the \"Start\" button and you will continue enhancing until you reach the target level or run out of materials":
"点击“开始”按钮，您将开始强化，直到达到目标级别或耗尽材料",

"The bonus stats on enhanced equipment are a percentage of the base stats. The total bonus at each enhancement level is as follows":
"强化装备上的额外数值是基础数值的百分比。强化百分比如下所示",

"As an exception, jewelry and back slot enhancements receives 5x the normal bonus. For instance, a +1 enhancement on jewelry is a 10% bonus":
"作为例外，珠宝和披风强化获得的奖励是正常奖励的 5 倍。例如，珠宝的 +1 强化就是 10% 的加成",

"Enhancement Base Success Rate":
"强化基础成功率",

"Fighting aliens can earn you coins, tea leaves, hides, essences, ability books, gems, and special items, as well as more common resources. There are enemies of varying difficulty located in different combat areas":
"与各星球的敌人战斗可以让你获得硬币、茶叶、兽皮、精华、能力书、宝石和特殊物品，以及各种常见的资源。不同星球中有各种难度的敌人",

"Wearing equipment will boost your stats in combat. You can equip items directly from the inventory or by clicking equipment slots in the equipment tab next to the inventory":
"穿戴装备可以在战斗中提升你的属性。你可以直接从库存中装备物品，也可以通过点击位于库存旁边的装备选项卡中的装备槽来装备物品",

"Food can be consumed to recover your HP or MP. Drinks provide limited duration buffs. Upgrading your pouch allows you to carry more food and drinks into battle":
"可以食用食物来恢复您的HP或MP。饮料提供有限持续时间的增益效果。升级您的袋子允许同时使用多种食物和饮料",

"You can learn abilities and use them in combat at the cost of MP. To unlock new abilities, you must learn them from ability books. Abilities get stronger as you level them up. You gain 0.1 XP every time it's used in combat. You can also gain a large amount of XP by consuming duplicate ability books":
"你可以通过消耗魔法能量学习并在战斗中使用技能。要解锁新技能，你必须从能力书中学习它们。随着技能等级的提升，技能会变得更加强大。每次在战斗中使用技能都会获得0.1经验值。你也可以通过消耗重复的能力书来获得大量经验值。",

"When multiple abilities are available for use during combat, they will be prioritized in the same order you have set them":
"在战斗中有多个可用的技能时，它们将按照你设置的从左到右的顺序进行释放。",

"Your Intelligence level determines how many abilities you can bring with you":
"您的智力等级决定了您可以携带多少技能。",

"Both consumables and abilities have default settings for when they will be automatically used. The settings are referred to as combat triggers, and they can be modified by clicking the gear icon below before entering the battle":
"消耗品和技能都有默认设置，用于确定它们何时会自动使用。这些设置被称为触发器，可以在进入战斗之前点击下方的齿轮图标进行修改。",
"and Respawning":
"及复活",
"When defeated in combat, your character will have to wait through a respawn timer before fully recovering and resuming combat automatically":
"每当战斗中阵亡了，你的角色将等待重生计时器结束，然后才能完全恢复并自动重新开始战斗。",

"You have 7 combat skills that can be leveled up":
"您有7种可以升级的战斗技能。",

"Status Effects":"状态效果",
"There are status effects that can temporarily prevent you from taking certain actions":
"有一些状态效果可能会暂时阻止您采取某些行动。",

"Prevents using auto attacks":
"禁止使用自动攻击。",

"Prevents using abilities":
"禁止使用技能。",

"Prevents using auto attacks, abilities, and consumables":
"禁止使用自动攻击、技能和消耗品。",
"Group Combat":"组队战斗",
"You can create or join a party to battle in zones with multiple monsters. When all party members have pressed \"Ready,\" the party will automatically travel to battle. Monsters will randomly attack any of the party members, and those with a higher threat stat will be targeted more frequently. Monster drops will be divided with an equal chance among all players":
"你可以创建或加入一个队伍，一起在有多个怪物的区域战斗。当所有队员都按下“准备”后，队伍将自动前往战斗。怪物会随机攻击队伍中的任何一名成员，而威胁值较高的成员将更频繁地成为攻击目标。怪物掉落物品将均等分配给所有玩家。",

"Dungeons consists of multiple waves of higher tier elite monsters and unique dungeon bosses. They can be accessed with dungeon keys, which can be crafted after finding key fragments from bosses in regular combat zones":"地下城由多波更高级别的精英怪物和独特的地下城首领组成。可以使用地牢钥匙进入它们，地牢钥匙可以在常规战斗区域的 Boss 处找到关键碎片后制作",
"Up to five players can be in a dungeon party. Each person must have a key, which will be consumed after beating the final boss for the dungeon reward chest. If you complete a dungeon with fewer players, you will have a chance of looting an additional chest at the cost of an extra key. If the dungeon is not completed, you will keep your dungeon key":"地下城派对中最多可有五名玩家。每个人都必须有一把钥匙，击败最终头目后将消耗钥匙以获得地下城奖励宝箱。如果您以较少的玩家完成了一个地下城，您将有机会以额外的钥匙为代价掠夺一个额外的箱子。如果地牢未完成，您将保留地牢钥匙",
"Deaths in dungeons will not trigger a respawn timer. You can only be revived by a party member. If all party members are dead, the dungeon run is considered failed and you will restart at wave":"地牢中的死亡不会触发重生计时器。只有队员才能使你复活。如果所有队员都死了，则地下城运行被视为失败，您将重新开始于波数",

"You also have secondary combat stats that are affected by your skill levels, equipment, and buffs":
"您还有次要战斗数值，受您的技能等级、装备和增益效果的影响。",

"Each attack has a specific style":
"每次攻击都有特定的类型。",

"stab, slash, smash, ranged, or magic":
"刺击、斩击、锤击、远程或魔法。",

"Each attack deals a specific type of damage":
"每次攻击都造成特定类型的伤害。",

"physical, water, nature, or fire":
"物理、水、自然或火。",

"How fast you can auto-attack":
"自动攻击的速度",

"Reduces ability cooldowns":
"减少技能冷却时间",

"Increases your chance to successfully attack":
"增加攻击成功的几率",

"The maximum damage if an attack is successful. Auto-attack damage is random between 1 and the maximum damage":
"攻击成功后的最大伤害。自动攻击的伤害在1和最大伤害之间随机。",

"Critical hits always rolls maximum damage. Ranged style has passive critical chance":
"暴击总是造成最大伤害。远程战斗类型具有基础暴击几率。",

"Increases the damage you deal":
"增加所造成的伤害",

"Ignores a percentage of enemy armor or resistance when attacking":
"在攻击时忽略敌人的一部分护甲或抗性",

"Increases your chance to dodge an attack":
"增加闪避攻击的几率",

"Mitigates a percentage of physical damage":
"减免一部分物理伤害",

"Mitigates a percentage of water, nature, or fire damage":
"减免一部分水、自然或火焰伤害",

"Heals you based on the percentage of auto-attack damage you deal":
"依自动攻击造成的伤害以百分比恢复生命值",

"Leeches mana based on the percentage of auto-attack damage you deal":
"依自动攻击造成的伤害以百分比吸取法力值",

"When attacked, reflects a percentage of your armor or resistance (corresponding to the attack type) as damage back to the attacker":
"受到攻击时，依护甲/抗性（对应攻击类型）以一定%作为伤害反弹给攻击者",

"Reduces chance of being blinded, silenced, or stunned":
"降低被致盲、沉默或眩晕的几率",

"Increases chance of being targeted by monsters":
"增加被怪物作为目标的几率",

"HP/MP Regen":"HP/MP 再生",
"Recovers a percentage of your maximum HP/MP every 10 seconds":
"每10秒恢复最大生命值/法力值的一部分百分比",

"Reduces food cooldown": "减少食物冷却时间",

"Increases drink effect. Reduces duration and cooldown": "增加饮料效果。减少持续时间和冷却时间",

"Increases the drop rate of regular items. This cannot go above":
"增加普通物品的掉落率。这个值不能超过",

"Increases the drop quantity of regular items":
"增加普通物品的掉落数量",

"Combat Rare Find":
"战斗稀有发现",

"Increases the drop rate of treasure chests":
"增加宝箱的掉落率",

"This is only for display and represents your overall combat effectiveness based on the combination of combat skill levels":
"这代表目前基于战斗类型的相关技能等级的参考等级，",

Formulas:"公式",
"For those who enjoy math, here are the formulas for the secondary stats":
"对于喜欢数学的人，这里是次要战斗数值的公式",

"Attack Interval = baseInterval / (1 + (Attack":
"攻击间隔 = 基础间隔 / (1 + (攻击",
"AttackSpeedBonus":"攻击速度加成",
 "abilityHaste":"技能冷却",
    "Bonus":"加成",

"Ability Cooldown = baseCooldown":
"能力冷却 = 基础冷却时间",

"Accuracy = (10 + [Attack|Ranged|Magic":
"精准 = (10 + [攻击|远程|魔法",

"Damage = (10 + [Power|Ranged|Magic":
"伤害 = (10 + [力量|远程|魔法",

"Hit Chance = (MyAccuracy":
"命中几率 = (我的精准",

"MyAccuracy ^ 1.4 + EnemyEvasion":
"我的精准 ^ 1.4 + 敌人的闪避",

"Ranged Bonus Critical Rate = 0.3 * Hit Chance":
"远程基础暴击几率 = 0.3 * 命中几率",

"Non-Magic Evasion = (10 + Defense":
"非魔法闪避 = (10 + 防御",

"Magic Evasion = (10 + 0.75 * Defense + 0.25 * Ranged":
"魔法闪避 = (10 + 0.75 * 防御 + 0.25 * 远程",

"Armor = 0.2 * Defense + Bonus":
"护甲 = 0.2 * 防御 + 加成",

"Percent Physical Damage Taken":
"受到物理伤害百分比",

"If Armor is negative then it's":
"如果护甲是负数，那么它是",

"Resistance = 0.1 * (Defense + Magic) + Bonus":
"抗性 = 0.1 * (防御 + 魔法) + 加成",

"Percent Elemental Damage Taken":
"受到元素伤害百分比",

"If Resistance is negative then it's":
"如果抗性为负数，则是",

"Blind/Silence/Stun Chance = Base Chance":
"致盲/沉默/眩晕几率 = 基础几率",

"Targeted By Monster Chance = MyThreat":
"被怪物选中的几率 = 我的威胁值",
    "TeamTotalThreat":"队伍总威胁值",
"Combat Level = 0.2 * (Stamina + Intelligence + Defense) + 0.4 * MAX":
"战斗等级 = 0.2 * (耐力 + 智力 + 防御) + 0.4 * 各个战斗类型中的最大值",

"Attack + Power), Ranged, Magic":
"攻击 + 力量), 远程, 魔法中的最大值",
"Random Tasks":
"随机任务",
"Random Task Feature":
"随机任务介绍",
"Frequency":
"频率",
    "Variety":
"种类",
    "Capacity":
"容量",
   "Task Cooldown":
"任务冷却",
    "Lootboxes":
"宝箱",
        "Guild Features":
"工会功能",
        "Member Slots":
"成员数量",
            "Member Roles":
"职位",
    "Invited":"受邀",
    "Random Task Feature":
"随机任务介绍",
"After completing the tutorial, you will unlock this feature, which can be found under \"Tasks\" in the navigation bar. The Task Board generates random short to medium-length tasks in different skills. By completing these tasks, you can obtain rewards for your participation":
"完成教程后，你将解锁此功能，该功能可以在导航栏的“任务”下找到。任务板会生成不同类型长短不一的任务。通过完成这些任务，你可以获得参与奖励。",

"The Task Board":
"任务板",

"Tasks are assigned periodically, starting at one every 8 hours. Upgrades can reduce the interval to as low as 4 hours":
"任务定期分配，从每8小时一个开始。升级可以将间隔减少到最低4小时",

"Tasks may involve gathering/production skills or defeating monsters. The generated tasks will slightly prioritize skills in which the player has a higher level":
"任务可能涉及采集/生产技能或击败怪物。生成的任务会稍微优先考虑玩家等级较高的技能。",

"You can reroll tasks using coins or cowbells. The cost doubles (up to a limit) with each reroll":
"您可以使用硬币或牛铃重新选择任务。每次重新选择的费用会翻倍（有上限）",

"Tasks do not expire, but there's a limit of 8 task slots. The capacity can be increased through upgrades in the cowbell store":
"任务没有期限，但任务槽位有8个的限制。可以通过在牛铃商店进行升级来增加容量。",

"Completing tasks rewards you with Coins and Task Tokens. A Task Point is also granted for every Task Token rewarded from tasks":
"完成任务将奖励您硬币和任务代币。每个任务代币奖励还会获得一个任务点数",

"Accumulating 50 Task Points allows you to claim \"Purple's Gift,\" which can be opened to obtain Coins, Task Tokens, Task Crystals, and various lootboxes":"累积50个任务点可以让您领取“紫色礼物”，打开后可获得金币、任务代币、任务水晶和各种箱子",

"Task Tokens can be spent in the Task Shop for permanent upgrades or items, including":
"任务代币可以在任务商店中用于永久升级或物品，包括",

"Reduces the cooldown between tasks":
"减少任务之间的冷却时间",

"Allows blocking specific skills from being assigned as tasks. Combat blocking has to be unlocked at an additional cost":
"允许屏蔽特定技能被分配为任务。战斗屏蔽需要额外付费解锁。",

"Used for crafting or upgrading task rings with the Crafting skill. Task rings provide multiplicative action speed or damage bonuses while undertaking tasks":
"用于使用制作技能制作或升级任务戒指。任务戒指在进行任务时提供大量速度或伤害加成。",

"Large Meteorite Cache, Large Artisan's Crate, and Large Treasure Chest":
"大型陨石、大型工匠箱和大型宝箱",

"Discover guilds by navigating to the \"Guild\" feature in the navigation menu. Guilds are formed by groups of players who enjoy playing together. While guilds currently serve as primarily social hubs, upcoming expansions may introduce more group-oriented activities":
"通过导航菜单中的“公会”功能发现公会。公会由一群喜欢一起游戏的玩家组成。目前，公会主要作为社交中心，但即将到来的扩展可能会引入更多以团队为导向的活动。",

"Creating a Guild":
"创建公会",

"You can start your own guild by investing 5 million coins and choosing a unique guild name. As the guild's creator, you automatically assume the role of the leader, granting you the highest authority within the guild. Afterward, invite other players to join your guild":
"您可以通过投资5M金币并选择一个独特的公会名称来创建您自己的公会。作为公会的创建者，你会自动成为公会的会长，拥有公会内的最高权力。之后，你可以邀请其他玩家加入你的公会。",



    "You can create a guild for 5M coins. A guild currently provides the following features":
    "您可以通过花费5M金币创建自己的公会。公会目前提供以下功能",
    "Guild chat channel and notice board":
    "公会聊天频道和公告栏",
    "Guild will receive XP and level up as members gain XP in any skill at a ratio of":
    "当成员在任意技能中获得 XP 时，公会将获得 XP 并升级,经验获得依比例为",
    "member slots and 1 additional slot for every 4 guild levels":
    "个成员槽，并且增加一个槽位于每提升4个公会等级",
    "Roles can be assigned":
    "可分配的职务分别是",
    "Leader, General, Officer, Member":
    "会长,将军, 官员,成员",
    "You can also be invited to existing guilds. Use the Recruit chat channel to find a guild to join. Received invitations will be displayed below":
    "您也可以被邀请加入到现有的公会。在招募聊天频道寻找要加入的公会。收到的邀请将显示在下方",

"Joining a Guild":
"加入公会",

"You can be invited to join existing guilds. To find a guild to join, you can use the Recruit chat channel, where guilds actively seek new members. You can view your invitations on the Guild page":
"你可以被邀请加入现有的公会。要找到可以加入的公会，你可以使用招募聊天频道，在那里公会会积极寻找新成员。你可以在公会页面查看你的邀请。",


"Guilds come with several key features":
"公会具有几个关键功能",

"Guild Chat Channel":
"公会聊天频道",

"A private, self-moderated space for guild members to connect and converse":
"一个私密的、自我管理的空间，供公会成员互相联系和交流",

"Guild Notice Board":
"公会公告板",


"A persistent message board editable by the leader or generals to keep everyone informed":
"由会长或将军可编辑的持续消息板，用于通知所有人",

"As members earn experience points (XP) in various skills, the guild accumulates XP at a":
"随着成员在各种技能中获得经验点（XP），公会积累经验的比例为",

"ratio, contributing to the guild's level. Climb the leaderboard based on your guild's level and experience":
"比例，有助于提升公会的等级。排行榜基于您的公会等级和经验",

"Guilds begin with 25 member slots and gain 1 additional slot for every 4 guild levels":
"公会初始有25个成员数量，并且每提升4个公会等级就增加一个槽位",

"Guilds begin with":"公会初始有",
"member slots and gain 1 additional slot for every":"个成员槽，并且增加一个槽位于每提升",


"Guilds have a structured hierarchy with different roles and permissions. Higher rank roles automatically possess the permission of any lower rank":
"公会具有不同的角色和权限。较高等级的角色自动具有任何较低等级的权限。",

"Can pass leadership to another member":
"可以将会长转交给另一名成员",

"Has the authority to disband the guild entirely when the guild is empty":
"在公会为空时有权解散整个公会",

"Empowered to promote or demote any lower-ranking member":
"有权提升或降级任何低级别成员",

"Can edit the guild notice board":
"可以编辑公会公告板",

"Can invite new members to join the guild":
"可以邀请新成员加入公会",

"Can kick lower-ranking member out of the guild":
"可以将低级别成员踢出公会",

"Can view the guild overview":
"可以查看公会概况",

"Can view and converse in the guild chat channel":
"可以查看并在公会聊天频道中交流",

"Has no access until they accept the guild invitation":
"在接受公会邀请之前没有权限",
"Chat Commands":"聊天指令",
"w [name] [message":"w [昵称] [信息",
    "whisper another player":"私聊","view player profile":"查看玩家信息","profile [name":"profile [昵称","friend [name":"friend [昵称","block [name":"block [昵称","unblock [name":"unblock [昵称","friend [name":"friend [昵称","unfriend [name":"unfriend [昵称","House Rooms": "房子加成","add friend": "添加好友","remove friend": "删除好友","unblock player": "解除屏蔽该玩家",
    "Experience Table":"经验表",

"Dungeon":"地下城",


 //新闻
"Skilling Expansion Part":"技能扩充部分",
"Alchemy Skill":"炼金技能",


"We're excited to release the second part of the skilling expansion, introducing Celestial Tools and Skilling Outfits! After using Holy tools for such a long time, skilling specialists can finally get their hands on some upgrades. These items are not easy to acquire, but those who are dedicated (or wealthy) enough to obtain them will be rewarded with a significant boost. Dive in and take your skilling to the next level":
"我们激动地推出技能扩展的第二部分-星空工具与生产服装！在使用神圣工具这么长的时间以来，生产专精的玩家们终于又能获得进一步的装备升级了！当然，这些道具并不容易获得，但是那些足够专精（或富有）从而取得他们的人会获得显着的强化。现在加入来将你的生产专业推向新一波的高峰吧",


"Sat Nov":"星期六 11月",
"Transform your gameplay with the introduction of the new Alchemy skill, the first part of our Skilling Expansion! Alchemy introduces exciting new mechanics, allowing you to turn one item into another using Coinify, Decompose, or Transmute. Whether you're stocking up on coins, acquiring new skilling essences, breaking down equipment for their components, or chasing legendary gems like the Philosopher's Stone, Alchemy opens up a world of possibilities":
"透过引入新的【炼金】技能来改变您的游戏玩法，这是我们技能扩充的第一部分！ 炼金引入了令人兴奋的新机制，让您可以使用【点金】、【分解 】或 【重组】 将一件物品变成另外一件物品。无论您是储备金币、获取新的技能精华、分解装备以获取其组件，还是追逐魔法石等传奇宝石，【炼金】都会打开一个充满可能性的世界",
"For more details on this update, head over to the Patch Notes, and stay tuned for part 2 of the expansion in the coming month, which will introduce a new set of high-level tools and skilling outfits":
"有关此更新的更多详细内容，请参阅补丁说明，并继续关注下个月将扩充的第二部分，其中将引入一套新的高级工具和技能装备",

"Group Combat Part":"团队战斗",
"Elite Monsters and Special Abilities":"精英怪物和特殊技能",
"At long last, the group combat feature has arrived! You can now join forces with fellow adventurers, strategize together, and vanquish groups of elite enemies to claim the coveted special ability books":
"终于，团队战斗功能来了！你现在可以与其他冒险者联手，群策群力，击败一群精英敌人，赢得梦寐以求的特殊技能书。（然后被吸",
"Developer's Note":"开发者日志",
"Sorry for the extended gap since the last update. The implementation of group combat proved to be more complex than initially estimated. This release is split into 2 parts. Part 1, the current update, establishes the groundwork for the party system along with introducing elite monsters and special abilities. Part 2 will unveil dungeons where you can discover new unique drops and equipment. Stay tuned for more adventures ahead":
"很抱歉自上次更新以来间隔了这么长时间。团队战斗的实现比最初估计的要复杂得多。本次发布分为两个部分。第一个部分，即当前更新，奠定了队伍系统的基础，同时引入了精英怪物和特殊技能。第二部分将带来地下城，您可以在其中发现新的独特掉落物品和装备。敬请期待更多的冒险！                                   -------------以前的补丁不想翻译了，感兴趣自行阅读-------------",

"Are you tired of your party looking like a team of clones? Avatars are now available in the Cowbell Store. Combine them with stylish outfits to give yourself a unique look": "厌倦了你的队伍看起来像一队克隆人吗？牛铃商店现在提供头像。将它们与时尚的装束搭配，使自己拥有独特的外观",
"Dungeon chest drops are receiving a rework. Different dungeon tokens for each of the 3 dungeons are being introduced that gives you a choice over what dungeon materials to exchange for in the new Shop. From the latest Discord poll, this change has been polarizing among players who voted. Therefore, instead of replacing all material drops with tokens, we decided to proceed with a mix of material and token drops. This is balanced around allowing players to focus on one item at a time and complete it in about half the time, but it will take longer to complete multiple items": "地牢宝箱掉落物正在进行重做。每个地牢引入不同的地牢代币，使你可以选择在新商店中兑换哪些地牢材料。从最新的Discord投票来看，这一变化在投票玩家中引起了极大的争议。因此，我们决定在材料掉落中添加代币，而不是全部替换成代币。这种平衡方式允许玩家一次专注于一个物品并在大约一半的时间内完成它，但完成多个物品的时间会更长",
"Sat Jun": "星期六 六月",
"This update introduces new combat dungeons": "此更新引入了新的战斗地牢",
"Chimerical Den, Sinister Circus, and Enchanted Fortress. Gather your party of up to five players and face waves of elite monsters and unique bosses. Complete these dungeons to discover new abilities, weapons, and equipment, including new back slot items! Embrace the new challenges and claim your rewards": "奇幻洞穴、邪恶马戏团和秘法要塞。组建最多五人的队伍，面对一波波的精英怪物和独特的首领。完成这些地牢以发现新的技能、武器和装备，包括新的背部装备！迎接新的挑战并领取你的奖励",


//补丁
"UI": "用户界面",
Rebalance :"再平衡",
Hotfix:"热补丁",
"Features and Content": "功能和内容",
"Major Patch": "重大补丁",
"QOL": "生活质量改进",
"Medium Patch": "中型补丁",
"Minor Patch":"小型更新",
"Rebalancing":"平衡性调整",


"Celestial Tools and Skilling Outfits": "星空工具和专业服装",
"Level 90 Skilling Tools and Outfits": "90级专业工具与装备",
"Skilling Rare Materials": "专业稀有材料",
"Butter Of Proficiency, Thread Of Expertise, and Branch of Insight. These materials can be found as rare drops from high-level material gathering and production actions. They can also be obtained by transmuting Holy, Arcane, Umbral, and Radiant equipment": "专业稀有材料：精通之油、专精之线、明悟之枝。这些材料除了可以透过高级材料采集和生产活动中发现。也可以透过重组神圣、奥术、暗影和光辉装备来获得",
"Celestial Tools":  "星空工具",
"New skilling tools that can be cheesesmithed using the rare materials and skilling essences": "星空工具：新的专业工具，可以使用稀有的材料和专业精华进行奶酪锻造",
"Skilling Outfits": "专业服装",
"New skilling body and legs equipment that can be tailored using the rare materials and skilling essences. These are designed to match the avatar outfits for each skill in the Cowbell Store": "新的专业上衣和腿部下装，可以使用稀有的材料和专业精华定制。这些服装旨在与牛铃商店中各专业对应的头像服装相匹配",
"Increased buyable task slots by 10. The new maximum number of task slots is now": "可购买的任务槽增加了 10 个，新的最大任务槽数现在为",
"Lowered the sell value of skilling essences from 100 to 50. The previous 10x bulk alchemy change made skilling essences too effective for coinifying due to their low item level": "将专业精华的售价从 100 降低至 50。先前 10 倍批量炼金的变更使得专业精华由于物品等级较低而无法进行点金",
"Added rare drop information to the item dictionary and improved the layout": "将稀有掉落物信息添加到物品词典中，并优化了排版布局",
"Added catalyst information to Alchemy actions in the queued actions list": "佇列队列中正在等待的炼金工作现在增加了使用的催化剂信息",
"Combined enhancing target and protection start level into a single line in queued actions list": "现在强化目标与保护起始等级在同一行了",
"Redesigned Holy item icons": "重新设计神圣物品的图示",
"Renamed Red Chef's Hat to Red Culinary Hat to avoid confusion with the new Chef's Outfit": "将红色厨师帽(英文名)重新命名，以避免与新的厨师服装混淆",
"Fixed a number of minor UI issues": "修复了一些 UI 的问题",


"Sun Dec": "星期日 12月",
"Christmas": "圣诞节",
"Christmas chat icon, avatar, and avatar outfits available in Cowbell Store until the first update in 2025. You can continue to use them after the event ends": "圣诞节新增聊天图示、头像和头像服装在牛铃商店中可用，贩售活动将持续至 2025年第一次更新。即便活动结束后仍可继续使用",
"Alchemizing raw materials and essences will now be done in bulk of 2, 5, or 10 instead of 1. Output and coin costs are multiplied by the same ratio": "炼金的原料和精华现在将批量完成 2、5 或 10 个而不是 1 个。",
"Catalysts will now only be consumed on success": "催化剂现在只会在成功时消耗",
"Significantly increased Enhancing Essence output from decomposing higher-tier equipment": "分解强化过的装备时所产出的强化精华产量将显着增加",
"Chance to receive Prime Catalyst from transmuting lower tier catalysts decreased from 5% to 4%. This is to ensure the cost of using Prime Catalyst is not lowered by too much due to the consume on success change": "透过转换较低级的催化剂获得主要催化剂的几率从5%减少到4%。这是为了确保使用主要催化剂的成本不会因为成功变更的消耗而降低太多",
"Increased minimum transmute cost per item from 10 to 50 coins": "每件物品的最低兑换成本从 10 个金币增加到 50 个金币",
"Standardized appearance of text inputs": "文字输入的标准化外观",


"Tue Nov": "星期二 11月",
"Added new chat icons": "添加了新的聊天图示",
"Sunstone and Philosopher's Stone": "【太阳石】和【贤者之石】",
"Transmute success rate decreased from 90% to": "转换成功率从90%降到",
"Transmute success rate decreased from 84% to": "转换成功率从84%降到",
"Transmute success rate decreased from 85% to": "转换成功率从85%降到",
"Added a stop button to the current action tab for Alchemy and Enhancing": "在【炼金】和【强化】的【当前操作】标籤中新增了停止按钮",
"Last selected action tab for Alchemy will be saved for when you revisit the page": "当您重新造访该页面时，将储存最后选择的炼金操作标籤",
"Consumable slots should no longer display unusable slots as usable": "消耗品插槽不再将不可用的插槽显示为可用",
"Alchemy with a set action limit should now execute the correct number of actions, accounting for efficiency": "在有设置行动限制的情况下，【炼金】现在应该执行正确数量的行动，並同时考虑到效率",
"Equipment stats will be correctly updated when a loadout is used in group combat": "当在团体战斗中使用配装时，装备统计数据将及时的更新",
"This was a visual bug only": "这仅是一个视觉上的错误",
"The remove button for Enhancing item selection should now function correctly": "用于【强化】项目选择的删除按钮现在可以正常工作了",
"Item linking from current actions for Alchemy and Enhancing should now work as intended": "当前针对炼金和强化的物品链接现在应该能按预期工作",
"Current actions for Alchemy and Enhancing will now display correctly, even with delay in server response": "即使服务器回应有延迟，【炼金】和【强化】里的【当前操作】现在也将正确显示",


"Alchemy allows you to transform items into other items using the actions Coinify, Decompose, or Transmute": "炼金可让您使用 【点金】、【分解】或 【重组】将物品转换为其他物品",
"Coinify lets you convert items into 500% of the item's sell price": "【点金】可让您将商品转换为商品售价的500%",
"Decompose lets you break down items into their crafting materials or skilling essences": "【分解】可让您将物品分解为其制作材料或技能精华",
"Transmute lets you change items into other related items or rare uniques, such as the Philosopher's Stone": "【重组】可让您将物品转换为其他相关物品或稀有的独特物品，例如贤者之石",
"Each alchemy action has varying success rates that can be boosted by catalysts and tea": "每一种炼金的操作都有不同的成功率，可以透过催化剂和茶来提高",
"Unique items": "独特物品",
"Found from transmuting gems": "透过转换宝石中发现",
"Found from transmuting various rare items and equipment": "透过转换各种稀有物品和装备发现",
"Found from transmuting high-level food": "透过转换高级食物后发现",
"Found from transmuting high-level drinks": "透过转化高级饮料后发现",
"Found from transmuting lower-tier catalysts": "透过转化低级催化剂发现",
"For more information, check the Alchemy section in the Game Guide": "欲了解更多内容，请查看游戏指南中的炼金技能部分",
"Skilling Essences": "技能精华",
"Skilling essences are a new type of resource": "技能精华是一种新型资源",
"They can be passively obtained at a moderate rate from each non-combat skill": "它们可以从每个非战斗技能中以中等速率被动获得",
"They can be quickly obtained by decomposing various items in Alchemy": "它们可以透过炼金技能中分解各种物品来快速获得",
"They are now part of the recipe for brewing skill-level teas": "它们现在是冲泡技能茶的配方的一部分",
"They can be used to craft various alchemy catalysts with the Crafting skill": "它们可以透过制作技能来制作各种炼金催化剂",
"They will also serve a purpose in Skilling Expansion Part 2 for new Skilling equipment": "它们还将在技能扩充的第 2 部分中用于新的技能装备",
"Added new ultra tea and coffee that use crushed moonstone and sunstone": "添加了使用碎月光石和碎太阳石的究级茶和咖啡",
"Skilling-level tea now provides an extra efficiency bonus on top of the level bonus": "技能茶现在除了等级奖励之外还提供额外的效率奖励",
"New catalytic tea for boosting alchemy success rates": "新出的催化茶可提高炼金成功率",
"New Equipment": "新装备",
"Ring/Earrings of Critical Strike": "''爆击''戒指/耳环",
"crafted with Sunstones": "用太阳石制作",
"Philosopher's Ring/Earrings/Necklace": "''贤者''戒指/耳环/项鍊",
"crafted with the Philosopher's Stone": "用贤者之石制作",
"Gluttonous Pouch and Guzzling Pouch":"贪食之袋和暴饮之袋",
"buff food and drinks, respectively": "分别增益食物和饮料",
"Alembic": "蒸馏器",
"Gained Alchemy Efficiency and Alchemy level requirement. They will be automatically unequiped and placed in your inventory. They can be worn again once the level requirements are met":
"现在多了炼金效率和炼金等级要求。它们将自动取消装备并放入您的库存中。达到等级要求后即可再次配戴",
"Ring/Earrings of Threat": "''威胁''戒指/耳环",
"Reworked into Ring/Earrings of Essence Find": "重新打造为''精华发现''戒指/耳环",
"Ring/Earrings of Armor/Resistance": "''护甲''戒指/耳环跟''抗性''戒指/耳环",
"Increased Armor/Resistance from 5 to": "护甲/抗性从 5 增加到",
"Physical/Elemental Thorn increased from 9% to 10%. Resistances increased from 25 to 30. Threat increased from 75 to": "护盾/元素荆棘从 9% 增加到 10%。抗性从 25 增加到 30。威胁值从 75 增加到",
"Other Bulwarks": "其他盾牌",
"Threat increased by about": "威胁值增加约",
"Increased Cursed Bow ranged damage from 125% to": "咒怨之弓的远程伤害从 125% 增加到",
"Royal Nature Robes": "''皇家自然''长袍/衬裙",
"Adjusted to match other Royal Robes' Elemental Amplify and Cast Speed. Added Heal Amplify": "为配合其他皇家系列的元素增幅和施法速度并新增治疗强化",
"Reworked as a 0 cooldown ability": "施法的冷却时间改为 0",
"Damage ratio increased from 120% to": "伤害比例从 120% 增加到",
"Evasion debuff decreased from 20% to": "闪避減益从 20% 降低至",
"Cooldown decreased from 20s to 18s": "冷却时间从 20 秒减少至 18 秒",
"Damage ratio increased from 160% to": "伤害比例从 160% 增加到",
"Elemental Thorn increased from 20% to": "元素荆棘从 20% 增加到",
"Reduced coin drop rate from monsters from 100% to": "怪物的金币掉落率从 100% 降至",
"Added gem drops to dungeon chests": "为地牢宝箱添加了宝石掉落",
"T95 equipment sell value increased": "T95装备售价增加",
"Pouches and dungeon keys sell value lowered to account for Coinify": "考虑到【点金】，袋子和地牢钥匙的售价有所减少",
"Reorganized header display and added secondary information for Alchemy and Enhancing actions": "调整了【炼金】和【强化】的界面,并添加了当前操作的讯息",
"Updated Enhancing UI for better clarity and usability": "更新了强化界面的UI，提高了清晰度和实用性",
"Save inventory category collapse state and last selected action tabs separately per character": "每个角色当前的行动以及库存的折叠状态会被个别保存",
"Renamed the Enhancing building from Laboratory to Observatory and repurposed Observatory for Alchemy": "强化的房子从实验室更名为天文台，实验室将被用于炼金的房子",
"Support clicking links in chat with a confirmation that can be disabled in settings": "支援点击聊天中的连结并进行确认，可以在设置中停用该确认",
"Added dates to chat timestamps for whispers": "为频道中的私聊时间添加了日期显示",
"Fixed a bug where some custom name colors in chat disappeared temporarily on mobile": "修正了聊天中某些自订名称颜色在行动装置上暂时消失的错误",
"Removed seasonal Halloween cosmetics": "移除了季节性商品 :【万圣节】的装饰",
"Level bonuses will now consider partial levels from drinks": "等级奖励现在将考虑饮料中的部分等级",


"Wed Oct": "星期三 10月",
"Halloween": "万圣节",
"Halloween chat icon, avatar, and avatar outfits available in Cowbell Store for 3 weeks. You can continue to use them after the event ends": "牛铃商店新增万圣节聊天图示、头像和头像装扮，为期 3 周。即便活动结束后仍可继续使用",
"Fixed visual bug with loadout where combat triggers, equipment stats, or equipment buffs sometimes doesn't correctly sync after equipping loadout": "修复了配裝栏中的视觉错误，其中战斗触发器、装备数据或装备增益有时在装备配裝后未能正确同步",


"Mon Sep": "星期一 9月",
"Weaken changed from reducing enemy damage to reducing enemy accuracy. This will allow the effect to increase defense XP instead of reducing it": "特效从减少敌人伤害改为降低敌人准确度，解决因特效导致防御经验减少的问题",
"Backend changes to test Steam integration (work in progress": "对后台进行更改,以测试steam整合（正在进行中",


"Sun Sep": "星期日 9月",
"Griffin Bulwark": "狮鹫盾",
"Cheesesmithed with Griffin Talon from Chimerical Den": "用来自奇幻洞穴的狮鹫之爪打造而成",
"new item": "新物品",
"Arcane Reflect": "奥术反射",
  "Acquired from Enchanted Fortress": "从秘法要塞获得",
"Experience gained from healing increased by": "治疗获得的经验增加了",
"Dungeon keys are now split into entry keys and chest keys. Entry keys are crafted using the same resources from the original key recipe, along with some coins. Chest keys require only the key fragments from the original recipe. All existing dungeon keys are converted into chest keys, with a refund of the difference in resource cost per key. Unopened dungeon chests will receive a free chest key per chest. This change allows players to run a larger number of dungeons more easily with a lower entry cost": "地牢钥匙现在分为入口钥匙和宝箱钥匙。入口钥匙使用原始钥匙配方中的相同资源以及一些金币制作。宝箱钥匙仅需要原配方中的钥匙碎片。所有现有的地牢钥匙将转换为宝箱钥匙，并按每把钥匙退还资源差价。未开启的地牢宝箱将每个宝箱获得一把免费的宝箱钥匙。此更改使玩家更容易以更低的进入成本进行更多的地牢探索",
"Keys and key fragments are placed into separate item categories in both the inventory and marketplace": "钥匙和钥匙碎片在库存和市场中被分配到不同的物品类别",
"Added an option for loadout to ignore warnings about missing items": "添加了一个选项，允许装备忽略关于缺失物品的警告",


"Thu Sep":"星期四 9月",
"Loadouts": "配装",
"Loadouts allow you to save your current equipment, consumables, and abilities to be automatically loaded later with actions": "配装允许你保存当前的装备、消耗品和技能，稍后可通过操作自动加载",
"Loadouts can be tied to a single skill or \"All Skills.\" Selecting \"All Skills\" will only save equipment": "配装可以绑定到单一专业技能或“所有专业技能”。选择“所有专业技能”时只会保存装备",
"Setting a loadout as default will auto-select the loadout when choosing any action in the skill(s) the loadout is associated with": "将某个配装设置为默认时，在选择与该配装关联的专业技能的任何操作时，会自动选择该方案",
"Each character gets 2 free loadout slots, which can be upgraded in the Cowbell Store": "每个角色有2个免费的配装槽位，可以在牛铃商店中升级",
"Condense key count messages in dungeons into a single message": "将地牢中的钥匙数量信息压缩成一条消息",


"Fri Aug": "星期五 8月",
"Added a third character slot for players who want to play an additional character. You are still limited to one Standard character":
"新增第三个角色槽位，供希望玩额外角色的玩家使用。但标准角色仍受限于1个。",
"Enabled parties to change combat zones": "允许队伍更改战斗区域",
"Increased the friend and block list limits from 50 to":
"好友和黑名单列表的上限从50增加到",
"Expanded the guild notice maximum length from 800 to 1500 characters":
"公会公告的最大长度从800个字符扩展到1500个字符",
"Rebalancing": "平衡性重做",
"significantly increased smash accuracy and damage. Added threat level":
"显著提高了钝击精准和伤害，并增加了威胁等级。",
"Increased Nature's Veil drop rate at Luna Empress from 0.25% to":
"将月神之蝶的自然菌幕(群体)掉落率从0.25%提高到",
"Decreased low-tier key fragment drop rate by":
"低级钥匙的掉落率降低了",
"UI": "用户界面",
"The number of dungeon keys each party member has will now be displayed in chat at the start of each dungeon run":
"每个队员拥有的地牢钥匙数量将会在每次地牢运行开始时在聊天中显示",
"Remaining consumables will be displayed under the Stats tab when inspecting other players in battle":
"在战斗中检查其他玩家时，剩余消耗品将会在'统计'标签下显示",
"Equipment in profiles will always be visible to party members":
"个人资料中的装备始终对队伍成员可见",
"Updated icons for staffs and royal robes to improve differentiation between elements":
"更新了法杖和皇家长袍的图标，提高元素之间的区分度",
"Implemented some accessibility improvements for screen readers":
"实施了一些屏幕阅读器的可访问性改进",
"Updated rules regarding the use of English-only to be limited to General chat":
"更新了关于使用英语的规则，常规频道仅限使用英语，其他频道不限",
"Added an experimental AI-based automod":
"添加了一个实验性的基于AI的自动审查系统",
"Implemented Kongregate integration in preparation for release on the platform":
"实施了Kongregate平台的集成，为在该平台上的发布做准备",


"Avatars, Dungeon Tokens, and More": "头像、地牢代币等",
"Thu Jul": "星期四 七月",
"Features and Content": "功能和内容",
"Avatars and Outfits": "头像和装扮",
"Avatars and outfits have been added to the Cowbell Store. They will appear in your profile, party, and group combat": "头像和装扮已添加到牛铃商店。它们将出现在你的个人资料、队伍和群体战斗中",
"Shop": "商店",
"Located in the navigation bar under your skills": "位于导航栏——战斗技能下面",
"The General Shop sells level 1 weapons and tools for a small amount of coins": "普通商店出售1级武器和工具，价格为少量金币",
"The Dungeon Shop sells essences, dungeon materials, and back-slot equipment for dungeon tokens": "地牢商店出售精华、地牢材料和背部装备，价格为地牢代币",
"Dungeons will now drop a mix of dungeon tokens and rare materials": "地牢现在将掉落混合的地牢代币和稀有材料",
"Parties can optionally be private. They can also be linked into chat for inviting other players": "队伍可以选择设为私人队伍，并且可以链接到聊天中邀请其他玩家",
"Guild member limit increased from 15 + 0.2 * GuildLevel to 25 + 0.25 * GuildLevel": "公会成员上限从15 + 0.2 * 公会等级增加到25 + 0.25 * 公会等级",
"Equipped abilities now display under the Equipment tab when viewing player profiles": "在查看玩家资料时，已装备的技能现在显示在装备选项卡下",
"Task Rings have been transformed into Task Badge which now go into the new trinket equipment slot": "任务戒指已转变为任务徽章，现在放入新的饰品装备槽",
    "Different dungeon back slot items can be used as enhancing protection for each other": "不同地牢披风现在可以互为强化保护",
"Equipment slots have been reorganized": "装备槽已重新布局",
"An Overview tab has been added to profiles, displaying avatar, character age, and other information": "个人资料中增加了一个概览选项卡，显示头像、角色年龄等信息",
"You can now view and change consumables and abilities on the My Party tab in the Combat page": "现在可以在战斗页面的“我的队伍”选项卡中查看和更改消耗品和技能",
"Party roles are color-coded so they are easier to distinguish between": "队伍角色有颜色编码，以便更容易区分",


"combat drop rate increased from 5% to": "战斗掉落率从5%增加到",
"ability haste decreased from 10 to": "技能急速从10减少到",
"Griffin Tunic/Chaps": "狮鹫紧身衣/护腿",
"melee accuracy increased from 8%/6% to": "近战准确度从8%/6%增加到",
"healing amplify increased from 20% to": "治疗增幅从20%增加到",
"auto attack damage increased from 0% to": "自动攻击伤害从0%增加到",
"ability haste increased from 4 to": "技能急速从4增加到",
"ranged damage increased from 120% to": "远程伤害从120%增加到",
"elemental penetration increased from 0 to 10%, magic damage decreased from 6% to 4%. Recipe now include 1 Watchful Relic": "元素穿透从0增加到10%，魔法伤害从6%减少到4%。配方现在包括1个警戒圣物",
"armor penetration increased from 0 to 10%, melee accuracy decreased from 40% to 25%, melee damage increased from 15% to 20%. Recipe now include 2 Gobo Defenders": "护甲穿透从0增加到10%，近战准确度从40%减少到25%，近战伤害从15%增加到20%。配方现在包括2个哥布林防御者",
"healing increased from 40 + 25% magic damage to 40 + 30% magic damage": "治疗量从40 + 25%魔法伤害增加到40 + 30%魔法伤害",
"healing decreased from 30 + 25% magic damage to 30 + 20% magic damage": "治疗量从30 + 25%魔法伤害减少到30 + 20%魔法伤害",
"speed buff increase from 3% to": "速度增益从3%增加到",
"Taunt and Provoke": "嘲讽和挑衅",
"cooldown decrease from 65s to 60s. Duration increase from 60s to 65s": "冷却时间从65秒减少到60秒。持续时间从60秒增加到65秒",
"previously backwards due to bug": "之前由于错误导致反向",
"Penetrating Strike and Penetrating Shot": "穿透打击和穿透射击",
"mana cost set to": "法力消耗设定为",
"previously incorrectly set to": "之前设定错误为",
"Swiftness Coffee and Channeling Coffee": "迅捷咖啡和吟唱咖啡",
"Speed buff increased from 10% to": "速度增益从10%增加到",
"magic level decreased by 20, Fireball level increased by": "魔法等级减少20，火球术等级增加",
"elemental resistances increased by": "元素抗性增加",
"ranged level decreased by 20, Precision level decreased by 10, magic evasion increased by": "远程等级减少20，精确等级减少10，魔法闪避增加",
"Bug Fix": "错误修复",
"Fixed a rare bug in group combat that caused battle ending logic to repeat multiple times and spawn extra invisible monsters": "修复了一个罕见的组队战斗错误，该错误导致战斗结束逻辑重复多次并生成额外的隐形怪物",
"Correctly handle a rare error when using the task shop that could crash server": "正确处理使用任务商店时可能导致服务器崩溃的罕见错误",
"Correctly save auto-kick option in parties": "正确保存队伍中的自动踢人选项",



    "Melee and ranged damage are considerably lower than magic. Melee and ranged weapons have been moderately buffed to result in an overall increase of 5-7% in damage":"近战和远程伤害相较魔法有点低了。现在对近战和远程武器进行适度增强，总体伤害增加了5-7%。",
    "Reduced attack interval on crossbows from 4s to 3.6s and on bows from 3.5s to 3.2s":"弩的攻击间隔从4秒减少到3.6秒，弓的攻击间隔从3.5秒减少到3.2秒。",
    "Increased damage bonus on melee weapons (except bulwarks) by":"近战武器（盾牌除外）的伤害加成增加了",
    "Increased drop sources of Quick Aid and Rejuvenate":"增加了快速治疗和群体治疗的技能书掉落来源。",
    "Added Rejuvenate to Luna Moths (Normal":"在月神之蝶（普通）中添加了群体治疗技能书的掉落。",
    "Added Quick Aid to Novice Sorcerers (Elite) and Infernal Imps (Normal":"在新手巫师（精英）和地狱小鬼（普通）中添加了快速治疗技能书的掉落。",
    "Other":"其他",
    "Added chat icons":"添加了聊天图标。",
    "Bamboo, Golden Marketplace, Golden Biceps":"竹子，黄金市场，黄金二头肌                                                       -------------以前的补丁不想翻译了，感兴趣自行阅读-------------",

"Group Combat Part": "团队战斗部分",

"Dungeons": "地下城",
"New combat dungeons": "新的战斗地下城",
"Chimerical Den, Sinister Circus, and Enchanted Fortress": "奇幻洞穴、邪恶马戏团和秘法要塞",
"Dungeons consist of multiple waves of higher tier elite monsters as well as unique bosses": "地下城由多波高等级精英怪物以及独特的首领组成",
"You can enter with parties of up to five players, each required to have a key. Failing or leaving the dungeon will not consume the key": "最多可与五名玩家组队进入，每人需要一把钥匙。失败或离开地下城不会消耗钥匙",
"Dungeon keys are crafted from key fragments, which are dropped by bosses in regular combat zones. Elite bosses have a much higher chance to drop key fragments": "地下城钥匙由钥匙碎片制作，碎片由常规战斗区的首领掉落。精英首领掉落钥匙碎片的几率更高",
"You will not automatically respawn after dying in a dungeon. You can only be revived by an ally. If all party members are dead, the dungeon will restart at wave": "在地下城中死亡后不会自动复活。只能由队友复活。如果所有队员都死亡，地下城将从波数重置",
"New abilities and items": "新技能和物品",
"abilities, 2 melee weapons, 2 ranged weapons, and many other pieces of equipment or materials that can be looted from dungeon chests": "个技能、2件近战武器、2件远程武器以及许多其他可从地下城宝箱中获取的装备或材料",
"View drop rates by clicking the item dictionary option on the chests that appear under each dungeon": "通过点击每个地下城下出现的宝箱上的物品词典选项查看掉落率",
"New back slot": "新的背部装备栏",
"untradable capes/quiver that can be found from dungeon chests. Back slot items also have a 5x enhancement bonus, the same as jewelry": "种不可交易的斗篷/箭袋可从地下城宝箱中获得。背部装备也有与珠宝相同的5倍强化加成",
"New earrings of threat and ring of threat can be crafted with star fragment and amber and increases your base threat stat": "新的威胁耳环和威胁戒指可以用星光碎片和琥珀制作，增加你的基础威胁属性",
"Legacy ironcow can now party with regular ironcow": "传统铁牛现在可以与常规铁牛组队",
"Party auto-kicking idle members who are not ready is now an optional setting": "自动踢出未准备的闲置成员现在是一个可选设置",
"Rebalancing": "平衡性重做",
"Decreased elite zone combat drop rate buff to match that of the experience buff. This is due to key fragments being a new high-value drop that primarily come from elite bosses": "降低精英区战斗掉落率增益，以匹配经验增益。这是因为钥匙碎片作为新的高价值掉落物主要来自精英首领",
"Adjusted all magic staffs to have 3.5s attack interval but with -50% auto attack damage. This allows abilities to be used more frequently between auto attacks": "调整了所有魔杖的攻击间隔为3.5秒，但自动攻击伤害减少50%。这允许在自动攻击之间更频繁地使用技能。",
"Increase Water Strike and Fireball damage from 55% to 60%. Decrease level bonus from 0.55% to": "将水击和火球的伤害从55%提高到60%。将等级加成从0.55%降低到",

"Added 4% ranged damage to Sighted Bracers": "为瞄准护腕增加了4%远程伤害",
"Decreased water amplify on Marine Tunic from 30% to 25% and on Marine Chaps from 24% to": "降低了海洋束腰衣的水增幅从30%到25%，以及海洋护腿的水增幅从24%到",
"Increased threat buff on taunt from 200% to 250% and on provoke from 400% to": "增加了嘲讽的威胁增益从200%到250%，以及挑衅的威胁增益从400%到",
"Increased accuracy buff on Precision from 30% to": "增加了精确的准确性增益从30%到",
"UI": "用户界面",
"Loot container drop rates are now part of the item dictionary": "战利品容器掉落率现在是物品词典的一部分",
"Renamed the ability Pierce to Impale to avoid confusion with the new piercing effect": "将技能“Pierce”重命名为“Impale”以避免与新的贯穿效果混淆",
"Added shine to golden chat icons that did not have it previously": "为以前没有闪光效果的金色聊天图标添加了闪光",


"Slightly reduced Rabid Rabbit damage": "略微减少了疯魔兔的伤害",
"Decreased Dodocamel Plume drop rate from 20% to 10% (This was a math error I made; they are supposed to require an average of 60 chests to craft": "将渡驼之羽的掉落率从20%降低到10%（这是我犯的数学错误；它们平均需要60个宝箱才能制作",
"Decreased drop rate of full items (excluding capes) from dungeon chests by half": "将地牢宝箱中完整物品的掉落率减少一半（不包括斗篷）",
"Added 2% chance to get back a dungeon key from dungeon chests": "增加了2%的几率从地牢宝箱中找回地牢钥匙",
"Bug Fix": "BUG修复",
"Removed dungeon bosses from being possible task monsters. If you already have one, it should still work, but the \"Go\" button is broken": "将地牢首领从可能的任务怪物中移除。如果你已经有一个，它仍然可以使用，但\"前往\"按钮是坏的",

"Prevented some players from getting stuck in a party after server updates": "防止了一些玩家在服务器更新后卡在队伍中的问题",

"Current Assets": "流动资产",
"Networth": "净资产",
"Price settings": "价格设置",
"Consumable Prices": "消耗品价格",
"Ask (SO)": "收购订单价格（左边）",
"Bid (BO)": "采购订单价格（右边）",
"Trigger": "触发条件",
"Start Simulation":"开始模拟",

};

let translates = {};

for (let trans of [
    tranCommon,
    tranSkill,
    transEquip,
    tranItemCate,
    tranItemCurrencies,
    tranItemResources,
    tranItemConsumable,
    tranItemBook,
    tranItemEquipment,
    tranItemTool,
    tranItemKey,
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
            text,
        });
    },
    doTask: async function () {
        let task = null;
        while ((task = this.tasks.pop())) {
            task.node.parentNode.setAttribute("script_translatedfrom", task.node[task.attr]);
            task.node[task.attr] = task.text;
        }
    },
};

function TransSubTextNode(node) {
    if (node.childNodes.length > 0) {
        for (let subnode of node.childNodes) {
            if (subnode.placeholder) {
                translatePlaceholder(subnode);
            }
            if (subnode.nodeName === "#text") {
                let text = subnode.textContent;
                let cnText = cnItem(text, subnode);
                cnText !== text && transTaskMgr.addTask(subnode, "textContent", cnText);
            } else if (subnode.nodeName !== "SCRIPT" && subnode.nodeName !== "STYLE" && subnode.nodeName !== "TEXTAREA") {
                if (!subnode.childNodes || subnode.childNodes.length == 0) {
                    let text = subnode.innerText;
                    let cnText = cnItem(text, subnode);
                    cnText !== text && transTaskMgr.addTask(subnode, "innerText", cnText);
                } else {
                    TransSubTextNode(subnode);
                }
            }
        }
    }
}

var cnItem = function (text, node) {
    if (typeof text != "string") return text;

    // 排除不需要翻译的
    for (const exclude of excludes) {
        if (exclude.toLowerCase() === text.toLocaleLowerCase()) {
            return text;
        }
    }

    // 排除不需要翻译的(使用正则)
    for (const excludeReg of excludeRegs) {
        if (excludeReg.test(text)) {
            return text;
        }
    }

    // 排除不需要翻译的(使用css选择器)
    for (const excludeSelector of excludeSelectors) {
        if ((node.nodeName !== "#text" && node.matches(excludeSelector)) || (node.parentNode && node.parentNode.matches(excludeSelector))) {
            return text;
        }
    }

    // 消除后面空格
    if (/^(.+?)(\s+)$/.test(text)) {
        let res = /^(.+?)(\s+)$/.exec(text);
        return cnItem(res[1], node) + res[2];
    }

    // 消除前面空格
    if (/^(\s+)(.+)$/.test(text)) {
        let res = /^(\s+)(.+)$/.exec(text);
        return res[1] + cnItem(res[2], node);
    }

    if(!node.parentNode) { // 修复Loadout页面导致脚本crash的问题
        return text;
    }

    // 炼金特例
    if(node?.parentNode?.parentNode?.classList.contains("SkillActionDetail_notes__2je2F") && !node.parentNode.querySelector("svg")) { // node 是那两行文字节点之一
        const firstLineTextNode = node.parentNode.childNodes[0];
        const secondLineTextNode = node.parentNode.childNodes[2];

        if (node === firstLineTextNode && /^Uses (\d+) items$/.test(firstLineTextNode.textContent)) {
            return "每次操作";
        } else if (node === secondLineTextNode && node.textContent === "per action" && /^Uses (\d+) items$/.test(firstLineTextNode.textContent)) {
            const res = /^Uses (\d+) items$/.exec(firstLineTextNode.textContent);
            return "消耗 " + res[1] + " 个物品";
        } else {
            console.error("炼金特例 错误");
            return text;
        }
    }


    // 翻译装备技能
    if (node.parentNode.matches('.EquipmentStatsText_uniqueStat__2xvqX')){
        //console.log(`翻译装备技能：${text}`);
        // Curse: On hit, increases enemy's damage taken by 1% for 15s, stacking up to 10 times.
        if (/^Curse: On hit, increases enemy's damage taken by 1% for 15s, stacking up to 10 times.?$/.test(text)) {
            let res = /^Curse: On hit, increases enemy's damage taken by 1% for 15s, stacking up to 10 times.?$/.exec(text);
            return `灾厄箭矢：每次命中敌人时，使其受到的伤害增加1%，持续15秒，最多叠加10次`;
        }
        // Pierce: On successful auto-attack, 25% chance to auto-attack next enemy. Can chain multiple times.
        if (/^Pierce: On successful auto-attack, 25% chance to auto-attack next enemy. Can chain multiple times.?$/.test(text)) {
            let res = /^Pierce:On successful auto-attack, 25% chance to auto-attack next enemy. Can chain multiple times.?$/.exec(text);
            return `连锁箭矢：在成功自动攻击后，有25%的几率自动攻击下一个敌人，并且可以连续触发多次`;
        }
        // Parry: 10% chance to parry enemy's attack, avoiding damage and retaliating with an instant auto attack.
        if (/^Parry: 10% chance to parry enemy's attack, avoiding damage and retaliating with an instant auto attack.?$/.test(text)) {
            let res = /^Parry: chance to parry enemy's attack, avoiding damage and retaliating with an instant auto attack.?$/.exec(text);
            return `王权反击：10%几率格挡敌人的攻击，免疫本次伤害并立即自动攻击一次`;
        }
        // Weaken: When attacked by enemy, reduce enemy's accuracy by 2% for 15s, stacking up to 5 times.
        if (/^Weaken: When attacked by enemy, reduce enemy's accuracy by 2% for 15s, stacking up to 5 times.?$/.test(text)) {
            let res = /^Weaken: When attacked by enemy, reduce enemy's accuracy by 2% for 15s, stacking up to 5 times.?$/.exec(text);
            return `噩梦缠绕：受到敌人攻击时，降低敌人2%命中率，持续15秒，最多叠加5次`;
        }
        // Parry: Curse: On hit, increases enemy's damage taken by 2% for 15s, stacking up to 5 times.
        if (/^Curse: On hit, increases enemy's damage taken by 2% for 15s, stacking up to 5 times.?$/.test(text)) {
            let res = /^Curse: On hit, increases enemy's damage taken by 2% for 15s, stacking up to 5 times.?$/.exec(text);
            return `厄运诅咒：命中时，使敌人受到的伤害增加2%，持续15秒，最多叠加5次`;
        }
         // Mayhem: Upon missing an auto-attack, 80% chance to auto-attack next enemy. Can chain multiple times.
        if (/^Mayhem: Upon missing an auto-attack, 80% chance to auto-attack next enemy. Can chain multiple times.?$/.test(text)) {
            let res = /^Mayhem: Upon missing an auto-attack, 75% chance to auto-attack next enemy. Can chain multiple times.?$/.exec(text);
            return `失准狂潮：在自动攻击未命中时，有80%的几率自动攻击下一个敌人，并且可以连续触发多次`;
        }
        console.error(`无法匹配装备技能：${text}`);
        return text;
    }
     // 职位英文到中文的映射
const titleMap = {
  'Member': '成员',
  'Leader': '会长',
  'General': '将军',
  'Officer': '官员'
};

if (node.parentNode.closest('.SharableProfile_overviewTab__W4dCV')){
    // 检查不同的职位前缀
    let titles = ['Member', 'Leader', 'General', 'Officer'];
    let originalText = text.trim(); // 确保text变量没有前后空格

    for (let i = 0; i < titles.length; i++) {
        let title = titles[i];
        let titleWithOf = title + ' of'; // 构建 "xxx of" 字符串
        let index = originalText.indexOf(titleWithOf); // 查找职位前缀的位置

        if (index !== -1) { // 如果找到了职位前缀
            let titleText = originalText.substring(index + titleWithOf.length).trim(); // 截取职位前缀后面的文本，并去除空格
            let translatedTitle = titleMap[title]; // 获取对应的中文翻译
            return `${titleText} ${translatedTitle}`; // 返回翻译后的文本
        }
    }
}
    // 翻译栏位特例
if (node.parentNode.closest(".GuildPanel_membersTable__1NwIX")){
        if (text.toLowerCase() === "general") {
            return `将军`;
        }
    }

// 翻译栏位特例
    if (node.parentNode.matches('.ItemSelector_label__22ds9')){
        if (text.toLowerCase() === "back") {
            return `背部`;
        }
    }
        if (node.parentNode.matches('.SharableProfile_emptySlot__W0KiH')){
        if (text.toLowerCase() === "back") {
            return `背部`;
        }
    }
    // 装备Tooltips部位特例
    if (text === "Type: Back") {
        return `部位：背部`;
    }
    //特殊处理技能效果
    if (
        ((node.nodeName !== "#text" && (node.matches('[class^="Ability_abilityDetail"] *') || node.matches('[class^="ItemTooltipText_abilityDetail"] *'))) ||
            (node.parentNode && (node.parentNode.matches('[class^="Ability_abilityDetail"] *') || node.parentNode.matches('[class^="ItemTooltipText_abilityDetail"] *')))) &&
        text.startsWith("Effect: ")
    ) {
        text = text.substring(8);
        if (text.includes(". ")) {
            let newText = "";
            for (const part of text.split(". ")) {
                newText += translateAbilityEffect(part, node) + ". ";
            }
            return "效果: " + newText;
        }
        return "效果: " + translateAbilityEffect(text, node);
    }

    //特殊处理触发器详细信息
    if ((node.nodeName !== "#text" && node.matches('[class^="CombatTriggersSetting_detail"] *')) || (node.parentNode && node.parentNode.matches('[class^="CombatTriggersSetting_detail"] *'))) {
        //My Wisdom Coffee Is Inactive
        if (/^My (.+) Is (.+)$/.test(text)) {
            let res = /^My (.+) Is (.+)$/.exec(text);
            return "我的 " + cnItem(res[1], node) + " 是 " + cnItem(res[2], node);
        }
    }

    // "Set as the default loadout for All Skills": "将此配装设为【所有专业】的默认方案",
    if (/^(Set as the default loadout for) (.+)$/.test(text)) {
        let res = /^(Set as the default loadout for) (.+)$/.exec(text);
        return "将此配装设为【" + cnItem(res[2], node) + "】的默认方案";
    }

    // You have reached level 32 Enhancing
    if (/^You have reached level (\d+) (.+)$/.test(text)) {
        let res = /^You have reached level (\d+) (.+)$/.exec(text);
        return "你已到达  " + res[1] + " 级 " + cnItem(res[2], node);
    }

    // Currently 350 players in game
    if (/^Currently (\d+) players in game!$/.test(text)) {
        let res = /^Currently (\d+) players in game!$/.exec(text);
        return "目前有 " + cnItem(res[1], node) + " 名玩家在游戏中 !!!";
    }

    // You have 1 unread task
    if (/^You have (\d+) unread tasks?$/.test(text)) {
        let res = /^You have (\d+) unread tasks?$/.exec(text);
        return "你有 " + cnItem(res[1], node) + " 个未读任务";
    }

    // like "test (Elite)"
    if (/^(.+)(\s*)\((.+)\)$/.test(text)) {
        let res = /^(.+)(\s*)\((.+)\)$/.exec(text);
        return cnItem(res[1], node) + res[2] + "(" + cnItem(res[3], node) + ")";
    }

    // 打怪任务翻译
    if (/^(Defeat)( [\S ]+)$/.test(text)) {
        let res = /^(Defeat)( [\S ]+)$/.exec(text);
        return cnItem(res[1], node) + cnItem(res[2], node);
    }

    // "Fight unlimited times"
    // "Gather up to 1 times"
    // "Fight up to 10 times"
    // "Produce up to 10 times"
    // "Repeat unlimited times"
    // "Repeat up to 10 times"
    if (/^(Gather|Produce|Fight|Repeat|Enhance)(?: up to)? (\d+|unlimited) times$/.test(text)) {
        let res = /^(Gather|Produce|Fight|Repeat|Enhance)(?: up to)? (\d+|unlimited) times$/.exec(text);
        return cnItem(res[1], node) + " " + cnItem(res[2], node) + " 次";
    }

    // like "Add Queue #2"
    if (/^Add Queue #(\d+)$/.test(text)) {
        let res = /^Add Queue #(\d+)$/.exec(text);
        return "加入队列 #" + res[1];
    }


    // 你离线了 xxx时间
    // 你已离线至当前上限 xxx时间
    if (/^(You were offline for|You made progress for)(.+)$/.test(text)) {
        let res = /^(You were offline for|You made progress for)(.+)$/.exec(text);
        return cnItem(res[1], node) + res[2];
    }

    // "Hi wilsonhe1, Welcome to Milky Way": "嗨，wilsonhe1，欢迎来到奶牛银河",
    if (/^Hi (.+), Welcome to Milky Way$/.test(text)) {
        let res = /^Hi (.+), Welcome to Milky Way$/.exec(text);
        return "嗨，" + res[1] + "，欢迎来到奶牛银河";
    }
    // "Ok wilsonhe1, I have to go now. It's time for my second lunch, and I have four stomachs to fill. Now go explore the Milky Way": "好的，wilsonhe1，我现在要走了。是我第二顿午餐的时间了，我有四个胃要填饱。现在去探索奶牛银河吧",
    if (/^Ok (.+), I have to go now. It's time for my second lunch, and I have four stomachs to fill. Now go explore the Milky Way$/.test(text)) {
        let res = /^Ok (.+), I have to go now. It's time for my second lunch, and I have four stomachs to fill. Now go explore the Milky Way$/.exec(text);
        return "好的，" + res[1] + "，我现在要走了。是我第二顿午餐的时间了，我有四个胃要填饱。现在去探索奶牛银河吧";
    }



    // 购买物品
    // Bought 1 Lumber-----cnItem是汉化函数要帶著走, 1是數量 , 2是名稱 , 1跟2要看定義決定非絕對
    // Bought 1 Lumber For 20000 Coins
    if (/^Bought (\d+) ([A-Za-z\s\-]+)(?: \+(\d+))?(?: for (\d+) Coins)?$/.test(text)) {
        let res = /^Bought (\d+) ([A-Za-z\s\-]+)(?: \+(\d+))?(?: for (\d+) Coins)?$/.exec(text);

        // 购买数量
        let quantity = parseInt(res[1], 10);
        // 物品名称
        let itemName = res[2];
        // 强化等级（可选）
        let enhancement = res[3];
        // 总价（可选）
        let price = res[4];

    // 判断是否为强化物品
    if (enhancement) {
        if (price) {
            // 强化物品 + 金额
            return `购买 ${quantity} 个${cnItem(itemName, node)} +支付 ${price} 硬币`;
            } else {
            // 强化物品，无金额
            return `购买 ${quantity} 个${cnItem(itemName, node)}`;
            }
        } else {
        if (price) {
            // 非强化物品 + 金额
            let unitPrice = parseInt(price, 10) / quantity; // 单价计算
            return `购买 ${cnItem(itemName, node)} 【 ${quantity} 】 支付 ${price} 金币`;
            } else {
            // 非强化物品，无金额
            return `购买 ${cnItem(itemName, node)} 【 ${quantity} 】`;
            }
        }
    }


    // 卖出物品
    // Sold 1 Lumber For 20000 Coins
    if (/^Sold (\d+) ([A-Za-z\s\-]+)(?: \+(\d+))? for (\d+) Coins$/.test(text)) {
        let res = /^Sold (\d+) ([A-Za-z\s\-]+)(?: \+(\d+))? for (\d+) Coins$/.exec(text);

    // 检查是否有加号（强化等级）
    if (res[3]) {
        // 强化物品
        return `卖出 ${res[1]} 个${cnItem(res[2], node)} +${res[3]} 获得 ${res[4]} 硬币`;
        } else {
        // 非强化物品
        return `卖出 ${cnItem(res[2], node)} 【 ${res[1]} 】获得 ${res[4]} 硬币`;
       }
    }


    // Level 3 Log Shed constructed
    if (/^Level ([0-9]*) ([A-Za-z\s]*) constructed$/.test(text)) {
        let res = /^Level ([0-9]*) ([A-Za-z\s]*) constructed$/.exec(text);
        return cnItem(res[2], node)+"【 等级"+res[1]+" 】已建成";
    }

    // Sell For 20000 Coins
    if (/^Sell For (\S+) Coins$/.test(text)) {
        let res = /^Sell For (\S+) Coins$/.exec(text);
        return "卖出 " + res[1] + " 硬币";
    }

    // like "Milking - Cow (99)"
    if (/^(.+)(\s+\(\d+\))$/.test(text)) {
        let res = /^(.+)(\s+\(\d+\))$/.exec(text);
        return cnItem(res[1], node) + res[2];
    }

    // like "Milking - Cow"
    if (/^(.+)( - )(.+)$/.test(text)) {
        let res = /^(.+)( - )(.+)$/.exec(text);
        return cnItem(res[1], node) + res[2] + cnItem(res[3], node);
    }

    // like "Sugar x6: 9/8" MWITools专用,汉化原料
    if (/^(.+)(\sx[0-9]*[kMB]?:\s)(.+)$/.test(text)) {
        let res = /^(.+)(\sx[0-9]*[kMB]?:\s)(.+)$/.exec(text);
        return cnItem(res[1], node) + res[2] + res[3];
    }

    // like "players: user"
    if (/^(.+)(:\s*)(.+)$/.test(text)) {
        let res = /^(.+)(:\s*)(.+)$/.exec(text);
        return cnItem(res[1], node) + res[2] + cnItem(res[3], node);
    }

    // like "Not built → Level 1"
    if (/^(.+)(\s+→\s+)(.+)$/.test(text)) {
        let res = /^(.+)(\s+→\s+)(.+)$/.exec(text);
        return cnItem(res[1], node) + res[2] + cnItem(res[3], node);
    }

    // 消除后面的非字母
    if (/^(.+?)([^a-zA-Z]+)$/.test(text)) {
        let res = /^(.+?)([^a-zA-Z]+)$/.exec(text);
        return cnItem(res[1], node) + res[2];
    }

    // 消除前面的非字母
    if (/^([^a-zA-Z]+)(.+)$/.test(text)) {
        let res = /^([^a-zA-Z]+)(.+)$/.exec(text);
        return res[1] + cnItem(res[2], node);
    }

    // 调试翻译时可以打开此处打印
    // console.log(text);

    return baseTranslate(text);
};

function translateAbilityEffect(text, node) {
    if (text.endsWith(".")) {
        text = text.slice(0, -1);
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
    let reg = /^attacks (enemy|all enemies) for ([\d.]+(?: HP|MP|%|s)?) \+ ([\d.]+(?: HP|MP|%|s)?) ([a-zA-Z ]+) as ([a-zA-Z ]+)$/;
    if (reg.test(text)) {
        let res = reg.exec(text);
        return "对" + cnItem(res[1], node) + "造成 " + res[2] + " + " + res[3] + " " + cnItem(res[4], node) + "作为" + cnItem(res[5], node);
    }
    // "attacks enemy for 30 HP + 110% stab damage as physical damage. Decreases target's armor by -20% for 10s": "对敌人造成30点生命值 + 110% 刺伤伤害的物理伤害。使目标的护甲降低 -20%，持续10秒",
    // "attacks enemy for 20 HP + 120% magic damage as water damage. Decreases target's attack speed by -25% for 8s": "对敌人造成20点生命值 + 120% 魔法伤害的水属性伤害。使目标的攻击速度降低 -25%，持续8秒",
    // "attacks all enemies for 30 HP + 100% magic damage as water damage. Decreases target's evasion by -20% for 9s": "对所有敌人造成30点生命值 + 100% 魔法伤害的水属性伤害。使目标的闪避率降低 -20%，持续9秒",
    // "attacks all enemies for 20 HP + 80% magic damage as nature damage. Decreases target's armor by -12 for 12s. Decreases target's water resistance by -15 for 12s. Decreases target's nature resistance by -20 for 12s. Decreases target's fire resistance by -15 for 12s": "对所有敌人造成20点生命值 + 80% 魔法伤害的自然属性伤害。使目标的护甲降低 -12，持续12秒。使目标的水属性抗性降低 -15，持续12秒。使目标的自然属性抗性降低 -20，持续12秒。使目标的火属性抗性降低 -15，持续12秒",
    reg = /^Decreases target's ([a-zA-Z ]+) by (-[\d.]+?(?: HP|MP|%|s)?) for ([\d.]+(?: HP|MP|%|s)?)$/;
    if (reg.test(text)) {
        let res = reg.exec(text);
        return "使目标的" + cnItem(res[1], node) + "降低 " + res[2] + " 持续 " + res[3];
    }
    // "attacks enemy for 30 HP + 100% smash damage as physical damage and 70% chance to stun for 3s": "对敌人造成30点生命值 + 100% 粉碎伤害的物理伤害，并有70%的几率眩晕3秒",
    // "attacks enemy for 30 HP + 100% ranged damage as physical damage and 60% chance to silence for 5s": "对敌人造成30点生命值 + 100% 远程伤害的物理伤害，并有60%的几率沉默5秒",
    // "attacks enemy for 10 HP + 90% magic damage as nature damage and 40% chance to stun for 3s": "对敌人造成10点生命值 + 90% 魔法伤害的自然属性伤害，并有40%的几率眩晕3秒",
    // "attacks all enemies for 30 HP + 100% magic damage as nature damage and 60% chance to blind for 5s": "对所有敌人造成30点生命值 + 100% 魔法伤害的自然属性伤害，并有60%的几率致盲5秒",
    reg =
        /^attacks (enemy|all enemies) for ([\d.]+(?: HP|MP|%|s)?) \+ ([\d.]+(?: HP|MP|%|s)?) ([a-zA-Z ]+) as ([a-zA-Z ]+) and ([\d.]+(?: HP|MP|%|s)?) chance to ([a-zA-Z ]+) for ([\d.]+(?: HP|MP|%|s)?)$/;
    if (reg.test(text)) {
        let res = reg.exec(text);
        return (
            "对" +
            cnItem(res[1], node) +
            "造成 " +
            res[2] +
            " + " +
            res[3] +
            " " +
            cnItem(res[4], node) +
            "作为" +
            cnItem(res[5], node) +
            "并有 " +
            res[6] +
            " 的几率" +
            cnItem(res[7], node) +
            " " +
            res[8]
        );
    }



    // "attacks enemy for 30 HP + 100% stab damage as nature damage and 100% chance to pierce": "对所有敌人造成30点生命值 + 100% 魔法伤害的自然属性伤害，并有60%的几率致盲5秒",
    reg =
        /^attacks (enemy|all enemies) for ([\d.]+(?: HP|MP|%|s)?) \+ ([\d.]+(?: HP|MP|%|s)?) ([a-zA-Z ]+) as ([a-zA-Z ]+) and ([\d.]+(?: HP|MP|%|s)?) chance to pierce$/;
    if (reg.test(text)) {
        let res = reg.exec(text);
        return (
            "对" +
            cnItem(res[1], node) +
            "造成 " +
            res[2] +
            " + " +
            res[3] +
            " " +
            cnItem(res[4], node) +
            "作为" +
            cnItem(res[5], node) +
            "并有 " +
            res[6] +
            " 的几率贯穿下一个敌人"
        );
    }


    // "attacks enemy for 20 HP + 65% slash damage as physical damage and bleeds for 100% dealt damage over 15s": "对敌人造成20点生命值 + 65% 斩击伤害作为物理伤害，并在15秒内造成等同于所造成伤害100%的出血伤害",
    // "attacks all enemies for 20 HP + 60% magic damage as fire damage and burns for 100% dealt damage over 10s": "对所有敌人造成20点生命值 + 60% 魔法伤害作为火焰伤害，并在10秒内造成等同于所造成伤害100%的燃烧伤害",
    reg =
        /^attacks (enemy|all enemies) for ([\d.]+(?: HP|MP|%|s)?) \+ ([\d.]+(?: HP|MP|%|s)?) ([a-zA-Z ]+) as ([a-zA-Z ]+) and ([a-zA-Z ]+) for ([\d.]+(?: HP|MP|%|s)?) dealt damage over ([\d.]+(?: HP|MP|%|s)?)$/;
    if (reg.test(text)) {
        let res = reg.exec(text);
        return (
            "对" +
            cnItem(res[1], node) +
            "造成 " +
            res[2] +
            " + " +
            res[3] +
            " " +
            cnItem(res[4], node) +
            "作为" +
            cnItem(res[5], node) +
            "并在 " +
            res[8] +
            " 内造成等同于所造成伤害 " +
            res[7] +
            " 的" +
            cnItem(res[6], node) +
            "伤害"
        );
    }
    // "attacks enemy with 200% total accuracy for 30 HP + 100% ranged damage as physical damage": "对敌人以200%总命中率造成30点生命值 + 100%远程伤害作为物理伤害",
    reg = /^attacks (enemy|all enemies) with ([\d.]+(?: HP|MP|%|s)?) ([a-zA-Z ]+) for ([\d.]+(?: HP|MP|%|s)?) \+ ([\d.]+(?: HP|MP|%|s)?) ([a-zA-Z ]+) as ([a-zA-Z ]+)$/;
    if (reg.test(text)) {
        let res = reg.exec(text);
        return "对" + cnItem(res[1], node) + "以 " + res[2] + " " + cnItem(res[3], node) + "造成 " + res[4] + " + " + res[5] + " " + cnItem(res[6], node) + "作为" + cnItem(res[7], node);
    }
    // "heals self for 20 HP + 30% magic damage": "对自己恢复20点生命值 + 30% 魔法伤害",
    // "heals self for 30 HP + 45% magic damage": "对自己恢复30点生命值 + 45% 魔法伤害",
    // "heals lowest HP ally for 40 HP + 30% magic damage": "对生命值最低的队友恢复40点生命值 + 30% 魔法伤害",
    // "heals all allies for 30 HP + 20% magic damage": "对所有队友恢复30点生命值 + 20% 魔法伤害",
    reg = /^heals (self|all allies|lowest HP ally) for ([\d.]+(?: HP|MP|%|s)?) \+ ([\d.]+(?: HP|MP|%|s)?) ([a-zA-Z ]+)$/;
    if (reg.test(text)) {
        let res = reg.exec(text);
        return "对" + cnItem(res[1], node) + "恢复 " + res[2] + " + " + res[3] + " " + cnItem(res[4], node);
    }
    // "Increases all allies critical rate by 3% for 120s": "增加所有盟友的暴击率3%，持续120秒",
    // "Increases all allies nature amplify by 6% for 120s. Increases all allies healing amplify by 6% for 120s. Increases all allies nature resistance by 4 for 120s": "增加所有盟友的自然属性强化6%，持续120秒。增加所有盟友的治疗强化6%，持续120秒。增加所有盟友的自然属性抗性4，持续120秒",
    // "Increases all allies attack speed by 3% for 120s. Increases all allies cast speed by 3% for 120s": "增加所有盟友的攻击速度3%，持续120秒。增加所有盟友的施法速度3%，持续120秒",
    // "Increases all allies physical amplify by 6% for 120s. Increases all allies armor by 4 for 120s": "增加所有盟友的物理强化6%，持续120秒。增加所有盟友的护甲4，持续120秒",
    // "Increases all allies water amplify by 8% for 120s. Increases all allies water resistance by 4 for 120s": "增加所有盟友的水属性强化8%，持续120秒。增加所有盟友的水属性抗性4，持续120秒",
    // "Increases all allies fire amplify by 8% for 120s. Increases all allies fire resistance by 4 for 120s": "增加所有盟友的火属性强化8%，持续120秒。增加所有盟友的火属性抗性4，持续120秒",
    reg = /^Increases all allies ([a-zA-Z ]+) by ([\d.]+(?: HP|MP|%|s)?) for ([\d.]+(?: HP|MP|%|s)?)$/;
    if (reg.test(text)) {
        let res = reg.exec(text);
        return "增加所有盟友的" + cnItem(res[1], node) + " " + res[2] + " 持续 " + res[3];
    }
    // "Increases threat by 250% for 60s": "增加250%的威胁等级，持续60秒",
    // "Increases threat by 500% for 60s": "增加500%的威胁等级，持续60秒",
    // "Increases evasion by 20% for 20s": "增加20%的闪避，持续20秒",
    // "Increases accuracy by 30% for 20s": "增加30%的精准，持续20秒",
    // "Increases physical amplify by 18% for 20s": "增加18%的物理强化，持续20秒",
    // "Increases attack speed by 20% for 20s": "增加20%的攻击速度，持续20秒",
    // "Increases physical thorns by 20% for 20s": "增加20%的护盾荆棘（物理），持续20秒",
    // "Increases elemental thorns by 20% for 20s": "增加20%的元素荆棘（魔法），持续20秒",
    // "Increases life steal by 8% for 20s": "增加8%的生命偷取，持续20秒",
    // "Increases water amplify by 40% for 20s. Increases nature amplify by 40% for 20s. Increases fire amplify by 40% for 20s": "增加40%的水属性强化，持续20秒。增加40%的自然属性强化，持续20秒。增加40%的火属性强化，持续20秒",
    // "Increases damage by 30% for 12s. Increases attack speed by 30% for 12s. Increases cast speed by 30% for 12s": "增加30%的伤害，持续12秒。增加30%的攻击速度，持续12秒。增加30%的施法速度，持续12秒",
    // "Increases armor by 700 for 12s. Increases water resistance by 700 for 12s. Increases nature resistance by 700 for 12s. Increases fire resistance by 700 for 12s. Increases tenacity by 700 for 12s": "增加700的护甲，持续12秒。增加700的水属性抗性，持续12秒。增加700的自然属性抗性，持续12秒。增加700的火属性抗性，持续12秒。增加700的坚韧，持续12秒",
    reg = /^Increases ([a-zA-Z ]+) by ([\d.]+(?: HP|MP|%|s)?) for ([\d.]+(?: HP|MP|%|s)?)$/;
    if (reg.test(text)) {
        let res = reg.exec(text);
        return "增加" + cnItem(res[1], node) + " " + res[2] + " 持续 " + res[3];
    }
    // "Increases armor by 20% + 20 for 20s. Increases water resistance by 20% + 20 for 20s. Increases nature resistance by 20% + 20 for 20s. Increases fire resistance by 20% + 20 for 20s": "增加20% + 20的护甲，持续20秒。增加20% + 20的水属性抗性，持续20秒。增加20% + 20的自然属性抗性，持续20秒。增加20% + 20的火属性抗性，持续20秒",
    reg = /^Increases ([a-zA-Z ]+) by ([\d.]+(?: HP|MP|%|s)?) \+ ([\d.]+(?: HP|MP|%|s)?) for ([\d.]+(?: HP|MP|%|s)?)$/;
    if (reg.test(text)) {
        let res = reg.exec(text);
        return "增加" + cnItem(res[1], node) + " " + res[2] + " + " + res[3] + " 持续 " + res[4];
    }
    // "revives and heals a dead ally for 100 HP + 40% magic damage": "复活并为一个死亡的盟友恢复100点生命值 + 40% 魔法伤害",
    reg = /^revives and heals a dead ally for ([\d.]+(?: HP|MP|%|s)?) \+ ([\d.]+(?: HP|MP|%|s)?) ([a-zA-Z ]+)$/;
    if (reg.test(text)) {
        let res = reg.exec(text);
        return "复活并为一个死亡的盟友恢复" + res[1]+" + " + res[2] +"魔法伤害";
    }
    // "costs 30% of current HP": "消耗当前生命值的30%",
    reg = /^costs ([\d.]+(?: HP|MP|%|s)?) of current HP$/;
    if (reg.test(text)) {
        let res = reg.exec(text);
        return "耗当前生命值的 " + res[1];
    }

    return baseTranslate(text);
}

var unSet = new Set();

function baseTranslate(text) {
    if (translates[text.toLowerCase()]) {
        return translates[text.toLowerCase()];
    } else if (text.toLowerCase().endsWith("es") && translates[text.toLowerCase().slice(0, -2)]) {
        return translates[text.toLowerCase().slice(0, -2)];
    } else if (text.toLowerCase().endsWith("s") && translates[text.toLowerCase().slice(0, -1)]) {
        return translates[text.toLowerCase().slice(0, -1)];
    } else {
        unSet.add(text);
        return text;
    }
}

!(function () {
    let observer_config = {
        attributes: false,
        characterData: true,
        childList: true,
        subtree: true,
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
                if (mutation.target.placeholder) {
                    translatePlaceholder(mutation.target);
                }
            } else if (mutation.addedNodes.length > 0) {
                for (let node of mutation.addedNodes) {
                    if (node.placeholder) {
                        translatePlaceholder(node);
                    }
                    if (node.nodeName === "#text") {
                        node.textContent = cnItem(node.textContent, node);
                    } else if (node.nodeName !== "SCRIPT" && node.nodeName !== "STYLE" && node.nodeName !== "TEXTAREA") {
                        if (!node.childNodes || node.childNodes.length == 0) {
                            if (node.innerText) node.innerText = cnItem(node.innerText, node);
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
        //window.afterTransTime = performance.now();
        //console.log("捕获到页面变化并执行汉化，耗时" + (afterTransTime - beforeTransTime) + "毫秒");
    });
    observer.observe(targetNode, observer_config);
})();

let reverseTranslates = {};

for (let trans of [tranItemCurrencies, tranItemResources, tranItemConsumable, tranItemBook, tranItemEquipment, tranItemTool, tranItemBox]) {
    for (let key in trans) {
        reverseTranslates[trans[key]] = key.toLowerCase();
    }
}

function translatePlaceholder(node) {
    if (node.placeholder === "Item Filter") {
        node.placeholder = "搜索";
    }
}
