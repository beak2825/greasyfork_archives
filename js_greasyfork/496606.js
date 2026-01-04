// ==UserScript==
// @name         padawan_wnacgDownload6
// @namespace    padawan
// @version      3.0.37
// @description  download of wnacg
// @author       padawan
// @license MIT
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.2.0/jszip.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/1.3.8/FileSaver.js
// @match        http*://*.wnacg01.cc/photos-index-page-*.html
// @match        http*://*.wnacg01.cc/photos-index-aid-*.html
// @grant        GM_getResourceText
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/496606/padawan_wnacgDownload6.user.js
// @updateURL https://update.greasyfork.org/scripts/496606/padawan_wnacgDownload6.meta.js
// ==/UserScript==

'use strict';

// Global Defines
const waitingStr = `排隊中`;
const downloadStr = `已下載`;
const timeout = 1000; // time interval between retry
const successCountLimit = 3; // How many continous success checks required to start download, set 0 for instant download
const closeTabInterval = -1; // set to -1 to avoid auto close new opened tabs
const closeWindowInterval = -1; // set to -1 to avoid auto close current window

var title_global=""
var tag_global=""
var category_global=""
var title_and_category_global=""
var author_global=""
var name_global=""
var root_url_global="wn01.uk"

// =====================================================
//                     Utilities
// =====================================================

// Modified from https://gist.github.com/WebReflection/df05641bd04954f6d366
// with predefined object specific, for HTML entities only
//function _Unescape(s) {
//    var re = /&(?:amp|#38|lt|#60|gt|#62|apos|#39|quot|#34);/g;
//    var unescaped = {
//        '&amp;': '&',
//        '&#38;': '&',
//        '&lt;': '<',
//        '&#60;': '<',
//        '&gt;': '>',
//        '&#62;': '>',
//        '&apos;': "'",
//        '&#39;': "'",
//        '&quot;': '"',
//        '&#34;': '"',
//        '-': '-'
//    };
//    return s.replace(re, function (m) {
//        return escape(unescaped[m]);
//    });
//}

function _Unescape(s) {
    const pattern_arr=[
        ["\\","＼"],
        ["/","／"],
        [":","："],
        ["*","＊"],
        ["?","？"],
        ['"',"＂"],
        ["<","＜"],
        [">","＞"],
        ["|","｜"],
    ]
    for (var i=0;i<pattern_arr.length;i++){
        s=s.replace(pattern_arr[i][0],pattern_arr[i][1])
    }
    return s
}

function _Unescape2(s) {
    const pattern_arr=[
        [/［/,"["],
        [/］/,"]"],
        [/^\s*[\[【][^\[\]【】]*?[漢汉][化高][組组姐]?[^\[\]【】]*?[\]】]\s*/,""],
        [/^\s*\[同人誌[^\]]*?\]\s*/,""],
        [/^\s*\[無邪気無修宇宙分組\]\s*/,""],
        [/^\s*【無邪気無修宇宙分組】\s*/,""],
        [/^\s*\[Digital\]\s*/,""],
        [/^\s*\[單行本[^\]]*?\]\s*/,""],
        [/^\s*[\[【][^\]]*?重嵌[\]】]\s*/,""],
        [/^\s*\[CastlevaniaYB\]\s*/,""],
        [/^\s*\[風的工房[^\]]*?\]\s*/,""],
        [/^\s*\[[^\]]*?精修\]\s*/,""],
        [/^\s*\[[^\]]*?日[語语]社?\]\s*/,""],
        [/^\s*\[FDA-010\]\s*/,""],
        [/^\s*\[風與[^\]]*製[做作]\]\s*/,""],
        [/^\s*\[未來數位\]\s*/,""],
        [/^\s*\[CE家族社\]\s*/,""],
        [/^\s*\[badluck1205\]\s*/,""],
        [/^\s*\[無修正\]\s*(.*?)$/,"$1[無修正]"],
        [/^\s*\[冊語草堂[^\[\]]*\]\s*/,""],
        [/^\s*\[漫画\]\s*/,""],
        [/^\s*\[洨五組\]\s*/,""],
        [/^\s*\[新版\]\s*/,""],
        [/^\s*\[空中[^\]]*製作室?\]\s*/,""],
        [/^\s*\[邊緣洨五組\]\s*/,""],
        [/^\s*\[Ｋ莫諾湖戀組\]\s*/,""],
        [/^\s*\[[^\]\[]*翻[译訳譯]\]\s*/,""],
        [/^\s*【CE家族社】\s*/,""],
        [/^\s*\[[^\]\[]*蓋牆組\]\s*/,""],
        [/^\s*\[[^\]\[]*[扫掃][圖图][組组姐]?\]\s*/,""],
        [/^\s*【鬼畜王骑空团】\s*/,""],
        [/^\s*\[[^\[\]]*中文化?\]\s*/,""],
        [/^\s*\[黑暗月光石\]\s*/,""],
        [/^\s*\[上古勤受\]\s*/,""],
        [/^\s*\[雜誌[^\]\[]*?短篇\]\s*/,""],
        [/^\s*\[[^\]\[]*?改图\]\s*/,""],
        [/^\s*\[無碼\]\s*/,""],
        [/^\s*\[暗黑鴿友會×大洗⑨課\]\s*/,""],
        [/^\s*\[雜誌&短篇[^\[\]]*?\]\s*/,""],
        [/^\s*\[英訳\]\s*/,""],
        [/^\s*\[[^\[\]]*?渣翻\]\s*/,""],
        [/^\s*\[薄碼\]\s*/,""],
        [/^\s*\[[^\[\]]*?去码\]\s*/,""],
        [/^\s*\[[^\[\]]*?渣嵌\]\s*/,""],
        [/^\s*\[天鹅之恋\]\s*/,""],
        [/^\s*\(同人誌\)\s*/,""],
        [/^\s*\[[^\]\[]*?漫画组\]\s*/,""],
        [/^\s*\[指○奶茶步兵團\]\s*/,""],
        [/^\s*\[[Pp][Ii][Xx][Ii][Vv]\]\s*/,"(pixiv)"],
        [/^\s*\[[Ff][Aa][Nn][Aa][Rr][Tt]\]\s*/,"(pixiv)"],
        [/^\s*\[アーティスト\]\s*/,"(pixiv)"],
        [/^\s*\[[Ff][Aa][Nn][Tt][Ii][Aa]\]\s*/,"(pixiv)"],
        [/^\s*\[[Ff][Aa][Nn][Bb][Oo][Xx]\]\s*/,"(pixiv)"],
        [/^\s*\[[Tt][Ww][Ii][Tt][Tt][Ee][Rr]\]\s*/,"(pixiv)"],
        [/:/g,"："],
        [/^\s*\[神風軍團\]\s*/,""],
        [/^\s*\[CEx无毒\]\s*/,""],
        [/\//g,""],
        [/\*/g,""],
        [/\"/g,""],
        [/</g,""],
        [/>/g,""],
        [/\|/g,""],
        [/\?/g,""],
        [/^\s*\[湘西河豚刺身专门店\]\s*/,""],
        [/\[Tachibana Nagon\]/g,"[立花なごん]"],
        [/\[Kangoku Meika\]/g,"[監獄銘菓]"],
        [/\[Sajipen\]/g,"[さじぺん]"],
        [/\[Hazuki Yuuto\]/g,"[羽月ユウト]"],
        [/\[Upanishimaru\]/g,"[うぱ西。]"],
        [/\[Hirama Hirokazu\]/g,"[平間ひろかず]"],
        [/\[Kirimoto Yuuji\]/g,"[桐下悠司]"],
        [/\[Minamino Sazan\]/g,"[南乃さざん]"],
        [/\[Karasu\-chan\]/g,"[カラスちゃん]"],
        [/\[Tatsu Tairagi\]/g,"[燵成]"],
        [/\[Karma Tatsuro\]/g,"[かるま龍狼]"],
        [/\[Momoyama Hato\]/g,"[モモヤマハト]"],
        [/\[Minagiri\]/g,"[ミナギリ]"],
        [/\[Kinata\]/g,"[葵奈太]"],
        [/\[Itsuki Kuro\]/g,"[伊月クロ]"],
        [/\[Ayano Baru\]/g,"[絢乃ばる]"],
        [/\[Koshino\]/g,"[こしの]"],
        [/\[Kamiya Zuzu\]/g,"[神谷ズズ]"],
        [/\[Hiura R\]/g,"[火浦R]"],
        [/\[Haregama\]/g,"[ハレガマ]"],
        [/\[Totoyama Keiji\]/g,"[魚山ケイジ]"],
        [/\[Chiune\]/g,"[ちうね]"],
        [/^\(.*?\)\s*/g,""],
        [/\[Morishima Kon\]/g,"[森島コン]"],
        [/\[Suruga Kuroitsu\]/g,"[駿河クロイツ]"],
        [/\[Zakotsu\]/g,"[佐骨]"],
        [/\[Alps Ichimando\]/g,"[アルプス一万堂]"],
        [/\[Maririn\]/g,"[まりりん]"],
        [/\[Puyocha\]/g,"[ぷよちゃ]"],
        [/\[ぷよちゃ\]\s*\[ぷよちゃ\]/g,"[ぷよちゃ]"],
        [/\[Hoshii Nasake\]/g,"[星井情]"],
        [/\[星井情\]\s*\[星井情\]/g,"[星井情]"],
        [/\[Senaka ga Shiri\]/g,"[背中が尻]"],
        [/\[背中が尻\]\s*\[背中が尻\]/g,"[背中が尻]"],
        [/\[Beko Tarou\]/g,"[ベコ太郎]"],
        [/\[ベコ太郎\]\s*\[ベコ太郎\]/g,"[ベコ太郎]"],
        [/\[Nagayori\]/g,"[長頼]"],
        [/\[長頼\]\s*\[長頼\]/g,"[長頼]"],
        [/\[Fujoujoushi\]/g,"[不嬢女子]"],
        [/\[不嬢女子\]\s*\[不嬢女子\]/g,"[不嬢女子]"],
        [/\[Uono Shinome\]/g,"[魚野シノメ]"],
        [/\[魚野シノメ\]\s*\[魚野シノメ\]/g,"[魚野シノメ]"],
        [/\[Oumikun\]/g,"[近江訓]"],
        [/\[近江訓\]\s*\[近江訓\]/g,"[近江訓]"],
        [/\[Hogeramu\]/g,"[ほげらむ]"],
        [/\[ほげらむ\]\s*\[ほげらむ\]/g,"[ほげらむ]"],
        [/\[Tsuruga\]/g,"[鶴賀]"],
        [/\[鶴賀\]\s*\[鶴賀\]/g,"[鶴賀]"],
        [/\[Kakei Kei\]/g,"[花兄けい]"],
        [/\[花兄けい\]\s*\[花兄けい\]/g,"[花兄けい]"],
        [/\[Myamo\]/g,"[ミャモ]"],
        [/\[ミャモ\]\s*\[ミャモ\]/g,"[ミャモ]"],
        [/\[Mori Guruta\]/g,"[森ぐる太]"],
        [/\[森ぐる太\]\s*\[森ぐる太\]/g,"[森ぐる太]"],
        [/\[Makin\]/g,"[まきん]"],
        [/\[まきん\]\s*\[まきん\]/g,"[まきん]"],
        [/\[Shimohara\]/g,"[しもはら]"],
        [/\[しもはら\]\s*\[しもはら\]/g,"[しもはら]"],
        [/\[Wabara Hiro\]/g,"[羽原ヒロ]"],
        [/\[羽原ヒロ\]\s*\[羽原ヒロ\]/g,"[羽原ヒロ]"],
        [/\[Sugi G\]/g,"[すぎぢー]"],
        [/\[すぎぢー\]\s*\[すぎぢー\]/g,"[すぎぢー]"],
        [/\[Eroi-Roe\]/g,"[エロ井ロエ]"],
        [/\[エロ井ロエ\]\s*\[エロ井ロエ\]/g,"[エロ井ロエ]"],
        [/\[Susukumo Nagi\]/g,"[煤雲なぎ]"],
        [/\[煤雲なぎ\]\s*\[煤雲なぎ\]/g,"[煤雲なぎ]"],
        [/\[Haru Yukiko\]/g,"[はるゆきこ]"],
        [/\[はるゆきこ\]\s*\[はるゆきこ\]/g,"[はるゆきこ]"],
        [/\[Nanamiya Tsugumi\]/g,"[七宮つぐ実]"],
        [/\[doumou\]/g,"[ドウモウ]"],
        [/\[Panda Ekisu\]/g,"[パンダエキス]"],
        [/\[Croriin\]/g,"[くろりーん]"],
        [/\[くろりーん\]\s*\[くろりーん\]/g,"[くろりーん]"],
        [/\[Kosuke Haruhito\]/g,"[虎助遥人]"],
        [/\[Nicoby\]/g,"[にこびい]"],
        [/\[Tsugumi Suzuma\]/g,"[亜美寿真]"],
        [/\[亜美寿真\]\s*\[亜美寿真\]/g,"[亜美寿真]"],
        [/\[Nise\]/g,"[似せ]"],
        [/\[Nanamoto\]/g,"[ななもと]"],
        [/\[Daiji\]/g,"[だいじ]"],
        [/\[Hiramaru Akira\]/g,"[平丸あきら]"],
        [/\[Yuzuto Sen\]/g,"[柚十扇]"],
        [/\[Iwami Yasoya\]/g,"[石見やそや]"],
        [/\[Matsukawa\]/g,"[松河]"],
        [/\[松河\]\s*\[松河\]/g,"[松河]"],
        [/\[Nikubou Maranoshin\]/g,"[肉棒魔羅ノ進]"],
        [/\[肉棒魔羅ノ進\]\s*\[肉棒魔羅ノ進\]/g,"[肉棒魔羅ノ進]"],
        [/\[35 Machi\]/g,"[35まち]"],
        [/\[35まち\]\s*\[35まち\]/g,"[35まち]"],
        [/\[Hoshito Lucky\]/g,"[ほしとラッキー]"],
        [/\[Yamada Yuuya\]/g,"[ヤマダユウヤ]"],
        [/\[Ashiomi Masato\]/g,"[アシオミマサト]"],
        [/\[絢乃ばる\]\s*\[絢乃ばる\]/g,"[絢乃ばる]"],
        [/\[Esuke\]/g,"[えーすけ]"],
        [/\[えーすけ\]\s*\[えーすけ\]/g,"[えーすけ]"],
        [/\[E-musu Aki\]/g,"[いーむす・アキ]"],
        [/\[いーむす・アキ\]\s*\[いーむす・アキ\]/g,"[いーむす・アキ]"],
        [/\[Riyusa\]/g,"[りゆさ]"],
        [/\[りゆさ\]\s*\[りゆさ\]/g,"[りゆさ]"],
        [/\[sumiya\]/g,"[スミヤ]"],
        [/\[スミヤ\]\s*\[スミヤ\]/g,"[スミヤ]"],
        [/\[Sanjuurou\]/g,"[さんじゅうろう]"],
        [/\[さんじゅうろう\]\s*\[さんじゅうろう\]/g,"[さんじゅうろう]"],
        [/\[Kise Itsuki\]/g,"[木瀬樹]"],
        [/\[木瀬樹\]\s*\[木瀬樹\]/g,"[木瀬樹]"],
        [/\[Polinky\]/g,"[堀博昭]"],
        [/\[堀博昭\]\s*\[堀博昭\]/g,"[堀博昭]"],
        [/\[Ouchi Kaeru\]/g,"[楝蛙]"],
        [/\[楝蛙\]\s*\[楝蛙\]/g,"[楝蛙]"],
        [/\[Yoikono tt\]/g,"[ヨイコノtt]"],
        [/\[ヨイコノtt\]\s*\[ヨイコノtt\]/g,"[ヨイコノtt]"],
        [/\[Wantan Meo\]/g,"[雲呑めお]"],
        [/\[雲呑めお\]\s*\[雲呑めお\]/g,"[雲呑めお]"],
        [/\[Sugimura Sakon\]/g,"[杉村佐根]"],
        [/\[杉村佐根\]\s*\[杉村佐根\]/g,"[杉村佐根]"],
        [/\[Itsutsuse\]/g,"[いつつせ]"],
        [/\[いつつせ\]\s*\[いつつせ\]/g,"[いつつせ]"],
        [/\[Karma Tatsuro\]/g,"[かるま龍狼]"],
        [/\[かるま龍狼\]\s*\[かるま龍狼\]/g,"[かるま龍狼]"],
        [/\[Tirotata\]/g,"[ちろたた]"],
        [/\[ちろたた\]\s*\[ちろたた\]/g,"[ちろたた]"],
        [/\[Yoshimoto\]/g,"[吉本]"],
        [/\[吉本\]\s*\[吉本\]/g,"[吉本]"],
        [/\[Konka\]/g,"[紺菓]"],
        [/\[紺菓\]\s*\[紺菓\]/g,"[紺菓]"],
        [/\[Monchan rev3\]/g,"[もんちゃんrev3]"],
        [/\[Syamonabe\]/g,"[シャモナベ]"],
        [/\[Doranoyama\]/g,"[どらのやま]"],
        [/\[Kakunini\]/g,"[角煮煮]"],
        [/\[RegDic\]/g,"[れぐでく]"],
        [/\[Nagoyaka Jirou\]/g,"[なごやか次郎]"],
        [/\[Inonaka Kawazu\]/g,"[胃ノ中かわず]"],
        [/\[Souseki\]/g,"[層積]"],
        [/\[Toku\]/g,"[とく]"],
        [/\[Jury\]/g,"[じゅらい]"],
        [/\[Osakana Arichi\]/g,"[御魚ありち]"],
        [/\[Efuefu\]/g,"[えふえふ]"],
        [/\[Goten\]/g,"[ごてん]"],
        [/\[Okara\]/g,"[おから]"],
        [/\[Utsunomiya Ukatsu\]/g,"[鬱ノ宮うかつ]"],
        [/\[Dramus\]/g,"[ドラムス]"],
        [/\[Shittori Bouzu\]/g,"[しっとりボウズ]"],
        [/\[Freedom Prophet\]/g,"[フリーダムプロフェット]"],
        [/\[Tsunonigau\]/g,"[ツノニガウ]"],
        [/\[Kiwami Ichiman Dageki\]/g,"[極壱万打撃]"],
        [/\[Bodoyama\]/g,"[ボド山]"],
        [/\[Nishizawa Mizuki\]/g,"[西沢みずき]"],
        [/\[Sasahiro\]/g,"[笹弘]"],
        [/\[Enno Esuke\]/g,"[遠野えすけ]"],
        [/\[Hatimoto\]/g,"[鉢本]"],
        [/\[Hachimoto\]/g,"[鉢本]"],
        [/\[鉢本\]\s*\[鉢本\]/g,"[鉢本]"],
        [/\[Azumi Kyohei\]/g,"[あずみ京平]"],
        [/\[Semino Hazuki\]/g,"[セミノハヅキ]"],
        [/\[Cucchiore\]/g,"[くっきおーれ]"],
        [/\[Kohri\]/g,"[こーり]"],
        [/\[Kase Daiki\]/g,"[加瀬大輝]"],
        [/\[Megitune Works\]/g,"[めぎつねワークス]"],
        [/\[Niizuma Potepu\]/g,"[新妻ぽてぷ]"],
        [/\[Ojou\]/g,"[オジョウ]"],
        [/\[Kuro-nyan\]/g,"[くろニャン]"],
        [/\[Choipiro\]/g,"[ちょいぴろ]"],
        [/\[Namboku\]/g,"[南北]"],
        [/\[Torii Yoshitsuna\]/g,"[鳥居ヨシツナ]"],
        [/\[Terasu MC\]/g,"[テラスMC]"],
        [/\[Dochashiko\]/g,"[どちゃしこ]"],
        [/\[Idaten Funisuke\]/g,"[いだ天ふにすけ]"],
        [/\[Particular\]/g,"[ぱてくらー]"],
        [/\[Umeda Nautilus\]/g,"[梅田ノーチラス]"],
        [/\[Mozu\]/g,"[もず]"],
        [/\[Senoo Hibiteru\]/g,"[瀬尾日々照]"],
        [/\[Saida Kazuaki\]/g,"[さいだ一明]"],
        [/\[Homunculus\]/g,"[ホムンクルス]"],
        [/\[Momokumo\]/g,"[桃雲]"],
        [/\[Hinata Aosuke\]/g,"[日向あお助]"],
        [/\[Momoko\]/g,"[ももこ]"],
        [/\[Tsuruomi\]/g,"[つるおみ]"],
        [/\[Sekitsui\]/g,"[せきつい]"],
        [/\[Namiki Nazu\]/g,"[並木なず]"],
        [/\[Danchino\]/g,"[団地の]"],
        [/\[muripoyoa\]/g,"[むりぽよ]"],
        [/\[Okumoto Yuta\]/g,"[オクモト悠太]"],
        [/\[Tulip\]/g,"[ちゅーりっふ。]"],
        [/\[yue\]/g,"[ユエ]"],
        [/\[IND Kary\]/g,"[印度カリー]"],
        [/\[Chan Shiden\]/g,"[治屋武しでん]"],
        [/\[Shiragiku\]/g,"[白菊]"],
        [/\[Yumekawa Dododo-chan\]/g,"[夢叶羽どどどちゃん]"],
        [/\[Harumachi Uro\]/g,"[春待うろ]"],
        [/\[Guremasu\]/g,"[ぐれます]"],
        [/\[Masu\]/g,"[ます]"],
    ]


    while(true){
      //const name_size=s.length
      var flag=0
      for (var i=0;i<pattern_arr.length;i++){
        var n=s.search(pattern_arr[i][0])
        if (n==-1){
          continue
        }
        flag=1
        s=s.replace(pattern_arr[i][0],pattern_arr[i][1])
      }
      //if(name_size==s.length){
      if(flag==0){
        break
      }
    }
    return s
}

async function _Fetch(url) {
    return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            headers: { // Without header it return 200 and seldom return 503 even if service is not availiable
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/112.0",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
                "Accept-Language": "zh-TW,zh;q=0.8,en-US;q=0.5,en;q=0.3",
                "Upgrade-Insecure-Requests": "1",
                "Pragma": "no-cache",
                "Cache-Control": "no-cache"
            },
            onload: function (response) {
                resolve(response.responseText)
            },
            onerror: function (error) {
                reject(error)
            }
        })
    })
}

function _PromissAll(promises, progressCallback) {
    let count = 0;
    progressCallback(0);
    for (const p of promises) {
        p.then(() => {
            count++;
            progressCallback((count * 100) / promises.length);
        });
    }
    return Promise.all(promises);
}


function GetTag() {
    const array= document.querySelectorAll('.tagshow')
    var raw=""
    array.forEach(function(i){
      raw+=i.textContent
    })
    raw=raw.replace(/\+TAG.*/g,"").replace(/^.*?\[/,"[")
    raw=_Unescape2(raw)
    //console.log(raw)
    tag_global=raw
    return raw
}
function GetCategory() {
    let raw = document.querySelector('.asTBcell.uwconn label').textContent
    raw = raw.replace(/分類：/, '').replace(/ /g, '').replace(/\//g, '')
    if (raw.match(/[漢汉]化/)){
      category_global="[汉化]"
      return "[汉化]"
    }
    else if(raw.match(/日[语語文]/)){
      category_global="[日语]"
      return "[日语]"
    }
    else if(raw.match(/English/)){
      category_global="[英语]"
      return "[英语]"
    }
    return ""
}

function GetTitle() {
    let raw = document.querySelector('#bodywrap h2').textContent
    raw=_Unescape(raw)
    raw=_Unescape2(raw)
    if (raw.includes("[")){
      title_global=raw
      return raw
    }
    const tag=tag_global
    if (tag.includes("[")){
      title_global=tag
      return tag
    }
    title_global=raw
    return raw
}



// =====================================================
//               Direct Download Methods
// =====================================================

async function ParseDownloadPageLink(url) {
    const result = await _Fetch(url);
    const match = result.match(/href=\"(\/download-index-aid-.*)"/);
    console.log(match[1]);
    return `${location.protocol}//${root_url_global}` + match[1];
}

async function ParseDownloadLink(target) {
    const result = await _Fetch(target.replace(root_url_global, location.hostname));
    //const result = await _Fetch(target);
    console.log(result)
    //const matches = result.match(/down_btn ads" href="(.*?)">/);
    const matches = result.match(/<span>&nbsp;本地下載一<\/span><\/a><a class="down_btn ads" href="(.+?)" target="_blank"><span>&nbsp;本地下載二<\/span><\/a>/);
    console.log(`match is ${matches[1]}`)
//    const rawLink = `${location.protocol}//` + _Unescape(matches[1]); // fixs download re-naming of server behaviour
    const rawLink = `${location.protocol}//` + matches[1]; // fixs download re-naming of server behaviour
    return new URL(rawLink).href;
}

async function send_url_by_websocket(event){
    event.preventDefault();

    const btn = document.querySelector('#YrDownloadBtn');
    const url=btn.href


    var socket;
    var ws = new WebSocket("ws://127.0.0.1:37777/test");
    socket = ws;
    function send_url(url) {
        socket.send(url);
    }
    ws.onopen = function() {
        console.log('连接成功');
        send_url("download")
        send_url(url)
        send_url(window.location.href)

    };

    ws.onmessage = function(evt) {
        var received_msg = evt.data;
        console.log('recv:' + received_msg + ' 发送完成');
        btn.innerHTML=received_msg
        setTimeout(() => btn.innerHTML="直接下載 (原生壓縮)", 500)
        ws.close()
    };

    ws.onclose = function() {
        var s = '断开了连接'
        console.log(s)
    };
}



// =====================================================
//               Download Image Methods
// =====================================================

function GetImageBase64(index, url) {
    return new Promise((resolve, reject) => {
        const extension = url.substring(url.lastIndexOf('.') + 1)
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            overrideMimeType: 'text/plain; charset=x-user-defined',
            onload: response => {
                let binary = "";
                const responseText = response.responseText;
                const responseTextLen = responseText.length;
                for (let i = 0; i < responseTextLen; i++) {
                    binary += String.fromCharCode(responseText.charCodeAt(i) & 255)
                }

                // Note there is no 'data:image/jpeg;base64,' Due to JSZip
                let src = btoa(binary)

                console.log(`Downloaded: ${index}.${extension}, src=${url}`)
                resolve({ 'index': index, 'base64': src, 'extension': extension })
            }
        })
    })
}

async function Compress(title, pics, progressCallback = null) {
    console.log(`Start Compress`)
    const zip = new JSZip();
    const folder = zip.folder(title);
    for (let i = 0; i < pics.length; ++i) {
        folder.file(`${pics[i].index}.${pics[i].extension}`, pics[i].base64, { base64: true })
    }
    const content = await zip.generateAsync({ type: "blob", streamFiles: true }, metadata => {
        progressCallback?.(metadata)
        console.log(`Compress Progress = ${metadata.percent.toFixed(2)} %`)
    })
    console.log(`All Done, Save to ${title}.zip`);
    return saveAs(content, `${title}.zip`);
}

async function FetchImageLinks(url) {
    const resp = await _Fetch(url)
    const dom = new DOMParser().parseFromString(resp, 'text/html')
    const blocks = dom.querySelectorAll('.gallary_item')
    const result = []
    for (let i = 0; i < blocks.length; ++i) {
        const a = blocks[i].querySelector('a')
        result.push(a.href)
    }
    return result
}

async function FetchImageSrc(url) {
    const resp = await _Fetch(url)
    const dom = new DOMParser().parseFromString(resp, 'text/html')
    const img = dom.querySelector('#photo_body img')
    return img.src
}

function GetPageCount() {
    const paginators = [...document.querySelectorAll('.f_left.paginator a')]
    if (paginators.length == 0) {
        // cases: current book has only one page
        return 1
    }
    const href = paginators.slice(-2, -1)[0].href
    return parseInt(href.substring(href.indexOf('photos-index-page-') + 'photos-index-page-'.length, href.indexOf('-aid-')))
}

function GetPageId() {
    // two formats:
    // https://wnacg.org/photos-index-aid-xxxxx.html
    // https://wnacg.org/photos-index-page-1-aid-xxxxx.html
    const href = location.href
    return location.href.substring(location.href.indexOf('-aid-') + '-aid-'.length, location.href.indexOf('.html'))
}

async function DownloadImages(event) {
    event.preventDefault();

    const block = document.querySelector('#YrDownloadImageStatusBlock');
    const parsingPageId = block.querySelector('#YrParsingPageId');
    const downloadImageStatus = block.querySelector('#YrDownloadImageStatus');

    block.style.display = 'block';

    const pageCount = GetPageCount()
    const pageId = GetPageId()

    downloadImageStatus.textContent = `解析頁面中 ...`

    const imageSrcs = []
    for (let i = 1; i <= pageCount; ++i) {
        parsingPageId.textContent = `第 ${i} 頁`
        const url = `https://${root_url_global}/photos-index-page-${i}-aid-${pageId}.html`
        const links = await FetchImageLinks(url)
        const tasks = links.map(x => FetchImageSrc(x))
        const srcs = await Promise.all(tasks)
        imageSrcs.push(srcs)
        console.log(url, srcs) // for debug
    }

    parsingPageId.textContent = `已完成, 共 ${pageCount} 頁`

    const tasks = imageSrcs.flat().map((x, idx) => GetImageBase64(idx, x))
    const images = await _PromissAll(tasks, progress => {
        downloadImageStatus.textContent = `解析 ${parseInt(0.01 * progress * tasks.length)} / ${tasks.length} 圖片中 ...`
    })


    const results = await Compress(title_and_category_global, images, metadata => {
        downloadImageStatus.textContent = `壓縮中 (${metadata.percent.toFixed(2)} %)`
    })

    return results
}

// =====================================================
//               Search Methods
// =====================================================

function splitname(t_string){
  let str1=''
  let str2=''
  //const match = t_string.match(/^.*?\[.*?\((.*?)\)\](.*?)$/);
  const match = t_string.match(/^\[.*?\((.*?)\)\s*\](.*?)$/);
  if(match==null){
    //const match2=t_string.match(/^.*?\[(.*?)\](.*?)$/);
    const match2=t_string.match(/^\[(.*?)\](.*?)$/);
    if (match2==null){
      str2=t_string
    }
    else{
      str1=match2[1].trim()
      str2=match2[2]
    }
  }
  else{
    str1=match[1].trim()
    str2=match[2]
  }
  str2=str2.replace(/[\[\(].*?$/,'').trim()
  return [str1,str2]
}

function display_str(str_1){
    $("body").append(" <div id='flowwindow' style='right: 10px;top: 50px;background: #EEEEEE;color:#000000;overflow: auto;z-index: 9999;position: fixed;padding:5px;text-align:left;width: auto;min-width:200px;max-width:700px;height:auto;max-height:400px;scrollbars=yes;border-bottom-left-radius: 4px;border-bottom-right-radius: 4px;border-top-left-radius: 4px;border-top-right-radius: 4px;'>"+str_1+"</div>");
    //$("body").append(" <div id='flowwindow' style='right: 10px;top: 50px;background: #EEEEEE;color:#000000;overflow: auto;z-index: 9999;position: fixed;padding:5px;text-align:left;width: auto;min-width:200px;max-width:700px;height:auto;min-height:600px;scrollbars=yes;border-bottom-left-radius: 4px;border-bottom-right-radius: 4px;border-top-left-radius: 4px;border-top-right-radius: 4px;'>"+str_1+"</div>");
    function set_minsize(){
        var oDiv = document.getElementById("flowwindow");
        const width_orgin=document.documentElement.clientWidth
        var count=0
        //console.log(width_orgin)
        oDiv.ondblclick = function(){
        //oDiv.style.width = "auto";
            if(count==0){
              oDiv.style.height ="50px";
              count++
            }
            else{
              oDiv.style.height =width_orgin+"px";
              count--
            }
        }
    }
    set_minsize()
}

function add_change_title_txt(){
    var txtelement = `<a>标题:</ a><input type="text" value=${title_and_category_global} id="title_ex" style="width:400px"><br />`
    const root = document.querySelector('#flowwindow')
    root.insertAdjacentHTML("afterbegin",txtelement)
    document.querySelector('#title_ex').value=title_and_category_global
}

function add_change_title_btn(){
    var btnelement = `<br /><a id="ChangeTitleBtn" class="btn" style="width:80px;height:15px;border:2px solid red;background-color:green;margin-right: 10px" >改变Title</ a>`;
    const root = document.querySelector("#title_ex");
    root.insertAdjacentHTML('afterend', btnelement);
    document.querySelector("#ChangeTitleBtn").innerHTML="改变Title"
    function change_title(event){
        event.preventDefault();
        var btn=document.querySelector("#ChangeTitleBtn");
        var txt=document.querySelector("#title_ex")
        var btndl=document.querySelector("#YrDownloadBtn")
        const downloadLinkpre=btndl.href.replace(/\.zip\?n=.*/,'.zip?n=')
        if(btn.innerHTML=="改变Title"){
            title_and_category_global=txt.value
            title_and_category_global=title_and_category_global.replace(":","：")
            btndl.href=downloadLinkpre+encodeURIComponent(title_and_category_global)
            //console.log(btndl.href)
            txt.disabled=true
            btn.innerHTML="Title已变更"
        }
        else{
            title_and_category_global=title_global+category_global
            txt.value=title_and_category_global
            btndl.href=downloadLinkpre+encodeURIComponent(title_and_category_global)
            //console.log(btndl.href)
            txt.disabled=false
            btn.innerHTML="改变Title"
        }
    }
    var btnelement_=document.querySelector("#ChangeTitleBtn")
    btnelement_.addEventListener('click', change_title);
}

function add_similardb_btn(){
    var btnelement = `<a id="AddSimDb" class="btn" style="width:80px;height:15px;border:2px solid red;background-color:green;margin-right: 10px">SimDb追加</ a><br />`;
    const root = document.querySelector("#ChangeTitleBtn");
    root.insertAdjacentHTML('afterend', btnelement);
    function send_title_toDb_by_websocket(event){
        event.preventDefault();
        var socket;
        var ws = new WebSocket("ws://127.0.0.1:37777/test");
        socket = ws;
        var btnelement_2=document.querySelector("#AddSimDb")
        function send_url(url) {
            socket.send(url);
        }
        ws.onopen = function() {
            console.log('连接成功');
            send_url("simdb")
            send_url(title_and_category_global)
        };

        ws.onmessage = function(evt) {
            var received_msg = evt.data;
            console.log('recv:' + received_msg + ' 发送完成');
            btnelement_2.innerHTML=received_msg
            setTimeout(() => btnelement_2.innerHTML="SimDb追加", 500)
            ws.close()
        };

        ws.onclose = function() {
            var s = '断开了连接'
            console.log(s)
        };
    }

    var btnelement_=document.querySelector("#AddSimDb")
    btnelement_.addEventListener('click', send_title_toDb_by_websocket);

}
function add_block_txt(){
    var txtelement = `<br />作者:<input type="text" value=${author_global} id="block_ex" style="width:400px">`
    const root = document.querySelector('#AddSimDb')
    root.insertAdjacentHTML("afterend",txtelement)
    document.querySelector('#block_ex').value=author_global
}

function add_blockdb_btn(){
    var btnelement = `<br /><a id="AddBlockDb" class="btn" style="width:80px;height:15px;border:2px solid red;background-color:green;margin-right: 10px">BlockDB追加</ a>`;
    const root = document.querySelector("#block_ex");
    root.insertAdjacentHTML('afterend', btnelement);
    function send_title_toBlock_Db_by_websocket(event){
        event.preventDefault();
        var socket;
        var ws = new WebSocket("ws://127.0.0.1:37777/test");
        socket = ws;
        var btnelement_2=document.querySelector("#AddBlockDb")
        function send_url(url) {
            socket.send(url);
        }
        ws.onopen = function() {
            console.log('连接成功');
            send_url("block")
            const author=document.querySelector('#block_ex').value
            send_url(author)
        };

        ws.onmessage = function(evt) {
            var received_msg = evt.data;
            console.log('recv:' + received_msg + ' 发送完成');
            btnelement_2.innerHTML=received_msg
            setTimeout(() => btnelement_2.innerHTML="BlockDB追加", 500)
            ws.close()
        };

        ws.onclose = function() {
            var s = '断开了连接'
            console.log(s)
        };
    }

    var btnelement_=document.querySelector("#AddBlockDb")
    btnelement_.addEventListener('click', send_title_toBlock_Db_by_websocket);

}

async function search_title_by_websocket(author,title){

    var socket;
    var ws = new WebSocket("ws://127.0.0.1:37777/test");
    socket = ws;

    function send_url(title) {
        socket.send(title);
    }
    ws.onopen = function() {
        console.log('连接成功');
        send_url("search")
        send_url(author)
        send_url(title)
    };

    ws.onmessage = function(evt) {
        var received_msg = evt.data;
        received_msg=tag_global+"<br />"+received_msg
        //console.log(received_msg)
        display_str(received_msg)
        add_change_title_txt()
        add_change_title_btn()
        add_similardb_btn()
        add_block_txt()
        add_blockdb_btn()
        ws.close();
    };

    ws.onclose = function() {
        var s = '断开了连接'
        console.log(s)
    };
}

// =====================================================
//                 General Setups
// =====================================================

async function SetupDirectDownloadButton() {
    const downloadPageLink = await ParseDownloadPageLink(location.href);
    let downloadLink = await ParseDownloadLink(downloadPageLink);

    console.log(`downloadPageLink = ${downloadPageLink}`) // for debug!
    console.log(`downloadLink = ${downloadLink}`); // for debug!

    // setup DOMs
    //const downloadLink="https://z19.wzip.ru/down/1862/81794a0b83862abb4165d4724d7a0a36.zip?n=[%E3%82%80%E3%81%8A%E3%81%A8%E3%83%A9%E3%83%9C%20(%E3%82%80%E3%81%8A%E3%81%A8)]%20%E3%83%87%E3%83%AA%E3%83%98%E3%83%AB%E5%91%BC%E3%82%93%E3%81%A0%E3%82%89%E3%82%B5%E3%82%AA%E3%83%AA%E3%81%8C%E6%9D%A5%E3%81%A6%E3%81%9D%E3%81%AE%E3%81%BE%E3%81%BE%E3%81%88%E3%81%A3%E3%81%A1%E3%81%99%E3%82%8B%E3%81%BB%E3%82%93%20(%E3%83%96%E3%83%AB%E3%83%BC%E3%82%A2%E3%83%BC%E3%82%AB%E3%82%A4%E3%83%96)%20[%E7%A9%BA%E6%B0%97%E7%B3%BB%E2%98%86%E6%BC%A2%E5%8C%96]%20[DL%E7%89%88]"
    const downloadLinkpre=downloadLink.replace(/\.zip\?n=.*/,'.zip?n=')
    var title_all=downloadLinkpre+encodeURIComponent(title_and_category_global)
    //title_all=ThunderEncode(title_all)
    const downloadZipBtnElement = `<a id="YrDownloadBtn" class="btn" style="width:130px;" target="_blank" rel="noreferrer noopener" href=${title_all} >直接下載 (原生壓縮)</ a>`;
    const statusElement = `
    <div id="YrDirectDownloadStatusBlock" style="display: none;">
      <div>重試次數: <span id="YrRetryCount"></span></div>
      <div style="padding-bottom: 3px;">目前狀態: <span id="YrStatus" style="color: blueviolet; font-weight: bold; font-size: 1.5em;"></span></div>
      <div>最後重試時間: <span id="YrLastRetry"></span></div>
    </div>`;
    const root = document.querySelector('.asTBcell.uwthumb');
    root.insertAdjacentHTML('beforeend', downloadZipBtnElement);
    root.insertAdjacentHTML('beforeend', statusElement);
    const downloadZipBtn = document.querySelector('#YrDownloadBtn');
    //downloadZipBtn.addEventListener('click', DirectDownload);
    downloadZipBtn.addEventListener('click', send_url_by_websocket);
}

async function SetupDownloadImageButton() {
    // setup DOMs
    const downloadImageBtnElement = `<a id="YrDownloadImageBtn" class="btn" style="width:130px;" target="_blank" rel="noreferrer noopener" href=#>直接下載 (網站圖片)</a>`;
    const statusElement = `
    <div id="YrDownloadImageStatusBlock" style="display: none;">
      <div>解析頁面: <span id="YrParsingPageId" style="color: blueviolet; font-weight: bold;"></span></div>
      <div style="padding-bottom: 3px;">目前狀態: <span id="YrDownloadImageStatus" style="color: blueviolet; font-weight: bold;"></span></div>
    </div>`;
    const root = document.querySelector('.asTBcell.uwthumb');
    root.insertAdjacentHTML('beforeend', downloadImageBtnElement);
    root.insertAdjacentHTML('beforeend', statusElement);

    const downloadImageBtn = document.querySelector('#YrDownloadImageBtn');
    downloadImageBtn.addEventListener('click', DownloadImages);
}

async function Search_name(){
  const s_title=title_global
  const s_array=splitname(s_title)
  author_global=s_array[0]
  name_global=s_array[1]
  await search_title_by_websocket(author_global,name_global)
}

async function Run() {
    GetTag()
    GetTitle()
    GetCategory()
    title_and_category_global=title_global+category_global
    //console.log(title_global)
    //console.log(title_and_category_global)
    await SetupDirectDownloadButton();
    await SetupDownloadImageButton();
    await Search_name();
}
Run();