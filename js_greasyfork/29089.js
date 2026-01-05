// ==UserScript==
// @name         JIRA 看板样美化
// @namespace    jessezhang1986
// @version      0.2.6
// @description  看板样式看板样美化
// @author       jessezhang1986@qq.com
// @include        http*://jira*/secure/RapidBoard.jspa*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/29089/JIRA%20%E7%9C%8B%E6%9D%BF%E6%A0%B7%E7%BE%8E%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/29089/JIRA%20%E7%9C%8B%E6%9D%BF%E6%A0%B7%E7%BE%8E%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var styleStr = `
span.subnav-container{
    display:none
}
#ghx-column-header-group.ghx-fixed{
    top: 82px;
}
#ghx-header {
    padding: 5px 20px 0px 20px;
}
#ghx-modes-tools {
    padding-bottom: 5px;
}
#ghx-pool {
    padding-top: 36px;
}
#-ghx-header {
    margin-bottom: 10px;
}
#js-quickfilters-label{
display:none;
}

#ghx-board-name span{
display:none;
}
.ghx-controls-filters dd a {
    font-size: 12px;
}

.ghx-column-headers .ghx-qty {
    color: #888;
    font-weight: normal;
}
.ghx-column-headers h2 {
    color: #888;
}

.issue-drop-zone {
    border: none;
    background: #f9f9f9;
}
#footer-comment-button .aui-icon-small{
    height: 0px;
    width: 0px;
}
#footer-comment-button .aui-icon-small:before{
content:none;
}

.aui-button, a.aui-button, .aui-button:visited {
    border: none;
    color: #666;
}
.issue-drop-zone__text {
    color: #bbb;
}
/* 详情页 START */
#ghx-pool,#js-swimlane-header-stalker {
    background: #EEEFF4;
}
.ghx-detail-view.gh-editable-detail-view .ghx-detail-nav-content {
    padding: 0 20px 0 20px;
}
.ghx-detail-nav-menu,.ghx-detail-head .ghx-project-avatar{
display:none;
}
.ghx-detail-head {
    padding: 0 0 0 15px;
}
/* 详情页 END */

.ghx-issue .ghx-avatar {
    top: auto;
    bottom: 5px;
}
.ghx-avatar-img {
    border: 2px solid #fff;
    -webkit-border-radius: 50%;
    border-radius: 50%;
    height: 28px;
    line-height: 28px;
    width: 28px;
}
.ghx-issue.ghx-has-avatar .ghx-issue-fields, .ghx-issue.ghx-has-corner .ghx-issue-fields {
    padding-right: 0px;
}

.ghx-issue .ghx-extra-fields .ghx-extra-field-row {
    margin-right: 5px;
    display: inline;
}
.ghx-detail-contents {
    background: #fff;
}

.ghx-issue-subtask {
    margin-left: 0px;
}
.ghx-parent-stub .ghx-key {
    border-left: none;
}
span.subnav-page-header{
    padding-top: 6px;
}
.ghx-controls-plan, .ghx-header-compact .ghx-controls-report, .ghx-controls-work {
    min-height: 30px;
}
#ghx-operations{
    left: 220px;
    top: -27px;
    position: absolute;
}
.ghx-column-headers .ghx-column {
    border-bottom: 5px solid #fff;
}
#ghx-column-headers {
    border-bottom: 1px solid #ccc;
}

#issue_actions_container .message-container{
    display:none;
}
#description-val .user-content-block em{
color:#bbb;
}
.ghx-issue-fields .ghx-summary .ghx-inner {
    max-height: 3.2em;
}

.ghx-swimlane-header {
    border-top: solid #ddd 1px;
}

.ghx-issue .ghx-issue-content {
    min-height: 0px;
}
a.ghx-issue {
    font-size: 12px;
}
.ghx-issue .ghx-type, .ghx-issue .ghx-type img, .ghx-issue .ghx-flags, .ghx-issue .ghx-priority, .ghx-issue .ghx-priority img {
    height: 14px;
    width: 14px;
}
.ghx-issue .ghx-flags {
    top: 26px;
}
.ghx-column-headers .ghx-column, .ghx-columns .ghx-column{
    padding: 0 4px;
}
.ghx-swimlane-header::after{
content: none;
}
.ghx-issue {
    border: none;
    border-bottom: 1px solid #ccc;
    border-radius: 3px;
    margin-bottom: 6px;
}
.ghx-columns .ghx-column {
    border-right: 1px solid #ddd;
    padding: 5px 10px 5px 0;
    background: #EEEFF4;
    border-radius: 0px 0px 3px 3px;
}
.ghx-detail-view.gh-editable-detail-view .ghx-detail-issue .module.toggle-wrap .toggle-title {
    color: #bbb;
    font-size: 12px;
    font-weight: normal;
}
.issue-body-content .module>.mod-header {
    background: none;
    display:none;
}

.ghx-detail-view.gh-editable-detail-view .ghx-detail-section.module {
    margin-bottom: 10px;
}
#details-module-people_heading,#details-module-dates_heading,#details-module_heading{
    display:none;
}
.ghx-issue .ghx-extra-fields .ghx-extra-field.ghx-fa{
    display:none;
}
.ghx-grabber {
    border-radius: 3px 0 0 3px;
}
.ghx-days {
    display: none;
}
.ghx-issue .ghx-issue-content {
    padding: 6px 6px 6px 38px;
}
.ghx-issue .ghx-type {
    top: 6px;
}
.ghx-issue .ghx-flags {
    top: 24px;
}
.ghx-issue .ghx-extra-fields {
    margin-top: 2px;
}
.ghx-work .ghx-extra-field .ghx-extra-field-content {
    font-size: 12px;
    color: #777;
}
#ghx-backlog-search{
    margin-top: -3px;
}
#ghx-view-presentation {
    display: none;
}
`;
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = styleStr;
    document.getElementsByTagName('HEAD').item(0).appendChild(style);

    //调整subnavigator显示位置
    $('#ghx-board-name').append('&nbsp;&nbsp;<span style="font-size:12px;">'+$('#subnav-title .subnavigator-title').html()+'</span>');

    //外链新窗口打开
    $('body').on("click", "a.external-link", function(e){
        if($(e.target).attr('target') != "_blank"){
            $(e.target).attr('target', "_blank");
        }
    });
/*
    function resizeWindow(){
        //调整resize
        if( document.createEvent) {
            var e = document.createEvent("HTMLEvents");
            e.initEvent("resize", true, true);
            window.dispatchEvent(e);
        } else if(document.createEventObject){
            window.fireEvent("onresize");
        }
    }

    resizeWindow();
    setTimeout(resizeWindow, 1000);
    setTimeout(resizeWindow, 2000);
    setTimeout(resizeWindow, 3000);
    setTimeout(resizeWindow, 4000);
*/
})();