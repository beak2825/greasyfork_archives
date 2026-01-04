// ==UserScript==
// @name         Youtube优化
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  youtube优化
// @author       ljk

// @match      *.youtube.com/*
// @match      *.instagram.com/*

// @grant        none
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/454880/Youtube%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/454880/Youtube%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function () {
  'use strict'

  /* 实现新标签页打开链接 */
  function kidnap() {
    function selectAll() {
      return document.querySelectorAll('a')
    }

    function selectV(tag) {
      const arr = Array.from(document.querySelectorAll(`${tag} a`))
      return arr
    }

    function Open(e, href) {
      const video = document.querySelector('video')
      video && video.pause()
      e.preventDefault()
      e.stopPropagation()
      window.open(href)
      return false
    }

    const exclude = ['#sections > ytd-guide-section-renderer:nth-child(1)', 'ytd-masthead', '#items > ytd-guide-collapsible-entry-renderer', '#content > ytd-mini-guide-renderer', 'section._aamu._ae3_._ae40._ae41._ae48', '.x9f619.xjbqb8w.x78zum5.x168nmei.x13lgxp2.x5pf9jr.xo71vjh', '._aabd._aa8k._aanf', '._ab70']
    let excludes = []
    for (let i = 0; i < exclude.length; i++) {
      const items = selectV(exclude[i])
      excludes = excludes.concat(items)
    }

    const list = Array.from(selectAll()).filter(item => !excludes.includes(item))

    list.forEach((item) => {
      item.setAttribute('target', '_blank')
      const url = item.getAttribute('href')
      item.onclick = (e) => {
        Open(e, url)
      }
    })
  }

  function toast(message) {
    const body = document.querySelector('body')
    const span = document.createElement('span')
    span.style = 'position: fixed;bottom: 10px;right: 10px;background-color: #ccc;padding: 4.8px 10px;border-radius: 4.8px;z-index:9999'
    span.textContent = message
    body.appendChild(span)
    setTimeout(() => {
      span.remove()
    }, 1000)
  }

  function debounce(fn, delay) {
    let timer = null
    return function (...args) {
      clearTimeout(timer)
      timer = setTimeout(() => {
        fn.apply(this, args)
      }, delay)
    }
  }

  window.onload = function () {
    // 初始劫持
    // kidnap()
    // 等待加载完成劫持
    setTimeout(() => {
      kidnap()
    }, 500)
    // 页面滚动劫持
    const dekidnap = debounce(kidnap, 300)

    /* 实现视频按钮添加下载 */
    const button = document.createElement('button')
    button.setAttribute('style', `
    border: 0px;
    padding: 1rem 1rem;
    border-radius: 1.3rem;
    font-size: 1rem;
    margin-left: 0.3rem;
    cursor: pointer;
    `)

    button.setAttribute('id', 'lkdown')
    button.onclick = function () {
      const href = window.location.href
      const clip = navigator.clipboard
      const video = document.querySelector('video')
      video.pause()
      clip.writeText(href).then((res) => {
        setTimeout(() => {
          window.open('https://www.y2mate.com/en346/download-youtube')
        }, 300)
      }, (error) => {
        console.log(error)
      })
    }
    button.textContent = 'Download'

    window.addEventListener('scroll', () => {
      dekidnap()
      if (/youtube\.com\/watch*/.test(window.location.href)) {
        const actions = document.querySelector('#actions')
        if (!document.querySelector('#lkdown') && /watch\?/.test(window.location.href))
          actions.insertBefore(button, actions.firstChild)
      }
      toast('已完成优化')
    })
  }
})()
