// ==UserScript==
// @name         AtCoder罵倒スクリプト
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  AC、WAのメッセージが変わります。ドＭ向けです
// @author       変態
// @grant        none
// @match        https://atcoder.jp/contests/*/submissions*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/478387/AtCoder%E7%BD%B5%E5%80%92%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%97%E3%83%88.user.js
// @updateURL https://update.greasyfork.org/scripts/478387/AtCoder%E7%BD%B5%E5%80%92%E3%82%B9%E3%82%AF%E3%83%AA%E3%83%97%E3%83%88.meta.js
// ==/UserScript==


const walist = [
    "バ～カ <span style='color: #F00;'>❤❤❤</span>",
    "あたまわる～い <span style='color: #F00;'>❤❤❤</span>",
    "解けないの～？ <span style='color: #F00;'>❤❤❤</span>",
    "wwwwwwwwwa",
    "もしかしてわからないんでちゅか～ <span style='color: #F00;'>❤❤❤</span>",
];

const aclist = [
    "たまにはやるやん",
    "まぐれだろ",
    "本当はwaで罵倒されたいんだろ？ドMが",
    "あんま調子乗んなよ",
];

(function () {
    document.querySelectorAll('[data-original-title="不正解"]').forEach(element => {
        element.innerHTML = walist[Math.floor(Math.random()*walist.length)];
    });
    document.querySelectorAll('[data-original-title="正解"]').forEach(element => {
        element.innerHTML = aclist[Math.floor(Math.random()*aclist.length)];
    });
})();