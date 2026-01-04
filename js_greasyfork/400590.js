// ==UserScript==
// @name         屏蔽MCBBS广告
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  完美屏蔽MCBBS右上角、服务器版块的广告
// @author       You
// @match        https://*.mcbbs.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/400590/%E5%B1%8F%E8%94%BDMCBBS%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/400590/%E5%B1%8F%E8%94%BDMCBBS%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    // 有bug就反馈一下，理论上没有bug

    // 无法加载jq自动禁用
    if (typeof jQuery == 'undefined') {
        console.error("无法加载jQuery，屏蔽MCBBS广告脚本已停止运行");
        return false;
    }
    // 为了避免在宣传申请页面无法查看广告预览，
    // 所以添加了判断：如果在宣传申请页面则不屏蔽广告
    var filename = window.location.href.split("/").slice(window.location.href.split("/").length - 1,window.location.href.split("/").length).toString(String).split(".")[0];
    function GetQueryValue(queryName) {
        var query = decodeURI(window.location.search.substring(1));
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            if (pair[0] == queryName) { return pair[1]; }
        }
        return null;
    }
    if(filename == "plugin" && GetQueryValue('id') == "mcbbs_ad:ad_manage"){
        return true;
    }

    jq("head").append('<style id="bma_css">div.hdc>div.y:last-child {display: none;} div#forum_rules_179 {height: 530px; overflow-y: hidden;}</style>');


    if(jq('#forum_rules_179').length>0) {
        jq('#forum_rules_179').after('已帮您屏蔽广告内容');
    }

})();