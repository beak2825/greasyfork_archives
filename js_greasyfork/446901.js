// ==UserScript==
// @name         Annict dアニメストア ニコニコ支店
// @namespace    https://midra.me
// @version      1.0.8
// @description  Annictの作品詳細ページにdアニメストア ニコニコ支店のリンクを追加する
// @author       Midra
// @match        https://annict.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=annict.com
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @connect      site.nicovideo.jp
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/446901/Annict%20d%E3%82%A2%E3%83%8B%E3%83%A1%E3%82%B9%E3%83%88%E3%82%A2%20%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%E6%94%AF%E5%BA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/446901/Annict%20d%E3%82%A2%E3%83%8B%E3%83%A1%E3%82%B9%E3%83%88%E3%82%A2%20%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%E6%94%AF%E5%BA%97.meta.js
// ==/UserScript==

(async () => {
  'use strict'

  const ANNICT_EXT = {
    request: {
      config: {
        targetUrl: 'https://site.nicovideo.jp/danime/static/data/list.json',
      },
      async getDanimeList() {
        return new Promise((resolve, reject) => {
          GM_xmlhttpRequest({
            method: 'GET',
            url: this.config.targetUrl,
            responseType: 'json',
            onload: e => resolve(e.response),
            onerror: e => reject(e),
          })
        })
      },
    },

    cache: {
      _cache_key: '_mid_danimeList_cache',
      _lastupdated_key: '_mid_danimeList_lastUpdated',
      /**
       * @returns {Promise<{ title: string; url: string; }[]> | undefined}
       */
      get() {
        try {
          const cache = JSON.parse(GM_getValue(this._cache_key))
          return Object.keys(cache).length !== 0 ? cache : void 0
        } catch(e) {
          console.error(e)
        }
      },
      /**
       * @returns {number}
       */
      getLastUpdated() {
        return new Date(Number(GM_getValue(this._lastupdated_key))).getTime()
      },
      /**
       * @param {{ title: string; url: string; col_key: string; }[]} data
       * @returns {boolean}
       */
      set(data) {
        if (Array.isArray(data) && data.length !== 0) {
          data.forEach(v => delete v['col_key'])
          data.sort((a, b) => a.title < b.title ? -1 : b.title < a.title ? 1 : 0)
          GM_setValue(this._cache_key, JSON.stringify(data))
          GM_setValue(this._lastupdated_key, new Date().getTime())
          return true
        }
        return false
      },
      reset() {
        GM_deleteValue('_mid_danimeList_cache')
        GM_deleteValue('_mid_danimeList_lastUpdated')
      },
      async update() {
        const data = await ANNICT_EXT.request.getDanimeList()
        if (this.set(data)) {
          console.log('「dアニメストア ニコニコ支店」の作品リストを更新しました。')
        } else {
          console.error('「dアニメストア ニコニコ支店」の作品リストの更新に失敗しました。')
        }
      },
      isOld(period_h = 24) {
        const now = new Date().getTime()
        const lastUpdated = this.getLastUpdated()
        return (now - lastUpdated) >= (period_h * 216000)
      },
    },

    /**
     * @returns {Promise<{ title: string; url: string; }[]> | undefined}
     */
    async getList() {
      let data = this.cache.get()
      if (data === void 0 || this.cache.isOld()) {
        await this.cache.update()
        data = this.cache.get() || data
      }
      return data
    },

    /**
     * @param {string} title
     * @returns {Promise<{ title: string; url: string; } | { title: string; url: string; }[] | undefined>}
     */
    async getMatchItems(title) {
      const list = await this.getList()
      if (list === void 0) return
      const annictTitle = this.normalizeTitle(title)
      if (annictTitle === '') return
      /**
       * @type {{ item: { title: string; url: string; } | null; items: { title: string; url: string; }[] }}
       */
      const result = list.reduce((result, item) => {
        const itemTitle = this.normalizeTitle(item.title)
        if (itemTitle === annictTitle) {
          result.item = item
        } else if (Math.min(itemTitle.length, annictTitle.length) / Math.max(itemTitle.length, annictTitle.length) > 0.65) {
          const idxA = itemTitle.indexOf(annictTitle)
          const idxB = annictTitle.indexOf(itemTitle)
          const idx = Math.max(idxA, idxB)
          if (idx !== -1) {
            result.items.push({ idx, ...item })
          }
        }
        return result
      }, { item: null, items: [] })
      console.log({ item: result.item, items: [...result.items] })
      if (result.item !== null) {
        return result.item
      } else if (result.items.length !== 0) {
        result.items.sort((a, b) => a.idx < b.idx ? -1 : b.idx < a.idx ? 1 : 0)
        return result.items
        // return result.items.pop().url
        // return result.items[0]?.url
      }
    },

    normalizeTitle(title = '') {
      return title.toLowerCase()
        .replace(/[\s-−\(\)（）｢｣「」『』【】［］〈〉《》〔〕{}｛｝\[\]]/g, '')
        .replace(/[ａ-ｚ０-９]/g, s => String.fromCharCode(s.charCodeAt(0) - 0xFEE0))
        .replace(/./g, s => ({
          '〜': '~',
          '？': '?',
          '！': '!',
          '”': '"',
          '’': "'",
          '´': "'",
          '｀': '`',
          '：': ':',
          '，': ',',
          '．': '.',
          '・': '･',
          '／': '/',
          '＃': '#',
          '＄': '$',
          '％': '%',
          '＆': '&',
          '＝': '=',
          '＠': '@',
        }[s] || s))
    },

    generateStreamingLink(url, text) {
      const item = document.createElement('li')
      item.classList.add('list-inline-item', 'mt-2')
      const link = document.createElement('a')
      link.classList.add('btn', 'btn-outline-primary', 'btn-sm', 'rounded-pill', 'danime-niconico-added')
      link.href = url
      link.target = '_blank'
      link.rel = 'noopener'
      link.insertAdjacentText('afterbegin', text)
      link.insertAdjacentHTML('beforeend', '<svg class="svg-inline--fa fa-external-link-alt fa-w-16 ms-1 small" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="external-link-alt" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M432,320H400a16,16,0,0,0-16,16V448H64V128H208a16,16,0,0,0,16-16V80a16,16,0,0,0-16-16H48A48,48,0,0,0,0,112V464a48,48,0,0,0,48,48H400a48,48,0,0,0,48-48V336A16,16,0,0,0,432,320ZM488,0h-128c-21.37,0-32.05,25.91-17,41l35.73,35.73L135,320.37a24,24,0,0,0,0,34L157.67,377a24,24,0,0,0,34,0L435.28,133.32,471,169c15,15,41,4.5,41-17V24A24,24,0,0,0,488,0Z"></path></svg>')
      item.appendChild(link)
      return item
    },

    async init() {
      if (this.cache.isOld()) {
        await this.cache.update()
      }
    },
  }

  ANNICT_EXT.init()

  let timeout = null
  const addLink = () => {
    if (timeout !== null) {
      clearTimeout(timeout)
    }
    if (!location.href.startsWith('https://annict.com/works/')) return
    timeout = setTimeout(async () => {
      const title = document.querySelector('.c-work-header h1.fw-bold.h2.mt-1 > a.text-body')
      const linkContainer = document.querySelector('.c-work-header ul.list-inline.mb-0')
      let streamingLinkContainer = document.querySelector('.c-work-header ul.list-inline.mt-2')
      const hasDanimeLink = Array.from(streamingLinkContainer?.children || []).find(v => v.textContent.indexOf('dアニメストア ニコニコ支店') !== -1) !== undefined
      if (hasDanimeLink || title === null || streamingLinkContainer === null && linkContainer === null) return
      const items = await ANNICT_EXT.getMatchItems(title.textContent)
      console.log(items)
      if (items !== void 0) {
        if (streamingLinkContainer === null) {
          linkContainer.insertAdjacentHTML('beforebegin',
            `<ul class="list-inline mt-2"></ul>`
          )
          streamingLinkContainer = document.querySelector('.c-work-header ul.list-inline.mt-2')
        }
        if (Array.isArray(items)) {
          items.forEach(item => {
            streamingLinkContainer.appendChild(
              ANNICT_EXT.generateStreamingLink(item.url, `dアニメストア ニコニコ支店 (${item.title})`)
            )
          })
        } else {
          streamingLinkContainer.appendChild(
            ANNICT_EXT.generateStreamingLink(items.url, 'dアニメストア ニコニコ支店')
          )
        }
      }
      timeout = null
    }, 200)
  }

  const obs = new MutationObserver(mutationList => {
    Array.from(mutationList).forEach(mutation => {
      Array.from(mutation.addedNodes).forEach(added => {
        if (added.nodeName === 'TITLE') {
          addLink()
        }
      })
    })
  })
  obs.observe(document.head, { childList: true, subtree: true })

  addLink()

  const style = document.createElement('style')
  style.textContent = `
    .btn-outline-primary.danime-niconico-added {
      border-color: #EB5528;
      color: #EB5528;
    }
    .btn-outline-primary.danime-niconico-added:hover {
      color: #fff;
      background-color: #EB5528;
      border-color: #EB5528;
    }
    .btn-outline-primary.danime-niconico-added:focus {
      box-shadow: 0 0 0 0.25rem #EB552880;
    }
  `
  document.documentElement.appendChild(style)
})()
