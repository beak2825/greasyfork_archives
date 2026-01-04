// ==UserScript==
// @name                  external-link-auto-jump
// @name:zh-CN         外链自动跳转
// @namespace    https://github.com/Seven-Steven/tampermonkey-scripts/tree/main/external-link-auto-jump
// @version      1.4.1.1
// @description  auto jump to external link without double check
// @description:zh-CN  外链自动跳转
// @author       Seven-Steven
// @match        *://link.zhihu.com/?target=*
// @match        *://www.oschina.net/action/GoToLink?url=*
// @match        *://link.csdn.net/?target=*
// @match        *://gitee.com/link?target=*
// @match        *://link.juejin.cn/?target=*
// @match        *://mail.qq.com/cgi-bin/readtemplate?*
// @match        *://www.jianshu.com/go-wild?ac=2&url=*
// @icon         data:image/png;base64,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
// @grant        none
// @license      MIT
// @supportURL https://github.com/Seven-Steven/tampermonkey-scripts/issues
// @downloadURL https://update.greasyfork.org/scripts/453403/external-link-auto-jump.user.js
// @updateURL https://update.greasyfork.org/scripts/453403/external-link-auto-jump.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 获取跳转目标 url
  function getTarget() {
    // 提取 queryParam 字符串
    let search = window.location.search;
    // 获取 http 字符串的 index
    let subIndex = search.indexOf('http');
    // 获取多余的参数的 index
    let surplusIndex = search.indexOf('&', subIndex);
    // 提取跳转目标字符串
    let encodedTarget = surplusIndex === -1 ? search.substring(subIndex) : search.substring(subIndex, surplusIndex);
    // URI 解码
    let target = decodeURIComponent(encodedTarget);
    return target;
  }

  function jump(url) {
    if (!url) {
      return;
    }

    window.location.href = url;
  }

  jump(getTarget());
})();