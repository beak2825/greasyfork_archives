// ==UserScript==
// @name             myl7 refines Google Search
// @namespace        https://github.com/myl7/refine-google-search
// @version          0.1.2
// @description      Simple script to refine Google Search experience. Copy the code to arrange by youself if you do not want another user script.
// @copyright        Copyright (c) 2021 myl7
// @license          MIT
// @author           myl7
// @match            https://www.google.com/search
// @run-at           document-end
// @grant            none
// @homepageURL      https://github.com/myl7/refine-google-search
// @supportURL       https://github.com/myl7/refine-google-search/issues
// @contributionURL  https://github.com/myl7/refine-google-search/pulls
// @downloadURL https://update.greasyfork.org/scripts/433464/myl7%20refines%20Google%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/433464/myl7%20refines%20Google%20Search.meta.js
// ==/UserScript==

// ==OpenUserJS==
// @author           myl7
// ==/OpenUserJS==

const colWidth = '535px'

let style = ''

// Remove "translate this page" button
document.querySelectorAll('a.fl.iUh30').forEach(e => e.remove())

// Double column display
const resRoot = document.querySelector('.v7W49e')
let items = []
for (let e of resRoot.children) {
  if (!['SCRIPT', 'SPAN', 'STYLE'].includes(e.tagName)) {
    e.style.width = colWidth
    items.push(e)
  }
}
style += `div.g:not(.jNVrwc.Y4pkMc) { width: ${colWidth} }`

const floatWin = document.querySelector('div.TQc1id.hSOk2e.rhstc4')
if (floatWin) {
  floatWin.style.marginLeft = '0'
  items.splice(1, 0, floatWin)
}

items.forEach(e => e.remove())

const itemBox = document.createElement('div')
items.forEach(e => itemBox.appendChild(e))
itemBox.style.display = 'grid'
itemBox.style.gridTemplateColumns = '1fr 1fr'
itemBox.style.gridColumnGap = '10px'
itemBox.style.marginBottom = '44px'
resRoot.appendChild(itemBox)

// Decrease title font size
style += 'h3 { font-size: 16px !important }'

// Change bottom relative search style
style += 'div.eqAnXb { margin-bottom: -20px }'
style += 'div.s75CSd.OhScic.AB4Wff { font-size: 14px }'
style += 'a.k8XOCe.R0xfCb.VCOFK.s8bAkb { background-color: inherit; min-height: 0; margin: 0; line-height: 24px }'
document.querySelectorAll('div.aXBZVd.zVq10e').forEach(e => e.remove())

// Change middle other search style
style += 'div.iDjcJe.IX9Lgd.wwB5gf { font-size: 14px }'
style += `div.E9iWlb.KFFQ0c.xKf9F { width: ${colWidth} }`

// Change float search result style
style += 'div.kno-rdesc { padding: 0.5em }'
style += 'div.HsZQAe { margin-top: 0 !important }'
style += 'div.PZPZlf.hb8SAc { margin-top: 13px !important }'
style += 'div.wDYxhc { padding-left: 0.5em !important; padding-right: 0.5em !important }'
style += 'div.SPZz6b { padding-top: 0.5em }'
style += 'div.I6TXqe { padding-bottom: 0.5em !important }'

// CSS inject helper
const addStyle = style => {
  const styleElem = document.createElement('style')
  styleElem.innerHTML = style
  document.head.appendChild(styleElem)
}
addStyle(style)
