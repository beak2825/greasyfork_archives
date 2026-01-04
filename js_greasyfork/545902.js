/*******************************************************************************

    locals.js - 搭配用户脚本插件`jinteki 中文化插件`的页面匹配规则, 翻译忽略规则,
                词条库文件

    Copyright (C) klingeling

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.

*/
var I18N = {};

I18N.conf = {

    /**
     * 匹配 pathname 页面的正则
     *
     * ...
     */
    rePagePath: /^\/($|chat|cards|deckbuilder|play|help|account|stats|about)/,


    // 特定页面，忽略元素规则
    ignoreSelectorPage: {
        'play': [
            'div.username', // 用户昵称
            'span.runner-username', // 同上
            'span.corp-username', // 同上
            'div.name-area', // 同上
            'div.content', // 用户聊天
            'div.gameline h4', // 对战页面标题
            'div.game-time', // 时间
            'span.fake-link', // 卡牌名称
            'span.cardname', // 卡牌名称
        ],
        'cards': [
            'div.card-info'
        ],
        'chat': [
            'span.title',
            'div.content'
        ],
        '*': [
            'pre',
            'span.user-status', // 用户名
            'li.dropdown.usermenu',
            'div#left-menu',
            'div.card-info',
            'div#status',
            'CODE', 'SCRIPT', 'STYLE', 'LINK', 'IMG', 'MARKED-TEXT', 'PRE', 'KBD', 'SVG', 'MARK' // 特定元素标签
        ],
    },
};

I18N["zh-CN"] = {};

I18N["zh-CN"]["title"] = { // 标题翻译
    "static": { // 静态翻译
        "": "",
    },
    "regexp": [ // 正则翻译
        [/Authorized OAuth Apps/, "授权的 OAuth 应用"],
        ["_regexp_end", "end"]
    ],
};

I18N["zh-CN"]["public"] = { // 公共区域翻译
    "static": { // 静态翻译
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
         * 增加 带介词 on 的格式，on 翻译不体现
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
         * 星期(全称), 日 月 年// 仓库-->洞察-->贡献者 和 仓库-->洞察-->代码频率
         * Sunday, 4 Jul 2023
         *
         * 更新于 2023-07-04 13:19:21
         * 新增前缀词, 减少二次组织翻译
         *  Updated Jul 4            // 仪表板页面 仓库标签卡
         *  Commits on Jul 4, 2023   // 提交页面、仓库拉取请求页->提交卡
         *  Joined on Jul 4, 2023    // 追星者，关注者页面
         *
         * 更新于 2023-11-11 16:48:02
         * 个人资料页->贡献卡
         * 日期带后缀
         * on March 19th.
         * on August 22nd.
         * on August 21st.
         *
         * Tip:
         * 正则中的 ?? 前面的字符 重复0次或1次
         * 正则中的 ?: 非捕获符号(即关闭圆括号的捕获能力) 使用方法 (?: 匹配规则) -->该匹配不会被捕获 为 $数字
         */
        [/(^Updated (?:on )?|^Commits on |^Joined on |on )?(?:(Sun(?:day)?|Mon(?:day)?|Tue(?:sday)?|Wed(?:nesday)?|Thu(?:rsday)?|Fri(?:day)?|Sat(?:urday)?)?,? )?(?:(\d{1,2})(?:st.|nd.|rd.|th.)?)? ?(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?) ?(\d{1,2})?,? (\d{4})?/g, function (all, prefix, week, date1, month, date2, year) {
            var prefixKey = {
                "Updated ": "更新于 ",
                "Commits on ": "提交于 ",
                "Joined on ": "加入于 ",
                //"Submitted ": "提交于 ", // 教育
            };
            var weekKey = {
                "Sun": "周日",
                "Mon": "周一",
                "Tue": "周二",
                "Wed": "周三",
                "Thu": "周四",
                "Fri": "周五",
                "Sat": "周六"
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

            // 处理日期
            var date = date1 ? date1 : date2;
            var formattedDate = (year ? year + '年' : '') + monthKey[month.substring(0, 3)] + (date ? date + '日' : '');

            // 处理星期
            var formattedWeek = week ? '，' + weekKey[week.substring(0, 3)] : '';

            // 返回翻译结果
            return (prefixKey[prefix] ? prefixKey[prefix] : '') + formattedDate + formattedWeek;
        }],
        /**
         * 相对时间格式处理
         *
         * 更新于 2021-11-21 16:47:14
         * 1. 添加 前缀词
         *    over xxx ago // 里程碑页面 最后更新时间
         *    about xxx ago // 里程碑页面 最后更新时间
         *    almost xxx ago // 里程碑页面 最后更新时间
         *    less than xxx ago // 导出账户数据
         * 2. xxx之内的相对时间格式
         *  in 6 minutes // 拉取请求页面
         *
         * 更新于 2021-11-22 11:54:30
         * 1. 修复 Bug: 意外的扩大了匹配范围(不带前缀与后缀的时间) 干扰了带有相对时间的其他规则
         *  7 months
         */
        [/^just now|^now|^last month|^yesterday|(?:(over|about|almost|in) |)(an?|\d+)(?: |)(second|minute|hour|day|month|year)s?( ago|)/, function (all, prefix, count, unit, suffix) {
            if (all === 'now') {
                return '现在';
            }
            if (all === 'just now') {
                return '刚刚';
            }
            if (all === 'last month') {
                return '上个月';
            }
            if (all === 'yesterday') {
                return '昨天';
            }
            if (count[0] === 'a') {
                count = '1';
            } // a, an 修改为 1

            var unitKey = { second: '秒', minute: '分钟', hour: '小时', day: '天', month: '个月', year: '年' };

            if (suffix) {
                return (prefix === 'about' || prefix === 'almost' ? '大约 ' : prefix === 'less than' ? '不到 ' : '') + count + ' ' + unitKey[unit] + (prefix === 'over' ? '多之前' : '之前');
            } else {
                return count + ' ' + unitKey[unit] + (prefix === 'in' ? '之内' : '之前');
            }
        }],
        /**
         * 匹配时间格式 2
         *
         * in 5m 20s
         */
        [/^(?:(in) |)(?:(\d+)m |)(\d+)s/, function (all, prefix, minute, second) {
            all = minute ? minute + '分' + second + '秒' : second + '秒';
            return (prefix ? all + '之内' : all);
        }],

        // 其他翻译
        // Anarch - 阿巴契 "反叛者 - $1"
        [/^(Anarch|Criminal|Shaper|Adam|Apex|Sunny Lebeau|Jinteki|Haas\-Bioroid|NBN|Weyland Consortium|Neutral) \- .+$/, function (all) {
            all = all.replace(/Anarch/, "反叛者")
                .replace(/Criminal/, "逆法者")
                .replace(/Shaper/, "塑造者")
                .replace(/Adam/, "亚当")
                .replace(/Apex/, "尖峰")
                .replace(/Sunny Lebeau/, "桑妮·勒博")
                .replace(/Jinteki/, "人间会社")
                .replace(/Haas\-Bioroid/, "哈斯生化")
                .replace(/NBN/, "网际传媒")
                .replace(/Weyland Consortium/, "威兰财团")
                .replace(/Neutral/, "中立");
            return all;
        }],
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
         * 增加 带介词 on 的格式，on 翻译不体现
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
        [/(?:on |)(?:(\d{1,2}) |)(?:(Sun(?:day)?|Mon(?:day)?|Tue(?:sday)?|Wed(?:nesday)?|Thu(?:rsday)?|Fri(?:day)?|Sat(?:urday)?), |)(?:(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May(?:)??|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)(?:,? |$))(\d{4}|)(\d{1,2}|)(?:,? (\d{4})|)/g, function (all, date1, week, month, year1, date2, year2) {
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
         *    less than xxx ago // 导出账户数据
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
        [/(\d+)(y|h|d|w|m)/, function (all, count, suffix) {
            var suffixKey = { y: '年', h: '小时', d: '天', w: '周', m: '个月' };

            return count + ' ' + suffixKey[suffix] + '之前';
        }],
    ],
};

I18N["zh-CN"]["homepage"] = { // 聊天部分
    "static": { // 静态翻译
    },
    "regexp": [ // 正则翻译
    ],
};

I18N["zh-CN"]["chat"] = { // 聊天部分
    "static": { // 静态翻译
    },
    "regexp": [ // 正则翻译
    ],
};

I18N["zh-CN"]["cards"] = { // 卡牌部分
    "static": { // 静态翻译
        "Deck points: 1": "牌组点数: 1",
        "Deck points: 2": "牌组点数: 2",
        "Deck points: 3": "牌组点数: 3",
        "Deck points: 4": "牌组点数: 4",
        "Deck points: 5": "牌组点数: 5",
        "Deck points: 6": "牌组点数: 6",
        "Deck points: 7": "牌组点数: 7",
        "Rotated": "轮替",
        "Restricted": "受限",
        "Removed": "移除",
        "Throwback": "复古",
    },
    "regexp": [ // 正则翻译
    ],
};

I18N["zh-CN"]["deckbuilder"] = { // 牌组构筑部分
    "static": { // 静态翻译
        "Deck points: 1": "牌组点数: 1",
        "Deck points: 2": "牌组点数: 2",
        "Deck points: 3": "牌组点数: 3",
        "Deck points: 4": "牌组点数: 4",
        "Deck points: 5": "牌组点数: 5",
        "Deck points: 6": "牌组点数: 6",
        "Deck points: 7": "牌组点数: 7",
        "Rotated": "轮替",
        "Restricted": "受限",
        "Removed": "移除",
        "Throwback": "复古",
    },
    "regexp": [ // 正则翻译
    ],
};

I18N["zh-CN"]["play"] = { // 对战部分
    "static": { // 静态翻译
        ", and": ", 和",
        ".": "。",
        "(new remote)": "（新远程服务器）",
        "accesses an unseen card from R&D.": "从研发中心读取一张未知卡牌。",
        "accesses everything else in Archives.": "读取档案库中的其他所有内容。",
        "accesses": "读取",
        "AI - Icebreaker - Virus": "智能模块 - 破解器 - 病毒",
        "and gains 1 agenda point.": "并获得1议案分数。",
        "and pays 0": "并支付0",
        "and": "和",
        "Annotating": "注释",
        "AP - Barrier": "屏障 - 杀伤",
        "approaches Archives.": "接驳档案库。",
        "approaches HQ.": "接驳总部。",
        "approaches R&D.": "接驳研发中心。",
        "approaches": "接驳",
        "breaches Archives.": "侵入档案库。",
        "breaches HQ.": "侵入总部。",
        "breaches R&D.": "侵入研发中心。",
        "Choose 1 card to trash": "选择1张卡牌以销毁",
        "Choose a card in HQ to trash": "选择销毁总部的一张卡牌",
        "Companion - Virtual": "同伴 - 虚拟",
        "Connection": "人脉",
        "Deck points: 1": "牌组点数: 1",
        "Deck points: 2": "牌组点数: 2",
        "Deck points: 3": "牌组点数: 3",
        "Deck points: 4": "牌组点数: 4",
        "Deck points: 5": "牌组点数: 5",
        "Deck points: 6": "牌组点数: 6",
        "Deck points: 7": "牌组点数: 7",
        "Discard down to 5 cards": "弃除至5张卡牌",
        "discards 1 card from HQ at end of turn.": "从总部弃除1张卡牌在回合结束时。",
        "discards": "弃除",
        "division": "部门",
        "Do 1 net damage": "造成1点网域伤害",
        "Do 2 net damage": "造成2点网域伤害",
        "Do 1 core damage": "造成1点核心伤害",
        "Do 2 core damage": "造成2点核心伤害",
        "Do 2 net damage": "造成2点网域伤害",
        "due to net damage.": "由于网域伤害。",
        "encounters": "遭遇",
        "End the run": "终止本次潜袭",
        "from HQ.": "从总部。",
        "from their Grip at end of turn.": "从其操控器在回合结束时。",
        "from": "从",
        "G-mod": "转基因人",
        "Game Log": "游戏日志",
        "has created the game.": "创建对战。",
        "has left the game.": "离开对战。",
        "has no further action.": "无更多响应。",
        "her": "她的",
        "his": "他的",
        "indicates to fire all unbroken subroutines on": "示意启动所有未破解的子进程在",
        "is flatlined.": "宣告死亡。",
        "is trashed.": "被销毁。",
        "its": "它的",
        "joined the game as a spectator.": "作为观众加入对战。",
        "joined the game.": "加入对战。",
        "Keep hand?": "保留手牌？",
        "Keep": "保留",
        "keeps her hand.": "保留她的手牌。",
        "keeps his hand.": "保留他的手牌。",
        "keeps its hand.": "保留它的手牌。",
        "keeps their hand.": "保留其手牌。",
        "looks at her deck.": "查看其牌组。",
        "looks at his deck.": "查看其牌组。",
        "looks at its deck.": "查看其牌组。",
        "looks at their deck.": "查看其牌组。",
        "makes her mandatory start of turn draw.": "执行她的回合开始时强制抽牌。",
        "makes his mandatory start of turn draw.": "执行他的回合开始时强制抽牌。",
        "makes its mandatory start of turn draw.": "执行它的回合开始时强制抽牌。",
        "makes their mandatory start of turn draw.": "执行其回合开始时强制抽牌。",
        "Mulligan": "调度",
        "No action": "无响应",
        "passes": "通过",
        "Pause please, opponent is acting": "请暂停，对手正在响应",
        "Please pause, Corp is acting.": "请暂停，公司正在响应。",
        "Please pause, Runner is acting.": "请暂停，潜袭者正在响应。",
        "protecting R&D at position 0 +1 strength and \"End the run unless the Runner trashes 1 of their installed cards\" after its other subroutines.": "位置 0 的保护研发中心，强度+1并在其它子进程后获得“终止本次潜袭，除非潜袭者销毁1张其已安装的卡牌。”",
        "Rearrange the top 5 cards of R&D": "",
        "rejoined the game.": "重新加入对战。",
        "Removed": "移除",
        "resolves 1 unbroken subroutine on": "结算1条未破解的子进程在",
        "Restricted": "受限",
        "Rotated": "轮替",
        "Run Timing": "潜袭时序",
        "Server": "服务器",
        "Settings": "游戏设置",
        "Shared Annotations": "共享注释",
        "shuffles her deck.": "混洗其牌组。",
        "shuffles his deck.": "混洗其牌组。",
        "shuffles its deck.": "混洗其牌组。",
        "shuffles their deck.": "混洗其牌组。",
        "spends": "花费",
        "Steal": "窃取",
        "steals": "窃取",
        "stops looking at her deck.": "停止查看其牌组。",
        "stops looking at his deck.": "停止查看其牌组。",
        "stops looking at its deck.": "停止查看其牌组。",
        "stops looking at their deck.": "停止查看其牌组。",
        "takes a mulligan.": "进行一次调度。",
        "their": "其",
        "to access 1 additional card.": "以读取1张额外的卡牌。",
        "to add 1": "以增加 1",
        "to derez": "以关闭",
        "to do 1 net damage.": "以造成1点网域伤害。",
        "to do 2 net damage.": "以造成2点网域伤害。",
        "to end the run.": "以终止本次潜袭。",
        "to gain": "以获得",
        "to give": "给予",
        "to install a card in the root of HQ.": "以安装一张卡牌到总部的根目录。",
        "to install a card in the root of R&D.": "以安装一张卡牌到研发中心的根目录。",
        "to install ice protecting Archives.": "以安装防火墙保护档案库。",
        "to install ice protecting HQ.": "以安装防火墙保护总部。",
        "to install ice protecting R&D.": "以安装防火墙保护研发中心。",
        "to install": "以安装",
        "to itself.": "至其自身。",
        "to make a run on Archives.": "对档案库进行一次潜袭。",
        "to make a run on HQ.": "对总部进行一次潜袭。",
        "to make a run on R&D.": "对研发中心进行一次潜袭。",
        "to place 1 power counter on itself.": "以放置1枚能量指示物到其自身。",
        "to play": "以打出",
        "to rearrange the top 5 cards of R&D.": "以重新排列研发中心顶部5张卡牌。",
        "to rez": "以激活",
        "to use Corp Basic Action Card to draw 1 card.": "以使用公司基础行动抽1张卡牌。",
        "to use Corp Basic Action Card to purge all virus counters.": "以使用公司基础行动清除所有病毒指示物。",
        "to use Runner Basic Action Card to draw 1 card.": "以使用潜袭者基础行动抽1张卡牌。",
        "to use Runner Basic Action Card to remove 1 tag.": "以使用潜袭者基础行动移除1枚锁定标记。",
        "to use": "以使用",
        "Trash 1 card from HQ to end the run": "从总部销毁1张卡牌，以终止本次潜袭",
        "Trash a card from HQ to do 2 net damage?": "从总部销毁1张卡牌，以造成2点网域伤害？",
        "trashes 1 card from HQ to use": "从总部销毁1张卡牌以使用",
        "trashes due to net damage.": "销毁由于网域伤害。",
        "trashes": "销毁",
        "Turn Timing": "回合时序",
        "uses": "使用",
        "Waiting for Corp to keep hand or mulligan": "等待公司保留或调度手牌",
        "Waiting for Corp to make a decision": "等待公司做出决定",
        "Waiting for Runner to keep hand or mulligan": "等待潜袭者保留或调度手牌",
        "Waiting for Runner to make a decision": "等待潜袭者做出决定",
        "will continue the run.": "将继续本次潜袭。",
        "wins the game.": "赢得对战。",
        "You accessed": "你读取了",
        "to break 1 subroutine on": "以破解1条子进程在",
        "loses": "花费",
        "Do 2 net damage if the runner has 2 tags": "如果潜袭者具有至少2枚锁定标记，造成2点网域伤害",
        "Give the Runner 1 tag": "给予潜袭者1枚锁定标记",
        "to trash": "以销毁",
        "from the top of the stack.": "从存储栈顶端。",
        "from the Heap (paying 3": "从堆阵 (支付 3",
        "less).": "少)。",
        "and draw 1 card.": "并抽1张卡牌。",
        "scores": "计分",
        "to look at the top 3 cards of R&D.": "以查看研发中心顶端的3张卡牌。",
        "declines to use": "拒绝使用",
        "derezzes": "关闭",
        "Natural": "原生人",
        "The top of R&D is (top->bottom):": "研发中心顶端是 (顶端->底端):",
        ". Choose a card to trash": "。选择一张卡牌以销毁",
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
    },
    "regexp": [ // 正则翻译
        [/^(.+) has created the game\.$/, "$1 创建了游戏。"],
        [/^(.+) joined the game\.$/, "$1 加入了游戏。"],
        [/^(.+) joined the game as a spectator\.$/, "$1 作为观众加入了游戏。"],
        [/^in Server (\d+)\.$/, "在服务器 $1 中。"],
        [/^Server (\d+)$/, "服务器 $1"],
        // "and pays 0": "并支付 0",
        [/^and pays (\d+)$/, "并支付$1"],
        // "pays 0": "支付 0",
        [/^pays (\d+)$/, "支付 $1"],
        // to gain 9
        [/^to gain (\d+)$/, "获得$1"],
        // started their turn 1 with 5
        [/^(is ending|started) (their|her|his|its) turn (\d+) with (\d+)$/, function (all, pre, pronoun, turn, credit) {
            if (pre == "started") pre = "开始";
            if (pre == "is ending") pre = "结束";
            return pre + "其第" + turn + "回合，拥有" + credit;
        }],
        [/^and (\d+) cards? in HQ\.$/, "和总部$1张卡牌。"],
        [/^and (\d+) cards? in (their|her|his|its) Grip\.$/, "和操控器$1张卡牌。"],
        // "to install a card in the root of Server 1 (new remote).": "安装一张卡牌到服务器 1 的根目录（新远程服务器）。",
        [/^to install a card in the root of Server (\d+)(?: \((new remote)\))?\.$/, function (all, Server, newremote) {
            newremote = newremote ? "（新远程服务器）" : "";
            return "安装一张卡牌到服务器 " + Server + " 的根目录" + newremote + "。";
        }],
        // 'to install ice protecting Server 1 (new remote).'
        [/^to install ice protecting Server (\d+) \(new remote\)\.$/, "安装防火墙保护服务器 $1（新远程服务器）。"],
        // "to install ice protecting Server 1.": "",
        [/^to install ice protecting Server (\d+)\.$/, "安装防火墙保护服务器 $1。"],
        // to draw 3 cards.
        [/^to draw (\d+) cards?\.$/, "抽$1张卡牌。"],
        // sets click to 1 (-1).
        [/^sets click to (\d+) (\(\-\d+\))\.$/, "设置时点至 $1 $2。"],
        [/^sets click to (\d+) (\(\+\d+\))\.$/, "设置时点至 $1 $2。"],
        [/^sets credit to (\d+) (\(\-\d+\))\.$/, "设置信用点数至 $1 $2。"],
        [/^sets credit to (\d+) (\(\+\d+\))\.$/, "设置信用点数至 $1 $2。"],
        // "to use Corp Basic Action Card to gain 1": "使用公司基础行动获得 1",
        [/^to use Corp Basic Action Card to gain (\d+)$/, "使用公司基础行动获得 $1"],
        [/^to use Runner Basic Action Card to gain (\d+)$/, "使用潜袭者基础行动获得 $1"],
        // "approaches ice protecting Archives at position 0.": "接驳位于位置 0 的保护档案库的防火墙。",
        [/^approaches ice protecting Archives at position (\d+)\.$/, "接驳位置 $1 的保护档案库的防火墙。"],
        [/^approaches ice protecting HQ at position (\d+)\.$/, "接驳位置 $1 的保护总部的防火墙。"],
        [/^approaches ice protecting R&D at position (\d+)\.$/, "接驳位置 $1 的保护研发中心的防火墙。"],
        [/^approaches ice protecting Server (\d+) at position (\d+)\.$/, "接驳位置 $2 的保护服务器 $1 的防火墙。"],
        [/^approaches Server (\d+)\.$/, "接驳服务器 $1。"],
        [/^breaches Server (\d+)\.$/, "侵入服务器 $1。"],
        [/^from Server (\d+)\.$/, "从服务器 $1。"],
        // protecting Archives at position 0.
        [/^protecting Archives at position (\d+)\.$/, "保护档案库位于位置 $1。"],
        [/^protecting HQ at position (\d+)\.$/, "保护总部位于位置 $1。"],
        [/^protecting R&D at position (\d+)\.$/, "保护研发中心位于位置 $1。"],
        //  protecting Server 2 at position 0.
        [/^protecting Server (\d+) at position (\d+)\.$/, "保护服务器 $1 位于位置 $2。"],
        // to draw 1 card.
        [/^to draw (\d+) cards?\.$/, "抽$1张卡牌。"],
        // discards 1 card from HQ at end of turn.
        [/^discards (\d+) cards? from HQ at end of turn\.$/, "从总部弃除$1张卡牌在回合结束时。"],
        // "and gains 1 agenda point.": "并获得1议案分数。",
        [/^and gains (\d+) agenda points?\.$/, "并获得$1议案分数。"],
        // and spends 1 hosted power counter from on
        [/^and spends (\d+) hosted power counters? from on$/, "并花费$1个所附载的能量指示物来自位于"],
        // spends 1 hosted power counter from on
        [/^spends (\d+) hosted power counters? from on$/, "花费$1个所附载的能量指示物来自位于"],
        // uses a command: /undo-turn
        [/^uses a command: (.+)$/, "使用一个指令: $1"],
        // "Trash ice protecting Server 2 (minimum 1)"
        [/^Trash ice protecting Server (\d+) \(minimum (\d+)\)$/, "销毁保护服务器 $1 的防火墙 (最少 $2)"],
        // "to make a run on Archives.": "对档案库进行一次潜袭。",to make a run on Server 2.
        [/^to make a run on Server (\d+)\.$/, "对服务器 $1 进行一次潜袭。"],
        // "resolves 1 unbroken subroutine on": "结算1条未破解的子进程在",
        [/^resolves (\d+) unbroken subroutines? on$/, "结算$1条未破解的子进程在"],
        // "identifies his mark to be HQ.": "",
        [/^identifies (their|her|his|its) mark to be HQ\.$/, "发现其目标为总部。"],
        [/^identifies (their|her|his|its) mark to be R&D\.$/, "发现其目标为研发中心。"],
        [/^identifies (their|her|his|its) mark to be Archives\.$/, "发现其目标为档案库。"],
        [/^to target ice protecting Server (\d+) at position (\d+)\.$/, "以选择位置 $2 保护服务器 $1 的防火墙。"],
        // passes ice protecting Server 1 at position 0.
        [/^passes ice protecting Server (\d+) at position (\d+)\.$/, "通过位置 $2 的保护服务器 $1 的防火墙。"],
        [/^passes ice protecting R&D at position (\d+)\.$/, "通过位置 $2 的保护研发中心的防火墙。"],
        [/^passes ice protecting HQ at position (\d+)\.$/, "通过位置 $2 的保护总部的防火墙。"],
        [/^passes ice protecting Archives at position (\d+)\.$/, "通过位置 $2 的保护档案库的防火墙。"],
        // to use Corp Basic Action Card to advance a card in Server 1.
        [/^to use Corp Basic Action Card to advance a card in Server (\d+)\.$/, "以使用公司基础行动以推进一张在服务器 $1 的卡牌。"],
        // "Do 1 net damage\").": "造成1点网域伤害\")。",
        [/^(.*)\"\)\.$/, function (all, sub) {
            sub = I18N["zh-CN"]["play"]["static"][sub] ?? sub
            return sub + "\")。";
        }],
        // "Do 1 net damage\" and \"": "",
        [/^(.*)\" and \"$/, function (all, sub) {
            sub = I18N["zh-CN"]["play"]["static"][sub] ?? sub
            return sub + "\" 和 \"";
        }],
        // "to install ice from position 2 of R&D protecting HQ.": "从研发中心位置 2 安装防火墙保护总部。",
        [/^to install ice from position (\d+) of R&D protecting HQ\.$/, "从研发中心位置 $1 安装防火墙保护总部。"],
        [/^trashes (\d+) cards? \($/, "销毁$1张卡牌 ("],
        [/^Server (\d+)$/, "服务器 $1"],

    ],
};

I18N["zh-CN"]["help"] = { // 帮助部分
    "static": { // 静态翻译
    },
    "regexp": [ // 正则翻译
    ],
};

I18N["zh-CN"]["account"] = { // 设置部分
    "static": { // 静态翻译
    },
    "regexp": [ // 正则翻译
    ],
};
I18N["zh-CN"]["stats"] = { // 统计部分
    "static": { // 静态翻译
    },
    "regexp": [ // 正则翻译
    ],
};

I18N["zh-CN"]["about"] = { // 关于部分
    "static": { // 静态翻译
        "About": "关于",
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
    },
    "regexp": [ // 正则翻译
    ],
};