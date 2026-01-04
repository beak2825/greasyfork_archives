// ==UserScript==
// @name         Factory Earth 简中汉化脚本
// @namespace    https://www.g8hh.com.cn/
// @version      0.0.29
// @description  网页游戏 Factory Earth (https://factory-earth.fly.dev/) 的简体中文汉化脚本。Simplified Chinese i18n script for web game Factory Earth.
// @author       好阳光的小锅巴 & 麦子
// @copyright    锅巴汉化
// @contributionUR    https://gityx.com/donate/intro.html
// @license      MIT
// @include      *https://factory-earth.fly.dev/*
// @grant        none
// @website      https://www.gityx.com
// @downloadURL https://update.greasyfork.org/scripts/527549/Factory%20Earth%20%E7%AE%80%E4%B8%AD%E6%B1%89%E5%8C%96%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/527549/Factory%20Earth%20%E7%AE%80%E4%B8%AD%E6%B1%89%E5%8C%96%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
/**
 * ---------------------------
 * Time: 2024/09/19 14:00
 * Author: guoba
 * View: https://www.gityx.com
 * ---------------------------
 */
//1.汉化杂项
var cnItems = {
    _OTHER_: [],

    //设置
    'Save': '保存',
    'Export': '导出',
    'Import': '导入',
    'Settings': '设置',
    'Achievements': '成就',
    'Statistics': '统计',
    'Changelog': '更新日志',
    'Hotkeys': '快捷键',
    'ALL': '全部',
    'Default': '默认',
    'AUTO': '自动',
    'default': '默认',
    "points": "点数",
    "Reset for +": "重置得到 + ",
    "Currently": "当前",
    "Effect": "效果",
    "Cost": "成本",
    "Goal:": "目标:",
    "Reward": "奖励",
    "Start": "开始",
    "Exit Early": "提前退出",
    "Finish": "完成",
    "Milestone Gotten!": "获得里程碑！",
    "Milestones": "里程碑",
    "Completed": "已完成",
    "Default Save": "默认存档",
    "Delete": "删除",
    "No": "否",
    "Saves": "存档",
    "Options": "选项",
    "Yes": "是",
    "Are you sure?": "你确定吗？",
    "Edit Name": "编辑名称",
    "Info": "信息",
    "Currently:": "当前:",
    "Appearance": "外观",
    "How the game looks.": "游戏看起来如何。",
    "Theme": "主题",
    "Show milestones": "显示里程碑",
    "Show TPS meter at the bottom-left corner of the page.": "在页面左下角显示 TPS。",
    "Show TPS": "显示 TPS",
    "None": "无",
    "Align modifier units": "对齐概览单位",
    "Align numbers to the beginning of the unit in modifier view.": "在概览视图中将数字与单元的开头对齐。",
    "Select which milestones to display based on criterias.": "根据标准选择要显示的里程碑。",
    "All": "全部",
    "Classic": "经典",
    "Configurable": "可配置",
    "Duplicate": "复制",
    "Mute": "静音",
    "Unmute": "播放",
    "Head": "头部",
    "Hide Multiplayer": "隐藏多玩家",
    "HP": "生命值",
    "Stone": "石头",
    "Sell": "出售",
    "Setting": "设置",
    "Action": "动作",
    "Body": "身体",
    "Attack": "攻击",
    "Bronze": "青铜",
    "Buy": "购买",
    "Character died.": "角色挂了。",
    "Copy": "复制",
    "Character restarted.": "角色重新开始了。",
    "Dark": "深色",
    "Enemy": "敌人",
    "Equipment": "装备",
    "English": "英文",
    "Events": "事件",
    "Wood": "木头",
    "Victory": "胜利",
    "Tin ore": "锡矿石",
    "Factory Earth": "地球工厂",
    "Food": "食物",
    "Logout": "登出",
    "Market": "市场",
    "Out of Water": "没有水了",
    "Out of Food": "没有食物了",
    "Output": "产出",
    "Own Orders": "拥有订单",
    "Progress": "进度",
    "Player": "玩家",
    "Post Order": "发布订单",
    "Q&A": "问&答",
    "Send": "发送",
    "Storage": "存储",
    "Time": "时间",
    "Loading... (Try Setting>Logout if stuck)": "加载中…(如果卡住，尝试 设置 > 登出)",
    "Next": "下一页",
    "Restart": "重新开始",
    "Search": "搜索",
    "Your Status:": "你的状态:",
    "You have landed on an unknown planet with a small group.": "你和一小群人登陆了一个未知的星球。",
    "You managed to defeat it. Things may have turned out different, however, if you were not as lucky.": "你成功打败了它。然而，如果你没有那么幸运的话，事情可能会有所不同。",
    "Your character died. Go to Overview and click Restart. You will lose all skills, but retain your items.": "你的角色死了。进入“概览”，点击“重新开始”。你将失去所有技能，但保留你的物品。",
    "With food, your health will increase over time.": "有了食物，你的生命值会随着时间的推移而增加。",
    "Water": "水",
    "Tin ore is long one. Ignots are fast": "锡矿是一种长矿石。无知的人跑得快",
    "Occasionally, it may be a good idea to restart before your character's death.": "有时候，在角色死亡之前重新开始游戏是个好主意。",
    "A creature tries to steal your food. You fight back.": "有生物试图偷走你的食物。你反击了。",
    "Age": "年龄",
    "Build Pyramid": "建造金字塔",
    "Chat": "聊天",
    "Copper": "铜",
    "Different characters may be generated with different talents. Use it well.": "不同的角色可能产生不同的天赋。好好利用它。",
    "Engineering Victory": "工程胜利",
    "Ent": "树人",
    "Exploration Victory": "探索胜利",
    "Explore East": "向东探索",
    "Explore North": "向北探索",
    "Explore South": "向南探索",
    "Explore West": "向西探索",
    "Explore Surroundings": "探索周围环境",
    "Certain skills may have more than one requirements.": "某些技能可能有不止一个要求。",
    "Light": "浅色",
    "Input": "输入",
    "Cancel": "取消",
    "Level": "等级",
    "Go to Action>Explore Surroundings and click Start.": "转到 行动 > 探索周围环境，然后点击开始。",
    "Gain water to heal even faster. Food and water will be consumed over time, so be careful.": "获得水可以更快地恢复。食物和水会随着时间的推移而消耗，所以要小心。",
    "Some alien-looking creatures show hostility. You may want protection.": "一些看起来像外星人的生物表现出敌意。你可能需要保护。",
    "Complete Map of the Island": "完成岛屿地图",
    "You see some trees in this direction": "你看到这个方向有一些树",
    "You can see the horizon": "你可以看到地平线",
    "Will reset skill levels and enemy strength, but retain items": "会重置技能等级和敌人力量，但保留道具",
    "Consumable": "消耗品",
    "Provides heal, consumed every minute": "提供治疗，每分钟消耗一次",
    "\"Explore Forest\"": "\"探索森林\"",
    "Explore Forest": "探索森林",
    "Some of the fruits may be edible": "有些水果可以食用",
    "Cannot be done when dead.": "死亡状态无法执行此操作。",
    "Produce wood to craft more items. (Hint: try getting Wood I to level 5)": "生产木材来制作更多的物品。(提示:试着把 木头 I 提升到 5 级)",
    "Yes, in proportion to the amount of remaining progress.\n        If an action takes 5 wood, takes 15 second and is cancelled after 10 seconds,\n        it would return 5*(1-10/15)=5/3=1.66 wood - that is, 1 wood with 33% or 2 wood with 67% probability.": "是的，按剩余进度的比例。如果一个动作需要5个木头，需要15秒，并在10秒后取消，它将返回5*(1-10/15)=5/3=1.66个木头-即1个木头有33%的概率或2个木头有67%的概率。",
    "Actions are unlocked by reaching certain levels in other skills.\n        Experiment with skill combinations to figure out which ones were the prerequisites.\n        Note that there may be more than one.": "当玩家在其他技能中达到一定等级时，便能够解锁行动。用技能组合做实验，找出哪些是先决条件。\n注意，可能不止一个。",
    ".\n        You can also DM me on Discord, but an email is the surest way.": "你也可以在Discord上发我的DM，但是发电子邮件是最可靠的方式。",
    "> Are input materials returned after cancelling?": ">取消后输入材料是否退回?",
    "> Can I play this game solo?": "我可以独自玩这个游戏吗?",
    "> Do enemies get stronger after killing them? Should I kill them slower for a longer run?": "杀死敌人后会变得更强吗?我是否应该在更长的时间内慢慢杀死他们?",
    "> Does the game end when a player wins?": ">当玩家获胜时游戏是否结束?",
    "> How can I achieve a victory?": ">我怎样才能取得胜利?",
    "> How can I contact the dev?": ">如何联系开发人员?",
    "> I'm stuck. How can I progress further?": "我被卡住了。我怎样才能进一步进步?",
    "Enemy strengths only depend on time. Faster kills will not make them stronger.": "敌人的力量只取决于时间。更快的杀戮不会让他们变得更强大。",
    "It is usually done by acquiring a certain item. You will know when you find it.": "它通常是通过获取某种物品来完成的。你找到的时候就知道了。",
    "No. Although it has a victory system, one player's victory will not affect another player's gameplay.": "不。虽然它有一个胜利系统，但一个玩家的胜利不会影响其他玩家的游戏玩法。",
    "Send an email to": "发送电子邮件至",
    "ssamt@kaist.ac.kr": "ssamt@kaist.ac.kr",
    "Technical Issues": "技术问题",
    "Try leveling different skills. Search for better gears on the market, and try different combinations.\n        Asking others for help is also a good idea.": "尝试升级不同的技能。在市场上寻找更好的装备，并尝试不同的组合。向别人寻求帮助也是一个好主意。",
    "Try working on some other action and trade for what you want. There are also certain gears that will make you faster.\n    As a final resort, you could restart your character.": "试着做一些其他的事情来换取你想要的东西。也有一些档位会让你跑得更快。作为最后的手段，你可以重新启动你的角色。",
    "Yes. Players cannot adversely affect each other, so you may ignore them if you wish.\n        However, progression may be significantly harder without sharing of information.": "是的。玩家不会对彼此产生负面影响，所以如果你愿意，你可以忽略他们。然而，如果没有信息共享，进展可能会更加困难。",
    "Research Foraging": "研究觅食",
    "Reconnecting...": "重新连接…",
    "Required": "要求",
    "Space travel victory": "太空旅行胜利",
    "Meat": "肉",
    "Material": "材料",
    "Bone": "骨头",
    "Copied!": "已复制!",
    "Go to Storage and click to equip. Go to Equipment and click again to unequip.": "进入“存储”，点击即可“装备”，再点击即可“解除装备”。",
    "A mountain peak is visible through the clouds": "透过云层可以看到一座高山",
    "You try to find a path around it": "你试着找到一条绕过它的路",
    "mountain": "山",
    "Skin": "兽皮",
    "Your not gonna be swinging it easily": "你可没那么容易搞定",
    "Disconnected from server. Try reloading.": "与服务器断开连接。尝试刷新以重新加载。",
    "Accept": "接受",
    "Confirm": "确认",
    "Batch": "批量",
    "[Login]": "[登录]",
    "[Quickstart]": "[快速入门]",
    "[Register]": "[注册]",
    "[Start]": "[开始]",
    "2024-09-16 Clarified enemy generation on Q&A.": "2024-09-16问答中明确了敌人的生成。",
    "About the game": "关于游戏",
    "Factory Earth - Beta": "地球工厂-测试版",
    "ID:": "用户名:",
    "Latest Update": "最新更新",
    "One account per player.": "每个玩家一个帐户。",
    "PW Confirm:": "确认密码:",
    "PW:": "密码:",
    "Rules & Guidelines": "规则 & 指南",
    "This is an experimental multiplayer idle game.": "这是一个实验性的多人在线放置游戏。",
    "Warning: Guests accounts will be deleted on closed tab/server updates.": "警告:关闭页签/服务器更新 将删除客人帐户。",
    "Your goal is to explore, research, and craft items to progress through the tech tree.": "你的目标是探索、研究和制作道具，以便在科技树中取得进展。",
    "A cool breeze is blowing from the north": "一阵凉爽的微风从北方吹来",
    "[spoiler]": "[剧透]",
    "\"Fire I\"": "\"火 I\"",
    "\"Fire I-II\"": "\"火 I-II\"",
    "\"Cross River\"": "\"渡过河流\"",
    "\"Cook Meat\"": "\"烹饪肉食\"",
    "\"Wood Plank\"": "\"木板\"",
    "\"Explore River\"": "\"探索河流\"",
    "\"Explore Mountains\"": "\"探索高山\"",
    "\"Explore Mountains II\"": "\"探索高山 II\"",
    "\"Explore Ruins\"": "\"探索遗迹\"",
    "\"Explore Plains\"": "\"探索平原\"",
    "\"Climb Mountain\"": "\"爬山\"",
    "Explore Ruins": "探索遗迹",
    "Explore Mountains": "探索高山",
    "Explore Mountains II": "探索高山 II",
    "Explore Plains": "探索平原",
    "Explore River": "探索河流",
    "\"Research Foraging\"": "\"研究觅食\"",
    "\"Research Metallurgy\"": "\"研究冶金\"",
    "\"Research Earth\"": "\"研究地球\"",
    "\"Research Weapons\"": "\"研究武器\"",
    "\"Research Fiction\"": "\"研究小说\"",
    "\"Research Crafting\"": "\"研究制作\"",
    "\"Research Writing\"": "\"研究写作\"",
    "\"Research Masonry\"": "\"研究砌筑\"",
    "\"Research Astronomy\"": "\"研究天文学\"",
    "\"Research Mathematics\"": "\"研究数学\"",
    "\"Research Nature\"": "\"研究自然\"",
    "\"Research Music\"": "\"研究音乐\"",
    "\"Research Fire\"": "\"研究火\"",
    "\"Research History\"": "\"研究历史\"",
    "\"Research Geography\"": "\"研究地理\"",
    "\"Research Philosophy\"": "\"研究哲学\"",
    "Research History": "研究历史",
    "Research Geography": "研究地理",
    "Research Metallurgy": "研究冶金",
    "Research Earth": "研究地球",
    "Research Weapons": "研究武器",
    "Research Nature": "研究自然",
    "Research Mathematics": "研究数学",
    "Research Music": "研究音乐",
    "Research Astronomy": "研究天文学",
    "Research Masonry": "研究砌筑",
    "Research Crafting": "研究制作",
    "Research Philosophy": "研究哲学",
    "Research Fiction": "研究小说",
    "Research Writing": "研究写作",
    "Research Fire": "研究火",
    "Crossing it does not seem trivial": "跨越它似乎并不简单",
    "Container": "集装箱",
    "Map of West": "西部地图",
    "String": "线",
    "Rope": "绳子",
    "Place": "放置",
    "Leather": "皮革",
    "Cook Meat": "烹饪肉食",
    "Cross River": "渡过河流",
    "Wood Plank": "木板",
    "Pyramid": "金字塔",
    "Final Product": "最终产品",
    "Animal": "动物",
    "Sheep": "绵羊",
    "No match found": "未找到匹配项",
    "No orders yet": "暂无订单",
    "Dog": "狗",
    "Map of the Island": "岛屿地图",
    "Map of North": "北部地图",
    "Map of South": "南部地图",
    "Map of East": "东部地图",
    "Prev": "上一页",
    "You have reached the maximum speed of production.": "你们已经达到了生产的最高速度。",
    "Bow": "弓",
    "Ore": "矿石",
    "Pyramid Plan": "金字塔图纸",
    "Tin": "锡",
    "Epic Poetry": "史诗诗歌",
    "Announcement": "公告",
    "All three victories have been discovered.\n                For further information, check the new link in Settings.": "这三个胜利都被发现了。有关更多信息，请检查设置中的新链接。",
    "Plans": "计划",
    "My current plan is to make this into a seasonal game - I can't possibly run an MMO alone with new contents all year round.\n    So I'll work on new contents and new mechanics for a while, enough to last around a month or so,\n        release the updates for a new season, and when all the victories are discovered the season ends and I go back to working on new contents, and so on.": "我目前的计划是把它变成一款季节性游戏——我不可能全年都独自运行一款带有新内容的MMO。所以我会花一段时间开发新内容和新机制，大概持续一个月左右，然后发布新赛季的更新，当所有胜利都被发现时，赛季结束，我就回去开发新内容，以此类推。",
    "In this case, I will release the source code of the entire game, for others to add contents, host, and play, maybe even implement some new stuff.\n    (Sometimes I feel like half the people on this game are better programmers than I am)": "在这种情况下，我将发布整个游戏的源代码，让其他人添加内容，托管和玩，甚至可能实现一些新的东西。有时候我觉得这款游戏中有一半的人都比我更擅长编程。",
    "And I don't think hosting will be much of an issue - this game is so light that it currently runs on a single, free CPU on fly.io.\n        I'm sure you could find ways to continue this game for free in the future as well. As long as someone is willing, that is.": "我不认为托管会是一个很大的问题-这款游戏是如此轻，它目前运行在一个单一的，免费的CPU在fly.io。我相信你将来也能找到继续免费玩这款游戏的方法。只要有人愿意，那就行。",
    "And that's all I had to say. Thank you for playing Factory Earth.\n        Both the server and Discord chat will remain open, so come visit once in a while :)": "这就是我要说的。谢谢你玩地球工厂。\n服务器和Discord聊天都是开放的，有空来看看吧:)",
    "Best-case Scenario": "最佳情况",
    "But some of you might be wondering now: Is the game over? Or will there be more contents in the future? When can we get them?": "但你们中的一些人现在可能会想:游戏结束了吗?还是以后会有更多的内容?我们什么时候能拿到?",
    "Here are my thoughts.": "以下是我的想法。",
    "I think this is the best way to go forward, but as usual, if you have different ideas, don't hesitate to tell me.": "我认为这是最好的前进方式，但像往常一样，如果你有不同的想法，请不要犹豫告诉我。",
    "Same as any other indie games - me becoming unable to find time for it. This is a real possibility as well.": "和其他独立游戏一样，我找不到时间玩这款游戏。这也是一种真实的可能性。",
    "So, you found all three victories. Congratulations. Especially for our three winners, puntsagyin, Yam, and Rutimo.\n        I hope you all had fun in the process. I certainly did.": "所以，你找到了所有三场胜利。祝贺你。尤其是我们的三位获胜者，puntsagyin, Yam和Rutimo。我希望你们在这个过程中都玩得开心。当然了。",
    "Worst-case Scenario": "最糟糕的情况",
    "Climb Mountain": "爬山",
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
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "Hat": "帽子",
    "Hat\"": "帽子\"",
    "Shoes": "鞋子",
    "Shoes\"": "鞋子\"",
    "Shirt": "衬衫",
    "Shirt\"": "衬衫\"",
    "Wool": "羊毛",
    "Pants": "裤子",
    "Pants\"": "裤子\"",
    "Feet": "脚部",
    "Weapon": "武器",
    "Legs": "腿部",
    "Sword": "剑",
    "Sword\"": "剑\"",
    "Legging": "护腿",
    "Leggings": "护腿",
    "Leggings\"": "护腿\"",
    "Helmet": "头盔",
    "Helmet\"": "头盔\"",
    "Plate": "板甲",
    "Plate\"": "板甲\"",
    "Boots": "靴",
    "Boots\"": "靴\"",
    "May": "5月",

    // 图标代码，不能汉化
    "Jacorb's Games": "Jacorb's Games",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "Scientific": "科学计数法",
    "Standard": "标准",
    "Blind": "盲文",
    "Letters": "字母",
    "Mixed Engineering": "混合工程",
    "Mixed Scientific": "混合科学",
    "Chemistry": "化学",
    "Engineering": "工程符号",
    "By Jacorb90": "By Jacorb90",
    "content_copy": "content_copy",
    "library_books": "library_books",
    "discord": "discord",
    "drag_handle": "drag_handle",
    "edit": "edit",
    "forum": "forum",
    "content_paste": "content_paste",
    "delete": "delete",
    "info": "info",
    "settings": "settings",
    'Twitter': 'Twitter',
    "Discord": "Discord",
    "Facebook": "Facebook",
    "Instagram": "Instagram",
    "gityxcom": "gityxcom",
    "Footer": "Footer",
    "Wiki": "Wiki",
    "gityx": "gityx",

    //树游戏
    'Loading...': '加载中...',
    'ALWAYS': '一直',
    'HARD RESET': '硬重置',
    'Export to clipboard': '导出到剪切板',
    'INCOMPLETE': '不完整',
    'HIDDEN': '隐藏',
    'AUTOMATION': '自动',
    'NEVER': '从不',
    'ON': '打开',
    'OFF': '关闭',
    'SHOWN': '显示',
    'Play Again': '再次游戏',
    'Keep Going': '继续',
    'The Modding Tree Discord': '模型树Discord',
    'You have': '你有',
    'It took you {{formatTime(player.timePlayed)}} to beat the game.': '花费了 {{formatTime(player.timePlayed)}} 时间去通关游戏.',
    'Congratulations! You have reached the end and beaten this game, but for now...': '恭喜你！ 您已经结束并通关了本游戏，但就目前而言...',
    'Main Prestige Tree server': '主声望树服务器',
    'Reach {{formatWhole(ENDGAME)}} to beat the game!': '达到 {{formatWhole(ENDGAME)}} 去通关游戏!',
    "Loading... (If this takes too long it means there was a serious error!": "正在加载...（如果这花费的时间太长，则表示存在严重错误！",
    'Loading... (If this takes too long it means there was a serious error!)←': '正在加载...（如果时间太长，则表示存在严重错误！）←',
    'Main\n\t\t\t\tPrestige Tree server': '主\n\t\t\t\t声望树服务器',
    'The Modding Tree\n\t\t\t\t\t\t\tDiscord': '模型树\n\t\t\t\t\t\t\tDiscord',
    'Please check the Discord to see if there are new content updates!': '请检查 Discord 以查看是否有新的内容更新！',
    'aqua': '水色',
    'AUTOMATION, INCOMPLETE': '自动化，不完整',
    'LAST, AUTO, INCOMPLETE': '最后，自动，不完整',
    'NONE': '无',
    'P: Reset for': 'P: 重置获得',
    'Git游戏': 'Git游戏',
    'QQ群号': 'QQ群号',
    'x': 'x',
    'QQ群号:': 'QQ群号:',
    '* 启用后台游戏': '* 启用后台游戏',
    '更多同类游戏:': '更多同类游戏:',
    'i': 'i',
    'I': 'I',
    'II': 'II',
    'III': 'III',
    'IV': 'IV',
    'V': 'V',
    'VI': 'VI',
    'VII': 'VII',
    'VIII': 'VIII',
    'X': 'X',
    'XI': 'XI',
    'XII': 'XII',
    'XIII': 'XIII',
    'XIV': 'XIV',
    'XV': 'XV',
    'XVI': 'XVI',
    'A': 'A',
    'B': 'B',
    'C': 'C',
    'D': 'D',
    'E': 'E',
    'F': 'F',
    'G': 'G',
    'H': 'H',
    'I': 'I',
    'J': 'J',
    'K': 'K',
    'L': 'L',
    'M': 'M',
    'N': 'N',
    'O': 'O',
    'P': 'P',
    'Q': 'Q',
    'R': 'R',
    'S': 'S',
    'T': 'T',
    'U': 'U',
    'V': 'V',
    'W': 'W',
    'X': 'X',
    'Y': 'Y',
    'Z': 'Z',
    '<': '<',
    '<<': '<<',
    '>': '>',
    '>>': '>>',
    "Gityx": "Gityx",
    "Gz": "Gz",
    "O": "O",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
}


//需处理的前缀
var cnPrefix = {
    "\n": "\n",
    "                   ": "",
    "                  ": "",
    "                 ": "",
    "                ": "",
    "               ": "",
    "              ": "",
    "             ": "",
    "            ": "",
    "           ": "",
    "          ": "",
    "         ": "",
    "        ": "",
    "       ": "",
    "      ": "",
    "     ": "",
    "    ": "",
    "   ": "",
    "  ": " ",
    " ": " ",
    //树游戏
    "\t\t\t": "\t\t\t",
    "\n\n\t\t": "\n\n\t\t",
    "\n\t\t": "\n\t\t",
    "\t": "\t",
    "Show Milestones: ": "显示里程碑：",
    "Autosave: ": "自动保存: ",
    "Offline Prod: ": "离线生产: ",
    "Completed Challenges: ": "完成的挑战: ",
    "High-Quality Tree: ": "高质量树贴图: ",
    "Offline Time: ": "离线时间: ",
    "Theme: ": "主题: ",
    "Anti-Epilepsy Mode: ": "抗癫痫模式：",
    "In-line Exponent: ": "直列指数：",
    "Single-Tab Mode: ": "单标签模式：",
    "Time Played: ": "已玩时长：",
    "Shift-Click to Toggle Tooltips: ": "Shift-单击以切换工具提示：",
    "Notation: ": "符号: ",
    "Toggle Music: ": "切换声音: ",
    "Bronze ": "青铜",
    "Stone ": "石头 ",
    "Philosopher ": "哲人",
    "Overview": "概览",
    "New Skill ": "新技能 ",
    "Hunting ": "狩猎 ",
    "hunting ": "狩猎 ",
    "Container ": "集装箱 ",
    "Leather ": "皮革 ",
    "String ": "线 ",
    "Food ": "食物 ",
    "Water ": "水 ",
    "Wooden ": "木",
    "Fire ": "火 ",
    "Inspiration ": "灵感 ",
    "Wool ": "羊毛",
    "Brick ": "砖 ",
    "Copper Ore ": "铜矿石 ",
    "Tin Ore ": "锡矿石 ",
    "Tin ": "锡 ",
    "Copper ": "铜",
    "\"Brick ": "\"砖 ",
    "\"Fire ": "\"火 ",
    "\"Leather ": "\"皮革 ",
    "\"Rope": "\"绳子",
    "\"String ": "\"线 ",
    "\"Hunting ": "\"狩猎 ",
    "\"Wood ": "\"木 ",
    "\"Food ": "\"食物 ",
    "\"Water ": "\"水 ",
    "\"Explore West": "\"向西探索",
    "\"Explore East": "\"向东探索",
    "\"Explore North": "\"向北探索",
    "\"Explore South": "\"向南探索",
    "Tool ": "工具 ",
    "Wood ": "木头 ",
    "\"Tool ": "\"工具 ",
    "\"Wooden ": "\"木",
    "Equipment, ": "装备, ",
    "Max HP ": "生命值上限 ",
    "\"Stone ": "\"石头 ",
    "\"Bronze   ": "\"青铜 ",
    "\"Wool  ": "\"羊毛 ",
    "\"Copper Ore  ": "\"铜矿石 ",
    "\"Copper  ": "\"铜 ",
    "Heal +": "治疗 +",
    "Attack +": "攻击 +",
    "Action speed ": "行动速度 ",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
}

//需处理的后缀
var cnPostfix = {
    "                   ": "",
    "                  ": "",
    "                 ": "",
    "                ": "",
    "               ": "",
    "              ": "",
    "             ": "",
    "            ": "",
    "           ": "",
    "          ": "",
    "         ": "",
    "        ": "",
    "       ": "",
    "      ": "",
    "     ": "",
    "    ": "",
    "   ": "",
    "  ": "  ",
    " ": " ",
    "\n": "\n",
    "\n\t\t\t": "\n\t\t\t",
    "\t\t\n\t\t": "\t\t\n\t\t",
    "\t\t\t\t": "\t\t\t\t",
    "\n\t\t": "\n\t\t",
    "\t": "\t",
    "/sec)": "/秒)",
    "% bonus": "% 奖励",
    " day(s)": " 天",
    " Discovered": " 已发现",
    " min(s) of Water left": " 分钟后水将耗尽",
    " hour(s) of Water left": " 小时后水将耗尽",
    " min(s) of Food left": " 分钟后食物将耗尽",
    " hour(s) of Food left": " 小时后食物将耗尽",
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
}

//需排除的，正则匹配
var cnExcludeWhole = [
    /^(\d+)$/,
    /^\s*$/, //纯空格
    /^([\d\.]+):([\d\.]+)$/,
    /^([\d\.]+):([\d\.]+):([\d\.]+)$/,
    /^([\d\.]+):([\d\.]+):([\d\.]+):([\d\.]+)$/,
    /^([\d\.]+):([\d\.]+):([\d\.]+):([\d\.]+):([\d\.]+)$/,
    /^([\d\.]+)h ([\d\.]+)m ([\d\.]+)s$/,
    /^([\d\.]+)y ([\d\.]+)d ([\d\.]+)h$/,
    /^([\d\.]+)\-([\d\.]+)\-([\d\.]+)$/,
    /^([\d\.]+)e(\d+)$/,
    /^([\d\.]+)$/,
    /^\$([\d\.]+)$/,
    /^\(([\d\.]+)\)$/,
    /^([\d\.]+)\%$/,
    /^([\d\.]+)\/([\d\.]+)$/,
    /^([\d\.]+)\/([\d\.,]+)$/,
    /^([\d\.,]+)\/([\d\.,]+)$/,
    /^\(([\d\.]+)\/([\d\.]+)\)$/,
    /^\#\#(.+)$/,
    /^成本(.+)$/,
    /^\(([\d\.]+)\%\)$/,
    /^([\d\.]+):([\d\.]+):([\d\.]+)$/,
    /^([\d\.]+)K$/,
    /^([\d\.]+)M$/,
    /^([\d\.]+)B$/,
    /^([\d\.]+) K$/,
    /^([\d\.]+) M$/,
    /^([\d\.]+) B$/,
    /^([\d\.]+) T$/,
    /^([\d\.]+) Qi$/,
    /^([\d\.]+) Qa$/,
    /^([\d\.]+)s$/,
    /^([\d\.]+)x$/,
    /^x([\d\.]+)$/,
    /^([\d\.,]+)$/,
    /^\$([\d\.,]+)$/,
    /^\+([\d\.,]+)$/,
    /^\-([\d\.,]+)$/,
    /^([\d\.,]+)x$/,
    /^([\d\.,]+)(.+)\_$/,
    /^x([\d\.,]+)$/,
    /^([\d\.,]+) \/ ([\d\.,]+)$/,
    /^([\d\.]+)e([\d\.,]+)$/,
    /^([\d\.]+)e([\d\.,]+) \/ ([\d\.]+)e([\d\.,]+)$/,
    /^\$([\d\.]+)e([\d\.,]+)$/,
    /^([\d\.,]+)\/([\d\.]+)e([\d\.,]+)$/,
    /^([\d\.]+)e([\d\.,]+)\/([\d\.]+)e([\d\.,]+)$/,
    /^([\d\.]+)e\+([\d\.,]+)$/,
    /^e([\d\.]+)e([\d\.,]+)$/,
    /^x([\d\.]+)e([\d\.,]+)$/,
    /^([\d\.]+)e([\d\.,]+)x$/,
    // /^([\uD800-\uDBFF][\uDC00-\uDFFF])|([\u2600-\u27BF])|([\u2300-\u23FF])|([\u2B50-\u2B55])|([\u203C-\u3299])|[\u21A9\u21AA\u25B6\u25C0\u2B06\u2B07\u2B05\u2B95\u2B99\u2B9A]+$/,
    // /^([\uD800-\uDBFF][\uDC00-\uDFFF])|([\u2600-\u27BF])|([\u2300-\u23FF])|([\u2B50-\u2B55])|([\u203C-\u3299])+$/,
    // /^[\uD800-\uFFFF]+$/,
    /^[\u4E00-\u9FA5]+$/
];
var cnExcludePostfix = []

//正则替换，带数���的固定格式句子
//纯数字：(\d+)
//逗号：([\d\.,]+)
//小数点：([\d\.]+)
//原样输出的字段：(.+)
var cnRegReplace = new Map([
    [/^([\d\.]+) hours ([\d\.]+) minutes ([\d\.]+) seconds$/, '$1 小时 $2 分钟 $3 秒'],
    [/^You are gaining (.+) elves per second$/, '你每秒获得 $1 精灵'],
    [/^You have (.+) points$/, '你有 $1 点数'],
    [/^Won by (.+)$/, '获胜者是 $1'],
    [/^Next at (.+) points$/, '下一个在 $1 点数'],
	[/^([\d\.]+)\/sec$/, '$1\/秒'],
	[/^([\d\.,]+)\/sec$/, '$1\/秒'],
	[/^([\d\.,]+) OOMs\/sec$/, '$1 OOMs\/秒'],
	[/^([\d\.]+) OOMs\/sec$/, '$1 OOMs\/秒'],
	[/^([\d\.]+)e([\d\.,]+)\/sec$/, '$1e$2\/秒'],
    [/^requires ([\d\.]+) more research points$/, '需要$1个研究点'],
    [/^([\d\.]+)e([\d\.,]+) points$/, '$1e$2 点数'],
    [/^([\d\.]+)m ([\d\.]+)s$/, '$1分 $2秒'],
    [/^([\d\.]+) elves$/, '$1 精灵'],
    [/^([\d\.]+)d ([\d\.]+)h ([\d\.]+)m$/, '$1天 $2小时 $3分'],
    [/^([\d\.]+)e([\d\.,]+) elves$/, '$1e$2 精灵'],
    [/^([\d\.,]+) elves$/, '$1 精灵'],
    [/^([\d\.,]+) skills discovered$/, '已发现 $1 技能'],
    [/^Day ([\d\.,]+)$/, '天数 $1'],
    [/^\*(.+) to electricity gain$/, '\*$1 到电力增益'],
    [/^Cost: (.+) points$/, '成本：$1 点数'],
    [/^Req: (.+) elves$/, '要求：$1 精灵'],
    [/^Req: (.+) \/ (.+) elves$/, '要求：$1 \/ $2 精灵'],
    [/^Usages: (\d+)\/$/, '用途：$1\/'],
    [/^workers: (\d+)\/$/, '工人：$1\/'],

]);

var CNITEM_DEBUG = 0;

function cnItemByTag(text, itemgroup, node, textori) {
    for (let i in itemgroup) {
        if (i[0] == '.') { //匹配节点及其父节点的class
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
        } else if (i[0] == '#') { //匹配节点及其父节点的id
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
        } else if (i[0] == '$') { //执行document.querySelector
            if (document.querySelector(i.substr(1)) != null) {
                return itemgroup[i];
            }
        } else if (i[0] == '*') { //搜索原始文本
            if (textori.includes(i.substr(1))) {
                return itemgroup[i];
            }
        }
        // and more ...
        else {
            CNITEM_DEBUG && console.log({ text, itemgroup, dsc: "不识别的标签" + i })
        }
    }
    return null;
}

//2.采集新词
//20190320@JAR  rewrite by 麦子
var cnItem = function(text, node) {

    if (typeof(text) != "string")
        return text;
    let textori = text;
    //处理前缀
    let text_prefix = "";
    for (let prefix in cnPrefix) {
        if (text.substr(0, prefix.length) === prefix) {
            text_prefix += cnPrefix[prefix];
            text = text.substr(prefix.length);
        }
    }
    //处理后缀
    let text_postfix = "";
    for (let postfix in cnPostfix) {
        if (text.substr(-postfix.length) === postfix) {
            text_postfix = cnPostfix[postfix] + text_postfix;
            text = text.substr(0, text.length - postfix.length);
        }
    }
    //处理正则后缀
    let text_reg_exclude_postfix = "";
    for (let reg of cnExcludePostfix) {
        let result = text.match(reg);
        if (result) {
            text_reg_exclude_postfix = result[0] + text_reg_exclude_postfix;
            text = text.substr(0, text.length - result[0].length);
        }
    }

    //检验字典是否可存
    if (!cnItems._OTHER_) cnItems._OTHER_ = [];

    //检查是否排除
    for (let reg of cnExcludeWhole) {
        if (reg.test(text)) {
            return text_prefix + text + text_reg_exclude_postfix + text_postfix;;
        }
    }

    //尝试正则替换
    for (let [key, value] of cnRegReplace.entries()) {
        if (key.test(text)) {
            return text_prefix + text.replace(key, value) + text_reg_exclude_postfix + text_postfix;
        }
    }

    //遍历尝试匹配
    for (let i in cnItems) {
        //字典已有词汇或译文、且译文不为空，则返回译文
        if (typeof(cnItems[i]) == "string" && (text == i || text == cnItems[i])) {
            return text_prefix + cnItems[i] + text_reg_exclude_postfix + text_postfix;
        } else if (typeof(cnItems[i]) == "object" && text == i) {
            let result = cnItemByTag(i, cnItems[i], node, textori);
            if (result != null) {
                return text_prefix + result + text_reg_exclude_postfix + text_postfix;
            } else {
                CNITEM_DEBUG && console.log({ text: i, cnitem: cnItems[i], node });
            }
        } else {
            // continue;
        }
    }

    //调整收录的词条，0=收录原文，1=收录去除前后缀的文本
    let save_cfg = 1;
    let save_text = save_cfg ? text : textori;
    //遍历生词表是否收录
    for (
        let i = 0; i < cnItems._OTHER_.length; i++
    ) {
        //已收录则直接返回
        if (save_text == cnItems._OTHER_[i])
            return text_prefix + text + text_reg_exclude_postfix + text_postfix;
    }

    if (cnItems._OTHER_.length < 1000) {
        //未收录则保存
        cnItems._OTHER_.push(save_text);
        cnItems._OTHER_.sort(
            function(a, b) {
                return a.localeCompare(b)
            }
        );
    }

    //开启生词打印
    CNITEM_DEBUG && console.log(
        '有需要汉化的英文：', text
    );

    //返回生词字串
    return text_prefix + text + text_reg_exclude_postfix + text_postfix;
};

transTaskMgr = {
    tasks: [],
    addTask: function(node, attr, text) {
        this.tasks.push({
            node,
            attr,
            text
        })
    },
    doTask: function() {
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
                //console.log(subnode);
            } else if (subnode.nodeName !== "SCRIPT" && subnode.nodeName !== "STYLE" && subnode.nodeName !== "TEXTAREA") {
                if (!subnode.childNodes || subnode.childNodes.length == 0) {
                    let text = subnode.innerText;
                    let cnText = cnItem(text, subnode);
                    cnText !== text && transTaskMgr.addTask(subnode, 'innerText', cnText);
                    //console.log(subnode);
                } else {
                    TransSubTextNode(subnode);
                }
            } else {
                // do nothing;
            }
        }
    }
}

! function() {
    console.log("加载汉化模块");

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
    let observer = new MutationObserver(function(e) {
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
                        //console.log(node);
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
        observer.observe(targetNode, observer_config);
        //window.afterTransTime = performance.now();
        //console.log("捕获到页面变化并执行汉化，耗时" + (afterTransTime - beforeTransTime) + "毫秒");
    });
    observer.observe(targetNode, observer_config);
    window.cnItems = cnItems
}();