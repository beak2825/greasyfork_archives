// ==UserScript==
// @name         全局思源宋体
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  改变网页字体，中文使用思源宋体，英文使用Georgia。
// @author       Ajiao
// @match          *://*/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/494606/%E5%85%A8%E5%B1%80%E6%80%9D%E6%BA%90%E5%AE%8B%E4%BD%93.user.js
// @updateURL https://update.greasyfork.org/scripts/494606/%E5%85%A8%E5%B1%80%E6%80%9D%E6%BA%90%E5%AE%8B%E4%BD%93.meta.js
// ==/UserScript==
//GM_addStyle("@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@500;700&display=swap');")
//GM_addStyle("@import url('https://font.sec.miui.com/font/css?family=Source_Han_Serif:400,600:Source_Han_Serif');")
GM_addStyle("@import url('https://fonts.loli.net/css2?family=Noto+Serif+SC:wght@500;700&display=swap');")
GM_addStyle("*{font-family:'Georgia', 'Source_Han_Serif','Noto Serif SC', sans-serif;}");

(function() {
    'use strict';

    // Your code here...
})();