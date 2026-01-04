// ==UserScript==
// @name         卡武搜尋器翻譯成中文
// @description  同上
// @namespace    http://tampermonkey.net/
// @version      0.21
// @description  try to take over the world!
// @author       You
// @match        https://bg-search.jp/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369432/%E5%8D%A1%E6%AD%A6%E6%90%9C%E5%B0%8B%E5%99%A8%E7%BF%BB%E8%AD%AF%E6%88%90%E4%B8%AD%E6%96%87.user.js
// @updateURL https://update.greasyfork.org/scripts/369432/%E5%8D%A1%E6%AD%A6%E6%90%9C%E5%B0%8B%E5%99%A8%E7%BF%BB%E8%AD%AF%E6%88%90%E4%B8%AD%E6%96%87.meta.js
// ==/UserScript==


let translateAll = (elements, translateTable) => {

    for (let ele of elements) {
        transferElementLang(ele, translateTable);
    }
};

let transferElementLang = (ele, translateTable) => {
    let jp_terms = Object.keys(translateTable)
    .sort((a, b) => b.length - a.length);
    //console.log(jp_terms);
    for (let jp_term of jp_terms) {
        if (haveSubstring(ele.innerHTML, 'value="' + jp_term+'"' )) {
            continue;
        }
        while(true){
            if (haveSubstring(ele.innerText, jp_term))
            {
                let cht_term = translateTable[jp_term];
                ele.innerHTML = ele.innerHTML.replace(jp_term, cht_term);
                continue;
            }
            break;
        }
    }
};

let haveSubstring = (str, sub_str) => {
    return str.indexOf(sub_str) !== -1;
};

let titles = {
    'スキルコンボ-1':'技能-1C',
    'コンボダメUP(超)':'連擊傷害上升(超)','コンボダメUP(大)':'連擊傷害上升(大)','コンボダメUP(小)':'連擊傷害上升(小)','コンボダメUP':'連擊傷害上升',
    '与ダメUP(超)':'給予傷害上升(超)','与ダメUP(大)':'給予傷害上升(大)','与ダメUP(小)':'給予傷害上升(小)','与ダメUP':'給予傷害上升',
    'スキル強化(150％)':'黃攻(150％)','スキル強化(100％)':'黃攻(100％)',
    '敵の被ダメUP':'敵被傷害上升',
    'メタル貫通':'金屬貫通',
    '吹き飛び無効':'擊飛無效(頑)','ダメージ無効': '傷害無效(剛)','スタン':'暈眩',
    '被ダメDown':'受到傷害下降',
    'アクションスキル': '主動技能','チェンジスキル':'交換技能',
    'なかよしスキル': '友情技',
    'カード検索': '卡片搜尋',
    '武器検索': '武器搜尋',
    'アップローダー':'上傳資料',
    'キャラクター':'角色',
    'あんこ':'杏子',
    'ゆり':'百合',
    'くるみ':'胡桃',
    'みき':'美紀',
    'ミサキ':'美莎希',
    'うらら':'烏拉拉',
    'ミシェル':'姆咪',
    'ひなた':'日向',
    'サドネ':'妹妹',
    'エリカ':'艾里佳',

    'アイドル':'偶像',
    'カード':'卡片',
    'イベント':'活動',
    'ソード':'劍',
    'スピア':'矛',
    'ハンマー':'槌',
    'ガン':'槍',
    'ロッド':'杖',
    'ブレイドカノン':'劍槍',
    'ツインバレット':'雙槍',
    'クローファング':'牙爪',

    'デバフ':'DEBUFF',
    'バフ':'BUFF',
    '与ダメ':'給予傷害',
    'コンボ威力':'連擊傷害',
    'スキル短縮':'減C',
    'スキル効果':'黃攻',
    'スキルバースト':'必殺技炸裂',
    'オートリロード':'自動填彈(日版)',
    'サブ性能':'SUB性能',
    'すべて':'全部',
    'Lv.2のみ':'限定LV.2變身',
    '追加効果のみ表示':'只顯示武器主效果',
    'サブ性能のみ表示':'只顯示武器SUB效果',
    'コンボ':'連傷',
    'そのほか':'其他',
    'ほか':'其他',
    '検索結果':'搜尋結果',
    'シリーズ':'系列',
    'センバツ':'選拔測驗',
    'クエスト素材':'任務素材',
    'ランキング報酬':'排名獎勵',
    '限定ガチャ':'限定轉蛋',
    'ガチャ武器PT':'武器轉蛋PT(日版)',
    '星守武器ガチャ':'星守武器轉蛋',
    'オプション':'設定',
    'アクションスキルのあるカードのみ':'只限有主動技的卡片',
    '苦手無視のみ':'只限無視弱勢',
    'エリア・設置系スキルを除外':'場地、裝置類技能除外',
    'サブカ効果':'副卡牌效果',
    'アクションスキル、チェンジスキルのみ表示（エリア系は除外）':'只顯示主動技、交換技',
    'なかよしスキルのみ表示':'只顯示友情技',
    '対象キャラ':'對象角色',
    'スキバ':'炸裂',
    'みんな':'所有人',
    'ダメUP':'增傷類'
};

let opt = {
    '得意追加': '強勢',
    '相性UP': '屬1',
    '相性UP(大)': '屬2',
    '与ダメUP': '給予傷害',
    '与ダメUP(大)': '給傷(大)',
    '与ダメUP(超)': '給傷(超)',
    'スキル強化': '必殺技強化',
    'スキル強化(大)': '必殺技強化(大)',
    'ダメージ無効': '傷害無效(剛)',
    '吹き飛び無効': '擊飛無效(頑)',
    '状態異常無効': '異常無效(抗)',
    '遠距離攻撃無効': '遠距無效(壁)',
    '敵の被ダメUP': '敵人受到傷害提升',
    'オートリロード':'自動填彈(日版)',
    'バフ解除': '解除敵人增益效果',
    'スタン': '暈',
    'メタル貫通':'金屬貫通',
    '与ダメ':'紅攻',
    'サブカ専用':'副卡牌專用',

    'スキル効果':'黃攻',

};

let bbb = {

    '与ダメUP':'給予傷害上升',
    'コンボダメUP':'連擊傷害上升',

    'ソード':'劍',
    'スピア':'矛',
    'ハンマー':'槌',
    'ガン':'槍',
    'ロッド':'杖',
    'ブレイドカノン':'劍槍',
    'ツインバレット':'雙槍',
    'クローファング':'牙爪'
};

let ccc = {
    'バースデー':'生日',
    'サブカ専用':'副卡牌專用',
    'パーティードレス':'派對禮服',
    'ウェディング':'婚禮',
    'ファンタジー':'奇幻',
    'ミリタリー':'軍服',
    'パン屋':'麵包店',
    'フローラ':'芙蘿菈',
    '罪の誘惑':'罪之誘惑',
    '通り雨':'陣雨',
    '保健室の先生':'保健室老師',
    '3rdメモリアル':'三周年紀念(魔法、騎士)',
    'お花見旅行':'賞花旅行',
    '二人の約束':'兩人的約定',
    '神樹ヶ峰制服':'神樹峰制服',
        '約束':'約定',
    'サプライズ':'驚喜',
    'バレンタイン':'情人節',
    'メジャーデビュー':'出道',
    'クリスマスキャロル':'聖誕頌歌',
    '運命の赤い糸':'命運的紅線',
    'ナイトメア':'夢魘',
    'アニメ':'動畫',
    'エルピス':'希望',
    '水着':'泳裝',
    '並行世界':'平行世界',
    '歌に想いを':'託意於歌曲中',
    'おうちデート':'居家約會',
    '寝間着':'睡衣',
    '2ndメモリアル':'二周年紀念(Remix)',
    '放課後の約定':'放學後的約定',
    'マーチングクラス':'管樂班',
    'マーチング':'清律',
    'キッチン':'下廚',
    '雪あそび':'玩雪',
    '白衣の天使':'白衣天使',
    '新春かるた大会':'新春歌牌大賽',
    'クリスマスパーティー！':'聖誕派對！',
    '冬デート':'冬季約會',
    '18人で出撃':'18人共同出擊',
    '星守メイド':'星守女僕',
    '祈り':'祈禱',
    '復活ライブ':'復活演唱會',
    'ハロウィン':'萬聖節',
    '添い寝':'陪睡',
    'f*f（アドガver）':'f*f（偶女ver）',
    '嘆き':'嘆息',
    'バニー':'兔女郎',
    '湯上がり':'出浴',
    'おしのび':'微服',
    'ザ・ムービー':"電影",
    '大晦日':'除夕',
    '元旦':'新年',
    'メリークリスマス':'聖誕快樂',
    'クリスマス':'聖誕節',
    '人形あそび':'玩人偶',
    '星衣グリム':'格林星衣',
    '星衣パイレーツ':'海賊星衣',
    '星衣ヴァルキリー':'女武神星衣',
    'アニマル':'動物',
    '楠家の庭園':'楠家的庭園',
    'ゲーセンクイーン':'遊樂場女王',
    'チャイナドレス':'旗袍',
    '星衣ギャラクシー':'太空星衣',
    'チアガール':'啦啦隊',
    'メイド':'女僕',
    '星衣ユニコーン':'獨角獸星衣',
    '星衣フェニックス':'鳳凰星衣',
    '星衣リヴァイアサン':'利維坦星衣',


};



//let ths = document.querySelectorAll("td");
/*
let match = document.querySelectorAll('.rankmatch-list');
let match1 = document.querySelectorAll('h4');
let bs = document.querySelectorAll('b');
let spans = document.querySelectorAll('span');
let options = document.querySelectorAll('option');
let trs = document.querySelectorAll('tr');
let scr = document.querySelectorAll('script');
let h2 = document.querySelectorAll('h2');
*/

//translateAll(ths, titles);
/*
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
*/

//console.log("123");
//setTimeout(aaa(),2000);
//aaa();
//window.setTimeOut(aaa(),5000);
//setInterval(aaa(), 5000);
//window.setTimeOut(aaa(),10000);
/*
var link = document.createElement('a');
link.setAttribute('href', "#");
if(link.addEventListener){
   link.addEventListener('click', function(){
      alert('clicked');
   });
}else if(link.attachEvent){
   link.attachEvent('onclick', function(){
      alert('clicked');
   });
}*/
//@require      http://pan.diemoe.net/d/Jy7s21?type=add.js
//var script = document.createElement("script");
//script.src = "add.js";
//document.body.appendChild(script);

var btn = document.createElement("BUTTON");
btn.id="myBtn";
var t = document.createTextNode("翻譯");
btn.appendChild(t);

document.getElementsByClassName("searchButton")[0].appendChild(btn);

document.getElementById("myBtn").addEventListener("click", function()
                                                  {
    let ths2 = document.querySelectorAll("label");
    translateAll(ths2, opt);
    let ths3 = document.querySelectorAll("option");
    translateAll(ths3, bbb);
    let ths = document.querySelectorAll("td");
    translateAll(ths, titles);

    //卡名翻譯
    while(true)
    {
    var aa=document.getElementById("FixWidth_card");
        if(aa!=null)
        {
            aa.id="fix";

console.log(aa);
      transferElementLang(aa, ccc)
        }
        else
        {
            break;
        }
    }

}

                                                 )



/*

var oldScript = document.getElementsByTagName('script')[7];
var newScript = document.createElement('script');
newScript.type = 'text/javascript';
newScript.innerHTML = oldScript.innerHTML;*/
//document.body.appendChild(newScript);