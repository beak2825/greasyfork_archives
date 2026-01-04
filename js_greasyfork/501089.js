// ==UserScript==
// @name         liosPermission
// @namespace    https://greasyfork.org/zh-CN/users/1336133-universyu
// @version      2024-07-18
// @description  get the permission
// @author       Lios
// @match        http://219.223.238.14:88/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=238.14
// @run-at       document-end
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/501089/liosPermission.user.js
// @updateURL https://update.greasyfork.org/scripts/501089/liosPermission.meta.js
// ==/UserScript==

window.getStuControlType = function(rpId,courseId,courseNum,fzId){
    var url = "../../../back/rp/common/rpIndex.shtml?method=studyCourseDeatil&courseId="+courseId+"&dataSource=1&courseNum="+courseNum+"&fzId="+fzId+"&rpId="+rpId+"&publicRpType=2,3";
    window.open(url);
}