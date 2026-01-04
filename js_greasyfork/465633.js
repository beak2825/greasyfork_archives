// ==UserScript==
// @name         apis
// @namespace    aapilib
// @version      0.1.5
// @description  a api library
// @author       Wilson
// @match        *://*/*
// @license      GPL License
// @downloadURL https://update.greasyfork.org/scripts/465633/apis.user.js
// @updateURL https://update.greasyfork.org/scripts/465633/apis.meta.js
// ==/UserScript==



//每日一言
async function yiyan(callback) {
    var response = await fetch("https://v.api.aa1.cn/api/yiyan/index.php");
    response = await response.text();
    callback(response);
}

//热搜
async function hotSearch(callback, type) {
    type = type || 'json';
    var response = await fetch("https://wilson.lovestoblog.com/hot_search.php?type="+type);
    if (type == 'json') {
        response = await response.json();
    } else {
        response = await response.text();
    }
    callback(response);
}