// ==UserScript==
// @name         Better Jira
// @namespace    https://www.ruijc.com/
// @version      1.0.2
// @description  更好的Jira，以下优化：1、Jira创建Branch时中文自动翻译成英文；2、创建Branch时如果是Improvment时，将分支类型改成Feature。
// @author       Storezhang
// @match        https://*/plugins/servlet/create-branch*
// @match        http://*/plugins/servlet/create-branch*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/382996/Better%20Jira.user.js
// @updateURL https://update.greasyfork.org/scripts/382996/Better%20Jira.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var url = document.URL + '&';
    var issueKey = url.match (/[\?\&]issueKey=([^\&\#]+)[\&\#]/i) [1];
    var issueSummary = url.match (/[\?\&]issueSummary=([^\&\#]+)[\&\#]/i)[1];
    var issueType = url.match (/[\?\&]issueType=([^\&\#]+)[\&\#]/i)[1];

    // 如果为Improvement时，将分支类型改成Feature
    if ("Improvement" === issueType) {
        $("#branch-type").val("feature");
    }

    // 中文自动翻译成英文
    GM_xmlhttpRequest({
        method: "GET",
        url: 'https://fanyi.youdao.com/translate?&doctype=json&type=ZH_CN2EN&i=' + issueSummary,
        onload: function(rsp) {
            var data = JSON.parse(rsp.responseText);
            var tanslatedArray = data.translateResult[0][0].tgt.split(/\s+/);
            var translated = "";
            tanslatedArray.forEach(function (word){
                translated += word.toLowerCase() + "-";
            });
            $("#branch-name").val (issueKey + "-" + translated.slice(0, -1));
        }
    });
})();