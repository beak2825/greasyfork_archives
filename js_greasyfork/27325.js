// ==UserScript==
// @name         百度文库、豆丁网源文档下载
// @namespace    http://nickvico.com
// @version      0.1
// @description  Best Wishes For You!
// @author       NewType
// @match        *://wenku.baidu.com/view/*
// @match        *://*.docin.com/p-*
// @connect      api.itwusun.com
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/27325/%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%E3%80%81%E8%B1%86%E4%B8%81%E7%BD%91%E6%BA%90%E6%96%87%E6%A1%A3%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/27325/%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%E3%80%81%E8%B1%86%E4%B8%81%E7%BD%91%E6%BA%90%E6%96%87%E6%A1%A3%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`.mybtn {
    color: #fff;
    position: fixed;
    top: 0px;
    background: #db5b5a;
    padding: 6px;
    font-size: 14px;
    cursor: pointer;
    z-index: 9999;
}`);

    jQuery('body').append('<div class="mybtn">【下载源文档】</div>');
    jQuery('div.mybtn').click(function() { download(); });

    function download() {
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'http://api.itwusun.com/wenku/urlconvert?format=json&url=' + document.location.href,
            onload: function(r) {
                var json = JSON.parse(r.responseText);
                console.log(json);
                GM_download(json.DownUrl, json.FileName);
            }
        });
    }
})();