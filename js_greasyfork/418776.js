// ==UserScript==
// @name         [HAN] 让枪炮世界的图变大点！
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  枪炮世界的图也太小了，都什么年代了还是ADSL的老样式。。
// @author       hanfly
// @match        *://pewpewpew.work/*
// @icon         https://keylol.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418776/%5BHAN%5D%20%E8%AE%A9%E6%9E%AA%E7%82%AE%E4%B8%96%E7%95%8C%E7%9A%84%E5%9B%BE%E5%8F%98%E5%A4%A7%E7%82%B9%EF%BC%81.user.js
// @updateURL https://update.greasyfork.org/scripts/418776/%5BHAN%5D%20%E8%AE%A9%E6%9E%AA%E7%82%AE%E4%B8%96%E7%95%8C%E7%9A%84%E5%9B%BE%E5%8F%98%E5%A4%A7%E7%82%B9%EF%BC%81.meta.js
// ==/UserScript==

(function() {
    var head = document.getElementsByTagName("body")[0].innerHTML
    //document.getElementsByTagName("body")[0].innerHTML=head.replaceAll('_small.jpg', '.jpg')
    document.getElementsByTagName("body")[0].innerHTML=head.replaceAll('_small', '')
    // Your code here...
})();