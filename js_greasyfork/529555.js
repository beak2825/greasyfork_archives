// ==UserScript==
// @name         牛牛簡體汉化
// @version      3.38
// @description  为Milky way idle汉化并兼容MWITool插件，有問題請不要找阿茶，沒問題也不要找
// @license       七包茶
// @match        https://www.milkywayidle.com/*
// @match        https://milkywayidle.wiki.gg/*
// @match        https://test.milkywayidle.com/*
// @match        https://mooneycalc.vercel.app/
// @match        https://mwisim.github.io/
// @match        https://mwisim.github.io/test/
// @match        https://sockosxptracker.pages.dev/
// @match        https://amvoidguy.github.io/MWICombatSimulatorTest/dist/index.html
// @match        https://shykai.github.io/MWICombatSimulatorTest/dist/
// @match        https://shykai.github.io/mwisim.github.io/
// @match        https://luyh7.github.io/milkonomy/*
// @match        https://doh-nuts.github.io/Enhancelator/
// @match        https://rshock.github.io/milkyNameMap/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=milkywayidle.com
// @grant        GM_addStyle
// @namespace https://greasyfork.org/zh-CN/scripts/529555-milky-way-idle%E6%B1%89%E5%8C%96%E6%8F%92%E4%BB%B6
// @downloadURL https://update.greasyfork.org/scripts/529555/%E7%89%9B%E7%89%9B%E7%B0%A1%E9%AB%94%E6%B1%89%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/529555/%E7%89%9B%E7%89%9B%E7%B0%A1%E9%AB%94%E6%B1%89%E5%8C%96.meta.js
// ==/UserScript==


GM_addStyle(`


    /* 阿茶的搜索框 */
    .script-custom-search-input {
        display: block;
        width: 200px;
        height: 27px;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 30px;
        font-size: 18px;
        margin: 10px 0;
    }


`);


//目录
//1.排除翻译部分
//2.中文对照部分
//2.0 首页
//2.1 通用页面
//------------- 任务教学
//----左侧边栏
//------------- 市场
//------------- Task
//------------- 專業
//----右侧边栏
//------------- 库存
//------------- 装备
//------------------/ 战斗状态
//------------------/ 非战斗状态
//------------- 房子
//------------- 配装
//2.2 战斗
//------------------/ 战斗相关
//------------------/ 战斗设置
//2.3 货币
//2.4 资源(商店顺序)
//------------------/ 材料
//------------------/ 石头
//----2.4.1 消耗品
//----2.4.2 技能书
//------------------* 矛类
//------------------* 剑类
//------------------* 锤类
//------------------* 弓弩类
//------------------* 水系魔法
//------------------* 自然系魔法
//------------------* 火系魔法
//------------------* 治疗类
//------------------* 黄书类
//------------------* 蓝书类
//----2.4.3 鑰匙(商店順序)
//----2.4.4 装备(商店顺序)
//----2.4.5 飾品(商店順序)
//----2.4.6 工具(商店顺序)
//2.5 宝箱
//2.6 怪物
//------------------* 批量模拟
//------------------* 臭臭星球
//------------------* 沼泽星球
//------------------* 海洋星球
//------------------* 丛林星球
//------------------* 哥布林星球
//------------------* 眼球星球
//------------------* 巫师之塔
//------------------* 熊熊星球
//------------------* 魔像洞穴
//------------------* 暮光之地
//------------------* 地狱深渊
//------------------* 奇幻洞穴
//------------------* 邪恶马戏团
//------------------* 秘法要塞
//------------------* 海盜灣
//2.7 状态类
//2.8 mo9通行證
//3.0 其他
//------------- 频道
//------------- 设置
//------------------/ 个人资料
//------------------/ 游戏
//------------------/ 帐户
//------------- 社交
//------------- 商店
//------------------/ 聊天图标
//------------------/ 名称颜色
//------------- 守则
//------------- 指引
//------------------/ 常见问题
//------------------/ 炼金
//------------------/ 强化
//------------------/ 战斗
//------------------/ 随机任务
//------------------/ 公会
//------------------/ 聊天指令
//3.1 新闻
//3.2 补丁
//3.3 尚未整理
//4.0 模擬器
//5.0 插件類漢化
//6.0 強化追蹤器
//7.0 戰鬥特效漢化


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
    // 排除共用连结
    '[class^="SocialPanel_referralLink"]',
    // 排除工会介绍
    '[class^="GuildPanel_message"]',
    // 排除工会名字
    '[class^="GuildPanel_guildName"]',
    // 排除排行榜工会名字
    '[class^="LeaderboardPanel_guildName"]',
    // 排除个人资讯工会名字
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

//2.0 首页
const tranfirstpage = {

    "Link Existing Account": "连接现有帐号？",
    "Do you already have a Milky Way Idle account that you would like to link to Steam": "您是否已有一个想要连接到Steam的《Milky Way Idle》帐号？",
    "LINK EXISTING ACCOUNT": "连接现有帐号",
    "CREATE NEW ACCOUNT": "创建新帐号",
    "Are you sure you want to logout": "是否确定要退出游戏",
    "ENTER GAME": "进\n入\n游\n戏",
    "Attempting to connect to server": "正在连接至《银河牛牛》...",
    "Disconnected. The game was opened from another device or window": "与伺服器断开连接，游戏已从其他装置或视窗开启",
    "Game update available. Please refresh your browser": "游戏有更新，请重启流览器",
    "Game server has been restarted. Please refresh the page": "游戏伺服器已重新启动。请重新整理页面",
    loading: "载入中...",
    Home: "主页",
    "Multiplayer Idle RPG": "多人放置RPG",
    "Embark on a journey through the Milky Way Idle universe, a unique multiplayer idle game. Whether you enjoy resource gathering, item crafting, or engaging in epic battles against alien monsters, we have something to offer for everyone. Immerse yourself in our thriving community, where you can trade in the player-driven marketplace, form a guild with friends, chat with fellow players, or climb to the top of the leaderboards":
        "踏上一段穿越《银河牛牛放置》的旅程，这是一款独特的多人放置游戏。无论你喜欢收集资源、制作物品，还是参与与外星怪物的史诗战斗，我们都能为每个人提供一些乐趣。沉浸在我们繁荣的社区中，你可以在由玩家驱动的市场交易，与朋友组建公会，与其他玩家聊天，或者登上排行榜的顶端。",
    "Gather and Craft": "收集和制作",
    "Milking, Foraging, Woodcutting, Cheesesmithing, Crafting, Tailoring, Cooking, Brewing, Alchemy, Enhancing": "挤奶、採摘、伐木、乳酪锻造、制作、裁缝、烹饪、冲泡、炼金、强化",
    "Multiple styles of combat with highly customizable consumable and ability auto-usage. Battle solo or with a party": "多种战斗风格，可高度自定义消耗品和能力的自动使用。单人或组队战斗",
    "Buy and sell resources, consumables, equipment, and more": "购买和出售资源、消耗品和装备",
    Community: "社区",
    "Party and chat with friends. Compete for a spot on the leaderboard": "与朋友一起玩耍和聊天。争夺排行榜上的位置",
    "Terms of Use": "使用条款",
    "Play As Guest": "以游客身份玩",
    Register: "注册",
    register: "注册",
    Login: "登录",
    "Your session will be saved in this browser. To play across multiple devices, you can go in": "你的会话将保存在此流览器中。要在多个设备上玩游戏，你可以进入",
    "in game to find your": "游戏中找到你的",
    "guest password": "游客密码",
    "or to fully": "或者完全",
    "I Agree to the": "我同意",
    Terms: "条款",
    "I am 13 years of age or older": "我年满13岁或以上",
    Play: "开始游戏",
    Password: "密码",
    "Password Confirmation": "确认密码",
    "Email or Name": "电子邮件或用户名",
    "Forgot Password": "忘记密码",
    "Loading characters": "正在载入角色",
    "Select Character": "选择角色",
    Empty: "空",
    "Create Character": "创建角色",
    "The Standard game mode is recommended for new players. There are no feature restrictions. You can only have 1 Standard character": "标准游戏模式没有功能限制适合新玩家。但你只能创建一个标准角色",
    "Last Online": "上次上线",

};



//2.1 通用页面
const tranCommon = {
    "Chest Statistics": "開箱統計",
    back: "返回",
    Reroll: "重随任务",
    level: "等级",
    Gather: "收集",
    Produce: "生产",
    Fight: "战斗",
    times: "次数",
    Queued: "生产队列",
    Purple: "牛紫",
    Task: "任务",
    Reward: "奖励",
    Go: "前往",
    Open: "打开",
    "Right Click": "点击右键",
    "Queued Actions": "伫列中的动作",
    "Run this action now? The current action will pause and continue after": "是否立即执行此操作？当前操作将暂停，并在前一项操作完成后继续进行",
    "Increases quantity of combat loot": "增加战斗战利品数量",
    Elite: "精英",
    "Are you sure you want to run away from combat": "你确定要跑路吗",
    No: "否",
    Yes: "是",
    Stop: "停止",
    "in combat": "战斗中",
    "flee": "退出战斗",
    "Opened Loot": "打开战利品",
    "You found": "你找到",
    "Are you sure you want to replace your queued actions": "这样做将清空目前的伫列",
    Learn: "学习",
    use: "使用",
    "Active Characters": "活跃玩家数",
    "total level": "总等级",
    mmmmmmmmmmlli: "mmmmmmmmmmlli",
    "Start Now": "现在开始",
    "Upgrade Queue Capacity": "增加伫列上限",
    "Total Experience": "总经验值",
    "Xp to Level Up": "升级所需经验值",
    "You need to enable JavaScript to run this app": "你需要启用JavaScript才能运行此应用程式",
    "Require": "需要",
    "Bigger": "更大",
    "Battle started": "战斗开始",
    off: "关",
    gain: "获得",
    "NO items available": "无物品可用",
    Weapon: "主手/双手武器",
    Offhand: "副手",
    Presets:"预设套装",
    "Welcome Back": "欢迎回来！",
    "Offline duration": "已离线",
    "Progress duration": "已达离线上限",
    "You made progress for": "你已离线至当前上限",
    "Items consumed": "你消耗了",
    Close: "关闭",
    "Items gained": "获得物品",
    "Experience gained": "获得经验",
    "Usable In": "可用于",
    "Usable": "可用于",
    "Traveling To Battle": "踏上战斗之旅",
    "Doing nothing": "无所事事",
    "Ability Slot": "技能槽",
    "Lv.20 INT": "20智力",
    "Lv.50 INT": "50智力",
    "Lv.90 INT": "90智力",
    Tip: "提示",

    //------------- 任务教学
    "New Tutorial Message": "新的教学消息",
    Tutorial: "教学",
    "where magical cows mooo! I'm Purple, the Chief Training Officer (CTO), and also your tour guide today": "这里是神奇的牛牛世界！我是牛紫，首席培训官（CTO），也是你的导游",
    "I'll sprinkle some glowing magical dust to guide you through the training": "我会撒些闪闪发光的魔法粉尘来引导你完成训练",
    "Hi Purple": "嗨，牛紫",
    "You need at least 30 total level to chat": "你需要至少30总等级才能聊天",
    "spam protection": "垃圾邮件保护",
    "New Tutorial Task": "新的教学任务",
    "Complete your tutorial tasks to unlock the task board": "完成教学任务即可解锁任务板",
    "Your current task can be found in the top-right corner": "您目前的任务可以在右上角找到",
    "Let me first show you what we magical cows are best known for": "让我先向你展示我们神奇的牛牛最擅长的事情",
    "producing magical milk! By the way, my cousin Burble also works here. Hi Burble": "生产神奇的牛奶！顺便说一下，我的表弟Burble也在这里工作。嗨，Burble",
    "First, try and gather some milk": "首先，尝试收集一些牛奶",
    Accept: "接受",
    OK: "好的",
    "Good job! Here's some extra milk and a brush. Magical cows love to be brushed, and happy cows produce milk faster": "干得好！这是一些额外的牛奶和一把刷子。神奇的牛牛喜欢被刷，快乐的牛牛产奶更快",
    "Let's make some cheese with the milk! These special cheeses are very durable and can be turned into many useful things through cheesesmithing":
        "让我们用牛奶做些乳酪！这些特殊的乳酪非常耐用，可以通过乳酪制作变成许多有用的东西",
    "Great! Take some extra cheese with you for the next task": "太棒了！带一些额外的乳酪继续下一个任务",
    "Cheeses are essential resources for making tools, weapons, and armor. Let me show you how to make a cheese sword. I know it might sound crazy and maybe a little bit smelly too, but trust me":
        "乳酪是制作工具、武器和盔甲的重要资源。让我来教你如何制作乳酪剑。我知道这听起来可能很疯狂，也可能有点臭，但请相信我",
    "Awesome! As you level up, equipment can be upgraded to higher tiers! Tools can also be made to improve each of your skills":
        "太棒了！随着你的等级提升，装备可以升级到更高的阶级！也可以制作工具来提高你的每项专业",
    "Now let's go forage for some more resources. Head to Farmland and see what items you can gather": "现在让我们去寻找更多的资源。前往农田，看看你能收集到什么物品",
    "That was fast! Foraging gives you resources used in many skills, including cooking, brewing, and tailoring": "速度很快！寻找资源可以用于许多专业，包括烹饪、冲泡和裁缝",
    "It's time to make use of your cooking skill and whip up a delicious donut using some eggs, wheat, and sugar. What? You can't cook? Of course you can! There's a rat from Earth that can cook, and if he can do it, so can you! Give it a try":
        "现在是时候利用你的烹饪专业，用一些鸡蛋、小麦和糖制作美味的甜甜圈。什么？你不会做饭？当然你会！地球上有只老鼠会做饭，如果他能做到，你也能！辣就试试看吧",
    "Fantastic! Food can heal you while in combat. Here's a dozen more donuts for free": "太棒了！食物可以在战斗中治疗你。这里还有一打免费的甜甜圈",
    "Now I want to take you on an expedition to one of our neighboring planets": "现在我想带你去我们的邻近行星之一进行探险",
    "the Smelly Planet! I hear there are lots of flies, and they bite! You'll want to bring your sword and some donuts. Let's go":
        "臭臭星球！我听说那里有很多苍蝇，它们会叮咬！你会想带上你的剑和一些甜甜圈。我们走吧",
    "Battling aliens earns you coins, resources, ability books, and even rare items": "与外星人战斗可以获得金币、资源、能力书籍，甚至是稀有物品",
    "If you are knocked out during combat, you will recover in 150 seconds and continue fighting": "如果在战斗中被击倒，你将在150秒内回復并继续战斗",
    "Looks like the tour is almost over. There's still much more to explore, but don't worry, you won't be alone! Once you level up a little more, you can chat with or get help from other players":
        "看起来导览快要结束了。还有很多地方可以探索，但不用担心，你不会孤单！一旦你再升级一点，就可以与其他玩家聊天或寻求帮助",
    "You can also buy or sell items in our player-driven marketplace, unless you are playing Ironcow mode": "你还可以在由玩家驱动的市场上买卖物品，除非你是玩铁牛模式",
    "Before I go, here's a few more tips": "在我离开之前，再给你几个提示",
    "A Game Guide can be found at the bottom of the navigation menu on the left": "游戏指南可以在左侧导航功能表的底部找到",
    "If you go offline, you'll continue to make progress for 10 hours (upgradable": "如果你离线，将可继续进行10小时的进度（可升级",
    "Items, abilities, skills, and enemies can be hovered over (long press on mobile) to see more detailed tooltips":
        "可以将滑鼠悬停在物品、技能、专业和敌人上（在移动设备上长按）以查看更详细的工具提示",
    "I have to go now. It's time for my second lunch, and I have four stomachs to fill. Now go explore the Milky Way":
        "我现在要走了。现在是我第二顿午餐的时间了，我有四个胃要填饱。现在去探索《银河牛牛》吧",
    "Bye Purple": "再见，牛紫",


    };

//----左侧边栏
const tranLeftpage = {
    "My Stuff": "我的物品",
    "Inventory, equipment, and abilities.": "库存、装备和技能",
    marketplace: "市场",
    "player-driven market where you can buy and sell items with coins": "玩家驱动的市场，你可以用金币购买和出售物品",
    tasks: "任务",
    milking: "挤奶",
    mooooooooo: "哞哞哞...",
    foraging: "採摘",
    "Master the skill of picking up things": "我在小小的花园里面挖呀挖呀挖",
    woodcutting: "伐木",
    "Chop chop chop": "请时刻警惕周围的光头强",
    cheesesmithing: "乳酪锻造",
    "Did you know you can make equipment using these special hardened cheeses": "芝士就是...打铁！",
    crafting: "制作",
    "Create weapons, jewelry, and more": "制作远程和魔法武器、及碎掉宝石",
    tailoring: "裁缝",
    "Create ranged and magic clothing": "魔法缝纫，定制您的传奇装束！",
    cooking: "烹饪",
    "The art of making healthy food": "制作各种碳水炸弹",
    brewing: "冲泡",
    "The art of making tasty drinks": "我在牛牛007的最佳伴侣",
    Alchemy: "炼金",
    "Transform unwanted items into wanted ones": "点牛成金",
    "hopefully": "哞~哞~哞!!",
    enhancing: "强化",
    "takes effort, +10 takes luck, +15 is a miracle, and +20 is destiny": "靠努力，+10 靠运气，+15 是奇迹，+20 是命运",
    combat: "战斗",
    "Fight monsters. Your combat level represents your overall combat effectiveness based on the combination of individual combat skill levels":
        "战斗等级代表了目前攻击方式的各个小项专业等级的综合评估",
    stamina: "耐力",
    "Increases max HP by 10 per level": "每级+10点最大HP",
    intelligence: "智力",
    "Increases max MP by 10 per level": "每级+10点最大MP",
    attack: "攻击",
    "Increases your accuracy, base attack speed, and cast speed": "增加你的命中、基础攻击速度、施法速度",
    defense: "防御",
    "Increases your evasion, armor, elemental resistances, and retaliation damage": "增加你的闪避、护甲和元素抗性",
    "Melee": "近战",
    "Increases your melee damage": "增加你的近战伤害",
    ranged: "远程",
    "Increases your ranged damage. Ranged attacks have bonus chance to critical strike": "增加你的远程伤害。远程攻击有额外机率造成致命一击",
    magic: "魔法",
    "Increases your magic damage": "增加你的魔法伤害",
    "Randomly generated tasks that players can complete for rewards": "随机生成的任务，玩家可以完成以获得奖励",
    shop: "商店",
    "Purchase items from the vendor": "贩售各类杂物",
    "Buy Item": "购买商品",
    "cowbell store": "牛铃商店",
    "Purchase and spend cowbells": "购买和使用牛铃",
    "Track the loot from your recent actions": "看啥看!? 没见过美''牛''!?",
    "Loot Tracker": "掉落追踪",
    "Start Time": "开始时间",
    social: "社交",
    "Friends, referrals, and block list": "好友、推荐和黑名单",
    guild: "公会",
    "Join forces with a community of players": "看看是谁在idle里面idle",
    leaderboard: "排行榜",
    "Shows the top ranked players of each skill": "显示每个专业的排名前几位的玩家",
    settings: "设置",
    "Update account information and other settings": "更新帐户资讯和其他设置",
    news: "新闻",
    "patch notes": "补丁说明",
    "game guide": "新手指引",
    rule: "游戏守则",
    "The rules for Milky Way Idle are designed to ensure an enjoyable and fair experience for all players. Breaking the rules would result in appropriate penalties dependent on the type and severity of the offense. Penalties include verbal warning, mute, item removal, trading ban, or account ban":
        "《银河牛牛放置》 的规则旨在确保所有玩家都能享受公平愉快的游戏体验。违规者将根据违规类型和严重程度受到相应的惩罚。惩罚包括口头警告、禁言、移除物品、交易禁令或帐号封禁等。",
    "merch store": "周边商店",
    "test server": "测试伺服器",
    "privacy policy": "隐私政策",
    "switch character": "选择角色",
    logout: "退出登录",
    "Game Wiki": "维基百科",

    };

//------------- 市场
const tranMarket = {
    "The marketplace allows players to make buy or sell listings for any tradable item.You can click on any item listed to view existing listings or to create your own":
        "市场允许玩家为任何可交易的物品创建买入或卖出清单。你可以点击任何列出的物品来查看现有的清单或创建自己的清单",
    "New listings will always be fulfilled by the best matching prices on market when possible.If no immediate fulfillment is possible, the listing will appear on the marketplace":
        "新的清单将尽可能由市场上最匹配的价格来满足。如果无法立即满足，该清单将出现在市场上",
    'When a trade is successful, a tax of 2% coins is taken and the received items can be collected from "My Listings" tab.Asks':
        "当交易成功时，会收取2%的金币作为税收，并且可以从“我的清单”选项中收取所获得的物品。询问",
    Asks: "询问",
    "existing sell listings.Bids": "现有的卖出清单。竞价",
    Bids: "竞价",
    "existing buy listings": "现有的买入清单",
    "market listings": "市场清单",
    "my listings": "我的清单",
    Listings: "清单",
    "Are you sure you want to cancel this listing": "你确定要取消此清单吗",
    "item filter": "搜索（中文）",
    "New Sell Listing": "新出售单",
    "New Buy Listing": "新收购单",
    "Listing Limit Reached": "已达上架限制",
    "view all items": "查看所有物品",
    "upgrade capacity": "增加上限",
    "Collect All": "收集全部",
    Item: "物品",
    "Best Ask Price": "最佳出售价",
    "Best Bid Price": "最佳收购价",
    "View All": "查看全部",
    Quantity: "数量",
    "Ask Price": "出售价",
    "Bid Price": "收购价",
    Action: "操作",
    "View All Enhancement Levels": "查看所有强化级别",
    Amount: "数量",
    status: "状态",
    type: "类型",
    progress: "进度",
    "tax taken": "收税",
    collect: "收集",
    active: "有效",
    Inactive: "无效",
    sell: "出售",
    buy: "购买",
    price: "价格",
    cancel: "取消",
    Refresh: "刷新",
    "Sell Price": "售价",
    "Sell Listing": "出售清单",
    "Chat Link": "聊天链结",
    "Enhancement Level": "强化等级",
    "Price (Best Sell Offer": "价格(最佳售价",
    "Quantity (You Have": "数量(你拥有",
    "You don't have enough items": "你没有足够的物品",
    "You Get": "你获得",
    Taxed: "扣税",
    "more if better offers exist": "或更多, 如果有更好的报价",
    "Post Sell Listing": "发佈出售清单",
    "Buy Listing": "购买清单",
    "You can't afford this many": "你负担不起这麽多",
    "You Pay": "你支付",
    "Pay": "支付",
    "less if better offers exist": "或更少, 如果有更好的报价",
    "Post Buy Listing": "发佈购买清单",
    "Sell Now": "立即出售",
    All: "全部",
    "Post Sell Order": "发佈出售订单",
    "Buy Now": "立即购买",
    "Post Buy Order": "发佈购买订单",
    Filled: "完成",
    "Must be at least": "必须至少",
    "You Have": "你有",
    "You Can Afford": "你能负担",
    "Cannot afford": "无法购买",
    "Price (Best Buy Offer": "价格 (最好的买价",

    };

//------------- Task
const tranTask = {
    "Task Board": "任务板",
    "Task Shop": "任务商店",
    "TaskSort": "任务排序",
    "Next Task": "下一个任务",
    Upgrades: "升级",
    Items: "物品",
    "Lifetime Task Points": "终身任务点数",
    "Task Points": "任务点数",
    Claim: "领取",
    "Claim Reward": "领取报酬",
    "Hour Task Cooldown": "每小时任务冷却",
    "Block Slot": "屏蔽槽位",
    "Unlock Combat Block": "解锁战斗屏蔽",
    "Buy Task Upgrade": "购买任务升级",
    "Permanently reduces the waiting time between tasks by 1 hour": "永久减少任务间的等待时间1小时",
    "Adds a block slot, allowing you to block a non-combat skill from being selected for tasks": "增加一个屏蔽槽位，允许你屏蔽非战斗专业被选择为任务",
    "Unlocks the ability to block combat tasks. You need at least 1 available block slot to use this": "解锁屏蔽战斗任务的能力。你至少需要1个可用的屏蔽槽位来使用此功能",
    "Buy Task Shop Item": "购买任务商店物品",
    "You don't have enough Task Token": "你没有足够的任务代币",
    "unread task": "未读的任务",
    read: "阅读",
    "MooPass Free Reroll": "Moo卡免费重置",
    "Confirm Discard": "确认删除",

    };

//------------- 專業
const tranSkill = {
    Upgrade: "升级",
    From: "从",
    Requires: "需求",
    "Output": "产出",
    Outputs: "产出",
    Rares: "稀有",
    Duration: "持续时间",
    Essences: "精华",
    "Task Action Speed": "任务行动速度",
    "No upgrade item selected": "无可用的升级物品",

    // --挤奶
    "The milks from these magical cows have a wide variety of functions.They can be used to produce consumables or craft into special cheese to make equipment":
    "这些魔法奶牛产的牛奶有多种用途。它们可用来制作消耗品，或是加工成特殊乳酪以打造装备",
    "Cows love to be brushed. Equipping a brush will boost your milking skill": "牛牛喜欢被刷。装备刷子会提升你的挤奶专业",
    Cow: "牛牛",
    "Verdant Cow": "翠绿牛牛",
    "Azure Cow": "蔚蓝牛牛",
    "Burble Cow": "深紫牛牛",
    "Crimson Cow": "深红牛牛",
    Unicow: "彩虹牛牛",
    "Holy Cow": "神圣牛牛",

    // --採摘
    "You can find many different resources while foraging in the various areas.These resources can be used for cooking and brewing consumables":
        "在各个不同的区域进行採摘时，你可以找到许多不同的资源。这些资源可以用于烹饪和冲泡消耗品",
    "Equipping shears will boost your foraging skill": "装备剪刀会提升你的採摘专业",
    farmland: "农场",
    "shimmering lake": "波光湖",
    "misty forest": "迷失森林",
    "burble beach": "深紫沙滩",
    "silly cow valley": "傻牛谷",
    "olympus mons": "奥林匹斯山",
    "asteroid belt": "小行星带",

    // --伐木
    "You can gather logs from different types of trees.Logs are used for crafting various equipments": "你可以从不同种类的树木上收集原木。原木可用于制作各种装备",
    "Equipping a hatchet will boost your woodcutting skill": "装备一把斧头会提升你的伐木专业",
    Tree: "树",
    "Birch Tree": "桦树",
    "Cedar Tree": "雪松树",
    "Purpleheart Tree": "紫心木树",
    "Ginkgo Tree": "银杏树",
    "Redwood Tree": "红杉树",
    "Arcane Tree": "奥秘树",

    // --乳酪锻造
    "The hardened cheeses made with milks from the magical cows are as tough as metal.You can smith them into equipment that gives you bonuses in combat or skilling":
        "用魔法牛牛的奶制作的硬质奶酪坚硬如金属。你可以将它们锻造成在战斗或专业中给你加成的装备",
    "Equipment is upgradable from one tier to the next, often requiring increasing amount of cheese.There is also special equipment that can be crafted with items found from monsters in combat":
        "装备可以从一级升级到下一级，通常需要越来越多的奶酪。还有一些特殊的装备可以用在战斗中从怪物身上获得的物品来制作",
    "Equipping a hammer will boost your cheesesmithing skill": "装备锤子会提升你的奶酪锻造专业",
    Material: "材料",

    // --制作
    "You can craft weapons, offhands, and jewelry": "你可以制作武器、副手物品和珠宝",
    "Equipping a chisel will boost your crafting skill": "装备凿子会提升你的制作专业",
    Crossbow: "弩",
    Bow: "弓",
    Staff: "法杖",
    Special: "特殊",
    "Dungeon Keys": "地下城钥匙",

    // --裁缝
    "You can tailor ranged and magic clothing using raw materials gathered from combat and foraging": "你可以使用从战斗和採摘中获得的原材料来制作远程和魔法服装",
    "Equipping a needle will boost your tailoring skill": "装备针会提升你的裁缝专业",

    // --烹饪
    "Food can be used to recover your HP or MP.They can be brought with you to combat": "食物可用于回復你的生命值（HP）或魔法值（MP）。这些食物可以在战斗中被使用",
    "Equipping a spatula will boost your cooking skill": "装备铲子会提升你的烹饪专业",
    "Instant Heal": "即时治疗",
    "Heal Over Time": "持续治疗",
    "Instant Mana": "即时回蓝",
    "Mana Over Time": "持续回蓝",

    // --酿造
    "Drinks can provide you with temporary buffs.Coffee can be brought with you to combat and tea can be used while skilling":
        "饮品可以给你提供临时的增益效果。咖啡可以在战斗中携带，茶可以在提升专业时使用",
    "Equipping a pot will boost your brewing skill": "装备一个锅可以提升你的冲泡专业",
    Tea: "茶",
    Coffee: "咖啡",

    // --炼金
    Recommended: "推荐",
    "Target": "目标",
    "Target Level": "目标等级",
    Attempt: "尝试",
    Transform: "转换",
    Catalyst: "催化剂",
    "Essence Drop": "精华掉落",
    "Coinify": "点金",
    "Decompose": "分解",
    "Transmute": "转化",
    "Alchemize": "炼金",
    "Using Catalyst": "使用催化剂",
    "Alchemy Efficiency":"炼金效率",
    "Alchemize Item": "炼金物品",
    "Alchemy Catalyst":"炼金催化剂",
    "Catalyst increases success rate.One catalyst is consumed per success": "催化剂可提高成功率。仅在成功时消耗一个",
    "Select an item to alchemize": "选择要炼金的物品",
    "Converts item into coins": "将物品转换为金币",
    "Converts item into component materials": "将物品分解为原材料",
    "You are currently not alchemizing anything":"当前无炼金",
    "This item cannot be decomposed": "该物品无法被分解",
    "This item cannot be transmuted": "该物品无法被转化",
    "Alchemy allows you to transform items into other items.Each alchemy action has a different success rate, and the input items will always be consumed regardless of success or failure":
        "炼金能让你将物品转换为其他物品。每种炼金的操作都有不同的成功率，但无论成功与否，用于炼金的投入物品都会被消耗掉",
    "coinify, decompose, and transmute":"【点金】，【分解】和【转化】",
    "Converts item into coins.Decompose":"将物品转换为金币。分解",
    "Converts item into component materials.Transmute":"将物品分解为原材料。转化",
    "Converts item into a random related item":"将物品转换为随机相关物",
    "Converts item into a random related item, and in some cases unique items that cannot be acquired elsewhere":"将物品转化为随机相关物品，在某些情况下可转化为无法在其他地方获得的独特物品",
    "Each transformation has a base success rate.The success rate is lower if your alchemy level is lower than the item level.Catalyst and tea can be used to increase the success rate":
        "每次转换都有一个基础成功率。如果你的炼金等级低于物品等级，成功率就会较低。可以使用催化剂和茶来提高成功率",
    "One catalyst is consumed each action to increase success rate": "每次动作消耗1个催化剂并提高成功率",
    "Equipping an Alembic will boost your alchemy skill":"装备炼金蒸馏器将提升你的炼金专业",

    // --强化
    "Enhancing allows you to permanently improve your equipment, giving them increasing bonuses as their enhancement level go up":
        "强化可以让你永久提升装备，随着强化等级的提升，装备的奖励效果也会增加",
    "Enhancing costs a small amount of materials for each attempt.The success rate depends on your enhancing skill level, the tier of the equipment, and the equipment's current enhancement level.A successful enhancement will increase the level by 1 and failure will reset the level back to":
    "每次尝试强化都需要消耗少量材料。成功率取决于你的强化专业等级、装备的等级和当前的强化等级。成功的强化将使等级增加1，失败将使等级重置为",
     "You can optionally use copies of the base equipment for protection.Failure with protection will only reduce the enhancement level by 1 but consume 1 protection item":
        "你可以选择使用与基础装备相同的物品作为保护手段。在有保护的情况下即使强化失败，也仅会使强化等级降低一级，但这会消耗一件你说使用的保护物品",
    "Equipping an enhancer will boost your enhancing success":
        "装备强化器能提高你的强化成功率",

    //--強化裡保護?的說明
    "One protection item is consumed on failure to ensure that only 1 enhancement level is lost instead of being reset to": "若强化失败，将消耗一件保护道具，以确保仅损失 1 级强化等级，而非重置为",

    Protect: "保护",
    Protection: "保护",
    "Protect From": "保护自",
    "Item not available": "道具无法使用",
    "Protect From level": "保护等级",
    "Must Be ≥ 2 To Be Effective": "必须 ≥ 2 才有效",
    Instructions: "指引",
    "Enhancement Bonus": "强化加成",
    "You can optionally use copies of the base equipment for protection. Failure with protection will only reduce the enhancement level by 1 but consume 1 protection item":
        "你可以选择使用基础装备的副本进行保护。带有保护的失败只会将强化等级减少1，但会消耗1个保护道具",
    "Equipping an enhancer will boost your enhancing skill": "装备一个强化器会提升你的强化专业",
    "Enhance Item": "强化物品",
    "Enhancing Protection": "强化保护",
    "Current Action": "当前操作",
    "You are currently not enhancing anything": "当前无强化",
    "Select an equipment to enhance": "选择一个装备进行强化",
    "Enhancement Data": "强化在线统计",
    Success: "成功",
    "increases the item's enhancement level by": "将使物品的强化等级增加",
    Failure: "失败",
    "resets the enhancement level to 0 unless protection is used": "除非使用保护道具，否则将重置强化等级为0",
    "Next Level Bonuses": "下一级奖励",
    "Enhancing Cost": "强化费用",
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
    "setup queue": "设置伫列",
    "Loadout":"配装",
    "No Loadout":"不使用配装",

};


//----右侧边栏
const tranRightpage= {
    Inventory: "库存",
    Equipment: "装备",
    Abilitie: "技能",
    House: "房子",
    Loadout: "配装",
    Currencie: "货币",
    Food: "食物",
    Drink: "饮料",
    Resource: "资源",
    Consumable: "消耗品",
    "Ability Book": "技能书",
    Accessories: "饰品",
    Tool: "工具",
    Ability: "技能",

    //------------- 库存(右侧边栏)
    "View Marketplace": "市场",
    "Link To Chat": "聊天连结",
    "Open Item Dictionary": "物品字典",
    Equip: "装备",
    "Level Not Met": "等级未达到",
    "New Ability": "新技能",
    "Cannot During Combat": "战斗中无法使用",
    "No abilities available": "无技能可用",

    //------------- 装备(右侧边栏)
    "View Stats": "查看状态",
    "Main Hand": "主手",
    "Off Hand": "副手",
    "Two Hand": "双手",
    Earrings: "耳环",
    Head: "头部",
    Necklace: "项链",
    charm: "护符",
    Body: "身体",
    Legs: "腿部",
    Hands: "手部",
    Ring: "戒指",
    Feet: "脚部",
    Trinket:"饰品",
    Pouch: "袋子",
    "Milking Tool": "挤奶工具",
    "Foraging Tool": "採摘工具",
    "Woodcutting Tool": "伐木工具",
    "Wood-Cutting Tool": "伐木工具",
    "Cheese Smithing Tool": "乳酪锻造工具",
    "Cheesesmithing Tool": "乳酪锻造工具",
    "Cheese-Smithing Tool": "乳酪锻造工具",
    "Crafting Tool": "制作工具",
    "Tailoring Tool": "裁缝工具",
    "Cooking Tool": "烹饪工具",
    "Brewing Tool": "冲泡工具",
    "Alchemy Tool": "炼金工具",
    "Enhancing Tool": "强化工具",

    //------------------/ 战斗状态
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
    "Heal for % of auto-attack": "自动攻击时回復%的HP",
    "Mana Leech": "法力吸取",
    "Leeches for % of auto-attack": "自动攻击时吸取%的MP",
    "elemental thorns": "魔法反伤",
    "physical thorns": "物理反伤",
    Thorn:"反伤",
    "When attacked, reflects a percentage of your armor or resistance (corresponding to the attack type) as damage back to the attacker": "受到攻击时，依护甲/抗性（对应攻击类型）以一定%作为伤害反弹给攻击者",
    Tenacity: "韧性",
    "Reduces chance of being blinded, silenced, or stunned": "降低被致盲、沉默或眩晕的几率",
    Threat: "威胁",
    "Increases chance of being targeted by monsters": "增加成为怪物目标的几率",
    Ripple: "涟漪",
    Bloom: "绽放",
    Blaze: "炽焰",
    "HP Regen": "HP回復",
    "Recover % of Max HP per 10s": "每10秒回復MAX HP的%",
    "MP Regen": "MP回復",
    "Recover % of Max MP per 10s": "每10秒回復MAX MP的%",
    "Drop Rate": "掉落率",
    "Increase regular item drop rate": "增加普通物品的掉落率",
    "Combat Rare Find": "战斗稀有发现",
    "Increase rare item drop rate": "增加稀有物品的掉落率",
    "Combat Style": "战斗风格",
    "Damage Type": "伤害类型",
    "Max HP": "MAX HP",
    "Max MP": "MAX MP",
    "Max Hitpoints": "MAX HP",
    "Max Manapoints": "MAX MP",
    "Stab Evasion": "刺击闪避",
    "Slash Evasion": "斩击闪避",
    "Smash Evasion": "钝击闪避",
    "Ranged Evasion": "远程闪避",
    "Magic Evasion": "魔法闪避",
    Armor: "护甲",
    "Water Resistance": "水属性抗性",
    "Nature Resistance": "自然属性抗性",
    "Fire Resistance": "火属性抗性",
    "defensive damage": "防御伤害",
    "Combat Experience": "战斗经验",
    Speed: "速度",
    "Increases action speed": "增加行动速度",
    "Task Speed": "任务速度",
    "Increases speed on actions assigned as tasks": "增加分配为任务的行动速度",
    "Increases gathering quantity": "增加採集数量",
    "Increases chance of finding essences": "增加找到精华的机会",
    Efficiency: "效率",
    "Chance of repeating the action instantly": "立即重複行动的几率",
    "Skilling Essence Find": "专业精华发现",
    "Skilling Rare Find": "专业稀有发现",
    "Milking Rare Find": "挤奶稀有发现",
    "Foraging Rare Find": "採摘稀有发现",
    "Woodcutting Rare Find": "伐木稀有发现",
    "Cheesesmithing Rare Find": "乳酪锻造稀有发现",
    "Crafting Rare Find": "制作稀有发现",
    "Tailoring Rare Find": "裁缝稀有发现",
    "Cooking Rare Find": "烹饪稀有发现",
    "Brewing Rare Find": "冲泡稀有发现",
    "Alchemy Rare Find": "炼金稀有发现",
    "Enhancing Rare Find": "强化稀有发现",
    "Increases chance of finding meteorite caches or artisan's crates": "增加发现陨石或工匠箱子的几率",

    //------------------/ 非战斗状态
    "Milking Speed": "挤奶速度",
    "Foraging Speed": "採摘速度",
    "Woodcutting Speed": "伐木速度",
    "Cheesesmithing Speed": "乳酪锻造速度",
    "Crafting Speed": "制作速度",
    "Tailoring Speed": "裁缝速度",
    "Cooking Speed": "烹饪速度",
    "Brewing Speed": "冲泡速度",
    "Alchemy Speed": "炼金速度",
    "Milking Experience": "挤奶经验",
    "Foraging Experience": "採摘经验",
    "Woodcutting Experience": "伐木经验",
    "Cheesesmithing Experience": "乳酪锻造经验",
    "Crafting Experience": "制作经验",
    "Tailoring Experience": "裁缝经验",
    "Cooking Experience": "烹饪经验",
    "Brewing Experience": "冲泡经验",
    "Alchemy Experience": "炼金经验",
    "Enhancing Experience": "强化经验",
    "Enhancing Success": "强化成功率",
    "Skilling Experience": "专业经验",

    // --技能(右侧边栏)
    "Abilities can be learned from ability books.You can acquire ability books as drops from monsters or purchase them from other players in the marketplace":
        "技能可以从技能书中学习。技能书可以从怪物身上获得，或者在市场上从其他玩家那里购买",
    "Abilities can be placed into slots to be used in combat.You unlock more slots as your intelligence skill level increases":
        "技能可以放置在槽位中用于战斗。随着智力专业等级的提升，你将解锁更多的槽位",
    "Abilities can level up as you gain experience.You get 0.1 experience for every use in combat and a much larger amount from consuming duplicate ability books":
        "随着经验的获得，技能将可以升级。每次在战斗中使用技能时可以获得0.1点经验，并且从消耗重複的技能书中可以获得更多经验",
    "Ability Slots": "技能槽",
    "Learned Abilities": "已学习的技能",
    "Special Ability Slot": "特殊技能槽",

    //------------- 房子(右侧边栏)
    "View Buffs": "查看 Buff",
    "House Buffs": "房子 Buff",
    "Combat Buff": "【战斗】Buff",
    "All Skill Buffs": "【所有专业】Buff",
    "Milking Buff": "【挤奶】Buff",
    "Foraging Buff": "【采摘】Buff",
    "Woodcutting Buff": "【伐木】Buff",
    "Cheesesmithing Buff": "【奶酪锻造】Buff",
    "Crafting Buff": "【制作】Buff",
    "Tailoring Buff": "【裁缝】Buff",
    "Cooking Buff": "【烹饪】Buff",
    "Brewing Buff": "【冲泡】Buff",
    "Alchemy Buff": "【炼金】Buff",
    "Enhancing Buff": "【强化】Buff",
    "Not built": "未建造",
    None: "无",
    Buff: "Buff",
    "Global Buffs": "全域Buff",
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

    //------------- 配装(右侧边栏)
    "New Loadout": "新建配装",
    "All Skills": "所有专业",
    "Create Loadout": "创建配装",
    "Import Current Setup": "导入当前配置",
    "Equip Loadout": "装备配装",
    "Loadout equipped": "配装已装备",
    "Loadout created": "配装已创建",
    "Loadout deleted": "配装已删除",
    "Loadout Updated": "配装已更新",
    "Do not notify when items are unavailable": "关闭【消耗品不足】的警告",
    "Imported current setup to loadout": "将当前设定导入配置",
    "Cannot equip loadout in combat": "战斗中无法装载",
    "Delete Loadout": "删除配装",
    "View All Loadouts": "查看所有配装",
    "Loadouts allow you to save your current equipment, consumables, and abilities to be automatically loaded later with actions.Loadouts can be tied to a single skill or \"All Skills.\"Selecting \"All Skills\" will only save equipment":
        "装备配装可以让你保存当前的装备、消耗品以及技能，以便日后减少操作直接载入。装备配装可以与单一专业或 “所有专业” 相关联。选择 “所有专业” 将只保存装备",
    "Are you sure you want to delete this loadout": "确 定 要 删 除 此 配 装 吗",
    "Are you sure you want to import your current setup? This will overwrite the current loadout": "是否要汇入当前设置？这将复盖原本的配置",


    };

//2.2 战斗
const tranCombat = {
    Stunned: "被眩晕",
    Silenced: "被沉默",
    "Fighting monsters will earn you experience and item drops.Your combat stats are based on a combination of your combat skill levels and your equipment bonuses":
        "击败怪物能让你获得经验值以及物品掉落。而战斗属性取决于你的战斗专业等级与装备加成的综合效果",
    "You can bring food to recover HP or MP, drinks to give you buffs, and abilities that can be cast.You can change the automation configuration from the settings icon below them":
        "你可以携带食物恢复HP或MP，饮品可以提供增益效果，还可以施放各种技能。你可以通过下方的设置图示来更改自动化配置",
    "if you are defeated in combat, your character will wait through a respawn timer before automatically continuing combat": "如果你在战斗中被击败，你的角色会在等待重生计时器结束后自动继续战斗",
    "combat zone": "战斗区域",
    "find party": "寻找队伍",
    "Private party":"私人队伍",
    "Public party":"公开队伍",
    "Auto-kick disabled":"自动踢除已禁用",
    "Auto-kick enabled":"自动踢除已启用",
    "Auto-kick if not ready over 5 minutes":"自动踢出5分钟未准备的队员",
     battle: "战斗",
    "auto attack": "自动攻击",
    "select zone": "选择区域",
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
    "Lv. Req": "Lv ≥",
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
    "Are you sure you want to leave the party": "确定是否要离开队伍",
    "Are you sure you want to disband the party": "确定是否要解散队伍",
    "give leadership": "转让队长",
    Defeat: "击败",
    Start: "开始",
    disabled: "已禁用",

    //---------------------/ 战斗相关
    Physical: "物理",
    "ranged": "远程",
    "magic": "魔法",
    Slash: "斩击",
    Stab: "刺击",
    Smash: "钝击",
    Water: "水",
    Nature: "自然",
    Fire: "火",
    Monsters: "怪物",
    "Boss Fight": "首领战斗",
    Every: "每个",
    Battles: "战斗",
    Travel: "旅行",
    Difficulty: "难度",
    "Combat Level": "战斗等级",
    Bonuses: "加成",
    "Entry Key": "门票",
    Bosses: "首领",
    Detail: "详情",
    "Action Speed": "行动速度",
    "Decreases time cost for the action": "降低行动的时间成本",
    "Milking Level": "挤奶等级",
    "Buffs milking level": "增益挤奶等级",
    "Increases experience gained": "增加获得的经验",
    "Increases drop rate of meteorite caches, artisan's crates, and treasure chests": "增加陨石、工匠的箱子和宝箱的掉落率",
    "Cannot change while in combat": "战斗中无法更换",
    "Cannot change in combat": "战斗中无法更换",

    //---------------------/ 战斗设置
    "Fight ∞ times": "战斗 ∞ 次",
    Description: "描述",
    Cooldown: "冷却",
    "Cast Time": "施法时间",
    "MP Cost": "MP消耗",
    "Combat Triggers": "触发器",
    "Activate when": "启动在",
    "Activate as soon as it's off cooldown": "冷却结束后立即启动",
    enemy: "敌人",
    "all enemies": "所有敌人",
    "physical damage": "物理伤害",
    "ranged damage": "远程伤害",
    "magic damage": "魔法伤害",
    "water damage": "水系伤害",
    "nature damage": "自然伤害",
    "fire damage": "火焰伤害",
    stun: "眩晕",
    silence: "沉默",
    bleed: "流血",
    burn: "燃烧",
    "total accuracy": "总精准",
    self: "自己",
    blind: "致盲",
    "Select Target Type": "选择目标类型",
    "Select Condition": "选择状态",
    "Select": "选择",
    "Casts heal on yourself": "对自己施放治疗术",
    "lowest HP ally": "HP最低的隊友",
    "all allies": "所有隊友",
    "physical amplify": "物理伤害增幅",
    "Physical Amplify": "物理伤害增幅",
    "Enemies' Total # of Active Units": "敌人的活跃单位总数",
    AND: "并且",
    "Enemies' Total Current Hp": "敌人的总当前HP",
    "Target Enemy's Current Hp": "目标敌人的当前HP",
    My: "我的",
    "Target Enemy's": "目标敌人的",
    "Enemies' Total": "敌人的总",
    "Allies' Total": "隊友的总",
    "of Active Units": "个活跃单位",
    "of Dead Units": "个死亡单位",
    "Lowest HP": "最低HP",
    "Missing Hp": "缺失HP",
    "Current Hp": "当前HP",
    "Missing Mp": "缺失MP",
    "Current Mp": "当前MP",
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
    "Weaken": "虚弱",
    "Curse": "诅咒",
    "My Missing Mp": "我的缺失MP",
    "My Missing Hp": "我的缺失HP",
    "Is Active": "已启动",
    "Is Inactive": "未启动",

    };


//2.3 货币
const tranItemCurrencies = {
    Coin: "金币",
    "Basic currency": "基础货币",
    "Task Token": "任务代币",
    "Task currency. Spend these in the Task Shop": "任务货币。在任务商店中使用这些货币",
    "Chimerical Token": "奇幻代币",
    "Chimerical Tokens": "奇幻代币",
    "Dungeon currency from the Chimerical Den. Spend these in the Shop": "地下城【奇幻洞穴】的货币。可以在商店里消费",
    "Sinister Token": "邪恶代币",
    "Sinister Tokens": "邪恶代币",
    "Dungeon currency from the Sinister Circus. Spend these in the Shop": "地下城【邪恶马戏团】的货币。可以在商店里消费",
    "Enchanted Token": "秘法代币",
    "Enchanted Tokens": "秘法代币",
    "Dungeon currency from the Enchanted Fortress. Spend these in the Shop": "地下城【秘法要塞】的货币。可以在商店里消费",
    "Pirate Token": "海盗代币",
    "Pirate Tokens": "海盗代币",
    "Dungeon currency from the Pirate Cove. Spend these in the Shop": "地下城【海盗湾】的货币。可以在商店里消费",
    Cowbell: "牛铃",
    "Premium currency. Buy or spend these in the Cowbell Store": "高级货币。在牛铃商店购买或使用这些货币",
    };

//2.4 资源(商店顺序)
const tranItemResources = {
    "Bag Of 10 Cowbells": "牛铃袋（10个）",
    "Tradable bag of 10 Cowbells. Once opened, the Cowbells can no longer be sold on the market": "可交易的牛铃袋（10个）。一旦打开，牛铃将无法在市场上出售",

    //----------------------/ 牛奶
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
    Cheese: "乳酪",
    "Verdant Cheese": "翠绿乳酪",
    "Azure Cheese": "蔚蓝乳酪",
    "Burble Cheese": "深紫乳酪",
    "Crimson Cheese": "深红乳酪",
    "Rainbow Cheese": "彩虹乳酪",
    "Holy Cheese": "神圣乳酪",

    //----------------------/ 木头
    Log: "原木",
    "Birch": "白桦",
    "Cedar": "雪松",
    "Purpleheart": "紫心",
    "Redwood": "红杉",
    "Arcane": "神秘",
     "Ginkgo": "银杏",
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

    //----------------------/ 皮革
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

    //----------------------/ 布料
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
    Orange: "柳丁",
    Plum: "李子",
    Peach: "桃子",
    "Dragon Fruit": "火龙果",
    "Star Fruit": "杨桃",

    //----------------------/ 茶叶跟豆
    "Arabica Coffee Bean": "低级咖啡豆",
    "Robusta Coffee Bean": "中级咖啡豆",
    "Liberica Coffee Bean": "高级咖啡豆",
    "Excelsa Coffee Bean": "特级咖啡豆",
    "Fieriosa Coffee Bean": "火山咖啡豆",
    "Spacia Coffee Bean": "太空咖啡豆",
    "Green Tea Leaf": "绿茶叶",
    "Black Tea Leaf": "黑茶叶",
    "Burble Tea Leaf": "紫茶叶",
    "Moolong Tea Leaf": "月亮茶叶",
    "Red Tea Leaf": "红茶叶",
    "Emp Tea Leaf": "虚空茶叶",

    //----------------------/ 催化剂
    "Catalyst Of Coinification": "点金催化剂",
    "Used in alchemy to increase the coinifying success rate by 15% (multiplicative). One catalyst is consumed on success": "用于炼金，使【点金】成功率提高15%（乘数），成功时会消耗一个。",
    "Catalyst Of Decomposition": "分解催化剂",
    "Used in alchemy to increase the decomposition success rate by 15% (multiplicative). One catalyst is consumed on success": "用于炼金，使【分解】成功率提高15%（乘数），成功时会消耗一个",
    "Catalyst Of Transmutation": "转化催化剂",
    "Used in alchemy to increase the transmutation success rate by 15% (multiplicative). One catalyst is consumed on success": "用于炼金，使【转化】成功率提高15%（乘数），成功时会消耗一个",
    "Prime Catalyst": "至高催化剂",
    "Used in alchemy to increase the success rate of any action by 25% (multiplicative). One catalyst is consumed on success": "用于炼金，使任何炼金行动的成功率提高 25%（乘数），成功时会消耗一个",

    //----------------------/ 材料
    "Snake Fang": "蛇牙",
    "Material used in smithing Snake Fang Dirk": "锻造蛇牙短剑的材料",
    "Shoebill Feather": "大嘴鹳羽毛",
    "Material used in tailoring Shoebill Shoes": "缝纫大嘴鹳鞋的材料",
    "Snail Shell": "蜗牛壳",
    "Material used in smithing Snail Shell Helmet": "锻造蜗牛壳头盔的材料",
    "Crab Pincer": "蟹钳",
    "Material used in smithing Pincer Gloves": "锻造螃蟹手套的材料",
    "Turtle Shell": "乌龟壳",
    "Material used in smithing Turtle Shell Plate Body or Legs": "锻造龟壳胸甲或腿甲的材料",
    "Marine Scale": "海洋鳞片",
    "Material used in tailoring Marine Tunic or Chaps": "缝纫海洋皮衣或皮裤的材料",
    "Treant Bark": "树皮",
    "Material used in crafting Treant Shield": "制作树人盾的材料",
    "Centaur Hoof": "半人马蹄",
    "Material used in tailoring Centaur Boots": "缝纫半人马靴的材料",
    "Luna Wing": "月神翼",
    "Material used in tailoring Luna Robe Top or Bottoms": "缝纫月神长袍或裙子的材料",
    "Gobo Rag": "哥布林破布",
    "Material used in tailoring Collector's Boots": "缝纫收藏家靴的材料",
    "Goggles": "护目镜",
    "Material used in smithing Vision Helmet": "锻造视觉头盔的材料",
    "Magnifying Glass": "放大镜",
    "Material used in smithing Vision Shield or tailoring Sighted Bracers": "锻造视觉盾或缝视觉护腕的材料",
    "Eye Of The Watcher": "观察者之眼",
    "Material used in crafting Eye Watch or Watchful Relic": "制作掌上监工或警戒遗物的材料",
    "Icy Cloth": "冰霜碎布",
    "Material used in tailoring Icy Robe Top or Bottoms": "缝纫冰霜袍服或袍裙的材料",
    "Flaming Cloth": "烈焰碎布",
    "Material used in tailoring Flaming Robe Top or Bottoms": "缝纫烈焰袍服或袍裙的材料",
    "Sorcerer's Sole": "魔法师的鞋底",
    "Material used in tailoring Sorcerer Boots": "缝纫魔法师靴的材料",
    "Chrono Sphere": "时空球",
    "Material used in tailoring Enchanted Gloves or Chrono Gloves": "缝纫附魔手套或时空手套的材料",
    "Frost Sphere": "冰霜球",
    "Material used in crafting Frost Staff": "制作冰霜法杖的材料",
    "Panda Fluff": "熊猫绒",
    "Material used in smithing Panda Gloves": "锻造熊猫手套的材料",
    "Black Bear Fluff": "黑熊绒",
    "Material used in smithing Black Bear Shoes": "锻造黑熊鞋的材料",
    "Grizzly Bear Fluff": "灰熊绒",
    "Material used in smithing Grizzly Bear Shoes": "锻造灰熊鞋的材料",
    "Polar Bear Fluff": "北极熊绒",
    "Material used in smithing Polar Bear Shoes": "锻造北极熊鞋的材料",
    "Red Panda Fluff": "小熊猫绒",
    "Material used in tailoring Red Culinary Hat or Fluffy Red Hat": "缝纫红色厨师帽或蓬松红帽的材料",
    Magnet: "磁铁",
    "Material used in smithing Magnetic Gloves": "锻造磁力手套的材料",
    "Stalactite Shard": "钟乳石碎片",
    "Material used in smithing Stalactite Spear or Spiked Bulwark": "锻造石钟长枪或尖刺盾的材料",
    "Living Granite": "花岗岩",
    "Material used in smithing Granite Bludgeon or Spiked Bulwark": "锻造花岗岩大棒或尖刺盾的材料",
    "Colossus Core": "巨像核心",
    "Material used in smithing Colossus Plate Body or Legs": "锻造巨像胸甲或腿甲的材料",
    "Vampire Fang": "吸血鬼之牙",
    "Material used in smithing Vampire Fang Dirk or crafting Vampiric Bow": "锻造吸血鬼短剑或制作吸血弓的材料",
    "Werewolf Claw": "狼人之爪",
    "Material used in smithing Werewolf Slasher or crafting Vampiric Bow": "锻造狼人关刀或制作吸血弓的材料",
    "Revenant Anima": "亡者之魂",
    "Material used in tailoring Revenant Tunic or Chaps": "缝纫亡灵皮衣或皮裤的材料",
    "Soul Fragment": "灵魂碎片",
    "Material used in crafting Soul Hunter Crossbow": "制作灵魂猎手弩的材料",
    "Infernal Ember": "地狱馀烬",
    "Material used in crafting Infernal Battlestaff": "制作炼狱法杖的材料",
    "Demonic Core": "恶魔核心",
    "Material used in smithing Demonic Plate Body or Legs": "锻造恶魔胸甲或腿甲的材料",
    "Dodocamel Plume": "渡驼之羽",
    "Material used in smithing Dodocamel Gauntlets": "锻造渡驼护手的材料",
    "Manticore Sting": "蝎狮之刺",
    "Material used in crafting Manticore Shield": "制作蝎狮盾的材料",
    "Griffin Leather": "狮鹫之皮",
    "Material used in cheesesmithing Griffin Bulwark and tailoring Griffin Tunic or Chaps": "锻造狮鹫盾跟缝纫狮鹫皮衣或皮裤的材料",
    "Jackalope Antler": "鹿角兔之角",
    "Material used in crafting Jackalope Staff": "制作鹿角兔之杖的材料",
    "Acrobat's Ribbon": "杂技师之带",
    "Material used in tailoring Acrobatic Hood": "制作杂技师兜帽的材料",
    "Griffin Talon": "狮鹫之爪",
    "Material used in smithing Griffin Bulwark": "锻造狮鹫盾的材料",
    "Magician's Cloth": "魔术师碎布",
    "Material used in tailoring Magician's Hat": "制作魔术师之帽的材料",
    "Chaotic Chain": "混沌锁链",
    "Material used in smithing Chaotic Flail": "锻造混沌连枷的材料",
    "Cursed Ball": "诅咒之球",
    "Material used in crafting Cursed Bow": "制作咒怨弓的材料",
    "Knight's Ingot": "骑士之锭",
    "Material used in smithing Knight's Aegis": "锻造骑士之盾的材料",
    "Bishop's Scroll": "主教卷轴",
    "Material used in crafting Bishop's Codex": "制作主教之书的材料",
    "Royal Cloth": "皇家碎布",
    "Material used in tailoring Royal Robe Top or Bottoms": "缝纫皇家袍服和皇家袍裙的材料",
    "Regal Jewel": "君王宝石",
    "Material used in smithing Regal Sword and Furious Spear": "锻造君王剑和狂怒长枪的材料",
    "Sundering Jewel": "裂空宝石",
    "Material used in crafting Sundering Crossbow and smithing Furious Spear": "制作裂空弩和锻造狂怒长枪的材料",
    "Butter of Proficiency":"黄油",
    "Thread Of Expertise":"线团",
    "Material used in producing special skilling outfits": "生产特殊专业服装的材料",
    "Branch of Insight":"树枝",
    "Material used in producing special skilling tools and outfits": "生产特殊专业工具和服装的材料",
    "Gluttonous Energy": "贪吃能量",
    "Used for tailoring Gluttonous Pouch": "缝纫贪吃袋",
    "Guzzling Energy": "暴饮能量",
    "Used for tailoring Guzzling Pouch": "缝纫暴饮袋",
    "Marksman Brooch": "神射胸针",
    "Material used in tailoring Marksman Bracers": "缝纫神射护腕的材料",
    "Corsair Crest": "海盗徽章",
    "Material used in smithing Corsair Helmet": "锻造海盗头盔的材料",
    "Damaged Anchor": "损坏的船锚",
    "Material used in smithing Anchorbound Plate Body or Legs": "锻造锚定胸甲或腿甲的材料",
    "Maelstrom Plating": "怒涛碎片",
    "Material used in smithing Maelstrom Plate Body or Legs": "锻造漩涡胸甲或腿甲的材料",
    "Kraken Leather": "克拉肯皮革",
    "Material used in tailoring Kraken Tunic or Chaps": "缝纫克拉肯皮衣或皮裤的材料",
    "Kraken Fang": "克拉肯毒牙",
    "Material used in crafting Rippling, Blooming, or Blazing Trident": "制作涟漪、绽放或炽焰三叉戟的材料",


    //----------------------/ 精华
    "Chimerical Essence": "奇幻精华",
    "Used for enhancing special equipment from the Chimerical Den": "用于强化奇幻洞穴特殊装备的材料",
    "Sinister Essence": "邪恶精华",
    "Used for enhancing special equipment from the Sinister Circus": "用于强化邪恶马戏团特殊装备的材料",
    "Enchanted Essence": "秘法精华",
    "Used for enhancing special equipment from the Enchanted Fortress": "用于强化秘法要塞特殊装备的材料",
    "Pirate Essence": "海盗精华",
    "Used for enhancing special equipment from the Pirate Cove": "用于强化海盗湾特殊装备的材料",
    "Milking Essence": "挤奶精华",
    "Used for brewing milking tea and crafting alchemy catalyst": "用于冲泡挤奶茶及制作炼金催化剂",
    "Foraging Essence": "採摘精华",
    "Used for brewing foraging tea and crafting alchemy catalyst": "用于冲泡採摘茶及制作炼金催化剂",
    "Woodcutting Essence": "伐木精华",
    "Used for brewing woodcutting tea and crafting alchemy catalyst": "用于冲泡伐木茶及制作炼金催化剂",
    "Cheesesmithing Essence": "乳酪锻造精华",
    "Used for brewing cheesesmithing tea and crafting alchemy catalyst": "用于冲泡乳酪锻造茶及制作炼金催化剂",
    "Crafting Essence": "制作精华",
    "Used for brewing crafting tea and crafting alchemy catalyst": "用于冲泡制作茶及制作炼金催化剂",
    "Tailoring Essence": "裁缝精华",
    "Used for brewing tailoring tea and crafting alchemy catalyst": "用于冲泡裁缝茶及制作炼金催化剂",
    "Cooking Essence": "烹饪精华",
    "Used for brewing cooking tea and crafting alchemy catalyst": "用于冲泡烹饪茶及制作炼金催化剂",
    "Brewing Essence": "冲泡精华",
    "Used for brewing brewing tea and crafting alchemy catalyst": "用于冲泡冲泡茶及制作炼金催化剂",
    "Alchemy Essence": "炼金精华",
    "Used for brewing alchemy tea and crafting alchemy catalyst": "用于冲泡炼金茶和制作炼金催化剂",
    "Enhancing Essence": "强化精华",
    "Used for brewing enhancing tea and crafting alchemy catalyst": "用于冲泡强化茶及制作炼金催化剂",
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

    //----------------------/ 石头
    "Task Crystal": "任务水晶",
    "Crystals obtained from Purple. They can be used to craft special trinkets": "从牛紫的礼物中获得的晶体。用于制作特殊的饰品",
    "Star Fragment": "星光碎片",
    "Fragments with a celestial origin found in Meteorite Caches. They can be used to craft jewelry": "存在于陨石中的天体碎片。用于制作珠宝",
    Pearl: "珍珠",
    "A shiny gem often found from Treasure Chests": "在宝箱中找到的闪亮物品",
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
    "Shard Of Protection": "保护碎片",
    "Found from Artisan's Crates. They are used for crafting Mirror of Protection": "从工匠的箱子中获得。它们用于合成保护之镜",
    "Mirror Of Protection": "保护之镜",
    "A rare artifact that functions as a copy of any equipment for enhancing protection": "一种罕见的文物，可以作为任何装备的副本，用于强化保护",
    "Philosopher's Stone": "贤者之石",
    "A legendary stone of immense melee": "传说中的石头，拥有巨大的力量",
    "Crushed Philosopher's Stone": "贤者之石碎片",
    "Used to be a piece of a philosopher's stone": "曾经是一块贤者之石",
    "Sunstone": "太阳石",
    "A shiny gem in the shape of the sun": "一颗太阳形状的闪亮宝石",
    "Crushed Sunstone": "太阳石碎片",
    "Used to be a piece of sunstone": "曾经是一块太阳石",

    //----------------------/ 精炼碎片
    "Chimerical Refinement Shard": "奇幻精炼碎片",
    "Material used in upgrading level 95 equipment and Chimerical Quiver from the Chimerical Den": "升级【奇幻洞穴】95级装备和奇幻箭袋的材料",
    "": "",
    "Sinister Refinement Shard": "邪恶精炼碎片",
    "Material used in upgrading level 95 equipment and Sinister Cape from the Sinister Circus": "升级【邪恶马戏团】95级装备和邪恶斗篷的材料",
    "": "",
    "Enchanted Refinement Shard": "秘法精炼碎片",
    "Material used in upgrading level 95 equipment and Enchanted Cloak from the Enchanted Fortress": "升级【秘法要塞】95级装备和秘法披风的材料",
    "": "",
    "Pirate Refinement Shard": "海盗精炼碎片",
    "Material used in upgrading level 95 equipment from the Pirate's Cove": "升级【海盗湾】95级装备的材料",
    "": "",

    };

//----2.4.1 消耗品
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
    "Orange Yogurt": "柳丁酸奶",
    "Plum Yogurt": "李子酸奶",
    "Peach Yogurt": "桃子酸奶",
    "Dragon Fruit Yogurt": "火龙果酸奶",
    "Star Fruit Yogurt": "杨桃酸奶",

    "Milking Tea": "挤奶茶",
    "Foraging Tea": "採摘茶",
    "Woodcutting Tea": "伐木茶",
    "Cooking Tea": "烹饪茶",
    "Brewing Tea": "冲泡茶",
    "Alchemy Tea": "炼金茶",
    "Enhancing Tea": "强化茶",
    "Cheesesmithing Tea": "乳酪锻造茶",
    "Crafting Tea": "制作茶",
    "Tailoring Tea": "裁缝茶",

    "Super Milking Tea": "超级挤奶茶",
    "Super Foraging Tea": "超级採摘茶",
    "Super Woodcutting Tea": "超级伐木茶",
    "Super Cooking Tea": "超级烹饪茶",
    "Super Brewing Tea": "超级冲泡茶",
    "Super Alchemy Tea": "超级炼金茶",
    "Super Enhancing Tea": "超级强化茶",
    "Super Cheesesmithing Tea": "超级乳酪锻造茶",
    "Super Crafting Tea": "超级制作茶",
    "Super Tailoring Tea": "超级裁缝茶",

    "Ultra Milking Tea": "究极挤奶茶",
    "Ultra Foraging Tea": "究极採摘茶",
    "Ultra Woodcutting Tea": "究极伐木茶",
    "Ultra Cooking Tea": "究极烹饪茶",
    "Ultra Brewing Tea": "究极冲泡茶",
    "Ultra Alchemy Tea": "究极炼金茶",
    "Ultra Enhancing Tea": "究极强化茶",
    "Ultra Cheesesmithing Tea": "究极乳酪锻造茶",
    "Ultra Crafting Tea": "究极制作茶",
    "Ultra Tailoring Tea": "究极裁缝茶",

    "Gathering Tea": "採集茶",
    "Gourmet Tea": "美食茶",
    "Wisdom Tea": "经验茶",
    "Processing Tea": "加工茶",
    "Efficiency Tea": "效率茶",
    "Artisan Tea": "工匠茶",
    "Blessed Tea": "祝福茶",
    "Catalytic Tea": "催化茶",

    "Stamina Coffee": "耐力咖啡",
    "Intelligence Coffee": "智力咖啡",
    "Defense Coffee": "防禦咖啡",
    "Attack Coffee": "攻击咖啡",
    "Melee Coffee": "近战咖啡",
    "Ranged Coffee": "远程咖啡",
    "Magic Coffee": "魔法咖啡",

    "Super Stamina Coffee": "超级耐力咖啡",
    "Super Intelligence Coffee": "超级智力咖啡",
    "Super Defense Coffee": "超级防禦咖啡",
    "Super Attack Coffee": "超级攻击咖啡",
    "Super Melee Coffee": "超级近战咖啡",
    "Super Ranged Coffee": "超级远程咖啡",
    "Super Magic Coffee": "超级魔法咖啡",

    "Ultra Stamina Coffee": "究极耐力咖啡",
    "Ultra Intelligence Coffee": "究极智力咖啡",
    "Ultra Defense Coffee": "究极防禦咖啡",
    "Ultra Attack Coffee": "究极攻击咖啡",
    "Ultra Melee Coffee": "究极近战咖啡",
    "Ultra Ranged Coffee": "究极远程咖啡",
    "Ultra Magic Coffee": "究极魔法咖啡",

    "Wisdom Coffee": "经验咖啡",
    "Lucky Coffee": "幸运咖啡",
    "Swiftness Coffee": "迅捷咖啡",
    "Channeling Coffee": "吟唱咖啡",
    "Critical Coffee": "暴击咖啡",
};

//----2.4.2 技能书
let tranItemBook = {
    //------------------* 矛类
    Poke: "破胆之刺",
    "Pokes the targeted enemy": "猛猛地戳向目标敌人",
    Impale: "透骨之刺",
    "Impales the targeted enemy": "猛猛地刺击目标敌人",
    Puncture: "破甲之刺",
    "Punctures the targeted enemy's armor, dealing damage and temporarily reducing its armor": "击破目标敌人的护甲，造成伤害并临时降低其护甲",
    "Penetrating Strike": "贯心之刺(贯穿)",
    "Strikes the targeted enemy. on each successful hit, will pierce and hit the next enemy": "刺击目标敌人。如果成功命中敌人，则贯穿并命中下一个敌人",

    //------------------* 剑类
    Scratch: "爪影斩",
    "Scratches the targeted enemy": "抓伤目标敌人",
    Cleave: "分裂斩（群体）",
    "Cleaves all enemies": "噼砍所有敌人",
    Maim: "血刃斩",
    "Maims the targeted enemy and causes bleeding": "划伤目标敌人使之流血",
    "Crippling Slash": "致残斩（群体）",
    "Slashes all enemies and reduce their damage": "斩击所有敌人并减少它的伤害",

    //------------------* 锤类
    Smack: "重碾",
    "Smacks the targeted enemy": "猛击目标敌人",
    Sweep: "重扫（群体）",
    "Performs a sweeping attack on all enemies": "对所有敌人进行横扫攻击",
    "Stunning Blow": "重锤",
    "Smashes the targeted enemy and has a chance to stun": "重锤目标敌人并有几率眩晕",
    "Fracturing Impact": "碎裂冲击（群体）",
    "Attacks all enemies, dealing damage and increases their damage taken": "攻击所有敌人，在造成伤害后会提升其后续所受伤害",
    "Shield Bash": "盾击",
    "Bashes the targeted enemy with a shield, dealing extra damage based on attacker's armor": "盾击目标敌人，并根据自身护甲值造成额外伤害",

    //------------------* 弓弩类
    "Quick Shot": "快速射击",
    "Takes a quick shot at the targeted enemy": "对目标敌人进行快速射击",
    "Aqua Arrow": "流水箭",
    "Shoots an arrow made of water at the targeted enemy": "对目标敌人射出水属性的箭",
    "Flame Arrow": "烈焰箭",
    "Shoots a flaming arrow at the targeted enemy": "对目标敌人射出火属性的箭",
    "Rain Of Arrows": "箭雨（群体）",
    "Shoots a rain of arrows on all enemies": "对所有敌人射出箭雨",
    "Silencing Shot": "沉默之箭",
    "Takes a shot at the targeted enemy, temporarily silencing them": "对目标敌人射击并沉默目标",
    "Steady Shot": "稳定射击",
    "Takes a shot at the targeted enemy with greatly enhanced accuracy": "以极高的精准对目标敌人进行射击",
    "Pestilent Shot": "疫病射击",
    "Shoots the targeted enemy, dealing damage and decreasing armor and resistances": "对目标敌人射击，并降低其护甲和抗性",
    "Penetrating Shot": "贯穿射击（贯穿）",

    //------------------* 水系魔法
    "Shoots the targeted enemy. on each successful hit, will pierce and hit the next enemy": "射击目标敌人。如果成功命中敌人，则贯穿并命中到下一个敌人",
    "Water Strike": "流水冲击",
    "Casts a water strike at the targeted enemy": "对目标敌人发射流水冲击",
    "Ice Spear": "冰枪术",
    "Casts an ice spear at the targeted enemy, dealing damage and reducing attack speed": "对目标敌人投掷冰矛，造成伤害并降低攻击速度",
    "Frost Surge": "冰霜爆裂（群体）",
    "Casts frost surge at all enemies, dealing damage and reducing evasion": "对所有敌人施放冰霜爆裂,造成伤害并减少闪避",
    "Mana Spring": "法力喷泉（群体）",
    "Casts mana spring at all enemies, dealing damage and increasing ally MP regeneration": "对所有敌人释放法力喷泉，造成伤害并增加友方MP回復值",

    //------------------* 自然系魔法
    Entangle: "缠绕",
    "Entangles the targeted enemy, dealing damage with chance to stun": "缠绕目标敌人，造成伤害并有几率眩晕敌人",
    "Toxic Pollen": "剧毒粉尘（群体）",
    "Casts toxic pollen at all enemies, dealing damage and decreasing armor and resistances": "对所有敌人施放剧毒粉尘，造成伤害并减少护甲和魔抗",
    "Nature's Veil": "自然菌幕（群体）",
    "Cast's a veil over all enemies, dealing damage with a chance to blind": "给所有敌人蒙上一层菌幕，造成伤害并有几率致盲",
    "Life Drain": "生命吸取",
    "Drains the life force of the targeted enemy, dealing damage and healing the caster": "吸取目标敌人的生命力，造成伤害并治疗施法者",

    //------------------* 火系魔法
    Fireball: "火球",
    "Casts a fireball at the targeted enemy": "对目标敌人施放火球",
    "Flame Blast": "熔岩爆裂（群体）",
    "Casts a flame blast at all enemies": "对所有敌人施放熔岩爆裂",
    Firestorm: "火焰风暴（群体）",
    "Casts a firestorm at all enemies": "对所有敌人施放火焰风暴",
    "Smoke Burst": "爆尘灭影",
    "Casts a smoke burst at the targeted enemy, dealing damage and decreasing their accuracy": "对目标敌人释放爆尘灭影，造成伤害并减少精准",

    //------------------* 治疗类
    "Minor Heal": "次级自愈术",
    "Casts minor heal on yourself": "对【自己】施放次级治疗术",
    Heal: "自愈术",
    "Casts heal on yourself": "对【自己】施放治疗术",
    "Quick Aid": "快速治疗术",
    "Casts heal on the ally with the lowest HP percentage": "对HP百分比最低的队友施放治疗术",
    Rejuvenate: "群体治疗术",
    "Heals all allies": "治疗所有队友",

    //------------------* 黄书类
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
    "Greatly increases elemental damage temporarily": "临时大幅增加魔法伤害",
    "Spike Shell": "尖刺防护",
    "Gains physical and elemental thorns temporarily": "临时获得物理和魔法反伤",
    "Retribution": "惩戒",
    "Gains retaliation temporarily": "临时获得反伤加成",
    Vampirism: "吸血",
    "Gains lifesteal temporarily": "临时获得生命偷取",

    //------------------* 蓝书类
    Revive: "复活",
    "Revives a dead ally": "复活一个死亡的队友",
    Insanity: "疯狂",
    "Increases damage, attack speed, and cast speed temporarily at the cost of HP": "以HP为代价，临时增加伤害、攻击速度和施法速度",
    Invincible: "无敌",
    "Tremendously increases armor, resistances, and tenacity temporarily": "临时极大增加护甲、抗性和坚韧",
    "Speed Aura": "速度光环",
    "Increases attack speed and cast speed for all allies": "增加所有队友的攻击速度和施法速度",
    "Increases attack speed and cast speed for all allies. Effect increases by (0.005x) per caster's Attack level": "增加所有队友的攻击速度和施法速度。效果随施法者攻击等级提升而增加(0.005x)",
    "Guardian Aura": "守护光环",
    "Increases healing amplify, evasion, armor, and resistances for all allies. Effect increases by (0.005x) per caster's Defense level": "增加所有队友的治疗效果、护甲和抗性。效果随施法者防御等级提升而增加(0.005x)",
    "Fierce Aura": "物理光环",
    "Increases physical amplify and armor for all allies": "增加所有队友的物理强化和护甲",
    "Increases physical amplify for all allies. Effect increases by (0.005x) per caster's Melee level": "增加所有队友的物理强化。效果随施法者近战等级提升而增加(0.005x)",
    "Critical Aura": "暴击光环",
    "Increases critical rate for all allies": "增加所有队友的暴击率",
    "Increases critical rate and critical damage for all allies. Effect increases by (0.005x) per caster's Ranged level": "增加所有队友的暴击率。效果随施法者远程等级提升而增加(0.005x)",
    "Mystic Aura": "元素光环",
    "Increases elemental amplify for all allies. Effect increases by (0.005x) per caster's Magic level": "增加所有队友的元素强化。效果随施法者魔法等级提升而增加(0.005x)",
};


//----2.4.3 鑰匙(商店順序)
const tranKeys = {

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
    "Pirate Entry Key": "海盗钥匙",
    "Pirate Chest Key": "海盗宝相钥匙",
    "Allows 1 entry into the Chimerical Den dungeon": "可进入地下城：【奇幻洞穴】1次",
    "Allows 1 entry into the Sinister Circus dungeon": "可进入地下城：【邪恶马戏团】1次",
    "Allows 1 entry into the Enchanted Fortress dungeon": "可进入地下城：【秘法要塞】1次",
    "Allows 1 entry into the Pirate cove dungeon": "可进入地下城：【海盗湾】1次",
    "Can be used to craft dungeon keys": "某种钥匙的碎片，可以制作成地下城钥匙",
    "Opens 1 Chimerical Chest": "开启一个奇幻宝箱",
    "Opens 1 Sinister Chest": "开启一个邪恶宝箱",
    "Opens 1 Enchanted Chest": "开启一个秘法宝箱",
    "Opens 1 Pirate Chest": "開啟一個海盜宝箱",

}


//----2.4.4 装备(商店顺序)
const tranItemEquipment = {
    "Gobo Stabber": "哥布林长剑",
    "Gobo Slasher": "哥布林关刀",
    "Gobo Smasher": "哥布林狼牙棒",
    "Spiked Bulwark": "尖刺盾",
    "Werewolf Slasher": "狼人关刀",
    "Gobo Shooter": "哥布林弹弓",
    "Vampiric Bow": "吸血弓",
    "Gobo Boomstick": "哥布林火枪",

    "Cheese Bulwark": "乳酪盾",
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

     "Regal Sword": "君王剑",
     "Chaotic Flail": "混沌连枷",
     "Sundering Crossbow": "裂空弩",
     "Cursed Bow": "咒怨弓",

    "Stalactite Spear": "石钟长枪",
    "Granite Bludgeon": "花岗岩大棒",
    "Furious Spear": "狂怒长枪",
    "Soul Hunter Crossbow": "灵魂猎手弩",
    "Frost Staff": "冰霜法杖",
    "Infernal Battlestaff": "炼狱法杖",

    "Cheese Sword": "乳酪剑",
    "Verdant Sword": "翠绿剑",
    "Azure Sword": "蔚蓝剑",
    "Burble Sword": "深紫剑",
    "Crimson Sword": "深红剑",
    "Rainbow Sword": "彩虹剑",
    "Holy Sword": "神圣剑",

    "Cheese Spear": "乳酪长枪",
    "Verdant Spear": "翠绿长枪",
    "Azure Spear": "蔚蓝长枪",
    "Burble Spear": "深紫长枪",
    "Crimson Spear": "深红长枪",
    "Rainbow Spear": "彩虹长枪",
    "Holy Spear": "神圣长枪",

    "Cheese Mace": "乳酪狼牙棒",
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
    "Rippling Trident": "涟漪三叉戟",
    "Blooming Trident": "绽放三叉戟",
    "Blazing Trident": "炽焰三叉戟",

    "Eye Watch": "掌上监工",
    "Snake Fang Dirk": "蛇牙短剑",
    "Vision Shield": "视觉盾",
    "Gobo Defender": "哥布林防禦者",
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

    "Cheese Buckler": "乳酪圆盾",
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
    "Corsair Helmet": "海盗头盔",
    "Acrobatic Hood": "杂技师兜帽",
    "Magician's Hat": "魔术师之帽",

    "Cheese Helmet": "乳酪头盔",
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
    "Turtle Shell Body": "龟壳胸甲",
    "Colossus Plate Body": "巨像胸甲",
    "Demonic Plate Body": "恶魔胸甲",
    "Anchorbound Plate Body": "锚定胸甲",
    "Maelstrom Plate Body": "漩涡胸甲",
    "Marine Tunic": "海洋皮衣",
    "Revenant Tunic": "亡灵皮衣",
    "Griffin Tunic": "狮鹫皮衣",
    "Icy Robe Top": "冰霜袍服",
    "Flaming Robe Top": "烈焰袍服",
    "Luna Robe Top": "月神袍服",
    "Royal Water Robe Top": "皇家流水袍服",
    "Royal Fire Robe Top": "皇家火焰袍服",
    "Royal Nature Robe Top": "皇家自然袍服",
    "From Fire":"从【火焰】改",
    "From Water":"从【流水】改",
    "From Nature":"从【自然】改",

    "Cheese Plate Body": "乳酪胸甲",
    "Verdant Plate Body": "翠绿胸甲",
    "Azure Plate Body": "蔚蓝胸甲",
    "Burble Plate Body": "深紫胸甲",
    "Crimson Plate Body": "深红胸甲",
    "Rainbow Plate Body": "彩虹胸甲",
    "Holy Plate Body": "神圣胸甲",

    "Rough Tunic": "粗糙皮衣",
    "Reptile Tunic": "爬行动物皮衣",
    "Gobo Tunic": "哥布林皮衣",
    "Beast Tunic": "野兽皮衣",
    "Umbral Tunic": "暗影皮衣",
    "Kraken Tunic": "克拉肯皮衣",

    "Cotton Robe Top": "棉布上衣",
    "Linen Robe Top": "亚麻上衣",
    "Bamboo Robe Top": "竹上衣",
    "Silk Robe Top": "丝绸上衣",
    "Radiant Robe Top": "光辉上衣",

    "Dairyhand's Top": "挤奶工的上衣",
    "Forager's Top": "採摘工的上衣",
    "Lumberjack's Top": "伐木工的上衣",
    "Cheesemaker's Top": "乳酪师的上衣",
    "Crafter's Top": "工匠的上衣",
    "Tailor's Top": "裁缝师的上衣",
    "Chef's Top": "厨师的上衣",
    "Brewer's Top": "酿造师的上衣",
    "Alchemist's Top": "炼金师的上衣",
    "Enhancer's Top": "强化师的上衣",

    "Turtle Shell Legs": "龟壳腿甲",
    "Colossus Plate Legs": "巨像腿甲",
    "Demonic Plate Legs": "恶魔腿甲",
    "Anchorbound Plate Legs": "锚定腿甲",
    "Maelstrom Plate Legs": "漩涡腿甲",

    "Marine Chaps": "海洋皮裤",
    "Revenant Chaps": "亡灵皮裤",
    "Griffin Chaps": "狮鹫皮裤",
    "Kraken Chaps": "克拉肯皮裤",

    "Icy Robe Bottoms": "冰霜袍袍裙",
    "Flaming Robe Bottoms": "烈焰袍裙",
    "Luna Robe Bottoms": "月神袍裙",
    "Royal Water Robe Bottoms": "皇家流水袍裙",
    "Royal Fire Robe Bottoms": "皇家火焰袍裙",
    "Royal Nature Robe Bottoms": "皇家自然袍裙",

    "Cheese Plate Legs": "乳酪腿甲",
    "Verdant Plate Legs": "翠绿腿甲",
    "Azure Plate Legs": "蔚蓝腿甲",
    "Burble Plate Legs": "深紫腿甲",
    "Crimson Plate Legs": "深红腿甲",
    "Rainbow Plate Legs": "彩虹腿甲",
    "Holy Plate Legs": "神圣腿甲",

    "Rough Chaps": "粗糙皮裤",
    "Reptile Chaps": "爬行动物皮裤",
    "Gobo Chaps": "哥布林皮裤",
    "Beast Chaps": "野兽皮裤",
    "Umbral Chaps": "暗影皮裤",

    "Cotton Robe Bottoms": "棉下衣",
    "Linen Robe Bottoms": "亚麻下衣",
    "Bamboo Robe Bottoms": "竹布下衣",
    "Silk Robe Bottoms": "丝绸下衣",
    "Radiant Robe Bottoms": "光辉下衣",

    "Dairyhand's Bottoms": "挤奶工的下衣",
    "Forager's Bottoms": "採摘工的下衣",
    "Lumberjack's Bottoms": "伐木工的下衣",
    "Cheesemaker's Bottoms": "乳酪师的下衣",
    "Crafter's Bottoms": "工匠的下衣",
    "Tailor's Bottoms": "裁缝师的下衣",
    "Chef's Bottoms": "厨师的下衣",
    "Brewer's Bottoms": "酿造师的下衣",
    "Alchemist's Bottoms": "炼金师的下衣",
    "Enhancer's Bottoms": "强化师的下衣",

    "Dairyhand's Bottom": "挤奶工的下衣",
    "Forager's Bottom": "採摘工的下衣",
    "Lumberjack's Bottom": "伐木工的下衣",
    "Cheesemaker's Bottom": "乳酪师的下衣",
    "Crafter's Bottom": "工匠的下衣",
    "Tailor's Bottom": "裁缝师的下衣",
    "Chef's Bottom": "厨师的下衣",
    "Brewer's Bottom": "酿造师的下衣",
    "Alchemist's Bottom": "炼金师的下衣",
    "Enhancer's Bottom": "强化师的下衣",


    "Enchanted Gloves": "附魔手套",
    "Pincer Gloves": "螯钳手套",
    "Panda Gloves": "熊猫手套",
    "Magnetic Gloves": "磁力手套",
    "Sighted Bracers": "瞄准护腕",
    "Marksman Bracers": "神射护腕",
    "Chrono Gloves": "时空手套",
    "Dodocamel Gauntlets": "渡驼护手",

    "Cheese Gauntlets": "乳酪护手",
    "Verdant Gauntlets": "翠绿护手",
    "Azure Gauntlets": "蔚蓝护手",
    "Burble Gauntlets": "深紫护手",
    "Crimson Gauntlets": "深红护手",
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

    "Collectors Boots": "收藏家靴",
    "Collector's Boots": "收藏家靴",
    "Shoebill Shoes": "大嘴鹳鞋",
    "Black Bear Shoes": "黑熊鞋",
    "Grizzly Bear Shoes": "灰熊鞋",
    "Polar Bear Shoes": "北极熊鞋",
    "Centaur Boots": "半人马靴",
    "Sorcerer Boots": "巫师靴",

    "Cheese Boots": "乳酪靴",
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

    "Small Pouch": "小袋子",
    "Medium Pouch": "中袋子",
    "Large Pouch": "大袋子",
    "Giant Pouch": "巨大袋子",
    "Gluttonous Pouch": "贪吃袋",
    "Guzzling Pouch": "暴饮袋",

    "Chimerical Quiver": "奇幻箭袋",
    "Enchanted Cloak": "秘法披风",
    "Sinister Cape": "邪恶斗篷",

    "Basic Task Badge": "基础任务徽章",
    "Advanced Task Badge": "高级任务徽章",
    "Expert Task Badge": "专家任务徽章",

    "Dodocamel Gauntlets (R)": "渡驼护手 (特)",
    "Marksman Bracers (R)": "神射护腕 (特)",
    "Griffin Chaps (R)": "狮鹫皮裤 (特)",
    "Kraken Chaps (R)": "克拉肯皮裤 (特)",
    "Anchorbound Plate Legs (R)": "锚定腿甲 (特)",
    "Maelstrom Plate Legs (R)": "漩涡腿甲 (特)",
    "Kraken Tunic (R)": "克拉肯皮衣 (特)",
    "Anchorbound Plate Body (R)": "锚定胸甲 (特)",
    "Maelstrom Plate Body (R)": "漩涡胸甲 (特)",
    "Royal Water Robe Top (R)": "皇家流水袍服 (特)",
    "Royal Fire Robe Top (R)": "皇家火焰袍服 (特)",
    "Royal Nature Robe Top (R)": "皇家自然袍服 (特)",
    "Royal Water Robe Bottoms (R)": "皇家流水袍裙 (特)",
    "Royal Fire Robe Bottoms (R)": "皇家火焰袍裙 (特)",
    "Royal Nature Robe Bottoms (R)": "皇家自然袍裙 (特)",
    "Corsair Helmet (R)": "海盗头盔 (特)",
    "Acrobatic Hood (R)": "杂技师兜帽 (特)",
    "Magician's Hat (R)": "魔术师之帽 (特)",
    "Knight's Aegis (R)": "骑士盾 (特)",
    "Rippling Trident (R)": "涟漪三叉戟 (特)",
    "Blooming Trident (R)": "绽放三叉戟 (特)",
    "Blazing Trident (R)": "炽焰三叉戟 (特)",
    "Regal Sword (R)": "君王剑 (特)",
    "Chaotic Flail (R)": "混沌连枷 (特)",
    "Furious Spear (R)": "狂怒长枪 (特)",
    "Sundering Crossbow (R)": "裂空弩 (特)",
    "Cursed Bow (R)": "咒怨弓 (特)",
    "Bishop's Codex (R)": "主教之书 (特) ",
    "Griffin Bulwark (R)": "狮鹫盾 (特)",

    "Chimerical Quiver (R)": "奇幻箭袋 (特)",
    "Enchanted Cloak (R)": "秘法披风 (特)",
    "Sinister Cape (R)": "邪恶斗篷 (特)",

};

//----2.4.5 饰品(商店顺序)

const tranAccessories = {

    "Necklace Of Efficiency": "效率项鍊",
    "Fighter Necklace": "战士项鍊",
    "Ranger Necklace": "游侠项鍊",
    "Wizard Necklace": "巫师项鍊",
    "Necklace Of Wisdom": "经验项鍊",
    "Necklace Of Speed": "速度项鍊",
    "Philosopher's Necklace": "贤者项鍊",

    "Earrings Of Gathering": "采集耳环",
    "Earrings Of Essence Find": "精华发现耳环",
    "Earrings Of Armor": "护甲耳环",
    "Earrings Of Regeneration": "恢复耳环",
    "Earrings Of Resistance": "抗性耳环",
    "Earrings Of Rare Find": "稀有发现耳环",
    "Earrings Of Threat": "威胁耳环",
    "Earrings Of Critical Strike": "暴击耳环",
    "Philosopher's Earrings": "贤者耳环",

    "Ring Of Gathering": "采集戒指",
    "Ring Of Essence Find":"精华发现戒指",
    "Ring Of Regeneration": "恢复戒指",
    "Ring Of Armor": "护甲戒指",
    "Ring Of Resistance": "抗性戒指",
    "Ring Of Rare Find": "稀有发现戒指",
    "Ring Of Threat": "威胁戒指",
    "Ring Of Critical Strike": "暴击戒指",
    "Philosopher's Ring": "贤者戒指",

    "Trainee Milking Charm": "实习挤奶护符",
    "Basic Milking Charm": "基础挤奶护符",
    "Advanced Milking Charm": "高级挤奶护符",
    "Expert Milking Charm": "专家挤奶护符",
    "Master Milking Charm": "大师挤奶护符",
    "Grandmaster Milking Charm": "宗师挤奶护符",

    "Trainee Foraging Charm": "实习采摘护符",
    "Basic Foraging Charm": "基础采摘护符",
    "Advanced Foraging Charm": "高级采摘护符",
    "Expert Foraging Charm": "专家采摘护符",
    "Master Foraging Charm": "大师采摘护符",
    "Grandmaster Foraging Charm": "宗师采摘护符",

    "Trainee Woodcutting Charm": "实习伐木护符",
    "Basic Woodcutting Charm": "基础伐木护符",
    "Advanced Woodcutting Charm": "高级伐木护符",
    "Expert Woodcutting Charm": "专家伐木护符",
    "Master Woodcutting Charm": "大师伐木护符",
    "Grandmaster Woodcutting Charm": "宗师伐木护符",

    "Trainee Cheesesmithing Charm": "实习制作护符",
    "Basic Cheesesmithing Charm": "基础制作护符",
    "Advanced Cheesesmithing Charm": "高级制作护符",
    "Expert Cheesesmithing Charm": "专家制作护符",
    "Master Cheesesmithing Charm": "大师制作护符",
    "Grandmaster Cheesesmithing Charm": "宗师制作护符",

    "Trainee Tailoring Charm": "实习裁缝护符",
    "Basic Tailoring Charm": "基础裁缝护符",
    "Advanced Tailoring Charm": "高级裁缝护符",
    "Expert Tailoring Charm": "专家裁缝护符",
    "Master Tailoring Charm": "大师裁缝护符",
    "Grandmaster Tailoring Charm": "宗师裁缝护符",

    "Trainee Cooking Charm": "实习烹饪护符",
    "Basic Cooking Charm": "基础烹饪护符",
    "Advanced Cooking Charm": "高级烹饪护符",
    "Expert Cooking Charm": "专家烹饪护符",
    "Master Cooking Charm": "大师烹饪护符",
    "Grandmaster Cooking Charm": "宗师烹饪护符",

    "Trainee Brewing Charm": "实习冲泡护符",
    "Basic Brewing Charm": "基础冲泡护符",
    "Advanced Brewing Charm": "高级冲泡护符",
    "Expert Brewing Charm": "专家冲泡护符",
    "Master Brewing Charm": "大师冲泡护符",
    "Grandmaster Brewing Charm": "宗师冲泡护符",

    "Trainee Alchemy Charm": "实习炼金护符",
    "Basic Alchemy Charm": "基础炼金护符",
    "Advanced Alchemy Charm": "高级炼金护符",
    "Expert Alchemy Charm": "专家炼金护符",
    "Master Alchemy Charm": "大师炼金护符",
    "Grandmaster Alchemy Charm": "宗师炼金护符",

    "Trainee Enhancing Charm": "实习强化护符",
    "Basic Enhancing Charm": "基础强化护符",
    "Advanced Enhancing Charm": "高级强化护符",
    "Expert Enhancing Charm": "专家强化护符",
    "Master Enhancing Charm": "大师强化护符",
    "Grandmaster Enhancing Charm": "宗师强化护符",

    "Trainee Crafting Charm": "实习制作护符",
    "Basic Crafting Charm": "基础制作护符",
    "Advanced Crafting Charm": "高级制作护符",
    "Expert Crafting Charm": "专家制作护符",
    "Master Crafting Charm": "大师制作护符",
    "Grandmaster Crafting Charm": "宗师制作护符",

    "Trainee Stamina Charm": "实习耐力护符",
    "Basic Stamina Charm": "基础耐力护符",
    "Advanced Stamina Charm": "高级耐力护符",
    "Expert Stamina Charm": "专家耐力护符",
    "Master Stamina Charm": "大师耐力护符",
    "Grandmaster Stamina Charm": "宗师耐力护符",

    "Trainee Intelligence Charm": "实习智力护符",
    "Basic Intelligence Charm": "基础智力护符",
    "Advanced Intelligence Charm": "高级智力护符",
    "Expert Intelligence Charm": "专家智力护符",
    "Master Intelligence Charm": "大师智力护符",
    "Grandmaster Intelligence Charm": "宗师智力护符",

    "Trainee Attack Charm": "实习攻击护符",
    "Basic Attack Charm": "基础攻击护符",
    "Advanced Attack Charm": "高级攻击护符",
    "Expert Attack Charm": "专家攻击护符",
    "Master Attack Charm": "大师攻击护符",
    "Grandmaster Attack Charm": "宗师攻击护符",

    "Trainee Defense Charm": "实习防御护符",
    "Basic Defense Charm": "基础防御护符",
    "Advanced Defense Charm": "高级防御护符",
    "Expert Defense Charm": "专家防御护符",
    "Master Defense Charm": "大师防御护符",
    "Grandmaster Defense Charm": "宗师防御护符",

    "Trainee Melee Charm": "实习近战护符",
    "Basic Melee Charm": "基础近战护符",
    "Advanced Melee Charm": "高级近战护符",
    "Expert Melee Charm": "专家近战护符",
    "Master Melee Charm": "大师近战护符",
    "Grandmaster Melee Charm": "宗师近战护符",

    "Trainee Ranged Charm": "实习远程护符",
    "Basic Ranged Charm": "基础远程护符",
    "Advanced Ranged Charm": "高级远程护符",
    "Expert Ranged Charm": "专家远程护符",
    "Master Ranged Charm": "大师远程护符",
    "Grandmaster Ranged Charm": "宗师远程护符",

    "Trainee Magic Charm": "实习魔法护符",
    "Basic Magic Charm": "基础魔法护符",
    "Advanced Magic Charm": "高级魔法护符",
    "Expert Magic Charm": "专家魔法护符",
    "Master Magic Charm": "大师魔法护符",
    "Grandmaster Magic Charm": "宗师魔法护符"

}



//----2.4.6 工具(商店顺序)
const tranItemTool = {
    "Celestial Brush": "星空刷子",
    "Cheese Brush": "乳酪刷子",
    "Verdant Brush": "翠绿刷子",
    "Azure Brush": "蔚蓝刷子",
    "Burble Brush": "深紫刷子",
    "Crimson Brush": "深红刷子",
    "Rainbow Brush": "彩虹刷子",
    "Holy Brush": "神圣刷子",

    "Celestial Shears": "星空剪刀",
    "Cheese Shears": "乳酪剪刀",
    "Verdant Shears": "翠绿剪刀",
    "Azure Shears": "蔚蓝剪刀",
    "Burble Shears": "深紫剪刀",
    "Crimson Shears": "深红剪刀",
    "Rainbow Shears": "彩虹剪刀",
    "Holy Shears": "神圣剪刀",

    "Celestial Hatchet": "星空斧头",
    "Cheese Hatchet": "乳酪斧头",
    "Verdant Hatchet": "翠绿斧头",
    "Azure Hatchet": "蔚蓝斧头",
    "Burble Hatchet": "深紫斧头",
    "Crimson Hatchet": "深红斧头",
    "Rainbow Hatchet": "彩虹斧头",
    "Holy Hatchet": "神圣斧头",

    "Celestial Hammer": "星空锤子",
    "Cheese Hammer": "乳酪锤",
    "Verdant Hammer": "翠绿锤",
    "Azure Hammer": "蔚蓝锤",
    "Burble Hammer": "深紫锤",
    "Crimson Hammer": "深红锤",
    "Rainbow Hammer": "彩虹锤",
    "Holy Hammer": "神圣锤",

    "Celestial Chisel": "星空凿子",
    "Cheese Chisel": "乳酪凿子",
    "Verdant Chisel": "翠绿凿子",
    "Azure Chisel": "蔚蓝凿子",
    "Burble Chisel": "深紫凿子",
    "Crimson Chisel": "深红凿子",
    "Rainbow Chisel": "彩虹凿子",
    "Holy Chisel": "神圣凿子",

    "Celestial Spatula": "星空铲子",
    "Cheese Spatula": "乳酪铲子",
    "Verdant Spatula": "翠绿铲子",
    "Azure Spatula": "蔚蓝铲子",
    "Burble Spatula": "深紫铲子",
    "Crimson Spatula": "深红铲子",
    "Rainbow Spatula": "彩虹铲子",
    "Holy Spatula": "神圣铲子",

    "Celestial Needle": "星空针",
    "Cheese Needle": "乳酪针",
    "Verdant Needle": "翠绿针",
    "Azure Needle": "蔚蓝针",
    "Burble Needle": "深紫针",
    "Crimson Needle": "深红针",
    "Rainbow Needle": "彩虹针",
    "Holy Needle": "神圣针",

    "Celestial Pot": "星空锅",
    "Cheese Pot": "乳酪锅",
    "Verdant Pot": "翠绿锅",
    "Azure Pot": "蔚蓝锅",
    "Burble Pot": "深紫锅",
    "Crimson Pot": "深红锅",
    "Rainbow Pot": "彩虹锅",
    "Holy Pot": "神圣锅",

    "Celestial Alembic": "星空蒸馏器",
    "Cheese Alembic": "乳酪蒸馏器",
    "Verdant Alembic": "翠绿蒸馏器",
    "Azure Alembic": "蔚蓝蒸馏器",
    "Burble Alembic": "深紫蒸馏器",
    "Crimson Alembic": "深红蒸馏器",
    "Rainbow Alembic": "彩虹蒸馏器",
    "Holy Alembic": "神圣蒸馏器",

    "Celestial Enhancer": "星空强化器",
    "Cheese Enhancer": "乳酪强化器",
    "Verdant Enhancer": "翠绿强化器",
    "Azure Enhancer": "蔚蓝强化器",
    "Burble Enhancer": "深紫强化器",
    "Crimson Enhancer": "赤红强化器",
    "Rainbow Enhancer": "彩虹强化器",
    "Holy Enhancer": "神圣强化器",

};



//2.5 宝箱
let tranItemBox = {
    "Purple's Gift": "牛紫的礼物",
    "Gifted by Purple after earning task points. Looks like it contains items inside": "用任务点兑换的奖励，看起来里面装着物品",

    "Small Meteorite Cache": "陨石【小】",
    "Medium Meteorite Cache": "陨石【中】",
    "Large Meteorite Cache": "陨石【大】",
    "Can be found while gathering. Looks like it contains items inside": "採集时可以找到，看起来里面装着物品",

    "Small Artisan's Crate": "工匠的箱子【小】",
    "Medium Artisan's Crate": "工匠的箱子【中】",
    "Large Artisan's Crate": "工匠的箱子【大】",
    "Can be found during production skills. Looks like it contains items inside": "生产时可以找到，看起来里面装着物品",

    "Small Treasure Chest": "宝箱【小】",
    "Medium Treasure Chest": "宝箱【中】",
    "Large Treasure Chest": "宝箱【大】",
    "Can be found from monsters. Looks like it contains items inside": "从怪物身上找到，看起来里面装着物品",

    "Chimerical Chest": "奇幻宝箱",
    "Received from completion of the Chimerical Den dungeon. Can be opened with Chimerical Chest Key": "攻克地下城★【奇幻洞穴】的奖励，使用【奇幻宝箱钥匙】打开",
    "Sinister Chest": "邪恶宝箱",
    "Received from completion of the Sinister Circus dungeon. Can be opened with Sinister Chest Key": "攻克地下城★【邪恶马戏团】的奖励，使用【邪恶宝箱钥匙】打开",
    "Enchanted Chest": "秘法宝箱",
    "Received from completion of the Enchanted Fortress dungeon. Can be opened with Enchanted Chest Key": "攻克地下城★【秘法要塞】的奖励，使用【秘法宝箱钥匙】打开",
    "Pirate Chest": "海盗宝箱",
    "Received from completion of the Pirate Cove dungeon. Can be opened with Pirate Chest Key": "攻克地下城★【海盗湾】的奖励，使用【海盗宝箱钥匙】打开",

    "Chimerical Refinement Chest": "奇幻精炼宝箱",
    "Received from completion of Chimerical Den dungeon (T1+). Can be opened with Chimerical Chest Key": "攻克地下城★【奇幻洞穴】（T1+）的奖励，使用【奇幻宝箱钥匙】打开",
    "Sinister Refinement Chest": "邪恶精炼宝箱",
    "Received from completion of Sinister Circus dungeon (T1+). Can be opened with Sinister Chest Key": "攻克地下城★【邪恶马戏团】（T1+）的奖励，使用【邪恶宝箱钥匙】打开",
    "Enchanted Refinement Chest": "秘法精炼宝箱",
    "Received from completion of Enchanted Fortress dungeon (T1+). Can be opened with Enchanted Chest Key": "攻克地下城★【秘法要塞】（T1+）的奖励，使用【秘法宝箱钥匙】打开",
    "Pirate Refinement Chest": "海盗精炼宝箱",
    "Received from completion of Pirate Cove dungeon (T1+). Can be opened with Pirate Chest Key": "攻克地下城★【海盗湾】（T1+）的奖励，使用【海盗宝箱钥匙】打开",

};

//2.6 怪物
let tranMonster = {
    //----------------* 批量模拟
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

    //----------------* 臭臭星球
    "Smelly Planet": "臭臭星球",
    "Smelly Planet Elite": "臭臭星球(精英)",
    Fly: "苍蝇",
    Jerry: "杰瑞",
    Skunk: "臭鼬",
    Porcupine: "豪猪",
    Slimy: "史莱姆",

    //----------------* 沼泽星球
    "Swamp Planet": "沼泽星球",
    "Swamp Planet Elite": "沼泽星球(精英)",
    Frogger: "青蛙",
    Thnake: "蛇",
    Swampy: "蜘蛛",
    Sherlock: "鳄鱼",
    "Giant Shoebill": "大嘴鹳",

    //----------------* 海洋星球
    "Aqua Planet": "海洋星球",
    "Aqua Planet Elite": "海洋星球(精英)",
    Gary: "蜗牛",
    "I Pinch": "螃蟹",
    Aquahorse: "海马",
    "Nom Nom": "鲫鱼",
    Turuto: "乌龟",
    "Marine Huntress": "海洋猎手",

    //----------------* 丛林星球
    "Jungle Planet": "丛林星球",
    "Jungle Planet Elite": "丛林星球(精英)",
    "Jungle Sprite": "丛林精灵",
    Myconid: "蘑菇人",
    Treant: "树人",
    "Centaur Archer": "半人马弓箭手",
    "Luna Empress": "月神之蝶",

    //----------------* 哥布林星球
    "Gobo Planet": "哥布林星球",
    "Gobo Planet Elite": "哥布林星球(精英)",
    Stabby: "哥布林穿刺手",
    Slashy: "哥布林战士",
    Smashy: "哥布林大锤手",
    Shooty: "哥布林弓箭手",
    Boomy: "哥布林法师",
    "Gobo Chieftain": "哥布林酋长",

    //----------------* 眼球星球
    "Planet Of The Eyes": "眼球星球",
    "Planet Of The Eyes Elite": "眼球星球(精英)",
    Eye: "独眼",
    Eyes: "竖眼",
    Veyes: "複眼",
    "The Watcher": "观察者",

    //----------------* 巫师之塔
    "Sorcerer's Tower": "巫师之塔",
    "Sorcerer's Tower Elite": "巫师之塔(精英)",
    "Sorcerers Tower": "巫师之塔",
    "Sorcerers Tower Elite": "巫师之塔(精英)",
    "Novice Sorcerer": "新手巫师",
    "Ice Sorcerer": "冰霜巫师",
    "Flame Sorcerer": "火焰巫师",
    Elementalist: "元素法师",
    "Chronofrost Sorcerer": "时空霜巫",

    //----------------* 熊熊星球
    "Bear With It": "熊熊星球",
    "Bear With It Elite": "熊熊星球(精英)",
    "Gummy Bear": "果冻熊",
    Panda: "熊猫",
    "Black Bear": "黑熊",
    "Grizzly Bear": "灰熊",
    "Polar Bear": "北极熊",
    "Red Panda": "小熊猫",

    //----------------* 魔像洞穴
    "Golem Cave": "魔像洞穴",
    "Golem Cave Elite": "魔像洞穴(精英)",
    "Magnetic Golem": "磁力魔像",
    "Stalactite Golem": "钟乳石魔像",
    "Granite Golem": "花岗岩魔像",
    "Crystal Colossus": "水晶巨像",

    //----------------* 暮光之地
    "Twilight Zone": "暮光之地",
    "Twilight Zone Elite": "暮光之地(精英)",
    Zombie: "僵尸",
    Vampire: "吸血鬼",
    Werewolf: "狼人",
    "Dusk Revenant": "黄昏亡灵",

    //----------------* 地狱深渊
    "Infernal Abyss": "地狱深渊",
    "Infernal Abyss Elite": "地狱深渊(精英)",
    "Abyssal Imp": "深渊小鬼",
    "Soul Hunter": "灵魂猎手",
    "Infernal Warlock": "地狱术士",
    "Demonic Overlord": "恶魔霸主",

    //----------------* 奇幻洞穴
    "Chimerical Den": "奇幻洞穴",
    "Received from completion of the Chimerical Den dungeon": "通关奇幻洞穴的战利品",
    "Butterjerry": "蝶鼠",
    "Jackalope": "鹿角兔",
    "Dodocamel": "渡驼",
    "Manticore": "蝎狮",
    "Griffin": "狮鹫",

    //----------------* 邪恶马戏团
    "Sinister Circus": "邪恶马戏团",
    "Received from completion of the Sinister Circus dungeon": "通关邪恶马戏团的战利品",
    "Rabid Rabbit": "疯魔兔",
    "Zombie Bear": "僵尸熊",
    "Acrobat": "杂技师",
    "Juggler": "杂耍者",
    "Magician": "魔术师",
    "Deranged Jester": "小丑皇",

    //----------------* 秘法要塞
    "Enchanted Fortress": "秘法要塞",
    "Received from completion of the Enchanted Fortress dungeon": "通关秘法要塞的战利品",
    "Enchanted Pawn": "秘法之兵",
    "Enchanted Knight": "秘法之马",
    "Enchanted Bishop": "秘法之相",
    "Enchanted Rook": "秘法之车",
    "Enchanted Queen": "秘法之后",
    "Enchanted King": "秘法之王",

    //------------------* 海盜灣
    "Pirate Cove": "海盗湾",
    "Squawker": "鹦鹉",
    "Anchor Shark": "锚鲨水手",
    "Brine Marksman": "海洋观测士",
    "Tidal Conjuror": "潮汐大副",
    "Captain fishhook": "虎喵船长",
    "The Kraken": "克拉肯",



};

//2.7 状态类
const tranState = {

    HP: "HP",
    MP: "MP",
    "HP Restore": "HP回復",
    "HP over 30s": "【30秒内回復】",
    "MP Restore": "MP回復",
    "MP over 30s": "【30秒内回復】",
    "Foraging Level": "採摘等级",
    "Buffs foraging level": "增益採摘等级",
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
    "Cheesesmithing Level": "乳酪锻造等级",
    "Buffs cheesesmithing level": "增益乳酪锻造等级",
    "Crafting Level": "制作等级",
    "Buffs crafting level": "增益制作等级",
    "Tailoring Level": "裁缝等级",
    "Buffs tailoring level": "增益裁缝等级",

    Gathering: "採集类",
    Gourmet: "美食",
    "Chance to produce an additional item for free": "有机会额外获得一个免费物品",
    Processing: "加工",
    "Chance to instantly convert gathered resource into processed material": "有机会立即将採集的资源转化为加工材料",
    "cheese, fabric, and lumber": "乳酪、织物和木材",
    Artisan: "工匠",
    "Reduces required materials during production": "减少生产过程中所需材料",
    "Alchemy Success": "炼金成功",
    "Multiplicative bonus to success rate while alchemizing": "在炼金时对成功率的乘法加成",
    "Action Level": "行动等级",
    "Increases required levels for the action": "增加行动所需等级",
    Blessed: "祝福",
    "Chance to gain +2 instead of +1 on enhancing success": "有机会在强化成功时获得+2而不是+1",
    "Stamina Level": "耐力等级",
    "Buffs stamina level": "增加耐力等级",
    "Increases HP regeneration": "增加HP回復速度",
    "Intelligence Level": "智力等级",
    "Buffs intelligence level": "增加智力等级",
    "Increases MP regeneration": "增加MP回復速度",
    "Defense Level": "防禦等级",
    "Buffs defense level": "增加防禦等级",
    "Attack Level": "攻击等级",
    "Buffs attack level": "增加攻击等级",
    "melee Level": "近战等级",
    "Buffs melee level": "增加近战等级",
    "Ranged Level": "远程等级",
    "Buffs ranged level": "增加远程等级",
    "Magic Level": "魔法等级",
    "Buffs magic level": "增加魔法等级",
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

    "Primary Training": "主修训练",
    "Focus Training": "专注训练",
    "Defense Experience": "防御经验",
    "Magic Experience": "魔法经验",
    "Melee Experience": "近战经验",
    "Ranged Experience": "远程经验",
    "Stamina Experience": "耐力经验",
    "Intelligence Experience": "智力经验",
    "Attack Experience": "攻击经验",
    "Ability Damage": "技能伤害",
    "Defensive Smash Damage": "防御钝击伤害",

    "Stab Accuracy": "刺击精准",
    "Stab Damage": "刺击伤害",
    "Slash Accuracy": "斩击精准",
    "Slash Damage": "斩击伤害",
    "Smash Accuracy": "钝击精准",
    "Smash Damage": "钝击伤害",
    "Magic Accuracy": "魔法精准",
    "Ranged Accuracy": "远程精准",
    "Nature Penetration": "自然属性穿透",
    "Fire Penetration": "火属性穿透",
    "Water Penetration": "水属性穿透",
    "Water Amplify": "水属性强化",
    "Fire Amplify": "火属性强化",
    "Nature Amplify": "自然属性强化",
    "Healing Amplify": "治疗强化",
    "Milking Efficiency": "挤奶效率",
    "Foraging Efficiency": "採摘效率",
    "Woodcutting Efficiency": "伐木效率",
    "Cheesesmithing Efficiency": "乳酪锻造效率",
    "Crafting Efficiency": "制作效率",
    "Tailoring Efficiency": "裁缝效率",
    "Cooking Efficiency": "烹饪效率",
    "Brewing Efficiency": "冲泡效率",
    "Skilling Efficiency": "专业效率",
    "Skilling Speed": "专业速度",
    "Armor Penetration": "护甲穿透",
    Global: "全域",

    "View Cowbell Store": "查看牛铃商店",
    "Dropped By Monsters": "怪物掉落",
    "Almost all monsters drop coins": "几乎所有的怪物都会掉落金币",
    "Dropped By Elite Monsters": "精英怪物掉落",
    "Looted From Container": "获取自箱子",
    "Food Slots": "食物槽位",
    "Drink Slots": "饮料槽位",
    "Food Haste": "食物急速",
    "Drink Concentration": "饮料浓度",
    Loots: "战利品",
    "Open To Loot": "战利品",
    "Rare Drop From": "稀有掉落自",
    "Any low level gathering actions": "任何低级採集类行动",
    "Any medium level gathering actions": "任何中级採集类行动",
    "Any high level gathering actions": "任何高级採集类行动",
    "Any low level production, alchemy, and enhancing actions": "任何低级生产、炼金及强化类行动",
    "Any medium level production, alchemy, and enhancing actions": "任何中级生产、炼金及强化类行动",
    "Any high level production, alchemy, and enhancing actions": "任何高级生产、炼金及强化类行动",
    "Any low level monster in normal combat": "普通战斗中的任意低级怪物",
    "Any medium level monsters in normal combat": "普通战斗中的任意中级怪物",
    "Any high level monsters in normal combat": "普通战斗中的任意高级怪物",

    // 物品的说明
    "Any Milking action": "任何挤奶动作",
    "Any Foraging action": "任何采摘动作",
    "Any Woodcutting action": "任何伐木动作",
    "Any Cheesesmithing action": "任何乳酪锻造动作",
    "Any Crafting action": "任何制作动作",
    "Any tailoring action": "任何裁缝动作",
    "Any cooking action": "任何烹饪动作",
    "Any brewing action": "任何冲泡动作",
    "Any Alchemy action": "任何炼金动作",
    "Any enhancing action": "任何强化动作",
    "Used For Cooking": "用于烹饪",
    "Used For Brewing": "用于冲泡",
    "Used For Crafting": "用于制作",
    "Gathered From": "获取自採集",
    "Produced From": "产自",
    "Produced From Cheesesmithing": "产自奶酪锻造",
    "Produced From Crafting": "产自制作",
    "Produced From Tailoring": "产自裁缝",
    "Produced From Cooking": "产自烹饪",
    "Produced From Brewing": "产自冲泡",
    "Produced From Alchemy": "产自炼金",
    "Produced From Enhancing": "产自强化",
    "Used For Cheesesmithing": "用于乳酪锻造",
    "Used For Tailoring": "用于裁缝",
    "Transmuted From(Alchemy": "转化自（炼金  ",
    "Decomposed From(Alchemy": "分解自（炼金  ",
    "Decomposes Into(Alchemy": "分解（炼金  ",
    "Transmutes Into(Alchemy": "转化（炼金  ",
    Drops: "掉落",

};

//2.8 mo9通行證

let tranMoopass = {

   "MooPass": "Moo卡",
    "MooPass Perks": "Moo卡福利",
    "Character MooPass": "角色Moo卡",
    "Account MooPass": "帐号Moo卡",
    "Continue to Purchase": "继续购买",
    "limited to Standard character": "限标准角色",
    "Hour Offline Progress Limit": "小时离线进度上限",
    "Market Listing Limit": "市场挂单上限",
    "Action Queue Limit": "行动队列上限",
    "Task Slot Limit": "任务槽位上限",
    "Free Task Reroll": "免费任务重置",
    "Loot Tracker of last 20 activities": "最后 20 个行动的掉落记录",
    "Golden Avatar Border": "金色角色边框",
    "All Characters": "所有角色",
    "DAY MooPas": "天Moo卡",
    "Year MooPass": "年Moo卡",
    "MooPass grants a number of helpful but non-essential": "Moo卡提供多种实用但不影响主要体验的",
    "Perks": "福利",
    "Activate the Free 14-Day MooPass? This is a one time gift. If MooPass is already active, it will be extended by 14 days": "激活14天免费Moo卡? 这是一次性赠送。如果Moo卡已经激活，将延长14天。",
    "Day MooPass Gift": "Moo卡赠送",
    "Buy MooPass": "购买Moo卡",
    "Grants": "获得",
    Granted: "获得",
    "Purchase completed": "完成购买",
    "days of MooPass": "天Moo卡",
    "per task": "每个任务",

};



//3.0 其他
let tranOther = {

    Mention: "提及@",
    Profile: "个人资料",
    Block: "屏蔽",
    report: "举报",
    "Confirm Block": "确认屏蔽",
    "Blocked character": "已屏蔽",
    "View at Social -> Block List": "查看【社交】->【黑名单】",

    //------------- 频道
    General: "常规",
    Trade: "交易",
    Recruit: "招募",
    Beginner: "新手",
    party: "队伍",
    Whisper: "私聊",
    Send: "发送",
    "Game Rules": "游戏规则",
    "You need at least 200 total level or 1,000,000 XP to use general chat": "你需要至少200总等级或1,000,000经验值才能使用常规聊天",
    "General channel is for game-related discussions and friendly chats. To maintain a positive and respectful atmosphere, please adhere to the":
        "常规频道用于游戏相关讨论和友好聊天。为了保持积极和尊重的氛围，请遵守",
    "Trade channel is for advertising item trading and services. Please use whispers for conversations and negotiations":
        "交易频道用于广告物品交易和服务。对话和谈判时请使用私聊",
    "Recruit channel is for advertising guild/party recruitment and players seeking to join a guild/party. Please use whispers for conversations":
        "招募频道用于宣传公会/队伍招募和寻找加入公会/队伍的玩家。请使用私聊进行对话",
    "Feel free to ask questions or chat with other players here. Useful links": "请随意在此处提问或与其他玩家聊天。有用的连接",
    'You can whisper other players using the command "/w [playerName] [message]" or simply click on a player\'s name and select whisper':
        '你可以使用命令 "/w [玩家名称] [消息]" 来私聊其他玩家，或者直接点击玩家名称并选择私聊',
    "Are you sure you want to open an external link": "您确定要开启外部连结吗",
    "This party does not match your game mode": "您的游戏模式不适合这个队伍",
    "This party is no longer recruiting": "队伍已满，不再接受新成员。",

    //------------- 设置
    //------------------/ 个人资料
    Game: "游戏",
    Account: "帐户",
    Preview: "预览",
    "View My Profile": "查看我的个人资料",
    "Chat Icon": "聊天图标",
    "None Owned": "未拥有",
    Unlock: "解锁",
    "Name Color": "名称颜色",
    "Online Status": "线上状态",
    Public: "公开",
    Show: "显示",
    "Game Mode": "游戏模式",
    "Offline Progress": "离线进度",
    actions: "操作",
    Repeat: "重複",
    "Task Slots": "任务槽",
    "Party Members Only": "仅限队友",
    "Delete Character": "删除角色",
    "Show Deletion Instructions": "删除说明",


    //------------------/ 游戏
    "Display Language": "显示语言",
    "General Chat": "国际频道",
    "Non-English Language Chat": "非英语语言频道",
    "Ironcow Chat": "铁牛频道",
    "Trade Chat": "交易频道",
    "Recruit Chat": "招募频道",
    "Beginner Chat": "新手频道",
    "Total Level Message": "总等级消息",
    "Skill Level Message": "专业等级消息",
    "Community Buff Message": "社区增益消息",
    "Chat URL Warning": "聊天网址警告",
    "Profanity Filter": "髒话筛检器",
    "CSS Animation": "CSS动画",


    //------------------/ 帐户
    "Account Type": "帐户类型",
    "Registered User": "注册用户",
    "Current Password": "当前密码",
    Email: "邮箱",
    "New Password": "新密码",
    "Confirm Password": "确认密码",
    Hide: "隐藏",
    Private: "私密",


    //------------- 社交
    Friends: "好友",
    Referrals: "推荐",
    "Block List": "黑名单",
    "Add Friend": "添加好友",
    "Friends/Guildmates": "好友/公会成员",
    Activity: "活动",
    Online: "线上",
    Offline: "离线",
    "When someone signs up using your referral link, you'll be eligible for the following rewards": "当有人使用你的推荐连结注册时，你将有资格获得以下奖励",
    Additional: "再加",
    "if they reach Total Level": "如果他们总等级达到",
    "of any Cowbells they purchase": "他们购买的任何牛铃",
    "Copy Link": "複製连结",
    "Link Copied":"连结已複製",
    "So far": "到目前为止，已经有",
    "players have signed up using your referral link": "位玩家使用你的推荐连结注册",
    "A referred player reached Total Level": "推荐的玩家总等级达到",
    "A referred player made a purchase": "推荐的玩家完成了一笔消费",
    "Block Player": "屏蔽玩家",
    "Blocked Players": "被屏蔽的玩家",
    "A new player joined with your referral link. Thanks for sharing": "一位新玩家透过您的推荐连结加入了，感谢分享",

    //-------------- 公会
    "Create Guild": "创建公会",
    "You can create a guild for 5M coins. A guild currently provides the following features":
    "您可以通过投资5M金币创建自己的公会。公会目前提供以下功能",
    "Guild chat channel and notice board":
    "公会聊天频道和公告栏",
    "Guild will receive XP and level up as members gain XP in any skill at a ratio of":
    "当成员在任意专业中获得 XP 时，公会将获得 XP 并升级,经验获得依比例为",
    "member slots and 1 additional slot for every 3 guild levels":
    "个成员槽，并且增加一个槽位于每提升3个公会等级",
    "Roles can be assigned":
    "可分配的职务分别是",
    "Leader, General, Officer, Member":
    "会长,将军, 官员,成员",
    "You can also be invited to existing guilds. Use the Recruit chat channel to find a guild to join. Received invitations will be displayed below":
    "您也可以被邀请加入到现有的公会。在招募聊天频道寻找要加入的公会。收到的邀请将显示在下方",

    //-------------- 商店(含牛铃)
    Dungeon:"地下城",
    "Dungeons": "地下城",
    "Supporter Points": "支持者点数",
    "Fame Points": "名望点数",
    "Buy Cowbells": "购买牛铃",
    "Upgrade purchased": "购买升级",
    "Minimum Quantity": "最小数量",
    "Click continue to proceed to our payment processor in a new window": "点击继续 ▶ 跳转至支付平台视窗",
    Convenience: "便利性升级",
    "Chat Icons": "聊天图标",
    "Avatars": "头像",
    Avatar: "头像",
    "Avatar Outfit": "头像服装",
    Unlocked: "已解锁",
    Seasonal: "季节限定",
    "Click any of the colors to see a preview with your name. Unlocked colors can be changed in Settings -> Profile": "点击任意颜色以查看带有你名字的预览。解锁的颜色可以在设置 -> 个人资料中更改",
    "Buy Avatar": "购买头像",
    "Buy Avatar Outfit": "购买头像服装",
    "Click any of the avatars to see a larger preview. Unlocked avatars can be changed in Settings -> Profile": "点击任意头像以查看更大尺寸的预览。已解锁的头像可以在设置 -> 个人资料中更改",
    "Click any of the outfits to see a preview with your avatar. Unlocked outfits can be changed in Settings -> Profile": "点击任意头像服装以查看与你头像所搭配的预览效果。已解锁的服装可以在设置 -> 个人资料中更改",
    "Community buffs are bonuses granted to all players on the server. For every Cowbell spent on community buffs, you will gain 1 fame point. Fame points are ranked on the leaderboard": "社区增益是提供给服务器上所有玩家的福利。每花费一个牛铃用于社区增益，你就能获得 1 点声望值。声望值会按照高低在排行榜上进行排名",
    "Unlock More Avatars": "解锁更多头像",
    "Unlock More Outfits": "解锁更多服装",
    "Name Colors": "名称颜色",
    "Community Buffs": "社区加成",
    "Name Change": "更改名称",
    "Cowbells can be purchased to help support the game. You can use them to buy convenience upgrades, chat icons, name colors, avatars, avatar outfits, community buffs, or change your name":
        "你可以购买牛铃来支持这款游戏。此外牛铃还能购买便利性升级、聊天图标、名称颜色、头像、头像服装、社区加成，或者更改你的名字。",
    NOTE: "注意",
    "Purchased Cowbells will appear in your inventory as Bags of 10 Cowbells which can be sold on the market (18% coin tax) to other players. Once opened, they are no longer tradable":
        "购买的牛铃将以10个牛铃的袋子出现在你的库存中，可以在市场上（带有18%金币税）卖给其他玩家。一旦打开，就无法再进行交易",
    "A new tab will be opened to process the purchase": "将打开一个新标籤页进行购买",
    Continue: "继续",
    "Buy Convenience Upgrade": "购买便利性升级",
    "Quantity (Limit": "数量（限制",
    "You don't have enough cowbells": "你没有足够的牛铃",
    "After Purchase": "购买后",
    "Hours Offline Progress": "小时数离线进度",
    "Buy Chat Icon": "购买聊天图标",
    "Buy Name Color": "购买名称颜色",
    "Buy Community Buff": "购买社区增益",
    "Minutes to Add": "要添加的分钟数",
    "Minutes To Add For Next Level": "升级所需分钟数",
    "Select Currency": "选择货币",
    USD: "美元",
    EUR: "欧元",
    "Upgrades permanently increases limits. Your current limits can be viewed in Settings": "升级永久增加上限。你当前的上限可以在设置中查看",
    "Increase offline progress limit": "增加离线进度上限",
    "Hour Offline Progress": "每小时离线进度",
    "Buy limit": "购买限制",
    "Increase loadout slot limit": "增加配装槽上限",
    "Action Queue": "动作伫列",
    "Increase action queue limit": "增加动作伫列上限",
    "Market Listing": "市场清单",
    "Increase market listing limit": "增加市场清单上限",
    "Task Slot": "任务槽",
    "Increase task slot limit": "增加任务槽上限",
    "Loadout Slot": "配装槽",
    "Limit": "上限",
    "Loadout Slots": "配装槽",

    //----------------------/ 聊天图标
    "Chat icons are displayed in front of your name in the chat. Unlocked chat icons can be changed in Settings -> Profile":
        "聊天图标显示在聊天中你的名称前面。已解锁的聊天图标可以在设置 -> 个人资料中更改",
    "Jack-o'-lantern":"杰克灯笼",
    "Spring Festival Lantern":"春节灯笼",
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
    "Custom Chat Icon": "定制聊天图标",
    "You can request a custom chat icon for the cost of 100K Supporter Points and 20,000 Cowbells. The icon can be requested via #new-ticket on Discord. The icon will be based on a concept or image you provide and will be designed by our artist to fit the style and color theme of the game. It must not contain copyrighted content":
        "你可以花费 100k 支持者点数和 20,000 牛铃来申请一个自定义聊天图标。可以通过在 Discord 的 #new-ticket 来提交申请。该图标将依据你提供的概念或图片来制作，并且会由我们的美工人员按照游戏的风格和色彩主题进行设计。但是图标不得包含受版权保护的内容",
    "K Supporter Points": "K 支持者点数",

    //----------------------/ 名称颜色
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
    "Custom Name Color": "定制名称颜色",
    "You can request a custom name color for the cost of 75,000 Supporter Points and 15,000 Cowbells. The color can be requested via #new-ticket on Discord. The name color can consist of a color gradient and optionally a subtle glow effect":
        "你可以花费 75,000 支持者积分和 15,000 牛铃来申请自定义名称颜色。可以通过在 Discord 的 #new-ticket 来提交颜色申请。该颜色可以是渐变色，并且可选择添加轻微的发光效果",
    "Custom Avatar": "定制头像",
    "You can request a custom avatar for the cost of 250K Supporter Points and 50,000 Cowbells. The avatar can be requested via #new-ticket on Discord. The avatar will be based on a concept or image you provide and will be designed by our artist to fit the style and color theme of the game. It must not contain copyrighted content":
        "你可以花费 100k 支持者点数和 50,000 牛铃来申请一个自定义头像。可以通过在 Discord 的 #new-ticket 来提交头像申请。该头像将基于你提供的概念或图片来制作，并且会由我们的美工人员按照游戏的风格和色彩主题进行设计。但是头像不得包含受版权保护的内容",
    "Custom Avatar Outfit": "定制头像服装",
    "You can request a custom avatar outfit for the cost of 150K Supporter Points and 30,000 Cowbells. The outfit can be requested via #new-ticket on Discord. The outfit will be based on a concept or image you provide and will be designed by our artist to fit the style and color theme of the game. It must not contain copyrighted content":
        "你可以花费 150k 支持者积分和 30,000 牛铃来申请一套自定义的头像服装。可以通过在 Discord 的 #new-ticket 来提交服装申请。这套服饰将依据你提供的概念或图片来设计，并且会由我们的美工人员按照游戏的风格和色彩主题进行创作。但是服装不得包含受版权保护的内容",
    "Fame Leaderboard": "名望排行榜",
    "Opt In": "选择加入",
    "Opt Out": "选择退出",

    Experience: "经验",
    Minute: "分钟",
    "Gathering Quantity": "採集数量",
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
    "coin tax) to other players. Once opened, they are no longer tradable": "的金币税)卖给其他玩家。一旦打开，它们将无法再进行交易",
    Name: "名称",
    Standard: "标准",
    Ironcow: "铁牛",
    "Legacy Ironcow": "传统铁牛",
    "Updates every 20 minutes": "每20分钟更新一次",
    Rank: "排名",

    Enabled: "已启用",
    On: "开",

    "Idle User": "閒置成员",
    Remove: "移除",
    Overview: "概览",
    Members: "成员",
    Manage: "管理",
    "Guild Level": "公会等级",
    "Guild Experience": "公会经验",
    "Guild Members": "公会成员",
    "Guild Invitation": "邀请公会",
    "Exp to Level Up": "升级所需经验",
    "Invited by": "受邀自",
    Decline: "拒绝",
    Edit: "编辑",
    "Invite to Guild": "邀请加入公会",
    "Guild joined": "已加入公会",
    "Guild Exp": "公会经验",
    Leader: "会长",
    Officer: "官员",
    Hidden: "隐藏",
    Member: "成员",
    "You can leave the guild. There are no penalties for leaving": "你可以随意退出公会,而不会受到任何惩罚",
    "Leave Guild": "离开公会",
    "Battle Info": "战斗资讯",
    Stats: "统计资料",
    "Combat Duration": "战斗时长",
    Deaths: "死亡次数",
    "Items looted": "掠夺的物品",
    "Drop Quantity": "掉落数量",
    Skill: "专业",
    Unfriend: "解除好友关係",
    "Confirm Unfriend": "确认解除好友关係",
    Promote: "晋升",
    Demote: "降级",
    Kick: "踢出",
    "Available At Price": "在这个价格可用",


    //-------------- 指引
    //----------------------/ 常见问题
    "FAQ": "常见问题",
    "How does offline progress work": "离线也能玩吗",
    "Your character continues to make progress even when you're offline. A new player gets up to 10 hours of offline progress anytime you close the browser or go offline. You can extend this time with convenience upgrades available in the Cowbell Store":
        "即使您离线，您的角色也会继续取得进展。预设情况下，每次关闭流览器或离线时，您可以获得最多10小时的离线进度。然而，您可以在牛铃商店购买便捷升级来延长这一时间",
    "Can I log in from another device": "我可以从其他设备登录吗",
    "If you have registered an account, you can log in from any device using your email and password. If you are playing as a guest, you can find your guest password in Settings and use it to log in with your username":
        "如果您已注册帐户，您可以使用您的电子邮件和密码从任何设备登录。如果您以游客身份玩游戏，您可以在设置中找到您的游客密码并使用它与您的用户名一起登录",

    "Can I play the game without an internet connection or as a single player": "我可以在没有互联网连接或单人模式下玩游戏吗",
    "No, you must be connected to the internet to play the game. However, you do continue to make progress while offline for up to 10 hours by default. If you prefer to not interact with other players, you can collapse the chat and choose not to use the marketplace":"不，您必须连接互联网才能玩游戏。然而，预设情况下，即使离线，您也会继续取得进展，最多可达10小时。如果您不想与其他玩家互动，您可以折叠聊天视窗并选择不使用市场",

    "Can I change my username":"我可以更改用户名吗",
    "Yes, you can change your username by going to the Cowbell Store and clicking on the \"Name Change\" tab. It costs 500 cowbells to change your username":"是的，您可以通过前往牛铃商店并点击\"更改名称\"标籤来更改您的用户名。更改用户名需要花费500个牛铃",

    "How can I get a chat icon or different name color":"我怎样才能获得聊天图标或不同的名字颜色",
    "You can purchase a chat icon or name color from the Cowbell Store using cowbells. You can change your displayed icon and color in Settings":"您可以使用牛铃在牛铃商店购买聊天图标或名字颜色。您可以在设置中更改显示的图标和颜色",

    "How do I send a private message to another player":"我如何向其他玩家发送私信",
    "To send a private message to another player, click on their name next to their chat message and click \"Whisper\". You can also use the chat command \"/w player_name chat_message":"要向另一位玩家发送私信，请点击他们的聊天消息旁边的名字，然后点击\"私聊\"。您也可以使用聊天命令\"/w 玩家名 聊天消息",
    "You can also use the chat command":"您也可以使用聊天命令",
    "What is the action queue":"什么是动作伫列",
    "The action queue is a feature that allows you to set up a sequence of actions for your character to perform. To use it, click the \"Add Queue\" button instead of \"Start\". Queue slots can be unlocked or upgraded from the Cowbell Store":"动作伫列是一项功能，允许您设置一连串的动作供您的角色执行。要使用它，请点击'添加伫列'按钮而不是'开始'。伫列槽可以在牛铃商店解锁或升级",
    "How do I block another player":"我如何屏蔽其他玩家",
    "To block a player and stop seeing their chat messages, click on their name next to their message and click \"Block\". You can also use the chat command \"/block player_name\". You can find your block list in the Settings menu and unblock players from the list":
        "若要封锁玩家并停止查看其聊天讯息，请点击其讯息旁边的玩家姓名，然后点击「封锁」。您也可以使用聊天指令「/block player_name」。您可以在「社交」选单中找到您的\"黑名单\"，并从清单中解除封锁玩家",

    Gameplay:"游戏玩法",

    "What are cowbells and how can I get more":"什么是牛铃？我怎样才能获得",
    "Cowbells are the premium currency of the game. They allow players to purchase convenience upgrades, cosmetics, community buffs that benefit the whole server, and name changes. There are three ways to get Cowbells":"牛铃是游戏的高级货币。它们允许玩家购买便利升级、装饰品、惠及整个伺服器的社区增益和更改名称。有三种方式可以获得牛铃",
    "Finish the tutorial":"完成教程",
    "You will receive 80 cowbells as a reward":"您将获得80个牛铃作为奖励",
    "Rare drops":"稀有掉落",
    "You have a chance to get cowbells from rare loot boxes found while skilling or battling enemies in combat":"在使用专业或战斗中击败敌人时，您有机会从战利品箱中获得牛铃",
    "Purchase from Cowbell Store":"在牛铃商店购买",
    "You can purchase cowbells with real money from the Cowbell Store to help support the game":"您可以用现金在牛铃商店购买牛铃以支援游戏",
    "Buy from the marketplace":"在市场上购买",
    "You can buy tradable \"Bag of 10 Cowbells\" with coins from other players in the Marketplace":"您可以用游戏内的货币从其他玩家那里购买可交易的“10个牛铃袋”",

    "What are rare drops":"什么是稀有掉落",
    "Rare drops are loot boxes that can be obtained while engaging in different activities in the game":"稀有掉落是指在游戏中进行不同活动时可以获得的战利品箱",
    "Gathering skills":"採集专业",
    "You get meteorite caches which contain star fragments":"您可以获得包含星光碎片的陨石",
    "Production skills, alchemy, and enhancing":"生产专业，炼金和强化",
    "You get artisan's crates which contain shards of protection and gems":"您可以获得包含保护碎片和宝石的工匠箱",
    Combat:"战斗",
    "You get treasure chests which contain gems":"您可以获得包含宝石的宝箱",
    "All boxes also contain coins and occasionally cowbells. You get larger boxes when doing higher level skills or from higher level enemies":
        "所有箱子还包含金币，有时也包含牛铃.进行高级专业或击败高级敌人时，您会获得更大的箱子",

    "What are gems used for":"宝石有什么用",
    "Gems can be used to craft different jewelry that gives small bonuses. Additionally, you can crush gems into smaller pieces with the Crafting skill and use them to brew stronger versions of coffee and tea. Gems can be obtained from treasure chests in combat":
        "宝石可以用来制作不同的珠宝，提供小额加成。此外，您可以使用制作专业将宝石粉碎成小块，用它们来酿造更强版本的咖啡和茶。宝石可以从战斗中的宝箱中获得",

    "Where do I get tea leaves":"我在哪里可以获得茶叶",
    "You can get tea leaves from defeating enemies in combat. When viewing combat zones, you can hover over an enemy (long press on mobile) to see what items it drops. Tea leaves are an essential ingredient for brewing tea, which can buff non-combat skills":
        "您可以通过在战斗中击败敌人获得茶叶。在查看战斗区域时，您可以将滑鼠悬停在敌人上（移动设备上长按）查看它掉落的物品。茶叶是冲泡茶的重要成分，可以增强非战斗的专业",

    "What are essences":"什么是精华",
    "Essences are used to enhance special equipment with the Enhancing skill. Enemies from each combat zone drop a different type of essence":
        "精华用于通过强化专业来强化特殊装备。每个战斗区域的敌人都会掉落不同类型的精华",


    //---------------------/ 採集类
    "Milking magical cows yields different types of milk, which can be used in a various ways":
        "挤奶可以得到不同类型的牛奶，每种奶都有多种用途。",
    "Milk can be turned into cheese, which can then be used to craft melee equipment or skilling tools":
        "牛奶可以製成乳酪，然后用于制作近战装备或生产工具。",
    "Milk is an essential ingredient for many recipes":
        "牛奶是许多蛋糕或者酸奶的必不可少的原料。",
    "Milk is used in a small number of coffee and tea recipes":
        "牛奶在少数咖啡和茶的配方中使用。",
    "You can help magical cows produce milk faster by equipping a brush":
        "您可以通过装备刷子来帮助牛更快地产奶。",

    "Foraging allows you to gather different resources from various areas. You can forage for a specific item in an area or forage the entire area to get a bit of everything":
        "採摘允许您从各个地区收集不同的资源。您可以在特定区域採集特定物品。",
    "Foraged resources can be used in":
        "採摘的资源可以用于",
    "Eggs, wheat, sugar, berries, and fruits are essential ingredients for many recipes":
        "鸡蛋、小麦、糖、浆果和水果是许多食谱的必不可少的成分。",
    "Berries, fruits, and coffee beans are used to brew coffee and tea":
        "浆果、水果和咖啡豆用于冲泡咖啡和茶。",
    "Flax, bamboo branches, cocoons, and other materials can be processed into fabric to make magical clothing":
        "亚麻、竹子、茧等材料可以加工成面料，用于裁缝。",
    "You can increase foraging speed by equipping shears":
        "您可以通过装备剪刀来增加採摘速度。",

    "You can chop logs from different kinds of trees":
        "您可以从不同种类的树木上砍伐木材。",
    "Logs can be used in":
        "木材可以用于",
    "Logs are part of the recipe for making a number of melee weapons and skilling tools":
        "木材是制作许多近战武器和专业工具的配方的一部分。",
    "Logs can be processed into lumber to craft ranged and magic weapons":
        "木材可以加工成木材，用于制作弓弩和法杖。",
    "You can increase woodcutting speed by equipping a hatchet":
        "您可以通过装备斧头来增加砍伐速度。",

    "Level Bonus":"等级碾压加成",
    "You gain 1% efficiency bonus for each level you have above the action's level requirement":
        "您每超过操作等级要求一级，就会获得1%的效率加成。",


    //---------------------/ 生产类
    "Production":"生产类",
    "Cheesesmithing is the process of creating melee equipment and skilling tools":
        "经由奶酪锻造可以制作近战装备和专业的工具",
    "Milk is processed into different tiers of cheese. The cheese is then used (sometimes in combination with other resources) to craft equipment. Equipment can be upgraded into higher tiers as you level up":
        "牛奶会被加工成不同等级的奶酪。然后这些奶酪被用于（有时会与其他资源一起）制作成装备。随着等级提升，装备可以升级到更高级别",
    "You can increase cheesesmithing speed by equipping a hammer":
        "您可以通过装备锤子来增加乳酪锻造的速度。",

    "Crafting produces a variety of items, including ranged and magic weapons, jewelry, and other special resources":
    "制作生产各种物品，包括远程和魔法武器、珠宝和其他特殊资源。",
    "Logs can be processed into different tiers of lumber, which is then used to craft ranged and magic weapons":
        "木材可以加工成不同等级的木材，然后用于制作弓弩和魔法武器。",
    "Jewelry can be crafted using star fragments and gems, which are rare drops found while gathering or from combat":
        "珠宝可以使用星光碎片和宝石制作，这些都是在採集或战斗中发现的稀有掉落物品。",
    "You can increase crafting speed by equipping a chisel":
        "您可以通过装备凿子来增加制作速度。",

    "Tailoring produces ranged and magic clothing as well as pouches":
        "裁缝生产远程和魔法服装以及袋子。",
    "Raw resources from foraging, such as flax, bamboo branches, and cocoons, can be processed into fabric. Hides from combat enemies can also be processed into leather":
        "来自採摘的原始资源，如亚麻、竹子和茧，可以加工成布料。来自怪物的毛皮也可以被加工为皮革",
    "Fabric is primarily used to make magic clothing, such as robes and hats, while leather is used to make ranged clothing, such as leather armor and boots":
        "布料主要用于制作魔法服装，如长袍和帽子，而皮革则用于制作弓手服装。",
    "In addition to clothing, you can craft pouches which increase your maximum HP and MP in combat. Pouches also provide additional consumable slots for both skilling and combat":
        "除了服装，您还可以制作袋子，它们可以增加您在战斗中的最大HP和MP。袋子还提供额外的消耗品（战斗+非战斗）槽位",
    "You can increase sewing speed by equipping a needle":
        "您可以通过装备针来增加缝製速度。",

    "Cooking produces food that can be used during combat":
        "烹饪生产可以在战斗中使用的食物。",
    "Donuts and cakes restore HP, while gummies and yogurt restore MP":
        "甜甜圈和蛋糕回復HP，而软糖和酸奶回復MP。",
    "You can increase cooking speed by equipping a spatula":
        "您可以通过装备铲子来增加烹饪速度。",
    "Brewing produces drinks that provide buffs with limited durations":
        "冲泡生产提供具有有限持续时间的增益效果的饮品。",
    "Coffee can be consumed during combat to improve combat-related stats, while tea can be consumed to improve non-combat skills":
        "咖啡可以在战斗中消耗以提高与战斗相关的统计资料，而茶可以在非战斗情况下消耗以提高生产专业",
    "You can increase brewing speed by equipping a pot":
        "您可以通过装备锅来增加冲泡速度。",


    //---------------------/ 炼金
    "Alchemy allows you to transform items into other items using the actions Coinify, Decompose, or Transmute. Each action has a different success rate, and the input item and coin cost will always be consumed regardless of success or failure":
        "炼金可让您使用 【点金】、【分解】或【转化】将物品转换为其他物品。每个动作都有不同的成功率，无论成功或失败，输入的物品和金币成本都会被消耗",
    "Coinify lets you to convert items into coins. The amount of coins received is 5 times the item's sell price. The base success rate is":
        "【点金】可以让您将物品转换成金币。所获得的金币数量为商品售价的 5 倍。基础成功率为",
    "Decompose lets you to break down items. Equipment can be turned into their base components, and non-equipment items can be turned into skilling essences. Decomposing enhanced equipment yields bonus enhancing essences, with the quantity doubling for each enhancement level. The base success rate is":
        "【分解】可让您分解物品。装备可以转化为基础组件，非装备的物品可以转化为专业精华。分解强化过的装备会产生额外的强化精华，每强化一级则数量加倍。基础成功率为",
    "Transmute lets you to change items into other related items or rare uniques, such as the Philosopher's Stone. The base success rate varies depending on the item being transmuted":
        "【转化】可让您将物品转换为其他相关物品或稀有的独特物品，例如贤者之石。基础成功率会根据转换的物品而变化",
    "The base success rate depends on the alchemy action and the specific item being alchemized. If your Alchemy skill level is lower than the item's level, there will be a penalty to the success rate. The success rate can be increased by using catalysts and catalytic tea":
        "基本成功率取决于炼金行动和炼金的具体物品。如果你的炼金专业等级低于物品等级，成功率将会受到惩罚。使用催化剂和催化茶可以提高成功率",
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
    Recommended: "推荐",

    //---------------------/ 强化
    "Enhancing is the process of increasing the stats of any equipment, such as armor, weapons, tools, pouches, or jewelry. When you successfully enhance an equipment, its enhancement level increases by 1. However, if the enhancement process fails, the level is reset to":
        "强化是增加任何装备数值的过程，例如盔甲、武器、工具、袋子或珠宝。当你成功强化一件装备时，其强化等级会增加1。然而，如果强化过程失败，等级将被重置为",
    "The success rate of enhancing depends on several factors, including your enhancing skill level, the tier of the equipment, and the equipment's current enhancement level. Generally, the higher the tier and enhancement level of the equipment, the lower the success rate will be. Equipping an enhancer can improve your success rate":
        "强化的成功率取决于几个因素，包括你的强化专业水准、装备的品级和当前的强化等级。通常情况下，装备的品级和强化等级越高，成功率就越低。装备一个强化器可以提高你的成功率。",
    "You gain 1% action speed bonus for each level you have above the item's item level. The item level is usually the same as the level requirement to equip, but it may be different for some special items such as jewelry":
        "你会因为每个等级超过物品等级的等级而获得1%的强化速度加成。物品等级通常与装备所需的等级相同，但对于一些特殊物品，比如珠宝，可能会有所不同。",
    "The protection mechanic is a feature that allows players to use copies of the base equipment, mirrors of protection, or crafting components (for special equipment only) to add protection to each enhancing attempt. If the enhancement fails, the equipment's level is only decreased by 1, but 1 protection item is consumed. This can be a cost-effective way to reach high enhancement levels for endgame players":
        "保护机制是允许玩家在每次强化尝试中使用另一件相同装备或者保护之镜，或者（仅适用于特殊装备的）制作元件来进行强化保护（俗称“垫子”）。如果强化失败，装备的等级只会降低1级，但会消耗1个保护物品。对于后期玩家来说，这是一种经济高效的方式来达到高等级的强化。",
    "You gain 1% action speed bonus for each level you have above the item's recommended level":
        "高于该物品推荐等级的每一个等级都会获得 1% 的行动速度加成",
    "Here is a list of steps to follow when enhancing equipment":
        "以下是强化装备时要遵循的步骤清单",
    "Select the piece of equipment that you want to enhance":
        "选择要强化的装备",
    "Set the target enhancement level that you would like to stop at. Be realistic about what level you can reach with your current resources":
        "理智地设置您希望停止的目标级别。",
    "Decide whether or not to use protection. If you do then select the protection item and a minimum enhancement level where protection will be used. Generally, protection is more cost-effective when the item is at higher enhancement levels":
        "决定是否使用保护。如果是，则选择垫子和开始使用垫子的级别",
    "Click the \"Start\" button and you will continue enhancing until you reach the target level or run out of materials":
        "点击“开始”按钮，您将开始强化，直到达到目标级别或耗尽材料",
    "The bonus stats on enhanced equipment are a percentage of the base stats. The total bonus at each enhancement level is as follows":
        "强化装备上的额外数值是基础数值的百分比。强化百分比如下所示",
    "As an exception, accessories, back slot, and trinket slot enhancements receives 5x the normal bonus. For instance, a +1 enhancement on accessories is a 10% bonus":
        "作为例外，配件、披风强化和饰品强化，获得的奖励是正常奖励的 5 倍。例如，配件 +1 强化就是 10% 的加成",
    "Enhancement Base Success Rate":
        "强化基础成功率",

    //----------------------/ 战斗
    "Fighting aliens can earn you coins, tea leaves, hides, essences, ability books, gems, and special items, as well as more common resources. There are enemies of varying difficulty located in different combat areas":
        "与各星球的敌人战斗可以让你获得金币、茶叶、兽皮、精华、能力书、宝石和特殊物品，以及各种常见的资源。不同星球中有各种难度的敌人",

    "Wearing equipment will boost your stats in combat. You can equip items directly from the inventory or by clicking equipment slots in the equipment tab next to the inventory":
        "穿戴装备可以在战斗中提升你的属性。你可以直接从库存中装备物品，也可以通过点击位于库存旁边的装备选项卡中的装备槽来装备物品",

    "Food can be consumed to recover your HP or MP. Drinks provide limited duration buffs. Upgrading your pouch allows you to carry more food and drinks into battle":
        "可以食用食物来回復您的HP或MP。饮料提供有限持续时间的增益效果。升级您的袋子允许同时使用多种食物和饮品",

    "You can learn abilities and use them in combat at the cost of MP. To unlock new abilities, you must learn them from ability books. Abilities get stronger as you level them up. You gain 0.1 XP every time it's used in combat. You can also gain a large amount of XP by consuming duplicate ability books":
        "你可以学习技能并在战斗中使用它们，但要消耗MP。要解锁新能力，您必须从技能书中学习它们。着技能等级的提升，技能会变得更强。每次在战斗中使用技能会获得0.1经验值。您也可以通过消耗重復的技能书来获得大量经验值。",

    "When multiple abilities are available for use during combat, they will be prioritized in the same order you have set them":
        "在战斗中有多个可用的技能时，它们将按照你设置的从左到右的顺序进行释放。",

    "Your Intelligence level determines how many abilities you can bring with you":
        "您的智力等级决定了您可以携带多少技能。",

    "Both consumables and abilities have default settings for when they will be automatically used. The settings are referred to as combat triggers, and they can be modified by clicking the gear icon below before entering the battle":
        "消耗品和技能都有默认设置，用于确定它们何时会自动使用。这些设置被称为触发器，可以在进入战斗之前点击下方的齿轮图标进行修改。",
    "and Respawning":
        "及復活",
    "When defeated in combat, your character will have to wait through a respawn timer before fully recovering and resuming combat automatically":
        "每当战斗中阵亡了，你的角色将等待重生计时器结束，然后才能完全回復并自动重新开始战斗。",

    "You have 7 combat skills that can be leveled up":
        "您有7种可以升级的战斗专业。",

    "Increases your accuracy, attack speed, and cast speed": "提高你的命中、攻击速度和施法速度",
    "Increases your evasion, armor, and elemental resistances": "增加你的闪避、护甲和元素抗性",
    "Increases your ranged damage": "增加你的远程伤害",

    "Status Effects":"状态效果",
    "There are status effects that can temporarily prevent you from taking certain actions":
        "有一些状态效果可能会暂时阻止您採取某些行动。",

    "Prevents using auto attacks":
        "禁止使用自动攻击。",

    "Prevents using abilities":
        "禁止使用技能。",

    "Prevents using auto attacks, abilities, and consumables":
        "禁止使用自动攻击、技能和消耗品。",
    "Group Combat":"组队战斗",
    "You can create or join a party to battle in zones with multiple monsters. When all party members have pressed \"Ready,\" the party will automatically travel to battle. Monsters will randomly attack any of the party members, and those with a higher threat stat will be targeted more frequently. Monster experience and drops will be divided with an equal chance among all players. Players more than 20% lower than the highest combat level player will receive less experience and drops":
        "您可以创建或加入队伍，在有多个怪物的区域进行战斗。当所有队员都按下「准备」键后，队伍将自动前往战斗。怪物会随机攻击任何队员，威胁值越高的怪物被攻击的几率就越高。怪物经验和掉落物将平等分配给所有玩家。战斗等级低于最高等级玩家 20% 以上的玩家将获得较少的经验和掉落物。",

    "Dungeons consists of multiple waves of higher tier elite monsters and unique dungeon bosses. They can be accessed with dungeon keys, which can be crafted after finding key fragments from bosses in regular combat zones":"地下城由多波更高级别的精英怪物和独特的地下城首领组成。可以使用地牢钥匙进入它们，地牢钥匙可以在常规战斗区域的 Boss 处找到关键碎片后制作",
    "Up to five players can be in a dungeon party. Each person must have a key, which will be consumed after beating the final boss for the dungeon reward chest. If you complete a dungeon with fewer players, you will have a chance of looting an additional chest at the cost of an extra key. If the dungeon is not completed, you will keep your dungeon key":"地下城派对中最多可有五名玩家。每个人都必须有一把钥匙，击败最终头目后将消耗钥匙以获得地下城奖励宝箱。如果您以较少的玩家完成了一个地下城，您将有机会以额外的钥匙为代价掠夺一个额外的箱子。如果地牢未完成，您将保留地牢钥匙",
    "Deaths in dungeons will not trigger a respawn timer. You can only be revived by a party member. If all party members are dead, the dungeon run is considered failed and you will restart at wave":"地牢中的死亡不会触发重生计时器。只有队员才能使你復活。如果所有队员都死了，则地下城运行被视为失败，您将重新开始于波数",

    "You also have secondary combat stats that are affected by your skill levels, equipment, and buffs":
        "您还有次要战斗数值，受您的专业等级、装备和增益效果的影响。",

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
        "依自动攻击造成的伤害以百分比回復HP",

    "Leeches mana based on the percentage of auto-attack damage you deal":
        "依自动攻击造成的伤害以百分比吸取MP",

    "When attacked, deals a percentage of your defensive damage back to the attacker. Damage is increased by 1% per armor or resistance (corresponding to the attack type":
        "受到攻击时，将自身防御伤害的一定比例反击给攻击者。每增加一层护甲或抗性，伤害就会增加 1%（对应攻击类型",

    Retaliation: "复仇",
    "When attacked, reflects a percentage of (defensive damage + incoming damage) as a smash attack back to the attacker":
        "受到攻击时，将一定比例的（防御伤害 + 受到的伤害）以猛击的形式反射给攻击者",

    "Reduces chance of being blinded, silenced, or stunned":
        "降低被致盲、沉默或眩晕的几率",

    "Increases chance of being targeted by monsters":
        "增加被怪物作为目标的几率",

    "HP/MP Regen":"HP/MP 再生",
    "Recovers a percentage of your maximum HP/MP every 10 seconds":
        "每10秒回復MAX HP/MP的一部分百分比",

    "Reduces food cooldown": "减少食物冷却时间",

    "Increases drink effect. Reduces duration and cooldown": "增加饮料效果。减少持续时间和冷却时间",

    "Increases the drop rate of regular items. This cannot go above":
        "增加普通物品的掉落率。这个值不能超过",

    "Increases quantity of regular item drops":
        "增加常规物品掉落的数量",

    "Increases rare item drop rate":
        "增加稀有物品掉落率",

    "of combat experience is distributed to the primary training skill determined by your weapon": "的战斗经验将分配给由你的武器决定的主要训练技能",

    "of combat experience is distributed to the focus training skill determined by your charm": "的战斗经验会分配给由你的魅力决定的专注训练技能",


    "This is only for display and represents your overall combat effectiveness based on the combination of combat skill levels":
        "这代表目前基于战斗类型的相关专业等级的参考等级",

    Formulas:"公式",
    "For those who enjoy math, here are the formulas for the secondary stats":
        "对于喜欢数学的人，这里是次要战斗数值的公式",

    "Attack Interval = baseInterval / (1 + (Attack":
        "攻击间隔 = 基础间隔 / (1 + (攻击",
    "AttackSpeedBonus":"攻击速度加成",
    "abilityHaste":"技能冷却",
    "Bonus":"加成",

    "Cast Time = baseCastTime": "施法时间 = 基础施法时间",
    "Attack / 2000) + CastSpeedBonus":
        "攻击 / 2000) + 施法速度加成",

    "Ability Cooldown = baseCooldown":
        "技能冷却 = 基础冷却时间",

    "Accuracy = (10 + Attack":
        "精准 = (10 + 攻击",

    "Damage = (10 + [Melee|Ranged|Magic|Defense":
        "伤害 = (10 + [近战|远程|魔法|防御",

    "Bulwark Smash Damage = SmashDamage + DefensiveDamage": "重盾钝击伤害 = 钝击伤害 + 防御伤害",

    "Thorn Damage = DefensiveDamage * (1 + [Armor|Resistance] / 100) * Thorn": "反伤伤害 = 防御伤害 * (1 + [护甲|抵抗] / 100) * 反伤",

    "Retaliation Damage = (DefensiveDamage + MIN(AttackerPremitigatedDamage, 5 * DefensiveDamage)) * Retaliation":
    "复仇伤害 = (防御伤害 + MIN(攻击者减轻伤害, 5 * 防御伤害)) * 复仇",


    "Hit Chance = (MyAccuracy":
        "命中几率 = (我的精准",

    "MyAccuracy ^ 1.4 + EnemyEvasion":
        "我的精准 ^ 1.4 + 敌人的闪避",

    "Ranged Bonus Critical Rate = 0.3 * Hit Chance":
        "远程基础暴击几率 = 0.3 * 命中几率",

    "Evasion = (10 + Defense":
        "闪避 = (10 + 防御",

    "Armor = 0.2 * Defense + Bonus":
        "护甲 = 0.2 * 防御 + 加成",

    "Percent Physical Damage Taken":
        "受到物理伤害百分比",

    "If Armor is negative then it's":
        "如果护甲是负数，那么它是",

    "Resistance = 0.2 * Defense + Bonus":
        "抗性 = 0.2 * 防御 + 加成",

    "Percent Elemental Damage Taken":
        "受到元素伤害百分比",

    "If Resistance is negative then it's":
        "如果抗性为负数，则是",

    "Blind/Silence/Stun Chance = Base Chance":
        "致盲/沉默/眩晕几率 = 基础几率",

    "Targeted By Monster Chance = MyThreat":
        "被怪物选中的几率 = 我的威胁值",
    "TeamTotalThreat":"队伍总威胁值",
    "Combat Level = 0.1 * (Stamina + Intelligence + Attack + Defense + MAX(Melee, Ranged, Magic)) + 0.5 * MAX":
        "战斗等级 = 0.1 * (耐力 + 智力 + 攻击 + 防御 + MAX(近战, 远程, 魔法))  + 0.5 * MAX",

    "Attack, Defense, Melee, Ranged, Magic": "攻击, 防御, 近战, 远程, 魔法",

    //------------------/ 随机任务
    "Random Tasks": "随机任务",
    "Tasks Feature": "任务功能",
    'After completing the tutorial, you will unlock the tasks feature. The Task Board generates random short to medium-length tasks in different skills. By completing these tasks, you can obtain rewards for your participation':
       "完成新手教程后，你将解锁任务功能。任务板会生成不同专业类型的随机中短期任务。通过完成这些任务，你可以获得相应的参与奖励",
    "The Task Board": "任务板",
    "Frequency": "频率",
    "Variety": "种类",
    "Capacity": "容量",
   "Task Cooldown": "任务冷却",
    "Tasks are assigned periodically, starting at one every 8 hours. Upgrades can reduce the interval to as low as 4 hours":
        "任务定期分配，从每8小时一个开始。升级可以将间隔减少到最低4小时",

    "Tasks may involve gathering/production skills or defeating monsters. The generated tasks will slightly prioritize skills in which the player has a higher level":
        "任务可能涉及採集/生产专业或击败怪物。生成的任务会稍微优先考虑玩家等级较高的专业。",

    "You can reroll tasks using coins or cowbells. The cost doubles (up to a limit) with each reroll":
        "您可以使用金币或牛铃重新选择任务。每次重新选择的费用会翻倍（有上限）",

    "Tasks do not expire, but there's a limit of 8 task slots. The capacity can be increased through upgrades in the cowbell store":
        "任务没有期限，但任务槽位有8个的限制。可以通过在牛铃商店进行升级来增加容量。",

    "Completing tasks rewards you with Coins and Task Tokens. A Task Point is also granted for every Task Token rewarded from tasks":
        "完成任务将奖励您金币和任务代币。每个任务代币奖励还会获得一个任务点数",

    "Accumulating 50 Task Points allows you to claim \"Purple's Gift,\" which can be opened to obtain Coins, Task Tokens, Task Crystals, and various lootboxes":"累积50个任务点可以让您领取“紫色礼物”，打开后可获得金币、任务代币、任务水晶和各种箱子",

    "Task Tokens can be spent in the Task Shop for permanent upgrades or items, including":
        "任务代币可以在任务商店中用于永久升级或物品，包括",

    "Reduces the cooldown between tasks":
        "减少任务之间的冷却时间",

    "Allows blocking specific skills from being assigned as tasks. Combat blocking has to be unlocked at an additional cost":
        "允许屏蔽特定专业被分配为任务。战斗屏蔽需要额外付费解锁。",

    "Used for crafting or upgrading task badge with the Crafting skill. Task badges provide multiplicative action speed or damage bonuses while undertaking tasks":
        "用于使用制作专业来制作或升级任务徽章。任务徽章在进行任务时可提供大量的行动速度或伤害加成。",

    "Large Meteorite Cache, Large Artisan's Crate, and Large Treasure Chest":
        "陨石【大】、工匠的箱子【大】和宝箱【大】",

    //------------------/ 公会
    'Discover guilds by navigating to the "Guild" feature in the navigation menu. Guilds are formed by groups of players who enjoy playing together. While guilds currently serve as primarily social hubs, upcoming expansions may introduce more group-oriented activities':
        "通过导航功能表中的“公会”功能发现公会。公会由一群喜欢一起游戏的玩家组成。目前，公会主要作为社交中心，但即将到来的扩展可能会引入更多以团队为导向的活动。",

    "Creating a Guild": "创建公会",

    "You can start your own guild by investing 5 million coins and choosing a unique guild name. As the guild's creator, you automatically assume the role of the leader, granting you the highest authority within the guild. Afterward, invite other players to join your guild":
        "您可以通过投资5M金币并选择一个独特的公会名称来创建您自己的公会。作为公会的创建者，你会自动成为公会的会长，拥有公会内的最高权力。之后，你可以邀请其他玩家加入你的公会。",

    "Joining a Guild": "加入公会",

    "You can be invited to join existing guilds. To find a guild to join, you can use the Recruit chat channel, where guilds actively seek new members. You can view your invitations on the Guild page":
        "你可以被邀请加入现有的公会。要找到可以加入的公会，你可以使用招募聊天频道，在那里公会会积极寻找新成员。你可以在公会页面查看你的邀请。",

    "Guild Features": "工会功能",
    "Guilds come with several key features":
        "公会具有几个关键功能",

    "Guild Chat Channel":
        "公会聊天频道",

    "A private, self-moderated space for guild members to connect and converse":
        "一个私密的、自我管理的空间，供公会成员互相联繫和交流",

    "Guild Notice Board": "公会公告板",

    "A persistent message board editable by the leader or generals to keep everyone informed":
        "由会长或将军可编辑的持续消息板，用于通知所有人",

    "As members earn experience points (XP) in various skills, the guild accumulates XP at a":
        "随着成员在各种专业中获得经验点（XP），公会积累经验的比例为",

    "ratio, contributing to the guild's level. Climb the leaderboard based on your guild's level and experience":
        "比例，有助于提升公会的等级。根据您的公会等级和经验爬榜",

    "Guilds begin with 30 member slots and gain 1 additional slot for every 3 guild levels":
        "公会初始有30个成员数量，并且每提升3个公会等级就增加一个槽位",

    "Guilds begin with":"公会初始有",
    "member slots and gain 1 additional slot for every":"个成员槽，并且增加一个槽位于每提升",

    "Member Roles": "职位",
    "Guilds have a structured hierarchy with different roles and permissions. Higher rank roles automatically possess the permission of any lower rank":
        "公会具有不同的角色和许可权。较高等级的角色自动具有任何较低等级的许可权。",

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

    "Invited":"受邀",

    "Has no access until they accept the guild invitation":
        "在接受公会邀请之前没有许可权",

    //------------------/ 聊天指令
    "Chat Commands":"聊天指令",
    "w [name] [message":"w [昵称] [信息",
    "whisper another player":"私聊",
    "reply to last whisper": "回复最后一条私聊",
    "view player profile":"查看玩家信息",
    "profile [name":"profile [昵称",
    "friend [name":"friend [昵称",
    "block [name":"block [昵称",
    "unblock [name":"unblock [昵称",
    "unfriend [name":"unfriend [昵称",
    "House Rooms": "房子加成",
    "add friend": "添加好友",
    "remove friend": "删除好友",
    "unblock player": "解除屏蔽该玩家",
    "Ping mods for urgent issues that require immediate attention. This will only work in public channels. DO NOT ABUSE":
        "若有需要立即处理的紧急问题，请 @管理员。此操作仅在公共频道有效。请勿滥用。",
    "Experience Table":"经验表",

    //-------------- 守则
    "Single Account Only":"一人一号",
    "Each person can only play on 1 account. Guests are also considered accounts": "每人只能使用一个帐户玩游戏。访客也被视为帐户",
    "No Account Sharing":"禁止帐号共用",
    "Do not share account with other players": "不要与其他玩家共用帐户",
    "No Inappropriate Name":"禁止不当名称",
    "Names should not be offensive, sexual, impersonating others, or based on well-known real-world individuals. Inappropriate name may result in mutes and forced name change":
        "角色名称不可具有冒犯性、性暗示、冒充他人或基于现实世界中的知名人士。不当称谓可能会导致禁言或强制改名",

    "Age 13+ Only":"仅限13岁以上玩家游玩",
    "In compliance with COPPA(Children's Online Privacy Protection Act), you must be at least age 13+ to register and play": "根据 COPPA（儿童线上隐私保护法案），您必须年满 13 岁才能注册和玩游戏",

    Trading:"交易",
    "No Real World Trading / Cross-Trading":"禁止现实世界交易/跨游戏交易",
    "Do not trade items or services within Milky Way Idle for anything outside of the game": "不要用《银河牛牛放置》内的物品或服务换取游戏外的任何东西",

    "No Boosting":"禁止倾斜资源",
    "Do not funnel wealth to other players. Players may receive up to 10M coins in total gifts from others. Wealth transfers over this limit, whether intentional or not, can be treated as boosting. Unintentional transfers (e.g. randomly finding an extremely underpriced item on market) can be removed. Intentional transfers will result in additional penalties based on severity": "请勿将财富转移给其他玩家。玩家从他人处累计接收的礼物总额不得超过 10 M游戏币。超过此限额的财富转移，无论是否出于故意，都可能被视为违规带练行为。非故意的转移（例如在交易行偶然发现极低价物品）可能会被追回。故意转移财富将根据情节严重程度追加处罚",

    "No Scamming": "禁止诈骗",
    "Do not use deception or scamming to gain items from other players. Actions will be taken against scammers given sufficient evidence. However, items lost to scams will not be refunded": "不要使用欺骗手段获取其他玩家的物品。只要有足够的证据将对骗子将採取措施。然而，被诈骗损失的物品将不予退还",

    "Repay Loans Within 7 Days": "贷款需在 7 天内偿还",
    "Loans are at your own risk. Loans not repaid within 7 days can be considered boosting/scamming": "贷款风险自负，未在 7 天内偿还的贷款视为倾斜资源/诈骗",

    "Use Respectful Language":"注意言辞",
    "The #1 chat rule is to respect other players. Our goal is to create a friendly community space everyone can enjoy. Please avoid intentionally antagonizing or harassing others. While the occasional use of profanity is not against the rule, please don't do so excessively, especially when directed at other players":"首要的聊天规则是尊重其他玩家。我们的目标是创建一个友好的社区空间，让每个人都能享受。请避免故意挑衅或骚扰他人。虽然偶尔使用粗话不违反规则，但请不要过度使用，尤其是针对其他玩家时。",

    "English in General Chat":"常规频道仅限使用英语",
    "Please primarily use English in the General chat channel. Different languages are acceptable in other channels": "请在常规聊天频道主要使用英语。其他频道可以接受其他语言",

    "No Discrimination":"禁止歧视",
    "Do not use slurs, slangs, or any offensive phrases that target any person or group of people":"不要使用针对任何人或群体的侮辱性语言、俚语或攻击性短语",

    "No Illegal or Sexual Topics":"禁止讨论非法或性话题",
    "Do not link or discuss illegal activities or sexual topics":"不要发送连结或讨论非法活动或性话题",

    "Avoid Divisive Topics or Drama": "避免敏感或是有争议性的话题",
    "Avoid divisive topics that often lead to drama or conversations inappropriate for public chat. This includes, but is not limited to, politics, religion, international conflicts, gender discussions, sexuality, mute/ban complaints, and other topics that frequently become disruptive":
        "玩家需要避免那些常常会引发争端或不适合在公共聊天中进行的有争议性或是敏感性的话题,这包括但不限于政治、宗教、国际冲突、性别讨论、性方面、禁言/封号等等的抱怨，以及其他常常会造成扰乱的话题",

    "No Spamming":"禁止刷屏",
    "Do not spam the chat with large number of unnecessary messages, overuse CAPSLOCK, or beg others for free items":"不要发送大量不必要的资讯、过度使用大写字母或乞讨免费物品",

    "Do Not Encourage Others to Break Rules":"禁止鼓励他人违反规则",
    "Do not mislead or instigate other players into breaking game rules":"不要误导或煽动其他玩家违反游戏规则",

    "Do Not Disclose Personal Information":"禁止披露个人资讯",
    "Do not disclose identifying personal information about yourself, including, but not limited to, your full name, address, phone number, and email address. Furthermore, do not disclose ANY personal information about other players that they have not made public themselves, such as their name, age, or location":
        "不要披露关于您自己的任何个人识别资讯，包括但不限于您的全名、位址、电话号码和电子邮寄地址。此外，不要披露其他玩家未公开的任何个人资讯，如他们的姓名、年龄或位置",

    "All Advertisements Must be in Appropriate Channels":"所有广告必须在适当的频道中",
    "All buying, selling, or service requests should be in trade chat. Guild/Party recruitment or seeking to join guild/party requests should be in recruit channel. Price checks are allowed in general or beginner chat. No referral links":
        "所有买卖或服务请求应在交易聊天中进行。公会/队伍招募或寻求加入公会/队伍的请求应在招募频道中进行。大多数频道允许比价。禁止使用推荐连结。",

    "Listen to":"听从",
    "Moderators have the discretion to moderate chat as they see fit in order to maintain a positive environment. Please cooperate with their requests. If anyone has disagreements or complaints regarding a moderator, please submit a ticket on Discord or email contact@milkywayidle.com":
        "管理员有权对他们认为合适的方式进行聊天管理，以维持一个积极向上的环境。请配合他们提出的要求。如果有人对管理员存在异议或有投诉事项，请在 Discord 上提交工单，或发送电子邮件至 contact@milkywayidle.com",

    "Bots, Scripts, and Extensions":"自动化，脚本和外挂程式",
    "No Botting":"禁止使用机器人",
    "Do not use any automation that plays the game for you":"禁止使用任何自动化工具来代替玩家进行游戏",

    "Scripts and Extensions":"脚本和外挂程式",
    "Any scripts or extensions must not take any actions for the player (send any requests to server). You are allowed to use them purely for information display purposes or UI improvements":"任何脚本或扩展不得为玩家採取任何行动（发送任何请求到伺服器）。您可以纯粹用于资讯显示或使用者介面改进。",
    "ex":"例如",
    "Display combat summary, track drops, move buttons to different location":"显示战斗总结、追踪掉落、移动按钮位置",
    "Bugs and Exploits":"漏洞和利用",
    "No Bug Abusing":"禁止滥用漏洞",
    "Do not abuse game bugs or exploits to your advantage. Please report them on Discord":"不要利用游戏漏洞或不正当行为来获取优势。请在 Discord 上报告这些问题",
};

//3.1 新闻
let tranNews = {
    "Skilling Expansion Part":"专业扩充部分",
    "Alchemy Skill":"炼金专业",

    "Pirate Cove Dungeon, 4th Character Slot, and Custom Cosmetic Policy Update":"海盗湾地下城、第四个角色栏位以及自订外观政策更新",
    "The Pirate Cove Dungeon is now open for exploration! This new dungeon features a variety of new T95 weapons and armors, as well as new abilities. We've also made some adjustments to existing items and abilities to improve balance and gameplay. Check out the full patch notes for all the details":
        "海盗湾地下城现已开放供玩家探索！这个新的地下城拥有各种全新的 T95 武器和盔甲，以及新的技能。我们还对现有物品和技能进行了一些调整，以提升平衡性和游戏体验。查看完整的补丁说明以了解所有详细资讯",
    "In other news, we've added a new 4th character slot for players, allowing everyone the same opportunity of having up to 1 Standard and 3 Ironcow characters":
        "另一方面，我们为玩家新增了第四个角色栏位，让每个人都有同样的机会拥有最多 1 个普通角色和 3 个铁牛角色",
    "We are also updating our custom cosmetic policy and pricing. While the feature started as nice gift to show our appreciation to our supporters, it's now too overwhelming with the huge increase in playerbase. We've spent 150-200 hours to work on about 100 requests in the past month, and we need to be able to allocate more time for other development tasks. Starting May 1st, custom cosmetics will require spending supporter points and cowbells. Any requests initiated before the end of April will be granted based on the previous supporter point requirements":
        "我们也在更新我们的自订外观政策和定价。虽然这个功能最初是作为向我们的支持者表达感谢的一份贴心礼物推出的，但随着玩家数量的大幅增加，现在这项工作变得过于繁重。在过去一个月里，我们花费了 150 到 200 个小时来处理大约 100 个请求，而我们需要能够为其他开发任务分配更多时间。从 5 月 1 日起，获取自订外观将需要花费支持者点数和牛铃。在 4 月底之前提交的任何请求都将根据之前的支持者点数要求来处理",


    "We're excited to release the second part of the skilling expansion, introducing Celestial Tools and Skilling Outfits! After using Holy tools for such a long time, skilling specialists can finally get their hands on some upgrades. These items are not easy to acquire, but those who are dedicated (or wealthy) enough to obtain them will be rewarded with a significant boost. Dive in and take your skilling to the next level":
        "我们激动地推出专业扩展的第二部分-星空工具与生产服装！在使用神圣工具这麽长的时间以来，生产专精的玩家们终于又能获得进一步的装备升级了！当然，这些道具并不容易获得，但是那些足够专精（或富有）从而取得他们的人会获得显着的强化。现在加入来将你的生产技能推向新一波的高峰吧",

    "Sat Nov":"星期六 11月",
    "Transform your gameplay with the introduction of the new Alchemy skill, the first part of our Skilling Expansion! Alchemy introduces exciting new mechanics, allowing you to turn one item into another using Coinify, Decompose, or Transmute. Whether you're stocking up on coins, acquiring new skilling essences, breaking down equipment for their components, or chasing legendary gems like the Philosopher's Stone, Alchemy opens up a world of possibilities":
    "透过引入新的【炼金】专业来改变您的游戏玩法，这是我们专业扩充的第一部分！ 炼金引入了令人兴奋的新机制，让您可以使用【点金】、【分解 】或 【转化】 将一件物品变成另外一件物品。无论您是储备金币、获取新的专业精华、分解装备以获取其组件，还是追逐魔法石等传奇宝石，【炼金】都会打开一个充满可能性的世界 ",
    "For more details on this update, head over to the Patch Notes, and stay tuned for part 2 of the expansion in the coming month, which will introduce a new set of high-level tools and skilling outfits":
    "有关此更新的更多详细内容，请参阅补丁说明，并继续关註下个月将扩充的第二部分，其中将引入一套新的高级工具和专业装备",

    "Elite Monsters and Special Abilities":"精英怪物和特殊技能",
    "At long last, the group combat feature has arrived! You can now join forces with fellow adventurers, strategize together, and vanquish groups of elite enemies to claim the coveted special ability books":
        "终于，团队战斗功能来了！你现在可以与其他冒险者联手，群策群力，击败一群精英敌人，赢得梦寐以求的特殊技能书。（然后被吸",
    "Developer's Note":"开发者日誌",
    "Sorry for the extended gap since the last update. The implementation of group combat proved to be more complex than initially estimated. This release is split into 2 parts. Part 1, the current update, establishes the groundwork for the party system along with introducing elite monsters and special abilities. Part 2 will unveil dungeons where you can discover new unique drops and equipment. Stay tuned for more adventures ahead":
        "很抱歉自上次更新以来间隔了这麽长时间。团队战斗的实现比最初估计的要複杂得多。本次发佈分为两个部分。第一个部分，即当前更新，奠定了队伍系统的基础，同时引入了精英怪物和特殊技能。第二部分将带来地下城，您可以在其中发现新的独特掉落物品和装备。敬请期待更多的冒险！                                   -------------以前的补丁不想翻译了，感兴趣自行阅读-------------",

    "Are you tired of your party looking like a team of clones? Avatars are now available in the Cowbell Store. Combine them with stylish outfits to give yourself a unique look": "厌倦了你的队伍看起来像一队克隆人吗？牛铃商店现在提供头像。将它们与时尚的装束搭配，使自己拥有独特的外观",
    "Dungeon chest drops are receiving a rework. Different dungeon tokens for each of the 3 dungeons are being introduced that gives you a choice over what dungeon materials to exchange for in the new Shop. From the latest Discord poll, this change has been polarizing among players who voted. Therefore, instead of replacing all material drops with tokens, we decided to proceed with a mix of material and token drops. This is balanced around allowing players to focus on one item at a time and complete it in about half the time, but it will take longer to complete multiple items":
      "地牢宝箱掉落物正在进行重做。每个地牢引入不同的地牢代币，使你可以选择在新商店中兑换哪些地牢材料。从最新的Discord投票来看，这一变化在投票玩家中引起了极大的争议。因此，我们决定在材料掉落中添加代币，而不是全部替换成代币。这种平衡方式允许玩家一次专注于一个物品并在大约一半的时间内完成它，但完成多个物品的时间会更长",
    "Sat Jun": "星期六 六月",
    "This update introduces new combat dungeons": "此更新引入了新的战斗地牢",
    "Chimerical Den, Sinister Circus, and Enchanted Fortress. Gather your party of up to five players and face waves of elite monsters and unique bosses. Complete these dungeons to discover new abilities, weapons, and equipment, including new back slot items! Embrace the new challenges and claim your rewards": "奇幻洞穴、邪恶马戏团和秘法要塞。组建最多五人的队伍，面对一波波的精英怪物和独特的首领。完成这些地牢以发现新的技能、武器和装备，包括新的背部装备！迎接新的挑战并领取你的奖励",
};

//3.2 补丁
let tranPatch = {

    "UI": "用户界面",
    Rebalance :"再平衡",
    Hotfix:"热补丁",
    "Features and Content": "功能和内容",
    "Major Patch": "重大补丁",
    "QOL": "生活质量改进",
    "Medium Patch": "中型补丁",
    "Minor Patch":"小型更新",
    "Rebalancing":"平衡性调整",
    "Bug Fix": "BUG修復",
    "Shop": "商店",
    "Other":"其他",
    "Group Combat Part": "团队战斗部分",
    "Dungeons": "地下城",

    "Pirate Cove Dungeon and More": "海盗湾地下城及更多内容",
    "Pirate Cove Dungeon": "海盗湾地下城",
    "New T95 Magic Weapons": "全新 T95 魔法武器",
    "Rippling Trident, Blooming Trident, Blazing Trident": "涟漪三叉戟、绽放三叉戟、炽焰三叉戟",
    "New T95 Armors": "全新 T95 盔甲",
    "Anchorbound Plate Body/Legs, Maelstrom Plate Body/Legs, Kraken Tunic/Chaps, Corsair Helmet, Marksman Bracers": "锚定胸甲 / 腿甲、漩涡胸甲 / 腿甲、克拉肯皮衣 / 皮裤、海盗头盔、神射护腕",
    "New Abilities": "新技能",
    "Shield Bash (also added to Chimerical Den), Fracturing Impact, Life Drain": "盾击（也添加到了地下城奇幻洞穴）、碎裂冲击、生命吸取",
    "Alchemy recipes added for the new items. All dungeon ability book transmutes have been normalized to 50% success": "为新物品添加了炼金配方。所有地下城技能书的转化成功率已统一调整为 50%",
    "New T95 spear added to Enchanted Fortress": "在秘法要塞中添加了全新的 T95 矛类武器",
    "Upgrading equipment with production skills will now save 70% of the enhancement levels. Some T95 equipment recipes are adjusted to be upgraded from lower tier variants": "使用生产专业升级装备时，现在将保留 70% 的强化等级。一些 T95 装备的配方也调整为可从较低等级的强化物品进行升级",
    "Added 4th character slot. You can only have up to 3 Ironcows": "添加了第四个角色栏位。你最多只能拥有 3 个铁牛角色",
    "Added Steam leaderboard for characters created after the Steam release and is also linked to Steam. This is only visible on qualifying characters": "为在 Steam 发布后创建且与 Steam 连动的角色添加了 Steam 排行榜。这些仅在符合条件的角色上可见",
    "Increased guild member slots from 25 + level/4 to 30 + level": "将公会成员名额从 25 + 等级/4 改为 30 + 等级",
    "Cosmetics": "外观",
    "year anniversary": "周年纪念",
    "Anniversary Purple, OG Jerry chat icons": "周年庆牛紫、经典杰瑞聊天图标",
    "Added new chat icons based on a small selection of dungeon bosses": "根据部分精选的地下城首领添加了新的聊天图标",
    "Added 2 new Pirate Cove themed avatars and outfits": "添加了两个全新的海盗湾主题头像和服饰",
    "Custom cosmetics are changed to require spending supporter points and cowbells. We are simply overwhelmed by requests due to the huge increase in player count and unfortunately cannot continue supporting them as gifts. The new pricing will take effect on May 1st. Any requests initiated before end of April will be granted based on the previous supporter point requirements": "自订外观现在改为需要花费支持者积分和牛铃。由于玩家数量大幅增加，我们实在被请求淹没，很遗憾无法再将其作为礼物提供。新的定价将于 5 月 1 日生效。4 月底之前提交的任何请求都将根据之前的支持者积分要求来处理",
    "Adjusted recipe of Chimerical Chest Key and Enchanted Chest Key so that their Brown and White Key Fragments are swapped. This prevents Enchanted Fortress and Pirate Cove from sharing 3/4 key fragments. You can temporarily freely swap between Brown and White Key Fragments in the dungeon shop until the next patch": "调整了异想宝箱钥匙和魔法宝箱钥匙的配方，将它们的棕色和白色钥匙碎片进行了互换。这防止了魔法要塞和海盗湾共享四分之三的钥匙碎片。在下个补丁之前，你可以在地下城商店中临时自由互换棕色和白色钥匙碎片",
    "Added auto attack damage to all melee armor to bring melee damage closer to the other styles": "为所有近战的盔甲添加了自动攻击伤害，以使近战伤害更接近其他类型的伤害",
    "Increased bulwark accuracy and damage": "提高了护盾的准确率和伤害",
    "Added melee accuracy to Colossus Plate Body/Legs": "为巨像胸甲 / 腿甲添加了近战准确率",
    "Reworked to damage all enemies": "从单体改为对所有敌人造成伤害",
    "Damaged over time duration reduced from 15s to 9s. Damage taken debuff increased from 0% to": "持续伤害时间从 15 秒减少到 9 秒。受到的伤害减益效果从 0% 增加到",
    "Evasion debuff lowered from 15% to": "闪避减益效果从 15% 降低到",
    "Damage over time duration reduced from 10s to 6s": "持续伤害时间从 10 秒减少到 6 秒",
    "Accuracy debuff lowered from 20% to 15%. Evasion debuff increased from 0% to": "准确率减益效果从 20% 降低到 15%。闪避减益效果从 0% 增加到",
    "Monster defense level reduced by": "怪物防御等级降低了",
    "Monster fire resistance reduced by": "怪物火抗降低了",
    "Added a new setting to hide General chat system messages": "添加了一個可隱藏世界聊天系統消息的新設置",
    "Disabled party linking in General, Trade, and Beginner chat": "禁止在世界聊天、交易聊天和新手聊天中发送组队连结",
    "Added double confirmation to some buttons that are troublesome when misclicked": "为一些误点后会带来麻烦的按钮添加了二次确认",
    "Added inactive days count to guild and friend list": "在公会和好友列表中添加了不活跃天数计数",
    "Changed \"Start\" button text on alchemy and enhancing to be more obvious about what action it is": "更改了炼金和强化界面中 \"开始\" 按钮的文本，使其更明确所执行的操作",
    "Do not prevent making an instant market order when you have 3 open listings on the item": "当你在该物品上有 3 个未完成的上架信息时，不再阻止你进行即时市场订单操作",
    "Fixed issue that may cause small number of player's actions to stop after a server restart": "修复了可能导致少数玩家在服务器重启后行动停止的问题",
    "Fixed a rare bug that may cause server crash": "修复了一个可能导致服务器崩溃的罕见错误",
    "Blocking characters will prevent party join (based on leader) and guild invite": "拉黑的角色将阻止组队加入（基于队长）和公会邀请",
    "Server and client optimizations to speed up server restart, task generation, scroll performance, and more": "对服务器和客户端进行了优化，以加快服务器重启、任务生成、滚动性能等方面的速度",
    "Added a feature to allow admin to post an announcement bar for important messages": "添加了一项功能，允许管理员发布重要消息的公告栏",
    "Localization improvements": "翻译改进",


    "Anti-Fraud Measures and Bug Fixes": "反诈骗措施与BUG修复",
    "Anti-Fraud": "反诈骗",
    "Due to a few instances of recent fraudulent purchases, added anti-fraud measure where player's first time Cowbell purchase may trigger a 72-hour restriction on selling Bags of Cowbells on the market. You will be notified prior to purchasing":
      "由于近期出现几起诈骗购买事件，新增了反诈措施，玩家首次在牛铃商店购买商品时会触发这项限制，导致在72小时内无法在市场上贩售牛铃袋。在购买前您将收到通知。",
    "Fixed an issue where under extremely rare conditions a player may get stuck in a nonexistent party combat action":
      "修复了当玩家处于不存在的队伍战斗行动中时，游戏会卡住的问题",
    "Fixed additional translation inconsistencies with some item names and their corresponding actions":
      "修复了一些物品名称及其对应行动的翻译不一致问题。",
    "Backend changes to improve database connection stability":
      "对后台进行了更动，以提高资料库连接的稳定性。",


    "Chinese Localization and Final Preparations for Steam Early Access Release": "Steam 抢先体验版发布的官方汉化【简中】及最终准备工作",
    "Added Chinese localization": "新增官方游戏内容的汉化【简中】",
    "The language will be automatically selected based on your browser language":
      "系统将依据您的浏览器语言自动选择对应语言",
    "Players can also manually change the display language in [Settings] -> [Game] or from the home page":
      "玩家也能够在 [设置] -> [游戏] 中，或者从主页面手动切换显示语言",
    "A few items have not yet been translated, including most of news/patch notes, terms of use, and privacy policy":
      "尚有几项内容未完成翻译，其中包括大多数的新闻资讯、更新说明、使用条款以及隐私政策",
    "If you see any translation issues or bugged display text, please report them in the #bug-reports channel on Discord":
      "倘若您发现任何翻译或文本显示的问题，请在 Discord 的 #bug-reports 频道中反馈",
    "Updated popup modals to all be centered on the entire game screen":
      "对弹出式窗口进行更动，使其全部在整个游戏屏幕上居中显示",
    "Removed seasonal Spring Festival cosmetics from the Cowbell Store":
      "从牛铃商店中移除了春节期间限定的外观",
    "Additional adjustments to Steam integration":
      "对 Steam 的集成进行了进一步的调整",
    "Privacy policy have been updated to include language for use of analytical and marketing cookies. This allows us to optimize marketing campaigns when attempting to run ads for Milky Way Idle on other platforms":
      "更新了隐私政策，新增了有关于使用分析和营销类 Cookies（网络跟踪器）的条款内容。这能让我们在其他平台上投放《银河放置》广告时，能够对营销活动进行优化",


    "Spring Festival": "春节",
    "Spring festival chat icon, avatar, and avatar outfits available in Cowbell Store until the update after at least 3 weeks. You can continue to use them after the event ends":
      "春节活动聊天图标、头像和头像服装可在牛铃商店中购买，活动将持续至少 3 週，直至更新后结束。活动结束后，您仍可继续使用这些物品",
    "Send a system message every 25 skill levels at or above level 100 instead of only for levels 100 and":
      "在玩家等级达到或超过 100 级时，每提升 25 级时会发送一次系统消息，而不是仅仅只在等级 100 或  ",
    "Leaderboard guild names should not be clickable":
      "排行榜中的公会名称不应可点击",
    "Improved chat message URL link parsing to be more accurate":
      "改进了聊天消息中的 URL 连结解析，使其更加准确",
    "Fixed an issue where players get logged out if the database goes offline during maintenance":
      "修復了资料库在维护期间离线时导致玩家被强制登出的问题",
    "Fixed an issue where some uncommon conditions cause player combat to not correctly stop after running out of offline progress":
      "修復了某些罕见情况导致玩家战斗在离线进度耗尽后未正确停止的问题",
    "Added @mod and @mods chat commands to notify moderators for emergencies":
      "新增 @mod 和 @mods 聊天指令，可在紧急情况下通知管理员",
    "Implemented authentication and payment changes in the background to support upcoming Steam release":
      "在后台实现了身份验证和支付更改，以支持即将推出的 Steam 版本",


    "Fri Jan": "星期五 1月",
    "Chat Channel Improvements": "聊天频道改进",
    "Added 12 alternative language chat channels and ironcow channel": "添加了 12 个备用语言聊天频道和铁牛频道",
    "When creating a new character, if your browser's default language matches one of the available alternative language channels, it will be automatically assigned": "创建新角色时，如果浏览器的默认语言与某个可用的备用语言频道匹配，将自动分配该频道",
    "All public channels can be toggled on or off in Settings -> Game": "所有公共频道均可在 “设定” -> “游戏” 中打开或关闭",
    "Personal rank in the leaderboard will now display up to 10,000 instead of": "排行榜中的个人排名现在最高可显示到 10,000，而不是",
    "Allow chat channel tabs to wrap to a second row when there's not enough space": "当空间不足时，允许聊天频道标签换行到第二行。",
    "Clarified that \"rare find\" applies to all rare items (displayed under rare drops) and not just to loot containers": " “稀有发现”现在适用于所有稀有物品（显示在稀有掉落下方），而不仅仅是战利品箱子",
    "Correctly include rare skilling components as protection item for T90 skilling equipment": "修復了之前没有把稀有材料作为t90装备保护物品的错误",
    "Correctly account for the artisan tea level requirement increase when calculating the efficiency bonus": "修復了工匠茶增加额外等级要求未能正确作用于专业效率的问题的错误",
    "Corrected the display of efficiency and enhancing success bonuses from fractional level boosts": "修復了在效率和强化成功率上未能正确显示的小数点等级的错误",
    "Created a workaround for a Google Translate bug that causes crashes for some actions": "为谷歌翻译bug导致的某些操作崩溃创建了暂时的解决方案",
    "Removed seasonal Christmas cosmetics": "删除了季节限定的圣诞装饰品",


    "Celestial Tools and Skilling Outfits": "星空工具和专业服装",
    "Level 90 Skilling Tools and Outfits": "90级专业工具与装备",
    "Skilling Rare Materials":"专业稀有材料",
    "Butter Of Proficiency, Thread Of Expertise, and Branch of Insight. These materials can be found as rare drops from high-level material gathering and production actions. They can also be obtained by transmuting Holy, Arcane, Umbral, and Radiant equipment": "技能稀有材料：熟练之油、专业之线、洞察树枝。这些材料除了可以透过高级材料採集和生产活动中发现。也可以透过转化神圣、奥术、暗影和光辉装备来获得",
    "Celestial Tools": "星空工具",
    "New skilling tools that can be cheesesmithed using the rare materials and skilling essences": "星空工具：新的技能工具，可以使用稀有的材料和专业精华进行乳酪锻造",
    "Skilling Outfits": "专业服装",
    "New skilling body and legs equipment that can be tailored using the rare materials and skilling essences. These are designed to match the avatar outfits for each skill in the Cowbell Store": "新的专业上着和腿部下着，可以使用稀有的材料和专业精华定製。这些服装旨在与牛铃商店中各专业对应的头像服装相匹配",
    "Increased buyable task slots by 10. The new maximum number of task slots is now": "可购买的任务槽增加了 10 个，新的最大任务槽数现在为",
    "Lowered the sell value of skilling essences from 100 to 50. The previous 10x bulk alchemy change made skilling essences too effective for coinifying due to their low item level": "将专业精华的售价从 100 降低至 50。先前 10 倍批量炼金的变更使得专业精华由于物品等级较低而无法进行点金",
    "Added rare drop information to the item dictionary and improved the layout": "将稀有掉落物信息添加到物品词典中，并优化了排版佈局",
    "Added catalyst information to Alchemy actions in the queued actions list": "伫列队列中正在等待的炼金工作现在增加了使用的催化剂信息",
    "Combined enhancing target and protection start level into a single line in queued actions list": "现在强化目标与保护起始等级在同一行了",
    "Redesigned Holy item icons": "重新设计神圣物品的图示",
    "Renamed Red Chef's Hat to Red Culinary Hat to avoid confusion with the new Chef's Outfit": "将红色厨师帽(英文名)重新命名，以避免与新的厨师服装混淆",
    "Fixed a number of minor UI issues": "修復了一些 UI 的问题",


    "Sun Dec": "星期日 12月",
    "Christmas": "圣诞节",
    "Christmas chat icon, avatar, and avatar outfits available in Cowbell Store until the first update in 2025. You can continue to use them after the event ends": "圣诞节新增聊天图标、头像和头像服装在牛铃商店中可用，贩售活动将持续至 2025年第一次更新。即便活动结束后仍可继续使用",
    "Alchemizing raw materials and essences will now be done in bulk of 2, 5, or 10 instead of 1. Output and coin costs are multiplied by the same ratio": "炼金的原料和精华现在将批量完成 2、5 或 10 个而不是 1 个",
    "Catalysts will now only be consumed on success": "催化剂现在只会在成功时消耗",
    "Significantly increased Enhancing Essence output from decomposing higher-tier equipment": "分解强化过的装备时所产出的强化精华产量将显着增加",
    "Chance to receive Prime Catalyst from transmuting lower tier catalysts decreased from 5% to 4%. This is to ensure the cost of using Prime Catalyst is not lowered by too much due to the consume on success change": "透过转换较低级的催化剂获得主要催化剂的几率从5%减少到4%。这是为了确保使用主要催化剂的成本不会因为成功变更的消耗而降低太多",
    "Increased minimum transmute cost per item from 10 to 50 coins": "每件物品的最低兑换成本从 10 个金币增加到 50 个金币",
    "Standardized appearance of text inputs": "文字输入的标准化外观",


    "Tue Nov": "星期二 11月",
    "Added new chat icons": "添加了新的聊天图标",
    "Sunstone and Philosopher's Stone": "【太阳石】和【贤者之石】",
    "Transmute success rate decreased from 90% to": "转换成功率从90%降到",
    "Transmute success rate decreased from 84% to": "转换成功率从84%降到",
        "Transmute success rate decreased from 85% to": "转换成功率从85%降到",
    "Added a stop button to the current action tab for Alchemy and Enhancing": "在【炼金】和【强化】的【当前操作】标籤中新增了停止按钮",
    "Last selected action tab for Alchemy will be saved for when you revisit the page": "当您重新造访该页面时，将储存最后选择的炼金操作标籤",
    "Consumable slots should no longer display unusable slots as usable": "消耗品插槽不再将不可用的插槽显示为可用",
    "Alchemy with a set action limit should now execute the correct number of actions, accounting for efficiency": "在有设定行动限制的情况下，【炼金】现在应该执行正确数量的行动，并同时考虑到效率",
    "Equipment stats will be correctly updated when a loadout is used in group combat": "当在团体战斗中使用配装时，装备统计数据将及时的更新",
    "This was a visual bug only": "这仅是一个视觉上的错误",
    "The remove button for Enhancing item selection should now function correctly": "用于【强化】项目选择的删除按钮现在可以正常工作了",
    "Item linking from current actions for Alchemy and Enhancing should now work as intended": "当前针对【炼金】和【强化】的物品链接现在应该能按预期工作",
    "Current actions for Alchemy and Enhancing will now display correctly, even with delay in server response": "即使服务器回应有延迟，【炼金】和【强化】里的【当前操作】现在也将正确显示",


    "Alchemy allows you to transform items into other items using the actions Coinify, Decompose, or Transmute": "炼金可让您使用 【点金】、【分解】或 【转化】将物品转换为其他物品",
    "Coinify lets you convert items into 500% of the item's sell price": "【点金】可让您将商品转换为商品售价的500%",
    "Decompose lets you break down items into their crafting materials or skilling essences": "【分解】可让您将物品分解为其制作材料或专业精华",
    "Transmute lets you change items into other related items or rare uniques, such as the Philosopher's Stone": "【转化】可让您将物品转换为其他相关物品或稀有的独特物品，例如贤者之石",
    "Each alchemy action has varying success rates that can be boosted by catalysts and tea": "每一种炼金的操作都有不同的成功率，可以透过催化剂和茶来提高",
    "Unique items": "独特物品",
    "Found from transmuting gems": "从转换宝石中发现",
    "Found from transmuting various rare items and equipment": "透过转换各种稀有物品和装备发现",
    "Found from transmuting high-level food": "透过转换高级食物后发现",
    "Found from transmuting high-level drinks": "透过转化高级饮料后发现",
    "Found from transmuting lower-tier catalysts": "透过转化低级催化剂发现",
    "For more information, check the Alchemy section in the Game Guide": "欲瞭解更多内容，请查看游戏指南中的炼金专业部分",
    "Skilling Essences": "专业精华",
    "Skilling essences are a new type of resource": "专业精华是一种新型资源",
    "They can be passively obtained at a moderate rate from each non-combat skill": "它们可以从每个非战斗专业中以中等速率被动获得",
    "They can be quickly obtained by decomposing various items in Alchemy": "它们可以透过炼金专业中分解各种物品来快速获得",
    "They are now part of the recipe for brewing skill-level teas": "它们现在是冲泡专业茶的配方的一部分",
    "They can be used to craft various alchemy catalysts with the Crafting skill": "它们可以透过制作专业来制作各种炼金催化剂",
    "They will also serve a purpose in Skilling Expansion Part 2 for new Skilling equipment": "它们还将在专业扩充的第 2 部分中用于新的专业装备",
    "Added new ultra tea and coffee that use crushed moonstone and sunstone": "添加了使用碎月光石和碎太阳石的究级茶和咖啡",
    "Skilling-level tea now provides an extra efficiency bonus on top of the level bonus": "专业茶现在除了等级奖励之外还提供额外的效率奖励",
    "New catalytic tea for boosting alchemy success rates": "新出的催化茶可提高炼金成功率",
    "New Equipment": "新装备",
    "Ring/Earrings of Critical Strike": "''爆击''戒指/耳环",
    "crafted with Sunstones": "用太阳石制作",
    "Philosopher's Ring/Earrings/Necklace": "''贤者''戒指/耳环/项链",
    "crafted with the Philosopher's Stone": "用贤者之石制作",
    "Gluttonous Pouch and Guzzling Pouch":"贪吃袋和暴饮袋",
    "buff food and drinks, respectively": "分别增益食物和饮料",
    "Alembic": "蒸馏器",
    "Gained Alchemy Efficiency and Alchemy level requirement. They will be automatically unequiped and placed in your inventory. They can be worn again once the level requirements are met":
        "现在多了炼金效率和炼金等级要求。它们将自动取消装备并放入您的库存中。达到等级要求后即可再次配戴",
    "Ring/Earrings of Threat": "''威胁''戒指/耳环",
    "Reworked into Ring/Earrings of Essence Find": "重新打造为''精华发现''戒指/耳环",
    "Ring/Earrings of Armor/Resistance": "''护甲''戒指/耳环跟''抗性''戒指/耳环",
    "Increased Armor/Resistance from 5 to": "护甲/抗性从 5 增加到",
    "Physical/Elemental Thorn increased from 9% to 10%. Resistances increased from 25 to 30. Threat increased from 75 to": "物理/魔法反伤从 9% 增加到 10%。抗性从 25 增加到 30。威胁值从 75 增加到",
    "Other Bulwarks": "其他盾牌",
    "Threat increased by about": "威胁值增加约",
    "Increased Cursed Bow ranged damage from 125% to": "咒怨弓的远程伤害从 125% 增加到",
    "Royal Nature Robes": "''皇家自然''袍服/袍裙",
    "Adjusted to match other Royal Robes' Elemental Amplify and Cast Speed. Added Heal Amplify": "调整以配合其他皇家系列的元素增幅和施法速度并治疗强化新增",
    "Reworked as a 0 cooldown ability": "施法的冷却时间改为 0",
    "Damage ratio increased from 120% to": "伤害比例从 120% 增加到",
    "Evasion debuff decreased from 20% to": "闪避减益从 20% 降低至",
    "Cooldown decreased from 20s to 18s": "冷却时间从 20 秒减少至 18 秒",
    "Damage ratio increased from 160% to": "伤害比例从 160% 增加到",
    "Elemental Thorn increased from 20% to": "魔法反伤从 20% 增加到",
    "Reduced coin drop rate from monsters from 100% to": "怪物的金币掉落率从 100% 降至",
    "Added gem drops to dungeon chests": "为地牢宝箱添加了宝石掉落",
    "T95 equipment sell value increased": "T95装备售价增加",
    "Pouches and dungeon keys sell value lowered to account for Coinify": "考虑到【点金】，袋子和地牢钥匙的售价有所减少",
    "Reorganized header display and added secondary information for Alchemy and Enhancing actions": "调整了【炼金】和【强化】的介面,并添加了当前操作的讯息",
    "Updated Enhancing UI for better clarity and usability": "更新了强化界面的UI，提高了清晰度和实用性",
    "Save inventory category collapse state and last selected action tabs separately per character": "每个角色当前的行动以及库存的折叠状态会被个别保存",
    "Renamed the Enhancing building from Laboratory to Observatory and repurposed Observatory for Alchemy": "强化的房子从实验室更名为天文台，实验室将被用于炼金的房子",
    "Support clicking links in chat with a confirmation that can be disabled in settings": "支援点击聊天中的连结并进行确认，可以在设定中停用该确认",
    "Added dates to chat timestamps for whispers": "为频道中的私聊时间添加了日期显示",
    "Fixed a bug where some custom name colors in chat disappeared temporarily on mobile": "修正了聊天中某些自订名称颜色在行动装置上暂时消失的错误",
    "Removed seasonal Halloween cosmetics": "移除了季节限定商品 :【万圣节】的装饰",
    "Level bonuses will now consider partial levels from drinks": "等级奖励现在将考虑饮料中的部分等级",


    "Wed Oct": "星期三 10月",
    "Halloween": "万圣节",
    "Halloween chat icon, avatar, and avatar outfits available in Cowbell Store for 3 weeks. You can continue to use them after the event ends": "牛铃商店新增万圣节聊天图标、头像和头像服装，为期 3 周。即便活动结束后仍可继续使用",
    "Fixed visual bug with loadout where combat triggers, equipment stats, or equipment buffs sometimes doesn't correctly sync after equipping loadout": "修復了配装栏中的视觉错误，其中战斗触发器、装备资料或装备增益有时在装备配装后未能正确同步",


    "Mon Sep": "星期一 9月",
    "Weaken changed from reducing enemy damage to reducing enemy accuracy. This will allow the effect to increase defense XP instead of reducing it": "特效从减少敌人伤害改为降低敌人准确度，解决因特效导致防禦经验减少的问题",
    "Backend changes to test Steam integration (work in progress": "对后台进行更改,以测试steam整合（正在进行中",


    "Sun Sep": "星期日 9月",
    "Griffin Bulwark": "狮鹫盾",
    "Cheesesmithed with Griffin Talon from Chimerical Den": "用来自奇幻洞穴的狮鹫之爪打造而成",
    "new item": "新物品",
    "Arcane Reflect": "奥术反射",
    "Acquired from Enchanted Fortress": "从秘法要塞获得",
    "Experience gained from healing increased by": "治疗获得的经验增加了",
    "Dungeon keys are now split into entry keys and chest keys. Entry keys are crafted using the same resources from the original key recipe, along with some coins. Chest keys require only the key fragments from the original recipe. All existing dungeon keys are converted into chest keys, with a refund of the difference in resource cost per key. Unopened dungeon chests will receive a free chest key per chest. This change allows players to run a larger number of dungeons more easily with a lower entry cost":
        "地牢钥匙现在分为入口钥匙和宝箱钥匙。入口钥匙使用原始钥匙配方中的相同资源以及一些金币制作。宝箱钥匙仅需要原配方中的钥匙碎片。所有现有的地牢钥匙将转换为宝箱钥匙，并按每把钥匙退还资源差价。未开启的地牢宝箱将每个宝箱获得一把免费的宝箱钥匙。此更改使玩家更容易以更低的进入成本进行更多的地牢探索",
    "Keys and key fragments are placed into separate item categories in both the inventory and marketplace": "钥匙和钥匙碎片在库存和市场中被分配到不同的物品类别",
    "Added an option for loadout to ignore warnings about missing items": "增添允许配装关闭【消耗品不足】的警告的选项",


    "Thu Sep":"星期四 9月",
    "Loadouts": "配装",
    "Loadouts allow you to save your current equipment, consumables, and abilities to be automatically loaded later with actions": "配装允许你保存当前的装备、消耗品和技能，稍后可通过操作自动载入",
    "Loadouts can be tied to a single skill or \"All Skills.\" Selecting \"All Skills\" will only save equipment": "配装可以绑定到单一专业专业或“所有专业”。选择“所有专业”时只会保存装备",
    "Setting a loadout as default will auto-select the loadout when choosing any action in the skill(s) the loadout is associated with": "将某个配装设置为默认时，在选择与该配装关联的专业的任何操作时，会自动选择该方案",
    "Each character gets 2 free loadout slots, which can be upgraded in the Cowbell Store": "每个角色有2个免费的配装槽位，可以在牛铃商店中升级",
    "Condense key count messages in dungeons into a single message": "将地牢中的钥匙数量资讯压缩成一条消息",


    "Fri Aug": "星期五 8月",
    "Added a third character slot for players who want to play an additional character. You are still limited to one Standard character":
        "新增第三个角色槽位，供希望玩额外角色的玩家使用。但标准角色仍受限于1个。",
    "Enabled parties to change combat zones": "允许队伍更改战斗区域",
    "Increased the friend and block list limits from 50 to":
        "好友和黑名单列表的上限从50增加到",
    "Expanded the guild notice maximum length from 800 to 1500 characters":
        "公会公告的最大长度从800个字元扩展到1500个字元",
    "significantly increased smash accuracy and damage. Added threat level":
        "显着提高了钝击精准和伤害，并增加了威胁等级。",
    "Increased Nature's Veil drop rate at Luna Empress from 0.25% to":
        "将月神之蝶的自然菌幕(群体)掉落率从0.25%提高到",
    "Decreased low-tier key fragment drop rate by":
        "低级钥匙的掉落率降低了",
    "The number of dungeon keys each party member has will now be displayed in chat at the start of each dungeon run":
        "每个队员拥有的地牢钥匙数量将会在每次地牢运行开始时在聊天中显示",
    "Remaining consumables will be displayed under the Stats tab when inspecting other players in battle":
        "在战斗中检查其他玩家时，剩馀消耗品将会在'统计'标籤下显示",
    "Equipment in profiles will always be visible to party members":
        "个人资料中的装备始终对队伍成员可见",
    "Updated icons for staffs and royal robes to improve differentiation between elements":
        "更新了法杖和皇家长袍的图示，提高元素之间的区分度",
    "Implemented some accessibility improvements for screen readers":
        "实施了一些萤幕阅读器的可访问性改进",
    "Updated rules regarding the use of English-only to be limited to General chat":
        "更新了关于使用英语的规则，常规频道仅限使用英语，其他频道不限",
    "Added an experimental AI-based automod":
        "添加了一个实验性的基于AI的自动审查系统",
    "Implemented Kongregate integration in preparation for release on the platform":
        "实施了Kongregate平台的集成，为在该平台上的发佈做准备",


    "Avatars, Dungeon Tokens, and More": "头像、地牢代币等",
    "Thu Jul": "星期四 七月",
    "Avatars and Outfits": "头像和服装",
    "Avatars and outfits have been added to the Cowbell Store. They will appear in your profile, party, and group combat": "头像和服装已添加到牛铃商店。它们将出现在你的个人资料、队伍和群体战斗中",
    "Located in the navigation bar under your skills": "位于巡览列——战斗专业下面",
    "The General Shop sells level 1 weapons and tools for a small amount of coins": "普通商店出售1级武器和工具，价格为少量金币",
    "The Dungeon Shop sells essences, dungeon materials, and back-slot equipment for dungeon tokens": "地牢商店出售精华、地牢材料和背部装备，价格为地牢代币",
    "Dungeons will now drop a mix of dungeon tokens and rare materials": "地牢现在将掉落混合的地牢代币和稀有材料",
    "Parties can optionally be private. They can also be linked into chat for inviting other players": "队伍可以选择设为私人队伍，并且可以连结到聊天中邀请其他玩家",
    "Guild member limit increased from 15 + 0.2 * GuildLevel to 25 + 0.25 * GuildLevel": "公会成员上限从15 + 0.2 * 公会等级增加到25 + 0.25 * 公会等级",
    "Equipped abilities now display under the Equipment tab when viewing player profiles": "在查看玩家资料时，已装备的技能现在显示在装备选项卡下",
    "Task Rings have been transformed into Task Badge which now go into the new trinket equipment slot": "任务戒指已转变为任务徽章，现在放入新的饰品装备槽",
    "Different dungeon back slot items can be used as enhancing protection for each other": "不同地牢披风现在可以互为强化保护",
    "Equipment slots have been reorganized": "装备槽已重新佈局",
    "An Overview tab has been added to profiles, displaying avatar, character age, and other information": "个人资料中增加了一个概览选项卡，显示头像、角色年龄等资讯",
    "You can now view and change consumables and abilities on the My Party tab in the Combat page": "现在可以在战斗页面的“我的队伍”选项卡中查看和更改消耗品和技能",
    "Party roles are color-coded so they are easier to distinguish between": "队伍角色有颜色编码，以便更容易区分",


    "combat drop rate increased from 5% to": "战斗掉落率从5%增加到",
    "ability haste decreased from 10 to": "技能急速从10减少到",
    "Griffin Tunic/Chaps": "狮鹫皮衣/皮裤",
    "melee accuracy increased from 8%/6% to": "近战准确度从8%/6%增加到",
    "healing amplify increased from 20% to": "治疗增幅从20%增加到",
    "auto attack damage increased from 0% to": "自动攻击伤害从0%增加到",
    "ability haste increased from 4 to": "技能急速从4增加到",
    "ranged damage increased from 120% to": "远程伤害从120%增加到",
    "elemental penetration increased from 0 to 10%, magic damage decreased from 6% to 4%. Recipe now include 1 Watchful Relic": "元素穿透从0增加到10%，魔法伤害从6%减少到4%。配方现在包括1个警戒圣物",
    "armor penetration increased from 0 to 10%, melee accuracy decreased from 40% to 25%, melee damage increased from 15% to 20%. Recipe now include 2 Gobo Defenders": "护甲穿透从0增加到10%，近战准确度从40%减少到25%，近战伤害从15%增加到20%。配方现在包括2个哥布林防禦者",
    "healing increased from 40 + 25% magic damage to 40 + 30% magic damage": "治疗量从40 + 25%魔法伤害增加到40 + 30%魔法伤害",
    "healing decreased from 30 + 25% magic damage to 30 + 20% magic damage": "治疗量从30 + 25%魔法伤害减少到30 + 20%魔法伤害",
    "speed buff increase from 3% to": "速度增益从3%增加到",
    "Taunt and Provoke": "嘲讽和挑衅",
    "cooldown decrease from 65s to 60s. Duration increase from 60s to 65s": "冷却时间从65秒减少到60秒。持续时间从60秒增加到65秒",
    "previously backwards due to bug": "之前由于错误导致反向",
    "Penetrating Strike and Penetrating Shot": "穿透打击和穿透射击",
    "mana cost set to": "MP消耗设定为",
    "previously incorrectly set to": "之前设定错误为",
    "Swiftness Coffee and Channeling Coffee": "迅捷咖啡和吟唱咖啡",
    "Speed buff increased from 10% to": "速度增益从10%增加到",
    "magic level decreased by 20, Fireball level increased by": "魔法等级减少20，火球术等级增加",
    "elemental resistances increased by": "元素抗性增加",
    "ranged level decreased by 20, Precision level decreased by 10, magic evasion increased by": "远程等级减少20，精确等级减少10，魔法闪避增加",

    "Fixed a rare bug in group combat that caused battle ending logic to repeat multiple times and spawn extra invisible monsters": "修復了一个罕见的组队战斗错误，该错误导致战斗结束逻辑重複多次并生成额外的隐形怪物",
    "Correctly handle a rare error when using the task shop that could crash server": "正确处理使用任务商店时可能导致伺服器崩溃的罕见错误",
    "Correctly save auto-kick option in parties": "正确保存队伍中的自动踢人选项",


    "Melee and ranged damage are considerably lower than magic. Melee and ranged weapons have been moderately buffed to result in an overall increase of 5-7% in damage":"近战和远程伤害相较魔法有点低了。现在对近战和远程武器进行适度增强，总体伤害增加了5-7%。",
    "Reduced attack interval on crossbows from 4s to 3.6s and on bows from 3.5s to 3.2s":"弩的攻击间隔从4秒减少到3.6秒，弓的攻击间隔从3.5秒减少到3.2秒。",
    "Increased damage bonus on melee weapons (except bulwarks) by":"近战武器（盾牌除外）的伤害加成增加了",
    "Increased drop sources of Quick Aid and Rejuvenate":"增加了快速治疗和群体治疗的技能书掉落来源。",
    "Added Rejuvenate to Luna Moths (Normal":"在月神之蝶（普通）中添加了群体治疗技能书的掉落。",
    "Added Quick Aid to Novice Sorcerers (Elite) and Infernal Imps (Normal":"在新手巫师（精英）和地狱小鬼（普通）中添加了快速治疗技能书的掉落。",

    "Added chat icons":"添加了聊天图标。",
    "Bamboo, Golden Marketplace, Golden Biceps":"竹子，黄金市场，黄金二头肌                                                       -------------以前的补丁不想翻译了，感兴趣自行阅读-------------",


    "New combat dungeons": "新的战斗地下城",
    "Chimerical Den, Sinister Circus, and Enchanted Fortress": "奇幻洞穴、邪恶马戏团和秘法要塞",
    "Dungeons consist of multiple waves of higher tier elite monsters as well as unique bosses": "地下城由多波高等级精英怪物以及独特的首领组成",
    "You can enter with parties of up to five players, each required to have a key. Failing or leaving the dungeon will not consume the key": "最多可与五名玩家组队进入，每人需要一把钥匙。失败或离开地下城不会消耗钥匙",
    "Dungeon keys are crafted from key fragments, which are dropped by bosses in regular combat zones. Elite bosses have a much higher chance to drop key fragments": "地下城钥匙由钥匙碎片制作，碎片由常规战斗区的首领掉落。精英首领掉落钥匙碎片的几率更高",
    "You will not automatically respawn after dying in a dungeon. You can only be revived by an ally. If all party members are dead, the dungeon will restart at wave": "在地下城中死亡后不会自动復活。只能由队友復活。如果所有队员都死亡，地下城将从波数重置",
    "New abilities and items": "新技能和物品",
    "abilities, 2 melee weapons, 2 ranged weapons, and many other pieces of equipment or materials that can be looted from dungeon chests": "个技能、2件近战武器、2件远程武器以及许多其他可从地下城宝箱中获取的装备或材料",
    "View drop rates by clicking the item dictionary option on the chests that appear under each dungeon": "通过点击每个地下城下出现的宝箱上的物品词典选项查看掉落率",
    "New back slot": "新的背部装备栏",
    "untradable capes/quiver that can be found from dungeon chests. Back slot items also have a 5x enhancement bonus, the same as jewelry": "种不可交易的斗篷/箭袋可从地下城宝箱中获得。背部装备也有与珠宝相同的5倍强化加成",
    "New earrings of threat and ring of threat can be crafted with star fragment and amber and increases your base threat stat": "新的威胁耳环和威胁戒指可以用星光碎片和琥珀制作，增加你的基础威胁属性",
    "Legacy ironcow can now party with regular ironcow": "传统铁牛现在可以与常规铁牛组队",
    "Party auto-kicking idle members who are not ready is now an optional setting": "自动踢出未准备的闲置成员现在是一个可选设置",
    "Decreased elite zone combat drop rate buff to match that of the experience buff. This is due to key fragments being a new high-value drop that primarily come from elite bosses": "降低精英区战斗掉落率增益，以匹配经验增益。这是因为钥匙碎片作为新的高价值掉落物主要来自精英首领",
    "Adjusted all magic staffs to have 3.5s attack interval but with -50% auto attack damage. This allows abilities to be used more frequently between auto attacks": "调整了所有魔杖的攻击间隔为3.5秒，但自动攻击伤害减少50%。这允许在自动攻击之间更频繁地使用技能。",
    "Increase Water Strike and Fireball damage from 55% to 60%. Decrease level bonus from 0.55% to": "将水击和火球的伤害从55%提高到60%。将等级加成从0.55%降低到",

    "Added 4% ranged damage to Sighted Bracers": "为瞄准护腕增加了4%远程伤害",
    "Decreased water amplify on Marine Tunic from 30% to 25% and on Marine Chaps from 24% to": "降低了海洋皮衣的水增幅从30%到25%，以及海洋皮裤的水增幅从24%到",
    "Increased threat buff on taunt from 200% to 250% and on provoke from 400% to": "增加了嘲讽的威胁增益从200%到250%，以及挑衅的威胁增益从400%到",
    "Increased accuracy buff on Precision from 30% to": "增加了精确的准确性增益从30%到",
    "Loot container drop rates are now part of the item dictionary": "战利品容器掉落率现在是物品词典的一部分",
    "Renamed the ability Pierce to Impale to avoid confusion with the new piercing effect": "将技能“Pierce”重命名为“Impale”以避免与新的贯穿效果混淆",
    "Added shine to golden chat icons that did not have it previously": "为以前没有闪光效果的金色聊天图示添加了闪光",


    "Slightly reduced Rabid Rabbit damage": "略微减少了疯魔兔的伤害",
    "Decreased Dodocamel Plume drop rate from 20% to 10% (This was a math error I made; they are supposed to require an average of 60 chests to craft": "将渡驼之羽的掉落率从20%降低到10%（这是我犯的数学错误；它们平均需要60个宝箱才能制作",
    "Decreased drop rate of full items (excluding capes) from dungeon chests by half": "将地牢宝箱中完整物品的掉落率减少一半（不包括斗篷）",
    "Added 2% chance to get back a dungeon key from dungeon chests": "增加了2%的几率从地牢宝箱中找回地牢钥匙",
    "Removed dungeon bosses from being possible task monsters. If you already have one, it should still work, but the \"Go\" button is broken": "将地牢首领从可能的任务怪物中移除。如果你已经有一个，它仍然可以使用，但\"前往\"按钮是坏的",
    "Prevented some players from getting stuck in a party after server updates": "防止了一些玩家在伺服器更新后卡在队伍中的问题",



};

//3.3 尚未整理
let tranOrganize = {

    "Lootboxes": "宝箱",
    "Member Slots":  "成员数量",

};

//4.0 模擬器
let tranEmulator = {
    Neck: "项链",
    Player: "玩家",
    "House Rooms": "房子",
    "Drop Prices": "掉落价格",
    "Trigger": "",
    "Current Assets": "流动资产",
    Networth: "净资产",
    "Price settings": "价格设置",
    "Consumable Prices:": "消耗品价格",
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
    "Mana used per hour": "每小时消耗的MP",
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
    "Simulation Settings": "模拟设置",
    "Expenses": "支出",
    "Revenue": "收益",
    "No RNG Revenue": "正常期望收益",
    "No RNG Drops": "正常期望掉落",
    "Create": "创建",
    "solo": "单人",
    "OR": "或",
    "Equipment Sets": "套用设置",
    "Import/Export": "导入/导出",
    "Get Prices": "获取价格",
    "Edit Prices": "修改价格",
    "Import": "导入",
    "Import solo/group": "导入 单人/团队",
    "Export Group/Solo": "导出 团队/单人",
    "Import / Export Set": "导入/导出 设置",
    "Regen": "回复",
    "Ran out of mana": "MP耗尽",
    "Encounters": "遭遇次数",
    "Add condition": "新增条件",
    "Set to default": "设置为预设值",
    "Configure Trigger": "设置触发器",
    "Refresh game page to update character set": "刷新游戏页面更新人物数据",
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
    "Import / Export Set": "导入/导出 设置",
    "Group Combat": "团队",

 }

//5.0 插件類漢化
let tranPlugins = {
    // 食用工具
    "Edible Tools": "食用工具",
    "Total Revenue": "总计价值",
    "Daily Revenue": "每日收入",
    "Expected Revenue": "期望产值",
    "NoRNG Daily": "期望日入",
    "Expected Daily": "期望日利",
    "Ranged EXP": "远程经验",
    "Intelligence EXP": "智力经验",
    "Attack EXP": "攻击经验",
    "Dispatch": "出警",
    "Loot": "分赃",
    Aura: "光环",
    "Chest Records": "开箱纪录",
    "HP Regen/min": "每分回血",
    "MP Regen/min": "每分回蓝",
    "Waiting for stable data": "等待数据稳定",
    "Clear Data": "清除数据",
    "Toggle Display": "切换显示",


    // MWItool
    "Use orange as the main color for the script":
      "将橙色设为脚本的主要颜色。",
    "Top left": "左上角",
    "Estimated total time of the current action, estimated complete time":
      "当前动作的预计总时长、预计完成时间。",
    "Action panel":  "动作面板",
    "Estimated total time of the action, times needed to reach a target skill level, exp/hour":
      "动作的预计总时长、达到目标专业等级所需的次数、每小时经验值。",
    "Quick input numbers. [Depends on the previous selection": "快速输入次数 [取决于上一项选择",
    "Overall profit of the foraging maps with multiple outcomes. [Depends on the previous selection":
      "具有多种产出的采集地图的综合收益。[取决于上一项选择",
    "Top right": "右上角",
    "Current assets (Items with at least 2 enhancement levels are valued by enchancing simulator":
      "流动资产（强化等级至少为 +2 的物品按强化模拟器估值",
    "Below inventory search bar": "仓库搜索栏下方",
    "Inventory and character summery. [Depends on the previous selection":
      "仓库和角色信息总结。[取决于上一项选择",
    "Sort inventory items. [Depends on the previous selection":
      "对仓库物品进行排序。[取决于上一项选择",
    "Profile panel": "人物面板",
    "Build score": "战力分数",
    "Item tooltip": "物品悬浮提示",
    "hours average market price": "小时市场平均价格",
    "Production cost and profit. [Depends on the previous selection":
      "生产成本和利润。[取决于上一项选择",
    "HP/MP consumables restore speed, cost performance, max cost per day":
      "HP / MP消耗品回复速度、性价比、每天最大消耗成本。",
    "Alert message when market price data can not be fetched":
      "无法获取市场价格数据时的警告信息。",
    "Left sidebar": "左侧边栏",
    "Percentages of exp of the skill levels": "专业等级的经验百分比",
    "Battle info panel": " 战斗信息面板",
    "click on player avatar during combat":  "战斗时点击玩家头像",
    "Encounters/hour, revenue, exp": "每小时战斗次数、收入、经验",
    "Top right corner of equipment icons": "装备图标右上角",
    "Equipment level": "装备等级",
    "Top right corner of key/fragment icons": "钥匙 / 钥匙碎片图标右上角",
    "Corresponding combat zone index number. [Depends on the previous selection":
      "对应的战斗区域编号。[取决于上一项选择",
    "Filter by equipment level, class, slot":
      "按装备等级、职业、装备部位筛选。",
    "Tasks page": "任务页面",
    "Combat zone index number": "战斗区域编号",
    "Combat zones page": "战斗区域选择页面",
    "Combat zone index number": "战斗区域编号",
    "Item dictionary of skill books":"技能书物品词典面板",
    "Number of books needed to reach target skill level":  "达到目标技能等级所需的技能书数量",
    "Left sidebar": "左侧边栏",
    "Links to 3rd-party websites, script settings": "第三方工具网站链接、脚本设置链接",
    "Queued actions panel at the top": "上方动作队列面板",
    "Estimated total time and complete time of each queued action": "队列中每个动作的预计总时长和完成时间",
    "Tooltip of equipment with enhancement level": "带有强化等级的装备悬浮提示",
    "Enhancing simulator calculations": "强化模拟器计算结果",
    "Top": "页面上方",
    "Alert message when combating with production equipments equipted, or producing when there are unequipted corresponding production equipment in the inventory":
      "战斗时穿着生产装备，或进行生产时仓库中有未装备的相应生产装备时的警告信息",
    "Browser notification": "浏览器通知",
    "Action queue is empty": " 动作队列为空",
    "Works only when the game page is open":  "仅在游戏页面打开时有效",
    "Automatically input price with the smallest increasement/decreasement when posting marketplace bid/sell orders":  "发布市场买入 / 卖出订单时自动输入最小加价 / 降价金额",
    "Bottom of player avatar during combat": "战斗时玩家头像下方",
    "Floating window during combat": "战斗时悬浮窗口",
    "DPS chart. [Depends on the previous selection": "每秒伤害图表。[取决于上一项选择",
    "DPS chart transparent and blur background. [Depends on the previous selection": "每秒伤害（DPS）图表，背景透明且虚化。[取决于上一项选择",
    "MWITools\u672c\u8eab\u5f3a\u5236\u663e\u793a\u4e2d\u6587 MWITools always in Chinese": "MWITools本身强制显示中文",
    "Accesss Github with proxy": "給國內用戶加一個proxy來訪問github的dns",

 }



//6.0 強化追蹤器
let tranEnchant = {
    "Sound Enabled": "声音已开启",
    "Sound Disabled": "声音已关闭",
    "Enhancement Tracker": "强化追踪器",
    "Enhancement Tracker Enabled": "强化追踪器已开启",
    "Begin enhancing to populate data": "开始强化以填充数据",
    "Enhancement Tracker Hidden": "强化追踪器已隐藏",
    "Enhancement Tracker Shown": "强化追踪器已显示",
    "All session data cleared": "数据已清除",
    "Material Costs": "材料成本",
    "Session Duration": "强化时长",
    "Market data": "市场数据",
    "Prot": "保护",
    "Total XP Gained": "总获得经验",
    "Prots Used": "保护使用",
    "Total Attempts": "总强化次数",
    "XP/Hour": "XP/小时",
    "In Progress": "强化中",
    "Calculating": "计算中",
    Qty: "数量",
    Completed: "已完成",
    Fail: "失败",
    Failed: "失败",
    "undefined": "未定义",
    "undefined, Total": "未定义, 总计",
    "Total cost across all sessions": "总成本",

};

//7.0 戰鬥特效漢化
let transSpecialEffects = {
    <!-- MWI-Hit-Tracker-Canvas -->
    "MWI-Hit-Tracker Settings": "MWI-Hit-Tracker 设置",
    "Projectile Limit": "投射物数量限制",
    "Projectile Scale": "投射物缩放",
    "On-hit Effect Scale": "命中效果缩放",
    "Projectile Height Scale": "弹道高度比例",
    "Projectile Speed Scale": "弹道速度比例",
    "Shake Effect Scale": "震动效果",
    "Particle Effect Ratio": "粒子效果数量",
    "Particle Lifespan Ratio": "粒子效果持续时长",
    "Particle Effect Speed Ratio": "粒子效果初速度",
    "Projectile Trail Length": "弹道尾迹长度",
    "Projectile Trail Gap": "弹道尾迹间隔",
    "Original Damage Display": "原版伤害显示",
    "Hit Area Scale": "命中范围",
    "Minimum Gap Of Each Projectile Hit": "命中最小间距",
    "Damage Text Lifespan": "伤害文本持续时间",
    "Damage Text Scale": "伤害文本大小",
    "Damage Text Alpha": "伤害文本不透明度",
    "Damage Text Size Minimal": "伤害文本尺寸最小值",
    "Damage Text Size Limit": "伤害文本尺寸上限",
    "Show Self Regeneration": "显示玩家被动回复效果",
    "Monster Dead Animation": "怪物死亡效果",
    "Monster Dead Animation Style": "怪物死亡效果样式",
    "default": "默认",
    "Hp Bar Drop Delay": "血条掉落延迟",
    "Player 1 Color": "玩家1 颜色",
    "Projectile Style": "样式",
    "Player 2 Color": "玩家2 颜色",
    "Player 3 Color": "玩家3 颜色",
    "Player 4 Color": "玩家4 颜色",
    "Player 5 Color": "玩家5 颜色",
    "Enemies Color": "敌人颜色",
    "Render FPS Limit": "渲染帧数限制",
    "Not accurate, restart required": "非精确，刷新生效",
    "Show FPS": "显示帧数",

    <!-- MWI-Hit-Tracker -->
    "Enable player #1 damage line": "启用玩家#1伤害线",
    "Enable player #2 damage line": "启用玩家#2伤害线",
    "Enable player #3 damage line": "启用玩家#3伤害线",
    "Enable player #4 damage line": "启用玩家#4伤害线",
    "Enable player #5 damage line": "启用玩家#5伤害线",
    "Enable player #1 healing line": "启用玩家#1治疗线",
    "Enable player #2 healing line": "启用玩家#2治疗线",
    "Enable player #3 healing line": "启用玩家#3治疗线",
    "Enable player #4 healing line": "启用玩家#4治疗线",
    "Enable player #5 healing line": "启用玩家#5治疗线",
    "click to customize color": "点击自定义颜色",
    "Enable enemies damage line": "启用敌人伤害线",
    "Enable enemies healing line": "启用敌人治疗线",
    "Enable missed attack line": "启用被闪避的攻击线",
    "Effects extension": "特效扩展",
    "particle effects & Target shake on hit": "击中时有粒子效果和目标震动",
    "": "",
};


let translates = {};

for (let trans of [
    tranfirstpage,
    tranCommon,
    tranLeftpage,
    tranRightpage,
    tranMarket,
    tranTask,
    tranCombat,
    tranSkill,
    tranState,
    tranItemCurrencies,
    tranItemResources,
    tranItemConsumable,
    tranItemBook,
    tranKeys,
    tranItemEquipment,
    tranAccessories,
    tranItemTool,
    tranMoopass,
    tranItemBox,
    tranMonster,
    tranOther,
    tranNews,
    tranPatch,
    tranOrganize,
    tranEmulator,
    tranPlugins,
    tranEnchant,
    transSpecialEffects,
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
    if (/^(.+?)(\s+)$/s.test(text)) {
        let res = /^(.+?)(\s+)$/s.exec(text);
        return cnItem(res[1], node) + res[2];
    }

    // 消除前面空格
    if (/^(\s+)(.+)$/s.test(text)) {
        let res = /^(\s+)(.+)$/s.exec(text);
        return res[1] + cnItem(res[2], node);
    }

    // 消除中間的多餘空格（確保單詞之間只有一個空格）
    if (/\s{2,}/.test(text)) {
        return cnItem(text.replace(/\s{2,}/g, ' '), node);
    }


    if(!node.parentNode) { // 修復Loadout页面导致脚本crash的问题
        return text;
    }


    // 阿茶的------之大佬潤筆
    // 煉金特例
    if (node?.parentNode?.parentNode?.classList.contains("SkillActionDetail_notes__2je2F") && node.parentNode.querySelector("svg")) {
        const firstLineTextNode = node.parentNode.childNodes[0];
        const secondLineTextNode = node.parentNode.childNodes[2];

        if (node === firstLineTextNode && /^Level\s+(\d+)/.test(firstLineTextNode.textContent)) {
            return "推荐";
        } else if (node === secondLineTextNode && node.textContent.match(/^\s*Recommended$/) && /^Level\s+(\d+)/.test(firstLineTextNode.textContent)) {
            const res = /^Level\s+(\d+)/.exec(firstLineTextNode.textContent);
            return "等级 " + res[1];
        }
    }

    if (node?.parentNode?.parentNode?.classList.contains("SkillActionDetail_notes__2je2F") && !node.parentNode.querySelector("svg")) {
        const text = node.textContent || "";
        if (/^Uses (2|10) items per action$/s.test(text)) {
            let res = /^Uses (2|10) items per action$/s.exec(text);
            return "每次消耗 " + res[1] + " 个物品 " ;
        }
    }


    // 强化特例
    if (node?.parentNode?.parentNode?.classList.contains("SkillActionDetail_itemContainer__2TT5f")) {
        // 检查当前节点是否为文本节点并排除 <br> 和 <div> 节点
        if (node.nodeType === Node.TEXT_NODE && node.nodeName !== 'BR' && node.nodeName !== 'DIV') {
            const text = node.textContent.trim();
            if (text === 'Not') {
                node.textContent = '未';
            } else if (text === 'Used') {
                node.textContent = '使用';
            }
        }
    }


    //特例------模擬器消耗品價格
    if (/^Consumable[\s\S]*?Prices$/.test(text)) {
    text = "消耗品价格";
    }

    // 翻译装备技能
    if (node.parentNode.matches('.EquipmentStatsText_uniqueStat__2xvqX')){
        //console.log(`翻译装备技能：${text}`);
        // Curse: On hit, increases enemy's damage taken by (\d+)% for 15s, stacking up to 5 times.
        if (/^Curse: On hit, increases enemy's damage taken by (\d+\.?\d*)% for 15s, stacking up to 5 times.?$/.test(text)) {
            let res = /^Curse: On hit, increases enemy's damage taken by (\d+\.?\d*)% for 15s, stacking up to 5 times.?$/.exec(text);
            return `灾厄箭矢：每次命中时，使敌人受到的伤害增加${res[1]}%，持续15秒，最多叠加5次`;
        }
        // Pierce: On successful auto-attack, 25% chance to auto-attack next enemy. Can chain multiple times.
        if (/^Pierce: On successful auto-attack, (\d+)% chance to auto-attack next enemy. Can chain multiple times.?$/.test(text)) {
            let res = /^Pierce: On successful auto-attack, (\d+)% chance to auto-attack next enemy. Can chain multiple times.?$/.exec(text);
            return `连锁箭矢：自动攻击成功后，有${res[1]}%的几率自动攻击下一个敌人，可连续触发多次`;
        }
        // Parry: 10% chance to parry enemy's attack, avoiding damage and retaliating with an instant auto attack.
        if (/^Parry: (\d+\.?\d*)% chance to parry enemy's attack, avoiding damage and retaliating with an instant auto attack. Can also parry attacks targeting party members?$/.test(text)) {
            let res = /^Parry: (\d+\.?\d*)% chance to parry enemy's attack, avoiding damage and retaliating with an instant auto attack. Can also parry attacks targeting party members?$/.exec(text);
            return `王权反击：${res[1]}%机率格挡敌人的攻击，免疫本次伤害并立即自动攻击一次，同时可以格挡针对队友的攻击`;
        }
        // Parry: Weaken: When attacked by enemy, reduce enemy's accuracy by 2% for 15s, stacking up to 5 times.
        if (/^Weaken: When attacked by enemy, reduce enemy's (accuracy|damage) by (\d+\.?\d*)% for 15s, stacking up to 5 times.?$/.test(text)) {
            let res = /^Weaken: When attacked by enemy, reduce enemy's (accuracy|damage) by (\d+\.?\d*)% for 15s, stacking up to 5 times.?$/.exec(text);
            return `噩梦缠绕：受到攻击时，降低敌人${res[2]}%命中率，持续15秒，最多叠加5次`;
        }
        // Mayhem: Upon missing an auto-attack, 80% chance to auto-attack next enemy. Can chain multiple times.
        if (/^Mayhem: Upon missing an auto-attack, (\d+)% chance to auto-attack next enemy. Can chain multiple times.?$/.test(text)) {
            let res = /^Mayhem: Upon missing an auto-attack, (\d+)% chance to auto-attack next enemy. Can chain multiple times.?$/.exec(text);
            return `失准狂潮：自动攻击未命中时，有${res[1]}%的几率自动攻击下一个敌人，并且可以连续触发多次`;
        }
        // Fury: On hit, increases accuracy and damage by (\d+\.?\d*)% for 15s, stacking up to 5 times. Lose half stacks on miss.
        if (/^Fury: On hit, increases accuracy and damage by (\d+\.?\d*)% for 15s, stacking up to 5 times. Lose half stacks on miss.?$/.test(text)) {
            let res = /^Fury: On hit, increases accuracy and damage by (\d+\.?\d*)% for 15s, stacking up to 5 times. Lose half stacks on miss.?$/.exec(text);
            return `狂怒：每次命中时，提升${res[1]}%的精准度和伤害，持续15秒，最多叠加5次。未命中时，层数减半`;
        }
        // Ripple: On ability cast, 18% chance to reduce all ability cooldowns by 2s.
        if (/^Ripple: On ability cast, (\d+)% chance to reduce all ability cooldowns by 2s(?: and restore 10 MP)?\.?.?$/.test(text)) {
            let res = /^Ripple: On ability cast, (\d+)% chance to reduce all ability cooldowns by 2s(?: and restore 10 MP)?\.?.?$/.exec(text);
            // 检查是否包含 MP 恢复部分
            const hasMp = text.includes('and restore 10 MP');
            return `涟漪：释放技能时，有${res[1]}%的机率使所有技能冷却时间减少2秒${hasMp ? '并恢复 10 MP' : ''}`;
        }
        // Bloom: On ability cast, 40% chance to heal lowest HP% ally for 10+20% magic damage.
        if (/^Bloom: On ability cast, (\d+)% chance to heal lowest HP% ally for 10HP\+15% magic damage.?$/.test(text)) {
            let res = /^Bloom: On ability cast, (\d+)% chance to heal lowest HP% ally for 10HP\+15% magic damage.?$/.exec(text);
            return `绽放：释放技能时，有${res[1]}%的机率为HP百分比最低的队友治疗10HP+15%魔法伤害`;
        }
        // Blaze: On ability cast, 25% chance to attack all enemies for 30% magic damage.
        if (/^Blaze: On ability cast, (\d+)% chance to attack all enemies for 30% magic damage.?$/.test(text)) {
            let res = /^Blaze: On ability cast, (\d+)% chance to attack all enemies for 30% magic damage.?$/.exec(text);
            return `炽焰：释放技能时，有${res[1]}%的机率对所有敌人造成30%魔法伤害`;
        }

        console.error(`无法匹配装备技能：${text}`);
        return text;
    }

    // 频道英文到中文的映射
    const chats = {
        General: '国际',
    };

    // 商店英文到中文的映射
    const othershop = {
        General: '杂货',
    };

    // 职位英文到中文的映射
    const titleMap = {
        Member: '成员',
        Leader: '会长',
        General: '将军',
        Officer: '官员'
    };

    let originalText = text.trim(); // 确保 text 变数没有前后空格

    // 检查是否在频道区域，确保 "General" 只在这里翻译为 "国际"
    if (node.parentNode.closest('.GamePage_chatPanel__mVaVt') ||
        node.parentNode.closest('.Chat_tabsComponentContainer__3ZoKe')) {
        if (originalText === 'General') { // ✅ 直接比对大小写一致的 "General"
            return chats.General;
        }
    }

    // 检查是否在商店区域，确保 "General" 只在这里翻译为 "杂货"
    if (node.parentNode.closest('.NavigationBar_nav__3uuUl') ||
        node.parentNode.closest('.ShopPanel_tabsComponentContainer__3z6R4')) {
        if (originalText === 'General') { // ✅ 直接比对大小写一致的 "General"
            return othershop.General;
        }
    }

    // 检查是否在职位区域，确保 "General" 在这里翻译为 "将军"
    if (node.parentNode.closest('.SharableProfile_overviewTab__W4dCV') ||
        node.parentNode.closest(".GuildPanel_membersTable__1NwIX")) {

        // 避免将 "General of" 错误翻译
        let titles = Object.keys(titleMap); // ['Member', 'Leader', 'General', 'Officer']
        for (let title of titles) {
            let titleWithOf = title + ' of'; // 构建 "xxx of" 字串
            let index = originalText.indexOf(titleWithOf); // 查找职位首码的位置

    // 如果找到了职位首码
    if (index !== -1){
            let titleText = originalText.substring(index + titleWithOf.length).trim(); // 截取后面的文本
            return `${titleText} ${titleMap[title]}`; // 返回翻译后的文本
        }
    }

    // 确保独立 "General" 翻译为 "将军"
    if (originalText === 'General') {
        return titleMap.General;
        }
    }

    // 翻译栏位特例
    if (node.parentNode.matches('.ItemSelector_label__22ds9')){
        if (text.toLowerCase() === "back") {
            return `背部`;
        }
    }
    if (node.parentNode.matches('.LoadoutsPanel_emptySlot__5zshO')){
        if (text.toLowerCase() === "back") {
            return `背部`;
        }
    }
    if (node.parentNode.matches('.TabsComponent_badge__1Du26')){
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

    if (node.parentNode.matches('.Button_button__1Fe9z.Button_fullWidth__17pVU')){
        if (text.toLowerCase() === "back") {
            return `返回`;
        }
    }

    //特殊处理技能效果
    if (((node.nodeName !== "#text" && (node.matches('[class^="Ability_abilityDetail"] *') || node.matches('[class^="ItemTooltipText_abilityDetail"] *'))) ||
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

    //特殊处理触发器详细资讯
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
        return "设为【" + cnItem(res[2], node) + "】的默认方案";
    }

    // You have reached 32 Enhancing
    if (/^You have reached (\d+) (.+)$/.test(text)) {
        let res = /^You have reached (\d+) (.+)$/.exec(text);
        return "你已到达 " + cnItem(res[1], node) + " 级 " + cnItem(res[2], node);
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
    if (/^(Gather|Produce|Fight|Repeat|Enhance)(?: up to)? (\d+|∞) times$/.test(text)) {
        let res = /^(Gather|Produce|Fight|Repeat|Enhance)(?: up to)? (\d+|∞) times$/.exec(text);
        return cnItem(res[1], node) + " " + cnItem(res[2], node) + " 次";
    }

    // like "Add Queue #2"
    if (/^Add Queue #(\d+)$/.test(text)) {
        let res = /^Add Queue #(\d+)$/.exec(text);
        return "加入伫列 #" + res[1];
    }

    // 你离线了 xxx时间
    // 你已离线至当前上限 xxx时间
    // 处理两种离线相关文本情况
    if (/^(You were offline for|You made progress for)(.+)$/.test(text)) {
        let res = /^(You were offline for|You made progress for)(.+)$/.exec(text);
        return cnItem(res[1], node) + res[2];
    }

    // 解析购买物品
    // 购买物品
    if (/^Bought (\d+) ([A-Za-z\s\-\+]+)$/.test(text)) {
        let res = /^Bought (\d+) ([A-Za-z\s\-\+]+)$/.exec(text);

        return `购买 ${cnItem(res[2], node)} 【 ${res[1]} 】`;
    }

    // 购买花费金币
    if (/^Spent (\d+) Coins$/.test(text)) {
        let res = /^Spent (\d+) Coins$/.exec(text);

        return `支付 ${res[1]} 金币`;
    }

    // 卖出物品
    if (/^Sold (\d+) ([A-Za-z\s\-\+]+)$/.test(text)) {
        let res = /^Sold (\d+) ([A-Za-z\s\-\+]+)$/.exec(text);
        return `卖出 ${cnItem(res[2], node)} 【 ${res[1]} 】`;
    }

    // 收到金币
    if (/^Received (\d+) Coins$/.test(text)) {
        let res = /^Received (\d+) Coins$/.exec(text);
        return `获得 ${res[1]} 金币`;
    }

    // "Hi wilsonhe1, Welcome to Milky Way": "嗨，wilsonhe1，欢迎来到牛牛银河",
    if (/^Hi (.+), Welcome to Milky Way$/.test(text)) {
        let res = /^Hi (.+), Welcome to Milky Way$/.exec(text);
        return "嗨，" + res[1] + "，欢迎来到《银河牛牛》";
    }
    // "Ok wilsonhe1, I have to go now. It's time for my second lunch, and I have four stomachs to fill. Now go explore the Milky Way": "好的，wilsonhe1，我现在要走了。是我第二顿午餐的时间了，我有四个胃要填饱。现在去探索牛牛银河吧",
    if (/^Ok (.+), I have to go now. It's time for my second lunch, and I have four stomachs to fill. Now go explore the Milky Way$/.test(text)) {
        let res = /^Ok (.+), I have to go now. It's time for my second lunch, and I have four stomachs to fill. Now go explore the Milky Way$/.exec(text);
        return "好的，" + res[1] + "，我现在要走了。是我第二顿午餐的时间了，我有四个胃要填饱。现在去探索《银河牛牛》吧";
    }


    // Level 3 Log Shed constructed
    if (/^Level ([0-9]*) ([A-Za-z\s]*) constructed$/.test(text)) {
        let res = /^Level ([0-9]*) ([A-Za-z\s]*) constructed$/.exec(text);
        return cnItem(res[2], node)+"【 等级"+res[1]+" 】已建成";
    }

    // Sell For 20000 Coins
    if (/^Sell For (\S+) Coins$/.test(text)) {
        let res = /^Sell For (\S+) Coins$/.exec(text);
        return "卖出 " + res[1] + " 金币";
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


    // 封装替换 title 属性的函数
    function replaceElementTitle(selector, newTitle) {
        const element = document.querySelector(selector);
        if (element) {
            element.title = newTitle;
        }
    }

    // 执行替换 title 属性的操作
    replaceElementTitle('[title="Clear all sessions"]', '清除所有数据');
    replaceElementTitle('[title="Toggle panel display"]', '隐藏');
    replaceElementTitle('[title="Toggle Enhancement Tracker"]', '切换浮动面板');
    replaceElementTitle('[title="Toggle Sound"]', '切换声音');
    replaceElementTitle('[title="Show total cost"]', '显示总成本');

    //任務特例处理部分
    const labelElements = document.querySelectorAll('.TasksPanel_label__8G9eC');

    labelElements.forEach((node) => {
        // 检查父级祖先是否包含 TasksPanel_tasksPanel__Rtqit
        if (!node.parentNode.closest('.TasksPanel_tasksPanel__Rtqit')) return;

        // 检查是否存在平级的 TaskBlockSlot_taskBlockSlot__1WF3H 元素
        const hasPeerTaskBlock = node.parentNode.querySelector('.TaskBlockSlot_taskBlockSlot__1WF3H')!== null;
        if (!hasPeerTaskBlock) return;

        // 收集文本节点内容，跳过 <br>
        const textNodes = Array.from(node.childNodes).filter(
            (child) => child.nodeType === Node.TEXT_NODE
        );
        const combinedText = textNodes.map((textNode) => textNode.textContent.trim()).join(' ');

        // 创建新 div 并替换原节点
        const newDiv = document.createElement('div');
        newDiv.textContent = `《 屏蔽专业 》`; // 最终合并内容
        node.replaceWith(newDiv);
    });

    // 角色删除说明
    if ( /^Follow the instructions to permanently delete this character "(.+?)". This action cannot be undone. You must exit party and guild before proceeding. Type the exact name of the character to confirm deletion$/.test(text)) {
        let res = /^Follow the instructions to permanently delete this character "(.+?)". This action cannot be undone. You must exit party and guild before proceeding. Type the exact name of the character to confirm deletion$/.exec(text);
        return `⚠️ 永久删除角色【${res[1]}】!!! 此操作无法撤销。在继续此操作之前，你必须先退出队伍和公会，并输入角色的准确名称以确认删除。`;
    }


    // 调试翻译时可以打开此处列印
    console.log(text);

    return baseTranslate(text);
};

function translateAbilityEffect(text, node) {
    if (text.endsWith(".")) {
        text = text.slice(0, -1);
    }

    // "Attacks enemy for 10HP+60% stab damage as physical damage": "对敌人造成10HP + 60% 刺击伤害的物理伤害",
    // "Attacks enemy for 20HP+90% stab damage as physical damage": "对敌人造成20HP + 90% 刺击伤害的物理伤害",
    // "Attacks enemy for 30HP+110% stab damage as physical damage. Decreases target's armor by -20% for 10s": "对敌人造成30HP + 110% 刺击伤害的物理伤害。使目标的护甲降低 -20%，持续10秒",
    // "Attacks enemy for 10HP+60% slash damage as physical damage": "对敌人造成10HP + 60% 斩击伤害的物理伤害",
    // "Attacks all enemies for 20HP+50% slash damage as physical damage": "对所有敌人造成20HP + 50% 斩击伤害的物理伤害",
    // "Attacks enemy for 10HP+60% smash damage as physical damage": "对敌人造成10HP + 60% 粉碎伤害的物理伤害",
    // "Attacks all enemies for 20HP+50% smash damage as physical damage": "对所有敌人造成20HP + 50% 粉碎伤害的物理伤害",
    // "Attacks enemy for 10HP+55% ranged damage as physical damage": "对敌人造成10HP + 55% 远程伤害的物理伤害",
    // "Attacks enemy for 20HP+90% ranged damage as water damage": "对敌人造成20HP + 90% 远程伤害的水属性伤害",
    // "Attacks enemy for 20HP+90% ranged damage as fire damage": "对敌人造成20HP + 90% 远程伤害的火属性伤害",
    // "Attacks all enemies for 20HP+50% ranged damage as physical damage": "对所有敌人造成20HP + 50% 远程伤害的物理伤害",
    // "Attacks enemy for 10HP+55% magic damage as water damage": "对敌人造成10HP + 55% 魔法伤害的水属性伤害",
    // "Attacks enemy for 20HP+120% magic damage as water damage. Decreases target's attack speed by -25% for 8s": "对敌人造成20HP + 120% 魔法伤害的水属性伤害。使目标的攻击速度降低 -25%，持续8秒",
    // "Attacks all enemies for 30HP+100% magic damage as water damage. Decreases target's evasion by -20% for 9s": "对所有敌人造成30HP + 100% 魔法伤害的水属性伤害。使目标的闪避率降低 -20%，持续9秒",
    // "Attacks all enemies for 20HP+80% magic damage as nature damage. Decreases target's armor by -12 for 12s. Decreases target's water resistance by -15 for 12s. Decreases target's nature resistance by -20 for 12s. Decreases target's fire resistance by -15 for 12s": "对所有敌人造成20点HP + 80% 魔法伤害的自然属性伤害。使目标的护甲降低 -12，持续12秒。使目标的水属性抗性降低 -15，持续12秒。使目标的自然属性抗性降低 -20，持续12秒。使目标的火属性抗性降低 -15，持续12秒",
    // "Attacks enemy for 10HP+55% magic damage as fire damage": "对敌人造成10点HP + 55% 魔法伤害的火属性伤害",
    // "Attacks all enemies for 20HP+80% magic damage as fire damage": "对所有敌人造成20点HP + 80% 魔法伤害的火属性伤害",
    let reg = /^Attacks (enemy|all enemies) for ([\d.]+(?:HP|MP|%|s)?)\+([\d.]+(?:HP|MP|%|s)?) ([a-zA-Z ]+) as ([a-zA-Z ]+)$/;
    if (reg.test(text)) {
        let res = reg.exec(text);
        return "对" + cnItem(res[1], node) + "造成 " + res[2] + " + " + res[3] + " " + cnItem(res[4], node) + "（" + cnItem(res[5], node) + "）" ;
    }

    // "Attacks enemy for 30HP+110% stab damage as physical damage. Decreases target's armor by -20% for 10s": "对敌人造成30HP + 110% 刺击伤害的物理伤害。使目标的护甲降低 -20%，持续10秒",
    // "Attacks enemy for 20HP+120% magic damage as water damage. Decreases target's attack speed by -25% for 8s": "对敌人造成20HP + 120% 魔法伤害的水属性伤害。使目标的攻击速度降低 -25%，持续8秒",
    // "Attacks all enemies for 30HP+100% magic damage as water damage. Decreases target's evasion by -20% for 9s": "对所有敌人造成30HP + 100% 魔法伤害的水属性伤害。使目标的闪避率降低 -20%，持续9秒",
    // "Attacks all enemies for 20HP+80% magic damage as nature damage. Decreases target's armor by -12 for 12s. Decreases target's water resistance by -15 for 12s. Decreases target's nature resistance by -20 for 12s. Decreases target's fire resistance by -15 for 12s": "对所有敌人造成20点HP + 80% 魔法伤害的自然属性伤害。使目标的护甲降低 -12，持续12秒。使目标的水属性抗性降低 -15，持续12秒。使目标的自然属性抗性降低 -20，持续12秒。使目标的火属性抗性降低 -15，持续12秒",
    reg = /^Decreases target's ([a-zA-Z ]+) by (-[\d.]+?(?:HP|MP|%|s)?) for ([\d.]+(?:HP|MP|%|s)?)$/;
    if (reg.test(text)) {
        let res = reg.exec(text);
        return "並使其" + cnItem(res[1], node) + "降低 " + res[2] + " 持续 " + res[3];
    }

    // "Attacks enemy for 30HP+100% smash damage as physical damage and 70% chance to stun for 3s": "对敌人造成30HP + 100% 粉碎伤害的物理伤害，并有70%的几率眩晕3秒",
    // "Attacks enemy for 30HP+100% ranged damage as physical damage and 60% chance to silence for 5s": "对敌人造成30HP + 100% 远程伤害的物理伤害，并有60%的几率沉默5秒",
    // "Attacks enemy for 10HP+90% magic damage as nature damage and 40% chance to stun for 3s": "对敌人造成10HP + 90% 魔法伤害的自然属性伤害，并有40%的几率眩晕3秒",
    // "Attacks all enemies for 30HP+100% magic damage as nature damage and 60% chance to blind for 5s": "对所有敌人造成30HP + 100% 魔法伤害的自然属性伤害，并有60%的几率致盲5秒",
    reg = /^Attacks (enemy|all enemies) for ([\d.]+(?:HP|MP|%|s)?)\+([\d.]+(?:HP|MP|%|s)?) ([a-zA-Z ]+) as ([a-zA-Z ]+) and ([\d.]+(?:HP|MP|%|s)?) chance to ([a-zA-Z ]+) for ([\d.]+(?:HP|MP|%|s)?)$/;
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


    // "Attacks enemy with 200% total accuracy for 30HP+100% ranged damage as physical damage": "对敌人以200%总命中率造成30HP + 100%远程伤害作为物理伤害",
    reg = /^Attacks (enemy|all enemies) with ([\d.]+(?:HP|MP|%|s)?) ([a-zA-Z ]+) for ([\d.]+(?:HP|MP|%|s)?)\+([\d.]+(?:HP|MP|%|s)?) ([a-zA-Z ]+) as ([a-zA-Z ]+)$/;
    if (reg.test(text)) {
        let res = reg.exec(text);
        return "对" + cnItem(res[1], node) + "以 " + res[2] + " " + cnItem(res[3], node) + "造成 " + res[4] + " + " + res[5] + " " + cnItem(res[6], node) + "（" + cnItem(res[7], node) + "）";
    }

    // "Heals self for 20HP+30% magic damage": "为自己恢复20HP + 30% 魔法伤害",
    // "Heals self for 30HP+45% magic damage": "为自己恢复30HP + 45% 魔法伤害",
    // "Heals lowest HP ally for 40HP+25% magic damage": "为HP最低的隊友恢复40点HP + 25% 魔法伤害",
    // "Heals all allies for 30HP+25% magic damage": "为所有隊友恢复30点HP + 25% 魔法伤害",
    reg = /^Heals (self|all allies|lowest HP ally) for ([\d.]+(?:HP|MP|%|s)?)\+([\d.]+(?:HP|MP|%|s)?) ([a-zA-Z ]+)$/;
    if (reg.test(text)) {
        let res = reg.exec(text);
        return "对" + cnItem(res[1], node) + "恢复 " + res[2] + " + " + res[3] + " " + cnItem(res[4], node);
    }

    // "Increases all allies' critical rate by 3% for 120s": "增加所有隊友的暴击率3%，持续120秒",
    // "Increases all allies' nature amplify by 6% for 120s. Increases all allies healing amplify by 6% for 120s. Increases all allies nature resistance by 4 for 120s": "增加所有隊友的自然属性强化6%，持续120秒。增加所有隊友的治疗强化6%，持续120秒。增加所有隊友的自然属性抗性4，持续120秒",
    // "Increases all allies' attack speed by 3% for 120s. Increases all allies cast speed by 3% for 120s": "增加所有隊友的攻击速度3%，持续120秒。增加所有隊友的施法速度3%，持续120秒",
    // "Increases all allies' physical amplify by 6% for 120s. Increases all allies armor by 4 for 120s": "增加所有隊友的物理强化6%，持续120秒。增加所有隊友的护甲4，持续120秒",
    // "Increases all allies' water amplify by 8% for 120s. Increases all allies water resistance by 4 for 120s": "增加所有隊友的水属性强化8%，持续120秒。增加所有隊友的水属性抗性4，持续120秒",
    // "Increases all allies' fire amplify by 8% for 120s. Increases all allies fire resistance by 4 for 120s": "增加所有隊友的火属性强化8%，持续120秒。增加所有隊友的火属性抗性4，持续120秒",
    reg = /^Increases all allies' ([a-zA-Z ]+) by ([\d.]+(?:HP|MP|%|s)?) for (\d+)s$/;
    if (reg.test(text)) {
        let res = reg.exec(text);
        return "增加所有隊友的" + cnItem(res[1], node) + " " + res[2] + " 持续 " + res[3] +" 秒" ;
    }

    // "Increases threat by 250% for 60s": "增加250%的威胁等级，持续60秒",
    // "Increases threat by 500% for 60s": "增加500%的威胁等级，持续60秒",
    // "Increases evasion by 20% for 20s": "增加20%的闪避，持续20秒",
    // "Increases accuracy by 30% for 20s": "增加30%的精准度，持续20秒",
    // "Increases physical amplify by 18% for 20s": "增加18%的物理强化，持续20秒",
    // "Increases attack speed by 20% for 20s": "增加20%的攻击速度，持续20秒",
    // "Increases physical thorns by 20% for 20s": "增加20%的物理反伤，持续20秒",
    // "Increases elemental thorns by 20% for 20s": "增加20%的魔法反伤，持续20秒",
    // "Increases life steal by 8% for 20s": "增加8%的生命偷取，持续20秒",
    // "Increases water amplify by 40% for 20s. Increases nature amplify by 40% for 20s. Increases fire amplify by 40% for 20s": "增加40%的水属性强化，持续20秒。增加40%的自然属性强化，持续20秒。增加40%的火属性强化，持续20秒",
    // "Increases damage by 30% for 12s. Increases attack speed by 30% for 12s. Increases cast speed by 30% for 12s": "增加30%的伤害，持续12秒。增加30%的攻击速度，持续12秒。增加30%的施法速度，持续12秒",
    // "Increases armor by 700 for 12s. Increases water resistance by 700 for 12s. Increases nature resistance by 700 for 12s. Increases fire resistance by 700 for 12s. Increases tenacity by 700 for 12s": "增加700的护甲，持续12秒。增加700的水属性抗性，持续12秒。增加700的自然属性抗性，持续12秒。增加700的火属性抗性，持续12秒。增加700的韧性，持续12秒",
    reg = /^Increases ([a-zA-Z ]+) by ([\d.]+(?:HP|MP|%|s)?) for (\d+)s$/;
    if (reg.test(text)) {
        let res = reg.exec(text);
        return "增加" + cnItem(res[1], node) + " " + res[2] + " 持续 " + res[3] + " 秒" ;
    }

    // "Increases armor by 20%+20 for 20s. Increases water resistance by 20%+20 for 20s. Increases nature resistance by 20%+20 for 20s. Increases fire resistance by 20%+20 for 20s": "增加20% + 20的护甲，持续20秒。增加20% + 20的水属性抗性，持续20秒。增加20% + 20的自然属性抗性，持续20秒。增加20% + 20的火属性抗性，持续20秒",
    reg = /^Increases ([a-zA-Z ]+) by ([\d.]+(?:HP|MP|%|s)?)\+([\d.]+(?:HP|MP|%|s)?) for (\d+)s$/;
    if (reg.test(text)) {
        let res = reg.exec(text);
        return "增加" + cnItem(res[1], node) + " " + res[2] + " + " + res[3] + " 持续 " + res[4] + " 秒" ;
    }

    // "Revives and heals a defeated ally for 100HP+40% magic damage": "复活并为一个战败的隊友恢复100点HP + 40% 魔法伤害",
    reg = /^Revives and heals a defeated ally for ([\d.]+(?:HP|MP|%|s)?)\+([\d.]+(?:HP|MP|%|s)?) ([a-zA-Z ]+)$/;
    if (reg.test(text)) {
        let res = reg.exec(text);
        return "复活吧~我的勇士!!!恢复" + res[1] + " + " + res[2] + "魔法伤害";
    }

    // "Costs 30% of current HP": "消耗当前HP的30%",
    reg = /^Costs ([\d.]+(?:HP|MP|%|s)?) of current HP$/;
    if (reg.test(text)) {
        let res = reg.exec(text);
        return "消耗当前HP的 " + res[1];
    }

    // "70% chance to stun for 3s": "有 70% 几率 眩晕，持续 3 秒",
    // "10% chance to stun for 2s": "有 10% 几率 眩晕，持续 2 秒",
    // "60% chance to silence for 5s": "有 60% 几率 沉默，持续 5 秒",
    // "50% chance to blind for 5s": "有 50% 几率 失明，持续 5 秒",
    reg = /^(\d+)% chance to (\w+) for (\d+)s$/;
    if (reg.test(text)) {
        let res = reg.exec(text);
        return "并有 " + res[1] + "% 机率造成" + cnItem(res[2], node) + "，持续 " + res[3] + " 秒";
    }

    // "100% chance to pierce": "有 100% 几率贯穿敌人",
    reg = /^(\d+)% chance to (\w+)$/;
    if (reg.test(text)) {
        let res = reg.exec(text);
        return "并有 " + res[1] + "% 机率" + cnItem(res[2], node) + "敌人" ;
    }

    //bleeds for 100% dealt damage over 15s": "并在 15 秒内造成等同于所造成伤害 100% 的流血伤害",
    //burns for 100% dealt damage over 10s": "并在 10 秒内造成等同于所造成伤害 100% 的燃烧伤害",
    reg = /^(\w+)s for (\d+)% dealt damage over (\d+)s$/;
    if (reg.test(text)) {
        let res = reg.exec(text);
        return "并在 " + res[3] + " 秒内造成等同于所造成伤害 " + res[2] + "% 的" + cnItem(res[1], node) + "伤害";
    }

    //盾击
    //"Bonus damage equal to 60% armor": "并造成等同60%护甲的额外伤害",
    reg = /^Bonus damage equal to (\d+)% armor$/;
    if (reg.test(text)) {
        let res = reg.exec(text);
        return "并造成等同 " + res[1] + " %护甲的额外伤害";
    }

    //碎裂冲击
    //"Increases target's damage taken by 5% for 12s": "增加目标敌人所受伤害5%，持续12秒",
    reg = /^Increases target's damage taken by (\d+)% for (\d+)s$/;
    if (reg.test(text)) {
        let res = reg.exec(text);
        return "增加目标敌人所受伤害 " + res[1] + "% ，持续 " + res[2] + " 秒";
    }

    //生命吸取
    //"Drains 10% of dealt damage as HP": "吸取所造成伤害的 10% 转化为自身HP",
    reg = /^Drains (\d+)% of dealt damage as HP$/;
    if (reg.test(text)) {
        let res = reg.exec(text);
        return "吸取所造成伤害的 " + res[1] + "% 转化为自身HP";
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
    //漢化靜態頁面內容
    TransSubTextNode(targetNode);
    transTaskMgr.doTask();
    //監聽頁面變化並漢化動態內容
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
        //console.log("捕獲到頁面變化並執行漢化，耗時" + (afterTransTime - beforeTransTime) + "毫秒");
    });
    observer.observe(targetNode, observer_config);

})();

let reverseTranslates = {};

for (let trans of [tranItemCurrencies, tranItemResources, tranItemConsumable, tranItemBook, tranItemEquipment, tranItemTool, tranItemBox,tranAccessories,tranKeys]) {
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

    if (node.placeholder === "Guild Name") {
        node.placeholder = "公会名称";
    }

}


// 监听 DOM 变化，检测并替换搜索框
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
            if (node.nodeType === 1) {
                if (node.matches(`input.Input_input__2-t98`)) {
                    console.log('匹配到 input.Input_input__2-t98 元素');
                    replaceSearchIfNeeded(node);
                }
                node.querySelectorAll(`input.Input_input__2-t98`).forEach((child) => {
                    replaceSearchIfNeeded(child);
                });
            }
        });
    });
});
observer.observe(document.body, { childList: true, subtree: true, attributes: false, characterData: false });

// **封装替换逻辑**
function replaceSearchIfNeeded(inputElement) {
    const targetClasses = [
        ".MarketplacePanel_marketListings__1GCyQ",
        ".Inventory_inventory__17CH2",
        ".SkillActionDetail_primaryItemSelectorContainer__nrvNW",
        ".ItemSelector_emptySlot__1ns6h",
        ".ItemSelector_menu__12sEM",
        ".ShopPanel_itemFilterContainer__1raSg"
    ];

    for (const targetClass of targetClasses) {
        if (inputElement.closest(targetClass)) {
            if (inputElement.closest(".MarketplacePanel_input__3h1Yt")) {
                console.log(`跳过 .MarketplacePanel_input__3h1Yt 内的搜索框`);
                return;
            }
            console.log(`匹配到目标类 ${targetClass}，准备替换搜索框`);
            replaceSearchBar(inputElement, targetClass);
            return;
        }
    }
}

// **替换搜索框**
function replaceSearchBar(oriSearchBar, areaSelector) {
    oriSearchBar.style.display = "none";
    oriSearchBar.insertAdjacentHTML("afterend", `<div><input class="script-custom-search-input" type="text" placeholder="阿茶的搜索框" style="font-size: 17px; font-family: "Microsoft YaHei"></div>`);
    const input = oriSearchBar.parentNode.querySelector(`input.script-custom-search-input`);

    const logPrefixMap = {
        ".MarketplacePanel_marketListings__1GCyQ": "Custom search marketplace panel market listings",
        ".Inventory_inventory__17CH2": "Custom search inventory",
        ".ItemSelector_emptySlot__1ns6h": "Custom search item selector empty slot",
        ".SkillActionDetail_primaryItemSelectorContainer__nrvNW": "Custom search skill action detail selector",
        ".ItemSelector_menu__12sEM": "Custom search item selector menu",
        ".ShopPanel_itemFilterContainer__1raSg": "Custom search shop panel item filter"
    };

    const logPrefix = logPrefixMap[areaSelector];

    input.addEventListener("input", function () {
        console.log(`${logPrefix}: ${input.value}`);
        customSearch(areaSelector, input.value);
    });

    const clickableAreas = [
        ".Inventory_inventory__17CH2",
        ".MarketplacePanel_marketListings__1GCyQ",
        ".ShopPanel_itemFilterContainer__1raSg",
    ];
    if (clickableAreas.includes(areaSelector)) {
        document.querySelector(areaSelector)?.addEventListener("click", function () {
            setTimeout(function () {
                console.log(`${logPrefix}: ${input.value}`);
                customSearch(areaSelector, input.value);
            }, 100);
        });
    }
}

// **搜索处理逻辑**
function customSearch(areaElementSelector, keyword) {
    let items;
    const itemListContainers = [
        ".ItemSelector_itemList__Qa5lq",
        ".ItemSelector_wider__356rn",
    ];

    if (areaElementSelector === ".ItemSelector_menu__12sEM") {
        itemListContainers.forEach((containerClass) => {
            const container = document.querySelector(`${areaElementSelector} ${containerClass}`);
            if (container) {
                items = container.querySelectorAll(".Item_itemContainer__x7kH1");
                processItems(items, keyword, areaElementSelector);
            }
        });
    } else if (areaElementSelector === ".MarketplacePanel_marketListings__1GCyQ") {
        items = document.querySelectorAll(`${areaElementSelector} .Item_itemContainer__x7kH1`);
        processItems(items, keyword, areaElementSelector);
    } else if (areaElementSelector === ".Inventory_inventory__17CH2") {
        items = document.querySelectorAll(`${areaElementSelector} .Item_itemContainer__x7kH1`);
        processItems(items, keyword, areaElementSelector);
    } else if (areaElementSelector === ".ShopPanel_itemFilterContainer__1raSg") {
        items = document.querySelectorAll(`${areaElementSelector} ~ .ShopPanel_shopItem__10Noo .ShopPanel_name__3vA-H`);
        processShopPanelItems(items, keyword);
    } else {
        items = document.querySelector(areaElementSelector)?.querySelectorAll(".Item_itemContainer__x7kH1");
        processItems(items, keyword, areaElementSelector);
    }
}

// **处理搜索结果（原逻辑）**
function processItems(items, keyword, areaElementSelector) {
    if (!items) return;

    const isPopupArea = [
        ".ItemSelector_emptySlot__1ns6h",
        ".SkillActionDetail_primaryItemSelectorContainer__nrvNW",
        ".ItemSelector_menu__12sEM"
    ].includes(areaElementSelector);

    for (const item of items) {
        if (!keyword) {
            if (isPopupArea) {
                item.parentNode.style.display = "block";
            } else {
                item.style.display = "block";
            }
            continue;
        }
        let enName;
        const svg = item.querySelector("svg");
        if (svg) {
            enName = svg.getAttribute("aria-label");
        }
        if (!enName) {
            const span = item.querySelector("span");
            if (span) {
                enName = span.textContent.trim();
            }
        }
        if (!enName) continue;

        const zhName = translates[enName.toLowerCase()];

        const keywordLower = keyword.toLowerCase();
        const enNameLower = enName.toLowerCase();

        if (zhName && zhName.includes(keyword) || enNameLower.includes(keywordLower)) {
            if (isPopupArea) {
                item.parentNode.style.display = "block";
            } else {
                item.style.display = "block";
            }
        } else {
            if (isPopupArea) {
                item.parentNode.style.display = "none";
            } else {
                item.style.display = "none";
            }
        }
    }
}


// **處理 ShopPanel 搜索結果**
function processShopPanelItems(items, keyword) {
    if (!items) return;

    // 关键词
    const keywordTrimmed = keyword.toLowerCase();

    // 遍歷測試服商店.ShopPanel_shopItem__10Noo及子節點.ShopPanel_name__3vA-H
    items.forEach((item) => {
        const parentItem = item.closest('.ShopPanel_shopItem__10Noo');
        if (!parentItem) return;

        const nameElement = parentItem.querySelector('.ShopPanel_name__3vA-H');
        if (!nameElement) return;

        // 获取名称
        const itemName = nameElement.textContent.toLowerCase();

        // 通过反向映射对象查找英文名称
        /* 两种方式的优缺点
        1.使用反向映射对象 reverseTranslates：
        优点：查找速度快，时间复杂度低，尤其是在 translates 对象很大的情况下，性能优势明显。
        缺点：需要额外的内存来存储反向映射对象。
        2. 直接遍历 translates 对象：
        优点：不需要额外的内存来存储反向映射对象，代码实现相对简单。
        缺点：查找速度慢，时间复杂度高，当 translates 对象很大时，性能会显著下降。
        */
        let enName = reverseTranslates[itemName] || '';

        // 检查是否匹配关键词
        /*
        1. matchChinese 赋值有误
        当前代码中 const matchChinese = translates[enName.toLowerCase()]; 这一行存在逻辑问题。
        translates[enName.toLowerCase()] 返回的是英文对应的中文翻译，而不是一个布尔值来表示是否匹配中文搜索关键词。
        应该使用 itemName.includes(keywordTrimmed) 来判断中文名称是否包含关键词。
        2. 可能的大小写匹配问题
        虽然代码中对关键词和获取到的名称都进行了小写转换，但在实际使用中，
        需要确保 translates 和 reverseTranslates 中的键值对也进行了一致的大小写处理，
        否则可能会出现匹配不准确的情况。
        */
        const enNameLower = enName.toLowerCase();
        const matchChinese = itemName.includes(keywordTrimmed);
        const matchEnglish = enNameLower.includes(keywordTrimmed);
        const match = matchChinese || matchEnglish;

        if (match) {
            // 匹配时显示元素
            parentItem.style.display = '';
        } else {
            // 不匹配时隐藏元素
            parentItem.style.display = 'none';
        }
    });
}
//搜索框結束

// BUTTON选择
(function() {
    'use strict';

    // 角色名称数组（与按钮顺序一致）
    const characterNames = ['标准', '铁牛1', '铁牛2', '铁牛3'];
    const baseUrl = 'https://www.milkywayidle.com';
    const storageKey = 'characterIds_milkyway';
    let isMenuExpanded = false; // 菜单展开状态标记
    let menuContainer; // 下拉菜单容器
    let mainButton; // 主按钮引用

    // 从本地存储加载角色ID
    function loadCharacterIds() {
        const savedIds = localStorage.getItem(storageKey);
        return savedIds ? JSON.parse(savedIds) : new Array(characterNames.length).fill(null);
    }

    // 保存角色ID到本地存储
    function saveCharacterIds(ids) {
        localStorage.setItem(storageKey, JSON.stringify(ids));
    }

    // 从URL提取characterId
    function extractIdFromUrl() {
        const url = window.location.href;
        const match = url.match(/characterId=(\d+)/);
        return match ? match[1] : null;
    }

    // 创建折叠按钮和下拉菜单
    function createCollapsibleMenu(characterIds) {
        // 创建主折叠按钮
        mainButton = document.createElement('a');
        mainButton.innerHTML = '角色切换 <span class="arrow">▼</span>';
        mainButton.style.position = 'fixed';
        mainButton.style.top = '32px';
        mainButton.style.left = '73%';
        mainButton.style.transform = 'translateX(-50%)';
        mainButton.style.zIndex = '9999';
        mainButton.style.display = 'flex';
        mainButton.style.alignItems = 'center';
        mainButton.style.gap = '5px';
        mainButton.style.padding = '8px 12px';
        mainButton.style.borderRadius = '5px';
        mainButton.style.backgroundColor = 'rgba(122, 122, 213, 0.7)';
        mainButton.style.color = 'white';
        mainButton.style.border = 'none';
        mainButton.style.fontSize = '14px';
        mainButton.style.fontWeight = '500';
        mainButton.style.textDecoration = 'none';
        mainButton.style.cursor = 'pointer';
        mainButton.style.whiteSpace = 'nowrap';
        mainButton.style.transition = 'all 0.2s';

        // 添加箭头样式
        const arrowStyle = document.createElement('style');
        arrowStyle.textContent = `
            .arrow {
                font-size: 12px;
                transition: transform 0.3s ease;
                margin-left: 5px;
            }
            .arrow.up {
                transform: rotate(180deg);
            }
        `;
        document.head.appendChild(arrowStyle);

        // 创建下拉菜单容器
        menuContainer = document.createElement('div');
        menuContainer.style.position = 'fixed';
        menuContainer.style.top = '72px';
        menuContainer.style.left = '73%';
        menuContainer.style.transform = 'translateX(-50%)';
        menuContainer.style.zIndex = '9998';
        menuContainer.style.display = 'flex';
        menuContainer.style.flexDirection = 'column';
        menuContainer.style.gap = '5px';
        menuContainer.style.padding = '0';
        menuContainer.style.borderRadius = '5px';
        menuContainer.style.backgroundColor = 'rgba(221, 205, 205, 0.7)';
        menuContainer.style.maxHeight = '0';
        menuContainer.style.overflow = 'hidden';
        menuContainer.style.transition = 'max-height 1s ease, padding 1s ease';

        // 为每个角色创建菜单项
        for (let i = 0; i < characterNames.length; i++) {
            const menuItem = document.createElement('a');
            menuItem.textContent = characterNames[i];
            menuItem.dataset.index = i;

            // 设置菜单项样式
            if (characterIds[i]) {
                menuItem.href = `${baseUrl}/game?characterId=${characterIds[i]}`;
                menuItem.style.backgroundColor = 'rgba(48, 63, 159, 0.8)';
                menuItem.title = `ID: ${characterIds[i]} | 右键清除`;
            } else {
                menuItem.href = 'javascript:void(0)';
                menuItem.style.backgroundColor = 'rgba(70, 70, 70, 0.8)';
                menuItem.title = '左键保存当前ID | 右键清除';
            }

            // 统一菜单项样式
            menuItem.style.padding = '6px 12px';
            menuItem.style.color = 'white';
            menuItem.style.border = 'none';
            menuItem.style.borderRadius = '4px';
            menuItem.style.fontSize = '13px';
            menuItem.style.fontWeight = '500';
            menuItem.style.textDecoration = 'none';
            menuItem.style.cursor = 'pointer';
            menuItem.style.whiteSpace = 'nowrap';
            menuItem.style.transition = 'all 0.2s';

            // 左键点击事件
            menuItem.addEventListener('click', function(e) {

                const currentId = extractIdFromUrl();
                const index = parseInt(this.dataset.index);

                if (characterIds[index]) {
                    window.location.href = this.href;
                    toggleMenu();
                } else if (currentId) {
                    characterIds[index] = currentId;
                    saveCharacterIds(characterIds);
                    this.style.backgroundColor = 'rgba(48, 63, 159, 0.8)';
                    this.title = `已保存ID: ${currentId} | 右键清除`;
                    this.href = `${baseUrl}/game?characterId=${currentId}`;
                    alert(`✅ 成功保存「${characterNames[index]}」的角色ID连结 !!\n当前ID : ${currentId}`);
                    toggleMenu();

                    // 添加成功后，阻止默认行为（不跳转）
       		        e.preventDefault();
                } else {
                    alert(`❌ 错误：未检测到角色ID\n请确认当前URL包含characterId参数`);
                }
            });

            // 右键点击事件
            menuItem.addEventListener('contextmenu', function(e) {
                e.preventDefault();
                const index = parseInt(this.dataset.index);

                if (characterIds[index]) {
                    if (confirm(`确定清除「${characterNames[index]}」的角色ID连结？\n当前ID : ${characterIds[index]}`)) {
                        characterIds[index] = null;
                        saveCharacterIds(characterIds);
                        this.style.backgroundColor = 'rgba(70, 70, 70, 0.8)';
                        this.title = '左键保存当前ID | 右键清除';
                        this.href = 'javascript:void(0)';
                        alert(`⚠️ 已清除「${characterNames[index]}」的角色ID连结`);
                    }
                } else {
                    alert(`ℹ️ 该角色未保存ID，无需清除`);
                }
                toggleMenu();
            });

            menuContainer.appendChild(menuItem);
        }

        // 主按钮点击事件
        mainButton.addEventListener('click', function(e) {
            e.preventDefault();
            toggleMenu();
        });

        // 点击页面其他地方关闭菜单
        document.addEventListener('click', function(e) {
            if (!mainButton.contains(e.target) && !menuContainer.contains(e.target)) {
                if (isMenuExpanded) {
                    toggleMenu();
                }
            }
        });

        // 移动端长按支持
        let longPressTimer;
        mainButton.addEventListener('mousedown', function() {
            longPressTimer = setTimeout(() => {
                toggleMenu();
            }, 800);
        });

        mainButton.addEventListener('mouseup', function() {
            clearTimeout(longPressTimer);
        });

        mainButton.addEventListener('mouseleave', function() {
            clearTimeout(longPressTimer);
        });

        // 切换菜单展开/收起状态
        function toggleMenu() {
            isMenuExpanded = !isMenuExpanded;
            const arrow = mainButton.querySelector('.arrow');

            if (isMenuExpanded) {
                menuContainer.style.maxHeight = '300px';
                menuContainer.style.padding = '10px';
                arrow.classList.add('up');
            } else {
                menuContainer.style.maxHeight = '0';
                menuContainer.style.padding = '0';
                arrow.classList.remove('up');
            }
        }

        // 移动端优化：视窗大小变化时调整位置
        function adjustPosition() {
            if (window.innerWidth < 768) {
                mainButton.style.left = '50%';
                menuContainer.style.left = '50%';
            } else {
                mainButton.style.left = '73%';
                menuContainer.style.left = '73%';
            }
        }

        // 初始化位置
        adjustPosition();
        // 监听视窗大小变化
        window.addEventListener('resize', adjustPosition,500);

        // 防抖函数定义
        function debounce(func, delay) {
            let timer;
            return function() {
                clearTimeout(timer);
                timer = setTimeout(func, delay);
            };
         }

        // 将主按钮和菜单添加到页面
        const container = document.createElement('div');
        container.appendChild(mainButton);
        container.appendChild(menuContainer);
        document.body.appendChild(container);
    }

    // 初始化
    function init() {
        let characterIds = loadCharacterIds();
        createCollapsibleMenu(characterIds);
    }

    // 页面加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
// BUTTON选择结束

