// ==UserScript==
// @name         HLV中文化
// @namespace    http://tampermonkey.net/
// @version      1.4.1
// @license      MIT
// @description  手动替换一些HLTV数据页容易被错误机翻的词汇
// @author       ST
// @match        https://www.hltv.org/events/*
// @match        https://www.hltv.org/matches/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526698/HLV%E4%B8%AD%E6%96%87%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/526698/HLV%E4%B8%AD%E6%96%87%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 词典
    const dictionary = {
        // 地图翻译
        'Dust2': '沙漠2',
        'Dust 2': '沙漠2',
        'Inferno': '炼狱小镇',
        'Mirage': '荒漠迷城',
        'Nuke': '核子危机',
        'Overpass': '死亡游乐园',
        'Vertigo': '殒命大厦',
        'Ancient': '远古遗迹',
        'Train': '列车停放站',
        'Cache': '仓库',
        'Anubis':'阿努比斯',

        // 大洲名称
        'Grouped events':'各地区赛事日历',
        'Location':'地区',
        'Asia': '亚洲',
        'AS': '亚洲',
        'Europe': '欧洲',
        'EU': '欧洲',
        'North America': '北美洲',
        'NA': '北美洲',
        'South America': '南美洲',
        'SA': '南美洲',
        'Oceania': '大洋洲',
        'OCE': '大洋洲',
        'Africa': '非洲',
        'AF': '非洲',
        'Pacific':'太平洋',
        'Asia-Pacific':'亚太地区',

        // 赛事相关
        'Group': '小组赛',
        'Playoffs': '季后赛',
        'Qualifier': '预选赛',
        'Grand Final': '总决赛',
        'Closed': '封闭',
        'Prize pool':'总奖金',
        'Date':'日期',
        'Teams':'战队',
        'Related events':'关联赛事',
        'Formats':"安排",
        'Group stage':'小组赛阶段',
        'the Upper bracket':'胜者组',
        'the Lower bracket':'败者组',
        'Upper bracket':'胜者组',
        'Lower bracket':'败者组',        
        'Double elimination':'双败',
        'with 1-0 map advantage for':'图一直接获胜对于',
        'places go to':'名前往',
        'semi-finals':'半决赛',
        'quarter-finals':'1/4决赛',
        'Round 1':'第一轮',
        'Round-robin':'循环赛',
        'Matches, past 3 months':'过去3个月对战数据',
        'Group Swiss':'小组循环赛',
        'Prize distribution':'奖金分配',
        'Highlights':'精彩瞬间',
        'Now playing':'最近高光',
        'Browse highlights':'浏览更多高光',
        'News':'新闻',
        'Teams attending':'参赛战队',
        'Swiss':'循环赛',
        'Single elimination':'单败',

        // 导航菜单
        'Ranking': '战队排名',
        'Matches': '赛事列表',
        'Stats': '数据统计',
        'Events': '赛事日历',
        'Results': '赛果速递',
        'Galleries': '赛事图集',
        'Overview': '概览',
        'Detailed':'详细的',
        

        // 比赛数据
        'Playoffs':'淘汰赛阶段',
        'KD diff': '击杀差',
        'Kills': '击杀数',
        'Headshot %': '爆头率',
        'ADR': '场均伤害',
        'Team': '战队',
        'Online':'线上',
        'Map pool':'地图池',
        'Map stats':'地图数据',
        'removed':"Ban掉了",
        'picked ':'选择了',
        'picked':'选择了',
        'Winner qualifies for':'胜者晋级',
        'was left over':'剩下了',
        'Analytics center':'数据分析',
        'Pick a winner':'预测胜者',
        'Scoreboard':'数据统计',
        'Game log':'比赛日志',
        'Live win probability':'实时胜率',
        'Fantasy games':'',
        'Best of':'BO',
        'Maps':'地图',
        'Watch':'观看',
        'Hide minimap':'隐藏小地图',
        'Normal':'常规',
        'Advanced':'高级',
        'Op.duels':'对位单杀',
        "2+kills":'多杀',
        '1vsX':'一打多',
        'Live win probability':'实时胜率',
        'Head to head':'历史对战结果',
        'Wins':'胜利',
        'Overtimes':'加时',
        'Side':'阵营',
        'match win streak':'场连胜',
        'World rank':'世界排名',
        'Top player in match':'单局最佳',
        'RECENT ACTIVITY':'最新消息',
        'Team stats':'战队数据',
        'TOP 30 TRANSFERS':'转会TOP30',
        '3rd Place Decider Match':'季军争夺赛',
        '3rd place decider match':'季军争夺赛',
        'Start date':'开始日期',
        'End date':'结束日期',
        'Group play':'小组赛',
        'Total prize pool':'总奖金',
        'Player share':'选手奖金',
        'Event type':'赛事类型',
        'Brackets':'赛程',
        'Event data':'赛事数据',
        'Quarter-finals':'1/4决赛',
        'Semi-finals':'半决赛',
        'Grand Final':'总决赛',
        'Tiebreaker':'决胜局',
        'Semi-final':'半决赛',
        'All maps':'所有地图',
        'Match stats':'比赛数据',
        'Both':'双边',
        'Terrorist':'T',
        'Counter-Terrorist':'CT',
        'VRS forecast':'V社排名(积分)预测',
        'VRS result ?':'V社排名(积分)大概的结果',
        'current':'当前',
        'if':'',
        'team wins':'如果赢了',
        'team loses':'如果输了',
        'Match lineup core winrate, past 3 months, min. 3 maps played':'地图胜率',
        'Core':'核心',
        'before':'之前',
        'result':'结果',
        'Match over':'比赛已结束',
        'Match not started':'比赛未开始',
        'Live':'直播',
        'round 2':'第二轮',
        'round 3':'第三轮',
        'round 1':'第一轮',
        'teams with a ':'战绩为',
        ' record':'的队伍',
        'LAN':'线下',
        'All streams':'所有直播',
        'Live win probability':'实时胜率',
        'Map over.':'本图已结束',
        'Player profile':'选手数据',
        'Highlighted stats':'数据对比',
        'Kills per round':'平均每回合击杀',
        'Deaths per round':'平均每回合死亡',
        'Impact':'影响',
        'Average damage per round':'平均每回合伤害',
        'Full comparison':'全面数据对比',
        'Past 3 months':'过去3个月',
        'elimination match':'淘汰赛',
        'Live win probability':'实时胜率',
        'round 4':'第四轮',
        'Losing':'输了的',
        'Winning':'赢了的',
        'is eliminated':'被淘汰',
        
        'TBA':'待定',
        // 战队信息
        'Roster': '战队阵容',
        'Coach': '教练',
        'Stand-in': '替补选手',
        'Lineups':'阵容',
    };

    // 高级配置
    const config = {
        skipTags: ['SCRIPT', 'STYLE', 'TEXTAREA', 'CODE', 'PRE', 'TIME'], // 跳过时间标签
        skipClasses: ['moment-timestamp'], // 跳过时间组件
        mainContainer: 'div.contentCol' // 只处理主要内容区域
    };

    function formatDates(text) {
        // 月份名称到数字映射表
        const monthToNumber = {
            'January': '1', 'February': '2', 'March': '3', 'April': '4',
            'May': '5', 'June': '6', 'July': '7', 'August': '8',
            'September': '9', 'October': '10', 'November': '11', 'December': '12',
            'Jan': '1', 'Feb': '2', 'Mar': '3', 'Apr': '4',
            'May': '5', 'Jun': '6', 'Jul': '7', 'Aug': '8',
            'Sep': '9', 'Oct': '10', 'Nov': '11', 'Dec': '12'
        };

        // 处理带序数的日期格式 (e.g. "15th of February 2025")
        text = text.replace(/(\d+)(?:st|nd|rd|th) of ([A-Za-z]+) (\d{4})/gi, (match, day, month, year) => {
            return `${year}年${monthToNumber[month] || month}月${day}日`;
        });

        // 处理完整日期格式 (e.g. "July 15, 2023")
        text = text.replace(/([A-Za-z]+) (\d{1,2}), (\d{4})/g, (match, month, day, year) => {
            return `${year}年${monthToNumber[month] || month}月${day}日`;
        });

        // 处理月份缩写 (e.g. "Jul 15")
        text = text.replace(/(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s(\d{1,2})/g, (match, month, day) => {
            return `${monthToNumber[month] || month}月${day}日`;
        });

        return text;
    }

    function replaceText(node) {
        if (node.nodeType === Node.TEXT_NODE &&
            node.textContent.trim() &&
            !config.skipClasses.some(c => node.parentElement.classList.contains(c))) {

            let text = node.textContent;
            
            // 先处理日期
            text = formatDates(text);
            
            // 原有词汇替换
            const sortedKeys = Object.keys(dictionary).sort((a, b) => b.length - a.length);
            sortedKeys.forEach(key => {
                const regex = new RegExp(`\\b${key}\\b(?![^<]*?>)`, 'gi');
                text = text.replace(regex, match => {
                    return dictionary[key].toUpperCase() === dictionary[key]
                        ? dictionary[key]
                        : match[0] === match[0].toUpperCase()
                            ? dictionary[key][0].toUpperCase() + dictionary[key].slice(1)
                            : dictionary[key];
                });
            });

            node.textContent = text;
        }
    }

    // 优化版DOM遍历
    function walkDOM(target) {
        const container = document.querySelector(config.mainContainer) || target;
        const treeWalker = document.createTreeWalker(
            container,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: node =>
                    config.skipTags.includes(node.parentNode.nodeName)
                        ? NodeFilter.FILTER_REJECT
                        : NodeFilter.FILTER_ACCEPT
            },
            false
        );

        let currentNode;
        while ((currentNode = treeWalker.nextNode())) {
            replaceText(currentNode);
        }
    }

    // 初始化执行
    walkDOM(document.body);
})();