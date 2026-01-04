// ==UserScript==
// @name         Bitbucket创建Branch时中文自动翻译成英文
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Bitbucket创建Branch时中文自动翻译成英文。
// @author       Storezhang
// @match        https://*/plugins/servlet/create-branch*
// @match        http://*/plugins/servlet/create-branch*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/382990/Bitbucket%E5%88%9B%E5%BB%BABranch%E6%97%B6%E4%B8%AD%E6%96%87%E8%87%AA%E5%8A%A8%E7%BF%BB%E8%AF%91%E6%88%90%E8%8B%B1%E6%96%87.user.js
// @updateURL https://update.greasyfork.org/scripts/382990/Bitbucket%E5%88%9B%E5%BB%BABranch%E6%97%B6%E4%B8%AD%E6%96%87%E8%87%AA%E5%8A%A8%E7%BF%BB%E8%AF%91%E6%88%90%E8%8B%B1%E6%96%87.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var url = document.URL + '&';
    var issueKey = url.match (/[\?\&]issueKey=([^\&\#]+)[\&\#]/i) [1];
    var issueSummary = url.match (/[\?\&]issueSummary=([^\&\#]+)[\&\#]/i)[1];
    GM_xmlhttpRequest({
        method: "GET",
        url: 'https://fanyi.youdao.com/translate?&doctype=json&type=ZH_CN2EN&i=' + issueSummary,
        onload: function(rsp) {
            var data = JSON.parse(rsp.responseText);
            var tanslatedArray = data.translateResult[0][0].tgt.split(/\s+/);
            var translated = "";
            tanslatedArray.forEach(function(word){
                translated += word.toLowerCase() + "-";
            });
            $("#branch-name").val (issueKey + "-" + translated.slice(0, -1));
        }
    });
})();