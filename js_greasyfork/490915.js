// ==UserScript==
// @name        CoinpayU Orange Color
// @namespace   Violentmonkey Scripts
// @match       https://www.coinpayu.com/*
// @grant       none
// @version     1.2
// @author      Arsalan Abd Al Salam
// @license MIT
// @description Orange Color and more relaxing color for the eye , make the website whitemode then refresh the page so it can work
// @downloadURL https://update.greasyfork.org/scripts/490915/CoinpayU%20Orange%20Color.user.js
// @updateURL https://update.greasyfork.org/scripts/490915/CoinpayU%20Orange%20Color.meta.js
// ==/UserScript==
let light = false

const observerConfig = { subtree: true, childList: true, attributes: true, attributeFilter: ['style', 'class'] }

const isLight = elem => {
  let { groups: { r, g, b, a } } = /rgba?\((?<r>\d+),\s*(?<g>\d+),\s*(?<b>\d+)(?:,\s*(?<a>\d+(?:\.\d+)?))?\)/.exec(getComputedStyle(elem, null).getPropertyValue('background-color') || 'rgba(0, 0, 0, 0)')
  r = Number.parseInt(r)
  g = Number.parseInt(g)
  b = Number.parseInt(b)
  if (a) {
    a = Number.parseFloat(a)
    r = ((1 - a) * 255) + (a * r)
    g = ((1 - a) * 255) + (a * g)
    b = ((1 - a) * 255) + (a * b)
  }
  return Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b)) > 127.5
}

let invertedMap = []

const checkBgImage = (bg) => bg && bg.split(',').some(bg => bg.includes('url('))

const checkBgTag = new Set(['DIV', 'HEADER', 'FOOTER', 'NAV', 'SECTION', 'MAIN'])
const mustRevertTags = new Set(['IMG', 'IMAGE', 'CANVAS', 'VIDEO', 'IFRAME'])
const fixInvert = el => {
  const tag = el.tagName?.toUpperCase()
  if (tag == null || tag === 'BODY' || tag === 'SLOT' || !(el instanceof Element) || !el.isConnected) return
  if (mustRevertTags.has(tag) || (checkBgTag.has(tag) && !isLight(el)) || checkBgImage(el.style?.backgroundImage) || checkBgImage(getComputedStyle(el, null)['background-image'])) {
    invertedMap = invertedMap.filter(ref => !Object.is(el, ref.deref()))
    if (invertedMap.some(ref => ref.deref()?.contains?.(el))) {
      el.style.filter = null
    } else {
      invertedMap.push(new WeakRef(el))
      el.style.filter = light ? 'invert(1) contrast(1.15) saturate(1.05)' : null
    }
  }
}

const trackedShadowElems = new WeakSet()
let modified = new Set()
let chain = Promise.resolve()
const selector = [...checkBgTag, ...mustRevertTags].map(t => t.toLowerCase()).join(',')
const observer = new MutationObserver((records) => {
  if (modified.size === 0) {
    chain = chain.then(
      () => {
        const elems = modified
        modified = new Set()
        for (let elem of elems.values()) {
          fixInvert(elem)

          // TODO: Create function to handle shadowRoot
          // Something like this: https://github.com/medialize/ally.js/blob/master/src/query/shadow-hosts.js
          if (!elem.tagName?.includes('-') || !elem.shadowRoot || trackedShadowElems.has(elem)) continue
          trackedShadowElems.add(elem)
        }
      },
      () => console.error
    )
  }

  for (const {target, addedNodes} of records) {
    modified.add(target)
    for (const elem of addedNodes) modified.add(elem)
    for (const elem of target.querySelectorAll(selector)) modified.add(elem)
  }
});

function invertColor() {
  light = isLight(document.documentElement) && isLight(document.body)
  document.documentElement.style.filter = light ? 'invert(0.85)' : null
  if (light) {
    Array.from(document.querySelectorAll('body *')).forEach(fixInvert)
    observer.observe(document.body, observerConfig);
  } else {
    observer.disconnect()
    invertedMap.forEach(ref => {
      const style = ref.deref()?.style
      if (style) style.filter = null
    })
    invertedMap = []
  }
}

try {
  invertColor()
} catch {}

addEventListener("DOMContentLoaded", () => {
  invertColor()
});