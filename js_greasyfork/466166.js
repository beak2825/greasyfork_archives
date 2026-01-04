// ==UserScript==
// @name         Sheikah Glyphs
// @homepageURL  https://github.com/ntnyq/sheikah-glyphs
// @supportURL   https://github.com/ntnyq/sheikah-glyphs
// @namespace    sheikah-glyphs
// @version      0.0.8
// @description  Replace all available chars to Sheikah Glyphs.
// @author       ntnyq
// @license      MIT
// @match        http*://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelda.com
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_registerMenuCommand
// @grant       GM_unregisterMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/466166/Sheikah%20Glyphs.user.js
// @updateURL https://update.greasyfork.org/scripts/466166/Sheikah%20Glyphs.meta.js
// ==/UserScript==

;(function () {
  'use strict'

  /**
   * Create UI for the options
   * @template T
   * @param {string} key
   * @param {string} title
   * @param {T} defaultValue
   * @returns {{ value: T }} return
   */
  function useOption(key, title, defaultValue) {
    if (typeof GM_getValue === 'undefined') {
      return {
        value: defaultValue,
      }
    }
    let value = GM_getValue(key, defaultValue)
    const ref = {
      get value() {
        return value
      },
      set value(v) {
        value = v
        GM_setValue(key, v)
        location.reload()
      },
    }
    GM_registerMenuCommand(`${title}: ${value ? '✅' : '❌'}`, () => {
      ref.value = !value
    })
    return ref
  }

  const doc = document
  const SELECTOR =
    'body *:not(script):not(style):not(noscript):not(pre):not(pre *):not(code):not(code *):not(input):not(textarea):not([contenteditable="true"]):not(.sheikah-glyph):not(.sheikah-glyphs-node)'
  // cSpell: disable-next-line
  const SHEIKAH_GLYPHS = '01234567890abcdefghijgklmnopqrstuvwxyz-!.?'
  const SHEIKAH_SYMBOL_MAP = new Map([
    ['-', 'hyphen'],
    ['!', 'exclam'],
    ['.', 'period'],
    ['?', 'question'],
  ])
  const SVG_SPRITE = `<svg style="display: none;" arial-hidden="true" width="1024" height="40960" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><symbol viewBox="0 0 1024 1024" id="sheikah-0"><path d="M452.5 452H572v119.5H452.5V452zm-299-179L273 153.5h299V273H273v597.5L153.5 751V273zM751 153.5 870.5 273v478L751 870.5H452.5V751H751V153.5z" /></symbol><symbol viewBox="0 0 1024 1024" id="sheikah-1"><path d="M153.5 153.5H273V273H153.5V153.5zM751 751H153.5L273 870.5h478L870.5 751V273L751 153.5V751zM452.5 153.5V452h-299v119.5h299L572 452V153.5H452.5z" /></symbol><symbol viewBox="0 0 1024 1024" id="sheikah-2"><path d="M273 153.5 153.5 273v179L273 571.5h478L870.5 452V273L751 153.5V452H273V153.5zM870.5 751 751 870.5H273L153.5 751h717zm-418-597.5H572V273H452.5V153.5z" /></symbol><symbol viewBox="0 0 1024 1024" id="sheikah-3"><path d="M870.5 153.5V273H751V153.5h119.5zM273 751V153.5L153.5 273v478L273 870.5h478L870.5 751H273zm597.5-299H572V153.5H452.5V452L572 571.5h298.5V452z" /></symbol><symbol viewBox="0 0 1024 1024" id="sheikah-4"><path d="M153.5 751 273 870.5h179.5L572 751V273L452.5 153.5H273L153.5 273h299v478h-299zM751 153.5 870.5 273v478L751 870.5v-717zm-597.5 418V452H273v119.5H153.5z" /></symbol><symbol viewBox="0 0 1024 1024" id="sheikah-5"><path d="M572 571.5V452H452.5v119.5H572zm179 299L870.5 751V452H751v299H153.5L273 870.5h478zM870.5 273 751 153.5H273L153.5 273v298.5H273V273h597.5z" /></symbol><symbol viewBox="0 0 1024 1024" id="sheikah-6"><path d="M870.5 273 751 153.5H572L452.5 273v478L572 870.5h179L870.5 751H572V273h298.5zM273 870.5 153.5 751V273L273 153.5v717zM870.5 452v119.5H751V452h119.5z" /></symbol><symbol viewBox="0 0 1024 1024" id="sheikah-7"><path d="M153.5 870.5V751H273v119.5H153.5zM751 273v597.5L870.5 751V273L751 153.5H273L153.5 273H751zM153.5 571.5h299v299H572v-299L452.5 452h-299v119.5z" /></symbol><symbol viewBox="0 0 1024 1024" id="sheikah-8"><path d="M751 870.5 870.5 751V571.5L751 452H273L153.5 571.5V751L273 870.5v-299h478v299zM153.5 273 273 153.5h478L870.5 273h-717zM572 870.5H452.5V751H572v119.5z" /></symbol><symbol viewBox="0 0 1024 1024" id="sheikah-9"><path d="M870.5 870.5H751V751h119.5v119.5zM273 273h597.5L751 153.5H273L153.5 273v478L273 870.5V273zm299 597.5v-299h298.5V452H572L452.5 571.5v299H572z" /></symbol><symbol viewBox="0 0 1024 1024" id="sheikah-a"><path d="M153.5 273 273 153.5V751h478V273H472v279h199.5v119.5H472L352.5 552V273L472 153.5h279L870.5 273v478L751 870.5H273L153.5 751V273zM552 352.5h119.5V472H552V352.5z" /></symbol><symbol viewBox="0 0 1024 1024" id="sheikah-b"><path d="M153.5 153.5H273V273H153.5V153.5zm597.5 0h119.5V273H751V153.5zm-398.5 0H472v199L352.5 472h-199V352.5h199v-199zm199.5 0h119.5v199h199V472h-199L552 352.5v-199zm-279 717L153.5 751v-79.5L273 552h478l119.5 119.5V751L751 870.5v-199H273v199zM352.5 751h319v119.5h-319V751z" /></symbol><symbol viewBox="0 0 1024 1024" id="sheikah-c"><path d="M153.5 273 273 153.5h79.5L472 273v79.5L352.5 472H273v80h79.5L472 671.5V751L352.5 870.5H273L153.5 751h199v-79.5H273L153.5 552v-80L273 352.5h79.5V273h-199zm717 0L751 153.5h-79.5L552 273v79.5L671.5 472H751v80h-79.5L552 671.5V751l119.5 119.5H751L870.5 751h-199v-79.5H751L870.5 552v-80L751 352.5h-79.5V273h199z" /></symbol><symbol viewBox="0 0 1024 1024" id="sheikah-d"><path d="M153.5 273 273 153.5h478L870.5 273v478L751 870.5V273H153.5zm0 79.5H552L671.5 472v279L552 870.5H273L153.5 751H552V472H153.5V352.5zm0 199.5H472v119.5H153.5V552z" /></symbol><symbol viewBox="0 0 1024 1024" id="sheikah-e"><path d="M153.5 153.5H273V273H153.5V153.5zm597.5 0h119.5V273H751V153.5zM352.5 273 472 153.5h80L671.5 273v199H552V273h-80v199H352.5V273zm-199 79.5H273V552h79.5L472 671.5V751L352.5 870.5H273L153.5 751h199v-79.5H273L153.5 552V352.5zm717 0H751V552h-79.5L552 671.5V751l119.5 119.5H751L870.5 751h-199v-79.5H751L870.5 552V352.5z" /></symbol><symbol viewBox="0 0 1024 1024" id="sheikah-exclam"><path d="M273 870.5 153.5 751V273L273 153.5h179.5L572 273v478h179V153.5L870.5 273v478L751 870.5H572L452.5 751V273H273v597.5z" /></symbol><symbol viewBox="0 0 1024 1024" id="sheikah-f"><path d="M153.5 273 273 153.5h478L870.5 273v199H751V273H273v199H153.5V273zm0 279H273v199h79.5V472L472 352.5h80L671.5 472v279H751V552h119.5v199L751 870.5h-79.5L552 751V472h-80v279L352.5 870.5H273L153.5 751V552z" /></symbol><symbol viewBox="0 0 1024 1024" id="sheikah-g"><path d="M153.5 273 273 153.5h478L870.5 273v478L751 870.5V273H273v279h79.5v-80L472 352.5h80L671.5 472v279L552 870.5H273L153.5 751H552V472h-80v80L352.5 671.5H273L153.5 552V273z" /></symbol><symbol viewBox="0 0 1024 1024" id="sheikah-h"><path d="M153.5 153.5H273V273H153.5V153.5zm199 0H472V273H352.5V153.5zm199.5 0h119.5V273H552V153.5zm199 0h119.5V273H751V153.5zm-478 717L153.5 751V472L273 352.5h478L870.5 472v279L751 870.5V472H273v398.5zm79.5 0v-199L472 552h80l119.5 119.5v199H552v-199h-80v199H352.5z" /></symbol><symbol viewBox="0 0 1024 1024" id="sheikah-hyphen"><path d="M153.5 153.5H273V273H153.5V153.5zM751 751h119.5v119.5H751V751zM352.5 153.5V273H751v179H273L153.5 571.5V751L273 870.5h398.5V751H273V571.5h478L870.5 452V273L751 153.5H352.5z" /></symbol><symbol viewBox="0 0 797 1024" id="sheikah-i"><path d="M40.25 750.75h119.5v119.5H40.25v-119.5zm597 0h119.5v119.5h-119.5v-119.5zm-597-79.5v-398l119.5-119.5h79.5l119.5 119.5v477.5h79.5v-477.5l119.5-119.5h79.5l119.5 119.5v398h-119.5v-398h-79.5v477.5l-119.5 119.5h-79.5l-119.5-119.5v-477.5h-79.5v398H40.25z" /></symbol><symbol viewBox="0 0 1024 1024" id="sheikah-j"><path d="M153.5 273 273 153.5v199h79.5V273L472 153.5h279L870.5 273v478L751 870.5V273H472v79.5L352.5 472H273L153.5 352.5V273zM552 352.5h119.5V751L552 870.5H273L153.5 751H552V352.5zM153.5 552H273v119.5H153.5V552zm199 0H472v119.5H352.5V552z" /></symbol><symbol viewBox="0 0 1024 1024" id="sheikah-k"><path d="M273 870.5 153.5 751V273L273 153.5v717zm478-717L870.5 273v478L751 870.5v-717zm-398.5 0H472V472H352.5V153.5zm0 398.5H472v318.5H352.5V552zm199.5 0h119.5v318.5H552V552zm0-80h119.5V153.5H552V472z" /></symbol><symbol viewBox="0 0 1024 1024" id="sheikah-l"><path d="M153.5 273 273 153.5V552h79.5V273L472 153.5h279L870.5 273H472v279L352.5 671.5H273L153.5 552V273zM552 352.5h318.5V472H552V352.5zm0 199.5h318.5v119.5H552V552zM153.5 751 273 870.5h478L870.5 751h-717z" /></symbol><symbol viewBox="0 0 1024 1024" id="sheikah-m"><path d="M153.5 273 273 153.5h478L870.5 273h-717zm717 478L751 870.5H273L153.5 751h717zm-717-79.5H273V552H153.5v119.5zm199 0H472V472L352.5 352.5h-199V472h199v199.5zm199.5 0V472l119.5-119.5h199V472h-199v199.5H552zM751 552h119.5v119.5H751V552z" /></symbol><symbol viewBox="0 0 1024 1024" id="sheikah-n"><path d="M153.5 273 273 153.5h79.5L472 273v79.5L352.5 472h-199V352.5h199V273h-199zM552 153.5V552H273L153.5 671.5V751L273 870.5h478L870.5 751V273L751 153.5V751H273v-79.5h279L671.5 552V153.5H552z" /></symbol><symbol viewBox="0 0 1024 1024" id="sheikah-o"><path d="M352.5 153.5H472V273H352.5V153.5zm199.5 0h119.5V273H552V153.5zM153.5 552H273v318.5L153.5 751V552zm597.5 0h119.5v199L751 870.5V552zM273 352.5h79.5L472 472v279h80V472l119.5-119.5H751v-199L870.5 273v79.5L751 472h-79.5v279L552 870.5h-80L352.5 751V472H273L153.5 352.5V273L273 153.5v199z" /></symbol><symbol viewBox="0 0 1024 1024" id="sheikah-p"><path d="M352.5 153.5h319V273h-319V153.5zm0 199h319V472h-319V352.5zm0 199.5h319v119.5h-319V552zM273 751h478V153.5L870.5 273v478L751 870.5H273L153.5 751V273L273 153.5V751z" /></symbol><symbol viewBox="0 0 1024 1024" id="sheikah-period"><path d="M870.5 870.5V273L751 153.5H273L153.5 273v478L273 870.5h179.5L572 751V452H452.5v299H273V273h478v597.5h119.5z" /></symbol><symbol viewBox="0 0 1024 1024" id="sheikah-q"><path d="M153.5 153.5H273V273H153.5V153.5zm199 0H472V273H352.5V153.5zm0 398.5H472v318.5H352.5V552zm199.5 0h119.5v318.5H552V552zM273 870.5 153.5 751V472L273 352.5h279v-199h119.5v199L552 472H273v398.5zm478-717L870.5 273v478L751 870.5v-717z" /></symbol><symbol viewBox="0 0 797 1024" id="sheikah-question"><path d="M40.25 153.75h119.5v119.5H40.25v-119.5zm8.5 298h119.5v119.5H48.75v-119.5zm-8.5 299 119.5 119.5h179l119.5-119.5v-477.5h298.5l-119.5-119.5h-179l-119.5 119.5v477.5H40.25zm597-298h119.5v119.5h-119.5v-119.5zm0 298h119.5v119.5h-119.5v-119.5z" /></symbol><symbol viewBox="0 0 1024 1024" id="sheikah-r"><path d="M153.5 751H273v119.5H153.5V751zm597.5 0h119.5v119.5H751V751zM153.5 472V273L273 153.5h79.5L472 273v79.5h80V273l119.5-119.5H751L870.5 273v199H751V273h-79.5v79.5L552 472h-80L352.5 352.5V273H273v199H153.5zm0 80h199L472 671.5V751h80v-79.5L671.5 552h199v119.5h-199V751L552 870.5h-80L352.5 751v-79.5h-199V552z" /></symbol><symbol viewBox="0 0 1024 1024" id="sheikah-s"><path d="M352.5 352.5h319V472h-319V352.5zm0 199.5h319v119.5h-319V552zM472 153.5V273H273v478h199v119.5H273L153.5 751V273L273 153.5h199zm80 0V273h199v478H552v119.5h199L870.5 751V273L751 153.5H552z" /></symbol><symbol viewBox="0 0 1024 1024" id="sheikah-t"><path d="M352.5 153.5h319V273h-319V153.5zm518 597.5L751 870.5H273L153.5 751h717zm-717-478L273 153.5V552h79.5v-80L472 352.5h80L671.5 472v80H751V153.5L870.5 273v279L751 671.5h-79.5L552 552v-80h-80v80L352.5 671.5H273L153.5 552V273z" /></symbol><symbol viewBox="0 0 1024 1024" id="sheikah-u"><path d="M870.5 751 751 870.5H273L153.5 751h717zm-518-398.5H472V472H352.5V352.5zm199.5 0h119.5V472H552V352.5zm199 319h119.5V273L751 153.5v518zm-79.5-518V273H273v279h398.5v119.5H273L153.5 552V273L273 153.5h398.5z" /></symbol><symbol viewBox="0 0 1024 1024" id="sheikah-v"><path d="M153.5 273 273 153.5h478L870.5 273v79.5L751 472H472v398.5H352.5V472L472 352.5h279V273H273v597.5L153.5 751V273zM552 552h119.5v318.5H552V552zm199 0h119.5v199L751 870.5V552z" /></symbol><symbol viewBox="0 0 1024 1024" id="sheikah-w"><path d="M352.5 273v279L472 671.5h80L671.5 552V273h199L751 153.5h-79.5L552 273v279h-80V273L352.5 153.5H273L153.5 273h199zm-199 79.5H273V751h478V352.5h119.5V751L751 870.5H273L153.5 751V352.5z" /></symbol><symbol viewBox="0 0 1024 1024" id="sheikah-x"><path d="M153.5 352.5H273v319H153.5v-319zm597.5 0h119.5v319H751v-319zM153.5 273 273 153.5h79.5L472 273v79.5h80V273l119.5-119.5H751L870.5 273h-199v79.5L552 472h-80L352.5 352.5V273h-199zm199 478v-79.5L472 552h80l119.5 119.5V751h199L751 870.5h-79.5L552 751v-79.5h-80V751L352.5 870.5H273L153.5 751h199z" /></symbol><symbol viewBox="0 0 1024 1024" id="sheikah-y"><path d="M153.5 751 273 870.5v-518H153.5V751zm199-478v597.5H472V273L352.5 153.5H273L153.5 273h199zM751 153.5 870.5 273v398.5H751v-518zm-199 0h119.5V751h199L751 870.5h-79.5L552 751V153.5z" /></symbol><symbol viewBox="0 0 1024 1024" id="sheikah-z"><path d="M153.5 273 273 153.5h478L870.5 273v279L751 671.5h-79.5L552 552V352.5h119.5V552H751V273H153.5zM273 751V472h79.5v199.5H472V472L352.5 352.5H273L153.5 472v279L273 870.5h478L870.5 751H273z" /></symbol></defs></svg>`
  const CSS = `
    .sheikah-glyph {
      display: inline !important;
      width: 1em !important;
      height: 1em !important;
      vertical-align: -0.15em !important;
      fill: currentColor !important;
      overflow: hidden !important;
    }

    .sheikah-glyph use {
      transform-origin: center;
      transform: scale(1.2);
    }

    .sheikah-glyphs-node {
      position: relative;
    }
  `
  const ENABLE_REPLACE_GLYPHS = useOption('enable_replace_glyphs', 'Enable Replace Glyphs', true)

  function replaceGlyphs() {
    if (!ENABLE_REPLACE_GLYPHS.value) return

    const elements = doc.querySelectorAll(SELECTOR)

    elements.forEach(element => {
      element.childNodes.forEach(node => {
        if (node.nodeType !== Node.TEXT_NODE) return
        const originalText = node.textContent
        const newText = originalText
          .split('')
          .map(char => {
            const c = char.toLowerCase()
            if (!SHEIKAH_GLYPHS.includes(c)) return char
            const id = SHEIKAH_SYMBOL_MAP.has(c) ? SHEIKAH_SYMBOL_MAP.get(c) : c
            return `<svg class="sheikah-glyph" aria-hidden="true" title="${c}">
                <use xlink:href="#sheikah-${id}" />
              </svg>`
          })
          .join('')
        if (originalText === newText) return
        const newTextNode = doc.createElement('span')
        newTextNode.classList.add('sheikah-glyphs-node')
        newTextNode.innerHTML = newText
        node.replaceWith(newTextNode)
      })
    })
  }

  function observeDOM(observer) {
    observer.observe(doc.body, { childList: true, subtree: true })
  }

  function debounce(func, wait, immediate) {
    let timeout
    return function (...args) {
      const context = this
      const later = function () {
        timeout = null
        if (!immediate) func.apply(context, args)
      }
      const callNow = immediate && !timeout
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
      if (callNow) func.apply(context, args)
    }
  }

  function injectStyle(css) {
    const el = doc.createElement('style')
    el.innerHTML = css
    doc.head.append(el)
  }
  function injectSprite(sprite) {
    const el = document.createElement('div')
    el.innerHTML = sprite
    el.id = '__SHEIKAH_GLYPHS__'
    el.style = 'width: 0; height: 0; position: absolute; top: -10000px; left: -10000px;'
    doc.body.append(el)
  }

  const replaceGlyphsDebounced = debounce(replaceGlyphs, 300)

  // script loaded
  replaceGlyphs()

  // content changed
  const observer = new MutationObserver(() => {
    requestAnimationFrame(replaceGlyphsDebounced)
  })

  if (doc.readyState === 'loading') {
    doc.addEventListener('DOMContentLoaded', () => {
      observeDOM(observer)
      injectStyle(CSS)
      injectSprite(SVG_SPRITE)
    })
  } else {
    observeDOM(observer)
    injectStyle(CSS)
    injectSprite(SVG_SPRITE)
  }
})()