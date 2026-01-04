// ==UserScript==
// @name         baklib查看总访问量
// @namespace    https://xyw.baklib.com/
// @version      0.0.5
// @description  在所有文章页面生效
// @author       Silencer
// @match        *://*.baklib.com/-/admin/*
// @icon         https://assets.baklib.com/home_logo.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/399172/baklib%E6%9F%A5%E7%9C%8B%E6%80%BB%E8%AE%BF%E9%97%AE%E9%87%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/399172/baklib%E6%9F%A5%E7%9C%8B%E6%80%BB%E8%AE%BF%E9%97%AE%E9%87%8F.meta.js
// ==/UserScript==

const sum =
  new Array(...document.querySelectorAll('tr td'))
    .filter(i => !isNaN(Number(i.innerText)))
    .reduce((sum, i) => sum + Number(i.innerText.replace(/\D/, '')), 0)

document.querySelectorAll('tr th')
  .forEach(i => i.innerHTML += i.innerText.includes('量') ? `: ${sum}` : '')