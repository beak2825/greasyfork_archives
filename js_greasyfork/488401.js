// ==UserScript==
// @name         知乎，关闭登录页面
// @description  未登录状态下访问知乎页面，关闭知乎的登录页面
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://*.zhihu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zhihu.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/488401/%E7%9F%A5%E4%B9%8E%EF%BC%8C%E5%85%B3%E9%97%AD%E7%99%BB%E5%BD%95%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/488401/%E7%9F%A5%E4%B9%8E%EF%BC%8C%E5%85%B3%E9%97%AD%E7%99%BB%E5%BD%95%E9%A1%B5%E9%9D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    setTimeout( () =>{
        let b = document.getElementsByClassName("Button Modal-closeButton Button--plain")
        if(b.length){
            b[0].click()
        }
    }, 500
)
})();