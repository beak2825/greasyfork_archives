// ==UserScript==
// @name         blivedm-recover
// @namespace    http://tampermonkey.net/
// @version      1.0.7
// @description  恢复B站直播弹幕
// @author       xfgryujk
// @license      MIT
// @include      /https?:\/\/live\.bilibili\.com\/?\??.*/
// @include      /https?:\/\/live\.bilibili\.com\/\d+\??.*/
// @include      /https?:\/\/live\.bilibili\.com\/(blanc\/)?\d+\??.*/
// @run-at       document-start
// @require      https://fastly.jsdelivr.net/gh/google/brotli@5692e422da6af1e991f9182345d58df87866bc5e/js/decode.js
// @require      https://greasyfork.org/scripts/417560-bliveproxy/code/bliveproxy.js?version=984333
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/383826/blivedm-recover.user.js
// @updateURL https://update.greasyfork.org/scripts/383826/blivedm-recover.meta.js
// ==/UserScript==

(function () {
  bliveproxy.addCommandHandler('DANMU_MSG', command => {
    let params = command.cmd.split(':')
    if (params.length > 4) {
      params[4] = '0' // 和谐级别，0都发，1不发评论，2不发弹幕，3都不发
      command.cmd = params.join(':')
    }
  })
})();
