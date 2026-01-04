// ==UserScript==
// @name         Stellar Odyssey 汉化[SakakiChizuru版]
// @namespace    http://tampermonkey.net/
// @version      1.0.15
// @description  Stellar Odyssey 汉化，当前适配6月29日更新版本。
// @author       SakakiChizuru
// @match        https://game.stellarodyssey.app/*
// @match        https://gametest.stellarodyssey.app/*
// @icon         https://game.stellarodyssey.app/favicon.ico
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541104/Stellar%20Odyssey%20%E6%B1%89%E5%8C%96%5BSakakiChizuru%E7%89%88%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/541104/Stellar%20Odyssey%20%E6%B1%89%E5%8C%96%5BSakakiChizuru%E7%89%88%5D.meta.js
// ==/UserScript==

const simpleExcludes = [
    "k",
    "m",
    "b",

    "Lv",
    "Lvl",
    "xp",
    "n/a",
    "x",

    "wiki",
    "discord",
    "cookie",
    "COSO",
    "NPC",
    "VS",
    "NaN",

    "I",
    "II",
    "III",
    "IV",
    "V",
    "VI",
    "VII",
    "VIII",
    "IX",
];

const simpleTranslationMap = {
    //通知
    "Stats reset successfully": "属性重置成功",
    "Stats modified": "属性已修改",
    "Actions replenished": "行动已补充",
    "Item drop logs cleared": "物品掉落记录已清空",
    "Only English alphabet characters in default chat channels": "默认聊天频道仅限英文字符",
    "A laboratory queue has finished": "一个实验室队列已完成",
    "System bookmarked": "已添加星系书签",
    "System bookmark removed": "星系书签已移除",
    "Donation succeeded": "捐献成功",
    "Fuel restored": "燃料已补充",
    "Droids have stopped gathering the node": "机器人已停止采集节点",
    "Ran out of gathering actions": "采集行动次数已用尽",
    "Ran out of battling actions": "战斗行动次数已用尽",

    // Header
    "Playing": "游戏中",
    "News": "新闻",
    "Game Rules": "游戏规则",
    "Patch notes": "补丁说明",
    "Privacy Policy": "隐私政策",
    "Report Bug": "报告Bug",
    "Rankings": "排名",
    "Starter guide": "入门指南",
    "Game info": "游戏信息",

    "Connected to game server": "已连接至游戏服务器",
    "Settings": "设置",
    "Logout": "退出登录",
    "Average ping": "平均延迟",
    "Notifications": "通知",
    "new": "新消息",
    "Up to date": "已是最新",

    "Battling": "战斗",
    "Gathering": "采集",
    "Crafting": "制造",
    "Exploring": "探索",

    "Replenish": "补充",
    "Actions": "行动",
    "Reward": "奖励",
    "Node type": "节点类型",
    "Blueprint": "蓝图",
    "Blueprints": "蓝图",
    "Fuel": "燃料",
    "System": "星系",

    // Sidebar
    "Stellar Odyssey": "恒星奥德赛",
    "Version": "版本",
    "Player": "玩家",
    "Laboratory": "实验室",
    "Galaxy Map": "星图",
    "Atlas": "星图集",
    "Base Building": "基地建设",
    "Squadron": "舰队",
    "Social Hub": "社交中心",
    "Market": "市场",
    "The current system is not inhabited. There is no galaxy market network available":
        "当前星系未被殖民, 无法接入银河市场网络",
    "Trophy Room": "荣誉室",
    "Premium store": "高级商店",

    // Chat
    "chat": "聊天",
    "main": "主要",
    "help": "帮助",
    "Recruit": "招募",
    "Trade": "交易",
    "Whispers": "私聊",

    "Search player": "搜索玩家",
    "Say something": "说点什么",
    "Send": "发送",

    // 统计和基本信息
    "Stats": "统计数据",
    "Statistics": "统计",
    "Points": "点数",
    "Reset": "重置",
    "Are you sure you want to reset your stats": "你确定要重置你的属性吗",
    "WARNING": "警告",
    "This action CANNOT BE UNDONE": "此操作无法撤销",
    "Assign": "分配",
    "Save": "保存",

    "Power": "力量",
    "Adds damage to your weapon": "增加武器伤害",
    "Precision": "精准",
    "Increases your hit chance": "提高命中几率",
    "Evasion": "闪避",
    "Increases your evade chance": "提高闪避几率",
    "Hull": "船体",
    "Increases your health points. Additive with your shield defense": "增加生命值, 与护盾防御叠加",

    // 玩家和克隆体属性
    "Player Damage": "玩家伤害",
    "Player Health": "玩家生命",
    "Clones Health": "克隆体生命",

    // 加成
    "Bonuses": "加成",

    "Droids dodge chance": "机器人闪避几率",
    "Rare Resources Drop Chance": "稀有资源掉落几率",
    "Rare Resource drop chance": "稀有资源掉落几率",
    "Engine cooldown reduction": "引擎冷却时间减少",
    "Scan reward boost": "扫描奖励提升",

    "Damage Bonuses": "伤害加成",

    "chemical": "化学",
    "electromagnetic": "电磁",
    "energy": "能量",
    "explosive": "爆炸",
    "incendiary": "燃烧",
    "kinetic": "动能",

    // 飞船
    "SHIP": "飞船",

    "Ship Skins": "飞船皮肤",
    "Available Ship Skins": "可用飞船皮肤",
    "Starter Ship": "初始飞船",
    "Sentinel": "哨兵",
    "Eclipse": "日蚀",
    "Buy more from the premium store": "从高级商店购买更多",

    "Ship effects": "飞船效果",
    "Available Ship Effects": "可用飞船效果",
    "Remove effect": "移除效果",
    "Red Glow": "红色光芒",
    "Blue Glow": "蓝色光芒",

    // 库存
    "Inventory": "库存",
    "Description": "描述",
    "Quantity": "数量",
    "Level": "等级",
    "Category": "类别",
    "No items yet": "暂无物品",
    "ALL": "所有",
    "Slot": "栏位",
    "Charges": "充能次数",
    "Requirements": "需求",
    "Normal Currency": "普通货币",
    "Rare Currency": "稀有货币",

    "Equip": "装备",
    "Unequip": "卸下",
    "Link in chat": "链接到聊天中",
    "Craft": "制作",
    "Wire": "定向发送",
    "Scrap": "拆解",
    "Filter": "筛选",
    "Mass scrap filtered items": "批量拆解筛选物品",
    "Are you sure you want to scrap all items filtered": "你确定要拆解所有筛选的物品吗",
    "Scrap all": "全部拆解",
    "Cancel": "取消",

    "Rarity": "稀有度",
    "Starter normal": "初级",
    "normal": "普通",
    "uncommon": "罕见",
    "rare": "稀有",
    "unique": "独特",
    "epic": "史诗",
    "legendary": "传奇",

    "Ship parts": "飞船部件",
    "Gathering Resources": "收集资源",
    "Consumables": "消耗品",
    "Materials": "材料",
    "Material": "材料",

    "Currencies": "货币",
    "Credits": "信用点",
    "Cosmic Dust": "宇宙尘埃",
    "Stellar Tokens": "星币",

    // 飞船部件
    "Weapon": "武器",
    "damage": "伤害",
    "Shield": "护盾",
    "Defense": "防御",
    "Engine": "引擎",
    "Travel Boost": "航行增益",
    "Sensors": "传感器",
    "Scan Boost": "扫描增益",
    "Laser": "激光",
    "Probes": "探测器",
    "Gather Boost": "采集增益",

    "Crafted bonus": "制作加成",
    "Modification": "改装",

    // 采集资源
    "Rocky type": "岩石型",
    "Icy type": "冰型",
    "Gas type": "气态型",
    "Crystal type": "晶体型",

    "rocky": "岩石",
    "Icy": "冰",
    "gas": "气态",
    "Crystal": "晶体",

    "copper": "铜",
    "gold": "金",
    "silver": "银",
    "platinum": "铂",
    "dark matter": "暗物质",

    "water": "水",
    "nitrogen": "氮",
    "sulfur": "硫",
    "carbon": "碳",
    "silicon": "硅",

    "ammonia": "氨",
    "hydrogen": "氢",
    "helium": "氦",
    "methane": "甲烷",
    "argon": "氩",

    "diamond": "钻石",
    "ruby": "红宝石",
    "emerald": "绿宝石",
    "sapphire": "蓝宝石",
    "cobalt": "钴",

    // 敌人&材料
    "brute": "蛮兵",
    "brutes": "蛮兵",
    "spectre": "幽灵",
    "spectres": "幽灵",
    "Glacial": "冰川族",
    "Glacials": "冰川族",
    "machiner": "机械师",
    "machiners": "机械师",
    "Scorcher": "灼烧者",
    "Scorchers": "灼烧者",
    "Toxoid": "毒蚀体",
    "Toxoids": "毒蚀体",
    "Miner": "矿工",
    "Miners": "矿工",
    "Duster": "尘暴兵",
    "Dusters": "尘暴兵",

    "bones": "骨头",
    "Obtained from killing Brutes": "击杀蛮兵获得",
    "ectoplasm": "灵质",
    "Obtained from killing Spectres": "击杀幽灵获得",
    "frost shard": "霜屑",
    "Obtained from killing Glacials": "击杀冰川族获得",
    "cog": "齿轮",
    "Obtained from killing Machiners": "击杀机械师获得",
    "flame": "火焰",
    "Obtained from killing Scorchers": "击杀灼烧者获得",
    "slime": "粘液",
    "Obtained from killing Toxoids": "击杀毒蚀体获得",
    "horn": "兽角",
    "Obtained from killing Miners": "击杀矿工获得",
    "condensed sand": "压缩砂砾",
    "Obtained from killing Dusters": "击杀尘暴兵获得",

    //制作材料
    "metal scrap": "金属碎片",
    "metal scraps": "金属碎片",
    "Obtained scrapping ship parts": "通过拆解飞船部件获得",
    "ingots": "金属锭",
    "Produced at the Foundry. Used for Fuel Cell Casings at the Module Assembly Plant": "在铸造厂生产, 用于模块装配厂的燃料电池外壳",
    "refined crystals": "精炼水晶",
    "Produced at the Refinery. Used for Fuel Cell Casings at the Module Assembly Plant": "在精炼厂生产, 用于模块装配厂的燃料电池外壳",
    "high end crystals": "高级水晶",
    "Produced at the Crystal Synthesis Lab. Used for Unstable Fuel at the Fuel Lab": "在水晶合成实验室生产, 用于燃料实验室的不稳定燃料",
    "propulsors": "推进器",
    "Produced at the Noble Gas Processing Station. Used for Unstable Fuel at the Fuel Lab": "在惰性气体加工站生产, 用于燃料实验室的不稳定燃料",
    "nanoconductors": "纳米导体",
    "Produced at the Nanotech Complex. Used for Unstable Fuel at the Fuel Lab": "在纳米技术综合体生产, 用于燃料实验室的不稳定燃料",
    "microcircuits": "微电路",
    "Produced at the Circuit Integration Facility. Used for Fuel Cell Casings at the Module Assembly Plant": "在电路整合设施生产, 用于模块装配厂的燃料电池外壳",
    "fusion cells": "融合电池",
    "Produced at the Energetic Fusion Center. Used for Fuel Cell Casings at the Module Assembly Plant": "在能量融合中心生产, 用于模块装配厂的燃料电池外壳",
    "fuel cell casing": "燃料电池外壳",
    "Produced at the Module Assembly Plant. Used for Warp Capsules at the Space Capsule Complex": "在模块装配厂生产, 用于太空舱综合体的跃迁舱",
    "unstable fuel": "不稳定燃料",
    "Produced at the Fuel Lab. Used for Warp Capsules at the Space Capsule Complex": "在燃料实验室生产, 用于太空舱综合体的跃迁舱",
    "warp capsule": "跃迁舱",
    "warp capsules": "跃迁舱",
    "Produced at the Space Capsule Complex. Used for Interstellar travel": "在太空舱综合体生产, 用于星际旅行",

    // 战斗基本信息
    "Enemies": "敌人",
    "Weak against": "弱点",
    "Drops": "掉落",
    "Winrate": "胜率",
    "Rewards": "奖励",
    "Experience": "经验",
    "Reputation": "声望",
    "Enemies in your current system. Go to the Atlas or Galaxy Map to travel to other system and find more enemies": "当前星系中的敌人. 前往星图集或星图以旅行到其他星系寻找更多敌人",
    "Please select an enemy from the list to start battling": "请从列表中选择一个敌人开始战斗",
    "No item drops yet": "暂无物品掉落记录",

    // 战斗控制
    "Start battling": "开始战斗",
    "Starting battle": "正在开始战斗",
    "Stop battling": "停止战斗",
    "Next fight in": "下一场战斗倒计时",

    // 战斗日志与记录
    "Battle rounds log": "战斗回合日志",
    "Item drop log": "物品掉落日志",
    "Round": "回合",
    "Records per page": "每页记录数",
    "of": "共",
    "Clear": "清除",
    "Not Battling": "未在战斗",
    "You are not battling right now": "你当前未在战斗",
    "No battling right now": "当前无战斗",


    // 战斗动作与结果
    "Hit": "命中",
    "Dodge": "闪避",
    "hits": "命中",
    "misses hit on": "未命中",
    "dual shots": "双重射击",
    "for": "造成",
    "died": "死亡",
    "won": "胜利",
    "lost": "失败",
    "You": "你",
    "Dual Shot": "双重射击",

    // 克隆体相关
    "Clones": "克隆体",
    "Clone": "克隆体",
    "All clones": "所有克隆体",
    "Buy Clone": "购买克隆体",
    "Not enough credits": "信用点不足",
    "Clones fight for you against enemies. Their stats depend on your ship stats, weapon and shields. They also have their own skills. Each one performs an individual action every fight":
        "克隆体为你对抗敌人作战. 它们的属性取决于你的飞船属性、武器和护盾. 它们还有自己的技能, 每个克隆体在战斗中执行独立动作",

    // 属性与加成
    "Crit. Chance": "暴击几率",
    "Critical Chance": "暴击几率",
    "Crit. Damage": "暴击伤害",
    "Critical Damage": "暴击伤害",
    "Current bonuses": "当前加成",

    // 升级与购买
    "Upgrade": "升级",
    "Upgrade Clone": "升级克隆体",
    "upgrades": "升级",
    "Purchase": "购买",
    "Total Upgrade Costs": "总升级费用",
    "Confirm upgrades": "确认升级",
    "Level up in": "升级还需",


    // 采集基本信息
    "Gathering nodes": "采集节点",
    "Quality": "品质",
    "quality": "品质",
    "Resources": "资源",
    "Resource": "资源",
    "Available nodes in your current system. Go to the Atlas or Galaxy Map to travel to other system and find other nodes": "当前星系中的可用节点. 前往星图或银河地图以旅行到其他星系寻找更多节点",
    "none": "无",
    "Not Gathering": "未采集",
    "No gathering right now": "当前未进行采集",

    // 采集控制
    "Start gathering": "开始采集",
    "Stop gathering": "停止采集",
    "Next action in": "下一次行动倒计时",

    // 机器人相关
    "Droids": "机器人",
    "Droid": "机器人",
    "Buy droid": "购买机器人",
    "Upgrade Droid": "升级机器人",
    "Droids collect resource ores you get while mining. Each one performs an individual action": "机器人在你采矿时收集资源矿石. 每个机器人执行独立动作",

    // 机器人属性
    "Efficiency": "效率",
    "Enhances laser and probes efficiency": "提升激光与探测器的效率",
    "Storage": "存储",
    "Increases droids carrying capacity": "增加机器人携带容量",
    "Maneuverability": "机动性",
    "Increases droid chance to accomplish gathering task without dying": "增加机器人完成采集任务而不死亡的几率",

    // 采集统计与状态
    "Gathering statistics": "采集统计",
    "Droids statistics from last gathering action": "上次采集行动的机器人统计",
    "Currencies by node types": "按节点类型分的资源",
    "Status": "状态",
    "Survived": "存活",
    "Destroyed": "摧毁",
    "Amount": "数量",
    "Taxed": "纳税",

    // 加成来源
    //"from Space Station boost": "来自空间站加成",
    "Space station": " 空间站",
    "from Reputation": "来自声望",


    //星球类型
    "Crystal Planet": "水晶行星",
    "Icy Planet": "冰封行星",
    "Rocky Planet": "岩质行星",
    "Gas Planet": "气态巨行星",
    "Nebula": "星云",
    "Asteroid": "小行星",
    "Comet": "彗星",
    "Neutron Star": "中子星",

    "Main Star": "主恒星",
    "A type": "A型恒星",
    "K type": "K型恒星",
    "G type": "G型恒星",
    "O type": "O型恒星",
    "F type": "F型恒星",
    "M type": "M型",
    "B type": "B型",
    "Black Hole": "黑洞",
    "Belt": "星带",
    "Binary Stars": "双星系统",
    "Ringed Dwarf": "环带矮行星",

    // 蓝图选择
    "Available Blueprints": "可用蓝图",
    "Can craft": "可制作",
    "No blueprint selected": "未选择蓝图",
    "Choose one to start crafting": "选择一个开始制作",
    "Craft item": "制作物品",
    "item": "物品",
    "items": "物品",
    "This is the last charge. The blueprint will be destroyed after this use": "这是最后一次使用. 蓝图将在使用后销毁",

    // 改装与加成
    "Modifications": "改装",
    "You can select up to two different damage types. Having one gives 10% bonus but two gives 5% each": "最多可选择两种不同伤害类型. 选择一种获得10%加成, 选择两种每种获得5%加成",
    "Select bonus type": "选择加成类型",
    "Max 2 selections": "最多选择2项",
    "Current applied": "当前已应用",
    "Current applied modificators": "当前已应用改装",

    // 数值与范围调整
    "Item value range": "物品数值范围",
    "The base value applied to the formula can be modified paying with rare gathering currency": "使用稀有采集资源可修改公式的基础数值",
    "You can select up to two different damage types. Having one gives 30% bonus but two gives 15% each": "最多可选择两种不同的伤害类型。选择一种可获得30%加成, 选择两种则每种获得15%加成",
    "The range goes between -30% and 30%. You can only reduce the negative range": "范围在-30%到30%之间, 只能减少负范围",
    "Select one or leave the sliders as default. Crafting level also adds a multiplicative bonus": "选择一个或保持默认滑块. 制作等级还会增加乘法加成",
    "Damage range": "伤害范围",
    "Defense range": "防御范围",

    "Gather Boost range": "采集加成范围",
    "Travel Boost range": "旅行加成范围",

    // 输出
    "Output": "输出",
    "Missing some requirements": "缺少部分要求",
    "Item crafted successfully": "物品制作成功",
    "Done": "完成",

    // 建筑与模块
    "Modules": "模块",
    "Buildings": "建筑",

    "Foundry": "铸造厂",
    "Refinery": "精炼厂",
    "Crystal Synthesis Lab": "水晶合成实验室",
    "Noble Gas Processing Station": "惰性气体加工站",
    "Nanotech Complex": "纳米技术综合体",
    "Circuit Integration Facility": "电路整合设施",
    "Energetic Fusion Center": "能量融合中心",
    "Module Assembly Plant": "模块装配厂",
    "Fuel Lab": "燃料实验室",
    "Space Capsule Complex": "太空舱综合体",

    // 实验室描述
    "The Laboratory is a central feature in your spaceship, allowing you to build and manage up to": "实验室是你飞船的核心功能, 允许你建造和管理最多",
    "unique structures": "独特建筑",
    "essential for your space journey. These buildings form a supply chain, using resources gathered from various systems to produce materials needed by others": "对你的太空之旅至关重要. 这些建筑形成供应链, 利用从各星系收集的资源生产其他建筑所需的材料",
    "The main objective is to construct": "主要目标是建造",
    "These are used for interstellar travel, enabling exploration of new solar systems. Managing the Laboratory effectively is key to expanding your galactic reach": "这些用于星际旅行, 使你能够探索新的星系. 有效管理实验室是扩展银河影响力的关键",

    // 队列管理
    "Queue Status": "队列状态",
    "Queue statistics": "队列统计",
    "Queue size": "队列大小",
    "No laboratory building's queues pending": "没有实验室建筑的队列待处理",
    "Queue": "队列",
    "Queue production": "队列生产",
    "Timer": "计时器",
    "Max": "最大",

    // 生产与用途
    "Uses": "使用",
    "Produces": "生产",

    // 升级
    "Upgrade building": "升级建筑",
    "Each building upgrade reduces the queue time by 0.1 second": "每次建筑升级将队列时间减少0.1秒",
    "Level up": "升级",

    // 队列时间
    "Remaining": "剩余",
    "Total": "总计",
    "Time remaining": "剩余时间",
    "Queue finished": "队列已完成",

    // 旅行与导航
    "Engine cooldown": "引擎冷却",
    "Fast travel": "快速旅行",
    "Travel": "旅行",
    "Only available between starter systems": "仅在初始星系间可用",
    "Distance": "距离",
    "Total distance traveled": "总旅行距离",
    "Unknown system": "未知星系",
    "Mark on map": "在地图上标记",
    "Bookmark": "书签",
    "View system map": "查看星系地图",
    "Recharge fuel with": "燃料补充方式",
    "Not enough fuel": "燃料不足",
    "Engine is cooling down": "引擎冷却中",

    // 星系探索
    "New system discovered": "发现新星系",
    "System Data": "星系数据",
    "Distance from nearest starter system": "距最近初始星系的距离",
    "Atlas information": "星图信息",
    "You need to make a decision about the current discovered system. You can choose to make it public for everyone and get a reward, or you can make it private only for you (no reward": "你需要对当前发现的星系做出决定. 你可以选择公开给所有人并获得奖励, 或者设为仅你可见 (无奖励",
    "Reward for making it public": "公开星系的奖励",
    "Keep info for myself": "保留信息给自己",
    "Make it public": "设为公开",

    // 飞船与加成
    "Ship stats": "飞船属性",
    "Bonus from Equipment": "装备加成",
    "Exploring Experience": "探索经验",
    "Detailed cosmic dust gain": "宇宙尘埃获取详情",

    // 星系与天体信息
    "Gathering Bodies": "采集天体",
    "Inhabited": "有人居住",
    "yes": "是",
    "no": "否",
    "Bodies": "天体",
    "Systems visited": "访问过的星系",
    "Systems discovered": "发现的星系",
    "Most frequent system": "最常访问的星系",
    "Discovered by": "发现者",
    "Claimed by": "占领者",
    "SYSTEM MAP": "星系地图",
    "System info": "星系信息",
    "Has gathering nodes": "拥有采集节点",

    // 相机控制
    "Camera controls": "相机控制",
    "Center camera in the marked system": "将相机居中于标记星系",
    "Center camera in your current system": "将相机居中于当前星系",
    "Move camera down": "向下移动相机",
    "Move camera up": "向上移动相机",
    "Move camera to the right": "向右移动相机",
    "Move camera to the left": "向左移动相机",

    // SOS信号
    "SOS Signals": "SOS信号",
    "Online SOS Signals": "在线SOS信号",
    "Date": "日期",
    "User": "用户",
    "open": "打开",
    "Accept": "接受",
    "Close": "关闭",

    // 日志与记录
    "Journal": "日志",
    "Player Journal": "玩家日志",

    // 状态与操作
    "Ready": "就绪",

    // 星系与导航
    "Atlas Systems": "星图系统",
    "System Name": "星系名称",
    "Coordinates": "坐标",
    "System Distance": "星系距离",
    "Max distance": "最大距离",
    "ly": "光年",
    "This is the public list of systems discovered by players. Private systems are only shown to users who discovered it or if you travelled at least once": "这是玩家发现的公开星系列表. 私人星系仅对发现者或至少旅行过一次的用户显示",
    "unknown": "未知",
    "Highlight": "高亮",
    "Loading": "加载中",

    // 书签管理
    "Bookmarks": "书签",
    "This is a bookmark list to save your favourite systems": "这是一个书签列表, 用于保存你喜欢的星系",
    "Date added": "添加日期",
    "Add system bookmark": "添加星系书签",
    "No data available": "无可用数据",
    "Remove pin": "移除书签",
    "Remove": "移除",

    // 空间站
    "Space Stations": "空间站",
    "Station Name": "空间站名称",
    "List of Squadrons' space stations with public information. If the Space Station is parked in a private system, coordinates are hidden": "包含公开信息的舰队空间站列表. 如果空间站停靠在私人星系, 坐标将隐藏",

    // 搜索与过滤
    "Filters": "筛选",
    "Advanced filters": "高级筛选",
    "Search": "搜索",
    "Body types": "天体类型",
    "Body quality": "天体品质",
    "Min quality": "最低品质",

    // 市场与列表
    "Market listings": "市场列表",
    "My Listings": "我的列表",
    "My listings": "我的列表",
    "Listings": "列表",
    "My item listings": "我的物品列表",
    "Listings history": "列表历史",
    "Item listings history": "物品列表历史",
    "Listing date": "上架日期",
    "No listings yet": "暂无列表",

    // 材料类型
    "Laboratory Materials": "实验室材料",
    "Enemy Drop Materials": "敌人掉落材料",

    // 买卖订单
    "Select a currency from the list to show its listing orders": "从列表中选择一种物品以显示其订单",
    "Buy orders": "购买订单",
    "New buy listing": "新建购买列表",
    "Sell orders": "出售订单",
    "New sell listing": "新建出售列表",
    "Best buy offer": "最佳购买报价",
    "Best sell offer": "最佳出售报价",
    "Buy": "购买",
    "Sell": "出售",
    "sale": "出售",
    "Create listing": "创建列表",

    // 价格与数量
    "Unit Price": "单价",
    "Price": "价格",
    "My offer": "我的报价",
    "My price": "我的价格",
    "Each": "每个",
    "Total listing price": "总列表价格",
    "Total payment": "总付款",
    "You pay now as listing fee": "你现在需支付的列表费用",
    "Qty Remaining": "剩余数量",
    "You have": "你拥有",

    // 我的物品
    "My items": "我的物品",
    "Crafted": "已制作",
    "Value": "价值",
    "You have no weapon to sell": "你没有可出售的武器",

    // 筛选与排序
    "All rarities": "所有稀有度",
    "Filter rarity": "筛选稀有度",
    "Filter value": "筛选价值",
    "Value greater than": "价值大于",

    // 其他
    "Seller": "卖家",
    "Currency": "货币",
    "Action": "操作",
    "Operation": "操作",

    // 舰队基本信息
    "Squadrons": "舰队",
    "Squadron Name": "舰队名称",
    "Squadron description": "舰队描述",
    "Created": "创建时间",
    "Galaxy Power": "银河影响力",
    "Squadron galaxy power management": "舰队银河影响力管理",

    // 成员与权限
    "Members": "成员",
    "Member": "成员",
    "Leader": "领袖",
    "Squadron members list": "舰队成员列表",
    "Member list": "成员列表",
    "Rank": "等级",
    "Your": "你的",
    "Leave squadron": "离开舰队",

    // 申请与邀请
    "Applications": "申请",
    "Applications activity": "申请动态",
    "No Applications": "暂无申请",
    "Invites registered yet": "尚未注册邀请",
    "apply": "申请",
    "accepted": "已接受",
    "invite": "邀请",
    "My Squadron": "我的舰队",
    "Create Squadron": "创建舰队",
    "You are not in a squadron": "你不在任何舰队中",
    "Select one from the list to see its info": "从列表中选择一个以查看其信息",
    "Common Resources": "通用资源",
    "Rare Resources": "稀有资源",
    "Create": "创建",
    "Invite player": "邀请玩家",
    "Offline": "离线",
    "Unlock Cost": "解锁花费",
    "Buy building": "购买建筑",
    "The Squadron doesn't have claimed systems": "该舰队没有已占领的星系",
    "Build Space Stations and claim any system": "建造空间站并占领任意星系",
    "Edit Squadron": "编辑舰队",
    "Discard": "放弃",
    "Decline": "拒绝",
    "Sent": "发送",
    "Kick": "踢出",
    "Save changes": "保存更改",

    // 捐献
    "Donations": "捐献",
    "Donate": "捐献",
    "Member's Donations": "成员捐献",
    "Ranking of Squadron members donations, not including taxes": "舰队成员捐献排名, 不包括税费",
    "No donations registered yet": "尚未注册捐献",

    // 当前状态
    "Batling": "战斗中",
    "Current System": "当前星系",
    "Current Node": "当前节点",

    // 空间站与建筑
    "Stellar Dock": "星际船坞",
    "Stellar Dock buildings": "星际船坞建筑",
    "These buildings collect resources via taxes. Each one produces one of the four parts needed to build a Space Station to be able to claim a system": "这些建筑通过税收收集资源, 每栋建筑生产建造空间站所需的四种部件之一, 以占领星系",
    "Available Space Station parts": "可用空间站部件",
    "Space Stations available for deploy": "可部署的空间站",
    "Build Space Station": "建造空间站",
    "Space stations management where you can build an update ever space station located on your claimed systems": "空间站管理, 你可以在已占领的星系中建造和更新空间站",
    "Name": "名称",
    "Manage": "管理",

    // 建筑类型
    "Building": "建筑",
    "Workshop": "车间",
    "A mega factory where the space station structure is built": "建造空间站结构的超级工厂",
    "hull parts": "船体部件",
    "AI": "人工智能",
    "The AI centre will provide all the necessary technology to operate the space station": "人工智能中心提供运行空间站所需的所有技术",
    "control systems": "控制系统",
    "Bioscience": "生物科学",
    "Dedicated to life support, waste recycling and medical attendance": "致力于生命支持、废物回收和医疗服务",
    "ambient systems": "环境系统",
    "Engineering": "工程",
    "The Engineering centre will produce engines and the internal gravity module for the space station": "工程中心生产空间站的引擎和内部重力模块",
    "propulsion systems": "推进系统",
    "Missing requirements": "不满足要求",
    "Type": "类型",
    "Message": "消息",

    // 税收
    "Tax": "税收",
    "Select tax": "选择税收",

    // 战斗与结果
    "View last battle review": "查看上次战斗回顾",
    "View battle": "查看战斗",
    "You won": "你赢了",
    "You lost": "你输了",
    "attacks": "攻击",
    "Results": "结果",
    "Repeat": "重复",
    "Pause": "暂停",
    "Start": "开始",

    // 空间站升级
    "Station upgrades": "空间站升级",
    "defense level": "防御等级",
    "Defense boost": "防御加成",
    "Gives multiplicative boost to defender's stats. Each level gives 5% boost": "为防御者属性提供乘法加成. 每级增加5%加成",
    "portal level": "传送门等级",
    "Defense portal": "防御传送门",
    "Increases the range where players can defend from distance. Each lvl increases the range by 50ly": "增加玩家远程防御的范围. 每级增加50光年范围",
    "Income boost level": "收入加成等级",
    "Income boost": "收入加成",
    "Increases battling and gathering income. Each level gives 2% boost": "增加战斗和采集收入. 每级增加2%加成",
    "attack delay level": "攻击延迟等级",
    "Attack delay": "攻击延迟",
    "Each level increases the attack delay by 1 minute. Base attack delay is 15m": "每级增加1分钟攻击延迟. 基础攻击延迟为15分钟",

    // 一次性购买与改造
    "One time purchases": "一次性购买",
    "Terraforming": "改造",
    "Terraform": "改造",
    "You can make this system inhabited by terraforming it with this building. It only works with not inhabited systems. Only inhabited systems have access to the Market and currency wires": "通过此建筑改造可使星系有人居住, 仅对无人星系有效. 只有有人居住的星系可访问市场和货币网络",
    "Only the Squadron leader can terraform systems": "仅舰队领袖可改造星系",


    // 荣耀室
    "Available Trophies": "可收集勋章",
    "Collections": "收藏系列",
    "Ringed Dwarf Runes": "环状矮星符文",
    "Binary Stars Runes": "双星系统符文",
    "Black Hole Runes": "黑洞符文",
    "Neutron Star Runes": "中子星符文",
    "No collection selected": "未选择收藏系列",
    "Choose one to learn more": "选择系列查看详情",
    "Ringed Dwarf Runes Collection": "环状矮星符文收藏集",
    "Binary Stars Runes Collection": "双星系统符文收藏集",
    "Black Hole Runes Collection": "黑洞符文收藏集",
    "Neutron Star Runes Collection": "中子星符文收藏集",

    //订阅相关
    "Subscription": "订阅",
    "Monthly": "月度",
    "Yearly": "年度",
    "month": "月",
    "One month": "1个月",
    "Three months": "3个月",
    "Six months": "6个月",
    "You will be adding 1 month(s) for": "您将续订1个月, 费用为",
    "Subscription will be extended until": "订阅有效期将延长至",
    "Active": "生效中",
    "Expires": "到期",
    "Premium bonuses": "高级特权",

    //高级功能
    "Premium Products": "高级产品",
    "Get exclusive access to rewards, skins, and special perks every month with the Premium Subscription": "通过高级订阅每月获取专属奖励、皮肤和特殊福利",

    //货币相关
    "Premium Currency": "高级货币",
    "With money": "现金支付",
    "With Stellar Tokens": "星币支付",
    "Stellar Tokens pack": "星币包",
    "USD": "美元",
    "EUR": "欧元",
    "Current tokens": "当前代币",
    "After purchase": "购买后余额",
    "The nature of Stellar Odyssey's premium currency, which is credited immediately and is transferable among players, implies that any request for a refund is not allowed": "星币即时到账且可玩家间转让, 因此不接受任何退款请求",
    "By ticking this checkbox, you formally acknowledge and agree that the acquisition of Stellar Tokens constitutes the purchase of in-game digital currency and is therefore non-refundable": "勾选此框即表示您确认星币属于游戏内数字货币, 不可退款",

    //社交装扮
    "Social Cards": "社交卡牌",
    "Social Backgrounds": "社交背景",
    "Chat name colors": "聊天名称颜色",
    "Chat icons": "聊天图标",

    //增益效果分组
    "You will gain": "您将获得",
    "Battling Actions": "战斗行动",
    "Increases idle time for Battling actions from 6hs to 10hs": "战斗行动闲置时间从6小时延长至10小时",
    "Gathering Actions": "采集行动",
    "Increases idle time for Gathering actions from 6hs to 10hs": "采集行动闲置时间从6小时延长至10小时",
    "Laboratory queue slots": "实验室队列槽位",
    "Extends your maximum Laboratory queue to up to 5 buildings simultaneously": "实验室同时建造队列上限扩展至5个",

    //奖励加成
    "multiplicative cosmic dust rewards": "宇宙尘埃乘数奖励",
    "Increases your cosmic dust rewards multiplicatively after all other boosts by": "在其他加成基础上额外获得宇宙尘埃乘数奖励: ",
    "multiplicative credit rewards": "信用点乘数奖励",
    "Increases your credit rewards multiplicatively after all other boosts by": "在其他加成基础上额外获得信用点乘数奖励: ",
    "multiplicative resource rewards": "资源乘数奖励",
    "Increases your resource rewards multiplicatively after all other boosts by": "在其他加成基础上额外获得资源乘数奖励: ",
    "multiplicative XP bonus": "经验乘数奖励",
    "Increases experience multiplicatively after all other boosts by": "在其他加成基础上额外获得经验乘数奖励: ",

    //特殊功能
    "Unlimited stats reset": "无限属性重置",
    "Enables the option to reset your space ship stats an unlimited number of times": "解锁飞船属性无限重置功能",
    "Increases your fuel tank capacity by 20 units": "燃料舱容量增加20单位",

    //飞船皮肤
    "Eclipse v": "日蚀v型",
    "Inferno v": "炼狱v型",
    "Phantom": "幻影",
    "Titan v": "泰坦v型",
    "Valkyrie": "女武神",

    //发光效果
    "Green Glow": "绿光",
    "Yellow Glow": "黄光",
    "Magenta Glow": "品红光",
    "Purple Glow": "紫光",
    "White Glow": "白光",
    "RGB Glow": "RGB流光",

    //背景主题
    "Northern lights": "极光",
    "Solar Burst": "太阳爆发",
    "Nebula Pulse": "星脉波动",
    "Toxic Core": "剧毒核心",
    "Infernal Star": "地狱之星",
    "Celestial Tide": "天界潮汐",
    "Hypernova": "超新星",
    "Solar Flare": "耀斑爆发",
    "Cosmic Dawn": "宇宙黎明",
    "Aurora Burst": "极光迸发",
    "Event Horizon": "事件视界",
    "Gamma Surge": "伽马涌动",
    "Galactic Rift": "银河裂隙",

    //颜色选项
    "default": "默认",
    "green": "绿色",
    "orange": "橙色",
    "turquoise": "青绿色",
    "pink": "粉色",
    "purple": "紫色",
    "violet": "紫罗兰",
    "salmon": "鲑鱼红",
    "coral": "珊瑚色",
    "yellow": "黄色",
    "aquamarine": "海蓝色",
    "blue": "蓝色",
    "crimson": "深红色",

    //特效风格
    "wave": "波浪",
    "neon": "霓虹",
    "sunshine": "阳光",
    "ice": "冰霜",
    "sakura": "樱吹雪",
    "galaxy": "银河",
    "nature": "自然",
    "rainbow": "彩虹",
    "galactic": "星际",
    "spectrum": "光谱",
    "aura": "光环",

    //行星主题
    "violet planet": "紫晶行星",
    "green planet": "翠绿行星",
    "light brown planet": "浅褐行星",
    "planet red": "赤红行星",
    "light yellow planet": "淡黄行星",
    "white planet": "纯白行星",
    "blue planet": "蔚蓝行星",
    "ringed planet": "环状行星",
    "alien": "异星",

    //购买相关
    "Ship preview": "飞船预览",
    "Buy for": "购买价格",
    "I understand and agree": "我理解并同意",

    // 排名
    "Categories": "类别",
    "Updates in": "更新于",
    "Levels": "等级",
    "Username": "用户名",
    "Clones count": "克隆体数量",
    "Droids count": "机器人数量",
    "Clones Efficiency": "克隆体效率",
    "Clones storage": "克隆体存储",
    "Clones maneuverability": "克隆体机动性",
    "Total credits earned": "总计获得信用点",
    "Total Resources earned": "总计获得资源",
    "Resources earned": "获得的资源",
    "Total crafted items": "总计制作物品",
    "Credits earned": "获得信用点",
    "Exploring level": "探索等级",
    "Crafting level": "制作等级",
    "Gathering level": "采集等级",
    "Total actions": "总计行动",
    "Battling level": "战斗等级",
    "Discovered systems": "发现的星系",
    "Traveled systems": "旅行过的星系",
    "Built Space Stations": "建造的空间站",
    "Stranded users": "受困用户",
    "Rescuer users": "救援者用户",

    //入门指南
    "Congratulations on joining forces with us": "欢迎加入我们的行列",
    "Welcome to the Critical Orientation System Office (COSO": "欢迎来到关键导航系统办公室(COSO",
    "Here at COSO, we will show you some suggestions tailored by our experts specifically for you": "在COSO, 我们将为您展示专家团队为您量身定制的建议",
    "Don't forget to check our Wiki": "别忘了查阅我们的维基百科",
    "Where am I": "我的位置",
    "Your ship has been sent to 1 out of 5 starter systems. Each of them has different bodies with different": "您的飞船已被派往5个初始星系之一. 每个星系都有不同的星体, 包含不同的",
    "NPCs": "NPC角色",
    "You can travel between them at the": "您可以通过",
    "Understood": "明白了",
    "About Actions": "关于行动",
    "About Battling": "关于战斗",
    "About Gathering": "关于采集",
    "Do the Science": "科学研究",
    "Skip": "跳过",
    "Actions are": "所有行动都是",
    "server-side": "服务器端处理",
    "so you can close your browser and the game will continue executing them": "因此即使关闭浏览器, 游戏仍会继续执行这些行动",
    "Each action takes": "每个行动需要",
    "Remember! You can": "记住！您可以同时",
    "Gather": "采集",
    "Battle": "战斗",
    "at the same time": "进行",
    "Wait, what": "等等, 什么？",
    "Defeating": "击败",
    "will give you credits, and also gives you a chance of obtaining": "将获得信用点, 并有几率获得",
    "Each enemy type provides different drop possibilities": "每种敌人类型都有不同的掉落物品",
    "You can mine nodes from systems to get resources": "您可以通过开采星系节点获取资源",
    "Remember! Each body has a quality % assigned, affecting the resource quantity obtained on each action": "注意！每个星体都有质量百分比设定, 这将影响每次行动获取的资源数量",
    "The": "该",
    "and": "和",
    "includes a total of 10 buildings that you can unlock to create greater materials": "包含10种可解锁的建筑, 用于制造高级材料",
    "used to recharge fuel on your Ship and explore unknown systems": "用于为飞船补充燃料并探索未知星系",
    "OK LET'S PLAY": "好的, 开始游戏",

    // 个人信息
    "User information": "用户信息",
    "Current user information and email address": "当前用户信息和电子邮件地址",
    "Guest account": "访客账户",
    "Email": "电子邮件",
    "Registered": "已注册",

    "Preferences": "偏好设置",
    "Custom Language channel": "自定义语言频道",
    "Select you language": "选择你的语言",
    "Español": "西班牙语",

    "Security": "安全",
    "Enable or disable two factor authentication": "启用或禁用双重身份验证",
    "Disabled": "已禁用",
    "Enable": "启用",
    "Update password": "更新密码",
    "Secure your account with a strong password with at least 8 characters": "使用至少8个字符的强密码保护你的账户",
    "Your current password": "当前密码",
    "New Password": "新密码",
    "Confirm new password": "确认新密码",
    "Reset password": "重置密码",

    "Premium Subscription": "高级订阅",
    "Check your subscription status here": "在此查看你的订阅状态",
    "Inactive": "未激活",
    "Max Actions": "最大行动数",
    "Max Fuel": "最大燃料",

    "This field is required": "此字段为必填",

    "XP bonus": "经验值加成",
    "Tier": "等级",
    "Income bonus": "收入加成",
    "Cooldown bonus": "冷却时间缩减",
    "from subscription": "来自订阅",
    "from global boosts": "来自全局加成",

    "Global Consumables": "全局加成",
    "multiplicative max fuel after all other boosts": "所有其他加成后的最大燃料倍数",
    "Increases your fuel tank capacity by": "增加你的燃料箱容量",
    "Increases experience gained in battling, gathering, crafting and exploring": "增加在战斗、采集、制作和探索中获得的经验",
    "min": "分钟",
    "Income": "收入",
    "Increases credit, resources and cosmic dust gains": "增加信用点、资源和宇宙尘埃的获取",
    "Cooldown": "冷却时间",
    "Reduces engine cooldown after traveling": "减少旅行后的引擎冷却时间",


    //时间单位
    'ms': '毫秒',
    'millisecond': '毫秒',
    'milliseconds': '毫秒',
    's': '秒',
    'second': '秒',
    'seconds': '秒',
    'minute': '分',
    'minutes': '分',
    'hour': '时',
    'hours': '时',
    'day': '天',
    'days': '天',
    'year': '年',
    'years': '年',
    //月份
    "Jan": "一月",
    "Feb": "二月",
    "Mar": "三月",
    "Apr": "四月",
    "May": "五月",
    "Jun": "六月",
    "Jul": "七月",
    "Aug": "八月",
    "Sep": "九月",
    "Oct": "十月",
    "Nov": "十一月",
    "Dec": "十二月",

    //舰队新内容
    "Borrow": "借用",
    "Retrieve": "取走",
    "Return": "还回",
    "Available": "可借用",
    "Belongs to": "属于舰队: ",
    "Ranks": "职级",
    "Armory": "军械库",
    "Taxes": "税率",
    "Logs": "日志",
    "Last seen": "最后在线",
    "minutes ago": "分钟之前",
    "a few seconds ago": "一分钟以内",
    "hours ago": "小时之前",
    "an hour ago": "一小时之前",
    "Current storage": "当前库存",
    "borrowed item": "借走物品",
    "donated item": "捐献物品",
    "Staff": "员工",
    "days ago": "天之前",
    "Squadron logs": "舰队日志",
    "Log": "日志",
    "Upgrade space station": "升级空间站",
    "Squadron global taxes": "舰队全局税收",
    "IMPORTANT": "重要",
    "These taxes are calculated before Stellar Dock taxes. If a global tax is enabled, it will take the amount taxed as the base for stellar dock calculations": "这些税收在星际船坞税前计算。如果启用了全局税收，星际船坞将以其税后数额为基础进行计算",
    "Example": "示例",
    "User gathers 1000 gold. Rocky tax set 50% and Workshop building 80%. 500 rocky will go to the user, the other 500 will be used for Stellar dock calcs. So with 80% tax, 400 will go to the Workshop and 100 to the Squadron Inventory": "玩家采集 1000 金币。岩石税率设为 50%，车间建筑税为 80%。500 岩石归玩家，剩下 500 用于星际船坞计算。以 80% 税率计算，400 归车间，100 进入舰队库存",
    "Squadron taxes": "舰队税收",
    "ly (Closest)": "光年（最近）",
    "These buildings collect resources via": "这些建筑通过以下方式采集资源",
    "Each one produces one of the four parts needed to build a Space Station to be able to claim a system": "每个建筑产出建造空间站所需的四种材料之一，用于占领星系",
    "Start building": "开始建造",
    "Battling boost": "战斗增益",
    "craft xp boost": "制作经验增益",
    "Make system inhabited with terraforming": "通过地貌改造使星系可居住",
    "Find gathering node in a barren body or boost one": "在荒芜星体中寻找采集点，或提升一个采集点",
    "It only works with not inhabited systems": "仅适用于未有人居住的星系",
    "Select body": "选择星体",
    "System already inhabited": "星系已被占领",
    "Space portal": "空间传送门",
    "Once purchased you can teleport to other station with a portal enabled": "购买后可传送至其他启用了传送门的空间站",
    "Activate": "激活",
    "Squadron headquarter buildings": "舰队总部建筑",
    "These buildings give bonuses or upgrades related to the Squadron": "这些建筑提供与舰队相关的加成或升级",
    "Increases armory size by 12 each": "每座建筑增加 12 点军械库容量",
    "Academy": "学院",
    "Increases squadron max members by 1 each level. Max": "每级增加 1 名舰队最大成员数，最大值为",
    "Borrow lends the item to the user. Retrieve removes the item from the armory": "[借用]将物品借给用户，[取走]则将从军械库中移除物品",
    "Squadron Inventory": "舰队库存",
    "cancelled": "已取消",
    "Squadron Ranks": "舰队职级",
    "New Rank": "新增职级",
    "Rank name": "职级名称",
    "Permissions": "权限",
    "Members with this rank": "拥有该职级的成员",
    "junkyard": "废品场",
    "pvp": "PVP",
    "stellardock": "星际船坞",
    "Edit": "编辑",
    "Delete": "删除",
    "a minute ago": "1 分钟前",
    "Donate to Armory": "捐献到军械库",
    "Selyn pet must be active": "必须激活宠物[塞琳]",
    "Item donated to the Armory": "物品已捐献到军械库",

    // 宠物
    "Pets": "宠物",
    "Booster Pets": "增益型宠物",
    "QoL Pets": "生活便利宠物",
    "Generator Pets": "生成型宠物",
    "Active slots": "激活槽位",
    "Dragon": "龙",
    "Boosts credit and battling XP gains": "提升信用点和战斗经验获取",
    "Food": "食物",
    "Current Boost": "当前增益",
    "Credits 10% XP": "信用点 +10% 经验值",
    "XP Boost": "经验增益",
    "Current XP": "当前经验值",
    "h": "小时",
    "Active time": "激活时长",
    "mins": "分钟",
    "Feed with": "喂食使用",
    "Unequip pet": "卸下宠物",
    "Dog": "狗",
    "Boosts resources and gathering XP gains": "提升资源与采集经验获取",
    "Resources 9% XP": "资源 +9% 经验值",
    "Pets Store": "宠物商店",
    "Owl": "猫头鹰",
    "Boosts cosmic dust and exploring XP gains": "提升宇宙尘与探索经验获取",
    "Cat": "猫",
    "Boost crafting min range and XP gains": "提升制作最小范围与经验值获取",
    "Drone": "无人机",
    "Boosts drop chances on items, blueprints and npc materials": "提升道具、蓝图与 NPC 材料掉落几率",
    "Drop Chance": "掉落几率",
    "Quadruped": "四足兽",
    "Boosts the rarity drop chance on items and blueprints": "提升道具与蓝图的稀有掉落概率",
    "Rarity Chance": "稀有度几率",
    "Humanoid": "类人生物",
    "Salvage items to produce blueprints": "拆解物品生成蓝图",
    "Roller": "滚轮兽",
    "Squadron tax bonus. Enhances taxed currency and resources": "舰队税收加成。增强税后货币和资源",
    "Darnex": "达尔内克斯",
    "Generates ship stats periodically": "周期性生成舰船属性",
    "Stat per Day": "每日属性产出",
    "avg": "平均",
    "Korin": "科林",
    "Overcharges warp capsules to recharge more fuel": "超载充能跃迁舱以补充更多燃料",
    "Enhances warp capsules": "强化跃迁舱",
    "Selyn": "塞琳",
    "Enhances items and blueprints rarity": "提升道具与蓝图的稀有度",
    "Velari": "维拉里",
    "Boosts your stats for PvP squadron fights": "提升你在舰队 PvP 战斗中的属性",
    "Enhance": "强化",
    "Enhance your current warp capsules to create a new one that let you jump beyond your fuel capacity": "强化现有跃迁舱，创造一个可超越燃料上限跃迁的新跃迁舱",
    "overcharged fuel": "超载燃料",
    "Cooldown reduction": "冷却缩减",
    "Enhance cost": "强化成本",
    "Normal Warp Capsule": "普通跃迁舱",
    "Enhanced Warp Capsule": "强化跃迁舱",
    "Confirm": "确认",

    "from": "来自",
    "Dragon pet": "宠物[龙]",
    "from Space Station boost": "来自空间站加成",
    "from Dog pet": "来自宠物[狗]",
    "Global tax": "全局税收",

    "Pet food": "宠物食物",
    "pet food": "宠物食物",

    "Craft pet food": "制作宠物食物",
    "Owned": "已拥有",
    "of any common resource": "任意普通资源",
    "of any rare resource": "任意稀有资源",
    "of any NPC material drop": "任意 NPC 材料掉落",
    "You need to select one resource from each resource type": "你需要从每种资源类型中选择一个资源",
    "Normal resources": "普通资源",
    "Normal resource selected": "已选择普通资源",
    "Rare resource selected": "已选择稀有资源",
    "NPC Material drop": "NPC 掉落材料",
    "NPC Material drop selected": "已选择 NPC 掉落材料",

     "Unlock pets and equip them to gain their bonuses. There is one hour cooldown when you unequip one pet. This can be reduced": "解锁宠物并装备以获得其加成。卸下宠物后有一小时冷却时间，可被缩短",
    "retrieved item": "已回收物品",
    "returned item": "已归还物品",
    "Miscellaneous": "其他",
    "multiplicative Pet XP bonus": "宠物经验乘算加成",
    "Increases pet experience multiplicatively after all other boosts by": "在其他所有加成后额外乘算提升宠物经验",
    "A new browser tab will open to continue the checkout process": "将打开一个新的浏览器标签页以继续结账流程",
    "Get game premium subscription with monthly": "订阅游戏高级版（按月计费）",
    "yearly recurrent payments. Cancel anytime": "按年自动续费，随时可取消",
    "Select Currency": "选择货币",
    "Purchase 10 tokens for": "购买 10 代币，价格为",
    "Purchase 100 tokens for": "购买 100 代币，价格为",
    "Purchase 1,100 tokens for": "购买 1,100 代币，价格为",
    "QoL and Miscellaneous upgrades for Stellar Tokens": "使用星耀代币购买功能性与杂项升级",
    "Purchase 0 max actions for 0 tokens": "使用 0 代币购买 0 次最大行动数",
    "Username rename": "修改用户名",
    "User new name": "用户新名称",
    "Purchase Squadron rename for 50 tokens": "使用 50 代币更改舰队名称",
    "Increases drop chance for items and blueprints": "提升道具与蓝图的掉落概率",
    "Blaze": "烈焰",
    "Hunter": "猎手",
    "Inferno": "炼狱",
    "Infinity": "无限",
    "Tempest": "风暴",
    "Titan": "泰坦",
    "Vanguard": "先锋",
    "Grey": "灰色",
    "lighting": "照明",
    "enhanced": "强化",
    "stars": "星星",
    "paw": "爪印",

    //PVP
    "Battlefield": "战场",
    "PvP Groups": "PvP 小队",
    "PvP Badges": "PvP 徽章",
    "Squadron PvP Groups": "舰队 PvP 小队",
    "Group": "小队",
    "Select member": "选择成员",
    "Add member from the list to this group": "从列表中添加成员到该小队",
    "Members list": "成员列表",
    "Empty group": "空小队",
    "HP": "生命值",
    "You cannot modify the group while occupying a zone": "占领区域期间无法修改小队",
    "Map": "地图",
    "Vendor": "商人",
    "PvP Setup": "PvP 设置",
    "Battle Log": "战斗日志",
    "Player Badges": "玩家徽章",
    "Squadron Badges": "舰队徽章",
    "Battlefield reset in": "战场重置倒计时",
    "Badges": "徽章",
    "bonus": "加成",
    "Badges gain": "徽章获取",
    "waiting": "等待中",
    "Unprotected": "未受保护",
    "NPC materials bag": "NPC 材料袋",
    "Select one material and enter the quantity": "选择一种材料并输入数量",
    "Enhanced Legendary blueprints": "强化传奇蓝图",
    "Select the item type. All blueprints have 1 charge. Maxroll guaranteed": "选择物品类型。所有蓝图仅有一次使用次数，最大属性保底",
    "Squadron PvP Badges": "舰队 PvP 徽章",
    "Banners": "旗帜",
    "Better Protection": "更强保护",
    "Protection": "保护",
    "Current protection": "当前保护",
    "Each lvl gives 5 minutes of additional protection": "每级提供额外 5 分钟保护时间",
    "M each": "每M",
    "Reduced Cooldowns": "冷却时间减少",
    "Current cooldown": "当前冷却时间",
    "Each lvl reduces leave zone and counterattack cooldowns by 2 minutes": "每级减少离开区域与反击的冷却时间 2 分钟",
    "PvP Stats": "PvP 统计",
    "Defender": "防御者",
    "Attacker": "攻击者",
    "Tile": "格子",
    "stats bonus": "属性加成",
    "gathering bonus": "采集加成",
    "battling bonus": "战斗加成",
    "exploring bonus": "探索加成",
    "No Skill Just Luck": "技术无用，全靠运气",
    "crafting bonus": "制作加成",
    "add member to group": "添加成员到分组",
    "remove member from group": "将成员移出分组"
}
const REGEX_RARITY = '(starter normal|normal|uncommon|rare|unique|epic|legendary)';
const REGEX_SHIP_PART = '(weapon|shield|engine|sensors|laser|probes)';
const REGEX_RARITY_SHIP_PART = REGEX_RARITY + ' ' + REGEX_SHIP_PART;

const PreProcessRules = [
    // 排除非英文
    {
        id: 'excludeNotEnglish',
        conditions: {
            regex: /^[^a-zA-Z]*$/
        },
        exclude: true,
    },
    // 排除纯数字
    {
        id: 'excludePureNumber',
        conditions: {
            regex: /^[\d,\.]+\s?[kmb%]?$/i
        },
        exclude: true,
    },

    // 排除所有图标
    {
        id: 'excludeIcon',
        conditions: {
            css: ".q-icon"
        },
        exclude: true,
    },
    // 排除舰队名
    {
        id: 'excludeSquadronName',
        conditions: {
            css: ".squadron_name"
        },
        exclude: true,
    },
    // 排除header玩家名
    {
        id: 'excludeHeaderPlayerName',
        conditions: {
            css: 'header > div:first-child > div:nth-child(3) > div:last-child > button:first-child > span:nth-child(2) > div:first-child > span'
        },
        exclude: true,
    },
    // 排除header展开的玩家名
    {
        id: 'excludeHeaderMenuPlayerName',
        conditions: {
            css: '[role="menu"] > div.profile_menu:first-child > div:first-child > div:nth-child(2)'
        },
        exclude: true,
    },
    // 排除聊天里所有非物品图标的内容: 时间, 玩家名, 聊天内容
    {
        id: 'excludeChatNotCaption',
        conditions: {
            css: '.chatMinH *:not(span.text-caption.font-weight-light)'
        },
        exclude: true,
    },
    // 排除聊天里搜索下拉框里的玩家名
    {
        id: 'excludeChatSearchPlayerName',
        conditions: {
            css: 'body:has(footer label.q-field--float)>div[id^="q-portal--menu"] > [role="listbox"] > [class^="q-virtual"] *'
        },
        exclude: true,
    },
    // 排除玩家页面里的名字
    {
        id: 'excludePlayerPageName',
        conditions: {
            hash: '#/player',
            or: [
                // 发送物资里的搜索玩家名
                { css: '[id^="q-portal--menu"] > [role="listbox"] > [class^="q-virtual"] *' },
            ]
        },
        exclude: true,
    },
    // 排除pvp信息里的舰队名, 成员名
    {
        id: 'excludePvpMarker',
        conditions: {
            css: '.pvp_marker *'
        },
        exclude: true,
    },
    // 排除SOS和玩家日志里的名字
    {
        id: 'excludeGalaxyPageName',
        conditions: {
            and: [
                {
                    or: [
                        { hash: '#/galaxy' },
                        { hash: '#/system' },
                    ]
                },
                {
                    or: [
                        //SOS信号记录用户名
                        { css: 'tbody > tr > td:nth-child(2)' },
                        //SOS信号记录星系名
                        { css: 'tbody > tr > td:nth-child(4)' },
                        //玩家日志里的星系名
                        { css: '.q-timeline__title' },
                    ]
                }
            ],
        },
        exclude: true,
    },
    // 排除星图页面里的名字
    {
        id: 'excludeGalaxyPageName',
        conditions: {
            hash: '#/galaxy',
            or: [
                //星系名
                { css: 'div.Atype+div>span:first-child' },
                { css: '.custom_ship_tooltip div:has(> div > svg) *' },
                //快速跃迁的星系名
                { css: '[id^="q-portal--menu"] > [role="listbox"] > [class^="q-virtual"] *' },
            ]
        },
        exclude: true,
    },
    // 排除星系页面里的名字
    {
        id: 'excludeSystemPageName',
        conditions: {
            hash: '#/system',
            or: [
                //星系名
                { css: '.galaxy_container > div  > div:nth-child(2) > div > div:nth-child(1) > span:nth-child(2)' },
                //发现者
                { css: '.galaxy_container > div  > div:nth-child(2) > div > div:nth-child(2) > :nth-child(5) > span:nth-child(2)' },
                //占领方
                { css: '.galaxy_container > div  > div:nth-child(2) > div > div:nth-child(2) > :nth-child(6) > span:nth-child(2)' },
                //恒星名
                { css: '.q-tooltip:has(> div:nth-child(2)) > div:nth-child(1)' },
                //进攻空间站标题
                { css: '[role="dialog"] .q-card__section > div > span' }
            ]
        },
        exclude: true,
    },
    // 排除星图集页面里的名字
    {
        id: 'excludeAtlasPageName',
        conditions: {
            hash: '#/atlas',
            or: [
                // 第1个table的星系名和发现者名
                { css: 'tbody:has(.star_container) > tr > td:nth-child(4)' },
                { css: 'tbody:has(.star_container) > tr > td:nth-child(6)' },
                { css: 'tbody:has(.star_container) > tr > td:nth-child(7)' },
                // 第2个table的自定义描述和星系名
                { css: 'table:not(:has(.star_container)):has(>thead > tr > th:nth-child(8)) tbody > tr > td:nth-child(2)' },
                { css: 'table:not(:has(.star_container)):has(>thead > tr > th:nth-child(8)) tbody > tr > td:nth-child(3)' },
                // 第3个table的舰队名,空间站名,星系名
                { css: 'table:not(:has(>thead > tr > th:nth-child(5))) tbody > tr > td:nth-child(1)' },
                { css: 'table:not(:has(>thead > tr > th:nth-child(5))) tbody > tr > td:nth-child(2)' },
                { css: 'table:not(:has(>thead > tr > th:nth-child(5))) tbody > tr > td:nth-child(3)' },
            ]
        },
        exclude: true,
    },
    // 排除舰队页面里的名字
    {
        id: 'excludeSquadronPageName',
        conditions: {
            hash: '#/squadron',
            or: [
                // 所有table的1, 4列
                { css: '.squadron_info_layout tbody > tr > td:nth-child(1)' },
                { css: '.squadron_info_layout tbody > tr > td:nth-child(1) *' },
                { css: '.squadron_info_layout tbody > tr > td:nth-child(4)' },
                // 空间站名字
                { css: '.right_panel_container .q-tab-panel .flex_30 .flex.column .flex>.flex.row.justify-between.items-center:nth-child(2)>div' },
                { css: 'div[role="dialog"] .q-card__section > .row > .col > span:nth-child(1)' },
                // 空间站所在星系名
                { css: '.right_panel_container .q-tab-panel .flex_30 .flex.column+.q-separator+div>div:nth-child(1)>span:nth-child(2)' },
                // 舰队列表里舰队名
                { css: 'div.custom_squadron_avatar + div > span' },
                // 舰队队长
                { css: '.squadron_info > div:nth-child(2) > div:first-child > div:first-child > div:nth-child(2) *' },
                // 舰队自定义描述
                { css: '.custom_description' },
                // 舰队成员列表
                { css: '.custom_description ~ ul li' },
                // 舰队成员列表里人名
                { css: 'i.squadron_user_status+span' },
            ]
        },
        exclude: true,
    },
    // 排除市场页面里的名字
    {
        id: 'excludeMarketPageName',
        conditions: {
            hash: '#/market',
            or: [
                // 物品卖单里的玩家名
                { css: '.market_table_container tbody > tr > td:nth-child(6)' },
            ]
        },
        exclude: true,
    },
    // 排除社交中心页面里的名字
    {
        id: 'excludeMarketPageName',
        conditions: {
            hash: '#/socialhub',
            or: [
                // 社交中心里的玩家名
                { css: '.custom_socialhub_grid > div .user_squad > div > span:first-child' },
            ]
        },
        exclude: true,
    },
    // 排除排名页面里的名字
    {
        id: 'excludeRankPageName',
        conditions: {
            hash: '#/rankings',
            or: [
                // 所有table里的内容
                { css: 'tbody > tr > td' },
            ]
        },
        exclude: true,
    },
    // 排除个人信息页面里的名字
    {
        id: 'excludeProfilePageName',
        conditions: {
            hash: '#/profile',
            or: [
                // 个人资料名字
                { css: '.q-page div > .items-start:first-child > div:nth-child(2) > div > div:first-child > span:nth-child(2)' },
                // 个人资料email
                { css: '.q-page div > .items-start:first-child > div:nth-child(2) > div > div:nth-child(3) > span:nth-child(2)' },
            ]
        },
        exclude: true,
    },
    // 排除高级商店页面里的名字
    {
        id: 'excludeProfilePageName',
        conditions: {
            hash: '#/premium',
            or: [
                // 名字颜色展示
                { css: '[class*="character_name_color"]' },
            ]
        },
        exclude: true,
    },

    // 过滤前面的空白
    {
        id: 'excludeBeforeSpace',
        conditions: {
            regex: /^(\s+)(.+)$/,
        },
        translation: (ruleId, element, regexRes) => {
            return joinTranslateRes(ruleId, regexRes[1], translateText(regexRes[2], element));
        },
    },
    // 过滤后面的空白
    {
        id: 'excludeEndSpace',
        conditions: {
            regex: /^(.+)(\s+)$/,
        },
        translation: (ruleId, element, regexRes) => {
            return joinTranslateRes(ruleId, translateText(regexRes[1], element), regexRes[2]);
        },
    },
    // 过滤后面的冒号
    {
        id: 'excludeEndColon',
        conditions: {
            regex: /^([^:]+?)(\s*:)$/,
        },
        translation: (ruleId, element, regexRes) => {
            return joinTranslateRes(ruleId, translateText(regexRes[1], element), regexRes[2]);
        },
    },
]
const translationRules = [
    // 库存里的蓝图需求
    {
        id: 'InventoryBluepointRequirements',
        conditions: {
            hash: '#/player',
            css: '.q-tooltip>div>ul>li',
            regex: /^(.+)(: [\d,\.]+\s?[kmb%]? )(.+)$/i,
        },
        translation: (ruleId, element, regexRes) => {
            return joinTranslateRes(ruleId, translateText(regexRes[1], element), regexRes[2], translateText(regexRes[3], element));
        },
    },
    // 制造页面选中多个模组的结果显示
    {
        id: 'craftingSelectMutResult',
        conditions: {
            hash: '#/crafting',
            css: '.ellipsis',
            regex: /^(.+), (.+)$/i,
        },
        translation: (ruleId, element, regexRes) => {
            return joinTranslateRes(ruleId, translateText(regexRes[1], element), ', ', translateText(regexRes[2], element));
        },
    },
    // 制造页面选中多个模组的结果显示(下面)
    {
        id: 'craftingSelectMutResultBotton',
        conditions: {
            hash: '#/crafting',
            regex: /^(Bonuses): (.+),(.+)$/i,
        },
        translation: (ruleId, element, regexRes) => {
            return joinTranslateRes(ruleId, translateText(regexRes[1], element), ': ', translateText(regexRes[2], element), ', ', translateText(regexRes[3], element));
        },
    },
    // 玩家日志里的最常访问星系名
    {
        id: 'playerJournalMostFrequentSystem',
        conditions: {
            or: [
                { hash: '#/galaxy' },
                { hash: '#/system' },
            ],
            css: '.q-dialog__inner > div > div > div:nth-child(5) > span',
            regex: /^(.+)( \[.+\] )Times(: \d+)$/,
        },
        translation: (ruleId, element, regexRes) => {
            return joinTranslateRes(ruleId, regexRes[1], regexRes[2], '次数', regexRes[3]);
        },
    },
    // 星图页面发现者与占领者
    {
        id: 'galaxyPageDiscoveredAndClaimed',
        conditions: {
            hash: '#/galaxy',
            regex: /^(Discovered by|Claimed by): (.+)$/,
        },
        translation: (ruleId, element, regexRes) => {
            return joinTranslateRes(ruleId, translateText(regexRes[1], element), ': ', regexRes[2]);
        },
    },
    // 兵器库借走时间.
    {
        id: 'tookItAgo',
        conditions: {
            regex: /^(.+?) took it (?:(\d+)|(an)) (second|seconds|minute|minutes|hour|hours|day|days) ago$/
        },
        translation: (ruleId, element, regexRes) => {
            const unitMap = {
                second: '秒',
                seconds: '秒',
                minute: '分钟',
                minutes: '分钟',
                hour: '小时',
                hours: '小时',
                day: '天',
                days: '天'
            };
            const amount = regexRes[2] || (regexRes[3] === 'an' ? '1' : '');
            const unit = unitMap[regexRes[4]] || regexRes[4];
            return joinTranslateRes(ruleId, regexRes[1], ' 在 ', amount, ' ', unit, '前借出');
        },
    },
    // 宠物加成提示
    {
        id: 'petLevelGives',
        conditions: {
            regex: /^Pet level (\d+) gives$/
        },
        translation: (ruleId, element, regexRes) => {
            return joinTranslateRes(ruleId, '宠物等级 ', regexRes[1], ' 提供加成');
        },
    },
    // 星系页面空间站名
    {
        id: 'systemPageSpaceStation',
        conditions: {
            hash: '#/system',
            regex: /^(.+)'s space station$/,
        },
        translation: (ruleId, element, regexRes) => {
            return joinTranslateRes(ruleId, regexRes[1], ' 的空间站');
        },
    },
    // 制作加成描述
    {
        id: 'craftingPossibleRange',
        conditions: {
            hash: '#/crafting',
            regex: /^Max possible range: (\+\d+)% \((\+\d+)% from slider (\+\d+)% from crafting level\)$/,
        },
        translation: (ruleId, element, regexRes) => {
            return joinTranslateRes(ruleId, `最大可能范围：${regexRes[1]}%（滑块${regexRes[2]}%, 制作等级${regexRes[3]}%）`);
        },
    },

    // 拆分冒号左右
    {
        id: 'splitColon',
        conditions: {
            regex: /^(.+)(\s*:\s*)(.+)$/,
        },
        translation: (ruleId, element, regexRes) => {
            return joinTranslateRes(ruleId, translateText(regexRes[1], element), regexRes[2], translateText(regexRes[3], element));
        },
    },
    // 拆分分号左右
    {
        id: 'splitSemicolon',
        conditions: {
            regex: /^(.+)(\s*\/\s*)(.+)$/,
        },
        translation: (ruleId, element, regexRes) => {
            return joinTranslateRes(ruleId, translateText(regexRes[1], element), regexRes[2], translateText(regexRes[3], element));
        },
    },

    // 光年数
    {
        id: 'lightYearNumber',
        conditions: {
            regex: /^([\d,\.]+\s?[kmb%]?\s+)ly$/i
        },
        translation: (ruleId, element, regexRes) => {
            return joinTranslateRes(ruleId, regexRes[1], '光年');
        },
    },
    // 稀有度飞船部件
    {
        id: 'rarityShipPart',
        conditions: {
            regex: new RegExp('^' + REGEX_RARITY_SHIP_PART + '$', 'i')
        },
        translation: (ruleId, element, regexRes) => {
            return joinTranslateRes(ruleId, translateText(regexRes[1], element), translateText(regexRes[2], element));
        },
    },
    // 飞船部件或敌人等级
    {
        id: 'shipPartOrEnemyLevel',
        conditions: {
            regex: /^(.+) (Lvl|level)$/i
        },
        translation: (ruleId, element, regexRes) => {
            return joinTranslateRes(ruleId, translateText(regexRes[1], element), ' 等级');
        },
    },
    // 装备时可用的飞船部件
    {
        id: 'availableShipPart',
        conditions: {
            regex: new RegExp('^(Available) ' + REGEX_SHIP_PART + '$', 'i')
        },
        translation: (ruleId, element, regexRes) => {
            return joinTranslateRes(ruleId, translateText(regexRes[1], element), translateText(regexRes[2], element));
        },
    },
    // 稀有度飞船部件蓝图
    {
        id: 'rarityShipPartBluepoint',
        conditions: {
            regex: new RegExp('^' + REGEX_RARITY_SHIP_PART + ' (blueprint)$', 'i')
        },
        translation: (ruleId, element, regexRes) => {
            return joinTranslateRes(ruleId, translateText(regexRes[1], element), translateText(regexRes[2], element), translateText(regexRes[3], element));
        },
    },
    // 在多少轮后结束战斗
    {
        id: 'afterSizeRounds',
        conditions: {
            regex: /after (\d+) rounds/
        },
        translation: (ruleId, element, regexRes) => {
            return joinTranslateRes(ruleId, '在 ', regexRes[1], ' 轮之后');
        },
    },
    // 战斗奖励信息
    {
        id: 'battleReward',
        conditions: {
            regex: /^You gained ([0-9,]+) battling XP and ([0-9,]+) credits$/
        },
        translation: (ruleId, element, regexRes) => {
            return joinTranslateRes(ruleId, '你从中获得了 ', regexRes[1], ' 战斗XP 和 ', regexRes[2], ' 信用点');
        },
    },
    {
        id: 'battleSquardronTax',
        conditions: {
            regex: /^Your Squadron taxed ([0-9,]+) credits$/
        },
        translation: (ruleId, element, regexRes) => {
           return joinTranslateRes(ruleId, '你的舰队收取了 ', regexRes[1], ' 信用点的税');
        },
    },
    // 长时间
    {
        id: 'longTime',
        conditions: {
            regex: /^(\d+ days )?(\d+ hours )?(\d+ (minutes|m) )(\d+) (seconds|s)$/
        },
        translation: (ruleId, element, regexRes) => {
            if (regexRes[1]) {
                return joinTranslateRes(ruleId, translateText(regexRes[1], element), translateText(regexRes[2], element), translateText(regexRes[3], element), regexRes[5], ' 秒');
            } else if (regexRes[2]) {
                return joinTranslateRes(ruleId, translateText(regexRes[2], element), translateText(regexRes[3], element), regexRes[5], ' 秒');
            }
            return joinTranslateRes(ruleId, translateText(regexRes[3], element), regexRes[5], ' 秒');
        },
    },
    // 空间站和声望奖励
    {
        id: 'spaceStationBoots',
        conditions: {
            regex: /^ (\+\d+%) from $/
            //(.+) Space station$/
            //(\+\d+%) from Reputation$/
        },
        translation: (ruleId, element, regexRes) => {
            return joinTranslateRes(ruleId, regexRes[1], ' 来自');
        },
    },
    // 大数量信用点
    {
        id: 'bigCountCredits',
        conditions: {
            regex: /^([\d,\.]+\s?[kmb] )(credits)?$/i
        },
        translation: (ruleId, element, regexRes) => {
            return joinTranslateRes(ruleId, translateText(regexRes[1], element), translateText(regexRes[2], element));
        },
    },
    // 舰队战胜利
    {
        id: 'squadronWarWon',
        conditions: {
            regex: /^(.+) wins!$/
        },
        translation: (ruleId, element, regexRes) => {
            return joinTranslateRes(ruleId, regexRes[1], ' 胜利!');
        },
    },
    // 舰队战刚刚开始
    {
        id: 'squadronWarStart',
        conditions: {
            regex: /^Battle for (.+) system just started$/
        },
        translation: (ruleId, element, regexRes) => {
            return joinTranslateRes(ruleId, regexRes[1], '  星系之战刚刚开始');
        },
    },
    // 舰队战开始
    {
        id: 'squadronWarStart',
        conditions: {
            regex: /^Battle for (.+) system started$/
        },
        translation: (ruleId, element, regexRes) => {
            return joinTranslateRes(ruleId, regexRes[1], '  星系之战已经开始');
        },
    },
    // 舰队战克隆人
    {
        id: 'squadronWarClone',
        conditions: {
            regex: /^(.+)'s Clone$/
        },
        translation: (ruleId, element, regexRes) => {
            return joinTranslateRes(ruleId, regexRes[1], '  的克隆体');
        },
    },
    // 舰队战克隆人死亡
    {
        id: 'squadronWarCloneDie',
        conditions: {
            regex: /^(.+)'s Clone (\d+) dies$/
        },
        translation: (ruleId, element, regexRes) => {
            return joinTranslateRes(ruleId, regexRes[1], '  的克隆体' + regexRes[2], ' 死亡');
        },
    },
    //PVP
    {
        id: 'purchaseWithPvPBadges',
        conditions: {
            regex: /^Purchase (\d+) (.+?) for ([\d,]+) PvP Badges$/
        },
        translation: (ruleId, element, regexRes) => {
            return `使用 ${regexRes[3]} 个 PvP 徽章购买 ${regexRes[1]} 个 ${regexRes[2]}`;
        }
    },
    {
        id: 'timeCountdown',
        conditions: {
            regex: /^h (\d+)m (\d+)s$|^h (\d+)m$|^m (\d+)s$/
        },
        translation: (ruleId, element, regexRes) => {
            if (regexRes[1] && regexRes[2]) {
                return `${regexRes[1]}小时 ${regexRes[2]}秒`;
            } else if (regexRes[3]) {
                return `${regexRes[3]}小时`;
            } else if (regexRes[4]) {
                return `${regexRes[4]}秒`;
            }
            return element;
        }
    },
    //拆解通知
    {
        id: 'scrapNotify',
        conditions: {
            regex: /^(.+) scrapped. You got (\d+) (metal scraps)$/
        },
        translation: (ruleId, element, regexRes) => {
            return joinTranslateRes(ruleId, translateText(regexRes[1], element), ' 已经被拆解, 你获得了 ', regexRes[2], ' ', translateText(regexRes[3], element));
        },
    },
    //批量拆解通知
    {
        id: 'batchScrapNotify',
        conditions: {
            regex: /^Scrapped (\d+) items$/
        },
        translation: (ruleId, element, regexRes) => {
            return joinTranslateRes(ruleId, '已拆解 ', regexRes[1], ' 个物品');
        },
    },
    //升级实验室建筑通知
    {
        id: 'upgradeBaboratoryBuildNotify',
        conditions: {
            regex: /^(.+) upgraded.$/
        },
        translation: (ruleId, element, regexRes) => {
            return joinTranslateRes(ruleId, translateText(regexRes[1], element), ' 已升级.');
        },
    },
    //实验室建筑生产通知
    {
        id: 'upgradeBaboratoryBuildNotify',
        conditions: {
            regex: /^Queued (\d+) (.+) into the (.+)$/
        },
        translation: (ruleId, element, regexRes) => {
            return joinTranslateRes(ruleId, '在 ', translateText(regexRes[3], element), ' 中排队生产 ', regexRes[1], ' 个 ', translateText(regexRes[2], element));
        },
    },
    //停止战斗通知
    {
        id: 'stopBattlingNotify',
        conditions: {
            regex: /^Clones have stopped battling (.+?)\.?$/
        },
        translation: (ruleId, element, regexRes) => {
            return joinTranslateRes(ruleId, '克隆体已停止与 ', translateText(regexRes[1], element), ' 作战.');
        },
    },
    //订阅会员通知
    {
        id: 'suscriptionNotify',
        conditions: {
            regex: /^Suscription active until (.+)$/
        },
        translation: (ruleId, element, regexRes) => {
            return joinTranslateRes(ruleId, '订阅有效期至 ', translateText(regexRes[1], element));
        },
    },
    //用星币购买订阅会员
    {
        id: 'purchaseMonthsTokens',
        conditions: {
            regex: /^Purchase (\d+) months? for (\d+) tokens$/
        },
        translation: (ruleId, element, regexRes) => {
            return joinTranslateRes(ruleId, '用 ', regexRes[2], ' 代币购买 ', regexRes[1], ' 个月');
        },
    },

    // 过滤前面的非字母
    {
        id: 'excludeBeforeNotAbc',
        conditions: {
            regex: /^([^a-zA-Z]+)(.+)$/,
        },
        translation: (ruleId, element, regexRes) => {
            return joinTranslateRes(ruleId, regexRes[1], translateText(regexRes[2], element));
        },
    },
    // 过滤后面的非字母
    {
        id: 'excludeEndNotAbc',
        conditions: {
            regex: /^(.+?)([^a-zA-Z]+)$/,
        },
        translation: (ruleId, element, regexRes) => {
            return joinTranslateRes(ruleId, translateText(regexRes[1], element), regexRes[2]);
        },
    },
]

function joinTranslateRes(ruleId, ...translateResOrStrs) {
    let translation = ''
    let status = 0
    let subIds = []
    for (const translateResOrStr of translateResOrStrs) {
        if (typeof translateResOrStr === 'object') {
            translation += translateResOrStr.translation;
            if (translateResOrStr.status === 2) {
                status = 2;
            }
            subIds.push(translateResOrStr.id);
        } else {
            translation += translateResOrStr;
        }
    }
    return { status, translation, id: status + '-' + ruleId + '[' + subIds.join() + ']' }
}

// 检查元素是否匹配条件
function checkConditions(text, element, conditions) {
    if (!conditions) return true;

    // 检查各个条件
    let matches = true;

    // 处理OR条件
    if (conditions.or) {
        matches = matches && conditions.or.some(subCondition => checkConditions(text, element, subCondition));
    }

    // 处理AND条件
    if (conditions.and) {
        matches = matches && conditions.and.every(subCondition => checkConditions(text, element, subCondition));
    }

    // 哈希匹配
    if (conditions.hash !== undefined) {
        matches = matches && window.location.hash === conditions.hash;
    }

    // 不匹配哈希
    if (conditions.notHash !== undefined) {
        matches = matches && window.location.hash !== conditions.notHash;
    }

    // CSS选择器匹配
    if (conditions.css !== undefined) {
        const realElement = element.nodeName !== "#text" ? element : element.parentNode;
        matches = matches && realElement && realElement.matches(conditions.css);
    }

    // 不匹配CSS选择器
    if (conditions.notCss !== undefined) {
        const realElement = element.nodeName !== "#text" ? element : element.parentNode;
        matches = matches && realElement && !realElement.matches(conditions.notCss);
    }

    // 正则表达式匹配
    if (conditions.regex !== undefined) {
        matches = matches && conditions.regex.test(text);
    }

    // 不匹配正则表达式
    if (conditions.notRegex !== undefined) {
        matches = matches && !conditions.notRegex.test(text);
    }

    // 文本完全匹配
    if (conditions.text !== undefined) {
        matches = matches && text.toLowerCase() === conditions.text.toLowerCase();
    }

    return matches;
}

function processRule(text, element, rule) {
    if (rule.exclude) {
        return { status: 1, translation: text, id: '1-' + rule.id };
    }
    if (typeof rule.translation === 'function') {
        if (rule.conditions.regex) {
            return rule.translation(rule.id, element, rule.conditions.regex.exec(text));
        } else {
            return rule.translation(rule.id, element, text);
        }
    } else {
        return { status: 0, translation: rule.translation, id: '0-' + rule.id };
    }
}

function translateText(text, element) {
    if (typeof text !== 'string') return { status: 2, translation: text, id: '2-{' + text + '}' };
    for (const simpleExclude of simpleExcludes) {
        if (simpleExclude.toLowerCase() === text.toLowerCase()) {
            return { status: 1, translation: text, id: '1-simpleExcludes(' + simpleExclude + ')' };
        }
    }
    for (const rule of PreProcessRules) {
        if (checkConditions(text, element, rule.conditions)) {
            return processRule(text, element, rule);
        }
    }
    for (const key in simpleTranslationMap) {
        if (key.toLowerCase() === text.toLowerCase()) {
            return { status: 0, translation: simpleTranslationMap[key], id: '0-simpleTranslationMap(' + key + ')' };
        }
    }
    for (const rule of translationRules) {
        if (checkConditions(text, element, rule.conditions)) {
            return processRule(text, element, rule);
        }
    }
    failSet.add(text);
    return { status: 2, translation: text, id: '2-{' + text + '}' };
}

const transTaskMgr = {
    tasks: [],
    translateText: function (node, attr) {
        const translated = translateText(node[attr], node);
        switch (translated.status) {
            case 0:
                this.tasks.push({ node, status: translated.status, attr, translation: translated.translation, id: translated.id });
                break;
            case 1:
                this.tasks.push({ node, status: translated.status, id: translated.id });
                break;
            case 2:
                this.tasks.push({ node, status: translated.status, id: translated.id });
                break;
        }
    },
    doTask: async function () {
        let task = null;
        while ((task = this.tasks.pop())) {
            const realNode = task.node.nodeName !== "#text" ? task.node : task.node.parentNode;
            realNode && realNode.setAttribute("socn-id", task.id);
            switch (task.status) {
                case 0:
                    realNode && realNode.setAttribute("socn-source", task.node[task.attr]);
                    task.node[task.attr] = task.translation;
                    break;
                case 1:
                    realNode && realNode.classList.add('socn-exclude-highlight');
                    break;
                case 2:
                    realNode && realNode.classList.add('socn-untranslated-highlight');
                    break;
            }
        }
    },
};

function translateSubNodes(node) {
    if (node.childNodes.length > 0) {
        for (const subnode of node.childNodes) {
            if (subnode.placeholder) {
                transTaskMgr.translateText(subnode, "placeholder");
            }
            if (subnode.nodeName === "#text") {
                transTaskMgr.translateText(subnode, "textContent");
            } else if (subnode.nodeName !== "SCRIPT" && subnode.nodeName !== "STYLE" && subnode.nodeName !== "TEXTAREA") {
                if (!subnode.childNodes || subnode.childNodes.length == 0) {
                    if (subnode.innerText) {
                        transTaskMgr.translateText(subnode, "innerText");
                    }
                } else {
                    translateSubNodes(subnode);
                }
            }
        }
    }
}

const failSet = new Set();
(function () {
    'use strict';

    //汉化静态页面内容
    translateSubNodes(document.body);
    transTaskMgr.doTask();

    //监听页面变化并汉化动态内容
    const observer_config = {
        attributes: false,
        characterData: true,
        childList: true,
        subtree: true,
    };
    const observer = new MutationObserver(function (e) {
        observer.disconnect();
        for (let mutation of e) {
            if (mutation.target.nodeName === "SCRIPT" || mutation.target.nodeName === "STYLE" || mutation.target.nodeName === "TEXTAREA") continue;
            if (mutation.target.nodeName === "#text") {
                transTaskMgr.translateText(mutation.target, "textContent");
            } else if (!mutation.target.childNodes || mutation.target.childNodes.length == 0) {
                if (mutation.target.placeholder) {
                    transTaskMgr.translateText(mutation.target, "placeholder")
                }
                if (mutation.target.innerText) {
                    transTaskMgr.translateText(mutation.target, "innerText");
                }
            } else if (mutation.addedNodes.length > 0) {
                for (let node of mutation.addedNodes) {
                    if (node.placeholder) {
                        transTaskMgr.translateText(node, "placeholder")
                    }
                    if (node.nodeName === "#text") {
                        transTaskMgr.translateText(node, "textContent");
                    } else if (node.nodeName !== "SCRIPT" && node.nodeName !== "STYLE" && node.nodeName !== "TEXTAREA") {
                        if (!node.childNodes || node.childNodes.length == 0) {
                            if (node.innerText) {
                                transTaskMgr.translateText(node, "innerText");
                            }
                        } else {
                            translateSubNodes(node);
                        }
                    }
                }
            }
        }
        transTaskMgr.doTask();
        observer.observe(document.body, observer_config);
    });
    observer.observe(document.body, observer_config);

    // 菜单命令
    GM_registerMenuCommand('打印未翻译的文本', () => {
        const unObj = Array.from(failSet).reduce((obj, item) => {
            obj[item] = item;
            return obj;
        }, {});
        console.log(JSON.stringify(unObj, null, 2))
    });

    // 创建样式元素（初始为空, 默认不显示高亮）
    const highlightStyleElement = document.createElement('style');
    highlightStyleElement.id = 'socn-highlight-style';
    document.head.appendChild(highlightStyleElement);

    // 当前高亮状态（默认false, 不显示高亮）
    let highlightsEnabled = false;

    // 切换高亮显示的函数
    function toggleHighlights() {
        highlightsEnabled = !highlightsEnabled;

        if (highlightsEnabled) {
            // 启用高亮: 添加样式
            highlightStyleElement.textContent = `
        .socn-untranslated-highlight {
            outline: 1px dashed #ff5722 !important;
            position: relative;
        }
        .socn-exclude-highlight {
            outline: 1px dashed #00F7FF !important;
            position: relative;
        }`;
        } else {
            // 禁用高亮: 清空样式
            highlightStyleElement.textContent = '';
        }

        // 更新菜单命令文本
        updateMenuCommand();
    }

    // 更新菜单命令显示文本
    function updateMenuCommand() {
        // 先移除旧命令
        if (window.highlightMenuCommandId) {
            GM_unregisterMenuCommand(window.highlightMenuCommandId);
        }

        // 注册新命令
        window.highlightMenuCommandId = GM_registerMenuCommand(
            highlightsEnabled ? '■ 隐藏高亮' : '□ 显示高亮',
            toggleHighlights,
        );
    }

    // 初始注册菜单命令
    updateMenuCommand();
})();