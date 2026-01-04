// ==UserScript==
// @name        Wide-ish PhotoPea.com
// @namespace   Violentmonkey Scripts
// @match       https://www.photopea.com/
// @grant       none
// @version     1.0
// @author      UniBreakfast
// @description 17.02.2020, 10:33:05, Please do tell me if you know how to resize PhotoPea's canvas without wisible stretching!
// @downloadURL https://update.greasyfork.org/scripts/396548/Wide-ish%20PhotoPeacom.user.js
// @updateURL https://update.greasyfork.org/scripts/396548/Wide-ish%20PhotoPeacom.meta.js
// ==/UserScript==
const qSel = sel => document.querySelector(sel)
const inter = setInterval(()=> {
  const canvas = qSel('canvas')
  if (!canvas) return
  clearInterval(inter)
  canvas.style.margin = 'auto'
  canvas.parentNode.addEventListener('mousemove', e => {
    qSel('.photopea').lastChild.style.display = 'none'
    const width = innerWidth - document.querySelector('.rightbar').clientWidth - document.querySelector('.sbar').clientWidth - 30
    // canvas.height =  width / canvas.width * canvas.height
    // canvas.width = width
    qSel('.panelhead').style.maxWidth = qSel('.pbody').parentNode.style.width = /*canvas.style.width =*/ width+'px'
    // canvas.style.height = canvas.height+'px'
  })
}, 500)