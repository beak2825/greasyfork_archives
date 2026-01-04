// ==UserScript==
// @name         库库直播间真原画
// @namespace    http://tampermonkey.net/
// @version      0.1
// @homepageURL  https://blog.csdn.net/andy5434374/article/details/107886036
// @description  移除fetch中含有_bluray字段的内容，以对抗阿姨的假原画。
// @author       Qiuyue
// @license      GPLv3
// @match        https://live.bilibili.com/5194110
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @run-at       document-start
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/449730/%E5%BA%93%E5%BA%93%E7%9B%B4%E6%92%AD%E9%97%B4%E7%9C%9F%E5%8E%9F%E7%94%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/449730/%E5%BA%93%E5%BA%93%E7%9B%B4%E6%92%AD%E9%97%B4%E7%9C%9F%E5%8E%9F%E7%94%BB.meta.js
// ==/UserScript==

(function() {
const originFetch = fetch;
unsafeWindow.fetch = (...arg) => {
    // console.log('fetch arg', ...arg);
    if (arg[0].indexOf('_bluray') > -1 && arg[0].indexOf('m3u8')) {
        arg[0] = arg[0].replace(/_bluray/,"")
        // console.log('拦截直播流')
        return originFetch(... arg);
    } else {
        // console.log('通过')
        return originFetch(...arg);
    }
}
    // Your code here...
})();