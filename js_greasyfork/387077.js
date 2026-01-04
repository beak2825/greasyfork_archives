// ==UserScript==
// @name         放大runoob的字体
// @namespace    runoob
// @version      0.3
// @description  更改runoob的样式
// @author       ss
// @match        https://www.runoob.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387077/%E6%94%BE%E5%A4%A7runoob%E7%9A%84%E5%AD%97%E4%BD%93.user.js
// @updateURL https://update.greasyfork.org/scripts/387077/%E6%94%BE%E5%A4%A7runoob%E7%9A%84%E5%AD%97%E4%BD%93.meta.js
// ==/UserScript==
(function() {
    'use strict';
    $('.fivecol.last.right-column').css({"display":"none"});
    $('.col.middle-column').css({"width":"84%"});
    $('.article-body .article-intro p').css({"font-size":"18px"});
    $('.article-body pre').css({"font-size":"14px","line-height":"22px"});
})();