// ==UserScript==
// @name         BIT-校园网-上网明细
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  给“上网明细”中的“总流量”标注颜色，类似 lsd --long
// @license      GPL-3.0-or-later
// @supportURL   https://github.com/YDX-2147483647/BIT-enhanced/issues
// @author       Y.D.X.
// @match        http://10.0.0.54:8800/log/detail*
// @match        http://10.0.0.54/log/detail*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/475251/BIT-%E6%A0%A1%E5%9B%AD%E7%BD%91-%E4%B8%8A%E7%BD%91%E6%98%8E%E7%BB%86.user.js
// @updateURL https://update.greasyfork.org/scripts/475251/BIT-%E6%A0%A1%E5%9B%AD%E7%BD%91-%E4%B8%8A%E7%BD%91%E6%98%8E%E7%BB%86.meta.js
// ==/UserScript==

(function () {
  'use strict'

  if (window.location.port !== '8800') {
    // 标准未写明如何处理端口。
    // https://developer.chrome.com/docs/extensions/mv3/match_patterns/#special
    // 有些实现匹配时完全不比较端口，并且要求`@match`不能包含端口。
    // https://github.com/quoid/userscripts/blob/4200fb249ca61d491a61d20d6ba4c08bd0d16d52/xcode/Safari-Extension/Functions.swift#L1151
    // https://github.com/quoid/userscripts/issues/301#issuecomment-1215009943
    // 为了兼容，增加不带端口的`@match`并自己比较端口。
    return
  }

  const table = document.querySelector('#w0-container > table')

  /** “总流量”（人类可读）列号 */
  const TRAFFIC_HUMAN_COL = 5
  /** “总流量”（机器数据）列号 */
  const TRAFFIC_DATA_COL = 4
  /** 划分大小的基数 */
  const BASE = Math.pow(1024, 0.6)
  /** 颜色系列，每种颜色对于一种流量大小，小流量在前 */
  const PALETTE = ['gray', 'darkmagenta', 'darkblue', 'green', 'orange', 'red', 'fuchsia']

  /**
     * 检查网站内容是否符合预期
     * @returns {boolean} 是否符合预期
     */
  function content_as_expected () {
    const traffic_human_thead = table.querySelector(`thead th:nth-child(${TRAFFIC_HUMAN_COL + 1})`)
    const traffic_data_thead = table.querySelector(`thead th:nth-child(${TRAFFIC_DATA_COL + 1})`)

    let as_expected = traffic_human_thead.textContent === '总流量' && traffic_human_thead.style.display !== 'none'
    as_expected &= traffic_data_thead.textContent === '总流量' && traffic_data_thead.style.display === 'none'

    return as_expected
  }

  /**
     * 上色
     * @param {HTMLElement} element
     * @param {Number} data
     */
  function paint (element, data) {
    for (const color of PALETTE.slice(0, -1)) {
      if (data < BASE) {
        element.style.color = color
        return
      } else {
        data /= BASE
      }
    }

    // Fallback to the last
    element.style.color = PALETTE[PALETTE.length - 1]
  }

  if (!content_as_expected()) {
    console.error('网站有变，此脚本可能不再适用。已停用。')
    return
  }

  table.querySelectorAll('tbody > tr').forEach(row => {
    /** @type {HTMLTableCellElement} */
    const cell = row.children[TRAFFIC_HUMAN_COL]
    const traffic = Number(row.children[TRAFFIC_DATA_COL].textContent)

    paint(cell, traffic)
  })
})()
