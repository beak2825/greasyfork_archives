// ==UserScript==
// @name         铁木放置汉化
// @namespace    http://tampermonkey.net/
// @version      1.54
// @description  铁木放置汉化,在锅巴汉化脚本的基础上修改。
// @author       Truth_Light
// @license      Truth_Light
// @match        https://ironwoodrpg.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ironwoodrpg.com
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/500494/%E9%93%81%E6%9C%A8%E6%94%BE%E7%BD%AE%E6%B1%89%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/500494/%E9%93%81%E6%9C%A8%E6%94%BE%E7%BD%AE%E6%B1%89%E5%8C%96.meta.js
// ==/UserScript==



(function() {
    'use strict';

    var cnItems = {
        _OTHER_: [],

        //未分类：
        "Be Asshole": "做个混蛋",
        "Export": "导出",
        "Discord": "Discord",
        "Changelog": "更新日志",
        "Change Name": "修改名称",
        "Game": "游戏",
        "Grapes": "葡萄",
        "Help": "帮助",
        "Import": "导入",
        "Infinity": "无限",
        "[DEFAULT]": "[默认]",
        "More Fair Game": "更公平的游戏",
        "Options": "选项",
        "Points": "点数",
        "Power": "力量",
        "Send": "发送",
        "Username": "用户名",
        "Vinegar": "尖酸刻薄",
        "Buy Autopromote": "购买自动提升",
        "Throw Vinegar": "扔醋",
        "Account": "帐户",
        "Accuracy": "命中",
        "Actions": "行动",
        "Amethyst": "紫晶",
        "Armour": "护甲",
        "Attack": "攻击",
        "Attack Speed": "攻击速度",
        "Bass": "鲈鱼",
        "Birch Log": "桦木原木",
        "Birch Tree": "白桦树",
        "Black Snake": "黑蛇",
        "Body": "身体",
        "Bone": "骨头",
        "Boots": "靴子",
        "Buy": "买",
        "CHARACTER": "特点",
        "Cherry": "樱桃",
        "Coal Rock": "煤",
        "Cobalt Bar": "钴锭",
        "Cobalt Body": "钴甲",
        "Cobalt Boots": "钴靴",
        "Cobalt Fishing Rod": "钴钓鱼竿",
        "Cobalt Hammer": "钴锤",
        "Cobalt Hatchet": "钴斧",
        "Cobalt Helmet": "钴头盔",
        "Cobalt Pickaxe": "钴镐",
        "Cobalt Rock": "钴矿石",
        "Cobalt Sword": "钴剑",
        "Cod": "鳕鱼",
        "Combat": "战斗",
        "Combat Level": "战斗等级",
        "COMMUNITY": "社区",
        "Consumables": "消耗品",
        "Cooked Salmon": "熟三文鱼",
        "Cooked Shrimp": "熟虾",
        "Cooking": "烹饪",
        "Copper Bar": "铜锭",
        "Copper Body": "铜甲",
        "Copper Boots": "铜靴",
        "Copper Fishing Rod": "铜钓竿",
        "Copper Hammer": "铜锤",
        "Copper Hatchet": "铜斧",
        "Copper Helmet": "铜头盔",
        "Copper Pickaxe": "铜镐",
        "Copper Rock": "铜矿石",
        "Copper Sword": "铜剑",
        "Crafting Material": "制作材料",
        "Damage": "伤害",
        "Date": "日期",
        "Defense": "防御",
        "Details": "详情",
        "Each": "单价",
        "Emerald": "翡翠",
        "Empty": "空",
        "Equipment": "装备",
        "Fight": "战斗",
        "Fishing": "钓鱼",
        "Fishing Bait": "鱼饵",
        "Fishing Rod": "钓竿",
        "Food": "食物",
        "Forging": "锻压",
        "Game Version": "游戏版本",
        "Gather": "收集",
        "Gloves": "手套",
        "Goblin": "地精",
        "Goblin Chief": "哥布林酋长",
        "Gold Bar": "金锭",
        "Gold Body": "金甲",
        "Gold Boots": "金靴",
        "Gold Fishing Rod": "黄金钓竿",
        "Gold Hammer": "金锤",
        "Gold Hatchet": "金斧",
        "Gold Helmet": "金头盔",
        "Gold Pickaxe": "金镐",
        "Gold Rock": "金矿石",
        "Gold Sword": "金剑",
        "Green Apple": "青苹果",
        "Green Slime": "绿色史莱姆",
        "Grey Wolf": "灰狼",
        "Griffin": "格里芬",
        "Hatchet": "斧",
        "Health": "生命值",
        "Helmet": "头盔",
        "Hide Welcome Back messages while online": "在线时隐藏欢迎返回消息",
        "Inventory": "仓库",
        "Collect": "收集",
        "Iron Bar": "铁锭",
        "Iron Body": "铁甲",
        "Iron Boots": "铁靴",
        "Iron Fishing Rod": "铁钓竿",
        "Iron Hammer": "铁锤",
        "Iron Hatchet": "铁斧",
        "Iron Helmet": "铁盔",
        "Iron Pickaxe": "铁镐",
        "Iron Rock": "铁矿石",
        "Iron Sword": "铁剑",
        "Ironwood RPG": "铁木RPG",
        "Item": "物品",
        "Items": "物品",
        "Leaderboards": "排行榜",
        "Leaf Hopper": "叶蝉",
        "Level Up": "升级了",
        "Link Status": "在线状态",
        "Linked": "已连接",
        "List Item": "物品清单",
        "Lobster": "龙虾",
        "Loot": "获取",
        "Mahogany Tree": "红木树",
        "Main Hand": "主手",
        "Market": "市场",
        "Materials": "材料",
        "Merchant": "商人",
        "Mining": "采矿",
        "Misc": "杂项",
        "MISC": "杂项",
        "My Listings": "我的清单",
        "Off Hand": "非手",
        "Owned": "拥有",
        "Pickaxe": "镐",
        "Pine Log": "松原木",
        "Pine Tree": "松树",
        "Preferences": "喜好",
        "Price": "价格",
        "Raw Bass": "生鲈鱼",
        "Raw Salmon": "生鲑鱼",
        "Raw Shrimp": "生虾",
        "Red Frog": "红蛙",
        "Reddit": "Reddit",
        "Requires": "需要",
        "Ruby": "红宝石",
        "Salmon": "三文鱼",
        "Settings": "设置",
        "Shrimp": "虾",
        "Sign out": "登出",
        "Silver Bar": "银锭",
        "Silver Body": "银甲",
        "Silver Boots": "银靴",
        "Silver Fishing Rod": "银色钓鱼竿",
        "Silver Hammer": "银锤",
        "Silver Hatchet": "银斧",
        "Silver Helmet": "银头盔",
        "Silver Pickaxe": "银镐",
        "Silver Rock": "银矿石",
        "Silver Sword": "银剑",
        "SKILLS": "技能",
        "Smelting": "冶炼",
        "Smithing": "锻造",
        "Snail": "蜗牛",
        "Spruce Log": "云杉原木",
        "Spruce Tree": "云杉树",
        "Stats": "统计数据",
        "Stop & Loot": "停止 & 收集",
        "Stop Action": "停止动作",
        "Strength": "力量",
        "Teak Log": "柚木原木",
        "Teak Tree": "柚木树",
        "Tools": "工具",
        "Topaz": "黄玉",
        "Total": "总计",
        "Tree Stump": "树桩",
        "Venus Flytrap": "捕蝇草",
        "Woodcutting": "伐木",
        "Continue": "继续",
        "Gained": "获得了",
        "Idle for": "放置了",
        "Loot Gathered": "战利品收集",
        "Mining XP": "采矿经验",
        "Minute": "分",
        "Second": "秒",
        "Skill Improvements": "技能提升",
        "Welcome Back": "欢迎回来",
        "All": "全部",
        "Sell": "出售",
        "Coal Ore": "煤",
        "Iron Ore": "铁矿石",
        "Silver Ore": "银矿石",
        "Cobalt Ore": "钴矿石",
        "Gold Ore": "金矿石",
        "Copper Ore": "铜矿石",
        "Defense XP": " 防御经验值",
        "Submit": "提交",
        "Create Character": "创建角色",
        "Choose a Name": "输入名称",
        "That name has already been taken.": "该名称已被使用。",
        "Top 50": "前 50",
        "Total Net Worth": "总净财富值",
        "Total XP": "总经验值",
        "Apple": "苹果",
        "Copper Shield": "铜盾",
        "Crafting Potion": "制作药水",
        "Estimates": "估算",
        "Smithing Efficiency": "铁匠效率",
        "Total Smithing XP": "总铁匠经验",
        "Copper": "铜",
        "Iron": "铁",
        "Silver": "银",
        "Gold": "金",
        "Cobalt": "钴",
        "Obsidian": "黑曜石",
        "Astral": "星体",
        "Infernal": "地狱",
        "Weapons": "武器",
        "Copper Gloves": "铜手套",
        "House": "房屋",
        "Guild": "公会",
        "Quests": "任务",
        "Challenges": "挑战",
        "Taming": "驯服",
        "Enchanting": "附魔",
        "Farming": "农业",
        "Alchemy": "炼金术",
        "One-handed": "单手",
        "Two-handed": "双手",
        "Ranged": "远程",
        "FAQ": "常见问题解答",
        "Patreon": "赞助者",
        "OTHER": "其他",
        "Rules": "规则",
        "Terms of Use": "使用条款",
        "Privacy Policy": "隐私政策",
        "Claim": "可领取",
        "Copper Rod": "铜钓竿",
        "Copper Spade": "铜铲子",
        "Copper Spear": "铜矛",
        "Copper Scythe": "铜镰刀",
        "Copper Bow": "铜弓",
        "Copper Boomerang": "铜回旋镖",
        "Iron Spear": "铁矛",
        "Iron Scythe": "铁镰刀",
        "Iron Bow": "铁弓",
        "Iron Boomerang": "铁回旋镖",
        "Iron Rod": "铁钓竿",
        "Iron Spade": "铁铲子",
        "Iron Gloves": "铁手套",
        "Iron Shield": "铁盾",
        "XP Gained": "获得经验",
        "/ hour": " / 每小时",
        "Silver Gloves": "银手套",
        "Silver Shield": "银盾",
        "Silver Rod": "银钓竿",
        "Silver Spade": "银铲子",
        "Silver Spear": "银矛",
        "Silver Scythe": "银镰刀",
        "Silver Bow": "银弓",
        "Silver Boomerang": "银回旋镖",
        "Gold Spear": "金矛",
        "Gold Scythe": "金镰刀",
        "Gold Bow": "金弓",
        "Gold Boomerang": "金回旋镖",
        "Gold Rod": "金钓竿",
        "Gold Spade": "金铲子",
        "Gold Gloves": "金手套",
        "Gold Shield": "金盾",
        "Cobalt Gloves": "钴手套",
        "Cobalt Shield": "钴盾",
        "Cobalt Spear": "钴矛",
        "Cobalt Scythe": "钴镰刀",
        "Cobalt Bow": "钴弓",
        "Cobalt Boomerang": "钴回旋镖",
        "Cobalt Rod": "钴钓竿",
        "Cobalt Spade": "钴铲子",
        "Obsidian Boots": "黑曜石靴子",
        "Obsidian Gloves": "黑曜石手套",
        "Obsidian Helmet": "黑曜石头盔",
        "Obsidian Shield": "黑曜石盾",
        "Obsidian Body": "黑曜石护甲",
        "Obsidian Rod": "黑曜石钓竿",
        "Obsidian Spade": "黑曜石铲子",
        "Obsidian Hatchet": "黑曜石斧",
        "Obsidian Pickaxe": "黑曜石镐",
        "Obsidian Sword": "黑曜石剑",
        "Obsidian Hammer": "黑曜石锤",
        "Obsidian Spear": "黑曜石矛",
        "Obsidian Scythe": "黑曜石镰刀",
        "Obsidian Bow": "黑曜石弓",
        "Obsidian Boomerang": "黑曜石回旋镖",
        "Astral Sword": "星体剑",
        "Astral Hammer": "星体锤",
        "Astral Spear": "星体矛",
        "Astral Scythe": "星体镰刀",
        "Astral Bow": "星体弓",
        "Astral Boomerang": "星体回旋镖",
        "Astral Boots": "星体靴子",
        "Astral Gloves": "星体手套",
        "Astral Helmet": "星体头盔",
        "Astral Shield": "星体盾",
        "Astral Body": "星体护甲",
        "Astral Rod": "星体钓竿",
        "Astral Spade": "星体铲子",
        "Astral Hatchet": "星体斧",
        "Astral Pickaxe": "星体镐",
        "Infernal Sword": "地狱剑",
        "Infernal Hammer": "地狱锤",
        "Infernal Spear": "地狱矛",
        "Infernal Scythe": "地狱镰刀",
        "Infernal Bow": "地狱弓",
        "Infernal Boomerang": "地狱回旋镖",
        "Infernal Boots": "地狱靴子",
        "Infernal Gloves": "地狱手套",
        "Infernal Helmet": "地狱头盔",
        "Infernal Shield": "地狱盾",
        "Infernal Body": "地狱护甲",
        "Infernal Rod": "地狱钓竿",
        "Infernal Spade": "地狱铲子",
        "Infernal Hatchet": "地狱斧",
        "Infernal Pickaxe": "地狱镐",
        "Gathering Potion": "采集药水",
        "Drops": "掉落物",
        "Common": "普通",
        "Rare": "稀有",
        "Village": "村庄",
        "Outskirts": "郊区",
        "Ironbark Tree": "铁树",
        "Redwood Tree": "红木树",
        "Ancient Tree": "古老树木",
        "Woodcutting Efficiency": "采伐效率",
        "Total Woodcutting XP": "总采伐经验",
        "Woodcutting Speed": "采伐速度",
        "Mining Efficiency": "采矿效率",
        "Total Mining XP": "总采矿经验",
        "Mining Speed": "采矿速度",
        "Obsidian Rock": "黑曜石矿石",
        "Astral Rock": "星体矿石",
        "Infernal Rock": "地狱矿石",
        "Charcoal": "木炭",
        "Amount": "数量",
        "Craft": "制作",
        "Smelting Efficiency": "冶炼效率",
        "Total Smelting XP": "总冶炼经验",
        "Obsidian Bar": "黑曜石锭",
        "Astral Bar": "星体锭",
        "Infernal Bar": "地狱锭",
        "Craftable": "可制作的",
        "Estimated Time": "预计时间",
        "Exact Output": "精确产出",
        "Ruby Essence": "红宝石精华",
        "Arcane Powder": "奥术粉末",
        "Enchanting Efficiency": "附魔效率",
        "Total Enchanting XP": "总附魔经验",
        "Essence": "精华",
        "Tomes": "卷轴",
        "Topaz Essence": "黄玉精华",
        "Emerald Essence": "翡翠精华",
        "Amethyst Essence": "紫晶精华",
        "Citrine Essence": "黄水晶精华",
        "Diamond Essence": "钻石精华",
        "Moonstone Essence": "月光石精华",
        "Onyx Essence": "黑玛瑙精华",
        "Peony": "牡丹",
        "Seeds": "种子",
        "Compost": "堆肥",
        "Flowers": "花卉",
        "Veges": "蔬菜",
        "Tulip": "郁金香",
        "Rose": "玫瑰",
        "Daisy": "雏菊",
        "Lilac": "丁香",
        "Hyacinth": "风信子",
        "Nemesia": "金鸡菊",
        "Snapdragon": "鸢尾",
        "Farming Efficiency": "农业效率",
        "Total Farming XP": "总农业经验",
        "Farming Speed": "农业速度",
        "Potato": "土豆",
        "Radish": "萝卜",
        "Onion": "洋葱",
        "Carrot": "胡萝卜",
        "Tomato": "番茄",
        "Corn": "玉米",
        "Pumpkin": "南瓜",
        "Chilli": "辣椒",
        "Health Potion": "生命药水",
        "Vial": "瓶",
        "Alchemy Efficiency": "炼金效率",
        "Total Alchemy XP": "总炼金经验",
        "Gathering": "采集",
        "Crafting": "制作",
        "Combat XP Potion": "战斗经验药水",
        "Combat Loot Potion": "战利品药水",
        "Super Health Potion": "超级生命药水",
        "Super Combat XP Potion": "超级战斗经验药水",
        "Super Combat Loot Potion": "超级战利品药水",
        "Combat XP & Loot Mix": "战斗经验与战利品混合药水",
        "Combat Loot & Health Mix": "战利品与生命混合药水",
        "Combat Health & XP Mix": "生命与战斗经验混合药水",
        "Gather Level Potion": "采集等级药水",
        "Gather XP Potion": "采集经验药水",
        "Gather Yield Potion": "采集产量药水",
        "Super Gather Level Potion": "超级采集等级药水",
        "Super Gather XP Potion": "超级采集经验药水",
        "Super Gather Yield Potion": "超级采集产量药水",
        "Gather XP & Yield Mix": "采集经验与产量混合药水",
        "Gather Yield & Level Mix": "采集产量与等级混合药水",
        "Gather Level & XP Mix": "采集等级与经验混合药水",
        "Craft Level Potion": "制作等级药水",
        "Craft XP Potion": "制作经验药水",
        "Preservation Potion": "保存药水",
        "Super Craft Level Potion": "超级制作等级药水",
        "Super Craft XP Potion": "超级制作经验药水",
        "Super Preservation Potion": "超级保存药水",
        "Craft XP & Preservation Mix": "制作经验与保存混合药水",
        "Craft Preservation & Level Mix": "保存与等级混合药水",
        "Craft Level & XP Mix": "制作等级与经验混合药水",
        "Shrimp Success Chance": "虾类成功机率",
        "Fishing Efficiency": "钓鱼效率",
        "Total Fishing XP": "总钓鱼经验",
        "Fishing Speed": "钓鱼速度",
        "Swordfish": "旗鱼",
        "Shark": "鲨鱼",
        "King Crab": "帝王蟹",
        "Fish": "鱼",
        "Pie": "馅饼",
        "Cooking Efficiency": "烹饪效率",
        "Total Cooking XP": "总烹饪经验",
        "Shrimp Pie": "虾馅饼",
        "Cod Pie": "鳕鱼馅饼",
        "Salmon Pie": "三文鱼馅饼",
        "Bass Pie": "鲈鱼馅饼",
        "Lobster Pie": "龙虾馅饼",
        "Swordfish Pie": "旗鱼馅饼",
        "Shark Pie": "鲨鱼馅饼",
        "King Crab Pie": "帝王蟹馅饼",
        "Snake": "蛇",
        "Always": "始终",
        "Coins": "金币",
        "Uncommon": "罕见",
        "Combat Potion": "战斗药水",
        "Equip One-handed Weapon": "装备单手武器",
        "Evasion": "闪避",
        "One-handed Efficiency": "单手武器效率",
        "Total One-handed XP": "总单手武器经验",
        "Forest": "森林",
        "Mountain": "山脉",
        "Ocean": "海洋",
        "Dungeons": "地牢",
        "Skeleton": "骷髅",
        "Ogre": "食人魔",
        "Efreet": "伊弗利特",
        "Sea Jelly": "海蜇",
        "Hermit Crab": "寄居蟹",
        "Blue Slime": "蓝色史莱姆",
        "Ice Fairy": "冰精灵",
        "Coral Snail": "珊瑚蜗牛",
        "Jellyfish": "水母",
        "Rock Dweller": "岩居者",
        "Frost Wolf": "冰霜狼",
        "Ice Caverns": "冰洞",
        "Twisted Woods": "扭曲森林",
        "Misty Tides": "薄雾潮汐",
        "Cyclops Den": "独眼巨人巢穴",
        "Hellish Lair": "地狱巢穴",
        "Wizard Tower": "巫师塔",
        "Lady Beetle": "瓢虫",
        "Treant": "树人",
        "Equip Two-handed Weapon": "装备双手武器",
        "Two-handed Efficiency": "双手武器效率",
        "Total Two-handed XP": "总双手武器经验",
        "Ranged Efficiency": "远程武器效率",
        "Total Ranged XP": "总远程武器经验",
        "Defense Efficiency": "防御效率",
        "Total Defense XP": "总防御经验",
        "Monsters": "怪物",
        "Food Eaten": "食物消耗",
        "+6% Speed to all Crafting skills": "+6% 所有制作技能速度",
        "Requirements": "要求",
        "Build House": "建造房屋",
        "Structures": "建筑物",
        "Furnace": "熔炉",
        "Anvil": "铁砧",
        "Enchanting Table": "附魔台",
        "Alchemy Lab": "炼金实验室",
        "Cooking Pot": "烹饪锅",
        "Provides +9% Smelting Speed per level": "每级提供 +9% 熔炼速度",
        "Enchant": "附魔",
        "Kiln": "窑炉",
        "Smelter": "熔炉",
        "Cauldron": "大锅",
        "Spit Roast": "烤肉架",
        "Smelting Speed": "熔炼速度",
        "Smithing Speed": "锻造速度",
        "Enchanting Speed": "附魔速度",
        "Alchemy Speed": "炼金速度",
        "Cooking Speed": "烹饪速度",
        "Provides +9% Smithing Speed per level": "每级提供 +9% 锻造速度",
        "Provides +9% Enchanting Speed per level": "每级提供 +9% 附魔速度",
        "Provides +9% Alchemy Speed per level": "每级提供 +9% 炼金速度",
        "Provides +9% Cooking Speed per level": "每级提供 +9% 烹饪速度",
        "Automated double charcoal production": "自动双倍木炭生产",
        "Kiln Blueprint 1": "窑炉蓝图 1",
        "Automated bar smelting": "自动熔炼金属锭",
        "Smelter Blueprint 1": "熔炉蓝图 1",
        "Automated potion brewing": "自动酿造药水",
        "Cauldron Blueprint 1": "大锅蓝图 1",
        "Automated food cooking": "自动烹饪食物",
        "Spit Roast Blueprint 1": "烤肉架蓝图 1",
        "Provides +1% Smelting Efficiency per level": "每级提供 +1% 熔炼效率",
        "Provides +1% Smithing Efficiency per level": "每级提供 +1% 锻造效率",
        "Requires Structure": "需要建筑",
        "Provides +1% Enchanting Efficiency per level": "每级提供 +1% 附魔效率",
        "Provides +1% Alchemy Efficiency per level": "每级提供 +1% 炼金效率",
        "Provides +1% Cooking Efficiency per level": "每级提供 +1% 烹饪效率",
        "Runes": "符文",
        "Perfect Copper Boomerang": "完美铜回旋镖",
        "Perfect Copper Shield": "完美铜盾",
        "Perfect Copper Helmet": "完美铜头盔",
        "Perfect Copper Body": "完美铜胸甲",
        "Perfect Copper Boots": "完美铜靴",
        "Accessories": "配饰",
        "Amulet": "护身符",
        "Ring": "戒指",
        "Bracelet": "手镯",
        "Perfect Copper Hatchet": "完美铜斧",
        "Superior Iron Pickaxe": "优质铁镐",
        "Utility": "工具",
        "Dagger": "匕首",
        "Telescope": "望远镜",
        "Lantern": "灯笼",
        "Ammo": "弹药",
        "Dungeon Map": "地牢地图",
        "Combat XP": "战斗经验",
        "Damage Reduction": "伤害减免",
        "Auto Eat": "自动进食",
        "Block Chance": "格挡几率",
        "Damage Range": "伤害范围",
        "Coins on Hit": "击中后金币",
        "Woodcutting Rune": "伐木符文",
        "Mining Rune": "采矿符文",
        "Farming Rune": "农业符文",
        "Fishing Rune": "钓鱼符文",
        "One-handed Rune": "单手符文",
        "Two-handed Rune": "双手符文",
        "Ranged Rune": "远程符文",
        "Defense Rune": "防御符文",
        "Utility Rune": "实用符文",
        "Savage Looting Tome": "野蛮战利品书",
        "Bountiful Harvest Tome": "丰收宝典",
        "Opulent Crafting Tome": "华丽制作书",
        "Insatiable Power Tome": "贪婪力量书",
        "Potent Concoction Tome": "强效药剂书",
        "Upgrade": "升级",
        "Orders": "订单",
        "Listings": "列表",
        "Raw Lobster": "生龙虾",
        "Raw Cod": "生鳕鱼",
        "Cooked Bass": "熟鲈鱼",
        "Cooked Cod": "熟鳕鱼",
        "Dungeon Map 40": "地牢地图 40",
        "Dungeon Map 25": "地牢地图 25",
        "Ruby Wisdom Bracelet": "红宝石智慧手镯",
        "Silver Dagger": "银匕首",
        "Silver Lantern": "银灯笼",
        "Perfect Iron Body": "完美铁胸甲",
        "Superior Iron Body": "优质铁胸甲",
        "Perfect Iron Gloves": "完美铁手套",
        "Superior Copper Helmet": "优质铜头盔",
        "Perfect Copper Gloves": "完美铜手套",
        "Perfect Silver Sword": "完美银剑",
        "Superior Iron Scythe": "优质铁镰刀",
        "Perfect Iron Spear": "完美铁矛",
        "Perfect Iron Sword": "完美铁剑",
        "Perfect Iron Hammer": "完美铁锤",
        "Perfect Iron Boomerang": "完美铁回旋镖",
        "Superior Iron Boomerang": "优质铁回旋镖",
        "Perfect Iron Hatchet": "完美铁斧",
        "Superior Iron Hatchet": "优质铁斧",
        "Perfect Copper Scythe": "完美铜镰刀",
        "Perfect Copper Spear": "完美铜矛",
        "Perfect Copper Sword": "完美铜剑",
        "Perfect Copper Hammer": "完美铜锤",
        "Perfect Copper Bow": "完美铜弓",
        "Superior Copper Bow": "优质铜弓",
        "Exquisite Copper Hatchet": "精致铜斧",
        "Superior Copper Hatchet": "优质铜斧",
        "Perfect Copper Pickaxe": "完美铜镐",
        "Perfect Copper Spade": "完美铜铲",
        "Perfect Copper Rod": "完美铜钓竿",
        "Petty Crit Rune": "次要暴击符文",
        "Petty Bleed Rune": "次要流血符文",
        "Petty Woodcutting Rune": "次要伐木符文",
        "Petty Mining Rune": "次要采矿符文",
        "Medium Fang": "中型尖牙",
        "Medium Bone": "中型骨头",
        "Fang": "尖牙",
        "Small Egg": "小鸡蛋",
        "Mahogany Log": "红木原木",
        "Cooked Lobster": "熟龙虾",
        "Ruby Efficiency Ring": "红宝石效率戒指",
        "Gold Telescope": "金望远镜",
        "Silver Telescope": "银望远镜",
        "Petty Farming Rune": "次要农业符文",
        "Large Bone": "大型骨头",
        "Large Egg": "大鸡蛋",
        "Medium Egg": "中鸡蛋",
        "Order": "订单",
        "History": "历史",
        "Quest": "任务",
        "Only 5 quests can be done per day": "每天只能完成5个任务",
        "Daily": "每日",
        "Shop": "商店",
        "Daily Quests": "每日任务",
        "Complete": "完成",
        "Daily Quest Reset": "每日任务重置",
        "Quests Completed": "已完成的任务",
        "Expedition Team": "远征团队",
        "Preparing": "准备中",
        "Ranch": "牧场",
        "Pets": "宠物",
        "Type": "类型",
        "Menu": "菜单",
        "Expeditions": "远征",
        "Expedition": "探险",
        "Idle": "空闲",
        "Hatchery": "孵化场",
        "Buildings": "建筑物",
        "Reference": "参考",
        "Expedition Trait Rotation": "远征特性刷新还需",
        "Rotation Success Chance": "切换后的成功几率",
        "Total Taming XP": "总驯服经验",
        "Legendary": "传奇",
        "Gold Lantern": "金灯笼",
        "Lesser Crit Rune": "次级暴击符文",
        "Lesser Damage Rune": "次级伤害符文",
        "Petty Damage Rune": "次要伤害符文",
        "Blackcurrant": "黑加仑",
        "Dungeon Map 55": "地牢地图 55",
        "Cobalt Lantern": "钴蓝灯笼",
        "Common Crit Rune": "普通暴击符文",
        "Common Damage Rune": "普通伤害符文",
        "Large Fang": "大型尖牙",
        "Ironbark Log": "铁树原木",
        "Raspberry": "覆盆子",
        "Dungeon Map 70": "地牢地图 70",
        "Obsidian Lantern": "黑曜石灯笼",
        "Uncommon Crit Rune": "罕见暴击符文",
        "Uncommon Damage Rune": "罕见伤害符文",
        "Giant Bone": "巨型骨头",
        "Redwood Log": "红木原木",
        "Blueberry": "蓝莓",
        "Dungeon Map 85": "地牢地图 85",
        "Astral Lantern": "星体灯笼",
        "Greater Crit Rune": "强力暴击符文",
        "Greater Damage Rune": "强力伤害符文",
        "Giant Fang": "巨型尖牙",
        "Ancient Log": "古老原木",
        "Banana": "香蕉",
        "Dungeon Map 100": "地牢地图 100",
        "Infernal Lantern": "地狱灯笼",
        "Grand Crit Rune": "宏大暴击符文",
        "Grand Damage Rune": "宏大伤害符文",
        "Petty Stun Rune": "次要眩晕符文",
        "Petty Block Rune": "次要格挡符文",
        "Gold Dagger": "金匕首",
        "Lesser Stun Rune": "次级眩晕符文",
        "Lesser Block Rune": "次级格挡符文",
        "Citrine": "黄玉",
        "Cobalt Dagger": "钴蓝匕首",
        "Common Stun Rune": "普通眩晕符文",
        "Common Block Rune": "普通格挡符文",
        "Obsidian Ore": "黑曜石矿石",
        "Diamond": "钻石",
        "Obsidian Dagger": "黑曜石匕首",
        "Uncommon Stun Rune": "罕见眩晕符文",
        "Uncommon Block Rune": "罕见格挡符文",
        "Astral Ore": "星体矿石",
        "Moonstone": "月亮石",
        "Astral Dagger": "星体匕首",
        "Greater Stun Rune": "强力眩晕符文",
        "Greater Block Rune": "强力格挡符文",
        "Infernal Ore": "地狱矿石",
        "Onyx": "缟玛瑙",
        "Infernal Dagger": "地狱匕首",
        "Grand Stun Rune": "宏大眩晕符文",
        "Grand Block Rune": "宏大格挡符文",
        "Petty Parry Rune": "次要招架符文",
        "Lesser Bleed Rune": "次级流血符文",
        "Lesser Parry Rune": "次级招架符文",
        "Cobalt Telescope": "钴蓝望远镜",
        "Common Bleed Rune": "普通流血符文",
        "Common Parry Rune": "普通招架符文",
        "Raw Swordfish": "生剑鱼",
        "Obsidian Telescope": "黑曜石望远镜",
        "Uncommon Bleed Rune": "罕见流血符文",
        "Uncommon Parry Rune": "罕见招架符文",
        "Raw Shark": "生鲨鱼",
        "Astral Telescope": "星体望远镜",
        "Greater Bleed Rune": "强力流血符文",
        "Greater Parry Rune": "强力招架符文",
        "Raw King Crab": "生帝王蟹",
        "Infernal Telescope": "地狱望远镜",
        "Grand Bleed Rune": "宏大流血符文",
        "Grand Parry Rune": "宏大招架符文",
        "Petty Ranged Rune": "次要远程符文",
        "Petty Defense Rune": "次要防御符文",
        "Ruby Loot Amulet": "红宝石战利品护身符",
        "Petty One-handed Rune": "次要单手符文",
        "Petty Two-handed Rune": "次要双手符文",
        "Lesser One-handed Rune": "次级单手符文",
        "Lesser Two-handed Rune": "次级双手符文",
        "Lesser Ranged Rune": "次级远程符文",
        "Lesser Defense Rune": "次级防御符文",
        "Topaz Efficiency Ring": "黄玉效率戒指",
        "Topaz Loot Amulet": "黄玉战利品护身符",
        "Common One-handed Rune": "普通单手符文",
        "Common Two-handed Rune": "普通双手符文",
        "Common Ranged Rune": "普通远程符文",
        "Common Defense Rune": "普通防御符文",
        "Emerald Efficiency Ring": "翡翠效率戒指",
        "Emerald Loot Amulet": "翡翠战利品护身符",
        "Uncommon One-handed Rune": "罕见单手符文",
        "Uncommon Two-handed Rune": "罕见双手符文",
        "Uncommon Ranged Rune": "罕见远程符文",
        "Uncommon Defense Rune": "罕见防御符文",
        "Amethyst Efficiency Ring": "紫水晶效率戒指",
        "Amethyst Loot Amulet": "紫水晶战利品护身符",
        "Greater One-handed Rune": "强力单手符文",
        "Greater Two-handed Rune": "强力双手符文",
        "Greater Ranged Rune": "强力远程符文",
        "Greater Defense Rune": "强力防御符文",
        "Citrine Efficiency Ring": "黄玉效率戒指",
        "Citrine Loot Amulet": "黄玉战利品护身符",
        "Grand One-handed Rune": "宏大单手符文",
        "Grand Two-handed Rune": "宏大双手符文",
        "Grand Ranged Rune": "宏大远程符文",
        "Grand Defense Rune": "宏大防御符文",
        "Diamond Efficiency Ring": "钻石效率戒指",
        "Diamond Loot Amulet": "钻石战利品护身符",
        "Abilities": "技能",
        "Species": "物种",
        "Remove From Team": "移出队伍",
        "Mistwood Grove": "雾木林",
        "Magic": "魔法",
        "Silverfall Canyon": "银瀑峡谷",
        "Melee": "近战",
        "Thunderpeak Summit": "雷峰峰顶",
        "Darkwater Marsh": "暗水沼泽",
        "Gather Interval": "采集间隔",
        "15 Minutes": "15分钟",
        "Success Chance": "成功几率",
        "Taming XP": "驯服经验",
        "Pet Snacks": "宠物零食",
        "Start Expedition": "开始远征",
        "Egg Incubator": "蛋孵化器",
        "Incubator": "孵化器",
        "Sunfire Plateau": "日焰高原",
        "Frostfang Vale": "霜齿谷",
        "Starlight Grotto": "星光洞窟",
        "Shadowmist Hollow": "幽影谷",
        "Barn": "畜舍",
        "Build": "建造",
        "Training Grounds": "训练场",
        "Increases pet storage space by +5 per level": "每级增加5个宠物存储空间",
        "Hatched pets will be level 10/25/40/55/70 at building level 1/2/3/4/5": "孵化的宠物在建筑等级为1/2/3/4/5时分别达到10/25/40/55/70级",
        "Spade": "铁锹",
        "Rod": "钓竿",
        "Beginner Challenge": "初级挑战",
        "Includes Lv. 1 to 25 Requirements": "可能出现1-25级的配方",
        "Challenge Scroll": "挑战卷轴",
        "Skills": "技能",
        "Rewards": "奖励",
        "Rank Points": "排名积分",
        "RP": "RP",
        "Skill XP": "技能经验",
        "Iron Chest": "铁宝箱",
        "Start": "开始",
        "Easy Challenge": "简单挑战",
        "Medium Challenge": "中等挑战",
        "Hard Challenge": "困难挑战",
        "Expert Challenge": "专家挑战",
        "Master Challenge": "大师挑战",
        "Chests Until Tome": "直到典籍的宝箱",
        "Provides +6% Speed to all Crafting skills": "提供所有制作技能+6%的速度加成",
        "Stardust": "星尘",
        "Copper Arrow": "铜箭",
        "Iron Arrow": "铁箭",
        "Silver Arrow": "银箭",
        "Gold Arrow": "金箭",
        "Cobalt Arrow": "钴蓝箭",
        "Obsidian Arrow": "黑曜石箭",
        "Astral Arrow": "星体箭",
        "Infernal Arrow": "地狱箭",
        "Perfect Iron Helmet":"完美铁头盔",
        "Perfect Iron Pickaxe":"完美铁镐",
        "Perfect Iron Rod":"完美铁钓竿",
        "": "",
        "": "",
        "": "",
        "": "",
        "": "",
        "": "",
        "": "",
        "": "",
        "Announcement": "公告",
        "Members": "成员",
        "Rankings": "排名",
        "Guild XP": "公会经验",
        "Guild Credits": "公会积分",
        "Requires Guild Bank": "需要公会银行",
        "Quests Complete": "已完成任务",
        "Guild Hall": "公会大厅",
        "Guild Library": "公会图书馆",
        "Guild Bank": "公会银行",
        "Guild Storehouse": "公会仓库",
        "Guild Workshop": "公会工坊",
        "Guild Armoury": "公会军械库",
        "Guild Event Hall": "公会活动大厅",
        "Gathering Skill Efficiency": "采集技能效率",
        "Crafting Skill Efficiency": "制作技能效率",
        "Combat Skill Efficiency": "战斗技能效率",
        "Event Skill Efficiency": "事件技能效率",
        "Increases Guild Quest Tier & Credit Reward per level": "每级增加公会任务等级和积分奖励",
        "Credits": "积分",
        "Provides +2% Guild XP per level": "每级提供 +2% 公会经验",
        "Increases Guild Quest Coin Reward per level": "每级增加公会任务金币奖励",
        "Increases Gathering Skill Efficiency by 1% per level": "每级增加1%采集技能效率",
        "Increases Crafting Skill Efficiency by 1% per level": "每级增加1%制作技能效率",
        "Increases Combat Skill Efficiency by 1% per level": "每级增加1%战斗技能效率",
        "Increases Guild Event Bonuses, Rewards & Costs per level": "每级增加公会活动奖励、奖励和成本",
        "Leave Guild": "离开公会",
        "": "",
        "": "",
        //FAQ
        "How do I upgrade my items?": "如何升级我的物品？",
        "Items can be upgraded in the Inventory or Equipment pages. Weapon, Tool and Armour upgrades start from Copper.": "物品可以在背包或装备页面进行升级。武器、工具和护甲的升级从铜级开始。",
        "Why is there a lock next to my equipment?": "为什么我的装备旁边有一个锁？",
        "The lock prevents equipment from being changed while doing a skill that relates to it. To unlock the slot, stop the current skill action.": "锁定防止在与装备相关的技能进行时更换装备。要解锁插槽，请停止当前的技能操作。",
        "How do I eat food in combat?": "在战斗中如何吃食物？",
        "If food is equipped it will automatically be used in combat when health reaches 33% or less. Using food has a cooldown of 15 seconds.": "如果装备了食物，在健康值降到33%或更低时会自动在战斗中使用。使用食物有15秒的冷却时间。",
        "How do I get challenge scrolls?": "如何获取挑战卷轴？",
        "Challenge scrolls can be found when doing any skill that is at least Lv. 25. They will appear on average 3 times a day.": "挑战卷轴可以在进行任何至少25级技能时获得。平均每天会出现3次。",
        "What do the sword colours mean for gathering & combat?": "在采集和战斗中，剑的颜色表示什么意思？",
        "Green means you can't be defeated. Yellow means you have a small to medium chance to be defeated. Red means you have a high chance to be defeated.": "绿色表示你不会被击败。黄色表示你有小到中等的击败机会。红色表示你有很高的击败机会。",
        "What do I get from joining a guild?": "加入公会后我能得到什么？",
        "Guilds have buildings that each provide various benefits to all members of the guild. There are also biweekly guild events that provide skill boosts while participating.": "公会拥有各种建筑，每个建筑为公会所有成员提供各种好处。此外，每两周一次的公会活动在参与时提供技能加成。",
        "How do I get blueprints for my house?": "如何获得我的房屋蓝图？",
        "Blueprints are found while gathering in the outskirts as a rare drop from Lv. 25 onwards. Monster encounters can also occur randomly while gathering in the outskirts. Blueprints are guaranteed to drop if a player has exceeded twice the expected drop rate.": "蓝图可以在外地采集时作为稀有掉落从25级开始获得。在外地采集时还可能会随机遇到怪物。如果玩家超过两倍的预期掉落率，蓝图掉落是有保证的。",
        "How do I get ancient tomes for enchanting?": "如何获得用于附魔的古老卷轴？",
        "Ancient tomes come from challenge chests, which can be obtained by doing challenges. Tomes have a set drop rate depending on how many chests have been opened. There is a counter for this on the Challenges page.": "古老卷轴来自挑战宝箱，可以通过完成挑战获得。卷轴的掉落率取决于已打开的宝箱数量。挑战页面上有一个计数器显示这个信息。",
        "": "",
        "": "",
        "Team Stats": "团队统计",
        "Melee Block": "近战格挡",
        "Ranged Evade": "远程闪避",
        "Magic Resist": "魔法抗性",
        "Hunger": "饥饿",
        "Item Find": "物品发现",
        "Egg Find": "蛋类发现",
        "The Taming skill specialises in hatching various pets from eggs and sending those pets on expeditions to passively gain resources.": "驯养技能专注于从蛋中孵化各种宠物，并派遣这些宠物进行远征以 passively 获得资源。",
        "Send a team of up to 3 pets on expeditions to gather wood, ore, flowers, vegetables, fish and bones. Each pet in the team must be of a different species type. The tier of gathered resources will correspond with the tier of the expedition.": "派遣最多 3 只宠物组成的团队进行远征，收集木材、矿石、花卉、蔬菜、鱼类和骨头。团队中的每只宠物必须是不同的物种类型。收集到的资源等级将与远征的等级相对应。",
        "Completing an expedition will yield XP for the Taming skill and each pet in the team. Pets that have a level lower than the current taming level will receive more XP.": "完成一次远征将为驯养技能和团队中的每只宠物提供经验值。比当前驯养等级低的宠物将获得更多经验。",
        "Some pets can evolve once they reach a certain level, depending on the species. The relevant levels for evolution are Lv. 40 and 70. More information can be seen in the Reference tab.": "某些宠物在达到特定等级后可以进化，这取决于物种。进化的相关等级为 Lv. 40 和 70。更多信息可在参考标签页中查看。",
        "Pets will encounter enemies on expeditions every 15 minutes and if they are defeated then the expedition will end and must be claimed to start again.": "宠物将在每 15 分钟进行一次远征时遇到敌人，如果它们被击败，则远征将结束，必须申领才能重新开始。",
        "Expeditions have a Pet Snack cost over time which can be created on the Expedition page using Raw Fish as a material.": "远征会随时间消耗宠物零食，可以在远征页面上使用生鱼片作为材料制作。",
        "Expeditions will rotate weekly between Melee, Ranged & Magic. Using pets with passives matching the expedition type will increase the success chance.": "远征每周会在近战、远程和魔法之间轮换。使用具有与远征类型匹配的宠物被动技能将增加成功几率。",
        "Each pet species has a unique set of item abilities that determine what type of items they will find from expeditions. Their item ability level determines how many items will be found.": "每种宠物物种都有一套独特的物品能力，决定它们将从远征中发现何种类型的物品。它们的物品能力等级决定发现的物品数量。",
        "Each pet has 3 stats (Health, Attack & Defense). Each of the 3 pet stats will also roll a number between 1 to 50 and this value will be added onto their base amount as a bonus. This bonus value is visible when previewing a pet as a percentage next to each stat (the values 1 to 50 will be viewed as 2% to 100%).": "每只宠物有 3 种属性（健康、攻击和防御）。每个宠物属性还将在 1 到 50 之间滚动一个数字，并将该值作为奖金添加到它们的基础数量上。此奖金值在预览宠物时作为每个属性旁边的百分比可见（值从 1 到 50 将视为 2% 到 100%）。",
        "Each pet can have between 1 to 4 passives. The maximum tier of passives is 4. Passives related to Melee, Ranged and Magic will boost the success chance of expeditions against those types. The Item Find passive increases the amount of resources gathered. The Egg Find passive adds a chance to find more eggs. The Hunger passive increases the Pet Snack cost for expeditions.": "每只宠物可以具有 1 到 4 种被动技能。被动技能的最大层级为 4 级。与近战、远程和魔法相关的被动技能将增加对这些类型远征的成功几率。物品发现被动技能增加了收集的资源量。蛋类发现被动技能增加了发现更多蛋类的机会。饥饿被动技能增加了进行远征的宠物零食成本。",
        "Successful expeditions will yield 1 egg for every 8 hours accumulated. Pet eggs can be incubated in the Hatchery and will take 8 hours to hatch. When hatching a pet, the species found is determined by the type of egg (small, medium & large). Pets hatched from eggs will have completely random stat bonuses and passives. Hatching eggs will yield Taming XP. The larger the egg, the higher odds the pet has at having better stat bonuses and passives.": "成功的远征将每累积 8 小时产生 1 枚蛋。宠物蛋可以在孵化室中孵化，需时 8 小时。孵化宠物时，所找到的物种由蛋的类型（小、中、大）确定。从蛋孵化的宠物将具有完全随机的属性奖金和被动技能。孵化蛋将获得驯养经验。蛋越大，宠物获得更好的属性奖金和被动技能的几率越高。",
        "Another way to obtain pets other than through the Hatchery is to use the Ranch. The Ranch can hold up to 2 pets, and once they have been added, an 8 hour countdown will be started. Once the 8 hour countdown has finished, a new pet can be claimed. Claiming pets from the Ranch will yield Taming XP.": "除了通过孵化室获得宠物之外，另一种方法是使用牧场。牧场最多可以容纳 2 只宠物，一旦它们被添加，将启动 8 小时倒计时。倒计时结束后，可以申领一只新宠物。从牧场申领宠物将获得驯养经验。",
        "If two of the same species are placed into the Ranch, then any new pets found from it will inherit the species type, stat bonuses and passives (distributed randomly). If two different species are added to the ranch, then any new pet found will inherit only the species type (chosen randomly), while the stat bonuses and passives will be completely random.": "如果将两只相同物种放入牧场，则从中发现的任何新宠物都将继承物种类型、属性奖金和被动技能（随机分配）。如果向牧场添加两种不同的物种，则发现的任何新宠物将仅继承物种类型（随机选择），而属性奖金和被动技能将完全随机。",
        "The Woodcutting skill specialises in gathering logs and fruit.": "伐木技能专门用于采集木材和果实。",
        "Logs are primarily used to create charcoal for the Smelting and Cooking skills. Logs are also used to build House structures and Guild buildings.": "木材主要用于为冶炼和烹饪技能制作木炭。木材还用于建造房屋结构和公会建筑。",
        "Fruit is primarily used as compost in the Farming skill. Fruit is also used to provide healing in combat.": "果实主要用作农业技能中的堆肥。果实也用于在战斗中提供治疗。",
        "The Woodcutting skill provides +0.25% Woodcutting efficiency per level. Woodcutting efficiency gives a chance to perform another action instantly.": "伐木技能每级提供+0.25%的伐木效率。伐木效率增加了立即执行另一项操作的机会。",
        "The primary tool for Woodcutting is the Hatchet which increases Woodcutting speed.": "伐木的主要工具是斧，可以增加伐木速度。",
        "The Mining skill specialises in gathering ores and gems.": "采矿技能专门用于采集矿石和宝石。",
        "Ores are primarily used in the Smelting skill to create bars.": "矿石主要用于冶炼技能中制作金属锭。",
        "Gems are primarily used in the Enchanting skill to create Arcane Powder which is a material required for various Essences.": "宝石主要用于附魔技能中制作奥术粉末，这是制作各种精华所需的材料。",
        "The Mining skill provides +0.25% Mining efficiency per level. Mining efficiency gives a chance to perform another action instantly.": "采矿技能每级提供+0.25%的采矿效率。采矿效率增加了立即执行另一项操作的机会。",
        "The primary tool for Mining is the Pickaxe which increases Mining speed.": "采矿的主要工具是镐，可以增加采矿速度。",
        "The Smelting skill specialises in crafting bars from ores (Mining) and charcoal (Woodcutting).": "冶炼技能专门从矿石（采矿）和木炭（伐木）中制作金属锭。",
        "Bars are primarily used in the Smithing skill to create weapons, tools and armour. They are also used when building House structures and Guild buildings.": "金属锭主要用于锻造技能中制作武器、工具和护甲。它们还用于建造房屋结构和公会建筑。",
        "The Smelting skill provides +0.25% Smelting efficiency per level. Smelting efficiency gives a chance to perform another action instantly.": "冶炼技能每级提供+0.25%的冶炼效率。冶炼效率增加了立即执行另一项操作的机会。",
        "The primary House structure for Smelting is the Furnace which increases Smelting speed.": "冶炼的主要房屋结构是熔炉，可以增加冶炼速度。",
        "The Smithing skill specialises in crafting weapons, tools and armour from bars (Smelting).": "锻造技能专门从金属锭（冶炼）中锻造武器、工具和护甲。",
        "Weapons are primarily used to deal damage to enemies in combat. Each weapon has a special effect. Swords specialise in dealing consistently high damage. Hammers specialise in stunning enemies (pausing their attack for 2.5 seconds). Bows specialise in dealing critical hits (1.5 times damage). Spears specialise in parrying (take 50% damage and deal 25% back). Scythes specialise in bleed (deal 1.5 times damage over 3 seconds).": "武器主要用于在战斗中对敌人造成伤害。每种武器都有特殊效果。剑专注于造成持续高伤害。锤子专注于震慑敌人（暂停其攻击2.5秒）。弓箭专注于造成致命打击（1.5倍伤害）。长矛专注于格挡（承受50%伤害并反击25%）。镰刀专注于流血效果（3秒内造成1.5倍伤害）。",
        "Tools specialise in increasing skill speed for the relevant skill. Hatchets are for Woodcutting. Rods are for Fishing. Spades are for Farming. Pickaxes are for Mining.": "工具专门用于增加相关技能的工作速度。斧用于伐木。鱼竿用于钓鱼。铲子用于农业。镐用于采矿。",
        "Armour is primarily used to provide damage reduction from enemy attacks in combat. Most equipment also increases maximum health for combat.": "护甲主要用于在战斗中提供减少来自敌人攻击的伤害。大多数装备还会增加战斗中的最大生命值。",
        "Weapons, tools and armour can be upgraded in the Inventory Page under the Upgrade tab. Upgrading starts from Copper and works its way up, always requiring the metal before it (i.e. Superior Iron requires Perfect Copper).": "武器、工具和护甲可以在背包页面的升级选项卡中进行升级。升级从铜开始，并依次升级，始终需要前一个金属（例如，卓越铁需要完美铜）。",
        "The Smithing skill provides +0.25% Smithing efficiency per level. Smithing efficiency gives a chance to perform another action instantly.": "锻造技能每级提供+0.25%的锻造效率。锻造效率增加了立即执行另一项操作的机会。",
        "The primary House structure for Smithing is the Anvil which increases Smithing speed.": "锻造的主要房屋结构是铁砧，可以增加锻造速度。",
        "The Enchanting skill specialises in crafting essence from bones (Combat) and gems (Mining).": "附魔技能专门从骨头（战斗）和宝石（采矿）中制作精华。",
        "Essences are primarily used to craft and upgrade Tomes. They can also be used to enhance the efficiency of certain structures in the House.": "精华主要用于制作和升级卷轴。它们还可以用于提高房屋中某些结构的效率。",
        "Crafting tomes will require an Ancient Tome which can only be found from Challenge reward chests. All tomes are untradeable and require Enchanting levels to equip. Selling a tome in the Inventory page will allow for a new Ancient Tome to drop in the next challenge chest opened.": "制作卷轴需要古老卷轴，只能从挑战奖励宝箱中获得。所有卷轴都不可交易，并且需要附魔等级才能装备。在背包页面出售卷轴将使下一个挑战宝箱中掉落一个新的古老卷轴。",
        "The Enchanting skill provides +0.25% Enchanting efficiency per level. Enchanting efficiency gives a chance to perform another action instantly.": "附魔技能每级提供+0.25%的附魔效率。附魔效率增加了立即执行另一项操作的机会。",
        "The primary House structure for Enchanting is the Enchanting Table which increases Enchanting speed.": "附魔的主要房屋结构是附魔台，可以增加附魔速度。",
        "The Farming skill specialises in gathering flowers and vegetables.": "农业技能专门用于采集花卉和蔬菜。",
        "Flowers are primarily used in the Alchemy skill to create potions.": "花卉主要用于炼金术技能中制作药水。",
        "Vegetables are primarily used in the Cooking skill to create pies which provide healing in combat.": "蔬菜主要用于烹饪技能中制作馅饼，可在战斗中提供治疗。",
        "The Farming skill requires seeds which can be bought from the Merchant, and compost which can be created from fruit (Woodcutting) or bones (Combat).": "农业技能需要从商人购买的种子，以及可以从果实（伐木）或骨头（战斗）中制作的堆肥。",
        "The Farming skill provides +0.25% Farming efficiency per level. Farming efficiency gives a chance to perform another action instantly.": "农业技能每级提供+0.25%的农业效率。农业效率增加了立即执行另一项操作的机会。",
        "The primary tool for Farming is the Spade which increases Farming speed.": "农业的主要工具是铲子，可以增加农业速度。",
        "The Alchemy skill specialises in creating potions from flowers (Farming) and bones (Combat).": "炼金术技能专门从花卉（农业）和骨头（战斗）中制作药水。",
        "Potions have many different effects and each potion will last 3 minutes.": "药水有许多不同的效果，每种药水持续3分钟。",
        "Super potions can be upgraded into Divine potions in the Inventory Page under the Upgrade tab.": "超级药水可以在背包页面的升级选项卡中升级为神圣药水。",
        "The Alchemy skill provides +0.25% Alchemy efficiency per level. Alchemy efficiency gives a chance to perform another action instantly.": "炼金术技能每级提供+0.25%的炼金效率。炼金效率增加了立即执行另一项操作的机会。",
        "The primary House structure for Alchemy is the Alchemy Lab which increases Alchemy speed.": "炼金术的主要房屋结构是炼金实验室，可以增加炼金速度。",
        "The Fishing skill specialises in gathering raw fish.": "钓鱼技能专门用于采集生鱼。",
        "Raw fish are primarily used in the Cooking skill to create cooked fish which provide healing in combat.": "生鱼主要用于烹饪技能中制作熟鱼，熟鱼可在战斗中提供治疗。",
        "The Fishing skill has a base 80% success chance to catch fish. It provides a +1% success chance for every Fishing level over the required skill level (up to +15%). It also provides a +1% success chance every 20 Fishing levels (up to +5%).": "钓鱼技能有80%的基础成功几率来捕鱼。每超过所需技能等级的1个钓鱼等级增加+1%的成功几率（最高+15%）。此外，每20个钓鱼等级增加+1%的成功几率（最高+5%）。",
        "Failing to catch a fish will provide XP but the loot will be a junk item.": "未能捕鱼将提供经验，但战利品将是垃圾物品。",
        "The Fishing skill provides +0.25% Fishing efficiency per level. Fishing efficiency gives a chance to perform another action instantly.": "钓鱼技能每级提供+0.25%的钓鱼效率。钓鱼效率增加了立即执行另一项操作的机会。",
        "The primary tool for Fishing is the Rod which increases Fishing speed.": "钓鱼的主要工具是鱼竿，可以增加钓鱼速度。",
        "The Cooking skill specialises in creating foods from ingredients (Fishing, Farming) and charcoal (Woodcutting).": "烹饪技能专门从食材（钓鱼、农业）和木炭（伐木）中制作食物。",
        "Cooked food is primarily used for healing in combat. Equipped food is automatically used when health falls below 33% during combat with a 15 second cooldown.": "熟食主要用于在战斗中进行治疗。装备的食物在战斗中的健康值低于33%时会自动使用，冷却时间为15秒。",
        "The Cooking skill has a base 80% success chance to cook Fish. It provides a +1% success chance for every Cooking level over the required skill level (up to +15%). It also provides a +1% success chance every 20 Cooking levels (up to +5%).": "烹饪技能有80%的基础成功几率来烹饪鱼类食物。每超过所需技能等级的1个烹饪等级增加+1%的成功几率（最高+15%）。此外，每20个烹饪等级增加+1%的成功几率（最高+5%）。",
        "Burning food will provide XP but the food will be inedible.": "烧焦的食物会提供经验，但食物将无法食用。",
        "The Cooking skill provides +0.25% Cooking efficiency per level. Cooking efficiency gives a chance to perform another action instantly.": "烹饪技能每级提供+0.25%的烹饪效率。烹饪效率增加了立即执行另一项操作的机会。",
        "The primary House structure for Cooking is the Cooking Pot which increases Cooking speed.": "烹饪的主要房屋结构是烹饪锅，可以增加烹饪速度。",
        "The One-handed skill provides +0.25% one-handed efficiency per level. One-handed efficiency gives a chance to double combat XP and loot while training One-handed.": "单手技能每级提供+0.25%的单手效率。单手效率增加了训练单手时双倍战斗经验和战利品的机会。",
        "One-handed accuracy starts at 75% if the level is matched with the monster. Every level over the monster level will increase accuracy by 0.5% (capped at 90%). Every level below the monster level will decrease accuracy by 0.5%.": "如果与怪物的等级相匹配，单手精度起始为75%。超过怪物等级的每级将增加0.5%的精度（最高为90%）。低于怪物等级的每级将减少0.5%的精度。",
        "One-handed weapons include Swords and Hammers. Swords specialise in dealing consistently high damage. Hammers specialise in stunning enemies (pausing their attack for 2.5 seconds).": "单手武器包括剑和锤子。剑专注于造成持续高伤害。锤子专注于震慑敌人（暂停其攻击2.5秒）。",
        "One-handed off-hands include Shields. Shields specialise in blocking enemy hits which will nullify all damage.": "单手副手包括盾牌。盾牌专注于阻挡敌人的攻击，可以抵消所有伤害。",
        "One-handed weapons are strong against enemies found in the Mountain area and in the Mining outskirts.": "单手武器在山区和采矿郊区的敌人中表现较强。",
        "One-handed weapons are weak against enemies found in the Forest area and in the Woodcutting & Farming outskirts.": "单手武器在森林区和伐木与农业郊区的敌人中表现较弱。",
        "The Two-handed skill provides +0.25% two-handed efficiency per level. Two-handed efficiency gives a chance to double combat XP and loot while training Two-handed.": "双手技能每级提供+0.25%的双手效率。双手效率增加了训练双手时双倍战斗经验和战利品的机会。",
        "Two-handed accuracy starts at 75% if the level is matched with the monster. Every level over the monster level will increase accuracy by 0.5% (capped at 90%). Every level below the monster level will decrease accuracy by 0.5%.": "如果与怪物的等级相匹配，双手精度起始为75%。超过怪物等级的每级将增加0.5%的精度（最高为90%）。低于怪物等级的每级将减少0.5%的精度。",
        "Two-handed weapons include Spears and Scythes. Spears specialise in parrying, which reduces incoming damage by 50% and deals 25% character damage back. Scythes specialise in causing bleed, which deals 50% of the initial damage dealt over 3 seconds.": "双手武器包括长矛和镰刀。长矛专注于招架，减少50%的受到伤害，并反弹25%的角色伤害。镰刀专注于造成流血效果，会在3秒内造成初始伤害的50%。",
        "Two-handed weapons are strong against enemies found in the Ocean area and in the Fishing outskirts.": "双手武器在海洋区域和钓鱼郊区的敌人中表现较强。",
        "Two-handed weapons are weak against enemies found in the Mountain area and in the Mining outskirts.": "双手武器在山区和采矿郊区的敌人中表现较弱。",
        "The Ranged skill provides +0.25% ranged efficiency per level. Ranged efficiency gives a chance to double combat XP and loot while training Ranged.": "远程技能每级提供+0.25%的远程效率。远程效率增加了训练远程时双倍战斗经验和战利品的机会。",
        "Ranged accuracy starts at 75% if the level is matched with the monster. Every level over the monster level will increase accuracy by 0.5% (capped at 90%). Every level below the monster level will decrease accuracy by 0.5%.": "如果与怪物的等级相匹配，远程精度起始为75%。超过怪物等级的每级将增加0.5%的精度（最高为90%）。低于怪物等级的每级将减少0.5%的精度。",
        "Preserve ammo chance gives a chance to not use arrows when attacking with a Bow. Preserve ammo chance starts at 65% and every Ranged level above the required level of the arrow increases it by 0.5% to a maximum of 80%.": "保留弹药几率使得使用弓攻击时有机会不消耗箭矢。保留弹药几率起始为65%，每超过所需箭矢等级的1个远程等级增加0.5%，最高可达80%。",
        "Ranged weapons include Bows and Boomerangs. Bows specialise in dealing critical hits to enemies (1.5 times damage). Boomerangs specialise in taking coins from enemies on every successful attack.": "远程武器包括弓和回旋镖。弓专注于对敌人造成暴击（伤害提升1.5倍）。回旋镖专注于在每次成功攻击时从敌人身上获取硬币。",
        "Ranged weapons are strong against enemies found in the Forest area and in the Woodcutting & Farming outskirts.": "远程武器对森林区域和伐木与农业郊区的敌人表现较强。",
        "Ranged weapons are weak against enemies found in the Ocean area and in the Fishing outskirts.": "远程武器对海洋区域和钓鱼郊区的敌人表现较弱。",
        "The Defense skill provides +0.25% defense efficiency per level. Defense efficiency gives a chance to double combat XP and loot while training Defense.": "防御技能每级提供+0.25%的防御效率。防御效率增加了训练防御时双倍战斗经验和战利品的机会。",
        "The Defense skill specialises in lowering monster accuracy. Every level over the monster level will lower monster accuracy by 0.5%. Every level under the monster level will increase monster accuracy by 0.5% (capped at 90%).": "防御技能专注于降低怪物的命中精度。每超过怪物等级的1个防御等级会使怪物的命中精度降低0.5%。每低于怪物等级的1个防御等级会使怪物的命中精度提高0.5%（最高为90%）。",
        "The Defense skill makes up 25% of the combat level. The remaining 75% of the combat level is made up of the highest non-defense combat skill.": "防御技能占战斗等级的25%。战斗等级的剩余75%由最高的非防御战斗技能组成。",
        "Health can be restored in combat by equipping food. Equipped food is automatically used when health falls below 33% during combat with a 15 second cooldown.": "在战斗中可以通过装备食物恢复健康。当战斗中的健康值低于33%时，装备的食物会自动使用，冷却时间为15秒。",
        "Reaching zero health will cause the player to stop combat and go idle. Health is automatically restored to full when combat is stopped.": "健康值降至零会导致玩家停止战斗并进入空闲状态。战斗停止时，健康值会自动恢复到满值。",
        "Challenge Scrolls can be found randomly while doing any action in any Skill that is Lv. 25 or higher.": "挑战卷轴可以在进行任何25级或更高技能的任何操作时随机找到。",
        "Challenges are divided into three regions, the Forest, Mountain and Ocean. Each region has a specific set of skills that they specialise in. The Forest region specialises in Woodcutting, Farming, Alchemy, Ranged and Defense. The Mountain region specialises in Mining, Smelting, Smithing, One-handed and Defense. The Ocean region specialises in Fishing, Cooking, Enchanting, Two-handed and Defense. Challenge requirements will always conform to the skills within the region.": "挑战分为三个区域：森林、山脉和海洋。每个区域都有其专门的一组技能。森林区域专攻伐木、农业、炼金术、远程和防御。山脉区域专攻采矿、冶炼、锻造、单手武器和防御。海洋区域专攻钓鱼、烹饪、附魔、双手武器和防御。挑战要求将始终符合该区域内的技能。",
        "A maximum of 10 Challenge Scrolls can be used per day (starting a challenge with gold does not contribute to this amount).": "每天最多可以使用10张挑战卷轴（使用金币开始挑战不计入此数量）。",
        "Challenges can also be started by paying a gold cost instead of using a Challenge Scroll. This gold cost increases after each purchase and is reset at the beginning of each week. Starting a challenge with gold does not count towards the 10 scroll usage limit per day.": "挑战也可以通过支付金币费用而不是使用挑战卷轴来开始。每次购买后金币费用都会增加，并在每周初重置。使用金币开始的挑战不计入每天10张卷轴的使用限制。",
        "": "",
        "": "",
        "Hide 'Welcome Back' messages while online": "在登陆时隐藏欢迎回来提示",
        "": "",
        "": "",
        "": "",
        "": "",
        "": "",
        "": "",
        "": "",
        //原样
        "v1.0.3": "v1.0.3",
        "Gityx": "Gityx",
        'ID': 'ID',
        'h': 'h',
        'm': 'm',
        "gityx": "gityx",
        '': '',
        '': '',
        '': '',
        '': '',
        '': '',
        '': '',

    }

    var cnPrefix = {
        "(-": "(-",
        "(+": "(+",
        "(": "(",
        "-": "-",
        "+": "+",
        ": ": "： ",
        "\n           ": "\n           ",
        "\n          ": "\n          ",
        "\n         ": "\n         ",
        "\n        ": "\n        ",
        " ": "",
        "↓  ": "↓  ",
        "Active Rankers: ": "活跃排名者：",
        "Round Base Point Requirement: ": "回合基础点数要求：",
        "Ladder Base Point Requirement: ": "天梯基础点数要求：",
        "Ladder: ": "天梯：",
        "Message length: ": "消息长度",
        "Round: ": "回合：",
        "All But ": "全卖仅保留 ",
        "": "",
        "": "",
        "": "",
        "": "",
        "": "",
        "": "",
        "": "",
        "": "",
        "": "",
        "": "",
        "": "",
        "": "",
        "": "",
        "": "",
        "": "",
        "": "",
        "": "",
        "": "",
        "": "",
        "": "",
        "": "",
        "": "",
        "": "",
        "": "",
        "": "",
        "": "",
        "": "",
        "Norkos Dungeon -": "诺科斯地牢-",
    }

    //需处理的后缀
    var cnPostfix = {
        ":": "：",
        "：": "：",
        ": ": "： ",
        "： ": "： ",
        " ": "",
        "/s)": "/s)",
        "/s": "/s",
        ")": ")",
        "%": "%",
        " ": " ",
        "": "",
    }

    //需排除的，正则匹配
    var cnExcludeWhole = [
        /^(\d+)$/,
        /^\s*$/, //纯空格
        /^([\d\.]+):([\d\.]+)$/,
        /^([\d\.]+):([\d\.]+):([\d\.]+)$/,
        /^([\d\.]+)\-([\d\.]+)\-([\d\.]+)$/,
        /^([\d\.]+)e(\d+)$/,
        /^([\d\.]+)$/,
        /^\(([\d\.]+)\/([\d\.]+)\)$/,
        /^成本(.+)$/,
        /^\(([\d\.]+)\%\)$/,
        /^([\d\.]+):([\d\.]+):([\d\.]+)$/,
        /^([\d\.]+)K$/,
        /^([\d\.]+)M$/,
        /^([\d\.]+)m$/,
        /^([\d\.]+)B$/,
        /^([\d\.]+) K$/,
        /^([\d\.]+) M$/,
        /^([\d\.]+) B$/,
        /^([\d\.]+)s$/,
        /^([\d\.]+)x$/,
        /^x([\d\.]+)$/,
        /^([\d\.,]+)$/,
        /^\+([\d\.,]+)$/,
        /^\-([\d\.,]+)$/,
        /^([\d\.,]+)x$/,
        /^x([\d\.,]+)$/,
        /^([\d\.,]+) \/ ([\d\.,]+)$/,
        /^([\d\.]+)e([\d\.,]+)$/,
        /^e([\d\.]+)e([\d\.,]+)$/,
        /^x([\d\.]+)e([\d\.,]+)$/,
        /^([\d\.]+)e([\d\.,]+)x$/,
        /^[\u4E00-\u9FA5]+$/,
        /[\u4E00-\u9FA5]/,

        /.+\/.+XP$/,
        /^\d+\s*-\s*\d+$/,
        /\/\s\d+/,
    ];

    var cnExcludePostfix = [
        // 需排除的后缀内容在这里定义...
    ];

    //正则替换，带数字的固定格式句子
    //纯数字：(\d+)
    //逗号：([\d\.,]+)
    //小数点：([\d\.]+)
    //原样输出的字段：(.+)
    //换行加空格：\n(.+)
    var cnRegReplace = new Map([
        [/^([\d\.]+) hours ([\d\.]+) minutes ([\d\.]+) seconds$/, '$1 小时 $2 分钟 $3 秒'],
        [/^You are gaining (.+) elves per second$/, '你每秒获得 $1 精灵'],
        [/^You have (.+) points$/, '你有 $1 点数'],
        [/^Next at (.+) points$/, '下一个在 $1 点数'],
        [/^([\d\.]+) \/ ([\d\.]+) XP$/, '$1 \/ $2 经验值'],
        [/^([\d\.]+)\/sec$/, '$1\/秒'],
        [/^([\d\.,]+)\/sec$/, '$1\/秒'],
        [/^([\d\.,]+) OOMs\/sec$/, '$1 OOMs\/秒'],
        [/^([\d\.]+) OOMs\/sec$/, '$1 OOMs\/秒'],
        [/^([\d\.]+)e([\d\.,]+)\/sec$/, '$1e$2\/秒'],
        [/^requires ([\d\.]+) more research points$/, '需要$1个研究点'],
        [/^([\d\.]+)e([\d\.,]+) points$/, '$1e$2 点数'],
        [/^([\d\.]+) elves$/, '$1 精灵'],
        [/^([\d\.]+)s Attack Speed$/, '$1秒 攻击速度'],
        [/^([\d\.]+)d ([\d\.]+)h ([\d\.]+)m$/, '$1天 $2小时 $3分'],
        [/^([\d\.]+)e([\d\.,]+) elves$/, '$1e$2 精灵'],
        [/^\+([\d\.,]+)\% Woodcutting Speed$/, '\+$1\% 伐木速度'],
        [/^\+([\d\.,]+)\% Mining Speed$/, '\+$1\% 采矿速度'],
        [/^\+([\d\.,]+)\% Fishing Speed$/, '\+$1\% 钓鱼速度'],
        [/^([\d\.,]+)\% Woodcutting Speed$/, '$1\% 伐木速度'],
        [/^([\d\.,]+)\% Mining Speed$/, '$1\% 采矿速度'],
        [/^([\d\.,]+)\% Fishing Speed$/, '$1\% 钓鱼速度'],
        [/^([\d\.,]+)\% Speed$/, '$1\% 速度'],
        [/^\+([\d\.,]+) Health$/, '\+$1 生命值'],
        [/^\+([\d\.,]+) Damage$/, '\+$1 伤害'],
        [/^\+([\d\.,]+) Defense$/, '\+$1 防御'],
        [/^([\d\.,]+) Wood Pickaxe$/, '$1 木镐'],
        [/^([\d\.,]+) Listings$/, '$1 队列'],
        [/^Lv. ([\d\.,]+)$/, '等级 $1'],
        [/^([\d\.,]+) XP$/, '$1 经验值'],
        [/^([\d\.,]+) HP$/, '$1 生命值'],
        [/^([\d\.,]+) Iron Ore$/, '$1 铁矿石'],
        [/^([\d\.,]+) Coal Ore$/, '$1 煤'],
        [/^([\d\.,]+) Cobalt Ore$/, '$1 钴矿石'],
        [/^([\d\.,]+) Silver Ore$/, '$1 银矿石'],
        [/^([\d\.,]+) Gold Ore$/, '$1 金矿石'],
        [/^([\d\.,]+) Copper Ore$/, '$1 铜矿石'],
        [/^([\d\.,]+) Iron Bar$/, '$1 铁锭'],
        [/^([\d\.,]+) Cobalt Bar$/, '$1 钴锭'],
        [/^([\d\.,]+) Silver Bar$/, '$1 银锭'],
        [/^([\d\.,]+) Gold Bar$/, '$1 金锭'],
        [/^([\d\.,]+) Copper Bar$/, '$1 铜锭'],
        [/^([\d\.,]+) Iron Boots$/, '$1 铁靴'],
        [/^([\d\.,]+) Cobalt Boots$/, '$1 钴靴'],
        [/^([\d\.,]+) Silver Boots$/, '$1 银靴'],
        [/^([\d\.,]+) Gold Boots$/, '$1 金靴'],
        [/^([\d\.,]+) Copper Boots$/, '$1 铜靴'],
        [/^([\d\.,]+) Ruby$/, '$1 红宝石'],
        [/^([\d\.,]+) Health$/, '$1 生命值'],
        [/^([\d\.,]+) Damage$/, '$1 伤害'],
        [/^([\d\.,]+) Defense$/, '$1 防御'],
        [/^([\d\.,]+) Bone$/, '$1 骨头'],
        [/^([\d\.,]+) elves$/, '$1 精灵'],
        [/^\*(.+) to electricity gain$/, '\*$1 到电力增益'],
        [/^Cost: (.+) points$/, '成本：$1 点数'],
        [/^Req: (.+) elves$/, '要求：$1 精灵'],
        [/^Req: (.+) \/ (.+) elves$/, '要求：$1 \/ $2 精灵'],
        [/^Usages: (\d+)\/$/, '用途：$1\/'],
        [/^workers: (\d+)\/$/, '工人：$1\/'],

        [/\b(\d+\s*~\s*\d+)\s*HP\b/g, '$1 生命值'],
        [/\b(\d+\s*~\s*\d+)\s*Damage\b/g, '$1 伤害'],
        [/\b(\d+\s*-\s*\d+)\s*Coins on Hit\b/g, '$1 硬币当攻击时'],
        [/^([\d\.,]+) Armour$/, '$1 护甲'],
        [/^([\d\.,]+)\% Farming Speed$/, '\$1\% 农业速度'],
        [/^([\d\.,]+)\% Combat XP$/, '\$1\% 战斗经验'],
        [/^([\d\.,]+)\% Crafting XP$/, '\$1\% 制作经验'],
        [/^([\d\.,]+) Ranged Damage$/, '\$1 远程武器伤害'],
        [/^([\d\.,]+) One-handed Damage$/, '\$1 单手武器伤害'],
        [/^([\d\.,]+) Two-handed Damage$/, '\$1 双手武器伤害'],
        [/^([\d\.,]+)\% Minimum Damage$/, '\$1\% 最小伤害'],
        [/^([\d\.,]+)\% Stun Chance$/, '\$1\% 击晕几率'],
        [/^([\d\.,]+)\% Block Chance$/, '\$1\% 格挡几率'],
        [/^([\d\.,]+)\% Parry Chance$/, '\$1\% 招架几率'],
        [/^([\d\.,]+)\% Bleed Chance$/, '\$1\% 流血几率'],
        [/^([\d\.,]+)\% Critical Hit Chance$/, '\$1\% 致命一击几率'],
        [/^Heals (.+) HP$/, '回复 $1 点生命值'],
        [/^([\d\.]+)s Time$/, '$1秒 持续时间'],
        [/^Ore (\d+)$/, '矿石 $1'],
        [/^Fish (\d+)$/, '鱼类 $1'],
        [/^Melee Block (\d+)$/, '近战格挡 $1'],
        [/^Veges (\d+)$/, '蔬菜 $1'],
        [/^Bones (\d+)$/, '骨头 $1'],
        [/^Loot Find (\d+)$/, '战利品发现 $1'],
        [/^Wood (\d+)$/, '木头 $1'],
        [/^Flowers (\d+)$/, '花朵 $1'],
        [/^Ranged Evade (\d+)$/, '远程闪避 $1'],
        [/^Magic Resist (\d+)$/, '魔法抵抗 $1'],
        [/^Egg Find (\d+)$/, '蛋发现率 $1'],
        [/^Hunger (\d+)$/, '食物消耗 $1'],
    ]);


    var CNITEM_DEBUG = 0;
    let needHanList = []

    function cnItemByTag(text, itemgroup, node, textori) {
        for (let i in itemgroup) {
            if (i[0] == '.') { // 匹配节点及其父节点的class
                let current_node = node;
                while (current_node) {
                    if (current_node.classList && current_node.classList.contains(i.substr(1))) {
                        return itemgroup[i];
                    } else if (current_node.parentElement && current_node.parentElement != document.documentElement) {
                        current_node = current_node.parentElement;
                    } else {
                        break;
                    }
                }
            } else if (i[0] == '#') { // 匹配节点及其父节点的id
                let current_node = node;
                while (current_node) {
                    if (current_node.id == i.substr(1)) {
                        return itemgroup[i];
                    } else if (current_node.parentElement && current_node.parentElement != document.documentElement) {
                        current_node = current_node.parentElement;
                    } else {
                        break;
                    }
                }
            } else if (i[0] == '$') { // 执行document.querySelector
                if (document.querySelector(i.substr(1)) != null) {
                    return itemgroup[i];
                }
            } else if (i[0] == '*') { // 搜索原始文本
                if (textori.includes(i.substr(1))) {
                    return itemgroup[i];
                }
            } else {
                CNITEM_DEBUG && console.log({ text, itemgroup, dsc: "不识别的标签" + i });
            }
        }
        return null;
    }

    let reverseTranslates = {};
    for (var key in cnItems) {
        if (cnItems.hasOwnProperty(key) && key !== '_OTHER_') {
            var value = cnItems[key];
            if (value.length <= 20) {  // 检查值的长度是否超过20个字符
                reverseTranslates[value] = key;
            }
        }
    }

    function itemFilter() {
        const itemFilterSelectors = [
            ['.search', '.search input[type="text"]']
        ];

        for (const [divSelector, inputSelector] of itemFilterSelectors) {
            // 获取原始的div元素
            const nodes = document.querySelectorAll(divSelector);

            if (nodes.length !== 1) {
                console.warn(`Skipping due to unexpected number of elements for selector ${divSelector}: ${nodes.length}`);
                continue;
            }

            const originalDiv = nodes[0];
            const originalInput = originalDiv.querySelector(inputSelector);

            // 检查input元素是否存在
            if (!originalInput) {
                console.error(`Input element not found for selector ${inputSelector}`);
                continue;
            }

            // 创建新的div和input元素
            const newDiv = originalDiv.cloneNode(true);
            const newInput = newDiv.querySelector(inputSelector);

            // 检查克隆的新input元素是否存在
            if (!newInput) {
                console.error(`Cloned input element not found for selector ${inputSelector}`);
                continue;
            }

            newInput.placeholder = "搜索";
            originalDiv.parentNode.insertBefore(newDiv, originalDiv);

            // 监听新input的input事件
            newInput.addEventListener("input", function () {
                const searchValue = newInput.value.trim();
                const englishPattern = /^[a-zA-Z0-9\-_!@#$%^&*()+=]+$/;

                if (englishPattern.test(searchValue)) {
                    // 如果输入符合要求，直接同步到原输入框
                    const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
                    nativeInputValueSetter.call(originalInput, searchValue);
                    const event = new Event("input", { bubbles: true });
                    originalInput.dispatchEvent(event);
                } else {
                    // 否则进行字典搜索
                    let matches = [];

                    for (let key in reverseTranslates) {
                        if (key.includes(searchValue)) {
                            matches.push(reverseTranslates[key]);
                        }
                    }

                    if (matches.length > 0) {
                        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
                        nativeInputValueSetter.call(originalInput, matches.join('|'));
                        const event = new Event("input", { bubbles: true });
                        originalInput.dispatchEvent(event);
                    } else {
                        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
                        nativeInputValueSetter.call(originalInput, "");
                        const event = new Event("input", { bubbles: true });
                        originalInput.dispatchEvent(event);
                    }
                }
            });

            originalDiv.style.display = 'none';
        }
    }



    var cnItem = function(text, node) {
        if (typeof (text) != "string")
            return text;
        let textori = text;
        let text_prefix = "";
        for (let prefix in cnPrefix) {
            if (text.substr(0, prefix.length) === prefix) {
                text_prefix += cnPrefix[prefix];
                text = text.substr(prefix.length);
            }
        }
        let text_postfix = "";
        for (let postfix in cnPostfix) {
            if (text.substr(-postfix.length) === postfix) {
                text_postfix = cnPostfix[postfix] + text_postfix;
                text = text.substr(0, text.length - postfix.length);
            }
        }
        let text_reg_exclude_postfix = "";
        for (let reg of cnExcludePostfix) {
            let result = text.match(reg);
            if (result) {
                text_reg_exclude_postfix = result[0] + text_reg_exclude_postfix;
                text = text.substr(0, text.length - result[0].length);
            }
        }
        if (!cnItems._OTHER_) cnItems._OTHER_ = [];
        for (let reg of cnExcludeWhole) {
            if (reg.test(text)) {
                return text_prefix + text + text_reg_exclude_postfix + text_postfix;;
            }
        }
        for (let [key, value] of cnRegReplace.entries()) {
            if (key.test(text)) {
                return text_prefix + text.replace(key, value) + text_reg_exclude_postfix + text_postfix;
            }
        }
        for (let i in cnItems) {
            if (typeof (cnItems[i]) == "string" && (text == i || text == cnItems[i])) {
                return text_prefix + cnItems[i] + text_reg_exclude_postfix + text_postfix;
            } else if (typeof (cnItems[i]) == "object" && text == i) {
                let result = cnItemByTag(i, cnItems[i], node, textori);
                if (result != null) {
                    return text_prefix + result + text_reg_exclude_postfix + text_postfix;
                } else {
                    CNITEM_DEBUG && console.log({ text: i, cnitem: cnItems[i], node });
                }
            }
        }
        let save_cfg = 1;
        let save_text = save_cfg ? text : textori;
        for (
            let i = 0; i < cnItems._OTHER_.length; i++
        ) {
            if (save_text == cnItems._OTHER_[i])
                return text_prefix + text + text_reg_exclude_postfix + text_postfix;
        }
        if (cnItems._OTHER_.length < 1000) {
            cnItems._OTHER_.push(save_text);
            cnItems._OTHER_.sort(
                function (a, b) {
                    return a.localeCompare(b)
                }
            );
        }
        if (CNITEM_DEBUG) {
            console.log('有需要汉化的英文：', text);
            needHanList.push(text); // 将文本添加到需要汉化列表中
        }
        return text_prefix + text + text_reg_exclude_postfix + text_postfix;
    };

    var transTaskMgr = {
        tasks: [],
        addTask: function(node, attr, text) {
            this.tasks.push({
                node,
                attr,
                text
            });
        },
        doTask: function() {
            var task = null;
            while (task = this.tasks.pop()) {
                task.node[task.attr] = task.text;
            }
        }
    };

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

    console.log("加载汉化模块");

    var observer_config = {
        attributes: false,
        characterData: true,
        childList: true,
        subtree: true
    };

    var targetNode = document.body;

    TransSubTextNode(targetNode);
    transTaskMgr.doTask();

    var observer = new MutationObserver(function(e) {
        observer.disconnect();
        for (var _i = 0, e_1 = e; _i < e_1.length; _i++) {
            var mutation = e_1[_i];
            if (mutation.target.nodeName === "SCRIPT" || mutation.target.nodeName === "STYLE" || mutation.target.nodeName === "TEXTAREA")
                continue;
            if (mutation.target.nodeName === "#text") {
                mutation.target.textContent = cnItem(mutation.target.textContent, mutation.target);
            } else if (!mutation.target.childNodes || mutation.target.childNodes.length == 0) {
                mutation.target.innerText = cnItem(mutation.target.innerText, mutation.target);
            } else if (mutation.addedNodes.length > 0) {
                for (var _a = 0, _b = mutation.addedNodes; _a < _b.length; _a++) {
                    var node = _b[_a];
                    if (node.nodeName === "#text") {
                        node.textContent = cnItem(node.textContent, node);
                    } else if (node.nodeName !== "SCRIPT" && node.nodeName !== "STYLE" && node.nodeName !== "TEXTAREA") {
                        if (!node.childNodes || node.childNodes.length == 0) {
                            if (node.innerText)
                                node.innerText = cnItem(node.innerText, node);
                        } else {
                            TransSubTextNode(node);
                            transTaskMgr.doTask();
                        }
                    }
                }
            }
        }
        if (document.querySelector('.search')) {
            itemFilter();
        }
        observer.observe(targetNode, observer_config);
    });

    observer.observe(targetNode, observer_config);


})();