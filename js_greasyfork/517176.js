// ==UserScript==
// @name         Douban影片信息获取·奇乐搜
// @namespace    https://www.qileso.com/
// @version      1.1
// @description  在豆瓣电影页面添加按钮，点击后预览原始HTML代码并复制
// @author       qileso.com
// @match        https://movie.douban.com/subject/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/517176/Douban%E5%BD%B1%E7%89%87%E4%BF%A1%E6%81%AF%E8%8E%B7%E5%8F%96%C2%B7%E5%A5%87%E4%B9%90%E6%90%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/517176/Douban%E5%BD%B1%E7%89%87%E4%BF%A1%E6%81%AF%E8%8E%B7%E5%8F%96%C2%B7%E5%A5%87%E4%B9%90%E6%90%9C.meta.js
// ==/UserScript==

// 通用获取元素的函数
function getElement(selector) {
    return document.querySelector(selector);
}

// 获取目标容器
var subjectWrap = getElement('.subjectwrap.clearfix');
if (!subjectWrap) {
    console.error('未找到 class="subjectwrap clearfix" 的元素');
    return;
}

// 创建按钮的通用函数
function createButton(text, callback) {
    var button = document.createElement('button');
    button.textContent = text;
    button.style.display = 'block';
    button.style.marginBottom = '10px';
    button.addEventListener('click', callback);
    return button;
}

// 创建并插入按钮
var showHtmlButton = createButton('显示HTML代码', toggleHtmlPreview);
var copyButton = createButton('直接复制', copyHtmlContent);
subjectWrap.insertAdjacentElement('afterend', showHtmlButton);
showHtmlButton.insertAdjacentElement('afterend', copyButton);

// 创建预览框
var previewBox = document.createElement('div');
previewBox.style.marginTop = '20px';
previewBox.style.border = '1px solid #ccc';
previewBox.style.padding = '10px';
previewBox.style.backgroundColor = '#fff';
previewBox.style.overflowY = 'auto';
previewBox.style.maxHeight = '400px';
previewBox.style.width = '80%';
previewBox.style.marginLeft = 'auto';
previewBox.style.marginRight = 'auto';
previewBox.style.display = 'none'; // 初始隐藏
previewBox.innerHTML = '<pre id="htmlCode" style="white-space: pre-wrap; word-wrap: break-word;">等待生成内容...</pre>';
copyButton.insertAdjacentElement('afterend', previewBox);

// 添加静态提示区域
var copyStatus = document.createElement('p');
copyStatus.style.textAlign = 'center';
copyStatus.style.color = 'green';
copyStatus.style.fontSize = '14px';
copyStatus.textContent = ''; // 初始为空
previewBox.insertAdjacentElement('afterend', copyStatus);

// 封装生成HTML内容的逻辑
function generateHtmlContent() {
    var poster = getElement('div#mainpic img');
    var posterUrl = poster ? poster.src : 'No image found';

    var info = (getElement('div#info')?.textContent || '')
        .split('\n')
        .map(line => line.trim())
        .filter(line => line)
        .join('\n');

    var summary = getElement('span[property="v:summary"]');
    var summaryText = summary ? summary.textContent.trim().replace(/\s+/g, ' ') : 'No summary found';

    return `<div class="post-yp">
<div class="yp-item"><img referrerpolicy="no-referrer" src="${posterUrl}"></div>
<div class="yp-item">${info}</div>
</div>
<p>&nbsp;</p>
<h2>剧情简介：</h2>
${summaryText}
<p>&nbsp;</p>
<h2>网盘链接：</h2>
<span class="xzdz-kkwp">夸克网盘</span>
<span class="xzdz-alyp">阿里云盘</span>
`;
}

// 显示/隐藏 HTML 预览框
function toggleHtmlPreview() {
    if (previewBox.style.display === 'none') {
        var previewHtml = generateHtmlContent();
        previewBox.querySelector('#htmlCode').textContent = previewHtml;
        previewBox.style.display = 'block';
        showHtmlButton.textContent = '隐藏HTML代码';
    } else {
        previewBox.style.display = 'none';
        showHtmlButton.textContent = '显示HTML代码';
    }
}

// 复制HTML内容到剪贴板
function copyHtmlContent() {
    var previewContent = previewBox.querySelector('#htmlCode').textContent;
    if (previewContent === '等待生成内容...') {
        previewContent = generateHtmlContent(); // 如果内容未生成，主动生成
    }
    navigator.clipboard.writeText(previewContent).then(function () {
        // 显示静态提示
        copyStatus.textContent = 'HTML代码已复制到剪贴板';
        setTimeout(() => {
            copyStatus.textContent = ''; // 一段时间后清空提示
        }, 3000);
    }).catch(function (err) {
        console.error('复制失败: ', err);
    });
}

