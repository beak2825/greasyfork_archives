// ==UserScript==
// @name         RDC美化
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Aliyun RDC prettier
// @author       Jack.Chan (971546@qq.com)
// @namespace    http://fulicat.com
// @url          https://greasyfork.org/zh-CN/scripts/431779
// @match        https://rdc.aliyun.com/appcenter/list*
// @match        https://rdc.aliyun.com/appcenter/overview*
// @match        https://rdc.aliyun.com/ec/projects/*/apps/*/pipelines/*
// @icon         https://www.aliyun.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431779/RDC%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/431779/RDC%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
var cssRules = `
.page{
    max-width: 1200px;
    margin-left: auto;
    margin-right: auto;
}
.page,
#app-list,
.overview-info-panel,
.pagination{
    font-size: 14px;
}
#app-list .table.table-hover.tb>colgroup>col + col + col + col ~ col,
.overview-info-panel .table.table-hover.tb>colgroup>col + col + col + col ~ col{
    display: none !important;
}
#app-list .table.table-hover.tb>colgroup>col + col,
.overview-info-panel .table.table-hover.tb>colgroup>col + col{
    width: 15% !important;
}

.aone-section .tab-extra {
    right: auto !important;
    left: 50% !important;
}
`;
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerText = cssRules;
    document.head.appendChild(style);
})();