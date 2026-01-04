// ==UserScript==
// @name            Feedly Faviconize List
// @namespace       jmln.tw
// @version         0.2.7
// @description     A user script to show feed favicons in Feedly Title-Only View.
// @author          Jimmy Lin
// @license         MIT
// @homepage        https://github.com/jmlntw/feedly-faviconize-list
// @supportURL      https://github.com/jmlntw/feedly-faviconize-list/issues
// @match           https://*.feedly.com/*
// @compatible      firefox
// @compatible      chrome
// @compatible      opera
// @run-at          document-end
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/31076/Feedly%20Faviconize%20List.user.js
// @updateURL https://update.greasyfork.org/scripts/31076/Feedly%20Faviconize%20List.meta.js
// ==/UserScript==

function addStyle (css) {
  const style = document.createElement('style')
  style.textContent = css
  document.head.appendChild(style)
  return style
}

addStyle(`
  .gm-favicon {
    width: 16px;
    height: 16px;
    margin: 0 6px 0 0;
    padding: 0;
    border-radius: 3px;
    vertical-align: top;
  }
`)

function awaitSelector (selector, root) {
  return new Promise((resolve, reject) => {
    try {
      const rootElement = root ?
        typeof root === 'string' ? document.querySelector(root) : root :
        document

      const findAndResolveElements = () => {
        const allElements = document.querySelectorAll(selector)
        const newElements = []
        const resolvedAttr = 'data-awaitselector-resolved'

        if (allElements.length > 0) {
          Array.prototype.slice.call(allElements)
            .filter(element => typeof element[resolvedAttr] === 'undefined')
            .forEach(element => {
              element[resolvedAttr] = true
              newElements.push(element)
            })

          if (newElements.length > 0) {
            observer.disconnect()
            resolve(newElements)
          }
        }
      }

      const observer = new MutationObserver(mutations => {
        const addedNodes = mutations.reduce((found, mutation) => {
          return found || mutation.addedNodes && mutation.addedNodes.length > 0
        })

        if (addedNodes) {
          findAndResolveElements()
        }
      })

      observer.observe(rootElement, {
        childList: true,
        subtree: true
      })

      findAndResolveElements()
    } catch (exception) {
      reject(exception)
    }
  })
}

function waitAwaitSelector (selector, root, callback) {
  (function awaiter () {
    const continueWatching = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : true

    if (continueWatching) {
      awaitSelector(selector, root).then(callback).then(awaiter)
    }
  }())
}

function createFavicon (url) {
  const domain = url.replace(/^https?:\/\/([^/:]+).*/i, '$1')
  const favicon = document.createElement('img')

  favicon.src = `https://www.google.com/s2/favicons?domain=${domain}&alt=feed`
  favicon.classList.add('gm-favicon')

  return favicon
}

awaitSelector('#feedlyPageFX', '#root').then(pages => {
  waitAwaitSelector('a.EntryMetadataSource[href]', pages[0], sources => {
    sources
      .filter(source => source.querySelector('.gm-favicon') === null)
      .forEach(source => {
        source.insertAdjacentElement('afterbegin', createFavicon(source.href))
      })
  })
})
