// ==UserScript==
// @name         Poblock
// @name:zh-CN   Poblock
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Block Political Content in Technology Site
// @description:zh-CN  阻止显示技术网站的政治内容
// @author       YunYouJun
// @match        *://*.reactjs.org/*
// @match        *://*.svelte.dev/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/440904/Poblock.user.js
// @updateURL https://update.greasyfork.org/scripts/440904/Poblock.meta.js
// ==/UserScript==

/**
 * add CSS Style
 * @param {string} innerText 
 */
function addStyle(innerText) {
  const style = document.createElement('style')
  document.body.appendChild(style)
  style.innerText = innerText
}

/**
 * hide class name
 * @param {string} className 
 */
function hideClass(className) {
  addStyle(`.${className} {display: none;}`)
}

const siteRules = [
  {
    name: 'react',
    domains: ['reactjs.org'],
    handler: () => {
      const header = document.querySelectorAll('header')[0]
      console.log(header.children)
      if (header.children && header.children.length > 1) {
        // removeChild can not prevent render
        const className = header.children[0].className
        hideClass(className)
      }
    }
  },
  {
    name: 'svelte',
    domains: ['svelte.dev'],
    handler: () => {
      hideClass('ukr')
      addStyle('.nav-spot {background-image: url(/svelte-logo.svg) !important;}')
    }
  }
]

/**
 * 执行规则
 */
function run() {
  siteRules.some(item => {
    item.domains.some(domain => {
      if (location.href.indexOf(domain) !== -1) {
        item.handler();
        return true
      }
    })
  })
}

(function() {
    'use strict';

    // Your code here...
    run();
})();
