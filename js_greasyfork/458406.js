// ==UserScript==
// @name         gitlab快捷键
// @namespace    https://greasyfork.org/zh-CN/scripts/458406-gitlab%E5%BF%AB%E6%8D%B7%E9%94%AE
// @version      1.1
// @description  gitlab快捷键!!!
// @author       zhiming
// @include      *gitlab.int.*
// @grant        none
// @license      not allow
// @downloadURL https://update.greasyfork.org/scripts/458406/gitlab%E5%BF%AB%E6%8D%B7%E9%94%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/458406/gitlab%E5%BF%AB%E6%8D%B7%E9%94%AE.meta.js
// ==/UserScript==

window._gitlab = {
    addRelBtn: function(url){
        $("#fastWay").append('<li><a href="' + url + '/-/branches/all?utf8=✓&search=rel" style="color:green">check-release</a></li>')
    },
    addMergeBtn: function(url){
        $("#fastWay").append('<li><a href="' + url + '/-/merge_requests/new">merge</a></li>')
    }
}

let url = $(".nav-sidebar-inner-scroll .shortcuts-project[href]").attr("href");
if (url) {
    $(".header-content .title-container").append('<div><ul class="nav navbar-sub-nav" id="fastWay"></ul></div>');
    window._gitlab.addRelBtn(url);
    window._gitlab.addMergeBtn(url);
}
