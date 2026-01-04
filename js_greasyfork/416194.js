// ==UserScript==
// @name        给我聚焦
// @namespace   Focus it pls
// @match       https://m.weibo.cn/search
// @grant       none
// @version     0.0.1
// @author      稻米鼠
// @run-at      document-end
// @created     2020/11/11 上午8:28:17
// @update      2020/11/11 上午8:28:17
// @description 让页面的主输入框自动获取焦点
// @downloadURL https://update.greasyfork.org/scripts/416194/%E7%BB%99%E6%88%91%E8%81%9A%E7%84%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/416194/%E7%BB%99%E6%88%91%E8%81%9A%E7%84%A6.meta.js
// ==/UserScript==
const rules = [
  {
    urlReg: /^https?:\/\/m\.weibo\.cn\/search/i,
    elSelector: '#app input[type=search]'
  }
]
const focusIt = (elSelector, times)=>{
  times = times ? times : 0
  const el = document.body.querySelector(elSelector)
  if(el){
    el.focus()
    return
  }
  if(times < 1000){
    times++
    window.setTimeout(()=>{
      focusIt(elSelector, times)
    }, 500)
  }
}
for(const rule of rules){
  if(rule.urlReg.test(window.location.href)){
    focusIt(rule.elSelector, rule.mode)
    break;
  }
}