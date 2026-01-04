// ==UserScript==
// @name            P&D戰友網 - 首頁活動管理
// @description     排序＋變成待辦清單
// @icon            https://pad.skyozora.com/images/egg.ico
// @author          jaychsu
// @version         1.0.0
// @license         WTFPL
// @include         *://pad.skyozora.com/
// @namespace https://greasyfork.org/users/420771
// @downloadURL https://update.greasyfork.org/scripts/397119/PD%E6%88%B0%E5%8F%8B%E7%B6%B2%20-%20%E9%A6%96%E9%A0%81%E6%B4%BB%E5%8B%95%E7%AE%A1%E7%90%86.user.js
// @updateURL https://update.greasyfork.org/scripts/397119/PD%E6%88%B0%E5%8F%8B%E7%B6%B2%20-%20%E9%A6%96%E9%A0%81%E6%B4%BB%E5%8B%95%E7%AE%A1%E7%90%86.meta.js
// ==/UserScript==


(function () {
  'use strict'
  
  /**
   * Config
   */
  const enableSort = true
  const sortFactor = true ? 1 : -1  // 1 for ascend
  
  const enableTodos = true
  
  
  /**
   * Main
   */
  window.addEventListener('DOMContentLoaded', function () {
    const $eventContainer = document.querySelector('.hasCountdown').parentNode.parentNode.parentNode
    
    if (enableTodos) {
      removeExpiredKeys()
      addTodoStyle()
      initTodos($eventContainer)
    }
    
    if (enableSort) sortEvents($eventContainer)
  })
  
  
  /**
   * Helpers
   */
  function initTodos($eventContainer) {
    const expires = JSON.parse(localStorage.getItem('td:expires')) || {}
    const now = Date.now()
    const currentYear = new Date().getFullYear()
    
    let $checkbox, $checkboxContainer, time, deadline
    
    Array.prototype.forEach.call($eventContainer.children, $row => {
      $checkboxContainer = document.createElement('TD')
      
      if (!Array.prototype.slice.call($row.children, -1)[0].children[0].classList.contains('hasCountdown')) {
        $row.prepend($checkboxContainer)
        return
      }
      
      let $children = Array.from($row.children)
      let key = `td:${$children[2].innerText.trim()}`
      
      $checkbox = document.createElement('INPUT')
      $checkbox.type = 'checkbox'
      
      $checkbox.addEventListener('click', ({target: $el}) => {
        if (!expires.hasOwnProperty(key)) {
          time = $children[0].innerText.match(/～(.*)?/)[1].slice(0, -1)
          deadline = +new Date(`${currentYear} ${time}:00`)
          expires[key] = ((deadline < now) ? +new Date(`${currentYear + 1} ${time}:00`) : deadline) + 86400 * 1000
          localStorage.setItem('td:expires', JSON.stringify(expires))
        }
        
        if ($el.checked) {
          $row.classList.add('padtodo')
          localStorage.setItem(key, 1)
        }
        else {
          $row.classList.remove('padtodo')
          localStorage.setItem(key, 0)
        }
      }, false)
      
      if (+localStorage.getItem(key)) {
        $checkbox.checked = true
        $row.classList.add('padtodo')
      }
      
      $checkboxContainer.append($checkbox)
      $row.prepend($checkboxContainer)
    })
  }
  
  function removeExpiredKeys() {
    const expires = JSON.parse(localStorage.getItem('td:expires')) || {}
    const now = Date.now()
    
    Object.keys(expires)
      .filter(key => expires[key] < now)
      .forEach(key => {
        delete expires[key]
        localStorage.removeItem(key)
      })
    
    localStorage.setItem('td:expires', JSON.stringify(expires))
  }
  
  function addTodoStyle() {
    const $head = document.head || document.getElementsByTagName('head')[0]
    const $style = document.createElement('STYLE')
    
    const css = `
      tr.padtodo { opacity: 20%; }
    `
    
    $style.type = 'text/css'
    if ($style.styleSheet) { // This is required for IE8 and below.
      $style.styleSheet.cssText = css
    } else {
      $style.appendChild(document.createTextNode(css))
    }
    
    $head.appendChild($style)
  }
  
  function sortEvents($eventContainer) {
    let ha, hb, ma, mb, isstarta, isstartb, isdonea, isdoneb

    Array.from(document.querySelectorAll('.hasCountdown')).sort(($a, $b) => {
      isdonea = $a.parentNode.parentNode.children[0].children[0].checked
      isdoneb = $b.parentNode.parentNode.children[0].children[0].checked
      isstarta = $a.parentNode.innerText.slice(-2) === '開始'
      isstartb = $b.parentNode.innerText.slice(-2) === '開始'
      ha = parseInt($a.children[0].children[0].innerText)
      hb = parseInt($b.children[0].children[0].innerText)
      ma = parseInt($a.children[1].children[0].innerText)
      mb = parseInt($b.children[1].children[0].innerText)

      if (isdonea !== isdoneb) return (isdonea) ? 1 : -1
      if (isstarta !== isstartb) return (isstarta) ? 1 : -1
      if (ha < hb) return -1 * sortFactor
      if (ha > hb) return 1 * sortFactor
      if (ma < mb) return -1 * sortFactor
      if (ma > mb) return 1 * sortFactor
      return 0
    }).forEach($el => {
      $eventContainer.appendChild($el.parentNode.parentNode)
    })
  }
})()