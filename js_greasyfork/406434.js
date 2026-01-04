// ==UserScript==
// @name         巴哈姆特 wiki 链接标准化
// @version      1.0
// @description  把巴哈姆特 wiki 侧边栏的链接 target 变成正确的 URL ，从而可以按住 Ctrl 键点击、在新 Tab 页中打开。
// @match       https://wiki2.gamer.com.tw/wiki.php
// @supportURL https://github.com/whtsky/userscripts/issues
// @namespace https://greasyfork.org/users/164794
// @downloadURL https://update.greasyfork.org/scripts/406434/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%20wiki%20%E9%93%BE%E6%8E%A5%E6%A0%87%E5%87%86%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/406434/%E5%B7%B4%E5%93%88%E5%A7%86%E7%89%B9%20wiki%20%E9%93%BE%E6%8E%A5%E6%A0%87%E5%87%86%E5%8C%96.meta.js
// ==/UserScript==

const ss = document.querySelector('input[name=ss]').value

function getMenuLink(furl) {
  const urlarr = decodeURIComponent(furl).split('#')
  const url = urlarr[0]
  const anchor = urlarr[1] ? '#' + urlarr[1] : ''
  return location.origin + url + `&ss=${ss}&mpath=${window.MenuPath}${anchor}`
}

const re = /javascript:MenuLink\('(.+)'\)/

document.querySelectorAll('a').forEach(anchor => {
  const match = anchor.href.match(re)
  if (match) {
    anchor.href = getMenuLink(match[1])
  }
})
