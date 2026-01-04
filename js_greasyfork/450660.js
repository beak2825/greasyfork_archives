// ==UserScript==
// @name         夜曲编程Fucker 就是不绑定手机!
// @namespace    https://np.baicizhan.com/
// @version      0.1.1
// @description  try to take over the world!
// @author       Athena
// @match        https://np.baicizhan.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=baicizhan.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/450660/%E5%A4%9C%E6%9B%B2%E7%BC%96%E7%A8%8BFucker%20%E5%B0%B1%E6%98%AF%E4%B8%8D%E7%BB%91%E5%AE%9A%E6%89%8B%E6%9C%BA%21.user.js
// @updateURL https://update.greasyfork.org/scripts/450660/%E5%A4%9C%E6%9B%B2%E7%BC%96%E7%A8%8BFucker%20%E5%B0%B1%E6%98%AF%E4%B8%8D%E7%BB%91%E5%AE%9A%E6%89%8B%E6%9C%BA%21.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload = function(){
    document.querySelectorAll(("[style*='z-index']")).forEach(element => element.style.zIndex > 1000 ? element.setAttribute("style", "display:none") : null)
    }
})();