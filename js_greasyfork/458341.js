// ==UserScript==
// @name        阳光电影广告杀手
// @namespace   Ygdy Ad Killer
// @match       https://www.dytt8.net/*
// @grant       none
// @version     1.1
// @author      MrZhang365
// @description 该脚本可以移除阳光电影网站上的部分广告
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/458341/%E9%98%B3%E5%85%89%E7%94%B5%E5%BD%B1%E5%B9%BF%E5%91%8A%E6%9D%80%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/458341/%E9%98%B3%E5%85%89%E7%94%B5%E5%BD%B1%E5%B9%BF%E5%91%8A%E6%9D%80%E6%89%8B.meta.js
// ==/UserScript==

const badClassNames = ['jjjjasdasd','hmcakes11','hmcakes123','hmcakes112']
const badIDs = ['HMRichBox','hbidbox','mp4richtourl','ccc123']
function main(){
  badClassNames.forEach((name) => {
    var badElements = document.getElementsByClassName(name)
    if (badElements === null){
      return
    }
    var i = 0
    for (i = 0;badElements.length !== 0;i){
      badElements[i].parentElement.removeChild(badElements[i])
    }
  })

  badIDs.forEach((id) => {
    var badElement = document.getElementById(id)
    if (badElement === null){
      return
    }
    badElement.parentElement.removeChild(badElement)
  })
}

window.onload = setTimeout(main,500)