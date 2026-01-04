// ==UserScript==
// @name         牛牛战斗模拟汉化
// @namespace    http://tampermonkey.net/
// @version      2025.4.1
// @description  Milky way idle已全文汉化，此后只提供战斗模拟汉化，汉化问题请游戏内私聊7bagtea
// @license       七包茶
// @match        https://milkywayidle.wiki.gg/*
// @match        https://mwisim.github.io/
// @match        https://mwisim.github.io/test/
// @match        https://sockosxptracker.pages.dev/
// @match        https://amvoidguy.github.io/MWICombatSimulatorTest/dist/index.html
// @match        https://shykai.github.io/MWICombatSimulatorTest/dist/
// @match        https://shykai.github.io/mwisim.github.io/
// @match        https://luyh7.github.io/milkonomy/*
// @match        https://doh-nuts.github.io/Enhancelator/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=milkywayidle.com
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/494308/%E7%89%9B%E7%89%9B%E6%88%98%E6%96%97%E6%A8%A1%E6%8B%9F%E6%B1%89%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/494308/%E7%89%9B%E7%89%9B%E6%88%98%E6%96%97%E6%A8%A1%E6%8B%9F%E6%B1%89%E5%8C%96.meta.js
// ==/UserScript==


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
     // 排除排行榜工会名字
     '[class^="LeaderboardPanel_guildName"]',
     // 排除个人信息工会名字
     '[class^="CharacterName_characterName__2FqyZ CharacterName_xlarge__1K-fn"]',
     // 排除战斗中的玩家名
     '[class^="BattlePanel_playersArea"] [class^="CombatUnit_name"]',
     // 选择队伍中的队伍名
     '[class^="FindParty_partyName"]',
     // 队伍中的队伍名
     '[class^="Party_partyName"]',
     ];

 //2.1 通用页面
 const tranCommon = {
     Back: "背部",
     level: "等级",
     Gather: "收集",
     Produce: "生产",
     Fight: "战斗",
     times: "次数",
     Task: "任务",
     Reward: "奖励",
     Go: "前往",
     Open: "打开",
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
     No: "否",
     Yes: "是",
     Stop: "停止",
     "in combat": "战斗中",
     unlimited: "无限制",
     "Opened Loot": "打开战利品",
     "You found": "你找到",
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
     "Character name not found": "未找到角色名称",
     "Any Role": "任意角色",
     "Lv. Req": "Lv ≥",
     Slot: "位置",
     "Add Slot": "添加位置",
     "Party disbanded": "队伍已解散",
     Save: "保存",
     "Edit Party": "编辑队伍",
     Ready: "准备",
     Defeat: "击败",
     Start: "开始",
     disabled: "已禁用",
     off: "关",
     gain: "获得",
     Weapon: "武器",
     Offhand: "副手",
     Presets:"预设套装",
     Physical: "物理",
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
     foraging: "采摘",
     woodcutting: "伐木",
     cheesesmithing: "奶酪锻造",
     crafting: "制作",
     tailoring: "裁缝",
     cooking: "烹饪",
     brewing: "冲泡",
     Alchemy: "炼金",
     enhancing: "强化",
     combat: "战斗",
     stamina: "耐力",
     intelligence: "智力",
     attack: "攻击",
     power: "力量",
     defense: "防御",
     ranged: "远程",
     magic: "魔法",

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
     Coin: "金币",
     "Basic currency": "基础货币",
     "Task Token": "任务代币",
     "Chimerical Token": "奇幻代币",
     "Chimerical Tokens": "奇幻代币",
     "Sinister Token": "邪恶代币",
     "Sinister Tokens": "邪恶代币",
     "Enchanted Token": "秘法代币",
     "Enchanted Tokens": "秘法代币",
     Cowbell: "牛铃",

     };

     //2.4.2 资源(商店顺序)
     const tranItemResources = {

     Milk: "牛奶",
     "Verdant Milk": "翠绿牛奶",
     "Azure Milk": "蔚蓝牛奶",
     "Burble Milk": "深紫牛奶",
     "Crimson Milk": "深红牛奶",
     "Rainbow Milk": "彩虹牛奶",
     "Holy Milk": "神圣牛奶",

     Cheese: "奶酪",
     "Verdant Cheese": "翠绿奶酪",
     "Azure Cheese": "蔚蓝奶酪",
     "Burble Cheese": "深紫奶酪",
     "Crimson Cheese": "深红奶酪",
     "Rainbow Cheese": "彩虹奶酪",
     "Holy Cheese": "神圣奶酪",
     Log: "普通原木",
     "Birch Log": "白桦原木",
     "Cedar Log": "雪松原木",
     "Purpleheart Log": "紫心原木",
     "Ginkgo Log": "银杏原木",
     "Redwood Log": "红杉原木",
     "Arcane Log": "神秘原木",
     Lumber: "普通木板",
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
     Cocoon: "蚕茧",
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
     "Catalyst Of Decomposition": "分解催化剂",
     "Catalyst Of Transmutation": "重组催化剂",
     "Prime Catalyst": "主要催化剂",

     "Gluttonous Energy": "贪食能量",
     "Guzzling Energy": "暴饮能量",
     "Snake Fang": "蛇牙",
     "Shoebill Feather": "大嘴鹳羽毛",
     "Snail Shell": "蜗牛壳",
     "Crab Pincer": "蟹钳",
     "Turtle Shell": "乌龟壳",
     "Marine Scale": "海洋鳞片",
     "Treant Bark": "树皮",
     "Centaur Hoof": "半人马蹄",
     "Luna Wing": "月神翼",
     "Gobo Rag": "哥布林破布",
     "Goggles": "护目镜",
     "Magnifying Glass": "放大镜",

     "Eye Of The Watcher": "观察者之眼",
     "Icy Cloth": "冰霜碎布",
     "Flaming Cloth": "烈焰碎布",
     "Sorcerer's Sole": "魔法师的鞋底",
     "Chrono Sphere": "时空球",
     "Frost Sphere": "冰霜球",
     "Panda Fluff": "熊猫绒",
     "Black Bear Fluff": "黑熊绒",
     "Grizzly Bear Fluff": "灰熊绒",
     "Polar Bear Fluff": "北极熊绒",
     "Red Panda Fluff": "小熊猫绒",
     Magnet: "磁铁",
     "Stalactite Shard": "钟乳石碎片",
     "Living Granite": "花岗岩",
     "Colossus Core": "巨像核心",
     "Vampire Fang": "吸血鬼之牙",
     "Werewolf Claw": "狼人之爪",
     "Revenant Anima": "亡者之魂",
     "Soul Fragment": "灵魂碎片",
     "Infernal Ember": "地狱余烬",
     "Demonic Core": "恶魔核心",
     "Dodocamel Plume": "渡驼之羽",
     "Manticore Sting": "蝎狮之刺",
     "Griffin Leather": "狮鹫之皮",
     "Jackalope Antler": "鹿角兔之角",
     "Acrobat's Ribbon": "杂技师之带",
     "Griffin Talon": "狮鹫之爪",
     "Magician's Cloth": "魔术师碎布",
     "Chaotic Chain": "混沌锁链",
     "Cursed Ball": "诅咒之球",
     "Knight's Ingot": "骑士之锭",
     "Bishop's Scroll": "主教卷轴",
     "Royal Cloth": "皇家碎布",
     "Regal Jewel": "君王宝石",
     "Sundering Jewel": "裂空宝石",

     "Butter of Proficiency":"精通之油",
     "Thread Of Expertise":"专精之线",
     "Branch of Insight":"明悟之枝",
     "Chimerical Essence": "奇幻精华",
     "Sinister Essence": "邪恶精华",
     "Enchanted Essence": "秘法精华",

     "Milking Essence": "挤奶精华",
     "Foraging Essence": "采摘精华",
     "Woodcutting Essence": "伐木精华",
     "Cheesesmithing Essence": "奶酪锻造精华",

     "Crafting Essence": "制作精华",
     "Tailoring Essence": "裁缝精华",
     "Cooking Essence": "烹饪精华",
     "Brewing Essence": "冲泡精华",
     "Alchemy Essence": "炼金精华",
     "Enhancing Essence": "强化精华",
     "Swamp Essence": "沼泽精华",
     "Aqua Essence": "海洋精华",
     "Jungle Essence": "丛林精华",
     "Gobo Essence": "哥布林精华",
     Eyessence: "眼球精华",
     "Sorcerer Essence": "法师精华",
     "Bear Essence": "熊熊精华",
     "Golem Essence": "魔像精华",
     "Twilight Essence": "暮光精华",
     "Abyssal Essence": "地狱精华",
     "Task Crystal": "任务水晶",
     "Star Fragment": "星光碎片",

 //石头
     Pearl: "珍珠",
     Amber: "琥珀",
     Garnet: "石榴石",
     Jade: "翡翠",
     Amethyst: "紫水晶",
     Moonstone: "月亮石",
     "Crushed Pearl": "珍珠碎片",
     "Crushed Amber": "琥珀碎片",
     "Crushed Garnet": "石榴石碎片",
     "Crushed Jade": "翡翠碎片",
     "Crushed Amethyst": "紫水晶碎片",
     "Crushed Moonstone": "月亮石碎片",
     "Sunstone": "太阳石",
     "Crushed Sunstone": "太阳石碎片",
     "Philosopher's Stone": "贤者之石",
     "Crushed Philosopher's Stone": "贤者之石碎片",
     "Shard Of Protection": "保护碎片",
     "Mirror Of Protection": "保护之镜",

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
  //--------2.4.4 技能书
 let tranItemBook = {
     //------------------ 矛类
     Poke: "破胆之刺",
     Impale: "透骨之刺",
     Puncture: "破甲之刺",
     "Penetrating Strike": "贯心之刺(贯穿)",

     //------------------ 剑类
     Scratch: "爪影斩",
     Cleave: "分裂斩(群体)",
     Maim: "血刃斩",
    "Crippling Slash": "致残斩",

     //------------------ 锤类
     Smack: "重碾",
     Sweep: "重扫(群体)",
     "Stunning Blow": "重锤",

     //------------------ 弓弩类
     "Quick Shot": "快速射击",
     "Aqua Arrow": "流水箭",
     "Flame Arrow": "烈焰箭",
     "Rain Of Arrows": "箭雨（群体）",
     "Silencing Shot": "沉默之箭",
     "Steady Shot": "稳定射击",
     "Pestilent Shot": "疫病射击",
     "Penetrating Shot": "贯穿射击(贯穿)",

     //------------------ 水系魔法
     "Water Strike": "流水冲击",
     "Ice Spear": "冰枪术",
     "Frost Surge": "冰霜爆裂(群体)",
     "Mana Spring": "法力喷泉(群体)",


     //------------------ 自然系魔法
     Entangle: "缠绕",
     "Toxic Pollen": "剧毒粉尘(群体)",
     "Nature's Veil": "自然菌幕(群体)",

     //------------------ 火系魔法
     Fireball: "火球",
     "Flame Blast": "熔岩爆裂(群体)",
     Firestorm: "火焰风暴(群体)",
     "Smoke Burst": "爆尘灭影",


     //------------------ 治疗类
     "Minor Heal": "次级自愈术",
     Heal: "自愈术",
     "Quick Aid": "快速治疗术",
     Rejuvenate: "群体治疗术",
     "Heals all allies": "治疗所有队友",
     "all allies": "所有队友",
     "lowest HP ally": "生命值最少的队友",

     //------------------ 黄书类
     Taunt: "嘲讽",
     Provoke: "挑衅",
     Toughness: "坚韧",
     Elusiveness: "闪避",
     Precision: "精确",
     Berserk: "狂暴",
     Frenzy: "狂热",
     "Elemental Affinity": "元素亲和",
     "Spike Shell": "尖刺防护",
     "Arcane Reflection": "奥术反射",
     Vampirism: "吸血",

     //------------------ 蓝书类
     Revive: "复活",
     Insanity: "疯狂",
     Invincible: "无敌",
     "Fierce Aura": "物理光环",
     "Aqua Aura": "流水光环",
     "Sylvan Aura": "自然光环",
     "Flame Aura": "火焰光环",
     "Speed Aura": "速度光环",
     "Critical Aura": "暴击光环",

     };

     //--------2.4.5 资源(商店顺序)
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

     };

     //----2.4.6 装备(商店顺序)
     const tranItemEquipment = {
     "Griffin Bulwark": "狮鹫盾",
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
     "Shoebill Shoes": "大嘴鹳鞋",
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

     //----2.4.7 工具
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

    // 2.5 宝箱
 let tranItemBox = {
     "Small Meteorite Cache": "星坠遗藏【小】",
     "Medium Meteorite Cache": "星坠遗藏【中】",
     "Large Meteorite Cache": "星坠遗藏【大】",

     "Small Artisan's Crate": "匠心巧匣【小】",
     "Medium Artisan's Crate": "匠心巧匣【中】",
     "Large Artisan's Crate": "匠心巧匣【大】",

     "Small Treasure Chest": "宝箱【小】",
     "Medium Treasure Chest": "宝箱【中】",
     "Large Treasure Chest": "宝箱【大】",

     "Purple's Gift": "牛紫的礼物",

     "Chimerical Chest": "奇幻宝箱",
     "Sinister Chest": "邪恶宝箱",
     "Enchanted Chest": "秘法宝箱",

 };


 let tranMonster = {
     //-------------- 批量模拟
     Rat:"杰瑞",
     Frog: "青蛙",
     Snake: "蛇",
     Alligator: "鳄鱼",
     "Sea Snail": "蜗牛",
     Crab: "螃蟹",
     Turtle: "乌龟",
     "Gobo Stabby": "哥布林穿刺手",
     "Gobo Slashy": "哥布林战士",
     "Gobo Smashy": "哥布林大锤手",
     "Gobo Shooty": "哥布林弓箭手",
     "Gobo Boomy": "哥布林法师",

     //-------------- 臭臭星球
     "Smelly Planet": "臭臭星球",
     "Smelly Planet Elite": "臭臭星球(精英)",
     Fly: "苍蝇",
     Jerry: "杰瑞",
     Skunk: "臭鼬",
     Porcupine: "豪猪",
     Slimy: "史莱姆",

     //-------------- 沼泽星球
     "Swamp Planet": "沼泽星球",
     "Swamp Planet Elite": "沼泽星球(精英)",
     Frogger: "青蛙",
     Thnake: "蛇",
     Swampy: "蜘蛛",
     Sherlock: "鳄鱼",
     "Giant Shoebill": "大嘴鹳",

     //-------------- 海洋星球
     "Aqua Planet": "海洋星球",
     "Aqua Planet Elite": "海洋星球(精英)",
     Gary: "蜗牛",
     "I Pinch": "螃蟹",
     Aquahorse: "海马",
     "Nom Nom": "鲫鱼",
     Turuto: "乌龟",
     "Marine Huntress": "海洋猎手",

     //-------------- 丛林星球
     "Jungle Planet": "丛林星球",
     "Jungle Planet Elite": "丛林星球(精英)",
     "Jungle Sprite": "丛林精灵",
     Myconid: "蘑菇人",
     Treant: "树人",
     "Centaur Archer": "半人马弓箭手",
     "Luna Empress": "月神之蝶",

     //-------------- 哥布林星球
     "Gobo Planet": "哥布林星球",
     "Gobo Planet Elite": "哥布林星球(精英)",
     Stabby: "哥布林穿刺手",
     Slashy: "哥布林战士",
     Smashy: "哥布林大锤手",
     Shooty: "哥布林弓箭手",
     Boomy: "哥布林法师",
     "Gobo Chieftain": "哥布林酋长",

     //-------------- 眼球星球
     "Planet Of The Eyes": "眼球星球",
     "Planet Of The Eyes Elite": "眼球星球(精英)",
     Eye: "独眼",
     Eyes: "竖眼",
     Veyes: "复眼",
     "The Watcher": "观察者",

     //-------------- 巫师之塔
     "Sorcerer's Tower": "巫师之塔",
     "Sorcerer's Tower Elite": "巫师之塔(精英)",
     "Sorcerers Tower": "巫师之塔",
     "Sorcerers Tower Elite": "巫师之塔(精英)",
     "Novice Sorcerer": "新手巫师",
     "Ice Sorcerer": "冰霜巫师",
     "Flame Sorcerer": "火焰巫师",
     Elementalist: "元素法师",
     "Chronofrost Sorcerer": "时空霜巫",

     //-------------- 熊熊星球
     "Bear With It": "熊熊星球",
     "Bear With It Elite": "熊熊星球(精英)",
     "Gummy Bear": "果冻熊",
     Panda: "熊猫",
     "Black Bear": "黑熊",
     "Grizzly Bear": "灰熊",
     "Polar Bear": "北极熊",
     "Red Panda": "小熊猫",

     //-------------- 魔像洞穴
     "Golem Cave": "魔像洞穴",
     "Golem Cave Elite": "魔像洞穴(精英)",
     "Magnetic Golem": "磁力魔像",
     "Stalactite Golem": "钟乳石魔像",
     "Granite Golem": "花岗岩魔像",
     "Crystal Colossus": "水晶巨像",

     //-------------- 暮光之地
     "Twilight Zone": "暮光之地",
     "Twilight Zone Elite": "暮光之地(精英)",
     Zombie: "僵尸",
     Vampire: "吸血鬼",
     Werewolf: "狼人",
     "Dusk Revenant": "黄昏亡灵",

     //-------------- 地狱深渊
     "Infernal Abyss": "地狱深渊",
     "Infernal Abyss Elite": "地狱深渊(精英)",
     "Abyssal Imp": "深渊小鬼",
     "Soul Hunter": "灵魂猎手",
     "Infernal Warlock": "地狱术士",
     "Demonic Overlord": "恶魔霸主",


     //-------------- 奇幻洞穴
     "Chimerical Den": "奇幻洞穴",
     "Butterjerry": "蝶鼠",
     "Jackalope": "鹿角兔",
     "Dodocamel": "渡驼",
     "Manticore": "蝎狮",
     "Griffin": "狮鹫",

     //-------------- 邪恶马戏团
     "Sinister Circus": "邪恶马戏团",
     "Rabid Rabbit": "疯魔兔",
     "Zombie Bear": "僵尸熊",
     "Acrobat": "杂技师",
     "Juggler": "杂耍者",
     "Magician": "魔术师",
     "Deranged Jester": "小丑皇",

     //-------------- 秘法要塞
     "Enchanted Fortress": "秘法要塞",
     "Enchanted Pawn": "秘法之兵",
     "Enchanted Knight": "秘法之马",
     "Enchanted Bishop": "秘法之相",
     "Enchanted Rook": "秘法之车",
     "Enchanted Queen": "秘法之后",
     "Enchanted King": "秘法之王",

 };



 // 2.9 其他
 let tranOther = {
     //-------------- Other

     loading: "加载中...",
     "Start Now": "现在开始",
     "Upgrade Queue Capacity": "升级队列容量",
     "Total Experience": "总经验值",
     "Exp to Level Up": "升级所需经验值",
     "You need to enable JavaScript to run this app": "你需要启用JavaScript才能运行此应用程序",


     //---- 页面
     //-------------- 状态栏
     "active players": "活跃玩家数",
     "total level": "总等级",
     "flee": "退出战斗",

     //-------------- 左侧边栏
     marketplace: "市场",
     tasks: "任务",

     shop: "商店",
     "Buy Item": "购买商品",
     "cowbell store": "牛铃商店",
     social: "社交",
     guild: "公会",
     leaderboard: "排行榜",
     settings: "设置",
     news: "新闻",
     logout: "退出登陆",

     //-------------- 右侧边栏
     Inventory: "库存",
     Abilities: "技能",
     House: "房子",
     Loadout: "配装",

     //-------------- 库存
     "Chat Link": "聊天链接",
     "Item Dictionary": "物品字典",
     Equip: "装备",
     "Cannot During Combat": "战斗中无法使用",
     "Level Not Met": "等级未达到",

     //-------------- 装备
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
     "Critical Hit": "暴击",
     "Task Damage": "任务伤害",
     Amplify: "增幅",
     Evasion: "闪避",
     Armor: "护甲",
     Resistance: "抗性",
     Penetration: "穿透",
     "Life Steal": "生命窃取",
     "Mana Leech": "法力吸取",
     "elemental thorns": "元素荊棘",
     "physical thorns": "护盾荊棘",
     Thorn:"荆棘",
     Tenacity: "韧性",
     Threat: "威胁",
     "HP Regen": "生命值回复",
     "MP Regen": "法力值回复",
     "Drop Rate": "掉落率",
     "Combat Rare Find": "战斗稀有发现",
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
     "Water Resistance": "水属性抗性",
     "Nature Resistance": "自然属性抗性",
     "Fire Resistance": "火属性抗性",
     Speed: "速度",
     parry: "招架",
     "Increases action speed": "增加行动速度",
     "Task Speed": "任务速度",
     "Increases speed on actions assigned as tasks": "增加分配为任务的行动速度",
     "Increases gathering quantity": "增加采集数量",
     "Increases chance of finding essences": "增加精华掉落率",
     Efficiency: "效率",
     "Chance of repeating the action instantly": "立即重复行动的几率",
     "Skilling Rare Find": "专业稀有发现",
     "Skilling Essence Find": "专业精华发现",

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

     "Ability Slots": "技能槽",
     "Learned Abilities": "已学习的技能",
     "Special Ability Slot": "特殊技能槽",
     Description: "描述",
     Cooldown: "冷却",
     "Cast Time": "施法时间",
     "MP Cost": "MP消耗",
     "Combat Triggers": "触发器",
     "Activate when": "激活在",

     //-------------- 房子
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
     "Delete Loadout": "删除配装",
     "View All Loadouts": "查看所有配装",
     "Loadout:":"配装",
     "No Loadout":"不使用配装",

     //-------------- 聊天
     General: "常规",
     Trade: "交易",
     Recruit: "招募",
     Beginner: "新手",
     party: "队伍",
     Whisper: "私聊",
     Send: "发送",

     //---- 主页面
     //-------------- 市场

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
     "Sell Now": "立即出售",
     All: "全部",
     "Buy Now": "立即购买",
     Filled: "完成",


     //-------------- Task
     "Task Board": "任务板",
     "Task Shop": "任务商店",
     "Next Task": "下一个任务",
     "Blocked Skills": "屏蔽专业",
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
     "Buy Task Shop Item": "购买任务商店物品",
     "unread task": "未读的任务",
     read: "阅读",

     //-------------- 挤奶

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

     Upgrade: "升级",
     From: "从",
     "Basic Task Badge": "基础任务徽章",
     "Advanced Task Badge": "高级任务徽章",
     "Expert Task Badge": "专家任务徽章",
     "Collectors Boots": "收藏家之靴",

     //-------------- 采摘

     Tree: "树",
     "Birch Tree": "桦树",
     "Cedar Tree": "雪松树",
     "Purpleheart Tree": "紫心木树",
     "Ginkgo Tree": "银杏树",
     "Redwood Tree": "红杉树",
     "Arcane Tree": "奥秘树",

     //-------------- 奶酪锻造

     Material: "材料",

     //-------------- 制作
     Crossbow: "弩",
     Bow: "弓",
     Staff: "法杖",
     Special: "特殊",

     "Instant Heal": "即时治疗",
     "Heal Over Time": "持续治疗",
     "Instant Mana": "即时回蓝",
     "Mana Over Time": "持续回蓝",

     //-------------- 酿造

     Tea: "茶",
     Coffee: "咖啡",

     //-------------- 炼金
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

     //-------------- 强化

     Protect: "保护",
     Protection: "保护",
     "Protect From level": "保护等级",
     "Protect From": "保护自",
     "Item not available": "道具无法使用",
     "Must Be >= 2 To Be Effective": "必须 >= 2 才能生效",
     Instructions: "指引",
     "Enhancement Bonus": "强化加成",
     "Enhance Item": "强化物品",
     "Enhancing Protection": "强化保护",
     "Current Action": "当前操作",
     "You are currently not enhancing anything": "当前无强化",
     "Select an equipment to enhance": "选择一个装备进行强化",
     Success: "成功",
     Failure: "失败",

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
     "setup queue": "设置队列",

     NOTE: "注意",
     "Buy limit": "购买限制",
     "Action Queue": "动作队列",
     "Task Slot": "任务槽",
     "Loadout Slot": "配装槽",
     "Limit": "上限",
     "Loadout Slots": "配装槽",


     //-------------- 战斗
     "combat zone": "战斗区域",
     "find party": "寻找队伍",
     "Private party":"私人队伍",
     "Public party":"公开队伍",
      battle: "战斗",
     "auto attack": "自动攻击",
     "select zone": "选择区域",


     //-------------- 未整理
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
     "Skilling Experience": "专业经验",
     Loots: "战利品",
     "Food Slots": "食物槽位",
     "Drink Slots": "饮料槽位",
     "Food Haste": "食物急速",
     "Drink Concentration": "饮料浓度",
     "Sell Price": "售价",
     "Traveling To Battle": "踏上战斗之旅",
     "My Stuff": "我的物品",
     "Ability Slot": "技能槽",

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
     Update: "更新",
     "Character Name": "角色名称",
     minute: "分钟",
     minutes: "分钟",
     hour: "小时",
     hours: "小时",
     day: "天",
     days: "天",
     year: "年",
     years: "年",

     Name: "名称",
     Stunned: "被眩晕",
     Silenced: "被沉默",
     Amount: "数量",
     Consumable: "消耗品",
     "Usable In": "可用于",
     "Usable In": "可用于",
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
     Processing: "加工",

     Artisan: "工匠",
     "Alchemy Success": "炼金成功",

     "Action Level": "行动所需等级",
     "Increases required levels for the action": "增加行动所需等级",
     Blessed: "祝福",
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

     "Skilling Efficiency": "专业效率",
     "Skilling Speed": "专业速度",
     "Armor Penetration": "护甲穿透",
     Global: "全局",
     "You consumed": "你消耗了",
     Close: "关闭",
     "Items gained": "获得物品",
     "Experience gained": "获得经验",
     "View Cowbell Store": "查看牛铃商店",
     "Dropped By Monsters": "怪物掉落",
     "Dropped By Elite Monsters": "精英怪物掉落",
     "Looted From Container": "获取自箱子",
     "Open To Loot": "战利品",
     "Rare Drop From": "稀有掉落自",
     "Enhancing Cost": "强化费用",
     Recommended: "推荐",

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

     //-------------- 设置
     "Game Mode": "游戏模式",
     On: "开",
     Hide: "隐藏",
     Private: "私密",
     Continue: "继续",
     "Minutes to Add": "要添加的分钟数",
     "Minutes To Add For Next Level": "升级所需分钟数",
     "Doing nothing": "什么都不做",
     Remove: "移除",
     Overview: "概览",
     Members: "成员",
     Manage: "管理",
     Edit: "编辑",
     Decline: "拒绝",
     Hidden: "隐藏",
     "Battle Info": "战斗信息",
     Stats: "统计数据",
     "Combat Duration": "战斗时长",
     Deaths: "死亡次数",
     "Items looted": "掠夺的物品",
     "Drop Quantity": "掉落数量",
     Skill: "专业",
     Unfriend: "解除好友关系",
     "Confirm Unfriend": "确认解除好友关系",
     Promote: "晋升",
     Demote: "降级",
     Kick: "踢出",
     "Enemies' Total # of Active Units": "敌人的活跃单位总数",
     AND: "并且",

     //---------------------/ 战斗设置
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

     "Gather and Craft": "收集和制作",
     Community: "社区",

     "Terms of Use": "使用条款",
     Login: "登录",
     "or to fully": "或者完全",
     "I Agree to the": "我同意",
     Terms: "条款",

     Play: "开始游戏",
     Empty: "空",
     Tutorial: "教程",

     Accept: "接受",
     OK: "好的",
     "Frequency": "频率",
     "Variety": "种类",
     "Capacity": "容量",
     "Task Cooldown": "任务冷却",
     "Lootboxes": "宝箱",
     "Guild Features": "工会功能",
     "Member Slots": "成员数量",
     "Member Roles": "职位",
     "Invited":"受邀",
     "Random Task Feature": "随机任务介绍",
     "The Task Board": "任务板",

 };

//戰鬥模擬器
let tranEmulator = {
    "Dark Mode": "黑暗模式",
    Player: "玩家",
    "House Rooms": "房子",
    "Drop Prices": "掉落价格",
    "Trigger": "",
    "Current Assets": "流动资产",
    Networth: "净资产",
    "Price settings": "价格设置",
    "Consumable Prices": "消耗品价格",
    "Ask": "收购价",
    "Bid": "采购价",
    "SO": "左",
    "BO": "右",
    Trigger: "触发条件",
    "Start Simulation":"开始模拟",
    "save": "保存",
    "Dark Mode": "黑暗模式",
    Parry: "招架",
    "Simulation Results":"模拟结果",
    "Kills per hour": "每小时击杀数",
    "Time spent on boss": "花费在BOSS上的时间",
    "Deaths per hour": "每小时死亡次数",
    "XP per hour": "每小时经验获取",
    "HP Spent per hour": "每小时损失的HP",
    "Consumables used per hour": "每小时使用的消耗品",
    "Mana used per hour": "每小时消耗的魔法值",
    "Casts/h": "施法/小时",
    "Health restored per second": "每秒恢复的HP",
    "Mana restored per second": "每秒恢复的MP",
    "Damage Done": "造成的伤害",
    "Damage Taken": "受到的伤害",
    "Source": "来源",
    "Profit": "利润",
    "No RNG Profit": "正常期望利润",
    "Total": "总计",
    "Hitchance": "命中率",
    "Mayhem": "混乱",
    "Critical Damage Bonus": "爆击伤害加成",
    "Task Damage Bonus": "任务伤害加成",
    "Experience Rate": "经验倍率",
    "Pierce": "穿透",
    "zone": "区域",
    "Select Players": "选择玩家",
    "Sim All Zones": "模拟所有区域",
    "Sim Dungeon": "模拟地下城",
    Dungeon: "地下城",
    "Simulation Settings": "模拟设置",
    "Expenses": "支出",
    "Revenue": "收益",
    "No RNG Revenue": "正常期望收益",
    "No RNG Drops": "正常期望掉落",
    "Create": "创建",
    "solo": "单人",
    "Import set here for Solo": "导入单刷设置",
    "OR": "或",
    "Equipment Sets": "套用设置",
    "Import/Export": "导入/导出",
    "Get Prices": "获取价格",
    "Edit Prices": "修改价格",
    "Import": "导入",
    "Export Group/Solo": "导出 团队/单人",
    "Import/Export": "导入/导出",
    "Regen": "回复",
    "Ran out of mana": "MP耗尽",
    "Encounters": "遭遇次数",
    "Add condition": "新增条件",
    "Set to default": "设置为预设值",
    "Configure Trigger": "设置触发器",
    "All players import": "导入所有玩家",
    "Player 1 import": "导入玩家1",
    "Player 2 import": "导入玩家2",
    "Player 3 import": "导入玩家3",
    "Player 4 import": "导入玩家4",
    "Player 5 import": "导入玩家5",
    "Import solo/group": "导入单人 / 组队模式",
    "Refresh game page to update character set": "刷新游戏页面以更新角色阵容",
    Imported: "已导入",
    "Stamina to level": "耐力",
    "Intelligence to level": "智力",
    "Attack to level": "攻击",
    "Power to level": "力量",
    "Defense to level": "防御",
    "Ranged to level": "远程",
    "Magic to level": "魔法",
    "days after": "天后",
    "Forever": "永不",
    "Import / Export Set": "导入/导出 設置",
    "Group Combat": "团队",
    "": "",

 }


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
     tranMonster,
     tranOther,
     tranEmulator,
 ]) {
     for (let key in trans) {
         translates[key.toLowerCase()] = trans[key];
     }
 }

function TransSubTextNode(node) {
    if (node.childNodes.length > 0) {
        for (let subnode of node.childNodes) {
            if (subnode.placeholder) {
                translatePlaceholder(subnode);
            }
            if (subnode.nodeName === "#text") {
                let text = subnode.textContent;
                let cnText = cnItem(text, subnode);
                if (cnText !== text) {
                    if (subnode.parentNode) {
                        subnode.parentNode.setAttribute("script_translatedfrom", subnode.textContent);
                    }
                    subnode.textContent = cnText;
                }
            } else if (subnode.nodeName !== "SCRIPT" && subnode.nodeName !== "STYLE" && subnode.nodeName !== "TEXTAREA") {
                if (!subnode.childNodes || subnode.childNodes.length === 0) {
                    let text = subnode.innerText;
                    let cnText = cnItem(text, subnode);
                    if (cnText !== text) {
                        if (subnode.parentNode) {
                            subnode.parentNode.setAttribute("script_translatedfrom", subnode.innerText);
                        }
                        subnode.innerText = cnText;
                    }
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

    // 消除中間多餘空格（多個空格合併為一個空格）
    if (/\s{2,}/.test(text)) {
        let res = text.replace(/\s{2,}/g, ' ');
        return cnItem(res, node);
    }

     if(!node.parentNode) { // 修复Loadout页面导致脚本crash的问题
         return text;
     }


     // like "test (Elite)"
     if (/^(.+)(\s*)\((.+)\)$/.test(text)) {
         let res = /^(.+)(\s*)\((.+)\)$/.exec(text);
         return cnItem(res[1], node) + res[2] + "(" + cnItem(res[3], node) + ")";
     }

    //After 5 days
     if (/^After (\d+) days$/.test(text)) {
         let res = /^After (\d+) days$/.exec(text);
         return "经过 " + res[1] + " 天";
     }

    //Intelligence to level 115 takes
    //Attack to level 106 takes
    //Ranged to level 125 takes
     if (/^(Intelligence|Attack|Ranged|Power|Defense|Magic|Stamina) to level (\d+) takes$/.test(text)) {
         let res = /^(Intelligence|Attack|Ranged|Power|Defense|Magic|Stamina) to level (\d+) takes$/.exec(text);
         return cnItem(res[1], node) + " 提升到 " + cnItem(res[2], node) + " 级还需";
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

     // like "players: user"
     if (/^(.+)(:\s*)(.+)$/.test(text)) {
         let res = /^(.+)(:\s*)(.+)$/.exec(text);
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
     //console.log(text);

     return baseTranslate(text);
 };



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
                            if (node.innerText) node.innerText = cnItem(node.innerText, node);
                        } else {
                            TransSubTextNode(node);
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
        if (node.placeholder === "All players import") {
            node.placeholder = "导入所有玩家";
            }
    for (let i = 1; i <= 5; i++) {
        const placeholderText = `Player ${i} import`;
        if (node.placeholder === placeholderText) {
            node.placeholder = `导入玩家${i}`;
            break;
        }
    }
        if (node.placeholder === "Import set here for Solo") {
            node.placeholder = "导入单人设置";
        }
}
