// ==UserScript==
// @name         jira工具箱
// @namespace    qigege
// @version      1.1.0
// @description  jiar工具箱
// @author       qgg
// @match        http://172.19.5.17:8888/browse/*
// @match        http://jira.xquant.com:8888/browse/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=5.17
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/503058/jira%E5%B7%A5%E5%85%B7%E7%AE%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/503058/jira%E5%B7%A5%E5%85%B7%E7%AE%B1.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function copyLog() {
        const version = document.querySelector("#fixVersions-field")?.innerText || "";
        const lis = document.querySelector(".aui-nav-breadcrumbs").children;
        const isBug = document.querySelector("#type-val").innerText.includes("缺陷");

        let jiraId = "", summary = "", bugId = "", problem = "";

        if (isBug) {
            if (lis.length === 2) {
                bugId = lis[1].innerText;
                problem = document.querySelector("#summary-val").innerText;
            } else {
                const [id, ...rest] = lis[1].innerText.split(' ');
                jiraId = id;
                summary = rest.join(' ');
                bugId = lis[2].innerText;
                problem = document.querySelector("#summary-val").innerText;
            }
        } else {
            jiraId = lis[1].innerText;
            summary = document.querySelector("#summary-val").innerText;
        }

        const content = `版本：${version} \n需求编号：${jiraId} \n内容概要：${summary} \n缺陷编号：${bugId} \n问题描述：${problem} `;
        addClipboard(content);
    }

    function copyFileName() {
        const user = document.querySelector("#header-details-user-fullname").getAttribute("data-displayname");
        const jiraId = document.querySelector(".aui-nav-breadcrumbs").children[1].innerText;
        const summary = document.querySelector("#summary-val").innerText;
        const client = document.querySelector("#customfield_10503-val").innerText;

        const content = client.includes("中信") ? `【${jiraId}】需求：${summary} ` : `${jiraId}_${user}_${summary} `;
        addClipboard(content);
    }

    function calculateRows(content) {
        const lines = content.split('\n');
        return lines.length + 1;
    }

    function createDoc() {
        backboard.hidden = false;

        const user = document.querySelector("#header-details-user-fullname").getAttribute("data-displayname");
        const jiraId = document.querySelector(".aui-nav-breadcrumbs").children[1].innerText;
        const summary = document.querySelector("#summary-val").innerText;
        const client = document.querySelector("#customfield_10503-val").innerText;

        if (client.includes("中信")) {
            showFloatingMessage("抱歉，暂不支持中信！");
            backboard.hidden = true;
            return;
        }

        const fileName = `${jiraId}_${user}_${summary} `

        const analysis = document.querySelector(".user-content-block")
            ? document.querySelector(".user-content-block").innerText.trimStart() : "无";
        const sln = document.querySelector("#customfield_10910-val")
            ? document.querySelector("#customfield_10910-val").innerText.trimStart() : "无";
        const sugg = document.querySelector("#customfield_11700-val")
            ? document.querySelector("#customfield_11700-val").innerText.trimStart() : "无";

        const dialog = createDialog("Auto Create Doc", [
            createNewDocField('文件名称', "x-file-name", fileName, 1),
            createNewDocField('需求描述', "x-desc", "无", 1),
            createNewDocField('需求分析', "x-analyes", analysis, calculateRows(analysis)),
            createNewDocField('解决方案', "x-sln", sln, calculateRows(sln)),
            createNewDocField('测试建议', "x-sugg", sugg, calculateRows(sugg)),
            createNewDocField('自测场景', "x-self-text", "无", 1),
            createNewDocField('相关脚本', "x-script", "无", 1)
        ], () => {
            const content =
                `【需求描述】\n${document.querySelector("#x-desc").value} \n
【需求分析】\n${document.querySelector("#x-analyes").value} \n
【解决方案】\n${document.querySelector("#x-sln").value} \n
【测试建议】\n${document.querySelector("#x-sugg").value} \n
【自测场景】\n${document.querySelector("#x-self-text").value} \n
【相关脚本】\n${document.querySelector("#x-script").value}
`;
            downloadFile(`${fileName}.txt`, content);
            backboard.hidden = true;
            document.body.removeChild(dialog);
        });

        document.body.appendChild(dialog);
    }

    function createNewDocField(label, id, content, rows = 3) {
        const field = document.createElement('div');
        field.className = "field-group";
        field.style.marginBottom = "20px";

        const labelElement = document.createElement('label');
        labelElement.innerHTML = label;
        labelElement.style.display = "inline-block";
        labelElement.style.width = "100px";
        labelElement.style.verticalAlign = "top"; // 修改为top，使label和输入框平齐
        field.appendChild(labelElement);

        const textBox = document.createElement('textarea');
        textBox.id = id;
        textBox.className = "textarea long-field";
        textBox.rows = rows;
        textBox.cols = 95;
        textBox.style.border = "2px solid var(--aui-form-field-border-color)";
        textBox.style.transition = "background-color 0.2s ease-in-out, border-color 0.2s ease-in-out";
        textBox.style.resize = "vertical";
        textBox.style.verticalAlign = "top"; // 修改为top，使label和输入框平齐
        textBox.style.fontFamily = "inherit";
        textBox.style.boxSizing = "border-box";
        textBox.style.borderRadius = "3.01px";

        textBox.textContent = content;

        textBox.addEventListener('mouseover', () => textBox.style.backgroundColor = "var(--aui-form-field-hover-bg-color)");
        textBox.addEventListener('mouseout', () => textBox.style.backgroundColor = "");
        textBox.addEventListener('mousedown', () => textBox.style.backgroundColor = "");

        field.appendChild(textBox);
        return field;
    }

    function closeRightPanel() {
        const sidebar = document.querySelector("#viewissuesidebar");
        sidebar.style.display = sidebar.style.display === 'none' ? "" : 'none';
    }

    function setting() {
        backboard.hidden = false;

        const dialog = createDialog("Jira Tool Box Settings", [
            createSettingField('Copy Log', 'addCopyLog', true),
            createSettingField('Copy FileName', 'addCopyFileName'),
            createSettingField('Create Doc', 'addCreateDoc', true),
            createSettingField('Close Right Panel', 'addCloseRightPanel'),
            createSettingField('Setting(reset need clear cache)', 'addSetting', true)
        ], () => {
            localStorage.setItem('addCopyLog', document.querySelector('#addCopyLog').checked);
            localStorage.setItem('addCopyFileName', document.querySelector('#addCopyFileName').checked);
            localStorage.setItem('addCreateDoc', document.querySelector('#addCreateDoc').checked);
            localStorage.setItem('addCloseRightPanel', document.querySelector('#addCloseRightPanel').checked);
            localStorage.setItem('addSetting', document.querySelector('#addSetting').checked);

            addCopyLog = localStorage.getItem('addCopyLog') === "true";
            addCopyFileName = localStorage.getItem('addCopyFileName') === "true";
            addCreateDoc = localStorage.getItem('addCreateDoc') === "true";
            addCloseRightPanel = localStorage.getItem('addCloseRightPanel') === "true";
            addSetting = localStorage.getItem('addSetting') === "true";

            backboard.hidden = true;
            document.body.removeChild(dialog);
            init();
        });

        document.body.appendChild(dialog);
    }

    function createSettingField(label, id, defaultCheck = false) {
        const field = document.createElement('div');
        field.className = "field-group";
        field.style.marginBottom = "20px";

        const labelElement = document.createElement('label');
        labelElement.innerHTML = label;
        labelElement.style.display = "inline-block";
        labelElement.style.width = "220px";
        labelElement.style.verticalAlign = "middle";
        field.appendChild(labelElement);

        const checkbox = document.createElement('input');
        checkbox.type = "checkbox";
        checkbox.id = id;
        if (localStorage.getItem(id) === 'true') {
            checkbox.checked = true;
        }
        else {
            checkbox.checked = defaultCheck;
        }
        checkbox.style.verticalAlign = "middle";
        field.appendChild(checkbox);

        return field;
    }

    function createDialog(title, fields, onSave) {
        const dialog = document.createElement('div');
        dialog.className = "jira-dialog jira-dialog-core box-shadow jira-dialog-open popup-width-large jira-dialog-content-ready";
        dialog.style = `
position: absolute;
top: 50%;
left: 50%;
transform: translate(-50%, -50%);
max-height: 80%;
overflow: hidden;
display: flex;
flex-direction: column;
`;

        const header = document.createElement('div');
        header.className = "jira-dialog-heading jira-dialog-core-heading";
        header.innerHTML = `<h2> ${title}</h2> `;
        header.style.flexShrink = '0';
        dialog.appendChild(header);

        const content = document.createElement('div');
        content.className = "jira-dialog-content jira-dialog-core-content";
        content.style.flexGrow = '1';
        content.style.overflowY = 'auto';
        dialog.appendChild(content);

        const form = document.createElement('div');
        form.className = "form-body";
        fields.forEach(field => form.appendChild(field));
        content.appendChild(form);

        const btnContainer = document.createElement('div');
        btnContainer.className = "buttons-container form-footer";
        btnContainer.style.flexShrink = '0';

        const btns = document.createElement('div');
        btns.className = "buttons";
        btnContainer.appendChild(btns);

        const okBtn = document.createElement('a');
        okBtn.className = "aui-button toolbar-trigger issueaction-workflow-transition";
        okBtn.innerHTML = "保存";
        okBtn.addEventListener('click', onSave);
        btns.appendChild(okBtn);

        const cancelBtn = document.createElement('a');
        cancelBtn.innerHTML = "取消";
        cancelBtn.className = "aui-button aui-button-link cancel";
        cancelBtn.addEventListener('click', () => {
            backboard.hidden = true;
            document.body.removeChild(dialog);
        });
        btns.appendChild(cancelBtn);
        dialog.appendChild(btnContainer);

        // 添加Esc键关闭功能
        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape') {
                backboard.hidden = true;
                document.body.removeChild(dialog);
            }
        });

        return dialog;
    }

    function downloadFile(filename, content) {
        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content));
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }

    function addClipboard(content) {
        const textarea = document.createElement('textarea');
        textarea.value = content;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);

        showFloatingMessage("已将以下内容增加到剪切板\n\n" + content);
    }

    function addOpsbarButton(needAdd, label, action, tooltip) {
        const id = label.replaceAll(' ', '');
        const existingButton = document.querySelector('#' + id);
        if (needAdd && !existingButton) {
            document.querySelector("#opsbar-opsbar-transitions").appendChild(createButton(label, action, tooltip));
        } else if (!needAdd && existingButton) {
            existingButton.remove();
        }
    }

    function createButton(label, clickHandler, tooltip) {
        const btn = document.createElement('a');
        btn.className = "aui-button toolbar-trigger issueaction-workflow-transition";
        btn.href = "#";
        btn.id = label.replaceAll(' ', '');
        btn.title = tooltip;
        const span = document.createElement('span');
        span.className = "trigger-label";
        span.innerHTML = label;
        btn.appendChild(span);
        btn.addEventListener('click', clickHandler);
        return btn;
    }

    function showFloatingMessage(message) {
        const floatingDiv = document.createElement('div');
        floatingDiv.style.position = 'fixed';
        floatingDiv.style.top = '20px';
        floatingDiv.style.left = '50%';
        floatingDiv.style.transform = 'translateX(-50%)';
        floatingDiv.style.padding = '10px 20px';
        floatingDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        floatingDiv.style.color = 'white';
        floatingDiv.style.borderRadius = '5px';
        floatingDiv.style.zIndex = '9999';
        floatingDiv.style.opacity = '0';
        floatingDiv.style.transition = 'opacity 0.5s ease-in-out';
        floatingDiv.innerHTML = message.replace(/\n/g, '<br>');

        document.body.appendChild(floatingDiv);

        // 渐入动画
        setTimeout(() => {
            floatingDiv.style.opacity = '1';
        }, 10);

        // 渐出动画
        setTimeout(() => {
            floatingDiv.style.opacity = '0';
            floatingDiv.addEventListener('transitionend', () => {
                document.body.removeChild(floatingDiv);
            });
        }, 4500);
    }

    function init() {
        addOpsbarButton(addCopyLog, 'Copy Log', copyLog, "快捷复制svn提交log");

        if (document.querySelector("#type-val").innerText.includes("需求")) {
            addOpsbarButton(addCopyFileName, 'Copy FileName', copyFileName, "快捷复制文档名称");
            addOpsbarButton(addCreateDoc, 'Create Doc', createDoc, "快捷创建文档，支持jira维护后一键生成文档");
        }

        addOpsbarButton(addCloseRightPanel, 'Close Right Panel', closeRightPanel, "关闭右侧栏");
        addOpsbarButton(addSetting, 'Setting', setting, "设置");
    }

    let addCopyLog = false;
    let addCopyFileName = false;
    let addCreateDoc = false;
    let addCloseRightPanel = false;
    let addSetting = false;

    const backboard = document.createElement('div');
    backboard.className = "aui-blanket";
    backboard.hidden = true;
    document.body.appendChild(backboard);

    if (localStorage.getItem('addCopyLog') === null) {
        setting();
    } else {
        addCopyLog = localStorage.getItem('addCopyLog') === "true";
        addCopyFileName = localStorage.getItem('addCopyFileName') === "true";
        addCreateDoc = localStorage.getItem('addCreateDoc') === "true";
        addCloseRightPanel = localStorage.getItem('addCloseRightPanel') === "true";
        addSetting = localStorage.getItem('addSetting') === "true";
    }

    init();
    setInterval(init, 2000);
})();