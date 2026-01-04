// ==UserScript==
// @name         牛牛繁體漢化
// @namespace    http://tampermonkey.net/
// @version      25.4.38
// @description  為Milky way idle漢化並相容MWITool外掛程式，漢化問題請私信七包茶
// @license       七包茶
// @author       七包茶
// @match        https://www.milkywayidle.com/*
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
// @match        https://prozhong.github.io/MWIApiCharts/
// @match        https://goldenhoundgit.github.io/sunstone/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=milkywayidle.com
// @grant        GM_addStyle
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/529352/%E7%89%9B%E7%89%9B%E7%B9%81%E9%AB%94%E6%BC%A2%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/529352/%E7%89%9B%E7%89%9B%E7%B9%81%E9%AB%94%E6%BC%A2%E5%8C%96.meta.js
// ==/UserScript==


GM_addStyle(`

    /* 阿茶的搜索框 */
    .script-custom-search-input {
        display: block;
        width: 200px;
        height: 10px;
        padding: 7.5px;
        border: 1px solid #ccc;
        border-radius: 30px;
        font-size: 22px;
        margin: 10px 0;
    }

/* 角色選擇CSS */
#character-switch-container {
    opacity: 1;
    transition: opacity 0.5s ease; /* 移除visibility过渡 */
    visibility: visible;
    pointer-events: auto; /* 新增：确保元素可交互 */
}
#character-switch-container.hidden {
    opacity: 0;
    visibility: hidden;
    pointer-events: none; /* 新增：隐藏时禁用交互 */
}

`);

//工具目錄.
/* 搜索框替換 */
/* 物品收藏 */
/* --- 角色選擇button --- */

//目錄
//1.排除翻譯部分
//2.中文对照部分
//2.0 首頁
//2.1 通用頁面
//------------- 任務教學
//----左側邊欄
//------------- 市場
//------------- Task
//------------- 專業
//----右側邊欄
//------------- 庫存
//------------- 裝備
//------------------/ 戰鬥狀態
//------------------/ 非戰鬥狀態
//------------- 房子
//------------- 配裝
//2.2 戰鬥
//------------------/ 戰鬥相關
//------------------/ 戰鬥設置
//2.3 貨幣
//2.4 資源(商店順序)
//------------------/ 材料
//------------------/ 石頭
//----2.4.1 消耗品
//----2.4.2 技能書
//------------------* 矛類
//------------------* 劍類
//------------------* 錘類
//------------------* 弓弩類
//------------------* 水系魔法
//------------------* 自然系魔法
//------------------* 火系魔法
//------------------* 治療類
//------------------* 黃書類
//------------------* 藍書類
//----2.4.3 鑰匙(商店順序)
//----2.4.4 裝備(商店順序)
//----2.4.5 飾品(商店順序)
//----2.4.6 工具(商店順序)
//2.5 寶箱
//2.6 怪物
//------------------* 批量模擬
//------------------* 臭臭星球
//------------------* 沼澤星球
//------------------* 海洋星球
//------------------* 叢林星球
//------------------* 哥布林星球
//------------------* 眼球星球
//------------------* 巫師之塔
//------------------* 熊熊星球
//------------------* 魔像洞穴
//------------------* 暮光之地
//------------------* 地獄深淵
//------------------* 奇幻洞穴
//------------------* 邪惡馬戲團
//------------------* 秘法要塞
//------------------* 海盜灣
//2.7 狀態類
//2.8 mo9通行證
//2.9 成就
//3.0 其他
//------------- 頻道
//------------- 設置
//------------------/ 個人資料
//------------------/ 遊戲
//------------------/ 帳戶
//------------- 社交
//------------- 商店
//------------------/ 聊天圖標
//------------------/ 名稱顏色
//------------- 守則
//------------- 指引
//------------------/ 常見問題
//------------------/ 煉金
//------------------/ 強化
//------------------/ 戰鬥
//------------------/ 隨機任務
//------------------/ 公會
//------------------/ 聊天指令
//3.1 新聞
//3.2 補丁
//3.3 尚未整理
//4.0 模擬器
//5.0 插件類漢化
//------------------/ 食用工具
//------------------/ MWItool
//------------------/ Ranged Way Idle
//6.0 強化追蹤器
//7.0 戰鬥特效漢化
//8.0 翻譯(暫放)
// 測試服漢化


//1.排除非翻译部分
const excludeRegs = [
    // 一個字母都不包含
    /^[^a-zA-Z]*$/,
    // 排除時間
    /^(\d+h )?(\d+m )?(\d+s)*$/,
    // 等級
    /^Lv.\d+$/,
];

const excludes = ["K", "M", "B", "D", "H", "S", "Lv", "MAX", "wiki", "discord", "XP", "N/A"];
const excludeSelectors = [
    // 排除人名相關
    '[class^="CharacterName"]',
    // 排除排行榜人名
    '[class^="CharacterName_name__1amXp"] span',
    // 排除共用連結
    '[class^="SocialPanel_referralLink"]',
    // 排除工會介紹
    '[class^="GuildPanel_message"]',
    // 排除工會名字
    '[class^="GuildPanel_guildName"]',
    // 排除排行榜工會名字
    '[class^="LeaderboardPanel_guildName"]',
    // 排除個人資訊工會名字
    '[class^="CharacterName_characterName__2FqyZ CharacterName_xlarge__1K-fn"]',
    // 排除戰鬥中的玩家名
    '[class^="BattlePanel_playersArea"] [class^="CombatUnit_name"]',
    // 排除消息內容
    '[class^="ChatMessage_chatMessage"] span',
    // 社區buff貢獻者名字
    '[class^="CommunityBuff_contributors"] div',
    // 選擇隊伍中的隊伍名
    '[class^="FindParty_partyName"]',
    // 隊伍中的隊伍名
    '[class^="Party_partyName"]',
];

//2.0 首頁
const tranfirstpage = {
    "Chest Statistics": "開箱統計",
    "Link Existing Account": "連接現有帳號？",
    "Do you already have a Milky Way Idle account that you would like to link to Steam": "您是否已有一個想要連接到Steam的《Milky Way Idle》帳號？",
    "LINK EXISTING ACCOUNT": "連接現有帳號",
    "CREATE NEW ACCOUNT": "創建新帳號",
    "Are you sure you want to logout": "是否確定要退出遊戲",
    "ENTER GAME": "進\n入\n遊\n戲",
    "Attempting to connect to server": "正在連接至《銀河牛牛》...",
    "Disconnected. The game was opened from another device or window": "與伺服器斷開連接，遊戲已從其他裝置或視窗開啟",
    "Game update available. Please refresh your browser": "遊戲有更新，請重啟流覽器",
    "Game server has been restarted. Please refresh the page": "遊戲伺服器已重新啟動。請重新整理頁面",
    loading: "載入中...",
    Home: "主頁",
    "Multiplayer Idle RPG": "多人放置RPG",
    "Embark on a journey through the Milky Way Idle universe, a unique multiplayer idle game. Whether you enjoy resource gathering, item crafting, or engaging in epic battles against alien monsters, we have something to offer for everyone. Immerse yourself in our thriving community, where you can trade in the player-driven marketplace, form a guild with friends, chat with fellow players, or climb to the top of the leaderboards":
        "踏上一段穿越《銀河牛牛放置》的旅程，這是一款獨特的多人放置遊戲。無論你喜歡收集資源、製作物品，還是參與與外星怪物的史詩戰鬥，我們都能為每個人提供一些樂趣。沉浸在我們繁榮的社區中，你可以在由玩家驅動的市場交易，與朋友組建公會，與其他玩家聊天，或者登上排行榜的頂端。",
    "Gather and Craft": "收集和製作",
    "Milking, Foraging, Woodcutting, Cheesesmithing, Crafting, Tailoring, Cooking, Brewing, Alchemy, Enhancing": "擠奶、採摘、伐木、乳酪鍛造、製作、裁縫、烹飪、沖泡、煉金、強化",
    "Multiple styles of combat with highly customizable consumable and ability auto-usage. Battle solo or with a party": "多種戰鬥風格，可高度自定義消耗品和能力的自動使用。單人或組隊戰鬥",
    "Buy and sell resources, consumables, equipment, and more": "購買和出售資源、消耗品和裝備",
    Community: "社區",
    "Party and chat with friends. Compete for a spot on the leaderboard": "與朋友一起玩耍和聊天。爭奪排行榜上的位置",
    "Terms of Use": "使用條款",
    "Play As Guest": "以遊客身份玩",
    Register: "註冊",
    Login: "登錄",
    "Your session will be saved in this browser. To play across multiple devices, you can go in": "你的會話將保存在此流覽器中。要在多個設備上玩遊戲，你可以進入",
    "in game to find your": "遊戲中找到你的",
    "guest password": "遊客密碼",
    "or to fully": "或者完全",
    register: "註冊",
    "I Agree to the": "我同意",
    Terms: "條款",
    "I am 13 years of age or older": "我年滿13歲或以上",
    Play: "開始遊戲",
    Password: "密碼",
    "Password Confirmation": "確認密碼",
    "Email or Name": "電子郵件或用戶名",
    "Forgot Password": "忘記密碼",
    "Loading characters": "正在載入角色",
    "Select Character": "選擇角色",
    Empty: "空",
    "Create Character": "創建角色",
    "The Standard game mode is recommended for new players. There are no feature restrictions. You can only have 1 Standard character": "標準遊戲模式沒有功能限制適合新玩家。但你只能創建一個標準角色",
    "Last Online": "上次上線",

};


//2.1 通用頁面
const tranCommon = {
    Reroll: "重隨任務",
    Back: "返回",
    level: "等級",
    Gather: "收集",
    Produce: "生產",
    Fight: "戰鬥",
    times: "次數",
    Queued: "生產隊列",
    Purple: "牛紫",
    Task: "任務",
    Reward: "獎勵",
    Go: "前往",
    Open: "打開",
    "Right Click": "點擊右鍵",
    "Queued Actions": "佇列中的動作",
    "Increases quantity of combat loot": "增加戰鬥戰利品數量",
    "Run this action now? The current action will pause and continue after": "是否立即執行此操作？當前操作將暫停，並在前一項操作完成後繼續進行",
    Elite: "精英",
    "Are you sure you want to run away from combat": "你確定要跑路嗎",
    No: "否",
    Yes: "是",
    Stop: "停止",
    "in combat": "戰鬥中",
    "flee": "退出戰鬥",
    "Opened Loot": "打開戰利品",
    "You found": "你找到",
    "Are you sure you want to replace your queued actions": "這樣做將清空目前的佇列",
    Learn: "學習",
    use: "使用",
    "Active Characters": "活躍玩家數",
    "total level": "總等級",
    mmmmmmmmmmlli: "mmmmmmmmmmlli",
    "Start Now": "現在開始",
    "Upgrade Queue Capacity": "升級佇列容量",
    "Total Experience": "總經驗值",
    "Xp to Level Up": "升級所需經驗值",
    "You need to enable JavaScript to run this app": "你需要啟用JavaScript才能運行此應用程式",
    "Require": "需要",
    "Bigger": "更大",
    "Battle started": "戰鬥開始",
    off: "關",
    gain: "獲得",
    "NO items available": "無物品可用",
    Weapon: "主手/雙手武器",
    Offhand: "副手",
    Presets:"預設套裝",
    "Welcome Back": "歡迎回來！",
    "Offline duration": "已離線",
    "Progress duration": "已達離線上限",
    "You made progress for": "你已離線至當前上限",
    "Items consumed": "你消耗了",
    Close: "關閉",
    "Items gained": "獲得物品",
    "Experience gained": "獲得經驗",
    "Usable In": "可用於",
    "Usable": "可用於",
    "Traveling To Battle": "踏上戰鬥之旅",
    "Doing nothing": "無所事事",
    "Ability Slot": "技能槽",
    "Lv.20 INT": "20智力",
    "Lv.50 INT": "50智力",
    "Lv.90 INT": "90智力",
    Tip: "提示",

    //------------- 任務教學
    "New Tutorial Message": "新的教學消息",
    Tutorial: "教學",
    "where magical cows mooo! I'm Purple, the Chief Training Officer (CTO), and also your tour guide today": "這裡是神奇的牛牛世界！我是牛紫，首席培訓官（CTO），也是你的導遊",
    "I'll sprinkle some glowing magical dust to guide you through the training": "我會撒些閃閃發光的魔法粉塵來引導你完成訓練",
    "Hi Purple": "嗨，牛紫",
    "You need at least 30 total level to chat": "你需要至少30總等級才能聊天",
    "spam protection": "垃圾郵件保護",
    "New Tutorial Task": "新的教學任務",
    "Complete your tutorial tasks to unlock the task board": "完成教學任務即可解鎖任務板",
    "Your current task can be found in the top-right corner": "您目前的任務可以在右上角找到",
    "Let me first show you what we magical cows are best known for": "讓我先向你展示我們神奇的牛牛最擅長的事情",
    "producing magical milk! By the way, my cousin Burble also works here. Hi Burble": "生產神奇的牛奶！順便說一下，我的表弟Burble也在這裡工作。嗨，Burble",
    "First, try and gather some milk": "首先，嘗試收集一些牛奶",
    Accept: "接受",
    OK: "好的",
    "Good job! Here's some extra milk and a brush. Magical cows love to be brushed, and happy cows produce milk faster": "幹得好！這是一些額外的牛奶和一把刷子。神奇的牛牛喜歡被刷，快樂的牛牛產奶更快",
    "Let's make some cheese with the milk! These special cheeses are very durable and can be turned into many useful things through cheesesmithing":
        "讓我們用牛奶做些乳酪！這些特殊的乳酪非常耐用，可以通過乳酪製作變成許多有用的東西",
    "Great! Take some extra cheese with you for the next task": "太棒了！帶一些額外的乳酪繼續下一個任務",
    "Cheeses are essential resources for making tools, weapons, and armor. Let me show you how to make a cheese sword. I know it might sound crazy and maybe a little bit smelly too, but trust me":
        "乳酪是製作工具、武器和盔甲的重要資源。讓我來教你如何製作乳酪劍。我知道這聽起來可能很瘋狂，也可能有點臭，但請相信我",
    "Awesome! As you level up, equipment can be upgraded to higher tiers! Tools can also be made to improve each of your skills":
        "太棒了！隨著你的等級提升，裝備可以升級到更高的階級！也可以製作工具來提高你的每項專業",
    "Now let's go forage for some more resources. Head to Farmland and see what items you can gather": "現在讓我們去尋找更多的資源。前往農田，看看你能收集到什麼物品",
    "That was fast! Foraging gives you resources used in many skills, including cooking, brewing, and tailoring": "速度很快！尋找資源可以用於許多技能，包括烹飪、沖泡和裁縫",
    "It's time to make use of your cooking skill and whip up a delicious donut using some eggs, wheat, and sugar. What? You can't cook? Of course you can! There's a rat from Earth that can cook, and if he can do it, so can you! Give it a try":
        "現在是時候利用你的烹飪專業，用一些雞蛋、小麥和糖製作美味的甜甜圈。什麼？你不會做飯？當然你會！地球上有只老鼠會做飯，如果他能做到，你也能！辣就試試看吧",
    "Fantastic! Food can heal you while in combat. Here's a dozen more donuts for free": "太棒了！食物可以在戰鬥中治療你。這裡還有一打免費的甜甜圈",
    "Now I want to take you on an expedition to one of our neighboring planets": "現在我想帶你去我們的鄰近行星之一進行探險",
    "the Smelly Planet! I hear there are lots of flies, and they bite! You'll want to bring your sword and some donuts. Let's go":
        "臭臭星球！我聽說那裡有很多蒼蠅，它們會叮咬！你會想帶上你的劍和一些甜甜圈。我們走吧",
    "Battling aliens earns you coins, resources, ability books, and even rare items": "與外星人戰鬥可以獲得金幣、資源、能力書籍，甚至是稀有物品",
    "If you are knocked out during combat, you will recover in 150 seconds and continue fighting": "如果在戰鬥中被擊倒，你將在150秒內恢復並繼續戰鬥",
    "Looks like the tour is almost over. There's still much more to explore, but don't worry, you won't be alone! Once you level up a little more, you can chat with or get help from other players":
        "看起來導覽快要結束了。還有很多地方可以探索，但不用擔心，你不會孤單！一旦你再升級一點，就可以與其他玩家聊天或尋求幫助",
    "You can also buy or sell items in our player-driven marketplace, unless you are playing Ironcow mode": "你還可以在由玩家驅動的市場上買賣物品，除非你是玩鐵牛模式",
    "Before I go, here's a few more tips": "在我離開之前，再給你幾個提示",
    "A Game Guide can be found at the bottom of the navigation menu on the left": "遊戲指南可以在左側導航功能表的底部找到",
    "If you go offline, you'll continue to make progress for 10 hours (upgradable": "如果你離線，將可繼續進行10小時的進度（可升級",
    "Items, abilities, skills, and enemies can be hovered over (long press on mobile) to see more detailed tooltips":
        "可以將滑鼠懸停在物品、技能、專業和敵人上（在移動設備上長按）以查看更詳細的工具提示",
    "Bye Purple": "再見，牛紫",




    };

//----左側邊欄
const tranLeftpage = {
    "My Stuff": "我的物品",
    "Inventory, equipment, and abilities.": "庫存、裝備和技能",
    marketplace: "市場",
    "player-driven market where you can buy and sell items with coins": "玩家驅動的市場，你可以在這用金幣購買和出售物品",
    tasks: "任務",
    milking: "擠奶",
    mooooooooo: "哞哞哞...",
    foraging: "採摘",
    "Master the skill of picking up things": "我在小小的花園裡面挖呀挖呀挖",
    woodcutting: "伐木",
    "Chop chop chop": "請時刻警惕周圍的光頭強",
    cheesesmithing: "乳酪鍛造",
    "Did you know you can make equipment using these special hardened cheeses": "芝士就是...打鐵！",
    crafting: "製作",
    "Create weapons, jewelry, and more": "製作遠程和魔法武器、及碎掉寶石",
    tailoring: "裁縫",
    "Create ranged and magic clothing": "魔法縫紉，定制您的傳奇裝束！",
    cooking: "烹飪",
    "The art of making healthy food": "製作各種碳水炸彈",
    brewing: "沖泡",
    "The art of making tasty drinks": "我在牛牛007的最佳伴侶",
    Alchemy: "煉金",
    "Transform unwanted items into wanted ones": "點牛成金",
    "hopefully": "哞~哞~哞!!",
    enhancing: "強化",
    "takes effort, +10 takes luck, +15 is a miracle, and +20 is destiny": "靠努力，+10 靠运气，+15 是奇迹，+20 是命运",
    combat: "戰鬥",
    "Fight monsters. Your combat level represents your overall combat effectiveness based on the combination of individual combat skill levels":
        "戰鬥等級代表了目前攻擊方式的各個小項專業等級的綜合評估",
    stamina: "耐力",
    "Increases max HP by 10 per level": "每級+10點最大HP",
    intelligence: "智力",
    "Increases max MP by 10 per level": "每級+10點最大MP",
    attack: "攻擊",
    "Increases your accuracy, base attack speed, and cast speed": "增加你的命中、基礎攻擊速度、施法速度",
    defense: "防禦",
    "Increases your evasion, armor, elemental resistances, and retaliation damage": "增加你的閃避、護甲和元素抗性",
    "Melee": "近戰",
    "Increases your melee damage": "增加你的近戰傷害",
    ranged: "遠程",
    "Increases your ranged damage. Ranged attacks have bonus chance to critical strike": "增加你的遠程傷害。遠程攻擊有額外機率造成致命一擊",
    magic: "魔法",
    "Increases your magic damage": "增加你的魔法傷害",
    "Randomly generated tasks that players can complete for rewards": "隨機生成的任務，玩家可以完成以獲得獎勵",
    shop: "商店",
    "Purchase items from the vendor": "販售各類雜物",
    "Buy Item": "購買商品",
    "cowbell store": "牛鈴商店",
    "Purchase and spend cowbells": "購買和使用牛鈴",
    "Track the loot from your recent actions": "看啥看!? 沒見過美''牛''!?",
    "Loot Tracker": "掉落追蹤",
    "Start Time": "開始時間",
    social: "社交",
    "Friends, referrals, and block list": "好友、推薦和黑名單",
    guild: "公會",
    "Join forces with a community of players": "看看是誰在idle裡面idle",
    leaderboard: "排行榜",
    "Shows the top ranked players of each skill": "顯示每個專業的排名前幾位的玩家",
    settings: "設置",
    "Update account information and other settings": "更新帳戶資訊和其他設置",
    news: "新聞",
    "patch notes": "補丁說明",
    "game guide": "新手指引",
    rule: "遊戲守則",
    "The rules for Milky Way Idle are designed to ensure an enjoyable and fair experience for all players. Breaking the rules would result in appropriate penalties dependent on the type and severity of the offense. Penalties include verbal warning, mute, item removal, trading ban, or account ban":
        "《銀河牛牛放置》 的規則旨在確保所有玩家都能享受公平愉快的游戲體驗。違規者將根據違規類型和嚴重程度受到相應的懲罰。懲罰包括口頭警告、禁言、移除物品、交易禁令或帳號封禁等。",
    "merch store": "周邊商店",
    "test server": "測試伺服器",
    "privacy policy": "隱私政策",
    "switch character": "選擇角色",
    logout: "退出登錄",
    "Game Wiki": "維基百科",

    };

//------------- 市場
const tranMarket = {
    "The marketplace allows players to make buy or sell listings for any tradable item.You can click on any item listed to view existing listings or to create your own":
        "市場允許玩家為任何可交易的物品創建買入或賣出掛單。你可以點擊任何列出的物品來查看現有的掛單或創建自己的掛單",
    "New listings will always be fulfilled by the best matching prices on market when possible.If no immediate fulfillment is possible, the listing will appear on the marketplace":
        "新的掛單將盡可能由市場上最匹配的價格來滿足。如果無法立即滿足，該掛單將出現在市場上",
    "When a trade is successful, a tax of 2% coins is taken and the received items can be collected from \"My Listings\" tab":
        "當交易成功時，會收取2%的金幣作為稅收，並且可以從“我的掛單”選項中收取所獲得的物品",
    Asks: "詢問",
    "existing sell listings": "現有的賣出掛單",
    Bids: "競價",
    "Must be at least vendor price": "必須至少達到商店售價",
    "existing buy listings": "現有的買入掛單",
    "market listings": "市場掛單",
    "my listings": "我的掛單",
    "Are you sure you want to cancel this listing": "你確定要取消此掛單嗎",
    Listings: "掛單",
    "item filter": "搜索（中文）",
    "New Sell Listing": "新出售單",
    "New Buy Listing": "新收購單",
    "Listing Limit Reached": "已達上架限制",
    "view all items": "查看所有物品",
    "upgrade capacity": "增加上限",
    "Collect All": "收集全部",
    Item: "物品",
    "Best Ask Price": "最佳出售價",
    "Best Bid Price": "最佳收購價",
    "View All": "查看全部",
    Quantity: "數量",
    "Ask Price": "出售價",
    "Bid Price": "收購價",
    Action: "操作",
    "View All Enhancement Levels": "查看所有強化級別",
    Amount: "數量",
    status: "狀態",
    type: "類型",
    progress: "進度",
    "tax taken": "收稅",
    collect: "收集",
    active: "有效",
    Inactive: "無效",
    sell: "出售",
    buy: "購買",
    price: "價格",
    cancel: "取消",
    Refresh: "刷新",
    "Sell Price": "售價",
    "Sell Listing": "出售掛單",
    "Chat Link": "聊天連結",
    Link: "連結",
    "Enhancement Level": "強化等級",
    "Price (Best Sell Offer": "價格(最佳售價",
    "Quantity (You Have": "數量(你擁有",
    "You don't have enough items": "你沒有足夠的物品",
    "You Get": "你獲得",
    Taxed: "扣稅",
    "more if better offers exist": "或更多, 如果有更好的報價",
    "Post Sell Listing": "發佈出售掛單",
    "Buy Listing": "購買掛單",
    "You can't afford this many": "你負擔不起這麼多",
    "You Pay": "你支付",
    "less if better offers exist": "或更少, 如果有更好的報價",
    "Post Buy Listing": "發佈購買掛單",
    "Sell Now": "立即出售",
    All: "全部",
    "Post Sell Order": "發佈出售訂單",
    "Buy Now": "立即購買",
    "Post Buy Order": "發佈購買訂單",
    Filled: "完成",
    "Must be at least": "必須至少",
    "You Have": "你有",
    "You Can Afford": "你能負擔",
    "Cannot afford": "無法購買",
    "Price (Best Buy Offer": "價格 (最好的買價",
    "Trading Rules Agreement": "交易規則協議",
    "Before using the marketplace, you must read and accept the following trading rules": "在使用市場之前，您必須閱讀並接受以下交易規則",
    "I Accept the Trading Rules": "我接受交易規則",
    "": "",

    };

//------------- Task
const tranTask = {
    "Task Board": "任務板",
    "Task Shop": "任務商店",
    "TaskSort": "任務排序",
    "Next Task": "下一個任務",
    Upgrades: "升級",
    Items: "物品",
    "Lifetime Task Points": "終身任務點數",
    "Task Points": "任務點數",
    Claim: "領取",
    "Claim Reward": "領取報酬",
    "Hour Task Cooldown": "每小時任務冷卻",
    "Block Slot": "屏蔽槽位",
    "Unlock Combat Block": "解鎖戰鬥屏蔽",
    "Buy Task Upgrade": "購買任務升級",
    "Permanently reduces the waiting time between tasks by 1 hour": "永久減少任務間的等待時間1小時",
    "Adds a block slot, allowing you to block a non-combat skill from being selected for tasks": "增加一個屏蔽槽位，允許你屏蔽非戰鬥專業被選擇為任務",
    "Unlocks the ability to block combat tasks. You need at least 1 available block slot to use this": "解鎖屏蔽戰鬥任務的功能。你至少需要1個可用的屏蔽槽位來使用此功能",
    "Buy Task Shop Item": "購買任務商店物品",
    "You don't have enough Task Token": "你沒有足夠的任務代幣",
    "unread task": "未讀的任務",
    read: "閱讀",
    "MooPass Free Reroll": "Moo卡免費重置",
    "Confirm Discard": "確認刪除",

    };

//------------- 專業
const tranSkill = {
    Upgrade: "升級",
    From: "從",
    Requires: "需求",
    "Output": "產出",
    Outputs: "產出",
    Rares: "稀有",
    Duration: "持續時間",
    Essences: "精華",
    "Task Action Speed": "任務行動速度",
    "No upgrade item selected": "無可用的升級物品",

    // --擠奶
    "The milks from these magical cows have a wide variety of functions.They can be used to produce consumables or craft into special cheese to make equipment":
    "這些魔法奶牛產的牛奶有多種用途。它們可用來製作消耗品，或是加工成特殊乳酪以打造裝備",
    "Cows love to be brushed. Equipping a brush will boost your milking skill": "牛牛喜歡被刷。裝備刷子會提升你的擠奶專業",
    Cow: "牛牛",
    "Verdant Cow": "翠綠牛牛",
    "Azure Cow": "蔚藍牛牛",
    "Burble Cow": "深紫牛牛",
    "Crimson Cow": "絳红牛牛",
    Unicow: "彩虹牛牛",
    "Holy Cow": "神聖牛牛",

    // --採摘
    "You can find many different resources while foraging in the various areas.These resources can be used for cooking and brewing consumables":
        "在各個不同的區域進行採摘時，你可以找到許多不同的資源。這些資源可以用於烹飪和沖泡消耗品",
    "Equipping shears will boost your foraging skill": "裝備剪刀會提升你的採摘專業",
    farmland: "農場",
    "shimmering lake": "波光湖",
    "misty forest": "迷失森林",
    "burble beach": "深紫沙灘",
    "silly cow valley": "傻牛谷",
    "olympus mons": "奧林匹斯山",
    "asteroid belt": "小行星帶",

    // --伐木
    "You can gather logs from different types of trees.Logs are used for crafting various equipments": "你可以從不同種類的樹木上收集原木。原木可用於製作各種裝備",
    "Equipping a hatchet will boost your woodcutting skill": "裝備一把斧頭會提升你的伐木專業",
    Tree: "樹",
    "Birch Tree": "樺樹",
    "Cedar Tree": "雪松樹",
    "Purpleheart Tree": "紫心木樹",
    "Ginkgo Tree": "銀杏樹",
    "Redwood Tree": "紅杉樹",
    "Arcane Tree": "奧秘樹",

    // --乳酪鍛造
    "The hardened cheeses made with milks from the magical cows are as tough as metal.You can smith them into equipment that gives you bonuses in combat or skilling":
        "用魔法牛牛的奶製作的硬質乳酪堅硬如金屬。你可以將它們鍛造成在戰鬥或專業中給你加成的裝備",
    "Equipment is upgradable from one tier to the next, often requiring increasing amount of cheese.There is also special equipment that can be crafted with items found from monsters in combat":
        "裝備可以從一級升級到下一級，通常需要越來越多的乳酪。還有一些特殊的裝備可以用在戰鬥中從怪物身上獲得的物品來製作",
    "Equipping a hammer will boost your cheesesmithing skill": "裝備錘子會提升你的乳酪鍛造專業",
    Material: "材料",

    // --製作
    "You can craft weapons, offhands, and jewelry": "你可以製作武器、副手物品和珠寶",
    "Equipping a chisel will boost your crafting skill": "裝備鑿子會提升你的製作專業",
    Crossbow: "弩",
    Bow: "弓",
    Staff: "法杖",
    Special: "特殊",
    "Dungeon Keys": "地下城鑰匙",

    // --裁縫
    "You can tailor ranged and magic clothing using raw materials gathered from combat and foraging": "你可以使用從戰鬥和採摘中獲得的原材料來製作遠程和魔法服裝",
    "Equipping a needle will boost your tailoring skill": "裝備針會提升你的裁縫專業",

    // --烹飪
    "Food can be used to recover your HP or MP.They can be brought with you to combat": "食物可用於恢復你的生命值（HP）或魔法值（MP）。這些食物可以在戰鬥中被使用",
    "Equipping a spatula will boost your cooking skill": "裝備鏟子會提升你的烹飪專業",
    "Instant Heal": "即時治療",
    "Heal Over Time": "持續治療",
    "Instant Mana": "即時回藍",
    "Mana Over Time": "持續回藍",

    // --釀造
    "Drinks can provide you with temporary buffs.Coffee can be brought with you to combat and tea can be used while skilling":
        "飲品可以給你提供臨時的增益效果。咖啡可以在戰鬥中攜帶，茶可以在提升專業時使用",
    "Equipping a pot will boost your brewing skill": "裝備一個鍋可以提升你的沖泡專業",
    Tea: "茶",
    Coffee: "咖啡",

    // --煉金
    Recommended: "推薦",
    "Target": "目標",
    "Target Level": "目標等級",
    Attempt: "嘗試",
    Transform: "轉換",
    Catalyst: "催化劑",
    "Essence Drop": "精華掉落",
    "Coinify": "點金",
    "Decompose": "分解",
    "Transmute": "轉化",
    "Alchemize": "煉金",
    "Using Catalyst": "使用催化劑",
    "Alchemy Efficiency":"煉金效率",
    "Alchemize Item": "煉金物品",
    "Alchemy Catalyst":"煉金催化劑",
    "Catalyst increases success rate.One catalyst is consumed per success":"催化劑可提高成功率。僅在成功時消耗一個",
    "Select an item to alchemize": "選擇要煉金的物品",
    "Converts item into coins": "將物品轉換為金幣",
    "Converts item into component materials": "將物品分解為原材料",
    "You are currently not alchemizing anything":"當前無煉金",
    "This item cannot be decomposed": "該物品無法被分解",
    "This item cannot be transmuted": "該物品無法被轉化",
    "Alchemy allows you to transform items into other items.Each alchemy action has a different success rate, and the input items will always be consumed regardless of success or failure":
        "煉金能讓你將物品轉換為其他物品。每種煉金的操作都有不同的成功率，但無論成功與否，用於煉金的投入物品都會被消耗掉",
    "coinify, decompose, and transmute":"【點金】，【分解】和【轉化】",
    "Converts item into coins.Decompose": "將物品轉換為金幣。分解",
    "Converts item into component materials.Transmute":"將物品分解為原材料。轉化",
    "Converts item into a random related item":"將物品轉換為隨機相關物",
    "Converts item into a random related item, and in some cases unique items that cannot be acquired elsewhere":"將物品轉化為隨機相關物品，在某些情況下可轉化為無法在其他地方獲得的獨特物品",
    "Each transformation has a base success rate.The success rate is lower if your alchemy level is lower than the item level.Catalyst and tea can be used to increase the success rate":
        "每次轉換都有一個基礎成功率。如果你的煉金等級低於物品等級，成功率就會較低。可以使用催化劑和茶來提高成功率",
    "One catalyst is consumed each action to increase success rate": "每次動作消耗1個催化劑並提高成功率",
    "Equipping an Alembic will boost your alchemy skill":"裝備煉金蒸餾器將提升你的煉金專業",

    // --強化
    "Enhancing allows you to permanently improve your equipment, giving them increasing bonuses as their enhancement level go up":
        "強化可以讓你永久提升裝備，隨著強化等級的提升，裝備的獎勵效果也會增加",
    "Enhancing costs a small amount of materials for each attempt.The success rate depends on your enhancing skill level, the tier of the equipment, and the equipment's current enhancement level.A successful enhancement will increase the level by 1 and failure will reset the level back to":
    "每次嘗試強化都需要消耗少量材料。成功率取決於你的強化專業等級、裝備的等級和當前的強化等級。成功的強化將使等級增加1，失敗將使等級重置為",
    "You can optionally use copies of the base equipment for protection.Failure with protection will only reduce the enhancement level by 1 but consume 1 protection item":
        "你可以選擇使用與基礎裝備相同的物品作為保護手段。在有保護的情況下即使強化失敗，也僅會使強化等級降低一級，但這會消耗一件你說使用的保護物品",
    "Equipping an enhancer will boost your enhancing success":
        "裝備強化器能提高你的強化成功率",

    //--強化裡保護?的說明
    "One protection item is consumed on failure to ensure that only 1 enhancement level is lost instead of being reset to": "若強化失敗，將消耗一件保護道具，以確保僅損失 1 級強化等級，而非重置為",

    Protect: "保護",
    Protection: "保護",
    "Protect From": "保護自",
    "Item not available": "道具無法使用",
    "Protect From level": "保護等級",
    "Must Be ≥ 2 To Be Effective": "必須 ≥ 2 才有效",
    Instructions: "指引",
    "Enhancement Bonus": "強化加成",
    "You can optionally use copies of the base equipment for protection. Failure with protection will only reduce the enhancement level by 1 but consume 1 protection item":
        "你可以選擇使用基礎裝備的副本進行保護。帶有保護的失敗只會將強化等級減少1，但會消耗1個保護道具",
    "Equipping an enhancer will boost your enhancing skill": "裝備一個強化器會提升你的強化專業",
    "Enhance Item": "強化物品",
    "Enhancing Protection": "強化保護",
    "Current Action": "當前操作",
    "You are currently not enhancing anything": "當前無強化",
    "Select an equipment to enhance": "選擇一個裝備進行強化",
    "Enhancement Data": "強化在線統計",
    Success: "成功",
    "increases the item's enhancement level by": "將使物品的強化等級增加",
    Failure: "失敗",
    "resets the enhancement level to 0 unless protection is used": "除非使用保護道具，否則將重置強化等級為0",
    "Next Level Bonuses": "下一級獎勵",
    "Enhancing Cost": "強化費用",
    "Enhancement Costs": "強化費用",
    "Rare Drops": "稀有掉落",
    "Success Rate": "成功率",
    "Stop At Level": "停止等級",
    "Use Protection": "使用保護",
    "Only Decrease": "僅減少",
    "Level On Failure": "失敗時等級",
    "Consumed Item": "消耗物品",
    "Start Protect At Level": "從等級開始保護",
    Enhance: "強化",
    "Multiplicative bonus to success rate while enhancing": "在強化時對成功率的乘法加成",
    "setup queue": "設置佇列",
    "Loadout":"配裝",
    "No Loadout":"不使用配裝",
};


//----右側邊欄
const tranRightpage= {
    Inventory: "庫存",
    Equipment: "裝備",
    Abilitie: "技能",
    House: "房子",
    Loadout: "配裝",
    Currencie: "貨幣",
    Food: "食物",
    Drink: "飲料",
    Resource: "資源",
    Consumable: "消耗品",
    "Ability Book": "技能書",
    Accessories: "飾品",
    Tool: "工具",
    Ability: "技能",

    //------------- 庫存(右側邊欄)
    "View Marketplace": "市場",
    "Link To Chat": "聊天連結",
    "Open Item Dictionary": "物品字典",
    Equip: "裝備",
    "Level Not Met": "等級未達到",
    "New Ability": "新技能",
    "Cannot During Combat": "戰鬥中無法使用",
    "No abilities available": "無技能可用",

    //------------- 裝備(右側邊欄)
    "View Stats": "查看狀態",
    "Main Hand": "主手",
    "Off Hand": "副手",
    "Two Hand": "雙手",
    Earrings: "耳環",
    Head: "頭部",
    Necklace: "項鍊",
    charm: "護符",
    Body: "身體",
    Legs: "腿部",
    Hands: "手部",
    Ring: "戒指",
    Feet: "腳部",
    Trinket:"飾品",
    Pouch: "袋子",
    "Milking Tool": "擠奶工具",
    "Foraging Tool": "採摘工具",
    "Woodcutting Tool": "伐木工具",
    "Wood-Cutting Tool": "伐木工具",
    "Cheese Smithing Tool": "乳酪鍛造工具",
    "Cheesesmithing Tool": "乳酪鍛造工具",
    "Cheese-Smithing Tool": "乳酪鍛造工具",
    "Crafting Tool": "製作工具",
    "Tailoring Tool": "裁縫工具",
    "Cooking Tool": "烹飪工具",
    "Brewing Tool": "沖泡工具",
    "Alchemy Tool": "煉金工具",
    "Enhancing Tool": "強化工具",

    //------------------/ 戰鬥狀態
    "Auto Attack Damage": "自動攻擊傷害",
    "Auto-Attack Damage": "自動攻擊傷害",
    "Combat Stats": "戰鬥狀態",
    "Non-combat Stats": "非戰鬥狀態",
    "Attack Interval": "攻擊間隔",
    "How fast you can auto-attack": "自動攻擊的速度",
    "Ability Haste": "技能加速",
    "Reduces ability cooldown": "減少技能冷卻時間",
    Accuracy: "精準",
    "Increases chance to successfully attack": "增加攻擊成功的幾率",
    Damage: "傷害",
    "Auto-attack damage is random between 1 and the maximum damage": "自動攻擊的傷害在1和最大傷害之間隨機",
    "Critical Hit": "暴擊",
    "Always rolls maximum damage. Ranged style has passive critical chance": "總是造成最大傷害。遠程攻擊風格具有被動暴擊幾率",
    "Task Damage": "任務傷害",
    "Increases damage to monsters assigned as tasks": "增加作為任務分配所對應的怪物傷害",
    Amplify: "增幅",
    "Increases damage of that type": "增加該類型的傷害",
    Evasion: "閃避",
    "Increases chance to dodge an attack": "增加閃避攻擊的幾率",
    Armor: "護甲",
    "Mitigates % of physical damage": "減少%的物理傷害",
    Resistance: "抗性",
    "Mitigates % of elemental damage": "減少%的元素傷害",
    Penetration: "穿透",
    "Ignores % of armor/resistance": "無視%的護甲/抗性",
    "Life Steal": "生命竊取",
    "Heal for % of auto-attack": "自動攻擊時恢復%的HP",
    "Mana Leech": "法力吸取",
    "Leeches for % of auto-attack": "自動攻擊時吸取%的MP",
    "elemental thorns": "魔法反傷",
    "physical thorns": "物理反傷",
    Thorn:"反傷",
    "When attacked, deals a percentage of your defensive damage back to the attacker. Damage is increased by 1% per armor or resistance":
        "受到攻擊時，將一定比例的防禦傷害反擊給攻擊者。每增加一層護甲或抗性，傷害就會增加 1%",
    Tenacity: "韌性",
    "Reduces chance of being blinded, silenced, or stunned": "降低被致盲、沉默或眩暈的幾率",
    Threat: "威脅",
    "Increases chance of being targeted by monsters": "增加成為怪物目標的幾率",
    Ripple: "漣漪",
    Bloom: "綻放",
    Blaze: "熾焰",
    "HP Regen": "HP恢復",
    "Recover % of Max HP per 10s": "每10秒恢復MAX HP的%",
    "MP Regen": "MP恢復",
    "Recover % of Max MP per 10s": "每10秒恢復MAX MP的%",
    "Recover % of Max HP/MP per 10s": "每10秒恢復MAX HP/MP的%",
    "Drop Rate": "掉落率",
    "Increase regular item drop rate": "增加普通物品的掉落率",
    "Combat Rare Find": "戰鬥稀有發現",
    "Increase rare item drop rate": "增加稀有物品的掉落率",
    "Combat Style": "戰鬥風格",
    "Damage Type": "傷害類型",
    "Attack Interval": "攻擊間隔",
    "Max HP": "Max HP",
    "Max MP": "Max MP",
    "Max Hitpoints": "Max HP",
    "Max Manapoints": "Max MP",
    "Stab Evasion": "刺擊閃避",
    "Slash Evasion": "斬擊閃避",
    "Smash Evasion": "鈍擊閃避",
    "Ranged Evasion": "遠程閃避",
    "Magic Evasion": "魔法閃避",
    Armor: "護甲",
    "Water Resistance": "水屬性抗性",
    "Nature Resistance": "自然屬性抗性",
    "Fire Resistance": "火屬性抗性",
    "defensive damage": "防禦傷害",
    Tenacity: "韌性",
    Threat: "威脅",

    "HP Regen": "HP恢復",
    "MP Regen": "MP恢復",
    "Combat Experience": "戰鬥經驗",
    Speed: "速度",
    "Increases action speed": "增加行動速度",
    "Task Speed": "任務速度",
    "Increases speed on actions assigned as tasks": "增加分配為任務的行動速度",
    "Increases gathering quantity": "增加採集數量",
    "Increases chance of finding essences": "增加找到精华的机會",
    Efficiency: "效率",
    "Chance of repeating the action instantly": "立即重複行動的幾率",
    "Skilling Essence Find": "專業精華發現",
    "Skilling Rare Find": "專業稀有發現",
    "Milking Rare Find": "擠奶稀有發現",
    "Foraging Rare Find": "採摘稀有發現",
    "Woodcutting Rare Find": "伐木稀有發現",
    "Cheesesmithing Rare Find": "乳酪鍛造稀有發現",
    "Crafting Rare Find": "製作稀有發現",
    "Tailoring Rare Find": "裁縫稀有發現",
    "Cooking Rare Find": "烹飪稀有發現",
    "Brewing Rare Find": "沖泡稀有發現",
    "Alchemy Rare Find": "煉金稀有發現",
    "Enhancing Rare Find": "強化稀有發現",
    "Increases chance of finding meteorite caches or artisan's crates": "增加發現隕石或工匠箱子的幾率",

    //------------------/ 非戰鬥狀態
    "Milking Speed": "擠奶速度",
    "Foraging Speed": "採摘速度",
    "Woodcutting Speed": "伐木速度",
    "Cheesesmithing Speed": "乳酪鍛造速度",
    "Crafting Speed": "製作速度",
    "Tailoring Speed": "裁縫速度",
    "Cooking Speed": "烹飪速度",
    "Brewing Speed": "沖泡速度",
    "Alchemy Speed": "煉金速度",
    "Milking Experience": "擠奶經驗",
    "Foraging Experience": "採摘經驗",
    "Woodcutting Experience": "伐木經驗",
    "Cheesesmithing Experience": "乳酪鍛造經驗",
    "Crafting Experience": "製作經驗",
    "Tailoring Experience": "裁縫經驗",
    "Cooking Experience": "烹飪經驗",
    "Brewing Experience": "沖泡經驗",
    "Alchemy Experience": "煉金經驗",
    "Enhancing Experience": "強化經驗",
    "Enhancing Success": "強化成功率",
    "Skilling Experience": "專業經驗",

    // --技能(右側邊欄)
    "Abilities can be learned from ability books.You can acquire ability books as drops from monsters or purchase them from other players in the marketplace":
        "技能可以從技能書中學習。技能書可以從怪物身上獲得，或者在市場上從其他玩家那裡購買",
    "Abilities can be placed into slots to be used in combat.You unlock more slots as your intelligence skill level increases":
        "技能可以放置在槽位中用於戰鬥。隨著智力專業等級的提升，你將解鎖更多的槽位",
    "Abilities can level up as you gain experience.You get 0.1 experience for every use in combat and a much larger amount from consuming duplicate ability books":
        "隨著經驗的獲得，技能將可以升級。每次在戰鬥中使用技能時可以獲得0.1點經驗，並且從消耗重複的技能書中可以獲得更多經驗",
    "Ability Slots": "技能槽",
    "Learned Abilities": "已學習的技能",
    "Special Ability Slot": "特殊技能槽",

    //------------- 房子(右側邊欄)
    "View Buffs": "查看 Buff",
    "House Buffs": "房子 Buff",
    "Combat Buff": "【戰鬥】Buff",
    "All Skill Buffs": "【所有專業】Buff",
    "Milking Buff": "【擠奶】Buff",
    "Foraging Buff": "【採摘】Buff",
    "Woodcutting Buff": "【伐木】Buff",
    "Cheesesmithing Buff": "【奶酪鍛造】Buff",
    "Crafting Buff": "【製作】Buff",
    "Tailoring Buff": "【裁縫】Buff",
    "Cooking Buff": "【烹飪】Buff",
    "Brewing Buff": "【沖泡】Buff",
    "Alchemy Buff": "【煉金】Buff",
    "Enhancing Buff": "【強化】Buff",
    "Not built": "未建造",
    None: "無",
    Buff: "Buff",
    "Global Buffs": "全域Buff",
    "Dairy Barn": "奶牛棚",
    Garden: "花園",
    "Log Shed": "木材棚",
    Forge: "鍛造台",
    Workshop: "工作間",
    "Sewing Parlor": "裁縫工作室",
    Kitchen: "廚房",
    Brewery: "釀酒廠",
    Laboratory: "實驗室",
    Observatory: "天文台",
    "Dining Room": "餐廳",
    Library: "圖書館",
    Dojo: "道場",
    Gym: "健身房",
    Armory: "軍械庫",
    "Archery Range": "射箭場",
    "Mystical Study": "神秘研究室",
    Wisdom: "經驗",
    "Rare Find": "稀有發現",
    "Construction Costs": "建造消耗",
    Build: "建造",
    "Rooms in your house can be built to give you permanent bonuses": "你的房子裡的房間可以建造，以給予你永久的加成",
    "Each room can be leveled up to a maximum of level 8 with increasing costs": "每個房間可以升級到最高8級，但升級成本逐漸增加",

    //------------- 配裝(右側邊欄)

    "New Loadout": "新建配裝",
    "All Skills": "所有專業",
    "Create Loadout": "創建配裝",
    "Import Current Setup": "導入當前配置",
    "Equip Loadout": "裝備配裝",
    "Loadout equipped": "配裝已裝備",
    "Loadout created": "配裝已創建",
    "Loadout deleted": "配裝已刪除",
    "Loadout Updated": "配裝已更新",
    "Do not notify when items are unavailable": "關閉【消耗品不足】的警告",
    "Imported current setup to loadout": "將當前設定導入配置",
    "Cannot equip loadout in combat": "戰鬥中無法裝載",
    "Delete Loadout": "刪除配裝",
    "View All Loadouts": "查看所有配裝",
    "Loadouts allow you to save your current equipment, consumables, and abilities to be automatically loaded later with actions.Loadouts can be tied to a single skill or \"All Skills.\"Selecting \"All Skills\" will only save equipment":
        "裝備配裝可以讓你保存當前的裝備、消耗品以及技能，以便日後減少操作直接載入。裝備配裝可以與單一專業或 “所有專業” 相關聯。選擇 “所有專業” 將只保存裝備",
    "Are you sure you want to delete this loadout": "<---------- 【確定要刪除此配裝嗎】 ---------->",
    "Are you sure you want to import your current setup? This will overwrite the current loadout": "是否要匯入當前設定？這將覆蓋原本的配置",
    "Use highest enhancement level": "使用最高強化等級",

    };

//2.2 戰鬥
const tranCombat = {
    Stunned: "被眩暈",
    Silenced: "被沉默",
    "Fighting monsters will earn you experience and item drops.Your combat stats are based on a combination of your combat skill levels and your equipment bonuses":
        "擊敗怪物能讓你獲得經驗值以及物品掉落。而戰鬥屬性取決於你的戰鬥專業等級與裝備加成的綜合效果",
    "You can bring food to recover HP or MP, drinks to give you buffs, and abilities that can be cast.You can change the automation configuration from the settings icon below them":
        "你可以攜帶食物恢復HP或MP，飲品可以提供增益效果，還可以施放各種技能。你可以通過下方的設置圖示來更改自動化配置",
    "if you are defeated in combat, your character will wait through a respawn timer before automatically continuing combat": "如果你在戰鬥中被擊敗，你的角色會在等待重生計時器結束後自動繼續戰鬥",
    "combat zone": "戰鬥區域",
    "find party": "尋找隊伍",
    "Private party":"私人隊伍",
    "Public party":"公開隊伍",
    "Auto-kick disabled":"自動踢除已禁用",
    "Auto-kick enabled":"自動踢除已啟用",
    "Auto-kick if not ready over 5 minutes":"自動踢出5分鐘未準備的隊員",
    battle: "戰鬥",
    "auto attack": "自動攻擊",
    "select zone": "選擇區域",
    "Create Party": "創建隊伍",
    Support: "支援",
    Tank: "坦克",
    Join: "加入",
    "Party created": "隊伍已創建",
    "My Party": "我的隊伍",
    "Disband Party": "解散隊伍",
    "Leave Party": "離開隊伍",
    "Added friend": "新增好友",
    "Removed friend": "已刪除好友",
    "Friend already added": "已添加為好友",
    "Character name not found": "未找到角色名稱",
    "Any Role": "任意角色",
    Slot: "位置",
    "Add Slot": "添加位置",
    "Party disbanded": "隊伍已解散",
    Save: "保存",
    "Edit Party": "編輯隊伍",
    Ready: "準備",
    "Party options saved": "隊伍選項已保存",
    "Party is open for recruiting": "隊伍正在招募中",
    "You are ready to battle": "你已準備好戰鬥",
    "You are not ready to battle": "你未準備好戰鬥",
    "You have joined the party": "你加入了隊伍",
    "You have left the party": "你離開了隊伍",
    "Are you sure you want to leave the party": "確定是否要離開隊伍",
    "Are you sure you want to disband the party": "確定是否要解散隊伍",
    "give leadership": "轉讓隊長",
    Defeat: "擊敗",
    Start: "開始",
    disabled: "已禁用",

    //---------------------/ 戰鬥相關
    Physical: "物理",
    "ranged": "遠程",
    "magic": "魔法",
    Slash: "斬擊",
    Stab: "刺擊",
    Smash: "鈍擊",
    Water: "水",
    Nature: "自然",
    Fire: "火",
    Monsters: "怪物",
    "Boss Fight": "首領戰鬥",
    Every: "每個",
    Battles: "戰鬥",
    Travel: "旅行",
    Difficulty: "難度",
    "Combat Level": "戰鬥等級",
    Bonuses: "加成",
    "Entry Key": "門票",
    Bosses: "首領",
    Detail: "詳情",
    "Action Speed": "行動速度",
    "Decreases time cost for the action": "降低行動的時間成本",
    "Milking Level": "擠奶等級",
    "Buffs milking level": "增益擠奶等級",
    "Increases experience gained": "增加獲得的經驗",
    "Increases drop rate of meteorite caches, artisan's crates, and treasure chests": "增加隕石、工匠的箱子和寶箱的掉落率",
    "Cannot change while in combat": "戰鬥中無法更換",
    "Cannot change in combat": "戰鬥中無法更換",

    //---------------------/ 戰鬥設置
    Description: "描述",
    Cooldown: "冷卻",
    "Cast Time": "施法時間",
    "MP Cost": "MP消耗",
    "Combat Triggers": "觸發器",
    "Activate when": "啟動在",
    "Activate as soon as it's off cooldown": "冷卻結束後立即啟動",
    enemy: "敵人",
    "all enemies": "所有敵人",
    "physical damage": "物理傷害",
    "ranged damage": "遠程傷害",
    "magic damage": "魔法傷害",
    "water damage": "水系傷害",
    "nature damage": "自然傷害",
    "fire damage": "火焰傷害",
    stun: "眩暈",
    silence: "沉默",
    bleed: "流血",
    burn: "燃燒",
    "total accuracy": "總精准",
    self: "自己",
    blind: "致盲",
    "Select Target Type": "選擇目標類型",
    "Select Condition": "選擇狀態",
    "Select": "選擇",
    "Casts heal on yourself": "對自己施放治療術",
    "lowest HP ally": "HP最低的隊友",
    "all allies": "所有隊友",
    "physical amplify": "物理傷害增幅",
    "Physical Amplify": "物理傷害增幅",
    "Enemies' Total # of Active Units": "敵人的活躍單位總數",
    AND: "並且",
    "Enemies' Total Current Hp": "敵人的總當前HP",
    "Target Enemy's Current Hp": "目標敵人的當前HP",
    My: "我的",
    "Target Enemy's": "目標敵人的",
    "Enemies' Total": "敵人的總",
    "Allies' Total": "隊友的總",
    "of Active Units": "個活躍單位",
    "of Dead Units": "個死亡單位",
    "Lowest HP": "最低HP",
    "Missing Hp": "缺失HP",
    "Current Hp": "當前HP",
    "Missing Mp": "缺失MP",
    "Current Mp": "當前MP",
    Condition: "條件",
    "Reset Default": "重置為默認",
    Rate: "比率",
    CriticalAura: "致命光環",
    "Puncture Debuff": "穿刺減益(護甲)",
    "Ice Spear Debuff": "冰槍減益(速度)",
    "Frost Surge Debuff": "冰霜爆裂減益(閃避)",
    "Toxic Pollen Debuff": "劇毒粉塵減益",
    "Crippling Slash Debuff": "致殘減益(傷害)",
    "Pestilent Shot Debuff": "疫病減益",
    "Smoke Burst Debuff": "爆塵滅影減益(命中)",
    "Blind Status": "致盲狀態",
    "Silence Status": "沉默狀態",
    "Stun Status": "眩暈狀態",
    "Weaken": "虛弱",
    "Curse": "詛咒",
    "My Missing Mp": "我的缺失MP",
    "My Missing Hp": "我的缺失HP",
    "Is Active": "已啟動",
    "Is Inactive": "未啟動",

    };


//2.3 貨幣
const tranItemCurrencies = {
    Coin: "金幣",
    "Basic currency": "基礎貨幣",
    "Task Token": "任務代幣",
    "Task currency. Spend these in the Task Shop": "任務貨幣。在任務商店中使用這些貨幣",
    "Chimerical Token": "奇幻代幣",
    "Chimerical Tokens": "奇幻代幣",
    "Dungeon currency from the Chimerical Den. Spend these in the Shop": "地下城【奇幻洞穴】的貨幣。可以在商店裡消費",
    "Sinister Token": "邪惡代幣",
    "Sinister Tokens": "邪惡代幣",
    "Dungeon currency from the Sinister Circus. Spend these in the Shop": "地下城【邪惡馬戲團】的貨幣。可以在商店裡消費",
    "Enchanted Token": "秘法代幣",
    "Enchanted Tokens": "秘法代幣",
    "Dungeon currency from the Enchanted Fortress. Spend these in the Shop": "地下城【秘法要塞】的貨幣。可以在商店裡消費",
    "Pirate Token": "海盜代幣",
    "Pirate Tokens": "海盜代幣",
    "Dungeon currency from the Pirate Cove. Spend these in the Shop": "地下城【海盜灣】的貨幣。可以在商店裡消費",
    Cowbell: "牛鈴",
    "Premium currency. Buy or spend these in the Cowbell Store": "高級貨幣。在牛鈴商店購買或使用這些貨幣",
    };

//2.4 資源(商店順序)
const tranItemResources = {
    "Bag Of 10 Cowbells": "牛鈴袋（10個）",
    "Tradable bag of 10 Cowbells. Once opened, the Cowbells can no longer be sold on the market": "可交易的牛鈴袋（10個）。一旦打開，牛鈴將無法在市場上出售",

    //----------------------/ 牛奶
    Milk: "牛奶",
    mooo: "哞",
    "Verdant Milk": "翠綠牛奶",
    moooo: "哞哞",
    "Azure Milk": "蔚藍牛奶",
    mooooo: "哞哞哞",
    "Burble Milk": "深紫牛奶",
    moooooo: "哞哞哞哞",
    "Crimson Milk": "絳红牛奶",
    mooooooo: "哞哞哞哞哞",
    "Rainbow Milk": "彩虹牛奶",
    moooooooo: "哞哞哞哞哞哞",
    "Holy Milk": "神聖牛奶",
    mooooooooo: "哞哞哞哞哞哞哞",
    Cheese: "乳酪",
    "Verdant Cheese": "翠綠乳酪",
    "Azure Cheese": "蔚藍乳酪",
    "Burble Cheese": "深紫乳酪",
    "Crimson Cheese": "絳红乳酪",
    "Rainbow Cheese": "彩虹乳酪",
    "Holy Cheese": "神聖乳酪",

    //----------------------/ 木頭
    Log: "原木",
    "Birch": "白樺",
    "Cedar": "雪松",
    "Purpleheart": "紫心",
    "Redwood": "紅杉",
    "Arcane": "神秘",
    "Ginkgo": "銀杏",
    "Birch Log": "白樺原木",
    "Cedar Log": "雪松原木",
    "Purpleheart Log": "紫心原木",
    "Ginkgo Log": "銀杏原木",
    "Redwood Log": "紅杉原木",
    "Arcane Log": "神秘原木",
    Lumber: "木板",
    "Birch Lumber": "白樺木板",
    "Cedar Lumber": "雪松木板",
    "Purpleheart Lumber": "紫心木板",
    "Ginkgo Lumber": "銀杏木板",
    "Redwood Lumber": "紅杉木板",
    "Arcane Lumber": "神秘木板",

    //----------------------/ 皮革
    "Rough Hide": "粗糙獸皮",
    "Gobo": "哥布林",
    "Reptile Hide": "爬行動物皮",
    "Gobo Hide": "哥布林皮",
    "Beast Hide": "野獸皮",
    "Umbral Hide": "暗影皮",
    "Rough Leather": "粗糙皮革",
    "Reptile Leather": "爬行動物皮革",
    "Gobo Leather": "哥布林皮革",
    "Beast Leather": "野獸皮革",
    "Umbral Leather": "暗影皮革",

    //----------------------/ 布料
    Cotton: "棉花",
    Flax: "亞麻",
    "Bamboo Branch": "竹子",
    Cocoon: "繭",
    "Radiant Fiber": "光輝纖維",
    "Cotton Fabric": "棉花布料",
    "Linen Fabric": "亞麻布料",
    "Bamboo Fabric": "竹子布料",
    "Silk Fabric": "絲綢",
    "Radiant Fabric": "光輝布料",
    Egg: "雞蛋",
    Wheat: "小麥",
    Sugar: "糖",
    Blueberry: "藍莓",
    Blackberry: "黑莓",
    Strawberry: "草莓",
    Mooberry: "月梅",
    Marsberry: "火星梅",
    Spaceberry: "太空梅",
    Apple: "蘋果",
    Orange: "柳丁",
    Plum: "李子",
    Peach: "桃子",
    "Dragon Fruit": "火龍果",
    "Star Fruit": "楊桃",

    //----------------------/ 茶葉跟豆
    "Arabica Coffee Bean": "低級咖啡豆",
    "Robusta Coffee Bean": "中級咖啡豆",
    "Liberica Coffee Bean": "高級咖啡豆",
    "Excelsa Coffee Bean": "特級咖啡豆",
    "Fieriosa Coffee Bean": "火山咖啡豆",
    "Spacia Coffee Bean": "太空咖啡豆",
    "Green Tea Leaf": "綠茶葉",
    "Black Tea Leaf": "黑茶葉",
    "Burble Tea Leaf": "紫茶葉",
    "Moolong Tea Leaf": "月亮茶葉",
    "Red Tea Leaf": "紅茶葉",
    "Emp Tea Leaf": "虛空茶葉",

    //----------------------/ 催化劑
    "Catalyst Of Coinification": "點金催化劑",
    "Used in alchemy to increase the coinifying success rate by 15% (multiplicative). One catalyst is consumed on success": "用於煉金，使【點金】成功率提高15%（乘數），成功時會消耗一個。",
    "Catalyst Of Decomposition": "分解催化劑",
    "Used in alchemy to increase the decomposition success rate by 15% (multiplicative). One catalyst is consumed on success": "用於煉金，使【分解】成功率提高15%（乘數），成功時會消耗一個",
    "Catalyst Of Transmutation": "轉化催化劑",
    "Used in alchemy to increase the transmutation success rate by 15% (multiplicative). One catalyst is consumed on success": "用於煉金，使【轉化】成功率提高15%（乘數），成功時會消耗一個",
    "Prime Catalyst": "至高催化劑",
    "Used in alchemy to increase the success rate of any action by 25% (multiplicative). One catalyst is consumed on success": "用於煉金，使任何煉金行動的成功率提高 25%（乘數），成功時會消耗一個",

    //----------------------/ 材料
    "Snake Fang": "蛇牙",
    "Material used in smithing Snake Fang Dirk": "鍛造蛇牙短劍的材料",
    "Shoebill Feather": "大嘴鸛羽毛",
    "Material used in tailoring Shoebill Shoes": "縫紉大嘴鸛鞋的材料",
    "Snail Shell": "蝸牛殼",
    "Material used in smithing Snail Shell Helmet": "鍛造蝸牛殼頭盔的材料",
    "Crab Pincer": "蟹鉗",
    "Material used in smithing Pincer Gloves": "鍛造螃蟹手套的材料",
    "Turtle Shell": "烏龜殼",
    "Material used in smithing Turtle Shell Plate Body or Legs": "鍛造龜殼胸甲或腿甲的材料",
    "Marine Scale": "海洋鱗片",
    "Material used in tailoring Marine Tunic or Chaps": "縫紉海洋皮衣或皮褲的材料",
    "Treant Bark": "樹皮",
    "Material used in crafting Treant Shield": "製作樹人盾的材料",
    "Centaur Hoof": "半人馬蹄",
    "Material used in tailoring Centaur Boots": "縫紉半人馬靴的材料",
    "Luna Wing": "月神翼",
    "Material used in tailoring Luna Robe Top or Bottoms": "縫紉月神袍服或袍裙的材料",
    "Gobo Rag": "哥布林破布",
    "Material used in tailoring Collector's Boots": "縫紉收藏家靴的材料",
    "Goggles": "護目鏡",
    "Material used in smithing Vision Helmet": "鍛造視覺頭盔的材料",
    "Magnifying Glass": "放大鏡",
    "Material used in smithing Vision Shield or tailoring Sighted Bracers": "鍛造視覺盾或縫視覺護腕的材料",
    "Eye Of The Watcher": "觀察者之眼",
    "Material used in crafting Eye Watch or Watchful Relic": "製作掌上監工或警戒遺物的材料",
    "Icy Cloth": "冰霜碎布",
    "Material used in tailoring Icy Robe Top or Bottoms": "縫紉冰霜袍服或袍裙的材料",
    "Flaming Cloth": "烈焰碎布",
    "Material used in tailoring Flaming Robe Top or Bottoms": "縫紉烈焰袍服或袍裙的材料",
    "Sorcerer's Sole": "魔法師的鞋底",
    "Material used in tailoring Sorcerer Boots": "縫紉魔法師靴的材料",
    "Chrono Sphere": "時空球",
    "Material used in tailoring Enchanted Gloves or Chrono Gloves": "縫紉附魔手套或時空手套的材料",
    "Frost Sphere": "冰霜球",
    "Material used in crafting Frost Staff": "製作冰霜法杖的材料",
    "Panda Fluff": "熊貓絨",
    "Material used in smithing Panda Gloves": "鍛造熊貓手套的材料",
    "Black Bear Fluff": "黑熊絨",
    "Material used in smithing Black Bear Shoes": "鍛造黑熊鞋的材料",
    "Grizzly Bear Fluff": "灰熊絨",
    "Material used in smithing Grizzly Bear Shoes": "鍛造灰熊鞋的材料",
    "Polar Bear Fluff": "北極熊絨",
    "Material used in smithing Polar Bear Shoes": "鍛造北極熊鞋的材料",
    "Red Panda Fluff": "小熊貓絨",
    "Material used in tailoring Red Culinary Hat or Fluffy Red Hat": "縫紉紅色廚師帽或蓬鬆紅帽的材料",
    Magnet: "磁鐵",
    "Material used in smithing Magnetic Gloves": "鍛造磁力手套的材料",
    "Stalactite Shard": "鐘乳石碎片",
    "Material used in smithing Stalactite Spear or Spiked Bulwark": "鍛造石鐘長槍或尖刺盾的材料",
    "Living Granite": "花崗岩",
    "Material used in smithing Granite Bludgeon or Spiked Bulwark": "鍛造花崗岩大棒或尖刺盾的材料",
    "Colossus Core": "巨像核心",
    "Material used in smithing Colossus Plate Body or Legs": "鍛造巨像胸甲或腿甲的材料",
    "Vampire Fang": "吸血鬼之牙",
    "Material used in smithing Vampire Fang Dirk or crafting Vampiric Bow": "鍛造吸血鬼短劍或製作吸血弓的材料",
    "Werewolf Claw": "狼人之爪",
    "Material used in smithing Werewolf Slasher or crafting Vampiric Bow": "鍛造狼人關刀或製作吸血弓的材料",
    "Revenant Anima": "亡者之魂",
    "Material used in tailoring Revenant Tunic or Chaps": "縫紉亡靈皮衣或皮褲的材料",
    "Soul Fragment": "靈魂碎片",
    "Material used in crafting Soul Hunter Crossbow": "製作靈魂獵手弩的材料",
    "Infernal Ember": "地獄餘燼",
    "Material used in crafting Infernal Battlestaff": "製作煉獄法杖的材料",
    "Demonic Core": "惡魔核心",
    "Material used in smithing Demonic Plate Body or Legs": "鍛造惡魔胸甲或腿甲的材料",
    "Dodocamel Plume": "渡駝之羽",
    "Material used in smithing Dodocamel Gauntlets": "鍛造渡駝護手的材料",
    "Manticore Sting": "蠍獅之刺",
    "Material used in crafting Manticore Shield": "製作蠍獅盾的材料",
    "Griffin Leather": "獅鷲之皮",
    "Material used in cheesesmithing Griffin Bulwark and tailoring Griffin Tunic or Chaps": "鍛造獅鷲盾跟縫紉獅鷲皮衣或皮褲的材料",
    "Jackalope Antler": "鹿角兔之角",
    "Material used in crafting Jackalope Staff": "製作鹿角兔之杖的材料",
    "Acrobat's Ribbon": "雜技師之帶",
    "Material used in tailoring Acrobatic Hood": "製作雜技師兜帽的材料",
    "Griffin Talon": "獅鷲之爪",
    "Material used in smithing Griffin Bulwark": "鍛造獅鷲盾的材料",
    "Magician's Cloth": "魔術師碎布",
    "Material used in tailoring Magician's Hat": "製作魔術師之帽的材料",
    "Chaotic Chain": "混沌鎖鏈",
    "Material used in smithing Chaotic Flail": "鍛造混沌連枷的材料",
    "Cursed Ball": "詛咒之球",
    "Material used in crafting Cursed Bow": "製作咒怨弓的材料",
    "Knight's Ingot": "騎士之錠",
    "Material used in smithing Knight's Aegis": "鍛造騎士盾的材料",
    "Bishop's Scroll": "主教卷軸",
    "Material used in crafting Bishop's Codex": "製作主教之書的材料",
    "Royal Cloth": "皇家碎布",
    "Material used in tailoring Royal Robe Top or Bottoms": "縫紉皇家袍服和皇家袍裙的材料",
    "Regal Jewel": "君王寶石",
    "Material used in smithing Regal Sword and Furious Spear": "鍛造君王劍和狂怒長槍的材料",
    "Sundering Jewel": "裂空寶石",
    "Material used in crafting Sundering Crossbow and smithing Furious Spear": "製作裂空弩和鍛造狂怒長槍的材料",
    "Butter of Proficiency":"黃油",
    "Thread Of Expertise":"線團",
    "Material used in producing special skilling outfits": "生產特殊專業服裝的材料",
    "Branch of Insight":"樹枝",
    "Material used in producing special skilling tools and outfits": "生產特殊專業工具和服裝的材料",
    "Gluttonous Energy": "貪吃能量",
    "Used for tailoring Gluttonous Pouch": "縫紉貪吃袋",
    "Guzzling Energy": "暴飲能量",
    "Used for tailoring Guzzling Pouch": "縫紉暴飲袋",
    "Marksman Brooch": "神射胸針",
    "Material used in tailoring Marksman Bracers": "縫紉神射護腕的材料",
    "Corsair Crest": "海盜徽章",
    "Material used in smithing Corsair Helmet": "鍛造海盜頭盔的材料",
    "Damaged Anchor": "損壞的船錨",
    "Material used in smithing Anchorbound Plate Body or Legs": "鍛造錨定胸甲或腿甲的材料",
    "Maelstrom Plating": "怒濤碎片",
    "Material used in smithing Maelstrom Plate Body or Legs": "鍛造漩渦胸甲或腿甲的材料",
    "Kraken Leather": "克拉肯皮革",
    "Material used in tailoring Kraken Tunic or Chaps": "縫紉克拉肯皮衣或皮褲的材料",
    "Kraken Fang": "克拉肯毒牙",
    "Material used in crafting Rippling, Blooming, or Blazing Trident": "製作漣漪、綻放或熾焰三叉戟的材料",

    //----------------------/ 精煉碎片
    "Chimerical Refinement Shard": "奇幻精煉碎片",
    "Material used in upgrading level 95 equipment and Chimerical Quiver from the Chimerical Den": "升級【奇幻洞穴】95級裝備和奇幻箭袋的材料",
    "Sinister Refinement Shard": "邪惡精煉碎片",
    "Material used in upgrading level 95 equipment and Sinister Cape from the Sinister Circus": "升級【邪惡馬戲團】95級裝備和邪惡斗篷的材料",
    "Enchanted Refinement Shard": "秘法精煉碎片",
    "Material used in upgrading level 95 equipment and Enchanted Cloak from the Enchanted Fortress": "升級【秘法要塞】95級裝備和秘法披風的材料",
    "Pirate Refinement Shard": "海盜精煉碎片",
    "Material used in upgrading level 95 equipment from the Pirate's Cove": "升級【海盜灣】95級裝備的材料",

    //----------------------/ 精華
    "Chimerical Essence": "奇幻精華",
    "Used for enhancing special equipment from the Chimerical Den": "用於強化奇幻洞穴特殊裝備的材料",
    "Sinister Essence": "邪惡精華",
    "Used for enhancing special equipment from the Sinister Circus": "用於強化邪惡馬戲團特殊裝備的材料",
    "Enchanted Essence": "秘法精華",
    "Used for enhancing special equipment from the Enchanted Fortress": "用於強化秘法要塞特殊裝備的材料",
    "Pirate Essence": "海盜精華",
    "Used for enhancing special equipment from the Pirate Cove": "用於強化海盜灣特殊裝備的材料",
    "Milking Essence": "擠奶精華",
    "Used for brewing milking tea and crafting alchemy catalyst": "用於沖泡擠奶茶及製作煉金催化劑",
    "Foraging Essence": "採摘精華",
    "Used for brewing foraging tea and crafting alchemy catalyst": "用於沖泡採摘茶及製作煉金催化劑",
    "Woodcutting Essence": "伐木精華",
    "Used for brewing woodcutting tea and crafting alchemy catalyst": "用於沖泡伐木茶及製作煉金催化劑",
    "Cheesesmithing Essence": "乳酪鍛造精華",
    "Used for brewing cheesesmithing tea and crafting alchemy catalyst": "用於沖泡乳酪鍛造茶及製作煉金催化劑",
    "Crafting Essence": "製作精華",
    "Used for brewing crafting tea and crafting alchemy catalyst": "用於沖泡製作茶及製作煉金催化劑",
    "Tailoring Essence": "裁縫精華",
    "Used for brewing tailoring tea and crafting alchemy catalyst": "用於沖泡裁縫茶及製作煉金催化劑",
    "Cooking Essence": "烹飪精華",
    "Used for brewing cooking tea and crafting alchemy catalyst": "用於沖泡烹飪茶及製作煉金催化劑",
    "Brewing Essence": "沖泡精華",
    "Used for brewing brewing tea and crafting alchemy catalyst": "用於沖泡沖泡茶及製作煉金催化劑",
    "Alchemy Essence": "煉金精華",
    "Used for brewing alchemy tea and crafting alchemy catalyst": "用於沖泡煉金茶和製作煉金催化劑",
    "Enhancing Essence": "強化精華",
    "Used for brewing enhancing tea and crafting alchemy catalyst": "用於沖泡強化茶及製作煉金催化劑",
    "Swamp Essence": "沼澤精華",
    "Used for enhancing special equipment from Swamp Planet": "用於強化沼澤星球特殊裝備的材料",
    "Aqua Essence": "海洋精華",
    "Used for enhancing special equipment from Aqua Planet": "用於強化海洋星球特殊裝備的材料",
    "Jungle Essence": "叢林精華",
    "Used for enhancing special equipment from Jungle Planet": "用於強化叢林星球特殊裝備的材料",
    "Gobo Essence": "哥布林精華",
    "Used for enhancing special equipment from Gobo Planet": "用於強化哥布林星球特殊裝備的材料",
    Eyessence: "眼球精華",
    "Used for enhancing special equipment from Planet Of The Eyes": "用於強化眼球星球特殊裝備的材料",
    "Sorcerer Essence": "法師精華",
    "Used for enhancing special equipment from Sorcerer's Tower": "用於強化巫師之塔特殊裝備的材料",
    "Bear Essence": "熊熊精華",
    "Used for enhancing special equipment from Bear With It": "用於強化熊熊星球特殊裝備的材料",
    "Golem Essence": "魔像精華",
    "Used for enhancing special equipment from Golem Cave": "用於強化魔像洞穴特殊裝備的材料",
    "Twilight Essence": "暮光精華",
    "Used for enhancing special equipment from Twilight Zone": "用於強化暮光之城特殊裝備的材料",
    "Abyssal Essence": "地獄精華",
    "Used for enhancing special equipment from Infernal Abyss": "用於強化地獄深淵特殊裝備的材料",

    //----------------------/ 石頭
    "Task Crystal": "任務水晶",
    "Crystals obtained from Purple. They can be used to craft special trinkets": "從牛紫的禮物中獲得的晶體。用於製作特殊的飾品",
    "Star Fragment": "星光碎片",
    "Fragments with a celestial origin found in Meteorite Caches. They can be used to craft jewelry": "存在於隕石中的天體碎片。用於製作珠寶",
    Pearl: "珍珠",
    "A shiny gem often found from Treasure Chests": "從寶箱中找到的閃亮物品",
    Amber: "琥珀",
    Garnet: "石榴石",
    Jade: "翡翠",
    Amethyst: "紫水晶",
    Moonstone: "月亮石",
    "Crushed Pearl": "珍珠碎片",
    "Used to be a piece of pearl": "曾經是一顆珍珠",
    "Crushed Amber": "琥珀碎片",
    "Used to be a piece of amber": "曾經是一塊琥珀",
    "Crushed Garnet": "石榴石碎片",
    "Used to be a piece of garnet": "曾經是一顆石榴石",
    "Crushed Jade": "翡翠碎片",
    "Used to be a piece of jade": "曾經是一塊翡翠",
    "Crushed Amethyst": "紫水晶碎片",
    "Used to be a piece of amethyst": "曾經是一顆紫水晶",
    "Crushed Moonstone": "月亮石碎片",
    "Used to be a piece of moonstone": "曾經是一塊月亮石",
    "Shard Of Protection": "保護碎片",
    "Found from Artisan's Crates. They are used for crafting Mirror of Protection": "從工匠的箱子中獲得。用於合成保護之鏡",
    "Mirror Of Protection": "保護之鏡",
    "A rare artifact that functions as a copy of any equipment for enhancing protection": "一種罕見的文物，可以作為任何裝備的替代品，用於強化保護",
    "Philosopher's Stone": "賢者之石",
    "A legendary stone of immense power": "傳說中的石頭，擁有巨大的力量",
    "Crushed Philosopher's Stone": "賢者之石碎片",
    "Used to be a piece of a philosopher's stone": "曾經是一塊賢者之石",
    "Sunstone": "太陽石",
    "A shiny gem in the shape of the sun": "一顆太陽形狀的閃亮寶石",
    "Crushed Sunstone": "太陽石碎片",
    "Used to be a piece of sunstone": "曾經是一塊太陽石",
    "Philosopher's Mirror": "賢者之鏡",
    "A mystical artifact for enhancing. When used as protection, the enhancement is guaranteed to succeed and the enhancing cost changes to a copy of the base item at one enhancement level below the primary item":
        "一件用於強化的神秘神器。當用作防護道具時，強化必定成功，且強化成本將變更為「比主物品低 1 級強化等級的基礎物品副本」",

    };

//----2.4.1 消耗品
let tranItemConsumable = {
    Donut: "甜甜圈",
    "Blueberry Donut": "藍莓甜甜圈",
    "Blackberry Donut": "黑莓甜甜圈",
    "Strawberry Donut": "草莓甜甜圈",
    "Mooberry Donut": "月莓甜甜圈",
    "Marsberry Donut": "火星莓甜甜圈",
    "Spaceberry Donut": "太空莓甜甜圈",

    Cupcake: "紙杯蛋糕",
    "Blueberry Cake": "藍莓蛋糕",
    "Blackberry Cake": "黑莓蛋糕",
    "Strawberry Cake": "草莓蛋糕",
    "Mooberry Cake": "月莓蛋糕",
    "Marsberry Cake": "火星莓蛋糕",
    "Spaceberry Cake": "太空莓蛋糕",

    Gummy: "軟糖",
    "Apple Gummy": "蘋果軟糖",
    "Orange Gummy": "橙子軟糖",
    "Plum Gummy": "李子軟糖",
    "Peach Gummy": "桃子軟糖",
    "Dragon Fruit Gummy": "火龍果軟糖",
    "Star Fruit Gummy": "楊桃軟糖",

    Yogurt: "優格",
    "Apple Yogurt": "蘋果優格",
    "Orange Yogurt": "柳丁優格",
    "Plum Yogurt": "李子優格",
    "Peach Yogurt": "桃子優格",
    "Dragon Fruit Yogurt": "火龍果優格",
    "Star Fruit Yogurt": "楊桃優格",

    "Milking Tea": "擠奶茶",
    "Foraging Tea": "採摘茶",
    "Woodcutting Tea": "伐木茶",
    "Cooking Tea": "烹飪茶",
    "Brewing Tea": "沖泡茶",
    "Alchemy Tea": "煉金茶",
    "Enhancing Tea": "強化茶",
    "Cheesesmithing Tea": "乳酪鍛造茶",
    "Crafting Tea": "製作茶",
    "Tailoring Tea": "裁縫茶",

    "Super Milking Tea": "超級擠奶茶",
    "Super Foraging Tea": "超級採摘茶",
    "Super Woodcutting Tea": "超級伐木茶",
    "Super Cooking Tea": "超級烹飪茶",
    "Super Brewing Tea": "超級沖泡茶",
    "Super Alchemy Tea": "超級煉金茶",
    "Super Enhancing Tea": "超級強化茶",
    "Super Cheesesmithing Tea": "超級乳酪鍛造茶",
    "Super Crafting Tea": "超級製作茶",
    "Super Tailoring Tea": "超級裁縫茶",

    "Ultra Milking Tea": "究極擠奶茶",
    "Ultra Foraging Tea": "究極採摘茶",
    "Ultra Woodcutting Tea": "究極伐木茶",
    "Ultra Cooking Tea": "究極烹飪茶",
    "Ultra Brewing Tea": "究極沖泡茶",
    "Ultra Alchemy Tea": "究極煉金茶",
    "Ultra Enhancing Tea": "究極強化茶",
    "Ultra Cheesesmithing Tea": "究極乳酪鍛造茶",
    "Ultra Crafting Tea": "究極製作茶",
    "Ultra Tailoring Tea": "究極裁縫茶",

    "Gathering Tea": "採集茶",
    "Gourmet Tea": "美食茶",
    "Wisdom Tea": "經驗茶",
    "Processing Tea": "加工茶",
    "Efficiency Tea": "效率茶",
    "Artisan Tea": "工匠茶",
    "Blessed Tea": "祝福茶",
    "Catalytic Tea": "催化茶",

    "Stamina Coffee": "耐力咖啡",
    "Intelligence Coffee": "智力咖啡",
    "Defense Coffee": "防禦咖啡",
    "Attack Coffee": "攻擊咖啡",
    "Melee Coffee": "近戰咖啡",
    "Ranged Coffee": "遠程咖啡",
    "Magic Coffee": "魔法咖啡",

    "Super Stamina Coffee": "超級耐力咖啡",
    "Super Intelligence Coffee": "超級智力咖啡",
    "Super Defense Coffee": "超級防禦咖啡",
    "Super Attack Coffee": "超級攻擊咖啡",
    "Super Melee Coffee": "超級近戰咖啡",
    "Super Ranged Coffee": "超級遠程咖啡",
    "Super Magic Coffee": "超級魔法咖啡",

    "Ultra Stamina Coffee": "究極耐力咖啡",
    "Ultra Intelligence Coffee": "究極智力咖啡",
    "Ultra Defense Coffee": "究極防禦咖啡",
    "Ultra Attack Coffee": "究極攻擊咖啡",
    "Ultra Melee Coffee": "究極近戰咖啡",
    "Ultra Ranged Coffee": "究極遠程咖啡",
    "Ultra Magic Coffee": "究極魔法咖啡",

    "Wisdom Coffee": "經驗咖啡",
    "Lucky Coffee": "幸運咖啡",
    "Swiftness Coffee": "迅捷咖啡",
    "Channeling Coffee": "吟唱咖啡",
    "Critical Coffee": "暴擊咖啡",
};

//----2.4.2 技能書
let tranItemBook = {
    //------------------* 矛類
    Poke: "破膽之刺",
    "Pokes the targeted enemy": "猛猛地戳向目標敵人",
    Impale: "透骨之刺",
    "Impales the targeted enemy": "猛猛地刺擊目標敵人",
    Puncture: "破甲之刺",
    "Punctures the targeted enemy's armor, dealing damage and temporarily reducing its armor": "擊破目標敵人的護甲，造成傷害並臨時降低其護甲",
    "Penetrating Strike": "貫心之刺（貫穿）",
    "Strikes the targeted enemy. on each successful hit, will pierce and hit the next enemy": "刺擊目標敵人。如果成功命中敵人，則貫穿並命中下一個敵人",

    //------------------* 劍類
    Scratch: "爪影斬",
    "Scratches the targeted enemy": "抓傷目標敵人",
    Cleave: "分裂斬（群體）",
    "Cleaves all enemies": "劈砍所有敵人",
    Maim: "血刃斬",
    "Maims the targeted enemy and causes bleeding": "劃傷目標敵人使之流血",
    "Crippling Slash": "致殘斬（群體）",
    "Slashes all enemies and reduce their damage": "斬擊所有敵人並減少它的傷害",

    //------------------* 錘類
    Smack: "重碾",
    "Smacks the targeted enemy": "猛擊目標敵人",
    Sweep: "重掃（群體）",
    "Performs a sweeping attack on all enemies": "對所有敵人進行橫掃攻擊",
    "Stunning Blow": "重錘",
    "Smashes the targeted enemy and has a chance to stun": "重錘目標敵人並有幾率眩暈",
    "Fracturing Impact": "碎裂衝擊（群體）",
    "Attacks all enemies, dealing damage and increases their damage taken": "攻擊所有敵人，在造成傷害後會提升其後續所受伤害",
    "Shield Bash": "盾擊",
    "Bashes the targeted enemy with a shield, dealing extra damage based on attacker's armor": "盾擊目標敵人，並根據自身護甲值造成額外傷害",


    //------------------* 弓弩類
    "Quick Shot": "快速射擊",
    "Takes a quick shot at the targeted enemy": "對目標敵人進行快速射擊",
    "Aqua Arrow": "流水箭",
    "Shoots an arrow made of water at the targeted enemy": "對目標敵人射出水箭",
    "Flame Arrow": "烈焰箭",
    "Shoots a flaming arrow at the targeted enemy": "對目標敵人射出火焰箭",
    "Rain Of Arrows": "箭雨（群體）",
    "Shoots a rain of arrows on all enemies": "對所有敵人射出箭雨",
    "Silencing Shot": "沉默之箭",
    "Takes a shot at the targeted enemy, temporarily silencing them": "對目標敵人射擊並沉默目標",
    "Steady Shot": "穩定射擊",
    "Takes a shot at the targeted enemy with greatly enhanced accuracy": "以極高的精准對目標敵人進行射擊",
    "Pestilent Shot": "疫病射擊",
    "Shoots the targeted enemy, dealing damage and decreasing armor and resistances":  "對目標敵人射擊，並降低其護甲和抗性",
    "Penetrating Shot": "貫穿射擊（貫穿）",
    "Shoots the targeted enemy. on each successful hit, will pierce and hit the next enemy": "射擊目標敵人。如果成功命中敵人，則貫穿並命中到下一個敵人",

    //------------------* 水系魔法
    "Water Strike": "流水衝擊",
    "Casts a water strike at the targeted enemy": "對目標敵人發射流水衝擊",
    "Ice Spear": "冰槍術",
    "Casts an ice spear at the targeted enemy, dealing damage and reducing attack speed": "對目標敵人投擲冰矛，造成傷害並降低攻擊速度",
    "Frost Surge": "冰霜爆裂（群體）",
    "Casts frost surge at all enemies, dealing damage and reducing evasion": "對所有敵人施放冰霜爆裂,造成傷害並減少閃避",
    "Mana Spring": "法力噴泉（群體）",
    "Casts mana spring at all enemies, dealing damage and increasing ally MP regeneration": "對所有敵人釋放法力噴泉，造成傷害並增加友方MP恢復值",

    //------------------* 自然系魔法
    Entangle: "纏繞",
    "Entangles the targeted enemy, dealing damage with chance to stun": "纏繞目標敵人，造成傷害並有幾率眩暈敵人",
    "Toxic Pollen": "劇毒粉塵（群體）",
    "Casts toxic pollen at all enemies, dealing damage and decreasing armor and resistances": "對所有敵人施放劇毒粉塵，造成傷害並減少護甲和魔抗",
    "Nature's Veil": "自然菌幕（群體）",
    "Cast's a veil over all enemies, dealing damage with a chance to blind": "給所有敵人蒙上一層菌幕，造成傷害並有幾率致盲",
    "Life Drain": "生命吸取",
    "Drains the life force of the targeted enemy, dealing damage and healing the caster": "吸取目標敵人的生命力，造成傷害並治療施法者",

    //------------------* 火系魔法
    Fireball: "火球",
    "Casts a fireball at the targeted enemy": "對目標敵人施放火球",
    "Flame Blast": "熔岩爆裂（群體）",
    "Casts a flame blast at all enemies": "對所有敵人施放熔岩爆裂",
    Firestorm: "火焰風暴（群體）",
    "Casts a firestorm at all enemies": "對所有敵人施放火焰風暴",
    "Smoke Burst": "爆塵滅影",
    "Casts a smoke burst at the targeted enemy, dealing damage and decreasing their accuracy": "對目標敵人釋放爆塵滅影，造成傷害並減少精準",

    //------------------* 治療類
    "Minor Heal": "次級自愈術",
    "Casts minor heal on yourself": "對【自己】施放次級治療術",
    Heal: "自愈術",
    "Casts heal on yourself": "對【自己】施放治療術",
    "Quick Aid": "快速治療術",
    "Casts heal on the ally with the lowest HP percentage": "對HP百分比最低的隊友施放治療術",
    Rejuvenate: "群體治療術",
    "Heals all allies": "治療所有隊友",

    //------------------* 黃書類
    Taunt: "嘲諷",
    "Greatly increases threat rating": "大幅增加威脅等級",
    Provoke: "挑釁",
    "Tremendously increases threat rating": "極大地增加威脅等級",
    Toughness: "堅韌",
    "Greatly increases armor and resistances temporarily": "臨時大幅增加護甲和抗性",
    Elusiveness: "閃避",
    "Greatly increases evasion temporarily": "臨時大幅增加閃避",
    Precision: "精確",
    "Greatly increases accuracy temporarily": "臨時大幅增加精準",
    Berserk: "狂暴",
    "Greatly increases physical damage temporarily": "臨時大幅增加物理傷害",
    Frenzy: "狂熱",
    "Greatly increases attack speed temporarily": "臨時大幅增加攻擊速度",
    "Elemental Affinity": "元素親和",
    "Greatly increases elemental damage temporarily": "臨時大幅增加魔法傷害",
    "Spike Shell": "尖刺防護",
    "Gains physical and elemental thorns temporarily": "臨時獲得物理和魔法反傷",
    "Retribution": "懲戒",
    "Gains retaliation temporarily": "臨時獲得反傷加成",
    Vampirism: "吸血",
    "Gains lifesteal temporarily": "臨時獲得生命偷取",

    //------------------* 藍書類
    Revive: "復活",
    "Revives a dead ally": "復活一個死亡的隊友",
    Insanity: "瘋狂",
    "Increases damage, attack speed, and cast speed temporarily at the cost of HP": "以HP為代價，臨時增加傷害、攻擊速度和施法速度",
    Invincible: "無敵",
    "Tremendously increases armor, resistances, and tenacity temporarily": "臨時極大增加護甲、抗性和堅韌",
    "Speed Aura": "速度光環",
    "Increases attack speed and cast speed for all allies": "增加所有隊友的攻擊速度和施法速度",
    "Increases attack speed and cast speed for all allies. Effect increases by (0.005x) per caster's Attack level": "增加所有隊友的攻擊速度和施法速度。效果隨施法者攻擊等級提升而增加(0.005x)",
    "Guardian Aura": "守護光環",
    "Increases healing amplify, evasion, armor, and resistances for all allies. Effect increases by (0.005x) per caster's Defense level": "增加所有隊友的治療效果、護甲和抗性。效果隨施法者防禦等級提升而增加(0.005x)",
    "Fierce Aura": "物理光環",
    "Increases physical amplify and armor for all allies": "增加所有隊友的物理強化和護甲",
    "Increases physical amplify for all allies. Effect increases by (0.005x) per caster's Melee level": "增加所有隊友的物理強化。效果隨施法者近戰等級提升而增加(0.005x)",
    "Critical Aura": "暴擊光環",
    "Increases critical rate for all allies": "增加所有隊友的暴擊率",
    "Increases critical rate and critical damage for all allies. Effect increases by (0.005x) per caster's Ranged level": "增加所有隊友的暴擊率。效果隨施法者遠程等級提升而增加(0.005x)",
    "Mystic Aura": "元素光環",
    "Increases elemental amplify for all allies. Effect increases by (0.005x) per caster's Magic level": "增加所有隊友的元素強化。效果隨施法者魔法等級提升而增加(0.005x)",


};

//----2.4.3 鑰匙(商店順序)
const tranKeys = {

    "Blue Key Fragment": "藍色鑰匙碎片",
    "Green Key Fragment": "綠色鑰匙碎片",
    "Purple Key Fragment": "紫色鑰匙碎片",
    "White Key Fragment": "白色鑰匙碎片",
    "Orange Key Fragment": "橙色鑰匙碎片",
    "Brown Key Fragment": "棕色鑰匙碎片",
    "Stone Key Fragment": "石頭鑰匙碎片",
    "Dark Key Fragment": "黑暗鑰匙碎片",
    "Burning Key Fragment": "燃燒鑰匙碎片",
    "Chimerical Entry Key": "奇幻鑰匙",
    "Chimerical Chest Key": "奇幻寶箱鑰匙",
    "Sinister Entry Key": "邪惡鑰匙",
    "Sinister Chest Key": "邪惡寶箱鑰匙",
    "Enchanted Entry Key": "秘法鑰匙",
    "Enchanted Chest Key": "秘法寶箱鑰匙",
    "Pirate Entry Key": "海盜鑰匙",
    "Pirate Chest Key": "海盜寶箱鑰匙",
    "Allows 1 entry into the Chimerical Den dungeon": "可進入地下城：【奇幻洞穴】1次",
    "Allows 1 entry into the Sinister Circus dungeon": "可進入地下城：【邪惡馬戲團】1次",
    "Allows 1 entry into the Enchanted Fortress dungeon": "可進入地下城：【秘法要塞】1次",
    "Allows 1 entry into the Pirate cove dungeon": "可進入地下城：【海盜灣】1次",
    "Can be used to craft dungeon keys": "某種鑰匙的碎片，可以製作成地下城鑰匙",
    "Opens 1 Chimerical Chest": "開啟一個奇幻寶箱",
    "Opens 1 Sinister Chest": "開啟一個邪惡寶箱",
    "Opens 1 Enchanted Chest": "開啟一個秘法寶箱",
    "Opens 1 Pirate Chest": "開啟一個海盜寶箱",


}



//----2.4.4 裝備(商店順序)
const tranItemEquipment = {
    R: "特",

    "Gobo Stabber": "哥布林長劍",
    "Gobo Slasher": "哥布林關刀",
    "Gobo Smasher": "哥布林狼牙棒",
    "Spiked Bulwark": "尖刺盾",
    "Werewolf Slasher": "狼人關刀",
    "Gobo Shooter": "哥布林彈弓",
    "Vampiric Bow": "吸血弓",
    "Gobo Boomstick": "哥布林火槍",

    "Cheese Bulwark": "乳酪重盾",
    "Verdant Bulwark": "翠綠重盾",
    "Azure Bulwark": "蔚藍重盾",
    "Burble Bulwark": "深紫重盾",
    "Crimson Bulwark": "絳紅重盾",
    "Rainbow Bulwark": "彩虹重盾",
    "Holy Bulwark": "神聖重盾",

    "Wooden Bow": "木弓",
    "Birch Bow": "樺木弓",
    "Cedar Bow": "雪松弓",
    "Purpleheart Bow": "紫心弓",
    "Ginkgo Bow": "銀杏弓",
    "Redwood Bow": "紅杉弓",
    "Arcane Bow": "神秘弓",

    "Regal Sword": "君王劍",
    "Chaotic Flail": "混沌連枷",
    "Sundering Crossbow": "裂空弩",
    "Cursed Bow": "咒怨弓",

    "Stalactite Spear": "石鐘長槍",
    "Granite Bludgeon": "花崗岩大棒",
    "Furious Spear": "狂怒長槍",
    "Soul Hunter Crossbow": "靈魂獵手弩",
    "Frost Staff": "冰霜法杖",
    "Infernal Battlestaff": "煉獄法杖",

    "Cheese Sword": "乳酪劍",
    "Verdant Sword": "翠綠劍",
    "Azure Sword": "蔚藍劍",
    "Burble Sword": "深紫劍",
    "Crimson Sword": "絳红劍",
    "Rainbow Sword": "彩虹劍",
    "Holy Sword": "神聖劍",

    "Cheese Spear": "乳酪長槍",
    "Verdant Spear": "翠綠長槍",
    "Azure Spear": "蔚藍長槍",
    "Burble Spear": "深紫長槍",
    "Crimson Spear": "絳红長槍",
    "Rainbow Spear": "彩虹長槍",
    "Holy Spear": "神聖長槍",

    "Cheese Mace": "乳酪釘頭錘",
    "Verdant Mace": "翠綠釘頭錘",
    "Azure Mace": "蔚藍釘頭錘",
    "Burble Mace": "深紫釘頭錘",
    "Crimson Mace": "絳红釘頭錘",
    "Rainbow Mace": "彩虹釘頭錘",
    "Holy Mace": "神聖釘頭錘",

    "Wooden Crossbow": "木弩",
    "Birch Crossbow": "樺木弩",
    "Cedar Crossbow": "雪松弩",
    "Purpleheart Crossbow": "紫心弩",
    "Ginkgo Crossbow": "銀杏弩",
    "Redwood Crossbow": "紅杉弩",
    "Arcane Crossbow": "神秘弩",

    "Wooden Water Staff": "木制水法杖",
    "Birch Water Staff": "樺木水法杖",
    "Cedar Water Staff": "雪松水法杖",
    "Purpleheart Water Staff": "紫心水法杖",
    "Ginkgo Water Staff": "銀杏水法杖",
    "Redwood Water Staff": "紅杉水法杖",
    "Arcane Water Staff": "神秘水法杖",

    "Wooden Nature Staff": "木制自然法杖",
    "Birch Nature Staff": "樺木自然法杖",
    "Cedar Nature Staff": "雪松自然法杖",
    "Purpleheart Nature Staff": "紫心自然法杖",
    "Ginkgo Nature Staff": "銀杏自然法杖",
    "Redwood Nature Staff": "紅杉自然法杖",
    "Arcane Nature Staff": "神秘自然法杖",

    "Wooden Fire Staff": "木火法杖",
    "Birch Fire Staff": "樺木火法杖",
    "Cedar Fire Staff": "雪松火法杖",
    "Purpleheart Fire Staff": "紫心火法杖",
    "Ginkgo Fire Staff": "銀杏火法杖",
    "Redwood Fire Staff": "紅杉火法杖",
    "Arcane Fire Staff": "神秘火法杖",
    "Jackalope Staff": "鹿角兔之杖",
    "Rippling Trident": "漣漪三叉戟",
    "Blooming Trident": "綻放三叉戟",
    "Blazing Trident": "熾焰三叉戟",

    "Eye Watch": "掌上監工",
    "Snake Fang Dirk": "蛇牙短劍",
    "Vision Shield": "視覺盾",
    "Gobo Defender": "哥布林防禦者",
    "Vampire Fang Dirk": "吸血鬼短劍",
    "Knights Aegis": "騎士盾",
    "Knight's Aegis": "騎士盾",
    "Manticore Shield": "蠍獅盾",
    "Treant Shield": "樹人盾",
    "Tome Of Healing": "治療之書",
    "Tome Of The Elements": "元素之書",
    "Bishops Codex": "主教之書",
    "Bishop's Codex": "主教之書",
    "Watchful Relic": "警戒遺物",

    "Cheese Buckler": "乳酪圓盾",
    "Verdant Buckler": "翠綠圓盾",
    "Azure Buckler": "蔚藍圓盾",
    "Burble Buckler": "深紫圓盾",
    "Crimson Buckler": "絳红圓盾",
    "Rainbow Buckler": "彩虹圓盾",
    "Holy Buckler": "神聖圓盾",

    "Wooden Shield": "木盾",
    "Birch Shield": "樺木盾",
    "Cedar Shield": "雪松盾",
    "Purpleheart Shield": "紫心木盾",
    "Ginkgo Shield": "銀杏盾",
    "Redwood Shield": "紅杉盾",
    "Arcane Shield": "神秘盾",

    "Red Chef's Hat": "紅色廚師帽",
    "Red Culinary Hat":"紅色廚師帽",
    "Snail Shell Helmet": "蝸牛殼頭盔",
    "Vision Helmet": "視覺頭盔",
    "Fluffy Red Hat": "蓬鬆紅帽子",
    "Corsair Helmet": "海盜頭盔",
    "Acrobatic Hood": "雜技師兜帽",
    "Magician's Hat": "魔術師之帽",

    "Cheese Helmet": "乳酪頭盔",
    "Verdant Helmet": "翠綠頭盔",
    "Azure Helmet": "蔚藍頭盔",
    "Burble Helmet": "深紫頭盔",
    "Crimson Helmet": "絳红頭盔",
    "Rainbow Helmet": "彩虹頭盔",
    "Holy Helmet": "神聖頭盔",

    "Rough Hood": "粗糙兜帽",
    "Reptile Hood": "爬行動物兜帽",
    "Gobo Hood": "哥布林兜帽",
    "Beast Hood": "野獸兜帽",
    "Umbral Hood": "暗影兜帽",

    "Cotton Hat": "棉帽",
    "Linen Hat": "亞麻帽",
    "Bamboo Hat": "竹帽",
    "Silk Hat": "絲帽",
    "Radiant Hat": "光輝帽",

    "Gator Vest": "鱷魚背心",

    "Marine Tunic": "海洋皮衣",
    "Revenant Tunic": "亡靈皮衣",
    "Griffin Tunic": "獅鷲皮衣",
    "Icy Robe Top": "冰霜袍服",
    "Flaming Robe Top": "烈焰袍服",
    "Luna Robe Top": "月神袍服",
    "Royal Water Robe Top": "皇家流水袍服",
    "Royal Fire Robe Top": "皇家火焰袍服",
    "Royal Nature Robe Top": "皇家自然袍服",
    "From Fire": "從【火焰】改",
    "From Water": "從【流水】改",
    "From Nature": "從【自然】改",

    "Cheese Plate Body": "乳酪胸甲",
    "Verdant Plate Body": "翠綠胸甲",
    "Azure Plate Body": "蔚藍胸甲",
    "Burble Plate Body": "深紫胸甲",
    "Crimson Plate Body": "絳红胸甲",
    "Rainbow Plate Body": "彩虹胸甲",
    "Holy Plate Body": "神聖胸甲",
    "Turtle Shell Body": "龜殼胸甲",
    "Colossus Plate Body": "巨像胸甲",
    "Demonic Plate Body": "惡魔胸甲",
    "Anchorbound Plate Body": "錨定胸甲",
    "Maelstrom Plate Body": "漩渦胸甲",

    "Rough Tunic": "粗糙皮衣",
    "Reptile Tunic": "爬行動物皮衣",
    "Gobo Tunic": "哥布林皮衣",
    "Beast Tunic": "野獸皮衣",
    "Umbral Tunic": "暗影皮衣",
    "Kraken Tunic": "克拉肯皮衣",

    "Cotton Robe Top": "棉布上衣",
    "Linen Robe Top": "亞麻上衣",
    "Bamboo Robe Top": "竹上衣",
    "Silk Robe Top": "絲綢上衣",
    "Radiant Robe Top": "光輝上衣",

    "Dairyhand's Top": "擠奶工的上衣",
    "Forager's Top": "採摘工的上衣",
    "Lumberjack's Top": "伐木工的上衣",
    "Cheesemaker's Top": "乳酪師的上衣",
    "Crafter's Top": "工匠的上衣",
    "Tailor's Top": "裁縫師的上衣",
    "Chef's Top": "廚師的上衣",
    "Brewer's Top": "釀造師的上衣",
    "Alchemist's Top": "煉金師的上衣",
    "Enhancer's Top": "強化師的上衣",

    "Turtle Shell Legs": "龜殼腿甲",
    "Colossus Plate Legs": "巨像腿甲",
    "Demonic Plate Legs": "惡魔腿甲",
    "Anchorbound Plate Legs": "錨定腿甲",
    "Maelstrom Plate Legs": "漩渦腿甲",

    "Icy Robe Bottoms": "冰霜袍裙",
    "Flaming Robe Bottoms": "烈焰袍裙",
    "Luna Robe Bottoms": "月神袍裙",
    "Royal Water Robe Bottoms": "皇家流水袍裙",
    "Royal Fire Robe Bottoms": "皇家火焰袍裙",
    "Royal Nature Robe Bottoms": "皇家自然袍裙",

    "Cheese Plate Legs": "乳酪腿甲",
    "Verdant Plate Legs": "翠綠腿甲",
    "Azure Plate Legs": "蔚藍腿甲",
    "Burble Plate Legs": "深紫腿甲",
    "Crimson Plate Legs": "絳红腿甲",
    "Rainbow Plate Legs": "彩虹腿甲",
    "Holy Plate Legs": "神聖腿甲",

    "Rough Chaps": "粗糙皮褲",
    "Reptile Chaps": "爬行動物皮褲",
    "Gobo Chaps": "哥布林皮褲",
    "Beast Chaps": "野獸皮褲",
    "Umbral Chaps": "暗影皮褲",
    "Marine Chaps": "航海皮褲",
    "Revenant Chaps": "亡靈皮褲",
    "Griffin Chaps": "獅鷲皮褲",
    "Kraken Chaps": "克拉肯皮褲",

    "Cotton Robe Bottoms": "棉下衣",
    "Linen Robe Bottoms": "亞麻下衣",
    "Bamboo Robe Bottoms": "竹布下衣",
    "Silk Robe Bottoms": "絲綢下衣",
    "Radiant Robe Bottoms": "光輝下衣",

    "Dairyhand's Bottoms": "擠奶工的下衣",
    "Forager's Bottoms": "採摘工的下衣",
    "Lumberjack's Bottoms": "伐木工的下衣",
    "Cheesemaker's Bottoms": "乳酪師的下衣",
    "Crafter's Bottoms": "工匠的下衣",
    "Tailor's Bottoms": "裁縫師的下衣",
    "Chef's Bottoms": "廚師的下衣",
    "Brewer's Bottoms": "釀造師的下衣",
    "Alchemist's Bottoms": "煉金師的下衣",
    "Enhancer's Bottoms": "強化師的下衣",

    "Dairyhand's Bottom": "擠奶工的下衣",
    "Forager's Bottom": "採摘工的下衣",
    "Lumberjack's Bottom": "伐木工的下衣",
    "Cheesemaker's Bottom": "乳酪師的下衣",
    "Crafter's Bottom": "工匠的下衣",
    "Tailor's Bottom": "裁縫師的下衣",
    "Chef's Bottom": "廚師的下衣",
    "Brewer's Bottom": "釀造師的下衣",
    "Alchemist's Bottom": "煉金師的下衣",
    "Enhancer's Bottom": "強化師的下衣",


    "Enchanted Gloves": "附魔手套",
    "Pincer Gloves": "螯鉗手套",
    "Panda Gloves": "熊貓手套",
    "Magnetic Gloves": "磁力手套",
    "Sighted Bracers": "瞄準護腕",
    "Marksman Bracers": "神射護腕",
    "Chrono Gloves": "時空手套",
    "Dodocamel Gauntlets": "渡駝護手",

    "Cheese Gauntlets": "乳酪護手",
    "Verdant Gauntlets": "翠綠護手",
    "Azure Gauntlets": "蔚藍護手",
    "Burble Gauntlets": "深紫護手",
    "Crimson Gauntlets": "絳红護手",
    "Rainbow Gauntlets": "彩虹護手",
    "Holy Gauntlets": "神聖護手",

    "Rough Bracers": "粗糙護腕",
    "Reptile Bracers": "爬行動物護腕",
    "Gobo Bracers": "哥布林護腕",
    "Beast Bracers": "野獸護腕",
    "Umbral Bracers": "暗影護腕",

    "Cotton Gloves": "棉手套",
    "Linen Gloves": "亞麻手套",
    "Bamboo Gloves": "竹手套",
    "Silk Gloves": "絲手套",
    "Radiant Gloves": "光輝手套",

    "Collectors Boots": "收藏家靴",
    "Collector's Boots": "收藏家靴",
    "Shoebill Shoes": "大嘴鸛鞋",
    "Black Bear Shoes": "黑熊鞋",
    "Grizzly Bear Shoes": "灰熊鞋",
    "Polar Bear Shoes": "北極熊鞋",
    "Centaur Boots": "半人馬靴",
    "Sorcerer Boots": "巫師靴",

    "Cheese Boots": "乳酪靴",
    "Verdant Boots": "翠綠靴",
    "Azure Boots": "蔚藍靴",
    "Burble Boots": "深紫靴",
    "Crimson Boots": "絳红靴",
    "Rainbow Boots": "彩虹靴",
    "Holy Boots": "神聖靴",

    "Rough Boots": "粗糙靴",
    "Reptile Boots": "爬行動物靴",
    "Gobo Boots": "哥布林靴",
    "Beast Boots": "野獸靴",
    "Umbral Boots": "暗影靴",

    "Cotton Boots": "棉靴",
    "Linen Boots": "亞麻靴",
    "Bamboo Boots": "竹靴",
    "Silk Boots": "絲靴",
    "Radiant Boots": "光輝靴",


    "Small Pouch": "小袋子",
    "Medium Pouch": "中袋子",
    "Large Pouch": "大袋子",
    "Giant Pouch": "巨大袋子",
    "Gluttonous Pouch": "貪吃袋",
    "Guzzling Pouch": "暴飲袋",

    "Chimerical Quiver": "奇幻箭袋",
    "Enchanted Cloak": "秘法披風",
    "Sinister Cape": "邪惡斗篷",

    "Basic Task Badge": "基礎任務徽章",
    "Advanced Task Badge": "高級任務徽章",
    "Advanced Task Ring": "高級任務徽章",
    "Expert Task Badge": "專家任務徽章",

    "Dodocamel Gauntlets (R)": "渡駝護手 (特)",
    "Marksman Bracers (R)": "神射護腕 (特)",
    "Griffin Chaps (R)": "獅鷲皮褲 (特)",
    "Kraken Chaps (R)": "克拉肯皮褲 (特)",
    "Anchorbound Plate Legs (R)": "錨定腿甲 (特)",
    "Maelstrom Plate Legs (R)": "漩渦腿甲 (特)",
    "Kraken Tunic (R)": "克拉肯皮衣 (特)",
    "Anchorbound Plate Body (R)": "錨定胸甲 (特)",
    "Maelstrom Plate Body (R)": "漩渦胸甲 (特)",
    "Royal Water Robe Top (R)": "皇家流水袍服 (特)",
    "Royal Fire Robe Top (R)": "皇家火焰袍服 (特)",
    "Royal Nature Robe Top (R)": "皇家自然袍服 (特)",
    "Royal Water Robe Bottoms (R)": "皇家流水袍裙 (特)",
    "Royal Fire Robe Bottoms (R)": "皇家火焰袍裙 (特)",
    "Royal Nature Robe Bottoms (R)": "皇家自然袍裙 (特)",
    "Corsair Helmet (R)": "海盜頭盔 (特)",
    "Acrobatic Hood (R)": "雜技師兜帽 (特)",
    "Magician's Hat (R)": "魔術師之帽 (特)",
    "Knight's Aegis (R)": "騎士盾 (特)",
    "Rippling Trident (R)": "漣漪三叉戟 (特)",
    "Blooming Trident (R)": "綻放三叉戟 (特)",
    "Blazing Trident (R)": "熾焰三叉戟 (特)",
    "Regal Sword (R)": "君王劍 (特)",
    "Chaotic Flail (R)": "混沌連枷 (特)",
    "Furious Spear (R)": "狂怒長槍 (特)",
    "Sundering Crossbow (R)": "裂空弩 (特)",
    "Cursed Bow (R)": "咒怨弓 (特)",
    "Bishop's Codex (R)": "主教之書 (特) ",
    "Griffin Bulwark (R)": "獅鷲盾 (特)",

    "Chimerical Quiver (R)": "奇幻箭袋 (特)",
    "Enchanted Cloak (R)": "秘法披風 (特)",
    "Sinister Cape (R)": "邪惡斗篷 (特)",

    "Dodocamel Gauntlets (R": "渡駝護手 (特",
    "Marksman Bracers (R": "神射護腕 (特",
    "Griffin Chaps (R)": "獅鷲皮褲 (特)",
    "Kraken Chaps (R)": "克拉肯皮褲 (特)",
    "Anchorbound Plate Legs (R)": "錨定腿甲 (特)",
    "Maelstrom Plate Legs (R)": "漩渦腿甲 (特)",
    "Kraken Tunic (R)": "克拉肯皮衣 (特)",
    "Anchorbound Plate Body (R)": "錨定胸甲 (特)",
    "Maelstrom Plate Body (R)": "漩渦胸甲 (特)",
    "Royal Water Robe Top (R)": "皇家流水袍服 (特)",
    "Royal Fire Robe Top (R)": "皇家火焰袍服 (特)",
    "Royal Nature Robe Top (R)": "皇家自然袍服 (特)",
    "Royal Water Robe Bottoms (R)": "皇家流水袍裙 (特)",
    "Royal Fire Robe Bottoms (R)": "皇家火焰袍裙 (特)",
    "Royal Nature Robe Bottoms (R)": "皇家自然袍裙 (特)",
    "Corsair Helmet (R)": "海盜頭盔 (特)",
    "Acrobatic Hood (R)": "雜技師兜帽 (特)",
    "Magician's Hat (R)": "魔術師之帽 (特)",
    "Knight's Aegis (R)": "騎士盾 (特)",
    "Rippling Trident (R)": "漣漪三叉戟 (特)",
    "Blooming Trident (R)": "綻放三叉戟 (特)",
    "Blazing Trident (R)": "熾焰三叉戟 (特)",
    "Regal Sword (R)": "君王劍 (特)",
    "Chaotic Flail (R)": "混沌連枷 (特)",
    "Furious Spear (R)": "狂怒長槍 (特)",
    "Sundering Crossbow (R)": "裂空弩 (特)",
    "Cursed Bow (R)": "咒怨弓 (特)",
    "Bishop's Codex (R)": "主教之書 (特) ",
    "Griffin Bulwark (R)": "獅鷲盾 (特)",

    "Chimerical Quiver (R)": "奇幻箭袋 (特)",
    "Enchanted Cloak (R)": "秘法披風 (特)",
    "Sinister Cape (R)": "邪惡斗篷 (特)",

    // 隊列用,所以少右括號
    "Dodocamel Gauntlets (R": "渡駝護手 (特",
    "Marksman Bracers (R": "神射護腕 (特",
    "Griffin Chaps (R": "獅鷲皮褲 (特",
    "Kraken Chaps (R": "克拉肯皮褲 (特",
    "Anchorbound Plate Legs (R": "錨定腿甲 (特",
    "Maelstrom Plate Legs (R": "漩渦腿甲 (特",
    "Kraken Tunic (R": "克拉肯皮衣 (特",
    "Anchorbound Plate Body (R": "錨定胸甲 (特",
    "Maelstrom Plate Body (R": "漩渦胸甲 (特",
    "Royal Water Robe Top (R": "皇家流水袍服 (特",
    "Royal Fire Robe Top (R": "皇家火焰袍服 (特",
    "Royal Nature Robe Top (R": "皇家自然袍服 (特",
    "Royal Water Robe Bottoms (R": "皇家流水袍裙 (特",
    "Royal Fire Robe Bottoms (R": "皇家火焰袍裙 (特",
    "Royal Nature Robe Bottoms (R": "皇家自然袍裙 (特",
    "Corsair Helmet (R": "海盜頭盔 (特",
    "Acrobatic Hood (R": "雜技師兜帽 (特",
    "Magician's Hat (R": "魔術師之帽 (特",
    "Knight's Aegis (R": "騎士盾 (特",
    "Rippling Trident (R": "漣漪三叉戟 (特",
    "Blooming Trident (R": "綻放三叉戟 (特",
    "Blazing Trident (R": "熾焰三叉戟 (特",
    "Regal Sword (R": "君王劍 (特",
    "Chaotic Flail (R": "混沌連枷 (特",
    "Furious Spear (R": "狂怒長槍 (特",
    "Sundering Crossbow (R": "裂空弩 (特",
    "Cursed Bow (R": "咒怨弓 (特",
    "Bishop's Codex (R": "主教之書 (特",
    "Griffin Bulwark (R": "獅鷲盾 (特",

    "Chimerical Quiver (R": "奇幻箭袋 (特",
    "Enchanted Cloak (R": "秘法披風 (特",
    "Sinister Cape (R": "邪惡斗篷 (特",


};

//----2.4.5 飾品(商店順序)

const tranAccessories = {

    "Necklace Of Efficiency": "效率項鍊",
    "Fighter Necklace": "戰士項鍊",
    "Ranger Necklace": "遊俠項鍊",
    "Wizard Necklace": "巫師項鍊",
    "Necklace Of Wisdom": "經驗項鍊",
    "Necklace Of Speed": "速度項鍊",
    "Philosopher's Necklace": "賢者項鍊",

    "Earrings Of Gathering": "採集耳環",
    "Earrings Of Essence Find": "精華發現耳環",
    "Earrings Of Armor": "護甲耳環",
    "Earrings Of Regeneration": "恢復耳環",
    "Earrings Of Resistance": "抗性耳環",
    "Earrings Of Rare Find": "稀有發現耳環",
    "Earrings Of Threat": "威脅耳環",
    "Earrings Of Critical Strike": "暴擊耳環",
    "Philosopher's Earrings": "賢者耳環",

    "Ring Of Gathering": "採集戒指",
    "Ring Of Essence Find":"精華發現戒指",
    "Ring Of Regeneration": "恢復戒指",
    "Ring Of Armor": "護甲戒指",
    "Ring Of Resistance": "抗性戒指",
    "Ring Of Rare Find": "稀有發現戒指",
    "Ring Of Threat": "威脅戒指",
    "Ring Of Critical Strike": "暴擊戒指",
    "Philosopher's Ring": "賢者戒指",

    "Trainee Milking Charm": "實習擠奶護符",
    "Basic Milking Charm": "基礎擠奶護符",
    "Advanced Milking Charm": "高級擠奶護符",
    "Expert Milking Charm": "專家擠奶護符",
    "Master Milking Charm": "大師擠奶護符",
    "Grandmaster Milking Charm": "宗師擠奶護符",

    "Trainee Foraging Charm": "實習採摘護符",
    "Basic Foraging Charm": "基礎採摘護符",
    "Advanced Foraging Charm": "高級採摘護符",
    "Expert Foraging Charm": "專家採摘護符",
    "Master Foraging Charm": "大師採摘護符",
    "Grandmaster Foraging Charm": "宗師採摘護符",

    "Trainee Woodcutting Charm": "實習伐木護符",
    "Basic Woodcutting Charm": "基礎伐木護符",
    "Advanced Woodcutting Charm": "高級伐木護符",
    "Expert Woodcutting Charm": "專家伐木護符",
    "Master Woodcutting Charm": "大師伐木護符",
    "Grandmaster Woodcutting Charm": "宗師伐木護符",

    "Trainee Cheesesmithing Charm": "實習製作護符",
    "Basic Cheesesmithing Charm": "基礎製作護符",
    "Advanced Cheesesmithing Charm": "高級製作護符",
    "Expert Cheesesmithing Charm": "專家製作護符",
    "Master Cheesesmithing Charm": "大師製作護符",
    "Grandmaster Cheesesmithing Charm": "宗師製作護符",

    "Trainee Tailoring Charm": "實習裁縫護符",
    "Basic Tailoring Charm": "基礎裁縫護符",
    "Advanced Tailoring Charm": "高級裁縫護符",
    "Expert Tailoring Charm": "專家裁縫護符",
    "Master Tailoring Charm": "大師裁縫護符",
    "Grandmaster Tailoring Charm": "宗師裁縫護符",

    "Trainee Cooking Charm": "實習烹飪護符",
    "Basic Cooking Charm": "基礎烹飪護符",
    "Advanced Cooking Charm": "高級烹飪護符",
    "Expert Cooking Charm": "專家烹飪護符",
    "Master Cooking Charm": "大師烹飪護符",
    "Grandmaster Cooking Charm": "宗師烹飪護符",

    "Trainee Brewing Charm": "實習沖泡護符",
    "Basic Brewing Charm": "基礎沖泡護符",
    "Advanced Brewing Charm": "高級沖泡護符",
    "Expert Brewing Charm": "專家沖泡護符",
    "Master Brewing Charm": "大師沖泡護符",
    "Grandmaster Brewing Charm": "宗師沖泡護符",

    "Trainee Alchemy Charm": "實習煉金護符",
    "Basic Alchemy Charm": "基礎煉金護符",
    "Advanced Alchemy Charm": "高級煉金護符",
    "Expert Alchemy Charm": "專家煉金護符",
    "Master Alchemy Charm": "大師煉金護符",
    "Grandmaster Alchemy Charm": "宗師煉金護符",

    "Trainee Enhancing Charm": "實習強化護符",
    "Basic Enhancing Charm": "基礎強化護符",
    "Advanced Enhancing Charm": "高級強化護符",
    "Expert Enhancing Charm": "專家強化護符",
    "Master Enhancing Charm": "大師強化護符",
    "Grandmaster Enhancing Charm": "宗師強化護符",

    "Trainee Crafting Charm": "實習製作護符",
    "Basic Crafting Charm": "基礎製作護符",
    "Advanced Crafting Charm": "高級製作護符",
    "Expert Crafting Charm": "專家製作護符",
    "Master Crafting Charm": "大師製作護符",
    "Grandmaster Crafting Charm": "宗師製作護符",

    "Trainee Stamina Charm": "實習耐力護符",
    "Basic Stamina Charm": "基礎耐力護符",
    "Advanced Stamina Charm": "高級耐力護符",
    "Expert Stamina Charm": "專家耐力護符",
    "Master Stamina Charm": "大師耐力護符",
    "Grandmaster Stamina Charm": "宗師耐力護符",

    "Trainee Intelligence Charm": "實習智力護符",
    "Basic Intelligence Charm": "基礎智力護符",
    "Advanced Intelligence Charm": "高級智力護符",
    "Expert Intelligence Charm": "專家智力護符",
    "Master Intelligence Charm": "大師智力護符",
    "Grandmaster Intelligence Charm": "宗師智力護符",

    "Trainee Attack Charm": "實習攻擊護符",
    "Basic Attack Charm": "基礎攻擊護符",
    "Advanced Attack Charm": "高級攻擊護符",
    "Expert Attack Charm": "專家攻擊護符",
    "Master Attack Charm": "大師攻擊護符",
    "Grandmaster Attack Charm": "宗師攻擊護符",

    "Trainee Defense Charm": "實習防禦護符",
    "Basic Defense Charm": "基礎防禦護符",
    "Advanced Defense Charm": "高級防禦護符",
    "Expert Defense Charm": "專家防禦護符",
    "Master Defense Charm": "大師防禦護符",
    "Grandmaster Defense Charm": "宗師防禦護符",

    "Trainee Melee Charm": "實習近戰護符",
    "Basic Melee Charm": "基礎近戰護符",
    "Advanced Melee Charm": "高級近戰護符",
    "Expert Melee Charm": "專家近戰護符",
    "Master Melee Charm": "大師近戰護符",
    "Grandmaster Melee Charm": "宗師近戰護符",

    "Trainee Ranged Charm": "實習遠程護符",
    "Basic Ranged Charm": "基礎遠程護符",
    "Advanced Ranged Charm": "高級遠程護符",
    "Expert Ranged Charm": "專家遠程護符",
    "Master Ranged Charm": "大師遠程護符",
    "Grandmaster Ranged Charm": "宗師遠程護符",

    "Trainee Magic Charm": "實習魔法護符",
    "Basic Magic Charm": "基礎魔法護符",
    "Advanced Magic Charm": "高級魔法護符",
    "Expert Magic Charm": "專家魔法護符",
    "Master Magic Charm": "大師魔法護符",
    "Grandmaster Magic Charm": "宗師魔法護符"


}


//----2.4.6 工具(商店順序)
const tranItemTool = {
    "Celestial Brush": "星空刷子",
    "Cheese Brush": "乳酪刷子",
    "Verdant Brush": "翠綠刷子",
    "Azure Brush": "蔚藍刷子",
    "Burble Brush": "深紫刷子",
    "Crimson Brush": "絳红刷子",
    "Rainbow Brush": "彩虹刷子",
    "Holy Brush": "神聖刷子",

    "Celestial Shears": "星空剪刀",
    "Cheese Shears": "乳酪剪刀",
    "Verdant Shears": "翠綠剪刀",
    "Azure Shears": "蔚藍剪刀",
    "Burble Shears": "深紫剪刀",
    "Crimson Shears": "絳红剪刀",
    "Rainbow Shears": "彩虹剪刀",
    "Holy Shears": "神聖剪刀",

    "Celestial Hatchet": "星空斧頭",
    "Cheese Hatchet": "乳酪斧頭",
    "Verdant Hatchet": "翠綠斧頭",
    "Azure Hatchet": "蔚藍斧頭",
    "Burble Hatchet": "深紫斧頭",
    "Crimson Hatchet": "絳红斧頭",
    "Rainbow Hatchet": "彩虹斧頭",
    "Holy Hatchet": "神聖斧頭",

    "Celestial Hammer": "星空錘子",
    "Cheese Hammer": "乳酪錘",
    "Verdant Hammer": "翠綠錘",
    "Azure Hammer": "蔚藍錘",
    "Burble Hammer": "深紫錘",
    "Crimson Hammer": "絳红錘",
    "Rainbow Hammer": "彩虹錘",
    "Holy Hammer": "神聖錘",

    "Celestial Chisel": "星空鑿子",
    "Cheese Chisel": "乳酪鑿子",
    "Verdant Chisel": "翠綠鑿子",
    "Azure Chisel": "蔚藍鑿子",
    "Burble Chisel": "深紫鑿子",
    "Crimson Chisel": "絳红鑿子",
    "Rainbow Chisel": "彩虹鑿子",
    "Holy Chisel": "神聖鑿子",

    "Celestial Spatula": "星空鏟子",
    "Cheese Spatula": "乳酪鏟子",
    "Verdant Spatula": "翠綠鏟子",
    "Azure Spatula": "蔚藍鏟子",
    "Burble Spatula": "深紫鏟子",
    "Crimson Spatula": "絳红鏟子",
    "Rainbow Spatula": "彩虹鏟子",
    "Holy Spatula": "神聖鏟子",

    "Celestial Needle": "星空針",
    "Cheese Needle": "乳酪針",
    "Verdant Needle": "翠綠針",
    "Azure Needle": "蔚藍針",
    "Burble Needle": "深紫針",
    "Crimson Needle": "絳红針",
    "Rainbow Needle": "彩虹針",
    "Holy Needle": "神聖針",

    "Celestial Pot": "星空鍋",
    "Cheese Pot": "乳酪鍋",
    "Verdant Pot": "翠綠鍋",
    "Azure Pot": "蔚藍鍋",
    "Burble Pot": "深紫鍋",
    "Crimson Pot": "絳红鍋",
    "Rainbow Pot": "彩虹鍋",
    "Holy Pot": "神聖鍋",

    "Celestial Alembic": "星空蒸餾器",
    "Cheese Alembic": "乳酪蒸餾器",
    "Verdant Alembic": "翠綠蒸餾器",
    "Azure Alembic": "蔚藍蒸餾器",
    "Burble Alembic": "深紫蒸餾器",
    "Crimson Alembic": "絳红蒸餾器",
    "Rainbow Alembic": "彩虹蒸餾器",
    "Holy Alembic": "神聖蒸餾器",

    "Celestial Enhancer": "星空強化器",
    "Cheese Enhancer": "乳酪強化器",
    "Verdant Enhancer": "翠綠強化器",
    "Azure Enhancer": "蔚藍強化器",
    "Burble Enhancer": "深紫強化器",
    "Crimson Enhancer": "赤紅強化器",
    "Rainbow Enhancer": "彩虹強化器",
    "Holy Enhancer": "神聖強化器",

};



//2.5 寶箱
let tranItemBox = {
    "Purple's Gift": "牛紫的禮物",
    "Gifted by Purple after earning task points. Looks like it contains items inside": "用任务點兌換的獎勵，看起來裡面裝著物品",

    "Small Meteorite Cache": "隕石【小】",
    "Medium Meteorite Cache": "隕石【中】",
    "Large Meteorite Cache": "隕石【大】",
    "Can be found while gathering. Looks like it contains items inside": "採集時可以找到，看起來裡面裝著物品",

    "Small Artisan's Crate": "工匠的箱子【小】",
    "Medium Artisan's Crate": "工匠的箱子【中】",
    "Large Artisan's Crate": "工匠的箱子【大】",
    "Can be found during production skills. Looks like it contains items inside": "生產時可以找到，看起來裡面裝著物品",

    "Small Treasure Chest": "寶箱【小】",
    "Medium Treasure Chest": "寶箱【中】",
    "Large Treasure Chest": "寶箱【大】",
    "Can be found from monsters. Looks like it contains items inside": "從怪物身上找到，看起來裡面裝著物品",

    "Chimerical Chest": "奇幻寶箱",
    "Received from completion of the Chimerical Den dungeon. Can be opened with Chimerical Chest Key": "攻克地下城★【奇幻洞穴】的獎勵，使用【奇幻寶箱鑰匙】打開",
    "Sinister Chest": "邪惡寶箱",
    "Received from completion of the Sinister Circus dungeon. Can be opened with Sinister Chest Key": "攻克地下城★【邪惡馬戲團】的獎勵，使用【邪惡寶箱鑰匙】打開",
    "Enchanted Chest": "秘法寶箱",
    "Received from completion of the Enchanted Fortress dungeon. Can be opened with Enchanted Chest Key": "攻克地下城★【秘法要塞】的獎勵，使用【秘法寶箱鑰匙】打開",
    "Pirate Chest": "海盜寶箱",
    "Received from completion of the Pirate Cove dungeon. Can be opened with Pirate Chest Key": "攻克地下城★【海盜灣】的獎勵，使用【海盜寶箱鑰匙】打開",

    "Chimerical Refinement Chest": "奇幻精煉寶箱",
    "Received from completion of Chimerical Den dungeon (T1+). Can be opened with Chimerical Chest Key": "攻克地下城★【奇幻洞穴】（T1+）的獎勵，使用【奇幻寶箱鑰匙】打開",
    "Sinister Refinement Chest": "邪惡精煉寶箱",
    "Received from completion of Sinister Circus dungeon (T1+). Can be opened with Sinister Chest Key": "攻克地下城★【邪惡馬戲團】（T1+）的獎勵，使用【邪惡寶箱鑰匙】打開",
    "Enchanted Refinement Chest": "秘法精煉寶箱",
    "Received from completion of Enchanted Fortress dungeon (T1+). Can be opened with Enchanted Chest Key": "攻克地下城★【秘法要塞】（T1+）的獎勵，使用【秘法寶箱鑰匙】打開",
    "Pirate Refinement Chest": "海盜精煉寶箱",
    "Received from completion of Pirate Cove dungeon (T1+). Can be opened with Pirate Chest Key": "攻克地下城★【海盜灣】（T1+）的獎勵，使用【海盜寶箱鑰匙】打開",

};

//2.6 怪物
let tranMonster = {
    //----------------* 批量模擬
    Rat:"傑瑞",
    Frog: "青蛙",
    Snake: "蛇",
    Alligator: "鱷魚",
    "Sea Snail": "蝸牛",
    Crab: "螃蟹",
    Turtle: "烏龜",
    "Gobo Stabby": "哥布林斥候",
    "Gobo Slashy": "哥布林戰士",
    "Gobo Smashy": "哥布林鬥士",
    "Gobo Shooty": "哥布林射手",
    "Gobo Boomy": "哥布林法師",

    //----------------* 臭臭星球
    "Smelly Planet": "臭臭星球",
    Fly: "蒼蠅",
    Jerry: "傑瑞",
    Skunk: "臭鼬",
    Porcupine: "豪豬",
    Slimy: "史萊姆",
    "T5 Jerry": "傑瑞 (T5)",

    //----------------* 沼澤星球
    "Swamp Planet": "沼澤星球",
    Frogger: "青蛙",
    Thnake: "蛇",
    Swampy: "蜘蛛",
    Sherlock: "鱷魚",
    Shoebill: "大嘴鸛",
    "Giant Shoebill": "大嘴鸛",

    //----------------* 海洋星球
    "Aqua Planet": "海洋星球",
    Gary: "蝸牛",
    "I Pinch": "螃蟹",
    Aquahorse: "海馬",
    "Nom Nom": "鯽魚",
    Turuto: "烏龜",
    "Marine Huntress": "海洋獵手",

    //----------------* 叢林星球
    "Jungle Planet": "叢林星球",
    "Jungle Sprite": "叢林精靈",
    Myconid: "蘑菇人",
    Treant: "樹人",
    "Centaur Archer": "半人馬弓箭手",
    "Luna Empress": "月神之蝶",

    //----------------* 哥布林星球
    "Gobo Planet": "哥布林星球",
    Stabby: "哥布林穿刺手",
    Slashy: "哥布林戰士",
    Smashy: "哥布林大錘手",
    Shooty: "哥布林弓箭手",
    Boomy: "哥布林法師",
    "Gobo Chieftain": "哥布林酋長",

    //----------------* 眼球星球
    "Planet Of The Eyes": "眼球星球",
    Eye: "獨眼",
    Eyes: "豎眼",
    Veyes: "複眼",
    "The Watcher": "觀察者",

    //----------------* 巫師之塔
    "Sorcerer's Tower": "巫師之塔",
    "Sorcerers Tower": "巫師之塔",
    "Novice Sorcerer": "新手巫師",
    "Ice Sorcerer": "冰霜巫師",
    "Flame Sorcerer": "火焰巫師",
    Elementalist: "元素法師",
    "Chronofrost Sorcerer": "時空霜巫",

    //----------------* 熊熊星球
    "Bear With It": "熊熊星球",
    "Gummy Bear": "果凍熊",
    Panda: "熊貓",
    "Black Bear": "黑熊",
    "Grizzly Bear": "灰熊",
    "Polar Bear": "北極熊",
    "Red Panda": "小熊貓",

    //----------------* 魔像洞穴
    "Golem Cave": "魔像洞穴",
    "Magnetic Golem": "磁力魔像",
    "Stalactite Golem": "鐘乳石魔像",
    "Granite Golem": "花崗岩魔像",
    "Crystal Colossus": "水晶巨像",

    //----------------* 暮光之地
    "Twilight Zone": "暮光之地",
    Zombie: "僵屍",
    Vampire: "吸血鬼",
    Werewolf: "狼人",
    "Dusk Revenant": "黃昏亡靈",

    //----------------* 地獄深淵
    "Infernal Abyss": "地獄深淵",
    "Abyssal Imp": "深淵小鬼",
    "Soul Hunter": "靈魂獵手",
    "Infernal Warlock": "地獄術士",
    "Demonic Overlord": "惡魔霸主",

    //----------------* 奇幻洞穴
    "Chimerical Den": "奇幻洞穴",
    "Received from completion of the Chimerical Den dungeon": "通關奇幻洞穴的戰利品",
    "Butterjerry": "蝶鼠",
    "Jackalope": "鹿角兔",
    "Dodocamel": "渡駝",
    "Manticore": "蠍獅",
    "Griffin": "獅鷲",

    //----------------* 邪惡馬戲團
    "Sinister Circus": "邪惡馬戲團",
    "Received from completion of the Sinister Circus dungeon": "通關邪惡馬戲團的戰利品",
    "Rabid Rabbit": "瘋魔兔",
    "Zombie Bear": "僵屍熊",
    "Acrobat": "雜技師",
    "Juggler": "雜耍者",
    "Magician": "魔術師",
    "Deranged Jester": "小丑皇",

    //----------------* 秘法要塞
    "Enchanted Fortress": "秘法要塞",
    "Received from completion of the Enchanted Fortress dungeon": "通關秘法要塞的戰利品",
    "Enchanted Pawn": "秘法之兵",
    "Enchanted Knight": "秘法之馬",
    "Enchanted Bishop": "秘法之相",
    "Enchanted Rook": "秘法之車",
    "Enchanted Queen": "秘法之后",
    "Enchanted King": "秘法之王",

    //----------------* 海盜灣
    "Pirate Cove": "海盜灣",
    "Squawker": "鸚鵡",
    "Anchor Shark": "錨鯊水手",
    "Brine Marksman": "海洋觀測士",
    "Tidal Conjuror": "潮汐大副",
    "Captain fishhook": "虎喵船长",
    "The Kraken": "克拉肯",

};

//2.7 狀態類
const tranState = {

    HP: "HP",
    MP: "MP",
    "HP Restore": "HP恢復",
    "HP over 30s": "【30秒內恢復】",
    "MP Restore": "MP恢復",
    "MP over 30s": "【30秒內恢復】",
    "Foraging Level": "採摘等級",
    "Buffs foraging level": "增益採摘等級",
    "Woodcutting Level": "伐木等級",
    "Buffs woodcutting level": "增益伐木等級",
    "Cooking Level": "烹飪等級",
    "Buffs cooking level": "增益烹飪等級",
    "Brewing Level": "沖泡等級",
    "Buffs brewing level": "增益沖泡等級",
    "Enhancing Level": "強化等級",
    "Buffs enhancing level": "增益強化等級",
    "Alchemy Level": "煉金等級",
    "Buffs Alchemy level": "增益煉金等級",
    "Cheesesmithing Level": "乳酪鍛造等級",
    "Buffs cheesesmithing level": "增益乳酪鍛造等級",
    "Crafting Level": "製作等級",
    "Buffs crafting level": "增益製作等級",
    "Tailoring Level": "裁縫等級",
    "Buffs tailoring level": "增益裁縫等級",

    Gathering: "採集類",
    Gourmet: "美食",
    "Chance to produce an additional item for free": "有機會額外獲得一個免費物品",
    Processing: "加工",
    "Chance to instantly convert gathered resource into processed material": "有機會立即將採集的資源轉化為加工材料",
    "cheese, fabric, and lumber": "乳酪、織物和木材",
    Artisan: "工匠",
    "Reduces required materials during production": "減少生產過程中所需材料",
    "Alchemy Success": "煉金成功",
    "Multiplicative bonus to success rate while alchemizing": "在煉金時對成功率的乘法加成",
    "Action Level": "行動等級",
    "Increases required levels for the action": "增加行動所需等級",
    Blessed: "祝福",
    "Chance to gain +2 instead of +1 on enhancing success": "有機會在強化成功時獲得+2而不是+1",
    "Stamina Level": "耐力等級",
    "Buffs stamina level": "增加耐力等級",
    "Increases HP regeneration": "增加HP恢復速度",
    "Intelligence Level": "智力等級",
    "Buffs intelligence level": "增加智力等級",
    "Increases MP regeneration": "增加MP恢復速度",
    "Defense Level": "防禦等級",
    "Buffs defense level": "增加防禦等級",
    "Attack Level": "攻擊等級",
    "Buffs attack level": "增加攻擊等級",
    "melee Level": "近戰等級",
    "Buffs melee level": "增加近戰等級",
    "Ranged Level": "遠程等級",
    "Buffs ranged level": "增加遠程等級",
    "Magic Level": "魔法等級",
    "Buffs magic level": "增加魔法等級",
    "Combat Drop Rate": "戰鬥掉落率",
    "Increases drop rate of combat loot": "增加戰鬥戰利品的掉落率",
    "Attack Speed": "攻擊速度",
    "Increases auto attack speed": "增加自動攻擊速度",
    "Cast Speed": "施法速度",
    "Increases ability casting speed": "增加技能施法速度",

    "Critical Rate": "暴擊率",
    "Increases critical rate": "增加暴擊率",
    "Critical Damage": "暴擊傷害",
    "Increases critical damage": "增加暴擊傷害",
    "Ability Book": "技能書",
    Effect: "效果",
    "Ability Exp Per Book": "每本書的技能經驗",

    "Primary Training": "主修訓練",
    "Focus Training": "專注訓練",
    "Defense Experience": "防禦經驗",
    "Magic Experience": "魔法經驗",
    "Melee Experience": "近戰經驗",
    "Ranged Experience": "遠程經驗",
    "Stamina Experience": "耐力經驗",
    "Intelligence Experience": "智力經驗",
    "Attack Experience": "攻擊經驗",
    "Ability Damage": "技能傷害",
    "Defensive Smash Damage": "防禦鈍擊傷害",

    "Stab Accuracy": "刺擊精準",
    "Stab Damage": "刺擊傷害",
    "Slash Accuracy": "斬擊精準",
    "Slash Damage": "斬擊傷害",
    "Smash Accuracy": "鈍擊精準",
    "Smash Damage": "鈍擊傷害",
    "Magic Accuracy": "魔法精準",
    "Ranged Accuracy": "遠程精準",
    "Nature Penetration": "自然屬性穿透",
    "Fire Penetration": "火屬性穿透",
    "Water Penetration": "水屬性穿透",
    "Water Amplify": "水屬性強化",
    "Fire Amplify": "火屬性強化",
    "Nature Amplify": "自然屬性強化",
    "Healing Amplify": "治療強化",
    "Milking Efficiency": "擠奶效率",
    "Foraging Efficiency": "採摘效率",
    "Woodcutting Efficiency": "伐木效率",
    "Cheesesmithing Efficiency": "乳酪鍛造效率",
    "Crafting Efficiency": "製作效率",
    "Tailoring Efficiency": "裁縫效率",
    "Cooking Efficiency": "烹飪效率",
    "Brewing Efficiency": "沖泡效率",
    "Skilling Efficiency": "專業效率",
    "Skilling Speed": "專業速度",
    "Armor Penetration": "護甲穿透",
    Global: "全域",

    "View Cowbell Store": "查看牛鈴商店",
    "Dropped By Monsters": "怪物掉落",
    "Almost all monsters drop coins": "幾乎所有的怪物都會掉落金幣",
    "Dropped By Elite Monsters": "精英怪物掉落",
    "Looted From Container": "獲取自箱子",
    "Food Slots": "食物槽位",
    "Drink Slots": "飲料槽位",
    "Food Haste": "食物急速",
    "Drink Concentration": "飲料濃度",
    Loots: "戰利品",
    "Open To Loot": "戰利品",
    "Rare Drop From": "稀有掉落自",
    "Any low level gathering actions": "任何低級採集類行動",
    "Any medium level gathering actions": "任何中級採集類行動",
    "Any high level gathering actions": "任何高級採集類行動",
    "Any low level production, alchemy, and enhancing actions": "任何低級生產、煉金及強化類行動",
    "Any medium level production, alchemy, and enhancing actions": "任何中級生產、煉金及強化類行動",
    "Any high level production, alchemy, and enhancing actions": "任何高級生產、煉金及強化類行動",
    "Any low level monster in normal combat": "普通戰鬥中的任意低級怪物",
    "Any medium level monsters in normal combat": "普通戰鬥中的任意中級怪物",
    "Any high level monsters in normal combat": "普通戰鬥中的任意高級怪物",

    // 物品的說明
    "Any Milking action": "任何擠奶動作",
    "Any Foraging action": "任何采摘動作",
    "Any Woodcutting action": "任何伐木動作",
    "Any Cheesesmithing action": "任何乳酪鍛造動作",
    "Any Crafting action": "任何製作動作",
    "Any tailoring action": "任何裁縫動作",
    "Any cooking action": "任何烹飪動作",
    "Any brewing action": "任何沖泡動作",
    "Any Alchemy action": "任何煉金動作",
    "Any enhancing action": "任何強化動作",
    "Used For Cooking": "用於烹飪",
    "Used For Brewing": "用於沖泡",
    "Used For Crafting": "用於製作",
    "Gathered From": "獲取自採集",
    "Produced From": "產自",
    "Produced From Cheesesmithing": "產自乳酪鍛造",
    "Produced From Crafting": "產自製作",
    "Produced From Tailoring": "產自裁縫",
    "Produced From Cooking": "產自烹飪",
    "Produced From Brewing": "產自沖泡",
    "Produced From Alchemy": "產自煉金",
    "Produced From Enhancing": "產自強化",
    "Used For Cheesesmithing": "用於乳酪鍛造",
    "Used For Tailoring": "用於裁縫",
    "Transmuted From(Alchemy": "轉化自（煉金  ",
    "Decomposed From(Alchemy": "分解自（煉金  ",
    "Decomposes Into(Alchemy": "分解（煉金  ",
    "Transmutes Into(Alchemy": "轉化（煉金  ",
    Drops: "掉落",

};

//2.8 mo9通行證
let tranMoopass = {

    "MooPass": "Moo卡",
    "MooPass Perks": "Moo卡福利",
    "Character MooPass": "角色Moo卡",
    "Account MooPass": "帳號Moo卡",
    "Continue to Purchase": "繼續購買",
    "limited to Standard character": "限標準角色",
    "Hour Offline Progress Limit": "小時離線進度上限",
    "Market Listing Limit": "市場掛單上限",
    "Action Queue Limit": "行動隊列上限",
    "Task Slot Limit": "任務槽位上限",
    "Free Task Reroll": "免費任務重置",
    "Loot Tracker of last 20 activities": "最後 20 個行動的掉落記錄",
    "Golden Avatar Border": "金色角色邊框",
    "All Characters": "所有角色",
    "DAY MooPas": "天Moo卡",
    "Year MooPass": "年Moo卡",
    "MooPass grants a number of helpful but non-essential": "Moo卡提供多種實用但不影響主要體驗的",
    "Perks": "福利",
    "Activate the Free 14-Day MooPass? This is a one time gift. If MooPass is already active, it will be extended by 14 days": "激活14天免費Moo卡? 這是一次性贈送。如果Moo卡已經激活，將延長14天。",
    "Day MooPass Gift": "Moo卡贈送",
    "Buy MooPass": "購買Moo卡",
    "Grants": "獲得",
    Granted: "獲得",
    "Purchase completed": "完成購買",
    "days of MooPass": "天Moo卡",
    "per task": "每個任務",


};

//2.9 成就
let tranAchievements = {
    Achievements: "成就",
    "Achievement Buffs": "成就 Buff",
    "Goals spanning many areas of the game. Completing all in a tier grants a permanent buff": "涵蓋游戲多個領域的目標。完成某一層級的所有目標可獲得永久 Buff",
    "Collection": "收藏",
    "Tracks all items obtained outside of Marketplace and General Shop": "記錄所有從交易市場和普通商店外獲取的物品",
    "Tracks all monsters defeated. Higher tier monsters grant 1 extra credit per tier. Party combat gives fractional credit based on party size":
        "記錄所有擊敗的怪物。更高層級的怪物每層額外獲得 1 點積分。組隊戰鬥將根據隊伍人數分配部分積分",
    "Each item/monster earns points based on how many you've collected/defeated (1→+1pt, 10→+2pt, 100→+3pt, etc":
        "每件物品 / 每隻怪物根據收集 / 擊敗數量獲得積分（1 →+1 分，10 →+2 分，100 →+3 分，以此類推",

    "Track your collection log, bestiary, and achievements": "追蹤你的收藏紀錄，怪物圖鑑和成就",
    "Show Incomplete Only": "僅顯示未完成",
    "Got Milk": "初次擠奶",
    "Gather 1 Milk from a cow": "從擠奶採集1個牛奶",
    "Fletcher": "弓箭匠",
    "Make a Wooden Bow with Crafting": "用製作技能製作木弓",
    "Sweet Tooth": "甜食愛好者",
    "Make an Apple Gummy with Cooking": "用烹飪技能製作蘋果軟糖",
    "Graduate": "畢業生",
    "Complete the tutorial with Purple": "完成教程",
    "Jerry Slayer": "傑瑞殺手",
    "Beginner Adventurer": "初級冒險家",
    "Get a total level of": "總等級達到",

    "Novice": "新手",
    "Feeling Blue": "藍寶石匠人",
    "Cheesesmith any azure tool": "用乳酪鍛造製作任意蔚藍工具",
    "Bag Maker": "袋子製作者",
    "Tailor a Medium Pouch": "用裁縫製作中型袋子",
    "Tea Enthusiast": "茶藝愛好者",
    "Brew a Gourmet Tea": "沖泡美食茶",
    "Enhancer I": "強化 I",
    "Successfully enhance any equipment to": "成功將任意裝備強化到",
    "Awakened": "覺醒者",
    "Learn a combat ability": "學習戰鬥技能",
    "Shoebill Slayer": "鯨頭鸛殺手",
    "Marine Hunter": "海洋獵手",
    "Collector I": "收藏家 I",
    "Obtain 100 Collection points": "獲得100點收藏積分",
    "Hunter I": "獵人 I",
    "Obtain 20 Bestiary points": "獲得20點圖鑑積分",
    "Task Taker": "任務達人",
    "Obtain 10 task tokens": "獲取10任務積分",
    "Novice Adventurer": "新手冒險家",

    Adept: "熟手",
    "Jeweler": "珠寶匠",
    "Craft any jewelry": "製作任意首飾",
    "Dairy Chef": "乳製品廚師",
    "Make a Peach Yogurt with Cooking": "用烹飪製作桃子酸奶",
    "Break It Down": "分解大師",
    "Decompose Bamboo Gloves successfully": "成功分解竹手套",
    "Enhancer II": "強化 II",
    "Ginkgo Warrior": "銀杏戰士",
    "Equip any Ginkgo weapon": "裝備任意銀杏武器",
    "staff, bow, or crossbow": "法杖、弓或弩",
    "Lunar Vanquisher": "月神征服者",
    "Gobo Subjugator": "哥布林征服者",
    "Watcher's Bane": "觀察者剋星",
    "Charmed": "護符加持",
    "Buy a trainee charm from shop": "從商店購買實習護符",
    "Collector II": "收藏家 II",
    "Obtain 200 Collection points": "獲得200點收藏積分",
    "Hunter II": "獵人 II",
    "Obtain 40 Bestiary points": "獲得40點圖鑑積分",
    "Homeowner I": "房主 I",
    "Build a level 1 room in your house": "在房子中建造1級房間",
    "Adept Adventurer": "熟練冒險家",
    "Get total level of": "總等級達到",

    Veteran: "老手",
    "Arcane Logger": "奧密伐木工",
    "Woodcut an arcane tree": "砍伐奧密樹",
    "Shadow Tailor": "暗影裁縫",
    "Tailor an Umbral Tunic": "縫紉暗影皮衣",
    "Pastry Chef": "甜點師",
    "Make a Spaceberry Cake with cooking": "用烹飪製作太空莓蛋糕",
    "Midas Touch": "點石成金",
    "Earn a total of 1m coins from coinify": "通過煉金賺取總共100萬金幣",
    "Enhancer III": "強化 III",
    "Ability Master": "技能大師",
    "Learn a special ability": "學習特殊技能",
    "Ultimate Jerry Slayer": "終極傑瑞殺手",
    "Chronofrost Slayer": "霜時殺手",
    "Panda Tamer": "小熊貓馴服者",
    "Collector III": "收藏家 III",
    "Obtain 500 Collection points": "獲得500點收藏積分",
    "Hunter III": "獵人 III",
    "Obtain 100 Bestiary points": "獲得100點圖鑑積分",
    "Homeowner II": "房主 II",
    "Build a level 3 room in your house": "在房子中建造3級房間",
    "Veteran Adventurer": "老練冒險家",

    // 精英
    "Pass The Butter": "匠心之油",
    "Collect a Butter of Proficiency from Milking or Cheesesmithing": "從擠奶或乳酪鍛造獲得黃油",
    "Branch Manager": "樹枝管理員",
    "Collect a Branch of Insight from Woodcutting or Crafting": "從伐木或製作獲得樹枝",
    "No Loose Threads": "絲絲入扣",
    "Collect a Thread of Expertise from Foraging or Tailoring": "從採摘或裁縫獲得線團",
    "Ultra Brewer": "究極沖泡師",
    "Brew an Ultra Magic Coffee": "沖泡究極魔法咖啡",
    "Enhancer IV": "強化 IV",
    "Successfully enhance equipment with 80+ recommended level to": "成功將推薦等級80+的裝備強化到",
    "Dungeon Forger": "地下城鍛造師",
    "Make any dungeon equipment from its components": "用組件製作任意地下城裝備",
    "Crystal Breaker": "水晶破壞者",
    "Revenant Hunter": "亡靈獵手",
    "Chimerical Hunter": "奇幻獵手",
    "Clear the Chimerical Den dungeon": "通關地下城【奇幻洞穴】",
    "Ringmaster": "馬戲團團長",
    "Clear the Sinister Circus dungeon": "通關地下城【邪惡馬戲團】",
    "Collector IV": "收藏家 IV",
    "Obtain 1000 Collection points": "獲得1000點收藏積分",
    "Hunter IV": "獵人 IV",
    "Obtain 200 Bestiary points": "獲得200點圖鑑積分",
    "Task Master": "任務大師",
    "Equip an expert task badge": "裝備專家任務徽章",
    "Homeowner III": "房主 III",
    "Build a level 6 room in your house": "在房子中建造6級房間",
    "Elite Adventurer": "精英冒險家",

    // Champion
    Champion : "冠軍",
    "Celestial Artisan": "星空工匠",
    "Make any Celestial Tool or Level 90 Skilling Outfit Top or Bottoms": "製作任意星空工具或90級技能服裝上衣或下裝",
    "Snack Pack Pro": "零食包專家",
    "Tailor a Gluttonous or Guzzling Pouch": "縫紉暴食或豪飲袋子",
    "Master Charmer": "大師護符匠",
    "Craft any Master charm": "製作任意大師護符",
    "Philosopher": "賢者",
    "Gain a Philosopher's Stone from transmuting": "通過轉化獲得賢者之石",
    "Dungeon Refiner": "地下城精煉師",
    "Refine any dungeon equipment": "精煉任意地下城裝備",
    "Enhancer V": "強化 V",
    "Successfully enhance equipment with 90+ recommended level to": "成功將推薦等級90+的裝備強化到",
    "Overlord's Doom": "霸主之末日",
    "Golem Breaker": "石像破壞者",
    "Fortress Conqueror": "要塞徵服者",
    "Clear the Enchanted Fortress dungeon": "通關地下城【秘法要塞】",
    "Pirate's Bane": "海盜剋星",
    "Clear the Pirate Cove dungeon": "通關地下城【海盜灣】",
    "Dungeon Elitist": "地下城精英",
    "Clear any T1 or higher dungeon 10 times": "通關任意T1或更高的地下城10次",
    "Collector V": "收藏家 V",
    "Obtain 2000 Collection points": "獲得2000點收藏積分",
    "Hunter V": "獵人 V",
    "Obtain 400 Bestiary points": "獲得400點圖鑑積分",
    "Homeowner IV": "房主 IV",
    "Build a level 8 room in your house": "在房子中建造8級房間",
    "Champion Adventurer": "冠軍冒險家",

    "Collections": "收藏",
    "Show Uncollected Items": "顯示未收集物品",
    "Milestone": "里程碑",
    "Collection Points": "收藏積分",
    "Collected": "已收集",
    "Points Earned": "已獲得積分",
    "": "",
    "": "",
    "": "",

    "Bestiary": "怪物圖鑑",
    "No monsters defeated yet. Go into combat to start building your bestiary": "尚未擊敗任何怪物。進入戰鬥開始建立你的圖鑑",
    "Monsters Defeated": "已擊敗怪物",
    "Show Undefeated Monsters": "顯示未擊敗怪物",
    "Bestiary Points": "圖鑑積分",
    "Defeated": "已擊敗",

};




//3.0 其他
let tranOther = {

    Mention: "提及@",
    Profile: "個人資料",
    Block: "屏蔽",
    report: "舉報",
    "Confirm Block": "確認屏蔽",
    "Blocked character": "已屏蔽",
    "View at Social -> Block List": "查看【社交】->【黑名單】",
    "Unblocked character": "取消屏蔽",
    "Unblock": "取消屏蔽",


    //------------- 頻道
    General: "常規",
    Trade: "交易",
    Recruit: "招募",
    Beginner: "新手",
    party: "隊伍",
    Whisper: "私聊",
    Send: "發送",
    "Game Rules": "遊戲規則",
    "You need at least 200 total level or 1,000,000 XP to use general chat": "你需要至少200總等級或1,000,000經驗值才能使用常規聊天",
    "General channel is for game-related discussions and friendly chats. To maintain a positive and respectful atmosphere, please adhere to the":
        "常規頻道用於遊戲相關討論和友好聊天。為了保持積極和尊重的氛圍，請遵守",
    "Trade channel is for advertising item trading and services. Please use whispers for conversations and negotiations":
        "交易頻道用於廣告物品交易和服務。對話和談判時請使用私聊",
    "Recruit channel is for advertising guild/party recruitment and players seeking to join a guild/party. Please use whispers for conversations":
        "招募頻道用於宣傳公會/隊伍招募和尋找加入公會/隊伍的玩家。請使用私聊進行對話",
    "Feel free to ask questions or chat with other players here. Useful links": "請隨意在此處提問或與其他玩家聊天。有用的連接",
    'You can whisper other players using the command "/w [playerName] [message]" or simply click on a player\'s name and select whisper':
        '你可以使用命令 "/w [玩家名稱] [消息]" 來私聊其他玩家，或者直接點擊玩家名稱並選擇私聊',
    "Are you sure you want to open an external link": "您確定要開啟外部連結嗎",
    "This party does not match your game mode": "您的遊戲模式不適合這個隊伍",
    "This party is no longer recruiting": "隊伍已滿，不再接受新成員。",

    //------------- 設置
    //------------------/ 個人資料
    Game: "遊戲",
    Account: "帳戶",
    Preview: "預覽",
    "View My Profile": "查看我的個人資料",
    "Chat Icon": "聊天圖標",
    "None Owned": "未擁有",
    Unlock: "解鎖",
    "Name Color": "名稱顏色",
    "Online Status": "線上狀態",
    Public: "公開",
    Show: "顯示",
    "Game Mode": "遊戲模式",
    "Offline Progress": "離線進度",
    actions: "操作",
    Repeat: "重複",
    "Task Slots": "任務槽",
    "Party Members Only": "僅限隊友",
    "Delete Character": "刪除角色",
    "Show Deletion Instructions": "刪除說明",


    //------------------/ 遊戲
    "Display Language": "顯示語言",
    "General Chat": "國際頻道",
    "Non-English Language Chat": "非英語語言頻道",
    "Ironcow Chat": "鐵牛頻道",
    "Trade Chat": "交易頻道",
    "Recruit Chat": "招募頻道",
    "Beginner Chat": "新手頻道",
    "Total Level Message": "總等級消息",
    "Skill Level Message": "專業等級消息",
    "Community Buff Message": "社區增益消息",
    "Chat URL Warning": "聊天網址警告",
    "Profanity Filter": "髒話篩檢器",
    "CSS Animation": "CSS動畫",


    //------------------/ 帳戶
    "Account Type": "帳戶類型",
    "Registered User": "註冊用戶",
    "Current Password": "當前密碼",
    Email: "郵箱",
    "New Password": "新密碼",
    "Confirm Password": "確認密碼",
    Hide: "隱藏",
    Private: "私密",


    //------------- 社交
    Friends: "好友",
    Referrals: "推薦",
    "Block List": "黑名單",
    "Add Friend": "添加好友",
    "Friends/Guildmates": "好友/公會成員",
    Activity: "活動",
    Online: "線上",
    Offline: "離線",
    "When someone signs up using your referral link, you'll be eligible for the following rewards": "當有人使用你的推薦連結註冊時，你將有資格獲得以下獎勵",
    "if they reach Total Level": "如果他們總等級達到",
    Additional: "再加",
    "if they reach Total Level": "如果他們總等級達到",
    "of any Cowbells they purchase": "他們購買的任何牛鈴",
    "Copy Link": "複製連結",
    "Link Copied":"連結已複製",
    "So far": "到目前為止，已經有",
    "players have signed up using your referral link": "位玩家使用你的推薦連結註冊",
    "A referred player reached Total Level": "推薦的玩家總等級達到",
    "A referred player made a purchase": "推薦的玩家完成了一筆消費",
    "Block Player": "屏蔽玩家",
    "Blocked Players": "被屏蔽的玩家",
    "A new player joined with your referral link. Thanks for sharing": "一位新玩家透過您的推薦連結加入了，感謝分享",

    //-------------- 公會
    "You can create a guild for 5M coins. A guild currently provides the following features":
    "您可以通過投資5M金幣創建自己的公會。公會目前提供以下功能",
    "Guild chat channel and notice board":
    "公會聊天頻道和公告欄",
    "Guild will receive XP and level up as members gain XP in any skill at a ratio of":
    "當成員在任意專業中獲得 XP 時，公會將獲得 XP 並升級,經驗獲得依比例為",
    "member slots and 1 additional slot for every 3 guild levels":
    "個成員槽，並且增加一個槽位於每提升3個公會等級",
    "Roles can be assigned":
    "可分配的職務分別是",
    "Leader, General, Officer, Member":
    "會長,將軍, 官員,成員",
    "You can also be invited to existing guilds. Use the Recruit chat channel to find a guild to join. Received invitations will be displayed below":
    "您也可以被邀請加入到現有的公會。在招募聊天頻道尋找要加入的公會。收到的邀請將顯示在下方",
    "Create Guild": "創建公會",

    //-------------- 商店(含牛鈴)
    Dungeon:"地下城",
    "Dungeons": "地下城",
    "Supporter Points": "支持者點數",
    "Fame Points": "名望點數",
    "Buy Cowbells": "購買牛鈴",
    "Upgrade purchased": "購買升級",
    "Minimum Quantity": "最小數量",
    "Click continue to proceed to our payment processor in a new window": "點擊繼續 ▶ 跳轉至支付平台視窗",
    Convenience: "便利性升級",
    "Chat Icons": "聊天圖標",
    "Avatars": "頭像",
    Avatar: "頭像",
    "Avatar Outfit": "頭像服裝",
    Unlocked: "已解鎖",
    Seasonal: "季節限定",
    "Click any of the colors to see a preview with your name. Unlocked colors can be changed in Settings -> Profile": "點擊任意顏色以查看帶有你名字的預覽。解鎖的顏色可以在設置 -> 個人資料中更改",
    "Buy Avatar": "購買頭像",
    "Buy Avatar Outfit": "購買頭像服裝",
    "Click any of the avatars to see a larger preview. Unlocked avatars can be changed in Settings -> Profile": "點擊任意頭像以查看更大尺寸的預覽。已解鎖的頭像可以在設置 -> 個人資料中更改",
    "Click any of the outfits to see a preview with your avatar. Unlocked outfits can be changed in Settings -> Profile": "點擊任意頭像服裝以查看與你頭像所搭配的預覽效果。已解鎖的服裝可以在設置 -> 個人資料中更改",
    "Community buffs are bonuses granted to all players on the server. For every Cowbell spent on community buffs, you will gain 1 fame point. Fame points are ranked on the leaderboard": "社區增益是提供給服務器上所有玩家的福利。每花費一個牛鈴用於社區增益，你就能獲得 1 點聲望值。聲望值會按照高低在排行榜上進行排名",
    "Unlock More Avatars": "解鎖更多頭像",
    "Unlock More Outfits": "解鎖更多服裝",
    "Name Colors": "名稱顏色",
    "Community Buffs": "社區加成",
    "Name Change": "更改名稱",
    "Cowbells can be purchased to help support the game. You can use them to buy convenience upgrades, chat icons, name colors, avatars, avatar outfits, community buffs, or change your name":
        "你可以購買牛鈴來支持這款遊戲。此外牛鈴還能購買便利性升級、聊天圖標、名稱顏色、頭像、頭像服裝、社區加成，或者更改你的名字。",
    NOTE: "注意",
    "Purchased Cowbells will appear in your inventory as Bags of 10 Cowbells which can be sold on the market (18% coin tax) to other players. Once opened, they are no longer tradable":
        "購買的牛鈴將以10個牛鈴的袋子出現在你的庫存中，可以在市場上（帶有18%金幣稅）賣給其他玩家。一旦打開，就無法再進行交易",
    "A new tab will be opened to process the purchase": "將打開一個新標籤頁進行購買",
    Continue: "繼續",
    "Buy Convenience Upgrade": "購買便利性升級",
    "Quantity (Limit": "數量（限制",
    "You don't have enough cowbells": "你沒有足夠的牛鈴",
    "After Purchase": "購買後",
    "Hours Offline Progress": "小時數離線進度",
    "Unlocked chat icon": "解鎖聊天圖標",
    "Buy Chat Icon": "購買聊天圖標",
    "Buy Name Color": "購買名稱顏色",
    "Buy Community Buff": "購買社區增益",
    "Minutes to Add": "要添加的分鐘數",
    "Minutes To Add For Next Level": "升級所需分鐘數",
    "Select Currency": "選擇貨幣",
    USD: "美元",
    EUR: "歐元",
    "Upgrades permanently increases limits. Your current limits can be viewed in Settings": "升級永久增加上限。你當前的上限可以在設置中查看",
    "Increase offline progress limit": "增加離線進度上限",
    "Hour Offline Progress": "每小時離線進度",
    "Buy limit": "購買限制",
    "Increase loadout slot limit": "增加配裝槽上限",
    "Action Queue": "動作佇列",
    "Increase action queue limit": "增加動作佇列上限",
    "Market Listing": "市場掛單",
    "Increase market listing limit": "增加市場掛單上限",
    "Task Slot": "任務槽",
    "Increase task slot limit": "增加任務槽上限",
    "Loadout Slot": "配裝槽",
    "Limit": "上限",
    "Loadout Slots": "配裝槽",

    //----------------------/ 聊天圖標
    "Chat icons are displayed in front of your name in the chat. Unlocked chat icons can be changed in Settings -> Profile":
        "聊天圖標顯示在聊天中你的名稱前面。已解鎖的聊天圖標可以在設置 -> 個人資料中更改",
    "Supporter": "支持者",
    "Verdant Supporter": "翠綠支持者",
    "Azure Supporter": "蔚藍支持者",
    "Burble Supporter": "深紫支持者",
    "Crimson Supporter": "絳红支持者",
    "Rainbow Supporter": "彩虹支持者",
    "Holy Supporter": "神聖支持者",
    "Jack-o'-lantern":"傑克燈籠",
    "Spring Festival Lantern":"春節燈籠",
    Clover: "四葉草",
    "Task Crystal": "任務水晶",
    Sword: "劍",
    Spear: "槍",
    Mace: "釘頭錘",
    Bulwark: "重盾",
    Book: "書籍",
    keys: "鑰匙",
    "Mage's Hat": "法師帽",
    "Panda Paw": "熊貓爪",
    "Santa Hat":"聖誕帽",
    "Iron Cow": "鐵牛",
    Duckling: "小鴨",
    Whale: "鯨魚",
    Bamboo: "竹子",
    "Golden Coin": "金幣",
    "Golden Egg": "金蛋",
    "Golden Berry": "黃金漿果",
    "Golden Apple": "黃金蘋果",
    "Golden Donut": "黃金甜甜圈",
    "Golden Cupcake": "黃金紙杯蛋糕",
    "Golden Clover": "黃金四葉草",
    "Golden Marketplace": "黃金市場",
    "Golden Biceps": "黃金二頭肌",
    "Golden Frog": "黃金青蛙",
    "Golden Piggy": "黃金小豬",
    "Golden Duckling": "黃金小鴨",
    "Golden Whale": "黃金鯨魚",
    "Custom Chat Icon": "定製聊天圖標",
    "You can request a custom chat icon for the cost of 100K Supporter Points and 20,000 Cowbells. The icon can be requested via #new-ticket on Discord. The icon will be based on a concept or image you provide and will be designed by our artist to fit the style and color theme of the game. It must not contain copyrighted content":
        "你可以花費 100k 支持者點數和 20,000 牛鈴來申請一個自定義聊天圖標。可以通過在 Discord 的 #new-ticket 來提交申請。該圖標將依據你提供的概念或圖片來製作，並且會由我們的美工人員按照游戲的風格和色彩主題進行設計。但是圖標不得包含受版權保護的內容",
    "K Supporter Points": "K 支持者點數",

    //----------------------/ 名稱顏色
    Burble: "泡泡",
    Blue: "藍色",
    Green: "綠色",
    Yellow: "黃色",
    Coral: "珊瑚",
    Pink: "粉色",
    "Fancy Burble": "華麗泡泡",
    "Fancy Blue": "華麗藍色",
    "Fancy Green": "華麗綠色",
    "Fancy Yellow": "華麗黃色",
    "Fancy Coral": "華麗珊瑚",
    "Fancy Pink": "華麗粉色",
    Iron: "鐵色",
    Rainbow: "彩虹色",
    Golden: "金色",
    "Custom Name Color": "定製名稱顏色",
    "You can request a custom name color for the cost of 75,000 Supporter Points and 15,000 Cowbells. The color can be requested via #new-ticket on Discord. The name color can consist of a color gradient and optionally a subtle glow effect":
        "你可以花費 75,000 支持者積分和 15,000 牛鈴來申請自定義名稱顏色。可以通過在 Discord 的 #new-ticket 來提交顏色申請。該顏色可以是漸變色，並且可選擇添加輕微的發光效果",
    "Custom Avatar": "定製頭像",
    "You can request a custom avatar for the cost of 250K Supporter Points and 50,000 Cowbells. The avatar can be requested via #new-ticket on Discord. The avatar will be based on a concept or image you provide and will be designed by our artist to fit the style and color theme of the game. It must not contain copyrighted content":
        "你可以花費 100k 支持者點數和 50,000 牛鈴來申請一個自定義頭像。可以通過在 Discord 的 #new-ticket 來提交頭像申請。該頭像將基於你提供的概念或圖片來製作，並且會由我們的美工人員按照游戲的風格和色彩主題進行設計。但是頭像不得包含受版權保護的內容",
    "Custom Avatar Outfit": "定製頭像服裝",
    "You can request a custom avatar outfit for the cost of 150K Supporter Points and 30,000 Cowbells. The outfit can be requested via #new-ticket on Discord. The outfit will be based on a concept or image you provide and will be designed by our artist to fit the style and color theme of the game. It must not contain copyrighted content":
        "你可以花費 150k 支持者積分和 30,000 牛鈴來申請一套自定義的頭像服裝。可以通過在 Discord 的 #new-ticket 來提交服裝申請。這套服飾將依據你提供的概念或圖片來設計，並且會由我們的美工人員按照游戲的風格和色彩主題進行創作。但是服裝不得包含受版權保護的內容",
    "Fame Leaderboard": "名望排行榜",
    "Opt In": "選擇加入",
    "Opt Out": "選擇退出",

    Experience: "經驗",
    Minute: "分鐘",
    "Gathering Quantity": "採集數量",
    "Production Efficiency": "生產效率",
    "Enhancing Speed": "強化速度",
    "Combat Drop Quantity": "戰鬥掉落數量",
    "Current Name": "當前名稱",
    "New Name": "新名稱",
    "Check Availability": "檢查可用性",
    Cost: "費用",
    "Change Name": "更改名稱",
    Moderator: "管理員",
    Moderators: "管理員",
    "Idle User": "閒置成員",
    Chat: "聊天",
    Inspect: "檢查",
    Mutes: "禁言",
    Bans: "封禁",
    Role: "角色",
    "Chat Min Level": "聊天最低等級",
    "General Chat Min Level": "普通聊天最低等級",
    "General Chat Min Exp": "普通聊天最低經驗",
    Update: "更新",
    "Character Name": "角色名稱",
    "Mute Duration": "禁言時長",
    minute: "分鐘",
    minutes: "分鐘",
    hour: "小時",
    hours: "小時",
    day: "天",
    days: "天",
    year: "年",
    years: "年",
    "Mute Reason": "禁言原因",
    Mute: "禁言",
    "Expire Time": "過期時間",
    Reason: "原因",
    Unmute: "解除禁言",
    "Ban Duration": "封禁時長",
    "Ban Reason": "封禁原因",
    Ban: "封禁",
    Unban: "解封",
    "Purchased Cowbells will appear in your inventory as Bags of 10 Cowbells which can be sold on the market": "購買的牛鈴將以每袋10個牛鈴的形式出現在你的庫存中, 可以在市場上(帶有",
    "coin tax) to other players. Once opened, they are no longer tradable": "的金幣稅)賣給其他玩家。一旦打開，它們將無法再進行交易",
    Name: "名稱",
    Standard: "標準",
    Ironcow: "鐵牛",
    "Legacy Ironcow": "傳統鐵牛",
    "Updates every 20 minutes": "每20分鐘更新一次",
    Rank: "排名",
    Enabled: "已啟用",
    On: "開",
    Remove: "移除",
    Overview: "概覽",
    Members: "成員",
    Manage: "管理",
    "Guild Level": "公會等級",
    "Guild Experience": "公會經驗",
    "Guild Members": "公會成員",
    "Guild Invitation": "邀請公會",
    "Exp to Level Up": "升級所需經驗",
    "You can disband if there are no other members or open invites": "如果沒有其他成員或公開邀請，您才能解散公會",
    "Disband Guild": "解散公會",
    "Invited by": "受邀自",
    Decline: "拒絕",
    Edit: "編輯",
    "Invite to Guild": "邀請加入公會",
    "Guild joined": "已加入公會",
    "Guild Exp": "公會經驗",
    Leader: "會長",
    Officer: "官員",
    Hidden: "隱藏",
    Member: "成員",
    "You can leave the guild. There are no penalties for leaving": "你可以隨意退出公會,而不會受到任何懲罰",
    "Leave Guild": "離開公會",
    "Battle Info": "戰鬥資訊",
    Stats: "統計資料",
    "Combat Duration": "戰鬥時長",
    Deaths: "死亡次數",
    "Items looted": "掠奪的物品",
    "Drop Quantity": "掉落數量",
    Skill: "專業",
    Unfriend: "解除好友關係",
    "Confirm Unfriend": "確認解除好友關係",
    Promote: "晉升",
    Demote: "降級",
    Kick: "踢出",
    "Cancel Invite": "取消邀請",
    "Available At Price": "在這個價格可用",


    //-------------- 指引
    //----------------------/ 常見問題
    "FAQ": "常見問題",
    "How does offline progress work": "離線也能玩嗎",
    "Your character continues to make progress even when you're offline. A new player gets up to 10 hours of offline progress anytime you close the browser or go offline. You can extend this time with convenience upgrades available in the Cowbell Store":
        "即使您離線，您的角色也會繼續取得進展。預設情況下，每次關閉流覽器或離線時，您可以獲得最多10小時的離線進度。然而，您可以在牛鈴商店購買便捷升級來延長這一時間",
    "Can I log in from another device": "我可以從其他設備登錄嗎",
    "If you have registered an account, you can log in from any device using your email and password. If you are playing as a guest, you can find your guest password in Settings and use it to log in with your username":
        "如果您已註冊帳戶，您可以使用您的電子郵件和密碼從任何設備登錄。如果您以遊客身份玩遊戲，您可以在設置中找到您的遊客密碼並使用它與您的用戶名一起登錄",

    "Can I play the game without an internet connection or as a single player": "我可以在沒有互聯網連接或單人模式下玩遊戲嗎",
    "No, you must be connected to the internet to play the game. However, you do continue to make progress while offline for up to 10 hours by default. If you prefer to not interact with other players, you can collapse the chat and choose not to use the marketplace":"不，您必須連接互聯網才能玩遊戲。然而，預設情況下，即使離線，您也會繼續取得進展，最多可達10小時。如果您不想與其他玩家互動，您可以折疊聊天視窗並選擇不使用市場",

    "Can I change my username":"我可以更改用戶名嗎",
    "Yes, you can change your username by going to the Cowbell Store and clicking on the \"Name Change\" tab. It costs 500 cowbells to change your username":"是的，您可以通過前往牛鈴商店並點擊\"更改名稱\"標籤來更改您的用戶名。更改用戶名需要花費500個牛鈴",

    "How can I get a chat icon or different name color":"我怎樣才能獲得聊天圖標或不同的名字顏色",
    "You can purchase a chat icon or name color from the Cowbell Store using cowbells. You can change your displayed icon and color in Settings":"您可以使用牛鈴在牛鈴商店購買聊天圖標或名字顏色。您可以在設置中更改顯示的圖標和顏色",

    "How do I send a private message to another player":"我如何向其他玩家發送私信",
    "To send a private message to another player, click on their name next to their chat message and click \"Whisper\". You can also use the chat command \"/w player_name chat_message":"要向另一位玩家發送私信，請點擊他們的聊天消息旁邊的名字，然後點擊\"私聊\"。您也可以使用聊天命令\"/w 玩家名 聊天消息",
    "You can also use the chat command":"您也可以使用聊天命令",
    "What is the action queue":"什麼是動作佇列",
    "The action queue is a feature that allows you to set up a sequence of actions for your character to perform. To use it, click the \"Add Queue\" button instead of \"Start\". Queue slots can be unlocked or upgraded from the Cowbell Store":"動作佇列是一項功能，允許您設置一連串的動作供您的角色執行。要使用它，請點擊'添加佇列'按鈕而不是'開始'。佇列槽可以在牛鈴商店解鎖或升級",
    "How do I block another player":"我如何屏蔽其他玩家",
    "To block a player and stop seeing their chat messages, click on their name next to their message and click \"Block\". You can also use the chat command \"/block player_name\". You can find your block list in the Settings menu and unblock players from the list":
        "若要封鎖玩家並停止查看其聊天訊息，請點擊其訊息旁邊的玩家姓名，然後點擊「封鎖」。您也可以使用聊天指令「/block player_name」。您可以在「社交」選單中找到您的\"黑名單\"，並從清單中解除封鎖玩家",

    Gameplay:"遊戲玩法",

    "What are cowbells and how can I get more":"什麼是牛鈴？我怎樣才能獲得",
    "Cowbells are the premium currency of the game. They allow players to purchase convenience upgrades, cosmetics, community buffs that benefit the whole server, and name changes. There are three ways to get Cowbells":"牛鈴是遊戲的高級貨幣。它們允許玩家購買便利升級、裝飾品、惠及整個伺服器的社區增益和更改名稱。有三種方式可以獲得牛鈴",
    "Finish the tutorial":"完成教程",
    "You will receive 80 cowbells as a reward":"您將獲得80個牛鈴作為獎勵",
    "Rare drops":"稀有掉落",
    "You have a chance to get cowbells from rare loot boxes found while skilling or battling enemies in combat":"在使用專業或戰鬥中擊敗敵人時，您有機會從戰利品箱中獲得牛鈴",
    "Purchase from Cowbell Store":"在牛鈴商店購買",
    "You can purchase cowbells with real money from the Cowbell Store to help support the game":"您可以用現金在牛鈴商店購買牛鈴以支援遊戲",
    "Buy from the marketplace":"在市場上購買",
    "You can buy tradable \"Bag of 10 Cowbells\" with coins from other players in the Marketplace":"您可以用遊戲內的貨幣從其他玩家那裡購買可交易的“10個牛鈴袋”",

    "What are rare drops":"什麼是稀有掉落",
    "Rare drops are loot boxes that can be obtained while engaging in different activities in the game":"稀有掉落是指在遊戲中進行不同活動時可以獲得的戰利品箱",
    "Gathering skills":"採集專業",
    "You get meteorite caches which contain star fragments":"您可以獲得包含星光碎片的隕石",
    "Production skills, alchemy, and enhancing":"生產專業，煉金和強化",
    "You get artisan's crates which contain shards of protection and gems":"您可以獲得包含保護碎片和寶石的工匠箱",
    Combat:"戰鬥",
    "You get treasure chests which contain gems":"您可以獲得包含寶石的寶箱",
    "All boxes also contain coins and occasionally cowbells. You get larger boxes when doing higher level skills or from higher level enemies":"所有箱子還包含金幣，有時也包含牛鈴.進行高級專業或擊敗高級敵人時，您會獲得更大的箱子",

    "What are gems used for":"寶石有什麼用",
    "Gems can be used to craft different jewelry that gives small bonuses. Additionally, you can crush gems into smaller pieces with the Crafting skill and use them to brew stronger versions of coffee and tea. Gems can be obtained from treasure chests in combat":"寶石可以用來製作不同的珠寶，提供小額加成。此外，您可以使用製作專業將寶石粉碎成小塊，用它們來釀造更強版本的咖啡和茶。寶石可以從戰鬥中的寶箱中獲得",

    "Where do I get tea leaves":"我在哪裡可以獲得茶葉",
    "You can get tea leaves from defeating enemies in combat. When viewing combat zones, you can hover over an enemy (long press on mobile) to see what items it drops. Tea leaves are an essential ingredient for brewing tea, which can buff non-combat skills":"您可以通過在戰鬥中擊敗敵人獲得茶葉。在查看戰鬥區域時，您可以將滑鼠懸停在敵人上（移動設備上長按）查看它掉落的物品。茶葉是沖泡茶的重要成分，可以增強非戰鬥的專業",

    "What are essences":"什麼是精華",
    "Essences are used to enhance special equipment with the Enhancing skill. Enemies from each combat zone drop a different type of essence":"精華用於通過強化專業來強化特殊裝備。每個戰鬥區域的敵人都會掉落不同類型的精華",


    //---------------------/ 採集類
    "Milking magical cows yields different types of milk, which can be used in a various ways":
        "擠奶可以得到不同類型的牛奶，每種奶都有多種用途。",
    "Milk can be turned into cheese, which can then be used to craft melee equipment or skilling tools":
        "牛奶可以製成乳酪，然後用於製作近戰裝備或生產工具。",
    "Milk is an essential ingredient for many recipes":
        "牛奶是許多蛋糕或者優格的必不可少的原料。",
    "Milk is used in a small number of coffee and tea recipes":
        "牛奶在少數咖啡和茶的配方中使用。",
    "You can help magical cows produce milk faster by equipping a brush":
        "您可以通過裝備刷子來幫助牛更快地產奶。",

    "Foraging allows you to gather different resources from various areas. You can forage for a specific item in an area or forage the entire area to get a bit of everything":
        "採摘允許您從各個地區收集不同的資源。您可以在特定區域採集特定物品。",
    "Foraged resources can be used in":
        "採摘的資源可以用於",
    "Eggs, wheat, sugar, berries, and fruits are essential ingredients for many recipes":
        "雞蛋、小麥、糖、漿果和水果是許多食譜的必不可少的成分。",
    "Berries, fruits, and coffee beans are used to brew coffee and tea":
        "漿果、水果和咖啡豆用於沖泡咖啡和茶。",
    "Flax, bamboo branches, cocoons, and other materials can be processed into fabric to make magical clothing":
        "亞麻、竹子、繭等材料可以加工成面料，用於裁縫。",
    "You can increase foraging speed by equipping shears":
        "您可以通過裝備剪刀來增加採摘速度。",

    "You can chop logs from different kinds of trees":
        "您可以從不同種類的樹木上砍伐木材。",
    "Logs can be used in":
        "木材可以用於",
    "Logs are part of the recipe for making a number of melee weapons and skilling tools":
        "木材是製作許多近戰武器和專業工具的配方的一部分。",
    "Logs can be processed into lumber to craft ranged and magic weapons":
        "木材可以加工成木材，用於製作弓弩和法杖。",
    "You can increase woodcutting speed by equipping a hatchet":
        "您可以通過裝備斧頭來增加砍伐速度。",

    "Level Bonus":"等級碾壓加成",
    "You gain 1% efficiency bonus for each level you have above the action's level requirement":
        "您每超過操作等級要求一級，就會獲得1%的效率加成。",


    //---------------------/ 生產類
    "Production":"生產類",
    "Cheesesmithing is the process of creating melee equipment and skilling tools":
        "經由奶酪鍛造可以製作近戰裝備和專業的工具",
    "Milk is processed into different tiers of cheese. The cheese is then used (sometimes in combination with other resources) to craft equipment. Equipment can be upgraded into higher tiers as you level up":
        "牛奶會被加工成不同等級的奶酪。然後這些奶酪被用於（有時會與其他資源一起）製作成裝備。隨著等級提升，裝備可以升級到更高級別",
    "You can increase cheesesmithing speed by equipping a hammer":
        "您可以通過裝備錘子來增加乳酪鍛造的速度。",

    "Crafting produces a variety of items, including ranged and magic weapons, jewelry, and other special resources":
    "製作生產各種物品，包括遠程和魔法武器、珠寶和其他特殊資源。",
    "Logs can be processed into different tiers of lumber, which is then used to craft ranged and magic weapons":
        "木材可以加工成不同等級的木材，然後用於製作弓弩和魔法武器。",
    "Jewelry can be crafted using star fragments and gems, which are rare drops found while gathering or from combat":
        "珠寶可以使用星光碎片和寶石製作，這些都是在採集或戰鬥中發現的稀有掉落物品。",
    "You can increase crafting speed by equipping a chisel":
        "您可以通過裝備鑿子來增加製作速度。",

    "Tailoring produces ranged and magic clothing as well as pouches":
        "裁縫生產遠程和魔法服裝以及袋子。",
    "Raw resources from foraging, such as flax, bamboo branches, and cocoons, can be processed into fabric. Hides from combat enemies can also be processed into leather":
        "來自採摘的原始資源，如亞麻、竹子和繭，可以加工成布料。來自怪物的毛皮也可以被加工為皮革",
    "Fabric is primarily used to make magic clothing, such as robes and hats, while leather is used to make ranged clothing, such as leather armor and boots":
        "布料主要用於製作魔法服裝，如袍服和帽子，而皮革則用於製作弓手服裝。",
    "In addition to clothing, you can craft pouches which increase your maximum HP and MP in combat. Pouches also provide additional consumable slots for both skilling and combat":
        "除了服裝，您還可以製作袋子，它們可以增加您在戰鬥中的最大HP和MP。袋子還提供額外的消耗品（戰鬥+非戰鬥）槽位",
    "You can increase sewing speed by equipping a needle":
        "您可以通過裝備針來增加縫製速度。",

    "Cooking produces food that can be used during combat":
        "烹飪生產可以在戰鬥中使用的食物。",
    "Donuts and cakes restore HP, while gummies and yogurt restore MP":
        "甜甜圈和蛋糕恢復HP，而軟糖和優格恢復MP。",
    "You can increase cooking speed by equipping a spatula":
        "您可以通過裝備鏟子來增加烹飪速度。",
    "Brewing produces drinks that provide buffs with limited durations":
        "沖泡生產提供具有有限持續時間的增益效果的飲品。",
    "Coffee can be consumed during combat to improve combat-related stats, while tea can be consumed to improve non-combat skills":
        "咖啡可以在戰鬥中消耗以提高與戰鬥相關的統計資料，而茶可以在非戰鬥情況下消耗以提高生產專業",
    "You can increase brewing speed by equipping a pot":
        "您可以通過裝備鍋來增加沖泡速度。",


    //---------------------/ 煉金
    "Alchemy allows you to transform items into other items using the actions Coinify, Decompose, or Transmute. Each action has a different success rate, and the input item and coin cost will always be consumed regardless of success or failure":
        "煉金可讓您使用 【點金】、【分解】或【轉化】將物品轉換為其他物品。每個動作都有不同的成功率，無論成功或失敗，輸入的物品和金幣成本都會被消耗",
    "Coinify lets you to convert items into coins. The amount of coins received is 5 times the item's sell price. The base success rate is":
        "【點金】可以讓您將物品轉換成金幣。所獲得的金幣數量為商品售價的 5 倍。基礎成功率為",
    "Decompose lets you to break down items. Equipment can be turned into their base components, and non-equipment items can be turned into skilling essences. Decomposing enhanced equipment yields bonus enhancing essences, with the quantity doubling for each enhancement level. The base success rate is":
        "【分解】可讓您分解物品。裝備可以轉化為基礎組件，非裝備的物品可以轉化為專業精華。分解強化過的裝備會產生額外的強化精華，每強化一級則數量加倍。基礎成功率為",
    "Transmute lets you to change items into other related items or rare uniques, such as the Philosopher's Stone. The base success rate varies depending on the item being transmuted":
        "【轉化】可讓您將物品轉化為其他相關物品或稀有的獨特物品，例如賢者之石。基礎成功率會根據轉換的物品而變化",
    "The base success rate depends on the alchemy action and the specific item being alchemized. If your Alchemy skill level is lower than the item's level, there will be a penalty to the success rate. The success rate can be increased by using catalysts and catalytic tea":
        "基本成功率取決於煉金行動和煉金的具體物品。如果你的煉金專業等級低於物品等級，成功率將會受到懲罰。使用催化劑和催化茶可以提高成功率",
    "Catalysts are special items that can be used to improve the success rates of Alchemy actions. One catalyst is consumed on success only. Regular catalysts can be crafted using skilling essences. Prime catalysts can be obtained by transmuting regular catalysts":
        "催化劑是一種特殊物品，可以用來提高煉金時的成功率。僅在成功時才會消耗一個催化劑。常規催化劑可以使用專業精華來製作。主要催化劑可以透過轉化常規催化劑來獲得",
    "You gain 1% efficiency bonus for each level you have above the item's recommended level":
        "高於該物品推薦等級的每個等級都會獲得 1% 的效率加成",
    "Here is a list of steps to follow when alchemizing items":
        "以下是煉金時要遵循的步驟列表",
    "Select the item that you want to alchemize":"選擇您想要煉金的物品",
    "Select the alchemy action that you want to perform":"選擇您要執行的煉金操作",
    "Decide whether or not to use a catalyst. If you do, select the catalyst":"決定是否使用催化劑。如果要這樣做，請選擇催化劑",
    "Click the \"Start\" button and the alchemy process will begin":"點選「開始」按鈕，煉金過程將開始",
    Recommended: "推薦",


    //---------------------/ 強化
    "Enhancing is the process of increasing the stats of any equipment, such as armor, weapons, tools, pouches, or jewelry. When you successfully enhance an equipment, its enhancement level increases by 1. However, if the enhancement process fails, the level is reset to":
        "強化是增加任何裝備數值的過程，例如盔甲、武器、工具、袋子或珠寶。當你成功強化一件裝備時，其強化等級會增加1。然而，如果強化過程失敗，等級將被重置為",
    "The success rate of enhancing depends on several factors, including your enhancing skill level, the tier of the equipment, and the equipment's current enhancement level. Generally, the higher the tier and enhancement level of the equipment, the lower the success rate will be. Equipping an enhancer can improve your success rate":
        "強化的成功率取決於幾個因素，包括你的強化專業水準、裝備的品級和當前的強化等級。通常情況下，裝備的品級和強化等級越高，成功率就越低。裝備一個強化器可以提高你的成功率。",
    "You gain 1% action speed bonus for each level you have above the item's item level. The item level is usually the same as the level requirement to equip, but it may be different for some special items such as jewelry":
        "你會因為每個等級超過物品等級的等級而獲得1%的強化速度加成。物品等級通常與裝備所需的等級相同，但對於一些特殊物品，比如珠寶，可能會有所不同。",
    "The protection mechanic is a feature that allows players to use copies of the base equipment, mirrors of protection, or crafting components (for special equipment only) to add protection to each enhancing attempt. If the enhancement fails, the equipment's level is only decreased by 1, but 1 protection item is consumed. This can be a cost-effective way to reach high enhancement levels for endgame players":
        "保護機制是允許玩家在每次強化嘗試中使用另一件相同裝備或者保護之鏡，或者（僅適用於特殊裝備的）製作元件來進行強化保護（俗稱“墊子”）。如果強化失敗，裝備的等級只會降低1級，但會消耗1個保護物品。對於後期玩家來說，這是一種經濟高效的方式來達到高等級的強化。",
    "You gain 1% action speed bonus for each level you have above the item's recommended level":
        "高於該物品推薦等級的每一個等級都會獲得 1% 的行動速度加成",
    "Here is a list of steps to follow when enhancing equipment":
        "以下是強化裝備時要遵循的步驟",
    "Select the piece of equipment that you want to enhance":
        "選擇要強化的裝備",
    "Set the target enhancement level that you would like to stop at. Be realistic about what level you can reach with your current resources":
        "理智地設置您希望停止的目標級別。",
    "Decide whether or not to use protection. If you do then select the protection item and a minimum enhancement level where protection will be used. Generally, protection is more cost-effective when the item is at higher enhancement levels":
        "決定是否使用保護。如果是，則選擇墊子和開始使用墊子的級別",
    "Click the \"Start\" button and you will continue enhancing until you reach the target level or run out of materials":
        "點擊“開始”按鈕，您將開始強化，直到達到目標級別或耗盡材料",
    "The bonus stats on enhanced equipment are a percentage of the base stats. The total bonus at each enhancement level is as follows":
        "強化裝備上的額外數值是基礎數值的百分比。強化百分比如下所示",
    "As an exception, accessories, back slot, and trinket slot enhancements receives 5x the normal bonus. For instance, a +1 enhancement on accessories is a 10% bonus":
        "作為例外，配件、披風強化和飾品強化，獲得的獎勵是正常獎勵的 5 倍。例如，配件 +1 強化就是 10% 的加成",
    "Enhancement Base Success Rate":
        "強化基礎成功率",

    //----------------------/ 戰鬥
    "Fighting aliens can earn you coins, tea leaves, hides, essences, ability books, gems, and special items, as well as more common resources. There are enemies of varying difficulty located in different combat areas":
        "與各星球的敵人戰鬥可以讓你獲得金幣、茶葉、獸皮、精華、能力書、寶石和特殊物品，以及各種常見的資源。不同星球中有各種難度的敵人",

    "Wearing equipment will boost your stats in combat. You can equip items directly from the inventory or by clicking equipment slots in the equipment tab next to the inventory":
        "穿戴裝備可以在戰鬥中提升你的屬性。你可以直接從庫存中裝備物品，也可以通過點擊位於庫存旁邊的裝備選項卡中的裝備槽來裝備物品",

    "Food can be consumed to recover your HP or MP. Drinks provide limited duration buffs. Upgrading your pouch allows you to carry more food and drinks into battle":
        "可以食用食物來恢復您的HP或MP。飲料提供有限持續時間的增益效果。升級您的袋子允許同時使用多種食物和飲品",

    "You can learn abilities and use them in combat at the cost of MP. To unlock new abilities, you must learn them from ability books. Abilities get stronger as you level them up. You gain 0.1 XP every time it's used in combat. You can also gain a large amount of XP by consuming duplicate ability books":
        "你可以學習技能並在戰鬥中使用它們，但要消耗MP。要解鎖新能力，您必須從技能書中學習它們。著技能等級的提升，技能會變得更強。每次在戰鬥中使用技能會獲得0.1經驗值。您也可以通過消耗重復的技能書來獲得大量經驗值。",

    "When multiple abilities are available for use during combat, they will be prioritized in the same order you have set them":
        "在戰鬥中有多個可用的技能時，它們將按照你設置的從左到右的順序進行釋放。",

    "Your Intelligence level determines how many abilities you can bring with you":
        "您的智力等級決定了您可以攜帶多少技能。",

    "Both consumables and abilities have default settings for when they will be automatically used. The settings are referred to as combat triggers, and they can be modified by clicking the gear icon below before entering the battle":
        "消耗品和技能都有默認設置，用於確定它們何時會自動使用。這些設置被稱為觸發器，可以在進入戰鬥之前點擊下方的齒輪圖標進行修改。",
    "and Respawning":
        "及復活",
    "When defeated in combat, your character will have to wait through a respawn timer before fully recovering and resuming combat automatically":
        "每當戰鬥中陣亡了，你的角色將等待重生計時器結束，然後才能完全恢復並自動重新開始戰鬥。",

    "You have 7 combat skills that can be leveled up":
        "您有7種可以升級的戰鬥專業",

    "Increases your accuracy, attack speed, and cast speed": "提高你的命中、攻擊速度和施法速度",
    "Increases your evasion, armor, and elemental resistances": "增加你的閃避、護甲和元素抗性",
    "Increases your ranged damage": "增加你的遠程傷害",

    "Status Effects":"狀態效果",
    "There are status effects that can temporarily prevent you from taking certain actions":
        "有一些狀態效果可能會暫時阻止您採取某些行動。",

    "Prevents using auto attacks":
        "禁止使用自動攻擊。",

    "Prevents using abilities":
        "禁止使用技能。",

    "Prevents using auto attacks, abilities, and consumables":
        "禁止使用自動攻擊、技能和消耗品。",
    "Group Combat":"組隊戰鬥",
    "You can create or join a party to battle in zones with multiple monsters. When all party members have pressed \"Ready,\" the party will automatically travel to battle. Monsters will randomly attack any of the party members, and those with a higher threat stat will be targeted more frequently. Monster experience and drops will be divided with an equal chance among all players. Players more than 20% lower than the highest combat level player will receive less experience and drops":
        "你可以創建或加入一個隊伍，一起在有多個怪物的區域戰鬥。當所有隊員都按下“準備”後，隊伍將自動前往戰鬥。怪物會隨機攻擊隊伍中的任何一名成員，而威脅值較高的成員將更頻繁地成為攻擊目標。怪物掉落物品將均等分配給所有玩家。",

    "Dungeons consists of multiple waves of higher tier elite monsters and unique dungeon bosses. They can be accessed with dungeon keys, which can be crafted after finding key fragments from bosses in regular combat zones":"地下城由多波更高級別的精英怪物和獨特的地下城首領組成。可以使用地牢鑰匙進入它們，地牢鑰匙可以在常規戰鬥區域的 Boss 處找到關鍵碎片後製作",
    "Up to five players can be in a dungeon party. Each person must have a key, which will be consumed after beating the final boss for the dungeon reward chest. If you complete a dungeon with fewer players, you will have a chance of looting an additional chest at the cost of an extra key. If the dungeon is not completed, you will keep your dungeon key":"地下城派對中最多可有五名玩家。每個人都必須有一把鑰匙，擊敗最終頭目後將消耗鑰匙以獲得地下城獎勵寶箱。如果您以較少的玩家完成了一個地下城，您將有機會以額外的鑰匙為代價掠奪一個額外的箱子。如果地牢未完成，您將保留地牢鑰匙",
    "Deaths in dungeons will not trigger a respawn timer. You can only be revived by a party member. If all party members are dead, the dungeon run is considered failed and you will restart at wave":"地牢中的死亡不會觸發重生計時器。只有隊員才能使你復活。如果所有隊員都死了，則地下城運行被視為失敗，您將重新開始於波數",

    "You also have secondary combat stats that are affected by your skill levels, equipment, and buffs":
        "您還有次要戰鬥數值，受您的專業等級、裝備和增益效果的影響。",

    "Each attack has a specific style":
        "每次攻擊都有特定的類型。",

    "stab, slash, smash, ranged, or magic":
        "刺擊、斬擊、錘擊、遠程或魔法。",

    "Each attack deals a specific type of damage":
        "每次攻擊都造成特定類型的傷害。",

    "physical, water, nature, or fire":
        "物理、水、自然或火。",

    "How fast you can auto-attack":
        "自動攻擊的速度",

    "Reduces ability cooldowns":
        "減少技能冷卻時間",

    "Increases your chance to successfully attack":
        "增加攻擊成功的幾率",

    "The maximum damage if an attack is successful. Auto-attack damage is random between 1 and the maximum damage":
        "攻擊成功後的最大傷害。自動攻擊的傷害在1和最大傷害之間隨機。",

    "Critical hits always rolls maximum damage. Ranged style has passive critical chance":
        "暴擊總是造成最大傷害。遠程戰鬥類型具有基礎暴擊幾率。",

    "Increases the damage you deal":
        "增加所造成的傷害",

    "Ignores a percentage of enemy armor or resistance when attacking":
        "在攻擊時忽略敵人的一部分護甲或抗性",

    "Increases your chance to dodge an attack":
        "增加閃避攻擊的幾率",

    "Mitigates a percentage of physical damage":
        "減免一部分物理傷害",

    "Mitigates a percentage of water, nature, or fire damage":
        "減免一部分水、自然或火焰傷害",

    "Heals you based on the percentage of auto-attack damage you deal":
        "依自動攻擊造成的傷害以百分比恢復HP",

    "Leeches mana based on the percentage of auto-attack damage you deal":
        "依自動攻擊造成的傷害以百分比吸取MP",

    "When attacked, deals a percentage of your defensive damage back to the attacker. Damage is increased by 1% per armor or resistance (corresponding to the attack type":
        "受到攻擊時，將自身防禦傷害的一定比例反擊給攻擊者。每增加一層護甲或抗性，傷害就會增加 1%（對應攻擊類型",

    Retaliation: "復仇",
    "When attacked, reflects a percentage of (defensive damage + incoming damage) as a smash attack back to the attacker":
        "受到攻擊時，將一定比例的（防禦傷害 + 受到的傷害）以鈍擊的形式反射給攻擊者",

    "Reduces chance of being blinded, silenced, or stunned":
        "降低被致盲、沉默或眩暈的幾率",

    "Increases chance of being targeted by monsters":
        "增加被怪物作為目標的幾率",

    "HP/MP Regen":"HP/MP 再生",
    "Recovers a percentage of your maximum HP/MP every 10 seconds":
        "每10秒恢復最大HP/MP的一部分百分比",

    "Reduces food cooldown": "減少食物冷卻時間",

    "Increases drink effect. Reduces duration and cooldown": "增加飲料效果。減少持續時間和冷卻時間",

    "Increases the drop rate of regular items. This cannot go above":
        "增加普通物品的掉落率。這個值不能超過",

    "Increases quantity of regular item drops":
        "增加常規物品掉落的數量",

    "Increases rare item drop rate":
        "增加稀有物品掉落率",

    "of combat experience is distributed to the primary training skill determined by your weapon": "的戰鬥經驗會分配給主修訓練專業，這取決於你的武器",

    "of combat experience is distributed to the focus training skill determined by your charm": "的戰鬥經驗會分配給專註訓練專業，這取決於你的護符",

    "This is only for display and represents your overall combat effectiveness based on the combination of combat skill levels":
        "這代表目前基於戰鬥類型的相關專業等級的參考等級",

    Formulas:"公式",
    "For those who enjoy math, here are the formulas for the secondary stats":
        "對於喜歡數學的人，這裡是次要戰鬥數值的公式",

    "Attack Interval = baseInterval / (1 + (Attack":
        "攻擊間隔 = 基礎間隔 / (1 + (攻擊",
    "AttackSpeedBonus":"攻擊速度加成",
    "abilityHaste":"技能加速",
    "Bonus":"加成",

    "Cast Time = baseCastTime":
        "施法時間 = 基礎施法時間",
    "Attack / 2000) + CastSpeedBonus":
        "攻擊 / 2000) + 施法速度加成",

    "Ability Cooldown = baseCooldown":
        "技能冷卻 = 基礎冷卻時間",

    "Accuracy = (10 + Attack":
        "精準 = (10 + 攻擊",

    "Damage = (10 + [Melee|Ranged|Magic|Defense":
        "傷害 = (10 + [進戰|遠程|魔法|防禦",

    "Bulwark Smash Damage = SmashDamage + DefensiveDamage": "重盾鈍擊傷害 = 鈍擊傷害 + 防禦傷害",

    "Thorn Damage = DefensiveDamage * (1 + [Armor|Resistance] / 100) * Thorn": "反傷傷害 = 防禦傷害 * (1 + [護甲|抵抗] / 100) * 反傷",

    "Retaliation Damage = (DefensiveDamage + MIN(AttackerPremitigatedDamage, 5 * DefensiveDamage)) * Retaliation":
    "復仇傷害 = (防禦傷害 + MIN(攻擊者減輕傷害, 5 * 防禦傷害)) * 復仇",

    "Hit Chance = (MyAccuracy":
        "命中幾率 = (我的精準",

    "MyAccuracy ^ 1.4 + EnemyEvasion":
        "我的精準 ^ 1.4 + 敵人的閃避",

    "Ranged Bonus Critical Rate = 0.3 * Hit Chance":
        "遠程基礎暴擊幾率 = 0.3 * 命中幾率",

    "Evasion = (10 + Defense":
        "閃避 = (10 + 防禦",

    "Armor = 0.2 * Defense + Bonus":
        "護甲 = 0.2 * 防禦 + 加成",

    "Percent Physical Damage Taken":
        "受到物理傷害百分比",

    "If Armor is negative then it's":
        "如果護甲是負數，那麼它是",

    "Resistance = 0.2 * Defense + Bonus":
        "抗性 = 0.2 * 防禦 + 加成",

    "Percent Elemental Damage Taken":
        "受到元素傷害百分比",

    "If Resistance is negative then it's":
        "如果抗性為負數，則是",

    "Blind/Silence/Stun Chance = Base Chance":
        "致盲/沉默/眩暈幾率 = 基礎幾率",

    "Targeted By Monster Chance = MyThreat":
        "被怪物選中的機率 = 我的威脅值",
    "TeamTotalThreat":"隊伍總威脅值",
    "Combat Level = 0.1 * (Stamina + Intelligence + Attack + Defense + MAX(Melee, Ranged, Magic)) + 0.5 * MAX":
        "戰鬥等級 = 0.1 * (耐力 + 智力 + 攻擊 + 防禦 + MAX(近戰, 遠程, 魔法))  + 0.5 * MAX",

    "Attack, Defense, Melee, Ranged, Magic": "攻擊, 防禦, 近戰, 遠程, 魔法",


    //------------------/ 隨機任務
    "Random Tasks": "隨機任務",
    "Tasks Feature": "任務功能",
    'After completing the tutorial, you will unlock the tasks feature. The Task Board generates random short to medium-length tasks in different skills. By completing these tasks, you can obtain rewards for your participation':
    "完成新手教程後，你將解鎖任務功能。任務板會生成不同專業類型的隨機中短期任務。通過完成這些任務，你可以獲得相應的參與獎勵",
    "The Task Board": "任務板",
    "Frequency": "頻率",
    "Variety": "種類",
    "Capacity": "容量",
"Task Cooldown": "任務冷卻",
    "Tasks are assigned periodically, starting at one every 8 hours. Upgrades can reduce the interval to as low as 4 hours":
        "任務定期分配，從每8小時一個開始。升級可以將間隔減少到最低4小時",

    "Tasks may involve gathering/production skills or defeating monsters. The generated tasks will slightly prioritize skills in which the player has a higher level":
        "任務可能涉及採集/生產專業或擊敗怪物。生成的任務會稍微優先考慮玩家等級較高的專業。",

    "You can reroll tasks using coins or cowbells. The cost doubles (up to a limit) with each reroll":
        "您可以使用金幣或牛鈴重新選擇任務。每次重新選擇的費用會翻倍（有上限）",

    "Tasks do not expire, but there's a limit of 8 task slots. The capacity can be increased through upgrades in the cowbell store":
        "任務沒有期限，但任務槽位有8個的限制。可以通過在牛鈴商店進行升級來增加容量。",

    "Completing tasks rewards you with Coins and Task Tokens. A Task Point is also granted for every Task Token rewarded from tasks":
        "完成任務將獎勵您金幣和任務代幣。每個任務代幣獎勵還會獲得一個任務點數",

    "Accumulating 50 Task Points allows you to claim \"Purple's Gift,\" which can be opened to obtain Coins, Task Tokens, Task Crystals, and various lootboxes":"累積50個任務點可以讓您領取“紫色禮物”，打開後可獲得金幣、任務代幣、任務水晶和各種箱子",

    "Task Tokens can be spent in the Task Shop for permanent upgrades or items, including":
        "任務代幣可以在任務商店中用於永久升級或物品，包括",

    "Reduces the cooldown between tasks":
        "減少任務之間的冷卻時間",

    "Allows blocking specific skills from being assigned as tasks. Combat blocking has to be unlocked at an additional cost":
        "允許屏蔽特定專業被分配為任務。戰鬥屏蔽需要額外付費解鎖。",

    "Used for crafting or upgrading task badge with the Crafting skill. Task badges provide multiplicative action speed or damage bonuses while undertaking tasks":
        "用於使用製作專業來製作或升級任務徽章。任務徽章在進行任務時可提供大量的行動速度或傷害加成。",

    "Large Meteorite Cache, Large Artisan's Crate, and Large Treasure Chest":
        "隕石【大】、工匠的箱子【大】和寶箱【大】",

    //------------------/ 公會
    'Discover guilds by navigating to the "Guild" feature in the navigation menu. Guilds are formed by groups of players who enjoy playing together. While guilds currently serve as primarily social hubs, upcoming expansions may introduce more group-oriented activities':
        "通過導航功能表中的“公會”功能發現公會。公會由一群喜歡一起遊戲的玩家組成。目前，公會主要作為社交中心，但即將到來的擴展可能會引入更多以團隊為導向的活動。",

    "Creating a Guild": "創建公會",

    "You can start your own guild by investing 5 million coins and choosing a unique guild name. As the guild's creator, you automatically assume the role of the leader, granting you the highest authority within the guild. Afterward, invite other players to join your guild":
        "您可以通過投資5M金幣並選擇一個獨特的公會名稱來創建您自己的公會。作為公會的創建者，你會自動成為公會的會長，擁有公會內的最高權力。之後，你可以邀請其他玩家加入你的公會。",

    "Joining a Guild": "加入公會",

    "You can be invited to join existing guilds. To find a guild to join, you can use the Recruit chat channel, where guilds actively seek new members. You can view your invitations on the Guild page":
        "你可以被邀請加入現有的公會。要找到可以加入的公會，你可以使用招募聊天頻道，在那裡公會會積極尋找新成員。你可以在公會頁面查看你的邀請。",

    "Guild Features": "工會功能",
    "Guilds come with several key features":
        "公會具有幾個關鍵功能",

    "Guild Chat Channel":
        "公會聊天頻道",

    "A private, self-moderated space for guild members to connect and converse":
        "一個私密的、自我管理的空間，供公會成員互相聯繫和交流",

    "Guild Notice Board": "公會公告板",

    "A persistent message board editable by the leader or generals to keep everyone informed":
        "由會長或將軍可編輯的持續消息板，用於通知所有人",

    "As members earn experience points (XP) in various skills, the guild accumulates XP at a":
        "隨著成員在各種專業中獲得經驗點（XP），公會積累經驗的比例為",

    "ratio, contributing to the guild's level. Climb the leaderboard based on your guild's level and experience":
        "比例，有助於提升公會的等級。根據您的公會等級和經驗爬榜",

    "Guilds begin with 30 member slots and gain 1 additional slot for every 3 guild levels":
        "公會初始有30個成員數量，並且每提升3個公會等級就增加一個槽位",

    "Guilds begin with":"公會初始有",
    "member slots and gain 1 additional slot for every":"個成員槽，並且增加一個槽位於每提升",

    "Member Roles": "職位",
    "Guilds have a structured hierarchy with different roles and permissions. Higher rank roles automatically possess the permission of any lower rank":
        "公會具有不同的角色和許可權。較高等級的角色自動具有任何較低等級的許可權。",

    "Can pass leadership to another member":
        "可以將會長轉交給另一名成員",

    "Has the authority to disband the guild entirely when the guild is empty":
        "在公會為空時有權解散整個公會",

    "Empowered to promote or demote any lower-ranking member":
        "有權提升或降級任何低級別成員",

    "Can edit the guild notice board":
        "可以編輯公會公告板",

    "Can invite new members to join the guild":
        "可以邀請新成員加入公會",

    "Can kick lower-ranking member out of the guild":
        "可以將低級別成員踢出公會",

    "Can view the guild overview":
        "可以查看公會概況",

    "Can view and converse in the guild chat channel":
        "可以查看並在公會聊天頻道中交流",

    "Invited":"受邀",

    "Has no access until they accept the guild invitation":
        "在接受公會邀請之前沒有許可權",

    //------------------/ 聊天指令
    "Chat Commands":"聊天指令",
    "w [name] [message":"w [暱稱] [信息",
    "whisper another player":"私聊",
    "reply to last whisper": "回覆最後一條私聊",
    "view player profile":"查看玩家信息",
    "profile [name":"profile [暱稱",
    "friend [name":"friend [暱稱",
    "block [name":"block [暱稱",
    "unblock [name":"unblock [暱稱",
    "friend [name":"friend [暱稱",
    "unfriend [name":"unfriend [暱稱",
    "House Rooms": "房子加成",
    "add friend": "添加好友",
    "remove friend": "刪除好友",
    "unblock player": "解除屏蔽該玩家",
    "Ping mods for urgent issues that require immediate attention. This will only work in public channels. DO NOT ABUSE":
        "若有需要立即處理的緊急問題，請 @管理員。此操作僅在公共頻道有效。請勿濫用。",
    "Experience Table":"經驗表",

    //-------------- 守則
    "Single Account Only":"一人一號",
    "Each person can only play on 1 account. Guests are also considered accounts": "每人只能使用一個帳戶玩遊戲。訪客也被視為帳戶",
    "No Account Sharing":"禁止帳號共用",
    "Do not share account with other players": "不要與其他玩家共用帳戶",
    "No Inappropriate Name":"禁止不當名稱",
    "Names should not be offensive, sexual, impersonating others, or based on well-known real-world individuals. Inappropriate name may result in mutes and forced name change":
        "角色名稱不可具有冒犯性、性暗示、冒充他人或基於現實世界中的知名人士。不當稱謂可能會導致禁言或強制改名",

    "Age 13+ Only":"僅限13歲以上玩家遊玩",
    "In compliance with COPPA(Children's Online Privacy Protection Act), you must be at least age 13+ to register and play": "根據 COPPA（兒童線上隱私保護法案），您必須年滿 13 歲才能註冊和玩遊戲",

    Trading:"交易",
    "No Real World Trading / Cross-Trading":"禁止現實世界交易/跨遊戲交易",
    "Do not trade items or services within Milky Way Idle for anything outside of the game": "不要用《銀河牛牛放置》內的物品或服務換取遊戲外的任何東西",

    "No Boosting":"禁止傾斜資源",
    "Do not funnel wealth to other players. Players may receive up to 10M coins in total gifts from others. Wealth transfers over this limit, whether intentional or not, can be treated as boosting. Unintentional transfers (e.g. randomly finding an extremely underpriced item on market) can be removed. Intentional transfers will result in additional penalties based on severity": "請勿將財富轉移給其他玩家。玩家從他人處累計接收的禮物總額不得超過 10 M遊戲幣。超過此限額的財富轉移，無論是否出於故意，都可能被視為違規帶練行為。非故意的轉移（例如在交易行偶然發現極低價物品）可能會被追回。故意轉移財富將根據情節嚴重程度追加處罰",

    "No Scamming": "禁止詐騙",
    "Do not use deception or scamming to gain items from other players. Actions will be taken against scammers given sufficient evidence. However, items lost to scams will not be refunded": "不要使用欺騙手段獲取其他玩家的物品。只要有足夠的證據將對騙子將採取措施。然而，被詐騙損失的物品將不予退還",

    "Repay Loans Within 7 Days": "貸款需在 7 天內償還",
    "Loans are at your own risk. Loans not repaid within 7 days can be considered boosting/scamming": "貸款風險自負，未在 7 天內償還的貸款視為傾斜資源/詐騙",

    "Use Respectful Language":"注意言辭",
    "The #1 chat rule is to respect other players. Our goal is to create a friendly community space everyone can enjoy. Please avoid intentionally antagonizing or harassing others. While the occasional use of profanity is not against the rule, please don't do so excessively, especially when directed at other players":"首要的聊天規則是尊重其他玩家。我們的目標是創建一個友好的社區空間，讓每個人都能享受。請避免故意挑釁或騷擾他人。雖然偶爾使用粗話不違反規則，但請不要過度使用，尤其是針對其他玩家時。",

    "English in General Chat":"常規頻道僅限使用英語",
    "Please primarily use English in the General chat channel. Different languages are acceptable in other channels": "請在常規聊天頻道主要使用英語。其他頻道可以接受其他語言",

    "No Discrimination":"禁止歧視",
    "Do not use slurs, slangs, or any offensive phrases that target any person or group of people":"不要使用針對任何人或群體的侮辱性語言、俚語或攻擊性短語",

    "No Illegal or Sexual Topics":"禁止討論非法或色情相關話題",
    "Do not link or discuss illegal activities or sexual topics": "不要發送連結或討論非法活動或色情話題",

    "Avoid Divisive Topics or Drama": "避免敏感或是有爭議性的話題",
    "Avoid divisive topics that often lead to drama or conversations inappropriate for public chat. This includes, but is not limited to, politics, religion, international conflicts, gender discussions, sexuality, mute/ban complaints, and other topics that frequently become disruptive":
        "玩家需要避免那些常常會引發爭端或不適合在公共聊天中進行的有爭議性或是敏感性的話題,這包括但不限於政治、宗教、國際衝突、性別討論、性方面、禁言/封號等等的抱怨，以及其他常常會造成擾亂的話題",

    "No Spamming":"禁止刷屏",
    "Do not spam the chat with large number of unnecessary messages, overuse CAPSLOCK, or beg others for free items":"不要發送大量不必要的資訊、過度使用大寫字母或乞討免費物品",

    "Do Not Encourage Others to Break Rules":"禁止鼓勵他人違反規則",
    "Do not mislead or instigate other players into breaking game rules":"不要誤導或煽動其他玩家違反遊戲規則",

    "Do Not Disclose Personal Information":"禁止披露個人資訊",
    "Do not disclose identifying personal information about yourself, including, but not limited to, your full name, address, phone number, and email address. Furthermore, do not disclose ANY personal information about other players that they have not made public themselves, such as their name, age, or location":
        "不要披露關於您自己的任何個人識別資訊，包括但不限於您的全名、位址、電話號碼和電子郵寄地址。此外，不要披露其他玩家未公開的任何個人資訊，如他們的姓名、年齡或位置",

    "All Advertisements Must be in Appropriate Channels":"所有廣告必須在適當的頻道中",
    "All buying, selling, or service requests should be in trade chat. Guild/Party recruitment or seeking to join guild/party requests should be in recruit channel. Price checks are allowed in most channels. No referral links":
        "所有買賣或服務請求應在交易聊天中進行。公會/隊伍招募或尋求加入公會/隊伍的請求應在招募頻道中進行。大多數頻道允許比價。禁止使用推薦連結。",

    "Listen to":"聽從",
    "Moderators have the discretion to moderate chat as they see fit in order to maintain a positive environment. Please cooperate with their requests. If anyone has disagreements or complaints regarding a moderator, please submit a ticket on Discord or email contact@milkywayidle.com":
        "管理員有權對他們認為合適的方式進行聊天管理，以維持一個積極向上的環境。請配合他們提出的要求。如果有人對管理員存在異議或有投訴事項，請在 Discord 上提交工單，或發送電子郵件至 contact@milkywayidle.com",

    "Bots, Scripts, and Extensions":"自動化，腳本和外掛程式",
    "No Botting":"禁止使用機器人",
    "Do not use any automation that plays the game for you":"禁止使用任何自動化工具來代替玩家進行遊戲",

    "Scripts and Extensions":"腳本和外掛程式",
    "Any scripts or extensions must not take any actions for the player (send any requests to server). You are allowed to use them purely for information display purposes or UI improvements":"任何腳本或擴展不得為玩家採取任何行動（發送任何請求到伺服器）。您可以純粹用於資訊顯示或使用者介面改進。",
    "ex":"例如",
    "Display combat summary, track drops, move buttons to different location":"顯示戰鬥總結、追蹤掉落、移動按鈕位置",
    "Bugs and Exploits":"漏洞和利用",
    "No Bug Abusing":"禁止濫用漏洞",
    "Do not abuse game bugs or exploits to your advantage. Please report them on Discord":"不要利用遊戲漏洞或不正當行為來獲取優勢。請在 Discord 上報告這些問題",
};

//3.1 新聞
let tranNews = {
    "Skilling Expansion Part":"專業擴充部分",
    "Alchemy Skill":"煉金專業",

    "Pirate Cove Dungeon, 4th Character Slot, and Custom Cosmetic Policy Update":"海盜灣地下城、第四個角色欄位以及自訂外觀政策更新",
    "The Pirate Cove Dungeon is now open for exploration! This new dungeon features a variety of new T95 weapons and armors, as well as new abilities. We've also made some adjustments to existing items and abilities to improve balance and gameplay. Check out the full patch notes for all the details":
        "海盜灣地下城現已開放供玩家探索！這個新的地下城擁有各種全新的 T95 武器和盔甲，以及新的技能。我們還對現有物品和技能進行了一些調整，以提升平衡性和遊戲體驗。查看完整的補丁說明以了解所有詳細資訊",
    "In other news, we've added a new 4th character slot for players, allowing everyone the same opportunity of having up to 1 Standard and 3 Ironcow characters":
        "另一方面，我們為玩家新增了第四個角色欄位，讓每個人都有同樣的機會擁有最多 1 個普通角色和 3 個鐵牛角色",
    "We are also updating our custom cosmetic policy and pricing. While the feature started as nice gift to show our appreciation to our supporters, it's now too overwhelming with the huge increase in playerbase. We've spent 150-200 hours to work on about 100 requests in the past month, and we need to be able to allocate more time for other development tasks. Starting May 1st, custom cosmetics will require spending supporter points and cowbells. Any requests initiated before the end of April will be granted based on the previous supporter point requirements":
        "我們也在更新我們的自訂外觀政策和定價。雖然這個功能最初是作為向我們的支持者表達感謝的一份貼心禮物推出的，但隨著玩家數量的大幅增加，現在這項工作變得過於繁重。在過去一個月裡，我們花費了 150 到 200 個小時來處理大約 100 個請求，而我們需要能夠為其他開發任務分配更多時間。從 5 月 1 日起，獲取自訂外觀將需要花費支持者點數和牛鈴。在 4 月底之前提交的任何請求都將根據之前的支持者點數要求來處理",

    "We're excited to release the second part of the skilling expansion, introducing Celestial Tools and Skilling Outfits! After using Holy tools for such a long time, skilling specialists can finally get their hands on some upgrades. These items are not easy to acquire, but those who are dedicated (or wealthy) enough to obtain them will be rewarded with a significant boost. Dive in and take your skilling to the next level":
        "我們激動地推出專業擴展的第二部分-星空工具與生產服裝！在使用神聖工具這麼長的時間以來，生產專精的玩家們終於又能獲得進一步的裝備升級了！當然，這些道具並不容易獲得，但是那些足夠專精（或富有）從而取得他們的人會獲得顯著的強化。現在加入來將你的生產專業推向新一波的高峰吧",

    "Sat Nov":"星期六 11月",
    "Transform your gameplay with the introduction of the new Alchemy skill, the first part of our Skilling Expansion! Alchemy introduces exciting new mechanics, allowing you to turn one item into another using Coinify, Decompose, or Transmute. Whether you're stocking up on coins, acquiring new skilling essences, breaking down equipment for their components, or chasing legendary gems like the Philosopher's Stone, Alchemy opens up a world of possibilities":
    "透過引入新的【煉金】專業來改變您的遊戲玩法，這是我們專業擴充的第一部分！ 煉金引入了令人興奮的新機制，讓您可以使用【點金】、【分解 】或 【轉化】 將一件物品變成另外一件物品。無論您是轉換金幣、獲取新的專業精華、分解裝備以獲取其組件，還是追逐魔法石等傳奇寶石，【煉金】都會打開一個充滿可能性的世界 ",
    "For more details on this update, head over to the Patch Notes, and stay tuned for part 2 of the expansion in the coming month, which will introduce a new set of high-level tools and skilling outfits":
    "有關此更新的更多詳細內容，請參閱補丁說明，並繼續關註下個月將擴充的第二部分，其中將引入一套新的高級工具和專業裝備",

    "Elite Monsters and Special Abilities":"精英怪物和特殊技能",
    "At long last, the group combat feature has arrived! You can now join forces with fellow adventurers, strategize together, and vanquish groups of elite enemies to claim the coveted special ability books":
        "終於，團隊戰鬥功能來了！你現在可以與其他冒險者聯手，群策群力，擊敗一群精英敵人，贏得夢寐以求的特殊技能書。（然後被吸",
    "Developer's Note":"開發者日誌",
    "Sorry for the extended gap since the last update. The implementation of group combat proved to be more complex than initially estimated. This release is split into 2 parts. Part 1, the current update, establishes the groundwork for the party system along with introducing elite monsters and special abilities. Part 2 will unveil dungeons where you can discover new unique drops and equipment. Stay tuned for more adventures ahead":
        "很抱歉自上次更新以來間隔了這麼長時間。團隊戰鬥的實現比最初估計的要複雜得多。本次發佈分為兩個部分。第一個部分，即當前更新，奠定了隊伍系統的基礎，同時引入了精英怪物和特殊技能。第二部分將帶來地下城，您可以在其中發現新的獨特掉落物品和裝備。敬請期待更多的冒險！                                   -------------以前的補丁不想翻譯了，感興趣自行閱讀-------------",

    "Are you tired of your party looking like a team of clones? Avatars are now available in the Cowbell Store. Combine them with stylish outfits to give yourself a unique look": "厭倦了你的隊伍看起來像一隊克隆人嗎？牛鈴商店現在提供頭像。將它們與時尚的裝束搭配，使自己擁有獨特的外觀",
    "Dungeon chest drops are receiving a rework. Different dungeon tokens for each of the 3 dungeons are being introduced that gives you a choice over what dungeon materials to exchange for in the new Shop. From the latest Discord poll, this change has been polarizing among players who voted. Therefore, instead of replacing all material drops with tokens, we decided to proceed with a mix of material and token drops. This is balanced around allowing players to focus on one item at a time and complete it in about half the time, but it will take longer to complete multiple items":
    "地牢寶箱掉落物正在進行重做。每個地牢引入不同的地牢代幣，使你可以選擇在新商店中兌換哪些地牢材料。從最新的Discord投票來看，這一變化在投票玩家中引起了極大的爭議。因此，我們決定在材料掉落中添加代幣，而不是全部替換成代幣。這種平衡方式允許玩家一次專注於一個物品並在大約一半的時間內完成它，但完成多個物品的時間會更長",
    "Sat Jun": "星期六 六月",
    "This update introduces new combat dungeons": "此更新引入了新的戰鬥地牢",
    "Chimerical Den, Sinister Circus, and Enchanted Fortress. Gather your party of up to five players and face waves of elite monsters and unique bosses. Complete these dungeons to discover new abilities, weapons, and equipment, including new back slot items! Embrace the new challenges and claim your rewards": "奇幻洞穴、邪惡馬戲團和秘法要塞。組建最多五人的隊伍，面對一波波的精英怪物和獨特的首領。完成這些地牢以發現新的技能、武器和裝備，包括新的背部裝備！迎接新的挑戰並領取你的獎勵",
};

//3.2 補丁
let tranPatch = {

    "UI": "用戶界面",
    Rebalance :"再平衡",
    Hotfix:"熱補丁",
    "Features and Content": "功能和内容",
    "Major Patch": "重大補丁",
    "QOL": "生活質量改進",
    "Medium Patch": "中型補丁",
    "Minor Patch":"小型更新",
    "Rebalancing":"平衡性調整",
    "Bug Fix": "BUG修復",
    "Shop": "商店",
    "Other":"其他",
    "Major Patch": "重大補丁",
    "Group Combat Part": "團隊戰鬥部分",
    "Dungeons": "地下城",


    "Pirate Cove Dungeon and More": "海盜灣地下城及更多內容",
    "Pirate Cove Dungeon": "海盜灣地下城",
    "New T95 Magic Weapons": "全新 T95 魔法武器",
    "Rippling Trident, Blooming Trident, Blazing Trident": "漣漪三叉戟、綻放三叉戟、熾焰三叉戟",
    "New T95 Armors": "全新 T95 盔甲",
    "Anchorbound Plate Body/Legs, Maelstrom Plate Body/Legs, Kraken Tunic/Chaps, Corsair Helmet, Marksman Bracers": "錨定胸甲 / 腿甲、漩渦胸甲 / 腿甲、克拉肯皮衣 / 皮褲、海盜頭盔、神射護腕",
    "New Abilities": "新技能",
    "Shield Bash (also added to Chimerical Den), Fracturing Impact, Life Drain": "盾擊（也添加到了地下城奇幻洞穴）、碎裂衝擊、生命吸取",
    "Alchemy recipes added for the new items. All dungeon ability book transmutes have been normalized to 50% success": "為新物品添加了煉金配方。所有地下城技能書的轉化成功率已統一調整為 50%",
    "New T95 spear added to Enchanted Fortress": "在秘法要塞中添加了全新的 T95 矛類武器",
    "Upgrading equipment with production skills will now save 70% of the enhancement levels. Some T95 equipment recipes are adjusted to be upgraded from lower tier variants": "使用生產專業升級裝備時，現在將保留 70% 的強化等級。一些 T95 裝備的配方也調整為可從較低等級的強化物品進行升級",
    "Added 4th character slot. You can only have up to 3 Ironcows": "添加了第四個角色欄位。你最多只能擁有 3 個鐵牛角色",
    "Added Steam leaderboard for characters created after the Steam release and is also linked to Steam. This is only visible on qualifying characters": "為在 Steam 發佈後創建且與 Steam 連動的角色添加了 Steam 排行榜。這些僅在符合條件的角色上可見",
    "Increased guild member slots from 25 + level/4 to 30 + level": "將公會成員名額從 25 + 等級/4 改為 30 + 等級",
    "Cosmetics": "外觀",
    "year anniversary": "周年紀念",
    "Anniversary Purple, OG Jerry chat icons": "周年慶牛紫、經典傑瑞聊天圖標",
    "Added new chat icons based on a small selection of dungeon bosses": "根據部分精選的地下城首領添加了新的聊天圖標",
    "Added 2 new Pirate Cove themed avatars and outfits": "添加了兩個全新的海盜灣主題頭像和服飾",
    "Custom cosmetics are changed to require spending supporter points and cowbells. We are simply overwhelmed by requests due to the huge increase in player count and unfortunately cannot continue supporting them as gifts. The new pricing will take effect on May 1st. Any requests initiated before end of April will be granted based on the previous supporter point requirements": "自訂外觀現在改為需要花費支持者積分和牛鈴。由於玩家數量大幅增加，我們實在被請求淹沒，很遺憾無法再將其作為禮物提供。新的定價將於 5 月 1 日生效。4 月底之前提交的任何請求都將根據之前的支持者積分要求來處理",
    "Adjusted recipe of Chimerical Chest Key and Enchanted Chest Key so that their Brown and White Key Fragments are swapped. This prevents Enchanted Fortress and Pirate Cove from sharing 3/4 key fragments. You can temporarily freely swap between Brown and White Key Fragments in the dungeon shop until the next patch": "調整了異想寶箱鑰匙和魔法寶箱鑰匙的配方，將它們的棕色和白色鑰匙碎片進行了互換。這防止了魔法要塞和海盜灣共用四分之三的鑰匙碎片。在下個補丁之前，你可以在地下城商店中臨時自由互換棕色和白色鑰匙碎片",
    "Added auto attack damage to all melee armor to bring melee damage closer to the other styles": "為所有近戰的盔甲添加了自動攻擊傷害，以使近戰傷害更接近其他類型的傷害",
    "Increased bulwark accuracy and damage": "提高了護盾的準確率和傷害",
    "Added melee accuracy to Colossus Plate Body/Legs": "為巨像胸甲 / 腿甲添加了近戰準確率",
    "Reworked to damage all enemies": "從單體改為對所有敵人造成傷害",
    "Damaged over time duration reduced from 15s to 9s. Damage taken debuff increased from 0% to": "持續傷害時間從 15 秒減少到 9 秒。受到的傷害減益效果從 0% 增加到",
    "Evasion debuff lowered from 15% to": "閃避減益效果從 15% 降低到",
    "Damage over time duration reduced from 10s to 6s": "持續傷害時間從 10 秒減少到 6 秒",
    "Accuracy debuff lowered from 20% to 15%. Evasion debuff increased from 0% to": "準確率減益效果從 20% 降低到 15%。閃避減益效果從 0% 增加到",
    "Monster defense level reduced by": "怪物防禦等級降低了",
    "Monster fire resistance reduced by": "怪物火抗降低了",
    "Added a new setting to hide General chat system messages": "添加了一個可隱藏世界聊天系統消息的新設置",
    "Disabled party linking in General, Trade, and Beginner chat": "禁止在世界聊天、交易聊天和新手聊天中發送組隊連結",
    "Added double confirmation to some buttons that are troublesome when misclicked": "為一些誤點後會帶來麻煩的按鈕添加了二次確認",
    "Added inactive days count to guild and friend list": "在公會和好友列表中添加了不活躍天數計數",
    "Changed \"Start\" button text on alchemy and enhancing to be more obvious about what action it is": "更改了煉金和強化界面中 \"開始\" 按鈕的文本，使其更明確所執行的操作",
    "Do not prevent making an instant market order when you have 3 open listings on the item": "當你在該物品上有 3 個未完成的上架信息時，不再阻止你進行即時市場訂單操作",
    "Fixed issue that may cause small number of player's actions to stop after a server restart": "修復了可能導致少數玩家在服務器重啓後行動停止的問題",
    "Fixed a rare bug that may cause server crash": "修復了一個可能導致服務器崩潰的罕見錯誤",
    "Blocking characters will prevent party join (based on leader) and guild invite": "拉黑的角色將阻止組隊加入（基於隊長）和公會邀請",
    "Server and client optimizations to speed up server restart, task generation, scroll performance, and more": "對服務器和客戶端進行了優化，以加快服務器重啓、任務生成、滾動性能等方面的速度",
    "Added a feature to allow admin to post an announcement bar for important messages": "添加了一項功能，允許管理員發佈重要消息的公告欄",
    "Localization improvements": "翻譯改進",


    "Anti-Fraud Measures and Bug Fixes": "反詐騙措施與BUG修復",
    "Anti-Fraud": "反詐騙",
    "Due to a few instances of recent fraudulent purchases, added anti-fraud measure where player's first time Cowbell purchase may trigger a 72-hour restriction on selling Bags of Cowbells on the market. You will be notified prior to purchasing":
    "由於近期出現幾起詐騙購買事件，新增了反詐措施，玩家首次在牛鈴商店購買商品時會觸發這項限制，導致在72小時內無法在市場上販售牛鈴袋。在購買前您將收到通知。",
    "Fixed an issue where under extremely rare conditions a player may get stuck in a nonexistent party combat action":
    "修復了當玩家處於不存在的隊伍戰鬥行動中時，遊戲會卡住的問題",
    "Fixed additional translation inconsistencies with some item names and their corresponding actions":
    "修復了一些物品名稱及其對應行動的翻譯不一致問題。",
    "Backend changes to improve database connection stability":
    "對後台進行了更動，以提高資料庫連接的穩定性。",


    "Chinese Localization and Final Preparations for Steam Early Access Release": "Steam 搶先體驗版發布的官方漢化【簡中】及最終準備工作",
    "Added Chinese localization": "新增官方遊戲內容的漢化【簡中】",
    "The language will be automatically selected based on your browser language":
    "系統將依據您的瀏覽器語言自動選擇對應語言",
    "Players can also manually change the display language in [Settings] -> [Game] or from the home page":
    "玩家也能夠在 [設置] -> [遊戲] 中，或者從主頁面手動切換顯示語言",
    "A few items have not yet been translated, including most of news/patch notes, terms of use, and privacy policy":
    "尚有幾項內容未完成翻譯，其中包括大多數的新聞資訊、更新說明、使用條款以及隱私政策",
    "If you see any translation issues or bugged display text, please report them in the #bug-reports channel on Discord":
    "倘若您發現任何翻譯或文本顯示的問題，請在 Discord 的 #bug-reports 頻道中反饋",
    "Updated popup modals to all be centered on the entire game screen":
    "對彈出式窗口進行更動，使其全部在整個遊戲屏幕上居中顯示",
    "Removed seasonal Spring Festival cosmetics from the Cowbell Store":
    "從牛鈴商店中移除了春節期間限定的外觀",
    "Additional adjustments to Steam integration":
    "對 Steam 的集成進行了進一步的調整",
    "Privacy policy have been updated to include language for use of analytical and marketing cookies. This allows us to optimize marketing campaigns when attempting to run ads for Milky Way Idle on other platforms":
    "更新了隱私政策，新增了有關於使用分析和營銷類 Cookies（網絡跟踪器）的條款內容。這能讓我們在其他平台上投放《銀河放置》廣告時，能夠對營銷活動進行優化",


    "Spring Festival": "春節",
    "Spring festival chat icon, avatar, and avatar outfits available in Cowbell Store until the update after at least 3 weeks. You can continue to use them after the event ends":
    "春節活動聊天圖標、頭像和頭像服裝可在牛鈴商店中購買，活動將持續至少 3 週，直至更新後結束。活動結束後，您仍可繼續使用這些物品",
    "Send a system message every 25 skill levels at or above level 100 instead of only for levels 100 and":
    "在玩家等級達到或超過 100 級時，每提升 25 級時會發送一次系統消息，而不是僅僅只在等級 100 或  ",
    "Leaderboard guild names should not be clickable":
    "排行榜中的公會名稱為不可點擊",
    "Improved chat message URL link parsing to be more accurate":
    "改進了聊天消息中的 URL 連結解析，使其更加準確",
    "Fixed an issue where players get logged out if the database goes offline during maintenance":
    "修復了資料庫在維護期間離線時導致玩家被強制登出的問題",
    "Fixed an issue where some uncommon conditions cause player combat to not correctly stop after running out of offline progress":
    "修復了某些罕見情況導致玩家戰鬥在離線進度耗盡後未正確停止的問題",
    "Added @mod and @mods chat commands to notify moderators for emergencies":
    "新增 @mod 和 @mods 聊天指令，可在緊急情況下通知管理員",
    "Implemented authentication and payment changes in the background to support upcoming Steam release":
    "在後台實現了身份驗證和支付更改，以支持即將推出的 Steam 版本",


    "Fri Jan": "星期五 1月",
    "Chat Channel Improvements": "聊天頻道改進",
    "Added 12 alternative language chat channels and ironcow channel": "添加了 12 個備用語言聊天頻道和鐵牛頻道",
    "When creating a new character, if your browser's default language matches one of the available alternative language channels, it will be automatically assigned": "創建新角色時，如果瀏覽器的默認語言與某個可用的備用語言頻道匹配，將自動分配該頻道",
    "All public channels can be toggled on or off in Settings -> Game": "所有公共頻道均可在 “設定” -> “游戲” 中打開或關閉",
    "Personal rank in the leaderboard will now display up to 10,000 instead of": "排行榜中的個人排名現在最高可顯示到 10,000，而不是",
    "Allow chat channel tabs to wrap to a second row when there's not enough space": "當空間不足時，允許聊天頻道標簽換行到第二行。",
    "Clarified that \"rare find\" applies to all rare items (displayed under rare drops) and not just to loot containers": " “稀有發現”現在適用於所有稀有物品（顯示在稀有掉落下方），而不僅僅是戰利品箱子",
    "Correctly include rare skilling components as protection item for T90 skilling equipment": "修復了之前沒有把稀有材料作為t90裝備保護物品的錯誤",
    "Correctly account for the artisan tea level requirement increase when calculating the efficiency bonus": "修復了工匠茶增加額外等級要求未能正確作用於專業效率的問題的錯誤",
    "Corrected the display of efficiency and enhancing success bonuses from fractional level boosts": "修復了在效率和強化成功率上未能正確顯示的小數點等級的错误",
    "Created a workaround for a Google Translate bug that causes crashes for some actions": "為谷歌翻譯bug導致的某些操作崩潰創建了暫時的解決方案",
    "Removed seasonal Christmas cosmetics": "刪除了季節限定的聖誕裝飾品",


    "Celestial Tools and Skilling Outfits": "星空工具和專業服裝",
    "Level 90 Skilling Tools and Outfits": "90級專業工具與裝備",
    "Skilling Rare Materials":"專業稀有材料",
    "Butter Of Proficiency, Thread Of Expertise, and Branch of Insight. These materials can be found as rare drops from high-level material gathering and production actions. They can also be obtained by transmuting Holy, Arcane, Umbral, and Radiant equipment": "專業稀有材料：熟練之油、專業之線、洞察樹枝。這些材料除了可以透過高級材料採集和生產活動中發現。也可以透過轉化神聖、奧術、暗影和光輝裝備來獲得",
    "Celestial Tools": "星空工具",
    "New skilling tools that can be cheesesmithed using the rare materials and skilling essences": "星空工具：新的專業工具，可以使用稀有的材料和專業精華進行乳酪鍛造",
    "Skilling Outfits": "專業服裝",
    "New skilling body and legs equipment that can be tailored using the rare materials and skilling essences. These are designed to match the avatar outfits for each skill in the Cowbell Store": "新的專業上著和腿部下著，可以使用稀有的材料和專業精華定製。這些服裝旨在與牛鈴商店中各專業對應的頭像服裝相匹配",
    "Increased buyable task slots by 10. The new maximum number of task slots is now": "可購買的任務槽增加了 10 個，新的最大任務槽數現在為",
    "Lowered the sell value of skilling essences from 100 to 50. The previous 10x bulk alchemy change made skilling essences too effective for coinifying due to their low item level": "將專業精華的售價從 100 降低至 50。先前 10 倍批量煉金的變更使得專業精華由於物品等級較低而無法進行點金",
    "Added rare drop information to the item dictionary and improved the layout": "將稀有掉落物信息添加到物品詞典中，並優化了排版佈局",
    "Added catalyst information to Alchemy actions in the queued actions list": "佇列隊列中正在等待的煉金工作現在增加了使用的催化劑信息",
    "Combined enhancing target and protection start level into a single line in queued actions list": "現在強化目標與保護起始等級在同一行了",
    "Redesigned Holy item icons": "重新設計神聖物品的圖示",
    "Renamed Red Chef's Hat to Red Culinary Hat to avoid confusion with the new Chef's Outfit": "將紅色廚師帽(英文名)重新命名，以避免與新的廚師服裝混淆",
    "Fixed a number of minor UI issues": "修復了一些 UI 的問題",


    "Sun Dec": "星期日 12月",
    "Christmas": "聖誕節",
    "Christmas chat icon, avatar, and avatar outfits available in Cowbell Store until the first update in 2025. You can continue to use them after the event ends": "聖誕節新增聊天圖標、頭像和頭像服裝在牛鈴商店中可用，販售活動將持續至 2025年第一次更新。即便活動結束後仍可繼續使用",
    "Alchemizing raw materials and essences will now be done in bulk of 2, 5, or 10 instead of 1. Output and coin costs are multiplied by the same ratio": "煉金的原料和精華現在將批量完成 2、5 或 10 個而不是 1 個",
    "Catalysts will now only be consumed on success": "催化劑現在只會在成功時消耗",
    "Significantly increased Enhancing Essence output from decomposing higher-tier equipment": "分解強化過的裝備時所產出的強化精華產量將顯著增加",
    "Chance to receive Prime Catalyst from transmuting lower tier catalysts decreased from 5% to 4%. This is to ensure the cost of using Prime Catalyst is not lowered by too much due to the consume on success change": "透過轉換較低級的催化劑獲得主要催化劑的幾率從5%減少到4%。這是為了確保使用主要催化劑的成本不會因為成功變更的消耗而降低太多",
    "Increased minimum transmute cost per item from 10 to 50 coins": "每件物品的最低兌換成本從 10 個金幣增加到 50 個金幣",
    "Standardized appearance of text inputs": "文字輸入的標準化外觀",


    "Tue Nov": "星期二 11月",
    "Added new chat icons": "添加了新的聊天圖標",
    "Sunstone and Philosopher's Stone": "【太陽石】和【賢者之石】",
    "Transmute success rate decreased from 90% to": "轉換成功率從90%降到",
    "Transmute success rate decreased from 84% to": "轉換成功率從84%降到",
    "Transmute success rate decreased from 85% to": "轉換成功率從85%降到",
    "Added a stop button to the current action tab for Alchemy and Enhancing": "在【煉金】和【強化】的【當前操作】標籤中新增了停止按鈕",
    "Last selected action tab for Alchemy will be saved for when you revisit the page": "當您重新造訪該頁面時，將儲存最後選擇的煉金操作標籤",
    "Consumable slots should no longer display unusable slots as usable": "消耗品插槽不再將不可用的插槽顯示為可用",
    "Alchemy with a set action limit should now execute the correct number of actions, accounting for efficiency": "在有設定行動限制的情況下，【煉金】現在應該執行正確數量的行動，並同時考慮到效率",
    "Equipment stats will be correctly updated when a loadout is used in group combat": "當在團體戰鬥中使用配裝時，裝備統計數據將及時的更新",
    "This was a visual bug only": "這僅是一個視覺上的錯誤",
    "The remove button for Enhancing item selection should now function correctly": "用於【強化】項目選擇的刪除按鈕現在可以正常工作了",
    "Item linking from current actions for Alchemy and Enhancing should now work as intended": "當前針對【煉金】和【強化】的物品鏈接現在應該能按預期工作",
    "Current actions for Alchemy and Enhancing will now display correctly, even with delay in server response": "即使服務器回應有延遲，【煉金】和【強化】裡的【當前操作】現在也將正確顯示",


    "Alchemy allows you to transform items into other items using the actions Coinify, Decompose, or Transmute": "煉金可讓您使用 【點金】、【分解】或 【轉化】將物品轉換為其他物品",
    "Coinify lets you convert items into 500% of the item's sell price": "【點金】可讓您將商品轉換為商品售價的500%",
    "Decompose lets you break down items into their crafting materials or skilling essences": "【分解】可讓您將物品分解為其製作材料或專業精華",
    "Transmute lets you change items into other related items or rare uniques, such as the Philosopher's Stone": "【轉化】可讓您將物品轉換為其他相關物品或稀有的獨特物品，例如賢者之石",
    "Each alchemy action has varying success rates that can be boosted by catalysts and tea": "每一種煉金的操作都有不同的成功率，可以透過催化劑和茶來提高",
    "Unique items": "獨特物品",
    "Found from transmuting gems": "從轉換寶石中發現",
    "Found from transmuting various rare items and equipment": "透過轉換各種稀有物品和裝備發現",
    "Found from transmuting high-level food": "透過轉換高級食物後發現",
    "Found from transmuting high-level drinks": "透過轉化高級飲料後發現",
    "Found from transmuting lower-tier catalysts": "透過轉化低級催化劑發現",
    "For more information, check the Alchemy section in the Game Guide": "欲瞭解更多內容，請查看遊戲指南中的煉金專業部分",
    "Skilling Essences": "專業精華",
    "Skilling essences are a new type of resource": "專業精華是一種新型資源",
    "They can be passively obtained at a moderate rate from each non-combat skill": "它們可以從每個非戰鬥專業中以中等速率被動獲得",
    "They can be quickly obtained by decomposing various items in Alchemy": "它們可以透過煉金專業中分解各種物品來快速獲得",
    "They are now part of the recipe for brewing skill-level teas": "它們現在是沖泡各種專業茶的配方的一部分",
    "They can be used to craft various alchemy catalysts with the Crafting skill": "它們可以透過製作專業來製作各種煉金催化劑",
    "They will also serve a purpose in Skilling Expansion Part 2 for new Skilling equipment": "它們還將在專業擴充的第 2 部分中用於新的專業裝備",
    "Added new ultra tea and coffee that use crushed moonstone and sunstone": "添加了使用碎月光石和碎太陽石的究級茶和咖啡",
    "Skilling-level tea now provides an extra efficiency bonus on top of the level bonus": "各種專業的茶現在除了等級獎勵之外還提供額外的效率獎勵",
    "New catalytic tea for boosting alchemy success rates": "新出的催化茶可提高煉金成功率",
    "New Equipment": "新裝備",
    "Ring/Earrings of Critical Strike": "''爆擊''戒指/耳環",
    "crafted with Sunstones": "用太阳石製作",
    "Philosopher's Ring/Earrings/Necklace": "''賢者''戒指/耳環/項鍊",
    "crafted with the Philosopher's Stone": "用賢者之石製作",
    "Gluttonous Pouch and Guzzling Pouch":"貪吃袋和暴飲袋",
    "buff food and drinks, respectively": "分別增益食物和飲料",
    "Alembic": "蒸餾器",
    "Gained Alchemy Efficiency and Alchemy level requirement. They will be automatically unequiped and placed in your inventory. They can be worn again once the level requirements are met":
        "現在多了煉金效率和煉金等級要求。它們將自動取消裝備並放入您的庫存中。達到等級要求後即可再次配戴",
    "Ring/Earrings of Threat": "''威脅''戒指/耳環",
    "Reworked into Ring/Earrings of Essence Find": "重新打造為''精華發現''戒指/耳環",
    "Ring/Earrings of Armor/Resistance": "''護甲''戒指/耳環跟''抗性''戒指/耳環",
    "Increased Armor/Resistance from 5 to": "護甲/抗性從 5 增加到",
    "Physical/Elemental Thorn increased from 9% to 10%. Resistances increased from 25 to 30. Threat increased from 75 to": "物理/魔法反傷從 9% 增加到 10%。抗性從 25 增加到 30。威脅值從 75 增加到",
    "Other Bulwarks": "其他盾牌",
    "Threat increased by about": "威脅值增加約",
    "Increased Cursed Bow ranged damage from 125% to": "咒怨弓的遠程傷害從 125% 增加到",
    "Royal Nature Robes": "''皇家自然''袍服/袍裙",
    "Adjusted to match other Royal Robes' Elemental Amplify and Cast Speed. Added Heal Amplify": "調整以配合其他皇家系列的元素增幅和施法速度並治療強化新增",
    "Reworked as a 0 cooldown ability": "施法的冷卻時間改為 0",
    "Damage ratio increased from 120% to": "傷害比例從 120% 增加到",
    "Evasion debuff decreased from 20% to": "閃避減益從 20% 降低至",
    "Cooldown decreased from 20s to 18s": "冷卻時間從 20 秒減少至 18 秒",
    "Damage ratio increased from 160% to": "傷害比例從 160% 增加到",
    "Elemental Thorn increased from 20% to": "魔法反傷從 20% 增加到",
    "Reduced coin drop rate from monsters from 100% to": "怪物的金幣掉落率從 100% 降至",
    "Added gem drops to dungeon chests": "為地牢寶箱添加了寶石掉落",
    "T95 equipment sell value increased": "T95裝備售價增加",
    "Pouches and dungeon keys sell value lowered to account for Coinify": "考慮到【點金】，袋子和地牢鑰匙的售價有所減少",
    "Reorganized header display and added secondary information for Alchemy and Enhancing actions": "調整了【煉金】和【強化】的介面,並添加了當前操作的訊息",
    "Updated Enhancing UI for better clarity and usability": "更新了強化界面的UI，提高了清晰度和實用性",
    "Save inventory category collapse state and last selected action tabs separately per character": "每個角色當前的行動以及庫存的折疊狀態會被個別保存",
    "Renamed the Enhancing building from Laboratory to Observatory and repurposed Observatory for Alchemy": "強化的房子從實驗室更名為天文台，實驗室將被用於煉金的房子",
    "Support clicking links in chat with a confirmation that can be disabled in settings": "支援點擊聊天中的連結並進行確認，可以在設定中停用該確認",
    "Added dates to chat timestamps for whispers": "為頻道中的私聊時間添加了日期顯示",
    "Fixed a bug where some custom name colors in chat disappeared temporarily on mobile": "修正了聊天中某些自訂名稱顏色在行動裝置上暫時消失的錯誤",
    "Removed seasonal Halloween cosmetics": "移除了季節限定商品 :【萬聖節】的裝飾",
    "Level bonuses will now consider partial levels from drinks": "等級獎勵現在將考慮飲料中的部分等級",


    "Wed Oct": "星期三 10月",
    "Halloween": "萬聖節",
    "Halloween chat icon, avatar, and avatar outfits available in Cowbell Store for 3 weeks. You can continue to use them after the event ends": "牛鈴商店新增萬聖節聊天圖標、頭像和頭像服裝，為期 3 周。即便活動結束後仍可繼續使用",
    "Fixed visual bug with loadout where combat triggers, equipment stats, or equipment buffs sometimes doesn't correctly sync after equipping loadout": "修復了配裝欄中的視覺錯誤，其中戰鬥觸發器、裝備資料或裝備增益有時在裝備配裝後未能正確同步",


    "Mon Sep": "星期一 9月",
    "Weaken changed from reducing enemy damage to reducing enemy accuracy. This will allow the effect to increase defense XP instead of reducing it": "特效從減少敵人傷害改為降低敵人準確度，解決因特效導致防禦經驗減少的問題",
    "Backend changes to test Steam integration (work in progress": "對後臺進行更改,以測試steam整合（正在進行中",


    "Sun Sep": "星期日 9月",
    "Griffin Bulwark": "獅鷲盾",
    "Cheesesmithed with Griffin Talon from Chimerical Den": "用來自奇幻洞穴的獅鷲之爪打造而成",
    "new item": "新物品",
    "Arcane Reflect": "奧術反射",
    "Acquired from Enchanted Fortress": "從秘法要塞獲得",
    "Experience gained from healing increased by": "治療獲得的經驗增加了",
    "Dungeon keys are now split into entry keys and chest keys. Entry keys are crafted using the same resources from the original key recipe, along with some coins. Chest keys require only the key fragments from the original recipe. All existing dungeon keys are converted into chest keys, with a refund of the difference in resource cost per key. Unopened dungeon chests will receive a free chest key per chest. This change allows players to run a larger number of dungeons more easily with a lower entry cost":
        "地牢鑰匙現在分為入口鑰匙和寶箱鑰匙。入口鑰匙使用原始鑰匙配方中的相同資源以及一些金幣製作。寶箱鑰匙僅需要原配方中的鑰匙碎片。所有現有的地牢鑰匙將轉換為寶箱鑰匙，並按每把鑰匙退還資源差價。未開啟的地牢寶箱將每個寶箱獲得一把免費的寶箱鑰匙。此更改使玩家更容易以更低的進入成本進行更多的地牢探索",
    "Keys and key fragments are placed into separate item categories in both the inventory and marketplace": "鑰匙和鑰匙碎片在庫存和市場中被分配到不同的物品類別",
    "Added an option for loadout to ignore warnings about missing items": "增添允許配裝關閉【消耗品不足】的警告的選項",


    "Thu Sep":"星期四 9月",
    "Loadouts": "配裝",
    "Loadouts allow you to save your current equipment, consumables, and abilities to be automatically loaded later with actions": "配裝允許你保存當前的裝備、消耗品和技能，稍後可通過操作自動載入",
    "Loadouts can be tied to a single skill or \"All Skills.\" Selecting \"All Skills\" will only save equipment": "配裝可以綁定到單一專業或“所有專業”。選擇“所有專業”時只會保存裝備",
    "Setting a loadout as default will auto-select the loadout when choosing any action in the skill(s) the loadout is associated with": "將某個配裝設置為默認時，在選擇與該配裝關聯的專業的任何操作時，會自動選擇該方案",
    "Each character gets 2 free loadout slots, which can be upgraded in the Cowbell Store": "每個角色有2個免費的配裝槽位，可以在牛鈴商店中升級",
    "Condense key count messages in dungeons into a single message": "將地牢中的鑰匙數量資訊壓縮成一條消息",


    "Fri Aug": "星期五 8月",
    "Added a third character slot for players who want to play an additional character. You are still limited to one Standard character":
        "新增第三個角色槽位，供希望玩額外角色的玩家使用。但標準角色仍受限於1個。",
    "Enabled parties to change combat zones": "允許隊伍更改戰鬥區域",
    "Increased the friend and block list limits from 50 to":
        "好友和黑名單列表的上限從50增加到",
    "Expanded the guild notice maximum length from 800 to 1500 characters":
        "公會公告的最大長度從800個字元擴展到1500個字元",
    "significantly increased smash accuracy and damage. Added threat level":
        "顯著提高了鈍擊精準和傷害，並增加了威脅等級。",
    "Increased Nature's Veil drop rate at Luna Empress from 0.25% to":
        "將月神之蝶的自然菌幕(群體)掉落率從0.25%提高到",
    "Decreased low-tier key fragment drop rate by":
        "低級鑰匙的掉落率降低了",
    "The number of dungeon keys each party member has will now be displayed in chat at the start of each dungeon run":
        "每個隊員擁有的地牢鑰匙數量將會在每次地牢運行開始時在聊天中顯示",
    "Remaining consumables will be displayed under the Stats tab when inspecting other players in battle":
        "在戰鬥中檢查其他玩家時，剩餘消耗品將會在'統計'標籤下顯示",
    "Equipment in profiles will always be visible to party members":
        "個人資料中的裝備始終對隊伍成員可見",
    "Updated icons for staffs and royal robes to improve differentiation between elements":
        "更新了法杖和皇家袍服的圖示，提高元素之間的區分度",
    "Implemented some accessibility improvements for screen readers":
        "實施了一些螢幕閱讀器的可訪問性改進",
    "Updated rules regarding the use of English-only to be limited to General chat":
        "更新了關於使用英語的規則，常規頻道僅限使用英語，其他頻道不限",
    "Added an experimental AI-based automod":
        "添加了一個實驗性的基於AI的自動審查系統",
    "Implemented Kongregate integration in preparation for release on the platform":
        "實施了Kongregate平臺的集成，為在該平臺上的發佈做準備",


    "Avatars, Dungeon Tokens, and More": "頭像、地牢代幣等",
    "Thu Jul": "星期四 七月",
    "Avatars and Outfits": "頭像和服裝",
    "Avatars and outfits have been added to the Cowbell Store. They will appear in your profile, party, and group combat": "頭像和服裝已添加到牛鈴商店。它們將出現在你的個人資料、隊伍和群體戰鬥中",
    "Located in the navigation bar under your skills": "位於巡覽列——戰鬥專業下面",
    "The General Shop sells level 1 weapons and tools for a small amount of coins": "普通商店出售1級武器和工具，價格為少量金幣",
    "The Dungeon Shop sells essences, dungeon materials, and back-slot equipment for dungeon tokens": "地牢商店出售精華、地牢材料和背部裝備，價格為地牢代幣",
    "Dungeons will now drop a mix of dungeon tokens and rare materials": "地牢現在將掉落混合的地牢代幣和稀有材料",
    "Parties can optionally be private. They can also be linked into chat for inviting other players": "隊伍可以選擇設為私人隊伍，並且可以連結到聊天中邀請其他玩家",
    "Guild member limit increased from 15 + 0.2 * GuildLevel to 25 + 0.25 * GuildLevel": "公會成員上限從15 + 0.2 * 公會等級增加到25 + 0.25 * 公會等級",
    "Equipped abilities now display under the Equipment tab when viewing player profiles": "在查看玩家資料時，已裝備的技能現在會顯示在裝備選項卡下",
    "Task Rings have been transformed into Task Badge which now go into the new trinket equipment slot": "任務戒指已轉變為任務徽章，現在放入新的飾品裝備槽",
    "Different dungeon back slot items can be used as enhancing protection for each other": "不同地牢披風現在可以互為強化保護",
    "Equipment slots have been reorganized": "裝備槽已重新佈局",
    "An Overview tab has been added to profiles, displaying avatar, character age, and other information": "個人資料中增加了一個概覽選項卡，顯示頭像、角色年齡等資訊",
    "You can now view and change consumables and abilities on the My Party tab in the Combat page": "現在可以在戰鬥頁面的“我的隊伍”選項卡中查看和更改消耗品和技能",
    "Party roles are color-coded so they are easier to distinguish between": "隊伍角色有顏色編碼，以便更容易區分",


    "combat drop rate increased from 5% to": "戰鬥掉落率從5%增加到",
    "ability haste decreased from 10 to": "技能急速從10減少到",
    "Griffin Tunic/Chaps": "獅鷲皮衣/皮褲",
    "melee accuracy increased from 8%/6% to": "近戰準確度從8%/6%增加到",
    "healing amplify increased from 20% to": "治療增幅從20%增加到",
    "auto attack damage increased from 0% to": "自動攻擊傷害從0%增加到",
    "ability haste increased from 4 to": "技能急速從4增加到",
    "ranged damage increased from 120% to": "遠程傷害從120%增加到",
    "elemental penetration increased from 0 to 10%, magic damage decreased from 6% to 4%. Recipe now include 1 Watchful Relic": "元素穿透從0增加到10%，魔法傷害從6%減少到4%。配方現在包括1個警戒聖物",
    "armor penetration increased from 0 to 10%, melee accuracy decreased from 40% to 25%, melee damage increased from 15% to 20%. Recipe now include 2 Gobo Defenders": "護甲穿透從0增加到10%，近戰準確度從40%減少到25%，近戰傷害從15%增加到20%。配方現在包括2個哥布林防禦者",
    "healing increased from 40 + 25% magic damage to 40 + 30% magic damage": "治療量從40 + 25%魔法傷害增加到40 + 30%魔法傷害",
    "healing decreased from 30 + 25% magic damage to 30 + 20% magic damage": "治療量從30 + 25%魔法傷害減少到30 + 20%魔法傷害",
    "speed buff increase from 3% to": "速度增益從3%增加到",
    "Taunt and Provoke": "嘲諷和挑釁",
    "cooldown decrease from 65s to 60s. Duration increase from 60s to 65s": "冷卻時間從65秒減少到60秒。持續時間從60秒增加到65秒",
    "previously backwards due to bug": "之前由於錯誤導致反向",
    "Penetrating Strike and Penetrating Shot": "穿透打擊和穿透射擊",
    "mana cost set to": "MP消耗設定為",
    "previously incorrectly set to": "之前設定錯誤為",
    "Swiftness Coffee and Channeling Coffee": "迅捷咖啡和吟唱咖啡",
    "Speed buff increased from 10% to": "速度增益從10%增加到",
    "magic level decreased by 20, Fireball level increased by": "魔法等級減少20，火球術等級增加",
    "elemental resistances increased by": "元素抗性增加",
    "ranged level decreased by 20, Precision level decreased by 10, magic evasion increased by": "遠程等級減少20，精確等級減少10，魔法閃避增加",

    "Fixed a rare bug in group combat that caused battle ending logic to repeat multiple times and spawn extra invisible monsters": "修復了一個罕見的組隊戰鬥錯誤，該錯誤導致戰鬥結束邏輯重複多次並生成額外的隱形怪物",
    "Correctly handle a rare error when using the task shop that could crash server": "正確處理使用任務商店時可能導致伺服器崩潰的罕見錯誤",
    "Correctly save auto-kick option in parties": "正確保存隊伍中的自動踢人選項",


    "Melee and ranged damage are considerably lower than magic. Melee and ranged weapons have been moderately buffed to result in an overall increase of 5-7% in damage":"近戰和遠程傷害相較魔法有點低了。現在對近戰和遠程武器進行適度增強，總體傷害增加了5-7%。",
    "Reduced attack interval on crossbows from 4s to 3.6s and on bows from 3.5s to 3.2s":"弩的攻擊間隔從4秒減少到3.6秒，弓的攻擊間隔從3.5秒減少到3.2秒。",
    "Increased damage bonus on melee weapons (except bulwarks) by":"近戰武器（盾牌除外）的傷害加成增加了",
    "Increased drop sources of Quick Aid and Rejuvenate":"增加了快速治療和群體治療的技能書掉落來源。",
    "Added Rejuvenate to Luna Moths (Normal":"在月神之蝶（普通）中添加了群體治療技能書的掉落。",
    "Added Quick Aid to Novice Sorcerers (Elite) and Infernal Imps (Normal":"在新手巫師（精英）和地獄小鬼（普通）中添加了快速治療技能書的掉落。",

    "Added chat icons":"添加了聊天圖標。",
    "Bamboo, Golden Marketplace, Golden Biceps":"竹子，黃金市場，黃金二頭肌                                                       -------------以前的補丁不想翻譯了，感興趣自行閱讀-------------",


    "New combat dungeons": "新的戰鬥地下城",
    "Chimerical Den, Sinister Circus, and Enchanted Fortress": "奇幻洞穴、邪惡馬戲團和秘法要塞",
    "Dungeons consist of multiple waves of higher tier elite monsters as well as unique bosses": "地下城由多波高等級精英怪物以及獨特的首領組成",
    "You can enter with parties of up to five players, each required to have a key. Failing or leaving the dungeon will not consume the key": "最多可與五名玩家組隊進入，每人需要一把鑰匙。失敗或離開地下城不會消耗鑰匙",
    "Dungeon keys are crafted from key fragments, which are dropped by bosses in regular combat zones. Elite bosses have a much higher chance to drop key fragments": "地下城鑰匙由鑰匙碎片製作，碎片由常規戰鬥區的首領掉落。精英首領掉落鑰匙碎片的幾率更高",
    "You will not automatically respawn after dying in a dungeon. You can only be revived by an ally. If all party members are dead, the dungeon will restart at wave": "在地下城中死亡後不會自動復活。只能由隊友復活。如果所有隊員都死亡，地下城將從波數重置",
    "New abilities and items": "新技能和物品",
    "abilities, 2 melee weapons, 2 ranged weapons, and many other pieces of equipment or materials that can be looted from dungeon chests": "個技能、2件近戰武器、2件遠程武器以及許多其他可從地下城寶箱中獲取的裝備或材料",
    "View drop rates by clicking the item dictionary option on the chests that appear under each dungeon": "通過點擊每個地下城下出現的寶箱上的物品詞典選項查看掉落率",
    "New back slot": "新的背部裝備欄",
    "untradable capes/quiver that can be found from dungeon chests. Back slot items also have a 5x enhancement bonus, the same as jewelry": "種不可交易的斗篷/箭袋可從地下城寶箱中獲得。背部裝備也有與珠寶相同的5倍強化加成",
    "New earrings of threat and ring of threat can be crafted with star fragment and amber and increases your base threat stat": "新的威脅耳環和威脅戒指可以用星光碎片和琥珀製作，增加你的基礎威脅屬性",
    "Legacy ironcow can now party with regular ironcow": "傳統鐵牛現在可以與常規鐵牛組隊",
    "Party auto-kicking idle members who are not ready is now an optional setting": "自動踢出未準備的閒置成員現在是一個可選設置",
    "Decreased elite zone combat drop rate buff to match that of the experience buff. This is due to key fragments being a new high-value drop that primarily come from elite bosses": "降低精英區戰鬥掉落率增益，以匹配經驗增益。這是因為鑰匙碎片作為新的高價值掉落物主要來自精英首領",
    "Adjusted all magic staffs to have 3.5s attack interval but with -50% auto attack damage. This allows abilities to be used more frequently between auto attacks": "調整了所有魔杖的攻擊間隔為3.5秒，但自動攻擊傷害減少50%。這允許在自動攻擊之間更頻繁地使用技能。",
    "Increase Water Strike and Fireball damage from 55% to 60%. Decrease level bonus from 0.55% to": "將水擊和火球的傷害從55%提高到60%。將等級加成從0.55%降低到",

    "Added 4% ranged damage to Sighted Bracers": "為瞄準護腕增加了4%遠程傷害",
    "Decreased water amplify on Marine Tunic from 30% to 25% and on Marine Chaps from 24% to": "降低了海洋皮衣的水增幅從30%到25%，以及海洋皮褲的水增幅從24%到",
    "Increased threat buff on taunt from 200% to 250% and on provoke from 400% to": "增加了嘲諷的威脅增益從200%到250%，以及挑釁的威脅增益從400%到",
    "Increased accuracy buff on Precision from 30% to": "增加了精確的準確性增益從30%到",
    "Loot container drop rates are now part of the item dictionary": "戰利品容器掉落率現在是物品詞典的一部分",
    "Renamed the ability Pierce to Impale to avoid confusion with the new piercing effect": "將技能“Pierce”重命名為“Impale”以避免與新的貫穿效果混淆",
    "Added shine to golden chat icons that did not have it previously": "為以前沒有閃光效果的金色聊天圖示添加了閃光",


    "Slightly reduced Rabid Rabbit damage": "略微減少了瘋魔兔的傷害",
    "Decreased Dodocamel Plume drop rate from 20% to 10% (This was a math error I made; they are supposed to require an average of 60 chests to craft": "將渡駝之羽的掉落率從20%降低到10%（這是我犯的數學錯誤；它們平均需要60個寶箱才能製作",
    "Decreased drop rate of full items (excluding capes) from dungeon chests by half": "將地牢寶箱中完整物品的掉落率減少一半（不包括斗篷）",
    "Added 2% chance to get back a dungeon key from dungeon chests": "增加了2%的幾率從地牢寶箱中找回地牢鑰匙",
    "Removed dungeon bosses from being possible task monsters. If you already have one, it should still work, but the \"Go\" button is broken": "將地牢首領從可能的任務怪物中移除。如果你已經有一個，它仍然可以使用，但\"前往\"按鈕是壞的",
    "Prevented some players from getting stuck in a party after server updates": "防止了一些玩家在伺服器更新後卡在隊伍中的問題",

};

//3.3 尚未整理
let tranOrganize = {

    "Lootboxes": "寶箱",
    "Member Slots":  "成員數量",

};

//4.0 模擬器
let tranEmulator = {
    Neck: "項鍊",
    Player: "玩家",
    "House Rooms": "房子",
    "Drop Prices": "掉落價格",
    "Trigger": "",
    "Current Assets": "流動資產",
    Networth: "淨資產",
    "Price settings": "價格設置",
    "Consumable Prices": "消耗品價格",
    "Ask": "收購價",
    "Bid": "採購價",
    "SO": "左",
    "BO": "右",
    Trigger: "觸發條件",
    "Start Simulation":"開始模擬",
    "save": "保存",
    "Dark Mode": "黑暗模式",
    Parry: "招架",
    "Simulation Results":"模擬結果",
    "Kills per hour": "每小時擊殺數",
    "Time spent on boss": "花費在BOSS上的時間",
    "Deaths per hour": "每小時死亡次數",
    "XP per hour": "每小時經驗獲取",
    "HP Spent per hour": "每小時損失的HP",
    "Consumables used per hour": "每小時使用的消耗品",
    "Mana used per hour": "每小时消耗的MP",
    "Casts/h": "施法/小時",
    "Health restored per second": "每秒恢复的HP",
    "Mana restored per second": "每秒恢复的MP",
    "Damage Done": "造成的傷害",
    "Damage Taken": "受到的傷害",
    "Source": "來源",
    "Profit": "利潤",
    Expense: "費用",
    "No RNG Profit": "正常期望利潤",
    "Total": "總計",
    "Hitchance": "命中率",
    "Mayhem": "混亂",
    "Critical Damage Bonus": "爆擊傷害加成",
    "Task Damage Bonus": "任務傷害加成",
    "Experience Rate": "經驗倍率",
    "Pierce": "穿透",
    "zone": "區域",
    "Select Players": "選擇玩家",
    "Sim All Zones": "模擬所有區域",
    "Sim Dungeon": "模擬地下城",
    "Simulation Settings": "模擬設定",
    "Expenses": "支出",
    "Revenue": "收益",
    "No RNG Revenue": "正常期望收益",
    "No RNG Drops": "正常期望掉落",
    "Create": "創建",
    "solo": "單人",
    "Import set here for Solo": "導入單刷設定",
    "OR": "或",
    "Equipment Sets": "套用設定",
    "Import/Export": "導入/導出",
    "Get Prices": "獲取價格",
    "Edit Prices": "修改價格",
    "Import": "導入",
    "Import solo/group": "導入 單人/團隊",
    "Export Group/Solo": "導出 團隊/單人",
    "Import / Export Set": "導入/導出 設定",
    "Regen": "恢復",
    "Ran out of mana": "MP耗盡",
    "Encounters": "遭遇次數",
    "Add condition": "新增條件",
    "Set to default": "設定為預設值",
    "Configure Trigger": "設定觸發器",
    "Refresh game page to update character set": "刷新遊戲頁面以更新角色陣容",
    Imported: "已導入",
    "Stamina": "耐力",
    "Intelligence": "智力",
    "Attack": "攻擊",
    "Power": "力量",
    "Defense": "防禦",
    "Ranged": "遠程",
    "Magic": "魔法",
    "days after": "天后",
    "Forever": "永不",
    "Import / Export Set": "導入/導出 設定",
    "Group Combat": "團隊",
    "Stamina to level": "耐力",
    "Intelligence to level": "智力",
    "Attack to level": "攻擊",
    "Power to level": "力量",
    "Defense to level": "防禦",
    "Ranged to level": "遠程",
    "Magic to level": "魔法",
    "Mana Run Out": "法力耗盡",
    Fury: "狂怒",

}

//5.0 插件類漢化
let tranPlugins = {
    //------------------/ 食用工具
    "Edible Tools": "食用工具",
    "Total Revenue": "總計價值",
    "Daily Revenue": "每日收入",
    "Expected Revenue": "期望產值",
    "NoRNG Daily": "期望日入",
    "Expected Daily": "期望日利",
    "Ranged EXP": "遠程經驗",
    "Intelligence EXP": "智力經驗",
    "Attack EXP": "攻擊經驗",
    "Dispatch": "出警",
    "Loot": "分贓",
    Aura: "光環",
    "Chest Records": "開箱紀錄",
    "HP Regen/min": "每分回血",
    "MP Regen/min": "每分回藍",
    "Waiting for stable data": "等待數據穩定",
    "Clear Data": "清除數據",
    "Toggle Display": "切換顯示",

    /*
    // 銀河牛牛數據庫
    "Milk Way Idle Database": "銀河牛牛數據庫",
    "Order ID": "訂單ID",
    "Character ID": "角色ID",
    "Filled Qty": "已交易數量",
    "Last Updated": "更新時間",
    "Delete": "刪除",
    "Chest Data": "開箱數據",
    "Dungeon Tools": "地下城助手",
    "Dungeon Settings": "地下城設置",
    "Time (minutes": "用時(分鐘",
    "Entry Key Cost (Ask": "入口鑰匙成本(收購價",
    "Entry Key Cost (Bid": "入口鑰匙成本(採購價",
    "Chest Key Cost (Ask": "開箱鑰匙成本(收購價",
    "Chest Key Cost (Bid": "開箱鑰匙成本(採購價",
    "Food Cost (per day": "食物成本(每天",
    "Calculate Profit": "計算利潤",
    "Local Storage": "本地緩存",
    "Plugin Settings": "插件設置",
    "": "",
    "": "",
    "": "",
    "": "",
    */

    //------------------/MWItool
    "Use orange as the main color for the script":
    "將橙色設為腳本的主要顏色。",
    "Top left": "左上角",
    "Estimated total time of the current action, estimated complete time":
    "當前動作的預計總時長、預計完成時間。",
    "Action panel":  "動作面板",
    "Estimated total time of the action, times needed to reach a target skill level, exp/hour":
    "動作的預計總時長、達到目標專業等級所需的次數、每小時經驗值。",
    "Quick input numbers. [Depends on the previous selection": "快速輸入次數 [取決於上一項選擇",
    "Overall profit of the foraging maps with multiple outcomes. [Depends on the previous selection":
    "具有多種產出的採集地圖的綜合收益。[取決於上一項選擇",
    "Top right": "右上角",
    "Current assets (Items with at least 2 enhancement levels are valued by enchancing simulator":
    "流動資產（強化等級至少為 +2 的物品按強化模擬器估值",
    "Below inventory search bar": "倉庫搜索欄下方",
    "Inventory and character summery. [Depends on the previous selection":
    "倉庫和角色信息總結。[取決於上一項選擇",
    "Sort inventory items. [Depends on the previous selection":
    "對倉庫物品進行排序。[取決於上一項選擇",
    "Profile panel": "人物面板",
    "Build score": "戰力分數",
    "Item tooltip": "物品懸浮提示",
    "hours average market price": "小時市場平均價格",
    "Production cost and profit. [Depends on the previous selection":
    "生產成本和利潤。[取決於上一項選擇",
    "HP/MP consumables restore speed, cost performance, max cost per day":
    "HP / MP消耗品恢復速度、性價比、每天最大消耗成本。",
    "Top right": "右上角",
    "Alert message when market price data can not be fetched":
    "無法獲取市場價格數據時的警告信息。",
    "Left sidebar": "左側邊欄",
    "Percentages of exp of the skill levels": "專業等級的經驗百分比",
    "Battle info panel": " 戰鬥信息面板",
    "click on player avatar during combat":  "戰鬥時點擊玩家頭像",
    "Encounters/hour, revenue, exp": "每小時戰鬥次數、收入、經驗",
    "Top right corner of equipment icons": "裝備圖標右上角",
    "Equipment level": "裝備等級",
    "Top right corner of key/fragment icons": "鑰匙 / 鑰匙碎片圖標右上角",
    "Corresponding combat zone index number. [Depends on the previous selection":
    "對應的戰鬥區域編號。[取決於上一項選擇",
    "Filter by equipment level, class, slot":
    "按裝備等級、職業、裝備部位篩選。",
    "Tasks page": "任務頁面",
    "Combat zone index number": "戰鬥區域編號",
    "Combat zones page": "戰鬥區域選擇頁面",
    "Combat zone index number": "戰鬥區域編號",
    "Item dictionary of skill books":"技能書物品詞典面板",
    "Number of books needed to reach target skill level":  "達到目標技能等級所需的技能書數量",
    "Left sidebar": "左側邊欄",
    "Links to 3rd-party websites, script settings": "第三方工具網站鏈接、腳本設定鏈接",
    "Queued actions panel at the top": "上方動作隊列面板",
    "Estimated total time and complete time of each queued action": "隊列中每個動作的預計總時長和完成時間",
    "Tooltip of equipment with enhancement level": "帶有強化等級的裝備懸浮提示",
    "Enhancing simulator calculations": "強化模擬器計算結果",
    "Top": "頁面上方",
    "Alert message when combating with production equipments equipted, or producing when there are unequipted corresponding production equipment in the inventory":
    "戰鬥時穿著生產裝備，或進行生產時倉庫中有未裝備的相應生產裝備時的警告信息",
    "Browser notification": "瀏覽器通知",
    "Action queue is empty": " 動作隊列為空",
    "Works only when the game page is open":  "僅在游戲頁面打開時有效",
    "Automatically input price with the smallest increasement/decreasement when posting marketplace bid/sell orders":  "發布市場買入 / 賣出訂單時自動輸入最小加價 / 降價金額",
    "Bottom of player avatar during combat": "戰鬥時玩家頭像下方",
    "Floating window during combat": "戰鬥時懸浮視窗",
    "DPS chart. [Depends on the previous selection": "每秒傷害（DPS）圖表圖表。[取決於上一項選擇",
    "DPS chart transparent and blur background. [Depends on the previous selection": "每秒傷害（DPS）圖表，背景透明且虛化。[取決於上一項選擇",
    "MWITools\u672c\u8eab\u5f3a\u5236\u663e\u793a\u4e2d\u6587 MWITools always in Chinese": "MWITools本身强制顯示中文",
    "Accesss Github with proxy": "給國內用戶加一個proxy來訪問github的dns",


    //------------------/ Ranged Way Idle
    "Task expected value": "任務期望收益",

    // 戰鬥功能
    "Combat Functions": "戰鬥功能",
    "Some settings may not take effect until page refresh. If not working, or console is spammed with errors, try updating this script or its pre-requisites": "部分設定可能需要刷新頁面才能生效。如果完全無效，或者控制臺大量報錯，請嘗試更新本插件或前置插件",
    "Notify when a character dies in combat": "戰鬥中角色死亡時，發出通知",
    "Minimum cooldown time for notifying when a character dies in combat": "角色死亡通知冷卻時間",
    seconds: "秒",

    // 聊天功能
    "Message Functions": "聊天功能",
    "Notify when chat messages contain preset keywords": "聊天消息含有關鍵詞時，發出聲音提醒",
    "Chat message notify sound volume": "聊天消息聲音提醒音量",
    "Use regex to match chat messages": "聊天消息採用正則匹配",
    "Filter out chat messages sent by yourself": "不提醒自己發送的聊天消息",

    // 遊戲訊息設置
    "Game Info": "遊戲訊息設置",
    "Update localStorage market price while click in market": "更新localStorage中的市場價格",
    "Show task expected value": "顯示任務期望收益",
    "requires TaskManager": "依賴 食用工具",
    "Track leaderboard data": "跟蹤排行榜數據",

    // 遊戲介面設置
    "Game UI": "遊戲介面設置",
    "Auto-click task sort button": "自動點擊任務排序按鈕",
    "Show market API update time": "顯示市場API更新時間",
    "Force update market API button": "強制更新市場API按鈕",
    "Disable queue upgrade buttons to prevent redirect to cowbell shop": "禁用各處隊列升級按鈕，以防跳轉至牛鈴商店",
    "Disable action queue bar display": "禁用行動隊列提示框顯示",
    "Hide some buttons in left sidebar": "隱藏左側邊欄的部分按鈕",
    "Allow hiding train rubbish in inventory": "允許隱藏背包里的火車垃圾",
    "with no enhancement level": "無強化等級的乳酪、木製、皮革或布料裝備等",
    "Always hide train rubbish in inventory": "總是自動隱藏背包里的火車垃圾",
    "Add watermark to whole page to prevent stealing your show-off image": "为整个页面添加水印，以防止他人偷图",
    "Watermark text": "水印文字",
    "Quick copy itemHrid": "快速复制itemHrid",

    // 掛單功能設
    "Listing Functions": "掛單功能設置",
    "Save listing info to localStorage": "保存掛單信息到localStorage",
    "Max days to save listing info to localStorage": "掛單信息本地保存時間（天）",
    "Show total listing funds": "顯示市場掛單的",
    "purchase prepaid coins/sell result coins/unclaimed coins": "總購買預付金/出售可獲金/待領取金額",
    "Precise of total listing fund": "顯示市場掛單的總購買預付金/出售可獲金/待領取金額的精度",
    "Show listing price/create time": "顯示各個掛單的價格、創建時間信息",
    "Try to compatible listing sort": "嘗試兼容掛單排序",
    "Precise of listing price": "各個掛單的購買預付金/出售可獲金的價格精度",
    "Show listing lifespan instead of create time": "顯示掛單已存在時長，而非創建的時刻",
    "Notify when a listing is filled": "掛單完成時，發出聲音提醒",
    "Listing filled notify sound volume": "掛單完成聲音提醒音量",
    "Linearly estimate listing create time by listing ID": "依據掛單ID線性估算掛單創建時間",
    "Color listing create time by accuracy (green for high accuracy). while this option is true, it overrides the next option setting": "依據精度為掛單創建時間著色（越偏向綠色 精度越高）該項為真時，覆蓋下一選項設定",
    "Color listing create time by lifespan": "依據存在時間為掛單創建時間著色",
    "green for short lifespan": "越偏向綠色 創建時間越短",
    "Show estimate listing create time by lifespan": "估算結果顯示為掛單已存在時長，而非創建的時刻",

    // 其他設置
    "Other Functions": "其他設置",
    Language: "語言",
    "Buy me a coffee": "贊助作者",
    "Mourn for Magic Way Idle": "在控制台為Magic Way Idle默哀",
    "Optimize document observer to reduce performance overhead": "優化document監聽器，減少性能開銷",
    "may have bugs, please disable this option if any problem occurs": "可能有bug，出現問題請關閉",
    "Print WebSocket messages": "列印WebSocket消息",
    "not recommended": "不推薦打開",
    "Add chat message keyword": "添加聊天消息監聽關鍵詞",

    // 市場
    "Purchase prepaid": "購買預付金",
    "Unclaimed": "待領取金額",
    "Sell result": "出售可獲金",
    "Market API update time": "市場API更新時間於",
    "Top order price": "左一/右一 價格",
    "Purchase prepaid / Sell result": "購買預付金/出售可獲金",
    "Record current data": "記錄當前排行榜數據",
    "Delete local data": "刪除本地數據",
    "No local data recorded": "無本地數據記錄",
    "Estimated create time": "估計創建時間",
    "Due to the leaderboard update every 20 minutes, speed and catchup time may be inaccurate. This is for reference only":
        "由於排行榜數據每20分鐘記錄一次，增速和超越時間有誤差，僅供參考",

};

//6.0 強化追蹤器
let tranEnchant = {
    "Sound Enabled": "聲音已開啟",
    "Sound Disabled": "聲音已關閉",
    "Enhancement Tracker": "强化追踪器",
    "Enhancement Tracker Enabled": "强化追踪器已開啟",
    "Begin enhancing to populate data": "開始强化以填充數據",
    "Enhancement Tracker Hidden": "强化追踪器已隐藏",
    "Enhancement Tracker Shown": "强化追踪器已顯示",
    "All session data cleared": "數據已清除",
    "Material Costs": "材料成本",
    "Session Duration": "強化時長",
    "Market data": "市場數據",
    "Prot": "保護",
    "Total XP Gained": "總獲得經驗",
    "Prots Used": "保護使用",
    "Total Attempts": "總強化次數",
    "XP/Hour": "XP/小時",
    "In Progress": "強化中",
    "Calculating": "計算中",
    Qty: "數量",
    Completed: "已完成",
    Fail: "失敗",
    Failed: "失敗",
    "undefined": "未定義",
    "undefined, Total": "未定義, 總計",
    "Total cost across all sessions": "總成本",


};

//7.0 戰鬥特效漢化
let transSpecialEffects = {
    // <-- MWI-Hit-Tracker-Canvas -->
    "MWI-Hit-Tracker Settings": "MWI-Hit-Tracker 設置",
    "Projectile Limit": "投射物數量限制",
    "Projectile Scale": "投射物縮放",
    "On-hit Effect Scale": "命中效果縮放",
    "Projectile Height Scale": "彈道高度比例",
    "Projectile Speed Scale": "彈道速度比例",
    "Shake Effect Scale": "震動效果",
    "Particle Effect Ratio": "粒子效果數量",
    "Particle Lifespan Ratio": "粒子效果持續時長",
    "Particle Effect Speed Ratio": "粒子效果初速度",
    "Projectile Trail Length": "彈道尾跡長度",
    "Projectile Trail Gap": "彈道尾跡間隔",
    "Original Damage Display": "原版傷害顯示",
    "Hit Area Scale": "命中範圍",
    "Minimum Gap Of Each Projectile Hit": "命中最小間距",
    "Damage Text Lifespan": "傷害文本持續時間",
    "Damage Text Scale": "傷害文本大小",
    "Damage Text Alpha": "傷害文本不透明度",
    "Damage Text Size Minimal": "傷害文本尺寸最小值",
    "Damage Text Size Limit": "傷害文本尺寸上限",
    "Show Self Regeneration": "顯示玩家被動回復效果",
    "Monster Dead Animation": "怪物死亡效果",
    "Monster Dead Animation Style": "怪物死亡效果樣式",
    "default": "默認",
    "Hp Bar Drop Delay": "血條掉落延遲",
    "Player 1 Color": "玩家1 顏色",
    "Projectile Style": "樣式",
    "Player 2 Color": "玩家2 顏色",
    "Player 3 Color": "玩家3 顏色",
    "Player 4 Color": "玩家4 顏色",
    "Player 5 Color": "玩家5 顏色",
    "Enemies Color": "敵人顏色",
    "Render FPS Limit": "渲染幀數限制",
    "Not accurate, restart required": "非精確，刷新生效",
    "Show FPS": "顯示幀數",

    // <!-- MWI-Hit-Tracker -->
    "Enable player #1 damage line": "啟用玩家#1傷害線",
    "Enable player #2 damage line": "啟用玩家#2傷害線",
    "Enable player #3 damage line": "啟用玩家#3傷害線",
    "Enable player #4 damage line": "啟用玩家#4傷害線",
    "Enable player #5 damage line": "啟用玩家#5傷害線",
    "Enable player #1 healing line": "啟用玩家#1治療線",
    "Enable player #2 healing line": "啟用玩家#2治療線",
    "Enable player #3 healing line": "啟用玩家#3治療線",
    "Enable player #4 healing line": "啟用玩家#4治療線",
    "Enable player #5 healing line": "啟用玩家#5治療線",
    "click to customize color": "點擊自定義顏色",
    "Enable enemies damage line": "啟用敵人傷害線",
    "Enable enemies healing line": "啟用敵人治療線",
    "Enable missed attack line": "啟用被閃避的攻擊線",
    "Effects extension": "特效擴展",
    "particle effects & Target shake on hit": "擊中時有粒子效果和目標震動",

};

//8.0 翻譯(暫放)

let trans_temporary = {


}


document.querySelectorAll('input').forEach(input => {
    if (tranEmulator[input.placeholder]) {
        input.placeholder = tranEmulator[input.placeholder];
    }
} );

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
    tranItemBox,
    tranMonster,
    tranMoopass,
    tranAchievements,
    tranOther,
    tranNews,
    tranPatch,
    tranOrganize,
    tranEmulator,
    tranPlugins,
    tranEnchant,
    transSpecialEffects,
    trans_temporary,
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


    // 排除不需要翻譯的
    for (const exclude of excludes) {
        if (exclude.toLowerCase() === text.toLocaleLowerCase()) {
            return text;
        }
    }

    // 排除不需要翻譯的(使用正則)
    for (const excludeReg of excludeRegs) {
        if (excludeReg.test(text)) {
            return text;
        }
    }

    // 排除不需要翻譯的(使用css選擇器)
    for (const excludeSelector of excludeSelectors) {
        if ((node.nodeName !== "#text" && node.matches(excludeSelector)) || (node.parentNode && node.parentNode.matches(excludeSelector))) {
            return text;
        }
    }

    // 消除後面空格
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

    if(!node.parentNode) { // 修復Loadout頁面導致腳本crash的問題
        return text;
    }

    // 阿茶的------之大佬潤筆
    // 煉金特例
    if (node?.parentNode?.parentNode?.classList.contains("SkillActionDetail_notes__2je2F") && node.parentNode.querySelector("svg")) {
        const firstLineTextNode = node.parentNode.childNodes[0];
        const secondLineTextNode = node.parentNode.childNodes[2];

        if (node === firstLineTextNode && /^Level\s+(\d+)/.test(firstLineTextNode.textContent)) {
            return "推薦";
        } else if (node === secondLineTextNode && node.textContent.match(/^\s*Recommended$/) && /^Level\s+(\d+)/.test(firstLineTextNode.textContent)) {
            const res = /^Level\s+(\d+)/.exec(firstLineTextNode.textContent);
            return "等級 " + res[1];
        }
    }

    if (node?.parentNode?.parentNode?.classList.contains("SkillActionDetail_notes__2je2F") && !node.parentNode.querySelector("svg")) {
        const text = node.textContent || "";
        if (/^Uses (2|10) items per action$/s.test(text)) {
            let res = /^Uses (2|10) items per action$/s.exec(text);
            return "每次消耗 " + res[1] + " 個物品 " ;
        }
    }


    // 強化特例
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

    // 翻譯裝備技能
    if (node.parentNode.matches('.EquipmentStatsText_uniqueStat__2xvqX')){
        //console.log(`翻譯裝備技能：${text}`);
        // Curse: On hit, increases enemy's damage taken by (\d+)% for 15s, stacking up to 5 times.
        if (/^Curse: On hit, increases enemy's damage taken by (\d+\.?\d*)% for 15s, stacking up to 5 times.?$/.test(text)) {
            let res = /^Curse: On hit, increases enemy's damage taken by (\d+\.?\d*)% for 15s, stacking up to 5 times.?$/.exec(text);
            return `災厄箭矢：每次命中時，使敵人受到的傷害增加${res[1]}%，持續15秒，最多疊加5次`;
        }
        // Pierce: On successful auto-attack, 25% chance to auto-attack next enemy. Can chain multiple times.
        if (/^Pierce: On successful auto-attack, (\d+)% chance to auto-attack next enemy. Can chain multiple times.?$/.test(text)) {
            let res = /^Pierce: On successful auto-attack, (\d+)% chance to auto-attack next enemy. Can chain multiple times.?$/.exec(text);
            return `連鎖箭矢：自動攻擊成功後，有${res[1]}%的機率自動攻擊下一個敵人，可連續觸發多次`;
        }
        // Parry: 10% chance to parry enemy's attack, avoiding damage and retaliating with an instant auto attack.
        if (/^Parry: (\d+\.?\d*)% chance to parry enemy's attack, avoiding damage and retaliating with an instant auto attack. Can also parry attacks targeting party members?$/.test(text)) {
            let res = /^Parry: (\d+\.?\d*)% chance to parry enemy's attack, avoiding damage and retaliating with an instant auto attack. Can also parry attacks targeting party members?$/.exec(text);
            return `王權反擊：${res[1]}%機率格擋敵人的攻擊，免疫本次傷害並立即自動攻擊一次，同時可以格擋針對隊友的攻擊`;
        }
        // Parry: Weaken: When attacked by enemy, reduce enemy's accuracy by 2% for 15s, stacking up to 5 times.
        if (/^Weaken: When attacked by enemy, reduce enemy's (accuracy|damage) by (\d+\.?\d*)% for 15s, stacking up to 5 times.?$/.test(text)) {
            let res = /^Weaken: When attacked by enemy, reduce enemy's (accuracy|damage) by (\d+\.?\d*)% for 15s, stacking up to 5 times.?$/.exec(text);
            return `噩夢纏繞：受到攻擊時，降低敵人${res[2]}%命中率，持續15秒，最多疊加5次`;
        }
        // Mayhem: Upon missing an auto-attack, 80% chance to auto-attack next enemy. Can chain multiple times.
        if (/^Mayhem: Upon missing an auto-attack, (\d+)% chance to auto-attack next enemy. Can chain multiple times.?$/.test(text)) {
            let res = /^Mayhem: Upon missing an auto-attack, (\d+)% chance to auto-attack next enemy. Can chain multiple times.?$/.exec(text);
            return `失准狂潮：自動攻擊未命中時，有${res[1]}%的幾率自動攻擊下一個敵人，並且可以連續觸發多次`;
        }
        // Fury: On hit, increases accuracy and damage by (\d+\.?\d*)% for 15s, stacking up to 5 times. Lose half stacks on miss.
        if (/^Fury: On hit, increases accuracy and damage by (\d+\.?\d*)% for 15s, stacking up to 5 times. Lose half stacks on miss.?$/.test(text)) {
            let res = /^Fury: On hit, increases accuracy and damage by (\d+\.?\d*)% for 15s, stacking up to 5 times. Lose half stacks on miss.?$/.exec(text);
            return `狂怒：每次命中時，提升${res[1]}%的精準度和傷害，持續15秒，最多疊加5次。未命中時，層數減半`;
        }
        // Ripple: On ability cast, 18% chance to reduce all ability cooldowns by 2s.
        if (/^Ripple: On ability cast, (\d+)% chance to reduce all ability cooldowns by 2s(?: and restore 10 MP)?\.?.?$/.test(text)) {
            let res = /^Ripple: On ability cast, (\d+)% chance to reduce all ability cooldowns by 2s(?: and restore 10 MP)?\.?.?$/.exec(text);
            // 检查是否包含 MP 恢复部分
            const hasMp = text.includes('and restore 10 MP');
            return `漣漪：釋放技能時，有${res[1]}%的機率使所有技能冷卻時間減少2秒${hasMp ? '並恢復 10 MP' : ''}`;
        }
        // Bloom: On ability cast, 40% chance to heal lowest HP% ally for 10+20% magic damage.
        if (/^Bloom: On ability cast, (\d+)% chance to heal lowest HP% ally for 10HP\+15% magic damage.?$/.test(text)) {
            let res = /^Bloom: On ability cast, (\d+)% chance to heal lowest HP% ally for 10HP\+15% magic damage.?$/.exec(text);
            return `綻放：釋放技能時，有${res[1]}%的機率為HP百分比最低的隊友治療10HP+15%魔法傷害`;
        }
        // Blaze: On ability cast, 25% chance to attack all enemies for 30% magic damage.
        if (/^Blaze: On ability cast, (\d+)% chance to attack all enemies for 30% magic damage.?$/.test(text)) {
            let res = /^Blaze: On ability cast, (\d+)% chance to attack all enemies for 30% magic damage.?$/.exec(text);
            return `熾焰：釋放技能時，有${res[1]}%的機率對所有敵人造成30%魔法傷害`;
        }

        console.error(`無法匹配裝備技能：${text}`);
        return text;
    }

    // 頻道英文到中文的映射
    const chats = {
        General: '國際',
    };

    // 商店英文到中文的映射
    const othershop = {
        General: '雜貨',
    };

    // 職位英文到中文的映射
    const titleMap = {
        Member: '成員',
        Leader: '會長',
        General: '將軍',
        Officer: '官員'
    };

        // 職位英文到中文的映射
    const titleBeginner = {
        Beginner: '初學者',
    };

    let originalText = text.trim(); // 確保 text 變數沒有前後空格

    // 檢查是否在頻道區域，確保 "General" 只在這裡翻譯為 "國際"
    if (node.parentNode.closest('.GamePage_chatPanel__mVaVt') ||
        node.parentNode.closest('.Chat_tabsComponentContainer__3ZoKe')) {
        if (originalText === 'General') { // ✅ 直接比對大小寫一致的 "General"
            return chats.General;
        }
    }

    // 檢查是否在商店區域，確保 "General" 只在這裡翻譯為 "雜貨"
    if (node.parentNode.closest('.NavigationBar_nav__3uuUl') ||
        node.parentNode.closest('.ShopPanel_tabsComponentContainer__3z6R4')) {
        if (originalText === 'General') { // ✅ 直接比對大小寫一致的 "General"
            return othershop.General;
        }
    }

    // 檢查是否在職位區域，確保 "General" 在這裡翻譯為 "將軍"
    if (node.parentNode.closest('.SharableProfile_overviewTab__W4dCV') ||
        node.parentNode.closest(".GuildPanel_membersTable__1NwIX")) {

        // 避免將 "General of" 錯誤翻譯
        let titles = Object.keys(titleMap); // ['Member', 'Leader', 'General', 'Officer']
        for (let title of titles) {
            let titleWithOf = title + ' of'; // 構建 "xxx of" 字串
            let index = originalText.indexOf(titleWithOf); // 查找職位首碼的位置

    // 如果找到了職位首碼
    if (index !== -1){
            let titleText = originalText.substring(index + titleWithOf.length).trim(); // 截取後面的文本
            return `${titleText} ${titleMap[title]}`; // 返回翻譯後的文本
        }
    }

    // 確保獨立 "General" 翻譯為 "將軍"
    if (originalText === 'General') {
        return titleMap.General;
        }
    }

    // 檢查是否在成就區域，確保 "Beginner" 只在這裡翻譯為 "初學者"
    if (node.parentNode.closest('.AchievementsPanel_achievementsContent__1ExnX') ||
        node.parentNode.closest('.AchievementsPanel_tierHeader__2GZkr')) {
        if (originalText === 'Beginner') { // ✅ 直接比對大小寫一致的 "Beginner"
            return titleBeginner.Beginner;
        }
    }

    // 翻譯欄位特例
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
    // 裝備Tooltips部位特例
    if (text === "Type: Back") {
        return `部位：背部`;
    }

    if (node.parentNode.matches('.Button_button__1Fe9z.Button_fullWidth__17pVU')){
        if (text.toLowerCase() === "back") {
            return `返回`;
        }
    }

    //特殊處理技能效果
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

    //特殊處理觸發器詳細資訊
    if ((node.nodeName !== "#text" && node.matches('[class^="CombatTriggersSetting_detail"] *')) || (node.parentNode && node.parentNode.matches('[class^="CombatTriggersSetting_detail"] *'))) {
        //My Wisdom Coffee Is Inactive
        if (/^My (.+) Is (.+)$/.test(text)) {
            let res = /^My (.+) Is (.+)$/.exec(text);
            return "我的 " + cnItem(res[1], node) + " 是 " + cnItem(res[2], node);
        }
    }

    // 戰鬥模擬器正則
    //"Stamina to level": "耐力",
    //"Intelligence to level": "智力",
    //"Attack to level": "攻擊",
    //"Power to level": "力量",
    //"Defense to level 124 takes": "防禦",
    //Ranged to level
    //Magic to level 101 takesl
    if (/^(Stamina|Intelligence|Attack|Power|Defense|Ranged|Magic) to level (\d+) takes$/.test(text)) {
        let res = /^(Stamina|Intelligence|Attack|Power|Defense|Ranged|Magic) to level (\d+) takes$/.exec(text);
        return "【" + cnItem(res[1], node) + "】 距 " + res[2] + " 尚需時間";
    }

    // "Set as the default loadout for All Skills": "将此配装设为【所有专业】的默认方案",
    if (/^(Set as the default loadout for) (.+)$/.test(text)) {
        let res = /^(Set as the default loadout for) (.+)$/.exec(text);
        return "設為【" + cnItem(res[2], node) + "】的默認方案";
    }

    // You have reached 32 Enhancing
    if (/^You have reached (\d+) (.+)$/.test(text)) {
        let res = /^You have reached (\d+) (.+)$/.exec(text);
        return "你已到達 " + cnItem(res[1], node) + " 級 " + cnItem(res[2], node);
    }

    // Currently 350 players in game
    if (/^Currently (\d+) players in game!$/.test(text)) {
        let res = /^Currently (\d+) players in game!$/.exec(text);
        return "目前有 " + res[1] + " 名玩家在遊戲中 !!!";
    }

    // You have 1 unread task
    if (/^You have (\d+) unread tasks?$/.test(text)) {
        let res = /^You have (\d+) unread tasks?$/.exec(text);
        return "你有 " + res[1] + " 個未讀任務";
    }

    // like "test (Elite)"
    if (/^(.+)(\s*)\((.+)\)$/.test(text)) {
        let res = /^(.+)(\s*)\((.+)\)$/.exec(text);
        return cnItem(res[1], node) + res[2] + "(" + cnItem(res[3], node) + ")";
    }

    // 打怪任务翻译（支持独自击败场景）
    if (/^Defeat ([\S ]+) (by yourself)$/.test(text)) {
        // 匹配带 "by yourself" 的情况：提取怪物名称，翻译为「独自击败 XXXX」
        let [_, monsterName] = /^Defeat ([\S ]+) by yourself$/.exec(text);
        return `獨自擊敗${cnItem(monsterName, node)}`;
    } else if (/^(Defeat)( [\S ]+)$/.test(text)) {
        // 原有逻辑：匹配不带 "by yourself" 的 Defeat 任务
        let [_, prefix, content] = /^(Defeat) (.+)$/.exec(text);
        return cnItem(prefix, node) + cnItem(content, node);
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

    // 測試服漢化
    // "Trainee Milking Charm"
    // "Basic Milking Charm"
    // "Advanced Milking Charm"
    // "Expert Milking Charm"
    // "Master Milking Charm"
    // "Grandmaster Milking Charm"
    /* 取消正則,否則這段代碼的物品會無法 (英 -> 中)映射到
    if (/^(Trainee|Basic|Advanced|Expert|Master|Grandmaster) (Milking|Foraging|Woodcutting|Cheesesmithing|Crafting|Tailoring|Cooking|Brewing|Alchemy|Enhancing|Stamina|Intelligence|Attack|Defense|Melee|Ranged|Magic) Charm$/.test(text)) {

        let rankMap = {
            "Trainee": "實習",
            "Basic": "基礎",
            "Advanced" : "高級",
            "Expert": "專家",
            "Master": "大師",
            "Grandmaster": "宗師"
        }
        let res = /^(Trainee|Basic|Advanced|Expert|Master|Grandmaster) (Milking|Foraging|Woodcutting|Cheesesmithing|Crafting|Tailoring|Cooking|Brewing|Alchemy|Enhancing|Stamina|Intelligence|Attack|Defense|Melee|Ranged|Magic) Charm$/.exec(text);
        return rankMap[res[1]] + cnItem(res[2], node) + "護符";
    }
    */

    // like "Add Queue #2"
    if (/^Add Queue #(\d+)$/.test(text)) {
        let res = /^Add Queue #(\d+)$/.exec(text);
        return "加入佇列 #" + res[1];
    }

    // 你離線了 xxx時間
    // 你已離線至當前上限 xxx時間
    // 处理两种离线相关文本情况
    if (/^(You were offline for|You made progress for)(.+)$/.test(text)) {
        let res = /^(You were offline for|You made progress for)(.+)$/.exec(text);
        return cnItem(res[1], node) + res[2];
    }

    // 解析購買物品
    // 购买物品
    if (/^Bought (\d+) ([A-Za-z\s\-\+]+)$/.test(text)) {
        let res = /^Bought (\d+) ([A-Za-z\s\-\+]+)$/.exec(text);
        return `購買 ${cnItem(res[2], node)} 【 ${res[1]} 】`;
    }

    // 购买花费金币
    if (/^Spent (\d+) Coins$/.test(text)) {
        let res = /^Spent (\d+) Coins$/.exec(text);
        return `支付 ${res[1]} 金幣`;
    }

    // 卖出物品
    if (/^Sold (\d+) ([A-Za-z\s\-\+]+)$/.test(text)) {
        let res = /^Sold (\d+) ([A-Za-z\s\-\+]+)$/.exec(text);
        return `賣出 ${cnItem(res[2], node)} 【 ${res[1]} 】`;
    }

    // 收到金币
    if (/^Received (\d+) Coins$/.test(text)) {
        let res = /^Received (\d+) Coins$/.exec(text);
        return `獲得 ${res[1]} 金币`;
    }

    // "Hi wilsonhe1, Welcome to Milky Way": "嗨，wilsonhe1，歡迎來到牛牛銀河",
    if (/^Hi (.+), Welcome to Milky Way$/.test(text)) {
        let res = /^Hi (.+), Welcome to Milky Way$/.exec(text);
        return "嗨，" + res[1] + "，歡迎來到《銀河牛牛》";
    }
    // "Ok wilsonhe1, I have to go now. It's time for my second lunch, and I have four stomachs to fill. Now go explore the Milky Way": "好的，wilsonhe1，我現在要走了。是我第二頓午餐的時間了，我有四個胃要填飽。現在去探索牛牛銀河吧",
    if (/^Ok (.+), I have to go now. It's time for my second lunch, and I have four stomachs to fill. Now go explore the Milky Way$/.test(text)) {
        let res = /^Ok (.+), I have to go now. It's time for my second lunch, and I have four stomachs to fill. Now go explore the Milky Way$/.exec(text);
        return "好的，" + res[1] + "，我現在要走了。是我第二頓午餐的時間了，我有四個胃要填飽。現在去探索《銀河牛牛》吧";
    }

    // Level 3 Log Shed constructed
    if (/^Level ([0-9]*) ([A-Za-z\s]*) constructed$/.test(text)) {
        let res = /^Level ([0-9]*) ([A-Za-z\s]*) constructed$/.exec(text);
        return cnItem(res[2], node)+"【 等级"+res[1]+" 】已建成";
    }

    // Sell For 20000 Coins
    if (/^Sell For (\S+) Coins$/.test(text)) {
        let res = /^Sell For (\S+) Coins$/.exec(text);
        return "賣出 " + res[1] + " 金幣";
    }
    // Confirm Sell For 20000 Coins > 確認
    if (/^Confirm Sell For (\S+) Coins$/.test(text)) {
        let res = /^Confirm Sell For (\S+) Coins$/.exec(text);
        return "確認賣出 " + res[1] + " 金幣";
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

    // like "Sugar x6: 9/8" MWITools專用,漢化原料
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

    // 消除後面的非字母
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
    replaceElementTitle('[title="Clear all sessions"]', '清除所有數據');
    replaceElementTitle('[title="Toggle panel display"]', '隱藏');
    replaceElementTitle('[title="Toggle Enhancement Tracker"]', '切換浮動面板');
    replaceElementTitle('[title="Toggle Sound"]', '切換聲音');
    replaceElementTitle('[title="Show total cost"]', '顯示總成本');

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
        newDiv.textContent = `《 屏蔽專業 》`; // 最终合并内容
        node.replaceWith(newDiv);
    });

    // 角色刪除說明
    if ( /^Follow the instructions to permanently delete this character "(.+)". This action cannot be undone. You must exit party and guild before proceeding. Type the exact name of the character to confirm deletion$/.test(text)) {
        let res = /^Follow the instructions to permanently delete this character "(.+)". This action cannot be undone. You must exit party and guild before proceeding. Type the exact name of the character to confirm deletion$/.exec(text);
        return "⚠️ 永久刪除角色【" + res[1] +"】!!! 此操作無法撤銷。在繼續此操作之前，你必須先退出隊伍和公會，並輸入角色的準確名稱以確認刪除";
    }

    // 调试翻译时可以打开此处列印
    console.log(text);

    return baseTranslate(text);
};

function translateAbilityEffect(text, node) {
    if (text.endsWith(".")) {
        text = text.slice(0, -1);
    }

    // "Attacks enemy for 10HP+60% stab damage as physical damage": "對敵人造成 10HP + 60% 刺擊傷害的物理傷害",
    // "Attacks enemy for 20HP+90% stab damage as physical damage": "對敵人造成 20HP + 90% 刺擊傷害的物理傷害",
    // "Attacks enemy for 30HP+110% stab damage as physical damage. Decreases target's armor by -20% for 10s": "對敵人造成 30HP + 110% 刺擊傷害的物理傷害。使目標的護甲降低 -20%，持續10秒",
    // "Attacks enemy for 10HP+60% slash damage as physical damage": "對敵人造成 10HP + 60% 斬擊傷害的物理傷害",
    // "Attacks all enemies for 20HP+50% slash damage as physical damage": "對所有敵人造成 20HP + 50% 斬擊傷害的物理傷害",
    // "Attacks enemy for 10HP+60% smash damage as physical damage": "對敵人造成 10HP + 60% 粉碎傷害的物理傷害",
    // "Attacks all enemies for 20HP+50% smash damage as physical damage": "對所有敵人造成 20HP + 50% 粉碎傷害的物理傷害",
    // "Attacks enemy for 10HP+55% ranged damage as physical damage": "對敵人造成 10HP + 55% 遠程傷害的物理傷害",
    // "Attacks enemy for 20HP+90% ranged damage as water damage": "對敵人造成 20HP + 90% 遠程傷害的水屬性傷害",
    // "Attacks enemy for 20HP+90% ranged damage as fire damage": "對敵人造成 20HP + 90% 遠程傷害的火屬性傷害",
    // "Attacks all enemies for 20HP+50% ranged damage as physical damage": "對所有敵人造成 20HP + 50% 遠程傷害的物理傷害",
    // "Attacks enemy for 10HP+55% magic damage as water damage": "對敵人造成 10HP + 55% 魔法傷害的水屬性傷害",
    // "Attacks enemy for 20HP+120% magic damage as water damage. Decreases target's attack speed by -25% for 8s": "對敵人造成 20HP + 120% 魔法傷害的水屬性傷害。使目標的攻擊速度降低 -25%，持續8秒",
    // "Attacks all enemies for 30HP+100% magic damage as water damage. Decreases target's evasion by -20% for 9s": "對所有敵人造成 30HP + 100% 魔法傷害的水屬性傷害。使目標的閃避率降低 -20%，持續9秒",
    // "Attacks all enemies for 20HP+80% magic damage as nature damage. Decreases target's armor by -12 for 12s. Decreases target's water resistance by -15 for 12s. Decreases target's nature resistance by -20 for 12s. Decreases target's fire resistance by -15 for 12s": "對所有敵人造成20點HP + 80% 魔法傷害的自然屬性傷害。使目標的護甲降低 -12，持續12秒。使目標的水屬性抗性降低 -15，持續12秒。使目標的自然屬性抗性降低 -20，持續12秒。使目標的火屬性抗性降低 -15，持續12秒",
    // "Attacks enemy for 10HP+55% magic damage as fire damage": "對敵人造成 10HP + 55% 魔法傷害的火屬性傷害",
    // "Attacks all enemies for 20HP+80% magic damage as fire damage": "對所有敵人造成 20HP + 80% 魔法傷害的火屬性傷害",
    let reg = /^Attacks (enemy|all enemies) for ([\d.]+(?:HP|MP|%|s)?)\+([\d.]+(?:HP|MP|%|s)?) ([a-zA-Z ]+) as ([a-zA-Z ]+)$/;
    if (reg.test(text)) {
        let res = reg.exec(text);
        return "對" + cnItem(res[1], node) + "造成 " + res[2] + " + " + res[3] + " " + cnItem(res[4], node) + "（" + cnItem(res[5], node) + " ）";
    }

    // "Attacks enemy for 30HP+110% stab damage as physical damage. Decreases target's armor by -20% for 10s": "對敵人造成 30HP + 110% 刺擊傷害的物理傷害。使目標的護甲降低 -20%，持續10秒",
    // "Attacks enemy for 20HP+120% magic damage as water damage. Decreases target's attack speed by -25% for 8s": "對敵人造成 20HP + 120% 魔法傷害的水屬性傷害。使目標的攻擊速度降低 -25%，持續8秒",
    // "Attacks all enemies for 30HP+100% magic damage as water damage. Decreases target's evasion by -20% for 9s": "對所有敵人造成 30HP + 100% 魔法傷害的水屬性傷害。使目標的閃避率降低 -20%，持續9秒",
    // "Attacks all enemies for 20HP+80% magic damage as nature damage. Decreases target's armor by -12 for 12s. Decreases target's water resistance by -15 for 12s. Decreases target's nature resistance by -20 for 12s. Decreases target's fire resistance by -15 for 12s": "對所有敵人造成20點HP + 80% 魔法傷害的自然屬性傷害。使目標的護甲降低 -12，持續12秒。使目標的水屬性抗性降低 -15，持續12秒。使目標的自然屬性抗性降低 -20，持續12秒。使目標的火屬性抗性降低 -15，持續12秒",
    reg = /^Decreases target's ([a-zA-Z ]+) by (-[\d.]+?(?:HP|MP|%|s)?) for (\d+)s$/;
    if (reg.test(text)) {
        let res = reg.exec(text);
        return "並使其" + cnItem(res[1], node) + "降低 " + res[2] + " 持續 " + res[3] + " 秒";
    }


    // "Attacks enemy with 200% total accuracy for 30HP+100% ranged damage as physical damage": "對敵人以200%總命中率造成 30HP + 100%遠程傷害作為物理傷害",
    reg = /^Attacks (enemy|all enemies) with ([\d.]+(?:HP|MP|%|s)?) ([a-zA-Z ]+) for ([\d.]+(?:HP|MP|%|s)?)\+([\d.]+(?:HP|MP|%|s)?) ([a-zA-Z ]+) as ([a-zA-Z ]+)$/;
    if (reg.test(text)) {
        let res = reg.exec(text);
        return "對" + cnItem(res[1], node) + "以 " + res[2] + " " + cnItem(res[3], node) + "造成 " + res[4] + " + " + res[5] + " " + cnItem(res[6], node) + "（" + cnItem(res[7], node) + " ）";
    }

    // "Heals self for 20HP+30% magic damage": "為自己恢復 20HP + 30% 魔法傷害",
    // "Heals self for 30HP+45% magic damage": "為自己恢復 30HP + 45% 魔法傷害",
    // "Heals lowest HP ally for 40HP+25% magic damage": "為HP最低的隊友恢復 40HP + 25% 魔法傷害",
    // "Heals all allies for 30HP+25% magic damage": "為所有隊友恢復 30HP + 25% 魔法傷害",
    reg = /^Heals (self|all allies|lowest HP ally) for ([\d.]+(?:HP|MP|%|s)?)\+([\d.]+(?:HP|MP|%|s)?) ([a-zA-Z ]+)$/;
    if (reg.test(text)) {
        let res = reg.exec(text);
        return "對" + cnItem(res[1], node) + "恢復 " + res[2] + " + " + res[3] + " " + cnItem(res[4], node);
    }

    // "Increases all allies' critical rate by 3% for 120s": "增加所有隊友的暴擊率3%，持續120秒",
    // "Increases all allies' nature amplify by 6% for 120s. Increases all allies healing amplify by 6% for 120s. Increases all allies nature resistance by 4 for 120s": "增加所有隊友的自然屬性強化6%，持續120秒。增加所有隊友的治療強化6%，持續120秒。增加所有隊友的自然屬性抗性4，持續120秒",
    // "Increases all allies' attack speed by 3% for 120s. Increases all allies cast speed by 3% for 120s": "增加所有隊友的攻擊速度3%，持續120秒。增加所有隊友的施法速度3%，持續120秒",
    // "Increases all allies' physical amplify by 6% for 120s. Increases all allies armor by 4 for 120s": "增加所有隊友的物理強化6%，持續120秒。增加所有隊友的護甲4，持續120秒",
    // "Increases all allies' water amplify by 8% for 120s. Increases all allies water resistance by 4 for 120s": "增加所有隊友的水屬性強化8%，持續120秒。增加所有隊友的水屬性抗性4，持續120秒",
    // "Increases all allies' fire amplify by 8% for 120s. Increases all allies fire resistance by 4 for 120s": "增加所有隊友的火屬性強化8%，持續120秒。增加所有隊友的火屬性抗性4，持續120秒",
    reg = /^Increases all allies' ([a-zA-Z ]+) by ([\d.]+(?:HP|MP|%|s)?) for (\d+)s$/;
    if (reg.test(text)) {
        let res = reg.exec(text);
        return "增加所有隊友的" + cnItem(res[1], node) + " " + res[2] + " 持續 " + res[3] +" 秒" ;
    }

    // "Increases threat by 250% for 60s": "增加250%的威脅等級，持續60秒",
    // "Increases threat by 500% for 60s": "增加500%的威脅等級，持續60秒",
    // "Increases evasion by 20% for 20s": "增加20%的閃避，持續20秒",
    // "Increases accuracy by 30% for 20s": "增加30%的精準，持續20秒",
    // "Increases physical amplify by 18% for 20s": "增加18%的物理強化，持續20秒",
    // "Increases attack speed by 20% for 20s": "增加20%的攻擊速度，持續20秒",
    // "Increases physical thorns by 20% for 20s": "增加20%的物理反傷，持續20秒",
    // "Increases elemental thorns by 20% for 20s": "增加20%的魔法反傷，持續20秒",
    // "Increases life steal by 8% for 20s": "增加8%的生命偷取，持續20秒",
    // "Increases water amplify by 40% for 20s. Increases nature amplify by 40% for 20s. Increases fire amplify by 40% for 20s": "增加40%的水屬性強化，持續20秒。增加40%的自然屬性強化，持續20秒。增加40%的火屬性強化，持續20秒",
    // "Increases damage by 30% for 12s. Increases attack speed by 30% for 12s. Increases cast speed by 30% for 12s": "增加30%的傷害，持續12秒。增加30%的攻擊速度，持續12秒。增加30%的施法速度，持續12秒",
    // "Increases armor by 700 for 12s. Increases water resistance by 700 for 12s. Increases nature resistance by 700 for 12s. Increases fire resistance by 700 for 12s. Increases tenacity by 700 for 12s": "增加700的護甲，持續12秒。增加700的水屬性抗性，持續12秒。增加700的自然屬性抗性，持續12秒。增加700的火屬性抗性，持續12秒。增加700的堅韌，持續12秒",
    reg = /^Increases ([a-zA-Z ]+) by ([\d.]+(?:HP|MP|%|s)?) for (\d+)s$/;
    if (reg.test(text)) {
        let res = reg.exec(text);
        return "增加" + cnItem(res[1], node) + " " + res[2] + " 持續 " + res[3] +" 秒" ;
    }


    // "Increases armor by 20%+20 for 20s. Increases water resistance by 20%+20 for 20s. Increases nature resistance by 20%+20 for 20s. Increases fire resistance by 20%+20 for 20s": "增加20% + 20的護甲，持續20秒。增加20% + 20的水屬性抗性，持續20秒。增加20% + 20的自然屬性抗性，持續20秒。增加20% + 20的火屬性抗性，持續20秒",
    reg = /^Increases ([a-zA-Z ]+) by ([\d.]+(?:HP|MP|%|s)?)\+([\d.]+(?:HP|MP|%|s)?) for (\d+)s$/;
    if (reg.test(text)) {
        let res = reg.exec(text);
        return "增加" + cnItem(res[1], node) + " " + res[2] + " + " + res[3] + " 持續 " + res[4] + " 秒" ;;
    }

    // "Revives and heals a defeated ally for 100HP+40% magic damage": "復活並為一個死亡的隊友恢復 100HP + 40% 魔法傷害",
    reg = /^Revives and heals a defeated ally for ([\d.]+(?:HP|MP|%|s)?)\+([\d.]+(?:HP|MP|%|s)?) ([a-zA-Z ]+)$/;
    if (reg.test(text)) {
        let res = reg.exec(text);
    return "復活吧~我的勇士!!!恢復" + res[1] + " + " + res[2] + "魔法傷害";
    }

    // "Costs 30% of current HP": "消耗當前HP的30%",
    reg = /^Costs ([\d.]+(?:HP|MP|%|s)?) of current HP$/;
    if (reg.test(text)) {
    let res = reg.exec(text);
    return "消耗當前HP的 " + res[1];
    }

    // "70% chance to stun for 3s": "有 70% 機率 暈眩，持續 3 秒",
    // "10% chance to stun for 2s": "有 10% 機率 暈眩，持續 2 秒",
    // "60% chance to silence for 5s": "有 60% 機率 沉默，持續 5 秒",
    // "50% chance to blind for 5s": "有 50% 機率 失明，持續 5 秒",
    reg = /^(\d+)% chance to (\w+) for (\d+)s$/;
    if (reg.test(text)) {
        let res = reg.exec(text);
        return "並有 " + res[1] + "% 機率造成" + cnItem(res[2], node) + "，持續 " + res[3] + " 秒";
    }

    // "100% chance to pierce": "有 100% 機率貫穿敵人",
    reg = /^(\d+)% chance to (\w+)$/;
    if (reg.test(text)) {
        let res = reg.exec(text);
        return "並有 " + res[1] + "% 機率" + cnItem(res[2], node) + "敵人" ;
    }

    //bleeds for 100% dealt damage over 15s": "並在 15 秒內造成等同於所造成傷害 100% 的流血傷害",
    //burns for 100% dealt damage over 10s": "並在 10 秒內造成等同於所造成傷害 100% 的燃燒傷害",
    reg = /^(\w+)s for (\d+)% dealt damage over (\d+)s$/;
    if (reg.test(text)) {
        let res = reg.exec(text);
        return "並在 " + res[3] + " 秒內造成等同於所造成傷害 " + res[2] + "% 的" + cnItem(res[1], node) + "傷害";
    }


    //盾擊
    //"Bonus damage equal to 60% armor": "並造成等同60%護甲的額外傷害",
    reg = /^Bonus damage equal to (\d+)% armor$/;
    if (reg.test(text)) {
        let res = reg.exec(text);
        return "並造成等同 " + res[1] + " %護甲的額外傷害";
    }

    //碎裂衝擊
    //"Increases target's damage taken by 5% for 12s": "增加目標敵人所受傷害5%，持續12秒",
    //"Increases target's damage taken by 6.85% for 12s"
    // 下面是第一組是兩個捕獲組,所以配上res3,想要改可以改成(\d+(?:\.\d+)?)% for (\d+)s 這樣就兩個捕獲組了,後面改成res2即可
    reg = /^Increases target's damage taken by (\d+(\.\d+)?)% for (\d+)s$/;
    if (reg.test(text)) {
        let res = reg.exec(text);
        return "增加目標敵人所受傷害 " + res[1] + "% ，持續 " + res[3] + " 秒";
    }

    //生命吸取
    //"Drains 10% of dealt damage as HP": "吸取所造成傷害的 10% 轉化为自身HP",
    reg = /^Drains (\d+)% of dealt damage as HP$/;
    if (reg.test(text)) {
        let res = reg.exec(text);
        return "吸取所造成傷害的 " + res[1] + "% 轉化為自身HP";
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

// 定義中英映射參照組
let reverseTranslates = {};

for (let trans of [tranItemCurrencies, tranItemResources, tranItemConsumable, tranItemBook, tranItemEquipment, tranItemTool, tranItemBox,tranAccessories,tranKeys]) {
    for (let key in trans) {
        reverseTranslates[trans[key]] = key.toLowerCase();
    }
}

function translatePlaceholder(node) {
    if (node.placeholder === "All players import") {
        node.placeholder = "導入所有玩家";
    }
    for (let i = 1; i <= 5; i++) {
        const placeholderText = `Player ${i} import`;
        if (node.placeholder === placeholderText) {
            node.placeholder = `導入玩家${i}`;
            break;
        }
    }
    if (node.placeholder === "Import set here for Solo") {
        node.placeholder = "導入單人設置";
    }
    if (node.placeholder === "Guild Name") {
        node.placeholder = "公會名稱";
    }
    if (node.placeholder === "Player Name") {
        node.placeholder = "玩家名稱";
    }
}

/* 搜索框替換 */
// 监听 DOM 变化，检测需要替換的搜索框
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
        // 市場搜索框
        ".MarketplacePanel_marketListings__1GCyQ",
        // 庫存搜索框
        ".Inventory_inventory__17CH2",
        ".SkillActionDetail_primaryItemSelectorContainer__nrvNW",
        ".ItemSelector_emptySlot__1ns6h",
        ".ItemSelector_menu__12sEM",
        // 商店tester搜索框
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

// **替换搜索框** ,已經由监听 DOM 变化得知所要替換的框
function replaceSearchBar(oriSearchBar, areaSelector) {
    oriSearchBar.style.display = "none";
    // 移除外层div，直接插入input元素实现横向排列
    oriSearchBar.insertAdjacentHTML("afterend", `<input class="script-custom-search-input" type="text" placeholder="阿茶的搜索框" style="font-size: 10px; font-family: 'Microsoft YaHei'">`);
    // 直接通过类名查找相邻的自定义输入框（无需再通过parentNode找div子元素）
    const input = oriSearchBar.nextElementSibling;

    const logPrefixMap = {
        ".MarketplacePanel_marketListings__1GCyQ": "Custom search marketplace panel market listings",
        ".Inventory_inventory__17CH2": "Custom search inventory", // 庫存
        ".ItemSelector_emptySlot__1ns6h": "Custom search item selector empty slot",
        ".SkillActionDetail_primaryItemSelectorContainer__nrvNW": "Custom search skill action detail selector",
        ".ItemSelector_menu__12sEM": "Custom search item selector menu",
        ".ShopPanel_itemFilterContainer__1raSg": "Custom search shop panel item filter",
        ".ShopPanel_shopItems__3QZSJ": "Custom search shop panel shop items"
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
            }, 200);
        });
    }
}

// **搜索处理逻辑**
function customSearch(areaElementSelector, keyword) {
    /*
    为什么这样写？
    提前声明，后续赋值：因为 items 的值需要根据不同的 areaElementSelector（区域选择器）来确定（不同区域的商品项存储位置不同），所以先声明变量，再在不同的条件分支中给它赋不同的值。
    块级作用域：用 let 声明的 items 只在 customSearch 函数内部有效，避免污染外部作用域。作用域：用 let 声明的 items 只在 customSearch 函数内部有效，避免污染外部作用域。
    */
    let items;
    const itemListContainers = [
        // 位於煉金彈窗框
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
        processShopPanelItems(items, keyword, areaElementSelector);
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

/* 物品收藏 */
(function() {
    'use strict';

    // 获取当前角色名
    function getCharacterName() {
        const headerInfo = document.querySelector('.Header_info__26fkk'); // 奶牛右上角色ID的 class
        if (!headerInfo) return null;
        const nameElement = headerInfo.querySelector('.CharacterName_name__1amXp'); // 上面的子 class
        // 检查是否找到角色名元素
        if (nameElement) {
            // 如果找到，返回元素的文本内容（去除前后空格）
            const characterName = nameElement.textContent.trim();
            return characterName;
        } else {
            // 如果没找到，返回 null
            return null;
        }
    }

    // 保存收藏物品到本地存储
    // 處理兩個函數 itemName =要收藏的物品名称 ,  categoryName：该物品所属的分类
    function saveFavoritesToLocalStorage(itemName, categoryName) {
        const characterName = getCharacterName(); // 角色ID
        if (!characterName) return; // 不符合角色ID 即返回
        const storageKey = `mw_favorites_${characterName}`; // 生成名為 mw_favorites_ 的本地存储裡
        const favorites = loadFavoritesFromLocalStorage(); // 在底下處理這个函式

        // 检查是否已存在相同物品
        // findIndex 是数组的一个方法，用于遍历数组，返回第一个满足条件的元素的索引。如果没有找到满足条件的元素，返回 -1
        const existingIndex = favorites.findIndex(item => item.name === itemName);
        // 如果未被收藏
        if (existingIndex === -1) {
            // 則處理收藏
            favorites.push({name: itemName, category: categoryName});
            // 處理上面的 storageKey 跟  favorites
            /* JSON.stringify(favorites)
                favorites 是一个数组，里面存放着用户收藏的物品信息（比如 [{name: "治疗药水", category: "消耗品"}, ...]）。
                浏览器的 localStorage 有个限制：只能存储字符串类型的数据，不能直接存储数组或对象。
                JSON.stringify() 是一个内置函数，能把数组 / 对象转换成字符串格式（称为 JSON 字符串）。
                举例：
                原数组 [{name: "铁剑"}] 会被转换成字符串 '[{"name":"铁剑"}]'，这样就能存入 localStorage 了。*/
            localStorage.setItem(storageKey, JSON.stringify(favorites));
        }
    }

    // 从本地存储加载收藏物品
    function loadFavoritesFromLocalStorage() {
        const characterName = getCharacterName(); // 角色ID
        if (!characterName) return []; // 不符合角色ID 即返回
        const storageKey = `mw_favorites_${characterName}`;
        return JSON.parse(localStorage.getItem(storageKey)) || [];
    }

    // 创建仓库收藏分类
    function addFavoritesCategory() {
        // 查找仓库的所有分类容器
        const firstContainer = document.querySelector('.Inventory_items__6SXv0'); // 為整個庫存的 class
        const inventoryContainers = firstContainer.querySelectorAll(':scope > div');
        if (inventoryContainers && inventoryContainers.length > 0) {
            const existingFavorites = firstContainer.querySelector('#favorites-category');
            if (existingFavorites) {
                return;
            }

            // 创建新的收藏分类
            const favoritesContainer = document.createElement('div');

            // 复制现有分类的结构
            // Inventory_label__XEOAx 為庫存內每個分類的 class
            const itemGridHTML = `
                <div class="Inventory_itemGrid__20YAH">
                    <div class="Inventory_label__XEOAx">
                        <span class="Inventory_categoryButton__35s1x">收藏</span>
                    </div>
                    <!-- 这里将来会添加收藏的物品 -->
                </div>
            `;
            favoritesContainer.innerHTML = itemGridHTML;
            favoritesContainer.id = 'favorites-category';

            // 将收藏分类添加到仓库的最前面
            // firstContainer為整個庫存的 class的函數
            if (firstContainer) {
                                                      // 這裡是處理自創的div , // 這裡是整個庫存的第一個元素
                firstContainer.insertBefore(favoritesContainer, firstContainer.firstChild);
                console.log('收藏分类已添加');
            }
        }
    }

    // 添加仓库收藏按钮
    function addFavoriteButton(menuContainer) {
        // 检查是否已存在收藏按钮
        const existingButton = menuContainer.querySelector('.favorite-button');
        if (existingButton) {
            return;
        }
        const favoriteButton = document.createElement('button');
        // Button_button__1Fe9z Button_fullWidth__17pVU 為mo9 自創的button的class
        favoriteButton.className = 'Button_button__1Fe9z Button_fullWidth__17pVU favorite-button';
        favoriteButton.textContent = '收藏/取消收藏';

        // 自創的收藏button添加点击事件
        favoriteButton.addEventListener('click', function() {
            // 定义获取物品名称的函数：优先取 script_translatedfrom（原始英文）
            function getItemName(menuContainer) {
                const nameElement = menuContainer.querySelector('.Item_name__2C42x');
                if (!nameElement) return null;

                // 先尝试提取原始英文（script_translatedfrom）
                const originalName = nameElement.getAttribute('script_translatedfrom');
                if (originalName) {
                    return originalName.trim();
                }

                // 若没有，再取翻译后的中文（降级方案）
                return nameElement.textContent.trim();
            }

            // 【关键修正】使用 getItemName 函数获取正确的 itemName
            const itemName = getItemName(menuContainer);
            if (!itemName) {
                console.log('未找到物品名称元素');
                return;
            }
            // 遍歷物品 class 名稱
            const characterName = getCharacterName(); // 獲取角色ID
            if (!characterName) return;
            const favorites = loadFavoritesFromLocalStorage(); // 从本地存储加载收藏物品
            // findIndex 是数组的一个方法，用于遍历数组，返回第一个满足条件的元素的索引。如果没有找到满足条件的元素，返回 -1
            // 这段代码是「收藏 / 取消收藏」按钮的核心点击事件逻辑，用于判断物品当前是否为收藏状态，并执行相应操作。
            const itemIndex = favorites.findIndex(item => item.name === itemName);
            const isFavorite = itemIndex !== -1;

            // 上面已經處理 "保存收藏物品到本地存储" ,為處理代码中数据层面的存储逻辑
            // 這裡是處理 用户点击 “收藏 / 取消收藏” 后，同步更新页面上的物品显示
            // if true
            if (isFavorite) {
                 // 当 isFavorite 为 true → 物品已收藏，执行“取消收藏”操作
                const itemCategory = favorites[itemIndex].category;
                favorites.splice(itemIndex, 1);
                localStorage.setItem(`mw_favorites_${characterName}`, JSON.stringify(favorites));
                //Inventory_itemGrid__20YAH 為庫存底下各分類的class 如 貨幣 , 消耗品 , 食物
                const favoritesGrid = document.querySelector('#favorites-category .Inventory_itemGrid__20YAH'); // 選取自創的收藏的
                const existingItem = favoritesGrid.querySelector(`svg[aria-label="${itemName}"]`);
                if (existingItem) {
                    const inventoryItem = document.querySelector(`.Inventory_items__6SXv0 .Item_itemContainer__x7kH1 svg[aria-label="${itemName}"]`);
                    if (!inventoryItem) {
                        console.log('未在仓库中找到该物品');
                        return;
                    }
                    const itemContainer = inventoryItem.closest('.Item_itemContainer__x7kH1'); // 庫存內每個物品的 class
                    if (!itemContainer) {
                        console.log('无法获取物品容器');
                        return;
                    }

                    const categorySpan = [...document.querySelectorAll('.Inventory_categoryButton__35s1x')] //自創的收藏class
                        .find(span => span.textContent.trim() === itemCategory);
                    if (categorySpan) {
                        const categoryGrid = categorySpan.closest('.Inventory_itemGrid__20YAH');
                        if (categoryGrid) {
                            categoryGrid.appendChild(itemContainer);
                        }
                    }
                    refresh();
                    //existingItem.closest('.Item_itemContainer__x7kH1').remove();
                }
            } else {
                const inventoryItem = document.querySelector(`.Inventory_items__6SXv0 .Item_itemContainer__x7kH1 svg[aria-label="${itemName}"]`);
                if (!inventoryItem) {
                    console.log('未在仓库中找到该物品');
                    return;
                }
                const itemContainer = inventoryItem.closest('.Item_itemContainer__x7kH1');
                if (!itemContainer) {
                    console.log('无法获取物品容器');
                    return;
                }
                const categoryGrid = itemContainer.closest('.Inventory_itemGrid__20YAH');
                const categoryName = categoryGrid ?
                    categoryGrid.querySelector('.Inventory_categoryButton__35s1x')?.textContent.trim() :
                    '未知分类';
                saveFavoritesToLocalStorage(itemName, categoryName);
                const favoritesGrid = document.querySelector('#favorites-category .Inventory_itemGrid__20YAH');
                if (!favoritesGrid) {
                    console.log('未找到收藏分类');
                    return;
                }
                const existingItem = favoritesGrid.querySelector(`svg[aria-label="${itemName}"]`);
                if (!existingItem) {
                    favoritesGrid.appendChild(itemContainer);
                }
            }
        });
        menuContainer.appendChild(favoriteButton);
    }


    // 刷新函数，当DOM变化时调用
    function refresh() {
        try {
            // 仓库收藏功能
            const inventoryContainer = document.querySelector('.Inventory_items__6SXv0');
            if (inventoryContainer) {
                addFavoritesCategory();
                const favorites = loadFavoritesFromLocalStorage();
                const favoritesGrid = document.querySelector('#favorites-category .Inventory_itemGrid__20YAH');
                if (favoritesGrid) {
                    favorites.forEach(item => {
                        const inventoryItem = document.querySelector(`.Inventory_items__6SXv0 .Item_itemContainer__x7kH1 svg[aria-label="${item.name}"]`);
                        if (inventoryItem) {
                            const itemContainer = inventoryItem.closest('.Item_itemContainer__x7kH1');
                            const existingItem = favoritesGrid.querySelector(`svg[aria-label="${item.name}"]`);
                            if (!existingItem && itemContainer) {
                                favoritesGrid.appendChild(itemContainer);
                            }
                        }
                    });
                }
            }

            // 检查是否出现物品菜单
            const itemMenu = document.querySelector('.Item_actionMenu__2yUcG');
            if (itemMenu) {
                addFavoriteButton(itemMenu);
            }

        } catch (error) {
            console.log('刷新函数出错:', error);
        }
    }

    // 设置MutationObserver监听DOM变化
    const inventoryContainer = document.querySelector('.Inventory_items__6SXv0');
    // 如果仓库容器还没加载，可等DOMContentLoaded后再获取
    if (!inventoryContainer) {
        document.addEventListener('DOMContentLoaded', () => {
            const target = document.querySelector('.Inventory_items__6SXv0');
            if (target) observer.observe(target, config);
        });
    } else {
        observer.observe(inventoryContainer, config); // 只监听仓库容器
    }

    /* 其中attributes: true会监听元素的属性变化（比如某个物品的class、style、aria-label等属性修改）。
    需要的功能是只关心 “物品是否被添加 / 移除 / 移动”（即 DOM 节点的增减或位置变化），无需监听属性变化（比如物品的样式变化不会影响收藏状态）。
    attributes: true会导致大量不必要的触发（比如物品 hover 时的样式变化、其他模块的属性更新），进一步增加refresh()的执行频率。*/
    const config = { childList: true, subtree: true };

    const observer = new MutationObserver(function (mutationsList, observer) {
        refresh();
    });
    observer.observe(document, config);

    // 页面加载完成后执行一次
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', refresh);
    } else {
        refresh();
    }

    /* --- 角色選擇button --- */
    /* --- 角色選擇button（修改版：高亮角色显示在线） --- */
    // 角色配置与基础常量
    const characterNames = ['標準', '鐵牛1', '鐵牛2', '鐵牛3'];
    const baseUrl = 'https://www.milkywayidle.com';
    const apiBaseUrl = window.location.hostname.includes('test')
    ? 'https://api-test.milkywayidle.com'
    : 'https://api.milkywayidle.com';
    const storageKey = 'characterIds_milkyway';

    // 状态与DOM引用变量
    let isMenuExpanded = false;
    let menuContainer;
    let mainButton;
    let container;
    let isTouchDevice = false;
    let toggleMenu;
    let charactersCache = null;
    let rawCharactersData = null;
    let isLoadingCharacters = false;

    // ==========================================
    // 离线时间计算核心逻辑
    // ==========================================
    function getFormattedOfflineTime(lastOfflineTime, isMobile = false) {
        if (!lastOfflineTime) return '无离线数据';

        const lastTime = new Date(lastOfflineTime);
        if (isNaN(lastTime.getTime())) return '时间格式错误';

        const diffMs = Date.now() - lastTime.getTime();
        const diffMinutes = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        const units = isMobile
        ? { day: 'd', hour: 'h', minute: 'm', justNow: '剛剛' }
        : { day: '天', hour: '小時', minute: '分鐘', justNow: '剛剛' };

        if (diffDays > 0) {
            const remainingHours = Math.floor((diffMs % 86400000) / 3600000);
            return remainingHours > 0
                ? `${diffDays}${units.day}${remainingHours}${units.hour}`
            : `${diffDays}${units.day}`;
        }
        if (diffHours > 0) {
            const remainingMinutes = diffMinutes % 60;
            return remainingMinutes > 0
                ? `${diffHours}${units.hour}${remainingMinutes}${units.minute}`
            : `${diffHours}${units.hour}`;
        }
        if (diffMinutes > 0) return `${diffMinutes}${units.minute}`;
        return units.justNow;
    }

    async function fetchCharactersData(forceRefresh = false) {
        if (!forceRefresh && charactersCache) {
            return charactersCache.map(character => ({
                ...character,
                lastOfflineText: getFormattedOfflineTime(
                    character.lastOfflineTime,
                    window.innerWidth < 768
                )
            }));
        }

        if (isLoadingCharacters) {
            while (isLoadingCharacters) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            return charactersCache || [];
        }

        isLoadingCharacters = true;
        try {
            const response = await fetch(`${apiBaseUrl}/v1/characters`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            });

            if (!response.ok) throw new Error(`API请求失败: ${response.status}`);
            const data = await response.json();
            const rawData = data.characters || [];
            rawCharactersData = rawData;

            charactersCache = rawData.map(character => ({
                id: character.id.toString(),
                name: character.name,
                gameMode: character.gameMode,
                lastOfflineTime: character.lastOfflineTime,
                isOnline: character.isOnline || false, // 确保有在线状态标识
                lastOfflineText: getFormattedOfflineTime(
                    character.lastOfflineTime,
                    window.innerWidth < 768
                )
            })).filter(Boolean);

            return charactersCache;
        } catch (error) {
            console.error('获取角色数据失败:', error);
            return [];
        } finally {
            isLoadingCharacters = false;
        }
    }

    // ==========================================
    // 菜单核心功能
    // ==========================================
    function initToggleMenu() {
        toggleMenu = function() {
            if (!menuContainer || !mainButton || !container) {
                console.warn('菜单尚未初始化，无法切换状态');
                return;
            }

            isMenuExpanded = !isMenuExpanded;
            const arrow = mainButton.querySelector('.arrow');

            if (isMenuExpanded) {
                menuContainer.style.maxHeight = '300px';
                menuContainer.style.padding = '10px';
                arrow?.classList.add('up');
                container.classList.remove('hidden');
                updateMenuOfflineTime();
            } else {
                menuContainer.style.maxHeight = '0';
                menuContainer.style.padding = '0';
                arrow?.classList.remove('up');
            }
        };
    }

    function detectTouchDevice() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
    }

    function loadCharacterIds() {
        try {
            const savedIds = localStorage.getItem(storageKey);
            return savedIds ? JSON.parse(savedIds) : new Array(characterNames.length).fill(null);
        } catch (e) {
            console.warn('localStorage不可用，使用临时数据', e);
            return new Array(characterNames.length).fill(null);
        }
    }

    function saveCharacterIds(ids) {
        try {
            localStorage.setItem(storageKey, JSON.stringify(ids));
        } catch (e) {
            console.warn('localStorage不可用，无法保存数据', e);
        }
    }

    function extractIdFromUrl() {
        const url = window.location.href;
        const match = url.match(/characterId=(\d+)/);
        return match ? match[1] : null;
    }

    function handleClearId(menuItem, index, characterIds) {
        if (characterIds[index]) {
            if (confirm(`確定清除「${characterNames[index]}」的角色ID連結？\n當前ID : ${characterIds[index]}`)) {
                characterIds[index] = null;
                saveCharacterIds(characterIds);
                menuItem.style.backgroundColor = 'rgba(70, 70, 70, 0.8)';
                menuItem.title = isTouchDevice ?
                    '點擊保存當前ID | 長按清除' :
                '左键保存當前ID | 右鍵清除';
                menuItem.href = 'javascript:void(0)';
                menuItem.textContent = `${characterNames[index]} - 未绑定ID`;
                alert(`⚠️ 已清除「${characterNames[index]}」的角色ID連結 !!`);
            }
        } else {
            alert(`ℹ️ 該角色未保存ID，無需清除`);
        }
        if (typeof toggleMenu === 'function') {
            toggleMenu();
        }
    }

    // ==========================================
    // 核心修改：高亮角色显示在线，其他显示离线时间
    // ==========================================
    async function updateMenuOfflineTime() {
        const characterIds = loadCharacterIds();
        const menuItems = menuContainer.querySelectorAll('.character-menu-item');
        if (!menuItems.length) return;

        const currentCharacterId = extractIdFromUrl(); // 获取当前高亮角色ID
        const characters = await fetchCharactersData(); // 获取所有角色数据
        const isMobile = window.innerWidth < 768;

        menuItems.forEach((menuItem, index) => {
            const savedCharId = characterIds[index];
            if (!savedCharId) {
                menuItem.textContent = `${characterNames[index]} - 未绑定ID`;
                return;
            }

            // 判断是否为当前高亮角色
            const isActiveCharacter = savedCharId === currentCharacterId;

            if (isActiveCharacter) {
                // 高亮角色显示"在线"状态
                menuItem.textContent = `${characterNames[index]} - 在线`;
                menuItem.title = isTouchDevice
                    ? `ID: ${savedCharId} | 当前在线 | 長按清除`
                : `ID: ${savedCharId} | 当前在线 | 右鍵清除`;
            } else {
                // 非高亮角色显示离线时间
                const matchedChar = characters.find(char => char.id === savedCharId);
                if (matchedChar) {
                    menuItem.textContent = `${characterNames[index]} - ${matchedChar.lastOfflineText}`;
                    menuItem.title = isTouchDevice
                        ? `ID: ${savedCharId} | 離線時間: ${matchedChar.lastOfflineText} | 長按清除`
                    : `ID: ${savedCharId} | 離線時間: ${matchedChar.lastOfflineText} | 右鍵清除`;
                } else {
                    menuItem.textContent = `${characterNames[index]} - 无角色数据`;
                }
            }
        });
    }

    // 高亮当前角色并更新样式
    function highlightActiveCharacter() {
        const currentId = extractIdFromUrl();
        const menuItems = menuContainer.querySelectorAll('.character-menu-item');
        const characterIds = loadCharacterIds();

        menuItems.forEach((item, index) => {
            const savedId = characterIds[index];
            item.classList.remove('active-character');

            // 重置样式
            if (savedId) {
                item.style.backgroundColor = 'rgba(48, 63, 159, 0.8)';
            } else {
                item.style.backgroundColor = 'rgba(70, 70, 70, 0.8)';
            }
            item.style.border = '';
            item.style.boxShadow = '';

            // 高亮当前角色并标记在线
            if (savedId === currentId) {
                item.style.backgroundColor = 'rgb(159, 121, 8, 0.7)'; // 绿色表示在线
                item.style.border = '2px solid rgb(227, 224, 5)';
                item.style.boxShadow = '0 0 8px 2px rgba(26, 25, 18, 0.3)';
            }
        });
    }

    async function createCollapsibleMenu(characterIds) {
        isTouchDevice = detectTouchDevice();
        if (container) {
            updateMenuOfflineTime();
            return;
        }

        // 创建主按钮
        mainButton = document.createElement('a');
        mainButton.innerHTML = '角色切換 <span class="arrow">▼</span>';
        mainButton.style.cssText = `
            position: fixed;
            transform: translateX(-50%);
            z-index: 9999;
            display: flex;
            align-items: center;
            gap: 6px;
            padding: 8px 12px;
            border-radius: 5px;
            background-color: rgba(122, 122, 213, 0.7);
            color: white;
            border: none;
            font-size: 14px;
            font-weight: 500;
            text-decoration: none;
            cursor: pointer;
            white-space: nowrap;
            transition: all 1s;
        `;

        // 添加箭头样式
        const arrowStyle = document.createElement('style');
        arrowStyle.textContent = `
            .arrow {
                font-size: 15px;
                transition: transform 0.1s ease;
                margin-left: 5px;
            }
            .arrow.up {
                transform: rotate(180deg);
            }
            @media (max-width: 768px) {
                .arrow { margin-left: 0; }
                #character-switch-container a:first-child {
                    justify-content: center;
                    padding: 4px 6px;
                    min-width: 30px;
                }
            }
        `;
        document.head.appendChild(arrowStyle);

        // 创建下拉菜单容器
        menuContainer = document.createElement('div');
        menuContainer.style.cssText = `
            position: fixed;
            transform: translateX(-50%);
            z-index: 9998;
            display: flex;
            flex-direction: column;
            gap: 5px;
            padding: 0;
            border-radius: 5px;
            background-color: rgba(221, 205, 205, 0.7);
            max-height: 0;
            overflow: hidden;
            transition: max-height 1s ease, padding 1s ease;
        `;

        // 创建角色菜单项
        const menuItems = [];
        for (let i = 0; i < characterNames.length; i++) {
            const menuItem = document.createElement('a');
            menuItem.dataset.isTouch = isTouchDevice ? 'true' : 'false';
            menuItem._toggleMenu = toggleMenu;
            menuItem.classList.add('character-menu-item');
            menuItem.dataset.index = i;
            menuItem.textContent = `${characterNames[i]} - 加载中...`;

            // 基础样式设置
            if (characterIds[i]) {
                menuItem.href = `${baseUrl}/game?characterId=${characterIds[i]}`;
                menuItem.style.backgroundColor = 'rgba(48, 63, 159, 0.8)';
                menuItem.title = isTouchDevice
                    ? `ID : ${characterIds[i]} | 長按清除`
                : `ID : ${characterIds[i]} | 右鍵清除`;
            } else {
                menuItem.href = 'javascript:void(0)';
                menuItem.style.backgroundColor = 'rgba(70, 70, 70, 0.8)';
                menuItem.title = isTouchDevice
                    ? '點擊保存當前ID | 長按清除'
                : '左键保存當前ID | 右鍵清除';
            }

            // 统一菜单项样式
            menuItem.style.cssText = `
                padding: 6px 12px;
                color: white;
                border: none;
                border-radius: 4px;
                font-size: 13px;
                font-weight: 500;
                text-decoration: none;
                cursor: pointer;
                white-space: nowrap;
                transition: all 0.5s;
            `;

            // 左键点击事件
            menuItem.addEventListener('click', async function(e) {
                const currentId = extractIdFromUrl();
                const index = parseInt(this.dataset.index);
                const isTouch = this.dataset.isTouch === 'true';
                const toggleMenu = this._toggleMenu;

                if (characterIds[index]) {
                    window.location.href = this.href;
                    toggleMenu?.();
                } else if (currentId) {
                    characterIds[index] = currentId;
                    saveCharacterIds(characterIds);
                    this.style.backgroundColor = 'rgba(48, 63, 159, 0.8)';
                    this.href = `${baseUrl}/game?characterId=${currentId}`;
                    alert(`✅ 成功保存「${characterNames[index]}」的角色ID連結 !!`);
                    toggleMenu?.();
                    await updateMenuOfflineTime();
                    e.preventDefault();
                } else {
                    alert(`❌ 未檢測到角色ID，請確認URL包含characterId參數`);
                }
            });

            // 清除ID事件
            if (!isTouchDevice) {
                menuItem.addEventListener('contextmenu', function(e) {
                    e.preventDefault();
                    handleClearId(this, parseInt(this.dataset.index), characterIds);
                });
            } else {
                menuItem.addEventListener('pointerdown', function(e) {
                    if (e.pointerType === 'touch') {
                        let longPressTimer = setTimeout(() => {
                            handleClearId(this, parseInt(this.dataset.index), characterIds);
                        }, 600);
                        ['pointerup', 'pointercancel', 'pointerleave'].forEach(event => {
                            menuItem.addEventListener(event, () => clearTimeout(longPressTimer), { once: true });
                        });
                    }
                });
                menuItem.addEventListener('contextmenu', e => e.preventDefault());
            }

            menuContainer.appendChild(menuItem);
            menuItems.push(menuItem);
        }

        // 初始化菜单切换函数
        initToggleMenu();

        // 主按钮事件
        mainButton.addEventListener('click', function(e) {
            e.preventDefault();
            toggleMenu();
        });

        // 长按展开逻辑
        if (isTouchDevice) {
            let mainBtnLongPressTimer;
            mainButton.addEventListener('pointerdown', function(e) {
                if (e.pointerType === 'touch') {
                    mainBtnLongPressTimer = setTimeout(toggleMenu, 800);
                }
            });
            ['pointerup', 'pointercancel', 'pointerleave'].forEach(event => {
                mainButton.addEventListener(event, () => clearTimeout(mainBtnLongPressTimer));
            });
        } else {
            let mainBtnLongPressTimer;
            mainButton.addEventListener('mousedown', () => {
                mainBtnLongPressTimer = setTimeout(toggleMenu, 800);
            });
            mainButton.addEventListener('mouseup', () => clearTimeout(mainBtnLongPressTimer));
            mainButton.addEventListener('mouseleave', () => clearTimeout(mainBtnLongPressTimer));
        }

        // 点击其他区域关闭菜单
        document.addEventListener('click', function(e) {
            if (!mainButton.contains(e.target) && !menuContainer.contains(e.target) && isMenuExpanded) {
                toggleMenu();
            }
        });

        // 响应式适配
        function adjustPositionAndVisibility() {
            const menuItems = document.querySelectorAll('.character-menu-item');
            if (window.innerWidth < 768) {
                mainButton.innerHTML = '<span class="arrow">▼</span>';
                mainButton.style.padding = '4px 4px';
                mainButton.style.top = '9px';
                mainButton.style.left = '65%';
                menuContainer.style.top = '43px';
                menuContainer.style.left = '65%';
                menuItems.forEach(item => {
                    item.style.fontSize = '11px';
                });
            } else {
                mainButton.innerHTML = '角色切換 <span class="arrow">▼</span>';
                mainButton.style.top = '70px';
                mainButton.style.left = '78%';
                mainButton.style.padding = '8px 12px';
                menuContainer.style.top = '110px';
                menuContainer.style.left = '78%';
                menuItems.forEach(item => {
                    item.style.fontSize = '13px';
                });
            }
        }

        // 创建主容器
        container = document.createElement('div');
        container.id = 'character-switch-container';
        container.appendChild(mainButton);
        container.appendChild(menuContainer);
        document.body.appendChild(container);

        // 更新菜单状态
        function updateMenuState(ids) {
            highlightActiveCharacter();
            updateMenuOfflineTime();
        }

        // 初始化
        adjustPositionAndVisibility();
        highlightActiveCharacter();
        updateMenuOfflineTime();

        // 窗口大小变化防抖处理
        window.addEventListener('resize', debounce(adjustPositionAndVisibility, 500));

        // 防抖函数
        function debounce(func, delay) {
            let timer;
            return function() {
                clearTimeout(timer);
                timer = setTimeout(func, delay);
            };
        }
    }

    function init() {
        const currentDomain = window.location.hostname;
        const currentPath = window.location.pathname;
        const currentSearch = window.location.search;
        const allowedDomains = ['test.milkywayidle.com', 'www.milkywayidle.com'];
        const isCharacterSelect = currentPath === '/characterSelect';
        const isGameWithId = currentPath === '/game' && currentSearch.includes('characterId=');

        if (allowedDomains.includes(currentDomain) && (isCharacterSelect || isGameWithId)) {
            const characterIds = loadCharacterIds();
            createCollapsibleMenu(characterIds);
        }
    }

    // 页面加载与URL变化监听
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    window.addEventListener('popstate', init);
    const originalPushState = history.pushState;
    history.pushState = function(...args) {
        originalPushState.apply(this, args);
        init();
    };
    const originalReplaceState = history.replaceState;
    history.replaceState = function(...args) {
        originalReplaceState.apply(this, args);
        init();
    };
})();
// BUTTON選擇結束

