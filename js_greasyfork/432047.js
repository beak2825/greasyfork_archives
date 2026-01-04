// ==UserScript==
// @name         Aliyun RDC 云效美化
// @namespace    http://fulicat.com
// @version      1.0.1
// @description  Aliyun RDC prettier
// @author       Jack.Chan (971546@qq.com)
// @namespace    http://fulicat.com
// @url          https://greasyfork.org/zh-CN/scripts/432047-aliyun-rdc-%E4%BA%91%E6%95%88%E7%BE%8E%E5%8C%96
// @match        https://rdc.aliyun.com/appcenter/list*
// @match        https://rdc.aliyun.com/appcenter/overview*
// @match        https://rdc.aliyun.com/ec/projects/*/apps/*/pipelines/*
// @match        https://rdc.aliyun.com/ec/projects/*/pipelines/*
// @icon         https://www.aliyun.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432047/Aliyun%20RDC%20%E4%BA%91%E6%95%88%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/432047/Aliyun%20RDC%20%E4%BA%91%E6%95%88%E7%BE%8E%E5%8C%96.meta.js
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