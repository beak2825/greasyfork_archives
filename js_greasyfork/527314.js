// ==UserScript==
// @name         Markdown and MFM for Twitter
// @namespace    https://lit.link/toracatman
// @version      2025-08-04
// @description  Twitter の 本文で Markdown と MFM を 有効に します。
// @author       トラネコマン
// @match        https://x.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527314/Markdown%20and%20MFM%20for%20Twitter.user.js
// @updateURL https://update.greasyfork.org/scripts/527314/Markdown%20and%20MFM%20for%20Twitter.meta.js
// ==/UserScript==

let cat = false; //猫機能
let cat_ear_color = "#fff"; //猫耳の 色

let css = `blockquote {
    border-left: 4px solid #ccc;
    padding: 1em 0 1em 1em;
    color: #666;
}
.code-color {
    display: inline-block;
    width: 0.8em;
    height: 0.8em;
    border: 1px solid rgba(128, 128, 128, 0.5);
    margin-left: 0.1em;
}
.note {
    color: #000;
    margin: 1em 0;
    padding: 1em 1em 1em 3em;
    position: relative;
}
.note:before {
    display: block;
    width: 1.5em;
    height: 1.5em;
    border-radius: 50%;
    font-weight: bold;
    text-align: center;
    line-height: 1.5em;
    color: #fff;
    position: absolute;
    top: 1em;
    left: 1em;
}
.note-info {
    background-color: #cfc;
}
.note-info:before {
    content: "✓";
    background-color: #0c0;
}
.note-warn {
    background-color: #ffc;
}
.note-warn:before {
    content: "！";
    background-color: #fc0;
}
.note-alert {
    background-color: #fcc;
}
.note-alert:before {
    content: "✕";
    background-color: #c00;
}

.mfm-center {
    text-align: center;
}
small {
    opacity: 0.7;
}
.mfm-blur {
    filter: blur(6px);
    transition: filter .3s;
}
.mfm-blur:hover {
    filter: blur(0px);
}
.mfm-flip {
    transform: scaleX(-1);
}
.mfm-flipV {
    transform: scaleY(-1);
}
.mfm-flipHV {
    transform: scale(-1, -1);
}
div[data-testid="tweetText"]:has(rtc) {
	line-height: 2.5;
}
ruby {
	position: relative;
}
rtc {
	text-indent: 0px;
	line-height: 1;
	text-emphasis: none;
}
ruby > rtc {
	display: ruby-text;
	font-size: 50%;
	text-align: center;
	width: 100%;
	position: absolute;
	top: 100%;
	left: 0;
}
.mfm-scale .mfm-scale {
    transform: scale(1) !important;
}
.mfm-x .mfm-x .mfm-x {
    font-size: 1em !important;
}
.mfm-transform {
    display: inline-block;
}
.mfm-jelly {
    animation: 1s linear 0s infinite normal both running mfm-jelly;
}
@keyframes mfm-jelly {
    0% {
        transform: scaleZ(1);
    }
    30% {
        transform: scale3d(1.25, 0.75, 1);
    }
    40% {
        transform: scale3d(0.75, 1.25, 1);
    }
    50% {
        transform: scale3d(1.15, 0.85, 1);
    }
    65% {
        transform: scale3d(0.95, 1.05, 1);
    }
    75% {
        transform: scale3d(1.05, 0.95, 1);
    }
    100% {
        transform: scaleZ(1);
    }
}
.mfm-tada {
    animation: 1s linear 0s infinite normal both running mfm-tada;
}
@keyframes mfm-tada {
    0% {
        transform: scaleZ(1);
    }
    10%, 20% {
        transform: scale3d(0.9, 0.9, 0.9) rotate3d(0, 0, 1, -3deg);
    }
    30%, 50%, 70%, 90% {
        transform: scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg);
    }
    40%, 60%, 80% {
        transform: scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, -3deg);
    }
    100% {
        transform: scaleZ(1);
    }
}
.mfm-jump {
    animation: 0.75s linear 0s infinite normal none running mfm-jump;
}
@keyframes mfm-jump {
    0% {
        transform: translateY(0);
    }
    25% {
        transform: translateY(-16px);
    }
    50% {
        transform: translateY(0);
    }
    75% {
        transform: translateY(-8px);
    }
    100% {
        transform: translateY(0);
    }
}
.mfm-bounce {
    animation: 0.75s linear 0s infinite normal none running mfm-bounce;
    transform-origin: center bottom;
}
@keyframes mfm-bounce {
    0% {
        transform: translateY(0) scale(1);
    }
    25% {
        transform: translateY(-16px) scale(1);
    }
    50% {
        transform: translateY(0) scale(1);
    }
    75% {
        transform: translateY(0) scale(1.5, 0.75);
    }
    100% {
        transform: translateY(0) scale(1);
    }
}
.mfm-spin {
    animation: 1.5s linear 0s infinite normal none running mfm-spin;
}
.mfm-spinL {
    animation: 1.5s linear 0s infinite reverse none running mfm-spin;
}
.mfm-spinA {
    animation: 1.5s linear 0s infinite alternate none running mfm-spin;
}
@keyframes mfm-spin {
    0% {
        transform: rotate(0);
    }
    100% {
        transform: rotate(360deg);
    }
}
.mfm-spinX {
    animation: 1.5s linear 0s infinite normal none running mfm-spinX;
}
.mfm-spinXL {
    animation: 1.5s linear 0s infinite reverse none running mfm-spinX;
}
.mfm-spinXA {
    animation: 1.5s linear 0s infinite alternate none running mfm-spinX;
}
@keyframes mfm-spinX {
    0% {
        transform: perspective(128px) rotateX(0);
    }
    100% {
        transform: perspective(128px) rotateX(360deg);
    }
}
.mfm-spinY {
    animation: 1.5s linear 0s infinite normal none running mfm-spinY;
}
.mfm-spinYL {
    animation: 1.5s linear 0s infinite reverse none running mfm-spinY;
}
.mfm-spinYA {
    animation: 1.5s linear 0s infinite alternate none running mfm-spinY;
}
@keyframes mfm-spinY {
    0% {
        transform: perspective(128px) rotateY(0);
    }
    100% {
        transform: perspective(128px) rotateY(360deg);
    }
}
.mfm-shake {
    animation: 0.5s ease 0s infinite normal none running mfm-shake;
}
@keyframes mfm-shake {
    0% {
        transform: translate(-3px, -1px) rotate(-8deg);
    }
    5% {
        transform: translateY(-1px) rotate(-10deg);
    }
    10% {
        transform: translate(1px, -3px) rotate(0);
    }
    15% {
        transform: translate(1px, 1px) rotate(11deg);
    }
    20% {
        transform: translate(-2px, 1px) rotate(1deg);
    }
    25% {
        transform: translate(-1px, -2px) rotate(-2deg);
    }
    30% {
        transform: translate(-1px, 2px) rotate(-3deg);
    }
    35% {
        transform: translate(2px, 1px) rotate(6deg);
    }
    40% {
        transform: translate(-2px, -3px) rotate(-9deg);
    }
    45% {
        transform: translateY(-1px) rotate(-12deg);
    }
    50% {
        transform: translate(1px, 2px) rotate(10deg);
    }
    55% {
        transform: translateY(-3px) rotate(8deg);
    }
    60% {
        transform: translate(1px, -1px) rotate(8deg);
    }
    65% {
        transform: translateY(-1px) rotate(-7deg);
    }
    70% {
        transform: translate(-1px, -3px) rotate(6deg);
    }
    75% {
        transform: translateY(-2px) rotate(4deg);
    }
    80% {
        transform: translate(-2px, -1px) rotate(3deg);
    }
    85% {
        transform: translate(1px, -3px) rotate(-10deg);
    }
    90% {
        transform: translate(1px) rotate(3deg);
    }
    95% {
        transform: translate(-2px) rotate(-3deg);
    }
    100% {
        transform: translate(2px, 1px) rotate(2deg);
    }
}
.mfm-twitch {
    animation: 0.5s ease 0s infinite normal none running mfm-twitch;
}
@keyframes mfm-twitch {
    0% {
        transform: translate(7px, -2px);
    }
    5% {
        transform: translate(-3px, -1px);
    }
    10% {
        transform: translate(-7px, -1px);
    }
    15% {
        transform: translateY(-1px);
    }
    20% {
        transform: translate(-8px, 6px);
    }
    25% {
        transform: translate(-4px, -3px);
    }
    30% {
        transform: translate(-4px, -6px);
    }
    35% {
        transform: translate(-8px, -8px);
    }
    40% {
        transform: translate(4px, 6px);
    }
    45% {
        transform: translate(-3px, 1px);
    }
    50% {
        transform: translate(2px, -10px);
    }
    55% {
        transform: translate(-7px);
    }
    60% {
        transform: translate(-2px, 4px);
    }
    65% {
        transform: translate(3px, -8px);
    }
    70% {
        transform: translate(6px, 7px);
    }
    75% {
        transform: translate(-7px, -2px);
    }
    80% {
        transform: translate(-7px, -8px);
    }
    85% {
        transform: translate(9px, 3px);
    }
    90% {
        transform: translate(-3px, -2px);
    }
    95% {
        transform: translate(-10px, 2px);
    }
    100% {
        transform: translate(-2px, -6px);
    }
}
.mfm-rainbow {
    animation: 1s linear 0s infinite normal none running mfm-rainbow;
}
@keyframes mfm-rainbow {
    0% {
        filter: hue-rotate(0deg) contrast(150%) saturate(150%);
    }
    100% {
        filter: hue-rotate(360deg) contrast(150%) saturate(150%);
    }
}
.mfm-sparkle:before,.mfm-sparkle:after {
    content: "✨";
    animation: 0.5s linear 0s infinite alternate none running mfm-sparkle;
}
@keyframes mfm-sparkle {
    0% {
        opacity: 0;
    }
    100% {
        opacity: 1;
    }
}`;
if (cat) {
    css += `
.cat-ear {
    position: absolute;
    width: 100%;
    height: 100%;
}
.cat-ear div {
    display: inline-block;
    height: 50%;
    width: 50%;
    background-color: ${cat_ear_color};
}
.cat-ear .cat-ear-left {
    transform: rotate(37.5deg) skew(30deg);
}
.cat-ear .cat-ear-right {
    transform: rotate(-37.5deg) skew(-30deg);
}
.cat-ear:hover .cat-ear-left {
    animation: cat-ear-left-move 1s infinite;
}
.cat-ear:hover .cat-ear-right {
    animation: cat-ear-right-move 1s infinite;
}
@keyframes cat-ear-left-move {
    0% {
        transform: rotate(37.6deg) skew(30deg);
    }
    25% {
        transform: rotate(10deg) skew(30deg);
    }
    50% {
        transform: rotate(20deg) skew(30deg);
    }
    75% {
        transform: rotate(0deg) skew(30deg);
    }
    100% {
        transform: rotate(37.6deg) skew(30deg);
    }
}
@keyframes cat-ear-right-move {
    0% {
        transform: rotate(-37.6deg) skew(-30deg);
    }
    25% {
        transform: rotate(-10deg) skew(-30deg);
    }
    50% {
        transform: rotate(-20deg) skew(-30deg);
    }
    75% {
        transform: rotate(0deg) skew(-30deg);
    }
    100% {
        transform: rotate(-37.6deg) skew(-30deg);
    }
}
.cat-ear div:after {
    content: "";
    display: block;
    width: 60%;
    height: 60%;
    margin: 20%;
    background-color: #df548f;
}
.cat-ear-left,
.cat-ear-left:after {
    border-radius: 25% 75% 75%;
}
.cat-ear-right,
.cat-ear-right:after {
    border-radius: 75% 25% 75% 75%;
}
div[data-testid^="UserAvatar-Container-"] a>div:first-child div,
div[data-testid^="UserAvatar-Container-"] a>div:nth-child(2) div,
div[data-testid^="UserAvatar-Container-"] a>div:nth-child(3),
div[data-testid^="UserAvatar-Container-"] div[role="presentation"]>div:nth-child(2) div,
div[data-testid^="UserAvatar-Container-"] div[role="presentation"]>div:nth-child(3) {
    background-color: rgba(0, 0, 0, 0) !important;
}`;
}

(() => {
    let style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);

    setInterval(() => {
        let a = document.querySelectorAll('div[data-testid="tweetText"]');
        for (let i = 0; i < a.length; i++) {
            if (a[i].getAttribute("data-markdown") == "true") continue;
            a[i].setAttribute("data-markdown", "true");
            let children = a[i].children;
            if (children == null) continue;

            let text = a[i];
            let point = document.createTextNode("");
            text.replaceWith(point);

            //タグの 保護
            let tag = [];

            let s = "";

            let l = children.length;

            for (let j = 0; j < l; j++) {
                if (children[j].tagName == "IMG" ||
                    children[j].tagName == "DIV" ||
                    children[j].tagName == "A" ||
                    children[j].querySelector('a[href^="/hashtag"]') != null) {
                    tag.push(children[j]);
                    s += "\x1a";
                }
                else {
                    s += children[j].innerHTML;
                }
            }

            //エスケープ
            let e = s.match(/\\./gu);
            if (e != null) {
                for (let j = 0; j < e.length; j++) {
                    s = s.replace(e[j], `&#${e[j].codePointAt(1)};`);
                }
            }

            //プレーン
            let plain = s.match(/&lt;plain&gt;.+?&lt;\/plain&gt;/gs);
            if (plain != null) {
                for (let j = 0; j < plain.length; j++) {
                    s = s.replace(plain[j], `\x1bA[${j}]`);
                }
            }

            //pre記法、code記法
            let p = s.match(/```[^\n]*\n.+?\n```/gs);
            if (p != null) {
                for (let j = 0; j < p.length; j++) {
                    s = s.replace(p[j], `\x1bP[${j}]`);
                }
            }
            let c = s.match(/`.+?`/gs);
            if (c != null) {
                for (let j = 0; j < c.length; j++) {
                    s = s.replace(c[j], `\x1bC[${j}]`);
                }
            }

            //引用
            let q = s.match(/^((&gt;)+ .*\n)*(&gt;)+ .*/gm);
            if (q != null) {
                for (let j = 0; j < q.length; j++) {
                    s = s.replace(q[j], `\x1bQ[${j}]`);
                }
            }

            //猫機能
            if (cat) s = s.replace(/な/g, "にゃ").replace(/ナ/g, "ニャ").replace(/n(?=[Aa])/g, "ny").replace(/Na/g, "Nya").replace(/NA/g, "NYA");

            //チェックボックス
            s = s.replace(/- \[x\] ?/g, '<input type="checkbox" checked>');
            s = s.replace(/- \[ \] ?/g, '<input type="checkbox">');

            //箇条書きリスト、番号付きリスト
            let ul = s.match(/^(\t*- .*\n)*\t*- .*/gm);
            if (ul != null) {
                for (let j = 0; j < ul.length; j++) {
                    let ll = ul[j].split("\n");
                    let lt = "";
                    let n = -1;
                    for (let k = 0; k < ll.length; k++) {
                        let d = ll[k].indexOf("-") - n;
                        if (d > 0) lt += "<ul>";
                        if (d < 0) for (let m = 0; m < -d; m++) lt += "</li></ul>";
                        if (d <= 0) lt += "</li>";
                        n = ll[k].indexOf("-");
                        lt += `<li>${ll[k].replace(/^\t*- /, "")}`;
                    }
                    for (let k = 0; k < n + 1; k++) lt += "</li></ul>";
                    s = s.replace(ul[j], lt);
                }
            }
            s = s.replace(/(?<=<\/ul>)\n/g, "");
            let ol = s.match(/^(\t*\d+\. .*\n)*\t*\d+\. .*/gm);
            if (ol != null) {
                for (let j = 0; j < ol.length; j++) {
                    let ll = ol[j].split("\n");
                    let lt = "";
                    let n = -1;
                    for (let k = 0; k < ll.length; k++) {
                        let d = ll[k].search(/\d/) - n;
                        if (d > 0) lt += "<ol>";
                        if (d < 0) for (let m = 0; m < -d; m++) lt += "</li></ol>";
                        if (d <= 0) lt += "</li>";
                        n = ll[k].search(/\d/);
                        lt += `<li>${ll[k].replace(/^\t*\d+\. /, "")}`;
                    }
                    for (let k = 0; k < n + 1; k++) lt += "</li></ol>";
                    s = s.replace(ol[j], lt);
                }
            }
            s = s.replace(/(?<=<\/ol>)\n/g, "");

            //表
            let tb = s.match(/^(\|.*\|\n){2,}\|.*\|/gm);
            if (tb != null) {
                for (let j = 0; j < tb.length; j++) {
                    let tl = tb[j].split("\n");
                    let al = tl[1].split("|");
                    let ali = new Array(al.length - 2);
                    for (let k = 0; k < ali.length; k++) {
                        if (/:-+:/.test(al[k + 1])) {
                            ali[k] = ' align="center"';
                        }
                        else if (/:-+/.test(al[k + 1])) {
                            ali[k] = ' align="left"';
                        }
                        else if (/-+:/.test(al[k + 1])) {
                            ali[k] = ' align="right"';
                        }
                        else {
                            ali[k] = "";
                        }
                    }
                    tl[0] = tl[0].replace(/^\|/, `<tr><th${ali[0]}>`).replace(/\|$/, "</th></tr>");
                    for (let m = 1; m < ali.length; m++) {
                        tl[0] = tl[0].replace(/\|/, `</th><th${ali[m]}>`);
                    }
                    for (let k = 2; k < tl.length; k++) {
                        tl[k] = tl[k].replace(/^\|/, `<tr><td${ali[0]}>`).replace(/\|$/, "</td></tr>");
                        for (let m = 1; m < ali.length; m++) {
                            tl[k] = tl[k].replace(/\|/, `</td><td${ali[m]}>`);
                        }
                    }
                    let tt = `<table border="1">${tl[0]}`;
                    for (let k = 2; k < tl.length; k++) {
                        tt += `${tl[k]}`;
                    }
                    tt += "</table>";
                    s = s.replace(tb[j], tt);
                }
            }
            s = s.replace(/(?<=<\/table>)\n/g, "");

            //見出し
            s = s.replace(/^# (.+)$/gm, "<h1>$1</h1>");
            s = s.replace(/^## (.+)$/gm, "<h2>$1</h2>");
            s = s.replace(/^### (.+)$/gm, "<h3>$1</h3>");
            s = s.replace(/^#### (.+)$/gm, "<h4>$1</h4>");
            s = s.replace(/^##### (.+)$/gm, "<h5>$1</h5>");
            s = s.replace(/^###### (.+)$/gm, "<h6>$1</h6>");
            s = s.replace(/(?<=<\/h[1-6]>)\n/g, "");

            //太字かつ斜体
            s = s.replace(/\*\*\*(.+?)\*\*\*/gs, "<b><i>$1</i></b>");

            //太字
            s = s.replace(/\*\*(.+?)\*\*/gs, "<b>$1</b>");

            //斜体
            s = s.replace(/&lt;i&gt;(.+?)&lt;\/i&gt;/gs, "<i>$1</i>");
            s = s.replace(/\*(.+?)\*/gs, "<i>$1</i>");

            //取り消し線
            s = s.replace(/~~(.+?)~~/gs, "<del>$1</del>");

            //水平線
            s = s.replace(/^---+$/gm, "<hr>");
            s = s.replace(/(?<=<hr>)\n/g, "");

            //補足説明
            s = s.replace(/:::note( info)?\n(.+?)\n:::/gs, '<div class="note note-info">$2</div>');
            s = s.replace(/:::note warn\n(.+?)\n:::/gs, '<div class="note note-warn">$1</div>');
            s = s.replace(/:::note alert\n(.+?)\n:::/gs, '<div class="note note-alert">$1</div>');
            s = s.replace(/(?<=<\/div>)\n/g, "");

            //タグ
            s = s.replace(/&lt;(\/?)(details|summary|dl|dt|dd)&gt;/gs, '<$1$2>');
            s = s.replace(/<(\/?)(details|summary|dl|dt|dd)>\n/g, "<$1$2>");
            s = s.replace(/\n<\/(details|summary|dl|dt|dd)>/g, "</$1>");

            //中央揃え
            s = s.replace(/&lt;center&gt;(.+?)&lt;\/center&gt;/gs, '<div class="mfm-center">$1</div>');

            //目立たない字
            s = s.replace(/&lt;small&gt;(.+?)&lt;\/small&gt;/gs, '<small>$1</small>');

            //MFM関数
            let os = "";
            while (os != s) {
                os = s;

                //文字色・背景色
                s = s.replace(/\$\[fg\.color=([\dA-Fa-f]{3,8}) ([^\[\]]+?)\]/gs, '<span style="color: #$1;">$2</span>');
                s = s.replace(/\$\[bg\.color=([\dA-Fa-f]{3,8}) ([^\[\]]+?)\]/gs, '<span style="background-color: #$1;">$2</span>');

                //ブラー
                s = s.replace(/\$\[blur ([^\[\]]+?)\]/gs, '<span class="mfm-blur">$1</span>');

                //フォント
                s = s.replace(/\$\[font\.("[^"]+?"|[a-z]+?) ([^\[\]]+?)\]/gs, "<span style='font-family: $1;'>$2</span>");

                //反転
                s = s.replace(/\$\[flip ([^\[\]]+?)\]/gs, '<span class="mfm-transform mfm-flip">$1</span>');
                s = s.replace(/\$\[flip\.v ([^\[\]]+?)\]/gs, '<span class="mfm-transform mfm-flipV">$1</span>');
                s = s.replace(/\$\[flip\.h,v ([^\[\]]+?)\]/gs, '<span class="mfm-transform mfm-flipHV">$1</span>');

                //角度変更
                s = s.replace(/\$\[rotate\.deg=(-?\d+|-?\d+\.\d+) ([^\[\]]+?)\]/gs, '<span class="mfm-transform" style="transform: rotate($1deg);">$2</span>');

                //位置変更
                s = s.replace(/\$\[position\.x=(-?1000|-?\d{1,3}|-?\d{1,3}\.\d+),y=(-?1000|-?\d{1,3}|-?\d{1,3}\.\d+) ([^\[\]]+?)\]/gs, '<span class="mfm-transform" style="transform: translate($1em, $2em);">$3</span>');

                //ルビ
                s = s.replace(/\$\[ruby ([^ \[\]]+?) ([^ \[\]]+?)\]/gs, '<ruby><rb>$1</rb><rp>（</rp><rt>$2</rt><rp>）</rp></ruby>');
                s = s.replace(/\$\[ruby ([^ \[\]]+?) ([^ \[\]]+?) ([^ \[\]]+?)\]/gs, '<ruby><rb>$1</rb><rp>（</rp><rt>$2</rt><rp>）</rp><rtc>$3</rtc></ruby>');
                s = s.replace(/\$\[ruby ([^ \[\]]+?)  ([^ \[\]]+?)\]/gs, '<ruby><rb>$1</rb><rtc>$2</rtc></ruby>');

                //拡大
                s = s.replace(/\$\[scale\.x=(-?[0-5]|-?[0-4]\.\d+),y=(-?[0-5]|-?[0-4]\.\d+) ([^\[\]]+?)\]/gs, '<span class="mfm-transform mfm-scale" style="transform: scale($1, $2);">$3</span>');

                //シンプル拡大
                s = s.replace(/\$\[x([0-4]|[0-3]\.\d+) ([^\[\]]+?)\]/gs, '<span class="mfm-x" style="font-size: $1em;">$2</span>');

                //アニメーション(びよんびよん)
                s = s.replace(/\$\[jelly ([^\[\]]+?)\]/gs, '<span class="mfm-transform mfm-jelly">$1</span>');
                s = s.replace(/\$\[jelly\.speed=(\d+|\d+\.\d+)s ([^\[\]]+?)\]/gs, '<span class="mfm-transform mfm-jelly" style="animation-duration: $1s;">$2</span>');

                //アニメーション(じゃーん)
                s = s.replace(/\$\[tada ([^\[\]]+?)\]/gs, '<span class="mfm-transform mfm-tada">$1</span>');
                s = s.replace(/\$\[tada\.speed=(\d+|\d+\.\d+)s ([^\[\]]+?)\]/gs, '<span class="mfm-transform mfm-tada" style="animation-duration: $1s;">$2</span>');

                //アニメーション(ジャンプ)
                s = s.replace(/\$\[jump ([^\[\]]+?)\]/gs, '<span class="mfm-transform mfm-jump">$1</span>');
                s = s.replace(/\$\[jump\.speed=(\d+|\d+\.\d+)s ([^\[\]]+?)\]/gs, '<span class="mfm-transform mfm-jump" style="animation-duration: $1s;">$2</span>');

                //アニメーション(バウンド)
                s = s.replace(/\$\[bounce ([^\[\]]+?)\]/gs, '<span class="mfm-transform mfm-bounce">$1</span>');
                s = s.replace(/\$\[bounce\.speed=(\d+|\d+\.\d+)s ([^\[\]]+?)\]/gs, '<span class="mfm-transform mfm-bounce" style="animation-duration: $1s;">$2</span>');

                //アニメーション(回転)
                s = s.replace(/\$\[spin ([^\[\]]+?)\]/gs, '<span class="mfm-transform mfm-spin">$1</span>');
                s = s.replace(/\$\[spin\.speed=(\d+|\d+\.\d+)s ([^\[\]]+?)\]/gs, '<span class="mfm-transform mfm-spin" style="animation-duration: $1s;">$2</span>');
                s = s.replace(/\$\[spin\.left ([^\[\]]+?)\]/gs, '<span class="mfm-transform mfm-spinL">$1</span>');
                s = s.replace(/\$\[spin\.left,speed=(\d+|\d+\.\d+)s ([^\[\]]+?)\]/gs, '<span class="mfm-transform mfm-spinL" style="animation-duration: $1s;">$2</span>');
                s = s.replace(/\$\[spin\.alterny?ate ([^\[\]]+?)\]/gs, '<span class="mfm-transform mfm-spinA">$1</span>');
                s = s.replace(/\$\[spin\.alterny?ate,speed=(\d+|\d+\.\d+)s ([^\[\]]+?)\]/gs, '<span class="mfm-transform mfm-spinA" style="animation-duration: $1s;">$2</span>');
                s = s.replace(/\$\[spin\.x ([^\[\]]+?)\]/gs, '<span class="mfm-transform mfm-spinX">$1</span>');
                s = s.replace(/\$\[spin\.x,speed=(\d+|\d+\.\d+)s ([^\[\]]+?)\]/gs, '<span class="mfm-transform mfm-spinX" style="animation-duration: $1s;">$2</span>');
                s = s.replace(/\$\[spin\.x,left ([^\[\]]+?)\]/gs, '<span class="mfm-transform mfm-spinXL">$1</span>');
                s = s.replace(/\$\[spin\.x,left,speed=(\d+|\d+\.\d+)s ([^\[\]]+?)\]/gs, '<span class="mfm-transform mfm-spinXL" style="animation-duration: $1s;">$2</span>');
                s = s.replace(/\$\[spin\.x,alterny?ate ([^\[\]]+?)\]/gs, '<span class="mfm-transform mfm-spinXA">$1</span>');
                s = s.replace(/\$\[spin\.x,alterny?ate,speed=(\d+|\d+\.\d+)s ([^\[\]]+?)\]/gs, '<span class="mfm-transform mfm-spinXA" style="animation-duration: $1s;">$2</span>');
                s = s.replace(/\$\[spin\.y ([^\[\]]+?)\]/gs, '<span class="mfm-transform mfm-spinY">$1</span>');
                s = s.replace(/\$\[spin\.y,speed=(\d+|\d+\.\d+)s ([^\[\]]+?)\]/gs, '<span class="mfm-transform mfm-spinY" style="animation-duration: $1s;">$2</span>');
                s = s.replace(/\$\[spin\.y,left ([^\[\]]+?)\]/gs, '<span class="mfm-transform mfm-spinYL">$1</span>');
                s = s.replace(/\$\[spin\.y,left,speed=(\d+|\d+\.\d+)s ([^\[\]]+?)\]/gs, '<span class="mfm-transform mfm-spinYL" style="animation-duration: $1s;">$2</span>');
                s = s.replace(/\$\[spin\.y,alterny?ate ([^\[\]]+?)\]/gs, '<span class="mfm-transform mfm-spinYA">$1</span>');
                s = s.replace(/\$\[spin\.y,alterny?ate,speed=(\d+|\d+\.\d+)s ([^\[\]]+?)\]/gs, '<span class="mfm-transform mfm-spinYA" style="animation-duration: $1s;">$2</span>');

                //アニメーション(ぶるぶる)
                s = s.replace(/\$\[shake ([^\[\]]+?)\]/gs, '<span class="mfm-transform mfm-shake">$1</span>');
                s = s.replace(/\$\[shake\.speed=(\d+|\d+\.\d+)s ([^\[\]]+?)\]/gs, '<span class="mfm-transform mfm-shake" style="animation-duration: $1s;">$2</span>');

                //アニメーション(ブレ)
                s = s.replace(/\$\[twitch ([^\[\]]+?)\]/gs, '<span class="mfm-transform mfm-twitch">$1</span>');
                s = s.replace(/\$\[twitch\.speed=(\d+|\d+\.\d+)s ([^\[\]]+?)\]/gs, '<span class="mfm-transform mfm-twitch" style="animation-duration: $1s;">$2</span>');

                //レインボー装飾
                s = s.replace(/\$\[rainbow ([^\[\]]+?)\]/gs, '<span class="mfm-transform mfm-rainbow">$1</span>');
                s = s.replace(/\$\[rainbow\.speed=(\d+|\d+\.\d+)s ([^\[\]]+?)\]/gs, '<span class="mfm-transform mfm-rainbow" style="animation-duration: $1s;">$2</span>');

                //キラキラ装飾
                s = s.replace(/\$\[sparkle ([^\[\]]+?)\]/gs, '<span class="mfm-sparkle">$1</span>');
            }

            //プレーン
            if (plain != null) {
                for (let j = 0; j < plain.length; j++) {
                    let t = plain[j].match(/(?<=&lt;plain&gt;).+?(?=&lt;\/plain&gt;)/s);
                    s = s.replace(`\x1bA[${j}]`, t);
                }
            }

            //pre記法、code記法
            if (p != null) {
                for (let j = 0; j < p.length; j++) {
                    let t = p[j].match(/(?<=```[^\n]*\n).+?(?=\n```)/s);
                    s = s.replace(`\x1bP[${j}]`, `<pre>${t}</pre>`);
                }
            }
            if (c != null) {
                for (let j = 0; j < c.length; j++) {
                    let t = c[j].match(/(?<=`).+?(?=`)/s);
                    let col = "";
                    if (/^(rgba?\([ %,.\w]+?\)|hsla?\([ %,.\w]+?\))$/.test(t)) {
                        col = `<span class="code-color" style="background-color: ${t};"></span>`;
                    }
                    s = s.replace(`\x1bC[${j}]`, `<code>${t}${col}</code>`);
                }
            }

            //引用
            if (q != null) {
                for (let j = 0; j < q.length; j++) {
                    let ql = q[j].split("\n");
                    let qt = "";
                    let n = -1;
                    for (let k = 0; k < ql.length; k++) {
                        let d = ql[k].indexOf("&gt; ") - n;
                        if (d > 0) for (let m = 0; m < d / 4; m++) qt += "<blockquote>";
                        if (d == 0) qt += "\n";
                        if (d < 0) for (let m = 0; m < -d / 4; m++) qt += "</blockquote>";
                        n = ql[k].indexOf("&gt; ");
                        qt += `${ql[k].replace(/^(&gt;)+ /, "")}`;
                    }
                    for (let k = 0; k < n / 4 + 1; k++) qt += "</blockquote>";
                    s = s.replace(`\x1bQ[${j}]`, qt);
                }
            }
            s = s.replace(/(?<=<\/blockquote>)\n/g, "");

            //タグの 展開の 準備
            s = s.replace(/\x1a/g, '<span class="tag-mark"></span>');

            //マークダウン、MFM適用後の HTMLを 入れる
            text.innerHTML = s;

            //タグの 展開
            if (tag != null) {
                let tag_mark = text.querySelectorAll(".tag-mark");
                for (let j = 0; j < tag.length; j++) {
                    tag_mark[j].replaceWith(tag[j]);
                }
            }

            //更新
            point.replaceWith(text);
        }

        //猫耳
        if (cat) {
            let profile_image = document.querySelectorAll('div[data-testid^="UserAvatar-Container-"]');
            if (profile_image == null) return;
            for (let i = 0; i < profile_image.length; i++) {
                if (profile_image[i].classList.contains("cat")) continue;
                profile_image[i].classList.add("cat");

                let cat_ear = document.createElement("div");
                cat_ear.className = "cat-ear";
                let cat_ear_left = document.createElement("div");
                cat_ear_left.className = "cat-ear-left";
                cat_ear.appendChild(cat_ear_left);
                let cat_ear_right = document.createElement("div");
                cat_ear_right.className = "cat-ear-right";
                cat_ear.appendChild(cat_ear_right);
                profile_image[i].firstElementChild.before(cat_ear);
            }
        }
    }, 100);
})();