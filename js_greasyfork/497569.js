// ==UserScript==
// @name				AWA Artifact Equip Timer
// @name:ja				AWA アーティファクト装備タイマー
// @name:zh-CN				AWA 神器装备计时器
// @name:zh-TW				AWA 神器裝備計時器
// @license				CC-BY-NC-SA-4.0
// @namespace				https://twitch.tv/kikka1225
// @version				0.1
// @description				Display a button to check the artifact locks' remaining time.
// @description:ja			アーティファクトロックの残り時間を確認するためのボタンを表示します。
// @description:zh-CN			显示一个按钮来检查神器锁的剩余时间。
// @description:zh-TW			顯示一個按鈕來檢查神器鎖的剩餘時間。
// @author				Megumin & Misha
// @match				*://*.alienwarearena.com/member/*/artifacts
// @icon				https://www.google.com/s2/favicons?sz=64&domain=alienwarearena.com
// @grant				none
// @run-at				document-end
// @supportURL				https://github.com/Mishasama/UserScript/issues
// @homepageURL				https://github.com/Mishasama/UserScript/raw/master/Misha's%20US/AWA%20Artifact%20Equip%20Timer/
// @contributionURL			https://ko-fi.com/mishasama
// @contributionAmount			1￥
// @compatible				chrome
// @compatible				edge
// @downloadURL https://update.greasyfork.org/scripts/497569/AWA%20Artifact%20Equip%20Timer.user.js
// @updateURL https://update.greasyfork.org/scripts/497569/AWA%20Artifact%20Equip%20Timer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ボタンの作成とスタイリング
    var button = document.createElement('button');
    button.textContent = '⏰';
    button.style.position = 'fixed';
    button.style.top = '655px';
    button.style.left = '50%'; // 水平方向中央揃え
    button.style.transform = 'translateX(-55%)'; // ボタンの水平位置の調整
    button.style.zIndex = '9999'; // ボタンが一番上にあることを確認する

    // クリックイベントを追加して元のスクリプトを実行する
    button.onclick = function() {alert(Object.values(artifactsData.userActiveArtifacts).reduce((acc, cur) => acc + ((24 - Math.floor((new Date() - Date.parse(cur.equippedAt.date + ' UTC'))/3600000)) >= 0).toString().replace('true', '⏰ ' + ((new Date() - Date.parse(cur.equippedAt.date + ' UTC')) % (1000 * 60 * 60) / (1000 * 60) < 1).toString().replace('true','24').replace('false',((23 - Math.floor((new Date() - Date.parse(cur.equippedAt.date + ' UTC')) / (1000 * 60 * 60))).toString().length < 2).toString().replace('true','0' + (23 - Math.floor((new Date() - Date.parse(cur.equippedAt.date + ' UTC')) / (1000 * 60 * 60)))).replace('false',(23 - Math.floor((new Date() - Date.parse(cur.equippedAt.date + ' UTC')) / (1000 * 60 * 60)))))+ ':' + (((60 - Math.floor((new Date() - Date.parse(cur.equippedAt.date + ' UTC')) % (1000 * 60 * 60) / (1000 * 60))) % 60).toString().length < 2).toString().replace('true','0' + ((60 - Math.floor((new Date() - Date.parse(cur.equippedAt.date + ' UTC')) % (1000 * 60 * 60) / (1000 * 60))) == '60').toString().replace('true','0').replace('false',(60 - Math.floor((new Date() - Date.parse(cur.equippedAt.date + ' UTC')) % (1000 * 60 * 60) / (1000 * 60))) % 60)).replace('false',((60 - Math.floor((new Date() - Date.parse(cur.equippedAt.date + ' UTC')) % (1000 * 60 * 60) / (1000 * 60))) % 60)) + ' remaining\n') .replace('false', '✅ Artifact Replaceable!\n'), ""))};

    // ページにボタンを追加する
    document.body.appendChild(button);
})();
