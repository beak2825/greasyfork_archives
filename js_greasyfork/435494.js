// ==UserScript==
// @name            PF not OOP Test for PC
// @author          amaicoffee
// @namespace       https://greasyfork.org/ja/users/17828-amaicoffee
// @descriotion     Hides works with blocked tags in the ranking.
// @description:ja  ブロックされたタグを持つ作品をランキング上で非表示にします。
// @match           https://www.pixiv.net/novel/ranking.php?mode=*
// @version         0.1
// @history         0.1  first version. Only novel ranking is supported.
// @history:ja      0.1  最初のバージョン。小説ランキングのみ対応
// @license         MIT
// @description ブロックされたタグを持つ作品をランキング上で非表示にします。
// @downloadURL https://update.greasyfork.org/scripts/435494/PF%20not%20OOP%20Test%20for%20PC.user.js
// @updateURL https://update.greasyfork.org/scripts/435494/PF%20not%20OOP%20Test%20for%20PC.meta.js
// ==/UserScript==

// 非表示にしたいタグ。半角空白で区切って追加。部分一致します。

// 例：中国語作品を除外
// var ng_tags_text = '中文 中国语 Chinese 中國語 中国語';

// 例：特殊嗜好を除外 (Pixiv大百科「特殊嗜好」より)
// var ng_tags_text = 'BL 百合 夢小説 夢絵 夢漫画 倒錯 SM リョナ 欠損 ケモノ 異種姦';

// ↓
// ↓
var ng_tags_text = 'やはり俺の青春ラブコメはまちがっている。 系统 中文 中国语 Chinese 中國語 中国語 ケモホモ ゲイ 創作BL スカトロ 同人文 重口 足交 少女前线 后宫 萝莉 乱伦 BLD 五等分の花嫁 碧蓝航线 调教 俺ガイル 榨精 紧缚 明日方舟 丝袜 足控 捆绑 崩坏';
// ↑
// ↑

/*
    開発メモ
    ブロックパターンは複数用意したほうが良いかも
    ・中国語系（中文、中国語…
    ・中国語でのタグ系（少女前线、碧蓝航线
    ・BL、ゲイ系（ケモホモ、ゲイ
    ・腐系（腐術廻戦
    ・夢小説系（夢術廻戦
    絶対、スクリプト更新と分けて配信出来たほうが良い。

    各タグ連結して正規表現でマッチは誤検出起こしそう

*/

// ここから先はJavascriptが出来る人だけ改変してください。
/** @type {RegExp} */
const ng_pattern = new RegExp(ng_tags_text.replaceAll(' ', '|'));

function add_my_CSS(css_str) {
    const newStyle = document.createElement('style');
    newStyle.innerText = css_str;
    document.head.appendChild(newStyle);
}

function do_filtering() {
    // ランキングの小説を所得
    console.log('filtering start');
    let novel_nl = document.querySelectorAll('div._ranking-item');

    let title_arr = Array.from(novel_nl, node => node.querySelector('h1.title').innerText);
    console.log('タイトル一覧を表示', title_arr);

    // 各小説について
    for (let i = 0; i < novel_nl.length; i++) {
        // i 番目の小説のタグを所得
        const tag_nl = novel_nl[i].querySelectorAll('a.tag-value');
        // 各タグについて
        for (let j = 0; j < tag_nl.length; j++) {
            if (ng_pattern.test(tag_nl[j].innerText)) {
                novel_nl[i].classList.add('censored');
                console.log(`"${title_arr[i]}" は "${tag_nl[j].innerText}" がNGなため非表示になりました。`);
            }
        }
    }
}

function main() {
    console.log('main start');
    add_my_CSS('.censored { display: none !important}');

    do_filtering();
}

(function () {
    console.log('script start');
    setTimeout(main, 2 * 1000);
}());