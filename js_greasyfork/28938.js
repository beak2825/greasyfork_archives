// ==UserScript==
// @name ptt imgur embed
// @namespace ptt.cc
// @include https://www.ptt.cc/bbs/*.html
// @include https://www.ptt.cc/man/*.html
// @run-at document-start
// @version 0.0.1.20170413212618
// @description zh-tw
// @downloadURL https://update.greasyfork.org/scripts/28938/ptt%20imgur%20embed.user.js
// @updateURL https://update.greasyfork.org/scripts/28938/ptt%20imgur%20embed.meta.js
// ==/UserScript==

const h = (tag, props) => Object.assign(document.createElement(tag), props)

const preventScript = test => event =>
 test(event.target.src) && event.preventDefault()
const isImgurScript = name => /imgur.com/.test(name)
document.addEventListener('beforescriptexecute', preventScript(isImgurScript))
try { //if no beforescriptexecute
 unsafeWindow.imgurEmbed = {createIframe: () => void 8}
} catch(e) {}

document.addEventListener('DOMContentLoaded', main)

const entry = '.imgur-embed-pub'

const imgurURL = node => {
 const link = node.parentElement.previousElementSibling
 return (link.href || link.querySelector('a').href)
  .replace('http:', 'https://')
}

const ensureSuffix = url => /\.(jpe?g|png)$/.test(url)? url: url + '.jpg'

function repaste(node) {
 node.parentElement.appendChild(h('img', {
  src: ensureSuffix(imgurURL(node)),
  referrerPolicy: 'no-referrer'
 }))
}

function main() {
 Array.from(document.querySelectorAll(entry)).forEach(repaste)
}