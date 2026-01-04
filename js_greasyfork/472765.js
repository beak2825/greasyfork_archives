// ==UserScript==
// @name         BaiduGreener
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  make Baidu Green
// @match        https://*.baidu.com/*
// @author       VNVILE
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/472765/BaiduGreener.user.js
// @updateURL https://update.greasyfork.org/scripts/472765/BaiduGreener.meta.js
// ==/UserScript==
var idList = ['novel-ranking', 'celebrity', 'j_navtab_game', 'moreConfigNavtab','s_main'];
var classList = ['.tbui_aside_float_bar', '.app_download_box', '.topic_list_box', '.more-config-navtab.j_tbnav_tab',];


(function() {
    'use strict';
    clearById(idList);
    clearByClass(classList);

})();





function clearById(idList) {
    for (let i in idList) {
        try {
            document.getElementById(idList[i]).style.cssText = 'display: none';
            console.log(i + ' DEL(byId): ' + idList[i]);
        } finally {
            continue;
        }

    }
}
function clearByClass(classList) {
    for (let i in classList) {
        try {
            document.querySelector(classList[i]).style.cssText = 'display: none';
            console.log(i + ' DEL(byClass): ' + classList[i]);
        } finally {
            continue;
        }
    }

}


