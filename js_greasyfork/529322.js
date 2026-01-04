// ==UserScript==
// @name        FA Mobile Enhancer
// @namespace   Userscripts
// @match       https://www.furaffinity.net/*
// @grant       GM.addStyle
// @version     0.0.1
// @author      LinHQ1999
// @license     AGPLv3
// @description Keep Navigation buttons at the top.Add infinite scrolling to Browse, Search and Gallery.
// @downloadURL https://update.greasyfork.org/scripts/529322/FA%20Mobile%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/529322/FA%20Mobile%20Enhancer.meta.js
// ==/UserScript==

(async function () {
  const S = {
    gallery: 'section.gallery',
    blocked: 'blocked-content',
    searchForm: 'search-form'
  }
  const C = [
    {
      key: 'browse',
      navigatorStr: 'body div.navigation',
      navigator: document.querySelector('body div.navigation'),
      boundry: document.querySelectorAll('body div.navigation')[1],
      update(doc) {
        const newNav = doc.querySelector(this.navigatorStr)
        this.navigator.replaceWith(newNav)
        this.navigator = newNav
      },
      next() {
        const next = this.navigator.querySelectorAll('form')[1]
        return fetch(next.action, {
          method: 'POST',
          body: new FormData(next)
        })
      }
    },
    {
      key: 'search',
      navigator: document.querySelector('.pagination'),
      navigatorStr: '.pagination',
      boundry: document.querySelectorAll('.pagination')[1],
      next() {
        const form = document.getElementById(S.searchForm)
        console.log(form)
        const data = new FormData(form)
        data.set('next_page', 'Next')
        return fetch(form.action, {
          method: 'POST',
          body: data
        })
      },
      update(doc) {
        const newNav = doc.querySelector(this.navigatorStr)
        this.navigator.replaceWith(newNav)
        this.navigator = newNav

        const newPage = doc.getElementById("page")
        document.querySelector('#page').replaceWith(newPage)
      }
    }, {
      key: 'gallery',
      navigator: document.querySelector('.gallery-navigation'),
      navigatorStr:'.gallery-navigation',
      boundry: document.querySelectorAll('.gallery-navigation')[1],
      next() {
        const nextBtns = this.navigator.querySelectorAll('form')
        const next = nextBtns[nextBtns.length - 1]
        return fetch(next.action, {
          method: 'POST',
          body: new FormData(next)
        })
      },
      update(doc) {
        const newNav = doc.querySelector(this.navigatorStr)
        this.navigator.replaceWith(newNav)
        this.navigator = newNav
      }
    }
  ]
  const cfg = C.find(c => window.location.pathname.includes(c.key))
  if (!cfg) return

  GM.addStyle(`
    .news-block, .main-window>*:not(.site-content) {
      display: none;
    }
    body {
      height: 100vh;
      overflow: auto;
    }
    #pageid-browse .navigation:nth-child(1), .pagination, .gallery-navigation {
      position: sticky;
      top: 0;
      -webkit-backdrop-filter: blur(4px);
      backdrop-filter: blur(4px);
      z-index: 9;
    }
    `)

  const parser = new DOMParser()

  let loading = false
  const ob = new IntersectionObserver(([entry]) => {
    const { y, height } = entry.boundingClientRect
    const total = entry.rootBounds.height
    if (entry.isIntersecting && (y + height) >= total && !loading) {
      loading = true
      cfg.next()
        .then(async (resp) => {
          const docStr = await resp.text()
          const doc = parser.parseFromString(docStr, 'text/html')
          cfg?.update(doc)

          const gallery = doc.querySelector(S.gallery)
          gallery.querySelectorAll('img')
            .forEach(img => img.classList.remove(S.blocked))
          document.querySelector(S.gallery)?.append(...gallery.childNodes)
        })
        .catch(err => {
          alert(err)
          console.error(err)
        })
        .finally(() => loading = false)
    }
  }, {
    root: document.body,
    threshold: 0.5
  })

  ob.observe(cfg.boundry)
})()
