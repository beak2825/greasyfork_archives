// ==UserScript==
// @name         Anti Bing Redirect
// @namespace    https://github.com/shiquda/shiquda_UserScript
// @supportURL   https://github.com/shiquda/shiquda_UserScript/issues
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bing.com
// @version      0.1.3
// @description  Remove the redirection of Bing Search by replacing the URL provided.
// @author       shiquda
// @match        https://*.bing.com/search?*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/467278/Anti%20Bing%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/467278/Anti%20Bing%20Redirect.meta.js
// ==/UserScript==

(function () {
    'use strict';
    //提取url的被加密字符串并解密
    function decode(url) {
        const regex = /(?<=&u=a1)[^&]*/;
        const match = regex.exec(url);
        if (match) {
            const encodedString = match[0].replace(/-/g, '+').replace(/_/g, '/');
            const decodedString = atob(encodedString);
            return decodedString;
        }
        return null;
    }
    function replaceURLs() {
        //var txt = ""
        const URLs = document.querySelectorAll("a")
        for (var i = 0; i < URLs.length; i++) {
            const rpl = decode(URLs[i].href)
            if (rpl) {
                URLs[i].href = rpl
                //txt += (" " + rpl)
            }
        }
        //console.log(txt)
    }
    replaceURLs()
    //适配自动翻页
    document.querySelector("#b_results").addEventListener('DOMNodeInserted', replaceURLs)

    // Your code here...
})();