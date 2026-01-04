// ==UserScript==
// @name         Comick Random Comic
// @namespace    https://github.com/GooglyBlox
// @version      1.1
// @description  Add a random comic button to your Comick reading list
// @author       GooglyBlox
// @match        https://comick.dev/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542278/Comick%20Random%20Comic.user.js
// @updateURL https://update.greasyfork.org/scripts/542278/Comick%20Random%20Comic.meta.js
// ==/UserScript==

;(function() {
  'use strict'

  ;['pushState', 'replaceState'].forEach(fn => {
    const orig = history[fn]
    history[fn] = function() {
      const ret = orig.apply(this, arguments)
      window.dispatchEvent(new Event('locationchange'))
      return ret
    }
  })
  window.addEventListener('popstate', () => {
    window.dispatchEvent(new Event('locationchange'))
  })

  window.addEventListener('locationchange', onRouteChange)
  document.addEventListener('DOMContentLoaded', onRouteChange)

  async function onRouteChange() {
    if (!/\/user\/[^/]+\/list/.test(location.pathname)) {
      removeButton()
      return
    }

    const filterBtn = await waitForFilterButton()
    removeButton()
    injectRandomButton(filterBtn)
  }

  function waitForFilterButton(timeout = 10000) {
    return new Promise((resolve, reject) => {
      const start = Date.now()
      const tick = () => {
        const btn = findFilterButton()
        if (btn) return resolve(btn)
        if (Date.now() - start > timeout) {
          return reject('Filter button did not appear')
        }
        setTimeout(tick, 300)
      }
      tick()
    })
  }

  function findFilterButton() {
    return Array.from(document.querySelectorAll('button[type="button"]'))
      .find(b => b.textContent.includes('Filter') && b.querySelector('svg')) || null
  }

  function removeButton() {
    const old = document.querySelector('#random-comic-btn')
    if (old) old.remove()
  }

  function injectRandomButton(filterBtn) {
    const btn = document.createElement('button')
    btn.id = 'random-comic-btn'
    btn.type = 'button'
    btn.className = filterBtn.className + ' mr-5'
    btn.innerHTML = getIcon() + 'Random'

    btn.addEventListener('click', async () => {
      btn.disabled = true
      btn.innerHTML = getIcon() + 'Loading...'
      const allComics = await loadAndIndexAllComics()
      goToRandomComic(allComics)
    })

    filterBtn.parentNode.insertBefore(btn, filterBtn)
  }

  function getIcon() {
    return `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 mr-2">
          <rect width="12" height="12" x="2" y="10" rx="2" ry="2"/>
          <path d="m17.92 14 3.5-3.5a2.24 2.24 0 0 0 0-3l-5-4.92a2.24 2.24 0 0 0-3 0L10 6"/>
          <path d="M6 18h.01"/>
          <path d="M10 14h.01"/>
          <path d="M15 6h.01"/>
          <path d="M18 9h.01"/>
      </svg>
    `
  }

  function loadAndIndexAllComics() {
    return new Promise(resolve => {
      const allComics = new Map()
      let stableCount = 0
      let lastSize = 0

      window.scrollTo(0, 0)

      const iv = setInterval(() => {
        const currentComics = getCurrentComicLinks()
        currentComics.forEach(comic => {
          allComics.set(comic.href, comic)
        })

        if (allComics.size === lastSize) {
          stableCount++
          if (stableCount >= 2) {
            clearInterval(iv)
            window.scrollTo(0, 0)
            return resolve(Array.from(allComics.values()))
          }
        } else {
          stableCount = 0
          lastSize = allComics.size
        }

        window.scrollBy(0, window.innerHeight * 2)
      }, 50)
    })
  }

  function getCurrentComicLinks() {
    return Array.from(document.querySelectorAll('a[href^="/comic/"]')).filter(a => {
      const parts = a.getAttribute('href').split('/')
      const rect = a.getBoundingClientRect()
      return parts.length === 3
          && parts[2]
          && rect.width > 0
          && rect.height > 0
          && a.textContent.trim()
          && (a.classList.contains('link-effect-no-ring') || !a.querySelector('span'))
    }).map(a => ({
      href: a.href,
      title: a.textContent.trim()
    }))
  }

  function goToRandomComic(allComics) {
    if (!allComics.length) {
      alert('No comics found in your current filtered list!')
      resetButton()
      return
    }

    const randomComic = allComics[Math.floor(Math.random() * allComics.length)]
    location.href = randomComic.href
  }

  function resetButton() {
    const btn = document.querySelector('#random-comic-btn')
    if (btn) {
      btn.disabled = false
      btn.innerHTML = getIcon() + 'Random'
    }
  }
})()