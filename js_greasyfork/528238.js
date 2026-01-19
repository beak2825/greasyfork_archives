// ==UserScript==
// @name         snooker.org ZHCN
// @version      2.0.26
// @description  Basic Chinese UI for snooker.org
// @author       Nan Zhu
// @include      *://*snooker.org/*
// @exclude      *://*nd.snooker.org/*
// @exclude      *://*m.snooker.org/*
// @namespace https://greasyfork.org/users/28418
// @downloadURL https://update.greasyfork.org/scripts/528238/snookerorg%20ZHCN.user.js
// @updateURL https://update.greasyfork.org/scripts/528238/snookerorg%20ZHCN.meta.js
// ==/UserScript==

// 主映射表

const playerMap = {
  81: "张安达",
  2634: "巩晨智",
  24: "肖国栋",
  1383: "贺国强",
  2608: "马海龙",
  905: "吕昊天",
  2611: "刘宏宇",
  1149: "黄佳浩",
  1982: "斯佳辉",
  2640: "江俊",
  224: "丁俊晖",
  1257: "庞俊旭",
  2498: "雷佩凡",
  218: "田鹏飞",
  1407: "徐思",
  1108: "袁思俊",
  2469: "吴宜泽",
  906: "周跃龙",
  2616: "白雨露",
  507: "曹宇鹏",
  1261: "龙泽煌",
  1417: "范争一",
  2630: "邢子豪",
  1893: "张家玮",
  4: "傅家俊",
  954: "王雨晨",
  2585: "曹金",
  4627: "邹鹏飞",
  4613: "王宇航",
  4191: "周金豪",
  946: "赵心童",
  3461: "王信伯",
  3462: "王信仲",
  4491: "郑点",
  4438: "蔡伟",
  1485: "吴安仪",
  2369: "张绮婷",
  2125: "苏文欣",
  2171: "何绮麒",
  2117: "温家琪",
  2293: "房薇薇",
  3518: "刘玉芬",
  2115: "叶蕴妍",
  4147: "陈惠淋",
  3173: "李城杰",
  2620: "彭奕淞",
  1981: "常冰玉",
  1701: "李子豪",
  581: "冯国威",
  1479: "郑宇乔",
  1090: "周汉文",
  1097: "温善文",
  3151: "刘文炜",
  2607: "高阳",
  4198: "曹泽裔",
  4199: "刘杨",
  1237: "罗弘昊",
  4710: "刘林昊",
  1379: "秦剑峰",
  4706: "徐健豪",
  2610: "梁小龙",
  959: "陈睿夫",
  4163: "冼子亨",
  4718: "陈麒恩",
  1979: "邓锦鸿",
  2379: "罗泽涛",
  1974: "张智杰",
  4715: "徐嘉锐",
  4711: "姚东成",
  1231: "赵翰洋",
  1410: "冯煜",
  4127: "白亚茹",
  4724: "苏小茗",
  4725: "邱雪梅",
  4142: "萧咏雯",
  4137: "刘子铃",
  4728: "林臻苗",
  4729: "王若桐",
  4144: "杨蒙",
  4732: "王思哲",
  4132: "韩芳",
  4136: "刘韦壹路",
  4734: "吴瑞兰",
  4130: "邓新顺",
  4138: "莫甜甜",
  4135: "李碧涵",
  4738: "赵露",
  4739: "刘安妮",
  2826: "史琳睿",
  4143: "夏雨滢",
  2170: "朱佩莹",
  4133: "何丹妮",
  4737: "李恩妙儿",
  4726: "韦覃琳",
  4727: "余秋月",
  4731: "杨娇",
  4735: "王翊桐",
  4730: "黄蘅",
  2597: "吴雪君",
  4733: "林希",
  4736: "楚伟佳",
  4148: "蓝裕豪",
  1160: "姚朋成",
  2103: "许医尘",
  123: "李俊威",
  1260: "颜丙涛",
  2134: "张健康",
  295: "李行",
  1595: "白朗宁",
  908: "鲁宁",
  200: "梁文博",
  933: "陈子凡",
  2557: "赵剑波",
  306: "梅希文",
  910: "陈飞龙",
  947: "张永",
  958: "李远",
  1101: "牛壮",
  2644: "黄浩",
  4403: "马少君",
  4316: "邱磊",
  4815: "富京",
  4833: "韩富源",
  4857: "唐和文",
  4858: "张浩",
  1697: "唐立",
  4937: "张啸",
  3199: "廖予生",
  3745: "娄明*",
  3143: "王均晋",
  5006: "龚钲皓",
  5007: "彭家朗",
  5005: "彭启南"
};

const playerMapB = {
  2470: "亚伦·希尔",
  239: "亚历山大·乌尔森巴赫",
  158: "艾利·卡特",
  26: "阿伦·泰勒",
  1350: "阿米尔·萨科什",
  22: "安东尼·麦吉尔",
  1465: "安托尼·科瓦尔斯基",
  3534: "阿特米耶斯·齐津斯",
  16: "巴里·霍金斯",
  1923: "本·默滕斯",
  19: "本·伍拉斯顿",
  2655: "布尔丘·雷维斯",
  2887: "恰查蓬·纳萨",
  1186: "克里斯·托顿",
  1044: "克里斯·韦克林",
  2746: "康纳·本齐",
  32: "丹尼尔·威尔斯",
  118: "大卫·吉尔伯特",
  67: "大卫·格雷斯",
  998: "大卫·利利",
  448: "杜安·琼斯",
  2320: "迪伦·埃默里",
  608 : "艾略特·斯莱瑟",
  163: "法拉赫·阿贾伊布",
  2317: "费格尔·奎因",
  1835: "弗洛里安·努斯勒",
  546: "加里·威尔逊",
  52: "格雷姆·多特",
  2931: "哈里斯·塔希尔",
  1764: "哈特姆·亚森",
  2061: "海顿·平希",
  666: "侯赛因·瓦菲",
  87: "伊恩·伯恩斯",
  2066: "辛格·查达",
  1889: "尤利安·博伊科",
  85: "杰克·利索夫斯基",
  2166: "杰克逊·佩奇",
  90: "杰克·琼斯",
  10: "杰米·琼斯",
  93: "吉米·罗伯逊",
  20: "吉米·怀特",
  1038: "乔·奥康纳",
  237: "约翰·希金斯",
  4153: "乔纳斯·鲁兹",
  58: "乔丹·布朗",
  12: "贾德·特朗普",
  2754: "朱利安·勒克莱尔",
  170: "肯·达赫迪",
  2497: "克里什·古尔巴克萨尼",
  39: "凯伦·威尔逊",
  2888: "利昂·克劳利",
  2438: "利亚姆·戴维斯",
  2439: "利亚姆·格雷厄姆",
  45: "利亚姆·海菲尔德",
  2778: "利亚姆·普伦",
  2911: "林谷良",
  1045: "路易斯·希思科特",
  101: "卢卡·布雷塞尔",
  202: "马克·艾伦",
  15: "马克·戴维斯",
  1: "马克·威廉姆斯",
  17: "马克·塞尔比",
  120: "马丁·奥唐纳",
  680: "马特乌什·巴拉诺夫斯基",
  47: "马修·塞尔特",
  9: "马修·史蒂文斯",
  125: "迈克尔·霍尔特",
  3192: "米哈尔·苏巴奇克",
  1829: "努查鲁·旺哈鲁泰",
  49: "米切尔·曼",
  418: "穆罕默德·谢哈布",
  154: "尼尔·罗伯逊",
  208: "诺蓬·桑坎",
  146: "奥利弗·布朗",
  592: "奥利弗·莱恩斯",
  175: "瑞安·埃文斯",
  62: "里奇·沃顿",
  2507: "罗比·麦奎根",
  96: "罗比·威廉姆斯",
  92: "罗伯特·米尔金斯",
  5: "罗尼·奥沙利文",
  898: "罗斯·缪尔",
  68: "瑞恩·戴",
  3832: "萨希尔·纳亚尔",
  109: "山姆·克雷吉",
  621: "林杉峰",
  894: "斯科特·唐纳森",
  97: "肖恩·墨菲",
  2758: "斯坦·穆迪",
  2: "斯蒂芬·马奎尔",
  605: "斯蒂芬·霍尔沃斯",
  30: "斯图尔特·宾汉姆",
  1763: "阿卡尼·宋沙瓦",
  217: "塔猜亚·乌诺",
  8: "汤姆·福特",
  89: "扎克·舒尔蒂",
  3071: "马哈茂德·埃尔·哈雷迪"
};

const playerMapC = {
  1828: "斯利帕蓬·努安塔卡姆詹",
  2121: "瑞贝卡·肯娜",
  3085: "阿努帕玛·拉马钱德兰",
  2788: "玛丽·塔尔博特",
  2824: "泰莎·戴维森",
  2172: "阿米·卡玛尼",
  4139: "纳瑞查·菲弗",
  3088: "纳查图雅·巴雅尔赛罕",
  2793: "杰米·亨特",
  2132: "杰西卡·伍兹",
  2533: "潘查亚·查诺",
  4623: "卡米拉·霍贾耶娃",
  236: "温迪·詹斯",
  2799: "索菲·尼克斯",
  3081: "娜塔莎·切坦",
  2601: "莉莉·梅尔德鲁姆",
  2596: "乔伊·托梅",
  3176: "莫利纳·奥尔蒂斯",
  2990: "弗朗西丝·曹*",
  4751: "纳查林·松帕拉瑟",
  4752: "纳查莉亚·松帕拉瑟",
  4745: "帕瓦兰·孔凯",
  2411: "波洛琼普·拉奥基亚特蓬",
  2148: "蔡志蔚",
  4740: "卓凤丽",
  4743: "蔡佩芬",
  2549: "谷美奈*",
  2181: "陈美燕"
};

const playerMapD = {
  1509: "涂振龙",
  25: "安德鲁·西金森",
  21: "阿尔菲·伯登",
  2346: "艾哈迈德·埃尔赛义德",
  65: "安德鲁·佩吉特",
  724: "阿什利·卡蒂",
  115: "安东尼·汉密尔顿",
  2499: "迪恩·杨",
  33: "多米尼克·戴尔",
  593: "哈马德·米亚",
  106: "杰米·克拉克",
  168: "乔·佩里",
  1991: "马纳萨温·佩马莱库",
  27: "马丁·古尔德",
  1844: "穆斯塔法·多尔加姆",
  128: "斯图尔特·卡灵顿",
  2749: "保罗·迪维尔",
  2055: "约书亚·托蒙德",
  2049: "西蒙·布莱克威尔",
  2010: "丹尼尔·沃默斯利",
  48: "马克·乔伊斯",
  2249: "乌穆特·迪克梅",
  1812: "帕特里克·惠兰",
  1323: "阿什利·休吉尔",
  2378: "瑞安·戴维斯",
  2595: "马克·劳埃德",
  2803: "阿尔菲·戴维斯",
  2275: "哈利姆·侯赛因",
  131: "克雷格·斯特德曼",
  2722: "亚历克斯·克伦肖",
  613: "杰克·布拉德福德",
  2483: "凯登·布里尔利",
  733: "乔治·普拉格内尔",
  151: "詹姆斯·卡希尔",
  526: "约翰·阿斯特利",
  1201: "扎克·理查森",
  225: "加里·汤姆森",
  497: "迈克尔·乔治乌",
  892: "达里尔·希尔",
  2805: "扎克·科斯克",
  3525: "亚历山大·维达乌",
  2095: "索拉夫·科塔里",
  977: "卡马尔·乔拉",
  4031: "阿里·加拉贾扎尔",
  1188: "穆罕默德·阿西夫",
  157: "阿里·阿尔·奥拜德利",
  3196: "塞巴斯蒂安·米莱夫斯基",
  3803: "希沙姆·肖基",
  2797: "奥利弗·赛克斯",
  2755: "艾丹·墨菲",
  3982: "凯兰·帕特尔",
  4643: "伊森·卢埃林"
};

const tournamentNameGroup = {
  "英国公开赛": [2182, 1834, 1444],
  "英国公开赛资格赛": [1938, 2376, 1470],
  "冠中冠": [2287, 1935, 1447],
  "冠军联赛（排名赛）": [2337, 1941, 1461],
  "冠军联赛 - 冠军组": [2372, 2108, 1481],
  "冠军联赛 - 第1组": [2368, 2109, 1482],
  "冠军联赛 - 第2组": [2369, 2110, 1483],
  "冠军联赛 - 第3组": [2370, 2111, 1484],
  "冠军联赛 - 第4组": [2371, 2112, 1485],
  "冠军联赛 - 第5组": [2373, 2113, 1486],
  "冠军联赛 - 第6组": [2374, 2114, 1487],
  "冠军联赛 - 第7组": [2375, 2115, 1488],
  "英格兰公开赛": [2181, 1833, 1449],
  "英格兰公开赛资格赛": [2341, 1936, 1471],
  "欧洲大师赛": [1448],
  "欧洲大师赛资格赛": [1469],
  "德国大师赛": [2346, 1838, 1455],
  "德国大师赛资格赛": [2347, 1933, 1477],
  "国际锦标赛": [2342, 1846, 1468],
  "国际锦标赛资格赛": [2344, 1845, 1473],
  "大师赛": [2185, 1760, 1454],
  "北爱尔兰公开赛": [2183, 1835, 1450],
  "北爱尔兰公开赛资格赛": [2340, 1939, 1474],
  "球员锦标赛": [2422, 1848, 1446],
  "亚太区Q School 1": [2282, 1921],
  "亚太区Q School 2": [2283, 1948],
  "国际区Q School 1": [2284, 1932],
  "国际区Q School 2": [2285, 1945],
  "沙特大师赛": [2350, 1839],
  "苏格兰公开赛": [2215, 1836, 1453],
  "苏格兰公开赛资格赛": [2345, 1940, 1475],
  "上海大师赛": [2336, 1847, 1466],
  "单局限时赛": [2310, 1943, 1452],
  "利亚德锦标赛": [2544, 2107],
  "利亚德世界大师赛": [1761],
  "巡回锦标赛": [2311, 1946, 1459],
  "英国锦标赛": [2184, 1837, 1451],
  "英国锦标赛资格赛": [2423, 1934, 1476],
  "威尔士公开赛": [2205, 1992, 1456],
  "威尔士公开赛资格赛": [2348, 2041, 1478],
  "世界锦标赛": [1942, 1460, 2214],
  "世界锦标赛资格赛": [2334, 2042, 1480],
  "世界大奖赛": [2349, 2104, 1445],
  "世界混合双打锦标赛": [1458],
  "世界公开赛": [2351, 1842, 1560],
  "世界公开赛资格赛": [2352, 1843, 1646],
  "武汉公开赛": [2333, 1840, 1467],
  "武汉公开赛资格赛": [2335, 1841, 1472],
  "西安大奖赛": [2338, 1832],
  "西安大奖赛资格赛": [2339, 1844],
  "女子阿尔巴尼亚公开赛": [1621],
  "女子美国公开赛": [2018, 1462],
  "女子爱尔兰公开赛": [2420],
  "女子澳大利亚公开赛": [2203, 2019, 1464],
  "女子大师赛": [2099, 1465],
  "女子泰国公开赛": [2496],
  "女子比利时公开赛": [2470, 2100, 1748],
  "女子英国公开赛": [2497, 2102, 1749],
  "女子英国锦标赛": [2020, 2419, 1463],
  "女子世界锦标赛": [1742, 2204],
  "WSF青年锦标赛": [2550, 2093, 1814],
  "WSF女子锦标赛": [2551, 2126],
  "WSF锦标赛": [2549, 2086, 1770],
  "元老世界锦标赛": [2469, 2288, 1947],
  "元老英国公开赛": [2468],
  "美洲区Q Tour 1": [2447, 2009, 1757],
  "美洲区Q Tour 2": [2459, 2074, 1758],
  "美洲区Q Tour 3": [2460, 2075],
  "美洲区Q Tour 4": [2552],
  "亚太区Q Tour 1": [2431, 2004, 1606],
  "亚太区Q Tour 2": [2432, 2005, 1568],
  "亚太区Q Tour 3": [2456, 2006, 1769],
  "亚太区Q Tour 4": [2457, 2007],
  "亚太区Q Tour 5": [2458, 2008],
  "中东区Q Tour 1": [2494, 1949, 1638],
  "中东区Q Tour 2": [2495, 1993, 1639],
  "中东区Q Tour 3": [2575, 2125, 1640],
  "中东区Q Tour 4": [2576],  
  "国际区Q Tour 1": [2424, 2043, 1549],
  "国际区Q Tour 2": [2425, 2044, 1550],
  "国际区Q Tour 3": [2426, 2045, 1551],
  "国际区Q Tour 4": [2427, 2046, 1552],
  "国际区Q Tour 5": [2428, 2047, 1553],
  "国际区Q Tour 6": [2429, 2048, 1554],
  "国际区Q Tour 7": [2430, 2049, 1555],
  "Q Tour全球附加赛": [2573, 2180, 1747],
  "EBSA欧洲U-21锦标赛": [2207, 1850],
  "EBSA欧洲锦标赛": [2206, 1849],
  "亚太公开赛": [2297],
  "世界运动会斯诺克比赛": [1290, 662],
  "世界运动会斯诺克比赛（男子）": [2421],
  "世界运动会斯诺克比赛（女子6红球）": [2461],
  "泛美公开赛": [2286],
  "赫尔辛基国际杯": [2050, 1620],
  "澳门大师赛（新濠）": [1651],
  "澳门大师赛（永利）": [1548]
};

const tournamentName = {};
for (const [name, ids] of Object.entries(tournamentNameGroup)) {
  ids.forEach(id => {
    tournamentName[id] = name;
  });
}

const roundInfo = {
  "Winner:": "冠军：",
  "Runner-up:": "亚军：",
  "Losers receive ": "本轮出局：",
  "Last ": "前",
  " pts": "排名积分",
  "Best of 3": "3局2胜",
  "Best of 5": "5局3胜",
  "Best of 7": "7局4胜",
  "Best of 9": "9局5胜",
  "Best of 11": "11局6胜",
  "Best of 13": "13局7胜",
  "Best of 15": "15局8胜",
  "Best of 17": "17局9胜",
  "Best of 19": "19局10胜",
  "Best of 21": "21局11胜",
  "Best of 25": "25局13胜",
  "Best of 33": "33局17胜",
  "Best of 35": "35局18胜"
};


function buildLinkTranslations(map) {
  return Object.entries(map).map(([id, name]) => ({
    pattern: new RegExp(`/res/index\\.asp\\?player=${id}(?!\\d).*`),
    text: name,
    title: ""
  }));
}

let linkTranslations = [];

function loadTranslationSetting() {
  const useMain = localStorage.getItem('useMainPlayerMap') !== 'false';
  const useB = localStorage.getItem('usePlayerMapB') === 'true';
 const useC = localStorage.getItem('usePlayerMapC') === 'true';
const useD = localStorage.getItem('usePlayerMapD') === 'true';
  const useCountry = localStorage.getItem('useCountryTranslation') !== 'false';
const useExtra = localStorage.getItem('useExtraLabelTranslation') !== 'false'; // 新增

  const playerMapCombined = {
    ...(useMain ? playerMap : {}),
    ...(useB ? playerMapB : {}),
   ...(useC ? playerMapC : {}),
   ...(useD ? playerMapD : {})
  };
  linkTranslations = buildLinkTranslations(playerMapCombined);
  return { useMain, useB, useC, useD, useCountry, useExtra }; // 新增返回
  //return { useMain, useB, useC, useD, useCountry };
}

function saveTranslationSetting(key, value) {
  localStorage.setItem(key, value);
}

function resetTranslationSettings() {
  localStorage.removeItem('useMainPlayerMap');
  localStorage.removeItem('usePlayerMapB');
 localStorage.removeItem('usePlayerMapC');
  localStorage.removeItem('usePlayerMapD');
  localStorage.removeItem('useCountryTranslation');
localStorage.removeItem('useExtraLabelTranslation'); // 新增
  location.reload();
}

function createToggle() {
  const containerWrapper = document.createElement('div');
  const container = document.createElement('div');
  container.style.display = localStorage.getItem('translationPanelVisible') === 'false' ? 'none' : 'block';
  container.style.position = 'fixed';
  container.style.top = '10px';
  container.style.right = '10px';
  container.style.zIndex = '9999';
  container.style.background = '#eee';
  container.style.padding = '10px';
  container.style.borderRadius = '6px';
  container.style.fontSize = '14px';
  container.style.lineHeight = '1.8em';
  container.style.boxShadow = '0 0 5px rgba(0,0,0,0.2)';

  const settings = loadTranslationSetting();

  const toggles = [
    { label: '基础界面', key: 'useExtraLabelTranslation', checked: settings.useExtra },
	{ label: '中国球员', key: 'useMainPlayerMap', checked: settings.useMain },
    { label: 'WST职业球员', key: 'usePlayerMapB', checked: settings.useB },
    { label: 'WWS女子球员', key: 'usePlayerMapC', checked: settings.useC },
   { label: '其他球员', key: 'usePlayerMapD', checked: settings.useD },
    { label: '国家/地区名', key: 'useCountryTranslation', checked: settings.useCountry }
  ];

  toggles.forEach(({ label, key, checked }) => {
    const labelElem = document.createElement('label');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = checked;
    checkbox.style.marginRight = '6px';
    checkbox.addEventListener('change', () => {
      saveTranslationSetting(key, checkbox.checked);
      location.reload();
    });
    labelElem.appendChild(checkbox);
    labelElem.appendChild(document.createTextNode(label));
    container.appendChild(labelElem);
    container.appendChild(document.createElement('br'));
  });

  const helpLinks = document.createElement('div');
//  helpLinks.innerHTML = '<a href="https://snk.nanzhu.me/help.html" target="_blank">更新说明</a> | <a href="https://snk.nanzhu.me/help.html" target="_blank">使用方法</a>';
  helpLinks.innerHTML = '<a href="https://snk.nanzhu.me/help.html" target="_blank">使用说明</a>';
  helpLinks.style.marginTop = '2px';
  helpLinks.style.marginBottom = '2px';
      helpLinks.style.marginLeft = '15px';
  helpLinks.style.fontSize = '13px';
  container.appendChild(helpLinks);

  const resetBtn = document.createElement('button');
  resetBtn.textContent = '恢复默认';
  resetBtn.style.marginTop = '8px';
  resetBtn.style.padding = '4px 8px';
  resetBtn.style.fontSize = '13px';
  resetBtn.addEventListener('click', resetTranslationSettings);
  container.appendChild(resetBtn);

  document.body.appendChild(container);
    // 创建显示按钮
  const toggleBtn = document.createElement('div');
  toggleBtn.innerHTML = '⚙设置';
  toggleBtn.title = '显示翻译选项';
  toggleBtn.style.position = 'fixed';
  toggleBtn.style.top = '10px';
  toggleBtn.style.right = '10px';
  toggleBtn.style.zIndex = '9998';
  toggleBtn.style.background = '#ddd';
  toggleBtn.style.padding = '4px 8px';
  toggleBtn.style.borderRadius = '4px';
  toggleBtn.style.cursor = 'pointer';
  toggleBtn.style.display = localStorage.getItem('translationPanelVisible') === 'false' ? 'block' : 'none';

  toggleBtn.addEventListener('click', () => {
    container.style.display = 'block';
    toggleBtn.style.display = 'none';
    localStorage.setItem('translationPanelVisible', 'true');
  });

  const hideBtn = document.createElement('button');
  hideBtn.textContent = '隐藏';
  hideBtn.style.marginTop = '8px';
  hideBtn.style.marginLeft = '6px';
  hideBtn.style.padding = '4px 8px';
  hideBtn.style.fontSize = '13px';
  hideBtn.addEventListener('click', () => {
    container.style.display = 'none';
    toggleBtn.style.display = 'block';
    localStorage.setItem('translationPanelVisible', 'false');
  });
  container.appendChild(hideBtn);

  containerWrapper.appendChild(container);
  containerWrapper.appendChild(toggleBtn);
  document.body.appendChild(containerWrapper);
}

const translations = {
//  "Main": "职业",  "Women": "女子",  "Other": "其他",  "Ranking": "排名",  "Invitational": "邀请",  "Qualifying": "资格",
  "China": "中国",
  "England": "英格兰",
  "Wales": "威尔士",
  "Scotland": "苏格兰",
  "Northern Ireland": "北爱尔兰",
  "Ireland": "爱尔兰",
  "Hong Kong": "中国香港",
  "Taiwan": "中华台北",
  "India": "印度",
  "Australia": "澳大利亚",
  "Belgium": "比利时",
  "Brazil": "巴西",
  "Egypt": "埃及",
  "Hungary": "匈牙利",
  "Iran": "伊朗",
  "Latvia": "拉脱维亚",
  "Malaysia": "马来西亚",
  "Pakistan": "巴基斯坦",
  "Poland": "波兰",
  "Switzerland": "瑞士",
  "Thailand": "泰国",
  "United Arab Emirates": "阿联酋",
  "United States": "美国",
  "UAE": "阿联酋",
  "USA": "美国",
  "Austria": "奥地利",
  "Bahrain": "巴林",
  "Estonia": "爱沙尼亚",
  "Germany": "德国",
  "Iraq": "伊拉克",
  "Jamaica": "牙买加",
  "Moldova": "摩尔多瓦",
  "Oman": "阿曼",
  "Saudi Arabia": "沙特阿拉伯",
  "Ukraine": "乌克兰",
  "Canada": "加拿大",
  "Japan": "日本",
  "Mongolia": "蒙古",
  "Morocco": "摩洛哥",
  "Netherlands": "荷兰",
  "New Zealand": "新西兰",
  "Russia": "俄罗斯",
  "Singapore": "新加坡",
  "South Korea": "韩国",
  "Guernsey": "根西岛",
  "N.Ireland": "北爱尔兰",
  "Armenia": "亚美尼亚",
  "Bulgaria": "保加利亚",
  "Finland": "芬兰",
  "France": "法国",
  "Libya": "利比亚",
  "Lithuania": "立陶宛",
  "Malta": "马耳他",
  "Nepal": "尼泊尔",
  "Portugal": "葡萄牙",
  "Romania": "罗马尼亚",
  "Spain": "西班牙",
  "Sweden": "瑞典",
  "Cambodia": "柬埔寨",
  "Turkey": "土耳其",
  "Jersey": "泽西岛",
  "Israel": "以色列",
  "Norway": "挪威",
  "Cyprus": "塞浦路斯",
  "Bosnia and Herzegovina": "波黑",
  "South Africa": "南非",
  "Isle of Man": "马恩岛",
  "United Kingdom": "英国",
  "Great Britain": "英国",
  "Qatar": "卡塔尔",
  "Albania": "阿尔巴尼亚"
};

let nationalityTranslations = {};
const countrySetting = loadTranslationSetting().useCountry;
if (countrySetting) nationalityTranslations = { ...translations };

function translateNationalityImages() {
  if (!countrySetting) return;
  document.querySelectorAll("img").forEach(img => {
    if (img.alt && nationalityTranslations[img.alt]) img.alt = nationalityTranslations[img.alt];
    if (img.title && nationalityTranslations[img.title]) img.title = nationalityTranslations[img.title];
  });
}

function translateLinks() {
  document.querySelectorAll("a[href]").forEach(link => {
    const url = link.getAttribute("href");
    linkTranslations.forEach(({ pattern, text }) => {
      if (pattern.test(url)) {
        link.textContent = text;
      }
    });
  });
}

function translateDraw() {
  document.querySelectorAll("a[href]").forEach(link => {
    if (link.textContent.trim() === "Draw") {
      link.textContent = "比赛签表";
    }
  });
}

function translateTemplateLinks() {
  const replacements = new Map([
    ["21", "比分直播"], ["22", "比赛结果"], ["24", "未来比赛"], ["2", "赛季日历"],
    ["65", "可视化对阵表"], ["44", "参赛球员"], ["31", "世界排名"], ["32", "种子顺序"],
    ["35", "临时世界排名"], ["33", "单赛季排名"], ["34", "临时单赛季排名"],
    ["63", "英锦赛种子"], ["64", "大师赛资格名单"], ["43", "大奖赛资格名单"],
    ["47", "球员锦标赛资格名单"], ["51", "巡回锦标赛资格名单"], ["48", "世锦赛种子"],
    ["52", "Q Tour排名"], ["46", "Q School积分排名"], ["7", "各站决赛列表"],
    ["25", "各节点历史排名"], ["61", "女子巡回赛排名"], ["38", "职业选手名单"], ["36", "临时种子顺序"],
    ["42", "赛季末排名"], ["60", "场次列表"], ["45", "时段安排"]
  ]);

  document.querySelectorAll("a[href]").forEach(link => {
    const text = link.textContent.trim();
    if (/^\d{1,6}$/.test(text)) return;

    const href = link.getAttribute("href") || "";
    for (const [key, label] of replacements) {
      const pattern = `res/index.asp?template=${key}`;
      const index = href.indexOf(pattern);
      if (index !== -1 && !/^\d/.test(href.charAt(index + pattern.length))) {
        link.textContent = label;
        break;
      }
    }
  });
}



function translateRoundLabels() {
  const roundMap = {
    "Qual Round 1": "资格赛第1轮",
    "Qual Round 2": "资格赛第2轮",
    "Qual Round 3": "资格赛第3轮",
    "Qual Round 4": "资格赛第4轮",
    "Qual Round 5": "资格赛第5轮",
    "Round 1": "第1轮",
    "Round 2": "第2轮",
    "Round 3": "第3轮",
    "Round 4": "第4轮",
    "Round 5": "第5轮",
    "Round 6": "第6轮",
    "Group": "小组循环赛",
    "QF": "1/4决赛",
    "SF": "半决赛",
    "Quarterfinals": "1/4决赛",
    "Semifinals": "半决赛",
    "3rd/4th Playoff": "3/4名决赛",
    "Final": "决赛"
  };

  const roundMapLink2 = {
    "#r1": "资1轮",
    "#r2": "资2轮",
    "#r3": "资3轮",
    "#r4": "资4轮",
    "#r7": "第1轮",
    "#r8": "第2轮",
    "#r9": "第3轮",
    "#r10": "第4轮",
    "#r11": "第5轮",
    "#r12": "第6轮",
    "#r18": "3/4名",
	"#r19": "小组赛"
  };

  document.querySelectorAll('.round').forEach(el => {
    // 替换纯文本部分
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const node = walker.currentNode;
      const trimmed = node.textContent.trim();
      if (roundMap[trimmed]) {
        node.textContent = node.textContent.replace(trimmed, roundMap[trimmed]);
      }
    }

    // 替换链接文本（根据 href）
    el.querySelectorAll('a[href]').forEach(link => {
      const href = link.getAttribute('href');
      for (const [key, label] of Object.entries(roundMapLink2)) {
        const index = href.indexOf(key);
        if (index !== -1) {
          const nextChar = href.charAt(index + key.length);
          if (!nextChar || !/^\d$/.test(nextChar)) {
            link.textContent = label;
            break;
          }
        }
      }
    });
  });
}


function translateRoundInfo() {
  document.querySelectorAll('.roundinfo').forEach(el => {
    let html = el.innerHTML;
    Object.entries(roundInfo).forEach(([en, zh]) => {
      html = html.replace(new RegExp(en, 'g'), zh);
    });
    el.innerHTML = html;
  });
}


function translateTournamentLinks() {
  document.querySelectorAll("a[href]").forEach(link => {
    const href = link.getAttribute("href") || "";
    const text = link.textContent.trim();

    // 跳过文本为“Draw”或“比赛签表”的链接
    if (text === "Draw" || text === "比赛签表") return;

    // 跳过文本为1-6位纯数字的链接
    if (/^\d{1,6}$/.test(text)) return;

    Object.entries(tournamentName).forEach(([id, name]) => {
      const patterns = [
        { prefix: `event/${id}`, full: `event/${id}` },
        { prefix: `res/index.asp?event=${id}`, full: `res/index.asp?event=${id}` }
      ];

      for (const { prefix, full } of patterns) {
        const index = href.indexOf(full);
        if (index !== -1) {
          const nextChar = href.charAt(index + full.length);

          // 如果后一位是数字或“#”，则跳过替换
          if (/^\d$/.test(nextChar) || nextChar === "#") {
            continue;
          }

          link.textContent = name;
          break;
        }
      }
    });
  });
}





function translatePage() {
  if (!countrySetting) return;
  const xpath = "//text()[normalize-space()]";
  const textNodes = document.evaluate(xpath, document.body, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
  for (let i = 0; i < textNodes.snapshotLength; i++) {
    const node = textNodes.snapshotItem(i);
    const text = node.nodeValue.trim();
    if (translations[text]) {
      node.nodeValue = node.nodeValue.replace(text, translations[text]);
    }
  }
}

function replaceTaiwanFlag() {
  if (!countrySetting) return;
  document.querySelectorAll("img").forEach(img => {
    if (img.src.includes("/res/scorekeeper/gfx/flags/icondrawer/16/Taiwan.png")) {
      img.src = "https://snookerscores.net/img/flags/24/Chinese-Taipei.png";
      img.style.height = "16px";
    }
  });
}

function translateSnookerPage() {
  const settings = loadTranslationSetting(); // 重新加载设置

  if (settings.useExtra) {
    translateRoundLabels();
    translateTemplateLinks();
	translateTournamentLinks();
	translateDraw();
	translateRoundInfo();
  }

  translateLinks();

  if (settings.useCountry) {
    translatePage();
    translateNationalityImages();
    replaceTaiwanFlag();
  }

}

function observeDomChanges() {
  const targetNode = document.querySelector(".dataTables_wrapper") || document.body; // 选择区域

  let timeoutId = null;

  const observer = new MutationObserver(mutations => {
    for (const mutation of mutations) {
      if (mutation.addedNodes.length > 0) {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          translateSnookerPage();
          timeoutId = null;
        }, 2000); // 延迟2000ms执行，避免连续触发
        break;
      }
    }
  });

  observer.observe(targetNode, {
    childList: true,
    subtree: true
  });
}



translateSnookerPage();
createToggle();
//observeDomChanges();