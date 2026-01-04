// ==UserScript==
// @name         Haofenshu Hacker
// @namespace    http://tampermonkey.net/
// @version      2024-03-01-2
// @description  Overview a contest information in www.haofenshu.com
// @author       Piggy424008
// @match        https://www.haofenshu.com/report/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yunxiao.com
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @license      MIT
// @connect      *
// @run-at       document-end

// @downloadURL https://update.greasyfork.org/scripts/488762/Haofenshu%20Hacker.user.js
// @updateURL https://update.greasyfork.org/scripts/488762/Haofenshu%20Hacker.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function getQueryVariable(variable)
    {
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i=0;i<vars.length;i++) {
            var pair = vars[i].split("=");
            if(pair[0] == variable){return pair[1];}
        }
        return(false);
    }
    function handle(status) {
        var resp = JSON.parse(status.response).data;
        console.log(resp);
        console.log(`您的班级排名为 ${resp.classRank}，打败了 ${resp.classDefeatRatio}% 的同学，等第为 ${resp.classRankPart}`);
        console.log(`您的班级排名为 ${resp.gradeRank}，打败了 ${resp.gradeDefeatRatio}% 的同学，等第为 ${resp.gradeRankPart}`);
        return resp;
    }
    function createHTML_bf(resp) {
        var css = `        .white_content {
            display: none;
            position: absolute;
            padding: 20px;
            border: 10px solid orange;
            border-radius: 10px;
            width: max-content;
            background-color: white;
            z-index:1002;
            overflow: auto;
            line-height: 1rem;
        } `;

        GM_addStyle(css);
        var ele = document.createElement("div");
        ele.innerHTML=`<p>查看额外信息：<a href="JavaScript:void(0)" onclick="document.getElementById('light').style.display='block';">请点这里</a></p>
<div id="light" class="white_content">
    <p style="line-height: 2; ">您的班级排名为 ${resp.classRank}，打败了 ${resp.classDefeatRatio}% 的同学，等第为
        ${resp.classRankPart}<br>
        您的年级排名为 ${resp.gradeRank}，打败了 ${resp.gradeDefeatRatio}% 的同学，等第为 ${resp.gradeRankPart}<br> <a
            href="javascript:void(0)" onclick="document.getElementById('light').style.display='none';">点这里关闭本窗口</a></p>
</div>`;
        ele.style.position = "absolute";
        ele.style.top = "10%";
        document.body.appendChild(ele);
    }
    GM_xmlhttpRequest({url: `https://hfs-be.yunxiao.com/v3/exam/${getQueryVariable("examId")}/overview`, method: "GET", onload: function(status) {createHTML_bf( handle(status)); }, onerror: function() { console.log(status); }});// Your code here...
    createHTML_bf();
})();
