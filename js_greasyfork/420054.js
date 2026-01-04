// ==UserScript==
// @name         TSC Jira
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  try to take over the world!
// @author       You
// @match        https://jira.cvte.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/420054/TSC%20Jira.user.js
// @updateURL https://update.greasyfork.org/scripts/420054/TSC%20Jira.meta.js
// ==/UserScript==
var jiraPrefix = 'https://jira.cvte.com/browse/';
var jiraCommonPrefix = 'https://'+document.domain;
var startTimer;

function cloneJira(){
    var dueDate = new Date();
    var jiraId = ''
    dueDate.setDate(dueDate.getDate()+7);
    console.log("请求开始");
    GM_xmlhttpRequest({
        method: "POST",
        url: jiraCommonPrefix + "/rest/api/2/issue",
        headers: {
            "Content-Type": "Application/json",
            "X-Atlassian-Token":"no-check",
            "User-Agent":""
        },
        data:JSON.stringify({
            "fields": {
                "project": {"key": "TVS"},
                "issuetype": {"name": "任务"},
                "summary": "【Clone】" + getCurJiraSummary(),
                "description": getCurJiraDescription(),
                "customfield_10403": ["other"],
                "customfield_12804": {"value": "软件平台"},
                "duedate":dueDate,
                'assignee': {'name': getJiraUser()},
                "labels" : ["技术支持自动复制"]
            }
        }),
        onload: function(response) {
            console.log("请求结束");
            console.log("结果:" + response.responseText);
            var newJiraId = JSON.parse(response.responseText).key;
            console.log("JIRA ID:" + newJiraId);
            var jiraUrl = jiraPrefix + newJiraId;
            commentJira(newJiraId,getCurJiraKey());
            dealJira(newJiraId);
            copyTextToClipboard(jiraUrl);
            //location.reload();
        }
    });
}

function commentJira(newJiraID,oldJiraID){
    var commentJiraUrl = jiraCommonPrefix + '/rest/api/2/issue/' + newJiraID + '/comment'
    console.log("备注请求开始，url：" + commentJiraUrl);
    GM_xmlhttpRequest({
        method: "POST",
        url: commentJiraUrl,
        headers: {
            "Content-Type": "Application/json",
            "X-Atlassian-Token":"no-check",
            "User-Agent":""
        },
        data:JSON.stringify({
            "body": "copy from "+ jiraPrefix + oldJiraID
        })
    });
    var linkJiraUrl = jiraCommonPrefix + '/rest/api/2/issueLink'
    console.log("备注请求开始，url：" + linkJiraUrl);
    GM_xmlhttpRequest({
        method: "POST",
        url: linkJiraUrl,
        headers: {
            "Content-Type": "Application/json",
            "X-Atlassian-Token":"no-check",
            "User-Agent":""
        },
        data:JSON.stringify({
            "type": {"name":"Relates"},
            "inwardIssue":{"key":newJiraID},
            "outwardIssue":{"key":oldJiraID}
        }),
        onload: function(response) {
            console.log("结果:" + response.responseText);
        }
    });
}

function dealJira(JiraID){
    var transitionsJiraUrl = jiraCommonPrefix + '/rest/api/2/issue/' + JiraID + '/transitions'
    GM_xmlhttpRequest({
        method: "POST",
        url: transitionsJiraUrl,
        headers: {
            "Content-Type": "Application/json",
            "X-Atlassian-Token":"no-check",
            "User-Agent":""
        },
        data:JSON.stringify({
            'transition': {'id': 161}
        }),
        onload: function(response) {
            console.log(this.name + "结果:" + response.responseText);
            closeJira(JiraID)
        }
    });
}

function closeJira(JiraID){
    var transitionsJiraUrl = jiraCommonPrefix + '/rest/api/2/issue/' + JiraID + '/transitions'
    var filed_close_dict = {
        'customfield_12815': {'name': getJiraUser()},
        'customfield_11106': "统计绩效使用",
        'customfield_11110': {'value': getCurJiraDifficulty()},
        'resolution': {'name': "已解决"},
        'customfield_12810': getCurJiraSpendTime(),
        'customfield_12812':
        [
            {
                "name": "自检手法资源验证OK（复现手法是否一致，测试用资源是否一致）",
                "checked": true,
                "mandatory": true,
                "optionId": 22059,
                "id": 22059,
                "rank":0,
                "statusId":"none",
                "version":"3.0",
                "option":true
            },
            {
                "name": "自检验证OK（宏开/关，代码合入是/否，UI检查表）",
                "checked": true,
                "mandatory": true,
                "optionId": 13728,
                "id": 13728,
                "rank":1,
                "statusId":"none",
                "version":"3.0",
                "option":true
            },
            {
                "name": "客户验证OK",
                "checked": false,
                "mandatory": true,
                "optionId": 13729,
                "id": 13729,
                "rank":2,
                "statusId":"none",
                "version":"3.0",
                "option":true
            },
            {
                "name": "生产测试验证OK",
                "checked": false,
                "mandatory": true,
                "optionId": 13730,
                "id": 13730,
                "rank":3,
                "statusId":"none",
                "version":"3.0",
                "option":true
            }
        ]
    }
    GM_xmlhttpRequest({
        method: "POST",
        url: transitionsJiraUrl,
        headers: {
            "Content-Type": "Application/json",
            "X-Atlassian-Token":"no-check",
            "User-Agent":""
        },
        data:JSON.stringify({
            'transition': {'id': 221},
            'fields':filed_close_dict
        }),
        onload: function(response) {
            console.log(this.name + "结果:" + response.responseText);
            GM_openInTab(jiraPrefix + JiraID);
            location.reload();
        }
    });
}

function copyTextToClipboard(text) {
    var textArea = document.createElement("textarea");
    textArea.style="position:fixed;top:0;left:0;width=2em;height=2em;padding=0;border=none;outline=none;boxShadow=none;background=transparent;";

    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();

    var successful = false;
    try {
        successful = document.execCommand('copy');
    } catch (err) {
        console.log(err);
    }
    document.body.removeChild(textArea);
    return successful;
}

function getAssignee() {
    let assignee = '';
    document.getElementById('assignee-val').children[0].innerText.trim();
    if (document.getElementById('assignee-val')) {
        const assigneeEle = document.getElementById('assignee-val');
        const text = assigneeEle.children[0].innerText.trim();
        assignee = text.split('(')[0].trim().replaceAll(',', '');
    }
    return assignee;
}

function getJiraUser() {
    let jiraUser = '';
    var metaList = document.getElementsByTagName("meta");
    console.log(metaList)
    for (let meta of metaList) {
        if(meta.name === "ajs-remote-user"){
            jiraUser = meta.content
        }
    }
    return jiraUser;
}

function getCurJiraKey(){
    const assigneeEle = document.getElementsByClassName("issue-link");
    return assigneeEle[0].getAttribute("data-issue-key");
}

function getCurJiraSummary(){
    const assigneeEle = document.getElementById("summary-val");
    console.log("getCurJiraSummary: " + assigneeEle.textContent);
    return assigneeEle.textContent;
}

function getCurJiraDifficulty(){
    const assigneeEle = document.getElementById("customfield_11110-val");
    if(assigneeEle == null){
        return "EMPTY";
    }
    var jiraDifficulty = assigneeEle.textContent.trim();
    console.log("getCurJiraDifficulty: " + jiraDifficulty);
    return jiraDifficulty;
}

function getCurJiraSpendTime(){
    const assigneeEle = document.getElementById("customfield_12810-val");
    if(assigneeEle == null){
        return 0;
    }
    var jiraSpendTime = assigneeEle.textContent.trim();
    console.log("getCurJiraDifficulty: " + jiraSpendTime);
    return parseInt(jiraSpendTime);
}

function getCurJiraDescription(){
    const assigneeEle = document.querySelector("#description-val > div > p");
    console.log("getCurJiraDescription: " + assigneeEle);
    if(assigneeEle == null){
        return "原问题无备注"
    }
    return assigneeEle.textContent;
}

function start() {
    var isButton = document.getElementById("clone_tcs_button");
    clearInterval(startTimer);
    if(document.documentURI.indexOf(jiraPrefix) == -1){
        console.log("not browse page, exit");
        return
    }
    if(isButton!=null){
        console.log("already exist, exit");
        return
    }
    var cloneJiraButton = document.createElement('button');
    var parent = document.getElementsByClassName("aui-toolbar2-primary");
    cloneJiraButton.addEventListener("click", cloneJira);
    cloneJiraButton.innerText = '复制到TVS';
    cloneJiraButton.className = "aui-button toolbar-trigger";
    cloneJiraButton.id = "clone_tcs_button";
    parent[0].appendChild(cloneJiraButton);
}

(function() {
    startTimer = setInterval(start,1000);
    document.body.addEventListener('click', function() {
        clearInterval(startTimer);
        startTimer = setInterval(start, 1000);
    })
})();

