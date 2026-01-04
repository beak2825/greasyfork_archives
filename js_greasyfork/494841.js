// ==UserScript==
// @name            Jira标题拷贝按钮
// @namespace       https://izmj.net/
// @version         0.7
// @description     在JIRA页面，快速拷贝ID,标题,链接
// @author          GiraKoo
// @license         MIT
// @match           *://*/browse/*
// @run-at          document-end
// @icon64          https://gitee.com/izmj/web_js/raw/main/img/zmj.png
// @downloadURL https://update.greasyfork.org/scripts/494841/Jira%E6%A0%87%E9%A2%98%E6%8B%B7%E8%B4%9D%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/494841/Jira%E6%A0%87%E9%A2%98%E6%8B%B7%E8%B4%9D%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

// 尝试获取元素，如果不存在则返回null
function getElementByIdSafe(id) {
    return document.getElementById(id) || null;
}

// 尝试添加元素到指定位置，如果父元素不存在则不执行任何操作
function appendElementAfterSafe(newElement, referenceElement) {
    if (referenceElement) {
        referenceElement.after(newElement);
    }
}

// 创建拷贝按钮的ul元素和li元素
var transitions_div = getElementByIdSafe('opsbar-opsbar-transitions');

var jira_copy_link_div = document.createElement('div');
jira_copy_link_div.id = 'jira_copy_link_div';
jira_copy_link_div.className = 'aui-buttons pluggable-ops';

// 如果transitions_div下面有ul元素
if (transitions_div) {
    if (transitions_div.querySelector('ul')) {
        var jira_copy_link_ul = document.createElement('ul');
        jira_copy_link_ul.className = 'toolbar-group pluggable-ops';
        jira_copy_link_ul.id = 'jira_copy_link_ul';

        var li_copy_id = document.createElement('li');
        li_copy_id.className = 'toolbar-item';
        li_copy_id.innerHTML = '<a class="aui-button toolbar-trigger" href="#" id="jira_copy_id">ID</a>';
        jira_copy_link_ul.appendChild(li_copy_id);

        var li_copy_title = document.createElement('li');
        li_copy_title.className = 'toolbar-item';
        li_copy_title.innerHTML = '<a class="aui-button toolbar-trigger" href="#" id="jira_copy_title">标题</a>';
        jira_copy_link_ul.appendChild(li_copy_title);

        var li_copy_link = document.createElement('li');
        li_copy_link.className = 'toolbar-item';
        li_copy_link.innerHTML = '<a class="aui-button toolbar-trigger" href="#" id="jira_copy_link">链接</a>';
        jira_copy_link_ul.appendChild(li_copy_link);

        jira_copy_link_div.appendChild(jira_copy_link_ul);
    }
    else {
        // 如果transitions_div下面没有ul元素，则直接使用a元素
        var jira_copy_id_element = document.createElement('a');
        jira_copy_id_element.className = 'aui-button toolbar-trigger';
        jira_copy_id_element.href = '#';
        jira_copy_id_element.id = 'jira_copy_id';
        jira_copy_id_element.innerText = 'ID';

        var jira_copy_title_element = document.createElement('a');
        jira_copy_title_element.className = 'aui-button toolbar-trigger';
        jira_copy_title_element.href = '#';
        jira_copy_title_element.id = 'jira_copy_title';
        jira_copy_title_element.innerText = '标题';

        var jira_copy_link_element = document.createElement('a');
        jira_copy_link_element.className = 'aui-button toolbar-trigger';
        jira_copy_link_element.href = '#';
        jira_copy_link_element.id = 'jira_copy_link';
        jira_copy_link_element.innerText = '链接';

        jira_copy_link_div.appendChild(jira_copy_id_element);
        jira_copy_link_div.appendChild(jira_copy_title_element);
        jira_copy_link_div.appendChild(jira_copy_link_element);
    }
}

// 安全地添加按钮ul到transitions_div之后
appendElementAfterSafe(jira_copy_link_div, transitions_div);

// 显示提示信息的函数
function showToast(message) {
    var toastId = 'toast_jira_quick_copy';
    var div = document.createElement('div');
    div.id = toastId;
    div.className = 'toast';
    div.style.position = 'fixed';
    div.style.top = '10px';
    div.style.left = '50%';
    div.style.transform = 'translateX(-50%)';
    div.style.padding = '10px';
    div.style.backgroundColor = '#4CAF50';
    div.style.color = 'white';
    div.style.borderRadius = '5px';
    div.style.zIndex = '9999';
    div.innerText = message;

    // 清除可能存在的旧toast
    var oldToast = getElementByIdSafe(toastId);
    if (oldToast) {
        oldToast.parentNode.removeChild(oldToast);
    }

    document.body.appendChild(div);

    // 设置定时器移除toast，并确保在移除前清除事件监听器
    setTimeout(function () {
        var toast = getElementByIdSafe(toastId);
        if (toast) {
            toast.parentNode.removeChild(toast);
        }
    }, 1000);
}

// 添加事件监听器，将JIRA的ID拷贝到剪贴板
var jira_copy_id_btn = getElementByIdSafe('jira_copy_id');
if (jira_copy_id_btn) {
    jira_copy_id_btn.addEventListener('click', function () {
        var jira_id_element = getElementByIdSafe('key-val');
        if (jira_id_element) {
            navigator.clipboard.writeText(jira_id_element.innerText);
            showToast('已拷贝到剪贴板');
        } else {
            console.error('未能找到JIRA ID或标题元素');
        }
    });
}


// 添加事件监听器，将JIRA的ID和标题拷贝到剪贴板
var jira_copy_title_btn = getElementByIdSafe('jira_copy_title');
if (jira_copy_title_btn) {
    jira_copy_title_btn.addEventListener('click', function () {
        var jira_id_element = getElementByIdSafe('key-val');
        var jira_title_element = getElementByIdSafe('summary-val');
        if (jira_id_element && jira_title_element) {
            var copy_text = jira_id_element.innerText + ' ' + jira_title_element.innerText;
            navigator.clipboard.writeText(copy_text);
            showToast('已拷贝到剪贴板');
        } else {
            console.error('未能找到JIRA ID或标题元素');
        }
    });
}

// 添加事件监听器，将JIRA链接拷贝到剪贴板
var jira_copy_link_btn = getElementByIdSafe('jira_copy_link');
if (jira_copy_link_btn) {
    jira_copy_link_btn.addEventListener('click', function () {
        // 获取key-val元素的href
        var jira_id_element = getElementByIdSafe('key-val');
        var jira_link = jira_id_element ? jira_id_element.href : window.location.href;
        navigator.clipboard.writeText(jira_link);
        showToast('已拷贝到剪贴板');
    });
}