// ==UserScript==
// @name         综合中台
// @namespace    http://tampermonkey.net/
// @version      2024-05-21
// @description  综合中台增强
// @author       You
// @match        *://zhzt-test.igfax.net/*
// @match        *://portal.igfax.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cnblogs.com
// @grant        GM_setClipboard
// @grant        unsafeWindow
// @noframes
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/499568/%E7%BB%BC%E5%90%88%E4%B8%AD%E5%8F%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/499568/%E7%BB%BC%E5%90%88%E4%B8%AD%E5%8F%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    unsafeWindow.copyUrlSuffix = function (idx){
        let urlSuffix = getUserUrlSuffix(idx);
        if(urlSuffix){
            let url = "https://"+unsafeWindow.location.host+"/#/"+urlSuffix;
            GM_setClipboard(url);
            alert("复制成功,直接去粘贴吧!\n\n"+url)
        }
    }

    function getUserUrlSuffix(idx){
        let _user = unsafeWindow._PAGE_DATA.content.records[idx];
        return _user.urlSuffix;
    }

    function renderPageData(){
        $('.appenCopy').remove();
        for (var table of $(".el-table__body")){
            let i = 0;
            for (var tr of $(table).find("tr")) {
                if(getUserUrlSuffix(i)){
                    var lastTd = $(tr).find("td:last");
                    $(lastTd).append('<button type="button" onclick="copyUrlSuffix('+i+')" class="appenCopy el-button el-button--text el-button--medium" style="color: rgb(24, 144, 255);"><span><span>复制</span></span></button>');
                }
                i++;
            }
        }
    }

    (function(open) {
        XMLHttpRequest.prototype.open = function(method, url, async, user, pass) {
            this.addEventListener("readystatechange", function() {
                if (this.readyState == 4 && this.status == 200) {
                    // 在这里处理响应
                    if(url.endsWith("/user/pageUser")){
                        unsafeWindow._PAGE_DATA = JSON.parse(this.responseText);
                        setTimeout(function() {
                            renderPageData();
                        }, 1000);
                    }
                }
            }, false);
            open.call(this, method, url, async, user, pass);
        };
    })(XMLHttpRequest.prototype.open);

    // 引入 jQuery
    const script = document.createElement('script');
    script.src = 'https://code.jquery.com/jquery-3.6.0.min.js';
    document.head.appendChild(script);

    // 等待 jQuery 加载完成后再执行其他操作
    script.onload = function() {
    }
})();