// ==UserScript==
// @name         Google Search English Button
// @namespace    https://ciffelia.com/
// @version      1.1.0
// @description  Googleの検索結果ページに英語のページだけを表示するボタンを追加
// @author       Ciffelia <mc.prince.0203@gmail.com> (https://ciffelia.com/)
// @match        https://www.google.com/search?*
// @downloadURL https://update.greasyfork.org/scripts/465386/Google%20Search%20English%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/465386/Google%20Search%20English%20Button.meta.js
// ==/UserScript==

(() => {
  'use strict'

  const url = new URL(location.href)
  url.searchParams.set('lr', 'lang_en')

  const btnElm = document.createElement('button')
  btnElm.innerText = 'English'
  btnElm.style.position = 'absolute'
  btnElm.style.left = '100%'
  btnElm.style.height = '100%'
  btnElm.style.aspectRatio = '1.5 / 1'
  btnElm.style.colorScheme = 'light dark';

  const aElm = document.createElement('a')
  aElm.href = url.toString()
  aElm.appendChild(btnElm)

  const containerElm = [...document.querySelectorAll('h1')].find((elm) => elm.innerHTML === 'フィルタとトピック')?.nextSibling?.childNodes[0]
  if (!containerElm) return

  containerElm.style.position = 'relative'
  containerElm.appendChild(aElm)
})()
