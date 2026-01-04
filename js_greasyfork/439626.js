// ==UserScript==
// @name         Vote novosib
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over world!
// @author       no-name
// @include      *.novo-sibirsk.ru*
// @downloadURL https://update.greasyfork.org/scripts/439626/Vote%20novosib.user.js
// @updateURL https://update.greasyfork.org/scripts/439626/Vote%20novosib.meta.js
// ==/UserScript==

(async function () {
  var button = document.createElement('div')
  button.classList.add('batu-button')
  button.innerHTML = 'RESTART'
  var style = {
    position: 'fixed',
    zIndex: 999999,
    top: '10px',
    left: '10px',
    padding: '10px',
    background: '#FFF',
    cursor: 'pointer',
    borderRadius: '3px',
  }
  Object.keys(style).forEach(key => {
    button.style[key] = style[key]
  })
  document.body.appendChild(button)
  button.addEventListener('click', () => {
    document.cookie = 'quiz144=;expires=Thu, 01 Jan 1970 00:00:00 GMT'
    const url = 'http://poll.novo-sibirsk.ru/quizing.aspx?quiz=144&cookieCheck=true'
    window.location = url
  })


})()