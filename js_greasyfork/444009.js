// ==UserScript==
// @name         微信读书自动阅读
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  web微信读书自动阅读
// @author       mkg
// @match        *://weread.qq.com/web/reader/*
// @icon         https://rescdn.qqmail.com/node/wr/wrpage/style/images/independent/favicon/favicon_32h.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/444009/%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%E8%87%AA%E5%8A%A8%E9%98%85%E8%AF%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/444009/%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%E8%87%AA%E5%8A%A8%E9%98%85%E8%AF%BB.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let currentTop = document.documentElement.scrollTop;
    var time = setInterval(()=>{
    window.scroll(0 ,++currentTop)
    },20)
    var tem_nmu = 0


    document.onclick = function(){
        if (tem_nmu%2==0)
        {
            clearInterval(time)
                ++tem_nmu

        }
        else
        {
            time = setInterval(()=>{
                window.scroll(0 ,++currentTop)
            },20)
                ++tem_nmu

        }
}
})();