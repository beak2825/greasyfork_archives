// ==UserScript==
// @name         AtCoder dos2unix UserScript
// @namespace    https://github.com/kmyk
// @version      1.7
// @description  submit code using LF instead of CRLF
// @author       Kimiyuki Onaka
// @match        *://atcoder.jp/contests/*/submit*
// @match        *://atcoder.jp/contests/*/tasks/*
// @match        *://beta.atcoder.jp/contests/*/submit*
// @match        *://beta.atcoder.jp/contests/*/tasks/*
// @match        *://*.contest.atcoder.jp/submit*
// @downloadURL https://update.greasyfork.org/scripts/372122/AtCoder%20dos2unix%20UserScript.user.js
// @updateURL https://update.greasyfork.org/scripts/372122/AtCoder%20dos2unix%20UserScript.meta.js
// ==/UserScript==
function post(path, payload, expectedURL) {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", path, false);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.send(payload);
    console.log(xhr);
    if (xhr.responseURL == expectedURL) {
        location.href = xhr.responseURL;
    }
    else {
        alert("AtCoder dos2unix UserScript: something wrong / なんか変だよ ソースコードが空だったり連投制限に引っ掛かってたりしませんか");
    }
}
function addNewButton(normalButton) {
    const button = document.createElement("button");
    button.innerText = "提出 (dos2unix)";
    for (const value of normalButton.classList) {
        button.classList.add(value);
    }
    button.classList.remove("btn-primary");
    button.classList.add("btn-success");
    normalButton.parentNode.insertBefore(button, normalButton.nextSibling);
    const space = document.createTextNode(" ");
    normalButton.parentNode.insertBefore(space, button);
    return button;
}
function beta() {
    const taskScreenName = document.getElementsByName("data.TaskScreenName")[0];
    const sourceCode = document.getElementsByName("sourceCode")[0];
    const csrfToken = document.getElementsByName("csrf_token")[0];
    const normalSubmit = document.getElementById("submit");
    const submit = addNewButton(normalSubmit);
    submit.addEventListener("click", function (e) {
        e.preventDefault();
        // NOTE: I didn't know why, but the "data.LanguageId" must be gotten here. see https://github.com/kmyk/atcoder-dos2unix-userscript/issues/2
        const languageId = document.getElementsByName("data.LanguageId")[0];
        const contestId = location.pathname.split('/')[2];
        const data = [];
        for (const tag of [taskScreenName, languageId, sourceCode, csrfToken]) {
            var value = tag.value;
            if (tag === sourceCode) {
                value = $(sourceCode).data('editor').getValue();
            }
            data.push(tag.name + '=' + encodeURIComponent(value));
            console.log([tag.name, value]);
        }
        const payload = data.join('&');
        console.log(payload);
        const path = "/contests/" + contestId + "/submit";
        const expectedURL = location.origin + "/contests/" + contestId + "/submissions/me";
        post(path, payload, expectedURL);
    });
}
function alpha() {
    const session = document.getElementsByName("__session")[0];
    const taskId = document.getElementsByName("task_id")[0];
    const sourceCode = document.getElementsByName("source_code")[0];
    const languageSelectors = document.getElementsByClassName("submit-language-selector");
    const normalSubmit = document.getElementsByTagName("button")[0];
    const submit = addNewButton(normalSubmit);
    submit.addEventListener("click", function (e) {
        e.preventDefault();
        const data = [];
        for (const tag of [session, taskId, sourceCode].concat(Array.from(languageSelectors))) {
            data.push(tag.name + '=' + encodeURIComponent(tag.value));
            console.log([tag.name, tag.value]);
        }
        const payload = data.join('&');
        console.log(payload);
        const path = "/submit?task_id=" + taskId.value;
        const expectedURL = location.origin + "/submissions/me";
        post(path, payload, expectedURL);
    });
}
function main() {
    if (location.hostname.endsWith(".contest.atcoder.jp")) {
        alpha();
    }
    else {
        beta();
    }
}
main();
