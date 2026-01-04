// ==UserScript==
// @name        BIT北理工一键评教 - pj.bit.edu.cn（停止维护）
// @namespace   Violentmonkey Scripts
// @match       https://pj.bit.edu.cn/pjxt2.0/*
// @match       https://webvpn.bit.edu.cn/*/pjxt2.0/*
// @grant       GM_addStyle
// @version     2.2.2
// @author      xioneko
// @description 一键完成所有单选项并提交，可自定义评价选项；修复评教按钮不显示的问题
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/456110/BIT%E5%8C%97%E7%90%86%E5%B7%A5%E4%B8%80%E9%94%AE%E8%AF%84%E6%95%99%20-%20pjbiteducn%EF%BC%88%E5%81%9C%E6%AD%A2%E7%BB%B4%E6%8A%A4%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/456110/BIT%E5%8C%97%E7%90%86%E5%B7%A5%E4%B8%80%E9%94%AE%E8%AF%84%E6%95%99%20-%20pjbiteducn%EF%BC%88%E5%81%9C%E6%AD%A2%E7%BB%B4%E6%8A%A4%EF%BC%89.meta.js
// ==/UserScript==

if (document.URL.endsWith('queryListStpj') /* 课程评价首页 */) {
  // 修复评教按钮显示问题
  GM_addStyle(`
    .visible-desktop {
      display: unset !important;
    }
  `)
}

if (document.URL.endsWith('evaluateCourseInfo.do') /* 评教页 */) {
  if (document.querySelector('a[onclick*="savePjxx"]')) {
    document.querySelector('.create_tit').insertAdjacentHTML(
      'beforeend',
      `
      <div id="pj-input">
        <select id="pj-select">
          <option value="1" selected>非常符合</option>
          <option value="2">比较符合</option>
          <option value="3">一般</option>
          <option value="4">比较不符合</option>
          <option value="5">非常不符合</option>
        </select>
        <div id="pj-btn">提交</div>
      </div>
    `
    )
    document.querySelector('#pj-btn').addEventListener(
      'click',
      () => {
        const selection = document.querySelector('#pj-select').value
        for (let i = 0; i < 8; ++i) {
          document.querySelector(
            `#pjnr_${i + 1}_${selection}`
          ).checked = true
        }
        savePjxx('1') // 提交
      },
      {
        once: true,
      }
    )
    GM_addStyle(`
      .create_tit {
        display: flex;
        height: 40px;
        justify-content: space-between;
      }
      #pj-input {
        display: flex;
        align-items: center;
      }
      #pj-select{
        margin: 0 15px;
        border-radius: 0.5rem;
        height: 36px;
        width: 128px;
      }
      #pj-btn {
        cursor: pointer;
        transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
        padding: 0.5rem 1.5rem;
        border-radius: 0.5rem;
        background-color: #fbb955;
        color: white;
        border-bottom: 4px solid #e1992e;
      }
      #pj-btn:hover {
        filter: brightness(1.1);
        transform: translateY(1px);
        border-bottom-width: 6px;
      }
      #pj-btn:active {
        filter: brightness(0.9);
        transform: translateY(2px);
        border-bottom-width: 2px;
      }
  `)
  }
}