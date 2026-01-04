// ==UserScript==
// @name        TFT Chinese Translation Helper
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Replace TFT terms with translations using advanced DOM traversal
// @author       树懒醒醒 https://space.bilibili.com/2364159
// @match        https://tftacademy.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523726/TFT%20Chinese%20Translation%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/523726/TFT%20Chinese%20Translation%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const wordMap = {
        "Perfected Executioner's Chainblade": "完美行刑官链锯刃",
        "Perfected Destabilized Chemtank": "完美失稳炼金罐",
        "Trait: What Could Have Been": "羁绊：本可发生之事",
        "Perfected Piltoven Hexarmor": "完美皮城海克斯护甲",
        "Rabadon's Ascended Deathcap": "灭世者的飞升之帽",
        "Perfected Unleashed Toxins": "完美毒素倾泻",
        "Lesser Champion Duplicator": "次级英雄复制器",
        "Welcome to the Playground": "欢迎来到游乐场",
        "Lesser Shimmer Duplicator": "次级微光复制器",
        "Executioner's Chainblade": "行刑官链锯刃",
        "Perfected Virulent Virus": "完美烈性病毒",
        "Tiny Champion Duplicator": "微型英雄复制器",
        "Corrupt Vampiric Scepter": "黑暗吸血鬼节杖",
        "Young and Wild and Free": "不拘一格",
        "Beggars Can Be Choosers": "乞亦有择",
        "Expected Unexpectedness": "意料之中的意外",
        "Perfected Shimmer Bloom": "完美微光绽放",
        "Perfected Voltaic Saber": "完美电震军刀",
        "The Tears of My Enemies": "我敌人们的眼泪",
        "Locket of theron Solari": "钢铁烈阳之匣",
        "Unstable Treasure Chest": "不稳定的财宝箱",
        "Calculated Enhancement": "精心赋能",
        "Malicious Monetization": "恶意货币化",
        "Perfected Flesh Ripper": "完美裂肉者",
        "Legacy of the Colossus": "巨像的传承",
        "Suspicious Trench Coat": "迷离风衣",
        "Center of the Universe": "星原之准",
        "War for the Undercity": "底城争夺战",
        "The Mutation Survives": "物竞天择",
        "Top of the Scrap Heap": "极客宝藏之顶",
        "What Doesn't Kill You": "在失败中变强",
        "Clockwork Accelerator": "发条增速器",
        "Diversified Portfolio": "多元化投资",
        "Ghost of Friends Past": "老友幽魂",
        "Quality Over Quantity": "重质不重量",
        "Destabilized Chemtank": "失稳炼金罐",
        "Blessed Bloodthirster": "福佑饮血剑",
        "More More-ellonomicon": "莫雷洛圣典",
        "Talisman of Ascension": "飞升护符",
        "An Exalted Adventure": "崇高冒险",
        "Patience is a Virtue": "耐心是一种美德",
        "Shimmerscale Essence": "金鳞精粹",
        "Subscription Service": "订阅服务",
        "What Could Have Been": "本可发生之事",
        "Salvaged Contraption": "回收装置",
        "Dimensional Heirloom": "高维传家宝",
        "Self Destruct Button": "自毁按钮",
        "Dvarapala Stoneplate": "天神石板甲",
        "Needlessly Large Rod": "无用大棒",
        "Virtue of the Martyr": "殉道美德",
        "Protective Shielding": "防御型护盾",
        "Scoreboard Scrapper": "冲榜战士",
        "Paint the Town Blue": "爆蓝之城",
        "Trait: Unlikely Duo": "羁绊：意外搭档",
        "Lategame Specialist": "后期专家",
        "Bad Luck Protection": "厄运保护",
        "Dark Alley Dealings": "暗巷交易",
        "Investment Strategy": "投资策略",
        "Tactician's Kitchen": "锅铲厨房",
        "Accomplice's Gloves": "辅助手套",
        "Quickstriker Emblem": "迅击战士纹章",
        "Repairing Microbots": "微型维修机器人",
        "Jak'sho the Protean": "千变者贾修",
        "Luminous Deathblade": "光辉之刃",
        "Guinsoo's Reckoning": "鬼索的清算",
        "Sterak's Megashield": "斯特拉克的究极盾牌",
        "Blacksmith's Gloves": "铁匠手套",
        "Champion Duplicator": "英雄复制器",
        "Aegis of the Legion": "军团圣盾",
        "Gargoyle Stoneplate": "石像鬼石板甲",
        "Guinsoo's Rageblade": "鬼索的狂暴之刃",
        "Shroud of Stillness": "静止法衣",
        "Tear of the Goddess": "女神之泪",
        "Arcana Overwhelming": "奥术浩荡",
        "Force of Friendship": "友谊之力",
        "Completedtem Anvil": "成装锻造器",
        "Support item anvil": "辅助装锻造器",
        "Good for Something": "有用之材",
        "Fractured Crystals": "碎裂水晶",
        "Quickstriker Crest": "迅击战士之徽",
        "Quickstriker Crown": "迅击战士之冕",
        "Arcane Retribution": "奥术之惩",
        "Trait: Martial Law": "羁绊：军事管制",
        "Caretaker's Chosen": "游神的神选",
        "Long Distance Pals": "天涯若比邻",
        "Missed Connections": "别再错过",
        "Blistering Strikes": "酷热打击",
        "One Buff, Two Buff": "1个霸符，2个霸符",
        "Prismatic Pipeline": "棱彩管道",
        "Thorn-Plated Armor": "棘刺镀板铠甲",
        "Shimmer Duplicator": "微光复制器",
        "Miniature Champion": "微缩弈子",
        "Artillerist Emblem": "炮手纹章",
        "Pit Fighter Emblem": "搏击手纹章",
        "Glamorous Gauntlet": "圣洁珠光护手",
        "Needlessly Big Gem": "无用大宝石",
        "Masterwork Upgrade": "杰作升级",
        "Innervating Locket": "激发之匣",
        "Pengu's Protection": "企鹅的庇护",
        "Hammer to the Face": "冲脸之锤",
        "Do You Know Who Am": "你知道我是谁吗",
        "Rabadon's Deathcap": "灭世者的死亡之帽",
        "Runaan's Hurricane": "卢安娜的飓风",
        "Tactician's Shield": "金锅锅冠冕",
        "Avalanche of Armor": "护甲山崩",
        "Artifacttem Anvil": "神器装备锻造器",
        "Inspiring Epitaph": "激昂墓志铭",
        "Wandering Trainer": "漫游训练师",
        "Academic Research": "学术研究",
        "Rocket Collection": "火箭收藏",
        "Artillerist Crest": "炮手之徽",
        "Artillerist Crown": "炮手之冕",
        "I Hope This Works": "我希望这个管用",
        "Noxian Guillotine": "诺克萨斯断头台",
        "Pit Fighter Crest": "搏击手之徽",
        "Pit Fighter Crown": "搏击手之冕",
        "All That Shimmers": "闪若金鳞",
        "Caretaker's Favor": "游神的眷顾",
        "Vampiric Vitality": "吸血生机",
        "Greater Moonlight": "高级月光",
        "I'm the Carry Now": "我成C位了",
        "NO SCOUT NO PIVOT": "不侦察，不变阵",
        "Sated Spellweaver": "满意的织法者",
        "Unleash The Beast": "释放野兽",
        "Salvaged Revolver": "回收左轮枪",
        "Salvaged Gauntlet": "回收护手",
        "Perfected Shimmer": "完美微光",
        "Piltoven Hexarmor": "皮城海克斯护甲",
        "Black Rose Emblem": "黑色玫瑰纹章",
        "Chem-Baron Emblem": "炼金男爵纹章",
        "Experiment Emblem": "试验品纹章",
        "Urf-Angel's Staff": "阿福天使之杖",
        "Royal Crownshield": "皇家冕盾",
        "Hextech Lifeblade": "海克斯科技生命之刃",
        "Determinednvestor": "坚定投资器",
        "Goldentem Remover": "金制装备拆卸器",
        "Trickster's Glass": "诡术师之镜",
        "Archangel's Staff": "大天使之杖",
        "Lightshield Crest": "光盾徽章",
        "Seeker's Armguard": "探索者的护臂",
        "The Eternal Flame": "永恒烈焰",
        "Tactician's Crown": "金铲铲冠冕",
        "Moonstone Renewer": "月石再生器",
        "Strength Training": "力量训练",
        "Energy Absorption": "法强吸收",
        "Essence of Navori": "纳沃利精华",
        "One Thousand Cuts": "千刀斩",
        "Avarice Incarnate": "贪财化身",
        "Legacy of Shurima": "恕瑞玛的传承",
        "Share Your Energy": "分享你的能量",
        "Unstoppable Force": "势不可挡",
        "Dramatic Entrance": "震撼登场",
        "Radiant Refactor": "光明重构器",
        "Black Rose Crest": "黑色玫瑰之徽",
        "Black Rose Crown": "黑色玫瑰之冕",
        "Chem-Baron Crest": "炼金男爵之徽",
        "Chem-Baron Crown": "炼金男爵之冕",
        "Adrenaline Burst": "肾上腺爆发",
        "Prismatic Ticket": "棱彩门票",
        "Birthday Present": "生日礼物",
        "Caretaker's Ally": "游神的盟友",
        "Buried Treasures": "珍藏财宝",
        "Rolling for Days": "D个痛快",
        "Component Buffet": "基础装备自助餐",
        "Climb The Ladder": "攀登天梯",
        "Cloning Facility": "克隆设施",
        "Crafted Crafting": "精心打造",
        "Find Your Center": "C位的觉悟",
        "Forward Thinking": "前瞻思维",
        "Gold for Dummies": "假人金币",
        "Immovable Object": "不可撼动之物",
        "Health is Wealth": "健康就是财富",
        "Portable Anomaly": "便携异常点",
        "Unleashed Toxins": "毒素倾泻",
        "Convert to Vials": "转换为药瓶",
        "Firelight Emblem": "野火帮纹章",
        "Dominator Emblem": "统领纹章",
        "Visionary Emblem": "先知纹章",
        "Conqueror Emblem": "铁血征服者纹章",
        "Death's Defiance": "死亡之蔑",
        "Obsidian Cleaver": "黑曜石切割者",
        "Zhonya's Paradox": "中娅悖论",
        "Fist of Fairness": "绝对正义之拳",
        "The Baron's Gift": "男爵赠礼",
        "Crest of Cinders": "余烬之冠",
        "Runaan's Tempest": "卢安娜的风暴",
        "Magnetic Remover": "装备拆卸器",
        "Rapid Firecannon": "疾射火炮",
        "Spectral Cutlass": "幽魂弯刀",
        "Unending Despair": "无终恨意",
        "Chalice of Power": "能量圣杯",
        "Hextech Gunblade": "海克斯科技枪刃",
        "Jeweled Gauntlet": "珠光护手",
        "Tactician's Cape": "金锅铲冠冕",
        "Scuttle Familiar": "真的会蟹",
        "Power Absorption": "攻击吸收",
        "Into the Unknown": "进入未知",
        "Hunger for Power": "渴望能量",
        "Component Anvil": "基础装备锻造器",
        "Mercenary Chest": "赏金猎人宝箱",
        "Heroic Grab Bag": "英勇福袋",
        "Dragon's Spirit": "巨龙加护",
        "Over Encumbered": "运力不足",
        "Another Anomaly": "又一个异常突变",
        "Forbidden Magic": "禁忌魔法",
        "Conqueror Crest": "铁血征服者之徽",
        "Conqueror Crown": "铁血征服者之冕",
        "Dominator Crest": "统领之徽",
        "Dominator Crown": "统领之冕",
        "Law Enforcement": "执法",
        "Firelight Crest": "野火帮之徽",
        "Firelight Crown": "野火帮之冕",
        "Visionary Crest": "先知之徽",
        "Visionary Crown": "先知之冕",
        "Trait: Geniuses": "羁绊：天才",
        "Built Different": "卓尔不群",
        "Band of Thieves": "窃贼帮派",
        "Pandora's Bench": "潘朵拉的备战席",
        "Ones Twos Three": "一二二三",
        "Pandora's Items": "潘朵拉的装备",
        "Phreaky Friday ": "成吨的伤害",
        "Bronze for Life": "终身黄铜",
        "Powered Shields": "硬化护盾",
        "Flurry of Blows": "连串打击",
        "Hall of Mirrors": "镜廊",
        "Noble Sacrifice": "高贵牺牲",
        "Reroll Transfer": "刷新转换",
        "Restart Mission": "重启任务",
        "Upward Mobility": "上进心",
        "Ambusher Emblem": "伏击专家纹章",
        "Automata Emblem": "海克斯机械纹章",
        "Sorcerer Emblem": "法师纹章",
        "Enforcer Emblem": "执法官纹章",
        "Sentinel Emblem": "哨兵纹章",
        "Finishing Touch": "画龙点睛",
        "Eternal Whisper": "永恒轻语",
        "Spear of Hirana": "希拉娜之矛",
        "Statikk's Favor": "斯塔缇克狂热",
        "Rascal's Gloves": "光明窃贼手套",
        "Gambler's Blade": "投机者之刃",
        "Deathfire Grasp": "冥火之拥",
        "Blighting Jewel": "枯萎珠宝",
        "Luden's Tempest": "卢登的激荡",
        "Silvermere Dawn": "密银黎明",
        "Protector's Vow": "圣盾使的誓约",
        "Steadfast Heart": "坚定之心",
        "Sparring Gloves": "拳套",
        "Spear of Shojin": "朔极之矛",
        "Titan's Resolve": "泰坦的坚决",
        "Hand of Justice": "正义之手",
        "Titanic Strikes": "泰坦打击",
        "Nunu & Willump": "努努和威朗普",
        "ApheliosTurret": "厄斐琉斯 驻灵",
        "SwainDemonForm": "斯维因 恶魔形态",
        "Tome of Traits": "纹章之书",
        "Little Buddies": "小伙伴",
        "ReinFOURcement": "四费增援",
        "Loot Explosion": "战利品爆炸",
        "Ambusher Crest": "伏击专家之徽",
        "Ambusher Crown": "伏击专家之冕",
        "Automata Crest": "海克斯机械之徽",
        "Automata Crown": "海克斯机械之冕",
        "Brutal Revenge": "残暴复仇",
        "Enforcer Crest": "执法官之徽",
        "Enforcer Crown": "执法官之冕",
        "Aerial Warfare": "空战",
        "Sentinel Crest": "哨兵之徽",
        "Sentinel Crown": "哨兵之冕",
        "Sorcerer Crest": "法师之徽",
        "Sorcerer Crown": "法师之冕",
        "Trait: Menaces": "羁绊：危险人物",
        "Trait: Reunion": "羁绊：重新联合",
        "Trait: Sisters": "羁绊：姐妹",
        "One, Two, Five": "一，二，五",
        "Portable Forge": "便携锻炉",
        "Radiant Relics": "光明圣物",
        "Recombobulator": "变形重组器",
        "The Golden Egg": "金蛋",
        "Cluttered Mind": "纷乱头脑",
        "Blinding Speed": "炫目之速",
        "Shopping Spree": "大买特买",
        "Phreaky Friday": "成吨的伤害",
        "Eye for An Eye": "以眼还眼",
        "Item Collector": "装备收集器",
        "Piercing Lotus": "透体莲花",
        "Support Mining": "辅助挖矿",
        "Sword Overflow": "大剑溢流",
        "Two Much Value": "由二生D",
        "Worth the Wait": "值得等待",
        "Virulent Virus": "烈性病毒",
        "Academy Emblem": "皮城学院纹章",
        "Bruiser Emblem": "格斗家纹章",
        "Watcher Emblem": "监察纹章",
        "Junkyard Titan": "机械重组",
        "Eternal Winter": "永恒凛冬",
        "Infinity Force": "三相之力",
        "Randuin's Omen": "兰顿之兆",
        "Gold Collector": "金币收集者",
        "Rosethorn Vest": "瑰刺背心",
        "Bulwark's Oath": "壁垒的誓言",
        "Covalent Spark": "神圣离子火花",
        "Quickestsilver": "至速水银",
        "Warmog's Pride": "狂徒之傲",
        "Sniper's Focus": "狙击手的专注",
        "Prowler's Claw": "暗行者之爪",
        "Banshee's Veil": "女妖面纱",
        "Nashor's Tooth": "纳什之牙",
        "Morellonomicon": "莫雷洛秘典",
        "Negatron Cloak": "负极斗篷",
        "Sentinel Swarm": "魔像狂潮",
        "Thief's Gloves": "窃贼手套",
        "Warmog's Armor": "狂徒铠甲",
        "Berserker Rage": "狂战之怒",
        "Magic Training": "魔法训练",
        "Touch of Frost": "冰霜触摸",
        "Comeback Story": "翻盘故事",
        "Defense Expert": "防御专家",
        "Wolf Familiars": "双狼佣兽",
        "Nothing Wasted": "绝不浪费",
        "Rift Scuttler": "峡谷迅捷蟹",
        "Hextech Forge": "海克斯科技锻炉",
        "Crown Guarded": "冕已有卫",
        "Call to Chaos": "混沌召唤",
        "A Golden Find": "金色收获",
        "Academy Crest": "皮城学院之徽",
        "Academy Crown": "皮城学院之冕",
        "Heavily Smash": "强力重击",
        "Bruiser Crest": "格斗家之徽",
        "Bruiser Crown": "格斗家之冕",
        "Sniper's Nest": "狙神之巢",
        "Watcher Crest": "监察之徽",
        "Watcher Crown": "监察之冕",
        "Item Grab Bag": "百宝袋",
        "Pandora'stems": "潘朵拉的装备",
        "Team Building": "团队建设",
        "Spoils of War": "战争财宝",
        "Patient Study": "耐心学习",
        "Roll The Dice": "交给运气",
        "Support Cache": "辅助宝库",
        "Tiniest Titan": "最小巨人",
        "Belt Overflow": "腰带溢流",
        "Branching Out": "节外生枝",
        "Bulky Buddies": "巨大伙伴",
        "Category Five": "五级飓风",
        "Delayed Start": "延迟开始",
        "Pair of Fours": "一对4",
        "Titanic Titan": "巨型泰坦",
        "Tower Defense": "塔防游戏",
        "Trait Tracker": "羁绊追踪者",
        "Wand Overflow": "法杖溢流",
        "Shimmer Bloom": "微光绽放",
        "Voltaic Saber": "电震军刀",
        "Family Emblem": "家人纹章",
        "Sniper Emblem": "狙神纹章",
        "Petricite Rod": "禁魔杵",
        "Blue Blessing": "圣蓝祝福",
        "Dragon's Will": "巨龙意志",
        "Brink of Dawn": "黎明锋刃",
        "Sunlight Cape": "日光斗篷",
        "Zz'Rot Portal": "兹若特传送门",
        "Diamond Hands": "钻石之手",
        "Adaptive Helm": "适应性头盔",
        "Horizon Focus": "视界专注",
        "Bloodthirster": "饮血剑",
        "Portable Pain": "便携痛苦",
        "Dragon's Claw": "巨龙之爪",
        "Edge of Night": "夜之锋刃",
        "Infinity Edge": "无尽之刃",
        "Sterak's Gage": "斯特拉克的挑战护手",
        "Unusable Slot": "不可用的栏位",
        "Zeke's Herald": "基克的先驱",
        "Dual Wielding": "双刀流",
        "Hypervelocity": "超高速",
        "Cosmic Rhythm": "星界韵律",
        "Cull The Weak": "剔除弱者",
        "Attack Expert": "物理专家",
        "Ultimate Hero": "终极英雄",
        "Target Dummy": "目标假人",
        "Elder Dragon": "远古巨龙",
        "Renata Glasc": "烈娜塔",
        "Heimerdinger": "黑默丁格",
        "Twisted Fate": "崔斯特",
        "At What Cost": "不计代价",
        "Fine Vintage": "精致古董",
        "Prizefighter": "赏金战士",
        "Raining Gold": "天降金币",
        "Family Crest": "家人之徽",
        "Family Crown": "家人之冕",
        "Combat Medic": "战地医生",
        "Why Not Both": "为何不上两个",
        "Training Arc": "训练篇",
        "Sniper Crest": "狙神之徽",
        "Sniper Crown": "狙神之冕",
        "Crimson Pact": "血色契约",
        "Battle Scars": "战斗伤疤",
        "Trade Sector": "DD街区",
        "Living Forge": "活体锻炉",
        "Lucky Gloves": "幸运手套",
        "Big Grab Bag": "大百宝袋",
        "Latent Forge": "休眠锻炉",
        "Silver Spoon": "银汤匙",
        "Blazing Soul": "炽热灵魂",
        "Crown's Will": "王冠意志",
        "Dual Purpose": "双重目的",
        "Final Polish": "最终润色",
        "Glass Cannon": "玻璃大炮",
        "High Voltage": "高压电",
        "A Magic Roll": "魔法投掷",
        "Spear's Will": "长矛意志",
        "Starry Night": "星夜",
        "Table Scraps": "餐桌剩菜",
        "Form Swapper": "双形战士",
        "Unlikely Duo": "意外搭档",
        "Quickstriker": "迅击战士",
        "Flesh Ripper": "裂肉者",
        "Rebel Emblem": "蓝发小队纹章",
        "Scrap Emblem": "极客纹章",
        "Flamethrower": "喷火器",
        "Anima Visage": "生命盔甲",
        "Mogul's Mail": "大亨之铠",
        "Forbiddendol": "禁忌雕像",
        "Bramble Vest": "棘刺背心",
        "Critical Hit": "暴击命中",
        "Giant's Belt": "巨人腰带",
        "Last Whisper": "最后的轻语",
        "Giant Slayer": "巨人杀手",
        "Guardbreaker": "破防者",
        "Sunfire Cape": "日炎斗篷",
        "Statikk Shiv": "斯塔缇克电刃",
        "Knight's Vow": "骑士之誓",
        "The Finisher": "终结者",
        "Invisibility": "隐形",
        "Heavy Hitter": "重量级打击手",
        "Calling Card": "名片",
        "Magic Expert": "魔法专家",
        "Rift Herald": "峡谷先锋",
        "EliseSpider": "伊莉丝 蜘蛛",
        "Blue_Monkey": "蓝色猴子",
        "Mordekaiser": "莫德凯撒",
        "Lunch Money": "午餐钱",
        "Build a Bud": "来个好伙计",
        "Blade Dance": "刀锋之舞",
        "Rebel Crest": "蓝发小队之徽",
        "Rebel Crown": "蓝发小队之冕",
        "Scrap Crest": "极客之徽",
        "Scrap Crown": "极客之冕",
        "Shield Bash": "护盾猛击",
        "Mad Chemist": "炼金术士",
        "Salvage Bin": "打捞桶",
        "Iron Assets": "黑铁资产",
        "Risky Moves": "冒险举动",
        "One for All": "一费奉献",
        "Artifactory": "神器工厂",
        "Called Shot": "进攻宣告",
        "Cooking Pot": "金色炊具",
        "Mace's Will": "权杖意志",
        "Hard Commit": "硬性承诺",
        "Replication": "反响",
        "Rigged Shop": "操纵商店",
        "Shop Glitch": "商店故障",
        "Spirit Link": "灵魂连接",
        "Tomb Raider": "盗墓者",
        "Artillerist": "炮手",
        "Martial Law": "军事管制",
        "High Roller": "百变铁手",
        "Pit Fighter": "搏击手",
        "Junker King": "机械公敌",
        "Confiscated": "已没收",
        "Spare Parts": "备用零件",
        "Demonslayer": "恶魔杀手",
        "Zenith Edge": "天顶锋刃",
        "Titan's Vow": "泰坦的誓言",
        "Willbreaker": "意志破坏者",
        "Hullcrusher": "碎舰者",
        "Loaded Dice": "灌铅骰子",
        "Ionic Spark": "离子火花",
        "Quicksilver": "水银",
        "Recurve Bow": "反曲之弓",
        "Freestyling": "即兴发挥",
        "Kill Streak": "连杀",
        "Giant-Sized": "巨人体型",
        "Last Chance": "最后机会",
        "Slow Cooker": "慢炖",
        "Miniaturize": "微缩化",
        "Early Game": "前期",
        "Blitzcrank": "布里茨",
        "Cassiopeia": "卡西奥佩娅",
        "Going Long": "遥遥领先",
        "Domination": "统领全场",
        "Gloves Off": "卯足全力",
        "Voidcaller": "虚空召唤者",
        "Clear Mind": "清晰头脑",
        "Teaming Up": "成群结队",
        "Hedge Fund": "对冲基金",
        "Pumping Up": "打气",
        "Coronation": "加冕礼",
        "Kingslayer": "弑君突刺",
        "Mentorship": "导师制",
        "Angerssues": "狂暴到底",
        "Pyromaniac": "嗜火",
        "Superstars": "超级巨星",
        "Void Swarm": "虚空虫群",
        "Chem-Baron": "炼金男爵",
        "Experiment": "试验品",
        "Black Rose": "黑色玫瑰",
        "Tankbuster": "坦克克星",
        "Absolution": "赦除",
        "B.F. Sword": "暴风之剑",
        "Chain Vest": "锁子甲",
        "Crownguard": "冕卫",
        "Deathblade": "死亡之刃",
        "Damage Amp": "伤害增幅",
        "Frying Pan": "金锅锅",
        "Redemption": "救赎",
        "Evenshroud": "薄暮法袍",
        "Mage Armor": "法师护甲",
        "Headhunter": "猎头者",
        "Slime Time": "史莱姆时间",
        "Deep Roots": "根深蒂固",
        "Dragonsoul": "龙魂",
        "Laser Eyes": "镭射眼",
        "Late Game": "后期",
        "Voidspawn": "虚空生物",
        "Murk Wolf": "暗影狼",
        "Razorbeak": "锋喙鸟",
        "Dr. Mundo": "蒙多医生",
        "Gangplank": "普朗克",
        "Scapegoat": "替罪羊",
        "Not Today": "不是今天",
        "Contested": "纷争",
        "Corrosion": "腐蚀",
        "Duo Queue": "双排",
        "Lone Hero": "孤胆英雄",
        "Moonlight": "月光",
        "Scavenger": "拾荒者",
        "Two Trick": "两把刷子",
        "Visionary": "先知",
        "Conqueror": "铁血征服者",
        "Dominator": "统领",
        "Firelight": "野火帮",
        "Fishbones": "鱼骨头",
        "Lich Bane": "巫妖之祸",
        "Wit's End": "智慧末刃",
        "Blue Buff": "蓝霸符",
        "MissingNo": "MissingNo",
        "Eagle Eye": "鹰眼",
        "Fortified": "坚不可破",
        "Thornskin": "荆棘满途",
        "Mini Mees": "小我多多",
        "Diving In": "深入敌阵",
        "Stoneskin": "石头皮肤",
        "Priority": "优先级",
        "Mid Game": "中期",
        "Murkwolf": "暗影狼",
        "Malzahar": "玛尔扎哈",
        "Vladimir": "弗拉基米尔",
        "Nocturne": "魔腾",
        "Tristana": "崔丝塔娜",
        "Slammin'": "物尽其用",
        "Trolling": "震惊巨魔",
        "Level Up": "升级咯",
        "Firesale": "火爆甩卖",
        "Flexible": "灵活摇摆",
        "Golemify": "魔像化",
        "Invested": "投资",
        "Manaflow": "法力流",
        "Overheal": "过量治疗",
        "Power Up": "威力提升",
        "Sponging": "白蹭",
        "Survivor": "幸存者",
        "Trifecta": "三项赛",
        "Automata": "海克斯机械",
        "Sorcerer": "法师",
        "Emissary": "外交官",
        "Sentinel": "哨兵",
        "Ambusher": "伏击专家",
        "Enforcer": "执法官",
        "Geniuses": "天才",
        "Continue": "继续",
        "Manazane": "魔蕴",
        "Reforger": "装备重铸器",
        "Red Buff": "红霸符",
        "Knockout": "地下拳王",
        "Fireball": "火球",
        "Repulsor": "斥力发生器",
        "Camille": "卡蜜尔",
        "Caitlyn": "凯特琳",
        "LeBlanc": "乐芙兰",
        "Trundle": "特朗德尔",
        "Ambessa": "安蓓萨",
        "Kog'Maw": "克格莫",
        "KogMaw": "克格莫",
        "Morgana": "莫甘娜",
        "Dummify": "假人化",
        "Max Cap": "最大规模",
        "Placebo": "安慰剂",
        "Warpath": "征战之路",
        "Menaces": "危险人物",
        "Reunion": "重新联合",
        "Sisters": "姐妹",
        "Academy": "皮城学院",
        "Bruiser": "格斗家",
        "Watcher": "监察",
        "Equinox": "星体结界",
        "Mittens": "连指手套",
        "Spatula": "金铲铲",
        "Bulwark": "壁垒",
        "Singed": "辛吉德",
        "Twitch": "图奇",
        "Ezreal": "伊泽瑞尔",
        "Illaoi": "俄洛伊",
        "Draven": "德莱文",
        "Rumble": "兰博",
        "Smeech": "史密奇",
        "Sevika": "塞薇卡",
        "Maddie": "麦迪",
        "Powder": "爆爆",
        "Vander": "范德尔",
        "Violet": "蔚奥莱",
        "Viktor": "维克托",
        "Darius": "德莱厄斯",
        "Irelia": "艾瑞莉娅",
        "Backup": "后援",
        "Lineup": "列队",
        "Pilfer": "挖角",
        "Family": "家人",
        "Sniper": "狙神",
        "Zephyr": "灵风",
        "Golem": "魔像",
        "Stage": "阶段",
        "Silco": "希尔科",
        "Amumu": "阿木木",
        "Akali": "阿卡丽",
        "Elise": "伊莉丝",
        "Jayce": "杰斯",
        "Ziggs": "吉格斯",
        "Renni": "荏妮",
        "Loris": "洛里斯",
        "Corki": "库奇",
        "Garen": "盖伦",
        "Leona": "蕾欧娜",
        "Swain": "斯维因",
        "Urgot": "厄加特",
        "Epoch": "新纪元",
        "Scrap": "极客",
        "Rebel": "蓝发小队",
        "Taunt": "嘲讽",
        "Spite": "恶意",
        "Bully": "恃强凌弱",
        "Item": "装备",
        "econ": "经济",
        "Krug": "石甲虫",
        "Ekko": "艾克",
        "Sett": "瑟提",
        "Rell": "芮尔",
        "Steb": "斯特卜",
        "Scar": "刀疤",
        "Jinx": "金克丝",
        "Zeri": "泽丽",
        "Nami": "娜美",
        "Comp": "阵容",
        "Sion": "赛恩",
        "Zyra": "婕拉",
        "Gold": "金币",
        "Vex": "薇古丝",
        "Lux": "拉克丝",
        "Mel": "梅尔",
        "Zoe": "佐伊",
        "BRB": "假装摸鱼",
        "Vi": "蔚",
        "Anomaly": "异常突变",
        "Anomalies": "异常突变",
        "Combat": "战力",
        "Emblem": "纹章",
        "AUGMENT": "强化符文",
        "Items": "装备"
    };

    // 预编译正则表达式缓存
    const regexCache = {};

    // 缓存已翻译的tooltip内容
    const tooltipCache = new Map();

    // 添加针对性的tooltip配置
    const tooltipConfig = {
        // TFT特定的tooltip选择器
        tooltipSelectors: [
            '.rounded-lg.shadow-md.tooltip.py-2.px-3.text-sm.font-medium.bg-gray-900.text-white',
            '[role="tooltip"].tooltip',
            '.tippy-box[data-theme="tooltip"]',
            // 针对TFT特定的提示框类
            '.text-shadow.absolute.bottom-0.left-0.right-0.top-0',
            // 新增选择器
            '[data-tooltip]',
            '[title]',
            '.tippy-content',
            '.tooltip-content',
            '.tft-tooltip'
        ],
        observeInterval: 50, // 缩短检查间隔
        maxCacheSize: 1000, // 限制缓存大小
        minTextLength: 2, // 最小处理文本长度
        // 添加需要保留的样式类
        preserveClasses: [
            'rounded-lg',
            'shadow-md',
            'tooltip',
            'py-2',
            'px-3',
            'text-sm',
            'font-medium',
            'bg-gray-900',
            'text-white',
            'absolute',
            'text-shadow'
        ]
    };

    // 简化的节流函数
    function throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    // 优化的文本替换函数
    function replaceText(text) {
        if (!text || text.length < 2) return text;
        let newText = text;
        for (const [key, value] of Object.entries(wordMap)) {
            if (!regexCache[key]) {
                // 添加 i 标志使正则表达式不区分大小写
                regexCache[key] = new RegExp(`\\b${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
            }
            newText = newText.replace(regexCache[key], value);
        }
        return newText;
    }

    // 优化节点过滤逻辑
    function shouldProcessNode(node) {
        if (!node) return false;

        // 增加对特定类名和ID的过滤
        const excludeClassNames = ['no-translate', 'code', 'immersive-translate'];
        const excludeIds = ['translation-content', 'google-translate'];

        if (node.nodeType === Node.ELEMENT_NODE) {
            // 检查元素节点
            const tagName = node.tagName.toLowerCase();
            if (['script', 'style', 'noscript', 'code', 'pre'].includes(tagName)) {
                return false;
            }

            // 检查class
            if (node.className && excludeClassNames.some(className =>
                node.className.includes(className))) {
                return false;
            }

            // 检查id
            if (node.id && excludeIds.some(id => node.id.includes(id))) {
                return false;
            }

            // 检查contentEditable
            if (node.isContentEditable) {
                return false;
            }
        }

        return true;
    }

    // 处理文本节点
    function processTextNode(node) {
        if (!node || !node.textContent || node.textContent.length < 2) return;

        // 检查父节点是否应该被处理
        if (!shouldProcessNode(node.parentElement)) return;

        const newText = replaceText(node.textContent);
        if (newText !== node.textContent) {
            node.textContent = newText;
        }
    }

    // 添加专门更新tooltip内容的函数
    function updateTooltipContent(tooltipElement, newText) {
        // 保存原有的HTML内容结构
        const originalHtml = tooltipElement.innerHTML;

        // 检查是否只包含纯文本
        if (originalHtml === tooltipElement.textContent) {
            // 如果是纯文本,直接替换
            tooltipElement.textContent = newText;
            return;
        }

        // 如果包含HTML,使用DOM解析处理每个文本节点
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = originalHtml;

        // 递归处理所有文本节点
        const walkTextNodes = (node) => {
            if (node.nodeType === Node.TEXT_NODE) {
                const originalText = node.textContent;
                const translatedText = replaceText(originalText);
                if (translatedText !== originalText) {
                    node.textContent = translatedText;
                }
            } else {
                node.childNodes.forEach(child => walkTextNodes(child));
            }
        };

        walkTextNodes(tempDiv);

        // 更新内容,保留HTML结构
        tooltipElement.innerHTML = tempDiv.innerHTML;
    }

    // 优化tooltip处理函数
    function processTFTTooltip(tooltipElement) {
        if (!tooltipElement || !shouldProcessNode(tooltipElement)) return;

        // 获取原始内容
        const originalContent = tooltipElement.innerHTML;
        const cacheKey = `tooltip_${originalContent.trim()}`;

        // 检查缓存
        if (tooltipCache.has(cacheKey)) {
            updateTooltipContent(tooltipElement, tooltipCache.get(cacheKey));
            return;
        }

        const newText = replaceText(originalContent);
        if (newText !== originalContent) {
            updateTooltipContent(tooltipElement, newText);
            tooltipCache.set(cacheKey, newText);
        }
    }

    // 定期检查tooltip
    function checkForTooltips() {
        tooltipConfig.tooltipSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(tooltip => {
                processTFTTooltip(tooltip);
            });
        });
    }

    // 修改processNode函数
    const processNode = throttle(function(node) {
        if (!shouldProcessNode(node)) return;

        // 处理tooltip
        if (node.nodeType === Node.ELEMENT_NODE) {
            tooltipConfig.tooltipSelectors.forEach(selector => {
                if (node.matches?.(selector)) {
                    processTFTTooltip(node);
                }
                node.querySelectorAll(selector).forEach(processTFTTooltip);
            });
        }

        // 处理普通文本
        const walker = document.createTreeWalker(
            node,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        let textNode;
        while (textNode = walker.nextNode()) {
            processTextNode(textNode);
        }
    }, 100);

    // 优化MutationObserver
    const observer = new MutationObserver(throttle((mutations) => {
        let shouldCheckTooltips = false;

        mutations.forEach((mutation) => {
            // 处理新增节点
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    processNode(node);
                    shouldCheckTooltips = true;
                } else if (node.nodeType === Node.TEXT_NODE) {
                    processTextNode(node);
                }
            });

            // 处理属性变化和文本变化
            if (mutation.type === 'characterData') {
                processTextNode(mutation.target);
                shouldCheckTooltips = true;
            }
        });

        // 如果有相关变化,检查tooltip
        if (shouldCheckTooltips) {
            checkForTooltips();
        }
    }, 200));

    // Observer配置
    const observerConfig = {
        childList: true,
        subtree: true,
        characterData: true,
        attributeFilter: ['data-tooltip', 'title'], // 只观察特定属性
        attributes: true
    };

    // 修改初始化函数,增加自动重试机制
    function initializeTranslation() {
        // 立即处理整个文档
        processNode(document.body);

        // 立即检查所有tooltip
        checkForTooltips();

        // 启动定期检查tooltip和全文更新
        setInterval(() => {
            processNode(document.body);
            checkForTooltips();
        }, tooltipConfig.observeInterval);

        // 启动观察者以处理动态内容
        observer.observe(document.body, observerConfig);
    }

    // 重新监听事件和初始化逻辑
    function setupListeners() {
        // 页面显示时触发翻译
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                initializeTranslation();
            }
        });

        // 页面变化时触发翻译(包括新标签页)
        window.addEventListener('pageshow', () => {
            initializeTranslation();
        });

        // 添加History API的监听
        window.addEventListener('popstate', () => {
            initializeTranslation();
        });

        // 监听URL变化
        let lastUrl = location.href;
        new MutationObserver(() => {
            const url = location.href;
            if (url !== lastUrl) {
                lastUrl = url;
                initializeTranslation();
            }
        }).observe(document, {subtree: true, childList: true});
    }

    // 启动程序
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initializeTranslation();
            setupListeners();
        });
    } else {
        initializeTranslation();
        setupListeners();
    }

})();
