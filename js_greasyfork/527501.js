// ==UserScript==
// @name         Relife Habits 简体中文汉化脚本
// @namespace    https://www.g8hh.com.cn/
// @version      0.0.11
// @description  网页游戏 Relife Habits (https://relifehabits.com/) 的简体中文汉化脚本。Simplified Chinese i18n script for web game Relife Habits.
// @author       好阳光的小锅巴 & 麦子
// @copyright    锅巴汉化
// @contributionUR    https://gityx.com/donate/intro.html
// @icon        https://relifehabits.com/icon.ico
// @require      https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.6.0/jquery.min.js
// @license      MIT
// @include      *https://relifehabits.com/*
// @grant        none
// @website      https://www.gityx.com/
// @downloadURL https://update.greasyfork.org/scripts/527501/Relife%20Habits%20%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87%E6%B1%89%E5%8C%96%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/527501/Relife%20Habits%20%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87%E6%B1%89%E5%8C%96%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
/**
 * ---------------------------
 * Time: 2025/02/19 21:19
 * Author: guoba
 * View: https://www.gityx.com/
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
    "Help": "帮助",
    "Health:": "生命值:",
    "gold": "金币",
    "Decrease speed": "降低速度",
    "Increase speed": "提高速度",
    "Inventory": "库存",
    "Mana:": "法力:",
    "DMG:": "伤害:",
    "Exit Tower": "退出塔",
    "Enter the Tower": "进入塔",
    "Combat Logs": "战斗日志",
    "Blogs": "博客",
    "Current Speed:": "当前速度:",
    "Lvl.": "等级",
    "Leaderboard": "排行榜",
    "Monster": "怪物",
    "Player": "玩家",
    "Our Discord": "我们的 Discord",
    "Retry": "重试",
    "Quests": "任务",
    "Re:LIFE": "重生之塔",
    "Progress": "进度",
    "Retry Tower": "重试爬塔",
    "Shop": "商店",
    "Spells": "法术",
    "Tower": "塔",
    "The Tower of Rebirth": "重生之塔",
    "Total Reward:": "总计奖励:",
    "XP to level:": "升级经验:",
    "Difficulty:": "难度:",
    "Vows": "誓约",
    "This should be easy...": "这应该很容易……",
    "damage to": "伤害到",
    "Account": "账户",
    "About Us": "关于我们",
    ", Current Physical Parry value:": "，当前物理格挡值：",
    ", Current Melee Hit Ability value:": "，当前近战命中能力值：",
    "armor": "护甲",
    "Game Over": "游戏结束",
    "Goblin Bandit": "哥布林强盗",
    "Frail Goblin": "虚弱的哥布林",
    "rolled": "掷出了",
    "Bandit Cove": "强盗湾",
    "dealt": "输出",
    "Floor": "楼层",
    "Floors": "楼层",
    "Hero's Landing": "英雄大陆",
    "It's a long way up...": "这是一条很长的路…",
    "You have been defeated. Do some quests or buy items from the shop to get stronger": "你被打败了。做一些任务或从商店购买物品来变得更强",
    "You need to enable JavaScript to run this app.": "你需要启用JavaScript来运行这个应用程序。",
    "Your Active Quests": "你的可用任务",
    "XP": "经验值",
    "View Daily Quests": "查看日常任务",
    "Select Quest": "选择任务",
    "Write Down 3 Goals": "写下3个目标",
    "Clean Your Room": "打扫你的房间",
    "Complete 10 push-ups to boost your strength.": "完成10个俯卧撑来增强力量。",
    "Complete 20 sit-ups to improve your core strength.": "完成20个仰卧起坐来提高你的核心力量。",
    "Compliment Someone": "赞美他人",
    "Declutter your inbox by unsubscribing from unnecessary newsletters.": "取消订阅不必要的时事通讯，清理你的收件箱。",
    "Do 10 Pushups": "做10个俯卧撑",
    "Do 10 Push-Ups": "做10个俯卧撑",
    "Do 20 Sit-Ups": "做20个仰卧起坐",
    "Get better quests as you level up": "随着等级的提升，可以获得更好的任务",
    "Give a genuine compliment to someone.": "真诚地赞美别人。",
    "Make it a point to smile at five different people today.": "今天一定要对五个不同的人微笑。",
    "Meditation Practice": "冥想练习",
    "Pick your Daily Quests": "选择你的每日任务",
    "Plan three goals you want to achieve this month.": "计划三个你想在这个月实现的目标。",
    "Read for 20 Minutes": "阅读20分钟",
    "Smile at 5 People": "对5个人微笑",
    "Spend 20 minutes reading a book or article.": "花20分钟读一本书或一篇文章。",
    "Spend 20 minutes tidying up your living space.": "花20分钟整理你的生活空间。",
    "Spend 5 minutes meditating to improve focus.": "花5分钟冥想来提高注意力。",
    "Unsubscribe from 5 Emails": "取消订阅5封电子邮件",
    "You can pick a quest from the daily quests section.": "你可以从每日任务中选择一个任务。",
    "Finish Quest": "完成任务",
    "Joined at:": "加入时间：",
    "Remove Quest": "移除任务",
    "Show Less": "收起",
    "Show More": "展开",
    "After Stats": "之后的属性",
    "Before Stats": "之前的属性",
    "bravery": "勇气",
    "endurance": "耐力",
    "intelligence": "智力",
    "Level After": "之后的等级",
    "Level Before": "之前的等级",
    "Level:": "等级：",
    "No levels.": "无等级。",
    "strength": "力量",
    "XP:": "经验值：",
    "You have no items right now.": "您现在没有物品。",
    "Bravery": "勇气",
    "Endurance": "耐力",
    "Intelligence": "智力",
    "Loading stats...": "加载统计…",
    "N/A": "N/A",
    "Player Progress": "玩家进度",
    "Strength": "力量",
    "World Median:": "世界中位数：",
    "Your Weekly Stat:": "你的每周统计:",
    "Available Spells": "可用法术",
    "Click on your spell, and select the slot you want to put it in.": "点击你的法术，选择你想要放置的位置。",
    "First": "第一个",
    "Fourth": "第四个",
    "No spell selected": "没有选择法术",
    "Saved": "保存",
    "Second": "第二个",
    "Select Spell Order": "选择法术顺序",
    "Third": "第三个",
    "Update Spells": "更新法术",
    "You have no spells right now.": "你现在没有法术。",
    "'s Account": "的账户",
    "Armor": "护甲",
    "BASE STATS": "基础属性",
    "COMBAT STATS": "战斗属性",
    "Damage": "伤害",
    "Hit Ability": "命中能力",
    "Magic Penetration": "魔法穿透",
    "Magic Resistance": "魔法抗性",
    "Mana Regeneration": "法力回复",
    "Max Health": "最大生命值",
    "Max Mana": "最大法力值",
    "Parry": "闪避",
    "Sign Out": "登出",
    "Spell Effect Multiplier": "法术效果乘数",
    "XP Progress": "经验进度",
    "XP to next level:": "距离下一级经验值：",
    "Game Shop": "游戏商店",
    "Buy Now": "购买",
    "items": "物品",
    "Items": "物品",
    "rounds": "回合",
    "LEVEL": "等级",
    "Duration:": "持续时长:",
    "INTELLIGENCE": "智力",
    "Gold": "金币",
    "Gold:": "金币:",
    "Heal": "治疗",
    "Health": "生命值",
    "Banana Gun": "香蕉枪",
    "Bamboozle": "欺骗",
    "HitAbility": "命中",
    "(Enter the tower to earn more gold and upgrade your gear!)": "（进入塔中获得更多金币并升级你的装备！）",
    "A brutal dragon slaying sword that Guts used to slay the apostles.": "一把残忍的屠龙剑，内脏用来杀死使徒。",
    "A chestplate that's a little too big for your torso": "胸甲对你的身体来说有点太大了",
    "A common sword that guards use to defend the tower.": "守卫用来保卫塔的普通剑。",
    "A funny gun that will trip up monsters.": "一把能绊倒怪物的有趣的枪。",
    "A futuristic looking jacket that the protagonist of Cyberpunk used.": "赛博朋克的主角用过的一件未来主义风格的夹克。",
    "A helmet made up of the rarest crystals": "一个由最稀有的水晶制成的头盔",
    "A hood made out of goblin leather.": "用地精皮革做的兜帽。",
    "A pair of boots made by Crimson Energy": "一双深红能源公司的靴子",
    "A pair of boots that is made up of the rarest crystals": "一双由最稀有的水晶制成的靴子",
    "A pair of pants that is made up of the rarest crystals": "一条由最稀有的水晶制成的裤子",
    "A pair of pants that's really hard to run in": "一条很难穿的裤子",
    "A pair of pants woven by special threads which infuse Crimson Energy": "一条用特殊的线织成的裤子，注入了深红色的能量",
    "A pair of shoes made out of suspicious leather": "一双用可疑的皮革做的鞋",
    "A powerful chestpiece made up of Crimson Energy, granting bravery to the user": "由深红色能量制成的强大胸牌，赋予使用者勇气",
    "A powerful helmet made up of Crimson Energy": "一个由深红色能量组成的强大头盔",
    "A stylish skirt that will attract all the goblins to the floor.": "一条时髦的裙子会吸引所有的小妖精到地板上。",
    "A sword carved out of pumpkins. Just kidding, it's trees.": "一把用南瓜雕刻的剑。开个玩笑，这是树。",
    "A weapon that plants itself in the hearts of its enemies.": "一种能植入敌人心中的武器。",
    "An artistic chestpiece made up of the rarest crystals": "一个由最稀有的水晶组成的艺术箱子",
    "An axe carved out of the very trees its predecessor cut down": "斧头是用它的前辈砍倒的树木雕刻而成的",
    "An underpiece made out of goblin leather and wool": "用地精皮革和羊毛制成的内衣",
    "As opposed to a ribcage that's not made of bones?": "而不是由骨头构成的胸腔？",
    "available in the shop at the moment.": "目前在商店有售。",
    "Built from the remnants of a skeleton defeated in combat": "由在战斗中战败的骷髅残骸建造而成",
    "Business in the front, party in the back": "工作在前面，聚会在后面",
    "Covers your eyes so it's hard to see, but durable against even hard blows": "遮住你的眼睛，这样就看不见了，但即使是重击也能承受",
    "David Jacket(Cyberpunk)": "大卫夹克(网络朋客)",
    "Discombobulate": "混乱",
    "Doesn't do any damage but it certainly blocks enemy attacks": "虽然不会造成任何伤害，但却能阻挡敌人的攻击",
    "Elucidator and Dark Repulser(SAO)": "阐释者和黑暗排斥者（SAO）",
    "Frazzle": "破碎",
    "Fright": "惊吓",
    "Goblin Slayer Club": "哥布林杀手俱乐部",
    "Guardian Angel": "守护天使",
    "Intelligence Required:": "智力要求：",
    "It leaves a lot of splinters in your enemy but otherwise not very effective": "它会在你的敌人身上留下很多碎片，但除此之外效果并不好",
    "It looks shakespearean and makes you feel more confident in attacking": "它看起来像莎士比亚，让你在进攻时更有信心",
    "Legendary blades from the legendary dual wielder of Sword Art Online": "来自《剑术在线》传奇双持者的传奇剑刃",
    "MagicPenetration": "魔法穿透",
    "MagicRes": "魔法",
    "MagicResistance": "魔抗",
    "Mana cost:": "法力消耗:",
    "NO! Not the metal band. This is metal though. But it's METAL-metal. It's very hard.": "不!不是金属乐队。但这是金属。但它是金属-金属。这很难。",
    "Normally used for cutting grass, now used for cutting down your enemies": "通常用来割草，现在用来砍你的敌人",
    "Not Enough Gold": "没有足够的金币",
    "Not very protective but great for kicking": "不是很有保护作用，但很适合踢腿",
    "Once used by goblins for clubbing, now used by you for partying": "曾经被地精用来泡吧，现在被你用来开派对",
    "Owning this won't make you a weeb. You'll just look like one.": "拥有这个不会让你活一个星期。你看起来就像一个。",
    "Rejuvenate": "恢复",
    "Shatter": "粉碎",
    "Similar to the weapon used to assassinate Julius Caesar.": "和刺杀凯撒所用的武器很像。",
    "Some boots shaped to match your feet": "一些适合你脚的靴子",
    "Some gear forged by some random guy named Smith": "一个叫史密斯的人伪造的装备",
    "Some ugly pants made out of goblin leather": "用妖精皮做的丑裤子",
    "Surprisingly good-looking, durable, and unsurprisingly hard to manuever in": "令人惊讶的好看，耐用，毫不奇怪的是很难操纵",
    "Taken from a necromancer, filled with magical residue but uncomfortable to wear": "从死灵法师身上取下，充满魔法残留物，但戴起来不舒服",
    "The best chestpiece in the game made by the blood and teeth of dragons.": "游戏中最好的胸部是用龙的血和牙齿做成的。",
    "The best helmet in the game made by the blood and teeth of dragons.": "游戏中最好的头盔由龙的血和牙齿制成。",
    "The best pair of boots in the game made by the blood and teeth of dragons.": "游戏中最好的一双靴子，由龙的血和牙齿制成。",
    "The best pair of pants in the game made by the blood and teeth of dragons.": "游戏中最好的一条裤子是用龙的血和牙齿做成的。",
    "Twin blades slicing with the fury of a red dragon's claws": "用红龙狂暴的利爪劈着双刃",
    "You will certainly win more arguments while wearing this": "穿上它，你肯定会赢得更多的争论",
    "You're gonna wear a leather shirt?": "你要穿皮革的衬衫吗?",
    "You": "你",
    "Players": "玩家",
    "Loading leaderboard...": "排行榜加载中...",
    "Last Floor:": "最高层数:",
    "Achieved On:": "达成时间：",
    "Level": "等级",
    "Mysterious Camp": "神秘营地",
    "What are they doing here?": "他们在这里做什么？",
    "boss": "Boss",
    ", Current Magic Penetration value:": "，当前魔法穿透值：",
    ", Current Magic Resistance value:": "，当前魔抗值：",
    "Casting": "施法",
    "Dancing Escort": "跳舞护航",
    "Frazzle is still on cooldown.": "混乱仍在冷却中",
    "Frazzle...": "混乱…",
    "Goblin Alchemist rolled Magic Penetration of": "哥布林炼金术师掷出了魔法穿透",
    "I wonder where this house dropped from...": "我想知道这房子是从哪里掉下来的……",
    "rolled Magic Resistance of": "掷出了魔抗",
    "round(s) remaining": "剩余回合数",
    "Three's a party.": "三个人就够了。",
    "Veteran Goblin has appeared": "资深哥布林出现",
    "Witch's Hut": "女巫小屋",
    "1 Minute Wall Sit": "坐墙1分钟",
    "Bone-Horned Helmet": "骨角头盔",
    "Complete 10 pushups to improve your chest and overall upperbody strength.": "完成10个俯卧撑来提高你的胸部和整个上半身的力量。",
    "Increase your core stability and legs by wall-sitting for 1 minute.": "坐墙1分钟，增加核心稳定性和腿部力量。",
    "Listen to a Podcast": "听播客",
    "Read a Biography": "阅读传记",
    "Read a biography of a historical figure to gain inspiration.": "读一个历史人物的传记来获得灵感。",
    "Spend 30 minutes listening to an educational podcast.": "花30分钟听一个有教育意义的播客。",
    "Stretch your body for 5 minutes to improve flexibility.": "伸展身体5分钟，提高柔韧性。",
    "Take a 5-Minute Stretch Break": "休息5分钟，伸展一下身体",
    "torso": "躯干",
    "feet": "脚部",
    "weapon": "武器",
    "Surprise Party": "惊喜派对",
    "Two's a crowd.": "两个人太多了。",
    "Need Help?": "需要帮助?",
    "If you rolled 6 and 6, then you would roll 2 more dice, one for each 6 you get. In this example, your extra rolls might come out to 6 and 5. Very lucky! Since you got another 6, you can reroll a third time, and say you get 2. Your final EDR would be 6 + 6 + 6 + 5 + 2 = 25.": "如果你掷出6和6，那么你将再掷出2个骰子，每掷出6一个骰子。在这个例子中，额外掷出的点数可能是6和5。非常幸运！既然你又得到了6，你可以第三次掷骰子，得到2。你最终的EDR是6 + 6 + 6 + 5 + 2 = 25。",
    "Multiplies all spell effects by this amount without changing their mana cost, duration or cooldown. Ex: If a spell would heal you for 5, then with a 2x multiplier you would instead heal 10.": "在不改变法力值、持续时间或冷却时间的情况下，将所有法术效果乘以这个数值。例如：如果一个法术能治疗你5点，那么用一个2倍的加成，你就能治疗10点。",
    "Physical Strength directly relates to attack. Bravery is required to fight mini-bosses and bosses. Intelligence is used to get higher discounts in the shop. Stamina is a multiplier to health.": "物理力量直接关系到攻击力。勇气是对抗迷你boss和boss的必要条件。智力是用来在商店里得到更高的折扣。耐力是生命值的乘数。",
    "Armor =  (0.25 * endurance)0.7 + items + EDR": "护甲=（0.25 *耐力）0.7  + 物品  + EDR",
    "Currently each floor will reward a certain amount of gold. We also plan to make monsters drop materials for items as well.": "目前，每个楼层都会奖励一定数量的金币。我们也计划让怪物掉落物品的材料。",
    "Damage = ([1 * strength] + [0.25 * bravery])^0.66 + items + EDR": "伤害=([1 *力量]+[0.25 *勇气])^0.66  + 物品  + EDR",
    "Damage dealt to health. Damage cannot go lower than 0.": "对健康造成的损害伤害不能低于0。",
    "Decreases incoming damage by this value.  Armor cannot go lower than 0.": "减少该值的伤害。护甲不能低于0。",
    "For example, if you roll 4 and 6, then you can roll again, and then get 3 for example. Your final EDR would be 4 + 6 + 3 = 13.": "例如，如果你掷出4和6，那么你可以再掷一次，然后得到3。最终的EDR是4 + 6 + 3 = 13。",
    "Gold is used to purchase items in the shop.": "金币是用来在商店购买物品的。",
    "Health = ([10 * endurance] + [2 * strength])^0.7 + items": "生命值=([10 *耐力]+[2 *力量])^0.7  + 物品",
    "Hover over your character in the account page and you will see circles; click on those circles and select the gear that you want to put on.": "将鼠标悬停在帐户页面中的角色上，您将看到圆圈；点击那些圆圈，选择你想要穿上的装备。",
    "How do I equip gear?": "我如何装备装备？",
    "In order for a hit to succeed, this value must be higher than the opposing parry value.": "为了使攻击成功，这个值必须高于对方的值。",
    "In order for an offensive spell to succeed, this value must be higher than the opposing magic resistance value.": "为了使攻击法术成功，这个值必须高于对方的魔法抗性值。",
    "In order to block a hit, this value must be equal or greater than the opposing hit ability value.": "为了阻挡一个命中，这个值必须等于或大于对方的命中能力值。",
    "In order to block an incoming offensive spell, this value must be equal or greater than the opposing magic penetration value.": "为了阻挡来袭的攻击法术，这个值必须等于或大于对方的魔法穿透值。",
    "It provides access to higher level quests which reward more stats, XP, and items.": "它提供了访问更高级别任务的途径，从而奖励更多属性、经验值和道具。",
    "Join Our Community": "加入我们的社区",
    "Magic Penetration = 9 + ([1 * intelligence] + [0.25 * strength])^0.5 + items + EDR": "魔法穿透= 9 +([1 *智力]+[0.25 *力量])^0.5  + 物品  + EDR",
    "Magic resistance = 9 + ([0.8 * intelligence] + [0.25*endurance])^0.5 + items + EDR": "魔抗= 9 +([0.8 *智力]+[0.25*耐力])^0.5  + 物品  + EDR",
    "Mana Regeneration = [2 * intelligence] + items": "法力回复=[2 *智力] + 物品",
    "Max Mana = [10 * intelligence] + [2 * endurance] + items": "最大法力=[10 *智力]+[2 *耐力] + 物品",
    "Melee hit ability = 9 + ([1.25 * strength] + [0.5 * bravery])^0.5 + items + EDR": "近战命中= 9 +([1.25 *力量]+[0.5 *勇气])^0.5 + 物品  + EDR",
    "Melee parry = 8 + ([0.75 * endurance] + [0.25 * strength])0.5 + items + EDR": "近战招架= 8 +([0.75 *耐力]+[0.25 *力量])0.5 + 物品  + EDR",
    "Passive regeneration amount for your mana every combat round.": "每个战斗回合被动回复的法力值。",
    "Quests will provide the player with more XP, stats, and items. Doing these quests in real life will also help to improve your daily habits": "任务将为玩家提供更多的经验值、属性和物品。在现实生活中做这些任务也会有助于改善你的日常习惯",
    "Search for answers or browse through common topics.": "搜索答案或浏览常见主题。",
    "Spell effect multiplier = ([0.5 * intelligence] + [0.15 * strength])^0.33": "法术效果乘数=([0.5 *智力]+[0.15 *力量])^0.33",
    "The EDR is the sum of rolling of 2 six-sided dice. It 'explodes' because if any dice lands on 6, another six-sided dice is rolled and added back to the sum.": "EDR是掷两个六面骰子的总和。它会“爆炸”，因为如果有一个骰子落在6上，另一个六面骰子就会被滚动并加回总和。",
    "The following values are subject to being added by an exploding dice roll during a combat action: Damage, Armor, Melee Hit Ability, Melee Parry, Magic Penetration, Magic Resistance.": "以下数值将在战斗行动中由爆炸掷骰增加：伤害、护甲、近战命中技能、近战招架、魔法穿透、魔法抵抗。",
    "The maximum mana you can have during combat. Mana regen won’t allow your current mana to go higher than this.": "你在战斗中可以拥有的最大法力值。法力回复将不允许你的当前法力值高于此值。",
    "What do I get by entering the tower?": "进入塔能得到什么？",
    "What do the stats mean?": "这些数据意味着什么？",
    "What does increasing my level do?": "提高我的等级有什么作用？",
    "What is Armor?": "护甲是什么？",
    "What is Damage?": "什么是伤害？",
    "What is Explosive Dice Roll (EDR)?": "什么是爆炸掷骰（EDR）？",
    "What is gold for?": "金币有什么用？",
    "What is Health?": "什么是生命值？",
    "What is Magic Penetration?": "什么是魔法穿透？",
    "What is Magic Resistance?": "什么是魔法抵抗？",
    "What is Mana Regeneration?": "什么是法力回复？",
    "What is Max Mana?": "什么是最大法力值？",
    "What is Melee Hit Ability?": "什么是近战攻击技能？",
    "What is Melee Parry?": "什么是近战招架？",
    "What is the Spell Effect Multiplier": "什么是法术效果乘数",
    "Why should I do the quests?": "我为什么要做任务？",
    "Your hitpoints. If this reaches 0, you die.": "你的生命值。如果这个等于0，你就死了。",
    "Don't have an account?": "还没有账号？",
    "Log In": "登录",
    "Password": "密码",
    "Register": "注册",
    "Username": "用户名",
    "Back": "返回",
    "Enter Your Email (optional)": "请输入电子邮箱（可选）",
    "Enter Your Username": "请输入你的用户名",
    "Enter Your Password": "请输入你的密码",
    "Next": "下一步",
    "Prefer not to say": "宁愿不说",
    "Select your age range": "请选择你的年龄范围",
    "Under 18": "未满18岁",
    "Select Your Age Range (Optional: So that we can tailor a better experience for you)": "选择您的年龄范围（可选：以便我们为您量身定制更好的体验）",
    "Username is required": "用户名不能为空",
    "Make a Vow": "许下誓约",
    "My Vows": "我的誓约",
    "No vows found.": "暂无誓约。",
    "Vows give GREAT rewards, but DIRE consequences if not finished on time.": "誓约会带来巨大的回报，但如果没有按时完成，后果会很严重。",
    "Add Vow": "添加誓约",
    "Cancel": "取消",
    "Cancel": "选择属性",
    "Commit a New Vow": "提交一个新誓约",
    "Completion Date": "完成日期",
    "Description": "描述",
    "Difficulty": "难度",
    "Vow Name": "誓约名称",
    "Choose Stats": "选择属性",
    "damage": "伤害",
    "hitAbility": "命中",
    "parry": "闪避",
    "Deadline:": "截止日期:",
    "Consequences:": "结果:",
    "Finish Vow": "现在完成",
    "COMPLETED": "已完成",
    "Current Level": "当前等级",
    "Current Stats": "当前属性",
    "Cooldown:": "冷却时间:",
    "HealthAdd": "生命值增加",
    "magicPenetration": "魔法穿透",
    "magicResistance": "魔抗",
    "mana": "法力",
    "Mana Cost:": "法力成本:",
    "Remove": "移除",
    "Selected Spell:": "已选择法术:",
    "Type:": "类型:",
    "Stat:": "属性:",
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
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "": "",
    "Veteran Goblin": "哥布林老兵",
    "Goblin Alchemist": "哥布林炼金术师",
    "Goblin Assassin": "哥布林杀手",
    "Goblin Dancer": "哥布林舞者",
    "head": "头部",
    "legs": "腿部",
    "Intelligence:": "智力:",
    "Endurance:": "耐力:",
    "Rewards:": "奖励:",
    "Bravery:": "勇气:",
    "Strength:": "力量:",
    "MR:": "法力回复:",
    "MP:": "法力值:",
    "MR:": "魔抗:",
    "PP:": "物理闪避:",
    "MHA:": "近战命中:",
    "ARM:": "护甲:",
    "The": "",
    "": "",
    "": "",
    "Breeches": "制马裤",
    "Ribcage": "制胸甲",
    "Sandals": "制凉鞋",
    "-Horned Helmet": "角头盔",
    "Axe": "斧子",
    "Bascinet": "烤炉",
    "Chausses": "马裤",
    "Cuirass": "胸甲",
    "Katana": "武士刀",
    "Sabatons": "萨巴顿",
    "Scythe": "镰刀",
    "Slayer(Berserk)": "杀手（狂暴）",
    "Sword": "剑",
    "Shield": "盾牌",
    "Blades": "剑刃",
    "Helmet": "头盔",
    "Dagger": "匕首",
    "Chestplate": "板甲",
    "Boots": "靴子",
    "Clogs": "木屐",
    "Fedora": "软呢帽",
    "Gambeson": "软铠甲",
    "Hood": "风帽",
    "Pants": "裤子",
    "Shirt": "衬衫",
    "Shoes": "鞋子",
    "Skirt": "裙子",

    // 图标代码，不能汉化
    "Jacorb's Games": "Jacorb's Games",
    "- VS -": "- VS -",
    "": "",
    "": "",
    "": "",
    "": "",
    ":": ":",
    "/": "/",
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
    'II': 'I',
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
    'Jan': '1月',
    'Feb': '2月',
    'Mar': '3月',
    'Apr': '4月',
    'May': '5月',
    'Jun': '6月',
    'Jul': '7月',
    'Aug': '8月',
    'Sep': '9月',
    'Oct': '10月',
    'Nov': '11月',
    'Dec': '12月',
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
    "damage to ": "伤害到 ",
    "New enemy appeared: ": "新的敌人出现了: ",
    "Welcome to ": "欢迎来到 ",
    "Iron ": "铁",
    "Dragon ": "龙",
    "Crystal ": "水晶",
    "Bone ": "骨",
    "Wooden ": "木制",
    "Steel ": "钢",
    "Crimson ": "绯红",
    "Leather ": "皮革",
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
    ' I': ' I',
    ' II': ' II',
    ' III': ' III',
    ' IV': ' IV',
    ' V': ' V',
    ' VI': ' VI',
    ' VII': ' VII',
    ' VIII': ' VIII',
    ' X': ' X',
    ' XI': ' XI',
    ' XII': ' XII',
    ' XIII': ' XIII',
    ' XIV': ' XIV',
    ' XV': ' XV',
    ' XVI': ' XVI',
    "/sec)": "/秒)",
    "% bonus": "% 奖励",
    " day(s)": " 天",
    "!": "!",
    " rolled Physical Parry of": " 掷出了 物理闪避 ",
    "rolled Physical Parry of": "掷出了 物理闪避 ",
    " rolled Melee Hit Ability of": " 掷出了 近战命中能力 ",
    " rolled Melee Hit Ability of -": " 掷出了 近战命中能力 -",
    "rolled Melee Hit Ability of": "掷出了 近战命中能力 ",
    " has been defeated": " 已经被击败",
    " dealt": " 造成",
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
    /^([\d\.]+)s$/,
    /^([\d\.]+)h$/,
    /^([\d\.]+)m$/,
    /^([\d\.]+)m ([\d\.]+)s$/,
    /^([\d\.]+)h ([\d\.]+)m ([\d\.]+)s$/,
    /^([\d\.]+)d ([\d\.]+)h ([\d\.]+)m ([\d\.]+)s$/,
    /^([\d\.]+)y ([\d\.]+)d ([\d\.]+)h ([\d\.]+)m ([\d\.]+)s$/,
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
    /^([\uD800-\uDBFF][\uDC00-\uDFFF])|([\u2600-\u27BF])|([\u2300-\u23FF])|([\u2B50-\u2B55])|([\u203C-\u3299])|[\u21A9\u21AA\u25B6\u25C0\u2B06\u2B07\u2B05\u2B95\u2B99\u2B9A]+$/,
    // /^([\uD800-\uDBFF][\uDC00-\uDFFF])|([\u2600-\u27BF])|([\u2300-\u23FF])|([\u2B50-\u2B55])|([\u203C-\u3299])+$/,
    // /^[\uD800-\uFFFF]+$/,
    /^[\u4E00-\u9FA5]+$/
];
var cnExcludePostfix = []

//正则替换，带数字的固定格式句子
//纯数字：(\d+)
//逗号：([\d\.,]+)
//小数点：([\d\.]+)
//原样输出的字段：(.+)
var cnRegReplace = new Map([
    [/^([\d\.]+) hours ([\d\.]+) minutes ([\d\.]+) seconds$/, '$1 小时 $2 分钟 $3 秒'],
    [/^You are gaining (.+) elves per second$/, '你每秒获得 $1 精灵'],
    [/^You have (.+) points$/, '你有 $1 点数'],
    [/^Next at (.+) points$/, '下一个在 $1 点数'],
    [/^Jan ([\d\.,]+) ([\d\.,]+), ([\d\.,]+):([\d\.,]+)$/, '$2 年 1 月 $1, $3:$4'],
    [/^Feb ([\d\.,]+) ([\d\.,]+), ([\d\.,]+):([\d\.,]+)$/, '$2 年 2 月 $1, $3:$4'],
    [/^Mar ([\d\.,]+) ([\d\.,]+), ([\d\.,]+):([\d\.,]+)$/, '$2 年 3 月 $1, $3:$4'],
    [/^Apr ([\d\.,]+) ([\d\.,]+), ([\d\.,]+):([\d\.,]+)$/, '$2 年 4 月 $1, $3:$4'],
    [/^May ([\d\.,]+) ([\d\.,]+), ([\d\.,]+):([\d\.,]+)$/, '$2 年 5 月 $1, $3:$4'],
    [/^Jun ([\d\.,]+) ([\d\.,]+), ([\d\.,]+):([\d\.,]+)$/, '$2 年 6 月 $1, $3:$4'],
    [/^Jul ([\d\.,]+) ([\d\.,]+), ([\d\.,]+):([\d\.,]+)$/, '$2 年 7 月 $1, $3:$4'],
    [/^Aug ([\d\.,]+) ([\d\.,]+), ([\d\.,]+):([\d\.,]+)$/, '$2 年 8 月 $1, $3:$4'],
    [/^Sep ([\d\.,]+) ([\d\.,]+), ([\d\.,]+):([\d\.,]+)$/, '$2 年 9 月 $1, $3:$4'],
    [/^Oct ([\d\.,]+) ([\d\.,]+), ([\d\.,]+):([\d\.,]+)$/, '$2 年 10 月 $1, $3:$4'],
    [/^Nov ([\d\.,]+) ([\d\.,]+), ([\d\.,]+):([\d\.,]+)$/, '$2 年 11 月 $1, $3:$4'],
    [/^Dec ([\d\.,]+) ([\d\.,]+), ([\d\.,]+):([\d\.,]+)$/, '$2 年 12 月 $1, $3:$4'],
	[/^([\d\.]+)\/sec$/, '$1\/秒'],
	[/^([\d\.,]+)\/sec$/, '$1\/秒'],
	[/^([\d\.,]+) OOMs\/sec$/, '$1 OOMs\/秒'],
	[/^([\d\.]+) OOMs\/sec$/, '$1 OOMs\/秒'],
	[/^([\d\.]+)e([\d\.,]+)\/sec$/, '$1e$2\/秒'],
    [/^requires ([\d\.]+) more research points$/, '需要$1个研究点'],
    [/^([\d\.]+)e([\d\.,]+) points$/, '$1e$2 点数'],
    [/^([\d\.]+) elves$/, '$1 精灵'],
    [/^([\d\.]+)d ([\d\.]+)h ([\d\.]+)m$/, '$1天 $2小时 $3分'],
    [/^([\d\.]+)e([\d\.,]+) elves$/, '$1e$2 精灵'],
    [/^([\d\.,]+) elves$/, '$1 精灵'],
    [/^\+([\d\.,]+) to Player$/, '\+$1 到玩家'],
    [/^\-([\d\.,]+) to Enemies$/, '\-$1 到敌人'],
    [/^Level ([\d\.,]+)$/, '等级 $1'],
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
let clicks = null;
let checks = null;
// 自动战斗
function autoFight(){
    if($('.fixed.inset-0.bg-black.bg-opacity-50.z-50 .bg-red-500.text-white').length > 0){
        $('.flex.gap-3.mt-4 .w-full.bg-red-500').trigger('click');
   }
}

// 检测链接
function checkUrl(){
    if(location.href.indexOf('/game') < 0){
        $('#btnStart').hide();
        $('#btnStart').removeClass('open');
        $('#btnStart').text('开始战斗')
        clearInterval(clicks);
    }else{
        $('#btnStart').show();
        if(!$('#btnStart').hasClass('open')){
            $('#btnStart').trigger('click');
        }
    }
}
// 在页面上添加 HTML 结构
function createHTML() {
    var btnStart = '<button id="btnStart" class="px-4 py-2 bg-indigo-600 rounded-md mb-4" style="position: absolute;right: 20px;top: 90px;color: #fff;display: none;">开启自动战斗</button>'
    $('body').append(btnStart);
}


! function() {
    console.log("加载汉化模块");
    // 创建按钮
    // createHTML();
    // 检测链接，显示战斗按钮
    // checks = setInterval(checkUrl,3000);
    // 自动战斗
    $('#btnStart').click(function(){
        if( $('#btnStart').hasClass('open')){
            clearInterval(clicks);
            clearInterval(checks);
            $('#btnStart').removeClass('open');
            $('#btnStart').text('开始战斗')
        }else{
            clicks=setInterval(autoFight,5000);
            checks = setInterval(checkUrl,3000);
            $('#btnStart').addClass('open');
            $('#btnStart').text('停止战斗')
        }
    })
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
                        }
                    }
                }
            }
        }
        transTaskMgr.doTask();
        observer.observe(targetNode, observer_config);
        //window.afterTransTime = performance.now();
        //console.log("捕获到页面变化并执行汉化，耗时" + (afterTransTime - beforeTransTime) + "毫秒");
    });
    observer.observe(targetNode, observer_config);
    window.cnItems = cnItems
}();