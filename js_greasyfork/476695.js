// ==UserScript==
// @name         艾利浩斯学院 图书馆临时收藏夹
// @namespace    alhs.xyz
// @version      1.0
// @description  临时使用的收藏夹
// @author       望凡
// @match        https://alhs.xyz/*
// @match        https://alhs.link/*
// @license      MIT
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/476695/%E8%89%BE%E5%88%A9%E6%B5%A9%E6%96%AF%E5%AD%A6%E9%99%A2%20%E5%9B%BE%E4%B9%A6%E9%A6%86%E4%B8%B4%E6%97%B6%E6%94%B6%E8%97%8F%E5%A4%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/476695/%E8%89%BE%E5%88%A9%E6%B5%A9%E6%96%AF%E5%AD%A6%E9%99%A2%20%E5%9B%BE%E4%B9%A6%E9%A6%86%E4%B8%B4%E6%97%B6%E6%94%B6%E8%97%8F%E5%A4%B9.meta.js
// ==/UserScript==

// 创建按钮
var buttonContainer = document.createElement('div');
buttonContainer.style.position = 'fixed';
buttonContainer.style.bottom = '10px';
buttonContainer.style.left = '10px';
buttonContainer.style.zIndex = '9999';
buttonContainer.style.display = 'flex';
buttonContainer.style.flexDirection = 'column';
buttonContainer.style.alignItems = 'flex-start';
document.body.appendChild(buttonContainer);

var style = document.createElement('style');
style.innerHTML = `
  .alhs-button {
    width: 100%;
    margin-top: 10px;
    padding: 5px 10px;
    font-size: 14px;
    background-color: #4CAF50;
    color: white;
    border: none;
    cursor: pointer;
    border-radius: 3px;
    box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.2);
  }

  .alhs-button:hover {
    background-color: #3e8e41;
  }

  .alhs-button:active {
    box-shadow: none;
  }
`;
document.head.appendChild(style);

var recordButton = document.createElement('button');
recordButton.innerHTML = '收藏';
recordButton.className = 'alhs-button';
buttonContainer.appendChild(recordButton);

var viewButton = document.createElement('button');
viewButton.innerHTML = '查看';
viewButton.className = 'alhs-button';
buttonContainer.appendChild(viewButton);

var deleteButton = document.createElement('button');
deleteButton.innerHTML = '删除';
deleteButton.className = 'alhs-button';
buttonContainer.appendChild(deleteButton);

var openButton = document.createElement('button');
openButton.innerHTML = '打开';
openButton.className = 'alhs-button';
openButton.style.marginBottom = '0';
buttonContainer.appendChild(openButton);

// 记录当前页面标题和链接
function recordPageLink() {
    var currentPageTitle = document.title;
    var currentPageLink = window.location.href;
    if (currentPageTitle && currentPageLink) {
        var recordedLinks = GM_getValue('recordedLinks', []);
        recordedLinks.push({ title: currentPageTitle, link: currentPageLink });
        GM_setValue('recordedLinks', recordedLinks);
        alert('已收藏！');
    } else {
        alert('无法记录页面链接，标题或链接不存在');
    }
}

// 查看已记录页面
function viewRecordedLinks() {
    var recordedLinks = GM_getValue('recordedLinks', []);
    if (recordedLinks.length > 0) {
        var message = '已收藏的页面链接：\n\n';
        for (var i = 0; i < recordedLinks.length; i++) {
            message += (i + 1) + '. ' + (recordedLinks[i].title || '未命名') + '\n';
        }
        alert(message);
    } else {
        alert('未找到已收藏的页面链接。');
    }
}

// 删除已记录页面
function deleteRecordedLinks() {
    var recordedLinks = GM_getValue('recordedLinks', []);
    if (recordedLinks.length > 0) {
        var message = '选择要删除的链接：\n\n';
        for (var i = 0; i < recordedLinks.length; i++) {
            message += '<input type="checkbox" id="checkbox-' + i + '" value="' + recordedLinks[i].link + '"> <label for="checkbox-' + i + '">' + (recordedLinks[i].title || '未命名') + '</label><br>';
        }
        message += '<br><button id="delete-links-button" type="button">删除选定的链接</button>';
        var popup = window.open('about:blank', '删除已收藏的链接', 'width=500,height=500');
        popup.document.write(message);
        popup.document.close();
        popup.document.getElementById('delete-links-button').addEventListener('click', function () {
            var checkboxes = popup.document.getElementsByTagName('input');
            var selectedLinks = [];
            for (var i = 0; i < checkboxes.length; i++) {
                if (checkboxes[i].checked) {
                    selectedLinks.push(checkboxes[i].value);
                }
            }
            if (selectedLinks.length > 0) {
                var newRecordedLinks = recordedLinks.filter(function (link) { return !selectedLinks.includes(link.link); });
                GM_setValue('recordedLinks', newRecordedLinks);
                alert('选定的页面链接已删除！');
                popup.close();
            } else {
                alert('未选择链接。');
            }
        });
    } else {
        alert('未找到已收藏的页面链接。');
    }
}

// 打开已记录页面链接
function openRecordedLinks() {
    var recordedLinks = GM_getValue('recordedLinks', []);
    if (recordedLinks.length > 0) {
        var message = '选择要打开的页面链接：\n\n';
        for (var i = 0; i < recordedLinks.length; i++) {
            message += '<button type="button" class="recorded-link-button" value="' + recordedLinks[i].link + '">' + (recordedLinks[i].title || '未命名') + '</button><br>';
        }
        var popup = window.open('about:blank', '打开已收藏的链接', 'width=500,height=500');
        popup.document.write(message);
        popup.document.close();
        popup.document.querySelectorAll('.recorded-link-button').forEach(function (button) {
            button.addEventListener('click', function () {
                window.location.href = button.value;
            });
        });
    } else {
        alert('未找到已收藏的页面链接。');
    }
}

// 添加按钮的点击事件监听器
recordButton.addEventListener('click', recordPageLink);
viewButton.addEventListener('click', viewRecordedLinks);
deleteButton.addEventListener('click', deleteRecordedLinks);
openButton.addEventListener('click', openRecordedLinks);
