// ==UserScript==
// @name         jira Plus
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  jira 统计页面新增快捷按钮
// @author       xueyixiao
// @match        http://*/secure/TimesheetReport.jspa?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tongbaninfo.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/472775/jira%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/472775/jira%20Plus.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const boxList = document.querySelectorAll('.worklogLinkContainer')
    boxList.forEach(async box => {
        const link = box.querySelector('span a').getAttribute('href')
        const issueKey = link.match(/browse\/(.*)\?/)[1]
        const worklogId = link.match(/focusedWorklogId=(\d{0,})&/)[1]

        fetch(`${location.origin}/rest/api/2/issue/${issueKey}`).then(response => response.json()).then((issueData) => {
            const issueId = issueData.id;
            box.insertAdjacentHTML('beforeend', `<div class="worklog-operation-group">
  <span  title="新增" onclick="popupWindow('add',${issueId},${worklogId})"   class="icon-default aui-icon aui-icon-small aui-iconfont-add">新增</span>
  <span  title="删除" onclick="popupWindow('delete',${issueId},${worklogId})"   class="icon-default aui-icon aui-icon-small aui-iconfont-delete">删除</span>
  <span  title="编辑" onclick="popupWindow('update',${issueId},${worklogId})"   class="icon-default aui-icon aui-icon-small aui-iconfont-edit">编辑</span>
</div>`)
  }).catch((err) => {
      console.log(err);
  });


});
    document.body.insertAdjacentHTML('beforeend', `<style type="text/css">
img[alt="Medium"]{display:none;}
.worklog-operation-group{display:none;}
.worklogLinkContainer:hover .worklog-operation-group{display:flex;gap:12px;}
</style>`)

    window.popupWindow = (type, id, worklogId) => {
        const hrefs = {
            'add': `${location.origin}/secure/CreateWorklog!default.jspa?id=${id}`,
            'update': `${location.origin}/secure/UpdateWorklog!default.jspa?id=${id}&worklogId=${worklogId}`,
            'delete': `${location.origin}/secure/DeleteWorklog!default.jspa?id=${id}&worklogId=${worklogId}`
  }

  const windowFeatures = "width=1030,height=760,scrollbars=yes,resizable=yes";
    window.open(hrefs[type], "_blank", windowFeatures);
}




})();