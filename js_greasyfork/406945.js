// ==UserScript==
// @name          无须确认，直接跳转
// @namespace     Don't confirm, just redirect.
// @match         *://none/
// @grant         none
// @version       0.0.3
// @author        -
// @description   让链接跳转提示自动跳转
// @downloadURL https://update.greasyfork.org/scripts/406945/%E6%97%A0%E9%A1%BB%E7%A1%AE%E8%AE%A4%EF%BC%8C%E7%9B%B4%E6%8E%A5%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/406945/%E6%97%A0%E9%A1%BB%E7%A1%AE%E8%AE%A4%EF%BC%8C%E7%9B%B4%E6%8E%A5%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==
const rules = [
  { // Weibo
    reg: /^https?:\/\/t.cn\/\w+/i,
    isit: () => { return document.body.querySelectorAll('p').length === 2 && document.body.querySelectorAll('p.link').length === 1 },
    link: () => { return document.body.querySelector('p.link').innerText }
  },
  { // Other
    reg: /https?%3A(?:%2F%2F|\/\/)/i,
    isit: true,
    link: ()=>{ return decodeURIComponent(
      window.location.search
        .replace(/^.*?(https?%3A(?:%2F%2F|\/\/))/, '$1')
        .replace(/&.*$/, '')
    ) }
  }
]
for(const rule of rules){
  if(rule.reg.test(window.location.href)){
    if(rule.isit()){
      window.location.href = rule.link()
    }
    break;
  }
}
