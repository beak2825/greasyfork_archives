// ==UserScript==
// @name            google-translate
// @name:zh         谷歌翻译
// @namespace       https://github.com/pansong291/
// @version         0.3.2
// @description     add a Google Translate plug-in to the page
// @description:zh  向页面添加谷歌翻译插件
// @author          paso
// @license         Apache-2.0
// @match           *://*/*
// @icon            https://ssl.gstatic.com/translate/favicon.ico
// @grant           none
// @run-at          context-menu
// @downloadURL https://update.greasyfork.org/scripts/493434/google-translate.user.js
// @updateURL https://update.greasyfork.org/scripts/493434/google-translate.meta.js
// ==/UserScript==

;(function () {
  'use strict'
  if (window.googleTranslateElementShake && typeof window.googleTranslateElementShake === 'function') {
    window.googleTranslateElementShake()
    console.info('%cGoogle Translate\n%chas already been inited.', 'color: #fbbc05; font-size: 22px; font-weight: bold', 'font-size: 14px')
    return
  }
  const randomId = Math.floor(Math.random() * 100_000_000)
  const elementId = 'google-translate-element-' + randomId
  const expand = 'gt-expand-' + randomId
  const shake = 'gt-shake-' + randomId
  const spinner = 'gt-spinner-' + randomId
  document.head.insertAdjacentHTML('beforeend', `
<style data-info="google-translate-plugin-${randomId}">
  #${elementId} {
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 99999;
    transform: translateX(calc(8px - 100%));
    transition: transform .3s;
    background: white;
    padding: 4px;
    border-radius: 0 4px 0 0;
    box-shadow: 0 0 4px rgba(0,0,0,50%);
  }
  #${elementId}.${expand} {
    transform: translateX(0);
  }
  #${elementId} span, #${elementId} a, #${elementId} img {
    display: inline;
  }
  @keyframes gt-anim-shake-${randomId} {
    0%, 100% {
      transform: translateX(0);
    }
    10%, 30%, 50%, 70%, 90% {
      transform: translateX(-8px);
    }
    20%, 40%, 60%, 80% {
      transform: translateX(8px);
    }
  }
  @keyframes gt-anim-rotate-${randomId} {
    100% { transform: rotate(360deg); }
  }
  #${elementId}.${shake} {
    animation: 1s ease-in-out 0s gt-anim-shake-${randomId};
  }
  #${elementId} .${spinner} {
    display: block;
    animation: 1s ease infinite gt-anim-rotate-${randomId};
    width: 24px;
    height: 24px;
  }
</style>`)

  const loadingSvg = createSvgElement('svg', {
    class: spinner, viewBox: '0 0 50 50'
  }, createSvgElement('circle', {
    cx: '25', cy: '25', r: '20', fill: 'none', stroke: 'black', 'stroke-width': '4', 'stroke-dasharray': '30 20'
  }))
  const divElm = createElement('div', { id: elementId, class: expand }, loadingSvg)
  document.body.append(divElm)

  const onCompleted = (loopId) => {
    if (loopId) clearInterval(loopId)
    loadingSvg.remove()
    divElm.addEventListener('pointerenter', () => divElm.classList.toggle(expand, true))
    divElm.addEventListener('pointerleave', () => divElm.classList.toggle(expand, false))
  }

  const jsElm = createElement('script', { src: '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit' })
  jsElm.onload = () => {
    let count = 60
    let loopId = setInterval(() => {
      if (window.google?.translate?.TranslateElement) {
        new window.google.translate.TranslateElement(null, elementId)
        console.log('%cGoogle Translate\n%cinit finished.', 'color: #4286F3; font-size: 22px; font-weight: bold', 'font-size: 14px')
        onCompleted(loopId)
      } else if (count <= 0) {
        console.warn('%cGoogle Translate\n%cinit failed!', 'color: #EB4537; font-size: 22px; font-weight: bold', 'font-size: 14px')
        onCompleted(loopId)
      }
      count--
    }, 500)
  }
  jsElm.onerror = () => {
    divElm.append(createElement('a', {
      style: 'font-size: 16px;',
      href: 'https://greasyfork.org/scripts/493434',
      target: '_blank'
    }, ['Google Translate load failed!']))
    onCompleted()
  }
  document.head.append(jsElm)

  window.googleTranslateElementShake = (function() {
    let shaking = false
    return () => {
      if (shaking) return
      shaking = true
      if (divElm.classList.contains(expand)) {
        play('animation', divElm, shake, true).then(() => {
          divElm.classList.toggle(shake, false)
          shaking = false
        })
        return
      }
      play('transition', divElm, expand, true)
        .then(() => play('animation', divElm, shake, true))
        .then(() => {
          divElm.classList.remove(expand, shake)
          shaking = false
        })
    }
  }())

  /**
   * 播放过渡或动画
   * @param {'transition'|'animation'} type
   * @param {HTMLElement} target
   * @param {string} token
   * @param {boolean} force
   * @return {Promise<void>}
   */
  function play(type, target, token, force) {
    if (target.classList.contains(token) !== !force) return Promise.resolve()
    return new Promise((resolve) => {
      target.addEventListener(type + 'end', () => {
        setTimeout(() => resolve())
      }, { once: true })
      target.classList.toggle(token, force)
    })
  }

  function createElement(tag, attrs, children) {
    const el = document.createElement(tag)
    setAttrAndChildren(el, attrs, children)
    return el
  }

  function createSvgElement(tag, attrs, children) {
    const el = document.createElementNS('http://www.w3.org/2000/svg', tag)
    setAttrAndChildren(el, attrs, children)
    return el
  }

  function setAttrAndChildren(el, attrs, children) {
    if (attrs) {
      Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v))
    }
    if (typeof children === 'string') {
      el.innerHTML = children
    } else if (Array.isArray(children)) {
      el.append.apply(el, children)
    } else if (typeof children === 'object' && children instanceof Node) {
      el.appendChild(children)
    }
  }
})()
