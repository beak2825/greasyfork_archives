/*******************************************************************************

    locals.js - 搭配用户脚本插件`rally-the-troops 中文化插件`的页面匹配规则, 翻译忽略规则,
                词条库文件
*/
var I18N = {};

I18N.conf = {
    /**
     * 匹配 pathname 页面的正则
     *
     * 注册页面 /signup
     * 导入仓库 /new/import
     * ...
     */
    rePagePath: /^\/($|pax-pamir\/info|pax-pamir|about|forum|public|games|contacts|message|tm|profile|create|join|active|rematch|login|signup|forgot-password)/,

    /**
     * 忽略区域的 class 正则
     *
     * 代码编辑器 内容 代码高亮 CodeMirror
     * 代码高亮 blob-code
     * 仓库名和用户名 repo-and-owner (已知出现在: 应用安装授权页和设置页 选定仓库)
     * 文件,目录位置栏 |js-path-segment|final-path
     * 文件列表 files js-navigation-container js-active-navigation-container
     * 评论内容等 js-comment-body
     * 评论编辑区域 comment-form-textarea
     * 文件搜索模式 js-tree-finder-virtual-filter
     * 仓库文件列表 js-navigation-open Link--primary
     * 快捷键 按键 js-modifier-key
     * 洞察-->流量-->热门内容列表 capped-list-label
     * realease 页面 描述主体 markdown-body my-3
     * f4 my-3
     * 仓库页 用户名/仓库名 标题 AppHeader-globalBar-start 新版全局导航
     * 提交的用户名 commit-author
     * 搜索页 搜索结果 search-match
     */
    reIgnoreClass: /(CodeMirror|blob-code|highlight-.*|repo-and-owner|js-path-segment|final-path|files js-navigation-container|js-comment-body|comment-form-textarea|markdown-title|js-tree-finder-virtual-filter|js-navigation-open Link--primary|js-modifier-key|capped-list-label|blob-code blob-code-inner js-file-line|pl-token|Link--primary no-underline text-bold|markdown-body my-3|f4 my-3|react-code-text|react-file-line|AppHeader-globalBar-start|commit-author|search-match|ChatMessageCell|ChatTimeCell|ChatLoginCell|jOnlineUser|jPlayerInfo)/,
    keyClass: /^18xx\.Games$|^18xx$|^\. Games$|[\u4e00-\u9fa5]+|^4, 3\/5$|^5, 4\/6$|^6, 7\/8$|^, \d+$|^\d\d\.\d\d\.\d\d\d\d$|^\d\d\d\d-\d\d-\d\d, \d\d\:\d\d$/,
    userCompanyClass: /^(,|klingeling|ivaever|weatherlight|gogyes|ID|YST:|FAQ|cutebeast|MadFedor|MadFedor|CountVonBlucher|Skollvaldr|BIG4|B&O|C&O|C&WI|IC\*|GT\*|B&O\*|NYC\*|Player \d+|JonasWZ|Caesling|CommodoreVanDerWin|ventusignis|Raven|Kuchengabel|CommodoreVan\.\.\.)$|^bob$|^Cydore$|^tgoodburn$|^debeerzerker$|^Rooster$/,

    /**
     * 忽略区域的 itemprop 属性正则
     * name 列表页 仓库名
     * author 仓库页 作者名称
     * additionalName 个人主页 附加名称
     */
    reIgnoreItemprop: ['name', 'author', 'additionalName'],
    reIgnorehrefprop: ['#market'],
    /**
     * 忽略区域的 特定元素id 正则
     * offset /blob页面 符号-->引用
     */
    reIgnoreId: ['readme', 'offset', 'breadcrumb', 'file-name-id'],

    /**
     * 忽略区域的 标签 正则
     * /i 规则不区分大小写
     */
    reIgnoreTag: ['CODE', 'SCRIPT', 'STYLE', 'LINK', '', 'MARKED-TEXT', 'PRE', 'KBD'],
    // marked-text --> 文件搜索模式/<user-name>/<repo-name>/find/<branch> 文件列表条目
    // ^script$ --> 避免勿过滤 notifications-list-subscription-form
    // ^pre$ --> 避免勿过滤

};

I18N.zh = {};

I18N.zh["title"] = { // 标题翻译
    "static": { // 静态翻译
        "Pax Pamir Cards": "帕米尔和平卡牌",
        "Pax Pamir Rules": "帕米尔和平规则",
        "Pax Pamir": "帕米尔和平",
    },
    "regexp": [ // 正则翻译
    ],
};

I18N.zh["pubilc"] = { // 公共区域翻译
    "static": { // 静态翻译
        "About": "关于",
        "Forum": "论坛",
        "Tournaments": "锦标赛",
        "Public": "公开",
        "Games": "游戏",
        "Friends": "好友",
        "Inbox": "收件箱",
        "Rally the Troops!": "集结军队！",
        "Join the": "加入",
        "chat!": "聊天！",
        "Pax Pamir": "帕米尔和平",
        "CARD": "卡牌",
        "Go home": "回到主页",
        "Rules": "规则",
        "Player Aid": "玩家提示卡",
        "Cards": "卡牌",
        "Gray": "灰色",
        "Blue": "蓝色",
        "Tan": "棕色",
        "Red": "红色",
        "Black": "黑色",
        "Loading replay...": "正在加载重播...",
        "Active": "活跃",
        "Observer": "旁观",
        "Watch": "观看",
        "Review": "回顾",
        "Join": "加入",
        "1+ moves per day": "每天 1+ 次行动",
        "3+ moves per day": "每天 3+ 次行动",
        "7+ moves per day": "每天 7+ 次行动",
        "3P": "3人",
        "4P": "4人",
        "5P": "5人",
        "2P": "2人",
        "Open": "公开",
        "Players:": "玩家:",
        "Public room": "公开房间",
        "Create a new game": "创建一局新游戏",
        "Registrations": "登记",
        "Recently active": "最近活跃",
        "Recently finished": "最近完成",
        "Created: now": "创建于: 现在",
        "Created: yesterday": "创建于: 昨天",
        "Last move: now": "最近行动: 现在",
        "Last move: yesterday": "最近行动: 昨天",
        "Finished: now": "完成于: 现在",
        "Finished: yesterday": "最近行动: 昨天",
        "Options": "选项",
        "Open hands": "公开手牌",
        "Options: Open hands": "选项: 公开手牌",
        "Result:": "结果:",
        "Scenario": "场景",
        "Scenario:": "场景:",
        "Started": "开始",
        "Moves": "步数",
        "Last move": "最近行动",
        "Rewind": "倒退",
        "Delete": "删除",
        "Start": "开始",

        "Decline": "拒绝",
        "Accept": "接受",
        "Leave": "离开",
        "Kick": "踢出",
        "Play": "游玩",
        "Friends & Enemies": "好友和敌人",
        "Last seen": "上次见到",
        "Subject:": "主题:",
        "Body:": "正文:",
        "Subject": "主题",
        "From": "来自",
        "Date": "日期",
        "Send message": "发送消息",
        "Send Message": "发送消息",
        "No messages.": "没有消息",
        "Outbox": "发件箱",
        "Delete all": "删除全部",
        "To:": "给:",
        "Send": "发送",
        "Signup": "注册",
        "sign up": "注册",
        "Login": "登录",
        "Name or mail:": "名称或邮件:",
        "Password:": "密码:",
        "Forgot password": "忘记密码",
        "Mail:": "邮件:",
        "or": "或",

        "(Blue)": "(蓝色)",
        "(Tan)": "(棕色)",
        "(Gray)": "(灰色)",
        "(Black)": "(黑色)",
        "(Red)": "(红色)",
        "(Yellow)": "(黄色)",
        "": "",
        "": "",
    },
    "regexp": [ // 正则翻译
        /**
           * 匹配时间格式
           *
           * 月 日 或 月 日, 年
           * Mar 19, 2015 – Mar 19, 2016
           * January 26 – March 19
           * March 26
           *
           * 不知道是否稳定, 暂时先试用着. 2016-03-19 20:46:45
           *
           * 更新于 2021-10-04 15:19:18
           * 增加 带介词 on 的格式,on 翻译不体现
           * on Mar 19, 2015
           * on March 26
           *
           * 更新于 2021-10-10 13:44:36
           * on 星期(简写), 月 日 年  // 个人访问令牌 有效期
           * on Tue, Nov 9 2021
           * on Tue Nov 9 2021
           * 2021-10-19 12:04:19 融合更多规则
           *
           * 4 Sep
           * 30 Dec 2020
           *
           * on 4 Sep
           * on 30 Dec 2020
           *
           * 2021-11-22 12:51:57 新增 格式
           *
           * 星期(全称), 月 日, 年 // 仓库-->洞察-->流量 图示标识
           * Sunday, November 14, 2021
           * 
           * Tue Aug 08 2023 07:07:12 
           * 
           * Tip:
           * 正则中的 ?? 前面的字符 重复0次或1次
           * 正则中的 ?: 非捕获符号(即关闭圆括号的捕获能力) 使用方法 (?: 匹配规则) -->该匹配不会被捕获 为 $数字
           */
        [/(?:on |)(?:(\d{1,2}) |)(?:(Sun(?:day)?|Mon(?:day)?|Tue(?:sday)?|Wed(?:nesday)?|Thu(?:rsday)?|Fri(?:day)?|Sat(?:urday)?)(?:,|) |)(?:(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May(?:)??|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)(?:,? |$))(\d{4}|)(\d{1,2}|)(?:,? (\d{4})|)(?:(?:,|) (\d{1,2}:(?:\d{1,2})(?::\d{1,2}|))|)/g, function (all, date1, week, month, year1, date2, year2, time) {
            var weekKey = {
                "Sun": "周日",
                "Mon": "周一",
                "Tue": "周二",
                "Wed": "周三",
                "Thu": "周四",
                "Fri": "周五",
                "Sat": "周六",
            };
            var monthKey = {
                "Jan": "1月",
                "Feb": "2月",
                "Mar": "3月",
                "Apr": "4月",
                "May": "5月",
                "Jun": "6月",
                "Jul": "7月",
                "Aug": "8月",
                "Sep": "9月",
                "Oct": "10月",
                "Nov": "11月",
                "Dec": "12月"
            };
            var date = date1 ? date1 : date2;
            var year = year1 ? year1 : year2;
            return (year ? year + '年' : '') + monthKey[month.substring(0, 3)] + (date ? date + '日' : '') + (week ? ', ' + weekKey[week.substring(0, 3)] : '') + (time ? ', ' + time : '');
        }],
        /**
         * 相对时间格式处理
         *
         * 更新于 2021-11-21 16:47:14
         * 1. 添加 前缀词
         *    over xxx ago // 里程碑页面 最后更新时间
         *    about xxx ago // 里程碑页面 最后更新时间
         *    almost xxx ago // 里程碑页面 最后更新时间
         *    less than xxx ago // 导出帐户数据
         * 2. xxx之内的相对时间格式
         *  in 6 minutes // 拉取请求页面
         *
         * 更新于 2021-11-22 11:54:30
         * 1. 修复 Bug: 意外的扩大了匹配范围(不带前缀与后缀的时间) 干扰了带有相对时间的其他规则
         *  7 months
         */
        // [/^just now|^now|^last month|^yesterday|(?:(over|about|almost|in) |)(^an?|^\d+)(?: |)(second|minute|hour|day|month|year)s?( ago|)/, function (all, prefix, count, unit, suffix) {
        //     if (all === 'now') {
        //         return '现在';
        //     }
        //     if (all === 'just now') {
        //         return '刚刚';
        //     }
        //     if (all === 'last month') {
        //         return '上个月';
        //     }
        //     if (all === 'yesterday') {
        //         return '昨天';
        //     }
        //     if (count[0] === 'a') {
        //         count = '1';
        //     } // a, an 修改为 1

        //     var unitKey = { second: '秒', minute: '分钟', hour: '小时', day: '天', month: '个月', year: '年' };

        //     if (suffix) {
        //         return (prefix === 'about' || prefix === 'almost' ? '大约 ' : prefix === 'less than' ? '不到 ' : '') + count + ' ' + unitKey[unit] + (prefix === 'over' ? '多之前' : '之前');
        //     } else {
        //         return count + ' ' + unitKey[unit] + (prefix === 'in' ? '之内' : '之前');
        //     }
        // }],
        /**
         * 匹配时间格式 2
         *
         * in 5m 20s
         */
        [/^(?:(in) |)(?:(\d+)m |)(\d+)s$/, function (all, prefix, minute, second) {
            all = minute ? minute + '分' + second + '秒' : second + '秒';
            return (prefix ? all + '之内' : all);
        }],
        [/^Showing (\d+.*) to (\d+.*) of (\d+.*) entries$/, "显示 $3 个条目中的 $1 到 $2 个"],
        [/^Showing (\d+.*) to (\d+.*) of (\d+.*) entries \(filtered from (\d+.*) total entries\)$/, "显示 $3 个条目中的 $1 到 $2 个(过滤自共 $4 个条目)"],
        [/^Profile \((.*)\)$/, "简介 ($1)"],
        [/^Games \((\d+)\)$/, "游戏 ($1)"],

        [/^#(\d+) – Pax Pamir \((\d)P\)$/, "#$1 – 帕米尔和平 ($2人)"],
        [/^#(\d+) - Pax Pamir$/, "#$1 - 帕米尔和平"],


        [/^Created: (\d+) minutes? ago$/, "创建于: $1 分钟前"],
        [/^Created: (\d+) hours? ago$/, "创建于: $1 小时前"],
        [/^Created: (\d+) days? ago$/, "创建于: $1 天前"],
        [/^Created: (\d+) weeks? ago$/, "创建于: $1 星期前"],

        [/^Last move: (\d+) minutes? ago$/, "最近行动: $1 分钟前"],
        [/^Last move: (\d+) hours? ago$/, "最近行动: $1 小时前"],
        [/^Last move: (\d+) days? ago$/, "最近行动: $1 天前"],
        [/^Last move: (\d+) weeks? ago$/, "最近行动: $1 星期前"],

        [/^Finished: (\d+) minutes? ago$/, "完成于: $1 分钟前"],
        [/^Finished: (\d+) hours? ago$/, "完成于: $1 小时前"],
        [/^Finished: (\d+) days? ago$/, "完成于: $1 天前"],
        [/^Finished: (\d+) weeks? ago$/, "完成于: $1 星期前"],
    ],
    "time-regexp": [ // 时间正则翻译专项
        /**
         * 匹配时间格式
         *
         * 月 日 或 月 日, 年
         * Mar 19, 2015 – Mar 19, 2016
         * January 26 – March 19
         * March 26
         *
         * 不知道是否稳定, 暂时先试用着. 2016-03-19 20:46:45
         *
         * 更新于 2021-10-04 15:19:18
         * 增加 带介词 on 的格式,on 翻译不体现
         * on Mar 19, 2015
         * on March 26
         *
         * 更新于 2021-10-10 13:44:36
         * on 星期(简写), 月 日 年  // 个人访问令牌 有效期
         * on Tue, Nov 9 2021
         *
         * 2021-10-19 12:04:19 融合更多规则
         *
         * 4 Sep
         * 30 Dec 2020
         *
         * on 4 Sep
         * on 30 Dec 2020
         *
         * 2021-11-22 12:51:57 新增 格式
         *
         * 星期(全称), 月 日, 年 // 仓库-->洞察-->流量 图示标识
         * Sunday, November 14, 2021
         *
         * Tip:
         * 正则中的 ?? 前面的字符 重复0次或1次
         * 正则中的 ?: 非捕获符号(即关闭圆括号的捕获能力) 使用方法 (?: 匹配规则) -->该匹配不会被捕获 为 $数字
         */
        [/(?:on |)(?:(\d{1,2}) |)(?:(Sun(?:day)?|Mon(?:day)?|Tue(?:sday)?|Wed(?:nesday)?|Thu(?:rsday)?|Fri(?:day)?|Sat(?:urday)?)(?:,|) |)(?:(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May(?:)??|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)(?:,? |$))(\d{4}|)(\d{1,2}|)(?:,? (\d{4})|)/g, function (all, date1, week, month, year1, date2, year2) {
            var weekKey = {
                "Sun": "周日",
                "Mon": "周一",
                "Tue": "周二",
                "Wed": "周三",
                "Thu": "周四",
                "Fri": "周五",
                "Sat": "周六",
            };
            var monthKey = {
                "Jan": "1月",
                "Feb": "2月",
                "Mar": "3月",
                "Apr": "4月",
                "May": "5月",
                "Jun": "6月",
                "Jul": "7月",
                "Aug": "8月",
                "Sep": "9月",
                "Oct": "10月",
                "Nov": "11月",
                "Dec": "12月"
            };
            var date = date1 ? date1 : date2;
            var year = year1 ? year1 : year2;
            return (year ? year + '年' : '') + monthKey[month.substring(0, 3)] + (date ? date + '日' : '') + (week ? ', ' + weekKey[week.substring(0, 3)] : '');
        }],
        /**
         * 相对时间格式处理
         *
         * 更新于 2021-11-21 16:47:14
         * 1. 添加 前缀词
         *    over xxx ago // 里程碑页面 最后更新时间
         *    about xxx ago // 里程碑页面 最后更新时间
         *    almost xxx ago // 里程碑页面 最后更新时间
         *    less than xxx ago // 导出帐户数据
         * 2. xxx之内的相对时间格式
         *  in 6 minutes // 拉取请求页面
         *
         * 更新于 2021-11-22 11:54:30
         * 1. 修复 Bug: 意外的扩大了匹配范围(不带前缀与后缀的时间) 干扰了带有相对时间的其他规则
         *  7 months
         */
        [/^just now|^now|^last year|^last month|^last week|^yesterday|(?:(over|about|almost|in) |)(an?|\d+)(?: |)(second|minute|hour|day|month|year|week)s?( ago|)/, function (all, prefix, count, unit, suffix) {
            if (all === 'now') {
                return '现在';
            }
            if (all === 'just now') {
                return '刚刚';
            }
            if (all === 'last year') {
                return '最近 1 年';
            }
            if (all === 'last month') {
                return '上个月';
            }
            if (all === 'last week') {
                return '上周';
            }
            if (all === 'yesterday') {
                return '昨天';
            }
            if (count[0] === 'a') {
                count = '1';
            } // a, an 修改为 1

            var unitKey = { second: '秒', minute: '分钟', hour: '小时', day: '天', month: '个月', year: '年', week: '周' };

            if (suffix) {
                return (prefix === 'about' || prefix === 'almost' ? '大约 ' : prefix === 'less than' ? '不到 ' : '') + count + ' ' + unitKey[unit] + (prefix === 'over' ? '多之前' : '之前');
            } else {
                return count + ' ' + unitKey[unit] + (prefix === 'in' ? '之内' : '之前');
            }
        }],
        [/(\d+)(h|d|w|m)/, function (all, count, suffix) {
            var suffixKey = { h: '小时', d: '天', w: '周', m: '个月' };

            return count + ' ' + suffixKey[suffix] + '之前';
        }],
    ],
    "selector": [ // 元素筛选器规则
    ],
};

I18N.zh["homepage"] = { // homepage页面翻译
    "static": { // 静态翻译
        ...I18N.zh["pubilc"]["static"],
    },
    "regexp": [ // 正则翻译
        ...I18N.zh["pubilc"]["regexp"],
    ],
};

I18N.zh["about"] = { // about页面翻译
    "static": { // 静态翻译
        ...I18N.zh["pubilc"]["static"],
        "Here you can play board games online with other players. You can invite your friends, compete in tournaments, or look in the public room to see whether someone wants to play. Your opponents don't have to be online, but if they are you can play live.": "在这里, 你可以与其他玩家在线玩桌面游戏。您可以邀请朋友、参加锦标赛或查看公共房间是否有人想玩。你的对手不必在线, 但如果他们在线, 您可以实时游玩。",
        "Registration and use is free, and there are no ads.": "注册和使用是免费的, 没有广告。",
        "Discord": "Discord",
        "Read the": "参阅",
        "Tips & Tricks": "提示 & 技巧",
        "before playing!": "在开始之前！",
        "tournament information": "锦标赛信息",
        "before joining a tournament.": "在参加锦标赛之前。",
        "Study the": "研究",
        "developer documentation": "开发人员文档",
        "if you want to create modules.": "如果你想要创建模组。",
        "The source code is available on": "源代码开源位于",
        "git.rally-the-troops.com": "",
        ".": "。",
        "Imprint": "版本说明",
        "This website is operated by Tor Andersson, Västra Stationstorget 12, 22237 Lund, Sweden.": "本网站由Tor Andersson运营, 地址为瑞典隆德市西车站街12号, 邮编 22237。",
        "E-mail: support@rally-the-troops.com": "电子邮件: support@rally-the-troops.com",
        "Privacy policy": "隐私政策",
        "When you create an account we collect the following personal information:": "当你创建帐户时, 我们会收集以下个人信息:",
        "E-mail addresses in order to send password reset emails and notifications.": "用于发送密码重置电子邮件和通知的电子邮件地址。",
        "IP addresses to prevent malicious behavior.": "防止恶意行为的IP地址。",
        "Your messages and forum posts.": "你的消息和论坛帖子。",
        "Your game activity.": "你的游戏活动。",
        "Your personal data will be removed if you delete your account.": "如果你删除帐户, 你的个人数据将被删除。",
        "Licensing": "许可",
        "All games are used with consent from their respective rights holders.": "所有游戏均经其各自权利人同意使用。",
        "Icons are sourced from": "图标来源于",
        "game-icons.net": "game-icons.net",
        "by Delapouite, Lorc, and others under the": "由 Delapouite, Lorc, 和其他人根据",
        "CC BY 3.0": "CC BY 3.0",
        "license.": "许可证提供。",
        "Other images and graphics are sourced from": "其他图像和图形来源于",
        "Wikimedia Commons": "维基共享资源",
    },
    "regexp": [ // 正则翻译
        ...I18N.zh["pubilc"]["regexp"],
    ],
};

I18N.zh["forum"] = { // forum页面翻译
    "static": { // 静态翻译
        ...I18N.zh["pubilc"]["static"],

        "Search...": "搜索...",
        "New thread": "新话题",
        "New Thread": "新话题",
        "If you are reporting a problem, you MUST include the game number!": "如果你要报告问题, 则必须包含游戏编号！",
        "Submit": "提交",
        "": "",
        "": "",
        "": "",
        "": "",
    },
    "regexp": [ // 正则翻译
        ...I18N.zh["pubilc"]["regexp"],
    ],
};

I18N.zh["public"] = { // public页面翻译
    "static": { // 静态翻译
        ...I18N.zh["pubilc"]["static"],
    },
    "regexp": [ // 正则翻译
        ...I18N.zh["pubilc"]["regexp"],
    ],
};

I18N.zh["games"] = { // games 页面翻译
    "static": { // 静态翻译
        ...I18N.zh["pubilc"]["static"],
        "Your games": "你的游戏",
        "Join a tournament": "加入一场锦标赛",
        "Move": "行动",
        "Play": "游玩",
        "All your finished games": "所有你已完成的游戏",
        "All your finished tournaments": "所有你已完成的锦标赛",
    },
    "regexp": [ // 正则翻译
        ...I18N.zh["pubilc"]["regexp"],
    ],
};

I18N.zh["tm"] = { // tm 页面翻译
    "static": { // 静态翻译
        ...I18N.zh["pubilc"]["static"],
        "See": "参见",
        "tournament information": "锦标赛信息",
        ".": "。",
        "Mini Cup": "迷你杯",
    },
    "regexp": [ // 正则翻译
        ...I18N.zh["pubilc"]["regexp"],
    ],
};

I18N.zh["contacts"] = { // tm 页面翻译
    "static": { // 静态翻译
        ...I18N.zh["pubilc"]["static"],
    },
    "regexp": [ // 正则翻译
        ...I18N.zh["pubilc"]["regexp"],
    ],
};

I18N.zh["message"] = { // tm 页面翻译
    "static": { // 静态翻译
        ...I18N.zh["pubilc"]["static"],
    },
    "regexp": [ // 正则翻译
        ...I18N.zh["pubilc"]["regexp"],
    ],
};

I18N.zh["login"] = { // tm 页面翻译
    "static": { // 静态翻译
        ...I18N.zh["pubilc"]["static"],
    },
    "regexp": [ // 正则翻译
        ...I18N.zh["pubilc"]["regexp"],
    ],
};

I18N.zh["signup"] = { // tm 页面翻译
    "static": { // 静态翻译
        ...I18N.zh["pubilc"]["static"],
        "You need to sign up for a free account to play games on Rally the Troops!": "你需要注册一个免费帐户才能在 集结军队！上玩游戏。",
        "Name:": "名称:",
        "How you will be known to other players.": "其他玩家将如何认识你。",
        "You can change your user name at any time.": "你可以随时更改用户名。",
        "Your mail address is only used for game notifications and password recovery.": "你的邮件地址仅用于游戏通知和密码恢复。",
        "It will not be visible to other players.": "其他玩家无法查看。",
        "Enable mail notifications": "启用邮件通知",
        "(when it is your turn, your games are ready to start, etc.)": "(轮到你的时候, 当你的游戏准备好开始时, 等等。)",
        "Create account": "创建帐户",
    },
    "regexp": [ // 正则翻译
        ...I18N.zh["pubilc"]["regexp"],
    ],
};

I18N.zh["forgot-password"] = { // tm 页面翻译
    "static": { // 静态翻译
        ...I18N.zh["pubilc"]["static"],
    },
    "regexp": [ // 正则翻译
        ...I18N.zh["pubilc"]["regexp"],
    ],
};

I18N.zh["profile"] = { // tm 页面翻译
    "static": { // 静态翻译
        ...I18N.zh["pubilc"]["static"],
        "Disable mail notifications": "禁用邮件通知",
        "Enable mail notifications": "启用邮件通知",
        "Change password": "更改密码",
        "Change mail address": "更改邮件地址",
        "Change user name": "更改用户名",
        "Change profile text": "更改简介文本",
        "Delete account": "删除账户",
        "Configure webhook": "配置 webhook",
        "Logout": "登出",
    },
    "regexp": [ // 正则翻译
        ...I18N.zh["pubilc"]["regexp"],
        [/^Welcome, (.*)!$/, "欢迎, $1！"],
        [/^Your mail address is (.*)$/, "您的邮件地址是 $1"],
    ],
};

I18N.zh["rematch"] = { // tm 页面翻译
    "static": { // 静态翻译
        ...I18N.zh["pubilc"]["static"],
    },
    "regexp": [ // 正则翻译
        ...I18N.zh["pubilc"]["regexp"],
    ],
};

I18N.zh["create"] = { // create 页面翻译
    "static": { // 静态翻译
        ...I18N.zh["pubilc"]["static"],
        "Open hands.": "公开手牌。",
        "The seating order is determined by color. If you want random seating you must enable random player roles.": "座位顺序由颜色决定。如果你想要随机座位，你必须启用随机玩家角色。",
        "Notice:": "注意:",
        "What are you looking for?": "你在寻找什么？",
        "Pace:": "速度:",
        "No time control": "无时间控制",
        "⚡ 7+ moves per day": "⚡ 每天 7+ 次行动",
        "🏁 3+ moves per day": "🏁 每天 3+ 次行动",
        "🐌 1+ moves per day": "🐌 每天 1+ 次行动",
        "Random player roles": "随机玩家角色",
        "Private": "私人",
        "Create": "创建",
        "to play.": "以游玩。",
        "You are not logged in!": "你尚未登录！",
        "": "",
        "": "",
        "": "",
    },
    "regexp": [ // 正则翻译
        ...I18N.zh["pubilc"]["regexp"],
    ],
};

I18N.zh["join"] = { // join 页面翻译
    "static": { // 静态翻译
        ...I18N.zh["pubilc"]["static"],
        "Invite a friend:": "邀请朋友:",
        "Invite": "邀请",
        "Cancel": "取消",
        "Waiting for players to join.": "正在等待玩家加入。",
        "Notice": "通知",
        "Created": "创建于",
        "now by": "现在由",
        "Random 1": "",
        "seen 24 minutes ago": "",
        "Random 2": "",
    },
    "regexp": [ // 正则翻译
        ...I18N.zh["pubilc"]["regexp"],
        [/Random (\d+)/, "随机 $1"],
    ],
};

I18N.zh["active"] = { // active 页面翻译
    "static": { // 静态翻译
        ...I18N.zh["pubilc"]["static"],

    },
    "regexp": [ // 正则翻译
        ...I18N.zh["pubilc"]["regexp"],
    ],
};

I18N.zh["pax-pamir/info"] = { // pax-pamir/info 页面翻译
    "static": { // 静态翻译
        ...I18N.zh["pubilc"]["static"],
        //规则页
        "Pax Pamir: Second Edition": "帕米尔和平: 第二版",
        "Rules of Play": "游戏规则",
        "In Pax Pamir, each player assumes the role of a nine-": "在帕米尔和平中, 每位玩家会扮演一位十九",
        "teenth-century Afghan leader attempting to forge a": "世纪的阿富汗领袖, 试图在杜兰尼帝国崩溃",
        "new state after the collapse of the Durrani Empire.": "后打造一个新的国家。西方史常称呼该时",
        "Western histories often call this period “The Great": "期为 “大博弈” (The Great Game) 时期,",
        "Game” because of the role played by the Europeans": "是由于欧洲人企图利用中亚地区来作为他",
        "who attempted to use Central Asia as a theater for their": "们展开竞赛的舞台。在这款游戏中, 仅选取",
        "own rivalries. In this game, those empires are viewed": "了阿富汗人的视角对这些欧洲帝国进行审",
        "strictly from the perspective of the Afghans who sought": "视, 而这些阿富汗人为了各自的目的, 试图",
        "to manipulate the interloping": "操纵那些入侵的外国人",
        "ferengi": "(ferengi)",
        "(foreigners) for": "。",
        "their own purposes.": "\u200b",
        "Russian": "俄国",
        "British": "英国",
        "Afghan": "阿富汗",
        "Transcaspia": "特兰斯卡斯皮亚",
        "Herat": "赫拉特",
        "Persia": "波斯",
        "Kabul": "喀布尔",
        "Kandahar": "坎大哈",
        "Punjab": "旁遮普",
        "Events": "事件",
        "Dominance Checks": "优势检定",

        "In terms of gameplay, Pax Pamir is a pretty straightfor-": "游戏玩法上, 帕米尔和平是一款相当直接的",
        "ward tableau builder. Players will spend most of their": "卡牌构筑游戏。玩家会用自己的大部分回合",
        "turns purchasing cards from a central market and then": "从中央市场购买卡牌, 然后在自己面前打出",
        "playing those cards in front of them in a single row": "这些卡牌, 构成一行, 称为朝廷。打出卡牌",
        "called a court. Playing cards adds units to the game’s": "会将各种单位添加到游戏地图上, 还会给予",
        "map and grants access to additional actions that can be": "你使用额外的行动的机会, 些行动能让你扰",
        "taken to disrupt other players and influence the course": "乱其他玩家以及影响游戏进程。最后还有",
        "of the game. That last point is worth emphasizing.": "一点值得强调, 尽管每个人都在构建自己的",
        "Though everyone is building their own row of cards,": "朝廷, 但游戏中提供了许多直接与间接的方",
        "the game offers many ways for players to interfere with": "式供玩家之间互动。",
        "each other, both directly and indirectly.": "\u200b",

        "To survive, players will organize into coalitions. In the": "要生存下来, 玩家们必须加入某个阵营。游",
        "game, these coalitions are identified chiefly by their": "戏中, 这些阵营主要通过其支持者来区分。",
        "sponsors. Two of the coalitions (British and Russian)": "其中两个阵营 (英国与俄国) 是由欧洲政权",
        "are supported by European powers. The third coalition": "支持。而第三个阵营 (阿富汗) 则是由地方",
        "(Afghan) is backed by nativist elements who want to": "主义者支持, 这些地方主义者希望终结欧洲",
        "end European involvement in the region.": "人对该地区的入侵。",

        "Throughout the game, the different coalitions will": "整局游戏中, 每当被称为优势检定的特殊",
        "be evaluated when a special event card, called a": "事件卡被结算时, 就需要对这些阵营进行",
        "Dominance Check, is resolved. If a single coalition": "评定。如果其中一个阵营在一次评定中",
        "has a commanding lead during one of these checks,": "遥遥领先, 则所有效忠该阵营的玩家, 都",
        "players loyal to that coalition will receive victory points": "将根据其在该阵营的影响力获得分数。",
        "based on their influence in that coalition. However, if": "然而如果阿富汗地区在一次评定中仍然",
        "Afghanistan remains fragmented during one of these": "保持分裂, 则玩家会根据各自的个人实力",
        "checks, players instead will receive victory points based": "来获得分数。",
        "on their personal power base.": "\u200b",

        "Favored Suit Marker": "优势花色标记",
        "Loyalty Dial and Player": "每种玩家颜色各有一套的",
        "Board in each player color": "效忠圆盘以及玩家面板",
        "Ruler Tokens": "统治标记",
        "Components": "游戏配件",
        "The Map": "地图",

        "The map consists of six regions. There is no limit to the": "地图包含六个地区。在地区或边界上,",
        "number of pieces that can be placed on a specific region": "可放置的物件数量是没有限制的, 而且",
        "or border, and pieces belonging to different players and": "属于不同玩家以及不同阵营的物件可",
        "coalitions can occupy the same region or border. The": "以放置在同一个地区或边界上。地图",
        "map is bordered by a victory point track and spaces to": "的边缘是分数轨以及标记优势花色的",
        "mark the favored suit.": "位置。",

        "Coalition Blocks (36)": "阵营长方体 (36个)",
        "Each coalition has twelve blocks in its color. What a": "每个阵营都拥有自己颜色的 12 个长方体标记。一",
        "block represents depends on where it is placed. A block": "个长方体标记代表何物, 由其放置的位置决定。放",
        "placed in a region is called an": "置在地区内的长方体标记, 被称为",
        "army": "军队",
        ". If placed on a bor-": "。如果放置",
        "der, the block is called a": "在边界上, 则该长方体标记被称为",
        "road": "道路",
        "(it helps to set roads on": "(作为道路",
        "their side to make them stand out at a glance).": "时将其侧躺放置可以更一目了然)。",

        "In general, coalition blocks only help players who are": "通常来说, 某个阵营的长方体标记只会帮助当前效",
        "currently loyal to that coalition. So, even if you helped": "忠于该阵营的玩家。因此, 即使你帮助建立了军队,",
        "raise the army, your soldiers will not follow you if you": "但如果你之后选择改变了你所效忠的阵营, 你的士",
        "change your loyalty.": "兵也不会追随你。",

        "Cylinders (55)": "圆柱体标记 (55个)",

        "Each player has eleven cylinders in their color. The cylin-": "每位玩家拥有 11 个自己颜色的圆柱体标记。",
        "der with the gold design is used to track victory points.": "带有金色花纹图案的圆柱体标记用于计分。",
        "The remaining cylinders represent different things": "其余的圆柱体标记代表何物, 由其放置的位",
        "based on where they are placed. A cylinder placed in a": "置决定。放置在地区内的圆柱体标记, 被称",
        "region is called a": "为",

        "tribe": "部落",
        ". If placed on a card in a player’s": "。如果放置在某位玩家朝廷的卡牌",
        "court, the cylinder is called a": "上, 则该圆柱体标记被称为",
        "spy": "间谍",
        "Unlike coalition pieces, cylinders will always be on your": "与阵营长方体标记不同的是, 即使你改变效",
        "side, even if you change loyalty.": "忠阵营, 圆柱体标记也总是站在你这边。",
        "Money Supply (36)": "钱币 (36枚)",

        "There are 36 coins in the game. Each is worth a single": "游戏中有 36 枚钱币。每一枚都代表 1 卢比。",
        "rupee. Unlike other components in the game, there is": "与游戏中其他配件不同的是, 钱币数量没有",
        "no hard limit to the number of coins, but it is very rare": "严格限制, 如有需要可以使用替代物, 但只有",
        "to need additional coins. In Pax Pamir, rupees represent": "极少的情况需要额外的钱币。帕米尔和平中,",
        "political capital. During this time, political capital was": " 卢比代表了政治资本。在这个时代中, 政治",
        "largely a zero sum game, and that is true as well in Pax": "资本是一场大型的零和游戏, 在帕米尔和平",
        "Pamir.": "的游戏中, 这也同样适用。",

        "Other Pieces": "其他物件",
        "A variety of other playing pieces perform various func-": "在整个游戏中, 还有以下各具功能的游戏物件,",
        "tions throughout the game, including ruler tokens, play-": "其中包括统治标记, 玩家面板, 效忠圆盘, 以及",
        "er boards, loyalty dials, and the favored suit marker.": "优势花色标记。",
        "Armies are placed": "地区中竖立放置的",
        "upright in regions.": "军队。",
        "Roads are placed": "边界上侧躺",
        "sideways on": "放置的",
        "borders.": "道路。",
        "Cards (142)": "卡牌 (142张)",
        "There are three types of cards in Pax Pamir: event cards (16), court cards (100), and Wakhan cards": "帕米尔和平中有三种卡牌类型: 事件卡 (16 张), 朝廷卡 (100 张), 以及瓦罕卡",
        "(24 AI and 2 aid).": "(24 张 AI 卡以及 2 张提示卡)",

        "Event cards are fairly straightforward. Each has two ef-": "事件卡相当简单易懂。每张卡牌有两",
        "fects. The bottom effect is triggered if it is purchased by": "个效果。底部效果会由玩家购买此卡",
        "a player. The top effect is triggered if the card is auto-": "牌时触发。顶部效果会在某位玩家回",
        "matically discarded during the cleanup phase at the end": "合的清理阶段, 此卡牌被自动弃置时触",
        "of a player’s turn. Players should note that four of these": "发。玩家应注意这些事件卡其中 4 张",
        "event cards feature the same picture of the throne room": "均带有相同的巴拉希萨尔觐见室图案;",
        "of the Bala Hissar; these are special event cards called": "这些卡牌是被称为优势检定的特殊事",
        "Dominance Checks that determine when and how victo-": "件卡, 会确定何时以及通过何种方式",
        "ry points are awarded.": "获得分数。",

        "The vast majority of the cards in the game are called": "游戏中的大部分卡牌都是朝廷卡。朝",
        "court cards. Court cards hold a lot of information and": "廷卡带有许多信息, 在进行帕米尔和",
        "understanding them is critical to playing Pax Pamir.": "平的游戏时, 理解它们的意义至关重",
        "Their anatomy is described below.": "要。这些卡牌会在下文进行解析。",

        "Wakhan AI cards are used only when playing with": "瓦罕 AI 卡只会在与瓦罕 (参阅第 16 页)",
        "Wakhan (page 16). Wakhan aid cards are used to store": "进行游戏时使用。瓦罕提示卡用于存放",
        "her gifts and provide reminders about important rules.": "她的礼物以及提示重要规则。",
        "Patriot": "爱国者",
        "(colored bar)": "(彩色条)",
        "Special Ability": "特殊能力",
        "Prize": "战利品",
        "Region": "地区",
        "Suit and": "花色与",
        "Rank": "等级",
        "Card-based": "卡牌提供的",
        "Action(s)": "行动",
        "Impact": "影响",
        "Icons": "图标",
        "Core Anatomy": "核心解析",
        "All court cards have these features.": "所有朝廷卡都有拥有这些特征。",
        "Advanced Anatomy": "进阶解析",
        "Some court cards have these features.": "部分朝廷卡都有拥有这些特征。",
        "Patriots": "爱国者",
        "Some court cards hold strong opinions.": "某些朝廷卡阵营立场坚定。",
        "Wakhan Cards": "瓦罕卡",
        "Ignore these cards unless you are": "除非你要与虚拟对手瓦罕进行游戏 ,",
        "playing with Wakhan.": "否则忽略这些卡牌。",

        "Patriots will only": "爱国者只在你所效忠的",
        "serve in your court if": "阵营与其自身的立场一",
        "your loyalties align!": "致时才为你的朝廷服务！",

        "Setup": "游戏设置",
        "Starting Favored Suit": "起始优势花色",

        "Pax Pamir begins in a period of great political upheaval. Ayub Shah, the last of the Durrani em-": "帕米尔和平始于巨大的政治动荡时期。杜兰尼王朝最后一位皇",
        "perors, has just been deposed. A region once unified is now on the verge of total collapse, and": "帝阿尤布·沙阿遭到废黜。曾经统一的地区现在正处于全面崩",
        "local authorities are taking the initiative.": "溃的边缘, 地方势力蠢蠢欲动。",

        "To represent this political climate, place the favored suit marker on the": "为了代表这样的政治环境, 将优势花色标记放置在政治花色旁",
        "space next to the political suit.": "的位置。",
        "Build the Draw Deck": "构建牌库",
        "March": "行军",
        "Build the draw deck using the following steps:": "按以下步骤构建牌库:",
        "Separate the court cards and the event cards.": "将朝廷卡与事件卡分类。",
        "Shuffle the court cards. Create six face-down piles of court cards, each consist-": "洗混朝廷卡。创建六个面朝下的朝廷卡牌堆, 使每个牌堆包含的",
        "ing of five cards, plus one card per player. The remaining court cards will not be": "卡牌数量分别为玩家人数加 5, 并将这些牌堆排成一行。剩余",
        "used this game.": "的朝廷卡本局游戏中不会用到。",
        "Remove the four Dominance Check event cards from the other event cards.": "从事件卡中找出 4 张优势检定事件卡。将这 4 张卡放置在最右",
        "Place one in each of the four rightmost piles.": "侧的四个牌堆中, 每个牌堆各放置 1 张。",
        "Shuffle the remaining event cards. Place two in the second pile from the left and": "洗混剩余的事件卡。按从左往右的顺序, 在第二个牌堆放置 2 张,",
        "one in each of the remaining four piles to its right. The six remaining event cards": "在最右侧的四个牌堆中各放置 1 张。剩下的 6 张事件卡本局",
        "will not be used this game.": "游戏中不会用到。",
        "Finally, separately shuffle each of the six piles. Then, stack the piles one on top": "最后, 将六个牌堆分别洗混。然后将牌堆依次堆叠起来, 让包含",
        "of the other, so that the four piles containing the Dominance Check event cards": "优势检定事件卡的四个牌堆位于牌库底部。不要洗混已经堆",
        "are on the bottom of the deck. Do not shuffle this combined deck.": "叠好的牌库。",
        "Create the Market": "创建市场",

        "In Pax Pamir, cards enter play through a market. The market is an array of 12 face-up cards, ar-": "帕米尔和平中, 卡牌通过市场进入游戏。市场是一个由12张面朝上",
        "ranged in a grid of two rows and six columns. During setup, create this market by drawing cards": "卡牌组成的阵列, 分为两行与六列。在游戏设置中, 从最左列开始,",
        "from the draw deck and filling each market column (top row first), starting with the leftmost": "通过从牌库中摸牌依次填满市场的每一列 (优先顶部行) 来创建市",
        "column. Then place the draw deck to the right of the market.": "场。然后将牌库放置在市场的右侧。",

        "Take Player Pieces": "拿取玩家物件",
        "Give each player a set of eleven cylinders, one loyalty dial, a player board, and four rupees. Place": "给每位玩家一套物件, 包括 11 个圆柱体标记, 1 个效忠圆盘, 1 张玩",
        "one cylinder from each player on the zero space of the victory point track and the rest on each": "家面板, 以及 4 卢比。每位玩家各将 1 个圆柱体标记放置在分数轨",
        "player’s player board.": "的 0 分位置, 并将剩余的圆柱体标记放置在各自的玩家面板上。",
        "Bank and Coalition Blocks": "银行与阵营长方体标记",
        "Place the remaining coins and the tray of coalition blocks near the area of play.": "将剩余钱币与装有阵营长方体标记的塑料盒放置在游戏区域旁。",
        "Starting Loyalty": "初始效忠对象",

        "Starting with a random player and proceeding clockwise, each player adjusts their loyalty dial to": "由随机一位玩家开始, 按照顺时针方向, 每位玩家任选一个阵营作为效忠对象, 并",
        "indicate the loyalty they have chosen. After the last player has chosen their starting loyalty, that": "将自己的效忠圆盘调整到显示该阵营的位置。在末位玩家选择了自己的初始效忠",
        "player will take the first turn.": "对象后, 由该玩家进行首个回合。",
        "The game is now ready to play.": "游戏现在可以开始了。",

        "To use Wakhan, the automated opponent,": "在一或两人游戏中, 要使用",
        "with either one or two human players,": "瓦罕作为对手的话, 请参阅",
        "consult the rules on page 16.": "第 16 页规则。",

        "Discard": "弃",
        "Pile": "牌堆",
        "Draw": "牌",
        "Deck": "库",
        "x12": "x12",
        "Future Court": "预留打出朝廷卡的位置",
        "EXAMPLE THREE PLAYER TABLE LAYOUT": "三人游戏桌面示例",
        "DECK CONSTRUCTION AT A GLANCE": "牌库构建一览",
        "n": "n",
        "D": "D",
        "E": "E",

        "After building each pile, separately shuffle": "构筑完每个牌堆后, 分别洗",
        "each of the six piles. Then, stack the piles": "混这六个牌堆。然后将牌",
        "one on top of the other, so that the four piles": "堆依次堆叠起来, 让包含优",
        "containing the Dominance Check event": "势检定事件卡的四个牌堆",
        "cards are on the bottom of the deck.": "位于牌库底部。",

        "Top of": "顶部",
        "Dominance Check Event Card": "优势检定事件卡",
        "Other Event Card": "其他事件卡",
        "Court Card Piles": "朝廷卡牌堆",
        "(n=number of players)": "(n=玩家人数)",
        "Key Terms and Concepts": "关键术语与概念",
        "The Four Suits": "四种花色",

        "The vast majority of the cards in Pax Pamir are divided into four suits that each correspond to": "帕米尔和平中的绝大部分卡牌被分为四种花色, 这些花色分别对应了四种",
        "a different mode of power: economic, military, political, and intelligence. Each suit has its own": "不同类型的能力: 经济、军事、政治, 以及情报。每种花色拥有自己的优",
        "advantages. Generally speaking...": "势。通常来说……",

        "Your Court": "你的朝廷",

        "Each player is associated with a single row of cards called a court. Players begin the game with-": "每个玩家打出的卡牌在面前排成一行被称为朝廷。游戏开始时玩",
        "out any cards in their court, but will gradually add cards to and remove cards from their court": "家的朝廷没有任何卡牌, 但游戏过程中玩家会逐渐向自己的朝廷",
        "over the course of the game. Cards in a court": "添加卡牌以及从中移除卡牌。位于朝廷的卡牌",
        "cannot": "不能",
        "be freely rearranged. While your court can": "自由调整位",
        "grow to any size during your turn, during cleanup you must discard cards from your court so": "置。在你的回合中, 你的朝廷可以扩张到任意规模, 但在清理阶段",
        "that you do not have more court cards than three plus the sum of purple stars on cards in your": "中你必须从你的朝廷弃置卡牌, 让其中的卡牌数量不大于你朝廷",
        "court.": "内所有卡牌上的紫星总数加3。",

        "Your Hand": "你的手牌",
        "Each player is associated with a hand of cards. While your hand can grow to any size during": "每位玩家都拥有手牌。在你的回合中, 你的手牌没有上限, 但在清理阶段",
        "your turn, during cleanup you must discard cards from your hand so that you do not have more": "中你必须从你的手牌中弃置卡牌, 使得你的手牌数量不大于你朝廷内所有",
        "hand cards than two plus the sum of blue stars on cards in your court.": "卡牌上的蓝星总数加2。",
        "Rank and Privilege": "等级与特权",

        "Each court card has a rank from one to three stars. Rank has two important": "每张朝廷卡都带有用一至三颗星来表示的等级。等",
        "consequences. First, a card’s rank determines the strength of some of its": "级有两个重要的概念。首先, 卡牌的等级决定了卡",
        "actions. These actions feature additional symbols to help players remember": "牌部分行动的强度。这些行动带有额外的符号来帮",
        "which actions depend on rank. Second, a card’s rank is also added to your": "助玩家记忆哪些行动与等级相关。其次, 卡牌等级",
        "total stars in a specific suit. Each sum of stars in a suit expands an important": "还会为你增加特定花色的总星数。每种花色的总星",
        "privilege, as indicated here:": "数分别会扩展一种重要的特权, 如下所示:",

        "Economic Stars": "经济星数",
        "prevent your rupees": "会在征税时保",
        "from being taxed.": "护你的卢比。",

        "Military Stars serve": "军事星数分会在最终",
        "as a final score": "计平手时用于",
        "tie-breaker.": "判定胜负。",

        "Political Stars enable": "政治星数让你维持",
        "you to maintain a": "一个规模更大",
        "larger court.": "的朝廷。",

        "Intelligence Stars": "情报星数",
        "allow you to hold more": "使你可以持有更",
        "cards in your hand.": "多的手牌。",
        "one": "一",
        "three": "三",

        "The military suit commands": "军事花色指挥军队,",
        "armies and helps secure a coali-": "并帮助确保阵营的",
        "tion’s dominance.": "优势。",

        "The intelligence suit grants": "情报花色提供外交",
        "diplomatic flexibility and": "上的灵活性, 并拥",
        "the ability to compromise": "有让敌人妥协的能",
        "enemies.": "力。",

        "The political suit consoli-": "政治花色巩固政",
        "dates power and controls": "权, 并能控制哪",
        "which cards are able to be": "些卡牌能够被打",
        "played.": "出。",

        "The economic suit controls the": "经济花色操控卢比的流动",
        "flow of rupees and the movement": "以及物件的移动。它也能",
        "of pieces. It also protects wealth": "在征税时对你的钱币提供",
        "from taxation in the game.": "保护。",

        "The Favored Suit": "优势花色",

        "One suit is always considered favored. This suit determines which cards take": "总是有一种花色处于优势。处于优势的花色确定了哪些卡牌能执",
        "bonus actions (page 12) and may make cards more expensive (page 10).": "行奖励行动 (第 12 页) 并有可能让卡牌变得更昂贵 (第 10 页)。",
        "The favored suit changes when certain cards are played (page 11).": "当特定卡牌打出时, 优势花色将会改变 (第 11 页 )。",

        "Loyalty and Influence": "效忠与影响力",

        "Players in Pax Pamir are always loyal to one of three coalitions: British (pink),": "帕米尔和平中, 玩家总是效忠于三个阵营的其中之一: 英国 (粉色)、俄国 (黄色), ",
        "Russian (yellow), or Afghan (green). Your loyalty determines the color of coalition": "或阿富汗 (绿色)。你的效忠对象决定了你在打出卡牌或执行建造行动时所放置",
        "blocks which you will place when playing cards or taking the build action": "的阵营长方体标记的颜色。",
        "e.g. play-": "例如 , 效忠于俄国阵营的玩家放置的长方体标记为",
        "ers loyal to the Russian coalition place blocks that are yellow.": "黄色。",

        "The extent of your loyalty to a coalition is measured in influence points. We’ll get to": "你对阵营的效忠程度是以影响力点数来衡量的。我",
        "the various ways you’ll acquire these things later, but, for now, know that your total": "们会在之后提到获取的途径, 但是, 就目前而言, 影",
        "influence is the sum of": "响力点数等同于以下总和",
        "plus the number of": "你朝廷中的",
        "patriots": "爱国者",
        "in your court, the number": "数",
        "of your": "量、你的",
        "prizes": "战利品",
        ", and the number of your": " 数量, 以及你的",
        "gifts": "礼物数量",
        ".": "。",

        "To change your loyalty, you must gain an influence point associated with a": "要改变你的效忠对象, 你必须获得 1 点与你当前效忠",
        "different coalition than your own (either by playing patriots or by betray-": "对象不同阵营的影响力 (要么通过打出爱国者, 要么",
        "ing cards with prizes). Whenever you change loyalty, first return your": "通过背叛某张朝廷牌获得战利品)。每当你改变你的",
        "gifts to your supply and discard any prizes and patriots you had previ-": "效忠对象时, 首先将你的礼物放回到你的供应区, 并",
        "ously accumulated. Finally, adjust your loyalty dial to indicate your new": "弃置你之前拥有的战利品与爱国者。最后, 将你的效",
        "loyalty.": "忠圆盘调整到你所效忠的新的阵营。",

        "Ruling a Region": "统治一个地区",
        "Each of the six regions in the game is associated with a ruler token.": "在游戏里, 六个地区中每个地区都有一个对应的统治标记。",
        "Ruler tokens remain on the board if no player currently rules the": "如果当前某个地区没有玩家统治, 则该地区的统治标记会",
        "region. If a player does rule a region, they should immediately take": "留在版图上。如果有玩家统治了该地区, 则该玩家应立即",
        "the associated ruler token and place it in their play area. Likewise, if": "拿取对应的统治标记并将其放置在自己的面前。与之类",
        "a player ceases ruling a region, the associated ruler token should be": "似, 如果玩家不再统治一个地区, 则对应的统治标记应当",
        "immediately returned to the board.": "立即放回到版图上。",

        "In order to take a ruler token, you must have": "为了获得一个地区的统治标记, 你必须在该地区拥有至少",
        "at least one tribe": "1个部落",
        "and": "与",
        "a plurality of ruling pieces": "数量最多的统治物件",
        "(more than all others individually).": "(分别比其他每位玩家都多)。",
        "Tribes and loyal armies are considered ruling pieces. If there is a": "部落与所效忠阵营的军队均视为统治物件。如果平",
        "tie, no player rules the region. Armies belonging to enemy coali-": "手, 则无人统治该地区。即使没有敌方阵营的玩家",
        "tions can prevent you from taking a ruler token, even if there are": "的部落存在, 属于敌方阵营的军队仍然会阻止你获",
        "no enemy tribes.": "得统治标记。",

        "Ruling a region grants players access to the build action (page": "统治地区给予玩家以下优势及特权: 能够使用建",
        "13), special taxing privileges (page 13), and the ability to extract": "造行动 (第 13 页), 征税特权 (第 13 页), 以及当",
        "bribes from other players who want to play cards associated with": "其他玩家想要打出与该地区相关的卡牌时, 从该",
        "that region (page 11). It’s good to be king.": "玩家处索贿的能力 (第 11 页)。当国王真好。",

        "Example: You have three ruling pieces in Kandahar (one tribe and two": "例子: 你在坎大哈已有 3 个统治物件 (1 个部落与 2 个阿富汗军队",
        "Afghan armies loyal to you). There are also four additional armies not": "效忠于你)。还有 4 个不效忠于你的其他军队 (2 个属于英国 , 2 个",
        "loyal to you (two British, two Russian). Because you have at least one": "属于俄国)。由于你有至少 1 个部落在该地区并且拥有最多的统治",
        "tribe in the region and the most ruling pieces, you take the ruler token.": "物件 , 因此你获得该地区的统治标记。",
        "Blake is loyal to the Afghan coalition.": "布雷克现在效忠于阿富汗阵营。他",
        "He has one gift, one prize,": "有一个礼物 , 一个战利品 , 以及一",
        "and one patriot.": "个爱国者。",
        "Nevertheless, he decides to change": "尽管如此 , 他还是决定改变效忠对",
        "loyalty. He plays the patriot “Sir John": "象。他打出爱国者 “约翰·基恩爵",
        "Keane.” At this moment, he loses his": "士。”在这时 , 他会失去他的礼物、",
        "gift, his prize, and his patriot.": "战利品 , 以及爱国者。",
        "LOYALTY CHANGE EXAMPLE": "改变效忠对象的例子",
        "Blake’s Court": "布雷克的朝廷",

        "General Rules": "通用规则",
        "Negotiation": "谈判",
        "Players are free to discuss the game during play and explicitly coordinate their actions. Howev-": "玩家在游戏过程中可以自由讨论并对各自的行动达成明确的协定。然",
        "er, any agreed-upon deal should be considered non-binding. Cards may never be transferred be-": "而任何商定的协议都不具有强制约束力。卡牌不能在玩家之间传递。",
        "tween players. Money can only be transferred from one player to another if explicitly sanctioned": "钱币只能在规则明确许可下, 才能从一位玩家处转移到另一位玩家",
        "by the rules": "处。",
        "e.g. taxation of subjects, bribes for taking hostage actions, playing cards": "例如征税, 以及因打出卡牌或执行被劫持的朝廷卡的行动而进行贿赂",

        "Component Limits": "配件数量限制",
        "If asked to place a unit and none remain in the supply, you must take a piece of the required": "如果你要放置 1 个单位 (长方体或圆柱体标记), 但供应区已经没有任何剩余了, 则你必须从场上任",
        "shape/color from anywhere in play, excluding any pieces placed this turn. In taking and placing": "何位置拿取 1 个所需形状/颜色的物件并进行放置, 但不能是本回合刚放置的物件。在以此法拿取",
        "a piece this way, you may convert one type of unit to another.": "并放置物件时, 你可以转换单位的类型。",
        "Example: You must place a spy, but you have no cylinders remaining in your stock, so you take one of your": "例子 : 你必须放置 1 个间谍 , 但你的供应区已经没有圆柱体标记了 , 因此你从场上拿取你的 1 个",
        "tribes in play and place it as a spy as instructed.": "部落 , 并将其作为间谍按照要求放置。",

        "Card Precedence and Special Abilities": "卡牌优先级与特殊能力",
        "Some event cards and court cards with special abilities will modify the rules of the game. These": "某些事件卡与朝廷卡带有会修改游戏规则的能力。这些卡牌优先级总是高于规则本",
        "cards always take precedence over the rules. If a court card has a special ability, it is active as": "身。如果朝廷卡拥有特殊能力, 则只要该卡牌留在你的朝廷内, 其能力就会一直处于",
        "long as the card remains in your court.": "激活状态。",

        "Access to Actions": "使用行动",
        "You always have access to the following core actions: purchase and play. In addition, the cards": "你总是能够使用以下的核心行动: 购买与打出。此外, 你朝廷中的卡牌会让",
        "in your court provide you access to the actions listed on that card.": "你能够使用卡牌上列出的行动。",
        "Each card in your court can": "你朝廷中的每张卡牌在每回合中只能被使",
        "only be used for one action per turn.": "用一个行动。",
        "That is, even if a card has three actions on it, only one of those": "这就是说 , 即使 1 张卡牌上有三个行动 , 每回合也只能使用",
        "actions can be used each turn.": "其中之一。",

        "Discarding a Card in Your Court": "弃置你朝廷中的卡牌",
        "Whenever a card in your court is discarded, the following rules always take effect:": "每当你的朝廷中有卡牌被弃置时, 以下规则总是会生效:",
        "Any spies on the card are lost and returned to their owner’s supply.": "移除该卡牌上的所有间谍, 放回各自拥有者的供应区。",

        "If the card had the leveraged icon, you must return two rupees to the supply.": "如果卡牌上有贷款图标, 你必须归还 2 卢比到供应区。",
        "For each rupee you cannot return, you must discard one card from your": "每有 1 卢比无法归还, 你必须从你的手牌或朝廷弃置",
        "hand or court (not including this card, of course). If you have no cards left, no further": "1 张卡牌 (当然, 不包括此卡牌)。如果你已没有任何",
        "payment is required.": "卡牌, 则不需要支付进一步的费用。",

        "The Overthrow Rule": "政权颠覆规则",
        "In general, there is no persistent link between the cards in your court and the": "通常来说, 你朝廷里的卡与地图上的物件是没有持续关联的。",
        "pieces on the map. However, if you lose your last tribe in a region, you must im-": "然而如果你失去了你一个地区的最后一个部落, 你必须立即",
        "mediately discard all political cards associated with that region from your court.": "将你朝廷里所有与该地区相关的政治卡弃置。与之类似, 如",
        "Likewise, if you lose the last political card in your court associated with a region,": "果你失去了你朝廷中与某个地区相关的最后一张政治卡, 则",
        "you must immediately remove all of your tribes in that region. Many games will": "你必须立即从该地区移除你的所有部落。这条规则经常能",
        "be won and lost because of this rule, so you may want to read it again just to make": "左右一局游戏的胜负, 因此请反复阅这条规则, 确保你将它",
        "sure you’ve got it!": "记住了！",

        "Sequence of Play": "游戏流程",
        "Pax Pamir occurs over a series of turns. Each turn, the active player performs up to two actions": "帕米尔和平会进行一系列回合。每个回合中, 当前玩家执行至多两个行动,",
        "which are described in the following two sections of this rulebook. Bonus actions (page 12) do": "这些行动将会在本规则书之后两节中详细说明。奖励行动 (第 12 页) 不会",
        "not count against this limit. You may opt to take only a single action or no action at all. After you": "计入行动数限制中。你可以选择只执行一个行动或完全不执行行动。在你",
        "have completed your turn, perform cleanup. Then play continues clockwise to the next player": "结束你的回合后, 执行清理阶段。然后按照顺时针方向, 轮到下一位玩家的",
        "until the game is over.": "回合, 这样持续直至游戏结束。",

        "Cleanup": "清理阶段",
        "Cleanup has four steps:": "清理阶段包含四个步骤:",
        "First,": "首先,",
        "if you have more cards than three plus the sum of the purple stars on cards": "如果你朝廷中的卡牌数量超过你朝廷中卡牌上的紫星",
        "in your court, discard cards in your court until you are within your limit.": "总数加 3, 则你必须将你朝廷中的卡牌弃置到你的上限数量。",
        "Second,": "其次,",
        "if you have more cards than two plus the sum of the blue stars on cards": "如果你手牌中的卡牌数量超过你朝廷中卡牌上的蓝星",
        "in your court, discard cards in your hand until you are within your limit.": "总数加 2, 则你必须将你手牌中的卡牌弃置到你的上限数量。",

        "Third,": "然后,",
        "discard any event cards that are in the leftmost column of the market.": "弃置已位于市场最左列的所有事件卡。被弃置事件",
        "Any rupees on the discarded event will remain in their position. The top row is": "上的卢比会留在原地。总是从顶部行先开始弃置卡牌, 然",
        "always discarded first, followed by the bottom row. When an event card is dis-": "后再弃置底部行。当 1 张事件卡被弃置时, 所有玩家将会",
        "carded, all players are affected by the text or impact icon at the top of the card.": "受到弃置事件卡上半部分的文字或图标效果的影响。",

        "Fourth,": "最后,",
        "fill any empty spaces in the market by moving all cards in that market": "将所有市场上的卡牌 (以及卡牌上的卢比) 沿同一行",
        "row (along with their rupees) to their leftmost position. If a card moves into": "往左侧移动, 填满所有空格, 然后从牌库摸取新卡牌, 填满",
        "a space with rupees from a previously-discarded event card, those rupees are": "右侧空格, 尽可能让市场恢复正常规模。如果卡牌移动到",
        "placed on the new card taking that position. Then draw new cards to fill in any": "一个由于之前事件卡被弃置而带有卢比的格子, 则将卢比",
        "empty spaces starting with the leftmost and returning the market to its normal": "放置在新卡牌上。",
        "size, if possible. In each empty column, fill the top row first.": ".",

        "Instability.": "动荡。",
        "If a Dominance Check card is revealed and there is already": "如果 1 张优势检定卡出现, 而市场",
        "a Dominance Check card in the market, immediately perform a Domi-": "中已有 1 张优势检定卡存在, 则立即执行",
        "nance Check and then discard both Dominance Check": "一次优势检定, 然后同时将这 2 张优势检",
        "cards and fill the empty spaces in the market as": "定卡弃置, 并如上文规则补满市场空格。",
        "described above. If the final Dominance Check": "如果因此方式弃置了最后的优势检定卡,",
        "card was discarded in this way, the Dominance": "此次优势检定视为最终检定。",
        "Check will count as the final check.": ".",

        "Game End and Victory": "游戏结束与胜利条件",

        "A game of Pax Pamir can end two ways. If, after any Domi-": "帕米尔和平游戏会以两种方式结束。",
        "nance Check, a single player leads all other players by at least": "如果在任何一次优势检定后, 一位玩",
        "four victory points, the game is over and that player wins. Bar-": "家领先于所有其他玩家至少 4 分,",
        "ring that, after the deck’s final Dominance Check is resolved,": "则游戏结束并且该玩家获胜。否则",
        "the game will always end, and the player with the most victory": "在最终优势检定结算后, 游戏结束,",
        "points wins.": "拥有最高分数的玩家获胜。",

        "If one or more players have the same number of vic-": "如果多位玩家在游戏结束时拥有相同",
        "tory points when the game ends, the player with the": "分数, 平手玩家朝廷中红色星数最多",
        "most red stars in their court among the tied players": "的人获胜。如果仍然平手, 平手玩家",
        "wins. If there is still a tie, the player with the most": "中拥有最多卢比的人获胜。如果仍然",
        "rupees among the tied players wins. If there is still a tie,": "平手, 平手玩家中能够做出最美味烤",
        "whoever can cook the best chopan kebab wins.": "肉的人获胜。",
        "The scoring of Dominance Checks is described on": "优势检定计分详见",
        "page 15.": "第 15 页说明。",

        "Core Actions": "核心行动",

        "The two core actions of Pax Pamir are described in this section. While not difficult, the purchase": "帕米尔和平中有两种核心行动会在本节进行详述。虽然并不",
        "and play actions are, by far, the most complicated actions of the game. When teaching the game,": "困难, 但购买与打出行动, 已经是游戏中最复杂的行动了。当",
        "some groups may prefer to learn just these two actions and then introduce the other actions": "教学游戏时, 某些玩家群体可能会更愿意先了解这两种行动,",
        "gradually over the first few rounds of play.": " 然后在游戏开始的几轮当中, 再逐渐介绍其他行动。",

        "Purchase": "购买",
        "Purchase a card from the market and add it to your hand. If you purchase a card that has rupees": "从市场购买 1 张卡牌并将其加入你的手牌。如果你购买的卡",
        "on it, you receive them along with the card.": "牌上有卢比, 则你会连同卡牌一起获得那些卢比。",
        "In order to purchase a card, you must be able to pay the card’s cost to the market.": "要购买 1 张卡牌, 你必须能够向市场支付该卡牌的费用。",

        "The cost of the card depends on its current column in the market. The leftmost column is free,": "卡牌费用取决于该卡牌当前位于市场的哪一列。最左侧的列是免",
        "the next column costs one rupee, then two, etc. Pay this cost by placing one rupee on each card": "费的, 下一列费用为 1 卢比, 然后是 2 卢比, 以此类推。支付卡牌",
        "in the same row to the left of the card you are purchasing. If you are ever required to place a": "费用的方式是, 在你所购买卡牌的同一行左侧的每张卡牌上分别",
        "rupee on a vacant market spot, pay the cost to the card in the same column in the other market": "放置 1 卢比。如果要放置卢比在市场的一个空格上, 则将该卢比",
        "row.": "放置在与该格相同列的另一格的卡牌上。",
        "If you place a rupee on a market card for any reason, you may not purchase that card": "如果你因任何理由在 1",
        "this turn.": "张市场中的卡牌上放置了卢比, 则你在本回合中不能购买该卡牌。",

        "Event Cards.": "事件卡。",
        "Event cards (including Dominance Checks) never enter a player’s hand and": "事件卡 (包括优势检定事件卡) 不会进入玩家的",
        "are resolved the moment they are bought from the market. Many event cards have a per-": "手牌, 而是会在其被购买时结算。许多事件拥有一个持续",
        "sistent effect that lasts until the next Dominance Check is resolved. Players who take these": "效果, 会持续到下一次优势检定结算为止。获得这些事件",
        "event cards should place them below their court. Event cards that alter the general game": "卡的玩家应将其放置在自己的朝廷下方。影响整个游戏",
        "should be placed near the map in easy view of all players.": "的事件卡则应该放置在地图旁, 以便所有玩家查看。",

        "Purchasing Cards when Military Cards are Favored.": "在军事处于优势花色时购买卡牌。",
        "If military cards are": "如果军事处于优势花",
        "favored, the cost to purchase a card is doubled. When purchasing cards from": "色, 购买卡牌的费用将翻倍。当从市场购买卡牌时, 需要",
        "the market, place two rupees on each card to the left of the purchased card": "在购买的卡牌左侧的每张卡牌上分别放置 2 卢比, 而不",
        "instead of one.": "是通常的 1 卢比。",

        "PURCHASE EXAMPLE": "购买卡牌的例子",
        "For his first action this turn, Chas purchases the third card": "作为查斯本回合的首个行动 , 他已经购买了顶部行",
        "in the top row. He would like to purchase a second card": "的第三张卡牌。他还想要使用他第二个行动购买另",
        "with his second action.": "一张卡牌。",
        "Because he already placed a coin on each of the first two": "因为他本回合已经在顶部行前两张卡牌上分别放",
        "cards in the top row this turn, he cannot purchase them. He": "置了 1 卢比 , 因此他无法购买这些卡牌。他决定",
        "decides to purchase the card “Arthur Conolly.” He pays a": "购买卡牌 “亚瑟·科诺利”。他在顶部行的前两张卡",
        "coin to the first two cards in the top row. Because the third": "牌上分别放置了 1 个钱币。因为第三个位置是空",
        "slot is vacant, he pays his third coin to the opposite row.": "格 , 他将第三个钱币放置到了另一行上。",
        "He then takes his purchased card into his hand and takes": "他然后将购买的卡牌加入自己的手牌 , 并获得所购",
        "the two rupees on the purchased card.": "买卡牌上的 2 卢比。",

        "Play": "打出",
        "Play any card from your hand to your court.": "从你的手牌中打出任意 1 张卡牌到你的朝廷。",
        "In order to play a card, first reveal that card to everyone": "要打出 1 张卡牌, 首先向所有人展示该卡牌并宣",
        "and announce its name and region. If you are the ruler of": "告其名称与地区。如果你是该卡牌地区的统治",
        "that card’s region or if no one rules the region, you can": "者, 或该地区没有统治者, 则你可以免费打出此",
        "freely play the card. If someone else is that region’s ruler,": "牌。如果其他某个玩家是统治者, 你必须支付一",
        "you must pay a bribe of rupees to them that is equal to the": "定数量的卢比贿赂他, 支付数量等同于统治者在",
        "number of the ruler’s tribes in that region. Any portion of": "该地区的部落数量。此费用的任何部分都能够",
        "this cost can be waived with the permission of the ruler. If": "在统治者的允许下被免除。如果此费用没有被",
        "the bribe is not paid (or waived), play continues as if the": "支付 (或被免除), 则视为此打出行动未被执行过,",
        "action had never been taken.": "继续进行游戏。",

        "The played card may be added to either the left or right end of your court.": "打出的卡牌可以添加到你朝廷的最左侧或最右侧。",
        "If the card is a patriot that does not match your loyalty, discard all of your patriots and prizes,": "如果该卡牌是一个与你效忠对象不符的爱国者, 将你所有的爱国者与战利品",
        "and remove any gifts. Then adjust your loyalty dial to match that of the patriot.": "弃置, 并移除所有礼物。然后将你的效忠圆盘进行调整, 以匹配该爱国者。",
        "After a card is played, resolve each impact icon on the right side of the card from top to bottom.": "在 1 张卡牌被打出后, 按照从上往下的顺序, 结算该卡牌右侧的每个影响图标。",
        "The effects of impact icons are described below:": "影响图标的效果如下文详述:",
        "No Stacking Limit": "无数量限制",
        "In general, there is no limit to the": "通常来说, 在任何特定地",
        "number of pieces that can exist in": "区、边界, 或朝廷卡上,",
        "any particular region, border, or": "能够存在的物件数量是",
        "court card. Pieces may also coexist": "没有限制的。属于不同",
        "with those belonging to different": "玩家或阵营的物件彼此",
        "players and coalitions.": "也可以共存。",
        "Place one coalition block of your loyalty": "将 1 个你效忠的阵营长方体标记放置",
        "on any border of this region. This piece": "该地区的任意一个边界上。该物件现",
        "is now a": "成为了",
        "Place one of your cylinders on a card in": "将 1 个你的圆柱体标记放置在任意玩家朝廷中",
        "any player’s court that matches the played": "的 1 张卡牌上, 该卡牌的地区需与你刚刚打出",
        "card’s region. This piece is now a": "的卡牌地区相同。该物件现在成为了",
        "Place one of your cylinders in this": "将 1 个你的圆柱体标记放置在该地区中。",
        "region. This piece is now a": "该物件现在成为了",
        "Take two rupees from the bank.": "从银行中拿取 2 卢比。该",
        "This card is leveraged.": "卡牌进行了贷款。",
        "Reminder:": "提醒:",
        "If you ever discard this card, you": "如果你要弃置该卡牌 , 你",
        "must pay back the rupees (page 8).": "必须偿还卢比 (第 8 页)。",
        "Place one coalition block of your": "将 1 个你效忠的阵营长方体标记",
        "loyalty in this region. This piece is": "放置在该地区中。该物件现在成",
        "now an": "为了",
        "Move the favored suit marker to the": "将优势花色移动到所示花",
        "suit indicated.": "色。",
        "Reminder: If the favored": "提醒: 如果优势花色",
        "suit is military, the cost to take the": "是军事 , 购买行动的费用",
        "purchase action is doubled.": "将会翻倍。",

        "PLAY EXAMPLE": "打出卡牌的例子",
        "Cati (blue) is loyal to the British coalition. She wants to play the card “Sikh Merchants in Lahore.”": "卡蒂 (蓝色) 效忠于英国阵营 , 她想要打出 “拉合尔的锡克商人”。",
        "That card is based in Punjab, so to play the card she will first need to pay a bribe to": "该卡牌位于旁遮普 , 因此要打出该卡牌她首先需要支付贿赂给旁遮普的统治者",
        "the ruler of the Punjab, Hope (gray). Since Hope has two tribes in the region, she": "霍普 (灰色)。因为霍普在此地区有 2 个部落 , 她可以要求至多 2 卢比的贿赂,",
        "can command a bribe of up to two rupees, which she does.": "并且霍普这样做了。",
        "Cati decides it is worth the expense. If she had": "卡蒂认为值得为打出这张牌支付贿赂。如果卡蒂",
        "declined to pay, Cati would not lose an action.": "决定不支付这笔费用 , 她并不会失去一个行动。",
        "First, Cati can place a road on either of the": "首先 , 卡蒂可以放置 1 个道路在通往旁遮普",
        "connections adjacent to Punjab (even if there": "的任意一个边界上 (即使此处已有其他道路",
        "are other roads there!). As she is loyal to the": "存在！)。因为她效忠于英国 , 道路是粉色",
        "British, the road will be pink.": "的。",
        "Then Cati will place a spy on any court card": "然后卡蒂会在与旁遮普相关的任意一张",
        "associated with Punjab. She opts to place the spy": "朝廷卡上放置 1 个间谍。她选择将间谍放",
        "on one of Hope’s court cards. Perhaps she can": "置在霍普的其中一张朝廷卡上。或许",
        "blackmail her in the future!": "卡蒂在未来会勒索她！",
        "Finally, as the played card is leveraged,": "最后 , 因为打出的这张卡牌进行了贷",
        "Cati will take two rupees from the bank.": "款 , 卡蒂会从银行中获得 2 卢比。",
        "A Punjab": "霍普朝廷",
        "card in": "中 1 张",
        "Hope’s": "旁遮普",
        "Court": "的卡牌",
        "Card-Based Actions": "卡牌行动",
        "The rest of the actions in Pax Pamir are associated with court cards and can only be taken if you": "帕米尔和平中剩余的行动都与朝廷卡相关, 且只能在你朝廷中有所示",
        "have a card in your court which displays that action.": "行动的卡牌时才能执行。",
        "Each card can only be used for one action": "无论卡牌上有多少行动图标, 每张卡牌只能",
        "once per turn, regardless of the number of actions icons on that card.": "在每回合中使用一个行动。",
        "Some card-based actions are modified by the rank of a card. The higher the rank, the more effec-": "某些卡牌行动的效果与卡牌等级相关。等级越高, 该行动效率越高。",
        "tive the action is. To help you remember this, action icons modified by rank feature additional": "为了帮助你记住这个规则, 效果与等级相关的行动图标会带有额外的",
        "symbols.": "符号。",
        "Bonus Actions.": "奖励行动。",
        "Actions on cards matching the favored suit do not count against your": "优势花色卡牌上的行动不计入你回合中两个",
        "turn’s two-action limit.": "行动的限制中。",
        "Remember: each of these cards can still only be used for a single action": "请记住: 每张卡牌仍然每回合只能使用",
        "per turn.": "一个行动。",

        "Action Costs.": "行动费用。",
        "Some card-based actions require the acting player to pay an amount of": "某些卡牌行动需要当前玩家支付一定数量的卢比到",
        "rupees to cards in the market. These rupees are always paid in a similar fashion:": "市场的卡牌上。这些卢比总是按照同样的方式支付:",
        "rupees": "将与费用数",
        "equal to the cost should be placed on the rightmost market cards of both rows, with": "量相同的卢比放置在两行市场卡最右侧的卡牌上, 每张卡牌上分",
        "a single rupee being paid to each card.": "别放置 1 卢比。",
        "If a market slot is vacant, skip that vacancy and": "如果有市场格是空格, 跳过该空格, 继续将卢比",
        "pay the next market card(s) in the row.": "放置在同一行的下张市场卡上。",
        "Reminder: if you place a rupee on a market card for": "请记住: 如果你因任何理由在",
        "any reason, you may not purchase that card this turn. For an example of paying action costs, see the": "1 张市场中的卡牌上放置了卢比 , 则你在本回合中不能购买卡牌。",
        "example of the Build Action on the next page.": "支付行动费用的例子 , 请参阅下一页建造行动的例子。",
        "If the market does not contain enough cards to": "如果市",
        "take the spent rupees, any excess rupees are taken out of the game.": "场没有足够的卡牌放置花费的卢比, 将超出的卢比移出游戏。",
        "This can happen in the": "这",
        "late game when the deck is depleted.": "可能会发生在游戏后期牌库用尽时。",

        "Hostage Actions.": "劫持行动。",
        "Court cards can be held": "朝廷卡被劫持的方",
        "hostage much in the same way that a player": "式与玩家统治地区类似。要劫",
        "can rule a region. To hold a card hostage, a": "持 1 张卡牌, 一位对手必须在此",
        "single enemy player must have more spies": "卡牌上拥有比每个其他玩家都",
        "on the card than each other player. When": "多的间谍。当 1 张位于某玩家",
        "a card in a player’s court is held hostage,": "朝廷的卡牌被劫持时, 该玩家只",
        "that player can only use the card’s actions if": "能向劫持卡牌的玩家支付一定",
        "the player holding it hostage is paid a bribe": "数额的贿赂, 方可使用该卡牌的",
        "equal to the number of hostage-holding": "行动。支付的数额与该卡牌上",
        "spies on the card. Any portion of this pay-": "进行劫持的间谍数量相同。此",
        "ment can be waived with the permission of": "费用的任何部分都能够在劫持",
        "the player holding the actions hostage. Spe-": "者的允许下被免除。特殊能",
        "cial abilities": "力",
        "(those described in a small text box)": "(在小型文字框内描述的能力)",
        "are never held hostage.": "不会受到劫持的影响。",

        "This card is in Hope’s (gray)": "此卡牌位于霍普 (灰色)",
        "court. Cati (blue) has two": "的朝廷中。卡蒂 (蓝色)",
        "spies on the card. Hope only": "有 2个间谍在此卡牌上 ,",
        "has one. For this reason, this": "而霍普只有 1 个。因此 ,",
        "card’s two actions are held": "此卡牌的两个行动遭到",
        "hostage by Cati.": "卡蒂劫持。",

        "To take either of this card’s": "要执行此卡牌的其中一",
        "two actions, Hope must pay": "个行动 , 霍普必须支付",
        "a bribe of two rupees to Cati.": "2 卢比的贿赂给卡蒂。",
        "Cati may reduce or waive": "卡蒂可以减少或完全免",
        "this bribe outright.": "除此次贿赂。",
        "HOSTAGE ACTION EXAMPLE": "劫持行动的例子",

        "TAX EXAMPLE": "征税的例子",
        "Cati takes a tax action with a rank two": "卡蒂使用了 1 张 2 级卡的征税",
        "card. She rules Kabul.": "行动。她统治着喀布尔。",
        "Since Cati rules Kabul, she can take one rupee from": "因为卡蒂统治喀布尔 , 而布鲁",
        "Brooke who has a court card in that region.": "克的朝廷中有 1 张该地区的卡",
        "Brooke’s other rupees are protected by her Money": "牌 , 因此她能够从布鲁克处获",
        "Lender’s Tax Shelter.": "得 1 卢比。",
        "Cati takes the other rupee": "卡蒂从市场获得另",
        "from the market.": "外的 1 卢比。",

        "Brooke’s Court": "布鲁克的朝廷",
        "The Market": "市场",
        "BUILD EXAMPLE": "建造的例子",
        "Cati takes a build action. She rules Kabul": "卡蒂执行建造行动。她统治着喀布尔 , 并效忠于",
        "and is loyal to the British coalition.": "英国阵营。",

        "Since Cati rules only Kabul, she can build armies in": "因为卡蒂统治喀布尔 , 所以她可以在喀布尔建造",
        "Kabul or roads on any of its four borders. She can": "军队或在客布尔四条边界中的任意一条或多条上",
        "place up to three blocks with this action, but decides": "建造道路。卡蒂可以使用此行动放置至多 3 个长",
        "to only place two armies. This costs a total of four": "方体标记 , 但她决定只放置 2 个军队。这会花费",
        "rupees which she pays to the market.": "共 4 卢比 , 她将费用支付到市场中。",

        "Tax": "征税",
        "Take rupees up to the acting card’s rank from players with at least one court card": "从至少有 1 张你统治地区的朝廷卡的玩家处或市场的任意",
        "associated with a region you rule or any card(s) in the market (regardless of their": "卡牌 (无视地区) 上获得若干卢比, 其数量至多等同于正在",
        "region). You may take rupees from several sources so long as the total taken does": "执行行动的这张卡牌的等级。你可以从多处来源获得卢比,",
        "not exceed the rank of the acting card.": "只要总数不超过行动卡牌的等级。",

        "Tax Shelter.": "避税。",
        "The total number of gold stars in your court indicates the": "你朝廷中的金色经济总星数, 代表你能够从征税行动",
        "amount of rupees you can shelter from the Tax Action. Only rupees you": "中保留卢比的数量。只有超出你避税数值的卢比才会受到征",
        "hold in excess of your Tax Shelter are vulnerable to the Tax Action.": "税影响。",
        "Gift": "礼物",
        "Place one of your cylinders on one of your empty gift spaces on your loyalty dial.": "将你的 1 个圆柱体标记放置在你效忠圆盘上的 1 个空的礼物",
        "Each gift will count as one influence point in your current coalition. The cost of": "格上。每个礼物会计为你在当前阵营的一点影响力。此行动",
        "this action is equal to the marked price of the gift placed (2, 4, or 6).": "的费用等同于放置礼物的格子上所标记的价格 (2、4, 或 6)。",
        "Reminder: Gifts are lost whenever you change loyalty!": "请记住: 每当你改变效忠对象时会失去所有礼物！",

        "Build": "建造",
        "Place up to three armies and/or roads among any regions that you rule. Roads": "在你统治的任意一个或多个地区, 放置至多 3 个军队和/或道路。道路",
        "may be placed on any adjacent borders. Any combination of different units may": "放置在任何与这些地区相邻的边界上。放置时军队和道路的数量可以",
        "be purchased. The cost of this action is equal to two rupees per unit placed.": "任意组合。此行动的费用为每放置 1 个单位, 支付 2 卢比。",
        "Move": "移动",
        "For each rank of the acting card you may": "执行行动的这张卡牌每有 1 级, 则你可以移",
        "move one loyal army or spy. The same unit": "动 1 个效忠的军队或间谍。相同的单位可",
        "can be moved multiple times on a single": "以在一回合内移动多次。类似地, 多次移动",
        "turn. Likewise, multiple moves may be split": "可以拆分给你的数个间谍与效忠的军队来",
        "across several of your spies and loyal armies.": "执行。",
        "To move an army from one region to an ad-": "要将 1 个军队从一个地区移动到",
        "jacent region there must be a road matching": "相邻地区, 越过的边界必须由与",
        "the loyalty of the moving army on the bor-": "所移动的军队阵营匹配的道路连",
        "der being crossed.": "接。",
        "Spies move along cards in the players’": "间谍沿着玩家朝廷中的卡牌进行",
        "courts (clockwise or counter-clockwise),": "移动 (顺时针或逆时针), 就如同",
        "as if they formed a single continuous track": "所有玩家场上的朝廷卡环绕构成",
        "around the area of play.": "了一个连续的轨道。",
        "Betray": "背叛",
        "Discard one card where you have a Spy (including cards in your own court). Any": "弃置 1 张有你间谍存在的卡牌 (可以是你自己朝廷的",
        "spies on the betrayed card are lost and returned to their owner’s supply. This action": "卡牌)。移除被背叛的卡牌上的所有间谍, 并放回其各",
        "always costs two.": "自拥有者的供应区。此行动的费用固定为 2 卢比。",
        "After the betrayed card is discarded, you": "在被背叛的卡牌弃置后, 你",
        "may": "可以",
        "accept it as a prize, tucking it partial-": "接受该弃置卡牌作为战利品, 将其插入到你的",
        "ly behind your loyalty dial. If this prize is different from your current loyalty, first": "效忠圆盘下方, 露出战利品的符号即可。如果此战利品与你当前效忠对象不同,",
        "remove all gifts, prizes, and patriots in your court matching your previous loyalty,": "首先移除所有礼物, 战利品, 以及你朝廷中匹配你之前效忠对象的爱国者, 然后",
        "and rotate your loyalty dial to match the prize taken.": "将你的效忠圆盘转动到与获得的战利品相匹配的阵营, 并获得该战利品。",
        "Reminder: Betrayals may trigger leveraged icons": "请记住: 背叛可能会触发贷款图标与",
        "and The Overthrow Rule (page 8).": "政权颠覆规则 (第 8 页)。",
        "Battle": "战斗",

        "Start a battle in a single region or on a court": "在一个地区或一张朝廷卡上开始一场",
        "card. At the site of the battle, remove any": "战斗。在战斗地点上, 移除任意组合",
        "combination of tribes, spies, roads, or armies": "的部落、间谍、道路, 或军队, 移除数",
        "equal to the acting card’s rank. There are": "量等同于执行行动的这张卡牌的等级。",
        "three restrictions to this rule:": "此规则有三条限制:",
        "You cannot remove more units than": "你不能移除比你在这场战",
        "you yourself have armies or spies in": "斗中拥有的军队或间谍",
        "that battle.": "更多的单位。",
        "You cannot remove armies or roads": "你不能移除你效忠阵营的",
        "that are of your loyalty.": "军队或道路。",
        "You cannot remove tribes belonging": "你不能移除与你效忠同一",
        "to players that share your loyalty.": "个阵营的玩家的部落。",
        "However, their spies may be removed!": "然而 , 可以移除他们的间谍！",

        "MOVE EXAMPLE": "移动的例子",
        "Blake (red) takes a rank three move action. He is loyal to the": "布雷克 (红色) 执行了一次 3 级移动行动。他效忠于",
        "Russian coalition. With his first two moves, he moves his spy": "俄国阵营。他使用他的前两次移动 , 将他的间谍逆",
        "two cards counter-clockwise. Then, with his final move, he": "时针移动 2 张卡牌 , 最后一次移动 , 他将他的军队",
        "moves his army to an adjacent region using a yellow road.": "通过黄色道路移动到相邻的地区。",
        "ON A COURT CARD": "在朝廷卡上",
        "IN A REGION": "在地区中",

        "BATTLE EXAMPLES": "战斗的例子",
        "Cati is loyal to the British coalition and uses a rank two": "卡蒂效忠于英国阵营并使用了一次 2 级",
        "battle action. She must first decide the site of the battle.": "战斗行动。她必须首先决定战斗地点。",

        "Cati (blue) selects a card": "卡蒂 (蓝色) 选择了 1 张",
        "on Hope’s court. She": "霍普朝廷中的卡牌。",
        "removes two of Hope’s": "她移除了霍普的 2 个",
        "spies—": "间谍—",
        "despite the fact": "尽管他们都效忠",
        "that they share the": "于同一个",
        "same loyalty!": "阵营！",
        "Cati now holds the": "卡蒂现在劫持了",
        "actions on this card": "这张卡牌的",
        "hostage.": "行动。",

        "Cati selects a region. In this region": "卡蒂选择了一个地区。在这个地",
        "she only has one loyal army, and so": "区中她只有 1 个效忠的军队 , 因",
        "can only remove a single unit.": "此只能移除 1 个单位。她不能",
        "She cannot remove Hope’s": "移除霍普的部落 (灰",
        "tribe (gray) because": "色), 因为他们都",
        "they share a loyalty.": "效忠于同一个阵营。",
        "Instead, she may": "然而 , 她可以",
        "eliminate the enemy road": "消灭敌对阵营的道路",
        "or": "或",
        "the enemy army.": "军队。",
        "Early End": "提前结束",
        "If, after scoring a Dominance": "如果在一次优势检定计分后,",
        "Check, the leading player has at": "领先玩家比第二名玩家",
        "least four more victory points than": "多出至少 4 分,",
        "the next highest scoring player, the": "则游戏结束,",
        "game is over and that player wins!": "该玩家获胜！",
        "Dominance Check event cards are resolved when purchased": "优势检定事件卡会在被玩家购买时或在清理",
        "by a player or when triggered during cleanup. When re-": "阶段触发时结算。当结算时, 检查游戏局势。",
        "solved, take account of the game-state. If a single coalition": "如果某个某个阵营在场上拥有的长方体标记",
        "has the most blocks in play and at least four more than all": "数量最多, 且比其他每个阵营 (分别计算) 都",
        "other coalitions (uncombined), the Dominance Check is": "多至少 4 个, 则优势检定成功。否则此次检",
        "successful. Otherwise the check is unsuccessful.": "定不成功。",
        "Example: If": "例子: 如果英国阵营拥有 8 个",
        "the British coalition has eight blocks and the other two coalitions": "长方体标记 , 而另外两个阵营都拥有 4 个",
        "both have four blocks, the British Coalition would be dominant": "长方体标记 , 则英国阵营视为处于优势",
        "The result of this check determines what happens next.": "检定结果会决定接下来将如何计分。",
        "Unsuccessful Check": "检定不成功",
        "Players will score points based on the number of cylinders they have in play (even zero).": "玩家会根据各自在场上的圆柱体标记数量来计分。如果圆柱体标记没有在玩家面板上, 则视为其位",
        "A cylinder is considered to be in play if it is not on a player board.": "于场上。",
        "The player with the most cylinders in play scores three victory points.": "场上最多圆柱体标记的玩家获得 3 分。",
        "The player with the second most cylinders in play scores one victory point.": "场上第二多圆柱体标记的玩家获得 1 分。",
        "If there is a tie, add up the victory points for the": "如果出现平手, 则将平手所处名次",
        "tied places and then divide that number by the": "的分数相加, 再除以平手玩家的人",
        "number of tied players (rounding down)": "数 (向下取整)",
        "e.g. two": "例如 , 在前两名玩家",
        "players tied for first place will both score two points": "平手的情况下 , 他们都会获得2分",
        "Successful Check": "检定成功",
        "Players loyal to the Dominant Coalition score": "所有效忠于优势阵营的玩家, 会根据",
        "victory points based on their influence points": "自己的影响力点数 (第 7 页) 来计分。",
        "(page 7). Each loyal player has one influence": "每位效忠玩家拥有的影响力等于自己",
        "point plus the sum of their gifts, prizes, and the": "的礼物、战利品、朝廷中的爱国者的",
        "number of patriots in their court.": "数量总和再加1。",
        "The player with the most influence": "拥有最高影响力的玩家获得 5 分。",
        "scores five victory points.": ".",
        "The player with the second most scores": "拥有第二高影响力的玩家获得 3 分。",
        "three victory points.": ".",
        "The player with the third most scores": "拥有第三高影响力的玩家获得 1 分。",
        "one victory point.": ".",
        "number of tied players (rounding down).": "数 (向下取整)。",
        "After awarding points for the successful": "在检定成功并计分后, 此地区维系",
        "check, the region settles into an uneasy peace.": "着脆弱的和平状态。将所有阵营",
        "Remove all coalition blocks from the board.": "长方体标记从地图中移除。",
        "Final Dominance Check": "最终优势检定",
        "Any points earned during the final Dominance": "在最终优势检定中获得的所有分数",
        "Check are doubled. This doubling occurs before": "都会翻倍。在影响力或圆柱体标记",
        "any victory points are split in the case of ties for": "平手的情况下分数翻倍会发生在分",
        "influence or cylinders.": "数均分之前。",
        "The third dominance check has just been bought in a three": "在一局卡蒂 (蓝色)、布雷克 (红色), 以及霍普 (灰色)",
        "player game with Cati (blue), Blake (red), and Hope (gray).": "的三人游戏中 , 第三次优势检定刚刚被人购买。",
        "The Russian Coalition is dominant. Cati and Blake are both": "俄国阵营处于优势。卡蒂与布雷克都效忠于该阵营。",
        "loyal to that coalition. Cati has the most influence and scores": "卡蒂拥有最高的影响力 , 因此获得 5 分, 布雷克获",
        "five points, Blake scores three.": "得 3 分。",
        "A few turns later the fourth dominance check appears in the": "数回合后, 第四次优势检定出现在市场中并被人购",
        "market and is bought. For the sake of example, there are no": "买。由于是例子的缘故 , 此处场上没有间谍或礼",
        "spies or gifts in play.": "物。",
        "No Coalition is dominant. Blake has the most cylinders in play": "没有阵营处于优势。布雷克在场上拥有最多的圆",
        "so he would score six points (3 x 2 for the final dominance": "柱体 , 因此他会获得 6 分 (由于是最终检定 , 因",
        "check) Cati and Hope would each score one (1x2÷2).": "此 3x2), 卡蒂与霍普则会分别获得 1 分(1x2÷2)。",
        "Because the check was successful, all of the blocks are now": "因为此次检定成功 , 所有长方体标记现在从版图上",
        "cleared from the board.": "被移除。",
        "DOMINANCE EXAMPLES": "优势检定的例子",

        "Playing with Wakhan": "与瓦罕对弈",
        "This section introduces an automated opponent called Wakhan. Thematically, this opponent": "本节会介绍一个被称为瓦罕的 AI 对手。从主题上讲, 这个对手代表了某",
        "represents some radical ideology (theological or philosophical) that has taken hold across the": "种极端主义思想 (神学上或哲学上的), 这种意识形态遍及整个地区, 且超",
        "region and that transcends traditional loyalties.": "越了传统忠诚。",
        "Wakhan can be faced by one or two human players. However, this is not a cooperative variant": "瓦罕可以与一位或两位玩家对战。然而这并不是一个合作游戏变体, 只有",
        "and only one player (or Wakhan) can win the game.": "一位玩家 (或瓦罕) 能够赢得游戏胜利。",
        "Setting Up": "游戏设置",
        "When setting up a game with Wakhan, make the following adjustments:": "当使用瓦罕进行游戏设置时, 进行以下调整:",
        "Include Wakhan as a player when determining the size of the deck.": "确定牌库规模时, 将瓦罕作为一位玩家计算在内。",
        "Shuffle the deck of 24 AI cards and place them in a stack face down.": "洗混 24 张 AI 卡构成牌库, 面朝下放置在旁边。",
        "Wakhan will use a spare set of player cylinders. Wakhan does not take a loyalty dial and": "瓦罕会使用一套玩家未使用颜色的圆柱体标记。瓦罕不会用到效忠圆盘,而是会将她的礼物",
        "will instead place her gifts on her aid card. Place Wakhan’s pieces to the right of the": "放置在她的提示卡上。将瓦罕的物件放置在最后选择效忠对象的玩家的右手侧。瓦罕将",
        "player who chooses their loyalty last. Wakhan will take the first turn of the game.": "会执行游戏的首回合行动。",
        "Wakhan must pay all costs, including bribes, just like a regular player.": "瓦罕必须像一位普通玩家那样支付所有费用, 包括贿赂。",
        "If Wakhan’s court cards have a Special Ability that says she “may” do something, Wakhan al-": "如果瓦罕的朝廷卡拥有 “可以” 执行某动作的特殊能力, 则瓦罕总是会执",
        "ways will.": "行该动作。",
        "Wakhan is not loyal to a coalition; rather, Wakhan is effectively loyal to all coalitions. Wakhan": "瓦罕不会效忠于某一个阵营; 相反, 瓦罕效忠于所有阵营。瓦罕能够拥有",
        "can hold loyalty prizes and patriots belonging to different coalitions. Nevertheless, she will": "属于不同阵营的战利品与爱国者。尽管如此, 她总是会假定一个实际的",
        "always assume a single pragmatic loyalty.": "效忠对象。",
        "Wakhan’s Pragmatic Loyalty": "瓦罕实际的效忠对象",

        "is always the leftmost loyalty on the AI card that is not": "总是 AI 卡上最靠左的不与其他玩家相同的",
        "shared by any other player. This loyalty is used to determine the blocks she places, moves,": "那个阵营。该效忠对象会用来确定瓦罕放置哪种长方体标记, 以",
        "and battles with. Do not use Wakhan’s pragmatic loyalty to determine who rules in a re-": "及使用哪种长方体标记来移动和战斗。不要用瓦罕实际的效忠对",
        "gion; instead, when assessing whether Wakhan is competing for control of a region, count": "象来确定瓦罕统治哪些地区; 在确定瓦罕争夺一个地区的控制权",
        "her tribes and only the most numerous Armies of a single coalition in that region towards": "是否成功时, 改为将她的部落以及该地区单个阵营中数量最多的",
        "the number of her ruling pieces.": "军队作为她的统治物件进行计算。",

        "If Wakhan needs to choose a suit, Wakhan will always": "如果瓦罕需要选择一种花色, 她总",
        "select the current favored suit. If Wakhan must discard a": "是会选择当前的优势花色。如果",
        "Leveraged card and has no coins, Wakhan does not need": "瓦罕必须弃置 1 张贷款卡牌, 而又",
        "to discard cards (just as if she had 2 cards in her hand": "没有足够的钱币归还, 则尽量归还",
        "instead).": "即可。",

        "Frequently, Wakhan will have to chose a specific court": "瓦罕常常必须要选择 1 张特定的",
        "card. To decide which card to chose, Wakhan will always": "朝廷卡。瓦罕总是会按照右侧列",
        "pick the card with the highest card priority as described": "表的优先级顺序, 选择最高优先",
        "in the list on the right.": "级的卡牌。",

        "Example: Wakhan must betray a card. First, following the standard rules, it": "例子 : 瓦罕必须背叛 1 张卡牌。首先 , 按照标准规则 , 这",
        "needs to be a card where she has at least one spy. Wakhan will first look for": "张卡牌上必须至少有瓦罕的 1 个间谍。瓦罕将首先查看",
        "cards with her spies on her opponent’s courts. If there is more than one option,": "带有她间谍的对手的朝廷卡。如果有超过一种选项 , 她",
        "she will prioritize those that match the favored suit. If there is still more than": "将会优先选择匹配优势花色的卡牌。如果仍然有多种选",
        "one option, she will look for patriots of the dominant coalition etc.": "项 , 她将会以优势阵营的爱国者为优先 , 以此类推。",
        "Wakhan’s Turn": "瓦罕的回合",

        "On Wakhan’s turn, draw an AI card and place it face up to the immediate right of the AI card": "瓦罕的回合, 摸取 1 张 AI 卡, 并将其面朝上紧挨着 AI 牌库放置在其",
        "draw deck in a discard pile. You will use this face-up card and the back of the card now on top": "右侧, 形成弃牌堆。这张面朝上的卡牌以及 AI 牌库顶部当前的牌背",
        "of the draw deck to make decisions for Wakhan. If the draw deck is empty, reshuffle the entire": "将决定瓦罕如何执行行动。如果牌库用尽了, 将整个弃牌堆重洗 (包",
        "discard pile (including the card just drawn) to create a new draw deck and draw again.": "括刚刚摸取的卡牌), 构成一个新的牌库并重新摸取卡牌。",
        "Card Priority": "卡牌优先级",
        "High: Opponent’s card": "高: 对手的卡牌",
        "Matches favored suit": "匹配优势花色",
        "Patriot of the dominant coalition": "优势阵营的爱国者",
        "Has a prize that matches": "拥有匹配优势阵营",
        "the dominant coalition.": "的战利品。",
        "Other Patriot": "其他爱国者",
        "Leveraged": "有贷款符号",
        "Highest Ranking": "最高等级",
        "Low: Highest numbered card": "低: 编号最大的卡牌",

        "Wakhan then performs two actions. To determine which actions Wakhan takes, look at the cen-": "然后瓦罕执行两个行动。要确定瓦罕执行何种行动, 先查看摸取的",
        "tral Actions section of the drawn AI card; start at top action and work down, performing each": "AI 卡牌中央的行动部分; 从顶部开始往下, 依次执行每个有效行动,",
        "valid action in turn until Wakhan has performed the allotted two-action limit. If Wakhan still": "直到瓦罕已执行了两个 (非奖励) 行动。如果瓦罕在执行了底部行动",
        "has an action left after performing the bottom action, start again at the top and work your way": "后仍有行动次数剩余, 从顶部开始再次往下执行行动, 直至瓦罕执行",
        "down again until two (non-bonus) actions have been taken.": "了两个 (非奖励) 行动为止。",

        "Remember: as per the regular rules, actions taken": "请记住: 作为通常规则 , 执行优势花色卡牌上的",
        "with cards in the favored suit are bonus actions and do not count against her two-action limit. Remember too that each of these cards": "行动属于奖励行动 , 不会计入瓦罕的两个行动限制中。同时也要记住每张优势花色",
        "can still only be used for a single action per turn.": "卡牌每回合仍然只能使用一个行动。",
        "Wakhan’s Ambition.": "瓦罕的野心。",
        "If Wakhan is able to purchase the Dominance Check and score the": "无论瓦罕的 AI 卡上列出的是怎样的行动, 只要她可以",
        "most victory points and/or win the game, she will use her action to do that, regardless of": "购买优势检定卡, 并且可以在这次检定中获得最高分和/或赢得游戏,",
        "the actions listed on her AI card.": "则她便会使用她的行动去这样做。",

        "Once both actions are used, or if there are no valid choices available, Wakhan will take any": "一旦使用两个行动后, 或如果没有任何有效的行动选项存在, 瓦罕便",
        "available bonus actions from the court cards in her tableau that have not yet been used for ac-": "会从自己的朝廷卡中执行任何本回合尚未使用过的可用的奖励行动。",
        "tions. When taking bonus actions, Wakhan will always start with the leftmost, unused card on": "当执行这些奖励行动时, 瓦罕总是从自己朝廷中最左侧的未使用卡牌",
        "her court and take the leftmost action on the card, skipping any actions that cannot be taken.": "开始执行, 跳过任何无法执行的行动, 执行卡牌上最左侧的可用行动。",
        "Remember too that each of Wakhan’s court cards can still only be used for a single action per turn.": "还请记住瓦罕的每张朝廷卡每回合仍然只能使用一个行动。",
        "Wakhan’s Core Action": "瓦罕的核心行动",
        "Wakhan does not use the two core actions like a human players. Instead, she has one core action:": "瓦罕不能像普通玩家那样使用两个核心行动, 她只有一个核心行动:",
        "Radicalize.": "极端化。",
        "When Wakhan takes the radicalize action, she will purchase one": "当瓦罕执行极端化行动时, 她会从市场",
        "card from the market and then attempt to play it immediately. This counts as a": "购买 1 张卡牌, 然后尝试立即打出该卡牌。此动",
        "single action.": "作视为一个行动。",
        "When radicalizing cards, Wakhan will consider:": "当使用极端化行动时, 瓦罕将要考虑:",
        "If there are specific instructions:": "如果有特殊说明:",
        "Follow them. Ties are decided by the cheapest card in": "遵循这些说明。如果有多张卡牌符合条件, 则选择其",
        "the market with the highest card number breaking any further ties.": "中费用最低的那张, 若仍然有多张符合条件, 则选择编号最大的卡牌。",
        "If there is a Dominance Check in the Market:": "如果市场中有优势检定卡:",
        "Wakhan": "瓦罕",
        "only": "只有",
        "purchases a Dominance": "在她将从此次检定中获得最高分数 (和/或",
        "Check event card if she will score the most points from the check (and/or wins). How-": "贏得胜利) 时, 才会购买优势检定卡。除此之外, 当 1 张优势检定卡出现在市",
        "ever, when a Dominance Check is in the market, Wakhan will choose the cheapest Pa-": "场中时, 瓦罕会选择效忠优势阵营的费用最低的爱国者, 然后是拥有最多军队",
        "triot loyal to the dominant coalition, then the cheapest card with the most Army and/or": "和/或道路影响图标的卡牌当中的费用最低的牌, 或是如果没有阵营处于优势,",
        "Road impact icons, or, if no coalition is dominant, she will chose the cheapest card with": "瓦罕会选择带有最多间谍和/或部落影响图标的卡牌当中的费用最低的牌。若",
        "the most spy and/or tribe impact icons. If there is a tie, use the highest card number.": "仍然有多张卡牌符合条件, 则选择编号最大的卡牌。",
        "Otherwise:": "否则:",

        "Use the red and black arrows. The red arrow will point to either “Top” or": "使用红色与黑色箭头。红色箭头会指向 AI 牌库顶部卡牌牌背",
        "“Bottom” on the back of the top card of the draw deck and determines which market": "的 “顶部” 或 “底部” 字样, 并确定从市场的哪一行购买卡牌。黑色",
        "row to purchase from. The black arrow will point to a number between 0 and 5 on the": "箭头会指向 AI 牌库顶部卡牌牌背的一个 0 至 5 的数字。这会让",
        "back of the top card of the draw deck. This tells you which column to purchase from.": "你知道从哪一列购买卡牌。如果该卡牌不是一个有效选择, 则选择",
        "If that card is not a valid choice, pick the next valid card to its left; if Wakhan exhausts": "其左侧的下一个有效卡牌; 如果瓦罕在该行无法获得卡牌, 则切换",
        "that row then switch to the original position in the other market row.": "到另一行该数字所指的位置。",
        "Remember, like a": "请记住 , 与普通玩家一样 , 瓦罕无",
        "human player, Wakhan cannot purchase a card she has paid a rupee to this turn!": "法购买她本回合放置过卢比的卡牌！",
        "After purchasing a card from the market, Wakhan will play the card if she can afford to bribe the": "在从市场购买卡牌后, 只要瓦罕能够支付该卡牌所在地区的统治",
        "player ruling the region associated with that card. If she cannot pay the bribe, she will discard": "者的贿赂, 则将打出该卡牌。如果她无法支付贿赂, 则瓦罕将弃",
        "the card.": "置该卡牌。",
        "Wakhan should play the card to the left side of her court if the red arrow is pointing to top or the": "如果红色箭头指向顶部, 瓦罕将打出卡牌在她朝廷的左侧。如果",
        "right side of her court if the red arrow is pointing to bottom.": "红色箭头指向底部, 则打出卡牌在她朝廷的右侧。",
        "When playing a card, Wakhan will resolve the impact icons as normal with 3 modifications:": "当打出卡牌时, 瓦罕将如常结算影响图标, 除了以下三处修改:",
        "Wakhan’s Spies.": "瓦罕的间谍。",
        "Place spies on the highest priority cards associated with the played": "将间谍放置在与打出卡牌处于同一个地区, 且瓦罕间谍",
        "card’s region where Wakhan does not have the most spies.": "数量不为最多的优先级最高的卡牌上。",
        "Wakhan’s Roads.": "瓦罕的道路。",
        "Place roads on consecutive borders following the region priority on": "遵循 AI 卡的地区优先级顺序 (从左往右), 将道路放置在",
        "the AI card (leftmost first). If roads remain to be placed after going through the these": "与之相邻的边界上。如果在结算过这些地区后仍然有道路需要放置, 则",
        "regions, resolve the priority a second time.": "按照优先级顺序结算第二次。",
        "Wakhan’s Patriots.": "瓦罕的爱国者。",
        "Wakhan always places blocks based on pragmatic loyalty. Ignore the": "瓦罕总是根据实际效忠的对象来放置长方体标记。忽",
        "colour of the Patriot Impact Icons for armies and roads.": "略爱国者影响图标中军队和道路的颜色。",

        "Wakhan’s Card-Based Actions": "瓦罕的卡牌行动",
        "Most of the actions on Wakhan’s AI card are card-based actions. Unless otherwise noted, these": "瓦罕 AI 卡的大多数行动都是卡牌行动。除非特别说明, 否则这些",
        "actions will always follow the same restrictions as those taken by players": "行动总是与普通玩家执行时遵循相同的限制。",
        "e.g. Wakhan cannot tax a": "例如 , 除非瓦罕统治",
        "player unless she rules a territory where that player has a court card and that player has some rupees outside of their": "玩家拥有的某张朝廷卡相关的地区 , 并且该玩家在其避税范围外有额外",
        "tax shelter.": "卢比 , 否则瓦罕不能向该玩家征税。",
        "When selecting which card on her court will be used to take the listed action, Wakhan will al-": "当瓦罕选择使用自己朝廷中的哪张卡来执行所列出的行动时, 瓦罕",
        "ways used the highest priority card among those that could legally take the action.": "总是使用能够合法执行该行动的优先级最高的卡牌。",
        "Many actions on the AI card will list a set of instructions and conditions which must be true in": "许多 AI 卡上的行动都会列出一段特殊说明, 这是要执行该行动所",
        "order for the action to be taken. If these conditions cannot be met, the action is skipped. If no": "必须符合的条件。如果这些条件无法符合, 则跳过该行动。如果没",
        "conditions are stated, Wakhan will use the following default behavior when resolving the action.": "有列出条件, 当结算行动时, 瓦罕将会遵循以下的默认规则。",

        "Gift.": "礼物。",
        "Wakhan will buy the cheapest gift she can afford to buy, placing it on her": "瓦罕会购买她能够购买的费用最低的礼物, 将其放置在她的",
        "aid card.": "提示卡上。",
        "Remember: this Gift will count as influence in all three coalitions.": "请记住: 瓦罕的礼物对所有三个阵营都会计算影响力。",
        "Build.": "建造。",
        "Wakhan will build armies in the leftmost region as listed on the AI card": "瓦罕会在 AI 卡上最靠左的统治地区建造军队。她会",
        "that she rules. She will spend as much of her money as possible.": "尽可能多得使用她的卢比。",
        "Betray.": "背叛。",
        "Wakhan will betray the highest priority card with a loyalty prize where": "瓦罕会对带有战利品且有自己间谍存在的优先级最高",
        "she also has a spy, including those in her court. She will always take the loyalty": "的 1 张卡牌执行背叛 (包括位于自己朝廷的)。她总是会获得",
        "prize.": "战利品。",

        "Battle.": "战斗。",
        "Wakhan will battle in the region where another player has pieces (tribes,": "瓦罕会在另一位玩家有物件(部落与效忠的道路/军队)",
        "loyal armies or roads) and she has at least one army. If multiple regions fulfill": " 存在, 且自己拥有至少 1 个军队的地区进行战斗。如果多个地",
        "this condition, use the leftmost region as listed on the AI card. Once the region": "区符合该条件, 使用 AI 卡列出的最左侧的地区。一旦选择该",
        "is chosen she will try to destroy tribes, armies, and roads in that order. If no re-": "地区后, 她会按照顺序依次尝试摧毁部落、军队, 最后是道路。",
        "gion is chosen, she will battle on the highest priority court card where she and": "如果没有地区可选择, 她会在她与另一位玩家都拥有间谍的优",
        "another player have spies.": "先级最高的朝廷卡牌上进行战斗。",
        "If multiple players can be targeted in a battle action, use the red arrow to deter-": "如果在一个战斗行动中有多个玩家可以成为目标, 使用红色箭",
        "mine which player is targeted.": "头来确定哪位玩家成为目标。",
        "Tax.": "征税。",
        "Wakhan will always tax players instead of market cards if able. She will": "如果可能的话, 瓦罕总是会向玩家征税, 而不是市场中",
        "always tax from players with the most rupees first. If both players are tied, use": "的卡牌。她总是优先会从卢比最多的玩家处征税。如果两位",
        "the red arrow to determine which player is targeted. If no players can be taxed,": "玩家卢比同样多, 使用红色箭头来确定哪位玩家成为目标。如",
        "she will tax from the market, taking rupees from the leftmost market cards and": "果没有玩家能够被征税, 则瓦罕会从市场征税, 从最左侧的市",
        "using the red arrow to determine ties.": "场卡牌拿取卢比, 并在平手时使用红色箭头来判定。",
        "Move.": "移动。",
        "Wakhan only moves armies and does not require any roads to facilitate": "瓦罕只会移动军队, 并且不需要任何道路来确保移动。",
        "movement. When moving, Wakhan will only move her armies to adjacent re-": "当移动时, 瓦罕只会将她的军队移动到有其他玩家部落的相邻",
        "gions where other players have tribes, using the region priority on the AI card to": "地区, 使用 AI 卡的地区优先级来确定同等情况下更为优先的",
        "determine the choice between equally viable origins and destinations. She will": "起点与终点。她将力求只拥有与该地区部落数量相同的军队。",
        "seek to have only as many armies as there are tribes in that region. Wakhan will": "如果移动某个军队会导致瓦罕失去统治指示物, 则她不会移动",
        "not move Armies if doing so would cause her to lose a ruler token.": "这个军队。",
        "When discarding cards from Wakhan’s court during cleanup, discard non-political cards first,": "在清理阶段, 当从瓦罕的朝廷弃置卡牌时, 优先弃置非政治卡牌, 然后",
        "then non-patriots, then non-leveraged cards, then cards with the most player spies more than": "是非爱国者卡牌, 然后是非贷款卡牌, 然后是卡牌上玩家间谍比瓦罕间",
        "Wakhan spies, fewest spies, lowest rank, not matching the favored suit, and then lowest card": "谍更多且差值最大的卡牌, 然后是间谍最少的卡牌, 然后是最低等级的",
        "number.": "卡牌, 然后是不匹配优势花色的卡牌, 最后是编号最小的卡牌。",
        "Dominance Checks and Victory": "优势检定与胜利条件",
        "Wakhan will claim VPs and victory just like a regular player. Remember that Wakhan is loyal to": "瓦罕与普通玩家一样获得分数以及赢得胜利。请记住瓦罕效忠于所有",
        "all coalitions so she will be in the running no matter which coalition is dominant.": "阵营, 因此无论哪个阵营处于优势, 瓦罕都有机会得分。",
        "Notes": "注记",
        "Credits": "工作人员",
        "Game Design, Graphic Design, and Research:": "游戏设计, 图形设计, 以及背景研究:",
        "Cole Wehrle": "Cole Wehrle",
        "Development:": "游戏开发:",
        "Drew Wehrle (Second Edition), Phil Eklund": ":Drew Wehrle (第二版),",
        "(First Edition)": "Phil Eklund (第一版)",
        "Design of Wakhan:": "瓦罕设计:",
        "Richard Wilkins": "Richard Wilkins",
        "Editor:": "游戏编辑:",
        "Travis D. Hill": "Travis D. Hill",
        "Calligraphy for Cover:": "封面字体设计:",
        "Josh Berer": "Josh Berer",
        "Icon Illustrations:": "图标绘制:",
        "Abol Bahadori": "Abol Bahadori",
        "Tabletop Simulator Module:": "Tabletop Simulator模组开发设计:",
        "Josh (AgentElrond)": "Josh (AgentElrond)",
        "Primary Playtesters:": "主要测试人员:",
        "Blake Wehrle, Cati Wehrle, Chas Threlkeld, Graham MacDonald, Corey": "Blake Wehrle, Cati Wehrle, Chas Threlkeld, Graham MacDonald, Corey",
        "Porter, Grayson Page and his group (Martin Weeks, Tony Au, and Jared Arkin), and the many": "Porter, Grayson Page 与他的团队 (Martin Weeks, Tony Au, 与 Jared Arkin), 以及许多来自",
        "excellent players of the First Minnesota.": "First Minnesota俱乐部的杰出玩家。",
        "Design History and Dedication": "设计历程与后记",

        "The design of Pax Pamir began shortly after the release of Phil Eklund’s": "帕米尔和平的设计开始于2012年Phil Eklund的",
        "Pax Porfiriana": "Pax Porfiriana",
        "in 2012.": "发行后不久。在规则书背面，Phil添",
        "At the back of the rulebook, Phil included a small note, urging anyone with an interesting set-": "加了一小段注记，鼓励任何有兴趣的人提交设计作品到Sierra Madre Games。在这一要求的激励下，",
        "ting in mind to submit a design to Sierra Madre Games. Spurred by this request, I began work-": "我开始制作了数款游戏，包括Lords of the Renaissance的改编，以及一款俄罗斯党派扩张的游戏。这",
        "ing on several games, including an adaption of": "",
        "Lords of the Renaissance": "",
        "and a game on Russian": "",
        "expansion in the Caucuses. Both of those designs failed to mature, but the work put me in direct": "",
        "contact with Phil and got me thinking seriously about game design. In late 2013, as I helped Phil": "",
        "playtest": "",
        "Greenland": "",
        ", he encouraged me to try my hand at a Pax design on The Great Game. The": "",
        "design for the first edition was submitted to Sierra Madre Games in the fall of 2014 and was pub-": "",
        "lished the following year after receiving additional development from Phil and Matt Eklund.": "",
        "Though": "",
        "was well-received, my own feelings on the first production were mixed. Sim-": "",
        "ply put, I felt like I had strayed from some of my original hopes for an accessible Pax design": "",
        "that was both more strategic and more dependent on emergent partnerships than": "",
        "These feelings led to the creation of": "",
        "Pamir": "",
        "’s expansion,": "",
        "Khyber Knives": "",
        ". By the end of its develop-": "",
        "ment, I had answered some of my initial misgivings, but I still felt that the game deserved a full": "",
        "overhaul. Expansions are fundamentally additive, and some problems can only be addressed by": "",
        "altering the foundations. So, after submitting the files to the factory, I wrote myself a long memo": "",
        "on the design of": "",
        "and tucked it away on the off-chance that I would have an opportu-": "",
        "nity to revisit the project someday.": "",
        "sold as well as its predecessor, and the game continued to get good reviews. Pretty": "",
        "soon it was out-of-print. As requests came in from other publishers for the license to": "",
        "in": "",
        "2016 and 2017, the possibility of a freshly-developed second edition became more likely. Without": "",
        "knowing exactly what I was going to do with the final product, my brother Drew and I began": "",
        "working on a new edition of": "",
        "found ourselves increasingly interested in the game’s overall product design, inspired by the": "",
        "dramatic productions of games like": "",
        "Ortus Regni": "",
        "Sol: Last Days of a Star": "",
        ", and the work of Jordan": "",
        "Draper and Nate Hayden. Once we had a clear vision for the new edition, we brought the game": "",
        "This project would not have been possible without the support of our friends, family, and the": "",
        "many fans of the game who encouraged us to take on this project and who helped raise the funds": "",
        "required to print this edition. We happily dedicate the work of the past year to you all.": "",
        "In addition, I’d like single out a trio of excellent mentors, without whom this game would not": "",
        "exist: Samuel Baker, Phil Eklund, and Patrick Leder.": "",

        "Special thanks are also owed to Dan": "特别感谢Dan Thurot对游戏的早期",
        "Thurot whose excellent critique of an": "迭代版本做出的杰出测评，让最终",
        "early iteration made the final game all": "游戏的一切都变得更棒，感谢A1ex",
        "the better, to Alex Singh who crafted a": "Singh为我们的游戏发布及时制作",
        "wonderful review (and video) just in time": "了一个精彩的评论（与视频），还",
        "for our launch, and to Joe Wiggins for the": "要感谢Joe Wiggins与Panda的团队",
        "care he and the team at Panda invested in": "在这个项目中所投入的关注。",
        "this project. I would also thank the team": "\u200b",
        "at the University of Wyoming’s American": "\u200b",
        "Heritage Center for access to many pieces": "\u200b",
        "of artwork used in this game.": "\u200b",

        "Pax Pamir: Second Edition, Second Printing, 2020": "帕米尔和平: 第二版, 第二次印刷, 2020",
        "Game Published by Wehrlegig Games llc": "Wehrlegig Games llc 版权所有",
        "This game is licensed under": "",
        "Creative Commons license BY–NC–SA 4.0.": "",
        "Reading the Great Game": "读懂大博弈",
        "Most of the stories about the Great Game reveal far more about the Western": "",
        "imagination than they do about central Asia in the nineteenth century. Partly": "",
        "this is a consequence of recent history. Many stories about this period were": "",
        "produced during the Cold War and staked their relevance on the parallels": "",
        "they drew between the nineteenth and twentieth centuries. John Huston’s": "",
        "rollicking adventure film": "",
        "The Man Who Would Be King": "",
        "(itself an adaption of": "",
        "a earlier Kipling story) speaks as much to anxieties over the Vietnam War": "",
        "as to the hubris of the British Empire. Even Peter Hopkirk’s": "",
        "The Great Game": "",
        "(1992), an otherwise excellent and well-written history, cannot quite escape": "",
        "the shadow of a half century of spy thrillers, nor should we expect it to.": "",
        "Every creation reflects the values of its author and the world of its creation.": "",
        "We may have escaped the shadow of the Cold War, but our own period is no": "",
        "less vexed. Our histories brim with anxieties about representation, ideology,": "",
        "and the limits of understanding. Thankfully, these concerns are well-suited to": "",
        "any study of the Great Game.": "",
        "For those looking to learn more about the period, begin with William": "",
        "Dalrymple’s": "",
        "Return of a King": "",
        "(2012). Dalrymple’s book is particularly nota-": "",
        "ble both for its gripping narrative style and its incredible archival range that": "",
        "draws from a vast trove of poetry, history, and first-hand accounts. Many of": "",
        "these sources were previously unpublished in English.": "",
        "For those looking to go deeper, there are many excellent sources for further": "",
        "reading. Be warned, the following books are quite expensive, so a library card": "",
        "is recommended. The single most important source for the biographies in the": "",
        "game and the game’s general narrative sense can be found in Fayż Muhammad": "",
        "Kātib Hazārah’s": "",
        "Sirāj al-tawārīkh": "",
        "as translated by R.D. McChesney (2012).": "",
        "For a more measured and scholarly view on the dynamics of Afghan poli-": "",
        "tics in this period, see Christine Noelle’s": "",
        "State and Tribe in Nineteenth Century": "",
        "Afghanistan": "",
        "(1997). I drew from this book extensively during the early stages": "",
        "of the design, and it informed the game’s attempt to capture what political": "",
        "will meant in the context of Afghanistan at this time with a largely zero-sum": "",
        "economic system.": "",
        "For those looking for a exhaustive treatment of European (especially British)": "",
        "foreign policy in the region during this period, look to the work of M. E.": "",
        "Yapp, especially": "",
        "Strategies of British India, Britain, Iran and Afghanistan": "",
        "(1980).": "",
        "The game’s emphasis on intelligence resources comes largely from C.A.": "",
        "Bayly’s magisterial": "",
        "Empire and Information": "",
        "(2000). Bayly argues that a large": "",
        "portion of the British success in India was tied to their ability to control": "",
        "information and participate in an economy of intelligence with the other": "",
        "centers of political power. The general theories of empire and dominance": "",
        "come from Jane Burbank and Frederick Cooper’s": "",
        "Empires in World History:": "",
        "Power and the Politics of Difference": "",
        "(2011). Burbank and Cooper suggest that": "",
        "empire is not hegemonic in practice, and that an effective imperial opera-": "",
        "tion requires a robust infrastructure that is sensitive to traditional centers of": "",
        "power. This book also greatly informed the foundational political theories in": "",
        "my design for": "",
        "Root": "",
        "(2018).": "",
    },
    "regexp": [ // 正则翻译
        ...I18N.zh["pubilc"]["regexp"],
    ],
};

I18N.zh["pax-pamir"] = { // 游戏页面翻译
    "static": { // 静态翻译
        ...I18N.zh["pubilc"]["static"],
        "Russian": "俄国",
        "British": "英国",
        "Afghan": "阿富汗",
        "Undo": "撤销",
        "Transcaspia": "特兰斯卡斯皮亚",
        "Herat": "赫拉特",
        "Persia": "波斯",
        "Kabul": "喀布尔",
        "Kandahar": "坎大哈",
        "Punjab": "旁遮普",

        "Transcaspia/Herat": "特兰斯卡斯皮亚/赫拉特",
        "Transcaspia/Kabul": "特兰斯卡斯皮亚/喀布尔",
        "Persia/Transcaspia": "波斯/特兰斯卡斯皮亚",
        "Herat/Kandahar": "赫拉特/坎大哈",
        "Kabul/Kandahar": "喀布尔/坎大哈",
        "Herat/Kabul": "赫拉特/喀布尔",
        "Persia/Herat": "波斯/赫拉特",
        "Kabul/Punjab": "喀布尔/旁遮普",
        "Kandahar/Punjab": "坎大哈/旁遮普",

        "Mohan Lal": "默汗·拉尔",
        "Jan-Fishan Khan": "扬·费山汗",
        "Prince Akbar Khan": "阿克巴尔汗王子",
        "Charles Stoddart": "查尔斯·斯托达特",
        "Shah Shujah Durrani": "沙阿·舒贾·杜兰尼",
        "Aminullah Khan Logari": "阿米努拉汗·洛贾里",
        "Dost Mohammad": "多斯特·穆罕默德",
        "Kabul Bazaar": "喀布尔市场",
        "Afghan Handicrafts": "阿富汗手工艺品",
        "Balkh Arsenic Mine": "巴尔赫砷矿",
        "Lapis Lazuli Mine": "青金石矿",
        "City of Ghazni": "伽兹尼城",
        "Ghilzai Nomads": "吉尔扎伊游牧民",
        "Money Lenders": "放债者",
        "Durrani Royal Guard": "杜兰尼皇家卫队",
        "Bala Hissar": "巴拉希萨尔",
        "Citadel of Ghazni": "伽兹尼要塞",
        "Harry Flashman": "哈利·弗拉希曼",
        "Eldred Pottinger": "埃尔德雷德·璞鼎查",
        "Henry Rawlinson": "亨利·罗林森",
        "Alexander Burnes": "亚历山大·伯恩斯",
        "George Hayward": "乔治·海沃德",
        "Henry Pottinger": "亨利·璞鼎查",
        "Ranjit Singh": "兰吉特·辛格",
        "Josiah Harlan": "乔赛亚·哈伦",
        "Paolo Avitabile": "保罗·阿维塔比尔",
        "Maqpon Dynasty": "默格本王朝",
        "Anarkali Bazaar": "阿娜卡莉集市",
        "Khyber Pass": "开伯尔山口",
        "Sikh Merchants in Lahore": "拉合尔的锡克商人",
        "Company Weapons": "东印度公司武器",
        "Army of the Indus": "印度河军队",
        "Zorawar Singh Kahluria": "佐拉瓦·辛格·卡鲁里亚",
        "Sindhi Warriors": "信德勇士",
        "Hari Singh Nalwa": "哈里·辛格·纳尔瓦",
        "Bengal Native Infantry": "孟加拉步兵团",
        "Seaforth Highlanders": "瑟福斯高地团",
        "Akali Sikhs": "神圣的锡克人",
        "William Moorcroft": "威廉·穆克罗夫特",
        "William Hay Macnaghten": "威廉·海·麦克诺滕",
        "Charles Masson": "查尔斯·马森",
        "Barakzai Sadars": "巴拉克扎伊的萨达尔人",
        "Giljee Nobles": "基尔吉贵族",
        "Baluchi Chiefs": "俾路支族长",
        "Haji Khan Kakar": "哈吉汗·卡卡尔",
        "Bank": "银行",
        "Bolan Pass": "博兰山口",
        "Fruit Markets": "水果市场",
        "Kandahari Markets": "坎大哈市场",
        "British Regulars": "英国正规军",
        "Sir John Keane": "约翰‧基恩爵士",
        "Pashtun Mercenary": "普什图雇佣兵",
        "Jezail Sharpshooters": "杰撒伊神枪手",
        "Herati Bandits": "赫拉特土匪",
        "Hazara Chiefs": "哈扎拉族长",
        "Yar Mohammad Alikozai": "亚尔‧穆罕默德‧阿利科扎伊",
        "Exiled Durrani Nobility": "流亡的杜兰尼贵族",
        "Ishaqzai Chiefs": "伊沙扎伊族长",
        "Tajik Warband": "塔吉克战团",
        "Nomadic Warlord": "游牧劫掠者",
        "Karakul Sheep": "卡拉库尔羊",
        "Qanat System": "暗渠系统",
        "Farah Road": "法拉之路",
        "Opium Fields": "罂粟田地",
        "Minaret of Jam": "贾姆尖塔",
        "Baluchi Smugglers": "俾路支走私者",
        "Wheat Fields": "小麦田地",
        "Ghaem Magham Farahani": "加埃姆·马格哈姆·法拉哈尼",
        "Count Ivan Simonich": "伊万·西蒙尼奇伯爵",
        "Alexander Griboyedov": "亚历山大·格里鲍耶陀夫",
        "Joseph Wolff": "约瑟夫·沃尔夫",
        "Claude Wade": "克劳德·韦德",
        "Jean-François Allard": "让·弗朗索瓦·阿拉德",
        "Hajj Mirza Aghasi": "哈吉·米尔扎·阿加西",
        "Abbas Mirza": "阿巴斯·米尔札",
        "Fath-Ali Shah": "法塔赫·阿里·沙阿",
        "Mohammad Shah": "穆罕默德·沙阿",
        "Civic Improvements": "市政改良",
        "Persian Slave Markets": "波斯奴隶市场",
        "Anglo-Persian Trade": "英波贸易",
        "Russo-Persian Trade": "俄波贸易",
        "Persian Army": "波斯军队",
        "Shah's Guard": "沙阿的卫队",
        "Russian Regulars": "俄国正规军",
        "Bukharan Jews": "布哈拉犹太人",
        "Jan Prosper Witkiewicz": "扬·普洛斯珀·维特基维奇",
        "Imperial Surveyors": "帝国测绘员",
        "Arthur Conolly": "亚瑟·康诺利",
        "Aga Mehdi": "阿加·梅赫迪",
        "Nasrullah Khan": "纳斯鲁拉汗",
        "Allah Quli Bahadur": "阿拉·库里·巴哈杜尔汗",
        "Mir Murad Beg": "米尔·穆拉德·贝格",
        "Madali Khan": "马达利汗",
        "Khivan Slave Markets": "希瓦奴隶市场",
        "Supplies from Orenburg": "奥伦堡的补给",
        "Panjdeh Oasis": "潘德绿洲",
        "Ark of Bukhara": "布哈拉方舟",
        "European Cannons": "欧洲火炮",
        "Cossacks": "哥萨克骑兵",
        "Count Perovsky": "佩罗夫斯基伯爵",
        "Dominance Check": "优势检定",
        "Military / New Tactics": "军事 / 新的战术",
        "Embarrassment of Riches / Koh-i-noor Recovered": "富裕下的窘境 / 修复“光之山”",
        "Disregard for Customs / Courtly Manners": "漠视传统 / 举止谦恭",
        "Failure to Impress / Rumor": "糟糕的印象 / 谣言四起",
        "Riots in Punjab / Conflict Fatigue": "旁遮普暴乱 / 疲于战斗",
        "Riots in Herat / Nationalism": "赫拉特暴乱 / 民族主义",
        "No effect / Public Withdrawal": "无效果 / 公开撤离",
        "Riots in Kabul / Nation Building": "喀布尔暴乱 / 国家建设",
        "Riots in Persia / Backing of Persian Aristocracy": "波斯暴乱 / 波斯贵族的支持",
        "Confidence Failure / Other Persuasive Methods": "丧失信任 / 其他的说服方式",
        "Intelligence / Pashtunwali Values": "情报 / 普什图瓦里价值观",
        "Political / Rebuke": "政治 / 谴责非难",

        "⬅ Play to left side": "⬅ 打出至左侧",
        "➡ Play to right side": "➡ 打出至右侧",
        ".": "。",
        "Purchased": "购买",
        "Played": "打出",
        "Spy to": "间谍放置到",
        "Blackmail spy to": "勒索间谍放置到",
        "Discarded": "弃置",
        "Dominance Checks": "优势检定",
        "Events": "事件",
        "EVENT": "事件",
        "Taxed market.": "征税市场。",
        "Are you sure that you want to resign?": "你确定要放弃吗？",
        "Resign": "放弃",
        "Go to next game": "前往下一局游戏",
        "Chat": "聊天",
        "Notepad": "笔记本",
        "Notepad: Gray": "笔记本: 灰色",
        "Notepad: Blue": "笔记本: 蓝色",
        "Notepad: Red": "笔记本: 红色",
        "Notepad: Black": "笔记本: 黑色",
        "Notepad: Tan": "笔记本: 棕色",

        "Save": "保存",
        "Cancel": "取消",
        "End turn": "结束回合",
        "End game": "结束游戏",
        "Next": "下一个",
        "Pass": "略过",
        "Refuse": "拒绝",
        "Accept": "接受",
        "Waive": "免除",
        "Pay": "支付",
        "Beg": "请求",
        "Courtly Manners": "举止谦恭",
        "road": "道路",
        "army": "军队",
        "tribe": "部落",




        // prompt
        // "Waiting for Gray — loyalty...": "等待",
        "Connecting...": "连接中...",
        "You may take two actions.": "你可以执行两个行动。",
        "You may take one more action.": "你可以再执行一个行动。",
        "You have no more actions.": "你没有更多的行动。",
        "You have no more actions. You may take bonus actions.": "你没有更多的行动。你可以执行奖励行动。",
        "You may take two actions. You may take bonus actions.": "你可以执行两个行动。你可以执行奖励行动。",
        "You may take one more action. You may take bonus actions.": "你可以再执行一个行动。你可以执行奖励行动。",
        "Choose your loyalty — Afghan, British, or Russian.": "选择你的效忠对象 — 阿富汗, 英国, 或俄国。",
        "Discard cards from your hand or court to pay back leverage.": "从你的手牌或朝廷中弃置卡牌, 以偿还贷款。",
        "Discard cards from your hand or court to pay back leverage \u2014 done.": "从你的手牌或朝廷中弃置卡牌, 以偿还贷款 \u2014 完成。",
        "Select cylinder to place as Gift.": "选择一个圆柱体标记以放置作为礼物。",
        "Place cylinder as Gift.": "放置圆柱体标记作为礼物。",
        "Place an additional block.": "放置一个额外的长方体标记。",
        "Discard cards in your court until you are within your limit \u2014 done.": "你必须将你朝廷中的卡牌弃置到你的上限数量 \u2014 完成。",
        // "Discard cards in your court until you are within your limit (${size}).": "",
        "Discard cards in your court until you are within your limit (3).": "你必须将你朝廷中的卡牌弃置到你的上限数量 (3)。",
        "Discard cards in your court until you are within your limit (4).": "你必须将你朝廷中的卡牌弃置到你的上限数量 (4)。",
        "Discard cards in your court until you are within your limit (5).": "你必须将你朝廷中的卡牌弃置到你的上限数量 (5)。",
        "Discard cards in your court until you are within your limit (6).": "你必须将你朝廷中的卡牌弃置到你的上限数量 (6)。",
        "Discard cards in your court until you are within your limit (7).": "你必须将你朝廷中的卡牌弃置到你的上限数量 (7)。",
        "Discard cards in your court until you are within your limit (8).": "你必须将你朝廷中的卡牌弃置到你的上限数量 (8)。",
        "Discard cards in your court until you are within your limit (9).": "你必须将你朝廷中的卡牌弃置到你的上限数量 (9)。",
        "Discard cards in your court until you are within your limit (10).": "你必须将你朝廷中的卡牌弃置到你的上限数量 (10)。",
        "Discard cards in your hand until you are within your limit \u2014 done.": "你必须将你手牌中的卡牌弃置到你的上限数量 \u2014 完成。",
        // "Discard cards in your hand until you are within your limit (${size}).": "",
        "Discard cards in your hand until you are within your limit (2).": "你必须将你手牌中的卡牌弃置到你的上限数量 (2)。",
        "Discard cards in your hand until you are within your limit (3).": "你必须将你手牌中的卡牌弃置到你的上限数量 (3)。",
        "Discard cards in your hand until you are within your limit (4).": "你必须将你手牌中的卡牌弃置到你的上限数量 (4)。",
        "Discard cards in your hand until you are within your limit (5).": "你必须将你手牌中的卡牌弃置到你的上限数量 (5)。",
        "Discard cards in your hand until you are within your limit (6).": "你必须将你手牌中的卡牌弃置到你的上限数量 (6)。",
        "Discard cards in your hand until you are within your limit (7).": "你必须将你手牌中的卡牌弃置到你的上限数量 (7)。",
        "Discard cards in your hand until you are within your limit (8).": "你必须将你手牌中的卡牌弃置到你的上限数量 (8)。",
        "Discard cards in your hand until you are within your limit (9).": "你必须将你手牌中的卡牌弃置到你的上限数量 (9)。",
        "Discard cards in your hand until you are within your limit (10).": "你必须将你手牌中的卡牌弃置到你的上限数量 (10)。",
        "Discard any event cards in the leftmost column of the market.": "弃置已位于市场最左列的所有事件卡。",
        "Instability \u2014 perform a Dominance Check immediately.": "动荡 \u2014 立即执行一次优势检定。",
        "Insurrection \u2014 pass control to Tan.": "起义 \u2014 传递控制权给棕色。",
        "Insurrection \u2014 pass control to Blue.": "起义 \u2014 传递控制权给蓝色。",
        "Insurrection \u2014 pass control to Gray.": "起义 \u2014 传递控制权给灰色。",
        "Insurrection \u2014 pass control to Red.": "起义 \u2014 传递控制权给红色。",
        "Insurrection \u2014 pass control to Black.": "起义 \u2014 传递控制权给黑色。",
        "Insurrection \u2014 select an Afghan block to move.": "起义 \u2014 选择移动一个阿富汗阵营长方体标记。",
        "Insurrection \u2014 place Afghan army in Kabul.": "起义 \u2014 将阿富汗军队放置在喀布尔。",
        "Insurrection \u2014 done.": "起义 \u2014 完成。",
        "Pashtunwali Values \u2014 choose a suit to favor.": "普什图瓦里价值观 \u2014 选择一种花色成为优势花色。",
        "Rebuke \u2014 remove all tribes and armies in a single region.": "谴责非难 \u2014 移除一个地区中的所有部落和军队。",
        "Tan asks you to waive the bribe to play": "棕色请求你免除贿赂以打出",
        "Red asks you to waive the bribe to play": "红色请求你免除贿赂以打出",
        "Blue asks you to waive the bribe to play": "蓝色请求你免除贿赂以打出",
        "Gray asks you to waive the bribe to play": "灰色请求你免除贿赂以打出",
        "Black asks you to waive the bribe to play": "黑色请求你免除贿赂以打出",

        "Tan asks you to waive the bribe to use": "棕色请求你免除贿赂以使用",
        "Red asks you to waive the bribe to use": "红色请求你免除贿赂以使用",
        "Blue asks you to waive the bribe to use": "蓝色请求你免除贿赂以使用",
        "Gray asks you to waive the bribe to use": "灰色请求你免除贿赂以使用",
        "Black asks you to waive the bribe to use": "黑色请求你免除贿赂以使用",

        "Asked Tan to waive the bribe to play": "请求棕色免除贿赂以打出",
        "Asked Red to waive the bribe to play": "请求红色免除贿赂以打出",
        "Asked Blue to waive the bribe to play": "请求蓝色免除贿赂以打出",
        "Asked Gray to waive the bribe to play": "请求灰色免除贿赂以打出",
        "Asked Black to waive the bribe to play": "请求黑色免除贿赂以打出",

        "Asked Tan to waive the bribe to use": "请求棕色免除贿赂以使用",
        "Asked Red to waive the bribe to use": "请求红色免除贿赂以使用",
        "Asked Blue to waive the bribe to use": "请求蓝色免除贿赂以使用",
        "Asked Gray to waive the bribe to use": "请求灰色免除贿赂以使用",
        "Asked Black to waive the bribe to use": "请求黑色免除贿赂以使用",



        "Confidence Failure \u2014 discard a card from your hand.": "丧失信任 \u2014 从你的手牌中弃置一张卡牌。",
        "Rumor \u2014 choose a player.": "谣言四起 \u2014 选择一位玩家",
        "Other Persuasive Methods \u2014 exchange your hand with another player.": "其他的说服方式 \u2014 将你的手牌和另一位玩家进行交换。",

        // Blackmail
        "Blackmail \u2014 select a spy to place on any Herat and/or Kandahar court card without a spy.": "勒索 \u2014 选择将一个间谍放置在一张没有间谍存在的赫拉特和/或坎大哈朝廷卡上。",
        "Blackmail \u2014 select a spy to place on any Herat court card without a spy.": "勒索 \u2014 选择将一个间谍放置在一张没有间谍存在的赫拉特朝廷卡上。",
        "Blackmail \u2014 select a spy to place on any Kandahar court card without a spy.": "勒索 \u2014 选择将一个间谍放置在一张没有间谍存在的坎大哈朝廷卡上。",

        "Blackmail \u2014 place a spy on any Herat and/or Kandahar court card without a spy.": "勒索 \u2014 放置一个间谍在一张没有间谍存在的赫拉特和/或坎大哈朝廷卡上。",
        "Blackmail \u2014 place a spy on any Herat court card without a spy.": "勒索 \u2014 放置一个间谍在一张没有间谍存在的赫拉特朝廷卡上。",
        "Blackmail \u2014 place a spy on any Kandahar court card without a spy.": "勒索 \u2014 放置一个间谍在一张没有间谍存在的坎大哈朝廷卡上",

        "Safe House \u2014 you may place your killed spy on a Safe House.": "安全屋 \u2014 你可以将你被杀的间谍放置到安全屋上。",
        "Start a battle in a single region or on a court card.": "在一个地区或一张朝廷卡上开始一场战斗。",
        "Tax \u2014 take up to 1 rupee from market cards or players.": "征税 \u2014 从市场卡牌上或玩家处获得至多 1 卢比。",
        "Tax \u2014 take up to 2 rupees from market cards or players.": "征税 \u2014 从市场卡牌上或玩家处获得至多 2 卢比。",
        "Tax \u2014 take up to 3 rupees from market cards or players.": "征税 \u2014 从市场卡牌上或玩家处获得至多 3 卢比。",
        "Tax \u2014 take up to 4 rupees from market cards or players.": "征税 \u2014 从市场卡牌上或玩家处获得至多 4 卢比。",
        "Tax \u2014 take up to 5 rupees from market cards or players.": "征税 \u2014 从市场卡牌上或玩家处获得至多 5 卢比。",
        "Tax \u2014 take up to 6 rupees from market cards or players.": "征税 \u2014 从市场卡牌上或玩家处获得至多 6 卢比。",
        "Tax \u2014 take up to 7 rupees from market cards or players.": "征税 \u2014 从市场卡牌上或玩家处获得至多 7 卢比。",
        "Tax \u2014 take up to 8 rupees from market cards or players.": "征税 \u2014 从市场卡牌上或玩家处获得至多 8 卢比。",
        "Tax \u2014 take up to 9 rupees from market cards or players.": "征税 \u2014 从市场卡牌上或玩家处获得至多 9 卢比。",
        "Tax \u2014 take up to 9 rupees from market cards or players.": "征税 \u2014 从市场卡牌上或玩家处获得至多 10 卢比。",
        "Remove up to 1 spies on": "移除至多 1 个间谍位于",
        "Remove up to 2 spies on": "移除至多 2 个间谍位于",
        "Remove up to 3 spies on": "移除至多 3 个间谍位于",
        "Remove up to 4 spies on": "移除至多 4 个间谍位于",
        "Remove up to 5 spies on": "移除至多 5 个间谍位于",
        "Remove up to 6 spies on": "移除至多 6 个间谍位于",
        "Remove up to 7 spies on": "移除至多 7 个间谍位于",
        "Remove up to 8 spies on": "移除至多 8 个间谍位于",
        "Remove up to 9 spies on": "移除至多 9 个间谍位于",
        "Remove up to 10 spies on": "移除至多 10 个间谍位于",
        "Move spy from": "移动间谍从",
        "Build up to 1 armies and/or roads.": "建造至多 1 个军队和/或道路。",
        "Build up to 2 armies and/or roads.": "建造至多 2 个军队和/或道路。",
        "Build up to 3 armies and/or roads.": "建造至多 3 个军队和/或道路。",
        "Build up to 4 armies and/or roads.": "建造至多 4 个军队和/或道路。",
        "Build up to 5 armies and/or roads.": "建造至多 5 个军队和/或道路。",
        "Build up to 6 armies and/or roads.": "建造至多 6 个军队和/或道路。",
        "Build up to 7 armies and/or roads.": "建造至多 7 个军队和/或道路。",
        "Build up to 8 armies and/or roads.": "建造至多 8 个军队和/或道路。",
        "Build up to 9 armies and/or roads.": "建造至多 9 个军队和/或道路。",
        "Build up to 10 armies and/or roads.": "建造至多 10 个军队和/或道路。",

        "Battle on": "战斗位于",
        "is over \u2014 undo will not be possible.": "已结束 \u2014 无法撤销。",

        "You may accept": "你可以接受",
        "as an Afghan prize.": "作为一个阿富汗战利品。",
        "as a Russian prize.": "作为一个俄国战利品。",
        "as a British prize.": "作为一个英国战利品。",
        // 必须支付 1 卢比给
        "Must pay 1 rupee bribe to Tan.": "必须支付 1 卢比给棕色。",
        "Must pay 1 rupee bribe to Red.": "必须支付 1 卢比给红色。",
        "Must pay 1 rupee bribe to Black.": "必须支付 1 卢比给黑色。",
        "Must pay 1 rupee bribe to Gray.": "必须支付 1 卢比给灰色。",
        "Must pay 1 rupee bribe to Blue.": "必须支付 1 卢比给蓝色。",
        "Must pay 2 rupee bribe to Tan.": "必须支付 2 卢比给棕色。",
        "Must pay 2 rupee bribe to Red.": "必须支付 2 卢比给红色。",
        "Must pay 2 rupee bribe to Black.": "必须支付 2 卢比给黑色。",
        "Must pay 2 rupee bribe to Gray.": "必须支付 2 卢比给灰色。",
        "Must pay 2 rupee bribe to Blue.": "必须支付 2 卢比给蓝色。",
        "Must pay 3 rupee bribe to Tan.": "必须支付 3 卢比给棕色。",
        "Must pay 3 rupee bribe to Red.": "必须支付 3 卢比给红色。",
        "Must pay 3 rupee bribe to Black.": "必须支付 3 卢比给黑色。",
        "Must pay 3 rupee bribe to Gray.": "必须支付 3 卢比给灰色。",
        "Must pay 3 rupee bribe to Blue.": "必须支付 3 卢比给蓝色。",
        "Must pay 4 rupee bribe to Tan.": "必须支付 4 卢比给棕色。",
        "Must pay 4 rupee bribe to Red.": "必须支付 4 卢比给红色。",
        "Must pay 4 rupee bribe to Black.": "必须支付 4 卢比给黑色。",
        "Must pay 4 rupee bribe to Gray.": "必须支付 4 卢比给灰色。",
        "Must pay 4 rupee bribe to Blue.": "必须支付 4 卢比给蓝色。",

        "Red chose Gray for Rumor.": "红色因为谣言四起选择灰色。",
        "Red chose Blue for Rumor.": "红色因为谣言四起选择蓝色。",
        "Red chose Red for Rumor.": "红色因为谣言四起选择红色。",
        "Red chose Black for Rumor.": "红色因为谣言四起选择黑色。",
        "Red chose Tan for Rumor.": "红色因为谣言四起选择棕色。",

        "Blue chose Gray for Rumor.": "蓝色因为谣言四起选择灰色。",
        "Blue chose Blue for Rumor.": "蓝色因为谣言四起选择蓝色。",
        "Blue chose Red for Rumor.": "蓝色因为谣言四起选择红色。",
        "Blue chose Black for Rumor.": "蓝色因为谣言四起选择黑色。",
        "Blue chose Tan for Rumor.": "蓝色因为谣言四起选择棕色。",

        "Black chose Gray for Rumor.": "黑色因为谣言四起选择灰色。",
        "Black chose Blue for Rumor.": "黑色因为谣言四起选择蓝色。",
        "Black chose Red for Rumor.": "黑色因为谣言四起选择红色。",
        "Black chose Black for Rumor.": "黑色因为谣言四起选择黑色。",
        "Black chose Tan for Rumor.": "黑色因为谣言四起选择棕色。",

        "Gray chose Gray for Rumor.": "灰色因为谣言四起选择灰色。",
        "Gray chose Blue for Rumor.": "灰色因为谣言四起选择蓝色。",
        "Gray chose Red for Rumor.": "灰色因为谣言四起选择红色。",
        "Gray chose Black for Rumor.": "灰色因为谣言四起选择黑色。",
        "Gray chose Tan for Rumor.": "灰色因为谣言四起选择棕色。",

        "Tan chose Gray for Rumor.": "棕色因为谣言四起选择灰色。",
        "Tan chose Blue for Rumor.": "棕色因为谣言四起选择蓝色。",
        "Tan chose Red for Rumor.": "棕色因为谣言四起选择红色。",
        "Tan chose Black for Rumor.": "棕色因为谣言四起选择黑色。",
        "Tan chose Tan for Rumor.": "棕色因为谣言四起选择棕色。",

        "Passed.": "略过。",
        "Red discarded": "红色弃置",
        "Blue discarded": "蓝色弃置",
        "Black discarded": "黑色弃置",
        "Gray discarded": "灰色弃置",
        "Tan discarded": "棕色弃置",
        "": "",
        "": "",
        "": "",

        "place tribe": "放置部落",
        "place road": "放置道路",
        "place army": "放置军队",
        "place spy": "放置间谍",
        "favored suit": "优势花色",
        "accept prize": "接受战利品",
        "safe house": "安全屋",
        "cleanup court": "清理朝廷",
        "cleanup hand": "清理手牌",
        "discard event cards": "弃置事件卡牌",
        "confidence failure": "",
        "other persuasive methods": "",
        "Pastunwali values": "",
        "game over": "游戏结束",
        "leverage": "贷款",
        "waive": "免除",
        "bribe": "贿赂",
        "blackmail": "勒索",
        "actions": "行动",
        "place_tribe": "放置部落",
        "place_road": "放置道路",
        "place_army": "放置军队",
        "place_spy": "放置间谍",
        "favored_suit_impact": "",

        "tax": "征税",
        "gift": "礼物",
        "build": "建造",
        "move": "移动",
        "betray": "背叛",
        "battle": "战斗",

        "infrastructure": "基础建设",
        "accept_prize": "",
        "safe_house": "",
        "insurrection": "起义",
        "insurrection_pause": "起义中止",
        "cleanup_court": "",
        "cleanup_hand": "",
        "discard_events": "",
        "instability": "",
        "confidence_failure": "",
        "favored_suit": "",
        "riots": "",
        "rumor": "",
        "other_persuasive_methods": "",
        "pashtunwali_values": "",
        "rebuke": "",
        "pause_game_over": "",
        "game_over": "游戏结束",
        "loyalty": "效忠",

        "Taxed with": "征税用",
        "Built with": "建造用",
        "Betrayed with": "背叛用",
        "Battled with": "战斗用",
        "Moved with": "移动用",
        "Gifted with": "礼物用",

        "to Gift.": "执行礼物。",
        "to Tax.": "执行征税。",
        "to Battle.": "执行战斗。",
        "to Move.": "执行移动。",
        "to Build.": "执行建造。",
        "to Betray.": "执行背叛。",
        "": "",
        "": "",
        "": "",
        "": "",

        "For generations the Durrani Empire held the region together. Now, their authority has collapsed. Rivals both old and new have emerged from the shadows. It’s up to the players to see if a fledgling Afghan state might come into being.": "杜拉尼帝国世世代代将该地区团结在一起。现在, 他们的权威已经崩溃。新旧对手都已走出阴影。这取决于玩家们, 看一个羽翼未丰的阿富汗国家是否会成立。",
        "Designer: Cole Wehrle.": "设计师: Cole Wehrle。",
        "Publisher:": "出版商:",
        "Programming: Tor Andersson.": "程序: Tor Andersson。",
        "This game is licensed under Creative Commons": "本游戏根据知识共享协议获得许可",
        "Rules of Play": "游戏规则",
        "Court & Event cards": "朝廷 & 事件卡牌",
        "Note: Court cards are laid out in player order from left to right, top to bottom. Moving a spy off your left-most card goes to the previous player's right-most card, and vice versa.": "注: 朝廷卡牌是按照玩家从左到右、从上到下的顺序排列的。将间谍从最左侧的卡牌上移到前一个玩家的最右侧的卡牌, 反之亦然。",
        "Read more about the game on": "阅读更多关于游戏的信息: ",


        "Spy from": "间谍从",
        "in Red court to": "位于红色的朝廷到",
        "in Tan court to": "位于棕色的朝廷到",
        "in Black court to": "位于黑色的朝廷到",
        "in Gray court to": "位于灰色的朝廷到",
        "in Blue court to": "位于蓝色的朝廷到",
        "to": "到",
        "Leveraged.": "贷款。",
        "No effect.": "无效果。",
        "Dominant Russian Coalition": "俄国阵营处于优势",
        "Dominant Afghan Coalition": "阿富汗阵营处于优势",
        "Dominant British Coalition": "英国阵营处于优势",
        "Final Dominance Check.": "最终优势检定。",
        "Instability!": "动荡！",

        "Unsuccessful Check": "检定不成功",
        "Successful Check": "检定成功",
        "from hand.": "从手牌。",
        "Did not pay bribe.": "不支付贿赂。",
        "Discarded all loyalty prizes.": "弃置所有的战利品。",
        "Discard one court card where you have a spy.": "弃置一张有你间谍存在的朝廷卡。",
        "": "",
        "": "",
        "": "",

        "2nd place:": "第2名:",
        "Ranking:": "排名:",



        "": "",
        "": "",
        //loyalty
        "Tan loyalty to Afghan.": "棕色效忠阿富汗。",
        "Tan loyalty to British.": "棕色效忠英国。",
        "Tan loyalty to Russian.": "棕色效忠俄国。",
        "Red loyalty to Afghan.": "红色效忠阿富汗。",
        "Red loyalty to British.": "红色效忠英国。",
        "Red loyalty to Russian.": "红色效忠俄国。",
        "Black loyalty to Afghan.": "黑色效忠阿富汗。",
        "Black loyalty to British.": "黑色效忠英国。",
        "Black loyalty to Russian.": "黑色效忠俄国。",
        "Gray loyalty to Afghan.": "灰色效忠阿富汗。",
        "Gray loyalty to British.": "灰色效忠英国。",
        "Gray loyalty to Russian.": "灰色效忠俄国。",
        "Blue loyalty to Afghan.": "蓝色效忠阿富汗。",
        "Blue loyalty to British.": "蓝色效忠英国。",
        "Blue loyalty to Russian.": "蓝色效忠俄国。",
        // loyalty
        "Loyalty to Russian.": "效忠俄国。",
        "Loyalty to British.": "效忠英国。",
        "Loyalty to Afghan.": "效忠阿富汗。",
        //army
        "Russian army to Persia.": "俄国军队到波斯。",
        "British army to Persia.": "英国军队到波斯。",
        "Afghan army to Persia.": "阿富汗军队到波斯。",
        "Russian army to Transcaspia.": "俄国军队到特兰斯卡斯皮亚。",
        "British army to Transcaspia.": "英国军队到特兰斯卡斯皮亚。",
        "Afghan army to Transcaspia.": "阿富汗军队到特兰斯卡斯皮亚。",
        "Russian army to Herat.": "俄国军队到赫拉特。",
        "British army to Herat.": "英国军队到赫拉特。",
        "Afghan army to Herat.": "阿富汗军队到赫拉特。",
        "Russian army to Kabul.": "俄国军队到喀布尔。",
        "British army to Kabul.": "英国军队到喀布尔。",
        "Afghan army to Kabul.": "阿富汗军队到喀布尔。",
        "Russian army to Kandahar.": "俄国军队到坎大哈。",
        "British army to Kandahar.": "英国军队到坎大哈。",
        "Afghan army to Kandahar.": "阿富汗军队到坎大哈。",
        "Russian army to Punjab.": "俄国军队到旁遮普。",
        "British army to Punjab.": "英国军队到旁遮普。",
        "Afghan army to Punjab.": "阿富汗军队到旁遮普。",

        // "Move Afghan army from Kabul."
        "Move Russian army from Persia.": "从波斯移动俄国军队。",
        "Move British army from Persia.": "从波斯移动英国军队。",
        "Move Afghan army from Persia.": "从波斯移动阿富汗军队。",
        "Move Russian army from Transcaspia.": "从特兰斯卡斯皮亚移动俄国军队。",
        "Move British army from Transcaspia.": "从特兰斯卡斯皮亚移动英国军队。",
        "Move Afghan army from Transcaspia.": "从特兰斯卡斯皮亚移动阿富汗军队。",
        "Move Russian army from Herat.": "从赫拉特移动俄国军队。",
        "Move British army from Herat.": "从赫拉特移动英国军队。",
        "Move Afghan army from Herat.": "从赫拉特移动阿富汗军队。",
        "Move Russian army from Kabul.": "从喀布尔移动俄国军队。",
        "Move British army from Kabul.": "从喀布尔移动英国军队。",
        "Move Afghan army from Kabul.": "从喀布尔移动阿富汗军队。",
        "Move Russian army from Kandahar.": "从坎大哈移动俄国军队。",
        "Move British army from Kandahar.": "从坎大哈移动英国军队。",
        "Move Afghan army from Kandahar.": "从坎大哈移动阿富汗军队。",
        "Move Russian army from Punjab.": "从旁遮普移动俄国军队。",
        "Move British army from Punjab.": "从旁遮普移动英国军队。",
        "Move Afghan army from Punjab.": "从旁遮普移动阿富汗军队。",

        "Move Russian tribe from Persia.": "从波斯移动俄国部落。",
        "Move British tribe from Persia.": "从波斯移动英国部落。",
        "Move Afghan tribe from Persia.": "从波斯移动阿富汗部落。",
        "Move Russian tribe from Transcaspia.": "从特兰斯卡斯皮亚移动俄国部落。",
        "Move British tribe from Transcaspia.": "从特兰斯卡斯皮亚移动英国部落。",
        "Move Afghan tribe from Transcaspia.": "从特兰斯卡斯皮亚移动阿富汗部落。",
        "Move Russian tribe from Herat.": "从赫拉特移动俄国部落。",
        "Move British tribe from Herat.": "从赫拉特移动英国部落。",
        "Move Afghan tribe from Herat.": "从赫拉特移动阿富汗部落。",
        "Move Russian tribe from Kabul.": "从喀布尔移动俄国部落。",
        "Move British tribe from Kabul.": "从喀布尔移动英国部落。",
        "Move Afghan tribe from Kabul.": "从喀布尔移动阿富汗部落。",
        "Move Russian tribe from Kandahar.": "从坎大哈移动俄国部落。",
        "Move British tribe from Kandahar.": "从坎大哈移动英国部落。",
        "Move Afghan tribe from Kandahar.": "从坎大哈移动阿富汗部落。",
        "Move Russian tribe from Punjab.": "从旁遮普移动俄国部落。",
        "Move British tribe from Punjab.": "从旁遮普移动英国部落。",
        "Move Afghan tribe from Punjab.": "从旁遮普移动阿富汗部落。",

        //Place Russian army in Persia.
        "Place Russian army in Persia.": "在波斯放置俄国军队。",
        "Place British army in Persia.": "在波斯放置英国军队。",
        "Place Afghan army in Persia.": "在波斯放置阿富汗军队。",
        "Place Russian army in Transcaspia.": "在特兰斯卡斯皮亚放置俄国军队。",
        "Place British army in Transcaspia.": "在特兰斯卡斯皮亚放置英国军队。",
        "Place Afghan army in Transcaspia.": "在特兰斯卡斯皮亚放置阿富汗军队。",
        "Place Russian army in Herat.": "在赫拉特放置俄国军队。",
        "Place British army in Herat.": "在赫拉特放置英国军队。",
        "Place Afghan army in Herat.": "在赫拉特放置阿富汗军队。",
        "Place Russian army in Kabul.": "在喀布尔放置俄国军队。",
        "Place British army in Kabul.": "在喀布尔放置英国军队。",
        "Place Afghan army in Kabul.": "在喀布尔放置阿富汗军队。",
        "Place Russian army in Kandahar.": "在坎大哈放置俄国军队。",
        "Place British army in Kandahar.": "在坎大哈放置英国军队。",
        "Place Afghan army in Kandahar.": "在坎大哈放置阿富汗军队。",
        "Place Russian army in Punjab.": "在旁遮普放置俄国军队。",
        "Place British army in Punjab.": "在旁遮普放置英国军队。",
        "Place Afghan army in Punjab.": "在旁遮普放置阿富汗军队。",

        "Place Russian army in Persia \u2014 select a block to move.": "在波斯放置俄国军队 \u2014 选择移动一个长方体标记。",
        "Place British army in Persia \u2014 select a block to move.": "在波斯放置英国军队 \u2014 选择移动一个长方体标记。",
        "Place Afghan army in Persia \u2014 select a block to move.": "在波斯放置阿富汗军队 \u2014 选择移动一个长方体标记。",
        "Place Russian army in Transcaspia \u2014 select a block to move.": "在特兰斯卡斯皮亚放置俄国军队 \u2014 选择移动一个长方体标记。",
        "Place British army in Transcaspia \u2014 select a block to move.": "在特兰斯卡斯皮亚放置英国军队 \u2014 选择移动一个长方体标记。",
        "Place Afghan army in Transcaspia \u2014 select a block to move.": "在特兰斯卡斯皮亚放置阿富汗军队 \u2014 选择移动一个长方体标记。",
        "Place Russian army in Herat \u2014 select a block to move.": "在赫拉特放置俄国军队 \u2014 选择移动一个长方体标记。",
        "Place British army in Herat \u2014 select a block to move.": "在赫拉特放置英国军队 \u2014 选择移动一个长方体标记。",
        "Place Afghan army in Herat \u2014 select a block to move.": "在赫拉特放置阿富汗军队 \u2014 选择移动一个长方体标记。",
        "Place Russian army in Kabul \u2014 select a block to move.": "在喀布尔放置俄国军队 \u2014 选择移动一个长方体标记。",
        "Place British army in Kabul \u2014 select a block to move.": "在喀布尔放置英国军队 \u2014 选择移动一个长方体标记。",
        "Place Afghan army in Kabul \u2014 select a block to move.": "在喀布尔放置阿富汗军队 \u2014 选择移动一个长方体标记。",
        "Place Russian army in Kandahar \u2014 select a block to move.": "在坎大哈放置俄国军队 \u2014 选择移动一个长方体标记。",
        "Place British army in Kandahar \u2014 select a block to move.": "在坎大哈放置英国军队 \u2014 选择移动一个长方体标记。",
        "Place Afghan army in Kandahar \u2014 select a block to move.": "在坎大哈放置阿富汗军队 \u2014 选择移动一个长方体标记。",
        "Place Russian army in Punjab \u2014 select a block to move.": "在旁遮普放置俄国军队 \u2014 选择移动一个长方体标记。",
        "Place British army in Punjab \u2014 select a block to move.": "在旁遮普放置英国军队 \u2014 选择移动一个长方体标记。",
        "Place Afghan army in Punjab \u2014 select a block to move.": "在旁遮普放置阿富汗军队 \u2014 选择移动一个长方体标记。",

        //Place Afghan road in Kabul.
        "Place Russian road in Persia.": "在波斯放置俄国道路。",
        "Place British road in Persia.": "在波斯放置英国道路。",
        "Place Afghan road in Persia.": "在波斯放置阿富汗道路。",
        "Place Russian road in Transcaspia.": "在特兰斯卡斯皮亚放置俄国道路。",
        "Place British road in Transcaspia.": "在特兰斯卡斯皮亚放置英国道路。",
        "Place Afghan road in Transcaspia.": "在特兰斯卡斯皮亚放置阿富汗道路。",
        "Place Russian road in Herat.": "在赫拉特放置俄国道路。",
        "Place British road in Herat.": "在赫拉特放置英国道路。",
        "Place Afghan road in Herat.": "在赫拉特放置阿富汗道路。",
        "Place Russian road in Kabul.": "在喀布尔放置俄国道路。",
        "Place British road in Kabul.": "在喀布尔放置英国道路。",
        "Place Afghan road in Kabul.": "在喀布尔放置阿富汗道路。",
        "Place Russian road in Kandahar.": "在坎大哈放置俄国道路。",
        "Place British road in Kandahar.": "在坎大哈放置英国道路。",
        "Place Afghan road in Kandahar.": "在坎大哈放置阿富汗道路。",
        "Place Russian road in Punjab.": "在旁遮普放置俄国道路。",
        "Place British road in Punjab.": "在旁遮普放置英国道路。",
        "Place Afghan road in Punjab.": "在旁遮普放置阿富汗道路。",

        "Place Russian road in Persia \u2014 select a block to move.": "在波斯放置俄国道路 \u2014 选择移动一个长方体标记。",
        "Place British road in Persia \u2014 select a block to move.": "在波斯放置英国道路 \u2014 选择移动一个长方体标记。",
        "Place Afghan road in Persia \u2014 select a block to move.": "在波斯放置阿富汗道路 \u2014 选择移动一个长方体标记。",
        "Place Russian road in Transcaspia \u2014 select a block to move.": "在特兰斯卡斯皮亚放置俄国道路 \u2014 选择移动一个长方体标记。",
        "Place British road in Transcaspia \u2014 select a block to move.": "在特兰斯卡斯皮亚放置英国道路 \u2014 选择移动一个长方体标记。",
        "Place Afghan road in Transcaspia \u2014 select a block to move.": "在特兰斯卡斯皮亚放置阿富汗道路 \u2014 选择移动一个长方体标记。",
        "Place Russian road in Herat \u2014 select a block to move.": "在赫拉特放置俄国道路 \u2014 选择移动一个长方体标记。",
        "Place British road in Herat \u2014 select a block to move.": "在赫拉特放置英国道路 \u2014 选择移动一个长方体标记。",
        "Place Afghan road in Herat \u2014 select a block to move.": "在赫拉特放置阿富汗道路 \u2014 选择移动一个长方体标记。",
        "Place Russian road in Kabul \u2014 select a block to move.": "在喀布尔放置俄国道路 \u2014 选择移动一个长方体标记。",
        "Place British road in Kabul \u2014 select a block to move.": "在喀布尔放置英国道路 \u2014 选择移动一个长方体标记。",
        "Place Afghan road in Kabul \u2014 select a block to move.": "在喀布尔放置阿富汗道路 \u2014 选择移动一个长方体标记。",
        "Place Russian road in Kandahar \u2014 select a block to move.": "在坎大哈放置俄国道路 \u2014 选择移动一个长方体标记。",
        "Place British road in Kandahar \u2014 select a block to move.": "在坎大哈放置英国道路 \u2014 选择移动一个长方体标记。",
        "Place Afghan road in Kandahar \u2014 select a block to move.": "在坎大哈放置阿富汗道路 \u2014 选择移动一个长方体标记。",
        "Place Russian road in Punjab \u2014 select a block to move.": "在旁遮普放置俄国道路 \u2014 选择移动一个长方体标记。",
        "Place British road in Punjab \u2014 select a block to move.": "在旁遮普放置英国道路 \u2014 选择移动一个长方体标记。",
        "Place Afghan road in Punjab \u2014 select a block to move.": "在旁遮普放置阿富汗道路 \u2014 选择移动一个长方体标记。",
        // Tribe to 
        "Tribe to Persia.": "部落放置到波斯。",
        "Tribe to Transcaspia.": "部落放置到特兰斯卡斯皮亚。",
        "Tribe to Herat.": "部落放置到赫拉特。",
        "Tribe to Kabul.": "部落放置到喀布尔。",
        "Tribe to Kandahar.": "部落放置到坎大哈。",
        "Tribe to Punjab.": "部落放置到旁遮普。",

        "Riot in Persia.": "波斯暴乱。",
        "Riot in Transcaspia.": "特兰斯卡斯皮亚暴乱。",
        "Riot in Herat.": "赫拉特暴乱。",
        "Riot in Kabul.": "喀布尔暴乱。",
        "Riot in Kandahar.": "坎大哈暴乱。",
        "Riot in Punjab.": "旁遮普暴乱。",

        "Remove up to 1 tribes, roads, or armies from Persia.": "从波斯移除至多 1 个部落, 道路, 或军队。",
        "Remove up to 1 tribes, roads, or armies from Transcaspia.": "从特兰斯卡斯皮亚移除至多 1 个部落, 道路, 或军队。",
        "Remove up to 1 tribes, roads, or armies from Herat.": "从赫拉特移除至多 1 个部落, 道路, 或军队。",
        "Remove up to 1 tribes, roads, or armies from Kabul.": "从喀布尔移除至多 1 个部落, 道路, 或军队。",
        "Remove up to 1 tribes, roads, or armies from Kandahar.": "从坎大哈移除至多 1 个部落, 道路, 或军队。",
        "Remove up to 1 tribes, roads, or armies from Punjab.": "从旁遮普移除至多 1 个部落, 道路, 或军队。",

        "Remove up to 2 tribes, roads, or armies from Persia.": "从波斯移除至多 2 个部落, 道路, 或军队。",
        "Remove up to 2 tribes, roads, or armies from Transcaspia.": "从特兰斯卡斯皮亚移除至多 2 个部落, 道路, 或军队。",
        "Remove up to 2 tribes, roads, or armies from Herat.": "从赫拉特移除至多 2 个部落, 道路, 或军队。",
        "Remove up to 2 tribes, roads, or armies from Kabul.": "从喀布尔移除至多 2 个部落, 道路, 或军队。",
        "Remove up to 2 tribes, roads, or armies from Kandahar.": "从坎大哈移除至多 2 个部落, 道路, 或军队。",
        "Remove up to 2 tribes, roads, or armies from Punjab.": "从旁遮普移除至多 2 个部落, 道路, 或军队。",

        "Remove up to 3 tribes, roads, or armies from Persia.": "从波斯移除至多 3 个部落, 道路, 或军队。",
        "Remove up to 3 tribes, roads, or armies from Transcaspia.": "从特兰斯卡斯皮亚移除至多 3 个部落, 道路, 或军队。",
        "Remove up to 3 tribes, roads, or armies from Herat.": "从赫拉特移除至多 3 个部落, 道路, 或军队。",
        "Remove up to 3 tribes, roads, or armies from Kabul.": "从喀布尔移除至多 3 个部落, 道路, 或军队。",
        "Remove up to 3 tribes, roads, or armies from Kandahar.": "从坎大哈移除至多 3 个部落, 道路, 或军队。",
        "Remove up to 3 tribes, roads, or armies from Punjab.": "从旁遮普移除至多 3 个部落, 道路, 或军队。",

        "Place tribe in Persia.": "在波斯放置部落。",
        "Place tribe in Transcaspia.": "在特兰斯卡斯皮亚放置部落。",
        "Place tribe in Herat.": "在赫拉特放置部落。",
        "Place tribe in Kabul.": "在喀布尔放置部落。",
        "Place tribe in Kandahar.": "在坎大哈放置部落。",
        "Place tribe in Punjab.": "在旁遮普放置部落。",

        "Place spy on a court card in Persia \u2014 select a cylinder.": "在一张波斯地区朝廷卡上放置间谍 \u2014 选择一个圆柱体标记。",
        "Place spy on a court card in Transcaspia \u2014 select a cylinder.": "在一张特兰斯卡斯皮亚地区朝廷卡上放置间谍 \u2014 选择一个圆柱体标记。",
        "Place spy on a court card in Herat \u2014 select a cylinder.": "在一张赫拉特地区朝廷卡上放置间谍 \u2014 选择一个圆柱体标记。",
        "Place spy on a court card in Kabul \u2014 select a cylinder.": "在一张喀布尔地区朝廷卡上放置间谍 \u2014 选择一个圆柱体标记。",
        "Place spy on a court card in Kandahar \u2014 select a cylinder.": "在一张坎大哈地区朝廷卡上放置间谍 \u2014 选择一个圆柱体标记。",
        "Place spy on a court card in Punjab \u2014 select a cylinder.": "在一张旁遮普地区朝廷卡上放置间谍 \u2014 选择一个圆柱体标记。",

        "Place spy on a court card in Persia.": "在一张波斯地区朝廷卡上放置间谍。",
        "Place spy on a court card in Transcaspia.": "在一张特兰斯卡斯皮亚地区朝廷卡上放置间谍。",
        "Place spy on a court card in Herat.": "在一张赫拉特地区朝廷卡上放置间谍。",
        "Place spy on a court card in Kabul.": "在一张喀布尔地区朝廷卡上放置间谍。",
        "Place spy on a court card in Kandahar.": "在一张坎大哈地区朝廷卡上放置间谍。",
        "Place spy on a court card in Punjab.": "在一张旁遮普地区朝廷卡上放置间谍。",



        "Place tribe in Persia \u2014 select a cylinder.": "在波斯放置部落 \u2014 选择一个圆柱体标记。",
        "Place tribe in Transcaspia \u2014 select a cylinder.": "在特兰斯卡斯皮亚放置部落 \u2014 选择一个圆柱体标记。",
        "Place tribe in Herat \u2014 select a cylinder.": "在赫拉特放置部落 \u2014 选择一个圆柱体标记。",
        "Place tribe in Kabul \u2014 select a cylinder.": "在喀布尔放置部落 \u2014 选择一个圆柱体标记。",
        "Place tribe in Kandahar \u2014 select a cylinder.": "在坎大哈放置部落 \u2014 选择一个圆柱体标记。",
        "Place tribe in Punjab \u2014 select a cylinder.": "在旁遮普放置部落 \u2014 选择一个圆柱体标记。",
        // in Black court.
        "in Black court.": "位于黑色的朝廷。",
        "in Tan court.": "位于棕色的朝廷。",
        "in Red court.": "位于红色的朝廷。",
        "in Gray court.": "位于灰色的朝廷。",
        "in Blue court.": "位于蓝色的朝廷。",
        // from Black court.
        "from court.": "从朝廷。",
        "from Black court.": "从黑色的朝廷。",
        "from Tan court.": "从棕色的朝廷。",
        "from Red court.": "从红色的朝廷。",
        "from Gray court.": "从灰色的朝廷。",
        "from Blue court.": "从蓝色的朝廷。",
        // Returned
        "Returned Red spy.": "返回红色间谍。",
        "Returned Black spy.": "返回黑色间谍。",
        "Returned Tan spy.": "返回棕色间谍。",
        "Returned Gray spy.": "返回灰色间谍。",
        "Returned Blue spy.": "返回蓝色间谍。",

        "Removed Red tribe.": "移除红色部落。",
        "Removed Black tribe.": "移除黑色部落。",
        "Removed Tan tribe.": "移除棕色部落。",
        "Removed Gray tribe.": "移除灰色部落。",
        "Removed Blue tribe.": "移除蓝色部落。",
        // Removed all tribes and armies in
        "Removed all tribes and armies in Transcaspia.": "移除特兰斯卡斯皮亚的所有部落与军队。",
        "Removed all tribes and armies in Herat.": "移除赫拉特的所有部落与军队。",
        "Removed all tribes and armies in Persia.": "移除波斯的所有部落与军队。",
        "Removed all tribes and armies in Kabul.": "移除喀布尔的所有部落与军队。",
        "Removed all tribes and armies in Kandahar.": "移除坎大哈的所有部落与军队。",
        "Removed all tribes and armies in Punjab.": "移除旁遮普的所有部落与军队。",
        // Favored suit to Intelligence.
        "Favored suit to Intelligence.": "优色花色变为情报。",
        "Favored suit to Political.": "优色花色变为政治。",
        "Favored suit to Economic.": "优色花色变为经济。",
        "Favored suit to Military.": "优色花色变为军事。",
        // Accepted Russian prize.
        "Accepted Russian prize.": "接受俄国战利品。",
        "Accepted Afghan prize.": "接受阿富汗战利品。",
        "Accepted British prize.": "接受英国战利品。",
        // Blue paid back leverage.
        "Paid back leverage.": "偿还贷款。",
        "Blue paid back leverage.": "蓝色偿还贷款。",
        "Red paid back leverage.": "红色偿还贷款。",
        "Gray paid back leverage.": "灰色偿还贷款。",
        "Tan paid back leverage.": "棕色偿还贷款。",
        "Black paid back leverage.": "黑色偿还贷款。",
        // Removed Gray spy from
        "Removed Blue spy from": "移除蓝色间谍从",
        "Removed Red spy from": "移除红色间谍从",
        "Removed Gray spy from": "移除灰色间谍从",
        "Removed Tan spy from": "移除棕色间谍从",
        "Removed Black spy from": "移除黑色间谍从",
        // "Tan won!": "棕色获胜！"
        "Tan won!": "棕色获胜！",
        "Red won!": "红色获胜！",
        "Black won!": "黑色获胜！",
        "Gray won!": "灰色获胜！",
        "Blue won!": "蓝色获胜！",

        "Tan resigned.": "棕色放弃。",
        "Red resigned.": "红色放弃。",
        "Black resigned.": "黑色放弃。",
        "Gray resigned.": "灰色放弃。",
        "Blue resigned.": "蓝色放弃。",
        // Taxed Black player.
        "Taxed Tan player.": "征税棕色玩家。",
        "Taxed Red player.": "征税红色玩家。",
        "Taxed Black player.": "征税棕色玩家。",
        "Taxed Gray player.": "征税灰色玩家。",
        "Taxed Blue player.": "征税蓝色玩家。",
        // Change the favored suit to Intelligence.
        "Change the favored suit to Intelligence.": "改变优势花色为情报。",
        "Change the favored suit to Political.": "改变优势花色为政治。",
        "Change the favored suit to Military.": "改变优势花色为军事。",
        "Change the favored suit to Economic.": "改变优势花色为经济。",
        // Move up to 1 spy or army — select a spy or army to move.
        "Move up to 1 spy or army \u2014 select a spy or army to move.": "移动至多 1 个间谍或军队 \u2014 选择移动 1 个间谍或军队。",
        "Move up to 2 spies and/or armies \u2014 select a spy or army to move.": "移动至多 2 个间谍和/或军队 \u2014 选择移动 1 个间谍或军队。",
        "Move up to 3 spies and/or armies \u2014 select a spy or army to move.": "移动至多 3 个间谍和/或军队 \u2014 选择移动 1 个间谍或军队。",
        "Move up to 4 spies and/or armies \u2014 select a spy or army to move.": "移动至多 4 个间谍和/或军队 \u2014 选择移动 1 个间谍或军队。",
        "Move up to 5 spies and/or armies \u2014 select a spy or army to move.": "移动至多 5 个间谍和/或军队 \u2014 选择移动 1 个间谍或军队。",
        "Move up to 6 spies and/or armies \u2014 select a spy or army to move.": "移动至多 6 个间谍和/或军队 \u2014 选择移动 1 个间谍或军队。",
        "Move up to 7 spies and/or armies \u2014 select a spy or army to move.": "移动至多 7 个间谍和/或军队 \u2014 选择移动 1 个间谍或军队。",
        "Move up to 8 spies and/or armies \u2014 select a spy or army to move.": "移动至多 8 个间谍和/或军队 \u2014 选择移动 1 个间谍或军队。",
        "Move up to 9 spies and/or armies \u2014 select a spy or army to move.": "移动至多 9 个间谍和/或军队 \u2014 选择移动 1 个间谍或军队。",
        "Move up to 10 spies and/or armies \u2014 select a spy or army to move.": "移动至多 10 个间谍和/或军队 \u2014 选择移动 1 个间谍或军队。",

        "Move up to 1 spy, army, or tribe \u2014 select a spy, army, or tribe to move.": "移动至多 1 个间谍, 军队, 或部落 \u2014 选择移动 1 个间谍, 军队, 或部落。",
        "Move up to 2 spies, armies, and/or tribes \u2014 select a spy, army, or tribe to move.": "移动至多 2 个间谍, 军队, 和/或部落 \u2014 选择移动 1 个间谍, 军队, 或部落。",
        "Move up to 3 spies, armies, and/or tribes \u2014 select a spy, army, or tribe to move.": "移动至多 3 个间谍, 军队, 和/或部落 \u2014 选择移动 1 个间谍, 军队, 或部落。",
        "Move up to 4 spies, armies, and/or tribes \u2014 select a spy, army, or tribe to move.": "移动至多 4 个间谍, 军队, 和/或部落 \u2014 选择移动 1 个间谍, 军队, 或部落。",
        "Move up to 5 spies, armies, and/or tribes \u2014 select a spy, army, or tribe to move.": "移动至多 5 个间谍, 军队, 和/或部落 \u2014 选择移动 1 个间谍, 军队, 或部落。",
        "Move up to 6 spies, armies, and/or tribes \u2014 select a spy, army, or tribe to move.": "移动至多 6 个间谍, 军队, 和/或部落 \u2014 选择移动 1 个间谍, 军队, 或部落。",
        "Move up to 7 spies, armies, and/or tribes \u2014 select a spy, army, or tribe to move.": "移动至多 7 个间谍, 军队, 和/或部落 \u2014 选择移动 1 个间谍, 军队, 或部落。",
        "Move up to 8 spies, armies, and/or tribes \u2014 select a spy, army, or tribe to move.": "移动至多 8 个间谍, 军队, 和/或部落 \u2014 选择移动 1 个间谍, 军队, 或部落。",
        "Move up to 9 spies, armies, and/or tribes \u2014 select a spy, army, or tribe to move.": "移动至多 9 个间谍, 军队, 和/或部落 \u2014 选择移动 1 个间谍, 军队, 或部落。",
        "Move up to 10 spies, armies, and/or tribes \u2014 select a spy, army, or tribe to move.": "移动至多 10 个间谍, 军队, 和/或部落 \u2014 选择移动 1 个间谍, 军队, 或部落。",

        "Gray spy to": "灰色间谍放置到",
        "Blue spy to": "蓝色间谍放置到",
        "Red spy to": "红色间谍放置到",
        "Black spy to": "黑色间谍放置到",
        "Tan spy to": "棕色间谍放置到",

        "Gray waived the bribe.": "灰色免除了贿赂。",
        "Blue waived the bribe.": "蓝色免除了贿赂。",
        "Red waived the bribe.": "红色免除了贿赂。",
        "Black waived the bribe.": "黑色免除了贿赂。",
        "Tan waived the bribe.": "棕色免除了贿赂。",

        "Gray refused to waive the bribe.": "灰色拒绝免除贿赂。",
        "Blue refused to waive the bribe.": "蓝色拒绝免除贿赂。",
        "Red refused to waive the bribe.": "红色拒绝免除贿赂。",
        "Black refused to waive the bribe.": "黑色拒绝免除贿赂。",
        "Tan refused to waive the bribe.": "棕色拒绝免除贿赂。",

        "Gray reduced the bribe to 1.": "灰色将贿赂减少至 1。",
        "Blue reduced the bribe to 1.": "蓝色将贿赂减少至 1。",
        "Red reduced the bribe to 1.": "红色将贿赂减少至 1。",
        "Black reduced the bribe to 1.": "黑色将贿赂减少至 1。",
        "Tan reduced the bribe to 1.": "棕色将贿赂减少至 1。",

        "Gray reduced the bribe to 2.": "灰色将贿赂减少至 2。",
        "Blue reduced the bribe to 2.": "蓝色将贿赂减少至 2。",
        "Red reduced the bribe to 2.": "红色将贿赂减少至 2。",
        "Black reduced the bribe to 2.": "黑色将贿赂减少至 2。",
        "Tan reduced the bribe to 2.": "棕色将贿赂减少至 2。",

        "Gray reduced the bribe to 3.": "灰色将贿赂减少至 3。",
        "Blue reduced the bribe to 3.": "蓝色将贿赂减少至 3。",
        "Red reduced the bribe to 3.": "红色将贿赂减少至 3。",
        "Black reduced the bribe to 3.": "黑色将贿赂减少至 3。",
        "Tan reduced the bribe to 3.": "棕色将贿赂减少至 3。",

        "Gray reduced the bribe to 4.": "灰色将贿赂减少至 4。",
        "Blue reduced the bribe to 4.": "蓝色将贿赂减少至 4。",
        "Red reduced the bribe to 4.": "红色将贿赂减少至 4。",
        "Black reduced the bribe to 4.": "黑色将贿赂减少至 4。",
        "Tan reduced the bribe to 4.": "棕色将贿赂减少至 4。",

        "Gray reduced the bribe to 5.": "灰色将贿赂减少至 5。",
        "Blue reduced the bribe to 5.": "蓝色将贿赂减少至 5。",
        "Red reduced the bribe to 5.": "红色将贿赂减少至 5。",
        "Black reduced the bribe to 5.": "黑色将贿赂减少至 5。",
        "Tan reduced the bribe to 5.": "棕色将贿赂减少至 5。",

        "Gray reduced the bribe to 6.": "灰色将贿赂减少至 6。",
        "Blue reduced the bribe to 6.": "蓝色将贿赂减少至 6。",
        "Red reduced the bribe to 6.": "红色将贿赂减少至 6。",
        "Black reduced the bribe to 6.": "黑色将贿赂减少至 6。",
        "Tan reduced the bribe to 6.": "棕色将贿赂减少至 6。",

        "Gray reduced the bribe to 7.": "灰色将贿赂减少至 7。",
        "Blue reduced the bribe to 7.": "蓝色将贿赂减少至 7。",
        "Red reduced the bribe to 7.": "红色将贿赂减少至 7。",
        "Black reduced the bribe to 7.": "黑色将贿赂减少至 7。",
        "Tan reduced the bribe to 7.": "棕色将贿赂减少至 7。",

        "Gray reduced the bribe to 8.": "灰色将贿赂减少至 8。",
        "Blue reduced the bribe to 8.": "蓝色将贿赂减少至 8。",
        "Red reduced the bribe to 8.": "红色将贿赂减少至 8。",
        "Black reduced the bribe to 8.": "黑色将贿赂减少至 8。",
        "Tan reduced the bribe to 8.": "棕色将贿赂减少至 8。",

        "Gray reduced the bribe to 9.": "灰色将贿赂减少至 9。",
        "Blue reduced the bribe to 9.": "蓝色将贿赂减少至 9。",
        "Red reduced the bribe to 9.": "红色将贿赂减少至 9。",
        "Black reduced the bribe to 9.": "黑色将贿赂减少至 9。",
        "Tan reduced the bribe to 9.": "棕色将贿赂减少至 9。",
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

    },
    "regexp": [ // 正则翻译
        ...I18N.zh["pubilc"]["regexp"],
        [/^Took (\d+)\.$/, "拿取 $1。"],
        [/^Paid (\d+)\.$/, "支付 $1。"],
        [/^Paid (\d+) and took (\d+)\.$/, "支付 $1 和 拿取 $2。"],
        [/^Paid (\d+) to Blue\.$/, "支付 $1 给蓝色。"],
        [/^Paid (\d+) to Red\.$/, "支付 $1 给红色。"],
        [/^Paid (\d+) to Gray\.$/, "支付 $1 给灰色。"],
        [/^Paid (\d+) to Tan\.$/, "支付 $1 给棕色。"],
        [/^Paid (\d+) to Black\.$/, "支付 $1 给黑色。"],
        [/^(Gray|Blue|Tan|Black|Red) overthrown in (.+)\.$/, function (all, user, location) {
            var user = (I18N.zh["pax-pamir"]["static"][user] ?? user);
            var location = (I18N.zh["pax-pamir"]["static"][location] ?? location);
            return user + "在" + location + "的政权颠覆。";
        }],
        [/^(\d+) \- (.+)$/, function (all, num, name) {
            var name = (I18N.zh["pax-pamir"]["static"][name] ?? name);
            return num + " - " + name;
        }],
        // prompt
        // "Waiting for Blue — loyalty..."
        [/^(\[\d+\/\d+\]) Waiting for (Gray|Blue|Tan|Black|Red) \u2014 (.*)\.\.\.$/, function (all, step, player, action) {
            var player = (I18N.zh["pax-pamir"]["static"][player] ?? player);
            var action = (I18N.zh["pax-pamir"]["static"][action] ?? action);
            return step + " 等待" + player + " \u2014 " + action + "...";
        }],
        [/^Waiting for (Gray|Blue|Tan|Black|Red) \u2014 (.*)\.\.\.$/, function (all, player, action) {
            var player = (I18N.zh["pax-pamir"]["static"][player] ?? player);
            var action = (I18N.zh["pax-pamir"]["static"][action] ?? action);
            return "等待" + player + " \u2014 " + action + "...";
        }],

        // [/^Result: (.+) \(Blue\)$/, "结果: $1 (蓝色)"],
        // [/^Result: (.+) \(Tan\)$/, "结果: $1 (棕色)"],
        // [/^Result: (.+) \(Gray\)$/, "结果: $1 (灰色)"],
        // [/^Result: (.+) \(Black\)$/, "结果: $1 (黑色)"],
        // [/^Result: (.+) \(Red\)$/, "结果: $1 (红色)"],
        [/^(British|Afghan|Russian) army from (.+) to (.+)\.$/, function (all, who, where1, where2) {
            var who = (I18N.zh["pax-pamir"]["static"][who] ?? who);
            var where1 = (I18N.zh["pax-pamir"]["static"][where1] ?? where1);
            var where2 = (I18N.zh["pax-pamir"]["static"][where2] ?? where2);
            return who + "军队从" + where1 + "放置到" + where2 + "。";
        }],
        // Afghan road to
        [/^(British|Afghan|Russian) road to (.+\/.+)\.$/, function (all, who, where) {
            var who = (I18N.zh["pax-pamir"]["static"][who] ?? who);
            var where = (I18N.zh["pax-pamir"]["static"][where] ?? where);
            return who + "道路放置到" + where + "。";
        }],
        [/^Ranking: (.+)\.$/, function (all, list) {
            var list = list.replace(/Blue /g, "蓝色")
                .replace(/Tan /g, "棕色")
                .replace(/Gray /g, "灰色")
                .replace(/Black /g, "黑色")
                .replace(/Red /g, "红色")
                .replace(/influence, ?/g, "影响力,\n")
                .replace(/influence/g, "影响力")
                .replace(/cylinders?, ?/g, "圆柱体标记,\n")
                .replace(/cylinders?/g, "圆柱体标记")
            return "排名:\n" + list + "。";
        }],
        // "1st place: Tan scored 10 vp.": "第 1 名:\n棕色得 10 分。",
        [/^1st place: (.+)\.$/, function (all, list) {
            var list = list.replace(/Blue scored /g, "蓝色得 ")
                .replace(/Tan scored /g, "棕色得 ")
                .replace(/Gray scored /g, "灰色得 ")
                .replace(/Black scored /g, "黑色得 ")
                .replace(/Red scored /g, "红色得 ")
                .replace(/ vp\. ?/g, " 分。\n")
                .replace(/ vp/g, " 分")
            return "第 1 名:\n" + list + "。";
        }],
        [/^2nd place: (.+)\.$/, function (all, list) {
            var list = list.replace(/Blue scored /g, "蓝色得 ")
                .replace(/Tan scored /g, "棕色得 ")
                .replace(/Gray scored /g, "灰色得 ")
                .replace(/Black scored /g, "黑色得 ")
                .replace(/Red scored /g, "红色得 ")
                .replace(/ vp\. ?/g, " 分。\n")
                .replace(/ vp/g, " 分")
            return "第 2 名:\n" + list + "。";
        }],
        [/^3rd place: (.+)\.$/, function (all, list) {
            var list = list.replace(/Blue scored /g, "蓝色得 ")
                .replace(/Tan scored /g, "棕色得 ")
                .replace(/Gray scored /g, "灰色得 ")
                .replace(/Black scored /g, "黑色得 ")
                .replace(/Red scored /g, "红色得 ")
                .replace(/ vp\. ?/g, " 分。\n")
                .replace(/ vp/g, " 分")
            return "第 3 名:\n" + list + "。";
        }],
        [/^Removed (.+) (tribe|army|road) from (.+)\.$/, function (all, player, thing, where) {
            var player = (I18N.zh["pax-pamir"]["static"][player] ?? player);
            var thing = (I18N.zh["pax-pamir"]["static"][thing] ?? thing);
            var where = (I18N.zh["pax-pamir"]["static"][where] ?? where);
            return "移除" + where + "的" + player + thing + "。";
        }],

        [/^(\d+) Afghan blocks?,$/, "$1 阿富汗长方体标记,"],
        [/^(\d+) British blocks?,$/, "$1 英国长方体标记,"],
        [/^(\d+) Russian blocks?,$/, "$1 俄国长方体标记,"],

        [/^(\d+) Afghan blocks?\.$/, "$1 阿富汗长方体标记。"],
        [/^(\d+) British blocks?\.$/, "$1 英国长方体标记。"],
        [/^(\d+) Russian blocks?\.$/, "$1 俄国长方体标记。"],
        [/^(\d+) prizes?$/, "$1 战利品"],
        [/^(Gray|Blue|Tan|Black|Red) exchanged hands with (Gray|Blue|Tan|Black|Red)\.$/, function (all, player, player2) {
            var player = (I18N.zh["pax-pamir"]["static"][player] ?? player);
            var player2 = (I18N.zh["pax-pamir"]["static"][player2] ?? player2);
            return player + "与" + player2 + "交换手牌。";
        }],
        [/^(.+) timed out\.$/, function (all, player) {
            var player = (I18N.zh["pax-pamir"]["static"][player] ?? player);
            return player + "超时。";
        }],
        [/^(Gray|Blue|Tan|Black|Red) refused to waive the bribe\.$/, function (all, player) {
            var player = (I18N.zh["pax-pamir"]["static"][player] ?? player);
            return player + "拒绝免除贿赂。";
        }],
        [/^$/, ""],
        [/^$/, ""],
        [/^$/, ""],
        [/^$/, ""],
        [/^$/, ""],

        // all last
        // all last
        // all last
        // all last
        // all last
        // all last
        // all last
        // all last
        // all last
        // all last
        // all last
        // all last
        [/^Replay (\d+ \/ \d+) – None$/, "重播 $1 – 无"],
        [/^Replay (\d+ \/ \d+) – Tan$/, "重播 $1 – 棕色"],
        [/^Replay (\d+ \/ \d+) – Gray$/, "重播 $1 – 灰色"],
        [/^Replay (\d+ \/ \d+) – Black$/, "重播 $1 – 黑色"],
        [/^Replay (\d+ \/ \d+) – Blue$/, "重播 $1 – 蓝色"],
        [/^Replay (\d+ \/ \d+) – Red$/, "重播 $1 – 红色"],

        [/^(Gray|Blue|Tan|Black|Red): (.+)$/, function (all, player, action) {
            var player = (I18N.zh["pax-pamir"]["static"][player] ?? player);
            var action = (I18N.zh["pax-pamir"]["static"][action] ?? action);
            return player + ": " + action;
        }],
        [/^(\[\d+\/\d+\]) (Gray|Blue|Tan|Black|Red): (.+)$/, function (all, step, player, action) {
            var player = (I18N.zh["pax-pamir"]["static"][player] ?? player);
            var action = (I18N.zh["pax-pamir"]["static"][action] ?? action);
            return step + " " + player + ": " + action;
        }],
        [/^(\[\d+\/\d+\]) (.+)$/, function (all, step, list) {
            var list = (I18N.zh["pax-pamir"]["static"][list] ?? list);
            return step + " " + list;
        }],
    ],
};