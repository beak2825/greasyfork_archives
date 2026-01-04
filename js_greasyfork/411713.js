// ==UserScript==
// @name         12321举报垃圾信息,自动同意,不等60秒
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       CutWaterFlow
// @match        https://www.12321.cn/notifyHomePhone
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411713/12321%E4%B8%BE%E6%8A%A5%E5%9E%83%E5%9C%BE%E4%BF%A1%E6%81%AF%2C%E8%87%AA%E5%8A%A8%E5%90%8C%E6%84%8F%2C%E4%B8%8D%E7%AD%8960%E7%A7%92.user.js
// @updateURL https://update.greasyfork.org/scripts/411713/12321%E4%B8%BE%E6%8A%A5%E5%9E%83%E5%9C%BE%E4%BF%A1%E6%81%AF%2C%E8%87%AA%E5%8A%A8%E5%90%8C%E6%84%8F%2C%E4%B8%8D%E7%AD%8960%E7%A7%92.meta.js
// ==/UserScript==

(function() {
    let el = document.getElementById('btnAgree')
    el.removeAttribute('disabled')
    el.click()
    // Your code here...
})();