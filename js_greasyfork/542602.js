// ==UserScript==
// @name         公文系統-進階公文搜尋
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  搜尋特定人員公文 & 更多時間範圍可選
// @author       Shanlan
// @match        http*://emsodas.cht.com.tw/Portal/Pages/SearchDocument.aspx
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cht.com.tw
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542602/%E5%85%AC%E6%96%87%E7%B3%BB%E7%B5%B1-%E9%80%B2%E9%9A%8E%E5%85%AC%E6%96%87%E6%90%9C%E5%B0%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/542602/%E5%85%AC%E6%96%87%E7%B3%BB%E7%B5%B1-%E9%80%B2%E9%9A%8E%E5%85%AC%E6%96%87%E6%90%9C%E5%B0%8B.meta.js
// ==/UserScript==

(function() {
  "use strict";

  const hostInput = document.getElementById("ctl00_PlaceHolderMain_EmsSearch1_Host");
  if(hostInput && hostInput.value !== '883256') hostInput.value = '883256';

  const memSelect = document.createElement("select");
  memSelect.id = "mem-select";
  const lbl = document.querySelector(".lblFieldContent");
  lbl && lbl.appendChild(memSelect);
  memSelect.innerHTML = `
    <option value="883256">劉冠岐 工程師</option>
    <option value="304144">張竣傑 股長</option>
    <option value="255068">蕭柏村 高級工程師</option>
    <option value="310512">廖裕興 高級工程師</option>
    <option value="820990">林妤濃 工程師</option>
    <option value="837794">杜致恩 高級工程師</option>
    <option value="837750">鍾昱賦 高級工程師</option>
    <option value="893282">劉信男 工程師</option>
    <option value="911841">卓冠融 工程師</option>
    <option value="916879">蘇欣宏 工程師</option>
    <option value="917021">葉哲銘 工程師</option>
    <option value="DEPT-01003620D92J04">二客四股所有人員</option>
  `;
  memSelect.addEventListener("change", e => {
    document.getElementById("ctl00_PlaceHolderMain_EmsSearch1_Host").value = e.currentTarget.value;
    const hostText = document.getElementById("hosttext");
    hostText && (hostText.value = e.currentTarget.selectedOptions[0].text);
  });

  ["ctl00_PlaceHolderMain_EmsSearch1_Startdate", "ctl00_PlaceHolderMain_EmsSearch1_Enddate"]
    .forEach(id => document.getElementById(id)?.removeAttribute("readonly"));

  const dateSelect = document.getElementById("dateselect");
  if(dateSelect) {
    const today = new Date(), year = today.getFullYear(),
      month = String(today.getMonth() + 1).padStart(2, "0"),
      day = String(today.getDate()).padStart(2, "0");
    [
      { label: "兩年", diff: 2 }, { label: "五年", diff: 5 },
      { label: "十年", diff: 10 }, { label: "十五年", diff: 15 },
      { label: "二十年", diff: 20 }
    ].forEach(item => {
      const opt = document.createElement("option");
      opt.value = `${year - item.diff}/${month}/${day}`;
      opt.textContent = item.label;
      dateSelect.appendChild(opt);
    });
  }
})();