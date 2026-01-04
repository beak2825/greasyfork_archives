// ==UserScript==
// @name         显示洛谷题目的 Python 最优解记录数
// @namespace    https://zhaoji.ac.cn/
// @version      0.1
// @description  在洛谷的题目页中显示该题目 Python3 与 PyPy3 最优解记录数。
// @author       Zhaoji Wang
// @match        https://www.luogu.com.cn/problem/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=luogu.com.cn
// @grant        none
// @license      Apache-2.0
// @downloadURL https://update.greasyfork.org/scripts/444779/%E6%98%BE%E7%A4%BA%E6%B4%9B%E8%B0%B7%E9%A2%98%E7%9B%AE%E7%9A%84%20Python%20%E6%9C%80%E4%BC%98%E8%A7%A3%E8%AE%B0%E5%BD%95%E6%95%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/444779/%E6%98%BE%E7%A4%BA%E6%B4%9B%E8%B0%B7%E9%A2%98%E7%9B%AE%E7%9A%84%20Python%20%E6%9C%80%E4%BC%98%E8%A7%A3%E8%AE%B0%E5%BD%95%E6%95%B0.meta.js
// ==/UserScript==

;(() => {
  'use strict'

  async function run() {
    const $infoRows = document.querySelector('.info-rows')
    const problemNum = /(?<=problem\/)\w+/.exec(window.location.href)[0]
    const python3RecordUrl = `/record/list?pid=${problemNum}&language=7&page=1&orderBy=1&status=`
    const pypy3RecordUrl = `/record/list?pid=${problemNum}&language=25&page=1&orderBy=1&status=`

    async function getRecordNum(url) {
      const html = await fetch(url).then((x) => x.text())
      const feInjectionPattern =
        /(?<=window\._feInjection = JSON\.parse\(decodeURIComponent\(").+(?="\)\);)/
      const feInjection = JSON.parse(
        decodeURIComponent(feInjectionPattern.exec(html)[0])
      )
      return feInjection.currentData.records.count
    }

    function getRowHTML(name, href, num) {
      return `
        <div style="margin-bottom: var(--info-row-margin-bottom, 1em); display: flex; align-items: center;">
          <span style="flex: 1 0 auto;">
            <span>${name}</span>
          </span>
          <span>
            <a
              href="${href}"
              class="color-default"
              style="text-decoration: none"
            >
              <span> ${num} </span>
            </a>
          </span>
        </div>
      `
    }

    function addInfoRow(name, href, num) {
      const $row = document.createElement('div')
      $infoRows.append($row)
      $row.outerHTML = getRowHTML(name, href, num)
      return $row
    }

    addInfoRow(
      'Python 3 最优解记录数',
      python3RecordUrl,
      await getRecordNum(python3RecordUrl)
    )
    addInfoRow(
      'PyPy 3 最优解记录数',
      pypy3RecordUrl,
      await getRecordNum(pypy3RecordUrl)
    )
  }

  function check() {
    if (document.querySelector('.info-rows')) {
      run()
    } else {
      setTimeout(check, 100)
    }
  }

  check()
})()
