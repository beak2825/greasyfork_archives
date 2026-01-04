// ==UserScript==
// @name         ArXiv 自动展开摘要 | ArXiv automatically expands abstract
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  ArXiv 自动展开摘要
// @author       HuanZhi
// @match        *://arxiv.org/search/*
// @grant        none
// @license      AGPL License
// @downloadURL https://update.greasyfork.org/scripts/487169/ArXiv%20%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%E6%91%98%E8%A6%81%20%7C%20ArXiv%20automatically%20expands%20abstract.user.js
// @updateURL https://update.greasyfork.org/scripts/487169/ArXiv%20%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%E6%91%98%E8%A6%81%20%7C%20ArXiv%20automatically%20expands%20abstract.meta.js
// ==/UserScript==
(function() {
    var more = $("a:contains(More)");
    for(var i = 0; i < more.length; i++) {
        more[i].click();
}
})();