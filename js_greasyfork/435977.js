// ==UserScript==
// @name         Baidu
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  屏蔽百度搜索广告
// @author       Chen
// @match        *://www.baidu.com/*
// @icon         https://www.google.com/s2/favicons?domain=tampermonkey.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/435977/Baidu.user.js
// @updateURL https://update.greasyfork.org/scripts/435977/Baidu.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var es = $("span[data-tuiguang]").parents("div");
    for(var i = 0; i<es.length; i++){
        if(!$(es[i]).attr("class") && !$(es[i]).attr("id")){
            $(es[i]).hide();
        }
    }
})();