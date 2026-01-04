// ==UserScript==
// @name        instant-page
// @namespace   hikerpig
// @match        *://*/*
// @grant       none
// @version     1.0
// @author      hikerpig
// @description Cheat your brain with just-in-time preloading, it preloads a page right before you click on it. With the help of instant.page library
// @downloadURL https://update.greasyfork.org/scripts/402323/instant-page.user.js
// @updateURL https://update.greasyfork.org/scripts/402323/instant-page.meta.js
// ==/UserScript==


function start() {
  var script = document.createElement('script')
  script.src = '//instant.page/3.0.0'
  script.type = 'module'
  document.body.appendChild(script)
  console.log('Successfully injected instant.page library')
}

start()
