// ==UserScript==
// @name         msdn jump cn
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  msdn 外文页面自动重定向到中文页面
// @author       ayase
// @match        https://docs.microsoft.com/*
// @match        https://developer.mozilla.org/*
// @downloadURL https://update.greasyfork.org/scripts/428718/msdn%20jump%20cn.user.js
// @updateURL https://update.greasyfork.org/scripts/428718/msdn%20jump%20cn.meta.js
// ==/UserScript==



;(() => {
  const main = async () => {
    const isCN = location.pathname.toLowerCase().startsWith('/zh-cn/')
    if (isCN) {
        return
    }
    let newPathArr = location.pathname.split('/')
    newPathArr = newPathArr.slice(2)
    newPathArr = ['', 'zh-cn', ...newPathArr]
    const path = newPathArr.join('/')
    
    const resp = await fetch(path)
    if (resp.status !== 200) {
      return
    }
    location.pathname = path
  }

  main()

})()