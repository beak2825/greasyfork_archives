// ==UserScript==
// @name        Go to the page which i want.
// @namespace   Go to the page which i want.
// @icon        https://i.v2ex.co/IY7K141dl.png
// @grant       none
// @run-at      document-start
// @inject-into content
// @version     1.0.2
// @author      稻米鼠
// @description 本脚本会对一些页面进行重定向，安装前请确认理解【此操作可能带来某些安全隐患】，并愿意自行承担由此造成的一切后果。
// @supportURL  https://meta.appinn.net/t/21266
// @homepageURL https://meta.appinn.net/t/21266
// @match       *://*.m.smzdm.com/p/*
// @match       *://m.smzdm.com/*
// @match       *://t.cn/*
// @match       *://link.zhihu.com/?target=*
// @match       *://weixin110.qq.com/cgi-bin/mmspamsupport-bin/newredirectconfirmcgi?*
// @match       *://c.pc.qq.com/middle.html*
// @match       *://item.m.jd.com/*
// @match       *://www.jianshu.com/go-wild*
// @match       *://mail.qq.com/cgi-bin/readtemplate*
// @downloadURL https://update.greasyfork.org/scripts/419399/Go%20to%20the%20page%20which%20i%20want.user.js
// @updateURL https://update.greasyfork.org/scripts/419399/Go%20to%20the%20page%20which%20i%20want.meta.js
// ==/UserScript==
// Variables
const L = window.location
// Redirect to new URL
const redirectTo = url=>{ L.href = url }
// Replace something from URL
const replaceLocation = (inReg, outReg)=>{
  redirectTo( L.href.replace(inReg, outReg) )
}
// Redirect to a sub Url which in now Url
const redirectLocation = ()=>{
  redirectTo( decodeURIComponent(
    L.search
      .replace(/^.*?(https?%3A(?:%2F%2F|\/\/))/, '$1')
      .replace(/[?&#].*$/, '')
  ))
}
// Redirect based on element content
const redirectByElementContent = selsector=>{
  window.addEventListener('load', ()=>{
    const el = document.body.querySelector(selsector)
    if(el && /^https?:\/\/.*/.test(el.innerText)){
      redirectTo(el.innerText)
    }
  })
}
// rules
const rules = [
  { // smzdm mobile to PC
    reg: /^https?:\/\/(post\.)?m\.smzdm\.com\//i,
    redirect: ()=>{ replaceLocation(/\/\/(post\.)?m\./, '//$1') }
  },
  {/* JD mobile to PC */
    reg: /^https?:\/\/item\.m\.jd\.com\/(?:product\/|ware\/view\.action\?.*wareId=)(\d+).*$/i,
    redirect: ()=>{ replaceLocation(/^https?:\/\/item\.m\.jd\.com\/(?:product\/|ware\/view\.action\?.*wareId=)(\d+).*$/i, 'https://item.jd.com/$1.html') }
  },
  {/* JD hot sell */
    reg: /^http(?:s)?:\/\/re\.jd\.com\/cps\/item\/(\d+)\.html.*$/i,
    redirect: ()=>{ replaceLocation(/^http(?:s)?:\/\/re\.jd\.com\/cps\/item\/(\d+)\.html.*$/i, 'https://item.jd.com/$1.html') }
  },
  { // Weibo offsite link
    reg: /^https?:\/\/t.cn\/\w+/i,
    redirect: () => { redirectByElementContent('p.link, div.desc') }
  },
  { // WeChat blocking address auto redirect
    reg: /^https?:\/\/weixin110\.qq\.com\/cgi-bin\/mmspamsupport-bin\/newredirectconfirmcgi\?/,
    redirect: () => { redirectByElementContent('p.weui-msg__desc') }
  },
  { // All jumps to intermediate pages (destination address is included in the URL)
    reg: /https?%3A(?:%2F%2F|\/\/)/i,
    redirect: ()=>{ redirectLocation() }
  }
]
for(const rule of rules){
  if(rule.reg.test(L.href)){
    rule.redirect()
    break
  }
}