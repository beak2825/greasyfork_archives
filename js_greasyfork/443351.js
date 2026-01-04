// ==UserScript==
// @name         A姐分享 页面优化
// @namespace    https://greasyfork.org/en/scripts/443351
// @version      0.4
// @description  解除复制限制
// @author       zhenhappy<q505507538@gmail.com>
// @match        https://*.abskoop.com/*/
// @match        https://*.ahhhhfs.com/*/
// @icon         https://www.abskoop.com/wp-content/uploads/2021/07/1625221481-04bb5153c0db541-192x192.webp
// @require      https://unpkg.com/jquery/dist/jquery.slim.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/443351/A%E5%A7%90%E5%88%86%E4%BA%AB%20%E9%A1%B5%E9%9D%A2%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/443351/A%E5%A7%90%E5%88%86%E4%BA%AB%20%E9%A1%B5%E9%9D%A2%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    $('body').css("cssText", "-moz-user-select: auto !important; -webkit-user-select: auto !important; -ms-user-select: auto !important; -khtml-user-select: auto !important; user-select: auto !important")
    setInterval(function () {
        if (document.ondragstart !== null) document.ondragstart = null
        if (document.onselectstart !== null) document.onselectstart = null
        if (document.onbeforecopy !== null) document.onbeforecopy = null
        if (document.onmouseup !== null) document.onmouseup = null
        if (document.onselect !== null) document.onselect = null
        if (document.oncopy !== null) document.oncopy = null
    }, 500)
})();
