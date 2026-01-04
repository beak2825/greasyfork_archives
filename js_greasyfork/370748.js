// ==UserScript==
// @name         Vocabulary
// @namespace    http://tampermonkey.net/
// @version      0.6.10
// @description  Tweaks in Vocabulary
// @author       Feng Ya
// @match        https://www.vocabulary.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370748/Vocabulary.user.js
// @updateURL https://update.greasyfork.org/scripts/370748/Vocabulary.meta.js
// ==/UserScript==

/* global MutationObserver */

;(function () {
  'use strict'
  // Your code here...
  window.onload = function () {
    const audioSupport = document.querySelector('div.audio_support')
    audioSupport && audioSupport.parentNode.removeChild(audioSupport)
  }

  // dictionary
  const input = document.querySelector('input#search')

  if (input) {
    input.blur()
    input.addEventListener('keydown', event => {
      // console.log(event.key)
      switch (event.key) {
        case 'Escape':
        case 'Enter':
          input.blur()
          break
      }
    })
  }

  document.body.addEventListener('keydown', event => {
    // console.log(event)
    if (event.target.nodeName === 'INPUT') return

    const tools = document.querySelector('div.wordtools')
    const hidden = tools && tools.classList.contains('hidden')

    function lookup (index) {
      if (!hidden) {
        const lookups = document.querySelectorAll('div.selected div.lookup')
        // console.log(lookups)
        lookups.length && lookups[index].click()
      }
    }

    switch (event.key) {
      case 'a':
        lookup(0)
        break
      case 's':
        lookup(1)
        break
      case 'd':
        lookup(2)
        break
      case 'f':
        lookup(3)
        break

      case 'i':
        event.preventDefault()
        document.querySelector('input#search').focus()
        break

      case 'j':
        document.querySelector('button.next').click()
        break

      case 'l':
        const learn = document.querySelector('button.learn')
        learn && learn.click()
        break

      case 'o':
        if (!hidden) {
          const audio =
            document.querySelector('div.tools > a.listen') ||
            document.querySelector('a.audio')
          audio && audio.click()
        }
        break

      case 'Backspace':
        window.history.back()
        break
    }
  })

  // console.log(window.location)
  const pathname = window.location.pathname

  if (pathname === '/lists/vocabgrabber') {
    document
      .querySelector('button.ss-settings')
      .addEventListener('click', () => {
        const count = parseInt(
          document.querySelector('div.resultsonly > h1 > span').textContent,
          10
        )

        const selects = document.querySelectorAll(
          'div.menu-item[data-action="select"]'
        )
        // console.log(selects)

        selects[0].setAttribute('data-count', (count / 4).toFixed())
        selects[0].textContent = 'Select First 25%'

        selects[1].setAttribute('data-count', (count / 2).toFixed())
        selects[1].textContent = 'Select First 50%'

        selects[2].setAttribute('data-count', count.toFixed())
        selects[2].textContent = 'Select All Words'
      })
  }

  if (
    pathname === '/' ||
    pathname === '/play/' ||
    (pathname.startsWith('/lists') && pathname.endsWith('practice'))
  ) {
    const target = document.querySelector('div#challenge')
    // console.log(target)
    const config = { childList: true, subtree: true }

    const callback = function (mutations) {
      // console.log(mutationsList)
      for (let mutation of mutations) {
        if (mutation.target.className === 'questionPane') {
          changeAccessKey()
        }
      }
    }
    const observer = new MutationObserver(callback)
    observer.observe(target, config)
  }

  function changeAccessKey () {
    document.querySelectorAll('div.active div.choices > a').forEach(a => {
      const key = a.getAttribute('accesskey')
      switch (key) {
        case '1':
        case '1A':
          a.setAttribute('accesskey', '1A')
          break
        case '2':
        case '2B':
          a.setAttribute('accesskey', '2S')
          break
        case '3':
        case '3C':
          a.setAttribute('accesskey', '3D')
          break
        case '4':
        case '4D':
          a.setAttribute('accesskey', '4F')
          break
        default:
          break
      }
    })
  }
})()
