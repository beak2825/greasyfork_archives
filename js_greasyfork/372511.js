// ==UserScript==
// @name SSL Labs Refined
// @description Improve SSL Labs
// @namespace https://franklinyu.github.io
// @version 0.2.0
// @include https://www.ssllabs.com/ssltest/analyze.html?*
// @grant none
// @inject-into content
// @downloadURL https://update.greasyfork.org/scripts/372511/SSL%20Labs%20Refined.user.js
// @updateURL https://update.greasyfork.org/scripts/372511/SSL%20Labs%20Refined.meta.js
// ==/UserScript==

HTMLCollection.prototype.filter = Array.prototype.filter

document.getElementsByClassName('serverKeyCert')
  .filter(e => e.innerText.trim() === 'Server Key and Certificate #1')
  .map(e => e.closest('table').querySelector('.greySmall'))
  .forEach(span => {
    const hash = span.innerText.match(/[0-9a-f]{64}/)[0]
    const anchor = document.createElement('a')
    anchor.href = 'https://crt.sh/?q=' + hash
    anchor.innerText = hash
    span.innerHTML = span.innerHTML.replace(hash, anchor.outerHTML)
  })
