// ==UserScript==
// @name         Leetcode solution's saver
// @namespace    http://tampermonkey.net/
// @version      1.0.4
// @description  Script saves the file to a folder with corresponding difficulty, name and file extension
// @author       https://github.com/ruvn-1fgas
// @match        https://leetcode.com/*
// @require      https://code.jquery.com/jquery-latest.js
// @require      https://unpkg.com/turndown/dist/turndown.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=leetcode.com
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/472921/Leetcode%20solution%27s%20saver.user.js
// @updateURL https://update.greasyfork.org/scripts/472921/Leetcode%20solution%27s%20saver.meta.js
// ==/UserScript==
/* globals jQuery, $, waitForKeyElements */

const API_URL = 'https://leetcode.com/graphql/';
const LANG_LIST = [{ 'name': 'C++', 'slug': 'cpp', 'id': 0, 'extension': '.cpp' }, { 'name': 'Java', 'slug': 'java', 'id': 1, 'extension': '.java' }, { 'name': 'Python', 'slug': 'python', 'id': 2, 'extension': '.py' }, { 'name': 'MySQL', 'slug': 'mysql', 'id': 3, 'extension': '.sql' }, { 'name': 'C', 'slug': 'c', 'id': 4, 'extension': '.c' }, { 'name': 'C#', 'slug': 'csharp', 'id': 5, 'extension': '.cs' }, { 'name': 'JavaScript', 'slug': 'javascript', 'id': 6, 'extension': '.js' }, { 'name': 'Ruby', 'slug': 'ruby', 'id': 7, 'extension': '.rb' }, { 'name': 'Bash', 'slug': 'bash', 'id': 8, 'extension': '.sh' }, { 'name': 'Swift', 'slug': 'swift', 'id': 9, 'extension': '.swift' }, { 'name': 'Go', 'slug': 'golang', 'id': 10, 'extension': '.go' }, { 'name': 'Python3', 'slug': 'python3', 'id': 11, 'extension': '.py' }, { 'name': 'Scala', 'slug': 'scala', 'id': 12, 'extension': '.scala' }, { 'name': 'Kotlin', 'slug': 'kotlin', 'id': 13, 'extension': '.kt' }, { 'name': 'MS SQL Server', 'slug': 'mssql', 'id': 14, 'extension': '.sql' }, { 'name': 'Oracle', 'slug': 'oraclesql', 'id': 15, 'extension': '.sql' }, { 'name': 'HTML', 'slug': 'html', 'id': 16, 'extension': '.html' }, { 'name': 'Python ML (beta)', 'slug': 'pythonml', 'id': 17, 'extension': '.py' }, { 'name': 'Rust', 'slug': 'rust', 'id': 18, 'extension': '.rs' }, { 'name': 'PHP', 'slug': 'php', 'id': 19, 'extension': '.php' }, { 'name': 'TypeScript', 'slug': 'typescript', 'id': 20, 'extension': '.ts' }, { 'name': 'Racket', 'slug': 'racket', 'id': 21, 'extension': '.rkt' }, { 'name': 'Erlang', 'slug': 'erlang', 'id': 22, 'extension': '.erl' }, { 'name': 'Elixir', 'slug': 'elixir', 'id': 23, 'extension': '.ex' }, { 'name': 'Dart', 'slug': 'dart', 'id': 24, 'extension': '.dart' }, { 'name': 'Python Data Science (beta)', 'slug': 'pythondata', 'id': 25, 'extension': '.py' }, { 'name': 'React', 'slug': 'react', 'id': 26, 'extension': '.js' }, { 'name': 'Vanilla JS', 'slug': 'vanillajs', 'id': 27, 'extension': '.js' }];

let turndownService = new TurndownService();
turndownService.addRule('pre', {
    filter: ['pre'],
    replacement: function (content) {
        return '\n```\n' + content + '```'
    }
});

(function (open) {
    XMLHttpRequest.prototype.open = function () {
        this.addEventListener("readystatechange", function () {
            if (this.readyState == 4 && window.location.href.search('/problems/') != -1) {
                main();
            }
        }, false);
        open.apply(this, arguments);
    };
})(XMLHttpRequest.prototype.open);

function main() {
    'use strict'
    let buttons = $('.relative.ml-auto.flex.items-center.gap-3');
    if (buttons === undefined) {
        return;
    }

    if (buttons.children().length > 3) {
        return;
    }

    let downloadButton = createButton('Download', buttons.children().first().attr('class'), { 'margin-right': '4px' }, download);
    buttons.prepend(downloadButton);
}

function createButton(buttonName, buttonClass, buttonStyle, buttonClick) {
    let button = $('<button>' + buttonName + '</button>');
    button.addClass(buttonClass);
    button.removeClass('cursor-not-allowed');
    button.css(buttonStyle);
    button.click(buttonClick);
    return button;
}

async function download() {
    const taskInfo = await getTaskInfo();
    for (let key in taskInfo) {
        if (taskInfo[key] === undefined) {
            return;
        }
    }
    const taskDesc = await getTaskDesc(taskInfo);
    const taskCode = await getTaskCode(taskInfo);
    if (taskCode === undefined) {
        return;
    }

    save(taskInfo, taskCode, taskDesc);
}

async function fetchData(body, operationName) {
    const csrftoken = getCsrfToken();
    try {
        const response = await fetch(API_URL, {
            body,
            method: "POST",
            headers: {
                "x-csrftoken": csrftoken,
                "content-type": "application/json",
            }
        });
        const data = await response.json();

        return data.data[operationName];
    } catch (error) {
        console.log(error);
    }
}

async function getTaskInfo() {
    const slug = window.location.href.split('/')[4];
    let body = `{\"query\":\"\\n    query questionTitle($titleSlug: String!) {\\n  question(titleSlug: $titleSlug) {\\n    questionId\\n    questionFrontendId\\n    title\\n    titleSlug\\n    isPaidOnly\\n    difficulty\\n    likes\\n    dislikes\\n  }\\n}\\n    \",\"variables\":{\"titleSlug\":\"${slug}\"},\"operationName\":\"questionTitle\"}`
    const question = await fetchData(body, "question");
    const currentLanguageHolder = $('.flex.items-center').filter(function () {
        return $(this).attr('class') === 'flex items-center';
    });
    const childs = Array.from(currentLanguageHolder.children());
    const currentLanguage = LANG_LIST.find(({ name }) => childs.some(child => $(child).text().trim() === name));
    const { questionId, questionFrontendId, title, titleSlug, difficulty } = question;
    return {
        taskId: questionId,
        taskName: `${questionFrontendId}. ${title}`,
        titleSlug: titleSlug,
        level: difficulty,
        language: currentLanguage?.name,
        langId: currentLanguage?.id,
        fileExt: currentLanguage?.extension
    };
}

async function getTaskDesc(taskInfo) {
    const { titleSlug } = taskInfo;
    const body = `{\"query\":\"\\n    query questionContent($titleSlug: String!) {\\n  question(titleSlug: $titleSlug) {\\n    content\\n    mysqlSchemas\\n    dataSchemas\\n  }\\n}\\n    \",\"variables\":{\"titleSlug\":\"${titleSlug}\"},\"operationName\":\"questionContent\"}`

    const { content } = await fetchData(body, "question");
    const markdown = turndownService.turndown(content);
    return markdown;
}

async function getTaskCode(taskInfo) {
    const { langId, taskId } = taskInfo;
    const body = `{\"query\":\"\\n    query syncedCode($questionId: Int!, $lang: Int!) {\\n  syncedCode(questionId: $questionId, lang: $lang) {\\n    timestamp\\n    code\\n  }\\n}\\n    \",\"variables\":{\"lang\":${taskInfo.langId},\"questionId\":${taskInfo.taskId}},\"operationName\":\"syncedCode\"}`;

    const { code } = await fetchData(body, "syncedCode");
    return code;
}

function getCsrfToken() {
    let csrfToken = document.cookie.split('; ').find(row => row.startsWith('csrftoken')).split('=')[1];
    return csrfToken;
}

async function saveCode(taskInfo, taskCode) {
    const { taskName, level, fileExt } = taskInfo;
    const filename = `Leetcode/${level}/${taskName}${fileExt}`;
    const bl = new Blob([taskCode], { type: `text/${fileExt}` });
    const download = {
        url: URL.createObjectURL(bl),
        name: filename
    };
    GM_download(download);
}

async function save(taskInfo, taskCode, taskDesc) {
    const { taskName, level, fileExt } = taskInfo;
    const codeFilename = `Leetcode/${level}/${taskName}${fileExt}`;
    // check if file exists
    let solvedTasks = localStorage.getItem('solved_tasks');
    solvedTasks = solvedTasks === null ? [] : solvedTasks.split(',');
    let isExists = solvedTasks === null ? false : solvedTasks.includes(`${taskName}${fileExt}`);

    if (!isExists) {
        const codeBl = new Blob([taskCode], { type: `text/${fileExt}` });
        const codeDownload = {
            url: URL.createObjectURL(codeBl),
            name: codeFilename
        };
        GM_download(codeDownload);

        if (solvedTasks === null) {
            solvedTasks = [];
        }

        solvedTasks.push(`${taskName}${fileExt}`);

        localStorage.setItem('solved_tasks', solvedTasks);
    }

    let solvedTasksDescs = localStorage.getItem('solved_tasks_descs');
    solvedTasksDescs = solvedTasksDescs === null ? [] : solvedTasksDescs.split(',');
    isExists = solvedTasksDescs === null ? false : solvedTasksDescs.includes(taskName);

    if (!isExists) {
        const descFilename = `Leetcode/${level}/${taskName}.md`;
        const descBl = new Blob([taskDesc], { type: 'text/md' });
        const descDownload = {
            url: URL.createObjectURL(descBl),
            name: descFilename
        };
        GM_download(descDownload);

        if (solvedTasksDescs === null) {
            solvedTasksDescs = [];
        }

        solvedTasksDescs.push(taskName);

        localStorage.setItem('solved_tasks_descs', solvedTasksDescs);
    }
}
