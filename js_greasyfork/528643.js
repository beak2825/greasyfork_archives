// ==UserScript==
// @name        冰岩招新系统增强(并非）
// @namespace   Violentmonkey Scripts
// @match       https://cvs.bingyan.net/*
// @grant       none
// @version     1.2
// @author      HMACBSP
// @license     MIT
// @description 2025/2/25 17:10:30
// @downloadURL https://update.greasyfork.org/scripts/528643/%E5%86%B0%E5%B2%A9%E6%8B%9B%E6%96%B0%E7%B3%BB%E7%BB%9F%E5%A2%9E%E5%BC%BA%28%E5%B9%B6%E9%9D%9E%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/528643/%E5%86%B0%E5%B2%A9%E6%8B%9B%E6%96%B0%E7%B3%BB%E7%BB%9F%E5%A2%9E%E5%BC%BA%28%E5%B9%B6%E9%9D%9E%EF%BC%89.meta.js
// ==/UserScript==

const SMART_GITHUB = true

async function asyncQuerySelectorAll (q) {
  let resolver
  const promise = new Promise((resolve) => { resolver = resolve })
  const interval = setInterval(() => {
    const temp = [...document.querySelectorAll(q)]
    if (temp.length > 0) {
      clearInterval(interval)
      resolver([...temp])
    }
  }, 200)
  return await promise
}

function getSmartGithubUrl (oriTxt) {
  const matches = [...oriTxt.matchAll(/((?<=github\.com\/)[\w-]+)|([\w-]+(?=\.github\.io))/g)].map(m => m[0])
  return [...(new Set(matches.map(m => `https://github.com/${m}`)))]
}

;(async () => {
  if (SMART_GITHUB) {
    if (location.pathname === '/resume/resume') {
      const answers = [...(await asyncQuerySelectorAll('.r_ans-item-answer'))]
      console.log(answers)
      answers.forEach(el => {
        const oriTxt = el.innerHTML
        const ghUrls = getSmartGithubUrl(oriTxt)
        if (ghUrls.length > 0) {
          el.innerHTML += `<br><br>--------可能涉及到的主页---------<br>${ghUrls.map(u => `<a href="${u}" target="_blank">${u}</a>`).join('<br>')}`
        }
      })
    }
  }
})()
