// ==UserScript==
// @name         google学术替换网址脚本
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  本脚本用于替换第三方google学术的链接，将被修改过的链接替换为原始网站的链接!
// @author       CG
// @match        https://*.glgoo.top/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392045/google%E5%AD%A6%E6%9C%AF%E6%9B%BF%E6%8D%A2%E7%BD%91%E5%9D%80%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/392045/google%E5%AD%A6%E6%9C%AF%E6%9B%BF%E6%8D%A2%E7%BD%91%E5%9D%80%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var hrefs = document.querySelectorAll('a');
    var i, href;
    for (i = 0; i < hrefs.length; i += 1)
    {
        href = hrefs[i];
        console.log(href);
        if (href.href.indexOf(".xilesou.top") != -1 )
        {
            if (href.href.indexOf("rsc") != -1 )
            {
               href.href=href.href.replace(".xilesou.top",".org");
            }
            else
            {
               href.href=href.href.replace(".xilesou.top",".com");
             }
            
            href.href=href.href.replace("_",".");
        }
    }
})();