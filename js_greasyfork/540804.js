// ==UserScript==
// @name         Comick Comic Type Column
// @namespace    https://github.com/GooglyBlox
// @version      1.2
// @description  Adds a column showing comic type (Manga/Manhwa/Manhua) based on country
// @author       GooglyBlox
// @match        https://comick.dev/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540804/Comick%20Comic%20Type%20Column.user.js
// @updateURL https://update.greasyfork.org/scripts/540804/Comick%20Comic%20Type%20Column.meta.js
// ==/UserScript==

;(function() {
  'use strict'

  ;['pushState','replaceState'].forEach(fn => {
    const orig = history[fn]
    history[fn] = function(...args) {
      const ret = orig.apply(this, args)
      window.dispatchEvent(new Event('locationchange'))
      return ret
    }
  })
  window.addEventListener('popstate', () => window.dispatchEvent(new Event('locationchange')))
  window.addEventListener('DOMContentLoaded', onRouteChange)
  window.addEventListener('locationchange', onRouteChange)

  const comicCountryMap = new Map()
  let tableObserver = null

  async function onRouteChange() {
    const inList = /\/user\/[^/]+\/list/.test(location.pathname)
    if (!inList) {
      teardown()
      return
    }

    const userId = extractUserIdFromUrl()
    if (!userId) return
    const follows = await fetchUserFollows(userId)
    buildComicCountryMap(follows)

    await waitForSelector('.flex.w-full.items-center.min-w-0', 10_000).catch(() => null)
    teardown()
    processTable()
    setupMutationObserver()
  }

  function teardown() {
    document.querySelectorAll('[data-comic-type-header]').forEach(el => el.remove())
    document.querySelectorAll('[data-comic-type-cell]').forEach(el => el.remove())
    if (tableObserver) {
      tableObserver.disconnect()
      tableObserver = null
    }
  }

  function setupMutationObserver() {
    if (tableObserver) return

    const debounce = (fn, ms=100) => {
      let t
      return (...args) => {
        clearTimeout(t)
        t = setTimeout(() => fn(...args), ms)
      }
    }

    tableObserver = new MutationObserver(debounce(() => {
      processTable()
    }))
    tableObserver.observe(document.body, { childList: true, subtree: true })
  }

  function processTable() {
    const rows = Array.from(document.querySelectorAll('.flex.w-full.items-center.min-w-0'))
    if (!rows.length) return

    const [header, ...dataRows] = rows
    addTypeColumnHeader(header)
    dataRows.forEach(addTypeColumnToRow)
  }

  function addTypeColumnHeader(headerRow) {
    if (headerRow.querySelector('[data-comic-type-header]')) return

    const th = document.createElement('div')
    th.className = 'text-center pl-3 flex items-center h-12 w-20 lg:w-24 font-semibold flex-none text-sm'
    th.setAttribute('data-comic-type-header', '')
    th.innerHTML = '<div class="w-full text-center">Type</div>'

    const ref = headerRow.children[headerRow.children.length - 3]
    headerRow.insertBefore(th, ref)
  }

  function addTypeColumnToRow(row) {
    if (row.querySelector('[data-comic-type-cell]')) return

    const link = row.querySelector('a[href*="/comic/"]')
    if (!link) return

    const slug = link.getAttribute('href').split('/comic/')[1]
    const country = comicCountryMap.get(slug)
    const type = country ? getComicTypeFromCountry(country) : 'Unknown'

    const td = document.createElement('div')
    td.className = 'flex justify-center text-sm md:text-base w-20 lg:w-24 flex-none'
    td.setAttribute('data-comic-type-cell', '')
    td.innerHTML = `<div class="w-full text-center">${type}</div>`

    const ref = row.children[row.children.length - 3]
    row.insertBefore(td, ref)
  }

  function extractUserIdFromUrl() {
    const m = location.pathname.match(/\/user\/([^/]+)\//)
    return m ? m[1] : null
  }

  async function fetchUserFollows(userId) {
    try {
      const res = await fetch(`https://api.comick.dev/user/${userId}/follows`)
      if (!res.ok) throw new Error(res.status)
      return await res.json()
    } catch (e) {
      console.error('Failed to fetch follows:', e)
      return []
    }
  }

  function buildComicCountryMap(follows) {
    comicCountryMap.clear()
    follows.forEach(item => {
      const c = item.md_comics
      if (c && c.slug && c.country) comicCountryMap.set(c.slug, c.country)
    })
  }

  function getComicTypeFromCountry(country) {
    switch (country.toLowerCase()) {
      case 'kr': case 'gb': return 'Manhwa'
      case 'cn':             return 'Manhua'
      case 'jp':             return 'Manga'
      default:               return 'Unknown'
    }
  }

  function waitForSelector(selector, timeout = 5000) {
    return new Promise((resolve, reject) => {
      const el = document.querySelector(selector)
      if (el) return resolve(el)

      const obs = new MutationObserver(() => {
        const found = document.querySelector(selector)
        if (found) {
          obs.disconnect()
          resolve(found)
        }
      })
      obs.observe(document.body, { childList: true, subtree: true })

      setTimeout(() => {
        obs.disconnect()
        reject(`Timeout: ${selector}`)
      }, timeout)
    })
  }
})();