// ==UserScript==
// @name         【サポート終了】国立アイヌ民族博物館アイヌ語アーカイブの半角を小書きに
// @namespace    https://lit.link/toracatman
// @version      2026-01-22
// @description  「国立アイヌ民族博物館アイヌ語アーカイブ」という サイトの 半角カタカナを 小書きカタカナに します。
// @author       トラネコマン
// @match        https://ainugo.nam.go.jp/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/488763/%E3%80%90%E3%82%B5%E3%83%9D%E3%83%BC%E3%83%88%E7%B5%82%E4%BA%86%E3%80%91%E5%9B%BD%E7%AB%8B%E3%82%A2%E3%82%A4%E3%83%8C%E6%B0%91%E6%97%8F%E5%8D%9A%E7%89%A9%E9%A4%A8%E3%82%A2%E3%82%A4%E3%83%8C%E8%AA%9E%E3%82%A2%E3%83%BC%E3%82%AB%E3%82%A4%E3%83%96%E3%81%AE%E5%8D%8A%E8%A7%92%E3%82%92%E5%B0%8F%E6%9B%B8%E3%81%8D%E3%81%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/488763/%E3%80%90%E3%82%B5%E3%83%9D%E3%83%BC%E3%83%88%E7%B5%82%E4%BA%86%E3%80%91%E5%9B%BD%E7%AB%8B%E3%82%A2%E3%82%A4%E3%83%8C%E6%B0%91%E6%97%8F%E5%8D%9A%E7%89%A9%E9%A4%A8%E3%82%A2%E3%82%A4%E3%83%8C%E8%AA%9E%E3%82%A2%E3%83%BC%E3%82%AB%E3%82%A4%E3%83%96%E3%81%AE%E5%8D%8A%E8%A7%92%E3%82%92%E5%B0%8F%E6%9B%B8%E3%81%8D%E3%81%AB.meta.js
// ==/UserScript==

var flag = "g";
var convert_sign_attr = "data-small";
var convert_sign_value = "true";
var replacement = "\x1a";

var c = [
    ["ｸ", "ㇰ"], ["ｼ", "ㇱ"], ["ｽ", "ㇲ"], ["ﾄ", "ㇳ"], ["ﾇ", "ㇴ"],
    ["ﾊ", "ㇵ"], ["ﾋ", "ㇶ"], ["ﾌﾟ", "ㇷ゚"], ["ﾌ", "ㇷ"], ["ﾍ", "ㇸ"],
    ["ﾎ", "ㇹ"], ["ﾑ", "ㇺ"], ["ﾗ", "ㇻ"], ["ﾘ", "ㇼ"], ["ﾙ", "ㇽ"],
    ["ﾚ", "ㇾ"], ["ﾛ", "ㇿ"]
];

(() => {
    setInterval(() => {
        var a = document.querySelectorAll("dd,dd *,.kana,.word,.ainu,.ainu *");
        if (a == null) return;
        for (var i = 0; i < a.length; i++) {
            if (a[i].getAttribute(convert_sign_attr) == convert_sign_value) continue;
            a[i].setAttribute(convert_sign_attr, convert_sign_value);

            if (!(a[i].hasChildNodes())) continue;
            var h = (b) => {
                var s = b;
                for (var j = 0; j < c.length; j++) {
                    s = s.replace(new RegExp(c[j][0], flag), c[j][1]);
                }
                return s;
            }
            if (a[i].childElementCount == 0) {
                a[i].textContent = h(a[i].textContent);
            }
            else {
                var t = a[i];
                var p = document.createTextNode("");
                t.replaceWith(p);
                var r = document.createDocumentFragment();
                var e = t.firstElementChild;
                while (e != null) {
                    e.replaceWith(document.createTextNode(replacement));
                    r.appendChild(e);
                    e = t.firstElementChild;
                }
                var ss = h(t.textContent).split(replacement);
                t.textContent = "";
                t.appendChild(document.createTextNode(ss[0]));
                for (var j = 1; j < ss.length; j++) {
                    t.appendChild(r.firstElementChild);
                    t.appendChild(document.createTextNode(ss[j]));
                }
                p.replaceWith(t);
            }
        }
    }, 100);
})();