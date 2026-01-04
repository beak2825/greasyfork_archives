// ==UserScript==
// @name         Paradox Plaza 降低对比度
// @namespace    https://gqqnbig.me
// @version      0.1
// @description  去除forum.paradoxplaza.com帖子的黑色背景
// @author       gqqnbig
// @match        https://forum.paradoxplaza.com/forum/index.php?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38179/Paradox%20Plaza%20%E9%99%8D%E4%BD%8E%E5%AF%B9%E6%AF%94%E5%BA%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/38179/Paradox%20Plaza%20%E9%99%8D%E4%BD%8E%E5%AF%B9%E6%AF%94%E5%BA%A6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    for(var i=0;i<document.styleSheets.length;i++)
    {
        if(!document.styleSheets[i].rules)
            continue;
        for(var j=0;j<document.styleSheets[i].rules.length;j++)
        {
            if(document.styleSheets[i].rules[j].selectorText &&
               document.styleSheets[i].rules[j].selectorText.trim()===".paradox_developer_message_test .primaryContent")
            {
                document.styleSheets[i].rules[j].style.removeProperty("background-color");
                return;
            }
        }
    }
})();