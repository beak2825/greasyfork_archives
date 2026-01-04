// ==UserScript==
// @name        Hide videos on Bilibili web page using a blacklist
// @namespace   Violentmonkey Scripts
// @match       *://*.bilibili.com/*
// @grant       GM_getValue
// @grant       GM_setValue
// @version     1.0.4
// @author      zxm
// @description 隐藏在黑名单中的UP的视频
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/478384/Hide%20videos%20on%20Bilibili%20web%20page%20using%20a%20blacklist.user.js
// @updateURL https://update.greasyfork.org/scripts/478384/Hide%20videos%20on%20Bilibili%20web%20page%20using%20a%20blacklist.meta.js
// ==/UserScript==

(function(){
  'use strict';
  let black_list = GM_getValue('black_list') || []
  // debounce
  function debounce(fn, duration = 300) {
    let timer = null
    return function() {
      if (timer === null) {
        fn()
        timer = setTimeout(() => {
          clearTimeout(timer)
          timer = null
        }, duration)
      } else {
        clearTimeout(timer)
        timer = setTimeout(() => {
          fn()
          clearTimeout(timer)
          timer = null
        }, duration)
      }
    }
  }
  // hide videos by blacklist
  function hide() {
    if (black_list.length === 0) return
    const cards = document.querySelectorAll('.bili-video-card')
    for(let i = 0; i < cards.length; i++) {
      const card = cards[i]
      const author_div = card.querySelector('.bili-video-card__info--author')
      if (author_div) {
        const author = author_div.innerText.trim()
        if (black_list.includes(author)) {
          const hasSibling = card.nextElementSibling || card.previousElementSibling
          if (hasSibling) {
            card.remove()
          } else  {
            card.parentNode.remove()
          }
        }
      }
    }
  }

  const debounce_hide = debounce(hide)

  function addBlackList(list) {
    const unames = list.map(item => item.uname)
    black_list = [...new Set([...black_list, ...unames])]
  }

  let total_page = 1
  const PAGE_START = 1
  const PAGE_SIZE = 50

  const options = {
    method: 'GET',
    credentials: "include"
  }

  function fetchBlackList(pn, ps) {
    fetch(`https://api.bilibili.com/x/relation/blacks?jsonp=jsonp&pn=${pn}&ps=${ps}&re_version=0`, options)
      .then(response => response.json())
      .then(result => {
        const {data} = result
        if (data) {
          const { list, total } = data
          addBlackList(list)
          if (pn === 1) {
            total_page = Math.ceil(total/ps)
          }
          if (pn === total_page) {
            GM_setValue('black_list', black_list)
            debounce_hide()
          }
          if (pn < total_page) {
            fetchBlackList(pn + 1, ps)
          }
        }
      })
  }

  debounce_hide()
  fetchBlackList(PAGE_START, PAGE_SIZE)


  const observer = new MutationObserver((mutationsList, observer) => {
    mutationsList.forEach(function(mutation) {
        if (mutation.type === 'childList') {
            debounce_hide()
        }
    })
  })
  const config = { childList: true, subtree: true, attributes: false, characterData: false };

  function addObserver(dom) {
    if (dom) {
      observer.observe(dom, config)
    }
  }
  // main page
  const main_wrapper = document.querySelector('main')
  // search page
  const search_wrapper = document.querySelector('.search-content')
  addObserver(main_wrapper)
  addObserver(search_wrapper)
})()
