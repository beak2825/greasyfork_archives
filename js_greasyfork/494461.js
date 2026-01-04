// ==UserScript==
// @name            Jira快速备注模板工具
// @namespace       https://izmj.net/
// @version         0.9.1
// @description     在JIRA页面，搜索comment-wiki-edit元素，在该元素下添加一个select控件。可以快速添加所需的模板。
// @author          GiraKoo
// @license         MIT
// @match           *://*/browse/*
// @run-at          document-end
// @icon64          https://gitee.com/izmj/web_js/raw/main/img/zmj.png
// @downloadURL https://update.greasyfork.org/scripts/494461/Jira%E5%BF%AB%E9%80%9F%E5%A4%87%E6%B3%A8%E6%A8%A1%E6%9D%BF%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/494461/Jira%E5%BF%AB%E9%80%9F%E5%A4%87%E6%B3%A8%E6%A8%A1%E6%9D%BF%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

// 创建一个CSS样式规则来隐藏下拉箭头
var style = document.createElement('style');
style.type = 'text/css';
style.innerHTML = `
    #jira_quick_comment_select::-ms-expand {
        display: none;
    }
    #jira_quick_comment_select {
        -moz-appearance: none; /* Firefox */
        -webkit-appearance: none; /* Chrome, Safari, Opera */
        appearance: none;
        background: url("data:image/svg+xml;charset=utf-8,%3Csvg viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%23344563' d='M6.744 8.744a1.053 1.053 0 0 0 0 1.49l4.547 4.557a1 1 0 0 0 1.416 0l4.55-4.558a1.051 1.051 0 1 0-1.488-1.488l-3.77 3.776-3.768-3.776a1.051 1.051 0 0 0-1.487 0z'/%3E%3C/svg%3E");
        background-repeat: no-repeat;
        background-position: right 8px center;
        background-size: 16px 16px;
    }
`;

// 将样式添加到页面中
document.head.appendChild(style);

// 找到一个id为comment-wiki-edit的div
var commentWikiEditDiv = document.getElementById('comment-wiki-edit');
if (commentWikiEditDiv) {
    // 添加一个下拉列表，列表中直接“原因分析”，“解决方案”等常用文本
    var select = document.createElement('select');
    select.id = "jira_quick_comment_select"
    select.innerHTML = `
        <option value="">选择快速模板</option>
        <option value="黄色区块">黄色区块</option>
        <option value="绿色区块">绿色区块</option>
        <option value="红色区块">红色区块</option>
        <option value="蓝色区块">蓝色区块</option>
        <option value="缩略图">缩略图</option>
    `;
    select.style.marginBottom = '10px';
    select.style.padding = '8px';
    select.style.width = '100%';
    select.addEventListener('change', function () {
        var commentBox = document.querySelector('textarea[name="comment"]');
        if (commentBox) {
            // 如果是原因分析区块
            if (select.value === '黄色区块') {
                commentBox.value += "{panel:title=(!) Warning|borderStyle=solid|borderColor=#FF9100|titleBGColor=#FFF4E5|bgColor=#FFFFFF}\n\n{panel}\n";
            }
            else if (select.value === '绿色区块') {
                commentBox.value += "{panel:title=(/) Success|borderStyle=solid|borderColor=#00C853|titleBGColor=#EFFCE7|bgColor=#FFFFFF}\n\n{panel}\n";
            }
            else if (select.value === '红色区块') {
                commentBox.value += "{panel:title=(x) Error|borderStyle=solid|borderColor=#F50057|titleBGColor=#FEE5EE|bgColor=#FFFFFF}\n\n{panel}\n";
            }
            else if (select.value === '蓝色区块') {
                commentBox.value += "{panel:title=(i) Note|borderStyle=solid|borderColor=#448AFF|titleBGColor=#ECF3FF|bgColor=#FFFFFF}\n\n{panel}\n";
            }
            else if (select.value === '缩略图') {
                commentBox.value += "!xxxxxx.png|thumbnail!";
            }
        }
    });
    commentWikiEditDiv.insertBefore(select, commentWikiEditDiv.firstChild);
}
