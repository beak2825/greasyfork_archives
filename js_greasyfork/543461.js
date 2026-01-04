// ==UserScript==
// @name         CHT 差勤系統新增快捷選單
// @namespace    http://tampermonkey.net/
// @version      2.3.4
// @description  在差勤系統右側新增快捷選單
// @author       shanlan(ChatGPT o3-mini)
// @match        https://hris.cht.com.tw/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543461/CHT%20%E5%B7%AE%E5%8B%A4%E7%B3%BB%E7%B5%B1%E6%96%B0%E5%A2%9E%E5%BF%AB%E6%8D%B7%E9%81%B8%E5%96%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/543461/CHT%20%E5%B7%AE%E5%8B%A4%E7%B3%BB%E7%B5%B1%E6%96%B0%E5%A2%9E%E5%BF%AB%E6%8D%B7%E9%81%B8%E5%96%AE.meta.js
// ==/UserScript==

(function(){
  'use strict';
  if(window.top !== window.self) return;
  if(window.opener !== null) return;

  const addStyles = () => {
    const style = document.createElement("style");
    style.textContent = `
      #tm-sidebar {
        position: fixed;
        top: 50%;
        right: -120px;
        transform: translateY(-50%);
        background: #fff;
        border: 1px solid #ddd;
        border-radius: 8px 0 0 8px;
        box-shadow: -2px 2px 8px rgba(0,0,0,0.1);
        width: 152px;
        transition: width 0.8s cubic-bezier(.3,0,.1,1);
        z-index: 9999;
        font-family: sans-serif;
        font-size: 16px;
        overflow: hidden;
      }
      #tm-sidebar:hover {
        right: -120px;
        width: 300px;
      }
      #tm-sidebar-header {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 8px;
        width: 32px;
        background: #007bff;
        color: #fff;
        font-weight: bold;
        font-size: 16px;
        cursor: pointer;
        transition: background 0.4s cubic-bezier(.4,0,.2,1);
        writing-mode: vertical-rl;
        text-orientation: upright;
        animation: blink 1s infinite;
      }
      #tm-sidebar:hover #tm-sidebar-header {
        display: none;
      }
      @keyframes blink {
        0% { opacity: 1; }
        50% { opacity: 0.8; }
        100% { opacity: 1; }
      }
      #tm-sidebar-content {
        display: none;
      }
      #tm-sidebar:hover #tm-sidebar-content {
        display: block;
      }
      #tm-sidebar-content a {
        display: flex;
        align-items: center;
        padding: 8px 10px;
        text-decoration: none;
        color: #333;
        border-bottom: 1px solid #eee;
        border-left: 5px solid transparent;
        transition: border-color 0.4s cubic-bezier(.4,0,.2,1), background 0.4s cubic-bezier(.4,0,.2,1);
      }
      #tm-sidebar-content a:hover {
        border-left-color: #007bff;
        background: #f5faff;
        padding-left: 20px;
        font-weight: bold;
      }
      /* 新增員工編號子選單 */
      #tm-copy-menu-wrapper {
        position: relative;
      }
      #tm-copy-menu-wrapper .menu-title {
        padding: 8px 10px;
        font-weight: bold;
        border-bottom: 1px solid #eee;
      }
      #tm-copy-menu-wrapper .submenu-content {
        overflow: hidden;
        max-height: 0;
        opacity: 0;
        transition: max-height 0.4s ease, opacity 0.4s ease;
        display: flex;
        flex-direction: column;
      }
      #tm-copy-menu-wrapper:hover .submenu-content {
        max-height: 500px;
        opacity: 1;
      }
      #tm-copy-menu-wrapper .copy-item {
        display: block;
        padding: 8px 20px;
        color: #333;
        text-decoration: none;
        border-bottom: 1px solid #eee;
        transition: background 0.4s, padding-left 0.4s;
        cursor: pointer;
      }
      #tm-copy-menu-wrapper .copy-item:hover {
        background: #f5faff;
        padding-left: 30px;
        font-weight: bold;
      }
    `;
    document.head.appendChild(style);
  };

  const createSidebar = () => {
    const container = document.createElement("div");
    container.id = "tm-sidebar";
    container.innerHTML = `
      <div id="tm-sidebar-header">
        快捷選單➤
      </div>
      <div id="tm-sidebar-content">
        <a id="LinkButtonLeaveInsert" href="https://hris.cht.com.tw/wams/GeneralForm/Leave/LeaveInsert.aspx">
          <span>請假簽報</span>
        </a>
        <a id="LinkButtonErrandNotice" href="https://hris.cht.com.tw/wams/GeneralForm/Errand/ErrandNotice.aspx?ERRANDOPEN=I">
          <span>公出差簽報</span>
        </a>
        <a id="LinkButtonOvertimeInsert" href="https://hris.cht.com.tw/Wams/GeneralForm/OverTime/OvertimeInsert.aspx">
          <span>加班簽報</span>
        </a>
        <a id="LinkButtonExtensionLeaveInsert" href="https://hris.cht.com.tw/Wams/GeneralForm/Extension/ExtensionLeaveInsert.aspx">
          <span>補休簽報</span>
        </a>
        <a id="LinkButtonEngFee" href="https://hris.cht.com.tw/Wams/GeneralForm/EngFee/EngFeeInsertJavaScript.aspx?MENU=EngFeeNotice.aspx">
          <span>食宿費簽報</span>
        </a>
        <a id="LinkButtonEngFeePayQuery" href="https://hris.cht.com.tw/Wams/GeneralForm/EngFeePay/EngFeePayQueryS.aspx">
          <span>食宿費支給簽報</span>
        </a>
        <a id="LinkButtonStatistic" href="https://hris.cht.com.tw/Wams/Statistic/StatisticQuery.aspx">
          <span>出勤查詢</span>
        </a>
        <a id="LinkButtonMealCostNOverTimeQuery" href="https://hris.cht.com.tw/Wams/Statistic/MealCostNOverTimeQuery.aspx">
          <span>食宿費進度查詢</span>
        </a>
        <a id="LinkButtonLeaveQuery" href="https://hris.cht.com.tw/Wams/Tools/LeaveQuery.aspx">
          <span>特休查詢</span>
        </a>
        <a id="LinkButtonChargeQuery" href="https://hris.cht.com.tw/Wams/Tools/ChargeQuery.aspx">
          <span>上下班刷卡查詢</span>
        </a>
        <div id="tm-copy-menu-wrapper">
          <div class="menu-title">▼員工編號</div>
          <div class="submenu-content">
            <a class="copy-item" data-number="304144">張竣傑 304144</a>
            <a class="copy-item" data-number="077503">陳俊榮 077503</a>
            <a class="copy-item" data-number="837750">鍾昱賦 837750</a>
            <a class="copy-item" data-number="837794">杜致恩 837794</a>
            <a class="copy-item" data-number="883256">劉冠岐 883256</a>
            <a class="copy-item" data-number="893282">劉信男 893282</a>
            <a class="copy-item" data-number="911841">卓冠融 911841</a>
            <a class="copy-item" data-number="916879">蘇欣宏 916879</a>
            <a class="copy-item" data-number="917021">葉哲銘 917021</a>
            <a class="copy-item" data-number="820990">林妤濃 820990</a>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(container);
    document.querySelectorAll('.copy-item').forEach(item => {
      item.addEventListener('click', function(e) {
        e.preventDefault();
        const number = this.getAttribute('data-number');
        navigator.clipboard.writeText(number).then(() => {
        const tip = document.createElement('div');
        tip.textContent = '已複製：' + number;
        tip.style.position = 'fixed';
        tip.style.top = '50%';
        tip.style.left = '50%';
        tip.style.transform = 'translate(-50%, -50%)';
        tip.style.background = 'rgba(0, 123, 255, 1.0)';
        tip.style.color = '#fff';
        tip.style.fontSize = '26px';
        tip.style.padding = '8px 12px';
        tip.style.borderRadius = '4px';
        tip.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)';
        tip.style.zIndex = 10000;
        tip.style.transition = 'opacity 2s ease-in';
        document.body.appendChild(tip);
        setTimeout(() => { tip.style.opacity = '0'; }, 200);
        setTimeout(() => { tip.remove(); }, 2050);
        }).catch(err => {
          console.error('複製失敗:', err);
        });
      });
    });
  };

  if(document.readyState === "loading"){
    document.addEventListener("DOMContentLoaded", () => {
      addStyles();
      createSidebar();
    });
  } else {
    addStyles();
    createSidebar();
  }
})();