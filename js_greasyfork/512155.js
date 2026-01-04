// ==UserScript==
// @name         Domjudge-UI-for-Codeforces
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @license      MIT
// @description  For ICPC competitors practicing for the DOMjudge UI in codeforces.
// @author       jakao
// @match        https://codeforces.com/gym/*/submit*
// @match        https://codeforces.com/contest/*/submit*
// @icon         https://i.imgur.com/RwGYTmF.png
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/512155/Domjudge-UI-for-Codeforces.user.js
// @updateURL https://update.greasyfork.org/scripts/512155/Domjudge-UI-for-Codeforces.meta.js
// ==/UserScript==

const css = `
.summary-table {
    text-align: center;
}
table {
    width: 100%;
    border-collapse: collapse;
}
.score-penalty-table {
    display: flex;
    align-items: center;
}
.score-penalty-table > div {
    flex: 1;
    padding: 5px;
    border-right: 1px solid #ccc; /* Optional border for visual separation */
}
.score-penalty-table > div:first-child {
    border-right: 1px solid transparent; /* Transparent border between left and right */
}
.badge {
    display: inline-block;
    padding: .25em .4em;
    font-size: 75%;
    font-weight: 700;
    line-height: 1;
    text-align: center;
    white-space: nowrap;
    vertical-align: baseline;
    border-radius: .25rem;
    transition: color .15s ease-in-out, background-color .15s ease-in-out, border-color .15s ease-in-out, box-shadow .15s ease-in-out;
}
.problem-badge {
    font-size: 100%;
}
td.score_cell {
    min-width: 4.2em;
    padding: 2px 1px 2px 1px;
    border-right: none;
}
.summary-table td.score_cell {
    min-width: 4.2em;
    border-right: none;
}
thead {
    display: table-header-group;
    vertical-align: middle;
    unicode-bidi: isolate;
    border-color: inherit;
}
.sortorderswitch {
    border-top: 2px solid black;
}
.summary-table {
    margin-top: 2.5em;
}
.summary-table a {
    display: block;
    padding: 2px 1px 2px 1px;
    text-decoration: none;
    color: black;
}
.scorenc, .scorett, .scorepl {
    text-align: center;
    width: 2ex;
}
.scorenc {
    font-weight: bold;
}
.summary-table .scoreaf { white-space: nowrap; border: 0; text-align: center; }
.summary-table tr {
    border-bottom: 1px solid black;
    border-bottom-width: 1px;
    border-bottom-style: solid;
    border-bottom-color: black;
    height: 42px;
}
.summary-table .scoretn {
    padding: 0px 5px 0px;
    text-align: right;
    font-weight: bold;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.summary-table td, .summary-table th {
    border-right: 1px solid silver;
    padding: 0px;
}
.summary-table-header {
    font-variant: small-caps;
    border-bottom: 2px solid black;
    white-space: nowrap;
}
.summary-table-header th{
    text-align: center;
    box-shadow: -1px 0px 0px 0px silver inset, 0px 2px 0px 0px black;
    border: none;
    background: var(--background-color);
    position: sticky;
    top: 0px;
    z-index: 1;
}
col {
    display: table-column;
    unicode-bidi: isolate;
}
colgroup {
    display: table-column-group;
    unicode-bidi: isolate;
}
.summary-table td {
    font-size: small;
    vertical-align: middle;
    text-align: center;
}
.summary-table td div {
    width: 4em;
    font-size: 120%;
    display: inline-block;
}
.summary-table td div span {
    font-weight: normal;
    font-size: 70%;
    display: block;
}
.summary-table th {
    text-align: center;
    box-shadow: -1px 0px 0px 0px silver inset, 0px 2px 0px 0px black;
    border: none;
    background: var(--background-color);
    position: sticky;
    top: 0px;
    z-index: 1;
}
td.scorenc {
    border-color: silver;
    border-right: 0;
}
*, ::after, ::before {
    box-sizing: border-box;
}
.row {
    display: -ms-flexbox;
    display: flex;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
    margin-right: -15px;
    margin-left: -15px;
}
.col {
    -ms-flex-preferred-size: 0;
    flex-basis: 0;
    -ms-flex-positive: 1;
    flex-grow: 1;
    max-width: 100%;
}
.teamoverview {
    border-top: solid 1px darkgray;
    border-bottom: solid 1px darkgray;
    background-color: #c4d8ff;
    margin-top: 2ex;
    padding-left: 1ex;
    font-size: 1.17em;
    text-align: center;
}
.h1, .h2, .h3, .h4, .h5, .h6, h1, h2, h3, h4, h5, h6 {
    margin-bottom: .5rem;
    font-weight: 500 !important;
    line-height: 1.2;
}
h1 {
    display: block !important;
    font-size: 2em;
    margin-block-start: 0.67em !important;
    margin-block-end: 0.67em !important;
    margin-inline-start: 0px !important;
    margin-inline-end: 0px !important;
    font-weight: bold;
    unicode-bidi: isolate !important;
}
.data-table tr {
    border-bottom: 1px solid silver;
}
.table td, .table th {
    padding: .75rem;
    vertical-align: top;
    border-top: 1px solid #dee2e6;
}
.table-sm td, .table-sm th {
    padding: .3rem;
}
.table thead th {
    vertical-align: bottom;
    border-bottom: 2px solid #dee2e6;
}
.table .thead-light th {
    color: #495057;
    background-color: #e9ecef;
    border-color: #dee2e6;
}
table {
    border-collapse: collapse;
}
.table {
    width: 100%;
    margin-bottom: 1rem;
    color: #212529;
}
th {
    display: table-cell;
    vertical-align: inherit;
    font-weight: bold !important;
    text-align: -internal-center;
    unicode-bidi: isolate;
}
.sol {
    font-weight: bold;
    font-variant: small-caps;
}
.sol_queued {
    color: gray;
}
.sol_incorrect, .compile-unsuccessful {
    color: red;
}
.sol_correct, .compile-successful {
    color: green;
}
.probid, .langid {
    font-variant: small-caps;
}
.data-table td a, .data-table td a:hover {
    display: block;
    text-decoration: none;
    color: inherit;
    padding: 3px 5px;
}
.table-striped tbody tr:nth-of-type(odd) {
    background-color: rgba(0, 0, 0, .05);
}
body {
    color: var(--text-color);
    background-color: var(--background-color);
    font-family: Roboto, sans-serif !important;
    padding-bottom: 4em;
    padding-top: 4.5rem;
}

div {
    display: block;
    unicode-bidi: isolate;
}
.navbar-collapse {
    -ms-flex-preferred-size: 100%;
    flex-basis: 100%;
    -ms-flex-positive: 1;
    flex-grow: 1;
    -ms-flex-align: center;
    align-items: center;
}
ul {
    display: block;
    list-style-type: disc;
    margin-block-start: 1em;
    margin-block-end: 1em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    padding-inline-start: 40px;
    unicode-bidi: isolate;
}
dl, ol, ul {
    margin-top: 0;
    margin-bottom: 1rem;
}
.mr-auto, .mx-auto {
    margin-right: auto !important;
}
.navbar-nav {
    display: -ms-flexbox;
    display: flex;
    -ms-flex-direction: column;
    flex-direction: row;
    padding-left: 0;
    margin-bottom: 0;
    list-style: none;
}
li {
    display: list-item;
    text-align: -webkit-match-parent;
    unicode-bidi: isolate;
}
#menuDefault ul li.nav-item {
    white-space: nowrap;
    white-space-collapse: collapse;
    text-wrap: nowrap;
}
#menuDefault {
    display: flex;
}
.nav-link {
    display: block;
    padding: .5rem 1rem;
}
.navbar-dark .navbar-nav .active>.nav-link, .navbar-dark .navbar-nav .nav-link.active, .navbar-dark .navbar-nav .nav-link.show, .navbar-dark .navbar-nav .show>.nav-link {
    color: #fff !important;
}
.navbar-dark .navbar-nav .nav-link {
    color: #FFFFFF80 !important;
    font-size: 16px;
}
.fa, .fa-brands, .fa-classic, .fa-regular, .fa-sharp, .fa-solid, .fab, .far, .fas {
    -moz-osx-font-smoothing: grayscale;
    -webkit-font-smoothing: antialiased;
    display: var(--fa-display, inline-block);
    font-style: normal;
    font-variant: normal;
    line-height: 1;
    text-rendering: auto;
}
.fa-classic, .fa-regular, .fa-solid, .far, .fas {
    font-family: "Font Awesome 6 Free";
}
.fa-solid, .fas {
    font-weight: 900;
}
a {
    color: #007bff;
    text-decoration: none;
    background-color: transparent;
}
.navbar-brand {
    display: inline-block;
    padding-top: .3125rem;
    padding-bottom: .3125rem;
    margin-right: 1rem;
    /* font-size: 1.25rem; */
    font-size: 20px !important;
    line-height: inherit;
    white-space: nowrap;
}
.navbar-dark .navbar-brand {
    color: #fff;
}
.navbar-dark .navbar-text {
    color: rgba(255, 255, 255, .5);
    font-size: 16px;
}
.navbar-text {
    display: inline-block;
    padding-top: .5rem;
    padding-bottom: .5rem;
}
nav {
    display: block;
    unicode-bidi: isolate;
}
.navbar {
    position: relative;
    justify-content: space-between;
    -ms-flex-pack: justify;
    -ms-flex-wrap: wrap;
    -ms-flex-align: center;
    align-items: center;
    flex-direction: row;
    display: flex;
    display: -ms-flexbox;
    padding-top: 8px;
    padding-right: 16px;
    padding-bottom: 8px;
    padding-left: 16px;
}
.bg-dark {
    background-color: #343a40 !important;
}
.fixed-top {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    z-index: 1030;
}

/* submit button */
.justify-content-center {
    -ms-flex-pack: center !important;
    justify-content: center !important;
}
.btn {
    display: inline-block;
    font-weight: 400;
    color: #212529;
    text-align: center;
    vertical-align: middle;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    background-color: transparent;
    border: 1px solid transparent;
    padding: 6px 12px;
    font-size: 16px;
    line-height: 1.5;
    border-radius: .25rem;
    transition: color .15s ease-in-out, background-color .15s ease-in-out, border-color .15s ease-in-out, box-shadow .15s ease-in-out;
}
.btn:not(:disabled):not(.disabled) {
    cursor: pointer;
}
.btn-success {
    color: #fff !important;
    background: #0a8927 !important;
}
.btn-info {
    color: #fff !important;
    background-color: #17a2b8  !important;
}
.score_pending {
    background: #6666FF !important;
}
.btn-secondary {
    color: #fff;
    background-color: #6c757d;
    border-color: #6c757d;
}
.modal-footer>* {
    margin: .25rem;
}
.btn-group-sm>.btn, .btn-sm {
    padding: .25rem .5rem;
    font-size: 14px;
    line-height: 1.5;
    border-radius: .2rem;
}
.modal-header {
    display: -ms-flexbox;
    display: flex;
    -ms-flex-align: start;
    align-items: flex-start;
    -ms-flex-pack: justify;
    justify-content: space-between;
    padding: 1rem 1rem;
    border-bottom: 1px solid #dee2e6;
    border-top-left-radius: calc(.3rem - 1px);
    border-top-right-radius: calc(.3rem - 1px);
}
.modal-title {
    margin-bottom: 0;
    line-height: 1.5;
}
.modal-header .close {
    padding: 1rem 1rem;
    margin: -1rem -1rem -1rem auto;
}
button.close {
    padding: 0;
    background-color: transparent;
    border: 0;
}
.close {
    float: right;
    font-size: 1.5rem;
    font-weight: 700;
    line-height: 1;
    color: #000;
    text-shadow: 0 1px 0 #fff;
    opacity: .5;
}
[type=button], [type=reset], [type=submit], button {
    -webkit-appearance: button;
}
button, select {
    text-transform: none;
}

button, input {
    overflow: visible;
}
button, input, optgroup, select, textarea {
    margin: 0;
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
}
button {
    border-radius: 0;
}

.close {
    color: #aaa;
    float: right;
    font-size: 28px;
    font-weight: bold;
}
.close:hover,
.close:focus {
    color: black;
    text-decoration: none;
    cursor: pointer;
}
.modal-open .modal {
    overflow-x: hidden;
    overflow-y: auto;
}
.modal {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1050;
    display: none;
    width: 100%;
    height: 100%;
    overflow: hidden;
    outline: 0;
}
.fade {
    transition: opacity .15s linear;
}
.modal-header {
    display: -ms-flexbox;
    display: flex;
    -ms-flex-align: start;
    align-items: flex-start;
    -ms-flex-pack: justify;
    justify-content: space-between;
    padding: 16px 16px;
    border-bottom: 1px solid #dee2e6;
    border-top-left-radius: calc(.3rem - 1px);
    border-top-right-radius: calc(.3rem - 1px);
}
.modal-body {
    position: relative;
    -ms-flex: 1 1 auto;
    flex: 1 1 auto;
    padding: 1rem;
}
form {
    display: block;
    margin-top: 0em;
    unicode-bidi: isolate;
}
.modal-content {
    position: relative;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-direction: column;
    flex-direction: column;
    width: 100%;
    pointer-events: auto;
    background-color: #fff;
    background-clip: padding-box;
    border: 1px solid rgba(0, 0, 0, .2);
    border-radius: 4.8px;
    outline: 0;
}
.modal-footer {
    display: -ms-flexbox;
    display: flex;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
    -ms-flex-align: center;
    align-items: center;
    -ms-flex-pack: end;
    justify-content: flex-end;
    padding: .75rem;
    border-top: 1px solid #dee2e6;
    border-bottom-right-radius: calc(.3rem - 1px);
    border-bottom-left-radius: calc(.3rem - 1px);
}
h5 {
    font-size: 20px !important;
}
.modal.fade .modal-dialog {
    transition: -webkit-transform .3s ease-out;
    transition: transform .3s ease-out;
    transition: transform .3s ease-out, -webkit-transform .3s ease-out;
    -webkit-transform: translate(0, -50px);
    transform: translate(0, -50px);
}
.modal.show .modal-dialog {
    -webkit-transform: none;
    transform: none;
}
.modal-dialog {
    position: relative;
    width: auto;
    margin: .5rem;
    pointer-events: none;
}
@media (min-width: 576px) {
    .modal-dialog {
        max-width: 500px;
        margin: 1.75rem auto;
    }
}
@media (min-width: 992px) {
    .modal-lg, .modal-xl {
        max-width: 800px;
    }
}
label {
    display: inline-block;
    margin-bottom: .5rem;
}
label {
    cursor: default;
}
.form-group {
    margin-bottom: 1rem;
}
.custom-file {
    position: relative;
    display: inline-block;
    width: 100%;
    height: calc(1.5em + .75rem + 2px);
    margin-bottom: 0;
}
input:not([type="image" i], [type="range" i], [type="checkbox" i], [type="radio" i]) {
    overflow-clip-margin: 0px !important;
    overflow: clip !important;
}
input[type="file" i] {
    appearance: none;
    background-color: initial;
    cursor: default;
    align-items: baseline;
    color: inherit;
    text-overflow: ellipsis;
    text-align: start !important;
    padding: initial;
    border: initial;
    white-space: pre;
}
input {
    font-style: ;
    font-variant-ligatures: ;
    font-variant-caps: ;
    font-variant-numeric: ;
    font-variant-east-asian: ;
    font-variant-alternates: ;
    font-variant-position: ;
    font-weight: ;
    font-stretch: ;
    font-size: ;
    font-family: ;
    font-optical-sizing: ;
    font-size-adjust: ;
    font-kerning: ;
    font-feature-settings: ;
    font-variation-settings: ;
    text-rendering: auto;
    color: fieldtext;
    letter-spacing: normal;
    word-spacing: normal;
    line-height: normal;
    text-transform: none;
    text-indent: 0px;
    text-shadow: none;
    display: inline-block;
    text-align: start;
    appearance: auto;
    -webkit-rtl-ordering: logical;
    cursor: text;
    background-color: field;
    margin: 0em;
    padding: 1px 0px;
    border-width: 2px;
    border-style: inset;
    border-color: light-dark(rgb(118, 118, 118), rgb(133, 133, 133));
    border-image: initial;
    padding-block: 1px;
    padding-inline: 2px;
}
.text-muted {
    color: #6c757d !important;
}
.text-truncate {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
file-label, .custom-select {
    transition: background-color .15s ease-in-out, border-color .15s ease-in-out, box-shadow .15s ease-in-out;
}
.custom-select {
    display: inline-block;
    width: 100%;
    height: calc(1.5em + .75rem + 2px);
    padding: .375rem 1.75rem .375rem .75rem;
    font-size: 14px;
    font-weight: 400;
    line-height: 1.5;
    color: #495057;
    vertical-align: middle;
    border: 1px solid #ced4da;
    border-radius: .25rem;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
}
.form-control {
    display: block;
    width: 100%;
    height: calc(1.5em + .75rem + 2px);
    padding: .375rem .75rem;
    font-size: 14px;
    font-family: Roboto, sans-serif;
    font-weight: 400;
    line-height: 1.5;
    color: #495057;
    background-color: #fff;
    background-clip: padding-box;
    border: 1px solid #ced4da;
    border-radius: .25rem;
    transition: border-color .15s ease-in-out, box-shadow .15s ease-in-out;
}
select {
    word-wrap: normal;
}
.custom-file-label {
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    z-index: 1;
    height: calc(1.5em + .75rem + 2px);
    padding: .375rem .75rem;
    overflow: hidden;
    font-weight: 400;
    line-height: 1.5;
    color: #495057;
    background-color: #fff;
    border: 1px solid #ced4da;
    border-radius: .25rem;
}
.custom-file-label::after {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 3;
    display: block;
    height: calc(1.5em + .75rem);
    padding: .375rem .75rem;
    line-height: 1.5;
    color: #495057;
    content: "Browse";
    background-color: #e9ecef;
    border-left: inherit;
    border-radius: 0 .25rem .25rem 0;
}
.alert-warning {
    color: #856404;
    background-color: #fff3cd;
    border-color: #ffeeba;
}
.alert {
    position: relative;
    padding: .75rem 1.25rem;
    margin-bottom: 1rem;
    border: 1px solid transparent;
    border-radius: .25rem;
}
option {
    font-weight: normal;
    display: block;
    padding-block-start: 0px;
    padding-block-end: 1px;
    min-block-size: 1.2em;
    padding-inline: 2px;
    white-space: nowrap;
}
.modal-backdrop.fade {
    opacity: 0;
}
.modal-backdrop.show {
    opacity: .5;
}
.modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1040;
    width: 100vw;
    height: 100vh;
    background-color: #000;
}
`;

GM_addStyle(css);

let contestStartTime = -1;
// let contestStartTime = 1726755078;
let blueLine;
let submissionResult;
let contestProblems, contestProblemName, gymRound;
let teamname, rank, penalty, score;
let problemStatus = {};
let timerInterval;
let submitForm;
let contestLength = 18000;

function getCurrentURL () {
    return window.location.href;
}

function parseLanguage(language){
    if(language.startsWith('C++')){
        return "CPP";
    }
    if(language.startsWith('Py')){
        return "PY3";
    }
    return language;
}

function parseVerdict(verdict){
    if(verdict == "OK") return "CORRECT";
    if(verdict == "WRONG_ANSWER")   return "WRONG-ANSWER";
    if(verdict == "TIME_LIMIT_EXCEEDED") return "TIMELIMIT";
    if(verdict == "RUNTIME_ERROR") return "RUN-ERROR";
    if(verdict == "MEMORY_LIMIT_EXCEEDED") return "RUN-ERROR";
    if(verdict == "COMPILATION_ERROR")  return "COMPILER-ERROR";
    if(verdict == "TESTING")  return "PENDING";
    return "PENDING";
}

function parseSubmission(result){
    submissionResult = [];
    for(let submission of result){
        if(contestStartTime <= submission.creationTimeSeconds && submission.creationTimeSeconds - contestStartTime < contestLength){
            const date = new Date(submission.creationTimeSeconds * 1000);
            submissionResult.push({
                index: submission.problem.index,
                verdict: parseVerdict(submission.verdict),
                time: date.getHours().toString().padStart(2, '0')+":"+date.getMinutes().toString().padStart(2, '0'),
                submitMinute: Math.floor(submission.relativeTimeSeconds/60),
                language: parseLanguage(submission.programmingLanguage)
            });
        }
    }
    const reversedSubmissionResult = submissionResult.slice().reverse();
    for(let submission of reversedSubmissionResult){
        if(submission.index in problemStatus){
            if(submission.verdict == "CORRECT"){
                if(problemStatus[submission.index].passtime == -1)
                    problemStatus[submission.index].passtime = submission.submitMinute;
            }
            else if(submission.verdict == "PENDING"){
                problemStatus[submission.index].pendingNumber = problemStatus[submission.index].pendingNumber+1;
                if(problemStatus[submission.index].pending == -1)
                    problemStatus[submission.index].pending = submission.submitMinute;
            }
            else{
                problemStatus[submission.index].rejected = problemStatus[submission.index].rejected + (submission.verdict == "COMPILER-ERROR" ? 0 : 1);
            }
        }
        else{
            let newStatus;
            if(submission.verdict == "PENDING"){
                newStatus = {
                    rejected: 0,
                    passtime: -1,
                    pending: submission.submitMinute,
                    pendingNumber: 1
                }
            }
            else if(submission.verdict != "CORRECT"){
                newStatus = {
                    rejected: submission.verdict == "COMPILER-ERROR" ? 0 : 1,
                    passtime: -1,
                    pending: -1,
                    pendingNumber: 0
                }
            }
            else{
                newStatus = {
                    rejected: 0,
                    passtime: submission.submitMinute,
                    pending: -1,
                    pendingNumber: 0
                }
            }
            problemStatus[submission.index] = newStatus;
        }
    }
}

async function getApiData () {
    domjudgeView();
    gymRound = getCurrentURL().split('/')[4];
    // console.log(gymRound);

    let links = document.querySelectorAll('a'), username;
    // 取得 username
    for (let link of links) {
        if (link.href.includes('/profile/')) {
            username = link.href.split('/')[4];
            break;
        }
    }

    const SubmissionApiURL = 'https://codeforces.com/api/contest.status?contestId=' + gymRound + '&handle=' + username;
    // console.log(SubmissionApiURL);

    await fetch(SubmissionApiURL)
        .then(response => response.json())  // 將回應轉為 JSON 格式
        .then(data => {
        if (data.result && data.result.length > 0) {
            if("startTimeSeconds" in data.result[0].author)
                contestStartTime = data.result[0].author.startTimeSeconds;
            parseSubmission(data.result);
            // return data.result[0].creationTimeSeconds;
        } else {
            console.log("No result found in Submission API response");
        }
    })
        .then(() => drawHeader())
        .catch(error => {
        console.error("Error fetching API:", error);
    });

    const ContestApiURL = 'https://codeforces.com/api/contest.standings?contestId=' + gymRound + '&from=1&showUnofficial=true';
    // console.log(ContestApiURL);

    await fetch(ContestApiURL)
        .then(response => response.json())  // 將回應轉為 JSON 格式
        .then(data => {
        if (data.result) {
            contestLength = data.result.contest.durationSeconds;

            contestProblems = [];
            for(let problem of data.result.problems){
                contestProblems.push(problem.index);
            }

            contestProblemName = [];
            for(let problem of data.result.problems){
                contestProblemName.push(problem.index + " - " + problem.name);
            }

            for(let team of data.result.rows){
                if(team.party.members.some(item => item.handle === username)){
                    penalty = team.penalty;
                    rank = team.rank;
                    score = team.points;
                    if("teamName" in team.party)
                        teamname = team.party.teamName;
                    else
                        teamname = username;
                    break;
                }
            }
        } else {
            console.log("No result found in Contest API response");
        }
    })
        .then(() => drawTimeLine())
        .then(() => updateTimeLine())
        .then(() => drawTeamsSummary())
        .then(() => drawSubmission())
        .then(() => addSubmitPage())
        .then(() => submitButtomJquery());
    // .catch(error => {
    //     console.error("Error fetching API:", error);
    // });

    timerInterval = setInterval(updateTimer, 1000);
}

function updateTimeLine(){
    if(contestStartTime == -1)  return;
    // console.log((Date.now() / 1000 - contestStartTime), contestLength);
    let contestDuringPrecentage = (Date.now() / 1000 - contestStartTime) / contestLength;
    // contestDuringPrecentage = Math.random();
    if(contestDuringPrecentage > 1) {
        return;
    }
    let pageWidth = window.innerWidth;
    let blueLineWidth = contestDuringPrecentage * pageWidth;
    blueLine.style.width = blueLineWidth + 'px'; // 設定寬度
}

function addFontAwesome(){
    // 獲取頁面中的 <header> 元素
    let header = document.querySelector('head');

    // 創建一個新的 <script> 元素
    let scriptElement = document.createElement('script');

    // 設置 <script> 標籤的屬性
    scriptElement.src = "https://cdnjs.cloudflare.com/ajax/libs/jquery/1.8.3/jquery.min.js"
    scriptElement.type = "text/javascript";

    let linkElement = document.createElement('link');

    // 設置 <link> 標籤的屬性
    linkElement.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/css/all.min.css";
    linkElement.rel = "stylesheet";
    linkElement.type = "text/css";
    //linkElement.type = "text/javascript";

    // 將 <link> 標籤添加到 <head> 中


    // 將 <script> 元素添加到 <header> 中
    if (header) {
        header.appendChild(scriptElement);
        header.appendChild(linkElement);
    }
}
function drawTimeLine(){
    if(contestStartTime == -1)  return;
    let contestDuringPrecentage = (Date.now() / 1000 - contestStartTime) / contestLength;
    // contestDuringPrecentage = 0.5;
    if(contestDuringPrecentage > 1) {
        return;
    }
    let pageWidth = window.innerWidth;
    let blueLineWidth = contestDuringPrecentage * pageWidth;

    blueLine = document.createElement('div');
    blueLine.style.position = 'absolute';
    blueLine.style.bottom = '0';
    blueLine.style.left = '0';
    blueLine.style.height = '5.5px'; // 可以調整高度
    blueLine.style.backgroundColor = '#0079ff';
    blueLine.style.zIndex = '9999'; // 保證藍線在最上層
    blueLine.style.width = blueLineWidth + 'px'; // 設定寬度
    document.querySelector('nav').appendChild(blueLine);

}

function drawHeader(){
    document.getElementById('body').style.margin = "0";

    // 選擇所有的 <a> 元素
    let links = document.querySelectorAll('a');
    let LogoutLink;

    // 遍歷每個 <a>，檢查其 innerHTML 是否包含 "Logout"
    links.forEach(link => {
        if (link.innerHTML.includes('Logout')) {
            // console.log(link); // 找到的 <a> 元素會被輸出到控制台
            LogoutLink = link;
        }
    });

    document.getElementById('header').remove();
    document.querySelector('.menu-list-container').remove();
    document.querySelector('.menu-box').remove();
    document.querySelector('.alert-success').remove();

    let baseUrl = getCurrentURL().split('/').slice(0, 5).join('/');

    let navElement = document.createElement('nav');
    navElement.classList.add('navbar','navbar-expand-md','navbar-dark','bg-dark','fixed-top');

    let navHTML = "";

    navHTML = `<a class="navbar-brand hidden-sm-down" href="${baseUrl}/submit">DOMjudge</a>`;

    navHTML += '<div class="collapse navbar-collapse" id="menuDefault">';
    navHTML += '<ul class="navbar-nav mr-auto">';
    navHTML += `<li class="nav-item active"><a class="nav-link" href="${baseUrl}/submit"><i class="fas fa-home"></i> Home </a></li>`;
    navHTML += `<li class="nav-item"><a class="nav-link" href="${baseUrl}"><i class="fas fa-book-open"></i> Problemset </a></li>`;
    navHTML += `<li class="nav-item"><a class="nav-link" href="${baseUrl}/standings"><i class="fas fa-list-ol"></i> Scoreboard </a></li>`;

    navHTML += '</ul>';
    navHTML += '<div id="submitbut"><a id="submitLink" class="nav-link justify-content-center" data-ajax-modal="" data-ajax-modal-after="initSubmitModal" href="#"><span class="btn btn-success btn-sm"><i class="fas fa-cloud-upload-alt"></i> Submit</span></a></div>';
    navHTML += `<a class="btn btn-info btn-sm justify-content-center" href="${LogoutLink}" onclick="return confirmLogout();"><i class="fas fa-sign-out-alt"></i> Logout</a>`;
    navHTML += `<div class="navbar-text" style="white-space:nowrap;"><span style="padding-left: 10px;"><i class="fas fa-clock loading-indicator"></i></span><span id="timeleft"> contest over</span></div>`;
    navHTML += '</div>';

    navElement.innerHTML = navHTML;

    let bodyDiv = document.getElementById('body');
    bodyDiv.insertBefore(navElement, bodyDiv.firstChild);
}

function updateTimer(){
    if(Math.floor(Date.now()/1000) - contestStartTime > contestLength){
        document.getElementById("timeleft").innerHTML = " contest over";
        clearInterval(timerInterval); // 倒數結束時停止計時
    }
    else{
        let leftSecond = contestLength - (Math.floor(Date.now()/1000) - contestStartTime);
        let minutes = (Math.floor((leftSecond%3600)/60));
        let seconds = leftSecond%60;
        let displayMinutes = minutes < 10 ? '0' + minutes : minutes;
        let displaySeconds = seconds < 10 ? '0' + seconds : seconds;
        if(leftSecond > 3600)
            document.getElementById("timeleft").innerHTML = " " + Math.floor(leftSecond/3600).toString() + ":" + displayMinutes + ":" + displaySeconds;
        else
            document.getElementById("timeleft").innerHTML = " " + displayMinutes + ":" + displaySeconds;
    }
}

function drawTeamsSummary(){
    // console.log(contestProblems);

    let tableHTML = '<table class="summary-table center">';

    // Table Header
    tableHTML += '<colgroup><col id="scorerank"><col id="scoreteamname"></colgroup>';
    tableHTML += '<colgroup><col id="scoresolv"><col id="scoretotal"></colgroup>';
    tableHTML += '<colgroup>';
    for(let i = 0; i < contestProblems.length; i++){
        tableHTML += '<col class="scoreprob"';
    }
    tableHTML += '</colgroup>';
    tableHTML += '<thead><tr class="summary-table-header">';
    tableHTML += '<th title="rank" scope="col">rank</th>';
    tableHTML += '<th title="team name" scope="col" colspan="3">team</th>';
    tableHTML += '<th title="# solved / penalty time" colspan="2" scope="col">score</th>';
    // tableHTML += '<th style="text-align: center;">score</th>';
    contestProblems.forEach(problemIndex => {
        const linkURL = `https://codeforces.com/gym/${gymRound}/problem/${problemIndex.toString()}`;
        tableHTML += `<th title="" scope="col"><a href="${linkURL}" target="_blank"><span class="badge problem-badge" style="min-width: 28px; border: 1px solid"><span style="color: #000000;">${problemIndex}</span></span></a></th>`;
    });
    tableHTML += '</tr></thead><tbody>';

    tableHTML += '<tr class="sortorderswitch">';
    tableHTML += `<td class="scorepl">${rank}</td>`;
    tableHTML += `<td class="scoreaf"> </td>`;
    tableHTML += `<td class="scoreaf"> </td>`;
    tableHTML += `<td class="scoretn">${teamname}</td>`;
    // tableHTML += `<td class="score-penalty-table"><div>${score}</div><div>${penalty}</div></td>`;
    tableHTML += `<td class="scorenc">${score}</td>`;
    tableHTML += `<td class="scorett">${penalty}</td>`;

    contestProblems.forEach(problemIndex => {
        if(!(problemIndex in problemStatus))
            tableHTML += `<td class="score_cell"></td>`;
        else if(problemStatus[problemIndex].passtime != -1){
            // console.log(problemIndex, problemStatus[problemIndex].passtime, problemStatus[problemIndex].pending, problemStatus[problemIndex].pendingNumber);
            if(problemStatus[problemIndex].passtime > problemStatus[problemIndex].pending && problemStatus[problemIndex].pendingNumber != 0){
                const tryTime = problemStatus[problemIndex].rejected;
                const tryString = tryTime.toString() + " + " + (problemStatus[problemIndex].pendingNumber).toString() + " tries";
                tableHTML += `<td class="score_cell"><a><div style="background:#6666FF">&nbsp;<span>${tryString}</span></div></a></td>`;
            }
            else{
                const tryTime = problemStatus[problemIndex].rejected+1;
                const tryString = tryTime.toString() + (tryTime > 1 ? " tries" : " try");
                tableHTML += `<td class="score_cell"><a><div style="background:#60e760">${problemStatus[problemIndex].passtime}<span>${tryString}</span></div></a></td>`;
            }
        }
        else if(problemStatus[problemIndex].pendingNumber != 0){
            const tryTime = problemStatus[problemIndex].rejected;
            const tryString = tryTime.toString() + " + " + (problemStatus[problemIndex].pendingNumber).toString() + " tries";
            tableHTML += `<td class="score_cell"><a><div style="background:#6666FF">&nbsp;<span>${tryString}</span></div></a></td>`;
        }
        else{
            const tryTime = problemStatus[problemIndex].rejected;
            const tryString = tryTime.toString() + (tryTime > 1 ? " tries" : " try");
            tableHTML += `<td class="score_cell"><a><div style="background:#e87272">&nbsp;<span>${tryString}</span></div></a></td>`;
        }

    });
    tableHTML += '</tr>';

    tableHTML += '</tbody></table>';

    submitForm = document.getElementById('pageContent').getElementsByTagName('form')[0];

    document.getElementById('pageContent').innerHTML = tableHTML;

}
function drawSubmission(){
    let tableHTML = '<div class="row><div class="col">';

    tableHTML += '<h1 class="teamoverview">Submissions</h1>';
    tableHTML += '<table class="data-table table table-hover table-striped table-sm submissions-table">'

    tableHTML += '<thead class="thead-light"><tr><th scope="col">time</th><th scope="col">problem</th><th scope="col">lang</th><th scope="col">result</th></tr></thead>';

    tableHTML += '<tbody>';

    submissionResult.forEach(Submission =>{
        tableHTML += '<tr class>';
        tableHTML += `<td>${Submission.time}</td>`;
        tableHTML += `<td class="probid"><a><span class="badge problem-badge" style="min-width: 28px;border: 1px solid #7293a8";><span>${Submission.index}</span></span><a></td>`;
        tableHTML += `<td class="langid"><a>${Submission.language}</a></td>`;
        if(Submission.verdict == "CORRECT")
            tableHTML += `<td class="sol sol_correct"><a>${Submission.verdict}</a></td>`;
        else if(Submission.verdict == "PENDING")
            tableHTML += `<td class="sol sol_queued"><a>${Submission.verdict}</a></td>`;
        else
            tableHTML += `<td class="sol sol_incorrect"><a>${Submission.verdict}</a></td>`;
        tableHTML += '</tr>';
    });

    tableHTML += '</tbody></table>';
    tableHTML += '</div></div>';

    document.getElementById('pageContent').innerHTML += tableHTML;
    document.getElementById('sidebar').innerHTML = "";
}

addFontAwesome();
getApiData();

function domjudgeView() {
    // 遍歷所有的文本節點
    let walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
    let node, nextNode;

    while (node = walker.nextNode()) {
        // 檢查節點是否包含 'on test'
        let textContent = node.nodeValue;
        let index = textContent.indexOf(' ON TEST');

        if (index !== -1) {
            // 刪除 'on test' 及其後面的所有內容
            node.nodeValue = textContent.substring(0, index);
            nextNode = walker.nextNode();
            nextNode.nodeValue = "";
        }
        else{
            let pretestIndex = textContent.indexOf(' ON PRETEST');
            if (pretestIndex !== -1) {
                // 刪除 'on pretest' 及其後面的所有內容
                node.nodeValue = textContent.substring(0, pretestIndex);
                nextNode = walker.nextNode();
                nextNode.nodeValue = "";
            }
        }
    }
}

domjudgeView();

// 監聽 DOM 的變化以處理動態更新的內容
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        // 針對新增的節點，重新執行移除操作
        if (mutation.addedNodes.length) {
            // chrome.storage.sync.get(['featureEnabled'], function (result) {
            //     if (result.featureEnabled) {
            //         domjudgeView();
            //         updateTimeLine();
            //     }
            // });
            domjudgeView();
            updateTimeLine();
        }
    });
});

// 配置監聽器參數
const observerConfig = {
    childList: true,  // 監聽子節點變動
    subtree: true,    // 監聽整個子樹
    characterData: true  // 監聽文字內容變動
};

// 啟動監聽器
observer.observe(document.body, observerConfig);

function humanReadableTimeDiff(seconds) {
    var intervals = [
        ['years', 365 * 24 * 60 * 60],
        ['months', 30 * 24 * 60 * 60],
        ['days', 24 * 60 * 60],
        ['hours', 60 * 60],
        ['minutes', 60],
    ];
    for (let [name, length] of intervals) {
        if (seconds / length >= 2) {
            return Math.floor(seconds/length) + ' ' + name;
        }
    }
    return Math.floor(seconds) + ' seconds';
}

function humanReadableBytes(bytes) {
    var sizes = [
        ['GB', 1024*1024*1024],
        ['MB', 1024*1024],
        ['KB', 1024],
    ];
    for (let [name, length] of sizes) {
        if (bytes / length >= 2) {
            return Math.floor(bytes/length) + name;
        }
    }
    return Math.floor(bytes) + 'B';
}

function addSubmitPage(){
    // 創建模態框的 HTML

    let submitTable = submitForm.querySelector('tbody');
    let rows = submitTable.querySelectorAll('tr');

    submitTable.insertBefore(rows[4], rows[0]);
    submitTable.removeChild(rows[3]);

    submitForm.querySelector('.field-name').innerHTML = "Source files";
    submitForm.querySelector('.programTypeNotice').remove();
    submitForm.querySelector('.outputOnlyProgramTypeIdNotice').remove();
    submitForm.querySelector(".error__submittedProblemIndex").remove();

    let submitButInput = submitTable.querySelector(".submit");
    let buttonElement = document.createElement("button");
    buttonElement.id = submitButInput.id;
    buttonElement.type = submitButInput.type;
    buttonElement.className = submitButInput.className;
    buttonElement.innerHTML = `<i class="fas fa-cloud-upload-alt"></i> Submit `;
    // submitTable.replaceChild(buttonElement, submitButInput);

    buttonElement.classList.add('btn');
    buttonElement.classList.add('btn-success');


    const allowedLanguage = ["43", "89", "87", "31"];
    const languageName = ["C", "CPP", "JAVA", "PYTHON3"];

    const selectElement = submitForm.querySelector('select[name="programTypeId"]');
    Array.from(selectElement.options).forEach(option => {
        if (!allowedLanguage.includes(option.value)) {
            option.remove();
        }
        else{
            for(let i = 0; i < allowedLanguage.length; i++){
                if(allowedLanguage[i] == option.value){
                    option.innerHTML = languageName[i];
                    option.removeAttribute('selected');
                    break;
                }
            }
        }
    });

    const noLanguageOption = document.createElement('option');
    noLanguageOption.value = "0";
    noLanguageOption.text = "Select a language";
    noLanguageOption
    selectElement.insertBefore(noLanguageOption, selectElement.firstChild);

    // console.log(submitForm.outerHTML);

    // <span class="close">&times;</span>

    submitForm.querySelector('select[name="submittedProblemIndex"]').querySelector('option[value=""]').remove();
    let submit_problem_option = submitForm.querySelector('select[name="submittedProblemIndex"]').innerHTML;
    let csrf_token_input = submitForm.querySelector('input[name="csrf_token"]').outerHTML;
    // console.log(submit_problem_option);

    const modalHTML = `<div id="myModal" class="modal fade show" tabindex="-1" role="dialog" aria-modal="true" style="display: none;">
    <div class="modal-dialog modal-lg" role="document"><div class="modal-content"><div class="modal-header"><h5 class="modal-title">Submit</h5><button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button></div>
<form class="submit-form" name="csrf_token" method="post" action="/team/submit" enctype="multipart/form-data">`
    + csrf_token_input +
          `<input type="hidden" name="ftaa" value="">
    <input type="hidden" name="bfaa" value="">
    <input type="hidden" name="action" value="submitSolutionFormSubmitted">
    <div class="modal-body">
    <div class="form-group"><label for="submit_problem_code" class="required">Source files</label><div class="custom-file"><input type="file" id="submit_problem_code" name="sourceFile" required="required" class="custom-file-input custom-file-input"><label class="custom-file-label text-truncate text-muted" for="submit_problem_code">No file selected</label></div></div>
    <div class="alert alert-warning" id="files_not_modified" style="display:none;"></div>
    <div class="form-group"><label class="required" for="submit_problem_problem">Problem</label><select id="submit_problem_problem" name="submittedProblemIndex" required="required" class="form-control custom-select form-control"><option value="" selected="selected">Select a problem</option>` + submit_problem_option + `</select></div>
    <div class="form-group"><label class="required" for="submit_problem_language">Language</label><select id="submit_problem_language" name="programTypeId" required="required" class="form-control custom-select form-control"><option value="" selected="selected">Select a language</option><option value="43">C</option><option value="89">C++</option><option value="87">Java</option><option value="31">Python 3</option></select></div></div>
    <div class="modal-footer"><button id="cancelBtn" type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button><button type="submit" class="btn-success btn"><i class="fas fa-cloud-upload-alt"></i> Submit </button></div><input type="hidden" name="_tta" value="396"></form></div></div>
    </div>`;

    // 插入模態框到頁面中
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    $(function () {
        $('body').on('change', '.custom-file-input', function () {
            var files = this.files;
            var fileNames = [];
            for (var i = 0; i < files.length; i++) {
                fileNames.push(files.item(i).name);
            }
            $(this).next('.custom-file-label').html(fileNames.join(", "));
            $(this).next('.custom-file-label').removeClass('text-muted');
        });
    });

    const fileInput = document.getElementById('submit_problem_code');
    fileInput.addEventListener('change', (event) => {

        const five_minutes_in_ms = 5 * 60 * 1000;
        const now = Date.now();
        const filesNotModified = document.getElementById('files_not_modified');
        filesNotModified.style.display = 'none';

        var atLeastOneFileRecent = false;
        var fileInfoHtml = '';
        const files = event.target.files;
        for (let file of files) {
            const date = new Date(file.lastModified);
            const ago = humanReadableTimeDiff((now - date)/1000) + ' ago';
            if (date > now - five_minutes_in_ms) {
                atLeastOneFileRecent = true;
            }
            let size = humanReadableBytes(file.size);
            fileInfoHtml += `<li><span class="filename">${file.name}</span>, ${size}, last modified ${ago}</li>`;
        }
        if (!atLeastOneFileRecent) {
            filesNotModified.style.display = 'block';
            filesNotModified.innerHTML =
                'None of the selected files has been recently modified:' +
                '<ul>' + fileInfoHtml + '</ul>';
        }
    });

    const modal_backdrop_html = `<div class="modal-backdrop fade show" style="display:none;"></div>`;
    document.body.insertAdjacentHTML('beforeend', modal_backdrop_html);

    // 把 input 按鈕換成 button
    // submitButInput = document.getElementById("singlePageSubmitButton");
    // submitButInput.parentNode.insertBefore(buttonElement, submitButInput);
    // submitButInput.remove();

    // 獲取模態框和觸發連結
    const modal = document.getElementById('myModal');
    const openModal = document.getElementById('submitbut');
    const closeModal = document.querySelector('.close');
    const cancelModal = document.getElementById('cancelBtn');
    const modal_backdrop = document.querySelector('.modal-backdrop');
    const filesNotModified = document.getElementById('files_not_modified');

    // 當用戶點擊連結時，顯示模態框
    openModal.addEventListener('click', function(event) {
        event.preventDefault(); // 防止連結跳轉
        modal.style.display = 'block';
        modal_backdrop.style.display = 'block';
    });

    // 當用戶點擊關閉按鈕時，隱藏模態框
    closeModal.addEventListener('click', function() {
        modal.style.display = 'none';
        modal_backdrop.style.display = 'none';
        filesNotModified.style.display = 'none';
    });

    // 當用戶點擊模態框外部時，隱藏模態框
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
            modal_backdrop.style.display = 'none';
            filesNotModified.style.display = 'none';
        }
    });

    cancelModal.addEventListener('click', function() {
        modal.style.display = 'none';
        modal_backdrop.style.display = 'none';
        filesNotModified.style.display = 'none';
    });
}


function getMainExtension(ext) {
    switch (ext) {
        case 'c':
            return '43';
        case 'cpp':
            return '89';
        case 'cc':
            return '89';
        case 'cxx':
            return '89';
        case 'c++':
            return '89';
        case 'java':
            return '87';
        case 'py':
            return '31';
        default:
            return '';
    }
}


function submitButtomJquery(){

    $(document).ready(function () {
        {
        }
        var processFile = function () {
            var filename = $('#submit_problem_code').val();
            if (filename !== '' && filename !== undefined) {
                filename = filename.replace(/^.*[\\\/]/, '');
                var parts = filename.split('.').reverse();
                if (parts.length < 2) return;
                var lcParts = [parts[0].toLowerCase(), parts[1].toLowerCase()];

                // language ID

                var language = document.getElementById('submit_problem_language');
                // the "autodetect" option has empty value
                if (language.value !== '') return;

                var langid = getMainExtension(lcParts[0]);
                for (i = 0; i < language.length; i++) {
                    if (language.options[i].value === langid) {
                        language.selectedIndex = i;
                    }
                }

                // Problem ID

                var problem = document.getElementById('submit_problem_problem');
                // the "autodetect" option has empty value
                if (problem.value !== '') {
                    return;
                }

                for (var i = 0; i < problem.length; i++) {
                    if (problem.options[i].text.split(/ - /)[0].toLowerCase() === lcParts[1]) {
                        problem.selectedIndex = i;
                    }
                }
            }
        };
        var $body = $('body');
        $body.on('change', '#submit_problem_code', processFile);
    });

    const form = document.querySelector('.submit-form');

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = new FormData(document.querySelector('.submit-form'));

        // for (const [key, value] of formData.entries()) {
        //     console.log(key, value);
        // }

        var langelt = document.getElementById("submit_problem_language");
        var language = langelt.options[langelt.selectedIndex].value;
        var languagetxt = langelt.options[langelt.selectedIndex].text;
        var fileelt = document.getElementById("submit_problem_code");
        var filenames = fileelt.files;
        var filename = filenames[0].name;
        var probelt = document.getElementById("submit_problem_problem");
        var problem = probelt.options[probelt.selectedIndex].value;
        var problemtxt = probelt.options[probelt.selectedIndex].text;

        var error = false;
        if (language === "") {
            langelt.focus();
            langelt.className = langelt.className + " errorfield";
            error = true;
        }
        if (problem === "") {
            probelt.focus();
            probelt.className = probelt.className + " errorfield";
            error = true;
        }
        if (filename === "") {
            error = true;
        }
        if (error) return false;

        var auxfileno = 0;
        // start at one; skip maincode file field
        for (var i = 1; i < filenames.length; i++) {
            if (filenames[i].value !== "") {
                auxfileno++;
            }
        }
        var extrafiles = '';
        if (auxfileno > 0) {
            extrafiles = "Additional source files: " + auxfileno + '\n';
        }
        var question =
            'Main source file: ' + filename + '\n' +
            extrafiles + '\n' +
            'Problem: ' + problemtxt + '\n' +
            'Language: ' + languagetxt + '\n' +
            '\nMake submission?';
        if(confirm(question)){
            fetch(getCurrentURL().split('/').slice(0, 5).join('/')+'/submit?csrf_token='+formData.get('csrf_token'), {
                method: form.method,
                body: formData,
            })
                .then(response => {
                if (response.ok) {
                    location.reload();

                } else {
                    console.error('submit fail');
                }
            });
        }
        // .catch(error => {
        //     console.error('error: ', error);
        // });
    });
}