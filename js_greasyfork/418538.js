// ==UserScript==
// @name         人人影视简介自动展开全文
// @namespace    YYeTs
// @version      1.2
// @description  点击人人影视详情页面简介中的“展开全文”并移除
// @author       Landon Li
// @match        *://www.yysub.cc/resource/*
// @match        *://yysub.cc/resource/*
// @icon         https://favicon.yandex.net/favicon/www.yysub.cc
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418538/%E4%BA%BA%E4%BA%BA%E5%BD%B1%E8%A7%86%E7%AE%80%E4%BB%8B%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%E5%85%A8%E6%96%87.user.js
// @updateURL https://update.greasyfork.org/scripts/418538/%E4%BA%BA%E4%BA%BA%E5%BD%B1%E8%A7%86%E7%AE%80%E4%BB%8B%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%E5%85%A8%E6%96%87.meta.js
// ==/UserScript==

(function() {
    var target = document.getElementsByClassName("f2")[0];
    target.click();
    target.parentNode.removeChild(target);
})();