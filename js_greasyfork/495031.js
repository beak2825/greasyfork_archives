// ==UserScript==
// @name         Title显示用户
// @namespace    Akso
// @description  Title显示已登录的用户
// @license      MIT
// @version      0.09
// @author       李海林
// @match        http://*/*
// @match        https://*/*
// @icon         https://ycosd-config.aksoegmp.com/favicon.ico
// @grant        none
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/495031/Title%E6%98%BE%E7%A4%BA%E7%94%A8%E6%88%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/495031/Title%E6%98%BE%E7%A4%BA%E7%94%A8%E6%88%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(function(){
        let dom=document.querySelector("#root > header > div.header_QZ9Sk > div.user-info_Gu4hn > a:nth-child(4)");
        if(dom!=undefined){document.title=dom.text;}
    },1000)
    })();