// ==UserScript==
// @name         AutoRedirectCN
// @name:zh-CN   自动跳转到中文网站
// @namespace    http://www.wasdjkl.com/
// @version      0.3
// @description  Automatically redirect to the corresponding Chinese official website when opening official websites in other languages. Support: Rollup Vue.js Vite webpack Pinia VueRouter
// @description:zh-CN 当打开其他语言的官方网站时，自动重定向到相应的中文官方网站。支持: Rollup Vue.js Vite webpack Pinia VueRouter
// @run-at       document-start
// @author       wasdjkl
// @match        https://*.rollupjs.org/*
// @match        https://*.vuejs.org/*
// @match        https://*.vitejs.dev/*
// @match        https://webpack.kr/*
// @match        https://webpack.js.org/*
// @match        https://pinia.vuejs.org/*
// @match        https://router.vuejs.org/*
// @copyright    https://www.wasdjkl.com
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/464722/AutoRedirectCN.user.js
// @updateURL https://update.greasyfork.org/scripts/464722/AutoRedirectCN.meta.js
// ==/UserScript==

(function () {
  'use strict'
  const url = location.href.toString()
  const redirectRules = [
    // Rollup
    { regex: /^https:\/\/rollupjs.org\//, cn: 'https://cn.rollupjs.org/' },
    // Vue.js
    { regex: /^https:\/\/(ja|ua|fr)?.?vuejs.org\//, cn: 'https://cn.vuejs.org/' },
    // Vite
    { regex: /^https:\/\/(ja|es|pt)?.?vitejs.dev\//, cn: 'https://cn.vitejs.dev/' },
    // webpack
    { regex: /^https:\/\/webpack.(kr|js.org)+\//, cn: 'https://webpack.docschina.org/' },
    // Pinia
    { regex: /^https:\/\/pinia.vuejs.org\//, cn: 'https://pinia.vuejs.org/zh/' },
    // VueRouter
    { regex: /^https:\/\/router.vuejs.org\//, cn: 'https://router.vuejs.org/zh/' },
  ]

  for (const rules of redirectRules) {
    const { regex, cn } = rules
    if (regex.test(url)) {
      if (url.startsWith(cn))
        return
      location.href = url.replace(regex, cn)
    }
  }
})()
