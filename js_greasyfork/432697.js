// ==UserScript==
// @name         markdown  bahamut
// @namespace    http://home.gamer.com.tw/ding890326
// @version      0.1
// @description  在舊版小屋的右側新增 markdown 編輯器!
// @author       YOWJUORN (遊隼)
// @match        https://home.gamer.com.tw/creationNew1.php
// @match        https://home.gamer.com.tw/creationEdit1.php?sn=*
// @require      https://cdn.jsdelivr.net/npm/marked/marked.min.js
// @downloadURL https://update.greasyfork.org/scripts/432697/markdown%20%20bahamut.user.js
// @updateURL https://update.greasyfork.org/scripts/432697/markdown%20%20bahamut.meta.js
// ==/UserScript==

var body_editstyle;
var textarea_source;
var textarea_markdown;
var standard_html;

(function () {
    add_aside_editor();
})();

function add_aside_editor() {
    var div_aside = document.getElementById('BH-slave');
    var div_aside_gads = document.getElementById('flySalve');

    var h5_markdown_title = document.createElement('h5');
    h5_markdown_title.innerHTML = 'Markdown 編輯器';
    div_aside.insertBefore(h5_markdown_title, div_aside_gads);

    textarea_markdown = document.createElement('textarea');
    textarea_markdown.hidden = true;
    textarea_markdown.style.width = '298px';
    textarea_markdown.style.height = '568px';
    textarea_markdown.style.resize = 'vertical';
    textarea_markdown.style.backgroundColor = '#1E1E1E';
    textarea_markdown.style.color = '#D4D4D4';
    textarea_markdown.style.fontFamily = 'Courier New';
    textarea_markdown.addEventListener('input', textarea_markdown_ischange);
    div_aside.insertBefore(textarea_markdown, div_aside_gads);

    var new_div = document.createElement('div');
    new_div.classList.add('BH-rbox');
    new_div.classList.add('MSG-list2');
    new_div.innerHTML = '<a href="//home.gamer.com.tw/ding890326" target="_blank"><img src="https://avatar2.bahamut.com.tw/avataruserpic/d/i/ding890326/ding890326.png" class="MSG-myavatar"></a>' +
        '<ul class="MSG-mydata1">'+
        '<li>擴充作者：<span class="TS2">游隼</span></li>'+
        '<li>勇者評價：<a href="heartList.php?owner=ding890326" target="_blank" class="AT2">4</a><br>'+
        '<br><span class="AT1">~~歡迎來我的小屋玩~~</span></li>'+
        '<li>都 2120 年了<br>'+
        '巴哈還不支援 Markdown<br>'+
        '這是一個單向 (md>巴哈)<br>'+
        '的 Markdown 編輯器<br>'+
        '有 bug 可以回報小屋</li>'+
        '</ul>';
    div_aside.insertBefore(new_div, div_aside_gads);

    var button_initialization_mdeditor = document.createElement('button');
    button_initialization_mdeditor.innerHTML = '我知道了';
    button_initialization_mdeditor.style.width = '100%';
    button_initialization_mdeditor.onclick = function () {
        body_editstyle = window.frames[0].document.body;
        textarea_source = document.getElementById('source');
        textarea_source.addEventListener('input', textarea_source_ischange);
        new_div.hidden = true;
        textarea_markdown.hidden = false;
    };
    new_div.appendChild(button_initialization_mdeditor);
}

function textarea_source_ischange() {
    //textarea_markdown.value = bahacode_to_markdown(textarea_source.value);
}

function textarea_markdown_ischange() {
    marked.setOptions({gfm: true});
    standard_html = marked(textarea_markdown.value);
    standard_html = bahaize.p(standard_html);
    standard_html = bahaize.em(standard_html);
    standard_html = bahaize.strong(standard_html);
    standard_html = bahaize.table(standard_html);
    standard_html = bahaize.pre_code(standard_html);
    standard_html = bahaize.code(standard_html);
    body_editstyle.innerHTML = standard_html;
}

var bahaize = {
    p: function (mdstr) {
        mdstr = mdstr.replaceAll('</p><p>', '<br/>');
        mdstr = mdstr.replaceAll('</p>\n<p>', '<br/>\n');
        mdstr = mdstr.replaceAll('<p>', '');
        mdstr = mdstr.replaceAll('</p>', '');
        return mdstr;
    },
    em: function (mdstr) {
        mdstr = mdstr.replaceAll('<em>', '<i>');
        mdstr = mdstr.replaceAll('</em>', '</i>');
        return mdstr;
    },
    strong: function (mdstr) {
        mdstr = mdstr.replaceAll('<strong>', '<b>');
        mdstr = mdstr.replaceAll('</strong>', '</b>');
        return mdstr;
    },
    blockquote: function (mdstr) {
        mdstr = mdstr.replaceAll('<blockquote>', '<tab>');
        mdstr = mdstr.replaceAll('</blockquote>', '</tab>');
        return mdstr;
    },
    table: function (mdstr) {
        mdstr = mdstr.replaceAll('<table>', '<table width="98%" cellspacing="1" cellpadding="1" border="1">');
        mdstr = mdstr.replaceAll('<td ', '<td bgcolor="#F4F4F4"');
        mdstr = mdstr.replaceAll('<td>', '<td bgcolor="#F4F4F4">');
        mdstr = mdstr.replaceAll('<th ', '<td bgcolor="#D5D5D5"');
        mdstr = mdstr.replaceAll('<th>', '<td bgcolor="#D5D5D5">');
        mdstr = mdstr.replaceAll('</th>', '</td>');
        mdstr = mdstr.replaceAll('</thead>\n<tbody>', '');
        mdstr = mdstr.replaceAll('<thead>', '<tbody>');
        return mdstr;
    },
    pre_code: function (mdstr) {
        mdstr = mdstr.replaceAll('<pre><code>', '<table width="98%" cellspacing="1" cellpadding="1" border="1"><tbody><tr bgcolor="#F4F4F4"><td><font style="color:#000000;"><font face="Courier New">');
        mdstr = mdstr.replaceAll('</code></pre>', '</font></font></td></tr></tbody></table>');
        return mdstr;
    },
    code: function (mdstr) {
        mdstr = mdstr.replaceAll('<code>', ' <font size="4"><font style="background-color:#F4F4F4;"><font style="color:#F4F4F4;">`</font><font style="color:#000000;"><font face="Courier New"><font size="3">');
        mdstr = mdstr.replaceAll('</code>', '</font></font><font style="color:#F4F4F4;">`</font></font></font></font> ');
        return mdstr;
    }
};