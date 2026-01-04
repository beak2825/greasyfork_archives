// ==UserScript==
// @name         Bilibili Watchlater Redirect
// @namespace    https://greasyfork.org/en/scripts/398925-bilibili-watchlater-redirect
// @version      1.0
// @description  Bilibili watchlater page redirect to normal single video page
// @description  B站 稍后再看 页面跳转至普通视频页面
// @icon         https://www.bilibili.com/favicon.ico
// @encoding     utf-8
// @date         03/29/2020
// @modified     03/29/2020
// @author       Franklin Chen
// @supportURL   http://msftbot.com/
// @copyright	 2020, Franklin Chen
// @include      https://www.bilibili.com/watchlater/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398925/Bilibili%20Watchlater%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/398925/Bilibili%20Watchlater%20Redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function redirect(){
        var url = window.location.href;
        if (url != "https://www.bilibili.com/watchlater/#/list") {
            url = url.replace(/watchlater\/#\//,"");

            var regExp = /\/p(\d*)/;
            var matchArr = regExp.exec(url);
            if(matchArr){
                var pNo= matchArr[1];
                switch(pNo) {
                    case "1":
                        url = url.replace(/\/p\d*/,"");
                        break;
                    default:
                        url = url.replace(/\/p\d*/,"?p="+pNo);
                }
            }
        }

        window.location.href = url;
    }

    function render() {
        var reBtn = $('<img src="https://www.bilibili.com/favicon.ico" alt="Redirect to normal page" title="Redirect to normal page" style="position:fixed;right:10px;bottom: 10px;height:24px;cursor: pointer;z-index:999">');
        reBtn.click(redirect);
        reBtn.appendTo($('body'))
    }

    render();

})();