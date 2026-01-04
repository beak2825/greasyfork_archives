// ==UserScript==
// @name       TGFC Firefox enhance
// @namespace  https://club.tgfcer.com/firefox_enhance
// @version    0.06
// @description   增强 TGFC 在 Firefox Android 下的浏览体验
// @supportURL	 meltifa@gmail.com
// @include      http://wap.tgfcer.com/*
// @include      https://wap.tgfcer.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375646/TGFC%20Firefox%20enhance.user.js
// @updateURL https://update.greasyfork.org/scripts/375646/TGFC%20Firefox%20enhance.meta.js
// ==/UserScript==

const head = document.getElementsByTagName('head')[0]
const viewport = document.createElement('meta')
viewport.setAttribute('name', 'viewport')
viewport.setAttribute('content', 'width=device-width,initial-scale=1')
head.appendChild(viewport)
const layouts = [
  document.querySelector('.navbar'),
  document.querySelector('.navbar + div'),
  document.getElementById('footer')
]
layouts.forEach(layout => layout.style.padding = '0 16px')