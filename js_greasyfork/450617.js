// ==UserScript==
// @name        Mouse quick go.
// @namespace   Mouse quick go.
// @icon        data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEACAYAAABccqhmAAAAAXNSR0IArs4c6QAAAARzQklUCAgICHwIZIgAAAO2SURBVHic7dwxTkNBDEDBfMR96Lh/TZcTLXfASNbqzfRJNs2TG/t5vV7ndbFzrn4+rPrYfgCwRwAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAg7HP6Bdv7+M/zjD6//X7YZAKAMAGAMAGAMAGAMAGAMAGAMAGAMAGAMAGAMAGAMAGAMAGAMAGAMAGAMAGAsPE9gG3TfX73BCgzAUCYAECYAECYAECYAECYAECYAECYAECYAECYAECYAECYAECYAECYAECYAEDYc4YL7fV9+u3/v/373M0EAGECAGECAGECAGECAGECAGECAGECAGECAGECAGECAGECAGECAGECAGECAGGf0y+o77Nv/3+YMAFAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABA2PgewNT2Pr17ApSZACBMACBMACBMACBMACBMACBMACBMACBMACBMACBMACBMACBMACBMACBMACBs/R7A1PY+/fY9AZgwAUCYAECYAECYAECYAECYAECYAECYAECYAECYAECYAECYAECYAECYAECYAEDY9fcApvv8t/8+TJgAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIEwAIOz6ewDnnO0ntH19zz7//vmfd/zV7e8fMgFAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABAmABA2HMs1LdN9+GZWb4nYAKAMAGAMAGAMAGAMAGAMAGAMAGAMAGAMAGAMAGAMAGAMAGAMAGAMAGAMAGAMPcAbmefv214T8AEAGECAGECAGECAGECAGECAGECAGECAGECAGECAGECAGECAGECAGECAGECAGECAGECAGECAGECAGECAGECAGECAGECAGECAGECAGECAGECAGECAGECAGECAGECAGHPOedsP4JFX9/bL2h7/6z+vAkAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwgQAwtwDYKZ+T2B5n3/KBABhAgBhAgBhAgBhAgBhAgBhAgBhAgBhAgBhAgBhAgBhAgBhAgBhAgBhAgBh7gGwa/uewOX7/FMmAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAgTAAhzDwDCTAAQJgAQJgAQJgAQJgAQJgAQJgAQJgAQJgAQJgAQJgAQJgAQJgAQJgAQJgAQ9gvziV/bWLPjLAAAAABJRU5ErkJggg==
// @grant       none
// @run-at      document-start
// @version     1.43.43
// @author      dms
// @description 跳转提示页自动跳转。
// @supportURL  https://meta.appinn.net/t/35958
// @homepageURL https://meta.appinn.net/t/35958
// @match       *://link.zhihu.com/?target=*
// @match       *://link.csdn.net/?target=*
// @match       *://support.qq.com/products/*/link-jump?jump=*
// @match       *://c.pc.qq.com/middle.html?pfurl=*
// @match       *://link.juejin.cn/?target=*
// @match       *://www.jianshu.com/go-wild?*
// @match       *://mail.qq.com/cgi-bin/readtemplate?*
// @match       *://wap.mail.qq.com/xmspamcheck/xmsafejump?*
// @match       *://www.douban.com/link2/?url=*
// @match       *://link.ld246.com/forward?goto=*
// @match       *://redir.yy.duowan.com/warning.php?url=*
// @match       *://steamcommunity.com/linkfilter/?url=*
// @match       *://game.bilibili.com/linkfilter/?url=*
// @match       *://www.oschina.net/action/GoToLink?url=*
// @match       *://developers.weixin.qq.com/community/middlepage/href?href=*
// @match       *://docs.qq.com/scenario/link.html?url=*
// @match       *://www.pixiv.net/jump.php?url=*
// @match       *://www.chinaz.com/go.shtml?url=*
// @match       *://c.pc.qq.com/index.html*
// @match       *://www.yuque.com/r/goto?url=*
// @match       *://www.mcbbs.net/plugin.php?id=link_redirect&target=*
// @match       *://www.360doc.cn/outlink.html?url=*
// @match       *://www.tianyancha.com/security?target=*
// @match       *://afdian.net/link?target=*
// @match       *://gitee.com/link?target=*
// @match       *://xie.infoq.cn/link?target=*
// @match       *://leetcode.cn/link/?target*
// @match       *://blog.51cto.com/transfer?*
// @match       *://weibo.cn/sinaurl?*
// @match       *://www.coolapk.com/link?url=*
// @match       *://vimsky.com/link.php?source=*
// @match       *://www.chinaz.com/go.shtml?url=*
// @match       *://sspai.com/link?target=*
// @match       *://www.kdocs.cn/office/link?target=*
// @match       *://maimai.cn/n/online/link?target=*
// @match       *://cloud.tencent.com/developer/tools/blog-entry?target=*
// @match       *://weixin110.qq.com/cgi-bin/mmspamsupport-bin/newredirectconfirmcgi?*
// @match       *://t.cn/*
// @match       *://jump2.bdimg.com/safecheck/index?url=*
// @match       *://m.smzdm.com/p/*
// @match       *://post.m.smzdm.com/p/*
// @match       *://m.smzdm.com/*
// @match       *://item.m.jd.com/*
// @antifeature referral-link 本脚本会对一些页面进行重定向，前请确认理解【此操作可能带来某些安全隐患】，安装即代表原意自行承担跳转后果。
// @downloadURL https://update.greasyfork.org/scripts/450617/Mouse%20quick%20go.user.js
// @updateURL https://update.greasyfork.org/scripts/450617/Mouse%20quick%20go.meta.js
// ==/UserScript==

(function() {
  'use strict';
  const L = window.location
  const redirectTo = url=>{ 
    L.href = url
    document.title = 'Mouse quick go to: '+url
  }
  const replaceLocation = (inReg, outReg)=>{
    if(inReg.test(L.href)) redirectTo( L.href.replace(inReg, outReg) )
  }
  const redirectLocation = ()=>{
    redirectTo( decodeURIComponent(
      L.search
        .replace(/^.+?(https?(?:%3A|:)(?:%2F%2F|\/\/))/, '$1')
        .replace(/[?&#].*$/, '')
    ))
  }
  const redirectByElementContent = (selector, Attr='innerText')=>{
    const elHandler = ()=>{
      const el = document.body.querySelector(selector)
      if(el && /^https?:\/\/.*/.test(el[Attr])){
        redirectTo(el.innerText)
      }
    }
    window.addEventListener('DOMContentLoaded', elHandler)
    window.addEventListener('load', elHandler)
    elHandler()
  }
  const rules = {
    'm.smzdm.com': {
      method: replaceLocation,
      params: [ /\/\/(post\.)?m\./, '//$1' ],
      alias: [ 'post.m.smzdm.com' ]
    },
    'item.m.jd.com': {
      method: replaceLocation,
      params: [
        /^.*\/(?:product\/|ware\/view\.action\?.*wareId=)(\d+).*$/i,
        'https://item.jd.com/$1.html'
      ]
    },
    're.jd.com': {
      method: replaceLocation,
      params: [
        /^.*\/cps\/item\/(\d+)\.html.*$/i, 'https://item.jd.com/$1.html'
      ]
    },
    't.cn': {
      method: redirectByElementContent,
      params: [ 'p.link, div.desc' ],
    },
    'weixin110.qq.com': {
      tester: ()=> L.pathname === '/cgi-bin/mmspamsupport-bin/newredirectconfirmcgi',
      method: redirectByElementContent,
      params: [ 'p.weui-msg__desc' ],
    },
    'jump2.bdimg.com': {
      tester: ()=> L.pathname === '/safecheck/index',
      method: redirectByElementContent,
      params: [ 'p.link' ],
    },
    'defaultRule': {
      tester: ()=>/^.+https?(?:%3A|:)(?:%2F%2F|\/\/)/i.test(L.href),
      method: redirectLocation
    }
  }
  for(const name in rules){
    const r = rules[name]
    if(r.alias){
      r.alias.forEach(n=>{
        rules[n] = r
      })
    }
  }
  const rule = rules[L.hostname] ? rules[L.hostname] : rules.defaultRule
  if(rule.tester && (!rule.tester())) return
  rule.method.apply(null, rule.params)
})()
