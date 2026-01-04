// ==UserScript==
// @name         Buyee Seller Filter
// @license      MIT
// @version      2.38
// @description  Add infinite scrolling and options for filtering sellers to the Buyee search results page
// @author       rhgg2
// @match        https://buyee.jp/item/search/*
// @icon         https://www.google.com/s2/favicons?domain=buyee.jp
// @namespace    https://greasyfork.org/users/1243343
// @grant        none
// @require      https://unpkg.com/localforage@1.10.0/dist/localforage.min.js
// @require      https://unpkg.com/simplelightbox@2.8.1/dist/simple-lightbox.min.js
// @require      https://unpkg.com/air-datepicker@3.6.0/air-datepicker.js
// @downloadURL https://update.greasyfork.org/scripts/483909/Buyee%20Seller%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/483909/Buyee%20Seller%20Filter.meta.js
// ==/UserScript==

(() => {
  'use strict'
  if (window.top !== window.self) return

  document.head.append(el('style', { id: 'bf-hide-initial', text: '.g-main:not(.g-modal) { visibility: hidden !important; height: 100vh }' }))
  document.head.append(el('meta', { name: 'google', content: 'notranslate' }))
  document.head.append(el('style', { text: '@import url("https://unpkg.com/air-datepicker@3.6.0/air-datepicker.css")' }))
  document.head.append(el('script', { src: 'https://unpkg.com/tom-select@2.4.3/dist/js/tom-select.complete.min.js' }))
  document.head.append(el('style', { text: '@import url("https://unpkg.com/tom-select@2.4.3/dist/css/tom-select.css")' }))

  /*** utilities ***/

  Document.prototype.$ = Element.prototype.$ = function(sel) { return this.querySelector(sel) }
  Document.prototype.$$ = Element.prototype.$$ = function(sel) { return this.querySelectorAll(sel) }
  const $ = Element.prototype.$.bind(document)
  const $$ = Element.prototype.$$.bind(document)

  function $x(path, ctx = document) {
    return ctx.evaluate(path, ctx, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue
  }

  Document.prototype.on = Element.prototype.on = function (type, selectorOrHandler, handlerOrCapture, capture=false) {
    // direct binding: el.on('click', fn, capture)
    if (typeof selectorOrHandler === 'function') {
      this.addEventListener(type, selectorOrHandler, handlerOrCapture)
      return this
    }

    // delegated binding: el.on('click', 'button', fn, capture)
    const selector = selectorOrHandler
    const handler = handlerOrCapture
    this.addEventListener(type, ev => {
      const el = ev.target.closest(selector)
      el && this.contains(el) && handler.call(el, ev, el)
    }, capture)
    return this
  }

  function el(sel = 'div', props = {}, ...children) {
    let rest
    [,sel,rest] = sel.match(/([^ ]*) *(.*)/)
    if (rest.length) return el(sel, {}, el(rest, props, ...children))

    const [, tag = 'div', id, cls = ''] = sel.match(/^([a-z][\w-]*)?(?:#([\w-]+))?(.*)?$/) || []
    const e = document.createElement(tag)
    id && (e.id = id)
    cls && e.classList.add(...cls.split('.').filter(Boolean))

    Object.entries(props).forEach(([k,v]) => {
      k === 'style' ? typeof v === 'string' ? e.style.cssText = v : Object.assign(e.style, v) :
      k === 'data' ? Object.assign(e.dataset, v) :
      k === 'text' ? e.textContent = v :
      k === 'html' ? e.innerHTML = v :
      /^on[A-Z0-9]/i.test(k) ? e[k] = v :
      e.setAttribute(k, v)
    })

    children.flat().forEach(c => e.append(c instanceof Node ? c : document.createTextNode(c)))

    return e
  }

  function fetchURL(url, timeout = 10000) {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeout)

    return fetch(url, { signal: controller.signal })
      .then(r => (clearTimeout(timer), r.ok) ? r.text() : Promise.reject({ type: 'http', status: r.status }))
      .then(html => new DOMParser().parseFromString(html, 'text/html'))
      .catch(err => {
        err.type ??= err.name === 'AbortError' ? 'timeout' : err instanceof TypeError ? 'network' : 'other'
        return Promise.reject(err)
      })
  }

  const Dom = {
    hide: el => el && (el.style.display = 'none'),
    show: el => el && el.style.removeProperty('display'),
    hidden: el => getComputedStyle(el)?.display === 'none',
    reflow: el => { el.offsetWidth; return el },
    style: (name, obj) => (t => `${name} {${t}}`)(
      Object.entries(obj).map(([k,v]) =>
        `${k.replace(/[A-Z]/g, m => '-' + m.toLowerCase())}: ${v}`
      ).join('; '))
  }

  function waitFor (sel) {
    return new Promise(resolve => {
      const el = $(sel)
      if (el) return resolve(el)

      new MutationObserver((o, obs) => {
        const el = $(sel)
        if (el) { obs.disconnect(); resolve(el) }
      }).observe(document.body, { childList: true, subtree: true });
    })
  }

  const wait = ms => ms ? new Promise(resolve => setTimeout(resolve, ms)) : new Promise(requestAnimationFrame)

  /*** config ***/

  const BFConfig = (() => {
    const ANIM_DELAY = 350
    return {
      SCRAPER_THREADS: 5,
      SCRAPER_DELAY: 100,
      SCROLL_DELAY: 100,
      HIDE_TIMEOUT: 3500,
      UNBLOCK_DELAY: 3000,
      BATCH_SIZE: 20,
      ANIM_DELAY,
      STYLES: [
        'span.watchList__watchNum.bf-node { user-select: none; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none }',
        Dom.style('button.bf-button', {
          border: '1px solid silver',
          padding: '3px 5px',
          borderRadius: '3px',
          margin: '2px',
          fontSize: '100%',
          fontFamily: 'Arial,"Hiragino Kaku Gothic ProN",Meiryo,"MS PGothic",sans-serif'
        }),
        Dom.style('div.bf-batch', {
          transition: `opacity ${ANIM_DELAY}ms ease, transform ${ANIM_DELAY}ms ease`,
          overflowX: 'hidden'
        }),
        Dom.style('div.bf-batch.animate', {
          opacity: 0,
          transform: 'translateY(30px)'
        }),
        Dom.style('button.sp-toggle', {
           position: 'absolute',
           top: '15px',
           left: '50%',
           transform: 'translateX(-50%)',
           padding: '10px',
           height: '40px',
           cursor: 'pointer',
           zIndex: 70,
           background: 'rgba(0,0,0,0.5)',
           color: 'white',
           border: 'none',
           borderRadius: '6px',
           fontSize: '1.1em !important'
        }),
        Dom.style('div.sp-filters', {
          position: 'absolute',
          top: '60px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          padding: '10px',
          zIndex: 69,
          background: 'rgba(0,0,0,0.4)',
          color: 'white',
          borderRadius: '6px',
          userSelect: 'none',
          font: '14px sans-serif',
          touchAction: 'manipulation',
        }),
        Dom.style('.sp-filters button', {
          background: 'white !important',
          fontSize: '100% !important'
        }),
        Dom.style('.bf-hide', {
          opacity: '0 !important',
          transform: 'translateX(60px) !important',
        }),
        Dom.style('.bf-dimmed', {
          opacity: '0.9 !important',
          backgroundColor: '#ffbfbf !important',
        }),
        Dom.style('.bf-item', {
          willChange: 'background-color opacity transform',
          transition: `background-color ${ANIM_DELAY}ms ease, opacity ${ANIM_DELAY}ms ease, transform ${ANIM_DELAY}ms ease`,
          opacity: '1',
          transform: 'translateX(0)'
        }),
        Dom.style('.air-datepicker-global-container .air-datepicker', {
          zIndex: '290'
        }),
        Dom.style('.air-datepicker-global-container .air-datepicker-overlay', {
          zIndex: '289'
        }),
        Dom.style('.bf-modal', {
          position: 'fixed',
          inset: '0',
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          zIndex: 250,
          overflowY: 'auto',
          overflowX: 'hidden',
        }),
        Dom.style('.bf-padding', {
          maxWidth: '600px',
          width: '100%',
          padding: '4em 2em',
          transform: 'translate3d(0,0,0)',
          willChange: 'transform',
        }),
        Dom.style('.bf-inner', {
          background: 'white',
          borderRadius: '8px',
          maxWidth: '600px',
          width: '100%',
          padding: '0px 10px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          overflowWrap: 'anywhere',
          boxSizing: 'border-box',
        }),
        Dom.style('.bf-inner *', {
          maxWidth: '100%',
          boxSizing: 'border-box'
        }),
        Dom.style('footer, .footer', { display: 'none !important' }),
         Dom.style('.bf-historical.auctionSearchResult .g-thumbnail__outer', { flex: '0 0 95px', height: '100px' }),
         Dom.style('.bf-historical.auctionSearchResult .g-thumbnail', { height: '95px', width: '95px' }),
         Dom.style('.bf-historical.auctionSearchResult .itemCard__itemInfo', { flex: '1 0 calc(100% - 125px)' }),
         Dom.style('.bf-historical.auctionSearchResult .itemCard__itemName a', { whiteSpace: 'normal', width: '100%' }),
         Dom.style('.bf-historical.auctionSearchResult .itemCard__itemDetails', { width: '100%' }),
      ],
      DESKTOP_STYLES: [
        Dom.style('button.bf-button:hover', { filter: 'brightness(90%)' }),
      ],
      MOBILE_STYLES: [
        // Dom.style('#goog-gt-tt, .goog-te-balloon-frame', { display: 'none !important' }),
        // Dom.style('.goog-text-highlight', { background: 'none !important', boxShadow: 'none !important' }),
        Dom.style('.auctionSearchResult .g-thumbnail__outer', { flex: '0 0 145px' }),
        Dom.style('.auctionSearchResult .g-thumbnail', { height: '145px', width: '145px' }),
        Dom.style('.auctionSearchResult .itemCard__itemInfo', { flex: '1 0 calc(100vw - 175px)' }),
        Dom.style('.auctionSearchResult .itemCard__itemName', { fontSize: '1.35rem', marginBottom: '5px', wordBreak: 'break-all' }),
        Dom.style('.auctionSearchResult .g-priceDetails__item .g-price__outer .g-price', { fontSize: '1.5rem', display: 'inline-block' }),
        Dom.style('.auctionSearchResult .itemCard__infoItem .g-text', { fontSize: '1.35rem' }),
      ]
    }
  })()

  /*** state ***/
  const BFState = (() => {

    const isDesktop = !/android|webos|iphone|ipad|ipod|blackberry|windows phone/i.test(navigator.userAgent)

    let initialised = false
    let flushing = false
    const state = { sellers: {}, items: {}, history: {} }
    const stateUpd = { sellers: {}, items: {}, history: {} }

    const flush = () => {
      if (flushing) return Promise.resolve()
      flushing = true
      stateUpd.sellers = {}
      stateUpd.items = {}
      {
        const save = key => localforage.setItem(`BF${key}`, state[key]) // eslint-disable-line no-undef
        return Promise.all([save('sellers'), save('items'), save('history')])
          .then(() => {
            delete localStorage.BFUsellers
            delete localStorage.BFUitems
            delete localStorage.BFUhistory
          })
          .finally(() => { flushing = false })
      }
    }

    const safeParse = s => {
      if (!s) return null
      if (typeof s === 'object') return s
      try { return JSON.parse(s) }
      catch { return null }
    }

    const initialise = () => {
      if (initialised) return Promise.resolve()

      const parse = key => localforage.getItem(`BF${key}`) // eslint-disable-line no-undef
        .then(v1 => {
          v1 = v1 ?? {}
          const v2 = safeParse(localStorage.getItem(`BFU${key}`)) ?? {}
          const store = state[key]
          Object.assign(store, v1)
          Object.entries(v2).forEach(([k,v]) => {
            if (v._delete) {
              delete store[k]
            } else if (v._replace) {
              store[k] = v;
              delete v._replace
            } else {
              store[k] ??= {}
              Object.assign(store[k], v)
            }
          })
        })

      const prune = () => {
        const now = Date.now(), WEEK = 6048e5
        const pruneStore = (store, len) => {
          Object.entries(store).forEach(([k,v]) => {
            v.lastSeen && (now - v.lastSeen > len) && delete store[k]
          })
        }
        pruneStore(state.items, WEEK)
        pruneStore(state.sellers, 24 * WEEK)

        Object.entries(state.history).forEach(([k,v]) => {
          v.endTime && v.hide && (now - v.endTime > WEEK) && delete state.history[k]
        })
      }


      return Promise.all([parse('sellers'), parse('items'), parse('history')])
        .then(prune)
        .then(flush)
        .then(() => (initialised = true))
    }

    const proxy = key => {
      const get = k => state[key][k]
      const has = k => k in state[key]
      const set = (k,v) => {
        state[key][k] = v
        stateUpd[key][k] = Object.assign( { _replace: true }, v)
        localStorage[`BFU${key}`] = JSON.stringify(stateUpd[key])
        if (localStorage[`BFU${key}`].length > 500000) flush()
      }
      const assign = (k,v) => {
        state[key][k] ??= {}
        stateUpd[key][k] ??= {}
        if (stateUpd[key][k]?._delete) stateUpd[key][k] = { _replace: true }
        Object.assign(state[key][k], v)
        Object.assign(stateUpd[key][k], v)
        localStorage[`BFU${key}`] = JSON.stringify(stateUpd[key])
      }
      const deleteMethod = k => {
        delete state[key][k]
        stateUpd[key][k] = { _delete: true }
      }
      const forEach = fn =>
        Object.entries(state[key]).forEach(([k,v]) => fn(v,k))

      return { get, set, has, assign, delete: deleteMethod, forEach }
    }

    const safeKeys = new Set(['initialise', 'isDesktop', 'hide'])

    return new Proxy({
      sellers: proxy('sellers'),
      items: proxy('items'),
      history: proxy('history'),
      hide: JSON.parse(localStorage.BFhide ?? 'true'),
      isDesktop,
      initialise
    }, {
      get(obj, k) {
        if (!initialised && !safeKeys.has(k)) {
          console.error("Store not initialised before use")
          return undefined
        }
        return obj[k]
      },
      set(obj, k, v) {
        obj[k] = v
        if (k === 'hide') localStorage.BFhide = JSON.stringify(v)
        return true
      }
    })
  })()

  /*** image filters ***/
  const BFFilters = (() => {
    const filters = {
      hue: { txt:'Hue', step:1, min:-180, max:180, val:0, def:0,
             filt() { return `hue-rotate(${this.val}deg)` }},
      sat: { txt:'Sat', step:2, min:0, max:300, val:100, def:100,
             filt() { return `saturate(${this.val}%)` }},
      bri: { txt:'Lum', step:1, min:0, max:300, val:100, def:100,
             filt() { return `brightness(${this.val}%)`}},
      con: { txt:'Con', step:2, min:0, max:300, val:100, def:100,
             filt() { return `contrast(${this.val}%)`}}
    }

    const act = (filt, sgn) => {
      const a = filters[filt]
        a.val = Math.max(a.min, Math.min(a.max, a.val + a.step * sgn))
    }
    const reset = o => Object.entries(filters).forEach(([k,v]) => (v.val = (o?.[k] ?? v.def)))
    const style = (o = null) => { o && reset(o); return Object.values(filters).map(v => v.filt()).join(' ') }
    const values = () => Object.fromEntries(Object.entries(filters).map(([k,v]) => [k, v.val]))
    const changed = () => Object.fromEntries(Object.entries(filters).filter(([k,v]) => v.val !== v.def).map(([k,v]) => [k, v.val]))
    const names = () => Object.fromEntries(Object.entries(filters).map(([k,v]) => [k, v.txt]))

    return { act, style, reset, values, changed, names }
  })()

  /*** photo enhancements ***/
  const BFPhoto = (() => {
    let thumbsCallback

    const add = elt => {
      const elements = [...elt.$$('a')]
      if (!elements.length) return

      const id = elements[0].dataset?.id
      const sellerid = BFState.items.get(id)?.seller

      const lightbox = new SimpleLightbox(elements, { // eslint-disable-line no-undef
        animationSpeed: 100,
        fadeSpeed: 100,
        widthRatio: 1,
        loop: false
      })

      lightbox.on('shown.simplelightbox', () => {
        const seller = sellerid && BFState.sellers.get(sellerid)
        BFFilters.reset(seller?.filters)
        addControls($('.simple-lightbox'), lightbox, sellerid)
      })

      lightbox.on('close.simplelightbox', () => {
        BFState.sellers.assign(sellerid, { filters: BFFilters.changed() })
      })
    }

    const addControls = (overlay, lightbox, sellerid) => {

      const panel =
        el('.sp-filters', { style: { opacity: '0', pointerEvents: 'none' }},
          ...Object.entries(BFFilters.names()).map(([k, txt]) =>
            el('.sp-row', { style: { display: 'flex', alignItems: 'center', gap: '8px' }},
              el('span', { text: `${txt}:`, style: 'min-width: 40px' }),
              el('span.sp-val', { data: { for: k }, style: 'min-width: 25px' }),
              el('button', { data: { action: k, step: '-1' }, text: '-', style: 'min-width: 40px; min-height: 40px' }),
              el('button', { data: { action: k, step: '+1' }, text: '+', style: 'min-width: 40px; min-height: 40px' })
            )),
          el('button', { data: { action: 'reset' }, text: 'Ø', style: 'min-height: 40px' })
        )

      const toggle = el('button.sp-toggle', {
        text: 'Adjust',
        onclick: () => {
          const shown = panel.style.opacity === '1'
          panel.style.opacity = shown ? '0' : '1'
          panel.style.pointerEvents = shown ? 'none' : 'auto'
        }
      })

      const update = () => {
        const style = BFFilters.style()
        const imgs = [
          ...($('.sl-image')?.$$('img') ?? []),
          ...lightbox.relatedElements,
          ...(thumbsCallback?.(sellerid) ?? [])
        ]

        imgs.forEach(img => (img.style.filter = style))
        panel.$$('.sp-val').forEach(s => (s.textContent = BFFilters.values()[s.dataset.for]))
      }

      const act = (name, step) => {
        name === 'reset' ? BFFilters.reset() : BFFilters.act(name, step)
        update()
      }

      let holdTimer, activeBtn

      const startHoldEvs = (...evs) => evs.forEach(ev =>
        panel.on(ev, 'button[data-action]', (e, btn) => {
          e.preventDefault()
          const { action, step } = btn.dataset
          activeBtn = btn
          btn.style.transform = 'scale(0.92)'
          act(action, +step)
          holdTimer = setTimeout(() => {
            holdTimer = setInterval(() => act(action, +step), 30)
          }, 150)
        })
      )

      const stopHoldEvs = (...evs) => evs.forEach(ev =>
        panel.on(ev, () => {
          activeBtn && (activeBtn.style.transform = '')
          clearTimeout(holdTimer)
          clearInterval(holdTimer)
          holdTimer = activeBtn = null
        })
      )

      if (!$('.sp-filters')) {
        overlay.append(toggle,panel)
        startHoldEvs('mousedown', 'touchstart')
        stopHoldEvs('mouseup', 'mouseleave', 'touchend', 'touchcancel')
      }

      update()
    }

    const setCallback = fn => (thumbsCallback = fn)

    document.head.append(el('link', { rel: 'stylesheet', href: 'https://unpkg.com/simplelightbox@2.8.1/dist/simple-lightbox.min.css' }))

    document.on('pointerdown', e => {
      const panel = $('.sp-filters')
      const toggle = $('.sp-toggle')
      panel && panel.style.opacity === '1'
            && !panel.contains(e.target)
            && !toggle.contains(e.target)
            && toggle.click()
    })

    return { add, setCallback }
  })()

  /*** countdown timers ***/
  const BFCountdown = (() => {
    const countdowns = new Map()

    function timeUntil(date) {
      const diff = (date - Date.now())/1000

      if (diff <= 0) return "Ended"

      const fmt = (n, t) => n > 0 ? `${n} ${t}${n > 1 ? 's' : ''}` : null

      if (diff < 1800) {
        const min = Math.floor((diff / 60) % 60)
        const sec = Math.floor(diff % 60)
        return [fmt(min, 'min'), fmt(sec, 'sec')].filter(Boolean).join(' ')
      } else {
        const days = Math.floor(diff / 86400)
        const hrs = Math.floor((diff / 3600) % 24)
        const min = Math.floor((diff / 60) % 60)
        return [fmt(days, "day"), fmt(hrs, "hr"), fmt(min, "min")].filter(Boolean).join(' ')
      }
    }

    function add(date, el) {
      const fast = (date - Date.now()) < 1.8e6
      countdowns.set(el, { date, paused: false, fast })
      el.$('.g-text').textContent = timeUntil(date)
    }

    function remove(el) {
      countdowns.delete(el)
    }

    function pause(el, state = true)
    {
      const {date, fast} = countdowns.get(el) ?? {}
      if (date) countdowns.set(el, { date, paused: state, fast })
    }

    function update(onlyFast = false) {
      const now = Date.now()
      countdowns.forEach((item, el) => {
        if (!item.paused && item.fast === onlyFast) {
          el.$('.g-text').textContent = timeUntil(item.date)
          if (!onlyFast && (item.date - now) < 1.8e6) item.fast = true
        }})
      wait(onlyFast ? 1000 : 60000).then(() => update(onlyFast))
    }

    update()
    update(true) // fast updates

    return { add, pause, remove }
  })()

  /*** queue factory ***/
  const BFQueue = callback => {
    const processingQueue = []
    const inFlightItems = new Set()
    const readItems = new Set()
    let activeCount = 0

    function run() {
      if (!processingQueue.length || activeCount >= BFConfig.SCRAPER_THREADS) return

      const { id, url } = processingQueue.shift()
      activeCount++

      fetchURL(url)
      .then(doc => {
        callback(id,doc)
        readItems.add(id)
      })
      .catch(err => console.error('fetchURL failed for', url, err))
      .finally(() => {
        inFlightItems.delete(id)
        wait(BFConfig.SCRAPER_DELAY).then(() => {
          activeCount--
          run()
        })
      })
      activeCount < BFConfig.SCRAPER_THREADS && run()
    }

    // force = true allows reprocessing
    function add(item, force = false) {
      if (inFlightItems.has(item.id) || (readItems.has(item.id) && !force)) return
      if (force instanceof Document) {
        callback(item.id, force)
        readItems.add(item.id)
        return
      }
      processingQueue.push(item)
      inFlightItems.add(item.id)
      run()
    }

    return { add }
  }

  /*** card scraping ***/
  const BFScraper = callback => {
    function process(id, doc) {
      const sellernode = $x('//a[contains(@href,"search/customer")]', doc)
      const [, sellerid] = sellernode?.href?.match(/\/item\/search\/customer\/(.*)/) || []
      const item = BFState.items.get(id) ?? { hide: false, seller: sellerid }
      const bidBtn = $x('//button[contains(normalize-space(.), "Bid")]', doc)
      const snipeBtn = $x('//button[contains(normalize-space(.), "Snipe")]', doc)
      const msg = doc.$('.g-textArea--error, .g-box--caution')

      if (sellerid && !BFState.sellers.get(sellerid)) {
        BFState.sellers.set(sellerid, {
          name: sellernode.innerText.trim(),
          hide: false
        })
      }

      const endTimeText = $x('//*[contains(@class, "itemDetail__list")][.//*[contains(text(), "Closing Time")]]',doc)
                          ?.$('.itemDetail__listValue')
                          ?.textContent
      if (endTimeText) {
        item.endTime = new Date(endTimeText + ' GMT+0900').valueOf()
      }

      // can I bid?
      (bidBtn && !bidBtn.classList.contains('disable')) ||
      (snipeBtn && !snipeBtn.classList.contains('disable'))
        ? delete item.blocked
        : (item.blocked = (msg?.textContent.includes('manually reviewing')) ? 'P' : true) // P = pending

      // can I request a review?
      msg?.$('a')?.href?.includes('inquiry') ? (item.review = true) : delete item.review

      // get number of watchers
      item.watchNum = Number(
        Array.from(doc.$$('script'))
             .map(s => s.textContent.match(/buyee\.TOTAL_WATCH_COUNT\s*=\s*(\d+);/))
             .find(Boolean)?.[1]
        || doc.$('.watchButton__watchNum')?.textContent
        || 0)
      // get image links
      item.images = Array.from(doc.$$('.js-smartPhoto')).map(node => node.href)
      BFState.items.set(id, item)
      callback?.(id, doc)
    }

    return BFQueue(process)
  }

  /*** watchlist API ***/
  const BFWatchlist = (() => {
    let watchlist = []

    const apiCall = (url, body = '') =>
      fetch(`https://buyee.jp/api/v1/${url}`, {
        credentials: 'include',
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        method: 'POST',
        body
      }).then(r => r.json())

    const has = id => watchlist.includes(id)

    const refresh = () => apiCall('watch_list/find')
      .then(data => (watchlist = data?.data?.list ?? []))

    const add = id => apiCall('watch_list/add', `auctionId=${id}&buttonType=search&isSignupRedirect=false`)
      .then(() => watchlist.push(id))

    const remove = id => apiCall('watch_list/remove', `auctionId=${id}`)
      .then(() => watchlist.splice(watchlist.indexOf(id), 1))

    const toggle = id => has(id) ? remove(id) : add(id)

    const updateBtn = btn => {
      const id = btn?.dataset?.id
      if (!id) return

      const active = has(id)
      btn.classList.toggle('is-active', active)
      btn.firstElementChild.classList.toggle('g-feather-star-active', active)
      btn.firstElementChild.classList.toggle('g-feather-star', !active)
    }

    return { refresh, add, remove, toggle, has, updateBtn }

  })()

  /*** translation helper ***/
  const BFTrans = (() => {
    const toTrans = []
    const textarea = el('textarea')
    let lock = false
    let pending = false

    function add(node) {
      toTrans.push(node)
    }

    function run() {
      if (!toTrans.length) { pending = false; return }
      if (lock) { pending = true; return }

      lock = true
      pending = false
      const nodes = [...toTrans]
      toTrans.length = 0

      fetch('https://translate-pa.googleapis.com/v1/translateHtml', {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json+protobuf',
          'X-Goog-API-Key': 'AIzaSyATBXajvzQLTDHEQbcpq0Ihe0vWDHmO520'
        },
        body: JSON.stringify(
          [[nodes.map(t=>t.textContent),"ja","en"],"wt_lib"]
        )
      })
      .then(r => {return r.ok ? r.json() : Promise.reject(`HTTP ${r.status}`)})
      .then(r => r[0]?.forEach((t,i) => {
        const node = nodes[i]
        if (t) {
          textarea.innerHTML = t
          node.textContent = textarea.value
        } else toTrans.push(node)
      }))
      .catch(e => { console.error(e); toTrans.push(...nodes) } )
      .finally(() => {
        lock = false
        if (pending) run()
      })
    }

    return { add, run }
  })()

  /*** card factory ***/
  function BFCard(node, url, scraped, id, data = {}) {
    return {
      node, url, scraped, id,
      annotated: false,
      onPage: false,
      hidden: false,
      translated: false,
      infoList: node.$('.itemCard__infoList'),
      statusList: node.$('ul.auctionSearchResult__statusList'),
      titleNode: node.$('.itemCard__itemName a'),

      ...data,

      $: node.$.bind(node),
      $$: node.$$.bind(node),

      setVisibility: function() {
        // hiding status
        const item = BFState.items.get(this.id)
        const seller = BFState.sellers.get(this.sellerid)
        if (!item || !seller) return
        this.hidden = item.hide || seller.hide

        // animation
        const wrap = fn => this.onPage ? wait().then(fn) : fn()
        const wrapWait = fn => this.onPage ? wait(BFConfig.ANIM_DELAY).then(fn) : fn()
        wrap(() => {
          if (this.hidden && BFState.hide) {
            this.node.classList.remove('bf-dimmed')
            this.node.classList.add('bf-hide')
            wrapWait(() => Dom.hide(this.node))
          } else {
            Dom.show(this.node)
            wait().then(() => wait()).then(() => {
              this.node.classList.remove('bf-hide')
              this.node.classList.toggle('bf-dimmed', this.hidden)
            })
          }
        })

        // countdowns
        if (this.timeLeft) {
          BFCountdown.remove(this.timeLeft)
          if (!this.hidden || !BFState.hide) BFCountdown.add(item.endTime, this.timeLeft)
        }

        // item toggle
        if (this.itemToggle) {
          seller.hide ? Dom.hide(this.itemToggle) : Dom.show(this.itemToggle)
        }
      }
    }
  }

  /*** card annotation ***/
  const BFAnnotate = (() => {
    let scraper, toggleSeller, toggleItem

    function init(params) {
      ({scraper, toggleSeller, toggleItem} = params)
    }

    // DOM helpers
    const infoNode = (text, ...children) => el('li.itemCard__infoItem', {}, el('span.g-title', { text }), el('span.g-text', {}, ...children))
    const button = (text, args) => el('button.bf-button', { type: 'button', text, ...args })

    function makeToggle(hide, txt, callback) {
      let timeoutId, confirming = false, hiding = hide
      const label = () => [hiding ? 'Show' : 'Hide', txt].join(' ')
      const btn = button(label(), {
        onclick: () => {
          if (!confirming && !hiding) {
            confirming = true
            const old = btn.textContent
            btn.textContent = 'Really?'
            timeoutId = setTimeout(() => { btn.textContent = old; confirming = false }, BFConfig.HIDE_TIMEOUT)
            return
          }
          confirming = false
          if (timeoutId) { clearTimeout(timeoutId); timeoutId = undefined }
          callback?.(!hiding)
        }
      })
      btn.toggle = h => { hiding = h; btn.textContent = label() }
      return btn
    }

    // annotation helpers
    function attachBlockNodes(card) {
      const id = card.id
      const item = BFState.items.get(id)

      card.unblockBtn?.remove()
      card.blockedNode?.remove()
      delete card.unblockBtn
      delete card.blockedNode

      if (item.review) {
        card.unblockBtn = button('Unblock', {
          style: { color: 'red', backgroundColor: 'pink', border: 'solid 1px red' },
          onclick: () => {
            window.open(`https://buyee.jp/item/jdirectitems/auction/inquiry/${id}`, '_blank')
            delete item.review
            BFState.items.set(id, item)
            wait(BFConfig.UNBLOCK_DELAY).then(scraper.add({ url: card.url, id }, true))
          }
        })
        card.statusList.append(card.unblockBtn)
      } else if (item.blocked) {
        card.blockedNode = el('li.bf-node.auctionSearchResult__statusItem', {
          text: item.blocked === 'P' ? 'Pending' : 'Blocked',
          style: { color: 'red', backgroundColor: 'pink' }
        })
        card.statusList.append(card.blockedNode)
      }
    }

    function attachSmartphoto(card) {
      const item = BFState.items.get(card.id)

      if (item.images?.length) {
        const thumb = card.$('.g-thumbnail__outer')
        const thumbImg = thumb.$('a')
        thumbImg.href = item.images[0]
        thumbImg.dataset.id = card.id

        const hidden = el('div', { style: 'display:none' })
        thumb.append(hidden)

        item.images.slice(1).forEach(img => {
          const link = el('a', { href: img, data: { group: card.id }})
          hidden.append(link)
        })
        BFPhoto.add(thumb)
      }
    }

    function trimWhitespace(node) {
      while (node.firstChild) {
        const child = node.firstChild;
        if ((child.nodeType === Node.TEXT_NODE && !child.textContent.trim())
        || (child.nodeType === Node.ELEMENT_NODE && child.tagName === 'BR')) {
          child.remove()
        } else break
      }
      if (node.firstChild) trimWhitespace(node.firstChild)
    }

    function attachDetails(card) {
      const closeModal = el => {
        el.remove()
        document.body.style.overflow = ''
        if (el._escHandler) {
          document.removeEventListener('keydown', el._escHandler)
          delete el._escHandler
        }
      }

      const modal = doc => {
        const inner = el('.bf-inner', { style: { padding: '8px' }})
        const padding = el('.bf-padding', {}, inner)
        const div = el('.bf-modal', {}, padding)
        const details = doc.$('#item-description, .g-description__main .inner')

        trimWhitespace(details)
        const title = el('h1', { text: card.titleNode.textContent, style: 'text-align: center; margin-bottom: 10px; font-size:1em; text-wrap: balance;' })
        details.insertBefore(title, details.firstChild)

        inner.innerHTML = details.innerHTML
        document.body.append(div)
        document.body.style.overflow = 'hidden'

        const walker = document.createTreeWalker(inner, NodeFilter.SHOW_TEXT,
          { acceptNode: node => node.textContent.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT }
        )
        let node
        while ((node = walker.nextNode())) BFTrans.add(node)
        BFTrans.run()

        div.addEventListener('pointerdown', e => (e.target === padding || e.target === div) && closeModal(div))
        div._escHandler = e => (e.key === 'Escape') && closeModal(div)
        document.addEventListener('keydown', div._escHandler)
      }

      card.detailsBtn = button(' • • • ', {
        onclick: () => {
          fetchURL(`${card.url}/detail`)
          .then(doc => modal(doc))
        }});

      (BFState.isDesktop ? card.statusList : card.infoToggles).append(card.detailsBtn)
    }

    function refresh(card) {
      const item = BFState.items.get(card.id)
      if (!card.annotated || !item) return

      const watchButton = card.$('div.watchButton')
      watchButton && BFWatchlist.updateBtn(watchButton)

      BFCountdown.remove(card.timeLeft)
      BFCountdown.add(item.endTime, card.timeLeft)

      card.watcherCount.textContent = item.watchNum
      attachBlockNodes(card)
      card.setVisibility()
    }

    function decorate(card) {
      if (card.annotated) return refresh(card)

      const item = BFState.items.get(card.id)
      card.sellerid = item?.seller
      const seller = card.sellerid && BFState.sellers.get(card.sellerid)
      item && BFState.items.assign(card.id, { lastSeen: Date.now() })
      seller && BFState.sellers.assign(card.sellerid, { lastSeen: Date.now() })
      if (!item || !seller) return

      // seller
      card.infoList.append(infoNode('Seller', el('a', { text: seller.name, href: `https://buyee.jp/item/search/customer/${card.sellerid}`, target: '_blank', rel: 'noopener noreferrer'})))

      //  countdown
      card.timeLeft = infoNode('Time Left')
      card.infoList.firstElementChild.replaceWith(card.timeLeft)
      BFCountdown.add(item.endTime, card.timeLeft)

      // watchers
      card.watcherCount = el('span.watchList__watchNum.bf-node', { text: item.watchNum })
      card.$('.g-feather')?.parentNode.append(card.watcherCount)

      // images
      if (item.images?.length) attachSmartphoto(card)
      const thumb = card.$('.g-thumbnail__outer a img')
      thumb && seller.filters && (thumb.style.filter = BFFilters.style(seller.filters))

      // show/hide buttons
      card.sellerToggle = makeToggle(seller.hide, 'seller', hidden => toggleSeller(card.sellerid, hidden))
      if (!BFState.isDesktop) {
        card.infoToggles = el('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row' } })
        card.infoToggles.append(card.sellerToggle)
        card.infoList.append(card.infoToggles)
      } else {
        card.infoList.append(card.sellerToggle)
      }

      card.itemToggle = makeToggle(item.hide, '', hidden => toggleItem(card.id, hidden))
      card.statusList.append(card.itemToggle)

      // details
      attachDetails(card)

      // move watcher star on mobile
      if (!BFState.isDesktop) {
        const watcherStar = card.$('.watchButton')
        watcherStar.style.marginBottom = '-6px'
        card.infoToggles.append(watcherStar)
      }

      // make link open in new tab
      card.titleNode && Object.assign(card.titleNode, { target: '_blank', rel: 'noopener noreferrer' })

      // block/unblock
      attachBlockNodes(card)

      card.setVisibility()
      card.annotated = true
    }

    return { init, decorate }
  })()

  /*** card handling ***/
  const BFCards = (() => {
    // cards metadata
    const cards = new Map()
    let cardsReady = 0

    // lazy loader observer
    const observer = new IntersectionObserver((entries, obs) => {
      for (const { isIntersecting, target } of entries) {
        if (!isIntersecting) continue
        target.src = target.dataset.src
        delete target.dataset.src
        target.style.background = ''
        obs.unobserve(target)
      }
    })

    // card scraper
    const scraper = BFScraper(id => cards.has(id) && BFAnnotate.decorate(cards.get(id)))

    function toggleSeller(sellerid, hide) {
      BFState.sellers.assign(sellerid, { hide })
      Array.from(cards.values())
      .filter(c => c.sellerid === sellerid)
      .forEach(card => {
        card.sellerToggle.toggle(hide)
        if (!hide && !card.translated) {
          card.translated = true
          BFTrans.add(card.titleNode)
        }
        card.setVisibility()
      })
      BFTrans.run()
    }

    function toggleItem(id, hide) {
      BFState.items.assign(id, { hide })
      const card = cards.get(id)
      card?.itemToggle.toggle(hide)
      card?.setVisibility()
    }

    function toggleHidden(hide) {
      BFState.hide = hide
      cards.forEach(card => card.setVisibility())
    }

    function addFrom(src) {
      src.$$('li.itemCard:not(.bf-loading):not(.bf-historical)').forEach(node => {
        const url = node.$('.itemCard__itemName a').href.match(/([^?&]*)/)?.[1] || ''
        const id = node.dataset.id = url.match(/\/item\/jdirectitems\/auction\/([^?&]*)/)?.[1] || ''
        if (cards.has(id)) return

        node.remove()

        const scraped = BFState.items.has(id)
        const card = BFCard(node, url, scraped, id)
        cards.set(id, card)

        // set up card
        node.$('.g-thumbnail__outer a')?.setAttribute('href', '#')
        node.$$('li.itemCard__infoItem').forEach(n => n.textContent.trim() === '' ? n.remove() : BFState.isDesktop && (n.style.width = '20%'))
        BFState.isDesktop && (card.infoList.style.alignItems = 'center')

        // watchlist status
        const watchButton = node.$('div.watchButton')
        if (watchButton) {
          watchButton.dataset.id = id
          BFWatchlist.updateBtn(watchButton)
        }

        if (!scraped) {
          scraper.add({id, url});
          cardsReady++
          return
        }

        BFAnnotate.decorate(card)

        if (!card.hidden) cardsReady++

        const item = BFState.items.get(id)
        if (!card.hidden && (BFWatchlist.has(id) || (item.endTime < Date.now()) || item.blocked)) scraper.add({id, url})
      })
    }

    const { updateDom, nextBatch } = (() => {
      let pending = 0

      function nextBatch() {
        pending = BFConfig.BATCH_SIZE
      }

      function updateDom (addNode) {
        const batch = el('.bf-batch')
        const imgs = []
        const added = []
        let anyVisible = false

        for (const [id,card] of cards) {
          if (pending == 0) break
          if (card.onPage) continue

          card.onPage = true
          added.push(card.node)
          batch.append(card.node)

          const img = card.$('img.lazyLoadV2')
          if (img) {
            img.dataset.id = id
            img.dataset.src ??= img.src
            img.style.background = 'url(https://cdn.buyee.jp/images/common/loading-spinner.gif) no-repeat 50%;'
            img.src = 'https://cdn.buyee.jp/images/common/spacer.gif'
            imgs.push(img)
          }

          if (card.hidden) continue

          anyVisible = true
          pending--
          cardsReady--
          if (!card.translated) {
            BFTrans.add(card.titleNode)
            card.translated = true
          }
        }

        const wrap = anyVisible ? fn => {
          batch.classList.add('animate')
          fn()
          Dom.reflow(batch)
          batch.classList.remove('animate')
        } : fn => fn()

        wrap(() => {
          addNode(batch)
          Dom.reflow(batch)
          added.forEach(node => node.classList.add('bf-item'))
        })

        imgs.forEach(img => observer.observe(img))
        BFTrans.run()
        return cardsReady
      }

      return { updateDom, nextBatch }
    })()

    function rescrape (id, doc) {
      if (doc) return scraper.add({id}, doc)

      const card = cards.get(id)
      card && scraper.add({id, url: card.url}, true) // force rescrape
    }

    BFPhoto.setCallback(sellerid =>
      Array.from(cards.values())
        .filter(card => card.sellerid === sellerid)
        .map(card => card.$('.g-thumbnail__outer img'))
        .filter(Boolean)
    )

    BFAnnotate.init({scraper, toggleItem, toggleSeller})

    return { addFrom, updateDom, toggleHidden, rescrape, nextBatch }
  })()

  /*** page loader ***/
  const BFPages = (() => {
    const queue = []
    const pages = []
    let naviOnScreen = false
    let cardsReady = 0
    let cardHeight

    const container = $('.g-main:not(.g-modal)')
    const resultsNode = container.firstElementChild
    const loadingNode = el('li.itemCard.bf-loading', {},
                           el('.imgLoading', { style: 'height: 50px' }),
                           el('.g-title', { text: 'Loading page 1', style: 'text-align: center; height: 50px' })
                          )
    const sentinel = $(BFState.isDesktop ? 'div.page_navi' : 'ul.pagination')

    let maxThreads = 3
    let nextToProcess = 2
    let activeCount = 0
    let lastPage

    const callback = (page, doc) => {
      pages[page] = doc
      if (page !== nextToProcess) return
      while (nextToProcess in pages) {
        BFCards.addFrom(pages[nextToProcess])
        delete pages[nextToProcess]
        nextToProcess++
      }
      cardsReady = BFCards.updateDom(batch => resultsNode.insertBefore(batch, loadingNode))
      updateThreads()
      if (cardsReady > 0 && naviOnScreen) addNext()

      if (nextToProcess > lastPage) {
        Dom.hide(loadingNode)
      } else {
        loadingNode.$('.g-title').innerText = `Loading page ${nextToProcess}`
      }
    }

    function updateThreads() {
      maxThreads = cardsReady > (BFConfig.BATCH_SIZE * 1.5) ? 0
                 : cardsReady > (BFConfig.BATCH_SIZE) ? 1
                 : 2
      run()
    }

    function run() {
      while (activeCount < maxThreads && queue.length) startNext()
    }

    function startNext() {
      const { page, url } = queue.shift()
      activeCount++

      fetchURL(url)
      .then(doc => callback(page, doc))
      .catch(err => console.error('fetchURL failed for', url, err))
      .finally(() => {
        activeCount--
        run()
      })
    }

    function addNext() {
      BFCards.nextBatch()
      wait(150).then(() => {
        cardsReady = BFCards.updateDom(batch => resultsNode.insertBefore(batch, loadingNode))
        updateThreads()
      })
    }

    function init() {
      let currentURL = new URL(document.location)
      let currentPage = Number(currentURL.searchParams.get('page') || 1)
      nextToProcess = currentPage + 1
      const results = Number($('.result-num').innerText.match(/.*\/\s*([0-9]*)\s*hits/)[1] ?? '')
      lastPage = Math.ceil(results/100)

      for (let page = nextToProcess; page <= lastPage; page++) {
        currentURL.searchParams.set('page', page)
        queue.push({page, url: currentURL.toString()})
      }

      const observer = new IntersectionObserver(entries => {
        entries.forEach(e => (naviOnScreen = e.isIntersecting))
        if (naviOnScreen && cardsReady > 0) addNext()
      }, { rootMargin: "0px 0px 0px 0px" })

      observer.observe(sentinel)

      document.on('scroll', updateThreads, { passive: true })
      updateThreads()

      resultsNode.append(loadingNode)
      if (nextToProcess > lastPage) Dom.hide(loadingNode)

      pages[1] = el('div')
      let totalHeight = 0

      document.$$('li.itemCard:not(.bf-loading)').forEach(node => {
        pages[1].append(node.cloneNode(true))
        totalHeight += node.offsetHeight
        node.remove()
      })

      cardHeight = totalHeight / pages[1].children.length

      BFCards.addFrom(pages[1])
      delete pages[1]

      $('#bf-hide-initial')?.remove()
      BFCards.nextBatch()

      cardsReady = BFCards.updateDom(batch => resultsNode.insertBefore(batch, loadingNode))
      updateThreads()
    }

    return { init }
  })()

  /*** historical card scraper ***/
  const BFHistoryScraper = callback => {
    function process(id, doc) {
      const item = BFState.history.get(id)

      const endTimeText = $x('//*[contains(@class, "itemDetail__list")][.//*[contains(text(), "Closing Time")]]',doc)
                          ?.$('.itemDetail__listValue')
                          ?.textContent

      if (endTimeText) {
        item.endTime = new Date(endTimeText + ' GMT+0900').valueOf()
      }

      if (item.endTime && item.endTime > Date.now()) {
        BFState.history.delete(id)
        BFCards.rescrape(id, doc)
        callback?.(id)
        return
      }

      delete item.unannotated

      const biddingIcon = doc.$('.itemInformation__infoItem .g-feather-bidding')
      const numBids = biddingIcon?.parentNode?.textContent.trim()
      if (numBids) item.numBids = +numBids

      if (!item.numBids) {
        item.hide = true
        BFState.history.set(id, item)
        callback?.(id)
        return
      }

      const title = (BFState.isDesktop ? doc.$('.itemInformation__itemName') : doc.$('.itemInformation .heading')).textContent.trim()
      title && (item.title = title)

      let priceTxt = doc.$('.price:not(.price--attention), .price-tax:not(.price-tax--attention)')?.textContent?.trim()
      priceTxt ??= doc.$('.price--attention, .price-tax--attention')?.textContent?.trim()

      const [,price] = priceTxt?.match(/([0-9,]* YEN)/) || []
      price && (item.price = price)

      BFState.history.set(id, item)
      callback?.(id, item)
    }

    return BFQueue(process)
  }

  /*** historical sales ***/
  const BFHistory = (() => {
    let cards, sellerFilter, fromDate, toDate, sellerPicker
    const batch = el('.bf-batch')
    const scraper = BFHistoryScraper((id, item) => {
      const oldCard = $(`.bf-historical .itemCard__item[data-id=\"${id}\"]`)?.parentNode
      if (!item) {
        cards.delete(id)
        oldCard && oldCard.remove()
      } else {
        const card = makeCard(id, item)
        Object.assign(cards.get(id), { card })
        oldCard && oldCard.replaceWith(card)
        BFTrans.run()
      }
    })

    function init() {
      const now = new Date().getTime()

      BFState.items.forEach((item,id) => {
        const seller = BFState.sellers.get(item.seller)
        const hidden = item.hide || seller?.hide
        const finished = item.endTime && (item.endTime < now)
        if (finished && !hidden && !(BFState.history.has(id))) {
          BFState.history.set(id, {
            unannotated: true,
            seller: item.seller,
            sellerName: seller?.name,
            endTime: item.endTime,
            image: item.images[0]
          })
        }
        if (!finished && BFState.history.has(id)) {
          BFState.history.delete(id)
        }
      })

      const cardlist = []
      BFState.history.forEach((item, id) => {
        if (item.hide) return
        cardlist.push([id, { endTime: item.endTime, seller: item.seller, sellerName: item.sellerName, card: makeCard(id, item)}])
        if (item.unannotated) {
          scraper.add( { id, url: `https://buyee.jp/item/jdirectitems/auction/${id}` })
        }
      })
      cardlist.sort((a,b) => b[1].endTime - a[1].endTime)
      cards = new Map(cardlist)
      BFTrans.run()

      $('div.g-main ul.auctionSearchResult').prepend(el('div.itemCard.bf-historical',
        { style: 'display: flex; justify-content: center' },
        el('button.bf-button', {
          type: 'button',
          text: `Show historical sales`,
          onclick: openModal
        }))
      )
    }

    function makeCard(id, item) {
      const formatter = new Intl.DateTimeFormat("en-GB", {
        dateStyle: 'short',
        timeZone: '+0900',
      })

      const infoItem = (t,s, ...r) => el('li.itemCard__infoItem', {}, el('span.g-title', { text: t }), el('span.g-text', { text: s }, ...r))

      const titleNode = el('a', {
        href: `/item/jdirectitems/auction/${id}`,
        target: '_blank',
        rel: 'noopener noreferrer',
        text: item.title ?? 'Scraping...'
      })

      const thumbnail = el('div.g-thumbnail__outer div.g-thumbnail img.g-thumbnail__image', { src: `${item.image}?w=300&h=300` })

      const priceNode = el('div.g-priceDetails ul.g-priceDetails__list li.g-priceDetails__item', {},
                           el('span.g-title', { text: 'Sale price'}),
                           el('div.g-price__outer span.g-price', { text: item.price ?? '' })
                          )

      const infoNode = el('div.itemCard__itemDetails ul.itemCard__infoList', {},
                          infoItem('End Date', item.endTime ? formatter.format(new Date(item.endTime)) : ''),
                          infoItem('Number Of Bids', item.numBids ? `${item.numBids}` : ''),
                          infoItem('Seller', '', el('a', {
                            href: '#',
                            text: item.sellerName ?? '',
                            onclick: e => {
                              e.preventDefault()
                              if (sellerPicker) {
                                sellerPicker.tomselect.addItem(item.seller)
                              }
                            }
                          }))
                         )

      const card =
        el('div.itemCard.bf-historical.auctionSearchResult div.itemCard__item', { style: 'padding: 10px 0px', data: {id} },
          thumbnail,
          el('div.itemCard__itemInfo', {},
            el('div.itemCard__itemName', {}, titleNode),
            priceNode,
            infoNode
          )
        )

      BFTrans.add(titleNode)
      return card
    }

    function setBatch(batch) {
      batch.innerHTML = ''
      cards.forEach(({endTime, seller, sellerName, card}, id) => {
        if (fromDate && endTime < fromDate) return
        if (toDate && endTime > toDate) return
        if (sellerFilter && sellerFilter.length && !(sellerFilter.includes(seller))) return
        batch.append(card)
      })
    }

    function sellerList(from, to) {
      const sellerData =
      [...cards.values()].reduce((acc,{endTime, seller, sellerName}) => {
        if (from && endTime < from) return acc
        if (to && endTime > to) return acc
        acc[seller] ??= { count: 0, name: sellerName }
        acc[seller].count++
        return acc
      }, {})

      return Object.entries(sellerData).sort(([,a], [,b]) =>
        a.count < b.count || (a.count === b.count && a.name.localeCompare(b.name))
      )
    }

    function openModal() {
      setBatch(batch)

      sellerPicker = el('select', {
        multiple: '',
        autocomplete: 'off',
        placeholder: 'Choose sellers',
        size: 6,
        style: { width: '100%' },
        onchange: () => {
          sellerFilter = [...sellerPicker.selectedOptions].map(o => o.value)
          setBatch(batch)
        }
      }, sellerList().map(([seller,data]) => el('option', { text: data.name, value: seller })))

      const resetSellerPicker = () => {
        sellerPicker.tomselect.clearOptions()
        sellerPicker.tomselect.addOptions(
          sellerList(fromDate, toDate)
          .map(([seller,data]) => new Option(data.name, seller, sellerFilter?.includes(seller), sellerFilter?.includes(seller)))
        )
        sellerFilter = [...sellerPicker.selectedOptions].map(o => o.value)
        setBatch(batch)
      }

      const datePicker = el('input', {
        type: 'text',
        placeholder: 'Choose dates',
        container: document.body,
        style: {
          borderRadius: '3px',
          padding: '8px',
          width: '100%',
          fontSize: '13px',
          color: '#252525',
          boxSizing: 'border-box',
          marginBottom: '5px'
        }
      })

      const searchBar = el('div', { style: {
                          position: 'sticky',
                          top: 0,
                          zIndex: 1,
                          background: 'white',
                          padding: '10px 0px',
                          borderBottom: '1px solid #aaa'
                        }},
                        datePicker,
                        sellerPicker
                      )

      const padding = el('.bf-padding', {}, el('.bf-inner', {}, searchBar, batch))
      const div = el('.bf-modal', {}, padding)

      document.body.append(div)
      document.body.style.overflow = 'hidden'

      new AirDatepicker(datePicker, { // eslint-disable-line no-undef
        autoClose: true,
        isMobile: !BFState.isDesktop,
        container: BFState.isDesktop ? div : '',
        range: true,
        buttons: 'clear',
        dateFormat: 'd MMM yyyy',
        multipleDatesSeparator: ' to ',
        locale: {
          days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          daysShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
          daysMin: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
          months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
          monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          today: 'Today',
          clear: 'Clear'
        },
        onHide: finished => {
          if (!finished) return
          let [oneText,fromText,toText] = datePicker.value.match(/(.*) to (.*)|.*/) || []
          if (toText) {
            fromDate = new Date(`${fromText} 00:00 GMT+09:00`)
            toDate = new Date(`${toText} 24:00 GMT+09:00`)
          } else if (oneText) {
            fromDate = new Date(`${oneText} 00:00 GMT+09:00`)
            toDate = new Date(`${oneText} 24:00 GMT+09:00`)
          } else {
            fromDate = toDate = undefined
          }
          resetSellerPicker()
        }
      })

      const pickerControl = new window.TomSelect(sellerPicker, {
        plugins: ['clear_button', 'remove_button']
      })

      const pickerCloseOnClick = e => {
        if (!pickerControl.wrapper.contains(e.target)) {
          e.stopImmediatePropagation()
          e.preventDefault()
          pickerControl.close()
        }
      }

      pickerControl.on('dropdown_open', () => div.on('pointerdown', pickerCloseOnClick, true))
      pickerControl.on('dropdown_close', () => div.removeEventListener('pointerdown', pickerCloseOnClick, true))

      div.on('pointerdown', e => (e.target === padding || e.target === div) && closeModal(div))
      div._escHandler = e => (e.key === 'Escape') && closeModal(div)
      document.addEventListener('keydown', div._escHandler)
    }

    function closeModal (el) {
      el.remove()
      document.body.style.overflow = ''
      if (el._escHandler) {
        document.removeEventListener('keydown', el._escHandler)
        delete el._escHandler
      }
      sellerPicker = undefined
    }

    return { init }
  })()

  /*** main module ***/
  const BF = (() => {

    function main() {

      const setupPage = () => {
        $$('#google_translate_element, .skiptranslate').forEach(el => el.remove())

        new MutationObserver(muts => {
          for (const m of muts) {
            m.addedNodes.forEach(node => {
              if (node.nodeType === 1 && node.querySelector?.('.skiptranslate')) node.remove()
              if (node.id === 'google_translate_element') node.remove()
            })
          }
        }).observe(document.documentElement, { childList: true, subtree: true })

        const style = [...BFConfig.STYLES, ...(BFConfig.isDesktop ? BFConfig.DESKTOP_STYLES : BFConfig.MOBILE_STYLES)].join('\n')
        document.head.append(el('style', { text: style }))
      }

      const handleShowHideLink = () => {
        const showHideParent = BFState.isDesktop ? $('.result-num').parentNode : $('.result-num')

        showHideParent.append(
          el('div', { style: BFState.isDesktop ? 'left:20%' : 'display:inline' },
            el('button#rg-show-hide-link', {
              type: 'button',
              text: (BFState.hide ? 'Show' : 'Hide') + ' hidden',
              onclick: function () {
                BFCards.toggleHidden(!BFState.hide)
                this.innerText = (BFState.hide ? 'Show' : 'Hide') + ' hidden'
              },
              style: 'display:inline-block; width:110px'
            })
          )
        )
      }

      const handleWatchBtns = () => {
        document.on('pointerdown', 'div.watchButton', (e, btn) => {
          e.preventDefault()
          e.stopImmediatePropagation()

          const id = btn.dataset.id

          BFWatchlist.toggle(id).then(() => {
            BFWatchlist.updateBtn(btn)
            BFWatchlist.has(id) && BFCards.rescrape(id)
          })
        })
      }

      setupPage()
      BFState.initialise()
      .then(BFWatchlist.refresh)
      .then(() => {
        handleShowHideLink()
        handleWatchBtns()
        BFHistory.init()
        BFPages.init()
      })
    }
    waitFor('.g-main:not(.g-modal)').then(main)
  })()
})()