// ==UserScript==
// @name         PSChina Server Translation SV TEST
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      1.7.9
// @author       AL
// @description  PSChina Server Translation朱紫蓝之圆盘汉化脚本测试版
// @match        *://china.psim.us/*
// @match        *://replay.pokemonshowdown.com/*
// @match        *://play.pokemonshowdown.com/*
// @match        *://dex.pokemonshowdown.com/*
// @match        *://smogtours.psim.us/*
// @match        *://psc.sciroccogti.top/*
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @run-at       document-end

// @downloadURL https://update.greasyfork.org/scripts/502050/PSChina%20Server%20Translation%20SV%20TEST.user.js
// @updateURL https://update.greasyfork.org/scripts/502050/PSChina%20Server%20Translation%20SV%20TEST.meta.js
// ==/UserScript==
var translations = {
    /// 系统

    "Connecting...": "连接中...",
    "Searching...": "搜索中...",
    "Loading...": "加载中...",
    "Work offline": "离线模式",
    "Disconnected": "已断开连接",
    "Reconnect": "重新连接",
    "Couldn't connect to server!": "无法连接服务器!",
    "Retry": "重试",
    "Retry with HTTP": "以HTTP方式重试",
    "Page": "页面",
    "Choose name": "输入用户名",
    "You can't register more than two usernames every two hours. Try again later.": "您每两小时注册的用户数不能超过两个，请稍后再试。",
    "Username:": "用户名：",
    "Cancel": "取消",
    "(color)": "（颜色）",
    "Challenge": "挑战",
    "Ignore": "忽略",
    "Unignore": "取消忽略",
    "Report": "举报",
    "Accept": "接受",
    "Reject": "拒绝",
    "Back": "返回",
    "Pokedex": "图鉴",
    "I'm Feeling Lucky": "我是幸运女神",
    "Replays": "回放",
    "Rules": "规则",
    "Credits": "贡献",
    "Forum": "论坛",
    "Privacy policy": "隐私政策",

    "You are locked due to your proxy / VPN and can only private message members of the global moderation team.": "由于您的代理/VPN，您被锁定，只能向全服管理员团队发送私聊信息。",
    "Get help with this": "点击这里获取帮助",
    "Help me with a lock from a proxy": "帮我从代理处解锁",
    "Damage Calculator": "伤害计算器",
    "Pokemon Showdown! damage calculator. (Courtesy of Honko, Austin, dhelmise, & jetou)": "Pokemon Showdown! 伤害计算器。（由Honko, Austin, dhelmise, jetou提供）（银正在想办法汉化这里...）",
    "Suspect tests currently running:": "正在进行的投票测试：",
    "Due to spam from your internet provider, you can't speak except to staff. Logging into an account you've used a lot in the past will allow you to chat.": "由于您的网络提供商垃圾邮件的原因，除了管理人员之外，您不能发言。登录您经常使用的账号将会允许您发言。",
    "You have been disconnected – possibly because the server was restarted.": "您已断开连接-可能是因为服务器已重启。",
    "The server is restarting soon.": "服务器即将重新启动。",
    "Please finish your battles quickly. No new battles can be started until the server resets in a few minutes.": "请尽快结束对战！在服务器几分钟重启之前，无法开始任何新的对战。",
    "The server needs to restart because of a crash.": "服务器由于崩溃需要重新启动。",
    "No new battles can be started until the server is done restarting.": "在服务器重新启动之前，无法开始新的战斗。",
    "We fixed the crash without restarting the server!": "我们在没有重新启动服务器的情况下修复了崩溃！",
    "The server restart was canceled.": "服务器取消了重启。",
    "That user is unregistered and cannot be PMed.": "该用户未注册，无法发送私聊信息。",
    "This command does not support specifying a reason.": "此指令不支持输入原因。",
    "Mute sounds": "全部静音",
    "Effect volume:": "宝可梦叫声音量：",
    "Music volume:": "背景音乐音量：",
    "Notification volume:": "通知提醒音量",
    "You can't change name in the middle of these games:": "您目前在对战中无法更改用户名：",
    "Forfeit and change name": "投降并更改用户名",
    "Please answer the anti-spam question given.": "请输入验证码。",

    //  权限等级

    "Player (☆)": "玩家 (☆)",
    "Bot (*)": "机器人 (*)",
    "Room Owner (#)": "房主 (#)",
    "Administrator (&)": "总管 (&)",
    "Moderator (@)": "管理员 (@)",
    "Driver (%)": "见习管理员 (%)",
    "Voice (+)": "信任用户 (+)",
    "Section Leader": "部门负责人",

    "Global Bot (*)": "全服机器人 (*)",
    "Global Administrator (&)": "全服总管 (&)",
    "Global Administrator (~)": "全服总管 (~)",
    "Global Moderator (@)": "全服管理员 (@)",
    "Global Driver (%)": "全服见习管理员 (%)",
    "Global Voice (+)": "全服信任用户 (+)",
    "Global Champion (♚)": "全服冠军 (♚)",
    "Locked (‽)": "锁定 (‽)",
    "Muted (!)": "禁言 (!)",

    //  新闻


    //  主页

    "Special Event": "特别活动",
    "Usernames must contain at least one letter.": "用户名必须至少包含一个字母。",
    "Your username must contain at least one letter.": "您的用户名至少需要包含一个字母。",
    "Home": "主页",
    "Format:": "分级：",
    "Team:": "队伍：",
    "Don't allow spectators": "禁止观众进入",
    "Battle!": "战斗！",
    "Find a random opponent": "随机寻找一位对手",
    "Teambuilder": "队伍编辑器",
    "Ladder": "排行榜",
    "Watch a battle": "观看对战",
    "Find a user": "查找用户",
    "Games:":"游戏：",
    "Add game": "新对战",
    "News": "新闻",
    "Your team is valid for this tournament.": "您的队伍在本次锦标赛中合法。",
    "You challenged less than 10 seconds after your last challenge! It's cancelled in case it's a misclick.": "您在上次挑战后10秒内进行了挑战！以防出错，这次挑战被取消了。",
    "Challenge cancelled because they changed their username.": "挑战取消，因为他更改了用户名。",
    "Your searches and challenges have been cancelled because you changed your username.": "您的搜索和挑战已被取消，因为您更改了用户名。",
    "You are disconnected and cannot chat.": "您已断开连接，无法聊天。",
    "This server is requesting an invalid login key.This probably means that either you are notconnected to a server, or the server is set upincorrectly.": "服务器登录密钥请求无效。您没有连接到服务器，或者服务器设置错误。",
    "The server is restarting. Battles will be available again in a few minutes.": "服务器正在重新启动,几分钟后才能开始对局。",
    "You have been logged out and disconnected.": "您已经登出并且断开了连接",
    "You can't battle yourself. The best you can do is open PS in Private Browsing (or another browser) and log into a different username, and battle that username.": "您无法与自己对战。您可以在无痕浏览中（或其他浏览器）打开PS登录其他账号，然后与该账号进行对战。",
    "(Others will be able to see your name change. To change name privately, use \"Log out\")": "其他人可以看到您更改了用户名。想要私下的更改用户名，请使用'登出'按钮",
    "If you wanted to change your name while staying connected, use the 'Change Name' button or the '/nick' command.": "如果您想要在保持连接的情况下更改用户名，点击‘更改用户名’按钮或者使用/nick指令。",
    "The name you chose is registered.": "您选择的用户名已经被注册了。",
    "You have been successfully registered.": "您已成功注册。",
    "If this is your account:": "如果这是您的账号：",
    "If this is someone else's account:": "如果这是其他人的账号：",
    "Choose another name": "选择另一个用户名",
    "Chat self": "私聊自己",
    "Avatar changed to:": "头像更换为：",
    "Status updated!": "状态已更新！",
    "OK": "确认",
    "Yes": "是",
    "No": "否",
    "Sort:": "排序方式:",
    "Log in": "登录",
    "Username": "用户名",
    "Open": "查找",
    "Battle": "对战",
    "Battles:": "对战：",
    "Battles": "观战",
    "(All formats)": "（全部分级）",
    "(Busy)": "（忙碌）",
    "(Offline)": "（离线）",
    "(Idle)": "（闲置）",
    "Copied!": "已复制！",
    "You can only save replays for battles.": "您只能保存战斗的回放。",
    "Light": "亮",
    "Match system theme": "匹配系统主题",
    "Instant replay": " 即时回放",
    "Download replay": " 下载回放",
    "Switch sides": " 切换视角",
    "Upload and share replay": " 上传并分享回放",
    "Register": "注册",
    "Register your account:": "注册您的账号：",
    "Password:": "密码：",
    "Password (confirm):": "确认密码：",
    "What is this pokemon?": "这是哪只宝可梦? （输入pikachu）",
    "Cancel": "取消",
    "1 user": "1位用户",
    "None": "无",
    "Search": "搜索",
    "Random team": "随机队伍",
    "Access denied: You must be logged in as a username you're searching for.": "访问被拒绝：您必须以您正在搜索的用户名登录。",
    "You are offline.": "您处于离线状态。",
    "You have no teams": "您没有队伍。",
    "Because moderated chat is set, you must be of rank Voice or higher to speak in this room.": "因为设置了聊天限制，所以您必须是Voice级别或更高级别才能在这个房间里发言。",
    "You need to go into the Teambuilder and build a team for this format.": "您需要在队伍编辑器中为这个分级添加一个队伍。",
    "Please select a team.": "请选择一个队伍。",
    "No formats found": "没有找到该分级",
    "You can't change name in the middle of these games:": "您不能在以下比赛中更改用户名：",
    "Forfeit and change name": "弃权并更改用户名",
    "Your username must be less than 19 characters long.": "您的用户名长度不能超过18个字符。",
    "You are already challenging someone. Cancel that challenge before challenging someone else.": "您正在挑战某人。取消该挑战才能挑战其他人。",
    //  排行榜
    "Seasons": "赛季",
    "Season results for": "赛季结果",
    "View past seasons": "查看过去的赛季",
    "Season rankings": "赛季排名",
    "Season Records": "赛季记录",
    "Season 2": "第二赛季",
    "Season 1": "第一赛季",

    "See a user's ranking with": "查看指定用户的排名",
    "User lookup": "查找用户",
    "(btw if you couldn't tell the ladder screens aren't done yet; they'll look nicer than this once I'm done.)": "（顺便说一下，排行榜页面还没有完成；一旦我完成了看起来会更好。）银：두뮤不是哥们，你从去年就开始这么说了。",
    "How the ladder works": "排行榜的工作原理",

    //  分级列表
    "S/V Singles": "朱/紫 单打分级",
    "S/V Doubles": "朱/紫 双打分级",
    "Pet Mods": "宠物模式",
    "Other Metagames": "其他分级",
    "OM of the Month": "本月的其他分级",
    "Challengeable OMs": "具有挑战性的其他分级",
    "Retro Other Metagames": "前代的其他分级",
    "Randomized Format Spotlight": "特别的前代随机分级",
    "Randomized Metas": "随机分级",
    "RoA Spotlight": "特别的前代分级",
    "Past Gens OU": "过去的OU单打分级",
    "Past Gens Doubles OU": "过去的OU双打分级",
    "Sw/Sh Singles": "剑/盾 单打分级",
    "Sw/Sh Doubles": "剑/盾 双打分级",
    "US/UM Singles": "日/月 单打分级",
    "US/UM Doubles": "日/月 双打分级",
    "OR/AS Singles": "ΩR红宝石/αS蓝宝石 单打分级",
    "OR/AS Doubles/Triples": "ΩR红宝石/αS蓝宝石 双打/三打分级",
    "B2/W2 Singles": "黑2/白2 单打分级",
    "B2/W2 Doubles": "黑2/白2 双打分级",
    "DPP Singles": "钻石/珍珠 单打分级",
    "DPP Doubles": "钻石/珍珠 双打分级",
    "Past Generations": "过去的分级",
    "PSChina Special": "PSChina特殊分级",
    "Unofficial Metagames": "非官方分级",
    "National Dex Other Tiers": "全国图鉴其他分级",

    //  大厅
    "Lobby": "大厅",

    //  锦标赛
    "Tournaments": "锦标赛",
    "Welcome!": "欢迎！",
    "Smogon runs official tournaments across their metagames where the strongest and most experienced competitors duke it out for prizes and recognition!": "Smogon在游戏分级模式中举办的官方锦标赛，最强大和最老练的玩家会在这争夺奖品和荣誉！",
    "You can see a listing of current official tournaments here; by clicking any hyperlink, you will be directed to the forum for any given tournament!": "您可以在此处查看当前官方比赛的列表； 通过点击链接，将您引导到指定锦标赛的帖子！",
    "Be sure to sign up if you are eager to participate or check it out if you want to spectate the most hyped games out there.": "如果您想要参加，一定要报名，如果您想观看最精彩的比赛，一定要去看看。",
    "For information on tournament rules and etiquette, check out": "有关比赛规则和礼仪的信息，请查看该",
    "this information thread": "帖子",
    "Smogon Officials": "Smogon官方",
    "Open Sign-Ups": "点击报名",
    "Tournaments run by Smogon staff.": "由Smogon管理员举办的比赛。",
    "Tournaments run by Smogon staff and regular users alike.": "由Smogon管理员和普通用户举办的比赛。",
    "Tournaments run by the rooms of Pokemon Showdown.": "由Pokemon Showdown聊天室举办的比赛。",
    "The tournament was forcibly ended.": "锦标赛被强制结束了。",
    "In Progress": "进行中",
    "Challenging": "挑战中",
    "Signups": "报名中",
    "Only guests": "仅有游客",
    "Toggle": "展开",
    "Pop-out": "打开",
    "In-progress": "进行中",
    "Unavailable": "未开始",
    "Ready!": "准备就绪！",
    "Place": "排名",
    "Points": "积分",
    "Trainer Profile": "训练家简介",
    "Join": "加入",
    "Leave": "离开",
    "Forcetimer is now on for the tournament.": "锦标赛的强制计时现已开启。",
    "Forcetimer is now off for the tournament.": "锦标赛的强制计时现已开启。",
    "Tournament battles forced public: ON": "锦标赛对战强制公开：开启",
    "Tournament battles forced public: OFF": "锦标赛对战强制公开：关闭",
    "Scouting is now banned (Tournament players can't watch other tournament battles)": "侦察功能现已禁用（锦标赛参赛选手无法观看其他选手的锦标赛对战）",
    "Modjoining is now banned (Players cannot modjoin their tournament battles).": "修改对战加入权限功能现已禁用（选手无法修改锦标赛对战的加入权限）。",

    //  帮助
    "Help": "帮助",

    //  官方天梯锦标赛
    "Official Ladder Tournament": "官方天梯锦标赛",

    //  队伍编辑器

    "Use a different nature to get higher stats:": "使用这种性格可以获得更多基础点数:",
    "Box sets:": "箱子配置:",
    "Galarian Slowpoke": "伽勒尔呆呆兽",
    "Galarian Slowbro": "伽勒尔呆壳兽",
    "Galarian Slowking": "伽勒尔呆呆王",
    "and": " 和 ",
    "You can also set natures by typing": "您可以在基础点数框内输入",
    "next to a stat.": "来设定性格。",
    "Backup/Restore all teams": "备份/还原所有队伍",
    "Backup all teams from this folder": "备份该文件夹里的所有队伍",
    "View teams uploaded to server": "查看已上传到服务器的队伍",
    "Clearing your cookies (specifically,": "清除您的cookie（准确的说，是",
    ") will delete your teams.": ") 将清空您的队伍。",
    "If you want to clear your cookies or": "如果您想清除cookie或",
    ", you can use the Backup/Restore feature to save your teams as text first.": "，可以使用备份/还原功能先将您的队伍保存为文本。",
    "Restore teams from backup": " 使用备份功能还原队伍",
    "No exact match found. The closest matches alphabetically are:": "未找到完全匹配项。按字母顺序最接近的匹配项是：",
    "(all)": "(全部)",
    "(uncategorized)": "(未分类)",
    "(add format folder)": "添加分级文件夹",
    "Folders": "文件夹",
    "(add folder)": "(添加文件夹)",
    "Did you have a good day?": "您今天过的怎样?",
    "Yes, my day was pretty good": "我今天过得很好",
    "No, it wasn't great": "不是很好",
    "Aww, that's too bad. :( I hope playing on Pokemon Showdown today can help cheer you up!": "啊，太糟糕了 :( 我希望今天的PS战斗能帮您振作起来！",
    "All teams": "所有队伍",
    "New Team": "新的队伍",
    "New Box": "新的箱子",
    "Undo Delete": "撤销",
    "Delete": "删除",
    "Situational Abilities": "偶尔有用",
    "Unviable Abilities": "完全无用",
    "Special Event Ability": "特殊特性",
    "Hidden Ability": "隐藏特性",
    "Abilities": "特性",
    "Will be": "超级进化之后，特性会变为",
    "after Mega Evolving.": "。",
    "Nickname": "昵称",
    "Item": "道具",
    "Ability": "特性",
    "Dmax Level": "极巨等级",
    "Dmax Level:": "极巨等级：",
    "Level": "等级",
    "Gmax": "超极巨化",
    "HP Type": "觉醒属性",
    "Gender": "性别",
    "Happiness": "亲密度",
    "Shiny": "闪光",
    "Level:": "等级：",
    "Gigantamax:": "超极巨化：",
    "Terastal Type:": "太晶属性：",
    "Gender:": "性别：",
    "Happiness:": "亲密度：",
    "Shiny:": "闪光：",
    "Moves": "招式",
    "Copy": "复制",
    "Import/Export": "导入/导出",
    "Move": "移动",
    "Validate": "确认是否合法",
    "Add Pokemon": "添加宝可梦",
    "Male": "雄性",
    "Female": "雌性",
    "Genderless": "无性别",
    "Format List": "分级列表",
    "List": "列表",
    "Edit": "编辑",
    "Save": "保存",
    "Switch": "交换",
    "Details": "细节",
    "Stats": "能力",
    "EVs": "基础点数",
    "EV": "点数",
    "IVs": "个体值",
    "DVs": "个体值",
    "Guessed spread:": "分配推测：",
    "IV spreads": "个体值分配",
    "Remaining:": "剩余点数：",
    "Sample sets:": "推荐配置:",
    "Base": "种族值",
    "you have no pokemon lol": "您的队伍里还没有宝可梦",
    "Import from text": "从文本导入",
    "Select a format": "选择一个分级",
    "Import": "导入",
    "empty team": "空空如也",
    "Import from text or URL": "从text或URL导入",
    "Upload to PokePaste (Open Team Sheet)": "上传到PokePast (公开队伍配置)",
    "Upload to PokePaste": "上传到PokePast",
    "Protip:": "提示：",
    "Nature:": "性格：",
    "Power": "威力",
    "Hidden Power:": "觉醒力量：",
    "Tera Type:": "太晶属性：",
    "Tera Type": "太晶属性",
    "Select a team": "选择队伍",
    "Show all teams": "显示所有队伍",
    "Add a Pokemon to your team before uploading it!": "上传之前先将宝可梦添加到您的队伍中！",
    "You need at least one Pokemon to validate.": "您需要至少一个宝可梦来确认是否合法。",
    "Clear clipboard": "清除剪贴板",
    "No move": "没有招式",
    "Clipboard:": "剪贴板：",
    "Other teams":"其他队伍",
    "Upload to Showdown database (saves across devices)":"上传到Showdown数据库（跨设备保存)",
    "Browsers sometimes randomly clear cookies - you should upload your teams to the Showdown database or make a backup yourself if you want to make sure you don't lose them.": "浏览器有时会随机清除cookie - 如果您想确保不会丢失队伍，您应该将队伍上传到Showdown数据库，或者自己备份。",
    "(Private:":"(私人的：",
    "(No Folder)": "（无文件夹）",
    "Group by folders": "按文件夹分组",
    "Change sprite": "更改形态",
    "Create folder": "创建文件夹",
    "Folder name:": "文件夹名称",
    "Illegal": "不合法",
    "Pick a variant or": "选择形态 ",
    "HP": "HP",
    "Attack":"攻击",
    "Defense": "防御",
    "SpA":"特攻",
    "SpD":"特防",
    "Sp. Atk": "特攻",
    "Sp. Def": "特防",
    "Sp. Atk.": "特攻",
    "Sp. Def.": "特防",
    "Speed": "速度",
    "BST": "总和",
    "Name": "名称",
    "Type": "属性",
    "Cat": "分类",
    "Pow": "威力",
    "Acc": "命中",
    "Types": "属性",
    "Physical": "物理",
    "Special": "特殊",
    "Status": "变化",
    "Filters:": "过滤: ",
    "(backspace = delete filter)": "(Backspace = 清除过滤)",
    "Illegal results": "不合法的",
    "Usually useless moves": "多数情况无用的招式",
    "Sketched moves": "通过写生获得的招式",
    "Useless sketched moves": "无用的写生招式",
    "Moves": "招式",
    "Paste!": " 粘贴！",
    "No item": "没有道具",
    "Number": "默认",
    "Unreleased": "未发布的",
    "Hp": "HP",
    "Atk": "攻击",
    "Def": "防御",
    "Spa": "特攻",
    "SpA": "特攻",
    "Spd": "特防",
    "SpD": "特防",
    "Spc": "特殊",
    "Spe": "速度",
    "Evasion": "闪避率",
    "evasiveness": "闪避率",
    "accuracy": "命中率",
    "Teambuilding resources for this tier:": "该分级的组队资料：",
    "Find more helpful resources for this tier on": "查找更多有关该分级的资料： ",
    "Find helpful resources for this tier on": "查找有关该分级的资料： ",

    "Does not evolve": "不进化",
    "Total:": "总和：",
    "Evolution:": "进化：",
    "Base stats:": "基础点数：",
    "Attack:": "攻击：",
    "Defense:": "防御：",
    "Sp. Atk:": "特攻：",
    "Sp. Def:": "特防：",
    "Egg groups:": "蛋群：",
    "Gender ratio:": "性别比例：",
    "Size:": "身高，体重：",
    "Accuracy:": "命中率：",
    "Level-up": "等级提升",
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
    "Types:": "属性：",
    "Type:": "属性：",

    "Tera": "太晶化",
    "Weather": "天气",
    "Terrain": "场地",
    "Stage": "能力阶级",
    "Screens": "墙",
    "Set": "配置",
    "DMG": "伤害",
    "Crit": "击中要害",
    "Aurora": "极光幕",

    "Bug-type moves": "虫属性招式",
    "Dark-type moves": "恶属性招式",
    "Dragon-type moves": "龙属性招式",
    "Electric-type moves": "电属性招式",
    "Fighting-type moves": "格斗属性招式",
    "Fire-type moves": "火属性招式",
    "Flying-type moves": "飞行属性招式",
    "Fairy-type moves": "妖精属性招式",
    "Ghost-type moves": "幽灵属性招式",
    "Grass-type moves": "草属性招式",
    "Ground-type moves": "地面属性招式",
    "Ice-type moves": "冰属性招式",
    "Normal-type moves": "一般属性招式",
    "Poison-type moves": "毒属性招式",
    "Rock-type moves": "岩石属性招式",
    "Steel-type moves": "钢属性招式",
    "Water-type moves": "水属性招式",

    "(automatic type)": "(自动属性)",
    "Bug": "虫",
    "Dark": "恶",
    "Dragon": "龙",
    "Electric": "电",
    "Fighting": "格斗",
    "Fire": "火",
    "Flying": "飞行",
    "Fairy": "妖精",
    "Ghost": "幽灵",
    "Grass": "草",
    "Ground": "地面",
    "Ice": "冰",
    "Normal": "一般",
    "Poison": "毒",
    "Rock": "岩石",
    "Steel": "钢",
    "Water": "水",
    "Stellar": "星晶",

    "Fast Bulky Support": "高速耐久辅助",
    "Fast Specs": "高速眼镜",
    "Fast Band": "高速头带",
    "Bulky Specs": "耐久眼镜",
    "Bulky Band": "耐久头带",
    "Bulky Scarf": "耐久围巾",
    "Physical Scarf": "物攻围巾",
    "Special Scarf": "特攻围巾",
    "Physical Biased Mixed Scarf": "主物攻双刀围巾",
    "Special Biased Mixed Scarf": "主特攻双刀围巾",
    "Physically Defensive": "物理防御盾牌",
    "Specially Defensive": "特殊防御盾牌",
    "Fast Physical Sweeper": "高速物攻炮台",
    "Fast Special Sweeper": "高速特攻炮台",
    "Bulky Physical Sweeper": "耐久物攻炮台",
    "Bulky Special Sweeper": "耐久特攻炮台",

    "Nature": "性格",
    "Adamant (+Atk, -SpA)": "固执 (+攻击, -特攻)",
    "Bashful": "害羞",
    "Bold (+Def, -Atk)": "大胆 (+防御, -攻击)",
    "Brave (+Atk, -Spe)": "勇敢 (+攻击, -速度)",
    "Calm (+SpD, -Atk)": "温和 (+特防, -攻击)",
    "Careful (+SpD, -SpA)": "慎重 (+特防, -特攻)",
    "Docile": "坦率",
    "Gentle (+SpD, -Def)": "温顺 (+特防, -防御)",
    "Hardy": "勤奋",
    "Hasty (+Spe, -Def)": "急躁 (+速度, -防御)",
    "Impish (+Def, -SpA)": "淘气 (+防御, -特攻)",
    "Jolly (+Spe, -SpA)": "爽朗 (+速度, -特攻)",
    "Lax (+Def, -SpD)": "乐天 (+防御, -特防)",
    "Lonely (+Atk, -Def)": "怕寂寞 (+攻击, -防御)",
    "Mild (+SpA, -Def)": "慢吞吞 (+特攻, -防御)",
    "Modest (+SpA, -Atk)": "内敛 (+特攻, -攻击)",
    "Naive (+Spe, -SpD)": "天真 (+速度, -特防)",
    "Naughty (+Atk, -SpD)": "顽皮 (+攻击, -特防)",
    "Quiet (+SpA, -Spe)": "冷静 (+特攻, -速度)",
    "Quirky": "浮躁",
    "Rash (+SpA, -SpD)": "马虎 (+特攻, -特防)",
    "Relaxed (+Def, -Spe)": "悠闲 (+防御, -速度)",
    "Sassy (+SpD, -Spe)": "自大 (+特防, -速度)",
    "Serious": "认真",
    "Timid (+Spe, -Atk)": "胆小 (+速度, -攻击)",

    "Adamant": "固执 (+攻击, -特攻)",
    "Bold": "大胆 (+防御, -攻击)",
    "Brave": "勇敢 (+攻击, -速度)",
    "Calm": "温和 (+特防, -攻击)",
    "Careful": "慎重 (+特防, -特攻)",
    "Gentle": "温顺 (+特防, -防御)",
    "Hasty": "急躁 (+速度, -防御)",
    "Impish": "淘气 (+防御, -特攻)",
    "Jolly": "爽朗 (+速度, -特攻)",
    "Lax": "乐天 (+防御, -特防)",
    "Lonely": "怕寂寞 (+攻击, -防御)",
    "Mild": "慢吞吞 (+特攻, -防御)",
    "Modest": "内敛 (+特攻, -攻击)",
    "Naive": "天真 (+速度, -特防)",
    "Naughty": "顽皮 (+攻击, -特防)",
    "Quiet": "冷静 (+特攻, -速度)",
    "Rash": "马虎 (+特攻, -特防)",
    "Relaxed": "悠闲 (+防御, -速度)",
    "Sassy": "自大 (+特防, -速度)",
    "Timid": "胆小 (+速度, -攻击)",

    //  设置

    "Change avatar": "更换头像",
    "You can": "您可以点击",
    "change your avatar": "更改您的头像",
    "by clicking on it in the": "或者在",
    "menu in the upper right.": "中更改您的头像。",
    "Avatars from generations other than 4-5 are hidden. You can find them in this": "除了4-5代以外，其他几代的头像都是隐藏的。您可以在",
    "full list of avatars": "完整的头像列表",
    ". You can use them by typing": "找到，另外您可以在聊天室里输入指令",
    "[avatar's name]": "头像昵称",
    "into any chat. For example,": "来使用它们。例如：",
    "Custom avatars require you to be a contributor/staff or win a tournament prize.": "专属头像需要您成为贡献者/管理员，或者在锦标赛赢得。",
    "Custom avatars from account": "您可用的专属头像",
    "Unrecognized avatar - make sure you're on the right account?": "无法识别到头像-您的账号是否正确？",
    "Avatar changed to:": "头像更改为：",
    "Choose an avatar or": "选择一个头像 ",
    "Wrong password.": "密码错误。",
    "Change your password:":"更改您的密码：" ,
    "Old password:": "旧密码：",
    "New password:": "新密码：",
    "New password (confirm):": "新密码（再输入一次）",
    "Change password": "更改密码",
    "Password change": "更改密码",
    "Your old password was incorrect.": "您的旧密码不正确。",
    "Your new passwords do not match.": "您的新密码不匹配。",
    "Your passwords do not match.": "您的密码不匹配。",
    "Your password was successfully changed.": "您的密码已成功更改。",
    "Your username is no longer available.": "您选择的用户名不可用。",
    "Graphics": "界面：",
    "Layout:": "布局：",
    "◫ Left and right panels": "◫ 双面板",
    "◻ Single panel": "◻ 单面板",
    "Background:": "背景：",
    "Default": "默认",
    "Official": "官方",
    "Random": "随机",
    "Custom": "自定义",
    "Drag and drop an image to PS (the background settings don't need to be open), or upload:": "将图像拖放到PS（背景设置不需要打开），或上传",
    "Done": "完成",
    "Dark mode": "夜间模式",
    "Change background": "更改背景",
    "Disable animations": "禁止战斗动画",
    "Use BW sprites instead of XY models": "使用黑/白系列的宝可梦建模替代X/Y建模",
    "Use 2D sprites instead of 3D models": "使用2D宝可梦建模替代3D建模",
    "Use modern sprites for past generations": "在旧世代对战中使用最新的宝可梦建模",
    "Chat": "聊天",
    "Chatrooms:": "聊天室：",
    "Private rooms:": "隐藏房间：",
    "Ignore tournaments": "忽略淘汰赛（信息）",
    "Block PMs": "屏蔽私聊信息",
    "Block Challenges": "屏蔽挑战",
    "Show PMs in chat rooms": "在聊天室显示私聊信息",
    "Highlight when your name is said in chat": "当您的名字出现在聊天窗口时，名字颜色会高亮",
    "Notifications disappear automatically": "通知自动消失",
    "Confirm before leaving a room": "离开房间前确认",
    "Confirm before refreshing": "刷新前确认",
    "Theme:": "主题：",
    "Avatar...": "更换头像...",
    "Status...": "更改状态...",
    "Password...": "更改密码...",
    "Prompt on refresh": "刷新页面时弹出提醒窗口",
    "Language:": "语言：",
    "Timestamps in chat rooms:": "聊天室中的时间显示：",
    "Music Off": "关闭音乐",
    "On": "开启",
    "Off": "不开启",
    "Tournaments:": "房间比赛信息：",
    "Notifications": "接收消息",
    "No Notifications": "不接收消息",
    "Timestamps in PMs:": "私聊中的时间显示：",
    "Chat preferences:": "聊天偏好：",
    "Text formatting": "文本格式",
    "Usable formatting:":"可用格式：",
    "Edit formatting": "改变格式",
    "You can choose to display formatted text as normal text": "您可以选择显示文字的布局为普通布局",
    "Change name": "更改用户名",
    "Log out": "登出",
    "Effect volume:": "宝可梦叫声音量：",
    "Music volume:": "背景音乐音量：",
    "Notification volume:": "通知提醒音量：",



    //  聊天

    "Scouting is banned: tournament players can't watch other tournament battles.":"禁止观战：参赛选手不能观看比赛。",
    "Minimum Elo:": "最低Elo限制：",
    "Show more rooms": "显示更多房间",
    "Hide more rooms": "隐藏更多房间",
    "Hidden rooms": "隐藏的房间",
    "Room name:": "房间名：",
    "Join other room": "加入其他房间",
    "Join room": "加入房间",
    "Join chat": "加入聊天室",
    "Join lobby chat": "加入大厅聊天室",
    "users online": "在线用户",
    "active battle": "正在对战",
    "active battles": "正在对战",
    "Official chat rooms": "官方聊天室",
    "PSPL Winner":"PSPL获胜者",
    "Chat rooms": "聊天室",
    "Subrooms:": "子房间：",
    "All rooms": "全部房间",
    "Battle formats": "战斗分级",
    "Languages": "语言",
    "Entertainment": "游戏娱乐",
    "Gaming": "电子游戏",
    "Life & hobbies": "生活与爱好",
    "On-site games": "在线游戏",
    "Hide": "隐藏",
    "In Progress": "进行中",
    "Challenging": "挑战中",
    "Signups": "报名中",
    "Only guests": "仅有游客",
    "Toggle": "展开",
    "Pop-out": "打开",
    "In-progress": "进行中",
    "Unavailable": "未开始",
    "Ready!": "准备就绪！",
    "Join": "加入",
    "Leave": "离开",
    "Rooms filter:": "房间筛选：",
    "You must be registered to chat in temporary rooms (like battles).": "注册后才能在战斗房间聊天。",
    "You may register in the": "您可以在 ",
    "Options": "选项",
    "menu.": " 菜单中注册。",
    "You must be autoconfirmed to use offine messaging.": "您必须经过自动确认后才能发送离线消息。",
    "That user is unregistered and cannot be PMed.": "该用户未注册，无法进行私聊。",
    "Ladder isn't responding, score probably updated but might not have (Request timeout).": "排行榜没有响应，分数可能已更新，也可能没有(请求超时)。",
    "Are you sure you want to exit this room?": "您确定要退出这个房间吗？",
    "Close room": "关闭房间",

    //  好友

    "You can't friend yourself.": "您不能把自己加为好友。",
    "Your friends:": "您的好友",
    "you have no friends added on Showdown lol": "您没有在Showdown上添加好友",
    "To add a friend, use": "如果要添加好友，请使用",
    "Page unavailable": "页面不可用",
    "Settings": "设置",
    "Sent": "已发送",
    "Received": "待处理",
    "Friends Settings:": "好友设置：",
    "Allow": "允许",
    "Notify me when my friends come online:": "好友上线通知：",
    "Receive friend requests:": "接受好友申请：",
    "Allow others to see your list:": "允许其他人查看您的好友列表：",
    "Allow others to see my login times": "允许其他人查看我的登录时间：",
    "Allow friends to see my hidden battles on the spectator list:": "允许好友在观战列表中看到您隐藏的战斗：",
    "Block challenges except from friends (and staff):": "好友（和管理人员）以外的用户禁止对您发起挑战：",
    "Block PMs except from friends (and staff):": "好友（和管理人员）以外的用户禁止向您发起私聊：",
    "This user is blocking private messages right now.": "此用户现在拒收了私聊消息。",
    "Note: If this request is accepted, your friend will be notified when you come online, and you will be notified when they do, unless you opt out of receiving them.": "注意：如果接受了该请求，您的好友将在您上线时收到通知，他们上线时也会通知您，除非您选择了不接收。",
    "Deny": "拒绝",
    "Disable": "不开启",
    "Enable": "开启",
    "(You can also stop this user from sending you friend requests with": "（您可以使用这个指令禁止该用户向您发送好友请求",
    "sent you a friend request!": "向您发送了好友请求！",
    "You must be autoconfirmed to use the friends feature.": "您必须经过自动确认才能使用好友功能。",
    "Undo": "撤销",
    "You have no outgoing friend requests pending.": "您没有需要处理的好友请求。",
    "You have no friends to spectate.": "您没有可观战的好友。",
    " to allow your friends to see your hidden battles on this page.": " 可以让好友观看您隐藏的对战。",
    "Spectate your friends:": "观战您的好友：",
    "Spectating": "观战",
    "Spectate": "观战",
    "All Friends": "全部好友",
    "Add friend:": "添加好友：",
    "Add friend": "添加好友",
    "Remove friend": "删除好友",
    "Friend removed.": "好友已删除。",
    "Friend request sent!": "好友请求已发送！",
    "You are already not receiving friend notifications.": "您尚未收到好友通知。",
    "You are now blocking private messages, except from staff.":"您正在屏蔽除了管理员之外的私聊信息。",
    "You are no longer blocking private messages.":"您不再屏蔽私聊信息。",
    "You are now blocking all incoming challenge requests.":"您正在屏蔽所有挑战请求。",
    "You are now blocking challenges, except from staff and friended users.":"您正在拒收挑战，来自管理人员和好友的挑战除外。",
    "You are available for challenges from now on.":"您不再屏蔽挑战请求。",
    "You are now blocking private messages, except from staff and friends.": "您正在屏蔽私人消息，来自管理人员和好友的消息除外。",
    "You are now allowing your friends to see your ongoing battles.": "您现在允许您的好友看到您正在进行的战斗。",
    "You are now hiding your ongoing battles from your friends.": "您现在对好友隐藏您正在进行的战斗。",
    "You are now allowing your friends to see your login times.": "您现在允许您的好友查看您的登录时间。",
    "You are now hiding your login times from your friends.": "您现在向好友隐藏您的登录时间。",
    "You are now allowing other people to view your friends list.": "您现在允许其他人查看您的好友列表。",
    "You are now hiding your friends list.": "您现在隐藏了您的好友列表。",
    "You are now allowing friend requests.": "您现在允许好友请求。",
    "You are now blocking incoming friend requests.": "您现在拒收好友请求。",
    "You will not receive friend notifications.": "您将不会收到好友通知。",
    "You will now receive friend notifications.": "您现在将收到好友通知。",
    "You have no pending friend requests.": "您没有待处理的好友请求。",
    "You must be registered to send private messages.": "您必须注册才能发送私人消息。",
    "Friends": "好友",
    "Add": "添加",

    "/friend OR /friends OR /friendslist:": "/friend 或 /friends 或 /friendslist：",
    "- View current friends.": "- 查看所有好友。",
    "/friend add [name]": "/friend add 用户名",
    "OR": "或",
    "/friend [name]": "/friend 用户名",
    "- Send a friend request to [name]": "- 向指定用户发送好友申请",
    "if you don't have them added.": "如果您还没有添加他。",
    "/unfriend [username]": "/unfriend 用户名",
    "/friend remove [username]": "/friend remove 用户名",
    "- Unfriend the user.": "- 与指定用户解除好友关系。",
    "/friend accept [username]": "/friend accept 用户名",
    "- Accepts the friend request from [username]": "- 接受指定用户的好友申请",
    "/friend reject [username]": "/friend reject 用户名",
    "- Rejects the friend request from [username]": "- 拒绝指定用户的好友申请",
    "if it exists.": "如果已申请。",
    "/friend toggle [off/on]": "/friend toggle off或on",
    "- Enable or disable receiving of friend requests.": "- 关闭或开启好友申请。",
    "- Opts out of receiving friend notifications.": "- 不接收好友上线通知。",
    "- Opts into view friend notifications.": "- 接收好友上线通知。",
    "/friend listdisplay [on/off]": "/friend listdisplay on或off",
    "- Opts [in/out] of letting others view your friends list.": "- 选择让或不让他人查看您的好友列表。",
    "- View the given [user]'s friend list": "- 查看指定用户的好友列表",
    "if they're allowing others to see.": "如果他公开了好友列表。",
    "/friends sharebattles [on|off]": "/friends sharebattles on或off",
    "- Allow or disallow your friends from seeing your ongoing battles.": "- 允许或禁止您的好友看到您正在进行的对战。",

    //  上传队伍

    "Search your teams": "搜索您的队伍",
    "Browse public teams": "浏览公开队伍",
    "Upload new": "上传新的队伍",
    "Upload a team": "上传队伍",
    "Search all teams": "搜索所有队伍",
    "Team format:": "队伍分级：",
    "Generation:": "世代：",
    "Pokemon:": "宝可梦：",
    "Abilities:": "特性：",
    "Moves:": "招式：",
    "Search!": "搜索！",
    "Search in team:": "队伍搜索：",
    "Search metadata:": "搜索参数：",
    "(separate different searches with commas)": "(可以用逗号分隔多种搜索)",
    "What's the name of the team?": "队伍叫什么名字？",
    "What's the team's format?": "队伍是哪个分级？",
    "Uploaded by:": "上传者：",
    "Manage": "管理",
    "Make private": "设置为私人的",
    "Team privacy": "私人队伍",
    "Team format": "队伍分级",
    "Team name": "队伍名字",
    "Delete team": "删除队伍",
    "Edit team": "编辑队伍",
    "Make public": "设置为公开的",
    "in chat to share!)": "以分享！）",
    "Team set to public.": "队伍已设置成公开。",
    "View full team": "复制完整队伍",
    "(or copy/paste": "（或在聊天中复制/粘贴",
    "Shareable link to team": "可分享的队伍",
    "Provide the team:": "提供队伍:",
    "Should the team be private? (yes/no)": "队伍是私人的吗?(是/否)",
    "Upload team": "上传队伍",
    "Upload Team": "上传队伍",
    "Team": "队伍",
    "No results found.": "没有找到结果。",
    "Submitted!": "已提交！",
    "Manage (edit/delete/etc)": "管理队伍（编辑/删除/其他）",

    //  举报

    "Request Help": "寻求帮助",
    "Request help from global staff": "向管理人员寻求帮助",
    "What do you want to report someone for?": "您想举报某人的原因？",
    "Someone is harassing me in PMs": "有人在私聊中骚扰我",
    "Someone is harassing me in a battle": "有人在战斗中骚扰我",
    "Someone is using an offensive username": "有人使用令人不适的用户名",
    "Someone is using offensive Pokemon nicknames": "有人使用令人不适的宝可梦昵称",
    "Someone is hacking or cheating in my battle": "有人在我的战斗中进行黑客攻击或作弊",
    "I want to report someone": "我想举报某人",
    "If someone is harassing you in private messages (PMs), click the button below and a global staff member will take a look. If you are being harassed in a chatroom, please ask a room staff member to handle it. If it's a minor issue, consider using": "如果有人在私聊中骚扰您，请单击下面的按钮，管理人员会查看。如果您在聊天室受到骚扰，请让聊天室工作人员处理。如果只是小问题，请考虑使用",
    "instead.": "。",
    "Report harassment in a private message (PM)": "举报：私聊中的骚扰",
    "What's going on?": "发送了什么？",
    "I want to appeal a punishment": "我想对处罚提出上诉",
    "Something else": "其他选项",
    "Abuse of Help requests can result in punishments.": "滥用寻求帮助功能可能会受到惩罚。",
    "Maybe one of these options will be helpful?": "也许其中一个选项会有帮助？",
    "Other": "其他",
    "If someone is harassing you in a battle, click the button below and a global staff member will take a look. If you are being harassed in a chatroom, please ask a room staff member to handle it. If it's a minor issue, consider using": "如果有人在战斗中骚扰您，请单击下面的按钮，管理人员会查看。如果您在聊天室受到骚扰，请让聊天室工作人员处理。如果只是小问题，请考虑使用",
    "Please save a replay of the battle if it has ended, or provide a link to the battle if it is still ongoing.": "如果战斗已经结束，请保存战斗回放，如果战斗仍在进行，请提供战斗链接。",
    "Report harassment in a battle": "举报：战斗中的骚扰",
    "If a user has an inappropriate name, click the button below and a global staff member will take a look.": "如果用户的名字令人不适，请单击下面的按钮，管理人员会查看。",
    "Report an inappropriate username": "举报：令人不适的用户名",
    "If a user has inappropriate Pokemon nicknames, click the button below and a global staff member will take a look.": "如果宝可梦的昵称令人不适，请单击下面的按钮，管理人员会查看。",
    "Report inappropriate Pokemon nicknames": "举报：令人不适的宝可梦昵称",
    "Your opponent cannot control how lucky or unlucky you are, what moves you choose, or the mechanics of the battle. You may just be misunderstanding what happened in your battle!": "您的对手无法控制您的运气、您选择的招式或战斗的机制。您可能只是误解了战斗中发生的事情！",
    "I am punished but do not fall under any of the above.": "我受到了惩罚，但并不属于上述任何一种。",

    //  回放

    "(muted)": "（已静音）",
    "Sound:": "声音:",
    "Mute sounds": "全部静音",
    "Muted": "全部静音",
    "Dark mode:": "亮度:",
    "Automatic": "自动",
    "Speed:": "速度:",
    "Pause": "暂停",
    "Play": "继续",
    "Prev turn": "前一回合",
    "Skip turn": "后一回合",
    "First turn": "第一回合",
    "Skip to end": "最后一回合",
    "Viewpoint:": "视角:",
    "Switch viewpoint": "切换视角",
    "Hyperfast": "极快",
    "Fast": "快",
    "Slow": "慢",
    "Really slow": "极慢",
    "Music:": "音乐：",
    "Play (sound off)": "播放 (关闭音乐)",
    "Reset": "重置",
    "Next turn": "下一回合",
    "Go to turn...": "跳至...回合",
    "Resume": "恢复",
    "Forfeit": "投降",
    "Open replay in new tab": "在新的窗口打开回放",
    "Search replays": "搜索回放",
    "Public": "公开的",
    "Private (your own replays only)": "私人的 (您自己的回放)",
    "Featured replays": "特色回放",
    "Recent replays": "最近的回放",
    "More replays": "更多回放",
    "More": "更多",
    "Replay": "回放",

    //  条款

    "Sleep Moves Clause:": "催眠招式条款：",
    "Sleep-inducing moves are banned": "禁止使用催眠招式",
    "Sleep Clause Mod:": "催眠条款：",
    "Limit one foe put to sleep": "最多只能催眠一只对手的宝可梦",
    "Species Reveal Clause:": "物种揭示条款：",
    "Reveals a Pokemon's true species in hackmons-based metagames.": "揭示宝可梦的真实物种",
    "Species Clause:": "物种条款：",
    "Limit one of each Pokemon": "禁止使用相同宝可梦",
    "Forme Clause:": "形态条款：",
    "Limit one of each forme of a Pokemon": "禁止使用相同形态的宝可梦",
    "OHKO Clause:": "一击必杀条款：",
    "OHKO moves are banned": "禁止使用一击必杀招式",
    "Moody Clause:": "心情不定条款：",
    "Moody is banned": "禁止使用心情不定特性",
    "Evasion Moves Clause:": "闪避招式条款：",
    "Evasion moves are banned": "禁止使用提升闪避率的招式",
    "Evasion Items Clause:": "闪避道具条款：",
    "Evasion items are banned": "禁止使用提升闪避率的道具",
    "Endless Battle Clause:": "无限战斗条款：",
    "Forcing endless battles is banned": "禁止无休止的战斗",
    "HP Percentage Mod:": "HP百分比模式：",
    "HP is shown in percentages": "HP以百分比显示",
    "HP is reported as percentages": "HP以百分比公布",
    "Mega Rayquaza Clause:": "烈空坐超级进化条款：",
    "Mega Rayquaza Ban Mod:": "烈空坐超级进化条款：",
    "You cannot mega evolve Rayquaza": "您不能超级进化烈空坐",
    "Swagger Clause:": "虚张声势条款：",
    "Swagger is banned": "禁止使用虚张声势",
    "Same Type Clause:": "同属性条款：",
    "Pokemon in a team must share a type": "队伍中的宝可梦必须拥有某个相同的属性",
    "Accuracy Moves Clause:": "命中招式条款：",
    "Accuracy-lowering moves are banned": "禁止使用降低命中率的招式",
    "Item Clause:": "道具条款：",
    "Limit one of each item": "禁止携带相同道具",
    "1 Ability Clause:": "特性条款：",
    "Limit 1 of each ability": "禁止使用重复特性",
    "2 Ability Clause:": "特性条款：",
    "Limit 2 of each ability": "最多使用两个同一特性",
    "Evasion Clause:": "闪避条款：",
    "Evasion abilities, items, and moves are banned": "禁止使用闪避特性、道具和招式",
    "Evasion Abilities Clause:": "闪避特性条款：",
    "Evasion abilities are banned": "禁止使用提高闪避率的特性",
    "CFZ Clause:": "Z纯晶条款：",
    "Crystal-free Z-Moves are banned": "禁止不携带Z纯晶使用的Z招式",
    "Freeze Clause Mod:": "冰冻条款：",
    "Limit one foe frozen": "最多只能冰冻一只对手的宝可梦",
    "Ability Clause:": "特性条款：",
    "Limit two of each ability": "队伍最多只能有两个相同特性",
    "Switch Priority Clause Mod:": "替换条款：",
    "Faster Pokemon switch first": "速度快的宝可梦优先执行交换",
    "Baton Pass Clause:": "接棒条款：",
    "Limit one Baton Passer, can't pass Spe and other stats simultaneously": "最多只能携带一只习得接棒的宝可梦，且不能同时传递速度和其他能力等级",
    "Gravity Sleep Clause:": "重力催眠条款：",
    "The combination of Gravity and sleep-inducing moves with imperfect accuracy are banned": "禁止将命中率不满的催眠招式与重力相结合",
    "The combination of sleep-inducing moves with imperfect accuracy and Gravity or Gigantamax Orbeetle are banned": "禁止将命中率不满的催眠招式与重力或超极巨天道七星相结合",
    "Illusion Level Mod:": "幻觉等级条款：",
    "Illusion disguises the Pokemon's true level": "幻觉会掩饰真实的等级",
    "Blitz:": "闪击战：",
    "Super-fast timer": "超快的计时器",
    "One Boost Passer Clause:": "一个接棒手条款：",
    "Limit one Baton Passer that has a way to boost its stats": "最多只能携带一只习得接棒且可以提升能力等级的宝可梦",
    "3 Baton Pass Clause:": "三个接棒手条款：",
    "Limit three Baton Passers": "最多只能携带三只习得接棒的宝可梦",
    "Baton Pass Stat Clause:": "接棒能力条款：",
    "No Baton Passer may have a way to boost its stats": "习得接棒的宝可梦禁止提升能力等级",
    "Dynamax Clause:": "极巨化条款：",
    "You cannot dynamax": "您不能使用极巨化",
    "Terastal Clause:": "太晶化条款：",
    "You cannot Terastallize": "您不能使用太晶化",

    //  特性

    "Stench": "恶臭",
    "Drizzle": "降雨",
    "Speed Boost": "加速",
    "Frisk": "察觉",
    "Battle Armor": "战斗盔甲",
    "Sturdy": "结实",
    "Damp": "湿气",
    "Limber": "柔软",
    "Sand Veil": "沙隐",
    "Static": "静电",
    "Volt Absorb": "蓄电",
    "Water Absorb": "储水",
    "Oblivious": "迟钝",
    "Cloud Nine": "无关天气",
    "Compound Eyes": "复眼",
    "Insomnia": "不眠",
    "Color Change": "变色",
    "Immunity": "免疫",
    "Flash Fire": "引火",
    "Shield Dust": "鳞粉",
    "Own Tempo": "我行我素",
    "Suction Cups": "吸盘",
    "Intimidate": "威吓",
    "Shadow Tag": "踩影",
    "Rough Skin": "粗糙皮肤",
    "Wonder Guard": "神奇守护",
    "Levitate": "飘浮",
    "Effect Spore": "孢子",
    "Synchronize": "同步",
    "Clear Body": "恒净之躯",
    "Natural Cure": "自然回复",
    "Lightning Rod": "避雷针",
    "Serene Grace": "天恩",
    "Swift Swim": "悠游自如",
    "Chlorophyll": "叶绿素",
    "Illuminate": "发光",
    "Trace": "复制",
    "Huge Power": "大力士",
    "Poison Point": "毒刺",
    "Inner Focus": "精神力",
    "Magma Armor": "熔岩铠甲",
    "Water Veil": "水幕",
    "Magnet Pull": "磁力",
    "Soundproof": "隔音",
    "Rain Dish": "雨盘",
    "Sand Stream": "扬沙",
    "Pressure": "压迫感",
    "Thick Fat": "厚脂肪",
    "Early Bird": "早起",
    "Flame Body": "火焰之躯",
    "Run Away": "逃跑",
    "Keen Eye": "锐利目光",
    "Hyper Cutter": "怪力钳",
    "Pickup": "捡拾",
    "Truant": "懒惰",
    "Hustle": "活力",
    "Cute Charm": "迷人之躯",
    "Plus": "正电",
    "Minus": "负电",
    "Forecast": "阴晴不定",
    "Sticky Hold": "黏着",
    "Shed Skin": "蜕皮",
    "Guts": "毅力",
    "Marvel Scale": "神奇鳞片",
    "Liquid Ooze": "污泥浆",
    "Overgrow": "茂盛",
    "Blaze": "猛火",
    "Torrent": "激流",
    "Swarm": "虫之预感",
    "Rock Head": "坚硬脑袋",
    "Drought": "日照",
    "Arena Trap": "沙穴",
    "Vital Spirit": "干劲",
    "White Smoke": "白色烟雾",
    "Pure Power": "瑜珈之力",
    "Shell Armor": "硬壳盔甲",
    "Air Lock": "气闸",
    "Tangled Feet": "蹒跚",
    "Motor Drive": "电气引擎",
    "Rivalry": "斗争心",
    "Steadfast": "不屈之心",
    "Snow Cloak": "雪隐",
    "Gluttony": "贪吃鬼",
    "Anger Point": "愤怒穴位",
    "Unburden": "轻装",
    "Heatproof": "耐热",
    "Simple": "单纯",
    "Dry Skin": "干燥皮肤",
    "Download": "下载",
    "Iron Fist": "铁拳",
    "Poison Heal": "毒疗",
    "Adaptability": "适应力",
    "Skill Link": "连续攻击",
    "Hydration": "湿润之躯",
    "Solar Power": "太阳之力",
    "Quick Feet": "飞毛腿",
    "Normalize": "一般皮肤",
    "Sniper": "狙击手",
    "Magic Guard": "魔法防守",
    "No Guard": "无防守",
    "Stall": "慢出",
    "Technician": "技术高手",
    "Leaf Guard": "叶子防守",
    "Klutz": "笨拙",
    "Mold Breaker": "破格",
    "Super Luck": "超幸运",
    "Aftermath": "引爆",
    "Anticipation": "危险预知",
    "Forewarn": "预知梦",
    "Unaware": "纯朴",
    "Tinted Lens": "有色眼镜",
    "Filter": "过滤",
    "Slow Start": "慢启动",
    "Scrappy": "胆量",
    "Storm Drain": "引水",
    "Ice Body": "冰冻之躯",
    "Solid Rock": "坚硬岩石",
    "Snow Warning": "降雪",
    "Honey Gather": "集蜜",
    "Reckless": "舍身",
    "Multitype": "多属性",
    "Flower Gift": "花之礼",
    "Bad Dreams": "梦魇",
    "Pickpocket": "顺手牵羊",
    "Sheer Force": "强行",
    "Contrary": "唱反调",
    "Unnerve": "紧张感",
    "Defiant": "不服输",
    "Defeatist": "软弱",
    "Cursed Body": "诅咒之躯",
    "Healer": "治愈之心",
    "Friend Guard": "友情防守",
    "Weak Armor": "碎裂铠甲",
    "Heavy Metal": "重金属",
    "Light Metal": "轻金属",
    "Multiscale": "多重鳞片",
    "Toxic Boost": "中毒激升",
    "Flare Boost": "受热激升",
    "Harvest": "收获",
    "Telepathy": "心灵感应",
    "Moody": "心情不定",
    "Overcoat": "防尘",
    "Poison Touch": "毒手",
    "Regenerator": "再生力",
    "Big Pecks": "健壮胸肌",
    "Sand Rush": "泼沙",
    "Wonder Skin": "奇迹皮肤",
    "Analytic": "分析",
    "Illusion": "幻觉",
    "Imposter": "变身者",
    "Infiltrator": "穿透",
    "Mummy": "木乃伊",
    "Moxie": "自信过度",
    "Justified": "正义之心",
    "Rattled": "胆怯",
    "Magic Bounce": "魔法镜",
    "Sap Sipper": "食草",
    "Prankster": "恶作剧之心",
    "Sand Force": "沙之力",
    "Iron Barbs": "铁刺",
    "Zen Mode": "达摩模式",
    "Victory Star": "胜利之星",
    "Turboblaze": "涡轮火焰",
    "Teravolt": "兆级电压",
    "Aerilate": "飞行皮肤",
    "Aura Break": "气场破坏",
    "Cheek Pouch": "颊囊",
    "Dark Aura": "暗黑气场",
    "Fairy Aura": "妖精气场",
    "Flower Veil": "花幕",
    "Fur Coat": "毛皮大衣",
    "Mega Launcher": "超级发射器",
    "Parental Bond": "亲子爱",
    "Pixilate": "妖精皮肤",
    "Protean": "变幻自如",
    "Refrigerate": "冰冻皮肤",
    "Stance Change": "战斗切换",
    "Strong Jaw": "强壮之颚",
    "Sweet Veil": "甜幕",
    "Tough Claws": "硬爪",
    "Competitive": "好胜",
    "Gale Wings": "疾风之翼",
    "Gooey": "黏滑",
    "Aroma Veil": "芳香幕",
    "Bulletproof": "防弹",
    "Grass Pelt": "草之毛皮",
    "Magician": "魔术师",
    "Symbiosis": "共生",
    "Desolate Land": "终结之地",
    "Primordial Sea": "始源之海",
    "Delta Stream": "德尔塔气流",
    "Full Metal Body": "金属防护",
    "Shadow Shield": "幻影防守",
    "Comatose": "绝对睡眠",
    "Power Construct": "群聚变形",
    "Soul-Heart": "魂心",
    "Stakeout": "蹲守",
    "Electric Surge": "电气制造者",
    "Dazzling": "鲜艳之躯",
    "Berserk": "怒火冲天",
    "Battery": "蓄电池",
    "Corrosion": "腐蚀",
    "Disguise": "画皮",
    "Fluffy": "毛茸茸",
    "Stamina": "持久力",
    "Triage": "先行治疗",
    "Wimp Out": "跃跃欲逃",
    "Dancer": "舞者",
    "Shields Down": "界限盾壳",
    "Innards Out": "飞出的内在物",
    "Schooling": "鱼群",
    "Surge Surfer": "冲浪之尾",
    "Water Compaction": "遇水凝固",
    "Queenly Majesty": "女王的威严",
    "Battle Bond": "牵绊变身",
    "Receiver": "接球手",
    "RKS System": "AR系统",
    "Psychic Surge": "精神制造者",
    "Grassy Surge": "青草制造者",
    "Misty Surge": "薄雾制造者",
    "Slush Rush": "拨雪",
    "Emergency Exit": "危险回避",
    "Merciless": "不仁不义",
    "Water Bubble": "水泡",
    "Steelworker": "钢能力者",
    "Long Reach": "远隔",
    "Liquid Voice": "湿润之声",
    "Galvanize": "电气皮肤",
    "Tangling Hair": "卷发",
    "Power of Alchemy": "化学之力",
    "Beast Boost": "异兽提升",
    "Prism Armor": "棱镜装甲",
    "Neuroforce": "脑核之力",
    "Intrepid Sword": "不挠之剑",
    "Dauntless Shield": "不屈之盾",
    "Libero": "自由者",
    "Ball Fetch": "捡球",
    "Cotton Down": "棉絮",
    "Propeller Tail": "螺旋尾鳍",
    "Mirror Armor": "镜甲",
    "Gulp Missile": "一口导弹",
    "Stalwart": "坚毅",
    "Steam Engine": "蒸汽机",
    "Punk Rock": "庞克摇滚",
    "Sand Spit": "吐沙",
    "Ice Scales": "冰鳞粉",
    "Curious Medicine": "怪药",
    "Ripen": "熟成",
    "Ice Face": "结冻头",
    "Power Spot": "能量点",
    "Mimicry": "拟态",
    "Screen Cleaner": "除障",
    "Steely Spirit": "钢之意志",
    "Perish Body": "灭亡之躯",
    "Wandering Spirit": "游魂",
    "Gorilla Tactics": "一猩一意",
    "Neutralizing Gas": "化学变化气体",
    "Pastel Veil": "粉彩护幕",
    "Hunger Switch": "饱了又饿",
    "Corrosive Gas": "腐蚀气体",
    "Unseen Fist": "无形拳",
    "Quick Draw": "速击",
    "Transistor": "电晶体",
    "Dragon's Maw": "龙颚",
    "As One (Glastrier)": "人马一体 (雪暴马)",
    "As One (Spectrier)": "人马一体 (灵幽马)",
    "As One": "人马一体",
    "Chilling Neigh": "苍白嘶鸣",
    "Grim Neigh": "漆黑嘶鸣",
    "Lingering Aroma": "甩不掉的气味",
    "Seed Sower": "掉出种子",
    "Thermal Exchange": "热交换",
    "Anger Shell": "愤怒甲壳",
    "Purifying Salt": "洁净之盐",
    "Well-Baked Body": "焦香之躯",
    "Wind Rider": "乘风",
    "Guard Dog": "看门犬",
    "Rocky Payload": "搬岩",
    "Wind Power": "风力发电",
    "Zero to Hero": "全能变身",
    "Commander": "发号施令",
    "Electromorphosis": "电力转换",
    "Protosynthesis": "古代活性",
    "Quark Drive": "夸克充能",
    "Good as Gold": "黄金之躯",
    "Vessel of Ruin": "灾祸之鼎",
    "Sword of Ruin": "灾祸之剑",
    "Tablets of Ruin": "灾祸之简",
    "Beads of Ruin": "灾祸之玉",
    "Orichalcum Pulse": "绯红脉动",
    "Hadron Engine": "强子引擎",
    "Opportunist": "跟风",
    "Cud Chew": "反刍",
    "Sharpness": "锋锐",
    "Supreme Overlord": "大将",
    "Costar": "同台共演",
    "Toxic Debris": "毒满地",
    "Armor Tail": "尾甲",
    "Earth Eater": "食土",
    "Mycelium Might": "菌丝之力",
    "Hospitality": "款待",
    "Tera Shift": "太晶变形",
    "Tera Shell": "太晶甲壳",
    "Teraform Zero": "归零化境",
    "Toxic Chain": "毒锁链",
    "Poison Puppeteer": "毒傀儡",
    "Supersweet Syrup": "甘露之蜜",
    "Mind's Eye": "心眼",
    "Embody Aspect (Teal)": "面影辉映(碧草)",
    "Embody Aspect (Cornerstone)": "面影辉映(础石)",
    "Embody Aspect (Hearthflame)": "面影辉映(火灶)",
    "Embody Aspect (Wellspring)": "面影辉映(水井)",
    "Embody Aspect": "面影辉映",
    "No Ability": "无特性",

    //  招式

    "Pound": "拍击",
    "Karate Chop": "空手劈",
    "Double Slap": "连环巴掌",
    "Comet Punch": "连续拳",
    "Mega Punch": "百万吨重拳",
    "Pay Day": "聚宝功",
    "Fire Punch": "火焰拳",
    "Ice Punch": "冰冻拳",
    "Thunder Punch": "雷电拳",
    "Scratch": "抓",
    "Vise Grip": "夹住",
    "Guillotine": "断头钳",
    "Razor Wind": "旋风刀",
    "Swords Dance": "剑舞",
    "Cut": "居合斩",
    "Gust": "起风",
    "Wing Attack": "翅膀攻击",
    "Whirlwind": "吹飞",
    "Fly": "飞翔",
    "Bind": "绑紧",
    "Slam": "摔打",
    "Vine Whip": "藤鞭",
    "Stomp": "踩踏",
    "Double Kick": "二连踢",
    "Mega Kick": "百万吨重踢",
    "Jump Kick": "飞踢",
    "Rolling Kick": "回旋踢",
    "Sand Attack": "泼沙",
    "Headbutt": "头锤",
    "Horn Attack": "角撞",
    "Fury Attack": "乱击",
    "Horn Drill": "角钻",
    "Tackle": "撞击",
    "Body Slam": "泰山压顶",
    "Wrap": "紧束",
    "Take Down": "猛撞",
    "Thrash": "大闹一番",
    "Double-Edge": "舍身冲撞",
    "Tail Whip": "摇尾巴",
    "Poison Sting": "毒针",
    "Twineedle": "双针",
    "Pin Missile": "飞弹针",
    "Leer": "瞪眼",
    "Bite": "咬住",
    "Growl": "叫声",
    "Roar": "吼叫",
    "Sing": "唱歌",
    "Supersonic": "超音波",
    "Sonic Boom": "音爆",
    "Acid": "溶解液",
    "Ember": "火花",
    "Flamethrower": "喷射火焰",
    "Mist": "白雾",
    "Water Gun": "水枪",
    "Hydro Pump": "水炮",
    "Surf": "冲浪",
    "Ice Beam": "冰冻光束",
    "Blizzard": "暴风雪",
    "Psybeam": "幻象光线",
    "Bubble Beam": "泡沫光线",
    "Aurora Beam": "极光束",
    "Hyper Beam": "破坏光线",
    "Peck": "啄",
    "Drill Peck": "啄钻",
    "Submission": "地狱翻滚",
    "Low Kick": "踢倒",
    "Counter": "双倍奉还",
    "Seismic Toss": "地球上投",
    "Strength": "怪力",
    "Absorb": "吸取",
    "Mega Drain": "超级吸取",
    "Leech Seed": "寄生种子",
    "Growth": "生长",
    "Razor Leaf": "飞叶快刀",
    "Solar Beam": "日光束",
    "Poison Powder": "毒粉",
    "Stun Spore": "麻痹粉",
    "Sleep Powder": "催眠粉",
    "Petal Dance": "花瓣舞",
    "String Shot": "吐丝",
    "Dragon Rage": "龙之怒",
    "Fire Spin": "火焰旋涡",
    "Thunder Shock": "电击",
    "Thunderbolt": "十万伏特",
    "Thunder Wave": "电磁波",
    "Thunder": "打雷",
    "Rock Throw": "落石",
    "Earthquake": "地震",
    "Fissure": "地裂",
    "Dig": "挖洞",
    "Toxic": "剧毒",
    "Confusion": "念力",
    "Psychic": "超能力",
    "Hypnosis": "催眠术",
    "Meditate": "瑜伽姿势",
    "Agility": "高速移动",
    "Quick Attack": "电光一闪",
    "Rage": "愤怒",
    "Teleport": "瞬间移动",
    "Night Shade": "黑夜魔影",
    "Mimic": "模仿",
    "Screech": "刺耳声",
    "Double Team": "影子分身",
    "Recover": "自我再生",
    "Harden": "变硬",
    "Minimize": "变小",
    "Smokescreen": "烟幕",
    "Confuse Ray": "奇异之光",
    "Withdraw": "缩入壳中",
    "Defense Curl": "变圆",
    "Barrier": "屏障",
    "Light Screen": "光墙",
    "Haze": "黑雾",
    "Reflect": "反射壁",
    "Focus Energy": "聚气",
    "Bide": "忍耐",
    "Mirror Move": "鹦鹉学舌",
    "Self-Destruct": "自爆",
    "Egg Bomb": "炸蛋",
    "Lick": "舌舔",
    "Smog": "浊雾",
    "Sludge": "污泥攻击",
    "Bone Club": "骨棒",
    "Fire Blast": "大字爆炎",
    "Waterfall": "攀瀑",
    "Clamp": "贝壳夹击",
    "Swift": "高速星星",
    "Skull Bash": "火箭头锤",
    "Spike Cannon": "尖刺加农炮",
    "Constrict": "缠绕",
    "Amnesia": "瞬间失忆",
    "Kinesis": "折弯汤匙",
    "Soft-Boiled": "生蛋",
    "High Jump Kick": "飞膝踢",
    "Glare": "大蛇瞪眼",
    "Dream Eater": "食梦",
    "Poison Gas": "毒瓦斯",
    "Barrage": "投球",
    "Leech Life": "吸血",
    "Lovely Kiss": "恶魔之吻",
    "Sky Attack": "神鸟猛击",
    "Transform": "变身",
    "Bubble": "泡沫",
    "Dizzy Punch": "迷昏拳",
    "Spore": "蘑菇孢子",
    "Flash": "闪光",
    "Psywave": "精神波",
    "Splash": "跃起",
    "Acid Armor": "溶化",
    "Crabhammer": "蟹钳锤",
    "Explosion": "大爆炸",
    "Fury Swipes": "乱抓",
    "Bonemerang": "骨头回力镖",
    "Rest": "睡觉",
    "Rock Slide": "岩崩",
    "Hyper Fang": "必杀门牙",
    "Sharpen": "棱角化",
    "Conversion": "纹理",
    "Tri Attack": "三重攻击",
    "Super Fang": "愤怒门牙",
    "Slash": "劈开",
    "Substitute": "替身",
    "Struggle": "挣扎",
    "Sketch": "写生",
    "Triple Kick": "三连踢",
    "Thief": "小偷",
    "Spider Web": "蛛网",
    "Mind Reader": "心之眼",
    "Nightmare": "恶梦",
    "Flame Wheel": "火焰轮",
    "Snore": "打鼾",
    "Curse": "诅咒",
    "Flail": "抓狂",
    "Conversion 2": "纹理2",
    "Aeroblast": "气旋攻击",
    "Cotton Spore": "棉孢子",
    "Reversal": "起死回生",
    "Spite": "怨恨",
    "Powder Snow": "细雪",
    "Protect": "守住",
    "Mach Punch": "音速拳",
    "Scary Face": "鬼面",
    "Feint Attack": "出奇一击",
    "Sweet Kiss": "天使之吻",
    "Belly Drum": "腹鼓",
    "Sludge Bomb": "污泥炸弹",
    "Mud-Slap": "掷泥",
    "Octazooka": "章鱼桶炮",
    "Spikes": "撒菱",
    "Zap Cannon": "电磁炮",
    "Foresight": "识破",
    "Destiny Bond": "同命",
    "Perish Song": "灭亡之歌",
    "Icy Wind": "冰冻之风",
    "Detect": "看穿",
    "Bone Rush": "骨棒乱打",
    "Lock-On": "锁定",
    "Outrage": "逆鳞",
    "Sandstorm": "沙暴",
    "Giga Drain": "终极吸取",
    "Endure": "挺住",
    "Charm": "撒娇",
    "Rollout": "滚动",
    "False Swipe": "点到为止",
    "Swagger": "虚张声势",
    "Milk Drink": "喝牛奶",
    "Spark": "电光",
    "Fury Cutter": "连斩",
    "Steel Wing": "钢翼",
    "Mean Look": "黑色目光",
    "Attract": "迷人",
    "Sleep Talk": "梦话",
    "Heal Bell": "治愈铃声",
    "Return": "报恩",
    "Present": "礼物",
    "Frustration": "迁怒",
    "Safeguard": "神秘守护",
    "Pain Split": "分担痛楚",
    "Sacred Fire": "神圣之火",
    "Magnitude": "震级",
    "Dynamic Punch": "爆裂拳",
    "Megahorn": "超级角击",
    "Dragon Breath": "龙息",
    "Baton Pass": "接棒",
    "Encore": "再来一次",
    "Pursuit": "追打",
    "Rapid Spin": "高速旋转",
    "Sweet Scent": "甜甜香气",
    "Iron Tail": "铁尾",
    "Metal Claw": "金属爪",
    "Vital Throw": "借力摔",
    "Morning Sun": "晨光",
    "Synthesis": "光合作用",
    "Moonlight": "月光",
    "Hidden Power": "觉醒力量",
    "Cross Chop": "十字劈",
    "Twister": "龙卷风",
    "Rain Dance": "求雨",
    "Sunny Day": "大晴天",
    "Crunch": "咬碎",
    "Mirror Coat": "镜面反射",
    "Psych Up": "自我暗示",
    "Extreme Speed": "神速",
    "Ancient Power": "原始之力",
    "Shadow Ball": "暗影球",
    "Future Sight": "预知未来",
    "Rock Smash": "碎岩",
    "Whirlpool": "潮旋",
    "Beat Up": "围攻",
    "Fake Out": "击掌奇袭",
    "Uproar": "吵闹",
    "Stockpile": "蓄力",
    "Spit Up": "喷出",
    "Swallow": "吞下",
    "Heat Wave": "热风",
    "Hail": "冰雹",
    "Torment": "无理取闹",
    "Flatter": "吹捧",
    "Will-O-Wisp": "鬼火",
    "Memento": "临别礼物",
    "Facade": "硬撑",
    "Focus Punch": "真气拳",
    "Smelling Salts": "清醒",
    "Follow Me": "看我嘛",
    "Nature Power": "自然之力",
    "Charge": "充电",
    "Taunt": "挑衅",
    "Helping Hand": "帮助",
    "Trick": "戏法",
    "Role Play": "扮演",
    "Wish": "祈愿",
    "Assist": "借助",
    "Ingrain": "扎根",
    "Superpower": "蛮力",
    "Magic Coat": "魔法反射",
    "Recycle": "回收利用",
    "Revenge": "报复",
    "Brick Break": "劈瓦",
    "Yawn": "哈欠",
    "Knock Off": "拍落",
    "Endeavor": "蛮干",
    "Eruption": "喷火",
    "Skill Swap": "特性互换",
    "Imprison": "封印",
    "Refresh": "刷新",
    "Grudge": "怨念",
    "Snatch": "抢夺",
    "Secret Power": "秘密之力",
    "Dive": "潜水",
    "Arm Thrust": "猛推",
    "Camouflage": "保护色",
    "Tail Glow": "萤火",
    "Luster Purge": "洁净光芒",
    "Mist Ball": "薄雾球",
    "Feather Dance": "羽毛舞",
    "Teeter Dance": "摇晃舞",
    "Blaze Kick": "火焰踢",
    "Mud Sport": "玩泥巴",
    "Ice Ball": "冰球",
    "Needle Arm": "尖刺臂",
    "Slack Off": "偷懒",
    "Hyper Voice": "巨声",
    "Poison Fang": "剧毒牙",
    "Crush Claw": "撕裂爪",
    "Blast Burn": "爆炸烈焰",
    "Hydro Cannon": "加农水炮",
    "Meteor Mash": "彗星拳",
    "Astonish": "惊吓",
    "Weather Ball": "气象球",
    "Aromatherapy": "芳香治疗",
    "Fake Tears": "假哭",
    "Air Cutter": "空气利刃",
    "Overheat": "过热",
    "Odor Sleuth": "气味侦测",
    "Rock Tomb": "岩石封锁",
    "Silver Wind": "银色旋风",
    "Metal Sound": "金属音",
    "Grass Whistle": "草笛",
    "Tickle": "挠痒",
    "Cosmic Power": "宇宙力量",
    "Water Spout": "喷水",
    "Signal Beam": "信号光束",
    "Shadow Punch": "暗影拳",
    "Extrasensory": "神通力",
    "Sky Uppercut": "冲天拳",
    "Sand Tomb": "流沙地狱",
    "Sheer Cold": "绝对零度",
    "Muddy Water": "浊流",
    "Bullet Seed": "种子机关枪",
    "Aerial Ace": "燕返",
    "Icicle Spear": "冰锥",
    "Iron Defense": "铁壁",
    "Block": "挡路",
    "Howl": "长嚎",
    "Dragon Claw": "龙爪",
    "Frenzy Plant": "疯狂植物",
    "Bulk Up": "健美",
    "Bounce": "弹跳",
    "Mud Shot": "泥巴射击",
    "Poison Tail": "毒尾",
    "Covet": "渴望",
    "Volt Tackle": "伏特攻击",
    "Magical Leaf": "魔法叶",
    "Water Sport": "玩水",
    "Calm Mind": "冥想",
    "Leaf Blade": "叶刃",
    "Dragon Dance": "龙之舞",
    "Rock Blast": "岩石爆击",
    "Shock Wave": "电击波",
    "Water Pulse": "水之波动",
    "Doom Desire": "破灭之愿",
    "Psycho Boost": "精神突进",
    "Roost": "羽栖",
    "Gravity": "重力",
    "Miracle Eye": "奇迹之眼",
    "Wake-Up Slap": "唤醒巴掌",
    "Hammer Arm": "臂锤",
    "Gyro Ball": "陀螺球",
    "Healing Wish": "治愈之愿",
    "Brine": "盐水",
    "Natural Gift": "自然之恩",
    "Feint": "佯攻",
    "Pluck": "啄食",
    "Tailwind": "顺风",
    "Acupressure": "点穴",
    "Metal Burst": "金属爆炸",
    "U-turn": "急速折返",
    "Close Combat": "近身战",
    "Payback": "以牙还牙",
    "Assurance": "恶意追击",
    "Embargo": "查封",
    "Fling": "投掷",
    "Psycho Shift": "精神转移",
    "Trump Card": "王牌",
    "Heal Block": "回复封锁",
    "Wring Out": "绞紧",
    "Power Trick": "力量戏法",
    "Gastro Acid": "胃液",
    "Lucky Chant": "幸运咒语",
    "Me First": "抢先一步",
    "Copycat": "仿效",
    "Power Swap": "力量互换",
    "Guard Swap": "防守互换",
    "Punishment": "惩罚",
    "Last Resort": "珍藏",
    "Worry Seed": "烦恼种子",
    "Sucker Punch": "突袭",
    "Toxic Spikes": "毒菱",
    "Heart Swap": "心灵互换",
    "Aqua Ring": "水流环",
    "Magnet Rise": "电磁飘浮",
    "Flare Blitz": "闪焰冲锋",
    "Force Palm": "发劲",
    "Aura Sphere": "波导弹",
    "Rock Polish": "岩石打磨",
    "Poison Jab": "毒击",
    "Dark Pulse": "恶之波动",
    "Night Slash": "暗袭要害",
    "Aqua Tail": "水流尾",
    "Seed Bomb": "种子炸弹",
    "Air Slash": "空气斩",
    "X-Scissor": "十字剪",
    "Bug Buzz": "虫鸣",
    "Dragon Pulse": "龙之波动",
    "Dragon Rush": "龙之俯冲",
    "Power Gem": "力量宝石",
    "Drain Punch": "吸取拳",
    "Vacuum Wave": "真空波",
    "Focus Blast": "真气弹",
    "Energy Ball": "能量球",
    "Brave Bird": "勇鸟猛攻",
    "Earth Power": "大地之力",
    "Switcheroo": "掉包",
    "Giga Impact": "终极冲击",
    "Nasty Plot": "诡计",
    "Bullet Punch": "子弹拳",
    "Avalanche": "雪崩",
    "Ice Shard": "冰砾",
    "Shadow Claw": "暗影爪",
    "Thunder Fang": "雷电牙",
    "Ice Fang": "冰冻牙",
    "Fire Fang": "火焰牙",
    "Shadow Sneak": "影子偷袭",
    "Mud Bomb": "泥巴炸弹",
    "Psycho Cut": "精神利刃",
    "Zen Headbutt": "意念头锤",
    "Mirror Shot": "镜光射击",
    "Flash Cannon": "加农光炮",
    "Rock Climb": "攀岩",
    "Defog": "清除浓雾",
    "Trick Room": "戏法空间",
    "Draco Meteor": "流星群",
    "Discharge": "放电",
    "Lava Plume": "喷烟",
    "Leaf Storm": "飞叶风暴",
    "Power Whip": "强力鞭打",
    "Rock Wrecker": "岩石炮",
    "Cross Poison": "十字毒刃",
    "Gunk Shot": "垃圾射击",
    "Iron Head": "铁头",
    "Magnet Bomb": "磁铁炸弹",
    "Stone Edge": "尖石攻击",
    "Captivate": "诱惑",
    "Stealth Rock": "隐形岩",
    "Grass Knot": "打草结",
    "Chatter": "喋喋不休",
    "Judgment": "制裁光砾",
    "Bug Bite": "虫咬",
    "Charge Beam": "充电光束",
    "Wood Hammer": "木槌",
    "Aqua Jet": "水流喷射",
    "Attack Order": "攻击指令",
    "Defend Order": "防御指令",
    "Heal Order": "回复指令",
    "Head Smash": "双刃头锤",
    "Double Hit": "二连击",
    "Roar of Time": "时光咆哮",
    "Spacial Rend": "亚空裂斩",
    "Lunar Dance": "新月舞",
    "Crush Grip": "捏碎",
    "Magma Storm": "熔岩风暴",
    "Dark Void": "暗黑洞",
    "Seed Flare": "种子闪光",
    "Ominous Wind": "奇异之风",
    "Shadow Force": "暗影潜袭",
    "Hone Claws": "磨爪",
    "Wide Guard": "广域防守",
    "Guard Split": "防守平分",
    "Power Split": "力量平分",
    "Wonder Room": "奇妙空间",
    "Psyshock": "精神冲击",
    "Venoshock": "毒液冲击",
    "Autotomize": "身体轻量化",
    "Rage Powder": "愤怒粉",
    "Telekinesis": "意念移物",
    "Magic Room": "魔法空间",
    "Smack Down": "击落",
    "Storm Throw": "山岚摔",
    "Flame Burst": "烈焰溅射",
    "Sludge Wave": "污泥波",
    "Quiver Dance": "蝶舞",
    "Heavy Slam": "重磅冲撞",
    "Synchronoise": "同步干扰",
    "Electro Ball": "电球",
    "Soak": "浸水",
    "Flame Charge": "蓄能焰袭",
    "Coil": "盘蜷",
    "Low Sweep": "下盘踢",
    "Acid Spray": "酸液炸弹",
    "Foul Play": "欺诈",
    "Simple Beam": "单纯光束",
    "Entrainment": "找伙伴",
    "After You": "您先请",
    "Round": "轮唱",
    "Echoed Voice": "回声",
    "Chip Away": "逐步击破",
    "Clear Smog": "清除之烟",
    "Stored Power": "辅助力量",
    "Quick Guard": "快速防守",
    "Ally Switch": "交换场地",
    "Scald": "热水",
    "Shell Smash": "破壳",
    "Heal Pulse": "治愈波动",
    "Hex": "祸不单行",
    "Sky Drop": "自由落体",
    "Shift Gear": "换档",
    "Circle Throw": "巴投",
    "Incinerate": "烧尽",
    "Quash": "延后",
    "Acrobatics": "杂技",
    "Reflect Type": "镜面属性",
    "Retaliate": "报仇",
    "Final Gambit": "搏命",
    "Bestow": "传递礼物",
    "Inferno": "炼狱",
    "Water Pledge": "水之誓约",
    "Fire Pledge": "火之誓约",
    "Grass Pledge": "草之誓约",
    "Volt Switch": "伏特替换",
    "Struggle Bug": "虫之抵抗",
    "Bulldoze": "重踏",
    "Frost Breath": "冰息",
    "Dragon Tail": "龙尾",
    "Work Up": "自我激励",
    "Electroweb": "电网",
    "Wild Charge": "疯狂伏特",
    "Drill Run": "直冲钻",
    "Dual Chop": "二连劈",
    "Heart Stamp": "爱心印章",
    "Horn Leech": "木角",
    "Sacred Sword": "圣剑",
    "Razor Shell": "贝壳刃",
    "Heat Crash": "高温重压",
    "Leaf Tornado": "青草搅拌器",
    "Steamroller": "疯狂滚压",
    "Cotton Guard": "棉花防守",
    "Night Daze": "暗黑爆破",
    "Psystrike": "精神击破",
    "Tail Slap": "扫尾拍打",
    "Hydro Steam": "水蒸气",
    "Psyblade": "精神剑",
    "Hurricane": "暴风",
    "Head Charge": "爆炸头突击",
    "Gear Grind": "齿轮飞盘",
    "Searing Shot": "火焰弹",
    "Techno Blast": "高科技光炮",
    "Relic Song": "古老之歌",
    "Secret Sword": "神秘之剑",
    "Glaciate": "冰封世界",
    "Bolt Strike": "雷击",
    "Blue Flare": "青焰",
    "Fiery Dance": "火之舞",
    "Freeze Shock": "冰冻伏特",
    "Ice Burn": "极寒冷焰",
    "Snarl": "大声咆哮",
    "Icicle Crash": "冰柱坠击",
    "V-create": "V热焰",
    "Fusion Flare": "交错火焰",
    "Fusion Bolt": "交错闪电",
    "Flying Press": "飞身重压",
    "Mat Block": "掀榻榻米",
    "Belch": "打嗝",
    "Rototiller": "耕地",
    "Sticky Web": "黏黏网",
    "Fell Stinger": "致命针刺",
    "Phantom Force": "潜灵奇袭",
    "Trick-or-Treat": "万圣夜",
    "Noble Roar": "战吼",
    "Ion Deluge": "等离子浴",
    "Parabolic Charge": "抛物面充电",
    "Forest's Curse": "森林诅咒",
    "Petal Blizzard": "落英缤纷",
    "Freeze-Dry": "冷冻干燥",
    "Disarming Voice": "魅惑之声",
    "Parting Shot": "抛下狠话",
    "Topsy-Turvy": "颠倒",
    "Draining Kiss": "吸取之吻",
    "Crafty Shield": "戏法防守",
    "Flower Shield": "鲜花防守",
    "Grassy Terrain": "青草场地",
    "Misty Terrain": "薄雾场地",
    "Electrify": "输电",
    "Play Rough": "嬉闹",
    "Fairy Wind": "妖精之风",
    "Moonblast": "月亮之力",
    "Boomburst": "爆音波",
    "Fairy Lock": "妖精之锁",
    "King's Shield": "王者盾牌",
    "Play Nice": "和睦相处",
    "Confide": "密语",
    "Diamond Storm": "钻石风暴",
    "Steam Eruption": "蒸汽爆炸",
    "Hyperspace Hole": "异次元洞",
    "Water Shuriken": "飞水手里剑",
    "Mystical Fire": "魔法火焰",
    "Spiky Shield": "尖刺防守",
    "Aromatic Mist": "芳香薄雾",
    "Eerie Impulse": "怪异电波",
    "Venom Drench": "毒液陷阱",
    "Powder": "粉尘",
    "Geomancy": "大地掌控",
    "Magnetic Flux": "磁场操控",
    "Happy Hour": "欢乐时光",
    "Electric Terrain": "电气场地",
    "Dazzling Gleam": "魔法闪耀",
    "Celebrate": "庆祝",
    "Hold Hands": "牵手",
    "Baby-Doll Eyes": "圆瞳",
    "Nuzzle": "蹭蹭脸颊",
    "Hold Back": "手下留情",
    "Infestation": "死缠烂打",
    "Power-Up Punch": "增强拳",
    "Oblivion Wing": "死亡之翼",
    "Thousand Arrows": "千箭齐发",
    "Thousand Waves": "千波激荡",
    "Land's Wrath": "大地神力",
    "Light of Ruin": "破灭之光",
    "Origin Pulse": "根源波动",
    "Precipice Blades": "断崖之剑",
    "Dragon Ascent": "画龙点睛",
    "Hyperspace Fury": "异次元猛攻",
    "Breakneck Blitz": "究极无敌大冲撞",
    "All-Out Pummeling": "全力无双激烈拳",
    "Supersonic Skystrike": "极速俯冲轰烈撞",
    "Acid Downpour": "强酸剧毒灭绝雨",
    "Tectonic Rage": "地隆啸天大终结",
    "Continental Crush": "毁天灭地巨岩坠",
    "Savage Spin-Out": "绝对捕食回旋斩",
    "Never-Ending Nightmare": "无尽暗夜之诱惑",
    "Corkscrew Crash": "超绝螺旋连击",
    "Inferno Overdrive": "超强极限爆焰弹",
    "Hydro Vortex": "超级水流大漩涡",
    "Bloom Doom": "绚烂缤纷花怒放",
    "Gigavolt Havoc": "终极伏特狂雷闪",
    "Shattered Psyche": "至高精神破坏波",
    "Subzero Slammer": "激狂大地万里冰",
    "Devastating Drake": "究极巨龙震天地",
    "Black Hole Eclipse": "黑洞吞噬万物灭",
    "Twinkle Tackle": "可爱星星飞天撞",
    "Catastropika": "皮卡皮卡必杀击",
    "Shore Up": "集沙",
    "First Impression": "迎头一击",
    "Baneful Bunker": "碉堡",
    "Spirit Shackle": "缝影",
    "Darkest Lariat": "DD金勾臂",
    "Sparkling Aria": "泡影的咏叹调",
    "Ice Hammer": "冰锤",
    "Floral Healing": "花疗",
    "High Horsepower": "十万马力",
    "Strength Sap": "吸取力量",
    "Solar Blade": "日光刃",
    "Leafage": "树叶",
    "Spotlight": "聚光灯",
    "Toxic Thread": "毒丝",
    "Laser Focus": "磨砺",
    "Gear Up": "辅助齿轮",
    "Throat Chop": "地狱突刺",
    "Pollen Puff": "花粉团",
    "Anchor Shot": "掷锚",
    "Psychic Terrain": "精神场地",
    "Lunge": "猛扑",
    "Fire Lash": "火焰鞭",
    "Power Trip": "嚣张",
    "Burn Up": "燃尽",
    "Speed Swap": "速度互换",
    "Smart Strike": "修长之角",
    "Purify": "净化",
    "Revelation Dance": "觉醒之舞",
    "Core Enforcer": "核心惩罚者",
    "Trop Kick": "热带踢",
    "Instruct": "号令",
    "Beak Blast": "鸟嘴加农炮",
    "Clanging Scales": "鳞片噪音",
    "Dragon Hammer": "龙锤",
    "Brutal Swing": "狂舞挥打",
    "Aurora Veil": "极光幕",
    "Sinister Arrow Raid": "遮天蔽日暗影箭",
    "Malicious Moonsault": "极恶飞跃粉碎击",
    "Oceanic Operetta": "海神庄严交响乐",
    "Guardian of Alola": "巨人卫士・阿罗拉",
    "Soul-Stealing 7-Star Strike": "七星夺魂腿",
    "Stoked Sparksurfer": "驾雷驭电戏冲浪",
    "Pulverizing Pancake": "认真起来大爆击",
    "Extreme Evoboost": "九彩升华齐聚顶",
    "Genesis Supernova": "起源超新星大爆炸",
    "Shell Trap": "陷阱甲壳",
    "Fleur Cannon": "花朵加农炮",
    "Psychic Fangs": "精神之牙",
    "Stomping Tantrum": "跺脚",
    "Shadow Bone": "暗影之骨",
    "Accelerock": "冲岩",
    "Liquidation": "水流裂破",
    "Prismatic Laser": "棱镜镭射",
    "Spectral Thief": "暗影偷盗",
    "Sunsteel Strike": "流星闪冲",
    "Moongeist Beam": "暗影之光",
    "Tearful Look": "泪眼汪汪",
    "Zing Zap": "麻麻刺刺",
    "Nature's Madness": "自然之怒",
    "Multi-Attack": "多属性攻击",
    "10,000,000 Volt Thunderbolt": "千万伏特",
    "Mind Blown": "惊爆大头",
    "Plasma Fists": "等离子闪电拳",
    "Photon Geyser": "光子喷涌",
    "Light That Burns the Sky": "焚天灭世炽光爆",
    "Searing Sunraze Smash": "日光回旋下苍穹",
    "Menacing Moonraze Maelstrom": "月华飞溅落灵霄",
    "Let's Snuggle Forever": "亲密无间大乱揍",
    "Splintered Stormshards": "狼啸石牙飓风暴",
    "Clangorous Soulblaze": "炽魂热舞烈音爆",
    "Zippy Zap": "电电加速",
    "Splishy Splash": "滔滔冲浪",
    "Floaty Fall": "飘飘坠落",
    "Pika Papow": "闪闪雷光",
    "Bouncy Bubble": "活活气泡",
    "Buzzy Buzz": "麻麻电击",
    "Sizzly Slide": "熊熊火爆",
    "Glitzy Glow": "哗哗气场",
    "Baddy Bad": "坏坏领域",
    "Sappy Seed": "茁茁轰炸",
    "Freezy Frost": "冰冰霜冻",
    "Sparkly Swirl": "亮亮风暴",
    "Veevee Volley": "砰砰击破",
    "Double Iron Bash": "钢拳双击",
    "Max Guard": "极巨防壁",
    "Dynamax Cannon": "极巨炮",
    "Snipe Shot": "狙击",
    "Jaw Lock": "紧咬不放",
    "Stuff Cheeks": "大快朵颐",
    "No Retreat": "背水一战",
    "Tar Shot": "沥青射击",
    "Magic Powder": "魔法粉",
    "Dragon Darts": "龙箭",
    "Teatime": "茶会",
    "Octolock": "蛸固",
    "Bolt Beak": "电喙",
    "Fishious Rend": "鳃咬",
    "Court Change": "换场",
    "Max Flare": "极巨火爆",
    "Max Flutterby": "极巨虫蛊",
    "Max Lightning": "极巨闪电",
    "Max Strike": "极巨攻击",
    "Max Knuckle": "极巨拳斗",
    "Max Phantasm": "极巨幽魂",
    "Max Hailstorm": "极巨寒冰",
    "Max Ooze": "极巨酸毒",
    "Max Geyser": "极巨水流",
    "Max Airstream": "极巨飞冲",
    "Max Starfall": "极巨妖精",
    "Max Wyrmwind": "极巨龙骑",
    "Max Mindstorm": "极巨超能",
    "Max Rockfall": "极巨岩石",
    "Max Quake": "极巨大地",
    "Max Darkness": "极巨恶霸",
    "Max Overgrowth": "极巨草原",
    "Max Steelspike": "极巨钢铁",
    "Clangorous Soul": "魂舞烈音爆",
    "Body Press": "扑击",
    "Decorate": "装饰",
    "Drum Beating": "鼓击",
    "Snap Trap": "捕兽夹",
    "Pyro Ball": "火焰球",
    "Behemoth Blade": "巨兽斩",
    "Behemoth Bash": "巨兽弹",
    "Aura Wheel": "气场轮",
    "Breaking Swipe": "广域破坏",
    "Branch Poke": "木枝突刺",
    "Overdrive": "破音",
    "Apple Acid": "苹果酸",
    "Grav Apple": "万有引力",
    "Spirit Break": "灵魂冲击",
    "Strange Steam": "神奇蒸汽",
    "Life Dew": "生命水滴",
    "Obstruct": "拦堵",
    "False Surrender": "假跪真撞",
    "Meteor Assault": "流星突击",
    "Eternabeam": "无极光束",
    "Steel Beam": "铁蹄光线",
    "Glacial Lance": "雪矛",
    "Thunder Cage": "雷电囚笼",
    "Thunderous Kick": "雷鸣蹴击",
    "Astral Barrage": "星碎",
    "Dragon Energy": "巨龙威能",
    "Fiery Wrath": "怒火中烧",
    "Freezing Glare": "冰冷视线",
    "Eerie Spell": "诡异咒语",
    "Jungle Healing": "丛林治疗",
    "Lash Out": "泄愤",
    "Grassy Glide": "青草滑梯",
    "Coaching": "指导",
    "Surging Strikes": "水流连打",
    "Wicked Blow": "暗冥强击",
    "Expanding Force": "广域战力",
    "Steel Roller": "铁滚轮",
    "Rising Voltage": "电力上升",
    "Scorching Sands": "热沙大地",
    "Dual Wingbeat": "双翼",
    "Misty Explosion": "薄雾炸裂",
    "Skitter Smack": "爬击",
    "Triple Axel": "三旋击",
    "Terrain Pulse": "大地波动",
    "Burning Jealousy": "妒火",
    "Flip Turn": "快速折返",
    "Meteor Beam": "流星光束",
    "Poltergeist": "灵骚",
    "Scale Shot": "鳞射",
    "Shell Side Arm": "臂贝武器",
    "Tera Blast": "太晶爆发",
    "Aqua Step": "流水旋舞",
    "Armor Cannon": "铠农炮",
    "Axe Kick": "下压踢",
    "Bitter Blade": "悔念剑",
    "Bitter Malice": "冤冤相报",
    "Blazing Torque": "灼热暴冲",
    "Bleakwind Storm": "枯叶风暴",
    "Chloroblast": "叶绿爆震",
    "Collision Course": "全开猛撞",
    "Combat Torque": "格斗暴冲",
    "Dire Claw": "克命爪",
    "Double Shock": "电光双击",
    "Electro Drift": "闪电猛冲",
    "Esper Wing": "气场之翼",
    "Gigaton Hammer": "巨力锤",
    "Glaive Rush": "巨剑突击",
    "Headlong Rush": "突飞猛扑",
    "Hyper Drill": "强力钻",
    "Ice Spinner": "冰旋",
    "Kowtow Cleave": "仆刀",
    "Lumina Crash": "琉光冲激",
    "Magical Torque": "魔法暴冲",
    "Make It Rain": "淘金潮",
    "Mountain Gale": "冰山风",
    "Noxious Torque": "剧毒暴冲",
    "Order Up": "上菜",
    "Raging Bull": "怒牛",
    "Raging Fury": "大愤慨",
    "Sandsear Storm": "热沙风暴",
    "Spin Out": "疾速转轮",
    "Springtide Storm": "阳春风暴",
    "Torch Song": "闪焰高歌",
    "Triple Arrows": "三连箭",
    "Wave Crash": "波动冲",
    "Wicked Torque": "黑暗暴冲",
    "Wildbolt Storm": "鸣雷风暴",
    "Aqua Cutter": "水波刀",
    "Barb Barrage": "毒千针",
    "Ceaseless Edge": "秘剑·千重涛",
    "Chilling Water": "泼冷水",
    "Chilly Reception": "冷笑话",
    "Comeuppance": "复仇",
    "Doodle": "描绘",
    "Fillet Away": "甩肉",
    "Flower Trick": "千变万花",
    "Infernal Parade": "群魔乱舞",
    "Jet Punch": "喷射拳",
    "Last Respects": "扫墓",
    "Lunar Blessing": "新月祈祷",
    "Mortal Spin": "晶光转转",
    "Mystical Power": "神秘之力",
    "Population Bomb": "鼠数儿",
    "Pounce": "虫扑",
    "Power Shift": "力量转换",
    "Psyshield Bash": "屏障猛攻",
    "Rage Fist": "愤怒之拳",
    "Revival Blessing": "复生祈祷",
    "Ruination": "大灾难",
    "Salt Cure": "盐腌",
    "Shed Tail": "断尾",
    "Shelter": "闭关",
    "Silk Trap": "线阱",
    "Snowscape": "雪景",
    "Spicy Extract": "辣椒精华",
    "Stone Axe": "岩斧",
    "Take Heart": "勇气填充",
    "Tidy Up": "大扫除",
    "Trailblaze": "起草",
    "Triple Dive": "三连钻",
    "Twin Beam": "双光束",
    "Victory Dance": "胜利之舞",
    "Thunderclap": "迅雷",
    "Supercell Slam": "闪电强袭",
    "Dragon Cheer": "龙声鼓舞",
    "Tera Starstorm": "晶光星群",
    "Electro Shot": "电光束",
    "Psychic Noise": "精神噪音",
    "Tachyon Cutter": "迅子利刃",
    "Temper Flare": "豁出去",
    "Burning Bulwark": "火焰守护",
    "Mighty Cleave": "强刃攻击",
    "Fickle Beam": "随机光",
    "Syrup Bomb": "糖浆炸弹",
    "Matcha Gotcha": "刷刷茶炮",
    "Ivy Cudgel": "棘藤棒",
    "Hard Press": "硬压",
    "Alluring Voice": "魅诱之声",
    "Upper Hand": "快手还击",
    "Malignant Chain": "邪毒锁链",
    "Blood Moon": "血月",
    "Recharge": "恢复精力",

    "Hidden Power Bug": "觉醒力量-虫",
    "Hidden Power Dark": "觉醒力量-恶",
    "Hidden Power Dragon": "觉醒力量-龙",
    "Hidden Power Electric": "觉醒力量-电",
    "Hidden Power Fairy": "觉醒力量-妖精",
    "Hidden Power Fighting": "觉醒力量-格斗",
    "Hidden Power Fire": "觉醒力量-火",
    "Hidden Power Flying": "觉醒力量-飞行",
    "Hidden Power Ghost": "觉醒力量-幽灵",
    "Hidden Power Grass": "觉醒力量-草",
    "Hidden Power Ground": "觉醒力量-地面",
    "Hidden Power Ice": "觉醒力量-冰",
    "Hidden Power Poison": "觉醒力量-毒",
    "Hidden Power Psychic": "觉醒力量-超能力",
    "Hidden Power Rock": "觉醒力量-岩石",
    "Hidden Power Steel": "觉醒力量-钢",
    "Hidden Power Water": "觉醒力量-水",

    "Z-Power": "Z-招式",
    "Z-Swords Dance": "Z-剑舞",
    "Z-Whirlwind": "Z-吹飞",
    "Z-Sand Attack": "Z-泼沙",
    "Z-Tail Whip": "Z-摇尾巴",
    "Z-Leer": "Z-瞪眼",
    "Z-Growl": "Z-叫声",
    "Z-Roar": "Z-吼叫",
    "Z-Sing": "Z-唱歌",
    "Z-Supersonic": "Z-超音波",
    "Z-Mist": "Z-白雾",
    "Z-Leech Seed": "Z-寄生种子",
    "Z-Growth": "Z-生长",
    "Z-Poison Powder": "Z-毒粉",
    "Z-Stun Spore": "Z-麻痹粉",
    "Z-Sleep Powder": "Z-催眠粉",
    "Z-String Shot": "Z-吐丝",
    "Z-Thunder Wave": "Z-电磁波",
    "Z-Toxic": "Z-剧毒",
    "Z-Hypnosis": "Z-催眠术",
    "Z-Meditate": "Z-瑜伽姿势",
    "Z-Agility": "Z-高速移动",
    "Z-Teleport": "Z-瞬间移动",
    "Z-Mimic": "Z-模仿",
    "Z-Screech": "Z-刺耳声",
    "Z-Double Team": "Z-影子分身",
    "Z-Recover": "Z-自我再生",
    "Z-Harden": "Z-变硬",
    "Z-Minimize": "Z-变小",
    "Z-Smokescreen": "Z-烟幕",
    "Z-Confuse Ray": "Z-奇异之光",
    "Z-Withdraw": "Z-缩入壳中",
    "Z-Defense Curl": "Z-变圆",
    "Z-Barrier": "Z-屏障",
    "Z-Light Screen": "Z-光墙",
    "Z-Haze": "Z-黑雾",
    "Z-Reflect": "Z-反射壁",
    "Z-Focus Energy": "Z-聚气",
    "Z-Metronome": "Z-挥指",
    "Z-Mirror Move": "Z-鹦鹉学舌",
    "Z-Smog": "Z-浊雾",
    "Z-Amnesia": "Z-瞬间失忆",
    "Z-Kinesis": "Z-折弯汤匙",
    "Z-Soft-Boiled": "Z-生蛋",
    "Z-Glare": "Z-大蛇瞪眼",
    "Z-Poison Gas": "Z-毒瓦斯",
    "Z-Lovely Kiss": "Z-恶魔之吻",
    "Z-Transform": "Z-变身",
    "Z-Spore": "Z-蘑菇孢子",
    "Z-Flash": "Z-闪光",
    "Z-Splash": "Z-跃起",
    "Z-Acid Armor": "Z-溶化",
    "Z-Rest": "Z-睡觉",
    "Z-Sharpen": "Z-棱角化",
    "Z-Conversion": "Z-纹理",
    "Z-Substitute": "Z-替身",
    "Z-Sketch": "Z-写生",
    "Z-Spider Web": "Z-蛛网",
    "Z-Mind Reader": "Z-心之眼",
    "Z-Nightmare": "Z-恶梦",
    "Z-Curse": "Z-诅咒",
    "Z-Conversion 2": "Z-纹理2",
    "Z-Cotton Spore": "Z-棉孢子",
    "Z-Spite": "Z-怨恨",
    "Z-Protect": "Z-守住",
    "Z-Scary Face": "Z-鬼面",
    "Z-Sweet Kiss": "Z-天使之吻",
    "Z-Belly Drum": "Z-腹鼓",
    "Z-Spikes": "Z-撒菱",
    "Z-Foresight": "Z-识破",
    "Z-Destiny Bond": "Z-同命",
    "Z-Perish Song": "Z-灭亡之歌",
    "Z-Detect": "Z-看穿",
    "Z-Lock-On": "Z-锁定",
    "Z-Sandstorm": "Z-沙暴",
    "Z-Endure": "Z-挺住",
    "Z-Charm": "Z-撒娇",
    "Z-Swagger": "Z-虚张声势",
    "Z-Milk Drink": "Z-喝牛奶",
    "Z-Mean Look": "Z-黑色目光",
    "Z-Attract": "Z-迷人",
    "Z-Sleep Talk": "Z-梦话",
    "Z-Heal Bell": "Z-治愈铃声",
    "Z-Present": "Z-礼物",
    "Z-Safeguard": "Z-神秘守护",
    "Z-Pain Split": "Z-分担痛楚",
    "Z-Baton Pass": "Z-接棒",
    "Z-Encore": "Z-再来一次",
    "Z-Sweet Scent": "Z-甜甜香气",
    "Z-Morning Sun": "Z-晨光",
    "Z-Synthesis": "Z-光合作用",
    "Z-Moonlight": "Z-月光",
    "Z-Rain Dance": "Z-求雨",
    "Z-Sunny Day": "Z-大晴天",
    "Z-Psych Up": "Z-自我暗示",
    "Z-Stockpile": "Z-蓄力",
    "Z-Swallow": "Z-吞下",
    "Z-Torment": "Z-无理取闹",
    "Z-Flatter": "Z-吹捧",
    "Z-Will-O-Wisp": "Z-鬼火",
    "Z-Memento": "Z-临别礼物",
    "Z-Smelling Salts": "Z-清醒",
    "Z-Follow Me": "Z-看我嘛",
    "Z-Nature Power": "Z-自然之力",
    "Z-Charge": "Z-充电",
    "Z-Taunt": "Z-挑衅",
    "Z-Helping Hand": "Z-帮助",
    "Z-Trick": "Z-戏法",
    "Z-Role Play": "Z-扮演",
    "Z-Wish": "Z-祈愿",
    "Z-Assist": "Z-借助",
    "Z-Ingrain": "Z-扎根",
    "Z-Magic Coat": "Z-魔法反射",
    "Z-Recycle": "Z-回收利用",
    "Z-Yawn": "Z-哈欠",
    "Z-Skill Swap": "Z-特性互换",
    "Z-Imprison": "Z-封印",
    "Z-Refresh": "Z-焕然一新",
    "Z-Grudge": "Z-怨念",
    "Z-Snatch": "Z-抢夺",
    "Z-Camouflage": "Z-保护色",
    "Z-Tail Glow": "Z-萤火",
    "Z-Feather Dance": "Z-羽毛舞",
    "Z-Teeter Dance": "Z-摇晃舞",
    "Z-Mud Sport": "Z-玩泥巴",
    "Z-Slack Off": "Z-偷懒",
    "Z-Aromatherapy": "Z-芳香治疗",
    "Z-Fake Tears": "Z-假哭",
    "Z-Odor Sleuth": "Z-气味侦测",
    "Z-Metal Sound": "Z-金属音",
    "Z-Grass Whistle": "Z-草笛",
    "Z-Tickle": "Z-挠痒",
    "Z-Cosmic Power": "Z-宇宙力量",
    "Z-Iron Defense": "Z-铁壁",
    "Z-Block": "Z-挡路",
    "Z-Howl": "Z-长嚎",
    "Z-Bulk Up": "Z-健美",
    "Z-Covet": "Z-渴望",
    "Z-Water Sport": "Z-玩水",
    "Z-Calm Mind": "Z-冥想",
    "Z-Dragon Dance": "Z-龙之舞",
    "Z-Roost": "Z-羽栖",
    "Z-Gravity": "Z-重力",
    "Z-Miracle Eye": "Z-奇迹之眼",
    "Z-Healing Wish": "Z-治愈之愿",
    "Z-Tailwind": "Z-顺风",
    "Z-Acupressure": "Z-点穴",
    "Z-Embargo": "Z-查封",
    "Z-Psycho Shift": "Z-精神转移",
    "Z-Heal Block": "Z-回复封锁",
    "Z-Power Trick": "Z-力量戏法",
    "Z-Gastro Acid": "Z-胃液",
    "Z-Lucky Chant": "Z-幸运咒语",
    "Z-Me First": "Z-抢先一步",
    "Z-Copycat": "Z-仿效",
    "Z-Power Swap": "Z-力量互换",
    "Z-Guard Swap": "Z-防守互换",
    "Z-Worry Seed": "Z-烦恼种子",
    "Z-Toxic Spikes": "Z-毒菱",
    "Z-Heart Swap": "Z-心灵互换",
    "Z-Aqua Ring": "Z-水流环",
    "Z-Magnet Rise": "Z-电磁飘浮",
    "Z-Switcheroo": "Z-掉包",
    "Z-Nasty Plot": "Z-诡计",
    "Z-Defog": "Z-清除浓雾",
    "Z-Trick Room": "Z-戏法空间",
    "Z-Captivate": "Z-诱惑",
    "Z-Stealth Rock": "Z-隐形岩",
    "Z-Defend Order": "Z-防御指令",
    "Z-Heal Order": "Z-回复指令",
    "Z-Lunar Dance": "Z-新月舞",
    "Z-Dark Void": "Z-暗黑洞",
    "Z-Hone Claws": "Z-磨爪",
    "Z-Wide Guard": "Z-广域防守",
    "Z-Guard Split": "Z-防守平分",
    "Z-Power Split": "Z-力量平分",
    "Z-Wonder Room": "Z-奇妙空间",
    "Z-Autotomize": "Z-身体轻量化",
    "Z-Rage Powder": "Z-愤怒粉",
    "Z-Telekinesis": "Z-意念移物",
    "Z-Magic Room": "Z-魔法空间",
    "Z-Quiver Dance": "Z-蝶舞",
    "Z-Soak": "Z-浸水",
    "Z-Coil": "Z-盘蜷",
    "Z-Simple Beam": "Z-单纯光束",
    "Z-Entrainment": "Z-找伙伴",
    "Z-After You": "Z-您先请",
    "Z-Quick Guard": "Z-快速防守",
    "Z-Ally Switch": "Z-交换场地",
    "Z-Shell Smash": "Z-破壳",
    "Z-Heal Pulse": "Z-治愈波动",
    "Z-Shift Gear": "Z-换档",
    "Z-Quash": "Z-延后",
    "Z-Reflect Type": "Z-镜面属性",
    "Z-Bestow": "Z-传递礼物",
    "Z-Work Up": "Z-自我激励",
    "Z-Cotton Guard": "Z-棉花防守",
    "Z-Mat Block": "Z-掀榻榻米",
    "Z-Rototiller": "Z-耕地",
    "Z-Sticky Web": "Z-黏黏网",
    "Z-Trick-or-Treat": "Z-万圣夜",
    "Z-Noble Roar": "Z-战吼",
    "Z-Ion Deluge": "Z-等离子浴",
    "Z-Forest's Curse": "Z-森林诅咒",
    "Z-Parting Shot": "Z-抛下狠话",
    "Z-Topsy-Turvy": "Z-颠倒",
    "Z-Crafty Shield": "Z-戏法防守",
    "Z-Flower Shield": "Z-鲜花防守",
    "Z-Grassy Terrain": "Z-青草场地",
    "Z-Misty Terrain": "Z-薄雾场地",
    "Z-Electrify": "Z-输电",
    "Z-Fairy Lock": "Z-妖精之锁",
    "Z-King's Shield": "Z-王者盾牌",
    "Z-Play Nice": "Z-和睦相处",
    "Z-Confide": "Z-密语",
    "Z-Spiky Shield": "Z-尖刺防守",
    "Z-Aromatic Mist": "Z-芳香薄雾",
    "Z-Eerie Impulse": "Z-怪异电波",
    "Z-Venom Drench": "Z-毒液陷阱",
    "Z-Powder": "Z-粉尘",
    "Z-Geomancy": "Z-大地掌控",
    "Z-Magnetic Flux": "Z-磁场操控",
    "Z-Happy Hour": "Z-欢乐时光",
    "Z-Electric Terrain": "Z-电气场地",
    "Z-Celebrate": "Z-庆祝",
    "Z-Hold Hands": "Z-牵手",
    "Z-Baby-Doll Eyes": "Z-圆瞳",
    "Z-Shore Up": "Z-集沙",
    "Z-Baneful Bunker": "Z-碉堡",
    "Z-Floral Healing": "Z-花疗",
    "Z-Spotlight": "Z-聚光灯",
    "Z-Toxic Thread": "Z-毒丝",
    "Z-Laser Focus": "Z-磨砺",
    "Z-Gear Up": "Z-辅助齿轮",
    "Z-Psychic Terrain": "Z-精神场地",
    "Z-Speed Swap": "Z-速度互换",
    "Z-Purify": "Z-净化",
    "Z-Instruct": "Z-号令",
    "Z-Aurora Veil": "Z-极光幕",
    "Z-Tearful Look": "Z-泪眼汪汪",
    "Z-Stuff Cheeks": "Z-大快朵颐",
    "Z-No Retreat": "Z-背水一战",
    "Z-Tar Shot": "Z-沥青射击",
    "Z-Magic Powder": "Z-魔法粉",
    "Z-Teatime": "Z-茶会",
    "Z-Octolock": "Z-蛸固",
    "Z-Court Change": "Z-换场",
    "Z-Clangorous Soul": "Z-魂舞烈音爆",
    "Z-Decorate": "Z-装饰",
    "Z-Life Dew": "Z-生命水滴",
    "Z-Obstruct": "Z-拦堵",
    "Z-Jungle Healing": "Z-丛林治疗",
    "Z-Coaching": "Z-指导",
    "Z-Chilly Reception": "Z-冷笑话",
    "Z-Doodle": "Z-描绘",
    "Z-Fillet Away": "Z-甩肉",
    "Z-Lunar Blessing": "Z-新月祈祷",
    "Z-Power Shift": "Z-力量转换",
    "Z-Revival Blessing": "Z-复生祈祷",
    "Z-Shed Tail": "Z-断尾",
    "Z-Shelter": "Z-闭关",
    "Z-Silk Trap": "Z-线阱",
    "Z-Snowscape": "Z-雪景",
    "Z-Spicy Extract": "Z-辣椒精华",
    "Z-Take Heart": "Z-勇气填充",
    "Z-Tidy Up": "Z-大扫除",
    "Z-Victory Dance": "Z-胜利之舞",
    "Z-Dragon Cheer": "Z-龙声鼓舞",
    "Z-Burning Bulwark": "Z-火焰守护",
    "Z-Disable": "Z-定身法",




    //  超极巨招式

    "G-Max Wildfire": "超极巨地狱灭焰",
    "G-Max Vine Lash": "超极巨灰飞鞭灭",
    "G-Max Cannonade": "超极巨水炮轰灭",
    "G-Max Befuddle": "超极巨蝶影蛊惑",
    "G-Max Volt Crash": "超极巨万雷轰顶",
    "G-Max Gold Rush": "超极巨特大金币",
    "G-Max Chi Strike": "超极巨会心一击",
    "G-Max Terror": "超极巨幻影幽魂",
    "G-Max Foam Burst": "超极巨激漩泡涡",
    "G-Max Resonance": "超极巨极光旋律",
    "G-Max Cuddle": "超极巨热情拥抱",
    "G-Max Replenish": "超极巨资源再生",
    "G-Max Malodor": "超极巨臭气冲天",
    "G-Max Meltdown": "超极巨液金熔击",
    "G-Max Wind Rage": "超极巨旋风袭卷",
    "G-Max Gravitas": "超极巨天道七星",
    "G-Max Stonesurge": "超极巨岩阵以待",
    "G-Max Volcalith": "超极巨炎石喷发",
    "G-Max Tartness": "超极巨酸不溜丢",
    "G-Max Sweetness": "超极巨琼浆玉液",
    "G-Max Sandblast": "超极巨沙尘漫天",
    "G-Max Centiferno": "超极巨百火焚野",
    "G-Max Smite": "超极巨天谴雷诛",
    "G-Max Snooze": "超极巨睡魔降临",
    "G-Max Finale": "超极巨幸福圆满",
    "G-Max Steelsurge": "超极巨钢铁阵法",
    "G-Max Depletion": "超极巨劣化衰变",
    "G-Max Stun Shock": "超极巨异毒电场",
    "G-Max One Blow": "超极巨夺命一击",
    "G-Max Rapid Flow": "超极巨流水连击",
    "G-Max Fireball": "超极巨破阵火球",
    "G-Max Drum Solo": "超极巨狂擂乱打",
    "G-Max Hydrosnipe": "超极巨狙击神射",



    //   前代道具


    "Gold Berry": "黄金果",
    "PRZ Cure Berry": "解麻果",
    "PSN Cure Berry": "解毒果",
    "Bitter Berry": "苦味果",
    "Burnt Berry": "烧灼果",
    "Ice Berry": "冻结果",
    "Mint Berry": "薄荷果",
    "Miracle Berry": "奇迹果",
    "Mystery Berry": "怪异果",
    "Pink Bow": "粉红色丝带",
    "Polkadot Bow": "水玉色之带",
    "Berserk Gene": "破坏基因",






    //  道具

    "Items": "对战用道具",
    "Popular items": "常用道具",
    "Pokemon-specific items": "特定宝可梦使用的道具",
    "Usually useless items": "多数情况无用的道具",
    "Useless items": "无对战用途道具",
    "Mail": "邮件",
    "Never-Melt Ice": "不融冰",
    "King's Rock": "王者之证",
    "Poke Ball": "精灵球",
    "Stick": "大葱",
    "Heavy-Duty Boots": "厚底靴",
    "Leek": "大葱",
    "Ability Shield": "特性护具",
    "Auspicious Armor": "庆祝之铠",
    "Booster Energy": "驱劲能量",
    "Clear Amulet": "清净坠饰",
    "Covert Cloak": "密探斗篷",
    "Loaded Dice": "机变骰子",
    "Malicious Armor": "咒术之铠",
    "Fairy Feather": "妖精之羽",
    "Big Nugget": "巨大金珠",
    "Metal Alloy": "复合金属",
    "Masterpiece Teacup": "杰作茶碗",
    "Unremarkable Teacup": "凡作茶碗",
    "Adamant Crystal": "大金刚宝玉",
    "Lustrous Globe": "大白宝玉",
    "Griseous Core": "大白金宝玉",
    "Cornerstone Mask": "础石面具",
    "Wellspring Mask": "水井面具",
    "Hearthflame Mask": "火灶面具",
    "Syrupy Apple": "蜜汁苹果",
    "Mirror Herb": "模仿香草",
    "Punching Glove": "拳击手套",
    "Abomasite": "暴雪王进化石",
    "Absolite": "阿勃梭鲁进化石",
    "Absorb Bulb": "球根",
    "Adamant Orb": "金刚宝珠",
    "Adrenaline Orb": "胆怯球",
    "Aerodactylite": "化石翼龙进化石",
    "Aggronite": "波士可多拉进化石",
    "Aguav Berry": "乐芭果",
    "Air Balloon": "气球",
    "Alakazite": "胡地进化石",
    "Aloraichium Z": "阿罗雷Z",
    "Altarianite": "七夕青鸟进化石",
    "Ampharosite": "电龙进化石",
    "Apicot Berry": "杏仔果",
    "Armor Fossil": "盾甲化石",
    "Aspear Berry": "利木果",
    "Assault Vest": "突击背心",
    "Audinite": "差不多娃娃进化石",
    "Babiri Berry": "霹霹果",
    "Banettite": "诅咒娃娃进化石",
    "Beast Ball": "究极球",
    "Beedrillite": "大针蜂进化石",
    "Belue Berry": "靛莓果",
    "Berry Juice": "树果汁",
    "Berry Sweet": "野莓糖饰",
    "Big Root": "大根茎",
    "Binding Band": "紧绑束带",
    "Black Belt": "黑带",
    "Black Sludge": "黑色污泥",
    "Black Glasses": "黑色眼镜",
    "Blastoisinite": "水箭龟进化石",
    "Blazikenite": "火焰鸡进化石",
    "Blue Orb": "靛蓝色宝珠",
    "Bluk Berry": "墨莓果",
    "Blunder Policy": "打空保险",
    "Bottle Cap": "银色王冠",
    "Bright Powder": "光粉",
    "Bug Gem": "虫之宝石",
    "Bug Memory": "虫子存储碟",
    "Buginium Z": "虫Z",
    "Burn Drive": "火焰卡带",
    "Cameruptite": "喷火驼进化石",
    "Cell Battery": "充电电池",
    "Charcoal": "木炭",
    "Charizardite X": "喷火龙进化石X",
    "Charizardite Y": "喷火龙进化石Y",
    "Charti Berry": "草蚕果",
    "Cheri Berry": "樱子果",
    "Cherish Ball": "贵重球",
    "Chesto Berry": "零余果",
    "Chilan Berry": "灯浆果",
    "Chill Drive": "冰冻卡带",
    "Chipped Pot": "缺损的茶壶",
    "Choice Band": "讲究头带",
    "Choice Scarf": "讲究围巾",
    "Choice Specs": "讲究眼镜",
    "Chople Berry": "莲蒲果",
    "Claw Fossil": "爪子化石",
    "Clover Sweet": "幸运草糖饰",
    "Coba Berry": "棱瓜果",
    "Colbur Berry": "刺耳果",
    "Cornn Berry": "玉黍果",
    "Cover Fossil": "背盖化石",
    "Cracked Pot": "破裂的茶壶",
    "Custap Berry": "释陀果",
    "Damp Rock": "潮湿岩石",
    "Dark Gem": "恶之宝石",
    "Dark Memory": "黑暗存储碟",
    "Darkinium Z": "恶Z",
    "Dawn Stone": "觉醒之石",
    "Decidium Z": "狙射树枭Z",
    "Deep Sea Scale": "深海鳞片",
    "Deep Sea Tooth": "深海之牙",
    "Destiny Knot": "红线",
    "Diancite": "蒂安希进化石",
    "Dive Ball": "潜水球",
    "Dome Fossil": "甲壳化石",
    "Douse Drive": "水流卡带",
    "Draco Plate": "龙之石板",
    "Dragon Fang": "龙之牙",
    "Dragon Gem": "龙之宝石",
    "Dragon Memory": "龙存储碟",
    "Dragon Scale": "龙之鳞片",
    "Dragonium Z": "龙Z",
    "Dread Plate": "恶颜石板",
    "Dream Ball": "梦境球",
    "Dubious Disc": "可疑补丁",
    "Durin Berry": "金枕果",
    "Dusk Ball": "黑暗球",
    "Dusk Stone": "暗之石",
    "Earth Plate": "大地石板",
    "Eevium Z": "伊布Z",
    "Eject Button": "逃脱按键",
    "Eject Pack": "避难背包",
    "Electirizer": "电力增幅器",
    "Electric Gem": "电之宝石",
    "Electric Memory": "电子存储碟",
    "Electric Seed": "电气种子",
    "Electrium Z": "电Z",
    "Energy Powder": "元气粉",
    "Enigma Berry": "谜芝果",
    "Eviolite": "进化奇石",
    "Expert Belt": "达人带",
    "Fairium Z": "妖精Z",
    "Fairy Gem": "妖精宝石",
    "Fairy Memory": "妖精存储碟",
    "Fast Ball": "速度球",
    "Fighting Gem": "格斗宝石",
    "Fighting Memory": "战斗存储碟",
    "Fightinium Z": "格斗Z",
    "Figy Berry": "勿花果",
    "Fire Gem": "火之宝石",
    "Fire Memory": "火焰存储碟",
    "Fire Stone": "火之石",
    "Firium Z": "火Z",
    "Fist Plate": "拳头石板",
    "Flame Orb": "火焰宝珠",
    "Flame Plate": "火球石板",
    "Float Stone": "轻石",
    "Flower Sweet": "花朵糖饰",
    "Flying Gem": "飞行宝石",
    "Flying Memory": "飞翔存储碟",
    "Flyinium Z": "飞行Z",
    "Focus Band": "气势头带",
    "Focus Sash": "气势披带",
    "Fossilized Bird": "化石鸟",
    "Fossilized Dino": "化石海兽",
    "Fossilized Drake": "化石龙",
    "Fossilized Fish": "化石鱼",
    "Friend Ball": "友友球",
    "Full Incense": "饱腹薰香",
    "Galladite": "艾路雷朵进化石",
    "Ganlon Berry": "龙睛果",
    "Garchompite": "烈咬陆鲨进化石",
    "Gardevoirite": "沙奈朵进化石",
    "Gengarite": "耿鬼进化石",
    "Ghost Gem": "幽灵宝石",
    "Ghost Memory": "幽灵存储碟",
    "Ghostium Z": "幽灵Z",
    "Glalitite": "冰鬼护进化石",
    "Gold Bottle Cap": "金色王冠",
    "Grass Gem": "草之宝石",
    "Grass Memory": "青草存储碟",
    "Grassium Z": "草Z",
    "Grassy Seed": "青草种子",
    "Great Ball": "超级球",
    "Grepa Berry": "萄葡果",
    "Grip Claw": "紧缠钩爪",
    "Griseous Orb": "白金宝珠",
    "Ground Gem": "地面宝石",
    "Ground Memory": "大地存储碟",
    "Groundium Z": "地面Z",
    "Gyaradosite": "暴鲤龙进化石",
    "Haban Berry": "莓榴果",
    "Hard Stone": "硬石头",
    "Heal Ball": "治愈球",
    "Heat Rock": "炽热岩石",
    "Heavy Ball": "沉重球",
    "Helix Fossil": "贝壳化石",
    "Heracronite": "赫拉克罗斯进化石",
    "Hondew Berry": "哈密果",
    "Houndoominite": "黑鲁加进化石",
    "Iapapa Berry": "芭亚果",
    "Ice Gem": "冰之宝石",
    "Ice Memory": "冰雪存储碟",
    "Ice Stone": "冰之石",
    "Icicle Plate": "冰柱石板",
    "Icium Z": "冰Z",
    "Icy Rock": "冰冷岩石",
    "Incinium Z": "炽焰咆哮虎Z",
    "Insect Plate": "玉虫石板",
    "Iron Ball": "黑色铁球",
    "Iron Plate": "钢铁石板",
    "Jaboca Berry": "嘉珍果",
    "Jaw Fossil": "颚之化石",
    "Kasib Berry": "佛柑果",
    "Kebia Berry": "通通果",
    "Kee Berry": "亚开果",
    "Kelpsy Berry": "藻根果",
    "Kangaskhanite": "袋兽进化石",
    "Kommonium Z": "杖尾鳞甲龙Z",
    "Lagging Tail": "后攻之尾",
    "Lansat Berry": "兰萨果",
    "Latiasite": "拉帝亚斯进化石",
    "Latiosite": "拉帝欧斯进化石",
    "Lax Incense": "悠闲薰香",
    "Leaf Stone": "叶之石",
    "Leftovers": "吃剩的东西",
    "Leppa Berry": "苹野果",
    "Level Ball": "等级球",
    "Liechi Berry": "枝荔果",
    "Life Orb": "生命宝珠",
    "Light Ball": "电气球",
    "Light Clay": "光之黏土",
    "Lopunnite": "长耳兔进化石",
    "Love Ball": "甜蜜球",
    "Love Sweet": "爱心糖饰",
    "Lucarionite": "路卡利欧进化石",
    "Lucky Punch": "吉利拳",
    "Lum Berry": "木子果",
    "Luminous Moss": "光苔",
    "BrightPowder": "光粉",
    "SilverPowder": "银粉",
    "Lunalium Z": "露奈雅拉Z",
    "Lure Ball": "诱饵球",
    "Lustrous Orb": "白玉宝珠",
    "Luxury Ball": "豪华球",
    "Lycanium Z": "鬃岩狼人Z",
    "Macho Brace": "强制锻炼器",
    "Magmarizer": "熔岩增幅器",
    "Magnet": "磁铁",
    "Mago Berry": "芒芒果",
    "Magost Berry": "岳竹果",
    "Manectite": "雷电兽进化石",
    "Maranga Berry": "香罗果",
    "Marshadium Z": "玛夏多Z",
    "Master Ball": "大师球",
    "Mawilite": "大嘴娃进化石",
    "Meadow Plate": "碧绿石板",
    "Medichamite": "恰雷姆进化石",
    "Mental Herb": "心灵香草",
    "Metagrossite": "巨金怪进化石",
    "Metal Coat": "金属膜",
    "Metal Powder": "金属粉",
    "Metronome": "节拍器",
    "Mewnium Z": "梦幻Z",
    "Mewtwonite X": "超梦进化石X",
    "Mewtwonite Y": "超梦进化石Y",
    "Micle Berry": "奇秘果",
    "Mimikium Z": "谜拟QZ",
    "Mind Plate": "神奇石板",
    "Miracle Seed": "奇迹种子",
    "Misty Seed": "薄雾种子",
    "Moon Ball": "月亮球",
    "Moon Stone": "月之石",
    "Muscle Band": "力量头带",
    "Mystic Water": "神秘水滴",
    "Nanab Berry": "蕉香果",
    "Nest Ball": "巢穴球",
    "Net Ball": "捕网球",
    "Nomel Berry": "檬柠果",
    "Normal Gem": "一般宝石",
    "Normalium Z": "一般Z",
    "Occa Berry": "巧可果",
    "Odd Incense": "奇异薰香",
    "Old Amber": "秘密琥珀",
    "Oran Berry": "橙橙果",
    "Oval Stone": "浑圆之石",
    "Pamtre Berry": "椰木果",
    "Park Ball": "公园球",
    "Passho Berry": "千香果",
    "Payapa Berry": "福禄果",
    "Pecha Berry": "桃桃果",
    "Persim Berry": "柿仔果",
    "Petaya Berry": "龙火果",
    "Pidgeotite": "大比鸟进化石",
    "Pikanium Z": "皮卡丘Z",
    "Pikashunium Z": "智皮卡Z",
    "Pinap Berry": "凰梨果",
    "Pinsirite": "凯罗斯进化石",
    "Pixie Plate": "妖精石板",
    "Plume Fossil": "羽毛化石",
    "Poison Barb": "毒针",
    "Poison Gem": "毒之宝石",
    "Poison Memory": "毒存储碟",
    "Poisonium Z": "毒Z",
    "Pomeg Berry": "榴石果",
    "Power Anklet": "力量护踝",
    "Power Band": "力量束带",
    "Power Belt": "力量腰带",
    "Power Bracer": "力量护腕",
    "Power Herb": "强力香草",
    "Power Lens": "力量镜",
    "Power Weight": "力量负重",
    "Premier Ball": "纪念球",
    "Primarium Z": "西狮海壬Z",
    "Prism Scale": "美丽鳞片",
    "Protective Pads": "部位护具",
    "Protector": "护具",
    "Psychic Gem": "超能力宝石",
    "Psychic Memory": "精神存储碟",
    "Psychic Seed": "精神种子",
    "Psychium Z": "超能力Z",
    "Qualot Berry": "比巴果",
    "Quick Ball": "先机球",
    "Quick Claw": "先制之爪",
    "Quick Powder": "速度粉",
    "Rabuta Berry": "茸丹果",
    "Rare Bone": "贵重骨头",
    "Rawst Berry": "莓莓果",
    "Razor Claw": "锐利之爪",
    "Razor Fang": "锐利之牙",
    "Razz Berry": "蔓莓果",
    "Reaper Cloth": "灵界之布",
    "Red Card": "红牌",
    "Red Orb": "朱红色宝珠",
    "Repeat Ball": "重复球",
    "Ribbon Sweet": "蝴蝶结糖饰",
    "Rindo Berry": "罗子果",
    "Ring Target": "标靶",
    "Rock Gem": "岩石宝石",
    "Rock Incense": "岩石薰香",
    "Rock Memory": "岩石存储碟",
    "Rockium Z": "岩石Z",
    "Rocky Helmet": "凸凸头盔",
    "Room Service": "客房服务",
    "Root Fossil": "根状化石",
    "Rose Incense": "花朵薰香",
    "Roseli Berry": "洛玫果",
    "Rowap Berry": "雾莲果",
    "Rusted Shield": "腐朽的盾",
    "Rusted Sword": "腐朽的剑",
    "Sablenite": "勾魂眼进化石",
    "Sachet": "香袋",
    "Safari Ball": "狩猎球",
    "Safety Goggles": "防尘护目镜",
    "Sail Fossil": "鳍之化石",
    "Salac Berry": "沙鳞果",
    "Salamencite": "暴飞龙进化石",
    "Sceptilite": "蜥蜴王进化石",
    "Scizorite": "巨钳螳螂进化石",
    "Scope Lens": "焦点镜",
    "Sea Incense": "海潮薰香",
    "Sharp Beak": "锐利鸟嘴",
    "Sharpedonite": "巨牙鲨进化石",
    "Shed Shell": "美丽空壳",
    "Shell Bell": "贝壳之铃",
    "Shiny Stone": "光之石",
    "Shock Drive": "闪电卡带",
    "Shuca Berry": "腰木果",
    "Silk Scarf": "丝绸围巾",
    "Silver Powder": "银粉",
    "Sitrus Berry": "文柚果",
    "Skull Fossil": "头盖化石",
    "Sky Plate": "蓝天石板",
    "Slowbronite": "呆壳兽进化石",
    "Smooth Rock": "沙沙岩石",
    "Snorlium Z": "卡比兽Z",
    "Snowball": "雪球",
    "Soft Sand": "柔软沙子",
    "Solganium Z": "索尔迦雷欧Z",
    "Soul Dew": "心之水滴",
    "Spell Tag": "诅咒之符",
    "Spelon Berry": "刺角果",
    "Splash Plate": "水滴石板",
    "Spooky Plate": "妖怪石板",
    "Sport Ball": "竞赛球",
    "Starf Berry": "星桃果",
    "Star Sweet": "星星糖饰",
    "Steelixite": "大钢蛇进化石",
    "Steel Gem": "钢之宝石",
    "Steel Memory": "钢铁存储碟",
    "Steelium Z": "钢Z",
    "Sticky Barb": "附着针",
    "Stone Plate": "岩石石板",
    "Strawberry Sweet": "草莓糖饰",
    "Sun Stone": "日之石",
    "Swampertite": "巨沼怪进化石",
    "Sweet Apple": "甜甜苹果",
    "Tamato Berry": "茄番果",
    "Tanga Berry": "扁樱果",
    "Tapunium Z": "卡璞Z",
    "Tart Apple": "酸酸苹果",
    "Terrain Extender": "大地膜",
    "Thick Club": "粗骨头",
    "Throat Spray": "爽喉喷雾",
    "Thunder Stone": "雷之石",
    "Timer Ball": "计时球",
    "Toxic Orb": "剧毒宝珠",
    "Toxic Plate": "剧毒石板",
    "Twisted Spoon": "弯曲的汤匙",
    "Tyranitarite": "班基拉斯进化石",
    "Ultra Ball": "高级球",
    "Ultranecrozium Z": "究极奈克洛Z",
    "Up-Grade": "升级数据",
    "Utility Umbrella": "万能伞",
    "Venusaurite": "妙蛙花进化石",
    "Wacan Berry": "烛木果",
    "Water Gem": "水之宝石",
    "Water Memory": "清水存储碟",
    "Water Stone": "水之石",
    "Waterium Z": "水Z",
    "Watmel Berry": "瓜西果",
    "Wave Incense": "涟漪薰香",
    "Weakness Policy": "弱点保险",
    "Wepear Berry": "西梨果",
    "Whipped Dream": "泡沫奶油",
    "White Herb": "白色香草",
    "Wide Lens": "广角镜",
    "Wiki Berry": "异奇果",
    "Wise Glasses": "博识眼镜",
    "Yache Berry": "番荔果",
    "Zap Plate": "雷电石板",
    "Zoom Lens": "对焦镜",
    "SilverPowder": "银粉",
    "Galarica Wreath": "伽勒豆蔻花圈",
    "Galarica Cuff": "伽勒豆蔻手环",
    "Strange Ball": "奇异球",

    //  宝可梦

    "Pokemon": "宝可梦",

    "Bulbasaur": "妙蛙种子",
    "Ivysaur": "妙蛙草",
    "Venusaur": "妙蛙花",
    "Charmander": "小火龙",
    "Charmeleon": "火恐龙",
    "Charizard": "喷火龙",
    "Squirtle": "杰尼龟",
    "Wartortle": "卡咪龟",
    "Blastoise": "水箭龟",
    "Caterpie": "绿毛虫",
    "Metapod": "铁甲蛹",
    "Butterfree": "巴大蝶",
    "Weedle": "独角虫",
    "Kakuna": "铁壳蛹",
    "Beedrill": "大针蜂",
    "Pidgey": "波波",
    "Pidgeotto": "比比鸟",
    "Pidgeot": "大比鸟",
    "Rattata": "小拉达",
    "Raticate": "拉达",
    "Spearow": "烈雀",
    "Fearow": "大嘴雀",
    "Ekans": "阿柏蛇",
    "Arbok": "阿柏怪",
    "Pikachu": "皮卡丘",
    "Raichu": "雷丘",
    "Sandshrew": "穿山鼠",
    "Sandslash": "穿山王",
    "Nidoran-F": "尼多兰",
    "Nidorina": "尼多娜",
    "Nidoqueen": "尼多后",
    "Nidoran-M": "尼多朗",
    "Nidorino": "尼多力诺",
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
    "Venomoth": "摩鲁蛾",
    "Diglett": "地鼠",
    "Dugtrio": "三地鼠",
    "Meowth": "喵喵",
    "Persian": "猫老大",
    "Psyduck": "可达鸭",
    "Golduck": "哥达鸭",
    "Mankey": "猴怪",
    "Primeape": "火暴猴",
    "Growlithe": "卡蒂狗",
    "Arcanine": "风速狗",
    "Poliwag": "蚊香蝌蚪",
    "Poliwhirl": "蚊香君",
    "Poliwrath": "蚊香泳士",
    "Abra": "凯西",
    "Kadabra": "勇基拉",
    "Alakazam": "胡地",
    "Machop": "腕力",
    "Machoke": "豪力",
    "Machamp": "怪力",
    "Bellsprout": "喇叭芽",
    "Weepinbell": "口呆花",
    "Victreebel": "大食花",
    "Tentacool": "玛瑙水母",
    "Tentacruel": "毒刺水母",
    "Geodude": "小拳石",
    "Graveler": "隆隆石",
    "Golem": "隆隆岩",
    "Ponyta": "小火马",
    "Rapidash": "烈焰马",
    "Slowpoke-Galar": "呆呆兽-伽勒尔",
    "Slowpoke": "呆呆兽",
    "Slowbro": "呆壳兽",
    "Magnemite": "小磁怪",
    "Magneton": "三合一磁怪",
    "Farfetch’d": "大葱鸭",
    "Doduo": "嘟嘟",
    "Dodrio": "嘟嘟利",
    "Seel": "小海狮",
    "Dewgong": "白海狮",
    "Grimer": "臭泥",
    "Muk": "臭臭泥",
    "Shellder": "大舌贝",
    "Cloyster": "刺甲贝",
    "Gastly": "鬼斯",
    "Haunter": "鬼斯通",
    "Gengar": "耿鬼",
    "Onix": "大岩蛇",
    "Drowzee": "催眠貘",
    "Hypno": "引梦貘人",
    "Krabby": "大钳蟹",
    "Kingler": "巨钳蟹",
    "Voltorb": "霹雳电球",
    "Electrode": "顽皮雷弹",
    "Exeggcute": "蛋蛋",
    "Exeggutor": "椰蛋树",
    "Cubone": "卡拉卡拉",
    "Marowak": "嘎啦嘎啦",
    "Hitmonlee": "飞腿郎",
    "Hitmonchan": "快拳郎",
    "Lickitung": "大舌头",
    "Koffing": "瓦斯弹",
    "Weezing": "双弹瓦斯",
    "Rhyhorn": "独角犀牛",
    "Rhydon": "钻角犀兽",
    "Chansey": "吉利蛋",
    "Tangela": "蔓藤怪",
    "Kangaskhan": "袋兽",
    "Horsea": "墨海马",
    "Seadra": "海刺龙",
    "Goldeen": "角金鱼",
    "Seaking": "金鱼王",
    "Staryu": "海星星",
    "Starmie": "宝石海星",
    "Mr. Mime": "魔墙人偶",
    "Scyther": "飞天螳螂",
    "Jynx": "迷唇姐",
    "Electabuzz": "电击兽",
    "Magmar": "鸭嘴火兽",
    "Pinsir": "凯罗斯",
    "Tauros": "肯泰罗",
    "Magikarp": "鲤鱼王",
    "Gyarados": "暴鲤龙",
    "Lapras": "拉普拉斯",
    "Ditto": "百变怪",
    "Eevee": "伊布",
    "Vaporeon": "水伊布",
    "Jolteon": "雷伊布",
    "Flareon": "火伊布",
    "Omanyte": "菊石兽",
    "Omastar": "多刺菊石兽",
    "Kabuto": "化石盔",
    "Kabutops": "镰刀盔",
    "Aerodactyl": "化石翼龙",
    "Snorlax": "卡比兽",
    "Articuno-Galar": "急冻鸟-伽勒尔",
    "Zapdos-Galar": "闪电鸟-伽勒尔",
    "Moltres-Galar": "火焰鸟-伽勒尔",
    "Articuno": "急冻鸟",
    "Zapdos": "闪电鸟",
    "Moltres": "火焰鸟",
    "Dratini": "迷你龙",
    "Dragonair": "哈克龙",
    "Dragonite": "快龙",
    "Mewtwo": "超梦",
    "Mew": "梦幻",
    "Chikorita": "菊草叶",
    "Bayleef": "月桂叶",
    "Meganium": "大竺葵",
    "Cyndaquil": "火球鼠",
    "Quilava": "火岩鼠",
    "Typhlosion": "火暴兽",
    "Totodile": "小锯鳄",
    "Croconaw": "蓝鳄",
    "Feraligatr": "大力鳄",
    "Sentret": "尾立",
    "Furret": "大尾立",
    "Hoothoot": "咕咕",
    "Noctowl": "猫头夜鹰",
    "Ledyba": "芭瓢虫",
    "Ledian": "安瓢虫",
    "Spinarak": "圆丝蛛",
    "Ariados": "阿利多斯",
    "Crobat": "叉字蝠",
    "Chinchou": "灯笼鱼",
    "Lanturn": "电灯怪",
    "Pichu": "皮丘",
    "Cleffa": "皮宝宝",
    "Igglybuff": "宝宝丁",
    "Togepi": "波克比",
    "Togetic": "波克基古",
    "Natu": "天然雀",
    "Xatu": "天然鸟",
    "Mareep": "咩利羊",
    "Flaaffy": "茸茸羊",
    "Ampharos": "电龙",
    "Bellossom": "美丽花",
    "Marill": "玛力露",
    "Azumarill": "玛力露丽",
    "Sudowoodo": "树才怪",
    "Politoed": "蚊香蛙皇",
    "Hoppip": "毽子草",
    "Skiploom": "毽子花",
    "Jumpluff": "毽子棉",
    "Aipom": "长尾怪手",
    "Sunkern": "向日种子",
    "Sunflora": "向日花怪",
    "Yanma": "蜻蜻蜓",
    "Wooper": "乌波",
    "Quagsire": "沼王",
    "Espeon": "太阳伊布",
    "Umbreon": "月亮伊布",
    "Murkrow": "黑暗鸦",
    "Slowking": "呆呆王",
    "Misdreavus": "梦妖",
    "Unown-A": "未知图腾-A",
    "Unown-B": "未知图腾-B",
    "Unown-C": "未知图腾-C",
    "Unown-D": "未知图腾-D",
    "Unown-E": "未知图腾-E",
    "Unown-F": "未知图腾-F",
    "Unown-G": "未知图腾-G",
    "Unown-H": "未知图腾-H",
    "Unown-I": "未知图腾-I",
    "Unown-J": "未知图腾-J",
    "Unown-K": "未知图腾-K",
    "Unown-L": "未知图腾-L",
    "Unown-N": "未知图腾-N",
    "Unown-M": "未知图腾-M",
    "Unown-O": "未知图腾-O",
    "Unown-P": "未知图腾-P",
    "Unown-Q": "未知图腾-Q",
    "Unown-R": "未知图腾-R",
    "Unown-S": "未知图腾-S",
    "Unown-T": "未知图腾-T",
    "Unown-U": "未知图腾-U",
    "Unown-V": "未知图腾-V",
    "Unown-W": "未知图腾-W",
    "Unown-X": "未知图腾-X",
    "Unown-Y": "未知图腾-Y",
    "Unown-Z": "未知图腾-Z",
    "Unown-Question": "未知图腾-？",
    "Unown-Exclamation": "未知图腾-！",
    "Unown": "未知图腾",
    "Wobbuffet": "果然翁",
    "Girafarig": "麒麟奇",
    "Pineco": "榛果球",
    "Forretress": "佛烈托斯",
    "Dunsparce": "土龙弟弟",
    "Gligar": "天蝎",
    "Steelix": "大钢蛇",
    "Snubbull": "布鲁",
    "Granbull": "布鲁皇",
    "Qwilfish": "千针鱼",
    "Scizor": "巨钳螳螂",
    "Shuckle": "壶壶",
    "Heracross": "赫拉克罗斯",
    "Sneasel": "狃拉",
    "Teddiursa": "熊宝宝",
    "Ursaring": "圈圈熊",
    "Slugma": "熔岩虫",
    "Magcargo": "熔岩蜗牛",
    "Swinub": "小山猪",
    "Piloswine": "长毛猪",
    "Corsola": "太阳珊瑚",
    "Remoraid": "铁炮鱼",
    "Octillery": "章鱼桶",
    "Delibird": "信使鸟",
    "Mantine": "巨翅飞鱼",
    "Skarmory": "盔甲鸟",
    "Houndour": "戴鲁比",
    "Houndoom": "黑鲁加",
    "Kingdra": "刺龙王",
    "Phanpy": "小小象",
    "Donphan": "顿甲",
    "Stantler": "惊角鹿",
    "Smeargle": "图图犬",
    "Tyrogue": "无畏小子",
    "Hitmontop": "战舞郎",
    "Smoochum": "迷唇娃",
    "Elekid": "电击怪",
    "Magby": "鸭嘴宝宝",
    "Miltank": "大奶罐",
    "Blissey": "幸福蛋",
    "Raikou": "雷公",
    "Entei": "炎帝",
    "Suicune": "水君",
    "Larvitar": "幼基拉斯",
    "Pupitar": "沙基拉斯",
    "Tyranitar": "班基拉斯",
    "Lugia": "洛奇亚",
    "Ho-Oh": "凤王",
    "Celebi": "时拉比",
    "Treecko": "木守宫",
    "Grovyle": "森林蜥蜴",
    "Sceptile": "蜥蜴王",
    "Torchic": "火稚鸡",
    "Combusken": "力壮鸡",
    "Blaziken": "火焰鸡",
    "Mudkip": "水跃鱼",
    "Marshtomp": "沼跃鱼",
    "Swampert": "巨沼怪",
    "Poochyena": "土狼犬",
    "Mightyena": "大狼犬",
    "Zigzagoon": "蛇纹熊",
    "Linoone": "直冲熊",
    "Wurmple": "刺尾虫",
    "Silcoon": "甲壳茧",
    "Beautifly": "狩猎凤蝶",
    "Cascoon": "盾甲茧",
    "Dustox": "毒粉蛾",
    "Lotad": "莲叶童子",
    "Lombre": "莲帽小童",
    "Ludicolo": "乐天河童",
    "Seedot": "橡实果",
    "Nuzleaf": "长鼻叶",
    "Shiftry": "狡猾天狗",
    "Taillow": "傲骨燕",
    "Swellow": "大王燕",
    "Wingull": "长翅鸥",
    "Pelipper": "大嘴鸥",
    "Ralts": "拉鲁拉丝",
    "Kirlia": "奇鲁莉安",
    "Gardevoir": "沙奈朵",
    "Surskit": "溜溜糖球",
    "Masquerain": "雨翅蛾",
    "Shroomish": "蘑蘑菇",
    "Breloom": "斗笠菇",
    "Slakoth": "懒人獭",
    "Vigoroth": "过动猿",
    "Slaking": "请假王",
    "Nincada": "土居忍士",
    "Ninjask": "铁面忍者",
    "Shedinja": "脱壳忍者",
    "Whismur": "咕妞妞",
    "Loudred": "吼爆弹",
    "Exploud": "爆音怪",
    "Makuhita": "幕下力士",
    "Hariyama": "铁掌力士",
    "Azurill": "露力丽",
    "Nosepass": "朝北鼻",
    "Skitty": "向尾喵",
    "Delcatty": "优雅猫",
    "Sableye": "勾魂眼",
    "Mawile": "大嘴娃",
    "Aron": "可可多拉",
    "Lairon": "可多拉",
    "Aggron": "波士可多拉",
    "Meditite": "玛沙那",
    "Medicham": "恰雷姆",
    "Electrike": "落雷兽",
    "Manectric": "雷电兽",
    "Plusle": "正电拍拍",
    "Minun": "负电拍拍",
    "Volbeat": "电萤虫",
    "Illumise": "甜甜萤",
    "Roselia": "毒蔷薇",
    "Gulpin": "溶食兽",
    "Swalot": "吞食兽",
    "Carvanha": "利牙鱼",
    "Sharpedo": "巨牙鲨",
    "Wailmer": "吼吼鲸",
    "Wailord": "吼鲸王",
    "Numel": "呆火驼",
    "Camerupt": "喷火驼",
    "Torkoal": "煤炭龟",
    "Spoink": "跳跳猪",
    "Grumpig": "噗噗猪",
    "Spinda": "晃晃斑",
    "Trapinch": "大颚蚁",
    "Vibrava": "超音波幼虫",
    "Flygon": "沙漠蜻蜓",
    "Cacnea": "刺球仙人掌",
    "Cacturne": "梦歌仙人掌",
    "Swablu": "青绵鸟",
    "Altaria": "七夕青鸟",
    "Zangoose": "猫鼬斩",
    "Seviper": "饭匙蛇",
    "Lunatone": "月石",
    "Solrock": "太阳岩",
    "Barboach": "泥泥鳅",
    "Whiscash": "鲶鱼王",
    "Corphish": "龙虾小兵",
    "Crawdaunt": "铁螯龙虾",
    "Baltoy": "天秤偶",
    "Claydol": "念力土偶",
    "Lileep": "触手百合",
    "Cradily": "摇篮百合",
    "Anorith": "太古羽虫",
    "Armaldo": "太古盔甲",
    "Feebas": "丑丑鱼",
    "Milotic": "美纳斯",
    "Castform": "飘浮泡泡",
    "Kecleon": "变隐龙",
    "Shuppet": "怨影娃娃",
    "Banette": "诅咒娃娃",
    "Duskull": "夜巡灵",
    "Dusclops": "彷徨夜灵",
    "Tropius": "热带龙",
    "Chimecho": "风铃铃",
    "Absol": "阿勃梭鲁",
    "Wynaut": "小果然",
    "Snorunt": "雪童子",
    "Glalie": "冰鬼护",
    "Spheal": "海豹球",
    "Sealeo": "海魔狮",
    "Walrein": "帝牙海狮",
    "Clamperl": "珍珠贝",
    "Huntail": "猎斑鱼",
    "Gorebyss": "樱花鱼",
    "Relicanth": "古空棘鱼",
    "Luvdisc": "爱心鱼",
    "Bagon": "宝贝龙",
    "Shelgon": "甲壳龙",
    "Salamence": "暴飞龙",
    "Beldum": "铁哑铃",
    "Metang": "金属怪",
    "Metagross": "巨金怪",
    "Regirock": "雷吉洛克",
    "Regice": "雷吉艾斯",
    "Registeel": "雷吉斯奇鲁",
    "Latias": "拉帝亚斯",
    "Latios": "拉帝欧斯",
    "Kyogre": "盖欧卡",
    "Groudon": "固拉多",
    "Rayquaza": "烈空坐",
    "Jirachi": "基拉祈",
    "Turtwig": "草苗龟",
    "Grotle": "树林龟",
    "Torterra": "土台龟",
    "Chimchar": "小火焰猴",
    "Monferno": "猛火猴",
    "Infernape": "烈焰猴",
    "Piplup": "波加曼",
    "Prinplup": "波皇子",
    "Empoleon": "帝王拿波",
    "Starly": "姆克儿",
    "Staravia": "姆克鸟",
    "Staraptor": "姆克鹰",
    "Bidoof": "大牙狸",
    "Bibarel": "大尾狸",
    "Kricketot": "圆法师",
    "Kricketune": "音箱蟀",
    "Shinx": "小猫怪",
    "Luxio": "勒克猫",
    "Luxray": "伦琴猫",
    "Budew": "含羞苞",
    "Roserade": "罗丝雷朵",
    "Cranidos": "头盖龙",
    "Rampardos": "战槌龙",
    "Shieldon": "盾甲龙",
    "Bastiodon": "护城龙",
    "Burmy": "结草儿",
    "Wormadam": "结草贵妇",
    "Mothim": "绅士蛾",
    "Combee": "三蜜蜂",
    "Vespiquen": "蜂女王",
    "Pachirisu": "帕奇利兹",
    "Buizel": "泳圈鼬",
    "Floatzel": "浮潜鼬",
    "Cherubi": "樱花宝",
    "Cherrim": "樱花儿",
    "Shellos": "无壳海兔",
    "Gastrodon-East": "海兔兽-东海",
    "Gastrodon": "海兔兽",
    "Ambipom": "双尾怪手",
    "Drifloon": "飘飘球",
    "Drifblim": "随风球",
    "Buneary": "卷卷耳",
    "Lopunny": "长耳兔",
    "Mismagius": "梦妖魔",
    "Honchkrow": "乌鸦头头",
    "Glameow": "魅力喵",
    "Purugly": "东施喵",
    "Chingling": "铃铛响",
    "Stunky": "臭鼬噗",
    "Skuntank": "坦克臭鼬",
    "Bronzor": "铜镜怪",
    "Bronzong": "青铜钟",
    "Bonsly": "盆才怪",
    "Mime Jr.": "魔尼尼",
    "Happiny": "小福蛋",
    "Chatot": "聒噪鸟",
    "Spiritomb": "花岩怪",
    "Gible": "圆陆鲨",
    "Gabite": "尖牙陆鲨",
    "Garchomp": "烈咬陆鲨",
    "Munchlax": "小卡比兽",
    "Riolu": "利欧路",
    "Lucario": "路卡利欧",
    "Hippopotas": "沙河马",
    "Hippowdon": "河马兽",
    "Skorupi": "钳尾蝎",
    "Drapion": "龙王蝎",
    "Croagunk": "不良蛙",
    "Toxicroak": "毒骷蛙",
    "Carnivine": "尖牙笼",
    "Finneon": "荧光鱼",
    "Lumineon": "霓虹鱼",
    "Mantyke": "小球飞鱼",
    "Snover": "雪笠怪",
    "Abomasnow": "暴雪王",
    "Weavile": "玛狃拉",
    "Magnezone": "自爆磁怪",
    "Lickilicky": "大舌舔",
    "Rhyperior": "超甲狂犀",
    "Tangrowth": "巨蔓藤",
    "Electivire": "电击魔兽",
    "Magmortar": "鸭嘴炎兽",
    "Togekiss": "波克基斯",
    "Yanmega": "远古巨蜓",
    "Leafeon": "叶伊布",
    "Glaceon": "冰伊布",
    "Gliscor": "天蝎王",
    "Mamoswine": "象牙猪",
    "Porygon2": "多边兽II",
    "Porygon-Z": "多边兽Z",
    "Porygon": "多边兽",
    "Gallade": "艾路雷朵",
    "Probopass": "大朝北鼻",
    "Dusknoir": "黑夜魔灵",
    "Froslass": "雪妖女",
    "Rotom": "洛托姆",
    "Uxie": "由克希",
    "Mesprit": "艾姆利多",
    "Azelf": "亚克诺姆",
    "Dialga-Origin": "帝牙卢卡-起源形态",
    "Dialga": "帝牙卢卡",
    "Palkia-Origin": "帕路奇亚-起源形态",
    "Palkia": "帕路奇亚",
    "Heatran": "席多蓝恩",
    "Regigigas": "雷吉奇卡斯",
    "Giratina-Origin": "骑拉帝纳-起源形态",
    "Giratina": "骑拉帝纳",
    "Cresselia": "克雷色利亚",
    "Phione": "霏欧纳",
    "Manaphy": "玛纳霏",
    "Darkrai": "达克莱伊",
    "Shaymin": "谢米",
    "Victini": "比克提尼",
    "Snivy": "藤藤蛇",
    "Servine": "青藤蛇",
    "Serperior": "君主蛇",
    "Tepig": "暖暖猪",
    "Pignite": "炒炒猪",
    "Emboar": "炎武王",
    "Oshawott": "水水獭",
    "Dewott": "双刃丸",
    "Samurott": "大剑鬼",
    "Patrat": "探探鼠",
    "Watchog": "步哨鼠",
    "Lillipup": "小约克",
    "Herdier": "哈约克",
    "Stoutland": "长毛狗",
    "Purrloin": "扒手猫",
    "Liepard": "酷豹",
    "Pansage": "花椰猴",
    "Simisage": "花椰猿",
    "Pansear": "爆香猴",
    "Simisear": "爆香猿",
    "Panpour": "冷水猴",
    "Simipour": "冷水猿",
    "Munna": "食梦梦",
    "Musharna": "梦梦蚀",
    "Pidove": "豆豆鸽",
    "Tranquill": "咕咕鸽",
    "Unfezant": "高傲雉鸡",
    "Blitzle": "斑斑马",
    "Zebstrika": "雷电斑马",
    "Roggenrola": "石丸子",
    "Boldore": "地幔岩",
    "Gigalith": "庞岩怪",
    "Woobat": "滚滚蝙蝠",
    "Swoobat": "心蝙蝠",
    "Drilbur": "螺钉地鼠",
    "Excadrill": "龙头地鼠",
    "Audino": "差不多娃娃",
    "Timburr": "搬运小匠",
    "Gurdurr": "铁骨土人",
    "Conkeldurr": "修建老匠",
    "Tympole": "圆蝌蚪",
    "Palpitoad": "蓝蟾蜍",
    "Seismitoad": "蟾蜍王",
    "Throh": "投摔鬼",
    "Sawk": "打击鬼",
    "Sewaddle": "虫宝包",
    "Swadloon": "宝包茧",
    "Leavanny": "保姆虫",
    "Venipede": "百足蜈蚣",
    "Whirlipede": "车轮球",
    "Scolipede": "蜈蚣王",
    "Cottonee": "木棉球",
    "Whimsicott": "风妖精",
    "Petilil": "百合根娃娃",
    "Lilligant": "裙儿小姐",
    "Basculin-Blue-Striped": "野蛮鲈鱼-蓝条纹的样子",
    "Basculin-White-Striped": "野蛮鲈鱼-白条纹的样子",
    "Basculin": "野蛮鲈鱼",
    "Sandile": "黑眼鳄",
    "Krokorok": "混混鳄",
    "Krookodile": "流氓鳄",
    "Darumaka": "火红不倒翁",
    "Darmanitan": "达摩狒狒",
    "Maractus": "沙铃仙人掌",
    "Dwebble": "石居蟹",
    "Crustle": "岩殿居蟹",
    "Scraggy": "滑滑小子",
    "Scrafty": "头巾混混",
    "Sigilyph": "象征鸟",
    "Yamask": "哭哭面具",
    "Cofagrigus": "死神棺",
    "Tirtouga": "原盖海龟",
    "Carracosta": "肋骨海龟",
    "Archen": "始祖小鸟",
    "Archeops": "始祖大鸟",
    "Trubbish": "破破袋",
    "Garbodor": "灰尘山",
    "Zorua": "索罗亚",
    "Zoroark": "索罗亚克",
    "Minccino": "泡沫栗鼠",
    "Cinccino": "奇诺栗鼠",
    "Gothita": "哥德宝宝",
    "Gothorita": "哥德小童",
    "Gothitelle": "哥德小姐",
    "Solosis": "单卵细胞球",
    "Duosion": "双卵细胞球",
    "Reuniclus": "人造细胞卵",
    "Ducklett": "鸭宝宝",
    "Swanna": "舞天鹅",
    "Vanillite": "迷您冰",
    "Vanillish": "多多冰",
    "Vanilluxe": "双倍多多冰",
    "Deerling": "四季鹿",
    "Sawsbuck-Summer": "萌芽鹿-夏天的样子",
    "Sawsbuck-Autumn": "萌芽鹿-秋天的样子",
    "Sawsbuck-Winter": "萌芽鹿-冬天的样子",
    "Sawsbuck": "萌芽鹿",
    "Emolga": "电飞鼠",
    "Karrablast": "盖盖虫",
    "Escavalier": "骑士蜗牛",
    "Foongus": "哎呀球菇",
    "Amoonguss": "败露球菇",
    "Frillish": "轻飘飘",
    "Jellicent": "胖嘟嘟",
    "Alomomola": "保姆曼波",
    "Joltik": "电电虫",
    "Galvantula": "电蜘蛛",
    "Ferroseed": "种子铁球",
    "Ferrothorn": "坚果哑铃",
    "Klink": "齿轮儿",
    "Klang": "齿轮组",
    "Klinklang": "齿轮怪",
    "Tynamo": "麻麻小鱼",
    "Eelektrik": "麻麻鳗",
    "Eelektross": "麻麻鳗鱼王",
    "Elgyem": "小灰怪",
    "Beheeyem": "大宇怪",
    "Litwick": "烛光灵",
    "Lampent": "灯火幽灵",
    "Chandelure": "水晶灯火灵",
    "Axew": "牙牙",
    "Fraxure": "斧牙龙",
    "Haxorus": "双斧战龙",
    "Cubchoo": "喷嚏熊",
    "Beartic": "冻原熊",
    "Cryogonal": "几何雪花",
    "Shelmet": "小嘴蜗",
    "Accelgor": "敏捷虫",
    "Stunfisk": "泥巴鱼",
    "Mienfoo": "功夫鼬",
    "Mienshao": "师父鼬",
    "Druddigon": "赤面龙",
    "Golett": "泥偶小人",
    "Golurk": "泥偶巨人",
    "Pawniard": "驹刀小兵",
    "Bisharp": "劈斩司令",
    "Bouffalant": "爆炸头水牛",
    "Rufflet": "毛头小鹰",
    "Braviary": "勇士雄鹰",
    "Vullaby": "秃鹰丫头",
    "Mandibuzz": "秃鹰娜",
    "Heatmor": "熔蚁兽",
    "Durant": "铁蚁",
    "Deino": "单首龙",
    "Zweilous": "双首暴龙",
    "Hydreigon": "三首恶龙",
    "Larvesta": "燃烧虫",
    "Volcarona": "火神蛾",
    "Cobalion": "勾帕路翁",
    "Terrakion": "代拉基翁",
    "Virizion": "毕力吉翁",
    "Tornadus-Therian": "龙卷云-灵兽形态",
    "Thundurus-Therian": "雷电云-灵兽形态",
    "Landorus-Therian": "土地云-灵兽形态",
    "Enamorus-Therian": "眷恋云-灵兽形态",
    "Tornadus": "龙卷云",
    "Thundurus": "雷电云",
    "Landorus": "土地云",
    "Enamorus": "眷恋云",
    "Reshiram": "莱希拉姆",
    "Zekrom": "捷克罗姆",
    "Kyurem-White": "酋雷姆-焰白",
    "Kyurem-Black": "酋雷姆-暗黑",
    "Kyurem": "酋雷姆",
    "Keldeo": "凯路迪欧",
    "Meloetta": "美洛耶塔",
    "Genesect": "盖诺赛克特",
    "Chespin": "哈力栗",
    "Quilladin": "胖胖哈力",
    "Chesnaught": "布里卡隆",
    "Fennekin": "火狐狸",
    "Braixen": "长尾火狐",
    "Delphox": "妖火红狐",
    "Froakie": "呱呱泡蛙",
    "Frogadier": "呱头蛙",
    "Greninja": "甲贺忍蛙",
    "-Bond": "-牵绊",
    "-Ash": "-小智版",
    "Greninja-Bond": "甲贺忍蛙-牵绊",
    "Greninja-Ash": "甲贺忍蛙-小智版",
    "Bunnelby": "掘掘兔",
    "Diggersby": "掘地兔",
    "Fletchling": "小箭雀",
    "Fletchinder": "火箭雀",
    "Talonflame": "烈箭鹰",
    "Scatterbug": "粉蝶虫",
    "Spewpa": "粉蝶蛹",
    "Vivillon-Archipelago": "彩粉蝶-群岛花纹",
    "Vivillon-Continental": "彩粉蝶-大陆花纹",
    "Vivillon-Elegant": "彩粉蝶-高雅花纹",
    "Vivillon-Garden": "彩粉蝶-庭园花纹",
    "Vivillon-High Plains": "彩粉蝶-荒野花纹",
    "Vivillon-Icy Snow": "彩粉蝶-冰雪花纹",
    "Vivillon-Jungle": "彩粉蝶-热带雨林花纹",
    "Vivillon-Marine": "彩粉蝶-大海花纹",
    "Vivillon-Modern": "彩粉蝶-摩登花纹",
    "Vivillon-Monsoon": "彩粉蝶-骤雨花纹",
    "Vivillon-Ocean": "彩粉蝶-大洋花纹",
    "Vivillon-Polar": "彩粉蝶-雪国花纹",
    "Vivillon-River": "彩粉蝶-大河花纹",
    "Vivillon-Sandstorm": "彩粉蝶-沙尘花纹",
    "Vivillon-Savanna": "彩粉蝶-热带草原花纹",
    "Vivillon-Sun": "彩粉蝶-太阳花纹",
    "Vivillon-Tundra": "彩粉蝶-雪原花纹",
    "Vivillon": "彩粉蝶",
    "Litleo": "小狮狮",
    "Pyroar": "火炎狮",
    "Flabébé": "花蓓蓓",
    "Floette-Orange": "花叶蒂-橙花",
    "Floette-White": "花叶蒂-白花",
    "Floette-Yellow": "花叶蒂",
    "Floette-Blue": "花叶蒂-黄花",
    "Floette": "花叶蒂-蓝花",
    "Florges-Orange": "花洁夫人-橙花",
    "Florges-White": "花洁夫人-白花",
    "Florges-Yellow": "花洁夫人-黄花",
    "Florges-Blue": "花洁夫人-蓝花",
    "Florges": "花洁夫人",
    "Skiddo": "坐骑小羊",
    "Gogoat": "坐骑山羊",
    "Pancham": "顽皮熊猫",
    "Pangoro": "流氓熊猫",
    "Furfrou-Heart": "多丽米亚-心形造型",
    "Furfrou-Dandy": "多丽米亚-绅士造型",
    "Furfrou-Debutante": "多丽米亚-淑女造型",
    "Furfrou-Diamond": "多丽米亚-菱形造型",
    "Furfrou-Matron": "多丽米亚-贵妇造型",
    "Furfrou-Pharaoh": "多丽米亚-国王造型",
    "Furfrou-Star": "多丽米亚-星形造型",
    "Furfrou-La Reine": "多丽米亚-女王造型",
    "Furfrou-Kabuki": "多丽米亚-歌舞伎造型",
    "Furfrou": "多丽米亚",
    "Espurr": "妙喵",
    "Honedge": "独剑鞘",
    "Doublade": "双剑鞘",
    "Aegislash": "坚盾剑怪",
    "Spritzee": "粉香香",
    "Aromatisse": "芳香精",
    "Swirlix": "绵绵泡芙",
    "Slurpuff": "胖甜妮",
    "Inkay": "好啦鱿",
    "Malamar": "乌贼王",
    "Binacle": "龟脚脚",
    "Barbaracle": "龟足巨铠",
    "Skrelp": "垃垃藻",
    "Dragalge": "毒藻龙",
    "Clauncher": "铁臂枪虾",
    "Clawitzer": "钢炮臂虾",
    "Helioptile": "伞电蜥",
    "Heliolisk": "光电伞蜥",
    "Tyrunt": "宝宝暴龙",
    "Tyrantrum": "怪颚龙",
    "Amaura": "冰雪龙",
    "Aurorus": "冰雪巨龙",
    "Sylveon": "仙子伊布",
    "Hawlucha": "摔角鹰人",
    "Dedenne": "咚咚鼠",
    "Carbink": "小碎钻",
    "Goomy": "黏黏宝",
    "Sliggoo": "黏美儿",
    "Goodra": "黏美龙",
    "Klefki": "钥圈儿",
    "Phantump": "小木灵",
    "Trevenant": "朽木妖",
    "Pumpkaboo": "南瓜精",
    "Gourgeist": "南瓜怪人",
    "Bergmite": "冰宝",
    "Avalugg": "冰岩怪",
    "Noibat": "嗡蝠",
    "Noivern": "音波龙",
    "Xerneas-Neutral": "哲尔尼亚斯-放松模式",
    "Xerneas-Active": "哲尔尼亚斯-活跃模式",
    "Xerneas": "哲尔尼亚斯",
    "Yveltal": "伊裴尔塔尔",
    "Zygarde-Complete": "基格尔德-完全体形态",
    "Zygarde Complete": "完全体形态基格尔德",
    "Zygarde-50%": "基格尔德-50%形态",
    "Zygarde-10%": "基格尔德-10%形态",
    "Zygarde": "基格尔德",
    "Diancie": "蒂安希",
    "Hoopa": "胡帕",
    "Volcanion": "波尔凯尼恩",
    "Rowlet": "木木枭",
    "Dartrix": "投羽枭",
    "Decidueye": "狙射树枭",
    "Litten": "火斑喵",
    "Torracat": "炎热喵",
    "Incineroar": "炽焰咆哮虎",
    "Popplio": "球球海狮",
    "Brionne": "花漾海狮",
    "Primarina": "西狮海壬",
    "Pikipek": "小笃儿",
    "Trumbeak": "喇叭啄鸟",
    "Toucannon": "铳嘴大鸟",
    "Yungoos": "猫鼬少",
    "Gumshoos": "猫鼬探长",
    "Grubbin": "强颚鸡母虫",
    "Charjabug": "虫电宝",
    "Vikavolt": "锹农炮虫",
    "Crabrawler": "好胜蟹",
    "Crabominable": "好胜毛蟹",
    "Oricorio-Pom-Pom": "花舞鸟-啪滋啪滋风格",
    "Oricorio-Pa'u": "花舞鸟-呼啦呼啦风格",
    "Oricorio-Sensu": "花舞鸟-轻盈轻盈风格",
    "Oricorio": "花舞鸟",
    "Cutiefly": "萌虻",
    "Ribombee": "蝶结萌虻",
    "Rockruff": "岩狗狗",
    "Lycanroc-Midnight": "鬃岩狼人-黑夜",
    "Lycanroc-Dusk": "鬃岩狼人-黄昏",
    "Lycanroc": "鬃岩狼人",
    "Wishiwashi": "弱丁鱼",
    "Mareanie": "好坏星",
    "Toxapex": "超坏星",
    "Mudbray": "泥驴仔",
    "Mudsdale": "重泥挽马",
    "Dewpider": "滴蛛",
    "Araquanid": "滴蛛霸",
    "Fomantis": "伪螳草",
    "Lurantis": "兰螳花",
    "Morelull": "睡睡菇",
    "Shiinotic": "灯罩夜菇",
    "Salandit": "夜盗火蜥",
    "Salazzle": "焰后蜥",
    "Stufful": "童偶熊",
    "Bewear": "穿着熊",
    "Bounsweet": "甜竹竹",
    "Steenee": "甜舞妮",
    "Tsareena": "甜冷美后",
    "Comfey": "花疗环环",
    "Oranguru": "智挥猩",
    "Passimian": "投掷猴",
    "Wimpod": "胆小虫",
    "Golisopod": "具甲武者",
    "Sandygast": "沙丘娃",
    "Palossand": "噬沙堡爷",
    "Pyukumuku": "拳海参",
    "Type: Null": "属性：空",
    "Silvally": "银伴战兽",
    "Minior-Orange": "小陨星-橙色核心",
    "Minior-Yellow": "小陨星-黄色核心",
    "Minior-Green": "小陨星-绿色核心",
    "Minior-Blue": "小陨星-蓝色核心",
    "Minior-Indigo": "小陨星-浅蓝色核心",
    "Minior-Violet": "小陨星-紫色核心",
    "Minior": "小陨星",
    "-Green": "-绿色核心",
    "-Indigo": "-浅蓝色核心",
    "-Violet": "-紫色核心",
    "Komala": "树枕尾熊",
    "Turtonator": "爆焰龟兽",
    "Togedemaru": "托戈德玛尔",
    "Mimikyu": "谜拟Q",
    "Bruxish": "磨牙彩皮鱼",
    "Drampa": "老翁龙",
    "Dhelmise": "破破舵轮",
    "Jangmo-o": "心鳞宝",
    "Hakamo-o": "鳞甲龙",
    "Kommo-o": "杖尾鳞甲龙",
    "Tapu Koko": "卡璞・鸣鸣",
    "Tapu Lele": "卡璞・蝶蝶",
    "Tapu Bulu": "卡璞・哞哞",
    "Tapu Fini": "卡璞・鳍鳍",
    "Cosmog": "科斯莫古",
    "Cosmoem": "科斯莫姆",
    "Solgaleo": "索尔迦雷欧",
    "Lunala": "露奈雅拉",
    "Nihilego": "虚吾伊德",
    "Buzzwole": "爆肌蚊",
    "Pheromosa": "费洛美螂",
    "Xurkitree": "电束木",
    "Celesteela": "铁火辉夜",
    "Kartana": "纸御剑",
    "Guzzlord": "恶食大王",
    "Necrozma": "奈克洛兹玛",
    "Magearna": "玛机雅娜",
    "Marshadow": "玛夏多",
    "Poipole": "毒贝比",
    "Naganadel": "四颚针龙",
    "Stakataka": "垒磊石",
    "Blacephalon": "砰头小丑",
    "Zeraora": "捷拉奥拉",
    "Meltan": "美录坦",
    "Melmetal": "美录梅塔",
    "Grookey": "敲音猴",
    "Thwackey": "啪咚猴",
    "Rillaboom": "轰擂金刚猩",
    "Scorbunny": "炎兔儿",
    "Raboot": "腾蹴小将",
    "Cinderace": "闪焰王牌",
    "Sobble": "泪眼蜥",
    "Drizzile": "变涩蜥",
    "Inteleon": "千面避役",
    "Skwovet": "贪心栗鼠",
    "Greedent": "藏饱栗鼠",
    "Rookidee": "稚山雀",
    "Corvisquire": "蓝鸦",
    "Corviknight": "钢铠鸦",
    "Blipbug": "索侦虫",
    "Dottler": "天罩虫",
    "Orbeetle": "以欧路普",
    "Nickit": "偷儿狐",
    "Thievul": "狐大盗",
    "Gossifleur": "幼棉棉",
    "Eldegoss": "白蓬蓬",
    "Wooloo": "毛辫羊",
    "Dubwool": "毛毛角羊",
    "Chewtle": "咬咬龟",
    "Drednaw": "暴噬龟",
    "Deoxys-Attack": "代欧奇希斯-攻击形态",
    "Deoxys-Defense": "代欧奇希斯-防御形态",
    "Deoxys-Speed": "代欧奇希斯-速度形态",
    "Deoxys": "代欧奇希斯",
    "Yamper": "来电汪",
    "Boltund": "逐电犬",
    "Rolycoly": "小炭仔",
    "Carkol": "大炭车",
    "Coalossal": "巨炭山",
    "Applin": "啃果虫",
    "Flapple": "苹裹龙",
    "Appletun": "丰蜜龙",
    "Silicobra": "沙包蛇",
    "Sandaconda": "沙螺蟒",
    "Cramorant": "古月鸟",
    "Arrokuda": "刺梭鱼",
    "Barraskewda": "戽斗尖梭",
    "Toxel": "毒电婴",
    "Toxtricity-Low-Key": "颤弦蝾螈-低调形态",
    "Toxtricity": "颤弦蝾螈",
    "Sizzlipede": "烧火蚣",
    "Centiskorch": "焚焰蚣",
    "Clobbopus": "拳拳蛸",
    "Grapploct": "八爪武师",
    "Sinistea": "来悲茶",
    "Polteageist": "怖思壶",
    "Hatenna": "迷布莉姆",
    "Hattrem": "提布莉姆",
    "Hatterene": "布莉姆温",
    "Impidimp": "捣蛋小妖",
    "Morgrem": "诈唬魔",
    "Grimmsnarl": "长毛巨魔",
    "Obstagoon": "堵拦熊",
    "Perrserker": "喵头目",
    "Cursola": "魔灵珊瑚",
    "Sirfetch’d": "葱游兵",
    "Mr. Rime": "踏冰人偶",
    "Runerigus": "死神板",
    "Milcery": "小仙奶",
    "Alcremie-Ruby-Cream": "霜奶仙-奶香红钻",
    "Alcremie-Matcha-Cream": "霜奶仙-奶香抹茶",
    "Alcremie-Mint-Cream": "霜奶仙-奶香薄荷",
    "Alcremie-Lemon-Cream": "霜奶仙-奶香柠檬",
    "Alcremie-Salted-Cream": "霜奶仙-奶香雪盐",
    "Alcremie-Ruby-Swirl": "霜奶仙-红钻综合",
    "Alcremie-Caramel-Swirl": "霜奶仙-焦糖综合",
    "Alcremie-Rainbow-Swirl": "霜奶仙-三色综合",
    "Alcremie": "霜奶仙",
    "Falinks": "列阵兵",
    "Pincurchin": "啪嚓海胆",
    "Snom": "雪吞虫",
    "Frosmoth": "雪绒蛾",
    "Stonjourner": "巨石丁",
    "Eiscue": "冰砌鹅",
    "Morpeko": "莫鲁贝可",
    "Cufant": "铜象",
    "Copperajah": "大王铜象",
    "Dracozolt": "雷鸟龙",
    "Arctozolt": "雷鸟海兽",
    "Dracovish": "鳃鱼龙",
    "Arctovish": "鳃鱼海兽",
    "Duraludon": "铝钢龙",
    "Dreepy": "多龙梅西亚",
    "Drakloak": "多龙奇",
    "Dragapult": "多龙巴鲁托",
    "Zacian-Crowned": "苍响-剑之王",
    "Zacian": "苍响",
    "Zamazenta-Crowned": "藏玛然特-盾之王",
    "Zamazenta": "藏玛然特",
    "Eternatus-Eternamax": "无极汰那-无极巨化",
    "Eternatus": "无极汰那",
    "Kubfu": "熊徒弟",
    "Urshifu-Rapid-Strike": "武道熊师-连击流",
    "Urshifu": "武道熊师",
    "Zarude-Dada": "萨戮德-阿爸",
    "Zarude": "萨戮德",
    "Regieleki": "雷吉艾勒奇",
    "Regidrago": "雷吉铎拉戈",
    "Glastrier": "雪暴马",
    "Spectrier": "灵幽马",
    "Calyrex-Shadow": "蕾冠王-黑马",
    "Calyrex-Ice": "蕾冠王-白马",
    "Calyrex": "蕾冠王",
    "Slowking-Galar": "呆呆王-伽勒尔",
    "Slowbro-Galar": "呆壳兽-伽勒尔",
    "Wyrdeer": "诡角鹿",
    "Kleavor": "劈斧螳螂",
    "Ursaluna": "月月熊",
    "-Bloodmoon": "-赫月",
    "Sneasler": "大狃拉",
    "Overqwil": "万针鱼",
    "Sprigatito": "新叶喵",
    "Floragato": "蒂蕾喵",
    "Meowscarada": "魔幻假面喵",
    "Fuecoco": "呆火鳄",
    "Crocalor": "炙烫鳄",
    "Skeledirge": "骨纹巨声鳄",
    "Quaxly": "润水鸭",
    "Quaxwell": "涌跃鸭",
    "Quaquaval": "狂欢浪舞鸭",
    "Lechonk": "爱吃豚",
    "Dudunsparce-Three-Segment": "土龙节节-三节形态",
    "Dudunsparce": "土龙节节",
    "Tarountula": "团珠蛛",
    "Spidops": "操陷蛛",
    "Nymble": "豆蟋蟀",
    "Lokix": "烈腿蝗",
    "Rellor": "虫滚泥",
    "Rabsca": "虫甲圣",
    "Greavard": "墓仔狗",
    "Houndstone": "墓扬犬",
    "Flittle": "飘飘雏",
    "Espathra": "超能艳鸵",
    "Farigiraf": "奇麒麟",
    "Wiglett": "海地鼠",
    "Wugtrio": "三海地鼠",
    "Dondozo": "吃吼霸",
    "Veluza": "轻身鳕",
    "Finizen": "波普海豚",
    "Palafin-Hero": "海豚侠-全能形态",
    "Palafin": "海豚侠",
    "Smoliv": "迷你芙",
    "Dolliv": "奥利纽",
    "Arboliva": "奥利瓦",
    "Capsakid": "热辣娃",
    "Scovillain": "狠辣椒",
    "Tadbulb": "光蚪仔",
    "Bellibolt": "电肚蛙",
    "Varoom": "噗隆隆",
    "Revavroom": "普隆隆姆",
    "Orthworm": "拖拖蚓",
    "Tandemaus": "一对鼠",
    "Maushold-Four": "一家鼠-四只家庭",
    "Maushold": "一家鼠",
    "Cetoddle": "走鲸",
    "Cetitan": "浩大鲸",
    "Frigibax": "凉脊龙",
    "Arctibax": "冻脊龙",
    "Baxcalibur": "戟脊龙",
    "Tatsugiri-Droopy": "米立龙-下垂姿势",
    "Tatsugiri-Stretchy": "米立龙-平挺姿势",
    "Tatsugiri": "米立龙",
    "Cyclizar": "摩托蜥",
    "Pawmi": "布拨",
    "Pawmo": "布土拨",
    "Pawmot": "巴布土拨",
    "Wattrel": "电海燕",
    "Kilowattrel": "大电海燕",
    "Bombirdier": "下石鸟",
    "Flamigo": "缠红鹤",
    "Klawf": "毛崖蟹",
    "Nacli": "盐石宝",
    "Naclstack": "盐石垒",
    "Garganacl": "盐石巨灵",
    "Glimmet": "晶光芽",
    "Glimmora": "晶光花",
    "Shroodle": "滋汁鼹",
    "Grafaiai": "涂标客",
    "Fidough": "狗仔包",
    "Dachsbun": "麻花犬",
    "Maschiff": "偶叫獒",
    "Mabosstiff": "獒教父",
    "Bramblin": "纳噬草",
    "Brambleghast": "怖纳噬草",
    "Gimmighoul": "索财灵",
    "Gholdengo": "赛富豪",
    "Great Tusk": "雄伟牙",
    "Brute Bonnet": "猛恶菇",
    "Sandy Shocks": "沙铁皮",
    "Scream Tail": "吼叫尾",
    "Flutter Mane": "振翼发",
    "Slither Wing": "爬地翅",
    "Roaring Moon": "轰鸣月",
    "Iron Treads": "铁辙迹",
    "Iron Moth": "铁毒蛾",
    "Iron Hands": "铁臂膀",
    "Iron Jugulis": "铁脖颈",
    "Iron Thorns": "铁荆棘",
    "Iron Bundle": "铁包袱",
    "Iron Valiant": "铁武者",
    "Ting-Lu": "古鼎鹿",
    "Chien-Pao": "古剑豹",
    "Wo-Chien": "古简蜗",
    "Chi-Yu": "古玉鱼",
    "Koraidon": "故勒顿",
    "Miraidon": "密勒顿",
    "Tinkatink": "小锻匠",
    "Tinkatuff": "巧锻匠",
    "Tinkaton": "巨锻将",
    "Charcadet": "炭小侍",
    "Armarouge": "红莲铠骑",
    "Ceruledge": "苍炎刃鬼",
    "Toedscool": "原野水母",
    "Toedscruel": "陆地水母",
    "Kingambit": "仆刀将军",
    "Clodsire": "土王",
    "Annihilape": "弃世猴",
    "Iron Leaves": "铁斑叶",
    "Walking Wake": "波荡水",
    "Raging Bolt": "猛雷鼓",
    "Archaludon": "铝钢桥龙",
    "Gouging Fire": "破空焰",
    "Iron Boulder": "铁磐岩",
    "Iron Crown": "铁头壳",
    "Ogerpon": "厄诡椪",
    "Dipplin": "裹蜜虫",
    "Hydrapple": "蜜集大蛇",
    "Sinistcha": "来悲粗茶",
    "Poltchageist": "斯魔茶",
    "Fezandipiti": "吉稚鸡",
    "Munkidori": "愿增猿",
    "Okidogi": "够赞狗",
    "Pecharunt": "桃歹郎",
    "Terapagos": "太乐巴戈斯",
    "-Wellspring": "-水井",
    "-Cornerstone": "-础石",
    "-Hearthflame": "-火灶",
    "-Artisan": "-高档货",
    "-Masterpiece": "-杰作",
    "-Terastal": "-太晶形态",
    "-Stellar": "-星晶形态",
    "-Paldea-Aqua": "-帕底亚-水澜种",
    "-Paldea-Blaze": "-帕底亚-火炽种",
    "-Paldea-Combat": "-帕底亚-帕底亚",


    "Charizard-Mega-X": "喷火龙-超级进化-X",
    "Charizard-Mega-Y": "喷火龙-超级进化-Y",
    "Venusaur-Mega": "妙蛙花-超级进化",
    "Blastoise-Mega": "水箭龟-超级进化",
    "Beedrill-Mega": "大针蜂-超级进化",
    "Pidgeot-Mega": "大比鸟-超级进化",
    "Alakazam-Mega": "胡地-超级进化",
    "Slowbro-Mega": "呆壳兽-超级进化",
    "Gengar-Mega": "耿鬼-超级进化",
    "Kangaskhan-Mega": "袋兽-超级进化",
    "Pinsir-Mega": "凯罗斯-超级进化",
    "Gyarados-Mega": "暴鲤龙-超级进化",
    "Aerodactyl-Mega": "化石翼龙-超级进化",
    "Lopunny-Mega": "长耳兔-超级进化",
    "Garchomp-Mega": "烈咬陆鲨-超级进化",
    "Lucario-Mega": "路卡利欧-超级进化",
    "Abomasnow-Mega": "暴雪王-超级进化",
    "Gallade-Mega": "艾路雷朵-超级进化",
    "Rayquaza-Mega": "烈空座-超级进化",
    "Salamence-Mega": "暴飞龙-超级进化",
    "Metagross-Mega": "巨金怪-超级进化",
    "Latias-Mega": "拉帝亚斯-超级进化",
    "Latios-Mega": "拉帝欧斯-超级进化",
    "Banette-Mega": "诅咒娃娃-超级进化",
    "Absol-Mega": "阿勃梭鲁-超级进化",
    "Glalie-Mega": "冰鬼护-超级进化",
    "Gardevoir-Mega": "沙奈朵-超级进化",
    "Sableye-Mega": "勾魂眼-超级进化",
    "Mawile-Mega": "大嘴娃-超级进化",
    "Aggron-Mega": "波士可多拉-超级进化",
    "Medicham-Mega": "恰雷姆-超级进化",
    "Manectric-Mega": "雷电兽-超级进化",
    "Sharpedo-Mega": "巨牙鲨-超级进化",
    "Camerupt-Mega": "喷火驼-超级进化",
    "Altaria-Mega": "七夕青鸟-超级进化",
    "Houndoom-Mega": "黑鲁加-超级进化",
    "Tyranitar-Mega": "班基拉斯-超级进化",
    "Sceptile-Mega": "蜥蜴王-超级进化",
    "Blaziken-Mega": "火焰鸡-超级进化",
    "Swampert-Mega": "巨沼怪-超级进化",
    "Ampharos-Mega": "电龙-超级进化",
    "Steelix-Mega": "大钢蛇-超级进化",
    "Scizor-Mega": "巨钳螳螂-超级进化",
    "Heracross-Mega": "赫拉克罗斯-超级进化",
    "Mewtwo-Mega-X": "超梦-超级进化-X",
    "Mewtwo-Mega-Y": "超梦-超级进化-Y",
    "Audino-Mega": "差不多娃娃-超级进化",
    "Diancie-Mega": "蒂安希-超级进化",



    "Venusaur-Gmax": "妙蛙花-超极巨化",
    "Charizard-Gmax": "喷火龙-超极巨化",
    "Blastoise-Gmax": "水箭龟-超极巨化",
    "Butterfree-Gmax": "巴大蝶-超极巨化",
    "Cinderace-Gmax": "闪焰王牌-超极巨化",
    "Inteleon-Gmax": "千面避役-超极巨化",
    "Rillaboom-Gmax": "轰擂金刚猩-超极巨化",
    "Rattata-Alola": "小拉达-阿罗拉",
    "Raticate-Alola": "拉达-阿罗拉",
    "Raticate-Alola-Totem": "霸主拉达-阿罗拉",
    "Pikachu-Cosplay": "换装皮卡丘",
    "Pikachu-Rock-Star": "硬摇滚皮卡丘",
    "Pikachu-Belle": "贵妇皮卡丘",
    "Pikachu-Pop-Star": "偶像皮卡丘",
    "Pikachu-PhD": "博士皮卡丘",
    "Pikachu-Libre": "面罩摔角手皮卡丘",
    "Pikachu-Original": "皮卡丘-初始帽子",
    "Pikachu-Hoenn": "皮卡丘-丰缘帽子",
    "Pikachu-Sinnoh": "皮卡丘-神奥帽子",
    "Pikachu-Unova": "皮卡丘-合众帽子",
    "Pikachu-World": "皮卡丘-世界帽子",
    "Pikachu-Kalos": "皮卡丘-卡洛斯帽子",
    "Pikachu-Alola": "皮卡丘-阿罗拉帽子",
    "Pikachu-Partner": "皮卡丘-就决定是您了之帽子",
    "Pikachu-Starter": "搭档皮卡丘",
    "Pikachu-Gmax": "皮卡丘-超极巨化",
    "Raichu-Alola": "雷丘-阿罗拉",
    "Sandshrew-Alola": "穿山鼠-阿罗拉",
    "Sandslash-Alola": "穿山王-阿罗拉",
    "Vulpix-Alola": "六尾-阿罗拉",
    "Ninetales-Alola": "九尾-阿罗拉",
    "Diglett-Alola": "地鼠-阿罗拉",
    "Dugtrio-Alola": "三地鼠-阿罗拉",
    "Meowth-Alola": "喵喵-阿罗拉",
    "Meowth-Galar": "喵喵-伽勒尔",
    "Meowth-Gmax": "喵喵-超极巨化",
    "Persian-Alola": "猫老大-阿罗拉",
    "Machamp-Gmax": "怪力-超极巨化",
    "Geodude-Alola": "小拳石-阿罗拉",
    "Graveler-Alola": "隆隆石-阿罗拉",
    "Golem-Alola": "隆隆岩-阿罗拉",
    "Ponyta-Galar": "小火马-伽勒尔",
    "Rapidash-Galar": "烈焰马-伽勒尔",
    "Farfetch’d-Galar": "大葱鸭-伽勒尔",
    "Grimer-Alola": "臭泥-阿罗拉",
    "Muk-Alola": "臭臭泥-阿罗拉",
    "Gengar-Gmax": "耿鬼-超极巨化",
    "Kingler-Gmax": "巨钳蟹-超极巨化",
    "Exeggutor-Alola": "椰蛋树-阿罗拉",
    "Marowak-Alola": "嘎啦嘎啦-阿罗拉",
    "Marowak-Alola-Totem": "嘎啦嘎啦-阿罗拉-霸主",
    "Weezing-Galar": "双弹瓦斯-伽勒尔",
    "Mr. Mime-Galar": "魔墙人偶-伽勒尔",
    "Lapras-Gmax": "拉普拉斯-超极巨化",
    "Eevee-Starter": "搭档伊布",
    "Eevee-Gmax": "伊布-超极巨化",
    "Snorlax-Gmax": "卡比兽-超极巨化",
    "Urshifu-Gmax": "武道熊师-超极巨化",
    "Pichu-Spiky-eared": "刺刺耳皮丘",
    "Corsola-Galar": "太阳珊瑚-伽勒尔",
    "Zigzagoon-Galar": "蛇纹熊-伽勒尔",
    "Linoone-Galar": "直冲熊-伽勒尔",
    "Castform-Sunny": "飘浮泡泡-太阳",
    "Castform-Rainy": "飘浮泡泡-雨水",
    "Castform-Snowy": "飘浮泡泡-雪云",
    "Kyogre-Primal": "盖欧卡-原始回归",
    "Groudon-Primal": "固拉多-原始回归",
    "Wormadam-Sandy": "结草贵妇-沙土蓑衣",
    "Wormadam-Trash": "结草贵妇-垃圾蓑衣",
    "Cherrim-Sunshine": "樱花儿-晴天形态",
    "Rotom-Heat": "加热洛托姆",
    "Rotom-Wash": "清洗洛托姆",
    "Rotom-Frost": "结冰洛托姆",
    "Rotom-Fan": "旋转洛托姆",
    "Rotom-Mow": "切割洛托姆",
    "Shaymin-Sky": "谢米-天空形态",
    "Arceus-Bug": "阿尔宙斯-虫属性",
    "Arceus-Dark": "阿尔宙斯-恶属性",
    "Arceus-Dragon": "阿尔宙斯-龙属性",
    "Arceus-Electric": "阿尔宙斯-电属性",
    "Arceus-Fairy": "阿尔宙斯-妖精属性",
    "Arceus-Fighting": "阿尔宙斯-格斗属性",
    "Arceus-Fire": "阿尔宙斯-火属性",
    "Arceus-Flying": "阿尔宙斯-飞行属性",
    "Arceus-Ghost": "阿尔宙斯-幽灵属性",
    "Arceus-Grass": "阿尔宙斯-草属性",
    "Arceus-Ground": "阿尔宙斯-地面属性",
    "Arceus-Ice": "阿尔宙斯-冰属性",
    "Arceus-Poison": "阿尔宙斯-毒属性",
    "Arceus-Psychic": "阿尔宙斯-超能力属性",
    "Arceus-Rock": "阿尔宙斯-岩石属性",
    "Arceus-Steel": "阿尔宙斯-钢属性",
    "Arceus-Water": "阿尔宙斯-水属性",
    "Arceus": "阿尔宙斯",
    "Darumaka-Galar": "火红不倒翁-伽勒尔",
    "Darmanitan-Galar-Zen": "达摩狒狒-伽勒尔-达摩模式",
    "-Galar-Zen": "-伽勒尔-达摩模式",
    "Darmanitan-Zen": "达摩狒狒-达摩模式",
    "Darmanitan-Galar": "达摩狒狒-伽勒尔",
    "Yamask-Galar": "哭哭面具-伽勒尔",
    "Garbodor-Gmax": "灰尘山-超极巨化",
    "Stunfisk-Galar": "泥巴鱼-伽勒尔",
    "Keldeo-Resolute": "凯路迪欧-觉悟",
    "Meloetta-Pirouette": "美洛耶塔-舞步形态",
    "Genesect-Douse": "盖诺赛克特-水流卡带",
    "Genesect-Shock": "盖诺赛克特-闪电卡带",
    "Genesect-Burn": "盖诺赛克特-火焰卡带",
    "Genesect-Chill": "盖诺赛克特-冰冻卡带",
    "Vivillon-Fancy": "彩粉蝶-花纹",
    "Vivillon-Pokeball": "菜粉蝶-球球花纹",
    "Floette-Eternal": "花叶蒂-永恒之花",
    "Meowstic-F": "超能妙喵-雌性的样子",
    "Meowstic": "超能妙喵",
    "Oinkologne-F": "飘香豚-雌性的样子",
    "Oinkologne": "飘香豚",
    "Basculegion-F": "幽尾玄鱼-雌性的样子",
    "Basculegion": "幽尾玄鱼",
    "Indeedee-F": "爱管侍-雌性的样子",
    "Indeedee": "爱管侍",
    "Zoroark-Hisui": "索罗亚克-洗翠",
    "Arcanine-Hisui": "风速狗-洗翠",
    "Electrode-Hisui": "顽皮雷弹-洗翠",
    "Avalugg-Hisui": "冰岩怪-洗翠",
    "Braviary-Hisui": "勇士雄鹰-洗翠",
    "Decidueye-Hisui": "狙射树枭-洗翠",
    "Goodra-Hisui": "黏美龙-洗翠",
    "Growlithe-Hisui": "卡蒂狗-洗翠",
    "Lilligant-Hisui": "裙儿小姐-洗翠",
    "Qwilfish-Hisui": "千针鱼-洗翠",
    "Samurott-Hisui": "大剑鬼-洗翠",
    "Sliggoo-Hisui": "黏美儿-洗翠",
    "Sneasel-Hisui": "狃拉-洗翠",
    "Typhlosion-Hisui": "火暴兽-洗翠",
    "Voltorb-Hisui": "霹雳电球-洗翠",
    "Zorua-Hisui": "索罗亚-洗翠",
    "Wooper-Paldea": "乌波-帕底亚",
    "Aegislash-Blade": "坚盾剑怪-刀剑形态",
    "Pumpkaboo-Small": "南瓜精-小尺寸",
    "Pumpkaboo-Large": "南瓜精-大尺寸",
    "Pumpkaboo-Super": "南瓜精-特大尺寸",
    "Gourgeist-Small": "南瓜怪人-小尺寸",
    "Gourgeist-Large": "南瓜怪人-大尺寸",
    "Gourgeist-Super": "南瓜怪人-特大尺寸",
    "Zygarde-Complete": "基格尔德-完全体形态",
    "Hoopa-Unbound": "解放胡帕",
    "Gumshoos-Totem": "猫鼬探长-霸主",
    "Vikavolt-Totem": "锹农炮虫-霸主",
    "Ribombee-Totem": "蝶结萌虻-霸主",
    "Wishiwashi-School": "弱丁鱼-鱼群",
    "Araquanid-Totem": "霸主滴蛛霸",
    "Lurantis-Totem": "霸主兰螳花",
    "Salazzle-Totem": "霸主焰后蜥",
    "Silvally-Bug": "银伴战兽-虫子",
    "Silvally-Dark": "银伴战兽-黑暗",
    "Silvally-Dragon": "银伴战兽-龙",
    "Silvally-Electric": "银伴战兽-电子",
    "Silvally-Fairy": "银伴战兽-妖精",
    "Silvally-Fighting": "银伴战兽-战斗",
    "Silvally-Fire": "银伴战兽-火焰",
    "Silvally-Flying": "银伴战兽-飞翔",
    "Silvally-Ghost": "银伴战兽-幽灵",
    "Silvally-Grass": "银伴战兽-青草",
    "Silvally-Ground": "银伴战兽-大地",
    "Silvally-Ice": "银伴战兽-冰雪",
    "Silvally-Poison": "银伴战兽-毒",
    "Silvally-Psychic": "银伴战兽-精神",
    "Silvally-Rock": "银伴战兽-岩石",
    "Silvally-Steel": "银伴战兽-钢铁",
    "Silvally-Water": "银伴战兽-清水",
    "Minior-Meteor": "小陨星-流星",
    "Togedemaru-Totem": "托戈德玛尔-霸主",
    "Mimikyu-Busted": "谜拟Q-现形",
    "Mimikyu-Totem": "谜拟Q-霸主",
    "Mimikyu-Busted-Totem": "谜拟Q-霸主-现形",
    "Kommo-o-Totem": "杖尾鳞甲龙-霸主",
    "Necrozma-Dusk-Mane": "奈克洛兹玛-黄昏之鬃",
    "Necrozma-Dawn-Wings": "奈克洛兹玛-拂晓之翼",
    "Necrozma-Ultra": "究极奈克洛兹玛",
    "Magearna-Original": "玛机雅娜-500年前的颜色",
    "Melmetal-Gmax": "美录梅塔-超极巨化",
    "Corviknight-Gmax": "钢铠鸦-超极巨化",
    "Orbeetle-Gmax": "以欧路普-超极巨化",
    "Drednaw-Gmax": "暴噬龟-超极巨化",
    "Coalossal-Gmax": "巨炭山-超极巨化",
    "Flapple-Gmax": "苹裹龙-超极巨化",
    "Appletun-Gmax": "丰蜜龙-超极巨化",
    "Sandaconda-Gmax": "沙螺蟒-超极巨化",
    "Cramorant-Gulping": "古月鸟-一口吞",
    "Cramorant-Gorging": "古月鸟-大口吞",
    "Toxtricity-Gmax": "颤弦蝾螈-超极巨化",
    "Toxtricity-Low-Key-Gmax": "颤弦蝾螈-低调形态-超极巨化",
    "Centiskorch-Gmax": "焚焰蚣-超极巨化",
    "Hatterene-Gmax": "布莉姆温-超极巨化",
    "Grimmsnarl-Gmax": "长毛巨魔-超极巨化",
    "Alcremie-Gmax": "霜奶仙-超极巨化",
    "Eiscue-Noice": "冰砌鹅-解冻形态",
    "Morpeko-Hangry": "莫鲁贝可-空腹花纹",
    "Copperajah-Gmax": "大王铜象-超极巨化",
    "Duraludon-Gmax": "铝钢龙-超极巨化",

    "-Question": "-？",
    "-Exclamation": "-！",
    "-Neutral": "-放松模式",
    "-Active": "-活跃模式",
    "-Mega": "-超级进化",
    "-Mega-X": "-超级进化-X",
    "-Mega-Y": "-超级进化-Y",
    "-Gmax": "-超极巨化",
    "-Eternamax": "-无极巨化",
    "-Alola": "-阿罗拉",
    "-Alola-Totem": "-阿罗拉-霸主",
    "-Cosplay": "-换装",
    "-Rock-Star": "-硬摇滚",
    "-Belle": "-贵妇",
    "-Pop-Star": "-偶像",
    "-PhD": "-博士",
    "-Libre": "-面罩摔角手",
    "-Original": "-初始",
    "-Hoenn": "-丰缘",
    "-Sinnoh": "-神奥",
    "-Unova": "-合众",
    "-World": "-世界",
    "-Kalos": "-卡洛斯",
    "-Galar": "-伽勒尔",
    "-Paldea": "-帕底亚",
    "-Hisui": "-洗翠",
    "-Partner": "-就决定是您了",
    "-Starter": "-搭档",
    "-Spiky-eared": "-刺刺耳",
    "-Sunny": "-太阳",
    "-Rainy": "-雨水",
    "-Snowy": "-雪云",
    "-Primal": "-原始回归",
    "-Attack": "-攻击形态",
    "-Defense": "-防御形态",
    "-Speed": "-速度形态",
    "-Sandy": "-沙土蓑衣",
    "-Trash": "-垃圾蓑衣",
    "-Sunshine": "-晴天形态",
    "East": "-东海",
    "-Heat": "-加热",
    "-Wash": "-清洗",
    "-Frost": "-结冰",
    "-Fan": "-旋转",
    "-Mow": "-切割",
    "-Sky": "-天空形态",
    "-Bug": "-虫",
    "-Dark": "-恶",
    "-Dragon": "-龙",
    "-Electric": "-电",
    "-Fairy": "-妖精",
    "-Fighting": "-格斗",
    "-Fire": "-火",
    "-Flying": "-飞行",
    "-Ghost": "-幽灵",
    "-Grass": "-草",
    "-Ground": "-地面",
    "-Ice": "-冰",
    "-Shadow":"-幽灵",
    "-Poison": "-毒",
    "-Psychic": "-超能力",
    "-Rock": "-岩石",
    "-Steel": "-钢",
    "-Water": "-水",
    "-Autumn": "-秋天的样子",
    "-Summer": "-夏天的样子",
    "-Winter": "-冬天的样子",
    "-Zen": "-达摩模式",
    "-Zen-Galar": "-伽勒尔-达摩模式",
    "-Resolute": "-觉悟",
    "-Pirouette": "-舞步形态",
    "-Douse": "-水流卡带",
    "-Shock": "-闪电卡带",
    "-Burn": "-火焰卡带",
    "-Chill": "-冰冻卡带",
    "-Fancy": "-花纹",
    "-Pokeball": "-球球花纹",
    "-Eternal": "-永恒之花",
    "-Blade": "-刀剑形态",
    "-Small": "-小",
    "-Large": "-大",
    "-Super": "-特大",
    "-10%": "-10%形态",
    "-Complete": "-完全体形态",
    "-Unbound": "-解放形态",
    "-Totem": "-霸主",
    "-Pom-Pom": "-啪滋啪滋风格",
    "-Pa'u": "-呼啦呼啦风格",
    "-Sensu": "-轻盈轻盈风格",
    "-School": "-鱼群",
    "-Meteor": "-流星",
    "-Busted-Totem": "-霸主-现形",
    "-Busted": "-现形",
    "-Dusk-Mane": "-黄昏之鬃",
    "-Dawn-Wings": "-拂晓之翼",
    "-Ultra": "-究极形态",
    "-Gulping": "-一口吞",
    "-Gorging": "-大口吞",
    "-Noice": "-解冻形态",
    "-Hangry": "-空腹花纹",
    "-F": "-雌性的样子",
    "-M": "-雄性的样子",
    "-Dusk": "-黄昏",
    "-Midnight": "-黑夜",
    "-Four": "-四只家庭",
    "-Hero": "-全能形态",
    "-Therian": "-灵兽形态",
    "-Origin": "-起源形态",
    "-Crowned": "-王形态",
    "-Antique": "-真货",
    "-Dada": "-阿爸",
    "-Low-Key": "-低调形态",

    "-Rapid-Strike-Gmax": "-连击流-超级进化",
    "-Low-Key-Gmax": "-低调形态-超极巨化",
    "-Droopy": "-下垂姿势",
    "-Stretchy": "-平挺姿势",
    "-Blue": "-氰蓝",
    "-White": "-焰白",
    "-Black": "-暗黑",
    "-Yellow": "-鹅黄",
    "-Orange": "-橙花",
    "-Three-Segment": "-三节形态",
    "-White-Striped": "-白条纹的样子",
    "-Blue-Striped": "-蓝条纹的样子",
    "-Rapid-Strike": "-连击流",
    "-Paldea-Aqua": "-帕底亚-水澜种",
    "-Paldea-Blaze": "-帕底亚-火炽种",
    "-Paldea-Combat": "-帕底亚-斗战种",
    "-Roaming": "-徒步形态",
    "-Bloodmoon": "-赫月",
    "-Cornerstone": "-础石",
    "-Wellspring": "-水井",
    "-Hearthflame": "-火灶",
    "-Artisan": "-高档货",
    "-Masterpiece": "-杰作",
    "-Antique": "-真货",
    "-Ruby-Cream": "-奶香红钻",
    "-Matcha-Cream": "-奶香抹茶",
    "-Mint-Cream": "-奶香薄荷",
    "-Lemon-Cream": "-奶香柠檬",
    "-Salted-Cream": "-奶香雪盐",
    "-Ruby-Swirl": "-红钻综合",
    "-Caramel-Swirl": "-焦糖综合",
    "-Rainbow-Swirl": "-三色综合",
    "-Heart": "-心形造型",
    "-Dandy": "-绅士造型",
    "-Debutante": "-淑女造型",
    "-Diamond": "-菱形造型",
    "-Matron": "-贵妇造型",
    "-Pharaoh": "-国王造型",
    "-Star": "-星形造型",
    "-La Reine": "-女王造型",
    "-Kabuki": "-歌舞伎造型",
    "-Archipelago": "-群岛花纹",
    "-Continental": "-大陆花纹",
    "-Elegant": "-高雅花纹",
    "-Garden": "-庭园花纹",
    "-High Plains": "-荒野花纹",
    "-Icy Snow": "-冰雪花纹",
    "-Jungle": "-热带雨林花纹",
    "-Marine": "-大海花纹",
    "-Modern": "-摩登花纹",
    "-Monsoon": "-骤雨花纹",
    "-Ocean": "-大洋花纹",
    "-Polar": "-雪国花纹",
    "-River": "-大河花纹",
    "-Sandstorm": "-沙尘花纹",
    "-Savanna": "-热带草原花纹",
    "-Sun": "-太阳花纹",
    "-Tundra": "-雪原花纹",

    "Squawkabilly-Blue": "怒鹦哥-蓝羽毛",
    "Squawkabilly-White": "怒鹦哥-白羽毛",
    "Squawkabilly-Yellow": "怒鹦哥-黄羽毛",
    "Squawkabilly": "怒鹦哥",
    "Gimmighoul-Roaming": "索财灵-徒步形态",
    "Ursaluna-Bloodmoon": "月月熊-赫月",
    "Ogerpon-Cornerstone": "厄诡椪-础石",
    "Ogerpon-Wellspring": "厄诡椪-水井",
    "Ogerpon-Hearthflame": "厄诡椪-火灶",
    "Terapagos-Stellar": "太乐巴戈斯-星晶形态",
    "Terapagos-Terastal": "太乐巴戈斯-太晶形态",
    "Poltchageist-Artisan": "斯魔茶-高档货",
    "Sinistcha-Masterpiece": "来悲粗茶-杰作",
    "Polteageist-Antique": "怖思壶-真货",
    "Sinistea-Antique": "来悲茶-真货",
    "Tauros-Paldea-Blaze": "肯泰罗-帕底亚-火炽种",
    "Tauros-Paldea-Aqua": "肯泰罗-帕底亚-水澜种",
    "Tauros-Paldea-Combat": "肯泰罗-帕底亚-斗战种",
    "Groudon-Primal": "固拉多-原始回归",
    "Kyogre-Primal": "盖欧卡-原始回归",
    "Zamazenta-Crowned": "藏玛然特-盾之王",
    "Zacian-Crowned": "苍响-剑之王",
    "Palkia-Origin": "帕路奇亚-起源",
    "Giratina-Origin": "骑拉帝纳-起源",
    "Dialga-Origin": "帝牙卢卡-起源",
    "Silvally-*": "银伴战兽-未知属性",
    "Arceus-*": "阿尔宙斯-未知属性",
    "Genesect-*": "盖诺赛克特-未知卡带",
    "Xerneas-*": "哲尔尼亚斯-未知模式",
    "Urshifu-*": "武道熊师-未知流派",
    "Greninja-*": "甲贺忍蛙-未知形态",
    "Zacian-*": "苍响-未知形态",
    "Zamazenta-*": "藏玛然特-未知形态",
    "Dudunsparce-*": "土龙节节-未知形态",
    "Gourgeist-Large": "南瓜怪人-大",
    "Gourgeist-Small": "南瓜怪人-小",
    "Gourgeist-Super": "南瓜怪人-特大",
    "Gourgeist-*": "南瓜怪人-未知大小",
    "Pumpkaboo-Large": "南瓜精-大",
    "Pumpkaboo-Small": "南瓜精-小",
    "Pumpkaboo-Super": "南瓜精-特大",
    "Pumpkaboo-*": "南瓜精-未知大小",
    "Urshifu-Rapid-Strike-Gmax": "武道熊师-连击流-超极巨化",
    "Ogerpon-Wellspring-Tera": "厄诡椪-水井-太晶化",
    "Ogerpon-Cornerstone-Tera": "厄诡椪-础石-太晶化",
    "Ogerpon-Hearthflame-Tera": "厄诡椪-火灶-太晶化",
    "Ogerpon-Teal-Tera": "厄诡椪-碧草-太晶化",
    "Ogerpon-Tera": "厄诡椪-太晶化",
    "-Wellspring-Tera": "-水井-太晶化",
    "-Cornerstone-Tera": "-础石-太晶化",
    "-Hearthflame-Tera": "-火灶-太晶化",
    "-Teal-Tera": "-碧草-太晶化",





    //  前代道具效果



    "If holder's HP is full, survives all hits of one attack with at least 1 HP. Single use.": "携带后，在HP全满时，即便受到可能会导致濒死的招式，也能仅以1HP撑过去1次。使用后消失",
    "Holder's use of Light Screen or Reflect lasts 8 turns instead of 5.": "光墙和反射壁的有效时间延长至8回合",
    "Damage of moves used on consecutive turns is increased. Max 2x after 10 turns.": "连续使用相同招式时，每重复使用一次威力提升10%，最高200%",
    "If held by a Pikachu, its Special Attack is doubled.": "皮卡丘携带后，特攻翻倍",
    "If held by a Pikachu, its attacks have their power doubled.": "皮卡丘携带后，使出的招式威力加倍",
    "If held by a Latias or a Latios, its Sp. Atk and Sp. Def are 1.5x.": "拉帝亚斯/拉帝欧斯携带后特攻和特防提升50%",
    "Holder's Speed is halved and it becomes grounded.": "携带该道具的神奇宝贝的速度降低50%，并变为地面上的宝可梦",
    "Can only be held by Giratina. Its Ghost- & Dragon-type attacks have 1.2x power.": "只能由骑拉帝纳携带。龙属性和幽灵属性招式的威力提升20%",
    "Holder gains 1.3x HP from draining moves, Aqua Ring, Ingrain, and Leech Seed.": "携带者使用的吸取类招式、水流环、扎根和寄生种子恢复量提升30%",
    "Holder is cured if it is infatuated. Single use.": "陷入着迷状态后，解除着迷状态。使用后消失",
    "Holder's Water-type attacks have 1.05x power.": "水属性招式威力提升5%",
    "The accuracy of attacks against the holder is 0.95x.": "携带该道具时，招式对自身的命中率×0.95",
    "Restores 30 HP when at 1/2 max HP or less. Single use.": "HP低于50%最大HP时，恢复30HP。使用后消失",
    "(Gen 2) On switch-in, raises holder's Attack by 2 and confuses it. Single use.": "(Gen 2) 出场后，携带者陷入混乱状态并提升2级攻击",
    "An attack against the holder has its accuracy out of 255 lowered by 20.": "对手的命中率降低为235/255",
    "(Gen 2) Restores 30 HP when at 1/2 max HP or less. Single use.": "(Gen 2) HP低于50%最大HP时，恢复30HP。使用后消失",
    "Holder's Dragon-type attacks have 1.1x power. Evolves Seadra (trade).": "龙属性招式威力提升10%。可用于通信交换进化海刺龙",
    "(Gen 2) Holder wakes up if it is asleep. Single use.": "(Gen 2) 陷入睡眠状态时解除睡眠状态。使用后消失",
    "(Gen 2) Holder cures itself if it is confused or has a status condition. Single use.": "(Gen 2) 陷入混乱或异常状态时发动，解除该状态。使用后消失",
    "(Gen 2) Restores 5 PP to the first of the holder's moves to reach 0 PP. Single use.": "(Gen 2) 招式的PP降到0时恢复该招式5点PP。使用后消失",
    "(Gen 2) Holder's Normal-type attacks have 1.1x power.": "(Gen 2) 一般属性招式威力提升10%",
    "Each turn, holder has a ~23.4% chance to move first in its priority bracket.": "约23.4%概率优先使用招式",
    "(Gen 2) Restores 10 HP when at 1/2 max HP or less. Single use.": "(Gen 2) HP低于50%最大HP时，恢复10HP。使用后消失",
    "If held by a Chansey, its critical hit ratio is always at stage 2. (25% crit rate)": "吉利蛋携带后击中要害等级提升2级(25%概率击中要害)",
    "If held by a Ditto, its Defense and Sp. Def are 1.5x, even while Transformed.": "百变怪携带后防御和特防提升50%，变身后仍然有效",
    "If held by a Farfetch’d, its critical hit ratio is always at stage 2. (25% crit rate)": "大葱鸭携带后击中要害等级提升2级(25%概率击中要害)",
    "(Gen 2) Holder is cured if it is confused. Single use.": "(Gen 2) 陷入混乱状态时发动，解除混乱状态。使用后消失",
    "(Gen 2) Holder is cured if it is frozen. Single use.": "(Gen 2) 陷入冰冻状态时发动，解除冰冻状态。使用后消失",
    "Holder has a ~11.7% chance to survive an attack that would KO it with 1 HP.": "受到攻击而将陷入濒死状态时，约11.7%几率保留1点HP而不陷入濒死状态",
    "(Gen 2) Holder is cured if it is burned. Single use.": "(Gen 2) 陷入灼伤状态时发动，解除灼伤状态。使用后消失",
    "(Gen 2) Holder cures itself if it is paralyzed. Single use.": "(Gen 2) 陷入麻痹状态时发动，解除麻痹状态。使用后消失",
    "(Gen 2) Holder is cured if it is poisoned. Single use.": "(Gen 2) 陷入中毒状态时发动，解除中毒状态。使用后消失",




    //  道具效果


    "Holder cures itself if it has a non-volatile status or is confused. Single use.": "陷入异常状态或混乱状态时发动，解除该状态。使用后消失",
    "Holder's Techno Blast is Fire type.": "携带该道具的宝可梦的高科技光炮变为火属性",
    "Holder's Techno Blast is Ice type.": "携带该道具的宝可梦的高科技光炮变为冰属性",
    "Holder's Techno Blast is Water type.": "携带该道具的宝可梦的高科技光炮变为水属性",
    "Holder's Techno Blast is Electric type.": "携带该道具的宝可梦的高科技光炮变为电属性",
    "Holder's Ability cannot be changed by another Pokemon.": "特性不会被其他宝可梦改变",
    "Activates the Protosynthesis or Quark Drive abilities. Single use.": "特性为夸克充能和古代活性的宝可梦携带后能力提升。使用后消失",
    "Holder is not affected by the secondary effect of another Pokemon's attack.": "不受其他宝可梦的招式追加效果影响",
    "Holder's 5 hit multi-hit attacks will always hit at least 4 times.": "连续招式保底提升",
    "When an opposing Pokemon recieves stat boosts, those boosts are copied. Single use.": "复制对手的一次能力变化。使用后消失",
    "Holder's punch-based attacks do 1.1x damage and avoid adverse contact effects.": "拳击类招式威力提升10%，且变为非接触类招式",
    "If held by a Farfetch'd or Sirfetch'd, its critical hit ratio is raised by 2 stages.": "大葱鸭或者葱游兵携带后击中要害的等级提高2级",
    "Raises holder's Sp. Atk by 1 stage if hit by a Water-type attack. Single use.": "受到水属性招式攻击时特攻提升1级。使用后消失",
    "If held by a Dialga, its Steel- and Dragon-type attacks have 1.2x power.": "帝牙卢卡携带后钢属性和龙属性招式威力提升20%",
    "Raises holder's Speed by 1 stage if it gets affected by Intimidate. Single use.": "受到威吓时速度提升1级。使用后消失",
    "Holder is immune to Ground-type attacks. Pops when holder is hit.": "携带后会浮在空中。受到攻击就会破裂",
    "If held by an Alolan Raichu with Thunderbolt, it can use Stoked Sparksurfer.": "雷丘-阿罗拉携带后可以将十万伏特转化成Z招式：驾雷驭电戏冲浪",
    "Raises holder's Sp. Def by 1 stage when at 1/4 max HP or less. Single use.": "HP低于25%时特防提升1级。使用后消失",
    "Holder is cured if it is frozen. Single use.": "解除冰冻状态。使用后消失",
    "Holder's Sp. Def is 1.5x, but it can only select damaging moves.": "会变得富有攻击性的背心。虽然携带后特防会提高50%，但会无法使出变化招式",
    "A special Poke Ball designed to catch Ultra Beasts.": "为捕获究极异兽而制作的特殊精灵球",
    "Cannot be eaten by the holder. No effect when eaten with Bug Bite or Pluck.": "用于制作宝可方块或宝芬，被虫咬或啄食时没有效果",
    "Restores 20 HP when at 1/2 max HP or less. Single use.": "HP低于一半时回复20HP。使用后消失",
    "Holder gains 1.3x HP from draining/Aqua Ring/Ingrain/Leech Seed/Strength Sap.": "使用吸取HP的招式、寄生种子、水流环、扎根和吸取力量时HP回复量提升30%",
    "Holder's partial-trapping moves deal 1/6 max HP per turn instead of 1/8.": "绑紧招式所造成的束缚伤害从1/8提升至1/6",
    "Each turn, if holder is a Poison type, restores 1/16 max HP; loses 1/8 if not.": "毒属性宝可梦每回合结束时回复1/16最大HP，非毒属性宝可梦每回合结束时失去1/8最大HP",
    "If held by a Kyogre, this item triggers its Primal Reversion in battle.": "盖欧卡携带后，在对战中可以原始回归成为原始盖欧卡",
    "The accuracy of attacks against the holder is 0.9x.": "对手的命中率降低10%",
    "Raises holder's Attack by 1 if hit by an Electric-type attack. Single use.": "受到电属性招式攻击时提升1级攻击。使用后消失",
    "Holder cures itself if it is paralyzed. Single use.": "解除麻痹状态。使用后消失",
    "A rare Poke Ball that has been crafted to commemorate an occasion.": "相当珍贵的球，特制出来的纪念品",
    "Holder wakes up if it is asleep. Single use.": "解除睡眠状态。使用后消失",
    "Halves damage taken from a Normal-type attack. Single use.": "受到一般属性招式时伤害减半。使用后消失",
    "Holder's Attack is 1.5x, but it can only select the first move it executes.": "虽然携带后攻击会提高50%，但只能使出相同的招式",
    "Holder's Speed is 1.5x, but it can only select the first move it executes.": "虽然携带后速度会提高50%，但只能使出相同的招式",
    "Holder's Sp. Atk is 1.5x, but it can only select the first move it executes.": "虽然携带后特攻会提高50%，但只能使出相同的招式",
    "Holder moves first in its priority bracket when at 1/4 max HP or less. Single use.": "HP低于25%时能优先攻击一次。使用后消失",
    "Holder's use of Rain Dance lasts 8 turns instead of 5.": "引起的下雨天气从5回合延长至8回合",
    "If held by a Decidueye with Spirit Shackle, it can use Sinister Arrow Raid.": "狙射树枭携带后可以将缝影转化成Z招式：遮天蔽日暗影箭",
    "If held by a Clamperl, its Sp. Def is doubled.": "珍珠贝携带特防翻倍",
    "If held by a Clamperl, its Sp. Atk is doubled.": "珍珠贝携带特攻翻倍",
    "If holder becomes infatuated, the other Pokemon also becomes infatuated.": "携带者陷入着迷时令对手着迷",
    "A Poke Ball that works especially well on Pokemon that live underwater.": "能很容易地捕捉生活在水世界里的宝可梦",
    "A special Poke Ball that appears out of nowhere in a bag at the Entree Forest.": "在连入之森中，不知何时出现在包包里的梦中球",
    "A Poke Ball that makes it easier to catch wild Pokemon at night or in caves.": "能很容易地在夜晚或洞窟等阴暗的地方捕捉宝可梦",
    "If held by an Eevee with Last Resort, it can use Extreme Evoboost.": "伊布携带后可以将珍藏转化成Z招式：九彩升华齐聚顶",
    "If holder survives a hit, it immediately switches out to a chosen ally. Single use.": "受到伤害后可立即下场与同伴进行交替。使用后消失",
    "If the terrain is Electric Terrain, raises holder's Defense by 1 stage. Single use.": "当场地为电气场地时防御提升1级。使用后消失",
    "Restores 50 HP to one Pokemon but lowers Happiness.": "非常苦的药粉，回复60HP",
    "Restores 1/4 max HP after holder is hit by a supereffective move. Single use.": "受到效果绝佳的攻击时回复1/4最大HP。使用后消失",
    "If holder's species can evolve, its Defense and Sp. Def are 1.5x.": "携带后，还能进化的宝可梦的防御和特防就会提高50%",
    "Holder's attacks that are super effective against the target do 1.2x damage.": "招式出现效果绝佳时威力提升20%",
    "A Poke Ball that makes it easier to catch Pokemon which are quick to run away.": "能很容易地捕捉逃跑速度很快的宝可梦",
    "At the end of every turn, this item attempts to burn the holder.": "回合结束时进入灼伤状态",
    "Holder's weight is halved.": "携带者体重减半",
    "Holder has a 10% chance to survive an attack that would KO it with 1 HP.": "携带后，即便受到可能会导致濒死的招式，有时也能仅以1HP撑过去。",
    "If holder's HP is full, will survive an attack that would KO it with 1 HP. Single use.": "HP全满时受到攻击而将陷入濒死状态时保留1点HP而不陷入濒死状态。使用后消失",
    "A Poke Ball that makes caught Pokemon more friendly.": "捉到的野生宝可梦会变得容易和训练家亲密",
    "Holder moves last in its priority bracket.": "携带者所用招式在相同优先度内必定后出",
    "Raises holder's Defense by 1 stage when at 1/4 max HP or less. Single use.": "HP低于25%时提升1级防御。使用后消失",
    "If the terrain is Grassy Terrain, raises holder's Defense by 1 stage. Single use.": "当场地为青草场地时防御提升1级。使用后消失",
    "A high-performance Ball that provides a higher catch rate than a Poke Ball.": "比起精灵球来更容易捉到宝可梦的，性能还算不错的球",
    "Holder's partial-trapping moves always last 7 turns.": "绑紧招式所造成的束缚状态持续时间固定为7回合",
    "If held by a Giratina, its Ghost- and Dragon-type attacks have 1.2x power.": "骑拉帝纳携带后形态转换为起源形态，并且龙属性和幽灵属性的招式威力提升20%",
    "A remedial Poke Ball that restores the caught Pokemon's HP and status problem.": "能回复捉到的宝可梦的HP并治愈异常状态",
    "Holder's use of Sunny Day lasts 8 turns instead of 5.": "引起的大晴天天气从5回合延长至8回合",
    "A Poke Ball for catching very heavy Pokemon.": "能很容易地捕捉身体沉重的宝可梦",
    "Holder's use of Hail lasts 8 turns instead of 5.": "引起的冰雹天气从5回合延长至8回合",
    "If held by an Incineroar with Darkest Lariat, it can use Malicious Moonsault.": "炽焰咆哮虎携带后可以将DD金钩臂转化成Z招式：极恶飞跃粉碎击",
    "Holder is grounded, Speed halved. If Flying type, takes neutral Ground damage.": "速度降低50%，飞行属性和飘浮特性宝可梦可以受到地面属性招式的伤害",
    "If holder is hit by a physical move, attacker loses 1/8 of its max HP. Single use.": "受到物理招式攻击时对手损伤1/8的HP。使用后消失",
    "Raises holder's Defense by 1 stage after it is hit by a physical attack. Single use.": "受到物理招式攻击时，防御提升1级。使用后消失",
    "Holder's attacks without a chance to flinch gain a 10% chance to flinch.": "使用不会陷入畏缩状态的攻击招式时有10%几率使目标进入畏缩状态",
    "Holder gains the Focus Energy effect when at 1/4 max HP or less. Single use.": "HP低于25%时进入易中要害状态。使用后消失",
    "At the end of every turn, holder restores 1/16 of its max HP.": "回合结束时回复1/16最大HP",
    "Restores 10 PP to the first of the holder's moves to reach 0 PP. Single use.": "招式的PP降到0时恢复该招式10点PP。使用后消失",
    "A Poke Ball for catching Pokemon that are a lower level than your own.": "要捕捉的宝可梦比自己宝可梦的等级越低，就会越容易捕捉",
    "Raises holder's Attack by 1 stage when at 1/4 max HP or less. Single use.": "HP低于25%时攻击提升1级。使用后消失",
    "Holder's attacks do 1.3x damage, and it loses 1/10 its max HP after the attack.": "携带后攻击招式伤害提升30%，攻击招式命中后损失1/10最大HP",
    "If held by a Pikachu, its Attack and Sp. Atk are doubled.": "皮卡丘携带后攻击和特攻翻倍",
    "Holder's use of Aurora Veil, Light Screen, or Reflect lasts 8 turns instead of 5.": "光墙、反射壁和极光幕的有效时间延长至8回合",
    "Poke Ball for catching Pokemon that are the opposite gender of your Pokemon.": "很容易捕捉和自己宝可梦性别不同的宝可梦",
    "If held by a Chansey, its critical hit ratio is raised by 2 stages.": "吉利蛋携带后击中要害等级提升2级",
    "Holder cures itself if it is confused or has a major status condition. Single use.": "解除异常状态和混乱状态。使用后消失",
    "Raises holder's Sp. Def by 1 stage if hit by a Water-type attack. Single use.": "受到水属性招式攻击时特防提升1级。使用后消失",
    "A Poke Ball for catching Pokemon hooked by a Rod when fishing.": "能很容易地捕捉用钓竿钓上来的宝可梦",
    "If held by a Palkia, its Water- and Dragon-type attacks have 1.2x power.": "帕路奇亚携带后龙属性和水属性的招式威力提升20%",
    "A comfortable Poke Ball that makes a caught wild Pokemon quickly grow friendly.": "捉到的野生宝可梦会立刻变得和训练家亲密起来",
    "Holder's Speed is halved. The Klutz Ability does not ignore this effect.": "速度减半。笨拙特性不能无视减半效果",
    "Cannot be given to or taken from a Pokemon, except by Covet/Knock Off/Thief.": "对战中不可以给予或从宝可梦身上取下该道具",
    "Raises holder's Sp. Def by 1 stage after it is hit by a special attack. Single use.": "受到特殊攻击时特防提升1级。使用后消失",
    "If held by Marshadow with Spectral Thief, it can use Soul-Stealing 7-Star Strike.": "玛夏多携带后可以将暗影偷盗转化成Z招式：七星夺魂腿",
    "The best Ball with the ultimate performance. It will catch any wild Pokemon.": "必定能捉到野生宝可梦的，性能最好的球",
    "Cures holder of Attract, Disable, Encore, Heal Block, Taunt, Torment. Single use.": "解除着迷、再来一次、挑衅、无理取闹、定身法和回复封锁状态。使用后消失",
    "If held by a Ditto that hasn't Transformed, its Defense is doubled.": "未变身前的百变怪携带后防御翻倍",
    "Damage of moves used on consecutive turns is increased. Max 2x after 5 turns.": "连续使用相同招式时，每重复使用一次威力提升20%，最高200%",
    "If held by a Mew with Psychic, it can use Genesis Supernova.": "梦幻携带后可以将精神强念转化成Z招式：起源超新星大爆炸",
    "Holder's next move has 1.2x accuracy when at 1/4 max HP or less. Single use.": "HP低于25%时命中率增加20%。使用后消失",
    "If the terrain is Misty Terrain, raises holder's Sp. Def by 1 stage. Single use.": "当场地为薄雾场地时特防提升1级。使用后消失",
    "A Poke Ball for catching Pokemon that evolve using the Moon Stone.": "能很容易地捕捉使用月之石进化的宝可梦",
    "Holder's physical attacks have 1.1x power.": "物理招式威力提升10%",
    "A Poke Ball that works especially well on weaker Pokemon in the wild.": "捕捉的野生宝可梦越弱，就会越容易捕捉",
    "A Poke Ball that works especially well on Water- and Bug-type Pokemon.": "能很容易地捕捉水属性和虫属性的宝可梦",
    "Restores 10 HP when at 1/2 max HP or less. Single use.": "HP低于50%时回复10HP。使用后消失",
    "A special Poke Ball for the Pal Park.": "在伙伴公园里使用的特殊的球",
    "Holder is cured if it is poisoned. Single use.": "解除中毒状态。使用后消失",
    "Holder is cured if it is confused. Single use.": "解除混乱状态。使用后消失",
    "Raises holder's Sp. Atk by 1 stage when at 1/4 max HP or less. Single use.": "HP低于25%时特攻提升1级。使用后消失",
    "If held by a Pikachu with Volt Tackle, it can use Catastropika.": "皮卡丘携带后可以将伏特攻击转化成Z招式：皮卡皮卡必杀击",
    "If held by cap Pikachu with Thunderbolt, it can use 10,000,000 Volt Thunderbolt.": "戴着帽子的皮卡丘携带后可以将十万伏特转化成Z招式：千万伏特",
    "A device for catching wild Pokemon. It is designed as a capsule system.": "胶囊样式的用于投向野生宝可梦并将其捕捉的球",
    "Holder's two-turn moves complete in one turn (except Sky Drop). Single use.": "有1次机会可以在第1回合使出需要蓄力的招式(自由落体除外)。使用后消失",
    "A rare Poke Ball that has been crafted to commemorate an event.": "为了纪念某些事件的稀有的精灵球",
    "If held by a Primarina with Sparkling Aria, it can use Oceanic Operetta.": "西施海壬携带后可以将泡影的咏叹调转化成Z招式：海神庄严交响乐",
    "Holder's moves are protected from adverse contact effects, except Pickpocket.": "使用接触类招式攻击时，不会受到本应受到的效果，对顺手牵羊特性无效",
    "If the terrain is Psychic Terrain, raises holder's Sp. Def by 1 stage. Single use.": "当场地为精神场地时特防提升1级。使用后消失",
    "A Poke Ball that provides a better catch rate at the start of a wild encounter.": "在战斗开始时使用捕获成功率更高的特殊的精灵球",
    "Each turn, holder has a 20% chance to move first in its priority bracket.": "20%概率优先使用招式",
    "If held by a Ditto that hasn't Transformed, its Speed is doubled.": "未变身前的百变怪携带后速度翻倍",
    "No competitive use other than when used with Fling.": "在宝可梦考古学上非常贵重的骨头，可以在商店高价出售",
    "Holder is cured if it is burned. Single use.": "解除灼伤状态。使用后消失",
    "Holder's critical hit ratio is raised by 1 stage.": "击中要害等级提升1级",
    "If holder survives a hit, attacker is forced to switch to a random ally. Single use.": "受到伤害后攻击方随机交换任意宝可梦。使用后消失",
    "If held by a Groudon, this item triggers its Primal Reversion in battle.": "固拉多携带后，在对战中可以原始回归成为原始固拉多",
    "A Poke Ball that works well on Pokemon species that were previously caught.": "对于以前捕获过的宝可梦效果特别好的特殊的球",
    "The holder's type immunities granted solely by its typing are negated.": "受到攻击时，不会出现因属性相性引发的没有效果",
    "If holder is hit by a contact move, the attacker loses 1/6 of its max HP.": "受到接触类招式时对手失去1/6最大HP",
    "If holder is hit by a special move, attacker loses 1/8 of its max HP. Single use.": "受到特殊招式攻击时对手损伤1/8的HP。使用后消失",
    "A special Poke Ball that is used only in the Safari Zone and Great Marsh.": "仅能在狩猎地带和大湿地中使用的特殊的球,上面有迷彩花纹",
    "Holder is immune to powder moves and damage from Sandstorm or Hail.": "免疫沙暴和冰雹天气造成的伤害",
    "Raises holder's Speed by 1 stage when at 1/4 max HP or less. Single use.": "HP低于25%时速度提升1级。使用后消失",
    "Holder may switch out even when trapped by another Pokemon, or by Ingrain.": "必定可以交换，无视任何禁止交换的特性或状态",
    "After an attack, holder gains 1/8 of the damage in HP dealt to other Pokemon.": "造成伤害后回复伤害量的1/8HP",
    "Restores 1/4 max HP when at 1/2 max HP or less. Single use.": "HP低于50%时回复1/4最大HP。使用后消失",
    "Holder's use of Sandstorm lasts 8 turns instead of 5.": "引起的沙暴天气从5回合延长至8回合",
    "If held by a Snorlax with Giga Impact, it can use Pulverizing Pancake.": "卡比兽携带后可以将超级冲击转化成Z招式：认真起来大爆击",
    "Raises holder's Attack by 1 if hit by an Ice-type attack. Single use.": "受到冰属性招式攻击时攻击提升1级。使用后消失",
    "If held by a Latias/Latios, its Dragon- and Psychic-type moves have 1.2x power.": "拉帝亚斯/拉帝欧斯携带后龙属性和超能力属性招式威力提升20%",
    "A special Poke Ball for the Bug-Catching Contest.": "在捕虫大赛上使用的特殊的球",
    "Raises a random stat by 2 when at 1/4 max HP or less (not acc/eva). Single use.": "HP低于25%时随机提升一项能力2级。使用后消失",
    "If held by a Farfetch'd, its critical hit ratio is raised by 2 stages.": "大葱鸭携带后击中要害等级提升2级",
    "Each turn, holder loses 1/8 max HP. An attacker making contact can receive it.": "每回合损失1/8最大HP，受到接触类招式伤害时对手获得该道具",
    "If held by a Tapu with Nature's Madness, it can use Guardian of Alola.": "阿罗拉守护神携带后可以将自然之怒转化成Z招式：巨人卫士·阿罗拉",
    "Holder's use of Electric/Grassy/Misty/Psychic Terrain lasts 8 turns instead of 5.": "引起的场地从5回合延长至8回合",
    "If held by a Cubone or a Marowak, its Attack is doubled.": "卡拉卡拉或嘎啦嘎啦携带后攻击翻倍",
    "A Poke Ball that becomes better the more turns there are in a battle.": "随着战斗回合数增加而变得更好的特殊的球",
    "At the end of every turn, this item attempts to badly poison the holder.": "回合结束时进入剧毒状态",
    "An ultra-performance Ball that provides a higher catch rate than a Great Ball.": "比起超级球来更容易捉到宝可梦的，性能非常不错的球",
    "If holder is hit super effectively, raises Attack, Sp. Atk by 2 stages. Single use.": "受到效果绝佳的伤害时攻击和特攻提升2级。使用后消失",
    "Restores all lowered stat stages to 0 when one is less than 0. Single use.": "将所有能力等级低于0的能力回复至0。使用后消失",
    "The accuracy of attacks by the holder is 1.1x.": "命中率提升10%",
    "Holder's special attacks have 1.1x power.": "特殊招式威力提升10%",
    "Used for Hyper Training. One of a Pokemon's stats is calculated with an IV of 31.": "用作极限特训，提升一项个体值到最大值",
    "Used for Hyper Training. All of a Pokemon's stats are calculated with an IV of 31.": "用作极限特训，提升所有个体值到最大值",
    "The accuracy of attacks by the holder is 1.2x if it moves after its target.": "出招比目标慢时命中率提升20%",
    "If held by a Lycanroc forme with Stone Edge, it can use Splintered Stormshards.": "习得尖石攻击的鬃岩狼人可以使用狼啸石牙飓风暴",
    "If held by a Mimikyu with Play Rough, it can use Let's Snuggle Forever.": "习得嬉闹的谜拟Q可以使用亲密无间大乱揍",
    "If held by a Kommo-o with Clanging Scales, it can use Clangorous Soulblaze.": "习得鳞片噪音的杖尾鳞甲龙可以使用炽魂热舞烈音爆",
    "Solgaleo or Dusk Mane Necrozma with Sunsteel Strike can use a special Z-Move.": "习得流星闪冲的索尔迦雷欧或奈克洛兹玛-黃昏之鬃可以发动特殊Z招式",
    "Lunala or Dawn Wings Necrozma with Moongeist Beam can use a special Z-Move.": "习得暗影之光的露奈雅拉或奈克洛兹玛-拂晓之翼可以发动特殊Z招式",
    "Dusk Mane/Dawn Wings Necrozma: Ultra Burst, then Z-Move w/ Photon Geyser.": "让奈克洛兹玛-黄昏之鬃/拂晓之翼究极爆发再配合光子喷涌使用Z招式",
    "Evolves Milcery into Alcremie when held and spun around.": "小仙奶携带后滑动摇杆可以进化为霜奶仙",
    "Evolves Happiny into Chansey when held and leveled up during the day.": "小福蛋携带后在白天升级可以进化为吉利蛋",
    "Evolves certain species of Pokemon when used.": "使用后可以进化某些宝可梦",
    "Can be combined with certain fossils.": "可以和一些特定化石结合",
    "When the holder's stats are lowered, it will be switched out of battle.": "携带该道具的宝可梦能力下降时，自身下场与同伴进行替换",
    "Prevents the effects of traps set on the battlefield.": "防止携带者受到场地上的陷阱效果",
    "If Trick Room is active, lowers holder's Speed by 1 stage. Single use.": "携带该道具的宝可梦在戏法空间下速度降低1级。使用后消失",
    "Can revive into Dracozolt with Fossilized Drake or Arctozolt with Fossilized Dino.": "可以和化石龙合成并复活为雷鸟龙或和化石海兽复活为雷鸟海兽",
    "Can revive into Dracozolt with Fossilized Bird or Dracovish with Fossilized Fish.": "可以和化石鸟合成并复活为雷鸟龙或和化石海兽复活为鳃鱼海兽",
    "Can revive into Dracovish with Fossilized Drake or Arctovish with Fossilized Dino.": "可以和化石龙合成并复活为鳃鱼龙或和化石海兽复活为鳃鱼海兽",
    "Can revive into Arctovish with Fossilized Fish or Arctozolt with Fossilized Bird.": "可以和化石鸟合成并复活为雷鸟龙或和化石鱼复活为鳃鱼海兽",
    "If held by a Zacian, this item changes it to Crowned Forme.": "苍响携带会变为剑之王形态",
    "If held by a Zamazenta, this item changes it to Crowned Forme.": "藏玛然特携带会变为盾之王形态",
    "Raises holder's Special Attack by 1 stage after using a sound move. Single use.": "使用声音类招式时，特攻提升1级。使用后消失",
    "Blocks the holder from receiving any effects of Sunny Day/Rain Dance.": "阻止使用者从大晴天/下雨天中获得任何效果",
    "When switching in, the holder is unaffected by hazards on its side of the field.": "携带后，不受脚下陷阱等的影响",
    "If the holder misses because of accuracy, it raises Speed by 2 stages. Single use.": "招式因命中率影响而落空时，速度会提升2级。使用后消失",
    "If the holder misses due to accuracy, its Speed is raised by 2 stages. Single use.": "招式因命中率影响而落空时，速度会提升2级。使用后消失",
    "If held by a Farfetch’d or Sirfetch’d, its critical hit ratio is raised by 2 stages.": "大葱鸭或葱游兵携带后击中要害率提高2级",
    "If the holder's stat stages are lowered, it switches to a chosen ally. Single use.": "携带该道具的宝可梦能力下降时，会与同行宝可梦进行替换。使用后消失",
    "If Trick Room is active, the holder's Speed is lowered by 1 stage. Single use.": "携带后，在戏法空间使用时，速度会下降1级。使用后消失",
    "Raises holder's Special Attack by 1 stage after it uses a sound move. Single use.": "携带该道具的宝可梦使用声音的招式后，特攻提升1级。使用后消失",
    "The holder ignores rain- and sun-based effects.": "携带此道具的宝可梦不受大晴天和下雨的影响，对沙暴或冰雹没有效果",
    "If held by a Zamazenta, this item changes its forme to Crowned Shield.": "藏玛然特携带后，在对战中会以藏玛然特-盾之王形态登场",
    "If held by a Zacian, this item changes its forme to Crowned Sword.": "苍响携带后，在对战中会以苍响-剑之王形态登场",
    "A Poke Ball that makes it easier to catch wild Pokemon while they're asleep.": "有点与众不同的球。能很容易地捕捉睡眠状态的宝可梦",
    "Holder's Ability cannot be changed by any effect.": "携带后特性不会被对手改变",
    "Activates the Protosynthesis or Quark Drive Abilities. Single use.": "给特性为古代活性或夸克充能的宝可梦激活特性。使用后消失",
    "Prevents other Pokemon from lowering the holder's stat stages.": "携带后不会因其他宝可梦的招式或特性而降低能力",
    "Holder's moves that hit 2-5 times hit 4-5 times; Population Bomb hits 4-10 times.": "在使用连续攻击2～5次的招式或鼠数儿时，至少攻击4次",
    "When an opposing Pokemon raises a stat stage, the holder copies it. Single use.": "在对手提高能力时，有1次机会对其进行模仿并提高同样的能力。使用后消失",
    "Holder's punch-based attacks have 1.1x power and do not make contact.": "拳类招式威力上升10%且不会被视作接触类招式",
    "If held by a Farfetch’d, its critical hit ratio is raised by 2 stages.": "大葱鸭或葱游兵携带后击中要害等级提高2级",
    "Restores 60 HP to one Pokemon.": "回复该宝可梦60HP",
    "A big nugget of pure gold that gives off a lustrous gleam.": "以纯金制成，闪着金光的大珠子。可以在商店高价出售",
    "Ogerpon-Cornerstone: 1.2x power attacks; Terastallize to gain Embody Aspect.": "厄诡椪-础石携带后招式威力提升20%；太晶化后特性变为面影辉映",
    "Ogerpon-Hearthflame: 1.2x power attacks; Terastallize to gain Embody Aspect.": "厄诡椪-火灶携带后招式威力提升20%；太晶化后特性变为面影辉映",
    "Ogerpon-Wellspring: 1.2x power attacks; Terastallize to gain Embody Aspect.": "厄诡椪-水井携带后招式威力提升20%；太晶化后特性变为面影辉映",








    //  前代招式

    "Has 1/3 recoil.": "有1/3的反弹伤害",
    "Destroys screens, even if the target is immune.": "摧毁目标队伍的墙，即使目标免疫此攻击",
    "Causes the foe(s) to fall asleep.": "使对方全体陷入睡眠状态",
    "-1 evasion; clears target side's hazards/screens.": "令目标的闪避率降低1级。去除目标场地的墙、撒菱、隐形岩、毒菱和黏黏网",
    "For 2-5 turns, disables the target's last move.": "2～5回合内，目标最后使用的招式将无法再被使用",
    "For 4-7 turns, disables the target's last move.": "4～7回合内，目标最后使用的招式将无法再被使用",
    "For 5 turns, damage to allies halved. Snow only.": "5回合内，同伴所受到的伤害为原来的一半。只能在下雪时使用",
    "Hits adjacent Pokemon. Power doubles on Dig.": "攻击周围的宝可梦，对挖洞状态的目标伤害翻倍",
    "For 1-7 turns, disables the target's last move.": "目标接下来的1～7回合，只能使用其最后使用的招式",
    "The target repeats its last move for 3-6 turns.": "目标接下来的3～6回合，只能使用其最后使用的招式",
    "The target repeats its last move for 4-8 turns.": "目标接下来的4～8回合，只能使用其最后使用的招式",
    "Has 1/3 recoil. 10% chance to burn. Thaws user.": "10%概率灼伤。有1/3的反弹伤害。使用后解冻",
    "If miss, user takes 1/8 damage it would've dealt.": "如果招式未命中，使用者将受到本应造成的1/8伤害",
    "If miss, user takes 1/2 damage it would've dealt.": "如果招式未命中，使用者将受到本应造成的1/2伤害",
    "Target's item is lost and it cannot obtain another.": "拍落目标物品并且目标无法获得其他物品",
    "Traps and damages the target for 2-5 turns.": "困住并伤害目标2～5回合",
    "30% chance to badly poison the target.": "30%几率使目标中毒",
    "Breaks protection. Fails if target is not protecting.": "破坏保护。如果目标未进行保护则使用失败",
    "Weakens Electric-type attacks to 1/3 their power.": "电属性招式的威力变为原来的1/3",
    "Weakens Electric-type attacks to 1/2 their power.": "电属性招式的威力变为原来的1/2",
    "Power doubles during Bounce and Fly.": "如果目标处于飞翔或弹跳状态，威力翻倍",
    "Raises the user's Sp. Atk by 1.": "提升1级特攻",
    "Hits adjacent Pokemon. Power doubles on Dive.": "攻击周围的宝可梦，对潜水状态的目标伤害翻倍",
    "Can hit Pokemon using Bounce or Fly.": "可以击中使用弹跳、飞翔的宝可梦",
    "Varies in power and type based on the user's IVs.": "招式属性和伤害与使用者的个体值有关",
    "Lowers the foe(s) Speed by 1.": "令敌方的速度降低1级",
    "For 3 turns, allies' Speed is doubled.": "3回合内，我方全体速度翻倍",
    "For 3-5 turns, the target can't use status moves.": "使目标接下来的3～5回合无法使用变化招式",
    "Changes user's type to match a known move.": "改变自身属性为自己学会的随机一个招式的属性",
    "User's type changes to resist last move against it.": "改变自身属性为上回合目标使用招式的属性对自身效果不理想或没有效果的属性。",
    "Lowers the foe(s) evasiveness by 1.": "令对手l的闪避率降低1级",
    "Lasts 2-5 turns. Active Pokemon cannot sleep.": "在2～5回合内攻击对手。在此期间谁都不能入眠",
    "Lasts 3-6 turns. Active Pokemon cannot sleep.": "在3～6回合内攻击对手。在此期间谁都不能入眠",
    "Weakens Fire-type attacks to 1/2 their power.": "进入玩水状态。玩水状态的宝可梦在场时，火属性招式威力减半",
    "Weakens Fire-type attacks to 1/3 their power.": "进入玩水状态。玩水状态的宝可梦在场时，火属性招式威力降低至1/3",
    "Next turn, heals 50% of the recipient's max HP.": "下一回合使用者回复自己的50%最大HP",
    "Has 1/3 recoil. 10% chance to paralyze target.": "有1/3的反弹伤害。10%概率使目标麻痹",
    "10% chance to freeze foe(s).": "10%概率使目标冰冻",
    "Power doubles if the targeted foe is switching out.": "如果目标在本回合内准备替换下场，伤害翻倍",
    "Damage doubles and type varies during weather.": "伤害翻倍，属性随天气变化而变化",
    "Changes user's type based on terrain. (Normal)": "根据地形或场地型状态改变使用者的属性（普通）",
    "The user's Electric attack next turn has 2x power.": "使用者的下次电属性招式伤害翻倍",
    "User recovers 1/16 max HP per turn. Traps user.": "使自己无法交换下场。每回合回复最大HP的1/16",
    "Charges, then hits foe(s) turn 2.": "制造风之刃，于下回合攻击对手。",
    "Attack changes based on terrain. (Swift)": "根据使用场所不同，该招式的追加效果也会有所变化（迅速）",
    "Damage doubles if user is hit by the target.": "如果目标本回合内攻击过自身并造成伤害，威力翻倍",
    "Damage doubles if target is paralyzed; cures it.": "如果目标处于麻痹状态，招式的威力加倍。解除目标的麻痹状态",
    "Lowers the PP of the target's last move by 2-5.": "对手最后使用的招式的PP降低2～5点",
    "Hits foes. Power doubles against Dive.": "如果目标处于潜水状态，威力翻倍",
    "10% chance to lower the foe(s) Defense by 1.": "10%几率令目标的特防降低1级",
    "Raises user's Stockpile count by 1. Max 3 uses.": "提高1级防御和特防。最多积蓄3次",
    "Power doubles on Dig.": "如果目标处于挖洞状态，威力翻倍",
    "For 5 turns, the user's party has doubled Sp. Def.": "5回合内，我方特防翻倍",
    "The next move will not miss the target.": "下次攻击必定命中",
    "Raises the user's critical hit ratio by 1.": "提升1级击中要害率",
    "Power doubles during Fly.": "如果目标处于飞翔状态，威力翻倍",
    "Lowers the target's evasiveness by 1.": "降低目标1级闪避率",
    "Power doubles if the foe is switching out.": "如果目标替换下场，伤害翻倍",
    "For 5 turns, the user's party has doubled Def.": "5回合内，我方防御翻倍",
    "Hurts grounded foes on switch-in. Max 1 layer.": "使目标场地进入撒菱状态。最多1层",
    "10% chance to lower the target's Defense by 1.": "10%几率降低目标1级防御",
    "Next Rage increases in damage if hit during use.": "在使用该技能之后，下次行动之前，只要被命中，自身攻击提升1级",
    "Charges, then hits target turn 2. High crit ratio.": "制造风之刃，于第2回合攻击对手。容易击中要害",
    "Hits 1-3 times. Power rises with each hit.": "连续攻击1～3次。每一次的威力都会提升",
    "Hits 2 times. Last hit has 20% chance to poison.": "连续攻击2次。最后一次有20%几率令目标中毒",
    "Changes user's type to resist the foe's last move.": "改变自身属性为自己最后使用招式的属性",
    "Fails when used in Link Battles.": "在连接对战中使用写生会失败",
    "Destroys the foe(s) Berry.": "烧毁敌方的树果",
    "Changes user's type based on terrain. (Ground)": "根据地形更改使用者的属性。（地面）",
    "Effect varies with terrain. (30% chance acc -1)": "追加效果根据场地有所变化。（30%几率降低1级能力）",
    "Protects allies from multi-target damage this turn.": "处于广域防守状态的场地上的宝可梦不会受到我方全体或场上全体的招式的攻击",
    "This Pokemon is immune to damage from Sandstorm or Hail.": "该特性的宝可梦不会受到沙暴和冰雹天气的伤害",
    "30% chance to make the target flinch.": "30%几率使目标陷入畏缩",
    "20% chance to make the target flinch.": "20%几率使目标陷入畏缩",
    "10% chance to make the target flinch.": "10%几率使目标陷入畏缩",
    "Damage doubles if the target is Dynamaxed.": "如果目标处于极巨化状态，威力翻倍",
    "Uses user's Def stat as Atk in damage calculation.": "使用自身的防御代替自身的攻击进行伤害计算",
    "Power doubles if user moves before the target.": "如果比对手先出手攻击，招式的威力会变成2倍",
    "User loses 33% of its max HP. +1 to all stats.": "使用者的攻击、防御、特攻、特防和速度会各上升1级",
    "Swaps user's field effects with the opposing side.": "可交换招式使用方和对方的部分场地状态",
    "-1 evasion; clears terrain and hazards on both sides.": "令目标的闪避率降低1级。能够移除双方场地上的场地型状态",
    "Hits twice. 30% chance to make the target flinch.": "连续攻击对手两次。30%几率使目标陷入畏缩",
    "Hits twice. Doubles: Tries to hit each foe once.": "连续攻击2次。双打：对两只对手宝可梦分别进行一次攻击",
    "Removes 3 PP from the target's last move.": "对手最后使用的招式的PP降低3点",
    "Removes adjacent Pokemon's held items.": "融化相邻宝可梦所携带的道具",
    "User on Psychic Terrain: 1.5x power, hits foes.": "在精神场地上：威力提升1.5倍",
    "20% chance to make the foe(s) flinch.": "20%几率使目标陷入畏缩",
    "Power doubles if used after Fusion Flare this turn.": "如果本回合上一个成功使用的招式是交错火焰，威力翻倍",
    "Power doubles if used after Fusion Bolt this turn.": "如果本回合上一个成功使用的招式是交错闪电，威力翻倍",
    "Target: 100% -1 Def. During Gravity: 1.5x power.": "100%降低目标的防御1级，在重力状态时威力提升1.5倍",
    "User faints. Next hurt Pokemon is fully healed.": "自己濒死，治愈下个上场的宝可梦的异常状态并回满HP",
    "Protects from damaging attacks. Contact: -1 Atk.": "守住并变为防御姿态。降低所接触到的对手的1级攻击",
    "Protects from damaging attacks. Contact: -2 Atk.": "守住并变为防御姿态。降低所接触到的对手的2级攻击",
    "2x power if the user had a stat lowered this turn.": "若该回合内自身能力变化曾降低过，则招式威力变成2倍",
    "User faints. Next hurt Pkmn is cured, max HP/PP.": "自己濒死，治愈后备下个的宝可梦的异常状态并回满HP/PP",
    "Protects from damaging attacks. Contact: -2 Def.": "守住并降低所接触到的对手的2级防御",
    "No additional effect. Hits foe(s).": "攻击对手造成伤害",
    "Fails if the target has no held item.": "当对手没有携带道具时，使用此招式时便会失败",
    "If a foe is switching out, hits it at 2x power.": "当对手替换宝可梦时使出此招式的话，威力翻倍",
    "30% chance to make the foe(s) flinch.": "30%几率使对手陷入畏缩",
    "20% psn. Physical+contact if it would be stronger.": "从物理攻击和特殊攻击中选择造成较多伤害的方式进行攻击。20%几率中毒",
    "High critical hit ratio. Cannot be redirected.": "击中要害率比普通招式高1级",
    "Ends the effects of terrain.": "攻击目标造成伤害。使场地状态消失",
    "Fails if there is no terrain active. Ends the terrain.": "攻击后破坏场地型状态。如果不存在场地型状态，使用失败",
    "Always results in a critical hit. Hits 3 times.": "连续攻击3次。每一击都必定击中要害",
    "100% chance to lower the foe(s) Attack by 1.": "100%令攻击到的目标物攻降低1级",
    "Raises an ally's Attack and Defense by 1.": "提高我方全员的攻击和防御各1级 ",
    "100% burns a target that had a stat rise this turn.": "令该回合内能力变化曾提高过的宝可梦陷入灼伤状态",
    "Removes adjacent Pokemon's held items.": "融化相邻宝可梦所携带的道具",
    "5 turns: no Ground immunities, 1.67x accuracy.": "场上生成强重力，持续时间为5回合",
    "Prevents both user and target from switching out.": "使攻击方和目标都陷入无法逃走状态",
    "Raises the target's Attack and Sp. Atk by 2.": "令目标的攻击和特攻提升2级。",
    "User on Grassy Terrain: +1 priority.": "在青草场地上，若使用者为地上的宝可梦，优先度+1",
    "User and allies: healed 1/4 max HP, status cured.": "回复自己和场上同伴最大HP的1/4并治愈所有异常状态",
    "Heals the user and its allies by 1/4 their max HP.": "回复自己和场上同伴最大HP的1/4",
    "Raises user's Sp. Atk by 1 on turn 1. Hits turn 2.": "第1回合蓄力提高特攻，第2回合攻击对手",
    "User faints. User on Misty Terrain: 1.5x power.": "使用者陷入濒死。若使用者站在地上，威力提升1.5倍",
    "Traps target, lowers Def and SpD by 1 each turn.": "使目标陷入无法逃走状态，每回合令其防御和特防降低1级",
    "Hits 2-5 times. User: -1 Def, +1 Spe after last hit.": "连续攻击2～5次。速度会提高但防御会降低",
    "100% chance to lower target's Sp. Atk by 1.": "100%令攻击到的目标特攻降低1级",
    "Must hold Berry to use. User eats Berry, Def +2.": "消耗掉使用者所携带的树果。令使用者的防御提升2级",
    "User on terrain: power doubles, type varies.": "使出招式时场地状态不同，招式的属性和威力会有所变化",
    "Base move affects power. Allies: +1 Speed.": "威力由原本招式的威力决定。提高我方的速度",
    "Base move affects power. Foes: -1 Sp. Def.": "威力由原本招式的威力决定。降低对手的特防",
    "Base move affects power. Starts Sunny Day.": "威力由原本招式的威力决定。5回合内让日照变得强烈",
    "Base move affects power. Foes: -1 Sp. Atk.": "威力由原本招式的威力决定。降低对手的特攻",
    "Base move affects power. Starts Rain Dance.": "威力由原本招式的威力决定。5回合内降下大雨",
    "Protects user from moves & Max Moves this turn.": "完全抵挡对手包括极巨招式在内的攻击，连续使用容易失败",
    "Base move affects power. Starts Hail.": "威力由原本招式的威力决定。5回合内会降下冰雹",
    "Base move affects power. Allies: +1 Attack.": "威力由原本招式的威力决定。提高我方的攻击。",
    "Base move affects power. Starts Electric Terrain.": "威力由原本招式的威力决定。5回合内将脚下变成电气场地",
    "Base move affects power. Starts Psychic Terrain.": "威力由原本招式的威力决定。5回合内将脚下变成精神场地",
    "Base move affects power. Allies: +1 Sp. Atk.": "威力由原本招式的威力决定。降低对手的特攻",
    "Base move affects power. Starts Grassy Terrain.": "威力由原本招式的威力决定。5回合内将脚下变成青草场地",
    "Base move affects power. Foes: -1 Defense.": "威力由原本招式的威力决定。降低对手的防御",
    "Base move affects power. Allies: +1 Sp. Def.": "威力由原本招式的威力决定。提高我方的特防",
    "Base move affects power. Starts Sandstorm.": "威力由原本招式的威力决定。5回合内卷起沙暴",
    "Base move affects power. Starts Misty Terrain.": "威力由原本招式的威力决定。5回合内将脚下变成薄雾场地",
    "Base move affects power. Allies: +1 Defense.": "威力由原本招式的威力决定。提高我方的防御",
    "Base move affects power. Foes: -1 Speed.": "威力由原本招式的威力决定。降低对手的速度",
    "Base move affects power. Foes: -1 Attack.": "威力由原本招式的威力决定。降低对手的攻击",
    "Fails when used.": "与训练师的对战中使用会失败",
    "Frees user from hazards, binding, Leech Seed.": "移除己方场地上的撒菱、隐形岩、毒菱和黏黏网；摆脱自身束缚，寄生种子状态",
    "Protects from attacks. Contact: lowers Atk by 2.": "抵挡对手的攻击。如果对手使用了接触类招式，攻击降低2级",







    //  招式效果

    "30% chance to confuse. 50% recoil if it misses.": "30%几率使目标混乱，如果招式未命中则使用者失去50%最大HP",
    "30% chance to lower the foe(s) Speed by 1.": "30%几率降低目标1级速度",
    "Deals 1.3x damage if the move is super effective.": "出现效果绝佳时威力提升30%",
    "50% chance to raise user's Defense by 2.": "50%几率令使用者的防御提高2级",
    "High critical hit ratio. 50% chance to slp/psn/par target.": "容易击中要害，50%几率使目标陷入中毒、麻痹、瞌睡之中的一种状态",
    "High critical hit ratio. Raises the user's Speed by 1.": "容易击中要害，令使用者的速度提高1级",
    "Cannot be used twice in a row.": "无法连续使用",
    "Nullifies protection moves.": "无视守住类招式",
    "30% chance to confuse the target.": "30%几率使目标混乱",
    "Lowers the user's Sp. Atk by 1.": "使用者的特攻会降低1级",
    "+1 to stat depending on Tatsugiri color.": "若口中有米立龙，会按其样子提高能力，提升幅度为1级",
    "Destroys screens. Type depends on user's form.": "招式的属性随形态改变，可以破坏光墙和反射壁等招式",
    "20% chance to burn foe(s).": "20%几率使目标灼伤",
    "Lowers the user's Speed by 2.": "令使用者的速度降低2级",
    "30% chance lower adjacent Pkmn Attack by 1.": "30%几率降低相邻的精灵1级物攻",
    "100% chance to raise the user's Sp. Atk by 1.": "100%几率提高使用者1级特攻",
    "High critical hit ratio. 50% -1 Def. 10% to flinch.": "容易击中要害，且50%几率降低目标1级防御、10%几率使目标畏缩",
    "10% chance to sleep target.": "10%几率使目标陷入睡眠状态",
    "20% chance to paralyze foe(s).": "20%几率使目标陷入麻痹状态",
    "High critical hit ratio. Foes: Spikes.": "容易击中要害。向对手的场地撒菱",
    "Snowscape begins. User switches out.": "和后备宝可梦替换并使天气变为持续5回合的雪景",
    "User and ally's Abilities become target Abilities": "将自己和同伴的特性变得和目标相同",
    "User and ally's Abilities become target Ability": "将自己和同伴的特性变得和目标相同",
    "User loses 50% of its max HP. +2 to Atk, Sp. Atk, Spe.": "使用者削减50%最大HP，使攻击、特攻、速度上升2级",
    "Always results in a critical hit; does not check accuracy.": "必定会命中，且必定会击中要害",
    "30% chance to burn. 2x power if target is statused.": "30%几率使目标陷入灼伤状态，攻击处于异常状态的目标时，威力翻倍",
    "Power increases by 50 with each fainted party member.": "每有一只我方宝可梦被打倒，都将使招式威力提升50",
    "Free user from hazards/bind/Leech Seed; poisons opponents.": "使目标中毒。可以摆脱绑紧、紧束、寄生种子等招式",
    "Hits 10 times. Each hit can miss.": "攻击10次，每次攻击都可能被闪避",
    "100% chance to raise the user's Defense by 1.": "100%几率提高使用者1级防御",
    "Power increases by 50 each time user is hit.": "受到攻击的次数越多，招式的威力越高",
    "2x power if target is grounded in Electric Terrain.": "在电气场地上:威力翻倍",
    "Revives a fainted Pokemon to 50% HP.": "让失去战斗能力的后备宝可梦以50%HP的状态复活",
    "Deals 1/8 max HP every turn; 1/4 if Steel or Water.": "每回合造成1/8最大生命值的伤害，如果是钢属性或水属性则为1/4",
    "For 5 turns, a sandstorm rages. Rock: 1.5x SpD.": "使天气变为沙暴，持续5回合",
    "User takes 1/2 its max HP to pass a substitute.": "削减1/2HP制造分身，并和后备宝可梦进行替换",
    "Protects from damaging attacks. Contact: -1 Spe.": "免受对手攻击，并使接触到的对手的速度降低1级",
    "For 5 turns, snow falls. Ice: 1.5x Def.": "使天气变为雪景，持续5回合",
    "Target: +2 Atk, -2 Def.": "使目标的攻击提升2级，防御降低2级",
    "High critical hit ratio. Foes: Stealth Rock.": "容易击中要害。向对手的场地洒隐形岩",
    "Cures status. Raises Sp. Atk and Sp. Def by 1.": "治愈异常状态，使用者的特攻和特防提高1级",
    "Hits 3 times.": "攻击三次",
    "Raises the user Attack": "提升使用者的攻击",
    "Raises the user攻击": "提升使用者的攻击",
    "Raises the user's Attack": "提升使用者的攻击",
    "User's Electric type becomes typeless; must be Electric.": "令使用者的电属性消失；使用者必须为电属性",
    "Very high critical hit ratio.": "十分容易击中要害",
    "User recovers 50% of the damage dealt.": "使用者将造成伤害的50%转化为自身的HP",
    "Usually goes first.": "先制攻击",
    "10% chance to lower the foe(s) Sp. Def by 1.": "10%几率令目标的特防降低1级",
    "Raises the user's Defense by 2.": "令使用者的防御提升2级",
    "Power is equal to the base move's Z-Power.": "威力会根据原来的招式而改变",
    "100% chance to lower the target's Sp. Def by 2.": "100%几率令目标的特防降低2级",
    "Power doubles if the user has no held item.": "没有携带道具时，威力翻倍",
    "Raises a random stat of the user or an ally by 2.": "使自身或伙伴随机一项能力提升2级",
    "High critical hit ratio.": "容易击中要害",
    "The target makes its move right after the user.": "目标将会在使用者之后立刻行动",
    "Raises the user's Speed by 2.": "令使用者的速度提升2级",
    "High critical hit ratio. Hits adjacent foes.": "容易击中要害攻击邻近的对手",
    "30% chance to flinch the target.": "30%几率使目标陷入畏缩",
    "The user swaps positions with its ally.": "使用者与同伴交换位置",
    "Raises the user's Sp. Def by 2.": "令使用者的特防提升2级",
    "Prevents the target from switching out.": "令目标陷入无法逃走状态",
    "10% chance to raise all stats by 1 (not acc/eva).": "有10%几率提升自身各项能力1级（除闪避率，命中率）",
    "User recovers 1/16 max HP per turn.": "使用者每回合回复自身1/16最大HP",
    "No additional effect.": "攻击目标造成伤害",
    "Hits 2-5 times in one turn.": "一回合内攻击2～5次",
    "Cures the user's party of all status conditions.": "治愈使用者队伍中所有宝可梦的异常状态",
    "Raises an ally's Sp. Def by 1.": "提升一名同伴的特防1级",
    "Uses a random move known by a team member.": "随机使用队伍里一个成员已习得的招式",
    "Power doubles if target was damaged this turn.": "如果使用者在这回合受到了攻击，威力翻倍",
    "A target of the opposite gender gets infatuated.": "和使用者性别不同的目标会陷入着迷状态",
    "For 5 turns, damage to allies is halved. Hail only.": "5回合内，友军受到伤害减半。只能在冰雹天气时使用",
    "Raises the user's Speed by 2; user loses 100 kg.": "使用者速度提升2级并减少100kg体重",
    "Power doubles if user is damaged by the target.": "如果被目标攻击的话，威力翻倍",
    "Lowers the target's Attack by 1.": "令目标的攻击下降1级",
    "Protects from moves. Contact: poison.": "使自己进入守住状态，接触到的对手会陷入中毒状态",
    "User switches, passing stat changes and more.": "使用者和后备宝可梦替换，能够接力能力阶级变化等",
    "Burns on contact with the user before it moves.": "在使用招式前接触到使用者的对手会陷入灼伤状态",
    "All healthy allies aid in damaging the target.": "所有健康的己方宝可梦会一起攻击目标",
    "Cannot be selected until the user eats a Berry.": "使用者食用树果前不能被使用",
    "User loses 50% max HP. Maximizes Attack.": "使用者失去自身50%最大HP，使攻击最大化",
    "User passes its held item to the target.": "使用者将持有的道具移交给目标",
    "Waits 2 turns; deals double the damage taken.": "等待两回合，之后将受到的伤害双倍奉还给对手",
    "Traps and damages the target for 4-5 turns.": "困住并伤害目标4～5回合",
    "User cannot move next turn.": "使用者下回合无法移动",
    "High critical hit ratio. 10% chance to burn.": "容易击中要害有10%几率使对手陷入灼伤状态",
    "10% chance to freeze foe(s). Can't miss in hail.": "有10%几率使目标陷入冰冻状态。在冰雹天气时攻击不会被闪避",
    "20% chance to burn the target.": "有20%几率使目标陷入灼伤状态",
    "30% chance to paralyze the target.": "有30%几率使目标陷入麻痹状态",
    "20% chance to paralyze the target.": "有20%几率使目标陷入麻痹状态",
    "10% chance to flinch the target.": "有10%几率使目标畏缩",
    "Hits 2 times in one turn.": "一回合内攻击2次",
    "No additional effect. Hits adjacent Pokemon.": "攻击目标造成伤害攻击邻近的宝可梦",
    "Bounces turn 1. Hits turn 2. 30% paralyze.": "第一回合跃起，第二回合攻击。有30%几率使目标麻痹",
    "Has 33% recoil.": "有33%的反弹伤害",
    "Destroys screens, unless the target is immune.": "摧毁目标队伍的墙，除非目标免疫此攻击",
    "Power doubles if the target's HP is 50% or less.": "如果目标的HP为最大HP的一半或更少，此招式威力翻倍",
    "10% chance to lower the foe(s) Speed by 1.": "有10%几率使（所有）对手的速度下降1级",
    "10% chance to lower the target's Speed by 1.": "有10%几率使目标的速度下降1级",
    "User steals and eats the target's Berry.": "使用者将窃取并食用目标的树果",
    "10% chance to lower the target's Sp. Def by 1.": "有10%几率使目标的特防下降1级",
    "Raises the user's Attack and Defense by 1.": "提升使用者的攻击和防御各1级",
    "User's Fire type becomes typeless; must be Fire.": "令使用者的火属性消失；使用者必须为火属性",
    "Raises the user's Sp. Atk and Sp. Def by 1.": "提升使用者的特攻和特防各1级",
    "Changes user's type by terrain (default Normal).": "根据场地改变使用者的属性",
    "Lowers the foe(s) Sp. Atk by 2 if opposite gender.": "如果目标的性别和使用者相反，目标的特攻下降2级",
    "70% chance to raise the user's Sp. Atk by 1.": "有70%几率令使用者的特攻上升1级",
    "Lowers the target's Attack by 2.": "使目标的攻击下降2级",
    "100% chance to confuse the target.": "100%使目标混乱",
    "Ignores the target's stat stage changes.": "无视目标的能力阶级变化进行攻击",
    "Forces the target to switch to a random ally.": "使目标和后备宝可梦替换",
    "Lowers the user's Defense by 1.": "令使用者的防御下降1级",
    "Lowers the user's Defense and Sp. Def by 1.": "令使用者的防御和特防下降1级",
    "Lowers the target's Sp. Atk by 1.": "使目标的特攻下降1级",
    "Confuses the target.": "使目标陷入混乱状态",
    "10% chance to confuse the target.": "有10%几率使目标陷入混乱状态",
    "Changes user's type to match its first move.": "令使用者的属性变的和自身已学会的第一个招式的属性相同",
    "Changes user's type to resist target's last move.": "使自己的属性变的对目标最后使出的招式属性有抗性",
    "Uses the last move used in the battle.": "使用上一个在对战中使用的招式",
    "Raises the user's Defense and Sp. Def by 1.": "提升使用者的防御和特防各1级",
    "Raises the user's Defense by 3.": "提升使用者的防御3级",
    "Lowers the target's Speed by 2.": "使目标的速度下降2级",
    "If hit by physical attack, returns double damage.": "如果被物理攻击伤害，则返还对手两倍的伤害",
    "If the user has no item, it steals the target's.": "如果使用者没有持有道具，将会偷走目标的道具",
    "Protects allies from Status moves this turn.": "保护所有同伴免受变化招式的影响",
    "High critical hit ratio. 10% chance to poison.": "容易击中要害。有10%几率使对手中毒",
    "50% chance to lower the target's Defense by 1.": "有50%几率使目标的防御下降1级",
    "More power the more HP the target has left.": "目标剩余的HP越多，此招式威力越高",
    "20% chance to flinch the target.": "有20%几率使目标畏缩",
    "-1 evasion; clears user and target side's hazards.": "使目标的闪避率下降1级，并清除目标队伍的白雾",
    "If an opponent knocks out the user, it also faints.": "如果对手令使用者陷入濒死状态，那么它也同样也陷入濒死",
    "Prevents moves from affecting the user this turn.": "本回合内，避免招式对使用者造成影响",
    "50% chance to raise user's Def by 2 for each hit.": "每一次攻击都有50%几率令使用者的防御提升2级",
    "Digs underground turn 1, strikes turn 2.": "第一回合找个地缝钻进去，第二回合攻击",
    "For 4 turns, disables the target's last move used.": "4回合内，目标最后使用的招式将无法再被使用",
    "This move does not check accuracy. Hits foes.": "攻击一定会命中攻击所有对手",
    "30% chance to paralyze adjacent Pokemon.": "有30%几率使邻近的宝可梦陷入麻痹状态",
    "Dives underwater turn 1, strikes turn 2.": "第一回合潜入水中，第二回合攻击",
    "20% chance to confuse the target.": "有20%几率使目标陷入混乱状态",
    "Hits two turns after being used.": "使用该招式后，两回合后触发攻击效果",
    "Raises the user's evasiveness by 1.": "令使用者的闪避率上升以1级",
    "Lowers the user's Sp. Atk by 2.": "令使用者的特攻下降2级",
    "Raises the user's Attack and Speed by 1.": "提升使用者的攻击和速度各1级",
    "User recovers 75% of the damage dealt.": "使用者将造成伤害的75%转化为自身的HP",
    "User gains 1/2 HP inflicted. Sleeping target only.": "将造成伤害的1/2转化为自身的HP。只能对睡眠宝可梦使用",
    "Power increases when used on consecutive turns.": "如果连续使用此招式威力会上升",
    "Lowers the target's Sp. Atk by 2.": "降低目标的特攻2级",
    "10% chance to freeze foe(s). Can't miss in Hail.": "10%几率冰冻。冰雹天气下必定命中",
    "5 turns. Grounded: +Electric power, can't sleep.": "5回合内，提升地上的宝可梦的电招式威力，不会陷入睡眠",
    "Changes the target's move to Electric this turn.": "使目标这回合使用的招式属性变为电属性",
    "More power the faster the user is than the target.": "使用者比目标速度越快，此招式威力越高",
    "100% chance to lower the foe(s) Speed by 1.": "100%使(所有)对手的速度下降1级",
    "For 5 turns, the target's item has no effect.": "5回合内，目标的道具不会有任何效果",
    "10% chance to burn the target.": "有10%几率使目标陷入灼伤状态",
    "Lowers the target's HP to the user's HP.": "使目标的HP降得和使用者的HP相同",
    "The target's Ability changes to match the user's.": "目标的特性将会变得和使用者相同",
    "Less power as user's HP decreases. Hits foe(s).": "使用者的HP剩下的越少，威力越小，攻击（所有）对手",
    "Hits adjacent Pokemon. The user faints.": "攻击邻近的宝可梦使用者陷入濒死状态",
    "Raises user's Atk, Def, SpA, SpD, and Spe by 2.": "提升使用者的攻击防御特攻特防速度各2级",
    "Nearly always goes first.": "几乎总是先发制人",
    "Power doubles if user is burn/poison/paralyzed.": "如果使用者处于灼伤/中毒/麻痹状态，威力翻倍",
    "Prevents all Pokemon from switching next turn.": "下一回合内，阻止所有宝可梦的替换",
    "Hits first. First turn out only. 100% flinch chance.": "先制攻击。只能在出场后第一回合使用。100%使目标畏缩",
    "Lowers the target's Sp. Def by 2.": "使目标的特防下降2级",
    "Always leaves the target with at least 1 HP.": "总会使目标留下至少一点HP",
    "Nullifies Detect, Protect, and Quick/Wide Guard.": "取消目标的守住/广域防守/快速防守的效果",
    "Raises user's Attack by 3 if this KOes the target.": "如果这一击击倒了目标，使用者的攻击提升3级",
    "50% chance to raise the user's Sp. Atk by 1.": "有50%几率令使用者的特攻上升1级",
    "Does damage equal to the user's HP. User faints.": "造成的伤害和使用者当前的HP相同。使用者陷入濒死状态",
    "10% chance to burn. 10% chance to flinch.": "有10%几率使目标陷入灼伤状态。有10%几率使目标畏缩",
    "100% chance to lower the target's Defense by 1.": "100%使目标的防御下降1级",
    "Use with Grass or Water Pledge for added effect.": "和草或水之誓言同时使用会有特效",
    "Hits first. First turn out only.": "先制攻击，只能在出场后第一回合使用",
    "OHKOs the target. Fails if user is a lower level.": "一击必杀。如果使用者的等级低于目标，使用失败",
    "More power the less HP the user has left.": "使用者的HP越少，招式威力越高",
    "Damages Pokemon next to the target as well.": "击中目标的同时也会伤害到其身边的宝可梦",
    "100% chance to raise the user's Speed by 1.": "100%令使用者的速度上升1级",
    "10% chance to burn the target. Thaws user.": "10%使目标陷入灼伤状态。令使用者解冻",
    "Has 33% recoil. 10% chance to burn. Thaws user.": "有33%的反弹伤害。10%使目标陷入灼伤。令使用者解冻",
    "Lowers the target's accuracy by 1.": "使目标的命中率下降1级",
    "Raises the target's Sp. Atk by 1 and confuses it.": "使目标的特攻上升1级，使目标陷入混乱状态",
    "Flings the user's item at the target. Power varies.": "使用者投掷携带的道具进行攻击威力会改变",
    "Heals the target by 50% of its max HP.": "使目标回复其50%最大HP",
    "Raises Defense by 1 of all active Grass types.": "使场上所有草属性宝可梦的防御提升1级",
    "Flies up on first turn, then strikes the next turn.": "第一回合上天，第二回合攻击",
    "Combines Flying in its type effectiveness.": "此招式同时也具备飞行属性",
    "Raises the user's critical hit ratio by 2.": "令使用者的击中要害阶级提升2级",
    "Fails if the user takes damage before it hits.": "如果在使用招式前受到攻击则招式使用失败",
    "The foes' moves target the user on the turn used.": "所有对手使用的作用范围为单体选择的招式都会攻向自己",
    "Fighting, Normal hit Ghost. Evasiveness ignored.": "格斗属性，一般属性招式能击中幽灵属性无视闪避率变化",
    "Adds Grass to the target's type(s).": "使目标增加草属性",
    "Uses target's Attack stat in damage calculation.": "使用目标的攻击代替使用者的攻击进行伤害计算",
    "10% chance to freeze. Super effective on Water.": "有10%几率使目标陷入冰冻状态。对水属性效果绝佳",
    "Charges turn 1. Hits turn 2. 30% paralyze.": "第一回合蓄力，第二回合攻击。30%几率使目标麻痹",
    "Always results in a critical hit.": "一定会造成击中要害",
    "Max 102 power at minimum Happiness.": "当亲密值最低的时候达到最大威力102",
    "Power doubles with each hit, up to 160.": "每次连斩都会使下次攻击的威力加倍，最高为160",
    "Power doubles if used after Fusion Flare.": "如果在攻击前被交织火焰击中的话威力加倍",
    "Power doubles if used after Fusion Bolt.": "如果在攻击前被交织闪电击中的话威力加倍",
    "Nullifies the target's Ability.": "令目标的特性无效",
    "Raises Atk, Sp. Atk of allies with Plus/Minus by 1.": "提升特性为正电/负电的宝可梦的攻击和特攻各1级",
    "Summons Psychic Terrain.": "散布精神场地",
    "Charges, then raises SpA, SpD, Spe by 2 turn 2.": "蓄力，然后提升使用者的特攻、特防和速度各2级",
    "Paralyzes the target.": "使目标陷入麻痹状态",
    "More power the heavier the target.": "目标越重，威力越大",
    "Use with Fire or Water Pledge for added effect.": "和火或水之誓言同时使用会有特效",
    "For 5 turns, negates all Ground immunities.": "5回合内无视所有对地面属性的免疫",
    "Lowers the foe(s) Attack by 1.": "使（所有）对手的攻击下降1级",
    "Raises user's Attack and Sp. Atk by 1; 2 in Sun.": "让使用者的攻击和特攻上升1级，大晴天上升2级",
    "If the user faints, the attack used loses all its PP.": "如果使用者被击倒，击倒自己的那个的招式PP归零",
    "Averages Defense and Sp. Def stats with target.": "平分使用者和目标的防御和特防",
    "Swaps Defense and Sp. Def changes with target.": "交换使用者和目标的防御和特防",
    "Does damage equal to 3/4 target's current HP.": "目标失去3/4最大HP",
    "More power the slower the user than the target.": "使用者速度比目标越慢，威力越大",
    "For 5 turns, hail crashes down.": "5回合内为冰雹天气",
    "Lowers the user's Speed by 1.": "令使用者的速度下降1级",
    "Raises the user's Defense by 1.": "令使用者的防御提升1级",
    "Eliminates all stat changes.": "消除所有能力阶级变化",
    "Has 1/4 recoil.": "有1/4的反弹伤害",
    "Has 1/2 recoil.": "有1/2的反弹伤害",
    "For 5 turns, the foe(s) is prevented from healing.": "5回合内，（所有）对手无法使用治愈招式",
    "Heals the user by 50% of its max HP.": "令使用者回复自身50%最大HP",
    "User faints. Replacement is fully healed.": "使用者陷入濒死状态替换上场的宝可梦会被完全治愈",
    "Swaps all stat changes with target.": "交换自身和目标的能力阶级变化",
    "More power the heavier the user than the target.": "使用者比目标越重，招式威力越大",
    "10% chance to burn the foe(s).": "10%几率使目标陷入灼伤状态",
    "One adjacent ally's move power is 1.5x this turn.": "一名邻近的同伴此回合使出的招式威力变为原来的1.5倍",
    "Power doubles if the target has a status ailment.": "如果目标已经陷入负面状态则威力翻倍",
    "Varies in type based on the user's IVs.": "招式属性和使用者的个体值有关",
    "User is hurt by 50% of its max HP if it misses.": "如果招式未命中则使用者失去50%最大HP",
    "Raises the user's Attack and accuracy by 1.": "令使用者的攻击和命中率上升1级",
    "Raises the user's Attack by 1.": "令使用者的攻击上升1级",
    "30% chance to confuse target. Can't miss in rain.": "30%几率使目标陷入混乱状态。在雨天不能被闪避",
    "Breaks the target's protection for this turn.": "这一回合能够破坏对手的守住状态",
    "No additional effect. Hits adjacent foes.": "攻击对手造成伤害攻击邻近的宝可梦",
    "Power doubles with each hit. Repeats for 5 turns.": "每一次攻击威力都会翻倍，连续攻击5次",
    "10% chance to freeze the target.": "10%几率使目标陷入冰冻状态",
    "Charges turn 1. Hits turn 2. 30% burn.": "第一回合蓄力，第二回合攻击。有30%几率使目标灼伤",
    "10% chance to freeze. 10% chance to flinch.": "10%几率使目标陷入冰冻。10%几率使目标畏缩",
    "No foe can use any move known by the user.": "对手将无法使用使用者已习得的招式",
    "Destroys the foe(s) Berry/Gem.": "烧毁对手的树果和宝石",
    "100% chance to burn the target.": "100%使对手陷入灼伤状态",
    "The target immediately uses its last used move.": "目标会立即使用其上次使用的招式",
    "Normal moves become Electric type this turn.": "下一回合内一般属性招式会变为电属性招式",
    "30% chance to lower the target's Defense by 1.": "30%几率使目标的防御下降1级",
    "Type varies based on the held Plate.": "招式的属性会根据所持有的石板变化",
    "1.5x damage if foe holds an item. Removes item.": "拍落对手的物品。对手携带物品时本次攻击的伤害提升50%",
    "Fails unless each known move has been used.": "只有所有习得的其他招式被时出示才能使用该招式",
    "30% chance to burn adjacent Pokemon.": "30%使邻近的宝可梦陷入灼伤状态",
    "50% chance to lower the target's accuracy by 1.": "50%几率使目标的命中率下降1级",
    "1/8 of target's HP is restored to user every turn.": "每回合吸取目标最大生命值的1/8",
    "Lowers the foe(s) Defense by 1.": "使（所有）对手的防御下降1级",
    "For 5 turns, special damage to allies is halved.": "5回合内，对同伴的特殊攻击伤害减半",
    "20% chance to lower the target's Defense by 1.": "20%几率使目标的防御下降1级",
    "User's next move will not miss the target.": "使用者下一回合对目标的攻击将不会被闪避",
    "100% chance to lower the target's Speed by 1.": "100%使目标的速度下降1级",
    "For 5 turns, shields user's party from critical hits.": "5回合内，对手的攻击不会击中使用者的要害",
    "User faints. Replacement is fully healed, with PP.": "自己濒死，治愈后备下个的宝可梦的异常状态并回满HP/PP",
    "100% chance to lower the target's Attack by 1.": "100%使目标的攻击下降1级",
    "50% chance to lower the target's Sp. Def by 1.": "50%几率使目标的特防下降1级",
    "Bounces back certain non-damaging moves.": "将变化招式反弹回去",
    "For 5 turns, all held items have no effect.": "5回合内，场上所有携带的道具将不会有效果",
    "This move does not check accuracy.": "攻击一定会命中",
    "Raises Def, Sp. Def of allies with Plus/Minus by 1.": "提升具有正电/负电特性宝可梦的防御和特防1级",
    "Hits adjacent Pokemon. Power varies; 2x on Dig.": "攻击邻近的宝可梦威力随机变化，对挖洞的目标伤害翻倍",
    "Protects allies from attacks. First turn out only.": "防止同伴受到攻击，只能在出场后第一回合使用",
    "Copies a foe at 1.5x power. User must be faster.": "抢先使出对手将要使出的招式使用者必须更快",
    "Lowers target's Attack, Sp. Atk by 2. User faints.": "使目标的攻击和特攻下降2级，使用者陷入濒死状态",
    "If hit by an attack, returns 1.5x damage.": "如果因攻击而受到伤害，则返还1.5倍的伤害",
    "10% chance to raise the user's Attack by 1.": "10%令使用者的攻击上升1级",
    "20% chance to raise the user's Attack by 1.": "20%令使用者的攻击上升1级",
    "Picks a random move.": "根据使用者的运气随机使出一个招式",
    "Goes first. Raises user's evasion by 1.": "先制攻击。提升使用者的闪避率1级",
    "The last move the target used replaces this one.": "这个招式将会变成目标会后使出的招式",
    "Raises the user's evasiveness by 2.": "令使用者的闪避率上升2级",
    "Psychic hits Dark. Evasiveness ignored.": "超能力属性招式可以命中恶属性无视闪避率变化",
    "If hit by special attack, returns double damage.": "如果被特殊攻击伤害，则返还对手两倍的伤害",
    "User uses the target's last used move against it.": "使用目标最后使用过的招式",
    "30% chance to lower the target's accuracy by 1.": "30%几率使目标的命中率下降1级",
    "For 5 turns, protects user's party from stat drops.": "在5回合内不会让对手降低自己队伍中宝可梦的能力",
    "50% chance to lower the target's Sp. Atk by 1.": "50%几率使目标的特攻下降1级",
    "5 turns. Can't status,-Dragon power vs grounded.": "5回合内，地上的宝可梦不会陷入异常，受到龙属性伤害减半",
    "30% chance to lower the target's Sp. Atk by 1.": "30%几率使目标的特攻下降1级",
    "Ignores the Abilities of other Pokemon.": "无视目标的特性进行攻击",
    "Heals the user by a weather-dependent amount.": "恢复使用者的HP，回复量随天气变化",
    "100% chance to lower the target's accuracy by 1.": "100%使目标的命中率下降1级",
    "For 5 turns, Electric-type attacks have 1/3 power.": "5回合内，电属性招式的威力变为原来的1/3",
    "30% chance to lower the foe(s) accuracy by 1.": "30%几率使目标的命中率下降1级",
    "Type varies based on the held Memory.": "招式属性和携带的储存碟有关",
    "100% chance to lower the target's Sp. Atk by 1.": "100%下降目标的特攻1级",
    "Raises the user's Sp. Atk by 2.": "令使用者的特攻上升2级",
    "Power and type depends on the user's Berry.": "威力和属性基于使用者携带的树果",
    "Attack depends on terrain (default Tri Attack).": "攻击随着场地变化而变化默认为三重攻击",
    "Does damage equal to 1/2 target's current HP.": "攻击造成的伤害为目标剩下HP的50%",
    "40% chance to lower the target's accuracy by 1.": "40%几率使目标的命中率下降1级",
    "Does damage equal to the user's level.": "招式伤害和使用者的等级相同",
    "A sleeping target is hurt by 1/4 max HP per turn.": "睡眠中的目标每回合失去其1/4最大HP",
    "Lowers the target's Attack and Sp. Atk by 1.": "降低目标的攻击和特攻1级",
    "Lasts 2-3 turns. Confuses the user afterwards.": "持续2～3回合，乱打一通后陷入混乱",
    "Shares HP of user and target equally.": "平分使用者和目标的HP",
    "Lowers target's Atk, Sp. Atk by 1. User switches.": "降低目标的攻击和特攻1级，使用者和后备宝可梦替换",
    "Scatters coins.": "土豪来撒钱啦",
    "Power doubles if the user moves after the target.": "如果在目标之后攻击，威力翻倍",
    "All active Pokemon will faint in 3 turns.": "所有在场的宝可梦将在3回合后倒下",
    "Disappears turn 1. Hits turn 2. Breaks protection.": "第一回合突然消失，第二回合攻击破坏目标的守住状态",
    "10% chance to lower the target's Attack by 1.": "10%几率使目标的攻击下降1级",
    "50% chance to badly poison the target.": "50%几率使目标中剧毒",
    "Poisons the foe(s).": "使（所有）敌人中毒",
    "30% chance to poison the target.": "30%几率使目标中毒",
    "Poisons the target.": "使目标中毒",
    "If the target is an ally, heals 50% of its max HP.": "如果目标是同伴则恢复其50%最大HP",
    "If using a Fire move, target loses 1/4 max HP.": "如果目标使用了火属性招式则会失去1/4最大HP",
    "10% chance to freeze the foe(s).": "10%几率使（所有）对手陷入冰冻状态",
    "Averages Attack and Sp. Atk stats with target.": "和目标平分攻击和特攻",
    "Swaps Attack and Sp. Atk stat stages with target.": "交换使用者和目标的基础攻击和特攻能力值",
    "Switches user's Attack and Defense stats.": "交换使用者的攻击和防御基础能力值",
    "+ 20 power for each of the user's stat boosts.": "每上升1级能力招式威力增加20点",
    "100% chance to raise the user's Attack by 1.": "100%令使用者的攻击上升1级",
    "Copies the target's current stat stages.": "复制目标的能力阶级变化",
    "5 turns. Grounded: +Psychic power, priority-safe.": "5回合内地上的宝可梦超能力招式威力提升，无视先制招式",
    "Transfers the user's status ailment to the target.": "将使用者的负面状态转移给目标",
    "Damages target based on Defense, not Sp. Def.": "计算伤害时按防守方的防御计算，不是特防",
    "Random damage equal to 0.5x-1.5x user's level.": "伤害为0.5～1.5×使用者的等级",
    "60 power +20 for each of the target's stat boosts.": "威力为60+20×目标的能力阶级上升总和",
    "Power doubles if a foe is switching out.": "如果对手替换宝可梦，威力为原来的两倍",
    "Forces the target to move last this turn.": "使目标在本回合最后行动",
    "Protects allies from priority attacks this turn.": "保护同伴免受先制招式攻击",
    "Raises the user's Sp. Atk, Sp. Def, Speed by 1.": "提升使用者的特攻特防速度各1级",
    "Raises the user's Attack by 1 if hit during use.": "如果在使用招式时受到攻击，使用者的攻击上升1级",
    "For 5 turns, heavy rain powers Water moves.": "5回合内，大雨增加水属性招式的威力",
    "Charges, then hits foe(s) turn 2. High crit ratio.": "蓄力，第二回合攻击（所有）对手容易造成击中要害",
    "Restores the item the user last used.": "回收使用者上一次使用的道具",
    "For 5 turns, physical damage to allies is halved.": "5回合内，物理攻击对己方的伤害减半",
    "User becomes the same type as the target.": "使用者变得和目标的属性相同",
    "User cures its burn, poison, or paralysis.": "使用者能够治愈自身的灼伤/中毒/麻痹状态",
    "10% chance to sleep foe(s). Meloetta transforms.": "10%几率使对手陷入睡眠状态。变换形态",
    "User sleeps 2 turns and restores HP and status.": "使用者睡眠2回合，回复所有的HP，治愈异常状态",
    "Power doubles if an ally fainted last turn.": "如果上一回合有同伴倒下，招式威力翻倍",
    "Max 102 power at maximum Happiness.": "当亲密值最高的时候达到最大威力102",
    "Type varies based on the user's primary type.": "此招式的属性将变得和自己的第二属性相同",
    "30% chance to flinch the foe(s).": "30%使(所有)对手畏缩",
    "User replaces its Ability with the target's.": "将自身的特性变得和目标一样",
    "The user and the target trade Abilities.": "使用者和目标交换特性",
    "Heals 50% HP. Flying-type removed 'til turn ends.": "回复50%最大HP，在回合结束前失去飞行属性",
    "Power doubles if others used Round this turn.": "如果有其他宝可梦在这一回合使用了轮唱，招式威力翻倍",
    "50% chance to burn the target. Thaws user.": "50%几率使目标陷入灼伤状态能令使用者解除冰冻状态",
    "For 5 turns, protects user's party from status.": "5回合内，保护己方所有宝可梦免受异常状态",
    "For 5 turns, a sandstorm rages.": "5回合内，天气为沙暴天气",
    "30% chance to burn the target. Thaws target.": "30%几率使目标陷入灼伤状态。令使用者解除冰冻状态",
    "Lowers the target's Defense by 2.": "使目标的防御下降2级",
    "Effect varies with terrain. (30% paralysis chance)": "效果随场地变化（默认30%麻痹几率）",
    "40% chance to lower the target's Sp. Def by 2.": "40%几率使目标的特防下降2级",
    "20% chance to lower the target's Sp. Def by 1.": "20%几率使目标的特防下降1级",
    "OHKOs non-Ice targets. Fails if user's lower level.": "秒杀非冰属性宝可梦。如果使用者比目标等级低，使用失败",
    "Lowers Def, SpD by 1; raises Atk, SpA, Spe by 2.": "降低防御特防1级；提升攻击、特攻和速度各2级",
    "User must take physical damage before moving.": "若受到对手物理攻击，就攻击目标造成伤害",
    "Raises the user's Speed by 2 and Attack by 1.": "提升使用者的速度2级，攻击1级",
    "User restores 1/2 its max HP; 2/3 in Sandstorm.": "自身回复1/2最大HP，沙暴时回复2/3最大HP",
    "The target's Ability becomes Simple.": "目标的特性变为单纯",
    "Permanently copies the last move target used.": "抄袭目标最后使用的招式",
    "Raises user's Defense by 1 on turn 1. Hits turn 2.": "第一回合提升1级防御，第二回合攻击",
    "Charges, then hits turn 2. 30% flinch. High crit.": "第一回合蓄力，第二回合攻击。容易击中要害",
    "User and foe fly up turn 1. Damages on turn 2.": "使用者和对手第一回合一起上天，第二回合给对手造成伤害",
    "Can hit Pokemon using Bounce, Fly, or Sky Drop.": "可以击中使用弹跳，飞空，自由落体的宝可梦",
    "User must be asleep. Uses another known move.": "使用者必须处于睡眠状态。使用一个已习得的招式",
    "10% chance to poison adjacent Pokemon.": "10%使邻近的宝可梦中毒",
    "Removes the target's Ground immunity.": "消除目标对地上属性的免疫力",
    "Power doubles if target is paralyzed, and cures it.": "如果目标处于麻痹状态，威力翻倍，然后治愈其麻痹状态",
    "40% chance to poison the target.": "40%几率使目标陷入中毒状态",
    "100% chance to lower the foe(s) Sp. Atk by 1.": "100%使(所有)对手的特攻下降1级",
    "User steals certain support moves to use itself.": "使用者窃取目标的有益招式化为己用",
    "User must be asleep. 30% chance to flinch target.": "睡眠时才能使用。30%几率使目标畏缩",
    "Steals target's boosts before dealing damage.": "窃取目标的能力阶级变化",
    "Swaps Speed stat with target.": "和目标交换速度",
    "Protects from moves. Contact: loses 1/8 max HP.": "保护自己免受招式影响，接触到的对手会损失1/8最大HP",
    "Changes the target's type to Water.": "将目标的属性变为水属性",
    "Charges turn 1. Hits turn 2. No charge in sunlight.": "第一回合蓄力，第二回合攻击。在大晴天不用蓄力",
    "Always does 20 HP of damage.": "必定能造成20点伤害",
    "The target is cured of its burn.": "目标的灼伤状态会被治愈",
    "Hurts grounded foes on switch-in. Max 3 layers.": "伤害出场时站在地面上的对手。最多累积3层",
    "More power with more uses of Stockpile.": "能量积蓄得越多，威力越大",
    "Lowers the PP of the target's last move by 4.": "使目标最后使用的招式PP减少4点",
    "Target's foes' moves are redirected to it this turn.": "所有对手使用的作用范围为单体选择的招式都会攻向使用者",
    "Hurts foes on switch-in. Factors Rock weakness.": "伤害交换出的站在地面上的对手，计算岩石属性相克",
    "10% chance to raise the user's Defense by 1.": "10%令使用者的防御上升1级",
    "Lowers Speed of grounded foes by 1 on switch-in.": "降低对手替换出的站在地面上的宝可梦的速度1级",
    "Raises user's Defense, Sp. Def by 1. Max 3 uses.": "提升使用者的1级防御和特防最多累积3次",
    "100% chance to paralyze the target.": "100%使目标陷入麻痹状态",
    "10% chance to cause the target to fall asleep.": "10%使目标陷入睡眠状态",
    "Power doubles if the user's last move failed.": "如果使用者的上一次攻击使用失败，此招式威力翻倍",
    "User heals HP=target's Atk stat. Lowers Atk by 1.": "自身回复和目标当前攻击数值相同的HP。降低目标的攻击1级",
    "Lowers the foe(s) Speed by 2.": "降低（所有）对手的速度2级",
    "Usually goes first. Fails if target is not attacking.": "先制攻击，如果目标不使用攻击招式的话则使用失败",
    "For 5 turns, intense sunlight powers Fire moves.": "5回合内，阳光增加了火属性招式的威力",
    "Lowers the user's Attack and Defense by 1.": "降低使用者的攻击和防御各1级",
    "Raises the target's Attack by 2 and confuses it.": "提升目标的攻击2级且使其混乱",
    "Heals the user based on uses of Stockpile.": "回复量取决于蓄力的次数",
    "User switches its held item with the target's.": "使用者和目标交换道具",
    "Raises the user's Attack by 2.": "令使用者的攻击提升2级",
    "Hits adjacent Pokemon sharing the user's type.": "攻击和使用者有相同属性的宝可梦",
    "Raises the user's Sp. Atk by 3.": "提升使用者的特攻3级",
    "For 4 turns, allies' Speed is doubled.": "4回合内同伴的速度翻倍",
    "Type varies based on the held Drive.": "属性取决于所携带的卡带",
    "Confuses adjacent Pokemon.": "使周围的宝可梦陷入混乱状态",
    "For 3 turns, target floats but moves can't miss it.": "3回合内，目标漂浮起来，但招式一定会命中它",
    "Grounds adjacent foes. First hit neutral on Flying.": "击落周围的宝可梦，第一击可以击中飞行属性宝可梦",
    "Hits adjacent foes. Prevents them from switching.": "攻击周围的对手阻止他们替换下场",
    "For 2 turns, the target cannot use sound moves.": "2回合内目标无法使用声音的招式",
    "10% chance to paralyze. 10% chance to flinch.": "10%几率使目标麻痹。10%几率使目标畏缩",
    "10% chance to paralyze the target.": "10%几率使目标麻痹",
    "Lowers the target's Attack and Defense by 1.": "使目标的攻击和防御下降1级",
    "Inverts the target's stat stages.": "将目标的全部能力阶级数值变为其相反数",
    "Target can't select the same move twice in a row.": "目标不能连续使用同一招式",
    "Poisons grounded foes on switch-in. Max 2 layers.": "使替换上场的对手中毒，最多累积2次",
    "Lowers the target's Speed by 1 and poisons it.": "使目标速度下降1级并且中毒",
    "Copies target's stats, moves, types, and Ability.": "复制目标的能力阶级变化，招式，属性，特性",
    "20% chance to paralyze or burn or freeze target.": "20%几率使目标麻痹或灼伤或冰冻",
    "Adds Ghost to the target's type(s).": "使目标具有幽灵属性",
    "Hits 3 times. Each hit can miss, but power rises.": "连续攻击3次。每一次都可以被闪避，但击中的话威力会上升",
    "More power the fewer PP this move has left.": "招式PP越少威力越大",
    "Hits 2 times. Each hit has 20% chance to poison.": "连续攻击2次，每一次都有20%几率使对手中毒",
    "20% chance to flinch the foe(s).": "20%使(所有)对手畏缩",
    "User switches out after damaging the target.": "使用者在攻击目标后会替换后备宝可梦上场",
    "Lasts 3 turns. Active Pokemon cannot fall asleep.": "持续3回合，在场上的宝可梦不会陷入睡眠状态",
    "Lowers the user's Defense, Sp. Def, Speed by 1.": "降低使用者的防御特防和速度各1级",
    "Power doubles if the target is poisoned.": "如果目标已经中毒，招式威力翻倍",
    "This move does not check accuracy. Goes last.": "招式一定会命中，最后行动",
    "Has 33% recoil. 10% chance to paralyze target.": "有33%的反弹伤害，10%几率使目标陷入麻痹状态",
    "Power doubles if target is asleep, and wakes it.": "如果目标处于睡眠状态，威力翻倍，然后拍醒它",
    "Use with Grass or Fire Pledge for added effect.": "和草或火之誓言同时使用会有特效",
    "For 5 turns, Fire-type attacks have 1/3 power.": "3回合内，火属性攻击威力为原来的1/3",
    "Power doubles and type varies in each weather.": "有天气时招式威力会翻倍，属性会变化",
    "Protects allies from multi-target moves this turn.": "保护所有同伴免受群体攻击的影响",
    "Burns the target.": "使目标陷入灼伤状态",
    "Next turn, 50% of the user's max HP is restored.": "下一回合使用者回复50%最大HP",
    "For 5 turns, all Defense and Sp. Def stats switch.": "5回合内所有防御和特防基础值交换",
    "Raises the user's Attack and Sp. Atk by 1.": "提升使用者的攻击特攻各1级",
    "The target's Ability becomes Insomnia.": "目标的特性变为不眠",
    "Puts the target to sleep after 1 turn.": "下一回合目标会陷入睡眠状态",
    "User loses 50% max HP. Hits adjacent Pokemon.": "使用者损失50%最大HP，攻击周围全体宝可梦",
    "Physical if user's Atk > Sp. Atk. Ignores Abilities.": "无视目标的特性。攻击数值高于特攻时，变为物理招式",
    "Raises the user's Atk/Def/SpAtk/SpDef/Spe by 1.": "使用者全能力提升1级",
    "Ends the effects of Terrain.": "清除场上的场地",
    "100% chance to lower the target's Sp. Def by 1.": "降低目标1级特防",
    "Morpeko: Electric; Hangry: Dark; 100% +1 Spe.": "提升1级速度，满腹花纹时为电属性，空腹花纹时为恶属性",
    "Summons Reflect.": "使用后己方处于反射壁状态",
    "Double damage against Dynamax/Gigantamax.": "对极巨化/超极巨化状态下的宝可梦伤害翻倍",
    "Uses Def instead of Atk in damage calculation.": "以使用者的防御而不是攻击来计算伤害",
    "Double power if the user moves first.": "如果使用者先攻击，威力翻倍",
    "100% chance to lower adjacent foes' Atk by 1.": "降低对手全体1级攻击",
    "100% chance lower adjacent Pkmn Speed by 1.": "令目标的速度降低1级",
    "100% chance to paralyze the foe.": "令对手麻痹",
    "+1 SpD, user's Electric move next turn 2x power.": "提升1级特防，下一回合电属性招式威力2倍",
    "User loses 33% max HP. Raises all stats by 1.": "损失33%最大HP，提升所有能力1级",
    "Resets all of the target's stat stages to 0.": "使用后全场能力阶级归零",
    "Raises user's Attack, Defense, accuracy by 1.": "攻击，防御，命中提升1级",
    "Nullifies the foe(s) Ability if the foe(s) move first.": "如果目标在该回合已使用过招式，使目标陷入无特性状态",
    "Switches sides of field effects": "交换双方场地的状态效果",
    "Curses if Ghost, else -1 Spe, +1 Atk, +1 Def.": "幽灵属性使其诅咒，反之速度降低1级，攻击和防御提升1级",
    "Darkrai: Causes the foe(s) to fall asleep.": "使对方全体陷入睡眠状态，仅在使用者为达克莱伊时奏效",
    "Raises the target's Atk and Sp. Atk by 2.": "提升使用者攻击和特攻2级",
    "Hits twice. 30% chance to flinch.": "攻击两次，每次30%几率令目标畏缩",
    "Singles: Hits twice. Doubles: Hits each once.": "单打对战攻击两次，双打对战对两只宝可梦分别攻击一次",
    "Deals 40 HP of damage to the target.": "造成40点固定伤害",
    "Hits adjacent Pokemon. Double damage on Dig.": "攻击周围全体宝可梦，对挖洞状态的目标伤害翻倍",
    "Target repeats its last move for its next 3 turns.": "目标接下来的 3 回合，只能使用其最后使用的招式",
    "User survives attacks this turn with at least 1 HP.": "本回合结束时，自身保留至少1点HP",
    "Summons Light Screen.": "使用后己方处于光墙状态",
    "Causes the target to fall asleep.": "使目标陷入睡眠状态",
    "5 turns. Grounded: +Grass power, +1/16 max HP.": "使场地变成青草场地，持续5回合",
    "Power doubles during Bounce, Fly, and Sky Drop.": "如果目标处于飞翔状态，威力翻倍",
    "Raises the user's and ally's Attack by 1.": "使用者和同伴的攻击提升1级",
    "Hoopa-U: Lowers user's Def by 1; breaks protect.": "解放胡帕自身的防御降低1级，无视守住",
    "Traps/grounds user; heals 1/16 max HP per turn.": "进入扎根状态，无法交换。每回合结束时回复1/16最大HP",
    "Prevents the user and the target from switching out.": "使用者和目标都无法交换",
    "Protects from attacks. Contact: lowers Atk by 1.": "完全抵挡对手的攻击。如果对手使用了接触类招式，攻击降低1级",
    "Until the end of the next turn, user's moves crit.": "下回合结束前，招式必定会击中要害",
    "Heals the user (and allies) by 1/4 amount.": "回复使用者和同伴1/4最大HP",
    "Changes the target's type to Psychic.": "使目标变为超能力属性",
    "Does many things turn 1. Can't move turn 2.": "使用后下回合不能行动",
    "For 5 turns, the user has immunity to Ground.": "5回合内使自身进入电磁飘浮状态，免疫地面属性招式",
    "Damage doubles if the target used Minimize.": "对变小的目标伤害翻倍",
    "User/allies: +1 Spe. BP scales w/ base move.": "提高我方全体的速度",
    "Foes: -1 Sp.Def. BP scales with base move's BP.": "降低对手全体的特防",
    "Sets Sun. BP scales with base move's BP.": "使天气转为大晴天",
    "Foes: -1 Sp.Atk. BP scales with base move's BP.": "降低对手全体的特攻",
    "Sets Rain. BP scales with base move's BP.": "使天气转为下雨",
    "Prevents all moves from affecting the user this turn.": "挡下包括极巨招式在内的所有招式",
    "Sets Hail. BP scales with base move's BP.": "使天气转为冰雹",
    "User/allies: +1 Atk. BP scales w/ base move.": "提高我方全体的攻击",
    "Sets Electric Terrain. BP scales with base move's BP.": "将场地变成电气场地",
    "Sets Psychic Terrain. BP scales with base move's BP.": "将场地变成精神场地",
    "User/allies: +1 SpA. BP scales w/ base move.": "提高我方全体的特攻",
    "Sets Grassy Terrain. BP scales with base move's BP.": "将场地变成青草场地",
    "Foes: -1 Defense. BP scales with base move's BP.": "降低对手全体的防御",
    "User/allies: +1 SpD. BP scales w/ base move.": "提高我方全体的特防",
    "Sets Sandstorm. BP scales with base move's BP.": "使天气转为沙暴",
    "Sets Misty Terrain. BP scales with base move's BP.": "将场地变成薄雾场地",
    "User/allies: +1 Def. BP scales w/ base move.": "提高我方全体的防御",
    "Foes: -1 Speed. BP scales with base move's BP.": "降低对手全体的速度",
    "Foes: -1 Attack. BP scales with base move's BP.": "降低对手全体的攻击",
    "Raises all stats by 1 (not acc/eva). Traps user.": "所有能力提升1级。使用者进入无法逃走状态",
    "Protects from attacks. Contact: lowers Def by 2.": "抵挡对手的攻击。如果对手使用了接触类招式，防御降低2级",
    "Foe can't switch. Lowers Def and SpD every turn.": "目标无法交换，每回合降低防御和特防",
    "Max happiness: 102 power. Can't miss.": "最大亲密度对应威力102，不会落空",
    "40, 80, 120 power, or heals target 1/4 max HP.": "威力随机为40，80，120或者回复目标1/4最大HP",
    "Cures target's status; heals user 1/2 max HP if so.": "治愈目标的异常状态。成功治愈：自身回复1/2最大HP",
    "Free user from hazards/bind/Leech Seed; +1 Spe.": "提升1级速度，移除己方场地上的入场状态/束缚/寄生种子",
    "Raises Atk/Sp. Atk of grounded Grass types by 1.": "所有的地面上的草属性宝可梦的攻击，特攻提升1级",
    "Summons Leech Seed.": "使用后对方处于寄生种子状态",
    "100% chance to burn the foe.": "令对手陷入灼伤状态",
    "30% chance to burn the target.": "30%几率使目标陷入灼伤状态",
    "User loses 1/4 of its max HP.": "每次攻击自身损失1/4最大HP",
    "Consumes berry and raises the user's Def. by 2.": "食用树果并且提升使用者防御2级",
    "User takes 1/4 its max HP to put in a substitute.": "使用1/4最大HP制造一个替身",
    "Causes the target to become confused.": "使目标混乱陷入状态",
    "Hits adjacent Pokemon. Double damage on Dive.": "攻击周围全体宝可梦，对潜水状态的目标伤害翻倍",
    "Lowers the foe(s) evasiveness by 2.": "降低目标闪避率2级",
    "Target gets -1 Spe and becomes weaker to Fire.": "目标速度降低1级并且增加火属性弱点",
    "Target can't use status moves its next 3 turns.": "使目标接下来的3回合无法使用变化招式",
    "All active Pokemon consume held Berries.": "在场上的宝可梦都会吃掉自己携带的树果",
    "User switches out.": "使用者逃离战斗",
    "30% chance to paralyze. Can't miss in rain.": "30%几率使目标麻痹，雨天下不会落空",
    "Badly poisons the target. Poison types can't miss.": "使目标陷入剧毒状态，毒属性宝可梦使用不会落空",
    "Goes last. For 5 turns, turn order is reversed.": "接下来5回合，速度慢的宝可梦先行动。优先级最低",
    "Lowers Atk/Sp. Atk/Speed of poisoned foes by 1.": "令中毒的目标的攻击，特攻和速度降低1级",
    "Usually goes first. Hits 2-5 times in one turn.": "先制攻击，攻击2～5次",
    "Nearly always goes first. Always crits.": "先制攻击，必定击中要害",
    "Foes: SLP/PSN/PAR. BP scales with base move.": "使对手全体陷入中毒、麻痹或睡眠其中一种异常状态",
    "Traps/damages foes. BP scales w/ base move.": "令对手无法交换并持续受到伤害",
    "User side: Focus Energy. BP scales w/ base move.": "自己进入易中要害状态",
    "Infatuates opponents. BP scales with base move.": "让对方所有性别不同的宝可梦陷入着迷状态",
    "Foe: Lowers PP of last move. BP scales w/ base move.": "减少对手最后使用的招式的PP",
    "Heals user and allies. BP scales with base move.": "回复我方所有宝可梦的HP",
    "Foes: -2 Speed. BP scales with base move's BP.": "大幅降低对手的速度",
    "Confuses foes. BP scales with base move's BP.": "使对手全体陷入混乱",
    "Summons Gravity. BP scales with base move.": "使用后场地处于重力状态",
    "Poisons opponents. BP scales with base move.": "使对手所有宝可梦陷入中毒状态",
    "Restores user-side berries. BP scales w/ base move.": "获得使用过的树果",
    "Summons Aurora Veil. BP scales w/ base move.": "使己方场地进入极光幕",
    "Confuses opponents. BP scales with base move.": "让对手陷入混乱状态",
    "Afflicts foes with Yawn. BP scales w/ base move.": "使目标陷入瞌睡状态",
    "Sets Steel entry hazard. BP scales w/ base move.": "对方场地处于超极巨钢铁阵法状态，交换上场损失1/8最大HP×钢属性相性",
    "Sets Stealth Rock. BP scales w/ base move's BP.": "使对方场地处于隐形岩状态",
    "Foe(s): Par/Psn. BP scales with base move's BP.": "让对手所有宝可梦陷入中毒或麻痹状态",
    "Foe(s): -1 evasion. BP scales with base move's BP.": "降低对手的闪避率1级",
    "Traps foe(s). BP scales with base move's BP.": "使对方全体陷入无法逃跑状态",
    "Damages foes for 4 turns. BP scales w/ base move.": "在4回合内持续对对方的宝可梦造成伤害",
    "Paralyzes foe(s). BP scales with base move's BP.": "使对方全体陷入麻痹状态",
    "Clears field. BP scales with base move's BP.": "消除反射壁、光墙、撒菱、超极巨钢铁阵法和场地型状态的效果",
    "Applies Torment to foes. BP scales with base move.": "使对手陷入无理取闹状态",
    "User loses 50% max HP.": "使用后损失50%最大HP",
    "If hit by Normal/Fighting move, deals 2x damage.": "被一般/格斗属性招式击中的伤害将以2倍返还给对手",
    "Can't move next turn if target or sub is not KOed.": "攻击令对方陷入濒死时宝可梦下回合不会被暂停一次",
    "While active, the user's Defense is doubled.": "使自身进入反射壁状态，反射壁状态时防御力翻倍",
    "33% chance to lower the target's Special by 1.": "33%几率令目标的特攻降低1级",
    "Damage = user's level. Can hit Ghost types.": "给予对手和自己等级相同的伤害。对幽灵屬性有效果",
    "User takes 1/4 its max HP to put in a Substitute.": "使用者需要最大HP的1/4来制造一个替身",
    "Waits 2-3 turns; deals double the damage taken.": "等待2-3回合，之后将受到的伤害双倍奉还给对手",
    "For 0-7 turns, disables one of the target's moves.": "阻碍对手行动，之前使出的招式将在0-7回合内无法使用",
    "Random move known by the target replaces this.": "招式替换为目标随机一个招式",
    "Random damage from 1 to (user's level*1.5 - 1).": "造成使用者等级×（1～1.5之间随机值）的固定伤害",
    "Lasts forever. Raises user's Attack by 1 when hit.": "使自身进入愤怒状态，处于愤怒状态受到招式伤害时攻击力上升1等级",
    "Charges turn 1. Hits turn 2.": "第一回合蓄力，第二回合攻击。",
    "Badly poisons the target.": "令对手陷入剧毒状态。随着回合的推进，中毒伤害会增加",
    "While active, user's Special is 2x when damaged.": "使自身进入光墙状态，受到特殊招式时伤害减半",
    "33% chance to lower the target's Speed by 1.": "33%几率令目标的速度降低1级",
    "Lowers the target's Defense by 1.": "令目标的防御降低1级",
    "Prevents the target from moving for 2-5 turns.": "使目标陷入束缚状态，束缚状态持续2～5回合且不能换下",
    "33% chance to lower the target's Attack by 1.": "33%几率令目标的攻击降低1级",
    "Never misses, even against Dig and Fly.": "攻击必定会命中，即使对手使用挖洞和飞翔",
    "Target's Def halved during damage. User faints.": "将目标的防御能力值减半计算，自身陷入濒死状态",
    "Damage = user's level. Can hit Normal types.": "给予对手和自己等级相同的伤害。对一般属性有效",
    "Lasts 3-4 turns. Confuses the user afterwards.": "持续3～4回合攻击对手。冷静下来后会混乱",
    "Deals 65535 damage. Fails if target is faster.": "造成65535伤害。但对速度高于自身的目标无效",
    "Quarters the user's chance for a critical hit.": "使自身进入易中要害状态",
    "Lowers the target's Speed by 1.": "令目标的速度降低1级",
    "33% chance to lower the target's Defense by 1.": "33%几率令目标的防御降低1级",
    "Raises the user's Special by 1.": "令使用者的特攻提升1级",
    "20% chance to poison the target.": "有20%几率使目标陷入中毒状态",
    "Resets all stat changes. Removes foe's status.": "消除所有能力阶级变化并重置所有状态",
    "While active, user is protected from stat drops.": "白雾状态下能力变化不会被对方的变化招式降低",
    "Raises the user's Special by 2.": "令使用者的特殊提升2级",
    "User takes 1 HP of damage if it misses.": "如果招式未命中、或没有产生效果，自身承受1点反作用力伤害",
    "Copies target's stats, moves, types, and species.": "复制目标的招式、属性、种族值",
    "Ally: Crit ratio +1, or +2 if ally is Dragon type.": "令所有同伴的击中要害率提升1级。龙属性同伴改为提升2级",
    "Raises Sp. Atk by 1, hits turn 2. Rain: no charge.": "第一回合进行蓄力，在第二回合发动招式。雨天时不需蓄力",
    "If Terastallized: Phys. if Atk > SpA, type = Tera.": "太晶化后变为太晶属性。此时若攻击大于特攻，变为物理招式",
    "Bypasses protection without breaking it.": "能无视对方守住类招式",
    "Hits twice. This move does not check accuracy.": "一回合内连续攻击2次。攻击必定会命中",
    "+1 SpD, user's next Electric move 2x power.": "使下一次电属性招式的威力加倍。并提升特防1级",
    "For 2 turns, the target is prevented from healing.": "使目标在2回合内陷入回复封锁状态",
    "Has a 30% chance this move's power is doubled.": "30%几率造成双倍伤害",
    "Target's Speed is lowered by 1 stage for 3 turns.": "在包含当前回合的3回合内，每回合结束时降低1级速度",
    "High critical hit ratio. Type depends on user's form.": "容易击中要害。该招式的属性会根据使用者的形态而改变",
    "20% burn. Recovers 50% dmg dealt. Thaws foe(s).": "20%几率灼伤。使用后解冻，50%的伤害转化为自身的HP",
    "100% confuse target that had a stat rise this turn.": "令该回合内能力变化曾提高过的宝可梦陷入混乱状态",
    "100% flinch. Fails unless target using priority.": "令目标畏缩。目标使出先制攻击时才能使用成功",
    "Terapagos-Stellar: Stellar type, hits both foes.": "星晶化后招式属性变为星晶，造成无属性伤害。此时若使用者的攻击大于特攻，则该招式变为物理招式",
    "Protects from damaging attacks. Contact: burn.": "进入守住状态，这期间受到接触类招式时令攻击方陷入灼伤",
    "10% chance to freeze foe(s). Can't miss in Snow.": "10%几率使目标冰冻。在冰雹或下雪天气下一定会命中",
    "Deals 1.3333x damage with supereffective hits.": "招式出现效果绝佳时威力提升33%",
    "User takes sure-hit 2x damage until its next turn.": "下次使出招式之前，任何以您为目标的招式必中且伤害翻倍",
    "Lowers the user's Sp. Atk by 1. Hits foe(s).": "令使用者的特攻降低1级",
    "Cannot be selected the turn after it's used.": "无法连续使用",
    "30% confusion. User loses 50% max HP if miss.": "30%几率使其混乱。如果未命中，使用者失去50%最大HP",
    "+50 power for each time a party member fainted.": "我方每有一只宝可梦陷入过濒死状态，招式的威力提升50",
    "Curly|Droopy|Stretchy eaten: +1 Atk|Def|Spe.": "上弓提升攻击1级，下垂提升防御1级，平挺提升速度1级",
    "Raises target's Atk by 2 and lowers its Def by 2.": "令目标提升2级攻击，降低2级防御",
    "Deals 1/8 max HP each turn; 1/4 on Steel, Water.": "令目标每回合损失1/8最大HP;钢/水属性宝可梦改为损失1/4",
    "User and ally swap positions; using again can fail.": "与己方目标交换位置。同一回合内，连续使用会失败",
    "For 5 turns, damage to allies halved. Snow only.": "5回合内，我方受到的招式伤害减半。冰雹或下雪时才能使用",
    "50% psn. 2x power if target already poisoned.": "30%几率使目标中毒。如果目标已中毒或剧毒，威力翻倍",
    "Sets a layer of Spikes on the opposing side.": "令目标场地变为撒菱状态",
    "Starts Snow. User switches out.": "和后备宝可梦替换并使天气变为持续5回合的雪景",
    "50% chance to sleep, poison, or paralyze target.": "50%几率使目标陷入中毒、麻痹或睡眠状态",
    "Poisons foes, frees user from hazards/bind/leech.": "使目标陷入中毒状态。移除己方场地上的入场生效状态/束缚/寄生种子",
    "100% chance to raise user Speed by 1. High crit.": "令使用者的速度提升1级。容易击中要害",
    "During Electric Terrain: 1.5x power.": "场地为电气场地时，威力提升50%",
    "Cures user's status, raises Sp. Atk, Sp. Def by 1.": "治愈使用者的异常状态。提升1级特攻和特防",
    "During Sunny Day: 1.5x damage instead of half.": "晴天下威力提升50%而不是减半",
    "User's Electric type: typeless; must be Electric.": "使用者为电属性时，使用后自身电属性变成无属性",
    "30% to lower foe(s) Speed by 1. Rain: can't miss.": "30%几率使目标降低1级速度。雨天下必定命中",
    "20% chance to paralyze foe(s). Rain: can't miss.": "20%几率使目标陷入麻痹状态。雨天下必定命中",
    "20% chance to burn foe(s). Can't miss in rain.": "20%几率使目标陷入灼伤状态。雨天下必定命中",
    "30% chance to lower the foe(s) Attack by 1.": "30%几率令目标的攻击降低1级",
    "High crit. Target: 50% -1 Defense, 30% flinch.": "易中要害。50%几率令其防御降低1级，30%几率畏缩",
    "30% burn. 2x power if target is already statused.": "30%几率使目标灼伤。如果目标处于异常状态，威力翻倍",
    "+50 power for each time user was hit. Max 6 hits.": "使用者每受到一次攻击，招式的威力增加50，最大为350。",
    "Always results in a critical hit; no accuracy check.": "必定会命中，且会击中要害",
    "+2 Attack, Sp. Atk, Speed for 1/2 user's max HP.": "使用者损失1/2最大HP,提升攻击、特攻和速度各2级",
    "User +1 Atk, Spe. Clears all substitutes/hazards.": "自身提升1级攻击和速度。消除所有替身/入场生效状态",
    "User and ally's Abilities become target's Ability.": "将自身和同伴的特性转变为目标的特性",
    "Sets Stealth Rock on the target's side.": "令目标场地进入隐形岩状态",
    "Raises the user's Attack, Defense, Speed by 1.": "令使用者的攻击、防御和速度提升1级",
    "Protects allies from damaging attacks. Turn 1 only.": "保护我方不受到伤害招式的影响。出场后立刻使出才能成功",





    //  特性效果

    "This Pokemon's moves cannot be redirected to a different target by any effect.": "攻击原本选定的目标",
    "This Pokemon is immune to sound-based moves, unless it used the move.": "不受声音的招式影响",
    "This Pokemon's moves cannot be redirected to a different target by any effect.": "攻击原本选定的目标",
    "This Pokemon's allies have the power of their moves multiplied by 1.3.": "己方其他宝可梦的招式威力提高30%",
    "Making contact with this Pokemon starts the Perish Song effect for it and the attacker.": "受到接触类招式攻击时，3个回合后双方都会失去战斗能力",
    "This Pokemon's types change to match the Terrain. Type reverts when Terrain ends.": "该特性的宝可梦会因当前的场地不同而改变属性",
    "If Morpeko, it changes between Full Belly and Hangry Mode at the end of each turn.": "每回合都会改变自身的样子，气场轮会根据不同形态变为不同的属性",
    "30% chance this Pokemon's ally has its status cured at the end of each turn.": "每回合结束有30%几率治愈一名同伴的异常状态",
    "This Pokemon eats Berries at 1/2 max HP or less instead of their usual 1/4 max HP.": "1/2最大HP时就可以食用树果，而不是通常的1/4",
    "Prevents Explosion/Mind Blown/Misty Explosion/Self-Destruct/Aftermath while active.": "当该特性的宝可梦在场时，自爆、大爆炸、惊爆大头和薄雾炸裂会使用失败",
    "Causes sleeping foes to lose 1/8 of their max HP at the end of each turn.": "使对手的处于睡眠状态的宝可梦每回合损失最大HP的1/8",
    "If this Pokemon is Palafin, it changes to Hero Mode when it switches out.": "回到同行队伍后，会变为全能形态",
    "If this Pokemon is hit by a wind move or Tailwind begins, it becomes charged.": "受到风的招式攻击时，会变为充电状态",
    "This Pokemon's Defense is raised 2 stages if hit by a Fire move; Fire immunity.": "受到火属性的招式攻击时，不会受到伤害，而是会提升2级防御",
    "Pokemon making contact with this Pokemon have their Ability swapped with this one.": "受到接触类招式攻击时，自己获得攻击方的特性，同时攻击方的特性变为游魂",
    "This Pokemon's contact moves ignore the target's protection, except Max Guard.": "使用接触类招式时，能无视对方除极巨防壁外守住类状态的效果",
    "When this Pokemon is hit by an attack, Toxic Spikes are set around the attacker.": "受到物理招式的伤害时，会在对手脚下散布毒菱",
    "At 1/3 or less of its max HP, this Pokemon's offensive stat is 1.5x with Water attacks.": "当HP小于1/3时，水属性招式的威力提升50%",
    "This Pokemon's Attack is raised by 1 stage when hit by Fire moves; it can't be burned.": "受到火属性的招式攻击时，攻击提高1级，且不会陷入灼伤状态",
    "This Pokemon and its allies cannot fall asleep; those already asleep do not wake up.": "使己方免疫睡眠状态",
    "At 1/3 or less of its max HP, this Pokemon's offensive stat is 1.5x with Bug attacks.": "当HP小于1/3时，虫属性招式的威力提升50%",
    "This Pokemon's Attack and Special Attack raise by 10% per fainted teammate.": "每有一只我方宝可梦被打倒，都将使物攻和特攻提升10%",
    "This Pokemon cannot lose its held item due to another Pokemon's Ability or attack.": "携带道具不受其他宝可梦影响",
    "This Pokemon's slicing attacks have 1.5x power.": "切割类招式威力提升50%",
    "When this Pokemon is hit by an attack, the effect of Grassy Terrain begins.": "受到攻击时转为青草场地",
    "On switch-in, the effects of Aurora Veil, Light Screen, and Reflect end for both sides.": "出场时清除双方的光墙、反射壁和极光幕",
    "When this Pokemon is hit by an attack, the effect of Sandstorm begins.": "受到攻击时转为沙暴天气",
    "When this Pokemon eats certain Berries, the effects are doubled.": "食用树果的效果变为原来的2倍",
    "This Pokemon has a 30% chance to move first in its priority bracket with attacking moves.": "30%几率在相同优先度下先出手",
    "This Pokemon and its allies are protected from opposing priority moves.": "让对方无法使出会影响己方的先制招式",
    "If Electric Terrain is active or Booster Energy held, the highest stat is 1.5x.": "携带着驱劲能量或在电气场地上时，数值最高的能力提升50%",
    "This Pokemon cannot be statused; Ghost power against it is halved.": "不会陷入异常状态，幽灵属性招式伤害减半",
    "If Sunny Day is active or Booster Energy held, the highest stat is 1.5x.": "携带着驱劲能量或天气为晴朗时，数值最高的能力提升50%",
    "This Pokemon and its allies cannot be poisoned. On switch-in, cures poisoned allies.": "使己方免疫中毒状态，上场时还可治疗己方的中毒状态",
    "At 1/3 or less of its max HP, this Pokemon's offensive stat is 1.5x with Grass attacks.": "当HP小于1/3时，草属性招式的威力提升50%",
    "This Pokemon is immune to powder moves, Sandstorm or Hail damage, Effect Spore.": "免疫粉末类招式，不受沙暴和冰雹影响",
    "This Pokemon's Status moves have lowered priority and ignore their targets' Abilities.": "必定后手使出变化招式，但不受对手特性影响",
    "If this Pokemon's stat stages would be lowered, the attacker's are lowered instead.": "反弹来自对方招式或特性的能力下降效果",
    "If this Pokemon has a non-volatile status condition, its Defense is multiplied by 1.5.": "异常状态时防御提升50%",
    "Pokemon making contact with this Pokemon have their Ability changed to Lingering Aroma.": "接触到具有此特性的宝可梦的宝可梦的特性将改为甩不掉的气味",
    "When hit after Surf/Dive, attacker takes 1/4 max HP and -1 Defense or paralysis.": "使出冲浪或潜水后被击中时，使对手HP减少1/4或使对手的防御降低1级，又或使对手陷入麻痹",
    "This Pokemon is immune to Status moves.": "不会受到对手的变化招式的影响",
    "This Pokemon and its allies are protected from opposing priority moves.": "让对方无法使出会影响己方的先制招式",
    "If this Pokemon is hit, it lowers the Speed of all other Pokemon on the field 1 stage.": "受到攻击时，令除该特性以外的宝可梦速度降低1级",
    "On switch-in, this Pokemon copies an ally's stat changes.": "出场时，复制同伴的能力变化",
    "This Pokemon can poison or badly poison a Pokemon regardless of its typing.": "该宝可梦使用的招式可以使毒属性和钢属性的宝可梦中毒",
    "If ally is Dondozo: this Pokemon cannot act or be hit, +2 to all Dondozo's stats.": "若我方有吃吼霸，则该宝可梦无法被攻击，吃吼霸全属性提高2级",
    "At 1/3 or less of its max HP, this Pokemon's offensive stat is 1.5x with Fire attacks.": "当HP小于1/3时，火属性招式的威力提升50%",
    "This Pokemon and its allies are protected from opposing priority moves.": "使对手无法对我方使出先制招式",
    "When this Pokemon reaches 1/2 or less of its max HP: +1 Atk, Sp. Atk, and Spe; -1 Def and Sp. Def.": "因对方攻击而HP变为一半时，攻击特攻速度提高1级，防御特防下降1级",
    "If hit by a wind move or Tailwind begins: +1 Attack. Wind move immunity.": "吹起了顺风或受到风的招式攻击时，不会受到伤害，而是会使攻击提高1级",
    "When an opposing Pokemon has a stat stage raised, this Pokemon copies the effect.": "对手的能力提高时，自己也会趁机同样地提高能力",
    "The Sp. Atk stat of all other active Pokemon is reduced by 25%.": "降低除自己外的宝可梦25%特攻",
    "This Pokemon's offensive stat is multiplied by 1.3 while using an Electric-type attack.": "电属性招式威力提升30%",
    "This Pokemon's offensive stat is multiplied by 1.5 while using an Electric-type attack.": "电属性招式威力提升50%",
    "Fire-/Ice-type moves against this Pokemon deal damage with a halved offensive stat.": "受到冰属性或火属性招式攻击时，在伤害计算中对方的攻击或特攻减半。",
    "This Pokemon's moves of 60 power or less have 1.5x power, including Struggle.": "使用威力≤60的招式，威力提升50%",
    "The Attack stat of all other active Pokemon is reduced by 25%.": "降低除自己外的宝可梦25%攻击",
    "The Defense stat of all other active Pokemon is reduced by 25%.": "降低除自己外的宝可梦25%防御",
    "This Pokemon and its allies' Steel-type moves have their power multiplied by 1.5.": "己方全员的钢属性招式威力提升50%",
    "This Pokemon's offensive stat is multiplied by 1.5 while using a Steel-type attack.": "该特性的宝可梦使出钢属性招式的威力提升50%",
    "This Pokemon's offensive stat is doubled against a target that switched in this turn.": "对本回合替换上场的宝可梦造成的伤害*2",
    "This Pokemon's Special Attack is raised by 1 stage when another Pokemon faints.": "每当场上有宝可梦被打倒时特攻+1",
    "When one of this Pokemon's stat stages is raised or lowered, the amount is doubled.": "能力阶级变化变为原来的两倍",
    "Prevents foes from choosing to switch unless they also have this Ability.": "使对方全部不持有踩影特性的非幽灵属性宝可梦无法替换",
    "This Pokemon's offensive stat is multiplied by 1.5 while using a Rock-type attack.": "岩石属性的招式威力提升50%",
    "This Pokemon receives 1/2 damage from sound moves. Its own have 1.3x power.": "该特性的宝可梦发出的声音类招式威力提升30%；受到声音招式伤害减半",
    "On switch-in, summons Sunny Day. Attack is boosted by 30% in Sunny Day.": "出场时会将天气变为大晴天。处于晴天时物攻提升30%",
    "When an opposing Pokemon recieves stat boosts, this Pokemon gets the same boosts.": "对手能力提高时，自己同样提高",
    "While this Pokemon is active, Abilities have no effect.": "让周围宝可梦变为无特性状态",
    "If this Pokemon is an Arceus, its type changes to match its held Plate.": "携带相应石板或Z纯晶时改变属性",
    "Prevents opposing Steel-type Pokemon from choosing to switch out.": "使对方非幽灵属性的钢属性宝可梦无法替换",
    "This Pokemon blocks certain Status moves and bounces them back to the user.": "无效并反弹部分以自身为目标的变化招式",
    "On switch-in, this Pokemon lowers the Attack of opponents by 1 stage.": "出场时使范围内的对手攻击下降1级",
    "This Pokemon receives 1/2 damage from special attacks.": "受到特殊招式攻击伤害减半",
    "If Eiscue, the first physical hit it takes deals 0 damage. Effect is restored in Snow.": "抵御一次物理伤害，并转换为解冻头形态。天气变成下雪时，恢复为结冻头",
    "If Eiscue, the first physical hit it takes deals 0 damage. This effect is restored in Hail.": "抵御一次物理伤害，并转换为解冻头形态。天气变成冰雹时，恢复为结冻头",
    "On switch-in, summons Electric Terrain. Sp. Atk is boosted by 30% in Electric Terrain.": "出场时会布下电气场地。处于电气场地时特攻提升30%",
    "Immune to Intimidate. Intimidated: +1 Attack. Cannot be forced to switch out.": "受到威吓时使物攻提升1级，令替换宝可梦的招式和道具无效",
    "This Pokemon's Sp. Atk is raised by 1 stage if it attacks and KOes another Pokemon.": "每打败一只宝可梦都将使特攻提升1级",
    "This Pokemon's Attack is 1.5x, but it can only select the first move it executes.": "攻击提升至1.5倍，但只能使用一开始使用的招式",
    "This Pokemon becomes charged if it takes direct damage.": "受到伤害时，会变为充电状态",
    "This Pokemon heals 1/3 of its max HP when hit by Ground moves; Ground immunity.": "受到地面属性的招式攻击时，不会受到伤害，而是会恢复1/3血量",
    "This Pokemon's offensive stat is multiplied by 1.5 while using a Dragon-type attack.": "龙属性招式威力提升50%",
    "If this Pokemon eats a berry, it will consume the berry again at the end of next turn.": "吃了树果后，下回合再吃一次",
    "This Pokemon is immune to bullet moves.": "免疫球和弹类招式的伤害",
    "The Sp. Def stat of all other active Pokemon is reduced by 25%.": "降低除自己外的宝可梦25%特防",
    "Combination of the Unnerve and Grim Neigh Abilities.": "兼备紧张感和漆黑嘶鸣这两种特性",
    "Combination of the Unnerve and Chilling Neigh Abilities.": "兼备紧张感和苍白嘶鸣这两种特性",
    "Prevents opposing Pokemon from choosing to switch out unless they are airborne.": "使对方所有非幽灵属性的地面上的宝可梦无法替换",
    "This Pokemon's attacks without a chance to flinch gain a 10% chance to flinch.": "使用招式攻击对手造成伤害时，对方有10%几率陷入畏缩",
    "If this Pokemon has no item and is hit by a contact move, it steals the attacker's item.": "当该特性的宝可梦未携带任何道具时受到接触类招式攻击，可以获得对手的道具",
    "This Pokemon has its non-volatile status condition cured when it switches out.": "回到同行队伍后，异常状态就会被治愈",
    "If this Pokemon is KOed with a contact move, that move's user loses 1/4 its max HP.": "因接触类招式被击倒时，发动该攻击的宝可梦损失1/4最大HP",
    "This Pokemon's Normal-type moves become Flying type and have 1.2x power.": "一般属性招式变为飞行属性招式，威力提升20%",
    "While this Pokemon is active, the effects of weather conditions are disabled.": "该宝可梦在场时，所有天气的影响都会消失",
    "This Pokemon's attacks have 1.3x power if it is the last to move in a turn.": "回合最后行动的话威力提升30%",
    "If this Pokemon (not its substitute) takes a critical hit, its Attack is raised 12 stages.": "被击中要害时攻击提升12级，替身状态下不会发动",
    "On switch-in, this Pokemon shudders if any foe has a supereffective or OHKO move.": "登场时可以预知对方的效果绝佳和一击必杀招式",
    "Prevents adjacent foes from choosing to switch unless they are airborne.": "处于地面上的对方宝可梦进入无法逃走状态",
    "Protects user/allies from Attract, Disable, Encore, Heal Block, Taunt, and Torment.": "己方宝可梦不会受到迷人、定身法、再来一次、回复封锁、挑衅和无理取闹的影响",
    "While this Pokemon is active, the Dark Aura and Fairy Aura power modifier is 0.75x.": "反转气场类特性，令其对恶属性和妖精属性的加成变为降低25%",
    "Causes sleeping adjacent foes to lose 1/8 of their max HP at the end of each turn.": "回合结束时对方处于睡眠状态的宝可梦损失1/8最大HP",
    "This Pokemon's allies have the power of their special attacks multiplied by 1.3.": "我方场上所有宝可梦使用特殊招式的威力增加30%",
    "This Pokemon cannot be struck by a critical hit.": "不会被击中要害",
    "After KOing a Pokemon: becomes Ash-Greninja, Water Shuriken: 20 power, hits 3x.": "甲贺忍蛙击倒对方一只宝可梦之后变身为小智版甲贺忍蛙，同时飞水手里剑威力变为20，固定命中三次",
    "This Pokemon's highest stat is raised by 1 if it attacks and KOes another Pokemon.": "击倒对方一只宝可梦之后最高一项能力提升1级",
    "This Pokemon's Sp. Atk is raised by 1 when it reaches 1/2 or less of its max HP.": "因对手的攻击HP变为1/2时，特攻会提高1级",
    "Prevents other Pokemon from lowering this Pokemon's Defense stat stage.": "防御不会下降",
    "Makes user immune to ballistic moves (Shadow Ball, Sludge Bomb, Focus Blast, etc).": "免疫球和弹类招式",
    "If this Pokemon eats a Berry, it restores 1/3 of its max HP after the Berry's effect.": "食用树果触发效果之后额外回复1/3最大HP",
    "If Sunny Day is active, this Pokemon's Speed is doubled.": "大晴天下速度翻倍",
    "Prevents other Pokemon from lowering this Pokemon's stat stages.": "不会因为对手的招式或特性而被降低能力",
    "This Pokemon's type changes to the type of a move it's hit by, unless it has the type.": "受到伤害时若招式属性和宝可梦当前属性不同，则宝可梦在伤害结算后变为该属性",
    "This Pokemon cannot be statused, and is considered to be asleep.": "不会陷入任何异常状态，始终视为处于睡眠状态",
    "This Pokemon's Sp. Atk is raised by 2 for each of its stats that is lowered by a foe.": "能力阶级被降低时特攻提升2级",
    "This Pokemon's moves have their accuracy multiplied by 1.3.": "命中率提升30%",
    "If this Pokemon has a stat stage raised it is lowered instead, and vice versa.": "能力阶级的下降变为上升，上升变为下降",
    "This Pokemon can poison or badly poison other Pokemon regardless of their typing.": "无论对方什么属性都可以使其进入中毒或剧毒状态",
    "If this Pokemon is hit by an attack, there is a 30% chance that move gets disabled.": "受到伤害时有30%几率令其进入定身法状态",
    "30% chance of infatuating Pokemon of the opposite gender if they make contact.": "受到接触类伤害时有30%几率令其进入着迷状态",
    "After another Pokemon uses a dance move, this Pokemon uses the same move.": "有其他宝可梦使用跳舞招式时，立即使用相同的招式",
    "While this Pokemon is active, a Dark move used by any Pokemon has 1.33x power.": "场上所有恶属性招式威力提升33%",
    "While this Pokemon is active, allies are protected from opposing priority moves.": "对方的可以影响到自己或己方宝可梦的先制招式无效",
    "While this Pokemon has 1/2 or less of its max HP, its Attack and Sp. Atk are halved.": "HP低于50%时攻击和特攻减半",
    "This Pokemon's Attack is raised by 2 for each of its stats that is lowered by a foe.": "能力阶级被降低时攻击提升2级",
    "On switch-in, strong winds begin until this Ability is not active in battle.": "登场时天气变为乱流，直到该宝可梦离场，除非天气被终结之地和始源之海更改",
    "On switch-in, extremely harsh sunlight begins until this Ability is not active in battle.": "登场时天气变为大日照，直到该宝可梦离场，除非天气被德尔塔气流和始源之海更改",
    "(Mimikyu only) The first hit it takes is blocked, and it takes 1/8 HP damage instead.": "首次受到的伤害改为损失1/8最大HP，该特性只对谜拟Q有效",
    "On switch-in, Attack or Sp. Atk is raised 1 stage based on the foes' weaker Defense.": "登场时，对方防御小于特防时，自身攻击提升1级；否则特攻提升1级",
    "On switch-in, this Pokemon summons Rain Dance.": "登场时，天气变为下雨",
    "On switch-in, this Pokemon summons Sunny Day.": "登场时，天气变为大晴天",
    "This Pokemon is healed 1/4 by Water, 1/8 by Rain; is hurt 1.25x by Fire, 1/8 by Sun.": "免疫水伤害并回复1/4HP，受到火伤害增加25%；下雨每回合回复1/8HP；大晴天每回合损失1/8HP",
    "This Pokemon's sleep counter drops by 2 instead of 1.": "陷入睡眠的持续回合变为原来的一半",
    "30% chance of poison/paralysis/sleep on others making contact with this Pokemon.": "受到接触类伤害时有30%几率令对方陷入中毒/麻痹/睡眠状态",
    "On switch-in, this Pokemon summons Electric Terrain.": "登场时释放电气场地",
    "This Pokemon switches out when it reaches 1/2 or less of its maximum HP.": "HP低于50%时自身退场",
    "While this Pokemon is active, a Fairy move used by any Pokemon has 1.33x power.": "场上所有妖精属性招式威力提升33%",
    "This Pokemon receives 3/4 damage from supereffective attacks.": "受到效果绝佳伤害时伤害降低25%",
    "30% chance a Pokemon making contact with this Pokemon will be burned.": "受到接触类伤害时有30%几率概率陷入灼伤状态",
    "While this Pokemon is burned, its special attacks have 1.5x power.": "陷入灼伤状态时特攻提升50%",
    "This Pokemon's Fire attacks do 1.5x damage if hit by one Fire move; Fire immunity.": "免疫火属性招式伤害，受到火属性招式攻击时火属性招式威力提升50%",
    "If user is Cherrim and Sunny Day is active, it and allies' Attack and Sp. Def are 1.5x.": "在大晴天和大日照天气时己方所有宝可梦攻击和特防提升50%，樱花儿的形态会改变",
    "This side's Grass types can't have stats lowered or status inflicted by other Pokemon.": "己方所有宝可梦草属性能力阶级不会被降低且不会进入异常状态",
    "This Pokemon takes 1/2 damage from contact moves, 2x damage from Fire moves.": "受到的接触类伤害减半，受到火属性招式伤害翻倍",
    "Castform's type changes to the current weather condition's type, except Sandstorm.": "漂浮泡泡的形态和属性根据天气而变化",
    "On switch-in, this Pokemon is alerted to the foes' move with the highest power.": "登场时，预知对方威力最高的招式",
    "This Pokemon's allies receive 3/4 damage from other Pokemon's attacks.": "己方其他宝可梦受到的伤害降低25%",
    "On switch-in, this Pokemon identifies the held items of all opposing Pokemon.": "登场时，预知对方所有宝可梦的道具",
    "This Pokemon's Defense is doubled.": "防御翻倍",
    "If this Pokemon is at full HP, its Flying-type moves have their priority increased by 1.": "HP全满时飞行属性招式优先度+1",
    "This Pokemon's Normal-type moves become Electric type and have 1.2x power.": "一般属性招式变为电属性招式，威力提升20%",
    "When this Pokemon has 1/2 or less of its maximum HP, it uses certain Berries early.": "HP低于50%时会提前使用特定的树果",
    "Pokemon making contact with this Pokemon have their Speed lowered by 1 stage.": "受到接触伤害时对方速度降低1级",
    "If Grassy Terrain is active, this Pokemon's Defense is multiplied by 1.5.": "青草场地下防御提升50%",
    "On switch-in, this Pokemon summons Grassy Terrain.": "登场时，释放青草场地",
    "If this Pokemon is statused, its Attack is 1.5x; ignores burn halving physical damage.": "陷入异常状态时攻击提升50%，无视灼伤状态减半物理招式伤害效果",
    "If last item used is a Berry, 50% chance to restore it each end of turn. 100% in Sun.": "使用树果后每回合50%概率回收该树果，大晴天和大日照天气下则必定回收",
    "30% chance of curing an adjacent ally's status at the end of each turn.": "回合结束时，30%概率治愈同伴的异常状态",
    "The power of Fire-type attacks against this Pokemon is halved; burn damage halved.": "火属性招式和灼伤伤害减半",
    "This Pokemon's weight is doubled.": "体重翻倍",
    "This Pokemon's Attack is doubled.": "攻击翻倍",
    "On switch-in, this Pokemon's allies have their stat stages reset to 0.": "出场时会从贝壳撒药，将我方的能力变化复原 ",
    "This Pokemon's Attack is 1.5x and accuracy of its physical attacks is 0.8x.": "以物理招式的命中率降低20%为代价提升50%攻击",
    "This Pokemon has its status cured at the end of each turn if Rain Dance is active.": "下雨和大雨天气时，每回合结束治愈异常状态",
    "Prevents other Pokemon from lowering this Pokemon's Attack stat stage.": "攻击能力不会被对方降低",
    "If Hail is active, this Pokemon heals 1/16 of its max HP each turn; immunity to Hail.": "冰雹天气下每回合回复1/16最大HP，免疫冰雹伤害",
    "This Pokemon appears as the last Pokemon in the party until it takes direct damage.": "受到伤害前始终显示为队伍中最后一个宝可梦的形象",
    "This Pokemon cannot be poisoned. Gaining this Ability while poisoned cures it.": "不会陷入中毒状态。获得特性时可治愈中毒状态",
    "On switch-in, this Pokemon Transforms into the opposing Pokemon that is facing it.": "登场时以对应宝可梦为目标进入变身状态",
    "Moves ignore substitutes and foe's Reflect/Light Screen/Safeguard/Mist/Aurora Veil.": "自身使用招式时无视对方的替身/反射壁/光墙/神秘守护/白雾/极光幕",
    "If this Pokemon is KOed with a move, that move's user loses an equal amount of HP.": "被击倒时对方损失同样数量的HP",
    "This Pokemon cannot fall asleep. Gaining this Ability while asleep cures it.": "不会陷入睡眠状态，在睡眠状态时获得这个特性可以治愈睡眠",
    "On switch-in, this Pokemon lowers the Attack of adjacent opponents by 1 stage.": "登场时对方全体宝可梦攻击降低1级",
    "Pokemon making contact with this Pokemon lose 1/8 of their max HP.": "受到接触伤害时对方损失1/8最大HP",
    "This Pokemon's punch-based attacks have 1.2x power. Sucker Punch is not boosted.": "拳类招式威力提升20%",
    "This Pokemon's Attack is raised by 1 stage after it is damaged by a Dark-type move.": "受到恶属性招式攻击时攻击提升1级",
    "This Pokemon's accuracy can't be lowered by others; ignores their evasiveness stat.": "命中率不会被下降，无视对方闪避率等级",
    "This Pokemon's held item has no effect, except Macho Brace. Fling cannot be used.": "携带的道具无效，超级石、Z纯晶和影响基础点数、经验值和亲密度的携带物品除外，无法使用投掷",
    "If Sunny Day is active, this Pokemon cannot be statused and Rest will fail for it.": "大晴天和大日照天气下不会陷入异常状态，使用睡觉会无效",
    "This Pokemon is immune to Ground; Gravity/Ingrain/Smack Down/Iron Ball nullify it.": "免疫地面属性伤害，但受到重力、扎根、击落和黑色铁球影响时仍会受到伤害",
    "This Pokemon's weight is halved.": "体重减半",
    "This Pokemon draws Electric moves to itself to raise Sp. Atk by 1; Electric immunity.": "自动成为对方电属性招式的攻击目标并提升1级特攻；免疫电属性攻击",
    "This Pokemon cannot be paralyzed. Gaining this Ability while paralyzed cures it.": "不会陷入麻痹状态，获得特性时可治愈麻痹状态",
    "This Pokemon damages those draining HP from it for as much as they would heal.": "受到吸取HP的招式伤害时，对方本应吸取的体力会转为受到同等的伤害",
    "This Pokemon's sound-based moves become Water type.": "声音类招式均变为水属性",
    "This Pokemon's attacks do not make contact with the target.": "所有招式均视为非接触类招式",
    "This Pokemon blocks certain status moves and bounces them back to the user.": "将对方以自身为目标的部分变化类招式无效化并反弹给招式的使用者",
    "This Pokemon can only be damaged by direct attacks.": "免疫除攻击招式以外的一切造成的伤害",
    "If this Pokemon has no item, it steals the item off a Pokemon it hits with an attack.": "造成伤害时，如果没有携带道具则获得对方道具",
    "This Pokemon cannot be frozen. Gaining this Ability while frozen cures it.": "不会陷入冰冻状态。获得特性时可治愈冰冻状态",
    "Prevents adjacent Steel-type foes from choosing to switch.": "对方的钢属性宝可梦不能交换",
    "If this Pokemon is statused, its Defense is 1.5x.": "异常状态下防御增加50%",
    "This Pokemon's pulse moves have 1.5x power. Heal Pulse heals 3/4 target's max HP.": "波动类和波导类招式威力提升50%，治愈波动回复量上升为3/4最大HP",
    "This Pokemon's attacks are critical hits if the target is poisoned.": "此特性的宝可梦攻击处于中毒或剧毒状态的宝可梦必定会击中要害",
    "On switch-in, this Pokemon summons Misty Terrain.": "登场时，释放薄雾场地",
    "This Pokemon's moves and their effects ignore the Abilities of other Pokemon.": "招式无视对方特性",
    "This Pokemon's Speed is raised 1 stage if hit by an Electric move; Electric immunity.": "受到电属性招式攻击时速度提升1级；免疫电属性招式伤害",
    "This Pokemon's Attack is raised by 1 stage if it attacks and KOes another Pokemon.": "每击倒对方一只宝可梦攻击提升1级",
    "If this Pokemon is at full HP, damage taken from attacks is halved.": "HP全满时受到的伤害减半",
    "If this Pokemon is an Arceus, its type changes to match its held Plate or Z-Crystal.": "阿尔宙斯的属性随着它携带的石板或Z纯晶改变",
    "Pokemon making contact with this Pokemon have their Ability changed to Mummy.": "受到接触类伤害时令对手的特性变为木乃伊",
    "This Pokemon has its major status condition cured when it switches out.": "退场时治愈自身的异常状态",
    "Every move used by or against this Pokemon will always hit.": "自身使用和以自身为目标的招式必定命中",
    "This Pokemon's moves are changed to be Normal type and have 1.2x power.": "全部招式变为一般属性招式，威力提升20%",
    "This Pokemon is immune to powder moves and damage from Sandstorm or Hail.": "免疫沙暴和冰雹天气带来的影响，对粉末类招式免疫",
    "This Pokemon's damaging moves hit twice. The second hit has its damage quartered.": "攻击两次；第二次攻击伤害变为第一次的1/4",
    "If this Pokemon has no item, it finds one used by an adjacent Pokemon this turn.": "回合结束时，若没有携带道具则获得本回合其他宝可梦使用或投掷过的道具",
    "If this Pokemon has no item, it steals the item off a Pokemon making contact with it.": "受到接触伤害时，若没有携带道具则获得对方道具",
    "This Pokemon's Normal-type moves become Fairy type and have 1.2x power.": "一般属性招式变为妖精属性招式，威力提升20%",
    "This Pokemon is healed by 1/8 of its max HP each turn when poisoned; no HP loss.": "处于中毒或剧毒状态时不会损失HP，每回合回复1/8最大HP",
    "30% chance a Pokemon making contact with this Pokemon will be poisoned.": "受到接触类伤害时有30%几率令其陷入中毒状态",
    "This Pokemon's contact moves have a 30% chance of poisoning.": "接触类招式造成伤害时有30%几率令其陷入中毒状态",
    "If Zygarde 10%/50%, changes to Complete if at 1/2 max HP or less at end of turn.": "基格尔德10%形态或50%的HP低于50%时在回合结束会变为完全体形态",
    "This Pokemon copies the Ability of an ally that faints.": "同伴被击倒后自身特性变为与之相同",
    "This Pokemon's Status moves have priority raised by 1, but Dark types are immune.": "变化招式的优先度+1，但对恶属性宝可梦无效",
    "If this Pokemon is the target of a foe's move, that move loses one additional PP.": "对方以自身为目标的招式额外消耗1PP",
    "On switch-in, heavy rain begins until this Ability is not active in battle.": "登场时天气变为大雨，直到该宝可梦离场，除非天气被德尔塔气流和终结之地更改",
    "This Pokemon's type changes to match the type of the move it is about to use.": "自身属性变为即将使用的招式的属性",
    "On switch-in, this Pokemon summons Psychic Terrain.": "登场时，释放精神场地",
    "If this Pokemon is statused, its Speed is 1.5x; ignores Speed drop from paralysis.": "异常状态下速度增加50%，无视麻痹带来的速度降低影响",
    "If Rain Dance is active, this Pokemon heals 1/16 of its max HP each turn.": "下雨天气下每回合回复1/16最大HP",
    "This Pokemon's attacks with recoil or crash damage have 1.2x power; not Struggle.": "使用具有反作用力伤害的招式时威力提升20%，挣扎除外",
    "This Pokemon's Normal-type moves become Ice type and have 1.2x power.": "一般属性招式变为冰属性招式，威力提升20%",
    "This Pokemon restores 1/3 of its maximum HP, rounded down, when it switches out.": "下场时回复1/3最大HP",
    "This Pokemon's attacks do 1.25x on same gender targets; 0.75x on opposite gender.": "对方与自身性别相同时威力提升25%，性别不同时下降25%",
    "If this Pokemon is a Silvally, its type changes to match its held Memory.": "银伴战兽的属性随着它携带的存储碟改变",
    "This Pokemon does not take recoil damage besides Struggle/Life Orb/crash damage.": "不会受到自身招式的反作用力伤害，挣扎、飞踢和飞膝踢除外；生命宝珠的副作用不受影响",
    "This Pokemon's Ground/Rock/Steel attacks do 1.3x in Sandstorm; immunity to it.": "沙暴天气下地面/岩石/钢属性招式威力提升30%；免疫沙暴伤害",
    "If Sandstorm is active, this Pokemon's Speed is doubled; immunity to Sandstorm.": "沙暴天气下速度翻倍；免疫沙暴伤害",
    "On switch-in, this Pokemon summons Sandstorm.": "登场时，天气变为沙暴",
    "If Sandstorm is active, this Pokemon's evasiveness is 1.25x; immunity to Sandstorm.": "沙暴天气下闪避率增加25%；免疫沙暴伤害",
    "This Pokemon's Attack is raised 1 stage if hit by a Grass move; Grass immunity.": "受到草属性招式攻击时攻击提升1级；免疫草属性招式伤害",
    "If user is Wishiwashi, changes to School Form if it has > 1/4 max HP, else Solo Form.": "弱丁鱼的HP高于1/4时变为鱼群的样子，否则变为单独的样子",
    "This Pokemon's moves have their secondary effect chance doubled.": "招式的追加效果出现率翻倍",
    "Prevents adjacent foes from choosing to switch unless they also have this Ability.": "除非对方拥有同样的特性，否则不能替换宝可梦",
    "This Pokemon has a 33% chance to have its status cured at the end of each turn.": "回合结束时，33%几率治愈异常状态",
    "This Pokemon's attacks with secondary effects have 1.3x power; nullifies the effects.": "以无视招式的追加效果为代价，带有追加效果的招式的威力提升33%",
    "This Pokemon is not affected by the secondary effect of another Pokemon's attack.": "受到攻击时对方招式的追加效果不会发动",
    "If Minior, switch-in/end of turn it changes to Core at 1/2 max HP or less, else Meteor.": "当HP变为50%以下时，壳会坏掉，变得有攻击性",
    "This Pokemon's multi-hit attacks always hit the maximum number of times.": "使用连续招式时，攻击次数会固定在五次",
    "On switch-in, this Pokemon's Attack and Speed are halved for 5 turns.": "登场之后的5回合内攻击和速度减半",
    "If Snow is active, this Pokemon's Speed is doubled.": "下雪时速度翻倍",
    "If Hail is active, this Pokemon's Speed is doubled.": "冰雹下速度翻倍",
    "If this Pokemon strikes with a critical hit, the damage is multiplied by 1.5.": "击中要害的招式伤害提升50%",
    "If Hail is active, this Pokemon's evasiveness is 1.25x; immunity to Hail.": "冰雹天气下闪避率增加25%；免疫冰雹伤害",
    "On switch-in, this Pokemon summons Hail.": "登场时，天气变为冰雹",
    "If Sunny Day is active, this Pokemon's Sp. Atk is 1.5x; loses 1/8 max HP per turn.": "大晴天天气下特攻增加50%；大晴天天气下回合结束时损失1/8最大HP",
    "This Pokemon's Sp. Atk is raised by 1 stage when another Pokemon faints.": "击倒对方时特攻提升1级",
    "This Pokemon is immune to sound-based moves, including Heal Bell.": "免疫声音类招式",
    "This Pokemon's Speed is raised 1 stage at the end of each full turn on the field.": "回合结束时速度提升1级",
    "This Pokemon moves last among Pokemon using the same or greater priority moves.": "优先度相同时必定后出",
    "This Pokemon's Defense is raised by 1 stage after it is damaged by a move.": "受到伤害后防御提升1级",
    "If Aegislash, changes Forme to Blade before attacks and Shield before King's Shield.": "坚盾剑怪使用攻击招式时会变为刀剑形态，使用王者盾牌时变为盾牌形态",
    "30% chance a Pokemon making contact with this Pokemon will be paralyzed.": "受到接触伤害时有30%几率令对方陷入麻痹状态",
    "If this Pokemon flinches, its Speed is raised by 1 stage.": "畏缩时提升1级速度",
    "This Pokemon's attacks without a chance to flinch have a 10% chance to flinch.": "不会造成畏缩的招式造成伤害时10%造成对方畏缩",
    "This Pokemon cannot lose its held item due to another Pokemon's attack.": "不会因对方招式失去携带的道具",
    "This Pokemon draws Water moves to itself to raise Sp. Atk by 1; Water immunity.": "自动成为对方水属性招式的攻击目标并提升1级特攻；免疫水属性攻击",
    "This Pokemon's bite-based attacks have 1.5x power. Bug Bite is not boosted.": "啃咬类招式威力提升50%，虫咬除外",
    "If this Pokemon is at full HP, it survives one hit with at least 1 HP. Immune to OHKO.": "HP全满时受到致命伤害会保留1HP；免疫一击必杀招式",
    "This Pokemon cannot be forced to switch out by another Pokemon's attack or item.": "不会因对方招式退场",
    "This Pokemon's critical hit ratio is raised by 1 stage.": "击中要害等级提升1级",
    "If Electric Terrain is active, this Pokemon's Speed is doubled.": "电气场地下速度翻倍",
    "This Pokemon and its allies cannot fall asleep.": "己方所有宝可梦不会陷入睡眠状态",
    "If Rain Dance is active, this Pokemon's Speed is doubled.": "在下雨时速度翻倍",
    "If an ally uses its item, this Pokemon gives its item to that ally immediately.": "同伴使用道具后会立即将您的道具交给它",
    "If another Pokemon burns/poisons/paralyzes this Pokemon, it also gets that status.": "如果因对方招式而陷入灼伤/中毒/麻痹状态，对方也同样陷入同样的状态",
    "This Pokemon's evasiveness is doubled as long as it is confused.": "混乱状态下闪避率翻倍",
    "This Pokemon's moves of 60 power or less have 1.5x power. Includes Struggle.": "使用威力低于60的招式时威力增加50%，挣扎除外",
    "This Pokemon does not take damage from attacks made by its allies.": "不会受到同伴招式的伤害",
    "Fire/Ice-type moves against this Pokemon deal damage with a halved attacking stat.": "受到火属性和冰属性招式造成的伤害减半",
    "This Pokemon's attacks that are not very effective on a target deal double damage.": "该特性的宝可梦自身发动效果不好的招式伤害翻倍。",
    "While this Pokemon is poisoned, its physical attacks have 1.5x power.": "中毒和剧毒状态下物理招式威力提升50%",
    "This Pokemon's contact moves have their power multiplied by 1.3.": "接触类招式威力提升30%",
    "On switch-in, or when it can, this Pokemon copies a random adjacent foe's Ability.": "登场时复制一个随机对方宝可梦的特性",
    "This Pokemon's healing moves have their priority increased by 3.": "回复HP的招式优先度+3",
    "This Pokemon skips every other turn instead of using a move.": "使用招式之后，下一回合不能使用招式",
    "This Pokemon ignores other Pokemon's stat stages when taking or doing damage.": "使用或受到招式造成伤害时无视对方的能力阶级变化",
    "Speed is doubled on held item loss; boost is lost if it switches, gets new item/Ability.": "失去道具时速度翻倍，退场或获得新道具后复原",
    "While this Pokemon is active, it prevents opposing Pokemon from using their Berries.": "对方宝可梦不可使用树果",
    "This Pokemon and its allies' moves have their accuracy multiplied by 1.1.": "场上己方所有宝可梦命中率提升10%",
    "This Pokemon heals 1/4 of its max HP when hit by Electric moves; Electric immunity.": "受到电属性招式攻击时回复1/4最大HP；免疫电属性伤害",
    "This Pokemon heals 1/4 of its max HP when hit by Water moves; Water immunity.": "受到水属性招式攻击时回复1/4最大HP；免疫水属性伤害",
    "This Pokemon's Water power is 2x; it can't be burned; Fire power against it is halved.": "水属性招式威力翻倍；不会陷入灼伤状态；受到的火属性招式伤害减半",
    "This Pokemon's Defense is raised 2 stages after it is damaged by a Water-type move.": "受到水属性招式攻击时防御提升2级",
    "This Pokemon cannot be burned. Gaining this Ability while burned cures it.": "不会陷入灼伤状态。获得特性时可治愈灼伤状态",
    "If a physical attack hits this Pokemon, Defense is lowered by 1, Speed is raised by 2.": "受到物理招式伤害时防御降低1级，同时速度提升2级",
    "This Pokemon can only be damaged by supereffective moves and indirect damage.": "只会受到效果绝佳招式的攻击伤害，天气、异常状态、附加伤害效果依然有效",
    "Status moves with accuracy checks are 50% accurate when used on this Pokemon.": "变化招式对该特性的宝可梦命中率减半",
    "If Darmanitan, at end of turn changes Mode to Standard if > 1/2 max HP, else Zen.": "HP不足一半时转变为达摩形态",
    "This Pokemon's same-type attack bonus (STAB) is 2 instead of 1.5.": "与自身属性一致的招式威力由1.5倍变为2倍",
    "No competitive use.": "没有实战用途",
    "At 1/3 or less of its max HP, this Pokemon's attacking stat is 1.5x with Fire attacks.": "HP低于1/3时，火属性招式的威力变为1.5倍",
    "Lowers Speed of all Pokemon except itself when hit by an attack.": "被攻击后，降低除自己以外的所有宝可梦的速度",
    "Prevents Explosion/Mind Blown/Self-Destruct/Aftermath while this Pokemon is active.": "该特性会使自爆、大爆炸、惊爆大头和引爆特性不发动",
    "On switch-in, this Pokemon's Defense is raised by 1 stage.": "出场时，防御上升1级",
    "On switch-in, this Pokemon's Attack is raised by 1 stage.": "出场时，攻击上升1级",
    "Boosts the Pokemon's Attack stat but only allows the use of the first selected move.": "攻击获得提升，只能使用上场后使出的第一个招式",
    "Get prey with Surf/Dive. When taking damage, prey is used to attack.": "使用冲浪/潜水后，如果受到攻击会进行反击",
    "Changes between Full Belly and Hangry Mode at the end of each turn.": "每回合结束时会在饥饿花纹和饱腹花纹之间切换",
    "Pokemon's head functions as substitute for a physical attack. Restored in hail.": "头部的冰会代替自己承受物理攻击，样子也会改变，下冰雹时恢复原状",
    "Changes the Pokemon's type depending on the terrain.": "宝可梦的属性会随着场地变化而变化",
    "If an active ally has this Ability or the Plus Ability, this Pokemon's Sp. Atk is 1.5x.": "场上己方同伴具有负电或正电特性时，特攻变为1.5倍",
    "Bounces back only the stat-lowering effects that the Pokemon receives.": "只反弹自己受到的能力降低效果",
    "This Pokemon's attacks that are super effective against the target do 1.25x damage.": "使用效果绝佳的招式，伤害变为1.25倍",
    "Nullifies abilities while on the field.": "该特性的宝可梦在场时，场上所有宝可梦的特性无法生效",
    "At 1/3 or less of its max HP, this Pokemon's attacking stat is 1.5x with Grass attacks.": "HP低于1/3时，草属性招式的威力变为1.5倍",
    "Protects the Pokemon and its ally Pokemon from being poisoned.": "自己和同伴都不会陷入中毒的异常状态",
    "When hit by a contact move, the Pokemon and the attacker faint in 3 turns.": "受到接触攻击时，3回合后攻击者和自身都会倒下，交换解除效果",
    "If an active ally has this Ability or the Minus Ability, this Pokemon's Sp. Atk is 1.5x.": "场上己方同伴具有负电或正电特性时，特攻变为1.5倍",
    "Boosts sound move power, 0.5× damage from sound moves.": "提升声音类招式的威力，受到声音类招式的伤害减半",
    "Ripens Berries and doubles their effect.": "树果的效果翻倍",
    "The Pokemon creates a sandstorm when it's hit by an attack.": "受到攻击时使天气变为沙暴",
    "Removes Screens and Veil Effects on switchin.": "出场时双方的反射壁、光墙和极光幕都会消失",
    "When this Pokemon's stat stages are raised or lowered, the effect is doubled instead.": "该特性宝可梦的能力变化会变为平时的2倍",
    "This Pokemon's attacking stat is doubled against a target that switched in this turn.": "对替换出场的宝可梦以2倍的伤害进行攻击",
    "This Pokemon's Speed is raised by 6 stages after it is damaged by Fire/Water moves.": "受到火属性或者水属性的招式攻击后，速度上升6级",
    "This Pokemon's attacking stat is multiplied by 1.5 while using a Steel-type attack.": "使用钢属性的招式威力变为1.5倍",
    "At 1/3 or less of its max HP, this Pokemon's attacking stat is 1.5x with Bug attacks.": "HP低于1/3时，虫属性招式的威力变为1.5倍",
    "At 1/3 or less of its max HP, this Pokemon's attacking stat is 1.5x with Water attacks.": "HP低于1/3时，水属性招式的威力变为1.5倍",
    "Exchanges abilities when hitting a Pokemon with a contact move.": "受到接触攻击时与攻击方交换特性",
    "Fighting, Normal moves hit Ghost. Immune to Intimidate.": "一般和格斗属性招式可以攻击到幽灵属性宝可梦。免疫威吓",
    "This Pokemon cannot be made to flinch. Immune to Intimidate.": "不会陷入畏缩状态。免疫威吓",
    "This Pokemon cannot be infatuated or taunted. Immune to Intimidate.": "不会陷入着迷和挑衅状态。免疫威吓",
    "This Pokemon cannot be confused. Immune to Intimidate.": "不会陷入混乱状态。免疫威吓",
    "This Pokemon and its allies' Steel-type moves have their BP mutiplied by 1.5.": "该特性的宝可梦和在场同伴使用钢属性招式时威力提升50%",
    "This Pokemon's allies have the base power of their moves multiplied by 1.3.": "该特性的宝可梦和在场同伴招式威力提升30%",
    "Ignores the effects of opposing Pokemon's Abilities and moves that draw in moves.": "能无视具有吸引对手招式效果的特性或招式的影响",
    "Ignores the effects of opposing Pokemon's moves/Abilities that redirect move targets.": "能无视具有吸引对手招式效果的特性或招式的影响",
    "This Pokemon's Special Defense is doubled.": "特防翻倍",
    "Boosts a random stat (except accuracy/evasion) +2 and another stat -1 every turn.": "每回合结束时随机降低一项能力等级并提升两项能力等级，闪避率/命中率除外",
    "Speed is raised 1 stage if hit by a Bug-, Dark-, or Ghost-type attack, or Intimidated.": "受到虫/恶/幽灵属性招式攻击或者被威吓后速度提升1级",
    "The combination of Unnerve and Grim Neigh.": "兼备紧张感和漆黑嘶鸣这两种特性",
    "The combination of Unnerve and Chilling Neigh.": "兼备紧张感和苍白嘶鸣这两种特性",
    "This Pokemon's attacking stat is multiplied by 1.5 while using an Electric-type attack.": "拥有此特性的宝可梦使出的电属性招式威力会提高50%",
    "This Pokemon's attacking stat is multiplied by 1.5 while using a Dragon-type attack. ": "拥有此特性的宝可梦使出的龙属性招式威力会提高50%",
    "Does nothing.": "没有任何用途",
    "On switch-in, this Pokemon's Attack is raised by 1 stage. Once per battle.": "出场时，提升1级攻击。每场对战仅能发动一次",
    "On switch-in, this Pokemon's Defense is raised by 1 stage. Once per battle.": "出场时，提升1级防御。每场对战仅能发动一次",
    "This Pokemon's type changes to the type of the move it is using. Once per switch-in.": "自身属性变为即将使用的招式的属性。每次出场仅能发动一次",
    "After KOing a Pokemon: raises Attack, Sp. Atk, Speed by 1 stage. Once per battle.": "击败对手一只宝可梦后，攻击、特攻和速度提升1级。每场对战仅能发动一次",
    "This Pokemon's moves have a 30% chance of badly poisoning.": "该特性的宝可梦攻击命中目标时，30%的概率会令目标陷入剧毒状态",
    "Sunny Day active or Booster Energy used: highest stat is 1.3x, or 1.5x if Speed.": "携带驱劲能量或天气为大晴天时，数值最高的能力会提高30%；若该项能力为速度，则会提高50%",
    "Electric Terrain active or Booster Energy used: highest stat is 1.3x, or 1.5x if Speed.": "携带驱劲能量或场地处于电气场地时，数值最高的能力会提高30%；若该项能力为速度，则会提高50%",
    "On switch-in, this Pokemon lowers the evasiveness of opponents 1 stage. Once per battle.": "首次出场时，令对手的闪避率下降1级",
    "On switch-in, this Pokemon restores 1/4 of its ally's maximum HP, rounded down.": "出场时款待同伴，使其回复1/4最大HP",
    "Fire damage against this Pokemon is dealt with 1/2 offensive stat; 1/2 burn damage.": "火属性招式和灼伤对您造成的伤害变为原本的一半",
    "Fighting, Normal moves hit Ghost. Accuracy can't be lowered, ignores evasiveness.": "使出一般属性和格斗属性的招式时可以击中幽灵属性的宝可梦",
    "If this Pokemon is a Terapagos, it transforms into its Terastal Form on entry.": "出场时会吸收周围的能量，变为太晶形态",
    "Terapagos: If full HP, attacks taken have 0.5x effectiveness unless naturally immune.": "HP全满时，如果受到的攻击招式的属性相性倍率为1或以上，将变为效果不好",
    "Terapagos: Terastallizing ends the effects of weather and terrain. Once per battle.": "令场上所有的天气型状态和场地型状态消失。每场对战仅能发动1次",
    "If this Pokemon poisons or badly poisons a target, the target also becomes confused.": "因您的招式而陷入中毒状态的对手同时也会陷入混乱状态",
    "Pecharunt: If this Pokemon poisons a target, the target also becomes confused.": "因桃歹郎的招式而陷入中毒状态的对手同时也会陷入混乱状态",
    "On switch-in, summons Sunny Day. During Sunny Day, Attack is 1.3333x.": "出场时，天气变为大晴天并持续5回合。天气为大晴天时，攻击提高33%",
    "On switch-in, summons Electric Terrain. During Electric Terrain, Sp. Atk is 1.3333x.": "出场时，场地转为电气场地并持续5回合。场地为电气场地时，特攻提高33%",
    "Active Pokemon without this Ability have their Special Defense multiplied by 0.75.": "在场时，除该特性的宝可梦外，其他特性的宝可梦的特防降低为原本的75%",
    "Active Pokemon without this Ability have their Defense multiplied by 0.75.": "在场时，除该特性的宝可梦外，其他特性的宝可梦的防御降低为原本的75%",
    "Active Pokemon without this Ability have their Special Attack multiplied by 0.75.": "在场时，除该特性的宝可梦外，其他特性的宝可梦的特攻降低为原本的75%",
    "Active Pokemon without this Ability have their Attack multiplied by 0.75.": "在场时，除该特性的宝可梦外，其他特性的宝可梦的攻击降低为原本的75%",
    "Ghost damage to this Pokemon dealt with a halved offensive stat; can't be statused.": "该特性的宝可梦不会陷入异常状态。受到幽灵属性的攻击招式伤害减半",
    "This Pokemon gains the Charge effect when hit by a wind move or Tailwind begins.": "受到风的招式攻击或己方使用顺风时，会进入充电状态",
    "Attack raised by 1 if hit by a wind move or Tailwind begins. Wind move immunity.": "受到风的招式攻击或己方使用顺风时，提升1级攻击。不受风的招式影响。",
    "This Pokemon's slicing moves have their power multiplied by 1.5.": "该特性的宝可梦使出的切割类招式威力提高50%",
    "On switch-in, this Pokemon copies all of its ally's stat stage changes.": "该特性的宝可梦出场时，会复制同伴的能力变化",
    "If this Pokemon eats a Berry, it will eat that Berry again at the end of the next turn.": "食用树果，或受到投掷的树果影响后，会在下一回合结束时，再食用1次该树果",
    "This Pokemon heals 1/4 of its max HP when hit by Ground moves; Ground immunity.": "该特性的宝可梦不受地面属性招式的影响；当被地面属性的招式击中时，回复25%最大HP",
    "This Pokemon is immune to powder moves, Sandstorm damage, and Effect Spore.": "该特性的宝可梦不会受到沙暴和冰雹天气带来的影响，并免疫粉末类招式",
    "This Pokemon's moves have 10% more power for each fainted ally, up to 5 allies.": "我方每有一只宝可梦陷入过濒死，招式威力提升10%。最多触发5次",
    "If this Pokemon is hit by a physical attack, Toxic Spikes are set on the opposing side.": "该特性的宝可梦受到物理招式攻击时，会向对手的场地撒下毒菱",
    "This Pokemon's Status moves go last in their priority bracket and ignore Abilities.": "该特性的宝可梦使出变化招式时，使目标的特性失效。在同一优先度下最晚行动",
    "At 1/2 or less of this Pokemon's max HP: +1 Atk, Sp. Atk, Spe, and -1 Def, Sp. Def.": "HP因受到攻击变为1/2以下时，防御和特防降低1级，攻击、特攻和速度提高1级。",
    "This Pokemon gains the Charge effect when it takes a hit from an attack.": "受到伤害时，会进入充电状态",
    "Making contact with this Pokemon has the attacker's Ability become Lingering Aroma.": "该特性的宝可梦在受到接触类招式的攻击时，对手的特性会变成甩不掉的气味",
    "On switch-in, this Pokemon's Special Defense is raised by 1 stage.": "出场时，特防上升1级",
    "On switch-in, this Pokemon's Speed is raised by 1 stage.": "出场时，速度上升1级",
    "If Snow is active, this Pokemon's evasiveness is 1.25x.": "天气处于冰雹或下雪状态时，闪避率提升25%",
    "On switch-in, this Pokemon summons Snow.": "出场时，会将天气变为下雪",
    "If this Pokemon is a Palafin in Zero Form, switching out has it change to Hero Form.": "回到同行队伍后，会变为全能形态",
    "If Snow is active, this Pokemon heals 1/16 of its max HP each turn.": "天气处于冰雹或下雪状态时，每回合结束时回复最大HP的1/16",
    "This Pokemon's Attack is raised by 1 when damaged by Fire moves; can't be burned.": "受到火属性招式攻击时攻击提升1级；不会陷入灼伤状态",






    //   前代特性

    "Raises a random stat by 2 and lowers another stat by 1 at the end of each turn.": "每回合结束时随机降低一项能力等级并提升两项能力等级",
    "This Pokemon cannot be made to flinch.": "不会畏缩",
    "This Pokemon cannot be infatuated or taunted.": "不会陷入着迷和挑衅状态",
    "This Pokemon's Speed is raised 1 stage if hit by a Bug-, Dark-, or Ghost-type attack.": "受到虫/恶/幽灵属性招式攻击后速度提升1级",
    "This Pokemon can hit Ghost types with Normal- and Fighting-type moves.": "一般和格斗属性招式可以攻击到幽灵属性宝可梦",
    "This Pokemon cannot be confused.": "不会陷入混乱状态",
    "(Mimikyu only) First hit deals 0 damage, breaks disguise.": "首次伤害视为0，并改变样子，该特性只对谜拟Q有效",
    "Prevents Explosion/Self-Destruct/Aftermath while this Pokemon is active.": "当该宝可梦在场时，自爆和大爆炸会使用失败，引爆特性不发动",
    "30% chance each adjacent ally has its status cured at the end of each turn.": "每回合结束有30%几率治愈相邻同伴的异常状态",
    "On switch-in, this Pokemon identifies the held item of a random opposing Pokemon.": "登场时，预知对手一个随机宝可梦的道具",
    "This Pokemon is immune to sound-based moves, except Heal Bell.": "不受声音的招式影响，包括治愈铃声",
    "If a physical attack hits this Pokemon, Defense is lowered by 1, Speed is raised by 1.": "受到物理招式的伤害时，防御会降低1级，速度提高1级",
    "This Pokemon's non-damaging moves have their priority increased by 1.": "变化招式的优先度+1",
    "This Pokemon's moves ignore the foe's Reflect, Light Screen, Safeguard, and Mist.": "自身使用招式时无视对方的反射壁/光墙/神秘守护和白雾",
    "This Pokemon cannot be infatuated. Gaining this Ability while infatuated cures it.": "该特性的宝可梦不会陷入着迷状态。陷入此状态的宝可梦获得该特性时此状态消除",
    "Prevents adjacent opposing Steel-type Pokemon from choosing to switch out.": "使对方的钢属性宝可梦无法替换",
    "OHKO moves fail when used against this Pokemon.": "一击必杀招式对拥有该特性的宝可梦无效",
    "If this Pokemon is the target of a move, that move loses one additional PP.": "在场的其他宝可梦的招式额外消耗1PP",
    "This Pokemon is immune to Ground; Gravity/Ingrain/Iron Ball nullify it.": "免疫地面属性伤害，但受到重力/扎根/黑色铁球的影响时仍会受到伤害",
    "If this Pokemon is the target of a move, that move loses one additional PP.": "以自身为目标的招式额外消耗1PP",
    "At 1/3 or less of its max HP, this Pokemon's Water-type attacks have 1.5x power.": "当HP小于1/3时，水属性招式的威力提升50%",
    "At 1/3 or less of its max HP, this Pokemon's Fire-type attacks have 1.5x power.": "当HP小于1/3时，火属性招式的威力提升50%",
    "At 1/3 or less of its max HP, this Pokemon's Grass-type attacks have 1.5x power.": "当HP小于1/3时，草属性招式的威力提升50%",
    "This Pokemon's moves of 60 power or less have 1.5x power, except Struggle.": "使用除挣扎外的威力≤60的招式，威力提升50%",
    "At 1/3 or less of its max HP, this Pokemon's Bug-type attacks have 1.5x power.": "当HP小于1/3时，虫属性招式的威力提升50%",
    "Prevents other Pokemon from lowering this Pokemon's accuracy stat stage.": "命中率能力变化不会被其他宝可梦以任何方式降低",
    "The power of Fire- and Ice-type attacks against this Pokemon is halved.": "受到冰属性或火属性招式攻击时，在伤害计算中对方的招式威力减半。",
    "This Pokemon's moves are changed to be Normal type.": "全部招式变为一般属性招式",
    "If an active ally has the Plus Ability, this Pokemon's Sp. Atk is 1.5x.": "场上己方同伴具有正电特性时，特攻变为1.5倍",
    "If an active ally has the Minus Ability, this Pokemon's Sp. Atk is 1.5x.": "场上己方同伴具有负电特性时，特攻变为1.5倍",
    "If an active Pokemon has the Plus Ability, this Pokemon's Sp. Atk is 1.5x.": "场上有宝可梦具有正电特性时，特攻变为1.5倍",
    "If an active Pokemon has the Minus Ability, this Pokemon's Sp. Atk is 1.5x.": "场上有宝可梦具有负电特性时，特攻变为1.5倍",
    "This Pokemon draws single-target Electric moves to itself.": "自动成为对方电属性招式的攻击目标",
    "This Pokemon is only damaged by Fire Fang, supereffective moves, indirect damage.": "只会受到火焰牙和效果绝佳招式的攻击伤害，间接伤害依然有效",
    "This Pokemon is only damaged by supereffective moves and indirect damage.": "只会受到间接伤害和效果绝佳招式的攻击伤害",
    "This Pokemon does not take recoil damage besides Struggle and crash damage.": "不会受到自身招式的反作用力伤害，挣扎、飞踢和飞膝踢除外",
    "10% chance of poison/paralysis/sleep on others making contact with this Pokemon.": "受到接触类伤害时有10%几率令对方陷入中毒/麻痹/睡眠状态",
    "This Pokemon is immune to Ground.": "免疫地面属性伤害",
    "This Pokemon heals 1/4 its max HP when hit by a damaging Electric move; immunity.": "受到电属性的非变化招式攻击时回复1/4最大HP免疫；电属性伤害",
    "Prevents Steel-type Pokemon from choosing to switch out, other than this Pokemon.": "使除自身外的钢属性宝可梦无法替换",
    "Fire-/Ice-type moves against this Pokemon deal damage with a halved Sp. Atk stat.": "拥有该特性的宝可梦受到冰属性或火属性招式攻击时，伤害减半",
    "This Pokemon draws single-target Electric moves used by opponents to itself.": "自动成为对方电属性招式的攻击目标",
    "1/3 chance a Pokemon making contact with this Pokemon will be paralyzed.": "受到接触伤害时有1/3几率令对方陷入麻痹状态",
    "Prevents Explosion and Self-Destruct while this Pokemon is active.": "当该宝可梦在场时，自爆和大爆炸会使用失败",
    "Pokemon making contact with this Pokemon lose 1/16 of their max HP.": "受到接触伤害时对方损失1/16最大HP",
    "1/3 chance a Pokemon making contact with this Pokemon will be poisoned.": "受到接触类伤害时有1/3几率令其陷入中毒状态",
    "1/3 chance of infatuating Pokemon of the opposite gender if they make contact.": "受到接触类伤害时有1/3几率令其进入着迷状态",
    "This Pokemon's damaging moves hit twice. The second hit has its damage halved.": "攻击两次；第二次攻击伤害变为第一次的1/2",
    "This Pokemon's Normal-type moves become Flying type and have 1.3x power.": "一般属性招式变为飞行属性招式，威力提升30%",
    "This Pokemon's Normal-type moves become Fairy type and have 1.3x power.": "一般属性招式变为妖精属性招式，威力提升30%",
    "This Pokemon's Normal-type moves become Ice type and have 1.3x power.": "一般属性招式变为冰属性招式，威力提升30%",
    "Moves ignore substitutes and the foe's Reflect, Light Screen, Safeguard, and Mist.": "自身使用招式时无视对方的替身/反射壁/光墙/神秘守护/白雾",
    "This Pokemon's Flying-type moves have their priority increased by 1.": "飞行属性招式优先度+1",

    //  战报

    "won the battle!": "获得了胜利！",
    "The sunlight turned extremely harsh!": "日照变得非常强了！",
    "The sunlight turned harsh!": "日照变强了！",
    "The sunlight faded.": "日照复原了。",
    "The harsh sunlight faded.": "日照复原了。",
    "The extremely harsh sunlight faded.": "日照复原了。",
    "It started to rain!": "开始下雨了！",
    "The rain stopped.": "雨停了。",
    "A heavy rain began to fall!": "开始下起了暴雨！",
    "The heavy rain has lifted!": "大雨停了！",
    "A sandstorm kicked up!": "开始刮沙暴了！",
    "The sandstorm is raging.": "沙暴正在肆虐。",
    "The sandstorm subsided.": "沙暴停止了。",
    "It started to hail!": "开始下冰雹了！",
    "The hail is crashing down.": "冰雹正在砸落。",
    "The hail stopped.": "冰雹停了。",
    "It started to snow!": "开始下雪了！",
    "The snow stopped.": "雪停了。",
    "Breakneck Blitz turned into Hydro Vortex due to the weather!": "由于天气原因，气象球变成了超级水流大漩涡！ ",
    "Breakneck Blitz turned into Subzero Slammer due to the weather!": "由于天气原因，气象球变成了激狂大地万里冰！",
    "Breakneck Blitz turned into Inferno Overdrive due to the weather!": "由于天气原因，气象球变成了超强极限爆焰弹！",
    "Breakneck Blitz turned into Continental Crush due to the weather!": "由于天气原因，气象球变成了毁天灭地巨岩坠！",
    "(The sunlight is strong.)": "(阳光很强烈。)",
    "(The sunlight is strong!)": "(阳光很强烈！)",
    "(Rain continues to fall.)": "(雨还在下。)",
    "(Rain continues to fall!)": "(雨还在下！)",
    "(The sandstorm is raging.)": "(沙暴正在肆虐。)",
    "(The hail is crashing down.)": "(冰雹正在砸落。)",
    "(The snow is falling down.)": "(雪还在下。)",
    "Mysterious strong winds are protecting Flying-type Pokemon!": "神秘的乱流保护着飞行属性的宝可梦！",
    "The mysterious strong winds have dissipated!": "神秘的乱流停止了！",
    "Automatic center!": "自动居中！",
    "It hurt itself in its confusion!": "不知所以地攻击了自己！",
    "The battlers shared their pain!": "双方分担了痛楚！",
    "All stat changes were eliminated!": "所有能力都复原了！",
    "A critical hit!": "击中了要害！",
    "It had no effect!": "这没有效果！",
    "But it does not have enough HP left to make a substitute!": "但是，体力已经不够放出替身了！",
    "But it failed!": "但是，没有起到效果！！",
    "The extremely harsh sunlight was not lessened at all!": "强烈的阳光丝毫没有被削弱！",
    "There is no relief from this heavy rain!": "暴雨的势头不减！",
    "The mysterious strong winds blow on regardless!": "神秘的乱流仍然持续着！",
    "The Water-type attack evaporated in the harsh sunlight!": "受强日照的影响，水属性的攻击被蒸发了！",
    "The Fire-type attack fizzled out in the heavy rain!": "受强降雨的影响，火属性的攻击被扑灭了！",
    "But there was no target……": "然而攻击没有目标……",
    "It's a one-hit KO!": "一击必杀！",
    "But nothing happened!": "但是，什么也没有发生！！",
    "The two moves have become one! It's a combined move!": "两个招式合二为一！这是合体招式！！",
    "The effects of the weather disappeared.": "天气的影响消失了。",
    "Your team is too nervous to eat Berries!": "我方因太紧张而无法食用树果！",
    "The opposing team is too nervous to eat Berries!": "对手因太紧张而无法食用树果！",
    "Zen Mode triggered!": "达摩模式，启动！",
    "Zen Mode ended!": "达摩模式，结束！",
    "Changed to Blade Forme!": "刀剑形态，变形！",
    "Changed to Shield Forme!": "盾牌形态，变形！",
    "Shields Down deactivated!": "界限盾壳，启动！",
    "Shields Down activated!": "界限盾壳，解除！",
    "Electricity's power was weakened!": "电属性招式的威力被减弱了！",
    "Fire's power was weakened!": "火属性招式的威力被减弱了！",
    "Everyone is caught up in the happy atmosphere!": "大家都沉浸在欢乐的气氛中！",
    "When the flame touched the powder on the Pokemon, it exploded!": "当火焰接触到宝可梦身上的粉尘时发生了爆炸！",
    "No one will be able to run away during the next turn!": "下回合结束前双方均无法逃走！",
    "Its disguise served it as a decoy!": "画皮抵挡了攻击！",
    "You sense the presence of many!": "您感受到了一股强大的力量！",
    "The mysterious strong winds weakened the attack!": "神秘的乱流减弱了攻击！",
    "Aurora Veil made your team stronger against physical and special moves!": "极光幕使我方的物理和特殊抗性提高了！",
    "Aurora Veil made the opposing team stronger against physical and special moves!": "极光幕使对手的物理和特殊抗性提高了！",
    "Reflect made your team stronger against physical moves!": "反射壁使我方的物理抗性提高了！",
    "Reflect made the opposing team stronger against physical moves!": "反射壁使得对手的物理抗性提高了！",
    "Light Screen made your team stronger against special moves!": "光墙使我方的特殊抗性提高了！",
    "Light Screen made the opposing team stronger against special moves!": "光墙使得对手的特殊抗性提高了！",
    "The opposing team's Tailwind petered out!": "对手的顺风停止了！",
    "Your team's Tailwind petered out!": "我方的顺风停止了！",
    "The opposing team's Aurora Veil wore off!": "对手的极光幕消失了！",
    "Your team's Aurora Veil wore off!": "我方的极光幕消失了！",
    "The opposing team's Reflect wore off!": "对手的反射壁消失了！",
    "Your team's Reflect wore off!": "我方的反射壁消失了！",
    "The opposing team's Light Screen wore off!": "对手的光墙消失了！",
    "Your team's Light Screen wore off!": "我方的光墙消失了！",
    "The opposing team cloaked itself in a mystical veil!": "对手被神秘之幕包围了！",
    "Your team cloaked itself in a mystical veil!": "我方被神秘之幕包围了！",
    "The opposing team is no longer protected by Safeguard!": "对手不再受神秘守护的保护！",
    "Your team is no longer protected by Safeguard!": "我方不再受神秘守护的保护！",
    "The opposing team became shrouded in mist!": "对手被白雾包围了！",
    "Your team became shrouded in mist!": "我方被白雾包围了！",
    "The opposing team is no longer protected by mist!": "对手不再受白雾的保护！",
    "Your team is no longer protected by mist!": "我方不再受白雾的保护！",
    "The opposing team's Lucky Chant wore off!": "对方的幸运咒语结束了！",
    "Your team's Lucky Chant wore off!": "我方的幸运咒语结束了！",
    "Lucky Chant shielded the opposing team from critical hits!": "幸运咒语隐藏起了对手的要害！",
    "Lucky Chant shielded your team from critical hits!": "幸运咒语隐藏起了我方的要害！",
    "A sea of fire enveloped the opposing team!": "对手周围被火海包围了！",
    "A sea of fire enveloped your team!": "我方周围被火海包围了！",
    "A rainbow appeared in the sky on the opposing team's side!": "彩虹出现在了对手上空！",
    "A rainbow appeared in the sky on your team's side!": "彩虹出现在了我方上空！",
    "A swamp enveloped the opposing team!": "对手周围被沼泽包围了！",
    "A swamp enveloped your team!": "我方周围被沼泽包围了！",
    "It created a bizarre area in which Defense and Sp. Def stats are swapped!": "凭空制造出了互换防御与特防的空间！",
    "It created a bizarre area in which Pokemon's held items lose their effects!": "凭空制造出了令道具无效的空间！",
    "Grass grew to cover the battlefield!": "脚下青草如茵！",
    "Mist swirls around the battlefield!": "脚下雾气缭绕！",
    "An electric current runs across the battlefield!": "脚下电光飞闪！",
    "The battlefield got weird!": "脚下传来了奇妙的感觉！",
    "The twisted dimensions returned to normal!": "扭曲的时空复原了！",
    "Wonder Room wore off, and Defense and Sp. Def stats returned to normal!": "奇妙空间被解除，防御与特防的能力值复原了！",
    "Magic Room wore off, and held items' effects returned to normal!": "魔法空间被解除，道具效果恢复了正常！",
    "Gravity intensified!": "重力变强了！",
    "Gravity returned to normal!": "重力复原了！",
    "The effects of Mud Sport have faded.": "玩泥巴的效果消失了。",
    "The effects of Water Sport have faded.": "玩水的效果消失了。",
    "The grass disappeared from the battlefield.": "脚下的青草不见了。",
    "The mist disappeared from the battlefield.": "脚下的雾气不见了。",
    "The electricity disappeared from the battlefield.": "脚下的电流消失了。",
    "The weirdness disappeared from the battlefield!": "脚下的奇妙感觉不见了！",
    "Coins were scattered everywhere!": "金币撒的到处都是！",
    "A deluge of ions showers the battlefield!": "等离子雨倾盆而下！",
    "Pointed stones float in the air around the opposing team!": "对手周围开始浮现出尖锐的岩石！",
    "Pointed stones float in the air around your team!": "我方周围开始浮现出尖锐的岩石！",
    "Spikes were scattered on the ground all around the opposing team!": "对手脚下散落着撒菱！",
    "Spikes were scattered on the ground all around your team!": "脚下散落着撒菱！",
    "Poison spikes were scattered on the ground all around the opposing team!": "对手脚下散落着毒菱！",
    "Poison spikes were scattered on the ground all around your team!": "脚下散落着毒菱！",
    "A sticky web has been laid out on the ground around the opposing team!": "对手的脚下延伸出了黏黏网！",
    "A sticky web has been laid out on the ground around your team!": "脚下延伸出了黏黏网！",
    "The Tailwind blew from behind the opposing team!": "从对手的身后吹起了顺风！",
    "The Tailwind blew from behind your team!": "从您的身后吹起了顺风！",
    "The pointed stones disappeared from around the opposing team!": "对手周围的隐形岩消失不见了！",
    "The pointed stones disappeared from around your team!": "我方周围的隐形岩消失不见了！",
    "The spikes disappeared from the ground around the opposing team!": "对手周围的撒菱消失不见了！",
    "The spikes disappeared from the ground around your team!": "我方周围的撒菱消失不见了！",
    "The poison spikes disappeared from the ground around the opposing team!": "对手周围的毒菱消失不见了！",
    "The poison spikes disappeared from the ground around your team!": "我方周围的毒菱消失不见了！",
    "The sticky web has disappeared from the ground around the opposing team!": "对手周围的黏黏网消失不见了！",
    "The sticky web has disappeared from the ground around your team!": "我方周围的黏黏网消失不见了！",
    "Waiting for opponent...": "等待对手行动...",
    "All Pokemon that heard the song will faint in three turns!": "所有听到歌声的宝可梦将在3回合后倒下！",
    "The effects of the neutralizing gas wore off!": "化学变化气体的效果消失了！",
    "An electric current ran across the battlefield!": "脚下电光飞闪！",
    "But there was no target...": "但没有目标...",
    "It created a bizarre area in which Pokemon's held items lose their effects!": "制造出了使所有宝可梦道具效果消失的魔法空间！",
    "Mist swirled around the battlefield!": "脚下雾气缭绕！",
    "The Pokemon was hit 1 time!": "击中一次！",
    "The move was blocked by the power of Dynamax!": "因为极巨化的力量，这个行为没有效果！",
    "When the flame touched the powder on the Pokemon, it exploded!": "火焰接触到宝可梦身上的粉尘，引发了爆炸！",
    "Battle timer is now OFF.": "战斗计时器已关闭。",
    "Register an account to protect your ladder rating!": "注册账号以保护您的分数！",
    "Ladder updating...": "天梯更新中...",
    "This room is already hidden.": "房间已经隐藏了。",
    "This room is already public.": "房间已经公开了。",
    "The replay for this battle is already set to hidden.": "这场战斗的回放已经隐藏了。",
    "This battle is invite-only!": "这个战斗房间上锁了！",
    "This room is now invite only!": "这个房间现在上锁了！",
    "This room is no longer invite only!": "这个房间现在解锁了！",
    "This room is expired": "这个房间过期了",
    "It's teatime! Everyone dug in to their Berries!": "大家开茶会！吃了树果！",
    "Neutralizing gas filled the area!": "周围充满了化学变化气体！",
    "Your username is no longer available.": "您的选择的用户名不可使用。",
    "This server is requesting an invalid login key. This probably means that either you are notconnected to a server, or the server is set upincorrectly.": "服务器正在请求无效的登录密钥。这可能意味着您没有连接到服务器，或是服务器的设置不正确。",
    "Sleep Clause Mod activated.": "催眠条款已生效。",
    "[Unavailable choice] Can't switch: The active Pokemon is trapped": "[无效的选择]无法切换：在场的宝可梦被困住了",
    "[Invalid choice] Can't undo: A trapping/disabling effect would cause undo to leak information": "[无效的选择]无法取消：技能被禁用/束缚类技能会导致信息泄露",
    "[Invalid choice] There's nothing to cancel": "[无效的选择]没有可以取消的内容",
    "[Invalid choice] There's nothing to choose": "[无效的选择]没有可以选择的选项",
    "[Invalid choice] Sorry, too late to make a different move; the next turn has already started": "[无效的选择]抱歉，无法做出其他行动；下个回合已经开始了",
    "[Invalid choice] Sorry, too late to cancel; the next turn has already started": "[无效的选择]抱歉，无法取消；下个回合已经开始了",
    "[Invalid choice] Can't do anything: The game is over": "[无效的选择]无法做出任何行动: 游戏结束了",
    "[Invalid choice] Can't move: You can only mega-evolve once per battle": "[无效的选择]无法使用：每次战斗只能进行一次超级进化。",
    "[Invalid choice] Can't move: You can only Terastallize once per battle.": "[无效的选择]无法使用：每次战斗只能进行一次太晶化。",
    "Go!": "去吧！",
    "It's super effective!": "效果绝佳！",
    "It's not very effective...": "好像效果不好......",
    "But there was no PP left for the move!": "但招式已经没有PP了！",
    "The timer can't be enabled after a battle has ended.": "战斗结束后无法开启计时器。",
    "was dragged out!": "被拖进了战斗！",
    "The sea of fire around the opposing team disappeared!": "对手周围的火海消失了！",
    "The sea of fire around your team disappeared!": "我方周围的火海消失了！",
    "The rainbow on the opposing team's side disappeared!": "对手上空的彩虹消失了！",
    "The rainbow on your team's side disappeared!": "我方上空的彩虹消失了！",
    "The swamp around the opposing team disappeared!": "对手周围的沼泽消失了！",
    "The swamp around your team disappeared!": "我方周围的沼泽消失了！",
    "Quick Guard protected the opposing team!": "对手周围正受到快速防守的保护！",
    "Quick Guard protected your team!": "我方周围正受到快速防守的保护！",
    "Wide Guard protected the opposing team!": "对手周围正受到广域防守的保护！",
    "Wide Guard protected your team!": "我方周围正受到广域防守的保护！",
    "Crafty Shield protected the opposing team!": "对手周围正受到戏法防守的保护！",
    "Crafty Shield protected your team!": "我方周围正受到戏法防守的保护！",
    "Accept Open Team Sheets": "同意公开队伍配置",
    "Deny Open Team Sheets": "拒绝公开队伍配置",
    "You have already made your decision about agreeing to open team sheets.": "您已经决定了是否公开队伍配置。",
    "Both Pokemon will faint in three turns!": "双方都会在3回合后变为濒死状态！",
    "Tidying up complete!": "大扫除完毕！",
    "Sharp-pointed pieces of steel started floating around the opposing Pokemon!": "对手周围开始悬浮起尖锐的钢刺！",
    "Sharp-pointed pieces of steel started floating around your ally Pokemon!": "我方周围开始悬浮起尖锐的钢刺！",
    "The pieces of steel surrounding the opposing Pokemon disappeared!": "对手周围的钢刺消失不见了！",
    "The pieces of steel surrounding your ally Pokemon disappeared!": "我方周围的钢刺消失不见了！",
    "The opposing Pokemon were surrounded by fire!": "对手的宝可梦被困在火焰之中！",
    "Your ally Pokemon were surrounded by fire!": "我方的宝可梦被困在火焰之中！",
    "The opposing Pokemon got trapped with vines!": "对手的宝可梦被困在鞭子的猛击中！",
    "Your ally Pokemon got trapped with vines!": "我方的宝可梦被困在鞭子的猛击中！",
    "The opposing Pokemon got caught in the vortex of water!": "对手的宝可梦被困在水流之中！",
    "Your ally Pokemon got caught in the vortex of water!": "我方的宝可梦被困在水流之中！",
    "The opposing Pokemon became surrounded by rocks!": "对手的宝可梦被困在岩石之中！",
    "Your ally Pokemon became surrounded by rocks!": "我方的宝可梦被困在岩石之中！",
    "(G-Max Wildfire ended on the opposing team!)": "(对手周围的超极巨地狱灭焰消失了！)",
    "(G-Max Wildfire ended on your team!)": "(我方周围的超极巨地狱灭焰消失了！)",
    "(G-Max Vine Lash ended on the opposing team!)": "(对手周围的超极巨灰飞鞭灭消失了！)",
    "(G-Max Vine Lash ended on your team!)": "(我方周围的超极巨灰飞鞭灭消失了！)",
    "(G-Max Cannonade ended on the opposing team!)": "(对手周围的超极巨水炮轰灭消失了！)",
    "(G-Max Cannonade ended on your team!)": "(我方周围的超极巨水炮轰灭消失了！)",
    "(G-Max Volcalith ended on the opposing team!)": "(对手周围的超极巨炎石喷发消失了！)",
    "(G-Max Volcalith ended on your team!)": "(我方周围的超极巨炎石喷发消失了！)",
    "(G-Max Centiferno activated!)": "(超极巨百火焚野已生效！)",
    "(G-Max Sandblast activated!)": "(超极巨沙尘漫天已生效！)",
    "(Dynamax ended.)": "(极巨化结束了。)",
    "(Max Guard activated!)": "(极巨防壁守住了攻击！)",
    "(Sleep Clause Mod prevents players from putting more than one of their opponent's Pokemon to sleep at a time)": "(催眠条款禁止玩家催眠对手的多个宝可梦)",
    "(Illusion Level Mod is active, so this Pokemon's true level was hidden.)": "(幻觉等级条款已生效，所以它的真实等级被掩盖了。)",
    "(Normal-type moves become Electric-type after using Plasma Fists.)": "(使用等离子闪电拳后，一般属性招式变为电属性。)",
    "(Normal-type moves become Electric-type after using Ion Deluge.)": "(使用等离子浴后，一般属性招式变为电属性。)",
    "(Rising Voltage's BP doubled on grounded target.)": "(电力上升的伤害翻倍了。)",
    "(If a Terastallized Pokemon uses Roost, it remains Flying-type.)": "(太晶化飞行属性的宝可梦使用羽栖后，宝可梦的飞行属性不会失去。)",
    "(In Gen 1, moves with 100% accuracy can still miss 1/256 of the time.)": "(在第一世代，100%命中率的招式仍然有1/256概率被闪避。)",
    "(Since gen 7, Dark is immune to Prankster moves.)": "(从第七世代起，恶作剧之心招式对恶属性宝可梦无效。)",
    "(Fake Out only works on your first turn out.)": "(击掌奇袭在出场后立刻使出才能成功。)",
    "(First Impression only works on your first turn out.)": "(迎头一击在出场后立刻使出才能成功。)",
    "(Mat Block only works on your first turn out.)": "(掀榻榻米在出场后立刻使出才能成功。)",
    "(Future Sight did not hit because the target is fainted.)": "(预知未来没有命中，因为目标已昏厥。)",
    "(Doom Desire did not hit because the target is fainted.)": "(破灭之愿没有命中，因为目标已昏厥。)",
    "(Psychic Terrain doesn't affect Pokemon immune to Ground.)": "(精神场地不会影响不在地面上的宝可梦。)",
    "(Grassy Terrain doesn't affect Pokemon immune to Ground.)": "(青草场地不会影响不在地面上的宝可梦。)",
    "(Electric Terrain Terrain doesn't affect Pokemon immune to Ground.)": "(电气场地不会影响不在地面上的宝可梦。)",
    "(Misty Terrain doesn't affect Pokemon immune to Ground.)": "(薄雾场地不会影响不在地面上的宝可梦。)",
    "(A Pokemon can't switch between when it runs out of HP and when it faints)": "(当宝可梦失去所有HP倒下时，无法替换)",
    "(Some effects can force a Pokemon to use Blood Moon again in a row.)": "(某些效果可以使宝可梦连续使用血月。)",
    "(Some effects can force a Pokemon to use Gigaton Hammer again in a row.)": "(某些效果可以使宝可梦连续使用巨力锤。)",
    "(Only a Pokemon whose form is Morpeko or Morpeko-Hangry can use this move.)": "(只有莫鲁贝可和莫鲁贝可-空腹花纹才能使出这个招式。)",
    "(Only a Pokemon whose form is Hoopa Unbound can use this move.)": "(只有解放胡帕才能使出这个招式。)",
    "(Only a Pokemon whose form is Darkrai can use this move.)": "(只有达克莱伊才能使出这个招式。)",
    "(In Gens 3-4, Knock Off only makes the target's item unusable; it cannot obtain a new item.)": "(在第三和第四世代，拍落只会使目标的道具无效；处于拍落的宝可梦无法获得新的道具。)",
    "(In Gen 1, the user of Explosion will not take damage if it breaks a Substitute.)": "(在第一世代，如果大爆炸打破了替身，使用者不会受到伤害。)",
    "(Previously chosen switches continue in Gen 2-4 after a Pursuit target faints.)": "(在第二至第四世代，即使追打令目标陷入濒死也可以替换宝可梦。)",
    "Forfeiting makes you lose the battle. Are you sure?": "这样做会使您输掉战斗。 您确定吗？",
    "Forfeiting makes you lose the game. Are you sure?": "这样做会让您输掉游戏。 您确定吗？",
    "Battle timer is ON: inactive players will automatically lose when time's up.": "战斗计时器已经开启：玩家若不行动则在时间耗尽后自动输掉比赛。",
    "Replacement player's username": "替换上场的玩家的用户名",
    "All players are inactive.": "所有玩家都处于不活动状态。",
    "This room is expired": "此房间已过期",
    "Close after forfeiting": "投降后关闭",
    "Replace player": "替换玩家",
    "Rated battle": "计分对战",
    "Tournament battle": "锦标赛战斗",
    "suspect thread": "Suspect原帖",

    // 战斗选项

    "Battle Options": "战斗选项",
    "In this battle": "在这场战斗中",
    "Ignore Spectators": "忽略来自观战者的消息",
    "Ignore Opponent": "忽略来自对手的消息",
    "All battles": "所有战斗中",
    "Ignore nicknames": "忽略宝可梦昵称",
    "Open new battles on the right side": "在右侧开启新战斗窗口",
    "Close": "关闭",
    "Hardcore mode (hide info not shown in-game)": "硬核模式 (隐藏实机无法看到的信息)",
    "Waiting for players...": "等待玩家行动...",
    "Spectators ignored.": "观战者消息已经被忽略。",
    "Spectators no longer ignored.": "观战者的消息已经不再忽略。",
    "Opponent ignored.": "对手的消息已经被忽略。",
    "Opponent no longer ignored.": "对手的消息已经不再忽略。",
    "Hardcore mode ON: Information not available in-game is now hidden.": "硬核模式已开启，实机无法看到的信息已经被隐藏。",
    "Hardcore mode OFF: Information not available in-game is now shown.": "硬核模式已关闭，实机无法看到的信息将会显示。",
    "Nicknames ignored.": "昵称已经被忽略。",
    "Nicknames no longer ignored.": "昵称不再被忽略。",
    "You must choose a username before you challenge someone.": "在挑战某人之前，您必须输入用户名。",
    "Your replay has been uploaded! It's available at:": "您的回放已上传！可从以下网址获取：",
    "Ignore spectators": "忽略观众",
    "Ignore opponent": "忽略对手",
    "Automatically start timer": "自动启动计时器",
    "A soothing aroma wafted through the area!": "怡人的香气扩散了开来！",
    "A bell chimed!": "铃声响彻四周！",
    "No matched formats found.": "没有找到该分级。",
    "This battle needs more players to start": "需要更多的玩家才能开始这场战斗",
    "Add Player": "添加玩家",
    "User not found.": "没有找到该用户",
    "Calls": "调用了",
    "Accept tie": "同意平局",
    "You have already agreed to a tie.": "您已经发送了平局请求。",
    "It's too early to tie, please play until turn 100.": "现在平局为时过早，请先打到100回合。",
    "(Special Shell Side Arm)": "(特殊类型臂贝武器)",
    "(Physical Shell Side Arm)": "(物理类型臂贝武器)",
    "Curious what those medals under the avatar are? PS now has Ladder Seasons! For more information, check out the": "好奇头像下方的奖牌是什么吗？现在是PS的天梯赛季！更多有关信息，请查看",
    "thread on Smogon.": "Smogon原帖。",
    "This battle is required to be public due to one or more player having a season medal.": "由于有至少一名玩家获得赛季奖牌，这场比赛必须公开。",
    "During the public phase, you can discuss the state of the ladder": "在公开时期，您可以在 ",
    "in a special chatroom.": "special chatroom 讨论天梯的情况。",



    "/ Def": " / 防御 ",
    "/ SpA": " / 特攻 ",
    "/ SpD": " / 特防 ",
    "/ Spc": " / 特殊 ",
    "/ Spe": " / 速度 ",

    "(More than 4 moves is usually a sign of Illusion Zoroark/Zorua.) (Your opponent has two indistinguishable Pokemon, making it impossible for you to tell which one has which moves/ability/item.)": "(超过4个招式通常是索罗亚克/索罗亚的幻觉的征兆。) (您的对手有两个无法区分的宝可梦，您无法分辨哪一个有哪一个的招式/特性/道具。)",
    "(More than 4 moves is usually a sign of Illusion Zoroark/Zorua.)": "(超过4个招式通常是索罗亚克/索罗亚的幻觉的征兆。)",
    "(Your opponent has two indistinguishable Pokemon, making it impossible for you to tell which one has which moves/ability/item.)": "(您的对手有两个无法区分的宝可梦，让您无法分辨哪一个拥有哪一个的招式/特性/道具。)",
    "(Pressure is not visible in Gen 3, so in certain situations, more PP may have been lost than shown here.)": "(压迫感在第三世代中不可见，因此有时失去的PP可能比此处显示的更多。）",
    "Accuracy: can't miss (No Guard)": "命中: 一定会命中 (无防守)",
    "Accuracy: can't miss (Poison type)": "命中: 一定会命中 (毒属性)",
    "Accuracy: 50% (Sunny Day)": "命中: 50% (大晴天)",
    "Accuracy: 50% (Desolate Land)": "命中: 50% (大日照)",
    "Accuracy: can't miss (Hail)": "命中: 一定会命中 (冰雹)",
    "Accuracy: can't miss (Snow)": "命中: 一定会命中 (下雪)",
    "Accuracy: can't miss (Rain Dance)": "命中: 一定会命中 (下雨)",
    "Accuracy: can't miss (Primordial Sea)": "命中: 一定会命中 (大雨)",
    "Accuracy: can't miss": "命中: 一定会命中",
    "Accuracy": "命中率",

    "PSN": "中毒",
    "SLP": "睡眠",
    "PAR": "麻痹",
    "BRN": "灼伤",
    "FRZ": "冰冻",
    "TOX": "中剧毒",

    "(After stat modifiers:)": "(能力变化之后：)",
    "(no weather)": "(没有天气变化)",
    "(no conditions)": "(没有场地状态)",
    "Ability:": "特性：",
    "Item:": "道具：",
    "(suppressed)": " (无效了)",
    "(fainted)": " (昏厥)",
    "Possible abilities:": "可能的特性：",
    "How will you start the battle?": "您将如何战斗？",
    "What about the rest of your team?": "您队伍的其他成员？",
    "Choose a Pokemon for slot 2": "选择2号宝可梦",
    "Choose a Pokemon for slot 3": "选择3号宝可梦",
    "Choose a Pokemon for slot 4": "选择4号宝可梦",
    "Choose a Pokemon for slot 5": "选择5号宝可梦",
    "Choose a Pokemon for slot 6": "选择6号宝可梦",
    "What will": " ",
    "do?": "该怎么办? ",
    "to:": ":",
    "Strong Winds": "乱流",
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

    "Foe's Reflect": "对手的反射壁",
    "Foe's Light Screen": "对手的光墙",
    "Foe's Aurora Veil": "对手的极光幕",
    "Foe's Tailwind": "对手的顺风",
    "Foe's Lucky Chant": "对手的幸运咒语",
    "Foe's Safeguard": "对手的神秘守护",
    "Foe's Mist": "对手的白雾",
    "Foe's G-Max Wildfire": "对手的超极巨地狱灭焰",
    "Foe's G-Max Cannonade": "对手的超极巨水炮轰灭",
    "Foe's G-Max Vine Lash": "对手的超极巨灰飞鞭灭",
    "Foe's G-Max Volcalith": "对手的超极巨炎石喷发",
    "Foe's Sea of Fire": "对手的火海",
    "Foe's Swamp": "对手的湿地",
    "Foe's Rainbow": "对手的彩虹",
    "Sea of Fire": "火海",
    "Swamp": "湿地",
    "Rainbow": "彩虹",

    "(Type changed)": "(属性改变了)",
    "(Tera Type:": "(太晶属性: ",
    "(base:": "(原本的属性: ",
    "Choose Lead": "选择首发",
    "(exists)": "(存在)",
    "Base power:": "威力：",
    "Back": "返回",
    "At who?": " 对谁使用？",
    "You are trapped and cannot switch!": "您被困住了，无法切换！",
    "(Terastallized)": "(太晶化)",
    "Choose a fainted Pokemon to revive!": "复活一只濒死的宝可梦！",
    "Revive": "复活",
    "Cursed": "诅咒",
    "Transformed": "变身",
    "Syrupy": "满身糖",
    "Start timer": "开始计时",
    "Stop timer": "停止计时",
    "Timer": "计时器",
    "closes this battle": "关闭这场战斗",
    "Dynamax": "极巨化",
    "Dynamaxed": "极巨化",
    "Terastallize": "太晶化",
    "Main menu": "返回主页",
    "Rematch": "挑战对手",
    "(before items/abilities/modifiers)": " (计算道具/特性/能力阶级之前)",

    "Choose a Pokemon to send to battle!": "派出一个宝可梦加入战斗！",
    "Which Pokemon will it switch in for?": "它将替换哪个宝可梦？",
    "You": "您",
    "might": "可能有",
    "be trapped, so you won't be able to cancel a switch!": "某些行为被阻止了，因此无法取消攻击！",
    "Open Calcdex": "打开计算器",
    "Close Calcdex": "关闭计算器",

    "Burn": "灼伤",
    "Facade + status": "异常状态",
    "Terrain boost": "场地",
    "Acrobatics + no item": "没有道具",
    "Terrain Pulse boost": "大地波动",
    "Expanding Force + Psychic Terrain boost": "精神场地",
    "Rising Voltage + Electric Terrain boost": "电气场地",
    "Misty Explosion + Misty Terrain boost": "薄雾场地",
    "Misty Terrain + grounded target": "薄雾场地且目标处于地面上",
    "Grassy Terrain + grounded target": "青草场地且目标处于地面上",
    "Fairy Aura + Aura Break": "妖精气场+气场破坏",
    "Dark Aura + Aura Break": "暗黑气场+气场破坏",
    "Brine + target below half HP": "目标体力低于一半",

    "Super-effective": "效果绝佳",
    "Resisted": "效果不好",
    "Immune": "没有效果",
    "Critical hit": "击中要害",
    "Missed": "闪避了",
    "Flinched": "畏缩了",
    "Paralyzed": "麻痹了",
    "Burned": "灼伤了",
    "Toxic poison": "中剧毒了",
    "Poisoned": "中毒了",
    "Asleep": "睡着了",
    "Frozen": "冻住了",
    "Thawed": "解冻了",
    "Confused": "混乱",
    "Poison cured": "治愈了中毒",
    "Freeze cured": "治愈了冰冻",
    "Burn cured": "治愈了灼伤",
    "Paralyz cured": "治愈了麻痹",
    "Paralysis cured": "治愈了麻痹",
    "Team Cured": "治愈了队伍",
    "Protected": "守住",
    "Stats reset": "能力修正消除",
    "Stats swapped": "交换了能力",
    "Failed": "失败了",
    "Trap set": "陷阱甲壳",
    "Encoreed": "再来一次",
    "Disabled": "定身法",
    "Ingrained": "扎根",
    "Cursed": "诅咒",
    "Drowsy": "瞌睡",
    "Balloon": "气球",
    "Sash": "气势披带",
    "Band": "气势头带",
    "Lightened": "身轻如燕",
    "Stockpile×2": "蓄力×2",
    "Stockpile×3": "蓄力×3",
    "Infatuation": "着迷",
    "Attracted": "迷人",
    "Tormented": "无理取闹",
    "Transformed": "变身",
    "Smacked Down": "击落",
    "Focusing": "聚精会神",
    "Lost focus": "失去了聚气",
    "Encored": "再来一次",
    "Enduring": "挺住",
    "Faded": "消失了",
    "Woke up": "醒过来了",
    "Landed": "降落了",
    "Taunted": "被挑衅了",
    "Damage": "承受了攻击",
    "Immobilized": "不能行动",
    "Balloon popped": "气球破了",
    "Boosts lost": "失去了能力变化",
    "Protection broken": "突破了守住",
    "+Crit rate": "击中要害率提升",
    "Item Stolen": "物品被盗取了",
    "Stats inverted": "能力颠倒",
    "Restored": "复原了",
    "Slow Start ended": "慢启动结束了",
    "Imprisoning": "正在封印",


    //  战斗技能描述

    "The user thaws out if it is frozen.": "成功使出该招式可以解除冰冻。",
    "Nearly always moves last": "几乎总是后手行动 ",
    "Nearly always moves first": "几乎总是先手行动 ",
    "Usually moves first": "通常会先手行动 ",
    "Bypasses Substitute": "无视替身 ",
    "(but does not break it)": "(但不会破坏它)",
    "Not blocked by Protect": "不会被守住",
    "(and Detect, King's Shield, Spiky Shield)": "(看穿，王者盾牌，尖刺防守等)所阻挡",
    "✓ Sound": "✓ 声音类招式 ",
    "(doesn't affect Soundproof pokemon)": "(不会影响隔音宝可梦)",
    "✓ Wind": "✓ 风的招式 ",
    "(activates Wind Power and Wind Rider)": "(会激活风力发电和乘风)",
    "✓ Bullet-like": "✓ 球和弹类招式 ",
    "(doesn't affect Bulletproof pokemon)": "(不会影响防弹宝可梦)",
    "✓ Contact": "✓ 接触类招式 ",
    "(triggers Iron Barbs, Spiky Shield, etc)": "(会触发铁刺, 尖刺防守等效果)",
    "✓ Not bounceable": "✓ 不能反弹 ",
    "(can't be bounced by Magic Coat/Bounce)": "(魔法反射和魔法镜无法反弹)",
    "✓ Slicing": "✓ 切割类招式 ",
    "(boosted by Sharpness)": "(锋锐会提高招式威力)",
    "✓ Fist": "✓ 拳类招式 ",
    "(boosted by Iron Fist)": "(铁拳会提高招式威力)",
    "✓ Powder": "✓ 粉末类招式 ",
    "(doesn't affect Grass, Overcoat, Safety Goggles)": "(不会影响防尘，防尘护目镜，草属性宝可梦)",
    "✓ Bite": "✓ 啃咬类招式 ",
    "(boosted by Strong Jaw)": "(强壮之颚会提高招式威力)",
    "✓ Recoil": "✓ 具有反作用力伤害的招式 ",
    "(boosted by Reckless)": "(舍身会提高招式威力)",
    "✓ Pulse": "✓ 波动和波导类招式 ",
    "(boosted by Mega Launcher)": "(超级发射器会提高招式威力)",
    "◎ Hits both foes and ally.": "◎ 同时攻击对手和同伴。",
    "◎ Hits both foes.": "◎ 同时攻击两个对手。",
    "Raises the user's Attack by 1 stage.": "令使用者的攻击提升1级。",
    "Raises the user's Defense by 1 stage.": "令使用者的防御提升1级。",
    "Raises the user's Special Attack by 1 stage.": "令使用者的特攻提升1级。",
    "Raises the user's Special Defense by 1 stage.": "令使用者的特防提升1级。",
    "Raises the user's Speed by 1 stage.": "令使用者的速度提升1级。",
    "Raises the user's evasiveness by 1 stage.": "令使用者的闪避率提升1级。",
    "Raises the user's Attack by 2 stages.": "令使用者的攻击提升2级。",
    "Raises the user's Defense by 2 stages.": "令使用者的防御提升2级。",
    "Raises the user's Special Attack by 2 stages.": "令使用者的特攻提升2级。",
    "Raises the user's Special Defense by 2 stages.": "令使用者的特防提升2级。",
    "Raises the user's Speed by 2 stages.": "令使用者的速度提升2级。",
    "Raises the user's evasiveness by 2 stages.": "令使用者的闪避率提升2级。",
    "Raises the user's Attack by 3 stages.": "令使用者的攻击提升3级。",
    "Raises the user's Defense by 3 stages.": "令使用者的防御提升3级。",
    "Raises the user's Special Attack by 3 stages.": "令使用者的特攻提升3级。",
    "Raises the user's Special Defense by 3 stages.": "令使用者的特防提升3级。",
    "Raises the user's Speed by 3 stages.": "令使用者的速度提升3级。",
    "Raises the user's evasiveness by 3 stages.": "令使用者的闪避率提升3级。",
    "Raises the user's Attack and Defense by 1 stage.": "令使用者的攻击和防御提升1级。",
    "Raises the user's Attack and accuracy by 1 stage.": "令使用者的攻击和命中提升1级。",
    "Raises the user's Attack and Speed by 1 stage.": "令使用者的攻击和速度提升1级。",
    "Raises the user's Defense and Special Defense by 1 stage.": "令使用者的防御和特防提升1级。",
    "Raises the user's Special Attack and Special Defense by 1 stage.": "令使用者的特攻和特防提升1级。",
    "Raises the user's Attack, Defense, and Speed by 1 stage.": "令使用者的攻击、防御和速度提升1级。",
    "Raises the user's Special Attack, Special Defense, and Speed by 1 stage.": "令使用者的特攻、特防和速度提升1级。",
    "Raises the user's Attack, Defense, and accuracy by 1 stage.": "令使用者的攻击、防御和命中提升1级。",
    "Raises the user's Speed by 2 stages and its Attack by 1 stage.": "令使用者的速度提升2级，攻击提升1级。",
    "Has a 10% chance to raise the user's Attack by 1 stage.": "有10%几率令使用者的攻击提升1级。",
    "Has a 10% chance to raise the user's Defense by 1 stage.": "有10%几率令使用者的防御提升1级。",
    "Has a 10% chance to raise the user's Special Attack by 1 stage.": "有10%几率令使用者的特攻提升1级。",
    "Has a 10% chance to raise the user's Special Defense by 1 stage.": "有10%几率令使用者的特防提升1级。",
    "Has a 10% chance to raise the user's Speed by 1 stage.": "有10%几率令使用者的速度提升1级。",
    "Has a 20% chance to raise the user's Attack by 1 stage.": "有20%几率令使用者的攻击提升1级。",
    "Has a 20% chance to raise the user's Defense by 1 stage.": "有20%几率令使用者的防御提升1级。",
    "Has a 20% chance to raise the user's Special Attack by 1 stage.": "有20%几率令使用者的特攻提升1级。",
    "Has a 20% chance to raise the user's Special Defense by 1 stage.": "有20%几率令使用者的特防提升1级。",
    "Has a 20% chance to raise the user's Speed by 1 stage.": "有20%几率令使用者的速度提升1级。",
    "Has a 30% chance to raise the user's Attack by 1 stage.": "有30%几率令使用者的攻击提升1级。",
    "Has a 30% chance to raise the user's Defense by 1 stage.": "有30%几率令使用者的防御提升1级。",
    "Has a 30% chance to raise the user's Special Attack by 1 stage.": "有30%几率令使用者的特攻提升1级。",
    "Has a 30% chance to raise the user's Special Defense by 1 stage.": "有30%几率令使用者的特防提升1级。",
    "Has a 30% chance to raise the user's Speed by 1 stage.": "有30%几率令使用者的速度提升1级。",
    "Has a 50% chance to raise the user's Attack by 1 stage.": "有50%几率令使用者的攻击提升1级。",
    "Has a 50% chance to raise the user's Defense by 1 stage.": "有50%几率令使用者的防御提升1级。",
    "Has a 50% chance to raise the user's Special Attack by 1 stage.": "有50%几率令使用者的特攻提升1级。",
    "Has a 50% chance to raise the user's Special Defense by 1 stage.": "有50%几率令使用者的特防提升1级。",
    "Has a 50% chance to raise the user's Speed by 1 stage.": "有50%几率令使用者的速度提升1级。",
    "Has a 100% chance to raise the user's Attack by 1 stage.": "100%几率令使用者的攻击提升1级。",
    "Has a 100% chance to raise the user's Defense by 1 stage.": "100%几率令使用者的防御提升1级。",
    "Has a 100% chance to raise the user's Special Attack by 1 stage.": "100%几率令使用者的特攻提升1级。",
    "Has a 100% chance to raise the user's Special Defense by 1 stage.": "100%几率令使用者的特防提升1级。",
    "Has a 50% chance to raise the user's Defense by 2 stages.": "有50%几率令使用者的防御提升2级。",
    "Has a 50% chance to raise the user's Defense by 1 stage for each hit.": "命中后有50%几率令使用者的防御提升1级。",
    "Has a 70% chance to raise the user's Special Attack by 1 stage.": "有70%几率令使用者的特攻提升1级。",
    "Has a 100% chance to raise the user's Speed by 1 stage and a higher chance for a critical hit.": "100%几率令使用者的速度提升1级。容易击中要害。",
    "Has a 100% chance to raise the user's Speed by 1 stage.": "100%几率令使用者的速度提升1级。",
    "Has a 10% chance to raise the user's Attack, Defense, Special Attack, Special Defense, and Speed by 1 stage.": "有10%几率令使用者的攻击、防御、特攻、特防和速度提升1级。",
    "Has a 10% chance to lower the target's Attack by 1 stage.": "有10%几率令目标的攻击降低1级。",
    "Has a 10% chance to lower the target's Defense by 1 stage.": "有10%几率令目标的防御降低1级。",
    "Has a 10% chance to lower the target's Special Attack by 1 stage.": "有10%几率令目标的特攻降低1级。",
    "Has a 10% chance to lower the target's Special Defense by 1 stage.": "有10%几率令目标的特防降低1级。",
    "Has a 10% chance to lower the target's Speed by 1 stage.": "有10%几率令目标的速度降低1级。",
    "Has a 20% chance to lower the target's Attack by 1 stage.": "有20%几率令目标的攻击降低1级。",
    "Has a 20% chance to lower the target's Defense by 1 stage.": "有20%几率令目标的防御降低1级。",
    "Has a 20% chance to lower the target's Special Attack by 1 stage.": "有20%几率令目标的特攻降低1级。",
    "Has a 20% chance to lower the target's Special Defense by 1 stage.": "有20%几率令目标的特防降低1级。",
    "Has a 20% chance to lower the target's Speed by 1 stage.": "有20%几率令目标的速度降低1级。",
    "Has a 30% chance to lower the target's Attack by 1 stage.": "有30%几率令目标的攻击降低1级。",
    "Has a 30% chance to lower the target's Defense by 1 stage.": "有30%几率令目标的防御降低1级。",
    "Has a 30% chance to lower the target's Special Attack by 1 stage.": "有30%几率令目标的特攻降低1级。",
    "Has a 30% chance to lower the target's Special Defense by 1 stage.": "有30%几率令目标的特防降低1级。",
    "Has a 30% chance to lower the target's Speed by 1 stage.": "有30%几率令目标的速度降低1级。",
    "Has a 33% chance to lower the target's Attack by 1 stage.": "有33%几率令目标的攻击降低1级。",
    "Has a 33% chance to lower the target's Defense by 1 stage.": "有33%几率令目标的防御降低1级。",
    "Has a 33% chance to lower the target's Special Attack by 1 stage.": "有33%几率令目标的特攻降低1级。",
    "Has a 33% chance to lower the target's Special Defense by 1 stage.": "有33%几率令目标的特防降低1级。",
    "Has a 33% chance to lower the target's Special by 1 stage.": "有33%几率令目标的特殊降低1级。",
    "Has a 33% chance to lower the target's Speed by 1 stage.": "有33%几率令目标的速度降低1级。",
    "Has a 50% chance to lower the target's Attack by 1 stage.": "有50%几率令目标的攻击降低1级。",
    "Has a 50% chance to lower the target's Defense by 1 stage.": "有50%几率令目标的防御降低1级。",
    "Has a 50% chance to lower the target's Special Attack by 1 stage.": "有50%几率令目标的特攻降低1级。",
    "Has a 50% chance to lower the target's Special Defense by 1 stage.": "有50%几率令目标的特防降低1级。",
    "Has a 50% chance to lower the target's Speed by 1 stage.": "有50%几率令目标的速度降低1级。",
    "Has a 100% chance to lower the target's Attack by 1 stage.": "100%几率令目标的攻击降低1级。",
    "Has a 100% chance to lower the target's Defense by 1 stage.": "100%几率令目标的防御降低1级。",
    "Has a 100% chance to lower the target's Special Attack by 1 stage.": "100%几率令目标的特攻降低1级。",
    "Has a 100% chance to lower the target's Special Defense by 1 stage.": "100%几率令目标的特防降低1级。",
    "Has a 100% chance to lower the target's Speed by 1 stage.": "100%几率令目标的速度降低1级。",
    "Has a 100% chance to lower the target's Special Defense by 2 stages.": "100%几率令目标的特防降低2级。",
    "Has a 30% chance to lower the target's accuracy by 1 stage.": "有30%几率令目标的命中率降低1级。",
    "Has a 33% chance to lower the target's accuracy by 1 stage.": "有33%几率令目标的命中率降低1级。",
    "Has a 50% chance to lower the target's accuracy by 1 stage.": "有50%几率令目标的命中率降低1级。",
    "Has a 100% chance to lower the target's accuracy by 1 stage.": "100%几率令目标的命中率降低1级。",
    "Has a 40% chance to lower the target's Special Defense by 2 stages.": "有40%几率令目标的特防降低2级。",
    "Damage doubles if the target is using Dig.": "对正在挖洞的目标造成双倍伤害。",
    "Damage doubles if the target is using Dive.": "对正在潜水的目标造成双倍伤害。",
    "Damage doubles if the target is using Fly.": "对正在飞翔的目标造成双倍伤害。",
    "The user faints after using this move, even if this move fails for having no target. This move is prevented from executing if any active Pokemon has the Damp Ability.": "自身陷入濒死状态并攻击目标造成伤害，即使招式没有产生效果，使用者仍然会陷入濒死状态。有湿气特性的宝可梦在场时，使用失败。",
    "The user faints after using this move. The target's Defense is halved during damage calculation. This move is prevented from executing if any active Pokemon has the Damp Ability.": "自身陷入濒死状态然后攻击目标造成伤害，将目标的防御能力值减半计算。有湿气特性的宝可梦在场时，使用失败。",
    "The user faints after using this move, unless this move has no target. The target's Defense is halved during damage calculation. This move is prevented from executing if any active Pokemon has the Damp Ability.": "如果有目标，自身陷入濒死状态然后攻击目标造成伤害，将目标的防御能力值减半计算。有湿气特性的宝可梦在场时，使用失败。",
    "Lowers the user's Attack by 1 stage.": "令使用者的攻击降低1级。",
    "Lowers the user's Defense by 1 stage.": "令使用者的防御降低1级。",
    "Lowers the user's Special Attack by 1 stage.": "令使用者的特攻降低1级。",
    "Lowers the user's Special Defense by 1 stage.": "令使用者的特防降低1级。",
    "Lowers the user's Speed by 1 stage.": "令使用者的速度降低1级。",
    "Lowers the user's Attack by 2 stages.": "令使用者的攻击降低2级。",
    "Lowers the user's Defense by 2 stages.": "令使用者的防御降低2级。",
    "Lowers the user's Special Attack by 2 stages.": "令使用者的特攻降低2级。",
    "Lowers the user's Special Defense by 2 stages.": "令使用者的特防降低2级。",
    "Lowers the user's Speed by 2 stages.": "令使用者的速度降低2级。",
    "Lowers the user's Attack and Defense by 1 stage.": "令使用者的攻击和防御降低1级。",
    "Lowers the user's Defense and Special Defense by 1 stage.": "令使用者的防御和特防降低1级。",
    "If this move is successful, the user must recharge on the following turn and cannot select a move.": "如果成功使出该招式，下一回合无法动弹且必须恢复精力。",
    "Lowers the target's Attack by 1 stage.": "令目标的攻击降低1级。",
    "Lowers the target's Defense by 1 stage.": "令目标的防御降低1级。",
    "Lowers the target's Special Attack by 1 stage.": "令目标的特攻降低1级。",
    "Lowers the target's Special Defense by 1 stage.": "令目标的特防降低1级。",
    "Lowers the target's Speed by 1 stage.": "令目标的速度降低1级。",
    "Lowers the target's accuracy by 1 stage.": "令目标的命中率降低1级。",
    "Lowers the target's evasiveness by 1 stage.": "令目标的闪避率降低1级。",
    "Lowers the target's Attack by 2 stages.": "令目标的攻击降低2级。",
    "Lowers the target's Defense by 2 stages.": "令目标的防御降低2级。",
    "Lowers the target's Special Attack by 2 stages.": "令目标的特攻降低2级。",
    "Lowers the target's Special Defense by 2 stages.": "令目标的特防降低2级。",
    "Lowers the target's Speed by 2 stages.": "令目标的速度降低2级。",
    "Lowers the target's accuracy by 2 stages.": "令目标的命中率降低2级。",
    "Lowers the target's evasiveness by 2 stages.": "令目标的闪避率降低2级。",
    "Lowers the target's Attack by 3 stages.": "令目标的攻击降低3级。",
    "Lowers the target's Defense by 3 stages.": "令目标的防御降低3级。",
    "Lowers the target's Special Attack by 3 stages.": "令目标的特攻降低3级。",
    "Lowers the target's Special Defense by 3 stages.": "令目标的特防降低3级。",
    "Lowers the target's Speed by 3 stages.": "令目标的速度降低3级。",
    "Lowers the target's accuracy by 3 stages.": "令目标的命中率降低3级。",
    "Lowers the target's evasiveness by 3 stages.": "令目标的闪避率降低3级。",
    "Lowers the target's Speed by 1 stage and poisons it.": "降低目标的速度1级并令其陷入中毒状态。",
    "Has a 10% chance to freeze the target. This move's type effectiveness against Water is changed to be super effective no matter what this move's type is.": "有10%几率使目标陷入冰冻。对于水属性宝可梦也是效果绝佳。",
    "Has a 10% chance to freeze the target. If the weather is Snow, this move does not check accuracy.": "有10%几率使目标陷入冰冻。下雪时必定命中。",
    "Has a 10% chance to freeze the target. If the weather is Hail, this move does not check accuracy.": "有10%几率使目标陷入冰冻。冰雹时必定命中。",
    "Has a 10% chance to freeze the target.": "有10%几率使目标陷入冰冻状态。",
    "Has a 30% chance to make the target flinch.": "有30%几率使目标陷入畏缩状态。",
    "Has a 20% chance to make the target flinch.": "有20%几率使目标陷入畏缩状态。",
    "Has a 10% chance to make the target flinch.": "有10%几率使目标陷入畏缩状态。",
    "Has a 100% chance to burn the target.": "100%几率使目标陷入灼伤状态。",
    "Has a 50% chance to burn the target.": "有50%几率使目标陷入灼伤状态。",
    "Has a 30% chance to burn the target.": "有30%几率使目标陷入灼伤状态。",
    "Has a 20% chance to burn the target.": "有20%几率使目标陷入灼伤状态。",
    "Has a 10% chance to burn the target.": "有10%几率使目标陷入灼伤状态。",
    "Has a 100% chance to paralyze the target.": "100%几率使目标陷入麻痹状态。",
    "Has a 50% chance to paralyze the target.": "有50%几率使目标陷入麻痹状态。",
    "Has a 30% chance to paralyze the target.": "有30%几率使目标陷入麻痹状态。",
    "Has a 20% chance to paralyze the target.": "有20%几率使目标陷入麻痹状态。",
    "Has a 10% chance to paralyze the target.": "有10%几率使目标陷入麻痹状态。",
    "Has a 50% chance to badly poison the target.": "有50%几率使目标陷入剧毒状态。",
    "Has a 40% chance to poison the target.": "有40%几率使目标陷入中毒状态。",
    "Has a 30% chance to poison the target.": "有30%几率使目标陷入中毒状态。",
    "Has a 20% chance to poison the target.": "有20%几率使目标陷入中毒状态。",
    "Has a 10% chance to poison the target.": "有10%几率使目标陷入中毒状态。",
    "Has a 10% chance to poison the target and a higher chance for a critical hit.": "有10%几率使目标陷入中毒状态。容易击中要害。",
    "Has a 10% chance to confuse the target.": "有10%几率使目标陷入混乱状态。",
    "Has a 20% chance to confuse the target.": "有20%几率使目标陷入混乱状态。",
    "Has a 30% chance to confuse the target.": "有30%几率使目标陷入混乱状态。",
    "Has a 50% chance to confuse the target.": "有50%几率使目标陷入混乱状态。",
    "Has a 100% chance to confuse the target.": "100%几率使目标陷入混乱状态。",
    "Has a 100% chance to poison the foe.": "100%几率使对手陷入中毒状态。",
    "Has a 100% chance to flinch the foe.": "100%几率使对手陷入畏缩状态。",
    "Has a 100% chance to freeze the foe.": "100%几率使对手陷入冰冻状态。",
    "Has a 100% chance to burn the foe.": "100%几率使对手陷入灼伤状态。",
    "Has a 100% chance to paralyze the foe.": "100%几率使对手陷入麻痹状态。",
    "Has a 100% chance to make the target flinch. Fails unless it is the user's first turn on the field.": "100%几率使目标陷入畏缩状态。出场后立刻使出才能成功，否则招式会失败。",
    "Fails unless it is the user's first turn on the field.": "出场后立刻使出才能成功，否则招式会失败。",
    "Deals damage to the target equal to the user's level.": "对目标造成与自身等级相等的伤害。",
    "Power is equal to 20+(X*20), where X is the user's total stat stage changes that are greater than 0.": "自身每有一项能力变化提升一级，招式威力增加20。自身的能力降低不会影响此招式的威力。",
    "Power is equal to (user's current HP * 150 / user's maximum HP), rounded down, but not less than 1.": "威力=150×(使用者当前HP/使用者全部HP)，向下取整。威力至少为1。",
    "Damage is calculated using the user's Defense stat as its Attack, including stat stage changes. Other effects that modify the Attack stat are used as normal.": "使用自身的防御代替自身的攻击进行伤害计算。能影响扑击伤害的因素：防御能力变化、灼伤、讲究头带、增加攻击的特性。",
    "Raises the user's Speed by 2 stages. If the user's Speed was changed, the user's weight is reduced by 100 kg as long as it remains active. This effect is stackable but cannot reduce the user's weight to less than 0.1 kg.": "令使用者的速度提升2级。同时令使用者的体重降低100kg，最多下降至0.1kg。",
    "Badly poisons the target. If a Poison-type Pokemon uses this move, the target cannot avoid the attack, even if the target is in the middle of a two-turn move.": "使目标陷入剧毒状态。毒属性宝可梦使用剧毒一定会命中，除非目标正在使用蓄力的招式并不在场地上。",
    "Paralyzes the target. This move does not ignore type immunity.": "使目标陷入麻痹状态。对属性相性是0倍的目标无效。",
    "The user restores 1/2 of its maximum HP, rounded half up.": "回复使用者1/2的HP，向上取整一半。",
    "At the end of the next turn, the Pokemon at the user's position has 1/2 of the user's maximum HP restored to it, rounded down. Fails if this move is already in effect for the user's position.": "陷入祈愿状态，下回合结束时，回复自身或是替换出场的宝可梦1/2的最大HP。如果已处于祈愿状态，使用祈愿会失败。",
    "Deals damage to the target equal to (target's current HP - user's current HP). The target is unaffected if its current HP is less than or equal to the user's current HP.": "对目标造成（目标HP-使用者HP）的伤害。目标HP不高于使用者HP时会使用失败。",
    "Power doubles if the user moves before the target.": "如果比对手先出手攻击，招式威力翻倍。",
    "Lowers the user's Defense and Special Defense by 1 stage. Raises the user's Attack, Special Attack, and Speed by 2 stages.": "令使用者的防御和特防降低1级。令使用者的攻击和特攻提高2级。",
    "Has a higher chance for a critical hit.": "容易击中要害。",
    "Power doubles if the user was hit by the target this turn.": "如果本回合内被目标攻击并被造成了伤害，威力翻倍。",
    "Hits three times. This move is always a critical hit unless the target is under the effect of Lucky Chant or has the Battle Armor or Shell Armor Abilities.": "连续攻击3次。攻击必定击中要害，除非目标拥有战斗盔甲、硬壳盔甲特性或处于幸运咒语的保护之下。",
    "This attack charges on the first turn and executes on the second. Raises the user's Special Attack by 1 stage on the first turn. If the user is holding a Power Herb, the move completes in one turn.": "在第一回合进行蓄力，同时令使用者的特攻提升1级，在第二回合攻击目标。如果携带了强力香草，可以立刻结束蓄力，在第一回合发动招式。",
    "If this move is successful, the user loses 1/2 of its maximum HP, rounded up, unless the user has the Magic Guard Ability.": "对使用者造成最大HP的1/2伤害，向上取整。除非使用者具有魔法防守特性。",
    "Deals damage to the target equal to half of its current HP, rounded down, but not less than 1 HP.": "对目标造成目标当前HP1/2（向下取整）的伤害。至少造成1伤害。",
    "Fails if the target did not select a physical attack, special attack, or Me First for use this turn, or if the target moves before the user.": "如果目标在本回合没有选择攻击招式或抢先一步，或本回合已经行动，使用失败。",
    "If the current weather is Sunny Day and the user is not holding Utility Umbrella, this move's damage is multiplied by 1.5 instead of halved for being Water type.": "天气为大晴天时且使用者没有携带万能伞，招式威力不但不会降低，还会提升为1.5倍。",
    "Deals damage to the target based on its Defense instead of Special Defense.": "使用目标的防御代替目标的特防进行伤害计算。",
    "Ignores the target's stat stage changes, including evasiveness.": "此招式在攻击时无视目标的能力变化，包括闪避率。",
    "Power is equal to 50+(X*50), where X is the total number of times any Pokemon has fainted on the user's side, and X cannot be greater than 100.": "我方每有一只宝可梦陷入过濒死状态，招式的威力提升50。最多提升100次。",
    "If this attack does not miss, the effects of Reflect, Light Screen, and Aurora Veil end for the target's side of the field before damage is calculated.": "如果攻击没有被闪避，在造成伤害之前破坏对方场地的光墙、反射壁和极光幕。",
    "If this attack does not miss, the effects of Reflect and Light Screen end for the target's side of the field before damage is calculated.": "如果攻击没有被闪避，在造成伤害之前破坏对方场地的光墙和反射壁。",
    "If this attack does not miss and whether or not the target is immune, the effects of Reflect and Light Screen end for the target's side of the field before damage is calculated.": "如果攻击没有被闪避，即使免疫此攻击也会在造成伤害之前破坏对方场地的光墙和反射壁。",
    "Hits twice. If the first hit breaks the target's substitute, it will take damage for the second hit. This move does not check accuracy.": "连续攻击2次。如果第一下打破了替身，招式会继续攻击并造成伤害。攻击必定会命中。",
    "Hits twice. If the first hit breaks the target's substitute, it will take damage for the second hit.": "连续攻击2次。如果第一下打破了替身，招式会继续攻击并造成伤害。",
    "Hits twice. If the first hit breaks the target's substitute, the move ends.": "连续攻击2次。如果第一下打破了替身，招式立即结束。",
    "Hits twice. If the first hit breaks the target's substitute, it will take damage for the second hit. Has a 30% chance to make the target flinch.": "连续攻击2次。如果第一下打破了替身，招式会继续攻击并造成伤害。30%几率使目标陷入畏缩状态。",
    "Raises the user's Attack by 12 stages in exchange for the user losing 1/2 of its maximum HP, rounded down. Fails if the user would faint or if its Attack stat stage is 6.": "使用者损失最大HP的1/2（向下取整）,提升12级攻击。如果使用者自身HP不足1/2或攻击能力等级已为6级，招式使用失败。",
    "Raises the target's Attack and Special Attack by 2 stages.": "提升目标2级攻击和特攻。",
    "Raises the user's Special by 2 stages.": "令使用者的特殊提升2级。",
    "Raises the user's Special by 1 stage.": "令使用者的特殊提升1级。",
    "Lowers the target's Attack and Special Attack by 1 stage.": "令目标的攻击和特攻降低1级。",
    "Raises the target's Attack by 2 stages and confuses it.": "提升目标2级攻击并令其陷入混乱状态。",
    "Has a 40% chance to lower the target's accuracy by 1 stage.": "有40%几率令目标的命中率降低1级。",
    "Lowers the target's Attack and Defense by 1 stage.": "令目标的攻击和防御降低1级。",
    "Has a 100% chance to raise the user's evasion by 1 stage.": "100%几率令使用者的闪避率提升1级。",
    "Damage is multiplied by 1.3333 if this move is super effective against the target.": "攻击目标造成伤害，招式出现效果绝佳时威力提升33%。",
    "If the user has not fainted, the target is cured of its burn.": "如果使用者没有濒死，解除目标的灼伤状态。",
    "If the current terrain is Electric Terrain and the target is grounded, this move's power is doubled.": "在电气场地上，若目标为地面上的宝可梦，威力翻倍。",
    "If the current terrain is Grassy Terrain and the user is grounded, this move has its priority increased by 1.": "在青草场地上，若使用者为地面上的宝可梦，优先度+1。",
    "If the current terrain is Psychic Terrain and the user is grounded, this move hits all opposing Pokemon and has its power multiplied by 1.5.": "在精神场地上，若使用者为地面上的宝可梦，则攻击目标变为全部可以攻击到的对手宝可梦，同时威力提升50%。",
    "Raises the user's Attack and Speed by 1 stage. Removes subtitutes from all active Pokemon and ends the effects of Spikes, Stealth Rock, Sticky Web, and Toxic Spikes for both sides.": "令使用者的攻击和速度提升1级。将撒菱、隐形岩、黏黏网、毒菱、替身全部扫除掉。",
    "Power is equal to 100 * (target's current HP / target's maximum HP), rounded half down, but not less than 1.": "威力=100×（目标当前HP/目标最大HP），向下取整一半。威力至少为1。",
    "Prevents the target from using non-damaging moves for its next three turns. Pokemon with the Oblivious Ability or protected by the Aroma Veil Ability are immune.": "在3回合内，使目标不能使用变化招式。拥有迟钝或芳香幕特性的宝可梦免疫挑衅。",
    "Prevents the target from using non-damaging moves for its next three turns.": "在3回合内，使目标不能使用变化招式。",
    "Power is equal to the greater of ((255 - user's Happiness) * 2/5), rounded down, or 1.": "威力随着亲密度增加而减弱，威力为（255 - 亲密度）÷2.5，向下取整，最小为1。",
    "Power is equal to the greater of (user's Happiness * 2/5), rounded down, or 1.": "威力随着亲密度增加，为亲密度÷2.5，向下取整，最小为1。",
    "The user and the target's HP become the average of their current HP, rounded down, but not more than the maximum HP of either one.": "将使用者的HP与目标的HP相加之后取其算术平均数,向下取整。",
    "This move is always a critical hit unless the target is under the effect of Lucky Chant or has the Battle Armor or Shell Armor Abilities. This move does not check accuracy.": "攻击必定击中要害，除非目标拥有战斗盔甲、硬壳盔甲特性或处于幸运咒语的保护之下。攻击必定会命中。",
    "Has a 10% chance to burn the target and a 10% chance to make it flinch.": "有10%几率使目标陷入灼伤状态,10%几率使目标陷入畏缩状态。",
    "Has a 10% chance to freeze the target and a 10% chance to make it flinch.": "有10%几率使目标陷入冰冻状态,10%几率使目标陷入畏缩状态。",
    "Has a 10% chance to paralyze the target and a 10% chance to make it flinch.": "有10%几率使目标陷入麻痹状态,10%几率使目标陷入畏缩状态。",
    "Power doubles if the target has a non-volatile status condition.": "如果目标处于异常状态，威力翻倍。",
    "Power doubles if the target has less than or equal to half of its maximum HP remaining.": "如果目标的HP为其最大HP的1/2或以下，威力翻倍。",
    "Has a 20% chance to either burn, freeze, or paralyze the target.": "有20%几率使目标陷入灼伤、冰冻或麻痹状态。",
    "Fails unless the user is a Fire type. If this move is successful, the user's Fire type becomes typeless as long as it remains active.": "不具有火属性的宝可梦使出此招式的话，会使用失败。成功使用此招式后自身的火属性变成无属性。",
    "Fails unless the user is a Fire type. If this move is successful and the user is not Terastallized, the user's Fire type becomes typeless as long as it remains active.": "不具有火属性的宝可梦使出此招式的话，会使用失败。如果使用者没有太晶化火属性，成功使用此招式后自身的火属性变成无属性。",
    "Fails unless the user is an Electric type. If this move is successful and the user is not Terastallized, the user's Electric type becomes typeless as long as it remains active.": "不具有电属性的宝可梦使出此招式的话，会使用失败。如果使用者没有太晶化电属性，成功使用此招式后自身的电属性变成无属性。",
    "If the target lost HP, the user takes recoil damage equal to 1/4 the HP lost by the target, rounded half up, but not less than 1 HP.": "使用者承受对目标造成伤害的1/4的伤害，向上取整一半，但不小于1。",
    "If the target lost HP, the user takes recoil damage equal to 1/2 the HP lost by the target, rounded half up, but not less than 1 HP.": "使用者承受对目标造成伤害的1/2的伤害，向上取整一半，但不小于1。",
    "If the target lost HP, the user takes recoil damage equal to 33% the HP lost by the target, rounded half up, but not less than 1 HP.": "使用者承受对目标造成伤害的33%的伤害，向上取整一半，但不小于1。",
    "Has a 10% chance to paralyze the target. If the target lost HP, the user takes recoil damage equal to 33% the HP lost by the target, rounded half up, but not less than 1 HP.": "有10%几率使目标陷入麻痹状态。使用者承受对目标造成伤害的33%的伤害，向上取整一半，但不小于1。",
    "This move and its effects ignore the Abilities of other Pokemon.": "攻击时能够使其他宝可梦的特性失效。",
    "If this move is successful and the user has not fainted, the target loses 3 PP from its last move.": "如果成功使出该招式且目标没有濒死，目标最后使用的招式的PP降低3点。",
    "This move becomes a physical attack if the user's Attack is greater than its Special Attack, including stat stage changes. This move and its effects ignore the Abilities of other Pokemon.": "如果使用者的攻击大于特攻(计算能力变化)，则此招式变成物理招式。攻击时能够使其他宝可梦的特性失效。",
    "If this move is successful, causes Normal-type moves to become Electric type this turn.": "如果成功使出该招式，直到回合结束所有一般属性招式变为电属性。",
    "This move fails unless the user knows this move and at least one other move, and has used all the other moves it knows at least once each since it became active or Transformed.": "只能在其它招式均使用过之后才可以使用。如果该招式是被另一个招式触发的，但使用者没有学会珍藏，使用失败。",
    "If this attack is not successful, the user loses half of its maximum HP, rounded down, as crash damage. Pokemon with the Magic Guard Ability are unaffected by crash damage.": "如果攻击没有产生效果，自身承受最大HP的1/2（向下取整）的反作用力伤害。具有魔法防守特性的宝可梦不会受到反作用力伤害。",
    "If this attack is not successful and the target was not immune, the user loses HP equal to half of the damage the target would have taken, rounded down, but no less than 1 HP and no more than half of the target's maximum HP, as crash damage.": "如果攻击没有产生效果，自身承受本应造成伤害的1/2。上限为对手最大HP的1/2，向下取整。",
    "Has a 30% chance to burn the target. The target thaws out if it is frozen.": "有30%几率使目标陷入灼伤状态。被该招式击中会被解冻。",
    "If this move is successful, moves targeted at the user deal double damage and do not check accuracy until the user's next turn.": "如果成功使出该招式，则在使用者下次使出其他招式之前，任何以使用者为目标的招式对使用者造成的伤害翻倍，并且一定会命中。",
    "If the user is hit by a contact move this turn before it can execute this move, the attacker is burned.": "如果在加热鸟嘴到发动攻击期间受到接触类招式攻击，伤害的施加者陷入灼伤状态。",
    "Until the user's next turn, if an opposing Pokemon's attack knocks the user out, that move loses all its remaining PP.": "如果自身在下次行动前被招式直接造成的伤害击倒，击倒自己的宝可梦用于击倒自身的招式的PP归0。",
    "Until the user's next turn, if an opposing Pokemon's attack knocks the user out, that Pokemon faints as well, unless the attack was Future Sight.": "如果自身在下次行动前被招式直接造成的伤害击倒，击倒自己的宝可梦也会陷入濒死，除非该招式是预支未来。",
    "Until the user's next turn, if an opposing Pokemon's attack knocks the user out, that Pokemon faints as well, unless the attack was Doom Desire or Future Sight.": "如果自身在下次行动前被招式直接造成的伤害击倒，击倒自己的宝可梦也会陷入濒死，除非该招式是预支未来或破灭之愿。",
    "Causes the target's last move used to lose 4 PP. Fails if the target has not made a move, if the move has 0 PP, or if it no longer knows the move.": "对手最后使用的招式的PP降低4点。如果目标在对战中尚未使用招式，或上回合使用的招式PP为0，该招式使用失败。",
    "Raises the target's Attack by 2 stages and lowers its Defense by 2 stages.": "令目标的攻击提升2级。 令目标的防御降低2级。",
    "The user prevents all opposing Pokemon from using any moves that the user also knows as long as the user remains active.": "自身处于封印状态期间，对手的任何宝可梦不能使出与自身学会的任一招式相同的招式。",
    "Has a 30% chance to paralyze the target. This attack charges on the first turn and executes on the second. If the user is holding a Power Herb, the move completes in one turn.": "有30%几率使目标陷入麻痹状态。在第一回合进行蓄力，第二回合攻击目标。如果携带了强力香草，可以立刻结束蓄力，在第一回合发动招式。",
    "Has a 30% chance to burn the target. This attack charges on the first turn and executes on the second. If the user is holding a Power Herb, the move completes in one turn.": "有30%几率使目标陷入灼伤状态。在第一回合进行蓄力，第二回合攻击目标。如果携带了强力香草，可以立刻结束蓄力，在第一回合发动招式。",
    "The user loses its focus and does nothing if it is hit by a damaging attack this turn before it can execute the move.": "聚气后如果在发动攻击前受到伤害，则招式会失败。",
    "Deals damage to the target equal to the user's current HP. If this move is successful, the user faints.": "使用者消耗全部剩余HP，并对目标造成使用者消耗HP的伤害。如果成功使出该招式，自身陷入濒死状态。",
    "Fails if there is no terrain active. Ends the effects of Electric Terrain, Grassy Terrain, Misty Terrain, and Psychic Terrain.": "如果不存在场地型状态，招式使用失败。攻击后结束电气场地，青草场地，薄雾场地和精神场地的效果。",
    "This move's type depends on the user's held Memory.": "招式属性根据使用者装备的存储碟决定。",
    "This move's type depends on the user's held Drive.": "招式属性根据使用者装备的卡带决定。",
    "This move's type depends on the user's held Plate.": "招式属性根据使用者装备的石板决定。",
    "Raises the user's Attack by 3 stages if this move knocks out the target.": "如果攻击的目标被本次攻击造成濒死，令使用者的攻击提升3级。",
    "Power doubles if the user is burned, paralyzed, or poisoned. The physical damage halving effect from the user's burn is ignored.": "如果自身处于灼伤、麻痹或中毒的异常状态下，威力翻倍。无视灼伤导致的攻击减半效果。",
    "Power doubles if the user is burned, paralyzed, or poisoned.": "如果自身处于灼伤、麻痹或中毒的异常状态下，威力翻倍。",
    "If this move is successful, the target's ally loses 1/16 of its maximum HP, rounded down, unless it has the Magic Guard Ability.": "如果成功使出该招式，目标的盟友会受到溅射伤害，损失最大HP的1/16，向下取整，除非其拥有魔法防守特性。",
    "For 2 turns, the target cannot use sound-based moves.": "在2回合内，目标无法使出声音的招式。",
    "For 4 turns, the user and its party members have their Speed doubled. Fails if this move is already in effect for the user's side.": "在4回合内，己方场地上全部宝可梦的速度翻倍。如果己方场地已处于顺风状态，使用失败。",
    "Damage is calculated using the target's Attack stat, including stat stage changes. The user's Ability, item, and burn are used as normal.": "使用目标的攻击能力值进行伤害计算，包括攻击能力变化。使用者的特性，道具和灼伤会正常计算。",
    "The user recovers 1/2 the HP lost by the target, rounded half up. If Big Root is held by the user, the HP recovered is 1.3x normal, rounded half down.": "使用者将造成伤害的50%转化为自身的HP，向上取整一半。携带大根茎时，恢复量提升30%，向下取整一半。",
    "The user recovers 3/4 the HP lost by the target, rounded half up. If Big Root is held by the user, the HP recovered is 1.3x normal, rounded half down.": "使用者将造成伤害的75%转化为自身的HP，向上取整一半。携带大根茎时，恢复量提升30%，向下取整一半。",
    "This move is always a critical hit unless the target is under the effect of Lucky Chant or has the Battle Armor or Shell Armor Abilities.": "攻击必定击中要害，除非目标拥有战斗盔甲、硬壳盔甲特性或处于幸运咒语的保护之下。",
    "Power doubles if the user had a stat stage lowered this turn.": "若该回合内自身能力变化曾降低过，威力翻倍。",
    "Power doubles if the target has already taken damage this turn, other than direct damage from Belly Drum, confusion, Curse, or Pain Split.": "如果目标在本回合曾受过伤害，威力翻倍。不包括腹鼓，混乱，诅咒和分担痛楚造成的伤害。",
    "Lowers the user's Speed, Defense, and Special Defense by 1 stage.": "令使用者的速度，防御和特防下降1级。",
    "Raises the target's Special Attack by 1 stage and confuses it.": "提升目标的1级特攻并令其混乱。",
    "Has a 100% chance to confuse the target if it had a stat stage raised this turn.": "令该回合内能力变化曾提高过的宝可梦陷入混乱状态。",
    "Has a 50% chance to lower the target's Defense by 1 stage, a 30% chance to make it flinch, and a higher chance for a critical hit.": "有50%几率令目标的防御降低1级，30%几率使目标陷入畏缩状态，容易击中要害。",
    "This move can hit a target using Bounce, Fly, or Sky Drop, or is under the effect of Sky Drop.": "可以击中处于弹跳，飞翔或自由落体状态的宝可梦。",
    "Has a 100% chance to make the target flinch. Fails if the target did not select a priority move for use this turn, or if the target moves before the user.": "100%几率使目标陷入畏缩状态。如果目标使出的招式不是先制攻击招式，或目标已经行动，使用失败。",
    "Has a 100% chance to burn the target if it had a stat stage raised this turn.": "令该回合内能力变化曾提高过的宝可梦陷入灼伤状态。",
    "Has a 10% chance to burn the target and a higher chance for a critical hit.": "有10%几率使目标陷入灼伤状态。容易击中要害。",
    "Power doubles if the target is asleep. If the user has not fainted, the target wakes up.": "如果目标处于睡眠状态，威力翻倍。如果使用者没有濒死，解除目标的睡眠状态。",
    "The user restores 1/2 of its maximum HP, rounded half down. If the weather is Sandstorm, the user instead restores 2/3 of its maximum HP, rounded half down.": "回复使用者1/2的最大HP，向上取整一半。如果当前天气是沙暴，回复2/3最大HP，向下取整一半。",
    "Resets the stat stages of all active Pokemon to 0.": "场上全部宝可梦的能力等级重置为0。",
    "Ends the effects of Electric Terrain, Grassy Terrain, Misty Terrain, and Psychic Terrain.": "攻击后结束电气场地，青草场地，薄雾场地和精神场地的效果。",
    "This attack charges on the first turn and executes on the second. Raises the user's Defense by 1 stage on the first turn. If the user is holding a Power Herb, the move completes in one turn.": "在第一回合进行蓄力，同时令使用者的防御提升1级，在第二回合攻击目标。如果携带了强力香草，可以立刻结束蓄力，在第一回合发动招式。",
    "Has a 50% chance to cause the target to either fall asleep, become poisoned, or become paralyzed.": "有50%几率使目标陷入麻痹、中毒或麻痹状态。",
    "The user swaps all its stat stage changes with the target.": "和目标交换全部的能力变化。",
    "Hits three times.": "连续攻击3次。",
    "Lowers the target's Speed by 1 stage. Until the target switches out, the effectiveness of Fire-type moves is doubled against it.": "令目标的速度降低1级。目标离场前，火属性的招式将会对目标造成效果绝佳的伤害。",
    "Each Pokemon on the user's side restores 1/4 of its maximum HP, rounded half up.": "回复使用者和同伴1/4的HP。向上取整一半。",
    "For 5 turns, all Fire-type attacks used by any active Pokemon have their power multiplied by 0.33. Fails if this effect is already active": "在5回合内，火属性的招式威力变为原本的33%。如果此状态已激活，使用失败。",
    "For 5 turns, all Electric-type attacks used by any active Pokemon have their power multiplied by 0.33. Fails if this effect is already active.": "在5回合内，电属性的招式威力变为原本的33%。如果此状态已激活，使用失败。",
    "This move combines Flying in its type effectiveness against the target. Damage doubles and no accuracy check is done if the target has used Minimize while active.": "该招式计算属性相性时视作格斗属性与飞行属性双属性。如果目标处于变小状态，威力翻倍，同时招式一定会命中。",
    "Has a 30% chance to paralyze the target. Damage doubles and no accuracy check is done if the target has used Minimize while active.": "有30%几率使目标陷入麻痹状态。如果目标处于变小状态，威力翻倍，同时招式一定会命中。",
    "The user cures its burn, poison, or paralysis. Fails if the user is not burned, poisoned, or paralyzed.": "消除使用者的灼伤、中毒或麻痹状态。如果没有陷入灼伤、中毒或麻痹状态，使用失败。",
    "If the current terrain is Electric Terrain, this move's power is multiplied by 1.5.": "场地为电气场地时，招式威力提升为原本的1.5倍。",
    "Has a very high chance for a critical hit.": "非常容易击中要害。",
    "Damage doubles and no accuracy check is done if the target has used Minimize while active.": "如果目标处于变小状态，威力翻倍，同时招式一定会命中。",
    "Deals damage to the target equal to 3/4 of its current HP, rounded down, but not less than 1 HP.": "对目标造成目标当前HP3/4的伤害，向下取整。至少造成1伤害。",
    "Raises the user's Attack, Defense, Special Attack, Special Defense, and Speed by 2 stages.": "提升使用者的攻击，防御，特攻，特防和速度各2级。",
    "Raises the user's Attack, Defense, Special Attack, Special Defense, and Speed by 1 stage.": "提升使用者的攻击，防御，特攻，特防和速度各1级。",
    "If this move is successful, the terrain becomes Psychic Terrain.": "如果成功使出该招式，脚下会变成精神场地。",
    "No competitive use. Fails if there is no ally adjacent to the user.": "没有招式效果。场上没有同伴时，使用失败。",
    "The user's type changes to match the original type of the move in its first move slot. Fails if the user cannot change its type, or if the type is one of the user's current types.": "改变自身属性为自己学会的第一个招式的属性。如果使用者无法改变属性或自身已经拥有该属性，使用失败。",
    "Z-Effect: Restores HP 100%": "Z效果：回复100%HP",
    "Z-Effect: Attack +1": "Z效果：提升1级攻击",
    "Z-Effect: Defense +1": "Z效果：提升1级防御",
    "Z-Effect: Sp. Atk +1": "Z效果：提升1级特攻",
    "Z-Effect: Sp. Def +1": "Z效果：提升1级特防",
    "Z-Effect: Speed +1": "Z效果：提升1级速度",
    "Z-Effect: Attack +2": "Z效果：提升2级攻击",
    "Z-Effect: Defense +2": "Z效果：提升2级防御",
    "Z-Effect: Sp. Atk +2": "Z效果：提升2级特攻",
    "Z-Effect: Sp. Def +2": "Z效果：提升2级特防",
    "Z-Effect: Speed +2": "Z效果：提升2级速度",
    "Z-Effect: Attack +3": "Z效果：提升3级攻击",
    "Z-Effect: Restores negative stat stages to 0": "Z效果：恢复下降的能力",
    "Z-Effect: accuracy +1": "Z效果：提升1级命中率",
    "Z-Effect: evasiveness +1": "Z效果：提升1级闪避率",
    "Z-Effect: Crit ratio +1": "Z效果：提升1级击中要害率",
    "Z-Effect: Redirects opposing attacks to user": "Z效果：万众瞩目",
    "Z-Effect: Restores HP 100% if user is Ghost type, otherwise Attack +1": "Z效果：如果使用者是幽灵属性，回复100%HP。如果不是则提升1级攻击",
    "Z-Effect: Restores replacement's HP 100%": "Z效果：回复将上场的友军100%HP",
    "Z-Effect: Attack +1, Defense +1, Sp. Atk +1, Sp. Def +1, Speed +1": "Z效果：提升攻击，防御，特攻，特防和速度各1级。",
    "The target's stat stages greater than 0 are stolen from it and applied to the user before dealing damage.": "先夺取目标所有大于0的能力变化，再攻击目标造成伤害。",
    "Every Pokemon in the user's party is cured of its non-volatile status condition. Active Pokemon with the Sap Sipper Ability are not cured, unless they are the user.": "治愈己方队伍所有宝可梦的异常状态。拥有食草特性的宝可梦不会被治愈，除非它是使用者。",
    "Every Pokemon in the user's party is cured of its non-volatile status condition. Active Pokemon with the Soundproof Ability are not cured.": "治愈己方队伍中全部宝可梦的异常状态。如果使用者拥有隔音特性，不会被治愈。",
    "Every Pokemon in the user's party is cured of its non-volatile status condition. Pokemon with the Soundproof Ability are not cured.": "治愈己方队伍中全部宝可梦的异常状态。拥有隔音特性的宝可梦不会被治愈。",
    "Power doubles with each successful hit, up to a maximum of 160 power. The power is reset if this move misses or another move is used.": "每次连斩成功命中，下次攻击时威力翻倍，最大威力为160。如果招式未命中或自身离场或使用了其它招式，则威力重置为基础威力。",
    "This move's power is 20 if the target weighs less than 10 kg, 40 if less than 25 kg, 60 if less than 50 kg, 80 if less than 100 kg, 100 if less than 200 kg, and 120 if greater than or equal to 200 kg.": "如果目标的重量小于10kg，此招式的威力为20; 如果小于25kg，威力为40; 如果小于50kg，威力为60; 如果小于100kg，威力为80; 如果小于200kg,威力为100; 如果大于或等于200kg，威力为120。",
    "Causes damage to the target equal to 1/8 of its maximum HP (1/4 if the target is Steel or Water type), rounded down, at the end of each turn during effect. This effect ends when the target is no longer active.": "使目标陷入盐腌状态。处于盐腌状态的的宝可梦行动结束后损失最大HP的1/8(钢属性或水属性的宝可梦为最大HP的1/4)，向下取整。目标离场时，解除盐腌状态。",
    "Has a 30% chance to make the target flinch and a higher chance for a critical hit. This attack charges on the first turn and executes on the second. If the user is holding a Power Herb, the move completes in one turn.": "有30%几率使陷入畏缩状态，容易击中要害。在第一回合进行蓄力，第二回合攻击目标。如果携带了强力香草，可以立刻结束蓄力，在第一回合发动招式。",
    "The user restores 1/2 of its maximum HP, rounded half up. Until the end of the turn, Flying-type users lose their Flying type and pure Flying-type users become Normal type. Does nothing if the user's HP is full.": "回复使用者1/2的HP，向下取整。飞行属性的宝可梦使用该招式后会在当回合会失去飞行属性，只有飞行属性的宝可梦会变为一般属性。如果使用者HP已满，没有效果。",
    "The user falls asleep for the next two turns and restores all of its HP, curing itself of any non-volatile status condition in the process. Fails if the user has full HP, is already asleep, or if another effect is preventing sleep.": "连续睡上2回合,回复自己的全部HP以及治愈所有异常状态。如果使用者的HP已满、已经处于睡眠状态或其他影响，使用失败。",
    "The user falls asleep for the next two turns and restores all of its HP, curing itself of any non-volatile status condition in the process. This does not remove the user's stat penalty for burn or paralysis. Fails if the user has full HP.": "睡上1回合,回复自己的全部HP以及治愈所有异常状态，但解除灼伤状态不会解除攻击减半的效果。如果使用者的HP已满，已经处于睡眠状态或其他影响，使用失败。",
    "If this move is successful and the user has not fainted, the effects of Leech Seed and binding moves end for the user, and all hazards are removed from the user's side of the field.": "如果此招式成功使出且使用者没有濒死，会移除己方场地上的入场可生效的状态并摆脱自身的束缚和寄生种子状态。",
    "Has a 10% chance to burn the target. If the target lost HP, the user takes recoil damage equal to 33% the HP lost by the target, rounded half up, but not less than 1 HP.": "有10%几率使目标陷入灼伤状态。使用者承受对目标造成伤害的33%的伤害，向上取整一半，但不小于1。",
    "The target is forced to switch out and be replaced with a random unfainted ally. Fails if the target is the last unfainted Pokemon in its party, or if the target used Ingrain previously or has the Suction Cups Ability.": "令对方队伍中随机一只没有陷入濒死状态的宝可梦强制替换上场。如果目标是其队伍中唯一没有陷入濒死状态的宝可梦、处于扎根状态或拥有吸盘特性，使用失败。",
    "Lowers the target's Attack and Special Attack by 2 stages. The user faints unless this move misses or there is no target. Fails entirely if this move hits a substitute, but does not fail if the target's stats cannot be changed.": "令目标的攻击和特攻降低2级。自身陷入濒死状态，除非此招式没有命中、没有目标或使用失败。如果命中替身，使用失败；但如果该招式无法对对手的能力变化产生效果，不会失败。",
    "Until the user's next move, if an opposing Pokemon's attack knocks the user out, that Pokemon faints as well, unless the attack was Doom Desire or Future Sight.": "在使用者使出下一个招式之前，如果使用者因招式直接造成的伤害而陷入濒死状态(预知未来和破灭之愿除外)，攻击方也会进入濒死状态。",
    "Causes the Ghost type to be added to the target, effectively making it have two or three types. Fails if the target is already a Ghost type. If Forest's Curse adds a type to the target, it replaces the type added by this move and vice versa.": "如果目标没有幽灵属性，追加第二或第三属性幽灵属性。目标拥有幽灵属性时，招式使用失败。进入森林诅咒状态时会解除万圣夜状态，反之亦然。",
    "Prevents the target from using non-damaging moves for its next three turns. Pokemon with the Oblivious Ability or protected by the Aroma Veil Ability are immune. Z-Powered moves can still be selected and executed during this effect.": "在3回合内，使目标处于挑衅状态，不能使用变化招式。拥有迟钝或芳香幕特性的宝可梦免疫挑衅。Z招式不受挑衅状态影响。",
    "Prevents the target from selecting the same move for use two turns in a row. This effect ends when the target is no longer active.": "阻止对手连续使用相同的招式。当对手离场后该效果消失。",
    "If this move is successful and the user has not fainted, the effects of Leech Seed and binding moves end for the user, and all hazards are removed from the user's side of the field. Has a 100% chance to raise the user's Speed by 1 stage.": "如果此招式成功使出且使用者没有濒死，会移除己方场地上的入场可生效的状态并摆脱自身的束缚、寄生种子状态。令使用者的速度提高1级。",
    "If this move is successful and the user has not fainted, the effects of Leech Seed and binding moves end for the user, and all hazards are removed from the user's side of the field. Has a 100% chance to poison the target.": "如果此招式成功使出且使用者没有濒死，会移除己方场地上的入场可生效的状态并摆脱自身的束缚、寄生种子状态。100%令目标陷入中毒状态。",
    "Power doubles if the user is grounded and a terrain is active, and this move's type changes to match. Electric type during Electric Terrain, Grass type during Grassy Terrain, Fairy type during Misty Terrain, and Psychic type during Psychic Terrain.": "如果使用者是地上的宝可梦且有激活的场地，威力翻倍。视使出招式时场地状态不同，招式的属性会有所变化：无场地为一般属性，电气场地期间为电属性、青草场地期间为草属性、薄雾场地期间为妖精属性、精神场地期间为超能力属性。",
    "If both the user and the target have not fainted, the target is forced to switch out and be replaced with a random unfainted ally. This effect fails if the target used Ingrain previously, has the Suction Cups Ability, or this move hit a substitute.": "如果双方都没有陷入濒死，令对方队伍中随机一只没有陷入濒死状态的宝可梦强制替换上场。如果目标是其队伍中唯一没有陷入濒死状态的宝可梦、处于扎根状态、拥有吸盘特性或命中了替身，该招式的强制替换上场的效果无效。",
    "The user cures its non-volatile status condition. Raises the user's Special Attack and Special Defense by 1 stage.": "治愈使用者的异常状态。提升1级特攻和特防。",
    "Has a higher chance for a critical hit. If the user is an Ogerpon holding a mask, this move's type changes to match. Water type for Wellspring Mask, Fire type for Hearthflame Mask, and Rock type for Cornerstone Mask.": "容易击中要害。该招式的属性会根据使用者的面具而改变：厄诡椪-水井面具使用时，会变为水属性。厄诡椪-火灶面具使用时，会变为火属性。厄诡椪-础石面具使用时，会变为岩石属性。",
    "Raises the user's Special Attack, Special Defense, and Speed by 2 stages. This attack charges on the first turn and executes on the second. If the user is holding a Power Herb, the move completes in one turn.": "提升使用者特攻、特防和速度各2级。如果携带了强力香草，可以立刻结束蓄力，在第一回合发动招式。",
    "For 5 turns, the weather becomes Snow. The user switches out even if it is trapped and is replaced immediately by a selected party member. The user does not switch out if there are no unfainted party members.": "接下来5回合的天气变更为下雪。然后自身与后备宝可梦替换。即使陷入无法逃走状态也会退场。如果自身是同行中唯一没有陷入濒死状态的宝可梦，则不会退场。",
    "If this move is successful and the user has not fainted, the user switches out even if it is trapped and is replaced immediately by a selected party member. The user does not switch out if there are no unfainted party members.": "如果成功使出该招式，自身与后备宝可梦替换，即使陷入无法逃走状态也会退场。如果自身是同行中唯一没有陷入濒死状态的宝可梦，则不会退场。",
    "The user restores 1/2 of its maximum HP, rounded half up. If the user is not Terastallized, until the end of the turn Flying-type users lose their Flying type and pure Flying-type users become Normal type. Does nothing if the user's HP is full.": "回复使用者1/2的HP，向下取整。拥有飞行属性的宝可梦使用该招式后会在当回合会失去飞行属性，只有飞行属性的宝可梦会变为一般属性。如果使用者HP已满，没有效果。",
    "Raises the user's Attack, Special Attack, and Speed by 2 stages in exchange for the user losing 1/2 of its maximum HP, rounded down. Fails if the user would faint or if its Attack, Special Attack, and Speed stat stages would not change.": "使用者损失最大HP的1/2，向下取整，令使用者的攻击、特攻和速度提升2级。如果使用者自身HP不足1/2或能力等级没有变化，使用失败。",
    "The target restores 1/2 of its maximum HP, rounded half up. If the user has the Mega Launcher Ability, the target instead restores 3/4 of its maximum HP, rounded half down.": "回复目标1/2的HP，向上取整一半。如果使用者拥有超级发射器特性，回复量上升为最大HP的3/4，向上取整一半。",
    "Every Pokemon in the user's party is cured of its non-volatile status condition. Active Pokemon with the Soundproof Ability are not cured, unless they are the user.": "治愈己方队伍中全部宝可梦的异常状态。具有隔音特性的宝可梦不能被治愈，除非它是使用者。",
    "The user is replaced with another Pokemon in its party. The selected Pokemon has the user's stat stage changes, confusion, and certain move effects transferred to it.": "自身替换宝可梦下场，选择队伍中另外一只宝可梦上场。能力变化、混乱、以及部分的状态变化会传递给交换上场的宝可梦。",
    "The user restores 1/2 of its maximum HP, rounded down.": "自身回复1/2最大HP，向下取整。",
    "The user restores 1/2 of its maximum HP, rounded down. Until the end of the turn, Flying-type users lose their Flying type and pure Flying-type users become typeless. Does nothing if the user's HP is full.": "自身回复1/2最大HP，向下取整。直到回合结束，失去飞行属性；只有飞行属性的宝可梦变为无属性。如果HP已满，使用失败。",
    "Power doubles if the target is using Dig.": "对正在挖洞的目标造成双倍伤害。",
    "Power doubles if the target is using Dive.": "对正在潜水的目标造成双倍伤害。",
    "Power doubles if the target is using Fly.": "对正在飞翔的目标造成双倍伤害。",
    "The user falls asleep for the next two turns and restores all of its HP, curing itself of any non-volatile status condition in the process, even if it was already asleep. Fails if the user has full HP.": "使用者连续睡眠2回合，恢复全部HP并解除异常状态。如果使用者已经睡着了或HP已满，使用失败。",
    "Causes the target to lose 1/4 of its maximum HP, rounded down, at the end of each turn as long as it is asleep. This move does not affect the target unless it is asleep. The effect ends when the target wakes up, even if it falls asleep again in the same turn.": "使目标陷入恶梦状态。如果目标没有处于睡眠状态，则招式使用失败。处于恶梦状态的宝可梦在每个回合结束时损失最大HP的1/4。即使目标在同一回合再次入睡，效果也会在目标醒来时结束。",
    "The user restores 1/2 of its maximum HP if no weather conditions are in effect, all of its HP if the weather is Sunny Day, and 1/4 of its maximum HP if the weather is Rain Dance or Sandstorm, all rounded down.": "在没有天气型状态时，回复使用者的1/2最大HP。如果天气是大晴天或大日照，回复使用者的全部HP。如果天气是下雨、沙暴，回复使用者的1/4最大HP。全部向下取整。",
    "The user recovers 1/2 the HP lost by the target, rounded down.": "使用者回复给予对手伤害的一半HP，向下取整。",
    "The user recovers 1/2 the HP lost by the target, rounded down. If this move breaks the target's substitute, the user does not recover any HP.": "使用者回复给予对手伤害的一半HP，向下取整。如果此招式打破了替身，不会回复HP。",
    "Has a 20% chance to make the target flinch. Power doubles if the target is using Bounce, Fly, or Sky Drop, or is under the effect of Sky Drop.": "有20%几率使目标陷入畏缩状态。如果目标处于飞翔、弹跳、自由落体状态，威力翻倍。",
    "Raises the user's Attack and Special Attack by 1 stage.": "提升使用者的1级攻击和特攻。",
    "Leaves the target with at least 1 HP.": "目标至少会保留1点HP。",
    "The user copies all of the target's current stat stage changes.": "复制目标的所有能力变化。",
    "Has a 20% chance to burn the target. The user recovers 1/2 the HP lost by the target, rounded half up. If Big Root is held by the user, the HP recovered is 1.3x normal, rounded half down. The target thaws out if it is frozen.": "有20%几率使目标陷入灼伤状态。使用者将造成伤害的50%转化为自身的HP，向上取整一半。携带大根茎时，恢复量提升30%，向下取整一半。被该招式击中会被解冻。",
    "A fainted party member is selected and revived with 1/2 its max HP, rounded down. Fails if there are no fainted party members.": "使用后选择1只处于濒死状态的同行宝可梦，治愈它的濒死状态，并且让它回复最大HP的1/2，向下取整。如果没有濒死的同行宝可梦，使用失败。",
    "Until the end of the next turn, the target cannot avoid the user's moves, even if the target is in the middle of a two-turn move. The effect ends if either the user or the target leaves the field. Fails if this effect is active for the user.": "直到下回合结束，目标无法闪避使用者的招式。如果使用者或目标离场，效果结束。如果效果已经激活，使用失败。",
    "Has a 10% chance to cause the target to fall asleep.": "有10%几率使目标陷入睡眠状态。",
    "For every consecutive turn that this move is used by at least one Pokemon, this move's power is multiplied by the number of turns to pass, but not more than 5.": "如果连续使用，每一个回合威力都会提升，每次提升40。最多提升5次。",
    "If there are other active Pokemon that chose this move for use this turn, those Pokemon take their turn immediately after the user, in Speed order, and this move's power is 120 for each other user.": "当同伴中有多只宝可梦使用轮唱时，第一只使用轮唱后无视速度，剩下的宝可梦立刻使用，并且威力为120。",
    "For 5 turns, the user and its party members are protected from having their stat stages lowered by other Pokemon. Fails if the effect is already active on the user's side.": "使己方场地在5回合内处于白雾状态。处于白雾状态的场地上的宝可梦的能力变化不会被其他宝可梦下降。如果我方已处于白雾状态，使用失败。",
    "Causes the target to fall asleep. This move cannot be used successfully unless the user's current form, while considering Transform, is Darkrai.": "使目标陷入睡眠状态。仅在使用者为达克莱伊时奏效，否则使用失败。",
    "Raises a random stat by 2 stages as long as the stat is not already at stage 6. The user can choose to use this move on itself or an adjacent ally. Fails if no stat stage can be raised or if used on an ally with a substitute.": "令目标的攻击、防御、特攻、特防、速度、命中率、闪避率中随机一项能力提升2级。如果已经有能力不能提升，则它不会被随机选择。如果任何能力都不能提升则招式失败。如果目标具有替身，则招式使用失败，除非招式目标是自身。",
    "If the target is an ally, this move restores 1/2 of its maximum HP, rounded down, instead of dealing damage.": "如果目标是同伴，回复目标1/2的最大HP，而不是造成伤害。",
    "The power of the target's attack this turn is multiplied by 1.5 (this effect is stackable). Fails if there is no ally adjacent to the user or if the ally already moved this turn, but does not fail if the ally is using a two-turn move.": "使目标进入帮助状态。处于帮助状态的宝可梦在本回合结束前招式的威力提升50%（此状态可以叠加）。场上若没有同伴，使用失败。如果目标已经使用了招式，使用失败，但如果目标使用的是蓄力招式，不会失败。",
    "Raises the target's Attack and Defense by 1 stage. Fails if there is no ally adjacent to the user.": "提升目标1级攻击和防御。如果没有同伴，使用失败。",
    "Raises the Attack of the user and all allies 1 stage.": "提升自身和所有同伴1级攻击。",
    "If both the user and the target have not fainted, the target is forced to switch out and be replaced with a random unfainted ally. This effect fails if the target is under the effect of Ingrain, has the Suction Cups Ability, or this move hit a substitute.": "如果双方都没有陷入濒死，令对方队伍中随机一只没有陷入濒死状态的宝可梦强制替换上场。如果目标是其队伍中唯一没有陷入濒死状态的宝可梦、处于扎根状态、拥有吸盘特性或命中了替身，该招式的强制替换上场的效果无效。",
    "Raises the target's Special Defense by 1 stage. Fails if there is no ally adjacent to the user.": "提升目标1级特防。如果没有同伴，使用失败。",
    "Each Pokemon on the user's side restores 1/4 of its maximum HP, rounded half up, and has its status condition cured.": "回复使用者和同伴1/4的最大HP，并且治愈使用者和同伴的异常状态。向上取整一半。",
    "Boosts the user and its allies' Attack by 1 stage. BP scales with the base move's BP. This effect does not happen if the user is not Dynamaxed. If this move is used as a base move, it deals damage with a power of 0.": "威力由原本招式的威力决定。令使用者和同伴的攻击提升1级。如果使用者没有极巨化，不会有该效果。如果将此招式用作基础招式使用，威力为0。",
    "Power is equal to the base move's Max Move power. If this move is successful, the effect of Misty Terrain begins. This effect does not happen if the user is not Dynamaxed. If this move is used as a base move, it deals damage with a power of 0.": "威力由原本招式的威力决定。可在5回合内将脚下变成薄雾场地。如果使用者没有极巨化，不会有该效果。如果将此招式用作基础招式使用，威力为0。",
    "Power is equal to the base move's Max Move power. If this move is successful, the effect of Grassy Terrain begins. This effect does not happen if the user is not Dynamaxed. If this move is": "威力由原本招式的威力决定。可在5回合内将脚下变成青草场地。如果使用者没有极巨化，不会有该效果。如果将此招式用作基础招式使用，威力为0。",
    "Power is equal to the base move's Max Move power. If this move is successful, the effect of Hail begins. This effect does not happen if the user is not Dynamaxed. If this move is used as a base move, it deals damage with a power of 0.": "威力由原本招式的威力决定。可在5回合令天气变为冰雹。如果使用者没有极巨化，不会有该效果。如果将此招式用作基础招式使用，威力为0。",
    "Power is equal to the base move's Max Move power. If this move is successful, the effect of Electric Terrain begins. This effect does not happen if the user is not Dynamaxed. If this move is used as a base move, it deals damage with a power of 0.": "威力由原本招式的威力决定。可在5回合内将脚下变成电气场地。如果使用者没有极巨化，不会有该效果。如果将此招式用作基础招式使用，威力为0。",
    "Power is equal to the base move's Max Move power. If this move is successful, the effect of Rain Dance begins. This effect does not happen if the user is not Dynamaxed. If this move is used as a base move, it deals damage with a power of 0.": "威力由原本招式的威力决定。可在5回合内令天气变为下雨。如果使用者没有极巨化，不会有该效果。如果将此招式用作基础招式使用，威力为0。",
    "Power is equal to the base move's Max Move power. If this move is successful, the effect of Psychic Terrain begins. This effect does not happen if the user is not Dynamaxed. If this move is used as a base move, it deals damage with a power of 0.": "威力由原本招式的威力决定。可在5回合内将脚下变成精神场地。如果使用者没有极巨化，不会有该效果。如果将此招式用作基础招式使用，威力为0。",
    "Power is equal to the base move's Max Move power. If this move is successful, the effect of Sandstorm begins. This effect does not happen if the user is not Dynamaxed. If this move is used as a base move, it deals damage with a power of 0.": "威力由原本招式的威力决定。可在5回合内令天气变为沙暴。如果使用者没有极巨化，不会有该效果。如果将此招式用作基础招式使用，威力为0。",
    "Power is equal to the base move's Max Move power. If this move is successful, the effect of Sunny Day begins. This effect does not happen if the user is not Dynamaxed. If this move is used as a base move, it deals damage with a power of 0.": "威力由原本招式的威力决定。可在5回合内令天气变为大晴天。如果使用者没有极巨化，不会有该效果。如果将此招式用作基础招式使用，威力为0。",
    "Power is equal to the base move's Max Move power. If this move is successful, each Pokemon on the opposing side becomes confused, even if they have a substitute.": "威力由原本招式的威力决定。令目标陷入混乱状态，即使目标处于替身状态下。",
    "Power is equal to the base move's Max Move power. If this move is successful, there is a 50% chance the effect of Yawn begins on the target, even if it has a substitute.": "威力由原本招式的威力决定。有50%几率使目标陷入睡眠状态，即使目标处于替身状态下。",
    "Power is equal to the base move's Max Move power. If this move is successful, each Pokemon on the user's side restores 1/6 of its current maximum HP, even if they have a substitute.": "威力由原本招式的威力决定。回复我方所有宝可梦的HP，即使目标处于替身状态下。",
    "Power is equal to the base move's Max Move power. If this move is successful, each Pokemon on the opposing side loses 2 PP from its last move used, even if they have a substitute.": "威力由原本招式的威力决定。使对手最后使用的招式的PP减少2点，即使目标处于替身状态下。",
    "Power is equal to the base move's Max Move power. If this move is successful, each Pokemon on the opposing side either becomes poisoned or paralyzed, even if they have a substitute.": "威力由原本招式的威力决定。让对手所有宝可梦陷入中毒或麻痹状态，即使目标处于替身状态下。",
    "Power is equal to the base move's Max Move power. This move bypasses all protection effects, including Max Guard.": "威力由原本招式的威力决定。可穿透对手的守住进行攻击，包括极巨防壁。",
    "Power is equal to the base move's Max Move power. If this move is successful, each Pokemon on the user's side has its status condition cured, even if they have a substitute.": "威力由原本招式的威力决定。回复我方宝可梦的异常状态，即使目标处于替身状态下。",
    "Power is equal to the base move's Max Move power. If this move is successful, the evasiveness of each Pokemon on the opposing side is lowered by 1 stage, even if they have a substitute.": "威力由原本招式的威力决定。降低全体对手的闪避率1级，即使目标处于替身状态下。",
    "Power is equal to the base move's Max Move power. If this move is successful, the effect of Aurora Veil begins on the user's side.": "威力由原本招式的威力决定。使己方场地进入极光幕。",
    "Power is equal to the base move's Max Move power. If this move is successful, there is a 50% chance every Pokemon on the user's side has its Berry restored, even if they have a substitute.": "威力由原本招式的威力决定。有50%几率获得使用过的树果，即使处于替身状态下。",
    "Power is equal to the base move's Max Move power. If this move is successful, the Speed of each Pokemon on the opposing side is lowered by 2 stages, even if they have a substitute.": "威力由原本招式的威力决定。令全体对手宝可梦的速度降低2级，即使目标处于替身状态下。",
    "Power is equal to the base move's Max Move power. If this move is successful, each Pokemon on the opposing side becomes poisoned, even if they have a substitute.": "威力由原本招式的威力决定。使对手所有宝可梦陷入中毒状态，即使目标处于替身状态下。",
    "Power is equal to the base move's Max Move power. If this move is successful, the effect of Torment begins for each Pokemon on the opposing side, even if they have a substitute.": "威力由原本招式的威力决定。令全体对手宝可梦陷入无理取闹状态，即使目标处于替身状态下。",
    "Power is equal to the base move's Max Move power. If this move is successful, the effect of Gravity begins.": "威力由原本招式的威力决定。在5回合内场地重力发生变化。",
    "Power is equal to the base move's Max Move power. If this move is successful, for 4 turns each non-Rock-type Pokemon on the opposing side takes damage equal to 1/6 of its maximum HP, rounded down, at the end of each turn during effect, including the last turn.": "威力由原本招式的威力决定。在4～5回合内使非岩石属性的目标陷入束缚状态，每回合受到1/6最大HP的伤害并不能换下，向下取整。",
    "Power is equal to the base move's Max Move power. If this move is successful, for 4 turns each non-Fire-type Pokemon on the opposing side takes damage equal to 1/6 of its maximum HP, rounded down, at the end of each turn during effect, including the last turn.": "威力由原本招式的威力决定。在4～5回合内使非火属性的目标陷入束缚状态，每回合受到1/6最大HP的伤害并不能换下，向下取整。",
    "Power is equal to the base move's Max Move power. If this move is successful, each Pokemon on the opposing side becomes paralyzed, even if they have a substitute.": "威力由原本招式的威力决定。令全体对手宝可梦陷入麻痹状态，即使目标处于替身状态下。",
    "Power is equal to the base move's Max Move power. If this move is successful, each Pokemon on the user's side has their critical hit ratio raised by 1 stage, even if they have a substitute.": "威力由原本招式的威力决定。使己方全体击中要害等级提升1级，即使目标处于替身状态下。",
    "Power doubles if the user moves after the target this turn, including actions taken through Instruct or the Dancer Ability. Switching in does not count as an action.": "如果目标在使用者之前使用招式(包括号令和舞者使出的招式)，威力翻倍。",
    "Power doubles if the user moves after the target this turn. Switching in does not count as an action.": "如果目标在使用者之前使用招式，威力翻倍。",
    "Power doubles if the user moves after the target this turn. Switching in counts as an action.": "如果目标在使用者之前使用招式或替换，威力翻倍。",
    "Power is 160 regardless of the base move's Max Move power. This move and its effects ignore the Abilities of other Pokemon.": "此招式固定为160威力。无视对手特性进行攻击。",
    "Power is equal to the base move's Max Move power. If this move is successful, each Pokemon on the opposing side either falls asleep, becomes poisoned, or becomes paralyzed, even if they have a substitute.": "威力由原本招式的威力决定。使对方全员陷入中毒、麻痹或睡眠中任意一种异常状态，即使目标处于替身状态下。",
    "If the user is a Terapagos in Stellar Form, this move's type becomes Stellar and hits all opposing Pokemon.": "如果使用者是星晶形态的太乐巴戈斯，该招式变为星晶属性并攻击对方全体宝可梦。",
    "Power doubles if one of the user's party members fainted last turn.": "如果上一回合我方有宝可梦进入濒死状态，威力翻倍。",
    "Has a 100% chance to lower the target's Defense by 1 stage. Power is multiplied by 1.5 during Gravity's effect.": "100%几率令目标的防御降低1级。在重力效果期间，威力乘以1.5。",
    "Power doubles if the last move used by any Pokemon this turn was Fusion Flare.": "如果本回合上一个成功使用的招式是交错火焰，威力翻倍。",
    "Power doubles if the last move used by any Pokemon this turn was Fusion Bolt.": "如果本回合上一个成功使用的招式是交错闪电，威力翻倍。",
    "The target restores 1/2 of its maximum HP, rounded half up. If the terrain is Grassy Terrain, the target instead restores 2/3 of its maximum HP, rounded half down.": "回复目标最大HP的1/2。在青草场地状态下，回复目标最大HP的2/3。都是向下取整一半。",
    "Raises the user's Defense and Special Defense by 1 stage. The user's Stockpile count increases by 1. Fails if the user's Stockpile count is 3. The user's Stockpile count is reset to 0 when it is no longer active.": "令使用者的防御和特防提升1级，同时储存1层力量。如果已经储存了3次力量，无法继续使用蓄力提升能力。离场时重置为0。",
    "Has a 30% chance to burn the target. Power doubles if the target has a non-volatile status condition.": "有30%几率使目标陷入灼伤状态。如果目标处于异常状态，威力翻倍。",
    "The target's positive stat stages become negative and vice versa. Fails if all of the target's stat stages are 0.": "将目标的全部能力变化数值变为其相反数。如果目标的全部能力变化数值皆为0，使用失败。",
    "Has a 50% chance to poison the target. Power doubles if the target is already poisoned.": "有30%几率使目标陷入中毒状态。如果目标处于异常状态，威力翻倍。",
    "Prevents all active Pokemon from switching next turn. A Pokemon can still switch out if it is holding Shed Shell or uses Baton Pass, Flip Turn, Parting Shot, Teleport, U-turn, or Volt Switch. Fails if the effect is already active.": "在场的非幽灵属性宝可梦无法替换。如果目标持有美丽空壳或使用了接棒、快速折返、抛下狠话、急速折返或伏特替换，可以正常替换。",
    "Prevents all active Pokemon from switching next turn. A Pokemon can still switch out if it is holding Shed Shell or uses Baton Pass, Parting Shot, U-turn, or Volt Switch. Fails if the effect is already active.": "在场的非幽灵属性宝可梦无法替换。如果目标持有美丽空壳或使用了接棒、抛下狠话、急速折返或伏特替换，可以正常替换。",
    "The user and its party members are protected from non-damaging attacks made by other Pokemon, including allies, during this turn. Fails if the user moves last this turn or if this move is already in effect for the user's side.": "在当回合内，使我方场地进入戏法防守状态，保护我方全体宝可梦不受到来自对手的大部分变化招式的影响。如果在本回合使用者最后行动或我方已进入此状态，则招式会失败。",
    "The target is cured if it has a non-volatile status condition. If the target was cured, the user restores 1/2 of its maximum HP, rounded down.": "治愈目标的异常状态。如果成功治愈了异常状态，则恢复使用者1/2的最大HP，向下取整。",
    "Causes the target to become a Psychic type. Fails if the target is an Arceus or a Silvally, if the target is already purely Psychic type, or if the target is Terastallized.": "将目标的属性变成超能力属性。无法改变拥有多属性、AR系统特性、只有超能力属性或太晶化的宝可梦的属性。",
    "Causes the target to become a Psychic type. Fails if the target is an Arceus or a Silvally, or if the target is already purely Psychic type.": "将目标的属性变成超能力属性。无法改变拥有多属性、AR系统特性或只有超能力属性的宝可梦的属性。",
    "Causes the target to become a Water type. Fails if the target is an Arceus or a Silvally, or if the target is already purely Water type.": "将目标的属性变成水属性。无法改变拥有多属性、AR系统特性或只有水属性的宝可梦的属性。",
    "If this move is successful, it causes the target's Speed to be lowered by 1 stage at the end of each turn for 3 turns.": "如果成功使出该招式，在包含当前回合的3回合内，每回合结束时降低1级速度。",
    "Hits twice, with each hit having a 20% chance to poison the target. If the first hit breaks the target's substitute, it will take damage for the second hit.": "连续攻击2次，每次攻击有20%几率使目标陷入中毒状态。如果第一下打破了替身，招式会继续攻击。",
    "Causes the target's move to become Electric type this turn. Among effects that can change a move's type, this effect happens last. Fails if the target already moved this turn.": "使目标进入输电状态，将目标接下来使用的招式属性变成电属性。如果目标已经行动，使用失败。",
    "If the target uses a Fire-type move this turn, it is prevented from executing and the target loses 1/4 of its maximum HP, rounded half up. This effect does not happen if the Fire-type move is prevented by Primordial Sea.": "使目标陷入粉尘状态，持续1回合，在回合结束时消失。处于粉尘状态的宝可梦使用火属性招式时，不但要受到1/4最大HP的伤害，招式也会中止。如果始源之海扑灭了该火属性招式，使用失败。",
    "All active Pokemon consume their held Berries. This effect is not prevented by substitutes, the Klutz or Unnerve Abilities, or the effects of Embargo or Magic Room. Fails if no active Pokemon is holding a Berry.": "使场上所有的宝可梦携带的树果都会被立即消耗掉，不受查封、魔法空间、笨拙或紧张感的影响。如果场上没有宝可梦携带树果，使用失败。",
    "The user swaps its Defense and Special Defense stat stage changes with the target.": "自身与目标互换防御能力等级和特防能力等级。",
    "The user swaps its Attack and Special Attack stat stage changes with the target.": "自身与目标互换攻击能力等级和特攻能力等级。",
    "The user swaps its Speed stat with the target. Stat stage changes are unaffected.": "自身与目标互换速度。速度能力等级不受影响。",
    "Deals 20 HP of damage to the target.": "造成20点固定伤害。",
    "Deals 20 HP of damage to the target. This move ignores type immunity.": "造成20点固定伤害。可以命中幽灵属性的宝可梦。",
    "The user and the target have their Defense and Special Defense stats set to be equal to the average of the user and the target's Defense and Special Defense stats, respectively, rounded down. Stat stage changes are unaffected.": "将使用者的防御和特防与目标的防御和特防相加之后取其算术平均数，相加时不计算能力变化。向下取整。",
    "The user and the target have their Attack and Special Attack stats set to be equal to the average of the user and the target's Attack and Special Attack stats, respectively, rounded down. Stat stage changes are unaffected.": "将使用者的攻击和特防与目标的攻击和特攻相加之后取其算术平均数，相加时不计算能力变化。向下取整。",
    "Raises the Defense and Special Defense of Pokemon on the user's side with the Plus or Minus Abilities by 1 stage.": "令己方所有特性为正电或负电的宝可梦的防御和特防提升1级。",
    "This move does not check accuracy and hits even if the target is using Dig or Fly.": "攻击必定命中，即使目标处于挖洞或飞翔状态。",
    "If this move is successful, the user must recharge on the following turn and cannot select a move, unless the target or its substitute was knocked out by this move.": "使用后下一回合无法使用招式、使用道具或替换宝可梦。如果此次攻击令目标陷入濒死，下回合不会被暂停一次。",
    "If the target lost HP, the user takes recoil damage equal to 1/4 the HP lost by the target, rounded down, but not less than 1 HP. If this move breaks the target's substitute, the user does not take any recoil damage.": "如果目标失去了HP，使用者承受对目标造成伤害的1/4的伤害，向上取整一半，但不小于1。如果此次攻击打破了替身，使用者不会承受任何伤害。",
    "If the target lost HP, the user takes recoil damage equal to 1/3 the HP lost by the target, rounded down, but not less than 1 HP. If this move breaks the target's substitute, the user does not take any recoil damage.": "如果目标失去了HP，使用者承受对目标造成伤害的1/3的伤害，向上取整一半，但不小于1。如果此次攻击打破了替身，使用者不会承受任何伤害。",
    "If the target lost HP, the user takes recoil damage equal to 1/2 the HP lost by the target, rounded down, but not less than 1 HP. If this move breaks the target's substitute, the user does not take any recoil damage.": "如果目标失去了HP，使用者承受对目标造成伤害的1/2的伤害，向上取整一半，但不小于1。如果此次攻击打破了替身，使用者不会承受任何伤害。",
    "If the target lost HP, the user takes recoil damage equal to 1/4 the HP lost by the target, rounded down, but not less than 1 HP.": "如果目标失去了HP，使用者承受对目标造成伤害的1/4的伤害，向上取整一半，但不小于1。",
    "If the target lost HP, the user takes recoil damage equal to 1/3 the HP lost by the target, rounded down, but not less than 1 HP.": "如果目标失去了HP，使用者承受对目标造成伤害的1/3的伤害，向上取整一半，但不小于1。",
    "If the target lost HP, the user takes recoil damage equal to 1/2 the HP lost by the target, rounded down, but not less than 1 HP.": "如果目标失去了HP，使用者承受对目标造成伤害的1/2的伤害，向上取整一半，但不小于1。",
    "Has a 10% chance to burn the target. If the target lost HP, the user takes recoil damage equal to 1/3 the HP lost by the target, rounded down, but not less than 1 HP.": "有10%几率使目标陷入灼伤状态。如果目标失去了HP，使用者承受对目标造成伤害的1/3的伤害，向上取整一半，但不小于1。",
    "This attack charges on the first turn and executes on the second.": "在第一回合进行蓄力，第二回合攻击目标。",
    "Deals damage to the target equal to a random number from 1 to (user's level * 1.5 - 1), rounded down, but not less than 1 HP.": "对目标造成的伤害 = 1～（使用者等级×1.5-1）的随机数。向下取整，但不小于1。",
    "Deals damage to the target equal to (user's level) * (X + 50) / 100, where X is a random number from 0 to 100, rounded down, but not less than 1 HP.": "对目标造成使用者等级×（0.5～1.5之间随机值）的伤害。向下取整，但不小于1。",
    "Power is equal to 60+(X*20), where X is the target's total stat stage changes that are greater than 0, but not more than 200 power.": "攻击目标造成伤害。威力基数为60；目标的能力（不包括命中率与闪避率）每上升1级，威力提升20；最高为200。",
    "Causes the target to become a Water type. Fails if the target is an Arceus or a Silvally, or if the target is already purely Water type.": "将目标的属性变成水属性。无法改变拥有多属性、AR系统特性的宝可梦的属性。",
    "Prevents the target from using non-damaging moves for its next three turns.": "在3回合内，使目标处于挑衅状态，不能使用变化招式。",
    "Every Pokemon in the user's party is cured of its non-volatile status condition. Active Pokemon with the Soundproof Ability are also cured.": "治愈己方队伍中全部宝可梦的异常状态。具有隔音特性的宝可梦也可以治愈。",
    "The user restores 1/2 of its maximum HP if no weather conditions are in effect, 2/3 of its maximum HP if the weather is Sunny Day, and 1/4 of its maximum HP if the weather is Hail, Rain Dance, or Sandstorm, all rounded half down.": "如果没有天气，恢复使用者1/2的最大HP；如果天气是晴天，则恢复2/3的最大HP；如果天气为冰雹、下雨或沙暴，则恢复1/4的最大HP的，全部向下取整。",
    "Has a 30% chance to confuse the target. This move can hit a target using Bounce, Fly, or Sky Drop, or is under the effect of Sky Drop. If the weather is Rain Dance, this move does not check accuracy. If the weather is Sunny Day, this move's accuracy is 50%.": "有30%几率使目标陷入混乱状态。可以击中处于飞翔、弹跳和自由落体状态的宝可梦。天气为大晴天时，命中降低至50%。天气为下雨时必定命中。",
    "Has a 30% chance to paralyze the target. This move can hit a target using Bounce, Fly, or Sky Drop, or is under the effect of Sky Drop. If the weather is Rain Dance, this move does not check accuracy. If the weather is Sunny Day, this move's accuracy is 50%.": "有30%几率使目标陷入麻痹状态。可以击中处于飞翔、弹跳和自由落体状态的宝可梦。天气为大晴天时，命中降低至50%。天气为下雨时必定命中。",
    "This attack charges on the first turn and executes on the second. Power is halved if the weather is Hail, Rain Dance, or Sandstorm. If the user is holding a Power Herb or the weather is Sunny Day, the move completes in one turn.": "在第一回合进行蓄力，第二回合攻击目标。如果当天气为大晴天或携带了强力香草，可以立刻结束蓄力，在第一回合发动招式。在天气为下雨、沙暴、冰雹或下雪时且自身没有携带万能伞，威力减半。",
    "If this move is successful, the effects of Leech Seed and binding moves end against the user, and all hazards are removed from the user's side of the field.": "只要此招式成功使出，会移除己方场地上的入场可生效的状态；摆脱自身束缚、寄生种子状态。",
    "The user restores 1/2 of its maximum HP if no weather conditions are in effect, 2/3 of its maximum HP if the weather is Sunny Day, and 1/4 of its maximum HP if the weather is Hail, Rain Dance, or Sandstorm, all rounded down.": "如果没有天气，自身回复最大生命值的1/2，如果天气是晴天，则恢复最大HP的2/3，如果天气为冰雹、下雨或沙暴，则恢复最大HP的1/4，全部向下取整。",
    "Fails if the target did not select a physical or special attack for use this turn, or if the target moves before the user.": "如果目标没有使用攻击招式或比使用者更快使出招式，使用失败。",
    "The user loses its focus and does nothing if it is hit by a damaging attack this turn before it can execute the move, but it still loses PP.": "如果在发动攻击前受到伤害，则招式会失败且会失去PP。",
    "At the end of the next turn, the Pokemon at the user's position has 1/2 of its maximum HP restored to it, rounded down. Fails if this move is already in effect for the user's position.": "陷入祈愿状态，使用祈愿后的下一回合，HP会回复。下回合结束时，恢复换上场的宝可梦回复自己的1/2最大HP。",
    "The target's held item is lost for the rest of the battle, unless it has the Sticky Hold Ability. During the effect, the target cannot gain a new item by any means.": "如果目标没有黏着特性且使用者没有濒死，则目标在战斗结束前失去其携带物品。在效果期间，无法获得新的物品。",
    "The target's held item is lost for the rest of the battle, unless the item is a Griseous Orb or the target has the Multitype or Sticky Hold Abilities. During the effect, the target cannot obtain a new item by any means.": "如果目标持有可被拍落的携带物品并且没有黏着特性且使用者没有濒死，则目标在战斗结束前失去其携带物品。因拍落而失去的物品无法通过任何方式回收。无法拍落白金宝珠。",
    "Has a 10% chance to paralyze the target. If the target lost HP, the user takes recoil damage equal to 1/3 the HP lost by the target, rounded down, but not less than 1 HP.": "有10%几率使目标陷入麻痹状态。如果目标失去了HP，使用者承受对目标造成伤害的1/3的伤害，向上取整一半，但不小于1。",
    "Power doubles if a weather condition is active, and this move's type changes to match. Ice type during Hail, Water type during Rain Dance, Rock type during Sandstorm, and Fire type during Sunny Day.": "如果有天气，威力翻倍。该招式的属性会根据天气不同而变化：天气为冰雹时为冰属性，下雨时为水属性，沙暴时为岩石属性，大晴天时为火属性。",
    "This attack charges on the first turn and executes on the second. Damage is halved if the weather is Hail, Rain Dance, or Sandstorm. If the user is holding a Power Herb or the weather is Sunny Day, the move completes in one turn.": "在第一回合进行蓄力，第二回合攻击目标。如果当天气为大晴天状态或携带了强力香草，可以立刻结束蓄力，在第一回合发动招式。在天气为下雨、沙暴、冰雹状态时，威力减半。",
    "Has a 30% chance to make the target flinch. Damage doubles and no accuracy check is done if the target has used Minimize while active.": "有30%几率使目标陷入畏缩状态。如果目标处于变小状态，威力翻倍且必定命中。",
    "Has a higher chance for a critical hit. This move cannot be redirected to a different target by any effect.": "攻击原本选定的目标。容易击中要害。",
    "Has a 20% chance to burn the target. If the weather is Primordial Sea or Rain Dance, this move does not check accuracy. If this move is used against a Pokemon holding Utility Umbrella, this move's accuracy remains at 80%.": "有20%几率使目标陷入灼伤状态。天气为下雨或大雨时，热沙风暴一定会命中，除非目标正在使用蓄力的招式并不在场地上。如果目标携带了万能伞，此招式的命中率为80%。",
    "Has a 30% chance to lower the target's Speed by 1 stage. If the weather is Primordial Sea or Rain Dance, this move does not check accuracy. If this move is used against a Pokemon holding Utility Umbrella, this move's accuracy remains at 80%.": "有30%几率令目标的速度降低1级。天气为下雨或大雨时，热沙风暴一定会命中，除非目标正在使用蓄力的招式并不在场地上。如果目标携带了万能伞，此招式的命中率为80%。",
    "Has a 20% chance to paralyze the target. If the weather is Primordial Sea or Rain Dance, this move does not check accuracy. If this move is used against a Pokemon holding Utility Umbrella, this move's accuracy remains at 80%.": "有20%几率使目标陷入麻痹状态。天气为下雨或大雨时，热沙风暴一定会命中，除非目标正在使用蓄力的招式并不在场地上。如果目标携带了万能伞，此招式的命中率为80%。",
    "Power doubles if the target is using Bounce, Fly, or Sky Drop, or is under the effect of Sky Drop.": "如果目标正处于弹跳、飞翔或自由落体状态，威力翻倍。",
    "For 5 turns, all active Pokemon have their Defense and Special Defense stats swapped. Stat stage changes are unaffected. If this move is used during the effect, the effect ends.": "5回合中，所有场上的宝可梦自身的防御与特防能力值交换，不影响能力等级。在奇妙空间效果存在的情况下再次使用奇妙空间，会结束奇妙空间的效果。",
    "The target is unaffected by this move unless it is asleep. The user recovers 1/2 the HP lost by the target, rounded half up. If Big Root is held by the user, the HP recovered is 1.3x normal, rounded half down.": "既未处于睡眠状态又没有特性绝对睡眠的宝可梦不受食梦影响。使用者将造成伤害的50%转化为自身的HP，向上取整一半。携带大根茎时，恢复量提升30%，向下取整一半。",
    "Has a 20% chance to make the target flinch. Damage doubles and no accuracy check is done if the target has used Minimize while active.": "有20%几率使目标陷入畏缩状态。如果目标处于变小状态，威力翻倍且必定命中。",
    "Whether or not this move is successful and even if it would cause fainting, the user loses 1/2 of its maximum HP, rounded up, unless the user has the Magic Guard Ability.": "对使用者造成最大HP的1/2（向上取整）伤害。即使招式未命中、HP不足1/2，使用者仍然会受到伤害，除非使用者拥有魔法防守特性。",
    "This move summons Light Screen for 5 turns upon use.": "使己方场地变为光墙状态。",
    "This move summons Reflect for 5 turns upon use.": "使己方场地变为反射壁状态。",
    "Raises the user's Defense by 1 stage. As long as the user remains active, the power of the user's Ice Ball and Rollout will be doubled (this effect is not stackable).": "令使用者的防御提升1级。使用冰球和滚动进行攻击的威力将加倍(这个效果不会叠加)。",
    "Causes the Grass type to be added to the target, effectively making it have two or three types. Fails if the target is already a Grass type. If Trick-or-Treat adds a type to the target, it replaces the type added by this move and vice versa.": "如果目标没有草属性，追加第二或第三属性草属性。目标拥有草属性时，招式使用失败。进入万圣夜状态时会解除森林诅咒状态，反之亦然。",
    "Has a 30% chance to confuse the target. If this attack is not successful, the user loses half of its maximum HP, rounded down, as crash damage. Pokemon with the Magic Guard Ability are unaffected by crash damage.": "有30%几率使目标陷入混乱状态。如果招式未命中或因为属性相性或特性而没有产生效果，自身承受最大HP的1/2（向下取整）的反作用力伤害，除非使用者拥有魔法防守特性。",
    "Causes the target to take its turn after all other Pokemon this turn, no matter the priority of its selected move. Fails if the target already moved this turn.": "如果对手此回合还没有行动，该招式命中后对手变为最后行动且不根据优先度使用招式顺序。如果目标此回合已经行动，使用失败。",
    "Causes the target to become a Water type. Fails if the target is an Arceus or a Silvally, if the target is already purely Water type, or if the target is Terastallized.": "将目标的属性变成水属性。无法改变拥有多属性、AR系统特性、只有水属性或太晶化的宝可梦的属性。",
    "Raises the user's Attack and Special Attack by 1 stage. If the weather is Sunny Day or Desolate Land, this move raises the user's Attack and Special Attack by 2 stages.": "令使用者的攻击和特攻提升1级，如果天气是大日照或大晴天，改为提升2级。",
    "The user swaps positions with its ally. Fails if the user is the only Pokemon on its side.": "在双打对战中与己方目标交换位置；目标位置没有宝可梦时使用该招式会失败。",
    "The power of this move depends on (user's current Speed / target's current Speed), rounded down. Power is equal to 150 if the result is 4 or more, 120 if 3, 80 if 2, 60 if 1, 40 if less than 1. If the target's current Speed is 0, this move's power is 40.": "此招式的威力=（使用者的当前速度/目标的当前速度），向下取整。如果结果为4或更大，则威力为150；如果为3，则威力为120；如果为2，则威力为80；如果为1，则威力为60；如果小于1，威力为40。",
    "The power of this move is 20 if X is 33 to 48, 40 if X is 17 to 32, 80 if X is 10 to 16, 100 if X is 5 to 9, 150 if X is 2 to 4, and 200 if X is 0 or 1, where X is equal to (user's current HP * 48 / user's maximum HP), rounded down.": "威力和自身剩下的HP有关(向下取整)。HP≥68.75%，威力为20；35.42%≤HP＜68.75%，威力为40；20.83%≤HP＜35.42%，威力为80；10.42%≤HP＜20.83%，威力为100；4.17%≤HP＜10.42%，威力为150；0＜HP＜4.17%，威力为200。",
    "Power is equal to 120 * (target's current HP / target's maximum HP), rounded half down, but not less than 1.": "威力 = 120 × 当前HP/最大HP。向下取整一半，但不小于1。",
    "Has a 30% chance to make the target flinch. Fails if the user is not asleep.": "有30%几率使目标陷入畏缩状态。如果使用者未处于睡眠，使用失败。",
    "The user's non-volatile status condition is transferred to the target, and the user is then cured. Fails if the user has no non-volatile status condition or if the target already has one.": "将自身的异常状态转移给目标，自身解除异常状态。如果自身没有异常状态或目标已有异常状态，使用失败。",
    "Raises the Defense of all active Grass-type Pokemon by 1 stage. Fails if there are no active Grass-type Pokemon.": "令在场的所有草属性宝可梦的防御提升1级。如果没有草属性宝可梦在场，使用失败。",
    "If this attack does not miss and whether or not the target is immune, the effects of Reflect and Light Screen end for the opponent's side of the field before damage is calculated.": "如果成功使出该招式，即使免疫此攻击也会在造成伤害之前破坏对方场地的光墙和反射壁。",
    "If this move is successful, the effects of Leech Seed and binding moves end for the user, and Spikes are removed from the user's side of the field.": "如果成功使出该招式，移除己方场地上的撒菱并摆脱寄生种子的束缚。",
    "Has a 100% chance to steal the target's held item if the user is not holding one. The target's item is not stolen if it is a Mail.": "如果自身没有携带物品，100%几率窃取目标的物品。如果目标携带的是邮件，则不会窃取。",
    "The user faints after using this move. The target's Defense is halved during damage calculation.": "自身陷入濒死状态然后攻击目标造成伤害，将目标的防御能力值减半计算。",
    "Every Pokemon in the user's party is cured of its non-volatile status condition.": "治愈己方队伍所有宝可梦的异常状态。",
    "If this attack is not successful and the target was not immune, the user loses HP equal to 1/8 the damage the target would have taken, rounded down, but not less than 1 HP, as crash damage.": "如果攻击没有产生效果，自身承受本应造成伤害的1/8，向下取整。",
    "If the target lost HP, the user takes recoil damage equal to 1/4 the HP lost by the target, rounded down, but not less than 1 HP. If this move hits a substitute, the recoil damage is always 1 HP.": "如果目标失去了HP，使用者承受对目标造成伤害的1/4的伤害，向上取整一半，但不小于1。如果此次攻击打破了替身，使用者只需承受1点伤害。",
    "If the target lost HP, the user takes recoil damage equal to 1/3 the HP lost by the target, rounded down, but not less than 1 HP. If this move hits a substitute, the recoil damage is always 1 HP.": "如果目标失去了HP，使用者承受对目标造成伤害的1/3的伤害，向上取整一半，但不小于1。如果此次攻击打破了替身，使用者只需承受1点伤害。",
    "If the target lost HP, the user takes recoil damage equal to 1/2 the HP lost by the target, rounded down, but not less than 1 HP. If this move hits a substitute, the recoil damage is always 1 HP.": "如果目标失去了HP，使用者承受对目标造成伤害的1/2的伤害，向上取整一半，但不小于1。如果此次攻击打破了替身，使用者只需承受1点伤害。",
    "If the target switches out this turn, this move hits it before it leaves the field with doubled power and the user's turn is over.": "如果目标在这个回合离场，此招式会在其离场之前击中它且伤害翻倍。结束使用者的回合。",
    "This attack charges on the first turn and executes on the second. Damage is halved if the weather is Rain Dance. If the weather is Sunny Day, the move completes in one turn.": "在第一回合进行蓄力，第二回合攻击目标。如果天气为大晴天，可以立刻结束蓄力，在第一回合发动招式。如果天气为下雨，威力减半。",
    "Has a 30% chance to paralyze the target. This move can hit a target using Fly. If the weather is Rain Dance, this move does not check accuracy. If the weather is Sunny Day, this move's accuracy is 50%.": "有30%几率使目标陷入麻痹状态。如果天气为雨天，此招式必定命中；如果天气为大晴天，命中率为50%。",
    "For 5 turns, the user and its party members have their Defense doubled. Critical hits ignore this effect. Fails if the effect is already active on the user's side.": "5回合内我方宝可梦受到的物理招式伤害减半。击中要害时无视此效果。如果我方已处于此效果，使用失败。",
    "For 5 turns, the user and its party members have their Sp. Def doubled. Critical hits ignore this effect. Fails if the effect is already active on the user's side.": "5回合内我方宝可梦受到的特殊招式伤害减半。击中要害时无视此效果。如果我方已处于此效果，使用失败。",
    "Has a higher chance for a critical hit. This attack charges on the first turn and executes on the second.": "容易击中要害。在第一回合进行蓄力，第二回合攻击目标。",
    "The user faints after using this move, unless this move broke the target's substitute. The target's Defense is halved during damage calculation.": "自身陷入濒死状态并攻击目标造成伤害，将目标的防御能力值减半计算。如果命中了替身，不会陷入濒死。",
    "The user faints after using this move, unless the target's substitute was broken by the damage. The target's Defense is halved during damage calculation.": "自身陷入濒死状态并攻击目标造成伤害，将目标的防御能力值减半计算。如果打破了替身，不会陷入濒死。",
    "Deals damage to the target equal to the user's level. This move ignores type immunity.": "对目标造成与自身等级相等的伤害。可以击中属性相性为0的目标。",
    "This move summons Leech Seed on the foe.": "使对手陷入寄生种子状态。",
    "The target makes its move immediately after the user this turn, no matter the priority of its selected move. Fails if the target would have moved next anyway, or if the target already moved this turn.": "目标将会在使用者之后立刻行动,无视优先度的影响。如果目标当回合已经使用过招式或使用过后顺序没产生变化，使用失败。",
    "The user transforms into the target. The target's current stats, stat stages, types, moves, DVs, species, and sprite are copied. The user's level and HP remain the same and each copied move receives only 5 PP. This move can hit a target using Dig or Fly.": "使用者变身成目标宝可梦。目标的当前能力、能力等级、属性、招式、特性、重量和种族都会被复制。使用者的HP不变，复制的招式均只有5点PP。此招式可以命中正处于挖洞或飞翔的目标。",
    "Hits two to five times. Has a 3/8 chance to hit two or three times, and a 1/8 chance to hit four or five times. Damage is calculated once for the first hit and used for every hit. If one of the hits breaks the target's substitute, the move ends.": "一回合内连续攻击2～5次。命中时，各有3/8的几率攻击2或3次，1/8的几率攻击4或5次。如果其中一下打破了替身，招式立即结束。",
    "The power of this move is based on the amount of PP remaining after normal PP reduction and the Pressure Ability resolve. 200 power for 0 PP, 80 power for 1 PP, 60 power for 2 PP, 50 power for 3 PP, and 40 power for 4 or more PP.": "威力取决于该招式剩余的PP。剩余1PP为200威力；剩余2PP为80威力；剩余3PP为60威力；剩余4PP为50威力；剩余4以上为40威力。",
    "The user prevents all opposing Pokemon from using any moves that the user also knows as long as the user remains active. Z-Powered moves can still be selected and executed during this effect.": "自身处于封印状态期间，对手的任何宝可梦不能使出与自身学会的任一招式相同的招式。封印状态期间，Z招式仍然可以正常选择并使用。",
    "If this move is successful, it deals damage or heals the target. 40% chance for 40 power, 30% chance for 80 power, 10% chance for 120 power, and 20% chance to heal the target by 1/4 of its maximum HP, rounded down.": "随机选择如下效果：40%几率以40威力攻击对手；30%几率以80威力攻击对手；10%几率以120威力攻击对手；20%几率回复对手1/4的最大HP(向下取整)。",
    "Raises the user's Special Defense by 1 stage. If the user uses an Electric-type attack on the next turn, its power will be doubled.": "令使用者的特防提升1级。下次使用的电属性招式威力翻倍。",
    "Until the end of the next turn, the user's attacks will be critical hits.": "下一回合结束前，招式必定会击中要害。",
    "For 5 turns, all Fire-type attacks used by any active Pokemon have their power multiplied by 0.33. Fails if this effect is already active.": "在5回合内，在场宝可梦的火属性的招式威力变为原本的33%。如果此状态已激活，使用失败。",
    "For 5 turns, all Electric-type attacks used by any active Pokemon have their power multiplied by 0.33. Fails if this effect is already active.": "在5回合内，在场宝可梦的电属性的招式威力变为原本的33%。如果此状态已激活，使用失败。",
    "The target loses its held item if it is a Berry or a Gem. This move cannot cause Pokemon with the Sticky Hold Ability to lose their held item. Items lost to this move cannot be regained with Recycle or the Harvest Ability.": "如果对手持有树果或宝石，道具会被烧毁。被烧尽的道具不能被回收利用或收获特性收回。",
    "This move calls another move for use based on the battle terrain. Tri Attack on the regular Wi-Fi terrain, Thunderbolt during Electric Terrain, Moonblast during Misty Terrain, Energy Ball during Grassy Terrain, and Psychic during Psychic Terrain.": "根据场地的不同使出另一个招式。对应使出的招式变化如下：无场地使出三重攻击，电气场地使出十万伏特，青草场地使出能量球，薄雾场地使出月亮之力，精神场地使出精神强念。",
    "Raises the Attack and Special Attack of all grounded Grass-type Pokemon on the field by 1 stage.": "令场上所有的地面上的草属性宝可梦的攻击和特攻提升1级。",
    "The type and power of this move depend on the user's held Berry, and the Berry is lost. Fails if the user is not holding a Berry, if the user has the Klutz Ability, or if Embargo or Magic Room is in effect for the user.": "威力和属性取决于这只宝可梦身上的树果。树果在使用后会消失。如果自身没有携带树果，或处于不能使用树果的状态（例如处于查封状态、紧张感特性、拍落状态、笨拙特性的影响下），则招式使用失败，树果不会消耗。",
    "Raises the Attack and Special Attack of Pokemon on the user's side with the Plus or Minus Abilities by 1 stage.": "令己方所有特性为正电或负电的宝可梦的攻击和特攻提升1级。",
    "Lowers the target's Attack, Special Attack, and Speed by 1 stage if the target is poisoned. Fails if the target is not poisoned.": "令中毒的目标的攻击、特攻和速度降低1级。如果目标未中毒，使用失败。",
    "The target is immune if it does not share a type with the user.": "对没有任一相同属性的目标无效。",
    "Power doubles if the target is paralyzed. If the user has not fainted, the target is cured of paralysis.": "如果目标处于麻痹状态，招式的威力加倍，并且解除目标的麻痹状态。",
    "For 2 turns, the target cannot use sound-based moves. Z-Powered sound moves can still be selected and executed during this effect.": "在2回合内，目标无法使出声音的招式。Z招式不受此状态影响。",
    "Has a higher chance for a critical hit. This attack charges on the first turn and executes on the second. If the user is holding a Power Herb, the move completes in one turn.": "容易击中要害。在第一回合进行蓄力，第二回合攻击目标。如果携带了强力香草，可以立刻结束蓄力，在第一回合发动招式。",
    "The user uses the last move used by the target. The copied move is used against that target, if possible. Fails if the target has not made a move, or if the last move used cannot be copied by this move.": "使用目标最后使用过的招式。使出的招式目标为单体选择时，目标为鹦鹉学舌的招式目标。如果目标没有使用招式或使用的招式无法复制，使用失败。",
    "Raises the target's Attack by 2 stages and confuses it. This move will miss if the target's Attack cannot be raised.": "提升目标2级攻击并令其陷入混乱状态。如果目标的攻击无法提升，使用失败。",
    "The target is forced to switch out and be replaced with a random unfainted ally. Fails if the target is the last unfainted Pokemon in its party, or if the user moves before the target.": "令对方队伍中随机一只没有陷入濒死状态的宝可梦强制替换上场。如果目标是其队伍中唯一没有陷入濒死状态的宝可梦或使用者比目标先行动，使用失败。",
    "Deals damage to the target equal to half of its current HP, rounded down, but not less than 1 HP. This move ignores type immunity.": "对目标造成目标当前HP1/2（向下取整）的伤害。至少造成1伤害。不受属性相性影响。",
    "Hits twice, with the second hit having a 20% chance to poison the target. If the first hit breaks the target's substitute, the move ends.": "连续攻击2次，第二次攻击有20%几率使目标陷入中毒状态。如果第一下打破了替身，招式会立即停止。",
    "Hits twice. Damage is calculated once for the first hit and used for both hits. If the first hit breaks the target's substitute, the move ends.": "连续攻击2次，第二次攻击和第一次的伤害相同。如果第一下打破了替身，招式会立即停止。",
    "The user restores 1/2 of its maximum HP, rounded down. Fails if (user's maximum HP - user's current HP + 1) is divisible by 256.": "自身回复1/2最大HP，向下取整。如果使用者的最大生命值-使用者的当前生命值+1可被256整除，使用失败。",
    "While the user remains active, its Defense is doubled when taking damage. Critical hits ignore this protection. This effect can be removed by Haze.": "使用者在场时受到的物理招式伤害减半。击中要害时无视此效果。黑雾可以清除此效果。",
    "While the user remains active, its Special is doubled when taking damage. Critical hits ignore this effect. If any Pokemon uses Haze, this effect ends.": "使用者在场时受到的特殊招式伤害减半。击中要害时无视此效果。黑雾可以清除此效果。",
    "While the user remains active, its chance for a critical hit is quartered. Fails if the user already has the effect. If any Pokemon uses Haze, this effect ends.": "使用者的命中要害率改为四分之一。离场后效果消失。黑雾可以清除此效果。",
    "While the user remains active, it is protected from having its stat stages lowered by other Pokemon, unless caused by the secondary effect of a move. Fails if the user already has the effect. If any Pokemon uses Haze, this effect ends.": "使用者的的能力变化不会被其他宝可梦下降。如果使用者已经处于此效果，使用失败。黑雾可以清除此效果。",
    "If the target lost HP, the user takes recoil damage equal to 1/4 the HP lost by the target, rounded half up, but not less than 1 HP. If this move hits a substitute, the recoil damage is always 1 HP.": "如果目标失去了HP，使用者承受对目标造成伤害的1/4的伤害，向上取整一半，但不小于1。如果此次攻击命中了替身，使用者只需承受1点伤害。",
    "If the target lost HP, the user takes recoil damage equal to 1/3 the HP lost by the target, rounded half up, but not less than 1 HP. If this move hits a substitute, the recoil damage is always 1 HP.": "如果目标失去了HP，使用者承受对目标造成伤害的1/3的伤害，向上取整一半，但不小于1。如果此次攻击命中了替身，使用者只需承受1点伤害。",
    "If the target lost HP, the user takes recoil damage equal to 1/2 the HP lost by the target, rounded half up, but not less than 1 HP. If this move hits a substitute, the recoil damage is always 1 HP.": "如果目标失去了HP，使用者承受对目标造成伤害的1/2的伤害，向上取整一半，但不小于1。如果此次攻击命中了替身，使用者只需承受1点伤害。",
    "For 3 to 5 turns, prevents the target from using non-damaging moves.": "在3～5回合内，使目标不能使用变化招式。",
    "If this attack misses the target, the user takes 1 HP of crash damage. If the user has a substitute, the crash damage is dealt to the target's substitute if it has one, otherwise no crash damage is dealt.": "如果攻击没有产生效果，自身承受1点伤害。如果使用者处于替身状态则不会承受伤害。如果使用者和目标均处于替身状态，伤害由目标的替身承担。",
    "The user steals the target's held Berry if it is holding one and eats it immediately, gaining its effects unless the user's item is being ignored. Items lost to this move can be regained with Recycle.": "如果目标携带了树果，会消耗目标的树果并获得该树果的效果。若使用该招式的宝可梦处于查封状态或特性为笨拙，仍然能消耗目标的树果，但不会获得树果的效果。通过此招式丢失的树果可以使用回收利用收回。",
    "Raises the user's chance for a critical hit by 2 stages. Fails if the user already has the effect. Baton Pass can be used to transfer this effect to an ally.": "使自身的击中要害率上升2级。如果使用者已处于此状态，使用失败。如果使用者使用了接棒，新上场的宝可梦将继承此效果。",
    "Causes Normal-type moves to become Electric type this turn. The effect happens after other effects that change a move's type.": "1回合内所有使用的一般属性的招式变为电属性。不会影响觉醒力量以及飞行皮肤、冰冻皮肤、妖精皮肤和电气皮肤特性的宝可梦使用的一般属性招式。",
    "Lowers the target's Special Attack by 2 stages. The target is unaffected if both the user and the target are the same gender, or if either is genderless. Pokemon with the Oblivious Ability are immune.": "令目标的特攻降低2级。如果自身与目标相同性别，或一方为无性别，则招式失败。拥有迟钝特性的宝可梦免疫此效果。",
    "The power of this move varies; 5% chances for 10 and 150 power, 10% chances for 30 and 110 power, 20% chances for 50 and 90 power, and 30% chance for 70 power. Damage doubles if the target is using Dig.": "招式威力在10～150中随机变化。具体概率为：各有5%几率为10或150威力；10%几率为30或70威力；20%几率为50或90威力；30%概率为70威力。如果目标处于挖洞状态，威力翻倍。",
    "For 5 turns, the user and its party members cannot be struck by a critical hit. Fails if the effect is already active on the user's side.": "5回合内，不会被对手的招式击中要害。如果己方已经处于此状态，使用失败。",
    "Once this move is successfully used, the user's Attack is raised by 1 stage every time it is hit by another Pokemon's attack as long as this move is chosen for use.": "在使用该招式后到下次使用者使用招式之前，每受到一次攻击造成的伤害，使用者的攻击能力提升1级。",
    "The user uses the last move used by the target. Fails if the target has not made a move since the user switched in, or if the last move used was Mirror Move.": "使用当回合目标使用过的招式。目标本回合未行动时或目标最后使用的招式是鹦鹉学舌，招式使用失败。",
    "If the user is a Terapagos in Stellar Form, this move's type becomes Stellar, hits all opposing Pokemon, and becomes a physical attack if the user's Attack is greater than its Special Attack, including stat stage changes.": "如果使用者是星晶形态的太乐巴戈斯，此招式的属性会变为星晶属性，会攻击对方全体宝可梦，并且如果使用者的攻击数值（包括能力等级变化）大于其特攻数值时，此招式会变为物理招式。",
};
function trans_from_dict(a) {
    var b = translations[a];
    if (b) return b;
    return a;
}

var QQ = $.noConflict();


var regex_item_was = new RegExp(/^ ([A-z0-9,'.() ’:-]+?) \(was ([A-z0-9,'.() ’:-]+?)\)$/);
var regex_toCommander = new RegExp(/^The opposing (.+?) was swallowed by the opposing (.+?) and became the opposing (.+?)'s commander!$/);
var regex_Commander = new RegExp(/^(.+?) was swallowed by (.+?) and became (.+?)'s commander!$/);
var regex_tomagic_bounce = new RegExp(/^The opposing (.+?) bounced the ([A-z0-9,'.() ’:-]+?) back!$/);
var regex_magic_bounce = new RegExp(/^(.+?) bounced the ([A-z0-9,'.() ’:-]+?) back!$/);
var regex_start_battle = new RegExp(/^Battle started between (.+?) and (.+?)!$/);
var regex_touturn = new RegExp(/^The opposing (.+?) went back to (.+?)!$/);
var regex_uturn = new RegExp(/^(.+?) went back to (.+?)!$/);
var regex_togems = new RegExp(/^The ([A-z0-9,'.() ’:-]+?) strengthened the opposing (.+?)'s power!$/);
var regex_gems = new RegExp(/^The ([A-z0-9,'.() ’:-]+?) strengthened (.+?)'s power!$/);
var regex_toeat2 = new RegExp(/^\(The opposing (.+?) used its ([A-z0-9,'.() ’:-]+?)!\)$/);
var regex_eat2 = new RegExp(/^\((.+?) used its ([A-z0-9,'.() ’:-]+?)!\)$/);
var regex_toeat = new RegExp(/^\(The opposing (.+?) ate its ([A-z0-9,'.() ’:-]+?)!\)$/);
var regex_eat = new RegExp(/^\((.+?) ate its ([A-z0-9,'.() ’:-]+?)!\)$/);
var regex_sent_out_first2 = new RegExp(/^([A-z0-9é,'.()* ’:-]+?), ([A-z0-9é,'.()* ’:-]+?) will be sent out first.$/);
var regex_sent_out_first = new RegExp(/^([A-z0-9é,'.()* ’:-]+?) will be sent out first.$/);
var regex_sent_out2 = new RegExp(/^(.+?) sent out (.+?) \(/);
var regex_sent_out = new RegExp(/^(.+?) sent out $/);
var regex_withdrew = new RegExp(/^(.+?) withdrew (.+?)!$/);
var regex_tolost_health = new RegExp(/^\(The opposing (.+?) lost (.+?)% of its health!\)$/);
var regex_lost_health = new RegExp(/^\((.+?) lost (.+?)% of its health!\)$/);
var regex_tolost_health2 = new RegExp(/^\(The opposing (.+?) lost $/);
var regex_lost_health2 = new RegExp(/^\((.+?) lost $/);
var regex_tomega = new RegExp(/^The opposing (.+?) has Mega Evolved into Mega ([A-z0-9,'.() ’:-]+?)!$/);
var regex_mega = new RegExp(/^(.+?) has Mega Evolved into Mega ([A-z0-9,'.() ’:-]+?)!$/);
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
var regex_tog6_mega = new RegExp(/^The opposing (.+?)'s ([A-z0-9,'.() ’:-]+?) is reacting to (.+?)'s Mega Bracelet!$/);
var regex_g6_mega = new RegExp(/^(.+?)'s ([A-z0-9,'.() ’:-]+?) is reacting to (.+?)'s Mega Bracelet!$/);
var regex_tocannot_use2 = new RegExp(/^The opposing (.+?) can't use its sealed ([A-z0-9,'.() ’:-]+?)!$/);
var regex_cannot_use2 = new RegExp(/^(.+?) can't use its sealed ([A-z0-9,'.() ’:-]+?)!$/);
var regex_seconds_left2 = new RegExp(/^(.+?) has ([0-9]+?) seconds left this turn.$/);
var regex_seconds_left = new RegExp(/^(.+?) has ([0-9]+?) seconds left.$/);
var regex_timer_on = new RegExp(/^Battle timer is ON: inactive players will automatically lose when time's up. \(requested by (.+?)\)$/);
var regex_reset_timer = new RegExp(/^The timer can't be re-enabled so soon after disabling it \(([0-9]+?) seconds remaining\)./)
var regex_team = new RegExp(/^(.+?)'s team:$/);
var regex_tofuture_sight = new RegExp(/^The opposing (.+?) foresaw an attack!$/);
var regex_future_sight = new RegExp(/^(.+?) foresaw an attack!$/);
var regex_toFutureSight_DoomDesire_attack = new RegExp(/^The opposing (.+?) took the (Future Sight|Doom Desire) attack!$/);
var regex_FutureSight_DoomDesire_attack = new RegExp(/^(.+?) took the (Future Sight|Doom Desire) attack!$/);
var regex_totype_change = new RegExp(/^The opposing (.+?)'s type changed to ([A-z0-9,'.() ’:-]+?)!$/);
var regex_type_change = new RegExp(/^(.+?)'s type changed to ([A-z0-9,'.() ’:-]+?)!$/);
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
var regex_willswitchin = new RegExp(/^([A-z0-9,'.()% ’:-]+?) will switch in, replacing ([A-z0-9,'.()% ’:-]+?).$/);
var regex_uteamsvf = new RegExp(/^Your team is valid for (.+?).$/);
var regex_Metronome = new RegExp(/^Waggling a finger let it use ([A-z0-9,'.() ’:-]+?)!$/);
var regex_iatbabi = new RegExp(/^(.+?) is about to be attacked by its ([A-z0-9,'.() ’:-]+?)!$/);
var regex_toiatbabi = new RegExp(/^The opposing (.+?) is about to be attacked by its ([A-z0-9,'.() ’:-]+?)!$/);
var regex_toctop2 = new RegExp(/^The opposing (.+?) corroded the opposing (.+?)'s ([A-z0-9,'.() ’:-]+?)!$/);
var regex_toctop = new RegExp(/^The opposing (.+?) corroded (.+?)'s ([A-z0-9,'.() ’:-]+?)!$/);
var regex_ctop = new RegExp(/^(.+?) corroded the opposing (.+?)'s ([A-z0-9,'.() ’:-]+?)!$/);
var regex_ctop2 = new RegExp(/^(.+?) corroded (.+?)'s ([A-z0-9,'.() ’:-]+?)!$/);
var regex_biftato = new RegExp(/^But it failed to affect the opposing (.+?)!$/);
var regex_bifta = new RegExp(/^But it failed to affect (.+?)!$/);
var regex_toshpif = new RegExp(/^The opposing (.+?)'s HP is full!$/);
var regex_shpif = new RegExp(/^(.+?)'s HP is full!$/);
var regex_tobiuiz = new RegExp(/^The opposing (.+?) boosted its ([A-z0-9,'.() ’:-]+?) (drastically | )using its Z-Power!$/);
var regex_biuiz = new RegExp(/^(.+?) boosted its ([A-z0-9,'.() ’:-]+?) (drastically | )using its Z-Power!$/);
var regex_thwctfto = new RegExp(/^The healing wish came true for the opposing (.+?)!$/);
var regex_thwctf = new RegExp(/^The healing wish came true for (.+?)!$/);
var regex_sfwhrtorm = new RegExp(/^(.+?)'s fervent wish has reached the opposing ([A-z0-9,'.() ’:-]+?)!$/);
var regex_sfwhrrm = new RegExp(/^(.+?)'s fervent wish has reached ([A-z0-9,'.() ’:-]+?)!$/);

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
var regex_totoredcard = new RegExp(/^The opposing (.+?) held up its Red Card against the opposing (.+?)!$/);
var regex_toredcard2 = new RegExp(/^The opposing (.+?) held up its Red Card against (.+?)!$/);
var regex_toredcard = new RegExp(/^(.+?) held up its Red Card against the opposing (.+?)!$/);
var regex_redcard = new RegExp(/^(.+?) held up its Red Card against (.+?)!$/);
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
var regex_toweakdamageberry = new RegExp(/^The ([A-z0-9,'.() ’:-]+?) weakened the damage to the opposing (.+?)!$/);
var regex_weakdamageberry = new RegExp(/^The ([A-z0-9,'.() ’:-]+?) weakened the damage to (.+?)!$/);
var regex_celebrate = new RegExp(/^Congratulations, (.+?)!$/);
var regex_tohpberry = new RegExp(/^The opposing (.+?) restored HP using its ([A-z0-9,'.() ’:-]+?)!$/);
var regex_hpberry = new RegExp(/^(.+?) restored HP using its ([A-z0-9,'.() ’:-]+?)!$/);
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
var regex_tosafety_goggles = new RegExp(/^The opposing (.+?) is not affected by ([A-z0-9,'.() ’:-]+?) thanks to its Safety Goggles!$/);
var regex_safety_goggles = new RegExp(/^(.+?) is not affected by ([A-z0-9,'.() ’:-]+?) thanks to its Safety Goggles!$/);
var regex_tostruggle = new RegExp(/^The opposing (.+?) has no moves left!$/);
var regex_struggle = new RegExp(/^(.+?) has no moves left!$/);
var regex_totohelpinghand = new RegExp(/^The opposing (.+?) is ready to help the opposing (.+?)!$/);
var regex_tohelpinghand2 = new RegExp(/^The opposing (.+?) is ready to help (.+?)!$/);
var regex_tohelpinghand = new RegExp(/^(.+?) is ready to help the opposing (.+?)!$/);
var regex_helpinghand = new RegExp(/^(.+?) is ready to help (.+?)!$/);
var regex_toclearsmog = new RegExp(/^The opposing (.+?)'s stat changes were removed!$/);
var regex_clearsmog = new RegExp(/^(.+?)'s stat changes were removed!$/);
var regex_toharvest = new RegExp(/^The opposing (.+?) harvested one ([A-z0-9,'.() ’:-]+?)!$/);
var regex_harvest = new RegExp(/^(.+?) harvested one ([A-z0-9,'.() ’:-]+?)!$/);
var regex_toallyswitch = new RegExp(/^The opposing (.+?) and the opposing (.+?) switched places!$/);
var regex_allyswitch = new RegExp(/^(.+?) and (.+?) switched places!$/);
var regex_toattract = new RegExp(/^The opposing (.+?) is in love with (.+?)!$/);
var regex_attract = new RegExp(/^(.+?) is in love with the opposing (.+?)!$/);
var regex_torecycle = new RegExp(/^The opposing (.+?) found one ([A-z0-9,'.() ’:-]+?)!$/);
var regex_recycle = new RegExp(/^(.+?) found one ([A-z0-9,'.() ’:-]+?)!$/);
var regex_tofling = new RegExp(/^The opposing (.+?) flung its ([A-z0-9,'.() ’:-]+?)!$/);
var regex_fling = new RegExp(/^(.+?) flung its ([A-z0-9,'.() ’:-]+?)!$/);
var regex_toobtained = new RegExp(/^The opposing (.+?) obtained one ([A-z0-9,'.() ’:-]+?).$/);
var regex_obtained = new RegExp(/^(.+?) obtained one ([A-z0-9,'.() ’:-]+?).$/);
var regex_totolockon = new RegExp(/^The opposing (.+?) took aim at the opposing (.+?)!$/);
var regex_tolockon2 = new RegExp(/^The opposing (.+?) took aim at (.+?)!$/);
var regex_tolockon = new RegExp(/^(.+?) took aim at the opposing (.+?)!$/);
var regex_lockon = new RegExp(/^(.+?) took aim at (.+?)!$/);
var regex_topoison = new RegExp(/^The opposing (.+?) was hurt by poison!$/);
var regex_poison = new RegExp(/^(.+?) was hurt by poison!$/);
var regex_toelectromorphosis = new RegExp(/^Being hit by ([A-z0-9,'.() ’:-]+?) charged the opposing (.+?) with power!$/);
var regex_electromorphosis = new RegExp(/^Being hit by ([A-z0-9,'.() ’:-]+?) charged (.+?) with power!$/);
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
var regex_basepower_double2 = new RegExp(/^Base power vs ([A-z0-9,'.() ’:-]+?): (\d{1,3}) to (\d{1,3})$/);
var regex_basepower_double = new RegExp(/^Base power vs ([A-z0-9,'.() ’:-]+?): (.+?)$/);
var regex_basepower2 = new RegExp(/^Base power: (\d{1,3}) to (\d{1,3})$/);
var regex_basepower = new RegExp(/^Base power: (.+?)$/);
var regex_disconnected = new RegExp(/^(.+?) disconnected and has (.+?) seconds to reconnect!$/);
var regex_disconnected2 = new RegExp(/^(.+?) disconnected and has a minute to reconnect!$/);
var regex_disconnected3 = new RegExp(/^(.+?) disconnected!$/);
var regex_reconnected = new RegExp(/^(.+?) reconnected and has (.+?) seconds left.$/);
var regex_usemove3 = new RegExp(/^([A-z0-9é,'.()% ’:-]+?) will use ([A-z0-9,'.() ’:-]+?) at your ([A-z0-9é,'.()% ’:-]+?).$/);
var regex_usemove2 = new RegExp(/^([A-z0-9é,'.()% ’:-]+?) will use ([A-z0-9,'.() ’:-]+?) at ([A-z0-9é,'.()% ’:-]+?).$/);
var regex_usemove = new RegExp(/^([A-z0-9é,'.()% ’:-]+?) will use ([A-z0-9,'.() ’:-]+?).$/);
var regex_reconnecte = new RegExp(/^(.+?) has (.+?) seconds to reconnect!$/);
var regex_toskyattack = new RegExp(/^The opposing (.+?) became cloaked in a harsh light!$/);
var regex_skyattack = new RegExp(/^(.+?) became cloaked in a harsh light!$/);
var regex_todisable = new RegExp(/^The opposing (.+?)'s ([A-z0-9,'.() ’:-]+?) is disabled!$/);
var regex_disable = new RegExp(/^(.+?)'s ([A-z0-9,'.() ’:-]+?) is disabled!$/);
var regex_todisable2 = new RegExp(/^The opposing (.+?)'s ([A-z0-9,'.() ’:-]+?) was disabled!$/);
var regex_disable2 = new RegExp(/^(.+?)'s ([A-z0-9,'.() ’:-]+?) was disabled!$/);
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
var regex_item_was_held_up = new RegExp(/^ ([A-z0-9,'.() ’:-]+?) \((stolen|tricked|disturbed|frisked|found|harvested); Red Card was held up\)$/);
var regex_item_was_popped = new RegExp(/^ ([A-z0-9,'.() ’:-]+?) \((stolen|tricked|disturbed|frisked|found|harvested); Air Balloon was popped\)$/);
var regex_item_was_eaten = new RegExp(/^ ([A-z0-9,'.() ’:-]+?) \((stolen|tricked|disturbed|frisked|found|harvested); ([A-z0-9,'.() ’:-]+?) was eaten\)$/);
var regex_item_was_consumed = new RegExp(/^ ([A-z0-9,'.() ’:-]+?) \((stolen|tricked|disturbed|frisked|found|harvested); ([A-z0-9,'.() ’:-]+?) was consumed\)$/);
var regex_item_was_flung = new RegExp(/^ ([A-z0-9,'.() ’:-]+?) \((stolen|tricked|disturbed|frisked|found|harvested); ([A-z0-9,'.() ’:-]+?) was flung\)$/);
var regex_item_was_stolen = new RegExp(/^ ([A-z0-9,'.() ’:-]+?) \((stolen|tricked|disturbed|frisked|found|harvested); ([A-z0-9,'.() ’:-]+?) was stolen\)$/);
var regex_item_was_knockedoff = new RegExp(/^ ([A-z0-9,'.() ’:-]+?) \((stolen|tricked|disturbed|frisked|found|harvested); ([A-z0-9,'.() ’:-]+?) was knocked off\)$/);
var regex_item_was_was = new RegExp(/^ ([A-z0-9,'.() ’:-]+?) \((stolen|tricked|disturbed|frisked|found|harvested); was ([A-z0-9,'.() ’:-]+?)\)$/);
var regex_item_held_up = new RegExp(/^ ([A-z0-9,'.() ’:-]+?) \(Red Card was held up\)$/);
var regex_item_popped = new RegExp(/^ ([A-z0-9,'.() ’:-]+?) \(Air Balloon was popped\)$/);
var regex_item_eaten = new RegExp(/^ ([A-z0-9,'.() ’:-]+?) \(([A-z0-9,'.() ’:-]+?) was eaten\)$/);
var regex_item_consumed = new RegExp(/^ ([A-z0-9,'.() ’:-]+?) \(([A-z0-9,'.() ’:-]+?) was consumed\)$/);
var regex_item_knockedoff = new RegExp(/^ ([A-z0-9,'.() ’:-]+?) \(([A-z0-9,'.() ’:-]+?) was knocked off\)$/);
var regex_item_stolen = new RegExp(/^ ([A-z0-9,'.() ’:-]+?) \(stolen\)$/);
var regex_item_found = new RegExp(/^ ([A-z0-9,'.() ’:-]+?) \(found\)$/);
var regex_item_harvested = new RegExp(/^ ([A-z0-9,'.() ’:-]+?) \(harvested\)$/);
var regex_item_tricked = new RegExp(/^ ([A-z0-9,'.() ’:-]+?) \(tricked\)$/);
var regex_item_disturbed = new RegExp(/^ ([A-z0-9,'.() ’:-]+?) \(disturbed\)$/);
var regex_item_frisked = new RegExp(/^ ([A-z0-9,'.() ’:-]+?) \(frisked\)$/);
var regex_item_flung = new RegExp(/^ ([A-z0-9,'.() ’:-]+?) \(([A-z0-9,'.() ’:-]+?) was flung\)$/);
var regex_item_stolen2 = new RegExp(/^ ([A-z0-9,'.() ’:-]+?) \(([A-z0-9,'.() ’:-]+?) was stolen\)$/);
var regex_item_incinerated = new RegExp(/^ ([A-z0-9,'.() ’:-]+?) \(([A-z0-9,'.() ’:-]+?) was incinerated\)$/);
var regex_base = new RegExp(/^ ([A-z0-9,'.() ’:-]+?) \(base: ([A-z0-9,'.() ’:-]+?)\)$/);
var regex_toonly = new RegExp(/^But the opposing (.+?) can't use the move!$/);
var regex_only = new RegExp(/^But (.+?) can't use the move!$/);
var regex_use3 = new RegExp(/^([A-z0-9,'.() ’:-]+?) will (Terastalliz|Mega Evolv)e, then use ([A-z0-9,'.() ’:-]+?) at your ([A-z0-9,'.() ’:-]+?).$/);
var regex_use2 = new RegExp(/^([A-z0-9,'.() ’:-]+?) will (Terastallize|Dynamax|Mega Evolve), then use ([A-z0-9,'.() ’:-]+?) at ([A-z0-9,'.() ’:-]+?).$/);
var regex_use = new RegExp(/^([A-z0-9,'.() ’:-]+?) will (Terastallize|Dynamax|Mega Evolve), then use ([A-z0-9,'.() ’:-]+?).$/);
var regex_tonatural_cure = new RegExp(/^\(The opposing (.+?) is cured by its Natural Cure!\)$/);
var regex_natural_cure = new RegExp(/^\((.+?) is cured by its Natural Cure!\)$/);
var regex_toacquired = new RegExp(/^The opposing (.+?) acquired ([A-z0-9,'.() ’:-]+?)!$/);
var regex_acquired = new RegExp(/^(.+?) acquired ([A-z0-9,'.() ’:-]+?)!$/);
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
var regex_suspect = new RegExp(/^(.+?) is currently suspecting ([A-z0-9,'.() ’:-]+?)! For information on how to participate check out the $/);
var regex_changed = new RegExp(/^\(Changed forme: ([A-z0-9,'.() ’:-]+?)\)$/);
var regex_turnsasleep = new RegExp(/^ Turns asleep: (.+?)$/);
var regex_switchto = new RegExp(/^Switch ([A-z0-9,'.() ’:-]+?) to$/);
var regex_online = new RegExp(/^Online (.+?)$/);
var regex_offline = new RegExp(/^Offline (.+?)$/);
var regex_toterastallized = new RegExp(/^The opposing (.+?) has Terastallized into the ([A-z ’:-]+?)\-type!$/);
var regex_terastallized = new RegExp(/^(.+?) has Terastallized into the ([A-z0-9,'.() ’:-]+?)\-type!$/);
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
var regex_towas_cured_of = new RegExp(/^The opposing (.+?) was cured of (Freeze|Burn|Sleep|paralysis|its poisoning)!$/);
var regex_was_cured_of = new RegExp(/^(.+?) was cured of (Freeze|Burn|Sleep|paralysis|its poisoning)!$/);
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
var regex_tofocussash_focusband = new RegExp(/^The opposing (.+?) hung on using its Focus (Sash|Band)!$/);
var regex_focussash_focusband = new RegExp(/^(.+?) hung on using its Focus (Sash|Band)!$/);
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
var regex_toloses_flying = new RegExp(/^\(The opposing (.+?) loses Flying type this turn.\)$/);
var regex_loses_flying = new RegExp(/^\((.+?) loses Flying type this turn.\)$/);
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
var regex_tolearned = new RegExp(/^The opposing (.+?) learned ([A-z0-9,'.() ’:-]+?)!$/);
var regex_learned = new RegExp(/^(.+?) learned ([A-z0-9,'.() ’:-]+?)!$/);
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
var regex_tomirrorherb2 = new RegExp(/^The Mirror Herb drastically (raised|lowered) the opposing (.+?)'s ([A-z0-9,'.() ’:-]+?)!$/);
var regex_mirrorherb2 = new RegExp(/^The Mirror Herb drastically (raised|lowered) (.+?)'s ([A-z0-9,'.() ’:-]+?)!$/);
var regex_tomirrorherb = new RegExp(/^The Mirror Herb (sharply raised|raised) the opposing (.+?)'s ([A-z0-9,'.() ’:-]+?)!$/);
var regex_mirrorherb = new RegExp(/^The Mirror Herb (sharply raised|raised) (.+?)'s ([A-z0-9,'.() ’:-]+?)!$/);
var regex_tomirrorherb_Contrary = new RegExp(/^The Mirror Herb (harshly lowered|lowered) the opposing (.+?)'s ([A-z0-9,'.() ’:-]+?)!$/);
var regex_mirrorherb_Contrary = new RegExp(/^The Mirror Herb (harshly lowered|lowered) (.+?)'s ([A-z0-9,'.() ’:-]+?)!$/);
var regex_toStarf_Berry = new RegExp(/^The Starf Berry (sharply raised|drastically raised|harshly lowered) the opposing (.+?)'s ([A-z0-9,'.() ’:-]+?)!$/);
var regex_Starf_Berry = new RegExp(/^The Starf Berry (sharply raised|drastically raised|harshly lowered) (.+?)'s ([A-z0-9,'.() ’:-]+?)!$/);
var regex_toWeakness_Policy = new RegExp(/^The Weakness Policy (sharply raised|drastically raised|harshly lowered) the opposing (.+?)'s ([A-z0-9,'.() ’:-]+?)!$/);
var regex_Weakness_Policy = new RegExp(/^The Weakness Policy (sharply raised|drastically raised|harshly lowered) (.+?)'s ([A-z0-9,'.() ’:-]+?)!$/);
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
var regex_tosketched = new RegExp(/^The opposing (.+?) sketched ([A-z0-9,'.() ’:-]+?)!$/);
var regex_sketched = new RegExp(/^(.+?) sketched ([A-z0-9,'.() ’:-]+?)!$/);
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
var regex_torevealed = new RegExp(/^The opposing (.+?)'s ([A-z0-9,'.() ’:-]+?) was revealed!$/);
var regex_revealed = new RegExp(/^(.+?)'s ([A-z0-9,'.() ’:-]+?) was revealed!$/);
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
var regex_toKey_Stone = new RegExp(/^The opposing (.+?)'s ([A-z0-9,'.() ’:-]+?) is reacting to the Key Stone!$/);
var regex_Key_Stone = new RegExp(/^(.+?)'s ([A-z0-9,'.() ’:-]+?) is reacting to the Key Stone!$/);
var regex_tobecame_AshGreninja = new RegExp(/^The opposing (.+?) became Ash-Greninja!$/);
var regex_became_AshGreninja = new RegExp(/^(.+?) became Ash-Greninja!$/);
var regex_crazy_house = new RegExp(/^(.+?) was captured by (.+?)!$/);
var regex_tomelted = new RegExp(/^The opposing (.+?)'s ([A-z0-9,'.() ’:-]+?) melted the ice!$/);
var regex_melted = new RegExp(/^(.+?)'s ([A-z0-9,'.() ’:-]+?) melted the ice!$/);
var regex_toelectromagnetism_woreoff = new RegExp(/^The opposing (.+?)'s electromagnetism wore off!$/);
var regex_electromagnetism_woreoff = new RegExp(/^(.+?)'s electromagnetism wore off!$/);
var regex_tocant_use_gravity = new RegExp(/^The opposing (.+?) can't use ([A-z0-9,'.() ’:-]+?) because of gravity!$/);
var regex_cant_use_gravity = new RegExp(/^The opposing (.+?) can't use ([A-z0-9,'.() ’:-]+?) because of gravity!$/);
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
var regex_tonot_lowered = new RegExp(/^The opposing (.+?)'s ([A-z0-9,'.() ’:-]+?) was not lowered!$/);
var regex_not_lowered = new RegExp(/^(.+?)'s ([A-z0-9,'.() ’:-]+?) was not lowered!$/);
var regex_totype_added = new RegExp(/^([A-z0-9,'.() ’:-]+?) type was added to the opposing (.+?)!$/);
var regex_type_added = new RegExp(/^([A-z0-9,'.() ’:-]+?) type was added to (.+?)!$/);
var regex_tocant_get_going = new RegExp(/^The opposing (.+?) can't get it going!$/);
var regex_cant_get_going = new RegExp(/^(.+?) can't get it going!$/);
var regex_tofinally_get_going = new RegExp(/^The opposing (.+?) finally got its act together!$/);
var regex_finally_get_going = new RegExp(/^(.+?) finally got its act together!$/);
var regex_towas_burned_up = new RegExp(/^The opposing (.+?)'s ([A-z0-9,'.() ’:-]+?) was burned up!$/);
var regex_was_burned_up = new RegExp(/^(.+?)'s ([A-z0-9,'.() ’:-]+?) was burned up!$/);
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
var regex_totaken_over = new RegExp(/^The opposing (.+?)'s ([A-z0-9,'.() ’:-]+?) was taken over!$/);
var regex_taken_over = new RegExp(/^(.+?)'s ([A-z0-9,'.() ’:-]+?) was taken over!$/);
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
var regex_kicked_up_mat = new RegExp(/^([A-z0-9,'.() ’:-]+?) was blocked by the kicked-up mat!$/);
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
var regex_areintheback5 = new RegExp(/^([A-z0-9é,'.()* ’:-]+?), ([A-z0-9é,'.()* ’:-]+?), ([A-z0-9é,'.()* ’:-]+?), ([A-z0-9é,'.()* ’:-]+?), ([A-z0-9é,'.()* ’:-]+?) are in the back.$/);
var regex_areintheback4 = new RegExp(/^([A-z0-9é,'.()* ’:-]+?), ([A-z0-9é,'.()* ’:-]+?), ([A-z0-9é,'.()* ’:-]+?), ([A-z0-9é,'.()* ’:-]+?) are in the back.$/);
var regex_areintheback3 = new RegExp(/^([A-z0-9é,'.()* ’:-]+?), ([A-z0-9é,'.()* ’:-]+?), ([A-z0-9é,'.()* ’:-]+?) are in the back.$/);
var regex_areintheback2 = new RegExp(/^([A-z0-9é,'.()* ’:-]+?), ([A-z0-9é,'.()* ’:-]+?) are in the back.$/);
var regex_areintheback = new RegExp(/^([A-z0-9é,'.()* ’:-]+?) are in the back.$/);
var regex_toPluck_BugBite = new RegExp(/^The opposing (.+?) stole and ate its target's ([A-z0-9,'.() ’:-]+?)!$/);
var regex_Pluck_BugBite = new RegExp(/^(.+?) stole and ate its target's ([A-z0-9,'.() ’:-]+?)!$/);
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
var regex_tobecause_gravity = new RegExp(/^The opposing (.+?) can't use ([A-z0-9,'.() ’:-]+?) because of gravity!$/);
var regex_because_gravity = new RegExp(/^(.+?) can't use ([A-z0-9,'.() ’:-]+?) because of gravity!$/);
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
var regex_from4 = new RegExp(/\(([0-9.]+?)× from ([A-z0-9,'.+ ’:-]+?)\) \(([0-9.]+?)× from ([A-z0-9,'.+ ’:-]+?)\) \(([0-9.]+?)× from ([A-z0-9,'.+ ’:-]+?)\) \(([0-9.]+?)× from ([A-z0-9,'.+ ’:-]+?)\)$/);
var regex_from3 = new RegExp(/\(([0-9.]+?)× from ([A-z0-9,'.+ ’:-]+?)\) \(([0-9.]+?)× from ([A-z0-9,'.+ ’:-]+?)\) \(([0-9.]+?)× from ([A-z0-9,'.+ ’:-]+?)\)$/);
var regex_from2 = new RegExp(/\(([0-9.]+?)× from ([A-z0-9,'.+ ’:-]+?)\) \(([0-9.]+?)× from ([A-z0-9,'.+ ’:-]+?)\)$/);
var regex_from = new RegExp(/\(([0-9.]+?)× from ([A-z0-9,'.+ ’:-]+?)\)$/);
var regex_toProtective_Pads = new RegExp(/^The opposing (.+?) protected itself with its Protective Pads!$/);
var regex_Protective_Pads = new RegExp(/^(.+?) protected itself with its Protective Pads!$/);
var regex_toAbility_Shield = new RegExp(/^The opposing (.+?)'s Ability is protected by the effects of its Ability Shield!$/);
var regex_Ability_Shield = new RegExp(/^(.+?)'s Ability is protected by the effects of its Ability Shield!$/);
var regex_togrudge = new RegExp(/^The opposing (.+?)'s ([A-z0-9,'.() ’:-]+?) lost all of its PP due to the grudge!$/);
var regex_grudge = new RegExp(/^(.+?)'s ([A-z0-9,'.() ’:-]+?) lost all of its PP due to the grudge!$/);
var regex_toalready_has_burn = new RegExp(/^The opposing (.+?) already has a burn.$/);
var regex_already_has_burn = new RegExp(/^(.+?) already has a burn.$/);
var regex_already_searching = new RegExp(/^Couldn't search: You are already searching for a (.+?) battle.$/);
var regex_todoesnt_become_confused = new RegExp(/^The opposing (.+?) doesn't become confused!$/);
var regex_doesnt_become_confused = new RegExp(/^(.+?) doesn't become confused!$/);
var regex_already_challenge = new RegExp(/^There's already a challenge (.+?) between you and (.+?)!$/);
var regex_tobecause_Heal_Block = new RegExp(/^The opposing (.+?) can't use ([A-z0-9,'.() ’:-]+?) because of Heal Block!$/);
var regex_because_Heal_Block = new RegExp(/^(.+?) can't use ([A-z0-9,'.() ’:-]+?) because of Heal Block!$/);
var regex_offering_tie = new RegExp(/^(.+?) is offering a tie.$/);
var regex_rejected_accepted_tie = new RegExp(/^(.+?) (rejected|accepted) the tie.$/);
var regex_ywaiftbdeit = new RegExp(/^You will auto-tie if the battle doesn't end in (.+?) turns \(on turn (.+?)\).$/);
var regex_ifuwttieecu = new RegExp(/^\(If you want to tie earlier, consider using `(.+?)`.\)$/);
var regex_toStickyBarb_burn_BlackSludge = new RegExp(/^The opposing (.+?) was hurt by its (Sticky Barb|burn|Black Sludge)!$/);
var regex_StickyBarb_burn_BlackSludge = new RegExp(/^(.+?) was hurt by its (Sticky Barb|burn|Black Sludge)!$/);
var regex_toCrafty_Quick_Wide_Shield = new RegExp(/^(Crafty|Quick|Wide) Guard protected the opposing (.+?)!$/);
var regex_Crafty_Quick_Wide_Shield = new RegExp(/^(Crafty|Quick|Wide) Guard protected (.+?)!$/);
var regex_toTreasures_of_ruin = new RegExp(/^The opposing (.+?)'s ([A-z0-9,'() ’:-]+?) weakened the ([A-z0-9,'.() ’:-]+?) of all surrounding Pokemon!$/);
var regex_Treasures_of_ruin = new RegExp(/^(.+?)'s ([A-z0-9,'() ’:-]+?) weakened the ([A-z0-9,'.() ’:-]+?) of all surrounding Pokemon!$/);
var regex_Specific_to = new RegExp(/^Specific to (.+?)$/);
var regex_toprotective_mist = new RegExp(/^The opposing (.+?) surrounds itself with a protective mist!$/);
var regex_protective_mist = new RegExp(/^(.+?) surrounds itself with a protective mist!$/);
var regex_torose = new RegExp(/^The opposing (.+?)'s ([A-z0-9,'.() ’:-]+?) (rose drastically|rose sharply|rose)!$/);
var regex_rose = new RegExp(/^(.+?)'s ([A-z0-9,'.() ’:-]+?) (rose drastically|rose sharply|rose)!$/);
var regex_tofell = new RegExp(/^The opposing (.+?)'s ([A-z0-9,'.() ’:-]+?) (fell severely|fell harshly|fell)!$/);
var regex_fell = new RegExp(/^(.+?)'s ([A-z0-9,'.() ’:-]+?) (fell severely|fell harshly|fell)!$/);
var regex_toperishsong = new RegExp(/^The opposing (.+?)'s perish count fell to (3|2|1|0).$/);
var regex_perishsong = new RegExp(/^(.+?)'s perish count fell to (3|2|1|0).$/);
var regex_toDestiny_Knot = new RegExp(/^The opposing (.+?) fell in love because of the Destiny Knot!$/);
var regex_Destiny_Knot = new RegExp(/^(.+?) fell in love because of the Destiny Knot!$/);
var regex_toBerserk_Gene = new RegExp(/^The Berserk Gene sharply raised the opposing (.+?)'s Attack!$/);
var regex_Berserk_Gene = new RegExp(/^The Berserk Gene sharply raised (.+?)'s Attack!$/);
var regex_Guessed_spread = new RegExp(/^([A-UW-Za-z ]+?):\s(\d{1,3})\s([A-z]{2,3})\s\/\s(\d{1,3})\s([A-z]{2,3})\s\/\s(\d{1,3})\s([A-z]{2,3})(.+?)$/);
var regex_Guessed_spread2 = new RegExp(/^(\d{1,3})\s([A-z]{2,3})\s\/\s(\d{1,3})\s([A-z]{2,3})(.+?)$/);
var regex_Teaches = new RegExp(/^Teaches certain Pokemon the move ([A-z0-9' ’:-]+?). One use.$/);
var regex_allows_ZMove = new RegExp(/^If holder has (a|an) ([A-z]+?) move, this item allows it to use (a|an) ([A-z]+?) Z-Move.$/);
var regex_Multi_Attack = new RegExp(/^^Holder's Multi-Attack is ([A-z]+?) type.$/);
var regex_Judgment = new RegExp(/^Holder's ([A-z]+?)-type attacks have 1.2x power. Judgment is ([A-z]+?) type.$/);
var regex_attacks_have = new RegExp(/^Holder's ([A-z]+?)-type attacks have 1.(1|2)x power.$/);
var regex_Gem = new RegExp(/^Holder's first successful ([A-z]+?)-type attack will have 1.(3|5)x power. Single use.$/);
var regex_taken_supereffective = new RegExp(/^Halves damage taken from a supereffective ([A-z]+?)-type attack. Single use.$/);
var regex_Can_revived = new RegExp(/^Can be revived into ([A-z0-9,'() ’:-]+?).$/);
var regex_Evolves = new RegExp(/^Evolves ([A-z0-9,'.() ’:-]+?) into ([A-z0-9,'.() ’:-]+?) when (us|trad)ed.$/);
var regex_confuses_Nature = new RegExp(/^Restores ([A-z0-9/.%]+?) max HP at ([A-z0-9/.%]+?) max HP or less; confuses if -([A-z]+?) Nature. Single use.$/);
var regex_Mega_Evolve_item = new RegExp(/^If held by (a|an) ([A-z0-9']+?), this item allows it to Mega Evolve in battle.$/);
var regex_Spe_to = new RegExp(/^ (\d{1,3}) to (\d{1,3}) $/);
var regex_battles_ballte = new RegExp(/^([0-9+]+)([A-z0-9'() ’:-]+?) (battles|battle)$/);
var regex_Turn = new RegExp(/^Turn (\d{1,3})$/);
var regex_Transformed_into2 = new RegExp(/^\(Transformed into ([A-z0-9,'.() ’:-]+?)\)$/);
var regex_knocked_off = new RegExp(/^([A-z,'.0-9 ’:-]+?) \(knocked off\)$/);
var regex_hid_replay = new RegExp(/^(.+?) hid the replay of this battle.$/);
var regex_weather_suppressed = new RegExp(/\((Snow|Hail|Desolate Land|Sunny Day|Primordial Sea|Rain Dance|Sandstorm) suppressed by ([A-z ’:-]+?)\)$/);
var regex_Nature_Power = new RegExp(/^Nature Power turned into ([A-z0-9,'.() ’:-]+?)\)!$/);
var regex_Use_different_nature = new RegExp(/Use a different nature to save (\d{1,3}) EVs:/);
var regex_made_hidden = new RegExp(/^(.+?) made this room hidden.$/);
var regex_made_public = new RegExp(/^(.+?) made this room public.$/);
var regex_tofell_sky = new RegExp(/^The opposing (.+?) fell from the sky due to the gravity!$/);
var regex_fell_sky = new RegExp(/^(.+?) fell from the sky due to the gravity!$/);
var regex_lol = new RegExp(/^you don't have any(.+?)teams lol$/);
var regex_toconcentrated = new RegExp(/^The opposing (.+?) concentrated intensely!$/);
var regex_concentrated = new RegExp(/^(.+?) concentrated intensely!$/);
var regex_toshook_head = new RegExp(/^The opposing (.+?) shook its head. It seems like it can't use this move...$/);
var regex_shook_head = new RegExp(/^(.+?) shook its head. It seems like it can't use this move...$/);

// 锦标赛
var regex_setourc = new RegExp(/^(.+?)Single Elimination Tournament created.$/);
var regex_detourc = new RegExp(/^(.+?)Double Elimination Tournament created.$/);
var regex_ttouwsophjc = new RegExp(/^The tournament will start once ([A-z0-9é,'.()* ’:-]+?) players have joined.$/);
var regex_ttouradthbstm = new RegExp(/^The tournament's automatic disqualify timer has been set to ([A-z0-9é,'.()* ’:-]+?) minutes.$/);
var regex_ttourwnalp = new RegExp(/^The ([A-z0-9é,'.()* ’:-]+?) tournament will now award leaderboard points.$/);
var regex_ttourwnla = new RegExp(/^The ([A-z0-9é,'.()* ’:-]+?) tournament will no longer award.$/);

var regex_jointtour = new RegExp(/^([A-Za-z0-9é,'.()* ’\u4e00-\u9fff_#:-]+?) joined the tournament.$/);
var regex_leftttour = new RegExp(/^([A-Za-z0-9é,'.()* ’\u4e00-\u9fff_#:-]+?) left the tournament.$/);
var regex_jointtour2 = new RegExp(/^([A-Za-z0-9é,'.()* ’\u4e00-\u9fff_#:-]+?) and ([A-Za-z0-9é,'.()* ’\u4e00-\u9fff_#:-]+?) joined the tournament.$/);
var regex_jointtour5 = new RegExp(/^([A-Za-z0-9é,'.()* ’\u4e00-\u9fff_#:-]+?), ([A-Za-z0-9é,'.()* ’\u4e00-\u9fff_#:-]+?) and ([A-Za-z0-9é,'.()* ’\u4e00-\u9fff_#:-]+?) joined the tournament; ([A-Za-z0-9é,'.()* ’\u4e00-\u9fff_#:-]+?) and ([A-Za-z0-9é,'.()* ’\u4e00-\u9fff_#:-]+?) left the tournament.$/);
var regex_jointtourx = new RegExp(/^([A-Za-z0-9é,'.()* ’\u4e00-\u9fff_#:-]+?), ([A-Za-z0-9é,'.()* ’\u4e00-\u9fff_#:-]+?), ([A-Za-z0-9é,'.()* ’\u4e00-\u9fff_#:-]+?), ([A-Za-z0-9é,'.()* ’\u4e00-\u9fff_#:-]+?), ([A-Za-z0-9é,'.()* ’\u4e00-\u9fff_#:-]+?) and ([A-z0-9é,'.()* ’:-]+?) others joined the tournament.$/);

var regex_tthsp = new RegExp(/^The tournament has started! \(([A-z0-9é,'.()* ’:-]+?) players\)$/);
var regex_tbattlebas = new RegExp(/^Tournament battle between ([A-Za-z0-9é,'.()* ’\u4e00-\u9fff_#:-]+?) and ([A-Za-z0-9é,'.()* ’\u4e00-\u9fff_#:-]+?) started.$/);
var regex_hwontma = new RegExp(/^([A-Za-z0-9é,'.()* ’\u4e00-\u9fff_#:-]+?) has won the match ([A-z0-9é,'.()* ’:-]+?) against ([A-Za-z0-9é,'.()* ’\u4e00-\u9fff_#:-]+?).$/);
var regex_hlosttma = new RegExp(/^([A-Za-z0-9é,'.()* ’\u4e00-\u9fff_#:-]+?) has lost the match ([A-z0-9é,'.()* ’:-]+?) against ([A-Za-z0-9é,'.()* ’\u4e00-\u9fff_#:-]+?).$/);
var regex_cfwintset = new RegExp(/^Congratulations to ([A-Za-z0-9é,'.()* ’\u4e00-\u9fff_#:-]+?) for winning the ([A-z0-9é,'.()* ’:-]+?) Single Elimination Tournament!$/);
var regex_hbdfttour = new RegExp(/^([A-Za-z0-9é,'.()* ’\u4e00-\u9fff_#:-]+?) has been disqualified from the tournament.$/);

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
var regex_MG = new RegExp(/^Max\sGuard$/);
var regex_Guessed_spread3 = new RegExp(/^Guessed\sspread:\s\(Please\schoose\s4\smoves\sto\sget\sa\sguessed\sspread\) \($/);




//  debug

var regex_totoknock = new RegExp(/^The opposing (.+?) knocked off the opposing (.+?)'s ([A-z0-9,'.() ’:-]+?)!$/);
var regex_toknock2 = new RegExp(/^The opposing (.+?) knocked off (.+?)'s ([A-z0-9,'.() ’:-]+?)!$/);
var regex_toknock = new RegExp(/^(.+?) knocked off the opposing (.+?)'s ([A-z0-9,'.() ’:-]+?)!$/);
var regex_knock = new RegExp(/^(.+?) knocked off (.+?)'s ([A-z0-9,'.() ’:-]+?)!$/);
var regex_knock2 = new RegExp(/^knocked off (.+?)'s ([A-z0-9,'.() ’:-]+?)!$/);
var regex_totothief = new RegExp(/^The opposing (.+?) stole the opposing (.+?)'s ([A-z0-9,'.() ’:-]+?)!$/);
var regex_tothief2 = new RegExp(/^The opposing (.+?) stole (.+?)'s ([A-z0-9,'.() ’:-]+?)!$/);
var regex_tothief = new RegExp(/^(.+?) stole the opposing (.+?)'s ([A-z0-9,'.() ’:-]+?)!$/);
var regex_thief = new RegExp(/^(.+?) stole (.+?)'s ([A-z0-9,'.() ’:-]+?)!$/);
var regex_tototrace = new RegExp(/^The opposing (.+?) traced the opposing (.+?)'s ([A-z0-9,'.() ’:-]+?)!$/);
var regex_totrace2 = new RegExp(/^The opposing (.+?) traced (.+?)'s ([A-z0-9,'.() ’:-]+?)!$/);
var regex_totrace = new RegExp(/^(.+?) traced the opposing (.+?)'s ([A-z0-9,'.() ’:-]+?)!$/);
var regex_trace = new RegExp(/^(.+?) traced (.+?)\'s ([A-z0-9,'.() ’:-]+?)!$/);
var regex_totoroleplay = new RegExp(/^The opposing (.+?) copied the opposing (.+?)'s ([A-z0-9,'.() ’:-]+?) Ability!$/);
var regex_toroleplay2 = new RegExp(/^The opposing (.+?) copied (.+?)'s ([A-z0-9,'.() ’:-]+?) Ability!$/);
var regex_toroleplay = new RegExp(/^(.+?) copied the opposing (.+?)'s ([A-z0-9,'.() ’:-]+?) Ability!$/);
var regex_roleplay = new RegExp(/^(.+?) copied (.+?)'s ([A-z0-9,'.() ’:-]+?) Ability!$/);
var regex_tocannot_use = new RegExp(/^The opposing (.+?) cannot use ([A-z0-9,'.() ’:-]+?)!$/);
var regex_cannot_use = new RegExp(/^(.+?) cannot use ([A-z0-9,'.() ’:-]+?)!$/);
var regex_tostockpiled = new RegExp(/^The opposing (.+?) stockpiled (.+?)!$/);
var regex_stockpiled = new RegExp(/^(.+?) stockpiled (.+?)!$/);
var regex_toihb = new RegExp(/^The opposing (.+?) is hurt by ([A-z0-9,'.() ’:-]+?)!$/);
var regex_ihb = new RegExp(/^(.+?) is hurt by ([A-z0-9,'.() ’:-]+?)!$/);
var regex_tofreed = new RegExp(/^The opposing (.+?) was freed from (.+?)!$/);
var regex_freed = new RegExp(/^(.+?) was freed from (.+?)!$/);
var regex_tocant_use = new RegExp(/^The opposing (.+?) can't use ([A-z0-9,'.() ’:-]+?)!$/);
var regex_cant_use = new RegExp(/^(.+?) can't use ([A-z0-9,'.() ’:-]+?)!$/);
var regex_totrapped = new RegExp(/^The opposing (.+?) trapped (.+?)!$/);
var regex_trapped = new RegExp(/^(.+?) trapped the opposing (.+?)!$/);
var regex_joined = new RegExp(/^(.+?) joined$/);
var regex_left = new RegExp(/^(.+?) left$/);
var regex_toeerie_spell = new RegExp(/^It reduced the PP of the opposing (.+?)'s ([A-z0-9,'.() ’:-]+?) by (.+?)!$/);
var regex_eerie_spell = new RegExp(/^It reduced the PP of (.+?)'s ([A-z0-9,'.() ’:-]+?) by (.+?)!$/);
var regex_Unavailable_choice_cant_move = new RegExp(/^[Unavailable choice] Can't move: (.+?)'s ([A-z0-9,'.() ’:-]+?) is disabled$/);
var regex_toleppaberry = new RegExp(/^The opposing (.+?) restored PP to its move ([A-z0-9,'.() ’:-]+?) using its Leppa Berry!$/);
var regex_leppaberry = new RegExp(/^(.+?) restored PP to its move ([A-z0-9,'.() ’:-]+?) using its Leppa Berry!$/);
var regex_tostat_changes = new RegExp(/^The opposing (.+?)'s stat changes!$/);
var regex_stat_changes = new RegExp(/^(.+?)'s stat changes!$/);
var regex_tosymbiosis = new RegExp(/^The opposing (.+?) shared its ([A-z0-9,'.() ’:-]+?) with the opposing (.+?)!$/);
var regex_symbiosis = new RegExp(/^(.+?) shared its ([A-z0-9,'.() ’:-]+?) with (.+?)!$/);
var regex_tohigh_low = new RegExp(/^The opposing (.+?)'s ([A-z0-9,'.() ’:-]+?) won't go any (high|low)er!$/);
var regex_high_low = new RegExp(/^(.+?)'s ([A-z0-9,'.() ’:-]+?) won't go any (high|low)er!$/);
var regex_towas_heightened = new RegExp(/^The opposing (.+?)'s ([A-z0-9,'.() ’:-]+?) was heightened!$/);
var regex_was_heightened = new RegExp(/^(.+?)'s ([A-z0-9,'.() ’:-]+?) was heightened!$/);
var regex_Move_here = new RegExp(/^ Move here$/);
var regex_to_used = new RegExp(/^The opposing (.+?) used $/);
var regex_used = new RegExp(/^(.+?) used $/);
var regex_to123 = new RegExp(/^\[The opposing (.+?)'s ([A-z0-9,'.() ’:-]+?)\]$/);
var regex_123 = new RegExp(/^\[(.+?)'s ([A-z0-9,'.() ’:-]+?)\]$/);
var regex_1234 = new RegExp(/^\(([A-z0-9,'.() ’:-]+?)\)$/);
var regex_12345 = new RegExp(/^([A-z0-9,'.() ’:-]+?) \($/);
var regex_9 = new RegExp(/^([A-z0-9é*'. ’:-]+?) \/ ([A-z0-9é*'. ’:-]+?) \/ ([A-z0-9é*'. ’:-]+?) \/ ([A-z0-9é*'. ’:-]+?) \/ ([A-z0-9é*'. ’:-]+?) \/ ([A-z0-9é*'. ’:-]+?) \/ ([A-z0-9é*'. ’:-]+?) \/ ([A-z0-9é*'. ’:-]+?) \/ ([A-z0-9é*'. ’:-]+?)$/);
var regex_8 = new RegExp(/^([A-z0-9é*'. ’:-]+?) \/ ([A-z0-9é*'. ’:-]+?) \/ ([A-z0-9é*'. ’:-]+?) \/ ([A-z0-9é*'. ’:-]+?) \/ ([A-z0-9é*'. ’:-]+?) \/ ([A-z0-9é*'. ’:-]+?) \/ ([A-z0-9é*'. ’:-]+?) \/ ([A-z0-9é*'. ’:-]+?)$/);
var regex_7 = new RegExp(/^([A-z0-9é*'. ’:-]+?) \/ ([A-z0-9é*'. ’:-]+?) \/ ([A-z0-9é*'. ’:-]+?) \/ ([A-z0-9é*'. ’:-]+?) \/ ([A-z0-9é*'. ’:-]+?) \/ ([A-z0-9é*'. ’:-]+?) \/ ([A-z0-9é*'. ’:-]+?)$/);
var regex_6 = new RegExp(/^([A-z0-9é*'. ’:-]+?) \/ ([A-z0-9é*'. ’:-]+?) \/ ([A-z0-9é*'. ’:-]+?) \/ ([A-z0-9é*'. ’:-]+?) \/ ([A-z0-9é*'. ’:-]+?) \/ ([A-z0-9é*'. ’:-]+?)$/);
var regex_5 = new RegExp(/^([A-z0-9é*'. ’:-]+?) \/ ([A-z0-9é*'. ’:-]+?) \/ ([A-z0-9é*'. ’:-]+?) \/ ([A-z0-9é*'. ’:-]+?) \/ ([A-z0-9é*'. ’:-]+?)$/);
var regex_4 = new RegExp(/^([A-z0-9é*'. ’:-]+?) \/ ([A-z0-9é*'. ’:-]+?) \/ ([A-z0-9é*'. ’:-]+?) \/ ([A-z0-9é*'. ’:-]+?)$/);
var regex_3 = new RegExp(/^([A-z0-9é*'. ’:-]+?) \/ ([A-z0-9é*'. ’:-]+?) \/ ([A-z0-9é*'. ’:-]+?)$/);
var regex_2 = new RegExp(/^([A-z0-9é*'. ’:-]+?) \/ ([A-z0-9é*'. ’:-]+?)$/);
var regex_1 = new RegExp(/^ ([A-z0-9é'() ’:-]+?) \/ $/);
var regex_333 = new RegExp(/^ ([A-z0-9*'., -]+?), ([A-z0-9*'., -]+?), ([A-z0-9*'., -]+?)$/);
var regex_222 = new RegExp(/^ ([A-z0-9*'., -]+?), ([A-z0-9*'., -]+?)$/);
var regex_111 = new RegExp(/^(不开启|超能力|节拍器|刷新|攻击)$/);
var regex_11 = new RegExp(/^！(.+?)$/);

var regex_rating = new RegExp(/(.+)'s rating: (.+)/);
var regex_forwin = new RegExp(/\((.+) for winning\)/);
var regex_forlos = new RegExp(/\((.+) for losing\)/);
var regex_tourwsoumbaq = new RegExp(/Please respond to the tournament within (.+) seconds or you may be automatically disqualified./);

var regex_statussetto = new RegExp(/Your status has been set to: (.+)./);
var regex_tcdnetsamswt = new RegExp(/The command "(.+)" does not exist. To send a message starting with "(.+)", type "(.+)"./);
var regex_useroffinemessge = new RegExp(/User (.+) is offline. Send the message again to confirm. If you are using (.+), use (.+) instead./);








var t = function (originalStr) {
    var tmp = originalStr.trim();
    if (translations[tmp])
        return translations[tmp];
    if (originalStr.match(regex_chn))
        return originalStr;
    if (originalStr.match(regex_team)) {
        return RegExp.$1 + "的队伍：";
    }
    if (originalStr.match(regex_item_was)) {
        return  translations[RegExp.$1] + " (之前是" + translations[RegExp.$2] + ")";
    }
    if (originalStr.match(regex_toCommander)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "作为对对手的" + trans_from_dict(RegExp.$2) + "发号施令的要员而被对手的" + trans_from_dict(RegExp.$3) + "吞下去了！";
    }
    if (originalStr.match(regex_Commander)) {
        return  trans_from_dict(RegExp.$1) + "作为对" + trans_from_dict(RegExp.$2) + "发号施令的要员而被" + trans_from_dict(RegExp.$3) + "吞下去了！";
    }
    if(originalStr.match(regex_timer_on)){
        return "战斗计时器已开启：玩家若不行动则在时间耗尽后输掉比赛。(由" + RegExp.$1 + "开启)";
    }
    if (originalStr.match(regex_reconnected)) {
        return RegExp.$1 + "重新连接了，还剩" + RegExp.$2 + "秒。";
    }
    if (originalStr.match(regex_seconds_left2)) {
        return RegExp.$1 + "本回合还剩" + RegExp.$2 + "秒。";
    }
    if (originalStr.match(regex_seconds_left)) {
        return RegExp.$1 + "还剩" + RegExp.$2 + "秒。";
    }
    if (originalStr.match(regex_reset_timer)) {
        return "还剩" + RegExp.$1 + "秒可以重新开启计时器。";
    }
    if (originalStr.match(regex_tostruggle)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "没有可用来施展的招式！";
    }
    if (originalStr.match(regex_struggle)) {
        return  trans_from_dict(RegExp.$1) + "没有可用来施展的招式！";
    }
    if (originalStr.match(regex_sent_out_first2)) {
        return  "将首先派出" + translations[RegExp.$1] + "和" + translations[RegExp.$2] + "。";
    }
    if (originalStr.match(regex_sent_out_first)) {
        return  "将首先派出" + translations[RegExp.$1] + "。";
    }
    if (originalStr.match(regex_sent_out2)) {
        return  RegExp.$1 + "派出了" + trans_from_dict(RegExp.$2) + "(";
    }
    if (originalStr.match(regex_sent_out)) {
        return  RegExp.$1 + "派出了";
    }
    if (originalStr.match(regex_withdrew)) {
        return  RegExp.$1 + "换下了" + trans_from_dict(RegExp.$2) + "！";
    }
    if (originalStr.match(regex_tolost_health)) {
        return  "(对手的" + trans_from_dict(RegExp.$1) + "失去了 " + RegExp.$2 + "% 的生命值！)";
    }
    if (originalStr.match(regex_lost_health)) {
        return  "(" + trans_from_dict(RegExp.$1) + "失去了 " + RegExp.$2 + "% 的生命值！)";
    }
    if (originalStr.match(regex_tolost_health2)) {
        return  "(对手的" + trans_from_dict(RegExp.$1) + "失去了 ";
    }
    if (originalStr.match(regex_lost_health2)) {
        return   "(" + trans_from_dict(RegExp.$1) + "失去了 ";
    }
    if (originalStr.match(regex_come_back)) {
        return trans_from_dict(RegExp.$1) + "，回来！";
    }
    if (originalStr.match(regex_go)) {
        return "去吧！" + trans_from_dict(RegExp.$1) + "(";
    }
    if (originalStr.match(regex_forfeited)) {
        return RegExp.$1 + "投降了。";
    }
    if (originalStr.match(regex_tomega)) {
        return "对手的" + trans_from_dict(RegExp.$1) + "超级进化成了超级" + translations[RegExp.$2] + "！";
    }
    if (originalStr.match(regex_mega)) {
        return trans_from_dict(RegExp.$1) + "超级进化成了超级" + translations[RegExp.$2] + "！";
    }
    if (originalStr.match(regex_tog6_mega)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "的" + translations[RegExp.$2] + "响应了" + RegExp.$3 + "的Mega手环！";
    }
    if (originalStr.match(regex_g6_mega)) {
        return  trans_from_dict(RegExp.$1) + "的" + translations[RegExp.$2] + "响应了" + RegExp.$3 + "的Mega手环！";
    }
    if (originalStr.match(regex_toafter_taunt)) {
        return "对手的" + trans_from_dict(RegExp.$1) + "受到了挑衅，无法使出" + translations[RegExp.$2].replace("节拍器", "挥指").replace("刷新", "焕然一新").replace("不开启", "定身法") + "！";
    }
    if (originalStr.match(regex_after_taunt)) {
        return trans_from_dict(RegExp.$1) + "受到了挑衅，无法使出" + translations[RegExp.$2].replace("节拍器", "挥指").replace("刷新", "焕然一新").replace("不开启", "定身法") + "！";
    }
    if (originalStr.match(regex_tocannot_use2)) {
        return "对手的" + trans_from_dict(RegExp.$1) + "无法使出" + translations[RegExp.$2].replace("节拍器", "挥指").replace("超能力", "精神强念").replace("刷新", "焕然一新").replace("不开启", "定身法") + "！";
    }
    if (originalStr.match(regex_cannot_use2)) {
        return trans_from_dict(RegExp.$1) + "无法使出" + translations[RegExp.$2].replace("节拍器", "挥指").replace("超能力", "精神强念").replace("刷新", "焕然一新").replace("不开启", "定身法") + "！";
    }
    if (originalStr.match(regex_toeat2)) {
        return "(对手的" + trans_from_dict(RegExp.$1) + "使用了" + translations[RegExp.$2] + "！)";
    }
    if (originalStr.match(regex_eat2)) {
        return "(" + trans_from_dict(RegExp.$1) + "使用了" + translations[RegExp.$2] + "！)";
    }
    if (originalStr.match(regex_toeat)) {
        return "(对手的" + trans_from_dict(RegExp.$1) + "吃掉了" + translations[RegExp.$2] + "！)";
    }
    if (originalStr.match(regex_eat)) {
        return "(" + trans_from_dict(RegExp.$1) + "吃掉了" + translations[RegExp.$2] + "！)";
    }
    if (originalStr.match(regex_move_no_effect)) {
        return "(这对" + trans_from_dict(RegExp.$1) + trans_from_dict(RegExp.$2) + "没有效果)";
    }
    if (originalStr.match(regex_tomax_guard)) {
        return  "(对手的" + trans_from_dict(RegExp.$1) + "展开了极巨防壁！)";
    }
    if (originalStr.match(regex_max_guard)) {
        return  "(" + trans_from_dict(RegExp.$1) + "展开了极巨防壁！)";
    }
    if (originalStr.match(regex_topointed_stones)) {
        return "尖锐的岩石扎进了对手的" + trans_from_dict(RegExp.$1) + "的体内！";
    }
    if (originalStr.match(regex_pointed_stones)) {
        return "尖锐的岩石扎进了" + trans_from_dict(RegExp.$1) + "的体内！";
    }
    if (originalStr.match(regex_tofuture_sight)) {
        return "对手的" + trans_from_dict(RegExp.$1) + "预知了未来的攻击！";
    }
    if (originalStr.match(regex_future_sight)) {
        return trans_from_dict(RegExp.$1) + "预知了未来的攻击！";
    }
    if (originalStr.match(regex_toFutureSight_DoomDesire_attack)) {
        return "对手的" + trans_from_dict(RegExp.$1) + "受到了" + trans_from_dict(RegExp.$2 == "Future Sight" ? "预知未来" : "破灭之愿") + "的攻击！";
    }
    if (originalStr.match(regex_FutureSight_DoomDesire_attack)) {
        return trans_from_dict(RegExp.$1) + "受到了" + trans_from_dict(RegExp.$2 == "Future Sight" ? "预知未来" : "破灭之愿") + "的攻击！";
    }
    if (originalStr.match(regex_totype_change)) {
        return "对手的" +  trans_from_dict(RegExp.$1) + "变成了" + translations[RegExp.$2] + "属性！";
    }
    if (originalStr.match(regex_type_change)) {
        return  trans_from_dict(RegExp.$1) + "变成了" + translations[RegExp.$2] + "属性！";
    }
    if (originalStr.match(regex_hit_times)) {
        return "击中了" + RegExp.$1 + "次！";
    }
    if (originalStr.match(regex_start_battle)) {
        return RegExp.$1 + " 与 " + RegExp.$2 + " 的对战开始了！";
    }
    if (originalStr.match(regex_touturn)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "回到了" + RegExp.$2 + "的身边！";
    }
    if (originalStr.match(regex_uturn)) {
        return   trans_from_dict(RegExp.$1) + "回到了" + RegExp.$2 + "的身边！";
    }
    if (originalStr.match(regex_tomagic_bounce)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "把" + translations[RegExp.$2].replace("不开启", "定身法") + "反射了回去！";
    }
    if (originalStr.match(regex_magic_bounce)) {
        return  trans_from_dict(RegExp.$1) + "把" + translations[RegExp.$2].replace("不开启", "定身法") + "反射了回去！";
    }
    if (originalStr.match(regex_togems)) {
        return translations[RegExp.$1] + "提升了对手的" + trans_from_dict(RegExp.$2) + "的威力！";
    }
    if (originalStr.match(regex_gems)) {
        return translations[RegExp.$1] + "提升了" + trans_from_dict(RegExp.$2) + "的威力！";
    }
    if (originalStr.match(regex_battle)) {
        return RegExp.$1 + "想要战斗！";
    }
    if (originalStr.match(regex_cancelled)) {
        return RegExp.$1 + "取消了战斗。";
    }
    if (originalStr.match(regex_wftcy)) {
        return  "等待" + RegExp.$1 + "挑战您";
    }
    if (originalStr.match(regex_waitingavailable)) {
        return "等待战斗开始" + RegExp.$1;
    }
    if (originalStr.match(regex_waiting)) {
        return "等待" + RegExp.$1;
    }
    if (originalStr.match(regex_accepted)) {
        return RegExp.$1 + "接受了挑战，对战开始 «";
    }
    if (originalStr.match(regex_copyofuntitled2)) {
        return  trans_from_dict(RegExp.$1 == "Untitled" ? "无标题 " : "箱子 ") + RegExp.$2 + " - 副本 - 副本";
    }
    if (originalStr.match(regex_copyofuntitled)) {
        return  trans_from_dict(RegExp.$1 == "Untitled" ? "无标题 " : "箱子 ") + RegExp.$2 + " - 副本";
    }
    if (originalStr.match(regex_copyof)) {
        return RegExp.$1 + " - 副本";
    }
    if (originalStr.match(regex_untitled)) {
        return  trans_from_dict(RegExp.$1 == "Untitled" ? "无标题 " : "箱子 ") + RegExp.$2;
    }
    if (originalStr.match(regex_newteam)) {
        return "新的" + RegExp.$1 + "队伍";
    }
    if (originalStr.match(regex_users2)) {
        return  "(" +RegExp.$1 + "位用户)";
    }
    if (originalStr.match(regex_users)) {
        return  RegExp.$1 + "位用户";
    }
    if (originalStr.match(regex_theopposingfainted)) {
        return "对手的" +  trans_from_dict(RegExp.$1) + "倒下了！";
    }
    if (originalStr.match(regex_fainted)) {
        return trans_from_dict(RegExp.$1) + "倒下了！";
    }
    if (originalStr.match(regex_torestored_littlehp_using)) {
        return "对手的" + trans_from_dict(RegExp.$1) + "用" + trans_from_dict(RegExp.$2 == "Leftovers" ? "吃剩的东西" : RegExp.$2 == "Shell Bell"  ? "贝壳之铃" : "黑色污泥")  + "回复了少许HP。";
    }
    if (originalStr.match(regex_restored_littlehp_using)) {
        return  trans_from_dict(RegExp.$1) + "用" + trans_from_dict(RegExp.$2 == "Leftovers" ? "吃剩的东西" : RegExp.$2 == "Shell Bell"  ? "贝壳之铃" : "黑色污泥") + "回复了少许HP。";
    }
    if (originalStr.match(regex_wish)) {
        return trans_from_dict(RegExp.$1) + "的祈愿实现了！";
    }
    if (originalStr.match(regex_doestaffecttd)) {
        return "对于对手的" + trans_from_dict(RegExp.$1) + "，好像没有效果......";
    }
    if (originalStr.match(regex_doestaffect)) {
        return "对于" + trans_from_dict(RegExp.$1) + "，好像没有效果......";
    }
    if (originalStr.match(regex_younoteams)) {
        return "您没有" + RegExp.$1 + "队伍";
    }
    if (originalStr.match(regex_youdontha)) {
        return "您没有任何" + RegExp.$1 + "队伍";
    }
    if (originalStr.match(regex_theinverted)) {
        return "对手的" + trans_from_dict(RegExp.$1) + "的能力变化颠倒过来了！";
    }
    if (originalStr.match(regex_inverted)) {
        return  trans_from_dict(RegExp.$1) + "的能力变化颠倒过来了！";
    }
    if (originalStr.match(regex_rejectchallenge)) {
        return  RegExp.$1 + "拒绝了挑战。";
    }
    if (originalStr.match(regex_thesustookto)) {
        return  "替身代替对手的" + trans_from_dict(RegExp.$1) + "承受了攻击！";
    }
    if (originalStr.match(regex_thesustook)) {
        return  "替身代替" + trans_from_dict(RegExp.$1) + "承受了攻击！";
    }
    if (originalStr.match(regex_totohbawi)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "受到了来自对手的" + trans_from_dict(RegExp.$2) + "的死缠烂打！";
    }
    if (originalStr.match(regex_tohbawi2)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "受到了来自" + trans_from_dict(RegExp.$2) + "的死缠烂打！";
    }
    if (originalStr.match(regex_tohbawi)) {
        return  trans_from_dict(RegExp.$1) + "受到了来自对手的" + trans_from_dict(RegExp.$2) + "的死缠烂打！";
    }
    if (originalStr.match(regex_hbawi)) {
        return  trans_from_dict(RegExp.$1) + "受到了来自" + trans_from_dict(RegExp.$2) + "的死缠烂打！";
    }
    if (originalStr.match(regex_iseoto)) {
        return  "这对对手的" + trans_from_dict(RegExp.$1) + "效果绝佳！";
    }
    if (originalStr.match(regex_iseo)) {
        return  "这对" + trans_from_dict(RegExp.$1) + "效果绝佳！";
    }
    if (originalStr.match(regex_isnveoto)) {
        return  "这对对手的" + trans_from_dict(RegExp.$1) + "效果不好。";
    }
    if (originalStr.match(regex_isnveo)) {
        return  "这对" + trans_from_dict(RegExp.$1) + "效果不好。";
    }
    if (originalStr.match(regex_achoto)) {
        return  "击中了对手的" + trans_from_dict(RegExp.$1) + "的要害！";
    }
    if (originalStr.match(regex_acho)) {
        return  "击中了" + trans_from_dict(RegExp.$1) + "的要害！";
    }
    if (originalStr.match(regex_willswitchin)) {
        return   translations[RegExp.$1] + "将替换" + translations[RegExp.$2] + "上场。";
    }
    if (originalStr.match(regex_challengex)) {
        return  "挑战" + RegExp.$1;
    }
    if (originalStr.match(regex_uteamsvf)) {
        return  "您的队伍在" + RegExp.$1 + "分级中合法。";
    }
    if (originalStr.match(regex_Metronome)) {
        return  "挥动手指后，使出了" + translations[RegExp.$1].replace("超能力", "精神强念").replace("刷新", "焕然一新").replace("不开启", "定身法") + "！";
    }
    if (originalStr.match(regex_toiatbabi)) {
        return  "对手的" + trans_from_dict(RegExp.$1) +"被" + translations[RegExp.$2] + "袭击了！";
    }
    if (originalStr.match(regex_iatbabi)) {
        return  trans_from_dict(RegExp.$1) +"被" + translations[RegExp.$2] + "袭击了！";
    }
    if (originalStr.match(regex_toctop2)) {
        return  "对手的" + trans_from_dict(RegExp.$1) +"腐蚀了对手的" + trans_from_dict(RegExp.$2) + "的" + translations[RegExp.$3] + "！";
    }
    if (originalStr.match(regex_toctop)) {
        return  "对手的" + trans_from_dict(RegExp.$1) +"腐蚀了" + trans_from_dict(RegExp.$2) + "的" + translations[RegExp.$3] + "！";
    }
    if (originalStr.match(regex_ctop)) {
        return  trans_from_dict(RegExp.$1) +"腐蚀了对手的" + trans_from_dict(RegExp.$2) + "的" + translations[RegExp.$3] + "！";
    }
    if (originalStr.match(regex_ctop2)) {
        return  trans_from_dict(RegExp.$1) +"腐蚀了" + trans_from_dict(RegExp.$2) + "的" + translations[RegExp.$3] + "！";
    }
    if (originalStr.match(regex_biftato)) {
        return  "但是，对对手的" + trans_from_dict(RegExp.$1) + "没有起到效果！！";
    }
    if (originalStr.match(regex_bifta)) {
        return  "但是，对" + trans_from_dict(RegExp.$1) + "没有起到效果！！";
    }
    if (originalStr.match(regex_toshpif)) {
        return  "但是，对手的" + trans_from_dict(RegExp.$1) + "的体力是全满的！";
    }
    if (originalStr.match(regex_shpif)) {
        return  "但是，" + trans_from_dict(RegExp.$1) + "的体力是全满的！";
    }
    if (originalStr.match(regex_tobiuiz)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "利用Z力量强化了自身的" + translations[RegExp.$2] + "！";
    }
    if (originalStr.match(regex_biuiz)) {
        return  trans_from_dict(RegExp.$1) + "利用Z力量强化了自身的" + translations[RegExp.$2] + "！";
    }
    if (originalStr.match(regex_thwctfto)) {
        return  "治愈愿望在对手的" + trans_from_dict(RegExp.$1) + "身上实现了！";
    }
    if (originalStr.match(regex_thwctf)) {
        return  "治愈愿望在" + trans_from_dict(RegExp.$1) + "身上实现了！";
    }
    if (originalStr.match(regex_sfwhrtorm)) {
        return  RegExp.$1 + "衷心的祈愿传递到了对手的" + translations[RegExp.$2].replace("烈空坐-超级进化", "烈空坐") + "那里！";
    }
    if (originalStr.match(regex_sfwhrrm)) {
        return  RegExp.$1 + "衷心的祈愿传递到了" + translations[RegExp.$2].replace("烈空坐-超级进化", "烈空坐") + "那里！";
    }
    if (originalStr.match(regex_protosynthesisto)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "通过大晴天发动了古代活性！";
    }
    if (originalStr.match(regex_protosynthesis)) {
        return  trans_from_dict(RegExp.$1) + "通过大晴天发动了古代活性！";
    }
    if (originalStr.match(regex_protosynthesisoffto)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "的古代活性的效果消失了！";
    }
    if (originalStr.match(regex_protosynthesisoff)) {
        return  trans_from_dict(RegExp.$1) + "的古代活性的效果消失了！";
    }
    if (originalStr.match(regex_toquarkdrive)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "通过电气场地发动了夸克充能！";
    }
    if (originalStr.match(regex_quarkdrive)) {
        return  trans_from_dict(RegExp.$1) + "通过电气场地发动了夸克充能！";
    }
    if (originalStr.match(regex_toquarkdriveoff)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "的夸克充能的效果消失了！";
    }
    if (originalStr.match(regex_quarkdriveoff)) {
        return  trans_from_dict(RegExp.$1) + "的夸克充能的效果消失了！";
    }
    if (originalStr.match(regex_toelectric_seed)) {
        return  "对手的" + trans_from_dict(RegExp.$2) + "用电气种子" + trans_from_dict(RegExp.$1 == "sharply raised" ? "大幅提升" : RegExp.$1 == "raised"  ? "提升" : "降低") + "了防御！";
    }
    if (originalStr.match(regex_electric_seed)) {
        return  trans_from_dict(RegExp.$2) + "用电气种子" + trans_from_dict(RegExp.$1 == "sharply raised" ? "大幅提升" : RegExp.$1 == "raised"  ? "提升" : "降低") + "了防御！";
    }
    if (originalStr.match(regex_tograssy_seed)) {
        return  "对手的" + trans_from_dict(RegExp.$2) + "用青草种子" + trans_from_dict(RegExp.$1 == "sharply raised" ? "大幅提升" : RegExp.$1 == "raised"  ? "提升" : "降低") + "了防御！";
    }
    if (originalStr.match(regex_grassy_seed)) {
        return  trans_from_dict(RegExp.$2) + "用青草种子" + trans_from_dict(RegExp.$1 == "sharply raised" ? "大幅提升" : RegExp.$1 == "raised"  ? "提升" : "降低") + "了防御！";
    }
    if (originalStr.match(regex_topsychic_seed)) {
        return  "对手的" + trans_from_dict(RegExp.$2) + "用精神种子" + trans_from_dict(RegExp.$1 == "sharply raised" ? "大幅提升" : RegExp.$1 == "raised"  ? "提升" : "降低") + "了特防！";
    }
    if (originalStr.match(regex_psychic_seed)) {
        return  trans_from_dict(RegExp.$2) + "用精神种子" + trans_from_dict(RegExp.$1 == "sharply raised" ? "大幅提升" : RegExp.$1 == "raised"  ? "提升" : "降低") + "了特防！";
    }
    if (originalStr.match(regex_tomisty_seed)) {
        return  "对手的" + trans_from_dict(RegExp.$2) + "用薄雾种子" + trans_from_dict(RegExp.$1 == "sharply raised" ? "大幅提升" : RegExp.$1 == "raised"  ? "提升" : "降低") + "了特防！";
    }
    if (originalStr.match(regex_misty_seed)) {
        return  trans_from_dict(RegExp.$2) + "用薄雾种子" + trans_from_dict(RegExp.$1 == "sharply raised" ? "大幅提升" : RegExp.$1 == "raised"  ? "提升" : "降低") + "了特防！";
    }
    if (originalStr.match(regex_tobroke)) {
        return  "突破了对手的" + trans_from_dict(RegExp.$1) + "的守护！";
    }
    if (originalStr.match(regex_broke)) {
        return  "突破了" + trans_from_dict(RegExp.$1) + "的守护！";
    }
    if (originalStr.match(regex_totoredcard)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "猛地向对手的" + trans_from_dict(RegExp.$2) + "出示了红牌！";
    }
    if (originalStr.match(regex_toredcard2)) {
        return  trans_from_dict(RegExp.$1) + "猛地向" + trans_from_dict(RegExp.$2) + "出示了红牌！";
    }
    if (originalStr.match(regex_toredcard)) {
        return  trans_from_dict(RegExp.$1) + "猛地向对手的" + trans_from_dict(RegExp.$2) + "出示了红牌！";
    }
    if (originalStr.match(regex_redcard)) {
        return  trans_from_dict(RegExp.$1) + "猛地向" + trans_from_dict(RegExp.$2) + "出示了红牌！";
    }
    if (originalStr.match(regex_towindpower)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "受到顺风而充电了！";
    }
    if (originalStr.match(regex_windpower)) {
        return  trans_from_dict(RegExp.$1) + "受到顺风而充电了！";
    }
    if (originalStr.match(regex_torevivalblessing)) {
        return  "对手的" +  trans_from_dict(RegExp.$1) + "复活并能继续战斗了！";
    }
    if (originalStr.match(regex_revivalblessing)) {
        return  trans_from_dict(RegExp.$1) + "复活并能继续战斗了！";
    }
    if (originalStr.match(regex_toclearamulet)) {
        return  "因为清净坠饰的效果，无法降低对手的" + trans_from_dict(RegExp.$1) + "的能力！";
    }
    if (originalStr.match(regex_clearamulet)) {
        return  "因为清净坠饰的效果，无法降低" + trans_from_dict(RegExp.$1) + "的能力！";
    }
    if (originalStr.match(regex_toskullbash)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "把头缩进去了！";
    }
    if (originalStr.match(regex_skullbash)) {
        return   trans_from_dict(RegExp.$1) + "把头缩进去了！";
    }
    if (originalStr.match(regex_totofrisk)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "察觉到了对手的" + trans_from_dict(RegExp.$2) + "的" + translations[RegExp.$3] + "！";
    }
    if (originalStr.match(regex_tofrisk2)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "察觉到了" + trans_from_dict(RegExp.$2) + "的" + translations[RegExp.$3] + "！";
    }
    if (originalStr.match(regex_tofrisk)) {
        return   trans_from_dict(RegExp.$1) + "察觉到了对手的" + trans_from_dict(RegExp.$2) + "的" + translations[RegExp.$3] + "！";
    }
    if (originalStr.match(regex_frisk)) {
        return   trans_from_dict(RegExp.$1) + "察觉到了" + trans_from_dict(RegExp.$2) + "的" + translations[RegExp.$3] + "！";
    }
    if (originalStr.match(regex_totopsychup)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "复制了对手的" + trans_from_dict(RegExp.$2) + "的能力变化！";
    }
    if (originalStr.match(regex_topsychup2)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "复制了" + trans_from_dict(RegExp.$2) + "的能力变化！";
    }
    if (originalStr.match(regex_topsychup)) {
        return   trans_from_dict(RegExp.$1) + "复制了对手的" + trans_from_dict(RegExp.$2) + "的能力变化！";
    }
    if (originalStr.match(regex_psychup)) {
        return   trans_from_dict(RegExp.$1) + "复制了" + trans_from_dict(RegExp.$2) + "的能力变化！";
    }
    if (originalStr.match(regex_toencore)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "的再来一次状态解除了！";
    }
    if (originalStr.match(regex_encore)) {
        return   trans_from_dict(RegExp.$1) + "的再来一次状态解除了！";
    }
    if (originalStr.match(regex_totocurse)) {
        return  "对手的" +  trans_from_dict(RegExp.$1) + "削减了自己的HP，并诅咒了对手的" + trans_from_dict(RegExp.$2) + "！";
    }
    if (originalStr.match(regex_tocurse2)) {
        return  "对手的" +  trans_from_dict(RegExp.$1) + "削减了自己的HP，并诅咒了" + trans_from_dict(RegExp.$2) + "！";
    }
    if (originalStr.match(regex_tocurse)) {
        return  trans_from_dict(RegExp.$1) + "削减了自己的HP，并诅咒了对手的" + trans_from_dict(RegExp.$2) + "！";
    }
    if (originalStr.match(regex_curse)) {
        return  trans_from_dict(RegExp.$1) + "削减了自己的HP，并诅咒了" + trans_from_dict(RegExp.$2) + "！";
    }
    if (originalStr.match(regex_toweakdamageberry)) {
        return   translations[RegExp.$1] + "减轻了对对手的" + trans_from_dict(RegExp.$2) + "造成的伤害！";
    }
    if (originalStr.match(regex_weakdamageberry)) {
        return   translations[RegExp.$1] + "减轻了对" + trans_from_dict(RegExp.$2) + "造成的伤害！";
    }
    if (originalStr.match(regex_celebrate)) {
        return  "恭喜恭喜！" + RegExp.$1 + "！";
    }
    if (originalStr.match(regex_tohpberry)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "用" + translations[RegExp.$2] + "回复了体力！";
    }
    if (originalStr.match(regex_hpberry)) {
        return  trans_from_dict(RegExp.$1) + "用" + translations[RegExp.$2] + "回复了体力！";
    }
    if (originalStr.match(regex_toaquaring)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "通过水环回复了体力！";
    }
    if (originalStr.match(regex_aquaring)) {
        return   trans_from_dict(RegExp.$1) + "通过水环回复了体力！";
    }
    if (originalStr.match(regex_tosalacberry)) {
        return   "对手的"  + trans_from_dict(RegExp.$2) + "用沙鳞果" + trans_from_dict(RegExp.$1 == "sharply raised" ? "大幅提升" : RegExp.$1 == "raised"  ? "提升" : "降低") + "了速度！";
    }
    if (originalStr.match(regex_salacberry)) {
        return   trans_from_dict(RegExp.$2) + "用沙鳞果" + trans_from_dict(RegExp.$1 == "sharply raised" ? "大幅提升" : RegExp.$1 == "raised"  ? "提升" : "降低") + "了速度！";
    }
    if (originalStr.match(regex_toliechiberry)) {
        return   "对手的"  + trans_from_dict(RegExp.$2) + "用枝荔果" + trans_from_dict(RegExp.$1 == "sharply raised" ? "大幅提升" : RegExp.$1 == "raised"  ? "提升" : "降低") + "了攻击！";
    }
    if (originalStr.match(regex_liechiberry)) {
        return   trans_from_dict(RegExp.$2) + "用枝荔果" + trans_from_dict(RegExp.$1 == "sharply raised" ? "大幅提升" : RegExp.$1 == "raised"  ? "提升" : "降低") + "了攻击！";
    }
    if (originalStr.match(regex_topetayaberry)) {
        return   "对手的"  + trans_from_dict(RegExp.$2) + "用龙火果" + trans_from_dict(RegExp.$1 == "sharply raised" ? "大幅提升" : RegExp.$1 == "raised"  ? "提升" : "降低") + "了特攻！";
    }
    if (originalStr.match(regex_petayaberry)) {
        return   trans_from_dict(RegExp.$2) + "用龙火果" + trans_from_dict(RegExp.$1 == "sharply raised" ? "大幅提升" : RegExp.$1 == "raised"  ? "提升" : "降低") + "了特攻！";
    }
    if (originalStr.match(regex_toapicotberry)) {
        return   "对手的"  + trans_from_dict(RegExp.$2) + "用杏仔果" + trans_from_dict(RegExp.$1 == "sharply raised" ? "大幅提升" : RegExp.$1 == "raised"  ? "提升" : "降低") + "了特防！";
    }
    if (originalStr.match(regex_apicotberry)) {
        return   trans_from_dict(RegExp.$2) + "用杏仔果" + trans_from_dict(RegExp.$1 == "sharply raised" ? "大幅提升" : RegExp.$1 == "raised"  ? "提升" : "降低") + "了特防！";
    }
    if (originalStr.match(regex_toganlonberry)) {
        return   "对手的"  + trans_from_dict(RegExp.$2) + "用龙睛果" + trans_from_dict(RegExp.$1 == "sharply raised" ? "大幅提升" : RegExp.$1 == "raised"  ? "提升" : "降低") + "了防御！";
    }
    if (originalStr.match(regex_ganlonberry)) {
        return   trans_from_dict(RegExp.$2) + "用龙睛果" + trans_from_dict(RegExp.$1 == "sharply raised" ? "大幅提升" : RegExp.$1 == "raised"  ? "提升" : "降低") + "了防御！";
    }
    if (originalStr.match(regex_tomarangaberry)) {
        return   "对手的"  + trans_from_dict(RegExp.$2) + "用香罗果" + trans_from_dict(RegExp.$1 == "sharply raised" ? "大幅提升" : RegExp.$1 == "raised"  ? "提升" : "降低") + "了特防！";
    }
    if (originalStr.match(regex_marangaberry)) {
        return   trans_from_dict(RegExp.$2) + "用香罗果" + trans_from_dict(RegExp.$1 == "sharply raised" ? "大幅提升" : RegExp.$1 == "raised"  ? "提升" : "降低") + "了特防！";
    }
    if (originalStr.match(regex_toLuminous_Moss)) {
        return   "对手的"  + trans_from_dict(RegExp.$2) + "用光苔" + trans_from_dict(RegExp.$1 == "sharply raised" ? "大幅提升" : RegExp.$1 == "raised"  ? "提升" : "降低") + "了特防！";
    }
    if (originalStr.match(regex_Luminous_Moss)) {
        return   trans_from_dict(RegExp.$2) + "用光苔" + trans_from_dict(RegExp.$1 == "sharply raised" ? "大幅提升" : RegExp.$1 == "raised"  ? "提升" : "降低") + "了特防！";
    }
    if (originalStr.match(regex_toKee_Berry)) {
        return   "对手的"  + trans_from_dict(RegExp.$2) + "用亚开果" + trans_from_dict(RegExp.$1 == "sharply raised" ? "大幅提升" : RegExp.$1 == "raised"  ? "提升" : "降低") + "了防御！";
    }
    if (originalStr.match(regex_Kee_Berry)) {
        return   trans_from_dict(RegExp.$2) + "用亚开果" + trans_from_dict(RegExp.$1 == "sharply raised" ? "大幅提升" : RegExp.$1 == "raised"  ? "提升" : "降低") + "了防御！";
    }
    if (originalStr.match(regex_toSnowball)) {
        return   "对手的"  + trans_from_dict(RegExp.$2) + "用雪球" + trans_from_dict(RegExp.$1 == "sharply raised" ? "大幅提升" : RegExp.$1 == "raised"  ? "提升" : "降低") + "了攻击！";
    }
    if (originalStr.match(regex_Snowball)) {
        return   trans_from_dict(RegExp.$2) + "用雪球" + trans_from_dict(RegExp.$1 == "sharply raised" ? "大幅提升" : RegExp.$1 == "raised"  ? "提升" : "降低") + "了攻击！";
    }
    if (originalStr.match(regex_toAbsorb_Bulb)) {
        return   "对手的"  + trans_from_dict(RegExp.$2) + "用球根" + trans_from_dict(RegExp.$1 == "sharply raised" ? "大幅提升" : RegExp.$1 == "raised"  ? "提升" : "降低") + "了特攻！";
    }
    if (originalStr.match(regex_Absorb_Bulb)) {
        return   trans_from_dict(RegExp.$2) + "用球根" + trans_from_dict(RegExp.$1 == "sharply raised" ? "大幅提升" : RegExp.$1 == "raised"  ? "提升" : "降低") + "了特攻！";
    }
    if (originalStr.match(regex_toCell_Bettery)) {
        return   "对手的"  + trans_from_dict(RegExp.$2) + "用充电电池" + trans_from_dict(RegExp.$1 == "sharply raised" ? "大幅提升" : RegExp.$1 == "raised"  ? "提升" : "降低") + "了攻击！";
    }
    if (originalStr.match(regex_Cell_Bettery)) {
        return   trans_from_dict(RegExp.$2) + "用充电电池" + trans_from_dict(RegExp.$1 == "sharply raised" ? "大幅提升" : RegExp.$1 == "raised"  ? "提升" : "降低") + "了攻击！";
    }
    if (originalStr.match(regex_toAdrenaline_Orb)) {
        return   "对手的"  + trans_from_dict(RegExp.$2) + "用胆怯球" + trans_from_dict(RegExp.$1 == "sharply raised" ? "大幅提升" : RegExp.$1 == "raised"  ? "提升" : "降低") + "了速度！";
    }
    if (originalStr.match(regex_Adrenaline_Orb)) {
        return   trans_from_dict(RegExp.$2) + "用胆怯球" + trans_from_dict(RegExp.$1 == "sharply raised" ? "大幅提升" : RegExp.$1 == "raised"  ? "提升" : "降低") + "了速度！";
    }
    if (originalStr.match(regex_tothroatspray)) {
        return   "对手的" + trans_from_dict(RegExp.$2) + "用爽喉喷雾" + trans_from_dict(RegExp.$1 == "sharply raised" ? "大幅提升" : RegExp.$1 == "raised"  ? "提升" : "降低") + "特攻！";
    }
    if (originalStr.match(regex_throatspray)) {
        return   trans_from_dict(RegExp.$2) + "用爽喉喷雾" + trans_from_dict(RegExp.$1 == "sharply raised" ? "大幅提升" : RegExp.$1 == "raised"  ? "提升" : "降低") + "特攻！";
    }
    if (originalStr.match(regex_toclearsmog)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "的能力变化消失了！";
    }
    if (originalStr.match(regex_tosafety_goggles)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "因防尘护目镜而不会受到" + translations[RegExp.$2] + "的攻击！";
    }
    if (originalStr.match(regex_safety_goggles)) {
        return   trans_from_dict(RegExp.$1) + "因防尘护目镜而不会受到" + translations[RegExp.$2] + "的攻击！";
    }
    if (originalStr.match(regex_totohelpinghand)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "摆出了帮助对手的" + trans_from_dict(RegExp.$2) + "的架势！";
    }
    if (originalStr.match(regex_tohelpinghand2)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "摆出了帮助" + trans_from_dict(RegExp.$2) + "的架势！";
    }
    if (originalStr.match(regex_tohelpinghand)) {
        return   trans_from_dict(RegExp.$1) + "摆出了帮助对手的" + trans_from_dict(RegExp.$2) + "的架势！";
    }
    if (originalStr.match(regex_helpinghand)) {
        return   trans_from_dict(RegExp.$1) + "摆出了帮助" + trans_from_dict(RegExp.$2) + "的架势！";
    }
    if (originalStr.match(regex_clearsmog)) {
        return   trans_from_dict(RegExp.$1) + "的能力变化消失了！";
    }
    if (originalStr.match(regex_toharvest)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "收获了" + translations[RegExp.$2] + "！";
    }
    if (originalStr.match(regex_harvest)) {
        return   trans_from_dict(RegExp.$1) + "收获了" + translations[RegExp.$2] + "！";
    }
    if (originalStr.match(regex_toallyswitch)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "和对手的" + trans_from_dict(RegExp.$2) + "交换了场地！";
    }
    if (originalStr.match(regex_allyswitch)) {
        return   trans_from_dict(RegExp.$1) + "和" + trans_from_dict(RegExp.$2) + "交换了场地！";
    }
    if (originalStr.match(regex_attract)) {
        return   "对手的" + trans_from_dict(RegExp.$2) + "让" + trans_from_dict(RegExp.$1) + "着迷了！";
    }
    if (originalStr.match(regex_toattract)) {
        return   trans_from_dict(RegExp.$2) + "让对手的" + trans_from_dict(RegExp.$1) + "着迷了！";
    }
    if (originalStr.match(regex_torecycle)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "捡来了" + translations[RegExp.$2] + "！";
    }
    if (originalStr.match(regex_recycle)) {
        return   trans_from_dict(RegExp.$1) + "捡来了" + translations[RegExp.$2] + "！";
    }
    if (originalStr.match(regex_tofling)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "投掷了" + translations[RegExp.$2] + "！";
    }
    if (originalStr.match(regex_fling)) {
        return   trans_from_dict(RegExp.$1) + "投掷了" + translations[RegExp.$2] + "！";
    }
    if (originalStr.match(regex_toobtained)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "获得了" + translations[RegExp.$2] + "。";
    }
    if (originalStr.match(regex_obtained)) {
        return  trans_from_dict(RegExp.$1) + "获得了" + translations[RegExp.$2] + "。";
    }
    if (originalStr.match(regex_totolockon)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "锁定了对手的" + trans_from_dict(RegExp.$2) + "！";
    }
    if (originalStr.match(regex_tolockon2)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "锁定了" + trans_from_dict(RegExp.$2) + "！";
    }
    if (originalStr.match(regex_tolockon)) {
        return  trans_from_dict(RegExp.$1) + "锁定了对手的" + trans_from_dict(RegExp.$2) + "！";
    }
    if (originalStr.match(regex_lockon)) {
        return  trans_from_dict(RegExp.$1) + "锁定了" + trans_from_dict(RegExp.$2) + "！";
    }
    if (originalStr.match(regex_topoison)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "受到了毒的伤害！";
    }
    if (originalStr.match(regex_poison)) {
        return  trans_from_dict(RegExp.$1) + "受到了毒的伤害！";
    }
    if (originalStr.match(regex_toelectromorphosis)) {
        return  "对手的" + trans_from_dict(RegExp.$2) + "受到" + translations[RegExp.$1] + "而充电了！";
    }
    if (originalStr.match(regex_electromorphosis)) {
        return  trans_from_dict(RegExp.$2) + "受到" + translations[RegExp.$1] + "而充电了！";
    }
    if (originalStr.match(regex_torequestpending)) {
        return  "您有" + RegExp.$1 + "个好友请求待处理。";
    }
    if (originalStr.match(regex_requestpending)) {
        return  "您有" + RegExp.$1 + "个已发送的好友请求。";
    }
    if (originalStr.match(regex_blockchallenges)) {
        return  "此用户'" + RegExp.$1 + "'现在不接受挑战。";
    }
    if (originalStr.match(regex_removed)) {
        return  "好友" + RegExp.$1 + "已移除。";
    }
    if (originalStr.match(regex_removed2)) {
        return  "您现在不是" + RegExp.$1 + "的好友了。";
    }
    if (originalStr.match(regex_removed3)) {
        return  "您取消了向" + RegExp.$1 + "发送的好友请求。";
    }
    if (originalStr.match(regex_friendrequest)) {
        return  "您已经向" + RegExp.$1 + "发送了好友请求。";
    }
    if (originalStr.match(regex_friendrequest2)) {
        return  "您向" + RegExp.$1 + "发送了好友请求！";
    }
    if (originalStr.match(regex_friendrequest3)) {
        return  "您向" + RegExp.$1 + "发送了好友请求。";
    }
    if (originalStr.match(regex_acceptfriendrequest)) {
        return  "您接受了" + RegExp.$1 + "的好友请求。";
    }
    if (originalStr.match(regex_denyfriendrequest)) {
        return  "您拒绝了" + RegExp.$1 + "的好友请求。";
    }
    if (originalStr.match(regex_donothavefriendrequest)) {
        return  "您没有来自" + RegExp.$1 + "的好友请求。";
    }
    if (originalStr.match(regex_donothavefriendrequest2)) {
        return  "您没有来自" + RegExp.$1 + "的请求。";
    }
    if (originalStr.match(regex_accuracy)) {
        return  "命中: " + RegExp.$1;
    }
    if (originalStr.match(regex_basepower_double2)) {
        return   "对"+ translations[RegExp.$1] + "的威力: " + RegExp.$2 + " 至 " + RegExp.$3;
    }
    if (originalStr.match(regex_basepower_double)) {
        return  "对" + translations[RegExp.$1] + "的威力: " + RegExp.$2;
    }
    if (originalStr.match(regex_basepower2)) {
        return  "威力: " + RegExp.$1 + " 至 " + RegExp.$2;
    }
    if (originalStr.match(regex_basepower)) {
        return  "威力: " + RegExp.$1;
    }
    if (originalStr.match(regex_disconnected)) {
        return  RegExp.$1 + "断开了连接，有" + RegExp.$2 + "秒的时间重新连接！";
    }
    if (originalStr.match(regex_disconnected2)) {
        return  RegExp.$1 + "断开了连接，有一分钟的时间重新连接！";
    }
    if (originalStr.match(regex_disconnected3)) {
        return  RegExp.$1 + "断开了连接！";
    }
    if (originalStr.match(regex_usemove3)) {
        return  translations[RegExp.$1] + "将对您的" + translations[RegExp.$3] + "使用" + translations[RegExp.$2].replace("节拍器", "挥指").replace("超能力", "精神强念").replace("刷新", "焕然一新").replace("不开启", "定身法") + "。";
    }
    if (originalStr.match(regex_usemove2)) {
        return  translations[RegExp.$1] + "将对" + translations[RegExp.$3] + "使用" + translations[RegExp.$2].replace("节拍器", "挥指").replace("超能力", "精神强念").replace("刷新", "焕然一新").replace("不开启", "定身法") + "。";
    }
    if (originalStr.match(regex_usemove)) {
        return  translations[RegExp.$1] + "将使用" + translations[RegExp.$2].replace("节拍器", "挥指").replace("超能力", "精神强念").replace("刷新", "焕然一新").replace("不开启", "定身法") + "。";
    }
    if (originalStr.match(regex_reconnecte)) {
        return  RegExp.$1 + "还有" + RegExp.$2 + "秒的时间重新连接！";
    }
    if (originalStr.match(regex_toskyattack)) {
        return   "强光包围了对手的" + trans_from_dict(RegExp.$1) + "！";
    }
    if (originalStr.match(regex_skyattack)) {
        return   "强光包围了" + trans_from_dict(RegExp.$1) + "！";
    }
    if (originalStr.match(regex_todisable)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "因定身法而无法使出" + translations[RegExp.$2].replace("节拍器", "挥指").replace("超能力", "精神强念").replace("刷新", "焕然一新").replace("不开启", "定身法") + "！";
    }
    if (originalStr.match(regex_disable)) {
        return   trans_from_dict(RegExp.$1) + "因定身法而无法使出" + translations[RegExp.$2].replace("节拍器", "挥指").replace("超能力", "精神强念").replace("刷新", "焕然一新").replace("不开启", "定身法") + "！";
    }
    if (originalStr.match(regex_todisable2)) {
        return   "封住了对手的" + trans_from_dict(RegExp.$1) + "的" + translations[RegExp.$2].replace("节拍器", "挥指").replace("超能力", "精神强念").replace("刷新", "焕然一新").replace("不开启", "定身法") + "！";
    }
    if (originalStr.match(regex_disable2)) {
        return   "封住了" + trans_from_dict(RegExp.$1) + "的" + translations[RegExp.$2].replace("节拍器", "挥指").replace("超能力", "精神强念").replace("刷新", "焕然一新").replace("不开启", "定身法") + "！";
    }
    if (originalStr.match(regex_last10team)) {
        return  RegExp.$1 + "的最近10个队伍";
    }
    if (originalStr.match(regex_uploadedon)) {
        return  "上传时间: " + RegExp.$1;
    }
    if (originalStr.match(regex_format)) {
        return  "分级: " + RegExp.$1;
    }
    if (originalStr.match(regex_views)) {
        return  "查看数: " + RegExp.$1;
    }
    if (originalStr.match(regex_teampassword)) {
        return  "队伍已设置为私人。密码: " + RegExp.$1;
    }
    if (originalStr.match(regex_toskydrop)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "把" + trans_from_dict(RegExp.$2) + "带上了天空！";
    }
    if (originalStr.match(regex_skydrop)) {
        return   trans_from_dict(RegExp.$1) + "把对手的" + trans_from_dict(RegExp.$2) + "带上了天空！";
    }
    if (originalStr.match(regex_inactivity)) {
        return  RegExp.$1 + "因超时而输掉了比赛。";
    }
    if (originalStr.match(regex_deleted)) {
        return  RegExp.$1 + "已删除。";
    }
    if (originalStr.match(regex_nextdamage)) {
        return  " 下次伤害：" + RegExp.$1;
    }
    if (originalStr.match(regex_item_was_held_up)) {
        return    translations[RegExp.$1] + " (" + trans_from_dict(RegExp.$2 == "stolen" ? "窃取" : RegExp.$2 == "tricked"  ? "戏法" : RegExp.$2 == "disturbed"  ? "灵骚" : RegExp.$2 == "frisked"  ? "察觉" : RegExp.$2 == "found" ? "回收": "收获") + "; 红牌出示过了)";
    }
    if (originalStr.match(regex_item_was_popped)) {
        return    translations[RegExp.$1] + " (" + trans_from_dict(RegExp.$2 == "stolen" ? "窃取" : RegExp.$2 == "tricked"  ? "戏法" : RegExp.$2 == "disturbed"  ? "灵骚" : RegExp.$2 == "frisked"  ? "察觉" : RegExp.$2 == "found" ? "回收": "收获") + "; 气球破裂了)";
    }
    if (originalStr.match(regex_item_was_eaten)) {
        return    translations[RegExp.$1] + " (" + trans_from_dict(RegExp.$2 == "stolen" ? "窃取" : RegExp.$2 == "tricked"  ? "戏法" : RegExp.$2 == "disturbed"  ? "灵骚" : RegExp.$2 == "frisked"  ? "察觉" : RegExp.$2 == "found" ? "回收": "收获") + "; " + translations[RegExp.$3]  + "被吃掉了)";
    }
    if (originalStr.match(regex_item_was_consumed)) {
        return    translations[RegExp.$1] + " (" + trans_from_dict(RegExp.$2 == "stolen" ? "窃取" : RegExp.$2 == "tricked"  ? "戏法" : RegExp.$2 == "disturbed"  ? "灵骚" : RegExp.$2 == "frisked"  ? "察觉" : RegExp.$2 == "found" ? "回收": "收获") + "; " + translations[RegExp.$3]  + "消失了)";
    }
    if (originalStr.match(regex_item_was_stolen)) {
        return    translations[RegExp.$1] + " (" + trans_from_dict(RegExp.$2 == "stolen" ? "窃取" : RegExp.$2 == "tricked"  ? "戏法" : RegExp.$2 == "disturbed"  ? "灵骚" : RegExp.$2 == "frisked"  ? "察觉" : RegExp.$2 == "found" ? "回收": "收获") + "; " + translations[RegExp.$3]  + "被偷走了)";
    }
    if (originalStr.match(regex_item_was_flung)) {
        return    translations[RegExp.$1] + " (" + trans_from_dict(RegExp.$2 == "stolen" ? "窃取" : RegExp.$2 == "tricked"  ? "戏法" : RegExp.$2 == "disturbed"  ? "灵骚" : RegExp.$2 == "frisked"  ? "察觉" : RegExp.$2 == "found" ? "回收": "收获") + "; " + translations[RegExp.$3]  + "被投掷了)";
    }
    if (originalStr.match(regex_item_was_knockedoff)) {
        return    translations[RegExp.$1] + " (" + trans_from_dict(RegExp.$2 == "stolen" ? "窃取" : RegExp.$2 == "tricked"  ? "戏法" : RegExp.$2 == "disturbed"  ? "灵骚" : RegExp.$2 == "frisked"  ? "察觉" : RegExp.$2 == "found" ? "回收": "收获") + "; " + translations[RegExp.$3]  + "被拍落了)";
    }
    if (originalStr.match(regex_item_was_was)) {
        return    translations[RegExp.$1] + " (" + trans_from_dict(RegExp.$2 == "stolen" ? "窃取" : RegExp.$2 == "tricked"  ? "戏法" : RegExp.$2 == "disturbed"  ? "灵骚" : RegExp.$2 == "frisked"  ? "察觉" : RegExp.$2 == "found" ? "回收": "收获") + "; 之前是" + translations[RegExp.$3]  + ")";
    }
    if (originalStr.match(regex_item_held_up)) {
        return   translations[RegExp.$1] + " (红牌出示过了)";
    }
    if (originalStr.match(regex_item_popped)) {
        return   translations[RegExp.$1] + " (气球破裂了)";
    }
    if (originalStr.match(regex_item_eaten)) {
        return   translations[RegExp.$1] + " (" + translations[RegExp.$2] + "被吃掉了)";
    }
    if (originalStr.match(regex_item_consumed)) {
        return    translations[RegExp.$1] + " (" + translations[RegExp.$2] + "消失了)";
    }
    if (originalStr.match(regex_item_knockedoff)) {
        return   translations[RegExp.$1] + " (" + translations[RegExp.$2] + "被拍落了)";
    }
    if (originalStr.match(regex_item_flung)) {
        return   translations[RegExp.$1] + " (" + translations[RegExp.$2] + "被投掷了)";
    }
    if (originalStr.match(regex_item_stolen2)) {
        return   translations[RegExp.$1] + " (" + translations[RegExp.$2] + "被偷走了)";
    }
    if (originalStr.match(regex_item_incinerated)) {
        return   translations[RegExp.$1] + " (" + translations[RegExp.$2] + "被烧掉了)";
    }
    if (originalStr.match(regex_item_stolen)) {
        return   translations[RegExp.$1] + " (窃取)";
    }
    if (originalStr.match(regex_item_found)) {
        return   translations[RegExp.$1] + " (回收)";
    }
    if (originalStr.match(regex_item_harvested)) {
        return   translations[RegExp.$1] + " (收获)";
    }
    if (originalStr.match(regex_item_tricked)) {
        return   translations[RegExp.$1] + " (戏法)";
    }
    if (originalStr.match(regex_item_disturbed)) {
        return   translations[RegExp.$1] + " (灵骚)";
    }
    if (originalStr.match(regex_item_frisked)) {
        return   translations[RegExp.$1] + " (察觉)";
    }
    if (originalStr.match(regex_base)) {
        return   translations[RegExp.$1] + " (原本的特性: " + translations[RegExp.$2] + ")";
    }
    if (originalStr.match(regex_toonly)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "无法使出这个招式！";
    }
    if (originalStr.match(regex_only)) {
        return   trans_from_dict(RegExp.$1) + "无法使出这个招式！";
    }
    if (originalStr.match(regex_use3)) {
        return   translations[RegExp.$1] + "将" + trans_from_dict(RegExp.$2 == "Terastalliz" ? "太晶" : "超级进") + "化，然后对您的" +  translations[RegExp.$4] + "使用" + translations[RegExp.$3].replace("节拍器", "挥指").replace("超能力", "精神强念").replace("刷新", "焕然一新").replace("不开启", "定身法") + "。";
    }
    if (originalStr.match(regex_use2)) {
        return   translations[RegExp.$1] + "将" + trans_from_dict(RegExp.$2 == "Terastallize" ? "太晶" : RegExp.$2 == "Dynamax"  ? "极巨" : "超级进") + "化，然后对" + translations[RegExp.$4] + "使用" + translations[RegExp.$3].replace("节拍器", "挥指").replace("超能力", "精神强念").replace("刷新", "焕然一新").replace("不开启", "定身法") + "。";
    }
    if (originalStr.match(regex_use)) {
        return   translations[RegExp.$1] + "将" + trans_from_dict(RegExp.$2 == "Terastallize" ? "太晶" : RegExp.$2 == "Dynamax"  ? "极巨" : "超级进")  + "化，然后使用" + translations[RegExp.$3].replace("节拍器", "挥指").replace("超能力", "精神强念").replace("刷新", "焕然一新").replace("不开启", "定身法") + "。";
    }
    if (originalStr.match(regex_tonatural_cure)) {
        return   "(对手的" + trans_from_dict(RegExp.$1) + "通过自然回复治愈了异常状态！)";
    }
    if (originalStr.match(regex_natural_cure)) {
        return   "(" + trans_from_dict(RegExp.$1) + "通过自然回复治愈了异常状态！)";
    }
    if (originalStr.match(regex_toacquired)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "的特性变成" + translations[RegExp.$2] + "了！";
    }
    if (originalStr.match(regex_acquired)) {
        return   trans_from_dict(RegExp.$1) + "的特性变成" + translations[RegExp.$2] + "了！";
    }
    if (originalStr.match(regex_namestarting)) {
        return  "由于有玩家的名字以'" + RegExp.$1 + "'开头，这场战斗必须公开。";
    }
    if (originalStr.match(regex_toComplete_Forme)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "变成了完全体形态！";
    }
    if (originalStr.match(regex_Complete_Forme)) {
        return  trans_from_dict(RegExp.$1) + "变成了完全体形态！";
    }
    if (originalStr.match(regex_totransformed_into)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "变成了" + trans_from_dict(RegExp.$2) + "！";
    }
    if (originalStr.match(regex_transformed_into)) {
        return  trans_from_dict(RegExp.$1) + "变成了" + trans_from_dict(RegExp.$2) + "！";
    }
    if (originalStr.match(regex_wouldtake)) {
        return  "如果失去特性，将受到 " + RegExp.$1 + " 伤害";
    }
    if (originalStr.match(regex_totofollwed)) {
        return  "根据对手的" + trans_from_dict(RegExp.$2) + "的指示，对手的" + trans_from_dict(RegExp.$1) + "使出了招式！";
    }
    if (originalStr.match(regex_tofollwed2)) {
        return  "根据对手的" + trans_from_dict(RegExp.$2) + "的指示，" + trans_from_dict(RegExp.$1) + "使出了招式！";
    }
    if (originalStr.match(regex_tofollwed)) {
        return  "根据" + trans_from_dict(RegExp.$2) + "的指示，对手的" + trans_from_dict(RegExp.$1) + "使出了招式！";
    }
    if (originalStr.match(regex_follwed)) {
        return  "根据" + trans_from_dict(RegExp.$2) + "的指示，" + trans_from_dict(RegExp.$1) + "使出了招式！";
    }
    if (originalStr.match(regex_suspect)) {
        if (translations[RegExp.$2])
            return  RegExp.$1 + "正在进行" + translations[RegExp.$2] + "的可疑测试！有关如何参与测试的信息，请查看 ";
        else
            return  RegExp.$1 + "正在进行" + RegExp.$2 + "的可疑测试！有关如何参与测试的信息，请查看 ";
    }
    if (originalStr.match(regex_changed)) {
        return  "(形态改变: " + translations[RegExp.$1] + ")";
    }
    if (originalStr.match(regex_turnsasleep)) {
        return  "  睡眠回合数: " + RegExp.$1;
    }
    if (originalStr.match(regex_switchto)) {
        return  translations[RegExp.$1] + " 将交换:";
    }
    if (originalStr.match(regex_online)) {
        return   " 在线 " + RegExp.$1;
    }
    if (originalStr.match(regex_offline)) {
        return   " 离线 " + RegExp.$1;
    }
    if (originalStr.match(regex_toterastallized)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "太晶化变成了" + translations[RegExp.$2] + "属性！";
    }
    if (originalStr.match(regex_terastallized)) {
        return   trans_from_dict(RegExp.$1) + "太晶化变成了" + translations[RegExp.$2] + "属性！";
    }
    if (originalStr.match(regex_topressure)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "释放着压迫感！";
    }
    if (originalStr.match(regex_pressure)) {
        return   trans_from_dict(RegExp.$1) + "释放着压迫感！";
    }
    if (originalStr.match(regex_toseeded)) {
        return   "将种子种殖在了对手的" + trans_from_dict(RegExp.$1) + "身上！";
    }
    if (originalStr.match(regex_seeded)) {
        return   "将种子种殖在了" + trans_from_dict(RegExp.$1) + "身上！";
    }
    if (originalStr.match(regex_topoisoned)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + trans_from_dict(RegExp.$2 == "poisoned" ? "中毒了" : "中剧毒了") + "！";
    }
    if (originalStr.match(regex_poisoned)) {
        return  trans_from_dict(RegExp.$1) + trans_from_dict(RegExp.$2 == "poisoned" ? "中毒了" : "中剧毒了") + "！";
    }
    if (originalStr.match(regex_toslept)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "睡着了，并且变得精力充沛！";
    }
    if (originalStr.match(regex_slept)) {
        return  trans_from_dict(RegExp.$1) + "睡着了，并且变得精力充沛！";
    }
    if (originalStr.match(regex_toasleep)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "正在呼呼大睡。";
    }
    if (originalStr.match(regex_asleep)) {
        return  trans_from_dict(RegExp.$1) + "正在呼呼大睡。";
    }
    if (originalStr.match(regex_towoke_up)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "醒过来了！";
    }
    if (originalStr.match(regex_woke_up)) {
        return  trans_from_dict(RegExp.$1) + "醒过来了！";
    }
    if (originalStr.match(regex_toz_power)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "让Z力量笼罩了全身！";
    }
    if (originalStr.match(regex_z_power)) {
        return  trans_from_dict(RegExp.$1) + "让Z力量笼罩了全身！";
    }
    if (originalStr.match(regex_toz_move)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "开始释放全力的Z招式！";
    }
    if (originalStr.match(regex_z_move)) {
        return  trans_from_dict(RegExp.$1) + "开始释放全力的Z招式！";
    }
    if (originalStr.match(regex_toleech_seed)) {
        return  "寄生植物夺取了对手的" + trans_from_dict(RegExp.$1) + "的体力！";
    }
    if (originalStr.match(regex_leech_seed)) {
        return  "寄生植物夺取了" + trans_from_dict(RegExp.$1) + "的体力！";
    }
    if (originalStr.match(regex_toradiating_aura)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "释放着" + trans_from_dict(RegExp.$2 == "dark" ? "暗黑" : "妖精") + "气场！";
    }
    if (originalStr.match(regex_radiating_aura)) {
        return  trans_from_dict(RegExp.$1) + "释放着" + trans_from_dict(RegExp.$2 == "dark" ? "暗黑" : "妖精") + "气场！";
    }
    if (originalStr.match(regex_toradiating_aura2)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "释放着" + trans_from_dict(RegExp.$2 == "bursting" ? "溅射" : "炽热") + "气场！";
    }
    if (originalStr.match(regex_radiating_aura2)) {
        return  trans_from_dict(RegExp.$1) + "释放着" + trans_from_dict(RegExp.$2 == "bursting" ? "溅射" : "炽热") + "气场！";
    }
    if (originalStr.match(regex_toprotected)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "守护住了自己！";
    }
    if (originalStr.match(regex_protected)) {
        return  trans_from_dict(RegExp.$1) + "守护住了自己！";
    }
    if (originalStr.match(regex_totaunt)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "中了挑衅！";
    }
    if (originalStr.match(regex_taunt)) {
        return  trans_from_dict(RegExp.$1) + "中了挑衅！";
    }
    if (originalStr.match(regex_topumped)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "现在干劲十足！";
    }
    if (originalStr.match(regex_pumped)) {
        return  trans_from_dict(RegExp.$1) + "现在干劲十足！";
    }
    if (originalStr.match(regex_toavoided)) {
        return  "没有击中对手的" + trans_from_dict(RegExp.$1) + "！";
    }
    if (originalStr.match(regex_avoided)) {
        return  "没有击中" + trans_from_dict(RegExp.$1) + "！";
    }
    if (originalStr.match(regex_togrew_drowsy)) {
        return  "让对手的" + trans_from_dict(RegExp.$1) + "产生睡意了！";
    }
    if (originalStr.match(regex_grew_drowsy)) {
        return  "让" + trans_from_dict(RegExp.$1) + "产生睡意了！";
    }
    if (originalStr.match(regex_tofell_straight_down)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "被击落，掉到了地面！";
    }
    if (originalStr.match(regex_fell_straight_down)) {
        return  trans_from_dict(RegExp.$1) + "被击落，掉到了地面！";
    }
    if (originalStr.match(regex_tomust_encore)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "接受了再来一次！";
    }
    if (originalStr.match(regex_must_encore)) {
        return  trans_from_dict(RegExp.$1) + "接受了再来一次！";
    }
    if (originalStr.match(regex_toencore_ended)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "的再来一次状态解除了！";
    }
    if (originalStr.match(regex_encore_ended)) {
        return  trans_from_dict(RegExp.$1) + "的再来一次状态解除了！";
    }
    if (originalStr.match(regex_toshook_off_taunt)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "从挑衅状态中解除了！";
    }
    if (originalStr.match(regex_shook_off_taunt)) {
        return  trans_from_dict(RegExp.$1) + "从挑衅状态中解除了！";
    }
    if (originalStr.match(regex_tovortex_fieryvortex)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "被困在了" + trans_from_dict(RegExp.$2 == "vortex" ? "漩涡" : "火焰漩涡") + "之中！";
    }
    if (originalStr.match(regex_vortex_fieryvortex)) {
        return  trans_from_dict(RegExp.$1) + "被困在了" + trans_from_dict(RegExp.$2 == "vortex" ? "漩涡" : "火焰漩涡") + "之中！";
    }
    if (originalStr.match(regex_toburned_frozen)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + trans_from_dict(RegExp.$2 == "burned" ? "灼伤" : "冻住") + "了！";
    }
    if (originalStr.match(regex_burned_frozen)) {
        return  trans_from_dict(RegExp.$1) + trans_from_dict(RegExp.$2 == "burned" ? "灼伤" : "冻住") + "了！";
    }
    if (originalStr.match(regex_tospikes)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "受到了撒菱的伤害！";
    }
    if (originalStr.match(regex_spikes)) {
        return  trans_from_dict(RegExp.$1) + "受到了撒菱的伤害！";
    }
    if (originalStr.match(regex_towas_cured_of)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "治愈了" + trans_from_dict(RegExp.$2 == "Freeze" ? "冰冻" : RegExp.$2 == "Burn"  ? "灼伤" : RegExp.$2 == "Sleep"  ? "睡眠" : RegExp.$2 == "paralysis"  ? "麻痹" : "中毒") + "！";
    }
    if (originalStr.match(regex_was_cured_of)) {
        return  trans_from_dict(RegExp.$1) + "治愈了" + trans_from_dict(RegExp.$2 == "Freeze" ? "冰冻" : RegExp.$2 == "Burn"  ? "灼伤" : RegExp.$2 == "Sleep"  ? "睡眠" : RegExp.$2 == "paralysis"  ? "麻痹" : "中毒") + "！";
    }
    if (originalStr.match(regex_toput_in_substitute)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "的替身出现了！";
    }
    if (originalStr.match(regex_put_in_substitute)) {
        return   trans_from_dict(RegExp.$1) + "的替身出现了！";
    }
    if (originalStr.match(regex_tohp_restored)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "的体力回复了。";
    }
    if (originalStr.match(regex_hp_restored)) {
        return   trans_from_dict(RegExp.$1) + "的体力回复了。";
    }
    if (originalStr.match(regex_tohp_restored2)) {
        return "对手的" + trans_from_dict(RegExp.$1) + "的体力回复了！";
    }
    if (originalStr.match(regex_hp_restored2)) {
        return trans_from_dict(RegExp.$1) + "的体力回复了！";
    }
    if (originalStr.match(regex_tohp_restored3)) {
        return "对手的" + trans_from_dict(RegExp.$1) + "通过Z力量回复了体力！";
    }
    if (originalStr.match(regex_hp_restored3)) {
        return  trans_from_dict(RegExp.$1) + "通过Z力量回复了体力！";
    }
    if (originalStr.match(regex_totransformed)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "的样子发生了变化！";
    }
    if (originalStr.match(regex_transformed)) {
        return   trans_from_dict(RegExp.$1) + "的样子发生了变化！";
    }
    if (originalStr.match(regex_toconfused2)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "正在混乱中！";
    }
    if (originalStr.match(regex_confused2)) {
        return   trans_from_dict(RegExp.$1) + "正在混乱中！";
    }
    if (originalStr.match(regex_toconfused)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "混乱了！";
    }
    if (originalStr.match(regex_confused)) {
        return   trans_from_dict(RegExp.$1) + "混乱了！";
    }
    if (originalStr.match(regex_tofell_asleep)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "睡着了！";
    }
    if (originalStr.match(regex_fell_asleep)) {
        return   trans_from_dict(RegExp.$1) + "睡着了！";
    }
    if (originalStr.match(regex_tocanno_longer_escape)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "无法逃走了！";
    }
    if (originalStr.match(regex_canno_longer_escape)) {
        return   trans_from_dict(RegExp.$1) + "无法逃走了！";
    }
    if (originalStr.match(regex_tomist_safeguard)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "受到了" + trans_from_dict(RegExp.$2 == "the mist" ? "白雾" : "神秘守护") + "的保护！";
    }
    if (originalStr.match(regex_mist_safeguard)) {
        return   trans_from_dict(RegExp.$1) + "受到了" + trans_from_dict(RegExp.$2 == "the mist" ? "白雾" : "神秘守护") + "的保护！";
    }
    if (originalStr.match(regex_toprotosynthesis_quarkdrive)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "通过驱劲能量发动了" + trans_from_dict(RegExp.$2 == "Protosynthesis" ? "古代活性" : "夸克充能") + "！";
    }
    if (originalStr.match(regex_protosynthesis_quarkdrive)) {
        return   trans_from_dict(RegExp.$1) + "通过驱劲能量发动了" + trans_from_dict(RegExp.$2 == "Protosynthesis" ? "古代活性" : "夸克充能") + "！";
    }
    if (originalStr.match(regex_toair_light)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "被" + trans_from_dict(RegExp.$2 == "freezing air" ? "冷冻的空气" : "冷光") + "包围了！";
    }
    if (originalStr.match(regex_air_light)) {
        return   trans_from_dict(RegExp.$1) + "被" + trans_from_dict(RegExp.$2 == "freezing air" ? "冷冻的空气" : "冷光") + "包围了！";
    }
    if (originalStr.match(regex_todryskin_solarpower)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "因" + trans_from_dict(RegExp.$2 == "Dry Skin" ? "干燥皮肤" : "太阳能量") + "而受到了伤害。";
    }
    if (originalStr.match(regex_dryskin_solarpower)) {
        return   trans_from_dict(RegExp.$1) + "因" + trans_from_dict(RegExp.$2 == "Dry Skin" ? "干燥皮肤" : "太阳能量") + "而受到了伤害。";
    }
    if (originalStr.match(regex_todrowsing)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "处于半梦半醒状态！";
    }
    if (originalStr.match(regex_drowsing)) {
        return   trans_from_dict(RegExp.$1) + "处于半梦半醒状态！";
    }
    if (originalStr.match(regex_tobreaks_mold)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "打破了常规！";
    }
    if (originalStr.match(regex_breaks_mold)) {
        return   trans_from_dict(RegExp.$1) + "打破了常规！";
    }
    if (originalStr.match(regex_toendured_hit)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "挺住了攻击！";
    }
    if (originalStr.match(regex_endured_hit)) {
        return   trans_from_dict(RegExp.$1) + "挺住了攻击！";
    }
    if (originalStr.match(regex_toendured_hit2)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "挺住了攻击！";
    }
    if (originalStr.match(regex_endured_hit2)) {
        return   trans_from_dict(RegExp.$1) + "挺住了攻击！";
    }
    if (originalStr.match(regex_toburned_itself)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "燃尽了自身！";
    }
    if (originalStr.match(regex_burned_itself)) {
        return   trans_from_dict(RegExp.$1) + "燃尽了自身！";
    }
    if (originalStr.match(regex_toair_balloon)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "靠着气球浮在了空中！";
    }
    if (originalStr.match(regex_air_balloon)) {
        return   trans_from_dict(RegExp.$1) + "靠着气球浮在了空中！";
    }
    if (originalStr.match(regex_toalready_confused)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "已经混乱了！";
    }
    if (originalStr.match(regex_already_confused)) {
        return   trans_from_dict(RegExp.$1) + "已经混乱了！";
    }
    if (originalStr.match(regex_toswirling_magma)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "被困在了熔岩风暴之中！";
    }
    if (originalStr.match(regex_swirling_magma)) {
        return   trans_from_dict(RegExp.$1) + "被困在了熔岩风暴之中！";
    }
    if (originalStr.match(regex_toquicksand)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "陷入了流沙地狱！";
    }
    if (originalStr.match(regex_quicksand)) {
        return   trans_from_dict(RegExp.$1) + "陷入了流沙地狱！";
    }
    if (originalStr.match(regex_toconfused_fatigue)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "因精疲力尽而混乱了！";
    }
    if (originalStr.match(regex_confused_fatigue)) {
        return   trans_from_dict(RegExp.$1) + "因精疲力尽而混乱了！";
    }
    if (originalStr.match(regex_tobecame_confused)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "混乱了！";
    }
    if (originalStr.match(regex_became_confused)) {
        return   trans_from_dict(RegExp.$1) + "混乱了！";
    }
    if (originalStr.match(regex_toprevented_healing)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "的回复行为被封住了！";
    }
    if (originalStr.match(regex_prevented_healing)) {
        return   trans_from_dict(RegExp.$1) + "的回复行为被封住了！";
    }
    if (originalStr.match(regex_toquick_draw)) {
        return   "速击使对手的" + trans_from_dict(RegExp.$1) + "行动变快了！";
    }
    if (originalStr.match(regex_quick_draw)) {
        return   "速击使" + trans_from_dict(RegExp.$1) + "行动变快了！";
    }
    if (originalStr.match(regex_tosalt_cured)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "陷入了盐腌状态！";
    }
    if (originalStr.match(regex_salt_cured)) {
        return   trans_from_dict(RegExp.$1) + "陷入了盐腌状态！";
    }
    if (originalStr.match(regex_tobeing_withdrawn)) {
        return   "(对手的" + trans_from_dict(RegExp.$1) + "正在撤退......)";
    }
    if (originalStr.match(regex_being_withdrawn)) {
        return   "(" + trans_from_dict(RegExp.$1) + "正在撤退......)";
    }
    if (originalStr.match(regex_toeject_pack)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "要用避难背包回去了！";
    }
    if (originalStr.match(regex_eject_pack)) {
        return   trans_from_dict(RegExp.$1) + "要用避难背包回去了！";
    }
    if (originalStr.match(regex_toeject_button)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "要用逃脱按键回去了！";
    }
    if (originalStr.match(regex_eject_button)) {
        return   trans_from_dict(RegExp.$1) + "要用逃脱按键回去了！";
    }
    if (originalStr.match(regex_topower_herb)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "用了强力香草后，充满了力量！";
    }
    if (originalStr.match(regex_power_herb)) {
        return   trans_from_dict(RegExp.$1) + "用了强力香草后，充满了力量！";
    }
    if (originalStr.match(regex_towhite_herb)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "用白色香草复原了能力！";
    }
    if (originalStr.match(regex_white_herb)) {
        return   trans_from_dict(RegExp.$1) + "用白色香草复原了能力！";
    }
    if (originalStr.match(regex_tofocussash_focusband)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "用气势" + trans_from_dict(RegExp.$2 == "Sash" ? "披" : "头") + "带撑住了！";
    }
    if (originalStr.match(regex_focussash_focusband)) {
        return   trans_from_dict(RegExp.$1) + "用气势" + trans_from_dict(RegExp.$2 == "Sash" ? "披" : "头") + "带撑住了！";
    }
    if (originalStr.match(regex_toair_balloon_popped)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "的气球破了！";
    }
    if (originalStr.match(regex_air_balloon_popped)) {
        return   trans_from_dict(RegExp.$1) + "的气球破了！";
    }
    if (originalStr.match(regex_toshell_gleam)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "让甲壳发出光辉，使属性相克关系发生扭曲！！";
    }
    if (originalStr.match(regex_shell_gleam)) {
        return   trans_from_dict(RegExp.$1) + "让甲壳发出光辉，使属性相克关系发生扭曲！！";
    }
    if (originalStr.match(regex_toquick_claw)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "用了先制之爪后，行动变快了！";
    }
    if (originalStr.match(regex_quick_claw)) {
        return   trans_from_dict(RegExp.$1) + "用了先制之爪后，行动变快了！";
    }
    if (originalStr.match(regex_tosupreme_overlord)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "从被打倒的同伴身上得到力量了！";
    }
    if (originalStr.match(regex_supreme_overlord)) {
        return   trans_from_dict(RegExp.$1) + "从被打倒的同伴身上得到力量了！";
    }
    if (originalStr.match(regex_toabsorbed_light)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "吸收了光！";
    }
    if (originalStr.match(regex_absorbed_light)) {
        return   trans_from_dict(RegExp.$1) + "吸收了光！";
    }
    if (originalStr.match(regex_toalready_burned)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "已经被灼伤了！";
    }
    if (originalStr.match(regex_already_burned)) {
        return   trans_from_dict(RegExp.$1) + "已经被灼伤了！";
    }
    if (originalStr.match(regex_tosticky_candy_syrup)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "陷入了满身糖状态！";
    }
    if (originalStr.match(regex_sticky_candy_syrup)) {
        return   trans_from_dict(RegExp.$1) + "陷入了满身糖状态！";
    }
    if (originalStr.match(regex_togoing_all)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "拿出全力了！";
    }
    if (originalStr.match(regex_going_all)) {
        return   trans_from_dict(RegExp.$1) + "拿出全力了！";
    }
    if (originalStr.match(regex_tocreate_decoy)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "断掉尾巴并将其作为替身了！";
    }
    if (originalStr.match(regex_create_decoy)) {
        return   trans_from_dict(RegExp.$1) + "断掉尾巴并将其作为替身了！";
    }
    if (originalStr.match(regex_tocut_hp2)) {
        return   "(对手的" + trans_from_dict(RegExp.$1) + "削减生命强化了招式！)";
    }
    if (originalStr.match(regex_cut_hp2)) {
        return   "(" + trans_from_dict(RegExp.$1) + "削减生命强化了招式！)";
    }
    if (originalStr.match(regex_tocut_hp)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "削减生命强化了招式！";
    }
    if (originalStr.match(regex_cut_hp)) {
        return   trans_from_dict(RegExp.$1) + "削减生命强化了招式！";
    }
    if (originalStr.match(regex_toloses_flying)) {
        return   "(对手的" + trans_from_dict(RegExp.$1) + "本回合失去了飞行属性。)";
    }
    if (originalStr.match(regex_loses_flying)) {
        return   "(" + trans_from_dict(RegExp.$1) + "本回合失去了飞行属性。)";
    }
    if (originalStr.match(regex_toreceived_encore)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "接受了再来一次！";
    }
    if (originalStr.match(regex_received_encore)) {
        return   trans_from_dict(RegExp.$1) + "接受了再来一次！";
    }
    if (originalStr.match(regex_totoxic_orb)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "因剧毒宝珠而中剧毒了！";
    }
    if (originalStr.match(regex_toxic_orb)) {
        return   trans_from_dict(RegExp.$1) + "因剧毒宝珠而中剧毒了！";
    }
    if (originalStr.match(regex_tosticky_web)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "被黏黏网粘住了！";
    }
    if (originalStr.match(regex_sticky_web)) {
        return   trans_from_dict(RegExp.$1) + "被黏黏网粘住了！";
    }
    if (originalStr.match(regex_tonot_lowered2)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "的能力不会降低！";
    }
    if (originalStr.match(regex_not_lowered2)) {
        return   trans_from_dict(RegExp.$1) + "的能力不会降低！";
    }
    if (originalStr.match(regex_tocant_use_item)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "无法使用道具了！";
    }
    if (originalStr.match(regex_cant_use_item)) {
        return   trans_from_dict(RegExp.$1) + "无法使用道具了！";
    }
    if (originalStr.match(regex_toheal_block_off)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "的回复封印解除了！";
    }
    if (originalStr.match(regex_heal_block_off)) {
        return   trans_from_dict(RegExp.$1) + "的回复封印解除了！";
    }
    if (originalStr.match(regex_toparalyzed_cant_move)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "因身体麻痹而无法行动！";
    }
    if (originalStr.match(regex_paralyzed_cant_move)) {
        return   trans_from_dict(RegExp.$1) + "因身体麻痹而无法行动！";
    }
    if (originalStr.match(regex_toparalyzed_maybe_unable_move)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "麻痹了，很难使出招式！";
    }
    if (originalStr.match(regex_paralyzed_maybe_unable_move)) {
        return   trans_from_dict(RegExp.$1) + "麻痹了，很难使出招式！";
    }
    if (originalStr.match(regex_tosealed_moves)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "封印了对手的招式！";
    }
    if (originalStr.match(regex_sealed_moves)) {
        return   trans_from_dict(RegExp.$1) + "封印了对手的招式！";
    }
    if (originalStr.match(regex_tochose_doom)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "将破灭之愿托付给了未来！";
    }
    if (originalStr.match(regex_chose_doom)) {
        return   trans_from_dict(RegExp.$1) + "将破灭之愿托付给了未来！";
    }
    if (originalStr.match(regex_toelectromagnetism)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "因电磁力浮了起来！";
    }
    if (originalStr.match(regex_electromagnetism)) {
        return   trans_from_dict(RegExp.$1) + "因电磁力浮了起来！";
    }
    if (originalStr.match(regex_tostockpiled_off)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "的蓄力效果消失了！";
    }
    if (originalStr.match(regex_stockpiled_off)) {
        return   trans_from_dict(RegExp.$1) + "的蓄力效果消失了！";
    }
    if (originalStr.match(regex_toillusion_off)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "造成的幻觉被解除了！";
    }
    if (originalStr.match(regex_illusion_off)) {
        return   trans_from_dict(RegExp.$1) + "造成的幻觉被解除了！";
    }
    if (originalStr.match(regex_tosnapped_confusion)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "的混乱解除了！";
    }
    if (originalStr.match(regex_snapped_confusion)) {
        return   trans_from_dict(RegExp.$1) + "的混乱解除了！";
    }
    if (originalStr.match(regex_tosnapped_confusion2)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "的混乱解除了！";
    }
    if (originalStr.match(regex_snapped_confusion2)) {
        return   trans_from_dict(RegExp.$1) + "的混乱解除了！";
    }
    if (originalStr.match(regex_tosnapped_confusion3)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "的混乱解除了！";
    }
    if (originalStr.match(regex_snapped_confusion3)) {
        return   trans_from_dict(RegExp.$1) + "的混乱解除了！";
    }
    if (originalStr.match(regex_tofuturistic_engine)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "布下电气场地使未来的机关跃动起来！！";
    }
    if (originalStr.match(regex_futuristic_engine)) {
        return   trans_from_dict(RegExp.$1) + "布下电气场地使未来的机关跃动起来！！";
    }
    if (originalStr.match(regex_tofuturistic_engine2)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "用电气场地使未来的机关跃动起来！！";
    }
    if (originalStr.match(regex_futuristic_engine2)) {
        return   trans_from_dict(RegExp.$1) + "用电气场地使未来的机关跃动起来！！";
    }
    if (originalStr.match(regex_toancient_pulse)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "令日照变强，激起了古代的脉动！";
    }
    if (originalStr.match(regex_ancient_pulse)) {
        return   trans_from_dict(RegExp.$1) + "令日照变强，激起了古代的脉动！";
    }
    if (originalStr.match(regex_toancient_pulse2)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "受到日照而激起了古代的脉动！";
    }
    if (originalStr.match(regex_ancient_pulse2)) {
        return   trans_from_dict(RegExp.$1) + "受到日照而激起了古代的脉动！";
    }
    if (originalStr.match(regex_toflinched)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "畏缩了，无法使出招式！";
    }
    if (originalStr.match(regex_flinched)) {
        return   trans_from_dict(RegExp.$1) + "畏缩了，无法使出招式！";
    }
    if (originalStr.match(regex_tolost_somehp)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "的生命被少量削减了！";
    }
    if (originalStr.match(regex_lost_somehp)) {
        return   trans_from_dict(RegExp.$1) + "的生命被少量削减了！";
    }
    if (originalStr.match(regex_todamaged_recoil)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "受到了反作用力的伤害！";
    }
    if (originalStr.match(regex_damaged_recoil)) {
        return   trans_from_dict(RegExp.$1) + "受到了反作用力的伤害！";
    }
    if (originalStr.match(regex_tobuffeted_sandstorm_hail)) {
        return    trans_from_dict(RegExp.$2 == "sandstorm" ? "沙暴" : "冰雹") + "袭击了对手的" + trans_from_dict(RegExp.$1) + "！";
    }
    if (originalStr.match(regex_buffeted_sandstorm_hail)) {
        return    trans_from_dict(RegExp.$2 == "sandstorm" ? "沙暴" : "冰雹") + "袭击了" + trans_from_dict(RegExp.$1) + "！";
    }
    if (originalStr.match(regex_totormented)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "正被恶梦缠身！";
    }
    if (originalStr.match(regex_tormented)) {
        return   trans_from_dict(RegExp.$1) + "正被恶梦缠身！";
    }
    if (originalStr.match(regex_toafflicted_by_curse)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "正受到诅咒！";
    }
    if (originalStr.match(regex_afflicted_by_curse)) {
        return   trans_from_dict(RegExp.$1) + "正受到诅咒！";
    }
    if (originalStr.match(regex_tolocked_in_nightmare)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "被困在了恶梦之中！";
    }
    if (originalStr.match(regex_locked_in_nightmare)) {
        return   trans_from_dict(RegExp.$1) + "被困在了恶梦之中！";
    }
    if (originalStr.match(regex_todemaged_by_recoil)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "受到了反作用力造成的伤害！";
    }
    if (originalStr.match(regex_demaged_by_recoil)) {
        return   trans_from_dict(RegExp.$1) + "受到了反作用力造成的伤害！";
    }
    if (originalStr.match(regex_tomystical_moonlight)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "被神秘的月光包围了！";
    }
    if (originalStr.match(regex_mystical_moonlight)) {
        return   trans_from_dict(RegExp.$1) + "被神秘的月光包围了！";
    }
    if (originalStr.match(regex_towas_hurt2)) {
        return   "(对手的" + trans_from_dict(RegExp.$1) + "受伤了！)";
    }
    if (originalStr.match(regex_was_hurt2)) {
        return   "(" + trans_from_dict(RegExp.$1) + "受伤了！)";
    }
    if (originalStr.match(regex_towas_hurt)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "受伤了！";
    }
    if (originalStr.match(regex_was_hurt)) {
        return   trans_from_dict(RegExp.$1) + "受伤了！";
    }
    if (originalStr.match(regex_tofrozen_solid)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "因冻住了而无法行动！";
    }
    if (originalStr.match(regex_frozen_solid)) {
        return   trans_from_dict(RegExp.$1) + "因冻住了而无法行动！";
    }
    if (originalStr.match(regex_totwisted_dimensions)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "扭曲了时空！";
    }
    if (originalStr.match(regex_twisted_dimensions)) {
        return   trans_from_dict(RegExp.$1) + "扭曲了时空！";
    }
    if (originalStr.match(regex_toability_suppressed)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "的特性变得无效了！";
    }
    if (originalStr.match(regex_ability_suppressed)) {
        return   trans_from_dict(RegExp.$1) + "的特性变得无效了！";
    }
    if (originalStr.match(regex_tousedupall_electricity)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "用尽电力了！";
    }
    if (originalStr.match(regex_usedupall_electricity)) {
        return   trans_from_dict(RegExp.$1) + "用尽电力了！";
    }
    if (originalStr.match(regex_tono_retreat)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "受到背水一战的效果影响，无法逃走了！";
    }
    if (originalStr.match(regex_no_retreat)) {
        return   trans_from_dict(RegExp.$1) + "受到背水一战的效果影响，无法逃走了！";
    }
    if (originalStr.match(regex_dragged_out)) {
        return    trans_from_dict(RegExp.$1) + "被拖进了战斗！";
    }
    if (originalStr.match(regex_toenergy_drained)) {
        return   "从对手的" + trans_from_dict(RegExp.$1) + "那里吸取了体力！";
    }
    if (originalStr.match(regex_energy_drained)) {
        return   trans_from_dict(RegExp.$1) + "被吸取了体力！";
    }
    if (originalStr.match(regex_toabsorbs_attack)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "吸引了攻击！";
    }
    if (originalStr.match(regex_absorbs_attack)) {
        return   trans_from_dict(RegExp.$1) + "吸引了攻击！";
    }
    if (originalStr.match(regex_totook_attack)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "吸引了攻击！";
    }
    if (originalStr.match(regex_took_attack)) {
        return   trans_from_dict(RegExp.$1) + "吸引了攻击！";
    }
    if (originalStr.match(regex_tie)) {
        return   trans_from_dict(RegExp.$1) + "和" + trans_from_dict(RegExp.$2) + "平局了！";
    }
    if (originalStr.match(regex_tounder_ground)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "钻入了洞里！";
    }
    if (originalStr.match(regex_under_ground)) {
        return   trans_from_dict(RegExp.$1) + "钻入了洞里！";
    }
    if (originalStr.match(regex_toflew_high)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "飞向了高空！";
    }
    if (originalStr.match(regex_flew_high)) {
        return   trans_from_dict(RegExp.$1) + "飞向了高空！";
    }
    if (originalStr.match(regex_tohurled_air)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "被投向了空中！";
    }
    if (originalStr.match(regex_hurled_air)) {
        return   trans_from_dict(RegExp.$1) + "被投向了空中！";
    }
    if (originalStr.match(regex_towhippedup_whirlwind)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "掀起一阵旋风！";
    }
    if (originalStr.match(regex_whippedup_whirlwind)) {
        return   trans_from_dict(RegExp.$1) + "掀起一阵旋风！";
    }
    if (originalStr.match(regex_tohid_underwater)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "潜入了水中！";
    }
    if (originalStr.match(regex_hid_underwater)) {
        return   trans_from_dict(RegExp.$1) + "潜入了水中！";
    }
    if (originalStr.match(regex_tosprang_up)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "高高地跳了起来！";
    }
    if (originalStr.match(regex_sprang_up)) {
        return   trans_from_dict(RegExp.$1) + "高高地跳了起来！";
    }
    if (originalStr.match(regex_toitem_cannot_removed)) {
        return   "无法拿开对手的" + trans_from_dict(RegExp.$1) + "的道具！";
    }
    if (originalStr.match(regex_item_cannot_removed)) {
        return   "无法拿开" + trans_from_dict(RegExp.$1) + "的道具！";
    }
    if (originalStr.match(regex_tomove_nolonger_disabled)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "的招式不再被禁用！";
    }
    if (originalStr.match(regex_move_nolonger_disabled)) {
        return   trans_from_dict(RegExp.$1) + "的招式不再被禁用！";
    }
    if (originalStr.match(regex_toloafing_around)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "正在偷懒！";
    }
    if (originalStr.match(regex_loafing_around)) {
        return   trans_from_dict(RegExp.$1) + "正在偷懒！";
    }
    if (originalStr.match(regex_tomust_recharge)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "因攻击的反作用力而无法动弹！";
    }
    if (originalStr.match(regex_must_recharge)) {
        return   trans_from_dict(RegExp.$1) + "因攻击的反作用力而无法动弹！";
    }
    if (originalStr.match(regex_toheals_status)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "治愈了异常状态！";
    }
    if (originalStr.match(regex_heals_status)) {
        return   trans_from_dict(RegExp.$1) + "治愈了异常状态！";
    }
    if (originalStr.match(regex_tohealed_burn)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "治愈了灼伤状态！";
    }
    if (originalStr.match(regex_healed_burn)) {
        return   trans_from_dict(RegExp.$1) + "治愈了灼伤状态！";
    }
    if (originalStr.match(regex_toburn_was_healed)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "的灼伤被治愈了！";
    }
    if (originalStr.match(regex_burn_was_healed)) {
        return   trans_from_dict(RegExp.$1) + "的灼伤被治愈了！";
    }
    if (originalStr.match(regex_tocured_its_poison)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "治愈了中毒状态！";
    }
    if (originalStr.match(regex_cured_its_poison)) {
        return   trans_from_dict(RegExp.$1) + "治愈了中毒状态！";
    }
    if (originalStr.match(regex_tocured_its_paralysis)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "治愈了麻痹状态！";
    }
    if (originalStr.match(regex_cured_its_paralysis)) {
        return   trans_from_dict(RegExp.$1) + "治愈了麻痹状态！";
    }
    if (originalStr.match(regex_tostatus_cleared)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "的异常状态被清除了！";
    }
    if (originalStr.match(regex_status_cleared)) {
        return    trans_from_dict(RegExp.$1) + "的异常状态被清除了！";
    }
    if (originalStr.match(regex_totake_attacker_down)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "想和对手同归于尽！";
    }
    if (originalStr.match(regex_take_attacker_down)) {
        return   trans_from_dict(RegExp.$1) + "想和对手同归于尽！";
    }
    if (originalStr.match(regex_totook_attacker_down)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "和对手同归于尽了！";
    }
    if (originalStr.match(regex_took_attacker_down)) {
        return   trans_from_dict(RegExp.$1) + "和对手同归于尽了！";
    }
    if (originalStr.match(regex_toplanted_its_roots)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "扎下了根！";
    }
    if (originalStr.match(regex_planted_its_roots)) {
        return   trans_from_dict(RegExp.$1) + "扎下了根！";
    }
    if (originalStr.match(regex_toanchored_itself_roots)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "扎下了根！";
    }
    if (originalStr.match(regex_anchored_itself_roots)) {
        return   trans_from_dict(RegExp.$1) + "扎下了根！";
    }
    if (originalStr.match(regex_tosurrounded_veil_water)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "套上了水环！";
    }
    if (originalStr.match(regex_surrounded_veil_water)) {
        return   trans_from_dict(RegExp.$1) + "套上了水环！";
    }
    if (originalStr.match(regex_towas_subjected_torment)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "遭到了无理取闹！";
    }
    if (originalStr.match(regex_was_subjected_torment)) {
        return   trans_from_dict(RegExp.$1) + "遭到了无理取闹！";
    }
    if (originalStr.match(regex_tosupersweet_aroma)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "的蜜散发出了甜甜香气！";
    }
    if (originalStr.match(regex_supersweet_aroma)) {
        return   trans_from_dict(RegExp.$1) + "的蜜散发出了甜甜香气！";
    }
    if (originalStr.match(regex_toreversed_other_auras)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "压制了所有气场！";
    }
    if (originalStr.match(regex_reversed_other_auras)) {
        return   trans_from_dict(RegExp.$1) + "压制了所有气场！";
    }
    if (originalStr.match(regex_togot_over_infatuation)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "不再迷恋对方了！";
    }
    if (originalStr.match(regex_got_over_infatuation)) {
        return   trans_from_dict(RegExp.$1) + "不再迷恋对方了！";
    }
    if (originalStr.match(regex_tounderwent_heroic_transformation)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "变身后归来了！";
    }
    if (originalStr.match(regex_underwent_heroic_transformation)) {
        return   trans_from_dict(RegExp.$1) + "变身后归来了！";
    }
    if (originalStr.match(regex_toimmobilized_by_love)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "陷入了爱河！";
    }
    if (originalStr.match(regex_immobilized_by_love)) {
        return   trans_from_dict(RegExp.$1) + "陷入了爱河！";
    }
    if (originalStr.match(regex_toshuddered)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "发抖了！";
    }
    if (originalStr.match(regex_shuddered)) {
        return   trans_from_dict(RegExp.$1) + "发抖了！";
    }
    if (originalStr.match(regex_tomove_was_postponed)) {
        return   "延后了对手的" + trans_from_dict(RegExp.$1) + "的顺序！";
    }
    if (originalStr.match(regex_move_was_postponed)) {
        return   "延后了" + trans_from_dict(RegExp.$1) + "的顺序！";
    }
    if (originalStr.match(regex_totightening_its_focus)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "聚精会神了起来！";
    }
    if (originalStr.match(regex_tightening_its_focus)) {
        return   trans_from_dict(RegExp.$1) + "聚精会神了起来！";
    }
    if (originalStr.match(regex_toset_shell_trap)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "布置了一个甲壳陷阱！";
    }
    if (originalStr.match(regex_set_shell_trap)) {
        return   trans_from_dict(RegExp.$1) + "布置了一个甲壳陷阱！";
    }
    if (originalStr.match(regex_toshrouded_itself_magiccoat)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "给自己裹上了一层魔术外衣！";
    }
    if (originalStr.match(regex_shrouded_itself_magiccoat)) {
        return   trans_from_dict(RegExp.$1) + "给自己裹上了一层魔术外衣！";
    }
    if (originalStr.match(regex_also_timer_to_on)) {
        return   RegExp.$1 + "也想要开启计时器。";
    }
    if (originalStr.match(regex_torestorehp_using_zpower)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "用Z力量恢复了生命值！";
    }
    if (originalStr.match(regex_restorehp_using_zpower)) {
        return   trans_from_dict(RegExp.$1) + "用Z力量恢复了生命值！";
    }
    if (originalStr.match(regex_tocuthp_maximized_attack)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "削减体力并释放了全部力量！";
    }
    if (originalStr.match(regex_cuthp_maximized_attack)) {
        return   trans_from_dict(RegExp.$1) + "削减体力并释放了全部力量！";
    }
    if (originalStr.match(regex_torestored_its_hp)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "回复了HP。";
    }
    if (originalStr.match(regex_restored_its_hp)) {
        return   trans_from_dict(RegExp.$1) + "回复了HP。";
    }
    if (originalStr.match(regex_torestorehp_using_zpower2)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "通过Z招式回复了HP！";
    }
    if (originalStr.match(regex_restorehp_using_zpower2)) {
        return   trans_from_dict(RegExp.$1) + "通过Z招式回复了HP！";
    }
    if (originalStr.match(regex_toreturned_stats_zpower)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "通过Z招式将被降低的能力复原了！";
    }
    if (originalStr.match(regex_returned_stats_zpower)) {
        return   trans_from_dict(RegExp.$1) + "通过Z招式将被降低的能力复原了！";
    }
    if (originalStr.match(regex_tostarted_heatingup_beak)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "开始给鸟嘴加热了！";
    }
    if (originalStr.match(regex_started_heatingup_beak)) {
        return   trans_from_dict(RegExp.$1) + "开始给鸟嘴加热了！";
    }
    if (originalStr.match(regex_toswitched_items_target)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "互换了各自的道具！";
    }
    if (originalStr.match(regex_switched_items_target)) {
        return   trans_from_dict(RegExp.$1) + "互换了各自的道具！";
    }
    if (originalStr.match(regex_tomoves_have_electrified)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "的招式带电了！";
    }
    if (originalStr.match(regex_moves_have_electrified)) {
        return   trans_from_dict(RegExp.$1) + "的招式带电了！";
    }
    if (originalStr.match(regex_totarget_bear_grudge)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "想向对手施放怨念！";
    }
    if (originalStr.match(regex_target_bear_grudge)) {
        return   trans_from_dict(RegExp.$1) + "想向对手施放怨念！";
    }
    if (originalStr.match(regex_tolearned)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "学会了" + translations[RegExp.$2] + "！";
    }
    if (originalStr.match(regex_learned)) {
        return   trans_from_dict(RegExp.$1) + "学会了" + translations[RegExp.$2] + "！";
    }
    if (originalStr.match(regex_tokept_going_crashed)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "因势头过猛而撞到了地面！";
    }
    if (originalStr.match(regex_kept_going_crashed)) {
        return   trans_from_dict(RegExp.$1) + "因势头过猛而撞到了地面！";
    }
    if (originalStr.match(regex_tothawed_out)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "的冰冻被融化了！";
    }
    if (originalStr.match(regex_thawed_out)) {
        return   trans_from_dict(RegExp.$1) + "的冰冻被融化了！";
    }
    if (originalStr.match(regex_tothroat_chop)) {
        return   "对手的地狱突刺的效果阻止了" + trans_from_dict(RegExp.$1) + "使用的声音类招式！";
    }
    if (originalStr.match(regex_throat_chop)) {
        return   "地狱突刺的效果阻止了对手的" + trans_from_dict(RegExp.$1) + "使用的声音类招式！";
    }
    if (originalStr.match(regex_toprotected_aromaticveil)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "被芳香幕保护了！";
    }
    if (originalStr.match(regex_protected_aromaticveil)) {
        return   trans_from_dict(RegExp.$1) + "被芳香幕保护了！";
    }
    if (originalStr.match(regex_tosurrounded_sweetness)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "被甜幕包围了！";
    }
    if (originalStr.match(regex_surrounded_sweetness)) {
        return   trans_from_dict(RegExp.$1) + "被甜幕包围了！";
    }
    if (originalStr.match(regex_tocant_asleep_sweetness)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "因为甜幕无法入睡！";
    }
    if (originalStr.match(regex_cant_asleep_sweetness)) {
        return   trans_from_dict(RegExp.$1) + "因为甜幕无法入睡！";
    }
    if (originalStr.match(regex_tolost_focus)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "聚气时受到干扰，无法使出招式！";
    }
    if (originalStr.match(regex_lost_focus)) {
        return   trans_from_dict(RegExp.$1) + "聚气时受到干扰，无法使出招式！";
    }
    if (originalStr.match(regex_toattack_missed2)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "的攻击没有命中！";
    }
    if (originalStr.match(regex_attack_missed2)) {
        return   trans_from_dict(RegExp.$1) + "的攻击没有命中！";
    }
    if (originalStr.match(regex_tocenter_attention_zpower)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "使用Z力量变得万众瞩目了！";
    }
    if (originalStr.match(regex_center_attention_zpower)) {
        return   trans_from_dict(RegExp.$1) + "使用Z力量变得万众瞩目了！";
    }
    if (originalStr.match(regex_tobond_trainer)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "浑身充满了牵绊之力！";
    }
    if (originalStr.match(regex_bond_trainer)) {
        return   trans_from_dict(RegExp.$1) + "浑身充满了牵绊之力！";
    }
    if (originalStr.match(regex_toprimal_reversion)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "的原始回归！恢复了原始的样子！";
    }
    if (originalStr.match(regex_primal_reversion)) {
        return   trans_from_dict(RegExp.$1) + "的原始回归！恢复了原始的样子！";
    }
    if (originalStr.match(regex_toabsorbing_power)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "正在积蓄力量！";
    }
    if (originalStr.match(regex_absorbing_power)) {
        return   trans_from_dict(RegExp.$1) + "正在积蓄力量！";
    }
    if (originalStr.match(regex_totaunt_off)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "的挑衅效果解除了！";
    }
    if (originalStr.match(regex_taunt_off)) {
        return   trans_from_dict(RegExp.$1) + "的挑衅效果解除了！";
    }
    if (originalStr.match(regex_tocustap_berry)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "用了释陀果后，行动变快了！";
    }
    if (originalStr.match(regex_custap_berry)) {
        return   trans_from_dict(RegExp.$1) + "用了释陀果后，行动变快了！";
    }
    if (originalStr.match(regex_totwo_abilities)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "同时拥有了两种特性！";
    }
    if (originalStr.match(regex_two_abilities)) {
        return   trans_from_dict(RegExp.$1) + "同时拥有了两种特性！";
    }
    if (originalStr.match(regex_toprotected_Terrain)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "受到了" + trans_from_dict(RegExp.$2 == "Electric" ? "电气" : RegExp.$2 == "Misty"  ? "薄雾" : "精神") + "场地的保护！";
    }
    if (originalStr.match(regex_protected_Terrain)) {
        return   trans_from_dict(RegExp.$1) + "受到了" + trans_from_dict(RegExp.$2 == "Electric" ? "电气" : RegExp.$2 == "Misty"  ? "薄雾" : "精神") + "场地的保护！";
    }
    if (originalStr.match(regex_tomirrorherb2)) {
        return  "对手的" + trans_from_dict(RegExp.$2) +"用模仿香草巨幅" + trans_from_dict(RegExp.$1 == "raised" ? "提升" : "降低") + "了" + translations[RegExp.$3] + "！";
    }
    if (originalStr.match(regex_mirrorherb2)) {
        return  trans_from_dict(RegExp.$2) +"用模仿香草巨幅" + trans_from_dict(RegExp.$1 == "raised" ? "提升" : "降低") + "了" + translations[RegExp.$3] + "！";
    }
    if (originalStr.match(regex_tomirrorherb)) {
        return  "对手的" + trans_from_dict(RegExp.$2) + "用模仿香草" + trans_from_dict(RegExp.$1 == "sharply raised" ? "大幅提升" : "提升") + "了" + translations[RegExp.$3] + "！";
    }
    if (originalStr.match(regex_mirrorherb)) {
        return  trans_from_dict(RegExp.$2) + "用模仿香草" + trans_from_dict(RegExp.$1 == "sharply raised" ? "大幅提升" : "提升") + "了" + translations[RegExp.$3] + "！";
    }
    if (originalStr.match(regex_tomirrorherb_Contrary)) {
        return  "对手的" + trans_from_dict(RegExp.$2) + "用模仿香草" + trans_from_dict(RegExp.$1 == "harshly lowered" ? "大幅降低" : "降低") + "了"  + translations[RegExp.$3] + "！";
    }
    if (originalStr.match(regex_mirrorherb_Contrary)) {
        return  trans_from_dict(RegExp.$2) + "用模仿香草" + trans_from_dict(RegExp.$1 == "harshly lowered" ? "大幅降低" : "降低") + "了"  + translations[RegExp.$3] + "！";
    }
    if (originalStr.match(regex_toStarf_Berry)) {
        return   "对手的" + trans_from_dict(RegExp.$2) + "用星桃果" + trans_from_dict(RegExp.$1 == "sharply raised" ? "大幅提升" : RegExp.$1 == "drastically raised"  ? "巨幅提升" : "大幅降低") + "了" + translations[RegExp.$3] + "！";
    }
    if (originalStr.match(regex_Starf_Berry)) {
        return   trans_from_dict(RegExp.$2) + "用星桃果" + trans_from_dict(RegExp.$1 == "sharply raised" ? "大幅提升" : RegExp.$1 == "drastically raised"  ? "巨幅提升" : "大幅降低") + "了" + translations[RegExp.$3] + "！";
    }
    if (originalStr.match(regex_toWeakness_Policy)) {
        return   "对手的" + trans_from_dict(RegExp.$2) + "用弱点保险" + trans_from_dict(RegExp.$1 == "sharply raised" ? "大幅提升" : RegExp.$1 == "drastically raised"  ? "巨幅提升" : "大幅降低") + "了" + translations[RegExp.$3] + "！";
    }
    if (originalStr.match(regex_Weakness_Policy)) {
        return   trans_from_dict(RegExp.$2) + "用弱点保险" + trans_from_dict(RegExp.$1 == "sharply raised" ? "大幅提升" : RegExp.$1 == "drastically raised"  ? "巨幅提升" : "大幅降低") + "了" + translations[RegExp.$3] + "！";
    }
    if (originalStr.match(regex_toRoom_Service)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "用客房服务降低了速度！";
    }
    if (originalStr.match(regex_Room_Service)) {
        return   trans_from_dict(RegExp.$1) + "用客房服务降低了速度！";
    }
    if (originalStr.match(regex_toabsorbed_electricity)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "吸收了电力！";
    }
    if (originalStr.match(regex_absorbed_electricity)) {
        return   trans_from_dict(RegExp.$1) + "吸收了电力！";
    }
    if (originalStr.match(regex_tospace_power)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "身上溢出了宇宙之力！";
    }
    if (originalStr.match(regex_space_power)) {
        return   trans_from_dict(RegExp.$1) + "身上溢出了宇宙之力！";
    }
    if (originalStr.match(regex_togravity)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "因受到重力影响而无法待在空中！";
    }
    if (originalStr.match(regex_gravity)) {
        return   trans_from_dict(RegExp.$1) + "因受到重力影响而无法待在空中！";
    }
    if (originalStr.match(regex_toWhite_Herb)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "用白色香草复原了能力！";
    }
    if (originalStr.match(regex_White_Herb)) {
        return   trans_from_dict(RegExp.$1) + "用白色香草复原了能力！";
    }
    if (originalStr.match(regex_todisguise_busted)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "的画皮脱落了！";
    }
    if (originalStr.match(regex_disguise_busted)) {
        return   trans_from_dict(RegExp.$1) + "的画皮脱落了！";
    }
    if (originalStr.match(regex_toswapped_abilities)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "互换了各自的特性！";
    }
    if (originalStr.match(regex_swapped_abilities)) {
        return   trans_from_dict(RegExp.$1) + "互换了各自的特性！";
    }
    if (originalStr.match(regex_tocharging_power)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "开始充电了！";
    }
    if (originalStr.match(regex_charging_power)) {
        return   trans_from_dict(RegExp.$1) + "开始充电了！";
    }
    if (originalStr.match(regex_tofell_love)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "着迷了！";
    }
    if (originalStr.match(regex_fell_love)) {
        return   trans_from_dict(RegExp.$1) + "着迷了！";
    }
    if (originalStr.match(regex_toasleep_paralyzed)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "已经"+ trans_from_dict(RegExp.$2 == "asleep" ? "睡着" : "麻痹") + "了！";
    }
    if (originalStr.match(regex_asleep_paralyzed)) {
        return   trans_from_dict(RegExp.$1) + "已经"+ trans_from_dict(RegExp.$2 == "asleep" ? "睡着" : "麻痹") + "了！";
    }
    if (originalStr.match(regex_toidentified)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "被识破了！";
    }
    if (originalStr.match(regex_identified)) {
        return   trans_from_dict(RegExp.$1) + "被识破了！";
    }
    if (originalStr.match(regex_toswitched_Attack_Defense)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "交换了攻击和防御！";
    }
    if (originalStr.match(regex_switched_Attack_Defense)) {
        return   trans_from_dict(RegExp.$1) + "交换了攻击和防御！";
    }
    if (originalStr.match(regex_toanchors_itself)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "用吸盘粘在了地面上！";
    }
    if (originalStr.match(regex_anchors_itself)) {
        return   trans_from_dict(RegExp.$1) + "用吸盘粘在了地面上！";
    }
    if (originalStr.match(regex_toanchored_suction_cups)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "用吸盘粘在了地面上！";
    }
    if (originalStr.match(regex_anchored_suction_cups)) {
        return   trans_from_dict(RegExp.$1) + "用吸盘粘在了地面上！";
    }
    if (originalStr.match(regex_tostopped_shielding_itself)) {
        return   "(对手的" + trans_from_dict(RegExp.$1) + "停止了自我保护。)";
    }
    if (originalStr.match(regex_stopped_shielding_itself)) {
        return   "(" + trans_from_dict(RegExp.$1) + "停止了自我保护。)";
    }
    if (originalStr.match(regex_toshielded_itself)) {
        return   "(对手的" + trans_from_dict(RegExp.$1) + "的自我保护。)";
    }
    if (originalStr.match(regex_shielded_itself)) {
        return   "(" + trans_from_dict(RegExp.$1) + "的自我保护。)";
    }
    if (originalStr.match(regex_tocriticalhit_zpower)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "通过使用Z力量使击中要害率提升了！";
    }
    if (originalStr.match(regex_criticalhit_zpower)) {
        return   trans_from_dict(RegExp.$1) + "通过使用Z力量使击中要害率提升了！";
    }
    if (originalStr.match(regex_tomaking_uproar)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "吵闹个不停！";
    }
    if (originalStr.match(regex_making_uproar)) {
        return   trans_from_dict(RegExp.$1) + "吵闹个不停！";
    }
    if (originalStr.match(regex_tocaused_uproar)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "吵闹了起来！";
    }
    if (originalStr.match(regex_caused_uproar)) {
        return   trans_from_dict(RegExp.$1) + "吵闹了起来！";
    }
    if (originalStr.match(regex_tomove_no_disabled)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "的招式不再被封印了！";
    }
    if (originalStr.match(regex_move_no_disabled)) {
        return   trans_from_dict(RegExp.$1) + "的招式不再被封印了！";
    }
    if (originalStr.match(regex_tocan_use_item)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "可以再次使用道具了！";
    }
    if (originalStr.match(regex_can_use_item)) {
        return   trans_from_dict(RegExp.$1) + "可以再次使用道具了！";
    }
    if (originalStr.match(regex_totorment_wore_off)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "不再受对方无理取闹的影响了！";
    }
    if (originalStr.match(regex_torment_wore_off)) {
        return   trans_from_dict(RegExp.$1) + "不再受对方无理取闹的影响了！";
    }
    if (originalStr.match(regex_toshared_power_target)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "把力量分享给了目标！";
    }
    if (originalStr.match(regex_shared_power_target)) {
        return   trans_from_dict(RegExp.$1) + "把力量分享给了目标！";
    }
    if (originalStr.match(regex_toshared_guard_target)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "把防御分享给了目标！";
    }
    if (originalStr.match(regex_shared_guard_target)) {
        return   trans_from_dict(RegExp.$1) + "把防御分享给了目标！";
    }
    if (originalStr.match(regex_toswitched_speed_target)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "与目标交换了速度！";
    }
    if (originalStr.match(regex_switched_speed_target)) {
        return   trans_from_dict(RegExp.$1) + "与目标交换了速度！";
    }
    if (originalStr.match(regex_toBright_light)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "的身上开始溢出耀眼的光芒！";
    }
    if (originalStr.match(regex_Bright_light)) {
        return   trans_from_dict(RegExp.$1) + "的身上开始溢出耀眼的光芒！";
    }
    if (originalStr.match(regex_toalready_poisoned)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "已经中毒了。";
    }
    if (originalStr.match(regex_already_poisoned)) {
        return  trans_from_dict(RegExp.$1) + "已经中毒了。";
    }
    if (originalStr.match(regex_toalready_paralyzed)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "已经被麻痹了。";
    }
    if (originalStr.match(regex_already_paralyzed)) {
        return  trans_from_dict(RegExp.$1) + "已经被麻痹了。";
    }
    if (originalStr.match(regex_toalready_frozen)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "已经被冻住了！";
    }
    if (originalStr.match(regex_already_frozen)) {
        return  trans_from_dict(RegExp.$1) + "已经被冻住了！";
    }
    if (originalStr.match(regex_tosketched)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "学会了" + translations[RegExp.$2] + "！";
    }
    if (originalStr.match(regex_sketched)) {
        return  trans_from_dict(RegExp.$1) + "学会了" + translations[RegExp.$2] + "！";
    }
    if (originalStr.match(regex_toshell_trap)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "的陷阱甲壳没有生效！";
    }
    if (originalStr.match(regex_shell_trap)) {
        return  trans_from_dict(RegExp.$1) + "的陷阱甲壳没有生效！";
    }
    if (originalStr.match(regex_toDynamax)) {
        return  "(对手的" + trans_from_dict(RegExp.$1) + "的极巨化！)";
    }
    if (originalStr.match(regex_Dynamax)) {
        return  "(" + trans_from_dict(RegExp.$1) + "的极巨化！)";
    }
    if (originalStr.match(regex_no_battle_on_right_now)) {
        return  "现在没有正在进行的" + RegExp.$1 + "。";
    }
    if (originalStr.match(regex_tosubstitute_faded)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "的替身消失了......";
    }
    if (originalStr.match(regex_substitute_faded)) {
        return  trans_from_dict(RegExp.$1) + "的替身消失了......";
    }
    if (originalStr.match(regex_not_found)) {
        return  "没有找到用户'" + RegExp.$1 + "'。";
    }
    if (originalStr.match(regex_Challenging)) {
        return  "正在向" + RegExp.$1 + "发起挑战...";
    }
    if (originalStr.match(regex_is_offline)) {
        return  "用户" + RegExp.$1 + "处于离线状态。如果您仍然想对TA进行私聊，请再次发送消息，或使用指令/offlinemsg。";
    }
    if (originalStr.match(regex_tolonger_tormented)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "不再无理取闹了！";
    }
    if (originalStr.match(regex_longer_tormented)) {
        return  trans_from_dict(RegExp.$1) + "不再无理取闹了！";
    }
    if (originalStr.match(regex_tocured_infatuation)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "用心灵香草治愈了着迷！";
    }
    if (originalStr.match(regex_cured_infatuation)) {
        return  trans_from_dict(RegExp.$1) + "用心灵香草治愈了着迷！";
    }
    if (originalStr.match(regex_torocky_helmet)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "因凸凸头盔受到了伤害！";
    }
    if (originalStr.match(regex_rocky_helmet)) {
        return  trans_from_dict(RegExp.$1) + "因凸凸头盔受到了伤害！";
    }
    if (originalStr.match(regex_toCourt_Change)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "交换了双方的场地效果！";
    }
    if (originalStr.match(regex_Court_Change)) {
        return  trans_from_dict(RegExp.$1) + "交换了双方的场地效果！";
    }
    if (originalStr.match(regex_toalready_substitute)) {
        return  "但是，对手的" + trans_from_dict(RegExp.$1) + "的替身已经出现了。";
    }
    if (originalStr.match(regex_already_substitute)) {
        return  "但是，" + trans_from_dict(RegExp.$1) + "的替身已经出现了。";
    }
    if (originalStr.match(regex_tovanished_instantly)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "的身影瞬间消失了！";
    }
    if (originalStr.match(regex_vanished_instantly)) {
        return  trans_from_dict(RegExp.$1) + "的身影瞬间消失了！";
    }
    if (originalStr.match(regex_toheavy_lifted)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "太重了，无法被提起！";
    }
    if (originalStr.match(regex_heavy_lifted)) {
        return  trans_from_dict(RegExp.$1) + "太重了，无法被提起！";
    }
    if (originalStr.match(regex_touproar_kept)) {
        return  "但是吵闹让对手的" + trans_from_dict(RegExp.$1) + "醒过来了！";
    }
    if (originalStr.match(regex_uproar_kept)) {
        return  "但是吵闹让" + trans_from_dict(RegExp.$1) + "醒过来了！";
    }
    if (originalStr.match(regex_tobraced_itself)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "摆出了挺住攻击的架势！";
    }
    if (originalStr.match(regex_braced_itself)) {
        return  trans_from_dict(RegExp.$1) + "摆出了挺住攻击的架势！";
    }
    if (originalStr.match(regex_toswitched_stat_target)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "和目标互换了能力变化！";
    }
    if (originalStr.match(regex_switched_stat_target)) {
        return  trans_from_dict(RegExp.$1) + "和目标互换了能力变化！";
    }
    if (originalStr.match(regex_toswitched_def_spd)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "和目标互换了防御和特防的能力变化！";
    }
    if (originalStr.match(regex_switched_def_spd)) {
        return  trans_from_dict(RegExp.$1) + "和目标互换了防御和特防的能力变化！";
    }
    if (originalStr.match(regex_toswitched_atk_spa)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "和目标互换了攻击和特攻的能力变化！";
    }
    if (originalStr.match(regex_switched_atk_spa)) {
        return  trans_from_dict(RegExp.$1) + "和目标互换了攻击和特攻的能力变化！";
    }
    if (originalStr.match(regex_torevealed)) {
        return  "读取了对手的" + trans_from_dict(RegExp.$1) + "的" + translations[RegExp.$2] + "！";
    }
    if (originalStr.match(regex_revealed)) {
        return  "读取了" + trans_from_dict(RegExp.$1) + "的" + translations[RegExp.$2] + "！";
    }
    if (originalStr.match(regex_toGMax_Wildfire)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "被超极巨地狱灭焰的火焰包围，酷热难耐！";
    }
    if (originalStr.match(regex_GMax_Wildfire)) {
        return  trans_from_dict(RegExp.$1) + "被超极巨地狱灭焰的火焰包围，酷热难耐！";
    }
    if (originalStr.match(regex_no_energy)) {
        return  trans_from_dict(RegExp.$1) + "没有力气战斗了！";
    }
    if (originalStr.match(regex_already_in_battle)) {
        return  trans_from_dict(RegExp.$1) + "已经在战斗了！";
    }
    if (originalStr.match(regex_towaiting_move)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "正在等待" + trans_from_dict(RegExp.$2) + "...";
    }
    if (originalStr.match(regex_waiting_move)) {
        return  trans_from_dict(RegExp.$1) + "正在等待" + trans_from_dict(RegExp.$2) + "...";
    }
    if (originalStr.match(regex_tosea_fire)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "受到了火海的伤害！";
    }
    if (originalStr.match(regex_sea_fire)) {
        return  trans_from_dict(RegExp.$1) + "受到了火海的伤害！";
    }
    if (originalStr.match(regex_toTelepathy)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "没有受到伙伴的攻击！";
    }
    if (originalStr.match(regex_Telepathy)) {
        return  trans_from_dict(RegExp.$1) + "没有受到伙伴的攻击！";
    }
    if (originalStr.match(regex_toKey_Stone)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "的" + translations[RegExp.$2] + "对钥石起了反应！";
    }
    if (originalStr.match(regex_Key_Stone)) {
        return  trans_from_dict(RegExp.$1) + "的" + translations[RegExp.$2] + "对钥石起了反应！";
    }
    if (originalStr.match(regex_tobecame_AshGreninja)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "变身成了小智版甲贺忍蛙！";
    }
    if (originalStr.match(regex_became_AshGreninja)) {
        return  trans_from_dict(RegExp.$1) + "变身成了小智版甲贺忍蛙！";
    }
    if (originalStr.match(regex_crazy_house)) {
        return  RegExp.$2 + "夺取了" + trans_from_dict(RegExp.$1) + "！";
    }
    if (originalStr.match(regex_tomelted)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "的" + translations[RegExp.$2] + "解除了冰冻状态！";
    }
    if (originalStr.match(regex_melted)) {
        return  trans_from_dict(RegExp.$1) + "的" + translations[RegExp.$2] + "解除了冰冻状态！";
    }
    if (originalStr.match(regex_toelectromagnetism_woreoff)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "的电磁力消失了！";
    }
    if (originalStr.match(regex_electromagnetism_woreoff)) {
        return  trans_from_dict(RegExp.$1) + "的电磁力消失了！";
    }
    if (originalStr.match(regex_tocant_use_gravity)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "因重力而无法使出" + translations[RegExp.$2] + "！";
    }
    if (originalStr.match(regex_cant_use_gravity)) {
        return  trans_from_dict(RegExp.$1) + "因重力而无法使出" + translations[RegExp.$2] + "！";
    }
    if (originalStr.match(regex_tomaxed_Attack)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "的攻击被提高到了最大！";
    }
    if (originalStr.match(regex_maxed_Attack)) {
        return  trans_from_dict(RegExp.$1) + "的攻击被提高到了最大！";
    }
    if (originalStr.match(regex_tocenter_attention)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "变得万众瞩目了！";
    }
    if (originalStr.match(regex_center_attention)) {
        return  trans_from_dict(RegExp.$1) + "变得万众瞩目了！";
    }
    if (originalStr.match(regex_toHospitality)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "喝光了对手的" + trans_from_dict(RegExp.$2) + "泡的茶！";
    }
    if (originalStr.match(regex_Hospitality)) {
        return  trans_from_dict(RegExp.$1) + "喝光了" + trans_from_dict(RegExp.$2) + "泡的茶！";
    }
    if (originalStr.match(regex_toRowap_Berry_Jaboca_Berry)) {
        return    "对手的" + trans_from_dict(RegExp.$1) + "受到了" + trans_from_dict(RegExp.$2) + "的" + trans_from_dict(RegExp.$3 == "Rowap" ? "雾莲" : "嘉珍") + "果的伤害！";
    }
    if (originalStr.match(regex_Rowap_Berry_Jaboca_Berry)) {
        return    trans_from_dict(RegExp.$1) + "受到了对手的" + trans_from_dict(RegExp.$2) + "的" + trans_from_dict(RegExp.$3 == "Rowap" ? "雾莲" : "嘉珍") + "果的伤害！";
    }
    if (originalStr.match(regex_tostoring_energy)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "正在积蓄力量！";
    }
    if (originalStr.match(regex_storing_energy)) {
        return  trans_from_dict(RegExp.$1) + "正在积蓄力量！";
    }
    if (originalStr.match(regex_tounleashed_energy)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "释放了自身的能量！";
    }
    if (originalStr.match(regex_unleashed_energy)) {
        return  trans_from_dict(RegExp.$1) + "释放了自身的能量！";
    }
    if (originalStr.match(regex_tobecame_nimble)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "变得身轻如燕了！";
    }
    if (originalStr.match(regex_became_nimble)) {
        return  trans_from_dict(RegExp.$1) + "变得身轻如燕了！";
    }
    if (originalStr.match(regex_rejected_Open_Team_Sheet)) {
        return  RegExp.$1 + "拒绝公开队伍配置。";
    }
    if (originalStr.match(regex_agreed_Open_Team_Sheet)) {
        return  RegExp.$1 + "同意公开队伍配置。";
    }
    if (originalStr.match(regex_tosqueezed_wrapped)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "被" + trans_from_dict(RegExp.$3) + "紧紧" + trans_from_dict(RegExp.$2 == "squeezed" ? "绑住" : "束缚") + "了！";
    }
    if (originalStr.match(regex_squeezed_wrapped)) {
        return  trans_from_dict(RegExp.$1) + "被对手的" + trans_from_dict(RegExp.$3) + "紧紧" + trans_from_dict(RegExp.$2 == "squeezed" ? "绑住" : "束缚") + "了！";
    }
    if (originalStr.match(regex_tounaffected)) {
        return  "对于对手的" + trans_from_dict(RegExp.$1) + "，完全没有效果！";
    }
    if (originalStr.match(regex_unaffected)) {
        return  "对于" + trans_from_dict(RegExp.$1) + "，完全没有效果！";
    }
    if (originalStr.match(regex_toabsorbed_nutrients_roots)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "从根上吸取了养分！";
    }
    if (originalStr.match(regex_absorbed_nutrients_roots)) {
        return  trans_from_dict(RegExp.$1) + "从根上吸取了养分！";
    }
    if (originalStr.match(regex_tonot_lowered)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "的"+ translations[RegExp.$2] + "不会降低！";
    }
    if (originalStr.match(regex_not_lowered)) {
        return   trans_from_dict(RegExp.$1) + "的" + translations[RegExp.$2] + "不会降低！";
    }
    if (originalStr.match(regex_totype_added)) {
        return  "对手的" + trans_from_dict(RegExp.$2) + "增加了" + translations[RegExp.$1] + "属性！";
    }
    if (originalStr.match(regex_type_added)) {
        return  trans_from_dict(RegExp.$2) + "增加了" + translations[RegExp.$1] + "属性！";
    }
    if (originalStr.match(regex_tocant_get_going)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "无法拿出平时的水准！";
    }
    if (originalStr.match(regex_cant_get_going)) {
        return  trans_from_dict(RegExp.$1) + "无法拿出平时的水准！";
    }
    if (originalStr.match(regex_tofinally_get_going)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "恢复了平时的水准！";
    }
    if (originalStr.match(regex_finally_get_going)) {
        return  trans_from_dict(RegExp.$1) + "恢复了平时的水准！";
    }
    if (originalStr.match(regex_towas_burned_up)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "的" + translations[RegExp.$2] + "被烧尽了！";
    }
    if (originalStr.match(regex_was_burned_up)) {
        return  trans_from_dict(RegExp.$1) + "的" + translations[RegExp.$2] + "被烧尽了！";
    }
    if (originalStr.match(regex_tosurrounded_veil_petals)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "用花幕包裹了自己！";
    }
    if (originalStr.match(regex_surrounded_veil_petals)) {
        return  trans_from_dict(RegExp.$1) + "用花幕包裹了自己！";
    }
    if (originalStr.match(regex_toAbility_became_Mummy)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "的特性变成了木乃伊！";
    }
    if (originalStr.match(regex_Ability_became_Mummy)) {
        return  trans_from_dict(RegExp.$1) + "的特性变成了木乃伊！";
    }
    if (originalStr.match(regex_toreturned_normal)) {
        return  "(对手的" + trans_from_dict(RegExp.$1) + "复原了！)";
    }
    if (originalStr.match(regex_returned_normal)) {
        return  "(" + trans_from_dict(RegExp.$1) + "复原了！)";
    }
    if (originalStr.match(regex_tolingering_aroma)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "沾上了味道且挥之不去！";
    }
    if (originalStr.match(regex_lingering_aroma)) {
        return  trans_from_dict(RegExp.$1) + "沾上了味道且挥之不去！";
    }
    if (originalStr.match(regex_totoReflect_Type)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "的属性变得和对手的对手的" + trans_from_dict(RegExp.$2) + "一样了！";
    }
    if (originalStr.match(regex_toReflect_Type2)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "的属性变得和" + trans_from_dict(RegExp.$2) + "一样了！";
    }
    if (originalStr.match(regex_toReflect_Type)) {
        return  trans_from_dict(RegExp.$1) + "的属性变得和对手的" + trans_from_dict(RegExp.$2) + "一样了！";
    }
    if (originalStr.match(regex_Reflect_Type)) {
        return  trans_from_dict(RegExp.$1) + "的属性变得和" + trans_from_dict(RegExp.$2) + "一样了！";
    }
    if (originalStr.match(regex_totaken_over)) {
        return  "继承了对手的" + trans_from_dict(RegExp.$1) + "的" + translations[RegExp.$2] + "！";
    }
    if (originalStr.match(regex_taken_over)) {
        return  "继承了" + trans_from_dict(RegExp.$1) + "的" + translations[RegExp.$2] + "！";
    }
    if (originalStr.match(regex_toweaker_to_fire)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "变得怕火了！";
    }
    if (originalStr.match(regex_weaker_to_fire)) {
        return  trans_from_dict(RegExp.$1) + "变得怕火了！";
    }
    if (originalStr.match(regex_tocalmed_down)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "平静了下来。";
    }
    if (originalStr.match(regex_calmed_down)) {
        return  trans_from_dict(RegExp.$1) + "平静了下来。";
    }
    if (originalStr.match(regex_toFlash_Fire)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "的火焰威力提高了！";
    }
    if (originalStr.match(regex_Flash_Fire)) {
        return  trans_from_dict(RegExp.$1) + "的火焰威力提高了！";
    }
    if (originalStr.match(regex_towaiting_target_move)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "正在等待一个招式进行抢夺！";
    }
    if (originalStr.match(regex_waiting_target_move)) {
        return   trans_from_dict(RegExp.$1) + "正在等待一个招式进行抢夺！";
    }
    if (originalStr.match(regex_tosnatched_move)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "抢夺了" + trans_from_dict(RegExp.$2) + "的招式！";
    }
    if (originalStr.match(regex_snatched_move)) {
        return  trans_from_dict(RegExp.$1) + "抢夺了对手的" + trans_from_dict(RegExp.$2) + "的招式！";
    }
    if (originalStr.match(regex_toMat_Block)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "举起了一块榻榻米挡下了即将到来的攻击！";
    }
    if (originalStr.match(regex_Mat_Block)) {
        return  trans_from_dict(RegExp.$1) + "举起了一块榻榻米挡下了即将到来的攻击！";
    }
    if (originalStr.match(regex_kicked_up_mat)) {
        return  "掀起的榻榻米挡住了" + translations[RegExp.$1] + "！";
    }
    if (originalStr.match(regex_no_wants_timer_on)) {
        return  RegExp.$1 + "不再想要开启计时器，但计时器仍然启动着因为" + RegExp.$2 + "仍在启用。";
    }
    if (originalStr.match(regex_toGMax_Vine_Lash)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "被超极巨灰飞鞭灭强烈猛击！";
    }
    if (originalStr.match(regex_GMax_Vine_Lash)) {
        return  trans_from_dict(RegExp.$1) + "被超极巨灰飞鞭灭强烈猛击！";
    }
    if (originalStr.match(regex_toGMax_Cannonade)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "被超极巨水炮轰灭的漩涡伤害了！";
    }
    if (originalStr.match(regex_GMax_Cannonade)) {
        return  trans_from_dict(RegExp.$1) + "被超极巨水炮轰灭的漩涡伤害了！";
    }
    if (originalStr.match(regex_tosharp_steel)) {
        return  "尖锐的钢刺扎进了对手的" + trans_from_dict(RegExp.$1) + "的体内！";
    }
    if (originalStr.match(regex_sharp_steel)) {
        return  "尖锐的钢刺扎进了" + trans_from_dict(RegExp.$1) + "的体内！";
    }
    if (originalStr.match(regex_already_selected)) {
        return  "已经选择了" + trans_from_dict(RegExp.$1) + "！";
    }
    if (originalStr.match(regex_toOctolock)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "受到蛸固的效果影响，变得无法逃走了！";
    }
    if (originalStr.match(regex_Octolock)) {
        return  trans_from_dict(RegExp.$1) + "受到蛸固的效果影响，变得无法逃走了！";
    }
    if (originalStr.match(regex_areintheback5)) {
        return  trans_from_dict(RegExp.$1) + ", " + trans_from_dict(RegExp.$2) + ", " + trans_from_dict(RegExp.$3) + ", " + trans_from_dict(RegExp.$4) + "和" + trans_from_dict(RegExp.$5) + "紧跟其后。";
    }
    if (originalStr.match(regex_areintheback4)) {
        return  trans_from_dict(RegExp.$1) + ", " + trans_from_dict(RegExp.$2) + ", " + trans_from_dict(RegExp.$3) + "和" + trans_from_dict(RegExp.$4) + "紧跟其后。";
    }
    if (originalStr.match(regex_areintheback3)) {
        return  trans_from_dict(RegExp.$1) + ", " + trans_from_dict(RegExp.$2) + "和" + trans_from_dict(RegExp.$3) + "紧跟其后。";
    }
    if (originalStr.match(regex_areintheback2)) {
        return  trans_from_dict(RegExp.$1) + "和" + trans_from_dict(RegExp.$2) + "紧跟其后。";
    }
    if (originalStr.match(regex_areintheback)) {
        return  trans_from_dict(RegExp.$1) + "紧跟其后。";
    }
    if (originalStr.match(regex_toPluck_BugBite)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "偷走并吃掉了目标的" + translations[RegExp.$2] + "！";
    }
    if (originalStr.match(regex_Pluck_BugBite)) {
        return  trans_from_dict(RegExp.$1) + "偷走并吃掉了目标的" + translations[RegExp.$2] + "！";
    }
    if (originalStr.match(regex_toliquid_ooze)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "吸到了污泥浆！";
    }
    if (originalStr.match(regex_liquid_ooze)) {
        return  trans_from_dict(RegExp.$1) + "吸到了污泥浆！";
    }
    if (originalStr.match(regex_tocovered_powder)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "被粉尘包裹着！";
    }
    if (originalStr.match(regex_covered_powder)) {
        return  trans_from_dict(RegExp.$1) + "被粉尘包裹着！";
    }
    if (originalStr.match(regex_tospecial_attacks)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "获得了对特殊攻击的防护！";
    }
    if (originalStr.match(regex_special_attacks)) {
        return  trans_from_dict(RegExp.$1) + "获得了对特殊攻击的防护！";
    }
    if (originalStr.match(regex_togained_armor)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "获得了对于物理攻击的防护！";
    }
    if (originalStr.match(regex_gained_armor)) {
        return  trans_from_dict(RegExp.$1) + "获得了对于物理攻击的防护！";
    }
    if (originalStr.match(regex_toformed_school)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "一群群地聚集起来了！";
    }
    if (originalStr.match(regex_formed_school)) {
        return  trans_from_dict(RegExp.$1) + "一群群地聚集起来了！";
    }
    if (originalStr.match(regex_tostopped_schooling)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "一群群地四散而去了！";
    }
    if (originalStr.match(regex_stopped_schooling)) {
        return  trans_from_dict(RegExp.$1) + "一群群地四散而去了！";
    }
    if (originalStr.match(regex_tobursting_flame)) {
        return  "溅射的火焰击中了对手的" + trans_from_dict(RegExp.$1) + "！";
    }
    if (originalStr.match(regex_bursting_flame)) {
        return  "溅射的火焰击中了" + trans_from_dict(RegExp.$1) + "！";
    }
    if (originalStr.match(regex_send_offline_confirm)) {
        return  "用户" + RegExp.$1 + "已离线。如果您仍然想对TA发送信息，请再次发送消息进行确认。";
    }
    if (originalStr.match(regex_tofell_for_feint)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "中了佯攻！";
    }
    if (originalStr.match(regex_fell_for_feint)) {
        return  trans_from_dict(RegExp.$1) + "中了佯攻！";
    }
    if (originalStr.match(regex_tobroke_protection)) {
        return  "突破了对手的" + trans_from_dict(RegExp.$1) + "的守护！";
    }
    if (originalStr.match(regex_broke_protection)) {
        return  "突破了" + trans_from_dict(RegExp.$1) + "的守护！";
    }
    if (originalStr.match(regex_toalready_preparing)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "已经准备好了下轮行动！";
    }
    if (originalStr.match(regex_already_preparing)) {
        return  trans_from_dict(RegExp.$1) + "已经准备好了下轮行动！";
    }
    if (originalStr.match(regex_tobeing_withdrawn2)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "准备回来！";
    }
    if (originalStr.match(regex_being_withdrawn2)) {
        return  trans_from_dict(RegExp.$1) + "准备回来！";
    }
    if (originalStr.match(regex_toclamped_down)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "夹住了" + trans_from_dict(RegExp.$2) + "！";
    }
    if (originalStr.match(regex_clamped_down)) {
        return  trans_from_dict(RegExp.$1) + "夹住了对手的" + trans_from_dict(RegExp.$2) + "！";
    }
    if (originalStr.match(regex_totook_kind_offer)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "接受了好意！";
    }
    if (originalStr.match(regex_took_kind_offer)) {
        return  trans_from_dict(RegExp.$1) + "接受了好意！";
    }
    if (originalStr.match(regex_tohaving_nightmare)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "开始做恶梦了！";
    }
    if (originalStr.match(regex_having_nightmare)) {
        return   trans_from_dict(RegExp.$1) + "开始做恶梦了！";
    }
    if (originalStr.match(regex_reconnected2)) {
        return   RegExp.$1 + "重新连接了。";
    }
    if (originalStr.match(regex_tobecause_gravity)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "因重力而无法使出" + translations[RegExp.$2] + "！";
    }
    if (originalStr.match(regex_because_gravity)) {
        return  trans_from_dict(RegExp.$1) + "因重力而无法使出" + translations[RegExp.$2] + "！";
    }
    if (originalStr.match(regex_Invite_sent_to)) {
        return  "邀请了 " + RegExp.$1 + "！";
    }
    if (originalStr.match(regex_toGMax_Volcalith)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "被困在超极巨炎石喷发的岩石之中，疼痛难忍！";
    }
    if (originalStr.match(regex_GMax_Volcalith)) {
        return  trans_from_dict(RegExp.$1) + "被困在超极巨炎石喷发的岩石之中，疼痛难忍！";
    }
    if (originalStr.match(regex_toprotect_hurt)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "没能防住攻击，受到了伤害！";
    }
    if (originalStr.match(regex_protect_hurt)) {
        return  trans_from_dict(RegExp.$1) + "没能防住攻击，受到了伤害！";
    }
    if (originalStr.match(regex_cant_Dynamax)) {
        return  "[无效的选择]不能使用：" + trans_from_dict(RegExp.$1) + "现在不能极巨化。";
    }
    if (originalStr.match(regex_toPower_Shift)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "互换了自身的攻击和防御！";
    }
    if (originalStr.match(regex_Power_Shift)) {
        return  trans_from_dict(RegExp.$1) + "互换了自身的攻击和防御！";
    }
    if (originalStr.match(regex_toanchored_roots)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "用扎下的根固定住了！";
    }
    if (originalStr.match(regex_anchored_roots)) {
        return  trans_from_dict(RegExp.$1) + "用扎下的根固定住了！";
    }
    if (originalStr.match(regex_toUltra_Burst)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "通过究极爆发现出了新的样子！";
    }
    if (originalStr.match(regex_Ultra_Burst)) {
        return  trans_from_dict(RegExp.$1) + "通过究极爆发现出了新的样子！";
    }
    if (originalStr.match(regex_from4)) {
        if (translations[RegExp.$8]) {
            originalStr = originalStr.replace(regex_from4, "");
            originalStr +=  "(因" + translations[RegExp.$2] + "而×" + RegExp.$1 + ") " + "(因" + translations[RegExp.$4] + "而×" + RegExp.$3 + ") " + "(因" + translations[RegExp.$6] + "而×" + RegExp.$5 + ") "+ "(因" + translations[RegExp.$8] + "而×" + RegExp.$7 + ")";
        }
        return originalStr.replace("因求雨而×", "因下雨而×").replace("因始源之海而×", "因大雨而×").replace("因终结之地而×", "因大日照而×");
    }
    if (originalStr.match(regex_from3)) {
        if (translations[RegExp.$6]) {
            originalStr = originalStr.replace(regex_from3, "");
            originalStr +=  "(因" + translations[RegExp.$2] + "而×" + RegExp.$1 + ") " + "(因" + translations[RegExp.$4] + "而×" + RegExp.$3 + ") " + "(因" + translations[RegExp.$6] + "而×" + RegExp.$5 + ")";
        }
        return originalStr.replace("因求雨而×", "因下雨而×").replace("因始源之海而×", "因大雨而×").replace("因终结之地而×", "因大日照而×");
    }
    if (originalStr.match(regex_from2)) {
        if (translations[RegExp.$4]) {
            originalStr = originalStr.replace(regex_from2, "");
            originalStr +=  "(因" + translations[RegExp.$2] + "而×" + RegExp.$1 + ") " + "(因" + translations[RegExp.$4] + "而×" + RegExp.$3 + ")";
        }
        return originalStr.replace("因求雨而×", "因下雨而×").replace("因始源之海而×", "因大雨而×").replace("因终结之地而×", "因大日照而×");
    }
    if (originalStr.match(regex_from)) {
        if (translations[RegExp.$2]) {
            originalStr = originalStr.replace(regex_from, "");
            originalStr +=  "(因" + translations[RegExp.$2].replace("求雨", "下雨").replace("始源之海", "大雨").replace("终结之地", "大日照") + "而×" + RegExp.$1 + ")";
        }
        return originalStr;
    }
    if (originalStr.match(regex_toProtective_Pads)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "因部位护具而保护了自身！";
    }
    if (originalStr.match(regex_Protective_Pads)) {
        return  trans_from_dict(RegExp.$1) + "因部位护具而保护了自身！";
    }
    if (originalStr.match(regex_toAbility_Shield)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "的特性正受到特性护具效果的保护！";
    }
    if (originalStr.match(regex_Ability_Shield)) {
        return  trans_from_dict(RegExp.$1) + "的特性正受到特性护具效果的保护！";
    }
    if (originalStr.match(regex_togrudge)) {
        return  "因为怨念，对手的" + trans_from_dict(RegExp.$1) + "失去了其招式" + translations[RegExp.$2] + "的所有PP！";
    }
    if (originalStr.match(regex_grudge)) {
        return   "因为怨念，" + trans_from_dict(RegExp.$1) + "失去了其招式" + translations[RegExp.$2] + "的所有PP！";
    }
    if (originalStr.match(regex_toalready_has_burn)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "已经灼伤了。";
    }
    if (originalStr.match(regex_already_has_burn)) {
        return  trans_from_dict(RegExp.$1) + "已经灼伤了。";
    }
    if (originalStr.match(regex_already_searching)) {
        return  "无法搜索：您已经在搜索一场" + RegExp.$1 + "对战了。";
    }
    if (originalStr.match(regex_todoesnt_become_confused)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "并没有混乱！";
    }
    if (originalStr.match(regex_doesnt_become_confused)) {
        return  trans_from_dict(RegExp.$1) + "并没有混乱！";
    }
    if (originalStr.match(regex_already_challenge)) {
        return  "您和" + RegExp.$2 + "之间已经有了一场" + RegExp.$1 + "挑战了！";
    }
    if (originalStr.match(regex_tobecause_Heal_Block)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "因回复封锁而无法使出" + translations[RegExp.$2] + "！";
    }
    if (originalStr.match(regex_because_Heal_Block)) {
        return  trans_from_dict(RegExp.$1) + "因回复封锁而无法使出" + translations[RegExp.$2] + "！";
    }
    if (originalStr.match(regex_offering_tie)) {
        return  RegExp.$1 + "请求平局。";
    }
    if (originalStr.match(regex_rejected_accepted_tie)) {
        return  RegExp.$1 + trans_from_dict(RegExp.$2 == "rejected" ? "拒绝" : "同意") + "了平局。";
    }
    if (originalStr.match(regex_ywaiftbdeit)) {
        return  "如果战斗在" + RegExp.$1 + "回合内未结束（到第" + RegExp.$2 + "回合时），将自动平局。";
    }
    if (originalStr.match(regex_ifuwttieecu)) {
        return  "（如果您想更早平局，可以考虑使用`" + RegExp.$1 + "`指令。）";
    }
    if (originalStr.match(regex_toStickyBarb_burn_BlackSludge)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "受到了" + trans_from_dict(RegExp.$2 == "Sticky Barb" ? "附着针" : RegExp.$2 == "burn"  ? "灼伤" : "黑色污泥") + "的伤害！";
    }
    if (originalStr.match(regex_StickyBarb_burn_BlackSludge)) {
        return  trans_from_dict(RegExp.$1) + "受到了" + trans_from_dict(RegExp.$2 == "Sticky Barb" ? "附着针" : RegExp.$2 == "burn"  ? "灼伤" : "黑色污泥") + "的伤害！";
    }
    if (originalStr.match(regex_toCrafty_Quick_Wide_Shield)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "受到了" + trans_from_dict(RegExp.$1 == "Crafty" ? "戏法" : RegExp.$1 == "Quick"  ? "快速" : "广域")  + "防守的保护！";
    }
    if (originalStr.match(regex_Crafty_Quick_Wide_Shield)) {
        return  trans_from_dict(RegExp.$1) + "受到了" + trans_from_dict(RegExp.$1 == "Crafty" ? "戏法" : RegExp.$1 == "Quick"  ? "快速" : "广域")  + "防守的保护！";
    }
    if (originalStr.match(regex_toTreasures_of_ruin)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "的" + translations[RegExp.$2] + "令周围的宝可梦的" + translations[RegExp.$3] + "减弱了！";
    }
    if (originalStr.match(regex_Treasures_of_ruin)) {
        return  trans_from_dict(RegExp.$1) + "的" + translations[RegExp.$2] + "令周围的宝可梦的" + translations[RegExp.$3] + "减弱了！";
    }
    if (originalStr.match(regex_Specific_to)) {
        return  translations[RegExp.$1] + "的专属道具";
    }
    if (originalStr.match(regex_toprotective_mist)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "受到了薄雾场地的保护！";
    }
    if (originalStr.match(regex_protective_mist)) {
        return  trans_from_dict(RegExp.$1) + "受到了薄雾场地的保护！";
    }
    if (originalStr.match(regex_torose)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "的" + translations[RegExp.$2] + trans_from_dict(RegExp.$3 == "rose drastically" ? "巨幅提高" : RegExp.$3 == "rose sharply"  ? "大幅提高" : "提高")  + "了！";
    }
    if (originalStr.match(regex_rose)) {
        return  trans_from_dict(RegExp.$1) + "的" + translations[RegExp.$2] + trans_from_dict(RegExp.$3 == "rose drastically" ? "巨幅提高" : RegExp.$3 == "rose sharply"  ? "大幅提高" : "提高")  + "了！";
    }
    if (originalStr.match(regex_tofell)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "的" + translations[RegExp.$2] + trans_from_dict(RegExp.$3 == "fell severely" ? "巨幅降低" : RegExp.$3 == "fell harshly"  ? "大幅降低" : "降低") + "了！";
    }
    if (originalStr.match(regex_fell)) {
        return   trans_from_dict(RegExp.$1) + "的" + translations[RegExp.$2] + trans_from_dict(RegExp.$3 == "fell severely" ? "巨幅降低" : RegExp.$3 == "fell harshly"  ? "大幅降低" : "降低") + "了！";
    }
    if (originalStr.match(regex_toperishsong)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "的灭亡计时变成" + RegExp.$2 + "了！";
    }
    if (originalStr.match(regex_perishsong)) {
        return  trans_from_dict(RegExp.$1) + "的灭亡计时变成" + RegExp.$2 + "了！";
    }
    if (originalStr.match(regex_toDestiny_Knot)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "因红线而着迷了！";
    }
    if (originalStr.match(regex_Destiny_Knot)) {
        return  trans_from_dict(RegExp.$1) + "因红线而着迷了！";
    }
    if (originalStr.match(regex_toBerserk_Gene)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "用破坏基因大幅提高了攻击！";
    }
    if (originalStr.match(regex_Berserk_Gene)) {
        return  trans_from_dict(RegExp.$1) + "用破坏基因大幅提高了攻击！";
    }
    if (originalStr.match(regex_Guessed_spread)) {
        originalStr = originalStr.replace("");
        originalStr = translations[RegExp.$1] + ": " + RegExp.$2 + " " + translations[RegExp.$3] + " / " + RegExp.$4 + " " + translations[RegExp.$5] + " / " + RegExp.$6 + " " + translations[RegExp.$7] + RegExp.$8;
        return originalStr.replace("Atk", "攻击").replace("Def", "防御").replace("SpA", "特攻").replace("SpD", "特防").replace("Spe", "速度").replace("+Atk", "+攻击").replace("+Def", "+防御").replace("+SpA", "+特攻").replace("+SpD", "+特防").replace("+Spe", "+速度").replace("-Atk", "-攻击").replace("-Def", "-防御").replace("-SpA", "-特攻").replace("-SpD", "-特防").replace("-Spe", "-速度");
    }
    if (originalStr.match(regex_Guessed_spread2)) {
        originalStr = originalStr.replace("");
        originalStr = RegExp.$1 + " " + translations[RegExp.$2] + " / " + RegExp.$3 + " " + translations[RegExp.$4] + RegExp.$5;
        return originalStr.replace("Atk", "攻击").replace("Def", "防御").replace("SpA", "特攻").replace("SpD", "特防").replace("Spe", "速度").replace("+Atk", "+攻击").replace("+Def", "+防御").replace("+SpA", "+特攻").replace("+SpD", "+特防").replace("+Spe", "+速度").replace("-Atk", "-攻击").replace("-Def", "-防御").replace("-SpA", "-特攻").replace("-SpD", "-特防").replace("-Spe", "-速度");
    }
    if (originalStr.match(regex_Teaches)) {
        return  "教会某些宝可梦" + translations[RegExp.$1] + "。一次性使用";
    }
    if (originalStr.match(regex_allows_ZMove)) {
        return  trans_from_dict(RegExp.$1 == "a" ? "拥有" : "拥有") + translations[RegExp.$2] + "属性招式的携带者可以使" + trans_from_dict(RegExp.$3 == "a" ? "用" : "用") + translations[RegExp.$4] + "属性Z招式";
    }
    if (originalStr.match(regex_Multi_Attack)) {
        return  "携带后多属性攻击变为" + translations[RegExp.$1] + "属性";
    }
    if (originalStr.match(regex_Judgment)) {
        return  "携带后" + translations[RegExp.$1] + "招式威力提升20%，制裁光砾变为" + translations[RegExp.$2] + "属性";
    }
    if (originalStr.match(regex_attacks_have)) {
        return  "携带后" + translations[RegExp.$1] + "属性招式威力提升" + RegExp.$2 + "0%";
    }
    if (originalStr.match(regex_Gem)) {
        return  "使用" + translations[RegExp.$1] + "属性招式时提升本次攻击" + RegExp.$2 + "0%的威力。使用后消失";
    }
    if (originalStr.match(regex_taken_supereffective)) {
        return  "受到效果绝佳的" + translations[RegExp.$1] + "属性招式时伤害减半。使用后消失";
    }
    if (originalStr.match(regex_Can_revived)) {
        return  "可以用来复活" + translations[RegExp.$1];
    }
    if (originalStr.match(regex_Evolves)) {
        if (translations[RegExp.$1])
            return  translations[RegExp.$1] + trans_from_dict(RegExp.$3 == "us" ? "使用" : "携带并通信交换") + "后，进化为" + translations[RegExp.$2];
        else
            return  RegExp.$1 + trans_from_dict(RegExp.$3 == "us" ? "使用" : "携带并通信交换") + "后，进化为" + RegExp.$2;
    }
    if (originalStr.match(regex_confuses_Nature)) {
        return  "HP低于" + RegExp.$2 + "最大HP时，恢复最大HP的" + RegExp.$1 + "，减" + translations[RegExp.$3] + "性格会混乱。使用后消失";
    }
    if (originalStr.match(regex_Mega_Evolve_item)){
        if (translations[RegExp.$2])
            return  "让" + translations[RegExp.$2] + "携带后，在战斗时可以进行超级进化";
        else
            return "让" + RegExp.$2 + "携带后，在战斗时可以进行超级进化"
    }
    if (originalStr.match(regex_Spe_to)) {
        return   ": " + RegExp.$1 + " 至 " + RegExp.$2;
    }
    if (originalStr.match(regex_battles_ballte)) {
        return  RegExp.$1 + "场 " + RegExp.$2 + trans_from_dict(RegExp.$3 == "battles" ? "对战" : "对战");
    }
    if (originalStr.match(regex_Turn)) {
        return  "回合 " + RegExp.$1;
    }
    if (originalStr.match(regex_Transformed_into2)) {
        return "(变成了" + trans_from_dict(RegExp.$1) + ")";
    }
    if (originalStr.match(regex_knocked_off)) {
        return  translations[RegExp.$1] + " (拍落)";
    }
    if (originalStr.match(regex_hid_replay)) {
        return  RegExp.$1 + "隐藏了这场战斗的回放。";
    }
    if (originalStr.match(regex_weather_suppressed)) {
        if (translations[RegExp.$2])
            return  "(" + translations[RegExp.$2] + "使" + trans_from_dict(RegExp.$1 == "Snow" ? "下雪" : RegExp.$1 == "Hail"  ? "冰雹" : RegExp.$1 == "Desolate Land"  ? "大日照" : RegExp.$1 == "Sunny Day"  ? "大晴天" : RegExp.$1 == "Primordial Sea" ? "始源之海": RegExp.$1 == "Rain Dance" ? "下雨" : "沙暴") + "的影响无效了)";
    }
    if (originalStr.match(regex_Nature_Power)) {
        return "自然之力变成了" + translations[RegExp.$1] + "！";
    }
    if (originalStr.match(regex_Use_different_nature)) {
        return "使用这种性格可以多出" + RegExp.$1 + "点基础点数:";
    }
    if (originalStr.match(regex_made_hidden)) {
        return  RegExp.$1 + "将房间隐藏了。";
    }
    if (originalStr.match(regex_made_public)) {
        return  RegExp.$1 + "将房间公开了。";
    }
    if (originalStr.match(regex_tofell_sky)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "因重力而掉到了地面！";
    }
    if (originalStr.match(regex_fell_sky)) {
        return  trans_from_dict(RegExp.$1) + "因重力而掉到了地面！";
    }
    if (originalStr.match(regex_lol)) {
        return  "您还没有" + RegExp.$1.replace(" ", "") + "队伍";
    }
    if (originalStr.match(regex_toconcentrated)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "磨砺了精神！";
    }
    if (originalStr.match(regex_concentrated)) {
        return  trans_from_dict(RegExp.$1) + "磨砺了精神！";
    }
    if (originalStr.match(regex_toshook_head)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "摇了摇头，好像无法使出这个招式......";
    }
    if (originalStr.match(regex_shook_head)) {
        return  trans_from_dict(RegExp.$1) + "摇了摇头，好像无法使出这个招式......";
    }
// 锦标赛
    if (originalStr.match(regex_setourc)) {
        return  trans_from_dict(RegExp.$1) + "单败淘汰赛已创建。";
    }
    if (originalStr.match(regex_detourc)) {
        return  trans_from_dict(RegExp.$1) + "双败淘汰赛已创建。";
    }
    if (originalStr.match(regex_ttouwsophjc)) {
        return  "比赛将在" + trans_from_dict(RegExp.$1) + "名玩家加入后开始。";
    }
    if (originalStr.match(regex_ttouradthbstm)) {
        return  "比赛的自动取消资格计时器已设置为" + trans_from_dict(RegExp.$1) + "分钟。";
    }
    if (originalStr.match(regex_ttourwnalp)) {
        return  trans_from_dict(RegExp.$1) + "锦标赛现在将计入积分排行榜。";
    }
    if (originalStr.match(regex_ttourwnla)) {
        return  trans_from_dict(RegExp.$1) + "锦标赛将不再计入积分排行榜。";
    }

    if (match = originalStr.match(regex_jointtour)) {
        return trans_from_dict(match[1]) + "加入了锦标赛。";
    }
    if (match = originalStr.match(regex_leftttour)) {
        return trans_from_dict(match[1]) + "退出了锦标赛。";
    }
    if (match = originalStr.match(regex_jointtour2)) {
        return trans_from_dict(match[1]) + "和" + trans_from_dict(match[2]) + "加入了锦标赛。";
    }
    if (match = originalStr.match(regex_jointtour5)) {
        return trans_from_dict(match[1]) + "、" + trans_from_dict(match[2]) + "和" + trans_from_dict(match[3]) + "加入了锦标赛；" + trans_from_dict(match[4]) + "和" + trans_from_dict(match[5]) + "退出了锦标赛。";
    }
    if (match = originalStr.match(regex_jointtourx)) {
        return trans_from_dict(match[1]) + "、" + trans_from_dict(match[2]) + "、" + trans_from_dict(match[3]) + "、" + trans_from_dict(match[4]) + "、" + trans_from_dict(match[5]) + "及其他" + trans_from_dict(match[6]) + "人加入了锦标赛。";
    }

    if (originalStr.match(regex_tthsp)) {
        return  "锦标赛已经开始！（" + trans_from_dict(RegExp.$1) + "名选手参赛）";
    }
    if (originalStr.match(regex_tbattlebas)) {
        return  trans_from_dict(RegExp.$1) + "与" + trans_from_dict(RegExp.$2) + "之间的锦标赛战斗开始了。";
    }
    if (originalStr.match(regex_hwontma)) {
        return  trans_from_dict(RegExp.$1) + "以" + trans_from_dict(RegExp.$2) + "的比分战胜了" + trans_from_dict(RegExp.$3);
    }
    if (originalStr.match(regex_hlosttma)) {
        return  trans_from_dict(RegExp.$1) + "以" + trans_from_dict(RegExp.$2) + "的比分输给了" + trans_from_dict(RegExp.$3);
    }
    if (originalStr.match(regex_cfwintset)) {
        return  "恭喜" + trans_from_dict(RegExp.$1) + "赢得" + trans_from_dict(RegExp.$2) + "单败淘汰赛冠军！";
    }
    if (originalStr.match(regex_hbdfttour)) {
        return  trans_from_dict(RegExp.$1) + "已被取消参赛资格。";
    }

  //  \s

    if (originalStr.match(regex_Mega_Evolution)) {
        return  "Mega进化";
    }
    if (originalStr.match(regex_Fallen)) {
        return  "倒下的同伴：" + RegExp.$1;
    }
    if (originalStr.match(regex_modifiers)) {
        if (translations[RegExp.$2])
            return  RegExp.$1.replace("×", "x ") + translations[RegExp.$2].replace("命中率", "命中").replace("闪避率", "闪避");
    }
    if (originalStr.match(regex_modifiers2)) {
        return  translations[RegExp.$2].replace("命中率", "命中").replace("闪避率", "闪避") + "已经×" + RegExp.$1 + "了";
    }
    if (originalStr.match(regex_PQ)) {
        return  trans_from_dict(RegExp.$1 == "Protosynthesis" ? "古代活性" : "夸克充能") + "：" + translations[RegExp.$2];
    }
    if (originalStr.match(regex_NR)) {
        return  "背水一战";
    }
    if (originalStr.match(regex_LR)) {
        return  "寄生种子";
    }
    if (originalStr.match(regex_SC)) {
        return  "盐腌";
    }
    if (originalStr.match(regex_SC2)) {
        return  "复制了能力";
    }
    if (originalStr.match(regex_DB)) {
        return  "同命";
    }
    if (originalStr.match(regex_SD)) {
        return  "击落";
    }
    if (originalStr.match(regex_MS)) {
        return  "熔岩风暴";
    }
    if (originalStr.match(regex_FS)) {
        return  "火焰旋涡";
    }
    if (originalStr.match(regex_ST)) {
        return  "流沙地狱";
    }
    if (originalStr.match(regex_ST2)) {
        return  "捕兽夹";
    }
    if (originalStr.match(regex_TC)) {
        return  "雷电囚笼";
    }
    if (originalStr.match(regex_TC2)) {
        return  "地狱突刺";
    }
    if (originalStr.match(regex_ME)) {
        return  "奇迹之眼";
    }
    if (originalStr.match(regex_OS)) {
        return  "气味侦测";
    }
    if (originalStr.match(regex_HB)) {
        return  "回复封锁";
    }
    if (originalStr.match(regex_HBE)) {
        return  "回复封锁解除了";
    }
    if (originalStr.match(regex_PS)) {
        return  RegExp.$1 + "回合后灭亡";
    }
    if (originalStr.match(regex_PNT)) {
        return  "下回合灭亡";
    }
    if (originalStr.match(regex_PN)) {
        return  "立即灭亡";
    }
    if (originalStr.match(regex_TS)) {
        return  "沥青射击";
    }
    if (originalStr.match(regex_TS2)) {
        return  "陷阱甲壳";
    }
    if (originalStr.match(regex_TS3)) {
        return  "无理取闹解除了";
    }
    if (originalStr.match(regex_MR)) {
        return  "需要恢复精力";
    }
    if (originalStr.match(regex_MR2)) {
        return  "电磁飘浮";
    }
    if (originalStr.match(regex_RP)) {
        return  "愤怒粉";
    }
    if (originalStr.match(regex_FM)) {
        return  "看我嘛";
    }
    if (originalStr.match(regex_CHB)) {
        return  "易中要害";
    }
    if (originalStr.match(regex_LF)) {
        return  "磨砺";
    }
    if (originalStr.match(regex_HH)) {
        return  "帮助";
    }
    if (originalStr.match(regex_PT)) {
        return  "力量戏法";
    }
    if (originalStr.match(regex_WG)) {
        return  "广域防守";
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
        return  "巨剑突击";
    }
    if (originalStr.match(regex_BB)) {
        return  "鸟嘴加农炮";
    }
    if (originalStr.match(regex_AR)) {
        return  "水流环";
    }
    if (originalStr.match(regex_SS)) {
        return  "慢启动";
    }
    if (originalStr.match(regex_BO)) {
        return  "靛蓝色宝珠";
    }
    if (originalStr.match(regex_RO)) {
        return  "朱红色宝珠";
    }
    if (originalStr.match(regex_AS)) {
        return  "迷人解除了";
    }
    if (originalStr.match(regex_DS)) {
        return  "定身法解除了";
    }
    if (originalStr.match(regex_ES)) {
        return  "再来一次解除了";
    }
    if (originalStr.match(regex_TE)) {
        return  "挑衅解除了";
    }
    if (originalStr.match(regex_CE)) {
        return  "混乱解除了";
    }
    if (originalStr.match(regex_IKO)) {
        return  "物品被拍落了";
    }
    if (originalStr.match(regex_FF)) {
        return  "引火";
    }
    if (originalStr.match(regex_IF)) {
        return  "正在封印对手";
    }
    if (originalStr.match(regex_AP)) {
        return  "已经中毒了";
    }
    if (originalStr.match(regex_AP2)) {
        return  "已经麻痹了";
    }
    if (originalStr.match(regex_AB)) {
        return  "已经灼伤了";
    }
    if (originalStr.match(regex_LS)) {
        return  "正在偷懒";
    }
    if (originalStr.match(regex_SDB)) {
        return  "能力不会降低";
    }
    if (originalStr.match(regex_BL)) {
        return  "失去了能力提升";
    }
    if (originalStr.match(regex_MG)) {
        return  "极巨防壁";
    }
    if (originalStr.match(regex_Guessed_spread3)) {
        return  "分配推测：(请选择4个招式以获得分配推测) (";
    }





    //  debug

    if (originalStr.match(regex_totoknock)) {
        return "对手的" + trans_from_dict(RegExp.$1) + "拍落了对手的" + trans_from_dict(RegExp.$2) + "的" + translations[RegExp.$3] + "！";
    }
    if (originalStr.match(regex_toknock2)) {
        return "对手的" + trans_from_dict(RegExp.$1) + "拍落了" + trans_from_dict(RegExp.$2) + "的" + translations[RegExp.$3] + "！";
    }
    if (originalStr.match(regex_toknock)) {
        return  trans_from_dict(RegExp.$1) + "拍落了对手的" + trans_from_dict(RegExp.$2) + "的" + translations[RegExp.$3] + "！";
    }
    if (originalStr.match(regex_knock)) {
        return  trans_from_dict(RegExp.$1) + "拍落了" + trans_from_dict(RegExp.$2) + "的" + translations[RegExp.$3] + "！";
    }
    if (originalStr.match(regex_knock2)) {
        if (translations[RegExp.$2])
            return  "拍落了" + trans_from_dict(RegExp.$1) + "的" + translations[RegExp.$2] + "！";
    }
    if (originalStr.match(regex_totothief)) {
        return "对手的" + trans_from_dict(RegExp.$1) + "夺取了对手的" + trans_from_dict(RegExp.$2) + "的" + translations[RegExp.$3] + "！";
    }
    if (originalStr.match(regex_tothief2)) {
        return "对手的" + trans_from_dict(RegExp.$1) + "夺取了" + trans_from_dict(RegExp.$2) + "的" + translations[RegExp.$3] + "！";
    }
    if (originalStr.match(regex_tothief)) {
        return  trans_from_dict(RegExp.$1) + "夺取了对手的" + trans_from_dict(RegExp.$2) + "的" + translations[RegExp.$3] + "！";
    }
    if (originalStr.match(regex_thief)) {
        return  trans_from_dict(RegExp.$1) + "夺取了" + trans_from_dict(RegExp.$2) + "的" + translations[RegExp.$3] + "！";
    }
    if (originalStr.match(regex_tototrace)) {
        return "对手的" + trans_from_dict(RegExp.$1) + "复制了对手的" + trans_from_dict(RegExp.$2) + "的" + translations[RegExp.$3] + "！";
    }
    if (originalStr.match(regex_totrace2)) {
        return "对手的" + trans_from_dict(RegExp.$1) + "复制了" + trans_from_dict(RegExp.$2) + "的" + translations[RegExp.$3] + "！";
    }
    if (originalStr.match(regex_totrace)) {
        return  trans_from_dict(RegExp.$1) + "复制了对手的" + trans_from_dict(RegExp.$2) + "的" + translations[RegExp.$3] + "！";
    }
    if (originalStr.match(regex_trace)) {
        return  trans_from_dict(RegExp.$1) + "复制了" + trans_from_dict(RegExp.$2) + "的" + translations[RegExp.$3] + "！";
    }
    if (originalStr.match(regex_totoroleplay)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "复制了对手的" + trans_from_dict(RegExp.$2) + "的特性" + translations[RegExp.$3] + "！";
    }
    if (originalStr.match(regex_toroleplay2)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "复制了" + trans_from_dict(RegExp.$2) + "的特性" + translations[RegExp.$3] + "！";
    }
    if (originalStr.match(regex_toroleplay)) {
        return   trans_from_dict(RegExp.$1) + "复制了对手的" + trans_from_dict(RegExp.$2) + "的特性" + translations[RegExp.$3] + "！";
    }
    if (originalStr.match(regex_roleplay)) {
        return   trans_from_dict(RegExp.$1) + "复制了" + trans_from_dict(RegExp.$2) + "的特性" + translations[RegExp.$3] + "！";
    }
    if (originalStr.match(regex_tocannot_use)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "无法使出" + translations[RegExp.$2].replace("节拍器", "挥指").replace("超能力", "精神强念").replace("刷新", "焕然一新").replace("不开启", "定身法") + "！";
    }
    if (originalStr.match(regex_cannot_use)) {
        return   trans_from_dict(RegExp.$1) + "无法使出" + translations[RegExp.$2].replace("节拍器", "挥指").replace("超能力", "精神强念").replace("刷新", "焕然一新").replace("不开启", "定身法") + "！";
    }
    if (originalStr.match(regex_tostockpiled)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "蓄力了" + RegExp.$2 + "次！";
    }
    if (originalStr.match(regex_stockpiled)) {
        return   trans_from_dict(RegExp.$1) + "蓄力了" + RegExp.$2 + "次！";
    }
    if (originalStr.match(regex_toihb)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "受到了" + trans_from_dict(RegExp.$2) + "的伤害！";
    }
    if (originalStr.match(regex_ihb)) {
        return  trans_from_dict(RegExp.$1) + "受到了" + trans_from_dict(RegExp.$2) + "的伤害！";
    }
    if (originalStr.match(regex_tofreed)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "从" + trans_from_dict(RegExp.$2) + "中解脱了！";
    }
    if (originalStr.match(regex_freed)) {
        return  trans_from_dict(RegExp.$1) + "从" + trans_from_dict(RegExp.$2) + "中解脱了！";
    }
    if (originalStr.match(regex_tocant_use)) {
        return "对手的" + trans_from_dict(RegExp.$1) + "无法使出" + translations[RegExp.$2].replace("节拍器", "挥指").replace("超能力", "精神强念").replace("刷新", "焕然一新").replace("不开启", "定身法") + "！";
    }
    if (originalStr.match(regex_cant_use)) {
        return trans_from_dict(RegExp.$1) + "无法使出" + translations[RegExp.$2].replace("节拍器", "挥指").replace("超能力", "精神强念").replace("刷新", "焕然一新").replace("不开启", "定身法") + "！";
    }
    if (originalStr.match(regex_totrapped)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "困住了" + trans_from_dict(RegExp.$2) + "！";
    }
    if (originalStr.match(regex_trapped)) {
        return   trans_from_dict(RegExp.$1) + "困住了对手的" + trans_from_dict(RegExp.$2) + "！";
    }
    if (originalStr.match(regex_joined)) {
        return RegExp.$1.replace(", ", "，" ).replace("and"," 和 ") + "加入了房间";
    }
    if (originalStr.match(regex_left)) {
        return RegExp.$1.replace(", ", "，" ).replace("and"," 和 ").replace(" joined; ","加入了房间; ") + "离开了";
    }
    if (originalStr.match(regex_toeerie_spell)) {
        return   "削减了对手的" + trans_from_dict(RegExp.$1) + "的" + translations[RegExp.$2].replace("节拍器", "挥指").replace("超能力", "精神强念").replace("刷新", "焕然一新").replace("不开启", "定身法") + "的PP" + RegExp.$3 + "点！";
    }
    if (originalStr.match(regex_eerie_spell)) {
        return   "削减了" + trans_from_dict(RegExp.$1) + "的" + translations[RegExp.$2].replace("节拍器", "挥指").replace("超能力", "精神强念").replace("刷新", "焕然一新").replace("不开启", "定身法") + "的PP" + RegExp.$3 + "点！";
    }
    if (originalStr.match(regex_Unavailable_choice_cant_move)) {
        return  "[无效的选择] 无法使出:" + trans_from_dict(RegExp.$1) + "的" + translations[RegExp.$2].replace("节拍器", "挥指").replace("超能力", "精神强念").replace("刷新", "焕然一新").replace("不开启", "定身法") + "被禁用";
    }
    if (originalStr.match(regex_toleppaberry)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "用苹野果恢复了" + translations[RegExp.$2].replace("节拍器", "挥指").replace("超能力", "精神强念").replace("刷新", "焕然一新").replace("不开启", "定身法") + "的PP！";
    }
    if (originalStr.match(regex_leppaberry)) {
        return  trans_from_dict(RegExp.$1) + "用苹野果恢复了" + translations[RegExp.$2].replace("节拍器", "挥指").replace("超能力", "精神强念").replace("刷新", "焕然一新").replace("不开启", "定身法") + "的PP！";
    }
    if (originalStr.match(regex_tostat_changes)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "的能力等级变化了！";
    }
    if (originalStr.match(regex_stat_changes)) {
        return   trans_from_dict(RegExp.$1) + "的能力等级变化了！";
    }
    if (originalStr.match(regex_tosymbiosis)) {
        return   "对手的" + trans_from_dict(RegExp.$1) + "将" + translations[RegExp.$2] + "交给了对手的" + trans_from_dict(RegExp.$3) + "！";
    }
    if (originalStr.match(regex_symbiosis)) {
        return   trans_from_dict(RegExp.$1) + "将" + translations[RegExp.$2] + "交给了" + trans_from_dict(RegExp.$3) + "！";
    }
    if (originalStr.match(regex_tohigh_low)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "的" + translations[RegExp.$2] + "已经" + trans_from_dict(RegExp.$3 == "high" ? "无法再提高" : "降到最低") + "了！";
    }
    if (originalStr.match(regex_high_low)) {
        return   trans_from_dict(RegExp.$1) + "的" + translations[RegExp.$2] + "已经" + trans_from_dict(RegExp.$3 == "high" ? "无法再提高" : "降到最低") + "了！";
    }
    if (originalStr.match(regex_towas_heightened)) {
        return  "对手的" +  trans_from_dict(RegExp.$1) + "的" + translations[RegExp.$2] + "升高了！";
    }
    if (originalStr.match(regex_was_heightened)) {
        return  trans_from_dict(RegExp.$1) + "的" + translations[RegExp.$2] + "升高了！";
    }
    if (originalStr.match(regex_Move_here)) {
        return  "移动至";
    }
    if (originalStr.match(regex_to_used)) {
        return  "对手的" + trans_from_dict(RegExp.$1) + "使出了";
    }
    if (originalStr.match(regex_used)) {
        return  trans_from_dict(RegExp.$1) + "使出了";
    }
    if (originalStr.match(regex_to123)) {
        if (translations[RegExp.$2])
            return  "[对手的" + trans_from_dict(RegExp.$1) + "的" + translations[RegExp.$2] + "]";
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
            return  translations[RegExp.$1] + " / " + translations[RegExp.$2] +" / " + translations[RegExp.$3] +" / " + translations[RegExp.$4] +" / " + translations[RegExp.$5] + " / " + translations[RegExp.$6] +" / " + translations[RegExp.$7] + " / " + translations[RegExp.$8] +" / " + translations[RegExp.$9];
        return originalStr;
    }
    if (originalStr.match(regex_8)) {
        if (translations[RegExp.$8])
            return  translations[RegExp.$1] + " / " + translations[RegExp.$2] +" / " + translations[RegExp.$3] +" / " + translations[RegExp.$4] +" / " + translations[RegExp.$5] + " / " + translations[RegExp.$6] + " / " + translations[RegExp.$7] + " / " + translations[RegExp.$8];
        return originalStr;
    }
    if (originalStr.match(regex_7)) {
        if (translations[RegExp.$7])
            return  translations[RegExp.$1] + " / " + translations[RegExp.$2] +" / " + translations[RegExp.$3] +" / " + translations[RegExp.$4] +" / " + translations[RegExp.$5] + " / " + translations[RegExp.$6] + " / " + translations[RegExp.$7];
        return originalStr;
    }
    if (originalStr.match(regex_6)) {
        if (translations[RegExp.$6])
            return  translations[RegExp.$1] + " / " + translations[RegExp.$2] +" / " + translations[RegExp.$3] +" / " + translations[RegExp.$4] +" / " + translations[RegExp.$5] + " / " + translations[RegExp.$6];
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
    if (originalStr.match(regex_333)) {
        if (translations[RegExp.$3])
            if (translations[RegExp.$2])
                if (translations[RegExp.$1])
                    return  translations[RegExp.$1] + "，" + translations[RegExp.$2]+ "，" + translations[RegExp.$3];
    }
    if (originalStr.match(regex_222)) {
        if (translations[RegExp.$2])
            if (translations[RegExp.$1])
                return  translations[RegExp.$1] + "，" + translations[RegExp.$2];
    }
    if (originalStr.match(regex_111)) {
        return  trans_from_dict(RegExp.$1 == "不开启" ? "定身法 " : RegExp.$1 == "超能力"  ? "精神强念 " : RegExp.$1 == "节拍器"  ? "挥指 " : RegExp.$1 == "刷新"  ? "焕然一新 " : "攻击 ");
    }
    if (originalStr.match(regex_11)) {
        return  "!" + RegExp.$1;
    }
    if (originalStr.match(regex_rating)) {
        return  RegExp.$1 + "的分数：" + RegExp.$2;
    }
    if (originalStr.match(regex_forwin)) {
        return  "（获胜" + RegExp.$1 + "）";
    }
    if (originalStr.match(regex_forlos)) {
        return  "（战败" + RegExp.$1 + "）";
    }
    if (originalStr.match(regex_tourwsoumbaq)) {
        return  "请在" + RegExp.$1 + "秒内对比赛作出回应，否则您可能会被自动取消资格。";
    }
    if (originalStr.match(regex_statussetto)) {
        return  "您的状态已被设置为：" + RegExp.$1 + "。";
    }
    if (originalStr.match(regex_tcdnetsamswt)) {
        return  "指令" + RegExp.$1 +"不存在。如果要发送以" + RegExp.$2 + "开头的消息，请输入" + RegExp.$3;
    }
    if (originalStr.match(regex_useroffinemessge)) {
        return  "用户" + RegExp.$1 +"已离线。再次发送消息可以留言。如果您正在使用" + RegExp.$2 + "指令，请改用" + RegExp.$3 + "指令。";
    }
    return originalStr.replace("(Tera type BP minimum)", "(太晶化后的最低招式威力为60)").replace("挑战Cup", "Challenge Cup").replace("Possible Illusion", "可能是幻觉").replace("(priority", "(优先度").replace("(approximate)", "(近似计算)").replace("[sent offline", "[离线发送").replace("of its health!)", "的生命值！)").replace("'s replays", "的回放").replace("(Hit 1 time)", "(受到1次伤害)").replace("(Hit 2 times)", "(受到2次伤害)").replace("(Hit 3 times)", "(受到3次伤害)").replace("(Hit 4 times)", "(受到4次伤害)").replace("(Hit 5 times)", "(受到5次伤害)").replace("(Hit 6 times)", "(受到6次伤害)").replace("(no Terrain)", "(没有场地)").replace("(Artist:", "(画家:").replace("(blocked by target's Dynamax)", "(对极巨化宝可梦无效)").replace("(fails if target's level is higher)", "(如果目标等级更高，使用失败)").replace("(+1% per level above target)", "(比目标每高1级，命中率+1%)").replace("(not Ice-type)", "(不是冰属性)");
    ;
}

function translateNode(node) {
    if (node.tagName == 'SCRIPT') return;
    var value = node.nodeValue;
    if (value.startsWith("If this move is successful, it deals damage or heals the target. 102/256 chance for")) node.nodeValue = "随机选择如下效果：102/256几率以40威力攻击对手；76/256几率以80威力攻击对手；26/256几率以120威力攻击对手；52/256几率回复对手1/4的最大HP(向下取整)。在第二世代使用礼物招式时，伤害计算公式中的等级、攻击、防御变量的值会发生改变。攻击的值会变为5（岩石属性或钢属性）或10（其他属性）。等级与防御的值由宝可梦的属性决定，其中等级会变为防御方宝可梦第二属性的内部编号，防御会变为攻击方宝可梦第二属性的内部编号（如果攻击方或防御方宝可梦只有一种属性，按照该宝可梦的第一属性计算）。各属性的内部编号如下：0=一般，1=格斗，2=飞行，3=毒，4=地面，5=岩石，7=虫，8=幽灵，9=钢，20=火，21=水，22=草，23=电，24=超能力，25=冰，26=龙，27=恶。";
    if (value.startsWith("The user spends two turns locked into this move and then, on the second turn after using this move, the user attacks the last Pokemon that hit")) node.nodeValue = "进入忍耐状态，2回合内无法使用其它招式、使用道具或交换宝可梦。第三回合以处于忍耐状态期间，上一次使用攻击招式对使用者造成伤害的对手所在场地的宝可梦为目标，对目标造成处于忍耐状态期间受到攻击招式的总伤害×2的伤害。该招式无法对没有效果的属性的宝可梦造成伤害，但忽略其它属性相克和属性一致加成且必定命中。";
    if (value.startsWith("The user and its ally's Abilities change to match the target's Ability. Does not")) node.nodeValue = "将自身和同伴的特性转变为目标的特性。以下情况时，招式使用失败：使用者或同伴与目标特性相同；目标特性为神奇守护、复制、接球手、化学之力、阴晴不定、花之礼、多属性、变身者、幻觉、达摩模式、战斗切换、群聚变形、牵绊变身、画皮、鱼群、界限盾壳、AR系统、饱了又饿、一口导弹、结冻头、人马一体、绝对睡眠、化学变化气体、全能变身、发号施令、古代活性和夸克充能； 或者使用者或同伴的特性为多属性、达摩模式、战斗切换、群聚变形、牵绊变身、画皮、鱼群、界限盾壳、AR系统、一口导弹、结冻头、人马一体、绝对睡眠、全能变身、发号施令、古代活性和夸克充能。";
    if (value.startsWith("The user's type changes to match a type that resists or is immune to the type of the last move used by the target, but not either of its current types. The determined type of the move is used rather than the original type. Fails if")) node.nodeValue = "自身的属性改变为上回合目标使用招式的属性对自身效果不理想或没有效果的属性。属性随机选择，并且不为自身当前属性。如果没有合适的新属性，招式使用会失败。无视目标在使用招式之后的属性及特性变化，例如目标在使用招式时拥有一般皮肤特性，则纹理2按一般属性计算，即使在目标使用招式后被消除了一般皮肤特性。如果目标没有使用过招式，或使用者无法改变属性，或此招式只能变成自身的当前属性，使用失败。";
    if (value.startsWith("The user swaps its Attack and Defense stats, and stat stage changes remain on their respective stats. This move can be used again to swap the stats back. If")) node.nodeValue = "交换自身的攻击和防御。对应的能力变化不交换，作用于交换后对应的能力值上。此状态被接棒招式转移给其它宝可梦后，以使用当前宝可梦的能力值计算，不以接棒使用者的能力值计算。如果先使用此招式，再使用变身，变身后的能力值覆盖其前的能力值。";
    if (value.startsWith("The user's Ability changes to match the target's Ability. Fails if")) node.nodeValue = "把自身特性转变为目标的特性。以下情况时，招式使用失败：使用者与目标特性相同；目标特性为神奇守护、复制、接球手、化学之力、阴晴不定、花之礼、多属性、变身者、幻觉、达摩模式、战斗切换、群聚变形、牵绊变身、画皮、鱼群、界限盾壳、AR系统、饱了又饿、一口导弹、结冻头、人马一体、绝对睡眠、化学变化气体、全能变身、发号施令、古代活性和夸克充能； 或使用者的特性为多属性、达摩模式、战斗切换、群聚变形、牵绊变身、画皮、鱼群、界限盾壳、AR系统、一口导弹、结冻头、人马一体、绝对睡眠、全能变身、发号施令、古代活性和夸克充能。";
    if (value.startsWith("If another Pokemon uses certain non-damaging moves this turn, the user steals that move")) node.nodeValue = "若当回合有其他宝可梦成功使出对其自身或其所在方场地有利的变化招式，会立刻将其效果夺为己用。该招式每次使用最多只能夺取1个招式的效果。若当回合有多只宝可梦使用抢夺，则按照行动顺序，由最先行动的宝可梦先进行夺取。之后其他宝可梦依次进行夺取，且不会抢夺本回合已被夺取过的招式。当使用者处于自由落体状态时，该效果无效。";
    if (value.startsWith("This move cannot be selected until the user eats a Berry, either by eating one that was held, stealing and eating one")) node.nodeValue = "如果自身没有吃掉树果，则招式无法选择。使用虫咬、啄食吃掉目标携带的树果时，或其他宝可梦携带树果时向自身使用投掷并使树果在自身身上发动，都视为吃掉树果。吃掉树果的宝可梦再次上场或者获得了其他物品，也可以选择此招式并在战斗的剩余时间使用。通过自然之恩消耗的树果不视为吃掉。";
    if (value.startsWith("The user uses the move the target chose for use this turn against it, if possible, with its power multiplied by 1.5. The move must be a damaging move other than Beak Blast, Belch, Chatter, Counter, Covet, Focus Punch, Me First, Metal Burst, Mirror Coat, Shell Trap, Struggle, Thief, or any Z-Move. Fails if the target moves before the user. Ignores the target's substitute for the purpose of copying the move.")) node.nodeValue = "如果目标当回合选择了造成伤害的招式，自身则会抢先对目标使用该招式，并且威力提升50%。通过抢先一步无法发动下列招式：挣扎、打嗝、喋喋不休、渴望、小偷、真气拳、鸟嘴加农炮、陷阱甲壳、双倍奉还、镜面反射、金属爆炸以及Z招式。如果目标在自身之前行动，则招式失败。即使目标在替身状态下，也会抢先使用招式。";
    if (value.startsWith("For 5 turns, the held items of all active Pokemon have no effect. An item's effect of causing forme changes is unaffected, but any other effects from such items are negated. During the effect, Fling and Natural Gift are prevented from being used by all active Pokemon. If this move is used during the effect, the effect ends.")) node.nodeValue = "5回合内，所有场上的宝可梦的道具没有效果。不会影响宝可梦的超级进化、原始回归和使用Z招式。在魔法空间效果存在时，使用投掷或自然之恩会失败。在魔法空间效果存在的情况下再次使用魔法空间，会结束魔法空间的效果。";
    if (value.startsWith("This attack takes the target into the air with the user on the first turn and executes on the second")) node.nodeValue = "在第一回合飞上天空进行蓄力，同时抓起目标飞上天空，在第二回合发动招式。在第一回合，避免除起风、打雷、冲天拳、龙卷风、暴风、击落、音爆、千箭齐发外的所有攻击。对处于替身状态的宝可梦、同伴或体重200kg以上的宝可梦使用自由落体会失败。如果目标使用了魔法反射、挖洞、潜水、飞翔、暗影奇袭、暗影潜袭或自由落体，则在第一回合失败。无法对飞行属性的宝可梦造成伤害。该回合目标可以使用招式，但无法替换宝可梦、逃走或使用道具。";
    if (value.startsWith("If an ally Tatsugiri has activated its Commander Ability, this")) node.nodeValue = "若口中有米立龙，使用后会根据米立龙的姿势而提高能力。米立龙-上弓姿势会令使用者的攻击提升1级；米立龙-下垂姿势会令使用者的防御提升1级；米立龙-平挺姿势会令使用者的速度提升1级。即使口中的米立龙此后陷入濒死状态，使用上菜仍然会提高能力。";
    if (value.startsWith("Causes the target to become infatuated, making it unable to attack 50% of the time. Fails if both the user and the target are the same gender, if")) node.nodeValue = "使目标陷入着迷状态，处于着迷状态的宝可梦选择使用招式时有50%几率不能行动。只对异性宝可梦有效，双方为同性别、有任意一方为无性别，或目标已进入此状态，招式无效。拥有迟钝或芳香幕特性的宝可梦免疫此招式。";
    if (value.startsWith("Deals damage to the target equal to the target's maximum HP. Ignores accuracy and evasiveness modifiers. This attack's accuracy is equal to (user's level - target's level + 30)%, and fails if the target is at a higher level. Pokemon with the Sturdy Ability are immune.")) node.nodeValue = "造成与目标的HP相同的固定伤害。命中的概率不会受到命中率和闪避率影响。此攻击的命中率等于（自身等级-目标等级+30）%，如果自身等级低于目标，招式使用失败。此招式对结实特性的宝可梦无效。";
    if (value.startsWith("Hits one time for the user and one time for each unfainted Pokemon without a non-volatile status condition in the user's party. The power of each hit is equal to 5+(X/10)")) node.nodeValue = "攻击目标造成伤害，没有异常状态或濒死的全部同行宝可梦都会攻击对手。招式的威力会根据同行宝可梦的攻击种族值变化。每一击的威力=使用方的一只同行宝可梦的5+攻击种族值/10。每一击的来源都视为使用者。";
    if (value.startsWith("Raises the user's Special Defense by 1 stage. The user's next Electric-type attack will have its power doubled; the effect ends when the user is no longer active, or")) node.nodeValue = "令使用者的特防提升1级。使自身进入充电状态。处于充电状态的宝可梦使用的电属性招式的威力加倍。充电状态在下次使用电属性招式后结束，即使没有产生效果。";
    if (value.startsWith("Deals typeless damage to a random opposing Pokemon. If this move was successful, the user loses 1/4")) node.nodeValue = "攻击随机一位对手造成无属性的伤害。对使用者造成最大HP的1/4伤害，向上取整且不受坚硬脑袋和魔法防守特性的影响。如果没有可以使出的招式，就会使出此招式。";
    if (value.startsWith("Deals Normal-type damage. If this move was successful, the user takes damage equal to 1/2")) node.nodeValue = "造成一般属性的伤害。对使用者造成最大HP的1/2伤害，向上取整。如果没有可以使出的招式，就会使出此招式。";
    if (value.startsWith("A random move is selected for use, oth")) node.nodeValue = "在几乎所有招式中随机选择一个并使用。";
    if (value.startsWith("If this attack is not successful, the user loses HP equal to half the target's maximum HP if")) node.nodeValue = "如果攻击没有产生效果，自身承受本应造成伤害的1/2，上限为对手最大HP的1/2，向下取整。具有魔法防守特性的宝可梦不会受到反作用力伤害。";
    if (value.startsWith("The user will survive attacks made by other Pokemon during this turn with at least 1 HP. This move has an X/65536")) node.nodeValue = "在本回合结束使自身保留至少1点HP。此招式成功的几率为X/65536，其中X从65535开始，每次成功使出此招式时向下取整一半。在连续四次成功使出后，X降至118，并在随后的使用中以0～65535的随机选择一个数。如果此招式使用失败或用户的最后一次招式使用失败，X将重置为65535。如果使用失败，或上一回合使用的不是看穿、挺住或守住，X重置为65535。如果本回合使用者最后行动，招式会失败。";
    if (value.startsWith("The power of this move is 20 if X is 33 to 48, 40 if X is 17 to 32, 80 if X is 10 to 16, 100 if X is 5 to 9, 150 if X is 2 to 4, and 200 if X is 0 or 1, where X is equal to (user's current HP * 48 / user's maximum HP), rounded down. This")) node.nodeValue = "威力和自身剩下的HP有关(向下取整)。HP≥68.75%，威力为20；35.42%≤HP＜68.75%，威力为40；20.83%≤HP＜35.42%，威力为80；10.42%≤HP＜20.83%，威力为100；4.17%≤HP＜10.42%，威力为150；0＜HP＜4.17%，威力为200。此招式不会击中要害。";
    if (value.startsWith("Has an X% chance to confuse the target, where X is 0 unless the user is a Chatot that hasn't Transformed. If the user is a Chatot, X is 1, 11, or 31 depending on the volume of Chatot's recorded cry, if any; 1 for")) node.nodeValue = "有X%几率使目标陷入混乱。如果使用者是没有录音的聒噪鸟，X为0；录音音量低时X为1，录音音量中时X为11，录音音量高时X为31。";
    if (value.startsWith("Power is equal to (25 * target's current Speed / user's current Speed) + 1, rounded down, but not more than 150. If")) node.nodeValue = "威力 = 1 + 25 × 目标速度÷使用者速度，最大为150。如果使用者当前的速度为0，此招式的威力为1。";
    if (value.startsWith("Power is equal to the base move's Max Move power. If this move is successful, for 4 turns each non-Grass-type Pokemon")) node.nodeValue = "威力由原本招式的威力决定。在4～5回合内使非草属性的目标陷入束缚状态，每回合受到1/6最大HP的伤害并不能换下，向下取整。";
    if (value.startsWith("Power is equal to the base move's Max Move power. If this move is successful, for 4 turns each non-Water-type Pokemon")) node.nodeValue = "威力由原本招式的威力决定。在4～5回合内使非水属性的目标陷入束缚状态，每回合受到1/6最大HP的伤害并不能换下，向下取整。";
    if (value.startsWith("This attack charges on the first turn and executes on the second. Power is halved if the weather is Hail, Primordial Sea, Rain Dance, or Sandstorm. If the user is holding a Power Herb or the weather is Desolate Land or Sunny Day, the move completes in one turn.")) node.nodeValue = "在第一回合进行蓄力，第二回合攻击目标。如果当天气为大晴天或携带了强力香草，可以立刻结束蓄力，在第一回合发动招式。在天气为下雨、沙暴、冰雹时且自身没有携带万能伞，威力减半。";
    if (value.startsWith("Prevents the target from switching for two to five turns. Causes damage to the target equal to 1/16 of its maximum HP, rounded down, at the end of each turn during effect. The target can still switch")) node.nodeValue = "使目标陷入束缚状态。束缚状态持续2～5回合，处于束缚状态的宝可梦每回合结束时会受到1/16最大HP的伤害并不能换下，向下取整一半。如果目标使用了接棒，可以正常替换。如果使用者或目标离场，或者目标成功使出高速旋转，效果结束。使用此招式或其他束缚招式不会累计或重置束缚状态。";
    if (value.startsWith("Once this move is successfully used, the user automatically uses this move every turn and can no longer switch out. During the effect, the user's Attack is raised by 1 stage every time it is hit by the opposing Pokemon, and this move's accuracy is overwritten every turn with the current calculated accuracy including stat stage changes, but not to less than 1/256 or more than 255/256.")) node.nodeValue = "一旦成功使用此招式，使用者每回合都会自动使用此招式，并且不能切换招式。在使用该招式后到下次使用者使用招式之前，每受到一次攻击造成的伤害，使用者的攻击能力提升1级。每个回合此招式的命中率都会被当前的命中率覆盖，包括能力等级变化，但不小于1/256或大于255/256。";
    if (value.startsWith("For 5 turns, the terrain becomes Grassy Terrain. During the effect, the power of Grass-type attacks used by grounded Pokemon is multiplied by 1.3")) node.nodeValue = "在5回合内，场地变为青草场地。在效果持续期间，地面上的宝可梦使用的草属性招式威力增加1.3倍；对地面上的宝可梦使用的重踏、地震和震级的威力减半。地面上的宝可梦的在每回合结束时恢复1/16的最大HP，向下取整，包括效果的最后一回合。保护色会将使用者的属性变为草属性，自然之力会变为能量球，秘密之力有30%几率使目标陷入睡眠。如果当前场地已为青草场地，使用失败。";
    if (value.startsWith("For 5 turns, the terrain becomes Grassy Terrain. During the effect, the power of Grass-type attacks used by grounded Pokemon is multiplied by 1.5")) node.nodeValue = "在5回合内，场地变为青草场地。在效果持续期间，地面上的宝可梦使用的草属性招式威力增加1.5倍；对地面上的宝可梦使用的重踏、地震和震级的威力减半。地面上的宝可梦的在每回合结束时恢复1/16的最大HP，向下取整，包括效果的最后一回合。保护色会将使用者的属性变为草属性，自然之力会变为能量球，秘密之力有30%几率使目标陷入睡眠。如果当前场地已为青草场地，使用失败。";
    if (value.startsWith("For 5 turns, the terrain becomes Misty Terrain")) node.nodeValue = "5回合内，场地变为薄雾场地。在效果持续期间，对地面上的宝可梦使用的龙系属性招式威力减半，且地面上的宝可梦不会陷入任何异常状态以及混乱状态。地面上的宝可梦会受到哈欠的影响，但不会因此而陷入睡眠。保护色会将使用者的属性变为妖精属性，自然力量变成月亮之力，秘密之力有30%几率使目标的特攻降低1级。如果当前场地已为薄雾场地，使用失败。";
    if (value.startsWith("For 5 turns, the terrain becomes Psychic Terrain. During the effect, the power of Psychic-type attacks made by grounded Pokemon is multiplied by 1.3")) node.nodeValue = "5回合内，场地变为精神场地。在效果持续期间，地面上的宝可梦的超能力属性招式威力增加1.3倍，且不会受到对手先制招式的攻击或影响，双打对战中同伴之间使用的招式不受此限。保护色会将使用者变为超能力属性，自然之力变为精神强念，秘密之力有30%几率使目标的速度降低1级。如果当前场地已为精神场地，使用失败。";
    if (value.startsWith("For 5 turns, the terrain becomes Psychic Terrain. During the effect, the power of Psychic-type attacks made by grounded Pokemon is multiplied by 1.5")) node.nodeValue = "5回合内，场地变为精神场地。在效果持续期间，地面上的宝可梦的超能力属性招式威力增加1.5倍，且不会受到对手先制招式的攻击或影响，双打对战中同伴之间使用的招式不受此限。保护色会将使用者变为超能力属性，自然之力变为精神强念，秘密之力有30%几率使目标的速度降低1级。如果当前场地已为精神场地，使用失败。";
    if (value.startsWith("For 5 turns, the terrain becomes Electric Terrain. During the effect, the power of Electric-type attacks made by grounded Pokemon is multiplied by 1.3")) node.nodeValue = "5回合内，场地变为电气场地。在效果持续期间，地面上的宝可梦的电属性招式威力增加1.3倍；地面上的宝可梦无法进入睡眠状态，已经进入睡眠状态的宝可梦不会醒来。地面上的宝可梦不会受到哈欠的影响，并且不会因哈欠而进入睡眠状态。保护色会将使用者的属性变为电属性，自然之力会变为十万伏特，秘密之力有30%几率使目标陷入麻痹。如果当前场地已为电气场地，使用失败。";
    if (value.startsWith("For 5 turns, the terrain becomes Electric Terrain. During the effect, the power of Electric-type attacks made by grounded Pokemon is multiplied by 1.5")) node.nodeValue = "5回合内，场地变为电气场地。在效果持续期间，地面上的宝可梦的电属性招式威力增加1.5倍；地面上的宝可梦无法进入睡眠状态，已经进入睡眠状态的宝可梦不会醒来。地面上的宝可梦不会受到哈欠的影响，并且不会因哈欠而进入睡眠状态。保护色会将使用者的属性变为电属性，自然之力会变为十万伏特，秘密之力有30%几率使目标陷入麻痹。如果当前场地已为电气场地，使用失败。";
    if (value.startsWith("Until the user's next move, if an opposing Pokemon's attack knocks the user out, that Pokemon faints as well, unless the attack was Doom Desire or Future Sight. Fails if")) node.nodeValue = "在使用者使出下一个招式之前，如果使用者因招式直接造成的伤害而陷入濒死状态(预知未来和破灭之愿除外)，攻击方也会进入濒死状态。如果上一回合成功使用了同命，这一回合再次使用同命一定会失败。";
    if (value.startsWith("The user has 1/16 of its maximum HP, rounded down, restored at the end of each turn while it remains active. If Big Root is held by the user, the HP recovered is 1.3x normal, rounded half down. If the user uses Baton Pass, the replacement will receive the healing effect.")) node.nodeValue = "在每回合结束回复最大HP的1/16，向下取整。携带大根茎时，恢复量提升30%，向下取整一半。如果使用者使用接棒，新上场的宝可梦将获得此效果。";
    if (value.startsWith("If the current terrain is Misty Terrain and the user is grounded, this move's power is multiplied by 1.5. The user faints after using this move, even if")) node.nodeValue = "在薄雾场地上，若使用者为地面上的宝可梦，威力提升50%。使用后自身陷入濒死状态，即使招式没有命中。有湿气特性的宝可梦在场时，使用失败。";
    if (value.startsWith("This move's type depends on the user's primary type. If the user's primary type is typeless, this move's type is the user's secondary type if it has one, otherwise the added type from Forest's Curse or")) node.nodeValue = "伤害属性变为使用者本身的第一属性。如果使用者的第一属性为无属性，伤害属性变为使用者本身的第二属性，否则变为万圣夜或森林诅咒的属性。如果使用者只有无属性，伤害属性变为无属性。";
    if (value.startsWith("The user transforms into the target. The target's current stats, stat stages, types, moves, Ability, weight, IVs, species, and sprite are copied. The user's level and HP remain the same and each copied move receives only 5 PP. This move fails if the target has transformed.")) node.nodeValue = "使用者变身成目标宝可梦。目标的当前能力、能力等级、属性、招式、特性、重量和种族都会被复制。使用者的HP不变，复制的招式均只有5点PP。如果目标已经变身，使用失败。";
    if (value.startsWith("The power of this move depends on (user's weight / target's weight), rounded down. Power is equal to 120 if the result is 5 or more, 100 if 4, 80 if 3, 60 if 2, and 40 if 1 or less. Damage doubles and no accuracy")) node.nodeValue = "使用者的体重比起目标越高，招式威力越高，向下取整。威力=（自身的体重/目标的体重）。如果结果为5或更大，威力为120；如果为4，威力为100；如果为3，威力为80；如果为2，威力为60；如果为1或更小，威力为40。如果目标处于变小状态，威力翻倍。同时在这种状况下，此招式一定会命中，除非目标正在使用蓄力的招式并不在场地上。";
    if (value.startsWith("The user and its party members are protected from damaging attacks made by other Pokemon, including allies, during this turn. Fails unless it is the user's first turn on the field, if")) node.nodeValue = "在当回合内，使我方全体进入掀榻榻米状态，保护我方全体不受到来自其他宝可梦的大部分招式的影响。出场后立刻使出才能成功，否则招式会失败。如果在本回合使用者最后行动或我方已进入掀榻榻米状态，招式会失败。";
    if (value.startsWith("Raises the target's chance for a critical hit by 1 stage, or by 2 stages if the target is Dragon type. Fails if")) node.nodeValue = "令除使用者外己方全场的击中要害率提升1级。同伴具有龙属性时击中要害率提升2级。如果没有同伴，使用失败。接棒可以传递此效果。";
    if (value.startsWith("Power is equal to 100 times the user's Stockpile count. Fails if")) node.nodeValue = "攻击目标造成伤害。威力相当于蓄力的次数乘100。储存的力量会被喷出，且储存的防御和特防会被复原。如果自身没有储存力量，则招式使用失败。";
    if (value.startsWith("While the user remains active, this move is replaced by a random move known by the target, even if the user already knows that move. The copied move keeps the remaining PP for this move, regardless of the copied move's maximum PP. Whenever one PP is used for a copied move, one PP is used for this move.")) node.nodeValue = "将此招式替换为目标的随机一个招式，PP与所模仿的招式的PP相同。即使自身已经学会目标的招式，模仿也会成功使出。";
    if (value.startsWith("If this move is successful and the user has not fainted, the user switches out even if it is trapped and is replaced immediately by a selected party member. The user does not switch out if there are no unfainted party members, or if the target switched out using an Eject Button.")) node.nodeValue = "如果成功使出该招式并且使用者没有濒死，即使自身陷入无法逃走状态也可以替换宝可梦。如果使用者是同行宝可梦中唯一没有陷入濒死状态的宝可梦，或目标使用逃脱按键，使用者不会退场。";
    if (value.startsWith("The user restores 1/2 of its maximum HP if Delta Stream or no weather conditions are in effect, 2/3 of its maximum HP if the weather is Desolate Land or Sunny Day, and 1/4 of its maximum HP if the weather is Hail, Primordial Sea, Rain Dance, or Sandstorm, all rounded half down.")) node.nodeValue = "如果天气是乱流或没有天气，使用者将恢复其最大生命值的1/2，如果天气为大日照或大晴天，则恢复其最大HP的2/3，如果天气是冰雹、大雨、下雨或沙暴，则恢复最大HP的1/4，全部向下取整。";
    if (value.startsWith("This move cannot be selected unless the user is holding a Berry. The user eats its Berry and raises its Defense by 2 stages. This effect is")) node.nodeValue = "如果没有携带树果，使用失败。使用后吃掉树果并提升2级防御，此招式不受查封、魔法空间、笨拙或紧张感的影响。";
    if (value.startsWith("If this move is successful and the user has not fainted, it steals the target's held Berry if it is holding one and eats it immediately, gaining its effects even if")) node.nodeValue = "如果成功使出该招式并且使用者没有濒死，会吃掉目标的树果并获得该树果的效果。若使用该招式的宝可梦处于查封状态或特性为笨拙，仍然能消耗目标的树果，但不会获得树果的效果。失去的物品无法通过回收利用或收获特性回收。";
    if (value.startsWith("Has a 30% chance to paralyze the target. This move can hit a target using Bounce, Fly, or Sky Drop, or is under the effect of Sky Drop. If the weather is Primordial Sea or Rain Dance, this move does not check accuracy. If the weather is Desolate Land or Sunny Day, this move's accuracy is 50%.")) node.nodeValue = "有30%几率使目标陷入麻痹状态。可以击中处于飞翔、弹跳和自由落体状态的宝可梦。天气为大晴天或大日照时，打雷的命中降低至50%。天气为下雨或大雨时，打雷一定会命中，除非目标正在使用蓄力的招式并不在场地上。";
    if (value.startsWith("Has a 30% chance to paralyze the target. This move can hit a target using Bounce or Fly. If the weather is Rain Dance, this move does not check accuracy. If the weather is Sunny Day, this move's accuracy is 50%.")) node.nodeValue = "有30%几率使目标陷入麻痹状态。可以击中处于飞翔、弹跳和自由落体状态的宝可梦。天气为大晴天时，打雷的命中降低至50%。天气为下雨时，打雷一定会命中，除非目标正在使用蓄力的招式并不在场地上。";
    if (value.startsWith("Raises the user's Attack, Defense, Special Attack, Special Defense, and Speed by 1 stage in exchange for the user losing 33% of its maximum HP, rounded down. Fails if the user would faint or if its Attack, Defense, Special Attack, Special Defense, and Speed stat stages would not change.")) node.nodeValue = "令使用者的攻击、防御、特攻、特防和速度提升1级，并失去33%的最大HP，向下取整。如果使用者HP不足，或者五项能力变化皆已是最大，使用失败。";
    if (value.startsWith("The user faints and the Pokemon brought out to replace it has its HP and PP fully restored along with having any non-volatile status condition cured. The new Pokemon is sent out at the end of the turn, and the healing happens before hazards take effect. Fails if the user is the last unfainted Pokemon in its party.")) node.nodeValue = "自身陷入濒死状态，然后新上场处于使用者所在位置的宝可梦恢复全部HP和PP并治愈异常状态。宝可梦将在回合结束时新上场，在场地状态生效之前进行治愈。如果使用者是同行宝可梦中最后一只宝可梦，使用失败。";
    if (value.startsWith("The user faints and the Pokemon brought out to replace it has its HP fully restored along with having any non-volatile status condition cured. The new Pokemon is sent out at the end of the turn, and the healing happens before hazards take effect. Fails if the user is the last unfainted Pokemon in its party.")) node.nodeValue = "自身陷入濒死状态，然后新上场处于使用者所在位置的宝可梦恢复全部HP并治愈异常状态。宝可梦将在回合结束时新上场，在场地状态生效之前进行治愈。如果使用者是同行宝可梦中最后一只宝可梦，使用失败。";
    if (value.startsWith("Hits two to five times. Has a 35% chance to hit two or three times and a 15% chance to hit four or five times. If one of the hits breaks the target's substitute, it will take damage for the remaining hits. If the user has the Skill Link Ability, this move will always hit five times.")) node.nodeValue = "一回合内连续攻击2～5次。命中时，各有35%几率攻击2或3次，15%几率攻击4或5次。如果其中一下打破了替身，招式会继续攻击并造成伤害。如果使用者拥有连续攻击特性，始终命中5次。";
    if (value.startsWith("This attack charges on the first turn and executes on the second. On the first turn, the user avoids all attacks other than Surf and Whirlpool but takes double damage from them, and is also unaffected by weather. If the user is holding a Power Herb, the move completes in one turn.")) node.nodeValue = "在第一回合潜入水中，第二回合发动招式。潜入水中时，避免除冲浪和潮旋外的所有攻击，但会受到来自对手的冲浪或潮旋的双倍伤害。如果携带了强力香草，可以立刻结束蓄力，在第一回合发动招式。";
    if (value.startsWith("This attack charges on the first turn and executes on the second. On the first turn, the user avoids all attacks other than Earthquake and Magnitude but takes double damage from them, and is also unaffected by weather. If the user is holding a Power Herb, the move completes in one turn.")) node.nodeValue = "在第一回合钻进洞中，第二回合发动招式。钻进洞中时，避免除音爆、地裂、地震和震级外的所有攻击，但会受到来自对手的地震或震级的双倍伤害。如果携带了强力香草，可以立刻结束蓄力，在第一回合发动招式。";
    if (value.startsWith("Prevents the user and the target from switching out. The user and the target can still switch out if either of them is holding Shed Shell or uses Baton Pass, Flip Turn, Parting Shot, Teleport, U-turn, or Volt Switch. The effect ends if either the user or the target leaves the field.")) node.nodeValue = "使攻击方和目标都陷入无法逃走状态。如果使用者或目标持有美丽空壳，使用了接棒、快速折返、抛下狠话、急速折返或伏特替换，可以正常替换。";
    if (value.startsWith("For 5 turns, the Speed of every Pokemon is recalculated for the purposes of determining turn order. During the effect, each Pokemon's Speed is considered to be (10000 - its normal Speed), and if")) node.nodeValue = "5回合内，每个宝可梦的速度都会重新计算，以确定行动顺序。在戏法空间期间，每个宝可梦的速度都被认为是（10000-其正常速度），如果这个值大于8191，则从中减去8192。如果在戏法空间期间使用戏法空间，效果结束。";
    if (value.startsWith("Has a 30% chance to confuse the target. This move can hit a target using Bounce, Fly, or Sky Drop, or is under the effect of Sky Drop. If the weather is Primordial Sea or Rain Dance, this move does not check accuracy. If the weather is Desolate Land or Sunny Day, this move's accuracy is 50%.")) node.nodeValue = "有30%几率使目标陷入混乱状态。可以击中处于飞翔、弹跳和自由落体状态的宝可梦。天气为大晴天或大日照时，暴风的命中降低至50%。天气为下雨或大雨时，暴风一定会命中，除非目标正在使用蓄力的招式并不在场地上。";
    if (value.startsWith("Lowers the target's Attack by 1 stage. The user restores its HP equal to the target's Attack stat calculated with its stat stage before this move was used. If")) node.nodeValue = "令目标的攻击降低1级。恢复使用者与目标攻击数值相同的HP，该数值受到目标当前的攻击能力变化影响。携带大根茎时，恢复量提升30%，向下取整一半。如果目标的攻击能力等级为-6，使用失败。";
    if (value.startsWith("Power is equal to the base move's Max Move power. If this move is successful, the Special Defense of each Pokemon on the opposing side is lowered by 1 stage, even if they have a substitute. This effect does not happen if the user is not Dynamaxed. If this move is used as a base move, it deals damage with a power of 0.")) node.nodeValue = "威力由原本招式的威力决定。令全部对手宝可梦的特防降低1级。该效果无视对手的替身，如果使用者没有极巨化，不会有该效果。如果将此招式用作基础招式使用，威力为0。";
    if (value.startsWith("Power is equal to the base move's Max Move power. If this move is successful, the Special Attack of each Pokemon on the opposing side is lowered by 1 stage, even if they have a substitute. This effect does not happen if the user is not Dynamaxed. If this move is used as a base move, it deals damage with a power of 0.")) node.nodeValue = "威力由原本招式的威力决定。令全部对手宝可梦的特攻降低1级。该效果无视对手的替身，如果使用者没有极巨化，不会有该效果。如果将此招式用作基础招式使用，威力为0。";
    if (value.startsWith("Power is equal to the base move's Max Move power. If this move is successful, the Attack of each Pokemon on the opposing side is lowered by 1 stage, even if they have a substitute. This effect does not happen if the user is not Dynamaxed. If this move is used as a base move, it deals damage with a power of 0.")) node.nodeValue = "威力由原本招式的威力决定。令全部对手宝可梦的攻击降低1级。该效果无视对手的替身，如果使用者没有极巨化，不会有该效果。如果将此招式用作基础招式使用，威力为0。";
    if (value.startsWith("Power is equal to the base move's Max Move power. If this move is successful, the Speed of each Pokemon on the user's side is raised by 1 stage, even if they have a substitute. This effect does not happen if the user is not Dynamaxed. If this move is used as a base move, it deals damage with a power of 0.")) node.nodeValue = "威力由原本招式的威力决定。令使用者和同伴的速度提升1级。如果使用者没有极巨化，不会有该效果。如果将此招式用作基础招式使用，威力为0。";
    if (value.startsWith("Power is equal to the base move's Max Move power. If this move is successful, the Defense of each Pokemon on the opposing side is lowered by 1 stage, even if they have a substitute. This effect does not happen if the user is not Dynamaxed. If this move is used as a base move, it deals damage with a power of 0.")) node.nodeValue = "威力由原本招式的威力决定。令全部对手宝可梦的防御降低1级。该效果无视对手的替身，如果使用者没有极巨化，不会有该效果。如果将此招式用作基础招式使用，威力为0。";
    if (value.startsWith("Power is equal to the base move's Max Move power. If this move is successful, the Special Defense of each Pokemon on the user's side is raised by 1 stage, even if they have a substitute. This effect does not happen if the user is not Dynamaxed. If this move is used as a base move, it deals damage with a power of 0.")) node.nodeValue = "威力由原本招式的威力决定。令使用者和同伴的特防提升1级。如果使用者没有极巨化，不会有该效果。如果将此招式用作基础招式使用，威力为0。";
    if (value.startsWith("Power is equal to the base move's Max Move power. If this move is successful, the Special Attack of each Pokemon on the user's side is raised by 1 stage, even if they have a substitute. This effect does not happen if the user is not Dynamaxed. If this move is used as a base move, it deals damage with a power of 0.")) node.nodeValue = "威力由原本招式的威力决定。令使用者和同伴的特攻提升1级。如果使用者没有极巨化，不会有该效果。如果将此招式用作基础招式使用，威力为0。";
    if (value.startsWith("Power is equal to the base move's Max Move power. If this move is successful, the Speed of each Pokemon on the opposing side is lowered by 1 stage, even if they have a substitute. This effect does not happen if the user is not Dynamaxed. If this move is used as a base move, it deals damage with a power of 0.")) node.nodeValue = "威力由原本招式的威力决定。令全部对手宝可梦的速度降低1级。该效果无视对手的替身，如果使用者没有极巨化，不会有该效果。如果将此招式用作基础招式使用，威力为0。";
    if (value.startsWith("Power is equal to the base move's Max Move power. If this move is successful, the Defense of each Pokemon on the user's side is raised by 1 stage, even if they have a substitute. This effect does not happen if the user is not Dynamaxed. If this move is used as a base move, it deals damage with a power of 0.")) node.nodeValue = "威力由原本招式的威力决定。令使用者和同伴的防御提升1级。如果使用者没有极巨化，不会有该效果。如果将此招式用作基础招式使用，威力为0。";
    if (value.startsWith("If this attack does not miss, the effects of Reflect, Light Screen, and Aurora Veil end for the target's side of the field before damage is calculated. If the user's current form is a Paldean Tauros, this")) node.nodeValue = "如果成功使出该招式，在造成伤害前破坏对方场地的光墙、反射壁和极光幕。招式的属性会随肯泰罗的形态改变：肯泰罗-斗战种使出时为格斗属性；肯泰罗-火炽种使出时为火属性；肯泰罗-水澜种使出为水属性。";
    if (value.startsWith("Raises the user's evasiveness by 2 stages. Whether or not the user's evasiveness was changed")) node.nodeValue = "令使用者的闪避率提升2级。变小状态的宝可梦受到踩踏、疯狂滚压、泰山压顶、龙之俯冲、重磅冲撞、飞身重压、高温重压攻击时伤害翻倍，且必定命中。";
    if (value.startsWith("As long as the target remains active, its evasiveness stat stage is ignored during accuracy checks against it if it is greater than 0, and Psychic-type attacks can hit the target if it is a Dark type. Fails if")) node.nodeValue = "令目标的闪避率提升无效，如果它是恶属性，可以受到超能力属性招式的攻击。如果目标已受到奇迹之眼、识破或气味侦测的影响，使用失败。";
    if (value.startsWith("As long as the target remains active, its evasiveness stat stage is ignored during accuracy checks against it if it is greater than 0, and Normal- and Fighting-type attacks can hit the target if it is a Ghost type. Fails if")) node.nodeValue = "令目标的闪避率提升无效，如果它是幽灵属性，可以受到一般属性和格斗属性招式的攻击。如果目标已受到奇迹之眼、识破或气味侦测的影响，使用失败。";
    if (value.startsWith("For 3 turns, the target is forced to repeat its last move used. If")) node.nodeValue = "3回合内，只能使用其最后使用的招式。如果目标受到影响的招式超出PP，效果结束。如果目标已陷入此状态，或者最后使出的是再来一次、模仿、写生、挣扎、变身、借助、仿效、抢先一步、挥指、鹦鹉学舌、自然之力或梦话，使用失败。";
    if (value.startsWith("For 4 to 8 turns, the target is forced to repeat its last move used. If")) node.nodeValue = "令目标接下来的4～8回合，只能使用其最后使用的招式。如果目标受到影响的招式超出PP，效果结束。如果目标已陷入此状态，或者最后使出的是再来一次、模仿、写生、挣扎、仿效、鹦鹉学舌、梦话，使用失败。";
    if (value.startsWith("The user swaps positions with its ally. Fails if the user is the only Pokemon on its side. This move has a 1/X chance of being successful, where X starts at 1 and")) node.nodeValue = "在双打对战中与己方目标交换位置；目标位置没有宝可梦时使用该招式会失败。此招式有1/X的成功几率，其中X从1开始，每次成功使用此招式时会增加三倍。如果此招式使用失败或使用者最后使用的招式不是交换场地，则X重置为1。";
    if (value.startsWith("Has a 30% chance to cause a secondary effect on the target based on the battle terrain. Causes paralysis on the regular Wi-Fi terrain, causes paralysis")) node.nodeValue = "有30%几率根据场地的不同造成相应的追加效果。电气场地追加效果为麻痹，青草场地为睡眠，薄雾场地为降低目标1级特攻，精神场地为降低目标1级速度。";
    if (value.startsWith("The user takes 1/2 of its maximum HP, rounded up, and creates a substitute that has 1/4 of the user's maximum HP, rounded down. The user is replaced with another Pokemon in its party and the selected Pokemon has the substitute transferred to it. Fails if")) node.nodeValue = "使用者损失最大HP的1/2（向上取整），制造出替身，替身的HP为使用者最大HP的1/4。然后自身与后备宝可梦替换，替换后替身会传递给交换上场的宝可梦。以下情况时，招式使用失败：自身已经处于替身状态；自身的HP不超过最大HP的1/2；没有可以替换的后备宝可梦。";
    if (value.startsWith("Switches the Mist, Light Screen, Reflect, Spikes")) node.nodeValue = "将隐形岩、撒菱、毒菱、黏黏网、反射壁、光墙、极光幕、顺风、超极巨深渊灭焰、超极巨水炮轰灭、超极巨灰飞鞭灭、超极巨炎石喷发火海、彩虹、湿地、白雾、神秘守护从使用者一侧换至另一侧，反之亦然。";
    if (value.startsWith("For 3 to 6 turns, the target is forced to repeat its last move used. If")) node.nodeValue = "令目标接下来的3～6回合，只能使用其最后使用的招式。如果目标受到影响的招式超出PP，效果结束。如果目标已陷入此状态，或者最后使出的是再来一次、模仿、挥指、写生、挣扎、仿效、鹦鹉学舌、梦话，使用失败。";
    if (value.startsWith("The user restores 1/2 of its maximum HP if Delta Stream or no weather conditions are in effect or if the user is holding Utility Umbrella, 2/3 of its maximum HP if the weather is Desolate Land or Sunny Day, and 1/4 of its maximum HP if the weather is Hail, Primordial Sea, Rain Dance, or Sandstorm, all rounded half down.")) node.nodeValue = "如果天气是乱流或没有天气，使用者将恢复其最大生命值的1/2，如果天气为大日照或大晴天，则恢复其最大HP的2/3，如果天气是冰雹、大雨、下雨或沙暴，则恢复最大HP的1/4，全部向下取整。";
    if (value.startsWith("Sets up a hazard on the opposing side of the field, causing each opposing Pokemon that switches in to lose 1/8 of their maximum HP, rounded down, unless it is a Flying-type Pokemon. Fails if the effect is already active on the opposing side. Can be removed from the opposing side if any opposing Pokemon uses Rapid Spin successfully.")) node.nodeValue = "向对手的场地撒菱，使对手交换上场的宝可梦受到其1/8最大HP的伤害，除非它拥有飞行属性或拥有漂浮特性。如果对手的宝可梦成功使出高速旋转，撒菱解除。";
    if (value.startsWith("Power is equal to the base move's Max Move power. If this move is successful, each Pokemon on the opposing side becomes infatuated, even if they have a substitute. This effect does not happen for a target if both it and the user are the same gender, if either is genderless, or if the target is already infatuated.")) node.nodeValue = "威力由原本招式的威力决定。让对方所有与使用者性别不同的宝可梦陷入着迷状态，即使目标处于替身状态下。";
    if (value.startsWith("Has a 100% chance to raise the user's Speed by 1 stage. If the user is a Morpeko in Full Belly Mode, this move is Electric type. If")) node.nodeValue = "100%几率提高1级速度。在满腹花纹时会变成电属性，在空腹花纹时则会变成恶属性。仅在使用者为莫鲁贝可时奏效，否则使用失败。";
    if (value.startsWith("Lowers the target's Attack and Special Attack by 1 stage. If this move is successful, the user switches out even if it is trapped and is replaced immediately by a selected party member. The user does not switch out if the target's Attack and Special Attack stat stages were both unchanged, or if there are no unfainted party members.")) node.nodeValue = "令目标的攻击和特攻降低1级。如果成功使出该招式，即使自身陷入无法逃走状态也可以替换宝可梦。如果该招式无法对对手的能力变化产生效果或使用者是同行宝可梦中最后一只宝可梦，使用失败。";
    if (value.startsWith("If the target is an opposing Pokemon and it switches out this turn, this move hits that Pokemon before it leaves the field. Power doubles and no accuracy check is done if the user hits an opponent switching out, and the user's turn is over; if an opponent faints from this, the replacement Pokemon becomes active immediately.")) node.nodeValue = "如果目标是对手的宝可梦且它在本回合内准备替换下场，则该招式会立刻攻击准备离场的宝可梦。如果击中了准备替换下场的宝可梦并且使用者的回合结束，伤害翻倍且必定命中。如果对手因此濒死，替换的宝可梦会在该回合登场。";
    if (value.startsWith("The user restores 1/2 of its maximum HP if Delta Stream or no weather conditions are in effect or if the user is holding Utility Umbrella, 2/3 of its maximum HP if the weather is Desolate Land or Sunny Day, and 1/4 of its maximum HP if the weather is Primordial Sea, Rain Dance, Sandstorm, or Snow, all rounded half down.")) node.nodeValue = "在乱流或没有天气型状态或携带万能伞时，回复使用者的1/2最大HP。如果天气是大晴天或大日照，回复使用者的2/3最大HP。如果天气是下雨、大雨、沙暴、冰雹或下雪，回复使用者的1/3最大HP。全部向下取整。";
    if (value.startsWith("Power is equal to 50+(X*50), where X is the total number of times the user has been hit by a damaging attack during the battle, even if the user did not lose HP from the attack. X cannot be greater than 6 and")) node.nodeValue = "威力等于50+（X乘以50），其中X是使用者在战斗中受到攻击的总次数，即使使用者没有因攻击而失去HP。X最多为6，并且在离场或濒死时不会重置。连续攻击的每次命中都会被计算在内，但不会计算混乱伤害。";
    if (value.startsWith("This attack charges on the first turn and executes on the second. On the first turn, the user avoids all attacks other than Gust, Hurricane, Sky Uppercut, Smack Down, Thousand Arrows, Thunder, and Twister, and Gust and Twister have doubled power when used against it. If the user is holding a Power Herb, the move completes in one turn.")) node.nodeValue = "在第一回合飞上天空，第二回合发动招式。飞上天空时，避免除起风、打雷、冲天拳、龙卷风、暴风、击落、音爆、千箭齐发外的所有攻击，但会受到来自对手的起风或龙卷风的双倍伤害。如果携带了强力香草，可以立刻结束蓄力，在第一回合发动招式。";
    if (value.startsWith("Raises the user's Attack and Special Attack by 1 stage. If the weather is Sunny Day or Desolate Land, this move raises the user's Attack and Special Attack by 2 stages. If the user is holding Utility Umbrella, this move will only raise the user's Attack and Special Attack by 1 stage, even if the weather is Sunny Day or Desolate Land.")) node.nodeValue = "令使用者的攻击和特攻提升1级，如果天气是大日照或大晴天，改为提升2级。如果天气是大日照或大晴天但携带了万能伞，提升1级。";
    if (value.startsWith("Hits three times. Power increases to 20 for the second hit and 30 for the third. This move checks accuracy for each hit, and the attack ends if the target avoids a hit. If one of the hits breaks the target's substitute, it will take damage for the remaining hits. If the user has the Skill Link Ability, this move will always hit three times.")) node.nodeValue = "连续攻击1～3次。第二次攻击威力增加20，第三次攻击威力增加30。每一次攻击是否命中分别计算，打空则停止攻击。如果其中一下打破了替身，招式会继续攻击并造成伤害。如果使用者拥有连续攻击特性，始终命中3次。";
    if (value.startsWith("If this move is successful and the user has not fainted, the user switches out even if it is trapped and is replaced immediately by a selected party member. The user does not switch out if there are no unfainted party members, or if the target switched out using an Eject Button or through the effect of the Emergency Exit or Wimp Out Abilities.")) node.nodeValue = "如果成功使出该招式并且使用者没有濒死，即使自身陷入无法逃走状态也可以替换宝可梦。如果使用者是同行宝可梦中唯一没有陷入濒死状态的宝可梦，或目标使用逃脱按键、触发了跃跃欲逃或危险回避特性，使用者不会退场。";
    if (value.startsWith("Hits three times. Power increases to 40 for the second hit and 60 for the third. This move checks accuracy for each hit, and the attack ends if the target avoids a hit. If one of the hits breaks the target's substitute, it will take damage for the remaining hits. If the user has the Skill Link Ability, this move will always hit three times.")) node.nodeValue = "连续攻击1～3次。第二次攻击威力增加到40，第三次攻击威力增加到60。每一次攻击是否命中分别计算，打空则停止攻击。如果其中一下打破了替身，招式会继续攻击并造成伤害。如果使用者拥有连续攻击特性，始终命中3次。";
    if (value.startsWith("Has a 30% chance to paralyze the target. This attack charges on the first turn and executes on the second. On the first turn, the user avoids all attacks other than Gust, Hurricane, Sky Uppercut, Smack Down, Thousand Arrows, Thunder, and Twister, and Gust and Twister have doubled power when used against it. If the user is holding a Power Herb, the move completes in one turn.")) node.nodeValue = "有30%几率使目标陷入麻痹状态。在第一回合进行蓄力，第二回合发动招式。蓄力时，避免除起风、打雷、冲天拳、龙卷风、暴风、击落、音爆、千箭齐发外的所有攻击，但会受到来自对手的起风或龙卷风的双倍伤害。如果携带了强力香草，可以立刻结束蓄力，在第一回合发动招式。";
    if (value.startsWith("Deals damage to the target equal to the target's maximum HP. Ignores accuracy and evasiveness modifiers. This attack's accuracy is equal to (user's level - target's level + X)%, where X is 30 if the user is an Ice type and 20")) node.nodeValue = "造成与目标的HP相同的固定伤害。命中的概率不会受到命中率和闪避率影响。此攻击的命中率等于（自身等级-目标等级+20）%，如果使用者为冰属性，改为+30。如果自身等级低于目标，招式使用失败。此招式对冰属性或结实特性的宝可梦无效。";
    if (value.startsWith("This attack charges on the first turn and executes on the second. Raises the user's Special Attack by 1 stage on the first turn. If the user is holding a Power Herb or the weather is Primordial Sea or")) node.nodeValue = "在第一回合进行蓄力并提升1级特攻，第二回合攻击目标。如果天气为下雨或大雨，或携带了强力香草，可以立刻结束蓄力，在第一回合发动招式。";
    if (value.startsWith("Whether or not this move is successful and even if it would cause fainting, the user loses 1/2 of its maximum HP, rounded up, unless the user has the Magic Guard Ability. This")) node.nodeValue = "对使用者造成最大HP的1/2（向上取整）伤害。即使招式未命中、HP不足1/2，使用者仍然会受到伤害，除非使用者拥有魔法防守特性。如果自身陷入粉尘状态、天气为大雨或有湿气特性的宝可梦在场，此招式使用失败，不会受到反作用力伤害。";
    if (value.startsWith("For 5 turns, the user and its party members cannot have non-volatile status conditions or confusion inflicted on them by other Pokemon. Pokemon on the user's side cannot become affected by Yawn but can fall asleep from its effect. It is removed from the user's side if the user or an ally is successfully hit by Defog. Fails if the effect is already active on the user's side.")) node.nodeValue = "5回合内保护己方宝可梦不会陷入异常状态、混乱状态、瞌睡状态。只能阻挡瞌睡状态，不能阻止已经进入的瞌睡状态引发的睡眠状态。如果己方已经处于此状态，使用失败。";
    if (value.startsWith("For 5 turns, the target's held item has no effect. An item's effect of causing forme changes is unaffected, but any other effects from")) node.nodeValue = "5回合内，令其携带的物品无效，不能使用自然之恩和投掷。如果目标使用了接棒，新上场的宝可梦获得此效果。";
    if (value.startsWith("Until the end of the turn, all single-target attacks from the opposing side are redirected to the user")) node.nodeValue = "直到这回合结束，所有对方使用的作用范围为单体选择的招式都会攻向自己。此效果优先于魔法反射、魔法镜、避雷针和引水特性的效果。不能在除皇家对战和双打对战之外的模式使用。当使用者处于自由落体状态时，此效果消失。";
    if (value.startsWith("Until the end of the turn, all single-target attacks from opponents of the target are redirected to the target")) node.nodeValue = "直到这回合结束，所有对方使用的作用范围为单体选择的招式都会攻向自己。此效果优先于魔法反射、魔法镜、避雷针和引水特性的效果。不能在除皇家对战和双打对战之外的模式使用。当使用者处于自由落体状态时，此效果消失。";
    if (value.startsWith("The user is protected from attacks made by the opponent during this turn. This move has an X/255 chance of being successful, where X starts at 255 and halves, rounded down, each time this move is successfully used. X resets to 255 if this move fails or if the user's last move used is not Detect, Endure, or Protect. Fails if the user has a substitute or moves last this turn.")) node.nodeValue = "在当回合内，使自身进入守住状态，保护自身不受到来自其他宝可梦的招式的影响。此招式有X/255的成功几率，其中X从255开始，每次成功使出此招式时，向下取整一半。如果使用失败，或上一回合使用的不是看穿、挺住或守住，X重置为1。如果在本回合使用者最后行动，招式会失败。";
    if (value.startsWith("The user is protected from most attacks made by other Pokemon during this turn. This move has a 1/X chance of being successful, where X starts at 1 and doubles each time this move is successfully used, up to a maximum of 8. X resets to 1 if this move fails or if the user's last move used is not Detect, Endure, or Protect. Fails if the user moves last this turn.")) node.nodeValue = "在当回合内，使自身进入守住状态，保护自身不受到来自其他宝可梦的大部分招式的影响。此招式有1/X的成功几率，其中X从1开始，每次成功使出此招式时X增加两倍，最大为8。如果使用失败，或上一回合使用的不是看穿、挺住或守住，X重置为1。如果在本回合使用者最后行动，招式会失败。";
    if (value.startsWith("The user is protected from most attacks made by other Pokemon during this turn. This move has a 1/X chance of being successful, where X starts at 1 and doubles each time this move is successfully used. X resets to 1 if this move fails or if the user's last move used is not Detect, Endure, Protect, Quick Guard, or Wide Guard. Fails if the user moves last this turn.")) node.nodeValue = "在当回合内，使自身进入守住状态，保护自身不受到来自其他宝可梦的大部分招式的影响。此招式有1/X的成功几率，其中X从1开始，每次成功使出此招式时X增加三倍。如果使用失败，或上一回合使用的不是看穿、挺住、守住、广域防守或快速防守，X重置为1。如果在本回合使用者最后行动，招式会失败。";
    if (value.startsWith("The user's type changes based on the battle terrain. Normal type on the regular Wi-Fi terrain, Electric")) node.nodeValue = "根据场所改变自身的属性。没有场地变为一般属性，电气场地变为电属性，青草场地变为草属性，薄雾场地变为妖精属性，精神场地变为超能力属性。如果自身的属性无法被改变或已为该属性，使用失败。";
    if (value.startsWith("Fails unless the user is hit by a physical attack from an opponent this turn before it can execute the move. If the user was hit and has not fainted, it")) node.nodeValue = "除非在使出此招式之前被物理招式命中，否则使用失败。如果使用者在被命中后没有陷入濒死，攻击目标造成伤害。如果目标拥有强行特性且无视了招式的追加效果，使用失败。";
    if (value.startsWith("Deals damage to the opposing Pokemon equal to twice the HP lost by the user from a special attack this turn. This move considers Hidden Power as Normal type, and only the last hit of a multi-hit attack is counted. Fails if the user moves first, if the user was not hit by a special attack this turn, or if the user did not lose HP from the attack.")) node.nodeValue = "对最后使用特殊招式造成自身伤害的宝可梦为目标，造成受到的招式×2倍固定伤害。只计算多次命中攻击中的最后一次攻击，觉醒力量会被视为普通属性。如果使用者先行动、在此次攻击中没有失去HP时或所有对手都没有使用过特殊招式攻击到使用者，招式使用失败。";
    if (value.startsWith("Deals damage to the opposing Pokemon equal to twice the damage dealt by the last move used in the battle. This move ignores")) node.nodeValue = "对最后使用招式造成自身伤害的对应位置宝可梦为目标，造成受到的招式×2倍固定伤害。该招式可以对没有效果的属性的宝可梦造成伤害。如果使用者先行动，或对手最后使出的招式是双倍奉还、0威力招式、不是一般或格斗属性的招式，使用失败。";
    if (value.startsWith("For 0 to 7 turns, one of the target's known moves that has at least 1 PP remaining becomes disabled, at random. Fails if")) node.nodeValue = "0至7个回合内，禁用目标的一个至少还有1个PP的随机已知招式。如果目标的招式已被禁用，或者目标的所有招式都没有PP，使用失败。如果有宝可梦使用黑雾，此效果结束。无论这个招式是否成功使出，都会触发对手的愤怒的效果。";
    if (value.startsWith("The user restores its HP based on its Stockpile count. Restores 1/4 of its maximum HP if it's 1, 1/2 of its maximum HP if it's 2, both rounded half down, and all of its HP if")) node.nodeValue = "使用者蓄力1次时，回复使用者1/4的HP；使用者蓄力2次时，回复使用者1/2的HP，都是向下取整。使用者蓄力3次时，回复使用者全部的HP。储存的力量会被吞下，且储存的防御和特防会被复原。如果自身没有储存力量，则招式使用失败。";
    if (value.startsWith("Hits two to five times. Lowers the user's Defense by 1 stage and raises the user's Speed by 1 stage after the last hit. Has a 35% chance to hit two or three times and a 15% chance to hit four or five times. If one of the hits breaks the target's substitute, it will take damage for the remaining hits. If the user has the Skill Link Ability, this move will always hit five times.")) node.nodeValue = "一回合内连续攻击2～5次。降低使用者的1级防御并提升1级速度。命中时，各有35%几率攻击2或3次，15%几率攻击4或5次。如果其中一下打破了替身，招式会继续攻击并造成伤害。如果使用者拥有连续攻击特性，始终命中5次。";
    if (value.startsWith("Has a 30% chance to paralyze the target. This move can hit a target using Bounce, Fly, or Sky Drop, or is under the effect of Sky Drop. If the weather is Primordial Sea or Rain Dance, this move does not check accuracy. If the weather is Desolate Land or Sunny Day, this move's accuracy is 50%. If this move is used against a Pokemon holding Utility Umbrella, this move's accuracy remains at 70%.")) node.nodeValue = "有30%几率使目标陷入麻痹状态。可以击中处于飞翔、弹跳和自由落体状态的宝可梦。天气为大晴天或大日照时，打雷的命中降低至50%。天气为下雨或大雨时，打雷一定会命中，除非目标正在使用蓄力的招式并不在场地上。对于携带万能伞的宝可梦，命中率为70%。";
    if (value.startsWith("Has a 30% chance to confuse the target. This move can hit a target using Bounce, Fly, or Sky Drop, or is under the effect of Sky Drop. If the weather is Primordial Sea or Rain Dance, this move does not check accuracy. If the weather is Desolate Land or Sunny Day, this move's accuracy is 50%. If this move is used against a Pokemon holding Utility Umbrella, this move's accuracy remains at 70%.")) node.nodeValue = "有30%几率使目标陷入混乱状态。可以击中处于飞翔、弹跳和自由落体状态的宝可梦。天气为大晴天或大日照时，暴风的命中降低至50%。天气为下雨或大雨时，暴风一定会命中，除非目标正在使用蓄力的招式并不在场地上。对于携带万能伞的宝可梦，命中率为70%。";
    if (value.startsWith("For 2 turns, the target is prevented from restoring any HP as long as it remains active. During the effect, healing and draining moves are unusable, and")) node.nodeValue = "2回合内，只要目标在场，它就无法恢复任何生命值。在效果期间，回复HP的招式和吸取HP的招式会使用失败。如果目标使用接棒，新上场的宝可梦将获得此效果。分担痛楚和再生力特性不受影响。";
    if (value.startsWith("Hits ten times. This move checks accuracy for each hit, and the attack ends if the target avoids a hit. If")) node.nodeValue = "一回合内连续攻击1～10次。每一次攻击是否命中分别计算，打空则停止攻击。如果其中一下打破了替身，招式会继续攻击并造成伤害。使用者携带机变骰子时，攻击4～10次。如果使用者拥有连续攻击特性，始终命中10次。";
    if (value.startsWith("Sets up a hazard on the opposing side of the field, lowering the Speed by 1 stage of each opposing Pokemon that switches in, unless it is a Flying-type Pokemon or has the Levitate Ability. Fails if")) node.nodeValue = "向对手场地撒下黏黏网，使对手交换上场的宝可梦速度降低1级，除非它拥有飞行属性或拥有漂浮特性。如果对手场地已存在黏黏网，使用失败。如果对手的宝可梦成功使出晶光转转，高速旋转或清除浓雾，黏黏网解除。";
    if (value.startsWith("The target loses its held item. This move cannot cause Pokemon with the Sticky Hold Ability to lose their held item or cause")) node.nodeValue = "目标失去其携带的物品。此招式无法腐蚀：盖欧卡的靛蓝色宝珠、固拉多的朱红色宝珠、骑拉帝纳的白金宝珠、阿尔宙斯的石板、盖诺赛克特的卡带、银伴战兽的存储碟、苍响的腐朽之剑和藏玛然特的腐朽之盾。被腐蚀的物品无法被捡拾或收获特性回收。";
    if (value.startsWith("Raises the user's Attack, Defense, Special Attack, Special Defense, and Speed by 1 stage, but it becomes prevented from switching out. The user can")) node.nodeValue = "令使用者的攻击、防御、特攻、特防和速度提升1级。使用者进入无法逃走状态。使用接棒，快速折返，抛下狠话，急速折返或伏特替换可以正常替换。如果使用者使用了接棒，新上场的宝可梦进入无法逃走状态。";
    if (value.startsWith("Hits twice. If the first hit breaks the target's substitute, it will take damage for the second hit. In Double Battles, this move attempts to hit the targeted Pokemon and its ally once each. If hitting one of these Pokemon would be prevented by immunity, protection, semi-invulnerability, an Ability, or accuracy, it attempts to hit the other Pokemon twice instead. If this move is redirected, it hits that target twice.")) node.nodeValue = "连续攻击2次。如果第一下打破了替身，招式会继续攻击并造成伤害。在双打对战中，会对两只对手宝可梦分别进行一次攻击，如果其中一只因守住、属性、特性、命中率、正在使用蓄力的招式不在场上不会受到龙箭伤害，对另外一只宝可梦进行两次攻击。如果其中一只对手宝可梦处于万众瞩目状态，对该宝可梦进行两次攻击。";
    if (value.startsWith("Hits two to five times. Has a 35% chance to hit two or three times and a 15% chance to hit four or five times. If one of the hits breaks the target's substitute, it will take damage for the remaining hits. If the user has the Skill Link Ability, this move will always hit five times. If the user is an Ash-Greninja")) node.nodeValue = "攻击目标造成伤害，一回合内连续攻击2～5次。命中时，各有35%几率攻击2或3次，15%几率攻击4或5次。如果某一下打破了替身，招式会继续攻击。如果使用者拥有连续攻击特性，始终命中5次。使用者是小智版甲贺忍蛙时，招式威力提升至20，且必定连续攻击3次。";
    if (value.startsWith("Prevents the target from switching out. At the end of each turn during effect, the target's Defense and Special Defense are lowered by 1 stage. The target")) node.nodeValue = "令目标无法替换，每个回合结束时令其防御和特防降低1级。如果目标持有美丽空壳或使用了接棒、快速折返、抛下狠话、急速折返或伏特替换，可以正常替换，离场后效果结束。如果目标使用了接棒，新上场的宝可梦会继承此效果。";
    if (value.startsWith("Has a 10% chance to cause the target to fall asleep. If this move is successful on at least one target and the user is a Meloetta")) node.nodeValue = "有10%几率使目标陷入睡眠状态。美洛耶塔使用该招式对至少一个目标产生效果后，进行形态变化：如果当前处于歌声形态，就会变成舞步形态；如果当前处于舞步形态，就会变成歌声形态。特性变为强行时，不会进行形态变化。";
    if (value.startsWith("The target is forced to switch out and be replaced with a random unfainted ally. Fails if the target is the last unfainted Pokemon in its party, if the target used Ingrain previously or has the Suction Cups Ability, or if the user's level is lower than the target's and X * (user's level + target's level) / 256 + 1 is")) node.nodeValue = "令对方队伍中随机一只没有陷入濒死状态的宝可梦强制替换上场。如果目标是其队伍中唯一没有陷入濒死状态的宝可梦，或处于扎根状态、拥有吸盘特性或使用者的等级低于目标，并且X(X为0～255的随机数)*（使用者等级+目标等级/256）+1≤（目标等级/4），向下取整，使用失败。";
    if (value.startsWith("If the user is Terastallized, this move becomes a physical attack if the user's Attack is greater than its Special Attack, including stat stage changes, and this")) node.nodeValue = "当使用者太晶化时若攻击大于特攻且属性和太晶爆发的属性一致，则该招式变为物理招式（计算使用者的能力变化）。使用者太晶化为星晶属性时，太晶爆发的威力由80提升至100，属性变为星晶，造成无属性伤害，对非太晶化的任何属性的目标造成1倍伤害，对太晶化的对手造成2倍的效果绝佳伤害，使用后令使用者的攻击和特攻降低1级。";
    if (value.startsWith("Power doubles if a weather condition other than Delta Stream is active, and this move's type changes to match. Ice type during Snow, Water")) node.nodeValue = "如果有除了乱流外的天气，则该招式的属性为天气对应属性，且威力翻倍。下雪时为冰属性，大雨或下雨时为水属性，大日照或大晴天时为火属性，沙暴时为岩石属性。如果使用者在以上天气时携带了万能伞，气象球的威力不翻倍且属性不会改变。";
    if (value.startsWith("Power doubles if a weather condition other than Delta Stream is active, and this move's type changes to match. Ice type during Hail, Water")) node.nodeValue = "如果有除了乱流外的天气，则该招式的属性为天气对应属性，且威力翻倍。冰雹时为冰属性，大雨或下雨时为水属性，大日照或大晴天时为火属性，沙暴时为岩石属性。如果使用者在以上天气时携带了万能伞，气象球的威力不翻倍且属性不会改变。";
    if (value.startsWith("For 5 turns, the user and its party members take 0.5x damage from physical attacks, or 0.66x damage if in a Double Battle. Damage is not reduced further with Aurora Veil. Critical hits ignore this effect. It is removed from the user's side if the user or an ally is successfully hit by Brick Break, Psychic Fangs, or Defog. Lasts for 8 turns if the user is holding Light Clay. Fails if the effect is already active on the user's side.")) node.nodeValue = "5回合内我方宝可梦受到的物理招式伤害减半，如果己方场上存在多只宝可梦则降低原本的1/3。可以与极光幕同时共存，但减少伤害的效果无法叠加。击中要害时无视此效果。如果使用者或友军被劈瓦、精神之牙和清除浓雾击中，反射壁消失。劈瓦和精神之牙会在造成伤害前移除反射壁。如果使用者携带了光之黏土，持续8回合。如果我方已处于此效果，使用失败。";
    if (value.startsWith("For 5 turns, the user and its party members take 0.5x damage from special attacks, or 0.66x damage if in a Double Battle. Damage is not reduced further with Aurora Veil. Critical hits ignore this effect. It is removed from the user's side if the user or an ally is successfully hit by Brick Break, Psychic Fangs, or Defog. Lasts for 8 turns if the user is holding Light Clay. Fails if the effect is already active on the user's side.")) node.nodeValue = "5回合内我方宝可梦受到的特殊招式伤害减半，如果己方场上存在多只宝可梦则降低原本的1/3。可以与极光幕同时共存，但减少伤害的效果无法叠加。击中要害时无视此效果。如果使用者或友军被劈瓦、精神之牙和清除浓雾击中，光墙消失。劈瓦和精神之牙会在造成伤害前移除光墙。如果使用者携带了光之黏土，持续8回合。如果我方已处于此效果，使用失败。";
    if (value.startsWith("Each active Pokemon receives a perish count of 4 if it doesn't already have a perish count. At the end of each turn including the turn used, the perish count of all active Pokemon lowers by 1 and Pokemon faint if the number reaches 0")) node.nodeValue = "如果在场的宝可梦没有陷入灭亡之歌状态，那么将获得4的灭亡计时。在包括使用回合在内的每个回合结束时，所有在场的口袋妖怪的灭亡计时都会降低1，如果数字达到0，灭亡之歌状态的宝可梦陷入濒死。换下宝可梦可以解除灭亡之歌状态。如果处于此状态的宝可梦使用接棒，新上场的宝可梦会获得此状态。";
    if (value.startsWith("If this move is successful, it sets up a hazard on the opposing side of the field, damaging each opposing Pokemon that switches in. Foes lose 1/32")) node.nodeValue = "如果成功使出此招式，向对手场地撒下隐形岩。隐形岩会使交换上场的对手会失去其最大生命值的1/32(四倍抵抗)、1/16(两倍抵抗)、1/8、1/4(两倍克制)或1/2(四倍克制)，伤害值受到岩石属性相性的影响，向下取整。如果对手的宝可梦成功使出晶光转转，高速旋转或清除浓雾，隐形岩解除。";
    if (value.startsWith("The user spends three turns locked into this move. This move targets an opponent at random on each turn. On the first of the three turns, all sleeping active Pokemon wake up")) node.nodeValue = "攻击随机一位对手造成伤害。使用者进入3回合吵闹状态，期间会继续使用吵闹进行攻击，无法使用其他招式、使用道具、替换宝可梦。在3个回合中的第1个回合时，所有在场的正在睡眠的宝可梦都会醒来。在这3回合中所有场上的宝可梦无法入睡。因守住状态、未命中、属性相性无效等原因而没有产生效果，解除吵闹状态。";
    if (value.startsWith("For its next 3 turns, the target is forced to repeat its last move used. If the affected move runs out of PP, the effect ends. Fails if the target is already under this effect, if it has not made a move, if the move has 0 PP, or if the move is Assist, Copycat, Encore, Me First, Metronome, Mimic, Mirror Move, Nature Power, Sketch, Sleep Talk, Struggle, Transform, or any Z-Move")) node.nodeValue = "令目标接下来的3回合，只能使用其最后使用的招式。如果目标受到影响的招式超出PP，效果结束。如果目标已陷入此状态，或者最后使出的是再来一次、模仿、写生、挣扎、变身、借助、仿效、抢先一步、挥指、鹦鹉学舌、自然之力、梦话、极巨炮、极巨招式、Z招式，使用失败。";
    if (value.startsWith("This attack charges on the first turn and executes on the second. Power is halved if the weather is Hail, Primordial Sea, Rain Dance, or Sandstorm and the user is not holding Utility Umbrella. If the user is holding a Power Herb or the weather is Desolate Land or Sunny Day, the move completes in one turn. If the user is holding Utility Umbrella and the weather is Desolate Land or Sunny Day, the move still requires a turn to charge.")) node.nodeValue = "在第一回合进行蓄力，第二回合攻击目标。如果当天气为大晴天或大日照状态或携带了强力香草，可以立刻结束蓄力，在第一回合发动招式。在天气为下雨、大雨、沙暴或冰雹状态时且自身没有携带万能伞，威力减半。如果当天气为大晴天或大日照状态时自身携带了万能伞，仍然需要蓄力一回合。";
    if (value.startsWith("This attack charges on the first turn and executes on the second. Power is halved if the weather is Primordial Sea, Rain Dance, Sandstorm, or Snow and the user is not holding Utility Umbrella. If the user is holding a Power Herb or the weather is Desolate Land or Sunny Day, the move completes in one turn. If the user is holding Utility Umbrella and the weather is Desolate Land or Sunny Day, the move still requires a turn to charge.")) node.nodeValue = "在第一回合进行蓄力，第二回合攻击目标。如果当天气为大晴天或大日照状态或携带了强力香草，可以立刻结束蓄力，在第一回合发动招式。在天气为下雨、大雨、沙暴或下雪状态时且自身没有携带万能伞，威力减半。如果当天气为大晴天或大日照状态时自身携带了万能伞，仍然需要蓄力一回合。";
    if (value.startsWith("The user transforms into the target. The target's current stats, stat stages, types, moves, Ability, weight, gender, and sprite are copied. The user's level and HP remain the same and each copied move receives only")) node.nodeValue = "使用者变身成目标宝可梦。目标的当前能力、能力等级、属性、招式、特性、重量和种族都会被复制。使用者的HP不变，复制的招式均只有5点PP。如果目标的利用其特性变形，无法变身成目标。如果使用者或目标已经变身、命中了替身、目标的幻觉特性正在伪装，使用失败。";
    if (value.startsWith("Causes the target to fall asleep at the end of the next turn. Fails when used if the target cannot fall asleep or if it already has a non-volatile status condition. At the end of the next turn, if the target is still active, does not have a non-volatile status condition, and can fall asleep, it falls asleep. If the target becomes affected, this effect cannot be prevented by Safeguard or a substitute, or by falling asleep and waking up during the effect.")) node.nodeValue = "使目标陷入瞌睡状态。在被施放哈欠状态的接下来的1个回合结束时，如果目标仍在场，没有异常状态且可以入睡，处于哈欠状态的宝可梦解除哈欠状态并陷入睡眠状态。目标在已陷入瞌睡状态时无法通过神秘守护、替身或睡觉来解除这个状态。";
    if (value.startsWith("For 5 turns, the user is immune to Ground-type attacks and the effects of Spikes, Toxic Spikes, Sticky Web, and the Arena Trap Ability as long as it remains active. If the user uses Baton Pass, the replacement will gain the effect. Ingrain, Smack Down, Thousand Arrows, and Iron Ball override this move if the user is under any of their effects. Fails if the user is already under this effect or the effects of Ingrain, Smack Down, or Thousand Arrows.")) node.nodeValue = "5回合内且使用者在场，使用者免疫地面属性招式，不受沙穴特性和毒菱、撒菱、黏黏网和场地型状态等状态变化的影响。处于扎根、击落状态或拥有飘浮特性时使用电磁飘浮会失败。处于重力状态时无法选择电磁飘浮招式。";
    if (value.startsWith("For 5 turns, the target is prevented from restoring any HP as long as it remains active. During the effect, healing and draining moves are unusable, and Abilities and items that grant healing will not heal the user. If an affected Pokemon uses Baton Pass, the replacement will remain unable to restore its HP. Pain Split and the Regenerator Ability are unaffected. Relevant Z-Powered moves can still be selected and executed during this effect.")) node.nodeValue = "5回合内，只要目标在场，它就无法恢复任何生命值。在效果期间，回复HP的招式、吸取HP的招式使用失败。如果目标使用接棒，新上场的宝可梦将获得此效果。分担痛楚和再生力特性不受影响。";
    if (value.startsWith("Power is equal to the base move's Max Move power. If this move is successful, each Pokemon on the opposing side is prevented from switching out, even if they have a substitute. They can still switch out if they are holding Shed Shell or use Baton Pass, Flip Turn, Parting Shot, Teleport, U-turn, or Volt Switch. If a target leaves the field using Baton Pass, the replacement will remain trapped. The effect ends if the user leaves the field.")) node.nodeValue = "威力由原本招式的威力决定。使对方全体陷入无法逃走状态，如果目标持有美丽空壳，使用了接棒、快速折返、抛下狠话、急速折返或伏特替换，可以正常替换。";
    if (value.startsWith("Power is equal to the base move's Max Move power. If this move is successful, the effects of Electric Terrain, Grassy Terrain, Misty Terrain, and Psychic Terrain end, the effects of Reflect, Light Screen, Aurora Veil, Safeguard, Mist, G-Max Steelsurge, Spikes, Toxic Spikes, Stealth Rock, and Sticky Web end for the target's side, and the effects of G-Max Steelsurge, Spikes, Toxic Spikes, Stealth Rock, and Sticky Web end for the user's side.")) node.nodeValue = "威力由原本招式的威力决定。移除对方场地上的白雾、光墙、反射壁、极光幕和神秘守护，移除双方场地上入场可生效的状态和场地型状态。";
    if (value.startsWith("Power is equal to the base move's Max Move power. If this move is successful, it sets up a hazard on the opposing side of the field, damaging each opposing Pokemon that switches in. Foes lose 1/32, 1/16, 1/8, 1/4, or 1/2 of their maximum HP, rounded down, based on their weakness to the Steel type")) node.nodeValue = "威力由原本招式的威力决定。向对手场地撒下尖锐的钢钉，使对手交换上场的宝可梦受到伤害。对手会失去其最大生命值的1/32(四倍抵抗)、1/16(两倍抵抗)、1/8、1/4(两倍克制)或1/2(四倍克制)，伤害值受到钢属性相性的影响，向下取整。如果对手的宝可梦成功使出晶光转转，高速旋转或清除浓雾，钢钉解除。";
    if (value.startsWith("Power is equal to the base move's Max Move power. If this move is successful, it sets up a hazard on the opposing side of the field, damaging each opposing Pokemon that switches in. Foes lose 1/32, 1/16, 1/8, 1/4, or 1/2 of their maximum HP, rounded down, based on their weakness to the Rock type")) node.nodeValue = "威力由原本招式的威力决定。向对手场地撒下尖锐的岩石，使对手交换上场的宝可梦受到伤害。对手会失去其最大生命值的1/32(四倍抵抗)、1/16(两倍抵抗)、1/8、1/4(两倍克制)或1/2(四倍克制)，伤害值受到岩石属性相性的影响，向下取整。如果对手的宝可梦成功使出晶光转转，高速旋转或清除浓雾，隐形岩解除。";
    if (value.startsWith("Sets up a hazard on the opposing side of the field, damaging each opposing Pokemon that switches in. Fails if the effect is already active on the opposing side. Foes lose 1/32, 1/16, 1/8, 1/4, or 1/2 of their maximum HP")) node.nodeValue = "向对手场地撒下尖锐的岩石，使对手交换上场的宝可梦受到伤害。如果对手场地已存在隐形岩，使用失败。对手会失去其最大生命值的1/32(四倍抵抗)、1/16(两倍抵抗)、1/8、1/4(两倍克制)或1/2(四倍克制)，伤害值受到岩石属性相性的影响，向下取整。如果对手的宝可梦成功使出晶光转转，高速旋转或清除浓雾，隐形岩解除。";
    if (value.startsWith("If an opposing Pokemon switches out this turn, this move hits that Pokemon before it leaves the field, even if it was not the original target. If the user moves after an opponent using U-turn, but not Baton Pass, it will hit that opponent before it leaves the field. Power doubles and no accuracy check is done if the user hits an opponent switching out, and the user's turn is over; if an opponent faints from this, the replacement Pokemon becomes active immediately.")) node.nodeValue = "如果目标在本回合内准备替换下场，则该招式会立刻攻击准备离场的宝可梦。如果对手使用抛下狠话，急速折返或伏特替换且先行动，会在对手离场之前击中该对手。如果击中了准备替换下场的宝可梦并且使用者的回合结束，伤害翻倍且必定命中。如果对手因此濒死，替换的宝可梦会在该回合登场。";
    if (value.startsWith("Deals damage to the opposing Pokemon equal to twice the HP lost by the user from a physical attack this turn. This move considers Hidden Power as Normal type, and only the last hit of a multi-hit attack is counted. Fails if the user moves first, if the user was not hit by a physical attack this turn, or if the user did not lose HP from the attack. If the opposing Pokemon used Fissure or Horn Drill and missed, this move deals 65535")) node.nodeValue = "对最后使用物理招式造成自身伤害的宝可梦为目标，造成受到的招式×2倍固定伤害。只计算多次命中攻击中的最后一次攻击，觉醒力量会被视为普通属性。如果使用者先行动、在此次攻击中没有失去HP时或所有对手都没有使用过物理招式攻击到使用者，招式使用失败。如果对手使用了地裂或角钻但没有命中，则此招式造成65535点的伤害。";
    if (value.startsWith("The power of this move is based on the user's held item. The held item is lost and it activates for the target if applicable. If there is no target or the target avoids this move by protecting itself, the user's held item is still lost. The user can regain a thrown item with Recycle or the Harvest Ability. Fails if the user has no held item, if the held item cannot be thrown, if the user is under the effect of Embargo or Magic Room, or if the user has the Klutz Ability.")) node.nodeValue = "威力效果取决于携带的道具。投掷一些特殊的道具，造成伤害后会追加效果。道具会被消耗，即使目标因为守住类招式等原因没有受到伤害，道具也会被消耗。使用者可以通过捡拾或收获特性回收道具。如果没有携带道具、携带的道具无法投掷、受到查封或魔法空间的影响或使用者拥有笨拙特性，使用失败。";
    if (value.startsWith("Deals damage two turns after this move is used. At")) node.nodeValue = "使用后，2回合后造成伤害。在该回合结束时，如果使用者在场上，按照双方当前能力值进行计算伤害；如果使用者不在场上，伤害按照使用者原本的能力值和属性进行计算，携带的道具和特性不会影响伤害。如果当前位置已经陷入未来攻击状态，使用失败。";
    if (value.startsWith("The user is protected from most attacks made by other Pokemon during this turn. This move has a 1/X chance of being successful, where X starts at 1 and triples each time this move is successfully used. X resets to 1 if this move fails, if the user's last move used is not Detect, Endure, King's Shield, Protect, Quick Guard, Spiky Shield, or Wide Guard, or if it was one of those moves and the user's protection was broken. Fails if the user moves last this turn.")) node.nodeValue = "在当回合内，使自身进入守住状态，保护自身不受到来自其他宝可梦的大部分招式的影响。此招式有1/X的成功几率，其中X从1开始，每次成功使出此招式时X增加三倍。如果使用失败，或上一回合使用的不是看穿、挺住、守住、王者盾牌、尖刺防守、碉堡、拦堵、线阱、掀榻榻米、火焰守护、广域防守或快速防守，X重置为1。如果在本回合使用者最后行动，招式会失败。";
    if (value.startsWith("The user is protected from most attacks made by other Pokemon during this turn. This move has a 1/X chance of being successful, where X starts at 1 and triples each time this move is successfully used. X resets to 1 if this move fails, if the user's last move used is not Baneful Bunker, Detect, Endure, King's Shield, Max Guard, Obstruct, Protect, Quick Guard, Spiky Shield, or Wide Guard, or if it was one of those moves and the user's protection was broken. Fails if the user moves last this turn.")) node.nodeValue = "在当回合内，使自身进入守住状态，保护自身不受到来自其他宝可梦的大部分招式的影响。此招式有1/X的成功几率，其中X从1开始，每次成功使出此招式时X增加三倍。如果使用失败，或上一回合使用的不是看穿、挺住、守住、王者盾牌、尖刺防守、碉堡、拦堵、极巨防壁、线阱、火焰守护、掀榻榻米、火焰守护、广域防守或快速防守，X重置为1。如果在本回合使用者最后行动，招式会失败。";
    if (value.startsWith("The user is protected from most attacks made by other Pokemon during this turn. This move has a 1/X chance of being successful, where X starts at 1 and triples each time this move is successfully used. X resets to 1 if this move fails, if the user's last move used is not Baneful Bunker, Detect, Endure, King's Shield, Protect, Quick Guard, Spiky Shield, or Wide Guard, or if it was one of those moves and the user's protection was broken. Fails if the user moves last this turn.")) node.nodeValue = "在当回合内，使自身进入守住状态，保护自身不受到来自其他宝可梦的大部分招式的影响。此招式有1/X的成功几率，其中X从1开始，每次成功使出此招式时X增加三倍。如果使用失败，或上一回合使用的不是看穿、挺住、守住、王者盾牌、尖刺防守、碉堡、拦堵、极巨防壁、线阱、火焰守护、掀榻榻米、广域防守或快速防守，X重置为1。如果在本回合使用者最后行动，招式会失败。";
    if (value.startsWith("The user is protected from most attacks made by other Pokemon during this turn. This move has a 1/X chance of being successful, where X starts at 1 and triples each time this move is successfully used. X resets to 1 if this move fails, if the user's last move used is not Baneful Bunker, Burning Bulwark, Detect, Endure, King's Shield, Max Guard, Obstruct, Protect, Quick Guard, Silk Trap, Spiky Shield, or Wide Guard, or if it was one of those moves and the user's protection was broken. Fails if the user moves last this turn.")) node.nodeValue = "在当回合内，使自身进入守住状态，保护自身不受到来自其他宝可梦的大部分招式的影响。此招式有1/X的成功几率，其中X从1开始，每次成功使出此招式时X增加三倍。如果使用失败，或上一回合使用的不是看穿、挺住、守住、王者盾牌、尖刺防守、碉堡、拦堵、极巨防壁、线阱、火焰守护、掀榻榻米、火焰守护、广域防守或快速防守，X重置为1。如果在本回合使用者最后行动，招式会失败。";
    if (value.startsWith("Deals damage to the last opposing Pokemon to hit the user with a special attack this turn equal to twice the HP lost by the user from that attack. If the user did not lose HP from the attack, this move deals 1 HP of damage instead. If that opposing Pokemon's position is no longer in use and there is another opposing Pokemon on the field, the damage is done to it instead. Only the last hit of a multi-hit attack is counted. Fails if the user was not hit by an opposing Pokemon's special attack this turn.")) node.nodeValue = "对最后使用特殊招式造成自身伤害的对应位置宝可梦为目标，造成受到的招式×2倍固定伤害。如果使用者在攻击中没有损失HP，此招式造成1伤害。如果对手宝可梦的位置没有目标，并且场上有另一个对手的宝可梦，则会对其造成伤害，计算多次命中攻击。所有对手都没有使用过特殊招式攻击到使用者时，招式使用失败。";
    if (value.startsWith("Deals damage to the last opposing Pokemon to hit the user with a special attack this turn equal to twice the HP lost by the user from that attack. If that opposing Pokemon's position is no longer in use and there is another opposing Pokemon on the field, the damage is done to it instead. Only the last hit of a multi-hit attack is counted. Fails if the user was not hit by an opposing Pokemon's special attack this turn, or if the user did not lose HP from the attack.")) node.nodeValue = "对最后使用特殊招式造成自身伤害的对应位置宝可梦为目标，造成受到的招式×2倍固定伤害。如果对手宝可梦的位置没有目标，并且场上有另一个对手的宝可梦，则会对其造成伤害，计算多次命中攻击。所有对手都没有使用过特殊招式攻击到使用者时，招式使用失败。";
    if (value.startsWith("Deals damage to the last opposing Pokemon to hit the user with a physical attack this turn equal to twice the HP lost by the user from that attack. If the user did not lose HP from the attack, this move deals 1 HP of damage instead. If that opposing Pokemon's position is no longer in use and there is another opposing Pokemon on the field, the damage is done to it instead. Only the last hit of a multi-hit attack is counted. Fails if the user was not hit by an opposing Pokemon's physical attack this turn.")) node.nodeValue = "对最后使用物理招式造成自身伤害的对应位置宝可梦为目标，造成受到的招式×2倍固定伤害。如果使用者在攻击中没有损失HP，此招式造成1伤害。如果对手宝可梦的位置没有目标，并且场上有另一个对手的宝可梦，则会对其造成伤害，计算多次命中攻击。所有对手都没有使用过物理招式攻击到使用者时，招式使用失败。";
    if (value.startsWith("Deals damage to the last opposing Pokemon to hit the user with a physical attack this turn equal to twice the HP lost by the user from that attack. If that opposing Pokemon's position is no longer in use and there is another opposing Pokemon on the field, the damage is done to it instead. Only the last hit of a multi-hit attack is counted. Fails if the user was not hit by an opposing Pokemon's physical attack this turn, or if the user did not lose HP from the attack.")) node.nodeValue = "对最后使用物理招式造成自身伤害的对应位置宝可梦为目标，造成受到的招式×2倍固定伤害。如果对手宝可梦的位置没有目标，并且场上有另一个对手的宝可梦，则会对其造成伤害，计算多次命中攻击。所有对手都没有使用过物理招式攻击到使用者时，招式使用失败。";
    if (value.startsWith("Has a 20% chance to poison the target. This move becomes a physical attack that makes contact if the value of ((((2 * the user's level / 5 + 2) * 90 * X) / Y) / 50), where X is the user's Attack stat and Y is the target's Defense stat, is greater than the same value where X is the user's Special Attack stat and Y is the target's Special Defense stat. No stat modifiers other than stat stage changes are considered for this purpose. If the two values are equal, this move chooses a damage category at random.")) node.nodeValue = "有20%几率使目标中毒。若使用者的攻击/目标的防御＞使用者的特攻/目标的特防，则招式为物理招式，且是接触类招式；若使用者的攻击/目标的防御＜使用者的特攻/目标的特防，则招式为特殊招式，且不是接触类招式；若两侧相等，则随机为物理或特殊招式。";
    if (value.startsWith("This move can hit a target using Bounce, Fly, or Sky Drop, or is under the effect of Sky Drop. If this move hits a target under the effect of Bounce, Fly, Magnet Rise, or Telekinesis, the effect ends. If the target is a Flying type that has not used Roost this turn or a Pokemon with the Levitate Ability, it loses its immunity to Ground-type attacks and the Arena Trap Ability as long as it remains active. During the effect, Magnet Rise fails for the target and Telekinesis fails against the target.")) node.nodeValue = "攻击目标造成伤害，并使目标陷入击落状态。如果宝可梦在处于飞行、弹跳、自由落体、电磁飘浮或意念移物状态时陷入了击落状态，则这些状态将会被解除。在此状态期间，即使使用者拥有飞行属性或漂浮特性，也可以受到地面属性招式攻击，并会受到隐形岩、撒菱、毒菱和黏黏网的影响。在此状态期间，电磁飘浮或意念移物会使用失败。";
    if (value.startsWith("Causes the target's Ability to become Simple. Fails if")) node.nodeValue = "使目标的特性变为单纯。如果目标的特性是：多属性、达摩模式、战斗切换、群聚变形、牵绊变身、懒惰、画皮、鱼群、界限盾壳、AR系统、一口导弹、结冻头、人马一体、绝对睡眠、全能变身或太晶变形，使用失败。";
    if (value.startsWith("The user is protected from most attacks made by other Pokemon during this turn. This move has an X/65536 chance of being successful, where X starts at 65535 and halves")) node.nodeValue = "在这个回合中，用户可以免受其他口袋妖怪的大多数攻击。此招式成功的几率为X/65536，其中X从65535开始，每次成功使出此招式时向下取整一半。在连续四次成功使出后，X降至118，并在随后的使用中以0～65535的随机选择一个数。如果此招式使用失败或用户的最后一次招式使用失败，X将重置为65535。如果使用失败，或上一回合使用的不是看穿、挺住或守住，X重置为65535。如果本回合使用者最后行动，招式会失败。";
    if (value.startsWith("If the user is not a Ghost type, lowers the user's Speed by 1 stage and raises the user's Attack and Defense by 1 stage. If the user is a Ghost type, the user loses 1/2 of its maximum HP, rounded down and even if it would cause fainting, in exchange for the target losing 1/4 of its maximum HP, rounded down, at the end of each turn while it is active. If the target uses Baton Pass, the replacement will continue to be affected. Fails if there is no target or if the target is already affected.")) node.nodeValue = "如果不带有幽灵属性，降低1级速度，并提升1级攻击和防御。如果带有幽灵属性，减少1/2最大HP(向下取整)，使目标进入诅咒状态，自身HP不满1/2最大HP时仍可使用，使用后自身陷入濒死状态。该状态的宝可梦每回合结束时损失1/4最大HP(向下取整)。如果目标使用接棒，新上场的宝可梦会继续损失HP。如果没有目标或目标已经进入诅咒状态，使用失败。";
    if (value.startsWith("Deals damage to the last opposing Pokemon to hit the user with a special attack this turn equal to twice the HP lost by the user from that attack. If the user did not lose HP from the attack, this move deals damage with a power of 1 instead. If that opposing Pokemon's position is no longer in use, the damage is done to a random opposing Pokemon in range. Only the last hit of a multi-hit attack is counted. Fails if the user was not hit by an opposing Pokemon's special attack this turn.")) node.nodeValue = "对最后使用特殊招式造成自身伤害的宝可梦为目标，造成受到的招式×2倍固定伤害。如果使用者在攻击中没有损失HP，此招式造成1伤害。如果对手宝可梦的位置没有目标，并且场上有另一个对手的宝可梦，则会对其造成伤害，计算多次命中攻击。所有对手都没有使用过特殊招式攻击到使用者时，招式使用失败。";
    if (value.startsWith("Deals damage to the last opposing Pokemon to hit the user with a physical attack this turn equal to twice the HP lost by the user from that attack. If the user did not lose HP from the attack, this move deals damage with a power of 1 instead. If that opposing Pokemon's position is no longer in use, the damage is done to a random opposing Pokemon in range. Only the last hit of a multi-hit attack is counted. Fails if the user was not hit by an opposing Pokemon's physical attack this turn.")) node.nodeValue = "对最后使用物理招式造成自身伤害的宝可梦为目标，造成受到的招式×2倍固定伤害。如果使用者在攻击中没有损失HP，此招式造成1伤害。如果对手宝可梦的位置没有目标，并且场上有另一个对手的宝可梦，则会对其造成伤害，计算多次命中攻击。所有对手都没有使用过物理招式攻击到使用者时，招式使用失败。";
    if (value.startsWith("Deals damage to the last opposing Pokemon to hit the user with a physical attack this turn equal to twice the HP lost by the user from that attack. If that opposing Pokemon's position is no longer in use and there is another opposing Pokemon on the field, the damage is done to it instead. This move considers Hidden Power as Normal type, and only the last hit of a multi-hit attack is counted. Fails if the user was not hit by an opposing Pokemon's physical attack this turn, or if the user did not lose HP from the attack.")) node.nodeValue = "对最后使用物理招式造成自身伤害的宝可梦为目标，造成受到的招式×2倍固定伤害。只计算多次命中攻击中的最后一次攻击，觉醒力量会被视为普通属性。所有对手都没有使用过物理招式攻击到使用者或在此次攻击中没有失去HP时，招式使用失败。";
    if (value.startsWith("Deals damage to the last opposing Pokemon to hit the user with a special attack this turn equal to twice the HP lost by the user from that attack. If that opposing Pokemon's position is no longer in use and there is another opposing Pokemon on the field, the damage is done to it instead. This move considers Hidden Power as Normal type, and only the last hit of a multi-hit attack is counted. Fails if the user was not hit by an opposing Pokemon's special attack this turn, or if the user did not lose HP from the attack.")) node.nodeValue = "对最后使用特殊招式造成自身伤害的宝可梦为目标，造成受到的招式×2倍固定伤害。只计算多次命中攻击中的最后一次攻击，觉醒力量会被视为普通属性。所有对手都没有使用过特殊招式攻击到使用者或在此次攻击中没有失去HP时，招式使用失败。";
    if (value.startsWith("The user faints, and if the Pokemon brought out to replace it does not have full HP or has a non-volatile status condition, its HP is fully restored along with having any non-volatile status condition cured. The replacement is sent out at the end of the turn, and the healing happens before hazards take effect. This effect continues until a Pokemon that meets either of these conditions switches in at the user's position or gets swapped into the position with Ally Switch. Fails if the user is the last unfainted Pokemon in its party.")) node.nodeValue = "自身陷入濒死状态，然后新上场或使用交换场地处于使用者所在位置的宝可梦恢复全部HP并治愈异常状态。宝可梦将在回合结束时新上场，在场地状态生效之前进行治愈。如果使用者是同行宝可梦中最后一只宝可梦，使用失败。";
    if (value.startsWith("If this attack was successful and the user has not fainted, it steals the target's held item if the user is not holding one. The target's item is not stolen if it is a Mail or Z-Crystal, or if the target is a Kyogre holding a Blue Orb, a Groudon holding a Red Orb, a Giratina holding a Griseous Orb, an Arceus holding a Plate, a Genesect holding a Drive, a Silvally holding a Memory, or a Pokemon that can Mega Evolve holding the Mega Stone for its species. Items lost to this move cannot be regained with Recycle or the Harvest Ability.")) node.nodeValue = "如果成功使出该招式，没有陷入濒死且没有携带物品，则会获得目标的携带物品。无法拿走Z纯晶、盖欧卡的靛蓝色宝珠、固拉多的朱红色宝珠、骑拉帝纳的白金宝珠、阿尔宙斯的石板、盖诺赛克特的卡带、厄诡椪的面具、银伴战兽的存储碟和拥有黏着特性的物品。";
    if (value.startsWith("If this move is successful, it sets up a hazard on the opposing side of the field, damaging each opposing Pokemon that switches in, unless it is a Flying-type Pokemon or has the Levitate Ability. A maximum of three layers may be set, and opponents lose 1/8 of their maximum HP with one layer, 1/6 of their maximum HP with two layers, and 1/4 of their maximum HP with three layers, all rounded down. Can be removed from the opposing side if any opposing Pokemon uses Mortal Spin, Rapid Spin, or Defog successfully, or is hit by Defog.")) node.nodeValue = "如果成功使出此招式，向对手场地撒菱。撒菱会使交换上场的对手交换上场的宝可梦受到伤害，除非它拥有飞行属性或拥有漂浮特性。最多累加3层。存在一层撒菱时对手会失去1/8最大HP，两层失去1/6最大HP，三层失去1/4最大HP。如果对手的宝可梦成功使出晶光转转，高速旋转或清除浓雾，撒菱解除。";
    if (value.startsWith("If an opposing Pokemon switches out this turn, this move hits that Pokemon before it leaves the field, even if it was not the original target. If the user moves after an opponent using Flip Turn, Parting Shot, Teleport, U-turn, or Volt Switch, but not Baton Pass, it will hit that opponent before it leaves the field. Power doubles and no accuracy check is done if the user hits an opponent switching out, and the user's turn is over; if an opponent faints from this, the replacement Pokemon does not become active until the end of the turn.")) node.nodeValue = "如果目标在本回合内准备替换下场，则该招式会立刻攻击准备离场的宝可梦。如果对手使用快速折返，抛下狠话，急速折返或伏特替换且先行动，会在对手离场之前击中该对手。如果击中了准备替换下场的宝可梦并且使用者的回合结束，伤害翻倍且必定命中。如果对手因此濒死，替换的宝可梦不会在该回合登场。";
    if (value.startsWith("For 5 turns, the user and its party members take 0.5x damage from physical and special attacks, or 0.66x damage if in a Double Battle; does not reduce damage further with Reflect or Light Screen. Critical hits ignore this protection. It is removed from the user's side if the user or an ally is successfully hit by Brick Break, Psychic Fangs, or Defog. Brick Break and Psychic Fangs remove the effect before damage is calculated. Lasts for 8 turns if the user is holding Light Clay. Fails unless the weather is Hail.")) node.nodeValue = "5回合内我方宝可梦受到的特殊招式和物理招式伤害减半，如果己方场上存在多只宝可梦则降低原本的1/3。可以与反射壁及光墙同时共存，但减少伤害的效果无法叠加。击中要害时无视此效果。如果使用者或友军被劈瓦、精神之牙和清除浓雾击中，极光幕消失。劈瓦和精神之牙会在造成伤害前移除极光幕。如果使用者携带了光之黏土，持续8回合。只有天气为冰雹或下雪时才能成功使出。如果我方已处于此效果，使用失败。";
    if (value.startsWith("Lowers the user's Defense by 1 stage. This move cannot be used successfully unless the user's current form, while considering Transform, is Hoopa Unbound. If")) node.nodeValue = "令使用者的防御降低1级。仅在使用者为解放胡帕时奏效，否则使用失败。如果成功使出该招式，解除目标的火焰守护、尖刺防守、碉堡、守住、王者盾牌，使其他宝可梦也能正常攻击目标。如果目标一侧受到戏法防守、掀榻榻米、快速防守或广域防守的守护，这个守护会在当回合被解除，使其他宝可梦也能正常攻击目标一侧。";
    if (value.startsWith("The user is protected from nearly all attacks made by other Pokemon during this turn, including Max and G-Max Moves")) node.nodeValue = "在当回合内，使自身进入守住状态，保护自身不受到来自其他宝可梦的几乎所有招式的影响，包括极巨化和超极巨化招式。此招式有1/X的成功几率，其中X从1开始，每次成功使用此招式时X增加三倍。如果使用失败，或上一回合使用的不是看穿、挺住、守住、王者盾牌、尖刺防守、碉堡、拦堵、极巨防壁、线阱、火焰守护、掀榻榻米、火焰守护、广域防守或快速防守，X重置为1。如果在本回合使用者最后行动，招式会失败。";
    if (value.startsWith("Deals damage to the last opposing Pokemon to hit the user with a physical or special attack this turn equal to 1.5 times the HP lost by the user from that attack, rounded down. If the user did not lose HP from that attack, this move deals 1 HP of damage instead. If that opposing Pokemon's position is no longer in use and there is another opposing Pokemon on the field, the damage is done to it instead. Only the last hit of a multi-hit attack is counted. Fails if the user was not hit by an opposing Pokemon's physical or special attack this turn.")) node.nodeValue = "对最后使用物理或特殊招式造成自身伤害的对应位置宝可梦为目标，造成受到的招式×1.5倍固定伤害。如果使用者在攻击中没有损失HP，此招式造成1伤害。如果对手宝可梦的位置没有目标，并且场上有另一个对手的宝可梦，则会对其造成伤害，计算多次命中攻击。所有对手都没有使用过物理或特殊招式攻击到使用者时，招式使用失败。";
    if (value.startsWith("The user faints, and if the Pokemon brought out to replace it does not have full HP or PP, or has a non-volatile status condition, its HP and PP are fully restored along with having any non-volatile status condition cured. The replacement is sent out at the end of the turn, and the healing happens before hazards take effect. This effect continues until a Pokemon that meets any of these conditions switches in at the user's position or gets swapped into the position with Ally Switch. Fails if the user is the last unfainted Pokemon in its party.")) node.nodeValue = "自身陷入濒死状态，然后新上场的宝可梦恢复全部HP和PP并治愈异常状态。宝可梦将在回合结束时新上场，在场地状态生效之前进行治愈。如果使用者是同行宝可梦中最后一只宝可梦，使用失败。";
    if (value.startsWith("If the user is not a Ghost type, lowers the user's Speed by 1 stage and raises the user's Attack and Defense by 1 stage. If the user is a Ghost type, the user loses 1/2 of its maximum HP, rounded down and even if it would cause fainting, in exchange for the target losing 1/4 of its maximum HP, rounded down, at the end of each turn while it is active. If the target uses Baton Pass, the replacement will continue to be affected. Fails if there is no target or if the target is already affected or has a substitute.")) node.nodeValue = "如果不带有幽灵属性，降低1级速度，并提升1级攻击和防御。如果带有幽灵属性，减少1/2最大HP(向下取整)，使目标进入诅咒状态，自身HP不满1/2最大HP时仍可使用，使用后自身陷入濒死状态。该状态的宝可梦每回合结束时损失1/4最大HP(向下取整)。如果目标使用接棒，新上场的宝可梦会继续损失HP。如果没有目标、目标已经进入诅咒状态或命中了替身，使用失败。";
    if (value.startsWith("Causes the target's Ability to become Insomnia. Fails if")) node.nodeValue = "将目标的特性变更为不眠。目标特性为无法被覆盖的特性时，烦恼种子使用失败，包括：多属性、达摩模式、战斗切换、群聚变形、牵绊变身、画皮、鱼群、界限盾壳、AR系统、一口导弹、结冻头、人马一体、绝对睡眠、全能变身和太晶变形。";
    if (value.startsWith("The user will survive attacks made by other Pokemon during this turn with at least 1 HP. This move has a 1/X")) node.nodeValue = "在本回合结束使自身保留至少1点HP。此招式有1/X的成功几率，其中X从1开始，每次成功使用此招式时X增加三倍。如果使用失败，或上一回合使用的不是看穿、挺住、守住、王者盾牌、尖刺防守、碉堡、拦堵、线阱、掀榻榻米、火焰守护、广域防守或快速防守，X重置为1。如果在本回合使用者最后行动，招式会失败。";
    if (value.startsWith("If this move is successful, it breaks through the target's Baneful Bunker, Detect, King's Shield, Protect, or Spiky Shield for this turn, allowing other Pokemon to attack the target normally. If the target's side is protected by Crafty Shield, Mat Block, Quick Guard, or Wide Guard, that protection is also broken for this turn and other Pokemon may attack the target's side normally.")) node.nodeValue = "如果成功使出该招式，解除目标的火焰守护、尖刺防守、碉堡、守住、王者盾牌，使其他宝可梦也能正常攻击目标。如果目标一侧受到戏法防守、掀榻榻米、快速防守或广域防守的守护，这个守护会在当回合被解除，使其他宝可梦也能正常攻击目标一侧。";
    if (value.startsWith("If this move is successful, it breaks through the target's Baneful Bunker, Detect, King's Shield, Protect, or Spiky Shield for this turn, allowing other Pokemon to attack the target normally. If the target's side is protected by Crafty Shield, Mat Block, Quick Guard, or Wide Guard, that protection is also broken for this turn and other Pokemon may attack the target's side normally. This")) node.nodeValue = "如果成功使出该招式，解除目标的火焰守护、尖刺防守、碉堡、守住、王者盾牌，使其他宝可梦也能正常攻击目标。如果目标一侧受到戏法防守、掀榻榻米、快速防守或广域防守的守护，这个守护会在当回合被解除，使其他宝可梦也能正常攻击目标一侧。在第一回合进行蓄力，第二回合发动招式。如果携带了强力香草，可以立刻结束蓄力，在第一回合发动招式。";
    if (value.startsWith("For 5 turns, the weather becomes Sandstorm")) node.nodeValue = "接下来5回合的天气变为沙暴。沙暴时，岩石属性宝可梦的特防×1.5。除了最后一回合，每个回合结束时除岩石属性、地面属性和钢属性以外的在场宝可梦受到最大HP1/16的伤害(向下取整)，除非其拥有魔法防守、防尘、沙之力、泼沙或沙隐特性。如果使用者携带了沙沙岩石，持续时间延长为8回合。如果当前天气已为沙暴，使用失败。";
    if (value.startsWith("For 5 turns, the weather becomes Rain Dance")) node.nodeValue = "接下来5回合的天气变为下雨。下雨时，水属性招式的威力×1.5，火属性招式的威力×0.5。如果使用者携带了潮湿岩石，持续时间延长为8回合。如果当前天气已为下雨，使用失败。";
    if (value.startsWith("For 5 turns, the weather becomes Sunny Day")) node.nodeValue = "接下来5回合的天气变为大晴天。大晴天时，火属性招式的威力×1.5，水属性招式的威力×0.5。如果使用者携带了炽热岩石，持续时间延长为8回合。如果当前天气已为大晴天，使用失败。";
    if (value.startsWith("For 5 turns, the weather becomes Hail")) node.nodeValue = "接下来5回合的天气变为冰雹。冰雹时，冰属性宝可梦的防御×1.5。如果使用者携带了冰冷岩石，持续时间延长为8回合。如果当前天气已为冰雹，使用失败。";
    if (value.startsWith("For 5 turns, the weather becomes Snow. During the")) node.nodeValue = "接下来5回合的天气变更为下雪。下雪时，冰属性宝可梦的防御×1.5。如果使用者携带了冰冷岩石，持续时间延长为8回合。如果当前天气已为下雪，使用失败。";
    if (value.startsWith("If one of the user's allies chose to use Fire Pledge or Grass Pledge")) node.nodeValue = "如果使用者的同伴在本回合选择使用火之誓约或草之誓约但尚未行动，则会在使用者之后立即进行回合，使用者的招式没有作用。如果与火之誓约组合，同伴将使用150威力的水之誓约，并使己方场地出现彩虹，持续4回合，处于彩虹场地的宝可梦使用招式时追加效果的出现率×2，天恩特性的效果与彩虹的效果可以叠加，但能导致畏缩的招式不叠加。如果与草之誓约组合，同伴将使用150威力的草之誓约，并使对方场地会出现一片湿地，持续4回合，处于湿地场地的宝可梦速度降低至原本的1/4。当用作合体招式时，无论使用者是何种属性，此招式都会获得属性一致加成。不会消耗使用者的水之宝石。无视引水特性的吸引效果。";
    if (value.startsWith("If one of the user's allies chose to use Grass Pledge or Water Pledge")) node.nodeValue = "如果使用者的同伴在本回合选择使用草之誓约或水之誓约但尚未行动，则会在使用者之后立即进行回合，使用者的招式没有作用。如果与草之誓约组合，同伴将使用150威力的火之誓约，并使对方场地出现一片火海，持续4回合，处于火海场地的非火属性宝可梦每回合损失最大HP×1/8的HP。如果与水之誓约组合，同伴将使用150威力的水之誓约，并使己方场地出现彩虹，持续4回合，处于彩虹场地的宝可梦使用招式时追加效果的出现率×2，天恩特性的效果与彩虹的效果可以叠加，但能导致畏缩的招式不叠加。当用作合体招式时，无论使用者是何种属性，此招式都会获得属性一致加成。不会消耗使用者的火之宝石。";
    if (value.startsWith("If one of the user's allies chose to use Fire Pledge or Water Pledge")) node.nodeValue = "如果使用者的同伴在本回合选择使用火之誓约或水之誓约但尚未行动，则会在使用者之后立即进行回合，使用者的招式没有作用。如果与火之誓约组合，同伴将使用150威力的火之誓约，并使对方场地出现一片火海，持续4回合，处于火海场地的非火属性宝可梦每回合损失最大HP×1/8的HP。如果与水之誓约组合，同伴将使用150威力的草之誓约，并使对方场地会出现一片湿地，持续4回合，处于湿地场地的宝可梦速度降低至原本的1/4。当用作合体招式时，无论使用者是何种属性，此招式都会获得属性一致加成。不会消耗使用者的草之宝石。";
    if (value.startsWith("Causes the target's Ability to be rendered ineffective as long as it remains active. If")) node.nodeValue = "使目标陷入无特性状态。处于无特性状态的宝可梦的特性无效。如果目标使用了接棒，新上场的宝可梦会继承此效果。如果目标的特性是一口导弹、AR系统、战斗切换、多属性、人马一体、结冻头、牵绊变身、全能变身、达摩模式、群聚变形、界限盾壳、群聚变形、绝对睡眠、太晶变形、鱼群或画皮，使用失败。通过接棒获得此效果时，此效果立即结束。";
    if (value.startsWith("Causes the user's types to become the same as the current types of the target. If the")) node.nodeValue = "使用者的属性变得和目标一样。如果目标拥有无属性和其他属性，使用者的属性会忽略无属性。如果目标为单一无属性，招式使用失败。但如果单一无属性的目标受到森林咒术或万圣夜影响，则招式可以使用，使用者改变属性时会将无属性视为一般属性。";
    if (value.startsWith("If this move is successful, the user is locked into this move and cannot make another move until it misses, 5 turns have passed, or the attack cannot be used. Power")) node.nodeValue = "如果成功使出该招式，在接下来的4回合会继续使用此招式进行攻击，无法使用其他招式、使用道具、替换宝可梦。此招式每次命中，威力都会翻倍，如果在对战中自身曾使用变圆，该招式威力还会再次翻倍。如果这个招式被梦话调用，只会使用一个回合。";
    if (value.startsWith("The Pokemon at the user's position steals 1/8 of the target's maximum HP, rounded down, at the end of each turn. If")) node.nodeValue = "每回合结束时，处于使用者位置的宝可梦夺走目标1/8的最大HP，向下取整一半。携带大根茎时，恢复量提升30%，向下取整一半。如果目标使用接棒，新上场的宝可梦会继续被夺取HP。如果目标离场、成功使出晶光转转或高速旋转，效果结束。对草属性宝可梦无效。";
    if (value.startsWith("If the user moves after the target, the target's Ability is rendered ineffective as long as it remains active. If")) node.nodeValue = "如果目标在该回合已使用过招式，使目标陷入无特性状态。如果目标的特性是：无特性、人马一体、牵绊变身、绝对睡眠、画皮、一口导弹、结冻头、多属性、群聚变形、AR系统、鱼群、界限盾壳、战斗切换、太晶变形、达摩模式或全能变身，该效果不会发生。通过接棒获得该效果时会立即结束该效果。";
    if (value.startsWith("The user and its party members are protected from attacks with original or altered priority greater than 0 made by other Pokemon")) node.nodeValue = "在当回合内，使我方全体进入守住状态，保护我方全体不受到来自其他宝可梦的大部分先制招式的影响。此招式有1/X的成功几率，其中X从1开始，每次成功使用此招式时X增加三倍。如果使用失败，或上一回合使用的不是看穿、挺住、守住、王者盾牌、尖刺防守、碉堡、拦堵、极巨防壁、线阱、火焰守护、掀榻榻米、火焰守护、广域防守或快速防守，X重置为1。如果在本回合使用者最后行动，招式会失败。";
    if (value.startsWith("This move is permanently replaced by the last move used by the target. The copied move has")) node.nodeValue = "将写生永久替换为目标最后使用过的招式，并拥有最大PP。以下招式无法被写生：已经学会的招式、写生、挣扎、喋喋不休、异次元猛攻(第九世代起)、暗黑洞(第九世代起)、复生祈祷、晶光星群和Z招式。";
    if (value.startsWith("For 3 turns, the target cannot avoid any attacks made against it, other than")) node.nodeValue = "3回合内使目标进入意念移物状态。处于意念移物状态的宝可梦免疫地面属性招式，不受沙穴特性和毒菱、撒菱、黏黏网和场地型状态等状态变化的影响。以处于意念移物状态的宝可梦为目标的除一击必杀招式外的招式必定命中。开启重力状态，被击落、千箭齐发命中，交换宝可梦都会覆盖意念移物状态。如果目标使用了接棒，新上场的宝可梦继承此状态。无法对超级耿鬼、阿罗拉地鼠、地鼠、阿罗拉三地鼠、三地鼠、沙丘娃、噬沙堡爷使用意念移物使它们进入该状态，但它们（除了超级耿鬼）可以被接棒传递得到此状态且可以正常生效。";
    if (value.startsWith("The target receives the user's held item. Fails if the user has no item or")) node.nodeValue = "使用者在本次战斗中将携带物品给予目标。如果使用者没有物品、目标已携带物品或给予的是可使携带者进行超级进化的进化石、Z纯晶或邮件，使用失败。如果目标或使用者是携带着靛蓝色宝珠的盖欧卡、朱红色宝珠的固拉多、白金宝珠的骑拉帝纳、石板的阿尔宙斯、卡带的盖诺赛克特、存储碟的银伴战兽、面具的厄诡椪、腐朽之剑的苍响、腐朽之盾的藏玛然特，使用失败。";
    if (value.startsWith("For 4 turns, the target's last move used becomes disabled. Fails if one")) node.nodeValue = "4回合内，目标不能使用陷入定身法状态前最后使用的招式。如果目标尚未在本场对战中使用招式，或最后使用的招式是挣扎、极巨化、超极巨化招式或已经陷入定身法状态，定身法使用失败。";
    if (value.startsWith("Until the end of the turn, the user is unaffected by certain non-damaging moves directed at it and will instead use such moves against the original user")) node.nodeValue = "当回合内进入魔法反射状态，将对方以自身为目标的部分变化招式无效化，并反弹给招式的使用者。被魔法反射状态反弹的招式不会被再次反弹。如果场上同时有魔法反射和魔法镜，由最左边的宝可梦反弹招式。避雷针和引水特性会在反弹生效之前提高特攻。";
    if (value.startsWith("While the user remains active, this move is replaced by the last move used by the target")) node.nodeValue = "将此招式替换为目标最后使用的招式，PP变为5。如果目标尚未在本场对战中使用招式，或本回合使用招式失败，或自身已经学会目标的招式，模仿会失败。如果目标的招式为以下招式时，模仿使用失败：仿效、梦话、挥指、鹦鹉学舌、自然之力、借助、抢先一步、模仿、写生、变身、喋喋不休、打嗝、庆祝、牵手、巨兽弹、巨兽斩、极巨炮、晶光星群、挣扎、搭档招式、Z招式或极巨招式。";
    if (value.startsWith("Power is equal to the base move's Max Move power. If this move is successful, each Pokemon on the opposing side is prevented from switching")) node.nodeValue = "威力由原本招式的威力决定。使全体对手陷入束缚状态。束缚状态持续4～5回合(如果携带了紧缠钩爪，则为7回合)，处于束缚状态的宝可梦每回合结束时会受到1/8最大HP的伤害（如果携带了紧绑束带，则为1/6）并不能换下，向下取整一半。如果目标持有美丽空壳或使用了接棒、快速折返、抛下狠话、急速折返或伏特替换，可以正常替换。如果使用者或目标离场，或者目标成功使出晶光转转、高速旋转或替身，效果结束。使用此招式或其他束缚招式不会累计或重置束缚状态。";
    if (value.startsWith("The user regains the item it last used. Fails if the user is holding an item, if the user has not held an item, if")) node.nodeValue = "回收在对战中最后消耗的道具。如果自身携带有道具，则招式使用失败。因受到攻击而破裂的气球无法被回收。通过烧净、啄食、虫咬、渴望、拍落、掉包、小偷或戏法失去的道具无法被回收。通过投掷消耗的道具可以被回收。";
    if (value.startsWith("The user has 1/16 of its maximum HP restored at the end of each turn, but it is prevented from switching out and")) node.nodeValue = "使自己进入扎根状态。处于扎根状态下的宝可梦无法替换下场，在回合结束时会回复最大HP的1/16。不受对手的强制替换效果影响。如果使用快速折返，抛下狠话，急速折返或伏特替换，可以正常离场。如果使用者使用接棒，新上场的宝可梦将获得此效果。在此期间，即使使用者拥有飞行属性或漂浮特性，也可以受到地面属性招式攻击，并会受到隐形岩、撒菱、毒菱和黏黏网的影响。";
    if (value.startsWith("Sets up a hazard on the opposing side of the field, damaging each opposing Pokemon that switches in, unless it is a Flying-type Pokemon or has the Levitate Ability. Can be used up to three times before failing. Opponents lose 1/8 of their maximum HP with one layer, 1/6")) node.nodeValue = "向对手的场地撒菱，使对手交换上场的宝可梦受到伤害，除非它拥有飞行属性或拥有漂浮特性。最多累加3层。存在一层撒菱时对手会失去1/8最大HP，两层失去1/6最大HP，三层失去1/4最大HP。如果对手的宝可梦成功使出晶光转转、高速旋转或清除浓雾，撒菱解除。";
    if (value.startsWith("Sets up a hazard on the opposing side of the field, poisoning each opposing Pokemon that switches in")) node.nodeValue = "向对手的场地布满毒菱，使对手交换上场的宝可梦中毒，除非它拥有飞行属性或拥有漂浮特性。最多累加2层。存在一层毒菱时对手会陷入中毒状态，两层会陷入剧毒。如果对手的宝可梦成功使出晶光转转，高速旋转或清除浓雾，或换上毒属性且是地面上的宝可梦时，毒菱解除。神秘守护可以防止异常状态，但替身不能。";
    if (value.startsWith("If an adjacent opposing Pokemon switches out this turn, this move hits that Pokemon before it leaves the field, even if")) node.nodeValue = "如果目标在本回合内准备替换下场，则该招式会立刻攻击准备离场的宝可梦。如果对手使用了抛下狠话、快速折返、急速折返或伏特替换且先行动，会在对手离场之前击中该对手。如果击中了准备替换下场的宝可梦并且使用者的回合结束，伤害翻倍且必定命中。如果对手因此濒死，替换的宝可梦不会在该回合登场。";
    if (value.startsWith("The user swaps its held item with the target's held item. Fails if")) node.nodeValue = "使用者与目标交换携带物品。如果试图交换邮件、Z纯晶、可使携带者进行超级进化的进化石或双方均无道具时，使用失败。如果试图向盖欧卡，固拉多，骑拉帝纳，阿尔宙斯，盖诺赛克特，银伴战兽和厄诡椪赠送或拿走它的靛蓝色宝珠，朱红色宝珠，白金宝珠，石板，卡带，存储碟或面具，使用失败。如果目标拥有黏着特性，没有效果。";
    if (value.startsWith("If the user is not a Ghost type, lowers the user's Speed by 1 stage and raises the user's Attack and Defense by 1 stage, unless the user's Attack and Defense stats are both at stage 6. If the user is a Ghost type, the user loses 1/2 of its maximum HP, rounded down and even if it would cause fainting, in exchange for the target losing 1/4 of its maximum HP, rounded down, at the end of each turn while it is active. If the target uses Baton Pass, the replacement will continue to be affected. Fails if the target is already affected or has a substitute")) node.nodeValue = "如果不带有幽灵属性，降低1级速度，并提升1级攻击和防御。如果带有幽灵属性，减少1/2最大HP(向下取整)，使目标进入诅咒状态，自身HP不满1/2最大HP时仍可使用，使用后自身陷入濒死状态。该状态的宝可梦每回合结束时损失1/4最大HP(向下取整)。如果目标使用接棒，新上场的宝可梦会继续损失HP。如果命中了替身、没有目标或目标已经进入诅咒状态，使用失败。";
    if (value.startsWith("The user spends two or three turns locked into this move and becomes confused")) node.nodeValue = "接下来的2～3回合使用此招式攻击随机一位对手，无法使用其他招式或替换。如果此招式被禁用、在回合开始时处于睡眠状态、持续2回合效果中的第一回合或持续3回合效果中的前两回合的攻击对目标没有产生效果，则效果结束不会陷入混乱。如果此招式由梦话使出且自身处于睡眠状态，则此招式只使用一次，不会陷入混乱。因回合经过解除时，使用者陷入混乱状态。";
    if (value.startsWith("Lowers the target's evasiveness by 1 stage. If this move is successful and whether or not the target's evasiveness was affected, the effects of Reflect")) node.nodeValue = "令目标的闪避率降低1级。只要此招式成功使出，无论是否降低了目标的闪避率，都会移除对方场地上的白雾、光墙、反射壁、极光幕和神秘守护，移除双方场地上入场可生效的状态和场地型状态。如果目标处于替身状态，则虽然闪避率不会降低，但后续效果仍然发生。";
    if (value.startsWith("The user is protected from most attacks made by other Pokemon during this turn, and Pokemon trying to make contact with the user have their Defense lowered by 2")) node.nodeValue = "在当回合内，使自身进入守住状态，保护自身不受到来自其他宝可梦的大部分招式的影响，对变化技能无效。处于守住状态期间受到接触类招式的攻击时，令攻击方降低2级防御。此招式有1/X的成功几率，其中X从1开始，每次成功使用此招式时X增加三倍。如果使用失败，或上一回合使用的不是看穿、挺住、守住、王者盾牌、尖刺防守、碉堡、拦堵、极巨防壁、线阱、火焰守护、掀榻榻米、广域防守或快速防守，X重置为1。如果在本回合使用者最后行动，招式会失败。";
    if (value.startsWith("The user is protected from most attacks made by other Pokemon during this turn, and Pokemon trying to make contact with the user have their Speed lowered by 1")) node.nodeValue = "在当回合内，使自身进入守住状态，保护自身不受到来自其他宝可梦的大部分招式的影响，对变化技能无效。处于守住状态期间受到接触类招式的攻击时，令攻击方降低1级速度。此招式有1/X的成功几率，其中X从1开始，每次成功使用此招式时X增加三倍。如果使用失败，或上一回合使用的不是看穿、挺住、守住、王者盾牌、尖刺防守、碉堡、拦堵、极巨防壁、线阱、火焰守护、掀榻榻米、广域防守或快速防守，X重置为1。如果在本回合使用者最后行动，招式会失败。";
    if (value.startsWith("The user is protected from most attacks made by other Pokemon during this turn, and Pokemon trying to make contact with the user have their Attack lowered by 2")) node.nodeValue = "在当回合内，使自身进入守住状态，保护自身不受到来自其他宝可梦的大部分招式的影响，对变化技能无效。处于守住状态期间受到接触类招式的攻击时，令攻击方降低2级攻击。此招式有1/X的成功几率，其中X从1开始，每次成功使用此招式时X增加三倍。如果使用失败，或上一回合使用的不是看穿、挺住、守住、王者盾牌、尖刺防守、碉堡、拦堵、极巨防壁、线阱、火焰守护、掀榻榻米、广域防守或快速防守，X重置为1。如果在本回合使用者最后行动，招式会失败。";
    if (value.startsWith("The user is protected from most attacks made by other Pokemon during this turn, and Pokemon trying to make contact with the user have their Attack lowered by 1")) node.nodeValue = "在当回合内，使自身进入守住状态，保护自身不受到来自其他宝可梦的大部分招式的影响，对变化技能无效。处于守住状态期间受到接触类招式的攻击时，令攻击方降低1级攻击。此招式有1/X的成功几率，其中X从1开始，每次成功使用此招式时X增加三倍。如果使用失败，或上一回合使用的不是看穿、挺住、守住、王者盾牌、尖刺防守、碉堡、拦堵、极巨防壁、线阱、火焰守护、掀榻榻米、广域防守或快速防守，X重置为1。如果在本回合使用者最后行动，招式会失败。";
    if (value.startsWith("The user is protected from most attacks made by other Pokemon during this turn, and Pokemon trying to make contact with the user become burned")) node.nodeValue = "在当回合内保护自身不受到来自其他宝可梦的大部分招式的影响，对变化技能无效。处于守住状态期间受到接触类招式的攻击时，令攻击方灼伤。此招式有1/X的成功几率，其中X从1开始，每次成功使用此招式时X增加三倍。如果使用失败，或上一回合使用的不是看穿、挺住、守住、王者盾牌、尖刺防守、碉堡、拦堵、极巨防壁、线阱、火焰守护、掀榻榻米、广域防守或快速防守，X重置为1。如果在本回合使用者最后行动，招式会失败。";
    if (value.startsWith("The user is protected from most attacks made by other Pokemon during this turn, and Pokemon making contact with the user lose 1/8 of their maximum")) node.nodeValue = "在当回合内，使自身进入守住状态，保护自身不受到来自其他宝可梦的大部分招式的影响。处于守住状态期间受到接触类招式的攻击时，令攻击方损失其1/8最大HP。此招式有1/X的成功几率，其中X从1开始，每次成功使用此招式时X增加三倍。如果使用失败，或上一回合使用的不是看穿、挺住、守住、王者盾牌、尖刺防守、碉堡、拦堵、极巨防壁、线阱、火焰守护、掀榻榻米、广域防守或快速防守，X重置为1。如果在本回合使用者最后行动，招式会失败。";
    if (value.startsWith("The user is protected from most attacks made by other Pokemon during this turn, and Pokemon making contact with the user become poisoned")) node.nodeValue = "在当回合内保护自身不受到来自其他宝可梦的大部分招式的影响。处于守住状态期间受到接触类招式的攻击时，令攻击方中毒。此招式有1/X的成功几率，其中X从1开始，每次成功使用此招式时X增加三倍。如果使用失败，或上一回合使用的不是看穿、挺住、守住、王者盾牌、尖刺防守、碉堡、拦堵、极巨防壁、线阱、火焰守护、掀榻榻米、火焰守护、广域防守或快速防守，X重置为1。如果在本回合使用者最后行动，招式会失败。";
    if (value.startsWith("Power doubles if the user's last move on the previous turn, including moves called by other moves")) node.nodeValue = "如果自身上一回合因异常状态或状态变化而无法行动，或者使用的招式失败、没有命中目标或者对目标没有效果，则本回合使用此招式威力翻倍。上一回合使用的招式被目标使用守住等招式阻挡后不会触发此招式的威力翻倍效果。";
    if (value.startsWith("Prevents the target from switching for four or five turns (seven turns if the user is holding Grip Claw). Causes damage to the target equal to 1/8")) node.nodeValue = "使目标陷入束缚状态。束缚状态持续4～5回合(如果携带了紧缠钩爪，则为7回合)，处于束缚状态的宝可梦每回合结束时会受到1/8最大HP的伤害（如果携带了紧绑束带，则为1/6）并不能换下，向下取整一半。如果目标持有美丽空壳或使用了接棒、快速折返、抛下狠话、急速折返或伏特替换，可以正常替换。如果使用者或目标离场，或者目标成功使出晶光转转、高速旋转或替身，效果结束。使用此招式或其他束缚招式不会累计或重置束缚状态。";
    if (value.startsWith("If the target is holding an item that can be removed from it, ignoring the Sticky Hold Ability, this move's power is multiplied by 1.5")) node.nodeValue = "如果目标持有可被拍落的携带物品并且没有黏着特性，本次攻击的伤害×1.5。如果使用者没有濒死，则目标在战斗结束前失去其携带物品。因拍落而失去的物品无法通过回收利用或收获特性回收。此招式无法拍落：Z纯晶、可使携带者进行超级进化的进化石、盖欧卡的靛蓝色宝珠、固拉多的朱红色宝珠、骑拉帝纳的白金宝珠、阿尔宙斯的石板、盖诺赛克特的卡带、银伴战兽的存储碟、厄诡椪的面具、苍响的腐朽之剑、藏玛然特的腐朽之盾和拥有黏着特性的宝可梦的携带物品。";
    if (value.startsWith("Prevents the target from switching out. The target can still switch out if")) node.nodeValue = "使目标陷入无法逃走状态。如果目标使用接棒离场，新上场的宝可梦将无法逃走。如果目标使用快速折返，抛下狠话，急速折返或伏特替换，可以正常离场。如果使用者离场，效果结束。";
    if (value.startsWith("Causes the target's Ability to become the same as the user's. Fails if")) node.nodeValue = "将目标的特性变为与使用者相同。如果目标的特性为多属性、达摩模式、战斗切换、群聚变形、牵绊变身、画皮、鱼群、懒惰、界限盾壳、AR系统、一口导弹、结冻头、人马一体、绝对睡眠、全能变身和太晶变形；或使用者的的特性为复制、接球手、化学之力、阴晴不定、花之礼、多属性、变身者、幻觉、达摩模式、战斗切换、群聚变形、牵绊变身、画皮、鱼群、界限盾壳、AR系统、饱了又饿、结冻头、人马一体、绝对睡眠、化学变化气体、全能变身、发号施令、古代活性、夸克充能、面影辉映、太晶变形、太晶甲壳、归零化境和毒傀儡，使用失败。";
    if (value.startsWith("One of the user's known moves, besides this move, is selected for use at random. Fails if the user is not asleep")) node.nodeValue = "随机使用1个自身学会的其它招式。只能在睡眠时使用，如果不处于睡眠，使用失败。不会消耗所选择的招式的PP，当随机使用的招式PP为0时，该招式仍可被梦话使用。以下招式不会被梦话发动：梦话、挥指、鹦鹉学舌、自然之力、借助、抢先一步、仿效、模仿、写生、真气拳、鸟嘴加农炮、陷阱甲壳、忍耐、吵闹、喋喋不休、打嗝、庆祝、牵手、极巨炮、Z招式以及蓄力招式。";
    if (value.startsWith("The user swaps its Ability with the target's Ability. Fails if")) node.nodeValue = "自身和目标交换特性。如果自身或目标的是特性是：神奇守护、多属性、幻觉、达摩模式、战斗切换、群聚变形、 牵绊变身、画皮、鱼群、界限盾壳、AR系统、饱了又饿、一口导弹、结冻头、人马一体、绝对睡眠、化学变化气体、全能变身、发号施令、古代活性和夸克充能，使用失败。";
    if (value.startsWith("For its next 3 turns, the target is forced to repeat its last move used")) node.nodeValue = "令目标接下来的3回合，只能使用其最后使用的招式。如果目标受到影响的招式超出PP，效果结束。如果目标已陷入此状态，或者最后使出的是再来一次、模仿、写生、挣扎、变身、借助、仿效、抢先一步、挥指、鹦鹉学舌、自然之力、梦话、极巨炮、极巨招式、Z招式，使用失败。";
    if (value.startsWith("A random move among those known by the user's party")) node.nodeValue = "随机使用队伍中其它1只宝可梦的一个招式。以下招式不会被发动：守住类招式、鸟嘴加农炮、打嗝、传递礼物、弹跳、庆祝、巴投、仿效、喋喋不休、双倍奉还、渴望、同命、潜水、挖洞、龙尾、挺住、佯攻、飞翔、真气拳、帮助、看我嘛、抢先一步、牵手、挥指、模仿、镜面反射、鹦鹉学舌、自然之力、潜灵奇袭、愤怒粉、吼叫、暗影潜袭、陷阱甲壳、写生、自由落体、梦话、抢夺、聚光灯、掉包、挣扎、掉包、变身、戏法或吹飞。";
    if (value.startsWith("This move can hit airborne Pokemon, which")) node.nodeValue = "能够击中不在地面上的宝可梦并令其陷入击落状态。此招式对任何未处于击落状态的飞行属性宝可梦的属性相性变为1×，另一属性不参与计算，反转对战除外。 此招式对任何未处于击落状态的飘浮特性宝可梦直接计算它本身的属性相性。如果宝可梦在处于飞行、弹跳、自由落体、电磁飘浮或意念移物状态时陷入了击落状态，则这些状态将会被解除。在此状态期间，即使使用者拥有飞行属性或漂浮特性，也可以受到地面属性招式攻击，并会受到隐形岩、撒菱、毒菱和黏黏网的影响。在此状态期间，电磁飘浮或意念移物会使用失败。";
    if (value.startsWith("For 5 turns, the evasiveness of all active Pokemon is multiplied by 0.6")) node.nodeValue = "5回合内，所有在场的宝可梦闪避率降低60%。进入重力状态时，解除所有宝可梦的飞翔、意念移物状态。处于重力状态时，跃起、飞踢、飞膝踢、电磁飘浮、飞翔、弹跳、自由落体、意念移物和飞身重压无法使用。飞行属性、飘浮特性、电磁飘浮状态及携带了气球的宝可梦可以被地面属性招式、撒菱、毒菱、黏黏网和沙穴特性影响。如果此状态已经生效，使用失败。";
    if (value.startsWith("The user uses the last move used by any Pokemon, including itself")) node.nodeValue = "使用场上宝可梦最后成功使用的招式。如果没有使用过任何招式，或最后成功使用的招式为：仿效、梦话、挥指、鹦鹉学舌、自然之力、借助、抢先一步、模仿、写生、抢夺、变身、吹飞、吼叫、龙尾、巴投、真气拳、鸟嘴加农炮、陷阱甲壳、守住类招式、看我嘛、愤怒粉、佯攻、帮助、镜面反射(第九世代前)、双倍奉还、同命、挺住、戏法、掉包、传递礼物、渴望、小偷、打嗝、喋喋不休、聚光灯、庆祝、牵手、巨兽弹、巨兽斩、极巨炮、晶光星群、挣扎、Z招式，使用失败。";
    if (value.startsWith("The target immediately uses its last used move. Fails if")) node.nodeValue = "令目标再使用一次先前使用的招式。无视速度和优先度条件。以下情况会导致号令使用失败：目标没有使用招式且使用号令的宝可梦比目标提前使用；使出的招式已耗尽PP；处于畏缩；使用多回合攻击类招式、仿效、梦话、击掌奇袭、迎头一击、挥指、鹦鹉学舌、自然之力、借助、抢先一步、号令、蓄力的招式、鸟嘴加农炮、陷阱甲壳、真气拳、拦堵、王者盾牌、忍耐、模仿、写生、变身、吵闹、喋喋不休、打嗝、庆祝、牵手、极巨炮、挣扎、极巨招式、Z招式、使用后下一回合将无法动弹的招式。";
    if (value.startsWith("The user and its party members are protected from moves made by other Pokemon")) node.nodeValue = "在当回合内，使我方全体进入守住状态，保护我方全体不受到来自其他宝可梦的大部分招式的影响。此招式有1/X的成功几率，其中X从1开始，每次成功使用此招式时X增加三倍。如果使用失败，或上一回合使用的不是看穿、挺住、守住、王者盾牌、尖刺防守、碉堡、拦堵、极巨防壁、线阱、火焰守护、掀榻榻米、火焰守护、广域防守或快速防守，X重置为1。如果在本回合使用者最后行动，招式会失败。";
    if (value.startsWith("The user takes 1/4 of its maximum HP, rounded down, and puts it into a substitute to take its place in")) node.nodeValue = "用自己最大HP的1/4制造出替身，相等于替身的HP，向下取整。如果自身离场或替身HP为0，替身会消失。使用接棒或断尾传递替身时，替身的HP不变。替身存在时对手的攻击招式的伤害大都只能伤害替身，并防止本体免受其他宝可梦造成的异常状态和状态变化。声音的招式以及穿透特性的宝可梦使用的招式可以无视替身。天气和替身存在前的异常状态、状态变化正常影响本体。连续招式打破替身后可以继续攻击。如果在本体在陷入无法逃走状态时制造了替身，无法逃走状态将立即结束。如果HP不足或已经拥有替身，使用失败。";
    if (value.length > 260) return;
    if (node.parentNode?.tagName == "STRONG" || node.parentNode?.getAttribute("class") == "col movenamecol" ||
        node.parentNode?.parentNode?.getAttribute("class") == "col movenamecol" || node.parentNode?.getAttribute("name") == "chooseMove") {
        if (node.nodeValue == "Metronome") {
            node.nodeValue = "挥指";
            return;
        } else if (node.nodeValue == "Refresh") {
            node.nodeValue = "焕然一新";
            return;
        } else if (node.nodeValue == "Disable") {
            node.nodeValue = "定身法";
            return;
        } else if (node.nodeValue == "Psychic") {
            node.nodeValue = "精神强念";
            return;
        } else if (node.nodeValue == "National Dex") {
            node.nodeValue = "全国图鉴";
            return;
        } else if (node.nodeValue == "Draft") {
            node.nodeValue = "选秀";
            return;
        }
    }
    if (value.lastIndexOf('!') == 0 || (value.lastIndexOf(')!') == 0)){
        value = value.replace('!', "！");
        node.nodeValue = value;
    }
    if (value.indexOf('•') == 0) {
        value = value.replace('•', "").replace('Metronome', "挥指").replace('Refresh', "焕然一新").replace('Disable', "定身法").replace("Hidden Power 精神强念", "觉醒力量-超能力").replace("强念 Noise", "噪音").replace("强念 Fangs", "之牙").replace("强念 Terrain", "场地").replace('Psychic', "精神强念");
        value = t(value);
        node.nodeValue = "• " + value + " ";
    } else {
        node.nodeValue = t(node.nodeValue.replace("é", "e"));

    }
}

function translateElement(element) {
    if (element.tagName == 'SCRIPT') return;
    var elTW = document.createTreeWalker(element, NodeFilter.SHOW_Element, null, false);
    var node = null;
    if (element.nodeType == 3) {
        translateNode(element)
        return;
    }
    while ((node = elTW.nextNode()) != null) {
        if (node.tagName == 'A') {
            if (
                /^((http|https):\/\/)?((www|play).)?pschina.one.*/i.test(node.href) ||
                /^((http|https):\/\/)?docs.qq.com.*/i.test(node.href) ||
                /^(http:\/\/)?(39\.96\.50\.192|47\.94\.147\.145).*/i.test(node.href) ||
                node.href.endsWith("greasyfork.org/zh-CN/scripts/432623-pschina-server-translation")
            ) {
                node.removeAttribute("rel");
            }
        };
        if (node.nodeType == 3) {
            translateNode(node)
            //node=elTW.previousNode();
            //QQ(t).remove();
        }
    }
}

(function() {
    'use strict';
    const observerCallback = function(mutationsList, observer) {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(node => {
                    translateElement(node);
                });
            }
        }
    };

    const observer = new MutationObserver(observerCallback);

    const config = { childList: true, subtree: true };

    const targetNode = document.querySelector('body');
    if (targetNode) {
        translateElement(targetNode);
        observer.observe(targetNode, config);
    }
})();

(function() {
    'use strict';

    const targetUsername = 'AL'; //
    const customText = '汉化作者 (=)';
    const checkInterval = 5000; //

    function addCustomText() {
        //
        let userNameElements = document.querySelectorAll('.userdetails strong a');
        userNameElements.forEach(function(userNameElement) {
            if (userNameElement.textContent.trim().toUpperCase() === targetUsername.toUpperCase()) {
                //
                let existingCustomText = userNameElement.parentNode.querySelector('small.usergroup.roomgroup');
                if (!existingCustomText) {
                    //
                    let newContentSmall = document.createElement('small');
                    newContentSmall.className = 'usergroup roomgroup'; //
                    newContentSmall.textContent = customText;

                    //
                    newContentSmall.style.display = 'block';
                    newContentSmall.style.marginLeft = '0'; //

                    //
                    let containerDiv = document.createElement('div');
                    containerDiv.style.display = 'inline-block'; //
                    containerDiv.style.verticalAlign = 'top'; //

                    //
                    containerDiv.appendChild(userNameElement.cloneNode(true)); //
                    containerDiv.appendChild(newContentSmall);

                    //
                    userNameElement.parentNode.replaceChild(containerDiv, userNameElement);
                }
            }
        });
    }

    function checkForTargetUser() {
        try {
            addCustomText();
        } catch (e) {
            console.error('Error in adding custom text:', e);
        }
    }

    //
    window.addEventListener('load', checkForTargetUser);

    //
    setInterval(checkForTargetUser, checkInterval);
})();