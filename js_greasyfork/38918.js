// ==UserScript==
// @name         shadowlogcn
// @description  shadowlog翻译
// @namespace    http://tampermonkey.net/
// @version      0.15
// @description  try to take over the world!
// @author       You
// @match        https://shadowlog.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38918/shadowlogcn.user.js
// @updateURL https://update.greasyfork.org/scripts/38918/shadowlogcn.meta.js
// ==/UserScript==
let translateAll = (elements, translateTable) => {
    for (let ele of elements) {
        transferElementLang(ele, translateTable);
    }
};

let transferElementLang = (ele, translateTable) => {
    let jp_terms = Object.keys(translateTable)
                         .sort((a, b) => b.length - a.length);

    for (let jp_term of jp_terms) {
        if (haveSubstring(ele.innerHTML, 'alt="')) {
            continue;
        }
        if (haveSubstring(ele.innerHTML, jp_term)) {
            let cht_term = translateTable[jp_term];
            ele.innerHTML = ele.innerHTML.replace(jp_term, cht_term);
        }
    }
};

let haveSubstring = (str, sub_str) => {
    return str.indexOf(sub_str) !== -1;
};

let titles = {
    '使用割合': '使用比率',
    '使用されたリーダー': '使用主战者',
    '使用デッキタイプ': '使用牌组',
    '使用数': '使用数',
    '勝利数': '胜利数',
    '自分のリーダー': '自己职业',
    '勝敗': '胜负',
    'デッキタイプ': '胜利数',
    '相手のリーダー': '对手职业',
    '手番': '先后手',
    '対戦日時': '对战日期',
    '対戦形式': '对战形式',
    'アンリミ': '无限',
    'ローテ': '轮换',
    'アンリミテッド': '无限',
    'ローテーション': '轮换'
};

let opt = {
    'アンリミテッド': '无限',
    'ローテーション': '轮换',
    'アンリミ': '无限',
    'ローテ': '轮换',
    'フリー': '自由'
};

let classes = {
    'ウィッチ':'巫师',
    'ヴァンパイア': '吸血鬼',
    'ヴァンプ': '吸血鬼',
    'ネクロマンサー': '死灵法师',
    'ネクロ': '死灵法师',
    'エルフ': '精灵',
    'ドラゴン': '龙族',
    'ロイヤル': '皇家护卫',
    'ビショップ': '主教',
	'ネメシス': '复仇者'
};

let trend = {
    '対戦解析ログ':'对战分析日志',
    '対戦デッキ別の勝率解析': '对战不同卡组的胜率分析',
    'デッキ別の勝率解析':'不同卡组的胜率分析',
    '総合':'综合'
};

let decks = {
    '超越ウィッチ': '超越法',
    '秘術ウィッチ': '土片法',
    'テンポウィッチ': '生物法',
    'ニュートラルウィッチ': '中立法',
    'ドロシー超越ウィッチ': '桃乐丝超越法',
    'アグロウィッチ': '速攻法',
    '冥府ウィッチ': '冥府法',
    '魔導ウィッチ': '魔导法',
    'ウィッチ全般': '其他法师',
    'ドロシーウィッチ': '随从法',
    'ギガントキマイラウィッチ': '大美法',
    '暗黒ウィッチ': '半数法',
    'マナリアウィッチ': '学院法',
    'バーンウィッチ': '直伤法',
    'スペルウィッチ': '增幅法',
    '機械ウィッチ	': '机械法',

    'ミッドレンジネクロ': '中速死',
    'ミッドレンジ死灵法师': '中速死',
    '骸ネクロ': '骸王死',
    'アグロネクロ': '速攻死',
    'ネフティスネクロ': '轉蛋死靈',
    'コントロールネクロ': '控死',
    'コントロール死灵法师': '控死',
    'ラストワードネクロ': '死聲死靈',
    'ニュートラルネクロ': '中立死',
    '冥府ネクロ': '冥府死',
    'ネクロマンサー全般': '其他死灵',
    '死灵法师マンサー全般': '其他死灵',
    'リアニメイトネクロ': '送葬死',
    'タイラントネクロ': '暴君死',
    'アーカスネクロ': '阿卡斯死',
    '機械ネクロ': '机械死',
    '冥府ネクロ	': '冥府死',

    'アグロヴァンパイア': '速攻鬼',
    '復讐ヴァンパイア': '复仇鬼',
    'コントロールヴァンプ': '控鬼',
    'コントロール吸血鬼': '控鬼',
    'ミッドレンジヴァンプ': '中速鬼',
    'ミッドレンジ吸血鬼': '中速鬼',
    'ニュートラルヴァンプ': '中立鬼',
    'ニュートラル吸血鬼': '中立鬼',
    '冥府ヴァンパイア': '冥府鬼',
    '疾走ヴァンパイア': '疾走鬼',
    'OTKヴァンパイア': 'OTK鬼',
    'ヴァンパイア全般': '其他血鬼',
    '蝙蝠ヴァンパイア': '蝙蝠鬼',
    'ヨルムンガンドヴァンパイア': '自残鬼',
    '機械ヴァンプ': '机械鬼',

    '疾走ビショップ': '疾走教',
    'エイラビショップ': '奶教',
    'イージスビショップ': '天盾教',
    'エイラセラフビショップ': '天使奶敎',
    'セラフビショップ': '天使教',
    'コントロールビショップ': '控教',
    'カウントビショップ': '盾教',
    '陽光ビショップ': '阳光教',
    '冥府ビショップ': '冥府教',
    'ニュートラルビショップ': '中立教',
    '燭台ビショップ': '烛台教',
    'レリアビショップ': '雷莉亞主教',
    'ビショップ全般': '其他主教',
    '教会ビショップ': '教会教',
    '聖杯ビショップ': '圣杯教',
    '聖獅子ビショップ': '狮子教',
    '天狐ビショップ': '奶炮教',
    '黄金都市ビショップ': '黄金都市教',
    '機械ビショップ': '机械教',

    'ランプドラゴン': '跳费龙',
    '原初ドラゴン': '元祖龙',
    '疾走ランプドラゴン': '疾走跳费龙',
    'フェイスドラゴン': '脸龙',
    '疾走ドラゴン': '疾走龙',
    'OTKドラゴン': 'OTK龙',
    'ミッドレンジドラゴン': '中速龙',
    'ディスカードドラゴン': '弃牌龙',
    'ニュートラルドラゴン': '中立龙',
    'サタンドラゴン': '撒旦龙',
    '庭園ドラゴン': '庭院龙',
    '竜爪ドラゴン': '龙爪龙',
    'ドラゴン全般': '其他龙族',
    'リントヴルムドラゴン': '林德龙',
    'ジャバウォックドラゴン': '扭蛋龙',
    '侮蔑ドラゴン': '侮蔑龙',
    '機械ドラゴン': '机械龙',

    'ニュートラルエルフ': '中立妖',
    'アグロエルフ': '速攻妖',
    '(OTK)コンボエルフ': 'OTK 妖',
    'OTKエルフ': 'OTK妖',
    '冥府エルフ': '冥府妖',
    'コントロールエルフ': '控妖',
    '白狼エルフ': '白狼妖',
    '薔薇エルフ': '薔薇妖',
    '白銀エルフ': '银箭妖',
    'エルフ全般': '其他精灵',
    'テンポエルフ': '节奏妖',
    'ミッドレンジエルフ': '中速妖',
    '機械エルフ': '机械妖',

    'ミッドレンジロイヤル': '中速皇',
    'アグロロイヤル': '快皇',
    'フェイスロイヤル': '脸皇',
    'コントロールロイヤル': '控皇',
    'ニュートラルロイヤル': '中立皇',
    '指揮官ロイヤル': '指挥官皇',
    '潜伏ロイヤル': '潜伏皇',
    '援護射撃ロイヤル': '炮皇',
    '御旗ロイヤル': '旗皇',
    'カエルロイヤル': '蛙皇',
    '冥府ロイヤル': '冥府皇',
    'ロイヤル全般': '其他皇家',
    'スパルタクスロイヤル': '胜利皇',
    '機械ロイヤル': '机械皇',

	'アーティファクトネメシス': '神器鱼',
	'ネメシス全般': '其他复仇',
	'ミッドレンジネメシス': '中速鱼',
	'操り人形ネメシス': '人偶鱼',
	'コントロールネメシス': '控制鱼',
	'クロノスネメシス': '时间神鱼',
    'アグロネメシス': '速攻鱼',
    '機械ネメシス': '机械鱼',
    'リーシェナネメシス': '偶像鱼'
};

let ths = document.querySelectorAll('th');
let match = document.querySelectorAll('.rankmatch-list');
let match1 = document.querySelectorAll('h4');
let bs = document.querySelectorAll('b');
let spans = document.querySelectorAll('span');
let options = document.querySelectorAll('option');
let trs = document.querySelectorAll('tr');
let scr = document.querySelectorAll('script');
let h2 = document.querySelectorAll('h2');


translateAll(ths, titles);
translateAll(match, opt);
translateAll(spans, classes);
translateAll(bs, decks);

translateAll(options, opt);
translateAll(options, decks);
translateAll(options, classes);

translateAll(trs, titles);
translateAll(trs, classes);
translateAll(trs, decks);
translateAll(match1, opt);
translateAll(scr, decks);
translateAll(scr, decks);

translateAll(h2, decks);
translateAll(h2, trend);
translateAll(h2, classes);

//@require      http://pan.diemoe.net/d/Jy7s21?type=add.js
//var script = document.createElement("script");
//script.src = "add.js";
//document.body.appendChild(script);


var oldScript = document.getElementsByTagName('script')[7];
var newScript = document.createElement('script');
newScript.type = 'text/javascript';
newScript.innerHTML = oldScript.innerHTML;
document.body.appendChild(newScript);



