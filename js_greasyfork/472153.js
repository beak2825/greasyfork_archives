// ==UserScript==
// @name         Copy access token of ChatGPT
// @namespace    https://flosacca.com/
// @version      1.1
// @description  Add a button to copy the access token in the session page of ChatGPT, for the JSON viewer of Google Chrome
// @author       flosacca
// @license      The Unlicense
// @match        https://chat.openai.com/api/auth/session
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/472153/Copy%20access%20token%20of%20ChatGPT.user.js
// @updateURL https://update.greasyfork.org/scripts/472153/Copy%20access%20token%20of%20ChatGPT.meta.js
// ==/UserScript==

(() => {
  if (navigator.vendor !== 'Google Inc.') {
    return
  }
  const pre = document.querySelector('pre')
  const { accessToken } = JSON.parse(pre.textContent)
  const btn = document.createElement('button')
  btn.textContent = 'Copy access token'
  btn.onclick = () => {
    navigator.clipboard.writeText(accessToken)
  }
  pre.insertAdjacentElement('beforebegin', btn)
  const fixed = document.querySelector('.json-formatter-container')
  if (!fixed) {
    return
  }
  const css = (el, name) => getComputedStyle(el).getPropertyValue(name)
  const len0 = css(fixed, 'height')
  const len1 = css(pre, 'padding-top')
  const len2 = css(btn, 'height')
  const len3 = `calc(${len0} + ${css(pre, 'margin-top')})`
  const div = document.createElement('div')
  div.style = `height: calc(${len3} + ${len2} - ${len1});`
  btn.style = `position: absolute; top: ${len3};`
  btn.replaceWith(div)
  div.append(btn)
})()