// ==UserScript==
// @name         GM论坛勋章百宝箱
// @namespace    http://tampermonkey.net/
// @version      2.6.11
// @description  主要用于管理GM论坛的个人勋章，查看其他勋章属性请下载【勋章放大镜】
// @match        https://www.gamemale.com/wodexunzhang-showxunzhang.html?action=my
// @match        https://www.gamemale.com/plugin.php?id=wodexunzhang:showxunzhang&action=my
// @grant        GM_addStyle
// @license      GPL
// @icon         https://www.gamemale.com/template/mwt2/extend/img/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/508971/GM%E8%AE%BA%E5%9D%9B%E5%8B%8B%E7%AB%A0%E7%99%BE%E5%AE%9D%E7%AE%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/508971/GM%E8%AE%BA%E5%9D%9B%E5%8B%8B%E7%AB%A0%E7%99%BE%E5%AE%9D%E7%AE%B1.meta.js
// ==/UserScript==

// GM论坛勋章百宝箱下载更新地址
// https://greasyfork.org/zh-CN/scripts/508971
// 镜像地址
// https://gf.qytechs.cn/zh-CN/scripts/508971

// 功能一览
// 默认关闭回收功能，徽章按类型排序，保存/还原徽章顺序，一键续期单个勋章，勋章分类，回帖期望，一键续期所有咒术徽章，一键关闭赠礼/咒术类勋章显示，
// TODO 一键仅保留自己喜欢的勋章的显示
// TODO 一键切换天赋
// TODO 一键把不喜欢的勋章塞最后
// TODO 一键把自己想要展示的勋章塞最前面
// TODO 勋章过期提示
// TODO 勋章维持属性提示
// DONE 好卡，该优化了！
// DONE 分类统计勋章收益【所有、常驻、临时】
// DONE 分类新增装饰，因为他有最大数量上限
// TODO 有效期时长显示不稳定
// TODO 勋章寄售按钮里，有medalid。如果将key从name转为medalid，就不用再维护因为勋章改名引起的代码失效
// TODO 一键排序需要优化，以及存在名称bug（目前只是分类去掉了【不可购买】，但是排序还存在的这个问题没有修复）
// DONE 预设列表提示，大概是会加个开关。又开关才会弹，没开关就不弹。那感觉可以把赠礼列表全部打钩保存。
// DONE 检测我背包缺少了什么赠礼然后直接生成一串让我可以粘贴到记录
// TODO 预设列表的一键互赠列表，支持预设互赠模版

(function () {
    'use strict';
    const 是否自动开启茉香啤酒 = 0;

    const linkList = {
        "游戏男从": "youxi", "真人男从": "zhenren", "女从": "Maid",
        "装备": "Equip", "资产": "Asset", "宠物": "Pet", "板块": "Forum", "天赋": "Skill",
        "赠礼": "Gift", "咒术": "Spell", "剧情": "Plot", "奖品": 'Prize',
        '储蓄': 'Deposit', '装饰': 'Deco', '薪俸': 'Salary', '故事': "Story",
        "其他": "other",
    };

    // 额外提供一个对象，存储每个键对应的数字
    const numbers = {
        "游戏男从": 11, "真人男从": 8, "女从": 5, "装备": 12, "资产": 16,
        "宠物": 7, "板块": 5, "天赋": 4, "储蓄": 1, "装饰": 6, "薪俸": 1
    };
    const formhash = document.querySelector('input[name="formhash"]').value;
    // 勋章总类型
    const orderList = Object.keys(linkList);

    const categoriesData = {
        "youxi": [
            "杰夫‧莫罗",
            "克里斯‧雷德菲尔德",
            "疾风剑豪",
            "光之战士",
            "百相千面",
            "苇名弦一郎",
            "艾吉奥",
            "弗图博士",
            "裸体克里斯",
            "凯登‧阿兰科",
            "果体76",
            "岛田半藏",
            "内森·德雷克",
            "卡洛斯·奥利维拉",
            "天照大神",
            "虎头怪",
            "希德法斯·特拉蒙",
            "诺克提斯·路西斯·伽拉姆",
            "尼克斯·乌尔里克",
            "文森特‧瓦伦丁",
            "炙热的格拉迪欧拉斯",
            "竹村五郎",
            "【周年限定】克里斯(8)",
            "沃特·沙利文",
            "里昂‧S‧甘乃迪",
            "亚瑟‧摩根",
            "萨菲罗斯",
            "克莱夫・罗兹菲尔德",
            "岛田源氏",
            "BIG BOSS",
            "狄翁・勒萨若",
            "【夏日限定】夏日的泰凯斯",
            "Dante",
            "库伦 (起源)",
            "康纳/Connor",
            "里昂（RE4）",
            "英普瑞斯",
            "乔纳森·里德",
            "Doc",
            "杰克·莫里森/士兵 76",
            "维吉尔",
            "皮尔斯‧尼凡斯",
            "杰西·麦克雷",
            "泰比里厄斯",
            "Vergil",
            "普隆普特·阿金塔姆",
            "桐生一马",
            "格拉迪欧拉斯",
            "亚当‧简森",
            "桑克瑞德·沃特斯",
            "铁牛",
            "黑墙",
            "安杜因·乌瑞恩",
            "阿尔伯特·威斯克",
            "V (DMC5)",
            "汉克/Hank",
            "希德‧海温特",
            "巴尔弗雷亚",
            "肥皂",
            "士官长",
            "豹王",
            "阿列克西欧斯（Alexios）",
            "莱因哈特·威尔海姆",
            "幻象",
            "加勒特·霍克",
            "不灭狂雷-沃利贝尔",
            "泰凯斯·芬得利",
            "陷阱杀手",
            "Scott Ryder",
            "不屈之枪·阿特瑞斯",
            "詹姆斯‧维加",
            "阿尔萨斯‧米奈希尔",
            "盖拉斯‧瓦卡瑞安",
            "法卡斯",
            "库伦 (审判)",
            "【新手友好】昆進",
            "鬼王酒吞童子",
            "维克多‧天火",
            "蛮族战士",
            "奧倫",
            "吉姆‧雷诺",
            "但丁",
            "威尔卡斯",
            "亚力斯塔尔",
            "艾德尔",
            "约书亚・罗兹菲尔德",
            "古烈",
            "【新春限定】果体 隆",
            "巴哈姆特",
            "“半狼”布莱泽",
            "炽焰咆哮虎",
            "傲之追猎者·雷恩加尔",
            "本・比格",
            "高桥剑痴",

        ],
        "zhenren": [
            "托尼·史塔克",
            "Joker",
            "克里斯·埃文斯",
            "魯杰羅·弗雷迪",
            "虎克船长",
            "纣王·子受",
            "安德森‧戴维斯",
            "索尔·奥丁森",
            "擎天柱（Peterbilt389）",
            "麦迪文（Medivh）",
            "西弗勒斯·斯内普",
            "神灯",
            "索林·橡木盾",
            "阿拉贡",
            "乔治·迈克尔",
            "阿齐斯",
            "魔术师奥斯卡",
            "杰森‧斯坦森",
            "小天狼星·布莱克",
            "阿不思·邓布利多",
            "甘道夫",
            "博伊卡",
            "死亡",
            "克劳斯·迈克尔森",
            "莱昂纳多·迪卡普里奥",
            "马克·史贝特",
            "史蒂文·格兰特",
            "尼克·王尔德",
            "亚瑟·库瑞（海王）",
            "巴基 (猎鹰与冬兵)",
            "哈尔‧乔丹",
            "克苏鲁",
            "异形",
            "卢西亚诺‧科斯塔",
            "罗宾·西克",
            "超人",
            "丹·雷诺斯",
            "罗伯‧史塔克",
            "蓝礼·拜拉席恩",
            "卡德加（Khadgar）",
            "吉姆·霍普",
            "大古",
            "黑豹",
            "莱托·厄崔迪",
            "Drover",
            "艾利克斯",
            "阿尔瓦罗·索莱尔",
            "三角头",
            "布莱恩‧欧康纳",
            "迪恩‧温彻斯特",
            "山姆‧温彻斯特",
            "丹尼爾·紐曼",
            "迈克尔迈尔斯",
            "金刚狼",
            "Chris Mazdzer",
            "瑟兰迪尔",
            "威克多尔·克鲁姆",
            "大黄蜂（ChevroletCamaro）",
            "勒维恩·戴维斯",
            "安德鲁·库珀",
            "丹·安博尔",
            "塞巴斯蒂安·斯坦",
            "莱戈拉斯",
            "奥利弗‧奎恩",
            "盖里",
            "汤姆·赫兰德",
            "Frank (LBF)",
            "詹米·多南",
            "羅素·托維",
            "藤田優馬",
            "康纳‧沃什",
            "巴特‧贝克",
            "戴尔‧芭芭拉",
            "猫化弩哥",
            "卡斯迪奥",
            "史蒂夫‧金克斯",
            "戴蒙‧萨尔瓦托",
            "尼克·贝特曼",
            "尤利西斯",
            "奇异博士",
            "托比·马奎尔",
            "汉尼拔",
            "John Reese",
            "穿靴子的猫",
            "狗狗",
            "约翰·康斯坦丁",
            "亨利.卡维尔",
            "牛局长博戈",
            "基努·里维斯",
            "大侦探皮卡丘",
        ],
        "Maid": [
            "梅格",
            "贝优妮塔",
            "莫瑞甘",
            "莎伦",
            "绯红女巫",
            "赫敏·格兰杰",
            "蒂法·洛克哈特",
            "山村贞子",
            "九尾妖狐·阿狸",
            "丹妮莉丝·坦格利安",
            "希尔瓦娜斯·风行者",
            "刀锋女王",
            "维涅斯",
            "星籁歌姬",
            "莫甘娜",
            "凯尔",
            "露娜弗蕾亚·诺克斯·芙尔雷",
            "凯特尼斯·伊夫狄恩",
            "爱丽丝·盖恩斯巴勒",
            "朱迪·霍普斯",
            "“米凯拉的锋刃”玛莲妮亚",
            "吉尔·沃瑞克",
            "叶卡捷琳娜",
            "阿丽塔",
            "梅琳娜Melina",
            "贝儿(Belle)",
            "阿加莎·哈克尼斯",
            "红夫人",
            "莉莉娅·考尔德（Lilia Calderu）",
            "琴.葛蕾",
            "Honey B Lovely",

        ],
        "Equip": [
            "嗜血斩首斧",
            "符文披风",
            "净化手杖",
            "十字叶章",
            "刺杀者匕首",
            "药剂背袋",
            "重磅手环",
            "超级名贵无用宝剑",
            "念念往日士官盔",
            "圣英灵秘银甲",
            "布衣",
            "艾尔尤因",
            "神圣十字章",
            "重新充能的神圣十字章", // 某次活动的产出
            "新月护符",
            "骑士遗盔",
            "变形软泥",
            "山猫图腾",
            "猎鹰图腾",
            "眼镜蛇图腾",
            "守望者徽章",
            "石鬼面",
            "冒险专用绳索",
            "赫尔墨斯·看守者之杖",
            "巴啦啦小魔仙棒",
            "十字军护盾",
            "龙血之斧",
            "蔷薇骑士之刃",
            "狩猎用小刀",
            "钢铁勇士弯刀",
            "海盗弯钩",
            "生锈的海盗刀枪",
            "日荒戒指",
            "月陨戒指",
            "星芒戒指",
            "琉璃玉坠",
            "武士之魂",
            "力量腕带",
            "物理学圣剑",
            "男用贞操带",
            "贤者头盔",
            "恩惠护符",
            "超级幸运无敌辉石",
            "破旧打火机",
            "女神之泪",
            "和谐圣杯",
            "天使之赐",
            "棱镜",
            "射手的火枪",
            "坏掉的月亮提灯",
            "装了衣物的纸盒",
            "肃弓",
            "圣诞有铃",
            "普通羊毛球",
            "圣水瓶",
            "黑暗封印",
            "枯木法杖",
            "千年积木",
            "被冰封的头盔",
        ],
        "Asset": [
            "知识大典",
            "微笑的面具",
            "种植小草",
            "聚魔花盆",
            "金钱马车",
            "流失之椅",
            "漂洋小船",
            "种植菠菜",
            "夜灯",
            "诺曼底号",
            "充满魔力的种子",
            "木柴堆",
            "暗红矿土",
            "神秘的邀请函",
            "锻造卷轴",
            "奇怪的紫水晶",
            "预知水晶球",
            "发芽的种子",
            "史莱姆养殖证书",
            "这是一片丛林",
            "种植菊花",
            "婴儿泪之瓶",
            "雪王的心脏",
            "勇者与龙之书",
            "章鱼小丸子",
            "浪潮之歌",
            "迷之瓶",
            "德拉克魂匣",
            "圣甲虫秘典",
            "红石",
            "幽灵竹筒",
            "神秘的红茶",
            "种植土豆",
            "用过的粪桶",
            "箭术卷轴",
            "【圣诞限定】心心念念小雪人",
            "魔法石碑",
            "远古石碑",
            "冒险用面包",
            "海螺号角",
            "沙漠神灯",
            "老旧的怀表",
            "冒险用指南针",
            "暖心小火柴",
            "神秘的漂流瓶",
            "冒险用绷带",
            "宝箱内的球",
            "SCP-s-1889",
            "GHOST",
            "GM論壇初心者勛章",
            "社畜专用闹钟",
            "冒险用宝箱",
            "羽毛笔",
            "超级无敌名贵金卡",
            "One Ring",
            "秘密空瓶",
            "梦中的列车",
            "双项圣杯",
            "散佚的文集",
            "令人不安的契约书",
            "被尘封之书",
            "黑暗水晶",
            "无垠",
            "冰海钓竿",
            "神秘挑战书",
            "半生黄金种",
            "羽毛胸针",
            "神秘天球",
            "婚姻登记册",
            "健忘礼物盒",
            "弯钩与连枷",
            "尼特公仔",
            "辉夜姬的五难题",
            "末影珍珠",
            "基础维修工具",
            "无限魔典",
        ],
        "Pet": [
            "洞窟魔蛋",
            "迷のDoge",
            "史莱姆蛋",
            "红龙蛋",
            "黑龙蛋",
            "腐化龙蛋",
            "漆黑的蝎卵",
            "【年中限定】GM村金蛋",
            "结晶卵",
            "暮色卵",
            "青鸾蛋",
            "电磁卵",
            "珊瑚色礁石蛋",
            "月影蛋",
            "马戏团灰蛋",
            "郁苍卵",
            "熔岩蛋",
            "灵鹫蛋",
            "血鹫蛋",
            "软泥怪蛋",
            "螺旋纹卵",
            "万圣彩蛋",
            "幽光彩蛋",
            "沙漠羽蛋",
            "林中之蛋",
            "五彩斑斓的蛋",
            "血红色的蛋",
            "海边的蛋",
            "新手蛋",
            "【限定】深渊遗物", // 是奖品升级而来的宠物
            "小阿尔的蛋",
            "狱炎蛋",
            "灵藤蛋",
            "棕色条纹蛋",
            "长花的蛋",
            "可疑的肉蛋",
            "崩朽龙卵",
            "波纹蓝蛋",
            "吸血猫蛋",
            "脏兮兮的蛋",
            "双生蛋",
            "图书馆金蛋",
        ],
        "Forum": [
            "质量效应三部曲",
            "五花八门版块",
            "辐射：新维加斯",
            "上古卷轴V：天际",
            "龙腾世纪：审判",
            "堕落飨宴",
            "奥兹大陆",
            "生化危机：复仇",
            "荒野大镖客：救赎 II",
            "TRPG版塊",
            "模擬人生4",
            "达拉然",
            "雾都血医",
            "寶可夢 Pokémon",
            "最终幻想XIV",
            "赛博朋克2077",
            "恶魔城",
            "英雄联盟",
            "男巫之歌",
            "时间变异管理局",
            "美恐：启程",
            "街头霸王",
            "最终幻想XVI",
            "雄躯的昇格",
            "极客的晚宴",
            "Zootopia",
            "都市：天际线2",
            "黑神话:悟空",
            "黑暗之魂系列",
            "女巫之路",
            "艾尔登法环",
        ],
        "Gift": [
            "送情书",
            "丢肥皂",
            "千杯不醉",
            "灵光补脑剂",
            // "贞洁内裤", // 已下架
            "遗忘之水",
            "萨赫的蛋糕",
            "神秘商店贵宾卡",
            "变骚喷雾",
            "没有梦想的咸鱼",
            "闪光糖果盒",
            "茉香啤酒",
            "香蕉特饮", //某次活动限定
            "枕套幽灵", //2024年万圣节限定

        ],
        "Spell": [
            "炼金之心",
            "黑暗交易",
            "水泡术",
            "召唤古代战士",
            "祈祷术",
            "吞食魂魄",
            "咆哮诅咒",
            "霍格沃茨五日游",
            "石肤术",
            "雷霆晶球",
            "思绪骤聚",
            "杀意人偶",
            "太空列车票"
        ],
        "Skill": [
            "牧羊人",
            "森林羊男",
            "堕落之舞",
            "黄色就是俏皮",
            "骑兽之子",
            "禽兽扒手",
            "野兽之子",
            "四季之歌",
            "风雪之家",
            "男色诱惑",
            "海边的邻居",
            "五谷丰年"
        ],
        "Story": [
            "被祝福の新旅程",
            "另一个身份",
            "神之匠工",
            "倒吊人(The Hanged Man , XII)",
            "战车(The Chariot , VII)",
            "恋人(The Lovers，VI)",
            "魔术师（The Magician，I）",
            "恋恋小烹锅",
            "晃晃悠悠小矿车",
            "巴比伦辞典"
        ],
        // 勋章博物馆把这些部分划分在Salary/Other类别里，我们直接划到其他类里
        "Salary": [
            // "Chris Redfield in Uroboros",
            "站员薪俸",
            "实习版主薪俸",
            "版主薪俸",
            "站员: 保卫领土",
            "见习版主: 神的重量",
            "版主: 一国之主"
        ],
        "Deposit": [
            "白猪猪储蓄罐㊖",
            "粉猪猪储蓄罐㊖",
            "金猪猪储蓄罐㊖",
            "不起眼的空瓶"
        ],
        // [...document.querySelectorAll('.myimg img')].map(e=>e.alt)
        "Deco": ['纯真护剑', '爬行植物Ⓛ', '爬行植物Ⓡ', '特殊-家园卫士Ⓛ', '特殊-家园卫士Ⓡ', '勋章空位插槽', '16x43 隐形➀', '16x43 隐形➁', '20x43 隐形➀', '20x43 隐形➁', '40x43 隐形➀', '40x43 隐形➁', '82x43 隐形➀', '82x43 隐形➁', '124x43 隐形➀', '124x43 隐形➁', '装饰触手Ⓛ', '装饰触手Ⓡ'],
        // 『浪客便当』『酒馆蛋煲』勋章博物馆搜不到，但是还是保留 兔兔说，限时活动是不会在博物内留档的
        "Plot": [
            "『酒馆蛋煲』",
            "『浪客便当』",

            "『还乡歌』",
            "『日心说』",
            "『任天堂Switch』红蓝√",
            "『任天堂Switch』灰黑√",
            "『私有海域』",
            "『钜鲸』",
            "『召唤好运的角笛』",
            "『圣洁化身』",
            "『矩阵谜钥Ⓖ』",
            "『新居手册Ⓖ』",
            "『居住证: Lv2~6』",
            "『户口本: Lv7+』",
            "『瓶中信』",
            "『弗霖的琴』",
            "『伊黎丝的祝福』",
            "『灰域来音』",
            "『迷翳之中』",
            "『迷翳森林回忆录』",
            "『星河碎片』",
            "『金色车票』",
            "『列车长』",
            "『不败之花』",
            "『先知灵药』",
            "『流星赶月』",
            "『分析天平』",
            "『钟楼日暮』",
            "『泥潭颂唱者』",
            "『逆境中的幸运女神』",
            "『南瓜拿铁』",
            "『冰雕马拉橇』",
            "『搓粉团珠』",
            "『道具超市』",
            "『绿茵甘露』",
            "『凯旋诺书』",
            "『转生经筒』",
            "『林中过夜』",
            "『厢庭望远』",
            "『狄文卡德的残羽』",
            "『炫目的铁塔』",
            "『天圆地方』",
        ],
        "Prize": [
            "深渊遗物",
            "一只可爱的小猫",
            "猫眼",
            "謎の男",
            "TRPG纪念章",
            "迷之瓶",
            "海上明月",
            "铁杆影迷",
            "泡沫浮髅(Squirt)",
            "秘密森林",
            "心之水晶",
            "天涯.此时",
            "月亮的蛋",
            "传承之证",
            "新年小猴",
            "华灯初上",
            "网中的皮卡丘",
            "龙之魂火",
            "红龙精华",
            "红龙秘宝",
            "秋水长天",
            "莱托文本残页",
            "德拉克的遗物",
            "不败之花",
            "迷之天鹅",
            "月上柳梢",
            "血石",
            "掌中雪球瓶",
            "猫猫幽灵",
            "万圣南瓜",
            "神秘的礼物",
            "老旧的书籍",
            "枯黄的种苗",
            "云上之光",
            "魔法灵药",
            "波板糖",
            "GM村蛋糕",
            "缘定仙桥",
            "小小行星",
            "闪耀圣诞球",
            "压箱底的泡面",
            "孔明灯",
            "生命树叶",
            "玄生万物",
            "海的记忆",
            "海与天之蛋",
            "奇思妙想",
            "旅行骰子！",
            "红心玉",
            "牌中小丑",
            "黑夜之星",
            "追击者",
            "传送镜",
            "风物长宜",
            "小小舞台",
            "探险三杰士",
            "白巧克力蛋",
            "猛虎贴贴",
            "绿茵宝钻",
            "肉垫手套",
            "龙之秘宝",
            "图腾饼干",
            "重建熊屋",
            "六出冰花",
            "特供热巧",
            "岛屿探险家",
            "征服之王",
            "龙鳞石",
            "幽浮起司堡",
            "一只陶瓮",
            "阿怪",
            "照相机",
            "金翼使(30d)",
            "金翼使㊊",
            "变身器",
            "近地夜航",
            "巨力橡果(30d)",
            "巨力橡果㊊",
            "古老金币",
            "不洁圣子",
            "小小安全帽",
            "金牌矿工",
            "御医神兔",
            "脉律辐石",
            "劫掠核芯",
            "幸运女神的微笑",
            "梅克军徽",
            "奎兰",
            "水银日报社特约调查员",
            // 2025年奖品
            "银色溜冰鞋",
            "永亘环",
            "小狮欢舞",
            "神奇宝贝大师球",
            "神奇宝贝图鉴",
            "猫咪点唱机㊊",
            "肉乖乖",
            "灵魂残絮聚合法",
            "猫头鹰守卫",
            "鎏彩万幢",
            "呆猫",
            "传说中的黑龙",
            "检定场",
            "命运的轮廓",
            "灯载情绵",
            "桂花米糕",
            "德罗瑞安",
            "悬浮滑板",
            "发条八音盒",
            "弗雷迪玩偶",
            "河豚寿司",
            "荧光水母",
            // 2026年奖品
            "救命饮料",
            "适当显灵",
            "未知纸盒",
            "光明奇幻木偶",
        ],
    };
    // 2025年元旦活动新增的类别，期间限定的临时活动勋章
    // 不能放进categoriesData，会干扰排序，就单独放在这里做纪念吧
    // 新春活动也出现了这个类别，并且出现了多次，说明这是一个活动专属类别
    // 无需在意、无需记录、摸了
    const Events = [
        // 2023-2024年的期间限定勋章
        // https://www.gamemale.com/forum.php?mod=viewthread&tid=137437
        "香浓罗宋汤" // https://img.gamemale.com/album/202412/31/230448aspoeushzeup66kf.gif
    ];

    // 可赠送勋章列表（英文变量名使用 GiftableBadges）
    const GiftableBadges = [
        '没有梦想的咸鱼', '灵光补脑剂', '茉香啤酒', '咆哮诅咒',
        '丢肥皂', '千杯不醉', '变骚喷雾', '送情书',
        '霍格沃茨五日游', '神秘商店贵宾卡', '闪光糖果盒',
        '萨赫的蛋糕', '遗忘之水', '炼金之心', '石肤术',
        '召唤古代战士', '水泡术', '思绪骤聚', '雷霆晶球', '杀意人偶'
    ];

    // 临时把所有的真人勋章名字都加上点
    // categoriesFormat(categoriesData);

    // 预处理名称到分类的映射（包含全角/半角转换）
    const nameCategoryMap = new Map();
    for (const [category, names] of Object.entries(categoriesData)) {
        for (const name of names) {
            const formatName = name
                .replace(/[·‧]/g, s =>s === '·' ? '‧' : '·' ) // 统一转换为半角符号进行匹配
            nameCategoryMap.set(formatName, category);
        }
    }
    // console.log(nameCategoryMap);

    // 创建一个新的div元素用于管理徽章
    initbadgeManage();

    // 别人的勋章分类展示和回帖期望计算
    // badgeOrder()
    // 自己优化的代码（AI优化的）
    optimizedBadgeOrder();

    // 默认关闭回收功能
    createLink('显示/隐藏回收按钮', setHuiShou);
    setHuiShou('init');

    // 勋章排序
    createLink('按照类型排序', kindOrder);

    //新增按钮保存/还原勋章顺序
    createLink('保存勋章顺序', saveKeysOrder);
    createLink('还原勋章顺序', loadKeysOrder);

    // 单个勋章一键续期
    oneClickRenew();

    // 给所有可续期的咒术勋章续期
    createLink('续期所有咒术勋章', oneClickAllSpell);

    // 一键关闭赠礼/咒术类勋章显示
    createLink('关闭赠礼/咒术勋章显示', oneClickDisplay);
    createLink('关闭所有勋章显示', closeAllDisplay);

    // 设置勋章提醒
    createLink('设置预设勋章提醒', showDialog);

    if (是否自动开启茉香啤酒) { 自动开启茉香啤酒(); }

    // 记录展示勋章/置顶展示勋章
    if (discuz_uid == 723150) {
        createLink('记录展示勋章', saveTopMedal);
        createLink('置顶展示勋章', loadTopMedal);
        showTopMedal();
        observeElement();
    }

    /* =============================================================================================================== */

    // 创建一个新的div元素用于管理徽章
    function initbadgeManage() {
        const badgeManagerDiv = document.createElement('div');
        badgeManagerDiv.className = 'badge-manager';
        badgeManagerDiv.innerHTML = '<h2>徽章管理</h2><p>这里可以管理您的徽章。</p><div class="badge-manager-button"><div>';

        const badgeOrderDiv = document.createElement('div');
        badgeOrderDiv.className = 'badge-order';
        badgeOrderDiv.innerHTML = '正在计算您拥有的徽章类型和价值，请稍等。。。如果长期没有加载，可能是你的其他插件报错影响了本插件的正常运行，请逐个关闭其他插件进行排查';

        // 获取目标div并在其前面插入新创建的div
        const targetDiv = document.querySelector('.my_fenlei');
        targetDiv.parentNode.insertBefore(badgeManagerDiv, targetDiv);
        badgeManagerDiv.appendChild(badgeOrderDiv);
        // targetDiv.parentNode.insertBefore(badgeOrderDiv, badgeManagerDiv);

        // 在这里添加您的自定义样式
        const customStyles = `
        .badge-manager {
            background-color: #f0f0f0; /* 背景颜色 */
            padding: 10px;             /* 内边距 */
            margin-bottom: 10px;       /* 底部外边距 */
            border: 1px solid #ccc;    /* 边框 */
            color: #333;               /* 字体颜色 */
        }
        
        .badge-manager h2 {
            margin: 0;                /* 去掉默认的外边距 */
            font-size: 18px;          /* 标题字体大小 */
            color: #007BFF;           /* 标题颜色 */
        }

        .badge-manager p {
            margin: 5px 0;
        }

        .badge-order {
            margin: 5px 0;
        }

        .badge-order p {
            margin: 0;
        }

        .custom-button {
            padding: 5px 10px;
            margin: 5px;
            margin-left: 0px;
            background-color: #007BFF;        /* 按钮背景颜色 */
            color: white;                      /* 字体颜色 */
            border: none;                      /* 去掉默认边框 */
            border-radius: 5px;               /* 圆角 */
            cursor: pointer;                   /* 鼠标悬停时显示手型 */
        }

        .custom-button:hover {
            background-color: #0056b3;        /* 悬停时的背景颜色 */
        }

        .message-item {
            position: fixed;
            top: 10px;
            left: 10px;
            background-color: #4caf50;
            color: white;
            padding: 10px;
            z-index: 1000;
        }
        
        .myfldiv{
            display: flex;
            flex-wrap: wrap;
            align-items: flex-start;
        }
    `;

        // 新皮肤，白色主题 
        // GM_addStyle 没有删除功能 搁置
        const whiteStyles = `
        .badge-manager {
            background-color: #f0f0f0; /* 背景颜色 */
            padding: 10px;             /* 内边距 */
            margin-bottom: 10px;       /* 底部外边距 */
            border: 1px solid #ccc;    /* 边框 */
            font-family: Arial, sans-serif; /* 字体 */
            color: #333;               /* 字体颜色 */
        }
        
        .badge-manager h2 {
            margin: 0;                /* 去掉默认的外边距 */
            font-size: 18px;          /* 标题字体大小 */
            color: #007BFF;           /* 标题颜色 */
        }

        .badge-manager p {
            margin: 5px 0;
        }

        .custom-button {
            background-color: transparent;
            border: 0.125em solid #1A1A1A;
            border-radius: 0.6em;
            color: #3B3B3B;
            font-size: 14px;
            font-weight: 600;
            margin: 0.4em 0.8em 0.4em 0;
            padding: 0.4em 1.2em;
            text-align: center;
            text-decoration: none;
            transition: all 300ms cubic-bezier(.23, 1, 0.32, 1);
            font-family: Noto Sans SC, Microsoft Yahei, Arial, sans-serif;
        }

        .custom-button:hover {
            color: #fff;
            background-color: #1A1A1A;
            box-shadow: rgba(0, 0, 0, 0.25) 0 8px 15px;
            transform: translateY(-2px);
        }

        .custom-button:active {
            box-shadow: none;
            transform: translateY(0);
        }

        .message-item {
            position: fixed;
            top: 10px;
            left: 10px;
            background-color: white;
            color: #333;
            padding: 10px 20px;
            border-radius: 6px;
            z-index: 1000;
            font-weight: bold;
            font-size: 16px;
            font-family: 'Noto Sans SC', 'Microsoft Yahei', Arial, sans-serif;
        }
    `;
        const TopMedalContainer = `
        .appl .TopMedal-container img {
            margin: 4px 2px 0 0;
        }
        .TopMedal-container {
            width: 130px;
        }

        .TopMedal-container__Fixed {
            position: fixed;
            top: 40px;
        }
        `;
        GM_addStyle(customStyles);
        GM_addStyle(TopMedalContainer);
    }

    // 添加功能按钮
    function createLink(label, onClickMethod) {
        const button = document.createElement('button');
        button.className = 'custom-button';
        button.textContent = label;
        button.onclick = (event) => {
            event.preventDefault(); // 阻止默认行为
            onClickMethod(); // 调用自定义方法
        };

        // 将链接添加到页面的 body 中
        const my_biaoti = document.querySelector('.badge-manager-button');
        my_biaoti.appendChild(button);
    }

    // 设置回收按钮
    function setHuiShou(init) {
        let isShow;
        document.querySelectorAll('.my_fenlei button.pn').forEach(element => {
            if (element.innerText == '回收') {
                // 初始化干掉
                if (init) {
                    element.style.display = "none";
                    element.parentElement.style.display = "none";
                } else {
                    // 检查元素的display属性
                    if (element.style.display === "none" || getComputedStyle(element).display === "none") {
                        // 如果是none，则显示元素和其父元素
                        element.style.display = "inline";
                        element.parentElement.style.display = "inline"; // 显示父元素
                        isShow = true;
                        // alert('回收按钮已显示')
                    } else {
                        // 否则隐藏元素和其父元素
                        element.style.display = "none";
                        element.parentElement.style.display = "none"; // 隐藏父元素
                        isShow = false;
                        // alert('回收按钮已隐藏')
                    }
                }
            }
        });

        if (!init) {
            alert(`${isShow ? '回收按钮已显示' : '回收按钮已隐藏'}`);
        }

    }

    // 勋章排序
    function kindOrder() {
        // 获取所有匹配的元素
        const elements = document.querySelectorAll('.my_fenlei .myblok');
        const elementsArray = Array.from(elements);

        // 使用 map 函数处理每个元素
        const xunzhangList = elementsArray.map(myBlock => {
            const key = myBlock.getAttribute('key');
            const nameElement = myBlock.querySelector('p b'); // 找到包含名称的 <b> 标签
            const name = nameElement ? nameElement.textContent : '';
            return { [name]: key };
        });
        // 使用 reduce 合并字典
        const mergedDict = xunzhangList.reduce((acc, curr) => {
            return { ...acc, ...curr };
        }, {});

        // 填补未知的勋章
        const mergedDictKey = Object.keys(mergedDict);
        const allCategoriesData = Object.values(categoriesData).flat();
        categoriesData.other = findUniqueValues(mergedDictKey, allCategoriesData);

        function findUniqueValues(a, b) {
            // 将数组 b 转换为一个 Set，以提高查找效率
            const setB = new Set(b);

            // 过滤出在 a 中且不在 b 中的值
            const uniqueValues = a.filter(value => !setB.has(value));

            return uniqueValues;
        }

        const previousInput = localStorage.getItem('sortInput') || orderList.join(' ');

        // 弹出输入框，默认值为之前的内容
        const userInput = prompt("您正在进行一键排序，是否需要修改排序顺序（用空格分隔）:", previousInput);

        // 如果用户输入了内容
        if (userInput !== null) {
            // 将输入的内容转换为数组并进行排序
            const sortedArray = userInput.split(' ').map(item => item.trim());

            // 验证用户输入的合理性，如果不全或者输入错误，就给他补全
            // 过滤 userInput，保留在 orderList 中的项
            const filteredInput = sortedArray.filter(item => orderList.includes(item));

            // 找出 orderList 中缺失的元素
            const missingItems = orderList.filter(item => !filteredInput.includes(item));

            // 将 filteredInput 和 missingItems 合并，missingItems 加在最后
            const resultInput = [...filteredInput, ...missingItems];

            // 保存到 localStorage
            localStorage.setItem('sortInput', resultInput.join(' '));

            // 按类别拼接对应的Key
            const order1 = sortedArray.map(e => categoriesData[linkList[e]]);
            const order2 = [].concat(...order1);
            const result = order2.map(key => mergedDict[key]).filter(value => value !== undefined);

            postNewOrder(result);

            // 输出排序后的结果
            // alert("排序后的结果:\n" + sortedArray.join(', '));
        }
    }

    // 保存勋章顺序
    function saveArrayToLocalStorage(key, array) {
        localStorage.setItem(key, JSON.stringify(array));
    }

    // 从本地存储获取数组
    function getArrayFromLocalStorage(key) {
        const storedArray = localStorage.getItem(key);
        return storedArray ? JSON.parse(storedArray) : null;
    }

    // 从本地存储删除数组
    function removeArrayFromLocalStorage(key) {
        localStorage.removeItem(key);
    }

    // 获取所有具有指定类名的div元素
    function getKeysFromDivs() {
        // 使用querySelectorAll获取所有带有该类的div
        const divs = document.querySelectorAll(`div.myblok`);

        // 提取每个div的key属性并返回数组
        // key 已经过时了，该返回div的name了
        const keys = Array.from(divs).map(div => div.querySelector('img').alt);

        return keys;
    }

    // 保存勋章顺序
    function saveKeysOrder() {
        const keys = getKeysFromDivs();
        saveArrayToLocalStorage('keyOrder', keys);
        alert('保存成功');
    }

    // 把存储的name转化成key并输出
    function loadKeysOrder() {
        const name = getArrayFromLocalStorage('keyOrder');
        const orderKey = NameToKey(name);
        postNewOrder(orderKey);
    }

    // 把存储的Name转化为Key
    function NameToKey(keys) {
        const divs = document.querySelectorAll(`div.myblok`);
        const array = Array.from(divs).map(div => {
            return {
                name: div.querySelector('img').alt,
                key: div.getAttribute('key')
            };
        });

        // 按照 name排序
        // 创建 name 到 key 的索引映射
        const indexMap = {};
        keys.forEach((value, index) => {
            indexMap[value] = index + 1;
        });

        // 根据映射对 array 排序
        array.sort((a, b) => {
            return (indexMap[a.name] || Infinity) - (indexMap[b.name] || Infinity);
        });
        const orderKey = array.map(e => e.key);
        return orderKey;
    }

    // 输出新的排序
    function postNewOrder(newOrder) {
        const url = 'https://www.gamemale.com/plugin.php?id=wodexunzhang:showxunzhang';
        // 创建FormData对象
        const formData = new FormData();
        const data = { newOrder, action: 'newOrder' };

        // 将数据添加到formData
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                formData.append(key, data[key]);
            }
        }

        // 使用fetch发送POST请求
        fetch(url, {
            method: 'POST',
            body: formData,
        })
            .then(response => {
                // alert('还原勋章顺序成功，点击确认后刷新页面')
                location.reload();

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                // return response.json(); // 或根据需要返回其他格式
            })
            .then(data => {
                console.log('Success:', data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    function oneClickRenew() {
        // 获取所有的按钮元素
        const buttons = document.querySelectorAll('button.pn');

        buttons.forEach(button => {
            // 检查onclick属性是否包含'可续期'
            if (button.innerText == '可续期') {
                // 创建新的一键续期按钮
                const newButton = document.createElement('button');
                const userMedalid = button.getAttribute('onclick').match(/\d+/g)[0];
                const titleElement = button.closest('.myimg').querySelector('img[alt]');
                const name = titleElement.getAttribute('alt');

                newButton.type = 'button';
                newButton.className = 'pn';
                newButton.innerHTML = '<em>一键续期</em>';
                newButton.onclick = function () {
                    // 弹出提示框询问续期多少次
                    const times = prompt(`您正在为【${name}】一键续期，请输入续期次数：`, "1");
                    const count = parseInt(times);

                    // 判断输入是否合法
                    if (isNaN(count) || count <= 0) {
                        alert("请输入有效的次数！");
                        return;
                    }

                    repeatRequest(count, 3000, userMedalid);
                };
                // 创建一个<p>标签来包裹新按钮
                const p = document.createElement('p');
                p.appendChild(newButton);

                // 将<p>标签插入到原按钮的父元素的父元素后面，并紧贴
                button.parentNode.insertAdjacentElement('afterend', p);
            }
        });
    }

    // 给单个勋章续期
    function postRenew(userMedalid) {
        if (!userMedalid) return;
        const url = 'https://www.gamemale.com/plugin.php?id=wodexunzhang:showxunzhang';
        const data = { formhash, action: 'xuqi', jishoujiage: '', userMedalid };
        const formData = objectToFormData(data);

        return fetch(url, { method: 'POST', body: formData, });
    }

    // 模拟网络请求的函数
    async function makeRequest(userMedalid) {
        try {
            // 假设这是一个真实的 API URL
            const response = await postRenew(userMedalid);

            // if (!response.ok) {
            //     throw new Error('网络请求失败');
            // }

            const data = await response.text();
            console.log("请求已发送:", data); // 打印响应数据
            return data; // 返回请求结果
        } catch (error) {
            console.error('请求出错:', error);
            throw error; // 抛出错误以供调用者处理
        }
    }

    // 显示提示信息的函数
    function showMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.textContent = message;
        messageDiv.className = 'message-item';

        document.body.appendChild(messageDiv);

        // 自动消失
        setTimeout(() => {
            document.body.removeChild(messageDiv);
        }, 3000); // 3秒后消失
    }

    // 重复请求的函数
    async function repeatRequest(times, interval, userMedalid) {
        for (let i = 0; i < times; i++) {
            try {
                if (Array.isArray(userMedalid)) {
                    await makeRequest(userMedalid[i]);
                } else {
                    await makeRequest(userMedalid);
                }

                showMessage(`共需${times}次，已经请求 ${i + 1} 次`);
            } catch (error) {
                showMessage(`请求 ${i + 1} 失败: ${error.message}`);
            }

            // 等待间隔
            if (i < times - 1) {
                await new Promise(resolve => setTimeout(resolve, interval)); // 等待间隔
            }
        }
        showMessage('一键续期已完成，3秒后刷新页面');
        setTimeout(() => {
            location.reload();
        }, 3000); // 3秒后消失
        // console.log("所有请求已完成");
    }

    // 一键给所有可续期的咒术勋章续期
    function oneClickAllSpell() {
        const myblok = document.getElementsByClassName("myblok");
        const arrayName = [];
        const arrayKey = [];
        for (let blok of myblok) {
            const name = blok.querySelector('img[alt]').getAttribute('alt');
            const isRenewal = blok.querySelector('button.pn') && blok.querySelector('button.pn').innerText === '可续期';

            if (~categoriesData.Spell.indexOf(name) && name != '思绪骤聚' && isRenewal) {
                const key = blok.querySelector('button.pn').getAttribute('onclick').match(/\d+/g)[0];
                arrayKey.push(key);
                arrayName.push(name);

            }
        }

        if (arrayKey.length === 0) {
            alert('您没有可续期的咒术徽章，或仅有思绪骤聚\n（思绪骤聚可能有人希望重新购买获取+1知识，并未加入一键续期中）');
            return;
        }

        if (confirm(`您正在为【${arrayName.join(' ')}】咒术勋章续期，是否确认\n（思绪骤聚可能有人希望重新购买获取+1知识，并未加入一键续期中）`)) {
            repeatRequest(arrayKey.length, 3000, arrayKey);
        }
    }


    // 一键关闭赠礼/咒术类勋章显示
    function oneClickDisplay() {
        const myblok = document.getElementsByClassName("myblok");

        for (let blok of myblok) {
            const name = blok.querySelector('img[alt]').getAttribute('alt');

            if (isKind(name, 'Gift') || isKind(name, 'Spell')) {
                const input = blok.querySelector('input');
                if (input && input.checked) {
                    input.click();
                }

            }
        }

        alert('赠礼/咒术类勋章已全部设置为不显示');
    }

    // 关闭所有勋章显示
    function closeAllDisplay() {
        const myblok = document.getElementsByClassName("myblok");

        for (let blok of myblok) {
            const input = blok.querySelector('input');
            if (input && input.checked) {
                input.click();
            }
        }

        alert('所有勋章已全部设置为不显示');
    }

    // 判断一个勋章是否属于某个类别
    function isKind(name, kind) {
        return !!~categoriesData[kind].indexOf(name);
    }

    // 此处直接复制粘贴代码不想思考了
    // 别人的勋章分类展示和回帖期望计算
    function badgeOrder() {
        let result = {};
        let categories = {};

        for (const [key, value] of Object.entries(linkList)) {
            // 从 numbers 中获取对应的数字，如果没有则默认为空
            const number = numbers[key] || '';

            // 生成 result 对象
            result[`${key}${number ? `(${number})` : ''}`] = '';

            // 生成 categories 对象
            categories[value] = `${key}${number ? `(${number})` : ''}`;
        }

        // 名称匹配核心功能
        let myblok = document.getElementsByClassName("myblok");
        for (let blok of myblok) {
            let regex = /alt="(.+?)"/;
            let matches = blok.innerHTML.match(regex);

            if (matches) {
                let match = matches[1];
                let found = false;

                for (let key in categories) {
                    // 在这里对于一些同名的blok进行处理
                    // 但是存在bug所以先注释了
                    // const name = blok.querySelector('.mingcheng').innerHTML
                    // if (match === "【限定】深渊遗物") {
                    //     // https://www.gamemale.com/forum.php?mod=viewthread&tid=95019&highlight=%E6%B7%B1%E6%B8%8A%E9%81%97%E7%89%A9
                    //     if (~name.indexOf('星尘龙')) {
                    //         categoriesData.Pet.push("【限定】深渊遗物")
                    //     } else {
                    //         categoriesData.Prize.push("深渊遗物")
                    //     }
                    // } else if (match === "迷之瓶") {
                    //     if (~name.indexOf('德拉克魔瓶')) {
                    //         categoriesData.Asset.push("迷之瓶")
                    //     } else {
                    //         categoriesData.Prize.push("迷之瓶")
                    //     }
                    // }

                    // 忽略全角半角·差异
                    const match1 = match.replace(/·/g, '‧');
                    const match2 = match.replace(/‧/g, '·');

                    function isTure(array) {
                        return array.map(e => ~categoriesData[key]?.indexOf(e)).reduce((a, b) => a || b);
                    }

                    const matchArray = [match1, match2];
                    if (isTure(matchArray)) {
                        result[categories[key]] += match + ",";
                        found = true;
                        blok.setAttribute('categories', key);
                        break;
                    }
                }

                if (!found) {
                    result["其他"] += match + ",";
                    blok.setAttribute('categories', 'other');
                }
            }
        }
        let txt = "";
        for (let key in result) {
            txt += key + " : (" + (result[key].split(",").length - 1) + ") " + result[key].slice(0, -1) + "<br>";
        }

        /**
         *  计算勋章收益
         *  @type ALL 计算所有 Temporary 计算临时 Permanent 计算永久
         */
        function qiwang(pattern, type) {
            let myblok = document.getElementsByClassName("myblok");
            let result = { "金币": 0, "血液": 0, "咒术": 0, "知识": 0, "旅程": 0, "堕落": 0, "灵魂": 0 };

            // 仅计算临时勋章收益
            if (type === 'Temporary') {
                myblok = [...myblok].filter(e => ~e.textContent.indexOf('有效期'));
            } else if (type === 'Permanent') {
                myblok = [...myblok].filter(e => !~e.textContent.indexOf('有效期'));
            }

            for (let blok of myblok) {
                if (blok.innerText.indexOf("已寄售") > 0) {
                    continue;
                }
                let regex = /几率 (\d+)%/i;
                let matches = blok.innerText.match(regex);

                if (matches) {
                    let prob = matches[1];
                    let symbols = Array.from(blok.innerText.matchAll(pattern), m => m[2]);
                    let isSame = symbols.every(function (element) {
                        return element === symbols[0];
                    });

                    matches = blok.innerText.matchAll(pattern);
                    for (let match of matches) {
                        let score = prob / 100 * parseInt(match[2] + match[3]);
                        result[match[1]] = Number((result[match[1]] + score).toFixed(4));
                    }
                }
            }
            return result;
        }

        function getCoin() {
            let coin = 0;
            let myblok = document.getElementsByClassName("myblok");
            for (let blok of myblok) {
                let regex = /金币\s+(\d+)寄售/i;
                let matches = blok.innerText.match(regex);
                if (matches) {
                    coin += parseInt(matches[1]);
                }
            }
            return coin;
        }

        function showValid() {
            let myblok = document.getElementsByClassName("myblok");
            for (let blok of myblok) {
                let regex = /\s+(.+?分)\d{1,2}秒有效期/i;
                let matches = blok.innerText.match(regex);
                if (matches) {
                    let newP = document.createElement("p");
                    let newContent = document.createTextNode(matches[1]);
                    newP.appendChild(newContent);
                    blok.firstElementChild.appendChild(newP);
                }
            }
        }

        // 计算勋章总期望
        let huiPattern = /回帖\s+(.+?) ([+-])(\d+)/gi;
        let faPattern = /发帖\s+(.+?) ([+-])(\d+)/gi;

        let hui = "回帖期望 ";
        let fa = "发帖期望 ";
        const huiAll = getExpectation(huiPattern, hui, 'ALL');
        const faAll = getExpectation(faPattern, fa, 'ALL');

        // 计算永久勋章收益
        const huiPermanent = getExpectation(huiPattern, hui, 'Permanent');
        const faPermanent = getExpectation(faPattern, fa, 'Permanent');

        // 计算临时勋章的收益
        const huiTemporary = getExpectation(huiPattern, hui, 'Temporary');
        const faTemporary = getExpectation(faPattern, fa, 'Temporary');

        let coin = "寄售最大价格总和：" + getCoin();

        var badgeOrderElement = document.querySelector(".badge-order");
        if (badgeOrderElement) {
            const element =
                [
                    '<H3>所有勋章收益</H3>', huiAll, faAll, '<br>',
                    '<H3>常驻勋章收益</H3>', huiPermanent, faPermanent, '<br>',
                    '<H3>临时勋章收益</H3>', huiTemporary, faTemporary, '<br>',
                    coin, '<br>', txt
                ];
            badgeOrderElement.innerHTML = element.join('<p>');
        }

        showValid();

        // 计算期望
        function getExpectation(regex, title, isTemporary) {
            const result = qiwang(regex, isTemporary);
            for (let key in result) {
                title += key + ":" + result[key].toFixed(2) + "  ";
            }

            return title;
        }
    }

    // 优化过的badgeOrder
    function processBadges() {
        const myblok = document.getElementsByClassName("myblok");
        const blokDataList = [];
        const classificationResult = {};
        const categoriesMapping = {};

        // 初始化寄售总价
        let coin = 0;

        // 初始化分类结果结构
        Object.entries(linkList).forEach(([key, value]) => {
            const number = numbers[key] || '';
            const categoryKey = `${key}${number ? `(${number})` : ''}`;
            classificationResult[categoryKey] = new Set();
            categoriesMapping[value] = categoryKey;
        });
        classificationResult["其他"] = new Set();

        // 单次遍历处理所有数据
        for (const blok of myblok) {
            // 名称分类处理
            // 去空格
            const altName = blok.querySelector('img')?.getAttribute('alt').trim() || '';
            const normalizedName = altName.replace(/[·‧]/g, s =>
                s === '·' ? '‧' : '·' // 统一转换为半角符号进行匹配
            ).replace(/【不可购买】/g, ''); // 去除【不可购买】

            // 去除尾部的点or不识别的尾标识
            const normalizedNameSlice = normalizedName.slice(0, -1);

            const category = nameCategoryMap.get(normalizedName) || nameCategoryMap.get(normalizedNameSlice) || 'other';
            const displayCategory = categoriesMapping[category] || "其他";

            classificationResult[displayCategory].add(altName);
            blok.setAttribute('data-category', category);

            // 收益数据提取
            if (blok.innerText.includes("已寄售")) continue;

            const isTemporary = blok.textContent.includes('有效期');
            const probMatch = blok.innerText.match(/几率 (\d+)%/i);
            const probability = probMatch ? parseInt(probMatch[1]) / 100 : 1;

            const extractAttributes = (pattern) =>
                Array.from(blok.innerText.matchAll(pattern))
                    .map(m => ({
                        type: m[1],
                        value: (m[2] === '+' ? 1 : -1) * parseInt(m[3]) * probability
                    }));

            blokDataList.push({
                name: altName,
                isTemporary,
                hui: extractAttributes(/回帖\s+(.+?) ([+-])(\d+)/gi),
                fa: extractAttributes(/发帖\s+(.+?) ([+-])(\d+)/gi),
                // huiDuoluo: extractAttributes(/回帖\s+(堕落) ([+-])(\d+)/gi),
            });

            // 计算寄售总价
            const coinMatches = blok.innerText.match(/金币\s+(\d+)寄售/i);
            if (coinMatches) {
                coin += parseInt(coinMatches[1]);
            }

            // 显示有效时长
            if (isTemporary) {
                const timeTatches = blok.innerText.match(/\s+(.+?分)\d{1,2}秒有效期/i);
                if (timeTatches) {
                    const newP = document.createElement("p");
                    newP.textContent = timeTatches[1];
                    blok.firstElementChild.appendChild(newP);
                }
            }
        }

        return { classificationResult, blokDataList, coin };
    }

    // 优化后的收益计算函数
    function calculateExpectations(blokDataList) {
        const initStats = () => ({
            ALL: { 金币: 0, 血液: 0, 咒术: 0, 知识: 0, 旅程: 0, 堕落: 0, 灵魂: 0 },
            Permanent: { 金币: 0, 血液: 0, 咒术: 0, 知识: 0, 旅程: 0, 堕落: 0, 灵魂: 0 },
            Temporary: { 金币: 0, 血液: 0, 咒术: 0, 知识: 0, 旅程: 0, 堕落: 0, 灵魂: 0 }
        });

        const result = { hui: initStats(), fa: initStats() };

        blokDataList.forEach(({ isTemporary, hui, fa }) => {
            const types = ['ALL', isTemporary ? 'Temporary' : 'Permanent'];

            const process = (source, target) => {
                source.forEach(({ type, value }) => {
                    types.forEach(t => {
                        if (target[t][type] !== undefined) {
                            target[t][type] += value;
                        }
                    });
                });
            };

            process(hui, result.hui);
            process(fa, result.fa);
        });

        // 数据格式化
        const formatter = (obj) => Object.fromEntries(
            Object.entries(obj).map(([k, v]) => [k, Number(v.toFixed(4))])
        );

        return {
            hui: Object.fromEntries(Object.entries(result.hui).map(([k, v]) => [k, formatter(v)])),
            fa: Object.fromEntries(Object.entries(result.fa).map(([k, v]) => [k, formatter(v)]))
        };
    }

    // 显示堕落相关的勋章
    function showDuoluHui(blokDataList) {
        const increaseDuolu = []; // 存储增加堕落的物品名称
        const decreaseDuolu = []; // 存储减少堕落的物品名称

        // 遍历数组
        blokDataList.forEach(e => {
            const duolu = e.hui.find(h => h.type === '堕落'); // 查找堕落值
            if (duolu) {
                if (duolu.value > 0) {
                    increaseDuolu.push(e.name); // 增加堕落
                } else if (duolu.value < 0) {
                    decreaseDuolu.push(e.name); // 减少堕落
                }
            }
        });

        // 返回结果
        return {
            increase: increaseDuolu.join(', '),
            decrease: decreaseDuolu.join(', ')
        };
    }

    // 整合后的执行函数
    function optimizedBadgeOrder() {
        const { classificationResult, blokDataList, coin } = processBadges();
        const expectations = calculateExpectations(blokDataList);
        const duoluHui = showDuoluHui(blokDataList);

        // 分类结果格式化
        const classificationText = Object.entries(classificationResult)
            .map(([k, v]) => `${k} : (${v.size}) ${[...v].join(', ')}`)
            .join('<br>');

        // 收益结果格式化
        const formatEarnings = (type, data) =>
            Object.entries(data[type]).map(([k, v]) =>
                `${k}:${v.toFixed(2)}`
            ).join('  ');

        const badgeOrderElement = document.querySelector(".badge-order");

        if (badgeOrderElement) {
            badgeOrderElement.innerHTML = [
                '<H3>所有勋章收益</H3>',
                `回帖：${formatEarnings('ALL', expectations.hui)}`,
                `发帖：${formatEarnings('ALL', expectations.fa)}`,
                '<br>',
                '<H3>常驻勋章收益</H3>',
                `回帖：${formatEarnings('Permanent', expectations.hui)}`,
                `发帖：${formatEarnings('Permanent', expectations.fa)}`,
                '<br>',
                '<H3>临时勋章收益</H3>',
                `回帖：${formatEarnings('Temporary', expectations.hui)}`,
                `发帖：${formatEarnings('Temporary', expectations.fa)}`,
                `<div class="badge-warning"></div>`,
                '<br>',
                `寄售最大价格总和：${coin}`,
                // '<H3>分类统计</H3>',
                '<br>',
                classificationText,
                '<br>',
                '回帖增加堕落：' + duoluHui.increase,
                '回帖减少堕落：' + duoluHui.decrease,
            ].map(s => `<p>${s}</p>`).join('');
        }
    }

    // 临时方案，给真人男从全部加个'.'
    function categoriesFormat(categories) {
        const zhenren = categories.zhenren;
        const zhenrenTemporary = zhenren.map(e => e + '.');
        categories.zhenren = zhenren.concat(zhenrenTemporary);
    }

    // 计算灵魂期望并存本地
    function setlocalStoragelinghun() {
        const xunzhang = document.querySelectorAll('.my_fenlei .myblok');
        if (!xunzhang) return;

        const result = {};

        xunzhang.forEach(element => {
            const linghun = [...element.querySelectorAll('.jiage.shuxing')].find(p => p.textContent.includes('灵魂'));
            const triggerProbability = [...element.querySelectorAll('.jiage')].find(p => p.textContent.includes('触发几率'));

            if (linghun && triggerProbability) {
                const probabilityMatch = triggerProbability.textContent.match(/触发几率 (\d+)%/);
                if (probabilityMatch) {
                    const probability = parseFloat(probabilityMatch[1]) / 100; // 转换为小数
                    const countMatch = linghun.textContent.match(/发帖\s*[\u00A0]*灵魂\s*\+\s*(\d+)/);
                    const count = countMatch ? parseInt(countMatch[1], 10) : 0;

                    // 记录结果
                    if (result[probability]) {
                        result[probability] += count; // 如果已经存在，累加数量
                    } else {
                        result[probability] = count; // 否则初始化数量
                    }
                }
            }
        });

        console.log(result); // 输出结果对象
        localStorage.setItem('灵魂期望', JSON.stringify(result));
    }

    // 添加样式
    GM_addStyle(`
        #presetDialog {
            position: fixed;
            top: 50%;
            left: 50%;
            width: 30%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 20px;
            z-index: 9999;
            box-shadow: 0 0 10px rgba(0,0,0,0.2);
        }
        .dialog-close {
            position: absolute;
            right: 10px;
            top: 5px;
            cursor: pointer;
            font-size: 20px;
        }

        #presetDialog input {
            vertical-align: middle;
        }

        #presetDialog label {
            margin: 5px;
        }
    `);

    const DefaultFormat = '互赠：{missing}';
    // 在对话框HTML结构中添加格式输入框
    const dialog = document.createElement('div');
    dialog.id = 'presetDialog';
    dialog.style.display = 'none';
    dialog.innerHTML = `
        <span class="dialog-close">×</span>
        <h3 style="margin-top: 0;">预设勋章配置</h3>
        <div class="format-config">
            <p>自定义互赠格式：</p>
            <input type="text" id="formatInput" style="width: 100%; margin: 5px 0;">
            <small>可用占位符：{missing} = 互赠勋章列表</small>
        </div>
        <div id="badgeList"></div>
        <button class="save-button" style="margin-top: 15px;">保存配置</button>
    `;
    document.body.appendChild(dialog);

    // 事件绑定
    dialog.querySelector('.dialog-close').addEventListener('click', hideDialog);
    dialog.querySelector('.save-button').addEventListener('click', savePreset);

    // 显示/隐藏对话框
    function showDialog() {
        initDialog();
        dialog.style.display = 'block';
    }
    function hideDialog() {
        dialog.style.display = 'none';
    }

    // 初始化对话框内容
    function initDialog() {
        const badgeList = dialog.querySelector('#badgeList');
        const badgeNames = {
            赠礼: categoriesData.Gift,
            咒术: categoriesData.Spell,
        };

        badgeList.innerHTML = '';

        const { badges: preset, format } = getPresetConfig();

        // 遍历所有分类
        Object.entries(badgeNames).forEach(([category, names]) => {
            // 添加分类标题
            const categoryHeader = document.createElement('h4');
            categoryHeader.style.margin = '10px 0 5px';
            categoryHeader.textContent = category;
            badgeList.appendChild(categoryHeader);

            // 添加该分类下的勋章
            names.forEach(name => {
                const label = document.createElement('label');
                label.innerHTML = `
                <input type="checkbox" 
                       value="${name}" 
                       ${preset.includes(name) ? 'checked' : ''}>
                ${name}
            `;
                badgeList.appendChild(label);
            });
        });

        document.getElementById('formatInput').value = format || DefaultFormat;
    }

    // 保存时同时保存格式配置
    // 修改后的保存函数
    function savePreset() {
        const selected = Array.from(dialog.querySelectorAll('input:checked'))
            .map(checkbox => checkbox.value);
        const format = document.getElementById('formatInput').value || DefaultFormat;

        savePresetConfig(selected, format);
        hideDialog();
        checkPreset();
    }

    // 检查预设内容
    function checkPreset() {
        const { badges: preset, format } = getPresetConfig();
        const currentBadges = Array.from(document.getElementsByClassName("myblok"))
            .map(blok => blok.querySelector('img[alt]').getAttribute('alt'));

        const missing = preset.filter(name => !currentBadges.includes(name));
        const existingWarning = document.getElementById('presetWarning');

        if (existingWarning) existingWarning.remove();

        const warning = document.createElement('div');
        warning.id = 'presetWarning';
        warning.innerHTML = `
            <p style="${missing.length > 0 ? 'color: red;' : 'color: green;'} ">
                缺少预设勋章：${missing.length > 0 ? missing.join(', ') : '无'}
                ${missing.length > 0 ? '<a class="copy-button" style="margin-left: 10px; cursor: pointer;">点击一键复制勋章互赠（已过滤不能互赠的勋章）</a>' : ''}
            </p>
        `;
        warning.querySelector('.copy-button')?.addEventListener('click', copyMissing);
        document.querySelector('.badge-warning').appendChild(warning);
    };

    // 复制缺失内容
    function copyMissing() {
        const { badges: preset, format } = getPresetConfig();

        const currentBadges = Array.from(document.getElementsByClassName("myblok"))
            .map(blok => blok.querySelector('img[alt]').getAttribute('alt'));

        // 双重过滤条件：不在当前勋章列表 且 属于可赠送类型
        const missing = preset.filter(name =>
            !currentBadges.includes(name) &&
            GiftableBadges.includes(name)
        );

        // 替换模板中的占位符
        const text = format
            .replace(/{missing}/g, missing.join(', '));
        // .replace(/{count}/g, missing.length) // 可扩展其他占位符


        if (missing.length === 0) {
            alert('没有可赠送的勋章');
            return;
        } else {
            navigator.clipboard.writeText(text)
                .then(() => alert('需要互赠的勋章已复制'))
                .catch(err => console.error('复制失败:', err));
        }

    }

    // 初始化脚本
    checkPreset();

    // 获取预设项的兼容方法
    function getPresetConfig() {
        const rawData = localStorage.getItem('预设项');
        let badges = [];
        let format = DefaultFormat;

        try {
            // 解析旧版数组格式
            if (rawData?.startsWith('[')) {
                badges = JSON.parse(rawData);
                // 自动迁移到新版格式
                savePresetConfig(badges, format);
            } else {
                // 解析新版对象格式
                const config = JSON.parse(rawData || '{}');
                badges = config.badges || [];
                format = config.format || format;
            }
        } catch (e) {
            console.error('解析预设项失败', e);
        }

        return { badges, format };
    }

    // 保存时统一使用新格式
    function savePresetConfig(badges, format) {
        localStorage.setItem('预设项', JSON.stringify({
            badges,
            format
        }));
    }

    // 自动开启茉香啤酒
    function 自动开启茉香啤酒() {
        const { key, lv } = findMedal('茉香啤酒');
        if (key && lv === '1') {
            const data = {
                formhash,
                action: 'UPLV',
                jishoujiage: '',
                userMedalid: key
            };

            const formData = objectToFormData(data);
            const url = 'https://www.gamemale.com/plugin.php?id=wodexunzhang:showxunzhang';

            fetch(url, {
                method: 'POST',
                body: formData,
            });
        }
    }

    // 展示勋章
    function showTopMedal() {
        function calculateMedals(level) {
            const medals = [1, 6, 6, 6, 7, 7, 8, 8, 9, 9, 10];
            return level >= 1 ? medals[Math.min(level, 10)] : 1;
        }

        function getLevel(jifen) {
            const levelThresholds = [3, 10, 35, 70, 120, 200, 300, 450, 650, 900];
            for (let i = levelThresholds.length - 1; i >= 0; i--) {
                if (jifen >= levelThresholds[i]) return i + 1; // 返回对应等级
            }
            return 0; // 积分小于最低等级返回 0
        }
        const jifen = document.querySelector("#extcreditmenu + span").textContent;
        const level = getLevel(Number(jifen));
        const showNum = calculateMedals(level);


        const myblok = document.getElementsByClassName("myblok");
        function filterDiv(div, index) {
            const input = div.querySelector('input');
            return input && input.checked;
        }

        const container = document.createElement('div');
        container.classList.add('TopMedal-container');

        [...myblok]
            .filter(filterDiv)
            .slice(0, showNum)
            .forEach(e => {
                const newImg = document.createElement('img');
                const src = e.querySelector('img').getAttribute('src');
                const alt = e.querySelector('img').getAttribute('alt');
                newImg.setAttribute('src', src);
                newImg.setAttribute('alt', alt);

                if (e.querySelector('img').onmouseover) {
                    newImg.onmouseover = e.querySelector('img').onmouseover;
                }

                const key = e.getAttribute('key');
                newImg.setAttribute('key', key);
                container.appendChild(newImg);
            });


        const targetElement = document.querySelector('.appl');
        const existingContainer = document.querySelector('.appl .TopMedal-container');

        if (!existingContainer) {
            targetElement.appendChild(container);
        } else {
            targetElement.replaceChild(container, existingContainer);
        }

        TopMedalDomSticky();
        window.removeEventListener('scroll', TopMedalDomSticky);
        window.addEventListener('scroll', TopMedalDomSticky);
    }

    function TopMedalDomSticky() {
        const TopMedalContainer = document.querySelector('.appl .TopMedal-container');
        const tbnBottom = document.querySelector('.appl .tbn').getBoundingClientRect().bottom;
        TopMedalContainer.classList.toggle('TopMedal-container__Fixed', tbnBottom < 40);
    }

    function observeElement() {
        const observer = new MutationObserver(showTopMedal);
        const myElement = document.querySelector("#medalid_f > div.my_fenlei > div.myfldiv.clearfix.ui-sortable");

        const config = {
            childList: true, // 观察直接子节点的变化
        };

        observer.observe(myElement, config);

        myElement.addEventListener('change', event => {
            if (event.target.tagName === 'INPUT' && event.target.type === 'checkbox') {
                showTopMedal();
            }
        });
    }

    // 记录展示勋章成功
    function saveTopMedal() {
        const div = document.querySelectorAll('.TopMedal-container img');
        const divName = [...div].map(e => e.getAttribute('alt'));
        saveArrayToLocalStorage('TopMedal', divName);
        alert('记录展示勋章成功');
    }

    // 置顶展示勋章
    function loadTopMedal() {
        const TopMedal = getArrayFromLocalStorage('TopMedal');
        const TopMedalKey = NameToKey(TopMedal);

        const myblok = document.getElementsByClassName("myblok");
        const keyBlok = [...myblok].map(e => e.getAttribute('key'));
        const array = mergeArrays(TopMedalKey, keyBlok);
        postNewOrder(array);
    }

    /* =========================================工具函数区域============================================================ */

    /**
     * 将普通对象转换为 FormData 对象
     * @param {Object} obj - 要转换的对象
     * @returns {FormData} - 转换后的 FormData 对象
     */
    function objectToFormData(obj) {
        const formData = new FormData();
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                formData.append(key, obj[key]);
            }
        }
        return formData;
    }

    /**
     * 查找包含指定名称的 "myblok" 元素，并返回相关信息。
     *
     * @param {string} name - 要查找的名称字符串。函数会在 "myblok" 类的元素中搜索该名称。
     * @returns {Object|null} 如果找到对应的元素，返回一个对象，包括：
     *   - {HTMLElement} div - 找到的包含名称的 HTML 元素。
     *   - {string} name - 传入的名称参数。
     *   - {string} key - 勋章的key
     *   - {string} kind - 勋章的类型
     *   如果未找到匹配的元素，则返回 null。
     */
    function findMedal(name) {
        const myblok = document.getElementsByClassName("myblok");
        const div = [...myblok].find(e => e.textContent.includes(name));

        if (div) {
            // const name = div.querySelector('img').alt
            const key = div.getAttribute('key');
            const categories = div.getAttribute('categories');
            const lv = getLv(div);
            const checked = div.querySelector('input').checked;

            return { div, name, key, categories, lv, checked };
        }

        function getLv(div) {
            const textContent = div.querySelector('.mingcheng').textContent;
            const match = textContent.match(/等级\s+(\w+)/);
            if (match && match[1]) {
                return match[1];
            } else {
                return {};
            }
        }
    }

    /**
     * 合并两个数组，重复项只保留第一次出现的元素。
     * @param {Array} arr1 - 第一个待合并的数组。
     * @param {Array} arr2 - 第二个待合并的数组。
     * @returns {Array} - 合并后的数组，包含唯一元素。
     */
    function mergeArrays(arr1, arr2) {
        const seen = new Set();
        const result = [];

        function addUniqueElements(arr) {
            for (const item of arr) {
                if (!seen.has(item)) {
                    seen.add(item);
                    result.push(item);
                }
            }
        }

        addUniqueElements(arr1);
        addUniqueElements(arr2);

        return result;
    }
})();
