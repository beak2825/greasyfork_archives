// ==UserScript==
// @name         Pokemon Showdown！ Gen1-Gen9dlc2完整繁中漢化
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      4.0.8
// @author       WyAk
// @description  PokemonShowdown Gen1-Gen9藍之圓盤完整繁中漢化
// @match        *://china.psim.us/*
// @match        *://47.94.147.145.psim.us/*
// @match        *://replay.pokemonshowdown.com/*
// @match        *://play.pokemonshowdown.com/*
// @match        *://dex.pokemonshowdown.com/*
// @match        *://smogtours.psim.us/*
// @run-at       document-end

// @downloadURL https://update.greasyfork.org/scripts/502929/Pokemon%20Showdown%EF%BC%81%20Gen1-Gen9dlc2%E5%AE%8C%E6%95%B4%E7%B9%81%E4%B8%AD%E6%BC%A2%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/502929/Pokemon%20Showdown%EF%BC%81%20Gen1-Gen9dlc2%E5%AE%8C%E6%95%B4%E7%B9%81%E4%B8%AD%E6%BC%A2%E5%8C%96.meta.js
// ==/UserScript==
var translations = {
    //  主頁

    "Home": "主頁",
    "Format:": "規則：",
    "Team:": "隊伍：",
    "Don't allow spectators": "禁止觀眾進入",
    "Battle!": "戰鬥！",
    "Find a random opponent": "尋找一位隨機對手",
    "Teambuilder": "隊伍編輯器",
    "Ladder": "排行榜",
    "Tournaments": "錦標賽",
    "Watch a battle": "觀看對戰",
    "Find a user": "尋找用戶",
    "Games:":"遊戲：",
    "Add game": "新對戰",
    "News": "新聞",
    "Connecting...": "連接中...",
    "Searching...": "搜索中...",
    "Loading...": "載入中...",
    "Work offline": "離線模式",
    "Your team is valid for this tournament.": "您的隊伍在本次錦標賽中合法。",
    "You challenged less than 10 seconds after your last challenge! It's cancelled in case it's a misclick.": "您在上次挑戰後10秒內進行了挑戰！以防出錯，這次挑戰被取消了。",
    "Challenge cancelled because they changed their username.": "挑戰取消，因為對方更改了用戶名。",
    "Your searches and challenges have been cancelled because you changed your username.": "您的搜索和挑戰已被取消，因為您更改了用戶名。",
    "You are disconnected and cannot chat.": "您已斷線，無法聊天。",
    "This server is requesting an invalid login key.This probably means that either you are notconnected to a server, or the server is set upincorrectly.": "伺服器登錄密鑰請求無效。您沒有連接到伺服器，或者伺服器設置錯誤。",
    "The server is restarting. Battles will be available again in a few minutes.": "伺服器正在重新啓動,幾分鐘後才能開始對戰。",
    "You have been disconnected – possibly because the server was restarted.": "您已斷線 - 可能是因為伺服器已重啓。",
    "You have been logged out and disconnected.": "您已經登出並且斷線",
    "You can't battle yourself. The best you can do is open PS in Private Browsing (or another browser) and log into a different username, and battle that username.": "您無法與自己對戰。您可以在無痕瀏覽中（或其他瀏覽器）打開Pokemon Showdown登錄其他帳號，然後與該帳號進行對戰。",
    "(Others will be able to see your name change. To change name privately, use \"Log out\")": "其他人可以看到您更改了用戶名，想要私下更改用戶名，請點擊‘登出’按鈕",
    "If you wanted to change your name while staying connected, use the 'Change Name' button or the '/nick' command.": "如果您想要在保持連接的情況下更改用戶名，點擊‘更改用戶名’按鈕或者使用/nick指令。",
    "The name you chose is registered.": "您選擇的用戶名已經有人使用了。",
  	"You have been successfully registered.": "您已成功註冊。",
    "If this is your account:": "如果這是您的帳號：",
    "If this is someone else's account:": "如果這是別人的帳號：",
    "Choose another name": "選擇另一個用戶名",
    "Challenge": "挑戰",
    "Ignore": "忽略",
    "Unignore": "取消忽略",
    "Report": "舉報",
    "Chat self": "私聊自己",
    "Avatar changed to:": "頭像更換為：",
    "Choose name": "輸入用戶名",
    "Accept": "接受",
    "Reject": "拒絕",
    "OK": "確認",
    "Yes": "是",
    "No": "否",
    "Sort:": "排序方式:",
    "Couldn't connect to server!": "無法連接伺服器！",
    "Retry": "重試",
    "Retry with HTTP": "以HTTP方式重試",
    "The server is restarting soon.": "伺服器即將重新啓動。",
    "The server needs to restart because of a crash.": "由於伺服器終止需要重新啓動。",
    "No new battles can be started until the server is done restarting.": "在伺服器重新啓動之前，無法開始新的戰鬥。",
    "Please finish your battles quickly. No new battles can be started until the server resets in a few minutes.": "請盡快結束戰鬥！伺服器將在數分鐘後重置，之後無法開始任何新的戰鬥。",
    "We fixed the crash without restarting the server!": "我們在沒有重新啓動伺服器的情況下修復了錯誤！",
    "The server restart was canceled.": "伺服器取消了重新啓動。",
    "Log in": "登錄",
    "Username": "用戶名",
    "Open": "尋找",
    "Battles:": "對戰：",
    "Battles": "觀戰",
    "(All formats)": "（全部規則）",
	"(Busy)": "（忙碌）",
	"(Offline)": "（離線）",
	"(Idle)": "（閒置）",
    "Copied!": "已複製！",
    "You can only save replays for battles.": "您只能保存戰鬥的回放。",
    "Light": "亮",
    "Instant replay": " 即時回放",
    "Download replay": " 下載回放",
    "Switch sides": " 切換視角",
    "Upload and share replay": " 上傳並分享回放",
    "Register": "註冊",
    "Register your account:": "註冊您的帳號：",
    "Username:": "用戶名：",
    "Password:": "密碼：",
    "Password (confirm):": "確認密碼：",
    "What is this pokemon?": "這是哪只寶可夢? （輸入pikachu）",
    "Cancel": "取消",
    "Disconnected": "已斷線",
    "Reconnect": "重新連接",
    "1 user": "1位用戶",
    "None": "無",
    "Search": "搜索",
    "Random team": "隨機隊伍",
    "Access denied: You must be logged in as a username you're searching for.": "訪問被拒絕：您必須以您正在搜索的用戶名登錄。",
    "You are offline.": "您處於離線狀態。",
    "You have no teams": "您沒有隊伍。",
    "Because moderated chat is set, you must be of rank Voice or higher to speak in this room.": "因為設置了聊天限制，所以您必須是Voice級別或更高級別才能在這個房間里發言。",
    "You need to go into the Teambuilder and build a team for this format.": "您需要在隊伍編輯器中為這個規則新增一個隊伍。",
    "No [Gen 1] Challenge Cup 1v1 battles are going on right now.": "現在沒有正在進行的[Gen 1] Challenge Cup 1v1。",
    "No [Gen 9] Challenge Cup 1v1 battles are going on right now.": "現在沒有正在進行的[Gen 9] Challenge Cup 1v1。",
    "No [Gen 9] Challenge Cup 2v2 battles are going on right now.": "現在沒有正在進行的[Gen 9] Challenge Cup 2v2。",
    "No [Gen 9] Challenge Cup 6v6 battles are going on right now.": "現在沒有正在進行的[Gen 9] Challenge Cup 6v6。",
    "Please select a team.": "請選擇一個隊伍。",
    "No formats found": "沒有找到該規則",
    "Season rankings": "賽季排名",
    "You can't change name in the middle of these games:": "您不能在以下比賽中更改用戶名：",
    "Forfeit and change name": "棄權並更改用戶名",




	  //  隊伍編輯器

    "and": " 和 ",
    "You can also set natures by typing": "您可以在努力值框內輸入",
    "next to a stat.": "來設定性格。",
    "Backup/Restore all teams": "備份/還原所有隊伍",
    "Backup all teams from this folder": "備份該文件夾里的所有隊伍",
    "View teams uploaded to server": "查看已上傳到伺服器的隊伍",
    "Clearing your cookies (specifically,": "清除您的cookie",
    ") will delete your teams.": ") 將清空您的隊伍。",
    "If you want to clear your cookies or": "如果您想清除cookie或",
    ", you can use the Backup/Restore feature to save your teams as text first.": "，可以使用備份/還原功能先將您的隊伍保存為文件。",
    "Restore teams from backup": " 使用備份功能還原隊伍",
    "No exact match found. The closest matches alphabetically are:": "未找到完全匹配項。按字母順序最接近的匹配項是：",
    "(all)": "(全部)",
    "(uncategorized)": "(未分類)",
    "(add format folder)": "新增規則文件夾",
    "Folders": "文件夾",
    "(add folder)": "(新增文件夾)",
    "Hi": "嗨！",
    "Did you have a good day?": "您今天過的怎樣?",
    "Yes, my day was pretty good": "我今天過得很好",
    "No, it wasn't great": "不是很好",
    "Aww, that's too bad. :( I hope playing on Pokemon Showdown today can help cheer you up!": "啊，那真是太糟糕惹 :( 我希望今天你打幾場對戰能幫您振作起來！",
    "Cool! I just added some pretty cool teambuilder features, so I'm pretty happy, too. Did you know you can drag and drop teams to different format-folders? You can also drag and drop them to and from your computer (works best in Chrome).":"水噢！話說我幫隊伍編輯器新增了幾個酷酷的新功能，所以我也挺開心的啦～嘿各位，你知道嗎，隊伍編輯器裡面有不同規則的資料夾，你可以在電腦上直接將你的隊伍直接拖移過去分類噢（建議使用Chrome瀏覽器）",
    "Wait, who are you? Talking to a teambuilder is weird.":"等一下你誰啊，我現在是在跟一個隊伍編輯器聊天嗎",
    "Oh, I'm Zarel! I made a Credits button for this...":"噢我Zarel啦！話說我在這裡放了一個工作人員表的按鈕",
    "Credits":"工作人員表",
    "Isn't it pretty? Matches your background and everything. It used to be in the Main Menu but we had to get rid of it to save space.":"是不是很漂亮呀？按鈕顏色跟你的背景還有一切都超搭的～其實他以前是放在主頁面的，不過為了省空間我們只能把他移走了QQ",
    "Speaking of, you should try":"說到背景，你該試試這個",
    "changing your background":"設定背景圖片",
    "You might be having too much fun with these buttons and icons":"你很閒嘛，搞那麼多按鈕跟圖案",
    "I paid good money for those icons! I need to get my money's worth!":"我可是花了重金搞來那麼多圖案的耶，我錢總該花在刀口上吧",
    "Wait, really?":"等一下，真假！？",
    "No, they were free. That just makes it easier to get my money's worth. Let's play rock paper scissors!":"騙你的，我根本沒花半毛錢，所以我才能把我的錢花在真正的刀口上，哈！不說了，咱來玩剪刀石頭布吧",
    "Paper":"布",
    "Scissors":"剪刀",
    "Lizard":"蜥蜴",
    "Spock":"瓦肯舉手禮",
    "I play laser, I win. ":"我出雷射，我贏了。",
    "You can't do that!":"作弊！",
    "Okay, then I play peace sign ":"好啦，那我出和平",
    "everyone signs a peace treaty, ending the war and ushering in a new era of prosperity.":"大家都過來簽署和平條約，不要打架，迎來繁榮新時代",
    "I wanted to play for real...":"可我是真的想玩誒",
    "Okay, sure. I warn you, I'm using the same RNG that makes Stone Edge miss for you.":"好窩，那當然。不過我警告你喔，我用的就是會讓你尖石攻擊Miss的同款隨機數系統喔。",
    "New Team": "新的隊伍",
    "New Box": "新的箱子",
    "Undo Delete": "撤銷",
	"Delete": "刪除",
    "Situational Abilities": "偶爾有用",
    "Unviable Abilities": "完全無用",
    "Special Event Ability": "特殊特性",
    "Hidden Ability": "隱藏特性",
    "Abilities": "特性",
    "Will be": "超級進化之後，特性會變為",
    "after Mega Evolving.": "。",
    "Nickname": "昵稱",
    "Item": "道具",
    "Ability": "特性",
    "Dmax Level": "極巨等級",
    "Dmax Level:": "極巨等級：",
    "Level": "等級",
    "Gmax": "超極巨化",
    "HP Type": "覺醒",
    "Gender": "性別",
    "Happiness": "親密度",
    "Shiny": "色違",
    "Level:": "等級：",
    "Gigantamax:": "超極巨化：",
    "Terastal Type:": "太晶屬性：",
    "Gender:": "性別：",
    "Happiness:": "親密度：",
    "Shiny:": "色違：",
    "Moves": "招式",
    "Copy": "複製",
    "Import/Export": "導入/導出",
    "Move": "移動",
    "Validate": "確認是否合法",
    "Add Pokemon": "新增寶可夢",
    "Male": "雄性",
    "Female": "雌性",
    "Genderless": "無性別",
    "Format List": "規則列表",
    "List": "列表",
    "Edit": "編輯",
    "Save": "保存",
    "Switch": "交換",
    "Details": "細節",
    "Stats": "能力",
    "EVs": "努力值",
    "EV": "點數",
    "IVs": "個體值",
    "DVs": "個體值",
    "Guessed spread:": "分配推測：",
    "IV spreads": "個體值分配",
    "Remaining:": "剩餘點數：",
    "Sample sets:": "推薦配置:",
    "Base": "種族值",
    "you have no pokemon lol": "笑死，您的隊伍里還沒有寶可夢",
    "Import from text": "從文件導入",
    "Select a format": "選擇一個規則",
    "Import": "導入",
    "empty team": "空空如也",
    "Import from text or URL": "從text或URL導入",
    "Upload to PokePaste (Open Team Sheet)": "上傳到PokePaste (公開隊伍配置)",
    "Upload to PokePaste": "上傳到PokePaste",
    "Protip:": "提示：",
    "Nature:": "性格：",
    "Power": "威力",
    "Hidden Power:": "覺醒力量：",
    "Tera Type:": "太晶屬性：",
    "Tera Type": "太晶屬性",
    "Select a team": "選擇隊伍",
    "Show all teams": "顯示所有隊伍",
    "Add a Pokemon to your team before uploading it!": "上傳之前先將寶可夢新增到您的隊伍中！",
    "You need at least one Pokemon to validate.": "您需要至少一個寶可夢來確認是否合法。",
    "Clear clipboard": "清除剪貼簿",
    "No move": "沒有招式",
    "Clipboard:": "剪貼簿：",
    "Other teams":"其他隊伍",
    "Upload to Showdown database (saves across devices)":"上傳到Showdown數據庫（跨設備保存)",
    "Browsers sometimes randomly clear cookies - you should upload your teams to the Showdown database or make a backup yourself if you want to make sure you don't lose them.": "瀏覽器有時會隨機清除cookie - 如果您想確保不會丟失隊伍，您應該將隊伍上傳到Showdown數據庫，或者自己備份。",
    "(Private:":"(私人的：",
    "(No Folder)": "（無文件夾）",
    "Group by folders": "按文件夾分組",
    "Change sprite": "更改形態",
    "Create folder": "創建文件夾",
    "Folder name:": "文件夾名稱",
    "Illegal": "不合法",
    "Pick a variant or": "選擇形態 ",
    "HP": "HP",
    "Attack":"攻擊",
    "Defense": "防禦",
    "SpA":"特攻",
    "SpD":"特防",
    "Sp. Atk": "特攻",
    "Sp. Def": "特防",
    "Sp. Atk.": "特攻",
    "Sp. Def.": "特防",
    "Speed": "速度",
    "BST": "總和",
    "Name": "名字",
    "Type": "屬性",
    "Cat": "分類",
    "Pow": "威力",
    "Acc": "命中",
    "Types": "屬性",
    "Physical": "物理",
    "Special": "特殊",
    "Status": "變化",
    "Filters:": "過濾: ",
    "(backspace = delete filter)": "(Backspace = 清除過濾)",
    "Illegal results": "不合法的",
    "Usually useless moves": "通常沒啥用的招式",
    "Sketched moves": "通過寫生獲得的招式",
    "Useless sketched moves": "無用的寫生招式",
    "Moves": "招式",
    "Paste!": " 貼上！",
    "No item": "沒有道具",
    "Number": "默認",
    "Unreleased": "未發布的",
    "Hp": "HP",
    "Atk": "攻擊",
    "Def": "防禦",
    "Spa": "特攻",
    "SpA": "特攻",
    "Spd": "特防",
    "SpD": "特防",
    "Spe": "速度",
    "Spc": "特殊",
    "Evasion": "閃避率",
    "evasiveness": "閃避率",
    "accuracy": "命中率",
    "Teambuilding resources for this tier:": "該規則的組隊資料：",
    "Find more helpful resources for this tier on": "尋找更多有關該規則的資料： ",
    "Find helpful resources for this tier on": "尋找有關該規則的資料： ",

    "Total:": "總和：",
    "Evolution:": "進化：",
    "Base stats:": "努力值：",
    "Attack:": "攻擊：",
    "Defense:": "防禦：",
    "Sp. Atk:": "特攻：",
    "Sp. Def:": "特防：",
    "Egg groups:": "蛋群：",
    "Gender ratio:": "性別比例：",
    "Size:": "身高，體重：",
    "Accuracy:": "命中率：",
    "Level-up": "等級提升",
    "Generation 10": "第十世代",
    "Generation 9": "第九世代",
    "Generation 8": "第八世代",
    "Generation 7": "第七世代",
    "Generation 6": "第六世代",
    "Generation 5": "第五世代",
    "Generation 4": "第四世代",
    "Generation 3": "第三世代",
    "Generation 2": "第二世代",
    "Generation 1": "第一世代",
    "Types:": "屬性：",
    "Type:": "屬性：",

    "Bug-type moves": "蟲屬性招式",
    "Dark-type moves": "惡屬性招式",
    "Dragon-type moves": "龍屬性招式",
    "Electric-type moves": "電屬性招式",
    "Fighting-type moves": "格鬥屬性招式",
    "Fire-type moves": "火屬性招式",
    "Flying-type moves": "飛行屬性招式",
    "Fairy-type moves": "妖精屬性招式",
    "Ghost-type moves": "幽靈屬性招式",
    "Grass-type moves": "草屬性招式",
    "Ground-type moves": "地面屬性招式",
    "Ice-type moves": "冰屬性招式",
    "Normal-type moves": "一般屬性招式",
    "Poison-type moves": "毒屬性招式",
    "Rock-type moves": "岩石屬性招式",
    "Steel-type moves": "鋼屬性招式",
    "Water-type moves": "水屬性招式",

    "(automatic type)": "(自動屬性)",
    "Bug": "蟲",
    "Dark": "惡",
    "Dragon": "龍",
    "Electric": "電",
    "Fighting": "格鬥",
    "Fire": "火",
    "Flying": "飛行",
    "Fairy": "妖精",
    "Ghost": "幽靈",
    "Grass": "草",
    "Ground": "地面",
    "Ice": "冰",
    "Normal": "一般",
    "Poison": "毒",
    "Rock": "岩石",
    "Steel": "鋼",
    "Water": "水",
    "Stellar": "星晶",

    "Fast Bulky Support": "高速耐久輔助",
    "Fast Specs": "速攻型眼鏡",
    "Fast Band": "速攻型頭帶",
    "Bulky Specs": "耐久型眼鏡",
    "Bulky Band": "耐久型頭帶",
    "Bulky Scarf": "耐久型圍巾",
    "Physical Scarf": "物攻圍巾",
    "Special Scarf": "特攻圍巾",
    "Physical Biased Mixed Scarf": "主物攻雙刀圍巾",
    "Special Biased Mixed Scarf": "主特攻雙刀圍巾",
    "Physically Defensive": "物理盾",
    "Specially Defensive": "特殊盾",
    "Fast Physical Sweeper": "高速物攻輸出手",
    "Fast Special Sweeper": "高速特攻輸出手",
    "Bulky Physical Sweeper": "耐久物攻輸出手",
    "Bulky Special Sweeper": "耐久特攻輸出手",


    "Adamant (+Atk, -SpA)": "固執 (+攻擊, -特攻)",
    "Bashful": "害羞",
    "Bold (+Def, -Atk)": "大膽 (+防禦, -攻擊)",
    "Brave (+Atk, -Spe)": "勇敢 (+攻擊, -速度)",
    "Calm (+SpD, -Atk)": "溫和 (+特防, -攻擊)",
    "Careful (+SpD, -SpA)": "慎重 (+特防, -特攻)",
    "Docile": "坦率",
    "Gentle (+SpD, -Def)": "溫順 (+特防, -防禦)",
    "Hardy": "勤奮",
    "Hasty (+Spe, -Def)": "急躁 (+速度, -防禦)",
    "Impish (+Def, -SpA)": "淘氣 (+防禦, -特攻)",
    "Jolly (+Spe, -SpA)": "爽朗 (+速度, -特攻)",
    "Lax (+Def, -SpD)": "樂天 (+防禦, -特防)",
    "Lonely (+Atk, -Def)": "怕寂寞 (+攻擊, -防禦)",
    "Mild (+SpA, -Def)": "慢吞吞 (+特攻, -防禦)",
    "Modest (+SpA, -Atk)": "內斂 (+特攻, -攻擊)",
    "Naive (+Spe, -SpD)": "天真 (+速度, -特防)",
    "Naughty (+Atk, -SpD)": "頑皮 (+攻擊, -特防)",
    "Quiet (+SpA, -Spe)": "冷靜 (+特攻, -速度)",
    "Quirky": "浮躁",
    "Rash (+SpA, -SpD)": "馬虎 (+特攻, -特防)",
    "Relaxed (+Def, -Spe)": "悠閒 (+防禦, -速度)",
    "Sassy (+SpD, -Spe)": "自大 (+特防, -速度)",
    "Serious": "認真",
    "Timid (+Spe, -Atk)": "膽小 (+速度, -攻擊)",




   	//  設置

    "Change avatar": "更換頭像",
    "Choose an avatar or": "選擇一個頭像 ",
    "Wrong password.": "密碼錯誤。",
    "Change your password:":"更改您的密碼：" ,
    "Old password:": "舊密碼：",
    "New password:": "新密碼：",
    "New password (confirm):": "新密碼（再輸入一次）",
    "Change password": "更改密碼",
    "Password change": "更改密碼",
    "Your old password was incorrect.": "您的舊密碼不正確。",
    "Your new passwords do not match.": "您的新密碼不匹配。",
    "Your passwords do not match.": "您的密碼不匹配。",
    "Your password was successfully changed.": "您的密碼已成功更改。",
    "Your username is no longer available.": "您選擇的用戶名不可用。",
    "Graphics": "界面：",
    "Layout:": "布局：",
    "◫ Left and right panels": "◫ 雙面板",
    "◻ Single panel": "◻ 單面板",
    "Background:": "背景：",
    "Default": "默認",
    "Official": "官方",
    "Random": "隨機",
    "Custom": "自定義",
    "Drag and drop an image to PS (the background settings don't need to be open), or upload:": "將圖像拖放到PS（背景設置不需要打開），或上傳",
    "Done": "完成",
    "Dark mode": "夜間模式",
    "Change background": "更改背景",
    "Disable animations": "禁止戰鬥動畫",
    "Use BW sprites instead of XY models": "使用黑/白系列的寶可夢圖像替代X/Y建模",
    "Use modern sprites for past generations": "當戰鬥規則為舊世代時，使用最新的寶可夢圖像",
    "Chat": "聊天",
    "Chatrooms:": "聊天室：",
    "Private rooms:": "隱藏房間：",
    "Ignore tournaments": "忽略淘汰賽（信息）",
    "Block PMs": "屏蔽私聊信息",
    "Block Challenges": "屏蔽挑戰",
    "Show PMs in chat rooms": "在聊天室顯示私聊信息",
    "Highlight when your name is said in chat": "當您的名字出現在聊天視窗時，名字顏色會高亮",
    "Notifications disappear automatically": "通知自動消失",
    "Confirm before leaving a room": "離開房間前確認",
    "Confirm before refreshing": "刷新前確認",
    "Theme:": "主題：",
    "Avatar...": "更換頭像...",
    "Password...": "更改密碼...",
    "Prompt on refresh": "刷新頁面時彈出提醒視窗",
    "Language:": "語言：",
    "Timestamps in chat rooms:": "聊天室中的時間顯示：",
    "Music Off": "關閉音樂",
    "On": "開啟",
    "Off": "不開啟",
    "Tournaments:": "房間比賽信息：",
    "Notifications": "接收消息",
    "No Notifications": "不接收消息",
    "Timestamps in PMs:": "私聊中的時間顯示：",
    "Chat preferences:": "聊天偏好：",
    "Text formatting": "文件格式",
    "Usable formatting:":"可用格式：",
    "Edit formatting": "改變格式",
    "You can choose to display formatted text as normal text": "您可以選擇顯示文字的布局為普通布局",
    "Change name": "更改用戶名",
    "Log out": "登出",
    "Effect volume:": "寶可夢叫聲音量：",
    "Music volume:": "背景音樂音量：",
    "Notification volume:": "通知提醒音量：",









	  //  聊天

    "Scouting is banned: tournament players can't watch other tournament battles.":"禁止觀戰：參賽選手不能觀看比賽。",
    "Minimum Elo:": "最低Elo限制：",
    "Show more rooms": "顯示更多房間",
    "Hide more rooms": "隱藏更多房間",
    "Hidden rooms": "隱藏的房間",
    "Room name:": "房間名：",
    "Join room": "加入房間",
    "Join chat": "加入聊天室",
    "Join lobby chat": "加入大廳聊天室",
    "users online": "在線用戶",
    "active battle": "正在對戰",
    "active battles": "正在對戰",
    "Official chat rooms": "官方聊天室",
	"PSPL Winner":"PSPL獲勝者",
    "Chat rooms": "聊天室",
    "Subrooms:": "子房間：",
    "All rooms": "全部房間",
    "Battle formats": "戰鬥規則",
    "Languages": "語言",
    "Entertainment": "遊戲娛樂",
    "Gaming": "電子遊戲",
    "Life & hobbies": "生活與愛好",
    "On-site games": "在線遊戲",
    "Hide": "隱藏",
    "In Progress": "進行中",
    "Challenging": "挑戰中",
    "Signups": "報名中",
    "Only guests": "僅有遊客",
    "Toggle": "展開",
    "Pop-out": "打開",
    "In-progress": "進行中",
    "Unavailable": "未開始",
    "Ready!": "準備就緒！",
    "Join": "加入",
    "Leave": "離開",
    "Rooms filter:": "房間篩選：",
    "The tournament was forcibly ended.": "錦標賽被強制結束了。",
    "You must be registered to chat in temporary rooms (like battles).": "注冊後才能在戰鬥房間聊天。",
    "You may register in the": "您可以在 ",
    "Options": "選項",
    "menu.": " 菜單中注冊。",
    "You must be autoconfirmed to use offine messaging.": "您必須經過自動確認後才能發送離線消息。",
    "That user is unregistered and cannot be PMed.": "該用戶未注冊，無法進行私聊。",
    "Ladder isn't responding, score probably updated but might not have (Request timeout).": "排行榜沒有響應，分數可能已更新，也可能沒有(請求超時)。",




	  //  好友

    "Your friends:": "您的好友",
    "you have no friends added on Showdown lol": "您沒有在Showdown上新增好友",
    "To add a friend, use": "如果要新增好友，請使用",
    "Page unavailable": "頁面不可用",
    "Settings": "設置",
    "Sent": "已發送",
    "Received": "待處理",
    "Friends Settings:": "好友設置：",
    "Allow": "允許",
    "Notify me when my friends come online:": "好友上線通知：",
    "Receive friend requests:": "接受好友申請：",
    "Allow others to see your list:": "允許其他人查看您的好友列表：",
    "Allow others to see my login times": "允許其他人查看我的登錄時間：",
    "Allow friends to see my hidden battles on the spectator list:": "允許好友在觀戰列表中看到您隱藏的戰鬥：",
    "Block challenges except from friends (and staff):": "好友（和管理人員）以外的用戶禁止對您發起挑戰：",
    "Block PMs except from friends (and staff):": "好友（和管理人員）以外的用戶禁止向您發起私聊：",
    "This user is blocking private messages right now.": "此用戶現在拒收了私聊消息。",
    "Note: If this request is accepted, your friend will be notified when you come online, and you will be notified when they do, unless you opt out of receiving them.": "注意：如果接受了該請求，您的好友將在您上線時收到通知，他們上線時也會通知您，除非您選擇了不接收。",
    "Deny": "拒絕",
    "Disable": "不開啟",
    "Enable": "開啟",
    "(You can also stop this user from sending you friend requests with": "（您可以使用這個指令禁止該用戶向您發送好友請求",
    "sent you a friend request!": "向您發送了好友請求！",
    "You must be autoconfirmed to use the friends feature.": "注冊賬號一星期後才能使用好友功能。",
    "Undo": "撤銷",
    "You have no outgoing friend requests pending.": "您沒有需要處理的好友請求。",
    "You have no friends to spectate.": "您沒有可觀戰的好友。",
    " to allow your friends to see your hidden battles on this page.": " 可以讓好友觀看您隱藏的對戰。",
    "Spectate your friends:": "觀戰您的好友：",
    "Spectating": "觀戰",
    "Spectate": "觀戰",
    "All Friends": "全部好友",
    "Add friend:": "新增好友：",
    "Add friend": "新增好友",
    "Remove friend": "刪除好友",
    "Friend removed.": "好友已刪除。",
    "Friend request sent!": "好友請求已發送！",
    "You are already not receiving friend notifications.": "您尚未收到好友通知。",
	"You are now blocking private messages, except from staff.":"您正在屏蔽除了管理員之外的私聊信息。",
	"You are no longer blocking private messages.":"您不再屏蔽私聊信息。",
  	"You are now blocking all incoming challenge requests.":"您正在屏蔽所有挑戰請求。",
    "You are now blocking challenges, except from staff and friended users.":"您正在拒收挑戰，來自管理人員和好友的挑戰除外。",
  	"You are available for challenges from now on.":"您不再屏蔽挑戰請求。",
    "You are now blocking private messages, except from staff and friends.": "您正在屏蔽私人消息，來自管理人員和好友的消息除外。",
    "You are now allowing your friends to see your ongoing battles.": "您現在允許您的好友看到您正在進行的戰鬥。",
    "You are now hiding your ongoing battles from your friends.": "您現在對好友隱藏您正在進行的戰鬥。",
    "You are now allowing your friends to see your login times.": "您現在允許您的好友查看您的登錄時間。",
    "You are now hiding your login times from your friends.": "您現在向好友隱藏您的登錄時間。",
    "You are now allowing other people to view your friends list.": "您現在允許其他人查看您的好友列表。",
    "You are now hiding your friends list.": "您現在隱藏了您的好友列表。",
    "You are now allowing friend requests.": "您現在允許好友請求。",
    "You are now blocking incoming friend requests.": "您現在拒收好友請求。",
    "You will not receive friend notifications.": "您將不會收到好友通知。",
    "You will now receive friend notifications.": "您現在將收到好友通知。",
    "You have no pending friend requests.": "您沒有待處理的好友請求。",
    "You must be registered to send private messages.": "您必須注冊才能發送私人消息。",
    "Friends": "好友",
    "Add": "新增",



      //  上傳隊伍

    "Search your teams": "搜索您的隊伍",
    "Browse public teams": "瀏覽公開隊伍",
    "Upload new": "上傳新的隊伍",
    "Upload a team": "上傳隊伍",
    "Search all teams": "搜索所有隊伍",
    "Team format:": "隊伍規則：",
    "Generation:": "世代：",
    "Pokemon:": "寶可夢：",
    "Abilities:": "特性：",
    "Moves:": "招式：",
    "Search!": "搜索！",
    "Search in team:": "隊伍搜索：",
    "Search metadata:": "搜索參數：",
    "(separate different searches with commas)": "(可以用逗號分隔多種搜索)",
    "What's the name of the team?": "隊伍叫什麼名字？",
    "What's the team's format?": "隊伍是哪個規則？",
    "Uploaded by:": "上傳者：",
    "Manage": "管理",
    "Make private": "設置為私人的",
    "Team privacy": "私人隊伍",
    "Team format": "隊伍規則",
    "Team name": "隊伍名字",
    "Delete team": "刪除隊伍",
    "Edit team": "編輯隊伍",
    "Make public": "設置為公開的",
    "in chat to share!)": "以分享！）",
    "Team set to public.": "隊伍已設置成公開。",
    "View full team": "複製完整隊伍",
    "(or copy/paste": "（或在聊天中複製/粘貼",
    "Shareable link to team": "可分享的隊伍",
    "Provide the team:": "提供隊伍:",
    "Should the team be private? (yes/no)": "隊伍是私人的嗎?(是/否)",
    "Upload team": "上傳隊伍",
    "Upload Team": "上傳隊伍",
    "Team": "隊伍",
    "No results found.": "沒有找到結果。",
    "Submitted!": "已提交！",
    "Manage (edit/delete/etc)": "管理隊伍（編輯/刪除/其他）",


    //  舉報

    "Request Help": "尋求幫助",
    "Request help from global staff": "向管理人員尋求幫助",
    "What do you want to report someone for?": "你想舉報某人的原因？",
    "Someone is harassing me in PMs": "有人在私聊中騷擾我",
    "Someone is harassing me in a battle": "有人在戰鬥中騷擾我",
    "Someone is using an offensive username": "有人使用令人不適的用戶名",
    "Someone is using offensive Pokemon nicknames": "有人使用令人不適的寶可夢昵稱",
    "Someone is hacking or cheating in my battle": "有人在我的戰鬥中進行黑客攻擊或作弊",
    "I want to report someone": "我想舉報某人",
    "If someone is harassing you in private messages (PMs), click the button below and a global staff member will take a look. If you are being harassed in a chatroom, please ask a room staff member to handle it. If it's a minor issue, consider using": "如果有人在私聊中騷擾你，請單擊下面的按鈕，管理人員會查看。如果你在聊天室受到騷擾，請讓聊天室工作人員處理。如果只是小問題，請考慮使用",
    "instead.": "。",
    "Report harassment in a private message (PM)": "舉報：私聊中的騷擾",
    "What's going on?": "發送了什麼？",
    "I want to appeal a punishment": "我想對處罰提出上訴",
    "Something else": "其他選項",
    "Abuse of Help requests can result in punishments.": "濫用尋求幫助功能可能會受到懲罰。",
    "Maybe one of these options will be helpful?": "也許其中一個選項會有幫助？",
    "Other": "其他",
    "If someone is harassing you in a battle, click the button below and a global staff member will take a look. If you are being harassed in a chatroom, please ask a room staff member to handle it. If it's a minor issue, consider using": "如果有人在戰鬥中騷擾你，請單擊下面的按鈕，管理人員會查看。如果你在聊天室受到騷擾，請讓聊天室工作人員處理。如果只是小問題，請考慮使用",
    "Please save a replay of the battle if it has ended, or provide a link to the battle if it is still ongoing.": "如果戰鬥已經結束，請保存戰鬥回放，如果戰鬥仍在進行，請提供戰鬥鏈接。",
    "Report harassment in a battle": "舉報：戰鬥中的騷擾",
    "If a user has an inappropriate name, click the button below and a global staff member will take a look.": "如果用戶的名字令人不適，請單擊下面的按鈕，管理人員會查看。",
    "Report an inappropriate username": "舉報：令人不適的用戶名",
    "If a user has inappropriate Pokemon nicknames, click the button below and a global staff member will take a look.": "如果寶可夢的昵稱令人不適，請單擊下面的按鈕，管理人員會查看。",
    "Report inappropriate Pokemon nicknames": "舉報：令人不適的寶可夢昵稱",
    "Your opponent cannot control how lucky or unlucky you are, what moves you choose, or the mechanics of the battle. You may just be misunderstanding what happened in your battle!": "你的對手無法控制你的運氣、你選擇的招式或戰鬥的機制。你可能只是誤解了戰鬥中發生的事情！",
    "I am punished but do not fall under any of the above.": "我受到了懲罰，但並不屬於上述任何一種。",




	  //  回放

    "(muted)": "（已靜音）",
    "Sound:": "聲音:",
    "Mute sounds": "全部靜音",
    "Muted": "全部靜音",
    "Dark mode:": "亮度:",
    "Automatic": "自動",
    "Speed:": "速度:",
    "Pause": "暫停",
    "Play": "繼續",
    "Prev turn": "上一回合",
    "Skip turn": "下一回合",
    "First turn": "第一回合",
    "Skip to end": "最後一回合",
    "Viewpoint:": "視角:",
    "Switch viewpoint": "切換視角",
    "Hyperfast": "極快",
    "Fast": "快",
    "Slow": "慢",
    "Really slow": "極慢",
    "Music:": "音樂：",
    "Play (sound off)": "播放 (關閉音樂)",
    "Reset": "重置",
    "Next turn": "下一回合",
    "Go to turn...": "跳至...回合",
    "Resume": "恢覆",
	"Forfeit": "投降",
    "Open replay in new tab": "在新的視窗打開回放",
    "Search replays": "搜索回放",
    "Public": "公開的",
    "Private (your own replays only)": "私人的 (您自己的回放)",
    "Featured replays": "特色回放",
    "Recent replays": "最近的回放",
    "More replays": "更多回放",
    "More": "更多",
    "Replay": "回放",






	//  條款

    "Sleep Moves Clause:": "催眠招式條款：",
    "Sleep-inducing moves are banned": "禁止使用催眠招式",
    "Sleep Clause Mod:": "催眠條款：",
    "Limit one foe put to sleep": "最多只能催眠一只對手的寶可夢",
    "Species Reveal Clause:": "物種揭示條款：",
    "Reveals a Pokemon's true species in hackmons-based metagames.": "揭示寶可夢的真實物種",
    "Species Clause:": "物種條款：",
    "Limit one of each Pokemon": "禁止使用相同寶可夢",
    "Forme Clause:": "形態條款：",
    "Limit one of each forme of a Pokemon": "禁止使用相同形態的寶可夢",
    "OHKO Clause:": "一擊必殺條款：",
    "OHKO moves are banned": "禁止使用一擊必殺招式",
    "Moody Clause:": "心情不定條款：",
    "Moody is banned": "禁止使用心情不定特性",
    "Evasion Moves Clause:": "閃避招式條款：",
    "Evasion moves are banned": "禁止使用提升閃避率的招式",
    "Evasion Items Clause:": "閃避道具條款：",
    "Evasion items are banned": "禁止使用提升閃避率的道具",
    "Endless Battle Clause:": "無限戰鬥條款：",
    "Forcing endless battles is banned": "禁止無休止的戰鬥",
    "HP Percentage Mod:": "HP百分比模式：",
    "HP is shown in percentages": "HP以百分比顯示",
    "HP is reported as percentages": "HP以百分比公布",
    "Mega Rayquaza Clause:": "烈空坐超級進化條款：",
    "Mega Rayquaza Ban Mod:": "烈空坐超級進化條款：",
    "You cannot mega evolve Rayquaza": "你不能超級進化烈空坐",
    "Swagger Clause:": "虛張聲勢條款：",
    "Swagger is banned": "禁止使用虛張聲勢",
    "Same Type Clause:": "同屬性條款：",
    "Pokemon in a team must share a type": "隊伍中的寶可夢必須擁有某個相同的屬性",
    "Accuracy Moves Clause:": "命中招式條款：",
    "Accuracy-lowering moves are banned": "禁止使用降低命中率的招式",
    "Item Clause:": "道具條款：",
    "Limit one of each item": "禁止攜帶相同道具",
    "1 Ability Clause:": "特性條款：",
    "Limit 1 of each ability": "禁止使用重覆特性",
    "2 Ability Clause:": "特性條款：",
    "Limit 2 of each ability": "最多使用兩個同一特性",
    "Evasion Clause:": "閃避條款：",
    "Evasion abilities, items, and moves are banned": "禁止使用閃避特性、道具和招式",
    "Evasion Abilities Clause:": "閃避特性條款：",
    "Evasion abilities are banned": "禁止使用提高閃避率的特性",
    "CFZ Clause:": "Z純晶條款：",
    "Crystal-free Z-Moves are banned": "禁止不攜帶Z純晶使用的Z招式",
    "Freeze Clause Mod:": "冰凍條款：",
    "Limit one foe frozen": "最多只能冰凍一只對手的寶可夢",
    "Ability Clause:": "特性條款：",
    "Limit two of each ability": "隊伍最多只能有兩個相同特性",
    "Switch Priority Clause Mod:": "替換條款：",
    "Faster Pokemon switch first": "速度快的寶可夢優先執行交換",
    "Baton Pass Clause:": "接棒條款：",
    "Limit one Baton Passer, can't pass Spe and other stats simultaneously": "最多只能攜帶一只習得接棒的寶可夢，且不能同時傳遞速度和其他能力等級",
    "Gravity Sleep Clause:": "重力催眠條款：",
    "The combination of Gravity and sleep-inducing moves with imperfect accuracy are banned": "禁止將命中率不滿的催眠招式與重力相結合",
    "The combination of sleep-inducing moves with imperfect accuracy and Gravity or Gigantamax Orbeetle are banned": "禁止將命中率不滿的催眠招式與重力或超極巨天道七星相結合",
    "Illusion Level Mod:": "幻覺等級條款：",
    "Illusion disguises the Pokemon's true level": "幻覺會掩飾真實的等級",
    "Blitz:": "閃擊戰：",
    "Super-fast timer": "超快的計時器",
    "One Boost Passer Clause:": "一個接棒手條款：",
    "Limit one Baton Passer that has a way to boost its stats": "最多只能攜帶一只習得接棒且可以提升能力等級的寶可夢",
    "3 Baton Pass Clause:": "三個接棒手條款：",
    "Limit three Baton Passers": "最多只能攜帶三只習得接棒的寶可夢",
    "Baton Pass Stat Clause:": "接棒能力條款：",
    "No Baton Passer may have a way to boost its stats": "習得接棒的寶可夢禁止提升能力等級",
    "Dynamax Clause:": "極巨化條款：",
    "You cannot dynamax": "你不能使用極巨化",
    "Terastal Clause:": "太晶化條款：",
    "You cannot Terastallize": "你不能使用太晶化",





    //  特性

    "Stench": "惡臭",
    "Drizzle": "降雨",
    "Speed Boost": "加速",
    "Frisk": "察覺",
    "Battle Armor": "戰鬥盔甲",
    "Sturdy": "結實",
    "Damp": "濕氣",
    "Limber": "柔軟",
    "Sand Veil": "沙隱",
    "Static": "靜電",
    "Volt Absorb": "蓄電",
    "Water Absorb": "儲水",
    "Oblivious": "遲鈍",
    "Cloud Nine": "無關天氣",
    "Compound Eyes": "複眼",
    "Insomnia": "不眠",
    "Color Change": "變色",
    "Immunity": "免疫",
    "Flash Fire": "引火",
    "Shield Dust": "鱗粉",
    "Own Tempo": "我行我素",
    "Suction Cups": "吸盤",
    "Intimidate": "威嚇",
    "Shadow Tag": "踩影",
    "Rough Skin": "粗糙皮膚",
    "Wonder Guard": "神奇守護",
    "Levitate": "飄浮",
    "Effect Spore": "孢子",
    "Synchronize": "同步",
    "Clear Body": "恆凈之軀",
    "Natural Cure": "自然回復",
    "Lightning Rod": "避雷針",
    "Serene Grace": "天恩",
    "Swift Swim": "悠遊自如",
    "Chlorophyll": "葉綠素",
    "Illuminate": "發光",
    "Trace": "複製",
    "Huge Power": "大力士",
    "Poison Point": "毒刺",
    "Inner Focus": "精神力",
    "Magma Armor": "熔岩鎧甲",
    "Water Veil": "水幕",
    "Magnet Pull": "磁力",
    "Soundproof": "隔音",
    "Rain Dish": "雨盤",
    "Sand Stream": "揚沙",
    "Pressure": "壓迫感",
    "Thick Fat": "厚脂肪",
    "Early Bird": "早起",
    "Flame Body": "火焰之軀",
    "Run Away": "逃跑",
    "Keen Eye": "銳利目光",
    "Hyper Cutter": "怪力鉗",
    "Pickup": "撿拾",
    "Truant": "懶惰",
    "Hustle": "活力",
    "Cute Charm": "迷人之軀",
    "Plus": "正電",
    "Minus": "負電",
    "Forecast": "陰晴不定",
    "Sticky Hold": "黏著",
    "Shed Skin": "蛻皮",
    "Guts": "毅力",
    "Marvel Scale": "神奇鱗片",
    "Liquid Ooze": "污泥漿",
    "Overgrow": "茂盛",
    "Blaze": "猛火",
    "Torrent": "激流",
    "Swarm": "蟲之預感",
    "Rock Head": "堅硬腦袋",
    "Drought": "日照",
    "Arena Trap": "沙穴",
    "Vital Spirit": "幹勁",
    "White Smoke": "白色煙霧",
    "Pure Power": "瑜珈之力",
    "Shell Armor": "硬殼盔甲",
    "Air Lock": "氣閘",
    "Tangled Feet": "蹣跚",
    "Motor Drive": "電氣引擎",
    "Rivalry": "鬥爭心",
    "Steadfast": "不屈之心",
    "Snow Cloak": "雪隱",
    "Gluttony": "貪吃鬼",
    "Anger Point": "憤怒穴位",
    "Unburden": "輕裝",
    "Heatproof": "耐熱",
    "Simple": "單純",
    "Dry Skin": "幹燥皮膚",
    "Download": "下載",
    "Iron Fist": "鐵拳",
    "Poison Heal": "毒療",
    "Adaptability": "適應力",
    "Skill Link": "連續攻擊",
    "Hydration": "濕潤之軀",
    "Solar Power": "太陽之力",
    "Quick Feet": "飛毛腿",
    "Normalize": "一般皮膚",
    "Sniper": "狙擊手",
    "Magic Guard": "魔法防守",
    "No Guard": "無防守",
    "Stall": "慢出",
    "Technician": "技術高手",
    "Leaf Guard": "葉子防守",
    "Klutz": "笨拙",
    "Mold Breaker": "破格",
    "Super Luck": "超幸運",
    "Aftermath": "引爆",
    "Anticipation": "危險預知",
    "Forewarn": "預知夢",
    "Unaware": "純樸",
    "Tinted Lens": "有色眼鏡",
    "Filter": "過濾",
    "Slow Start": "慢啟動",
    "Scrappy": "膽量",
    "Storm Drain": "引水",
    "Ice Body": "冰凍之軀",
    "Solid Rock": "堅硬岩石",
    "Snow Warning": "降雪",
    "Honey Gather": "採蜜",
    "Reckless": "捨身",
    "Multitype": "多屬性",
    "Flower Gift": "花之禮",
    "Bad Dreams": "夢魘",
    "Pickpocket": "順手牽羊",
    "Sheer Force": "強行",
    "Contrary": "唱反調",
    "Unnerve": "緊張感",
    "Defiant": "不服輸",
    "Defeatist": "軟弱",
    "Cursed Body": "詛咒之軀",
    "Healer": "治癒之心",
    "Friend Guard": "友情防守",
    "Weak Armor": "碎裂鎧甲",
    "Heavy Metal": "重金屬",
    "Light Metal": "輕金屬",
    "Multiscale": "多重鱗片",
    "Toxic Boost": "中毒激升",
    "Flare Boost": "受熱激升",
    "Harvest": "收獲",
    "Telepathy": "心靈感應",
    "Moody": "心情不定",
    "Overcoat": "防塵",
    "Poison Touch": "毒手",
    "Regenerator": "再生力",
    "Big Pecks": "健壯胸肌",
    "Sand Rush": "撥沙",
    "Wonder Skin": "奇跡皮膚",
    "Analytic": "分析",
    "Illusion": "幻覺",
    "Imposter": "變身者",
    "Infiltrator": "穿透",
    "Mummy": "木乃伊",
    "Moxie": "自信過度",
    "Justified": "正義之心",
    "Rattled": "膽怯",
    "Magic Bounce": "魔法鏡",
    "Sap Sipper": "食草",
    "Prankster": "惡作劇之心",
    "Sand Force": "沙之力",
    "Iron Barbs": "鐵刺",
    "Zen Mode": "達摩模式",
    "Victory Star": "勝利之星",
    "Turboblaze": "渦輪火焰",
    "Teravolt": "兆級電壓",
    "Aerilate": "飛行皮膚",
    "Aura Break": "氣場破壞",
    "Cheek Pouch": "頰囊",
    "Dark Aura": "暗黑氣場",
    "Fairy Aura": "妖精氣場",
    "Flower Veil": "花幕",
    "Fur Coat": "毛皮大衣",
    "Mega Launcher": "超級發射器",
    "Parental Bond": "親子愛",
    "Pixilate": "妖精皮膚",
    "Protean": "變幻自如",
    "Refrigerate": "冰凍皮膚",
    "Stance Change": "戰鬥切換",
    "Strong Jaw": "強壯之顎",
    "Sweet Veil": "甜幕",
    "Tough Claws": "硬爪",
    "Competitive": "好勝",
    "Gale Wings": "疾風之翼",
    "Gooey": "黏滑",
    "Aroma Veil": "芳香幕",
    "Bulletproof": "防彈",
    "Grass Pelt": "草之毛皮",
    "Magician": "魔術師",
    "Symbiosis": "共生",
    "Desolate Land": "終結之地",
    "Primordial Sea": "始源之海",
    "Delta Stream": "德爾塔氣流",
    "Full Metal Body": "金屬防護",
    "Shadow Shield": "幻影防守",
    "Comatose": "絕對睡眠",
    "Power Construct": "群聚變形",
    "Soul-Heart": "魂心",
    "Stakeout": "監視",
    "Electric Surge": "電氣制造者",
    "Dazzling": "鮮艷之軀",
    "Berserk": "怒火沖天",
    "Battery": "蓄電池",
    "Corrosion": "腐蝕",
    "Disguise": "畫皮",
    "Fluffy": "毛茸茸",
    "Stamina": "持久力",
    "Triage": "先行治療",
    "Wimp Out": "躍躍欲逃",
    "Dancer": "舞者",
    "Shields Down": "界限盾殼",
    "Innards Out": "飛出的內在物",
    "Schooling": "魚群",
    "Surge Surfer": "沖浪之尾",
    "Water Compaction": "遇水凝固",
    "Queenly Majesty": "女王的威嚴",
    "Battle Bond": "牽絆變身",
    "Receiver": "接球手",
    "RKS System": "AR系統",
    "Psychic Surge": "精神制造者",
    "Grassy Surge": "青草制造者",
    "Misty Surge": "薄霧制造者",
    "Slush Rush": "撥雪",
    "Emergency Exit": "危險回避",
    "Merciless": "不仁不義",
    "Water Bubble": "水泡",
    "Steelworker": "鋼能力者",
    "Long Reach": "遠隔",
    "Liquid Voice": "濕潤之聲",
    "Galvanize": "電氣皮膚",
    "Tangling Hair": "捲髮",
    "Power of Alchemy": "化學之力",
    "Beast Boost": "異獸提升",
    "Prism Armor": "棱鏡裝甲",
    "Neuroforce": "腦核之力",
    "Intrepid Sword": "不撓之劍",
    "Dauntless Shield": "不屈之盾",
    "Libero": "自由者",
    "Ball Fetch": "撿球",
    "Cotton Down": "棉絮",
    "Propeller Tail": "螺旋尾鰭",
    "Mirror Armor": "鏡甲",
    "Gulp Missile": "一口飛彈",
    "Stalwart": "堅毅",
    "Steam Engine": "蒸汽機",
    "Punk Rock": "龐克搖滾",
    "Sand Spit": "吐沙",
    "Ice Scales": "冰鱗粉",
    "Curious Medicine": "怪藥",
    "Ripen": "熟成",
    "Ice Face": "結凍頭",
    "Power Spot": "能量點",
    "Mimicry": "擬態",
    "Screen Cleaner": "除障",
    "Steely Spirit": "鋼之意志",
    "Perish Body": "滅亡之軀",
    "Wandering Spirit": "遊魂",
    "Gorilla Tactics": "一猩一意",
    "Neutralizing Gas": "化學變化氣體",
    "Pastel Veil": "粉彩護幕",
    "Hunger Switch": "飽了又餓",
    "Corrosive Gas": "腐蝕氣體",
    "Unseen Fist": "無形拳",
    "Quick Draw": "速擊",
    "Transistor": "電晶體",
    "Dragon's Maw": "龍顎",
    "As One (Glastrier)": "人馬一體 (雪暴馬)",
    "As One (Spectrier)": "人馬一體 (靈幽馬)",
    "As One": "人馬一體",
    "Chilling Neigh": "蒼白嘶鳴",
    "Grim Neigh": "漆黑嘶鳴",
    "Lingering Aroma": "甩不掉的氣味",
    "Seed Sower": "掉出種子",
    "Thermal Exchange": "熱交換",
    "Anger Shell": "憤怒甲殼",
    "Purifying Salt": "潔凈之鹽",
    "Well-Baked Body": "焦香之軀",
    "Wind Rider": "乘風",
    "Guard Dog": "看門犬",
    "Rocky Payload": "搬岩",
    "Wind Power": "風力發電",
    "Zero to Hero": "全能變身",
    "Commander": "發號施令",
    "Electromorphosis": "電力轉換",
    "Protosynthesis": "古代活性",
    "Quark Drive": "夸克充能",
    "Good as Gold": "黃金之軀",
    "Vessel of Ruin": "災禍之鼎",
    "Sword of Ruin": "災禍之劍",
    "Tablets of Ruin": "災禍之簡",
    "Beads of Ruin": "災禍之玉",
    "Orichalcum Pulse": "緋紅脈動",
    "Hadron Engine": "強子引擎",
    "Opportunist": "跟風",
    "Cud Chew": "反芻",
    "Sharpness": "鋒銳",
    "Supreme Overlord": "大將",
    "Costar": "同台共演",
    "Toxic Debris": "毒滿地",
    "Armor Tail": "尾甲",
    "Earth Eater": "食土",
    "Mycelium Might": "菌絲之力",
    "Hospitality": "款待",
    "Tera Shift": "太晶變形",
    "Tera Shell": "太晶甲殼",
    "Teraform Zero": "歸零化境",
    "Toxic Chain": "毒鎖鏈",
    "Poison Puppeteer": "毒傀儡",
    "Supersweet Syrup": "甘露之蜜",
    "Mind's Eye": "心眼",
    "Embody Aspect (Teal)": "面影輝映(碧草)",
    "Embody Aspect (Cornerstone)": "面影輝映(礎石)",
    "Embody Aspect (Hearthflame)": "面影輝映(火灶)",
    "Embody Aspect (Wellspring)": "面影輝映(水井)",
    "Embody Aspect": "面影輝映",
    "No Ability": "無特性",





    //  招式

    "Pound": "拍擊",
    "Karate Chop": "空手劈",
    "Double Slap": "連環巴掌",
    "Comet Punch": "連續拳",
    "Mega Punch": "百萬噸重拳",
    "Pay Day": "聚寶功",
    "Fire Punch": "火焰拳",
    "Ice Punch": "冰凍拳",
    "Thunder Punch": "雷電拳",
    "Scratch": "抓",
    "Vise Grip": "夾住",
    "Guillotine": "斷頭鉗",
    "Razor Wind": "旋風刀",
    "Swords Dance": "劍舞",
    "Cut": "居合斬",
    "Gust": "起風",
    "Wing Attack": "翅膀攻擊",
    "Whirlwind": "吹飛",
    "Fly": "飛翔",
    "Bind": "綁緊",
    "Slam": "摔打",
    "Vine Whip": "藤鞭",
    "Stomp": "踩踏",
    "Double Kick": "二連踢",
    "Mega Kick": "百萬噸重踢",
    "Jump Kick": "飛踢",
    "Rolling Kick": "回旋踢",
    "Sand Attack": "潑沙",
    "Headbutt": "頭錘",
    "Horn Attack": "角撞",
    "Fury Attack": "亂擊",
    "Horn Drill": "角鑽",
    "Tackle": "撞擊",
    "Body Slam": "泰山壓頂",
    "Wrap": "緊束",
    "Take Down": "猛撞",
    "Thrash": "大鬧一番",
    "Double-Edge": "捨身衝撞",
    "Tail Whip": "搖尾巴",
    "Poison Sting": "毒針",
    "Twineedle": "雙針",
    "Pin Missile": "飛彈針",
    "Leer": "瞪眼",
    "Bite": "咬住",
    "Growl": "叫聲",
    "Roar": "吼叫",
    "Sing": "唱歌",
    "Supersonic": "超音波",
    "Sonic Boom": "音爆",
    "Acid": "溶解液",
    "Ember": "火花",
    "Flamethrower": "噴射火焰",
    "Mist": "白霧",
    "Water Gun": "水槍",
    "Hydro Pump": "水炮",
    "Surf": "沖浪",
    "Ice Beam": "冰凍光束",
    "Blizzard": "暴風雪",
    "Psybeam": "幻象光線",
    "Bubble Beam": "泡沫光線",
    "Aurora Beam": "極光束",
    "Hyper Beam": "破壞光線",
    "Peck": "啄",
    "Drill Peck": "啄鑽",
    "Submission": "地獄翻滾",
    "Low Kick": "踢倒",
    "Counter": "雙倍奉還",
    "Seismic Toss": "地球上投",
    "Strength": "怪力",
    "Absorb": "吸取",
    "Mega Drain": "超級吸取",
    "Leech Seed": "寄生種子",
    "Growth": "生長",
    "Razor Leaf": "飛葉快刀",
    "Solar Beam": "日光束",
    "Poison Powder": "毒粉",
    "Stun Spore": "麻痹粉",
    "Sleep Powder": "催眠粉",
    "Petal Dance": "花瓣舞",
    "String Shot": "吐絲",
    "Dragon Rage": "龍之怒",
    "Fire Spin": "火焰旋渦",
    "Thunder Shock": "電擊",
    "Thunderbolt": "十萬伏特",
    "Thunder Wave": "電磁波",
    "Thunder": "打雷",
    "Rock Throw": "落石",
    "Earthquake": "地震",
    "Fissure": "地裂",
    "Dig": "挖洞",
    "Toxic": "劇毒",
    "Confusion": "念力",
    "Psychic": "超能力",
    "Hypnosis": "催眠術",
    "Meditate": "瑜伽姿勢",
    "Agility": "高速移動",
    "Quick Attack": "電光一閃",
    "Rage": "憤怒",
    "Teleport": "瞬間移動",
    "Night Shade": "黑夜魔影",
    "Mimic": "模仿",
    "Screech": "刺耳聲",
    "Double Team": "影子分身",
    "Recover": "自我再生",
    "Harden": "變硬",
    "Minimize": "變小",
    "Smokescreen": "煙幕",
    "Confuse Ray": "奇異之光",
    "Withdraw": "縮入殼中",
    "Defense Curl": "變圓",
    "Barrier": "屏障",
    "Light Screen": "光牆",
    "Haze": "黑霧",
    "Reflect": "反射壁",
    "Focus Energy": "聚氣",
    "Bide": "忍耐",
    "Metronome": "揮指",
    "Mirror Move": "鸚鵡學舌",
    "Self-Destruct": "自爆",
    "Egg Bomb": "炸蛋",
    "Lick": "舌舔",
    "Smog": "濁霧",
    "Sludge": "污泥攻擊",
    "Bone Club": "骨棒",
    "Fire Blast": "大字爆炎",
    "Waterfall": "攀瀑",
    "Clamp": "貝殼夾擊",
    "Swift": "高速星星",
    "Skull Bash": "火箭頭錘",
    "Spike Cannon": "尖刺加農炮",
    "Constrict": "纏繞",
    "Amnesia": "瞬間失憶",
    "Kinesis": "折彎湯匙",
    "Soft-Boiled": "生蛋",
    "High Jump Kick": "飛膝踢",
    "Glare": "大蛇瞪眼",
    "Dream Eater": "食夢",
    "Poison Gas": "毒瓦斯",
    "Barrage": "投球",
    "Leech Life": "吸血",
    "Lovely Kiss": "惡魔之吻",
    "Sky Attack": "神鳥猛擊",
    "Transform": "變身",
    "Bubble": "泡沫",
    "Dizzy Punch": "迷昏拳",
    "Spore": "蘑菇孢子",
    "Flash": "閃光",
    "Psywave": "精神波",
    "Splash": "躍起",
    "Acid Armor": "溶化",
    "Crabhammer": "蟹鉗錘",
    "Explosion": "大爆炸",
    "Fury Swipes": "亂抓",
    "Bonemerang": "骨頭回力鏢",
    "Rest": "睡覺",
    "Rock Slide": "岩崩",
    "Hyper Fang": "必殺門牙",
    "Sharpen": "棱角化",
    "Conversion": "紋理",
    "Tri Attack": "三重攻擊",
    "Super Fang": "憤怒門牙",
    "Slash": "劈開",
    "Substitute": "替身",
    "Struggle": "掙扎",
    "Sketch": "寫生",
    "Triple Kick": "三連踢",
    "Thief": "小偷",
    "Spider Web": "蛛網",
    "Mind Reader": "心之眼",
    "Nightmare": "惡夢",
    "Flame Wheel": "火焰輪",
    "Snore": "打鼾",
    "Curse": "詛咒",
    "Flail": "抓狂",
    "Conversion 2": "紋理2",
    "Aeroblast": "氣旋攻擊",
    "Cotton Spore": "棉孢子",
    "Reversal": "起死回生",
    "Spite": "怨恨",
    "Powder Snow": "細雪",
    "Protect": "守住",
    "Mach Punch": "音速拳",
    "Scary Face": "鬼面",
    "Feint Attack": "出奇一擊",
    "Sweet Kiss": "天使之吻",
    "Belly Drum": "腹鼓",
    "Sludge Bomb": "污泥炸彈",
    "Mud-Slap": "擲泥",
    "Octazooka": "章魚桶炮",
    "Spikes": "撒菱",
    "Zap Cannon": "電磁炮",
    "Foresight": "識破",
    "Destiny Bond": "同命",
    "Perish Song": "滅亡之歌",
    "Icy Wind": "冰凍之風",
    "Detect": "看穿",
    "Bone Rush": "骨棒亂打",
    "Lock-On": "鎖定",
    "Outrage": "逆鱗",
    "Sandstorm": "沙暴",
    "Giga Drain": "終極吸取",
    "Endure": "挺住",
    "Charm": "撒嬌",
    "Rollout": "滾動",
    "False Swipe": "點到為止",
    "Swagger": "虛張聲勢",
    "Milk Drink": "喝牛奶",
    "Spark": "電光",
    "Fury Cutter": "連斬",
    "Steel Wing": "鋼翼",
    "Mean Look": "黑色目光",
    "Attract": "迷人",
    "Sleep Talk": "夢話",
    "Heal Bell": "治癒鈴聲",
    "Return": "報恩",
    "Present": "禮物",
    "Frustration": "遷怒",
    "Safeguard": "神秘守護",
    "Pain Split": "分擔痛楚",
    "Sacred Fire": "神聖之火",
    "Magnitude": "震級",
    "Dynamic Punch": "爆裂拳",
    "Megahorn": "超級角擊",
    "Dragon Breath": "龍息",
    "Baton Pass": "接棒",
    "Encore": "再來一次",
    "Pursuit": "追打",
    "Rapid Spin": "高速旋轉",
    "Sweet Scent": "甜甜香氣",
    "Iron Tail": "鐵尾",
    "Metal Claw": "金屬爪",
    "Vital Throw": "借力摔",
    "Morning Sun": "晨光",
    "Synthesis": "光合作用",
    "Moonlight": "月光",
    "Hidden Power": "覺醒力量",
    "Cross Chop": "十字劈",
    "Twister": "龍卷風",
    "Rain Dance": "求雨",
    "Sunny Day": "大晴天",
    "Crunch": "咬碎",
    "Mirror Coat": "鏡面反射",
    "Psych Up": "自我暗示",
    "Extreme Speed": "神速",
    "Ancient Power": "原始之力",
    "Shadow Ball": "暗影球",
    "Future Sight": "預知未來",
    "Rock Smash": "碎岩",
    "Whirlpool": "潮旋",
    "Beat Up": "圍攻",
    "Fake Out": "擊掌奇襲",
    "Uproar": "吵鬧",
    "Stockpile": "蓄力",
    "Spit Up": "噴出",
    "Swallow": "吞下",
    "Heat Wave": "熱風",
    "Hail": "冰雹",
    "Torment": "無理取鬧",
    "Flatter": "吹捧",
    "Will-O-Wisp": "鬼火",
    "Memento": "臨別禮物",
    "Facade": "硬撐",
    "Focus Punch": "真氣拳",
    "Smelling Salts": "清醒",
    "Follow Me": "看我嘛",
    "Nature Power": "自然之力",
    "Charge": "充電",
    "Taunt": "挑釁",
    "Helping Hand": "幫助",
    "Trick": "戲法",
    "Role Play": "扮演",
    "Wish": "祈願",
    "Assist": "借助",
    "Ingrain": "紮根",
    "Superpower": "蠻力",
    "Magic Coat": "魔法反射",
    "Recycle": "回收利用",
    "Revenge": "報覆",
    "Brick Break": "劈瓦",
    "Yawn": "哈欠",
    "Knock Off": "拍落",
    "Endeavor": "蠻幹",
    "Eruption": "噴火",
    "Skill Swap": "特性互換",
    "Imprison": "封印",
    "Refresh": "煥然一新",
    "Grudge": "怨念",
    "Snatch": "搶奪",
    "Secret Power": "秘密之力",
    "Dive": "潛水",
    "Arm Thrust": "猛推",
    "Camouflage": "保護色",
    "Tail Glow": "螢火",
    "Luster Purge": "潔凈光芒",
    "Mist Ball": "薄霧球",
    "Feather Dance": "羽毛舞",
    "Teeter Dance": "搖晃舞",
    "Blaze Kick": "火焰踢",
    "Mud Sport": "玩泥巴",
    "Ice Ball": "冰球",
    "Needle Arm": "尖刺臂",
    "Slack Off": "偷懶",
    "Hyper Voice": "巨聲",
    "Poison Fang": "劇毒牙",
    "Crush Claw": "撕裂爪",
    "Blast Burn": "爆炸烈焰",
    "Hydro Cannon": "加農水炮",
    "Meteor Mash": "彗星拳",
    "Astonish": "驚嚇",
    "Weather Ball": "氣象球",
    "Aromatherapy": "芳香治療",
    "Fake Tears": "假哭",
    "Air Cutter": "空氣利刃",
    "Overheat": "過熱",
    "Odor Sleuth": "氣味偵測",
    "Rock Tomb": "岩石封鎖",
    "Silver Wind": "銀色旋風",
    "Metal Sound": "金屬音",
    "Grass Whistle": "草笛",
    "Tickle": "撓癢",
    "Cosmic Power": "宇宙力量",
    "Water Spout": "噴水",
    "Signal Beam": "信號光束",
    "Shadow Punch": "暗影拳",
    "Extrasensory": "神通力",
    "Sky Uppercut": "衝天拳",
    "Sand Tomb": "流沙地獄",
    "Sheer Cold": "絕對零度",
    "Muddy Water": "濁流",
    "Bullet Seed": "種子機關槍",
    "Aerial Ace": "燕返",
    "Icicle Spear": "冰錐",
    "Iron Defense": "鐵壁",
    "Block": "擋路",
    "Howl": "長嚎",
    "Dragon Claw": "龍爪",
    "Frenzy Plant": "瘋狂植物",
    "Bulk Up": "健美",
    "Bounce": "彈跳",
    "Mud Shot": "泥巴射擊",
    "Poison Tail": "毒尾",
    "Covet": "渴望",
    "Volt Tackle": "伏特攻擊",
    "Magical Leaf": "魔法葉",
    "Water Sport": "玩水",
    "Calm Mind": "冥想",
    "Leaf Blade": "葉刃",
    "Dragon Dance": "龍之舞",
    "Rock Blast": "岩石爆擊",
    "Shock Wave": "電擊波",
    "Water Pulse": "水之波動",
    "Doom Desire": "破滅之願",
    "Psycho Boost": "精神突進",
    "Roost": "羽棲",
    "Gravity": "重力",
    "Miracle Eye": "奇跡之眼",
    "Wake-Up Slap": "喚醒巴掌",
    "Hammer Arm": "臂錘",
    "Gyro Ball": "陀螺球",
    "Healing Wish": "治癒之願",
    "Brine": "鹽水",
    "Natural Gift": "自然之恩",
    "Feint": "佯攻",
    "Pluck": "啄食",
    "Tailwind": "順風",
    "Acupressure": "點穴",
    "Metal Burst": "金屬爆炸",
    "U-turn": "急速折返",
    "Close Combat": "近身戰",
    "Payback": "以牙還牙",
    "Assurance": "惡意追擊",
    "Embargo": "查封",
    "Fling": "投擲",
    "Psycho Shift": "精神轉移",
    "Trump Card": "王牌",
    "Heal Block": "回復封鎖",
    "Wring Out": "絞緊",
    "Power Trick": "力量戲法",
    "Gastro Acid": "胃液",
    "Lucky Chant": "幸運咒語",
    "Me First": "搶先一步",
    "Copycat": "仿效",
    "Power Swap": "力量互換",
    "Guard Swap": "防守互換",
    "Punishment": "懲罰",
    "Last Resort": "珍藏",
    "Worry Seed": "煩惱種子",
    "Sucker Punch": "突襲",
    "Toxic Spikes": "毒菱",
    "Heart Swap": "心靈互換",
    "Aqua Ring": "水流環",
    "Magnet Rise": "電磁飄浮",
    "Flare Blitz": "閃焰衝鋒",
    "Force Palm": "發勁",
    "Aura Sphere": "波導彈",
    "Rock Polish": "岩石打磨",
    "Poison Jab": "毒擊",
    "Dark Pulse": "惡之波動",
    "Night Slash": "暗襲要害",
    "Aqua Tail": "水流尾",
    "Seed Bomb": "種子炸彈",
    "Air Slash": "空氣斬",
    "X-Scissor": "十字剪",
    "Bug Buzz": "蟲鳴",
    "Dragon Pulse": "龍之波動",
    "Dragon Rush": "龍之俯衝",
    "Power Gem": "力量寶石",
    "Drain Punch": "吸取拳",
    "Vacuum Wave": "真空波",
    "Focus Blast": "真氣彈",
    "Energy Ball": "能量球",
    "Brave Bird": "勇鳥猛攻",
    "Earth Power": "大地之力",
    "Switcheroo": "掉包",
    "Giga Impact": "終極衝擊",
    "Nasty Plot": "詭計",
    "Bullet Punch": "子彈拳",
    "Avalanche": "雪崩",
    "Ice Shard": "冰礫",
    "Shadow Claw": "暗影爪",
    "Thunder Fang": "雷電牙",
    "Ice Fang": "冰凍牙",
    "Fire Fang": "火焰牙",
    "Shadow Sneak": "影子偷襲",
    "Mud Bomb": "泥巴炸彈",
    "Psycho Cut": "精神利刃",
    "Zen Headbutt": "意念頭錘",
    "Mirror Shot": "鏡光射擊",
    "Flash Cannon": "加農光炮",
    "Rock Climb": "攀岩",
    "Defog": "清除濃霧",
    "Trick Room": "戲法空間",
    "Draco Meteor": "流星群",
    "Discharge": "放電",
    "Lava Plume": "噴煙",
    "Leaf Storm": "飛葉風暴",
    "Power Whip": "強力鞭打",
    "Rock Wrecker": "岩石炮",
    "Cross Poison": "十字毒刃",
    "Gunk Shot": "垃圾射擊",
    "Iron Head": "鐵頭",
    "Magnet Bomb": "磁鐵炸彈",
    "Stone Edge": "尖石攻擊",
    "Captivate": "誘惑",
    "Stealth Rock": "隱形岩",
    "Grass Knot": "打草結",
    "Chatter": "喋喋不休",
    "Judgment": "制裁光礫",
    "Bug Bite": "蟲咬",
    "Charge Beam": "充電光束",
    "Wood Hammer": "木槌",
    "Aqua Jet": "水流噴射",
    "Attack Order": "攻擊指令",
    "Defend Order": "防禦指令",
    "Heal Order": "回復指令",
    "Head Smash": "雙刃頭錘",
    "Double Hit": "二連擊",
    "Roar of Time": "時光咆哮",
    "Spacial Rend": "亞空裂斬",
    "Lunar Dance": "新月舞",
    "Crush Grip": "捏碎",
    "Magma Storm": "熔岩風暴",
    "Dark Void": "暗黑洞",
    "Seed Flare": "種子閃光",
    "Ominous Wind": "奇異之風",
    "Shadow Force": "暗影潛襲",
    "Hone Claws": "磨爪",
    "Wide Guard": "廣域防守",
    "Guard Split": "防守平分",
    "Power Split": "力量平分",
    "Wonder Room": "奇妙空間",
    "Psyshock": "精神衝擊",
    "Venoshock": "毒液衝擊",
    "Autotomize": "身體輕量化",
    "Rage Powder": "憤怒粉",
    "Telekinesis": "意念移物",
    "Magic Room": "魔法空間",
    "Smack Down": "擊落",
    "Storm Throw": "山嵐摔",
    "Flame Burst": "烈焰濺射",
    "Sludge Wave": "污泥波",
    "Quiver Dance": "蝶舞",
    "Heavy Slam": "重磅衝撞",
    "Synchronoise": "同步幹擾",
    "Electro Ball": "電球",
    "Soak": "浸水",
    "Flame Charge": "蓄能焰襲",
    "Coil": "盤蜷",
    "Low Sweep": "下盤踢",
    "Acid Spray": "酸液炸彈",
    "Foul Play": "欺詐",
    "Simple Beam": "單純光束",
    "Entrainment": "找夥伴",
    "After You": "您先請",
    "Round": "輪唱",
    "Echoed Voice": "回聲",
    "Chip Away": "逐步擊破",
    "Clear Smog": "清除之煙",
    "Stored Power": "輔助力量",
    "Quick Guard": "快速防守",
    "Ally Switch": "交換場地",
    "Scald": "熱水",
    "Shell Smash": "破殼",
    "Heal Pulse": "治癒波動",
    "Hex": "禍不單行",
    "Sky Drop": "自由落體",
    "Shift Gear": "換檔",
    "Circle Throw": "巴投",
    "Incinerate": "燒盡",
    "Quash": "延後",
    "Acrobatics": "雜技",
    "Reflect Type": "鏡面屬性",
    "Retaliate": "報仇",
    "Final Gambit": "搏命",
    "Bestow": "傳遞禮物",
    "Inferno": "煉獄",
    "Water Pledge": "水之誓約",
    "Fire Pledge": "火之誓約",
    "Grass Pledge": "草之誓約",
    "Volt Switch": "伏特替換",
    "Struggle Bug": "蟲之抵抗",
    "Bulldoze": "重踏",
    "Frost Breath": "冰息",
    "Dragon Tail": "龍尾",
    "Work Up": "自我激勵",
    "Electroweb": "電網",
    "Wild Charge": "瘋狂伏特",
    "Drill Run": "直衝鑽",
    "Dual Chop": "二連劈",
    "Heart Stamp": "愛心印章",
    "Horn Leech": "木角",
    "Sacred Sword": "聖劍",
    "Razor Shell": "貝殼刃",
    "Heat Crash": "高溫重壓",
    "Leaf Tornado": "青草攪拌器",
    "Steamroller": "瘋狂滾壓",
    "Cotton Guard": "棉花防守",
    "Night Daze": "暗黑爆破",
    "Psystrike": "精神擊破",
    "Tail Slap": "掃尾拍打",
    "Hydro Steam": "水蒸氣",
    "Psyblade": "精神劍",
    "Hurricane": "暴風",
    "Head Charge": "爆炸頭突擊",
    "Gear Grind": "齒輪飛盤",
    "Searing Shot": "火焰彈",
    "Techno Blast": "高科技光炮",
    "Relic Song": "古老之歌",
    "Secret Sword": "神秘之劍",
    "Glaciate": "冰封世界",
    "Bolt Strike": "雷擊",
    "Blue Flare": "青焰",
    "Fiery Dance": "火之舞",
    "Freeze Shock": "冰凍伏特",
    "Ice Burn": "極寒冷焰",
    "Snarl": "大聲咆哮",
    "Icicle Crash": "冰柱墜擊",
    "V-create": "V熱焰",
    "Fusion Flare": "交錯火焰",
    "Fusion Bolt": "交錯閃電",
    "Flying Press": "飛身重壓",
    "Mat Block": "掀榻榻米",
    "Belch": "打嗝",
    "Rototiller": "耕地",
    "Sticky Web": "黏黏網",
    "Fell Stinger": "致命針刺",
    "Phantom Force": "潛靈奇襲",
    "Trick-or-Treat": "萬聖夜",
    "Noble Roar": "戰吼",
    "Ion Deluge": "等離子浴",
    "Parabolic Charge": "拋物面充電",
    "Forest's Curse": "森林詛咒",
    "Petal Blizzard": "落英繽紛",
    "Freeze-Dry": "冷凍幹燥",
    "Disarming Voice": "魅惑之聲",
    "Parting Shot": "拋下狠話",
    "Topsy-Turvy": "顛倒",
    "Draining Kiss": "吸取之吻",
    "Crafty Shield": "戲法防守",
    "Flower Shield": "鮮花防守",
    "Grassy Terrain": "青草場地",
    "Misty Terrain": "薄霧場地",
    "Electrify": "輸電",
    "Play Rough": "嬉鬧",
    "Fairy Wind": "妖精之風",
    "Moonblast": "月亮之力",
    "Boomburst": "爆音波",
    "Fairy Lock": "妖精之鎖",
    "King's Shield": "王者盾牌",
    "Play Nice": "和睦相處",
    "Confide": "密語",
    "Diamond Storm": "鑽石風暴",
    "Steam Eruption": "蒸汽爆炸",
    "Hyperspace Hole": "異次元洞",
    "Water Shuriken": "飛水手里劍",
    "Mystical Fire": "魔法火焰",
    "Spiky Shield": "尖刺防守",
    "Aromatic Mist": "芳香薄霧",
    "Eerie Impulse": "怪異電波",
    "Venom Drench": "毒液陷阱",
    "Powder": "粉塵",
    "Geomancy": "大地掌控",
    "Magnetic Flux": "磁場操控",
    "Happy Hour": "歡樂時光",
    "Electric Terrain": "電氣場地",
    "Dazzling Gleam": "魔法閃耀",
    "Celebrate": "慶祝",
    "Hold Hands": "牽手",
    "Baby-Doll Eyes": "圓瞳",
    "Nuzzle": "蹭蹭臉頰",
    "Hold Back": "手下留情",
    "Infestation": "死纏爛打",
    "Power-Up Punch": "增強拳",
    "Oblivion Wing": "死亡之翼",
    "Thousand Arrows": "千箭齊發",
    "Thousand Waves": "千波激蕩",
    "Land's Wrath": "大地神力",
    "Light of Ruin": "破滅之光",
    "Origin Pulse": "根源波動",
    "Precipice Blades": "斷崖之劍",
    "Dragon Ascent": "畫龍點睛",
    "Hyperspace Fury": "異次元猛攻",
    "Breakneck Blitz": "究極無敵大衝撞",
    "All-Out Pummeling": "全力無雙激烈拳",
    "Supersonic Skystrike": "極速俯衝轟烈撞",
    "Acid Downpour": "強酸劇毒滅絕雨",
    "Tectonic Rage": "地隆嘯天大終結",
    "Continental Crush": "毀天滅地巨岩墜",
    "Savage Spin-Out": "絕對捕食回旋斬",
    "Never-Ending Nightmare": "無盡暗夜之誘惑",
    "Corkscrew Crash": "超絕螺旋連擊",
    "Inferno Overdrive": "超強極限爆焰彈",
    "Hydro Vortex": "超級水流大漩渦",
    "Bloom Doom": "絢爛繽紛花怒放",
    "Gigavolt Havoc": "終極伏特狂雷閃",
    "Shattered Psyche": "至高精神破壞波",
    "Subzero Slammer": "激狂大地萬里冰",
    "Devastating Drake": "究極巨龍震天地",
    "Black Hole Eclipse": "黑洞吞噬萬物滅",
    "Twinkle Tackle": "可愛星星飛天撞",
    "Catastropika": "皮卡皮卡必殺擊",
    "Shore Up": "集沙",
    "First Impression": "迎頭一擊",
    "Baneful Bunker": "碉堡",
    "Spirit Shackle": "縫影",
    "Darkest Lariat": "DD金勾臂",
    "Sparkling Aria": "泡影的詠嘆調",
    "Ice Hammer": "冰錘",
    "Floral Healing": "花療",
    "High Horsepower": "十萬馬力",
    "Strength Sap": "吸取力量",
    "Solar Blade": "日光刃",
    "Leafage": "樹葉",
    "Spotlight": "聚光燈",
    "Toxic Thread": "毒絲",
    "Laser Focus": "磨礪",
    "Gear Up": "輔助齒輪",
    "Throat Chop": "地獄突刺",
    "Pollen Puff": "花粉團",
    "Anchor Shot": "擲錨",
    "Psychic Terrain": "精神場地",
    "Lunge": "猛撲",
    "Fire Lash": "火焰鞭",
    "Power Trip": "囂張",
    "Burn Up": "燃盡",
    "Speed Swap": "速度互換",
    "Smart Strike": "修長之角",
    "Purify": "凈化",
    "Revelation Dance": "覺醒之舞",
    "Core Enforcer": "核心懲罰者",
    "Trop Kick": "熱帶踢",
    "Instruct": "號令",
    "Beak Blast": "鳥嘴加農炮",
    "Clanging Scales": "鱗片噪音",
    "Dragon Hammer": "龍錘",
    "Brutal Swing": "狂舞揮打",
    "Aurora Veil": "極光幕",
    "Sinister Arrow Raid": "遮天蔽日暗影箭",
    "Malicious Moonsault": "極惡飛躍粉碎擊",
    "Oceanic Operetta": "海神莊嚴交響樂",
    "Guardian of Alola": "巨人衛士・阿羅拉",
    "Soul-Stealing 7-Star Strike": "七星奪魂腿",
    "Stoked Sparksurfer": "駕雷馭電戲沖浪",
    "Pulverizing Pancake": "認真起來大爆擊",
    "Extreme Evoboost": "九彩升華齊聚頂",
    "Genesis Supernova": "起源超新星大爆炸",
    "Shell Trap": "陷阱甲殼",
    "Fleur Cannon": "花朵加農炮",
    "Psychic Fangs": "精神之牙",
    "Stomping Tantrum": "跺腳",
    "Shadow Bone": "暗影之骨",
    "Accelerock": "衝岩",
    "Liquidation": "水流裂破",
    "Prismatic Laser": "棱鏡鐳射",
    "Spectral Thief": "暗影偷盜",
    "Sunsteel Strike": "流星閃衝",
    "Moongeist Beam": "暗影之光",
    "Tearful Look": "淚眼汪汪",
    "Zing Zap": "麻麻刺刺",
    "Nature's Madness": "自然之怒",
    "Multi-Attack": "多屬性攻擊",
    "10,000,000 Volt Thunderbolt": "千萬伏特",
    "Mind Blown": "驚爆大頭",
    "Plasma Fists": "等離子閃電拳",
    "Photon Geyser": "光子噴湧",
    "Light That Burns the Sky": "焚天滅世熾光爆",
    "Searing Sunraze Smash": "日光回旋下蒼穹",
    "Menacing Moonraze Maelstrom": "月華飛濺落靈霄",
    "Let's Snuggle Forever": "親密無間大亂揍",
    "Splintered Stormshards": "狼嘯石牙颶風暴",
    "Clangorous Soulblaze": "熾魂熱舞烈音爆",
    "Zippy Zap": "電電加速",
    "Splishy Splash": "滔滔沖浪",
    "Floaty Fall": "飄飄墜落",
    "Pika Papow": "閃閃雷光",
    "Bouncy Bubble": "活活氣泡",
    "Buzzy Buzz": "麻麻電擊",
    "Sizzly Slide": "熊熊火爆",
    "Glitzy Glow": "嘩嘩氣場",
    "Baddy Bad": "壞壞領域",
    "Sappy Seed": "茁茁轟炸",
    "Freezy Frost": "冰冰霜凍",
    "Sparkly Swirl": "亮亮風暴",
    "Veevee Volley": "砰砰擊破",
    "Double Iron Bash": "鋼拳雙擊",
    "Max Guard": "極巨防壁",
    "Dynamax Cannon": "極巨炮",
    "Snipe Shot": "狙擊",
    "Jaw Lock": "緊咬不放",
    "Stuff Cheeks": "大快朵頤",
    "No Retreat": "背水一戰",
    "Tar Shot": "瀝青射擊",
    "Magic Powder": "魔法粉",
    "Dragon Darts": "龍箭",
    "Teatime": "茶會",
    "Octolock": "蛸固",
    "Bolt Beak": "電喙",
    "Fishious Rend": "鰓咬",
    "Court Change": "換場",
    "Max Flare": "極巨火爆",
    "Max Flutterby": "極巨蟲蠱",
    "Max Lightning": "極巨閃電",
    "Max Strike": "極巨攻擊",
    "Max Knuckle": "極巨拳鬥",
    "Max Phantasm": "極巨幽魂",
    "Max Hailstorm": "極巨寒冰",
    "Max Ooze": "極巨酸毒",
    "Max Geyser": "極巨水流",
    "Max Airstream": "極巨飛衝",
    "Max Starfall": "極巨妖精",
    "Max Wyrmwind": "極巨龍騎",
    "Max Mindstorm": "極巨超能",
    "Max Rockfall": "極巨岩石",
    "Max Quake": "極巨大地",
    "Max Darkness": "極巨惡霸",
    "Max Overgrowth": "極巨草原",
    "Max Steelspike": "極巨鋼鐵",
    "Clangorous Soul": "魂舞烈音爆",
    "Body Press": "撲擊",
    "Decorate": "裝飾",
    "Drum Beating": "鼓擊",
    "Snap Trap": "捕獸夾",
    "Pyro Ball": "火焰球",
    "Behemoth Blade": "巨獸斬",
    "Behemoth Bash": "巨獸彈",
    "Aura Wheel": "氣場輪",
    "Breaking Swipe": "廣域破壞",
    "Branch Poke": "木枝突刺",
    "Overdrive": "破音",
    "Apple Acid": "蘋果酸",
    "Grav Apple": "萬有引力",
    "Spirit Break": "靈魂衝擊",
    "Strange Steam": "神奇蒸汽",
    "Life Dew": "生命水滴",
    "Obstruct": "攔堵",
    "False Surrender": "假跪真撞",
    "Meteor Assault": "流星突擊",
    "Eternabeam": "無極光束",
    "Steel Beam": "鐵蹄光線",
    "Glacial Lance": "雪矛",
    "Thunder Cage": "雷電囚籠",
    "Thunderous Kick": "雷鳴蹴擊",
    "Astral Barrage": "星碎",
    "Dragon Energy": "巨龍威能",
    "Fiery Wrath": "怒火中燒",
    "Freezing Glare": "冰冷視線",
    "Eerie Spell": "詭異咒語",
    "Jungle Healing": "叢林治療",
    "Lash Out": "泄憤",
    "Grassy Glide": "青草滑梯",
    "Coaching": "指導",
    "Surging Strikes": "水流連打",
    "Wicked Blow": "暗冥強擊",
    "Expanding Force": "廣域戰力",
    "Steel Roller": "鐵滾輪",
    "Rising Voltage": "電力上升",
    "Scorching Sands": "熱沙大地",
    "Dual Wingbeat": "雙翼",
    "Misty Explosion": "薄霧炸裂",
    "Skitter Smack": "爬擊",
    "Triple Axel": "三旋擊",
    "Terrain Pulse": "大地波動",
    "Burning Jealousy": "妒火",
    "Flip Turn": "快速折返",
    "Meteor Beam": "流星光束",
    "Poltergeist": "靈騷",
    "Scale Shot": "鱗射",
    "Shell Side Arm": "臂貝武器",
    "Tera Blast": "太晶爆發",
    "Aqua Step": "流水旋舞",
    "Armor Cannon": "鎧農炮",
    "Axe Kick": "下壓踢",
    "Bitter Blade": "悔念劍",
    "Bitter Malice": "冤冤相報",
    "Blazing Torque": "灼熱暴衝",
    "Bleakwind Storm": "枯葉風暴",
    "Chloroblast": "葉綠爆震",
    "Collision Course": "全開猛撞",
    "Combat Torque": "格鬥暴衝",
    "Dire Claw": "克命爪",
    "Double Shock": "電光雙擊",
    "Electro Drift": "閃電猛衝",
    "Esper Wing": "氣場之翼",
    "Gigaton Hammer": "巨力錘",
    "Glaive Rush": "巨劍突擊",
    "Headlong Rush": "突飛猛撲",
    "Hyper Drill": "強力鑽",
    "Ice Spinner": "冰旋",
    "Kowtow Cleave": "仆斬",
    "Lumina Crash": "琉光衝激",
    "Magical Torque": "魔法暴衝",
    "Make It Rain": "淘金潮",
    "Mountain Gale": "冰山風",
    "Noxious Torque": "劇毒暴衝",
    "Order Up": "上菜",
    "Raging Bull": "怒牛",
    "Raging Fury": "大憤慨",
    "Sandsear Storm": "熱沙風暴",
    "Spin Out": "疾速轉輪",
    "Springtide Storm": "陽春風暴",
    "Torch Song": "閃焰高歌",
    "Triple Arrows": "三連箭",
    "Wave Crash": "波動衝",
    "Wicked Torque": "黑暗暴衝",
    "Wildbolt Storm": "鳴雷風暴",
    "Aqua Cutter": "水波刀",
    "Barb Barrage": "毒千針",
    "Ceaseless Edge": "秘劍·千重濤",
    "Chilling Water": "潑冷水",
    "Chilly Reception": "冷笑話",
    "Comeuppance": "覆仇",
    "Doodle": "描繪",
    "Fillet Away": "甩肉",
    "Flower Trick": "千變萬花",
    "Infernal Parade": "群魔亂舞",
    "Jet Punch": "噴射拳",
    "Last Respects": "掃墓",
    "Lunar Blessing": "新月祈禱",
    "Mortal Spin": "晶光轉轉",
    "Mystical Power": "神秘之力",
    "Population Bomb": "鼠數兒",
    "Pounce": "蟲撲",
    "Power Shift": "力量轉換",
    "Psyshield Bash": "屏障猛攻",
    "Rage Fist": "憤怒之拳",
    "Revival Blessing": "覆生祈禱",
    "Ruination": "大災難",
    "Salt Cure": "鹽腌",
    "Shed Tail": "斷尾",
    "Shelter": "閉關",
    "Silk Trap": "線阱",
    "Snowscape": "雪景",
    "Spicy Extract": "辣椒精華",
    "Stone Axe": "岩斧",
    "Take Heart": "勇氣填充",
    "Tidy Up": "大掃除",
    "Trailblaze": "起草",
    "Triple Dive": "三連鑽",
    "Twin Beam": "雙光束",
    "Victory Dance": "勝利之舞",
    "Thunderclap": "迅雷",
    "Supercell Slam": "閃電強襲",
    "Dragon Cheer": "龍聲鼓舞",
    "Tera Starstorm": "晶光星群",
    "Electro Shot": "電光束",
    "Psychic Noise": "精神噪音",
    "Tachyon Cutter": "迅子利刃",
    "Temper Flare": "豁出去",
    "Burning Bulwark": "火焰守護",
    "Mighty Cleave": "強刃攻擊",
    "Fickle Beam": "隨機光",
    "Syrup Bomb": "糖漿炸彈",
    "Matcha Gotcha": "刷刷茶炮",
    "Ivy Cudgel": "棘藤棒",
    "Hard Press": "硬壓",
    "Alluring Voice": "魅誘之聲",
    "Upper Hand": "快手還擊",
    "Malignant Chain": "邪毒鎖鏈",
    "Blood Moon": "血月",
    "Recharge": "恢覆精力",

    "Hidden Power Bug": "覺醒力量-蟲",
    "Hidden Power Dark": "覺醒力量-惡",
    "Hidden Power Dragon": "覺醒力量-龍",
    "Hidden Power Electric": "覺醒力量-電",
    "Hidden Power Fairy": "覺醒力量-妖精",
    "Hidden Power Fighting": "覺醒力量-格鬥",
    "Hidden Power Fire": "覺醒力量-火",
    "Hidden Power Flying": "覺醒力量-飛行",
    "Hidden Power Ghost": "覺醒力量-幽靈",
    "Hidden Power Grass": "覺醒力量-草",
    "Hidden Power Ground": "覺醒力量-地面",
    "Hidden Power Ice": "覺醒力量-冰",
    "Hidden Power Poison": "覺醒力量-毒",
    "Hidden Power Psychic": "覺醒力量-超能力",
    "Hidden Power Rock": "覺醒力量-岩石",
    "Hidden Power Steel": "覺醒力量-鋼",
    "Hidden Power Water": "覺醒力量-水",

    "Z-Power": "Z-招式",
    "Z-Swords Dance": "Z-劍舞",
    "Z-Whirlwind": "Z-吹飛",
    "Z-Sand Attack": "Z-潑沙",
    "Z-Tail Whip": "Z-搖尾巴",
    "Z-Leer": "Z-瞪眼",
    "Z-Growl": "Z-叫聲",
    "Z-Roar": "Z-吼叫",
    "Z-Sing": "Z-唱歌",
    "Z-Supersonic": "Z-超音波",
    "Z-Mist": "Z-白霧",
    "Z-Leech Seed": "Z-寄生種子",
    "Z-Growth": "Z-生長",
    "Z-Poison Powder": "Z-毒粉",
    "Z-Stun Spore": "Z-麻痹粉",
    "Z-Sleep Powder": "Z-催眠粉",
    "Z-String Shot": "Z-吐絲",
    "Z-Thunder Wave": "Z-電磁波",
    "Z-Toxic": "Z-劇毒",
    "Z-Hypnosis": "Z-催眠術",
    "Z-Meditate": "Z-瑜伽姿勢",
    "Z-Agility": "Z-高速移動",
    "Z-Teleport": "Z-瞬間移動",
    "Z-Mimic": "Z-模仿",
    "Z-Screech": "Z-刺耳聲",
    "Z-Double Team": "Z-影子分身",
    "Z-Recover": "Z-自我再生",
    "Z-Harden": "Z-變硬",
    "Z-Minimize": "Z-變小",
    "Z-Smokescreen": "Z-煙幕",
    "Z-Confuse Ray": "Z-奇異之光",
    "Z-Withdraw": "Z-縮入殼中",
    "Z-Defense Curl": "Z-變圓",
    "Z-Barrier": "Z-屏障",
    "Z-Light Screen": "Z-光牆",
    "Z-Haze": "Z-黑霧",
    "Z-Reflect": "Z-反射壁",
    "Z-Focus Energy": "Z-聚氣",
    "Z-Metronome": "Z-揮指",
    "Z-Mirror Move": "Z-鸚鵡學舌",
    "Z-Smog": "Z-濁霧",
    "Z-Amnesia": "Z-瞬間失憶",
    "Z-Kinesis": "Z-折彎湯匙",
    "Z-Soft-Boiled": "Z-生蛋",
    "Z-Glare": "Z-大蛇瞪眼",
    "Z-Poison Gas": "Z-毒瓦斯",
    "Z-Lovely Kiss": "Z-惡魔之吻",
    "Z-Transform": "Z-變身",
    "Z-Spore": "Z-蘑菇孢子",
    "Z-Flash": "Z-閃光",
    "Z-Splash": "Z-躍起",
    "Z-Acid Armor": "Z-溶化",
    "Z-Rest": "Z-睡覺",
    "Z-Sharpen": "Z-棱角化",
    "Z-Conversion": "Z-紋理",
    "Z-Substitute": "Z-替身",
    "Z-Sketch": "Z-寫生",
    "Z-Spider Web": "Z-蛛網",
    "Z-Mind Reader": "Z-心之眼",
    "Z-Nightmare": "Z-惡夢",
    "Z-Curse": "Z-詛咒",
    "Z-Conversion 2": "Z-紋理2",
    "Z-Cotton Spore": "Z-棉孢子",
    "Z-Spite": "Z-怨恨",
    "Z-Protect": "Z-守住",
    "Z-Scary Face": "Z-鬼面",
    "Z-Sweet Kiss": "Z-天使之吻",
    "Z-Belly Drum": "Z-腹鼓",
    "Z-Spikes": "Z-撒菱",
    "Z-Foresight": "Z-識破",
    "Z-Destiny Bond": "Z-同命",
    "Z-Perish Song": "Z-滅亡之歌",
    "Z-Detect": "Z-看穿",
    "Z-Lock-On": "Z-鎖定",
    "Z-Sandstorm": "Z-沙暴",
    "Z-Endure": "Z-挺住",
    "Z-Charm": "Z-撒嬌",
    "Z-Swagger": "Z-虛張聲勢",
    "Z-Milk Drink": "Z-喝牛奶",
    "Z-Mean Look": "Z-黑色目光",
    "Z-Attract": "Z-迷人",
    "Z-Sleep Talk": "Z-夢話",
    "Z-Heal Bell": "Z-治癒鈴聲",
    "Z-Present": "Z-禮物",
    "Z-Safeguard": "Z-神秘守護",
    "Z-Pain Split": "Z-分擔痛楚",
    "Z-Baton Pass": "Z-接棒",
    "Z-Encore": "Z-再來一次",
    "Z-Sweet Scent": "Z-甜甜香氣",
    "Z-Morning Sun": "Z-晨光",
    "Z-Synthesis": "Z-光合作用",
    "Z-Moonlight": "Z-月光",
    "Z-Rain Dance": "Z-求雨",
    "Z-Sunny Day": "Z-大晴天",
    "Z-Psych Up": "Z-自我暗示",
    "Z-Stockpile": "Z-蓄力",
    "Z-Swallow": "Z-吞下",
    "Z-Torment": "Z-無理取鬧",
    "Z-Flatter": "Z-吹捧",
    "Z-Will-O-Wisp": "Z-鬼火",
    "Z-Memento": "Z-臨別禮物",
    "Z-Smelling Salts": "Z-清醒",
    "Z-Follow Me": "Z-看我嘛",
    "Z-Nature Power": "Z-自然之力",
    "Z-Charge": "Z-充電",
    "Z-Taunt": "Z-挑釁",
    "Z-Helping Hand": "Z-幫助",
    "Z-Trick": "Z-戲法",
    "Z-Role Play": "Z-扮演",
    "Z-Wish": "Z-祈願",
    "Z-Assist": "Z-借助",
    "Z-Ingrain": "Z-紮根",
    "Z-Magic Coat": "Z-魔法反射",
    "Z-Recycle": "Z-回收利用",
    "Z-Yawn": "Z-哈欠",
    "Z-Skill Swap": "Z-特性互換",
    "Z-Imprison": "Z-封印",
    "Z-Refresh": "Z-煥然一新",
    "Z-Grudge": "Z-怨念",
    "Z-Snatch": "Z-搶奪",
    "Z-Camouflage": "Z-保護色",
    "Z-Tail Glow": "Z-螢火",
    "Z-Feather Dance": "Z-羽毛舞",
    "Z-Teeter Dance": "Z-搖晃舞",
    "Z-Mud Sport": "Z-玩泥巴",
    "Z-Slack Off": "Z-偷懶",
    "Z-Aromatherapy": "Z-芳香治療",
    "Z-Fake Tears": "Z-假哭",
    "Z-Odor Sleuth": "Z-氣味偵測",
    "Z-Metal Sound": "Z-金屬音",
    "Z-Grass Whistle": "Z-草笛",
    "Z-Tickle": "Z-撓癢",
    "Z-Cosmic Power": "Z-宇宙力量",
    "Z-Iron Defense": "Z-鐵壁",
    "Z-Block": "Z-擋路",
    "Z-Howl": "Z-長嚎",
    "Z-Bulk Up": "Z-健美",
    "Z-Covet": "Z-渴望",
    "Z-Water Sport": "Z-玩水",
    "Z-Calm Mind": "Z-冥想",
    "Z-Dragon Dance": "Z-龍之舞",
    "Z-Roost": "Z-羽棲",
    "Z-Gravity": "Z-重力",
    "Z-Miracle Eye": "Z-奇跡之眼",
    "Z-Healing Wish": "Z-治癒之願",
    "Z-Tailwind": "Z-順風",
    "Z-Acupressure": "Z-點穴",
    "Z-Embargo": "Z-查封",
    "Z-Psycho Shift": "Z-精神轉移",
    "Z-Heal Block": "Z-回復封鎖",
    "Z-Power Trick": "Z-力量戲法",
    "Z-Gastro Acid": "Z-胃液",
    "Z-Lucky Chant": "Z-幸運咒語",
    "Z-Me First": "Z-搶先一步",
    "Z-Copycat": "Z-仿效",
    "Z-Power Swap": "Z-力量互換",
    "Z-Guard Swap": "Z-防守互換",
    "Z-Worry Seed": "Z-煩惱種子",
    "Z-Toxic Spikes": "Z-毒菱",
    "Z-Heart Swap": "Z-心靈互換",
    "Z-Aqua Ring": "Z-水流環",
    "Z-Magnet Rise": "Z-電磁飄浮",
    "Z-Switcheroo": "Z-掉包",
    "Z-Nasty Plot": "Z-詭計",
    "Z-Defog": "Z-清除濃霧",
    "Z-Trick Room": "Z-戲法空間",
    "Z-Captivate": "Z-誘惑",
    "Z-Stealth Rock": "Z-隱形岩",
    "Z-Defend Order": "Z-防禦指令",
    "Z-Heal Order": "Z-回復指令",
    "Z-Lunar Dance": "Z-新月舞",
    "Z-Dark Void": "Z-暗黑洞",
    "Z-Hone Claws": "Z-磨爪",
    "Z-Wide Guard": "Z-廣域防守",
    "Z-Guard Split": "Z-防守平分",
    "Z-Power Split": "Z-力量平分",
    "Z-Wonder Room": "Z-奇妙空間",
    "Z-Autotomize": "Z-身體輕量化",
    "Z-Rage Powder": "Z-憤怒粉",
    "Z-Telekinesis": "Z-意念移物",
    "Z-Magic Room": "Z-魔法空間",
    "Z-Quiver Dance": "Z-蝶舞",
    "Z-Soak": "Z-浸水",
    "Z-Coil": "Z-盤蜷",
    "Z-Simple Beam": "Z-單純光束",
    "Z-Entrainment": "Z-找夥伴",
    "Z-After You": "Z-您先請",
    "Z-Quick Guard": "Z-快速防守",
    "Z-Ally Switch": "Z-交換場地",
    "Z-Shell Smash": "Z-破殼",
    "Z-Heal Pulse": "Z-治癒波動",
    "Z-Shift Gear": "Z-換檔",
    "Z-Quash": "Z-延後",
    "Z-Reflect Type": "Z-鏡面屬性",
    "Z-Bestow": "Z-傳遞禮物",
    "Z-Work Up": "Z-自我激勵",
    "Z-Cotton Guard": "Z-棉花防守",
    "Z-Mat Block": "Z-掀榻榻米",
    "Z-Rototiller": "Z-耕地",
    "Z-Sticky Web": "Z-黏黏網",
    "Z-Trick-or-Treat": "Z-萬聖夜",
    "Z-Noble Roar": "Z-戰吼",
    "Z-Ion Deluge": "Z-等離子浴",
    "Z-Forest's Curse": "Z-森林詛咒",
    "Z-Parting Shot": "Z-拋下狠話",
    "Z-Topsy-Turvy": "Z-顛倒",
    "Z-Crafty Shield": "Z-戲法防守",
    "Z-Flower Shield": "Z-鮮花防守",
    "Z-Grassy Terrain": "Z-青草場地",
    "Z-Misty Terrain": "Z-薄霧場地",
    "Z-Electrify": "Z-輸電",
    "Z-Fairy Lock": "Z-妖精之鎖",
    "Z-King's Shield": "Z-王者盾牌",
    "Z-Play Nice": "Z-和睦相處",
    "Z-Confide": "Z-密語",
    "Z-Spiky Shield": "Z-尖刺防守",
    "Z-Aromatic Mist": "Z-芳香薄霧",
    "Z-Eerie Impulse": "Z-怪異電波",
    "Z-Venom Drench": "Z-毒液陷阱",
    "Z-Powder": "Z-粉塵",
    "Z-Geomancy": "Z-大地掌控",
    "Z-Magnetic Flux": "Z-磁場操控",
    "Z-Happy Hour": "Z-歡樂時光",
    "Z-Electric Terrain": "Z-電氣場地",
    "Z-Celebrate": "Z-慶祝",
    "Z-Hold Hands": "Z-牽手",
    "Z-Baby-Doll Eyes": "Z-圓瞳",
    "Z-Shore Up": "Z-集沙",
    "Z-Baneful Bunker": "Z-碉堡",
    "Z-Floral Healing": "Z-花療",
    "Z-Spotlight": "Z-聚光燈",
    "Z-Toxic Thread": "Z-毒絲",
    "Z-Laser Focus": "Z-磨礪",
    "Z-Gear Up": "Z-輔助齒輪",
    "Z-Psychic Terrain": "Z-精神場地",
    "Z-Speed Swap": "Z-速度互換",
    "Z-Purify": "Z-凈化",
    "Z-Instruct": "Z-號令",
    "Z-Aurora Veil": "Z-極光幕",
    "Z-Tearful Look": "Z-淚眼汪汪",
    "Z-Stuff Cheeks": "Z-大快朵頤",
    "Z-No Retreat": "Z-背水一戰",
    "Z-Tar Shot": "Z-瀝青射擊",
    "Z-Magic Powder": "Z-魔法粉",
    "Z-Teatime": "Z-茶會",
    "Z-Octolock": "Z-蛸固",
    "Z-Court Change": "Z-換場",
    "Z-Clangorous Soul": "Z-魂舞烈音爆",
    "Z-Decorate": "Z-裝飾",
    "Z-Life Dew": "Z-生命水滴",
    "Z-Obstruct": "Z-攔堵",
    "Z-Jungle Healing": "Z-叢林治療",
    "Z-Coaching": "Z-指導",
    "Z-Chilly Reception": "Z-冷笑話",
    "Z-Doodle": "Z-描繪",
    "Z-Fillet Away": "Z-甩肉",
    "Z-Lunar Blessing": "Z-新月祈禱",
    "Z-Power Shift": "Z-力量轉換",
    "Z-Revival Blessing": "Z-覆生祈禱",
    "Z-Shed Tail": "Z-斷尾",
    "Z-Shelter": "Z-閉關",
    "Z-Silk Trap": "Z-線阱",
    "Z-Snowscape": "Z-雪景",
    "Z-Spicy Extract": "Z-辣椒精華",
    "Z-Take Heart": "Z-勇氣填充",
    "Z-Tidy Up": "Z-大掃除",
    "Z-Victory Dance": "Z-勝利之舞",
    "Z-Dragon Cheer": "Z-龍聲鼓舞",
    "Z-Burning Bulwark": "Z-火焰守護",
    "Z-Disable": "Z-定身法",




    //  超極巨招式

    "G-Max Wildfire": "超極巨地獄滅焰",
    "G-Max Vine Lash": "超極巨灰飛鞭滅",
    "G-Max Cannonade": "超極巨水炮轟滅",
    "G-Max Befuddle": "超極巨蝶影蠱惑",
    "G-Max Volt Crash": "超極巨萬雷轟頂",
    "G-Max Gold Rush": "超極巨特大金幣",
    "G-Max Chi Strike": "超極巨會心一擊",
    "G-Max Terror": "超極巨幻影幽魂",
    "G-Max Foam Burst": "超極巨激漩泡渦",
    "G-Max Resonance": "超極巨極光旋律",
    "G-Max Cuddle": "超極巨熱情擁抱",
    "G-Max Replenish": "超極巨資源再生",
    "G-Max Malodor": "超極巨臭氣沖天",
    "G-Max Meltdown": "超極巨液金熔擊",
    "G-Max Wind Rage": "超極巨旋風襲卷",
    "G-Max Gravitas": "超極巨天道七星",
    "G-Max Stonesurge": "超極巨岩陣以待",
    "G-Max Volcalith": "超極巨炎石噴發",
    "G-Max Tartness": "超極巨酸不溜丟",
    "G-Max Sweetness": "超極巨瓊漿玉液",
    "G-Max Sandblast": "超極巨沙塵漫天",
    "G-Max Centiferno": "超極巨百火焚野",
    "G-Max Smite": "超極巨天譴雷誅",
    "G-Max Snooze": "超極巨睡魔降臨",
    "G-Max Finale": "超極巨幸福圓滿",
    "G-Max Steelsurge": "超極巨鋼鐵陣法",
    "G-Max Depletion": "超極巨劣化衰變",
    "G-Max Stun Shock": "超極巨異毒電場",
    "G-Max One Blow": "超極巨奪命一擊",
    "G-Max Rapid Flow": "超極巨流水連擊",
    "G-Max Fireball": "超極巨破陣火球",
    "G-Max Drum Solo": "超極巨狂擂亂打",
    "G-Max Hydrosnipe": "超極巨狙擊神射",



    //   前代道具


    "Gold Berry": "黃金果",
    "PRZ Cure Berry": "解麻果",
    "PSN Cure Berry": "解毒果",
    "Bitter Berry": "苦味果",
    "Burnt Berry": "燒灼果",
    "Ice Berry": "凍結果",
    "Mint Berry": "薄荷果",
    "Miracle Berry": "奇跡果",
    "Mystery Berry": "怪異果",
    "Pink Bow": "粉紅色絲帶",
    "Polkadot Bow": "水玉色之帶",
    "Berserk Gene": "破壞基因",






    //  道具

    "Items": "對戰用道具",
    "Popular items": "常用道具",
    "Pokemon-specific items": "特定寶可夢使用的道具",
    "Usually useless items": "多數情況無用的道具",
    "Useless items": "無對戰用途道具",
    "Mail": "郵件",
    "Never-Melt Ice": "不融冰",
    "King's Rock": "王者之證",
    "Poke Ball": "精靈球",
    "Stick": "大蔥",
    "Heavy-Duty Boots": "厚底靴",
    "Leek": "大蔥",
    "Ability Shield": "特性護具",
    "Auspicious Armor": "慶祝之鎧",
    "Booster Energy": "驅勁能量",
    "Clear Amulet": "清凈墜飾",
    "Covert Cloak": "密探鬥篷",
    "Loaded Dice": "老千骰子",
    "Malicious Armor": "咒術之鎧",
    "Fairy Feather": "妖精之羽",
    "Big Nugget": "巨大金珠",
    "Metal Alloy": "複合金屬",
    "Masterpiece Teacup": "傑作茶碗",
    "Unremarkable Teacup": "凡作茶碗",
    "Adamant Crystal": "大金剛寶玉",
    "Lustrous Globe": "大白寶玉",
    "Griseous Core": "大白金寶玉",
    "Cornerstone Mask": "礎石面具",
    "Wellspring Mask": "水井面具",
    "Hearthflame Mask": "火灶面具",
    "Syrupy Apple": "蜜汁蘋果",
    "Mirror Herb": "模仿香草",
    "Punching Glove": "拳擊手套",
    "Abomasite": "暴雪王進化石",
    "Absolite": "阿勃梭魯進化石",
    "Absorb Bulb": "球根",
    "Adamant Orb": "金剛寶珠",
    "Adrenaline Orb": "膽怯球",
    "Aerodactylite": "化石翼龍進化石",
    "Aggronite": "波士可多拉進化石",
    "Aguav Berry": "樂芭果",
    "Air Balloon": "氣球",
    "Alakazite": "胡地進化石",
    "Aloraichium Z": "阿羅雷Z",
    "Altarianite": "七夕青鳥進化石",
    "Ampharosite": "電龍進化石",
    "Apicot Berry": "杏仔果",
    "Armor Fossil": "盾甲化石",
    "Aspear Berry": "利木果",
    "Assault Vest": "突擊背心",
    "Audinite": "差不多娃娃進化石",
    "Babiri Berry": "霹霹果",
    "Banettite": "詛咒娃娃進化石",
    "Beast Ball": "究極球",
    "Beedrillite": "大針蜂進化石",
    "Belue Berry": "靛莓果",
    "Berry Juice": "樹果汁",
    "Berry Sweet": "野莓糖飾",
    "Big Root": "大根莖",
    "Binding Band": "緊綁束帶",
    "Black Belt": "黑帶",
    "Black Sludge": "黑色污泥",
    "Black Glasses": "黑色眼鏡",
    "Blastoisinite": "水箭龜進化石",
    "Blazikenite": "火焰雞進化石",
    "Blue Orb": "靛藍色寶珠",
    "Bluk Berry": "墨莓果",
    "Blunder Policy": "打空保險",
    "Bottle Cap": "銀色王冠",
    "Bright Powder": "光粉",
    "Bug Gem": "蟲之寶石",
    "Bug Memory": "蟲子記憶碟",
    "Buginium Z": "蟲Z",
    "Burn Drive": "火焰卡帶",
    "Cameruptite": "噴火駝進化石",
    "Cell Battery": "充電電池",
    "Charcoal": "木炭",
    "Charizardite X": "噴火龍進化石X",
    "Charizardite Y": "噴火龍進化石Y",
    "Charti Berry": "草蠶果",
    "Cheri Berry": "櫻子果",
    "Cherish Ball": "貴重球",
    "Chesto Berry": "零餘果",
    "Chilan Berry": "燈漿果",
    "Chill Drive": "冰凍卡帶",
    "Chipped Pot": "缺損的茶壺",
    "Choice Band": "講究頭帶",
    "Choice Scarf": "講究圍巾",
    "Choice Specs": "講究眼鏡",
    "Chople Berry": "蓮蒲果",
    "Claw Fossil": "爪子化石",
    "Clover Sweet": "幸運草糖飾",
    "Coba Berry": "棱瓜果",
    "Colbur Berry": "刺耳果",
    "Cornn Berry": "玉黍果",
    "Cover Fossil": "背蓋化石",
    "Cracked Pot": "破裂的茶壺",
    "Custap Berry": "釋陀果",
    "Damp Rock": "潮濕岩石",
    "Dark Gem": "惡之寶石",
    "Dark Memory": "黑暗記憶碟",
    "Darkinium Z": "惡Z",
    "Dawn Stone": "覺醒之石",
    "Decidium Z": "狙射樹梟Z",
    "Deep Sea Scale": "深海鱗片",
    "Deep Sea Tooth": "深海之牙",
    "Destiny Knot": "紅線",
    "Diancite": "蒂安希進化石",
    "Dive Ball": "潛水球",
    "Dome Fossil": "甲殼化石",
    "Douse Drive": "水流卡帶",
    "Draco Plate": "龍之石板",
    "Dragon Fang": "龍之牙",
    "Dragon Gem": "龍之寶石",
    "Dragon Memory": "龍記憶碟",
    "Dragon Scale": "龍之鱗片",
    "Dragonium Z": "龍Z",
    "Dread Plate": "惡顏石板",
    "Dream Ball": "夢境球",
    "Dubious Disc": "可疑補丁",
    "Durin Berry": "金枕果",
    "Dusk Ball": "黑暗球",
    "Dusk Stone": "暗之石",
    "Earth Plate": "大地石板",
    "Eevium Z": "伊布Z",
    "Eject Button": "逃脫按鍵",
    "Eject Pack": "避難背包",
    "Electirizer": "電力增幅器",
    "Electric Gem": "電之寶石",
    "Electric Memory": "電子記憶碟",
    "Electric Seed": "電氣種子",
    "Electrium Z": "電Z",
    "Energy Powder": "元氣粉",
    "Enigma Berry": "謎芝果",
    "Eviolite": "進化奇石",
    "Expert Belt": "達人帶",
    "Fairium Z": "妖精Z",
    "Fairy Gem": "妖精寶石",
    "Fairy Memory": "妖精記憶碟",
    "Fast Ball": "速度球",
    "Fighting Gem": "格鬥寶石",
    "Fighting Memory": "戰鬥記憶碟",
    "Fightinium Z": "格鬥Z",
    "Figy Berry": "勿花果",
    "Fire Gem": "火之寶石",
    "Fire Memory": "火焰記憶碟",
    "Fire Stone": "火之石",
    "Firium Z": "火Z",
    "Fist Plate": "拳頭石板",
    "Flame Orb": "火焰寶珠",
    "Flame Plate": "火球石板",
    "Float Stone": "輕石",
    "Flower Sweet": "花朵糖飾",
    "Flying Gem": "飛行寶石",
    "Flying Memory": "飛翔記憶碟",
    "Flyinium Z": "飛行Z",
    "Focus Band": "氣勢頭帶",
    "Focus Sash": "氣勢披帶",
    "Fossilized Bird": "化石鳥",
    "Fossilized Dino": "化石海獸",
    "Fossilized Drake": "化石龍",
    "Fossilized Fish": "化石魚",
    "Friend Ball": "友友球",
    "Full Incense": "飽腹薰香",
    "Galladite": "艾路雷朵進化石",
    "Ganlon Berry": "龍睛果",
    "Garchompite": "烈咬陸鯊進化石",
    "Gardevoirite": "沙奈朵進化石",
    "Gengarite": "耿鬼進化石",
    "Ghost Gem": "幽靈寶石",
    "Ghost Memory": "幽靈記憶碟",
    "Ghostium Z": "幽靈Z",
    "Glalitite": "冰鬼護進化石",
    "Gold Bottle Cap": "金色王冠",
    "Grass Gem": "草之寶石",
    "Grass Memory": "青草記憶碟",
    "Grassium Z": "草Z",
    "Grassy Seed": "青草種子",
    "Great Ball": "超級球",
    "Grepa Berry": "萄葡果",
    "Grip Claw": "緊纏鉤爪",
    "Griseous Orb": "白金寶珠",
    "Ground Gem": "地面寶石",
    "Ground Memory": "大地記憶碟",
    "Groundium Z": "地面Z",
    "Gyaradosite": "暴鯉龍進化石",
    "Haban Berry": "莓榴果",
    "Hard Stone": "硬石頭",
    "Heal Ball": "治癒球",
    "Heat Rock": "熾熱岩石",
    "Heavy Ball": "沈重球",
    "Helix Fossil": "貝殼化石",
    "Heracronite": "赫拉克羅斯進化石",
    "Hondew Berry": "哈密果",
    "Houndoominite": "黑魯加進化石",
    "Iapapa Berry": "芭亞果",
    "Ice Gem": "冰之寶石",
    "Ice Memory": "冰雪記憶碟",
    "Ice Stone": "冰之石",
    "Icicle Plate": "冰柱石板",
    "Icium Z": "冰Z",
    "Icy Rock": "冰冷岩石",
    "Incinium Z": "熾焰咆哮虎Z",
    "Insect Plate": "玉蟲石板",
    "Iron Ball": "黑色鐵球",
    "Iron Plate": "鋼鐵石板",
    "Jaboca Berry": "嘉珍果",
    "Jaw Fossil": "顎之化石",
    "Kasib Berry": "佛柑果",
    "Kebia Berry": "通通果",
    "Kee Berry": "亞開果",
    "Kelpsy Berry": "藻根果",
    "Kangaskhanite": "袋獸進化石",
    "Kommonium Z": "杖尾鱗甲龍Z",
    "Lagging Tail": "後攻之尾",
    "Lansat Berry": "蘭薩果",
    "Latiasite": "拉帝亞斯進化石",
    "Latiosite": "拉帝歐斯進化石",
    "Lax Incense": "悠閒薰香",
    "Leaf Stone": "葉之石",
    "Leftovers": "吃剩的東西",
    "Leppa Berry": "蘋野果",
    "Level Ball": "等級球",
    "Liechi Berry": "枝荔果",
    "Life Orb": "生命寶珠",
    "Light Ball": "電氣球",
    "Light Clay": "光之黏土",
    "Lopunnite": "長耳兔進化石",
    "Love Ball": "甜蜜球",
    "Love Sweet": "愛心糖飾",
    "Lucarionite": "路卡利歐進化石",
    "Lucky Punch": "吉利拳",
    "Lum Berry": "木子果",
    "Luminous Moss": "光苔",
    "BrightPowder": "光粉",
    "SilverPowder": "銀粉",
    "Lunalium Z": "露奈雅拉Z",
    "Lure Ball": "誘餌球",
    "Lustrous Orb": "白玉寶珠",
    "Luxury Ball": "豪華球",
    "Lycanium Z": "鬃岩狼人Z",
    "Macho Brace": "強制鍛煉器",
    "Magmarizer": "熔岩增幅器",
    "Magnet": "磁鐵",
    "Mago Berry": "芒芒果",
    "Magost Berry": "岳竹果",
    "Manectite": "雷電獸進化石",
    "Maranga Berry": "香羅果",
    "Marshadium Z": "瑪夏多Z",
    "Master Ball": "大師球",
    "Mawilite": "大嘴娃進化石",
    "Meadow Plate": "碧綠石板",
    "Medichamite": "恰雷姆進化石",
    "Mental Herb": "心靈香草",
    "Metagrossite": "巨金怪進化石",
    "Metal Coat": "金屬膜",
    "Metal Powder": "金屬粉",
    "Metronome": "節拍器",
    "Mewnium Z": "夢幻Z",
    "Mewtwonite X": "超夢進化石X",
    "Mewtwonite Y": "超夢進化石Y",
    "Micle Berry": "奇秘果",
    "Mimikium Z": "謎擬QZ",
    "Mind Plate": "神奇石板",
    "Miracle Seed": "奇跡種子",
    "Misty Seed": "薄霧種子",
    "Moon Ball": "月亮球",
    "Moon Stone": "月之石",
    "Muscle Band": "力量頭帶",
    "Mystic Water": "神秘水滴",
    "Nanab Berry": "蕉香果",
    "Nest Ball": "巢穴球",
    "Net Ball": "捕網球",
    "Nomel Berry": "檬檸果",
    "Normal Gem": "一般寶石",
    "Normalium Z": "一般Z",
    "Occa Berry": "巧可果",
    "Odd Incense": "奇異薰香",
    "Old Amber": "秘密琥珀",
    "Oran Berry": "橙橙果",
    "Oval Stone": "渾圓之石",
    "Pamtre Berry": "椰木果",
    "Park Ball": "公園球",
    "Passho Berry": "千香果",
    "Payapa Berry": "福祿果",
    "Pecha Berry": "桃桃果",
    "Persim Berry": "柿仔果",
    "Petaya Berry": "龍火果",
    "Pidgeotite": "大比鳥進化石",
    "Pikanium Z": "皮卡丘Z",
    "Pikashunium Z": "智皮卡Z",
    "Pinap Berry": "凰梨果",
    "Pinsirite": "凱羅斯進化石",
    "Pixie Plate": "妖精石板",
    "Plume Fossil": "羽毛化石",
    "Poison Barb": "毒針",
    "Poison Gem": "毒之寶石",
    "Poison Memory": "毒記憶碟",
    "Poisonium Z": "毒Z",
    "Pomeg Berry": "榴石果",
    "Power Anklet": "力量護踝",
    "Power Band": "力量束帶",
    "Power Belt": "力量腰帶",
    "Power Bracer": "力量護腕",
    "Power Herb": "強力香草",
    "Power Lens": "力量鏡",
    "Power Weight": "力量負重",
    "Premier Ball": "紀念球",
    "Primarium Z": "西獅海壬Z",
    "Prism Scale": "美麗鱗片",
    "Protective Pads": "部位護具",
    "Protector": "護具",
    "Psychic Gem": "超能力寶石",
    "Psychic Memory": "精神記憶碟",
    "Psychic Seed": "精神種子",
    "Psychium Z": "超能力Z",
    "Qualot Berry": "比巴果",
    "Quick Ball": "先機球",
    "Quick Claw": "先制之爪",
    "Quick Powder": "速度粉",
    "Rabuta Berry": "茸丹果",
    "Rare Bone": "貴重骨頭",
    "Rawst Berry": "莓莓果",
    "Razor Claw": "銳利之爪",
    "Razor Fang": "銳利之牙",
    "Razz Berry": "蔓莓果",
    "Reaper Cloth": "靈界之布",
    "Red Card": "紅牌",
    "Red Orb": "朱紅色寶珠",
    "Repeat Ball": "重覆球",
    "Ribbon Sweet": "蝴蝶結糖飾",
    "Rindo Berry": "羅子果",
    "Ring Target": "標靶",
    "Rock Gem": "岩石寶石",
    "Rock Incense": "岩石薰香",
    "Rock Memory": "岩石記憶碟",
    "Rockium Z": "岩石Z",
    "Rocky Helmet": "凸凸頭盔",
    "Room Service": "客房服務",
    "Root Fossil": "根狀化石",
    "Rose Incense": "花朵薰香",
    "Roseli Berry": "洛玫果",
    "Rowap Berry": "霧蓮果",
    "Rusted Shield": "腐朽的盾",
    "Rusted Sword": "腐朽的劍",
    "Sablenite": "勾魂眼進化石",
    "Sachet": "香袋",
    "Safari Ball": "狩獵球",
    "Safety Goggles": "防塵護目鏡",
    "Sail Fossil": "鰭之化石",
    "Salac Berry": "沙鱗果",
    "Salamencite": "暴飛龍進化石",
    "Sceptilite": "蜥蜴王進化石",
    "Scizorite": "巨鉗螳螂進化石",
    "Scope Lens": "焦點鏡",
    "Sea Incense": "海潮薰香",
    "Sharp Beak": "銳利鳥嘴",
    "Sharpedonite": "巨牙鯊進化石",
    "Shed Shell": "美麗空殼",
    "Shell Bell": "貝殼之鈴",
    "Shiny Stone": "光之石",
    "Shock Drive": "閃電卡帶",
    "Shuca Berry": "腰木果",
    "Silk Scarf": "絲綢圍巾",
    "Silver Powder": "銀粉",
    "Sitrus Berry": "文柚果",
    "Skull Fossil": "頭蓋化石",
    "Sky Plate": "藍天石板",
    "Slowbronite": "呆殼獸進化石",
    "Smooth Rock": "沙沙岩石",
    "Snorlium Z": "卡比獸Z",
    "Snowball": "雪球",
    "Soft Sand": "柔軟沙子",
    "Solganium Z": "索爾迦雷歐Z",
    "Soul Dew": "心之水滴",
    "Spell Tag": "詛咒之符",
    "Spelon Berry": "刺角果",
    "Splash Plate": "水滴石板",
    "Spooky Plate": "妖怪石板",
    "Sport Ball": "競賽球",
    "Starf Berry": "星桃果",
    "Star Sweet": "星星糖飾",
    "Steelixite": "大鋼蛇進化石",
    "Steel Gem": "鋼之寶石",
    "Steel Memory": "鋼鐵記憶碟",
    "Steelium Z": "鋼Z",
    "Sticky Barb": "附著針",
    "Stone Plate": "岩石石板",
    "Strawberry Sweet": "草莓糖飾",
    "Sun Stone": "日之石",
    "Swampertite": "巨沼怪進化石",
    "Sweet Apple": "甜甜蘋果",
    "Tamato Berry": "茄番果",
    "Tanga Berry": "扁櫻果",
    "Tapunium Z": "卡璞Z",
    "Tart Apple": "酸酸蘋果",
    "Terrain Extender": "大地膜",
    "Thick Club": "粗骨頭",
    "Throat Spray": "爽喉噴霧",
    "Thunder Stone": "雷之石",
    "Timer Ball": "計時球",
    "Toxic Orb": "劇毒寶珠",
    "Toxic Plate": "劇毒石板",
    "Twisted Spoon": "彎曲的湯匙",
    "Tyranitarite": "班基拉斯進化石",
    "Ultra Ball": "高級球",
    "Ultranecrozium Z": "究極奈克洛Z",
    "Up-Grade": "升級數據",
    "Utility Umbrella": "萬能傘",
    "Venusaurite": "妙蛙花進化石",
    "Wacan Berry": "燭木果",
    "Water Gem": "水之寶石",
    "Water Memory": "清水記憶碟",
    "Water Stone": "水之石",
    "Waterium Z": "水Z",
    "Watmel Berry": "瓜西果",
    "Wave Incense": "漣漪薰香",
    "Weakness Policy": "弱點保險",
    "Wepear Berry": "西梨果",
    "Whipped Dream": "泡沫奶油",
    "White Herb": "白色香草",
    "Wide Lens": "廣角鏡",
    "Wiki Berry": "異奇果",
    "Wise Glasses": "博識眼鏡",
    "Yache Berry": "番荔果",
    "Zap Plate": "雷電石板",
    "Zoom Lens": "對焦鏡",
    "SilverPowder": "銀粉",
    "Galarica Wreath": "伽勒豆蔻花圈",
    "Galarica Cuff": "伽勒豆蔻手環",
    "Strange Ball": "奇異球",






    //  寶可夢

    "Bulbasaur": "妙蛙種子",
    "Ivysaur": "妙蛙草",
    "Venusaur": "妙蛙花",
    "Charmander": "小火龍",
    "Charmeleon": "火恐龍",
    "Charizard": "噴火龍",
    "Squirtle": "傑尼龜",
    "Wartortle": "卡咪龜",
    "Blastoise": "水箭龜",
    "Caterpie": "綠毛蟲",
    "Metapod": "鐵甲蛹",
    "Butterfree": "巴大蝶",
    "Weedle": "獨角蟲",
    "Kakuna": "鐵殼蛹",
    "Beedrill": "大針蜂",
    "Pidgey": "波波",
    "Pidgeotto": "比比鳥",
    "Pidgeot": "大比鳥",
    "Rattata": "小拉達",
    "Raticate": "拉達",
    "Spearow": "烈雀",
    "Fearow": "大嘴雀",
    "Ekans": "阿柏蛇",
    "Arbok": "阿柏怪",
    "Pikachu": "皮卡丘",
    "Raichu": "雷丘",
    "Sandshrew": "穿山鼠",
    "Sandslash": "穿山王",
    "Nidoran-F": "尼多蘭",
    "Nidorina": "尼多娜",
    "Nidoqueen": "尼多后",
    "Nidoran-M": "尼多朗",
    "Nidorino": "尼多力諾",
    "Nidoking": "尼多王",
    "Clefairy": "皮皮",
    "Clefable": "皮可西",
    "Vulpix": "六尾",
    "Ninetales": "九尾",
    "Jigglypuff": "胖丁",
    "Wigglytuff": "胖可丁",
    "Zubat": "超音蝠",
    "Golbat": "大嘴蝠",
    "Oddish": "走路草",
    "Gloom": "臭臭花",
    "Vileplume": "霸王花",
    "Paras": "派拉斯",
    "Parasect": "派拉斯特",
    "Venonat": "毛球",
    "Venomoth": "摩魯蛾",
    "Diglett": "地鼠",
    "Dugtrio": "三地鼠",
    "Meowth": "喵喵",
    "Persian": "貓老大",
    "Psyduck": "可達鴨",
    "Golduck": "哥達鴨",
    "Mankey": "猴怪",
    "Primeape": "火暴猴",
    "Growlithe": "卡蒂狗",
    "Arcanine": "風速狗",
    "Poliwag": "蚊香蝌蚪",
    "Poliwhirl": "蚊香君",
    "Poliwrath": "蚊香泳士",
    "Abra": "凱西",
    "Kadabra": "勇基拉",
    "Alakazam": "胡地",
    "Machop": "腕力",
    "Machoke": "豪力",
    "Machamp": "怪力",
    "Bellsprout": "喇叭芽",
    "Weepinbell": "口呆花",
    "Victreebel": "大食花",
    "Tentacool": "瑪瑙水母",
    "Tentacruel": "毒刺水母",
    "Geodude": "小拳石",
    "Graveler": "隆隆石",
    "Golem": "隆隆岩",
    "Ponyta": "小火馬",
    "Rapidash": "烈焰馬",
    "Slowpoke-Galar": "呆呆獸-伽勒爾",
    "Slowpoke": "呆呆獸",
    "Slowbro": "呆殼獸",
    "Magnemite": "小磁怪",
    "Magneton": "三合一磁怪",
    "Farfetch’d": "大蔥鴨",
    "Doduo": "嘟嘟",
    "Dodrio": "嘟嘟利",
    "Seel": "小海獅",
    "Dewgong": "白海獅",
    "Grimer": "臭泥",
    "Muk": "臭臭泥",
    "Shellder": "大舌貝",
    "Cloyster": "刺甲貝",
    "Gastly": "鬼斯",
    "Haunter": "鬼斯通",
    "Gengar": "耿鬼",
    "Onix": "大岩蛇",
    "Drowzee": "催眠貘",
    "Hypno": "引夢貘人",
    "Krabby": "大鉗蟹",
    "Kingler": "巨鉗蟹",
    "Voltorb": "霹靂電球",
    "Electrode": "頑皮雷彈",
    "Exeggcute": "蛋蛋",
    "Exeggutor": "椰蛋樹",
    "Cubone": "卡拉卡拉",
    "Marowak": "嘎啦嘎啦",
    "Hitmonlee": "飛腿郎",
    "Hitmonchan": "快拳郎",
    "Lickitung": "大舌頭",
    "Koffing": "瓦斯彈",
    "Weezing": "雙彈瓦斯",
    "Rhyhorn": "獨角犀牛",
    "Rhydon": "鑽角犀獸",
    "Chansey": "吉利蛋",
    "Tangela": "蔓藤怪",
    "Kangaskhan": "袋獸",
    "Horsea": "墨海馬",
    "Seadra": "海刺龍",
    "Goldeen": "角金魚",
    "Seaking": "金魚王",
    "Staryu": "海星星",
    "Starmie": "寶石海星",
    "Mr. Mime": "魔牆人偶",
    "Scyther": "飛天螳螂",
    "Jynx": "迷唇姐",
    "Electabuzz": "電擊獸",
    "Magmar": "鴨嘴火獸",
    "Pinsir": "凱羅斯",
    "Tauros": "肯泰羅",
    "Magikarp": "鯉魚王",
    "Gyarados": "暴鯉龍",
    "Lapras": "拉普拉斯",
    "Ditto": "百變怪",
    "Eevee": "伊布",
    "Vaporeon": "水伊布",
    "Jolteon": "雷伊布",
    "Flareon": "火伊布",
    "Omanyte": "菊石獸",
    "Omastar": "多刺菊石獸",
    "Kabuto": "化石盔",
    "Kabutops": "鐮刀盔",
    "Aerodactyl": "化石翼龍",
    "Snorlax": "卡比獸",
    "Articuno-Galar": "急凍鳥-伽勒爾",
    "Zapdos-Galar": "閃電鳥-伽勒爾",
    "Moltres-Galar": "火焰鳥-伽勒爾",
    "Articuno": "急凍鳥",
    "Zapdos": "閃電鳥",
    "Moltres": "火焰鳥",
    "Dratini": "迷你龍",
    "Dragonair": "哈克龍",
    "Dragonite": "快龍",
    "Mewtwo": "超夢",
    "Mew": "夢幻",
    "Chikorita": "菊草葉",
    "Bayleef": "月桂葉",
    "Meganium": "大竺葵",
    "Cyndaquil": "火球鼠",
    "Quilava": "火岩鼠",
    "Typhlosion": "火暴獸",
    "Totodile": "小鋸鱷",
    "Croconaw": "藍鱷",
    "Feraligatr": "大力鱷",
    "Sentret": "尾立",
    "Furret": "大尾立",
    "Hoothoot": "咕咕",
    "Noctowl": "貓頭夜鷹",
    "Ledyba": "芭瓢蟲",
    "Ledian": "安瓢蟲",
    "Spinarak": "圓絲蛛",
    "Ariados": "阿利多斯",
    "Crobat": "叉字蝠",
    "Chinchou": "燈籠魚",
    "Lanturn": "電燈怪",
    "Pichu": "皮丘",
    "Cleffa": "皮寶寶",
    "Igglybuff": "寶寶丁",
    "Togepi": "波克比",
    "Togetic": "波克基古",
    "Natu": "天然雀",
    "Xatu": "天然鳥",
    "Mareep": "咩利羊",
    "Flaaffy": "茸茸羊",
    "Ampharos": "電龍",
    "Bellossom": "美麗花",
    "Marill": "瑪力露",
    "Azumarill": "瑪力露麗",
    "Sudowoodo": "樹才怪",
    "Politoed": "蚊香蛙皇",
    "Hoppip": "毽子草",
    "Skiploom": "毽子花",
    "Jumpluff": "毽子棉",
    "Aipom": "長尾怪手",
    "Sunkern": "向日種子",
    "Sunflora": "向日花怪",
    "Yanma": "蜻蜻蜓",
    "Wooper": "烏波",
    "Quagsire": "沼王",
    "Espeon": "太陽伊布",
    "Umbreon": "月亮伊布",
    "Murkrow": "黑暗鴉",
    "Slowking": "呆呆王",
    "Misdreavus": "夢妖",
    "Unown-A": "未知圖騰-A",
    "Unown-B": "未知圖騰-B",
    "Unown-C": "未知圖騰-C",
    "Unown-D": "未知圖騰-D",
    "Unown-E": "未知圖騰-E",
    "Unown-F": "未知圖騰-F",
    "Unown-G": "未知圖騰-G",
    "Unown-H": "未知圖騰-H",
    "Unown-I": "未知圖騰-I",
    "Unown-J": "未知圖騰-J",
    "Unown-K": "未知圖騰-K",
    "Unown-L": "未知圖騰-L",
    "Unown-N": "未知圖騰-N",
    "Unown-M": "未知圖騰-M",
    "Unown-O": "未知圖騰-O",
    "Unown-P": "未知圖騰-P",
    "Unown-Q": "未知圖騰-Q",
    "Unown-R": "未知圖騰-R",
    "Unown-S": "未知圖騰-S",
    "Unown-T": "未知圖騰-T",
    "Unown-U": "未知圖騰-U",
    "Unown-V": "未知圖騰-V",
    "Unown-W": "未知圖騰-W",
    "Unown-X": "未知圖騰-X",
    "Unown-Y": "未知圖騰-Y",
    "Unown-Z": "未知圖騰-Z",
    "Unown-Question": "未知圖騰-？",
    "Unown-Exclamation": "未知圖騰-！",
    "Unown": "未知圖騰",
    "Wobbuffet": "果然翁",
    "Girafarig": "麒麟奇",
    "Pineco": "榛果球",
    "Forretress": "佛烈托斯",
    "Dunsparce": "土龍弟弟",
    "Gligar": "天蠍",
    "Steelix": "大鋼蛇",
    "Snubbull": "布魯",
    "Granbull": "布魯皇",
    "Qwilfish": "千針魚",
    "Scizor": "巨鉗螳螂",
    "Shuckle": "壺壺",
    "Heracross": "赫拉克羅斯",
    "Sneasel": "狃拉",
    "Teddiursa": "熊寶寶",
    "Ursaring": "圈圈熊",
    "Slugma": "熔岩蟲",
    "Magcargo": "熔岩蝸牛",
    "Swinub": "小山豬",
    "Piloswine": "長毛豬",
    "Corsola": "太陽珊瑚",
    "Remoraid": "鐵炮魚",
    "Octillery": "章魚桶",
    "Delibird": "信使鳥",
    "Mantine": "巨翅飛魚",
    "Skarmory": "盔甲鳥",
    "Houndour": "戴魯比",
    "Houndoom": "黑魯加",
    "Kingdra": "刺龍王",
    "Phanpy": "小小象",
    "Donphan": "頓甲",
    "Stantler": "驚角鹿",
    "Smeargle": "圖圖犬",
    "Tyrogue": "無畏小子",
    "Hitmontop": "戰舞郎",
    "Smoochum": "迷唇娃",
    "Elekid": "電擊怪",
    "Magby": "鴨嘴寶寶",
    "Miltank": "大奶罐",
    "Blissey": "幸福蛋",
    "Raikou": "雷公",
    "Entei": "炎帝",
    "Suicune": "水君",
    "Larvitar": "幼基拉斯",
    "Pupitar": "沙基拉斯",
    "Tyranitar": "班基拉斯",
    "Lugia": "洛奇亞",
    "Ho-Oh": "鳳王",
    "Celebi": "時拉比",
    "Treecko": "木守宮",
    "Grovyle": "森林蜥蜴",
    "Sceptile": "蜥蜴王",
    "Torchic": "火稚雞",
    "Combusken": "力壯雞",
    "Blaziken": "火焰雞",
    "Mudkip": "水躍魚",
    "Marshtomp": "沼躍魚",
    "Swampert": "巨沼怪",
    "Poochyena": "土狼犬",
    "Mightyena": "大狼犬",
    "Zigzagoon": "蛇紋熊",
    "Linoone": "直衝熊",
    "Wurmple": "刺尾蟲",
    "Silcoon": "甲殼繭",
    "Beautifly": "狩獵鳳蝶",
    "Cascoon": "盾甲繭",
    "Dustox": "毒粉蛾",
    "Lotad": "蓮葉童子",
    "Lombre": "蓮帽小童",
    "Ludicolo": "樂天河童",
    "Seedot": "橡實果",
    "Nuzleaf": "長鼻葉",
    "Shiftry": "狡猾天狗",
    "Taillow": "傲骨燕",
    "Swellow": "大王燕",
    "Wingull": "長翅鷗",
    "Pelipper": "大嘴鷗",
    "Ralts": "拉魯拉絲",
    "Kirlia": "奇魯莉安",
    "Gardevoir": "沙奈朵",
    "Surskit": "溜溜糖球",
    "Masquerain": "雨翅蛾",
    "Shroomish": "蘑蘑菇",
    "Breloom": "鬥笠菇",
    "Slakoth": "懶人獺",
    "Vigoroth": "過動猿",
    "Slaking": "請假王",
    "Nincada": "土居忍士",
    "Ninjask": "鐵面忍者",
    "Shedinja": "脫殼忍者",
    "Whismur": "咕妞妞",
    "Loudred": "吼爆彈",
    "Exploud": "爆音怪",
    "Makuhita": "幕下力士",
    "Hariyama": "鐵掌力士",
    "Azurill": "露力麗",
    "Nosepass": "朝北鼻",
    "Skitty": "向尾喵",
    "Delcatty": "優雅貓",
    "Sableye": "勾魂眼",
    "Mawile": "大嘴娃",
    "Aron": "可可多拉",
    "Lairon": "可多拉",
    "Aggron": "波士可多拉",
    "Meditite": "瑪沙那",
    "Medicham": "恰雷姆",
    "Electrike": "落雷獸",
    "Manectric": "雷電獸",
    "Plusle": "正電拍拍",
    "Minun": "負電拍拍",
    "Volbeat": "電螢蟲",
    "Illumise": "甜甜螢",
    "Roselia": "毒薔薇",
    "Gulpin": "溶食獸",
    "Swalot": "吞食獸",
    "Carvanha": "利牙魚",
    "Sharpedo": "巨牙鯊",
    "Wailmer": "吼吼鯨",
    "Wailord": "吼鯨王",
    "Numel": "呆火駝",
    "Camerupt": "噴火駝",
    "Torkoal": "煤炭龜",
    "Spoink": "跳跳豬",
    "Grumpig": "噗噗豬",
    "Spinda": "晃晃斑",
    "Trapinch": "大顎蟻",
    "Vibrava": "超音波幼蟲",
    "Flygon": "沙漠蜻蜓",
    "Cacnea": "刺球仙人掌",
    "Cacturne": "夢歌仙人掌",
    "Swablu": "青綿鳥",
    "Altaria": "七夕青鳥",
    "Zangoose": "貓鼬斬",
    "Seviper": "飯匙蛇",
    "Lunatone": "月石",
    "Solrock": "太陽岩",
    "Barboach": "泥泥鰍",
    "Whiscash": "鯰魚王",
    "Corphish": "龍蝦小兵",
    "Crawdaunt": "鐵螯龍蝦",
    "Baltoy": "天秤偶",
    "Claydol": "念力土偶",
    "Lileep": "觸手百合",
    "Cradily": "搖籃百合",
    "Anorith": "太古羽蟲",
    "Armaldo": "太古盔甲",
    "Feebas": "醜醜魚",
    "Milotic": "美納斯",
    "Castform": "飄浮泡泡",
    "Kecleon": "變隱龍",
    "Shuppet": "怨影娃娃",
    "Banette": "詛咒娃娃",
    "Duskull": "夜巡靈",
    "Dusclops": "仿徨夜靈",
    "Tropius": "熱帶龍",
    "Chimecho": "風鈴鈴",
    "Absol": "阿勃梭魯",
    "Wynaut": "小果然",
    "Snorunt": "雪童子",
    "Glalie": "冰鬼護",
    "Spheal": "海豹球",
    "Sealeo": "海魔獅",
    "Walrein": "帝牙海獅",
    "Clamperl": "珍珠貝",
    "Huntail": "獵斑魚",
    "Gorebyss": "櫻花魚",
    "Relicanth": "古空棘魚",
    "Luvdisc": "愛心魚",
    "Bagon": "寶貝龍",
    "Shelgon": "甲殼龍",
    "Salamence": "暴飛龍",
    "Beldum": "鐵啞鈴",
    "Metang": "金屬怪",
    "Metagross": "巨金怪",
    "Regirock": "雷吉洛克",
    "Regice": "雷吉艾斯",
    "Registeel": "雷吉斯奇魯",
    "Latias": "拉帝亞斯",
    "Latios": "拉帝歐斯",
    "Kyogre": "蓋歐卡",
    "Groudon": "固拉多",
    "Rayquaza": "烈空坐",
    "Jirachi": "基拉祈",
    "Turtwig": "草苗龜",
    "Grotle": "樹林龜",
    "Torterra": "土台龜",
    "Chimchar": "小火焰猴",
    "Monferno": "猛火猴",
    "Infernape": "烈焰猴",
    "Piplup": "波加曼",
    "Prinplup": "波皇子",
    "Empoleon": "帝王拿波",
    "Starly": "姆克兒",
    "Staravia": "姆克鳥",
    "Staraptor": "姆克鷹",
    "Bidoof": "大牙貍",
    "Bibarel": "大尾貍",
    "Kricketot": "圓法師",
    "Kricketune": "音箱蟀",
    "Shinx": "小貓怪",
    "Luxio": "勒克貓",
    "Luxray": "倫琴貓",
    "Budew": "含羞苞",
    "Roserade": "羅絲雷朵",
    "Cranidos": "頭蓋龍",
    "Rampardos": "戰槌龍",
    "Shieldon": "盾甲龍",
    "Bastiodon": "護城龍",
    "Burmy": "結草兒",
    "Wormadam": "結草貴婦",
    "Mothim": "紳士蛾",
    "Combee": "三蜜蜂",
    "Vespiquen": "蜂女王",
    "Pachirisu": "帕奇利茲",
    "Buizel": "泳圈鼬",
    "Floatzel": "浮潛鼬",
    "Cherubi": "櫻花寶",
    "Cherrim": "櫻花兒",
    "Shellos": "無殼海兔",
    "Gastrodon-East": "海兔獸-東海",
    "Gastrodon": "海兔獸",
    "Ambipom": "雙尾怪手",
    "Drifloon": "飄飄球",
    "Drifblim": "隨風球",
    "Buneary": "卷卷耳",
    "Lopunny": "長耳兔",
    "Mismagius": "夢妖魔",
    "Honchkrow": "烏鴉頭頭",
    "Glameow": "魅力喵",
    "Purugly": "東施喵",
    "Chingling": "鈴鐺響",
    "Stunky": "臭鼬噗",
    "Skuntank": "坦克臭鼬",
    "Bronzor": "銅鏡怪",
    "Bronzong": "青銅鐘",
    "Bonsly": "盆才怪",
    "Mime Jr.": "魔尼尼",
    "Happiny": "小福蛋",
    "Chatot": "聒噪鳥",
    "Spiritomb": "花岩怪",
    "Gible": "圓陸鯊",
    "Gabite": "尖牙陸鯊",
    "Garchomp": "烈咬陸鯊",
    "Munchlax": "小卡比獸",
    "Riolu": "利歐路",
    "Lucario": "路卡利歐",
    "Hippopotas": "沙河馬",
    "Hippowdon": "河馬獸",
    "Skorupi": "鉗尾蠍",
    "Drapion": "龍王蠍",
    "Croagunk": "不良蛙",
    "Toxicroak": "毒骷蛙",
    "Carnivine": "尖牙籠",
    "Finneon": "熒光魚",
    "Lumineon": "霓虹魚",
    "Mantyke": "小球飛魚",
    "Snover": "雪笠怪",
    "Abomasnow": "暴雪王",
    "Weavile": "瑪狃拉",
    "Magnezone": "自爆磁怪",
    "Lickilicky": "大舌舔",
    "Rhyperior": "超甲狂犀",
    "Tangrowth": "巨蔓藤",
    "Electivire": "電擊魔獸",
    "Magmortar": "鴨嘴炎獸",
    "Togekiss": "波克基斯",
    "Yanmega": "遠古巨蜓",
    "Leafeon": "葉伊布",
    "Glaceon": "冰伊布",
    "Gliscor": "天蠍王",
    "Mamoswine": "象牙豬",
    "Porygon2": "多邊獸II",
    "Porygon-Z": "多邊獸Z",
    "Porygon": "多邊獸",
    "Gallade": "艾路雷朵",
    "Probopass": "大朝北鼻",
    "Dusknoir": "黑夜魔靈",
    "Froslass": "雪妖女",
    "Rotom": "洛托姆",
    "Uxie": "由克希",
    "Mesprit": "艾姆利多",
    "Azelf": "亞克諾姆",
    "Dialga-Origin": "帝牙盧卡-起源形態",
    "Dialga": "帝牙盧卡",
    "Palkia-Origin": "帕路奇亞-起源形態",
    "Palkia": "帕路奇亞",
    "Heatran": "席多藍恩",
    "Regigigas": "雷吉奇卡斯",
    "Giratina-Origin": "騎拉帝納-起源形態",
    "Giratina": "騎拉帝納",
    "Cresselia": "克雷色利亞",
    "Phione": "霏歐納",
    "Manaphy": "瑪納霏",
    "Darkrai": "達克萊伊",
    "Shaymin": "謝米",
    "Victini": "比克提尼",
    "Snivy": "藤藤蛇",
    "Servine": "青藤蛇",
    "Serperior": "君主蛇",
    "Tepig": "暖暖豬",
    "Pignite": "炒炒豬",
    "Emboar": "炎武王",
    "Oshawott": "水水獺",
    "Dewott": "雙刃丸",
    "Samurott": "大劍鬼",
    "Patrat": "探探鼠",
    "Watchog": "步哨鼠",
    "Lillipup": "小約克",
    "Herdier": "哈約克",
    "Stoutland": "長毛狗",
    "Purrloin": "扒手貓",
    "Liepard": "酷豹",
    "Pansage": "花椰猴",
    "Simisage": "花椰猿",
    "Pansear": "爆香猴",
    "Simisear": "爆香猿",
    "Panpour": "冷水猴",
    "Simipour": "冷水猿",
    "Munna": "食夢夢",
    "Musharna": "夢夢蝕",
    "Pidove": "豆豆鴿",
    "Tranquill": "咕咕鴿",
    "Unfezant": "高傲雉雞",
    "Blitzle": "斑斑馬",
    "Zebstrika": "雷電斑馬",
    "Roggenrola": "石丸子",
    "Boldore": "地幔岩",
    "Gigalith": "龐岩怪",
    "Woobat": "滾滾蝙蝠",
    "Swoobat": "心蝙蝠",
    "Drilbur": "螺釘地鼠",
    "Excadrill": "龍頭地鼠",
    "Audino": "差不多娃娃",
    "Timburr": "搬運小匠",
    "Gurdurr": "鐵骨土人",
    "Conkeldurr": "修建老匠",
    "Tympole": "圓蝌蚪",
    "Palpitoad": "藍蟾蜍",
    "Seismitoad": "蟾蜍王",
    "Throh": "投摔鬼",
    "Sawk": "打擊鬼",
    "Sewaddle": "蟲寶包",
    "Swadloon": "寶包繭",
    "Leavanny": "保姆蟲",
    "Venipede": "百足蜈蚣",
    "Whirlipede": "車輪球",
    "Scolipede": "蜈蚣王",
    "Cottonee": "木棉球",
    "Whimsicott": "風妖精",
    "Petilil": "百合根娃娃",
    "Lilligant": "裙兒小姐",
    "Basculin-Blue-Striped": "野蠻鱸魚-藍條紋的樣子",
    "Basculin-White-Striped": "野蠻鱸魚-白條紋的樣子",
    "Basculin": "野蠻鱸魚",
    "Sandile": "黑眼鱷",
    "Krokorok": "混混鱷",
    "Krookodile": "流氓鱷",
    "Darumaka": "火紅不倒翁",
    "Darmanitan": "達摩狒狒",
    "Maractus": "沙鈴仙人掌",
    "Dwebble": "石居蟹",
    "Crustle": "岩殿居蟹",
    "Scraggy": "滑滑小子",
    "Scrafty": "頭巾混混",
    "Sigilyph": "象征鳥",
    "Yamask": "哭哭面具",
    "Cofagrigus": "死神棺",
    "Tirtouga": "原蓋海龜",
    "Carracosta": "肋骨海龜",
    "Archen": "始祖小鳥",
    "Archeops": "始祖大鳥",
    "Trubbish": "破破袋",
    "Garbodor": "灰塵山",
    "Zorua": "索羅亞",
    "Zoroark": "索羅亞克",
    "Minccino": "泡沫栗鼠",
    "Cinccino": "奇諾栗鼠",
    "Gothita": "哥德寶寶",
    "Gothorita": "哥德小童",
    "Gothitelle": "哥德小姐",
    "Solosis": "單卵細胞球",
    "Duosion": "雙卵細胞球",
    "Reuniclus": "人造細胞卵",
    "Ducklett": "鴨寶寶",
    "Swanna": "舞天鵝",
    "Vanillite": "迷你冰",
    "Vanillish": "多多冰",
    "Vanilluxe": "雙倍多多冰",
    "Deerling": "四季鹿",
    "Sawsbuck-Summer": "萌芽鹿-夏天的樣子",
    "Sawsbuck-Autumn": "萌芽鹿-秋天的樣子",
    "Sawsbuck-Winter": "萌芽鹿-冬天的樣子",
    "Sawsbuck": "萌芽鹿",
    "Emolga": "電飛鼠",
    "Karrablast": "蓋蓋蟲",
    "Escavalier": "騎士蝸牛",
    "Foongus": "哎呀球菇",
    "Amoonguss": "敗露球菇",
    "Frillish": "輕飄飄",
    "Jellicent": "胖嘟嘟",
    "Alomomola": "保姆曼波",
    "Joltik": "電電蟲",
    "Galvantula": "電蜘蛛",
    "Ferroseed": "種子鐵球",
    "Ferrothorn": "堅果啞鈴",
    "Klink": "齒輪兒",
    "Klang": "齒輪組",
    "Klinklang": "齒輪怪",
    "Tynamo": "麻麻小魚",
    "Eelektrik": "麻麻鰻",
    "Eelektross": "麻麻鰻魚王",
    "Elgyem": "小灰怪",
    "Beheeyem": "大宇怪",
    "Litwick": "燭光靈",
    "Lampent": "燈火幽靈",
    "Chandelure": "水晶燈火靈",
    "Axew": "牙牙",
    "Fraxure": "斧牙龍",
    "Haxorus": "雙斧戰龍",
    "Cubchoo": "噴嚏熊",
    "Beartic": "凍原熊",
    "Cryogonal": "幾何雪花",
    "Shelmet": "小嘴蝸",
    "Accelgor": "敏捷蟲",
    "Stunfisk": "泥巴魚",
    "Mienfoo": "功夫鼬",
    "Mienshao": "師父鼬",
    "Druddigon": "赤面龍",
    "Golett": "泥偶小人",
    "Golurk": "泥偶巨人",
    "Pawniard": "駒刀小兵",
    "Bisharp": "劈斬司令",
    "Bouffalant": "爆炸頭水牛",
    "Rufflet": "毛頭小鷹",
    "Braviary": "勇士雄鷹",
    "Vullaby": "禿鷹丫頭",
    "Mandibuzz": "禿鷹娜",
    "Heatmor": "熔蟻獸",
    "Durant": "鐵蟻",
    "Deino": "單首龍",
    "Zweilous": "雙首暴龍",
    "Hydreigon": "三首惡龍",
    "Larvesta": "燃燒蟲",
    "Volcarona": "火神蛾",
    "Cobalion": "勾帕路翁",
    "Terrakion": "代拉基翁",
    "Virizion": "畢力吉翁",
    "Tornadus-Therian": "龍卷雲-靈獸形態",
    "Thundurus-Therian": "雷電雲-靈獸形態",
    "Landorus-Therian": "土地雲-靈獸形態",
    "Enamorus-Therian": "眷戀雲-靈獸形態",
    "Tornadus": "龍卷雲",
    "Thundurus": "雷電雲",
    "Landorus": "土地雲",
    "Enamorus": "眷戀雲",
    "Reshiram": "萊希拉姆",
    "Zekrom": "捷克羅姆",
    "Kyurem-White": "酋雷姆-焰白",
    "Kyurem-Black": "酋雷姆-暗黑",
    "Kyurem": "酋雷姆",
    "Keldeo": "凱路迪歐",
    "Meloetta": "美洛耶塔",
    "Genesect": "蓋諾賽克特",
    "Chespin": "哈力栗",
    "Quilladin": "胖胖哈力",
    "Chesnaught": "布里卡隆",
    "Fennekin": "火狐貍",
    "Braixen": "長尾火狐",
    "Delphox": "妖火紅狐",
    "Froakie": "呱呱泡蛙",
    "Frogadier": "呱頭蛙",
    "Greninja": "甲賀忍蛙",
    "-Bond": "-牽絆",
    "-Ash": "-小智版",
    "Greninja-Bond": "甲賀忍蛙-牽絆",
    "Greninja-Ash": "甲賀忍蛙-小智版",
    "Bunnelby": "掘掘兔",
    "Diggersby": "掘地兔",
    "Fletchling": "小箭雀",
    "Fletchinder": "火箭雀",
    "Talonflame": "烈箭鷹",
    "Scatterbug": "粉蝶蟲",
    "Spewpa": "粉蝶蛹",
    "Vivillon-Archipelago": "彩粉蝶-群島花紋",
    "Vivillon-Continental": "彩粉蝶-大陸花紋",
    "Vivillon-Elegant": "彩粉蝶-高雅花紋",
    "Vivillon-Garden": "彩粉蝶-庭園花紋",
    "Vivillon-High Plains": "彩粉蝶-荒野花紋",
    "Vivillon-Icy Snow": "彩粉蝶-冰雪花紋",
    "Vivillon-Jungle": "彩粉蝶-熱帶雨林花紋",
    "Vivillon-Marine": "彩粉蝶-大海花紋",
    "Vivillon-Modern": "彩粉蝶-摩登花紋",
    "Vivillon-Monsoon": "彩粉蝶-驟雨花紋",
    "Vivillon-Ocean": "彩粉蝶-大洋花紋",
    "Vivillon-Polar": "彩粉蝶-雪國花紋",
    "Vivillon-River": "彩粉蝶-大河花紋",
    "Vivillon-Sandstorm": "彩粉蝶-沙塵花紋",
    "Vivillon-Savanna": "彩粉蝶-熱帶草原花紋",
    "Vivillon-Sun": "彩粉蝶-太陽花紋",
    "Vivillon-Tundra": "彩粉蝶-雪原花紋",
    "Vivillon": "彩粉蝶",
    "Litleo": "小獅獅",
    "Pyroar": "火炎獅",
    "Flabébé": "花蓓蓓",
    "Floette-Orange": "花葉蒂-橙花",
    "Floette-White": "花葉蒂-白花",
    "Floette-Yellow": "花葉蒂",
    "Floette-Blue": "花葉蒂-黃花",
    "Floette": "花葉蒂-藍花",
    "Florges-Orange": "花潔夫人-橙花",
    "Florges-White": "花潔夫人-白花",
    "Florges-Yellow": "花潔夫人-黃花",
    "Florges-Blue": "花潔夫人-藍花",
    "Florges": "花潔夫人",
    "Skiddo": "坐騎小羊",
    "Gogoat": "坐騎山羊",
    "Pancham": "頑皮熊貓",
    "Pangoro": "流氓熊貓",
    "Furfrou-Heart": "多麗米亞-心形造型",
    "Furfrou-Dandy": "多麗米亞-紳士造型",
    "Furfrou-Debutante": "多麗米亞-淑女造型",
    "Furfrou-Diamond": "多麗米亞-菱形造型",
    "Furfrou-Matron": "多麗米亞-貴婦造型",
    "Furfrou-Pharaoh": "多麗米亞-國王造型",
    "Furfrou-Star": "多麗米亞-星形造型",
    "Furfrou-La Reine": "多麗米亞-女王造型",
    "Furfrou-Kabuki": "多麗米亞-歌舞伎造型",
    "Furfrou": "多麗米亞",
    "Espurr": "妙喵",
    "Honedge": "獨劍鞘",
    "Doublade": "雙劍鞘",
    "Aegislash": "堅盾劍怪",
    "Spritzee": "粉香香",
    "Aromatisse": "芳香精",
    "Swirlix": "綿綿泡芙",
    "Slurpuff": "胖甜妮",
    "Inkay": "好啦魷",
    "Malamar": "烏賊王",
    "Binacle": "龜腳腳",
    "Barbaracle": "龜足巨鎧",
    "Skrelp": "垃垃藻",
    "Dragalge": "毒藻龍",
    "Clauncher": "鐵臂槍蝦",
    "Clawitzer": "鋼炮臂蝦",
    "Helioptile": "傘電蜥",
    "Heliolisk": "光電傘蜥",
    "Tyrunt": "寶寶暴龍",
    "Tyrantrum": "怪顎龍",
    "Amaura": "冰雪龍",
    "Aurorus": "冰雪巨龍",
    "Sylveon": "仙子伊布",
    "Hawlucha": "摔角鷹人",
    "Dedenne": "咚咚鼠",
    "Carbink": "小碎鑽",
    "Goomy": "黏黏寶",
    "Sliggoo": "黏美兒",
    "Goodra": "黏美龍",
    "Klefki": "鑰圈兒",
    "Phantump": "小木靈",
    "Trevenant": "朽木妖",
    "Pumpkaboo": "南瓜精",
    "Gourgeist": "南瓜怪人",
    "Bergmite": "冰寶",
    "Avalugg": "冰岩怪",
    "Noibat": "嗡蝠",
    "Noivern": "音波龍",
    "Xerneas-Neutral": "哲爾尼亞斯-放松模式",
    "Xerneas-Active": "哲爾尼亞斯-活躍模式",
    "Xerneas": "哲爾尼亞斯",
    "Yveltal": "伊裴爾塔爾",
    "Zygarde-Complete": "基格爾德-完全體形態",
    "Zygarde Complete": "完全體形態基格爾德",
    "Zygarde-50%": "基格爾德-50%形態",
    "Zygarde-10%": "基格爾德-10%形態",
    "Zygarde": "基格爾德",
    "Diancie": "蒂安希",
    "Hoopa": "胡帕",
    "Volcanion": "波爾凱尼恩",
    "Rowlet": "木木梟",
    "Dartrix": "投羽梟",
    "Decidueye": "狙射樹梟",
    "Litten": "火斑喵",
    "Torracat": "炎熱喵",
    "Incineroar": "熾焰咆哮虎",
    "Popplio": "球球海獅",
    "Brionne": "花漾海獅",
    "Primarina": "西獅海壬",
    "Pikipek": "小篤兒",
    "Trumbeak": "喇叭啄鳥",
    "Toucannon": "銃嘴大鳥",
    "Yungoos": "貓鼬少",
    "Gumshoos": "貓鼬探長",
    "Grubbin": "強顎雞母蟲",
    "Charjabug": "蟲電寶",
    "Vikavolt": "鍬農炮蟲",
    "Crabrawler": "好勝蟹",
    "Crabominable": "好勝毛蟹",
    "Oricorio-Pom-Pom": "花舞鳥-啪滋啪滋風格",
    "Oricorio-Pa'u": "花舞鳥-呼啦呼啦風格",
    "Oricorio-Sensu": "花舞鳥-輕盈輕盈風格",
    "Oricorio": "花舞鳥",
    "Cutiefly": "萌虻",
    "Ribombee": "蝶結萌虻",
    "Rockruff": "岩狗狗",
    "Lycanroc-Midnight": "鬃岩狼人-黑夜",
    "Lycanroc-Dusk": "鬃岩狼人-黃昏",
    "Lycanroc": "鬃岩狼人",
    "Wishiwashi": "弱丁魚",
    "Mareanie": "好壞星",
    "Toxapex": "超壞星",
    "Mudbray": "泥驢仔",
    "Mudsdale": "重泥挽馬",
    "Dewpider": "滴蛛",
    "Araquanid": "滴蛛霸",
    "Fomantis": "偽螳草",
    "Lurantis": "蘭螳花",
    "Morelull": "睡睡菇",
    "Shiinotic": "燈罩夜菇",
    "Salandit": "夜盜火蜥",
    "Salazzle": "焰后蜥",
    "Stufful": "童偶熊",
    "Bewear": "穿著熊",
    "Bounsweet": "甜竹竹",
    "Steenee": "甜舞妮",
    "Tsareena": "甜冷美后",
    "Comfey": "花療環環",
    "Oranguru": "智揮猩",
    "Passimian": "投擲猴",
    "Wimpod": "膽小蟲",
    "Golisopod": "具甲武者",
    "Sandygast": "沙丘娃",
    "Palossand": "噬沙堡爺",
    "Pyukumuku": "拳海參",
    "Type: Null": "屬性：空",
    "Silvally": "銀伴戰獸",
    "Minior-Orange": "小隕星-橙色核心",
    "Minior-Yellow": "小隕星-黃色核心",
    "Minior-Green": "小隕星-綠色核心",
    "Minior-Blue": "小隕星-藍色核心",
    "Minior-Indigo": "小隕星-淺藍色核心",
    "Minior-Violet": "小隕星-紫色核心",
    "Minior": "小隕星",
    "-Green": "-綠色核心",
    "-Indigo": "-淺藍色核心",
    "-Violet": "-紫色核心",
    "Komala": "樹枕尾熊",
    "Turtonator": "爆焰龜獸",
    "Togedemaru": "托戈德瑪爾",
    "Mimikyu": "謎擬Q",
    "Bruxish": "磨牙彩皮魚",
    "Drampa": "老翁龍",
    "Dhelmise": "破破舵輪",
    "Jangmo-o": "心鱗寶",
    "Hakamo-o": "鱗甲龍",
    "Kommo-o": "杖尾鱗甲龍",
    "Tapu Koko": "卡璞・鳴鳴",
    "Tapu Lele": "卡璞・蝶蝶",
    "Tapu Bulu": "卡璞・哞哞",
    "Tapu Fini": "卡璞・鰭鰭",
    "Cosmog": "科斯莫古",
    "Cosmoem": "科斯莫姆",
    "Solgaleo": "索爾迦雷歐",
    "Lunala": "露奈雅拉",
    "Nihilego": "虛吾伊德",
    "Buzzwole": "爆肌蚊",
    "Pheromosa": "費洛美螂",
    "Xurkitree": "電束木",
    "Celesteela": "鐵火輝夜",
    "Kartana": "紙御劍",
    "Guzzlord": "惡食大王",
    "Necrozma": "奈克洛茲瑪",
    "Magearna": "瑪機雅娜",
    "Marshadow": "瑪夏多",
    "Poipole": "毒貝比",
    "Naganadel": "四顎針龍",
    "Stakataka": "壘磊石",
    "Blacephalon": "砰頭小醜",
    "Zeraora": "捷拉奧拉",
    "Meltan": "美錄坦",
    "Melmetal": "美錄梅塔",
    "Grookey": "敲音猴",
    "Thwackey": "啪咚猴",
    "Rillaboom": "轟擂金剛猩",
    "Scorbunny": "炎兔兒",
    "Raboot": "騰蹴小將",
    "Cinderace": "閃焰王牌",
    "Sobble": "淚眼蜥",
    "Drizzile": "變澀蜥",
    "Inteleon": "千面避役",
    "Skwovet": "貪心栗鼠",
    "Greedent": "藏飽栗鼠",
    "Rookidee": "稚山雀",
    "Corvisquire": "藍鴉",
    "Corviknight": "鋼鎧鴉",
    "Blipbug": "索偵蟲",
    "Dottler": "天罩蟲",
    "Orbeetle": "以歐路普",
    "Nickit": "偷兒狐",
    "Thievul": "狐大盜",
    "Gossifleur": "幼棉棉",
    "Eldegoss": "白蓬蓬",
    "Wooloo": "毛辮羊",
    "Dubwool": "毛毛角羊",
    "Chewtle": "咬咬龜",
    "Drednaw": "暴噬龜",
    "Deoxys-Attack": "代歐奇希斯-攻擊形態",
    "Deoxys-Defense": "代歐奇希斯-防禦形態",
    "Deoxys-Speed": "代歐奇希斯-速度形態",
    "Deoxys": "代歐奇希斯",
    "Yamper": "來電汪",
    "Boltund": "逐電犬",
    "Rolycoly": "小炭仔",
    "Carkol": "大炭車",
    "Coalossal": "巨炭山",
    "Applin": "啃果蟲",
    "Flapple": "蘋裹龍",
    "Appletun": "豐蜜龍",
    "Silicobra": "沙包蛇",
    "Sandaconda": "沙螺蟒",
    "Cramorant": "古月鳥",
    "Arrokuda": "刺梭魚",
    "Barraskewda": "戽鬥尖梭",
    "Toxel": "毒電嬰",
    "Toxtricity-Low-Key": "顫弦蠑螈-低調形態",
    "Toxtricity": "顫弦蠑螈",
    "Sizzlipede": "燒火蚣",
    "Centiskorch": "焚焰蚣",
    "Clobbopus": "拳拳蛸",
    "Grapploct": "八爪武師",
    "Sinistea": "來悲茶",
    "Polteageist": "怖思壺",
    "Hatenna": "迷布莉姆",
    "Hattrem": "提布莉姆",
    "Hatterene": "布莉姆溫",
    "Impidimp": "搗蛋小妖",
    "Morgrem": "詐唬魔",
    "Grimmsnarl": "長毛巨魔",
    "Obstagoon": "堵攔熊",
    "Perrserker": "喵頭目",
    "Cursola": "魔靈珊瑚",
    "Sirfetch’d": "蔥遊兵",
    "Mr. Rime": "踏冰人偶",
    "Runerigus": "死神板",
    "Milcery": "小仙奶",
    "Alcremie-Ruby-Cream": "霜奶仙-奶香紅鑽",
    "Alcremie-Matcha-Cream": "霜奶仙-奶香抹茶",
    "Alcremie-Mint-Cream": "霜奶仙-奶香薄荷",
    "Alcremie-Lemon-Cream": "霜奶仙-奶香檸檬",
    "Alcremie-Salted-Cream": "霜奶仙-奶香雪鹽",
    "Alcremie-Ruby-Swirl": "霜奶仙-紅鑽綜合",
    "Alcremie-Caramel-Swirl": "霜奶仙-焦糖綜合",
    "Alcremie-Rainbow-Swirl": "霜奶仙-三色綜合",
    "Alcremie": "霜奶仙",
    "Falinks": "列陣兵",
    "Pincurchin": "啪嚓海膽",
    "Snom": "雪吞蟲",
    "Frosmoth": "雪絨蛾",
    "Stonjourner": "巨石丁",
    "Eiscue": "冰砌鵝",
    "Morpeko": "莫魯貝可",
    "Cufant": "銅象",
    "Copperajah": "大王銅象",
    "Dracozolt": "雷鳥龍",
    "Arctozolt": "雷鳥海獸",
    "Dracovish": "鰓魚龍",
    "Arctovish": "鰓魚海獸",
    "Duraludon": "鋁鋼龍",
    "Dreepy": "多龍梅西亞",
    "Drakloak": "多龍奇",
    "Dragapult": "多龍巴魯托",
    "Zacian-Crowned": "蒼響-劍之王",
    "Zacian": "蒼響",
    "Zamazenta-Crowned": "藏瑪然特-盾之王",
    "Zamazenta": "藏瑪然特",
    "Eternatus-Eternamax": "無極汰那-無極巨化",
    "Eternatus": "無極汰那",
    "Kubfu": "熊徒弟",
    "Urshifu-Rapid-Strike": "武道熊師-連擊流",
    "Urshifu": "武道熊師",
    "Zarude-Dada": "薩戮德-阿爸",
    "Zarude": "薩戮德",
    "Regieleki": "雷吉艾勒奇",
    "Regidrago": "雷吉鐸拉戈",
    "Glastrier": "雪暴馬",
    "Spectrier": "靈幽馬",
    "Calyrex-Shadow": "蕾冠王-黑馬",
    "Calyrex-Ice": "蕾冠王-白馬",
    "Calyrex": "蕾冠王",
    "Slowking-Galar": "呆呆王-伽勒爾",
    "Slowbro-Galar": "呆殼獸-伽勒爾",
    "Wyrdeer": "詭角鹿",
    "Kleavor": "劈斧螳螂",
    "Ursaluna": "月月熊",
    "-Bloodmoon": "-赫月",
    "Sneasler": "大狃拉",
    "Overqwil": "萬針魚",
    "Sprigatito": "新葉喵",
    "Floragato": "蒂蕾喵",
    "Meowscarada": "魔幻假面喵",
    "Fuecoco": "呆火鱷",
    "Crocalor": "炙燙鱷",
    "Skeledirge": "骨紋巨聲鱷",
    "Quaxly": "潤水鴨",
    "Quaxwell": "湧躍鴨",
    "Quaquaval": "狂歡浪舞鴨",
    "Lechonk": "愛吃豚",
    "Dudunsparce-Three-Segment": "土龍節節-三節形態",
    "Dudunsparce": "土龍節節",
    "Tarountula": "團珠蛛",
    "Spidops": "操陷蛛",
    "Nymble": "豆蟋蟀",
    "Lokix": "烈腿蝗",
    "Rellor": "蟲滾泥",
    "Rabsca": "蟲甲聖",
    "Greavard": "墓仔狗",
    "Houndstone": "墓揚犬",
    "Flittle": "飄飄雛",
    "Espathra": "超能艷鴕",
    "Farigiraf": "奇麒麟",
    "Wiglett": "海地鼠",
    "Wugtrio": "三海地鼠",
    "Dondozo": "吃吼霸",
    "Veluza": "輕身鱈",
    "Finizen": "波普海豚",
    "Palafin-Hero": "海豚俠-全能形態",
    "Palafin": "海豚俠",
    "Smoliv": "迷你芙",
    "Dolliv": "奧利紐",
    "Arboliva": "奧利瓦",
    "Capsakid": "熱辣娃",
    "Scovillain": "狠辣椒",
    "Tadbulb": "光蚪仔",
    "Bellibolt": "電肚蛙",
    "Varoom": "噗隆隆",
    "Revavroom": "普隆隆姆",
    "Orthworm": "拖拖蚓",
    "Tandemaus": "一對鼠",
    "Maushold-Four": "一家鼠-四只家庭",
    "Maushold": "一家鼠",
    "Cetoddle": "走鯨",
    "Cetitan": "浩大鯨",
    "Frigibax": "涼脊龍",
    "Arctibax": "凍脊龍",
    "Baxcalibur": "戟脊龍",
    "Tatsugiri-Droopy": "米立龍-下垂姿勢",
    "Tatsugiri-Stretchy": "米立龍-平挺姿勢",
    "Tatsugiri": "米立龍",
    "Cyclizar": "摩托蜥",
    "Pawmi": "布撥",
    "Pawmo": "布土撥",
    "Pawmot": "巴布土撥",
    "Wattrel": "電海燕",
    "Kilowattrel": "大電海燕",
    "Bombirdier": "下石鳥",
    "Flamigo": "纏紅鶴",
    "Klawf": "毛崖蟹",
    "Nacli": "鹽石寶",
    "Naclstack": "鹽石壘",
    "Garganacl": "鹽石巨靈",
    "Glimmet": "晶光芽",
    "Glimmora": "晶光花",
    "Shroodle": "滋汁鼴",
    "Grafaiai": "塗標客",
    "Fidough": "狗仔包",
    "Dachsbun": "麻花犬",
    "Maschiff": "偶叫獒",
    "Mabosstiff": "獒教父",
    "Bramblin": "納噬草",
    "Brambleghast": "怖納噬草",
    "Gimmighoul": "索財靈",
    "Gholdengo": "賽富豪",
    "Great Tusk": "雄偉牙",
    "Brute Bonnet": "猛惡菇",
    "Sandy Shocks": "沙鐵皮",
    "Scream Tail": "吼叫尾",
    "Flutter Mane": "振翼髮",
    "Slither Wing": "爬地翅",
    "Roaring Moon": "轟鳴月",
    "Iron Treads": "鐵轍跡",
    "Iron Moth": "鐵毒蛾",
    "Iron Hands": "鐵臂膀",
    "Iron Jugulis": "鐵脖頸",
    "Iron Thorns": "鐵荊棘",
    "Iron Bundle": "鐵包袱",
    "Iron Valiant": "鐵武者",
    "Ting-Lu": "古鼎鹿",
    "Chien-Pao": "古劍豹",
    "Wo-Chien": "古簡蝸",
    "Chi-Yu": "古玉魚",
    "Koraidon": "故勒頓",
    "Miraidon": "密勒頓",
    "Tinkatink": "小鍛匠",
    "Tinkatuff": "巧鍛匠",
    "Tinkaton": "巨鍛將",
    "Charcadet": "炭小侍",
    "Armarouge": "紅蓮鎧騎",
    "Ceruledge": "蒼炎刃鬼",
    "Toedscool": "原野水母",
    "Toedscruel": "陸地水母",
    "Kingambit": "仆斬將軍",
    "Clodsire": "土王",
    "Annihilape": "棄世猴",
    "Iron Leaves": "鐵斑葉",
    "Walking Wake": "波蕩水",
    "Raging Bolt": "猛雷鼓",
    "Archaludon": "鋁鋼橋龍",
    "Gouging Fire": "破空焰",
    "Iron Boulder": "鐵磐岩",
    "Iron Crown": "鐵頭殼",
    "Ogerpon": "厄鬼椪",
    "Dipplin": "裹蜜蟲",
    "Hydrapple": "蜜集大蛇",
    "Sinistcha": "來悲粗茶",
    "Poltchageist": "斯魔茶",
    "Fezandipiti": "吉稚雞",
    "Munkidori": "願增猿",
    "Okidogi": "夠讚狗",
    "Pecharunt": "桃歹郎",
    "Terapagos": "太樂巴戈斯",
    "-Wellspring": "-水井",
    "-Cornerstone": "-礎石",
    "-Hearthflame": "-火灶",
    "-Artisan": "-高檔貨",
    "-Masterpiece": "-傑作",
    "-Terastal": "-太晶形態",
    "-Stellar": "-星晶形態",
    "-Paldea-Aqua": "-帕底亞-水瀾種",
    "-Paldea-Blaze": "-帕底亞-火熾種",
    "-Paldea-Combat": "-帕底亞-帕底亞",


    "Charizard-Mega-X": "噴火龍-超級進化-X",
    "Charizard-Mega-Y": "噴火龍-超級進化-Y",
    "Venusaur-Mega": "妙蛙花-超級進化",
    "Blastoise-Mega": "水箭龜-超級進化",
    "Beedrill-Mega": "大針蜂-超級進化",
    "Pidgeot-Mega": "大比鳥-超級進化",
    "Alakazam-Mega": "胡地-超級進化",
    "Slowbro-Mega": "呆殼獸-超級進化",
    "Gengar-Mega": "耿鬼-超級進化",
    "Kangaskhan-Mega": "袋獸-超級進化",
    "Pinsir-Mega": "凱羅斯-超級進化",
    "Gyarados-Mega": "暴鯉龍-超級進化",
    "Aerodactyl-Mega": "化石翼龍-超級進化",
    "Lopunny-Mega": "長耳兔-超級進化",
    "Garchomp-Mega": "烈咬陸鯊-超級進化",
    "Lucario-Mega": "路卡利歐-超級進化",
    "Abomasnow-Mega": "暴雪王-超級進化",
    "Gallade-Mega": "艾路雷朵-超級進化",
    "Rayquaza-Mega": "烈空座-超級進化",
    "Salamence-Mega": "暴飛龍-超級進化",
    "Metagross-Mega": "巨金怪-超級進化",
    "Latias-Mega": "拉帝亞斯-超級進化",
    "Latios-Mega": "拉帝歐斯-超級進化",
    "Banette-Mega": "詛咒娃娃-超級進化",
    "Absol-Mega": "阿勃梭魯-超級進化",
    "Glalie-Mega": "冰鬼護-超級進化",
    "Gardevoir-Mega": "沙奈朵-超級進化",
    "Sableye-Mega": "勾魂眼-超級進化",
    "Mawile-Mega": "大嘴娃-超級進化",
    "Aggron-Mega": "波士可多拉-超級進化",
    "Medicham-Mega": "恰雷姆-超級進化",
    "Manectric-Mega": "雷電獸-超級進化",
    "Sharpedo-Mega": "巨牙鯊-超級進化",
    "Camerupt-Mega": "噴火駝-超級進化",
    "Altaria-Mega": "七夕青鳥-超級進化",
    "Houndoom-Mega": "黑魯加-超級進化",
    "Tyranitar-Mega": "班基拉斯-超級進化",
    "Sceptile-Mega": "蜥蜴王-超級進化",
    "Blaziken-Mega": "火焰雞-超級進化",
    "Swampert-Mega": "巨沼怪-超級進化",
    "Ampharos-Mega": "電龍-超級進化",
    "Steelix-Mega": "大鋼蛇-超級進化",
    "Scizor-Mega": "巨鉗螳螂-超級進化",
    "Heracross-Mega": "赫拉克羅斯-超級進化",
    "Mewtwo-Mega-X": "超夢-超級進化-X",
    "Mewtwo-Mega-Y": "超夢-超級進化-Y",
    "Audino-Mega": "差不多娃娃-超級進化",
    "Diancie-Mega": "蒂安希-超級進化",



    "Venusaur-Gmax": "妙蛙花-超極巨化",
    "Charizard-Gmax": "噴火龍-超極巨化",
    "Blastoise-Gmax": "水箭龜-超極巨化",
    "Butterfree-Gmax": "巴大蝶-超極巨化",
    "Cinderace-Gmax": "閃焰王牌-超極巨化",
    "Inteleon-Gmax": "千面避役-超極巨化",
    "Rillaboom-Gmax": "轟擂金剛猩-超極巨化",
    "Rattata-Alola": "小拉達-阿羅拉",
    "Raticate-Alola": "拉達-阿羅拉",
    "Raticate-Alola-Totem": "霸主拉達-阿羅拉",
    "Pikachu-Cosplay": "換裝皮卡丘",
    "Pikachu-Rock-Star": "硬搖滾皮卡丘",
    "Pikachu-Belle": "貴婦皮卡丘",
    "Pikachu-Pop-Star": "偶像皮卡丘",
    "Pikachu-PhD": "博士皮卡丘",
    "Pikachu-Libre": "面罩摔角手皮卡丘",
    "Pikachu-Original": "皮卡丘-初始帽子",
    "Pikachu-Hoenn": "皮卡丘-豐緣帽子",
    "Pikachu-Sinnoh": "皮卡丘-神奧帽子",
    "Pikachu-Unova": "皮卡丘-合眾帽子",
    "Pikachu-World": "皮卡丘-世界帽子",
    "Pikachu-Kalos": "皮卡丘-卡洛斯帽子",
    "Pikachu-Alola": "皮卡丘-阿羅拉帽子",
    "Pikachu-Partner": "皮卡丘-就決定是你了之帽子",
    "Pikachu-Starter": "搭檔皮卡丘",
    "Pikachu-Gmax": "皮卡丘-超極巨化",
    "Raichu-Alola": "雷丘-阿羅拉",
    "Sandshrew-Alola": "穿山鼠-阿羅拉",
    "Sandslash-Alola": "穿山王-阿羅拉",
    "Vulpix-Alola": "六尾-阿羅拉",
    "Ninetales-Alola": "九尾-阿羅拉",
    "Diglett-Alola": "地鼠-阿羅拉",
    "Dugtrio-Alola": "三地鼠-阿羅拉",
    "Meowth-Alola": "喵喵-阿羅拉",
    "Meowth-Galar": "喵喵-伽勒爾",
    "Meowth-Gmax": "喵喵-超極巨化",
    "Persian-Alola": "貓老大-阿羅拉",
    "Machamp-Gmax": "怪力-超極巨化",
    "Geodude-Alola": "小拳石-阿羅拉",
    "Graveler-Alola": "隆隆石-阿羅拉",
    "Golem-Alola": "隆隆岩-阿羅拉",
    "Ponyta-Galar": "小火馬-伽勒爾",
    "Rapidash-Galar": "烈焰馬-伽勒爾",
    "Farfetch’d-Galar": "大蔥鴨-伽勒爾",
    "Grimer-Alola": "臭泥-阿羅拉",
    "Muk-Alola": "臭臭泥-阿羅拉",
    "Gengar-Gmax": "耿鬼-超極巨化",
    "Kingler-Gmax": "巨鉗蟹-超極巨化",
    "Exeggutor-Alola": "椰蛋樹-阿羅拉",
    "Marowak-Alola": "嘎啦嘎啦-阿羅拉",
    "Marowak-Alola-Totem": "嘎啦嘎啦-阿羅拉-霸主",
    "Weezing-Galar": "雙彈瓦斯-伽勒爾",
    "Mr. Mime-Galar": "魔牆人偶-伽勒爾",
    "Lapras-Gmax": "拉普拉斯-超極巨化",
    "Eevee-Starter": "搭檔伊布",
    "Eevee-Gmax": "伊布-超極巨化",
    "Snorlax-Gmax": "卡比獸-超極巨化",
    "Urshifu-Gmax": "武道熊師-超極巨化",
    "Pichu-Spiky-eared": "刺刺耳皮丘",
    "Corsola-Galar": "太陽珊瑚-伽勒爾",
    "Zigzagoon-Galar": "蛇紋熊-伽勒爾",
    "Linoone-Galar": "直衝熊-伽勒爾",
    "Castform-Sunny": "飄浮泡泡-太陽",
    "Castform-Rainy": "飄浮泡泡-雨水",
    "Castform-Snowy": "飄浮泡泡-雪雲",
    "Kyogre-Primal": "蓋歐卡-原始回歸",
    "Groudon-Primal": "固拉多-原始回歸",
    "Wormadam-Sandy": "結草貴婦-沙土蓑衣",
    "Wormadam-Trash": "結草貴婦-垃圾蓑衣",
    "Cherrim-Sunshine": "櫻花兒-晴天形態",
    "Rotom-Heat": "加熱洛托姆",
    "Rotom-Wash": "清洗洛托姆",
    "Rotom-Frost": "結冰洛托姆",
    "Rotom-Fan": "旋轉洛托姆",
    "Rotom-Mow": "切割洛托姆",
    "Shaymin-Sky": "謝米-天空形態",
    "Arceus-Bug": "阿爾宙斯-蟲屬性",
    "Arceus-Dark": "阿爾宙斯-惡屬性",
    "Arceus-Dragon": "阿爾宙斯-龍屬性",
    "Arceus-Electric": "阿爾宙斯-電屬性",
    "Arceus-Fairy": "阿爾宙斯-妖精屬性",
    "Arceus-Fighting": "阿爾宙斯-格鬥屬性",
    "Arceus-Fire": "阿爾宙斯-火屬性",
    "Arceus-Flying": "阿爾宙斯-飛行屬性",
    "Arceus-Ghost": "阿爾宙斯-幽靈屬性",
    "Arceus-Grass": "阿爾宙斯-草屬性",
    "Arceus-Ground": "阿爾宙斯-地面屬性",
    "Arceus-Ice": "阿爾宙斯-冰屬性",
    "Arceus-Poison": "阿爾宙斯-毒屬性",
    "Arceus-Psychic": "阿爾宙斯-超能力屬性",
    "Arceus-Rock": "阿爾宙斯-岩石屬性",
    "Arceus-Steel": "阿爾宙斯-鋼屬性",
    "Arceus-Water": "阿爾宙斯-水屬性",
    "Arceus": "阿爾宙斯",
    "Darumaka-Galar": "火紅不倒翁-伽勒爾",
    "Darmanitan-Galar-Zen": "達摩狒狒-伽勒爾-達摩模式",
    "-Galar-Zen": "-伽勒爾-達摩模式",
    "Darmanitan-Zen": "達摩狒狒-達摩模式",
    "Darmanitan-Galar": "達摩狒狒-伽勒爾",
    "Yamask-Galar": "哭哭面具-伽勒爾",
    "Garbodor-Gmax": "灰塵山-超極巨化",
    "Stunfisk-Galar": "泥巴魚-伽勒爾",
    "Keldeo-Resolute": "凱路迪歐-覺悟",
    "Meloetta-Pirouette": "美洛耶塔-舞步形態",
    "Genesect-Douse": "蓋諾賽克特-水流卡帶",
    "Genesect-Shock": "蓋諾賽克特-閃電卡帶",
    "Genesect-Burn": "蓋諾賽克特-火焰卡帶",
    "Genesect-Chill": "蓋諾賽克特-冰凍卡帶",
    "Vivillon-Fancy": "彩粉蝶-花紋",
    "Vivillon-Pokeball": "菜粉蝶-球球花紋",
    "Floette-Eternal": "花葉蒂-永恒之花",
    "Meowstic-F": "超能妙喵-雌性的樣子",
    "Meowstic": "超能妙喵",
    "Oinkologne-F": "飄香豚-雌性的樣子",
    "Oinkologne": "飄香豚",
    "Basculegion-F": "幽尾玄魚-雌性的樣子",
    "Basculegion": "幽尾玄魚",
    "Indeedee-F": "愛管侍-雌性的樣子",
    "Indeedee": "愛管侍",
    "Zoroark-Hisui": "索羅亞克-洗翠",
    "Arcanine-Hisui": "風速狗-洗翠",
    "Electrode-Hisui": "頑皮雷彈-洗翠",
    "Avalugg-Hisui": "冰岩怪-洗翠",
    "Braviary-Hisui": "勇士雄鷹-洗翠",
    "Decidueye-Hisui": "狙射樹梟-洗翠",
    "Goodra-Hisui": "黏美龍-洗翠",
    "Growlithe-Hisui": "卡蒂狗-洗翠",
    "Lilligant-Hisui": "裙兒小姐-洗翠",
    "Qwilfish-Hisui": "千針魚-洗翠",
    "Samurott-Hisui": "大劍鬼-洗翠",
    "Sliggoo-Hisui": "黏美兒-洗翠",
    "Sneasel-Hisui": "狃拉-洗翠",
    "Typhlosion-Hisui": "火暴獸-洗翠",
    "Voltorb-Hisui": "霹靂電球-洗翠",
    "Zorua-Hisui": "索羅亞-洗翠",
    "Wooper-Paldea": "烏波-帕底亞",
    "Aegislash-Blade": "堅盾劍怪-刀劍形態",
    "Pumpkaboo-Small": "南瓜精-小尺寸",
    "Pumpkaboo-Large": "南瓜精-大尺寸",
    "Pumpkaboo-Super": "南瓜精-特大尺寸",
    "Gourgeist-Small": "南瓜怪人-小尺寸",
    "Gourgeist-Large": "南瓜怪人-大尺寸",
    "Gourgeist-Super": "南瓜怪人-特大尺寸",
    "Zygarde-Complete": "基格爾德-完全體形態",
    "Hoopa-Unbound": "解放胡帕",
    "Gumshoos-Totem": "貓鼬探長-霸主",
    "Vikavolt-Totem": "鍬農炮蟲-霸主",
    "Ribombee-Totem": "蝶結萌虻-霸主",
    "Wishiwashi-School": "弱丁魚-魚群",
    "Araquanid-Totem": "霸主滴蛛霸",
    "Lurantis-Totem": "霸主蘭螳花",
    "Salazzle-Totem": "霸主焰后蜥",
    "Silvally-Bug": "銀伴戰獸-蟲子",
    "Silvally-Dark": "銀伴戰獸-黑暗",
    "Silvally-Dragon": "銀伴戰獸-龍",
    "Silvally-Electric": "銀伴戰獸-電子",
    "Silvally-Fairy": "銀伴戰獸-妖精",
    "Silvally-Fighting": "銀伴戰獸-戰鬥",
    "Silvally-Fire": "銀伴戰獸-火焰",
    "Silvally-Flying": "銀伴戰獸-飛翔",
    "Silvally-Ghost": "銀伴戰獸-幽靈",
    "Silvally-Grass": "銀伴戰獸-青草",
    "Silvally-Ground": "銀伴戰獸-大地",
    "Silvally-Ice": "銀伴戰獸-冰雪",
    "Silvally-Poison": "銀伴戰獸-毒",
    "Silvally-Psychic": "銀伴戰獸-精神",
    "Silvally-Rock": "銀伴戰獸-岩石",
    "Silvally-Steel": "銀伴戰獸-鋼鐵",
    "Silvally-Water": "銀伴戰獸-清水",
    "Minior-Meteor": "小隕星-流星",
    "Togedemaru-Totem": "托戈德瑪爾-霸主",
    "Mimikyu-Busted": "謎擬Q-現形",
    "Mimikyu-Totem": "謎擬Q-霸主",
    "Mimikyu-Busted-Totem": "謎擬Q-霸主-現形",
    "Kommo-o-Totem": "杖尾鱗甲龍-霸主",
    "Necrozma-Dusk-Mane": "奈克洛茲瑪-黃昏之鬃",
    "Necrozma-Dawn-Wings": "奈克洛茲瑪-拂曉之翼",
    "Necrozma-Ultra": "究極奈克洛茲瑪",
    "Magearna-Original": "瑪機雅娜-500年前的顏色",
    "Melmetal-Gmax": "美錄梅塔-超極巨化",
    "Corviknight-Gmax": "鋼鎧鴉-超極巨化",
    "Orbeetle-Gmax": "以歐路普-超極巨化",
    "Drednaw-Gmax": "暴噬龜-超極巨化",
    "Coalossal-Gmax": "巨炭山-超極巨化",
    "Flapple-Gmax": "蘋裹龍-超極巨化",
    "Appletun-Gmax": "豐蜜龍-超極巨化",
    "Sandaconda-Gmax": "沙螺蟒-超極巨化",
    "Cramorant-Gulping": "古月鳥-一口吞",
    "Cramorant-Gorging": "古月鳥-大口吞",
    "Toxtricity-Gmax": "顫弦蠑螈-超極巨化",
    "Toxtricity-Low-Key-Gmax": "顫弦蠑螈-低調形態-超極巨化",
    "Centiskorch-Gmax": "焚焰蚣-超極巨化",
    "Hatterene-Gmax": "布莉姆溫-超極巨化",
    "Grimmsnarl-Gmax": "長毛巨魔-超極巨化",
    "Alcremie-Gmax": "霜奶仙-超極巨化",
    "Eiscue-Noice": "冰砌鵝-解凍形態",
    "Morpeko-Hangry": "莫魯貝可-空腹花紋",
    "Copperajah-Gmax": "大王銅象-超極巨化",
    "Duraludon-Gmax": "鋁鋼龍-超極巨化",


    "-Mega": "-超級進化",
    "-Mega-X": "-超級進化-X",
    "-Mega-Y": "-超級進化-Y",
    "-Gmax": "-超極巨化",
    "-Eternamax": "-無極巨化",
    "-Alola": "-阿羅拉",
    "-Alola-Totem": "-阿羅拉-霸主",
    "-Cosplay": "-換裝",
    "-Rock-Star": "-硬搖滾",
    "-Belle": "-貴婦",
    "-Pop-Star": "-偶像",
    "-PhD": "-博士",
    "-Libre": "-面罩摔角手",
    "-Original": "-初始",
    "-Hoenn": "-豐緣",
    "-Sinnoh": "-神奧",
    "-Unova": "-合眾",
    "-World": "-世界",
    "-Kalos": "-卡洛斯",
    "-Galar": "-伽勒爾",
    "-Paldea": "-帕底亞",
    "-Hisui": "-洗翠",
    "-Partner": "-就決定是你了",
    "-Starter": "-搭檔",
    "-Spiky-eared": "-刺刺耳",
    "-Sunny": "-太陽",
    "-Rainy": "-雨水",
    "-Snowy": "-雪雲",
    "-Primal": "-原始回歸",
    "-Attack": "-攻擊形態",
    "-Defense": "-防禦形態",
    "-Speed": "-速度形態",
    "-Sandy": "-沙土蓑衣",
    "-Trash": "-垃圾蓑衣",
    "-Sunshine": "-晴天形態",
    "East": "-東海",
    "-Heat": "-加熱",
    "-Wash": "-清洗",
    "-Frost": "-結冰",
    "-Fan": "-旋轉",
    "-Mow": "-切割",
    "-Sky": "-天空形態",
    "-Bug": "-蟲",
    "-Dark": "-惡",
    "-Dragon": "-龍",
    "-Electric": "-電",
    "-Fairy": "-妖精",
    "-Fighting": "-格鬥",
    "-Fire": "-火",
    "-Flying": "-飛行",
    "-Ghost": "-幽靈",
    "-Grass": "-草",
    "-Ground": "-地面",
    "-Ice": "-冰",
    "-Shadow":"-幽靈",
    "-Poison": "-毒",
    "-Psychic": "-超能力",
    "-Rock": "-岩石",
    "-Steel": "-鋼",
    "-Water": "-水",
    "-Autumn": "-秋天的樣子",
    "-Summer": "-夏天的樣子",
    "-Winter": "-冬天的樣子",
    "-Zen": "-達摩模式",
    "-Zen-Galar": "-伽勒爾-達摩模式",
    "-Resolute": "-覺悟",
    "-Pirouette": "-舞步形態",
    "-Douse": "-水流卡帶",
    "-Shock": "-閃電卡帶",
    "-Burn": "-火焰卡帶",
    "-Chill": "-冰凍卡帶",
    "-Fancy": "-花紋",
    "-Pokeball": "-球球花紋",
    "-Eternal": "-永恒之花",
    "-Blade": "-刀劍形態",
    "-Small": "-小",
    "-Large": "-大",
    "-Super": "-特大",
    "-10%": "-10%形態",
    "-Complete": "-完全體形態",
    "-Unbound": "-解放形態",
    "-Totem": "-霸主",
    "-Pom-Pom": "-啪滋啪滋風格",
    "-Pa'u": "-呼啦呼啦風格",
    "-Sensu": "-輕盈輕盈風格",
    "-School": "-魚群",
    "-Meteor": "-流星",
    "-Busted-Totem": "-霸主-現形",
    "-Busted": "-現形",
    "-Dusk-Mane": "-黃昏之鬃",
    "-Dawn-Wings": "-拂曉之翼",
    "-Ultra": "-究極形態",
    "-Gulping": "-一口吞",
    "-Gorging": "-大口吞",
    "-Noice": "-解凍形態",
    "-Hangry": "-空腹花紋",
	  "-F": "-雌性的樣子",
	  "-M": "-雄性的樣子",
	  "-Dusk": "-黃昏",
	  "-Midnight": "-黑夜",
	  "-Four": "-四只家庭",
	  "-Hero": "-全能形態",
	  "-Therian": "-靈獸形態",
	  "-Origin": "-起源形態",
	  "-Crowned": "-王形態",
      "-Antique": "-真貨",
      "-Dada": "-阿爸",
      "-Low-Key": "-低調形態",

      "-Rapid-Strike-Gmax": "-連擊流-超級進化",
      "-Low-Key-Gmax": "-低調形態-超極巨化",
      "-Droopy": "-下垂姿勢",
      "-Stretchy": "-平挺姿勢",
	  "-Blue": "-氰藍",
	  "-White": "-焰白",
	  "-Black": "-暗黑",
	  "-Yellow": "-鵝黃",
      "-Orange": "-橙花",
	  "-Three-Segment": "-三節形態",
	  "-White-Striped": "-白條紋的樣子",
	  "-Blue-Striped": "-藍條紋的樣子",
	  "-Rapid-Strike": "-連擊流",
      "-Paldea-Aqua": "-帕底亞-水瀾種",
	  "-Paldea-Blaze": "-帕底亞-火熾種",
      "-Paldea-Combat": "-帕底亞-鬥戰種",
      "-Roaming": "-徒步形態",
      "-Bloodmoon": "-赫月",
      "-Cornerstone": "-礎石",
      "-Wellspring": "-水井",
      "-Hearthflame": "-火灶",
      "-Artisan": "-高檔貨",
      "-Masterpiece": "-傑作",
      "-Antique": "-真貨",
      "-Ruby-Cream": "-奶香紅鑽",
      "-Matcha-Cream": "-奶香抹茶",
      "-Mint-Cream": "-奶香薄荷",
      "-Lemon-Cream": "-奶香檸檬",
      "-Salted-Cream": "-奶香雪鹽",
      "-Ruby-Swirl": "-紅鑽綜合",
      "-Caramel-Swirl": "-焦糖綜合",
      "-Rainbow-Swirl": "-三色綜合",
    "-Heart": "-心形造型",
    "-Dandy": "-紳士造型",
    "-Debutante": "-淑女造型",
    "-Diamond": "-菱形造型",
    "-Matron": "-貴婦造型",
    "-Pharaoh": "-國王造型",
    "-Star": "-星形造型",
    "-La Reine": "-女王造型",
    "-Kabuki": "-歌舞伎造型",
    "-Archipelago": "-群島花紋",
    "-Continental": "-大陸花紋",
    "-Elegant": "-高雅花紋",
    "-Garden": "-庭園花紋",
    "-High Plains": "-荒野花紋",
    "-Icy Snow": "-冰雪花紋",
    "-Jungle": "-熱帶雨林花紋",
    "-Marine": "-大海花紋",
    "-Modern": "-摩登花紋",
    "-Monsoon": "-驟雨花紋",
    "-Ocean": "-大洋花紋",
    "-Polar": "-雪國花紋",
    "-River": "-大河花紋",
    "-Sandstorm": "-沙塵花紋",
    "-Savanna": "-熱帶草原花紋",
    "-Sun": "-太陽花紋",
    "-Tundra": "-雪原花紋",

    "Squawkabilly-Blue": "怒鸚哥-藍羽毛",
    "Squawkabilly-White": "怒鸚哥-白羽毛",
    "Squawkabilly-Yellow": "怒鸚哥-黃羽毛",
    "Squawkabilly": "怒鸚哥",
    "Gimmighoul-Roaming": "索財靈-徒步形態",
    "Ursaluna-Bloodmoon": "月月熊-赫月",
    "Ogerpon-Cornerstone": "厄鬼椪-礎石",
    "Ogerpon-Wellspring": "厄鬼椪-水井",
    "Ogerpon-Hearthflame": "厄鬼椪-火灶",
    "Terapagos-Stellar": "太樂巴戈斯-星晶形態",
    "Terapagos-Terastal": "太樂巴戈斯-太晶形態",
    "Poltchageist-Artisan": "斯魔茶-高檔貨",
    "Sinistcha-Masterpiece": "來悲粗茶-傑作",
    "Polteageist-Antique": "怖思壺-真貨",
    "Sinistea-Antique": "來悲茶-真貨",
    "Tauros-Paldea-Blaze": "肯泰羅-帕底亞-火熾種",
    "Tauros-Paldea-Aqua": "肯泰羅-帕底亞-水瀾種",
    "Tauros-Paldea-Combat": "肯泰羅-帕底亞-鬥戰種",
    "Groudon-Primal": "固拉多-原始回歸",
    "Kyogre-Primal": "蓋歐卡-原始回歸",
    "Zamazenta-Crowned": "藏瑪然特-盾之王",
    "Zacian-Crowned": "蒼響-劍之王",
    "Palkia-Origin": "帕路奇亞-起源",
    "Giratina-Origin": "騎拉帝納-起源",
    "Dialga-Origin": "帝牙盧卡-起源",
    "Silvally-*": "銀伴戰獸-未知屬性",
    "Arceus-*": "阿爾宙斯-未知屬性",
    "Genesect-*": "蓋諾賽克特-未知卡帶",
    "Xerneas-*": "哲爾尼亞斯-未知模式",
    "Urshifu-*": "武道熊師-未知流派",
    "Greninja-*": "甲賀忍蛙-未知形態",
    "Zacian-*": "蒼響-未知形態",
    "Zamazenta-*": "藏瑪然特-未知形態",
    "Dudunsparce-*": "土龍節節-未知形態",
    "Gourgeist-Large": "南瓜怪人-大",
    "Gourgeist-Small": "南瓜怪人-小",
    "Gourgeist-Super": "南瓜怪人-特大",
    "Gourgeist-*": "南瓜怪人-未知大小",
    "Pumpkaboo-Large": "南瓜精-大",
    "Pumpkaboo-Small": "南瓜精-小",
    "Pumpkaboo-Super": "南瓜精-特大",
    "Pumpkaboo-*": "南瓜精-未知大小",
    "Urshifu-Rapid-Strike-Gmax": "武道熊師-連擊流-超極巨化",
    "Ogerpon-Wellspring-Tera": "厄鬼椪-水井-太晶化",
    "Ogerpon-Cornerstone-Tera": "厄鬼椪-礎石-太晶化",
    "Ogerpon-Hearthflame-Tera": "厄鬼椪-火灶-太晶化",
    "Ogerpon-Teal-Tera": "厄鬼椪-碧草-太晶化",
    "Ogerpon-Tera": "厄鬼椪-太晶化",
    "-Wellspring-Tera": "-水井-太晶化",
    "-Cornerstone-Tera": "-礎石-太晶化",
    "-Hearthflame-Tera": "-火灶-太晶化",
    "-Teal-Tera": "-碧草-太晶化",





    //  前代道具效果



    "If holder's HP is full, survives all hits of one attack with at least 1 HP. Single use.": "攜帶後，在HP全滿時，即便受到可能會導致瀕死的招式，也能僅以1HP撐過去1次。使用後消失",
    "Holder's use of Light Screen or Reflect lasts 8 turns instead of 5.": "光牆和反射壁的有效時間延長至8回合",
    "Damage of moves used on consecutive turns is increased. Max 2x after 10 turns.": "連續使用相同招式時，每重覆使用一次威力提升10%，最高200%",
    "If held by a Pikachu, its Special Attack is doubled.": "皮卡丘攜帶後，特攻翻倍",
    "If held by a Pikachu, its attacks have their power doubled.": "皮卡丘攜帶後，使出的招式威力加倍",
    "If held by a Latias or a Latios, its Sp. Atk and Sp. Def are 1.5x.": "拉帝亞斯/拉帝歐斯攜帶後特攻和特防提升50%",
    "Holder's Speed is halved and it becomes grounded.": "攜帶該道具的神奇寶貝的速度降低50%，並變為地面上的寶可夢",
    "Can only be held by Giratina. Its Ghost- & Dragon-type attacks have 1.2x power.": "只能由騎拉帝納攜帶。龍屬性和幽靈屬性招式的威力提升20%",
    "Holder gains 1.3x HP from draining moves, Aqua Ring, Ingrain, and Leech Seed.": "攜帶者使用的吸取類招式、水流環、紮根和寄生種子恢覆量提升30%",
    "Holder is cured if it is infatuated. Single use.": "陷入著迷狀態後，解除著迷狀態。使用後消失",
    "Holder's Water-type attacks have 1.05x power.": "水屬性招式威力提升5%",
    "The accuracy of attacks against the holder is 0.95x.": "攜帶該道具時，招式對自身的命中率×0.95",
    "Restores 30 HP when at 1/2 max HP or less. Single use.": "HP低於50%最大HP時，恢覆30HP。使用後消失",
    "(Gen 2) On switch-in, raises holder's Attack by 2 and confuses it. Single use.": "(Gen 2) 出場後，攜帶者陷入混亂狀態並提升2級攻擊",
    "An attack against the holder has its accuracy out of 255 lowered by 20.": "對手的命中率降低為235/255",
    "(Gen 2) Restores 30 HP when at 1/2 max HP or less. Single use.": "(Gen 2) HP低於50%最大HP時，恢覆30HP。使用後消失",
    "Holder's Dragon-type attacks have 1.1x power. Evolves Seadra (trade).": "龍屬性招式威力提升10%。可用於通信交換進化海刺龍",
    "(Gen 2) Holder wakes up if it is asleep. Single use.": "(Gen 2) 陷入睡眠狀態時解除睡眠狀態。使用後消失",
    "(Gen 2) Holder cures itself if it is confused or has a status condition. Single use.": "(Gen 2) 陷入混亂或異常狀態時發動，解除該狀態。使用後消失",
    "(Gen 2) Restores 5 PP to the first of the holder's moves to reach 0 PP. Single use.": "(Gen 2) 招式的PP降到0時恢覆該招式5點PP。使用後消失",
    "(Gen 2) Holder's Normal-type attacks have 1.1x power.": "(Gen 2) 一般屬性招式威力提升10%",
    "Each turn, holder has a ~23.4% chance to move first in its priority bracket.": "約23.4%概率優先使用招式",
    "(Gen 2) Restores 10 HP when at 1/2 max HP or less. Single use.": "(Gen 2) HP低於50%最大HP時，恢覆10HP。使用後消失",
    "If held by a Chansey, its critical hit ratio is always at stage 2. (25% crit rate)": "吉利蛋攜帶後擊中要害等級提升2級(25%概率擊中要害)",
    "If held by a Ditto, its Defense and Sp. Def are 1.5x, even while Transformed.": "百變怪攜帶後防禦和特防提升50%，變身後仍然有效",
    "If held by a Farfetch’d, its critical hit ratio is always at stage 2. (25% crit rate)": "大蔥鴨攜帶後擊中要害等級提升2級(25%概率擊中要害)",
    "(Gen 2) Holder is cured if it is confused. Single use.": "(Gen 2) 陷入混亂狀態時發動，解除混亂狀態。使用後消失",
    "(Gen 2) Holder is cured if it is frozen. Single use.": "(Gen 2) 陷入冰凍狀態時發動，解除冰凍狀態。使用後消失",
    "Holder has a ~11.7% chance to survive an attack that would KO it with 1 HP.": "受到攻擊而將陷入瀕死狀態時，約11.7%幾率保留1點HP而不陷入瀕死狀態",
    "(Gen 2) Holder is cured if it is burned. Single use.": "(Gen 2) 陷入灼傷狀態時發動，解除灼傷狀態。使用後消失",
    "(Gen 2) Holder cures itself if it is paralyzed. Single use.": "(Gen 2) 陷入麻痹狀態時發動，解除麻痹狀態。使用後消失",
    "(Gen 2) Holder is cured if it is poisoned. Single use.": "(Gen 2) 陷入中毒狀態時發動，解除中毒狀態。使用後消失",




    //  道具效果


    "Holder cures itself if it has a non-volatile status or is confused. Single use.": "陷入異常狀態或混亂狀態時發動，解除該狀態。使用後消失",
    "Holder's Techno Blast is Fire type.": "攜帶該道具的寶可夢的高科技光炮變為火屬性",
    "Holder's Techno Blast is Ice type.": "攜帶該道具的寶可夢的高科技光炮變為冰屬性",
    "Holder's Techno Blast is Water type.": "攜帶該道具的寶可夢的高科技光炮變為水屬性",
    "Holder's Techno Blast is Electric type.": "攜帶該道具的寶可夢的高科技光炮變為電屬性",
    "Holder's Ability cannot be changed by another Pokemon.": "特性不會被其他寶可夢改變",
    "Activates the Protosynthesis or Quark Drive abilities. Single use.": "特性為夸克充能和古代活性的寶可夢攜帶後能力提升。使用後消失",
    "Holder is not affected by the secondary effect of another Pokemon's attack.": "不受其他寶可夢的招式追加效果影響",
    "Holder's 5 hit multi-hit attacks will always hit at least 4 times.": "連續招式保底提升",
    "When an opposing Pokemon recieves stat boosts, those boosts are copied. Single use.": "複製對手的一次能力變化。使用後消失",
    "Holder's punch-based attacks do 1.1x damage and avoid adverse contact effects.": "拳擊類招式威力提升10%，且變為非接觸類招式",
    "If held by a Farfetch'd or Sirfetch'd, its critical hit ratio is raised by 2 stages.": "大蔥鴨或者蔥遊兵攜帶後擊中要害的等級提高2級",
    "Raises holder's Sp. Atk by 1 stage if hit by a Water-type attack. Single use.": "受到水屬性招式攻擊時特攻提升1級。使用後消失",
    "If held by a Dialga, its Steel- and Dragon-type attacks have 1.2x power.": "帝牙盧卡攜帶後鋼屬性和龍屬性招式威力提升20%",
    "Raises holder's Speed by 1 stage if it gets affected by Intimidate. Single use.": "受到威嚇時速度提升1級。使用後消失",
    "Holder is immune to Ground-type attacks. Pops when holder is hit.": "攜帶後會浮在空中。受到攻擊就會破裂",
    "If held by an Alolan Raichu with Thunderbolt, it can use Stoked Sparksurfer.": "雷丘-阿羅拉攜帶後可以將十萬伏特轉化成Z招式：駕雷馭電戲沖浪",
    "Raises holder's Sp. Def by 1 stage when at 1/4 max HP or less. Single use.": "HP低於25%時特防提升1級。使用後消失",
    "Holder is cured if it is frozen. Single use.": "解除冰凍狀態。使用後消失",
    "Holder's Sp. Def is 1.5x, but it can only select damaging moves.": "會變得富有攻擊性的背心。雖然攜帶後特防會提高50%，但會無法使出變化招式",
    "A special Poke Ball designed to catch Ultra Beasts.": "為捕獲究極異獸而制作的特殊精靈球",
    "Cannot be eaten by the holder. No effect when eaten with Bug Bite or Pluck.": "用於制作寶可方塊或寶芬，被蟲咬或啄食時沒有效果",
    "Restores 20 HP when at 1/2 max HP or less. Single use.": "HP低於一半時回復20HP。使用後消失",
    "Holder gains 1.3x HP from draining/Aqua Ring/Ingrain/Leech Seed/Strength Sap.": "使用吸取HP的招式、寄生種子、水流環、紮根和吸取力量時HP回復量提升30%",
    "Holder's partial-trapping moves deal 1/6 max HP per turn instead of 1/8.": "綁緊招式所造成的束縛傷害從1/8提升至1/6",
    "Each turn, if holder is a Poison type, restores 1/16 max HP; loses 1/8 if not.": "毒屬性寶可夢每回合結束時回復1/16最大HP，非毒屬性寶可夢每回合結束時失去1/8最大HP",
    "If held by a Kyogre, this item triggers its Primal Reversion in battle.": "蓋歐卡攜帶後，在對戰中可以原始回歸成為原始蓋歐卡",
    "The accuracy of attacks against the holder is 0.9x.": "對手的命中率降低10%",
    "Raises holder's Attack by 1 if hit by an Electric-type attack. Single use.": "受到電屬性招式攻擊時提升1級攻擊。使用後消失",
    "Holder cures itself if it is paralyzed. Single use.": "解除麻痹狀態。使用後消失",
    "A rare Poke Ball that has been crafted to commemorate an occasion.": "相當珍貴的球，特制出來的紀念品",
    "Holder wakes up if it is asleep. Single use.": "解除睡眠狀態。使用後消失",
    "Halves damage taken from a Normal-type attack. Single use.": "受到一般屬性招式時傷害減半。使用後消失",
    "Holder's Attack is 1.5x, but it can only select the first move it executes.": "雖然攜帶後攻擊會提高50%，但只能使出相同的招式",
    "Holder's Speed is 1.5x, but it can only select the first move it executes.": "雖然攜帶後速度會提高50%，但只能使出相同的招式",
    "Holder's Sp. Atk is 1.5x, but it can only select the first move it executes.": "雖然攜帶後特攻會提高50%，但只能使出相同的招式",
    "Holder moves first in its priority bracket when at 1/4 max HP or less. Single use.": "HP低於25%時能優先攻擊一次。使用後消失",
    "Holder's use of Rain Dance lasts 8 turns instead of 5.": "引起的下雨天氣從5回合延長至8回合",
    "If held by a Decidueye with Spirit Shackle, it can use Sinister Arrow Raid.": "狙射樹梟攜帶後可以將縫影轉化成Z招式：遮天蔽日暗影箭",
    "If held by a Clamperl, its Sp. Def is doubled.": "珍珠貝攜帶特防翻倍",
    "If held by a Clamperl, its Sp. Atk is doubled.": "珍珠貝攜帶特攻翻倍",
    "If holder becomes infatuated, the other Pokemon also becomes infatuated.": "攜帶者陷入著迷時令對手著迷",
    "A Poke Ball that works especially well on Pokemon that live underwater.": "能很容易地捕捉生活在水世界里的寶可夢",
    "A special Poke Ball that appears out of nowhere in a bag at the Entree Forest.": "在連入之森中，不知何時出現在包包里的夢中球",
    "A Poke Ball that makes it easier to catch wild Pokemon at night or in caves.": "能很容易地在夜晚或洞窟等陰暗的地方捕捉寶可夢",
    "If held by an Eevee with Last Resort, it can use Extreme Evoboost.": "伊布攜帶後可以將珍藏轉化成Z招式：九彩升華齊聚頂",
    "If holder survives a hit, it immediately switches out to a chosen ally. Single use.": "受到傷害後可立即下場與同伴進行交替。使用後消失",
    "If the terrain is Electric Terrain, raises holder's Defense by 1 stage. Single use.": "當場地為電氣場地時防禦提升1級。使用後消失",
    "Restores 50 HP to one Pokemon but lowers Happiness.": "非常苦的藥粉，回復60HP",
    "Restores 1/4 max HP after holder is hit by a supereffective move. Single use.": "受到效果絕佳的攻擊時回復1/4最大HP。使用後消失",
    "If holder's species can evolve, its Defense and Sp. Def are 1.5x.": "攜帶後，還能進化的寶可夢的防禦和特防就會提高50%",
    "Holder's attacks that are super effective against the target do 1.2x damage.": "招式出現效果絕佳時威力提升20%",
    "A Poke Ball that makes it easier to catch Pokemon which are quick to run away.": "能很容易地捕捉逃跑速度很快的寶可夢",
    "At the end of every turn, this item attempts to burn the holder.": "回合結束時進入灼傷狀態",
    "Holder's weight is halved.": "攜帶者體重減半",
    "Holder has a 10% chance to survive an attack that would KO it with 1 HP.": "攜帶後，即便受到可能會導致瀕死的招式，有時也能僅以1HP撐過去。",
    "If holder's HP is full, will survive an attack that would KO it with 1 HP. Single use.": "HP全滿時受到攻擊而將陷入瀕死狀態時保留1點HP而不陷入瀕死狀態。使用後消失",
    "A Poke Ball that makes caught Pokemon more friendly.": "捉到的野生寶可夢會變得容易和訓練家親密",
    "Holder moves last in its priority bracket.": "攜帶者所用招式在相同優先度內必定後出",
    "Raises holder's Defense by 1 stage when at 1/4 max HP or less. Single use.": "HP低於25%時提升1級防禦。使用後消失",
    "If the terrain is Grassy Terrain, raises holder's Defense by 1 stage. Single use.": "當場地為青草場地時防禦提升1級。使用後消失",
    "A high-performance Ball that provides a higher catch rate than a Poke Ball.": "比起精靈球來更容易捉到寶可夢的，性能還算不錯的球",
    "Holder's partial-trapping moves always last 7 turns.": "綁緊招式所造成的束縛狀態持續時間固定為7回合",
    "If held by a Giratina, its Ghost- and Dragon-type attacks have 1.2x power.": "騎拉帝納攜帶後形態轉換為起源形態，並且龍屬性和幽靈屬性的招式威力提升20%",
    "A remedial Poke Ball that restores the caught Pokemon's HP and status problem.": "能回復捉到的寶可夢的HP並治癒異常狀態",
    "Holder's use of Sunny Day lasts 8 turns instead of 5.": "引起的大晴天天氣從5回合延長至8回合",
    "A Poke Ball for catching very heavy Pokemon.": "能很容易地捕捉身體沈重的寶可夢",
    "Holder's use of Hail lasts 8 turns instead of 5.": "引起的冰雹天氣從5回合延長至8回合",
    "If held by an Incineroar with Darkest Lariat, it can use Malicious Moonsault.": "熾焰咆哮虎攜帶後可以將DD金鉤臂轉化成Z招式：極惡飛躍粉碎擊",
    "Holder is grounded, Speed halved. If Flying type, takes neutral Ground damage.": "速度降低50%，飛行屬性和飄浮特性寶可夢可以受到地面屬性招式的傷害",
    "If holder is hit by a physical move, attacker loses 1/8 of its max HP. Single use.": "受到物理招式攻擊時對手損傷1/8的HP。使用後消失",
    "Raises holder's Defense by 1 stage after it is hit by a physical attack. Single use.": "受到物理招式攻擊時，防禦提升1級。使用後消失",
    "Holder's attacks without a chance to flinch gain a 10% chance to flinch.": "使用不會陷入畏縮狀態的攻擊招式時有10%的幾率使目標進入畏縮狀態",
    "Holder gains the Focus Energy effect when at 1/4 max HP or less. Single use.": "HP低於25%時進入易中要害狀態。使用後消失",
    "At the end of every turn, holder restores 1/16 of its max HP.": "回合結束時回復1/16最大HP",
    "Restores 10 PP to the first of the holder's moves to reach 0 PP. Single use.": "招式的PP降到0時恢覆該招式10點PP。使用後消失",
    "A Poke Ball for catching Pokemon that are a lower level than your own.": "要捕捉的寶可夢比自己寶可夢的等級越低，就會越容易捕捉",
    "Raises holder's Attack by 1 stage when at 1/4 max HP or less. Single use.": "HP低於25%時攻擊提升1級。使用後消失",
    "Holder's attacks do 1.3x damage, and it loses 1/10 its max HP after the attack.": "攜帶後攻擊招式傷害提升30%，攻擊招式命中後損失1/10最大HP",
    "If held by a Pikachu, its Attack and Sp. Atk are doubled.": "皮卡丘攜帶後攻擊和特攻翻倍",
    "Holder's use of Aurora Veil, Light Screen, or Reflect lasts 8 turns instead of 5.": "光牆、反射壁和極光幕的有效時間延長至8回合",
    "Poke Ball for catching Pokemon that are the opposite gender of your Pokemon.": "很容易捕捉和自己寶可夢性別不同的寶可夢",
    "If held by a Chansey, its critical hit ratio is raised by 2 stages.": "吉利蛋攜帶後擊中要害等級提升2級",
    "Holder cures itself if it is confused or has a major status condition. Single use.": "解除異常狀態和混亂狀態。使用後消失",
    "Raises holder's Sp. Def by 1 stage if hit by a Water-type attack. Single use.": "受到水屬性招式攻擊時特防提升1級。使用後消失",
    "A Poke Ball for catching Pokemon hooked by a Rod when fishing.": "能很容易地捕捉用釣竿釣上來的寶可夢",
    "If held by a Palkia, its Water- and Dragon-type attacks have 1.2x power.": "帕路奇亞攜帶後龍屬性和水屬性的招式威力提升20%",
    "A comfortable Poke Ball that makes a caught wild Pokemon quickly grow friendly.": "捉到的野生寶可夢會立刻變得和訓練家親密起來",
    "Holder's Speed is halved. The Klutz Ability does not ignore this effect.": "速度減半。笨拙特性不能無視減半效果",
    "Cannot be given to or taken from a Pokemon, except by Covet/Knock Off/Thief.": "對戰中不可以給予或從寶可夢身上取下該道具",
    "Raises holder's Sp. Def by 1 stage after it is hit by a special attack. Single use.": "受到特殊攻擊時特防提升1級。使用後消失",
    "If held by Marshadow with Spectral Thief, it can use Soul-Stealing 7-Star Strike.": "瑪夏多攜帶後可以將暗影偷盜轉化成Z招式：七星奪魂腿",
    "The best Ball with the ultimate performance. It will catch any wild Pokemon.": "必定能捉到野生寶可夢的，性能最好的球",
    "Cures holder of Attract, Disable, Encore, Heal Block, Taunt, Torment. Single use.": "解除著迷、再來一次、挑釁、無理取鬧、定身法和回復封鎖狀態。使用後消失",
    "If held by a Ditto that hasn't Transformed, its Defense is doubled.": "未變身前的百變怪攜帶後防禦翻倍",
    "Damage of moves used on consecutive turns is increased. Max 2x after 5 turns.": "連續使用相同招式時，每重覆使用一次威力提升20%，最高200%",
    "If held by a Mew with Psychic, it can use Genesis Supernova.": "夢幻攜帶後可以將精神強念轉化成Z招式：起源超新星大爆炸",
    "Holder's next move has 1.2x accuracy when at 1/4 max HP or less. Single use.": "HP低於25%時命中率增加20%。使用後消失",
    "If the terrain is Misty Terrain, raises holder's Sp. Def by 1 stage. Single use.": "當場地為薄霧場地時特防提升1級。使用後消失",
    "A Poke Ball for catching Pokemon that evolve using the Moon Stone.": "能很容易地捕捉使用月之石進化的寶可夢",
    "Holder's physical attacks have 1.1x power.": "物理招式威力提升10%",
    "A Poke Ball that works especially well on weaker Pokemon in the wild.": "捕捉的野生寶可夢越弱，就會越容易捕捉",
    "A Poke Ball that works especially well on Water- and Bug-type Pokemon.": "能很容易地捕捉水屬性和蟲屬性的寶可夢",
    "Restores 10 HP when at 1/2 max HP or less. Single use.": "HP低於50%時回復10HP。使用後消失",
    "A special Poke Ball for the Pal Park.": "在夥伴公園里使用的特殊的球",
    "Holder is cured if it is poisoned. Single use.": "解除中毒狀態。使用後消失",
    "Holder is cured if it is confused. Single use.": "解除混亂狀態。使用後消失",
    "Raises holder's Sp. Atk by 1 stage when at 1/4 max HP or less. Single use.": "HP低於25%時特攻提升1級。使用後消失",
    "If held by a Pikachu with Volt Tackle, it can use Catastropika.": "皮卡丘攜帶後可以將伏特攻擊轉化成Z招式：皮卡皮卡必殺擊",
    "If held by cap Pikachu with Thunderbolt, it can use 10,000,000 Volt Thunderbolt.": "戴著帽子的皮卡丘攜帶後可以將十萬伏特轉化成Z招式：千萬伏特",
    "A device for catching wild Pokemon. It is designed as a capsule system.": "膠囊樣式的用於投向野生寶可夢並將其捕捉的球",
    "Holder's two-turn moves complete in one turn (except Sky Drop). Single use.": "有1次機會可以在第1回合使出需要蓄力的招式(自由落體除外)。使用後消失",
    "A rare Poke Ball that has been crafted to commemorate an event.": "為了紀念某些事件的稀有的精靈球",
    "If held by a Primarina with Sparkling Aria, it can use Oceanic Operetta.": "西施海壬攜帶後可以將泡影的詠嘆調轉化成Z招式：海神莊嚴交響樂",
    "Holder's moves are protected from adverse contact effects, except Pickpocket.": "使用接觸類招式攻擊時，不會受到本應受到的效果，對順手牽羊特性無效",
    "If the terrain is Psychic Terrain, raises holder's Sp. Def by 1 stage. Single use.": "當場地為精神場地時特防提升1級。使用後消失",
    "A Poke Ball that provides a better catch rate at the start of a wild encounter.": "在戰鬥開始時使用捕獲成功率更高的特殊的精靈球",
    "Each turn, holder has a 20% chance to move first in its priority bracket.": "20%概率優先使用招式",
    "If held by a Ditto that hasn't Transformed, its Speed is doubled.": "未變身前的百變怪攜帶後速度翻倍",
    "No competitive use other than when used with Fling.": "在寶可夢考古學上非常貴重的骨頭，可以在商店高價出售",
    "Holder is cured if it is burned. Single use.": "解除灼傷狀態。使用後消失",
    "Holder's critical hit ratio is raised by 1 stage.": "擊中要害等級提升1級",
    "If holder survives a hit, attacker is forced to switch to a random ally. Single use.": "受到傷害後攻擊方隨機交換任意寶可夢。使用後消失",
    "If held by a Groudon, this item triggers its Primal Reversion in battle.": "固拉多攜帶後，在對戰中可以原始回歸成為原始固拉多",
    "A Poke Ball that works well on Pokemon species that were previously caught.": "對於以前捕獲過的寶可夢效果特別好的特殊的球",
    "The holder's type immunities granted solely by its typing are negated.": "受到攻擊時，不會出現因屬性相性引發的沒有效果",
    "If holder is hit by a contact move, the attacker loses 1/6 of its max HP.": "受到接觸類招式時對手失去1/6最大HP",
    "If holder is hit by a special move, attacker loses 1/8 of its max HP. Single use.": "受到特殊招式攻擊時對手損傷1/8的HP。使用後消失",
    "A special Poke Ball that is used only in the Safari Zone and Great Marsh.": "僅能在狩獵地帶和大濕地中使用的特殊的球,上面有迷彩花紋",
    "Holder is immune to powder moves and damage from Sandstorm or Hail.": "免疫沙暴和冰雹天氣造成的傷害",
    "Raises holder's Speed by 1 stage when at 1/4 max HP or less. Single use.": "HP低於25%時速度提升1級。使用後消失",
    "Holder may switch out even when trapped by another Pokemon, or by Ingrain.": "必定可以交換，無視任何禁止交換的特性或狀態",
    "After an attack, holder gains 1/8 of the damage in HP dealt to other Pokemon.": "造成傷害後回復傷害量的1/8HP",
    "Restores 1/4 max HP when at 1/2 max HP or less. Single use.": "HP低於50%時回復1/4最大HP。使用後消失",
    "Holder's use of Sandstorm lasts 8 turns instead of 5.": "引起的沙暴天氣從5回合延長至8回合",
    "If held by a Snorlax with Giga Impact, it can use Pulverizing Pancake.": "卡比獸攜帶後可以將超級衝擊轉化成Z招式：認真起來大爆擊",
    "Raises holder's Attack by 1 if hit by an Ice-type attack. Single use.": "受到冰屬性招式攻擊時攻擊提升1級。使用後消失",
    "If held by a Latias/Latios, its Dragon- and Psychic-type moves have 1.2x power.": "拉帝亞斯/拉帝歐斯攜帶後龍屬性和超能力屬性招式威力提升20%",
    "A special Poke Ball for the Bug-Catching Contest.": "在捕蟲大賽上使用的特殊的球",
    "Raises a random stat by 2 when at 1/4 max HP or less (not acc/eva). Single use.": "HP低於25%時隨機提升一項能力2級。使用後消失",
    "If held by a Farfetch'd, its critical hit ratio is raised by 2 stages.": "大蔥鴨攜帶後擊中要害等級提升2級",
    "Each turn, holder loses 1/8 max HP. An attacker making contact can receive it.": "每回合損失1/8最大HP，受到接觸類招式傷害時對手獲得該道具",
    "If held by a Tapu with Nature's Madness, it can use Guardian of Alola.": "阿羅拉守護神攜帶後可以將自然之怒轉化成Z招式：巨人衛士·阿羅拉",
    "Holder's use of Electric/Grassy/Misty/Psychic Terrain lasts 8 turns instead of 5.": "引起的場地從5回合延長至8回合",
    "If held by a Cubone or a Marowak, its Attack is doubled.": "嘎啦嘎啦攜帶後攻擊翻倍",
    "A Poke Ball that becomes better the more turns there are in a battle.": "隨著戰鬥回合數增加而變得更好的特殊的球",
    "At the end of every turn, this item attempts to badly poison the holder.": "回合結束時進入劇毒狀態",
    "An ultra-performance Ball that provides a higher catch rate than a Great Ball.": "比起超級球來更容易捉到寶可夢的，性能非常不錯的球",
    "If holder is hit super effectively, raises Attack, Sp. Atk by 2 stages. Single use.": "受到效果絕佳的傷害時攻擊和特攻提升2級。使用後消失",
    "Restores all lowered stat stages to 0 when one is less than 0. Single use.": "將所有能力等級低於0的能力回復至0。使用後消失",
    "The accuracy of attacks by the holder is 1.1x.": "命中率提升10%",
    "Holder's special attacks have 1.1x power.": "特殊招式威力提升10%",
    "Used for Hyper Training. One of a Pokemon's stats is calculated with an IV of 31.": "用作極限特訓，提升一項個體值到最大值",
    "Used for Hyper Training. All of a Pokemon's stats are calculated with an IV of 31.": "用作極限特訓，提升所有個體值到最大值",
    "The accuracy of attacks by the holder is 1.2x if it moves after its target.": "出招比目標慢時命中率提升20%",
    "If held by a Lycanroc forme with Stone Edge, it can use Splintered Stormshards.": "習得尖石攻擊的鬃岩狼人可以使用狼嘯石牙颶風暴",
    "If held by a Mimikyu with Play Rough, it can use Let's Snuggle Forever.": "習得嬉鬧的謎擬Q可以使用親密無間大亂揍",
    "If held by a Kommo-o with Clanging Scales, it can use Clangorous Soulblaze.": "習得鱗片噪音的杖尾鱗甲龍可以使用熾魂熱舞烈音爆",
    "Solgaleo or Dusk Mane Necrozma with Sunsteel Strike can use a special Z-Move.": "習得流星閃衝的索爾迦雷歐或奈克洛茲瑪-黃昏之鬃可以發動特殊Z招式",
    "Lunala or Dawn Wings Necrozma with Moongeist Beam can use a special Z-Move.": "習得暗影之光的露奈雅拉或奈克洛茲瑪-拂曉之翼可以發動特殊Z招式",
    "Dusk Mane/Dawn Wings Necrozma: Ultra Burst, then Z-Move w/ Photon Geyser.": "讓奈克洛茲瑪-黃昏之鬃/拂曉之翼究極爆發再配合光子噴湧使用Z招式",
    "Evolves Milcery into Alcremie when held and spun around.": "小仙奶攜帶後滑動搖桿可以進化為霜奶仙",
    "Evolves Happiny into Chansey when held and leveled up during the day.": "小福蛋攜帶後在白天升級可以進化為吉利蛋",
    "Evolves certain species of Pokemon when used.": "使用後可以進化某些寶可夢",
    "Can be combined with certain fossils.": "可以和一些特定化石結合",
    "When the holder's stats are lowered, it will be switched out of battle.": "攜帶該道具的寶可夢能力下降時，自身下場與同伴進行替換",
    "Prevents the effects of traps set on the battlefield.": "防止攜帶者受到場地上的陷阱效果",
    "If Trick Room is active, lowers holder's Speed by 1 stage. Single use.": "攜帶該道具的寶可夢在戲法空間下速度降低1級。使用後消失",
    "Can revive into Dracozolt with Fossilized Drake or Arctozolt with Fossilized Dino.": "可以和化石龍合成並復活為雷鳥龍或和化石海獸復活為雷鳥海獸",
    "Can revive into Dracozolt with Fossilized Bird or Dracovish with Fossilized Fish.": "可以和化石鳥合成並復活為雷鳥龍或和化石海獸復活為鰓魚海獸",
    "Can revive into Dracovish with Fossilized Drake or Arctovish with Fossilized Dino.": "可以和化石龍合成並復活為鰓魚龍或和化石海獸復活為鰓魚海獸",
    "Can revive into Arctovish with Fossilized Fish or Arctozolt with Fossilized Bird.": "可以和化石鳥合成並復活為雷鳥龍或和化石魚復活為鰓魚海獸",
    "If held by a Zacian, this item changes it to Crowned Forme.": "蒼響攜帶會變為劍之王形態",
    "If held by a Zamazenta, this item changes it to Crowned Forme.": "藏瑪然特攜帶會變為盾之王形態",
    "Raises holder's Special Attack by 1 stage after using a sound move. Single use.": "使用聲音類招式時，特攻提升1級。使用後消失",
    "Blocks the holder from receiving any effects of Sunny Day/Rain Dance.": "阻止使用者從大晴天/下雨天中獲得任何效果",
    "When switching in, the holder is unaffected by hazards on its side of the field.": "攜帶後，不受腳下陷阱等的影響",
    "If the holder misses because of accuracy, it raises Speed by 2 stages. Single use.": "招式因命中率影響而落空時，速度會提升2級。使用後消失",
    "If the holder misses due to accuracy, its Speed is raised by 2 stages. Single use.": "招式因命中率影響而落空時，速度會提升2級。使用後消失",
    "If held by a Farfetch’d or Sirfetch’d, its critical hit ratio is raised by 2 stages.": "大蔥鴨或蔥遊兵攜帶後擊中要害率提高2級",
    "If the holder's stat stages are lowered, it switches to a chosen ally. Single use.": "攜帶該道具的寶可夢能力下降時，會與同行寶可夢進行替換。使用後消失",
    "If Trick Room is active, the holder's Speed is lowered by 1 stage. Single use.": "攜帶後，在戲法空間使用時，速度會下降1級。使用後消失",
    "Raises holder's Special Attack by 1 stage after it uses a sound move. Single use.": "攜帶該道具的寶可夢使用聲音的招式後，特攻提升1級。使用後消失",
    "The holder ignores rain- and sun-based effects.": "攜帶此道具的寶可夢不受大晴天和下雨的影響，對沙暴或冰雹沒有效果",
    "If held by a Zamazenta, this item changes its forme to Crowned Shield.": "藏瑪然特攜帶後，在對戰中會以藏瑪然特-盾之王形態登場",
    "If held by a Zacian, this item changes its forme to Crowned Sword.": "蒼響攜帶後，在對戰中會以蒼響-劍之王形態登場",
    "A Poke Ball that makes it easier to catch wild Pokemon while they're asleep.": "有點與眾不同的球。能很容易地捕捉睡眠狀態的寶可夢",
    "Holder's Ability cannot be changed by any effect.": "攜帶後特性不會被對手改變",
    "Activates the Protosynthesis or Quark Drive Abilities. Single use.": "給特性為古代活性或夸克充能的寶可夢觸發特性。使用後消失",
    "Prevents other Pokemon from lowering the holder's stat stages.": "攜帶後不會因其他寶可夢的招式或特性而降低能力",
    "Holder's moves that hit 2-5 times hit 4-5 times; Population Bomb hits 4-10 times.": "在使用連續攻擊2～5次的招式或鼠數兒時，至少攻擊4次",
    "When an opposing Pokemon raises a stat stage, the holder copies it. Single use.": "在對手提高能力時，有1次機會對其進行模仿並提高同樣的能力。使用後消失",
    "Holder's punch-based attacks have 1.1x power and do not make contact.": "拳類招式威力上升10%且不會被視作接觸類招式",
    "If held by a Farfetch’d, its critical hit ratio is raised by 2 stages.": "大蔥鴨或蔥遊兵攜帶後擊中要害等級提高2級",
    "Restores 60 HP to one Pokemon.": "回復該寶可夢60HP",
    "A big nugget of pure gold that gives off a lustrous gleam.": "以純金制成，閃著金光的大珠子。可以在商店高價出售",
    "Ogerpon-Cornerstone: 1.2x power attacks; Terastallize to gain Embody Aspect.": "厄鬼椪-礎石攜帶後招式威力提升20%；太晶化後特性變為面影輝映",
    "Ogerpon-Hearthflame: 1.2x power attacks; Terastallize to gain Embody Aspect.": "厄鬼椪-火灶攜帶後招式威力提升20%；太晶化後特性變為面影輝映",
    "Ogerpon-Wellspring: 1.2x power attacks; Terastallize to gain Embody Aspect.": "厄鬼椪-水井攜帶後招式威力提升20%；太晶化後特性變為面影輝映",








     //  前代招式

    "Has 1/3 recoil.": "有1/3的反彈傷害",
    "Destroys screens, even if the target is immune.": "摧毀目標隊伍的牆，即使目標免疫此攻擊",
    "Causes the foe(s) to fall asleep.": "使對方全體陷入睡眠狀態",
    "-1 evasion; clears target side's hazards/screens.": "令目標的閃避率降低1級。去除目標場地的牆、撒菱、隱形岩、毒菱和黏黏網",
    "For 2-5 turns, disables the target's last move.": "2～5回合內，目標最後使用的招式將無法再被使用",
    "For 4-7 turns, disables the target's last move.": "4～7回合內，目標最後使用的招式將無法再被使用",
    "For 5 turns, damage to allies halved. Snow only.": "5回合內，同伴所受到的傷害為原來的一半。只能在下雪時使用",
    "Hits adjacent Pokemon. Power doubles on Dig.": "攻擊周圍的寶可夢，對挖洞狀態的目標傷害翻倍",
    "For 1-7 turns, disables the target's last move.": "目標接下來的1～7回合，只能使用其最後使用的招式",
    "The target repeats its last move for 3-6 turns.": "目標接下來的3～6回合，只能使用其最後使用的招式",
    "The target repeats its last move for 4-8 turns.": "目標接下來的4～8回合，只能使用其最後使用的招式",
    "Has 1/3 recoil. 10% chance to burn. Thaws user.": "10%概率灼傷。有1/3的反彈傷害。使用後解凍",
    "If miss, user takes 1/8 damage it would've dealt.": "如果招式未命中，使用者將受到本應造成的1/8傷害",
    "If miss, user takes 1/2 damage it would've dealt.": "如果招式未命中，使用者將受到本應造成的1/2傷害",
    "Target's item is lost and it cannot obtain another.": "拍落目標物品並且目標無法獲得其他物品",
    "Traps and damages the target for 2-5 turns.": "困住並傷害目標2～5回合",
    "30% chance to badly poison the target.": "30%幾率使目標中毒",
    "Breaks protection. Fails if target is not protecting.": "破壞保護。如果目標未進行保護則使用失敗",
    "Weakens Electric-type attacks to 1/3 their power.": "電屬性招式的威力變為原來的1/3",
    "Weakens Electric-type attacks to 1/2 their power.": "電屬性招式的威力變為原來的1/2",
    "Power doubles during Bounce and Fly.": "如果目標處於飛翔或彈跳狀態，威力翻倍",
    "Raises the user's Sp. Atk by 1.": "提升1級特攻",
    "Hits adjacent Pokemon. Power doubles on Dive.": "攻擊周圍的寶可夢，對潛水狀態的目標傷害翻倍",
    "Can hit Pokemon using Bounce or Fly.": "可以擊中使用彈跳、飛翔的寶可夢",
    "Varies in power and type based on the user's IVs.": "招式屬性和傷害與使用者的個體值有關",
    "Lowers the foe(s) Speed by 1.": "令敵方的速度降低1級",
    "For 3 turns, allies' Speed is doubled.": "3回合內，我方全體速度翻倍",
    "For 3-5 turns, the target can't use status moves.": "使目標接下來的3～5回合無法使用變化招式",
    "Changes user's type to match a known move.": "改變自身屬性為自己學會的隨機一個招式的屬性",
    "User's type changes to resist last move against it.": "改變自身屬性為上回合目標使用招式的屬性對自身效果不理想或沒有效果的屬性。",
    "Lowers the foe(s) evasiveness by 1.": "令對手l的閃避率降低1級",
    "Lasts 2-5 turns. Active Pokemon cannot sleep.": "在2～5回合內攻擊對手。在此期間誰都不能入眠",
    "Lasts 3-6 turns. Active Pokemon cannot sleep.": "在3～6回合內攻擊對手。在此期間誰都不能入眠",
    "Weakens Fire-type attacks to 1/2 their power.": "進入玩水狀態。玩水狀態的寶可夢在場時，火屬性招式威力減半",
    "Weakens Fire-type attacks to 1/3 their power.": "進入玩水狀態。玩水狀態的寶可夢在場時，火屬性招式威力降低至1/3",
    "Next turn, heals 50% of the recipient's max HP.": "下一回合使用者回復自己的50%最大HP",
    "Has 1/3 recoil. 10% chance to paralyze target.": "有1/3的反彈傷害。10%概率使目標麻痹",
    "10% chance to freeze foe(s).": "10%概率使目標冰凍",
    "Power doubles if the targeted foe is switching out.": "如果目標在本回合內準備替換下場，傷害翻倍",
    "Damage doubles and type varies during weather.": "傷害翻倍，屬性隨天氣變化而變化",
    "Changes user's type based on terrain. (Normal)": "根據地形或場地型狀態改變使用者的屬性（普通）",
    "The user's Electric attack next turn has 2x power.": "使用者的下次電屬性招式傷害翻倍",
    "User recovers 1/16 max HP per turn. Traps user.": "使自己無法交換下場。每回合回復最大HP的1/16",
    "Charges, then hits foe(s) turn 2.": "制造風之刃，於下回合攻擊對手。",
    "Attack changes based on terrain. (Swift)": "根據使用場所不同，該招式的追加效果也會有所變化（迅速）",
    "Damage doubles if user is hit by the target.": "如果目標本回合內攻擊過自身並造成傷害，威力翻倍",
    "Damage doubles if target is paralyzed; cures it.": "如果目標處於麻痹狀態，招式的威力加倍。解除目標的麻痹狀態",
    "Lowers the PP of the target's last move by 2-5.": "對手最後使用的招式的PP降低2～5點",
    "Hits foes. Power doubles against Dive.": "如果目標處於潛水狀態，威力翻倍",
    "10% chance to lower the foe(s) Defense by 1.": "10%幾率令目標的特防降低1級",
    "Raises user's Stockpile count by 1. Max 3 uses.": "提高1級防禦和特防。最多積蓄3次",
    "Power doubles on Dig.": "如果目標處於挖洞狀態，威力翻倍",
    "For 5 turns, the user's party has doubled Sp. Def.": "5回合內，我方特防翻倍",
    "The next move will not miss the target.": "下次攻擊必定命中",
    "Raises the user's critical hit ratio by 1.": "提升1級擊中要害率",
    "Power doubles during Fly.": "如果目標處於飛翔狀態，威力翻倍",
    "Lowers the target's evasiveness by 1.": "降低目標1級閃避率",
    "Power doubles if the foe is switching out.": "如果目標替換下場，傷害翻倍",
    "For 5 turns, the user's party has doubled Def.": "5回合內，我方防禦翻倍",
    "Hurts grounded foes on switch-in. Max 1 layer.": "使目標場地進入撒菱狀態。最多1層",
    "10% chance to lower the target's Defense by 1.": "10%幾率降低目標1級防禦",
    "Next Rage increases in damage if hit during use.": "在使用該技能之後，下次行動之前，只要被命中，自身攻擊提升1級",
    "Charges, then hits target turn 2. High crit ratio.": "制造風之刃，於第2回合攻擊對手。容易擊中要害",
    "Hits 1-3 times. Power rises with each hit.": "連續攻擊1～3次。每一次的威力都會提升",
    "Hits 2 times. Last hit has 20% chance to poison.": "連續攻擊2次。最後一次有20%幾率令目標中毒",
    "Changes user's type to resist the foe's last move.": "改變自身屬性為自己最後使用招式的屬性",
    "Fails when used in Link Battles.": "在連接對戰中使用寫生會失敗",
    "Destroys the foe(s) Berry.": "燒毀敵方的樹果",
    "Changes user's type based on terrain. (Ground)": "根據地形更改使用者的屬性。（地面）",
    "Effect varies with terrain. (30% chance acc -1)": "追加效果根據場地有所變化。（30%幾率降低1級能力）",
    "Protects allies from multi-target damage this turn.": "處於廣域防守狀態的場地上的寶可夢不會受到我方全體或場上全體的招式的攻擊",
    "This Pokemon is immune to damage from Sandstorm or Hail.": "該特性的寶可夢不會受到沙暴和冰雹天氣的傷害",
    "30% chance to make the target flinch.": "30%的幾率使目標陷入畏縮",
    "20% chance to make the target flinch.": "20%的幾率使目標陷入畏縮",
    "10% chance to make the target flinch.": "10%的幾率使目標陷入畏縮",
    "Damage doubles if the target is Dynamaxed.": "如果目標處於極巨化狀態，威力翻倍",
    "Uses user's Def stat as Atk in damage calculation.": "使用自身的防禦代替自身的攻擊進行傷害計算",
    "Power doubles if user moves before the target.": "如果比對手先出手攻擊，招式的威力會變成2倍",
    "User loses 33% of its max HP. +1 to all stats.": "使用者的攻擊、防禦、特攻、特防和速度會各上升1級",
    "Swaps user's field effects with the opposing side.": "可交換招式使用方和對方的部分場地狀態",
    "-1 evasion; clears terrain and hazards on both sides.": "令目標的閃避率降低1級。能夠移除雙方場地上的場地型狀態",
    "Hits twice. 30% chance to make the target flinch.": "連續攻擊對手兩次。30%幾率使目標陷入畏縮",
    "Hits twice. Doubles: Tries to hit each foe once.": "連續攻擊2次。雙打：對兩只對手寶可夢分別進行一次攻擊",
    "Removes 3 PP from the target's last move.": "對手最後使用的招式的PP降低3點",
    "Removes adjacent Pokemon's held items.": "融化相鄰寶可夢所攜帶的道具",
    "User on Psychic Terrain: 1.5x power, hits foes.": "在精神場地上：威力提升1.5倍",
    "20% chance to make the foe(s) flinch.": "20%幾率使目標陷入畏縮",
    "Power doubles if used after Fusion Flare this turn.": "如果本回合上一個成功使用的招式是交錯火焰，威力翻倍",
    "Power doubles if used after Fusion Bolt this turn.": "如果本回合上一個成功使用的招式是交錯閃電，威力翻倍",
    "Target: 100% -1 Def. During Gravity: 1.5x power.": "100%降低目標的防禦1級，在重力狀態時威力提升1.5倍",
    "User faints. Next hurt Pokemon is fully healed.": "自己瀕死，治癒下個上場的寶可夢的異常狀態並回滿HP",
    "Protects from damaging attacks. Contact: -1 Atk.": "守住並變為防禦姿態。降低所接觸到的對手的1級攻擊",
    "Protects from damaging attacks. Contact: -2 Atk.": "守住並變為防禦姿態。降低所接觸到的對手的2級攻擊",
    "2x power if the user had a stat lowered this turn.": "若該回合內自身能力變化曾降低過，則招式威力變成2倍",
    "User faints. Next hurt Pkmn is cured, max HP/PP.": "自己瀕死，治癒後備下個的寶可夢的異常狀態並回滿HP/PP",
    "Protects from damaging attacks. Contact: -2 Def.": "守住並降低所接觸到的對手的2級防禦",
    "No additional effect. Hits foe(s).": "攻擊對手造成傷害",
    "Fails if the target has no held item.": "當對手沒有攜帶道具時，使用此招式時便會失敗",
    "If a foe is switching out, hits it at 2x power.": "當對手替換寶可夢時使出此招式的話，威力翻倍",
    "30% chance to make the foe(s) flinch.": "30%幾率使對手陷入畏縮",
    "20% psn. Physical+contact if it would be stronger.": "從物理攻擊和特殊攻擊中選擇造成較多傷害的方式進行攻擊。20%幾率中毒",
    "High critical hit ratio. Cannot be redirected.": "擊中要害率比普通招式高1級",
    "Ends the effects of terrain.": "攻擊目標造成傷害。使場地狀態消失",
    "Fails if there is no terrain active. Ends the terrain.": "攻擊後破壞場地型狀態。如果不存在場地型狀態，使用失敗",
    "Always results in a critical hit. Hits 3 times.": "連續攻擊3次。每一擊都必定擊中要害",
    "100% chance to lower the foe(s) Attack by 1.": "100%令攻擊到的目標物攻降低1級",
    "Raises an ally's Attack and Defense by 1.": "提高我方全員的攻擊和防禦各1級 ",
    "100% burns a target that had a stat rise this turn.": "令該回合內能力變化曾提高過的寶可夢陷入灼傷狀態",
    "Removes adjacent Pokemon's held items.": "融化相鄰寶可夢所攜帶的道具",
    "5 turns: no Ground immunities, 1.67x accuracy.": "場上生成強重力，持續時間為5回合",
    "Prevents both user and target from switching out.": "使攻擊方和目標都陷入無法逃走狀態",
    "Raises the target's Attack and Sp. Atk by 2.": "令目標的攻擊和特攻提升2級。",
    "User on Grassy Terrain: +1 priority.": "在青草場地上，若使用者為地上的寶可夢，優先度+1",
    "User and allies: healed 1/4 max HP, status cured.": "回復自己和場上同伴最大HP的1/4並治癒所有異常狀態",
    "Heals the user and its allies by 1/4 their max HP.": "回復自己和場上同伴最大HP的1/4",
    "Raises user's Sp. Atk by 1 on turn 1. Hits turn 2.": "第1回合蓄力提高特攻，第2回合攻擊對手",
    "User faints. User on Misty Terrain: 1.5x power.": "使用者陷入瀕死。若使用者站在地上，威力提升1.5倍",
    "Traps target, lowers Def and SpD by 1 each turn.": "使目標陷入無法逃走狀態，每回合令其防禦和特防降低1級",
    "Hits 2-5 times. User: -1 Def, +1 Spe after last hit.": "連續攻擊2～5次。速度會提高但防禦會降低",
    "100% chance to lower target's Sp. Atk by 1.": "100%令攻擊到的目標特攻降低1級",
    "Must hold Berry to use. User eats Berry, Def +2.": "消耗掉使用者所攜帶的樹果。令使用者的防禦提升2級",
    "User on terrain: power doubles, type varies.": "使出招式時場地狀態不同，招式的屬性和威力會有所變化",
    "Base move affects power. Allies: +1 Speed.": "威力由原本招式的威力決定。提高我方的速度",
    "Base move affects power. Foes: -1 Sp. Def.": "威力由原本招式的威力決定。降低對手的特防",
    "Base move affects power. Starts Sunny Day.": "威力由原本招式的威力決定。5回合內讓日照變得強烈",
    "Base move affects power. Foes: -1 Sp. Atk.": "威力由原本招式的威力決定。降低對手的特攻",
    "Base move affects power. Starts Rain Dance.": "威力由原本招式的威力決定。5回合內降下大雨",
    "Protects user from moves & Max Moves this turn.": "完全抵擋對手包括極巨招式在內的攻擊，連續使用容易失敗",
    "Base move affects power. Starts Hail.": "威力由原本招式的威力決定。5回合內會降下冰雹",
    "Base move affects power. Allies: +1 Attack.": "威力由原本招式的威力決定。提高我方的攻擊。",
    "Base move affects power. Starts Electric Terrain.": "威力由原本招式的威力決定。5回合內將腳下變成電氣場地",
    "Base move affects power. Starts Psychic Terrain.": "威力由原本招式的威力決定。5回合內將腳下變成精神場地",
    "Base move affects power. Allies: +1 Sp. Atk.": "威力由原本招式的威力決定。降低對手的特攻",
    "Base move affects power. Starts Grassy Terrain.": "威力由原本招式的威力決定。5回合內將腳下變成青草場地",
    "Base move affects power. Foes: -1 Defense.": "威力由原本招式的威力決定。降低對手的防禦",
    "Base move affects power. Allies: +1 Sp. Def.": "威力由原本招式的威力決定。提高我方的特防",
    "Base move affects power. Starts Sandstorm.": "威力由原本招式的威力決定。5回合內卷起沙暴",
    "Base move affects power. Starts Misty Terrain.": "威力由原本招式的威力決定。5回合內將腳下變成薄霧場地",
    "Base move affects power. Allies: +1 Defense.": "威力由原本招式的威力決定。提高我方的防禦",
    "Base move affects power. Foes: -1 Speed.": "威力由原本招式的威力決定。降低對手的速度",
    "Base move affects power. Foes: -1 Attack.": "威力由原本招式的威力決定。降低對手的攻擊",
    "Fails when used.": "與訓練師的對戰中使用會失敗",
    "Frees user from hazards, binding, Leech Seed.": "移除己方場地上的撒菱、隱形岩、毒菱和黏黏網；擺脫自身束縛，寄生種子狀態",
    "Protects from attacks. Contact: lowers Atk by 2.": "抵擋對手的攻擊。如果對手使用了接觸類招式，攻擊降低2級",







     //  招式效果

    "30% chance to confuse. 50% recoil if it misses.": "30%的幾率使目標混亂，如果招式未命中則使用者失去50%最大HP",
    "30% chance to lower the foe(s) Speed by 1.": "30%幾率降低目標1級速度",
    "Deals 1.3x damage if the move is super effective.": "出現效果絕佳時威力提升30%",
    "50% chance to raise user's Defense by 2.": "50%幾率令使用者的防禦提高2級",
    "High critical hit ratio. 50% chance to slp/psn/par target.": "容易擊中要害，50%幾率使目標陷入中毒、麻痹、瞌睡之中的一種狀態",
    "High critical hit ratio. Raises the user's Speed by 1.": "容易擊中要害，令使用者的速度提高1級",
    "Cannot be used twice in a row.": "無法連續使用",
    "Nullifies protection moves.": "無視守住類招式",
    "30% chance to confuse the target.": "30%幾率使目標混亂",
    "Lowers the user's Sp. Atk by 1.": "使用者的特攻會降低1級",
    "+1 to stat depending on Tatsugiri color.": "若口中有米立龍，會按其樣子提高能力，提升幅度為1級",
    "Destroys screens. Type depends on user's form.": "招式的屬性隨形態改變，可以破壞光牆和反射壁等招式",
    "20% chance to burn foe(s).": "20%幾率使目標灼傷",
    "Lowers the user's Speed by 2.": "令使用者的速度降低2級",
    "30% chance lower adjacent Pkmn Attack by 1.": "30%的幾率降低相鄰的精靈1級物攻",
    "100% chance to raise the user's Sp. Atk by 1.": "100%幾率提高使用者1級特攻",
    "High critical hit ratio. 50% -1 Def. 10% to flinch.": "容易擊中要害，且50%幾率降低目標1級防禦、10%幾率使目標畏縮",
    "10% chance to sleep target.": "10%幾率使目標陷入睡眠狀態",
    "20% chance to paralyze foe(s).": "20%幾率使目標陷入麻痹狀態",
    "High critical hit ratio. Foes: Spikes.": "容易擊中要害。向對手的場地撒菱",
    "Snowscape begins. User switches out.": "和後備寶可夢替換並使天氣變為持續5回合的雪景",
    "User and ally's Abilities become target Abilities": "將自己和同伴的特性變得和目標相同",
    "User and ally's Abilities become target Ability": "將自己和同伴的特性變得和目標相同",
    "User loses 50% of its max HP. +2 to Atk, Sp. Atk, Spe.": "使用者削減50%最大HP，使攻擊、特攻、速度上升2級",
    "Always results in a critical hit; does not check accuracy.": "必定會命中，且必定會擊中要害",
    "30% chance to burn. 2x power if target is statused.": "30%幾率使目標陷入灼傷狀態，攻擊處於異常狀態的目標時，威力翻倍",
    "Power increases by 50 with each fainted party member.": "每有一只我方寶可夢被打倒，都將使招式威力提升50",
    "Free user from hazards/bind/Leech Seed; poisons opponents.": "使目標中毒。可以擺脫綁緊、緊束、寄生種子等招式",
    "Hits 10 times. Each hit can miss.": "攻擊10次，每次攻擊都可能被閃避",
    "100% chance to raise the user's Defense by 1.": "100%幾率提高使用者1級防禦",
    "Power increases by 50 each time user is hit.": "受到攻擊的次數越多，招式的威力越高",
    "2x power if target is grounded in Electric Terrain.": "在電氣場地上:威力翻倍",
    "Revives a fainted Pokemon to 50% HP.": "讓失去戰鬥能力的後備寶可夢以50%HP的狀態復活",
    "Deals 1/8 max HP every turn; 1/4 if Steel or Water.": "每回合造成1/8最大生命值的傷害，如果是鋼系或水系則為1/4",
    "For 5 turns, a sandstorm rages. Rock: 1.5x SpD.": "使天氣變為沙暴，持續5回合",
    "User takes 1/2 its max HP to pass a substitute.": "削減1/2HP制造分身，並和後備寶可夢進行替換",
    "Protects from damaging attacks. Contact: -1 Spe.": "免受對手攻擊，並使接觸到的對手的速度降低1級",
    "For 5 turns, snow falls. Ice: 1.5x Def.": "使天氣變為雪景，持續5回合",
    "Target: +2 Atk, -2 Def.": "使目標的攻擊提升2級，防禦降低2級",
    "High critical hit ratio. Foes: Stealth Rock.": "容易擊中要害。向對手的場地灑隱形岩",
    "Cures status. Raises Sp. Atk and Sp. Def by 1.": "治癒異常狀態，使用者的特攻和特防提高1級",
    "User: +1 Atk, +1 Spe. Clears any Substitute and hazards.": "清釘，使用者的速度和攻擊提高1級",
    "Hits 3 times.": "攻擊三次",
    "Raises the user Attack": "提升使用者的攻擊",
    "Raises the user攻擊": "提升使用者的攻擊",
    "Raises the user's Attack": "提升使用者的攻擊",
    "User's Electric type becomes typeless; must be Electric.": "令使用者的電屬性消失；使用者必須為電屬性",
    "Very high critical hit ratio.": "十分容易擊中要害",
    "User recovers 50% of the damage dealt.": "使用者將造成傷害的50%轉化為自身的HP",
    "Usually goes first.": "先制攻擊",
    "10% chance to lower the foe(s) Sp. Def by 1.": "10%幾率令目標的特防降低1級",
    "Raises the user's Defense by 2.": "令使用者的防禦提升2級",
    "Power is equal to the base move's Z-Power.": "威力會根據原來的招式而改變",
    "100% chance to lower the target's Sp. Def by 2.": "100%幾率令目標的特防降低2級",
    "Power doubles if the user has no held item.": "沒有攜帶道具時，威力翻倍",
    "Raises a random stat of the user or an ally by 2.": "使自身或夥伴隨機一項能力提升2級",
    "High critical hit ratio.": "容易擊中要害",
    "The target makes its move right after the user.": "目標將會在使用者之後立刻行動",
    "Raises the user's Speed by 2.": "令使用者的速度提升2級",
    "High critical hit ratio. Hits adjacent foes.": "容易擊中要害攻擊鄰近的對手",
    "30% chance to flinch the target.": "30%幾率使目標陷入畏縮",
    "The user swaps positions with its ally.": "使用者與同伴交換位置",
    "Raises the user's Sp. Def by 2.": "令使用者的特防提升2級",
    "Prevents the target from switching out.": "令目標陷入無法逃走狀態",
    "10% chance to raise all stats by 1 (not acc/eva).": "有10%的幾率提升自身各項能力1級（除閃避率，命中率）",
    "User recovers 1/16 max HP per turn.": "使用者每回合回復自身1/16最大HP",
    "No additional effect.": "攻擊目標造成傷害",
    "Hits 2-5 times in one turn.": "一回合內攻擊2～5次",
    "Cures the user's party of all status conditions.": "治癒使用者隊伍中所有寶可夢的異常狀態",
    "Raises an ally's Sp. Def by 1.": "提升一名同伴的特防1級",
    "Uses a random move known by a team member.": "隨機使用隊伍里一個成員已習得的招式",
    "Power doubles if target was damaged this turn.": "如果使用者在這回合受到了攻擊，威力翻倍",
    "A target of the opposite gender gets infatuated.": "和使用者性別不同的目標會陷入著迷狀態",
    "For 5 turns, damage to allies is halved. Hail only.": "5回合內，友軍受到傷害減半。只能在冰雹天氣時使用",
    "Raises the user's Speed by 2; user loses 100 kg.": "使用者速度提升2級並減少100kg體重",
    "Power doubles if user is damaged by the target.": "如果被目標攻擊的話，威力翻倍",
    "Lowers the target's Attack by 1.": "令目標的攻擊下降1級",
    "Protects from moves. Contact: poison.": "使自己進入守住狀態，接觸到的對手會陷入中毒狀態",
    "User switches, passing stat changes and more.": "使用者和後備寶可夢替換，能夠接力能力階級變化等",
    "Burns on contact with the user before it moves.": "在使用招式前接觸到使用者的對手會陷入灼傷狀態",
    "All healthy allies aid in damaging the target.": "所有健康的己方寶可夢會一起攻擊目標",
    "Cannot be selected until the user eats a Berry.": "使用者食用樹果前不能被使用",
    "User loses 50% max HP. Maximizes Attack.": "使用者失去自身50%最大HP，使攻擊最大化",
    "User passes its held item to the target.": "使用者將持有的道具移交給目標",
    "Waits 2 turns; deals double the damage taken.": "等待兩回合，之後將受到的傷害雙倍奉還給對手",
    "Traps and damages the target for 4-5 turns.": "困住並傷害目標4～5回合",
    "User cannot move next turn.": "使用者下回合無法移動",
    "High critical hit ratio. 10% chance to burn.": "容易擊中要害有10%的幾率使對手陷入灼傷狀態",
    "10% chance to freeze foe(s). Can't miss in hail.": "有10%的幾率使目標陷入冰凍狀態。在冰雹天氣時攻擊不會被閃避",
    "20% chance to burn the target.": "有20%的幾率使目標陷入灼傷狀態",
    "30% chance to paralyze the target.": "有30%的幾率使目標陷入麻痹狀態",
    "20% chance to paralyze the target.": "有20%的幾率使目標陷入麻痹狀態",
    "10% chance to flinch the target.": "有10%的幾率使目標畏縮",
    "Hits 2 times in one turn.": "一回合內攻擊2次",
    "No additional effect. Hits adjacent Pokemon.": "攻擊目標造成傷害攻擊鄰近的寶可夢",
    "Bounces turn 1. Hits turn 2. 30% paralyze.": "第一回合躍起，第二回合攻擊。有30%的幾率使目標麻痹",
    "Has 33% recoil.": "有33%的反彈傷害",
    "Destroys screens, unless the target is immune.": "摧毀目標隊伍的牆，除非目標免疫此攻擊",
    "Power doubles if the target's HP is 50% or less.": "如果目標的HP為最大HP的一半或更少，此招式威力翻倍",
    "10% chance to lower the foe(s) Speed by 1.": "有10%的幾率使（所有）對手的速度下降1級",
    "10% chance to lower the target's Speed by 1.": "有10%的幾率使目標的速度下降1級",
    "User steals and eats the target's Berry.": "使用者將竊取並食用目標的樹果",
    "10% chance to lower the target's Sp. Def by 1.": "有10%的幾率使目標的特防下降1級",
    "Raises the user's Attack and Defense by 1.": "提升使用者的攻擊和防禦各1級",
    "User's Fire type becomes typeless; must be Fire.": "令使用者的火屬性消失；使用者必須為火屬性",
    "Raises the user's Sp. Atk and Sp. Def by 1.": "提升使用者的特攻和特防各1級",
    "Changes user's type by terrain (default Normal).": "根據場地改變使用者的屬性",
    "Lowers the foe(s) Sp. Atk by 2 if opposite gender.": "如果目標的性別和使用者相反，目標的特攻下降2級",
    "70% chance to raise the user's Sp. Atk by 1.": "有70%的幾率令使用者的特攻上升1級",
    "Lowers the target's Attack by 2.": "使目標的攻擊下降2級",
    "100% chance to confuse the target.": "100%使目標混亂",
    "Ignores the target's stat stage changes.": "無視目標的能力階級變化進行攻擊",
    "Forces the target to switch to a random ally.": "使目標和後備寶可夢替換",
    "Lowers the user's Defense by 1.": "令使用者的防禦下降1級",
    "Lowers the user's Defense and Sp. Def by 1.": "令使用者的防禦和特防下降1級",
    "Lowers the target's Sp. Atk by 1.": "使目標的特攻下降1級",
    "Confuses the target.": "使目標陷入混亂狀態",
    "10% chance to confuse the target.": "有10%的幾率使目標陷入混亂狀態",
    "Changes user's type to match its first move.": "令使用者的屬性變的和自身已學會的第一個招式的屬性相同",
    "Changes user's type to resist target's last move.": "使自己的屬性變的對目標最後使出的招式屬性有抗性",
    "Uses the last move used in the battle.": "使用上一個在對戰中使用的招式",
    "Raises the user's Defense and Sp. Def by 1.": "提升使用者的防禦和特防各1級",
    "Raises the user's Defense by 3.": "提升使用者的防禦3級",
    "Lowers the target's Speed by 2.": "使目標的速度下降2級",
    "If hit by physical attack, returns double damage.": "如果被物理攻擊傷害，則返還對手兩倍的傷害",
    "If the user has no item, it steals the target's.": "如果使用者沒有持有道具，將會偷走目標的道具",
    "Protects allies from Status moves this turn.": "保護所有同伴免受變化招式的影響",
    "High critical hit ratio. 10% chance to poison.": "容易擊中要害有10%的幾率使對手中毒",
    "50% chance to lower the target's Defense by 1.": "有50%的幾率使目標的防禦下降1級",
    "More power the more HP the target has left.": "目標剩餘的HP越多，此招式威力越高",
    "20% chance to flinch the target.": "有20%的幾率使目標畏縮",
    "-1 evasion; clears user and target side's hazards.": "使目標的閃避率下降1級，並清除目標隊伍的白霧",
    "If an opponent knocks out the user, it also faints.": "如果對手令使用者陷入瀕死狀態，那麼它也同樣也陷入瀕死",
    "Prevents moves from affecting the user this turn.": "本回合內，避免招式對使用者造成影響",
    "50% chance to raise user's Def by 2 for each hit.": "每一次攻擊都有50%的幾率令使用者的防禦提升2級",
    "Digs underground turn 1, strikes turn 2.": "第一回合找個地縫鑽進去，第二回合攻擊",
    "For 4 turns, disables the target's last move used.": "4回合內，目標最後使用的招式將無法再被使用",
    "This move does not check accuracy. Hits foes.": "攻擊一定會命中攻擊所有對手",
    "30% chance to paralyze adjacent Pokemon.": "有30%的幾率使鄰近的寶可夢陷入麻痹狀態",
    "Dives underwater turn 1, strikes turn 2.": "第一回合潛入水中，第二回合攻擊",
    "20% chance to confuse the target.": "有20%的幾率使目標陷入混亂狀態",
    "Hits two turns after being used.": "使用該招式後，兩回合後觸發攻擊效果",
    "Raises the user's evasiveness by 1.": "令使用者的閃避率上升以1級",
    "Lowers the user's Sp. Atk by 2.": "令使用者的特攻下降2級",
    "Raises the user's Attack and Speed by 1.": "提升使用者的攻擊和速度各1級",
    "User recovers 75% of the damage dealt.": "使用者將造成傷害的75%轉化為自身的HP",
    "User gains 1/2 HP inflicted. Sleeping target only.": "將造成傷害的1/2轉化為自身的HP。只能對睡眠寶可夢使用",
    "Power increases when used on consecutive turns.": "如果連續使用此招式威力會上升",
    "Lowers the target's Sp. Atk by 2.": "降低目標的特攻2級",
    "10% chance to freeze foe(s). Can't miss in Hail.": "10%幾率冰凍。冰雹天氣下必定命中",
    "5 turns. Grounded: +Electric power, can't sleep.": "5回合內，提升地上的寶可夢的電招式威力，不會陷入睡眠",
    "Changes the target's move to Electric this turn.": "使目標這回合使用的招式屬性變為電屬性",
    "More power the faster the user is than the target.": "使用者比目標速度越快，此招式威力越高",
    "100% chance to lower the foe(s) Speed by 1.": "100%使(所有)對手的速度下降1級",
    "For 5 turns, the target's item has no effect.": "5回合內，目標的道具不會有任何效果",
    "10% chance to burn the target.": "有10%的幾率使目標陷入灼傷狀態",
    "Lowers the target's HP to the user's HP.": "使目標的HP降得和使用者的HP相同",
    "The target's Ability changes to match the user's.": "目標的特性將會變得和使用者相同",
    "Less power as user's HP decreases. Hits foe(s).": "使用者的HP剩下的越少，威力越小，攻擊（所有）對手",
    "Hits adjacent Pokemon. The user faints.": "攻擊鄰近的寶可夢使用者陷入瀕死狀態",
    "Raises user's Atk, Def, SpA, SpD, and Spe by 2.": "提升使用者的攻擊防禦特攻特防速度各2級",
    "Nearly always goes first.": "幾乎總是先發制人",
    "Power doubles if user is burn/poison/paralyzed.": "如果使用者處於灼傷/中毒/麻痹狀態，威力翻倍",
    "Prevents all Pokemon from switching next turn.": "下一回合內，阻止所有寶可夢的替換",
    "Hits first. First turn out only. 100% flinch chance.": "先制攻擊。只能在出場後第一回合使用，100%使目標畏縮",
    "Lowers the target's Sp. Def by 2.": "使目標的特防下降2級",
    "Always leaves the target with at least 1 HP.": "總會使目標留下至少一點HP",
    "Nullifies Detect, Protect, and Quick/Wide Guard.": "取消目標的守住/廣域防守/快速防守的效果",
    "Raises user's Attack by 3 if this KOes the target.": "如果這一擊擊倒了目標，使用者的攻擊提升3級",
    "50% chance to raise the user's Sp. Atk by 1.": "有50%的幾率令使用者的特攻上升1級",
    "Does damage equal to the user's HP. User faints.": "造成的傷害和使用者留下的HP相同使用者陷入瀕死狀態",
    "10% chance to burn. 10% chance to flinch.": "有10%的幾率使目標陷入灼傷狀態有10%的幾率使目標畏縮",
    "100% chance to lower the target's Defense by 1.": "100%使目標的防禦下降1級",
    "Use with Grass or Water Pledge for added effect.": "和草或水之誓言同時使用會有特效",
    "Hits first. First turn out only.": "先制攻擊，只能在出場後第一回合使用",
    "OHKOs the target. Fails if user is a lower level.": "一擊必殺。如果使用者的等級低於目標，使用失敗",
    "More power the less HP the user has left.": "使用者的HP越少，招式威力越高",
    "Damages Pokemon next to the target as well.": "擊中目標的同時也會傷害到其身邊的寶可夢",
    "100% chance to raise the user's Speed by 1.": "100%令使用者的速度上升1級",
    "10% chance to burn the target. Thaws user.": "10%使目標陷入灼傷狀態。令使用者解凍",
    "Has 33% recoil. 10% chance to burn. Thaws user.": "有33%的反彈傷害。10%使目標陷入灼傷。令使用者解凍",
    "Lowers the target's accuracy by 1.": "使目標的命中率下降1級",
    "Raises the target's Sp. Atk by 1 and confuses it.": "使目標的特攻上升1級，使目標陷入混亂狀態",
    "Flings the user's item at the target. Power varies.": "使用者投擲攜帶的道具進行攻擊威力會改變",
    "Heals the target by 50% of its max HP.": "使目標回復其50%最大HP",
    "Raises Defense by 1 of all active Grass types.": "使場上所有草屬性寶可夢的防禦提升1級",
    "Flies up on first turn, then strikes the next turn.": "第一回合上天，第二回合攻擊",
    "Combines Flying in its type effectiveness.": "此招式同時也具備飛行屬性",
    "Raises the user's critical hit ratio by 2.": "令使用者的擊中要害階級提升2級",
    "Fails if the user takes damage before it hits.": "如果在使用招式前受到攻擊則招式使用失敗",
    "The foes' moves target the user on the turn used.": "所有對手使用的作用範圍為單體選擇的招式都會攻向自己",
    "Fighting, Normal hit Ghost. Evasiveness ignored.": "格鬥屬性，一般屬性招式能擊中幽靈屬性無視閃避率變化",
    "Adds Grass to the target's type(s).": "使目標增加草屬性",
    "Uses target's Attack stat in damage calculation.": "使用目標的攻擊代替使用者的攻擊進行傷害計算",
    "10% chance to freeze. Super effective on Water.": "有10%的幾率使目標陷入冰凍狀態。對水屬性效果絕佳",
    "Charges turn 1. Hits turn 2. 30% paralyze.": "第一回合充能，第二回合攻擊。30%幾率使目標麻痹",
    "Always results in a critical hit.": "一定會造成擊中要害",
    "Max 102 power at minimum Happiness.": "當親密值最低的時候達到最大威力102",
    "Power doubles with each hit, up to 160.": "每一連續擊都會使上一擊的威力加倍最高為160",
    "Power doubles if used after Fusion Flare.": "如果在攻擊前被交織火焰擊中的話威力加倍",
    "Power doubles if used after Fusion Bolt.": "如果在攻擊前被交織閃電擊中的話威力加倍",
    "Nullifies the target's Ability.": "令目標的特性無效",
    "Raises Atk, Sp. Atk of allies with Plus/Minus by 1.": "提升特性為正電/負電的寶可夢的攻擊和特攻各1級",
    "Summons Psychic Terrain.": "散布精神場地",
    "Charges, then raises SpA, SpD, Spe by 2 turn 2.": "先充能，然後提升使用者的特攻、特防和速度各2級",
    "Paralyzes the target.": "使目標陷入麻痹狀態",
    "More power the heavier the target.": "目標越重，威力越大",
    "Use with Fire or Water Pledge for added effect.": "和火或水之誓言同時使用會有特效",
    "For 5 turns, negates all Ground immunities.": "5回合內無視所有對地面屬性的免疫",
    "Lowers the foe(s) Attack by 1.": "使（所有）對手的攻擊下降1級",
    "Raises user's Attack and Sp. Atk by 1; 2 in Sun.": "讓使用者的攻擊和特攻上升1級，大晴天上升2級",
    "If the user faints, the attack used loses all its PP.": "如果使用者被擊倒，擊倒自己的那個的招式PP歸零",
    "Averages Defense and Sp. Def stats with target.": "平分使用者和目標的防禦和特防",
    "Swaps Defense and Sp. Def changes with target.": "交換使用者和目標的防禦和特防",
    "Does damage equal to 3/4 target's current HP.": "目標失去3/4最大HP",
    "More power the slower the user than the target.": "使用者速度比目標越慢，威力越大",
    "For 5 turns, hail crashes down.": "5回合內為冰雹天氣",
    "Lowers the user's Speed by 1.": "令使用者的速度下降1級",
    "Raises the user's Defense by 1.": "令使用者的防禦提升1級",
    "Eliminates all stat changes.": "消除所有能力階級變化",
    "Has 1/4 recoil.": "有1/4的反彈傷害",
    "Has 1/2 recoil.": "有1/2的反彈傷害",
    "For 5 turns, the foe(s) is prevented from healing.": "5回合內，（所有）對手無法使用治癒招式",
    "Heals the user by 50% of its max HP.": "令使用者回復自身50%最大HP",
    "User faints. Replacement is fully healed.": "使用者陷入瀕死狀態替換上場的寶可夢會被完全治癒",
    "Swaps all stat changes with target.": "交換自身和目標的能力階級變化",
    "More power the heavier the user than the target.": "使用者比目標越重，招式威力越大",
    "10% chance to burn the foe(s).": "10%幾率使目標陷入灼傷狀態",
    "One adjacent ally's move power is 1.5x this turn.": "一名鄰近的同伴此回合使出的招式威力變為原來的1.5倍",
    "Power doubles if the target has a status ailment.": "如果目標已經陷入負面狀態則威力翻倍",
    "Varies in type based on the user's IVs.": "招式屬性和使用者的個體值有關",
    "User is hurt by 50% of its max HP if it misses.": "如果招式未命中則使用者失去50%最大HP",
    "Raises the user's Attack and accuracy by 1.": "令使用者的攻擊和命中率上升1級",
    "Raises the user's Attack by 1.": "令使用者的攻擊上升1級",
    "30% chance to confuse target. Can't miss in rain.": "30%幾率使目標陷入混亂狀態。在雨天不能被閃避",
    "Breaks the target's protection for this turn.": "這一回合能夠破壞對手的守住狀態",
    "No additional effect. Hits adjacent foes.": "攻擊對手造成傷害攻擊鄰近的寶可夢",
    "Power doubles with each hit. Repeats for 5 turns.": "每一次攻擊威力都會翻倍，連續攻擊5次",
    "10% chance to freeze the target.": "10%幾率使目標陷入冰凍狀態",
    "Charges turn 1. Hits turn 2. 30% burn.": "第一回合充能，第二回合攻擊。有30%幾率使目標灼傷",
    "10% chance to freeze. 10% chance to flinch.": "10%幾率使目標陷入冰凍。10%幾率使目標畏縮",
    "No foe can use any move known by the user.": "對手將無法使用使用者已習得的招式",
    "Destroys the foe(s) Berry/Gem.": "燒毀對手的樹果和寶石",
    "100% chance to burn the target.": "100%使對手陷入灼傷狀態",
    "The target immediately uses its last used move.": "目標會立即使用其上次使用的招式",
    "Normal moves become Electric type this turn.": "下一回合內一般屬性招式會變為電屬性招式",
    "30% chance to lower the target's Defense by 1.": "30%幾率使目標的防禦下降1級",
    "Type varies based on the held Plate.": "招式的屬性會根據所持有的石板變化",
    "1.5x damage if foe holds an item. Removes item.": "拍落對手的物品。對手攜帶物品時本次攻擊的傷害提升50%",
    "Fails unless each known move has been used.": "只有所有習得的其他招式被時出示才能使用該招式",
    "30% chance to burn adjacent Pokemon.": "30%使鄰近的寶可夢陷入灼傷狀態",
    "50% chance to lower the target's accuracy by 1.": "50%幾率使目標的命中率下降1級",
    "1/8 of target's HP is restored to user every turn.": "每回合吸取目標最大生命值的1/8",
    "Lowers the foe(s) Defense by 1.": "使（所有）對手的防禦下降1級",
    "For 5 turns, special damage to allies is halved.": "5回合內，對同伴的特殊攻擊傷害減半",
    "20% chance to lower the target's Defense by 1.": "20%幾率使目標的防禦下降1級",
    "User's next move will not miss the target.": "使用者下一回合對目標的攻擊將不會被閃避",
    "100% chance to lower the target's Speed by 1.": "100%使目標的速度下降1級",
    "For 5 turns, shields user's party from critical hits.": "5回合內，對手的攻擊不會擊中使用者的要害",
    "User faints. Replacement is fully healed, with PP.": "自己瀕死，治癒後備下個的寶可夢的異常狀態並回滿HP/PP",
    "100% chance to lower the target's Attack by 1.": "100%使目標的攻擊下降1級",
    "50% chance to lower the target's Sp. Def by 1.": "50%幾率使目標的特防下降1級",
    "Bounces back certain non-damaging moves.": "將變化招式反彈回去",
    "For 5 turns, all held items have no effect.": "5回合內，場上所有攜帶的道具將不會有效果",
    "This move does not check accuracy.": "攻擊一定會命中",
    "Raises Def, Sp. Def of allies with Plus/Minus by 1.": "提升具有正電/負電特性寶可夢的防禦和特防1級",
    "Hits adjacent Pokemon. Power varies; 2x on Dig.": "攻擊鄰近的寶可夢威力隨機變化，對挖洞的目標傷害翻倍",
    "Protects allies from attacks. First turn out only.": "防止同伴受到攻擊，只能在出場後第一回合使用",
    "Copies a foe at 1.5x power. User must be faster.": "搶先使出對手將要使出的招式使用者必須更快",
    "Lowers target's Attack, Sp. Atk by 2. User faints.": "使目標的攻擊和特攻下降2級，使用者陷入瀕死狀態",
    "If hit by an attack, returns 1.5x damage.": "如果因攻擊而受到傷害，則返還1.5倍的傷害",
    "10% chance to raise the user's Attack by 1.": "10%令使用者的攻擊上升1級",
    "20% chance to raise the user's Attack by 1.": "20%令使用者的攻擊上升1級",
    "Picks a random move.": "根據使用者的運氣隨機使出一個招式",
    "Goes first. Raises user's evasion by 1.": "先制攻擊。提升使用者的閃避率1級",
    "The last move the target used replaces this one.": "這個招式將會變成目標會後使出的招式",
    "Raises the user's evasiveness by 2.": "令使用者的閃避率上升2級",
    "Psychic hits Dark. Evasiveness ignored.": "超能力屬性招式可以命中惡屬性無視閃避率變化",
    "If hit by special attack, returns double damage.": "如果被特殊攻擊傷害，則返還對手兩倍的傷害",
    "User uses the target's last used move against it.": "使用目標最後使用過的招式",
    "30% chance to lower the target's accuracy by 1.": "30%幾率使目標的命中率下降1級",
    "For 5 turns, protects user's party from stat drops.": "在5回合內不會讓對手降低自己隊伍中寶可夢的能力",
    "50% chance to lower the target's Sp. Atk by 1.": "50%幾率使目標的特攻下降1級",
    "5 turns. Can't status,-Dragon power vs grounded.": "5回合內，地上的寶可夢不會陷入異常，受到龍屬性傷害減半",
    "30% chance to lower the target's Sp. Atk by 1.": "30%幾率使目標的特攻下降1級",
    "Ignores the Abilities of other Pokemon.": "無視目標的特性進行攻擊",
    "Heals the user by a weather-dependent amount.": "恢覆使用者的HP，回復量隨天氣變化",
    "100% chance to lower the target's accuracy by 1.": "100%使目標的命中率下降1級",
    "For 5 turns, Electric-type attacks have 1/3 power.": "5回合內，電屬性招式的威力變為原來的1/3",
    "30% chance to lower the foe(s) accuracy by 1.": "30%幾率使目標的命中率下降1級",
    "Type varies based on the held Memory.": "招式屬性和攜帶的記憶碟有關",
    "100% chance to lower the target's Sp. Atk by 1.": "100%下降目標的特攻1級",
    "Raises the user's Sp. Atk by 2.": "令使用者的特攻上升2級",
    "Power and type depends on the user's Berry.": "威力和屬性基於使用者攜帶的樹果",
    "Attack depends on terrain (default Tri Attack).": "攻擊隨著場地變化而變化默認為三重攻擊",
    "Does damage equal to 1/2 target's current HP.": "攻擊造成的傷害為目標剩下HP的50%",
    "40% chance to lower the target's accuracy by 1.": "40%幾率使目標的命中率下降1級",
    "Does damage equal to the user's level.": "招式傷害和使用者的等級相同",
    "A sleeping target is hurt by 1/4 max HP per turn.": "睡眠中的目標每回合失去其1/4最大HP",
    "Lowers the target's Attack and Sp. Atk by 1.": "降低目標的攻擊和特攻1級",
    "Lasts 2-3 turns. Confuses the user afterwards.": "持續2～3回合，亂打一通後陷入混亂",
    "Shares HP of user and target equally.": "平分使用者和目標的HP",
    "Lowers target's Atk, Sp. Atk by 1. User switches.": "降低目標的攻擊和特攻1級，使用者和後備寶可夢替換",
    "Scatters coins.": "土豪來撒錢啦",
    "Power doubles if the user moves after the target.": "如果在目標之後攻擊，威力翻倍",
    "All active Pokemon will faint in 3 turns.": "所有在場的寶可夢將在3回合後倒下",
    "Disappears turn 1. Hits turn 2. Breaks protection.": "第一回合突然消失，第二回合攻擊破壞目標的守住狀態",
    "10% chance to lower the target's Attack by 1.": "10%幾率使目標的攻擊下降1級",
    "50% chance to badly poison the target.": "50%幾率使目標中劇毒",
    "Poisons the foe(s).": "使（所有）敵人中毒",
    "30% chance to poison the target.": "30%幾率使目標中毒",
    "Poisons the target.": "使目標中毒",
    "If the target is an ally, heals 50% of its max HP.": "如果目標是同伴則恢覆其50%最大HP",
    "If using a Fire move, target loses 1/4 max HP.": "如果目標使用了火屬性招式則會失去1/4最大HP",
    "10% chance to freeze the foe(s).": "10%幾率使（所有）對手陷入冰凍狀態",
    "Averages Attack and Sp. Atk stats with target.": "和目標平分攻擊和特攻",
    "Swaps Attack and Sp. Atk stat stages with target.": "交換使用者和目標的基礎攻擊和特攻能力值",
    "Switches user's Attack and Defense stats.": "交換使用者的攻擊和防禦基礎能力值",
    "+ 20 power for each of the user's stat boosts.": "每上升1級能力招式威力增加20點",
    "100% chance to raise the user's Attack by 1.": "100%令使用者的攻擊上升1級",
    "Copies the target's current stat stages.": "複製目標的能力階級變化",
    "5 turns. Grounded: +Psychic power, priority-safe.": "5回合內地上的寶可夢超能力招式威力提升，無視先制招式",
    "Transfers the user's status ailment to the target.": "將使用者的負面狀態轉移給目標",
    "Damages target based on Defense, not Sp. Def.": "計算傷害時按防守方的防禦計算，不是特防",
    "Random damage equal to 0.5x-1.5x user's level.": "傷害為0.5～1.5×使用者的等級",
    "60 power +20 for each of the target's stat boosts.": "威力為60+20×目標的能力階級上升總和",
    "Power doubles if a foe is switching out.": "如果對手替換寶可夢，威力為原來的兩倍",
    "Forces the target to move last this turn.": "使目標在本回合最後行動",
    "Protects allies from priority attacks this turn.": "保護同伴免受先制招式攻擊",
    "Raises the user's Sp. Atk, Sp. Def, Speed by 1.": "提升使用者的特攻特防速度各1級",
    "Raises the user's Attack by 1 if hit during use.": "如果在使用招式時受到攻擊，使用者的攻擊上升1級",
    "For 5 turns, heavy rain powers Water moves.": "5回合內，大雨增加水屬性招式的威力",
    "Charges, then hits foe(s) turn 2. High crit ratio.": "充能，第二回合攻擊（所有）對手容易造成擊中要害",
    "Restores the item the user last used.": "回收使用者上一次使用的道具",
    "For 5 turns, physical damage to allies is halved.": "5回合內，物理攻擊對己方的傷害減半",
    "User becomes the same type as the target.": "使用者變得和目標的屬性相同",
    "User cures its burn, poison, or paralysis.": "使用者能夠治癒自身的灼傷/中毒/麻痹狀態",
    "10% chance to sleep foe(s). Meloetta transforms.": "10%幾率使對手陷入睡眠狀態。變換形態",
    "User sleeps 2 turns and restores HP and status.": "使用者睡眠2回合，回復所有的HP，治癒異常狀態",
    "Power doubles if an ally fainted last turn.": "如果上一回合有同伴倒下，招式威力翻倍",
    "Max 102 power at maximum Happiness.": "當親密值最高的時候達到最大威力102",
    "Type varies based on the user's primary type.": "此招式的屬性將變得和自己的第二屬性相同",
    "30% chance to flinch the foe(s).": "30%使(所有)對手畏縮",
    "User replaces its Ability with the target's.": "將自身的特性變得和目標一樣",
    "The user and the target trade Abilities.": "使用者和目標交換特性",
    "Heals 50% HP. Flying-type removed 'til turn ends.": "回復50%最大HP，在回合結束前失去飛行屬性",
    "Power doubles if others used Round this turn.": "如果有其他寶可夢在這一回合使用了輪唱，招式威力翻倍",
    "50% chance to burn the target. Thaws user.": "50%幾率使目標陷入灼傷狀態能令使用者解除冰凍狀態",
    "For 5 turns, protects user's party from status.": "5回合內，保護己方所有寶可夢免受異常狀態",
    "For 5 turns, a sandstorm rages.": "5回合內，天氣為沙暴天氣",
    "30% chance to burn the target. Thaws target.": "30%幾率使目標陷入灼傷狀態。令使用者解除冰凍狀態",
    "Lowers the target's Defense by 2.": "使目標的防禦下降2級",
    "Effect varies with terrain. (30% paralysis chance)": "效果隨場地變化（默認30%麻痹幾率）",
    "40% chance to lower the target's Sp. Def by 2.": "40%幾率使目標的特防下降2級",
    "20% chance to lower the target's Sp. Def by 1.": "20%幾率使目標的特防下降1級",
    "OHKOs non-Ice targets. Fails if user's lower level.": "秒殺非冰屬性寶可夢。如果使用者比目標等級低，使用失敗",
    "Lowers Def, SpD by 1; raises Atk, SpA, Spe by 2.": "降低防禦特防1級；提升攻擊、特攻和速度各2級",
    "User must take physical damage before moving.": "若受到對手物理攻擊，就攻擊目標造成傷害",
    "Raises the user's Speed by 2 and Attack by 1.": "提升使用者的速度2級，攻擊1級",
    "User restores 1/2 its max HP; 2/3 in Sandstorm.": "使用者回復1/2最大HP，沙暴時回復2/3最大HP",
    "The target's Ability becomes Simple.": "目標的特性變為單純",
    "Permanently copies the last move target used.": "抄襲目標最後使用的招式",
    "Raises user's Defense by 1 on turn 1. Hits turn 2.": "第一回合提升1級防禦，第二回合攻擊",
    "Charges, then hits turn 2. 30% flinch. High crit.": "第一回合充能第二回合攻擊，容易擊中要害",
    "User and foe fly up turn 1. Damages on turn 2.": "使用者和對手第一回合一起上天，第二回合給對手造成傷害",
    "Can hit Pokemon using Bounce, Fly, or Sky Drop.": "可以擊中使用彈跳，飛空，自由落體的寶可夢",
    "User must be asleep. Uses another known move.": "使用者必須處於睡眠狀態。使用一個已習得的招式",
    "10% chance to poison adjacent Pokemon.": "10%使鄰近的寶可夢中毒",
    "Removes the target's Ground immunity.": "消除目標對地上屬性的免疫力",
    "Power doubles if target is paralyzed, and cures it.": "如果目標處於麻痹狀態，威力翻倍，然後治癒其麻痹狀態",
    "40% chance to poison the target.": "40%幾率使目標陷入中毒狀態",
    "100% chance to lower the foe(s) Sp. Atk by 1.": "100%使(所有)對手的特攻下降1級",
    "User steals certain support moves to use itself.": "使用者竊取目標的有益招式化為己用",
    "User must be asleep. 30% chance to flinch target.": "睡眠時才能使用。30%幾率使目標畏縮",
    "Steals target's boosts before dealing damage.": "竊取目標的能力階級變化",
    "Swaps Speed stat with target.": "和目標交換速度",
    "Protects from moves. Contact: loses 1/8 max HP.": "保護自己免受招式影響，接觸到的對手會損失1/8最大HP",
    "Changes the target's type to Water.": "將目標的屬性變為水屬性",
    "Charges turn 1. Hits turn 2. No charge in sunlight.": "第一回合充能第二回合攻擊，在大晴天不用充能",
    "Always does 20 HP of damage.": "必定能造成20點傷害",
    "The target is cured of its burn.": "目標的灼傷狀態會被治癒",
    "Hurts grounded foes on switch-in. Max 3 layers.": "傷害出場時站在地面上的對手。最多累積3層",
    "More power with more uses of Stockpile.": "能量積蓄得越多，威力越大",
    "Lowers the PP of the target's last move by 4.": "使目標最後使用的招式PP減少4點",
    "Target's foes' moves are redirected to it this turn.": "所有對手使用的作用範圍為單體選擇的招式都會攻向使用者",
    "Hurts foes on switch-in. Factors Rock weakness.": "傷害交換出的站在地面上的對手，計算岩石屬性相克",
    "10% chance to raise the user's Defense by 1.": "10%令使用者的防禦上升1級",
    "Lowers Speed of grounded foes by 1 on switch-in.": "降低對手替換出的站在地面上的寶可夢的速度1級",
    "Raises user's Defense, Sp. Def by 1. Max 3 uses.": "提升使用者的1級防禦和特防最多累積3次",
    "100% chance to paralyze the target.": "100%使目標陷入麻痹狀態",
    "10% chance to cause the target to fall asleep.": "10%使目標陷入睡眠狀態",
    "Power doubles if the user's last move failed.": "如果使用者的上一次攻擊使用失敗，此招式威力翻倍",
    "User heals HP=target's Atk stat. Lowers Atk by 1.": "使用者回復和目標當前攻擊數值相同的HP。降低目標的攻擊1級",
    "Lowers the foe(s) Speed by 2.": "降低（所有）對手的速度2級",
    "Usually goes first. Fails if target is not attacking.": "先制攻擊，如果目標不使用攻擊招式的話則使用失敗",
    "For 5 turns, intense sunlight powers Fire moves.": "5回合內，陽光增加了火屬性招式的威力",
    "Lowers the user's Attack and Defense by 1.": "降低使用者的攻擊和防禦各1級",
    "Raises the target's Attack by 2 and confuses it.": "提升目標的攻擊2級且使其混亂",
    "Heals the user based on uses of Stockpile.": "回復量取決於蓄力的次數",
    "User switches its held item with the target's.": "使用者和目標交換道具",
    "Raises the user's Attack by 2.": "令使用者的攻擊提升2級",
    "Hits adjacent Pokemon sharing the user's type.": "攻擊和使用者有相同屬性的寶可夢",
    "Raises the user's Sp. Atk by 3.": "提升使用者的特攻3級",
    "For 4 turns, allies' Speed is doubled.": "4回合內同伴的速度翻倍",
    "Type varies based on the held Drive.": "屬性取決於所攜帶的卡帶",
    "Confuses adjacent Pokemon.": "使周圍的寶可夢陷入混亂狀態",
    "For 3 turns, target floats but moves can't miss it.": "3回合內，目標漂浮起來，但招式一定會命中它",
    "Grounds adjacent foes. First hit neutral on Flying.": "擊落周圍的寶可夢，第一擊可以擊中飛行屬性寶可夢",
    "Hits adjacent foes. Prevents them from switching.": "攻擊周圍的對手阻止他們替換下場",
    "For 2 turns, the target cannot use sound moves.": "2回合內目標無法使用聲音的招式",
    "10% chance to paralyze. 10% chance to flinch.": "10%幾率使目標麻痹。10%幾率使目標畏縮",
    "10% chance to paralyze the target.": "10%幾率使目標麻痹",
    "Lowers the target's Attack and Defense by 1.": "使目標的攻擊和防禦下降1級",
    "Inverts the target's stat stages.": "將目標的全部能力階級數值變為其相反數",
    "Target can't select the same move twice in a row.": "目標不能連續使用同一招式",
    "Poisons grounded foes on switch-in. Max 2 layers.": "使替換上場的對手中毒，最多累積2次",
    "Lowers the target's Speed by 1 and poisons it.": "使目標速度下降1級並且中毒",
    "Copies target's stats, moves, types, and Ability.": "複製目標的能力階級變化，招式，屬性，特性",
    "20% chance to paralyze or burn or freeze target.": "20%幾率使目標麻痹或灼傷或冰凍",
    "Adds Ghost to the target's type(s).": "使目標具有幽靈屬性",
    "Hits 3 times. Each hit can miss, but power rises.": "連續攻擊3次。每一次都可以被閃避，但擊中的話威力會上升",
    "More power the fewer PP this move has left.": "招式PP越少威力越大",
    "Hits 2 times. Each hit has 20% chance to poison.": "連續攻擊2次，每一次都有20%的幾率使對手中毒",
    "20% chance to flinch the foe(s).": "20%使(所有)對手畏縮",
    "User switches out after damaging the target.": "使用者在攻擊目標後會替換後備寶可夢上場",
    "Lasts 3 turns. Active Pokemon cannot fall asleep.": "持續3回合，在場上的寶可夢不會陷入睡眠狀態",
    "Lowers the user's Defense, Sp. Def, Speed by 1.": "降低使用者的防禦特防和速度各1級",
    "Power doubles if the target is poisoned.": "如果目標已經中毒，招式威力翻倍",
    "This move does not check accuracy. Goes last.": "招式一定會命中，最後行動",
    "Has 33% recoil. 10% chance to paralyze target.": "有33%的反彈傷害，10%幾率使目標陷入麻痹狀態",
    "Power doubles if target is asleep, and wakes it.": "如果目標處於睡眠狀態，威力翻倍，然後拍醒它",
    "Use with Grass or Fire Pledge for added effect.": "和草或火之誓言同時使用會有特效",
    "For 5 turns, Fire-type attacks have 1/3 power.": "3回合內，火屬性攻擊威力為原來的1/3",
    "Power doubles and type varies in each weather.": "有天氣時招式威力會翻倍，屬性會變化",
    "Protects allies from multi-target moves this turn.": "保護所有同伴免受群體攻擊的影響",
    "Burns the target.": "使目標陷入灼傷狀態",
    "Next turn, 50% of the user's max HP is restored.": "下一回合使用者回復50%最大HP",
    "For 5 turns, all Defense and Sp. Def stats switch.": "5回合內所有防禦和特防基礎值交換",
    "Raises the user's Attack and Sp. Atk by 1.": "提升使用者的攻擊特攻各1級",
    "The target's Ability becomes Insomnia.": "目標的特性變為不眠",
    "Puts the target to sleep after 1 turn.": "下一回合目標會陷入睡眠狀態",
    "User loses 50% max HP. Hits adjacent Pokemon.": "使用者損失50%最大HP，攻擊周圍全體寶可夢",
    "Physical if user's Atk > Sp. Atk. Ignores Abilities.": "無視目標的特性。攻擊數值高於特攻時，變為物理招式",
    "Raises the user's Atk/Def/SpAtk/SpDef/Spe by 1.": "使用者全能力提升1級",
    "Ends the effects of Terrain.": "清除場上的場地",
    "100% chance to lower the target's Sp. Def by 1.": "降低目標1級特防",
    "Morpeko: Electric; Hangry: Dark; 100% +1 Spe.": "提升1級速度，滿腹花紋時為電屬性，空腹花紋時為惡屬性",
    "Summons Reflect.": "使用後己方處於反射壁狀態",
    "Double damage against Dynamax/Gigantamax.": "對極巨化/超極巨化狀態下的寶可夢傷害翻倍",
    "Uses Def instead of Atk in damage calculation.": "以使用者的防禦而不是攻擊來計算傷害",
    "Double power if the user moves first.": "如果使用者先攻擊，威力翻倍",
    "100% chance to lower adjacent foes' Atk by 1.": "降低對手全體1級攻擊",
    "100% chance lower adjacent Pkmn Speed by 1.": "令目標的速度降低1級",
    "100% chance to paralyze the foe.": "令對手麻痹",
    "+1 SpD, user's Electric move next turn 2x power.": "提升1級特防，下一回合電屬性招式威力2倍",
    "User loses 33% max HP. Raises all stats by 1.": "損失33%最大HP，提升所有能力1級",
    "Resets all of the target's stat stages to 0.": "使用後全場能力階級歸零",
    "Raises user's Attack, Defense, accuracy by 1.": "攻擊，防禦，命中提升1級",
    "Nullifies the foe(s) Ability if the foe(s) move first.": "如果目標在該回合已使用過招式，使目標陷入無特性狀態",
    "Switches sides of field effects": "交換雙方場地的狀態效果",
    "Curses if Ghost, else -1 Spe, +1 Atk, +1 Def.": "幽靈屬性使其詛咒，反之速度降低1級，攻擊和防禦提升1級",
    "Darkrai: Causes the foe(s) to fall asleep.": "使對方全體陷入睡眠狀態，僅在使用者為達克萊伊時奏效",
    "Raises the target's Atk and Sp. Atk by 2.": "提升使用者攻擊和特攻2級",
    "Hits twice. 30% chance to flinch.": "攻擊兩次，每次30%幾率令目標畏縮",
    "Singles: Hits twice. Doubles: Hits each once.": "單打對戰攻擊兩次，雙打對戰對兩只寶可夢分別攻擊一次",
    "Deals 40 HP of damage to the target.": "造成40點固定傷害",
    "Hits adjacent Pokemon. Double damage on Dig.": "攻擊周圍全體寶可夢，對挖洞狀態的目標傷害翻倍",
    "Target repeats its last move for its next 3 turns.": "目標接下來的 3 回合，只能使用其最後使用的招式",
    "User survives attacks this turn with at least 1 HP.": "本回合結束時，自身保留至少1點HP",
    "Summons Light Screen.": "使用後己方處於光牆狀態",
    "Causes the target to fall asleep.": "使目標陷入睡眠狀態",
    "5 turns. Grounded: +Grass power, +1/16 max HP.": "使場地變成青草場地，持續5回合",
    "Power doubles during Bounce, Fly, and Sky Drop.": "如果目標處於飛翔狀態，威力翻倍",
    "Raises the user's and ally's Attack by 1.": "使用者和同伴的攻擊提升1級",
    "Hoopa-U: Lowers user's Def by 1; breaks protect.": "解放胡帕自身的防禦降低1級，無視守住",
    "Traps/grounds user; heals 1/16 max HP per turn.": "進入紮根狀態，無法交換。每回合結束時回復1/16最大HP",
    "Prevents the user and the target from switching out.": "使用者和目標都無法交換",
    "Protects from attacks. Contact: lowers Atk by 1.": "完全抵擋對手的攻擊。如果對手使用了接觸類招式，攻擊降低1級",
    "Until the end of the next turn, user's moves crit.": "下回合結束前，招式必定會擊中要害",
    "Heals the user (and allies) by 1/4 amount.": "回復使用者和同伴1/4最大HP",
    "Changes the target's type to Psychic.": "使目標變為超能力屬性",
    "Does many things turn 1. Can't move turn 2.": "使用後下回合不能行動",
    "For 5 turns, the user has immunity to Ground.": "5回合內使自身進入電磁飄浮狀態，免疫地面屬性招式",
    "Damage doubles if the target used Minimize.": "對變小的目標傷害翻倍",
    "User/allies: +1 Spe. BP scales w/ base move.": "提高我方全體的速度",
    "Foes: -1 Sp.Def. BP scales with base move's BP.": "降低對手全體的特防",
    "Sets Sun. BP scales with base move's BP.": "使天氣轉為大晴天",
    "Foes: -1 Sp.Atk. BP scales with base move's BP.": "降低對手全體的特攻",
    "Sets Rain. BP scales with base move's BP.": "使天氣轉為下雨",
    "Prevents all moves from affecting the user this turn.": "擋下包括極巨招式在內的所有招式",
    "Sets Hail. BP scales with base move's BP.": "使天氣轉為冰雹",
    "User/allies: +1 Atk. BP scales w/ base move.": "提高我方全體的攻擊",
    "Sets Electric Terrain. BP scales with base move's BP.": "將場地變成電氣場地",
    "Sets Psychic Terrain. BP scales with base move's BP.": "將場地變成精神場地",
    "User/allies: +1 SpA. BP scales w/ base move.": "提高我方全體的特攻",
    "Sets Grassy Terrain. BP scales with base move's BP.": "將場地變成青草場地",
    "Foes: -1 Defense. BP scales with base move's BP.": "降低對手全體的防禦",
    "User/allies: +1 SpD. BP scales w/ base move.": "提高我方全體的特防",
    "Sets Sandstorm. BP scales with base move's BP.": "使天氣轉為沙暴",
    "Sets Misty Terrain. BP scales with base move's BP.": "將場地變成薄霧場地",
    "User/allies: +1 Def. BP scales w/ base move.": "提高我方全體的防禦",
    "Foes: -1 Speed. BP scales with base move's BP.": "降低對手全體的速度",
    "Foes: -1 Attack. BP scales with base move's BP.": "降低對手全體的攻擊",
    "Raises all stats by 1 (not acc/eva). Traps user.": "所有能力提升1級。使用者進入無法逃走狀態",
    "Protects from attacks. Contact: lowers Def by 2.": "抵擋對手的攻擊。如果對手使用了接觸類招式，防禦降低2級",
    "Foe can't switch. Lowers Def and SpD every turn.": "目標無法交換，每回合降低防禦和特防",
    "Max happiness: 102 power. Can't miss.": "最大親密度對應威力102，不會落空",
    "40, 80, 120 power, or heals target 1/4 max HP.": "威力隨機為40，80，120或者回復目標1/4最大HP",
    "Cures target's status; heals user 1/2 max HP if so.": "治癒目標的異常狀態。成功治癒：使用者回復1/2最大HP",
    "Free user from hazards/bind/Leech Seed; +1 Spe.": "提升1級速度，移除己方場地上的入場狀態/束縛/寄生種子",
    "Raises Atk/Sp. Atk of grounded Grass types by 1.": "所有的地面上的草屬性寶可夢的攻擊，特攻提升1級",
    "Summons Leech Seed.": "使用後對方處於寄生種子狀態",
    "100% chance to burn the foe.": "令對手陷入灼傷狀態",
    "30% chance to burn the target.": "30%幾率使目標陷入灼傷狀態",
    "User loses 1/4 of its max HP.": "每次攻擊自身損失1/4最大HP",
    "Consumes berry and raises the user's Def. by 2.": "食用樹果並且提升使用者防禦2級",
    "User takes 1/4 its max HP to put in a substitute.": "使用1/4最大HP制造一個替身",
    "Causes the target to become confused.": "使目標混亂陷入狀態",
    "Hits adjacent Pokemon. Double damage on Dive.": "攻擊周圍全體寶可夢，對潛水狀態的目標傷害翻倍",
    "Lowers the foe(s) evasiveness by 2.": "降低目標閃避率2級",
    "Target gets -1 Spe and becomes weaker to Fire.": "目標速度降低1級並且增加火屬性弱點",
    "Target can't use status moves its next 3 turns.": "使目標接下來的3回合無法使用變化招式",
    "All active Pokemon consume held Berries.": "在場上的寶可夢都會吃掉自己攜帶的樹果",
    "User switches out.": "使用者逃離戰鬥",
    "30% chance to paralyze. Can't miss in rain.": "30%幾率使目標麻痹，雨天下不會落空",
    "Badly poisons the target. Poison types can't miss.": "使目標陷入劇毒狀態，毒屬性寶可夢使用不會落空",
    "Goes last. For 5 turns, turn order is reversed.": "接下來5回合，速度慢的寶可夢先行動。優先級最低",
    "Lowers Atk/Sp. Atk/Speed of poisoned foes by 1.": "令中毒的目標的攻擊，特攻和速度降低1級",
    "Usually goes first. Hits 2-5 times in one turn.": "先制攻擊，攻擊2～5次",
    "Nearly always goes first. Always crits.": "先制攻擊，必定擊中要害",
    "Foes: SLP/PSN/PAR. BP scales with base move.": "使對手全體陷入中毒、麻痹或睡眠其中一種異常狀態",
    "Traps/damages foes. BP scales w/ base move.": "令對手無法交換並持續受到傷害",
    "User side: Focus Energy. BP scales w/ base move.": "自己進入易中要害狀態",
    "Infatuates opponents. BP scales with base move.": "讓對方所有性別不同的寶可夢陷入著迷狀態",
    "Foe: Lowers PP of last move. BP scales w/ base move.": "減少對手最後使用的招式的PP",
    "Heals user and allies. BP scales with base move.": "回復我方所有寶可夢的HP",
    "Foes: -2 Speed. BP scales with base move's BP.": "大幅降低對手的速度",
    "Confuses foes. BP scales with base move's BP.": "使對手全體陷入混亂",
    "Summons Gravity. BP scales with base move.": "使用後場地處於重力狀態",
    "Poisons opponents. BP scales with base move.": "使對手所有寶可夢陷入中毒狀態",
    "Restores user-side berries. BP scales w/ base move.": "獲得使用過的樹果",
    "Summons Aurora Veil. BP scales w/ base move.": "使己方場地進入極光幕",
    "Confuses opponents. BP scales with base move.": "讓對手陷入混亂狀態",
    "Afflicts foes with Yawn. BP scales w/ base move.": "使目標陷入瞌睡狀態",
    "Sets Steel entry hazard. BP scales w/ base move.": "對方場地處於超極巨鋼鐵陣法狀態，交換上場損失1/8最大HP×鋼屬性相性",
    "Sets Stealth Rock. BP scales w/ base move's BP.": "使對方場地處於隱形岩狀態",
    "Foe(s): Par/Psn. BP scales with base move's BP.": "讓對手所有寶可夢陷入中毒或麻痹狀態",
    "Foe(s): -1 evasion. BP scales with base move's BP.": "降低對手的閃避率1級",
    "Traps foe(s). BP scales with base move's BP.": "使對方全體陷入無法逃跑狀態",
    "Damages foes for 4 turns. BP scales w/ base move.": "在4回合內持續對對方的寶可夢造成傷害",
    "Paralyzes foe(s). BP scales with base move's BP.": "使對方全體陷入麻痹狀態",
    "Clears field. BP scales with base move's BP.": "消除反射壁、光牆、撒菱、超極巨鋼鐵陣法和場地型狀態的效果",
    "Applies Torment to foes. BP scales with base move.": "使對手陷入無理取鬧狀態",
    "User loses 50% max HP.": "使用後損失50%最大HP",
    "If hit by Normal/Fighting move, deals 2x damage.": "被一般/格鬥屬性招式擊中的傷害將以2倍返還給對手",
    "Can't move next turn if target or sub is not KOed.": "攻擊令對方陷入瀕死時寶可夢下回合不會被暫停一次",
    "While active, the user's Defense is doubled.": "使自身進入反射壁狀態，反射壁狀態時防禦力翻倍",
    "33% chance to lower the target's Special by 1.": "33%幾率令目標的特攻降低1級",
    "Damage = user's level. Can hit Ghost types.": "給予對手和自己等級相同的傷害。對幽靈屬性有效果",
    "User takes 1/4 its max HP to put in a Substitute.": "使用者需要最大HP的1/4來制造一個替身",
    "Waits 2-3 turns; deals double the damage taken.": "等待2-3回合，之後將受到的傷害雙倍奉還給對手",
    "For 0-7 turns, disables one of the target's moves.": "阻礙對手行動，之前使出的招式將在0-7回合內無法使用",
    "Random move known by the target replaces this.": "招式替換為目標隨機一個招式",
    "Random damage from 1 to (user's level*1.5 - 1).": "造成使用者等級×（1～1.5之間隨機值）的固定傷害",
    "Lasts forever. Raises user's Attack by 1 when hit.": "使自身進入憤怒狀態，處於憤怒狀態受到招式傷害時攻擊力上升1等級",
    "Charges turn 1. Hits turn 2.": "第1回合蓄力，第2回合攻擊對手",
    "Badly poisons the target.": "令對手陷入劇毒狀態。隨著回合的推進，中毒傷害會增加",
    "While active, user's Special is 2x when damaged.": "使自身進入光牆狀態，受到特殊招式時傷害減半",
    "33% chance to lower the target's Speed by 1.": "33%幾率令目標的速度降低1級",
    "Lowers the target's Defense by 1.": "令目標的防禦降低1級",
    "Prevents the target from moving for 2-5 turns.": "使目標陷入束縛狀態，束縛狀態持續2～5回合且不能換下",
    "33% chance to lower the target's Attack by 1.": "33%幾率令目標的攻擊降低1級",
    "Never misses, even against Dig and Fly.": "攻擊必定會命中，即使對手使用挖洞和飛翔",
    "Target's Def halved during damage. User faints.": "將目標的防禦能力值減半計算，自身陷入瀕死狀態",
    "Damage = user's level. Can hit Normal types.": "給予對手和自己等級相同的傷害。對一般屬性有效",
    "Lasts 3-4 turns. Confuses the user afterwards.": "持續3～4回合攻擊對手。冷靜下來後會混亂",
    "Deals 65535 damage. Fails if target is faster.": "造成65535傷害。但對速度高於自身的目標無效",
    "Quarters the user's chance for a critical hit.": "使自身進入易中要害狀態",
    "Lowers the target's Speed by 1.": "令目標的速度降低1級",
    "33% chance to lower the target's Defense by 1.": "33%幾率令目標的防禦降低1級",
    "Raises the user's Special by 1.": "令使用者的特攻提升1級",
    "20% chance to poison the target.": "有20%的幾率使目標陷入中毒狀態",
    "Resets all stat changes. Removes foe's status.": "消除所有能力階級變化並重置所有狀態",
    "While active, user is protected from stat drops.": "白霧狀態下能力變化不會被對方的變化招式降低",
    "Raises the user's Special by 2.": "令使用者的特殊提升2級",
    "User takes 1 HP of damage if it misses.": "如果招式未命中、或沒有產生效果，自身承受1點反作用力傷害",
    "Copies target's stats, moves, types, and species.": "複製目標的招式、屬性、種族值",
    "Ally: Crit ratio +1, or +2 if ally is Dragon type.": "令所有同伴的擊中要害率提升1級。龍屬性同伴改為提升2級",
    "Raises Sp. Atk by 1, hits turn 2. Rain: no charge.": "第一回合進行蓄力，在第二回合發動招式。雨天時不需蓄力",
    "If Terastallized: Phys. if Atk > SpA, type = Tera.": "太晶化後變為太晶屬性。此時若攻擊大於特攻，變為物理招式",
    "Bypasses protection without breaking it.": "能無視對方守住類招式",
    "Hits twice. This move does not check accuracy.": "一回合內連續攻擊2次。攻擊必定會命中",
    "+1 SpD, user's next Electric move 2x power.": "使下一次電屬性招式的威力加倍。並提升特防1級",
    "For 2 turns, the target is prevented from healing.": "使目標在2回合內陷入回復封鎖狀態",
    "Has a 30% chance this move's power is doubled.": "30%幾率造成雙倍傷害",
    "Target's Speed is lowered by 1 stage for 3 turns.": "在包含當前回合的3回合內，每回合結束時降低1級速度",
    "High critical hit ratio. Type depends on user's form.": "容易擊中要害。該招式的屬性會根據使用者的形態而改變",
    "20% burn. Recovers 50% dmg dealt. Thaws foe(s).": "20%幾率灼傷。使用後解凍，50%的傷害轉化為自身的HP",
    "100% confuse target that had a stat rise this turn.": "令該回合內能力變化曾提高過的寶可夢陷入混亂狀態",
    "100% flinch. Fails unless target using priority.": "令目標畏縮。目標使出先制攻擊時才能使用成功",
    "Terapagos-Stellar: Stellar type, hits both foes.": "星晶化後招式屬性變為星晶，造成無屬性傷害。此時若使用者的攻擊大於特攻，則該招式變為物理招式",
    "Protects from damaging attacks. Contact: burn.": "進入守住狀態，這期間受到接觸類招式時令攻擊方陷入灼傷",
    "10% chance to freeze foe(s). Can't miss in Snow.": "10%幾率使目標冰凍。在冰雹或下雪天氣下一定會命中",
    "Deals 1.3333x damage with supereffective hits.": "招式出現效果絕佳時威力提升33%",
    "User takes sure-hit 2x damage until its next turn.": "下次使出招式之前，任何以你為目標的招式必中且傷害翻倍",
    "Lowers the user's Sp. Atk by 1. Hits foe(s).": "令使用者的特攻降低1級",
    "Cannot be selected the turn after it's used.": "無法連續使用",
    "30% confusion. User loses 50% max HP if miss.": "30%幾率使其混亂。如果未命中，使用者失去50%最大HP",
    "+50 power for each time a party member fainted.": "我方每有一只寶可夢陷入過瀕死狀態，招式的威力提升50",
    "Curly|Droopy|Stretchy eaten: +1 Atk|Def|Spe.": "上弓提升攻擊1級，下垂提升防禦1級，平挺提升速度1級",
    "Raises target's Atk by 2 and lowers its Def by 2.": "令目標提升2級攻擊，降低2級防禦",
    "Deals 1/8 max HP each turn; 1/4 on Steel, Water.": "令目標每回合損失1/8最大HP;鋼/水屬性寶可夢改為損失1/4",
    "User and ally swap positions; using again can fail.": "與己方目標交換位置。同一回合內，連續使用會失敗",
    "For 5 turns, damage to allies halved. Snow only.": "5回合內，我方受到的招式傷害減半。冰雹或下雪時才能使用",
    "50% psn. 2x power if target already poisoned.": "30%幾率使目標中毒。如果目標已中毒或劇毒，威力翻倍",
    "Sets a layer of Spikes on the opposing side.": "令目標場地變為撒菱狀態",
    "Starts Snow. User switches out.": "和後備寶可夢替換並使天氣變為持續5回合的雪景",
    "50% chance to sleep, poison, or paralyze target.": "50%的幾率使目標陷入中毒狀態、麻痹狀態或睡眠狀態",
    "Poisons foes, frees user from hazards/bind/leech.": "使目標陷入中毒狀態。移除己方場地上的入場生效狀態/束縛/寄生種子",
    "100% chance to raise user Speed by 1. High crit.": "令使用者的速度提升1級。容易擊中要害",
    "During Electric Terrain: 1.5x power.": "場地為電氣場地時，威力提升50%",
    "Cures user's status, raises Sp. Atk, Sp. Def by 1.": "治癒使用者的異常狀態。提升1級特攻和特防",
    "During Sunny Day: 1.5x damage instead of half.": "晴天下威力提升50%而不是減半",
    "User's Electric type: typeless; must be Electric.": "使用者是電系時，使用後自身電屬性變成無屬性",
    "30% to lower foe(s) Speed by 1. Rain: can't miss.": "30%幾率使目標降低1級速度。雨天下必定命中",
    "20% chance to paralyze foe(s). Rain: can't miss.": "20%的幾率使目標陷入麻痹狀態。雨天下必定命中",
    "20% chance to burn foe(s). Can't miss in rain.": "20%的幾率使目標陷入灼傷狀態。雨天下必定命中",
    "30% chance to lower the foe(s) Attack by 1.": "30%幾率令目標的攻擊降低1級",
    "High crit. Target: 50% -1 Defense, 30% flinch.": "易中要害。50%幾率令其防禦降低1級，30%幾率畏縮",
    "30% burn. 2x power if target is already statused.": "30%幾率使目標灼傷。如果目標處於異常狀態，威力翻倍",
    "+50 power for each time user was hit. Max 6 hits.": "使用者每受到一次攻擊，招式的威力增加50，最大為350。",
    "Always results in a critical hit; no accuracy check.": "必定會命中，且會擊中要害",
    "+2 Attack, Sp. Atk, Speed for 1/2 user's max HP.": "使用者損失1/2最大HP,提升攻擊、特攻和速度各2級",
    "User +1 Atk, Spe. Clears all substitutes/hazards.": "使用者提升1級攻擊和速度。移除雙方所有替身/入場生效狀態",
    "User and ally's Abilities become target's Ability.": "將自身和同伴的特性轉變為目標的特性",
    "Sets Stealth Rock on the target's side.": "令目標場地進入隱形岩狀態",
    "Raises the user's Attack, Defense, Speed by 1.": "令使用者的攻擊、防禦和速度提升1級",
    "Protects allies from damaging attacks. Turn 1 only.": "保護我方不受到傷害招式的影響。出場後立刻使出才能成功",





    //  特性效果

    "This Pokemon's moves cannot be redirected to a different target by any effect.": "攻擊原本選定的目標",
    "This Pokemon is immune to sound-based moves, unless it used the move.": "不受聲音的招式影響",
    "This Pokemon's moves cannot be redirected to a different target by any effect.": "攻擊原本選定的目標",
    "This Pokemon's allies have the power of their moves multiplied by 1.3.": "己方其他寶可夢的招式威力提高30%",
    "Making contact with this Pokemon starts the Perish Song effect for it and the attacker.": "受到接觸類招式攻擊時，3個回合後雙方都會失去戰鬥能力",
    "This Pokemon's types change to match the Terrain. Type reverts when Terrain ends.": "該特性的寶可夢會因當前的場地不同而改變屬性",
    "If Morpeko, it changes between Full Belly and Hangry Mode at the end of each turn.": "每回合都會改變自身的樣子，氣場輪會根據不同形態變為不同的屬性",
    "30% chance this Pokemon's ally has its status cured at the end of each turn.": "每回合結束有30%的幾率治癒一名同伴的異常狀態",
    "This Pokemon eats Berries at 1/2 max HP or less instead of their usual 1/4 max HP.": "1/2最大HP時就可以食用樹果，而不是通常的1/4",
    "Prevents Explosion/Mind Blown/Misty Explosion/Self-Destruct/Aftermath while active.": "當該特性的寶可夢在場時，自爆、大爆炸、驚爆大頭和薄霧炸裂會使用失敗",
    "Causes sleeping foes to lose 1/8 of their max HP at the end of each turn.": "使對手的處於睡眠狀態的寶可夢每回合損失最大HP的1/8",
    "If this Pokemon is Palafin, it changes to Hero Mode when it switches out.": "回到同行隊伍後，會變為全能形態",
    "If this Pokemon is hit by a wind move or Tailwind begins, it becomes charged.": "受到風的招式攻擊時，會變為充電狀態",
    "This Pokemon's Defense is raised 2 stages if hit by a Fire move; Fire immunity.": "受到火屬性的招式攻擊時，不會受到傷害，而是會提升2級防禦",
    "Pokemon making contact with this Pokemon have their Ability swapped with this one.": "受到接觸類招式攻擊時，自己獲得攻擊方的特性，同時攻擊方的特性變為遊魂",
    "This Pokemon's contact moves ignore the target's protection, except Max Guard.": "使用接觸類招式時，能無視對方除極巨防壁外守住類狀態的效果",
    "When this Pokemon is hit by an attack, Toxic Spikes are set around the attacker.": "受到物理招式的傷害時，會在對手腳下散布毒菱",
    "At 1/3 or less of its max HP, this Pokemon's offensive stat is 1.5x with Water attacks.": "當HP小於1/3時，水屬性招式的威力提升50%",
    "This Pokemon's Attack is raised by 1 stage when hit by Fire moves; it can't be burned.": "受到火屬性的招式攻擊時，攻擊提高1級，且不會陷入灼傷狀態",
    "This Pokemon and its allies cannot fall asleep; those already asleep do not wake up.": "使己方免疫睡眠狀態",
    "At 1/3 or less of its max HP, this Pokemon's offensive stat is 1.5x with Bug attacks.": "當HP小於1/3時，蟲屬性招式的威力提升50%",
    "This Pokemon's Attack and Special Attack raise by 10% per fainted teammate.": "每有一只我方寶可夢被打倒，都將使物攻和特攻提升10%",
    "This Pokemon cannot lose its held item due to another Pokemon's Ability or attack.": "攜帶道具不受其他寶可夢影響",
    "This Pokemon's slicing attacks have 1.5x power.": "切割類招式威力提升50%",
    "When this Pokemon is hit by an attack, the effect of Grassy Terrain begins.": "受到攻擊時轉為青草場地",
    "On switch-in, the effects of Aurora Veil, Light Screen, and Reflect end for both sides.": "出場時清除雙方的光牆、反射壁和極光幕",
    "When this Pokemon is hit by an attack, the effect of Sandstorm begins.": "受到攻擊時轉為沙暴天氣",
    "When this Pokemon eats certain Berries, the effects are doubled.": "食用樹果的效果變為原來的2倍",
    "This Pokemon has a 30% chance to move first in its priority bracket with attacking moves.": "30%幾率在相同優先度下先出手",
    "This Pokemon and its allies are protected from opposing priority moves.": "讓對方無法使出會影響己方的先制招式",
    "If Electric Terrain is active or Booster Energy held, the highest stat is 1.5x.": "攜帶著驅勁能量或在電氣場地上時，數值最高的能力提升50%",
    "This Pokemon cannot be statused; Ghost power against it is halved.": "不會陷入異常狀態，幽靈屬性招式傷害減半",
    "If Sunny Day is active or Booster Energy held, the highest stat is 1.5x.": "攜帶著驅勁能量或天氣為晴朗時，數值最高的能力提升50%",
    "This Pokemon and its allies cannot be poisoned. On switch-in, cures poisoned allies.": "使己方免疫中毒狀態，上場時還可治療己方的中毒狀態",
    "At 1/3 or less of its max HP, this Pokemon's offensive stat is 1.5x with Grass attacks.": "當HP小於1/3時，草屬性招式的威力提升50%",
    "This Pokemon is immune to powder moves, Sandstorm or Hail damage, Effect Spore.": "免疫粉末類招式，不受沙暴和冰雹影響",
    "This Pokemon's Status moves have lowered priority and ignore their targets' Abilities.": "必定後手使出變化招式，但不受對手特性影響",
    "If this Pokemon's stat stages would be lowered, the attacker's are lowered instead.": "反彈來自對方招式或特性的能力下降效果",
    "If this Pokemon has a non-volatile status condition, its Defense is multiplied by 1.5.": "異常狀態時防禦提升50%",
    "Pokemon making contact with this Pokemon have their Ability changed to Lingering Aroma.": "接觸到具有此特性的寶可夢的寶可夢的特性將改為甩不掉的氣味",
    "When hit after Surf/Dive, attacker takes 1/4 max HP and -1 Defense or paralysis.": "使出沖浪或潛水後被擊中時，使對手HP減少1/4或使對手的防禦降低1級，又或使對手陷入麻痹",
    "This Pokemon is immune to Status moves.": "不會受到對手的變化招式的影響",
    "This Pokemon and its allies are protected from opposing priority moves.": "讓對方無法使出會影響己方的先制招式",
    "If this Pokemon is hit, it lowers the Speed of all other Pokemon on the field 1 stage.": "受到攻擊時，令除該特性以外的寶可夢速度降低1級",
    "On switch-in, this Pokemon copies an ally's stat changes.": "出場時，複製同伴的能力變化",
    "This Pokemon can poison or badly poison a Pokemon regardless of its typing.": "該寶可夢使用的招式可以使毒屬性和鋼屬性的寶可夢中毒",
    "If ally is Dondozo: this Pokemon cannot act or be hit, +2 to all Dondozo's stats.": "若我方有吃吼霸，則該寶可夢無法被攻擊，吃吼霸全屬性提高2級",
    "At 1/3 or less of its max HP, this Pokemon's offensive stat is 1.5x with Fire attacks.": "當HP小於1/3時，火屬性招式的威力提升50%",
    "This Pokemon and its allies are protected from opposing priority moves.": "使對手無法對我方使出先制招式",
    "When this Pokemon reaches 1/2 or less of its max HP: +1 Atk, Sp. Atk, and Spe; -1 Def and Sp. Def.": "因對方攻擊而HP變為一半時，攻擊特攻速度提高1級，防禦特防下降1級",
    "If hit by a wind move or Tailwind begins: +1 Attack. Wind move immunity.": "吹起了順風或受到風的招式攻擊時，不會受到傷害，而是會使攻擊提高1級",
    "When an opposing Pokemon has a stat stage raised, this Pokemon copies the effect.": "對手的能力提高時，自己也會趁機同樣地提高能力",
    "The Sp. Atk stat of all other active Pokemon is reduced by 25%.": "降低除自己外的寶可夢25%特攻",
    "This Pokemon's offensive stat is multiplied by 1.3 while using an Electric-type attack.": "電屬性招式威力提升30%",
    "This Pokemon's offensive stat is multiplied by 1.5 while using an Electric-type attack.": "電屬性招式威力提升50%",
    "Fire-/Ice-type moves against this Pokemon deal damage with a halved offensive stat.": "受到冰屬性或火屬性招式攻擊時，在傷害計算中對方的攻擊或特攻減半。",
    "This Pokemon's moves of 60 power or less have 1.5x power, including Struggle.": "使用威力≤60的招式，威力提升50%",
    "The Attack stat of all other active Pokemon is reduced by 25%.": "降低除自己外的寶可夢25%攻擊",
    "The Defense stat of all other active Pokemon is reduced by 25%.": "降低除自己外的寶可夢25%防禦",
    "This Pokemon and its allies' Steel-type moves have their power multiplied by 1.5.": "己方全員的鋼屬性招式威力提升50%",
    "This Pokemon's offensive stat is multiplied by 1.5 while using a Steel-type attack.": "該特性的寶可夢使出鋼屬性招式的威力提升50%",
    "This Pokemon's offensive stat is doubled against a target that switched in this turn.": "對本回合替換上場的寶可夢造成的傷害*2",
    "This Pokemon's Special Attack is raised by 1 stage when another Pokemon faints.": "每當場上有寶可夢被打倒時特攻+1",
    "When one of this Pokemon's stat stages is raised or lowered, the amount is doubled.": "能力階級變化變為原來的兩倍",
    "Prevents foes from choosing to switch unless they also have this Ability.": "使對方全部不持有踩影特性的非幽靈屬性寶可夢無法替換",
    "This Pokemon's offensive stat is multiplied by 1.5 while using a Rock-type attack.": "岩石屬性的招式威力提升50%",
    "This Pokemon receives 1/2 damage from sound moves. Its own have 1.3x power.": "該特性的寶可夢發出的聲音類招式威力提升30%；受到聲音招式傷害減半",
    "On switch-in, summons Sunny Day. Attack is boosted by 30% in Sunny Day.": "出場時會將天氣變為大晴天。處於晴天時物攻提升30%",
    "When an opposing Pokemon recieves stat boosts, this Pokemon gets the same boosts.": "對手能力提高時，自己同樣提高",
    "While this Pokemon is active, Abilities have no effect.": "讓周圍寶可夢變為無特性狀態",
    "If this Pokemon is an Arceus, its type changes to match its held Plate.": "攜帶相應石板或Z純晶時改變屬性",
    "Prevents opposing Steel-type Pokemon from choosing to switch out.": "使對方非幽靈屬性的鋼屬性寶可夢無法替換",
    "This Pokemon blocks certain Status moves and bounces them back to the user.": "無效並反彈部分以自身為目標的變化招式",
    "On switch-in, this Pokemon lowers the Attack of opponents by 1 stage.": "出場時使範圍內的對手攻擊下降1級",
    "This Pokemon receives 1/2 damage from special attacks.": "受到特殊招式攻擊傷害減半",
    "If Eiscue, the first physical hit it takes deals 0 damage. Effect is restored in Snow.": "抵御一次物理傷害，並轉換為解凍頭形態。天氣變成下雪時，恢覆為結凍頭",
    "If Eiscue, the first physical hit it takes deals 0 damage. This effect is restored in Hail.": "抵御一次物理傷害，並轉換為解凍頭形態。天氣變成冰雹時，恢覆為結凍頭",
    "On switch-in, summons Electric Terrain. Sp. Atk is boosted by 30% in Electric Terrain.": "出場時會布下電氣場地。處於電氣場地時特攻提升30%",
    "Immune to Intimidate. Intimidated: +1 Attack. Cannot be forced to switch out.": "受到威嚇時使物攻提升1級，令替換寶可夢的招式和道具無效",
    "This Pokemon's Sp. Atk is raised by 1 stage if it attacks and KOes another Pokemon.": "每打敗一只寶可夢都將使特攻提升1級",
    "This Pokemon's Attack is 1.5x, but it can only select the first move it executes.": "攻擊提升至1.5倍，但只能使用一開始使用的招式",
    "This Pokemon becomes charged if it takes direct damage.": "受到傷害時，會變為充電狀態",
    "This Pokemon heals 1/3 of its max HP when hit by Ground moves; Ground immunity.": "受到地面屬性的招式攻擊時，不會受到傷害，而是會恢覆1/3血量",
    "This Pokemon's offensive stat is multiplied by 1.5 while using a Dragon-type attack.": "龍屬性招式威力提升50%",
    "If this Pokemon eats a berry, it will consume the berry again at the end of next turn.": "吃了樹果後，下回合再吃一次",
    "This Pokemon is immune to bullet moves.": "免疫球和彈類招式的傷害",
    "The Sp. Def stat of all other active Pokemon is reduced by 25%.": "降低除自己外的寶可夢25%特防",
    "Combination of the Unnerve and Grim Neigh Abilities.": "兼備緊張感和漆黑嘶鳴這兩種特性",
    "Combination of the Unnerve and Chilling Neigh Abilities.": "兼備緊張感和蒼白嘶鳴這兩種特性",
    "Prevents opposing Pokemon from choosing to switch out unless they are airborne.": "使對方所有非幽靈屬性的地面上的寶可夢無法替換",
    "This Pokemon's attacks without a chance to flinch gain a 10% chance to flinch.": "使用招式攻擊對手造成傷害時，對方有10%幾率陷入畏縮",
    "If this Pokemon has no item and is hit by a contact move, it steals the attacker's item.": "當該特性的寶可夢未攜帶任何道具時受到接觸類招式攻擊，可以獲得對手的道具",
    "This Pokemon has its non-volatile status condition cured when it switches out.": "回到同行隊伍後，異常狀態就會被治癒",
    "If this Pokemon is KOed with a contact move, that move's user loses 1/4 its max HP.": "因接觸類招式被擊倒時，發動該攻擊的寶可夢損失1/4最大HP",
    "This Pokemon's Normal-type moves become Flying type and have 1.2x power.": "一般屬性招式變為飛行屬性招式，威力提升20%",
    "While this Pokemon is active, the effects of weather conditions are disabled.": "該寶可夢在場時，所有天氣的影響都會消失",
    "This Pokemon's attacks have 1.3x power if it is the last to move in a turn.": "回合最後行動的話威力提升30%",
    "If this Pokemon (not its substitute) takes a critical hit, its Attack is raised 12 stages.": "被擊中要害時攻擊提升12級，替身狀態下不會發動",
    "On switch-in, this Pokemon shudders if any foe has a supereffective or OHKO move.": "登場時可以預知對方的效果絕佳和一擊必殺招式",
    "Prevents adjacent foes from choosing to switch unless they are airborne.": "處於地面上的對方寶可夢進入無法逃走狀態",
    "Protects user/allies from Attract, Disable, Encore, Heal Block, Taunt, and Torment.": "己方寶可夢不會受到迷人、定身法、再來一次、回復封鎖、挑釁和無理取鬧的影響",
    "While this Pokemon is active, the Dark Aura and Fairy Aura power modifier is 0.75x.": "反轉氣場類特性，令其對惡屬性和妖精屬性的加成變為降低25%",
    "Causes sleeping adjacent foes to lose 1/8 of their max HP at the end of each turn.": "回合結束時對方處於睡眠狀態的寶可夢損失1/8最大HP",
    "This Pokemon's allies have the power of their special attacks multiplied by 1.3.": "我方場上所有寶可夢使用特殊招式的威力增加30%",
    "This Pokemon cannot be struck by a critical hit.": "不會被擊中要害",
    "After KOing a Pokemon: becomes Ash-Greninja, Water Shuriken: 20 power, hits 3x.": "甲賀忍蛙擊倒對方一只寶可夢之後變身為小智版甲賀忍蛙，同時飛水手里劍威力變為20，固定命中三次",
    "This Pokemon's highest stat is raised by 1 if it attacks and KOes another Pokemon.": "擊倒對方一只寶可夢之後最高一項能力提升1級",
    "This Pokemon's Sp. Atk is raised by 1 when it reaches 1/2 or less of its max HP.": "因對手的攻擊HP變為1/2時，特攻會提高1級",
    "Prevents other Pokemon from lowering this Pokemon's Defense stat stage.": "防禦不會下降",
    "Makes user immune to ballistic moves (Shadow Ball, Sludge Bomb, Focus Blast, etc).": "免疫球和彈類招式",
    "If this Pokemon eats a Berry, it restores 1/3 of its max HP after the Berry's effect.": "食用樹果觸發效果之後額外回復1/3最大HP",
    "If Sunny Day is active, this Pokemon's Speed is doubled.": "大晴天下速度翻倍",
    "Prevents other Pokemon from lowering this Pokemon's stat stages.": "不會因為對手的招式或特性而被降低能力",
    "This Pokemon's type changes to the type of a move it's hit by, unless it has the type.": "受到傷害時若招式屬性和寶可夢當前屬性不同，則寶可夢在傷害結算後變為該屬性",
    "This Pokemon cannot be statused, and is considered to be asleep.": "不會陷入任何異常狀態，始終視為處於睡眠狀態",
    "This Pokemon's Sp. Atk is raised by 2 for each of its stats that is lowered by a foe.": "能力階級被降低時特攻提升2級",
    "This Pokemon's moves have their accuracy multiplied by 1.3.": "命中率提升30%",
    "If this Pokemon has a stat stage raised it is lowered instead, and vice versa.": "能力階級的下降變為上升，上升變為下降",
    "This Pokemon can poison or badly poison other Pokemon regardless of their typing.": "無論對方什麼屬性都可以使其進入中毒或劇毒狀態",
    "If this Pokemon is hit by an attack, there is a 30% chance that move gets disabled.": "受到傷害時有30%幾率令其進入定身法狀態",
    "30% chance of infatuating Pokemon of the opposite gender if they make contact.": "受到接觸類傷害時有30%幾率令其進入著迷狀態",
    "After another Pokemon uses a dance move, this Pokemon uses the same move.": "有其他寶可夢使用跳舞招式時，立即使用相同的招式",
    "While this Pokemon is active, a Dark move used by any Pokemon has 1.33x power.": "場上所有惡屬性招式威力提升33%",
    "While this Pokemon is active, allies are protected from opposing priority moves.": "對方的可以影響到自己或己方寶可夢的先制招式無效",
    "While this Pokemon has 1/2 or less of its max HP, its Attack and Sp. Atk are halved.": "HP低於50%時攻擊和特攻減半",
    "This Pokemon's Attack is raised by 2 for each of its stats that is lowered by a foe.": "能力階級被降低時攻擊提升2級",
    "On switch-in, strong winds begin until this Ability is not active in battle.": "登場時天氣變為亂流，直到該寶可夢離場，除非天氣被終結之地和始源之海更改",
    "On switch-in, extremely harsh sunlight begins until this Ability is not active in battle.": "登場時天氣變為大日照，直到該寶可夢離場，除非天氣被德爾塔氣流和始源之海更改",
    "(Mimikyu only) The first hit it takes is blocked, and it takes 1/8 HP damage instead.": "首次受到的傷害改為損失1/8最大HP，該特性只對謎擬Q有效",
    "On switch-in, Attack or Sp. Atk is raised 1 stage based on the foes' weaker Defense.": "登場時，對方防禦小於特防時，自身攻擊提升1級；否則特攻提升1級",
    "On switch-in, this Pokemon summons Rain Dance.": "登場時，天氣變為下雨",
    "On switch-in, this Pokemon summons Sunny Day.": "登場時，天氣變為大晴天",
    "This Pokemon is healed 1/4 by Water, 1/8 by Rain; is hurt 1.25x by Fire, 1/8 by Sun.": "免疫水傷害並回復1/4HP，受到火傷害增加25%；下雨每回合回復1/8HP；大晴天每回合損失1/8HP",
    "This Pokemon's sleep counter drops by 2 instead of 1.": "陷入睡眠的持續回合變為原來的一半",
    "30% chance of poison/paralysis/sleep on others making contact with this Pokemon.": "受到接觸類傷害時有30%幾率令對方陷入中毒/麻痹/睡眠狀態",
    "On switch-in, this Pokemon summons Electric Terrain.": "登場時釋放電氣場地",
    "This Pokemon switches out when it reaches 1/2 or less of its maximum HP.": "HP低於50%時自身退場",
    "While this Pokemon is active, a Fairy move used by any Pokemon has 1.33x power.": "場上所有妖精屬性招式威力提升33%",
    "This Pokemon receives 3/4 damage from supereffective attacks.": "受到效果絕佳傷害時傷害降低25%",
    "30% chance a Pokemon making contact with this Pokemon will be burned.": "受到接觸類傷害時有30%幾率概率陷入灼傷狀態",
    "While this Pokemon is burned, its special attacks have 1.5x power.": "陷入灼傷狀態時特攻提升50%",
    "This Pokemon's Fire attacks do 1.5x damage if hit by one Fire move; Fire immunity.": "免疫火屬性招式傷害，受到火屬性招式攻擊時火屬性招式威力提升50%",
    "If user is Cherrim and Sunny Day is active, it and allies' Attack and Sp. Def are 1.5x.": "在大晴天和大日照天氣時己方所有寶可夢攻擊和特防提升50%，櫻花兒的形態會改變",
    "This side's Grass types can't have stats lowered or status inflicted by other Pokemon.": "己方所有寶可夢草屬性能力階級不會被降低且不會進入異常狀態",
    "This Pokemon takes 1/2 damage from contact moves, 2x damage from Fire moves.": "受到的接觸類傷害減半，受到火屬性招式傷害翻倍",
    "Castform's type changes to the current weather condition's type, except Sandstorm.": "漂浮泡泡的形態和屬性根據天氣而變化",
    "On switch-in, this Pokemon is alerted to the foes' move with the highest power.": "登場時，預知對方威力最高的招式",
    "This Pokemon's allies receive 3/4 damage from other Pokemon's attacks.": "己方其他寶可夢受到的傷害降低25%",
    "On switch-in, this Pokemon identifies the held items of all opposing Pokemon.": "登場時，預知對方所有寶可夢的道具",
    "This Pokemon's Defense is doubled.": "防禦翻倍",
    "If this Pokemon is at full HP, its Flying-type moves have their priority increased by 1.": "HP全滿時飛行屬性招式優先度+1",
    "This Pokemon's Normal-type moves become Electric type and have 1.2x power.": "一般屬性招式變為電屬性招式，威力提升20%",
    "When this Pokemon has 1/2 or less of its maximum HP, it uses certain Berries early.": "HP低於50%時會提前使用特定的樹果",
    "Pokemon making contact with this Pokemon have their Speed lowered by 1 stage.": "受到接觸傷害時對方速度降低1級",
    "If Grassy Terrain is active, this Pokemon's Defense is multiplied by 1.5.": "青草場地下防禦提升50%",
    "On switch-in, this Pokemon summons Grassy Terrain.": "登場時，釋放青草場地",
    "If this Pokemon is statused, its Attack is 1.5x; ignores burn halving physical damage.": "陷入異常狀態時攻擊提升50%，無視灼傷狀態減半物理招式傷害效果",
    "If last item used is a Berry, 50% chance to restore it each end of turn. 100% in Sun.": "使用樹果後每回合50%概率回收該樹果，大晴天和大日照天氣下則必定回收",
    "30% chance of curing an adjacent ally's status at the end of each turn.": "回合結束時30%概率回復同伴的異常狀態",
    "The power of Fire-type attacks against this Pokemon is halved; burn damage halved.": "火屬性招式和灼傷傷害減半",
    "This Pokemon's weight is doubled.": "體重翻倍",
    "This Pokemon's Attack is doubled.": "攻擊翻倍",
    "On switch-in, this Pokemon's allies have their stat stages reset to 0.": "出場時會從貝殼撒藥，將我方的能力變化復原 ",
    "This Pokemon's Attack is 1.5x and accuracy of its physical attacks is 0.8x.": "以物理招式的命中率降低20%為代價提升50%攻擊",
    "This Pokemon has its status cured at the end of each turn if Rain Dance is active.": "下雨和大雨天氣時，每回合結束治癒異常狀態",
    "Prevents other Pokemon from lowering this Pokemon's Attack stat stage.": "攻擊能力不會被對方降低",
    "If Hail is active, this Pokemon heals 1/16 of its max HP each turn; immunity to Hail.": "冰雹天氣下每回合回復1/16最大HP，免疫冰雹傷害",
    "This Pokemon appears as the last Pokemon in the party until it takes direct damage.": "受到傷害前始終顯示為隊伍中最後一個寶可夢的形象",
    "This Pokemon cannot be poisoned. Gaining this Ability while poisoned cures it.": "不會陷入中毒和劇毒狀態，獲得特性時治癒中毒和劇毒狀態",
    "On switch-in, this Pokemon Transforms into the opposing Pokemon that is facing it.": "登場時以對應寶可夢為目標進入變身狀態",
    "Moves ignore substitutes and foe's Reflect/Light Screen/Safeguard/Mist/Aurora Veil.": "自身使用招式時無視對方的替身/反射壁/光牆/神秘守護/白霧/極光幕",
    "If this Pokemon is KOed with a move, that move's user loses an equal amount of HP.": "被擊倒時對方損失同樣數量的HP",
    "This Pokemon cannot fall asleep. Gaining this Ability while asleep cures it.": "不會陷入睡眠狀態，在睡眠狀態時獲得這個特性可以治癒睡眠",
    "On switch-in, this Pokemon lowers the Attack of adjacent opponents by 1 stage.": "登場時對方全體寶可夢攻擊降低1級",
    "Pokemon making contact with this Pokemon lose 1/8 of their max HP.": "受到接觸傷害時對方損失1/8最大HP",
    "This Pokemon's punch-based attacks have 1.2x power. Sucker Punch is not boosted.": "拳類招式威力提升20%",
    "This Pokemon's Attack is raised by 1 stage after it is damaged by a Dark-type move.": "受到惡屬性招式攻擊時攻擊提升1級",
    "This Pokemon's accuracy can't be lowered by others; ignores their evasiveness stat.": "命中率不會被下降，無視對方閃避率等級",
    "This Pokemon's held item has no effect, except Macho Brace. Fling cannot be used.": "攜帶的道具無效，超級石、Z純晶和影響努力值、經驗值和親密度的攜帶物品除外，無法使用投擲",
    "If Sunny Day is active, this Pokemon cannot be statused and Rest will fail for it.": "大晴天和大日照天氣下不會陷入異常狀態，使用睡覺會無效",
    "This Pokemon is immune to Ground; Gravity/Ingrain/Smack Down/Iron Ball nullify it.": "免疫地面屬性傷害，但受到重力、紮根、擊落和黑色鐵球影響時仍會受到傷害",
    "This Pokemon's weight is halved.": "體重減半",
    "This Pokemon draws Electric moves to itself to raise Sp. Atk by 1; Electric immunity.": "自動成為對方電屬性招式的攻擊目標並提升1級特攻；免疫電屬性攻擊",
    "This Pokemon cannot be paralyzed. Gaining this Ability while paralyzed cures it.": "不會陷入麻痹狀態，獲得狀態時恢覆麻痹狀態",
    "This Pokemon damages those draining HP from it for as much as they would heal.": "受到吸取HP的招式傷害時，對方本應吸取的體力會轉為受到同等的傷害",
    "This Pokemon's sound-based moves become Water type.": "聲音的招式屬性均變為水屬性",
    "This Pokemon's attacks do not make contact with the target.": "所有招式均視為非接觸類招式",
    "This Pokemon blocks certain status moves and bounces them back to the user.": "將對方以自身為目標的部分變化類招式無效化並反彈給招式的使用者",
    "This Pokemon can only be damaged by direct attacks.": "免疫除攻擊招式以外的一切造成的傷害",
    "If this Pokemon has no item, it steals the item off a Pokemon it hits with an attack.": "造成傷害時，如果沒有攜帶道具則獲得對方道具",
    "This Pokemon cannot be frozen. Gaining this Ability while frozen cures it.": "不會陷入冰凍狀態，獲得特性時恢覆冰凍狀態",
    "Prevents adjacent Steel-type foes from choosing to switch.": "對方的鋼屬性寶可夢不能交換",
    "If this Pokemon is statused, its Defense is 1.5x.": "異常狀態下防禦增加50%",
    "This Pokemon's pulse moves have 1.5x power. Heal Pulse heals 3/4 target's max HP.": "波動類和波導類招式威力提升50%，治癒波動回復量上升為3/4最大HP",
    "This Pokemon's attacks are critical hits if the target is poisoned.": "此特性的寶可夢攻擊處於中毒或劇毒狀態的寶可夢必定會擊中要害",
    "On switch-in, this Pokemon summons Misty Terrain.": "登場時，釋放薄霧場地",
    "This Pokemon's moves and their effects ignore the Abilities of other Pokemon.": "招式無視對方特性",
    "This Pokemon's Speed is raised 1 stage if hit by an Electric move; Electric immunity.": "受到電屬性招式攻擊時速度提升1級；免疫電屬性招式傷害",
    "This Pokemon's Attack is raised by 1 stage if it attacks and KOes another Pokemon.": "每擊倒對方一只寶可夢攻擊提升1級",
    "If this Pokemon is at full HP, damage taken from attacks is halved.": "HP全滿時受到的傷害減半",
    "If this Pokemon is an Arceus, its type changes to match its held Plate or Z-Crystal.": "阿爾宙斯的屬性隨著它攜帶的石板或Z純晶改變",
    "Pokemon making contact with this Pokemon have their Ability changed to Mummy.": "受到接觸類傷害時令對手的特性變為木乃伊",
    "This Pokemon has its major status condition cured when it switches out.": "退場時治癒自身的異常狀態",
    "Every move used by or against this Pokemon will always hit.": "自身使用和以自身為目標的招式必定命中",
    "This Pokemon's moves are changed to be Normal type and have 1.2x power.": "全部招式變為一般屬性招式，威力提升20%",
    "This Pokemon is immune to powder moves and damage from Sandstorm or Hail.": "免疫沙暴和冰雹天氣帶來的影響，對粉末類招式免疫",
    "This Pokemon's damaging moves hit twice. The second hit has its damage quartered.": "攻擊兩次；第二次攻擊傷害變為第一次的1/4",
    "If this Pokemon has no item, it finds one used by an adjacent Pokemon this turn.": "回合結束時，若沒有攜帶道具則獲得本回合其他寶可夢使用或投擲過的道具",
    "If this Pokemon has no item, it steals the item off a Pokemon making contact with it.": "受到接觸傷害時，若沒有攜帶道具則獲得對方道具",
    "This Pokemon's Normal-type moves become Fairy type and have 1.2x power.": "一般屬性招式變為妖精屬性招式，威力提升20%",
    "This Pokemon is healed by 1/8 of its max HP each turn when poisoned; no HP loss.": "處於中毒或劇毒狀態時不會損失HP，每回合回復1/8最大HP",
    "30% chance a Pokemon making contact with this Pokemon will be poisoned.": "受到接觸類傷害時有30%幾率令其陷入中毒狀態",
    "This Pokemon's contact moves have a 30% chance of poisoning.": "接觸類招式造成傷害時有30%幾率令其陷入中毒狀態",
    "If Zygarde 10%/50%, changes to Complete if at 1/2 max HP or less at end of turn.": "基格爾德10%形態或50%的HP低於50%時在回合結束會變為完全體形態",
    "This Pokemon copies the Ability of an ally that faints.": "同伴被擊倒後自身特性變為與之相同",
    "This Pokemon's Status moves have priority raised by 1, but Dark types are immune.": "變化招式的優先度+1，但對惡屬性寶可夢無效",
    "If this Pokemon is the target of a foe's move, that move loses one additional PP.": "對方以自身為目標的招式額外消耗1PP",
    "On switch-in, heavy rain begins until this Ability is not active in battle.": "登場時天氣變為大雨，直到該寶可夢離場，除非天氣被德爾塔氣流和終結之地更改",
    "This Pokemon's type changes to match the type of the move it is about to use.": "自身屬性變為即將使用的招式的屬性",
    "On switch-in, this Pokemon summons Psychic Terrain.": "登場時，釋放精神場地",
    "If this Pokemon is statused, its Speed is 1.5x; ignores Speed drop from paralysis.": "異常狀態下速度增加50%，無視麻痹帶來的速度降低影響",
    "If Rain Dance is active, this Pokemon heals 1/16 of its max HP each turn.": "下雨天氣下每回合回復1/16最大HP",
    "This Pokemon's attacks with recoil or crash damage have 1.2x power; not Struggle.": "使用具有反作用力傷害的招式時威力提升20%，掙扎除外",
    "This Pokemon's Normal-type moves become Ice type and have 1.2x power.": "一般屬性招式變為冰屬性招式，威力提升20%",
    "This Pokemon restores 1/3 of its maximum HP, rounded down, when it switches out.": "下場時回復1/3最大HP",
    "This Pokemon's attacks do 1.25x on same gender targets; 0.75x on opposite gender.": "對方與自身性別相同時威力提升25%，性別不同時下降25%",
    "If this Pokemon is a Silvally, its type changes to match its held Memory.": "銀伴戰獸的屬性隨著它攜帶的記憶碟改變",
    "This Pokemon does not take recoil damage besides Struggle/Life Orb/crash damage.": "不會受到自身招式的反作用力傷害，掙扎、飛踢和飛膝踢除外；生命寶珠的副作用不受影響",
    "This Pokemon's Ground/Rock/Steel attacks do 1.3x in Sandstorm; immunity to it.": "沙暴天氣下地面/岩石/鋼屬性招式威力提升30%；免疫沙暴傷害",
    "If Sandstorm is active, this Pokemon's Speed is doubled; immunity to Sandstorm.": "沙暴天氣下速度翻倍；免疫沙暴傷害",
    "On switch-in, this Pokemon summons Sandstorm.": "登場時，天氣變為沙暴",
    "If Sandstorm is active, this Pokemon's evasiveness is 1.25x; immunity to Sandstorm.": "沙暴天氣下閃避率增加25%；免疫沙暴傷害",
    "This Pokemon's Attack is raised 1 stage if hit by a Grass move; Grass immunity.": "受到草屬性招式攻擊時攻擊提升1級；免疫草屬性招式傷害",
    "If user is Wishiwashi, changes to School Form if it has > 1/4 max HP, else Solo Form.": "弱丁魚的HP高於1/4時變為魚群的樣子，否則變為單獨的樣子",
    "This Pokemon's moves have their secondary effect chance doubled.": "招式的追加效果出現率翻倍",
    "Prevents adjacent foes from choosing to switch unless they also have this Ability.": "除非對方擁有同樣的特性，否則不能替換寶可夢",
    "This Pokemon has a 33% chance to have its status cured at the end of each turn.": "回合結束時33%恢覆異常狀態",
    "This Pokemon's attacks with secondary effects have 1.3x power; nullifies the effects.": "以無視招式的追加效果為代價，帶有追加效果的招式的威力提升33%",
    "This Pokemon is not affected by the secondary effect of another Pokemon's attack.": "受到攻擊時對方招式的追加效果不會發動",
    "If Minior, switch-in/end of turn it changes to Core at 1/2 max HP or less, else Meteor.": "當HP變為50%以下時，殼會壞掉，變得有攻擊性",
    "This Pokemon's multi-hit attacks always hit the maximum number of times.": "使用連續招式時，攻擊次數會固定在五次",
    "On switch-in, this Pokemon's Attack and Speed are halved for 5 turns.": "登場之後的5回合內攻擊和速度減半",
    "If Snow is active, this Pokemon's Speed is doubled.": "下雪時速度翻倍",
    "If Hail is active, this Pokemon's Speed is doubled.": "冰雹下速度翻倍",
    "If this Pokemon strikes with a critical hit, the damage is multiplied by 1.5.": "擊中要害的招式傷害提升50%",
    "If Hail is active, this Pokemon's evasiveness is 1.25x; immunity to Hail.": "冰雹天氣下閃避率增加25%；免疫冰雹傷害",
    "On switch-in, this Pokemon summons Hail.": "登場時，天氣變為冰雹",
    "If Sunny Day is active, this Pokemon's Sp. Atk is 1.5x; loses 1/8 max HP per turn.": "大晴天天氣下特攻增加50%；大晴天天氣下回合結束時損失1/8最大HP",
    "This Pokemon's Sp. Atk is raised by 1 stage when another Pokemon faints.": "擊倒對方時特攻提升1級",
    "This Pokemon is immune to sound-based moves, including Heal Bell.": "免疫聲音類招式",
    "This Pokemon's Speed is raised 1 stage at the end of each full turn on the field.": "回合結束時速度提升1級",
    "This Pokemon moves last among Pokemon using the same or greater priority moves.": "優先度相同時必定後出",
    "This Pokemon's Defense is raised by 1 stage after it is damaged by a move.": "受到傷害後防禦提升1級",
    "If Aegislash, changes Forme to Blade before attacks and Shield before King's Shield.": "堅盾劍怪使用攻擊招式時會變為刀劍形態，使用王者盾牌時變為盾牌形態",
    "30% chance a Pokemon making contact with this Pokemon will be paralyzed.": "受到接觸傷害時有30%幾率令對方陷入麻痹狀態",
    "If this Pokemon flinches, its Speed is raised by 1 stage.": "畏縮時提升1級速度",
    "This Pokemon's attacks without a chance to flinch have a 10% chance to flinch.": "不會造成畏縮的招式造成傷害時10%造成對方畏縮",
    "This Pokemon cannot lose its held item due to another Pokemon's attack.": "不會因對方招式失去攜帶的道具",
    "This Pokemon draws Water moves to itself to raise Sp. Atk by 1; Water immunity.": "自動成為對方水屬性招式的攻擊目標並提升1級特攻；免疫水屬性攻擊",
    "This Pokemon's bite-based attacks have 1.5x power. Bug Bite is not boosted.": "啃咬類招式威力提升50%，蟲咬除外",
    "If this Pokemon is at full HP, it survives one hit with at least 1 HP. Immune to OHKO.": "HP全滿時受到致命傷害會保留1HP；免疫一擊必殺招式",
    "This Pokemon cannot be forced to switch out by another Pokemon's attack or item.": "不會因對方招式退場",
    "This Pokemon's critical hit ratio is raised by 1 stage.": "擊中要害等級提升1級",
    "If Electric Terrain is active, this Pokemon's Speed is doubled.": "電氣場地下速度翻倍",
    "This Pokemon and its allies cannot fall asleep.": "己方所有寶可夢不會陷入睡眠狀態",
    "If Rain Dance is active, this Pokemon's Speed is doubled.": "在下雨時速度翻倍",
    "If an ally uses its item, this Pokemon gives its item to that ally immediately.": "同伴使用道具後會立即將你的道具交給它",
    "If another Pokemon burns/poisons/paralyzes this Pokemon, it also gets that status.": "如果因對方招式而陷入灼傷/中毒/麻痹狀態，對方也同樣陷入同樣的狀態",
    "This Pokemon's evasiveness is doubled as long as it is confused.": "混亂狀態下閃避率翻倍",
    "This Pokemon's moves of 60 power or less have 1.5x power. Includes Struggle.": "使用威力低於60的招式時威力增加50%，掙扎除外",
    "This Pokemon does not take damage from attacks made by its allies.": "不會受到同伴招式的傷害",
    "Fire/Ice-type moves against this Pokemon deal damage with a halved attacking stat.": "受到火屬性和冰屬性招式造成的傷害減半",
    "This Pokemon's attacks that are not very effective on a target deal double damage.": "造成的效果不好的傷害翻倍",
    "While this Pokemon is poisoned, its physical attacks have 1.5x power.": "中毒和劇毒狀態下物理招式威力提升50%",
    "This Pokemon's contact moves have their power multiplied by 1.3.": "接觸類招式威力提升30%",
    "On switch-in, or when it can, this Pokemon copies a random adjacent foe's Ability.": "登場時複製一個隨機對方寶可夢的特性",
    "This Pokemon's healing moves have their priority increased by 3.": "回復HP的招式優先度+3",
    "This Pokemon skips every other turn instead of using a move.": "使用招式之後，下一回合不能使用招式",
    "This Pokemon ignores other Pokemon's stat stages when taking or doing damage.": "使用或受到招式造成傷害時無視對方的能力階級變化",
    "Speed is doubled on held item loss; boost is lost if it switches, gets new item/Ability.": "失去道具時速度翻倍，退場或獲得新道具後復原",
    "While this Pokemon is active, it prevents opposing Pokemon from using their Berries.": "對方寶可夢不可使用樹果",
    "This Pokemon and its allies' moves have their accuracy multiplied by 1.1.": "場上己方所有寶可夢命中率提升10%",
    "This Pokemon heals 1/4 of its max HP when hit by Electric moves; Electric immunity.": "受到電屬性招式攻擊時回復1/4最大HP；免疫電屬性傷害",
    "This Pokemon heals 1/4 of its max HP when hit by Water moves; Water immunity.": "受到水屬性招式攻擊時回復1/4最大HP；免疫水屬性傷害",
    "This Pokemon's Water power is 2x; it can't be burned; Fire power against it is halved.": "水屬性招式威力翻倍；不會陷入灼傷狀態；受到的火屬性招式傷害減半",
    "This Pokemon's Defense is raised 2 stages after it is damaged by a Water-type move.": "受到水屬性招式攻擊時防禦提升2級",
    "This Pokemon cannot be burned. Gaining this Ability while burned cures it.": "不會陷入灼傷狀態，獲得特性時治癒灼傷狀態",
    "If a physical attack hits this Pokemon, Defense is lowered by 1, Speed is raised by 2.": "受到物理招式傷害時防禦降低1級，同時速度提升2級",
    "This Pokemon can only be damaged by supereffective moves and indirect damage.": "只會受到效果絕佳招式的攻擊傷害，天氣、異常狀態、附加傷害效果依然有效",
    "Status moves with accuracy checks are 50% accurate when used on this Pokemon.": "變化招式對該特性的寶可夢命中率減半",
    "If Darmanitan, at end of turn changes Mode to Standard if > 1/2 max HP, else Zen.": "HP不足一半時轉變為達摩形態",
    "This Pokemon's same-type attack bonus (STAB) is 2 instead of 1.5.": "與自身屬性一致的招式威力由1.5倍變為2倍",
    "No competitive use.": "沒有實戰用途",
    "At 1/3 or less of its max HP, this Pokemon's attacking stat is 1.5x with Fire attacks.": "HP低於1/3時，火屬性招式的威力變為1.5倍",
    "Lowers Speed of all Pokemon except itself when hit by an attack.": "被攻擊後，降低除自己以外的所有寶可夢的速度",
    "Prevents Explosion/Mind Blown/Self-Destruct/Aftermath while this Pokemon is active.": "該特性會使自爆、大爆炸、驚爆大頭和引爆特性不發動",
    "On switch-in, this Pokemon's Defense is raised by 1 stage.": "出場時，防禦上升1級",
    "On switch-in, this Pokemon's Attack is raised by 1 stage.": "出場時，攻擊上升1級",
    "Boosts the Pokemon's Attack stat but only allows the use of the first selected move.": "攻擊獲得提升，只能使用上場後使出的第一個招式",
    "Get prey with Surf/Dive. When taking damage, prey is used to attack.": "使用沖浪/潛水後，如果受到攻擊會進行反擊",
    "Changes between Full Belly and Hangry Mode at the end of each turn.": "每回合結束時會在饑餓花紋和飽腹花紋之間切換",
    "Pokemon's head functions as substitute for a physical attack. Restored in hail.": "頭部的冰會代替自己承受物理攻擊，樣子也會改變，下冰雹時恢復原狀",
    "Changes the Pokemon's type depending on the terrain.": "寶可夢的屬性會隨著場地變化而變化",
    "If an active ally has this Ability or the Plus Ability, this Pokemon's Sp. Atk is 1.5x.": "場上己方同伴具有負電或正電特性時，特攻變為1.5倍",
    "Bounces back only the stat-lowering effects that the Pokemon receives.": "只反彈自己受到的能力降低效果",
    "This Pokemon's attacks that are super effective against the target do 1.25x damage.": "使用效果絕佳的招式，傷害變為1.25倍",
    "Nullifies abilities while on the field.": "該特性的寶可夢在場時，場上所有寶可夢的特性無法生效",
    "At 1/3 or less of its max HP, this Pokemon's attacking stat is 1.5x with Grass attacks.": "HP低於1/3時，草屬性招式的威力變為1.5倍",
    "Protects the Pokemon and its ally Pokemon from being poisoned.": "自己和同伴都不會陷入中毒的異常狀態",
    "When hit by a contact move, the Pokemon and the attacker faint in 3 turns.": "受到接觸攻擊時，3回合後攻擊者和自身都會倒下，交換解除效果",
    "If an active ally has this Ability or the Minus Ability, this Pokemon's Sp. Atk is 1.5x.": "場上己方同伴具有負電或正電特性時，特攻變為1.5倍",
    "Boosts sound move power, 0.5× damage from sound moves.": "提升聲音類招式的威力，受到聲音類招式的傷害減半",
    "Ripens Berries and doubles their effect.": "樹果的效果翻倍",
    "The Pokemon creates a sandstorm when it's hit by an attack.": "受到攻擊時使天氣變為沙暴",
    "Removes Screens and Veil Effects on switchin.": "出場時雙方的反射壁、光牆和極光幕都會消失",
    "When this Pokemon's stat stages are raised or lowered, the effect is doubled instead.": "該特性寶可夢的能力變化會變為平時的2倍",
    "This Pokemon's attacking stat is doubled against a target that switched in this turn.": "對替換出場的寶可夢以2倍的傷害進行攻擊",
    "This Pokemon's Speed is raised by 6 stages after it is damaged by Fire/Water moves.": "受到火屬性或者水屬性的招式攻擊後，速度上升6級",
    "This Pokemon's attacking stat is multiplied by 1.5 while using a Steel-type attack.": "使用鋼屬性的招式威力變為1.5倍",
    "At 1/3 or less of its max HP, this Pokemon's attacking stat is 1.5x with Bug attacks.": "HP低於1/3時，蟲屬性招式的威力變為1.5倍",
    "At 1/3 or less of its max HP, this Pokemon's attacking stat is 1.5x with Water attacks.": "HP低於1/3時，水屬性招式的威力變為1.5倍",
    "Exchanges abilities when hitting a Pokemon with a contact move.": "受到接觸攻擊時與攻擊方交換特性",
    "Fighting, Normal moves hit Ghost. Immune to Intimidate.": "一般和格鬥屬性招式可以攻擊到幽靈屬性寶可夢。免疫威嚇",
    "This Pokemon cannot be made to flinch. Immune to Intimidate.": "不會陷入畏縮狀態。免疫威嚇",
    "This Pokemon cannot be infatuated or taunted. Immune to Intimidate.": "不會陷入著迷和挑釁狀態。免疫威嚇",
    "This Pokemon cannot be confused. Immune to Intimidate.": "不會陷入混亂狀態。免疫威嚇",
    "This Pokemon and its allies' Steel-type moves have their BP mutiplied by 1.5.": "該特性的寶可夢和在場同伴使用鋼屬性招式時威力提升50%",
    "This Pokemon's allies have the base power of their moves multiplied by 1.3.": "該特性的寶可夢和在場同伴招式威力提升30%",
    "Ignores the effects of opposing Pokemon's Abilities and moves that draw in moves.": "能無視具有吸引對手招式效果的特性或招式的影響",
    "Ignores the effects of opposing Pokemon's moves/Abilities that redirect move targets.": "能無視具有吸引對手招式效果的特性或招式的影響",
    "This Pokemon's Special Defense is doubled.": "特防翻倍",
    "Boosts a random stat (except accuracy/evasion) +2 and another stat -1 every turn.": "每回合結束時隨機降低一項能力等級並提升兩項能力等級，閃避率/命中率除外",
    "Speed is raised 1 stage if hit by a Bug-, Dark-, or Ghost-type attack, or Intimidated.": "受到蟲/惡/幽靈屬性招式攻擊或者被威嚇後速度提升1級",
    "The combination of Unnerve and Grim Neigh.": "兼備緊張感和漆黑嘶鳴這兩種特性",
    "The combination of Unnerve and Chilling Neigh.": "兼備緊張感和蒼白嘶鳴這兩種特性",
    "This Pokemon's attacking stat is multiplied by 1.5 while using an Electric-type attack.": "擁有此特性的寶可夢使出的電屬性招式威力會提高50%",
    "This Pokemon's attacking stat is multiplied by 1.5 while using a Dragon-type attack. ": "擁有此特性的寶可夢使出的龍屬性招式威力會提高50%",
    "Does nothing.": "沒有任何用途",
    "On switch-in, this Pokemon's Attack is raised by 1 stage. Once per battle.": "出場時，提升1級攻擊。每場對戰僅能發動一次",
    "On switch-in, this Pokemon's Defense is raised by 1 stage. Once per battle.": "出場時，提升1級防禦。每場對戰僅能發動一次",
    "This Pokemon's type changes to the type of the move it is using. Once per switch-in.": "自身屬性變為即將使用的招式的屬性。每次出場僅能發動一次",
    "After KOing a Pokemon: raises Attack, Sp. Atk, Speed by 1 stage. Once per battle.": "擊敗對手一只寶可夢後，攻擊、特攻和速度提升1級。每場對戰僅能發動一次",
    "This Pokemon's moves have a 30% chance of badly poisoning.": "該特性的寶可夢攻擊命中目標時，30%的概率會令目標陷入劇毒狀態",
    "Sunny Day active or Booster Energy used: highest stat is 1.3x, or 1.5x if Speed.": "攜帶驅勁能量或天氣為大晴天時，數值最高的能力會提高30%；若該項能力為速度，則會提高50%",
    "Electric Terrain active or Booster Energy used: highest stat is 1.3x, or 1.5x if Speed.": "攜帶驅勁能量或場地處於電氣場地時，數值最高的能力會提高30%；若該項能力為速度，則會提高50%",
    "On switch-in, this Pokemon lowers the evasiveness of opponents 1 stage. Once per battle.": "首次出場時，令對手的閃避率下降1級",
    "On switch-in, this Pokemon restores 1/4 of its ally's maximum HP, rounded down.": "出場時款待同伴，使其回復1/4最大HP",
    "Fire damage against this Pokemon is dealt with 1/2 offensive stat; 1/2 burn damage.": "火屬性招式和灼傷對你造成的傷害變為原本的一半",
    "Fighting, Normal moves hit Ghost. Accuracy can't be lowered, ignores evasiveness.": "使出一般屬性和格鬥屬性的招式時可以擊中幽靈屬性的寶可夢",
    "If this Pokemon is a Terapagos, it transforms into its Terastal Form on entry.": "出場時會吸收周圍的能量，變為太晶形態",
    "Terapagos: If full HP, attacks taken have 0.5x effectiveness unless naturally immune.": "HP全滿時，如果受到的攻擊招式的屬性相性倍率為1或以上，將變為效果不好",
    "Terapagos: Terastallizing ends the effects of weather and terrain. Once per battle.": "令場上所有的天氣型狀態和場地型狀態消失。每場對戰僅能發動1次",
    "If this Pokemon poisons or badly poisons a target, the target also becomes confused.": "因你的招式而陷入中毒狀態的對手同時也會陷入混亂狀態",
    "Pecharunt: If this Pokemon poisons a target, the target also becomes confused.": "因桃歹郎的招式而陷入中毒狀態的對手同時也會陷入混亂狀態",
    "On switch-in, summons Sunny Day. During Sunny Day, Attack is 1.3333x.": "出場時，天氣變為大晴天並持續5回合。天氣為大晴天時，攻擊提高33%",
    "On switch-in, summons Electric Terrain. During Electric Terrain, Sp. Atk is 1.3333x.": "出場時，場地轉為電氣場地並持續5回合。場地為電氣場地時，特攻提高33%",
    "Active Pokemon without this Ability have their Special Defense multiplied by 0.75.": "在場時，除該特性的寶可夢外，其他特性的寶可夢的特防降低為原本的75%",
    "Active Pokemon without this Ability have their Defense multiplied by 0.75.": "在場時，除該特性的寶可夢外，其他特性的寶可夢的防禦降低為原本的75%",
    "Active Pokemon without this Ability have their Special Attack multiplied by 0.75.": "在場時，除該特性的寶可夢外，其他特性的寶可夢的特攻降低為原本的75%",
    "Active Pokemon without this Ability have their Attack multiplied by 0.75.": "在場時，除該特性的寶可夢外，其他特性的寶可夢的攻擊降低為原本的75%",
    "Ghost damage to this Pokemon dealt with a halved offensive stat; can't be statused.": "該特性的寶可夢不會陷入異常狀態。受到幽靈屬性的攻擊招式傷害減半",
    "This Pokemon gains the Charge effect when hit by a wind move or Tailwind begins.": "受到風的招式攻擊或己方使用順風時，會進入充電狀態",
    "Attack raised by 1 if hit by a wind move or Tailwind begins. Wind move immunity.": "受到風的招式攻擊或己方使用順風時，提升1級攻擊。不受風的招式影響。",
    "This Pokemon's slicing moves have their power multiplied by 1.5.": "該特性的寶可夢使出的切割類招式威力提高50%",
    "On switch-in, this Pokemon copies all of its ally's stat stage changes.": "該特性的寶可夢出場時，會複製同伴的能力變化",
    "If this Pokemon eats a Berry, it will eat that Berry again at the end of the next turn.": "食用樹果，或受到投擲的樹果影響後，會在下一回合結束時，再食用1次該樹果",
    "This Pokemon heals 1/4 of its max HP when hit by Ground moves; Ground immunity.": "該特性的寶可夢不受地面屬性招式的影響；當被地面屬性的招式擊中時，回復25%最大HP",
    "This Pokemon is immune to powder moves, Sandstorm damage, and Effect Spore.": "該特性的寶可夢不會受到沙暴和冰雹天氣帶來的影響，並免疫粉末類招式",
    "This Pokemon's moves have 10% more power for each fainted ally, up to 5 allies.": "我方每有一只寶可夢陷入過瀕死，招式威力提升10%。最多觸發5次",
    "If this Pokemon is hit by a physical attack, Toxic Spikes are set on the opposing side.": "該特性的寶可夢受到物理招式攻擊時，會向對手的場地撒下毒菱",
    "This Pokemon's Status moves go last in their priority bracket and ignore Abilities.": "該特性的寶可夢使出變化招式時，使目標的特性失效。在同一優先度下最晚行動",
    "At 1/2 or less of this Pokemon's max HP: +1 Atk, Sp. Atk, Spe, and -1 Def, Sp. Def.": "HP因受到攻擊變為1/2以下時，防禦和特防降低1級，攻擊、特攻和速度提高1級。",
    "This Pokemon gains the Charge effect when it takes a hit from an attack.": "受到傷害時，會進入充電狀態",
    "Making contact with this Pokemon has the attacker's Ability become Lingering Aroma.": "該特性的寶可夢在受到接觸類招式的攻擊時，對手的特性會變成甩不掉的氣味",
    "On switch-in, this Pokemon's Special Defense is raised by 1 stage.": "出場時，特防上升1級",
    "On switch-in, this Pokemon's Speed is raised by 1 stage.": "出場時，速度上升1級",
    "If Snow is active, this Pokemon's evasiveness is 1.25x.": "天氣處於冰雹或下雪狀態時，閃避率提升25%",
    "On switch-in, this Pokemon summons Snow.": "出場時，會將天氣變為下雪",
    "If this Pokemon is a Palafin in Zero Form, switching out has it change to Hero Form.": "回到同行隊伍後，會變為全能形態",
    "If Snow is active, this Pokemon heals 1/16 of its max HP each turn.": "天氣處於冰雹或下雪狀態時，每回合結束時回復最大HP的1/16",
    "This Pokemon's Attack is raised by 1 when damaged by Fire moves; can't be burned.": "受到火屬性招式攻擊時攻擊提升1級；不會陷入灼傷狀態",






    //   前代特性

    "Raises a random stat by 2 and lowers another stat by 1 at the end of each turn.": "每回合結束時隨機降低一項能力等級並提升兩項能力等級",
    "This Pokemon cannot be made to flinch.": "不會畏縮",
    "This Pokemon cannot be infatuated or taunted.": "不會陷入著迷和挑釁狀態",
    "This Pokemon's Speed is raised 1 stage if hit by a Bug-, Dark-, or Ghost-type attack.": "受到蟲/惡/幽靈屬性招式攻擊後速度提升1級",
    "This Pokemon can hit Ghost types with Normal- and Fighting-type moves.": "一般和格鬥屬性招式可以攻擊到幽靈屬性寶可夢",
    "This Pokemon cannot be confused.": "不會陷入混亂狀態",
    "(Mimikyu only) First hit deals 0 damage, breaks disguise.": "首次傷害視為0，並改變樣子，該特性只對謎擬Q有效",
    "Prevents Explosion/Self-Destruct/Aftermath while this Pokemon is active.": "當該寶可夢在場時，自爆和大爆炸會使用失敗，引爆特性不發動",
    "30% chance each adjacent ally has its status cured at the end of each turn.": "每回合結束有30%的幾率治癒相鄰同伴的異常狀態",
    "On switch-in, this Pokemon identifies the held item of a random opposing Pokemon.": "登場時，預知對手一個隨機寶可夢的道具",
    "This Pokemon is immune to sound-based moves, except Heal Bell.": "不受聲音的招式影響，包括治癒鈴聲",
    "If a physical attack hits this Pokemon, Defense is lowered by 1, Speed is raised by 1.": "受到物理招式的傷害時，防禦會降低1級，速度提高1級",
    "This Pokemon's non-damaging moves have their priority increased by 1.": "變化招式的優先度+1",
    "This Pokemon's moves ignore the foe's Reflect, Light Screen, Safeguard, and Mist.": "自身使用招式時無視對方的反射壁/光牆/神秘守護和白霧",
    "This Pokemon cannot be infatuated. Gaining this Ability while infatuated cures it.": "該特性的寶可夢不會陷入著迷狀態。陷入此狀態的寶可夢獲得該特性時此狀態消除",
    "Prevents adjacent opposing Steel-type Pokemon from choosing to switch out.": "使對方的鋼屬性寶可夢無法替換",
    "OHKO moves fail when used against this Pokemon.": "一擊必殺招式對擁有該特性的寶可夢無效",
    "If this Pokemon is the target of a move, that move loses one additional PP.": "在場的其他寶可夢的招式額外消耗1PP",
    "This Pokemon is immune to Ground; Gravity/Ingrain/Iron Ball nullify it.": "免疫地面屬性傷害，但受到重力/紮根/黑色鐵球的影響時仍會受到傷害",
    "If this Pokemon is the target of a move, that move loses one additional PP.": "以自身為目標的招式額外消耗1PP",
    "At 1/3 or less of its max HP, this Pokemon's Water-type attacks have 1.5x power.": "當HP小於1/3時，水屬性招式的威力提升50%",
    "At 1/3 or less of its max HP, this Pokemon's Fire-type attacks have 1.5x power.": "當HP小於1/3時，火屬性招式的威力提升50%",
    "At 1/3 or less of its max HP, this Pokemon's Grass-type attacks have 1.5x power.": "當HP小於1/3時，草屬性招式的威力提升50%",
    "This Pokemon's moves of 60 power or less have 1.5x power, except Struggle.": "使用除掙扎外的威力≤60的招式，威力提升50%",
    "At 1/3 or less of its max HP, this Pokemon's Bug-type attacks have 1.5x power.": "當HP小於1/3時，蟲屬性招式的威力提升50%",
    "Prevents other Pokemon from lowering this Pokemon's accuracy stat stage.": "命中率能力變化不會被其他寶可夢以任何方式降低",
    "The power of Fire- and Ice-type attacks against this Pokemon is halved.": "受到冰屬性或火屬性招式攻擊時，在傷害計算中對方的招式威力減半。",
    "This Pokemon's moves are changed to be Normal type.": "全部招式變為一般屬性招式",
    "If an active ally has the Plus Ability, this Pokemon's Sp. Atk is 1.5x.": "場上己方同伴具有正電特性時，特攻變為1.5倍",
    "If an active ally has the Minus Ability, this Pokemon's Sp. Atk is 1.5x.": "場上己方同伴具有負電特性時，特攻變為1.5倍",
    "If an active Pokemon has the Plus Ability, this Pokemon's Sp. Atk is 1.5x.": "場上有寶可夢具有正電特性時，特攻變為1.5倍",
    "If an active Pokemon has the Minus Ability, this Pokemon's Sp. Atk is 1.5x.": "場上有寶可夢具有負電特性時，特攻變為1.5倍",
    "This Pokemon draws single-target Electric moves to itself.": "自動成為對方電屬性招式的攻擊目標",
    "This Pokemon is only damaged by Fire Fang, supereffective moves, indirect damage.": "只會受到火焰牙和效果絕佳招式的攻擊傷害，間接傷害依然有效",
    "This Pokemon is only damaged by supereffective moves and indirect damage.": "只會受到間接傷害和效果絕佳招式的攻擊傷害",
    "This Pokemon does not take recoil damage besides Struggle and crash damage.": "不會受到自身招式的反作用力傷害，掙扎、飛踢和飛膝踢除外",
    "10% chance of poison/paralysis/sleep on others making contact with this Pokemon.": "受到接觸類傷害時有10%幾率令對方陷入中毒/麻痹/睡眠狀態",
    "This Pokemon is immune to Ground.": "免疫地面屬性傷害",
    "This Pokemon heals 1/4 its max HP when hit by a damaging Electric move; immunity.": "受到電屬性的非變化招式攻擊時回復1/4最大HP免疫；電屬性傷害",
    "Prevents Steel-type Pokemon from choosing to switch out, other than this Pokemon.": "使除自身外的鋼屬性寶可夢無法替換",
    "Fire-/Ice-type moves against this Pokemon deal damage with a halved Sp. Atk stat.": "擁有該特性的寶可夢受到冰屬性或火屬性招式攻擊時，傷害減半",
    "This Pokemon draws single-target Electric moves used by opponents to itself.": "自動成為對方電屬性招式的攻擊目標",
    "1/3 chance a Pokemon making contact with this Pokemon will be paralyzed.": "受到接觸傷害時有1/3幾率令對方陷入麻痹狀態",
    "Prevents Explosion and Self-Destruct while this Pokemon is active.": "當該寶可夢在場時，自爆和大爆炸會使用失敗",
    "Pokemon making contact with this Pokemon lose 1/16 of their max HP.": "受到接觸傷害時對方損失1/16最大HP",
    "1/3 chance a Pokemon making contact with this Pokemon will be poisoned.": "受到接觸類傷害時有1/3幾率令其陷入中毒狀態",
    "1/3 chance of infatuating Pokemon of the opposite gender if they make contact.": "受到接觸類傷害時有1/3幾率令其進入著迷狀態",




    //  戰鬥文件

    "won the battle!": "獲得了勝利！",
    "The sunlight turned extremely harsh!": "日照變得非常強了！",
    "The sunlight turned harsh!": "日照變強了！",
    "The sunlight faded.": "日照復原了。",
    "The harsh sunlight faded.": "日照復原了。",
    "The extremely harsh sunlight faded.": "日照復原了。",
    "It started to rain!": "開始下雨了！",
    "The rain stopped.": "雨停了。",
    "A heavy rain began to fall!": "開始下起了暴雨！",
    "The heavy rain has lifted!": "大雨停了！",
    "A sandstorm kicked up!": "開始刮沙暴了！",
    "The sandstorm is raging.": "沙暴正在肆虐。",
    "The sandstorm subsided.": "沙暴停止了。",
    "It started to hail!": "開始下冰雹了！",
    "The hail is crashing down.": "冰雹正在砸落。",
    "The hail stopped.": "冰雹停了。",
    "It started to snow!": "開始下雪了！",
    "The snow stopped.": "雪停了。",
    "(The sunlight is strong.)": "(陽光很強烈。)",
    "(The sunlight is strong!)": "(陽光很強烈！)",
    "(Rain continues to fall.)": "(雨還在下。)",
    "(Rain continues to fall!)": "(雨還在下！)",
    "(The sandstorm is raging.)": "(沙暴正在肆虐。)",
    "(The hail is crashing down.)": "(冰雹正在砸落。)",
    "(The snow is falling down.)": "(雪還在下。)",
    "Mysterious strong winds are protecting Flying-type Pokemon!": "神秘的亂流正在保護飛行屬性的寶可夢！",
    "The mysterious strong winds have dissipated!": "神秘的亂流消散了！",
    "Automatic center!": "自動居中！",
    "It hurt itself in its confusion!": "不知所以地攻擊了自己！",
    "The battlers shared their pain!": "雙方分擔了痛楚！",
    "All stat changes were eliminated!": "所有能力都復原了！",
    "A critical hit!": "擊中了要害！",
    "It had no effect!": "這沒有效果！",
    "But it does not have enough HP left to make a substitute!": "但是，體力已經不夠放出替身了！",
    "But it failed!": "但是，沒有效果！！",
    "The extremely harsh sunlight was not lessened at all!": "強烈的陽光絲毫沒有被削弱！",
    "There is no relief from this heavy rain!": "暴雨的勢頭不減！",
    "The mysterious strong winds blow on regardless!": "神秘的亂流仍然在持續著！",
    "The Water-type attack evaporated in the harsh sunlight!": "受強日照的影響，水屬性的攻擊被蒸發了！",
    "The Fire-type attack fizzled out in the heavy rain!": "受強降雨的影響，火屬性的攻擊被撲滅了！",
    "But there was no target……": "然而攻擊沒有目標……",
    "It's a one-hit KO!": "一擊必殺！",
    "But nothing happened!": "但是，什麼也沒有發生！！",
    "The two moves have become one! It's a combined move!": "兩個招式合二為一！這是合體招式！！",
    "The effects of the weather disappeared.": "天氣的影響消失了。",
    "Your team is too nervous to eat Berries!": "我方因太緊張而無法食用樹果！",
    "The opposing team is too nervous to eat Berries!": "對手因太緊張而無法食用樹果！",
    "Zen Mode triggered!": "達摩模式，啟動！",
    "Zen Mode ended!": "達摩模式，結束！",
    "Changed to Blade Forme!": "刀劍形態，變形！",
    "Changed to Shield Forme!": "盾牌形態，變形！",
    "Shields Down deactivated!": "界限盾殼，啟動！",
    "Shields Down activated!": "界限盾殼，解除！",
    "Electricity's power was weakened!": "電屬性招式的威力被減弱了！",
    "Fire's power was weakened!": "火屬性招式的威力被減弱了！",
    "Everyone is caught up in the happy atmosphere!": "大家都沈浸在歡樂的氣氛中！",
    "When the flame touched the powder on the Pokemon, it exploded!": "當火焰接觸到寶可夢身上的粉塵時發生了爆炸！",
    "No one will be able to run away during the next turn!": "下回合結束前雙方均無法逃走！",
    "Its disguise served it as a decoy!": "畫皮抵擋了攻擊！",
    "You sense the presence of many!": "你感受到了一股強大的力量！",
    "The mysterious strong winds weakened the attack!": "神秘的亂流減弱了攻擊！",
    "Aurora Veil made your team stronger against physical and special moves!": "極光幕使我方的物理和特殊抗性提高了！",
    "Aurora Veil made the opposing team stronger against physical and special moves!": "極光幕使對手的物理和特殊抗性提高了！",
    "Reflect made your team stronger against physical moves!": "反射壁使我方的物理抗性提高了！",
    "Reflect made the opposing team stronger against physical moves!": "反射壁使得對手的物理抗性提高了！",
    "Light Screen made your team stronger against special moves!": "光牆使我方的特殊抗性提高了！",
    "Light Screen made the opposing team stronger against special moves!": "光牆使得對手的特殊抗性提高了！",
    "The opposing team's Tailwind petered out!": "對手的順風停止了！",
    "Your team's Tailwind petered out!": "我方的順風停止了！",
    "The opposing team's Aurora Veil wore off!": "對手的極光幕消失了！",
    "Your team's Aurora Veil wore off!": "我方的極光幕消失了！",
    "The opposing team's Reflect wore off!": "對手的反射壁消失了！",
    "Your team's Reflect wore off!": "我方的反射壁消失了！",
    "The opposing team's Light Screen wore off!": "對手的光牆消失了！",
    "Your team's Light Screen wore off!": "我方的光牆消失了！",
    "The opposing team cloaked itself in a mystical veil!": "對手被神秘之幕包圍了！",
    "Your team cloaked itself in a mystical veil!": "我方被神秘之幕包圍了！",
    "The opposing team is no longer protected by Safeguard!": "對手不再受神秘守護的保護！",
    "Your team is no longer protected by Safeguard!": "我方不再受神秘守護的保護！",
    "The opposing team became shrouded in mist!": "對手被白霧包圍了！",
    "Your team became shrouded in mist!": "我方被白霧包圍了！",
    "The opposing team is no longer protected by mist!": "對手不再受白霧的保護！",
    "Your team is no longer protected by mist!": "我方不再受白霧的保護！",
    "The opposing team's Lucky Chant wore off!": "對方的幸運咒語結束了！",
    "Your team's Lucky Chant wore off!": "我方的幸運咒語結束了！",
    "Lucky Chant shielded the opposing team from critical hits!": "幸運咒語隱藏起了對手的要害！",
    "Lucky Chant shielded your team from critical hits!": "幸運咒語隱藏起了我方的要害！",
    "A sea of fire enveloped the opposing team!": "對手周圍被火海包圍了！",
    "A sea of fire enveloped your team!": "我方周圍被火海包圍了！",
    "A rainbow appeared in the sky on the opposing team's side!": "彩虹出現在了對手上空！",
    "A rainbow appeared in the sky on your team's side!": "彩虹出現在了我方上空！",
    "A swamp enveloped the opposing team!": "對手周圍被沼澤包圍了！",
    "A swamp enveloped your team!": "我方圍被沼澤包圍了！",
    "It created a bizarre area in which Defense and Sp. Def stats are swapped!": "憑空制造出了互換防禦與特防的空間！",
    "It created a bizarre area in which Pokemon's held items lose their effects!": "憑空制造出了令道具無效的空間！",
    "Grass grew to cover the battlefield!": "腳下青草如茵！",
    "Mist swirls around the battlefield!": "腳下霧氣繚繞！",
    "An electric current runs across the battlefield!": "腳下電光飛閃！",
    "The battlefield got weird!": "腳下傳來了奇妙的感覺！",
    "The twisted dimensions returned to normal!": "扭曲的時空復原了！",
    "Wonder Room wore off, and Defense and Sp. Def stats returned to normal!": "奇妙空間結束了，防禦與特防的能力值復原了！",
    "Magic Room wore off, and held items' effects returned to normal!": "魔法空間結束了，道具效果恢覆了正常！",
    "Gravity intensified!": "重力變強了！",
    "Gravity returned to normal!": "重力復原了！",
    "The effects of Mud Sport have faded.": "玩泥巴的效果消失了。",
    "The effects of Water Sport have faded.": "玩水的效果消失了。",
    "The grass disappeared from the battlefield.": "腳下的青草不見了。",
    "The mist disappeared from the battlefield.": "腳下的霧氣不見了。",
    "The electricity disappeared from the battlefield.": "腳下的電流消失了。",
    "The weirdness disappeared from the battlefield!": "腳下的奇妙感覺不見了！",
    "Coins were scattered everywhere!": "金幣撒的到處都是！",
    "A deluge of ions showers the battlefield!": "等離子雨傾盆而下！",
    "Pointed stones float in the air around the opposing team!": "對手周圍開始浮現出尖銳的岩石！",
    "Pointed stones float in the air around your team!": "我方周圍開始浮現出尖銳的岩石！",
    "Spikes were scattered on the ground all around the opposing team!": "對手腳下散落著撒菱！",
    "Spikes were scattered on the ground all around your team!": "腳下散落著撒菱！",
    "Poison spikes were scattered on the ground all around the opposing team!": "對手腳下散落著毒菱！",
    "Poison spikes were scattered on the ground all around your team!": "腳下散落著毒菱！",
    "A sticky web has been laid out on the ground around the opposing team!": "對手的腳下延伸出了黏黏網！",
    "A sticky web has been laid out on the ground around your team!": "腳下延伸出了黏黏網！",
    "The Tailwind blew from behind the opposing team!": "從對手的身後吹起了順風！",
    "The Tailwind blew from behind your team!": "從你的身後吹起了順風！",
    "The pointed stones disappeared from around the opposing team!": "對手周圍的隱形岩消失不見了！",
    "The pointed stones disappeared from around your team!": "我方周圍的隱形岩消失不見了！",
    "The spikes disappeared from the ground around the opposing team!": "對手周圍的撒菱消失不見了！",
    "The spikes disappeared from the ground around your team!": "我方周圍的撒菱消失不見了！",
    "The poison spikes disappeared from the ground around the opposing team!": "對手周圍的毒菱消失不見了！",
    "The poison spikes disappeared from the ground around your team!": "我方周圍的毒菱消失不見了！",
    "The sticky web has disappeared from the ground around the opposing team!": "對手周圍的黏黏網消失不見了！",
    "The sticky web has disappeared from the ground around your team!": "我方周圍的黏黏網消失不見了！",
    "Waiting for opponent...": "等待對手行動...",
    "It's super effective! A critical hit!": "效果絕佳！ 擊中了要害！",
    "It's not very effective... A critical hit!": "好像效果不好...... 擊中了要害！",
    "All Pokemon that heard the song will faint in three turns!": "所有聽到歌聲的寶可夢將在3回合後倒下！",
    "The effects of the neutralizing gas wore off!": "化學變化氣體的效果消失了！",
    "An electric current ran across the battlefield!": "腳下電光飛閃！",
    "But there was no target...": "但沒有目標...",
    "It created a bizarre area in which Pokemon's held items lose their effects!": "制造出了使所有寶可夢道具效果消失的魔法空間！",
    "Mist swirled around the battlefield!": "腳下霧氣繚繞！",
    "The Pokemon was hit 1 time!": "擊中一次！",
    "The move was blocked by the power of Dynamax!": "因為極巨化的力量，招式使用失敗了！",
    "When the flame touched the powder on the Pokemon, it exploded!": "火焰接觸到寶可夢身上的粉塵，引發了爆炸！",
    "Battle timer is now OFF.": "戰鬥計時器關閉了。",
    "Register an account to protect your ladder rating!": "注冊賬號以保護你的分數！",
    "Ladder updating...": "天梯更新中...",
    "This room is already hidden.": "房間已經隱藏了。",
    "This room is already public.": "房間已經公開了。",
    "The replay for this battle is already set to hidden.": "這場戰鬥的回放已經隱藏了。",
    "This battle is invite-only!": "這個戰鬥房間上鎖了！",
    "This room is now invite only!": "這個房間現在上鎖了！",
    "This room is no longer invite only!": "這個房間現在解鎖了！",
    "This room is expired": "這個房間過期了",
    "It's teatime! Everyone dug in to their Berries!": "大家開茶會！吃了樹果！",
    "Neutralizing gas filled the area!": "周圍充滿了化學變化氣體！",
    "Your username is no longer available.": "您的選擇的用戶名不可使用。",
    "This server is requesting an invalid login key. This probably means that either you are notconnected to a server, or the server is set upincorrectly.": "伺服器登錄密鑰請求無效。你沒有連接到伺服器，或者伺服器設置錯誤。",
    "Sleep Clause Mod activated.": "催眠條款已生效。",
    "[Unavailable choice] Can't switch: The active Pokemon is trapped": "[無效的選擇]無法切換：在場的寶可夢被困住了",
    "[Invalid choice] Can't undo: A trapping/disabling effect would cause undo to leak information": "[無效的選擇]無法取消：技能被禁用/束縛類技能會導致信息泄露",
    "[Invalid choice] There's nothing to cancel": "[無效的選擇]沒有可以取消的內容",
    "[Invalid choice] There's nothing to choose": "[無效的選擇]沒有可以選擇的選項",
    "[Invalid choice] Sorry, too late to make a different move; the next turn has already started": "[無效的選擇]抱歉，無法做出其他行動；下個回合已經開始了",
    "[Invalid choice] Sorry, too late to cancel; the next turn has already started": "[無效的選擇]抱歉，無法取消；下個回合已經開始了",
    "[Invalid choice] Can't do anything: The game is over": "[無效的選擇]無法做出任何行動: 遊戲結束了",
    "[Invalid choice] Can't move: You can only mega-evolve once per battle": "[無效的選擇]無法使用：每次戰鬥只能進行一次超級進化。",
    "[Invalid choice] Can't move: You can only Terastallize once per battle.": "[無效的選擇]無法使用：每次戰鬥只能進行一次太晶化。",
    "Go!": "上吧！",
    "It's super effective!": "效果絕佳！",
    "It's not very effective...": "好像效果不好......",
    "But there was no PP left for the move!": "但招式已經沒有PP了！",
    "The timer can't be enabled after a battle has ended.": "戰鬥結束後無法開啟計時器。",
    "was dragged out!": "被拖進了戰鬥！",
    "The sea of fire around the opposing team disappeared!": "對手周圍的火海消失了！",
    "The sea of fire around your team disappeared!": "我方周圍的火海消失了！",
    "The rainbow on the opposing team's side disappeared!": "對手上空的彩虹消失了！",
    "The rainbow on your team's side disappeared!": "我方上空的彩虹消失了！",
    "The swamp around the opposing team disappeared!": "對手周圍的沼澤消失了！",
    "The swamp around your team disappeared!": "我方周圍的沼澤消失了！",
    "Quick Guard protected the opposing team!": "對手周圍正受到快速防守的保護！",
    "Quick Guard protected your team!": "我方周圍正受到快速防守的保護！",
    "Wide Guard protected the opposing team!": "對手周圍正受到廣域防守的保護！",
    "Wide Guard protected your team!": "我方周圍正受到廣域防守的保護！",
    "Crafty Shield protected the opposing team!": "對手周圍正受到戲法防守的保護！",
    "Crafty Shield protected your team!": "我方周圍正受到戲法防守的保護！",
    "Accept Open Team Sheets": "同意公開隊伍配置",
    "Deny Open Team Sheets": "拒絕公開隊伍配置",
    "You have already made your decision about agreeing to open team sheets.": "您已經決定了是否公開隊伍配置。",
    "Both Pokemon will faint in three turns!": "雙方都會在3回合後變為瀕死狀態！",
    "Tidying up complete!": "大掃除完畢！",
    "Sharp-pointed pieces of steel started floating around the opposing Pokemon!": "對手周圍開始懸浮起尖銳的鋼刺！",
    "Sharp-pointed pieces of steel started floating around your ally Pokemon!": "我方周圍開始懸浮起尖銳的鋼刺！",
    "The pieces of steel surrounding the opposing Pokemon disappeared!": "對手周圍的鋼刺消失不見了！",
    "The pieces of steel surrounding your ally Pokemon disappeared!": "我方周圍的鋼刺消失不見了！",
    "The opposing Pokemon were surrounded by fire!": "對手的寶可夢被困在火焰之中！",
    "Your ally Pokemon were surrounded by fire!": "我方的寶可夢被困在火焰之中！",
    "The opposing Pokemon got trapped with vines!": "對手的寶可夢被困在鞭子的猛擊中！",
    "Your ally Pokemon got trapped with vines!": "我方的寶可夢被困在鞭子的猛擊中！",
    "The opposing Pokemon got caught in the vortex of water!": "對手的寶可夢被困在水流之中！",
    "Your ally Pokemon got caught in the vortex of water!": "我方的寶可夢被困在水流之中！",
    "The opposing Pokemon became surrounded by rocks!": "對手的寶可夢被困在岩石之中！",
    "Your ally Pokemon became surrounded by rocks!": "我方的寶可夢被困在岩石之中！",
    "(G-Max Wildfire ended on the opposing team!)": "(對手周圍的超極巨地獄滅焰消失了！)",
    "(G-Max Wildfire ended on your team!)": "(我方周圍的超極巨地獄滅焰消失了！)",
    "(G-Max Vine Lash ended on the opposing team!)": "(對手周圍的超極巨灰飛鞭滅消失了！)",
    "(G-Max Vine Lash ended on your team!)": "(我方周圍的超極巨灰飛鞭滅消失了！)",
    "(G-Max Cannonade ended on the opposing team!)": "(對手周圍的超極巨水炮轟滅消失了！)",
    "(G-Max Cannonade ended on your team!)": "(我方周圍的超極巨水炮轟滅消失了！)",
    "(G-Max Volcalith ended on the opposing team!)": "(對手周圍的超極巨炎石噴發消失了！)",
    "(G-Max Volcalith ended on your team!)": "(我方周圍的超極巨炎石噴發消失了！)",
    "(G-Max Centiferno activated!)": "(超極巨百火焚野已生效！)",
    "(G-Max Sandblast activated!)": "(超極巨沙塵漫天已生效！)",
    "(Dynamax ended.)": "(極巨化結束了。)",
    "(Max Guard activated!)": "(極巨防壁守住了攻擊！)",
    "(Sleep Clause Mod prevents players from putting more than one of their opponent's Pokemon to sleep at a time)": "(催眠條款禁止玩家催眠對手的多個寶可夢）",
    "(Illusion Level Mod is active, so this Pokemon's true level was hidden.)": "(幻覺等級條款已生效，所以它的真實等級被掩蓋了。）",
    "(Normal-type moves become Electric-type after using Plasma Fists.)": "(使用等離子閃電拳後，一般屬性招式變為電屬性。）",
    "(Normal-type moves become Electric-type after using Ion Deluge.)": "(使用等離子浴後，一般屬性招式變為電屬性。）",
    "(Rising Voltage's BP doubled on grounded target.)": "(電力上升的傷害翻倍了。）",
    "(If a Terastallized Pokemon uses Roost, it remains Flying-type.)": "(太晶化飛行屬性的寶可夢使用此招式後，寶可夢的飛行屬性不會失去。）",
    "(In Gen 1, moves with 100% accuracy can still miss 1/256 of the time.)": "(在第一世代，100%命中率的招式仍然有1/256概率被閃避。）",
    "(Since gen 7, Dark is immune to Prankster moves.)": "(從第七世代起，惡作劇之心招式對惡系寶可夢無效。）",
    "(Fake Out only works on your first turn out.)": "(擊掌奇襲只能在出場後第一回合使用。）",
    "(First Impression only works on your first turn out.)": "(迎頭一擊只能在出場後第一回合使用。）",
    "(Mat Block only works on your first turn out.)": "(掀榻榻米只能在出場後第一回合使用。）",
    "(Future Sight did not hit because the target is fainted.)": "(預知未來沒有命中，因為目標已昏厥。）",
    "(Doom Desire did not hit because the target is fainted.)": "(破滅之願沒有命中，因為目標已昏厥。）",
    "(Psychic Terrain doesn't affect Pokemon immune to Ground.)": "(精神場地不會影響不在地面上的寶可夢。）",
    "(Grassy Terrain doesn't affect Pokemon immune to Ground.)": "(青草場地不會影響不在地面上的寶可夢。）",
    "(Electric Terrain Terrain doesn't affect Pokemon immune to Ground.)": "(電氣場地不會影響不在地面上的寶可夢。）",
    "(Misty Terrain doesn't affect Pokemon immune to Ground.)": "(薄霧場地不會影響不在地面上的寶可夢。）",
    "(A Pokemon can't switch between when it runs out of HP and when it faints)": "(當寶可夢失去所有HP倒下時，無法替換）",
    "(Some effects can force a Pokemon to use Blood Moon again in a row.)": "(某些效果可以使寶可夢連續使用血月。）",
    "(Some effects can force a Pokemon to use Gigaton Hammer again in a row.)": "(某些效果可以使寶可夢連續使用巨力錘。）",
    "(Only a Pokemon whose form is Morpeko or Morpeko-Hangry can use this move.)": "(只有莫魯貝可和莫魯貝可-空腹花紋才能使出這個招式。）",
    "(Only a Pokemon whose form is Hoopa Unbound can use this move.)": "(只有解放胡帕才能使出這個招式。）",
    "(Only a Pokemon whose form is Darkrai can use this move.)": "(只有達克萊伊才能使出這個招式。）",
    "(In Gens 3-4, Knock Off only makes the target's item unusable; it cannot obtain a new item.)": "(在第三和第四世代，拍落只會使目標的道具無效；處於拍落的寶可夢無法獲得新的道具。）",
    "(In Gen 1, the user of Explosion will not take damage if it breaks a Substitute.)": "(在第一世代，如果大爆炸打破了替身，使用者不會受到傷害。）",
    "(Previously chosen switches continue in Gen 2-4 after a Pursuit target faints.)": "(在第二至第四世代，即使追打令目標陷入瀕死也可以替換寶可夢。）",
    "Forfeiting makes you lose the battle. Are you sure?": "這樣做會使您輸掉這場戰鬥。 您確定嗎？",
    "Forfeiting makes you lose the game. Are you sure?": "這樣做會讓您輸掉遊戲。 您確定嗎？",
    "Battle timer is ON: inactive players will automatically lose when time's up.": "戰鬥計時器已開啟：玩家時間用盡則判負。",
    "Replacement player's username": "替換上場的玩家的用戶名",
    "All players are inactive.": "所有玩家都處於不活動狀態。",
    "This room is expired": "此房間已過期",
    "Close after forfeiting": "投降後關閉",
    "Replace player": "替換玩家",
    "Rated battle": "計分戰鬥",
    "Tournament battle": "錦標賽戰鬥",
    "Battle Options": "戰鬥選項",
    "In this battle": "在這場戰鬥中",
    "Ignore Spectators": "忽略來自觀戰者的消息",
    "Ignore Opponent": "忽略來自對手的消息",
    "All battles": "所有戰鬥中",
    "Ignore nicknames": "忽略寶可夢昵稱",
    "Open new battles on the right side": "在右側開啟新戰鬥視窗",
    "Close": "關閉",
    "Hardcore mode (hide info not shown in-game)": "硬核模式 (隱藏實機無法看到的信息)",
    "Waiting for players...": "等待玩家行動...",
    "Spectators ignored.": "觀戰者消息已經被忽略。",
    "Spectators no longer ignored.": "觀戰者的消息已經不再忽略。",
    "Opponent ignored.": "對手的消息已經被忽略。",
    "Opponent no longer ignored.": "對手的消息已經不再忽略。",
    "Hardcore mode ON: Information not available in-game is now hidden.": "硬核模式已開啟，實機無法看到的信息已經被隱藏。",
    "Hardcore mode OFF: Information not available in-game is now shown.": "硬核模式已關閉，實機無法看到的信息將會顯示。",
    "Nicknames ignored.": "昵稱已經被忽略。",
    "Nicknames no longer ignored.": "昵稱不再被忽略。",
    "You must choose a username before you challenge someone.": "在挑戰某人之前，您必須輸入用戶名。",
    "Your replay has been uploaded! It's available at:": "您的回放已上傳！可從以下網址獲取：",
    "Ignore spectators": "忽略觀眾",
    "Ignore opponent": "忽略對手",
    "Automatically start timer": "自動啟動計時器",
    "A soothing aroma wafted through the area!": "怡人的香氣擴散了開來！",
    "A bell chimed!": "鈴聲響徹四周！",
    "No matched formats found.": "沒有找到該規則。",
    "This battle needs more players to start": "需要更多的玩家才能開始這場戰鬥",
    "Add Player": "新增玩家",
    "User not found.": "沒有找到該用戶",
    "Calls": "調用了",
    "Accept tie": "同意平局",
    "You have already agreed to a tie.": "你已經發送了平局請求。",
    "It's too early to tie, please play until turn 100.": "現在平局為時過早，請先打到100回合。",
    "(Special Shell Side Arm)": "(特殊傷害臂貝武器)",
    "(Physical Shell Side Arm)": "(物理傷害臂貝武器)",
    "Curious what those medals under the avatar are? PS now has Ladder Seasons! For more information, check out the": "好奇頭像下方的獎牌是什麼嗎？現在是PS的排行賽季！更多有關信息，請查看 ",











    //  戰鬥UI



    "/ Def": " / 防禦 ",
    "/ Spc": " / 特殊 ",
    "/ SpA": " / 特攻 ",
    "/ SpD": " / 特防 ",
    "/ Spe": " / 速度 ",

    "(More than 4 moves is usually a sign of Illusion Zoroark/Zorua.) (Your opponent has two indistinguishable Pokemon, making it impossible for you to tell which one has which moves/ability/item.)": "(超過4個招式通常是索羅亞克/索羅亞的幻覺的征兆。) (你的對手有兩個無法區分的寶可夢，你無法分辨哪一個有哪一個的招式/特性/道具。)",
    "(More than 4 moves is usually a sign of Illusion Zoroark/Zorua.)": "(超過4個招式通常是索羅亞克/索羅亞的幻覺的征兆。)",
    "(Your opponent has two indistinguishable Pokemon, making it impossible for you to tell which one has which moves/ability/item.)": "(你的對手有兩個無法區分的寶可夢，你無法分辨哪一個有哪一個的招式/特性/道具。)",
    "(Pressure is not visible in Gen 3, so in certain situations, more PP may have been lost than shown here.)": "(壓迫感在第三世代中不可見，因此有時失去的PP可能比此處顯示的更多。）",
    "Accuracy: can't miss (No Guard)": "命中: 必中 (無防守)",
    "Accuracy: can't miss (Poison type)": "命中: 必中 (毒屬性)",
    "Accuracy: 50% (Sunny Day)": "命中: 50% (大晴天)",
    "Accuracy: 50% (Desolate Land)": "命中: 50% (大日照)",
    "Accuracy: can't miss (Hail)": "命中: 必中 (冰雹)",
    "Accuracy: can't miss (Snow)": "命中: 必中 (下雪)",
    "Accuracy: can't miss (Rain Dance)": "命中: 必中 (下雨)",
    "Accuracy: can't miss (Primordial Sea)": "命中: 必中 (大雨)",
    "Accuracy: can't miss": "命中: 必中",
    "Accuracy": "命中率",

    "PSN": "中毒",
    "SLP": "睡眠",
    "PAR": "麻痹",
    "BRN": "灼傷",
    "FRZ": "冰凍",
    "TOX": "劇毒",

    "(After stat modifiers:)": "(能力變化之後：）",
    "(no weather)": "(沒有天氣變化)",
    "(no conditions)": "(沒有場地狀態)",
    "Ability:": "特性：",
    "Item:": "道具：",
    "(suppressed)": " (無效了)",
    "(fainted)": " (瀕死)",
    "Possible abilities:": "可能的特性：",
    "How will you start the battle?": "你將如何戰鬥？",
    "What about the rest of your team?": "你隊伍的其他成員？",
    "Choose a Pokemon for slot 2": "選擇2號寶可夢",
    "Choose a Pokemon for slot 3": "選擇3號寶可夢",
    "Choose a Pokemon for slot 4": "選擇4號寶可夢",
    "Choose a Pokemon for slot 5": "選擇5號寶可夢",
    "Choose a Pokemon for slot 6": "選擇6號寶可夢",
    "What will": " ",
    "do?": "該怎麼辦? ",
    "to:": ":",
    "Strong Winds": "亂流",
    "Intense Sun": "大日照",
    "Heavy Rain": "大雨",
    "Sun": "大晴天 ",
    "Rain": "下雨 ",
    "Snow": "下雪 ",

    "(5 or 8 turns)": " (5 或 8 回合)",
    "(4 or 7 turns)": " (4 或 7 回合)",
    "(3 or 6 turns)": " (3 或 6 回合)",
    "(2 or 5 turns)": " (2 或 5 回合)",
    "(1 or 4 turns)": " (1 或 4 回合)",
    "(5 turns)": " (5 回合)",
    "(4 turns)": " (4 回合)",
    "(3 turns)": " (3 回合)",
    "(2 turns)": " (2 回合)",
    "(1 turn)": " (1 回合)",

    "Foe's Reflect": "對手的反射壁",
    "Foe's Light Screen": "對手的光牆",
    "Foe's Aurora Veil": "對手的極光幕",
    "Foe's Tailwind": "對手的順風",
    "Foe's Lucky Chant": "對手的幸運咒語",
    "Foe's Safeguard": "對手的神秘守護",
    "Foe's Mist": "對手的白霧",
    "Foe's G-Max Wildfire": "對手的超極巨地獄滅焰",
    "Foe's G-Max Cannonade": "對手的超極巨水炮轟滅",
    "Foe's G-Max Vine Lash": "對手的超極巨灰飛鞭滅",
    "Foe's G-Max Volcalith": "對手的超極巨炎石噴發",
    "Foe's Sea of Fire": "對手的火海",
    "Foe's Swamp": "對手的濕地",
    "Foe's Rainbow": "對手的彩虹",
    "Sea of Fire": "火海",
    "Swamp": "濕地",
    "Rainbow": "彩虹",

    "(Type changed)": "(屬性改變了)",
    "(Tera Type:": "(太晶屬性: ",
    "(base:": "(原本的屬性: ",
    "Choose Lead": "選擇首發",
    "(exists)": "(存在)",
    "Base power:": "威力：",
    "Back": "返回",
    "At who?": " 對誰使用？",
    "You are trapped and cannot switch!": "你被困住了，無法切換！",
    "(Terastallized)": "(太晶化)",
    "Choose a fainted Pokemon to revive!": "復活一只瀕死的寶可夢！",
    "Revive": "復活",
    "Cursed": "詛咒",
    "Transformed": "變身",
    "Syrupy": "滿身糖",
    "Start timer": "開始計時",
    "Stop timer": "停止計時",
    "Timer": "計時器",
    "closes this battle": "結束這場戰鬥",
    "Dynamax": "極巨化",
    "Dynamaxed": "極巨化",
    "Terastallize": "太晶化",
    "Main menu": "返回主頁",
    "Rematch": "重新挑戰對手",
    "(before items/abilities/modifiers)": " (計算道具/特性/能力階級之前)",
    "Burn": "灼傷",
    "Facade + status": "硬撐+異常狀態",
    "Terrain boost": "場地",
    "Acrobatics + no item": "雜技+沒有道具",
    "Terrain Pulse boost": "大地波動",
    "Choose a Pokemon to send to battle!": "派出一個寶可夢加入戰鬥！",
    "Which Pokemon will it switch in for?": "它將替換哪個寶可夢？",

    "Expanding Force + Psychic Terrain boost": "廣域戰力+精神場地",
    "Rising Voltage + Electric Terrain boost": "電力上升+電氣場地",
    "Misty Explosion + Misty Terrain boost": "薄霧炸裂+薄霧場地",
    "Misty Terrain + grounded target": "薄霧場地且目標處於地面上",
    "Grassy Terrain + grounded target": "青草場地且目標處於地面上",
    "Fairy Aura + Aura Break": "妖精氣場+氣場破壞",
    "Dark Aura + Aura Break": "暗黑氣場+氣場破壞",
    "Brine + target below half HP": "鹽水+目標體力低於一半",

    "Super-effective": "效果絕佳",
    "Resisted": "效果不好",
    "Immune": "沒有效果",
    "Critical hit": "要害",
    "Missed": "沒中",
    "Flinched": "畏縮",
    "Paralyzed": "麻痹",
    "Burned": "灼傷",
    "Toxic poison": "劇毒",
    "Poisoned": "中毒",
    "Asleep": "睡著",
    "Frozen": "凍住",
    "Thawed": "解凍",
    "Confused": "混亂",
    "Poison cured": "治癒了中毒",
    "Freeze cured": "治癒了冰凍",
    "Burn cured": "治癒了灼傷",
    "Paralyz cured": "治癒了麻痹",
    "Paralysis cured": "治癒了麻痹",
    "Team Cured": "治癒了隊伍",
    "Protected": "守住",
    "Stats reset": "能力變化歸零",
    "Stats swapped": "交換了能力變化",
    "Failed": "失敗",
    "Trap set": "陷阱甲殼",
    "Encoreed": "再來一次",
    "Disabled": "定身法",
    "Ingrained": "紮根",
    "Cursed": "詛咒",
    "Drowsy": "瞌睡",
    "Balloon": "氣球",
    "Sash": "披帶",
    "Band": "頭帶",
    "Lightened": "身輕如燕",
    "Stockpile×2": "蓄力×2",
    "Stockpile×3": "蓄力×3",
    "Infatuation": "著迷",
    "Attracted": "迷人",
    "Tormented": "無理取鬧",
    "Transformed": "變身",
    "Smacked Down": "擊落",
    "Focusing": "聚精會神",
    "Lost focus": "失去了聚氣",
    "Encored": "再來一次",
    "Enduring": "挺住",
    "Faded": "消失了",
    "Woke up": "醒過來了",
    "Landed": "降落了",
    "Taunted": "被挑釁了",
    "Damage": "承受了攻擊",
    "Immobilized": "不能行動",
    "Balloon popped": "氣球破了",
    "Boosts lost": "失去了能力變化",
    "Protection broken": "突破了守住",
    "+Crit rate": "擊中要害率提升",
    "Item Stolen": "物品被盜取了",
    "Stats inverted": "能力顛倒",
    "Restored": "復原了",
    "Slow Start ended": "慢啟動結束了",
    "Imprisoning": "正在封印",

     //  戰鬥技能描述

    "The user thaws out if it is frozen.": "成功使出該招式可以解除冰凍。",
    "Nearly always moves last": "幾乎總是後手行動 ",
    "Nearly always moves first": "幾乎總是先手行動 ",
    "Usually moves first": "通常會先手行動 ",
    "Bypasses Substitute": "無視替身 ",
    "(but does not break it)": "(但不會破壞它)",
    "Not blocked by Protect": "不會被守住",
    "(and Detect, King's Shield, Spiky Shield)": "(看穿，王者盾牌，尖刺防守等)所阻擋",
    "✓ Sound": "✓ 聲音類招式 ",
    "(doesn't affect Soundproof pokemon)": "(不會影響隔音寶可夢)",
    "✓ Wind": "✓ 風的招式 ",
    "(activates Wind Power and Wind Rider)": "(會觸發風力發電和乘風)",
    "✓ Bullet-like": "✓ 球和彈類招式 ",
    "(doesn't affect Bulletproof pokemon)": "(不會影響防彈寶可夢)",
    "✓ Contact": "✓ 接觸類招式 ",
    "(triggers Iron Barbs, Spiky Shield, etc)": "(會觸發鐵刺, 尖刺防守等效果)",
    "✓ Not bounceable": "✓ 不能反彈 ",
    "(can't be bounced by Magic Coat/Bounce)": "(魔法反射和魔法鏡無法反彈)",
    "✓ Slicing": "✓ 切割類招式 ",
    "(boosted by Sharpness)": "(鋒銳會提高招式威力)",
    "✓ Fist": "✓ 拳類招式 ",
    "(boosted by Iron Fist)": "(鐵拳會提高招式威力)",
    "✓ Powder": "✓ 粉末類招式 ",
    "(doesn't affect Grass, Overcoat, Safety Goggles)": "(不會影響防塵，防塵護目鏡，草系寶可夢)",
    "✓ Bite": "✓ 啃咬類招式 ",
    "(boosted by Strong Jaw)": "(強壯之顎會提高招式威力)",
    "✓ Recoil": "✓ 具有反作用力傷害的招式 ",
    "(boosted by Reckless)": "(捨身會提高招式威力)",
    "✓ Pulse": "✓ 波動和波導類招式 ",
    "(boosted by Mega Launcher)": "(超級發射器會提高招式威力)",
    "◎ Hits both foes and ally.": "◎ 同時攻擊對手和同伴。",
    "◎ Hits both foes.": "◎ 同時攻擊兩個對手。",
    "Raises the user's Attack by 1 stage.": "令使用者的攻擊提升1級。",
    "Raises the user's Defense by 1 stage.": "令使用者的防禦提升1級。",
    "Raises the user's Special Attack by 1 stage.": "令使用者的特攻提升1級。",
    "Raises the user's Special Defense by 1 stage.": "令使用者的特防提升1級。",
    "Raises the user's Speed by 1 stage.": "令使用者的速度提升1級。",
    "Raises the user's evasiveness by 1 stage.": "令使用者的閃避率提升1級。",
    "Raises the user's Attack by 2 stages.": "令使用者的攻擊提升2級。",
    "Raises the user's Defense by 2 stages.": "令使用者的防禦提升2級。",
    "Raises the user's Special Attack by 2 stages.": "令使用者的特攻提升2級。",
    "Raises the user's Special Defense by 2 stages.": "令使用者的特防提升2級。",
    "Raises the user's Speed by 2 stages.": "令使用者的速度提升2級。",
    "Raises the user's evasiveness by 2 stages.": "令使用者的閃避率提升2級。",
    "Raises the user's Attack by 3 stages.": "令使用者的攻擊提升3級。",
    "Raises the user's Defense by 3 stages.": "令使用者的防禦提升3級。",
    "Raises the user's Special Attack by 3 stages.": "令使用者的特攻提升3級。",
    "Raises the user's Special Defense by 3 stages.": "令使用者的特防提升3級。",
    "Raises the user's Speed by 3 stages.": "令使用者的速度提升3級。",
    "Raises the user's evasiveness by 3 stages.": "令使用者的閃避率提升3級。",
    "Raises the user's Attack and Defense by 1 stage.": "令使用者的攻擊和防禦提升1級。",
    "Raises the user's Attack and accuracy by 1 stage.": "令使用者的攻擊和命中提升1級。",
    "Raises the user's Attack and Speed by 1 stage.": "令使用者的攻擊和速度提升1級。",
    "Raises the user's Defense and Special Defense by 1 stage.": "令使用者的防禦和特防提升1級。",
    "Raises the user's Special Attack and Special Defense by 1 stage.": "令使用者的特攻和特防提升1級。",
    "Raises the user's Attack, Defense, and Speed by 1 stage.": "令使用者的攻擊、防禦和速度提升1級。",
    "Raises the user's Special Attack, Special Defense, and Speed by 1 stage.": "令使用者的特攻、特防和速度提升1級。",
    "Raises the user's Attack, Defense, and accuracy by 1 stage.": "令使用者的攻擊、防禦和命中提升1級。",
    "Raises the user's Speed by 2 stages and its Attack by 1 stage.": "令使用者的速度提升2級，攻擊提升1級。",
    "Has a 10% chance to raise the user's Attack by 1 stage.": "有10%幾率令使用者的攻擊提升1級。",
    "Has a 10% chance to raise the user's Defense by 1 stage.": "有10%幾率令使用者的防禦提升1級。",
    "Has a 10% chance to raise the user's Special Attack by 1 stage.": "有10%幾率令使用者的特攻提升1級。",
    "Has a 10% chance to raise the user's Special Defense by 1 stage.": "有10%幾率令使用者的特防提升1級。",
    "Has a 10% chance to raise the user's Speed by 1 stage.": "有10%幾率令使用者的速度提升1級。",
    "Has a 20% chance to raise the user's Attack by 1 stage.": "有20%幾率令使用者的攻擊提升1級。",
    "Has a 20% chance to raise the user's Defense by 1 stage.": "有20%幾率令使用者的防禦提升1級。",
    "Has a 20% chance to raise the user's Special Attack by 1 stage.": "有20%幾率令使用者的特攻提升1級。",
    "Has a 20% chance to raise the user's Special Defense by 1 stage.": "有20%幾率令使用者的特防提升1級。",
    "Has a 20% chance to raise the user's Speed by 1 stage.": "有20%幾率令使用者的速度提升1級。",
    "Has a 30% chance to raise the user's Attack by 1 stage.": "有30%幾率令使用者的攻擊提升1級。",
    "Has a 30% chance to raise the user's Defense by 1 stage.": "有30%幾率令使用者的防禦提升1級。",
    "Has a 30% chance to raise the user's Special Attack by 1 stage.": "有30%幾率令使用者的特攻提升1級。",
    "Has a 30% chance to raise the user's Special Defense by 1 stage.": "有30%幾率令使用者的特防提升1級。",
    "Has a 30% chance to raise the user's Speed by 1 stage.": "有30%幾率令使用者的速度提升1級。",
    "Has a 50% chance to raise the user's Attack by 1 stage.": "有50%幾率令使用者的攻擊提升1級。",
    "Has a 50% chance to raise the user's Defense by 1 stage.": "有50%幾率令使用者的防禦提升1級。",
    "Has a 50% chance to raise the user's Special Attack by 1 stage.": "有50%幾率令使用者的特攻提升1級。",
    "Has a 50% chance to raise the user's Special Defense by 1 stage.": "有50%幾率令使用者的特防提升1級。",
    "Has a 50% chance to raise the user's Speed by 1 stage.": "有50%幾率令使用者的速度提升1級。",
    "Has a 100% chance to raise the user's Attack by 1 stage.": "100%幾率令使用者的攻擊提升1級。",
    "Has a 100% chance to raise the user's Defense by 1 stage.": "100%幾率令使用者的防禦提升1級。",
    "Has a 100% chance to raise the user's Special Attack by 1 stage.": "100%幾率令使用者的特攻提升1級。",
    "Has a 100% chance to raise the user's Special Defense by 1 stage.": "100%幾率令使用者的特防提升1級。",
    "Has a 50% chance to raise the user's Defense by 2 stages.": "有50%幾率令使用者的防禦提升2級。",
    "Has a 70% chance to raise the user's Special Attack by 1 stage.": "有70%幾率令使用者的特攻提升1級。",
    "Has a 100% chance to raise the user's Speed by 1 stage and a higher chance for a critical hit.": "100%幾率令使用者的速度提升1級。容易擊中要害。",
    "Has a 100% chance to raise the user's Speed by 1 stage.": "100%幾率令使用者的速度提升1級。",
    "Has a 10% chance to raise the user's Attack, Defense, Special Attack, Special Defense, and Speed by 1 stage.": "有10%幾率令使用者的攻擊、防禦、特攻、特防和速度提升1級。",
    "Has a 10% chance to lower the target's Attack by 1 stage.": "有10%幾率令目標的攻擊降低1級。",
    "Has a 10% chance to lower the target's Defense by 1 stage.": "有10%幾率令目標的防禦降低1級。",
    "Has a 10% chance to lower the target's Special Attack by 1 stage.": "有10%幾率令目標的特攻降低1級。",
    "Has a 10% chance to lower the target's Special Defense by 1 stage.": "有10%幾率令目標的特防降低1級。",
    "Has a 10% chance to lower the target's Speed by 1 stage.": "有10%幾率令目標的速度降低1級。",
    "Has a 20% chance to lower the target's Attack by 1 stage.": "有20%幾率令目標的攻擊降低1級。",
    "Has a 20% chance to lower the target's Defense by 1 stage.": "有20%幾率令目標的防禦降低1級。",
    "Has a 20% chance to lower the target's Special Attack by 1 stage.": "有20%幾率令目標的特攻降低1級。",
    "Has a 20% chance to lower the target's Special Defense by 1 stage.": "有20%幾率令目標的特防降低1級。",
    "Has a 20% chance to lower the target's Speed by 1 stage.": "有20%幾率令目標的速度降低1級。",
    "Has a 30% chance to lower the target's Attack by 1 stage.": "有30%幾率令目標的攻擊降低1級。",
    "Has a 30% chance to lower the target's Defense by 1 stage.": "有30%幾率令目標的防禦降低1級。",
    "Has a 30% chance to lower the target's Special Attack by 1 stage.": "有30%幾率令目標的特攻降低1級。",
    "Has a 30% chance to lower the target's Special Defense by 1 stage.": "有30%幾率令目標的特防降低1級。",
    "Has a 30% chance to lower the target's Speed by 1 stage.": "有30%幾率令目標的速度降低1級。",
    "Has a 33% chance to lower the target's Attack by 1 stage.": "有33%幾率令目標的攻擊降低1級。",
    "Has a 33% chance to lower the target's Defense by 1 stage.": "有33%幾率令目標的防禦降低1級。",
    "Has a 33% chance to lower the target's Special Attack by 1 stage.": "有33%幾率令目標的特攻降低1級。",
    "Has a 33% chance to lower the target's Special Defense by 1 stage.": "有33%幾率令目標的特防降低1級。",
    "Has a 33% chance to lower the target's Special by 1 stage.": "有33%幾率令目標的特殊降低1級。",
    "Has a 33% chance to lower the target's Speed by 1 stage.": "有33%幾率令目標的速度降低1級。",
    "Has a 50% chance to lower the target's Attack by 1 stage.": "有50%幾率令目標的攻擊降低1級。",
    "Has a 50% chance to lower the target's Defense by 1 stage.": "有50%幾率令目標的防禦降低1級。",
    "Has a 50% chance to lower the target's Special Attack by 1 stage.": "有50%幾率令目標的特攻降低1級。",
    "Has a 50% chance to lower the target's Special Defense by 1 stage.": "有50%幾率令目標的特防降低1級。",
    "Has a 50% chance to lower the target's Speed by 1 stage.": "有50%幾率令目標的速度降低1級。",
    "Has a 100% chance to lower the target's Attack by 1 stage.": "100%幾率令目標的攻擊降低1級。",
    "Has a 100% chance to lower the target's Defense by 1 stage.": "100%幾率令目標的防禦降低1級。",
    "Has a 100% chance to lower the target's Special Attack by 1 stage.": "100%幾率令目標的特攻降低1級。",
    "Has a 100% chance to lower the target's Special Defense by 1 stage.": "100%幾率令目標的特防降低1級。",
    "Has a 100% chance to lower the target's Speed by 1 stage.": "100%幾率令目標的速度降低1級。",
    "Has a 100% chance to lower the target's Special Defense by 2 stages.": "100%幾率令目標的特防降低2級。",
    "Has a 30% chance to lower the target's accuracy by 1 stage.": "有30%幾率令目標的命中率降低1級。",
    "Has a 33% chance to lower the target's accuracy by 1 stage.": "有33%幾率令目標的命中率降低1級。",
    "Has a 50% chance to lower the target's accuracy by 1 stage.": "有50%幾率令目標的命中率降低1級。",
    "Has a 100% chance to lower the target's accuracy by 1 stage.": "100%幾率令目標的命中率降低1級。",
    "Has a 40% chance to lower the target's Special Defense by 2 stages.": "有40%幾率令目標的特防降低2級。",
    "Damage doubles if the target is using Dig.": "對正在挖洞的目標造成雙倍傷害。",
    "Damage doubles if the target is using Dive.": "對正在潛水的目標造成雙倍傷害。",
    "Damage doubles if the target is using Fly.": "對正在飛翔的目標造成雙倍傷害。",
    "The user faints after using this move, even if this move fails for having no target. This move is prevented from executing if any active Pokemon has the Damp Ability.": "自身陷入瀕死狀態並攻擊目標造成傷害，即使招式沒有產生效果，使用者仍然會陷入瀕死狀態。有濕氣特性的寶可夢在場時，使用失敗。",
    "The user faints after using this move. The target's Defense is halved during damage calculation. This move is prevented from executing if any active Pokemon has the Damp Ability.": "自身陷入瀕死狀態然後攻擊目標造成傷害，將目標的防禦能力值減半計算。有濕氣特性的寶可夢在場時，使用失敗。",
    "The user faints after using this move, unless this move has no target. The target's Defense is halved during damage calculation. This move is prevented from executing if any active Pokemon has the Damp Ability.": "如果有目標，自身陷入瀕死狀態然後攻擊目標造成傷害，將目標的防禦能力值減半計算。有濕氣特性的寶可夢在場時，使用失敗。",
    "Lowers the user's Attack by 1 stage.": "令使用者的攻擊降低1級。",
    "Lowers the user's Defense by 1 stage.": "令使用者的防禦降低1級。",
    "Lowers the user's Special Attack by 1 stage.": "令使用者的特攻降低1級。",
    "Lowers the user's Special Defense by 1 stage.": "令使用者的特防降低1級。",
    "Lowers the user's Speed by 1 stage.": "令使用者的速度降低1級。",
    "Lowers the user's Attack by 2 stages.": "令使用者的攻擊降低2級。",
    "Lowers the user's Defense by 2 stages.": "令使用者的防禦降低2級。",
    "Lowers the user's Special Attack by 2 stages.": "令使用者的特攻降低2級。",
    "Lowers the user's Special Defense by 2 stages.": "令使用者的特防降低2級。",
    "Lowers the user's Speed by 2 stages.": "令使用者的速度降低2級。",
    "Lowers the user's Attack and Defense by 1 stage.": "令使用者的攻擊和防禦降低1級。",
    "Lowers the user's Defense and Special Defense by 1 stage.": "令使用者的防禦和特防降低1級。",
    "If this move is successful, the user must recharge on the following turn and cannot select a move.": "如果成功使出該招式，下一回合無法動彈且必須恢覆精力。",
    "Lowers the target's Attack by 1 stage.": "令目標的攻擊降低1級。",
    "Lowers the target's Defense by 1 stage.": "令目標的防禦降低1級。",
    "Lowers the target's Special Attack by 1 stage.": "令目標的特攻降低1級。",
    "Lowers the target's Special Defense by 1 stage.": "令目標的特防降低1級。",
    "Lowers the target's Speed by 1 stage.": "令目標的速度降低1級。",
    "Lowers the target's accuracy by 1 stage.": "令目標的命中率降低1級。",
    "Lowers the target's evasiveness by 1 stage.": "令目標的閃避率降低1級。",
    "Lowers the target's Attack by 2 stages.": "令目標的攻擊降低2級。",
    "Lowers the target's Defense by 2 stages.": "令目標的防禦降低2級。",
    "Lowers the target's Special Attack by 2 stages.": "令目標的特攻降低2級。",
    "Lowers the target's Special Defense by 2 stages.": "令目標的特防降低2級。",
    "Lowers the target's Speed by 2 stages.": "令目標的速度降低2級。",
    "Lowers the target's accuracy by 2 stages.": "令目標的命中率降低2級。",
    "Lowers the target's evasiveness by 2 stages.": "令目標的閃避率降低2級。",
    "Lowers the target's Attack by 3 stages.": "令目標的攻擊降低3級。",
    "Lowers the target's Defense by 3 stages.": "令目標的防禦降低3級。",
    "Lowers the target's Special Attack by 3 stages.": "令目標的特攻降低3級。",
    "Lowers the target's Special Defense by 3 stages.": "令目標的特防降低3級。",
    "Lowers the target's Speed by 3 stages.": "令目標的速度降低3級。",
    "Lowers the target's accuracy by 3 stages.": "令目標的命中率降低3級。",
    "Lowers the target's evasiveness by 3 stages.": "令目標的閃避率降低3級。",
    "Lowers the target's Speed by 1 stage and poisons it.": "降低目標的速度1級並令其陷入中毒狀態。",
    "Has a 10% chance to freeze the target. This move's type effectiveness against Water is changed to be super effective no matter what this move's type is.": "有10%幾率使目標陷入冰凍。對於水屬性寶可夢也是效果絕佳。",
    "Has a 10% chance to freeze the target. If the weather is Snow, this move does not check accuracy.": "有10%幾率使目標陷入冰凍。下雪時必定命中。",
    "Has a 10% chance to freeze the target. If the weather is Hail, this move does not check accuracy.": "有10%幾率使目標陷入冰凍。冰雹時必定命中。",
    "Has a 10% chance to freeze the target.": "有10%幾率使目標陷入冰凍狀態。",
    "Has a 30% chance to make the target flinch.": "有30%幾率使目標陷入畏縮狀態。",
    "Has a 20% chance to make the target flinch.": "有20%幾率使目標陷入畏縮狀態。",
    "Has a 10% chance to make the target flinch.": "有10%幾率使目標陷入畏縮狀態。",
    "Has a 100% chance to burn the target.": "100%幾率使目標陷入灼傷狀態。",
    "Has a 50% chance to burn the target.": "有50%幾率使目標陷入灼傷狀態。",
    "Has a 30% chance to burn the target.": "有30%幾率使目標陷入灼傷狀態。",
    "Has a 20% chance to burn the target.": "有20%幾率使目標陷入灼傷狀態。",
    "Has a 10% chance to burn the target.": "有10%幾率使目標陷入灼傷狀態。",
    "Has a 100% chance to paralyze the target.": "100%幾率使目標陷入麻痹狀態。",
    "Has a 50% chance to paralyze the target.": "有50%幾率使目標陷入麻痹狀態。",
    "Has a 30% chance to paralyze the target.": "有30%幾率使目標陷入麻痹狀態。",
    "Has a 20% chance to paralyze the target.": "有20%幾率使目標陷入麻痹狀態。",
    "Has a 10% chance to paralyze the target.": "有10%幾率使目標陷入麻痹狀態。",
    "Has a 50% chance to badly poison the target.": "有50%幾率使目標陷入劇毒狀態。",
    "Has a 40% chance to poison the target.": "有40%幾率使目標陷入中毒狀態。",
    "Has a 30% chance to poison the target.": "有30%幾率使目標陷入中毒狀態。",
    "Has a 10% chance to poison the target.": "有10%幾率使目標陷入中毒狀態。",
    "Has a 10% chance to poison the target and a higher chance for a critical hit.": "有10%幾率使目標陷入中毒狀態。容易擊中要害。",
    "Has a 10% chance to confuse the target.": "有10%幾率使目標陷入混亂狀態。",
    "Has a 20% chance to confuse the target.": "有20%幾率使目標陷入混亂狀態。",
    "Has a 30% chance to confuse the target.": "有30%幾率使目標陷入混亂狀態。",
    "Has a 50% chance to confuse the target.": "有50%幾率使目標陷入混亂狀態。",
    "Has a 100% chance to confuse the target.": "100%幾率使目標陷入混亂狀態。",
    "Has a 100% chance to poison the foe.": "100%幾率使對手陷入中毒狀態。",
    "Has a 100% chance to flinch the foe.": "100%幾率使對手陷入畏縮狀態。",
    "Has a 100% chance to freeze the foe.": "100%幾率使對手陷入冰凍狀態。",
    "Has a 100% chance to burn the foe.": "100%幾率使對手陷入灼傷狀態。",
    "Has a 100% chance to paralyze the foe.": "100%幾率使對手陷入麻痹狀態。",
    "Has a 100% chance to make the target flinch. Fails unless it is the user's first turn on the field.": "100%幾率使目標陷入畏縮狀態。出場後立刻使出才能成功，否則招式會失敗。",
    "Fails unless it is the user's first turn on the field.": "出場後立刻使出才能成功，否則招式會失敗。",
    "Deals damage to the target equal to the user's level.": "對目標造成與使用者等級相等的傷害。",
    "Power is equal to 20+(X*20), where X is the user's total stat stage changes that are greater than 0.": "自身每有一項能力變化提升一級，招式威力增加20。自身的能力降低不會影響此招式的威力。",
    "Power is equal to (user's current HP * 150 / user's maximum HP), rounded down, but not less than 1.": "威力=150×(使用者當前HP/使用者全部HP)，向下取整。威力至少為1。",
    "Damage is calculated using the user's Defense stat as its Attack, including stat stage changes. Other effects that modify the Attack stat are used as normal.": "使用自身的防禦代替自身的攻擊進行傷害計算。能影響撲擊傷害的因素：防禦能力變化、灼傷、講究頭帶、增加攻擊的特性。",
    "Raises the user's Speed by 2 stages. If the user's Speed was changed, the user's weight is reduced by 100 kg as long as it remains active. This effect is stackable but cannot reduce the user's weight to less than 0.1 kg.": "令使用者的速度提升2級。同時令使用者的體重降低100kg，最多下降至0.1kg。",
    "Badly poisons the target. If a Poison-type Pokemon uses this move, the target cannot avoid the attack, even if the target is in the middle of a two-turn move.": "使目標陷入劇毒狀態。毒屬性寶可夢使用劇毒一定會命中，除非目標正在使用蓄力的招式並不在場地上。",
    "Paralyzes the target. This move does not ignore type immunity.": "使目標陷入麻痹狀態。對屬性相性是0倍的目標無效。",
    "The user restores 1/2 of its maximum HP, rounded half up.": "回復使用者1/2的HP，向上取整一半。",
    "At the end of the next turn, the Pokemon at the user's position has 1/2 of the user's maximum HP restored to it, rounded down. Fails if this move is already in effect for the user's position.": "陷入祈願狀態，下回合結束時，回復自身或是替換出場的寶可夢1/2的最大HP。如果已處於祈願狀態，使用祈願會失敗。",
    "Deals damage to the target equal to (target's current HP - user's current HP). The target is unaffected if its current HP is less than or equal to the user's current HP.": "對目標造成（目標HP-使用者HP）的傷害。目標HP不高於使用者HP時會使用失敗。",
    "Power doubles if the user moves before the target.": "如果比對手先出手攻擊，招式威力翻倍。",
    "Lowers the user's Defense and Special Defense by 1 stage. Raises the user's Attack, Special Attack, and Speed by 2 stages.": "令使用者的防禦和特防降低1級。令使用者的攻擊和特攻提高2級。",
    "Has a higher chance for a critical hit.": "容易擊中要害。",
    "Power doubles if the user was hit by the target this turn.": "如果本回合內被目標攻擊並被造成了傷害，威力翻倍。",
    "Hits three times. This move is always a critical hit unless the target is under the effect of Lucky Chant or has the Battle Armor or Shell Armor Abilities.": "連續攻擊3次。攻擊必定擊中要害，除非目標擁有戰鬥盔甲、硬殼盔甲特性或處於幸運咒語的保護之下。",
    "This attack charges on the first turn and executes on the second. Raises the user's Special Attack by 1 stage on the first turn. If the user is holding a Power Herb, the move completes in one turn.": "在第一回合進行蓄力，同時令使用者的特攻提升1級，在第二回合攻擊目標。如果攜帶了強力香草，可以立刻結束蓄力，在第一回合發動招式。",
    "If this move is successful, the user loses 1/2 of its maximum HP, rounded up, unless the user has the Magic Guard Ability.": "對使用者造成最大HP的1/2傷害，向上取整。除非使用者具有魔法防守特性。",
    "Deals damage to the target equal to half of its current HP, rounded down, but not less than 1 HP.": "對目標造成目標當前HP1/2（向下取整）的傷害。至少造成1傷害。",
    "Fails if the target did not select a physical attack, special attack, or Me First for use this turn, or if the target moves before the user.": "如果目標在本回合沒有選擇攻擊招式或搶先一步，或本回合已經行動，使用失敗。",
    "If the current weather is Sunny Day and the user is not holding Utility Umbrella, this move's damage is multiplied by 1.5 instead of halved for being Water type.": "天氣為大晴天時且使用者沒有攜帶萬能傘，招式威力不但不會降低，還會提升為1.5倍。",
    "Deals damage to the target based on its Defense instead of Special Defense.": "使用目標的防禦代替目標的特防進行傷害計算。",
    "Ignores the target's stat stage changes, including evasiveness.": "此招式在攻擊時無視目標的能力變化，包括閃避率。",
    "Power is equal to 50+(X*50), where X is the total number of times any Pokemon has fainted on the user's side, and X cannot be greater than 100.": "我方每有一只寶可夢陷入過瀕死狀態，招式的威力提升50。最多提升100次。",
    "If this attack does not miss, the effects of Reflect, Light Screen, and Aurora Veil end for the target's side of the field before damage is calculated.": "如果攻擊沒有被閃避，在造成傷害之前破壞對方場地的光牆、反射壁和極光幕。",
    "If this attack does not miss, the effects of Reflect and Light Screen end for the target's side of the field before damage is calculated.": "如果攻擊沒有被閃避，在造成傷害之前破壞對方場地的光牆和反射壁。",
    "If this attack does not miss and whether or not the target is immune, the effects of Reflect and Light Screen end for the target's side of the field before damage is calculated.": "如果攻擊沒有被閃避，即使免疫此攻擊也會在造成傷害之前破壞對方場地的光牆和反射壁。",
    "Hits twice. If the first hit breaks the target's substitute, it will take damage for the second hit. This move does not check accuracy.": "連續攻擊2次。如果第一下打破了替身，招式會繼續攻擊並造成傷害。攻擊必定會命中。",
    "Hits twice. If the first hit breaks the target's substitute, it will take damage for the second hit.": "連續攻擊2次。如果第一下打破了替身，招式會繼續攻擊並造成傷害。",
    "Hits twice. If the first hit breaks the target's substitute, it will take damage for the second hit. Has a 30% chance to make the target flinch.": "連續攻擊2次。如果第一下打破了替身，招式會繼續攻擊並造成傷害。30%幾率使目標陷入畏縮狀態。",
    "Raises the user's Attack by 12 stages in exchange for the user losing 1/2 of its maximum HP, rounded down. Fails if the user would faint or if its Attack stat stage is 6.": "使用者損失最大HP的1/2（向下取整）,提升12級攻擊。如果使用者自身HP不足1/2或攻擊能力等級已為6級，招式使用失敗。",
    "Raises the target's Attack and Special Attack by 2 stages.": "提升目標2級攻擊和特攻。",
    "Raises the user's Special by 2 stages.": "令使用者的特殊提升2級。",
    "Raises the user's Special by 1 stage.": "令使用者的特殊提升1級。",
    "Lowers the target's Attack and Special Attack by 1 stage.": "令目標的攻擊和特攻降低1級。",
    "Raises the target's Attack by 2 stages and confuses it.": "提升目標2級攻擊並令其陷入混亂狀態。",
    "Has a 40% chance to lower the target's accuracy by 1 stage.": "有40%幾率令目標的命中率降低1級。",
    "Lowers the target's Attack and Defense by 1 stage.": "令目標的攻擊和防禦降低1級。",
    "Has a 100% chance to raise the user's evasion by 1 stage.": "100%幾率令使用者的閃避率提升1級。",
    "Damage is multiplied by 1.3333 if this move is super effective against the target.": "攻擊目標造成傷害，招式出現效果絕佳時威力提升33%。",
    "If the user has not fainted, the target is cured of its burn.": "如果使用者沒有瀕死，解除目標的灼傷狀態。",
    "If the current terrain is Electric Terrain and the target is grounded, this move's power is doubled.": "在電氣場地上，若目標為地面上的寶可夢，威力翻倍。",
    "If the current terrain is Grassy Terrain and the user is grounded, this move has its priority increased by 1.": "在青草場地上，若使用者為地面上的寶可夢，優先度+1。",
    "If the current terrain is Psychic Terrain and the user is grounded, this move hits all opposing Pokemon and has its power multiplied by 1.5.": "在精神場地上，若使用者為地面上的寶可夢，則攻擊目標變為全部可以攻擊到的對手寶可夢，同時威力提升50%。",
    "Raises the user's Attack and Speed by 1 stage. Removes subtitutes from all active Pokemon and ends the effects of Spikes, Stealth Rock, Sticky Web, and Toxic Spikes for both sides.": "令使用者的攻擊和速度提升1級。將撒菱、隱形岩、黏黏網、毒菱、替身全部掃除掉。",
    "Power is equal to 100 * (target's current HP / target's maximum HP), rounded half down, but not less than 1.": "威力=100×（目標當前HP/目標最大HP），向下取整一半。威力至少為1。",
    "Prevents the target from using non-damaging moves for its next three turns. Pokemon with the Oblivious Ability or protected by the Aroma Veil Ability are immune.": "在3回合內，使目標不能使用變化招式。擁有遲鈍或芳香幕特性的寶可夢免疫挑釁。",
    "Prevents the target from using non-damaging moves for its next three turns.": "在3回合內，使目標不能使用變化招式。",
    "Power is equal to the greater of ((255 - user's Happiness) * 2/5), rounded down, or 1.": "威力隨著親密度增加而減弱，威力為（255 - 親密度）÷2.5，向下取整，最小為1。",
    "Power is equal to the greater of (user's Happiness * 2/5), rounded down, or 1.": "威力隨著親密度增加，為親密度÷2.5，向下取整，最小為1。",
    "The user and the target's HP become the average of their current HP, rounded down, but not more than the maximum HP of either one.": "將使用者的HP與目標的HP相加之後取其算術平均數,向下取整。",
    "This move is always a critical hit unless the target is under the effect of Lucky Chant or has the Battle Armor or Shell Armor Abilities. This move does not check accuracy.": "攻擊必定擊中要害，除非目標擁有戰鬥盔甲、硬殼盔甲特性或處於幸運咒語的保護之下。攻擊必定會命中。",
    "Has a 10% chance to burn the target and a 10% chance to make it flinch.": "有10%幾率使目標陷入灼傷狀態,10%幾率使目標陷入畏縮狀態。",
    "Has a 10% chance to freeze the target and a 10% chance to make it flinch.": "有10%幾率使目標陷入冰凍狀態,10%幾率使目標陷入畏縮狀態。",
    "Has a 10% chance to paralyze the target and a 10% chance to make it flinch.": "有10%幾率使目標陷入麻痹狀態,10%幾率使目標陷入畏縮狀態。",
    "Power doubles if the target has a non-volatile status condition.": "如果目標處於異常狀態，威力翻倍。",
    "Power doubles if the target has less than or equal to half of its maximum HP remaining.": "如果目標的HP為其最大HP的1/2或以下，威力翻倍。",
    "Has a 20% chance to either burn, freeze, or paralyze the target.": "有20%的幾率使目標陷入灼傷、冰凍或麻痹狀態。",
    "Fails unless the user is a Fire type. If this move is successful, the user's Fire type becomes typeless as long as it remains active.": "不具有火屬性的寶可夢使出此招式的話，會使用失敗。成功使用此招式後自身的火屬性變成無屬性。",
    "Fails unless the user is a Fire type. If this move is successful and the user is not Terastallized, the user's Fire type becomes typeless as long as it remains active.": "不具有火屬性的寶可夢使出此招式的話，會使用失敗。如果使用者沒有太晶化火屬性，成功使用此招式後自身的火屬性變成無屬性。",
    "Fails unless the user is an Electric type. If this move is successful and the user is not Terastallized, the user's Electric type becomes typeless as long as it remains active.": "不具有電屬性的寶可夢使出此招式的話，會使用失敗。如果使用者沒有太晶化電屬性，成功使用此招式後自身的電屬性變成無屬性。",
    "If the target lost HP, the user takes recoil damage equal to 1/4 the HP lost by the target, rounded half up, but not less than 1 HP.": "使用者承受對目標造成傷害的1/4的傷害，向上取整一半，但不小於1。",
    "If the target lost HP, the user takes recoil damage equal to 1/2 the HP lost by the target, rounded half up, but not less than 1 HP.": "使用者承受對目標造成傷害的1/2的傷害，向上取整一半，但不小於1。",
    "If the target lost HP, the user takes recoil damage equal to 33% the HP lost by the target, rounded half up, but not less than 1 HP.": "使用者承受對目標造成傷害的33%的傷害，向上取整一半，但不小於1。",
    "Has a 10% chance to paralyze the target. If the target lost HP, the user takes recoil damage equal to 33% the HP lost by the target, rounded half up, but not less than 1 HP.": "有10%的幾率使目標陷入麻痹狀態。使用者承受對目標造成傷害的33%的傷害，向上取整一半，但不小於1。",
    "This move and its effects ignore the Abilities of other Pokemon.": "攻擊時能夠使其他寶可夢的特性失效。",
    "If this move is successful and the user has not fainted, the target loses 3 PP from its last move.": "如果成功使出該招式且目標沒有瀕死，目標最後使用的招式的PP降低3點。",
    "This move becomes a physical attack if the user's Attack is greater than its Special Attack, including stat stage changes. This move and its effects ignore the Abilities of other Pokemon.": "如果使用者的攻擊大於特攻(計算能力變化)，則此招式變成物理招式。攻擊時能夠使其他寶可夢的特性失效。",
    "If this move is successful, causes Normal-type moves to become Electric type this turn.": "如果成功使出該招式，直到回合結束所有一般屬性招式變為電屬性。",
    "This move fails unless the user knows this move and at least one other move, and has used all the other moves it knows at least once each since it became active or Transformed.": "只能在其它招式均使用過之後才可以使用。如果該招式是被另一個招式觸發的，但使用者沒有學會珍藏，使用失敗。",
    "If this attack is not successful, the user loses half of its maximum HP, rounded down, as crash damage. Pokemon with the Magic Guard Ability are unaffected by crash damage.": "如果攻擊沒有產生效果，自身承受最大HP的1/2（向下取整）的反作用力傷害。具有魔法防守特性的寶可夢不會受到反作用力傷害。",
    "If this attack is not successful, the user loses HP equal to half the target's maximum HP if the target was immune, rounded down, otherwise half of the damage the target would have taken, rounded down, but no less than 1 HP and no more than half of the target's maximum HP, as crash damage. Pokemon with the Magic Guard Ability are unaffected by crash damage.": "如果攻擊沒有產生效果，自身承受本應造成傷害的1/2，上限為對手最大HP的1/2，向下取整。具有魔法防守特性的寶可夢不會受到反作用力傷害。",
    "If this attack is not successful and the target was not immune, the user loses HP equal to half of the damage the target would have taken, rounded down, but no less than 1 HP and no more than half of the target's maximum HP, as crash damage.": "如果攻擊沒有產生效果，自身承受本應造成傷害的1/2。上限為對手最大HP的1/2，向下取整。",
    "Has a 30% chance to burn the target. The target thaws out if it is frozen.": "有30%的幾率使目標陷入灼傷狀態。被該招式擊中會被解凍。",
    "If this move is successful, moves targeted at the user deal double damage and do not check accuracy until the user's next turn.": "如果成功使出該招式，則在使用者下次使出其他招式之前，任何以使用者為目標的招式對使用者造成的傷害翻倍，並且一定會命中。",
    "If the user is hit by a contact move this turn before it can execute this move, the attacker is burned.": "如果在加熱鳥嘴到發動攻擊期間受到接觸類招式攻擊，傷害的施加者陷入灼傷狀態。",
    "Until the user's next turn, if an opposing Pokemon's attack knocks the user out, that move loses all its remaining PP.": "如果自身在下次行動前被招式直接造成的傷害擊倒，擊倒自己的寶可夢用於擊倒自身的招式的PP歸0。",
    "Until the user's next turn, if an opposing Pokemon's attack knocks the user out, that Pokemon faints as well, unless the attack was Future Sight.": "如果自身在下次行動前被招式直接造成的傷害擊倒，擊倒自己的寶可夢也會陷入瀕死，除非該招式是預支未來。",
    "Until the user's next turn, if an opposing Pokemon's attack knocks the user out, that Pokemon faints as well, unless the attack was Doom Desire or Future Sight.": "如果自身在下次行動前被招式直接造成的傷害擊倒，擊倒自己的寶可夢也會陷入瀕死，除非該招式是預支未來或破滅之願。",
    "Causes the target's last move used to lose 4 PP. Fails if the target has not made a move, if the move has 0 PP, or if it no longer knows the move.": "對手最後使用的招式的PP降低4點。如果目標在對戰中尚未使用招式，或上回合使用的招式PP為0，該招式使用失敗。",
    "Raises the target's Attack by 2 stages and lowers its Defense by 2 stages.": "令目標的攻擊提升2級。 令目標的防禦降低2級。",
    "The user prevents all opposing Pokemon from using any moves that the user also knows as long as the user remains active.": "自身處於封印狀態期間，對手的任何寶可夢不能使出與自身學會的任一招式相同的招式。",
    "Has a 30% chance to paralyze the target. This attack charges on the first turn and executes on the second. If the user is holding a Power Herb, the move completes in one turn.": "有30%的幾率使目標陷入麻痹狀態。在第一回合進行蓄力，第二回合攻擊目標。如果攜帶了強力香草，可以立刻結束蓄力，在第一回合發動招式。",
    "Has a 30% chance to burn the target. This attack charges on the first turn and executes on the second. If the user is holding a Power Herb, the move completes in one turn.": "有30%的幾率使目標陷入灼傷狀態。在第一回合進行蓄力，第二回合攻擊目標。如果攜帶了強力香草，可以立刻結束蓄力，在第一回合發動招式。",
    "The user loses its focus and does nothing if it is hit by a damaging attack this turn before it can execute the move.": "聚氣後如果在發動攻擊前受到傷害，則招式會失敗。",
    "Deals damage to the target equal to the user's current HP. If this move is successful, the user faints.": "使用者消耗全部剩餘HP，並對目標造成使用者消耗HP的傷害。如果成功使出該招式，自身陷入瀕死狀態。",
    "Fails if there is no terrain active. Ends the effects of Electric Terrain, Grassy Terrain, Misty Terrain, and Psychic Terrain.": "如果不存在場地型狀態，招式使用失敗。攻擊後結束電氣場地，青草場地，薄霧場地和精神場地的效果。",
    "This move's type depends on the user's held Memory.": "招式屬性根據使用者裝備的記憶碟決定。",
    "This move's type depends on the user's held Drive.": "招式屬性根據使用者裝備的卡帶決定。",
    "This move's type depends on the user's held Plate.": "招式屬性根據使用者裝備的石板決定。",
    "Raises the user's Attack by 3 stages if this move knocks out the target.": "如果攻擊的目標被本次攻擊造成瀕死，令使用者的攻擊提升3級。",
    "Power doubles if the user is burned, paralyzed, or poisoned. The physical damage halving effect from the user's burn is ignored.": "如果自身處於灼傷、麻痹或中毒的異常狀態下，威力翻倍。無視灼傷導致的攻擊減半效果。",
    "Power doubles if the user is burned, paralyzed, or poisoned.": "如果自身處於灼傷、麻痹或中毒的異常狀態下，威力翻倍。",
    "If this move is successful, the target's ally loses 1/16 of its maximum HP, rounded down, unless it has the Magic Guard Ability.": "如果成功使出該招式，目標的盟友會受到濺射傷害，損失最大HP的1/16，向下取整，除非其擁有魔法防守特性。",
    "For 2 turns, the target cannot use sound-based moves.": "在2回合內，目標無法使出聲音的招式。",
    "For 4 turns, the user and its party members have their Speed doubled. Fails if this move is already in effect for the user's side.": "在4回合內，己方場地上全部寶可夢的速度翻倍。如果己方場地已處於順風狀態，使用失敗。",
    "Damage is calculated using the target's Attack stat, including stat stage changes. The user's Ability, item, and burn are used as normal.": "使用目標的攻擊能力值進行傷害計算，包括攻擊能力變化。使用者的特性，道具和灼傷會正常計算。",
    "The user recovers 1/2 the HP lost by the target, rounded half up. If Big Root is held by the user, the HP recovered is 1.3x normal, rounded half down.": "使用者將造成傷害的50%轉化為自身的HP，向上取整一半。攜帶大根莖時，恢覆量提升30%，向下取整一半。",
    "The user recovers 3/4 the HP lost by the target, rounded half up. If Big Root is held by the user, the HP recovered is 1.3x normal, rounded half down.": "使用者將造成傷害的75%轉化為自身的HP，向上取整一半。攜帶大根莖時，恢覆量提升30%，向下取整一半。",
    "This move is always a critical hit unless the target is under the effect of Lucky Chant or has the Battle Armor or Shell Armor Abilities.": "攻擊必定擊中要害，除非目標擁有戰鬥盔甲、硬殼盔甲特性或處於幸運咒語的保護之下。",
    "Power doubles if the user had a stat stage lowered this turn.": "若該回合內自身能力變化曾降低過，威力翻倍。",
    "Power doubles if the target has already taken damage this turn, other than direct damage from Belly Drum, confusion, Curse, or Pain Split.": "如果目標在本回合曾受過傷害，威力翻倍。不包括腹鼓，混亂，詛咒和分擔痛楚造成的傷害。",
    "Lowers the user's Speed, Defense, and Special Defense by 1 stage.": "令使用者的速度，防禦和特防下降1級。",
    "Raises the target's Special Attack by 1 stage and confuses it.": "提升目標的1級特攻並令其混亂。",
    "Has a 100% chance to confuse the target if it had a stat stage raised this turn.": "令該回合內能力變化曾提高過的寶可夢陷入混亂狀態。",
    "Has a 50% chance to lower the target's Defense by 1 stage, a 30% chance to make it flinch, and a higher chance for a critical hit.": "有50%幾率令目標的防禦降低1級，30%的幾率使目標陷入畏縮狀態，容易擊中要害。",
    "This move can hit a target using Bounce, Fly, or Sky Drop, or is under the effect of Sky Drop.": "可以擊中處於彈跳，飛翔或自由落體狀態的寶可夢。",
    "Has a 100% chance to make the target flinch. Fails if the target did not select a priority move for use this turn, or if the target moves before the user.": "100%的幾率使目標陷入畏縮狀態。如果目標使出的招式不是先制攻擊招式，或目標已經行動，使用失敗。",
    "Has a 100% chance to burn the target if it had a stat stage raised this turn.": "令該回合內能力變化曾提高過的寶可夢陷入灼傷狀態。",
    "Has a 10% chance to burn the target and a higher chance for a critical hit.": "有10%的幾率使目標陷入灼傷狀態。容易擊中要害。",
    "Power doubles if the target is asleep. If the user has not fainted, the target wakes up.": "如果目標處於睡眠狀態，威力翻倍。如果使用者沒有瀕死，解除目標的睡眠狀態。",
    "The user restores 1/2 of its maximum HP, rounded half down. If the weather is Sandstorm, the user instead restores 2/3 of its maximum HP, rounded half down.": "回復使用者1/2的最大HP，向上取整一半。如果當前天氣是沙暴，回復2/3最大HP，向下取整一半。",
    "Resets the stat stages of all active Pokemon to 0.": "場上全部寶可夢的能力等級重置為0。",
    "Ends the effects of Electric Terrain, Grassy Terrain, Misty Terrain, and Psychic Terrain.": "攻擊後結束電氣場地，青草場地，薄霧場地和精神場地的效果。",
    "This attack charges on the first turn and executes on the second. Raises the user's Defense by 1 stage on the first turn. If the user is holding a Power Herb, the move completes in one turn.": "在第一回合進行蓄力，同時令使用者的防禦提升1級，在第二回合攻擊目標。如果攜帶了強力香草，可以立刻結束蓄力，在第一回合發動招式。",
    "Has a 50% chance to cause the target to either fall asleep, become poisoned, or become paralyzed.": "有50%的幾率使目標陷入麻痹、中毒或麻痹狀態。",
    "The user swaps all its stat stage changes with the target.": "和目標交換全部的能力變化。",
    "Hits three times.": "連續攻擊3次。",
    "Lowers the target's Speed by 1 stage. Until the target switches out, the effectiveness of Fire-type moves is doubled against it.": "令目標的速度降低1級。目標離場前，火屬性的招式將會對目標造成效果絕佳的傷害。",
    "Each Pokemon on the user's side restores 1/4 of its maximum HP, rounded half up.": "生命水滴能夠回復使用者和同伴1/4的HP。向上取整一半。",
    "For 5 turns, all Fire-type attacks used by any active Pokemon have their power multiplied by 0.33. Fails if this effect is already active": "在5回合內，火屬性的招式威力變為原本的33%。如果此狀態已觸發，使用失敗。",
    "For 5 turns, all Electric-type attacks used by any active Pokemon have their power multiplied by 0.33. Fails if this effect is already active.": "在5回合內，電屬性的招式威力變為原本的33%。如果此狀態已觸發，使用失敗。",
    "This move combines Flying in its type effectiveness against the target. Damage doubles and no accuracy check is done if the target has used Minimize while active.": "該招式計算屬性相性時視作格鬥屬性與飛行屬性雙屬性。如果目標處於變小狀態，威力翻倍，同時招式一定會命中。",
    "Has a 30% chance to paralyze the target. Damage doubles and no accuracy check is done if the target has used Minimize while active.": "有30%的幾率使目標陷入麻痹狀態。如果目標處於變小狀態，威力翻倍，同時招式一定會命中。",
    "The user cures its burn, poison, or paralysis. Fails if the user is not burned, poisoned, or paralyzed.": "消除使用者的灼傷、中毒或麻痹狀態。如果沒有陷入灼傷、中毒或麻痹狀態，使用失敗。",
    "If the current terrain is Electric Terrain, this move's power is multiplied by 1.5.": "場地為電氣場地時，招式威力提升為原本的1.5倍。",
    "Has a very high chance for a critical hit.": "非常容易擊中要害。",
    "Damage doubles and no accuracy check is done if the target has used Minimize while active.": "如果目標處於變小狀態，威力翻倍，同時招式一定會命中。",
    "Deals damage to the target equal to 3/4 of its current HP, rounded down, but not less than 1 HP.": "對目標造成目標當前HP3/4的傷害，向下取整。至少造成1傷害。",
    "Raises the user's Attack, Defense, Special Attack, Special Defense, and Speed by 2 stages.": "提升使用者的攻擊，防禦，特攻，特防和速度各2級。",
    "Raises the user's Attack, Defense, Special Attack, Special Defense, and Speed by 1 stage.": "提升使用者的攻擊，防禦，特攻，特防和速度各1級。",
    "If this move is successful, the terrain becomes Psychic Terrain.": "如果成功使出該招式，腳下會變成精神場地。",
    "No competitive use. Fails if there is no ally adjacent to the user.": "沒有招式效果。場上沒有同伴時，使用失敗。",
    "The user's type changes to match the original type of the move in its first move slot. Fails if the user cannot change its type, or if the type is one of the user's current types.": "改變自身屬性為自己學會的第一個招式的屬性。如果使用者無法改變屬性或自身已經擁有該屬性，使用失敗。",
    "Z-Effect: Restores HP 100%": "Z效果：回復100%HP",
    "Z-Effect: Attack +1": "Z效果：提升1級攻擊",
    "Z-Effect: Defense +1": "Z效果：提升1級防禦",
    "Z-Effect: Sp. Atk +1": "Z效果：提升1級特攻",
    "Z-Effect: Sp. Def +1": "Z效果：提升1級特防",
    "Z-Effect: Speed +1": "Z效果：提升1級速度",
    "Z-Effect: Attack +2": "Z效果：提升2級攻擊",
    "Z-Effect: Defense +2": "Z效果：提升2級防禦",
    "Z-Effect: Sp. Atk +2": "Z效果：提升2級特攻",
    "Z-Effect: Sp. Def +2": "Z效果：提升2級特防",
    "Z-Effect: Speed +2": "Z效果：提升2級速度",
    "Z-Effect: Attack +3": "Z效果：提升3級攻擊",
    "Z-Effect: Restores negative stat stages to 0": "Z效果：恢覆下降的能力",
    "Z-Effect: accuracy +1": "Z效果：提升1級命中率",
    "Z-Effect: evasiveness +1": "Z效果：提升1級閃避率",
    "Z-Effect: Crit ratio +1": "Z效果：提升1級擊中要害率",
    "Z-Effect: Redirects opposing attacks to user": "Z效果：萬眾矚目",
    "Z-Effect: Restores HP 100% if user is Ghost type, otherwise Attack +1": "Z效果：如果使用者是幽靈屬性，回復100%HP。如果不是則提升1級攻擊",
    "Z-Effect: Restores replacement's HP 100%": "Z效果：回復將上場的友軍100%HP",
    "Z-Effect: Attack +1, Defense +1, Sp. Atk +1, Sp. Def +1, Speed +1": "Z效果：提升攻擊，防禦，特攻，特防和速度各1級。",
    "The target's stat stages greater than 0 are stolen from it and applied to the user before dealing damage.": "先奪取目標所有大於0的能力變化，再攻擊目標造成傷害。",
    "Every Pokemon in the user's party is cured of its non-volatile status condition. Active Pokemon with the Sap Sipper Ability are not cured, unless they are the user.": "治癒己方隊伍所有寶可夢的異常狀態。擁有食草特性的寶可夢不會被治癒，除非它是使用者。",
    "Every Pokemon in the user's party is cured of its non-volatile status condition. Active Pokemon with the Soundproof Ability are not cured.": "治癒己方隊伍中全部寶可夢的異常狀態。如果使用者擁有隔音特性，不會被治癒。",
    "Every Pokemon in the user's party is cured of its non-volatile status condition. Pokemon with the Soundproof Ability are not cured.": "治癒己方隊伍中全部寶可夢的異常狀態。擁有隔音特性的寶可夢不會被治癒。",
    "Power doubles with each successful hit, up to a maximum of 160 power. The power is reset if this move misses or another move is used.": "每次連斬成功命中，下次攻擊時威力翻倍，最大威力為160。如果招式未命中或自身離場或使用了其它招式，則威力重置為基礎威力。",
    "This move's power is 20 if the target weighs less than 10 kg, 40 if less than 25 kg, 60 if less than 50 kg, 80 if less than 100 kg, 100 if less than 200 kg, and 120 if greater than or equal to 200 kg.": "如果目標的重量小於10kg，此招式的威力為20; 如果小於25kg，威力為40; 如果小於50kg，威力為60; 如果小於100kg，威力為80; 如果小於200kg,威力為100; 如果大於或等於200kg，威力為120。",
    "Causes damage to the target equal to 1/8 of its maximum HP (1/4 if the target is Steel or Water type), rounded down, at the end of each turn during effect. This effect ends when the target is no longer active.": "使目標陷入鹽腌狀態。處於鹽腌狀態的的寶可夢行動結束後損失最大HP的1/8(鋼屬性或水屬性的寶可夢為最大HP的1/4)，向下取整。目標離場時，解除鹽腌狀態。",
    "Has a 30% chance to make the target flinch and a higher chance for a critical hit. This attack charges on the first turn and executes on the second. If the user is holding a Power Herb, the move completes in one turn.": "有30%的幾率使陷入畏縮狀態，容易擊中要害。在第一回合進行蓄力，第二回合攻擊目標。如果攜帶了強力香草，可以立刻結束蓄力，在第一回合發動招式。",
    "The user restores 1/2 of its maximum HP, rounded half up. Until the end of the turn, Flying-type users lose their Flying type and pure Flying-type users become Normal type. Does nothing if the user's HP is full.": "回復使用者1/2的HP，向下取整。飛行屬性的寶可夢使用該招式後會在當回合會失去飛行屬性，只有飛行屬性的寶可夢會變為一般屬性。如果使用者HP已滿，沒有效果。",
    "The user falls asleep for the next two turns and restores all of its HP, curing itself of any non-volatile status condition in the process. Fails if the user has full HP, is already asleep, or if another effect is preventing sleep.": "連續睡上2回合,回復自己的全部HP以及治癒所有異常狀態。如果使用者的HP已滿、已經處於睡眠狀態或其他影響，使用失敗。",
    "The user falls asleep for the next two turns and restores all of its HP, curing itself of any non-volatile status condition in the process. This does not remove the user's stat penalty for burn or paralysis. Fails if the user has full HP.": "睡上1回合,回復自己的全部HP以及治癒所有異常狀態，但解除灼傷狀態不會解除攻擊減半的效果。如果使用者的HP已滿，已經處於睡眠狀態或其他影響，使用失敗。",
    "If this move is successful and the user has not fainted, the effects of Leech Seed and binding moves end for the user, and all hazards are removed from the user's side of the field.": "如果此招式成功使出且使用者沒有瀕死，會移除己方場地上的入場可生效的狀態並擺脫自身的束縛和寄生種子狀態。",
    "Has a 10% chance to burn the target. If the target lost HP, the user takes recoil damage equal to 33% the HP lost by the target, rounded half up, but not less than 1 HP.": "有10%的幾率使目標陷入灼傷狀態。使用者承受對目標造成傷害的33%的傷害，向上取整一半，但不小於1。",
    "The target is forced to switch out and be replaced with a random unfainted ally. Fails if the target is the last unfainted Pokemon in its party, or if the target used Ingrain previously or has the Suction Cups Ability.": "令對方隊伍中隨機一只沒有陷入瀕死狀態的寶可夢強制替換上場。如果目標是其隊伍中唯一沒有陷入瀕死狀態的寶可夢、處於紮根狀態或擁有吸盤特性，使用失敗。",
    "Lowers the target's Attack and Special Attack by 2 stages. The user faints unless this move misses or there is no target. Fails entirely if this move hits a substitute, but does not fail if the target's stats cannot be changed.": "令目標的攻擊和特攻降低2級。使用者陷入瀕死狀態，除非此招式沒有命中、沒有目標或使用失敗。如果命中替身，使用失敗；但如果該招式無法對對手的能力變化產生效果，不會失敗。",
    "Until the user's next move, if an opposing Pokemon's attack knocks the user out, that Pokemon faints as well, unless the attack was Doom Desire or Future Sight.": "在使用者使出下一個招式之前，如果使用者因招式直接造成的傷害而陷入瀕死狀態(預知未來和破滅之願除外)，攻擊方也會進入瀕死狀態。",
    "Causes the Ghost type to be added to the target, effectively making it have two or three types. Fails if the target is already a Ghost type. If Forest's Curse adds a type to the target, it replaces the type added by this move and vice versa.": "如果目標沒有幽靈屬性，追加第二或第三屬性幽靈屬性。目標擁有幽靈屬性時，招式使用失敗。進入森林詛咒狀態時會解除萬聖夜狀態，反之亦然。",
    "Prevents the target from using non-damaging moves for its next three turns. Pokemon with the Oblivious Ability or protected by the Aroma Veil Ability are immune. Z-Powered moves can still be selected and executed during this effect.": "在3回合內，使目標處於挑釁狀態，不能使用變化招式。擁有遲鈍或芳香幕特性的寶可夢免疫挑釁。Z招式不受挑釁狀態影響。",
    "Prevents the target from selecting the same move for use two turns in a row. This effect ends when the target is no longer active.": "阻止對手連續使用相同的招式。當對手離場後該效果消失。",
    "If this move is successful and the user has not fainted, the effects of Leech Seed and binding moves end for the user, and all hazards are removed from the user's side of the field. Has a 100% chance to raise the user's Speed by 1 stage.": "如果此招式成功使出且使用者沒有瀕死，會移除己方場地上的入場可生效的狀態並擺脫自身的束縛、寄生種子狀態。令使用者的速度提高1級。",
    "If this move is successful and the user has not fainted, the effects of Leech Seed and binding moves end for the user, and all hazards are removed from the user's side of the field. Has a 100% chance to poison the target.": "如果此招式成功使出且使用者沒有瀕死，會移除己方場地上的入場可生效的狀態並擺脫自身的束縛、寄生種子狀態。100%令目標陷入中毒狀態。",
    "Power doubles if the user is grounded and a terrain is active, and this move's type changes to match. Electric type during Electric Terrain, Grass type during Grassy Terrain, Fairy type during Misty Terrain, and Psychic type during Psychic Terrain.": "如果使用者是地上的寶可夢存在場地，威力翻倍。視使出招式時場地狀態不同，招式的屬性會有所變化：無場地為一般屬性，電氣場地期間為電屬性、青草場地期間為草屬性、薄霧場地期間為妖精屬性、精神場地期間為超能力屬性。",
    "If both the user and the target have not fainted, the target is forced to switch out and be replaced with a random unfainted ally. This effect fails if the target used Ingrain previously, has the Suction Cups Ability, or this move hit a substitute.": "如果雙方都沒有陷入瀕死，令對方隊伍中隨機一只沒有陷入瀕死狀態的寶可夢強制替換上場。如果目標是其隊伍中唯一沒有陷入瀕死狀態的寶可夢、處於紮根狀態、擁有吸盤特性或命中了替身，該招式的強制替換上場的效果無效。",
    "The user cures its non-volatile status condition. Raises the user's Special Attack and Special Defense by 1 stage.": "治癒使用者的異常狀態。提升1級特攻和特防。",
    "Has a higher chance for a critical hit. If the user is an Ogerpon holding a mask, this move's type changes to match. Water type for Wellspring Mask, Fire type for Hearthflame Mask, and Rock type for Cornerstone Mask.": "容易擊中要害。該招式的屬性會根據使用者的面具而改變：厄鬼椪-水井面具使用時，會變為水屬性。厄鬼椪-火灶面具使用時，會變為火屬性。厄鬼椪-礎石面具使用時，會變為岩石屬性。",
    "Raises the user's Special Attack, Special Defense, and Speed by 2 stages. This attack charges on the first turn and executes on the second. If the user is holding a Power Herb, the move completes in one turn.": "提升使用者特攻、特防和速度各2級。如果攜帶了強力香草，可以立刻結束蓄力，在第一回合發動招式。",
    "For 5 turns, the weather becomes Snow. The user switches out even if it is trapped and is replaced immediately by a selected party member. The user does not switch out if there are no unfainted party members.": "接下來5回合的天氣變更為下雪。然後自身與後備寶可夢替換。即使陷入無法逃走狀態也會退場。如果自身是同行中唯一沒有陷入瀕死狀態的寶可夢，則不會退場。",
    "If this move is successful and the user has not fainted, the user switches out even if it is trapped and is replaced immediately by a selected party member. The user does not switch out if there are no unfainted party members.": "如果成功使出該招式，自身與後備寶可夢替換，即使陷入無法逃走狀態也會退場。如果自身是同行中唯一沒有陷入瀕死狀態的寶可夢，則不會退場。",
    "The user restores 1/2 of its maximum HP, rounded half up. If the user is not Terastallized, until the end of the turn Flying-type users lose their Flying type and pure Flying-type users become Normal type. Does nothing if the user's HP is full.": "回復使用者1/2的HP，向下取整。擁有飛行屬性的寶可夢使用該招式後會在當回合會失去飛行屬性，只有飛行屬性的寶可夢會變為一般屬性。如果使用者HP已滿，沒有效果。",
    "Raises the user's Attack, Special Attack, and Speed by 2 stages in exchange for the user losing 1/2 of its maximum HP, rounded down. Fails if the user would faint or if its Attack, Special Attack, and Speed stat stages would not change.": "使用者損失最大HP的1/2，向下取整，令使用者的攻擊、特攻和速度提升2級。如果使用者自身HP不足1/2或能力等級沒有變化，使用失敗。",
    "The target restores 1/2 of its maximum HP, rounded half up. If the user has the Mega Launcher Ability, the target instead restores 3/4 of its maximum HP, rounded half down.": "回復目標1/2的HP，向上取整一半。如果使用者擁有超級發射器特性，回復量上升為最大HP的3/4，向上取整一半。",
    "Every Pokemon in the user's party is cured of its non-volatile status condition. Active Pokemon with the Soundproof Ability are not cured, unless they are the user.": "治癒己方隊伍中全部寶可夢的異常狀態。具有隔音特性的寶可夢不能被治癒，除非它是使用者。",
    "The user is replaced with another Pokemon in its party. The selected Pokemon has the user's stat stage changes, confusion, and certain move effects transferred to it.": "自身替換寶可夢下場，選擇隊伍中另外一只寶可夢上場。能力變化、混亂、以及部分的狀態變化會傳遞給交換上場的寶可夢。",
    "The user restores 1/2 of its maximum HP, rounded down.": "使用者回復1/2最大HP，向下取整。",
    "The user restores 1/2 of its maximum HP, rounded down. Until the end of the turn, Flying-type users lose their Flying type and pure Flying-type users become typeless. Does nothing if the user's HP is full.": "使用者回復1/2最大HP，向下取整。直到回合結束，失去飛行屬性；只有飛行屬性的寶可夢變為無屬性。如果HP已滿，使用失敗。",
    "Power doubles if the target is using Dig.": "對正在挖洞的目標造成雙倍傷害。",
    "Power doubles if the target is using Dive.": "對正在潛水的目標造成雙倍傷害。",
    "Power doubles if the target is using Fly.": "對正在飛翔的目標造成雙倍傷害。",
    "The user falls asleep for the next two turns and restores all of its HP, curing itself of any non-volatile status condition in the process, even if it was already asleep. Fails if the user has full HP.": "使用者連續睡眠2回合，恢覆全部HP並解除異常狀態。如果使用者已經睡著了或HP已滿，使用失敗。",
    "Causes the target to lose 1/4 of its maximum HP, rounded down, at the end of each turn as long as it is asleep. This move does not affect the target unless it is asleep. The effect ends when the target wakes up, even if it falls asleep again in the same turn.": "使目標陷入惡夢狀態。如果目標沒有處於睡眠狀態，則招式使用失敗。處於惡夢狀態的寶可夢在每個回合結束時損失最大HP的1/4。即使目標在同一回合再次入睡，效果也會在目標醒來時結束。",
    "The user restores 1/2 of its maximum HP if no weather conditions are in effect, all of its HP if the weather is Sunny Day, and 1/4 of its maximum HP if the weather is Rain Dance or Sandstorm, all rounded down.": "在沒有天氣型狀態時，回復使用者的1/2最大HP。如果天氣是大晴天或大日照，回復使用者的全部HP。如果天氣是下雨、沙暴，回復使用者的1/4最大HP。全部向下取整。",
    "The user recovers 1/2 the HP lost by the target, rounded down.": "回復使用者的1/2最大HP，向下取整。",
    "Has a 20% chance to make the target flinch. Power doubles if the target is using Bounce, Fly, or Sky Drop, or is under the effect of Sky Drop.": "有20%幾率使目標陷入畏縮狀態。如果目標處於飛翔、彈跳、自由落體狀態，威力翻倍。",
    "Raises the user's Attack and Special Attack by 1 stage.": "提升使用者的1級攻擊和特攻。",
    "Leaves the target with at least 1 HP.": "目標至少會保留1點HP。",
    "The user copies all of the target's current stat stage changes.": "複製目標的所有能力變化。",
    "Has a 20% chance to burn the target. The user recovers 1/2 the HP lost by the target, rounded half up. If Big Root is held by the user, the HP recovered is 1.3x normal, rounded half down. The target thaws out if it is frozen.": "有20%幾率使目標陷入灼傷狀態。使用者將造成傷害的50%轉化為自身的HP，向上取整一半。攜帶大根莖時，恢覆量提升30%，向下取整一半。被該招式擊中會被解凍。",
    "A fainted party member is selected and revived with 1/2 its max HP, rounded down. Fails if there are no fainted party members.": "使用後選擇1只處於瀕死狀態的同行寶可夢，治癒它的瀕死狀態，並且讓它回復最大HP的1/2，向下取整。如果沒有瀕死的同行寶可夢，使用失敗。",
    "Until the end of the next turn, the target cannot avoid the user's moves, even if the target is in the middle of a two-turn move. The effect ends if either the user or the target leaves the field. Fails if this effect is active for the user.": "直到下回合結束，目標無法閃避使用者的招式。如果使用者或目標離場，效果結束。如果效果已經觸發過，使用失敗。",
    "Has a 10% chance to cause the target to fall asleep.": "有10%幾率使目標陷入睡眠狀態。",
    "For every consecutive turn that this move is used by at least one Pokemon, this move's power is multiplied by the number of turns to pass, but not more than 5.": "如果連續使用，每一個回合威力都會提升，每次提升40。最多提升5次。",
    "If there are other active Pokemon that chose this move for use this turn, those Pokemon take their turn immediately after the user, in Speed order, and this move's power is 120 for each other user.": "當同伴中有多只寶可夢使用輪唱時，第一只使用輪唱後無視速度，剩下的寶可夢立刻使用，並且威力為120。",
    "For 5 turns, the user and its party members are protected from having their stat stages lowered by other Pokemon. Fails if the effect is already active on the user's side.": "使己方場地在5回合內處於白霧狀態。處於白霧狀態的場地上的寶可夢的能力變化不會被其他寶可夢下降。如果我方已處於白霧狀態，使用失敗。",
    "Causes the target to fall asleep. This move cannot be used successfully unless the user's current form, while considering Transform, is Darkrai.": "使目標陷入睡眠狀態。僅在使用者為達克萊伊時奏效，否則使用失敗。",
    "Raises a random stat by 2 stages as long as the stat is not already at stage 6. The user can choose to use this move on itself or an adjacent ally. Fails if no stat stage can be raised or if used on an ally with a substitute.": "令目標的攻擊、防禦、特攻、特防、速度、命中率、閃避率中隨機一項能力提升2級。如果已經有能力不能提升，則它不會被隨機選擇。如果任何能力都不能提升則招式失敗。如果目標具有替身，則招式使用失敗，除非招式目標是自身。",
    "If the target is an ally, this move restores 1/2 of its maximum HP, rounded down, instead of dealing damage.": "如果目標是同伴，回復目標1/2的最大HP，而不是造成傷害。",
    "The power of the target's attack this turn is multiplied by 1.5 (this effect is stackable). Fails if there is no ally adjacent to the user or if the ally already moved this turn, but does not fail if the ally is using a two-turn move.": "使目標進入幫助狀態。處於幫助狀態的寶可夢在本回合結束前招式的威力提升50%（此狀態可以疊加）。場上若沒有同伴，使用失敗。如果目標已經使用了招式，使用失敗，但如果目標使用的是蓄力招式，不會失敗。",
    "Raises the target's Attack and Defense by 1 stage. Fails if there is no ally adjacent to the user.": "提升目標1級攻擊和防禦。如果沒有同伴，使用失敗。",
    "Raises the Attack of the user and all allies 1 stage.": "提升使用者和所有同伴1級攻擊。",
    "If both the user and the target have not fainted, the target is forced to switch out and be replaced with a random unfainted ally. This effect fails if the target is under the effect of Ingrain, has the Suction Cups Ability, or this move hit a substitute.": "如果雙方都沒有陷入瀕死，令對方隊伍中隨機一只沒有陷入瀕死狀態的寶可夢強制替換上場。如果目標是其隊伍中唯一沒有陷入瀕死狀態的寶可夢、處於紮根狀態、擁有吸盤特性或命中了替身，該招式的強制替換上場的效果無效。",
    "Raises the target's Special Defense by 1 stage. Fails if there is no ally adjacent to the user.": "提升目標1級特防。如果沒有同伴，使用失敗。",
    "Each Pokemon on the user's side restores 1/4 of its maximum HP, rounded half up, and has its status condition cured.": "回復使用者和同伴1/4的最大HP，並且治癒使用者和同伴的異常狀態。向上取整一半。",
    "Boosts the user and its allies' Attack by 1 stage. BP scales with the base move's BP. This effect does not happen if the user is not Dynamaxed. If this move is used as a base move, it deals damage with a power of 0.": "威力由原本招式的威力決定。令使用者和同伴的攻擊提升1級。如果使用者沒有極巨化，不會有該效果。如果將此招式用作基礎招式使用，威力為0。",
    "Power is equal to the base move's Max Move power. If this move is successful, the effect of Misty Terrain begins. This effect does not happen if the user is not Dynamaxed. If this move is used as a base move, it deals damage with a power of 0.": "威力由原本招式的威力決定。可在5回合內將腳下變成薄霧場地。如果使用者沒有極巨化，不會有該效果。如果將此招式用作基礎招式使用，威力為0。",
    "Power is equal to the base move's Max Move power. If this move is successful, the effect of Grassy Terrain begins. This effect does not happen if the user is not Dynamaxed. If this move is": "威力由原本招式的威力決定。可在5回合內將腳下變成青草場地。如果使用者沒有極巨化，不會有該效果。如果將此招式用作基礎招式使用，威力為0。",
    "Power is equal to the base move's Max Move power. If this move is successful, the effect of Hail begins. This effect does not happen if the user is not Dynamaxed. If this move is used as a base move, it deals damage with a power of 0.": "威力由原本招式的威力決定。可在5回合令天氣變為冰雹。如果使用者沒有極巨化，不會有該效果。如果將此招式用作基礎招式使用，威力為0。",
    "Power is equal to the base move's Max Move power. If this move is successful, the effect of Electric Terrain begins. This effect does not happen if the user is not Dynamaxed. If this move is used as a base move, it deals damage with a power of 0.": "威力由原本招式的威力決定。可在5回合內將腳下變成電氣場地。如果使用者沒有極巨化，不會有該效果。如果將此招式用作基礎招式使用，威力為0。",
    "Power is equal to the base move's Max Move power. If this move is successful, the effect of Rain Dance begins. This effect does not happen if the user is not Dynamaxed. If this move is used as a base move, it deals damage with a power of 0.": "威力由原本招式的威力決定。可在5回合內令天氣變為下雨。如果使用者沒有極巨化，不會有該效果。如果將此招式用作基礎招式使用，威力為0。",
    "Power is equal to the base move's Max Move power. If this move is successful, the effect of Psychic Terrain begins. This effect does not happen if the user is not Dynamaxed. If this move is used as a base move, it deals damage with a power of 0.": "威力由原本招式的威力決定。可在5回合內將腳下變成精神場地。如果使用者沒有極巨化，不會有該效果。如果將此招式用作基礎招式使用，威力為0。",
    "Power is equal to the base move's Max Move power. If this move is successful, the effect of Sandstorm begins. This effect does not happen if the user is not Dynamaxed. If this move is used as a base move, it deals damage with a power of 0.": "威力由原本招式的威力決定。可在5回合內令天氣變為沙暴。如果使用者沒有極巨化，不會有該效果。如果將此招式用作基礎招式使用，威力為0。",
    "Power is equal to the base move's Max Move power. If this move is successful, the effect of Sunny Day begins. This effect does not happen if the user is not Dynamaxed. If this move is used as a base move, it deals damage with a power of 0.": "威力由原本招式的威力決定。可在5回合內令天氣變為大晴天。如果使用者沒有極巨化，不會有該效果。如果將此招式用作基礎招式使用，威力為0。",
    "Power is equal to the base move's Max Move power. If this move is successful, each Pokemon on the opposing side becomes confused, even if they have a substitute.": "威力由原本招式的威力決定。令目標陷入混亂狀態，即使目標處於替身狀態下。",
    "Power is equal to the base move's Max Move power. If this move is successful, there is a 50% chance the effect of Yawn begins on the target, even if it has a substitute.": "威力由原本招式的威力決定。有50%幾率使目標陷入睡眠狀態，即使目標處於替身狀態下。",
    "Power is equal to the base move's Max Move power. If this move is successful, each Pokemon on the user's side restores 1/6 of its current maximum HP, even if they have a substitute.": "威力由原本招式的威力決定。回復我方所有寶可夢的HP，即使目標處於替身狀態下。",
    "Power is equal to the base move's Max Move power. If this move is successful, each Pokemon on the opposing side loses 2 PP from its last move used, even if they have a substitute.": "威力由原本招式的威力決定。使對手最後使用的招式的PP減少2點，即使目標處於替身狀態下。",
    "Power is equal to the base move's Max Move power. If this move is successful, each Pokemon on the opposing side either becomes poisoned or paralyzed, even if they have a substitute.": "威力由原本招式的威力決定。讓對手所有寶可夢陷入中毒或麻痹狀態，即使目標處於替身狀態下。",
    "Power is equal to the base move's Max Move power. This move bypasses all protection effects, including Max Guard.": "威力由原本招式的威力決定。可穿透對手的守住進行攻擊，包括極巨防壁。",
    "Power is equal to the base move's Max Move power. If this move is successful, each Pokemon on the user's side has its status condition cured, even if they have a substitute.": "威力由原本招式的威力決定。回復我方寶可夢的異常狀態，即使目標處於替身狀態下。",
    "Power is equal to the base move's Max Move power. If this move is successful, the evasiveness of each Pokemon on the opposing side is lowered by 1 stage, even if they have a substitute.": "威力由原本招式的威力決定。降低全體對手的閃避率1級，即使目標處於替身狀態下。",
    "Power is equal to the base move's Max Move power. If this move is successful, the effect of Aurora Veil begins on the user's side.": "威力由原本招式的威力決定。使己方場地進入極光幕。",
    "Power is equal to the base move's Max Move power. If this move is successful, there is a 50% chance every Pokemon on the user's side has its Berry restored, even if they have a substitute.": "威力由原本招式的威力決定。有50%幾率獲得使用過的樹果，即使處於替身狀態下。",
    "Power is equal to the base move's Max Move power. If this move is successful, the Speed of each Pokemon on the opposing side is lowered by 2 stages, even if they have a substitute.": "威力由原本招式的威力決定。令全體對手寶可夢的速度降低2級，即使目標處於替身狀態下。",
    "Power is equal to the base move's Max Move power. If this move is successful, each Pokemon on the opposing side becomes poisoned, even if they have a substitute.": "威力由原本招式的威力決定。使對手所有寶可夢陷入中毒狀態，即使目標處於替身狀態下。",
    "Power is equal to the base move's Max Move power. If this move is successful, the effect of Torment begins for each Pokemon on the opposing side, even if they have a substitute.": "威力由原本招式的威力決定。令全體對手寶可夢陷入無理取鬧狀態，即使目標處於替身狀態下。",
    "Power is equal to the base move's Max Move power. If this move is successful, the effect of Gravity begins.": "威力由原本招式的威力決定。在5回合內場地重力發生變化。",
    "Power is equal to the base move's Max Move power. If this move is successful, for 4 turns each non-Rock-type Pokemon on the opposing side takes damage equal to 1/6 of its maximum HP, rounded down, at the end of each turn during effect, including the last turn.": "威力由原本招式的威力決定。在4～5回合內使非岩石屬性的目標陷入束縛狀態，每回合受到1/6最大HP的傷害並不能換下，向下取整。",
    "Power is equal to the base move's Max Move power. If this move is successful, for 4 turns each non-Fire-type Pokemon on the opposing side takes damage equal to 1/6 of its maximum HP, rounded down, at the end of each turn during effect, including the last turn.": "威力由原本招式的威力決定。在4～5回合內使非火屬性的目標陷入束縛狀態，每回合受到1/6最大HP的傷害並不能換下，向下取整。",
    "Power is equal to the base move's Max Move power. If this move is successful, each Pokemon on the opposing side becomes paralyzed, even if they have a substitute.": "威力由原本招式的威力決定。令全體對手寶可夢陷入麻痹狀態，即使目標處於替身狀態下。",
    "Power is equal to the base move's Max Move power. If this move is successful, each Pokemon on the user's side has their critical hit ratio raised by 1 stage, even if they have a substitute.": "威力由原本招式的威力決定。使己方全體擊中要害等級提升1級，即使目標處於替身狀態下。",
    "Power doubles if the user moves after the target this turn, including actions taken through Instruct or the Dancer Ability. Switching in does not count as an action.": "如果目標在使用者之前使用招式(包括號令和舞者使出的招式)，威力翻倍。",
    "Power doubles if the user moves after the target this turn. Switching in does not count as an action.": "如果目標在使用者之前使用招式，威力翻倍。",
    "Power doubles if the user moves after the target this turn. Switching in counts as an action.": "如果目標在使用者之前使用招式或替換，威力翻倍。",
    "Power is 160 regardless of the base move's Max Move power. This move and its effects ignore the Abilities of other Pokemon.": "此招式固定為160威力。無視對手特性進行攻擊。",
    "Power is equal to the base move's Max Move power. If this move is successful, each Pokemon on the opposing side either falls asleep, becomes poisoned, or becomes paralyzed, even if they have a substitute.": "威力由原本招式的威力決定。使對方全員陷入中毒、麻痹或睡眠中任意一種異常狀態，即使目標處於替身狀態下。",
    "If the user is a Terapagos in Stellar Form, this move's type becomes Stellar and hits all opposing Pokemon.": "如果使用者是星晶形態的太樂巴戈斯，該招式變為星晶屬性並攻擊對方全體寶可夢。",
    "Power doubles if one of the user's party members fainted last turn.": "如果上一回合我方有寶可夢進入瀕死狀態，威力翻倍。",
    "Has a 100% chance to lower the target's Defense by 1 stage. Power is multiplied by 1.5 during Gravity's effect.": "100%幾率令目標的防禦降低1級。在重力效果期間，威力乘以1.5。",
    "Power doubles if the last move used by any Pokemon this turn was Fusion Flare.": "如果本回合上一個成功使用的招式是交錯火焰，威力翻倍。",
    "Power doubles if the last move used by any Pokemon this turn was Fusion Bolt.": "如果本回合上一個成功使用的招式是交錯閃電，威力翻倍。",
    "The target restores 1/2 of its maximum HP, rounded half up. If the terrain is Grassy Terrain, the target instead restores 2/3 of its maximum HP, rounded half down.": "回復目標最大HP的1/2。在青草場地狀態下，回復目標最大HP的2/3。都是向下取整一半。",
    "Raises the user's Defense and Special Defense by 1 stage. The user's Stockpile count increases by 1. Fails if the user's Stockpile count is 3. The user's Stockpile count is reset to 0 when it is no longer active.": "令使用者的防禦和特防提升1級，同時儲存1層力量。如果已經儲存了3次力量，無法繼續使用蓄力提升能力。離場時重置為0。",
    "Has a 30% chance to burn the target. Power doubles if the target has a non-volatile status condition.": "有30%幾率使目標陷入灼傷狀態。如果目標處於異常狀態，威力翻倍。",
    "The target's positive stat stages become negative and vice versa. Fails if all of the target's stat stages are 0.": "將目標的全部能力變化數值變為其相反數。如果目標的全部能力變化數值皆為0，使用失敗。",
    "Has a 50% chance to poison the target. Power doubles if the target is already poisoned.": "有30%的幾率使目標陷入中毒狀態。如果目標處於異常狀態，威力翻倍。",
    "Prevents all active Pokemon from switching next turn. A Pokemon can still switch out if it is holding Shed Shell or uses Baton Pass, Flip Turn, Parting Shot, Teleport, U-turn, or Volt Switch. Fails if the effect is already active.": "在場的非幽靈屬性寶可夢無法替換。如果目標持有美麗空殼或使用了接棒、快速折返、拋下狠話、急速折返或伏特替換，可以正常替換。",
    "Prevents all active Pokemon from switching next turn. A Pokemon can still switch out if it is holding Shed Shell or uses Baton Pass, Parting Shot, U-turn, or Volt Switch. Fails if the effect is already active.": "在場的非幽靈屬性寶可夢無法替換。如果目標持有美麗空殼或使用了接棒、拋下狠話、急速折返或伏特替換，可以正常替換。",
    "The user and its party members are protected from non-damaging attacks made by other Pokemon, including allies, during this turn. Fails if the user moves last this turn or if this move is already in effect for the user's side.": "在當回合內，使我方場地進入戲法防守狀態，保護我方全體寶可夢不受到來自對手的大部分變化招式的影響。如果在本回合使用者最後行動或我方已進入此狀態，則招式會失敗。",
    "The target is cured if it has a non-volatile status condition. If the target was cured, the user restores 1/2 of its maximum HP, rounded down.": "治癒目標的異常狀態。如果成功治癒了異常狀態，則恢覆使用者1/2的最大HP，向下取整。",
    "Causes the target to become a Psychic type. Fails if the target is an Arceus or a Silvally, if the target is already purely Psychic type, or if the target is Terastallized.": "將目標的屬性變成超能力屬性。無法改變擁有多屬性、AR系統特性、只有超能力屬性或太晶化的寶可夢的屬性。",
    "Causes the target to become a Psychic type. Fails if the target is an Arceus or a Silvally, or if the target is already purely Psychic type.": "將目標的屬性變成超能力屬性。無法改變擁有多屬性、AR系統特性或只有超能力屬性的寶可夢的屬性。",
    "Causes the target to become a Water type. Fails if the target is an Arceus or a Silvally, or if the target is already purely Water type.": "將目標的屬性變成水屬性。無法改變擁有多屬性、AR系統特性或只有水屬性的寶可夢的屬性。",
    "If this move is successful, it causes the target's Speed to be lowered by 1 stage at the end of each turn for 3 turns.": "如果成功使出該招式，在包含當前回合的3回合內，每回合結束時降低1級速度。",
    "Hits twice, with each hit having a 20% chance to poison the target. If the first hit breaks the target's substitute, it will take damage for the second hit.": "連續攻擊2次，每次攻擊有20%的幾率使目標陷入中毒狀態。如果第一下打破了替身，招式會繼續攻擊。",
    "Causes the target's move to become Electric type this turn. Among effects that can change a move's type, this effect happens last. Fails if the target already moved this turn.": "使目標進入輸電狀態，將目標接下來使用的招式屬性變成電屬性。如果目標已經行動，使用失敗。",
    "If the target uses a Fire-type move this turn, it is prevented from executing and the target loses 1/4 of its maximum HP, rounded half up. This effect does not happen if the Fire-type move is prevented by Primordial Sea.": "使目標陷入粉塵狀態，持續1回合，在回合結束時消失。處於粉塵狀態的寶可夢使用火屬性招式時，不但要受到1/4最大HP的傷害，招式也會中止。如果始源之海撲滅了該火屬性招式，使用失敗。",
    "All active Pokemon consume their held Berries. This effect is not prevented by substitutes, the Klutz or Unnerve Abilities, or the effects of Embargo or Magic Room. Fails if no active Pokemon is holding a Berry.": "使場上所有的寶可夢攜帶的樹果都會被立即消耗掉，不受查封、魔法空間、笨拙或緊張感的影響。如果場上沒有寶可夢攜帶樹果，使用失敗。",
    "The user swaps its Defense and Special Defense stat stage changes with the target.": "自身與目標互換防禦能力等級和特防能力等級。",
    "The user swaps its Attack and Special Attack stat stage changes with the target.": "自身與目標互換攻擊能力等級和特攻能力等級。",
    "The user swaps its Speed stat with the target. Stat stage changes are unaffected.": "自身與目標互換速度。速度能力等級不受影響。",
    "Deals 20 HP of damage to the target.": "造成20點固定傷害。",
    "The user and the target have their Defense and Special Defense stats set to be equal to the average of the user and the target's Defense and Special Defense stats, respectively, rounded down. Stat stage changes are unaffected.": "將使用者的防禦和特防與目標的防禦和特防相加之後取其算術平均數，相加時不計算能力變化。向下取整。",
    "The user and the target have their Attack and Special Attack stats set to be equal to the average of the user and the target's Attack and Special Attack stats, respectively, rounded down. Stat stage changes are unaffected.": "將使用者的攻擊和特防與目標的攻擊和特攻相加之後取其算術平均數，相加時不計算能力變化。向下取整。",
    "Raises the Defense and Special Defense of Pokemon on the user's side with the Plus or Minus Abilities by 1 stage.": "令己方所有特性為正電或負電的寶可夢的防禦和特防提升1級。",
    "This move does not check accuracy and hits even if the target is using Dig or Fly.": "攻擊必定命中，即使目標處於挖洞或飛翔狀態。",
    "If this move is successful, the user must recharge on the following turn and cannot select a move, unless the target or its substitute was knocked out by this move.": "使用後下一回合無法使用招式、使用道具或替換寶可夢。如果此次攻擊令目標陷入瀕死，下回合不會被暫停一次。",
    "If the target lost HP, the user takes recoil damage equal to 1/4 the HP lost by the target, rounded down, but not less than 1 HP. If this move breaks the target's substitute, the user does not take any recoil damage.": "如果目標失去了HP，使用者承受對目標造成傷害的1/4的傷害，向上取整一半，但不小於1。如果此次攻擊打破了替身，使用者不會承受任何傷害。",
    "If the target lost HP, the user takes recoil damage equal to 1/3 the HP lost by the target, rounded down, but not less than 1 HP. If this move breaks the target's substitute, the user does not take any recoil damage.": "如果目標失去了HP，使用者承受對目標造成傷害的1/3的傷害，向上取整一半，但不小於1。如果此次攻擊打破了替身，使用者不會承受任何傷害。",
    "If the target lost HP, the user takes recoil damage equal to 1/2 the HP lost by the target, rounded down, but not less than 1 HP. If this move breaks the target's substitute, the user does not take any recoil damage.": "如果目標失去了HP，使用者承受對目標造成傷害的1/2的傷害，向上取整一半，但不小於1。如果此次攻擊打破了替身，使用者不會承受任何傷害。",
    "If the target lost HP, the user takes recoil damage equal to 1/4 the HP lost by the target, rounded down, but not less than 1 HP.": "如果目標失去了HP，使用者承受對目標造成傷害的1/4的傷害，向上取整一半，但不小於1。",
    "If the target lost HP, the user takes recoil damage equal to 1/3 the HP lost by the target, rounded down, but not less than 1 HP.": "如果目標失去了HP，使用者承受對目標造成傷害的1/3的傷害，向上取整一半，但不小於1。",
    "If the target lost HP, the user takes recoil damage equal to 1/2 the HP lost by the target, rounded down, but not less than 1 HP.": "如果目標失去了HP，使用者承受對目標造成傷害的1/2的傷害，向上取整一半，但不小於1。",
    "Has a 10% chance to burn the target. If the target lost HP, the user takes recoil damage equal to 1/3 the HP lost by the target, rounded down, but not less than 1 HP.": "有10%幾率使目標陷入灼傷狀態。如果目標失去了HP，使用者承受對目標造成傷害的1/3的傷害，向上取整一半，但不小於1。",
    "This attack charges on the first turn and executes on the second.": "在第一回合進行蓄力，第二回合攻擊目標。",
    "Deals damage to the target equal to a random number from 1 to (user's level * 1.5 - 1), rounded down, but not less than 1 HP.": "對目標造成的傷害 = 1～（使用者等級×1.5-1）的隨機數。向下取整，但不小於1。",
    "Deals damage to the target equal to (user's level) * (X + 50) / 100, where X is a random number from 0 to 100, rounded down, but not less than 1 HP.": "對目標造成使用者等級×（0.5～1.5之間隨機值）的傷害。向下取整，但不小於1。",
    "Power is equal to 60+(X*20), where X is the target's total stat stage changes that are greater than 0, but not more than 200 power.": "攻擊目標造成傷害。威力基數為60；目標的能力（不包括命中率與閃避率）每上升1級，威力提升20；最高為200。",
    "Causes the target to become a Water type. Fails if the target is an Arceus or a Silvally, or if the target is already purely Water type.": "將目標的屬性變成水屬性。無法改變擁有多屬性、AR系統特性的寶可夢的屬性。",
    "Prevents the target from using non-damaging moves for its next three turns.": "在3回合內，使目標處於挑釁狀態，不能使用變化招式。",
    "Every Pokemon in the user's party is cured of its non-volatile status condition. Active Pokemon with the Soundproof Ability are also cured.": "治癒己方隊伍中全部寶可夢的異常狀態。具有隔音特性的寶可夢也可以治癒。",
    "The user restores 1/2 of its maximum HP if no weather conditions are in effect, 2/3 of its maximum HP if the weather is Sunny Day, and 1/4 of its maximum HP if the weather is Hail, Rain Dance, or Sandstorm, all rounded half down.": "如果沒有天氣，恢覆使用者1/2的最大HP；如果天氣是晴天，則恢覆2/3的最大HP；如果天氣為冰雹、下雨或沙暴，則恢覆1/4的最大HP的，全部向下取整。",
    "Has a 30% chance to confuse the target. This move can hit a target using Bounce, Fly, or Sky Drop, or is under the effect of Sky Drop. If the weather is Rain Dance, this move does not check accuracy. If the weather is Sunny Day, this move's accuracy is 50%.": "有30%的幾率使目標陷入混亂狀態。可以擊中處於飛翔、彈跳和自由落體狀態的寶可夢。天氣為大晴天時，命中降低至50%。天氣為下雨時必定命中。",
    "Has a 30% chance to paralyze the target. This move can hit a target using Bounce, Fly, or Sky Drop, or is under the effect of Sky Drop. If the weather is Rain Dance, this move does not check accuracy. If the weather is Sunny Day, this move's accuracy is 50%.": "有30%的幾率使目標陷入麻痹狀態。可以擊中處於飛翔、彈跳和自由落體狀態的寶可夢。天氣為大晴天時，命中降低至50%。天氣為下雨時必定命中。",
    "This attack charges on the first turn and executes on the second. Power is halved if the weather is Hail, Rain Dance, or Sandstorm. If the user is holding a Power Herb or the weather is Sunny Day, the move completes in one turn.": "在第一回合進行蓄力，第二回合攻擊目標。如果當天氣為大晴天或攜帶了強力香草，可以立刻結束蓄力，在第一回合發動招式。在天氣為下雨、沙暴、冰雹或下雪時且自身沒有攜帶萬能傘，威力減半。",
    "If this move is successful, the effects of Leech Seed and binding moves end against the user, and all hazards are removed from the user's side of the field.": "只要此招式成功使出，會移除己方場地上的入場可生效的狀態；擺脫自身束縛、寄生種子狀態。",
    "The user restores 1/2 of its maximum HP if no weather conditions are in effect, 2/3 of its maximum HP if the weather is Sunny Day, and 1/4 of its maximum HP if the weather is Hail, Rain Dance, or Sandstorm, all rounded down.": "如果沒有天氣，使用者回復最大生命值的1/2，如果天氣是晴天，則恢覆其最大HP的2/3，如果天氣為冰雹、下雨或沙暴，則恢覆最大HP的1/4，全部向下取整。",
    "Fails if the target did not select a physical or special attack for use this turn, or if the target moves before the user.": "如果目標沒有使用攻擊招式或比使用者更快使出招式，使用失敗。",
    "The user loses its focus and does nothing if it is hit by a damaging attack this turn before it can execute the move, but it still loses PP.": "如果在發動攻擊前受到傷害，則招式會失敗且會失去PP。",
    "At the end of the next turn, the Pokemon at the user's position has 1/2 of its maximum HP restored to it, rounded down. Fails if this move is already in effect for the user's position.": "陷入祈願狀態，使用祈願後的下一回合，HP會回復。下回合結束時，恢覆換上場的寶可夢回復自己的1/2最大HP。",
    "The target's held item is lost for the rest of the battle, unless it has the Sticky Hold Ability. During the effect, the target cannot gain a new item by any means.": "如果目標沒有黏著特性且使用者沒有瀕死，則目標在戰鬥結束前失去其攜帶物品。在效果期間，無法獲得新的物品。",
    "The target's held item is lost for the rest of the battle, unless the item is a Griseous Orb or the target has the Multitype or Sticky Hold Abilities. During the effect, the target cannot obtain a new item by any means.": "如果目標持有可被拍落的攜帶物品並且沒有黏著特性且使用者沒有瀕死，則目標在戰鬥結束前失去其攜帶物品。因拍落而失去的物品無法通過任何方式回收。無法拍落白金寶珠。",
    "Has a 10% chance to paralyze the target. If the target lost HP, the user takes recoil damage equal to 1/3 the HP lost by the target, rounded down, but not less than 1 HP.": "有10%幾率使目標陷入麻痹狀態。如果目標失去了HP，使用者承受對目標造成傷害的1/3的傷害，向上取整一半，但不小於1。",
    "Power doubles if a weather condition is active, and this move's type changes to match. Ice type during Hail, Water type during Rain Dance, Rock type during Sandstorm, and Fire type during Sunny Day.": "如果有天氣，威力翻倍。該招式的屬性會根據天氣不同而變化：天氣為冰雹時為冰屬性，下雨時為水屬性，沙暴時為岩石屬性，大晴天時為火屬性。",
    "This attack charges on the first turn and executes on the second. Damage is halved if the weather is Hail, Rain Dance, or Sandstorm. If the user is holding a Power Herb or the weather is Sunny Day, the move completes in one turn.": "在第一回合進行蓄力，第二回合攻擊目標。如果當天氣為大晴天狀態或攜帶了強力香草，可以立刻結束蓄力，在第一回合發動招式。在天氣為下雨、沙暴、冰雹狀態時，威力減半。",
    "Has a 30% chance to make the target flinch. Damage doubles and no accuracy check is done if the target has used Minimize while active.": "有30%的幾率使目標陷入畏縮狀態。如果目標處於變小狀態，威力翻倍且必定命中。",
    "Has a higher chance for a critical hit. This move cannot be redirected to a different target by any effect.": "攻擊原本選定的目標。容易擊中要害。",
    "Has a 20% chance to burn the target. If the weather is Primordial Sea or Rain Dance, this move does not check accuracy. If this move is used against a Pokemon holding Utility Umbrella, this move's accuracy remains at 80%.": "有20%幾率使目標陷入灼傷狀態。天氣為下雨或大雨時，熱沙風暴一定會命中，除非目標正在使用蓄力的招式並不在場地上。如果目標攜帶了萬能傘，此招式的命中率為80%。",
    "Has a 30% chance to lower the target's Speed by 1 stage. If the weather is Primordial Sea or Rain Dance, this move does not check accuracy. If this move is used against a Pokemon holding Utility Umbrella, this move's accuracy remains at 80%.": "有30%幾率令目標的速度降低1級。天氣為下雨或大雨時，熱沙風暴一定會命中，除非目標正在使用蓄力的招式並不在場地上。如果目標攜帶了萬能傘，此招式的命中率為80%。",
    "Has a 20% chance to paralyze the target. If the weather is Primordial Sea or Rain Dance, this move does not check accuracy. If this move is used against a Pokemon holding Utility Umbrella, this move's accuracy remains at 80%.": "有20%幾率使目標陷入麻痹狀態。天氣為下雨或大雨時，熱沙風暴一定會命中，除非目標正在使用蓄力的招式並不在場地上。如果目標攜帶了萬能傘，此招式的命中率為80%。",
    "Power doubles if the target is using Bounce, Fly, or Sky Drop, or is under the effect of Sky Drop.": "如果目標正處於彈跳、飛翔或自由落體狀態，威力翻倍。",
    "For 5 turns, all active Pokemon have their Defense and Special Defense stats swapped. Stat stage changes are unaffected. If this move is used during the effect, the effect ends.": "5回合中，所有場上的寶可夢自身的防禦與特防能力值交換，不影響能力等級。在奇妙空間效果存在的情況下再次使用奇妙空間，會結束奇妙空間的效果。",
    "The target is unaffected by this move unless it is asleep. The user recovers 1/2 the HP lost by the target, rounded half up. If Big Root is held by the user, the HP recovered is 1.3x normal, rounded half down.": "既未處於睡眠狀態又沒有特性絕對睡眠的寶可夢不受食夢影響。使用者將造成傷害的50%轉化為自身的HP，向上取整一半。攜帶大根莖時，恢覆量提升30%，向下取整一半。",
    "Has a 20% chance to make the target flinch. Damage doubles and no accuracy check is done if the target has used Minimize while active.": "有20%的幾率使目標陷入畏縮狀態。如果目標處於變小狀態，威力翻倍且必定命中。",
    "Whether or not this move is successful and even if it would cause fainting, the user loses 1/2 of its maximum HP, rounded up, unless the user has the Magic Guard Ability.": "對使用者造成最大HP的1/2（向上取整）傷害。即使招式未命中、HP不足1/2，使用者仍然會受到傷害，除非使用者擁有魔法防守特性。",
    "This move summons Light Screen for 5 turns upon use.": "使己方場地變為光牆狀態。",
    "This move summons Reflect for 5 turns upon use.": "使己方場地變為反射壁狀態。",
    "Raises the user's Defense by 1 stage. As long as the user remains active, the power of the user's Ice Ball and Rollout will be doubled (this effect is not stackable).": "令使用者的防禦提升1級。使用冰球和滾動進行攻擊的威力將加倍。",
    "Causes the Grass type to be added to the target, effectively making it have two or three types. Fails if the target is already a Grass type. If Trick-or-Treat adds a type to the target, it replaces the type added by this move and vice versa.": "如果目標沒有草屬性，追加第二或第三屬性草屬性。目標擁有草屬性時，招式使用失敗。進入萬聖夜狀態時會解除森林詛咒狀態，反之亦然。",
    "Has a 30% chance to confuse the target. If this attack is not successful, the user loses half of its maximum HP, rounded down, as crash damage. Pokemon with the Magic Guard Ability are unaffected by crash damage.": "有30%的幾率使目標陷入混亂狀態。如果招式未命中或因為屬性相性或特性而沒有產生效果，自身承受最大HP的1/2（向下取整）的反作用力傷害，除非使用者擁有魔法防守特性。",
    "Causes the target to take its turn after all other Pokemon this turn, no matter the priority of its selected move. Fails if the target already moved this turn.": "如果對手此回合還沒有行動，該招式命中後對手變為最後行動且不根據優先度使用招式順序。如果目標此回合已經行動，使用失敗。",
    "Causes the target to become a Water type. Fails if the target is an Arceus or a Silvally, if the target is already purely Water type, or if the target is Terastallized.": "將目標的屬性變成水屬性。無法改變擁有多屬性、AR系統特性、只有水屬性或太晶化的寶可夢的屬性。",
    "Raises the user's Attack and Special Attack by 1 stage. If the weather is Sunny Day or Desolate Land, this move raises the user's Attack and Special Attack by 2 stages.": "令使用者的攻擊和特攻提升1級，如果天氣是大日照或大晴天，改為提升2級。",
    "The user swaps positions with its ally. Fails if the user is the only Pokemon on its side.": "在雙打對戰中與己方目標交換位置；目標位置沒有寶可夢時使用該招式會失敗。",
    "The power of this move depends on (user's current Speed / target's current Speed), rounded down. Power is equal to 150 if the result is 4 or more, 120 if 3, 80 if 2, 60 if 1, 40 if less than 1. If the target's current Speed is 0, this move's power is 40.": "此招式的威力=（使用者的當前速度/目標的當前速度），向下取整。如果結果為4或更大，則威力為150；如果為3，則威力為120；如果為2，則威力為80；如果為1，則威力為60；如果小於1，威力為40。",
    "The power of this move is 20 if X is 33 to 48, 40 if X is 17 to 32, 80 if X is 10 to 16, 100 if X is 5 to 9, 150 if X is 2 to 4, and 200 if X is 0 or 1, where X is equal to (user's current HP * 48 / user's maximum HP), rounded down.": "威力和自身剩下的HP有關(向下取整)。HP≥68.75%，威力為20；35.42%≤HP＜68.75%，威力為40；20.83%≤HP＜35.42%，威力為80；10.42%≤HP＜20.83%，威力為100；4.17%≤HP＜10.42%，威力為150；0＜HP＜4.17%，威力為200。",
    "Power is equal to 120 * (target's current HP / target's maximum HP), rounded half down, but not less than 1.": "威力 = 120 × 當前HP/最大HP。向下取整一半，但不小於1。",
    "Has a 30% chance to make the target flinch. Fails if the user is not asleep.": "有30%的幾率使目標陷入畏縮狀態。如果使用者未處於睡眠，使用失敗。",
    "The user's non-volatile status condition is transferred to the target, and the user is then cured. Fails if the user has no non-volatile status condition or if the target already has one.": "將自身的異常狀態轉移給目標，自身解除異常狀態。如果自身沒有異常狀態或目標已有異常狀態，使用失敗。",
    "Raises the Defense of all active Grass-type Pokemon by 1 stage. Fails if there are no active Grass-type Pokemon.": "令在場的所有草屬性寶可夢的防禦提升1級。如果沒有草屬性寶可夢在場，使用失敗。",
    "If this attack does not miss and whether or not the target is immune, the effects of Reflect and Light Screen end for the opponent's side of the field before damage is calculated.": "如果成功使出該招式，即使免疫此攻擊也會在造成傷害之前破壞對方場地的光牆和反射壁。",
    "If this move is successful, the effects of Leech Seed and binding moves end for the user, and Spikes are removed from the user's side of the field.": "如果成功使出該招式，移除己方場地上的撒菱並擺脫寄生種子的束縛。",
    "Has a 100% chance to steal the target's held item if the user is not holding one. The target's item is not stolen if it is a Mail.": "如果自身沒有攜帶物品，100%幾率竊取目標的物品。如果目標攜帶的是郵件，則不會竊取。",
    "The user faints after using this move. The target's Defense is halved during damage calculation.": "自身陷入瀕死狀態然後攻擊目標造成傷害，將目標的防禦能力值減半計算。",
    "Every Pokemon in the user's party is cured of its non-volatile status condition.": "治癒己方隊伍所有寶可夢的異常狀態。",
    "If this attack is not successful and the target was not immune, the user loses HP equal to 1/8 the damage the target would have taken, rounded down, but not less than 1 HP, as crash damage.": "如果攻擊沒有產生效果，自身承受本應造成傷害的1/8，向下取整。",
    "If the target lost HP, the user takes recoil damage equal to 1/4 the HP lost by the target, rounded down, but not less than 1 HP. If this move hits a substitute, the recoil damage is always 1 HP.": "如果目標失去了HP，使用者承受對目標造成傷害的1/4的傷害，向上取整一半，但不小於1。如果此次攻擊打破了替身，使用者只需承受1點傷害。",
    "If the target lost HP, the user takes recoil damage equal to 1/3 the HP lost by the target, rounded down, but not less than 1 HP. If this move hits a substitute, the recoil damage is always 1 HP.": "如果目標失去了HP，使用者承受對目標造成傷害的1/3的傷害，向上取整一半，但不小於1。如果此次攻擊打破了替身，使用者只需承受1點傷害。",
    "If the target lost HP, the user takes recoil damage equal to 1/2 the HP lost by the target, rounded down, but not less than 1 HP. If this move hits a substitute, the recoil damage is always 1 HP.": "如果目標失去了HP，使用者承受對目標造成傷害的1/2的傷害，向上取整一半，但不小於1。如果此次攻擊打破了替身，使用者只需承受1點傷害。",
    "If the target switches out this turn, this move hits it before it leaves the field with doubled power and the user's turn is over.": "如果目標在這個回合離場，此招式會在其離場之前擊中它且傷害翻倍。結束使用者的回合。",
    "This attack charges on the first turn and executes on the second. Damage is halved if the weather is Rain Dance. If the weather is Sunny Day, the move completes in one turn.": "在第一回合進行蓄力，第二回合攻擊目標。如果天氣為大晴天，可以立刻結束蓄力，在第一回合發動招式。如果天氣為下雨，威力減半。",
    "Has a 30% chance to paralyze the target. This move can hit a target using Fly. If the weather is Rain Dance, this move does not check accuracy. If the weather is Sunny Day, this move's accuracy is 50%.": "有30%幾率使目標陷入麻痹狀態。如果天氣為雨天，此招式必定命中；如果天氣為大晴天，命中率為50%。",
    "For 5 turns, the user and its party members have their Defense doubled. Critical hits ignore this effect. Fails if the effect is already active on the user's side.": "5回合內我方寶可夢受到的物理招式傷害減半。擊中要害時無視此效果。如果我方已處於此效果，使用失敗。",
    "For 5 turns, the user and its party members have their Sp. Def doubled. Critical hits ignore this effect. Fails if the effect is already active on the user's side.": "5回合內我方寶可夢受到的特殊招式傷害減半。擊中要害時無視此效果。如果我方已處於此效果，使用失敗。",
    "Has a higher chance for a critical hit. This attack charges on the first turn and executes on the second.": "容易擊中要害。在第一回合進行蓄力，第二回合攻擊目標。",
    "The user faints after using this move, unless this move broke the target's substitute. The target's Defense is halved during damage calculation.": "自身陷入瀕死狀態並攻擊目標造成傷害，將目標的防禦能力值減半計算。如果命中了替身，不會陷入瀕死。",
    "Deals damage to the target equal to the user's level. This move ignores type immunity.": "對目標造成與使用者等級相等的傷害。可以擊中屬性相性為0的目標。",
    "This move summons Leech Seed on the foe.": "使對手陷入寄生種子狀態。",
    "The target makes its move immediately after the user this turn, no matter the priority of its selected move. Fails if the target would have moved next anyway, or if the target already moved this turn.": "目標將會在使用者之後立刻行動,無視優先度的影響。如果目標當回合已經使用過招式或使用過後順序沒產生變化，使用失敗。",
    "The user transforms into the target. The target's current stats, stat stages, types, moves, DVs, species, and sprite are copied. The user's level and HP remain the same and each copied move receives only 5 PP. This move can hit a target using Dig or Fly.": "使用者變身成目標寶可夢。目標的當前能力、能力等級、屬性、招式、特性、重量和種族都會被複製。使用者的HP不變，複製的招式均只有5點PP。此招式可以命中正處於挖洞或飛翔的目標。",
    "Hits two to five times. Has a 3/8 chance to hit two or three times, and a 1/8 chance to hit four or five times. Damage is calculated once for the first hit and used for every hit. If one of the hits breaks the target's substitute, the move ends.": "一回合內連續攻擊2～5次。命中時，各有1/8的幾率攻擊5或4次，3/8的幾率攻擊3或2次。如果其中一下打破了替身，招式立即結束。",
    "The power of this move is based on the amount of PP remaining after normal PP reduction and the Pressure Ability resolve. 200 power for 0 PP, 80 power for 1 PP, 60 power for 2 PP, 50 power for 3 PP, and 40 power for 4 or more PP.": "威力取決於該招式剩餘的PP。剩餘1PP為200威力；剩餘2PP為80威力；剩餘3PP為60威力；剩餘4PP為50威力；剩餘4以上為40威力。",
    "The user prevents all opposing Pokemon from using any moves that the user also knows as long as the user remains active. Z-Powered moves can still be selected and executed during this effect.": "自身處於封印狀態期間，對手的任何寶可夢不能使出與自身學會的任一招式相同的招式。封印狀態期間，Z招式仍然可以正常選擇並使用。",
    "If this move is successful, it deals damage or heals the target. 40% chance for 40 power, 30% chance for 80 power, 10% chance for 120 power, and 20% chance to heal the target by 1/4 of its maximum HP, rounded down.": "隨機選擇如下效果：40%幾率以40威力攻擊對手；30%幾率以80威力攻擊對手；10%幾率以120威力攻擊對手；20%幾率回復對手1/4的最大HP(向下取整)。",
    "Raises the user's Special Defense by 1 stage. If the user uses an Electric-type attack on the next turn, its power will be doubled.": "令使用者的特防提升1級。下次使用的電屬性招式威力翻倍。",
    "Until the end of the next turn, the user's attacks will be critical hits.": "下一回合結束前，招式必定會擊中要害。",
    "For 5 turns, all Fire-type attacks used by any active Pokemon have their power multiplied by 0.33. Fails if this effect is already active.": "在5回合內，在場寶可夢的火屬性的招式威力變為原本的33%。如果此狀態已激活，使用失敗。",
    "For 5 turns, all Electric-type attacks used by any active Pokemon have their power multiplied by 0.33. Fails if this effect is already active.": "在5回合內，在場寶可夢的電屬性的招式威力變為原本的33%。如果此狀態已激活，使用失敗。",
    "The target loses its held item if it is a Berry or a Gem. This move cannot cause Pokemon with the Sticky Hold Ability to lose their held item. Items lost to this move cannot be regained with Recycle or the Harvest Ability.": "如果對手持有樹果或寶石，道具會被燒毀。被燒盡的道具不能被回收利用或收獲特性收回。",
    "This move calls another move for use based on the battle terrain. Tri Attack on the regular Wi-Fi terrain, Thunderbolt during Electric Terrain, Moonblast during Misty Terrain, Energy Ball during Grassy Terrain, and Psychic during Psychic Terrain.": "根據場地的不同使出另一個招式。對應使出的招式變化如下：無場地使出三重攻擊，電氣場地使出十萬伏特，青草場地使出能量球，薄霧場地使出月亮之力，精神場地使出精神強念。",
    "Raises the Attack and Special Attack of all grounded Grass-type Pokemon on the field by 1 stage.": "令場上所有的地面上的草屬性寶可夢的攻擊和特攻提升1級。",
    "The type and power of this move depend on the user's held Berry, and the Berry is lost. Fails if the user is not holding a Berry, if the user has the Klutz Ability, or if Embargo or Magic Room is in effect for the user.": "威力和屬性取決於這只寶可夢身上的樹果。樹果在使用後會消失。如果自身沒有攜帶樹果，或處於不能使用樹果的狀態（例如處於查封狀態、緊張感特性、拍落狀態、笨拙特性的影響下），則招式使用失敗，樹果不會消耗。",
    "Raises the Attack and Special Attack of Pokemon on the user's side with the Plus or Minus Abilities by 1 stage.": "令己方所有特性為正電或負電的寶可夢的攻擊和特攻提升1級。",
    "Lowers the target's Attack, Special Attack, and Speed by 1 stage if the target is poisoned. Fails if the target is not poisoned.": "令中毒的目標的攻擊、特攻和速度降低1級。如果目標未中毒，使用失敗。",
    "The target is immune if it does not share a type with the user.": "對沒有任一相同屬性的目標無效。",
    "Power doubles if the target is paralyzed. If the user has not fainted, the target is cured of paralysis.": "如果目標處於麻痹狀態，招式的威力加倍，並且解除目標的麻痹狀態。",
    "For 2 turns, the target cannot use sound-based moves. Z-Powered sound moves can still be selected and executed during this effect.": "在2回合內，目標無法使出聲音的招式。Z招式不受此狀態影響。",
    "Has a higher chance for a critical hit. This attack charges on the first turn and executes on the second. If the user is holding a Power Herb, the move completes in one turn.": "容易擊中要害。在第一回合進行蓄力，第二回合攻擊目標。如果攜帶了強力香草，可以立刻結束蓄力，在第一回合發動招式。",
    "The user uses the last move used by the target. The copied move is used against that target, if possible. Fails if the target has not made a move, or if the last move used cannot be copied by this move.": "使用目標最後使用過的招式。使出的招式目標為單體選擇時，目標為鸚鵡學舌的招式目標。如果目標沒有使用招式或使用的招式無法複製，使用失敗。",
    "Raises the target's Attack by 2 stages and confuses it. This move will miss if the target's Attack cannot be raised.": "提升目標2級攻擊並令其陷入混亂狀態。如果目標的攻擊無法提升，使用失敗。",
    "The target is forced to switch out and be replaced with a random unfainted ally. Fails if the target is the last unfainted Pokemon in its party, or if the user moves before the target.": "令對方隊伍中隨機一只沒有陷入瀕死狀態的寶可夢強制替換上場。如果目標是其隊伍中唯一沒有陷入瀕死狀態的寶可夢或使用者比目標先行動，使用失敗。",
    "Deals damage to the target equal to half of its current HP, rounded down, but not less than 1 HP. This move ignores type immunity.": "對目標造成目標當前HP1/2（向下取整）的傷害。至少造成1傷害。不受屬性相性影響。",
    "Hits twice, with the second hit having a 20% chance to poison the target. If the first hit breaks the target's substitute, the move ends.": "連續攻擊2次，第二次攻擊有20%的幾率使目標陷入中毒狀態。如果第一下打破了替身，招式會立即停止。",
    "The user restores 1/2 of its maximum HP, rounded down. Fails if (user's maximum HP - user's current HP + 1) is divisible by 256.": "使用者回復1/2最大HP，向下取整。如果使用者的最大生命值-使用者的當前生命值+1可被256整除，使用失敗。",
    "While the user remains active, its Defense is doubled when taking damage. Critical hits ignore this protection. This effect can be removed by Haze.": "使用者在場時受到的物理招式傷害減半。擊中要害時無效此效果。黑霧可以清除此效果。",
    "While the user remains active, its Special is doubled when taking damage. Critical hits ignore this effect. If any Pokemon uses Haze, this effect ends.": "使用者在場時受到的特殊招式傷害減半。擊中要害時無效此效果。黑霧可以清除此效果。",
    "If the target lost HP, the user takes recoil damage equal to 1/4 the HP lost by the target, rounded half up, but not less than 1 HP. If this move hits a substitute, the recoil damage is always 1 HP.": "如果目標失去了HP，使用者承受對目標造成傷害的1/4的傷害，向上取整一半，但不小於1。如果此次攻擊命中了替身，使用者只需承受1點傷害。",
    "If the target lost HP, the user takes recoil damage equal to 1/3 the HP lost by the target, rounded half up, but not less than 1 HP. If this move hits a substitute, the recoil damage is always 1 HP.": "如果目標失去了HP，使用者承受對目標造成傷害的1/3的傷害，向上取整一半，但不小於1。如果此次攻擊命中了替身，使用者只需承受1點傷害。",
    "If the target lost HP, the user takes recoil damage equal to 1/2 the HP lost by the target, rounded half up, but not less than 1 HP. If this move hits a substitute, the recoil damage is always 1 HP.": "如果目標失去了HP，使用者承受對目標造成傷害的1/2的傷害，向上取整一半，但不小於1。如果此次攻擊命中了替身，使用者只需承受1點傷害。",
    "For 3 to 5 turns, prevents the target from using non-damaging moves.": "在3～5回合內，使目標不能使用變化招式。",
    "If this attack misses the target, the user takes 1 HP of crash damage. If the user has a substitute, the crash damage is dealt to the target's substitute if it has one, otherwise no crash damage is dealt.": "如果攻擊沒有產生效果，自身承受1點傷害。如果使用者處於替身狀態則不會承受傷害。如果使用者和目標均處於替身狀態，傷害由目標的替身承擔。",
    "The user steals the target's held Berry if it is holding one and eats it immediately, gaining its effects unless the user's item is being ignored. Items lost to this move can be regained with Recycle.": "如果目標攜帶了樹果，會消耗目標的樹果並獲得該樹果的效果。若使用該招式的寶可夢處於查封狀態或特性為笨拙，仍然能消耗目標的樹果，但不會獲得樹果的效果。通過此招式丟失的樹果可以使用回收利用收回。",
    "Raises the user's chance for a critical hit by 2 stages. Fails if the user already has the effect. Baton Pass can be used to transfer this effect to an ally.": "使自身的擊中要害率上升2級。如果使用者已處於此狀態，使用失敗。如果使用者使用了接棒，新上場的寶可夢將繼承此效果。",
    "Causes Normal-type moves to become Electric type this turn. The effect happens after other effects that change a move's type.": "1回合內所有使用的一般屬性的招式變為電屬性。不會影響覺醒力量以及飛行皮膚、冰凍皮膚、妖精皮膚和電氣皮膚特性的寶可夢使用的一般屬性招式。",
    "Lowers the target's Special Attack by 2 stages. The target is unaffected if both the user and the target are the same gender, or if either is genderless. Pokemon with the Oblivious Ability are immune.": "令目標的特攻降低2級。如果自身與目標相同性別，或一方為無性別，則招式失敗。擁有遲鈍特性的寶可夢免疫此效果。",
    "The power of this move varies; 5% chances for 10 and 150 power, 10% chances for 30 and 110 power, 20% chances for 50 and 90 power, and 30% chance for 70 power. Damage doubles if the target is using Dig.": "招式威力在10～150中隨機變化。具體概率為：各有5%幾率為10或150威力；10%幾率為30或70威力；20%幾率為50或90威力；30%概率為70威力。如果目標處於挖洞狀態，威力翻倍。",
    "For 5 turns, the user and its party members cannot be struck by a critical hit. Fails if the effect is already active on the user's side.": "5回合內，不會被對手的招式擊中要害。如果己方已經處於此狀態，使用失敗。",
    "Once this move is successfully used, the user's Attack is raised by 1 stage every time it is hit by another Pokemon's attack as long as this move is chosen for use.": "在使用該招式後到下次使用者使用招式之前，每受到一次攻擊造成的傷害，使用者的攻擊能力提升1級。",
    "The user uses the last move used by the target. Fails if the target has not made a move since the user switched in, or if the last move used was Mirror Move.": "使用當回合目標使用過的招式。目標本回合未行動時或目標最後使用的招式是鸚鵡學舌，招式使用失敗。",
};
function trans_from_dict(a) {
    var b = translations[a];
    if (b) return b;
    return a;
}

var QQ = $.noConflict();


var regex_item_was = new RegExp(/^ ([A-z0-9,'.() -]+?) \(was ([A-z0-9,'.() -]+?)\)$/);
var regex_toCommander = new RegExp(/^The opposing (.+?) was swallowed by the opposing (.+?) and became the opposing (.+?)'s commander!$/);
var regex_Commander = new RegExp(/^(.+?) was swallowed by (.+?) and became (.+?)'s commander!$/);
var regex_tomagic_bounce = new RegExp(/^The opposing (.+?) bounced the ([A-z0-9,'.() -]+?) back!$/);
var regex_magic_bounce = new RegExp(/^(.+?) bounced the ([A-z0-9,'.() -]+?) back!$/);
var regex_start_battle = new RegExp(/^Battle started between (.+?) and (.+?)!$/);
var regex_touturn = new RegExp(/^The opposing (.+?) went back to (.+?)!$/);
var regex_uturn = new RegExp(/^(.+?) went back to (.+?)!$/);
var regex_togems = new RegExp(/^The ([A-z0-9,'.() -]+?) strengthened the opposing (.+?)'s power!$/);
var regex_gems = new RegExp(/^The ([A-z0-9,'.() -]+?) strengthened (.+?)'s power!$/);
var regex_toeat2 = new RegExp(/^\(The opposing (.+?) used its ([A-z0-9,'.() -]+?)!\)$/);
var regex_eat2 = new RegExp(/^\((.+?) used its ([A-z0-9,'.() -]+?)!\)$/);
var regex_toeat = new RegExp(/^\(The opposing (.+?) ate its ([A-z0-9,'.() -]+?)!\)$/);
var regex_eat = new RegExp(/^\((.+?) ate its ([A-z0-9,'.() -]+?)!\)$/);
var regex_sent_out_first2 = new RegExp(/^([A-z0-9,'.() -]+?), ([A-z0-9,'.() -]+?) will be sent out first.$/);
var regex_sent_out_first = new RegExp(/^([A-z0-9,'.() -]+?) will be sent out first.$/);
var regex_sent_out2 = new RegExp(/^(.+?) sent out (.+?) \(/);
var regex_sent_out = new RegExp(/^(.+?) sent out $/);
var regex_withdrew = new RegExp(/^(.+?) withdrew (.+?)!$/);
var regex_tolost_health = new RegExp(/^\(The opposing (.+?) lost (.+?)% of its health!\)$/);
var regex_lost_health = new RegExp(/^\((.+?) lost (.+?)% of its health!\)$/);
var regex_tolost_health2 = new RegExp(/^\(The opposing (.+?) lost $/);
var regex_lost_health2 = new RegExp(/^\((.+?) lost $/);
var regex_tomega = new RegExp(/^The opposing (.+?) has Mega Evolved into Mega ([A-z0-9,'.() -]+?)!$/);
var regex_mega = new RegExp(/^(.+?) has Mega Evolved into Mega ([A-z0-9,'.() -]+?)!$/);
var regex_come_back = new RegExp(/^(.+?), come back!$/);
var regex_tomax_guard = new RegExp(/^\(Max Guard started on the opposing (.+?)!\)$/);
var regex_max_guard = new RegExp(/^\(Max Guard started on (.+?)!\)$/);
var regex_key_stone = new RegExp(/^(The opposing )*(.+?)'s (.+?) is reacting to the Key Stone!/)
var regex_move_no_effect = new RegExp(/^\((The opposing )*([A-z -']+[A-z]) blocked the effect!\)$/);
var regex_topointed_stones = new RegExp(/^Pointed stones dug into the opposing (.+?)!$/);
var regex_pointed_stones = new RegExp(/^Pointed stones dug into (.+?)!$/);
var regex_toafter_taunt = new RegExp(/^The opposing (.+?) can't use ([A-z- ]+?) after the taunt!$/);
var regex_after_taunt = new RegExp(/^(.+?) can't use ([A-z- ]+?) after the taunt!$/);
var regex_chn = new RegExp(/^\u4E00-\u9FA5+$/);
var regex_go = new RegExp(/^Go! (.+?) \($/);
var regex_tog6_mega = new RegExp(/^The opposing (.+?)'s ([A-z0-9,'.() -]+?) is reacting to (.+?)'s Mega Bracelet!$/);
var regex_g6_mega = new RegExp(/^(.+?)'s ([A-z0-9,'.() -]+?) is reacting to (.+?)'s Mega Bracelet!$/);
var regex_tocannot_use2 = new RegExp(/^The opposing (.+?) can't use its sealed ([A-z0-9,'.() -]+?)!$/);
var regex_cannot_use2 = new RegExp(/^(.+?) can't use its sealed ([A-z0-9,'.() -]+?)!$/);
var regex_seconds_left2 = new RegExp(/^(.+?) has ([0-9]+?) seconds left this turn.$/);
var regex_seconds_left = new RegExp(/^(.+?) has ([0-9]+?) seconds left.$/);
var regex_timer_on = new RegExp(/^Battle timer is ON: inactive players will automatically lose when time's up. \(requested by (.+?)\)$/);
var regex_reset_timer = new RegExp(/^The timer can't be re-enabled so soon after disabling it \(([0-9]+?) seconds remaining\)./)
var regex_team = new RegExp(/^(.+?)'s team:$/);
var regex_tofuture_sight = new RegExp(/^The opposing (.+?) foresaw an attack!$/);
var regex_future_sight = new RegExp(/^(.+?) foresaw an attack!$/);
var regex_toFutureSight_DoomDesire_attack = new RegExp(/^The opposing (.+?) took the (Future Sight|Doom Desire) attack!$/);
var regex_FutureSight_DoomDesire_attack = new RegExp(/^(.+?) took the (Future Sight|Doom Desire) attack!$/);
var regex_totype_change = new RegExp(/^The opposing (.+?)'s type changed to ([A-z0-9,'.() -]+?)!$/);
var regex_type_change = new RegExp(/^(.+?)'s type changed to ([A-z0-9,'.() -]+?)!$/);
var regex_hit_times = new RegExp(/^The Pokemon was hit ([0-9]+?) times!$/);
var regex_battle = new RegExp(/^(.+?) wants to battle!$/);
var regex_cancelled = new RegExp(/^(.+?) cancelled the challenge.$/);
var regex_waitingavailable = new RegExp(/^Waiting for battles to become available(.+?)$/);
var regex_challengex = new RegExp(/^Challenge (.+?)?$/);
var regex_wftcy = new RegExp(/^Waiting for (.+?) to challenge you.$/);
var regex_waiting = new RegExp(/^Waiting for (.+?)$/);
var regex_accepted = new RegExp(/^(.+?) accepted the challenge, starting «$/);
var regex_forfeited = new RegExp(/^(.+?) forfeited.$/);
var regex_copyofuntitled2 = new RegExp(/^Copy of Copy of (Untitled|Box) (.+?)$/);
var regex_copyofuntitled = new RegExp(/^Copy of (Untitled|Box) (.+?)$/);
var regex_copyof = new RegExp(/^Copy of (.+?)$/);
var regex_untitled = new RegExp(/^(Untitled|Box) (.+?)$/);
var regex_newteam = new RegExp(/^ New (.+?) Team$/);
var regex_users2 = new RegExp(/^\(([0-9]+?) users\)$/);
var regex_users = new RegExp(/^([0-9]+?) users$/);
var regex_theopposingfainted = new RegExp(/^The opposing (.+?) fainted!$/);
var regex_fainted = new RegExp(/^(.+?) fainted!$/);
var regex_wish = new RegExp(/^(.+?)'s wish came true!$/);
var regex_doestaffecttd = new RegExp(/^It doesn't affect the opposing (.+?)...$/);
var regex_doestaffect = new RegExp(/^It doesn't affect (.+?)...$/);
var regex_younoteams = new RegExp(/^You have no (.+?) teams$/);
var regex_youdontha = new RegExp(/^you don't have any (.+?) teams$/);
var regex_theinverted = new RegExp(/^The opposing (.+?)'s stat changes were inverted!$/);
var regex_inverted = new RegExp(/^(.+?)'s stat changes were inverted!$/);
var regex_rejectchallenge = new RegExp(/^(.+?) rejected the challenge.$/);
var regex_thesustookto = new RegExp(/^The substitute took damage for the opposing (.+?)!$/);
var regex_thesustook = new RegExp(/^The substitute took damage for (.+?)!$/);
var regex_totohbawi = new RegExp(/^The opposing (.+?) has been afflicted with an infestation by the opposing (.+?)!$/);
var regex_tohbawi2 = new RegExp(/^The opposing (.+?) has been afflicted with an infestation by (.+?)!$/);
var regex_tohbawi = new RegExp(/^(.+?) has been afflicted with an infestation by the opposing (.+?)!$/);
var regex_hbawi = new RegExp(/^(.+?) has been afflicted with an infestation by (.+?)!$/);
var regex_iseoto = new RegExp(/^It's super effective on the opposing (.+?)!$/);
var regex_iseo = new RegExp(/^It's super effective on (.+?)!$/);
var regex_isnveoto = new RegExp(/^It's not very effective on the opposing (.+?).$/);
var regex_isnveo = new RegExp(/^It's not very effective on (.+?).$/);
var regex_achoto = new RegExp(/^A critical hit on the opposing (.+?)!$/);
var regex_acho = new RegExp(/^A critical hit on (.+?)!$/);
var regex_willswitchin = new RegExp(/^([A-z0-9,'.()% -]+?) will switch in, replacing ([A-z0-9,'.()% -]+?).$/);
var regex_youjoined = new RegExp(/^You joined (.+?)$/);
var regex_uteamsvf = new RegExp(/^Your team is valid for (.+?).$/);
var regex_Metronome = new RegExp(/^Waggling a finger let it use ([A-z0-9,'.() -]+?)!$/);
var regex_iatbabi = new RegExp(/^(.+?) is about to be attacked by its ([A-z0-9,'.() -]+?)!$/);
var regex_toiatbabi = new RegExp(/^The opposing (.+?) is about to be attacked by its ([A-z0-9,'.() -]+?)!$/);
var regex_toctop2 = new RegExp(/^The opposing (.+?) corroded the opposing (.+?)'s ([A-z0-9,'.() -]+?)!$/);
var regex_toctop = new RegExp(/^The opposing (.+?) corroded (.+?)'s ([A-z0-9,'.() -]+?)!$/);
var regex_ctop = new RegExp(/^(.+?) corroded the opposing (.+?)'s ([A-z0-9,'.() -]+?)!$/);
var regex_ctop2 = new RegExp(/^(.+?) corroded (.+?)'s ([A-z0-9,'.() -]+?)!$/);
var regex_biftato = new RegExp(/^But it failed to affect the opposing (.+?)!$/);
var regex_bifta = new RegExp(/^But it failed to affect (.+?)!$/);
var regex_toshpif = new RegExp(/^The opposing (.+?)'s HP is full!$/);
var regex_shpif = new RegExp(/^(.+?)'s HP is full!$/);
var regex_tobiuiz = new RegExp(/^The opposing (.+?) boosted its ([A-z0-9,'.() -]+?) using its Z-Power!$/);
var regex_biuiz = new RegExp(/^(.+?) boosted its ([A-z0-9,'.() -]+?) using its Z-Power!$/);
var regex_thwctfto = new RegExp(/^The healing wish came true for the opposing (.+?)!$/);
var regex_thwctf = new RegExp(/^The healing wish came true for (.+?)!$/);
var regex_sfwhrtorm = new RegExp(/^(.+?)'s fervent wish has reached the opposing ([A-z0-9,'.() -]+?)!$/);
var regex_sfwhrrm = new RegExp(/^(.+?)'s fervent wish has reached ([A-z0-9,'.() -]+?)!$/);

var regex_protosynthesisto = new RegExp(/^The harsh sunlight activated the opposing (.+?)'s Protosynthesis!$/);
var regex_protosynthesis = new RegExp(/^The harsh sunlight activated (.+?)'s Protosynthesis!$/);
var regex_protosynthesisoffto = new RegExp(/^The effects of the opposing (.+?)'s Protosynthesis wore off!$/);
var regex_protosynthesisoff = new RegExp(/^The effects of (.+?)'s Protosynthesis wore off!$/);
var regex_quarkdrive = new RegExp(/^The Electric Terrain activated (.+?)'s Quark Drive!$/);
var regex_toquarkdrive = new RegExp(/^The Electric Terrain activated the opposing (.+?)'s Quark Drive!$/);
var regex_quarkdriveoff = new RegExp(/^The effects of (.+?)'s Quark Drive wore off!$/);
var regex_toquarkdriveoff = new RegExp(/^The effects of the opposing (.+?)'s Quark Drive wore off!$/);
var regex_toelectric_seed = new RegExp(/^The Electric Seed (sharply raised|raised|lowered) the opposing (.+?)'s Defense!$/);
var regex_electric_seed = new RegExp(/^The Electric Seed (sharply raised|raised|lowered) (.+?)'s Defense!$/);
var regex_tograssy_seed = new RegExp(/^The Grassy Seed (sharply raised|raised|lowered) the opposing (.+?)'s Defense!$/);
var regex_grassy_seed = new RegExp(/^The Grassy Seed (sharply raised|raised|lowered) (.+?)'s Defense!$/);
var regex_topsychic_seed = new RegExp(/^The Psychic Seed (sharply raised|raised|lowered) the opposing (.+?)'s Sp. Def!$/);
var regex_psychic_seed = new RegExp(/^The Psychic Seed (sharply raised|raised|lowered) (.+?)'s Sp. Def!$/);
var regex_tomisty_seed = new RegExp(/^The Misty Seed (sharply raised|raised|lowered) the opposing (.+?)'s Sp. Def!$/);
var regex_misty_seed = new RegExp(/^The Misty Seed (sharply raised|raised|lowered) (.+?)'s Sp. Def!$/);
var regex_tobroke = new RegExp(/^It broke through the opposing (.+?)'s protection!$/);
var regex_broke = new RegExp(/^It broke through (.+?)'s protection!$/);
var regex_toredcard = new RegExp(/^The opposing (.+?) held up its Red Card against (.+?)!$/);
var regex_redcard = new RegExp(/^(.+?) held up its Red Card against the opposing (.+?)!$/);
var regex_towindpower = new RegExp(/^Being hit by Tailwind charged the opposing (.+?) with power!$/);
var regex_windpower = new RegExp(/^Being hit by Tailwind charged (.+?) with power!$/);
var regex_torevivalblessing = new RegExp(/^The opposing (.+?) was revived and is ready to fight again!$/);
var regex_revivalblessing = new RegExp(/^(.+?) was revived and is ready to fight again!$/);
var regex_toclearamulet = new RegExp(/^The effects of the opposing (.+?)'s Clear Amulet prevent its stats from being lowered!$/);
var regex_clearamulet = new RegExp(/^The effects of (.+?)'s Clear Amulet prevent its stats from being lowered!$/);
var regex_toskullbash = new RegExp(/^The opposing (.+?) tucked in its head!$/);
var regex_skullbash = new RegExp(/^(.+?) tucked in its head!$/);
var regex_totofrisk = new RegExp(/^The opposing (.+?) frisked the opposing (.+?) and found its (.+?)!$/);
var regex_tofrisk2 = new RegExp(/^The opposing (.+?) frisked (.+?) and found its (.+?)!$/);
var regex_tofrisk = new RegExp(/^(.+?) frisked the opposing (.+?) and found its (.+?)!$/);
var regex_frisk = new RegExp(/^(.+?) frisked (.+?) and found its (.+?)!$/);
var regex_totopsychup = new RegExp(/^The opposing (.+?) copied the opposing (.+?)'s stat changes!$/);
var regex_topsychup2 = new RegExp(/^The opposing (.+?) copied (.+?)'s stat changes!$/);
var regex_topsychup = new RegExp(/^(.+?) copied the opposing (.+?)'s stat changes!$/);
var regex_psychup = new RegExp(/^(.+?) copied (.+?)'s stat changes!$/);
var regex_toencore = new RegExp(/^The opposing (.+?)'s encore ended!$/);
var regex_encore = new RegExp(/^(.+?)'s encore ended!$/);
var regex_totocurse = new RegExp(/^The opposing (.+?) cut its own HP and put a curse on the opposing (.+?)!$/);
var regex_tocurse2 = new RegExp(/^The opposing (.+?) cut its own HP and put a curse on (.+?)!$/);
var regex_tocurse = new RegExp(/^(.+?) cut its own HP and put a curse on the opposing (.+?)!$/);
var regex_curse = new RegExp(/^(.+?) cut its own HP and put a curse on (.+?)!$/);
var regex_toweakdamageberry = new RegExp(/^The ([A-z0-9,'.() -]+?) weakened the damage to the opposing (.+?)!$/);
var regex_weakdamageberry = new RegExp(/^The ([A-z0-9,'.() -]+?) weakened the damage to (.+?)!$/);
var regex_celebrate = new RegExp(/^Congratulations, (.+?)!$/);
var regex_tohpberry = new RegExp(/^The opposing (.+?) restored HP using its ([A-z0-9,'.() -]+?)!$/);
var regex_hpberry = new RegExp(/^(.+?) restored HP using its ([A-z0-9,'.() -]+?)!$/);
var regex_toaquaring = new RegExp(/^A veil of water restored the opposing (.+?)'s HP!$/);
var regex_aquaring = new RegExp(/^A veil of water restored (.+?)'s HP!$/);
var regex_tosalacberry = new RegExp(/^The Salac Berry (sharply raised|raised|lowered) the opposing (.+?)'s Speed!$/);
var regex_salacberry = new RegExp(/^The Salac Berry (sharply raised|raised|lowered) (.+?)'s Speed!$/);
var regex_toliechiberry = new RegExp(/^The Liechi Berry (sharply raised|raised|lowered) the opposing (.+?)'s Attack!$/);
var regex_liechiberry = new RegExp(/^The Liechi Berry (sharply raised|raised|lowered) (.+?)'s Attack!$/);
var regex_topetayaberry = new RegExp(/^The Petaya Berry (sharply raised|raised|lowered) the opposing (.+?)'s Sp. Atk!$/);
var regex_petayaberry = new RegExp(/^The Petaya Berry (sharply raised|raised|lowered) (.+?)'s Sp. Atk!$/);
var regex_toapicotberry = new RegExp(/^The Apicot Berry (sharply raised|raised|lowered) the opposing (.+?)'s Sp. Def!$/);
var regex_apicotberry = new RegExp(/^The Apicot Berry (sharply raised|raised|lowered) (.+?)'s Sp. Def!$/);
var regex_toganlonberry = new RegExp(/^The Ganlon Berry (sharply raised|raised|lowered) the opposing (.+?)'s Defense!$/);
var regex_ganlonberry = new RegExp(/^The Ganlon Berry (sharply raised|raised|lowered) (.+?)'s Defense!$/);
var regex_tomarangaberry = new RegExp(/^The Maranga Berry (sharply raised|raised|lowered) the opposing (.+?)'s Sp. Def!$/);
var regex_marangaberry = new RegExp(/^The Maranga Berry (sharply raised|raised|lowered) (.+?)'s Sp. Def!$/);
var regex_toLuminous_Moss = new RegExp(/^The Luminous Moss (sharply raised|raised|lowered) the opposing (.+?)'s Sp. Def!$/);
var regex_Luminous_Moss = new RegExp(/^The Luminous Moss (sharply raised|raised|lowered) (.+?)'s Sp. Def!$/);
var regex_toKee_Berry = new RegExp(/^The Kee Berry (sharply raised|raised|lowered) the opposing (.+?)'s Defense!$/);
var regex_Kee_Berry = new RegExp(/^The Kee Berry (sharply raised|raised|lowered) (.+?)'s Defense!$/);
var regex_toSnowball = new RegExp(/^The Snowball (sharply raised|raised|lowered) the opposing (.+?)'s Attack!$/);
var regex_Snowball = new RegExp(/^The Snowball (sharply raised|raised|lowered) (.+?)'s Attack!$/);
var regex_toAbsorb_Bulb = new RegExp(/^The Absorb Bulb (sharply raised|raised|lowered) the opposing (.+?)'s Sp. Atk!$/);
var regex_Absorb_Bulb = new RegExp(/^The Absorb Bulb (sharply raised|raised|lowered) (.+?)'s Sp. Atk!$/);
var regex_toCell_Bettery = new RegExp(/^The Cell Battery (sharply raised|raised|lowered) the opposing (.+?)'s Attack!$/);
var regex_Cell_Bettery = new RegExp(/^The Cell Battery (sharply raised|raised|lowered) (.+?)'s Attack!$/);
var regex_toAdrenaline_Orb = new RegExp(/^The Adrenaline Orb (sharply raised|raised|lowered) the opposing (.+?)'s Speed!$/);
var regex_Adrenaline_Orb = new RegExp(/^The Adrenaline Orb (sharply raised|raised|lowered) (.+?)'s Speed!$/);
var regex_tothroatspray = new RegExp(/^The Throat Spray (sharply raised|raised|lowered) the opposing (.+?)'s Sp. Atk!$/);
var regex_throatspray = new RegExp(/^The Throat Spray (sharply raised|raised|lowered) (.+?)'s Sp. Atk!$/);
var regex_tosafety_goggles = new RegExp(/^The opposing (.+?) is not affected by ([A-z0-9,'.() -]+?) thanks to its Safety Goggles!$/);
var regex_safety_goggles = new RegExp(/^(.+?) is not affected by ([A-z0-9,'.() -]+?) thanks to its Safety Goggles!$/);
var regex_tostruggle = new RegExp(/^The opposing (.+?) has no moves left!$/);
var regex_struggle = new RegExp(/^(.+?) has no moves left!$/);
var regex_totohelpinghand = new RegExp(/^The opposing (.+?) is ready to help the opposing (.+?)!$/);
var regex_tohelpinghand2 = new RegExp(/^The opposing (.+?) is ready to help (.+?)!$/);
var regex_tohelpinghand = new RegExp(/^(.+?) is ready to help the opposing (.+?)!$/);
var regex_helpinghand = new RegExp(/^(.+?) is ready to help (.+?)!$/);
var regex_toclearsmog = new RegExp(/^The opposing (.+?)'s stat changes were removed!$/);
var regex_clearsmog = new RegExp(/^(.+?)'s stat changes were removed!$/);
var regex_toharvest = new RegExp(/^The opposing (.+?) harvested one ([A-z0-9,'.() -]+?)!$/);
var regex_harvest = new RegExp(/^(.+?) harvested one ([A-z0-9,'.() -]+?)!$/);
var regex_toallyswitch = new RegExp(/^The opposing (.+?) and the opposing (.+?) switched places!$/);
var regex_allyswitch = new RegExp(/^(.+?) and (.+?) switched places!$/);
var regex_toattract = new RegExp(/^The opposing (.+?) is in love with (.+?)!$/);
var regex_attract = new RegExp(/^(.+?) is in love with the opposing (.+?)!$/);
var regex_torecycle = new RegExp(/^The opposing (.+?) found one ([A-z0-9,'.() -]+?)!$/);
var regex_recycle = new RegExp(/^(.+?) found one ([A-z0-9,'.() -]+?)!$/);
var regex_tofling = new RegExp(/^The opposing (.+?) flung its ([A-z0-9,'.() -]+?)!$/);
var regex_fling = new RegExp(/^(.+?) flung its ([A-z0-9,'.() -]+?)!$/);
var regex_toobtained = new RegExp(/^The opposing (.+?) obtained one ([A-z0-9,'.() -]+?).$/);
var regex_obtained = new RegExp(/^(.+?) obtained one ([A-z0-9,'.() -]+?).$/);
var regex_totolockon = new RegExp(/^The opposing (.+?) took aim at the opposing (.+?)!$/);
var regex_tolockon2 = new RegExp(/^The opposing (.+?) took aim at (.+?)!$/);
var regex_tolockon = new RegExp(/^(.+?) took aim at the opposing (.+?)!$/);
var regex_lockon = new RegExp(/^(.+?) took aim at (.+?)!$/);
var regex_topoison = new RegExp(/^The opposing (.+?) was hurt by poison!$/);
var regex_poison = new RegExp(/^(.+?) was hurt by poison!$/);
var regex_toelectromorphosis = new RegExp(/^Being hit by ([A-z0-9,'.() -]+?) charged the opposing (.+?) with power!$/);
var regex_electromorphosis = new RegExp(/^Being hit by ([A-z0-9,'.() -]+?) charged (.+?) with power!$/);
var regex_torequestpending = new RegExp(/^You have (.+?) pending friend requests.$/);
var regex_requestpending = new RegExp(/^You have (.+?) friend request pending.$/);
var regex_blockchallenges = new RegExp(/^The user '(.+?)' is not accepting challenges right now.$/);
var regex_friendrequest = new RegExp(/^You have already sent a friend request to '(.+?)'.$/);
var regex_friendrequest2 = new RegExp(/^You sent a friend request to (.+?)!$/);
var regex_friendrequest3 = new RegExp(/^You sent a friend request to '(.+?)'.$/);
var regex_acceptfriendrequest = new RegExp(/^You accepted a friend request from "(.+?)".$/);
var regex_denyfriendrequest = new RegExp(/^You denied a friend request from '(.+?)'.$/);
var regex_removed = new RegExp(/^Removed friend '(.+?)'.$/);
var regex_removed2 = new RegExp(/^You do not have (.+?) friended.$/);
var regex_removed3 = new RegExp(/^You removed your friend request to '(.+?)'$/);
var regex_donothavefriendrequest = new RegExp(/^You do not have a friend request pending from '(.+?)'.$/);
var regex_donothavefriendrequest2 = new RegExp(/^You have no request pending from (.+?).$/);
var regex_accuracy = new RegExp(/^Accuracy: (.+?)$/);
var regex_basepower_double2 = new RegExp(/^Base power vs ([A-z0-9,'.() -]+?): (\d{1,3}) to (\d{1,3})$/);
var regex_basepower_double = new RegExp(/^Base power vs ([A-z0-9,'.() -]+?): (.+?)$/);
var regex_basepower2 = new RegExp(/^Base power: (\d{1,3}) to (\d{1,3})$/);
var regex_basepower = new RegExp(/^Base power: (.+?)$/);
var regex_disconnected = new RegExp(/^(.+?) disconnected and has (.+?) seconds to reconnect!$/);
var regex_disconnected2 = new RegExp(/^(.+?) disconnected and has a minute to reconnect!$/);
var regex_disconnected3 = new RegExp(/^(.+?) disconnected!$/);
var regex_reconnected = new RegExp(/^(.+?) reconnected and has (.+?) seconds left.$/);
var regex_usemove3 = new RegExp(/^([A-z0-9,'.()% -]+?) will use ([A-z0-9,'.() -]+?) at your ([A-z0-9,'.()% -]+?).$/);
var regex_usemove2 = new RegExp(/^([A-z0-9,'.()% -]+?) will use ([A-z0-9,'.() -]+?) at ([A-z0-9,'.()% -]+?).$/);
var regex_usemove = new RegExp(/^([A-z0-9,'.()% -]+?) will use ([A-z0-9,'.() -]+?).$/);
var regex_reconnecte = new RegExp(/^(.+?) has (.+?) seconds to reconnect!$/);
var regex_toskyattack = new RegExp(/^The opposing (.+?) became cloaked in a harsh light!$/);
var regex_skyattack = new RegExp(/^(.+?) became cloaked in a harsh light!$/);
var regex_todisable = new RegExp(/^The opposing (.+?)'s ([A-z0-9,'.() -]+?) is disabled!$/);
var regex_disable = new RegExp(/^(.+?)'s ([A-z0-9,'.() -]+?) is disabled!$/);
var regex_todisable2 = new RegExp(/^The opposing (.+?)'s ([A-z0-9,'.() -]+?) was disabled!$/);
var regex_disable2 = new RegExp(/^(.+?)'s ([A-z0-9,'.() -]+?) was disabled!$/);
var regex_last10team = new RegExp(/^(.+?)'s last 10 teams$/);
var regex_uploadedon = new RegExp(/^Uploaded on: (.+?)$/);
var regex_format = new RegExp(/^Format: (.+?)$/);
var regex_views = new RegExp(/^Views: (.+?)$/);
var regex_teampassword = new RegExp(/^Team set to private. Password: (.+?)$/);
var regex_toskydrop = new RegExp(/^The opposing (.+?) took (.+?) into the sky!$/);
var regex_skydrop = new RegExp(/^(.+?) took the opposing (.+?) into the sky!$/);
var regex_inactivity = new RegExp(/^(.+?) lost due to inactivity.$/);
var regex_deleted = new RegExp(/^(.+?) deleted.$/);
var regex_nextdamage = new RegExp(/^ Next damage: ([0-9% .]+?)$/);
var regex_item_was_held_up = new RegExp(/^ ([A-z0-9,'.() -]+?) \((stolen|tricked|disturbed|frisked|found|harvested); Red Card was held up\)$/);
var regex_item_was_popped = new RegExp(/^ ([A-z0-9,'.() -]+?) \((stolen|tricked|disturbed|frisked|found|harvested); Air Balloon was popped\)$/);
var regex_item_was_eaten = new RegExp(/^ ([A-z0-9,'.() -]+?) \((stolen|tricked|disturbed|frisked|found|harvested); ([A-z0-9,'.() -]+?) was eaten\)$/);
var regex_item_was_consumed = new RegExp(/^ ([A-z0-9,'.() -]+?) \((stolen|tricked|disturbed|frisked|found|harvested); ([A-z0-9,'.() -]+?) was consumed\)$/);
var regex_item_was_flung = new RegExp(/^ ([A-z0-9,'.() -]+?) \((stolen|tricked|disturbed|frisked|found|harvested); ([A-z0-9,'.() -]+?) was flung\)$/);
var regex_item_was_stolen = new RegExp(/^ ([A-z0-9,'.() -]+?) \((stolen|tricked|disturbed|frisked|found|harvested); ([A-z0-9,'.() -]+?) was stolen\)$/);
var regex_item_was_knockedoff = new RegExp(/^ ([A-z0-9,'.() -]+?) \((stolen|tricked|disturbed|frisked|found|harvested); ([A-z0-9,'.() -]+?) was knocked off\)$/);
var regex_item_was_was = new RegExp(/^ ([A-z0-9,'.() -]+?) \((stolen|tricked|disturbed|frisked|found|harvested); was ([A-z0-9,'.() -]+?)\)$/);
var regex_item_held_up = new RegExp(/^ ([A-z0-9,'.() -]+?) \(Red Card was held up\)$/);
var regex_item_popped = new RegExp(/^ ([A-z0-9,'.() -]+?) \(Air Balloon was popped\)$/);
var regex_item_eaten = new RegExp(/^ ([A-z0-9,'.() -]+?) \(([A-z0-9,'.() -]+?) was eaten\)$/);
var regex_item_consumed = new RegExp(/^ ([A-z0-9,'.() -]+?) \(([A-z0-9,'.() -]+?) was consumed\)$/);
var regex_item_knockedoff = new RegExp(/^ ([A-z0-9,'.() -]+?) \(([A-z0-9,'.() -]+?) was knocked off\)$/);
var regex_item_stolen = new RegExp(/^ ([A-z0-9,'.() -]+?) \(stolen\)$/);
var regex_item_found = new RegExp(/^ ([A-z0-9,'.() -]+?) \(found\)$/);
var regex_item_harvested = new RegExp(/^ ([A-z0-9,'.() -]+?) \(harvested\)$/);
var regex_item_tricked = new RegExp(/^ ([A-z0-9,'.() -]+?) \(tricked\)$/);
var regex_item_disturbed = new RegExp(/^ ([A-z0-9,'.() -]+?) \(disturbed\)$/);
var regex_item_frisked = new RegExp(/^ ([A-z0-9,'.() -]+?) \(frisked\)$/);
var regex_item_flung = new RegExp(/^ ([A-z0-9,'.() -]+?) \(([A-z0-9,'.() -]+?) was flung\)$/);
var regex_item_stolen2 = new RegExp(/^ ([A-z0-9,'.() -]+?) \(([A-z0-9,'.() -]+?) was stolen\)$/);
var regex_item_incinerated = new RegExp(/^ ([A-z0-9,'.() -]+?) \(([A-z0-9,'.() -]+?) was incinerated\)$/);
var regex_base = new RegExp(/^ ([A-z0-9,'.() -]+?) \(base: ([A-z0-9,'.() -]+?)\)$/);
var regex_toonly = new RegExp(/^But the opposing (.+?) can't use the move!$/);
var regex_only = new RegExp(/^But (.+?) can't use the move!$/);
var regex_terastallize_use_double_your = new RegExp(/^([A-z0-9,'.() -]+?) will Terastallize, then use ([A-z0-9,'.() -]+?) at your ([A-z0-9,'.() -]+?).$/);
var regex_dynamax_use_double_your = new RegExp(/^([A-z0-9,'.() -]+?) will Dynamax, then use ([A-z0-9,'.() -]+?) at your ([A-z0-9,'.() -]+?).$/);
var regex_megaevolve_use_double_your = new RegExp(/^([A-z0-9,'.() -]+?) will Mega Evolve, then use ([A-z0-9,'.() -]+?) at your ([A-z0-9,'.() -]+?).$/);
var regex_terastallize_use_double = new RegExp(/^([A-z0-9,'.() -]+?) will Terastallize, then use ([A-z0-9,'.() -]+?) at ([A-z0-9,'.() -]+?).$/);
var regex_dynamax_use_double = new RegExp(/^([A-z0-9,'.() -]+?) will Dynamax, then use ([A-z0-9,'.() -]+?) at ([A-z0-9,'.() -]+?).$/);
var regex_megaevolve_use_double = new RegExp(/^([A-z0-9,'.() -]+?) will Mega Evolve, then use ([A-z0-9,'.() -]+?) at ([A-z0-9,'.() -]+?).$/);
var regex_terastallize_use = new RegExp(/^([A-z0-9,'.() -]+?) will Terastallize, then use ([A-z0-9,'.() -]+?).$/);
var regex_dynamax_use = new RegExp(/^([A-z0-9,'.() -]+?) will Dynamax, then use ([A-z0-9,'.() -]+?).$/);
var regex_megaevolve_use = new RegExp(/^([A-z0-9,'.() -]+?) will Mega Evolve, then use ([A-z0-9,'.() -]+?).$/);
var regex_tonatural_cure = new RegExp(/^\(The opposing (.+?) is cured by its Natural Cure!\)$/);
var regex_natural_cure = new RegExp(/^\((.+?) is cured by its Natural Cure!\)$/);
var regex_toacquired = new RegExp(/^The opposing (.+?) acquired ([A-z0-9,'.() -]+?)!$/);
var regex_acquired = new RegExp(/^(.+?) acquired ([A-z0-9,'.() -]+?)!$/);
var regex_namestarting = new RegExp(/^This battle is required to be public due to a player having a name starting with '(.+?)'.$/);
var regex_toComplete_Forme = new RegExp(/^The opposing (.+?) transformed into its Complete Forme!$/);
var regex_Complete_Forme = new RegExp(/^(.+?) transformed into its Complete Forme!$/);
var regex_totransformed_into = new RegExp(/^The opposing (.+?) transformed into (.+?)!$/);
var regex_transformed_into = new RegExp(/^(.+?) transformed into (.+?)!$/);
var regex_wouldtake = new RegExp(/^Would take if ability removed: ([0-9% .]+?)$/);
var regex_totofollwed = new RegExp(/^The opposing (.+?) followed the opposing (.+?)'s instructions!$/);
var regex_tofollwed2 = new RegExp(/^The opposing (.+?) followed (.+?)'s instructions!$/);
var regex_tofollwed = new RegExp(/^(.+?) followed the opposing (.+?)'s instructions!$/);
var regex_follwed = new RegExp(/^(.+?) followed (.+?)'s instructions!$/);
var regex_suspect = new RegExp(/^(.+?) is currently suspecting ([A-z0-9,'.() -]+?)! For information on how to participate check out the $/);
var regex_changed = new RegExp(/^\(Changed forme: ([A-z0-9,'.() -]+?)\)$/);
var regex_turnsasleep = new RegExp(/^ Turns asleep: (.+?)$/);
var regex_switchto = new RegExp(/^Switch ([A-z0-9,'.() -]+?) to$/);
var regex_online = new RegExp(/^Online (.+?)$/);
var regex_offline = new RegExp(/^Offline (.+?)$/);
var regex_toterastallized = new RegExp(/^The opposing (.+?) has Terastallized into the ([A-z -]+?)\-type!$/);
var regex_terastallized = new RegExp(/^(.+?) has Terastallized into the ([A-z0-9,'.() -]+?)\-type!$/);
var regex_topressure = new RegExp(/^The opposing (.+?) is exerting its pressure!$/);
var regex_pressure = new RegExp(/^(.+?) is exerting its pressure!$/);
var regex_toseeded = new RegExp(/^The opposing (.+?) was seeded!$/);
var regex_seeded = new RegExp(/^(.+?) was seeded!$/);
var regex_topoisoned = new RegExp(/^The opposing (.+?) was (poisoned|badly poisoned)!$/);
var regex_poisoned = new RegExp(/^(.+?) was (poisoned|badly poisoned)!$/);
var regex_toslept = new RegExp(/^The opposing (.+?) slept and became healthy!$/);
var regex_slept = new RegExp(/^(.+?) slept and became healthy!$/);
var regex_toasleep = new RegExp(/^The opposing (.+?) is fast asleep.$/);
var regex_asleep = new RegExp(/^(.+?) is fast asleep.$/);
var regex_towoke_up = new RegExp(/^The opposing (.+?) woke up!$/);
var regex_woke_up = new RegExp(/^(.+?) woke up!$/);
var regex_toz_power = new RegExp(/^The opposing (.+?) surrounded itself with its Z-Power!$/);
var regex_z_power = new RegExp(/^(.+?) surrounded itself with its Z-Power!$/);
var regex_toz_move = new RegExp(/^The opposing (.+?) unleashes its full-force Z-Move!$/);
var regex_z_move = new RegExp(/^(.+?) unleashes its full-force Z-Move!$/);
var regex_toleech_seed = new RegExp(/^The opposing (.+?)'s health is sapped by Leech Seed!$/);
var regex_leech_seed = new RegExp(/^(.+?)'s health is sapped by Leech Seed!$/);
var regex_toradiating_aura = new RegExp(/^The opposing (.+?) is radiating a (dark|fairy) aura!$/);
var regex_radiating_aura = new RegExp(/^(.+?) is radiating a (dark|fairy) aura!$/);
var regex_toradiating_aura2 = new RegExp(/^The opposing (.+?) is radiating a (bursting|blazing) aura!$/);
var regex_radiating_aura2 = new RegExp(/^(.+?) is radiating a (bursting|blazing) aura!$/);
var regex_toprotected = new RegExp(/^The opposing (.+?) protected itself!$/);
var regex_protected = new RegExp(/^(.+?) protected itself!$/);
var regex_totaunt = new RegExp(/^The opposing (.+?) fell for the taunt!$/);
var regex_taunt = new RegExp(/^(.+?) fell for the taunt!$/);
var regex_topumped = new RegExp(/^The opposing (.+?) is getting pumped!$/);
var regex_pumped = new RegExp(/^(.+?) is getting pumped!$/);
var regex_toavoided = new RegExp(/^The opposing (.+?) avoided the attack!$/);
var regex_avoided = new RegExp(/^(.+?) avoided the attack!$/);
var regex_togrew_drowsy = new RegExp(/^The opposing (.+?) grew drowsy!$/);
var regex_grew_drowsy = new RegExp(/^(.+?) grew drowsy!$/);
var regex_tofell_straight_down = new RegExp(/^The opposing (.+?) fell straight down!$/);
var regex_fell_straight_down = new RegExp(/^(.+?) fell straight down!$/);
var regex_tomust_encore = new RegExp(/^The opposing (.+?) must do an encore!$/);
var regex_must_encore = new RegExp(/^(.+?) must do an encore!$/);
var regex_toencore_ended = new RegExp(/^The opposing (.+?)'s encore ended!$/);
var regex_encore_ended = new RegExp(/^(.+?)'s encore ended!$/);
var regex_toshook_off_taunt = new RegExp(/^The opposing (.+?) shook off the taunt!$/);
var regex_shook_off_taunt = new RegExp(/^(.+?) shook off the taunt!$/);
var regex_tovortex_fieryvortex = new RegExp(/^The opposing (.+?) became trapped in the (vortex|fiery vortex)!$/);
var regex_vortex_fieryvortex = new RegExp(/^(.+?) became trapped in the (vortex|fiery vortex)!$/);
var regex_toburned_frozen = new RegExp(/^The opposing (.+?) was (burned|frozen solid)!$/);
var regex_burned_frozen = new RegExp(/^(.+?) was (burned|frozen solid)!$/);
var regex_tospikes = new RegExp(/^The opposing (.+?) was hurt by the spikes!$/);
var regex_spikes = new RegExp(/^(.+?) was hurt by the spikes!$/);
var regex_tocuredof_freeze_burn = new RegExp(/^The opposing (.+?) was cured of (Freeze|Burn)!$/);
var regex_curedof_freeze_burn = new RegExp(/^(.+?) was cured of (Freeze|Burn)!$/);
var regex_tocuredof_sleep_paralysis = new RegExp(/^The opposing (.+?) was cured of (Sleep|paralysis)!$/);
var regex_curedof_sleep_paralysis = new RegExp(/^(.+?) was cured of (Sleep|paralysis)!$/);
var regex_toput_in_substitute = new RegExp(/^The opposing (.+?) put in a substitute!$/);
var regex_put_in_substitute = new RegExp(/^(.+?) put in a substitute!$/);
var regex_tohp_restored = new RegExp(/^The opposing (.+?) had its HP restored.$/);
var regex_hp_restored = new RegExp(/^(.+?) had its HP restored.$/);
var regex_tohp_restored2 = new RegExp(/^The opposing (.+?)'s HP was restored.$/);
var regex_hp_restored2 = new RegExp(/^(.+?)'s HP was restored.$/);
var regex_tohp_restored3 = new RegExp(/^The opposing (.+?)'s HP was restored by the Z-Power!$/);
var regex_hp_restored3 = new RegExp(/^(.+?)'s HP was restored by the Z-Power!$/);
var regex_totransformed = new RegExp(/^The opposing (.+?) transformed!$/);
var regex_transformed = new RegExp(/^(.+?) transformed!$/);
var regex_toconfused2 = new RegExp(/^The opposing (.+?) is confused!$/);
var regex_confused2 = new RegExp(/^(.+?) is confused!$/);
var regex_toconfused = new RegExp(/^The opposing (.+?) became confused!$/);
var regex_confused = new RegExp(/^(.+?) became confused!$/);
var regex_tofell_asleep = new RegExp(/^The opposing (.+?) fell asleep!$/);
var regex_fell_asleep = new RegExp(/^(.+?) fell asleep!$/);
var regex_tocanno_longer_escape = new RegExp(/^The opposing (.+?) can no longer escape!$/);
var regex_canno_longer_escape = new RegExp(/^(.+?) can no longer escape!$/);
var regex_tomist_safeguard = new RegExp(/^The opposing (.+?) is protected by (the mist|Safeguard)!$/);
var regex_mist_safeguard = new RegExp(/^(.+?) is protected by (the mist|Safeguard)!$/);
var regex_toprotosynthesis_quarkdrive = new RegExp(/^The opposing (.+?) used its Booster Energy to activate (Protosynthesis|its Quark Drive)!$/);
var regex_protosynthesis_quarkdrive = new RegExp(/^(.+?) used its Booster Energy to activate (Protosynthesis|its Quark Drive)!$/);
var regex_toair_light = new RegExp(/^The opposing (.+?) became cloaked in (freezing air|a freezing light)!$/);
var regex_air_light = new RegExp(/^(.+?) became cloaked in (freezing air|a freezing light)!$/);
var regex_todryskin_solarpower = new RegExp(/^The opposing (.+?) was hurt by its (Dry Skin|Solar Power).$/);
var regex_dryskin_solarpower = new RegExp(/^(.+?) was hurt by its (Dry Skin|Solar Power).$/);
var regex_todrowsing = new RegExp(/^The opposing (.+?) is drowsing!$/);
var regex_drowsing = new RegExp(/^(.+?) is drowsing!$/);
var regex_tobreaks_mold = new RegExp(/^The opposing (.+?) breaks the mold!$/);
var regex_breaks_mold = new RegExp(/^(.+?) breaks the mold!$/);
var regex_toendured_hit = new RegExp(/^The opposing (.+?) is endured the hit!$/);
var regex_endured_hit = new RegExp(/^(.+?) is endured the hit!$/);
var regex_toendured_hit2 = new RegExp(/^The opposing (.+?) endured the hit!$/);
var regex_endured_hit2 = new RegExp(/^(.+?) endured the hit!$/);
var regex_toburned_itself = new RegExp(/^The opposing (.+?) burned itself out!$/);
var regex_burned_itself = new RegExp(/^(.+?) burned itself out!$/);
var regex_toair_balloon = new RegExp(/^The opposing (.+?) floats in the air with its Air Balloon!$/);
var regex_air_balloon = new RegExp(/^(.+?) floats in the air with its Air Balloon!$/);
var regex_toalready_confused = new RegExp(/^The opposing (.+?) is already confused!$/);
var regex_already_confused = new RegExp(/^(.+?) is already confused!$/);
var regex_toswirling_magma = new RegExp(/^The opposing (.+?) became trapped by swirling magma!$/);
var regex_swirling_magma = new RegExp(/^(.+?) became trapped by swirling magma!$/);
var regex_toquicksand = new RegExp(/^The opposing (.+?) became trapped by the quicksand!$/);
var regex_quicksand = new RegExp(/^(.+?) became trapped by the quicksand!$/);
var regex_toconfused_fatigue = new RegExp(/^The opposing (.+?) became confused due to fatigue!$/);
var regex_confused_fatigue = new RegExp(/^(.+?) became confused due to fatigue!$/);
var regex_tobecame_confused = new RegExp(/^The opposing (.+?) became confused!$/);
var regex_became_confused = new RegExp(/^(.+?) became confused!$/);
var regex_toprevented_healing = new RegExp(/^The opposing (.+?) was prevented from healing!$/);
var regex_prevented_healing = new RegExp(/^(.+?) was prevented from healing!$/);
var regex_toquick_draw = new RegExp(/^Quick Draw made the opposing (.+?) move faster!$/);
var regex_quick_draw = new RegExp(/^Quick Draw made (.+?) move faster!$/);
var regex_tosalt_cured = new RegExp(/^The opposing (.+?) is being salt cured!$/);
var regex_salt_cured = new RegExp(/^(.+?) is being salt cured!$/);
var regex_tobeing_withdrawn = new RegExp(/^\(The opposing (.+?) is being withdrawn...\)$/);
var regex_being_withdrawn = new RegExp(/^\((.+?) is being withdrawn...\)$/);
var regex_toeject_pack = new RegExp(/^The opposing (.+?) is switched out by the Eject Pack!$/);
var regex_eject_pack = new RegExp(/^(.+?) is switched out by the Eject Pack!$/);
var regex_toeject_button = new RegExp(/^The opposing (.+?) is switched out with the Eject Button!$/);
var regex_eject_button = new RegExp(/^(.+?) is switched out with the Eject Button!$/);
var regex_topower_herb = new RegExp(/^The opposing (.+?) became fully charged due to its Power Herb!$/);
var regex_power_herb = new RegExp(/^(.+?) became fully charged due to its Power Herb!$/);
var regex_towhite_herb = new RegExp(/^The opposing (.+?) returned its status to normal using its White Herb!$/);
var regex_white_herb = new RegExp(/^(.+?) returned its status to normal using its White Herb!$/);
var regex_tofocussash_focusband = new RegExp(/^The opposing (.+?) hung on using its (Focus Sash|Focus Band)!$/);
var regex_focussash_focusband = new RegExp(/^(.+?) hung on using its (Focus Sash|Focus Band)!$/);
var regex_toair_balloon_popped = new RegExp(/^The opposing (.+?)'s Air Balloon popped!$/);
var regex_air_balloon_popped = new RegExp(/^(.+?)'s Air Balloon popped!$/);
var regex_toshell_gleam = new RegExp(/^The opposing (.+?) made its shell gleam! It's distorting type matchups!$/);
var regex_shell_gleam = new RegExp(/^(.+?) made its shell gleam! It's distorting type matchups!$/);
var regex_toquick_claw = new RegExp(/^The opposing (.+?) can act faster than normal, thanks to its Quick Claw!$/);
var regex_quick_claw = new RegExp(/^(.+?) can act faster than normal, thanks to its Quick Claw!$/);
var regex_tosupreme_overlord = new RegExp(/^The opposing (.+?) gained strength from the fallen!$/);
var regex_supreme_overlord = new RegExp(/^(.+?) gained strength from the fallen!$/);
var regex_toabsorbed_light = new RegExp(/^The opposing (.+?) absorbed light!$/);
var regex_absorbed_light = new RegExp(/^(.+?) absorbed light!$/);
var regex_toalready_burned = new RegExp(/^The opposing (.+?) is already burned!$/);
var regex_already_burned = new RegExp(/^(.+?) is already burned!$/);
var regex_tosticky_candy_syrup = new RegExp(/^The opposing (.+?) got covered in sticky candy syrup!$/);
var regex_sticky_candy_syrup = new RegExp(/^(.+?) got covered in sticky candy syrup!$/);
var regex_togoing_all = new RegExp(/^The opposing (.+?) is going all out for this attack!$/);
var regex_going_all = new RegExp(/^(.+?) is going all out for this attack!$/);
var regex_tocreate_decoy = new RegExp(/^The opposing (.+?) shed its tail to create a decoy!$/);
var regex_create_decoy = new RegExp(/^(.+?) shed its tail to create a decoy!$/);
var regex_tocut_hp2 = new RegExp(/^\(The opposing (.+?) cut its own HP to power up its move!\)$/);
var regex_cut_hp2 = new RegExp(/^\((.+?) cut its own HP to power up its move!\)$/);
var regex_tocut_hp = new RegExp(/^The opposing (.+?) cut its own HP to power up its move!$/);
var regex_cut_hp = new RegExp(/^(.+?) cut its own HP to power up its move!$/);
var regex_toloses_flying2 = new RegExp(/^\(The opposing (.+?) loses Flying type this turn.\)$/);
var regex_loses_flying2 = new RegExp(/^\((.+?) loses Flying type this turn.\)$/);
var regex_toloses_flying = new RegExp(/^The opposing (.+?) loses Flying type this turn.$/);
var regex_loses_flying = new RegExp(/^(.+?) loses Flying type this turn.$/);
var regex_toreceived_encore = new RegExp(/^The opposing (.+?) received an encore!$/);
var regex_received_encore = new RegExp(/^(.+?) received an encore!$/);
var regex_totoxic_orb = new RegExp(/^The opposing (.+?) was badly poisoned by the Toxic Orb!$/);
var regex_toxic_orb = new RegExp(/^(.+?) was badly poisoned by the Toxic Orb!$/);
var regex_tosticky_web = new RegExp(/^The opposing (.+?) was caught in a sticky web!$/);
var regex_sticky_web = new RegExp(/^(.+?) was caught in a sticky web!$/);
var regex_tonot_lowered2 = new RegExp(/^The opposing (.+?)'s stats were not lowered!$/);
var regex_not_lowered2 = new RegExp(/^(.+?)'s stats were not lowered!$/);
var regex_tocant_use_item = new RegExp(/^The opposing (.+?) can't use items anymore!$/);
var regex_cant_use_item = new RegExp(/^(.+?) can't use items anymore!$/);
var regex_toheal_block_off = new RegExp(/^The opposing (.+?)'s Heal Block wore off!$/);
var regex_heal_block_off = new RegExp(/^(.+?)'s Heal Block wore off!$/);
var regex_torestored_littlehp_using = new RegExp(/^The opposing (.+?) restored a little HP using its (Leftovers|Shell Bell|Black Sludge)!$/);
var regex_restored_littlehp_using = new RegExp(/^(.+?) restored a little HP using its (Leftovers|Shell Bell|Black Sludge)!$/);
var regex_toparalyzed_cant_move = new RegExp(/^The opposing (.+?) is paralyzed! It can't move!$/);
var regex_paralyzed_cant_move = new RegExp(/^(.+?) is paralyzed! It can't move!$/);
var regex_toparalyzed_maybe_unable_move = new RegExp(/^The opposing (.+?) is paralyzed! It may be unable to move!$/);
var regex_paralyzed_maybe_unable_move = new RegExp(/^(.+?) is paralyzed! It may be unable to move!$/);
var regex_tosealed_moves = new RegExp(/^The opposing (.+?) sealed any moves its target shares with it!$/);
var regex_sealed_moves = new RegExp(/^(.+?) sealed any moves its target shares with it!$/);
var regex_tochose_doom = new RegExp(/^The opposing (.+?) chose Doom Desire as its destiny!$/);
var regex_chose_doom = new RegExp(/^(.+?) chose Doom Desire as its destiny!$/);
var regex_toelectromagnetism = new RegExp(/^The opposing (.+?) levitated with electromagnetism!$/);
var regex_electromagnetism = new RegExp(/^(.+?) levitated with electromagnetism!$/);
var regex_tostockpiled_off = new RegExp(/^The opposing (.+?)'s stockpiled effect wore off!$/);
var regex_stockpiled_off = new RegExp(/^(.+?)'s stockpiled effect wore off!$/);
var regex_toillusion_off = new RegExp(/^The opposing (.+?)'s illusion wore off!$/);
var regex_illusion_off = new RegExp(/^(.+?)'s illusion wore off!$/);
var regex_tosnapped_confusion = new RegExp(/^The opposing (.+?) snapped it out of its confusion!$/);
var regex_snapped_confusion = new RegExp(/^(.+?) snapped it out of its confusion!$/);
var regex_tosnapped_confusion2 = new RegExp(/^The opposing (.+?) snapped out of its confusion!$/);
var regex_snapped_confusion2 = new RegExp(/^(.+?) snapped out of its confusion!$/);
var regex_tosnapped_confusion3 = new RegExp(/^The opposing (.+?) snapped out of confusion!$/);
var regex_snapped_confusion3 = new RegExp(/^(.+?) snapped out of confusion!$/);
var regex_tofuturistic_engine = new RegExp(/^The opposing (.+?) turned the ground into Electric Terrain, energizing its futuristic engine!$/);
var regex_futuristic_engine = new RegExp(/^(.+?) turned the ground into Electric Terrain, energizing its futuristic engine!$/);
var regex_tofuturistic_engine2 = new RegExp(/^The opposing (.+?) used the Electric Terrain to energize its futuristic engine!$/);
var regex_futuristic_engine2 = new RegExp(/^(.+?) used the Electric Terrain to energize its futuristic engine!$/);
var regex_toancient_pulse = new RegExp(/^The opposing (.+?) turned the sunlight harsh, sending its ancient pulse into a frenzy!$/);
var regex_ancient_pulse = new RegExp(/^(.+?) turned the sunlight harsh, sending its ancient pulse into a frenzy!$/);
var regex_toancient_pulse2 = new RegExp(/^The opposing (.+?) basked in the sunlight, sending its ancient pulse into a frenzy!$/);
var regex_ancient_pulse2 = new RegExp(/^(.+?) basked in the sunlight, sending its ancient pulse into a frenzy!$/);
var regex_toflinched = new RegExp(/^The opposing (.+?) flinched and couldn't move!$/);
var regex_flinched = new RegExp(/^(.+?) flinched and couldn't move!$/);
var regex_tolost_somehp = new RegExp(/^The opposing (.+?) lost some of its HP!$/);
var regex_lost_somehp = new RegExp(/^(.+?) lost some of its HP!$/);
var regex_todamaged_recoil = new RegExp(/^The opposing (.+?) is damaged by the recoil!$/);
var regex_damaged_recoil = new RegExp(/^(.+?) is damaged by the recoil!$/);
var regex_tobuffeted_sandstorm_hail = new RegExp(/^The opposing (.+?) is buffeted by the (sandstorm|hail)!$/);
var regex_buffeted_sandstorm_hail = new RegExp(/^(.+?) is buffeted by the (sandstorm|hail)!$/);
var regex_totormented = new RegExp(/^The opposing (.+?) is tormented!$/);
var regex_tormented = new RegExp(/^(.+?) is tormented!$/);
var regex_toafflicted_by_curse = new RegExp(/^The opposing (.+?) is afflicted by the curse!$/);
var regex_afflicted_by_curse = new RegExp(/^(.+?) is afflicted by the curse!$/);
var regex_tolocked_in_nightmare = new RegExp(/^The opposing (.+?) is locked in a nightmare!$/);
var regex_locked_in_nightmare = new RegExp(/^(.+?) is locked in a nightmare!$/);
var regex_todemaged_by_recoil = new RegExp(/^The opposing (.+?) was damaged by the recoil!$/);
var regex_demaged_by_recoil = new RegExp(/^(.+?) was damaged by the recoil!$/);
var regex_tomystical_moonlight = new RegExp(/^The opposing (.+?) became cloaked in mystical moonlight!$/);
var regex_mystical_moonlight = new RegExp(/^(.+?) became cloaked in mystical moonlight!$/);
var regex_towas_hurt2 = new RegExp(/^\(The opposing (.+?) was hurt!\)$/);
var regex_was_hurt2 = new RegExp(/^\((.+?) was hurt!\)$/);
var regex_towas_hurt = new RegExp(/^The opposing (.+?) was hurt!$/);
var regex_was_hurt = new RegExp(/^(.+?) was hurt!$/);
var regex_tofrozen_solid = new RegExp(/^The opposing (.+?) is frozen solid!$/);
var regex_frozen_solid = new RegExp(/^(.+?) is frozen solid!$/);
var regex_totwisted_dimensions = new RegExp(/^The opposing (.+?) twisted the dimensions!$/);
var regex_twisted_dimensions = new RegExp(/^(.+?) twisted the dimensions!$/);
var regex_toability_suppressed = new RegExp(/^The opposing (.+?)'s Ability was suppressed!$/);
var regex_ability_suppressed = new RegExp(/^(.+?)'s Ability was suppressed!$/);
var regex_towas_cured_poisoning = new RegExp(/^The opposing (.+?) was cured of its poisoning!$/);
var regex_was_cured_poisoning = new RegExp(/^(.+?) was cured of its poisoning!$/);
var regex_tousedupall_electricity = new RegExp(/^The opposing (.+?) used up all of its electricity!$/);
var regex_usedupall_electricity = new RegExp(/^(.+?) used up all of its electricity!$/);
var regex_tono_retreat = new RegExp(/^The opposing (.+?) can no longer escape because it used No Retreat!$/);
var regex_no_retreat = new RegExp(/^(.+?) can no longer escape because it used No Retreat!$/);
var regex_dragged_out = new RegExp(/^(.+?) was dragged out!$/);
var regex_toenergy_drained = new RegExp(/^The opposing (.+?) had its energy drained!$/);
var regex_energy_drained = new RegExp(/^(.+?) had its energy drained!$/);
var regex_toabsorbs_attack = new RegExp(/^The opposing (.+?) absorbs the attack!$/);
var regex_absorbs_attack = new RegExp(/^(.+?) absorbs the attack!$/);
var regex_totook_attack = new RegExp(/^The opposing (.+?) took the attack!$/);
var regex_took_attack = new RegExp(/^(.+?) took the attack!$/);
var regex_tie = new RegExp(/^Tie between (.+?) and (.+?)!$/);
var regex_tounder_ground = new RegExp(/^The opposing (.+?) burrowed its way under the ground!$/);
var regex_under_ground = new RegExp(/^(.+?) burrowed its way under the ground!$/);
var regex_toflew_high = new RegExp(/^The opposing (.+?) flew up high!$/);
var regex_flew_high = new RegExp(/^(.+?) flew up high!$/);
var regex_tohurled_air = new RegExp(/^The opposing (.+?) was hurled into the air!$/);
var regex_hurled_air = new RegExp(/^(.+?) was hurled into the air!$/);
var regex_towhippedup_whirlwind = new RegExp(/^The opposing (.+?) whipped up a whirlwind!$/);
var regex_whippedup_whirlwind = new RegExp(/^(.+?) whipped up a whirlwind!$/);
var regex_tohid_underwater = new RegExp(/^The opposing (.+?) hid underwater!$/);
var regex_hid_underwater = new RegExp(/^(.+?) hid underwater!$/);
var regex_tosprang_up = new RegExp(/^The opposing (.+?) sprang up!$/);
var regex_sprang_up = new RegExp(/^(.+?) sprang up!$/);
var regex_toitem_cannot_removed = new RegExp(/^The opposing (.+?)'s item cannot be removed!$/);
var regex_item_cannot_removed = new RegExp(/^(.+?)'s item cannot be removed!$/);
var regex_tomove_nolonger_disabled = new RegExp(/^The opposing (.+?)'s move is no longer disabled!$/);
var regex_move_nolonger_disabled = new RegExp(/^(.+?)'s move is no longer disabled!$/);
var regex_toloafing_around = new RegExp(/^The opposing (.+?) is loafing around!$/);
var regex_loafing_around = new RegExp(/^(.+?) is loafing around!$/);
var regex_tomust_recharge = new RegExp(/^The opposing (.+?) must recharge!$/);
var regex_must_recharge = new RegExp(/^(.+?) must recharge!$/);
var regex_tocured_poisoning = new RegExp(/^The opposing (.+?) as cured of its poisoning.$/);
var regex_cured_poisoning = new RegExp(/^(.+?) as cured of its poisoning.$/);
var regex_toheals_status = new RegExp(/^The opposing (.+?) heals its status!$/);
var regex_heals_status = new RegExp(/^(.+?) heals its status!$/);
var regex_tohealed_burn = new RegExp(/^The opposing (.+?) healed its burn!$/);
var regex_healed_burn = new RegExp(/^(.+?) healed its burn!$/);
var regex_toburn_was_healed = new RegExp(/^The opposing (.+?)'s burn was healed!$/);
var regex_burn_was_healed = new RegExp(/^(.+?)'s burn was healed!$/);
var regex_tocured_its_poison = new RegExp(/^The opposing (.+?) cured its poison!$/);
var regex_cured_its_poison = new RegExp(/^(.+?) cured its poison!$/);
var regex_tocured_its_paralysis = new RegExp(/^The opposing (.+?) cured its paralysis!$/);
var regex_cured_its_paralysis = new RegExp(/^(.+?) cured its paralysis!$/);
var regex_tostatus_cleared = new RegExp(/^The opposing (.+?)'s status cleared!$/);
var regex_status_cleared = new RegExp(/^(.+?)'s status cleared!$/);
var regex_totake_attacker_down = new RegExp(/^The opposing (.+?) is hoping to take its attacker down with it!$/);
var regex_take_attacker_down = new RegExp(/^(.+?) is hoping to take its attacker down with it!$/);
var regex_totook_attacker_down = new RegExp(/^The opposing (.+?) took its attacker down with it!$/);
var regex_took_attacker_down = new RegExp(/^(.+?) took its attacker down with it!$/);
var regex_toplanted_its_roots = new RegExp(/^The opposing (.+?) planted its roots!$/);
var regex_planted_its_roots = new RegExp(/^(.+?) planted its roots!$/);
var regex_toanchored_itself_roots = new RegExp(/^The opposing (.+?) anchored itself with its roots!$/);
var regex_anchored_itself_roots = new RegExp(/^(.+?) anchored itself with its roots!$/);
var regex_tosurrounded_veil_water = new RegExp(/^The opposing (.+?) surrounded itself with a veil of water!$/);
var regex_surrounded_veil_water = new RegExp(/^(.+?) surrounded itself with a veil of water!$/);
var regex_towas_subjected_torment = new RegExp(/^The opposing (.+?) was subjected to torment!$/);
var regex_was_subjected_torment = new RegExp(/^(.+?) was subjected to torment!$/);
var regex_tosupersweet_aroma = new RegExp(/^A supersweet aroma is wafting from the syrup covering the opposing (.+?)!$/);
var regex_supersweet_aroma = new RegExp(/^A supersweet aroma is wafting from the syrup covering (.+?)!$/);
var regex_toreversed_other_auras = new RegExp(/^The opposing (.+?) reversed all other Pokemon's auras!$/);
var regex_reversed_other_auras = new RegExp(/^(.+?) reversed all other Pokemon's auras!$/);
var regex_togot_over_infatuation = new RegExp(/^The opposing (.+?) got over its infatuation!$/);
var regex_got_over_infatuation = new RegExp(/^(.+?) got over its infatuation!$/);
var regex_tounderwent_heroic_transformation = new RegExp(/^The opposing (.+?) underwent a heroic transformation!$/);
var regex_underwent_heroic_transformation = new RegExp(/^(.+?) underwent a heroic transformation!$/);
var regex_toimmobilized_by_love = new RegExp(/^The opposing (.+?) is immobilized by love!$/);
var regex_immobilized_by_love = new RegExp(/^(.+?) is immobilized by love!$/);
var regex_toshuddered = new RegExp(/^The opposing (.+?) shuddered!$/);
var regex_shuddered = new RegExp(/^(.+?) shuddered!$/);
var regex_tomove_was_postponed = new RegExp(/^The opposing (.+?)'s move was postponed!$/);
var regex_move_was_postponed = new RegExp(/^(.+?)'s move was postponed!$/);
var regex_totightening_its_focus = new RegExp(/^The opposing (.+?) is tightening its focus!$/);
var regex_tightening_its_focus = new RegExp(/^(.+?) is tightening its focus!$/);
var regex_toset_shell_trap = new RegExp(/^The opposing (.+?) set a shell trap!$/);
var regex_set_shell_trap = new RegExp(/^(.+?) set a shell trap!$/);
var regex_toshrouded_itself_magiccoat = new RegExp(/^The opposing (.+?) shrouded itself with Magic Coat!$/);
var regex_shrouded_itself_magiccoat = new RegExp(/^(.+?) shrouded itself with Magic Coat!$/);
var regex_also_timer_to_on = new RegExp(/^(.+?) also wants the timer to be on.$/);
var regex_torestorehp_using_zpower = new RegExp(/^The opposing (.+?) will restore its replacement's HP using its Z-Power!$/);
var regex_restorehp_using_zpower = new RegExp(/^(.+?) will restore its replacement's HP using its Z-Power!$/);
var regex_tocuthp_maximized_attack = new RegExp(/^The opposing (.+?) cut its own HP and maximized its Attack!$/);
var regex_cuthp_maximized_attack = new RegExp(/^(.+?) cut its own HP and maximized its Attack!$/);
var regex_torestored_its_hp = new RegExp(/^The opposing (.+?) restored its HP.$/);
var regex_restored_its_hp = new RegExp(/^(.+?) restored its HP.$/);
var regex_torestorehp_using_zpower2 = new RegExp(/^The opposing (.+?) restored its HP using its Z-Power!$/);
var regex_restorehp_using_zpower2 = new RegExp(/^(.+?) restored its HP using its Z-Power!$/);
var regex_toreturned_stats_zpower = new RegExp(/^The opposing (.+?) returned its decreased stats to normal using its Z-Power!$/);
var regex_returned_stats_zpower = new RegExp(/^(.+?) returned its decreased stats to normal using its Z-Power!$/);
var regex_tostarted_heatingup_beak = new RegExp(/^The opposing (.+?) started heating up its beak!$/);
var regex_started_heatingup_beak = new RegExp(/^(.+?) started heating up its beak!$/);
var regex_toswitched_items_target = new RegExp(/^The opposing (.+?) switched items with its target!$/);
var regex_switched_items_target = new RegExp(/^(.+?) switched items with its target!$/);
var regex_tomoves_have_electrified = new RegExp(/^The opposing (.+?)'s moves have been electrified!$/);
var regex_moves_have_electrified = new RegExp(/^(.+?)'s moves have been electrified!$/);
var regex_totarget_bear_grudge = new RegExp(/^The opposing (.+?) wants its target to bear a grudge!$/);
var regex_target_bear_grudge = new RegExp(/^(.+?) wants its target to bear a grudge!$/);
var regex_tolearned = new RegExp(/^The opposing (.+?) learned ([A-z0-9,'.() -]+?)!$/);
var regex_learned = new RegExp(/^(.+?) learned ([A-z0-9,'.() -]+?)!$/);
var regex_tokept_going_crashed = new RegExp(/^The opposing (.+?) kept going and crashed!$/);
var regex_kept_going_crashed = new RegExp(/^(.+?) kept going and crashed!$/);
var regex_tothawed_out = new RegExp(/^The opposing (.+?) thawed out!$/);
var regex_thawed_out = new RegExp(/^(.+?) thawed out!$/);
var regex_tothroat_chop = new RegExp(/^The effects of Throat Chop prevent the opposing (.+?) from using certain moves!$/);
var regex_throat_chop = new RegExp(/^The effects of Throat Chop prevent (.+?) from using certain moves!$/);
var regex_toprotected_aromaticveil = new RegExp(/^The opposing (.+?) is protected by an aromatic veil!$/);
var regex_protected_aromaticveil = new RegExp(/^(.+?) is protected by an aromatic veil!$/);
var regex_tosurrounded_sweetness = new RegExp(/^The opposing (.+?) surrounded itself with a veil of sweetness!$/);
var regex_surrounded_sweetness = new RegExp(/^(.+?) surrounded itself with a veil of sweetness!$/);
var regex_tocant_asleep_sweetness = new RegExp(/^The opposing (.+?) can't fall asleep due to a veil of sweetness!$/);
var regex_cant_asleep_sweetness = new RegExp(/^(.+?) can't fall asleep due to a veil of sweetness!$/);
var regex_tolost_focus = new RegExp(/^The opposing (.+?) lost its focus and couldn't move!$/);
var regex_lost_focus = new RegExp(/^(.+?) lost its focus and couldn't move!$/);
var regex_toattack_missed2 = new RegExp(/^The opposing (.+?)'s attack missed!$/);
var regex_attack_missed2 = new RegExp(/^(.+?)'s attack missed!$/);
var regex_tocenter_attention_zpower = new RegExp(/^The opposing (.+?) became the center of attention using its Z-Power!$/);
var regex_center_attention_zpower = new RegExp(/^(.+?) became the center of attention using its Z-Power!$/);
var regex_tobond_trainer = new RegExp(/^The opposing (.+?) became fully charged due to its bond with its Trainer!$/);
var regex_bond_trainer = new RegExp(/^(.+?) became fully charged due to its bond with its Trainer!$/);
var regex_toprimal_reversion = new RegExp(/^The opposing (.+?)'s Primal Reversion! It reverted to its primal state!$/);
var regex_primal_reversion = new RegExp(/^(.+?)'s Primal Reversion! It reverted to its primal state!$/);
var regex_toabsorbing_power = new RegExp(/^The opposing (.+?) is absorbing power!$/);
var regex_absorbing_power = new RegExp(/^(.+?) is absorbing power!$/);
var regex_totaunt_off = new RegExp(/^The opposing (.+?)'s taunt wore off!$/);
var regex_taunt_off = new RegExp(/^(.+?)'s taunt wore off!$/);
var regex_tocustap_berry = new RegExp(/^The opposing (.+?) can act faster than normal, thanks to its Custap Berry!$/);
var regex_custap_berry = new RegExp(/^(.+?) can act faster than normal, thanks to its Custap Berry!$/);
var regex_totwo_abilities = new RegExp(/^The opposing (.+?) has two Abilities!$/);
var regex_two_abilities = new RegExp(/^(.+?) has two Abilities!$/);
var regex_toprotected_Terrain = new RegExp(/^The opposing (.+?) is protected by the (Electric|Misty|Psychic) Terrain!$/);
var regex_protected_Terrain = new RegExp(/^(.+?) is protected by the (Electric|Misty|Psychic) Terrain!$/);
var regex_tomirrorherb2 = new RegExp(/^The Mirror Herb drastically (raised|lowered) the opposing (.+?)'s ([A-z0-9,'.() -]+?)!$/);
var regex_mirrorherb2 = new RegExp(/^The Mirror Herb drastically (raised|lowered) (.+?)'s ([A-z0-9,'.() -]+?)!$/);
var regex_tomirrorherb = new RegExp(/^The Mirror Herb (sharply raised|raised) the opposing (.+?)'s ([A-z0-9,'.() -]+?)!$/);
var regex_mirrorherb = new RegExp(/^The Mirror Herb (sharply raised|raised) (.+?)'s ([A-z0-9,'.() -]+?)!$/);
var regex_tomirrorherb_Contrary = new RegExp(/^The Mirror Herb (harshly lowered|lowered) the opposing (.+?)'s ([A-z0-9,'.() -]+?)!$/);
var regex_mirrorherb_Contrary = new RegExp(/^The Mirror Herb (harshly lowered|lowered) (.+?)'s ([A-z0-9,'.() -]+?)!$/);
var regex_toStarf_Berry = new RegExp(/^The Starf Berry (sharply raised|drastically raised|harshly lowered) the opposing (.+?)'s ([A-z0-9,'.() -]+?)!$/);
var regex_Starf_Berry = new RegExp(/^The Starf Berry (sharply raised|drastically raised|harshly lowered) (.+?)'s ([A-z0-9,'.() -]+?)!$/);
var regex_toWeakness_Policy = new RegExp(/^The Weakness Policy (sharply raised|drastically raised|harshly lowered) the opposing (.+?)'s ([A-z0-9,'.() -]+?)!$/);
var regex_Weakness_Policy = new RegExp(/^The Weakness Policy (sharply raised|drastically raised|harshly lowered) (.+?)'s ([A-z0-9,'.() -]+?)!$/);
var regex_toRoom_Service = new RegExp(/^The Room Service lowered the opposing (.+?)'s Speed!$/);
var regex_Room_Service = new RegExp(/^The Room Service lowered (.+?)'s Speed!$/);
var regex_toabsorbed_electricity = new RegExp(/^The opposing (.+?) absorbed electricity!$/);
var regex_absorbed_electricity = new RegExp(/^(.+?) absorbed electricity!$/);
var regex_tospace_power = new RegExp(/^The opposing (.+?) is overflowing with space power!$/);
var regex_space_power = new RegExp(/^(.+?) is overflowing with space power!$/);
var regex_togravity = new RegExp(/^The opposing (.+?) couldn't stay airborne because of gravity!$/);
var regex_gravity = new RegExp(/^(.+?) couldn't stay airborne because of gravity!$/);
var regex_toWhite_Herb = new RegExp(/^The opposing (.+?) returned its stats to normal using its White Herb!$/);
var regex_White_Herb = new RegExp(/^(.+?) returned its stats to normal using its White Herb!$/);
var regex_todisguise_busted = new RegExp(/^The opposing (.+?)'s disguise was busted!$/);
var regex_disguise_busted = new RegExp(/^(.+?)'s disguise was busted!$/);
var regex_toswapped_abilities = new RegExp(/^The opposing (.+?) swapped Abilities with its target!$/);
var regex_swapped_abilities = new RegExp(/^(.+?) swapped Abilities with its target!$/);
var regex_tocharging_power = new RegExp(/^The opposing (.+?) began charging power!$/);
var regex_charging_power = new RegExp(/^(.+?) began charging power!$/);
var regex_tofell_love = new RegExp(/^The opposing (.+?) fell in love!$/);
var regex_fell_love = new RegExp(/^(.+?) fell in love!$/);
var regex_toasleep_paralyzed = new RegExp(/^The opposing (.+?) is already (asleep|paralyzed)!$/);
var regex_asleep_paralyzed = new RegExp(/^(.+?) is already (asleep|paralyzed)!$/);
var regex_toidentified = new RegExp(/^The opposing (.+?) was identified!$/);
var regex_identified = new RegExp(/^(.+?) was identified!$/);
var regex_toswitched_Attack_Defense = new RegExp(/^The opposing (.+?) switched its Attack and Defense!$/);
var regex_switched_Attack_Defense = new RegExp(/^(.+?) switched its Attack and Defense!$/);
var regex_toanchors_itself = new RegExp(/^The opposing (.+?) anchors itself!$/);
var regex_anchors_itself = new RegExp(/^(.+?) anchors itself!$/);
var regex_toanchored_suction_cups = new RegExp(/^The opposing (.+?) is anchored in place with its suction cups!$/);
var regex_anchored_suction_cups = new RegExp(/^(.+?) is anchored in place with its suction cups!$/);
var regex_tostopped_shielding_itself = new RegExp(/^\(the opposing (.+?) stopped shielding itself.\)$/);
var regex_stopped_shielding_itself = new RegExp(/^\((.+?) stopped shielding itself.\)$/);
var regex_toshielded_itself = new RegExp(/^\(the opposing (.+?) shielded itself.\)$/);
var regex_shielded_itself = new RegExp(/^\((.+?) shielded itself.\)$/);
var regex_tocriticalhit_zpower = new RegExp(/^The opposing (.+?) boosted its critical-hit ratio using its Z-Power!$/);
var regex_criticalhit_zpower = new RegExp(/^(.+?) boosted its critical-hit ratio using its Z-Power!$/);
var regex_tomaking_uproar = new RegExp(/^The opposing (.+?) is making an uproar!$/);
var regex_making_uproar = new RegExp(/^(.+?) is making an uproar!$/);
var regex_tocaused_uproar = new RegExp(/^The opposing (.+?) caused an uproar!$/);
var regex_caused_uproar = new RegExp(/^(.+?) caused an uproar!$/);
var regex_tomove_no_disabled = new RegExp(/^The opposing (.+?)'s move is no longer disabled!$/);
var regex_move_no_disabled = new RegExp(/^(.+?)'s move is no longer disabled!$/);
var regex_tocan_use_item = new RegExp(/^The opposing (.+?) can use items again!$/);
var regex_can_use_item = new RegExp(/^(.+?) can use items again!$/);
var regex_totorment_wore_off = new RegExp(/^The opposing (.+?)'s torment wore off!$/);
var regex_torment_wore_off = new RegExp(/^(.+?)'s torment wore off!$/);
var regex_toshared_power_target = new RegExp(/^The opposing (.+?) shared its power with the target!$/);
var regex_shared_power_target = new RegExp(/^(.+?) shared its power with the target!$/);
var regex_toshared_guard_target = new RegExp(/^The opposing (.+?) shared its guard with the target!$/);
var regex_shared_guard_target = new RegExp(/^(.+?) shared its guard with the target!$/);
var regex_toswitched_speed_target = new RegExp(/^The opposing (.+?) switched Speed with its target!$/);
var regex_switched_speed_target = new RegExp(/^(.+?) switched Speed with its target!$/);
var regex_toBright_light = new RegExp(/^Bright light is about to burst out of the opposing (.+?)!$/);
var regex_Bright_light = new RegExp(/^Bright light is about to burst out of (.+?)!$/);
var regex_toalready_poisoned = new RegExp(/^The opposing (.+?) is already poisoned.$/);
var regex_already_poisoned = new RegExp(/^(.+?) is already poisoned.$/);
var regex_toalready_paralyzed = new RegExp(/^The opposing (.+?) is already paralyzed.$/);
var regex_already_paralyzed = new RegExp(/^(.+?) is already paralyzed.$/);
var regex_toalready_frozen = new RegExp(/^The opposing (.+?) is already frozen solid!$/);
var regex_already_frozen = new RegExp(/^(.+?) is already frozen solid!$/);
var regex_tosketched = new RegExp(/^The opposing (.+?) sketched ([A-z0-9,'.() -]+?)!$/);
var regex_sketched = new RegExp(/^(.+?) sketched ([A-z0-9,'.() -]+?)!$/);
var regex_toshell_trap = new RegExp(/^The opposing (.+?)'s shell trap didn't work!$/);
var regex_shell_trap = new RegExp(/^(.+?)'s shell trap didn't work!$/);
var regex_toDynamax = new RegExp(/^\(The opposing (.+?)'s Dynamax!\)$/);
var regex_Dynamax = new RegExp(/^\((.+?)'s Dynamax!\)$/);
var regex_no_battle_on_right_now = new RegExp(/^No (.+?) battles are going on right now.$/);
var regex_tosubstitute_faded = new RegExp(/^The opposing (.+?)'s substitute faded!$/);
var regex_substitute_faded = new RegExp(/^(.+?)'s substitute faded!$/);
var regex_not_found = new RegExp(/^The user '(.+?)' was not found.$/);
var regex_Challenging = new RegExp(/^Challenging (.+?)...$/);
var regex_is_offline = new RegExp(/^User (.+?) is offline. If you still want to PM them, send the message again, or use \/offlinemsg.$/);
var regex_tolonger_tormented = new RegExp(/^The opposing (.+?) is no longer tormented!$/);
var regex_longer_tormented = new RegExp(/^(.+?) is no longer tormented!$/);
var regex_tocured_infatuation = new RegExp(/^The opposing (.+?) cured its infatuation using its Mental Herb!$/);
var regex_cured_infatuation = new RegExp(/^(.+?) cured its infatuation using its Mental Herb!$/);
var regex_torocky_helmet = new RegExp(/^The opposing (.+?) was hurt by the Rocky Helmet!$/);
var regex_rocky_helmet = new RegExp(/^(.+?) was hurt by the Rocky Helmet!$/);
var regex_toCourt_Change = new RegExp(/^The opposing (.+?) swapped the battle effects affecting each side of the field!$/);
var regex_Court_Change = new RegExp(/^(.+?) swapped the battle effects affecting each side of the field!$/);
var regex_toalready_substitute = new RegExp(/^The opposing (.+?) already has a substitute!$/);
var regex_already_substitute = new RegExp(/^(.+?) already has a substitute!$/);
var regex_tovanished_instantly = new RegExp(/^The opposing (.+?) vanished instantly!$/);
var regex_vanished_instantly = new RegExp(/^(.+?) vanished instantly!$/);
var regex_toheavy_lifted = new RegExp(/^The opposing (.+?) is too heavy to be lifted!$/);
var regex_heavy_lifted = new RegExp(/^(.+?) is too heavy to be lifted!$/);
var regex_touproar_kept = new RegExp(/^But the uproar kept the opposing (.+?) awake!$/);
var regex_uproar_kept = new RegExp(/^But the uproar kept (.+?) awake!$/);
var regex_tobraced_itself = new RegExp(/^The opposing (.+?) braced itself!$/);
var regex_braced_itself = new RegExp(/^(.+?) braced itself!$/);
var regex_toswitched_stat_target = new RegExp(/^The opposing (.+?) switched stat changes with its target!$/);
var regex_switched_stat_target = new RegExp(/^(.+?) switched stat changes with its target!$/);
var regex_toswitched_def_spd = new RegExp(/^The opposing (.+?) switched all changes to its Defense and Sp. Def with its target!$/);
var regex_switched_def_spd = new RegExp(/^(.+?) switched all changes to its Defense and Sp. Def with its target!$/);
var regex_toswitched_atk_spa = new RegExp(/^The opposing (.+?) switched all changes to its Attack and Sp. Atk with its target!$/);
var regex_switched_atk_spa = new RegExp(/^(.+?) switched all changes to its Attack and Sp. Atk with its target!$/);
var regex_torevealed = new RegExp(/^The opposing (.+?)'s ([A-z0-9,'.() -]+?) was revealed!$/);
var regex_revealed = new RegExp(/^(.+?)'s ([A-z0-9,'.() -]+?) was revealed!$/);
var regex_toGMax_Wildfire = new RegExp(/^The opposing (.+?) is burning up within G-Max Wildfire’s flames!$/);
var regex_GMax_Wildfire = new RegExp(/^(.+?) is burning up within G-Max Wildfire’s flames!$/);
var regex_no_energy = new RegExp(/^(.+?) has no energy left to battle!$/);
var regex_already_in_battle = new RegExp(/^(.+?) is already in battle!$/);
var regex_towaiting_move = new RegExp(/^The opposing (.+?) is waiting for (.+?)'s move...$/);
var regex_waiting_move = new RegExp(/^(.+?) is waiting for (.+?)'s move...$/);
var regex_tosea_fire = new RegExp(/^The opposing (.+?) was hurt by the sea of fire!$/);
var regex_sea_fire = new RegExp(/^(.+?) was hurt by the sea of fire!$/);
var regex_toTelepathy = new RegExp(/^The opposing (.+?) can't be hit by attacks from its ally Pokemon!$/);
var regex_Telepathy = new RegExp(/^(.+?) can't be hit by attacks from its ally Pokemon!$/);
var regex_toKey_Stone = new RegExp(/^The opposing (.+?)'s ([A-z0-9,'.() -]+?) is reacting to the Key Stone!$/);
var regex_Key_Stone = new RegExp(/^(.+?)'s ([A-z0-9,'.() -]+?) is reacting to the Key Stone!$/);
var regex_tobecame_AshGreninja = new RegExp(/^The opposing (.+?) became Ash-Greninja!$/);
var regex_became_AshGreninja = new RegExp(/^(.+?) became Ash-Greninja!$/);
var regex_crazy_house = new RegExp(/^(.+?) was captured by (.+?)!$/);
var regex_tomelted = new RegExp(/^The opposing (.+?)'s ([A-z0-9,'.() -]+?) melted the ice!$/);
var regex_melted = new RegExp(/^(.+?)'s ([A-z0-9,'.() -]+?) melted the ice!$/);
var regex_toelectromagnetism_woreoff = new RegExp(/^The opposing (.+?)'s electromagnetism wore off!$/);
var regex_electromagnetism_woreoff = new RegExp(/^(.+?)'s electromagnetism wore off!$/);
var regex_tocant_use_gravity = new RegExp(/^The opposing (.+?) can't use ([A-z0-9,'.() -]+?) because of gravity!$/);
var regex_cant_use_gravity = new RegExp(/^The opposing (.+?) can't use ([A-z0-9,'.() -]+?) because of gravity!$/);
var regex_tomaxed_Attack = new RegExp(/^The opposing (.+?) maxed its Attack!$/);
var regex_maxed_Attack = new RegExp(/^(.+?) maxed its Attack!$/);
var regex_tocenter_attention = new RegExp(/^The opposing (.+?) became the center of attention!$/);
var regex_center_attention = new RegExp(/^(.+?) became the center of attention!$/);
var regex_toHospitality = new RegExp(/^The opposing (.+?) drank down all the matcha that the opposing (.+?) made!$/);
var regex_Hospitality = new RegExp(/^(.+?) drank down all the matcha that (.+?) made!$/);
var regex_toRowap_Berry_Jaboca_Berry = new RegExp(/^The opposing (.+?) was hurt by (.+?)'s (Rowap|Jaboca) Berry!$/);
var regex_Rowap_Berry_Jaboca_Berry = new RegExp(/^(.+?) was hurt by the opposing (.+?)'s (Rowap|Jaboca) Berry!$/);
var regex_tostoring_energy = new RegExp(/^The opposing (.+?) is storing energy!$/);
var regex_storing_energy = new RegExp(/^(.+?) is storing energy!$/);
var regex_tounleashed_energy = new RegExp(/^The opposing (.+?) unleashed its energy!$/);
var regex_unleashed_energy = new RegExp(/^(.+?) unleashed its energy!$/);
var regex_tobecame_nimble = new RegExp(/^The opposing (.+?) became nimble!$/);
var regex_became_nimble = new RegExp(/^(.+?) became nimble!$/);
var regex_rejected_Open_Team_Sheet = new RegExp(/^(.+?) rejected open team sheets.$/);
var regex_agreed_Open_Team_Sheet = new RegExp(/^(.+?) has agreed to open team sheets.$/);
var regex_tosqueezed_wrapped = new RegExp(/^The opposing (.+?) was (squeezed|wrapped) by (.+?)!$/);
var regex_squeezed_wrapped = new RegExp(/^(.+?) was (squeezed|wrapped) by the opposing (.+?)!$/);
var regex_tounaffected = new RegExp(/^The opposing (.+?) is unaffected!$/);
var regex_unaffected = new RegExp(/^(.+?) is unaffected!$/);
var regex_toabsorbed_nutrients_roots = new RegExp(/^The opposing (.+?) absorbed nutrients with its roots!$/);
var regex_absorbed_nutrients_roots = new RegExp(/^(.+?) absorbed nutrients with its roots!$/);
var regex_tonot_lowered = new RegExp(/^The opposing (.+?)'s ([A-z0-9,'.() -]+?) was not lowered!$/);
var regex_not_lowered = new RegExp(/^(.+?)'s ([A-z0-9,'.() -]+?) was not lowered!$/);
var regex_totype_added = new RegExp(/^([A-z0-9,'.() -]+?) type was added to the opposing (.+?)!$/);
var regex_type_added = new RegExp(/^([A-z0-9,'.() -]+?) type was added to (.+?)!$/);
var regex_tocant_get_going = new RegExp(/^The opposing (.+?) can't get it going!$/);
var regex_cant_get_going = new RegExp(/^(.+?) can't get it going!$/);
var regex_tofinally_get_going = new RegExp(/^The opposing (.+?) finally got its act together!$/);
var regex_finally_get_going = new RegExp(/^(.+?) finally got its act together!$/);
var regex_towas_burned_up = new RegExp(/^The opposing (.+?)'s ([A-z0-9,'.() -]+?) was burned up!$/);
var regex_was_burned_up = new RegExp(/^(.+?)'s ([A-z0-9,'.() -]+?) was burned up!$/);
var regex_tosurrounded_veil_petals = new RegExp(/^The opposing (.+?) surrounded itself with a veil of petals!$/);
var regex_surrounded_veil_petals = new RegExp(/^(.+?) surrounded itself with a veil of petals!$/);
var regex_toAbility_became_Mummy = new RegExp(/^The opposing (.+?)'s Ability became Mummy!$/);
var regex_Ability_became_Mummy = new RegExp(/^(.+?)'s Ability became Mummy!$/);
var regex_toreturned_normal = new RegExp(/^\(The opposing (.+?) returned to normal!\)$/);
var regex_returned_normal = new RegExp(/^\((.+?) returned to normal!\)$/);
var regex_tolingering_aroma = new RegExp(/^A lingering aroma clings to the opposing (.+?)!$/);
var regex_lingering_aroma = new RegExp(/^A lingering aroma clings to (.+?)!$/);
var regex_totoReflect_Type = new RegExp(/^The opposing (.+?)'s type became the same as the opposing (.+?)'s type!$/);
var regex_toReflect_Type2 = new RegExp(/^The opposing (.+?)'s type became the same as (.+?)'s type!$/);
var regex_toReflect_Type = new RegExp(/^(.+?)'s type became the same as the opposing (.+?)'s type!$/);
var regex_Reflect_Type = new RegExp(/^(.+?)'s type became the same as (.+?)'s type!$/);
var regex_totaken_over = new RegExp(/^The opposing (.+?)'s ([A-z0-9,'.() -]+?) was taken over!$/);
var regex_taken_over = new RegExp(/^(.+?)'s ([A-z0-9,'.() -]+?) was taken over!$/);
var regex_toweaker_to_fire = new RegExp(/^The opposing (.+?) became weaker to fire!$/);
var regex_weaker_to_fire = new RegExp(/^(.+?) became weaker to fire!$/);
var regex_tocalmed_down = new RegExp(/^The opposing (.+?) calmed down.$/);
var regex_calmed_down = new RegExp(/^(.+?) calmed down.$/);
var regex_toFlash_Fire = new RegExp(/^The power of the opposing (.+?)'s Fire-type moves rose!$/);
var regex_Flash_Fire = new RegExp(/^The power of (.+?)'s Fire-type moves rose!$/);
var regex_towaiting_target_move = new RegExp(/^The opposing (.+?) is waiting for a target to make a move!$/);
var regex_waiting_target_move = new RegExp(/^(.+?) is waiting for a target to make a move!$/);
var regex_tosnatched_move = new RegExp(/^The opposing (.+?) snatched (.+?)'s move!$/);
var regex_snatched_move = new RegExp(/^(.+?) snatched the opposing (.+?)'s move!$/);
var regex_toMat_Block = new RegExp(/^The opposing (.+?) intends to flip up a mat and block incoming attacks!$/);
var regex_Mat_Block = new RegExp(/^(.+?) intends to flip up a mat and block incoming attacks!$/);
var regex_kicked_up_mat = new RegExp(/^([A-z0-9,'.() -]+?) was blocked by the kicked-up mat!$/);
var regex_no_wants_timer_on = new RegExp(/^(.+?) no longer wants the timer on, but the timer is staying on because (.+?) still does.$/);
var regex_toGMax_Vine_Lash = new RegExp(/^The opposing (.+?) is hurt by G-Max Vine Lash’s ferocious beating!$/);
var regex_GMax_Vine_Lash = new RegExp(/^(.+?) is hurt by G-Max Vine Lash’s ferocious beating!$/);
var regex_toGMax_Cannonade = new RegExp(/^The opposing (.+?) is hurt by G-Max Cannonade’s vortex!$/);
var regex_GMax_Cannonade = new RegExp(/^(.+?) is hurt by G-Max Cannonade’s vortex!$/);
var regex_tosharp_steel = new RegExp(/^The sharp steel bit into the opposing (.+?)!$/);
var regex_sharp_steel = new RegExp(/^The sharp steel bit into (.+?)!$/);
var regex_already_selected = new RegExp(/^(.+?) is already selected!$/);
var regex_toOctolock = new RegExp(/^The opposing (.+?) can no longer escape because of Octolock!$/);
var regex_Octolock = new RegExp(/^(.+?) can no longer escape because of Octolock!$/);
var regex_areintheback5 = new RegExp(/^([A-z0-9,'.() -]+?), ([A-z0-9,'.() -]+?), ([A-z0-9,'.() -]+?), ([A-z0-9,'.() -]+?), ([A-z0-9,'.() -]+?) are in the back.$/);
var regex_areintheback4 = new RegExp(/^([A-z0-9,'.() -]+?), ([A-z0-9,'.() -]+?), ([A-z0-9,'.() -]+?), ([A-z0-9,'.() -]+?) are in the back.$/);
var regex_areintheback3 = new RegExp(/^([A-z0-9,'.() -]+?), ([A-z0-9,'.() -]+?), ([A-z0-9,'.() -]+?) are in the back.$/);
var regex_areintheback2 = new RegExp(/^([A-z0-9,'.() -]+?), ([A-z0-9,'.() -]+?) are in the back.$/);
var regex_areintheback = new RegExp(/^([A-z0-9,'.() -]+?) are in the back.$/);
var regex_toPluck_BugBite = new RegExp(/^The opposing (.+?) stole and ate its target's ([A-z0-9,'.() -]+?)!$/);
var regex_Pluck_BugBite = new RegExp(/^(.+?) stole and ate its target's ([A-z0-9,'.() -]+?)!$/);
var regex_toliquid_ooze = new RegExp(/^The opposing (.+?) sucked up the liquid ooze!$/);
var regex_liquid_ooze = new RegExp(/^(.+?) sucked up the liquid ooze!$/);
var regex_tocovered_powder = new RegExp(/^The opposing (.+?) is covered in powder!$/);
var regex_covered_powder = new RegExp(/^(.+?) is covered in powder!$/);
var regex_tospecial_attacks = new RegExp(/^The opposing (.+?)'s protected against special attacks!$/);
var regex_special_attacks = new RegExp(/^(.+?)'s protected against special attacks!$/);
var regex_togained_armor = new RegExp(/^The opposing (.+?) gained armor!$/);
var regex_gained_armor = new RegExp(/^(.+?) gained armor!$/);
var regex_toformed_school = new RegExp(/^The opposing (.+?) formed a school!$/);
var regex_formed_school = new RegExp(/^(.+?) formed a school!$/);
var regex_tostopped_schooling = new RegExp(/^The opposing (.+?) stopped schooling!$/);
var regex_stopped_schooling = new RegExp(/^(.+?) stopped schooling!$/);
var regex_tobursting_flame = new RegExp(/^The bursting flame hit the opposing (.+?)!$/);
var regex_bursting_flame = new RegExp(/^The bursting flame hit (.+?)!$/);
var regex_send_offline_confirm = new RegExp(/^User (.+?) is offline. If you still want to PM them, send the message again to confirm.$/);
var regex_tofell_for_feint = new RegExp(/^The opposing (.+?) fell for the feint!$/);
var regex_fell_for_feint = new RegExp(/^(.+?) fell for the feint!$/);
var regex_tobroke_protection = new RegExp(/^It broke through the opposing (.+?)'s protection!$/);
var regex_broke_protection = new RegExp(/^It broke through (.+?)'s protection!$/);
var regex_toalready_preparing = new RegExp(/^The opposing (.+?) is already preparing its next move!$/);
var regex_already_preparing = new RegExp(/^(.+?) is already preparing its next move!$/);
var regex_tobeing_withdrawn2 = new RegExp(/^The opposing (.+?) is being withdrawn!$/);
var regex_being_withdrawn2 = new RegExp(/^(.+?) is being withdrawn!$/);
var regex_toclamped_down = new RegExp(/^The opposing (.+?) clamped down on (.+?)!$/);
var regex_clamped_down = new RegExp(/^(.+?) clamped down on the opposing (.+?)!$/);
var regex_totook_kind_offer = new RegExp(/^The opposing (.+?) took the kind offer!$/);
var regex_took_kind_offer = new RegExp(/^(.+?) took the kind offer!$/);
var regex_tohaving_nightmare = new RegExp(/^The opposing (.+?) began having a nightmare!$/);
var regex_having_nightmare = new RegExp(/^(.+?) began having a nightmare!$/);
var regex_reconnected2 = new RegExp(/^(.+?) reconnected.$/);
var regex_tobecause_gravity = new RegExp(/^The opposing (.+?) can't use ([A-z0-9,'.() -]+?) because of gravity!$/);
var regex_because_gravity = new RegExp(/^(.+?) can't use ([A-z0-9,'.() -]+?) because of gravity!$/);
var regex_Invite_sent_to = new RegExp(/^Invite sent to (.+?)!$/);
var regex_toGMax_Volcalith = new RegExp(/^The opposing (.+?) is hurt by the rocks thrown out by G-Max Volcalith!$/);
var regex_GMax_Volcalith = new RegExp(/^(.+?) is hurt by the rocks thrown out by G-Max Volcalith!$/);
var regex_toprotect_hurt = new RegExp(/^The opposing (.+?) couldn't fully protect itself and got hurt!$/);
var regex_protect_hurt = new RegExp(/^(.+?) couldn't fully protect itself and got hurt!$/);
var regex_cant_Dynamax = new RegExp(/^\[Invalid choice\] Can't move: (.+?) can't Dynamax now.$/);
var regex_toPower_Shift = new RegExp(/^The opposing (.+?) swapped its offensive stats with its defensive stats!$/);
var regex_Power_Shift = new RegExp(/^(.+?) swapped its offensive stats with its defensive stats!$/);
var regex_toanchored_roots = new RegExp(/^The opposing (.+?) is anchored in place with its roots!$/);
var regex_anchored_roots = new RegExp(/^(.+?) is anchored in place with its roots!$/);
var regex_toUltra_Burst = new RegExp(/^The opposing (.+?) regained its true power through Ultra Burst!$/);
var regex_Ultra_Burst = new RegExp(/^(.+?) regained its true power through Ultra Burst!$/);
var regex_from4 = new RegExp(/\(([0-9.]+?)× from ([A-z0-9,'.+ -]+?)\) \(([0-9.]+?)× from ([A-z0-9,'.+ -]+?)\) \(([0-9.]+?)× from ([A-z0-9,'.+ -]+?)\) \(([0-9.]+?)× from ([A-z0-9,'.+ -]+?)\)$/);
var regex_from3 = new RegExp(/\(([0-9.]+?)× from ([A-z0-9,'.+ -]+?)\) \(([0-9.]+?)× from ([A-z0-9,'.+ -]+?)\) \(([0-9.]+?)× from ([A-z0-9,'.+ -]+?)\)$/);
var regex_from2 = new RegExp(/\(([0-9.]+?)× from ([A-z0-9,'.+ -]+?)\) \(([0-9.]+?)× from ([A-z0-9,'.+ -]+?)\)$/);
var regex_from = new RegExp(/\(([0-9.]+?)× from ([A-z0-9,'.+ -]+?)\)$/);
var regex_toProtective_Pads = new RegExp(/^The opposing (.+?) protected itself with its Protective Pads!$/);
var regex_Protective_Pads = new RegExp(/^(.+?) protected itself with its Protective Pads!$/);
var regex_toAbility_Shield = new RegExp(/^The opposing (.+?)'s Ability is protected by the effects of its Ability Shield!$/);
var regex_Ability_Shield = new RegExp(/^(.+?)'s Ability is protected by the effects of its Ability Shield!$/);
var regex_togrudge = new RegExp(/^The opposing (.+?)'s ([A-z0-9,'.() -]+?) lost all of its PP due to the grudge!$/);
var regex_grudge = new RegExp(/^(.+?)'s ([A-z0-9,'.() -]+?) lost all of its PP due to the grudge!$/);
var regex_toalready_has_burn = new RegExp(/^The opposing (.+?) already has a burn.$/);
var regex_already_has_burn = new RegExp(/^(.+?) already has a burn.$/);
var regex_already_searching = new RegExp(/^Couldn't search: You are already searching for a (.+?) battle.$/);
var regex_todoesnt_become_confused = new RegExp(/^The opposing (.+?) doesn't become confused!$/);
var regex_doesnt_become_confused = new RegExp(/^(.+?) doesn't become confused!$/);
var regex_already_challenge = new RegExp(/^There's already a challenge (.+?) between you and (.+?)!$/);
var regex_tobecause_Heal_Block = new RegExp(/^The opposing (.+?) can't use ([A-z0-9,'.() -]+?) because of Heal Block!$/);
var regex_because_Heal_Block = new RegExp(/^(.+?) can't use ([A-z0-9,'.() -]+?) because of Heal Block!$/);
var regex_offering_tie = new RegExp(/^(.+?) is offering a tie.$/);
var regex_rejected_accepted_tie = new RegExp(/^(.+?) (rejected|accepted) the tie.$/);
var regex_toStickyBarb_burn_BlackSludge = new RegExp(/^The opposing (.+?) was hurt by its (Sticky Barb|burn|Black Sludge)!$/);
var regex_StickyBarb_burn_BlackSludge = new RegExp(/^(.+?) was hurt by its (Sticky Barb|burn|Black Sludge)!$/);
var regex_toCrafty_Quick_Wide_Shield = new RegExp(/^(Crafty|Quick|Wide) Guard protected the opposing (.+?)!$/);
var regex_Crafty_Quick_Wide_Shield = new RegExp(/^(Crafty|Quick|Wide) Guard protected (.+?)!$/);
var regex_toTreasures_of_ruin = new RegExp(/^The opposing (.+?)'s ([A-z0-9,'() -]+?) weakened the ([A-z0-9,'.() -]+?) of all surrounding Pokemon!$/);
var regex_Treasures_of_ruin = new RegExp(/^(.+?)'s ([A-z0-9,'() -]+?) weakened the ([A-z0-9,'.() -]+?) of all surrounding Pokemon!$/);
var regex_Specific_to = new RegExp(/^Specific to (.+?)$/);
var regex_toprotective_mist = new RegExp(/^The opposing (.+?) surrounds itself with a protective mist!$/);
var regex_protective_mist = new RegExp(/^(.+?) surrounds itself with a protective mist!$/);
var regex_torose = new RegExp(/^The opposing (.+?)'s ([A-z0-9,'.() -]+?) (rose drastically|rose sharply|rose)!$/);
var regex_rose = new RegExp(/^(.+?)'s ([A-z0-9,'.() -]+?) (rose drastically|rose sharply|rose)!$/);
var regex_tofell = new RegExp(/^The opposing (.+?)'s ([A-z0-9,'.() -]+?) (fell severely|fell harshly|fell)!$/);
var regex_fell = new RegExp(/^(.+?)'s ([A-z0-9,'.() -]+?) (fell severely|fell harshly|fell)!$/);
var regex_toperishsong = new RegExp(/^The opposing (.+?)'s perish count fell to (3|2|1|0).$/);
var regex_perishsong = new RegExp(/^(.+?)'s perish count fell to (3|2|1|0).$/);
var regex_toDestiny_Knot = new RegExp(/^The opposing (.+?) fell in love because of the Destiny Knot!$/);
var regex_Destiny_Knot = new RegExp(/^(.+?) fell in love because of the Destiny Knot!$/);
var regex_toBerserk_Gene = new RegExp(/^The Berserk Gene sharply raised the opposing (.+?)'s Attack!$/);
var regex_Berserk_Gene = new RegExp(/^The Berserk Gene sharply raised (.+?)'s Attack!$/);
var regex_Guessed_spread = new RegExp(/^([A-UW-Za-z ]+?):\s(\d{1,3})\s([A-z]{2,3})\s\/\s(\d{1,3})\s([A-z]{2,3})\s\/\s(\d{1,3})\s([A-z]{2,3})(.+?)$/);
var regex_Guessed_spread3 = new RegExp(/^(\d{1,3})\s([A-z]{2,3})\s\/\s(\d{1,3})\s([A-z]{2,3})\s\/\s(\d{1,3})\s([A-z]{2,3})(.+?)$/);
var regex_Guessed_spread4 = new RegExp(/^(\d{1,3})\s([A-z]{2,3})\s\/\s(\d{1,3})\s([A-z]{2,3})(.+?)$/);
var regex_Teaches = new RegExp(/^Teaches certain Pokemon the move ([A-z0-9' -]+?). One use.$/);
var regex_allows_ZMove = new RegExp(/^If holder has (a|an) ([A-z]+?) move, this item allows it to use (a|an) ([A-z]+?) Z-Move.$/);
var regex_Multi_Attack = new RegExp(/^^Holder's Multi-Attack is ([A-z]+?) type.$/);
var regex_Judgment = new RegExp(/^Holder's ([A-z]+?)-type attacks have 1.2x power. Judgment is ([A-z]+?) type.$/);
var regex_attacks_have = new RegExp(/^Holder's ([A-z]+?)-type attacks have 1.(1|2)x power.$/);
var regex_Gem = new RegExp(/^Holder's first successful ([A-z]+?)-type attack will have 1.(3|5)x power. Single use.$/);
var regex_taken_supereffective = new RegExp(/^Halves damage taken from a supereffective ([A-z]+?)-type attack. Single use.$/);
var regex_Can_revived = new RegExp(/^Can be revived into ([A-z0-9,'() -]+?).$/);
var regex_Evolves = new RegExp(/^Evolves ([A-z0-9,'.() -]+?) into ([A-z0-9,'.() -]+?) when (us|trad)ed.$/);
var regex_confuses_Nature = new RegExp(/^Restores ([A-z0-9/.%]+?) max HP at ([A-z0-9/.%]+?) max HP or less; confuses if -([A-z]+?) Nature. Single use.$/);
var regex_Mega_Evolve_item = new RegExp(/^If held by (a|an) ([A-z0-9']+?), this item allows it to Mega Evolve in battle.$/);
var regex_Spe_to = new RegExp(/^ (\d{1,3}) to (\d{1,3}) $/);
var regex_battles_ballte = new RegExp(/^([0-9+]+?) ([A-z0-9'() -]+?) (battles|battle)$/);
var regex_Turn = new RegExp(/^Turn (\d{1,4})$/);
var regex_Transformed_into2 = new RegExp(/^\(Transformed into ([A-z0-9,'.() -]+?)\)$/);
var regex_knocked_off = new RegExp(/^([A-z,'.0-9 -]+?) \(knocked off\)$/);
var regex_hid_replay = new RegExp(/^(.+?) hid the replay of this battle.$/);
var regex_weather_suppressed = new RegExp(/\((Snow|Hail|Desolate Land|Sunny Day|Primordial Sea|Rain Dance|Sandstorm) suppressed by ([A-z -]+?)\)$/);
var regex_Nature_Power = new RegExp(/^Nature Power turned into ([A-z0-9,'.() -]+?)\)$/);
var regex_Use_different_nature = new RegExp(/Use a different nature to save (\d{1,3}) EVs:/);
var regex_made_hidden = new RegExp(/^(.+?) made this room hidden.$/);
var regex_made_public = new RegExp(/^(.+?) made this room public.$/);
var regex_tofell_sky = new RegExp(/^The opposing (.+?) fell from the sky due to the gravity!$/);
var regex_fell_sky = new RegExp(/^(.+?) fell from the sky due to the gravity!$/);
var regex_lol = new RegExp(/^you don't have any(.+?)teams lol$/);

   //  \s


var regex_Mega_Evolution = new RegExp(/^\sMega\sEvolution$/);
var regex_Fallen = new RegExp(/^Fallen:\s(\d{1})$/);
var regex_modifiers = new RegExp(/^([0-9.×]+?)\s([A-z]+?)$/);
var regex_modifiers2 = new RegExp(/^already\s(4|0.33|0.25)×\s([A-z]+?)$/);
var regex_PQ = new RegExp(/^(Protosynthesis|Quark\sDrive):\s([A-z]+?)$/);
var regex_NR = new RegExp(/^No\sRetreat$/);
var regex_LR = new RegExp(/^Leech\sSeed$/);
var regex_SC = new RegExp(/^Salt\sCure$/);
var regex_SC2 = new RegExp(/^Stats\scopied$/);
var regex_DB = new RegExp(/^Destiny\sBond$/);
var regex_SD = new RegExp(/^Smack\sDown$/);
var regex_MS = new RegExp(/^Magma\sStorm$/);
var regex_FS = new RegExp(/^Fire\sSpin$/);
var regex_ST = new RegExp(/^Sand\sTomb$/);
var regex_ST2 = new RegExp(/^Snap\sTrap$/);
var regex_TC = new RegExp(/^Thunder\sCage$/);
var regex_TC2 = new RegExp(/^Throat\sChop$/);
var regex_ME = new RegExp(/^Miracle\sEye$/);
var regex_OS = new RegExp(/^Odor\sSleuth$/);
var regex_HB = new RegExp(/^Heal\sBlock$/);
var regex_HBE = new RegExp(/^Heal Block\sended$/);
var regex_PS = new RegExp(/^Perish\sin\s(3|2)$/);
var regex_PNT = new RegExp(/^Perish\snext\sturn$/);
var regex_PN = new RegExp(/^Perish\snow$/);
var regex_TS = new RegExp(/^Tar\sShot$/);
var regex_TS2 = new RegExp(/^Trap\sset$/);
var regex_TS3 = new RegExp(/^Torment\sended$/);
var regex_MR = new RegExp(/^Must\srecharge$/);
var regex_MR2 = new RegExp(/^Magnet\sRise$/);
var regex_RP = new RegExp(/^Rage\sPowder$/);
var regex_FM = new RegExp(/^Follow\sMe$/);
var regex_CHB = new RegExp(/^Critical\sHit\sBoost$/);
var regex_LF = new RegExp(/^Laser\sFocus$/);
var regex_HH = new RegExp(/^Helping\sHand$/);
var regex_PT = new RegExp(/^Power\sTrick$/);
var regex_WG = new RegExp(/^Wide\sGuard$/);
var regex_QG = new RegExp(/^Quick\sGuard$/);
var regex_MB = new RegExp(/^Mat\sBlock$/);
var regex_MC = new RegExp(/^Magic\sCoat$/);
var regex_GR = new RegExp(/^Glaive\sRush$/);
var regex_BB = new RegExp(/^Beak\sBlast$/);
var regex_AR = new RegExp(/^Aqua\sRing$/);
var regex_SS = new RegExp(/^Slow\sStart$/);
var regex_BO = new RegExp(/^Blue\sOrb$/);
var regex_RO = new RegExp(/^Red\sOrb$/);
var regex_AS = new RegExp(/^Attract\sended$/);
var regex_DS = new RegExp(/^Disable\sended$/);
var regex_ES = new RegExp(/^Encore\sended$/);
var regex_TE = new RegExp(/^Taunt\sended$/);
var regex_CE = new RegExp(/^Confusion\sended$/);
var regex_IKO = new RegExp(/^Item\sknocked\soff$/);
var regex_FF = new RegExp(/^Flash\sFire$/);
var regex_IF = new RegExp(/^Imprisoning\sfoe$/);
var regex_AP = new RegExp(/^Already\spoisoned$/);
var regex_AP2 = new RegExp(/^Already\sparalyzed$/);
var regex_AB = new RegExp(/^Already\sburned$/);
var regex_LS = new RegExp(/^Loafing\saround$/);
var regex_SDB = new RegExp(/^Stat\sdrop\sblocked$/);
var regex_BL = new RegExp(/^Boost\slost$/);
var regex_Guessed_spread2 = new RegExp(/^Guessed\sspread:\s\(Please\schoose\s4\smoves\sto\sget\sa\sguessed\sspread\) \($/);




   //  debug

var regex_totoknock = new RegExp(/^The opposing (.+?) knocked off the opposing (.+?)'s ([A-z0-9,'.() -]+?)!$/);
var regex_toknock2 = new RegExp(/^The opposing (.+?) knocked off (.+?)'s ([A-z0-9,'.() -]+?)!$/);
var regex_toknock = new RegExp(/^(.+?) knocked off the opposing (.+?)'s ([A-z0-9,'.() -]+?)!$/);
var regex_knock = new RegExp(/^(.+?) knocked off (.+?)'s ([A-z0-9,'.() -]+?)!$/);
var regex_knock2 = new RegExp(/^knocked off (.+?)'s ([A-z0-9,'.() -]+?)!$/);
var regex_totothief = new RegExp(/^The opposing (.+?) stole the opposing (.+?)'s ([A-z0-9,'.() -]+?)!$/);
var regex_tothief2 = new RegExp(/^The opposing (.+?) stole (.+?)'s ([A-z0-9,'.() -]+?)!$/);
var regex_tothief = new RegExp(/^(.+?) stole the opposing (.+?)'s ([A-z0-9,'.() -]+?)!$/);
var regex_thief = new RegExp(/^(.+?) stole (.+?)'s ([A-z0-9,'.() -]+?)!$/);
var regex_tototrace = new RegExp(/^The opposing (.+?) traced the opposing (.+?)'s ([A-z0-9,'.() -]+?)!$/);
var regex_totrace2 = new RegExp(/^The opposing (.+?) traced (.+?)'s ([A-z0-9,'.() -]+?)!$/);
var regex_totrace = new RegExp(/^(.+?) traced the opposing (.+?)'s ([A-z0-9,'.() -]+?)!$/);
var regex_trace = new RegExp(/^(.+?) traced (.+?)\'s ([A-z0-9,'.() -]+?)!$/);
var regex_totoroleplay = new RegExp(/^The opposing (.+?) copied the opposing (.+?)'s ([A-z0-9,'.() -]+?) Ability!$/);
var regex_toroleplay2 = new RegExp(/^The opposing (.+?) copied (.+?)'s ([A-z0-9,'.() -]+?) Ability!$/);
var regex_toroleplay = new RegExp(/^(.+?) copied the opposing (.+?)'s ([A-z0-9,'.() -]+?) Ability!$/);
var regex_roleplay = new RegExp(/^(.+?) copied (.+?)'s ([A-z0-9,'.() -]+?) Ability!$/);
var regex_tocannot_use = new RegExp(/^The opposing (.+?) cannot use ([A-z0-9,'.() -]+?)!$/);
var regex_cannot_use = new RegExp(/^(.+?) cannot use ([A-z0-9,'.() -]+?)!$/);
var regex_tostockpiled = new RegExp(/^The opposing (.+?) stockpiled (.+?)!$/);
var regex_stockpiled = new RegExp(/^(.+?) stockpiled (.+?)!$/);
var regex_toihb = new RegExp(/^The opposing (.+?) is hurt by ([A-z0-9,'.() -]+?)!$/);
var regex_ihb = new RegExp(/^(.+?) is hurt by ([A-z0-9,'.() -]+?)!$/);
var regex_tofreed = new RegExp(/^The opposing (.+?) was freed from (.+?)!$/);
var regex_freed = new RegExp(/^(.+?) was freed from (.+?)!$/);
var regex_tocant_use = new RegExp(/^The opposing (.+?) can't use ([A-z0-9,'.() -]+?)!$/);
var regex_cant_use = new RegExp(/^(.+?) can't use ([A-z0-9,'.() -]+?)!$/);
var regex_totrapped = new RegExp(/^The opposing (.+?) trapped (.+?)!$/);
var regex_trapped = new RegExp(/^(.+?) trapped the opposing (.+?)!$/);
var regex_joined = new RegExp(/^(.+?) joined$/);
var regex_left = new RegExp(/^(.+?) left$/);
var regex_toeerie_spell = new RegExp(/^It reduced the PP of the opposing (.+?)'s ([A-z0-9,'.() -]+?) by (.+?)!$/);
var regex_eerie_spell = new RegExp(/^It reduced the PP of (.+?)'s ([A-z0-9,'.() -]+?) by (.+?)!$/);
var regex_Unavailable_choice_cant_move = new RegExp(/^[Unavailable choice] Can't move: (.+?)'s ([A-z0-9,'.() -]+?) is disabled$/);
var regex_toleppaberry = new RegExp(/^The opposing (.+?) restored PP to its move ([A-z0-9,'.() -]+?) using its Leppa Berry!$/);
var regex_leppaberry = new RegExp(/^(.+?) restored PP to its move ([A-z0-9,'.() -]+?) using its Leppa Berry!$/);
var regex_tostat_changes = new RegExp(/^The opposing (.+?)'s stat changes!$/);
var regex_stat_changes = new RegExp(/^(.+?)'s stat changes!$/);
var regex_tosymbiosis = new RegExp(/^The opposing (.+?) shared its ([A-z0-9,'.() -]+?) with the opposing (.+?)!$/);
var regex_symbiosis = new RegExp(/^(.+?) shared its ([A-z0-9,'.() -]+?) with (.+?)!$/);
var regex_tohigh_low = new RegExp(/^The opposing (.+?)'s ([A-z0-9,'.() -]+?) won't go any (higher|lower)!$/);
var regex_high_low = new RegExp(/^(.+?)'s ([A-z0-9,'.() -]+?) won't go any (higher|lower)!$/);
var regex_towas_heightened = new RegExp(/^The opposing (.+?)'s ([A-z0-9,'.() -]+?) was heightened!$/);
var regex_was_heightened = new RegExp(/^(.+?)'s ([A-z0-9,'.() -]+?) was heightened!$/);
var regex_Move_here = new RegExp(/^ Move here$/);
var regex_to_used = new RegExp(/^The opposing (.+?) used $/);
var regex_used = new RegExp(/^(.+?) used $/);
var regex_to123 = new RegExp(/^\[The opposing (.+?)'s ([A-z0-9,'.() -]+?)\]$/);
var regex_123 = new RegExp(/^\[(.+?)'s ([A-z0-9,'.() -]+?)\]$/);
var regex_1234 = new RegExp(/^\(([A-z0-9,'.() -]+?)\)$/);
var regex_12345 = new RegExp(/^([A-z0-9,'.() -]+?) \($/);
var regex_9 = new RegExp(/^([A-z0-9*'. -]+?) \/ ([A-z0-9*'. -]+?) \/ ([A-z0-9*'. -]+?) \/ ([A-z0-9*'. -]+?) \/ ([A-z0-9*'. -]+?) \/ ([A-z0-9*'. -]+?) \/ ([A-z0-9*'. -]+?) \/ ([A-z0-9*'. -]+?) \/ ([A-z0-9*'. -]+?)$/);
var regex_6 = new RegExp(/^([A-z0-9*'. -]+?) \/ ([A-z0-9*'. -]+?) \/ ([A-z0-9*'. -]+?) \/ ([A-z0-9*'. -]+?) \/ ([A-z0-9*'. -]+?) \/ ([A-z0-9*'. -]+?)$/);
var regex_5 = new RegExp(/^([A-z0-9*'. -]+?) \/ ([A-z0-9*'. -]+?) \/ ([A-z0-9*'. -]+?) \/ ([A-z0-9*'. -]+?) \/ ([A-z0-9*'. -]+?)$/);
var regex_4 = new RegExp(/^([A-z0-9*'. -]+?) \/ ([A-z0-9*'. -]+?) \/ ([A-z0-9*'. -]+?) \/ ([A-z0-9*'. -]+?)$/);
var regex_3 = new RegExp(/^([A-z0-9*'. -]+?) \/ ([A-z0-9*'. -]+?) \/ ([A-z0-9*'. -]+?)$/);
var regex_2 = new RegExp(/^([A-z0-9*'. -]+?) \/ ([A-z0-9*'. -]+?)$/);
var regex_1 = new RegExp(/^ ([A-z0-9'() -]+?) \/ $/);
var regex_111 = new RegExp(/^(不開啟|超能力|節拍器|刷新|攻擊)$/);











var t = function (originalStr) {
    var tmp = originalStr.trim();
    if (translations[tmp])
        return translations[tmp];
    if (originalStr.match(regex_chn))
        return originalStr;
    if (originalStr.match(regex_team)) {
        return RegExp.$1 + "的隊伍：";
    }
    if (originalStr.match(regex_item_was)) {
        return  translations[RegExp.$1] + " (之前是" + translations[RegExp.$2] + ")";
    }
    if (originalStr.match(regex_toCommander)) {
         return  "對手的" + trans_from_dict(RegExp.$1) + "作為對對手的" + trans_from_dict(RegExp.$2) + "發號施令者被對手的" + trans_from_dict(RegExp.$3) + "吞下去了！";
    }
    if (originalStr.match(regex_Commander)) {
         return  trans_from_dict(RegExp.$1) + "作為對" + trans_from_dict(RegExp.$2) + "發號施令者被" + trans_from_dict(RegExp.$3) + "吞下去了！";
    }
     if (originalStr.match(regex_youjoined)) {
        return  "你加入了" + RegExp.$1;
    }
    if(originalStr.match(regex_timer_on)){
        return "戰鬥計時器已開啟：玩家時間用盡則判負。(由"+RegExp.$1+"發起)";
    }
    if (originalStr.match(regex_reconnected)) {
        return RegExp.$1 + "重新連接了，他還剩" + RegExp.$2 + "秒。";
    }
    if (originalStr.match(regex_seconds_left2)) {
        return RegExp.$1 + "本回合還剩" + RegExp.$2 + "秒。";
    }
    if (originalStr.match(regex_seconds_left)) {
        return RegExp.$1 + "還剩" + RegExp.$2 + "秒。";
    }
    if (originalStr.match(regex_reset_timer)) {
        return "還剩" + RegExp.$1 + "秒可以重新開啟計時器。";
    }
    if (originalStr.match(regex_tostruggle)) {
         return  "對手的" + trans_from_dict(RegExp.$1) + "沒有可用來施展的招式！";
    }
    if (originalStr.match(regex_struggle)) {
         return  trans_from_dict(RegExp.$1) + "沒有可用來施展的招式！";
    }
    if (originalStr.match(regex_sent_out_first2)) {
        return  "將首先派出" + translations[RegExp.$1] + "和" + translations[RegExp.$2] + "。";
    }
    if (originalStr.match(regex_sent_out_first)) {
        return  "將首先派出" + translations[RegExp.$1] + "。";
    }
    if (originalStr.match(regex_sent_out2)) {
        return  RegExp.$1 + "派出了" + trans_from_dict(RegExp.$2) + "(";
    }
    if (originalStr.match(regex_sent_out)) {
        return  RegExp.$1 + "派出了";
    }
    if (originalStr.match(regex_withdrew)) {
        return  RegExp.$1 + "換下了" + trans_from_dict(RegExp.$2) + "！";
    }
    if (originalStr.match(regex_tolost_health)) {
        return  "(對手的" + trans_from_dict(RegExp.$1) + "失去了 " + RegExp.$2 + "% 的生命值！）";
    }
    if (originalStr.match(regex_lost_health)) {
        return  "(" + trans_from_dict(RegExp.$1) + "失去了 " + RegExp.$2 + "% 的生命值！）";
    }
    if (originalStr.match(regex_tolost_health2)) {
        return  "(對手的" + trans_from_dict(RegExp.$1) + "失去了 ";
    }
    if (originalStr.match(regex_lost_health2)) {
        return   "(" + trans_from_dict(RegExp.$1) + "失去了 ";
    }
    if (originalStr.match(regex_come_back)) {
        return trans_from_dict(RegExp.$1) + "，回來！";
    }
    if (originalStr.match(regex_go)) {
        return "上吧！" + trans_from_dict(RegExp.$1) + "(";
    }
    if (originalStr.match(regex_forfeited)) {
        return RegExp.$1 + "投降了。";
    }
    if (originalStr.match(regex_tomega)) {
        return "對手的" + trans_from_dict(RegExp.$1) + "超級進化成了超級" + translations[RegExp.$2] + "！";
    }
    if (originalStr.match(regex_mega)) {
        return trans_from_dict(RegExp.$1) + "超級進化成了超級" + translations[RegExp.$2] + "！";
    }
    if (originalStr.match(regex_tog6_mega)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "的" + translations[RegExp.$2] + "響應了" + RegExp.$3 + "的Mega手環！";
    }
    if (originalStr.match(regex_g6_mega)) {
        return  trans_from_dict(RegExp.$1) + "的" + translations[RegExp.$2] + "響應了" + RegExp.$3 + "的Mega手環！";
    }
    if (originalStr.match(regex_toafter_taunt)) {
        return "對手的" + trans_from_dict(RegExp.$1) + "受到了挑釁，無法使出" + translations[RegExp.$2].replace("節拍器", "揮指").replace("超能力", "精神強念").replace("刷新", "煥然一新").replace("不開啟", "定身法") + "！";
    }
    if (originalStr.match(regex_after_taunt)) {
        return trans_from_dict(RegExp.$1) + "受到了挑釁，無法使出" + translations[RegExp.$2].replace("節拍器", "揮指").replace("超能力", "精神強念").replace("刷新", "煥然一新").replace("不開啟", "定身法") + "！";
    }
    if (originalStr.match(regex_tocannot_use2)) {
        return "對手的" + trans_from_dict(RegExp.$1) + "無法使出" + translations[RegExp.$2].replace("節拍器", "揮指").replace("超能力", "精神強念").replace("刷新", "煥然一新").replace("不開啟", "定身法") + "！";
    }
    if (originalStr.match(regex_cannot_use2)) {
        return trans_from_dict(RegExp.$1) + "無法使出" + translations[RegExp.$2].replace("節拍器", "揮指").replace("超能力", "精神強念").replace("刷新", "煥然一新").replace("不開啟", "定身法") + "！";
    }
    if (originalStr.match(regex_toeat2)) {
        return "(對手的" + trans_from_dict(RegExp.$1) + "使用了" + translations[RegExp.$2] + "！)";
    }
    if (originalStr.match(regex_eat2)) {
        return "(" + trans_from_dict(RegExp.$1) + "使用了" + translations[RegExp.$2] + "！)";
    }
    if (originalStr.match(regex_toeat)) {
        return "(對手的" + trans_from_dict(RegExp.$1) + "吃掉了" + translations[RegExp.$2] + "！)";
    }
    if (originalStr.match(regex_eat)) {
        return "(" + trans_from_dict(RegExp.$1) + "吃掉了" + translations[RegExp.$2] + "！)";
    }
    if (originalStr.match(regex_move_no_effect)) {
        return "(這對" + trans_from_dict(RegExp.$1) + trans_from_dict(RegExp.$2) + "沒有效果)";
    }
    if (originalStr.match(regex_tomax_guard)) {
        return  "(對手的" + trans_from_dict(RegExp.$1) + "展開了極巨防壁！)";
    }
    if (originalStr.match(regex_max_guard)) {
        return  "(" + trans_from_dict(RegExp.$1) + "展開了極巨防壁！)";
    }
    if (originalStr.match(regex_topointed_stones)) {
        return "尖銳的岩石紮進了對手的" + trans_from_dict(RegExp.$1) + "的體內！";
    }
    if (originalStr.match(regex_pointed_stones)) {
        return "尖銳的岩石紮進了" + trans_from_dict(RegExp.$1) + "的體內！";
    }
    if (originalStr.match(regex_tofuture_sight)) {
        return "對手的" + trans_from_dict(RegExp.$1) + "預知了未來的攻擊！";
    }
    if (originalStr.match(regex_future_sight)) {
        return trans_from_dict(RegExp.$1) + "預知了未來的攻擊！";
    }
    if (originalStr.match(regex_toFutureSight_DoomDesire_attack)) {
        return "對手的" + trans_from_dict(RegExp.$1) + "受到了" + trans_from_dict(RegExp.$2 == "Future Sight" ? "預知未來" : "破滅之願") + "的攻擊！";
    }
    if (originalStr.match(regex_FutureSight_DoomDesire_attack)) {
        return trans_from_dict(RegExp.$1) + "受到了" + trans_from_dict(RegExp.$2 == "Future Sight" ? "預知未來" : "破滅之願") + "的攻擊！";
    }
    if (originalStr.match(regex_totype_change)) {
        return "對手的" +  trans_from_dict(RegExp.$1) + "變成了" + translations[RegExp.$2] + "屬性！";
    }
    if (originalStr.match(regex_type_change)) {
        return  trans_from_dict(RegExp.$1) + "變成了" + translations[RegExp.$2] + "屬性！";
    }
    if (originalStr.match(regex_hit_times)) {
        return "擊中了" + RegExp.$1 + "次！";
    }
    if (originalStr.match(regex_start_battle)) {
        return RegExp.$1 + " 與 " + RegExp.$2 + " 的對戰開始了！";
    }
    if (originalStr.match(regex_touturn)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "回到了" + RegExp.$2 + "的身邊！";
    }
    if (originalStr.match(regex_uturn)) {
        return   trans_from_dict(RegExp.$1) + "回到了" + RegExp.$2 + "的身邊！";
    }
    if (originalStr.match(regex_tomagic_bounce)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "把" + translations[RegExp.$2].replace("不開啟", "定身法") + "反射了回去！";
    }
    if (originalStr.match(regex_magic_bounce)) {
        return  trans_from_dict(RegExp.$1) + "把" + translations[RegExp.$2].replace("不開啟", "定身法") + "反射了回去！";
    }
    if (originalStr.match(regex_togems)) {
        return translations[RegExp.$1] + "提升了對手的" + trans_from_dict(RegExp.$2) + "的威力！";
    }
    if (originalStr.match(regex_gems)) {
        return translations[RegExp.$1] + "提升了" + trans_from_dict(RegExp.$2) + "的威力！";
    }
    if (originalStr.match(regex_battle)) {
        return RegExp.$1 + "想要戰鬥！";
    }
    if (originalStr.match(regex_cancelled)) {
        return RegExp.$1 + "取消了戰鬥。";
    }
     if (originalStr.match(regex_wftcy)) {
        return  "等待" + RegExp.$1 + "挑戰你";
    }
    if (originalStr.match(regex_waitingavailable)) {
        return "等待戰鬥開始" + RegExp.$1;
    }
    if (originalStr.match(regex_waiting)) {
        return "等待" + RegExp.$1;
    }
    if (originalStr.match(regex_accepted)) {
        return RegExp.$1 + "接受了挑戰，對戰開始 «";
    }
    if (originalStr.match(regex_copyofuntitled2)) {
        return  trans_from_dict(RegExp.$1 == "Untitled" ? "無標題 " : "箱子 ") + RegExp.$2 + " - 副本 - 副本";
    }
    if (originalStr.match(regex_copyofuntitled)) {
        return  trans_from_dict(RegExp.$1 == "Untitled" ? "無標題 " : "箱子 ") + RegExp.$2 + " - 副本";
    }
    if (originalStr.match(regex_copyof)) {
        return RegExp.$1 + " - 副本";
    }
    if (originalStr.match(regex_untitled)) {
        return  trans_from_dict(RegExp.$1 == "Untitled" ? "無標題 " : "箱子 ") + RegExp.$2;
    }
    if (originalStr.match(regex_newteam)) {
        return "新的" + RegExp.$1 + "隊伍";
    }
    if (originalStr.match(regex_users2)) {
        return  "(" +RegExp.$1 + "位用戶)";
    }
    if (originalStr.match(regex_users)) {
        return  RegExp.$1 + "位用戶";
    }
    if (originalStr.match(regex_theopposingfainted)) {
        return "對手的" +  trans_from_dict(RegExp.$1) + "倒下了！";
    }
    if (originalStr.match(regex_fainted)) {
        return trans_from_dict(RegExp.$1) + "倒下了！";
    }
    if (originalStr.match(regex_torestored_littlehp_using)) {
        return "對手的" + trans_from_dict(RegExp.$1) + "用" + trans_from_dict(RegExp.$2 == "Leftovers" ? "吃剩的東西" : RegExp.$2 == "Shell Bell"  ? "貝殼之鈴" : "黑色污泥")  + "回復了少許HP。";
    }
    if (originalStr.match(regex_restored_littlehp_using)) {
        return  trans_from_dict(RegExp.$1) + "用" + trans_from_dict(RegExp.$2 == "Leftovers" ? "吃剩的東西" : RegExp.$2 == "Shell Bell"  ? "貝殼之鈴" : "黑色污泥") + "回復了少許HP。";
    }
    if (originalStr.match(regex_wish)) {
        return trans_from_dict(RegExp.$1) + "的祈願實現了！";
    }
    if (originalStr.match(regex_doestaffecttd)) {
        return "對於對手的" + trans_from_dict(RegExp.$1) + "，好像沒有效果......";
    }
    if (originalStr.match(regex_doestaffect)) {
        return "對於" + trans_from_dict(RegExp.$1) + "，好像沒有效果......";
    }
    if (originalStr.match(regex_younoteams)) {
        return "您沒有" + RegExp.$1 + "隊伍";
    }
    if (originalStr.match(regex_youdontha)) {
        return "您沒有任何" + RegExp.$1 + "隊伍";
    }
    if (originalStr.match(regex_theinverted)) {
        return "對手的" + trans_from_dict(RegExp.$1) + "的能力變化顛倒過來了！";
    }
    if (originalStr.match(regex_inverted)) {
        return  trans_from_dict(RegExp.$1) + "的能力變化顛倒過來了！";
    }
    if (originalStr.match(regex_rejectchallenge)) {
        return  RegExp.$1 + "拒絕了挑戰。";
    }
    if (originalStr.match(regex_thesustookto)) {
        return  "替身代替對手的" + trans_from_dict(RegExp.$1) + "承受了攻擊！";
    }
    if (originalStr.match(regex_thesustook)) {
        return  "替身代替" + trans_from_dict(RegExp.$1) + "承受了攻擊！";
    }
    if (originalStr.match(regex_totohbawi)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "受到了來自對手的" + trans_from_dict(RegExp.$2) + "的死纏爛打！";
    }
    if (originalStr.match(regex_tohbawi2)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "受到了來自" + trans_from_dict(RegExp.$2) + "的死纏爛打！";
    }
    if (originalStr.match(regex_tohbawi)) {
        return  trans_from_dict(RegExp.$1) + "受到了來自對手的" + trans_from_dict(RegExp.$2) + "的死纏爛打！";
    }
    if (originalStr.match(regex_hbawi)) {
        return  trans_from_dict(RegExp.$1) + "受到了來自" + trans_from_dict(RegExp.$2) + "的死纏爛打！";
    }
    if (originalStr.match(regex_iseoto)) {
        return  "這對對手的" + trans_from_dict(RegExp.$1) + "效果絕佳！";
    }
    if (originalStr.match(regex_iseo)) {
        return  "這對" + trans_from_dict(RegExp.$1) + "效果絕佳！";
    }
    if (originalStr.match(regex_isnveoto)) {
        return  "這對對手的" + trans_from_dict(RegExp.$1) + "效果不好。";
    }
    if (originalStr.match(regex_isnveo)) {
        return  "這對" + trans_from_dict(RegExp.$1) + "效果不好。";
    }
    if (originalStr.match(regex_achoto)) {
        return  "擊中了對手的" + trans_from_dict(RegExp.$1) + "的要害！";
    }
    if (originalStr.match(regex_acho)) {
        return  "擊中了" + trans_from_dict(RegExp.$1) + "的要害！";
    }
     if (originalStr.match(regex_willswitchin)) {
        return   translations[RegExp.$1] + "將替換" + translations[RegExp.$2] + "上場。";
    }
     if (originalStr.match(regex_challengex)) {
        return  "挑戰" + RegExp.$1;
    }
     if (originalStr.match(regex_uteamsvf)) {
        return  "您的隊伍在" + RegExp.$1 + "規則中合法。";
    }
     if (originalStr.match(regex_Metronome)) {
        return "揮動手指後，使出了" + translations[RegExp.$1].replace("節拍器", "揮指").replace("超能力", "精神強念").replace("刷新", "煥然一新").replace("不開啟", "定身法") + "！";
    }
     if (originalStr.match(regex_toiatbabi)) {
        return  "對手的" + trans_from_dict(RegExp.$1) +"被" + translations[RegExp.$2] + "襲擊了！";
    }
     if (originalStr.match(regex_iatbabi)) {
        return  trans_from_dict(RegExp.$1) +"被" + translations[RegExp.$2] + "襲擊了！";
    }
     if (originalStr.match(regex_toctop2)) {
        return  "對手的" + trans_from_dict(RegExp.$1) +"腐蝕了對手的" + trans_from_dict(RegExp.$2) + "的" + translations[RegExp.$3] + "！";
    }
     if (originalStr.match(regex_toctop)) {
        return  "對手的" + trans_from_dict(RegExp.$1) +"腐蝕了" + trans_from_dict(RegExp.$2) + "的" + translations[RegExp.$3] + "！";
    }
     if (originalStr.match(regex_ctop)) {
        return  trans_from_dict(RegExp.$1) +"腐蝕了對手的" + trans_from_dict(RegExp.$2) + "的" + translations[RegExp.$3] + "！";
    }
     if (originalStr.match(regex_ctop2)) {
        return  trans_from_dict(RegExp.$1) +"腐蝕了" + trans_from_dict(RegExp.$2) + "的" + translations[RegExp.$3] + "！";
    }
     if (originalStr.match(regex_biftato)) {
        return  "但沒能影響到對手的" + trans_from_dict(RegExp.$1) + "！";
    }
     if (originalStr.match(regex_bifta)) {
        return  "但沒能影響到" + trans_from_dict(RegExp.$1) + "！";
    }
    if (originalStr.match(regex_toshpif)) {
        return  "但是，對手的" + trans_from_dict(RegExp.$1) + "的體力是全滿的！";
    }
    if (originalStr.match(regex_shpif)) {
        return  "但是，" + trans_from_dict(RegExp.$1) + "的體力是全滿的！";
    }
    if (originalStr.match(regex_tobiuiz)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "利用Z力量強化了自身的" + translations[RegExp.$2] + "！";
    }
    if (originalStr.match(regex_biuiz)) {
        return  trans_from_dict(RegExp.$1) + "利用Z力量強化了自身的" + translations[RegExp.$2] + "！";
    }
    if (originalStr.match(regex_thwctfto)) {
        return  "治癒願望在對手的" + trans_from_dict(RegExp.$1) + "身上實現了！";
    }
    if (originalStr.match(regex_thwctf)) {
        return  "治癒願望在" + trans_from_dict(RegExp.$1) + "身上實現了！";
    }
     if (originalStr.match(regex_sfwhrtorm)) {
        return  RegExp.$1 + "衷心的祈願傳遞到了對手的" + translations[RegExp.$2] + "那里！";
    }
     if (originalStr.match(regex_sfwhrrm)) {
        return  RegExp.$1 + "衷心的祈願傳遞到了" + translations[RegExp.$2] + "那里！";
    }
     if (originalStr.match(regex_protosynthesisto)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "通過大晴天發動了古代活性！";
    }
     if (originalStr.match(regex_protosynthesis)) {
        return  trans_from_dict(RegExp.$1) + "通過大晴天發動了古代活性！";
    }
     if (originalStr.match(regex_protosynthesisoffto)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "的古代活性的效果消失了！";
    }
     if (originalStr.match(regex_protosynthesisoff)) {
        return  trans_from_dict(RegExp.$1) + "的古代活性的效果消失了！";
    }
     if (originalStr.match(regex_toquarkdrive)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "通過電氣場地發動了夸克充能！";
    }
     if (originalStr.match(regex_quarkdrive)) {
        return  trans_from_dict(RegExp.$1) + "通過電氣場地發動了夸克充能！";
    }
     if (originalStr.match(regex_toquarkdriveoff)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "的夸克充能的效果消失了！";
    }
     if (originalStr.match(regex_quarkdriveoff)) {
        return  trans_from_dict(RegExp.$1) + "的夸克充能的效果消失了！";
    }
     if (originalStr.match(regex_toelectric_seed)) {
        return  "對手的" + trans_from_dict(RegExp.$2) + "用電氣種子" + trans_from_dict(RegExp.$1 == "sharply raised" ? "大幅提升" : RegExp.$1 == "raised"  ? "提升" : "降低") + "了防禦！";
    }
     if (originalStr.match(regex_electric_seed)) {
        return  trans_from_dict(RegExp.$2) + "用電氣種子" + trans_from_dict(RegExp.$1 == "sharply raised" ? "大幅提升" : RegExp.$1 == "raised"  ? "提升" : "降低") + "了防禦！";
    }
     if (originalStr.match(regex_tograssy_seed)) {
        return  "對手的" + trans_from_dict(RegExp.$2) + "用青草種子" + trans_from_dict(RegExp.$1 == "sharply raised" ? "大幅提升" : RegExp.$1 == "raised"  ? "提升" : "降低") + "了防禦！";
    }
     if (originalStr.match(regex_grassy_seed)) {
        return  trans_from_dict(RegExp.$2) + "用青草種子" + trans_from_dict(RegExp.$1 == "sharply raised" ? "大幅提升" : RegExp.$1 == "raised"  ? "提升" : "降低") + "了防禦！";
    }
     if (originalStr.match(regex_topsychic_seed)) {
        return  "對手的" + trans_from_dict(RegExp.$2) + "用精神種子" + trans_from_dict(RegExp.$1 == "sharply raised" ? "大幅提升" : RegExp.$1 == "raised"  ? "提升" : "降低") + "了特防！";
    }
     if (originalStr.match(regex_psychic_seed)) {
        return  trans_from_dict(RegExp.$2) + "用精神種子" + trans_from_dict(RegExp.$1 == "sharply raised" ? "大幅提升" : RegExp.$1 == "raised"  ? "提升" : "降低") + "了特防！";
    }
     if (originalStr.match(regex_tomisty_seed)) {
        return  "對手的" + trans_from_dict(RegExp.$2) + "用薄霧種子" + trans_from_dict(RegExp.$1 == "sharply raised" ? "大幅提升" : RegExp.$1 == "raised"  ? "提升" : "降低") + "了特防！";
    }
     if (originalStr.match(regex_misty_seed)) {
        return  trans_from_dict(RegExp.$2) + "用薄霧種子" + trans_from_dict(RegExp.$1 == "sharply raised" ? "大幅提升" : RegExp.$1 == "raised"  ? "提升" : "降低") + "了特防！";
    }
     if (originalStr.match(regex_tobroke)) {
        return  "突破了對手的" + trans_from_dict(RegExp.$1) + "的保護！";
    }
     if (originalStr.match(regex_broke)) {
        return  "突破了" + trans_from_dict(RegExp.$1) + "的保護！";
    }
     if (originalStr.match(regex_toredcard)) {
        return  trans_from_dict(RegExp.$1) + "猛地向" + trans_from_dict(RegExp.$2) + "出示了紅牌！";
    }
     if (originalStr.match(regex_redcard)) {
        return  trans_from_dict(RegExp.$1) + "猛地向對手的" + trans_from_dict(RegExp.$2) + "出示了紅牌！";
    }
     if (originalStr.match(regex_towindpower)) {
        return  "在順風中對手的" + trans_from_dict(RegExp.$1) + "發動了風力發電！";
    }
     if (originalStr.match(regex_windpower)) {
        return  "在順風中" + trans_from_dict(RegExp.$1) + "發動了風力發電！";
    }
     if (originalStr.match(regex_torevivalblessing)) {
         return  "對手的" +  trans_from_dict(RegExp.$1) + "復活並能夠繼續戰鬥了！";
    }
     if (originalStr.match(regex_revivalblessing)) {
        return  trans_from_dict(RegExp.$1) + "復活並能夠繼續戰鬥了！";
    }
     if (originalStr.match(regex_toclearamulet)) {
         return  "因為清凈墜飾的效果，無法降低對手的" + trans_from_dict(RegExp.$1) + "的能力！";
    }
     if (originalStr.match(regex_clearamulet)) {
         return  "因為清凈墜飾的效果，無法降低" + trans_from_dict(RegExp.$1) + "的能力！";
    }
     if (originalStr.match(regex_toskullbash)) {
         return  "對手的" + trans_from_dict(RegExp.$1) + "把頭縮進去了！";
    }
     if (originalStr.match(regex_skullbash)) {
         return   trans_from_dict(RegExp.$1) + "把頭縮進去了！";
    }
     if (originalStr.match(regex_totofrisk)) {
         return   "對手的" + trans_from_dict(RegExp.$1) + "察覺到了對手的" + trans_from_dict(RegExp.$2) + "的" + translations[RegExp.$3] + "！";
    }
     if (originalStr.match(regex_tofrisk2)) {
         return   "對手的" + trans_from_dict(RegExp.$1) + "察覺到了" + trans_from_dict(RegExp.$2) + "的" + translations[RegExp.$3] + "！";
    }
     if (originalStr.match(regex_tofrisk)) {
         return   trans_from_dict(RegExp.$1) + "察覺到了對手的" + trans_from_dict(RegExp.$2) + "的" + translations[RegExp.$3] + "！";
    }
     if (originalStr.match(regex_frisk)) {
         return   trans_from_dict(RegExp.$1) + "察覺到了" + trans_from_dict(RegExp.$2) + "的" + translations[RegExp.$3] + "！";
    }
     if (originalStr.match(regex_totopsychup)) {
         return   "對手的" + trans_from_dict(RegExp.$1) + "複製了對手的" + trans_from_dict(RegExp.$2) + "的能力變化！";
    }
     if (originalStr.match(regex_topsychup2)) {
         return   "對手的" + trans_from_dict(RegExp.$1) + "複製了" + trans_from_dict(RegExp.$2) + "的能力變化！";
    }
     if (originalStr.match(regex_topsychup)) {
         return   trans_from_dict(RegExp.$1) + "複製了對手的" + trans_from_dict(RegExp.$2) + "的能力變化！";
    }
     if (originalStr.match(regex_psychup)) {
         return   trans_from_dict(RegExp.$1) + "複製了" + trans_from_dict(RegExp.$2) + "的能力變化！";
    }
     if (originalStr.match(regex_toencore)) {
         return   "對手的" + trans_from_dict(RegExp.$1) + "的再來一次狀態解除了！";
    }
     if (originalStr.match(regex_encore)) {
         return   trans_from_dict(RegExp.$1) + "的再來一次狀態解除了！";
    }
     if (originalStr.match(regex_totocurse)) {
        return  "對手的" +  trans_from_dict(RegExp.$1) + "削減了自己的HP，並詛咒了對手的" + trans_from_dict(RegExp.$2) + "！";
    }
     if (originalStr.match(regex_tocurse2)) {
        return  "對手的" +  trans_from_dict(RegExp.$1) + "削減了自己的HP，並詛咒了" + trans_from_dict(RegExp.$2) + "！";
    }
     if (originalStr.match(regex_tocurse)) {
        return  trans_from_dict(RegExp.$1) + "削減了自己的HP，並詛咒了對手的" + trans_from_dict(RegExp.$2) + "！";
    }
     if (originalStr.match(regex_curse)) {
        return  trans_from_dict(RegExp.$1) + "削減了自己的HP，並詛咒了" + trans_from_dict(RegExp.$2) + "！";
    }
     if (originalStr.match(regex_toweakdamageberry)) {
         return   translations[RegExp.$1] + "減輕了對對手的" + trans_from_dict(RegExp.$2) + "造成的傷害！";
    }
     if (originalStr.match(regex_weakdamageberry)) {
         return   translations[RegExp.$1] + "減輕了對" + trans_from_dict(RegExp.$2) + "造成的傷害！";
    }
     if (originalStr.match(regex_celebrate)) {
         return  "恭喜恭喜！" + RegExp.$1 + "！";
    }
    if (originalStr.match(regex_tohpberry)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "用" + translations[RegExp.$2] + "回復了體力！";
    }
    if (originalStr.match(regex_hpberry)) {
        return  trans_from_dict(RegExp.$1) + "用" + translations[RegExp.$2] + "回復了體力！";
    }
    if (originalStr.match(regex_toaquaring)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "通過水環回復了體力！";
    }
    if (originalStr.match(regex_aquaring)) {
        return   trans_from_dict(RegExp.$1) + "通過水環回復了體力！";
    }
    if (originalStr.match(regex_tosalacberry)) {
        return   "對手的"  + trans_from_dict(RegExp.$2) + "用沙鱗果" + trans_from_dict(RegExp.$1 == "sharply raised" ? "大幅提升" : RegExp.$1 == "raised"  ? "提升" : "降低") + "了速度！";
    }
    if (originalStr.match(regex_salacberry)) {
        return   trans_from_dict(RegExp.$2) + "用沙鱗果" + trans_from_dict(RegExp.$1 == "sharply raised" ? "大幅提升" : RegExp.$1 == "raised"  ? "提升" : "降低") + "了速度！";
    }
    if (originalStr.match(regex_toliechiberry)) {
        return   "對手的"  + trans_from_dict(RegExp.$2) + "用枝荔果" + trans_from_dict(RegExp.$1 == "sharply raised" ? "大幅提升" : RegExp.$1 == "raised"  ? "提升" : "降低") + "了攻擊！";
    }
    if (originalStr.match(regex_liechiberry)) {
        return   trans_from_dict(RegExp.$2) + "用枝荔果" + trans_from_dict(RegExp.$1 == "sharply raised" ? "大幅提升" : RegExp.$1 == "raised"  ? "提升" : "降低") + "了攻擊！";
    }
    if (originalStr.match(regex_topetayaberry)) {
        return   "對手的"  + trans_from_dict(RegExp.$2) + "用龍火果" + trans_from_dict(RegExp.$1 == "sharply raised" ? "大幅提升" : RegExp.$1 == "raised"  ? "提升" : "降低") + "了特攻！";
    }
    if (originalStr.match(regex_petayaberry)) {
        return   trans_from_dict(RegExp.$2) + "用龍火果" + trans_from_dict(RegExp.$1 == "sharply raised" ? "大幅提升" : RegExp.$1 == "raised"  ? "提升" : "降低") + "了特攻！";
    }
    if (originalStr.match(regex_toapicotberry)) {
        return   "對手的"  + trans_from_dict(RegExp.$2) + "用杏仔果" + trans_from_dict(RegExp.$1 == "sharply raised" ? "大幅提升" : RegExp.$1 == "raised"  ? "提升" : "降低") + "了特防！";
    }
    if (originalStr.match(regex_apicotberry)) {
        return   trans_from_dict(RegExp.$2) + "用杏仔果" + trans_from_dict(RegExp.$1 == "sharply raised" ? "大幅提升" : RegExp.$1 == "raised"  ? "提升" : "降低") + "了特防！";
    }
    if (originalStr.match(regex_toganlonberry)) {
        return   "對手的"  + trans_from_dict(RegExp.$2) + "用龍睛果" + trans_from_dict(RegExp.$1 == "sharply raised" ? "大幅提升" : RegExp.$1 == "raised"  ? "提升" : "降低") + "了防禦！";
    }
    if (originalStr.match(regex_ganlonberry)) {
        return   trans_from_dict(RegExp.$2) + "用龍睛果" + trans_from_dict(RegExp.$1 == "sharply raised" ? "大幅提升" : RegExp.$1 == "raised"  ? "提升" : "降低") + "了防禦！";
    }
    if (originalStr.match(regex_tomarangaberry)) {
        return   "對手的"  + trans_from_dict(RegExp.$2) + "用香羅果" + trans_from_dict(RegExp.$1 == "sharply raised" ? "大幅提升" : RegExp.$1 == "raised"  ? "提升" : "降低") + "了特防！";
    }
    if (originalStr.match(regex_marangaberry)) {
        return   trans_from_dict(RegExp.$2) + "用香羅果" + trans_from_dict(RegExp.$1 == "sharply raised" ? "大幅提升" : RegExp.$1 == "raised"  ? "提升" : "降低") + "了特防！";
    }
    if (originalStr.match(regex_toLuminous_Moss)) {
        return   "對手的"  + trans_from_dict(RegExp.$2) + "用光苔" + trans_from_dict(RegExp.$1 == "sharply raised" ? "大幅提升" : RegExp.$1 == "raised"  ? "提升" : "降低") + "了特防！";
    }
    if (originalStr.match(regex_Luminous_Moss)) {
        return   trans_from_dict(RegExp.$2) + "用光苔" + trans_from_dict(RegExp.$1 == "sharply raised" ? "大幅提升" : RegExp.$1 == "raised"  ? "提升" : "降低") + "了特防！";
    }
    if (originalStr.match(regex_toKee_Berry)) {
        return   "對手的"  + trans_from_dict(RegExp.$2) + "用亞開果" + trans_from_dict(RegExp.$1 == "sharply raised" ? "大幅提升" : RegExp.$1 == "raised"  ? "提升" : "降低") + "了防禦！";
    }
    if (originalStr.match(regex_Kee_Berry)) {
        return   trans_from_dict(RegExp.$2) + "用亞開果" + trans_from_dict(RegExp.$1 == "sharply raised" ? "大幅提升" : RegExp.$1 == "raised"  ? "提升" : "降低") + "了防禦！";
    }
    if (originalStr.match(regex_toSnowball)) {
        return   "對手的"  + trans_from_dict(RegExp.$2) + "用雪球" + trans_from_dict(RegExp.$1 == "sharply raised" ? "大幅提升" : RegExp.$1 == "raised"  ? "提升" : "降低") + "了攻擊！";
    }
    if (originalStr.match(regex_Snowball)) {
        return   trans_from_dict(RegExp.$2) + "用雪球" + trans_from_dict(RegExp.$1 == "sharply raised" ? "大幅提升" : RegExp.$1 == "raised"  ? "提升" : "降低") + "了攻擊！";
    }
    if (originalStr.match(regex_toAbsorb_Bulb)) {
        return   "對手的"  + trans_from_dict(RegExp.$2) + "用球根" + trans_from_dict(RegExp.$1 == "sharply raised" ? "大幅提升" : RegExp.$1 == "raised"  ? "提升" : "降低") + "了特攻！";
    }
    if (originalStr.match(regex_Absorb_Bulb)) {
        return   trans_from_dict(RegExp.$2) + "用球根" + trans_from_dict(RegExp.$1 == "sharply raised" ? "大幅提升" : RegExp.$1 == "raised"  ? "提升" : "降低") + "了特攻！";
    }
    if (originalStr.match(regex_toCell_Bettery)) {
        return   "對手的"  + trans_from_dict(RegExp.$2) + "用充電電池" + trans_from_dict(RegExp.$1 == "sharply raised" ? "大幅提升" : RegExp.$1 == "raised"  ? "提升" : "降低") + "了攻擊！";
    }
    if (originalStr.match(regex_Cell_Bettery)) {
        return   trans_from_dict(RegExp.$2) + "用充電電池" + trans_from_dict(RegExp.$1 == "sharply raised" ? "大幅提升" : RegExp.$1 == "raised"  ? "提升" : "降低") + "了攻擊！";
    }
    if (originalStr.match(regex_toAdrenaline_Orb)) {
        return   "對手的"  + trans_from_dict(RegExp.$2) + "用膽怯球" + trans_from_dict(RegExp.$1 == "sharply raised" ? "大幅提升" : RegExp.$1 == "raised"  ? "提升" : "降低") + "了速度！";
    }
    if (originalStr.match(regex_Adrenaline_Orb)) {
        return   trans_from_dict(RegExp.$2) + "用膽怯球" + trans_from_dict(RegExp.$1 == "sharply raised" ? "大幅提升" : RegExp.$1 == "raised"  ? "提升" : "降低") + "了速度！";
    }
    if (originalStr.match(regex_tothroatspray)) {
         return   "對手的" + trans_from_dict(RegExp.$2) + "用爽喉噴霧" + trans_from_dict(RegExp.$1 == "sharply raised" ? "大幅提升" : RegExp.$1 == "raised"  ? "提升" : "降低") + "特攻！";
    }
    if (originalStr.match(regex_throatspray)) {
         return   trans_from_dict(RegExp.$2) + "用爽喉噴霧" + trans_from_dict(RegExp.$1 == "sharply raised" ? "大幅提升" : RegExp.$1 == "raised"  ? "提升" : "降低") + "特攻！";
    }
    if (originalStr.match(regex_toclearsmog)) {
         return   "對手的" + trans_from_dict(RegExp.$1) + "的能力變化消失了！";
    }
    if (originalStr.match(regex_tosafety_goggles)) {
         return   "對手的" + trans_from_dict(RegExp.$1) + "因防塵護目鏡而不會受到" + translations[RegExp.$2] + "的攻擊！";
    }
    if (originalStr.match(regex_safety_goggles)) {
         return   trans_from_dict(RegExp.$1) + "因防塵護目鏡而不會受到" + translations[RegExp.$2] + "的攻擊！";
    }
    if (originalStr.match(regex_totohelpinghand)) {
         return   "對手的" + trans_from_dict(RegExp.$1) + "擺出了幫助對手的" + trans_from_dict(RegExp.$2) + "的架勢！";
    }
    if (originalStr.match(regex_tohelpinghand2)) {
         return   "對手的" + trans_from_dict(RegExp.$1) + "擺出了幫助" + trans_from_dict(RegExp.$2) + "的架勢！";
    }
    if (originalStr.match(regex_tohelpinghand)) {
         return   trans_from_dict(RegExp.$1) + "擺出了幫助對手的" + trans_from_dict(RegExp.$2) + "的架勢！";
    }
    if (originalStr.match(regex_helpinghand)) {
         return   trans_from_dict(RegExp.$1) + "擺出了幫助" + trans_from_dict(RegExp.$2) + "的架勢！";
    }
    if (originalStr.match(regex_clearsmog)) {
         return   trans_from_dict(RegExp.$1) + "的能力變化消失了！";
    }
    if (originalStr.match(regex_toharvest)) {
         return   "對手的" + trans_from_dict(RegExp.$1) + "收獲了" + translations[RegExp.$2] + "！";
    }
    if (originalStr.match(regex_harvest)) {
         return   trans_from_dict(RegExp.$1) + "收獲了" + translations[RegExp.$2] + "！";
    }
    if (originalStr.match(regex_toallyswitch)) {
         return   "對手的" + trans_from_dict(RegExp.$1) + "和對手的" + trans_from_dict(RegExp.$2) + "交換了場地！";
    }
    if (originalStr.match(regex_allyswitch)) {
         return   trans_from_dict(RegExp.$1) + "和" + trans_from_dict(RegExp.$2) + "交換了場地！";
    }
    if (originalStr.match(regex_attract)) {
         return   "對手的" + trans_from_dict(RegExp.$2) + "讓" + trans_from_dict(RegExp.$1) + "著迷了！";
    }
    if (originalStr.match(regex_toattract)) {
         return   trans_from_dict(RegExp.$2) + "讓對手的" + trans_from_dict(RegExp.$1) + "著迷了！";
    }
    if (originalStr.match(regex_torecycle)) {
         return   "對手的" + trans_from_dict(RegExp.$1) + "撿來了" + translations[RegExp.$2] + "！";
    }
    if (originalStr.match(regex_recycle)) {
         return   trans_from_dict(RegExp.$1) + "撿來了" + translations[RegExp.$2] + "！";
    }
    if (originalStr.match(regex_tofling)) {
         return   "對手的" + trans_from_dict(RegExp.$1) + "投擲了" + translations[RegExp.$2] + "！";
    }
    if (originalStr.match(regex_fling)) {
         return   trans_from_dict(RegExp.$1) + "投擲了" + translations[RegExp.$2] + "！";
    }
    if (originalStr.match(regex_toobtained)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "獲得了" + translations[RegExp.$2] + "。";
    }
    if (originalStr.match(regex_obtained)) {
        return  trans_from_dict(RegExp.$1) + "獲得了" + translations[RegExp.$2] + "。";
    }
    if (originalStr.match(regex_totolockon)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "鎖定了對手的" + trans_from_dict(RegExp.$2) + "！";
    }
    if (originalStr.match(regex_tolockon2)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "鎖定了" + trans_from_dict(RegExp.$2) + "！";
    }
    if (originalStr.match(regex_tolockon)) {
        return  trans_from_dict(RegExp.$1) + "鎖定了對手的" + trans_from_dict(RegExp.$2) + "！";
    }
    if (originalStr.match(regex_lockon)) {
        return  trans_from_dict(RegExp.$1) + "鎖定了" + trans_from_dict(RegExp.$2) + "！";
    }
    if (originalStr.match(regex_topoison)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "受到了毒的傷害！";
    }
    if (originalStr.match(regex_poison)) {
        return  trans_from_dict(RegExp.$1) + "受到了毒的傷害！";
    }
    if (originalStr.match(regex_toelectromorphosis)) {
        return  "對手的" + trans_from_dict(RegExp.$2) + "受到" + translations[RegExp.$1] + "而充電了！";
    }
    if (originalStr.match(regex_electromorphosis)) {
        return  trans_from_dict(RegExp.$2) + "受到" + translations[RegExp.$1] + "而充電了！";
    }
    if (originalStr.match(regex_torequestpending)) {
        return  "您有" + RegExp.$1 + "個好友請求待處理。";
    }
    if (originalStr.match(regex_requestpending)) {
        return  "您有" + RegExp.$1 + "個已發送的好友請求。";
    }
    if (originalStr.match(regex_blockchallenges)) {
        return  "此用戶'" + RegExp.$1 + "'現在不接受挑戰。";
    }
    if (originalStr.match(regex_removed)) {
        return  "好友" + RegExp.$1 + "已移除。";
    }
    if (originalStr.match(regex_removed2)) {
        return  "您現在不是" + RegExp.$1 + "的好友了。";
    }
    if (originalStr.match(regex_removed3)) {
        return  "您取消了向" + RegExp.$1 + "發送的好友請求。";
    }
    if (originalStr.match(regex_friendrequest)) {
        return  "您已經向" + RegExp.$1 + "發送了好友請求。";
    }
    if (originalStr.match(regex_friendrequest2)) {
        return  "您向" + RegExp.$1 + "發送了好友請求！";
    }
    if (originalStr.match(regex_friendrequest3)) {
        return  "您向" + RegExp.$1 + "發送了好友請求。";
    }
    if (originalStr.match(regex_acceptfriendrequest)) {
        return  "您接受了" + RegExp.$1 + "的好友請求。";
    }
    if (originalStr.match(regex_denyfriendrequest)) {
        return  "您拒絕了" + RegExp.$1 + "的好友請求。";
    }
    if (originalStr.match(regex_donothavefriendrequest)) {
        return  "您沒有來自" + RegExp.$1 + "的好友請求。";
    }
    if (originalStr.match(regex_donothavefriendrequest2)) {
        return  "您沒有來自" + RegExp.$1 + "的請求。";
    }
    if (originalStr.match(regex_accuracy)) {
        return  "命中: " + RegExp.$1;
    }
    if (originalStr.match(regex_basepower_double2)) {
            return   "對"+ translations[RegExp.$1] + "的威力: " + RegExp.$2 + " 至 " + RegExp.$3;
    }
    if (originalStr.match(regex_basepower_double)) {
        return  "對" + translations[RegExp.$1] + "的威力: " + RegExp.$2;
    }
    if (originalStr.match(regex_basepower2)) {
            return  "威力: " + RegExp.$1 + " 至 " + RegExp.$2;
    }
    if (originalStr.match(regex_basepower)) {
        return  "威力: " + RegExp.$1;
    }
    if (originalStr.match(regex_disconnected)) {
        return  RegExp.$1 + "斷開了連接，他還有" + RegExp.$2 + "秒的時間重新連接！";
    }
    if (originalStr.match(regex_disconnected2)) {
        return  RegExp.$1 + "斷開了連接，他還有一分鐘的時間重新連接！";
    }
    if (originalStr.match(regex_disconnected3)) {
        return  RegExp.$1 + "斷開了連接！";
    }
    if (originalStr.match(regex_usemove3)) {
        return  translations[RegExp.$1] + "將對你的" + translations[RegExp.$3] + "使用" + translations[RegExp.$2].replace("節拍器", "揮指").replace("超能力", "精神強念").replace("刷新", "煥然一新").replace("不開啟", "定身法") + "。";
    }
    if (originalStr.match(regex_usemove2)) {
        return  translations[RegExp.$1] + "將對" + translations[RegExp.$3] + "使用" + translations[RegExp.$2].replace("節拍器", "揮指").replace("超能力", "精神強念").replace("刷新", "煥然一新").replace("不開啟", "定身法") + "。";
    }
    if (originalStr.match(regex_usemove)) {
        return  translations[RegExp.$1] + "將使用" + translations[RegExp.$2].replace("節拍器", "揮指").replace("超能力", "精神強念").replace("刷新", "煥然一新").replace("不開啟", "定身法") + "。";
    }
    if (originalStr.match(regex_reconnecte)) {
        return  RegExp.$1 + "還有" + RegExp.$2 + "秒的時間重新連接！";
    }
    if (originalStr.match(regex_toskyattack)) {
        return   "強光包圍了對手的" + trans_from_dict(RegExp.$1) + "！";
    }
    if (originalStr.match(regex_skyattack)) {
        return   "強光包圍了" + trans_from_dict(RegExp.$1) + "！";
    }
    if (originalStr.match(regex_todisable)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "因定身法而無法使出" + translations[RegExp.$2].replace("節拍器", "揮指").replace("超能力", "精神強念").replace("刷新", "煥然一新").replace("不開啟", "定身法") + "！";
    }
    if (originalStr.match(regex_disable)) {
        return   trans_from_dict(RegExp.$1) + "因定身法而無法使出" + translations[RegExp.$2].replace("節拍器", "揮指").replace("超能力", "精神強念").replace("刷新", "煥然一新").replace("不開啟", "定身法") + "！";
    }
    if (originalStr.match(regex_todisable2)) {
        return   "封住了對手的" + trans_from_dict(RegExp.$1) + "的" + translations[RegExp.$2].replace("節拍器", "揮指").replace("超能力", "精神強念").replace("刷新", "煥然一新").replace("不開啟", "定身法") + "！";
    }
    if (originalStr.match(regex_disable2)) {
        return   "封住了" + trans_from_dict(RegExp.$1) + "的" + translations[RegExp.$2].replace("節拍器", "揮指").replace("超能力", "精神強念").replace("刷新", "煥然一新").replace("不開啟", "定身法") + "！";
    }
    if (originalStr.match(regex_last10team)) {
        return  RegExp.$1 + "的最近10個隊伍";
    }
    if (originalStr.match(regex_uploadedon)) {
        return  "上傳時間: " + RegExp.$1;
    }
    if (originalStr.match(regex_format)) {
        return  "規則: " + RegExp.$1;
    }
    if (originalStr.match(regex_views)) {
        return  "查看數: " + RegExp.$1;
    }
    if (originalStr.match(regex_teampassword)) {
        return  "隊伍已設置為私人。密碼: " + RegExp.$1;
    }
    if (originalStr.match(regex_toskydrop)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "把" + trans_from_dict(RegExp.$2) + "帶上了天空！";
    }
    if (originalStr.match(regex_skydrop)) {
        return   trans_from_dict(RegExp.$1) + "把對手的" + trans_from_dict(RegExp.$2) + "帶上了天空！";
    }
    if (originalStr.match(regex_inactivity)) {
        return  RegExp.$1 + "因超時而判負。";
    }
    if (originalStr.match(regex_deleted)) {
        return  RegExp.$1 + "已刪除。";
    }
    if (originalStr.match(regex_nextdamage)) {
        return  " 下次傷害：" + RegExp.$1;
    }
    if (originalStr.match(regex_item_was_held_up)) {
        return    translations[RegExp.$1] + " (" + trans_from_dict(RegExp.$2 == "stolen" ? "竊取" : RegExp.$2 == "tricked"  ? "戲法" : RegExp.$2 == "disturbed"  ? "靈騷" : RegExp.$2 == "frisked"  ? "察覺" : RegExp.$2 == "found" ? "回收": "收獲") + "; 紅牌舉起了)";
    }
    if (originalStr.match(regex_item_was_popped)) {
        return    translations[RegExp.$1] + " (" + trans_from_dict(RegExp.$2 == "stolen" ? "竊取" : RegExp.$2 == "tricked"  ? "戲法" : RegExp.$2 == "disturbed"  ? "靈騷" : RegExp.$2 == "frisked"  ? "察覺" : RegExp.$2 == "found" ? "回收": "收獲") + "; 氣球破裂了)";
    }
    if (originalStr.match(regex_item_was_eaten)) {
        return    translations[RegExp.$1] + " (" + trans_from_dict(RegExp.$2 == "stolen" ? "竊取" : RegExp.$2 == "tricked"  ? "戲法" : RegExp.$2 == "disturbed"  ? "靈騷" : RegExp.$2 == "frisked"  ? "察覺" : RegExp.$2 == "found" ? "回收": "收獲") + "; " + translations[RegExp.$3]  + "被吃掉了)";
    }
    if (originalStr.match(regex_item_was_consumed)) {
        return    translations[RegExp.$1] + " (" + trans_from_dict(RegExp.$2 == "stolen" ? "竊取" : RegExp.$2 == "tricked"  ? "戲法" : RegExp.$2 == "disturbed"  ? "靈騷" : RegExp.$2 == "frisked"  ? "察覺" : RegExp.$2 == "found" ? "回收": "收獲") + "; " + translations[RegExp.$3]  + "消失了)";
    }
    if (originalStr.match(regex_item_was_stolen)) {
        return    translations[RegExp.$1] + " (" + trans_from_dict(RegExp.$2 == "stolen" ? "竊取" : RegExp.$2 == "tricked"  ? "戲法" : RegExp.$2 == "disturbed"  ? "靈騷" : RegExp.$2 == "frisked"  ? "察覺" : RegExp.$2 == "found" ? "回收": "收獲") + "; " + translations[RegExp.$3]  + "被偷走了)";
    }
    if (originalStr.match(regex_item_was_flung)) {
        return    translations[RegExp.$1] + " (" + trans_from_dict(RegExp.$2 == "stolen" ? "竊取" : RegExp.$2 == "tricked"  ? "戲法" : RegExp.$2 == "disturbed"  ? "靈騷" : RegExp.$2 == "frisked"  ? "察覺" : RegExp.$2 == "found" ? "回收": "收獲") + "; " + translations[RegExp.$3]  + "被投擲了)";
    }
    if (originalStr.match(regex_item_was_knockedoff)) {
        return    translations[RegExp.$1] + " (" + trans_from_dict(RegExp.$2 == "stolen" ? "竊取" : RegExp.$2 == "tricked"  ? "戲法" : RegExp.$2 == "disturbed"  ? "靈騷" : RegExp.$2 == "frisked"  ? "察覺" : RegExp.$2 == "found" ? "回收": "收獲") + "; " + translations[RegExp.$3]  + "被拍落了)";
    }
    if (originalStr.match(regex_item_was_was)) {
        return    translations[RegExp.$1] + " (" + trans_from_dict(RegExp.$2 == "stolen" ? "竊取" : RegExp.$2 == "tricked"  ? "戲法" : RegExp.$2 == "disturbed"  ? "靈騷" : RegExp.$2 == "frisked"  ? "察覺" : RegExp.$2 == "found" ? "回收": "收獲") + "; 之前是" + translations[RegExp.$3]  + ")";
    }
    if (originalStr.match(regex_item_held_up)) {
        return   translations[RegExp.$1] + " (紅牌舉起了)";
    }
    if (originalStr.match(regex_item_popped)) {
        return   translations[RegExp.$1] + " (氣球破裂了)";
    }
    if (originalStr.match(regex_item_eaten)) {
        return   translations[RegExp.$1] + " (" + translations[RegExp.$2] + "被吃掉了)";
    }
    if (originalStr.match(regex_item_consumed)) {
        return    translations[RegExp.$1] + " (" + translations[RegExp.$2] + "消失了)" ;
    }
    if (originalStr.match(regex_item_knockedoff)) {
        return   translations[RegExp.$1] + " (" + translations[RegExp.$2] + "被拍落了)";
    }
    if (originalStr.match(regex_item_flung)) {
        return   translations[RegExp.$1] + " (" + translations[RegExp.$2] + "被投擲了)";
    }
    if (originalStr.match(regex_item_stolen2)) {
        return   translations[RegExp.$1] + " (" + translations[RegExp.$2] + "被偷走了)";
    }
    if (originalStr.match(regex_item_incinerated)) {
        return   translations[RegExp.$1] + " (" + translations[RegExp.$2] + "被燒掉了)";
    }
    if (originalStr.match(regex_item_stolen)) {
        return   translations[RegExp.$1] + " (竊取)";
    }
    if (originalStr.match(regex_item_found)) {
        return   translations[RegExp.$1] + " (回收)";
    }
    if (originalStr.match(regex_item_harvested)) {
        return   translations[RegExp.$1] + " (收獲)";
    }
    if (originalStr.match(regex_item_tricked)) {
        return   translations[RegExp.$1] + " (戲法)";
    }
    if (originalStr.match(regex_item_disturbed)) {
        return   translations[RegExp.$1] + " (靈騷)";
    }
    if (originalStr.match(regex_item_frisked)) {
        return   translations[RegExp.$1] + " (察覺)";
    }
    if (originalStr.match(regex_base)) {
        return   translations[RegExp.$1] + " (原本的特性: " + translations[RegExp.$2] + ")";
    }
    if (originalStr.match(regex_toonly)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "無法使出這個招式！";
    }
    if (originalStr.match(regex_only)) {
        return   trans_from_dict(RegExp.$1) + "無法使出這個招式！";
    }
    if (originalStr.match(regex_terastallize_use_double_your)) {
        return   translations[RegExp.$1] + "將太晶化，然後對你的" +  translations[RegExp.$3] + "使用" + translations[RegExp.$2].replace("節拍器", "揮指").replace("超能力", "精神強念").replace("刷新", "煥然一新").replace("不開啟", "定身法") + "。";
    }
    if (originalStr.match(regex_dynamax_use_double_your)) {
        return   translations[RegExp.$1] + "將極巨化，然後對你的" + translations[RegExp.$3] + "使用" + translations[RegExp.$2].replace("節拍器", "揮指").replace("超能力", "精神強念").replace("刷新", "煥然一新").replace("不開啟", "定身法") + "。";
    }
    if (originalStr.match(regex_megaevolve_use_double_your)) {
        return   translations[RegExp.$1] + "將超級進化，然後對你的" + translations[RegExp.$3] + "使用" + translations[RegExp.$2].replace("節拍器", "揮指").replace("超能力", "精神強念").replace("刷新", "煥然一新").replace("不開啟", "定身法") + "。";
    }
    if (originalStr.match(regex_terastallize_use_double)) {
        return   translations[RegExp.$1] + "將太晶化，然後對" +  translations[RegExp.$3] + "使用" + translations[RegExp.$2].replace("節拍器", "揮指").replace("超能力", "精神強念").replace("刷新", "煥然一新").replace("不開啟", "定身法") + "。";
    }
    if (originalStr.match(regex_dynamax_use_double)) {
        return   translations[RegExp.$1] + "將極巨化，然後對" + translations[RegExp.$3] + "使用" + translations[RegExp.$2].replace("節拍器", "揮指").replace("超能力", "精神強念").replace("刷新", "煥然一新").replace("不開啟", "定身法") + "。";
    }
    if (originalStr.match(regex_megaevolve_use_double)) {
        return   translations[RegExp.$1] + "將超級進化，然後對" + translations[RegExp.$3] + "使用" + translations[RegExp.$2].replace("節拍器", "揮指").replace("超能力", "精神強念").replace("刷新", "煥然一新").replace("不開啟", "定身法") + "。";
    }
    if (originalStr.match(regex_terastallize_use)) {
        return   translations[RegExp.$1] + "將太晶化，然後使用"+ translations[RegExp.$2].replace("節拍器", "揮指").replace("超能力", "精神強念").replace("刷新", "煥然一新").replace("不開啟", "定身法") + "。";
    }
    if (originalStr.match(regex_dynamax_use)) {
        return   translations[RegExp.$1] + "將極巨化，然後使用"+ translations[RegExp.$2].replace("節拍器", "揮指").replace("超能力", "精神強念").replace("刷新", "煥然一新").replace("不開啟", "定身法") + "。";
    }
    if (originalStr.match(regex_megaevolve_use)) {
        return   translations[RegExp.$1] + "將超級進化，然後使用"+ translations[RegExp.$2].replace("節拍器", "揮指").replace("超能力", "精神強念").replace("刷新", "煥然一新").replace("不開啟", "定身法") + "。";
    }
    if (originalStr.match(regex_tonatural_cure)) {
        return   "(對手的" + trans_from_dict(RegExp.$1) + "通過自然回復治癒了異常狀態！)";
    }
    if (originalStr.match(regex_natural_cure)) {
        return   "(" + trans_from_dict(RegExp.$1) + "通過自然回復治癒了異常狀態！)";
    }
    if (originalStr.match(regex_toacquired)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "的特性變成" + translations[RegExp.$2] + "了！";
    }
    if (originalStr.match(regex_acquired)) {
        return   trans_from_dict(RegExp.$1) + "的特性變成" + translations[RegExp.$2] + "了！";
    }
    if (originalStr.match(regex_namestarting)) {
        return  "由於有玩家的名字以'" + RegExp.$1 + "'開頭，所以這場戰鬥公開了。";
    }
    if (originalStr.match(regex_toComplete_Forme)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "變成了完全體形態！";
    }
    if (originalStr.match(regex_Complete_Forme)) {
        return  trans_from_dict(RegExp.$1) + "變成了完全體形態！";
    }
    if (originalStr.match(regex_totransformed_into)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "變成了" + translations[RegExp.$2] + "！";
    }
    if (originalStr.match(regex_transformed_into)) {
        return  trans_from_dict(RegExp.$1) + "變成了" + translations[RegExp.$2] + "！";
    }
    if (originalStr.match(regex_wouldtake)) {
        return  "如果失去特性，將受到 " + RegExp.$1 + " 傷害";
    }
    if (originalStr.match(regex_totofollwed)) {
        return  "根據對手的" + trans_from_dict(RegExp.$2) + "的指示，對手的" + trans_from_dict(RegExp.$1) + "使出了招式！";
    }
    if (originalStr.match(regex_tofollwed2)) {
        return  "根據對手的" + trans_from_dict(RegExp.$2) + "的指示，" + trans_from_dict(RegExp.$1) + "使出了招式！";
    }
    if (originalStr.match(regex_tofollwed)) {
        return  "根據" + trans_from_dict(RegExp.$2) + "的指示，對手的" + trans_from_dict(RegExp.$1) + "使出了招式！";
    }
    if (originalStr.match(regex_follwed)) {
        return  "根據" + trans_from_dict(RegExp.$2) + "的指示，" + trans_from_dict(RegExp.$1) + "使出了招式！";
    }
    if (originalStr.match(regex_suspect)) {
        if (translations[RegExp.$2])
        return  RegExp.$1 + "正在進行" + translations[RegExp.$2] + "的可疑測試！有關如何參與測試的信息，請查看 ";
        else
        return  RegExp.$1 + "正在進行" + RegExp.$2 + "的可疑測試！有關如何參與測試的信息，請查看 ";
    }
    if (originalStr.match(regex_changed)) {
        return  "(形態改變: " + translations[RegExp.$1] + ")";
    }
    if (originalStr.match(regex_turnsasleep)) {
        return  "  睡眠回合數: " + RegExp.$1;
    }
    if (originalStr.match(regex_switchto)) {
        return  translations[RegExp.$1] + " 將交換:";
    }
    if (originalStr.match(regex_online)) {
        return   " 在線 " + RegExp.$1;
    }
    if (originalStr.match(regex_offline)) {
        return   " 離線 " + RegExp.$1;
    }
    if (originalStr.match(regex_toterastallized)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "太晶化變成了" + translations[RegExp.$2] + "屬性！";
    }
    if (originalStr.match(regex_terastallized)) {
        return   trans_from_dict(RegExp.$1) + "太晶化變成了" + translations[RegExp.$2] + "屬性！";
    }
    if (originalStr.match(regex_topressure)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "釋放著壓迫感！";
    }
    if (originalStr.match(regex_pressure)) {
        return   trans_from_dict(RegExp.$1) + "釋放著壓迫感！";
    }
    if (originalStr.match(regex_toseeded)) {
        return   "將種子種殖在了對手的" + trans_from_dict(RegExp.$1) + "身上！";
    }
    if (originalStr.match(regex_seeded)) {
        return   "將種子種殖在了" + trans_from_dict(RegExp.$1) + "身上！";
    }
    if (originalStr.match(regex_topoisoned)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + trans_from_dict(RegExp.$2 == "poisoned" ? "中毒了" : "中劇毒了") + "！";
    }
    if (originalStr.match(regex_poisoned)) {
        return  trans_from_dict(RegExp.$1) + trans_from_dict(RegExp.$2 == "poisoned" ? "中毒了" : "中劇毒了") + "！";
    }
    if (originalStr.match(regex_toslept)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "睡著了，並且變得精力充沛！";
    }
    if (originalStr.match(regex_slept)) {
        return  trans_from_dict(RegExp.$1) + "睡著了，並且變得精力充沛！";
    }
    if (originalStr.match(regex_toasleep)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "正在呼呼大睡。";
    }
    if (originalStr.match(regex_asleep)) {
        return  trans_from_dict(RegExp.$1) + "正在呼呼大睡。";
    }
    if (originalStr.match(regex_towoke_up)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "醒過來了！";
    }
    if (originalStr.match(regex_woke_up)) {
        return  trans_from_dict(RegExp.$1) + "醒過來了！";
    }
    if (originalStr.match(regex_toz_power)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "讓Z力量籠罩了全身！";
    }
    if (originalStr.match(regex_z_power)) {
        return  trans_from_dict(RegExp.$1) + "讓Z力量籠罩了全身！";
    }
    if (originalStr.match(regex_toz_move)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "開始釋放全力的Z招式！";
    }
    if (originalStr.match(regex_z_move)) {
        return  trans_from_dict(RegExp.$1) + "開始釋放全力的Z招式！";
    }
    if (originalStr.match(regex_toleech_seed)) {
        return  "寄生植物奪取了對手的" + trans_from_dict(RegExp.$1) + "的體力！";
    }
    if (originalStr.match(regex_leech_seed)) {
        return  "寄生植物奪取了" + trans_from_dict(RegExp.$1) + "的體力！";
    }
    if (originalStr.match(regex_toradiating_aura)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "釋放著" + trans_from_dict(RegExp.$2 == "dark" ? "暗黑" : "妖精") + "氣場！";
    }
    if (originalStr.match(regex_radiating_aura)) {
        return  trans_from_dict(RegExp.$1) + "釋放著" + trans_from_dict(RegExp.$2 == "dark" ? "暗黑" : "妖精") + "氣場！";
    }
    if (originalStr.match(regex_toradiating_aura2)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "釋放著" + trans_from_dict(RegExp.$2 == "bursting" ? "濺射" : "熾熱") + "氣場！";
    }
    if (originalStr.match(regex_radiating_aura2)) {
        return  trans_from_dict(RegExp.$1) + "釋放著" + trans_from_dict(RegExp.$2 == "bursting" ? "濺射" : "熾熱") + "氣場！";
    }
    if (originalStr.match(regex_toprotected)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "守護住了自己！";
    }
    if (originalStr.match(regex_protected)) {
        return  trans_from_dict(RegExp.$1) + "守護住了自己！";
    }
    if (originalStr.match(regex_totaunt)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "中了挑釁！";
    }
    if (originalStr.match(regex_taunt)) {
        return  trans_from_dict(RegExp.$1) + "中了挑釁！";
    }
    if (originalStr.match(regex_topumped)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "現在幹勁十足！";
    }
    if (originalStr.match(regex_pumped)) {
        return  trans_from_dict(RegExp.$1) + "現在幹勁十足！";
    }
    if (originalStr.match(regex_toavoided)) {
        return  "沒有擊中對手的" + trans_from_dict(RegExp.$1) + "！";
    }
    if (originalStr.match(regex_avoided)) {
        return  "沒有擊中" + trans_from_dict(RegExp.$1) + "！";
    }
    if (originalStr.match(regex_togrew_drowsy)) {
        return  "讓對手的" + trans_from_dict(RegExp.$1) + "產生睡意了！";
    }
    if (originalStr.match(regex_grew_drowsy)) {
        return  "讓" + trans_from_dict(RegExp.$1) + "產生睡意了！";
    }
    if (originalStr.match(regex_tofell_straight_down)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "被擊落，掉到了地面！";
    }
    if (originalStr.match(regex_fell_straight_down)) {
        return  trans_from_dict(RegExp.$1) + "被擊落，掉到了地面！";
    }
    if (originalStr.match(regex_tomust_encore)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "接受了再來一次！";
    }
    if (originalStr.match(regex_must_encore)) {
        return  trans_from_dict(RegExp.$1) + "接受了再來一次！";
    }
    if (originalStr.match(regex_toencore_ended)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "的再來一次狀態解除了！";
    }
    if (originalStr.match(regex_encore_ended)) {
        return  trans_from_dict(RegExp.$1) + "的再來一次狀態解除了！";
    }
    if (originalStr.match(regex_toshook_off_taunt)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "從挑釁狀態中解除了！";
    }
    if (originalStr.match(regex_shook_off_taunt)) {
        return  trans_from_dict(RegExp.$1) + "從挑釁狀態中解除了！";
    }
    if (originalStr.match(regex_tovortex_fieryvortex)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "被困在了" + trans_from_dict(RegExp.$2 == "vortex" ? "漩渦" : "火焰漩渦") + "之中！";
    }
    if (originalStr.match(regex_vortex_fieryvortex)) {
        return  trans_from_dict(RegExp.$1) + "被困在了" + trans_from_dict(RegExp.$2 == "vortex" ? "漩渦" : "火焰漩渦") + "之中！";
    }

    if (originalStr.match(regex_toburned_frozen)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + trans_from_dict(RegExp.$2 == "burned" ? "灼傷了" : "凍住了") + "！";
    }
    if (originalStr.match(regex_burned_frozen)) {
        return  trans_from_dict(RegExp.$1) + trans_from_dict(RegExp.$2 == "burned" ? "灼傷了" : "凍住了") + "！";
    }
    if (originalStr.match(regex_tospikes)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "受到了撒菱的傷害！";
    }
    if (originalStr.match(regex_spikes)) {
        return  trans_from_dict(RegExp.$1) + "受到了撒菱的傷害！";
    }
    if (originalStr.match(regex_tocuredof_freeze_burn)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "的" + trans_from_dict(RegExp.$2 == "Freeze" ? "冰凍" : "灼傷") + "被治癒了！";
    }
    if (originalStr.match(regex_curedof_freeze_burn)) {
        return  trans_from_dict(RegExp.$1) + "的" + trans_from_dict(RegExp.$2 == "Freeze" ? "冰凍" : "灼傷") + "被治癒了！";
    }
    if (originalStr.match(regex_tocuredof_sleep_paralysis)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "的" + trans_from_dict(RegExp.$2 == "Sleep" ? "睡眠" : "麻痹") + "被治癒了！";
    }
    if (originalStr.match(regex_curedof_sleep_paralysis)) {
        return  trans_from_dict(RegExp.$1) + "的" + trans_from_dict(RegExp.$2 == "Sleep" ? "睡眠" : "麻痹") + "被治癒了！";
    }
    if (originalStr.match(regex_toput_in_substitute)) {
         return   "對手的" + trans_from_dict(RegExp.$1) + "的替身出現了！";
    }
    if (originalStr.match(regex_put_in_substitute)) {
         return   trans_from_dict(RegExp.$1) + "的替身出現了！";
    }
    if (originalStr.match(regex_tohp_restored)) {
         return   "對手的" + trans_from_dict(RegExp.$1) + "的體力回復了。";
    }
    if (originalStr.match(regex_hp_restored)) {
         return   trans_from_dict(RegExp.$1) + "的體力回復了。";
    }
    if (originalStr.match(regex_tohp_restored2)) {
        return "對手的" + trans_from_dict(RegExp.$1) + "的體力回復了！";
    }
    if (originalStr.match(regex_hp_restored2)) {
        return trans_from_dict(RegExp.$1) + "的體力回復了！";
    }
    if (originalStr.match(regex_tohp_restored3)) {
        return "對手的" + trans_from_dict(RegExp.$1) + "通過Z力量回復了體力！";
    }
    if (originalStr.match(regex_hp_restored3)) {
        return  trans_from_dict(RegExp.$1) + "通過Z力量回復了體力！";
    }
    if (originalStr.match(regex_totransformed)) {
         return   "對手的" + trans_from_dict(RegExp.$1) + "的樣子發生了變化！";
    }
    if (originalStr.match(regex_transformed)) {
         return   trans_from_dict(RegExp.$1) + "的樣子發生了變化！";
    }
    if (originalStr.match(regex_toconfused2)) {
         return   "對手的" + trans_from_dict(RegExp.$1) + "正在混亂中！";
    }
    if (originalStr.match(regex_confused2)) {
         return   trans_from_dict(RegExp.$1) + "正在混亂中！";
    }
    if (originalStr.match(regex_toconfused)) {
         return   "對手的" + trans_from_dict(RegExp.$1) + "混亂了！";
    }
    if (originalStr.match(regex_confused)) {
         return   trans_from_dict(RegExp.$1) + "混亂了！";
    }
    if (originalStr.match(regex_tofell_asleep)) {
         return   "對手的" + trans_from_dict(RegExp.$1) + "睡著了！";
    }
    if (originalStr.match(regex_fell_asleep)) {
         return   trans_from_dict(RegExp.$1) + "睡著了！";
    }
    if (originalStr.match(regex_tocanno_longer_escape)) {
         return   "對手的" + trans_from_dict(RegExp.$1) + "無法逃走了！";
    }
    if (originalStr.match(regex_canno_longer_escape)) {
         return   trans_from_dict(RegExp.$1) + "無法逃走了！";
    }
    if (originalStr.match(regex_tomist_safeguard)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "受到了" + trans_from_dict(RegExp.$2 == "the mist" ? "白霧" : "神秘守護") + "的保護！";
    }
    if (originalStr.match(regex_mist_safeguard)) {
        return   trans_from_dict(RegExp.$1) + "受到了" + trans_from_dict(RegExp.$2 == "the mist" ? "白霧" : "神秘守護") + "的保護！";
    }
    if (originalStr.match(regex_toprotosynthesis_quarkdrive)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "通過驅勁能量發動了" + trans_from_dict(RegExp.$2 == "Protosynthesis" ? "古代活性" : "夸克充能") + "！";
    }
    if (originalStr.match(regex_protosynthesis_quarkdrive)) {
        return   trans_from_dict(RegExp.$1) + "通過驅勁能量發動了" + trans_from_dict(RegExp.$2 == "Protosynthesis" ? "古代活性" : "夸克充能") + "！";
    }
    if (originalStr.match(regex_toair_light)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "被" + trans_from_dict(RegExp.$2 == "freezing air" ? "冷凍的空氣" : "冷光") + "包圍了！";
    }
    if (originalStr.match(regex_air_light)) {
        return   trans_from_dict(RegExp.$1) + "被" + trans_from_dict(RegExp.$2 == "freezing air" ? "冷凍的空氣" : "冷光") + "包圍了！";
    }
    if (originalStr.match(regex_todryskin_solarpower)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "因" + trans_from_dict(RegExp.$2 == "Dry Skin" ? "幹燥皮膚" : "太陽能量") + "而受到了傷害。";
    }
    if (originalStr.match(regex_dryskin_solarpower)) {
        return   trans_from_dict(RegExp.$1) + "因" + trans_from_dict(RegExp.$2 == "Dry Skin" ? "幹燥皮膚" : "太陽能量") + "而受到了傷害。";
    }
    if (originalStr.match(regex_todrowsing)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "處於半夢半醒狀態！";
    }
    if (originalStr.match(regex_drowsing)) {
        return   trans_from_dict(RegExp.$1) + "處於半夢半醒狀態！";
    }
    if (originalStr.match(regex_tobreaks_mold)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "打破了常規！";
    }
    if (originalStr.match(regex_breaks_mold)) {
        return   trans_from_dict(RegExp.$1) + "打破了常規！";
    }
    if (originalStr.match(regex_toendured_hit)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "挺住了攻擊！";
    }
    if (originalStr.match(regex_endured_hit)) {
        return   trans_from_dict(RegExp.$1) + "挺住了攻擊！";
    }
    if (originalStr.match(regex_toendured_hit2)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "挺住了攻擊！";
    }
    if (originalStr.match(regex_endured_hit2)) {
        return   trans_from_dict(RegExp.$1) + "挺住了攻擊！";
    }
    if (originalStr.match(regex_toburned_itself)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "燃盡了自身！";
    }
    if (originalStr.match(regex_burned_itself)) {
        return   trans_from_dict(RegExp.$1) + "燃盡了自身！";
    }
    if (originalStr.match(regex_toair_balloon)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "靠著氣球浮在了空中！";
    }
    if (originalStr.match(regex_air_balloon)) {
        return   trans_from_dict(RegExp.$1) + "靠著氣球浮在了空中！";
    }
    if (originalStr.match(regex_toalready_confused)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "已經混亂了！";
    }
    if (originalStr.match(regex_already_confused)) {
        return   trans_from_dict(RegExp.$1) + "已經混亂了！";
    }
    if (originalStr.match(regex_toswirling_magma)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "被困在了熔岩風暴之中！";
    }
    if (originalStr.match(regex_swirling_magma)) {
        return   trans_from_dict(RegExp.$1) + "被困在了熔岩風暴之中！";
    }
    if (originalStr.match(regex_toquicksand)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "陷入了流沙地獄！";
    }
    if (originalStr.match(regex_quicksand)) {
        return   trans_from_dict(RegExp.$1) + "陷入了流沙地獄！";
    }
    if (originalStr.match(regex_toconfused_fatigue)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "因精疲力盡而混亂了！";
    }
    if (originalStr.match(regex_confused_fatigue)) {
        return   trans_from_dict(RegExp.$1) + "因精疲力盡而混亂了！";
    }
    if (originalStr.match(regex_tobecame_confused)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "混亂了！";
    }
    if (originalStr.match(regex_became_confused)) {
        return   trans_from_dict(RegExp.$1) + "混亂了！";
    }
    if (originalStr.match(regex_toprevented_healing)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "的回復行為被封住了！";
    }
    if (originalStr.match(regex_prevented_healing)) {
        return   trans_from_dict(RegExp.$1) + "的回復行為被封住了！";
    }
    if (originalStr.match(regex_toquick_draw)) {
        return   "速擊使對手的" + trans_from_dict(RegExp.$1) + "行動變快了！";
    }
    if (originalStr.match(regex_quick_draw)) {
        return   "速擊使" + trans_from_dict(RegExp.$1) + "行動變快了！";
    }
    if (originalStr.match(regex_tosalt_cured)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "陷入了鹽腌狀態！";
    }
    if (originalStr.match(regex_salt_cured)) {
        return   trans_from_dict(RegExp.$1) + "陷入了鹽腌狀態！";
    }
    if (originalStr.match(regex_tobeing_withdrawn)) {
        return   "(對手的" + trans_from_dict(RegExp.$1) + "正在撤退......)";
    }
    if (originalStr.match(regex_being_withdrawn)) {
        return   "(" + trans_from_dict(RegExp.$1) + "正在撤退......)";
    }
    if (originalStr.match(regex_toeject_pack)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "要用避難背包回去了！";
    }
    if (originalStr.match(regex_eject_pack)) {
        return   trans_from_dict(RegExp.$1) + "要用避難背包回去了！";
    }
    if (originalStr.match(regex_toeject_button)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "要用逃脫按鍵回去了！";
    }
    if (originalStr.match(regex_eject_button)) {
        return   trans_from_dict(RegExp.$1) + "要用逃脫按鍵回去了！";
    }
    if (originalStr.match(regex_topower_herb)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "用了強力香草後，充滿了力量！";
    }
    if (originalStr.match(regex_power_herb)) {
        return   trans_from_dict(RegExp.$1) + "用了強力香草後，充滿了力量！";
    }
    if (originalStr.match(regex_towhite_herb)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "用白色香草復原了能力！";
    }
    if (originalStr.match(regex_white_herb)) {
        return   trans_from_dict(RegExp.$1) + "用白色香草復原了能力！";
    }
    if (originalStr.match(regex_tofocussash_focusband)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "用" + trans_from_dict(RegExp.$2 == "Focus Sash" ? "氣勢披帶" : "氣勢頭帶") + "撐住了！";
    }
    if (originalStr.match(regex_focussash_focusband)) {
        return   trans_from_dict(RegExp.$1) + "用" + trans_from_dict(RegExp.$2 == "Focus Sash" ? "氣勢披帶" : "氣勢頭帶") + "撐住了！";
    }
    if (originalStr.match(regex_toair_balloon_popped)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "的氣球破了！";
    }
    if (originalStr.match(regex_air_balloon_popped)) {
        return   trans_from_dict(RegExp.$1) + "的氣球破了！";
    }
    if (originalStr.match(regex_toshell_gleam)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "讓甲殼發出光輝，使屬性相克關系發生扭曲！！";
    }
    if (originalStr.match(regex_shell_gleam)) {
        return   trans_from_dict(RegExp.$1) + "讓甲殼發出光輝，使屬性相克關系發生扭曲！！";
    }
    if (originalStr.match(regex_toquick_claw)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "用了先制之爪後，行動變快了！";
    }
    if (originalStr.match(regex_quick_claw)) {
        return   trans_from_dict(RegExp.$1) + "用了先制之爪後，行動變快了！";
    }
    if (originalStr.match(regex_tosupreme_overlord)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "從被打倒的同伴身上得到力量了！";
    }
    if (originalStr.match(regex_supreme_overlord)) {
        return   trans_from_dict(RegExp.$1) + "從被打倒的同伴身上得到力量了！";
    }
    if (originalStr.match(regex_toabsorbed_light)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "吸收了光！";
    }
    if (originalStr.match(regex_absorbed_light)) {
        return   trans_from_dict(RegExp.$1) + "吸收了光！";
    }
    if (originalStr.match(regex_toalready_burned)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "已經被灼傷了！";
    }
    if (originalStr.match(regex_already_burned)) {
        return   trans_from_dict(RegExp.$1) + "已經被灼傷了！";
    }
    if (originalStr.match(regex_tosticky_candy_syrup)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "陷入了滿身糖狀態！";
    }
    if (originalStr.match(regex_sticky_candy_syrup)) {
        return   trans_from_dict(RegExp.$1) + "陷入了滿身糖狀態！";
    }
    if (originalStr.match(regex_togoing_all)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "拿出全力了！";
    }
    if (originalStr.match(regex_going_all)) {
        return   trans_from_dict(RegExp.$1) + "拿出全力了！";
    }
    if (originalStr.match(regex_tocreate_decoy)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "斷掉尾巴並將其作為替身了！";
    }
    if (originalStr.match(regex_create_decoy)) {
        return   trans_from_dict(RegExp.$1) + "斷掉尾巴並將其作為替身了！";
    }
    if (originalStr.match(regex_tocut_hp2)) {
        return   "(對手的" + trans_from_dict(RegExp.$1) + "削減生命強化了招式！)";
    }
    if (originalStr.match(regex_cut_hp2)) {
        return   "(" + trans_from_dict(RegExp.$1) + "削減生命強化了招式！)";
    }
    if (originalStr.match(regex_tocut_hp)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "削減生命強化了招式！";
    }
    if (originalStr.match(regex_cut_hp)) {
        return   trans_from_dict(RegExp.$1) + "削減生命強化了招式！";
    }
    if (originalStr.match(regex_toloses_flying2)) {
        return   "(對手的" + trans_from_dict(RegExp.$1) + "在本回合失去了飛行屬性。)";
    }
    if (originalStr.match(regex_loses_flying2)) {
        return   "(" + trans_from_dict(RegExp.$1) + "在本回合失去了飛行屬性。)";
    }
    if (originalStr.match(regex_toloses_flying)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "在本回合失去了飛行屬性。";
    }
    if (originalStr.match(regex_loses_flying)) {
        return   trans_from_dict(RegExp.$1) + "在本回合失去了飛行屬性。";
    }
    if (originalStr.match(regex_toreceived_encore)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "接受了再來一次！";
    }
    if (originalStr.match(regex_received_encore)) {
        return   trans_from_dict(RegExp.$1) + "接受了再來一次！";
    }
    if (originalStr.match(regex_totoxic_orb)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "因劇毒寶珠而中劇毒了！";
    }
    if (originalStr.match(regex_toxic_orb)) {
        return   trans_from_dict(RegExp.$1) + "因劇毒寶珠而中劇毒了！";
    }
    if (originalStr.match(regex_tosticky_web)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "被黏黏網粘住了！";
    }
    if (originalStr.match(regex_sticky_web)) {
        return   trans_from_dict(RegExp.$1) + "被黏黏網粘住了！";
    }
    if (originalStr.match(regex_tonot_lowered2)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "的能力不會降低！";
    }
    if (originalStr.match(regex_not_lowered2)) {
        return   trans_from_dict(RegExp.$1) + "的能力不會降低！";
    }
    if (originalStr.match(regex_tocant_use_item)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "無法使用道具了！";
    }
    if (originalStr.match(regex_cant_use_item)) {
        return   trans_from_dict(RegExp.$1) + "無法使用道具了！";
    }
    if (originalStr.match(regex_toheal_block_off)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "的回復封印解除了！";
    }
    if (originalStr.match(regex_heal_block_off)) {
        return   trans_from_dict(RegExp.$1) + "的回復封印解除了！";
    }
    if (originalStr.match(regex_toparalyzed_cant_move)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "因身體麻痹而無法行動！";
    }
    if (originalStr.match(regex_paralyzed_cant_move)) {
        return   trans_from_dict(RegExp.$1) + "因身體麻痹而無法行動！";
    }
    if (originalStr.match(regex_toparalyzed_maybe_unable_move)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "麻痹了，很難使出招式！";
    }
    if (originalStr.match(regex_paralyzed_maybe_unable_move)) {
        return   trans_from_dict(RegExp.$1) + "麻痹了，很難使出招式！";
    }
    if (originalStr.match(regex_tosealed_moves)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "封印了對手的招式！";
    }
    if (originalStr.match(regex_sealed_moves)) {
        return   trans_from_dict(RegExp.$1) + "封印了對手的招式！";
    }
    if (originalStr.match(regex_tochose_doom)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "將破滅之願托付給了未來！";
    }
    if (originalStr.match(regex_chose_doom)) {
        return   trans_from_dict(RegExp.$1) + "將破滅之願托付給了未來！";
    }
    if (originalStr.match(regex_toelectromagnetism)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "因電磁力浮了起來！";
    }
    if (originalStr.match(regex_electromagnetism)) {
        return   trans_from_dict(RegExp.$1) + "因電磁力浮了起來！";
    }
    if (originalStr.match(regex_tostockpiled_off)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "的蓄力效果消失了！";
    }
    if (originalStr.match(regex_stockpiled_off)) {
        return   trans_from_dict(RegExp.$1) + "的蓄力效果消失了！";
    }
    if (originalStr.match(regex_toillusion_off)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "造成的幻覺被解除了！";
    }
    if (originalStr.match(regex_illusion_off)) {
        return   trans_from_dict(RegExp.$1) + "造成的幻覺被解除了！";
    }
    if (originalStr.match(regex_tosnapped_confusion)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "的混亂解除了！";
    }
    if (originalStr.match(regex_snapped_confusion)) {
        return   trans_from_dict(RegExp.$1) + "的混亂解除了！";
    }
    if (originalStr.match(regex_tosnapped_confusion2)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "的混亂解除了！";
    }
    if (originalStr.match(regex_snapped_confusion2)) {
        return   trans_from_dict(RegExp.$1) + "的混亂解除了！";
    }
    if (originalStr.match(regex_tosnapped_confusion3)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "的混亂解除了！";
    }
    if (originalStr.match(regex_snapped_confusion3)) {
        return   trans_from_dict(RegExp.$1) + "的混亂解除了！";
    }
    if (originalStr.match(regex_tofuturistic_engine)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "布下電氣場地使未來的機關躍動起來！！";
    }
    if (originalStr.match(regex_futuristic_engine)) {
        return   trans_from_dict(RegExp.$1) + "布下電氣場地使未來的機關躍動起來！！";
    }
    if (originalStr.match(regex_tofuturistic_engine2)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "利用了電氣場地使未來的機關躍動起來！！";
    }
    if (originalStr.match(regex_futuristic_engine2)) {
        return   trans_from_dict(RegExp.$1) + "利用了電氣場地使未來的機關躍動起來！！";
    }
    if (originalStr.match(regex_toancient_pulse)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "令日照變強，激起了古代的脈動！！";
    }
    if (originalStr.match(regex_ancient_pulse)) {
        return   trans_from_dict(RegExp.$1) + "令日照變強，激起了古代的脈動！！";
    }
    if (originalStr.match(regex_toancient_pulse2)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "利用日照激起了古代的脈動！！";
    }
    if (originalStr.match(regex_ancient_pulse2)) {
        return   trans_from_dict(RegExp.$1) + "利用日照激起了古代的脈動！！";
    }
    if (originalStr.match(regex_toflinched)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "畏縮了，無法使出招式！";
    }
    if (originalStr.match(regex_flinched)) {
        return   trans_from_dict(RegExp.$1) + "畏縮了，無法使出招式！";
    }
    if (originalStr.match(regex_tolost_somehp)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "的生命被削減了一些！";
    }
    if (originalStr.match(regex_lost_somehp)) {
        return   trans_from_dict(RegExp.$1) + "的生命被削減了一些！";
    }
    if (originalStr.match(regex_todamaged_recoil)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "受到了反作用力的傷害！";
    }
    if (originalStr.match(regex_damaged_recoil)) {
        return   trans_from_dict(RegExp.$1) + "受到了反作用力的傷害！";
    }
    if (originalStr.match(regex_tobuffeted_sandstorm_hail)) {
        return    trans_from_dict(RegExp.$2 == "sandstorm" ? "沙暴" : "冰雹") + "襲擊了對手的" + trans_from_dict(RegExp.$1) + "！";
    }
    if (originalStr.match(regex_buffeted_sandstorm_hail)) {
        return    trans_from_dict(RegExp.$2 == "sandstorm" ? "沙暴" : "冰雹") + "襲擊了" + trans_from_dict(RegExp.$1) + "！";
    }
    if (originalStr.match(regex_totormented)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "正被惡夢纏身！";
    }
    if (originalStr.match(regex_tormented)) {
        return   trans_from_dict(RegExp.$1) + "正被惡夢纏身！";
    }
    if (originalStr.match(regex_toafflicted_by_curse)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "正受到詛咒！";
    }
    if (originalStr.match(regex_afflicted_by_curse)) {
        return   trans_from_dict(RegExp.$1) + "正受到詛咒！";
    }
    if (originalStr.match(regex_tolocked_in_nightmare)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "被困在了惡夢之中！";
    }
    if (originalStr.match(regex_locked_in_nightmare)) {
        return   trans_from_dict(RegExp.$1) + "被困在了惡夢之中！";
    }
    if (originalStr.match(regex_todemaged_by_recoil)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "受到了反作用力造成的傷害！";
    }
    if (originalStr.match(regex_demaged_by_recoil)) {
        return   trans_from_dict(RegExp.$1) + "受到了反作用力造成的傷害！";
    }
    if (originalStr.match(regex_tomystical_moonlight)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "被神秘的月光包圍了！";
    }
    if (originalStr.match(regex_mystical_moonlight)) {
        return   trans_from_dict(RegExp.$1) + "被神秘的月光包圍了！";
    }
    if (originalStr.match(regex_towas_hurt2)) {
        return   "(對手的" + trans_from_dict(RegExp.$1) + "受到了傷害！)";
    }
    if (originalStr.match(regex_was_hurt2)) {
        return   "(" + trans_from_dict(RegExp.$1) + "受到了傷害！)";
    }
    if (originalStr.match(regex_towas_hurt)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "受到了傷害！";
    }
    if (originalStr.match(regex_was_hurt)) {
        return   trans_from_dict(RegExp.$1) + "受到了傷害！";
    }
    if (originalStr.match(regex_tofrozen_solid)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "因凍住了而無法行動！";
    }
    if (originalStr.match(regex_frozen_solid)) {
        return   trans_from_dict(RegExp.$1) + "因凍住了而無法行動！";
    }
    if (originalStr.match(regex_totwisted_dimensions)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "扭曲了時空！";
    }
    if (originalStr.match(regex_twisted_dimensions)) {
        return   trans_from_dict(RegExp.$1) + "扭曲了時空！";
    }
    if (originalStr.match(regex_toability_suppressed)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "的特性變得無效了！";
    }
    if (originalStr.match(regex_ability_suppressed)) {
        return   trans_from_dict(RegExp.$1) + "的特性變得無效了！";
    }
    if (originalStr.match(regex_towas_cured_poisoning)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "治癒了中毒！";
    }
    if (originalStr.match(regex_was_cured_poisoning)) {
        return    trans_from_dict(RegExp.$1) + "治癒了中毒！";
    }
    if (originalStr.match(regex_tousedupall_electricity)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "用盡電力了！";
    }
    if (originalStr.match(regex_usedupall_electricity)) {
        return   trans_from_dict(RegExp.$1) + "用盡電力了！";
    }
    if (originalStr.match(regex_tono_retreat)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "受到背水一戰的效果影響，無法逃走了！";
    }
    if (originalStr.match(regex_no_retreat)) {
        return   trans_from_dict(RegExp.$1) + "受到背水一戰的效果影響，無法逃走了！";
    }
    if (originalStr.match(regex_dragged_out)) {
        return    trans_from_dict(RegExp.$1) + "被拖出來戰鬥了！";
    }
    if (originalStr.match(regex_toenergy_drained)) {
        return   "從對手的" + trans_from_dict(RegExp.$1) + "那裡吸取了體力！";
    }
    if (originalStr.match(regex_energy_drained)) {
        return   trans_from_dict(RegExp.$1) + "被吸取了體力！";
    }
    if (originalStr.match(regex_toabsorbs_attack)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "吸引了攻擊！";
    }
    if (originalStr.match(regex_absorbs_attack)) {
        return   trans_from_dict(RegExp.$1) + "吸引了攻擊！";
    }
    if (originalStr.match(regex_totook_attack)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "吸引了攻擊！";
    }
    if (originalStr.match(regex_took_attack)) {
        return   trans_from_dict(RegExp.$1) + "吸引了攻擊！";
    }
    if (originalStr.match(regex_tie)) {
        return   trans_from_dict(RegExp.$1) + "和" + trans_from_dict(RegExp.$2) + "平局了！";
    }
    if (originalStr.match(regex_tounder_ground)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "鑽入了洞里！";
    }
    if (originalStr.match(regex_under_ground)) {
        return   trans_from_dict(RegExp.$1) + "鑽入了洞里！";
    }
    if (originalStr.match(regex_toflew_high)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "飛向了高空！";
    }
    if (originalStr.match(regex_flew_high)) {
        return   trans_from_dict(RegExp.$1) + "飛向了高空！";
    }
    if (originalStr.match(regex_tohurled_air)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "被投向了空中！";
    }
    if (originalStr.match(regex_hurled_air)) {
        return   trans_from_dict(RegExp.$1) + "被投向了空中！";
    }
    if (originalStr.match(regex_towhippedup_whirlwind)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "掀起一陣旋風！";
    }
    if (originalStr.match(regex_whippedup_whirlwind)) {
        return   trans_from_dict(RegExp.$1) + "掀起一陣旋風！";
    }
    if (originalStr.match(regex_tohid_underwater)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "潛入了水中！";
    }
    if (originalStr.match(regex_hid_underwater)) {
        return   trans_from_dict(RegExp.$1) + "潛入了水中！";
    }
    if (originalStr.match(regex_tosprang_up)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "高高地跳了起來！";
    }
    if (originalStr.match(regex_sprang_up)) {
        return   trans_from_dict(RegExp.$1) + "高高地跳了起來！";
    }
    if (originalStr.match(regex_toitem_cannot_removed)) {
        return   "無法拿開對手的" + trans_from_dict(RegExp.$1) + "的道具！";
    }
    if (originalStr.match(regex_item_cannot_removed)) {
        return   "無法拿開" + trans_from_dict(RegExp.$1) + "的道具！";
    }
    if (originalStr.match(regex_tomove_nolonger_disabled)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "的招式不再被禁用！";
    }
    if (originalStr.match(regex_move_nolonger_disabled)) {
        return   trans_from_dict(RegExp.$1) + "的招式不再被禁用！";
    }
    if (originalStr.match(regex_toloafing_around)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "正在偷懶！";
    }
    if (originalStr.match(regex_loafing_around)) {
        return   trans_from_dict(RegExp.$1) + "正在偷懶！";
    }
    if (originalStr.match(regex_tomust_recharge)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "因攻擊的反作用力而無法動彈！";
    }
    if (originalStr.match(regex_must_recharge)) {
        return   trans_from_dict(RegExp.$1) + "因攻擊的反作用力而無法動彈！";
    }
    if (originalStr.match(regex_tocured_poisoning)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "因為中毒而恢覆了HP。";
    }
    if (originalStr.match(regex_cured_poisoning)) {
        return   trans_from_dict(RegExp.$1) + "因為中毒而恢覆了HP。";
    }
    if (originalStr.match(regex_toheals_status)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "治癒了異常狀態！";
    }
    if (originalStr.match(regex_heals_status)) {
        return   trans_from_dict(RegExp.$1) + "治癒了異常狀態！";
    }
    if (originalStr.match(regex_tohealed_burn)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "治癒了灼傷狀態！";
    }
    if (originalStr.match(regex_healed_burn)) {
        return   trans_from_dict(RegExp.$1) + "治癒了灼傷狀態！";
    }
    if (originalStr.match(regex_toburn_was_healed)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "的灼傷被治癒了！";
    }
    if (originalStr.match(regex_burn_was_healed)) {
        return   trans_from_dict(RegExp.$1) + "的灼傷被治癒了！";
    }
    if (originalStr.match(regex_tocured_its_poison)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "治癒了中毒狀態！";
    }
    if (originalStr.match(regex_cured_its_poison)) {
        return   trans_from_dict(RegExp.$1) + "治癒了中毒狀態！";
    }
    if (originalStr.match(regex_tocured_its_paralysis)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "治癒了麻痹狀態！";
    }
    if (originalStr.match(regex_cured_its_paralysis)) {
        return   trans_from_dict(RegExp.$1) + "治癒了麻痹狀態！";
    }
    if (originalStr.match(regex_tostatus_cleared)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "的異常狀態被清除了！";
    }
    if (originalStr.match(regex_status_cleared)) {
        return    trans_from_dict(RegExp.$1) + "的異常狀態被清除了！";
    }
    if (originalStr.match(regex_totake_attacker_down)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "想和對手同歸於盡！";
    }
    if (originalStr.match(regex_take_attacker_down)) {
        return   trans_from_dict(RegExp.$1) + "想和對手同歸於盡！";
    }
    if (originalStr.match(regex_totook_attacker_down)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "和對手同歸於盡了！";
    }
    if (originalStr.match(regex_took_attacker_down)) {
        return   trans_from_dict(RegExp.$1) + "和對手同歸於盡了！";
    }
    if (originalStr.match(regex_toplanted_its_roots)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "紮下了根！";
    }
    if (originalStr.match(regex_planted_its_roots)) {
        return   trans_from_dict(RegExp.$1) + "紮下了根！";
    }
    if (originalStr.match(regex_toanchored_itself_roots)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "紮下了根！";
    }
    if (originalStr.match(regex_anchored_itself_roots)) {
        return   trans_from_dict(RegExp.$1) + "紮下了根！";
    }
    if (originalStr.match(regex_tosurrounded_veil_water)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "套上了水環！";
    }
    if (originalStr.match(regex_surrounded_veil_water)) {
        return   trans_from_dict(RegExp.$1) + "套上了水環！";
    }
    if (originalStr.match(regex_towas_subjected_torment)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "遭到了無理取鬧！";
    }
    if (originalStr.match(regex_was_subjected_torment)) {
        return   trans_from_dict(RegExp.$1) + "遭到了無理取鬧！";
    }
    if (originalStr.match(regex_tosupersweet_aroma)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "的蜜散發出了甜甜香氣！";
    }
    if (originalStr.match(regex_supersweet_aroma)) {
        return   trans_from_dict(RegExp.$1) + "的蜜散發出了甜甜香氣！";
    }
    if (originalStr.match(regex_toreversed_other_auras)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "反轉了所有其它寶可夢的氣場！";
    }
    if (originalStr.match(regex_reversed_other_auras)) {
        return   trans_from_dict(RegExp.$1) + "反轉了所有其它寶可夢的氣場！";
    }
    if (originalStr.match(regex_togot_over_infatuation)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "不再迷戀對方了！";
    }
    if (originalStr.match(regex_got_over_infatuation)) {
        return   trans_from_dict(RegExp.$1) + "不再迷戀對方了！";
    }
    if (originalStr.match(regex_tounderwent_heroic_transformation)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "變身後歸來了！";
    }
    if (originalStr.match(regex_underwent_heroic_transformation)) {
        return   trans_from_dict(RegExp.$1) + "變身後歸來了！";
    }
    if (originalStr.match(regex_toimmobilized_by_love)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "陷入了愛河！";
    }
    if (originalStr.match(regex_immobilized_by_love)) {
        return   trans_from_dict(RegExp.$1) + "陷入了愛河！";
    }
    if (originalStr.match(regex_toshuddered)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "發抖了！";
    }
    if (originalStr.match(regex_shuddered)) {
        return   trans_from_dict(RegExp.$1) + "發抖了！";
    }
    if (originalStr.match(regex_tomove_was_postponed)) {
        return   "延後了對手的" + trans_from_dict(RegExp.$1) + "的順序！";
    }
    if (originalStr.match(regex_move_was_postponed)) {
        return   "延後了" + trans_from_dict(RegExp.$1) + "的順序！";
    }
    if (originalStr.match(regex_totightening_its_focus)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "聚精會神了起來！";
    }
    if (originalStr.match(regex_tightening_its_focus)) {
        return   trans_from_dict(RegExp.$1) + "聚精會神了起來！";
    }
    if (originalStr.match(regex_toset_shell_trap)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "設置了一個甲殼陷阱！";
    }
    if (originalStr.match(regex_set_shell_trap)) {
        return   trans_from_dict(RegExp.$1) + "設置了一個甲殼陷阱！";
    }
    if (originalStr.match(regex_toshrouded_itself_magiccoat)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "給自己裹上了一層魔術外衣！";
    }
    if (originalStr.match(regex_shrouded_itself_magiccoat)) {
        return   trans_from_dict(RegExp.$1) + "給自己裹上了一層魔術外衣！";
    }
    if (originalStr.match(regex_also_timer_to_on)) {
        return   RegExp.$1 + "也想要開啟計時器。";
    }
    if (originalStr.match(regex_torestorehp_using_zpower)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "用Z力量恢覆了生命值！";
    }
    if (originalStr.match(regex_restorehp_using_zpower)) {
        return   trans_from_dict(RegExp.$1) + "用Z力量恢覆了生命值！";
    }
    if (originalStr.match(regex_tocuthp_maximized_attack)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "削減體力並釋放了全部力量！";
    }
    if (originalStr.match(regex_cuthp_maximized_attack)) {
        return   trans_from_dict(RegExp.$1) + "削減體力並釋放了全部力量！";
    }
    if (originalStr.match(regex_torestored_its_hp)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "回復了HP。";
    }
    if (originalStr.match(regex_restored_its_hp)) {
        return   trans_from_dict(RegExp.$1) + "回復了HP。";
    }
    if (originalStr.match(regex_torestorehp_using_zpower2)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "通過Z招式回復了HP！";
    }
    if (originalStr.match(regex_restorehp_using_zpower2)) {
        return   trans_from_dict(RegExp.$1) + "通過Z招式回復了HP！";
    }
    if (originalStr.match(regex_toreturned_stats_zpower)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "通過Z招式將被降低的能力復原了！";
    }
    if (originalStr.match(regex_returned_stats_zpower)) {
        return   trans_from_dict(RegExp.$1) + "通過Z招式將被降低的能力復原了！";
    }
    if (originalStr.match(regex_tostarted_heatingup_beak)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "開始給鳥嘴加熱了！";
    }
    if (originalStr.match(regex_started_heatingup_beak)) {
        return   trans_from_dict(RegExp.$1) + "開始給鳥嘴加熱了！";
    }
    if (originalStr.match(regex_toswitched_items_target)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "互換了各自的道具！";
    }
    if (originalStr.match(regex_switched_items_target)) {
        return   trans_from_dict(RegExp.$1) + "互換了各自的道具！";
    }
    if (originalStr.match(regex_tomoves_have_electrified)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "的招式帶電了！";
    }
    if (originalStr.match(regex_moves_have_electrified)) {
        return   trans_from_dict(RegExp.$1) + "的招式帶電了！";
    }
    if (originalStr.match(regex_totarget_bear_grudge)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "想向對手釋放怨念！";
    }
    if (originalStr.match(regex_target_bear_grudge)) {
        return   trans_from_dict(RegExp.$1) + "想向對手釋放怨念！";
    }
    if (originalStr.match(regex_tolearned)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "學會了" + translations[RegExp.$2] + "！";
    }
    if (originalStr.match(regex_learned)) {
        return   trans_from_dict(RegExp.$1) + "學會了" + translations[RegExp.$2] + "！";
    }
    if (originalStr.match(regex_tokept_going_crashed)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "因勢頭過猛而撞到了地面！";
    }
    if (originalStr.match(regex_kept_going_crashed)) {
        return   trans_from_dict(RegExp.$1) + "因勢頭過猛而撞到了地面！";
    }
    if (originalStr.match(regex_tothawed_out)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "的冰凍被融化了！";
    }
    if (originalStr.match(regex_thawed_out)) {
        return   trans_from_dict(RegExp.$1) + "的冰凍被融化了！";
    }
    if (originalStr.match(regex_tothroat_chop)) {
        return   "對手的地獄突刺的效果阻止了" + trans_from_dict(RegExp.$1) + "使用的聲音類招式！";
    }
    if (originalStr.match(regex_throat_chop)) {
        return   "地獄突刺的效果阻止了對手的" + trans_from_dict(RegExp.$1) + "使用的聲音類招式！";
    }
    if (originalStr.match(regex_toprotected_aromaticveil)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "被芳香幕保護了！";
    }
    if (originalStr.match(regex_protected_aromaticveil)) {
        return   trans_from_dict(RegExp.$1) + "被芳香幕保護了！";
    }
    if (originalStr.match(regex_tosurrounded_sweetness)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "被甜幕包圍了！";
    }
    if (originalStr.match(regex_surrounded_sweetness)) {
        return   trans_from_dict(RegExp.$1) + "被甜幕包圍了！";
    }
    if (originalStr.match(regex_tocant_asleep_sweetness)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "因為甜幕無法入睡！";
    }
    if (originalStr.match(regex_cant_asleep_sweetness)) {
        return   trans_from_dict(RegExp.$1) + "因為甜幕無法入睡！";
    }
    if (originalStr.match(regex_tolost_focus)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "聚氣時受到幹擾，無法使出招式！";
    }
    if (originalStr.match(regex_lost_focus)) {
        return   trans_from_dict(RegExp.$1) + "聚氣時受到幹擾，無法使出招式！";
    }
    if (originalStr.match(regex_toattack_missed2)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "的攻擊沒有命中！";
    }
    if (originalStr.match(regex_attack_missed2)) {
        return   trans_from_dict(RegExp.$1) + "的攻擊沒有命中！";
    }
    if (originalStr.match(regex_tocenter_attention_zpower)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "使用Z力量變得萬眾矚目了！";
    }
    if (originalStr.match(regex_center_attention_zpower)) {
        return   trans_from_dict(RegExp.$1) + "使用Z力量變得萬眾矚目了！";
    }
    if (originalStr.match(regex_tobond_trainer)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "與訓練師的牽絆使得渾身充滿了牽絆之力！";
    }
    if (originalStr.match(regex_bond_trainer)) {
        return   trans_from_dict(RegExp.$1) + "與訓練師的牽絆使得渾身充滿了牽絆之力！";
    }
    if (originalStr.match(regex_toprimal_reversion)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "的原始回歸！恢覆了原始的樣子！";
    }
    if (originalStr.match(regex_primal_reversion)) {
        return   trans_from_dict(RegExp.$1) + "的原始回歸！恢覆了原始的樣子！";
    }
    if (originalStr.match(regex_toabsorbing_power)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "正在積蓄力量！";
    }
    if (originalStr.match(regex_absorbing_power)) {
        return   trans_from_dict(RegExp.$1) + "正在積蓄力量！";
    }
    if (originalStr.match(regex_totaunt_off)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "的挑釁消失了！";
    }
    if (originalStr.match(regex_taunt_off)) {
        return   trans_from_dict(RegExp.$1) + "的挑釁消失了！";
    }
    if (originalStr.match(regex_tocustap_berry)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "用了釋陀果後，行動變快了！";
    }
    if (originalStr.match(regex_custap_berry)) {
        return   trans_from_dict(RegExp.$1) + "用了釋陀果後，行動變快了！";
    }
    if (originalStr.match(regex_totwo_abilities)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "同時擁有了兩種特性！";
    }
    if (originalStr.match(regex_two_abilities)) {
        return   trans_from_dict(RegExp.$1) + "同時擁有了兩種特性！";
    }
    if (originalStr.match(regex_toprotected_Terrain)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "受到了" + trans_from_dict(RegExp.$2 == "Electric" ? "電氣" : RegExp.$2 == "Misty"  ? "薄霧" : "精神") + "場地的保護！";
    }
    if (originalStr.match(regex_protected_Terrain)) {
        return   trans_from_dict(RegExp.$1) + "受到了" + trans_from_dict(RegExp.$2 == "Electric" ? "電氣" : RegExp.$2 == "Misty"  ? "薄霧" : "精神") + "場地的保護！";
    }
     if (originalStr.match(regex_tomirrorherb2)) {
         return  "對手的" + trans_from_dict(RegExp.$2) +"用模仿香草巨幅" + trans_from_dict(RegExp.$1 == "raised" ? "提升" : "降低") + "了" + translations[RegExp.$3] + "！";
    }
     if (originalStr.match(regex_mirrorherb2)) {
         return  trans_from_dict(RegExp.$2) +"用模仿香草巨幅" + trans_from_dict(RegExp.$1 == "raised" ? "提升" : "降低") + "了" + translations[RegExp.$3] + "！";
    }
     if (originalStr.match(regex_tomirrorherb)) {
         return  "對手的" + trans_from_dict(RegExp.$2) + "用模仿香草" + trans_from_dict(RegExp.$1 == "sharply raised" ? "大幅提升" : "提升") + "了" + translations[RegExp.$3] + "！";
    }
     if (originalStr.match(regex_mirrorherb)) {
         return  trans_from_dict(RegExp.$2) + "用模仿香草" + trans_from_dict(RegExp.$1 == "sharply raised" ? "大幅提升" : "提升") + "了" + translations[RegExp.$3] + "！";
    }
     if (originalStr.match(regex_tomirrorherb_Contrary)) {
         return  "對手的" + trans_from_dict(RegExp.$2) + "用模仿香草" + trans_from_dict(RegExp.$1 == "harshly lowered" ? "大幅降低" : "降低") + "了"  + translations[RegExp.$3] + "！";
    }
     if (originalStr.match(regex_mirrorherb_Contrary)) {
         return  trans_from_dict(RegExp.$2) + "用模仿香草" + trans_from_dict(RegExp.$1 == "harshly lowered" ? "大幅降低" : "降低") + "了"  + translations[RegExp.$3] + "！";
    }
    if (originalStr.match(regex_toStarf_Berry)) {
        return   "對手的" + trans_from_dict(RegExp.$2) + "用星桃果" + trans_from_dict(RegExp.$1 == "sharply raised" ? "大幅提升" : RegExp.$1 == "drastically raised"  ? "巨幅提升" : "大幅降低") + "了" + translations[RegExp.$3] + "！";
    }
    if (originalStr.match(regex_Starf_Berry)) {
        return   trans_from_dict(RegExp.$2) + "用星桃果" + trans_from_dict(RegExp.$1 == "sharply raised" ? "大幅提升" : RegExp.$1 == "drastically raised"  ? "巨幅提升" : "大幅降低") + "了" + translations[RegExp.$3] + "！";
    }
    if (originalStr.match(regex_toWeakness_Policy)) {
        return   "對手的" + trans_from_dict(RegExp.$2) + "用弱點保險" + trans_from_dict(RegExp.$1 == "sharply raised" ? "大幅提升" : RegExp.$1 == "drastically raised"  ? "巨幅提升" : "大幅降低") + "了" + translations[RegExp.$3] + "！";
    }
    if (originalStr.match(regex_Weakness_Policy)) {
        return   trans_from_dict(RegExp.$2) + "用弱點保險" + trans_from_dict(RegExp.$1 == "sharply raised" ? "大幅提升" : RegExp.$1 == "drastically raised"  ? "巨幅提升" : "大幅降低") + "了" + translations[RegExp.$3] + "！";
    }
    if (originalStr.match(regex_toRoom_Service)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "用客房服務降低了速度！";
    }
    if (originalStr.match(regex_Room_Service)) {
        return   trans_from_dict(RegExp.$1) + "用客房服務降低了速度！";
    }
    if (originalStr.match(regex_toabsorbed_electricity)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "吸收了電力！";
    }
    if (originalStr.match(regex_absorbed_electricity)) {
        return   trans_from_dict(RegExp.$1) + "吸收了電力！";
    }
    if (originalStr.match(regex_tospace_power)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "身上溢出了宇宙之力！";
    }
    if (originalStr.match(regex_space_power)) {
        return   trans_from_dict(RegExp.$1) + "身上溢出了宇宙之力！";
    }
    if (originalStr.match(regex_togravity)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "因受到重力影響而無法待在空中！";
    }
    if (originalStr.match(regex_gravity)) {
        return   trans_from_dict(RegExp.$1) + "因受到重力影響而無法待在空中！";
    }
    if (originalStr.match(regex_toWhite_Herb)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "用白色香草復原了能力！";
    }
    if (originalStr.match(regex_White_Herb)) {
        return   trans_from_dict(RegExp.$1) + "用白色香草復原了能力！";
    }
    if (originalStr.match(regex_todisguise_busted)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "的畫皮脫落了！";
    }
    if (originalStr.match(regex_disguise_busted)) {
        return   trans_from_dict(RegExp.$1) + "的畫皮脫落了！";
    }
    if (originalStr.match(regex_toswapped_abilities)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "互換了各自的特性！";
    }
    if (originalStr.match(regex_swapped_abilities)) {
        return   trans_from_dict(RegExp.$1) + "互換了各自的特性！";
    }
    if (originalStr.match(regex_tocharging_power)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "開始充電了！";
    }
    if (originalStr.match(regex_charging_power)) {
        return   trans_from_dict(RegExp.$1) + "開始充電了！";
    }
    if (originalStr.match(regex_tofell_love)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "著迷了！";
    }
    if (originalStr.match(regex_fell_love)) {
        return   trans_from_dict(RegExp.$1) + "著迷了！";
    }
    if (originalStr.match(regex_toasleep_paralyzed)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "已經"+ trans_from_dict(RegExp.$2 == "asleep" ? "睡著" : "麻痹") + "了！";
    }
    if (originalStr.match(regex_asleep_paralyzed)) {
        return   trans_from_dict(RegExp.$1) + "已經"+ trans_from_dict(RegExp.$2 == "asleep" ? "睡著" : "麻痹") + "了！";
    }
    if (originalStr.match(regex_toidentified)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "被識破了！";
    }
    if (originalStr.match(regex_identified)) {
        return   trans_from_dict(RegExp.$1) + "被識破了！";
    }
    if (originalStr.match(regex_toswitched_Attack_Defense)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "交換了攻擊和防禦！";
    }
    if (originalStr.match(regex_switched_Attack_Defense)) {
        return   trans_from_dict(RegExp.$1) + "交換了攻擊和防禦！";
    }
    if (originalStr.match(regex_toanchors_itself)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "用吸盤粘在了地面上！";
    }
    if (originalStr.match(regex_anchors_itself)) {
        return   trans_from_dict(RegExp.$1) + "用吸盤粘在了地面上！";
    }
    if (originalStr.match(regex_toanchored_suction_cups)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "用吸盤粘在了地面上！";
    }
    if (originalStr.match(regex_anchored_suction_cups)) {
        return   trans_from_dict(RegExp.$1) + "用吸盤粘在了地面上！";
    }
    if (originalStr.match(regex_tostopped_shielding_itself)) {
        return   "(對手的" + trans_from_dict(RegExp.$1) + "停止了自我保護。)";
    }
    if (originalStr.match(regex_stopped_shielding_itself)) {
        return   "(" + trans_from_dict(RegExp.$1) + "停止了自我保護。)";
    }
    if (originalStr.match(regex_toshielded_itself)) {
        return   "(對手的" + trans_from_dict(RegExp.$1) + "的自我保護。)";
    }
    if (originalStr.match(regex_shielded_itself)) {
        return   "(" + trans_from_dict(RegExp.$1) + "的自我保護。)";
    }
    if (originalStr.match(regex_tocriticalhit_zpower)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "通過使用Z力量使擊中要害率提升了！";
    }
    if (originalStr.match(regex_criticalhit_zpower)) {
        return   trans_from_dict(RegExp.$1) + "通過使用Z力量使擊中要害率提升了！";
    }
    if (originalStr.match(regex_tomaking_uproar)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "吵鬧個不停！";
    }
    if (originalStr.match(regex_making_uproar)) {
        return   trans_from_dict(RegExp.$1) + "吵鬧個不停！";
    }
    if (originalStr.match(regex_tocaused_uproar)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "吵鬧了起來！";
    }
    if (originalStr.match(regex_caused_uproar)) {
        return   trans_from_dict(RegExp.$1) + "吵鬧了起來！";
    }
    if (originalStr.match(regex_tomove_no_disabled)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "的招式不再被封印了！";
    }
    if (originalStr.match(regex_move_no_disabled)) {
        return   trans_from_dict(RegExp.$1) + "的招式不再被封印了！";
    }
    if (originalStr.match(regex_tocan_use_item)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "可以再次使用道具了！";
    }
    if (originalStr.match(regex_can_use_item)) {
        return   trans_from_dict(RegExp.$1) + "可以再次使用道具了！";
    }
    if (originalStr.match(regex_totorment_wore_off)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "不再受對方無理取鬧的影響了！";
    }
    if (originalStr.match(regex_torment_wore_off)) {
        return   trans_from_dict(RegExp.$1) + "不再受對方無理取鬧的影響了！";
    }
    if (originalStr.match(regex_toshared_power_target)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "把力量分享給了目標！";
    }
    if (originalStr.match(regex_shared_power_target)) {
        return   trans_from_dict(RegExp.$1) + "把力量分享給了目標！";
    }
    if (originalStr.match(regex_toshared_guard_target)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "把防禦分享給了目標！";
    }
    if (originalStr.match(regex_shared_guard_target)) {
        return   trans_from_dict(RegExp.$1) + "把防禦分享給了目標！";
    }
    if (originalStr.match(regex_toswitched_speed_target)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "與目標交換了速度！";
    }
    if (originalStr.match(regex_switched_speed_target)) {
        return   trans_from_dict(RegExp.$1) + "與目標交換了速度！";
    }
    if (originalStr.match(regex_toBright_light)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "的身上開始溢出耀眼的光芒！";
    }
    if (originalStr.match(regex_Bright_light)) {
        return   trans_from_dict(RegExp.$1) + "的身上開始溢出耀眼的光芒！";
    }
    if (originalStr.match(regex_toalready_poisoned)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "已經中毒了。";
    }
    if (originalStr.match(regex_already_poisoned)) {
        return  trans_from_dict(RegExp.$1) + "已經中毒了。";
    }
    if (originalStr.match(regex_toalready_paralyzed)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "已經被麻痹了。";
    }
    if (originalStr.match(regex_already_paralyzed)) {
        return  trans_from_dict(RegExp.$1) + "已經被麻痹了。";
    }
    if (originalStr.match(regex_toalready_frozen)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "已經被凍住了！";
    }
    if (originalStr.match(regex_already_frozen)) {
        return  trans_from_dict(RegExp.$1) + "已經被凍住了！";
    }
    if (originalStr.match(regex_tosketched)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "學會了" + translations[RegExp.$2] + "！";
    }
    if (originalStr.match(regex_sketched)) {
        return  trans_from_dict(RegExp.$1) + "學會了" + translations[RegExp.$2] + "！";
    }
    if (originalStr.match(regex_toshell_trap)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "的陷阱甲殼沒有生效！";
    }
    if (originalStr.match(regex_shell_trap)) {
        return  trans_from_dict(RegExp.$1) + "的陷阱甲殼沒有生效！";
    }
    if (originalStr.match(regex_toDynamax)) {
        return  "(對手的" + trans_from_dict(RegExp.$1) + "的極巨化！)";
    }
    if (originalStr.match(regex_Dynamax)) {
        return  "(" + trans_from_dict(RegExp.$1) + "的極巨化！)";
    }
    if (originalStr.match(regex_no_battle_on_right_now)) {
        return  "現在沒有正在進行的" + RegExp.$1 + "。";
    }
    if (originalStr.match(regex_tosubstitute_faded)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "的替身消失了......";
    }
    if (originalStr.match(regex_substitute_faded)) {
        return  trans_from_dict(RegExp.$1) + "的替身消失了......";
    }
    if (originalStr.match(regex_not_found)) {
        return  "沒有找到用戶'" + RegExp.$1 + "'。";
    }
    if (originalStr.match(regex_Challenging)) {
        return  "正在向" + RegExp.$1 + "發起挑戰...";
    }
    if (originalStr.match(regex_is_offline)) {
        return  "用戶" + RegExp.$1 + "處於離線狀態。如果您仍然想對他進行私聊，請再次發送消息，或使用指令/offlinemsg。";
    }
    if (originalStr.match(regex_tolonger_tormented)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "不再無理取鬧了！";
    }
    if (originalStr.match(regex_longer_tormented)) {
        return  trans_from_dict(RegExp.$1) + "不再無理取鬧了！";
    }
    if (originalStr.match(regex_tocured_infatuation)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "用心靈香草治癒了著迷！";
    }
    if (originalStr.match(regex_cured_infatuation)) {
        return  trans_from_dict(RegExp.$1) + "用心靈香草治癒了著迷！";
    }
    if (originalStr.match(regex_torocky_helmet)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "因凸凸頭盔受到了傷害！";
    }
    if (originalStr.match(regex_rocky_helmet)) {
        return  trans_from_dict(RegExp.$1) + "因凸凸頭盔受到了傷害！";
    }
    if (originalStr.match(regex_toCourt_Change)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "交換了雙方的場地效果！";
    }
    if (originalStr.match(regex_Court_Change)) {
        return  trans_from_dict(RegExp.$1) + "交換了雙方的場地效果！";
    }
    if (originalStr.match(regex_toalready_substitute)) {
        return  "但是，對手的" + trans_from_dict(RegExp.$1) + "的替身已經出現了。";
    }
    if (originalStr.match(regex_already_substitute)) {
        return  "但是，" + trans_from_dict(RegExp.$1) + "的替身已經出現了。";
    }
    if (originalStr.match(regex_tovanished_instantly)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "的身影瞬間消失了！";
    }
    if (originalStr.match(regex_vanished_instantly)) {
        return  trans_from_dict(RegExp.$1) + "的身影瞬間消失了！";
    }
    if (originalStr.match(regex_toheavy_lifted)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "太重了無法被提起！";
    }
    if (originalStr.match(regex_heavy_lifted)) {
        return  trans_from_dict(RegExp.$1) + "太重了無法被提起！";
    }
    if (originalStr.match(regex_touproar_kept)) {
        return  "但是吵鬧讓對手的" + trans_from_dict(RegExp.$1) + "醒過來了！";
    }
    if (originalStr.match(regex_uproar_kept)) {
        return  "但是吵鬧讓" + trans_from_dict(RegExp.$1) + "醒過來了！";
    }
    if (originalStr.match(regex_tobraced_itself)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "擺出了挺住攻擊的架勢！";
    }
    if (originalStr.match(regex_braced_itself)) {
        return  trans_from_dict(RegExp.$1) + "擺出了挺住攻擊的架勢！";
    }
    if (originalStr.match(regex_toswitched_stat_target)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "和目標互換了能力變化！";
    }
    if (originalStr.match(regex_switched_stat_target)) {
        return  trans_from_dict(RegExp.$1) + "和目標互換了能力變化！";
    }
    if (originalStr.match(regex_toswitched_def_spd)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "和目標互換了防禦和特防的能力變化！";
    }
    if (originalStr.match(regex_switched_def_spd)) {
        return  trans_from_dict(RegExp.$1) + "和目標互換了防禦和特防的能力變化！";
    }
    if (originalStr.match(regex_toswitched_atk_spa)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "和目標互換了攻擊和特攻的能力變化！";
    }
    if (originalStr.match(regex_switched_atk_spa)) {
        return  trans_from_dict(RegExp.$1) + "和目標互換了攻擊和特攻的能力變化！";
    }
    if (originalStr.match(regex_torevealed)) {
        return  "讀取了對手的" + trans_from_dict(RegExp.$1) + "的" + translations[RegExp.$2] + "！";
    }
    if (originalStr.match(regex_revealed)) {
        return  "讀取了" + trans_from_dict(RegExp.$1) + "的" + translations[RegExp.$2] + "！";
    }
    if (originalStr.match(regex_toGMax_Wildfire)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "被超極巨地獄滅焰的火焰包圍，酷熱難耐！";
    }
    if (originalStr.match(regex_GMax_Wildfire)) {
        return  trans_from_dict(RegExp.$1) + "被超極巨地獄滅焰的火焰包圍，酷熱難耐！";
    }
    if (originalStr.match(regex_no_energy)) {
        return  trans_from_dict(RegExp.$1) + "沒有力氣戰鬥了！";
    }
    if (originalStr.match(regex_already_in_battle)) {
        return  trans_from_dict(RegExp.$1) + "已經在戰鬥了！";
    }
    if (originalStr.match(regex_towaiting_move)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "正在等待" + trans_from_dict(RegExp.$2) + "...";
    }
    if (originalStr.match(regex_waiting_move)) {
        return  trans_from_dict(RegExp.$1) + "正在等待" + trans_from_dict(RegExp.$2) + "...";
    }
    if (originalStr.match(regex_tosea_fire)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "受到了火海的傷害！";
    }
    if (originalStr.match(regex_sea_fire)) {
        return  trans_from_dict(RegExp.$1) + "受到了火海的傷害！";
    }
    if (originalStr.match(regex_toTelepathy)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "沒有受到夥伴的攻擊！";
    }
    if (originalStr.match(regex_Telepathy)) {
        return  trans_from_dict(RegExp.$1) + "沒有受到夥伴的攻擊！";
    }
    if (originalStr.match(regex_toKey_Stone)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "的" + translations[RegExp.$2] + "對鑰石起了反應！";
    }
    if (originalStr.match(regex_Key_Stone)) {
        return  trans_from_dict(RegExp.$1) + "的" + translations[RegExp.$2] + "對鑰石起了反應！";
    }
    if (originalStr.match(regex_tobecame_AshGreninja)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "變身成了小智版甲賀忍蛙！";
    }
    if (originalStr.match(regex_became_AshGreninja)) {
        return  trans_from_dict(RegExp.$1) + "變身成了小智版甲賀忍蛙！";
    }
    if (originalStr.match(regex_crazy_house)) {
        return  RegExp.$2 + "奪取了" + trans_from_dict(RegExp.$1) + "！";
    }
    if (originalStr.match(regex_tomelted)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "的" + translations[RegExp.$2] + "解除了冰凍狀態！";
    }
    if (originalStr.match(regex_melted)) {
        return  trans_from_dict(RegExp.$1) + "的" + translations[RegExp.$2] + "解除了冰凍狀態！";
    }
    if (originalStr.match(regex_toelectromagnetism_woreoff)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "的電磁力消失了！";
    }
    if (originalStr.match(regex_electromagnetism_woreoff)) {
        return  trans_from_dict(RegExp.$1) + "的電磁力消失了！";
    }
    if (originalStr.match(regex_tocant_use_gravity)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "因重力而無法使出" + translations[RegExp.$2] + "！";
    }
    if (originalStr.match(regex_cant_use_gravity)) {
        return  trans_from_dict(RegExp.$1) + "因重力而無法使出" + translations[RegExp.$2] + "！";
    }
    if (originalStr.match(regex_tomaxed_Attack)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "最大化了攻擊！";
    }
    if (originalStr.match(regex_maxed_Attack)) {
        return  trans_from_dict(RegExp.$1) + "最大化了攻擊！";
    }
    if (originalStr.match(regex_tocenter_attention)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "變得萬眾矚目了！";
    }
    if (originalStr.match(regex_center_attention)) {
        return  trans_from_dict(RegExp.$1) + "變得萬眾矚目了！";
    }
    if (originalStr.match(regex_toHospitality)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "喝光了對手的" + trans_from_dict(RegExp.$2) + "泡的茶！";
    }
    if (originalStr.match(regex_Hospitality)) {
        return  trans_from_dict(RegExp.$1) + "喝光了" + trans_from_dict(RegExp.$2) + "泡的茶！";
    }
    if (originalStr.match(regex_toRowap_Berry_Jaboca_Berry)) {
        return    "對手的" + trans_from_dict(RegExp.$1) + "受到了" + trans_from_dict(RegExp.$2) + "的" + trans_from_dict(RegExp.$3 == "Rowap" ? "霧蓮" : "嘉珍") + "果的傷害！";
    }
    if (originalStr.match(regex_Rowap_Berry_Jaboca_Berry)) {
        return    trans_from_dict(RegExp.$1) + "受到了對手的" + trans_from_dict(RegExp.$2) + "的" + trans_from_dict(RegExp.$3 == "Rowap" ? "霧蓮" : "嘉珍") + "果的傷害！";
    }
    if (originalStr.match(regex_tostoring_energy)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "正在積蓄力量！";
    }
    if (originalStr.match(regex_storing_energy)) {
        return  trans_from_dict(RegExp.$1) + "正在積蓄力量！";
    }
    if (originalStr.match(regex_tounleashed_energy)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "釋放了自身的能量！";
    }
    if (originalStr.match(regex_unleashed_energy)) {
        return  trans_from_dict(RegExp.$1) + "釋放了自身的能量！";
    }
    if (originalStr.match(regex_tobecame_nimble)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "變得身輕如燕了！";
    }
    if (originalStr.match(regex_became_nimble)) {
        return  trans_from_dict(RegExp.$1) + "變得身輕如燕了！";
    }
    if (originalStr.match(regex_rejected_Open_Team_Sheet)) {
        return  RegExp.$1 + "拒絕公開隊伍配置。";
    }
    if (originalStr.match(regex_agreed_Open_Team_Sheet)) {
        return  RegExp.$1 + "同意公開隊伍配置。";
    }
    if (originalStr.match(regex_tosqueezed_wrapped)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "被" + trans_from_dict(RegExp.$3) + "緊緊" + trans_from_dict(RegExp.$2 == "squeezed" ? "綁住" : "束縛") + "了！";
    }
    if (originalStr.match(regex_squeezed_wrapped)) {
        return  trans_from_dict(RegExp.$1) + "被對手的" + trans_from_dict(RegExp.$3) + "緊緊" + trans_from_dict(RegExp.$2 == "squeezed" ? "綁住" : "束縛") + "了！";
    }
    if (originalStr.match(regex_tounaffected)) {
        return  "對於對手的" + trans_from_dict(RegExp.$1) + "，完全沒有效果！";
    }
    if (originalStr.match(regex_unaffected)) {
        return  "對於" + trans_from_dict(RegExp.$1) + "，完全沒有效果！";
    }
    if (originalStr.match(regex_toabsorbed_nutrients_roots)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "從根上吸取了養分！";
    }
    if (originalStr.match(regex_absorbed_nutrients_roots)) {
        return  trans_from_dict(RegExp.$1) + "從根上吸取了養分！";
    }
    if (originalStr.match(regex_tonot_lowered)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "的"+ translations[RegExp.$2] + "不會降低！";
    }
    if (originalStr.match(regex_not_lowered)) {
        return   trans_from_dict(RegExp.$1) + "的" + translations[RegExp.$2] + "不會降低！";
    }
    if (originalStr.match(regex_totype_added)) {
        return  "對手的" + trans_from_dict(RegExp.$2) + "增加了" + translations[RegExp.$1] + "屬性！";
    }
    if (originalStr.match(regex_type_added)) {
        return  trans_from_dict(RegExp.$2) + "增加了" + translations[RegExp.$1] + "屬性！";
    }
    if (originalStr.match(regex_tocant_get_going)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "無法拿出平時的水準！";
    }
    if (originalStr.match(regex_cant_get_going)) {
        return  trans_from_dict(RegExp.$1) + "無法拿出平時的水準！";
    }
    if (originalStr.match(regex_tofinally_get_going)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "恢覆了平時的水準！";
    }
    if (originalStr.match(regex_finally_get_going)) {
        return  trans_from_dict(RegExp.$1) + "恢覆了平時的水準！";
    }
    if (originalStr.match(regex_towas_burned_up)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "的" + translations[RegExp.$2] + "被燒盡了！";
    }
    if (originalStr.match(regex_was_burned_up)) {
        return  trans_from_dict(RegExp.$1) + "的" + translations[RegExp.$2] + "被燒盡了！";
    }
    if (originalStr.match(regex_tosurrounded_veil_petals)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "用花幕包裹了自己！";
    }
    if (originalStr.match(regex_surrounded_veil_petals)) {
        return  trans_from_dict(RegExp.$1) + "用花幕包裹了自己！";
    }
    if (originalStr.match(regex_toAbility_became_Mummy)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "的特性變成了木乃伊！";
    }
    if (originalStr.match(regex_Ability_became_Mummy)) {
        return  trans_from_dict(RegExp.$1) + "的特性變成了木乃伊！";
    }
    if (originalStr.match(regex_toreturned_normal)) {
        return  "(對手的" + trans_from_dict(RegExp.$1) + "復原了！)";
    }
    if (originalStr.match(regex_returned_normal)) {
        return  "(" + trans_from_dict(RegExp.$1) + "復原了！)";
    }
    if (originalStr.match(regex_tolingering_aroma)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "沾上了味道且揮之不去！";
    }
    if (originalStr.match(regex_lingering_aroma)) {
        return  trans_from_dict(RegExp.$1) + "沾上了味道且揮之不去！";
    }
    if (originalStr.match(regex_totoReflect_Type)) {
        return  trans_from_dict(RegExp.$1) + "的屬性變得和對手的對手的" + trans_from_dict(RegExp.$2) + "一樣了！";
    }
    if (originalStr.match(regex_toReflect_Type2)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "的屬性變得和" + trans_from_dict(RegExp.$2) + "一樣了！";
    }
    if (originalStr.match(regex_toReflect_Type)) {
        return  trans_from_dict(RegExp.$1) + "的屬性變得和對手的" + trans_from_dict(RegExp.$2) + "一樣了！";
    }
    if (originalStr.match(regex_Reflect_Type)) {
        return  trans_from_dict(RegExp.$1) + "的屬性變得和" + trans_from_dict(RegExp.$2) + "一樣了！";
    }
    if (originalStr.match(regex_totaken_over)) {
        return  "繼承了對手的" + trans_from_dict(RegExp.$1) + "的" + translations[RegExp.$2] + "！";
    }
    if (originalStr.match(regex_taken_over)) {
        return  "繼承了" + trans_from_dict(RegExp.$1) + "的" + translations[RegExp.$2] + "！";
    }
    if (originalStr.match(regex_toweaker_to_fire)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "變得怕火了！";
    }
    if (originalStr.match(regex_weaker_to_fire)) {
        return  trans_from_dict(RegExp.$1) + "變得怕火了！";
    }
    if (originalStr.match(regex_tocalmed_down)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "平靜了下來。";
    }
    if (originalStr.match(regex_calmed_down)) {
        return  trans_from_dict(RegExp.$1) + "平靜了下來。";
    }
    if (originalStr.match(regex_toFlash_Fire)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "的火焰威力提高了！";
    }
    if (originalStr.match(regex_Flash_Fire)) {
        return  trans_from_dict(RegExp.$1) + "的火焰威力提高了！";
    }
    if (originalStr.match(regex_towaiting_target_move)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "正在等待一個招式進行搶奪！";
    }
    if (originalStr.match(regex_waiting_target_move)) {
        return   trans_from_dict(RegExp.$1) + "正在等待一個招式進行搶奪！";
    }
    if (originalStr.match(regex_tosnatched_move)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "搶奪了" + trans_from_dict(RegExp.$2) + "的招式！";
    }
    if (originalStr.match(regex_snatched_move)) {
        return  trans_from_dict(RegExp.$1) + "搶奪了對手的" + trans_from_dict(RegExp.$2) + "的招式！";
    }
    if (originalStr.match(regex_toMat_Block)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "舉起了一塊榻榻米擋下了即將到來的攻擊！";
    }
    if (originalStr.match(regex_Mat_Block)) {
        return  trans_from_dict(RegExp.$1) + "舉起了一塊榻榻米擋下了即將到來的攻擊！";
    }
    if (originalStr.match(regex_kicked_up_mat)) {
        return  "掀起的榻榻米擋住了" + translations[RegExp.$1] + "！";
    }
    if (originalStr.match(regex_no_wants_timer_on)) {
        return  RegExp.$1 + "不再想要開啟計時器，但計時器仍然啟動著因為" + RegExp.$2 + "仍在啟用。";
    }
    if (originalStr.match(regex_toGMax_Vine_Lash)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "被超極巨灰飛鞭滅強烈猛擊！";
    }
    if (originalStr.match(regex_GMax_Vine_Lash)) {
        return  trans_from_dict(RegExp.$1) + "被超極巨灰飛鞭滅強烈猛擊！";
    }
    if (originalStr.match(regex_toGMax_Cannonade)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "被超極巨水炮轟滅的漩渦傷害了！";
    }
    if (originalStr.match(regex_GMax_Cannonade)) {
        return  trans_from_dict(RegExp.$1) + "被超極巨水炮轟滅的漩渦傷害了！";
    }
    if (originalStr.match(regex_tosharp_steel)) {
        return  "尖銳的鋼刺紮進了對手的" + trans_from_dict(RegExp.$1) + "的體內！";
    }
    if (originalStr.match(regex_sharp_steel)) {
        return  "尖銳的鋼刺紮進了" + trans_from_dict(RegExp.$1) + "的體內！";
    }
    if (originalStr.match(regex_already_selected)) {
        return  "已經選擇了" + trans_from_dict(RegExp.$1) + "！";
    }
    if (originalStr.match(regex_toOctolock)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "受到蛸固的效果影響，變得無法逃走了！";
    }
    if (originalStr.match(regex_Octolock)) {
        return  trans_from_dict(RegExp.$1) + "受到蛸固的效果影響，變得無法逃走了！";
    }
    if (originalStr.match(regex_areintheback5)) {
        return  trans_from_dict(RegExp.$1) + ", " + trans_from_dict(RegExp.$2) + ", " + trans_from_dict(RegExp.$3) + ", " + trans_from_dict(RegExp.$4) + "和" + trans_from_dict(RegExp.$5) + "在後面。";
    }
    if (originalStr.match(regex_areintheback4)) {
        return  trans_from_dict(RegExp.$1) + ", " + trans_from_dict(RegExp.$2) + ", " + trans_from_dict(RegExp.$3) + "和" + trans_from_dict(RegExp.$4) + "在後面。";
    }
    if (originalStr.match(regex_areintheback3)) {
        return  trans_from_dict(RegExp.$1) + ", " + trans_from_dict(RegExp.$2) + "和" + trans_from_dict(RegExp.$3) + "在後面。";
    }
    if (originalStr.match(regex_areintheback2)) {
        return  trans_from_dict(RegExp.$1) + "和" + trans_from_dict(RegExp.$2) + "在後面。";
    }
    if (originalStr.match(regex_areintheback)) {
        return  trans_from_dict(RegExp.$1) + "在後面。";
    }
    if (originalStr.match(regex_toPluck_BugBite)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "偷走並吃掉了目標的" + translations[RegExp.$2] + "！";
    }
    if (originalStr.match(regex_Pluck_BugBite)) {
        return  trans_from_dict(RegExp.$1) + "偷走並吃掉了目標的" + translations[RegExp.$2] + "！";
    }
    if (originalStr.match(regex_toliquid_ooze)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "吸到了污泥漿！";
    }
    if (originalStr.match(regex_liquid_ooze)) {
        return  trans_from_dict(RegExp.$1) + "吸到了污泥漿！";
    }
    if (originalStr.match(regex_tocovered_powder)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "被粉塵包裹著！";
    }
    if (originalStr.match(regex_covered_powder)) {
        return  trans_from_dict(RegExp.$1) + "被粉塵包裹著！";
    }
    if (originalStr.match(regex_tospecial_attacks)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "獲得了對特殊攻擊的防護！";
    }
    if (originalStr.match(regex_special_attacks)) {
        return  trans_from_dict(RegExp.$1) + "獲得了對特殊攻擊的防護！";
    }
    if (originalStr.match(regex_togained_armor)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "獲得了對於物理攻擊的防護！";
    }
    if (originalStr.match(regex_gained_armor)) {
        return  trans_from_dict(RegExp.$1) + "獲得了對於物理攻擊的防護！";
    }
    if (originalStr.match(regex_toformed_school)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "一群群地聚集起來了！";
    }
    if (originalStr.match(regex_formed_school)) {
        return  trans_from_dict(RegExp.$1) + "一群群地聚集起來了！";
    }
    if (originalStr.match(regex_tostopped_schooling)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "一群群地四散而去了！";
    }
    if (originalStr.match(regex_stopped_schooling)) {
        return  trans_from_dict(RegExp.$1) + "一群群地四散而去了！";
    }
    if (originalStr.match(regex_tobursting_flame)) {
        return  "濺射的火焰擊中了對手的" + trans_from_dict(RegExp.$1) + "！";
    }
    if (originalStr.match(regex_bursting_flame)) {
        return  "濺射的火焰擊中了" + trans_from_dict(RegExp.$1) + "！";
    }
    if (originalStr.match(regex_send_offline_confirm)) {
        return  "用戶" + RegExp.$1 + "已離線。如果您仍然想對他發送信息，請再次發送消息進行確認。";
    }
    if (originalStr.match(regex_tofell_for_feint)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "中了佯攻！";
    }
    if (originalStr.match(regex_fell_for_feint)) {
        return  trans_from_dict(RegExp.$1) + "中了佯攻！";
    }
    if (originalStr.match(regex_tobroke_protection)) {
        return  "突破了對手的" + trans_from_dict(RegExp.$1) + "的守護！";
    }
    if (originalStr.match(regex_broke_protection)) {
        return  "突破了" + trans_from_dict(RegExp.$1) + "的守護！";
    }
    if (originalStr.match(regex_toalready_preparing)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "已經準備好了下輪行動！";
    }
    if (originalStr.match(regex_already_preparing)) {
        return  trans_from_dict(RegExp.$1) + "已經準備好了下輪行動！";
    }
    if (originalStr.match(regex_tobeing_withdrawn2)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "準備回來！";
    }
    if (originalStr.match(regex_being_withdrawn2)) {
        return  trans_from_dict(RegExp.$1) + "準備回來！";
    }
    if (originalStr.match(regex_toclamped_down)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "夾住了" + trans_from_dict(RegExp.$2) + "！";
    }
    if (originalStr.match(regex_clamped_down)) {
        return  trans_from_dict(RegExp.$1) + "夾住了對手的" + trans_from_dict(RegExp.$2) + "！";
    }
    if (originalStr.match(regex_totook_kind_offer)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "接受了好意！";
    }
    if (originalStr.match(regex_took_kind_offer)) {
        return  trans_from_dict(RegExp.$1) + "接受了好意！";
    }
    if (originalStr.match(regex_tohaving_nightmare)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "開始做惡夢了！";
    }
    if (originalStr.match(regex_having_nightmare)) {
        return   trans_from_dict(RegExp.$1) + "開始做惡夢了！";
    }
    if (originalStr.match(regex_reconnected2)) {
        return   RegExp.$1 + "重新連接了。";
    }
    if (originalStr.match(regex_tobecause_gravity)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "因重力而無法使出" + translations[RegExp.$2] + "！";
    }
    if (originalStr.match(regex_because_gravity)) {
        return  trans_from_dict(RegExp.$1) + "因重力而無法使出" + translations[RegExp.$2] + "！";
    }
    if (originalStr.match(regex_Invite_sent_to)) {
        return  "邀請了 " + RegExp.$1 + "！";
    }
    if (originalStr.match(regex_toGMax_Volcalith)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "被困在超極巨炎石噴發的岩石之中，疼痛難忍！";
    }
    if (originalStr.match(regex_GMax_Volcalith)) {
        return  trans_from_dict(RegExp.$1) + "被困在超極巨炎石噴發的岩石之中，疼痛難忍！";
    }
    if (originalStr.match(regex_toprotect_hurt)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "沒能防住攻擊，受到了傷害！";
    }
    if (originalStr.match(regex_protect_hurt)) {
        return  trans_from_dict(RegExp.$1) + "沒能防住攻擊，受到了傷害！";
    }
    if (originalStr.match(regex_cant_Dynamax)) {
        return  "[無效的選擇]不能使用：" + trans_from_dict(RegExp.$1) + "現在不能極巨化。";
    }
    if (originalStr.match(regex_toPower_Shift)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "互換了自身的攻擊和防禦！";
    }
    if (originalStr.match(regex_Power_Shift)) {
        return  trans_from_dict(RegExp.$1) + "互換了自身的攻擊和防禦！";
    }
    if (originalStr.match(regex_toanchored_roots)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "用紮下的根固定住了！";
    }
    if (originalStr.match(regex_anchored_roots)) {
        return  trans_from_dict(RegExp.$1) + "用紮下的根固定住了！";
    }
    if (originalStr.match(regex_toUltra_Burst)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "通過究極爆發現出了新的樣子！";
    }
    if (originalStr.match(regex_Ultra_Burst)) {
        return  trans_from_dict(RegExp.$1) + "通過究極爆發現出了新的樣子！";
    }
    if (originalStr.match(regex_from4)) {
        if (translations[RegExp.$8]) {
        originalStr = originalStr.replace(regex_from4, "");
            originalStr +=  "(因" + translations[RegExp.$2] + "而×" + RegExp.$1 + ") " + "(因" + translations[RegExp.$4] + "而×" + RegExp.$3 + ") " + "(因" + translations[RegExp.$6] + "而×" + RegExp.$5 + ") "+ "(因" + translations[RegExp.$8] + "而×" + RegExp.$7 + ")";
        }
        return originalStr.replace("因求雨而×", "因下雨而×").replace("因始源之海而×", "因大雨而×").replace("因終結之地而×", "因大日照而×");
    }
    if (originalStr.match(regex_from3)) {
        if (translations[RegExp.$6]) {
        originalStr = originalStr.replace(regex_from3, "");
            originalStr +=  "(因" + translations[RegExp.$2] + "而×" + RegExp.$1 + ") " + "(因" + translations[RegExp.$4] + "而×" + RegExp.$3 + ") " + "(因" + translations[RegExp.$6] + "而×" + RegExp.$5 + ")";
        }
        return originalStr.replace("因求雨而×", "因下雨而×").replace("因始源之海而×", "因大雨而×").replace("因終結之地而×", "因大日照而×");
    }
    if (originalStr.match(regex_from2)) {
        if (translations[RegExp.$4]) {
        originalStr = originalStr.replace(regex_from2, "");
            originalStr +=  "(因" + translations[RegExp.$2] + "而×" + RegExp.$1 + ") " + "(因" + translations[RegExp.$4] + "而×" + RegExp.$3 + ")";
        }
        return originalStr.replace("因求雨而×", "因下雨而×").replace("因始源之海而×", "因大雨而×").replace("因終結之地而×", "因大日照而×");
    }
    if (originalStr.match(regex_from)) {
        if (translations[RegExp.$2]) {
        originalStr = originalStr.replace(regex_from, "");
            originalStr +=  "(因" + translations[RegExp.$2].replace("求雨", "下雨").replace("始源之海", "大雨").replace("終結之地", "大日照") + "而×" + RegExp.$1 + ")";
        }
        return originalStr;
    }
    if (originalStr.match(regex_toProtective_Pads)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "因部位護具而保護了自身！";
    }
    if (originalStr.match(regex_Protective_Pads)) {
        return  trans_from_dict(RegExp.$1) + "因部位護具而保護了自身！";
    }
    if (originalStr.match(regex_toAbility_Shield)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "的特性正受到特性護具效果的保護！";
    }
    if (originalStr.match(regex_Ability_Shield)) {
        return  trans_from_dict(RegExp.$1) + "的特性正受到特性護具效果的保護！";
    }
    if (originalStr.match(regex_togrudge)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "因怨念而失去了" + translations[RegExp.$2] + "的全部PP！";
    }
    if (originalStr.match(regex_grudge)) {
        return   trans_from_dict(RegExp.$1) + "因怨念而失去了" + translations[RegExp.$2] + "的全部PP！";
    }
    if (originalStr.match(regex_toalready_has_burn)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "已經灼傷了。";
    }
    if (originalStr.match(regex_already_has_burn)) {
        return  trans_from_dict(RegExp.$1) + "已經灼傷了。";
    }
    if (originalStr.match(regex_already_searching)) {
        return  "無法搜索：你已經在搜索一場" + RegExp.$1 + "對戰了。";
    }
    if (originalStr.match(regex_todoesnt_become_confused)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "並沒有混亂！";
    }
    if (originalStr.match(regex_doesnt_become_confused)) {
        return  trans_from_dict(RegExp.$1) + "並沒有混亂！";
    }
    if (originalStr.match(regex_already_challenge)) {
        return  "你和" + RegExp.$2 + "之間已經有了一場" + RegExp.$1 + "挑戰了！";
    }
    if (originalStr.match(regex_tobecause_Heal_Block)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "因回復封鎖而無法使出" + translations[RegExp.$2] + "！";
    }
    if (originalStr.match(regex_because_Heal_Block)) {
        return  trans_from_dict(RegExp.$1) + "因回復封鎖而無法使出" + translations[RegExp.$2] + "！";
    }
    if (originalStr.match(regex_offering_tie)) {
        return  RegExp.$1 + "請求平局。";
    }
    if (originalStr.match(regex_rejected_accepted_tie)) {
        return  RegExp.$1 + trans_from_dict(RegExp.$2 == "rejected" ? "拒絕" : "同意") + "了平局。";
    }
    if (originalStr.match(regex_toStickyBarb_burn_BlackSludge)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "受到了" + trans_from_dict(RegExp.$2 == "Sticky Barb" ? "附著針" : RegExp.$2 == "burn"  ? "灼傷" : "黑色污泥") + "的傷害！";
    }
    if (originalStr.match(regex_StickyBarb_burn_BlackSludge)) {
        return  trans_from_dict(RegExp.$1) + "受到了" + trans_from_dict(RegExp.$2 == "Sticky Barb" ? "附著針" : RegExp.$2 == "burn"  ? "灼傷" : "黑色污泥") + "的傷害！";
    }
    if (originalStr.match(regex_toCrafty_Quick_Wide_Shield)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "受到了" + trans_from_dict(RegExp.$1 == "Crafty" ? "戲法" : RegExp.$1 == "Quick"  ? "快速" : "廣域")  + "防守的保護！";
    }
    if (originalStr.match(regex_Crafty_Quick_Wide_Shield)) {
        return  trans_from_dict(RegExp.$1) + "受到了" + trans_from_dict(RegExp.$1 == "Crafty" ? "戲法" : RegExp.$1 == "Quick"  ? "快速" : "廣域")  + "防守的保護！";
    }
    if (originalStr.match(regex_toTreasures_of_ruin)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "的" + translations[RegExp.$2] + "令周圍的寶可夢的" + translations[RegExp.$3] + "減弱了！";
    }
    if (originalStr.match(regex_Treasures_of_ruin)) {
        return  trans_from_dict(RegExp.$1) + "的" + translations[RegExp.$2] + "令周圍的寶可夢的" + translations[RegExp.$3] + "減弱了！";
    }
    if (originalStr.match(regex_Specific_to)) {
        return  translations[RegExp.$1] + "的專屬道具";
    }
    if (originalStr.match(regex_toprotective_mist)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "受到了薄霧場地的保護！";
    }
    if (originalStr.match(regex_protective_mist)) {
        return  trans_from_dict(RegExp.$1) + "受到了薄霧場地的保護！";
    }
    if (originalStr.match(regex_torose)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "的" + translations[RegExp.$2] + trans_from_dict(RegExp.$3 == "rose drastically" ? "巨幅提高" : RegExp.$3 == "rose sharply"  ? "大幅提高" : "提高")  + "了！";
    }
    if (originalStr.match(regex_rose)) {
        return  trans_from_dict(RegExp.$1) + "的" + translations[RegExp.$2] + trans_from_dict(RegExp.$3 == "rose drastically" ? "巨幅提高" : RegExp.$3 == "rose sharply"  ? "大幅提高" : "提高")  + "了！";
    }
    if (originalStr.match(regex_tofell)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "的" + translations[RegExp.$2] + trans_from_dict(RegExp.$3 == "fell severely" ? "巨幅降低" : RegExp.$3 == "fell harshly"  ? "大幅降低" : "降低") + "了！";
    }
    if (originalStr.match(regex_fell)) {
        return   trans_from_dict(RegExp.$1) + "的" + translations[RegExp.$2] + trans_from_dict(RegExp.$3 == "fell severely" ? "巨幅降低" : RegExp.$3 == "fell harshly"  ? "大幅降低" : "降低") + "了！";
    }
    if (originalStr.match(regex_toperishsong)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "的滅亡計時變成" + RegExp.$2 + "了！";
    }
    if (originalStr.match(regex_perishsong)) {
        return  trans_from_dict(RegExp.$1) + "的滅亡計時變成" + RegExp.$2 + "了！";
    }
    if (originalStr.match(regex_toDestiny_Knot)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "因紅線而著迷了！";
    }
    if (originalStr.match(regex_Destiny_Knot)) {
        return  trans_from_dict(RegExp.$1) + "因紅線而著迷了！";
    }
    if (originalStr.match(regex_toBerserk_Gene)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "用破壞基因大幅提高了攻擊！";
    }
    if (originalStr.match(regex_Berserk_Gene)) {
        return  trans_from_dict(RegExp.$1) + "用破壞基因大幅提高了攻擊！";
    }
    if (originalStr.match(regex_Guessed_spread)) {
        originalStr = originalStr.replace("");
        originalStr = translations[RegExp.$1] + ": " + RegExp.$2 + " " + translations[RegExp.$3] + " / " + RegExp.$4 + " " + translations[RegExp.$5] + " / " + RegExp.$6 + " " + translations[RegExp.$7] + RegExp.$8;
         return originalStr.replace("Atk", "攻擊").replace("Def", "防禦").replace("SpA", "特攻").replace("SpD", "特防").replace("Spe", "速度").replace("+Atk", "+攻擊").replace("+Def", "+防禦").replace("+SpA", "+特攻").replace("+SpD", "+特防").replace("+Spe", "+速度");
    }
    if (originalStr.match(regex_Guessed_spread3)) {
        originalStr = originalStr.replace("");
        originalStr = RegExp.$1 + " " + translations[RegExp.$2] + " / " + RegExp.$3 + " " + translations[RegExp.$4] + " / " + RegExp.$5 + " " + translations[RegExp.$6] + RegExp.$7;
         return originalStr.replace("Atk", "攻擊").replace("Def", "防禦").replace("SpA", "特攻").replace("SpD", "特防").replace("Spe", "速度").replace("+Atk", "+攻擊").replace("+Def", "+防禦").replace("+SpA", "+特攻").replace("+SpD", "+特防").replace("+Spe", "+速度");
    }
    if (originalStr.match(regex_Guessed_spread4)) {
        originalStr = originalStr.replace("");
        originalStr = RegExp.$1 + " " + translations[RegExp.$2] + " / " + RegExp.$3 + " " + translations[RegExp.$4] + RegExp.$5;
         return originalStr.replace("Atk", "攻擊").replace("Def", "防禦").replace("SpA", "特攻").replace("SpD", "特防").replace("Spe", "速度").replace("+Atk", "+攻擊").replace("+Def", "+防禦").replace("+SpA", "+特攻").replace("+SpD", "+特防").replace("+Spe", "+速度");
    }
    if (originalStr.match(regex_Teaches)) {
            return  "教會某些寶可夢" + translations[RegExp.$1] + "。一次性使用";
    }
    if (originalStr.match(regex_allows_ZMove)) {
            return  trans_from_dict(RegExp.$1 == "a" ? "擁有" : "擁有") + translations[RegExp.$2] + "屬性招式的攜帶者可以使" + trans_from_dict(RegExp.$3 == "a" ? "用" : "用") + translations[RegExp.$4] + "屬性Z招式";
    }
    if (originalStr.match(regex_Multi_Attack)) {
            return  "攜帶後多屬性攻擊變為" + translations[RegExp.$1] + "屬性";
    }
    if (originalStr.match(regex_Judgment)) {
            return  "攜帶後" + translations[RegExp.$1] + "招式威力提升20%，制裁光礫變為" + translations[RegExp.$2] + "屬性";
    }
    if (originalStr.match(regex_attacks_have)) {
            return  "攜帶後" + translations[RegExp.$1] + "屬性招式威力提升" + RegExp.$2 + "0%";
    }
    if (originalStr.match(regex_Gem)) {
            return  "使用" + translations[RegExp.$1] + "屬性招式時提升本次攻擊" + RegExp.$2 + "0%的威力。使用後消失";
    }
    if (originalStr.match(regex_taken_supereffective)) {
            return  "受到效果絕佳的" + translations[RegExp.$1] + "屬性招式時傷害減半。使用後消失";
    }
    if (originalStr.match(regex_Can_revived)) {
            return  "可以用來復活" + translations[RegExp.$1];
    }
    if (originalStr.match(regex_Evolves)) {
            return  translations[RegExp.$1] + trans_from_dict(RegExp.$3 == "us" ? "使用" : "攜帶並通信交換") + "後，進化為" + translations[RegExp.$2];
    }
    if (originalStr.match(regex_confuses_Nature)) {
            return  "HP低於" + RegExp.$2 + "最大HP時，恢覆最大HP的" + RegExp.$1 + "，減" + translations[RegExp.$3] + "性格會混亂。使用後消失";
    }
    if (originalStr.match(regex_Mega_Evolve_item)){
        if (translations[RegExp.$2])
           return  trans_from_dict(RegExp.$1 == "a" ? "讓" : "讓") + translations[RegExp.$2] + "攜帶後，在戰鬥時可以進行超級進化";
             else
                return trans_from_dict(RegExp.$1 == "a" ? "讓" : "讓") + RegExp.$2 + "攜帶後，在戰鬥時可以進行超級進化"
    }
    if (originalStr.match(regex_Spe_to)) {
            return   ": " + RegExp.$1 + " 至 " + RegExp.$2;
    }
    if (originalStr.match(regex_battles_ballte)) {
            return  RegExp.$1 + "場 " + RegExp.$2 + trans_from_dict(RegExp.$3 == "battles" ? "對戰" : "對戰");
    }
    if (originalStr.match(regex_Turn)) {
            return  "回合 " + RegExp.$1;
    }
    if (originalStr.match(regex_Transformed_into2)) {
            return "(變成了" + translations[RegExp.$1] + ")";
    }
    if (originalStr.match(regex_knocked_off)) {
           return  translations[RegExp.$1] + " (拍落)";
    }
    if (originalStr.match(regex_hid_replay)) {
           return  RegExp.$1 + "隱藏了這場戰鬥的回放。";
    }
    if (originalStr.match(regex_weather_suppressed)) {
        if (translations[RegExp.$2])
            return  "(" + translations[RegExp.$2] + "使" + trans_from_dict(RegExp.$1 == "Snow" ? "下雪" : RegExp.$1 == "Hail"  ? "冰雹" : RegExp.$1 == "Desolate Land"  ? "大日照" : RegExp.$1 == "Sunny Day"  ? "大晴天" : RegExp.$1 == "Primordial Sea" ? "始源之海": RegExp.$1 == "Rain Dance" ? "下雨" : "沙暴") + "的影響無效了)";
    }
    if (originalStr.match(regex_Nature_Power)) {
            return "自然之力變成了" + translations[RegExp.$1] + "！";
    }
    if (originalStr.match(regex_Use_different_nature)) {
            return "使用這種性格可以多出" + RegExp.$1 + "點努力值:";
    }
    if (originalStr.match(regex_made_hidden)) {
           return  RegExp.$1 + "將房間隱藏了。";
    }
    if (originalStr.match(regex_made_public)) {
           return  RegExp.$1 + "將房間公開了。";
    }
    if (originalStr.match(regex_tofell_sky)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "因重力而掉到了地面！";
    }
    if (originalStr.match(regex_fell_sky)) {
        return  trans_from_dict(RegExp.$1) + "因重力而掉到了地面！";
    }
    if (originalStr.match(regex_lol)) {
        return  "您還沒有" + RegExp.$1.replace(" ", "") + "隊伍";
    }





   //  \s

    if (originalStr.match(regex_Mega_Evolution)) {
            return  "Mega進化";
    }
    if (originalStr.match(regex_Fallen)) {
            return  "倒下的同伴：" + RegExp.$1;
    }
    if (originalStr.match(regex_modifiers)) {
        if (translations[RegExp.$2])
            return  " " + RegExp.$1.replace("×", "x ") + translations[RegExp.$2].replace("命中率", "命中").replace("閃避率", "閃避");
    }
    if (originalStr.match(regex_modifiers2)) {
            return  translations[RegExp.$2] + "已經×" + RegExp.$1 + "了";
    }
    if (originalStr.match(regex_PQ)) {
            return  trans_from_dict(RegExp.$1 == "Protosynthesis" ? "古代活性" : "夸克充能") + "：" + translations[RegExp.$2];
    }
    if (originalStr.match(regex_NR)) {
            return  "背水一戰";
    }
    if (originalStr.match(regex_LR)) {
            return  "寄生種子";
    }
    if (originalStr.match(regex_SC)) {
            return  "鹽腌";
    }
    if (originalStr.match(regex_SC2)) {
            return  "複製了能力";
    }
    if (originalStr.match(regex_DB)) {
            return  "同命";
    }
    if (originalStr.match(regex_SD)) {
            return  "擊落";
    }
    if (originalStr.match(regex_MS)) {
            return  "熔岩風暴";
    }
    if (originalStr.match(regex_FS)) {
            return  "火焰旋渦";
    }
    if (originalStr.match(regex_ST)) {
            return  "流沙地獄";
    }
    if (originalStr.match(regex_ST2)) {
            return  "捕獸夾";
    }
    if (originalStr.match(regex_TC)) {
            return  "雷電囚籠";
    }
    if (originalStr.match(regex_TC2)) {
            return  "地獄突刺";
    }
    if (originalStr.match(regex_ME)) {
            return  "奇跡之眼";
    }
    if (originalStr.match(regex_OS)) {
            return  "氣味偵測";
    }
    if (originalStr.match(regex_HB)) {
            return  "回復封鎖";
    }
    if (originalStr.match(regex_HBE)) {
            return  "回復封鎖解除了";
    }
    if (originalStr.match(regex_PS)) {
            return  RegExp.$1 + "回合後滅亡";
    }
    if (originalStr.match(regex_PNT)) {
            return  "下回合滅亡";
    }
    if (originalStr.match(regex_PN)) {
            return  "立即滅亡";
    }
    if (originalStr.match(regex_TS)) {
            return  "瀝青射擊";
    }
    if (originalStr.match(regex_TS2)) {
            return  "陷阱甲殼";
    }
    if (originalStr.match(regex_TS3)) {
            return  "無理取鬧解除了";
    }
    if (originalStr.match(regex_MR)) {
            return  "需要恢覆精力";
    }
    if (originalStr.match(regex_MR2)) {
            return  "電磁飄浮";
    }
    if (originalStr.match(regex_RP)) {
            return  "憤怒粉";
    }
    if (originalStr.match(regex_FM)) {
             return  "看我嘛";
    }
    if (originalStr.match(regex_CHB)) {
            return  "易中要害";
    }
    if (originalStr.match(regex_LF)) {
            return  "磨礪";
    }
    if (originalStr.match(regex_HH)) {
            return  "幫助";
    }
    if (originalStr.match(regex_PT)) {
            return  "力量戲法";
    }
    if (originalStr.match(regex_WG)) {
            return  "廣域防守";
    }
    if (originalStr.match(regex_QG)) {
            return  "快速防守";
    }
    if (originalStr.match(regex_MB)) {
            return  "掀榻榻米";
    }
    if (originalStr.match(regex_MC)) {
            return  "魔法反射";
    }
    if (originalStr.match(regex_GR)) {
            return  "巨劍突擊";
    }
    if (originalStr.match(regex_BB)) {
            return  "鳥嘴加農炮";
    }
    if (originalStr.match(regex_AR)) {
            return  "水流環";
    }
    if (originalStr.match(regex_SS)) {
            return  "慢啟動";
    }
    if (originalStr.match(regex_BO)) {
            return  "靛藍色寶珠";
    }
    if (originalStr.match(regex_RO)) {
            return  "朱紅色寶珠";
    }
    if (originalStr.match(regex_AS)) {
            return  "迷人解除了";
    }
    if (originalStr.match(regex_DS)) {
            return  "定身法解除了";
    }
    if (originalStr.match(regex_ES)) {
            return  "再來一次解除了";
    }
    if (originalStr.match(regex_TE)) {
            return  "挑釁解除了";
    }
    if (originalStr.match(regex_CE)) {
            return  "混亂解除了";
    }
    if (originalStr.match(regex_IKO)) {
            return  "物品被拍落了";
    }
    if (originalStr.match(regex_FF)) {
            return  "引火";
    }
    if (originalStr.match(regex_IF)) {
            return  "正在封印對手";
    }
    if (originalStr.match(regex_AP)) {
            return  "已經中毒了";
    }
    if (originalStr.match(regex_AP2)) {
            return  "已經麻痹了";
    }
    if (originalStr.match(regex_AB)) {
            return  "已經灼傷了";
    }
    if (originalStr.match(regex_LS)) {
            return  "正在偷懶";
    }
    if (originalStr.match(regex_SDB)) {
            return  "能力不會降低";
    }
    if (originalStr.match(regex_BL)) {
            return  "失去了能力提升";
    }
    if (originalStr.match(regex_Guessed_spread2)) {
            return  "分配推測：(請選擇4個招式以獲得分配推測) (";
    }





   //  debug

    if (originalStr.match(regex_totoknock)) {
        return "對手的" + trans_from_dict(RegExp.$1) + "拍落了對手的" + trans_from_dict(RegExp.$2) + "的" + translations[RegExp.$3] + "！";
    }
    if (originalStr.match(regex_toknock2)) {
        return "對手的" + trans_from_dict(RegExp.$1) + "拍落了" + trans_from_dict(RegExp.$2) + "的" + translations[RegExp.$3] + "！";
    }
    if (originalStr.match(regex_toknock)) {
        return  trans_from_dict(RegExp.$1) + "拍落了對手的" + trans_from_dict(RegExp.$2) + "的" + translations[RegExp.$3] + "！";
    }
    if (originalStr.match(regex_knock)) {
        return  trans_from_dict(RegExp.$1) + "拍落了" + trans_from_dict(RegExp.$2) + "的" + translations[RegExp.$3] + "！";
    }
    if (originalStr.match(regex_knock2)) {
        if (translations[RegExp.$2])
        return  "拍落了" + trans_from_dict(RegExp.$1) + "的" + translations[RegExp.$2] + "！";
    }
    if (originalStr.match(regex_totothief)) {
        return "對手的" + trans_from_dict(RegExp.$1) + "奪取了對手的" + trans_from_dict(RegExp.$2) + "的" + translations[RegExp.$3] + "！";
    }
    if (originalStr.match(regex_tothief2)) {
        return "對手的" + trans_from_dict(RegExp.$1) + "奪取了" + trans_from_dict(RegExp.$2) + "的" + translations[RegExp.$3] + "！";
    }
    if (originalStr.match(regex_tothief)) {
        return  trans_from_dict(RegExp.$1) + "奪取了對手的" + trans_from_dict(RegExp.$2) + "的" + translations[RegExp.$3] + "！";
    }
    if (originalStr.match(regex_thief)) {
        return  trans_from_dict(RegExp.$1) + "奪取了" + trans_from_dict(RegExp.$2) + "的" + translations[RegExp.$3] + "！";
    }
    if (originalStr.match(regex_tototrace)) {
        return "對手的" + trans_from_dict(RegExp.$1) + "複製了對手的" + trans_from_dict(RegExp.$2) + "的" + translations[RegExp.$3] + "！";
    }
    if (originalStr.match(regex_totrace2)) {
        return "對手的" + trans_from_dict(RegExp.$1) + "複製了" + trans_from_dict(RegExp.$2) + "的" + translations[RegExp.$3] + "！";
    }
    if (originalStr.match(regex_totrace)) {
        return  trans_from_dict(RegExp.$1) + "複製了對手的" + trans_from_dict(RegExp.$2) + "的" + translations[RegExp.$3] + "！";
    }
    if (originalStr.match(regex_trace)) {
        return  trans_from_dict(RegExp.$1) + "複製了" + trans_from_dict(RegExp.$2) + "的" + translations[RegExp.$3] + "！";
    }
    if (originalStr.match(regex_totoroleplay)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "複製了對手的" + trans_from_dict(RegExp.$2) + "的特性" + translations[RegExp.$3] + "！";
    }
    if (originalStr.match(regex_toroleplay2)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "複製了" + trans_from_dict(RegExp.$2) + "的特性" + translations[RegExp.$3] + "！";
    }
    if (originalStr.match(regex_toroleplay)) {
        return   trans_from_dict(RegExp.$1) + "複製了對手的" + trans_from_dict(RegExp.$2) + "的特性" + translations[RegExp.$3] + "！";
    }
    if (originalStr.match(regex_roleplay)) {
        return   trans_from_dict(RegExp.$1) + "複製了" + trans_from_dict(RegExp.$2) + "的特性" + translations[RegExp.$3] + "！";
    }
    if (originalStr.match(regex_tocannot_use)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "無法使出" + translations[RegExp.$2].replace("節拍器", "揮指").replace("超能力", "精神強念").replace("刷新", "煥然一新").replace("不開啟", "定身法") + "！";
    }
    if (originalStr.match(regex_cannot_use)) {
        return   trans_from_dict(RegExp.$1) + "無法使出" + translations[RegExp.$2].replace("節拍器", "揮指").replace("超能力", "精神強念").replace("刷新", "煥然一新").replace("不開啟", "定身法") + "！";
    }
    if (originalStr.match(regex_tostockpiled)) {
         return   "對手的" + trans_from_dict(RegExp.$1) + "蓄力了" + RegExp.$2 + "次！";
    }
    if (originalStr.match(regex_stockpiled)) {
         return   trans_from_dict(RegExp.$1) + "蓄力了" + RegExp.$2 + "次！";
    }
    if (originalStr.match(regex_toihb)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "受到了" + trans_from_dict(RegExp.$2) + "的傷害！";
    }
    if (originalStr.match(regex_ihb)) {
        return  trans_from_dict(RegExp.$1) + "受到了" + trans_from_dict(RegExp.$2) + "的傷害！";
    }
    if (originalStr.match(regex_tofreed)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "從" + trans_from_dict(RegExp.$2) + "中解脫了！";
    }
    if (originalStr.match(regex_freed)) {
        return  trans_from_dict(RegExp.$1) + "從" + trans_from_dict(RegExp.$2) + "中解脫了！";
    }
    if (originalStr.match(regex_tocant_use)) {
        return "對手的" + trans_from_dict(RegExp.$1) + "無法使出" + translations[RegExp.$2].replace("節拍器", "揮指").replace("超能力", "精神強念").replace("刷新", "煥然一新").replace("不開啟", "定身法") + "！";
    }
    if (originalStr.match(regex_cant_use)) {
        return trans_from_dict(RegExp.$1) + "無法使出" + translations[RegExp.$2].replace("節拍器", "揮指").replace("超能力", "精神強念").replace("刷新", "煥然一新").replace("不開啟", "定身法") + "！";
    }
    if (originalStr.match(regex_totrapped)) {
         return   "對手的" + trans_from_dict(RegExp.$1) + "困住了" + trans_from_dict(RegExp.$2) + "！";
    }
    if (originalStr.match(regex_trapped)) {
         return   trans_from_dict(RegExp.$1) + "困住了對手的" + trans_from_dict(RegExp.$2) + "！";
    }
    if (originalStr.match(regex_joined)) {
        return RegExp.$1.replace(", ", "，" ).replace(/ and /i ," 和 ") + "加入了房間";
    }
    if (originalStr.match(regex_left)) {
        return RegExp.$1.replace(", ", "，" ).replace(/ and /i ," 和 ").replace(/ joined; /i ,"加入了房間; ") + "離開了";
    }
    if (originalStr.match(regex_toeerie_spell)) {
        return   "削減了對手的" + trans_from_dict(RegExp.$1) + "的" + translations[RegExp.$2].replace("節拍器", "揮指").replace("超能力", "精神強念").replace("刷新", "煥然一新").replace("不開啟", "定身法") + "的PP" + RegExp.$3 + "點！";
    }
    if (originalStr.match(regex_eerie_spell)) {
        return   "削減了" + trans_from_dict(RegExp.$1) + "的" + translations[RegExp.$2].replace("節拍器", "揮指").replace("超能力", "精神強念").replace("刷新", "煥然一新").replace("不開啟", "定身法") + "的PP" + RegExp.$3 + "點！";
    }
    if (originalStr.match(regex_Unavailable_choice_cant_move)) {
        return  "[無效的選擇] 無法使出:" + trans_from_dict(RegExp.$1) + "的" + translations[RegExp.$2].replace("節拍器", "揮指").replace("超能力", "精神強念").replace("刷新", "煥然一新").replace("不開啟", "定身法") + "被禁用";
    }
     if (originalStr.match(regex_toleppaberry)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "用蘋野果恢覆了" + translations[RegExp.$2].replace("節拍器", "揮指").replace("超能力", "精神強念").replace("刷新", "煥然一新").replace("不開啟", "定身法") + "的PP！";
    }
     if (originalStr.match(regex_leppaberry)) {
        return  trans_from_dict(RegExp.$1) + "用蘋野果恢覆了" + translations[RegExp.$2].replace("節拍器", "揮指").replace("超能力", "精神強念").replace("刷新", "煥然一新").replace("不開啟", "定身法") + "的PP！";
    }
    if (originalStr.match(regex_tostat_changes)) {
        return   "對手的" + trans_from_dict(RegExp.$1) + "的能力等級變化了！";
    }
    if (originalStr.match(regex_stat_changes)) {
        return   trans_from_dict(RegExp.$1) + "的能力等級變化了！";
    }
    if (originalStr.match(regex_tosymbiosis)) {
         return   "對手的" + trans_from_dict(RegExp.$1) + "將" + translations[RegExp.$2] + "交給了對手的" + trans_from_dict(RegExp.$3) + "！";
    }
    if (originalStr.match(regex_symbiosis)) {
         return   trans_from_dict(RegExp.$1) + "將" + translations[RegExp.$2] + "交給了" + trans_from_dict(RegExp.$3) + "！";
    }
    if (originalStr.match(regex_tohigh_low)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "的" + translations[RegExp.$2] + "已經" + trans_from_dict(RegExp.$3 == "higher" ? "無法再提高" : "降到最低") + "了！";
    }
    if (originalStr.match(regex_high_low)) {
        return   trans_from_dict(RegExp.$1) + "的" + translations[RegExp.$2] + "已經" + trans_from_dict(RegExp.$3 == "higher" ? "無法再提高" : "降到最低") + "了！";
    }
    if (originalStr.match(regex_towas_heightened)) {
        return  "對手的" +  trans_from_dict(RegExp.$1) + "的" + translations[RegExp.$2] + "升高了！";
    }
    if (originalStr.match(regex_was_heightened)) {
        return  trans_from_dict(RegExp.$1) + "的" + translations[RegExp.$2] + "升高了！";
    }
    if (originalStr.match(regex_Move_here)) {
            return  "移動至";
    }
    if (originalStr.match(regex_to_used)) {
        return  "對手的" + trans_from_dict(RegExp.$1) + "使出了";
    }
    if (originalStr.match(regex_used)) {
        return  trans_from_dict(RegExp.$1) + "使出了";
    }
    if (originalStr.match(regex_to123)) {
        if (translations[RegExp.$2])
        return  "[對手的" + trans_from_dict(RegExp.$1) + "的" + translations[RegExp.$2] + "]";
    }
    if (originalStr.match(regex_123)) {
        if (translations[RegExp.$2])
        return  "[" + trans_from_dict(RegExp.$1) + "的" + translations[RegExp.$2] + "]";
    }
    if (originalStr.match(regex_1234)) {
        if (translations[RegExp.$1])
            return "(" + translations[RegExp.$1] + ")";
    }
    if (originalStr.match(regex_12345)) {
        if (translations[RegExp.$1])
            return translations[RegExp.$1] + "(";
    }
    if (originalStr.match(regex_9)) {
        if (translations[RegExp.$9])
            return  translations[RegExp.$1] + " / " + translations[RegExp.$2] +" / " + translations[RegExp.$3] +" / " + translations[RegExp.$4] +" / " + translations[RegExp.$5] +" / " + translations[RegExp.$6] +" / " + translations[RegExp.$7] + " / " + translations[RegExp.$8] +" / " + translations[RegExp.$9];
        return originalStr;
    }
    if (originalStr.match(regex_6)) {
        if (translations[RegExp.$6])
            return  translations[RegExp.$1] + " / " + translations[RegExp.$2] +" / " + translations[RegExp.$3] +" / " + translations[RegExp.$4] +" / " + translations[RegExp.$5] +" / " + translations[RegExp.$6];
        return originalStr;
    }
    if (originalStr.match(regex_5)) {
        if (translations[RegExp.$5])
            return  translations[RegExp.$1] + " / " + translations[RegExp.$2] +" / " + translations[RegExp.$3] +" / " + translations[RegExp.$4] +" / " + translations[RegExp.$5];
        return originalStr;
    }
    if (originalStr.match(regex_4)) {
        if (translations[RegExp.$4])
            return  translations[RegExp.$1] + " / " + translations[RegExp.$2] +" / " + translations[RegExp.$3] +" / " + translations[RegExp.$4];
        return originalStr;
    }
    if (originalStr.match(regex_3)) {
        if (translations[RegExp.$3])
            return  translations[RegExp.$1] + " / " + translations[RegExp.$2] +" / " + translations[RegExp.$3];
        return originalStr;
        }
    if (originalStr.match(regex_2)) {
        if (translations[RegExp.$2])
            return  translations[RegExp.$1] + " / " + translations[RegExp.$2];
        return originalStr;
    }
    if (originalStr.match(regex_1)) {
        if (translations[RegExp.$1])
        originalStr = originalStr.replace("");
            originalStr =  translations[RegExp.$1] + " / ";
        return originalStr;
    }
    if (originalStr.match(regex_111)) {
            return  trans_from_dict(RegExp.$1 == "不開啟" ? "定身法" : RegExp.$1 == "超能力"  ? "精神強念" : RegExp.$1 == "節拍器"  ? "揮指" : RegExp.$1 == "刷新"  ? "煥然一新" : "攻擊 ") ;
    }
    if (originalStr.match(/^！(.+?)$/)) {
            return  "!" + RegExp.$1;
    }

    //多個可能特性
    if (originalStr[0] == " " && originalStr.indexOf(', ') > 0) {
        var ret = [];
        for (var ability of originalStr.trim().split(', ')) {
            ret.push(trans_from_dict(ability));
        }
        return ret.join('，');
    }
    //else
    return originalStr.replace("(Private)", "(私密的隊伍)").replace("(Tera type BP minimum)", "(太晶化後的最低招式威力為60)").replace("挑戰Cup", "Challenge Cup").replace("Possible Illusion", "可能是幻覺").replace("(priority", "(優先度").replace("Hidden Power 精神強念", "覺醒力量-超能力").replace("(approximate)", "(近似計算)").replace("[sent offline", "[離線發送").replace("of its health!)", "的生命值！)").replace("'s replays", "的回放").replace("精神強念 Noise", "精神噪音").replace("精神強念 Fangs", "精神之牙").replace("精神強念 Terrain", "精神場地").replace("(Hit 1 time)", "(受到1次傷害)").replace("(Hit 2 times)", "(受到2次傷害)").replace("(Hit 3 times)", "(受到3次傷害)").replace("(Hit 4 times)", "(受到4次傷害)").replace("(Hit 5 times)", "(受到5次傷害)").replace("(Hit 6 times)", "(受到6次傷害)").replace("(no Terrain)", "(沒有場地)").replace("(Artist:", "(畫家:").replace("(blocked by target's Dynamax)", "(對極巨化寶可夢無效)").replace("(fails if target's level is higher)", "(如果目標等級更高，使用失敗)").replace("(+1% per level above target)", "(比目標每高1級，命中率+1%)").replace("(not Ice-type)", "(不是冰屬性)");

    //.replace(/Ability: ([A-z ]+)/,"特性: "+translate(RegExp.$1))
    //.replace(/Ability: \/ Item: ([A-z ]+)/,"特性: "++"/ 道具:"+translate("$2"))

    ;
}
function translateElement(element) {
    if (element.tagName == 'SCRIPT') return;
    var elTW = document.createTreeWalker(element, NodeFilter.SHOW_Element, null, false);
    var node = null;
    var translate = t;
    while ((node = elTW.nextNode()) != null) {
        if (node.nodeType == 3) {
            if (node.tagName == 'SCRIPT') continue;
            var value = node.nodeValue;
            if (value.startsWith("Deals damage to the opposing Pokemon equal to twice the damage dealt by the last move used in the battle. This move ignores")) node.nodeValue = "對最後使用招式造成自身傷害的對應位置寶可夢為目標，造成受到的招式×2倍固定傷害。該招式可以對沒有效果的屬性的寶可夢造成傷害。如果使用者先行動，或對手最後使出的招式是雙倍奉還、0威力招式、不是一般或格鬥屬性的招式，使用失敗。";
            if (value.startsWith("If this move is successful, it deals damage or heals the target. 102/256 chance for")) node.nodeValue = "隨機選擇如下效果：102/256幾率以40威力攻擊對手；76/256幾率以80威力攻擊對手；26/256幾率以120威力攻擊對手；52/256幾率回復對手1/4的最大HP(向下取整)。在第二世代使用禮物招式時，傷害計算公式中的等級、攻擊、防禦變量的值會發生改變。攻擊的值會變為5（岩石屬性或鋼屬性）或10（其他屬性）。等級與防禦的值由寶可夢的屬性決定，其中等級會變為防禦方寶可夢第二屬性的內部編號，防禦會變為攻擊方寶可夢第二屬性的內部編號（如果攻擊方或防禦方寶可夢只有一種屬性，按照該寶可夢的第一屬性計算）。各屬性的內部編號如下：0=一般，1=格鬥，2=飛行，3=毒，4=地面，5=岩石，7=蟲，8=幽靈，9=鋼，20=火，21=水，22=草，23=電，24=超能力，25=冰，26=龍，27=惡。";
            if (value.startsWith("The user spends two turns locked into this move and then, on the second turn after using this move, the user attacks the last Pokemon that hit")) node.nodeValue = "進入忍耐狀態，2回合內無法使用其它招式、使用道具或交換寶可夢。第三回合以處於忍耐狀態期間，上一次使用攻擊招式對使用者造成傷害的對手所在場地的寶可夢為目標，對目標造成處於忍耐狀態期間受到攻擊招式的總傷害×2的傷害。該招式無法對沒有效果的屬性的寶可夢造成傷害，但忽略其它屬性相克和屬性一致加成且必定命中。";
            if (value.startsWith("The user and its ally's Abilities change to match the target's Ability. Does not")) node.nodeValue = "將自身和同伴的特性轉變為目標的特性。以下情況時，招式使用失敗：使用者或同伴與目標特性相同；目標特性為神奇守護、複製、接球手、化學之力、陰晴不定、花之禮、多屬性、變身者、幻覺、達摩模式、戰鬥切換、群聚變形、牽絆變身、畫皮、魚群、界限盾殼、AR系統、飽了又餓、一口飛彈、結凍頭、人馬一體、絕對睡眠、化學變化氣體、全能變身、發號施令、古代活性和夸克充能； 或者使用者或同伴的特性為多屬性、達摩模式、戰鬥切換、群聚變形、牽絆變身、畫皮、魚群、界限盾殼、AR系統、一口飛彈、結凍頭、人馬一體、絕對睡眠、全能變身、發號施令、古代活性和夸克充能。";
            if (value.startsWith("The user's type changes to match a type that resists or is immune to the type of the last move used by the target, but not either of its current types. The determined type of the move is used rather than the original type. Fails if")) node.nodeValue = "自身的屬性改變為上回合目標使用招式的屬性對自身效果不理想或沒有效果的屬性。屬性隨機選擇，並且不為自身當前屬性。如果沒有合適的新屬性，招式使用會失敗。無視目標在使用招式之後的屬性及特性變化，例如目標在使用招式時擁有一般皮膚特性，則紋理2按一般屬性計算，即使在目標使用招式後被消除了一般皮膚特性。如果目標沒有使用過招式，或使用者無法改變屬性，或此招式只能變成自身的當前屬性，使用失敗。";
            if (value.startsWith("The user swaps its Attack and Defense stats, and stat stage changes remain on their respective stats. This move can be used again to swap the stats back. If")) node.nodeValue = "交換自身的攻擊和防禦。對應的能力變化不交換，作用於交換後對應的能力值上。此狀態被接棒招式轉移給其它寶可夢後，以使用當前寶可夢的能力值計算，不以接棒使用者的能力值計算。如果先使用此招式，再使用變身，變身後的能力值覆蓋其前的能力值。";
            if (value.startsWith("The user's Ability changes to match the target's Ability. Fails if")) node.nodeValue = "把自身特性轉變為目標的特性。以下情況時，招式使用失敗：使用者與目標特性相同；目標特性為神奇守護、複製、接球手、化學之力、陰晴不定、花之禮、多屬性、變身者、幻覺、達摩模式、戰鬥切換、群聚變形、牽絆變身、畫皮、魚群、界限盾殼、AR系統、飽了又餓、一口飛彈、結凍頭、人馬一體、絕對睡眠、化學變化氣體、全能變身、發號施令、古代活性和夸克充能； 或使用者的特性為多屬性、達摩模式、戰鬥切換、群聚變形、牽絆變身、畫皮、魚群、界限盾殼、AR系統、一口飛彈、結凍頭、人馬一體、絕對睡眠、全能變身、發號施令、古代活性和夸克充能。";
            if (value.startsWith("If another Pokemon uses certain non-damaging moves this turn, the user steals that move")) node.nodeValue = "若當回合有其他寶可夢成功使出對其自身或其所在方場地有利的變化招式，會立刻將其效果奪為己用。該招式每次使用最多只能奪取1個招式的效果。若當回合有多只寶可夢使用搶奪，則按照行動順序，由最先行動的寶可夢先進行奪取。之後其他寶可夢依次進行奪取，且不會搶奪本回合已被奪取過的招式。當使用者處於自由落體狀態時，該效果無效。";
            if (value.startsWith("This move cannot be selected until the user eats a Berry, either by eating one that was held, stealing and eating one")) node.nodeValue = "如果自身沒有吃掉樹果，則招式無法選擇。使用蟲咬、啄食吃掉目標攜帶的樹果時，或其他寶可夢攜帶樹果時向自身使用投擲並使樹果在自身身上發動，都視為吃掉樹果。吃掉樹果的寶可夢再次上場或者獲得了其他物品，也可以選擇此招式並在戰鬥的剩餘時間使用。通過自然之恩消耗的樹果不視為吃掉。";
            if (value.startsWith("The user uses the move the target chose for use this turn against it, if possible, with its power multiplied by 1.5. The move must be a damaging move other than Beak Blast, Belch, Chatter, Counter, Covet, Focus Punch, Me First, Metal Burst, Mirror Coat, Shell Trap, Struggle, Thief, or any Z-Move. Fails if the target moves before the user. Ignores the target's substitute for the purpose of copying the move.")) node.nodeValue = "如果目標當回合選擇了造成傷害的招式，自身則會搶先對目標使用該招式，並且威力提升50%。通過搶先一步無法發動下列招式：掙扎、打嗝、喋喋不休、渴望、小偷、真氣拳、鳥嘴加農炮、陷阱甲殼、雙倍奉還、鏡面反射、金屬爆炸以及Z招式。如果目標在自身之前行動，則招式失敗。即使目標在替身狀態下，也會搶先使用招式。";
            if (value.startsWith("For 5 turns, the held items of all active Pokemon have no effect. An item's effect of causing forme changes is unaffected, but any other effects from such items are negated. During the effect, Fling and Natural Gift are prevented from being used by all active Pokemon. If this move is used during the effect, the effect ends.")) node.nodeValue = "5回合內，所有場上的寶可夢的道具沒有效果。不會影響寶可夢的超級進化、原始回歸和使用Z招式。在魔法空間效果存在時，使用投擲或自然之恩會失敗。在魔法空間效果存在的情況下再次使用魔法空間，會結束魔法空間的效果。";
            if (value.startsWith("This attack takes the target into the air with the user on the first turn and executes on the second")) node.nodeValue = "在第一回合飛上天空進行蓄力，同時抓起目標飛上天空，在第二回合發動招式。在第一回合，避免除起風、打雷、衝天拳、龍卷風、暴風、擊落、音爆、千箭齊發外的所有攻擊。對處於替身狀態的寶可夢、同伴或體重200kg以上的寶可夢使用自由落體會失敗。如果目標使用了魔法反射、挖洞、潛水、飛翔、暗影奇襲、暗影潛襲或自由落體，則在第一回合失敗。無法對飛行屬性的寶可夢造成傷害。該回合目標可以使用招式，但無法替換寶可夢、逃走或使用道具。";
            if (value.startsWith("If an ally Tatsugiri has activated its Commander Ability, this")) node.nodeValue = "若口中有米立龍，使用後會根據米立龍的姿勢而提高能力。米立龍-上弓姿勢會令使用者的攻擊提升1級；米立龍-下垂姿勢會令使用者的防禦提升1級；米立龍-平挺姿勢會令使用者的速度提升1級。即使口中的米立龍此後陷入瀕死狀態，使用上菜仍然會提高能力。";
            if (value.startsWith("Causes the target to become infatuated, making it unable to attack 50% of the time. Fails if both the user and the target are the same gender, if")) node.nodeValue = "使目標陷入著迷狀態，處於著迷狀態的寶可夢選擇使用招式時有50%幾率不能行動。只對異性寶可夢有效，雙方為同性別、有任意一方為無性別，或目標已進入此狀態，招式無效。擁有遲鈍或芳香幕特性的寶可夢免疫此招式。";
            if (value.startsWith("Deals damage to the target equal to the target's maximum HP. Ignores accuracy and evasiveness modifiers. This attack's accuracy is equal to (user's level - target's level + 30)%, and fails if the target is at a higher level. Pokemon with the Sturdy Ability are immune.")) node.nodeValue = "造成與目標的HP相同的固定傷害。命中的概率不會受到命中率和閃避率影響。此攻擊的命中率等於（自身等級-目標等級+30）%，如果自身等級低於目標，招式使用失敗。此招式對結實特性的寶可夢無效。";
            if (value.startsWith("Hits one time for the user and one time for each unfainted Pokemon without a non-volatile status condition in the user's party. The power of each hit is equal to 5+(X/10)")) node.nodeValue = "攻擊目標造成傷害，沒有異常狀態或瀕死的全部同行寶可夢都會攻擊對手。招式的威力會根據同行寶可夢的攻擊種族值變化。每一擊的威力=使用方的一只同行寶可夢的5+攻擊種族值/10。每一擊的來源都視為使用者。";
            if (value.startsWith("Raises the user's Special Defense by 1 stage. The user's next Electric-type attack will have its power doubled; the effect ends when the user is no longer active, or")) node.nodeValue = "令使用者的特防提升1級。使自身進入充電狀態。處於充電狀態的寶可夢使用的電屬性招式的威力加倍。充電狀態在下次使用電屬性招式後結束，即使沒有產生效果。";
            if (value.startsWith("Deals typeless damage to a random opposing Pokemon. If this move was successful, the user loses 1/4 of its maximum HP, rounded half up, and the Rock Head Ability does not prevent this. This move is automatically")) node.nodeValue = "攻擊隨機一位對手造成無屬性的傷害。對使用者造成最大HP的1/4傷害，向上取整且不受堅硬腦袋和魔法防守特性的影響。如果沒有可以使出的招式，就會使出此招式。";
            if (value.startsWith("A random move is selected for use, oth")) node.nodeValue = "在幾乎所有招式中隨機選擇一個並使用。";
            if (value.startsWith("The user will survive attacks made by other Pokemon during this turn with at least 1 HP. This move has an X/65536 chance of being successful, where X starts at 65535")) node.nodeValue = "在本回合結束使自身保留至少1點HP。此招式成功的幾率為X/65536，其中X從65535開始，每次成功使出此招式時向下取整一半。在連續四次成功使出後，X降至118，並在隨後的使用中以0～65535的隨機選擇一個數。如果此招式使用失敗或用戶的最後一次招式使用失敗，X將重置為65535。如果使用失敗，或上一回合使用的不是看穿、挺住或守住，X重置為65535。如果本回合使用者最後行動，招式會失敗。";
            if (value.startsWith("The power of this move is 20 if X is 33 to 48, 40 if X is 17 to 32, 80 if X is 10 to 16, 100 if X is 5 to 9, 150 if X is 2 to 4, and 200 if X is 0 or 1, where X is equal to (user's current HP * 48 / user's maximum HP), rounded down. This")) node.nodeValue = "威力和自身剩下的HP有關(向下取整)。HP≥68.75%，威力為20；35.42%≤HP＜68.75%，威力為40；20.83%≤HP＜35.42%，威力為80；10.42%≤HP＜20.83%，威力為100；4.17%≤HP＜10.42%，威力為150；0＜HP＜4.17%，威力為200。此招式不會擊中要害。";
            if (value.startsWith("Has an X% chance to confuse the target, where X is 0 unless the user is a Chatot that hasn't Transformed. If the user is a Chatot, X is 1, 11, or 31 depending on the volume of Chatot's recorded cry, if any; 1 for")) node.nodeValue = "有X%的幾率使目標陷入混亂。如果使用者是沒有錄音的聒噪鳥，X為0；錄音音量低時X為1，錄音音量中時X為11，錄音音量高時X為31。";
            if (value.startsWith("Power is equal to (25 * target's current Speed / user's current Speed) + 1, rounded down, but not more than 150. If")) node.nodeValue = "威力 = 1 + 25 × 目標速度÷使用者速度，最大為150。如果使用者當前的速度為0，此招式的威力為1。";
            if (value.startsWith("Power is equal to the base move's Max Move power. If this move is successful, for 4 turns each non-Grass-type Pokemon")) node.nodeValue = "威力由原本招式的威力決定。在4～5回合內使非草屬性的目標陷入束縛狀態，每回合受到1/6最大HP的傷害並不能換下，向下取整。";
            if (value.startsWith("Power is equal to the base move's Max Move power. If this move is successful, for 4 turns each non-Water-type Pokemon")) node.nodeValue = "威力由原本招式的威力決定。在4～5回合內使非水屬性的目標陷入束縛狀態，每回合受到1/6最大HP的傷害並不能換下，向下取整。";
            if (value.startsWith("This attack charges on the first turn and executes on the second. Power is halved if the weather is Hail, Primordial Sea, Rain Dance, or Sandstorm. If the user is holding a Power Herb or the weather is Desolate Land or Sunny Day, the move completes in one turn.")) node.nodeValue = "在第一回合進行蓄力，第二回合攻擊目標。如果當天氣為大晴天或攜帶了強力香草，可以立刻結束蓄力，在第一回合發動招式。在天氣為下雨、沙暴、冰雹時且自身沒有攜帶萬能傘，威力減半。";
            if (value.startsWith("Prevents the target from switching for two to five turns. Causes damage to the target equal to 1/16 of its maximum HP, rounded down, at the end of each turn during effect. The target can still switch")) node.nodeValue = "使目標陷入束縛狀態。束縛狀態持續2～5回合，處於束縛狀態的寶可夢每回合結束時會受到1/16最大HP的傷害並不能換下，向下取整一半。如果目標使用了接棒，可以正常替換。如果使用者或目標離場，或者目標成功使出高速旋轉，效果結束。使用此招式或其他束縛招式不會累計或重置束縛狀態。";
            if (value.startsWith("Once this move is successfully used, the user automatically uses this move every turn and can no longer switch out. During the effect, the user's Attack is raised by 1 stage every time it is hit by the opposing Pokemon, and this move's accuracy is overwritten every turn with the current calculated accuracy including stat stage changes, but not to less than 1/256 or more than 255/256.")) node.nodeValue = "一旦成功使用此招式，使用者每回合都會自動使用此招式，並且不能切換招式。在使用該招式後到下次使用者使用招式之前，每受到一次攻擊造成的傷害，使用者的攻擊能力提升1級。每個回合此招式的命中率都會被當前的命中率覆蓋，包括能力等級變化，但不小於1/256或大於255/256。";
            if (value.startsWith("For 5 turns, the terrain becomes Grassy Terrain. During the effect, the power of Grass-type attacks used by grounded Pokemon is multiplied by 1.3")) node.nodeValue = "在5回合內，場地變為青草場地。在效果持續期間，地面上的寶可夢使用的草屬性招式威力增加1.3倍；對地面上的寶可夢使用的重踏、地震和震級的威力減半。地面上的寶可夢的在每回合結束時恢覆1/16的最大HP，向下取整，包括效果的最後一回合。保護色會將使用者的屬性變為草屬性，自然之力會變為能量球，秘密之力有30%的幾率使目標陷入睡眠。如果當前場地已為青草場地，使用失敗。";
            if (value.startsWith("For 5 turns, the terrain becomes Grassy Terrain. During the effect, the power of Grass-type attacks used by grounded Pokemon is multiplied by 1.5")) node.nodeValue = "在5回合內，場地變為青草場地。在效果持續期間，地面上的寶可夢使用的草屬性招式威力增加1.5倍；對地面上的寶可夢使用的重踏、地震和震級的威力減半。地面上的寶可夢的在每回合結束時恢覆1/16的最大HP，向下取整，包括效果的最後一回合。保護色會將使用者的屬性變為草屬性，自然之力會變為能量球，秘密之力有30%的幾率使目標陷入睡眠。如果當前場地已為青草場地，使用失敗。";
            if (value.startsWith("For 5 turns, the terrain becomes Misty Terrain")) node.nodeValue = "5回合內，場地變為薄霧場地。在效果持續期間，對地面上的寶可夢使用的龍系屬性招式威力減半，且地面上的寶可夢不會陷入任何異常狀態以及混亂狀態。地面上的寶可夢會受到哈欠的影響，但不會因此而陷入睡眠。保護色會將使用者的屬性變為妖精屬性，自然力量變成月亮之力，秘密之力有30%的幾率使目標的特攻降低1級。如果當前場地已為薄霧場地，使用失敗。";
            if (value.startsWith("For 5 turns, the terrain becomes Psychic Terrain. During the effect, the power of Psychic-type attacks made by grounded Pokemon is multiplied by 1.3")) node.nodeValue = "5回合內，場地變為精神場地。在效果持續期間，地面上的寶可夢的超能力屬性招式威力增加1.3倍，且不會受到對手先制招式的攻擊或影響，雙打對戰中同伴之間使用的招式不受此限。保護色會將使用者變為超能力屬性，自然之力變為精神強念，秘密之力有30%的幾率使目標的速度降低1級。如果當前場地已為精神場地，使用失敗。";
            if (value.startsWith("For 5 turns, the terrain becomes Psychic Terrain. During the effect, the power of Psychic-type attacks made by grounded Pokemon is multiplied by 1.5")) node.nodeValue = "5回合內，場地變為精神場地。在效果持續期間，地面上的寶可夢的超能力屬性招式威力增加1.5倍，且不會受到對手先制招式的攻擊或影響，雙打對戰中同伴之間使用的招式不受此限。保護色會將使用者變為超能力屬性，自然之力變為精神強念，秘密之力有30%的幾率使目標的速度降低1級。如果當前場地已為精神場地，使用失敗。";
            if (value.startsWith("For 5 turns, the terrain becomes Electric Terrain. During the effect, the power of Electric-type attacks made by grounded Pokemon is multiplied by 1.3")) node.nodeValue = "5回合內，場地變為電氣場地。在效果持續期間，地面上的寶可夢的電屬性招式威力增加1.3倍；地面上的寶可夢無法進入睡眠狀態，已經進入睡眠狀態的寶可夢不會醒來。地面上的寶可夢不會受到哈欠的影響，並且不會因哈欠而進入睡眠狀態。保護色會將使用者的屬性變為電屬性，自然之力會變為十萬伏特，秘密之力有30%的幾率使目標陷入麻痹。如果當前場地已為電氣場地，使用失敗。";
            if (value.startsWith("For 5 turns, the terrain becomes Electric Terrain. During the effect, the power of Electric-type attacks made by grounded Pokemon is multiplied by 1.5")) node.nodeValue = "5回合內，場地變為電氣場地。在效果持續期間，地面上的寶可夢的電屬性招式威力增加1.5倍；地面上的寶可夢無法進入睡眠狀態，已經進入睡眠狀態的寶可夢不會醒來。地面上的寶可夢不會受到哈欠的影響，並且不會因哈欠而進入睡眠狀態。保護色會將使用者的屬性變為電屬性，自然之力會變為十萬伏特，秘密之力有30%的幾率使目標陷入麻痹。如果當前場地已為電氣場地，使用失敗。";
            if (value.startsWith("Until the user's next move, if an opposing Pokemon's attack knocks the user out, that Pokemon faints as well, unless the attack was Doom Desire or Future Sight. Fails if")) node.nodeValue = "在使用者使出下一個招式之前，如果使用者因招式直接造成的傷害而陷入瀕死狀態(預知未來和破滅之願除外)，攻擊方也會進入瀕死狀態。如果上一回合成功使用了同命，這一回合再次使用同命一定會失敗。";
            if (value.startsWith("The user has 1/16 of its maximum HP, rounded down, restored at the end of each turn while it remains active. If Big Root is held by the user, the HP recovered is 1.3x normal, rounded half down. If the user uses Baton Pass, the replacement will receive the healing effect.")) node.nodeValue = "在每回合結束回復最大HP的1/16，向下取整。攜帶大根莖時，恢覆量提升30%，向下取整一半。如果使用者使用接棒，新上場的寶可夢將獲得此效果。";
            if (value.startsWith("If the current terrain is Misty Terrain and the user is grounded, this move's power is multiplied by 1.5. The user faints after using this move, even if")) node.nodeValue = "在薄霧場地上，若使用者為地面上的寶可夢，威力提升50%。使用後自身陷入瀕死狀態，即使招式沒有命中。有濕氣特性的寶可夢在場時，使用失敗。";
            if (value.startsWith("This move's type depends on the user's primary type. If the user's primary type is typeless, this move's type is the user's secondary type if it has one, otherwise the added type from Forest's Curse or")) node.nodeValue = "傷害屬性變為使用者本身的第一屬性。如果使用者的第一屬性為無屬性，傷害屬性變為使用者本身的第二屬性，否則變為萬聖夜或森林詛咒的屬性。如果使用者只有無屬性，傷害屬性變為無屬性。";
            if (value.startsWith("The user transforms into the target. The target's current stats, stat stages, types, moves, Ability, weight, IVs, species, and sprite are copied. The user's level and HP remain the same and each copied move receives only 5 PP. This move fails if the target has transformed.")) node.nodeValue = "使用者變身成目標寶可夢。目標的當前能力、能力等級、屬性、招式、特性、重量和種族都會被複製。使用者的HP不變，複製的招式均只有5點PP。如果目標已經變身，使用失敗。";
            if (value.startsWith("The power of this move depends on (user's weight / target's weight), rounded down. Power is equal to 120 if the result is 5 or more, 100 if 4, 80 if 3, 60 if 2, and 40 if 1 or less. Damage doubles and no accuracy")) node.nodeValue = "使用者的體重比起目標越高，招式威力越高，向下取整。威力=（自身的體重/目標的體重）。如果結果為5或更大，威力為120；如果為4，威力為100；如果為3，威力為80；如果為2，威力為60；如果為1或更小，威力為40。如果目標處於變小狀態，威力翻倍。同時在這種狀況下，此招式一定會命中，除非目標正在使用蓄力的招式並不在場地上。";
            if (value.startsWith("The user and its party members are protected from damaging attacks made by other Pokemon, including allies, during this turn. Fails unless it is the user's first turn on the field, if")) node.nodeValue = "在當回合內，使我方全體進入掀榻榻米狀態，保護我方全體不受到來自其他寶可夢的大部分招式的影響。出場後立刻使出才能成功，否則招式會失敗。如果在本回合使用者最後行動或我方已進入掀榻榻米狀態，招式會失敗。";
            if (value.startsWith("Raises the target's chance for a critical hit by 1 stage, or by 2 stages if the target is Dragon type. Fails if")) node.nodeValue = "令除使用者外己方全場的擊中要害率提升1級。同伴具有龍屬性時擊中要害率提升2級。如果沒有同伴，使用失敗。接棒可以傳遞此效果。";
            if (value.startsWith("Power is equal to 100 times the user's Stockpile count. Fails if")) node.nodeValue = "攻擊目標造成傷害。威力相當於蓄力的次數乘100。儲存的力量會被噴出，且儲存的防禦和特防會被復原。如果自身沒有儲存力量，則招式使用失敗。";
            if (value.startsWith("While the user remains active, this move is replaced by a random move known by the target, even if the user already knows that move. The copied move keeps the remaining PP for this move, regardless of the copied move's maximum PP. Whenever one PP is used for a copied move, one PP is used for this move.")) node.nodeValue = "將此招式替換為目標的隨機一個招式，PP與所模仿的招式的PP相同。即使自身已經學會目標的招式，模仿也會成功使出。";
            if (value.startsWith("If this move is successful and the user has not fainted, the user switches out even if it is trapped and is replaced immediately by a selected party member. The user does not switch out if there are no unfainted party members, or if the target switched out using an Eject Button.")) node.nodeValue = "如果成功使出該招式並且使用者沒有瀕死，即使自身陷入無法逃走狀態也可以替換寶可夢。如果使用者是同行寶可夢中唯一沒有陷入瀕死狀態的寶可夢，或目標使用逃脫按鍵，使用者不會退場。";
            if (value.startsWith("The user restores 1/2 of its maximum HP if Delta Stream or no weather conditions are in effect, 2/3 of its maximum HP if the weather is Desolate Land or Sunny Day, and 1/4 of its maximum HP if the weather is Hail, Primordial Sea, Rain Dance, or Sandstorm, all rounded half down.")) node.nodeValue = "如果天氣是亂流或沒有天氣，使用者將恢覆其最大生命值的1/2，如果天氣為大日照或大晴天，則恢覆其最大HP的2/3，如果天氣是冰雹、大雨、下雨或沙暴，則恢覆最大HP的1/4，全部向下取整。";
            if (value.startsWith("This move cannot be selected unless the user is holding a Berry. The user eats its Berry and raises its Defense by 2 stages. This effect is")) node.nodeValue = "如果沒有攜帶樹果，使用失敗。使用後吃掉樹果並提升2級防禦，此招式不受查封、魔法空間、笨拙或緊張感的影響。";
            if (value.startsWith("If this move is successful and the user has not fainted, it steals the target's held Berry if it is holding one and eats it immediately, gaining its effects even if")) node.nodeValue = "如果成功使出該招式並且使用者沒有瀕死，會吃掉目標的樹果並獲得該樹果的效果。若使用該招式的寶可夢處於查封狀態或特性為笨拙，仍然能消耗目標的樹果，但不會獲得樹果的效果。失去的物品無法通過回收利用或收獲特性回收。";
            if (value.startsWith("Has a 30% chance to paralyze the target. This move can hit a target using Bounce, Fly, or Sky Drop, or is under the effect of Sky Drop. If the weather is Primordial Sea or Rain Dance, this move does not check accuracy. If the weather is Desolate Land or Sunny Day, this move's accuracy is 50%.")) node.nodeValue = "有30%幾率使目標陷入麻痹狀態。可以擊中處於飛翔、彈跳和自由落體狀態的寶可夢。天氣為大晴天或大日照時，打雷的命中降低至50%。天氣為下雨或大雨時，打雷一定會命中，除非目標正在使用蓄力的招式並不在場地上。";
            if (value.startsWith("Has a 30% chance to paralyze the target. This move can hit a target using Bounce or Fly. If the weather is Rain Dance, this move does not check accuracy. If the weather is Sunny Day, this move's accuracy is 50%.")) node.nodeValue = "有30%幾率使目標陷入麻痹狀態。可以擊中處於飛翔、彈跳和自由落體狀態的寶可夢。天氣為大晴天時，打雷的命中降低至50%。天氣為下雨時，打雷一定會命中，除非目標正在使用蓄力的招式並不在場地上。";
            if (value.startsWith("Raises the user's Attack, Defense, Special Attack, Special Defense, and Speed by 1 stage in exchange for the user losing 33% of its maximum HP, rounded down. Fails if the user would faint or if its Attack, Defense, Special Attack, Special Defense, and Speed stat stages would not change.")) node.nodeValue = "令使用者的攻擊、防禦、特攻、特防和速度提升1級，並失去33%的最大HP，向下取整。如果使用者HP不足，或者五項能力變化皆已是最大，使用失敗。";
            if (value.startsWith("The user faints and the Pokemon brought out to replace it has its HP and PP fully restored along with having any non-volatile status condition cured. The new Pokemon is sent out at the end of the turn, and the healing happens before hazards take effect. Fails if the user is the last unfainted Pokemon in its party.")) node.nodeValue = "使用者陷入瀕死狀態，然後新上場處於使用者所在位置的寶可夢恢覆全部HP和PP並治癒異常狀態。寶可夢將在回合結束時新上場，在場地狀態生效之前進行治癒。如果使用者是同行寶可夢中最後一只寶可夢，使用失敗。";
            if (value.startsWith("The user faints and the Pokemon brought out to replace it has its HP fully restored along with having any non-volatile status condition cured. The new Pokemon is sent out at the end of the turn, and the healing happens before hazards take effect. Fails if the user is the last unfainted Pokemon in its party.")) node.nodeValue = "使用者陷入瀕死狀態，然後新上場處於使用者所在位置的寶可夢恢覆全部HP並治癒異常狀態。寶可夢將在回合結束時新上場，在場地狀態生效之前進行治癒。如果使用者是同行寶可夢中最後一只寶可夢，使用失敗。";
            if (value.startsWith("Hits two to five times. Has a 35% chance to hit two or three times and a 15% chance to hit four or five times. If one of the hits breaks the target's substitute, it will take damage for the remaining hits. If the user has the Skill Link Ability, this move will always hit five times.")) node.nodeValue = "一回合內連續攻擊2～5次。命中時，各有15%的幾率攻擊5或4次，35%的幾率攻擊3或2次。如果其中一下打破了替身，招式會繼續攻擊並造成傷害。如果使用者擁有連續攻擊特性，始終命中5次。";
            if (value.startsWith("This attack charges on the first turn and executes on the second. On the first turn, the user avoids all attacks other than Surf and Whirlpool but takes double damage from them, and is also unaffected by weather. If the user is holding a Power Herb, the move completes in one turn.")) node.nodeValue = "在第一回合潛入水中，第二回合發動招式。潛入水中時，避免除沖浪和潮旋外的所有攻擊，但會受到來自對手的沖浪或潮旋的雙倍傷害。如果攜帶了強力香草，可以立刻結束蓄力，在第一回合發動招式。";
            if (value.startsWith("This attack charges on the first turn and executes on the second. On the first turn, the user avoids all attacks other than Earthquake and Magnitude but takes double damage from them, and is also unaffected by weather. If the user is holding a Power Herb, the move completes in one turn.")) node.nodeValue = "在第一回合鑽進洞中，第二回合發動招式。鑽進洞中時，避免除音爆、地裂、地震和震級外的所有攻擊，但會受到來自對手的地震或震級的雙倍傷害。如果攜帶了強力香草，可以立刻結束蓄力，在第一回合發動招式。";
            if (value.startsWith("Prevents the user and the target from switching out. The user and the target can still switch out if either of them is holding Shed Shell or uses Baton Pass, Flip Turn, Parting Shot, Teleport, U-turn, or Volt Switch. The effect ends if either the user or the target leaves the field.")) node.nodeValue = "使攻擊方和目標都陷入無法逃走狀態。如果使用者或目標持有美麗空殼，使用了接棒、快速折返、拋下狠話、急速折返或伏特替換，可以正常替換。";
            if (value.startsWith("For 5 turns, the Speed of every Pokemon is recalculated for the purposes of determining turn order. During the effect, each Pokemon's Speed is considered to be (10000 - its normal Speed), and if")) node.nodeValue = "5回合內，每個寶可夢的速度都會重新計算，以確定行動順序。在戲法空間期間，每個寶可夢的速度都被認為是（10000-其正常速度），如果這個值大於8191，則從中減去8192。如果在戲法空間期間使用戲法空間，效果結束。";
            if (value.startsWith("Has a 30% chance to confuse the target. This move can hit a target using Bounce, Fly, or Sky Drop, or is under the effect of Sky Drop. If the weather is Primordial Sea or Rain Dance, this move does not check accuracy. If the weather is Desolate Land or Sunny Day, this move's accuracy is 50%.")) node.nodeValue = "有30%的幾率使目標陷入混亂狀態。可以擊中處於飛翔、彈跳和自由落體狀態的寶可夢。天氣為大晴天或大日照時，暴風的命中降低至50%。天氣為下雨或大雨時，暴風一定會命中，除非目標正在使用蓄力的招式並不在場地上。";
            if (value.startsWith("Lowers the target's Attack by 1 stage. The user restores its HP equal to the target's Attack stat calculated with its stat stage before this move was used. If")) node.nodeValue = "令目標的攻擊降低1級。恢覆使用者與目標攻擊數值相同的HP，該數值受到目標當前的攻擊能力變化影響。攜帶大根莖時，恢覆量提升30%，向下取整一半。如果目標的攻擊能力等級為-6，使用失敗。";
            if (value.startsWith("Power is equal to the base move's Max Move power. If this move is successful, the Special Defense of each Pokemon on the opposing side is lowered by 1 stage, even if they have a substitute. This effect does not happen if the user is not Dynamaxed. If this move is used as a base move, it deals damage with a power of 0.")) node.nodeValue = "威力由原本招式的威力決定。令全部對手寶可夢的特防降低1級。該效果無視對手的替身，如果使用者沒有極巨化，不會有該效果。如果將此招式用作基礎招式使用，威力為0。";
            if (value.startsWith("Power is equal to the base move's Max Move power. If this move is successful, the Special Attack of each Pokemon on the opposing side is lowered by 1 stage, even if they have a substitute. This effect does not happen if the user is not Dynamaxed. If this move is used as a base move, it deals damage with a power of 0.")) node.nodeValue = "威力由原本招式的威力決定。令全部對手寶可夢的特攻降低1級。該效果無視對手的替身，如果使用者沒有極巨化，不會有該效果。如果將此招式用作基礎招式使用，威力為0。";
            if (value.startsWith("Power is equal to the base move's Max Move power. If this move is successful, the Attack of each Pokemon on the opposing side is lowered by 1 stage, even if they have a substitute. This effect does not happen if the user is not Dynamaxed. If this move is used as a base move, it deals damage with a power of 0.")) node.nodeValue = "威力由原本招式的威力決定。令全部對手寶可夢的攻擊降低1級。該效果無視對手的替身，如果使用者沒有極巨化，不會有該效果。如果將此招式用作基礎招式使用，威力為0。";
            if (value.startsWith("Power is equal to the base move's Max Move power. If this move is successful, the Speed of each Pokemon on the user's side is raised by 1 stage, even if they have a substitute. This effect does not happen if the user is not Dynamaxed. If this move is used as a base move, it deals damage with a power of 0.")) node.nodeValue = "威力由原本招式的威力決定。令使用者和同伴的速度提升1級。如果使用者沒有極巨化，不會有該效果。如果將此招式用作基礎招式使用，威力為0。";
            if (value.startsWith("Power is equal to the base move's Max Move power. If this move is successful, the Defense of each Pokemon on the opposing side is lowered by 1 stage, even if they have a substitute. This effect does not happen if the user is not Dynamaxed. If this move is used as a base move, it deals damage with a power of 0.")) node.nodeValue = "威力由原本招式的威力決定。令全部對手寶可夢的防禦降低1級。該效果無視對手的替身，如果使用者沒有極巨化，不會有該效果。如果將此招式用作基礎招式使用，威力為0。";
            if (value.startsWith("Power is equal to the base move's Max Move power. If this move is successful, the Special Defense of each Pokemon on the user's side is raised by 1 stage, even if they have a substitute. This effect does not happen if the user is not Dynamaxed. If this move is used as a base move, it deals damage with a power of 0.")) node.nodeValue = "威力由原本招式的威力決定。令使用者和同伴的特防提升1級。如果使用者沒有極巨化，不會有該效果。如果將此招式用作基礎招式使用，威力為0。";
            if (value.startsWith("Power is equal to the base move's Max Move power. If this move is successful, the Special Attack of each Pokemon on the user's side is raised by 1 stage, even if they have a substitute. This effect does not happen if the user is not Dynamaxed. If this move is used as a base move, it deals damage with a power of 0.")) node.nodeValue = "威力由原本招式的威力決定。令使用者和同伴的特攻提升1級。如果使用者沒有極巨化，不會有該效果。如果將此招式用作基礎招式使用，威力為0。";
            if (value.startsWith("Power is equal to the base move's Max Move power. If this move is successful, the Speed of each Pokemon on the opposing side is lowered by 1 stage, even if they have a substitute. This effect does not happen if the user is not Dynamaxed. If this move is used as a base move, it deals damage with a power of 0.")) node.nodeValue = "威力由原本招式的威力決定。令全部對手寶可夢的速度降低1級。該效果無視對手的替身，如果使用者沒有極巨化，不會有該效果。如果將此招式用作基礎招式使用，威力為0。";
            if (value.startsWith("Power is equal to the base move's Max Move power. If this move is successful, the Defense of each Pokemon on the user's side is raised by 1 stage, even if they have a substitute. This effect does not happen if the user is not Dynamaxed. If this move is used as a base move, it deals damage with a power of 0.")) node.nodeValue = "威力由原本招式的威力決定。令使用者和同伴的防禦提升1級。如果使用者沒有極巨化，不會有該效果。如果將此招式用作基礎招式使用，威力為0。";
            if (value.startsWith("If this attack does not miss, the effects of Reflect, Light Screen, and Aurora Veil end for the target's side of the field before damage is calculated. If the user's current form is a Paldean Tauros, this")) node.nodeValue = "如果成功使出該招式，在造成傷害前破壞對方場地的光牆、反射壁和極光幕。招式的屬性會隨肯泰羅的形態改變：肯泰羅-鬥戰種使出時為格鬥屬性；肯泰羅-火熾種使出時為火屬性；肯泰羅-水瀾種使出為水屬性。";
            if (value.startsWith("Raises the user's evasiveness by 2 stages. Whether or not the user's evasiveness was changed")) node.nodeValue = "令使用者的閃避率提升2級。變小狀態的寶可夢受到踩踏、瘋狂滾壓、泰山壓頂、龍之俯衝、重磅衝撞、飛身重壓、高溫重壓攻擊時傷害翻倍，且必定命中。";
            if (value.startsWith("As long as the target remains active, its evasiveness stat stage is ignored during accuracy checks against it if it is greater than 0, and Psychic-type attacks can hit the target if it is a Dark type. Fails if")) node.nodeValue = "令目標的閃避率提升無效，如果它是惡屬性，可以受到超能力屬性招式的攻擊。如果目標已受到奇跡之眼、識破或氣味偵測的影響，使用失敗。";
            if (value.startsWith("As long as the target remains active, its evasiveness stat stage is ignored during accuracy checks against it if it is greater than 0, and Normal- and Fighting-type attacks can hit the target if it is a Ghost type. Fails if")) node.nodeValue = "令目標的閃避率提升無效，如果它是幽靈屬性，可以受到一般屬性和格鬥屬性招式的攻擊。如果目標已受到奇跡之眼、識破或氣味偵測的影響，使用失敗。";
            if (value.startsWith("For 3 turns, the target is forced to repeat its last move used. If")) node.nodeValue = "3回合內，只能使用其最後使用的招式。如果目標受到影響的招式超出PP，效果結束。如果目標已陷入此狀態，或者最後使出的是再來一次、模仿、寫生、掙扎、變身、借助、仿效、搶先一步、揮指、鸚鵡學舌、自然之力或夢話，使用失敗。";
            if (value.startsWith("For 4 to 8 turns, the target is forced to repeat its last move used. If")) node.nodeValue = "令目標接下來的4～8回合，只能使用其最後使用的招式。如果目標受到影響的招式超出PP，效果結束。如果目標已陷入此狀態，或者最後使出的是再來一次、模仿、寫生、掙扎、仿效、鸚鵡學舌、夢話，使用失敗。";
            if (value.startsWith("The user swaps positions with its ally. Fails if the user is the only Pokemon on its side. This move has a 1/X chance of being successful, where X starts at 1 and")) node.nodeValue = "在雙打對戰中與己方目標交換位置；目標位置沒有寶可夢時使用該招式會失敗。此招式有1/X的成功幾率，其中X從1開始，每次成功使用此招式時會增加三倍。如果此招式使用失敗或使用者最後使用的招式不是交換場地，則X重置為1。";
            if (value.startsWith("Has a 30% chance to cause a secondary effect on the target based on the battle terrain. Causes paralysis on the regular Wi-Fi terrain, causes paralysis")) node.nodeValue = "有30%幾率根據場地的不同造成相應的追加效果。電氣場地追加效果為麻痹，青草場地為睡眠，薄霧場地為降低目標1級特攻，精神場地為降低目標1級速度。";
            if (value.startsWith("The user takes 1/2 of its maximum HP, rounded up, and creates a substitute that has 1/4 of the user's maximum HP, rounded down. The user is replaced with another Pokemon in its party and the selected Pokemon has the substitute transferred to it. Fails if")) node.nodeValue = "使用者損失最大HP的1/2（向上取整），制造出替身，替身的HP為使用者最大HP的1/4。然後自身與後備寶可夢替換，替換後替身會傳遞給交換上場的寶可夢。以下情況時，招式使用失敗：自身已經處於替身狀態；自身的HP不超過最大HP的1/2；沒有可以替換的後備寶可夢。";
            if (value.startsWith("Switches the Mist, Light Screen, Reflect, Spikes")) node.nodeValue = "將隱形岩、撒菱、毒菱、黏黏網、反射壁、光牆、極光幕、順風、超極巨深淵滅焰、超極巨水炮轟滅、超極巨灰飛鞭滅、超極巨炎石噴發火海、彩虹、濕地、白霧、神秘守護從使用者一側換至另一側，反之亦然。";
            if (value.startsWith("For 3 to 6 turns, the target is forced to repeat its last move used. If")) node.nodeValue = "令目標接下來的3～6回合，只能使用其最後使用的招式。如果目標受到影響的招式超出PP，效果結束。如果目標已陷入此狀態，或者最後使出的是再來一次、模仿、揮指、寫生、掙扎、仿效、鸚鵡學舌、夢話，使用失敗。";
            if (value.startsWith("The user restores 1/2 of its maximum HP if Delta Stream or no weather conditions are in effect or if the user is holding Utility Umbrella, 2/3 of its maximum HP if the weather is Desolate Land or Sunny Day, and 1/4 of its maximum HP if the weather is Hail, Primordial Sea, Rain Dance, or Sandstorm, all rounded half down.")) node.nodeValue = "如果天氣是亂流或沒有天氣，使用者將恢覆其最大生命值的1/2，如果天氣為大日照或大晴天，則恢覆其最大HP的2/3，如果天氣是冰雹、大雨、下雨或沙暴，則恢覆最大HP的1/4，全部向下取整。";
            if (value.startsWith("Sets up a hazard on the opposing side of the field, causing each opposing Pokemon that switches in to lose 1/8 of their maximum HP, rounded down, unless it is a Flying-type Pokemon. Fails if the effect is already active on the opposing side. Can be removed from the opposing side if any opposing Pokemon uses Rapid Spin successfully.")) node.nodeValue = "向對手的場地撒菱，使對手交換上場的寶可夢受到其1/8最大HP的傷害，除非它擁有飛行屬性或擁有漂浮特性。如果對手的寶可夢成功使出高速旋轉，撒菱解除。";
            if (value.startsWith("Power is equal to the base move's Max Move power. If this move is successful, each Pokemon on the opposing side becomes infatuated, even if they have a substitute. This effect does not happen for a target if both it and the user are the same gender, if either is genderless, or if the target is already infatuated.")) node.nodeValue = "威力由原本招式的威力決定。讓對方所有與使用者性別不同的寶可夢陷入著迷狀態，即使目標處於替身狀態下。";
            if (value.startsWith("Has a 100% chance to raise the user's Speed by 1 stage. If the user is a Morpeko in Full Belly Mode, this move is Electric type. If")) node.nodeValue = "100%幾率提高1級速度。在滿腹花紋時會變成電屬性，在空腹花紋時則會變成惡屬性。僅在使用者為莫魯貝可時奏效，否則使用失敗。";
            if (value.startsWith("Lowers the target's Attack and Special Attack by 1 stage. If this move is successful, the user switches out even if it is trapped and is replaced immediately by a selected party member. The user does not switch out if the target's Attack and Special Attack stat stages were both unchanged, or if there are no unfainted party members.")) node.nodeValue = "令目標的攻擊和特攻降低1級。如果成功使出該招式，即使自身陷入無法逃走狀態也可以替換寶可夢。如果該招式無法對對手的能力變化產生效果或使用者是同行寶可夢中最後一只寶可夢，使用失敗。";
            if (value.startsWith("If the target is an opposing Pokemon and it switches out this turn, this move hits that Pokemon before it leaves the field. Power doubles and no accuracy check is done if the user hits an opponent switching out, and the user's turn is over; if an opponent faints from this, the replacement Pokemon becomes active immediately.")) node.nodeValue = "如果目標是對手的寶可夢且它在本回合內準備替換下場，則該招式會立刻攻擊準備離場的寶可夢。如果擊中了準備替換下場的寶可夢並且使用者的回合結束，傷害翻倍且必定命中。如果對手因此瀕死，替換的寶可夢會在該回合登場。";
            if (value.startsWith("The user restores 1/2 of its maximum HP if Delta Stream or no weather conditions are in effect or if the user is holding Utility Umbrella, 2/3 of its maximum HP if the weather is Desolate Land or Sunny Day, and 1/4 of its maximum HP if the weather is Primordial Sea, Rain Dance, Sandstorm, or Snow, all rounded half down.")) node.nodeValue = "在亂流或沒有天氣型狀態或攜帶萬能傘時，回復使用者的1/2最大HP。如果天氣是大晴天或大日照，回復使用者的2/3最大HP。如果天氣是下雨、大雨、沙暴、冰雹或下雪，回復使用者的1/3最大HP。全部向下取整。";
            if (value.startsWith("Power is equal to 50+(X*50), where X is the total number of times the user has been hit by a damaging attack during the battle, even if the user did not lose HP from the attack. X cannot be greater than 6 and")) node.nodeValue = "威力等於50+（X乘以50），其中X是使用者在戰鬥中受到攻擊的總次數，即使使用者沒有因攻擊而失去HP。X最多為6，並且在離場或瀕死時不會重置。連續攻擊的每次命中都會被計算在內，但不會計算混亂傷害。";
            if (value.startsWith("This attack charges on the first turn and executes on the second. On the first turn, the user avoids all attacks other than Gust, Hurricane, Sky Uppercut, Smack Down, Thousand Arrows, Thunder, and Twister, and Gust and Twister have doubled power when used against it. If the user is holding a Power Herb, the move completes in one turn.")) node.nodeValue = "在第一回合飛上天空，第二回合發動招式。飛上天空時，避免除起風、打雷、衝天拳、龍卷風、暴風、擊落、音爆、千箭齊發外的所有攻擊，但會受到來自對手的起風或龍卷風的雙倍傷害。如果攜帶了強力香草，可以立刻結束蓄力，在第一回合發動招式。";
            if (value.startsWith("Raises the user's Attack and Special Attack by 1 stage. If the weather is Sunny Day or Desolate Land, this move raises the user's Attack and Special Attack by 2 stages. If the user is holding Utility Umbrella, this move will only raise the user's Attack and Special Attack by 1 stage, even if the weather is Sunny Day or Desolate Land.")) node.nodeValue = "令使用者的攻擊和特攻提升1級，如果天氣是大日照或大晴天，改為提升2級。如果天氣是大日照或大晴天但攜帶了萬能傘，提升1級。";
            if (value.startsWith("Hits three times. Power increases to 20 for the second hit and 30 for the third. This move checks accuracy for each hit, and the attack ends if the target avoids a hit. If one of the hits breaks the target's substitute, it will take damage for the remaining hits. If the user has the Skill Link Ability, this move will always hit three times.")) node.nodeValue = "連續攻擊1～3次。第二次攻擊威力增加20，第三次攻擊威力增加30。每一次攻擊是否命中分別計算，打空則停止攻擊。如果其中一下打破了替身，招式會繼續攻擊並造成傷害。如果使用者擁有連續攻擊特性，始終命中3次。";
            if (value.startsWith("If this move is successful and the user has not fainted, the user switches out even if it is trapped and is replaced immediately by a selected party member. The user does not switch out if there are no unfainted party members, or if the target switched out using an Eject Button or through the effect of the Emergency Exit or Wimp Out Abilities.")) node.nodeValue = "如果成功使出該招式並且使用者沒有瀕死，即使自身陷入無法逃走狀態也可以替換寶可夢。如果使用者是同行寶可夢中唯一沒有陷入瀕死狀態的寶可夢，或目標使用逃脫按鍵、觸發了躍躍欲逃或危險回避特性，使用者不會退場。";
            if (value.startsWith("Hits three times. Power increases to 40 for the second hit and 60 for the third. This move checks accuracy for each hit, and the attack ends if the target avoids a hit. If one of the hits breaks the target's substitute, it will take damage for the remaining hits. If the user has the Skill Link Ability, this move will always hit three times.")) node.nodeValue = "連續攻擊1～3次。第二次攻擊威力增加到40，第三次攻擊威力增加到60。每一次攻擊是否命中分別計算，打空則停止攻擊。如果其中一下打破了替身，招式會繼續攻擊並造成傷害。如果使用者擁有連續攻擊特性，始終命中3次。";
            if (value.startsWith("Has a 30% chance to paralyze the target. This attack charges on the first turn and executes on the second. On the first turn, the user avoids all attacks other than Gust, Hurricane, Sky Uppercut, Smack Down, Thousand Arrows, Thunder, and Twister, and Gust and Twister have doubled power when used against it. If the user is holding a Power Herb, the move completes in one turn.")) node.nodeValue = "有30%幾率使目標陷入麻痹狀態。在第一回合進行蓄力，第二回合發動招式。蓄力時，避免除起風、打雷、衝天拳、龍卷風、暴風、擊落、音爆、千箭齊發外的所有攻擊，但會受到來自對手的起風或龍卷風的雙倍傷害。如果攜帶了強力香草，可以立刻結束蓄力，在第一回合發動招式。";
            if (value.startsWith("Deals damage to the target equal to the target's maximum HP. Ignores accuracy and evasiveness modifiers. This attack's accuracy is equal to (user's level - target's level + X)%, where X is 30 if the user is an Ice type and 20")) node.nodeValue = "造成與目標的HP相同的固定傷害。命中的概率不會受到命中率和閃避率影響。此攻擊的命中率等於（自身等級-目標等級+20）%，如果使用者是冰系，改為+30。如果自身等級低於目標，招式使用失敗。此招式對冰屬性或結實特性的寶可夢無效。";
            if (value.startsWith("This attack charges on the first turn and executes on the second. Raises the user's Special Attack by 1 stage on the first turn. If the user is holding a Power Herb or the weather is Primordial Sea or")) node.nodeValue = "在第一回合進行蓄力並提升1級特攻，第二回合攻擊目標。如果天氣為下雨或大雨，或攜帶了強力香草，可以立刻結束蓄力，在第一回合發動招式。";
            if (value.startsWith("Whether or not this move is successful and even if it would cause fainting, the user loses 1/2 of its maximum HP, rounded up, unless the user has the Magic Guard Ability. This")) node.nodeValue = "對使用者造成最大HP的1/2（向上取整）傷害。即使招式未命中、HP不足1/2，使用者仍然會受到傷害，除非使用者擁有魔法防守特性。如果自身陷入粉塵狀態、天氣為大雨或有濕氣特性的寶可夢在場，此招式使用失敗，不會受到反作用力傷害。";
            if (value.startsWith("For 5 turns, the user and its party members cannot have non-volatile status conditions or confusion inflicted on them by other Pokemon. Pokemon on the user's side cannot become affected by Yawn but can fall asleep from its effect. It is removed from the user's side if the user or an ally is successfully hit by Defog. Fails if the effect is already active on the user's side.")) node.nodeValue = "5回合內保護己方寶可夢不會陷入異常狀態、混亂狀態、瞌睡狀態。只能阻擋瞌睡狀態，不能阻止已經進入的瞌睡狀態引發的睡眠狀態。如果己方已經處於此狀態，使用失敗。";
            if (value.startsWith("For 5 turns, the target's held item has no effect. An item's effect of causing forme changes is unaffected, but any other effects from")) node.nodeValue = "5回合內，令其攜帶的物品無效，不能使用自然之恩和投擲。如果目標使用了接棒，新上場的寶可夢獲得此效果。";
            if (value.startsWith("Until the end of the turn, all single-target attacks from the opposing side are redirected to the user")) node.nodeValue = "直到這回合結束，所有對方使用的作用範圍為單體選擇的招式都會攻向自己。此效果優先於魔法反射、魔法鏡、避雷針和引水特性的效果。不能在除皇家對戰和雙打對戰之外的模式使用。當使用者處於自由落體狀態時，此效果消失。";
            if (value.startsWith("Until the end of the turn, all single-target attacks from opponents of the target are redirected to the target")) node.nodeValue = "直到這回合結束，所有對方使用的作用範圍為單體選擇的招式都會攻向自己。此效果優先於魔法反射、魔法鏡、避雷針和引水特性的效果。不能在除皇家對戰和雙打對戰之外的模式使用。當使用者處於自由落體狀態時，此效果消失。";
            if (value.startsWith("The user is protected from attacks made by the opponent during this turn. This move has an X/255 chance of being successful, where X starts at 255 and halves, rounded down, each time this move is successfully used. X resets to 255 if this move fails or if the user's last move used is not Detect, Endure, or Protect. Fails if the user has a substitute or moves last this turn.")) node.nodeValue = "在當回合內，使自身進入守住狀態，保護自身不受到來自其他寶可夢的招式的影響。此招式有X/255的成功幾率，其中X從255開始，每次成功使出此招式時，向下取整一半。如果使用失敗，或上一回合使用的不是看穿、挺住或守住，X重置為1。如果在本回合使用者最後行動，招式會失敗。";
            if (value.startsWith("The user is protected from most attacks made by other Pokemon during this turn. This move has a 1/X chance of being successful, where X starts at 1 and doubles each time this move is successfully used, up to a maximum of 8. X resets to 1 if this move fails or if the user's last move used is not Detect, Endure, or Protect. Fails if the user moves last this turn.")) node.nodeValue = "在當回合內，使自身進入守住狀態，保護自身不受到來自其他寶可夢的大部分招式的影響。此招式有1/X的成功幾率，其中X從1開始，每次成功使出此招式時X增加兩倍，最大為8。如果使用失敗，或上一回合使用的不是看穿、挺住或守住，X重置為1。如果在本回合使用者最後行動，招式會失敗。";
            if (value.startsWith("The user is protected from most attacks made by other Pokemon during this turn. This move has a 1/X chance of being successful, where X starts at 1 and doubles each time this move is successfully used. X resets to 1 if this move fails or if the user's last move used is not Detect, Endure, Protect, Quick Guard, or Wide Guard. Fails if the user moves last this turn.")) node.nodeValue = "在當回合內，使自身進入守住狀態，保護自身不受到來自其他寶可夢的大部分招式的影響。此招式有1/X的成功幾率，其中X從1開始，每次成功使出此招式時X增加三倍。如果使用失敗，或上一回合使用的不是看穿、挺住、守住、廣域防守或快速防守，X重置為1。如果在本回合使用者最後行動，招式會失敗。";
            if (value.startsWith("The user's type changes based on the battle terrain. Normal type on the regular Wi-Fi terrain, Electric")) node.nodeValue = "根據場所改變自身的屬性。沒有場地變為一般屬性，電氣場地變為電屬性，青草場地變為草屬性，薄霧場地變為妖精屬性，精神場地變為超能力屬性。如果自身的屬性無法被改變或已為該屬性，使用失敗。";
            if (value.startsWith("Fails unless the user is hit by a physical attack from an opponent this turn before it can execute the move. If the user was hit and has not fainted, it")) node.nodeValue = "除非在使出此招式之前被物理招式命中，否則使用失敗。如果使用者在被命中後沒有陷入瀕死，攻擊目標造成傷害。如果目標擁有強行特性且無視了招式的追加效果，使用失敗。";
            if (value.startsWith("Deals damage to the opposing Pokemon equal to twice the HP lost by the user from a special attack this turn. This move considers Hidden Power as Normal type, and only the last hit of a multi-hit attack is counted. Fails if the user moves first, if the user was not hit by a special attack this turn, or if the user did not lose HP from the attack.")) node.nodeValue = "對最後使用特殊招式造成自身傷害的寶可夢為目標，造成受到的招式×2倍固定傷害。只計算多次命中攻擊中的最後一次攻擊，覺醒力量會被視為普通屬性。如果使用者先行動、在此次攻擊中沒有失去HP時或所有對手都沒有使用過特殊招式攻擊到使用者，招式使用失敗。";
            if (value.startsWith("For 0 to 7 turns, one of the target's known moves that has at least 1 PP remaining becomes disabled, at random. Fails if")) node.nodeValue = "0至7個回合內，禁用目標的一個至少還有1個PP的隨機已知招式。如果目標的招式已被禁用，或者目標的所有招式都沒有PP，使用失敗。如果有寶可夢使用黑霧，此效果結束。無論這個招式是否成功使出，都會觸發對手的憤怒的效果。";
            if (value.startsWith("The user restores its HP based on its Stockpile count. Restores 1/4 of its maximum HP if it's 1, 1/2 of its maximum HP if it's 2, both rounded half down, and all of its HP if")) node.nodeValue = "使用者蓄力1次時，回復使用者1/4的HP；使用者蓄力2次時，回復使用者1/2的HP，都是向下取整。使用者蓄力3次時，回復使用者全部的HP。儲存的力量會被吞下，且儲存的防禦和特防會被復原。如果自身沒有儲存力量，則招式使用失敗。";
            if (value.startsWith("Hits two to five times. Lowers the user's Defense by 1 stage and raises the user's Speed by 1 stage after the last hit. Has a 35% chance to hit two or three times and a 15% chance to hit four or five times. If one of the hits breaks the target's substitute, it will take damage for the remaining hits. If the user has the Skill Link Ability, this move will always hit five times.")) node.nodeValue = "一回合內連續攻擊2～5次。降低使用者的1級防禦並提升1級速度。命中時，各有15%的幾率攻擊5或4次，35%的幾率攻擊3或2次。如果其中一下打破了替身，招式會繼續攻擊並造成傷害。如果使用者擁有連續攻擊特性，始終命中5次。";
            if (value.startsWith("Has a 30% chance to paralyze the target. This move can hit a target using Bounce, Fly, or Sky Drop, or is under the effect of Sky Drop. If the weather is Primordial Sea or Rain Dance, this move does not check accuracy. If the weather is Desolate Land or Sunny Day, this move's accuracy is 50%. If this move is used against a Pokemon holding Utility Umbrella, this move's accuracy remains at 70%.")) node.nodeValue = "有30%幾率使目標陷入麻痹狀態。可以擊中處於飛翔、彈跳和自由落體狀態的寶可夢。天氣為大晴天或大日照時，打雷的命中降低至50%。天氣為下雨或大雨時，打雷一定會命中，除非目標正在使用蓄力的招式並不在場地上。對於攜帶萬能傘的寶可夢，命中率為70%。";
            if (value.startsWith("Has a 30% chance to confuse the target. This move can hit a target using Bounce, Fly, or Sky Drop, or is under the effect of Sky Drop. If the weather is Primordial Sea or Rain Dance, this move does not check accuracy. If the weather is Desolate Land or Sunny Day, this move's accuracy is 50%. If this move is used against a Pokemon holding Utility Umbrella, this move's accuracy remains at 70%.")) node.nodeValue = "有30%的幾率使目標陷入混亂狀態。可以擊中處於飛翔、彈跳和自由落體狀態的寶可夢。天氣為大晴天或大日照時，暴風的命中降低至50%。天氣為下雨或大雨時，暴風一定會命中，除非目標正在使用蓄力的招式並不在場地上。對於攜帶萬能傘的寶可夢，命中率為70%。";
            if (value.startsWith("For 2 turns, the target is prevented from restoring any HP as long as it remains active. During the effect, healing and draining moves are unusable, and")) node.nodeValue = "2回合內，只要目標在場，它就無法恢覆任何生命值。在效果期間，回復HP的招式和吸取HP的招式會使用失敗。如果目標使用接棒，新上場的寶可夢將獲得此效果。分擔痛楚和再生力特性不受影響。";
            if (value.startsWith("Hits ten times. This move checks accuracy for each hit, and the attack ends if the target avoids a hit. If")) node.nodeValue = "一回合內連續攻擊1～10次。每一次攻擊是否命中分別計算，打空則停止攻擊。如果其中一下打破了替身，招式會繼續攻擊並造成傷害。使用者攜帶機變骰子時，攻擊4～10次。如果使用者擁有連續攻擊特性，始終命中10次。";
            if (value.startsWith("Sets up a hazard on the opposing side of the field, lowering the Speed by 1 stage of each opposing Pokemon that switches in, unless it is a Flying-type Pokemon or has the Levitate Ability. Fails if")) node.nodeValue = "向對手場地撒下黏黏網，使對手交換上場的寶可夢速度降低1級，除非它擁有飛行屬性或擁有漂浮特性。如果對手場地已存在黏黏網，使用失敗。如果對手的寶可夢成功使出晶光轉轉，高速旋轉或清除濃霧，黏黏網解除。";
            if (value.startsWith("The target loses its held item. This move cannot cause Pokemon with the Sticky Hold Ability to lose their held item or cause")) node.nodeValue = "目標失去其攜帶的物品。此招式無法腐蝕：蓋歐卡的靛藍色寶珠、固拉多的朱紅色寶珠、騎拉帝納的白金寶珠、阿爾宙斯的石板、蓋諾賽克特的卡帶、銀伴戰獸的記憶碟、蒼響的腐朽之劍和藏瑪然特的腐朽之盾。被腐蝕的物品無法被撿拾或收獲特性回收。";
            if (value.startsWith("Raises the user's Attack, Defense, Special Attack, Special Defense, and Speed by 1 stage, but it becomes prevented from switching out. The user can")) node.nodeValue = "令使用者的攻擊、防禦、特攻、特防和速度提升1級。使用者進入無法逃走狀態。使用接棒，快速折返，拋下狠話，急速折返或伏特替換可以正常替換。如果使用者使用了接棒，新上場的寶可夢進入無法逃走狀態。";
            if (value.startsWith("Hits twice. If the first hit breaks the target's substitute, it will take damage for the second hit. In Double Battles, this move attempts to hit the targeted Pokemon and its ally once each. If hitting one of these Pokemon would be prevented by immunity, protection, semi-invulnerability, an Ability, or accuracy, it attempts to hit the other Pokemon twice instead. If this move is redirected, it hits that target twice.")) node.nodeValue = "連續攻擊2次。如果第一下打破了替身，招式會繼續攻擊並造成傷害。在雙打對戰中，會對兩只對手寶可夢分別進行一次攻擊，如果其中一只因守住、屬性、特性、命中率、正在使用蓄力的招式不在場上不會受到龍箭傷害，對另外一只寶可夢進行兩次攻擊。如果其中一只對手寶可夢處於萬眾矚目狀態，對該寶可夢進行兩次攻擊。";
            if (value.startsWith("Hits two to five times. Has a 35% chance to hit two or three times and a 15% chance to hit four or five times. If one of the hits breaks the target's substitute, it will take damage for the remaining hits. If the user has the Skill Link Ability, this move will always hit five times. If the user is an Ash-Greninja")) node.nodeValue = "攻擊目標造成傷害，一回合內連續攻擊2～5次。命中時，各有15%的幾率攻擊5或4次，35%的幾率攻擊3或2次。如果某一下打破了替身，招式會繼續攻擊。如果使用者擁有連續攻擊特性，始終命中5次。使用者是小智版甲賀忍蛙時，招式威力提升至20，且必定連續攻擊3次。";
            if (value.startsWith("Prevents the target from switching out. At the end of each turn during effect, the target's Defense and Special Defense are lowered by 1 stage. The target")) node.nodeValue = "令目標無法替換，每個回合結束時令其防禦和特防降低1級。如果目標持有美麗空殼或使用了接棒、快速折返、拋下狠話、急速折返或伏特替換，可以正常替換，離場後效果結束。如果目標使用了接棒，新上場的寶可夢會繼承此效果。";
            if (value.startsWith("Has a 10% chance to cause the target to fall asleep. If this move is successful on at least one target and the user is a Meloetta")) node.nodeValue = "有10%的幾率使目標陷入睡眠狀態。美洛耶塔使用該招式對至少一個目標產生效果後，進行形態變化：如果當前處於歌聲形態，就會變成舞步形態；如果當前處於舞步形態，就會變成歌聲形態。特性變為強行時，不會進行形態變化。";
            if (value.startsWith("The target is forced to switch out and be replaced with a random unfainted ally. Fails if the target is the last unfainted Pokemon in its party, if the target used Ingrain previously or has the Suction Cups Ability, or if the user's level is lower than the target's and X * (user's level + target's level) / 256 + 1 is")) node.nodeValue = "令對方隊伍中隨機一只沒有陷入瀕死狀態的寶可夢強制替換上場。如果目標是其隊伍中唯一沒有陷入瀕死狀態的寶可夢，或處於紮根狀態、擁有吸盤特性或使用者的等級低於目標，並且X(X為0～255的隨機數)*（使用者等級+目標等級/256）+1≤（目標等級/4），向下取整，使用失敗。";
            if (value.startsWith("If the user is Terastallized, this move becomes a physical attack if the user's Attack is greater than its Special Attack, including stat stage changes, and this")) node.nodeValue = "當使用者太晶化時若攻擊大於特攻且屬性和太晶爆發的屬性一致，則該招式變為物理招式（計算使用者的能力變化）。使用者太晶化為星晶屬性時，太晶爆發的威力由80提升至100，屬性變為星晶，造成無屬性傷害，對非太晶化的任何屬性的目標造成1倍傷害，對太晶化的對手造成2倍的效果絕佳傷害，使用後令使用者的攻擊和特攻降低1級。";
            if (value.startsWith("Power doubles if a weather condition other than Delta Stream is active, and this move's type changes to match. Ice type during Snow, Water")) node.nodeValue = "如果有除了亂流外的天氣，則該招式的屬性為天氣對應屬性，且威力翻倍。下雪時為冰屬性，大雨或下雨時為水屬性，大日照或大晴天時為火屬性，沙暴時為岩石屬性。如果使用者在以上天氣時攜帶了萬能傘，氣象球的威力不翻倍且屬性不會改變。";
            if (value.startsWith("Power doubles if a weather condition other than Delta Stream is active, and this move's type changes to match. Ice type during Hail, Water")) node.nodeValue = "如果有除了亂流外的天氣，則該招式的屬性為天氣對應屬性，且威力翻倍。冰雹時為冰屬性，大雨或下雨時為水屬性，大日照或大晴天時為火屬性，沙暴時為岩石屬性。如果使用者在以上天氣時攜帶了萬能傘，氣象球的威力不翻倍且屬性不會改變。";
            if (value.startsWith("For 5 turns, the user and its party members take 0.5x damage from physical attacks, or 0.66x damage if in a Double Battle. Damage is not reduced further with Aurora Veil. Critical hits ignore this effect. It is removed from the user's side if the user or an ally is successfully hit by Brick Break, Psychic Fangs, or Defog. Lasts for 8 turns if the user is holding Light Clay. Fails if the effect is already active on the user's side.")) node.nodeValue = "5回合內我方寶可夢受到的物理招式傷害減半，如果己方場上存在多只寶可夢則降低原本的1/3。可以與極光幕同時共存，但減少傷害的效果無法疊加。擊中要害時無效此效果。如果使用者或友軍被劈瓦、精神之牙和清除濃霧擊中，反射壁消失。劈瓦和精神之牙會在造成傷害前移除反射壁。如果使用者攜帶了光之黏土，持續8回合。如果我方已處於此效果，使用失敗。";
            if (value.startsWith("For 5 turns, the user and its party members take 0.5x damage from special attacks, or 0.66x damage if in a Double Battle. Damage is not reduced further with Aurora Veil. Critical hits ignore this effect. It is removed from the user's side if the user or an ally is successfully hit by Brick Break, Psychic Fangs, or Defog. Lasts for 8 turns if the user is holding Light Clay. Fails if the effect is already active on the user's side.")) node.nodeValue = "5回合內我方寶可夢受到的特殊招式傷害減半，如果己方場上存在多只寶可夢則降低原本的1/3。可以與極光幕同時共存，但減少傷害的效果無法疊加。擊中要害時無效此效果。如果使用者或友軍被劈瓦、精神之牙和清除濃霧擊中，光牆消失。劈瓦和精神之牙會在造成傷害前移除光牆。如果使用者攜帶了光之黏土，持續8回合。如果我方已處於此效果，使用失敗。";
            if (value.startsWith("Each active Pokemon receives a perish count of 4 if it doesn't already have a perish count. At the end of each turn including the turn used, the perish count of all active Pokemon lowers by 1 and Pokemon faint if the number reaches 0")) node.nodeValue = "如果在場的寶可夢沒有陷入滅亡之歌狀態，那麼將獲得4的滅亡計時。在包括使用回合在內的每個回合結束時，所有在場的口袋妖怪的滅亡計時都會降低1，如果數字達到0，滅亡之歌狀態的寶可夢陷入瀕死。換下寶可夢可以解除滅亡之歌狀態。如果處於此狀態的寶可夢使用接棒，新上場的寶可夢會獲得此狀態。";
            if (value.startsWith("If this move is successful, it sets up a hazard on the opposing side of the field, damaging each opposing Pokemon that switches in. Foes lose 1/32")) node.nodeValue = "如果成功使出此招式，向對手場地撒下隱形岩。隱形岩會使交換上場的對手會失去其最大生命值的1/32(四倍抵抗)、1/16(兩倍抵抗)、1/8、1/4(兩倍克制)或1/2(四倍克制)，傷害值受到岩石屬性相性的影響，向下取整。如果對手的寶可夢成功使出晶光轉轉，高速旋轉或清除濃霧，隱形岩解除。";
            if (value.startsWith("The user spends three turns locked into this move. This move targets an opponent at random on each turn. On the first of the three turns, all sleeping active Pokemon wake up")) node.nodeValue = "攻擊隨機一位對手造成傷害。使用者進入3回合吵鬧狀態，期間會繼續使用吵鬧進行攻擊，無法使用其他招式、使用道具、替換寶可夢或逃走。在3個回合中的第1個回合時，所有在場的正在睡眠的寶可夢都會醒來。在這3回合中所有場上的寶可夢無法入睡。因守住狀態、未命中、屬性相性無效等原因而沒有產生效果，解除吵鬧狀態。";
            if (value.startsWith("For its next 3 turns, the target is forced to repeat its last move used. If the affected move runs out of PP, the effect ends. Fails if the target is already under this effect, if it has not made a move, if the move has 0 PP, or if the move is Assist, Copycat, Encore, Me First, Metronome, Mimic, Mirror Move, Nature Power, Sketch, Sleep Talk, Struggle, Transform, or any Z-Move")) node.nodeValue = "令目標接下來的3回合，只能使用其最後使用的招式。如果目標受到影響的招式超出PP，效果結束。如果目標已陷入此狀態，或者最後使出的是再來一次、模仿、寫生、掙扎、變身、借助、仿效、搶先一步、揮指、鸚鵡學舌、自然之力、夢話、極巨炮、極巨招式、Z招式，使用失敗。";
            if (value.startsWith("This attack charges on the first turn and executes on the second. Power is halved if the weather is Hail, Primordial Sea, Rain Dance, or Sandstorm and the user is not holding Utility Umbrella. If the user is holding a Power Herb or the weather is Desolate Land or Sunny Day, the move completes in one turn. If the user is holding Utility Umbrella and the weather is Desolate Land or Sunny Day, the move still requires a turn to charge.")) node.nodeValue = "在第一回合進行蓄力，第二回合攻擊目標。如果當天氣為大晴天或大日照狀態或攜帶了強力香草，可以立刻結束蓄力，在第一回合發動招式。在天氣為下雨、大雨、沙暴或冰雹狀態時且自身沒有攜帶萬能傘，威力減半。如果當天氣為大晴天或大日照狀態時自身攜帶了萬能傘，仍然需要蓄力一回合。";
            if (value.startsWith("This attack charges on the first turn and executes on the second. Power is halved if the weather is Primordial Sea, Rain Dance, Sandstorm, or Snow and the user is not holding Utility Umbrella. If the user is holding a Power Herb or the weather is Desolate Land or Sunny Day, the move completes in one turn. If the user is holding Utility Umbrella and the weather is Desolate Land or Sunny Day, the move still requires a turn to charge.")) node.nodeValue = "在第一回合進行蓄力，第二回合攻擊目標。如果當天氣為大晴天或大日照狀態或攜帶了強力香草，可以立刻結束蓄力，在第一回合發動招式。在天氣為下雨、大雨、沙暴或下雪狀態時且自身沒有攜帶萬能傘，威力減半。如果當天氣為大晴天或大日照狀態時自身攜帶了萬能傘，仍然需要蓄力一回合。";
            if (value.startsWith("The user transforms into the target. The target's current stats, stat stages, types, moves, Ability, weight, gender, and sprite are copied. The user's level and HP remain the same and each copied move receives only")) node.nodeValue = "使用者變身成目標寶可夢。目標的當前能力、能力等級、屬性、招式、特性、重量和種族都會被複製。使用者的HP不變，複製的招式均只有5點PP。如果目標的利用其特性變形，無法變身成目標。如果使用者或目標已經變身、命中了替身、目標的幻覺特性正在偽裝，使用失敗。";
            if (value.startsWith("Causes the target to fall asleep at the end of the next turn. Fails when used if the target cannot fall asleep or if it already has a non-volatile status condition. At the end of the next turn, if the target is still active, does not have a non-volatile status condition, and can fall asleep, it falls asleep. If the target becomes affected, this effect cannot be prevented by Safeguard or a substitute, or by falling asleep and waking up during the effect.")) node.nodeValue = "使目標陷入瞌睡狀態。在被施放哈欠狀態的接下來的1個回合結束時，如果目標仍在場，沒有異常狀態且可以入睡，處於哈欠狀態的寶可夢解除哈欠狀態並陷入睡眠狀態。目標在已陷入瞌睡狀態時無法通過神秘守護、替身或睡覺來解除這個狀態。";
            if (value.startsWith("For 5 turns, the user is immune to Ground-type attacks and the effects of Spikes, Toxic Spikes, Sticky Web, and the Arena Trap Ability as long as it remains active. If the user uses Baton Pass, the replacement will gain the effect. Ingrain, Smack Down, Thousand Arrows, and Iron Ball override this move if the user is under any of their effects. Fails if the user is already under this effect or the effects of Ingrain, Smack Down, or Thousand Arrows.")) node.nodeValue = "5回合內且使用者在場，使用者免疫地面屬性招式，不受沙穴特性和毒菱、撒菱、黏黏網和場地型狀態等狀態變化的影響。處於紮根、擊落狀態或擁有飄浮特性時使用電磁飄浮會失敗。處於重力狀態時無法選擇電磁飄浮招式。";
            if (value.startsWith("For 5 turns, the target is prevented from restoring any HP as long as it remains active. During the effect, healing and draining moves are unusable, and Abilities and items that grant healing will not heal the user. If an affected Pokemon uses Baton Pass, the replacement will remain unable to restore its HP. Pain Split and the Regenerator Ability are unaffected. Relevant Z-Powered moves can still be selected and executed during this effect.")) node.nodeValue = "5回合內，只要目標在場，它就無法恢覆任何生命值。在效果期間，回復HP的招式、吸取HP的招式使用失敗。如果目標使用接棒，新上場的寶可夢將獲得此效果。分擔痛楚和再生力特性不受影響。";
            if (value.startsWith("Power is equal to the base move's Max Move power. If this move is successful, each Pokemon on the opposing side is prevented from switching out, even if they have a substitute. They can still switch out if they are holding Shed Shell or use Baton Pass, Flip Turn, Parting Shot, Teleport, U-turn, or Volt Switch. If a target leaves the field using Baton Pass, the replacement will remain trapped. The effect ends if the user leaves the field.")) node.nodeValue = "威力由原本招式的威力決定。使對方全體陷入無法逃走狀態，如果目標持有美麗空殼，使用了接棒、快速折返、拋下狠話、急速折返或伏特替換，可以正常替換。";
            if (value.startsWith("Power is equal to the base move's Max Move power. If this move is successful, the effects of Electric Terrain, Grassy Terrain, Misty Terrain, and Psychic Terrain end, the effects of Reflect, Light Screen, Aurora Veil, Safeguard, Mist, G-Max Steelsurge, Spikes, Toxic Spikes, Stealth Rock, and Sticky Web end for the target's side, and the effects of G-Max Steelsurge, Spikes, Toxic Spikes, Stealth Rock, and Sticky Web end for the user's side.")) node.nodeValue = "威力由原本招式的威力決定。移除對方場地上的白霧、光牆、反射壁、極光幕和神秘守護，移除雙方場地上入場可生效的狀態和場地型狀態。";
            if (value.startsWith("Power is equal to the base move's Max Move power. If this move is successful, it sets up a hazard on the opposing side of the field, damaging each opposing Pokemon that switches in. Foes lose 1/32, 1/16, 1/8, 1/4, or 1/2 of their maximum HP, rounded down, based on their weakness to the Steel type")) node.nodeValue = "威力由原本招式的威力決定。向對手場地撒下尖銳的鋼釘，使對手交換上場的寶可夢受到傷害。對手會失去其最大生命值的1/32(四倍抵抗)、1/16(兩倍抵抗)、1/8、1/4(兩倍克制)或1/2(四倍克制)，傷害值受到鋼屬性相性的影響，向下取整。如果對手的寶可夢成功使出晶光轉轉，高速旋轉或清除濃霧，鋼釘解除。";
            if (value.startsWith("Power is equal to the base move's Max Move power. If this move is successful, it sets up a hazard on the opposing side of the field, damaging each opposing Pokemon that switches in. Foes lose 1/32, 1/16, 1/8, 1/4, or 1/2 of their maximum HP, rounded down, based on their weakness to the Rock type")) node.nodeValue = "威力由原本招式的威力決定。向對手場地撒下尖銳的岩石，使對手交換上場的寶可夢受到傷害。對手會失去其最大生命值的1/32(四倍抵抗)、1/16(兩倍抵抗)、1/8、1/4(兩倍克制)或1/2(四倍克制)，傷害值受到岩石屬性相性的影響，向下取整。如果對手的寶可夢成功使出晶光轉轉，高速旋轉或清除濃霧，隱形岩解除。";
            if (value.startsWith("Sets up a hazard on the opposing side of the field, damaging each opposing Pokemon that switches in. Fails if the effect is already active on the opposing side. Foes lose 1/32, 1/16, 1/8, 1/4, or 1/2 of their maximum HP")) node.nodeValue = "向對手場地撒下尖銳的岩石，使對手交換上場的寶可夢受到傷害。如果對手場地已存在隱形岩，使用失敗。對手會失去其最大生命值的1/32(四倍抵抗)、1/16(兩倍抵抗)、1/8、1/4(兩倍克制)或1/2(四倍克制)，傷害值受到岩石屬性相性的影響，向下取整。如果對手的寶可夢成功使出晶光轉轉，高速旋轉或清除濃霧，隱形岩解除。";
            if (value.startsWith("If an opposing Pokemon switches out this turn, this move hits that Pokemon before it leaves the field, even if it was not the original target. If the user moves after an opponent using U-turn, but not Baton Pass, it will hit that opponent before it leaves the field. Power doubles and no accuracy check is done if the user hits an opponent switching out, and the user's turn is over; if an opponent faints from this, the replacement Pokemon becomes active immediately.")) node.nodeValue = "如果目標在本回合內準備替換下場，則該招式會立刻攻擊準備離場的寶可夢。如果對手使用拋下狠話，急速折返或伏特替換且先行動，會在對手離場之前擊中該對手。如果擊中了準備替換下場的寶可夢並且使用者的回合結束，傷害翻倍且必定命中。如果對手因此瀕死，替換的寶可夢會在該回合登場。";
            if (value.startsWith("Deals damage to the opposing Pokemon equal to twice the HP lost by the user from a physical attack this turn. This move considers Hidden Power as Normal type, and only the last hit of a multi-hit attack is counted. Fails if the user moves first, if the user was not hit by a physical attack this turn, or if the user did not lose HP from the attack. If the opposing Pokemon used Fissure or Horn Drill and missed, this move deals 65535")) node.nodeValue = "對最後使用物理招式造成自身傷害的寶可夢為目標，造成受到的招式×2倍固定傷害。只計算多次命中攻擊中的最後一次攻擊，覺醒力量會被視為普通屬性。如果使用者先行動、在此次攻擊中沒有失去HP時或所有對手都沒有使用過物理招式攻擊到使用者，招式使用失敗。如果對手使用了地裂或角鑽但沒有命中，則此招式造成65535點的傷害。";
            if (value.startsWith("The power of this move is based on the user's held item. The held item is lost and it activates for the target if applicable. If there is no target or the target avoids this move by protecting itself, the user's held item is still lost. The user can regain a thrown item with Recycle or the Harvest Ability. Fails if the user has no held item, if the held item cannot be thrown, if the user is under the effect of Embargo or Magic Room, or if the user has the Klutz Ability.")) node.nodeValue = "威力效果取決於攜帶的道具。投擲一些特殊的道具，造成傷害後會追加效果。道具會被消耗，即使目標因為防住類招式等原因沒有受到傷害，道具也會被消耗。使用者可以通過撿拾或收獲特性回收道具。如果沒有攜帶道具、攜帶的道具無法投擲、受到查封或魔法空間的影響或使用者擁有笨拙特性，使用失敗。";
            if (value.startsWith("Deals damage two turns after this move is used. At")) node.nodeValue = "使用後，2回合後造成傷害。在該回合結束時，如果使用者在場上，按照雙方當前能力值進行計算傷害；如果使用者不在場上，傷害按照使用者原本的能力值和屬性進行計算，攜帶的道具和特性不會影響傷害。如果當前位置已經陷入未來攻擊狀態，使用失敗。";
            if (value.startsWith("The user is protected from most attacks made by other Pokemon during this turn. This move has a 1/X chance of being successful, where X starts at 1 and triples each time this move is successfully used. X resets to 1 if this move fails, if the user's last move used is not Detect, Endure, King's Shield, Protect, Quick Guard, Spiky Shield, or Wide Guard, or if it was one of those moves and the user's protection was broken. Fails if the user moves last this turn.")) node.nodeValue = "在當回合內，使自身進入守住狀態，保護自身不受到來自其他寶可夢的大部分招式的影響。此招式有1/X的成功幾率，其中X從1開始，每次成功使出此招式時X增加三倍。如果使用失敗，或上一回合使用的不是看穿、挺住、守住、王者盾牌、尖刺防守、碉堡、攔堵、線阱、掀榻榻米、火焰守護、廣域防守或快速防守，X重置為1。如果在本回合使用者最後行動，招式會失敗。";
            if (value.startsWith("The user is protected from most attacks made by other Pokemon during this turn. This move has a 1/X chance of being successful, where X starts at 1 and triples each time this move is successfully used. X resets to 1 if this move fails, if the user's last move used is not Baneful Bunker, Detect, Endure, King's Shield, Max Guard, Obstruct, Protect, Quick Guard, Spiky Shield, or Wide Guard, or if it was one of those moves and the user's protection was broken. Fails if the user moves last this turn.")) node.nodeValue = "在當回合內，使自身進入守住狀態，保護自身不受到來自其他寶可夢的大部分招式的影響。此招式有1/X的成功幾率，其中X從1開始，每次成功使出此招式時X增加三倍。如果使用失敗，或上一回合使用的不是看穿、挺住、守住、王者盾牌、尖刺防守、碉堡、攔堵、極巨防壁、線阱、火焰守護、掀榻榻米、火焰守護、廣域防守或快速防守，X重置為1。如果在本回合使用者最後行動，招式會失敗。";
            if (value.startsWith("The user is protected from most attacks made by other Pokemon during this turn. This move has a 1/X chance of being successful, where X starts at 1 and triples each time this move is successfully used. X resets to 1 if this move fails, if the user's last move used is not Baneful Bunker, Detect, Endure, King's Shield, Protect, Quick Guard, Spiky Shield, or Wide Guard, or if it was one of those moves and the user's protection was broken. Fails if the user moves last this turn.")) node.nodeValue = "在當回合內，使自身進入守住狀態，保護自身不受到來自其他寶可夢的大部分招式的影響。此招式有1/X的成功幾率，其中X從1開始，每次成功使出此招式時X增加三倍。如果使用失敗，或上一回合使用的不是看穿、挺住、守住、王者盾牌、尖刺防守、碉堡、攔堵、極巨防壁、線阱、火焰守護、掀榻榻米、廣域防守或快速防守，X重置為1。如果在本回合使用者最後行動，招式會失敗。";
            if (value.startsWith("The user is protected from most attacks made by other Pokemon during this turn. This move has a 1/X chance of being successful, where X starts at 1 and triples each time this move is successfully used. X resets to 1 if this move fails, if the user's last move used is not Baneful Bunker, Burning Bulwark, Detect, Endure, King's Shield, Max Guard, Obstruct, Protect, Quick Guard, Silk Trap, Spiky Shield, or Wide Guard, or if it was one of those moves and the user's protection was broken. Fails if the user moves last this turn.")) node.nodeValue = "在當回合內，使自身進入守住狀態，保護自身不受到來自其他寶可夢的大部分招式的影響。此招式有1/X的成功幾率，其中X從1開始，每次成功使出此招式時X增加三倍。如果使用失敗，或上一回合使用的不是看穿、挺住、守住、王者盾牌、尖刺防守、碉堡、攔堵、極巨防壁、線阱、火焰守護、掀榻榻米、火焰守護、廣域防守或快速防守，X重置為1。如果在本回合使用者最後行動，招式會失敗。";
            if (value.startsWith("Deals damage to the last opposing Pokemon to hit the user with a special attack this turn equal to twice the HP lost by the user from that attack. If the user did not lose HP from the attack, this move deals 1 HP of damage instead. If that opposing Pokemon's position is no longer in use and there is another opposing Pokemon on the field, the damage is done to it instead. Only the last hit of a multi-hit attack is counted. Fails if the user was not hit by an opposing Pokemon's special attack this turn.")) node.nodeValue = "對最後使用特殊招式造成自身傷害的對應位置寶可夢為目標，造成受到的招式×2倍固定傷害。如果使用者在攻擊中沒有損失HP，此招式造成1傷害。如果對手寶可夢的位置沒有目標，並且場上有另一個對手的寶可夢，則會對其造成傷害，計算多次命中攻擊。所有對手都沒有使用過特殊招式攻擊到使用者時，招式使用失敗。";
            if (value.startsWith("Deals damage to the last opposing Pokemon to hit the user with a special attack this turn equal to twice the HP lost by the user from that attack. If that opposing Pokemon's position is no longer in use and there is another opposing Pokemon on the field, the damage is done to it instead. Only the last hit of a multi-hit attack is counted. Fails if the user was not hit by an opposing Pokemon's special attack this turn, or if the user did not lose HP from the attack.")) node.nodeValue = "對最後使用特殊招式造成自身傷害的對應位置寶可夢為目標，造成受到的招式×2倍固定傷害。如果對手寶可夢的位置沒有目標，並且場上有另一個對手的寶可夢，則會對其造成傷害，計算多次命中攻擊。所有對手都沒有使用過特殊招式攻擊到使用者時，招式使用失敗。";
            if (value.startsWith("Deals damage to the last opposing Pokemon to hit the user with a physical attack this turn equal to twice the HP lost by the user from that attack. If the user did not lose HP from the attack, this move deals 1 HP of damage instead. If that opposing Pokemon's position is no longer in use and there is another opposing Pokemon on the field, the damage is done to it instead. Only the last hit of a multi-hit attack is counted. Fails if the user was not hit by an opposing Pokemon's physical attack this turn.")) node.nodeValue = "對最後使用物理招式造成自身傷害的對應位置寶可夢為目標，造成受到的招式×2倍固定傷害。如果使用者在攻擊中沒有損失HP，此招式造成1傷害。如果對手寶可夢的位置沒有目標，並且場上有另一個對手的寶可夢，則會對其造成傷害，計算多次命中攻擊。所有對手都沒有使用過物理招式攻擊到使用者時，招式使用失敗。";
            if (value.startsWith("Deals damage to the last opposing Pokemon to hit the user with a physical attack this turn equal to twice the HP lost by the user from that attack. If that opposing Pokemon's position is no longer in use and there is another opposing Pokemon on the field, the damage is done to it instead. Only the last hit of a multi-hit attack is counted. Fails if the user was not hit by an opposing Pokemon's physical attack this turn, or if the user did not lose HP from the attack.")) node.nodeValue = "對最後使用物理招式造成自身傷害的對應位置寶可夢為目標，造成受到的招式×2倍固定傷害。如果對手寶可夢的位置沒有目標，並且場上有另一個對手的寶可夢，則會對其造成傷害，計算多次命中攻擊。所有對手都沒有使用過物理招式攻擊到使用者時，招式使用失敗。";
            if (value.startsWith("Has a 20% chance to poison the target. This move becomes a physical attack that makes contact if the value of ((((2 * the user's level / 5 + 2) * 90 * X) / Y) / 50), where X is the user's Attack stat and Y is the target's Defense stat, is greater than the same value where X is the user's Special Attack stat and Y is the target's Special Defense stat. No stat modifiers other than stat stage changes are considered for this purpose. If the two values are equal, this move chooses a damage category at random.")) node.nodeValue = "有20%的幾率使目標中毒。若使用者的攻擊/目標的防禦＞使用者的特攻/目標的特防，則招式為物理招式，且是接觸類招式；若使用者的攻擊/目標的防禦＜使用者的特攻/目標的特防，則招式為特殊招式，且不是接觸類招式；若兩側相等，則隨機為物理或特殊招式。";
            if (value.startsWith("This move can hit a target using Bounce, Fly, or Sky Drop, or is under the effect of Sky Drop. If this move hits a target under the effect of Bounce, Fly, Magnet Rise, or Telekinesis, the effect ends. If the target is a Flying type that has not used Roost this turn or a Pokemon with the Levitate Ability, it loses its immunity to Ground-type attacks and the Arena Trap Ability as long as it remains active. During the effect, Magnet Rise fails for the target and Telekinesis fails against the target.")) node.nodeValue = "攻擊目標造成傷害，並使目標陷入擊落狀態。如果寶可夢在處於飛行、彈跳、自由落體、電磁飄浮或意念移物狀態時陷入了擊落狀態，則這些狀態將會被解除。在此狀態期間，即使使用者擁有飛行屬性或漂浮特性，也可以受到地面屬性招式攻擊，並會受到隱形岩、撒菱、毒菱和黏黏網的影響。在此狀態期間，電磁飄浮或意念移物會使用失敗。";
            if (value.startsWith("Causes the target's Ability to become Simple. Fails if")) node.nodeValue = "使目標的特性變為單純。如果目標的特性是：多屬性、達摩模式、戰鬥切換、群聚變形、牽絆變身、懶惰、畫皮、魚群、界限盾殼、AR系統、一口飛彈、結凍頭、人馬一體、絕對睡眠、全能變身或太晶變形，使用失敗。";
            if (value.startsWith("The user is protected from most attacks made by other Pokemon during this turn. This move has an X/65536 chance of being successful, where X starts at 65535 and halves")) node.nodeValue = "在這個回合中，用戶可以免受其他口袋妖怪的大多數攻擊。此招式成功的幾率為X/65536，其中X從65535開始，每次成功使出此招式時向下取整一半。在連續四次成功使出後，X降至118，並在隨後的使用中以0～65535的隨機選擇一個數。如果此招式使用失敗或用戶的最後一次招式使用失敗，X將重置為65535。如果使用失敗，或上一回合使用的不是看穿、挺住或守住，X重置為65535。如果本回合使用者最後行動，招式會失敗。";
            if (value.startsWith("If the user is not a Ghost type, lowers the user's Speed by 1 stage and raises the user's Attack and Defense by 1 stage. If the user is a Ghost type, the user loses 1/2 of its maximum HP, rounded down and even if it would cause fainting, in exchange for the target losing 1/4 of its maximum HP, rounded down, at the end of each turn while it is active. If the target uses Baton Pass, the replacement will continue to be affected. Fails if there is no target or if the target is already affected.")) node.nodeValue = "如果不帶有幽靈屬性，降低1級速度，並提升1級攻擊和防禦。如果帶有幽靈屬性，減少1/2最大HP(向下取整)，使目標進入詛咒狀態，自身HP不滿1/2最大HP時仍可使用，使用後自身陷入瀕死狀態。該狀態的寶可夢每回合結束時損失1/4最大HP(向下取整)。如果目標使用接棒，新上場的寶可夢會繼續損失HP。如果沒有目標或目標已經進入詛咒狀態，使用失敗。";
            if (value.startsWith("Deals damage to the last opposing Pokemon to hit the user with a special attack this turn equal to twice the HP lost by the user from that attack. If the user did not lose HP from the attack, this move deals damage with a power of 1 instead. If that opposing Pokemon's position is no longer in use, the damage is done to a random opposing Pokemon in range. Only the last hit of a multi-hit attack is counted. Fails if the user was not hit by an opposing Pokemon's special attack this turn.")) node.nodeValue = "對最後使用特殊招式造成自身傷害的寶可夢為目標，造成受到的招式×2倍固定傷害。如果使用者在攻擊中沒有損失HP，此招式造成1傷害。如果對手寶可夢的位置沒有目標，並且場上有另一個對手的寶可夢，則會對其造成傷害，計算多次命中攻擊。所有對手都沒有使用過特殊招式攻擊到使用者時，招式使用失敗。";
            if (value.startsWith("Deals damage to the last opposing Pokemon to hit the user with a physical attack this turn equal to twice the HP lost by the user from that attack. If the user did not lose HP from the attack, this move deals damage with a power of 1 instead. If that opposing Pokemon's position is no longer in use, the damage is done to a random opposing Pokemon in range. Only the last hit of a multi-hit attack is counted. Fails if the user was not hit by an opposing Pokemon's physical attack this turn.")) node.nodeValue = "對最後使用物理招式造成自身傷害的寶可夢為目標，造成受到的招式×2倍固定傷害。如果使用者在攻擊中沒有損失HP，此招式造成1傷害。如果對手寶可夢的位置沒有目標，並且場上有另一個對手的寶可夢，則會對其造成傷害，計算多次命中攻擊。所有對手都沒有使用過物理招式攻擊到使用者時，招式使用失敗。";
            if (value.startsWith("Deals damage to the last opposing Pokemon to hit the user with a physical attack this turn equal to twice the HP lost by the user from that attack. If that opposing Pokemon's position is no longer in use and there is another opposing Pokemon on the field, the damage is done to it instead. This move considers Hidden Power as Normal type, and only the last hit of a multi-hit attack is counted. Fails if the user was not hit by an opposing Pokemon's physical attack this turn, or if the user did not lose HP from the attack.")) node.nodeValue = "對最後使用物理招式造成自身傷害的寶可夢為目標，造成受到的招式×2倍固定傷害。只計算多次命中攻擊中的最後一次攻擊，覺醒力量會被視為普通屬性。所有對手都沒有使用過物理招式攻擊到使用者或在此次攻擊中沒有失去HP時，招式使用失敗。";
            if (value.startsWith("Deals damage to the last opposing Pokemon to hit the user with a special attack this turn equal to twice the HP lost by the user from that attack. If that opposing Pokemon's position is no longer in use and there is another opposing Pokemon on the field, the damage is done to it instead. This move considers Hidden Power as Normal type, and only the last hit of a multi-hit attack is counted. Fails if the user was not hit by an opposing Pokemon's special attack this turn, or if the user did not lose HP from the attack.")) node.nodeValue = "對最後使用特殊招式造成自身傷害的寶可夢為目標，造成受到的招式×2倍固定傷害。只計算多次命中攻擊中的最後一次攻擊，覺醒力量會被視為普通屬性。所有對手都沒有使用過特殊招式攻擊到使用者或在此次攻擊中沒有失去HP時，招式使用失敗。";
            if (value.startsWith("The user faints, and if the Pokemon brought out to replace it does not have full HP or has a non-volatile status condition, its HP is fully restored along with having any non-volatile status condition cured. The replacement is sent out at the end of the turn, and the healing happens before hazards take effect. This effect continues until a Pokemon that meets either of these conditions switches in at the user's position or gets swapped into the position with Ally Switch. Fails if the user is the last unfainted Pokemon in its party.")) node.nodeValue = "使用者陷入瀕死狀態，然後新上場或使用交換場地處於使用者所在位置的寶可夢恢覆全部HP並治癒異常狀態。寶可夢將在回合結束時新上場，在場地狀態生效之前進行治癒。如果使用者是同行寶可夢中最後一只寶可夢，使用失敗。";
            if (value.startsWith("If this attack was successful and the user has not fainted, it steals the target's held item if the user is not holding one. The target's item is not stolen if it is a Mail or Z-Crystal, or if the target is a Kyogre holding a Blue Orb, a Groudon holding a Red Orb, a Giratina holding a Griseous Orb, an Arceus holding a Plate, a Genesect holding a Drive, a Silvally holding a Memory, or a Pokemon that can Mega Evolve holding the Mega Stone for its species. Items lost to this move cannot be regained with Recycle or the Harvest Ability.")) node.nodeValue = "如果成功使出該招式，沒有陷入瀕死且沒有攜帶物品，則會獲得目標的攜帶物品。無法拿走Z純晶、蓋歐卡的靛藍色寶珠、固拉多的朱紅色寶珠、騎拉帝納的白金寶珠、阿爾宙斯的石板、蓋諾賽克特的卡帶、厄鬼椪的面具、銀伴戰獸的記憶碟和擁有黏著特性的物品。";
            if (value.startsWith("If this move is successful, it sets up a hazard on the opposing side of the field, damaging each opposing Pokemon that switches in, unless it is a Flying-type Pokemon or has the Levitate Ability. A maximum of three layers may be set, and opponents lose 1/8 of their maximum HP with one layer, 1/6 of their maximum HP with two layers, and 1/4 of their maximum HP with three layers, all rounded down. Can be removed from the opposing side if any opposing Pokemon uses Mortal Spin, Rapid Spin, or Defog successfully, or is hit by Defog.")) node.nodeValue = "如果成功使出此招式，向對手場地撒菱。撒菱會使交換上場的對手交換上場的寶可夢受到傷害，除非它擁有飛行屬性或擁有漂浮特性。最多累加3層。存在一層撒菱時對手會失去1/8最大HP，兩層失去1/6最大HP，三層失去1/4最大HP。如果對手的寶可夢成功使出晶光轉轉，高速旋轉或清除濃霧，撒菱解除。";
            if (value.startsWith("If an opposing Pokemon switches out this turn, this move hits that Pokemon before it leaves the field, even if it was not the original target. If the user moves after an opponent using Flip Turn, Parting Shot, Teleport, U-turn, or Volt Switch, but not Baton Pass, it will hit that opponent before it leaves the field. Power doubles and no accuracy check is done if the user hits an opponent switching out, and the user's turn is over; if an opponent faints from this, the replacement Pokemon does not become active until the end of the turn.")) node.nodeValue = "如果目標在本回合內準備替換下場，則該招式會立刻攻擊準備離場的寶可夢。如果對手使用快速折返，拋下狠話，急速折返或伏特替換且先行動，會在對手離場之前擊中該對手。如果擊中了準備替換下場的寶可夢並且使用者的回合結束，傷害翻倍且必定命中。如果對手因此瀕死，替換的寶可夢不會在該回合登場。";
            if (value.startsWith("For 5 turns, the user and its party members take 0.5x damage from physical and special attacks, or 0.66x damage if in a Double Battle; does not reduce damage further with Reflect or Light Screen. Critical hits ignore this protection. It is removed from the user's side if the user or an ally is successfully hit by Brick Break, Psychic Fangs, or Defog. Brick Break and Psychic Fangs remove the effect before damage is calculated. Lasts for 8 turns if the user is holding Light Clay. Fails unless the weather is Hail.")) node.nodeValue = "5回合內我方寶可夢受到的特殊招式和物理招式傷害減半，如果己方場上存在多只寶可夢則降低原本的1/3。可以與反射壁及光牆同時共存，但減少傷害的效果無法疊加。擊中要害時無效此效果。如果使用者或友軍被劈瓦、精神之牙和清除濃霧擊中，極光幕消失。劈瓦和精神之牙會在造成傷害前移除極光幕。如果使用者攜帶了光之黏土，持續8回合。只有天氣為冰雹或下雪時才能成功使出。如果我方已處於此效果，使用失敗。";
            if (value.startsWith("Lowers the user's Defense by 1 stage. This move cannot be used successfully unless the user's current form, while considering Transform, is Hoopa Unbound. If")) node.nodeValue = "令使用者的防禦降低1級。僅在使用者為解放胡帕時奏效，否則使用失敗。如果成功使出該招式，解除目標的火焰守護、尖刺防守、碉堡、守住、王者盾牌，使其他寶可夢也能正常攻擊目標。如果目標一側受到戲法防守、掀榻榻米、快速防守或廣域防守的守護，這個守護會在當回合被解除，使其他寶可夢也能正常攻擊目標一側。";
            if (value.startsWith("The user is protected from nearly all attacks made by other Pokemon during this turn, including Max and G-Max Moves")) node.nodeValue = "在當回合內，使自身進入守住狀態，保護自身不受到來自其他寶可夢的幾乎所有招式的影響，包括極巨化和超極巨化招式。此招式有1/X的成功幾率，其中X從1開始，每次成功使用此招式時X增加三倍。如果使用失敗，或上一回合使用的不是看穿、挺住、守住、王者盾牌、尖刺防守、碉堡、攔堵、極巨防壁、線阱、火焰守護、掀榻榻米、火焰守護、廣域防守或快速防守，X重置為1。如果在本回合使用者最後行動，招式會失敗。";
            if (value.startsWith("Deals damage to the last opposing Pokemon to hit the user with a physical or special attack this turn equal to 1.5 times the HP lost by the user from that attack, rounded down. If the user did not lose HP from that attack, this move deals 1 HP of damage instead. If that opposing Pokemon's position is no longer in use and there is another opposing Pokemon on the field, the damage is done to it instead. Only the last hit of a multi-hit attack is counted. Fails if the user was not hit by an opposing Pokemon's physical or special attack this turn.")) node.nodeValue = "對最後使用物理或特殊招式造成自身傷害的對應位置寶可夢為目標，造成受到的招式×1.5倍固定傷害。如果使用者在攻擊中沒有損失HP，此招式造成1傷害。如果對手寶可夢的位置沒有目標，並且場上有另一個對手的寶可夢，則會對其造成傷害，計算多次命中攻擊。所有對手都沒有使用過物理或特殊招式攻擊到使用者時，招式使用失敗。";
            if (value.startsWith("The user faints, and if the Pokemon brought out to replace it does not have full HP or PP, or has a non-volatile status condition, its HP and PP are fully restored along with having any non-volatile status condition cured. The replacement is sent out at the end of the turn, and the healing happens before hazards take effect. This effect continues until a Pokemon that meets any of these conditions switches in at the user's position or gets swapped into the position with Ally Switch. Fails if the user is the last unfainted Pokemon in its party.")) node.nodeValue = "使用者陷入瀕死狀態，然後新上場的寶可夢恢覆全部HP和PP並治癒異常狀態。寶可夢將在回合結束時新上場，在場地狀態生效之前進行治癒。如果使用者是同行寶可夢中最後一只寶可夢，使用失敗。";
            if (value.startsWith("If the user is not a Ghost type, lowers the user's Speed by 1 stage and raises the user's Attack and Defense by 1 stage. If the user is a Ghost type, the user loses 1/2 of its maximum HP, rounded down and even if it would cause fainting, in exchange for the target losing 1/4 of its maximum HP, rounded down, at the end of each turn while it is active. If the target uses Baton Pass, the replacement will continue to be affected. Fails if there is no target or if the target is already affected or has a substitute.")) node.nodeValue = "如果不帶有幽靈屬性，降低1級速度，並提升1級攻擊和防禦。如果帶有幽靈屬性，減少1/2最大HP(向下取整)，使目標進入詛咒狀態，自身HP不滿1/2最大HP時仍可使用，使用後自身陷入瀕死狀態。該狀態的寶可夢每回合結束時損失1/4最大HP(向下取整)。如果目標使用接棒，新上場的寶可夢會繼續損失HP。如果沒有目標、目標已經進入詛咒狀態或命中了替身，使用失敗。";
            if (value.startsWith("Causes the target's Ability to become Insomnia. Fails if")) node.nodeValue = "將目標的特性變更為不眠。目標特性為無法被覆蓋的特性時，煩惱種子使用失敗，包括：多屬性、達摩模式、戰鬥切換、群聚變形、牽絆變身、畫皮、魚群、界限盾殼、AR系統、一口飛彈、結凍頭、人馬一體、絕對睡眠、全能變身和太晶變形。";
            if (value.startsWith("The user will survive attacks made by other Pokemon during this turn with at least 1 HP. This move has a 1/X")) node.nodeValue = "在本回合結束使自身保留至少1點HP。此招式有1/X的成功幾率，其中X從1開始，每次成功使用此招式時X增加三倍。如果使用失敗，或上一回合使用的不是看穿、挺住、守住、王者盾牌、尖刺防守、碉堡、攔堵、線阱、掀榻榻米、火焰守護、廣域防守或快速防守，X重置為1。如果在本回合使用者最後行動，招式會失敗。";
            if (value.startsWith("If this move is successful, it breaks through the target's Baneful Bunker, Detect, King's Shield, Protect, or Spiky Shield for this turn, allowing other Pokemon to attack the target normally. If the target's side is protected by Crafty Shield, Mat Block, Quick Guard, or Wide Guard, that protection is also broken for this turn and other Pokemon may attack the target's side normally.")) node.nodeValue = "如果成功使出該招式，解除目標的火焰守護、尖刺防守、碉堡、守住、王者盾牌，使其他寶可夢也能正常攻擊目標。如果目標一側受到戲法防守、掀榻榻米、快速防守或廣域防守的守護，這個守護會在當回合被解除，使其他寶可夢也能正常攻擊目標一側。";
            if (value.startsWith("If this move is successful, it breaks through the target's Baneful Bunker, Detect, King's Shield, Protect, or Spiky Shield for this turn, allowing other Pokemon to attack the target normally. If the target's side is protected by Crafty Shield, Mat Block, Quick Guard, or Wide Guard, that protection is also broken for this turn and other Pokemon may attack the target's side normally. This")) node.nodeValue = "如果成功使出該招式，解除目標的火焰守護、尖刺防守、碉堡、守住、王者盾牌，使其他寶可夢也能正常攻擊目標。如果目標一側受到戲法防守、掀榻榻米、快速防守或廣域防守的守護，這個守護會在當回合被解除，使其他寶可夢也能正常攻擊目標一側。在第一回合進行蓄力，第二回合發動招式。如果攜帶了強力香草，可以立刻結束蓄力，在第一回合發動招式。";
            if (value.startsWith("For 5 turns, the weather becomes Sandstorm")) node.nodeValue = "接下來5回合的天氣變為沙暴。沙暴時，岩石屬性寶可夢的特防×1.5。除了最後一回合，每個回合結束時除岩石屬性、地面屬性和鋼屬性以外的在場寶可夢受到最大HP1/16的傷害(向下取整)，除非其擁有魔法防守、防塵、沙之力、潑沙或沙隱特性。如果使用者攜帶了沙沙岩石，持續時間延長為8回合。如果當前天氣已為沙暴，使用失敗。";
            if (value.startsWith("For 5 turns, the weather becomes Rain Dance")) node.nodeValue = "接下來5回合的天氣變為下雨。下雨時，水屬性招式的威力×1.5，火屬性招式的威力×0.5。如果使用者攜帶了潮濕岩石，持續時間延長為8回合。如果當前天氣已為下雨，使用失敗。";
            if (value.startsWith("For 5 turns, the weather becomes Sunny Day")) node.nodeValue = "接下來5回合的天氣變為大晴天。大晴天時，火屬性招式的威力×1.5，水屬性招式的威力×0.5。如果使用者攜帶了熾熱岩石，持續時間延長為8回合。如果當前天氣已為大晴天，使用失敗。";
            if (value.startsWith("For 5 turns, the weather becomes Hail")) node.nodeValue = "接下來5回合的天氣變為冰雹。冰雹時，冰屬性寶可夢的防禦×1.5。如果使用者攜帶了冰冷岩石，持續時間延長為8回合。如果當前天氣已為冰雹，使用失敗。";
            if (value.startsWith("For 5 turns, the weather becomes Snow. During the")) node.nodeValue = "接下來5回合的天氣變更為下雪。下雪時，冰屬性寶可夢的防禦×1.5。如果使用者攜帶了冰冷岩石，持續時間延長為8回合。如果當前天氣已為下雪，使用失敗。";
            if (value.startsWith("If one of the user's allies chose to use Fire Pledge or Grass Pledge")) node.nodeValue = "如果使用者的同伴在本回合選擇使用火之誓約或草之誓約但尚未行動，則會在使用者之後立即進行回合，使用者的招式沒有作用。如果與火之誓約組合，同伴將使用150威力的水之誓約，並使己方場地出現彩虹，持續4回合，處於彩虹場地的寶可夢使用招式時追加效果的出現率×2，天恩特性的效果與彩虹的效果可以疊加，但能導致畏縮的招式不疊加。如果與草之誓約組合，同伴將使用150威力的草之誓約，並使對方場地會出現一片濕地，持續4回合，處於濕地場地的寶可夢速度降低至原本的1/4。當用作合體招式時，無論使用者是何種屬性，此招式都會獲得屬性一致加成。不會消耗使用者的水之寶石。無視引水特性的吸引效果。";
            if (value.startsWith("If one of the user's allies chose to use Grass Pledge or Water Pledge")) node.nodeValue = "如果使用者的同伴在本回合選擇使用草之誓約或水之誓約但尚未行動，則會在使用者之後立即進行回合，使用者的招式沒有作用。如果與草之誓約組合，同伴將使用150威力的火之誓約，並使對方場地出現一片火海，持續4回合，處於火海場地的非火屬性寶可夢每回合損失最大HP×1/8的HP。如果與水之誓約組合，同伴將使用150威力的水之誓約，並使己方場地出現彩虹，持續4回合，處於彩虹場地的寶可夢使用招式時追加效果的出現率×2，天恩特性的效果與彩虹的效果可以疊加，但能導致畏縮的招式不疊加。當用作合體招式時，無論使用者是何種屬性，此招式都會獲得屬性一致加成。不會消耗使用者的火之寶石。";
            if (value.startsWith("If one of the user's allies chose to use Fire Pledge or Water Pledge")) node.nodeValue = "如果使用者的同伴在本回合選擇使用火之誓約或水之誓約但尚未行動，則會在使用者之後立即進行回合，使用者的招式沒有作用。如果與火之誓約組合，同伴將使用150威力的火之誓約，並使對方場地出現一片火海，持續4回合，處於火海場地的非火屬性寶可夢每回合損失最大HP×1/8的HP。如果與水之誓約組合，同伴將使用150威力的草之誓約，並使對方場地會出現一片濕地，持續4回合，處於濕地場地的寶可夢速度降低至原本的1/4。當用作合體招式時，無論使用者是何種屬性，此招式都會獲得屬性一致加成。不會消耗使用者的草之寶石。";
            if (value.startsWith("Causes the target's Ability to be rendered ineffective as long as it remains active. If")) node.nodeValue = "使目標陷入無特性狀態。處於無特性狀態的寶可夢的特性無效。如果目標使用了接棒，新上場的寶可夢會繼承此效果。如果目標的特性是一口飛彈、AR系統、戰鬥切換、多屬性、人馬一體、結凍頭、牽絆變身、全能變身、達摩模式、群聚變形、界限盾殼、群聚變形、絕對睡眠、太晶變形、魚群或畫皮，使用失敗。通過接棒獲得此效果時，此效果立即結束。";
            if (value.startsWith("Causes the user's types to become the same as the current types of the target. If the")) node.nodeValue = "使用者的屬性變得和目標一樣。如果目標擁有無屬性和其他屬性，使用者的屬性會忽略無屬性。如果目標為單一無屬性，招式使用失敗。但如果單一無屬性的目標受到森林咒術或萬聖夜影響，則招式可以使用，使用者改變屬性時會將無屬性視為一般屬性。";
            if (value.startsWith("If this move is successful, the user is locked into this move and cannot make another move until it misses, 5 turns have passed, or the attack cannot be used. Power")) node.nodeValue = "如果成功使出該招式，在接下來的4回合會繼續使用此招式進行攻擊，無法使用其他招式、使用道具、替換寶可夢。此招式每次命中，威力都會翻倍，如果在對戰中自身曾使用變圓，該招式威力還會再次翻倍。如果這個招式被夢話調用，只會使用一個回合。";
            if (value.startsWith("The Pokemon at the user's position steals 1/8 of the target's maximum HP, rounded down, at the end of each turn. If")) node.nodeValue = "每回合結束時，處於使用者位置的寶可夢奪走目標1/8的最大HP，向下取整一半。攜帶大根莖時，恢覆量提升30%，向下取整一半。如果目標使用接棒，新上場的寶可夢會繼續被奪取HP。如果目標離場、成功使出晶光轉轉或高速旋轉，效果結束。對草屬性寶可夢無效。";
            if (value.startsWith("If the user moves after the target, the target's Ability is rendered ineffective as long as it remains active. If")) node.nodeValue = "如果目標在該回合已使用過招式，使目標陷入無特性狀態。如果目標的特性是：無特性、人馬一體、牽絆變身、絕對睡眠、畫皮、一口飛彈、結凍頭、多屬性、群聚變形、AR系統、魚群、界限盾殼、戰鬥切換、太晶變形、達摩模式或全能變身，該效果不會發生。通過接棒獲得該效果時會立即結束該效果。";
            if (value.startsWith("The user and its party members are protected from attacks with original or altered priority greater than 0 made by other Pokemon")) node.nodeValue = "在當回合內，使我方全體進入守住狀態，保護我方全體不受到來自其他寶可夢的大部分先制招式的影響。此招式有1/X的成功幾率，其中X從1開始，每次成功使用此招式時X增加三倍。如果使用失敗，或上一回合使用的不是看穿、挺住、守住、王者盾牌、尖刺防守、碉堡、攔堵、極巨防壁、線阱、火焰守護、掀榻榻米、火焰守護、廣域防守或快速防守，X重置為1。如果在本回合使用者最後行動，招式會失敗。";
            if (value.startsWith("This move is permanently replaced by the last move used by the target. The copied move has")) node.nodeValue = "將寫生永久替換為目標最後使用過的招式，並擁有最大PP。以下招式無法被寫生：已經學會的招式、寫生、掙扎、喋喋不休、異次元猛攻(第九世代起)、暗黑洞(第九世代起)、覆生祈禱、晶光星群和Z招式。";
            if (value.startsWith("For 3 turns, the target cannot avoid any attacks made against it, other than")) node.nodeValue = "3回合內使目標進入意念移物狀態。處於意念移物狀態的寶可夢免疫地面屬性招式，不受沙穴特性和毒菱、撒菱、黏黏網和場地型狀態等狀態變化的影響。以處於意念移物狀態的寶可夢為目標的除一擊必殺招式外的招式必定命中。開啟重力狀態，被擊落、千箭齊發命中，交換寶可夢都會覆蓋意念移物狀態。如果目標使用了接棒，新上場的寶可夢繼承此狀態。無法對超級耿鬼、阿羅拉地鼠、地鼠、阿羅拉三地鼠、三地鼠、沙丘娃、噬沙堡爺使用意念移物使它們進入該狀態，但它們（除了超級耿鬼）可以被接棒傳遞得到此狀態且可以正常生效。";
            if (value.startsWith("The target receives the user's held item. Fails if the user has no item or")) node.nodeValue = "使用者在本次戰鬥中將攜帶物品給予目標。如果使用者沒有物品、目標已攜帶物品或給予的是可使攜帶者進行超級進化的進化石、Z純晶或郵件，使用失敗。如果目標或使用者是攜帶著靛藍色寶珠的蓋歐卡、朱紅色寶珠的固拉多、白金寶珠的騎拉帝納、石板的阿爾宙斯、卡帶的蓋諾賽克特、記憶碟的銀伴戰獸、面具的厄鬼椪、腐朽之劍的蒼響、腐朽之盾的藏瑪然特，使用失敗。";
            if (value.startsWith("For 4 turns, the target's last move used becomes disabled. Fails if one")) node.nodeValue = "4回合內，目標不能使用陷入定身法狀態前最後使用的招式。如果目標尚未在本場對戰中使用招式，或最後使用的招式是掙扎、極巨化、超極巨化招式或已經陷入定身法狀態，定身法使用失敗。";
            if (value.startsWith("Until the end of the turn, the user is unaffected by certain non-damaging moves directed at it and will instead use such moves against the original user")) node.nodeValue = "當回合內進入魔法反射狀態，將對方以自身為目標的部分變化招式無效化，並反彈給招式的使用者。被魔法反射狀態反彈的招式不會被再次反彈。如果場上同時有魔法反射和魔法鏡，由最左邊的寶可夢反彈招式。避雷針和引水特性會在反彈生效之前提高特攻。";
            if (value.startsWith("While the user remains active, this move is replaced by the last move used by the target")) node.nodeValue = "將此招式替換為目標最後使用的招式，PP變為5。如果目標尚未在本場對戰中使用招式，或本回合使用招式失敗，或自身已經學會目標的招式，模仿會失敗。如果目標的招式為以下招式時，模仿使用失敗：仿效、夢話、揮指、鸚鵡學舌、自然之力、借助、搶先一步、模仿、寫生、變身、喋喋不休、打嗝、慶祝、牽手、巨獸彈、巨獸斬、極巨炮、晶光星群、掙扎、搭檔招式、Z招式或極巨招式。";
            if (value.startsWith("Power is equal to the base move's Max Move power. If this move is successful, each Pokemon on the opposing side is prevented from switching")) node.nodeValue = "威力由原本招式的威力決定。使全體對手陷入束縛狀態。束縛狀態持續4～5回合(如果攜帶了緊纏鉤爪，則為7回合)，處於束縛狀態的寶可夢每回合結束時會受到1/8最大HP的傷害（如果攜帶了緊綁束帶，則為1/6）並不能換下，向下取整一半。如果目標持有美麗空殼或使用了接棒、快速折返、拋下狠話、急速折返或伏特替換，可以正常替換。如果使用者或目標離場，或者目標成功使出晶光轉轉、高速旋轉或替身，效果結束。使用此招式或其他束縛招式不會累計或重置束縛狀態。";
            if (value.startsWith("The user regains the item it last used. Fails if the user is holding an item, if the user has not held an item, if")) node.nodeValue = "回收在對戰中最後消耗的道具。如果自身攜帶有道具，則招式使用失敗。因受到攻擊而破裂的氣球無法被回收。通過燒凈、啄食、蟲咬、渴望、拍落、掉包、小偷或戲法失去的道具無法被回收。通過投擲消耗的道具可以被回收。";
            if (value.startsWith("The user has 1/16 of its maximum HP restored at the end of each turn, but it is prevented from switching out and")) node.nodeValue = "使自己進入紮根狀態。處於紮根狀態下的寶可夢無法替換下場，在回合結束時會回復最大HP的1/16。不受對手的強制替換效果影響。如果使用快速折返，拋下狠話，急速折返或伏特替換，可以正常離場。如果使用者使用接棒，新上場的寶可夢將獲得此效果。在此期間，即使使用者擁有飛行屬性或漂浮特性，也可以受到地面屬性招式攻擊，並會受到隱形岩、撒菱、毒菱和黏黏網的影響。";
            if (value.startsWith("Sets up a hazard on the opposing side of the field, damaging each opposing Pokemon that switches in, unless it is a Flying-type Pokemon or has the Levitate Ability. Can be used up to three times before failing. Opponents lose 1/8 of their maximum HP with one layer, 1/6")) node.nodeValue = "向對手的場地撒菱，使對手交換上場的寶可夢受到傷害，除非它擁有飛行屬性或擁有漂浮特性。最多累加3層。存在一層撒菱時對手會失去1/8最大HP，兩層失去1/6最大HP，三層失去1/4最大HP。如果對手的寶可夢成功使出晶光轉轉、高速旋轉或清除濃霧，撒菱解除。";
            if (value.startsWith("Sets up a hazard on the opposing side of the field, poisoning each opposing Pokemon that switches in")) node.nodeValue = "向對手的場地布滿毒菱，使對手交換上場的寶可夢中毒，除非它擁有飛行屬性或擁有漂浮特性。最多累加2層。存在一層毒菱時對手會陷入中毒狀態，兩層會陷入劇毒。如果對手的寶可夢成功使出晶光轉轉，高速旋轉或清除濃霧，或換上毒屬性且是地面上的寶可夢時，毒菱解除。神秘守護可以防止異常狀態，但替身不能。";
            if (value.startsWith("If an adjacent opposing Pokemon switches out this turn, this move hits that Pokemon before it leaves the field, even if")) node.nodeValue = "如果目標在本回合內準備替換下場，則該招式會立刻攻擊準備離場的寶可夢。如果對手使用了拋下狠話、快速折返、急速折返或伏特替換且先行動，會在對手離場之前擊中該對手。如果擊中了準備替換下場的寶可夢並且使用者的回合結束，傷害翻倍且必定命中。如果對手因此瀕死，替換的寶可夢不會在該回合登場。";
            if (value.startsWith("The user swaps its held item with the target's held item. Fails if")) node.nodeValue = "使用者與目標交換攜帶物品。如果試圖交換郵件、Z純晶、可使攜帶者進行超級進化的進化石或雙方均無道具時，使用失敗。如果試圖向蓋歐卡，固拉多，騎拉帝納，阿爾宙斯，蓋諾賽克特，銀伴戰獸和厄鬼椪贈送或拿走它的靛藍色寶珠，朱紅色寶珠，白金寶珠，石板，卡帶，記憶碟或面具，使用失敗。如果目標擁有黏著特性，沒有效果。";
            if (value.startsWith("If the user is not a Ghost type, lowers the user's Speed by 1 stage and raises the user's Attack and Defense by 1 stage, unless the user's Attack and Defense stats are both at stage 6. If the user is a Ghost type, the user loses 1/2 of its maximum HP, rounded down and even if it would cause fainting, in exchange for the target losing 1/4 of its maximum HP, rounded down, at the end of each turn while it is active. If the target uses Baton Pass, the replacement will continue to be affected. Fails if the target is already affected or has a substitute")) node.nodeValue = "如果不帶有幽靈屬性，降低1級速度，並提升1級攻擊和防禦。如果帶有幽靈屬性，減少1/2最大HP(向下取整)，使目標進入詛咒狀態，自身HP不滿1/2最大HP時仍可使用，使用後自身陷入瀕死狀態。該狀態的寶可夢每回合結束時損失1/4最大HP(向下取整)。如果目標使用接棒，新上場的寶可夢會繼續損失HP。如果命中了替身、沒有目標或目標已經進入詛咒狀態，使用失敗。";
            if (value.startsWith("The user spends two or three turns locked into this move and becomes confused")) node.nodeValue = "接下來的2～3回合使用此招式攻擊隨機一位對手，無法使用其他招式或替換。如果此招式被禁用、在回合開始時處於睡眠狀態、持續2回合效果中的第一回合或持續3回合效果中的前兩回合的攻擊對目標沒有產生效果，則效果結束不會陷入混亂。如果此招式由夢話使出且使用者處於睡眠狀態，則此招式只使用一次，不會陷入混亂。因回合經過解除時，使用者陷入混亂狀態。";
            if (value.startsWith("Lowers the target's evasiveness by 1 stage. If this move is successful and whether or not the target's evasiveness was affected, the effects of Reflect")) node.nodeValue = "令目標的閃避率降低1級。只要此招式成功使出，無論是否降低了目標的閃避率，都會移除對方場地上的白霧、光牆、反射壁、極光幕和神秘守護，移除雙方場地上入場可生效的狀態和場地型狀態。如果目標處於替身狀態，則雖然閃避率不會降低，但後續效果仍然發生。";
            if (value.startsWith("The user is protected from most attacks made by other Pokemon during this turn, and Pokemon trying to make contact with the user have their Defense lowered by 2")) node.nodeValue = "在當回合內，使自身進入守住狀態，保護自身不受到來自其他寶可夢的大部分招式的影響，對變化技能無效。處於守住狀態期間受到接觸類招式的攻擊時，令攻擊方降低2級防禦。此招式有1/X的成功幾率，其中X從1開始，每次成功使用此招式時X增加三倍。如果使用失敗，或上一回合使用的不是看穿、挺住、守住、王者盾牌、尖刺防守、碉堡、攔堵、極巨防壁、線阱、火焰守護、掀榻榻米、廣域防守或快速防守，X重置為1。如果在本回合使用者最後行動，招式會失敗。";
            if (value.startsWith("The user is protected from most attacks made by other Pokemon during this turn, and Pokemon trying to make contact with the user have their Speed lowered by 1")) node.nodeValue = "在當回合內，使自身進入守住狀態，保護自身不受到來自其他寶可夢的大部分招式的影響，對變化技能無效。處於守住狀態期間受到接觸類招式的攻擊時，令攻擊方降低1級速度。此招式有1/X的成功幾率，其中X從1開始，每次成功使用此招式時X增加三倍。如果使用失敗，或上一回合使用的不是看穿、挺住、守住、王者盾牌、尖刺防守、碉堡、攔堵、極巨防壁、線阱、火焰守護、掀榻榻米、廣域防守或快速防守，X重置為1。如果在本回合使用者最後行動，招式會失敗。";
            if (value.startsWith("The user is protected from most attacks made by other Pokemon during this turn, and Pokemon trying to make contact with the user have their Attack lowered by 2")) node.nodeValue = "在當回合內，使自身進入守住狀態，保護自身不受到來自其他寶可夢的大部分招式的影響，對變化技能無效。處於守住狀態期間受到接觸類招式的攻擊時，令攻擊方降低2級攻擊。此招式有1/X的成功幾率，其中X從1開始，每次成功使用此招式時X增加三倍。如果使用失敗，或上一回合使用的不是看穿、挺住、守住、王者盾牌、尖刺防守、碉堡、攔堵、極巨防壁、線阱、火焰守護、掀榻榻米、廣域防守或快速防守，X重置為1。如果在本回合使用者最後行動，招式會失敗。";
            if (value.startsWith("The user is protected from most attacks made by other Pokemon during this turn, and Pokemon trying to make contact with the user have their Attack lowered by 1")) node.nodeValue = "在當回合內，使自身進入守住狀態，保護自身不受到來自其他寶可夢的大部分招式的影響，對變化技能無效。處於守住狀態期間受到接觸類招式的攻擊時，令攻擊方降低1級攻擊。此招式有1/X的成功幾率，其中X從1開始，每次成功使用此招式時X增加三倍。如果使用失敗，或上一回合使用的不是看穿、挺住、守住、王者盾牌、尖刺防守、碉堡、攔堵、極巨防壁、線阱、火焰守護、掀榻榻米、廣域防守或快速防守，X重置為1。如果在本回合使用者最後行動，招式會失敗。";
            if (value.startsWith("The user is protected from most attacks made by other Pokemon during this turn, and Pokemon trying to make contact with the user become burned")) node.nodeValue = "在當回合內保護自身不受到來自其他寶可夢的大部分招式的影響，對變化技能無效。處於守住狀態期間受到接觸類招式的攻擊時，令攻擊方灼傷。此招式有1/X的成功幾率，其中X從1開始，每次成功使用此招式時X增加三倍。如果使用失敗，或上一回合使用的不是看穿、挺住、守住、王者盾牌、尖刺防守、碉堡、攔堵、極巨防壁、線阱、火焰守護、掀榻榻米、廣域防守或快速防守，X重置為1。如果在本回合使用者最後行動，招式會失敗。";
            if (value.startsWith("The user is protected from most attacks made by other Pokemon during this turn, and Pokemon making contact with the user lose 1/8 of their maximum")) node.nodeValue = "在當回合內，使自身進入守住狀態，保護自身不受到來自其他寶可夢的大部分招式的影響。處於守住狀態期間受到接觸類招式的攻擊時，令攻擊方損失其1/8最大HP。此招式有1/X的成功幾率，其中X從1開始，每次成功使用此招式時X增加三倍。如果使用失敗，或上一回合使用的不是看穿、挺住、守住、王者盾牌、尖刺防守、碉堡、攔堵、極巨防壁、線阱、火焰守護、掀榻榻米、廣域防守或快速防守，X重置為1。如果在本回合使用者最後行動，招式會失敗。";
            if (value.startsWith("The user is protected from most attacks made by other Pokemon during this turn, and Pokemon making contact with the user become poisoned")) node.nodeValue = "在當回合內保護自身不受到來自其他寶可夢的大部分招式的影響。處於守住狀態期間受到接觸類招式的攻擊時，令攻擊方中毒。此招式有1/X的成功幾率，其中X從1開始，每次成功使用此招式時X增加三倍。如果使用失敗，或上一回合使用的不是看穿、挺住、守住、王者盾牌、尖刺防守、碉堡、攔堵、極巨防壁、線阱、火焰守護、掀榻榻米、火焰守護、廣域防守或快速防守，X重置為1。如果在本回合使用者最後行動，招式會失敗。";
            if (value.startsWith("Power doubles if the user's last move on the previous turn, including moves called by other moves")) node.nodeValue = "如果自身上一回合因異常狀態或狀態變化而無法行動，或者使用的招式失敗、沒有命中目標或者對目標沒有效果，則本回合使用此招式威力翻倍。上一回合使用的招式被目標使用守住等招式阻擋後不會觸發此招式的威力翻倍效果。";
            if (value.startsWith("Prevents the target from switching for four or five turns (seven turns if the user is holding Grip Claw). Causes damage to the target equal to 1/8")) node.nodeValue = "使目標陷入束縛狀態。束縛狀態持續4～5回合(如果攜帶了緊纏鉤爪，則為7回合)，處於束縛狀態的寶可夢每回合結束時會受到1/8最大HP的傷害（如果攜帶了緊綁束帶，則為1/6）並不能換下，向下取整一半。如果目標持有美麗空殼或使用了接棒、快速折返、拋下狠話、急速折返或伏特替換，可以正常替換。如果使用者或目標離場，或者目標成功使出晶光轉轉、高速旋轉或替身，效果結束。使用此招式或其他束縛招式不會累計或重置束縛狀態。";
            if (value.startsWith("If the target is holding an item that can be removed from it, ignoring the Sticky Hold Ability, this move's power is multiplied by 1.5")) node.nodeValue = "如果目標持有可被拍落的攜帶物品並且沒有黏著特性，本次攻擊的傷害×1.5。如果使用者沒有瀕死，則目標在戰鬥結束前失去其攜帶物品。因拍落而失去的物品無法通過回收利用或收獲特性回收。此招式無法拍落：Z純晶、可使攜帶者進行超級進化的進化石、蓋歐卡的靛藍色寶珠、固拉多的朱紅色寶珠、騎拉帝納的白金寶珠、阿爾宙斯的石板、蓋諾賽克特的卡帶、銀伴戰獸的記憶碟、厄鬼椪的面具、蒼響的腐朽之劍、藏瑪然特的腐朽之盾和擁有黏著特性的寶可夢的攜帶物品。";
            if (value.startsWith("Prevents the target from switching out. The target can still switch out if")) node.nodeValue = "使目標陷入無法逃走狀態。如果目標使用接棒離場，新上場的寶可夢將無法逃走。如果目標使用快速折返，拋下狠話，急速折返或伏特替換，可以正常離場。如果使用者離場，效果結束。";
            if (value.startsWith("Causes the target's Ability to become the same as the user's. Fails if")) node.nodeValue = "將目標的特性變為與使用者相同。如果目標的特性為多屬性、達摩模式、戰鬥切換、群聚變形、牽絆變身、畫皮、魚群、懶惰、界限盾殼、AR系統、一口飛彈、結凍頭、人馬一體、絕對睡眠、全能變身和太晶變形；或使用者的的特性為複製、接球手、化學之力、陰晴不定、花之禮、多屬性、變身者、幻覺、達摩模式、戰鬥切換、群聚變形、牽絆變身、畫皮、魚群、界限盾殼、AR系統、飽了又餓、結凍頭、人馬一體、絕對睡眠、化學變化氣體、全能變身、發號施令、古代活性、夸克充能、面影輝映、太晶變形、太晶甲殼、歸零化境和毒傀儡，使用失敗。";
            if (value.startsWith("One of the user's known moves, besides this move, is selected for use at random. Fails if the user is not asleep")) node.nodeValue = "隨機使用1個自身學會的其它招式。只能在睡覺時使用，如果不處於睡眠，使用失敗。不會消耗所選擇的招式的PP，當隨機使用的招式PP為0時，該招式仍可被夢話使用。以下招式不會被夢話發動：夢話、揮指、鸚鵡學舌、自然之力、借助、搶先一步、仿效、模仿、寫生、真氣拳、鳥嘴加農炮、陷阱甲殼、忍耐、吵鬧、喋喋不休、打嗝、慶祝、牽手、極巨炮、Z招式以及蓄力招式。";
            if (value.startsWith("The user swaps its Ability with the target's Ability. Fails if")) node.nodeValue = "自身和目標交換特性。如果自身或目標的是特性是：神奇守護、多屬性、幻覺、達摩模式、戰鬥切換、群聚變形、 牽絆變身、畫皮、魚群、界限盾殼、AR系統、飽了又餓、一口飛彈、結凍頭、人馬一體、絕對睡眠、化學變化氣體、全能變身、發號施令、古代活性和夸克充能，使用失敗。";
            if (value.startsWith("For its next 3 turns, the target is forced to repeat its last move used")) node.nodeValue = "令目標接下來的3回合，只能使用其最後使用的招式。如果目標受到影響的招式超出PP，效果結束。如果目標已陷入此狀態，或者最後使出的是再來一次、模仿、寫生、掙扎、變身、借助、仿效、搶先一步、揮指、鸚鵡學舌、自然之力、夢話、極巨炮、極巨招式、Z招式，使用失敗。";
            if (value.startsWith("A random move among those known by the user's party")) node.nodeValue = "隨機使用隊伍中其它1只寶可夢的一個招式。以下招式不會被發動：守住類招式、鳥嘴加農炮、打嗝、傳遞禮物、彈跳、慶祝、巴投、仿效、喋喋不休、雙倍奉還、渴望、同命、潛水、挖洞、龍尾、挺住、佯攻、飛翔、真氣拳、幫助、看我嘛、搶先一步、牽手、揮指、模仿、鏡面反射、鸚鵡學舌、自然之力、潛靈奇襲、憤怒粉、吼叫、暗影潛襲、陷阱甲殼、寫生、自由落體、夢話、搶奪、聚光燈、掉包、掙扎、掉包、變身、戲法或吹飛。";
            if (value.startsWith("This move can hit airborne Pokemon, which")) node.nodeValue = "能夠擊中不在地面上的寶可夢並令其陷入擊落狀態。此招式對任何未處於擊落狀態的飛行屬性寶可夢的屬性相性變為1×，另一屬性不參與計算，反轉對戰除外。 此招式對任何未處於擊落狀態的飄浮特性寶可夢直接計算它本身的屬性相性。如果寶可夢在處於飛行、彈跳、自由落體、電磁飄浮或意念移物狀態時陷入了擊落狀態，則這些狀態將會被解除。在此狀態期間，即使使用者擁有飛行屬性或漂浮特性，也可以受到地面屬性招式攻擊，並會受到隱形岩、撒菱、毒菱和黏黏網的影響。在此狀態期間，電磁飄浮或意念移物會使用失敗。";
            if (value.startsWith("For 5 turns, the evasiveness of all active Pokemon is multiplied by 0.6")) node.nodeValue = "5回合內，所有在場的寶可夢閃避率降低60%。進入重力狀態時，解除所有寶可夢的飛翔、意念移物狀態。處於重力狀態時，躍起、飛踢、飛膝踢、電磁飄浮、飛翔、彈跳、自由落體、意念移物和飛身重壓無法使用。飛行屬性、飄浮特性、電磁飄浮狀態及攜帶了氣球的寶可夢可以被地面屬性招式、撒菱、毒菱、黏黏網和沙穴特性影響。如果此狀態已經生效，使用失敗。";
            if (value.startsWith("The user uses the last move used by any Pokemon, including itself")) node.nodeValue = "使用場上寶可夢最後成功使用的招式。如果沒有使用過任何招式，或最後成功使用的招式為：仿效、夢話、揮指、鸚鵡學舌、自然之力、借助、搶先一步、模仿、寫生、搶奪、變身、吹飛、吼叫、龍尾、巴投、真氣拳、鳥嘴加農炮、陷阱甲殼、守住類招式、看我嘛、憤怒粉、佯攻、幫助、鏡面反射(第九世代前)、雙倍奉還、同命、挺住、戲法、掉包、傳遞禮物、渴望、小偷、打嗝、喋喋不休、聚光燈、慶祝、牽手、巨獸彈、巨獸斬、極巨炮、晶光星群、掙扎、Z招式，使用失敗。";
            if (value.startsWith("The target immediately uses its last used move. Fails if")) node.nodeValue = "令目標再使用一次先前使用的招式。無視速度和優先度條件。以下情況會導致號令使用失敗：目標沒有使用招式且使用號令的寶可夢比目標提前使用；使出的招式已耗盡PP；處於畏縮；使用多回合攻擊類招式、仿效、夢話、擊掌奇襲、迎頭一擊、揮指、鸚鵡學舌、自然之力、借助、搶先一步、號令、蓄力的招式、鳥嘴加農炮、陷阱甲殼、真氣拳、攔堵、王者盾牌、忍耐、模仿、寫生、變身、吵鬧、喋喋不休、打嗝、慶祝、牽手、極巨炮、掙扎、極巨招式、Z招式、使用後下一回合將無法動彈的招式。";
            if (value.startsWith("The user and its party members are protected from moves made by other Pokemon")) node.nodeValue = "在當回合內，使我方全體進入守住狀態，保護我方全體不受到來自其他寶可夢的大部分招式的影響。此招式有1/X的成功幾率，其中X從1開始，每次成功使用此招式時X增加三倍。如果使用失敗，或上一回合使用的不是看穿、挺住、守住、王者盾牌、尖刺防守、碉堡、攔堵、極巨防壁、線阱、火焰守護、掀榻榻米、火焰守護、廣域防守或快速防守，X重置為1。如果在本回合使用者最後行動，招式會失敗。";
            if (value.startsWith("The user takes 1/4 of its maximum HP, rounded down, and puts it into a substitute to take its place in")) node.nodeValue = "用自己最大HP的1/4制造出替身，相等於替身的HP，向下取整。如果使用者離場或替身HP為0，替身會消失。使用接棒或斷尾傳遞替身時，替身的HP不變。替身存在時對手的攻擊招式的傷害大都只能傷害替身，並防止本體免受其他寶可夢造成的異常狀態和狀態變化。聲音的招式以及穿透特性的寶可夢使用的招式可以無視替身。天氣和替身存在前的異常狀態、狀態變化正常影響本體。連續招式打破替身後可以繼續攻擊。如果在本體在陷入無法逃走狀態時制造了替身，無法逃走狀態將立即結束。如果使用者HP不足或已經擁有替身，使用失敗。";
            if (value.length > 260) continue;
            if (node.parentNode.tagName == "STRONG" || node.parentNode.getAttribute("class") == "col movenamecol" ||
                node.parentNode.parentNode.getAttribute("class") == "col movenamecol" || node.parentNode.getAttribute("name") == "chooseMove") {
                if (node.nodeValue == "Metronome") {
                    node.nodeValue = "揮指";
                    continue;
                } else if (node.nodeValue == "Refresh") {
                    node.nodeValue = "煥然一新";
                    continue;
                } else if (node.nodeValue == "Disable") {
                    node.nodeValue = "定身法";
                    continue;
                } else if (node.nodeValue == "Psychic") {
                    node.nodeValue = "精神強念";
                    continue;
                }
            }
            if (value.lastIndexOf('!') == 0) {
                value = value.replace('!', "！");
                node.nodeValue = value;
            }
            if (value.indexOf('•') == 0) {
                value = value.replace('•', "").replace('Metronome', "揮指").replace('Refresh', "煥然一新").replace('Disable', "定身法").replace('Psychic', "精神強念");
                value = translate(value);
                node.nodeValue = "• " + value + " ";
            } else {
                node.nodeValue = translate(node.nodeValue.replace("é", "e"));
            }
            //node=elTW.previousNode();
            //QQ(t).remove();
        }
    }
}

(function () {


    'use strict';
    if (document.getElementById('room-'))
        translateElement(document.getElementById('room-'));
    QQ(document).on('DOMNodeInserted', function (e) {
        translateElement(e.target);
    });


    // Your code here...
})();
