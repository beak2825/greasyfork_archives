// ==UserScript==
// @name         アイヌ語版ウィキペディア、Aynuwikiの表記変換
// @namespace    https://lit.link/toracatman
// @version      2026-01-26
// @description  アイヌ語版ウィキペディア、Aynuwikiに表記変換器を追加します。
// @author       トラネコマン
// @match        https://incubator.wikimedia.org/*Wp/ain*
// @match        https://incubator.wikimedia.org/*Wp%2Fain*
// @match        https://wiki.aynu.org/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/513558/%E3%82%A2%E3%82%A4%E3%83%8C%E8%AA%9E%E7%89%88%E3%82%A6%E3%82%A3%E3%82%AD%E3%83%9A%E3%83%87%E3%82%A3%E3%82%A2%E3%80%81Aynuwiki%E3%81%AE%E8%A1%A8%E8%A8%98%E5%A4%89%E6%8F%9B.user.js
// @updateURL https://update.greasyfork.org/scripts/513558/%E3%82%A2%E3%82%A4%E3%83%8C%E8%AA%9E%E7%89%88%E3%82%A6%E3%82%A3%E3%82%AD%E3%83%9A%E3%83%87%E3%82%A3%E3%82%A2%E3%80%81Aynuwiki%E3%81%AE%E8%A1%A8%E8%A8%98%E5%A4%89%E6%8F%9B.meta.js
// ==/UserScript==

let c = {
    "ain": {
        n: "Itakitokpa / イタキトㇰパ",
        c: [],
        f: "",
    },
    "ain-Latn": {
        n: "Rómaunkur Itakitokpa",
        c: [],
        f: "",
    },
    "ain-Kana": {
        n: "カタカナ イタキトㇰパ",
        c: [
            ["á", "a"], ["í", "i"], ["ú", "u"], ["é", "e"], ["ó", "o"],
            [", ?", "、"], ["\\. ?", "。"], ["! ?", "！"], ["\\? ?", "？"],
            [" ?“", "「"], ["” ?", "」"], [" ?‘", "『"], ["’ ?", "』"],
            ["(?<=[a-z])-(?=[a-z])", "・"], ["(?<=[a-z])=|=(?=[a-z])", "゠"],
            ["ih", "iㇶ"], ["uh", "uㇷ"], ["eh", "eㇸ"], ["oh", "oㇹ"], ["h", "ㇵ"],
            ["iĥ", "iㇶ‌̣"], ["uĥ", "uㇷ‌̣"], ["eĥ", "eㇸ‌̣"], ["oĥ", "oㇹ‌̣"], ["ĥ", "ㇵ‌̣"],
            ["ar", "aㇻ"], ["ir", "iㇼ"], ["er", "eㇾ"], ["or", "oㇿ"], ["r", "ㇽ"],
            ["[ㇵ-ㇹ]a", "ハ"], ["[ㇵ-ㇹ]i", "ヒ"], ["[ㇵ-ㇹ]u", "フ"], ["[ㇵ-ㇹ]e", "ヘ"], ["[ㇵ-ㇹ]o", "ホ"],
            ["[ㇵ-ㇹ]‌̣a", ""], ["[ㇵ-ㇹ]‌̣i", ""], ["[ㇵ-ㇹ]‌̣u", ""], ["[ㇵ-ㇹ]‌̣e", ""], ["[ㇵ-ㇹ]‌̣o", ""], ["ㇷ‌̣", "‌̣"],
            ["[ㇻ-ㇿ]a", "ラ"], ["[ㇻ-ㇿ]i", "リ"], ["[ㇻ-ㇿ]u", "ル"], ["[ㇻ-ㇿ]e", "レ"], ["[ㇻ-ㇿ]o", "ロ"],
            ["ka", "カ"], ["ki", "キ"], ["ku", "ク"], ["ke", "ケ"], ["ko", "コ"], ["k", "ㇰ"],
            ["ga", "ガ"], ["gi", "ギ"], ["gu", "グ"], ["ge", "ゲ"], ["go", "ゴ"], ["g", "ㇰ゙"],
            ["ċa", ""], ["ċi", ""], ["ċu", "ツ"], ["ċe", ""], ["ċo", ""],
            ["sa", "サ"], ["ṡi", ""], ["su", "ス"], ["se", "セ"], ["so", "ソ"],
            ["ŝa", ""], ["[sŝ]i", "シ"], ["ŝu", ""], ["ŝe", ""], ["ŝo", ""],
            ["d̂a", ""], ["d̂̇i", ""], ["d̂u", "ヅ"], ["d̂e", ""], ["d̂o", ""],
            ["za", "ザ"], ["żi", ""], ["zu", "ズ"], ["ze", "ゼ"], ["zo", "ゾ"],
            ["ĝa", ""], ["d̂i|ĝi", "ヂ"], ["ĝu", ""], ["ĝe", ""], ["ĝo", ""],
            ["ĵa", ""], ["[ĵz]i", "ジ"], ["ĵu", ""], ["ĵe", ""], ["ĵo", ""],
            ["ca", ""], ["ci", "チ"], ["cu", ""], ["ce", ""], ["co", ""],
            ["ċ", ""], ["ṡ", "ㇲ"], ["[sŝ]", "ㇱ"], ["d̂̇", "ッ゙"], ["ż", "ㇲ゙"], ["d[ĵz]", "𛅚゙"], ["[ĵz]", "ㇱ゙"], ["c", "𛅚"],
            ["ta", "タ"], ["ti", ""], ["tu", ""], ["te", "テ"], ["to", "ト"], ["t", "ㇳ"],
            ["da", "ダ"], ["di", ""], ["du", ""], ["de", "デ"], ["do", "ド"], ["d", "ㇳ゙"],
            ["na", "ナ"], ["ni", "ニ"], ["nu", "ヌ"], ["ne", "ネ"], ["no", "ノ"], ["n(?=゠[aiueo])", "ㇴ"], ["n", "ン"],
            ["ḣu", ""],
            ["ba", "バ"], ["bi", "ビ"], ["bu", "ブ"], ["be", "ベ"], ["bo", "ボ"], ["b", "ㇷ゙"],
            ["pa", "パ"], ["pi", "ピ"], ["pu", "プ"], ["pe", "ペ"], ["po", "ポ"], ["p", ""],
            ["ma", "マ"], ["mi", "ミ"], ["mu", "ム"], ["me", "メ"], ["mo", "モ"], ["m", "ㇺ"],
            ["ya", "ヤ"], ["yi", "𛄠"], ["yu", "ユ"], ["ye", "𛄡"], ["yo", "ヨ"], ["y", ""],
            ["wa", "ワ"], ["wi", "ヰ"], ["wu", "𛄢"], ["we", "ヱ"], ["wo", "ヲ"], ["w", ""],
            ["va", "ヷ"], ["vi", "ヸ"], ["vu", ""], ["ve", "ヹ"], ["vo", "ヺ"], ["v", "𛅭゙"],
            ["fa", ""], ["fi", ""], ["fu", ""], ["fe", ""], ["fo", ""], ["f", "𛅭゚"],
            ["a", "ア"],  ["i", "イ"],  ["u", "ウ"],  ["e", "エ"],  ["o", "オ"],
            ["ʼ", ""]
        ],
        f: "ig"
    },
    "ain-KanaSub": {
        n: "カタカナ イコㇳチｬネㇷ゚",
        c: [
            ["á", "a"], ["í", "i"], ["ú", "u"], ["é", "e"], ["ó", "o"],
            [", ?", "、"], ["\\. ?", "。"], ["! ?", "！"], ["\\? ?", "？"],
            [" ?“", "「"], ["” ?", "」"], [" ?‘", "『"], ["’ ?", "』"],
            ["(?<=[a-z])-(?=[a-z])", "・"], ["(?<=[a-z])=|=(?=[a-z])", "゠"],
            ["ih", "iㇶ"], ["uh", "uㇷ"], ["eh", "eㇸ"], ["oh", "oㇹ"], ["h", "ㇵ"],
            ["iĥ", "iㇶ‌̣"], ["uĥ", "uㇷ‌̣"], ["eĥ", "eㇸ‌̣"], ["oĥ", "oㇹ‌̣"], ["ĥ", "ㇵ‌̣"],
            ["ar", "aㇻ"], ["ir", "iㇼ"], ["er", "eㇾ"], ["or", "oㇿ"], ["r", "ㇽ"],
            ["[ㇵ-ㇹ]a", "ハ"], ["[ㇵ-ㇹ]i", "ヒ"], ["[ㇵ-ㇹ]u", "フ"], ["[ㇵ-ㇹ]e", "ヘ"], ["[ㇵ-ㇹ]o", "ホ"],
            ["[ㇵ-ㇹ]‌̣a", "ハ‌̣"], ["[ㇵ-ㇹ]‌̣i", "ヒ‌̣"], ["[ㇵ-ㇹ]‌̣u", "ホｩ‌̣"], ["[ㇵ-ㇹ]‌̣e", "ヘ‌̣"], ["[ㇵ-ㇹ]‌̣o", "ホ‌̣"], ["ㇷ‌̣", "ㇹｩ‌̣"],
            ["[ㇻ-ㇿ]a", "ラ"], ["[ㇻ-ㇿ]i", "リ"], ["[ㇻ-ㇿ]u", "ル"], ["[ㇻ-ㇿ]e", "レ"], ["[ㇻ-ㇿ]o", "ロ"],
            ["ka", "カ"], ["ki", "キ"], ["ku", "ク"], ["ke", "ケ"], ["ko", "コ"], ["k", "ㇰ"],
            ["ga", "ガ"], ["gi", "ギ"], ["gu", "グ"], ["ge", "ゲ"], ["go", "ゴ"], ["g", "ㇰ゙"],
            ["ċa", "ツｧ"], ["ċi", "ツｨ"], ["ċu", "ツ"], ["ċe", "ツｪ"], ["ċo", "ツｫ"],
            ["sa", "サ"], ["ṡi", "スｨ"], ["su", "ス"], ["se", "セ"], ["so", "ソ"],
            ["ŝa", "シｬ"], ["[sŝ]i", "シ"], ["ŝu", "シｭ"], ["ŝe", "シｪ"], ["ŝo", "シｮ"],
            ["d̂a", "ヅｧ"], ["d̂̇i", "ヅｨ"], ["d̂u", "ヅ"], ["d̂e", "ヅｪ"], ["d̂o", "ヅｫ"],
            ["za", "ザ"], ["żi", "ズｨ"], ["zu", "ズ"], ["ze", "ゼ"], ["zo", "ゾ"],
            ["ĝa", "ヂｬ"], ["d̂i|ĝi", "ヂ"], ["ĝu", "ヂｭ"], ["ĝe", "ヂｪ"], ["ĝo", "ヂｮ"],
            ["ĵa", "ジｬ"], ["[ĵz]i", "ジ"], ["ĵu", "ジｭ"], ["ĵe", "ジｪ"], ["ĵo", "ジｮ"],
            ["ca", "チｬ"], ["ci", "チ"], ["cu", "チｭ"], ["ce", "チｪ"], ["co", "チｮ"],
            ["ċ", "ッﾒ"], ["ṡ", "ㇲ"], ["[sŝ]", "ㇱ"], ["d̂̇", "ッ゙"], ["ż", "ㇲ゙"], ["d[ĵz]", "ﾁヂ"], ["[ĵz]", "ㇱ゙"], ["c", "ﾁチ"],
            ["ta", "タ"], ["ti", "テｨ"], ["tu", "トｩ"], ["te", "テ"], ["to", "ト"], ["t", "ㇳ"],
            ["da", "ダ"], ["di", "デｨ"], ["du", "ドｩ"], ["de", "デ"], ["do", "ド"], ["d", "ㇳ゙"],
            ["na", "ナ"], ["ni", "ニ"], ["nu", "ヌ"], ["ne", "ネ"], ["no", "ノ"], ["n(?=゠[aiueo])", "ㇴ"], ["n", "ン"],
            ["ḣu", "ホｩ"],
            ["ba", "バ"], ["bi", "ビ"], ["bu", "ブ"], ["be", "ベ"], ["bo", "ボ"], ["b", "ㇷ゙"],
            ["pa", "パ"], ["pi", "ピ"], ["pu", "プ"], ["pe", "ペ"], ["po", "ポ"], ["p", "ㇷ゚"],
            ["ma", "マ"], ["mi", "ミ"], ["mu", "ム"], ["me", "メ"], ["mo", "モ"], ["m", "ㇺ"],
            ["ya", "ヤ"], ["yi", "イｨ"], ["yu", "ユ"], ["ye", "イｪ"], ["yo", "ヨ"], ["y", "ィ‌̣"],
            ["wa", "ワ"], ["wi", "ヰ"], ["wu", "ウｩ"], ["we", "ヱ"], ["wo", "ヲ"], ["w", "ゥ‌̣"],
            ["va", "ヷ"], ["vi", "ヸ"], ["vu", "ウｩ゙"], ["ve", "ヹ"], ["vo", "ヺ"], ["v", "ゥｩ゙"],
            ["fa", "ワ゚"], ["fi", "ヰ゚"], ["fu", "ウｩ゚"], ["fe", "ヱ゚"], ["fo", "ヲ゚"], ["f", "ゥｩ゚"],
            ["a", "ア"],  ["i", "イ"],  ["u", "ウ"],  ["e", "エ"],  ["o", "オ"],
            ["ʼ", ""]
        ],
        f: "ig"
    },
    "ain-Hiragana": {
        n: "ひらかな いたきと<small>く</small>ぱ",
        c: [
            ["á", "a"], ["í", "i"], ["ú", "u"], ["é", "e"], ["ó", "o"],
            [", ?", "、"], ["\\. ?", "。"], ["! ?", "！"], ["\\? ?", "？"],
            [" ?“", "「"], ["” ?", "」"], [" ?‘", "『"], ["’ ?", "』"],
            ["(?<=[a-z])-(?=[a-z])", "・"], ["(?<=[a-z])=|=(?=[a-z])", "゠"],
            ["ih", "i𛅂"], ["uh", "u𛅃"], ["eh", "e𛅄"], ["oh", "o𛅅"], ["h", "𛅁"],
            ["iĥ", "i𛅂‌̣"], ["uĥ", "u𛅃‌̣"], ["eĥ", "e𛅄‌̣"], ["oĥ", "o𛅅‌̣"], ["ĥ", "𛅁‌̣"],
            ["ar", "a𛅋"], ["ir", "i𛅌"], ["er", "e𛅎"], ["or", "o𛅏"], ["r", "𛅍"],
            ["[𛅁-𛅅]a", "は"], ["[𛅁-𛅅]i", "ひ"], ["[𛅁-𛅅]u", "ふ"], ["[𛅁-𛅅]e", "へ"], ["[𛅁-𛅅]o", "ほ"],
            ["[𛅁-𛅅]‌̣a", ""], ["[𛅁-𛅅]‌̣i", ""], ["[𛅁-𛅅]‌̣u", ""], ["[𛅁-𛅅]‌̣e", ""], ["[𛅁-𛅅]‌̣o", ""], ["𛅃‌̣", "‌̣"],
            ["[𛅋-𛅏]a", "ら"], ["[𛅋-𛅏]i", "り"], ["[𛅋-𛅏]u", "る"], ["[𛅋-𛅏]e", "れ"], ["[𛅋-𛅏]o", "ろ"],
            ["ka", "か"], ["ki", "き"], ["ku", "く"], ["ke", "け"], ["ko", "こ"], ["k", "𛄱"],
            ["ga", "が"], ["gi", "ぎ"], ["gu", "ぐ"], ["ge", "げ"], ["go", "ご"], ["g", "𛄱゙"],
            ["ċa", ""], ["ċi", ""], ["ċu", "つ"], ["ċe", ""], ["ċo", ""],
            ["sa", "さ"], ["ṡi", ""], ["su", "す"], ["se", "せ"], ["so", "そ"],
            ["ŝa", "𛁃"], ["[sŝ]i", "し"], ["ŝu", ""], ["ŝe", ""], ["ŝo", ""],
            ["d̂a", ""], ["d̂̇i", ""], ["d̂u", "づ"], ["d̂e", ""], ["d̂o", ""],
            ["za", "ざ"], ["żi", ""], ["zu", "ず"], ["ze", "ぜ"], ["zo", "ぞ"],
            ["ĝa", ""], ["d̂i|ĝi", "ぢ"], ["ĝu", ""], ["ĝe", ""], ["ĝo", ""],
            ["ĵa", ""], ["[ĵz]i", "じ"], ["ĵu", ""], ["ĵe", ""], ["ĵo", ""],
            ["ca", ""], ["ci", "ち"], ["cu", ""], ["ce", ""], ["co", ""],
            ["ċ", ""], ["ṡ", "𛄵"], ["[sŝ]", "𛄴"], ["d̂̇", "っ゙"], ["ż", "𛄵゙"], ["d[ĵz]", "𛄹゙"], ["[ĵz]", "𛄴゙"], ["c", "𛄹"],
            ["ta", "た"], ["ti", ""], ["tu", "𛁭"], ["te", "て"], ["to", "と"], ["t", "𛄻"],
            ["da", "だ"], ["di", ""], ["du", ""], ["de", "で"], ["do", "ど"], ["d", "𛄻゙"],
            ["na", "な"], ["ni", "に"], ["nu", "ぬ"], ["ne", "ね"], ["no", "の"], ["n(?=゠[aiueo])", "𛄾"], ["n", "ん"],
            ["ḣu", "𛀹"],
            ["ba", "ば"], ["bi", "び"], ["bu", "ぶ"], ["be", "べ"], ["bo", "ぼ"], ["b", "𛅃゙"],
            ["pa", "ぱ"], ["pi", "ぴ"], ["pu", "ぷ"], ["pe", "ぺ"], ["po", "ぽ"], ["p", "𛅃゚"],
            ["ma", "ま"], ["mi", "み"], ["mu", "む"], ["me", "め"], ["mo", "も"], ["m", "𛅈"],
            ["ya", "や"], ["yi", "𛀆"], ["yu", "ゆ"], ["ye", "𛀁"], ["yo", "よ"], ["y", ""],
            ["wa", "わ"], ["wi", "ゐ"], ["wu", "𛄟"], ["we", "ゑ"], ["wo", "を"], ["w", ""],
            ["va", ""], ["vi", ""], ["vu", ""], ["ve", ""], ["vo", ""], ["v", "𛅪゙"],
            ["fa", ""], ["fi", ""], ["fu", ""], ["fe", ""], ["fo", ""], ["f", "𛅪゚"],
            ["a", "あ"],  ["i", "い"],  ["u", "う"],  ["e", "え"],  ["o", "お"],
            ["ʼ", ""]
        ],
        f: "igu"
    },
    "ain-Cyrl": {
        n: "Кирир Итакитокпа",
        c: [
            ["Á", "Á"], ["á", "á"], ["Í", "Í"], ["í", "í"],
            ["Ú", "Ú"], ["ú", "ú"], ["É", "É"], ["é", "é"],
            ["Ó", "Ó"], ["ó", "ó"],
            ["A", "А"], ["a", "а"], ["I", "И"], ["i", "и"],
            ["U", "У"], ["u", "у"], ["E", "Э"], ["e", "э"],
            ["O", "О"], ["o", "о"],
            ["K", "К"], ["k", "к"], ["G", "Г"], ["g", "г"],
            ["S", "С"], ["s", "с"], ["Z", "З"], ["z", "з"],
            ["Ṡ", "С̇"], ["ṡ", "с̇"], ["Ż", "З̇"], ["ż", "з̇"],
            ["Ŝ", "Ш"], ["ŝ", "ш"], ["Ĵ", "Ж"], ["ĵ", "ж"],
            ["C", "Ч"], ["c", "ч"], ["Ċ", "Ц"], ["ċ", "ц"],
            ["T", "Т"], ["t", "т"], ["D", "Д"], ["d", "д"],
            ["N", "Н"], ["n", "н"],
            ["Ḣ", "Һ̇"], ["ḣ", "һ̇"], ["H", "Һ"], ["h", "һ"],
            ["Ĥ", "Х"], ["ĥ", "х"],
            ["P", "П"], ["p", "п"], ["B", "Б"], ["b", "б"],
            ["M", "М"], ["m", "м"],
            ["Y", "Ј"], ["y", "ј"],
            ["R", "Р"], ["r", "р"],
            ["W", "Ԝ"], ["w", "ԝ"], ["V", "В"], ["v", "в"],
            ["F", "Ф"], ["f", "ф"]
        ],
        f: "g"
    }
}

function changeNotation(lang) {
    let style = document.getElementById("font-style");
    if (lang == "ain-Kana" || lang == "ain-Hiragana") {
        style.textContent = '@font-face{font-family:"Mkana+";src:local("Mkana+"),url("https://toracatman.github.io/fonts/mkanaplus.woff2")format("woff2"),url("https://toracatman.github.io/fonts/mkanaplus.woff")format("woff");font-display:swap;}[data-roman],.mw-body-content [data-roman]{font-family:"Mkana+";}[data-exclude],.mw-body-content [data-exclude]{font-family:sans-serif;}';
    }
    else if (lang == "ain-Cyrl") {
        style.textContent = '[data-roman],.mw-body-content [data-roman]{font-family:"Arial";}[data-exclude],.mw-body-content [data-exclude]{font-family:sans-serif;}';
    }
    else {
        style.textContent = "";
    }

    let a = document.querySelectorAll('.mw-parser-output *,#mw-panel-toc-list :nth-child(n+2) *,#firstHeading *,#catlinks ul *,.mw-prefixindex-list *,.mw-allpages-chunk *,.mw-category *');
    if (a == null) return;
    for (let i = 0; i < a.length; i++) {
        if (a[i].getAttribute("data-exclude")) continue;
        if (!(a[i].hasChildNodes())) continue;
        let h = (t) => {
            let roman = t.getAttribute("data-roman");
            let b = roman ?? t.textContent;
            let s = b.split(" | ");
            if (lang == "ain" || lang == "ain-Latn") {
                if (roman != null) {
                    b = roman;
                    t.removeAttribute("data-roman");
                }
                return b;
            }
            if (roman == null) t.setAttribute("data-roman", b);
            let p = [];
            s[0] = s[0].replace(/[A-Z]{2,}|[A-Z]\d|[0-9↊-↏-]+(?=p|pe|n|iw)|[0-9↊-↏-]+[A-Za-z]+|\.{2,}/g, (m) => {
                p.push(m);
                return "\x1b";
            });
            for (let j = 0; j < c[lang].c.length; j++) {
                s[0] = s[0].replace(new RegExp(c[lang].c[j][0], c[lang].f), c[lang].c[j][1]);
            }
            let ss = s[0].split("\x1b");
            s[0] = "";
            for (let i = 0; i < p.length; i++) {
                s[0] += ss[i] + p[i];
            }
            s[0] += ss[p.length];
            return s.join(" | ");
        }
        if (a[i].childElementCount == 0) {
            a[i].textContent = h(a[i]);
        }
        else {
            let t = a[i];
            let p = document.createTextNode("");
            t.replaceWith(p);
            let r = document.createDocumentFragment();
            let e = t.firstElementChild;
            while (e != null) {
                e.replaceWith(document.createTextNode("\x1a"));
                r.appendChild(e);
                e = t.firstElementChild;
            }
            let ss = h(t).split("\x1a");
            t.textContent = "";
            t.appendChild(document.createTextNode(ss[0]));
            for (let j = 1; j < ss.length; j++) {
                t.appendChild(r.firstElementChild);
                t.appendChild(document.createTextNode(ss[j]));
            }
            p.replaceWith(t);
        }
    }
}

(() => {
    let pcsite = document.getElementById("mw-mf-viewport") == null;
    let assoc;
    let h1;
    if (pcsite) {
        assoc = document.getElementById("p-associated-pages");
        if (assoc == null) return;
    }
    else {
        h1 = document.getElementById("firstHeading");
        if (h1 == null) return;
    }

    let style = document.createElement("style");
    style.id = "font-style";
    document.body.appendChild(style);

    let a = document.querySelectorAll('style,.mw-parser-output [lang]:not([lang^="ain"]),.mw-parser-output [lang]:not([lang^="ain"]) *,.mw-editsection *,.external,pre');
    if (a != null) {
        for (let i = 0; i < a.length; i++) {
            a[i].setAttribute("data-exclude", "true");
        }
    }

    if (pcsite) {
        let dropdown = assoc.nextElementSibling;
        dropdown.classList.remove("emptyPortlet");

        let label = dropdown.querySelector(".vector-dropdown-label-text");
        label.textContent = "Itakitokpa / イタキトㇰパ";

        let variants = dropdown.lastElementChild.firstElementChild;
        variants.classList.remove("emptyPortlet");

        let list = variants.querySelector(".vector-menu-content-list");
        list.innerHTML = "";
        for (let i in c) {
            let varlang = document.createElement("li");
            varlang.id = `ca-varlang-${i}`;
            varlang.classList.add(`ca-variants-${i}`);
            varlang.classList.add("mw-list-item");
            varlang.innerHTML = `<a href="#" lang="${i}" hreflang="${i}"><span>${c[i].n}</span></a>`;
            list.appendChild(varlang);
            varlang.querySelector("a").addEventListener("click", function(e) {
                label.innerHTML = c[this.lang].n;
                changeNotation(this.lang);
                localStorage.setItem("ain-lang", this.lang);
                e.preventDefault();
            });
        }

        let lang = localStorage.getItem("ain-lang");
        if (lang != null) {
            label.innerHTML = c[lang].n;
            changeNotation(lang);
        }
    }
    else {
        let list = document.createElement("select");
        list.id = "varlang-list";
        for (let i in c) {
            let varlang = document.createElement("option");
            varlang.value = i;
            varlang.textContent = c[i].n.replace(/<small>(.+?)<\/small>/g, "_$1");
            list.appendChild(varlang);
        }
        h1.after(list);
        list.addEventListener("change", function(e) {
            changeNotation(this.value);
            localStorage.setItem("ain-lang", this.value);
        });

        let lang = localStorage.getItem("ain-lang");
        if (lang != null) {
            list.value = lang;
            changeNotation(lang);
        }
    }
})();