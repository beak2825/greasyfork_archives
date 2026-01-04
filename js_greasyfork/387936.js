// ==UserScript==
// @name         LinGoogle
// @namespace    https://github.com/tonioriol/userscripts
// @version      3.0.3
// @description  Add language filter buttons to Google search for quick language switching
// @author       Toni Oriol
// @include      /^http(s)?:\/\/(www)?\.google\.\w*\/search.*$/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @license      AGPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/387936/LinGoogle.user.js
// @updateURL https://update.greasyfork.org/scripts/387936/LinGoogle.meta.js
// ==/UserScript==

(function () {
  const langList = ['ca', 'es', 'en', 'sv']
  const url = new URL(location.href)
 
  const menu = document.createElement('div')
  menu.style.position = 'absolute'
  menu.style.top = '0'
  menu.style.left = '0'
  menu.style.right = '0'
  menu.style.zIndex = '9999999999'
  menu.style.display = 'flex'
  menu.style.flexDirection = 'row'
  menu.style.gap = '1rem'
  menu.style.justifyContent = 'center'
 
  langList.forEach(l => {
    const item = document.createElement('div')
    url.searchParams.set('lr', `lang_${l}`)
    item.innerHTML = `<a href="${url}">${l}</a>`
    menu.appendChild(item)
  })
 
  document.querySelector('body').appendChild(menu)
})()