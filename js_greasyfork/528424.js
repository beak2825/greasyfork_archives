// ==UserScript==
// @name        移除含有不喜欢标签的漫画
// @name:zh-CN  移除含有不喜欢标签的漫画
// @namespace   Violentmonkey Scripts
// @match       https://18comic.vip/*
// @match.      https://18comic.org/*
// @grant       none
// @version     1.2
// @author      -
// @grant        GM_getValue
// @description 2025/3/1 16:01:35
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/528424/%E7%A7%BB%E9%99%A4%E5%90%AB%E6%9C%89%E4%B8%8D%E5%96%9C%E6%AC%A2%E6%A0%87%E7%AD%BE%E7%9A%84%E6%BC%AB%E7%94%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/528424/%E7%A7%BB%E9%99%A4%E5%90%AB%E6%9C%89%E4%B8%8D%E5%96%9C%E6%AC%A2%E6%A0%87%E7%AD%BE%E7%9A%84%E6%BC%AB%E7%94%BB.meta.js
// ==/UserScript==


/**
 * 需手动到【数据】中添加 hateTags 数组，如
 * @example
 * { "hateTags": ["虐殺","xxx"]  }
 */
const ignoreTagList = GM_getValue('hateTags')

function haveCommonElements(arr1, arr2) {
  return arr1.some(item => arr2.includes(item));
}

function handleTag() {
  // 限制范围
  const wrapperDoms = document.querySelectorAll('div[class*="p-b-15 p-l-5 p-r-5"]')
  Array.from(wrapperDoms)
    .filter(i => {
      const tagsDom = i.querySelector('div[class*="tags"]')
      if (!tagsDom) {
        return false
      }
      const tagsList = tagsDom.textContent.trim().split(/\s+/) || []
      return haveCommonElements(tagsList, ignoreTagList)
    })
    .filter(Boolean)
    .forEach(item => {
      // console.log(i)
      item.parentNode.remove()
    })
}
document.onload = handleTag()
document.onscroll = handleTag()
