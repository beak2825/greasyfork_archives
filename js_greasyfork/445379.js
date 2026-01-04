// ==UserScript==
// @name             Liquipedia汉化脚本
// @namespace        https://greasyfork.org/zh-CN/scripts/445379-liquipedia%E6%B1%89%E5%8C%96%E8%84%9A%E6%9C%AC
// @match            *://liquipedia.net/dota2/*
// @grant            none
// @description      none
// @author           InfSein, CDS MG
// @version          1.3.6
// @downloadURL https://update.greasyfork.org/scripts/445379/Liquipedia%E6%B1%89%E5%8C%96%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/445379/Liquipedia%E6%B1%89%E5%8C%96%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

'use strict'

if (document.location.href.match('action=edit')) {
    return
}

const _VAR = {
    monthmap_short: {
        Jan: "1月",
        Feb: "2月",
        Mar: "3月",
        Apr: "4月",
        May: "5月",
        Jun: "6月",
        Jul: "7月",
        Aug: "8月",
        Sep: "9月",
        Oct: "10月",
        Nov: "11月",
        Dec: "12月"
    },
    monthmap_full: {
        January: "1月",
        February: "2月",
        March: "3月",
        April: "4月",
        May: "5月",
        June: "6月",
        July: "7月",
        August: "8月",
        September: "9月",
        October: "10月",
        November: "11月",
        December: "12月"
    }
}

const i18nRegex = [
    // 通过正则匹配处理部分复杂文本。
    // 从上到下匹配，匹配到就会中断，因此特殊处理置前，通用处理置后。
    // 过多正则可能会有性能问题，谨慎添加！

    // * 锦标赛名称
    [/The International (\d{4})/, "$1年国际邀请赛"],
    [/Riyadh Masters (\d{4})/, "$1年利雅得大师赛"],
    [/DreamLeague Season (\d{1,2})/, "梦幻联赛第$1赛季"],
    [/DreamLeague S(\d{1,2})/, "梦幻联赛S$1"],
    [/FISSURE PLAYGROUND #(\d{1,2})/, 'FISSURE裂变天地S$1'],
    [/FISSURE Universe: Episode (\d{1,2})/, 'FISSURE裂变宇宙S$1'],
    [/FISSURE Universe (\d{1,2})/, 'FISSURE裂变宇宙S$1'],
    [/PGL Wallachia Season (\d{1,2})/, "PGL瓦拉几亚 第$1赛季"],
    [/PGL Wallachia S(\d{1,2})/, "PGL瓦拉几亚 S$1"],

    // * 日期
    [
        /(\d{1,2}) (January|February|March|April|May|June|July|August|September|October|November|December) (\d{4})/,
        (match, day, month, year) => `${year}年${_VAR.monthmap_full[month]}${day}日`
    ],
    [
        /(May|January|February|March|April|June|July|August|September|October|November|December) (\d{1,2}) - \1 (\d{1,2}), (\d{4})/,
        (match, month, startDay, endDay, year) => `${year}年 ${_VAR.monthmap_full[month]}${startDay}日 - ${_VAR.monthmap_full[month]}${endDay}日`
    ],
    [
        /(January|February|March|April|May|June|July|August|September|October|November|December) (\d{1,2})-([A-Z])/,
        (match, month, day, group) => `${_VAR.monthmap_full[month]}${day}日-${group}组`
    ],
    [
        /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{2}) - (\d{2})/,
        (match, month, day1, day2) => `${_VAR.monthmap_short[month]}${day1}日 - ${day2}日`
    ],
    [
        /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{2}) - (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{2})/,
        (match, startMonth, startDay, endMonth, endDay) => `${_VAR.monthmap_short[startMonth]}${startDay}日 - ${_VAR.monthmap_short[endMonth]}${endDay}日`
    ],
    [
        /(January|February|March|April|May|June|July|August|September|October|November|December) (\d{1,2}), (\d{4}) - (\d{2}:\d{2})/,
        (match, month, day, year, time) => `${year}年${_VAR.monthmap_full[month]}${day}日 - ${time}`
    ],
    [
        /(January|February|March|April|May|June|July|August|September|October|November|December) (\d{1,2})-(\d{1,2})/,
        (match, month, startDay, endDay) => `${_VAR.monthmap_full[month]}${startDay}日-${endDay}日`
    ],
    [
        /(January|February|March|April|May|June|July|August|September|October|November|December) (\d{1,2}), (\d{4})/,
        (match, month, day, year) => `${year}年${_VAR.monthmap_full[month]}${day}日`
    ],
    [
        /(January|February|March|April|May|June|July|August|September|October|November|December) (\d{1,2})(st|nd|rd|th)/,
        (match, month, day) => `${_VAR.monthmap_full[month]}${day}日`
    ],
    [
        /(January|February|March|April|May|June|July|August|September|October|November|December) (\d{1,2})/,
        (match, month, day) => `${_VAR.monthmap_full[month]}${day}日`
    ],
    [
        /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec) (\d{1,2})/,
        (match, month, day) => `${_VAR.monthmap_short[month]}${day}日`
    ],
    [/\((\d+)\s+days\s+ago\)/, "($1天前)"],

    // * 名次
    [/place (\d{1,2}) to (\d{1,2})/, "第$1至第$2名"],
    [/(\d+)(st|nd|rd|th)-(\d+)(st|nd|rd|th)/, "$1-$3名"],
]
const i18n = new Map([
    /** 锦标赛 */
    // * DreamLeague
    ['DreamLeague', '梦幻联赛'],
    // * ESL One
    ['ESL One Berlin Major 2023', 'ESL One 柏林MAJOR 2023'],
    ['ESL One Kuala Lumpur 2023', 'ESL One 吉隆坡锦标赛 2023'],
    ['ESL One Birmingham', 'ESL One 伯明翰锦标赛'],
    ['ESL One Birmingham 2024', 'ESL One 伯明翰锦标赛 2024'],
    ['ESL One Bangkok 2024', 'ESL One 曼谷锦标赛 2024'],
    ['ESL One Raleigh 2025', 'ESL One 罗利锦标赛 2025'],
    // * FISSURE
    ['FISSURE PLAYGROUND', 'FISSURE裂变天地'],
    ['FISSURE Universe', 'FISSURE裂变天地'],
    ['BetBoom Dacha', 'BB别墅杯'],
    // * Other Tier 1 Tournaments
    ['Games of the Future 2024', '2024年未来运动会'],
    ['BetBoom Dacha Dubai', 'BetBoom别墅杯迪拜站'],
    ['BetBoom Dacha Dubai 2024', 'BetBoom别墅杯迪拜站 2024'],
    ['BetBoom Dacha Dubai 2024: Solo Tournament', 'BetBoom别墅杯迪拜站 2024: 单挑赛'],
    ['Elite League', '精英联赛'],
    // * Other Tier 2 Tournaments
    ['', ''],

    /** 通用术语(尽量避免使用过短的单词) */
    ['and', '与'],
    ['Points', '积分'],
    ['CST', '北京时间'],

    /** 月份 */
    ...Object.entries(_VAR.monthmap_short),
    ...Object.entries(_VAR.monthmap_full),

    /** 主页 */
    ["Trending"," 趋势"],
    ["Tournaments"," 锦标赛"],
    ["Contribute","贡献"],
    ["Main page"," 主页"],
    ["Main Page"," 主页"],
    ["Special page"," 特殊页面"],
    ["Page"," 页面"],
    ["Talk"," 聊天"],
    ["Edit"," 编辑"],
    ["History"," 历史"],
    ["User"," 用户"],
    ["Preferences"," 偏好设置"],
    ["Watchlist"," 关注列表"],
    ["Contributions"," 贡献"],
    ["Log out"," 登出"],
    ["Search", "搜索"],
    ["Share","分享"],
    ["Tools","工具"],
    ['Nation', '国家'],
    ['National', '国家赛'],
    ['Light Theme', '浅色主题'],
    ['Dark Theme', '深色主题'],
    ["Upcoming:","即将开始的"],
    ["Ongoing:","正在进行的"],
    ["Completed:","已经结束的"],
    ["Upcoming","即将开始的"],
    ["Ongoing","正在进行的"],
    ["Completed","已经结束的"],
    ["Recent","已经结束的"],
    ["Past","已经结束的"],
    ["Most Recent", "已经结束的"],
    ["Welcome to","欢迎来到"],
    ['Old', '旧'],
    ['New', '新'],
    ['Ref', '参'],
    ['None', '无'],
    ['Concluded', '已结束'],
    ['Winners', '优胜者'],
    ['(Manager)', '(经理)'],
    ['(Coach)', '(教练)'],
    ['(Sub)', '(替补)'],
    ['(Trial)', '(试用)'],
    ['(Trial Coach)', '(试用教练)'],
    ['(Inactive)', '(不活跃)'],
    ['(Loan/Inactive)', '(租借/不活跃)'],
    ['(Coach/Inactive)', '(教练/不活跃)'],
    ['This day in Dota', 'Dota 那年今日'],
    ['No tournament ended on this date', '没有锦标赛在从前的今日结束。'],
    ['Birthdays', '生日'],
    ['Trivia', '琐事'],
    ['Add trivia about this day', '如想添加关于今日的琐事，请点击'],
    ['here', '这里'],
    ['released', '发布'],
    ['Back to top', '返回顶部'],
    ['See more transfers', '查看更多'],
    ['Transfer query', '转会查询'],
    ['Input Form', '输入表单'],
    ['Create Account', '注册'],
    ['Log In', '登录'],
    ['Join Our Discord', '加入我们的Discord'],
    ['Help Articles', '帮助'],
    ["About Liquipedia’s Dota 2 Wiki","关于 Liquipedia 的 Dota 2 维基"],
    ['Heroes', '英雄'],
    ['Items', '物品'],
    ['Mechanics', '机制'],
    ['Cosmetics', '饰品'],
    ['Updates', '更新'],
    ['View Esports Hub', '查看电竞主页'],
    ['View Game Hub', '查看游戏主页'],
    ['Show Countdown', '显示倒计时'],
    ['See more matches', '查看更多比赛'],
    ['COMPLETED', '已结束'],
    // "更新"面板
    ['Latest Patch:', '上一次更新:'],
    ['Latest Blog Post:', '上一次新闻:'],
    ['Latest Version:', '上一个版本:'],
    ['Latest Hero:', '上一个英雄:'],
    ['Update', '更新'],
    ['List of Patches', '更新列表'],
    ['List of Versions', '版本列表'],
    ['Current Minimap', '当前小地图'],
    // "实用文章"面板
    ['Useful Articles', '实用文章'],
    ['New to Dota?', '新来的?'],
    ['Tutorial', '辅导'],
    ['Map', '地图'],
    ['Minimap', '小地图'],
    ['Runes', '神符'],
    ['Abilities', '能力'],
    ['Creeps', '小兵'],
    ['Buildings', '建筑'],
    ['Roles', '角色'],
    ['Glossary', '术语'],
    ['Creep control techniques', '兵线控制技巧'],
    ['Events', '活动'],
    ['Memes', '梗'],
    ['Cosmetic Items', '饰品'],
    ['Equipment', '装备'],
    ['Custom Couriers', '自定义信使'],
    ['Gems', '宝石'],
    ['Rarity', '稀有度'],
    ['Quality', '品质'],
    ['Item drop system', '物品掉落系统'],
    ['', ''], // todo
    // "想要帮忙吗?"面板
    ['Want To Help?', '想要帮忙吗?'],
    [
        'Create your free account and join the community to start making a difference by sharing your knowledge and insights with fellow esports fans!',
        '创建免费账户并加入社区，通过与其他电子竞技爱好者分享你的知识和见解，开始为改变局面做出贡献！'
    ],
    ['Join our community and grow the scene(s) you care about.', '加入我们的社区，发展你关心的领域。'],
    ['Be a hero for fans worldwide by keeping the site updated.', '通过保持网站更新，成为全球粉丝的英雄。'],
    ['Develop valuable skills in research, writing, and collaboration.', '在研究、写作和协作方面发展有价值的技能。'],
    [': The page is missing TeamCards', ': 此页面缺少队伍卡片'],
    [': The page is missing TeamCards and prize info', ': 此页面缺少队伍卡片和奖金信息'],
    ['In total there are', '目前总共有'],
    ['listed needing help.', '需要帮助。'],

    /** 主页子弹窗 */
    ['General', '常规'],
    ['Stream Page', '推流页面'],
    ['Team Templates', '队伍模板'],
    ['Specific', '特有'],
    ['What links here globally', '关联页面'],
    ['Browse LiquipediaDB data', '浏览LiquipediaDB数据'],
    ['Copy Link', '复制链接'],
    ['Edit an Article', '编辑文章'],
    ['Create an Article', '新建文章'],
    ['Help Portal', '帮助门户'],
    ['Chat With Us', '联系我们'],
    ['Feedback Thread', '反馈渠道'],

    /** 底部词缀 */
    ['About', '关于'],
    ['Affiliated Sites', '关联站点'],

    /** 维基术语 */
    ['Portal', '导航'],
    ['Introduction', '引言'],
    ['Category', '分类'],
    ['Categories', '分类'],
    ['Tiebreaker', '加赛'],
    ['Tiebreaker (1v1)', '加赛 (1v1)'],
    ['Match Page', '赛事页面'],

    /** 图例 */
    ['Legend', '图例'],
    ['Example', '示例'],
    ['Points for finishing 1st', '通过夺得第 1 名而获取的积分'],
    ['Points for finishing 2nd', '通过夺得第 2 名而获取的积分'],
    ['Points for finishing 3rd', '通过夺得第 3 名而获取的积分'],
    ['Points for finishing 4th', '通过夺得第 4 名而获取的积分'],
    ['Team will finish in the top 8 (barring transfers)', '战队将保持在前 8 名 (除非发生转会)'],
    ['Points are provisional for the active tournament and could increase', '代表战队将从该锦标赛至少获取此数额的积分, 并可能继续增加'],
    ['Team can no longer finish in the top 8', '战队将不再具有进入前 8 名的机会'],
    ['', ''],

    /** 选手状态 */
    ['Inactive', '不活跃的'],
    ['Banned', '被禁赛的'],
    ['Retired', '已退役的'],
    ['Deceased', '已离世的'],

    /** WIKI导航 */
    ["Main", "主要"],
    ["Sport", "体育"],
    ["Alpha", "内测"],
    ["Pre Alpha", "预览内测"],
    ["Favorites", "我的收藏"],

    /** 顶部广告条 */
    ["Liquipedia Dota 2 needs more help, are you able to? You just have to", "Liquipedia的Dota 2维基需要更多帮助! 请"],
    ["register", "注册"],
    ["an account and then", "一个账号并且"],
    ["log in", "登录"],
    ["to edit our pages. If you have any questions you can", "它来编辑我们的页面。在此期间若您遇到任何问题,请"],
    ["join", "加入"],
    ["the #dota2 channel on Discord.", "我们在Discord上的 #dota2 频道。"],
    ["Want to be updated on everything you love in esports? Download the Liquipedia app on", "想要时刻跟进您喜爱电竞的最新信息吗?下载"],
    ["or", "或"],
    ["and never miss a beat of your favorite tournaments, teams, players, and matches!", "上的Liquipedia应用程序,就能不再错过任何你最喜爱的赛事、战队、选手和比赛!"],
    ["Be sure the new page meets our ", "在添加新页面之前，请确保它符合我们的"],
    ["notability guidelines", "显著性准则"],
    ["before adding it. If it does not, it will be moved to your user space. You are more than welcome to ask questions in our", "。如果页面不符合准则，它将被移动到您的私人空间。如果有任何疑问，欢迎到这里提问："],
    ['Our friends over at Dota 2 Wiki (Fandom) are moving in with us! Check out the brand new Dota 2 game content', '我们在Dota 2维基（Fandom）的朋友们要搬来和我们一起住了！要查看全新的Dota 2游戏内容，请点击'],
    ['. If you’d like to help out, join our', '。如果你想要帮忙的话，请加入我们的'],
    ['', ''],

    /** 登录页面 */
    ["Log in", "登录"],
    ["Please log in using your", "请使用你的 "],
    ["account.", " 账号。"],
    ["If you don't have an account, you can", "如果你没有账号，那么可以"],
    ["register here", "在这里注册"],
    ["Username", "用户名"],
    ["Enter your username", "在这里输入用户名"],
    ["Password", "密码"],
    ["Enter your password", "在这里输入密码"],
    ["Keep me logged in", "记住登录状态"],
    ["Register an account here", "点击这里注册一个账号"],

    /** 空白页面 */
    ["There is currently no text in this page. To create this page you first need to", "这个页面目前没有任何内容。如果想要创建这个页面，那么你需要先"],
    ["You can ", "你可以"],
    ["search for this page title", "搜索此页面标题"],
    ["in other pages, or", "，或是"],
    ["search the related logs", "搜索相关日志"],
    [", but you do not have permission to create this page.", "，但你目前没有创建这个页面的权限。"],

    /** 日志页面 */
    ["All public logs", "所有公开日志"],
    ["Combined display of all available logs of Liquipedia Dota 2 Wiki. You can narrow down the view by selecting a log type, the username (case-sensitive), or the affected page (also case-sensitive).", "所有Liquipedia Dota 2 Wiki公开日志的联合展示。您可以通过选择日志类型、输入用户名（区分大小写）或相关页面（区分大小写）筛选日志条目。"],
    ["Logs", "日志"],
    ["Performer:", "操作者:"],
    ["Target (title or User:username for user):", "被操作者 (标题或以“User:用户名”表示用户):"],
    ["From date (and earlier):", "起始日期 (及更早日期):"],
    ["No date selected", "还未选定日期"],
    ["Tag", "标签"],
    ["filter:", "过滤器:"],
    ["Show additional logs:", "展示更多日志:"],
    ["Review log", "复核日志"],
    ["Patrol log", "巡查日志"],
    ["Tag log", "标签日志"],
    ["User creation log", "用户创建日志"],
    ["Show", "展示"],
    ["newest", "最新"],
    ["oldest", "最早"],
    ["talk", "讨论"],
    ["contribs", "贡献"],
    ["stats", "统计"],

    /** EPT积分榜页面 */
    ['Points shown are provisional. Teams participating in', '所示积分为暂定。参与'],
    ['are guaranteed at least 280 ESL Pro Tour points, while teams participating in', '的队伍将获得至少 280 点EPT积分，而参与'],
    ['are guaranteed at least 250 ESL Pro Tour points.', '的队伍将获得至少 250 点EPT积分。'],
    ['At the end of the season, top 8 qualify to', '在赛季结束时，前8名将被直邀'],
    ['Tiebreaker rules', '平分处理规则'],
    ['Best placement in an individual EPT event', '所有EPT赛事中的最好名次'],
    ['Best placement in most recent EPT event', '最近EPT赛事中的最好名次'],
    ['Points deduction rules', '积分扣除规则'],
    ['Teams can make roster changes within "transfer windows", but points may be deducted if too many are made.  A "transfer window" is the period between two consecutive EPT tournaments, or the qualifiers, if the team is competing in its qualifier instead.',
     '战队可以在“转会窗口期”内更改成员名单，但如果更改次数过多，可能会被扣分。“转会窗口”是指连续两次EPT锦标赛之间的时间段，如果战队参加预选赛则还包含预选赛。'],
    ['If a team changes one player, there will be no penalty.', '如果队伍更换 1 名队员，则不会受到积分处罚。'],
    ['If a team changes two players, there will be a 30% penalty to all EPT points earned, with the total held amount after the deduction rounded to the nearest whole.',
     '如果队伍更换 2 名队员，则受到已获得的所有EPT积分30%数额的惩罚，扣除后的积分将四舍五入到最近的整数。'],
    ['If a team changes three players or more, their EPT points will be reduced to 0.', '如果队伍更换 3 名或更多的队员，则其EPT积分将归零。'],
    ['If a team fails to notify the administration before making public a roster change of any kind, they will be penalised for 10% of their EPT points earned, ' +
     'with the total held amount after the deduction rounded to the nearest whole.',
     '如果队伍在宣布其阵容变动前未有知会赛事管理方，则受到已获得的所有EPT积分10%数额的惩罚，扣除后的积分将四舍五入到最近的整数。'],
    ['Points are held by the players on the teams, not the teams themselves.  Thus if three players depart a team to join the same new team, the "slot" only loses 30% of its points, rather than all of them, as it can be seen as the "slot" changing the other two players.',
     '积分由战队中的队员持有，而非战队本身。因此，如果有三名选手离开一支队伍加入同一支新队伍，他们只会失去30%的积分而非全部，因为可以看作原队伍改名并更换了其他两名选手。'],
    ['If a team changes enough players that their EPT point is reset to 0, ' +
     'they lose the rights to competition in any Closed Qualifier or Main Event they had previously been invited to, ' +
     'with those rights passing to the majority of that team which has just left. If no majority remains, or the team otherwise withdraws, ' +
     'the slot will revert to the next strongest region’s Qualifier, according to the',
     '如果一支队伍更换队员过多而导致其EPT积分归零，则其失去之前受邀参加的任何封闭预选赛或主赛事的参赛权利，这些权利将归于离开该队伍的多数选手。如果没有多数选手，或者该队伍弃权，则根据'],
    ['EPT Regional Rankings', 'EPT地区排名'],
    ['(in the case of a Main Event slot becoming available), or to the Open Qualifiers (in the case of a Closed Qualifier slot becoming available).',
     '将这个名额转移到下一个最强赛区的预选赛 (在主赛事参赛名额可用的情况下)，或是加入到公开预选赛的晋级名额中 (在封闭预选赛参赛名额可用的情况下)。'],
    ['In the case that a Qualifier Period or Invitation Period falls during a transfer window, the rule that allows for a team’s slots in a tournament ' +
     'to be waived in case of significant roster change will be suspended.',
     '如果预选赛或邀请赛期间正值转会窗口期，则将暂停执行允许在出现重大阵容变化时允许队伍在放弃比赛名额的规则。'],
    ['The one month immediately following The International Grand Final', '国际邀请赛总决赛后的 1 个月内'],
    ['The two week period either side of the Lunar New Year celebrations in China (for 2024, 3-17 February)', '中国春节的前后 2 周内 (2024年春节为2月3~17日)'],
    ['Rosters are still subject to review and potential revocation of slot.', '参赛选手名单仍需接受审查，并有可能被取消参赛资格。'],
    ['Master Rulebook available at', '主规则手册可参阅'],
    ['EPT Rulebook', 'EPT规则书'],
    ['External links', '外部链接'],
    ['ESL Pro Tour Season 2 Leaderboard', 'EPT第2赛季积分榜'],
    ['Raw JSON data for the leaderboard (including teams outside of the top 10)', '积分榜的JSON数据源 (包括未进入前10名的队伍)'],

    /** 联赛信息(赛事页面右边栏) */
    ["League Information","联赛信息"],
    ["Links","链接"],
    ["Chronology", "年表"],
    ["Series","系列赛"],
    ["Series:","系列赛"],
    ["Venue:","地点"],
    ["Game:","游戏"],
    ["Liquipedia Tier:", "Liquipedia等级"],
    ["Organizer:","主办方"],
    ["Organizers:", "主办方"],
    ["Sponsor:","赞助商"],
    ["Sponsor(s):","赞助商"],
    ["Version:","版本"],
    ["Type:","类型"],
    ["Server:","服务器"],
    ["Location:","位置"],
    ["Offline","线下赛"],
    ["Online","线上赛"],
    ["Date","日期"],
    ["Date:","日期"],
    ["Dates:","日期"],
    ["Teams:","队伍数量"],
    ["Teams","队伍"],
    ["Team","队伍"],
    ["Team ","队伍"],
    ["Format:","赛制"],
    ["Prize Pool","奖金池"],
    ["Prize Pool:","奖金池"],
    ["Prize pool:","奖金池"],
    ["Start Date:","开始日期"],
    ["End Date:","结束日期"],
    ["Pro Circuit Points:","巡回赛积分"],
    ["Pro Circuit Tier:","巡回赛阶级"],
    ['Round-robin group stage', '小组赛阶段:循环赛'],
    ['Double-elimination playoffs', '淘汰赛阶段:双败淘汰赛'],
    ["Round-robin","单循环赛"],
    ["Double-elimination","双败淘汰赛"],
    ["Single-elimination","单败淘汰赛"],
    ['Accommodation', '住宿'],
    ['Find My Accommodation', '查找我的住宿'],
    ['Bookings earn Liquipedia a small commission.', '通过这里预订住宿可以为 Liquipedia 赚取一小笔佣金。'],

    /** 赛制 */
    ["Format","赛制"],
    ['Twenty teams', '12支队伍'],
    ['Eight teams from', '8支队伍来自'],
    ['Five teams based on EPT Interregional Strength Rankings on 1 June 2024', '根据2024年6月1日时的EPT地区实力排名邀请5支队伍'],
    ['Seven teams from regional qualifiers', '7支队伍来自地区预选赛'],
    ['Play-In', '入围赛'],
    ['Two groups of six teams each', '分为2组，每组6支队伍'],
    ['Two groups of eight teams each', '分为2组，每组8支队伍'],
    ['Top three teams', '前3名'],
    ['4th to 5th place team', '第4-5名'],
    ['5th and 6th place team', '第4-5名'],
    ['from each group advance to the group stage', '(每组) 晋级到小组赛阶段'],
    ['from each group will be matched', '(每组) 需要进行定级赛'],
    ['Matches are played from opposite groups', '比赛的双方来自不同的小组'],
    ['will advance to group stage', '将晋级到小组赛阶段'],
    ['Losers', '失败者'],
    ['from each group advance to the upper bracket of the playoffs', '(每组) 晋级到淘汰赛胜者组'],
    ['from each group advance to the lower bracket of the playoffs', '(每组) 晋级到淘汰赛败者组'],
    ['', ''],
    ['Single round-robin', '单循环赛'],
    ['Two single round-robin groups of six teams each', '分为2组,每组6支队伍,展开组内单循环赛'],
    ['Two single round-robin groups of eight teams each', '分为2组,每组8支队伍,展开组内单循环赛'],
    ['One single round-robin group of eight teams', '8支队伍在1组内展开单循环赛'],
    ['from each group advance to group stage 2', ' (每组) 晋级到第2轮小组赛'],
    ['from each group advance to upper bracket of playoffs', ' (每组) 晋级到淘汰赛胜者组'],
    ['from each group advance to lower bracket of playoffs', ' (每组) 晋级到淘汰赛败者组'],
    ['from each group advance to upper bracket of the playoffs', ' (每组) 晋级到淘汰赛胜者组'],
    ['from each group advance to lower bracket of the playoffs', ' (每组) 晋级到淘汰赛败者组'],
    ['from each group advance to the upper bracket of playoffs', ' (每组) 晋级到淘汰赛胜者组'],
    ['from each group advance to the lower bracket of playoffs', ' (每组) 晋级到淘汰赛败者组'],
    ['from each group advance to 2nd stage of the playoffs', ' (每组) 晋级到淘汰赛第2轮'],
    ['from each group advance to 1st stage of the playoffs', ' (每组) 晋级到淘汰赛第1轮'],
    ['advance to the upper bracket of the playoffs', ' 晋级到淘汰赛胜者组'],
    ['advance to the lower bracket of the playoffs', ' 晋级到淘汰赛败者组'],
    ['advance to upper bracket of the playoffs', ' 晋级到淘汰赛胜者组'],
    ['advance to lower bracket of the playoffs', ' 晋级到淘汰赛败者组'],
    ['is eliminated', '将被淘汰'],
    ['are eliminated', '将被淘汰'],
    ['from each group is eliminated', ' (每组) 将被淘汰'],
    ['from each group are eliminated', ' (每组) 将被淘汰'],
    ['Top team', '第1名的队伍'],
    ['Top two teams', '前2名的队伍'],
    ['Top four teams', '前4名的队伍'],
    ['Top six teams', '前6名的队伍'],
    ['Top eight teams', '前8名的队伍'],
    ['Next two team', '之后2名的队伍'],
    ['2nd and 3rd place teams', '第2&3名的队伍'],
    ['3rd and 4th place teams', '第3&4名的队伍'],
    ['3rd-4th place teams', '第3~第4名的队伍'],
    ['3rd to 4th place teams', '第3~第4名的队伍'],
    ['3rd or 4th place teams', '第3或第4名的队伍'],
    ['5th to 6th place teams', '第5~第6名的队伍'],
    ['5th to 8th place teams', '第5~第8名的队伍'],
    ['Bottom team', '最后1名的队伍'],
    ['Bottom two teams', '最后1名的队伍'],
    ['Remaining teams', '剩余队伍'],
    ['All matches are', '所有比赛均为 '],
    ['Single-elimination bracket', '单败淘汰赛赛制'],
    ['Double-elimination bracket', '双败淘汰赛赛制'],
    ['All series are', '系列所有比赛均为'],
    ['All matches except Grand Final are', '除总决赛之外的所有比赛均为 '],
    ['All series consist of two games', '系列所有比赛均为 Bo2'],
    [', all other series are', ', 系列其他比赛均为'],
    ['Quarterfinals and Semifinals are', '四分之一决赛和半决赛为'],
    ['Grand Final is', '总决赛为 '],
    [', Grand Final is', ', 总决赛为 '],
    [', Lower Bracket Round 1 are', ', 败者组第1轮为'],
    [', all other matches are', ', 其他比赛均为'],
    ['One team qualifies to', '只有1支队伍能够晋级'],
    ['One team qualifies to the', '只有1支队伍能够晋级'],
    ['Two teams qualify to the', '最后2支队伍晋级'],
    ['main tournament', '主赛事'],
    // 赛制 - 单挑赛
    ['Players take turns picking 3 heroes each from the general pool of heroes in Dota 2', '双方玩家从Dota2的常规英雄池中轮流挑选3个英雄'],
    ['The total hero pool is 10 for each match', '每场比赛的总英雄池数量为10个'],
    ['Contains 4 default heroes (Pudge, Shadow Fiend, Puck, Mirana) + 6 picked heroes', '包括4个默认的英雄(帕吉,影魔,帕克,米拉娜)和6个挑选的英雄'],
    ['Players take turns banning heroes from the hero pool', '双方玩家轮流在比赛英雄池里禁用英雄'],
    ['Bans will take place until there is only one hero left', '直到比赛英雄池只剩下1个英雄'],
    ['Prohibitions;', '禁止事项:'],
    ['farming in the jungle', '刷野'],
    ['destroying observer wards', '排眼'],
    ['visiting other lanes', '参观边路'],
    ['blocking the first wave of creeps', '卡第一波的兵'],
    ['collecting and using runes', '收集/使用神符'],
    ['bottle and infused raindrops', '魔瓶/凝魂之露'],
    ['Victory condition;', '胜利条件:'],
    ['tower destruction', '摧毁对方的防御塔'],
    ['two kills', '获得2次击杀'],
    ['surrender of the opponent', '对方投降'],
    ['If within 15 minutes neither player has reached any of the above conditions, the following formula will be taken into account:', '如果15分钟内双方都没有达成胜利条件, 那么将下述公式作为胜利规则:'],
    ['Summary of creepstat + kills x 35', '补刀数 + 击杀数×35'],
    ['Players can agree to additional game rules that do not conflict with existing regulations.', '双方玩家可以同意不与现行规定相冲突的其他游戏规则。'],
    // 赛制 - 特殊赛制
    ['Opening Matches', '开场赛'],
    ['Decider Match', '定级赛'],
    ['Elimination Match', '淘汰赛'],
    // 赛制 - 精英联赛
    ['Ten teams from closed qualifiers seeded into swiss stage (group stage 1)', '10支从封闭预选赛晋级的队伍进入瑞士轮阶段 (即小组赛#1)'],
    ['Six teams invited are seeded into swiss stage (group stage 1)', '6支直邀队伍进入瑞士轮阶段 (即小组赛#1)'],
    ['Eight teams invited are seeded into round-robin stage (group stage 2)', '8支直邀队伍进入循环赛阶段 (即小组赛#2)'],
    ['Swiss Stage', '瑞士轮阶段'],
    ['Round-Robin Stage', '循环赛阶段'],
    ['Swiss Stage (Group Stage 1)', '瑞士轮阶段 (即小组赛#1)'],
    ['Round-Robin Stage (Group Stage 2)', '循环赛阶段 (即小组赛#2)'],
    ['One modified swiss-system of sixteen teams', '16支队伍在改良瑞士轮赛制下展开对决'],
    ['advance to round-robin stage (group stage 2)', '晋级到循环赛阶段 (即小组赛#2)'],
    ['Two single round-robin group of eight teams each', '分为2组，每组8支战队展开单循环赛'],
    // 赛制 - BLAST Slam
    ['Two round-robin groups of five teams each', '参赛队伍分为2组，每组5支队伍展开循环赛'],
    ['Teams are seeded to the playoffs according to their placement (King of the Hill)', '参赛队伍将根据其排名晋级到淘汰赛的不同起点 (占山为王)'],
    ['1st place teams', '第1名的队伍'],
    ['2nd place teams', '第2名的队伍'],
    ['3rd place teams', '第3名的队伍'],
    ['4th and 5th place teams', '第4&5名的队伍'],
    ['are seeded to Semifinals', '直接晋级到半决赛'],
    ['are seeded to Quarterfinals', '晋级到1/4决赛'],
    ['are seeded to Round 2', '晋级到第2轮'],
    ['are seeded to Round 1', '晋级到第1轮'],

    /** 赛制 - 同分处理规则 */
    ["Click here for tiebreaker rules","点此查看同分处理规则"],
    ["Click here for Group Stage tiebreaker rules", "点此查看小组赛的同分处理规则"],
    ["Click here for Group Stage 1 tiebreaker rules", "点此查看第1轮小组赛的同分处理规则"],
    ["Click here for Group Stage 2 tiebreaker rules", "点此查看第2轮小组赛的同分处理规则"],
    [`If the tie is over a position of significance;`, `如果在重要位置上出现同分,按照同分的队伍数量决定处理方式：`],
    [`Two teams - a`, `2支队伍 - 一场`],
    [`will be played`, `比赛`],
    [`Three teams or more - a`, `3支或更多队伍 - 启用`],
    [`round-robin will be played`, `的单循环赛`],
    [`If the tiebreaker does not resolve following the first round of the round robin`, `如果第1轮循环赛结束后仍旧存在同分情况,按照仍旧同分的队伍数量决定后续处理：`],
    [`Three teams - the tiebreaker will be replayed`, `3支队伍 - 重新开始加赛`],
    [`Four teams or more - the matrix listed below will be used to resolve the tie, adding the information from the tiebreaker matches to those gathered during the group stage`, `4支或更多队伍 - 统计各队在小组赛阶段的战绩和加赛期间的战绩,使用下方的规则决定最终排名`],
    [`If there is with no schedule allowance and involves explicit elimination, then 1v1 tiebreakers will be played.`,`如果赛程表没有足够进行完整加赛的余裕,同分位置又涉及明确的出局划分,则进行1v1的加赛。`],
    [`If there is no schedule allowance, then 1v1 tiebreakers will be played`, `如果赛程表没有足够进行完整加赛的余裕,则进行1v1的加赛。`],
    [`For ties that are not over positions of significance (in order of importance):`, `而对于在非重要位置上出现同分的场合,按照以下规则处理(以优先级排序)：`],
    [`Number of 2-0 series`, `获得2:0胜利的次数`],
    [`Neustadtl score`, `计算 Neustadtl 积分`],
    [`Head-to-head record between the tied participants taking only game score into account`, `同分战队之间的胜负关系`],
    [`Record vs the first team below the tied teams, continuing to each subsequent team below the tied teams til the tie is resolved`, `与排名低于同分战队的战队的胜负关系`],
    [`1v1 tiebreakers`, `1v1 加赛`],

    /** 奖金池 */
    ["Place","名次"],
    ["Placement","名次"],
    ['Qualifies To', '晋级'],
    ['Base', '基础'],
    ["USD","美元"],
    ["CNY","人民币"],
    ['Percent', '占比'],
    ["Point","积分"],
    ["EPT Points", "EPT积分"],
    ['are spread among the participants as seen below:', '将分配给参赛战队，规则如下所示:'],
    ['Show remaining', '显示剩余队伍'],
    ['Hide remaining', '隐藏剩余队伍'],

    /** 名次 */
    // [/(\d{1,2})(st|nd|rd|th)/g, "第$1名"],
    ['1st', '第1名'],
    ['2nd', '第2名'],
    ['3rd', '第3名'],
    ['4th', '第4名'],
    ['5th', '第5名'],
    ['6th', '第6名'],
    ['7th', '第7名'],
    ['8th', '第8名'],
    ['9th', '第9名'],
    ['10th', '第10名'],
    ['11th', '第11名'],
    ['12th', '第12名'],
    ['13th', '第13名'],
    ['14th', '第14名'],
    ['15th', '第15名'],
    ['16th', '第16名'],
    ['17th', '第17名'],
    ['18th', '第18名'],
    ['19th', '第19名'],
    ['20th', '第20名'],

    /** 参赛队伍 */
    ["Participant","参赛队伍"],
    ["Participants","参赛队伍"],
    ["Show Players","显示选手"],
    ["Hide Players","隐藏选手"],
    ["Player Info","选手信息"],
    ['Notes', '备注'],
    ['Former Participants', '此前的参赛队伍'],
    ['Top 8', '八强'],
    ['Notable registered participants', '值得注意的注册战队'],
    ['This tab contains a non-exhaustive list of', '此标签展示在这一预选赛中'],
    ['notable, registered participants', '值得注意或知名的，已注册到参赛队伍列表中的队伍'],
    [
        `in this qualifier.  These could be notable teams, or teams with highly-notable players (such as former grand finalists of The International), or teams that are believed to be of viewer interest in the region.  These teams are not the only ones taking part in this qualifier, and are only shown for reader convenience.`,
        `列表。这些战队可能比较知名，也可能是拥有非常值得注意的队员（比如曾进入过TI总决赛的选手），又或者是被认为赛区观众会很感兴趣的。并非只有这些战队参加这一预选赛，在此处展示只是为了方便读者。`
    ],
    ["Invited Teams","直邀队伍"],
    ["Qualified Teams","预选赛队伍"],
    ["Regional Qualified Teams","地区预选赛队伍"],
    ['EPT Interregional Rankings', 'EPT地区实力排名'],
    // 参赛队伍 - 种子
    ['Round-Robin Stage Seeds', '循环赛阶段种子'],
    ['Swiss Stage Seeds', '瑞士轮阶段种子'],
    // 参赛队伍 - 队伍来源(资格)
    ["Invited","直邀"],
    ["Western Europe","西欧"],
    ["Eastern Europe","东欧"],
    ["Southeast Asia","东南亚"],
    ["China","中国"],
    ["North America","北美"],
    ["South America","南美"],
    ["Saudi Arabia","沙特阿拉伯"],
    ["MENA","MENA(中东&北非)"],
    ["Europe & CIS","欧洲&独联体"],
    ["Europe","欧洲"],
    ["CIS","独联体"],
    ["Americas","美洲"],
    ["NA and SA", "北美&南美"],
    ["CN and SEA", "中国&东南亚"],
    ["Asia","亚洲"],
    ["Upper Div.","S级"],
    ["Lower Div.","A级"],
    ["Division I","S级"],
    ["Division I ▼","S级 ▼"],
    ["Division II","A级"],
    ["Division II ▲","A级 ▲"],
    ["Open Qualifier ▲","海选赛 ▲"],
    ["Last Chance Qualifier","最终突围赛"],

    /** 小组赛 */
    ["Group Stage","小组赛"],
    ["Group Stage 1","小组赛 1"],
    ["Group Stage 2","小组赛 2"],
    ["Group Stage 3","小组赛 3"],
    ["Group A", "A组"],
    ["Group B", "B组"],
    ["Group C", "C组"],
    ["Group D", "D组"],
    ["Group E", "E组"],
    ["Leaderboard", "计分板"],
    ["For detailed match results, click", "要查看详细的比赛结果,请点击"],
    ["HERE", "此处"],

    /** 淘汰赛 */
    ["Playoffs","淘汰赛"],
    ["Show schedule","显示赛程"],
    ["Show bracket","显示示意"],
    ["BYE","(轮空)"],
    ["Qualified","入选"],
    ['Fixed schedule', '固定时间表 (即使上一场比赛提前结束,下一场比赛也不会提前开始)'],
    ['Follow-by schedule', '连续时间表 (如果上一场比赛提前结束,下一场比赛将会提前开始)'],
    ['Rolling schedule', '动态时间表 (比赛时间由主办方动态调整)'],
    ['Final three days will be played in front of a live audience.', '只有最后三天的比赛会在线下举行。'],
    // 淘汰赛 - 双败淘汰赛类型
    ["Qualifying Matches","名额决定赛"],
    ["Grand Final","总决赛"],
    ["Upper Round 1","胜者组第1轮"],
    ["Upper Round 2","胜者组第2轮"],
    ["Upper Round 3","胜者组第3轮"],
    ["Upper Round 4","胜者组第4轮"],
    ['Upper Bracket Round 1', '胜者组第1轮'],
    ['Upper Bracket Round 2', '胜者组第2轮'],
    ['Upper Bracket Round 3', '胜者组第3轮'],
    ['Upper Bracket Round 4', '胜者组第4轮'],
    ["Upper Quarter-Finals","胜者组复赛"],
    ["Upper Bracket Quarterfinals","胜者组复赛"],
    ["Upper Bracket Quarter-Finals","胜者组复赛"],
    ["UB Quarterfinals","胜者组复赛"],
    ["Upper Bracket Semi-Finals","胜者组半决赛"],
    ["Upper Bracket Semifinals","胜者组半决赛"],
    ["UB Semifinals","胜者组半决赛"],
    ["Upper Bracket Final","胜者组决赛"],
    ["Lower Round 1","败者组第1轮"],
    ["Lower Round 2","败者组第2轮"],
    ["Lower Round 3","败者组第3轮"],
    ["Lower Round 4","败者组第4轮"],
    ["Lower Round 5","败者组第5轮"],
    ["Lower Round 6","败者组第6轮"],
    ["Lower Bracket Round 1","败者组第1轮"],
    ["Lower Bracket Round 2","败者组第2轮"],
    ["Lower Bracket Round 3","败者组第3轮"],
    ["Lower Bracket Round 4","败者组第4轮"],
    ["Lower Quarter-Finals","败者组复赛"],
    ["Lower Bracket Quarter-Finals","败者组复赛"],
    ["Lower Bracket Quarterfinals", "败者组复赛"],
    ["Lower Bracket Semi-Finals","败者组半决赛"],
    ["Lower Bracket Semifinal","败者组半决赛"],
    ["Lower Bracket Final","败者组决赛"],
    // 淘汰赛 - 双败淘汰赛类型(较老的排版)
    ["Upper Bracket R1 (Bo3)","胜者组第1轮 (Bo3)"],
    ["Upper Bracket R2 (Bo3)","胜者组第2轮 (Bo3)"],
    ["Upper Bracket R3 (Bo3)","胜者组第3轮 (Bo3)"],
    ["Upper Bracket R4 (Bo3)","胜者组第4轮 (Bo3)"],
    ["Lower Bracket R1 (Bo1)","败者组第1轮 (Bo1)"],
    ["Lower Bracket R2 (Bo3)","败者组第2轮 (Bo3)"],
    ["Lower Bracket R3 (Bo3)","败者组第3轮 (Bo3)"],
    ["Lower Bracket R4 (Bo3)","败者组第4轮 (Bo3)"],
    ["Lower Bracket R5 (Bo3)","败者组第5轮 (Bo3)"],
    ["Lower Bracket R6 (Bo3)","败者组第6轮 (Bo3)"],
    ["Upper Bracket Final (Bo3)","胜者组决赛 (Bo3)"],
    ["Grand Final (Bo5)","总决赛 (Bo5)"],
    ["Lower Bracket Final (Bo3)","败者组决赛 (Bo3)"],
    // 淘汰赛 - 单败淘汰赛类型
    ["Round 1", "第1轮"],
    ["Round 2", "第2轮"],
    ["Round 3", "第3轮"],
    ["Round 4", "第4轮"],
    ["Round 5", "第5轮"],
    ['Round of 16', '16强赛'],
    ["Quarterfinals","四分之一决赛"],
    ["Semifinals","半决赛"],
    ["Quarter-Finals","四分之一决赛"],
    ["Semi-Finals","半决赛"],
    ["Third Place Match","铜牌赛"],
    ["Final","决赛"],

    /** 额外内容 */
    ["Additional Content","额外内容"],
    ["Captain Interviews","队长采访"],
    ["Recap","回放"],
    ["Additional Data","额外数据"],
    ["Statistics Overview", "统计概述"],
    ['Hero Stats', '英雄统计'],
    ['Hero Statistics', '英雄统计'],
    ["Country / Region","国家/地区"],
    ["Representation","代表"],
    ["Country Representation","国家/地区代表统计"],
    ["DPC Region Representation","赛区代表统计"],
    ['TI Appearances', 'TI出席统计'],
    ["External Links","外部链接"],
    ["Broadcast","直播"],
    ["Streams","推流"],
    ["For community broadcast guidelines;", "如果想参阅社区直播准则,请"],
    ["For community streaming guidelines;", "如果想参阅社区推流准则,请"],
    ["Other VODs","其他视频点播"],
    // 额外内容 - 解说
    ["Talent", "解说"],
    ['Host:', '主持:'],
    ['Hosts:', '主持:'],
    ['Hosts/Co-Hosts:', '主持/共同主持:'],
    ['Stage Host:', '舞台主持:'],
    ['Sideline Reporter:', '边线记者:'],
    ['Sideline Reporters:', '边线记者:'],
    ['Analyst:', '分析:'],
    ['Analysts:', '分析:'],
    ['Guest Analysts:', '分析嘉宾:'],
    ['Observers:', 'OB:'],
    ['Commentator:', '解说:'],
    ['Commentators:', '解说:'],
    ['Commentator/Analyst:', '解说/分析:'],
    ['Commentator/Analysts:', '解说/分析:'],
    ['Commentators/Analyst:', '解说/分析:'],
    ['Commentators/Analysts:', '解说/分析:'],
    ['Hosts/Analysts/Commentators:', '主持/分析/解说:'],
    ['Content Creator:', '内容创作:'],
    ['Content Creators:', '内容创作:'],
    ['Statistician:', '统计专家:'],
    ['Interviewer:', '采访:'],
    ['Producer:', '制作:'],
    ['Interviewer & Late Game Host:', '采访&后期游戏主持:'],
    ['Mandarin Interpreter:', '中文翻译:'],
    ['Russian Interpreter:', '俄语翻译:'],
    ['Spanish Interpreter:', '西班牙语翻译:'],
    ['Mandarin Interpreters:', '中文翻译:'],
    ['Russian Interpreters:', '俄语翻译:'],
    ['Spanish Interpreters:', '西班牙语翻译:'],
    ['Chinese', '中文'],
    ['English', '英语'],
    ['Russian', '俄语'],
    ['Spanish', '西班牙语'],
    ['Portuguese', '葡萄牙语'],
    ['Ukrainian', '乌克兰语'],
    ['Kazakh', '哈萨克语'],

    ['(Onsite)', '(现场)'],
    ['(Remote)', '(远程)'],
    // 额外内容 - 杂项
    ["Miscellaneous","杂项"],
    ['Tournament Announcement', '锦标赛官宣'],
    ['Date Announcement', '日期官宣'],
    ['Team Announcement', '参赛队伍官宣'],
    ['Interview', '采访'],
    ['Preview', '前瞻'],
    ['Conclusion', '结论'],
    ['Spotlight', '聚焦'],
    ['Other', '其他'],
    // - 观看数据
    ["Viewership Stats","观看数据"],
    ['Peak Viewers', '顶峰观众数量'],
    ['Average Viewers', '平均观众数量'],
    ['Hours Watched', '总计观看小时'],
    ['Viewership stats for this page does not include the Chinese platforms.', '此页面的观众统计数据未有包括中国的平台。'],

    /** 国家或地区 */
    ['Russia', '俄罗斯'],
    ['Brazil', '巴西'],
    ['Sweden', '瑞典'],
    ['Ukraine', '乌克兰'],
    ['United States', '美国'],
    ['Belarus', '白俄罗斯'],
    ['Bulgaria', '保加利亚'],
    ['Czechia', '捷克'],
    ['Denmark', '丹麦'],
    ['Netherlands', '荷兰'],
    ['Peru', '秘鲁'],
    ['Poland', '波兰'],
    ['Belgium', '比利时'],
    ['Bolivia', '玻利维亚'],
    ['Canada', '加拿大'],
    ['Estonia', '爱沙尼亚'],
    ['Finland', '芬兰'],
    ['France', '法国'],
    ['Germany', '德国'],
    ['Israel', '以色列'],
    ['Jordan', '约旦'],
    ['Moldova', '摩尔多瓦'],
    ['Singapore', '新加坡'],
    ['Slovakia', '斯洛伐克'],
    ['United Kingdom', '英国'],
    ['Nicaragua', '尼加拉瓜'],
    ['South Africa', '南非'],
    ['Vietnam', '越南'],
    ['Lebanon', '黎巴嫩'],
    ['Austria', '奥地利'],
    ['Australia', '澳大利亚'],
    ['Laos', '老挝'],
    ['North Macedonia', '北马其顿'],
    ['Norway', '挪威'],
    ['South Korea', '韩国'],
    ['Pakistan', '巴基斯坦'],
    ['Bosnia and Herzegovina', '波斯尼亚和黑塞哥维那'],
    ['Romania', '罗马尼亚'],
    ['Macau', '澳门'],
    ['Non-representing', '中立'],
    ['Greece', '希腊'],
    ['Serbia', '塞尔维亚'],
    ['Mexico', '墨西哥'],
    ['Croatia', '克罗地亚'],
    ['Iran', '伊朗'],
    ['Turkey', '土耳其'],
    ['Malaysia', '马来西亚'],
    ['Kazakhstan', '哈萨克斯坦'],
    ['Nepal', '尼泊尔'],
    ['India', '印度'],
    ['Kyrgyzstan', '吉尔吉斯斯坦'],
    ['Philippines', '菲律宾'],
    ['Indonesia', '印度尼西亚'],
    ['Hong Kong', '中国香港'],
    ['Thailand', '泰国'],
    ['Mongolia', '蒙古'],
    ['Myanmar', '缅甸'],
    ['Uzbekistan', '乌兹别克斯坦'],

    /** 城市 */
    ['Kuala Lumpur', '吉隆坡'],
    ['Birmingham', '伯明翰'],
    ['Riyadh', '利雅得'],
    ['Wallachia', '瓦拉几亚'],

    /** 显著性准则面板 */
    ["Notability Guidelines","显著性准则"],
    ["Why do we have these guidelines?","我们为何设立这些准则?"],
    ["This tournament does not currently meet our","此赛事目前未遵循我们的"],
    [", particularly regarding transparency and competitive integrity.",", 尤其在透明度与竞技诚信方面。"],
    [', regarding transparency and/or competitive integrity.', ', 关于透明度与/或竞技诚信。'],
    ["The following issues are still outstanding:","下述问题仍未解决:"],
    ['No up-to-date rulebook has been published. Rules setting out how the event will be run in its entirety must be publicly available, including stipulations for tiebreakers; these rules should not be changed without explanation while the event is ongoing.', '尚未公布最新的规则手册。整个锦标赛的运行规则, 包括加赛的规定都应当公开可见；在赛事进行期间, 这些规则不应在没有解释说明的情况下被无故更改。'],
    ['No up-to-date rulebook has been published, including stipulations for tiebreakers; these rules should not be changed without explanation while the event is ongoing.', '尚未公布最新的规则手册，包括加赛的规则；在赛事进行期间, 这些规则不应在没有解释说明的情况下被无故更改。'],
    ['The list of team names and IDs is incomplete.', '参赛队伍的名称和ID不完整。'],
    ['The list of teams is incomplete.', '参赛队伍的名单不完整。'],
    ['Player details are incomplete. Nicknames, player IDs, real names and nationalities of all players must be provided. This includes stand-ins.', '选手的详细信息不完整。主办方应当提供所有选手的昵称、选手ID、真实姓名和国籍, 包括替补选手在内。'],
    ['Player details are incomplete. Nicknames, player IDs, real names and nationalities of all players must be provided (including stand-ins).', '选手的详细信息不完整。主办方应当提供所有选手的昵称、选手ID、真实姓名和国籍 (包括替补选手)。'],
    ['No public schedule is available.', '尚未公开赛程安排。'],

    /** 其他面板 */
    ['This tournament page is', '此锦标赛页面'],
    ['under construction', '正在建设中'],
    ['and is subject to major revisions.', '，随时可能进行重大修订。'],

    /** 队伍详情页 */
    ["Timeline","时间轴"],
    ["Player Roster","队伍阵容"],
    ["Active","活跃"],
    ["Organization","组织"],
    ["Achievements","成就"],
    ["Recent Matches","过往比赛"],
    ["Team Information","队伍信息"],
    ["Region:","赛区"],
    ["Coach:","教练"],
    ["Created:","成立"],
    ["History","历史"],
    ["Active Squad","现役阵容"],
    ["Name","姓名"],
    ["Age", "年龄"],
    ["Position","位置"],
    ["Join Date","加入日期"],
    ['Staff','工作人员'],
    ['Main Roster','主要阵容'],

    /** 特殊术语 */
    ["TBD", "待定"],
    ["TBA", "待宣"],
    ["All", "全部"],
    ["Qualifier", "预选赛"],
    ["Showmatch", "表演赛"],
    ["Qual.", "预选"],
    ["Showm.", "表演"],
    ['Monthly', '月度'],
    ['Weekly', '周度'],
    ['Misc', '杂项'],
    ["Tier 1", "1 级"],
    ["Tier 2", "2 级"],
    ["Tier 3", "3 级"],
    ["Tier 4", "4 级"],
    ["Tier 5", "5 级"],
    ["Tier 1", "1 级"],
    ["Tier 2", "2 级"],
    ["Tier 3", "3 级"],
    ["Tier 4", "4 级"],
    ["Tier 5", "5 级"],
    ["Qual", "预选"],
    ["Qualifiers", "预选赛"],
    ["Season 1", "第1赛季"],
    ["Season 2", "第2赛季"],
    ["Season 3", "第3赛季"],
    ["Season 4", "第4赛季"],
    ["Season 5", "第5赛季"],
    ["WEU","西欧"],
    ["EEU","东欧"],
    ["CN","中国"],
    ["SEA","东南亚"],
    ["NA","北美"],
    ["SA","南美"],
    ["Europe/CIS","西欧/东欧"],
    ["Primary", "主要"],
    ["Secondary", "次要"],
    ["Tertiary", "第三"],
    ["Quaternary", "第四"],
    ["Quinary", "第五"],
    ['click here', '点击此处'],
    // 特殊术语 - 系列赛
    ["ESL Pro Tour", "ESL职业联赛(EPT)"],
    ["EPT Leaderboard", "EPT积分榜"],
    ["EPT Schedule", "EPT赛程表"],
    ["ESL Pro Tour: Leaderboard", "ESL职业联赛(EPT): 积分榜"],
    ["LIVE!", "直播中!"],
    ["Dota Major Championships","Dota 甲级联赛(Major)"],
    ["Dota Pro Circuit 2021-22 Rankings","2021-22赛季DPC积分榜"],
    ["Regional League","地区联赛"],
    ["Regional Finals","地区季后赛"],
    ["Roster moves during off-season","休赛期间的人员变动"],
    ['Roster moves since previous EPT event', '自上次EPT赛事起的战队人员调整'],


    ["Broadcast Talent","解说表"],
    ["DPC Points","DPC积分"],
    ["Results","结果"],
    ["Overview","总览"],
    ["Standings","积分榜"],
    ["Current ", "当前"],
    ["All-Star Match","全明星赛"],
    ["Statistics","统计数据"],
    ["Open Qualifiers","公开预选赛"],
    ["Open Qualifier","公开预选赛"],
    ["Closed Qualifier","封闭预选赛"],
    ["Regional Qualifiers","地区预选赛"],
    ["Main Event","主赛事"],
    ["Language","语言"],
    ["CONTENTS","目录"],
    ["Contents","目录"],
    ["Show All","展示全部"],
    ["Player","选手"],
    ["Players","选手"],
    ["Tournaments","锦标赛"],
    ["Transfers","转会"],
    ["Patches","版本"],
    ["Rankings","排名"],
    ["Schedule","赛程"],
    ["Stats","数据"],
    ["References","参考"],
    ["Regional Leagues","地区联赛"],
    ["Upcoming Matches","接下来的比赛"],
    ["No Scheduled Matches","暂无比赛日程"],
    ["Open Qualifier 1", "第1轮公开预选赛"],
    ["Open Qualifier 2", "第2轮公开预选赛"],
    ["Open Qualifier 3", "第3轮公开预选赛"],
    ["Open Qualifier #1", "第1轮公开预选赛"],
    ["Open Qualifier #2", "第2轮公开预选赛"],
    ["Open Qualifier #3", "第3轮公开预选赛"],
    ["Champion:","冠军:"],
    ["Main Tournament","主赛事"],
    ["Solo Tournament","单挑赛"],
    ["Matches","比赛"],
    ["Show all","显示全部"],
    ["Hide all","隐藏全部"],
    ["show","显示"],
    ["hide","隐藏"],
    ["edit","编辑"],
    ["Picks","选用"],
    ["Radiant Side","天辉方"],
    ["Dire Side","夜魇方"],
    ["Bans","禁用"],
    ["Picks & Bans","选用&禁用"],
    ["See also","扩展阅读"],
    ["Articles","报道"],
    ["Hero","英雄"],
    ["Details","详细"],
    ["Click here for complete statistics table","点此查看完整统计表"],
    ['Click on the "Show" link on the right to see the full list', '点击右侧的“显示”以查看完整列表'],
    ["Results","结果"],
])

const alertbak = window.alert.bind(window)
window.alert = (message) => {
  if (i18n.has(message)) message = i18n.get(message)
  return alertbak(message)
}
const confirmbak = window.confirm.bind(window)
window.confirm = (message) => {
  if (i18n.has(message)) message = i18n.get(message)
  return confirmbak(message)
}
const promptbak = window.prompt.bind(window)
window.prompt = (message, _default) => {
  if (i18n.has(message)) message = i18n.get(message)
  return promptbak(message, _default)
}

replaceText(document.body)

const bodyObserver = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    mutation.addedNodes.forEach(addedNode => replaceText(addedNode))
  })
})
bodyObserver.observe(document.body, { childList: true, subtree: true })

function cleanStr(str) {
    if (!str) return str
    let trimmedStr = str.replace(/^\s+|\s+$/gm,'');
    return trimmedStr;
}
function getReplace(ori, key, value) {
    return ori?.replace(key, cleanStr(value))
}
function replaceText(node) {
    nodeForEach(node).forEach(textNode => {
        const nodeValue = cleanStr(textNode.nodeValue)
        const innerText = cleanStr(textNode.innerText)
        const tNodeValue = cleanStr(textNode.value)
        const placeHolder = cleanStr(textNode.placeholder)
        // console.log({nodeValue,innerText,tNodeValue,placeHolder})
        if (textNode instanceof Text) {
            if (i18n.has(nodeValue)) {
                textNode.nodeValue = getReplace(textNode.nodeValue, nodeValue, i18n.get(nodeValue))
            } else {
                i18nRegex.forEach(reg => {
                    if (textNode.nodeValue.match(reg[0])) {
                        textNode.nodeValue = textNode.nodeValue.replace(reg[0], reg[1])
                        return // 只匹配最先匹配到的正则
                    }
                })
            }
        } else if (i18n.has(innerText)) {
            textNode.innerText = getReplace(textNode.innerText, innerText, i18n.get(innerText))
        } else if (textNode instanceof HTMLInputElement) {
            if (textNode.type === 'button' && i18n.has(tNodeValue)) {
                textNode.value = getReplace(textNode.value, tNodeValue, i18n.get(tNodeValue))
            } else if ('text;password;search'.indexOf(textNode.type) >= 0 && i18n.has(placeHolder)) {
                textNode.placeholder = getReplace(textNode.placeholder, placeHolder, i18n.get(placeHolder))
            } else {
                //console.log('invalid HTMLInputElement textNode:', textNode)
            }
        }
        else {
            //console.log('invalid textNode:', textNode)
        }
    })
}

function nodeForEach(node) {
  const list = []
  if (node.childNodes.length === 0) list.push(node)
  else {
    node.childNodes.forEach(child => {
      if (child.childNodes.length === 0) list.push(child)
      else list.push(...nodeForEach(child))
    })
  }
  return list
}