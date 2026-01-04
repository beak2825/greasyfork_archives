// ==UserScript==
// @name         CEMIS修正Enter預設動作 與 自動填入S2L
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Enter觸發按鈕 與 自動填入 S2L
// @author       Shanlan
// @match        https://cemis3.cht.com.tw/CEMIS/ChooseGRP*
// @match        https://cemis3.cht.com.tw/CRP/DSN/CRE/Cemis_st1_n.asp
// @match        https://cemis3.cht.com.tw/CRP/SHA/CRE/Cemis_Pcd.asp
// @match        https://cemis3.cht.com.tw/CEMIS/RD1/RD1.aspx
// @match        https://cemis3.cht.com.tw/CEMISWEB/WKTN/WKTN
// @match        https://cemis3.cht.com.tw/CEMISWEB/ST1U/ST1U
// @match        https://cemis3.cht.com.tw/CEMISRPT/MATM/MATM11
// @match        https://cemis3.cht.com.tw/CEMIS3/ST1/Action_ST1
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542605/CEMIS%E4%BF%AE%E6%AD%A3Enter%E9%A0%90%E8%A8%AD%E5%8B%95%E4%BD%9C%20%E8%88%87%20%E8%87%AA%E5%8B%95%E5%A1%AB%E5%85%A5S2L.user.js
// @updateURL https://update.greasyfork.org/scripts/542605/CEMIS%E4%BF%AE%E6%AD%A3Enter%E9%A0%90%E8%A8%AD%E5%8B%95%E4%BD%9C%20%E8%88%87%20%E8%87%AA%E5%8B%95%E5%A1%AB%E5%85%A5S2L.meta.js
// ==/UserScript==

(function () {
  "use strict";
  const url = window.location.href;

  // 1. 處理驗證碼與 ST1/PCD 等頁面：按下 Enter 鍵觸發指定按鈕
  if (
    url.startsWith("https://cemis3.cht.com.tw/CEMIS/ChooseGRP") ||
    [
      "https://cemis3.cht.com.tw/CRP/DSN/CRE/Cemis_st1_n.asp",
      "https://cemis3.cht.com.tw/CRP/SHA/CRE/Cemis_Pcd.asp",
      "https://cemis3.cht.com.tw/CEMIS/RD1/RD1.aspx",
      "https://cemis3.cht.com.tw/CEMISWEB/WKTN/WKTN"
    ].includes(url)
  ) {
    const inputs = document.querySelectorAll('[id="tbVali"], [id^="Textbox1"], [id="tbShtno"]');
    const btns = document.querySelectorAll("#btnLo, #BtnQuery, #btnQuery");
    inputs.forEach(input => {
      if (input.id === "tbVali") {
        input.value = "";
        input.focus();
      }
      input.addEventListener("keydown", e => {
        if (e.key === "Enter") {
          e.preventDefault();
          btns.forEach(btn => {
            if (typeof __doPostBack === 'function') {
              setTimeout(() => __doPostBack(btn.id, ''), 0);
            } else {
              setTimeout(() => btn.click(), 0);
            }
          });
        }
      });
    });
  }

  // 2. WKTN 頁面：工作單查詢的 Enter 處理 (以原生 JS 取代 jQuery)
  if (url === "https://cemis3.cht.com.tw/CEMISWEB/WKTN/WKTN") {
    const workInput = document.getElementById("work_number_sht");
    const queryBtn = document.querySelector('[value="工作單查詢"]');
    if (workInput && queryBtn) {
      workInput.addEventListener("keypress", e => {
        if (e.key === "Enter") {
          e.preventDefault();
          queryBtn.click();
        }
      });
    }
  }

  // 3. 多頁面自動填入 "S2L" 及聚焦
  const autoFillPages = [
    "https://cemis3.cht.com.tw/CEMISWEB/ST1U/ST1U",
    "https://cemis3.cht.com.tw/CEMISWEB/WKTN/WKTN",
    "https://cemis3.cht.com.tw/CRP/DSN/CRE/Cemis_st1_n.asp",
    "https://cemis3.cht.com.tw/CEMIS3/ST1/Action_ST1",
    "https://cemis3.cht.com.tw/CEMIS/RD1/RD1.aspx",
    "https://cemis3.cht.com.tw/CEMISRPT/MATM/MATM11"
  ];
  if (autoFillPages.includes(url)) {
    // MATM 頁面多一個輸入框 id 為 number
    let selectors = '[id="work_number_sht"], [id="Textbox1a"], [id="tbShtno"], [id="str_sht_no_new"]';
    if (url === "https://cemis3.cht.com.tw/CEMISRPT/MATM/MATM11") {
      selectors += ', [id="number"]';
    }
    document.querySelectorAll(selectors).forEach(input => {
      if (!input.value) input.value = "S2L";
      input.focus();
    });
  }
})();