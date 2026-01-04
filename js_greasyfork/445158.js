// ==UserScript==
// @name                Add-Link-To-NPM-Devtool-Tech
// @name:zh-CN          给npm包添加一个到NPM-Devtool-Tech的链接
// @namespace           http://tampermonkey.net/
// @version             0.0.2
// @description         add an link to npm devtool tech in npm package page
// @description:zh-CN   在npm包页面添加一个到NPM-Devtool-Tech的链接
// @author              kkopite
// @match               https://www.npmjs.com/package/*
// @icon                https://www.google.com/s2/favicons?sz=64&domain=www.npmjs.com
// @grant               none
// @downloadURL https://update.greasyfork.org/scripts/445158/Add-Link-To-NPM-Devtool-Tech.user.js
// @updateURL https://update.greasyfork.org/scripts/445158/Add-Link-To-NPM-Devtool-Tech.meta.js
// ==/UserScript==

(function () {
  'use strict'

  const h3s = document.querySelectorAll('h3')
  let h3 = [...h3s].find(h => h.innerText === 'Install')

  const link = document.createElement('div')
  const url = `https://npm.devtool.tech/${window.location.pathname.split('/')[2]}`
  link.innerHTML = `
  <div class="dib w-50 bb b--black-10 pr2 w-100">
    <h3 id="devtoolTech" class="f5 mt2 pt2 mb0">DevTool Tech</h3>
    <p class="_40aff104 fw6 mb3 mt2 truncate black-80 f5">
      <a aria-labelledby="DevTool Tech" class="b2812e30 f2874b88 fw6 mb3 mt2 truncate black-80 f4 link" href="${url}" target="_blank" rel="noopener noreferrer nofollow">
      <span>${url}</span>
      </a>
    </p>
  </div>
  `

  h3.parentNode.insertBefore(link, h3.nextSibling.nextSibling)

})()
