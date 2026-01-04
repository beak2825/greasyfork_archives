// ==UserScript==
// @name         屏蔽B站直播表情弹幕
// @namespace    https://gist.github.com/ch3cknull/a4ae3d6dcc4ab0b59cc7407ee5a5b737
// @version      0.4
// @description  干掉b站直播间新的啥比表情|cr你妈妈死啦！
// @include      /https?:\/\/live\.bilibili\.com\/[blanc\/]?[^?]*?\d+\??.*/
// @author       ch3cknull
// @modified by  oldking139(仅为脚本引擎修改)
// @match        https://gist.github.com/ch3cknull/a4ae3d6dcc4ab0b59cc7407ee5a5b737
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/436059/%E5%B1%8F%E8%94%BDB%E7%AB%99%E7%9B%B4%E6%92%AD%E8%A1%A8%E6%83%85%E5%BC%B9%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/436059/%E5%B1%8F%E8%94%BDB%E7%AB%99%E7%9B%B4%E6%92%AD%E8%A1%A8%E6%83%85%E5%BC%B9%E5%B9%95.meta.js
// ==/UserScript==

(function() {
  window.onload = () => {
    const style = ".bilibili-danmaku.mode-roll img {display:none;}"
    const element = document.createElement('style')
    element.innerText = style
    document.body.appendChild(element)
  }
})();