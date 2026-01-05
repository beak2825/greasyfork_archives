// ==UserScript==
// @name         fuck智联
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  屏蔽智联,51job垃圾信息
// @author       zybzzc
// @match        *://sou.zhaopin.com/*
// @match        *://search.51job.com/*
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/29701/fuck%E6%99%BA%E8%81%94.user.js
// @updateURL https://update.greasyfork.org/scripts/29701/fuck%E6%99%BA%E8%81%94.meta.js
// ==/UserScript==

/* eslint-env browser */

(function fuck () {
  const hostname = location.hostname
  let fuckCompanies = localStorage.getItem('fuckCompanies')
  if (hostname === 'sou.zhaopin.com') {
    const messageList = Array.from(document.querySelectorAll('.newlist'))
    messageList.forEach((msgEle, index) => {
      const tds = Array.from(msgEle.querySelectorAll('tbody tr td'))
      tds.forEach((td, idx) => {
        if (idx === 0) { td.style.display = 'flex' }
        // if (idx === 3) { td.style.width = '100px' }
        if (idx === 4) { td.style.width = '85px' }
        if (idx === 5) { td.style.paddingLeft = '0px' }
      })
      if (index === 0) {
        return
      }
      const companyName = msgEle.querySelector('.gsmc').textContent.trim()
      if (fuckCompanies && JSON.parse(fuckCompanies).indexOf(companyName) !== -1) {
        msgEle.style.display = 'none'
        return
      }
      const delBtn = document.createElement('TD')
      delBtn.style.paddingLeft = '20px'
      delBtn.style.cursor = 'pointer'
      delBtn.innerHTML = '<a>删除</a>'
      delBtn.onclick = function (e) {
        messageList.forEach(msgEle => {
          if (msgEle.querySelector('.gsmc').textContent.trim() === companyName) {
            msgEle.style.display = 'none'
          }
        })
        let fuckCompanies = localStorage.getItem('fuckCompanies')
        if (!fuckCompanies) {
          fuckCompanies = [companyName]
        } else {
          fuckCompanies = (new Set(JSON.parse(fuckCompanies))).add(companyName)
        }
        localStorage.setItem('fuckCompanies', JSON.stringify(Array.from(fuckCompanies)))
      }
      msgEle.querySelector('tbody tr').appendChild(delBtn)
    })
  }
  if (hostname === 'search.51job.com') {
    const messageList = Array.from(document.querySelectorAll('#resultList div[class=el]'))
    messageList.forEach(msgEle => {
      const tds = Array.from(msgEle.children)
      tds.forEach((td, idx) => {
        if (idx % 3 === 0) {
          td.style.padding = '0'
        }
      })
      const companyName = msgEle.querySelector('.t2 a').textContent.trim()
      if (fuckCompanies && JSON.parse(fuckCompanies).indexOf(companyName) !== -1) {
        msgEle.style.display = 'none'
        return
      }
      const delBtn = document.createElement('SPAN')
      // delBtn.style.paddingLeft = '20px'
      delBtn.style.cursor = 'pointer'
      delBtn.innerHTML = '<a>删除</a>'
      delBtn.onclick = function (e) {
        messageList.forEach(msgEle => {
          if (msgEle.querySelector('.t2 a').textContent.trim() === companyName) {
            msgEle.style.display = 'none'
          }
        })
        let fuckCompanies = localStorage.getItem('fuckCompanies')
        if (!fuckCompanies) {
          fuckCompanies = [companyName]
        } else {
          fuckCompanies = (new Set(JSON.parse(fuckCompanies))).add(companyName)
        }
        localStorage.setItem('fuckCompanies', JSON.stringify(Array.from(fuckCompanies)))
      }
      msgEle.appendChild(delBtn)
    })
  }
})()
