// ==UserScript==
// @name         驾校一点通顺序答题
// @namespace    http://tampermonkey.net/
// @version      0.2.0
// @description  通过按键作答
// @author       vonweb
// @match        *://mnks.jxedt.com/ckm1/*
// @match        *://mnks.jxedt.com/ckm1/*/*
// @match        *://mnks.jxedt.com/ckm4/*
// @match        *://mnks.jxedt.com/ckm4/*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/412741/%E9%A9%BE%E6%A0%A1%E4%B8%80%E7%82%B9%E9%80%9A%E9%A1%BA%E5%BA%8F%E7%AD%94%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/412741/%E9%A9%BE%E6%A0%A1%E4%B8%80%E7%82%B9%E9%80%9A%E9%A1%BA%E5%BA%8F%E7%AD%94%E9%A2%98.meta.js
// ==/UserScript==

(function () {
  'use strict';
  const optionKeyMap = {
    a: 0,
    A: 0,
    1: 0,
    b: 1,
    B: 1,
    2: 1,
    c: 2,
    C: 2,
    3: 2,
    d: 3,
    D: 3,
    4: 3,
    e: 4,
    E: 4,
    5: 4
  }
  const navMap = {
    n: 'next',
    N: 'next',
    ArrowRight: 'next',
    p: 'prev',
    P: 'prev',
    ArrowLeft: 'prev',
  }
  function createClickEvent() {
    const clickEvent = new MouseEvent('click', {
      cancelable: true,
      bubbles: true,
      view: window
    })
    return clickEvent
  }
  function triggerClick(el) {
    if (el) {
      el.dispatchEvent(createClickEvent())
    }
  }
  window.addEventListener('keydown', ev => {
    const optionIndex = optionKeyMap[ev.key]
    if (typeof optionIndex !== 'undefined') {
      const el = document.querySelectorAll('.options .option')[optionIndex]
      triggerClick(el)
      const lowerKey = ev.key.toLowerCase()
      if (lowerKey !== ev.key) {
        const nextEl = document.querySelector(`.page .next`)
        triggerClick(nextEl)
        // window.scrollTo(0, 250)
      }
      return
    }
    const nav = navMap[ev.key]
    if (nav) {
      ev.preventDefault()
      const el = document.querySelector(`.page .${nav}`)
      triggerClick(el)
      // window.scrollTo(0, 250)
    }
  })
})();
