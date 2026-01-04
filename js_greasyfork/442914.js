// ==UserScript==
// @name         JIRA issues
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  try to take over the world!
// @author       You
// @match        *https://jira.shopee.io/issues/?filter=-1*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/442914/JIRA%20issues.user.js
// @updateURL https://update.greasyfork.org/scripts/442914/JIRA%20issues.meta.js
// ==/UserScript==


var log = console.log.bind(console);


var es = function(sel) {
    return document.querySelectorAll(sel)
}


function spanByRow(row) {
    let tail = row.summary + "  "
                + " -- " + row.status
    let head = `[<a href="${row.task_link}">${row.task_num}</a>]`
    let res = "<div><span>" + head + " " + `${tail}</span></div>`

    return res
}


const issues = function() {
    // 找到 issues
    let issues = document.querySelectorAll('.issuerow')
    let rows = []
    for (var issue of issues) {
        // 跳过 debug 单子
        if (issue.querySelector(".summary").querySelectorAll('.issue-link').length < 2) {
            continue
        }

        let summary = issue.querySelector(".summary").querySelectorAll('.issue-link')[1].innerText;
        let task_link = issue.querySelector(".issuekey").querySelector(".issue-link").href;
        let task_num = issue.querySelector(".issuekey").querySelector(".issue-link").innerText;
        let status = issue.querySelector(".status").innerText;

        let row = {};
        row.summary = summary;
        row.task_link = task_link;
        row.task_num = task_num;
        row.status = status;

        rows.push(row);
    }
    return rows
}



var divPrev = null


const render = function() {
    // 找到 contained-content
    let divContent = es('.contained-content')[0]

    // 清除旧的 content
    if (divPrev !== null) {
        divContent.removeChild(divPrev)
    }

    // 生成 div
    let divTickets = document.createElement('div');
    divTickets.textContent = 'my jira tickets'

    // 样式
    var elementStyle = divTickets.style;
    elementStyle.position = "relative";
    elementStyle.top = "10px";
    elementStyle.left = "10px";
    elementStyle.fontSize = "11pt";
    elementStyle.fontFamily = "Arial";

    const rows = issues()

    // 渲染 issues
    for (let i = 0; i < rows.length; i++) {
        let html = spanByRow(rows[i])

        // 插入到 issues div
        divTickets.insertAdjacentHTML('beforeend', html)
    }

    // 插入到 contained-content
    divContent.insertAdjacentElement('afterbegin', divTickets);

    divPrev = divTickets
}


const registerObserver = function() {
    const callback = function(mutationsList, observer) {
        for(const mutation of mutationsList) {
            let target = mutation.target
            log('mutation', mutation)

            if (mutation.type === 'childList') {
                log('change_childList', target.childNodes.length);
                render()
            } else if (mutation.type === 'attributes') {
                log('change_attributes', target.childNodes.length);
                render()
            }
        }
    }
    
    const observer = new MutationObserver(callback);
    const config = { 
        attributes: true, 
        childList: true, 
        subtree: true,
        characterData: true,
        characterDataOldValue: true,
    };
    let noteContainer = es('tbody')[0]
    observer.observe(noteContainer, config)
}


const _main_monkey = function() {
    log('_main_monkey')

    // 检测文本的变动，在 callback 里面渲染
    registerObserver()


}

_main_monkey()