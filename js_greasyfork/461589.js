// ==UserScript==
// @name         OuterChainJump
// @namespace    cityTS
// @version      0.1.4
// @description  自动跳转外链
// @author       cityTS
// @match        *://link.zhihu.com/?target=*
// @match        *://link.juejin.cn/?target=*
// @match        *://www.jianshu.com/go-wild?ac=2&url=*
// @match        *://c.pc.qq.com/middlem.html?pfurl=*
// @match        *://gitee.com/link?target=*
// @match        *://link.csdn.net/?target=*
// @match        *://docs.qq.com/scenario/link.html?url=*
// @match        *://www.kdocs.cn/office/link?target=*
// @match        *://mail.qq.com/cgi-bin/readtemplate*
// @match        *://hd.nowcoder.com/link.html?target=*
// @icon         https://img.picgo.net/2023/03/10/R-Ccac3d9a7c5c66076.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/461589/OuterChainJump.user.js
// @updateURL https://update.greasyfork.org/scripts/461589/OuterChainJump.meta.js
// ==/UserScript==

// 各大网站跳转页面中url的跳转参数名
const siteJumpParamMap = new Map([
  ['link.zhihu.com','target'],
  ['link.csdn.net','target'],
  ['link.juejin.cn','target'],
  ['gitee.com','target'],
  ['www.jianshu.com','url'],
  ['c.pc.qq.com','pfurl'],
  ['docs.qq.com', 'url'],
  ['www.kdocs.cn', 'target'],
  ['mail.qq.com', 'gourl'],
  ['hd.nowcoder.com', 'target']
]);

(function() {
    'use strict';

    // 清空页面原有内容，防闪烁(非必须)
    window.document.documentElement.innerHTML=''
    // 获取URL中的请求参数
    const params = new URLSearchParams(location.search.substring(1));
    // 获取该网站的的跳转URL的参数名，进而获取目标URL
    const targetURL = params.get(siteJumpParamMap.get(location.hostname));
    // 利用replace()方法进行跳转,保证无用的跳转页面不会产生在历史记录中
    location.replace(targetURL);
})();