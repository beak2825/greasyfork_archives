// ==UserScript==
// @name         JiraKanbanCreateTaskTool
// @namespace    http://www.akuvox.com/
// @version      1.1
// @description  JiraKanbanCreateTaskTool1
// @author       minjie.chen
// @match        http://192.168.10.2:82/secure/*
// @grant        none
// @license      111
// @downloadURL https://update.greasyfork.org/scripts/432198/JiraKanbanCreateTaskTool.user.js
// @updateURL https://update.greasyfork.org/scripts/432198/JiraKanbanCreateTaskTool.meta.js
// ==/UserScript==

(function() {


        document.getElementById("create_link").addEventListener('click', function (ev) {
            timer = setInterval(checkDialogExist, 1000);
        });

    function checkDialogExist(){
        if(document.getElementById("create-issue-dialog")){
            clearInterval(timer);
            timer = null;
            doChangeTaskType();
        }
    }
    function doChangeTaskType(){
        document.getElementById("issuetype-field").value = "任务";
        document.getElementById("issuetype-field").nextElementSibling.nextElementSibling.nextElementSibling.src = "http://192.168.13.20:82/secure/viewavatar?size=xsmall&avatarId=10318&avatarType=issuetype";
        document.getElementById("issuetype").value = "10002";
    }
})();