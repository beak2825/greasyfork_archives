// ==UserScript==
// @name         dlsite下载按钮
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在dlsite的下载页面添加一个批量下载的按钮
// @author       banzhe
// @match        https://www.dlsite.com/*/download/split/*
// @icon         https://www.dlsite.com/favicon.ico
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/455391/dlsite%E4%B8%8B%E8%BD%BD%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/455391/dlsite%E4%B8%8B%E8%BD%BD%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    createButton();
    function createButton(){
        let node = document.getElementsByClassName("work_dl")[0];
        node.innerHTML = "<input type='button' value='download' onclick='window.downloadAll()'>"
    }
    unsafeWindow.downloadAll = function(){
        let url_list = document.getElementsByClassName("btn_dl");
        for(let i=0; i<url_list.length; i++){
            window.open(url_list[i].href);
        }
    };
})();