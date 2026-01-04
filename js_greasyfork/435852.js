// ==UserScript==
// @name         派蒙答题器
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  派蒙的十万个为什么，自动搜答案
// @author       You
// @match        https://webstatic.mihoyo.com/*
// @grant        GM_xmlhttpRequest
// @require     https://unpkg.com/string-similarity/umd/string-similarity.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/435852/%E6%B4%BE%E8%92%99%E7%AD%94%E9%A2%98%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/435852/%E6%B4%BE%E8%92%99%E7%AD%94%E9%A2%98%E5%99%A8.meta.js
// ==/UserScript==

(async function () {
  'use strict';

  const box = createBoxElement()
  let container = null
  const answers = await fetchAnswers()
  let lastQuestion = null

  const timer = setInterval(() => {
    container = document.querySelector('[class|="components-game-assets-index___container"]')
    if (container) {
      clearInterval(timer)
      start()
    }
  }, 1000)

  function start() {
    log('start monitoring!~')

    // test();

    const observer = new MutationObserver(function (mutationList, observer) {
      checkForAnswer()
    })
    observer.observe(container, { childList: true, subtree: true })
    checkForAnswer()
  }

  function log(...args) {
    console.log('[派蒙答题器]: ', ...args)
  }

  function test() {
    let res;
    const testArr = [
        '将一个角色从1级突破到90级，可以通过角色突破获得多少相遇之缘奖励？',
        '砂糖的天赋「小小的慧风」可以给砂糖自身提供元素精通加成。'
    ]
    testArr.forEach(q => {
      log(getAnswersForQuestion(q))
    })
  }

  function getAnswersForQuestion(question) {
    return answers
            .map((o) => ({...o, rating: stringSimilarity.compareTwoStrings(o.q, question)}))
            .filter(o => o.rating > 0)
            .sort((a, b) => b.rating - a.rating)
            
  }
  
  function checkForAnswer() {
    const questionElem = document.querySelector('[class|="components-game-assets-qa-info___text"]')
    if (questionElem) {
      const question = questionElem.textContent
      if (question === lastQuestion) return

      lastQuestion = question
      const filterd = getAnswersForQuestion(question)
      log(question, filterd.slice(0, 3))
      box.innerHTML = filterd.slice(0, 3)
        .map(o => o.rating > 0.8 ? `<b>${o.q}<br>${o.a}</b>` : `${o.q}<br>${o.a}`)
        .join('<br><br>')
    }
  }

  function createBoxElement(){
    const box = document.createElement('div')
    box.style = 'position: fixed; z-index: 999; top: 10px; left: 0; background-color: rgba(243, 240, 236, .9); padding: 10px 20px; font-size: .2rem; text-align: center; border-radius: .1rem;'
    document.body.appendChild(box)
    return box
  }

  async function fetchAnswers() {
    const url = 'https://wiki.biligame.com/ys/%E3%80%8C%E6%B4%BE%E8%92%99%E7%9A%84%E5%8D%81%E4%B8%87%E4%B8%AA%E4%B8%BA%E4%BB%80%E4%B9%88%E3%80%8D%E9%A2%98%E5%BA%93'
    // 加载答案库
    const htmlStr = await fetch(url)
    const dom = new DOMParser().parseFromString(htmlStr, "text/html");
    return [...dom.querySelectorAll('.wikitable tbody tr')].map(({ children }) => ({
      q: children[0].textContent,
      a: children[1].textContent
    }))
  }

  function fetch(url) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: 'GET',
        url: url,
        onload(e) {
          resolve(e.response)
        },
        onerror: reject
      })
    })
  }

})();