// ==UserScript==
// @name        aliexpress.com no shitty links
// @namespace   Violentmonkey Scripts
// @match       https://*.aliexpress.com/*
// @grant       none
// @version     1.0
// @author      -
// @description 4/8/2021, 8:29:16 PM
// @downloadURL https://update.greasyfork.org/scripts/424724/aliexpresscom%20no%20shitty%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/424724/aliexpresscom%20no%20shitty%20links.meta.js
// ==/UserScript==


const installed = new WeakMap();

function replaceHref(elem, url) {
  elem.setAttribute('href', url)
}

function setEvent(elem, url) {
  elem.addEventListener('mousedown', (e) => {
    e.preventDefault()
    e.stopPropagation()
    switch (e.button) {
      case 0:
        location.href = url;
        break;
      case 1:
        let opened = window.open(url)
        opened.blur()
        window.focus()
        break;
    }
    console.log(url, {button: e.button})
  }, false)
}


function installer(useChild) {
  return function install(elem) {
    if (installed.has(elem))
      return;

    installed.set(elem, true);

    const url = elem.getAttribute('data-href')
    let target = elem

    if (useChild)
      target = elem.querySelector('a') || target

    if (target.tagName == 'A')
      return replaceHref(target, url)

    setEvent(target, url)

    console.log(elem)
  }
}



setInterval(() => {
  Array.from(document.querySelectorAll('a[data-href]')).forEach(installer())
  Array.from(document.querySelectorAll('div[data-href]')).forEach(installer(true))
}, 200)