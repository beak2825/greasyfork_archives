// ==UserScript==
// @name         取消跳转拦截
// @namespace    https://bbs.tampermonkey.net.cn/
// @version      2.7.2
// @description  取消网站跳转拦截
// @author       冰冻大西瓜
// @license      GPLv3
// @match        https://link.juejin.cn/?target=*
// @match        https://c.pc.qq.com/*
// @match        http(s?)://link.zhihu.com/?target=*
// @match        https://link.csdn.net/?target=*
// @match        https://weixin110.qq.com/cgi-bin/mmspamsupport-bin/newredirectconfirmcgi?click=*
// @note         更新微信110拦截
// @downloadURL https://update.greasyfork.org/scripts/475858/%E5%8F%96%E6%B6%88%E8%B7%B3%E8%BD%AC%E6%8B%A6%E6%88%AA.user.js
// @updateURL https://update.greasyfork.org/scripts/475858/%E5%8F%96%E6%B6%88%E8%B7%B3%E8%BD%AC%E6%8B%A6%E6%88%AA.meta.js
// ==/UserScript==

// 跳转实现
/**
 * @description 实现网页自动跳转
 * @param {string} regular 处理规则
 * @return {string} window.location.href:跳转后的URL
 */
const jumpUrl = regular => {
  if (!regular) return
  // 判断是否为正则表达式
  if (regular instanceof RegExp) {
    const result = urlInfo.href.match(regular)
    if (result) window.location.href = decodeURIComponent(result[1])
  } else if (regular.constructor === Object) {
    // 处理腾讯拦截,有多种拦截URL,做单独处理
    if (urlInfo.href.includes('pfurl')) {
      const result = urlInfo.href.match(regular.pfurl)
      console.log('pfurl: ', result)
      if (result) window.location.href = decodeURIComponent(result[1])
    } else if (urlInfo.href.includes('ios.html')) {
      const result = urlInfo.href.match(regular.sublevel)
      console.log('ios.html: ', result)
      if (result) window.location.href = decodeURIComponent(result[1])
    }
  } else {
    const url = document.querySelector(regular).textContent
    if (url) {
      window.location.href = url
    } else {
      console.log('网址被强力屏蔽,无法解析')
    }
  }
}

// 配置项
const domain = {
  'c.pc.qq.com': { pfurl: /pfurl=(.*)&pfuin/, sublevel: /&url=(.*)&sublevel/ },
  'link.zhihu.com': /target=(.*)/,
  'link.juejin.cn': /target=(.*)/,
  'link.csdn.net': /target=(.*)/,
  'weixin110.qq.com': '.ui-ellpisis-content p',
}

// 程序入口
const urlInfo = window.location
const regular = domain[urlInfo.hostname] || null
jumpUrl(regular)
