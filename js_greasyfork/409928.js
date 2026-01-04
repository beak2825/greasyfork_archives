// ==UserScript==
// @name         编程网格++
// @namespace    http://tampermonkey.net/
// @version      0.3.5
// @description  Enhance programming.pku.edu.cn
// @author       Guyutongxue
// @match        https://programming.pku.edu.cn/*
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/clipboard@2.0.8/dist/clipboard.min.js
// @downloadURL https://update.greasyfork.org/scripts/409928/%E7%BC%96%E7%A8%8B%E7%BD%91%E6%A0%BC%2B%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/409928/%E7%BC%96%E7%A8%8B%E7%BD%91%E6%A0%BC%2B%2B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Remove extra newline
    $('.highin,.highout').children('br').remove();

    // Add copy buttons
    if (location.pathname.endsWith("show.do")) {
        $('.fieldname').filter(function(i) {
            return $(this).text() === "例子输入";
        }).append(`<button class="copy-btn" data-clipboard-target=".highin">复制</button>`);
        $('.fieldname').filter(function(i) {
            return $(this).text() === "例子输出";
        }).append(`<button class="copy-btn" data-clipboard-target=".highout">复制</button>`);
        new ClipboardJS('.copy-btn');
    }

    // For loading ace editor
    function injectScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = reject;
            document.head.append(script);
        });
    }
    // Load Ace Editor before textarea
    let editor = null;
    function loadEditor() {
        const formJq = $('#submitInPage form');
        const srcTextarea = $('[name="sourceCode"]');
        srcTextarea.before(`<div id="aceEditor"></div>`);
        ace.config.set("basePath", "/x/ajax/libs/ace/1.4.9");
        ace.require("ace/ext/language_tools");
        editor = ace.edit("aceEditor");
        editor.setOptions({
            enableBasicAutocompletion: true,
            enableSnippets: true,
            enableLiveAutocompletion: true
        });
        editor.setTheme("ace/theme/xcode");
        editor.getSession().setMode("ace/mode/c_cpp");
        editor.setValue(srcTextarea.val());
        srcTextarea.parent().removeAttr('align');
        srcTextarea.hide();
        formJq.submit(function() {
            srcTextarea.val(editor.getValue());
            return true;
        });
    }
    if (location.pathname.endsWith("show.do")) {
        // Load editor
        injectScript('/x/ajax/libs/ace/1.4.9/ace.min.js')
            .then(() => injectScript('/x/ajax/libs/ace/1.4.9/ext-language_tools.min.js'))
            .then(loadEditor);

        // pgx & ocui
        const pgxLink = $('a[href^="/x/x.html"]').text("🧪").eq(1);
        const pgxHref = pgxLink.attr('href');
        pgxLink.parent().hide().before(`<span><a href="${pgxHref}" title="使用编程网格测试、提交程序">启动【编程网格X】</a>&nbsp;&nbsp;<a href="javascript:void 0" id="ocuiLink" title="仅限 C/C++">在线编译</a></span>`);
        $('#ocuiLink').click(() => {
            let code = "";
            if (editor !== null) {
                code = editor.getValue();
            }
            const param = new URLSearchParams();
            param.append('code', code)
            if ($('input[value="C"]').prop('checked')) {
                window.open(`https://guyutongxue.gitee.io/cppocui/c?${param}`);
            } else {
                window.open(`https://guyutongxue.gitee.io/cppocui?${param}`);
            }
        });

        // Select C++ and remove other
        $('input[value="C++"]').attr('checked', '');
        // .parent().parent().attr('title', '禁用“编程网格++”脚本以使用其它语言')
        $('input[value="Java"],input[value="Python"],label[for="Java"],label[for="Python"]').hide();
    }

    if (location.pathname.endsWith("solution.do")) {
        const pgxLink = $('a[href^="/x/x.html"]');
        const pgxHref = pgxLink.attr('href');
        const urlParam = new URLSearchParams(location.search);
        const solutionId = urlParam.get("solutionId");
        pgxLink.parent().html(`<span><a href="${pgxHref}" title="使用编程网格测试、提交程序">启动【编程网格X】</a></span>`);
        fetch(`/programming/problem/solution.do?solutionId=${solutionId}&sourceCode=text`)
            .then(r => r.text())
            .then(t => $('a[href^="/x/x.html"]').parent().append(`&nbsp;&nbsp;<a href="https://guyutongxue.gitee.io/cppocui?code=${encodeURIComponent(t)}" target="_blank">在线编译</a>`));
    }

    if (location.pathname.endsWith("showProblemList.do")) {
        $('a[href^="/x/x.html"]').text("🧪").attr("title", "在线测试提交");
    }
    if (location.pathname.endsWith("submit.history")) {
        $('a.ide').text("🧪");
        $('.listth').eq(4).text("🧪");
    }

    // Replace CSS
    if (location.pathname.endsWith("x.html")) return;
    $('link[type="text/css"]').remove();
    $(document.head).append(`
<style>
.header,
.menu,
.footer,
.leftMenu,
.text {
    font-size  : 14px;
    color      : #000;
    line-height: 24px;
}

.menu,
.leftMenu {
    line-height: 18px;
}

.text,
.footer {
    line-height: 20px;
}

.leftMenu {
    text-align: justify;
}

.text {
    color      : #444;
    line-height: 20px;
}

a {
    color          : #248;
    text-decoration: underline;
}

a.small {
    font-size: 11pt;
}

a:active {
    color: #a22;

}

a:hover {
    color: red;
}

a.item {
    color          : black;
    text-decoration: none;
}

a.item:active {
    color          : black;
    text-decoration: none;
}

a.item:hover {
    color          : red;
    text-decoration: underline;
}

a.gray {
    color          : gray;
    text-decoration: none;
}

a.gray:active {
    color          : gray;
    text-decoration: none;
}

a.gray:hover {
    color          : red;
    text-decoration: underline;
}

label.small {
    margin      : 0px 1px;
    border-width: 1px;
    padding     : 1px;
    font-size   : 11pt;
}

input.small {
    margin      : 0px 1px;
    border-width: 1px;
    padding     : 1px;
    font-size   : 9pt;
    border-color: #ccc;
}

.sampleData {
    background-color: #ff7;
}

.highlight,.highin {
    background-color: #ffa;
}

.highout {
    background-color: bisque;
}

.highstd {
    background-color: #eef;
}

.button {
    border-width: 1;
    padding     : 2 0 0;
}

.boxtitle {
    background-color: #ddf;
    color           : #000;
    padding         : 7;
    font-weight     : bold;
    font-size       : 12pt;
}

.boxsubmit {
    color    : #000;
    padding  : 5;
    font-size: 9pt;
}

.command {
    font-weight: normal;
    font-size  : 9pt;
}


.chapter {
    line-height: 200%;
    font-size  : 11pt;
    font-weight: bold
}

.cruces {
    list-style-type: circle;
    line-height    : 175%;
    font-size      : 10pt;
    font-weight    : bold;
}

.homework {
    list-style-type: circle;
    line-height    : 175%;
    font-size      : 10pt;
}

.problem {
    list-style-type: disc;
    line-height    : 150%;
    font-size      : 10pt;
    font-weight    : normal;
}

.classroom {
    list-style-type: disc;
    line-height    : 150%;
    font-size      : 10pt;
    font-weight    : normal;
}

.assignment {
    list-style-type: square;
    line-height    : 150%;
    font-size      : 10pt;
    font-weight    : normal;
}


.bar {
    font-weight: normal;
    font-size  : 9pt;
}

.navibar {
    background-color   : #fff;
    border-top-color   : #cdf;
    border-top-width   : 1;
    border-top-style   : solid;
    border-bottom-color: #cdf;
    border-bottom-width: 1;
    border-bottom-style: solid;
    font-size          : 9pt;
    padding            : 5;
    text-align         : right;
    width              : 100%;
}

.pagetable {
    padding: 0;
    margin : 0;
    width  : 100%;
}

.pageleft {
    background-color: bisque;
    text-align      : center;
    vertical-align  : top;
    padding         : 10;
    margin          : 0;
}

.pagemain {
    text-align    : left;
    vertical-align: top;
    padding       : 10 0 10;
    margin        : 0;
    width         : 100%;
}

.pageright {
    text-align    : center;
    vertical-align: top;
    padding       : 10 0;
    margin        : 0;
}

.lefttable {
    margin      : 5 10;
    border-color: #ffe;
    border-width: 1;
    border-style: solid;
}

.lefttd {
    padding: 5 10;
}

.righttable {
    margin: 0 10;
}

.righttd {
    padding: 5;
}

.fieldname {
    color           : #338;
    background-color: #eef;
    padding         : 5 5 3 5;
    font-weight     : bold;
}

.fieldvalue {
    background-color: #fff;
    padding         : 5 5 3 5;
    line-height     : 150%;
}

.formtitle {
    font-size  : 14pt;
    font-weight: bold;
    text-align : center;
}

.error {
    padding         : 10;
    background-color: #fff;
    color           : #f00;
    text-align      : center;
}

.hint {
    padding         : 10;
    background-color: #fff;
    color           : #f00;
    text-align      : center;
}

.formtable {
    background-color: #aaf;
    font-size       : 11pt;
}

.showtable {
    background-color: #cdf;
    font-size       : 11pt;
}

.showtitle {
    background-color: #fff;
    font-size       : 18pt;
    font-weight     : bold;
    padding         : 10;
    text-align      : center;
}

.listtable {
    border-color    : #cdf;
    border-width    : 1;
    border-style    : solid;
    background-color: #cdf;
    font-size       : 11pt;
    line-height     : 120%;
    width           : 100%;
}

.evenrow {
    background-color: #fff;
}

.oddrow {
    background-color: #eef;
}

.msgrow {
    color              : red;
    line-height        : 200%;
    font-size          : 12pt;
    font-weight        : bold;
    background-color   : white;
    border-bottom-width: 1;
    border-bottom-style: solid;
}

.listtd {
    padding: 4 5 4;
}

.listth {
    padding         : 4 5 4;
    background-color: #ccf;
    text-align      : left;
}

.box {
    font-size       : 11pt;
    border-color    : #ccf;
    border-width    : 1;
    border-style    : solid;
    background-color: #eef;
}

.box_table {
    font-size   : 11pt;
    border-color: #ccf;
    border-width: 1;
    border-style: solid;
    width       : 360px;
}

.box_header {
    border-bottom-color: #ccf;
    border-bottom-width: 1;
    border-bottom-style: solid;
    background-color   : #eef;
    padding            : 3;
}

.box_containt {
    padding    : 3;
    line-height: 150%;
}

.box_item {
    line-height: 150%;
}

.proptable {
    font-size: 9pt;
    width    : 100%;
}

.propname {
    color           : #377;
    background-color: #ddf;
}

.propvalue {
    color           : #777;
    background-color: #eef;
}
.highin,.highout {
    display: block;
    overflow: auto;
    max-width: 760px;
}
pre,code,textarea,#aceEditor {
    font-family: Inconsolata, Consolas, Menlo, Monaco, "Andale Mono WT", "Andale Mono", "Lucida Console", "DejaVu Sans Mono", "Bitstream Vera Sans Mono", "Courier New", Courier, monospace;
}
#aceEditor {
    width: 600px;
    height: 400px;
    font-size: 14px;
}
form[action="/programming/problem/submit.do"]>div {
    overflow: auto;
}
</style>`);
})();