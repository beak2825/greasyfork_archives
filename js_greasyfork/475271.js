// ==UserScript==
// @name            Twitter時計
// @name:en         Twitter Clock
// @name:ain        Twitter トケ
// @namespace       http://lit.link/toracatman
// @version         2026-01-15
// @description     Twitterに 時計を 表示します。
// @description:en  Display a Clock on Twitter.
// @description:ain Twitter タ トケ アヌ。
// @author          トラネコマン
// @match           https://x.com/*
// @icon            data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant           none
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/475271/Twitter%E6%99%82%E8%A8%88.user.js
// @updateURL https://update.greasyfork.org/scripts/475271/Twitter%E6%99%82%E8%A8%88.meta.js
// ==/UserScript==

/*
言語, ja: 日本語, en: 英語, ain: アイヌ語
Language, ja: Japanese, en: English, ain: Ainu
イタㇰ, ja: シサㇺ イタㇰ, en: インキリㇱクㇽ イタㇰ, ain: アヌ イタㇰ
*/
let language = "ja";

/*
進数, 10: 10進数, 12: 12進数, 20: 20進数
Base number, 10: decimal, 12: dozenal, 20: vigesimal
ソシンリㇳ チピㇱキ, 10: ワン リキ, 12: ペセ リキ, 20: ホㇳネ リキ
2〰︎20
*/
let base_num = 10;

/*
曜日の 色
0: 白のみ
1: 日: ピンク, 土: 青, 他: 白
2: 日: ピンク, 月: 紫, 火: オレンジ, 水: 灰色, 木: 緑, 金: 黄色, 土: 青

Color of Day
0: Only White
1: Sunday: Pink, Saturday: Blue, Other: White
2: Sunday: Pink, Monday: Purple, Tuesday: Orange, Wednesday: Gray, Thursday: Green, Friday: Yellow, Saturday: Blue

ト イロ
0: レタㇻ パテㇰ
1: トカト: ルフレ, トト: シニン, モㇱマ: レタㇻ
2: トカト: ルフレ, クンネト: コサネ, アペト: ホマネ, ワㇰカト: ルクンネ, チクニト: フキナネ, カネト: シケㇾペペウㇱ, トト: シニン
*/
let day_color = 2;

//true: 12, false: 24
let ap = false;

Number.prototype.convertBase = function(base) {
    let s = this.toString(base);
    let d = {a: "↊", b: "↋", c: "↌", d: "↍", e: "↎",
        f: "↏", g: "", h: "", i: "", j: ""};
    let t = "";
    for (let i = 0; i < s.length; i++) t += s[i] in d ? d[s[i]] : s[i];
    return t;
};

(() => {
    let mn = {
        ja: ["雅月", "菲月", "瑪月", "艾月", "緬月", "淳月", "茱月", "奥月", "摂月", "憶月", "衲月", "迪月", "繧月"],
        en: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", "Irvember"],
        ain: ["", "", "", "", "", "", "", "", "", "", "", "", ""],
    };
    let dn = {
        ja: ["日", "月", "火", "水", "木", "金", "土"],
        en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        ain: ["トカト", "クンネト", "アペト", "ワㇰカト", "チクニト", "カネト", "トト"]
    };
    let format = {
        ja: "YYYY年 MM DD日<br>WW曜日<br>hh:mm:ss AP",
        en: "hh:mm:ss AP<br>WW<br>MM DD, YYYY",
        ain: "YYYY パ MM  DD ト<br>WW<br>hh:mm:ss AP"
    };
    let dc = ["249, 24, 128", "120, 86, 255", "255, 122, 0", "139, 152, 165", "0, 186, 124", "255, 212, 0", "29, 155, 240"];
    let d;
    let base = base_num;

    let a;
    let b;
    let u = () => {
        if (typeof a === "undefined") {
            let t = document.querySelector('aside:has(a[href^="/i/connect_people"])');
            if (t != null) {
                t = t.parentNode.parentNode;
                a = t.cloneNode(true);
                a.querySelector("div").style.minHeight = "auto";
                a.querySelector("aside").setAttribute("aria-label", "時計");
                b = a.querySelector("aside div");
                b.style.display = "block";
                a.querySelector("ul").remove();
                a.querySelector("a").remove();
            }
        }
        if (typeof a !== "undefined") {
            let t = document.querySelector('div[data-testid="sidebarColumn"] div:has(> nav)');
            if (t != null) {
                d = new Date();

                let day = d.getDay();
                let day_str = dn[language][day];
                if ((day_color == 1 && (day == 0 || day == 6)) || day_color == 2) {
                    day_str = `<span style="color: rgb(${dc[day]});">${day_str}</span>`;
                }

                let str = format[language];
                str = str.replace("YYYY", d.getFullYear().convertBase(base));
                let m = d.getMonth();
                let cm = mn[language][m];
                if (cm == "") cm = (m + 1).convertBase(base);
                str = str.replace("MM", cm);
                str = str.replace("DD", d.getDate().convertBase(base));
                str = str.replace("WW", day_str);
                let h = d.getHours();
                str = str.replace("hh", (ap ? h % 12 : h).convertBase(base));
                str = str.replace("mm", d.getMinutes().convertBase(base).padStart(2, "0"));
                str = str.replace("ss", d.getSeconds().convertBase(base).padStart(2, "0"));
                str = str.replace("AP", ap ? (h < 12 ? "AM" : "PM") : "");

                b.innerHTML = str.trim();

                let p = t.parentNode.firstElementChild;
                if (p.querySelector("form") != null) p = p.nextElementSibling.nextElementSibling;
                p.before(a);
            }
        }
        d = new Date();
        setTimeout(u, 1000 - d.getMilliseconds());
    }
    d = new Date();
    setTimeout(u, 1000 - d.getMilliseconds());
})();