// ==UserScript==
// @name         【自用】改变notion的Outline宽度
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  改变notion的Outline宽度
// @author       You
// @match        https://www.notion.so/*
// @icon         https://tse1-mm.cn.bing.net/th/id/OIP-C.rhLmKYseCNv6x-0OjVB97AHaEK?w=306&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/449728/%E3%80%90%E8%87%AA%E7%94%A8%E3%80%91%E6%94%B9%E5%8F%98notion%E7%9A%84Outline%E5%AE%BD%E5%BA%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/449728/%E3%80%90%E8%87%AA%E7%94%A8%E3%80%91%E6%94%B9%E5%8F%98notion%E7%9A%84Outline%E5%AE%BD%E5%BA%A6.meta.js
// ==/UserScript==

(function() {
    'use strict';

     let css = document.querySelector(':root')
     css.style.setProperty('--outlineWidth', "220px")



    // Your code here...
})();