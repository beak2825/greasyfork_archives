// ==UserScript==
// @name         Codeforces Modern Design
// @name:en      Codeforces Modern Design
// @namespace    https://github.com/funcdfs
// @version      1.2
// @description  A modern UI redesign for Codeforces platform
// @description:en  A modern UI redesign for Codeforces platform
// @description:zh-CN  Codeforces 平台的现代化界面重设计
// @author       funcdfs
// @match        https://atcoder.jp/contests/*
// @match        https://codeforces.com/*/problem/*
// @match        https://codeforces.com/contest/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=codeforces.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/470204/Codeforces%20Modern%20Design.user.js
// @updateURL https://update.greasyfork.org/scripts/470204/Codeforces%20Modern%20Design.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const codeforces_css = () => {
        const styleTag = document.createElement('style');
        const cssRules = `
pre {
    font-family:  source code pro;
}
div.ttypography tbody td {
    text-align: left;
    border-top: 0px solid #ccc;
}
body {
    background-color: #e7e9ed0f;
}
.roundbox-lt,
.roundbox-rt,
.roundbox-lb,
.roundbox-rb {
    display: none;
}
.roundbox {
    padding-bottom: 10px;
    border-radius: 10px;
}
.sidebox.roundbox {
    margin-top: 10px;
}
.menu-box {
    margin-top: 0px !important;
    -webkit-transition: none !important;
    -moz-transition: none !important;
    -ms-transition: none !important;
    -o-transition: none !important;
    transition: none !important;
}
.menu-box:hover {
    -webkit-box-shadow: none !important;
    -moz-box-shadow: none !important;
    box-shadow: none !important;
}
/** Custom sidebar */
.roundbox {
    margin-top: 10px;
    border: none;
    -webkit-transition: all 0.3s linear 0s;
    -moz-transition: all 0.3s linear 0s;
    -ms-transition: all 0.3s linear 0s;
    -o-transition: all 0.3s linear 0s;
    transition: all 0.3s linear 0s;
}
.roundbox:hover {
    -webkit-box-shadow: 0 1px 15px 0 rgba(0, 0, 0, 0.1);
    -moz-box-shadow: 0 1px 15px 0 rgba(0, 0, 0, 0.1);
    box-shadow: 0 1px 15px 0 rgba(0, 0, 0, 0.1);
}
.roundbox .titled {
    padding: 10px;
    border-bottom-color: #e4e6eb;
}
.sidebox div {
    border-bottom-color: #e4e6eb !important;
}

/** Sidebar avatar custom */
.personal-sidebar .for-avatar {
    float: none !important;
    display: block;
    font-size: 18px;
    padding: 10px;
}

.personal-sidebar .for-avatar .avatar img {
    border-radius: 50px;
    width: 90px;
    height: 90px;
    object-fit: cover;
}

/** Sidebar remove property links*/
.personal-sidebar .propertyLinks {
    display: none;
}

.personal-sidebar .nav-links {
    border-top-style: solid;
    border-top-width: 1px;
    border-top-color: #e4e6eb;
    padding-top: 10px;
}

.personal-sidebar .nav-links li {
    list-style-type: none !important;
    padding: 10px;
    font-size: 13px;
    border-radius: 5px;
    -webkit-transition: all 0.2s linear 0s;
    -moz-transition: all 0.2s linear 0s;
    -ms-transition: all 0.2s linear 0s;
    -o-transition: all 0.2s linear 0s;
    transition: all 0.2s linear 0s;
}

.personal-sidebar .nav-links li a,
.personal-sidebar .nav-links li a:visited {
    color: #050505;
}

.personal-sidebar .nav-links li:after {
    content: '→';
    float: right;
    color: #050505;
}

.personal-sidebar .nav-links li:hover {
    background-color: rgba(0, 0, 0, 0.05);
}

.personal-sidebar .nav-links li a {
    text-decoration: none !important;
}

.roundbox .bottom-links {
    padding: 10px;
    background-color: #fff;
    border-top-color: #e4e6eb !important;
    border-bottom-left-radius: 10px !important;
    border-bottom-right-radius: 10px !important;
}

.roundbox .rtable .dark {
    background-color: #fff;
}
/** Topic custom */
.topic {
    margin-top: 10px;
    padding: 20px;
    background-color: #fff;
    border-radius: 10px;
    -webkit-transition: all 0.3s linear 0s;
    -moz-transition: all 0.3s linear 0s;
    -ms-transition: all 0.3s linear 0s;
    -o-transition: all 0.3s linear 0s;
    transition: all 0.3s linear 0s;
}

.topic:hover {
    -webkit-box-shadow: 0px 1px 15px 0px rgba(0, 0, 0, 0.1);
    -moz-box-shadow: 0px 1px 15px 0px rgba(0, 0, 0, 0.1);
    box-shadow: 0px 1px 15px 0px rgba(0, 0, 0, 0.1);
}

.topic .roundbox {
    border-style: solid;
    border-color: #e4e6eb;
}

.topic .meta a {
    text-decoration: none;
}

.meta {
    padding-bottom: 0px !important;
}

.topic .content {
    border-left-color: #e4e6eb;
}
.roundbox .rtable td,
.roundbox .rtable th {
    border-bottom: 1px solid #e4e6eb;
    border-left: none;
    padding: 7px;
}

/** Header custom */
#header {
    padding: 20px;
    margin-top: -14px;
    background-color: #fff;
}

.menu-box {
    padding: 10px;
    border-radius: 0;
    border-top: none;
    border-left: none;
    border-right: none;
    border-bottom-left-radius: 20px;
    border-bottom-right-radius: 20px;
    border-bottom-color: #e4e6eb;
}

/** Footer custom */
#footer {
    background-color: #fff;
    width: 100%;
    height: 100%;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    border-top-color: #e4e6eb;
}

/** Contest data table */
.datatable .lt,
.datatable .rt,
.datatable .lb,
.datatable .rb,
.datatable .ilt,
.datatable .irt {
    display: none;
}

.datatable table {
    margin-top: 10px;
    border-style: solid;
    border-color: #e4e6eb;
    border-width: 1px;
}

.datatable table .dark {
    background-color: #fff;
}

.datatable table td {
    padding-top: 5px;
    padding-bottom: 5px;
    padding-left: 10px;
    padding-right: 10px;
}

.datatable {
    padding: 20px !important;
    width: inherit;
    padding-bottom: 40px !important;
    background-color: #fff !important;
    border-radius: 10px;
    -webkit-transition: all 0.3s linear 0s;
    -moz-transition: all 0.3s linear 0s;
    -ms-transition: all 0.3s linear 0s;
    -o-transition: all 0.3s linear 0s;
    transition: all 0.3s linear 0s;
}

.datatable:hover {
    -webkit-box-shadow: 0px 1px 15px 0px rgba(0, 0, 0, 0.1);
    -moz-box-shadow: 0px 1px 15px 0px rgba(0, 0, 0, 0.1);
    box-shadow: 0px 1px 15px 0px rgba(0, 0, 0, 0.1);
}

.contests-table::first-line {
    font-size: 20px;
    font-weight: bold !important;
}


.datatable {
    margin-top: 10px !important;
}

/** Custom input */
input[type="file"] {
    padding: 2px 2px!important;
    border: none !important;
}

input,
button {
    outline: none;
    height: auto !important;
    padding: 5px 30px 5px 30px !important;
    border-radius: 10px;
    border-width: 1.5px;
    border-color: #3b5998;
    font-weight: normal;
    -webkit-transition: all 0.3s linear 0s;
    -moz-transition: all 0.3s linear 0s;
    -ms-transition: all 0.3s linear 0s;
    -o-transition: all 0.3s linear 0s;
    transition: all 0.3s linear 0s;
}

input:hover,
button:hover {
    color: rgba(0, 0, 0, 0.7);
    background-color: #e4e6eb;
}

label[for=searchByProblemCheckbox] {
    margin-top: 20px !important;
    color: rgba(0, 0, 0, 0.5);
}

.notice {
    margin-top: 10px !important;
}

.highlighted-row td,
.highlighted-row th {
    background-color: rgba(221, 238, 255, 0.47) !important;
}

input[name=sourceFile] {
    border-style: dashed;
    border-width: 2px;
    border-color: #e4e6eb;
    border-radius: 10px;
    padding: 5px;
    width: 100%;
}

.submit-form {
    margin-top: 20px;
    background-color: #fff;
    padding: 20px 0 20px 0;
    border-radius: 10px;
    -webkit-transition: all 0.3s linear 0s;
    -moz-transition: all 0.3s linear 0s;
    -ms-transition: all 0.3s linear 0s;
    -o-transition: all 0.3s linear 0s;
    transition: all 0.3s linear 0s;
}

.submit-form:hover {
    -webkit-box-shadow: 0px 1px 15px 0px rgba(0, 0, 0, 0.1);
    -moz-box-shadow: 0px 1px 15px 0px rgba(0, 0, 0, 0.1);
    box-shadow: 0px 1px 15px 0px rgba(0, 0, 0, 0.1);
}

.source-popup pre {
    padding: 10px;
    border-style: solid;
    border-width: 2px;
    border-color: #e4e6eb;
}

hr {
    border: 0;
    height: 2px;
    background-image: linear-gradient(to right, rgba(228, 230, 235, 0.1), rgba(228, 230, 235, 1), rgba(228, 230, 235, 0.1));
}

.popup-input-div div,
.popup-output-div div,
.popup-answer-div div,
.popup-checker-div div {
    margin-top: 10px;
    margin-bottom: 5px;
}

.table-form {
    padding: 10px;
}
.diff-notifier {
    display: none !important;
}
/*main*/
.problemindexholder {
    box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
    margin-top: 10px;
    background-color: #fff;
    padding: 30px;
    border-radius: 10px;
    -webkit-transition: all 0.3s linear 0s;
    -moz-transition: all 0.3s linear 0s;
    -ms-transition: all 0.3s linear 0s;
    -o-transition: all 0.3s linear 0s;
    transition: all 0.3s linear 0s;
}

.sample-test {
    margin-top: 10px;
}

.sample-test .input .title,
.sample-test .output .title {
    font-size: 15px;
}

.sample-test pre {
    padding-top: 10px !important;
    padding-bottom: 10px !important;
    padding-left: 5px !important;
    padding-right: 5px !important;
}

.placeholder {
    margin-bottom: 10px !important;
}

a[href^="/passwordRecovery"] {
    display: block;
    margin-top: 20px !important;
}

.backLava {
    border-radius: 10px;
}

#body {
    max-width: 1220px;
    min-width: 980px;
}

::selection {
    background-color: #c4b5fd!important;
    color: #000!important;
}

::-webkit-scrollbar-thumb {
    background: #323536!important;
}
::-webkit-scrollbar {
    width: 10px;
    height: 10px;
}
div.ttypography a:hover {
    color: #9e88f5 !important;
    background: #cfecdc;
}
div.ttypography li,
div.ttypography p {
    font-size: 1.1em;
    line-height: 1.4em;
}
/** Footer custom */
#footer {
    /** background-color: #fff;
    width: 100%;
    height: 100%;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    border-top-color: #e4e6eb;
    **/
    display: none !important;
}
pre {
    tab-size: 4;
}
.sidebar-menu ul {
    font-size: 1.4rem;
}
body {
    zoom: 111% !important;
}
/** move pos, if you want the pos, just delete below string **/
#header {
    position: absolute !important;
    top: 20px;
    z-index: 1;
    right: 20px;
    /* 将元素右对齐 */
    width: 220px;
    background: #00000000;
}
.menu-box {
    background: #00000000;
    width: 70%;
}
.property-title,
#header > div:nth-child(1) {
    display: none !important;
}
/** info remove to bottom */
.time-limit {
    position: fixed !important;
    right: 30px;
    bottom: 70px;
    z-index: 9;
}
.memory-limit {
    position: fixed !important;
    right: 30px;
    bottom: 50px;
    z-index: 9;

}
.input-file {
    position: fixed !important;
    right: 30px;
    bottom: 30px;
    z-index: 9;
}
.output-file {
    position: fixed !important;
    right: 30px;
    bottom: 10px;
    z-index: 9;
}
`;
        styleTag.appendChild(document.createTextNode(cssRules));
        document.head.appendChild(styleTag);
    };
    const codeforces_luogu = () => {
        function getProblemId(str) {
            let pos = str.indexOf("contest/") + "contest/".length;
            let contestNum = "";
            while (str[pos] >= '0' && str[pos] <= '9') {
                contestNum += str[pos];
                pos++;
            }
            return contestNum;
        }
        function getProblemChar(str) {
            let pos = str.indexOf("problem/") + "problem/".length;
            let problemLetter = str.substr(pos);
            return problemLetter;
        }
        // jump to luogu.com 跳转到洛谷 delete luogu
        let str = window.location.href
        let problemId = getProblemId(str);
        let problemChar = getProblemChar(str);
        let luogulink = document.createElement('li');
        luogulink.setAttribute('style', 'color: green !important;');
        luogulink.innerHTML = `<a href="https://www.luogu.com.cn/problem/CF${problemId}${problemChar}" target="_blank"> 洛谷 </a>`;
        luogulink.classList.add('luogulink')
        document.querySelector("#sidebar > div.roundbox.sidebox.sidebar-menu.borderTopRound > ul").appendChild(luogulink)
    };
    const codeforces_friend_status = () => {
        // friends-status-button 好友提交历史记录
        let uuuuuuuuurl = window.location;
        let cccontestId = uuuuuuuuurl.toString().split("/").filter((x) => {
            if (typeof x !== 'string') { return; }
            const num = Number(x);
            if (Number.isInteger(num)) { return num; }
        })[0];
        let s = uuuuuuuuurl.toString().split("/");
        let iiid = s[s.length - 1];
        let friendBtn = document.createElement('li');
        friendBtn.innerHTML = `<a href="https://codeforces.com/contest/${cccontestId}/status/${iiid}?friends=on" target="_blank">Friends Status</a>`;
        friendBtn.classList.add('friendBtn')
        document.querySelector(".second-level-menu-list").appendChild(friendBtn);
    };
    const codeforces_timeLimits = () => {
        // time limits part 时间限制等 放到一个位置
        /* const timeLimits = document.querySelector(".time-limit");
        const memoryLimits = document.querySelector(".memory-limit");
        const inputLimits = document.querySelector(".input-file");
        const outputLimits = document.querySelector(".output-file");
        let informationSpace = document.querySelector();
        informationSpace.parentNode.insertBefore(informationSpace, info); */
        //informationSpace.appendChild(timeLimits);
        //informationSpace.appendChild(memoryLimits);
        //informationSpace.appendChild(inputLimits);
        //informationSpace.appendChild(outputLimits);
    };
    const KEY_PREFIX = 'funcdfs';
    const atcoder_navigation = () => {
        const contest = location.href.match(/^https:\/\/atcoder\.jp\/contests\/([^\/?]+)/)[1];
        const key = KEY_PREFIX + 'atcoder-' + contest;
        if (location.href.match(/^https:\/\/atcoder\.jp\/contests\/([^\/]+)\/tasks\/?$/)) {
            const problems = [];
            const rows = document.querySelectorAll('tbody>tr');
            for (let i = 0; i < rows.length; i++) {
                const links = rows[i].querySelectorAll('a');
                const href = links[0].getAttribute('href');
                const text = links[0].textContent + ' - ' + links[1].textContent;
                problems.push({
                    href: href,
                    text: text
                });
            }
            localStorage[key] = JSON.stringify(problems);
        }
        if (key in localStorage) {
            let problems = JSON.parse(localStorage[key]);
            const problemsBar = document.createElement('ul');
            problemsBar.className = 'nav nav-tabs';
            for (let i = 0; i < problems.length; i++) {
                const link = document.createElement('a');
                link.setAttribute('style', 'margin-left: 10px; margin-right: 10px; white-space: nowrap');
                link.setAttribute('href', problems[i].href);
                link.textContent = problems[i].text;
                const span = document.createElement('span');
                span.textContent = ' ';
                span.appendChild(link);
                problemsBar.appendChild(span);
            }
            document.getElementById('contest-nav-tabs').appendChild(problemsBar);
        }
    };
    const codeforces_navigation = () => {
        const contest = location.href.match(/^https:\/\/codeforces\.com\/contest\/([^\/?]+)/)[1];
        const key = KEY_PREFIX + 'codeforces-' + contest;
        if (location.href.match(/^https:\/\/codeforces\.com\/contest\/([^\/]+)\/?$/)) {
            const problems = [];
            const rows = document.querySelectorAll('.problems>tbody>tr');
            for (let i = 1; i < rows.length; i++) {
                const links = rows[i].querySelectorAll('a');
                const href = links[0].getAttribute('href');
                const text = links[0].textContent.trim() + '. ' + links[1].textContent;
                problems.push({
                    href: href,
                    text: text
                });
            }
            localStorage[key] = JSON.stringify(problems);
        }

        if (key in localStorage) {
            let problems = JSON.parse(localStorage[key]);
            const problemsBar = document.createElement('ul');
            problemsBar.setAttribute('style', 'margin-left: 15px; margin-right: 280px; padding-top: 30px');
            for (let i = 0; i < problems.length; i++) {
                const link = document.createElement('a');
                link.setAttribute('style', 'margin-right: 20px; white-space: nowrap');
                link.setAttribute('href', problems[i].href);
                link.textContent = problems[i].text;
                const span = document.createElement('span');
                span.textContent = ' ';
                span.appendChild(link);
                problemsBar.appendChild(span);
            }

            const content = document.getElementById('pageContent');
            content.parentNode.insertBefore(problemsBar, content);
        }
    };
    if (location.href.match(/^https:\/\/atcoder\.jp\/contests\//)) {
        atcoder_navigation();
    } else {
        if (location.href.match(/^https:\/\/codeforces\.com\/contest\//)) {
            codeforces_navigation();
        }
        codeforces_css();
        codeforces_luogu();
        codeforces_friend_status();
        codeforces_timeLimits();
    }
})();
