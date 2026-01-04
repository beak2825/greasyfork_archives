// ==UserScript==
// @name         ePis-進階請款搜尋
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  快速切換搜尋個人公文
// @author       Shanlan
// @match        http*://epis.cht.com.tw/apy/apayempinq.aspx
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cht.com.tw
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542603/ePis-%E9%80%B2%E9%9A%8E%E8%AB%8B%E6%AC%BE%E6%90%9C%E5%B0%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/542603/ePis-%E9%80%B2%E9%9A%8E%E8%AB%8B%E6%AC%BE%E6%90%9C%E5%B0%8B.meta.js
// ==/UserScript==

(function () {
  'use strict';
  const sortMenu = document.getElementById("lbltxbEmpName");
  sortMenu.innerHTML = `

  <select id="mem-select" onchange="document.getElementById('txbEmpID').setAttribute('value',this.value);">
    <option value="883256">請選擇</option>
    <option value="883256">劉冠岐</option>
    <option value="255068">蕭柏村</option>
    <option value="837794">杜致恩</option>
    <option value="837750">鍾昱賦</option>
    <option value="820992">林妤濃</option>
    <option value="893282">劉信男</option>
    <option value="911841">卓冠融</option>
    <option value="916879">蘇欣宏</option>
    <option value="917021">葉哲銘</option>
    <option value="304144">張竣傑</option>
    <option value="076856">陳烱釗</option>
    <option value="077363">林永順</option>
    <option value="076683">宋甘木</option>
    <option value="076904">黃勝郎</option>
    <option value="077503">陳俊榮</option>
    <option value=""></option>
  </select>
    `;
}
)();