// ==UserScript==
// @name         知网搜索修复
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  修复知网更新后不能通过 url params 进行搜索的问题
// @author       Cesaryuan
// @match        https://epub.cnki.net/kns/brief/default_result.aspx*
// @match        https://kns.cnki.net/kns8/defaultresult/index*
// @icon         https://www.google.com/s2/favicons?domain=cnki.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/451996/%E7%9F%A5%E7%BD%91%E6%90%9C%E7%B4%A2%E4%BF%AE%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/451996/%E7%9F%A5%E7%BD%91%E6%90%9C%E7%B4%A2%E4%BF%AE%E5%A4%8D.meta.js
// ==/UserScript==
(function () {
    'use strict';
    // get query dict
    let queryDict = new URL(window.location.href).searchParams;
    let query = queryDict.get("txt_1_value1");
    window.addEventListener("load", function () {
        let host = window.location.host;
        if (host == "epub.cnki.net") {
            let inputEle = document.querySelector("#txt_1_value1");
            let searchBtn = document.querySelector("#btnSearch");
            inputEle.value = query;
            searchBtn.click();
        }
        else if (host == "kns.cnki.net") {
            let inputEle = document.querySelector("#txt_search");
            let searchBtn = document.querySelector("body > div.search-box > div > div.search-main > div.input-box > input.search-btn");
            inputEle.value = query;
            searchBtn.click();
        }
        else {
            console.log("油猴脚本-知网搜索修复：未知的 host");
        }
    });
})();
