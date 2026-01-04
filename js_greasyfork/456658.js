// ==UserScript==
// @name         楽天: 必須の項目選択肢の自動選択 
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  楽天市場にて、必須の項目選択肢・オプション選択肢の自動選択を行うプログラム・スクリプト。
// @author       You
// @match        https://item.rakuten.co.jp/rakutenmobile-store/xperia-10m3-lite_bundle/*
// @grant        none
// @run-at       document-idle
// @noframes
// @license mit
// @downloadURL https://update.greasyfork.org/scripts/456658/%E6%A5%BD%E5%A4%A9%3A%20%E5%BF%85%E9%A0%88%E3%81%AE%E9%A0%85%E7%9B%AE%E9%81%B8%E6%8A%9E%E8%82%A2%E3%81%AE%E8%87%AA%E5%8B%95%E9%81%B8%E6%8A%9E.user.js
// @updateURL https://update.greasyfork.org/scripts/456658/%E6%A5%BD%E5%A4%A9%3A%20%E5%BF%85%E9%A0%88%E3%81%AE%E9%A0%85%E7%9B%AE%E9%81%B8%E6%8A%9E%E8%82%A2%E3%81%AE%E8%87%AA%E5%8B%95%E9%81%B8%E6%8A%9E.meta.js
// ==/UserScript==

Array.from(document.querySelectorAll('[id^=normal_basket_] div[name^="select_10"][class*=" required_option"] select')).map(a => a.selectedIndex = 1)
