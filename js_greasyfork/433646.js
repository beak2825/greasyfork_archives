// ==UserScript==
// @name         Google Translator Detect Language
// @namespace    https://www.jeddd.com
// @version      0.3
// @description  谷歌翻译自动跳转，根据查询的语言决定是英译中还是中译英。
// @author       Jed-Z
// @match        https://translate.google.com/*
// @match        https://translate.google.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433646/Google%20Translator%20Detect%20Language.user.js
// @updateURL https://update.greasyfork.org/scripts/433646/Google%20Translator%20Detect%20Language.meta.js
// ==/UserScript==

function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    query = decodeURI(query);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        if(pair[0] == variable) {
            return pair[1];
        }
    }
    return(false);
}

(function() {
    'use strict';
    var cn_threshold = 0.2;

    var text = getQueryVariable("text");
    var sl = getQueryVariable("sl");
    var tl = getQueryVariable("tl");
    if (!text || !sl || !tl) return;

    var total_count = text.length;
    var cn_count = text.match(/[\u4E00-\u9FA5]/g).length;

    if (cn_count / total_count > cn_threshold) {
        var new_sl = "zh-CN";
        var new_tl = "en";
    }
    if (new_sl != sl || new_tl != tl) {
        var url = "https://" + window.location.host + "/?sl=" + new_sl + "&tl=" + new_tl + "&text=" + text + "&op=translate"
        window.location.replace(url);
    }
})();