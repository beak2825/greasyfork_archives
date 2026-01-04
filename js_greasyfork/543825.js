// ==UserScript==
// @name         CHT CEMIS系統新增快捷選單
// @namespace    http://tampermonkey.net/
// @version      2.2.5
// @description  在CEMIS系統右側新增快捷選單
// @author       shanlan(ChatGPT o3-mini)
// @match        https://cemis3.cht.com.tw/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543825/CHT%20CEMIS%E7%B3%BB%E7%B5%B1%E6%96%B0%E5%A2%9E%E5%BF%AB%E6%8D%B7%E9%81%B8%E5%96%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/543825/CHT%20CEMIS%E7%B3%BB%E7%B5%B1%E6%96%B0%E5%A2%9E%E5%BF%AB%E6%8D%B7%E9%81%B8%E5%96%AE.meta.js
// ==/UserScript==

(function(){
  'use strict';

    if (window.top !== window.self) return;
    if(window.opener !== null) return;
  // 新增 CSS 樣式
  const addStyles = () => {
    const style = document.createElement("style");
    style.textContent = `
      #tm-sidebar {
        position: fixed;
        top: 50%;
        right: -350px;
        transform: translateY(-50%);
        background: #fff;
        border: 1px solid #ddd;
        border-radius: 8px 0 0 8px;
        box-shadow: -2px 2px 8px rgba(0,0,0,0.1);
        width: 387px;
        transition: width 0.8s cubic-bezier(.3,0,.1,1);
        z-index: 99999;
        font-family: sans-serif;
        font-size: 18px;
        overflow: hidden;
      }
      #tm-sidebar:hover {
        right: -350px;
        width: 750px;
      }
      #tm-sidebar-header {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 8px;
        width: auto;
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
        padding: 8px;
        padding-left: 10px;
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
    `;
    document.head.appendChild(style);
  };

  // 建立側邊欄結構
  const createSidebar = () => {
    const container = document.createElement("div");
    container.id = "tm-sidebar";
    container.innerHTML = `
      <div id="tm-sidebar-header">
        快捷選單➤
      </div>
      <div id="tm-sidebar-content">
        <a id="LinkButtonTRAM36" href="https://cemis3.cht.com.tw/CEMISRPT/TRAM/TRAM36">
          <span>TRAM36(工期核算.逾期免罰查詢)</span>
        </a>
        <a id="LinkButtonMATM23" href="https://msgrpt.cht.com.tw/RsView12/RsPortal.aspx">
          <span>MATM23(領退料查詢.BRF-25)</span>
        </a>
        <a id="LinkButtonWAFE" href="https://cemis3.cht.com.tw/CEMIS3/WAFE/Action_WAFE">
          <span>WAFE(檢查員工作單派工作業)</span>
        </a>
        <a id="LinkButtonPMIS" href="https://pmis.tais.cht.com.tw:8181/PMIS/default.htm">
          <span>PMIS(決算系統.350表)</span>
        </a>
        <a id="LinkButtonLD55" href="https://cemis3.cht.com.tw/CEMISAP/LD/LD55/Query">
          <span>LD55(材料單價)</span>
        </a>
        <a id="LinkButtonMUSE83" href="https://cemis3.cht.com.tw/CEMISRPT/MUSE/MUSE83">
          <span>MUSE83(材料領用退分析.未用料10%以內)</span>
        </a>
        <a id="LinkButtonMASIS" href="https://masis.cht.com.tw/IV_Net/IV/default.aspx">
          <span>MASIS倉儲子系統(料單確認)</span>
        </a>
        <a id="LinkButtonePIS" href="https://epis.cht.com.tw/as/CEMIS_ePIS.aspx">
          <span>ePIS財產新增作業</span>
        </a>
        <a id="LinkButtonDFA" href="https://cemis3.cht.com.tw/CEMIS/DFA/DFA2.aspx">
          <span>DFA請款單輸入作業</span>
        </a>
        </a>
        <a id="LinkButton" href="">
          <span></span>
        </a>
      </div>
    `;
    document.body.appendChild(container);
  };

  // 頁面載入後執行
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