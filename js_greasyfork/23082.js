/* eslint-env greasemonkey, browser */
// ==UserScript==
// @name         leetcode-hide-locked
// @namespace    weibo.com/flowmemo
// @version      0.1.4
// @description  hide locked problems in LeetCode
// @author       flowmemo
// @match        https://leetcode.com/problemset/*
// @grant        none
// @license      MIT
// @supportURL   https://github.com/flowmemo/leetcode-hide-locked
// @downloadURL https://update.greasyfork.org/scripts/23082/leetcode-hide-locked.user.js
// @updateURL https://update.greasyfork.org/scripts/23082/leetcode-hide-locked.meta.js
// ==/UserScript==

;(function () {
  'use strict'
  function removeLocked () {
    const all = document.querySelectorAll('tbody.reactable-data tr')
    Array.prototype.forEach.call(all, tr => { tr.style.display = '' })
    const locked = document.querySelectorAll('tbody.reactable-data .fa-lock')
    Array.prototype.forEach.call(locked, item => {
      const tr = item.parentElement.parentElement.parentElement
      if (tr.tagName === 'TR') tr.style.display = 'none'
    })
  }
  const problemList = document.querySelector('div[data-reactroot]')
  const observer = new MutationObserver(removeLocked)
  observer.observe(problemList, { childList: true, subtree: true })
  removeLocked()
})()
