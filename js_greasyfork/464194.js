// ==UserScript==
// @name         网站集成的作答模式可选
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  默认就打开网站集成下的作答模式。
// @author       任亚军
// @match        https://www.wjx.cn/newwjx/design/sendqstart.aspx?activity=*
// @icon         https://icons.duckduckgo.com/ip2/wjx.cn.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/464194/%E7%BD%91%E7%AB%99%E9%9B%86%E6%88%90%E7%9A%84%E4%BD%9C%E7%AD%94%E6%A8%A1%E5%BC%8F%E5%8F%AF%E9%80%89.user.js
// @updateURL https://update.greasyfork.org/scripts/464194/%E7%BD%91%E7%AB%99%E9%9B%86%E6%88%90%E7%9A%84%E4%BD%9C%E7%AD%94%E6%A8%A1%E5%BC%8F%E5%8F%AF%E9%80%89.meta.js
// ==/UserScript==

(function() {
    document.querySelector("#responseModeWrap").style="display:normal"
})();