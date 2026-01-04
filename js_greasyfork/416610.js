// ==UserScript==
// @name         EHR系统辅助复制粘贴时间
// @namespace    https://gist.github.com/liubiantao
// @version      0.1
// @description  方便一键复制粘贴到excel里进行统计
// @author       liubiantao
// @match        https://hr.saybot.net:8443/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416610/EHR%E7%B3%BB%E7%BB%9F%E8%BE%85%E5%8A%A9%E5%A4%8D%E5%88%B6%E7%B2%98%E8%B4%B4%E6%97%B6%E9%97%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/416610/EHR%E7%B3%BB%E7%BB%9F%E8%BE%85%E5%8A%A9%E5%A4%8D%E5%88%B6%E7%B2%98%E8%B4%B4%E6%97%B6%E9%97%B4.meta.js
// ==/UserScript==

;(function () {
  'use strict'

  const observer = new MutationObserver(main)
  const config = {
    childList: true,
    subtree: true,
  }

  function main() {
    const targetDoms = document.querySelectorAll('.percheckq-time li > span')
    if (targetDoms.length > 0) {
      observer.disconnect()
      document.querySelectorAll('.percheckq-time li > span').forEach((item) => {
        console.log(item.innerText)
        item.innerText = item.innerText.split(' ')[1]
        item.addEventListener('click', () => {
          navigator.clipboard.writeText(item.innerText)
          item.style.color = '#2196f3'
          setTimeout(() => {
            item.style.color = '#333'
          }, 500)
        })
      })
      const timeDom = document.querySelector('.percheckq-time')
      observer.observe(timeDom, config)
    }
  }

  function init() {
    setTimeout(() => {
      const timeDom = document.querySelector('.percheckq-time')
      if (timeDom) {
        observer.observe(timeDom, config)

        window.onbeforeunload = function () {
          observer.disconnect()
        }
      } else {
        init()
      }
    }, 1000)
  }

  init()
})()
