// ==UserScript==
// @name         Mini Realms 简中汉化脚本
// @namespace    https://www.g8hh.com.cn/
// @version      0.0.22
// @description  网页游戏 Mini Realms (https://minirealms.com/) 的简体中文汉化脚本。Simplified Chinese i18n script for web game Mini Realms.
// @author       好阳光的小锅巴 & 麦子
// @copyright    锅巴汉化
// @contributionUR    https://gityx.com/donate/intro.html
// @icon        https://minirealms.com/favicon.png
// @license      MIT
// @include      *https://minirealms.com/*
// @require      https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.6.0/jquery.min.js
// @grant        none
// @website      https://www.gityx.com/
// @downloadURL https://update.greasyfork.org/scripts/528720/Mini%20Realms%20%E7%AE%80%E4%B8%AD%E6%B1%89%E5%8C%96%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/528720/Mini%20Realms%20%E7%AE%80%E4%B8%AD%E6%B1%89%E5%8C%96%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
/**
 * ---------------------------
 * Time: 2025/03/03 22:19
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
    "FAQs": "常见问题",
    "Contact Us": "联系我们",
    "Home": "首页",
    "Privacy Policy": "隐私政策",
    "Skip": "跳过",
    "Start Now": "马上开始",
    "Terms and Cond.": "条款和条件",
    "Join Us": "加入我们",
    "Join Our Discord\n": "加入我们的 Discord\n",
    "For each day you rule your realm, you will be rewarded, and only the most consistent rulers will see the treasures their realm has to offer.": "你统治你的王国的每一天，你都会得到奖励，只有最坚定的统治者才能看到他们的王国所提供的宝藏。",
    "In the abyss, you may stake your claim, build up your realm, and demolish those who would oppose you. Each realm is hungry for power, for resources, for dominion over all.": "在深渊中，你可以立下你的地盘，建立你的王国，摧毁那些反对你的人。每个王国都渴望权力、资源和对所有国家的统治。",
    "In this place, you earn your name by the structures you build on your land and the forces you maintain within. The more you build, the more others will notice.": "在这个地方，你靠在你的土地上建造的建筑和你在里面维持的力量来赢得你的名字。你建造的越多，别人就会注意到越多。",
    "Make sure to take heed of the realms around you. They can either bring about your downfall or carry your name through the ages.": "一定要注意你周围的王国。他们要么让你垮台，要么让你名垂千古。",
    "Welcome to a land of opportunity, brimming with power and possibility.": "欢迎来到这片充满机会、充满力量和可能性的土地。",
    "click here to recover your password": "点击这里恢复你的密码",
    "Login": "登录",
    "Login to your account": "登录你的账号",
    "Or": "或",
    "Password": "密码",
    "Registered Name": "注册的用户名",
    "Farms": "农场",
    "Getting Started": "开始吧",
    "Leaderboard": "排行榜",
    "Mini Realms": "迷你王国",
    "Buildings": "建筑",
    "Every realm is represented by a 21 x 21 grid and a unique number between 1 and 999,999. Each\n\t\t\t\tkingdom starts off with a castle at the center of the realm which cannot be destroyed and\n\t\t\t\teach square holds a value. As the ruler of the realm, you can choose to expand wide\n\t\t\t\tspreading value across the land or keep it small while continuing to increase the value of\n\t\t\t\tonly a handful of lands. Only one buildings can be built on each land to give additional\n\t\t\t\tbonuses and effects.": "每个王国都由21 x 21的网格和1到999,999之间的唯一数字表示。每个\n\t\t\t\t \t\t\t\t \t\t\t\t \t\t\t\t \t\t\t方格都有一个值。作为王国的统治者，你可以选择在土地上广泛地扩展价值，也可以选择在少数土地上继续增加价值。每块土地上只能建造一座建筑物，以获得额外的\n\t\t\t\t奖励和效果。",
    "You can visit other realms by putting their unique number in the URL. When visiting other\n\t\t\t\trealms, you will only be able to see their land without knowing each square's value or if\n\t\t\t\tany building is sitting on that land. Destroying their land will reward you with additional\n\t\t\t\tresources.": "您可以通过在URL中输入它们的唯一编号来访问其他王国。当你拜访其他的土地时，你只能看到他们的土地，而不知道每一块土地的价值，也不知道那块土地上是否有建筑物。摧毁他们的土地会奖励你额外的\n\t\t\t\资源。",
    "\t\tCommunications": "\t\t通信",
    "\t\tHeadquarters": "总部",
    "\t\tLeaderboard": "\t\t排行榜",
    "\t\tLogout": "\t\t登出",
    "\t\tProfile": "\t\t个人资料",
    "\t\tShop": "\t\t购物",
    "\t\tThe Council": "\t\t议会",
    "\t\tYour Realms": "\t\t你的王国",
    "\tThe Emptiness": "\t\t虚空",
    "\r\n\r\n\t\t\t\t\tYour Realms": "\r\n\r\n\t\t\t\t\t \t\t\t您的王国",
    "- allows more resources to be stored before being claimed": "-允许在领取前存储更多资源",
    "- Boost the amount of resources being generated": "-提高正在生成的资源数量",
    "- Defend the land that the traps are placed on. Each trap can survive 2 attacks\n\t\t\t\t\tbefore being destroyed": "-保卫放置陷阱的土地。每个陷阱在被摧毁前可以承受2次攻击",
    "- Each barrack creates soilders which will give their lives to protect the realm\n\t\t\t\t\tno matter where the attack is": "-每个兵营都会创造士兵，无论攻击在哪里，他们都会献出生命来保护王国",
    "and seeing what\n\t\t\t\tthey suggest and save your verification code found under your\n": "看看他们建议的是什么，然后把你的验证码保存在下面你的",
    "Barrack": "兵营",
    "Buildings can be purchased from the shop for resources and provide different effects when\n\t\t\t\tused.": "建筑可以从商店购买资源，并提供不同的效果，当\n\t\t\t\t被使用。",
    "Communication": "沟通",
    "Consider visiting": "考虑访问",
    "Council": "委员会",
    "Emptiness": "虚空",
    "HQ": "总部",
    "New to the game?": "新手？",
    "Profile": "个人资料",
    "profile!": "个人资料！",
    "Realm": "王国",
    "Realms": "王国",
    "Shop": "商店",
    "the councilers": "议员们",
    "Traps": "陷阱",
    "Warehouse": "仓库",
    "Communications": "通信",
    "Headquarters": "总部",
    "Logout": "登出",
    "The Council": "议会",
    "Your Realms": "你的王国",
    "Claimed!": "已收集！",
    "Day": "天数",
    "resource": "资源",
    "resources": "资源",
    "The head counciler appreciates your visit and offers you a gift": "议会会长感谢您的来访，并送给您一份礼物",
    "Counciler's Blessing": "议员的祝福",
    "'s Rank:": " 的排名",
    "A new kingdom has formed!": "一个新的王国诞生了！",
    "Barracks": "兵营",
    "Claim": "收集",
    "Crops": "作物",
    "History:": "历史:",
    "Inventory:": "库存:",
    "null": "空",
    "Please wait up to 24h": "请等待24小时",
    "Resource generation rate:": "资源生成率：",
    "resources every 10 min": "资源每10分钟",
    "Resources Stored:": "存储的资源: ",
    "Stamina:": "耐力::",
    "untitled page": "未命名页面",
    "Warehouses": "仓库",
    "Close": "关闭",
    "Develop Land": "开发土地",
    "Resource": "资源",
    "Resource Generation Bonuses": "资源生成奖励",
    "Training Ground": "训练场",
    "Training Grounds": "训练场",
    "Criteria": "标准",
    "Army Consumption": "军队消耗",
    "Bonus Amount": "奖励数量",
    "'s Value": "的价值",
    "'s Rank:": "的排名：",
    "Sum of All Resource Bonuses": "所有资源加成的总和",
    "(Sum of All Resource Bonuses)": "（所有资源加成的总和）",
    "Library": "图书馆",
    "Most value in a region": "在一个地区最大的价值",
    "Purchased resource bonus": "购买的资源加成",
    "Purchased resources": "购买的资源",
    "Resource Generation Rate": "资源生成率",
    "Second most value in a region": "在一个地区的第二价值",
    "Third most value in a region": "在一个地区的第三价值",
    "yellow": "黄色",
    "Updated twice daily || Active bonueses in": "每日更新两次 || 活跃加成",
    "shop": "商店",
    "to unlock": "以解锁",
    "Purchase the training ground in the": "购买训练场在",
    "Coming Soon...": "即将推出...",
    "Coming soon...": "即将推出...",
    "Change Kingdom Name": "更改王国名称",
    "Change Player Name": "更改玩家名称",
    "Forgien Lands Destroyed": "已摧毁的土地",
    "Inventory": "库存",
    "Lifetime Realm Value": "生命周期王国价值",
    "Referral Count:": "转介人数：",
    "Referrals count after they hit a lifetime realm value over 25": "在他们达到25以上的终身王国价值后，才计算为邀请人数",
    "Resources:": "资源:",
    "Show Verification Code": "显示验证码",
    "Stats": "统计",
    "Your Referral Code is": "您的邀请码是",
    "Regions & Realms": "区域&王国",
    "Value": "价值",
    "Player": "玩家",
    "Purchase the communication system in the": "购买通信系统在",
    "Minor adjustment on the 5th quest, Only attacking is needed now, no need to destroy!": "对第5个任务进行了小调整，现在只需要攻击，不需要破坏！",
    "Cross Regional Communications": "跨区域通信",
    "System Messages": "系统消息",
    "Racism, spam, or any abuse of the chat function will result in a ban": "种族歧视，垃圾邮件，或任何滥用聊天功能将导致封号",
    "Communication Systems": "通信系统",
    "For longer times away...": "在更长的时间里…",
    "Gold": "黄金",
    "gold": "黄金",
    "Make your next move now": "现在开始你的下一步行动",
    "Protect the area it is placed on. These high quality traps can survive 2 attacks": "保护它所在的区域。这些高质量的陷阱可以抵抗两次攻击",
    "Research Library": "研究图书馆",
    "Resources": "资源",
    "You currently have": "你当前有",
    "Train and house soldiers to protect the realm": "训练和安置士兵以保护王国",
    "The emptiness is the space between realms.": "虚空 是指两个王国之间的空间。",
    "You can venture out into the unknown and you'll never know where you'll end up or what you'll\r\n\t\t\tbe doing. You might end up at another realm or be forced to face off against the creatures\r\n\t\t\tthat inhabit the emptiness. These creatures can be studied both dead and alive. Just be sure\r\n\t\t\tyour forces are trained and ready for combat as they might not be easy to take down.": "你可以冒险进入未知的世界，但你永远不知道你会在哪里结束，也不知道你会在做什么。你可能会在另一个王国结束或被迫面对生物\r\n\t\t\居住在虚空。这些生物无论是死的还是活的都可以被研究。只是要确保你的部队训练有素，做好了战斗准备，因为他们可能不容易被打败。",
    "You can venture out into the unknown and you'll never know where you'll end up or what you'll\n\t\t\tbe doing. You might end up at another realm or be forced to face off against the creatures\n\t\t\tthat inhabit the emptiness. These creatures can be studied both dead and alive. Just be sure\n\t\t\tyour forces are trained and ready for combat as they might not be easy to take down.": "You can venture out into the unknown and you'll never know where you'll end up or what you'll\n\t\t\tbe doing. You might end up at another realm or be forced to face off against the creatures\n\t\t\tthat inhabit the emptiness. These creatures can be studied both dead and alive. Just be sure\n\t\t\tyour forces are trained and ready for combat as they might not be easy to take down.",
    "Reward:": "奖励:",
    "Status": "状态",
    "You don't have enough resources!": "你没有足够的资源！",
    "Your councilers will periodicly give you quests to help you advance.": "你的议员将定期给你任务，以帮助你前进。",
    "Quest": "任务",
    "Speak to the head counciler": "和首席议员谈谈",
    "Recover 6 stamina, gain a warehouse": "恢复6点体力，获得一个仓库",
    "Counciler's Advice": "议员的建议",
    "Place a barrack on your land": "在你的土地上建立一个兵营",
    "Place a warehouse on your land": "在你的土地上建立一个仓库",
    "Plant crops on your land": "在你的土地上种植作物",
    "...flattening the land...": "...夷平土地...",
    "Filling in the ocean...": "填满海洋...",
    "Claim Reward": "收集奖励",
    "Land gives you a place to place down items but more importantly, they generate resources which you can use to purchase items from the shop in the Central District.": "土地给你一个放置物品的地方，但更重要的是，它们可以产生资源，你可以用这些资源从中心地区的商店购买物品。",
    "Quest reward claimed!": "任务奖励已收集！",
    "Change": "修改",
    "What would you like to change your name to?": "你想把你的名字改成什么？",
    "stamina )": "耐力 )",
    "Gold:": "黄金:",
    "Explore": "探索",
    "It is recommended to have at least": "建议在探索前至少要有",
    "units before exploring": "单位",
    "You can venture out into the unknown and you'll never know where you'll end up or what you'll\r\n\t\t\tbe doing. You might end up at another realm or be forced to face off against the creatures\r\n\t\t\tthat inhabit the emptiness. These creatures can be studied both dead and alive. Just be sure\r\n\t\t\tyour forces are trained and ready for combat as the creatures might not be easy to take down.": "你可以冒险进入未知的世界，但你永远不知道你会在哪里结束，也不知道你会在做什么。你可能会在另一个领域结束或被迫面对生物\r\n\t\t\居住在虚空。这些生物无论是死的还是活的都可以被研究。只是要确保你的部队训练有素，随时准备战斗，因为这些生物可能不容易被拿下。",
    "You can venture out into the unknown and you'll never know where you'll end up or what you'll\n\t\t\tbe doing. You might end up at another realm or be forced to face off against the creatures\n\t\t\tthat inhabit the emptiness. These creatures can be studied both dead and alive. Just be sure\n\t\t\tyour forces are trained and ready for combat as the creatures might not be easy to take down.": "你可以冒险进入未知的领域，但你永远不知道你会在哪里结束，也不知道你会在做什么。你可能会在另一个领域结束，或者被迫面对居住在虚空中的生物。这些生物无论是死的还是活的都可以被研究。只是要确保你的部队训练有素，随时准备战斗，因为这些生物可能不容易被拿下。",
    "Attack Your Enemies": "攻击你的敌人",
    "Build Your Realm": "建立你的王国",
    "Chronicles": "编年史",
    "Claim your Realm": "占领你的领地",
    "Continue your Conquest": "继续你的征服",
    "Create Alliances": "创建联盟",
    "Each realm\n\t\t\t\tis part of a greater region. Team up to coordinate attacks, share information and conquer the\n\t\t\t\tabyss": "每个领域\n\t\t\t\是一个更大区域的一部分。组队协调攻击，共享信息并征服\n\t\t\t\t深渊",
    "Expand your\n\t\t\t\tland, collect resources and place upgrades on your path to conquest": "扩展你的\n\t\t\t\t \领土，收集资源并在征服的道路上升级",
    "Find other\n\t\t\t\trealms and destroy their lands in a battleship like system": "找到其他的\n\t\t\t\星球，然后在类似战舰的系统中摧毁他们的土地",
    "News & Updates": "新闻与更新",
    "Agree to": "同意",
    "Register": "注册",
    "Register for an account": "注册一个账户",
    "sign in": "登录",
    "Terms and Conditions": "条款与条件",
    "if you already have an account.": "如果你已经有一个帐户。",
    "Finding a suitable realm now ...": "现在正在寻找一个合适的区域……",
    "Name must be at least 3 characters": "用户名至少为3个字符",
    "Password must be at least 6 characters": "密码至少为6个字符",
    "You must accept the terms and conditions": "你必须接受条款和条件",
    "A name must be at least 3 characters": "用户名长度至少为3个字符",
    "A password must be at least 6 characters": "密码长度至少为6个字符",
    "- Allows more resources to be stored before being claimed": "- 允许在领取前存储更多资源",
    "- Defend the land that the traps are placed on. Each trap can survive 2 attacks\n\t\t\t\t\tbefore being destroyed and they will be the first to go before your soldiers": "- 保卫放置陷阱的土地。每个陷阱可以在被摧毁前经受两次攻击，并且它们会第一个在你的士兵之前被摧毁",
    "- Each barrack creates soldiers which will give their lives to protect the realm\n\t\t\t\t\tno matter where the attack is": "- 每个兵营都会创造士兵，无论攻击在哪里，他们都会献出自己的生命来保护王国",
    "to see what\n\t\t\t\tthey suggest and save your verification code found under your\n": "查看他们的建议，并保存您的\n\t\t\t的验证码发现于",
    "Attack Land": "攻击土地",
    "Select a square to destroy it": "选择一个方块以摧毁它",
    "Welcome to realm": "欢迎来到王国",
    "You don't have enough stamina": "你没有足够的耐力",
    "... organizing the space ...": "... 组织空间 ...",
    "Construct a warehouse": "建造一个仓库",
    "Construction in Progress...": "建造中...",
    "You recieved enough material to start 1 farm!": "您获得了足够的材料，可以创建一个农场了！",
    "... planting the seeds ...": "... 播种 ...",
    "Crop": "作物",
    "Plant crops": "种植作物",
    "Plowing the land...": "耕地...",
    "Resources generated from your lands are stored in your realm which has a max capacity. Warehouses are used to expand this capacity and now that you have more capacity, why not increase resource production with some crops.": "从你的土地上产生的资源存储在你的王国有一个最大的容量。仓库是用来扩大这种能力的，现在你有更多的能力，为什么不增加一些作物的资源生产。",
    "Crops provide an instant boost in the amount of resource generated.": "农作物能够立即提高资源的生成量。",
    "Train some soldiers": "训练一些士兵",
    "defending the realm": "保卫王国",
    "soldiers": "士兵",
    "Placing down a barrack will train soldiers to defend your realm. Defending from what you might ask? Visit another realm from the Leaderboard and see what you can do.": "建立兵营可以训练士兵保卫你的王国。为你可能会问的问题辩护？访问排行榜上的另一个王国，看看你能做些什么。",
    "... pillaging the land ...": "... 掠夺土地 ...",
    "Crossing the seas...": "穿越海洋...",
    "Your attack has failed. The realm has been defended!": "你的进攻失败了。王国得到了保护！",
    "More AP in": "获得更多 AP 还需要",
    "The down side of attacking another player is that now they know that you exist and where to find you. When you successfully destroy a land, you'll get rewarded with resources. Go to your profile page and lets convert all those resources into gold.": "攻击另一名玩家的不利之处在于，他们现在知道你的存在，也知道你在哪里。当你成功摧毁一片土地时，你将获得资源奖励。去你的个人资料页面，让所有这些资源转换成黄金。",
    "Covert": "转换",
    "Congratulations! You're now 1 gold richer. Wait till you see what you can do with gold...": "恭喜你!你现在多了1黄金。等着看你能用黄金做什么吧...",
    "Level up!": "升级了!",
    "Army Composition": "军队组成",
    "Army Stats": "军队统计",
    "Att": "攻击",
    "Def": "防御",
    "Defence:": "防御:",
    "Guard": "守卫",
    "Hero": "英雄",
    "Level up!": "升级！",
    "Resource Cost:": "资源成本:",
    "Retire unit": "退休单位",
    "Sniper": "狙击手",
    "Strength:": "力量:",
    "Tank": "坦克",
    "Train unit ( 1 gold )": "训练单位 (1黄金)",
    "Units": "单位",
    "Unit": "单位",
    "Untrainable": "不可训练",
    "You can train an army that will die for you fighting the creatures in the emptiness.": "你可以训练一支愿意为你牺牲的军队，在虚空中与生物战斗。",
    "Need at least 1 gold to train units": "至少需要 1 黄金来训练单位",
    "They seem like a fine young prospect...": "他们看起来很有前途...",
    "A guard was trained!": "训练出了一名守卫！",
    "A sniper was trained!": "训练出了一名狙击手！",
    "A tank was trained!": "训练出了一名坦克！",
    "Place your new warehouse to store more resources!": "放置您的新仓库以存储更多资源！",
    "Choose a unit type to retire one unit from:": "选择一个单位的类型来退休一个单位：",
    "Have you been working out?": "你一直在锻炼吗？",
    "Big spender here": "这里的消费大户",
    "Make your next moves now": "现在就开始下一步行动",
    "You want to do something": "你想做点什么",
    "Convert": "转换",
    "send": "发送",
    "Go say Hi!": "去打个招呼吧！",
    "Message": "消息",
    "1 barrack is ready to be contructed!": "1个兵营已准备好建造！",
    "You have successfully purchased a trap!": "你已经成功购买了一个陷阱！",
    "Place a trap": "放置陷阱",
    "Trap": "陷阱",
    "Study away!": "继续学习！",
    "All gold related items have been bought!": "所有与黄金相关的物品已经被购买！",
    "You feel energized!": "你感到精力充沛！",
    "... training new soliders ...": "... 训练新的士兵 ...",
    "Recruitment in progress..": "招募中..",
    "You don't have enough stamina space!": "你没有足够的耐力空间！",
    "The recruit failed training.": "新兵训练不及格。",
    "... arming the traps ...": "... 武装陷阱 ...",
    "Covering holes...": "掩盖漏洞...",
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

    // 图标代码，不能汉化
    "Jacorb's Games": "Jacorb's Games",
    "© 2025 Mini Realms. All rights reserved.": "© 2025 Mini Realms. All rights reserved.",
    "": "",
    "": "",
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
    "\t\t": "\t\t",
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
    "What would you like to do on ": "你想做什么在位置 ",
    "Referral Count: ": "邀请数量: ",
    "Grow valuable crops and increase the value of your realm by ": "种植有价值的作物，使你的领土价值增加 ",
    "Increase max stamina by ": "最大耐力上限增加 ",
    "Increase the amount of resources your realm can store by ": "增加你的王国可以存储的资源数量 ",
    "More stamina in": "恢复更多耐力还需",
    "A warehouse has been built on ": "一座仓库已建成于 ",
    "Crops have been built on ": "作物已经被种植于 ",
    "Welcome to realm ": "欢迎来到王国 ",
    "Develop Land x": "开发土地 x",
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
    "'s realm": "的王国",
    " stamina )": " 耐力 )",
    "resources every 10min": "资源每10分钟",
    "'s realm's Value": "的王国价值",
    "'s realm's Rank:": "的王国排名",
    "Attack Land ": "攻击土地 ",
    "Completed": "已完成",
    "Gold:\r": "黄金:\r",
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
    /^\( ([\d\.,]+), ([\d\.,]+) \)$/,
    /^\(([\d\.,]+) \- ([\d\.,]+)\)$/,
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
    [/^You currently have (.+) resources$/, '你当前有 $1 资源'],
    [/^You currently have (.+) gold$/, '你当前有 $1 黄金'],
    [/^You have (.+) points$/, '你有 $1 点数'],
    [/^Next at (.+) points$/, '下一个在 $1 点数'],
    [/^A new barrack on (.+) has produced (.+) soldiers$/, '位于 $1 上的一个新兵营已经培养了 $2 名士兵'],
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
    [/^([\d\.,]+) resource$/, '$1 资源'],
    [/^([\d\.,]+)  resource$/, '$1 资源'],
    [/^([\d\.,]+) resources$/, '$1 资源'],
    [/^([\d\.,]+)  resources$/, '$1 资源'],
    [/^([\d\.,]+) elves$/, '$1 精灵'],
    [/^([\d\.,]+) Barracks$/, '$1 兵营'],
    [/^([\d\.,]+) Gold$/, '$1 黄金'],
    [/^([\d\.,]+) Crops$/, '$1 作物'],
    [/^([\d\.,]+) Crop$/, '$1 作物'],
    [/^([\d\.,]+) Traps$/, '$1 陷阱'],
    [/^([\d\.,]+) Trap$/, '$1 陷阱'],
    [/^([\d\.,]+) Warehouses$/, '$1 仓库'],
    [/^([\d\.,]+) Warehouse$/, '$1 仓库'],
    [/^([\d\.,]+) soldiers defending the realm$/, '$1 士兵正在保卫王国'],
    [/^(.+) has been fortified with traps$/, '$1 已经设置了陷阱'],
    [/^(.+) has increased in value by ([\d\.,]+)$/, '$1 提高了它的价值 $2'],
    [/^Attack ([\d\.,]+) land in another realm$/, '攻击 $1 个土地 在另一个王国'],
    [/^Refill ([\d\.,]+) stamina$/, '回复 $1 耐力'],
    [/^Destroyed ([\d\.,]+) foreign lands$/, '摧毁 $1 外国土地'],
    [/^Referred ([\d\.,]+) other players$/, '邀请 $1 其他玩家加入游戏'],
    [/^Gain ([\d\.,]+) additional gold$/, '获取 $1 额外黄金'],
    [/^Gain ([\d\.,]+) resources$/, '获取 $1 资源'],
    [/^You have ([\d\.,]+) guard remaining.$/, '你还剩下 $1 守卫。'],
    [/^Recover ([\d\.,]+) stamina$/, '恢复 $1 耐力'],
    [/^Recover ([\d\.,]+) stamina, gain crops$/, '恢复 $1 耐力, 获得作物'],
    [/^Recover ([\d\.,]+) stamina, gain a barrack$/, '恢复 $1 耐力, 获得一个兵营'],
    [/^Convert ([\d\.,]+) resources to ([\d\.,]+) gold$/, '转换 $1 资源为 $2 黄金'],
    [/^Convert ([\d\.,]+) resource to ([\d\.,]+) gold$/, '转换 $1 资源为 $2 黄金'],
    [/^Confirm that you want to convert ([\d\.,]+) resources to ([\d\.,]+) gold$/, '确认你真的要转换 $1 资源为 $2 黄金'],
    [/^Cumulative kingdom value over ([\d\.,]+)$/, '王国累计价值超过 $1'],
    [/^Expand the land in your realm ([\d\.,]+) times$/, '扩展你的领土 $1 次'],
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
// 自动收集资源
function autoClaim(){
    // 强制刷新页面
    location.reload(); 
    if($('.flex.text-sm.mb-2 .mx-2.px-1.button-secondary').length > 0){
        $('.flex.text-sm.mb-2 .mx-2.px-1.button-secondary').trigger('click');
   }
}
! function() {
    console.log("加载汉化模块");
    // 1分钟自动一次自动收集资源
    clicks=setInterval(autoClaim,60000);
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