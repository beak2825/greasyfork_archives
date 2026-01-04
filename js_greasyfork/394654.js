// ==UserScript==
// @name         CafeCoder Enhancer
// @namespace    iilj
// @version      2020.01.05.5
// @description  CafeCoder のUIを改善し，コンテストを快適にします（たぶん）
// @author       iilj
// @supportURL   https://github.com/iilj/CafeCodeEnhancer/issues
// @match        https://www.cafecoder.top/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/noty/3.1.4/noty.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.48.4/codemirror.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.48.4/mode/clike/clike.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.48.4/mode/python/python.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/list.js/1.5.0/list.js
// @resource     css_noty https://cdnjs.cloudflare.com/ajax/libs/noty/3.1.4/noty.css
// @resource     css_cm https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.48.4/codemirror.css
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/394654/CafeCoder%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/394654/CafeCoder%20Enhancer.meta.js
// ==/UserScript==

/* globals CodeMirror, Noty, List */

(function () {
    'use strict';

    GM_addStyle(GM_getResourceText('css_noty'));
    GM_addStyle(GM_getResourceText('css_cm'));
    GM_addStyle(`
/* h4 まわりの UI 改善 */
h4 {
    margin-top: 1rem;
    border-bottom: 2px solid lightblue;
    border-left: 10px solid lightblue;
    padding-left: 0.5rem;
}

/* ページ最下部のコンテンツが見やすいように調整する */
div.card {
    marginBottom: 30px;
}

/* コンテストページ上部のメニューを使いやすくする */
div.card-body a.nav-item.nav-link {
    border: 1px solid #bbbbbb;
    margin: 0.3rem;
    border-radius: 0.3rem;
    color: #007bff;
}
div.card-body a.nav-item.nav-link.cce-active {
    background-color: #ffffff;
    color: rgba(0,0,0,.5);
}
div.card-body a.nav-item.nav-link:hover{
    background-color: #dddddd;
}

/* 入出力サンプルのUI */
.cce-myprenode {
    display: block;
    margin: 0.4rem;
    padding: 0.4rem;
    background-color: #efefef !important;
    border: 1px solid #bbbbbb;
    border-radius: 0.4rem;
    font-family: Menlo,Monaco,Consolas,"Courier New",monospace;
}
.CodeMirror {
    border-top: 1px solid black;
    border-bottom: 1px solid black;
}

/* sortable table */
table.table th {
    padding: 6px;
    vertical-align: middle;
}
table.table tbody th {
    font-weight: normal; /* hotfix for unformal use of th tag */
    position: relative;
}
table thead th[data-sort] {
    cursor: pointer;
    color: #007bff;
}
table thead th[data-sort]:hover {
    background-color: #dddddd;
}
table thead th[data-sort].sort.desc:after {
    content: " ▲";
    color: #888;
}
table thead th[data-sort].sort.asc:after {
    content: " ▼";
    color: #888;
}

/* result icon */
span.result, th.result>span {
    display: inline;
    padding: .2em .6em .3em;
    font-size: 75%;
    font-weight: bold;
    line-height: 1;
    color: #fff;
    text-align: center;
    white-space: nowrap;
    vertical-align: baseline;
    border-radius: .25em;
    border: none;
    -webkit-text-stroke: unset;
    text-shadow: none;
    margin: 0;
    cursor: default;
}
.AC {
    background-color: #5cb85c;
}
.WA, .TLE {
    background-color: #f0ad4e;
}
.WJ {
    background-color: #777;
}

/* ranking page */
table.table.cce-ranking-table th {
    padding: 10px;
}
div.point {
    height: auto;
    width: auto;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateY(-50%) translateX(-50%);
    -webkit-transform: translateY(-50%) translateX(-50%);
}
div.point a {
    color: #00AA3E;
    font-weight: bold;
}
div.point span.submit_time {
    margin: 0 0 3px;
    color: #888;
    font-size: 90%;
    font-weight: normal;
}
table.table th.cce-ranking-username {
    font-weight: bold;
    width: auto;
    height: auto;
}
.cce-ranking-point div.point {
    color: blue;
    font-weight: bold;
}

/* icon */
@font-face {
	font-family: 'Glyphicons Halflings';
	src: url('https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/fonts/glyphicons-halflings-regular.eot');
	src: url('https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/fonts/glyphicons-halflings-regular.eot?#iefix') format('embedded-opentype'),
         url('https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/fonts/glyphicons-halflings-regular.woff2') format('woff2'),
         url('https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/fonts/glyphicons-halflings-regular.woff') format('woff'),
         url('https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/fonts/glyphicons-halflings-regular.ttf') format('truetype'),
         url('https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/fonts/glyphicons-halflings-regular.svg#glyphicons_halflingsregular') format('svg')
}
.glyphicon {
	position: relative;
	top: 1px;
	display: inline-block;
	font-family: 'Glyphicons Halflings';
	font-style: normal;
	font-weight: normal;
	line-height: 1;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
    margin-right: 0.2rem;
}
.glyphicon-home:before {
	content: "\\e021"
}
.glyphicon-tasks:before {
	content: "\\e137"
}
.glyphicon-sort-by-attributes-alt:before {
	content: "\\e156"
}
.glyphicon-user:before {
	content: "\\e008"
}
.glyphicon-list:before {
	content: "\\e056"
}
* {
	-webkit-box-sizing: border-box;
	-moz-box-sizing: border-box;
	box-sizing: border-box
}
*:before,
*:after {
	-webkit-box-sizing: border-box;
	-moz-box-sizing: border-box;
	box-sizing: border-box
}
    `);

    const msg = (type, text) => {
        new Noty({
            type: type,
            layout: 'top',
            timeout: 3000,
            text: text
        }).show();
    };

    const dqs = (selectors) => document.querySelector(selectors);
    const dqsa = (selectors) => document.querySelectorAll(selectors);

    // add title tag when there exists no title tag
    let result;
    if (!dqs("title")) {
        const title = document.createElement("title");
        let stitle = "";
        if (result = location.href.match(/www\.cafecoder\.top\/([^\/]+)\/(index\.(php|html?))?$/)) {
            stitle += `${result[1]} (${dqs("h1").innerText.trim()})`;
        } else if (result = location.href.match(/www\.cafecoder\.top\/([^\/]+)\/problem_list\.(php|html?)$/)) {
            stitle += `${result[1]} 問題一覧`;
        } else if (result = location.href.match(/www\.cafecoder\.top\/([^\/]+)\/Problems\/([^\/]+)\.(php|html?)$/)) {
            stitle += `${result[1]}-${result[2]}`;
            const h3 = dqs("h3");
            if (h3) {
                stitle += " " + h3.innerText.trim();
            }
        }
        stitle += (stitle == "" ? "" : " : ") + "CafeCoder";
        title.innerText = stitle;
        dqs("head").insertAdjacentElement('afterbegin', title);
    }

    // fix invalid/broken uri
    dqsa("a[href*='kakecoder.com']").forEach((lnk) => {
        lnk.href = lnk.href.replace('kakecoder.com', 'cafecoder.top');
    });
    dqsa("a[href*='.html']").forEach((lnk) => {
        lnk.href = lnk.href.replace('.html', '.php');
    });
    dqsa("a[href^='//'][href$='.php']").forEach((lnk) => {
        const href = lnk.getAttribute('href');
        if (result = href.match(/^\/\/([^\/]+)\.(php|html?)$/)) {
            lnk.setAttribute('href', href.replace('//', location.href.indexOf("/Problems/") != -1 ? '../' : './'));
        }
    });

    // add icon
    dqsa('div.card-body a.nav-item.nav-link').forEach((lnk) => {
        const href = lnk.getAttribute('href');
        let type = 'home';
        if (result = href.match(/([^\/]+).(php|html?)(\?[^/]+)?$/)) {
            const nm = result[1];
            switch (nm) {
                case 'index':
                    type = 'home';
                    break;
                case 'problem_list':
                    type = 'tasks';
                    break;
                case 'ranking':
                    type = 'sort-by-attributes-alt';
                    break;
                case 'my_submit':
                    type = 'user';
                    break;
                case 'all_submit':
                    type = 'list';
                    break;
            }
        }
        const icon = document.createElement("span");
        icon.classList.add('glyphicon', `glyphicon-${type}`);
        icon.setAttribute('aria-hidden', 'true');
        lnk.insertAdjacentElement('afterbegin', icon);
        if (lnk.href == location.href) {
            lnk.classList.add('cce-active');
        }
    });

    // when problem page
    if (location.href.indexOf("/Problems/") != -1 && dqs("h3") != null) {
        // improve UI/UX of I/O sample, and add sample copy button feature
        dqsa("span[style]:not([class]), pre[style]:not([class]), div[style]:not([class]), .sample").forEach((node, idx, _nodelist) => {
            if (!node.classList.contains('sample') && !node.style.backgroundColor && node.getAttribute("style").indexOf("background-color") == -1) {
                return;
            }
            node.classList.add('cce-myprenode');
            node.id = `cce-myprenode-${idx}`;
            if (node.firstChild.nodeName == "#text") {
                node.firstChild.data = node.firstChild.data.trim();
            }
            if (node.lastChild.nodeName == "#text") {
                node.lastChild.data = node.lastChild.data.trim();
            }

            let btn = document.createElement("button");
            btn.innerText = "テキストをコピー！";
            btn.classList.add('btn', 'btn-primary', 'copy-sample-input');
            btn.style.display = "block";
            btn.addEventListener("click", () => {
                const elem = document.getElementById(node.id);
                document.getSelection().selectAllChildren(elem);
                if (document.execCommand("copy")) {
                    msg('success', 'テキストをコピーしました！');
                    document.getSelection().removeAllRanges();
                } else {
                    msg('error', 'コピーに失敗してしまったようです．');
                }
            }, false);
            node.insertAdjacentElement('beforebegin', btn);
        });

        // CodeMirror init
        const textarea = dqs('form[name=submit_form] textarea[name=sourcecode]');
        const editor = CodeMirror.fromTextArea(textarea, {
            mode: "text/x-c++src",
            lineNumbers: true,
        });

        // CodeMirror lang selection changed event handler
        const selectlang = dqs('form[name=submit_form] select[name=language]');
        selectlang.addEventListener('change', (event) => {
            const modelist = [
                'text/x-csrc', 'text/x-c++src', 'text/x-java', 'python', 'text/x-csharp'
            ];
            editor.setOption("mode", modelist[event.target.selectedIndex]);
        });

        // select lang C++17 as a default
        selectlang.selectedIndex = 1;
        selectlang.classList.add('form-control');

        // CodeMirror submit preprocess, remove default broken event
        const submitbtn = dqs('form[name=submit_form] input[type=submit]');
        submitbtn.removeAttribute("onclick");
        submitbtn.classList.add('btn-primary');
        document.submit_form.addEventListener('submit', (event) => {
            editor.save();
            if (textarea.value == '') {
                msg('warning', 'ソースコードが入力されていません');
                event.preventDefault();
            }
        });
    } else if (location.href.indexOf("/all_submit.php?") != -1 || location.href.indexOf("/my_submit.php?") != -1) {
        // on submit list page
        const parent = dqs('div.card-body');
        parent.id = 'cce-list-parent';
        const table = parent.querySelector('table.table');
        table.classList.add('table-striped', 'small');

        const tbody = table.querySelector('tbody');
        tbody.classList.add('list');
        tbody.querySelectorAll('tr').forEach((tr) => {
            tr.querySelectorAll('th').forEach((td, idx, nodelist) => { /* unformal html (th here should be td) */
                if (idx == nodelist.length - 1) {
                    return;
                }
                td.classList.add(`cce-list-sort-${idx}`);
            });
        });

        parent.querySelector('thead').querySelectorAll('tr th').forEach((th, idx, nodelist) => {
            if (idx == nodelist.length - 1) {
                return;
            } else if (idx == 1) {
                th.classList.add('desc');
            }
            th.classList.add('sort');
            th.setAttribute('data-sort', `cce-list-sort-${idx}`);
        });
        const userList = new List(parent.id, {
            valueNames: ['cce-list-sort-0', 'cce-list-sort-1', 'cce-list-sort-2', 'cce-list-sort-3']
        });
    } else if (location.href.indexOf("/problem_list.") != -1) {
        // on contest problem list page
        const table = dqs('table.table');

        const thead = table.querySelector('thead tr');
        const th0 = document.createElement("th");
        th0.innerText = '#';
        thead.insertAdjacentElement('afterbegin', th0);

        table.querySelectorAll('tbody tr').forEach((tr) => {
            const tr0 = document.createElement("th");
            console.log(tr.querySelector('a[href]').href);
            const a0 = tr.querySelector('a[href]');
            if (result = a0.href.match(/\/([^\/])\.(php|html?)?$/)) {
                const pid = result[1];
                const a1 = document.createElement("a");
                a1.href = a0.href;
                a1.innerText = pid;
                tr0.insertAdjacentElement('afterbegin', a1);
            } else {
                tr0.innerText = '?';
            }
            tr.insertAdjacentElement('afterbegin', tr0);
        });
    } else if (location.href.indexOf("/ranking.php?") != -1) {
        // on contest ranking page
        const parent = dqs('div.card-body');
        parent.id = 'cce-list-parent';
        const table = parent.querySelector('table.table');
        table.classList.add('table-striped', 'small', 'cce-ranking-table');

        const tbody = table.querySelector('tbody');
        tbody.classList.add('list');
        tbody.querySelectorAll('tr').forEach((tr, tridx) => {
            let endtime = '00:00:00';
            const submit_time = document.createElement("span");
            submit_time.classList.add('submit_time');
            tr.querySelectorAll('th').forEach((td, idx, nodelist) => { /* unformal html (th here should be td) */
                if (idx == 1) {
                    td.classList.add('cce-ranking-username');
                } else if (idx == 2) {
                    td.classList.add('cce-ranking-point');
                    td.setAttribute('data-cce-list-sort-point', `${tridx}`);
                    const divpoint = td.firstElementChild;
                    divpoint.insertAdjacentHTML('beforeend', '<br>');
                    divpoint.insertAdjacentElement('beforeend', submit_time);
                } else if (idx >= 3) {
                    const timespan = td.querySelector('span.submit_time');
                    if (timespan) {
                        td.setAttribute('data-cce-list-sort-timespan', timespan.innerText);
                        if (timespan.innerText > endtime) {
                            endtime = timespan.innerText;
                        }
                    } else {
                        td.setAttribute('data-cce-list-sort-timespan', '99:99:99');
                    }
                }
                td.classList.add(`cce-list-sort-${idx}`);
            });
            submit_time.innerText = endtime;
        });

        parent.querySelector('thead').querySelectorAll('tr th').forEach((th, idx, nodelist) => {
            if (idx == 0) {
                th.classList.add('asc');
            }
            th.classList.add('sort');
            th.setAttribute('data-sort', `cce-list-sort-${idx}`);
        });
        const userList = new List(parent.id, {
            valueNames: ['cce-list-sort-0', 'cce-list-sort-1',
                { name: 'cce-list-sort-2', attr: 'data-cce-list-sort-point' },
                { name: 'cce-list-sort-3', attr: 'data-cce-list-sort-timespan' },
                { name: 'cce-list-sort-4', attr: 'data-cce-list-sort-timespan' },
                { name: 'cce-list-sort-5', attr: 'data-cce-list-sort-timespan' },
                { name: 'cce-list-sort-6', attr: 'data-cce-list-sort-timespan' },
                { name: 'cce-list-sort-7', attr: 'data-cce-list-sort-timespan' },
                { name: 'cce-list-sort-8', attr: 'data-cce-list-sort-timespan' }]
        });
    }
})();
