// ==UserScript==
// @name         简书去除广告
// @namespace    null
// @version      0.0.2
// @description  简书💊
// @author       lsmhq
// @license MIT
// @match        https://www.jianshu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=microsoft.com
// @downloadURL https://update.greasyfork.org/scripts/464742/%E7%AE%80%E4%B9%A6%E5%8E%BB%E9%99%A4%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/464742/%E7%AE%80%E4%B9%A6%E5%8E%BB%E9%99%A4%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function () {
  'use strict';
  window.onload = () => {
    let divs = document.querySelectorAll("body>div");
    console.log(divs)
    let page = document.getElementById('__next')
    page.style.display = 'none'
    new Promise((rv, rj) => {
      for (let i = 0; i < divs.length; i++) {
        if (divs[i].id === '' || divs[i].id === "note") {
          divs[i].remove()
        }
      }
      document.querySelectorAll('aside')[0].remove()
      rv(true)
    }).then(res=>{
      page.style.display = ''
    }).catch(e=>{
      console.error(e)
    })
  }
})();