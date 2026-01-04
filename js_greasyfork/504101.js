// ==UserScript==
// @name         OptiYan 2
// @namespace    http://lunarine.cc/
// @version      2024.1.6
// @description  EYanIDE 优化 2.0
// @author       Liu Baicheng
// @match        http://121.36.38.167/
// @icon         http://121.36.38.167/static/favicon1.ico
// @grant        unsafeWindow
// @license      MIT
// @resource     css https://unpkg.com/mdui@1.0.2/dist/css/mdui.min.css
// @grant        GM_getResourceURL
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @require      https://cdn.jsdelivr.net/npm/mdui@1.0.2/dist/js/mdui.min.js
// @connect      api.mkc.icu
// @downloadURL https://update.greasyfork.org/scripts/504101/OptiYan%202.user.js
// @updateURL https://update.greasyfork.org/scripts/504101/OptiYan%202.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function classOptimize() {

        let divs = document.querySelectorAll('div.ui.dropdown.selection');

        // 遍历并删除这些 div
        divs.forEach(div => {
            div.remove();
        });

        const ModalFileList = document.getElementById("file-list-modal");
        ModalFileList.style.height = "auto";
        ModalFileList.style.width = "500px";
        ModalFileList.style.marginTop = "50px";
        // ModalFileList.style.marginLeft = "30%";
        // ModalFileList.style.marginRight = "30% !important";

        var windowWidth = window.innerWidth;
        var windowHeight = window.innerHeight;
        var elementWidth = 500;
        var left = (windowWidth - elementWidth) / 2;

        ModalFileList.style.position = 'absolute';
        ModalFileList.style.left = left + 'px';

        var compilerOptionsInput = document.getElementById('compiler-options');
        compilerOptionsInput.value = "-O3";
        compilerOptionsInput.style.display = "none";
        var comilerArgsInput = document.getElementById('command-line-arguments');
        if (comilerArgsInput) comilerArgsInput.remove();

        document.getElementById("username-display").innerHTML = `<i class="user icon"></i>` + document.getElementById("username-display").innerHTML;
    }

    function formatCppTemplateLine(line) {
        const templateRegex = /(\btemplate\b|\bvector\b|\bmap\b|\bset\b|\bp(?:air|queue)\b|<.*>)/;
        if (templateRegex.test(line.trim())) {
            return line
                .replace(/\s*(<|>)\s*/g, '$1')
                .replace(/>(\w)/g, '> $1');
        }
        return line;
    }

    function formatCppCode(code) {
        code = code.replace(/\/\*[\s\S]*?\*\//g, '');
        code = code.replace(/\/\/.*$/gm, '');
        const lines = code.split('\n');
        let formattedLines = [];
        let indentLevel = 0;
        const indentSpace = '    ';
        let inStruct = false;

        for (let i = 0; i < lines.length; i++) {
            let line = lines[i].trim();
            const isEndOfStructWithVar = line.match(/}\s*[a-zA-Z_][a-zA-Z0-9_]*\s*\[?\s*[^;]*;/);

            if (line.includes('{') && !line.endsWith('{')) {
                line = line.replace(/\s*{\s*/g, ' {\n' + indentSpace.repeat(indentLevel + 1));
            }

            if (line.startsWith('struct')) {
                inStruct = true;
                formattedLines.push(indentSpace.repeat(indentLevel) + line);
                indentLevel++;
                continue;
            }

            if (line.endsWith('};') || isEndOfStructWithVar) {
                if (indentLevel) indentLevel--;
                formattedLines.push(indentSpace.repeat(indentLevel) + line);
                inStruct = false;

                if (isEndOfStructWithVar) {
                    continue;
                }
                formattedLines.push('');
                continue;
            }

            if (inStruct) {
                formattedLines.push(indentSpace.repeat(indentLevel) + line);
                continue;
            }

            if (line.startsWith('#include')) {
                line = line.replace(/#include\s*<\s*([\w./+-]+)\s*>/g, '#include <$1>');
                formattedLines.push(line);
                continue;
            }

            if (line === 'using namespace std;') {
                formattedLines.push(indentSpace.repeat(indentLevel) + line);
                formattedLines.push('');
                continue;
            }

            if (line.endsWith(')') && lines[i + 1] && lines[i + 1].trim() === '{') {
                line += ' {';
                i++;
            }

            line = line.replace(/\s*([+\-*/=<>&|]+)\s*/g, ' $1 ');
            line = line.replace(/\s*,\s*/g, ', ');
            line = line.replace(/\s*([+\-]{2})\s*/g, '$1');
            line = line.replace(/\s*;\s*/g, '; ');
            line = line.replace(/\)\s*(?=[a-zA-Z+\-*/])/g, ') ');

            line = line.replace(/(?<=[+\*/])\s*\(/g, ' (');
            line = line.replace(/(?<!\S)-\s*\(/g, '-(');
            line = line.replace(/\b(for|while|if|else|switch|case|do)\s*(?=[({])/g, '$1 ');

            line = formatCppTemplateLine(line);
            line = line.replace(/!\s*=\s*/g, '!= ');


            if (line.endsWith('}')) {
                if (indentLevel) indentLevel--;
                formattedLines.push(indentSpace.repeat(indentLevel) + line);
                if (indentLevel === 0 && !inStruct && line.endsWith('}')) {
                    formattedLines.push('');
                }
                continue;
            }

            if (line.includes("}")) {
                indentLevel--;
            }

            if (line.includes(') {')) {
                if (indentLevel === 0 && !inStruct && formattedLines[formattedLines.length - 1] != '') {
                    formattedLines.push('');
                    formattedLines.push(indentSpace.repeat(indentLevel) + line);
                    indentLevel++;
                    continue;
                }
            }

            if (line) {
                formattedLines.push(indentSpace.repeat(indentLevel) + line);
            }

            if (line.endsWith('{')) {
                indentLevel++;
            }
        }

        return formattedLines.join('\n').trim();
    }

    function formatCode() {
        const res = formatCppCode(unsafeWindow.sourceEditor.getValue());
        unsafeWindow.sourceEditor.setValue(res);
    }

    classOptimize();

    document.addEventListener('keydown', function (event) {
        if (event.ctrlKey && event.altKey) {
            formatCode(); // 调用目标函数
            mdui.snackbar({
                message: '代码格式化成功'
            });
        } else if (event.keyCode === 122) { // F11
            event.preventDefault();
            unsafeWindow.run();
        } else if (event.keyCode === 116) { // F5
            event.preventDefault();
        } else if (event.ctrlKey && event.keyCode === 82) { // Ctrl+R
            event.preventDefault();
        } else if (event.ctrlKey && event.keyCode === 121) { // Ctrl+R
            event.preventDefault();
        } else if (event.keyCode == 83 && event.ctrlKey) {
            event.preventDefault();
            saveCode();
        }
    });

    var title;

    window.addEventListener('load', function () {

        var footer = document.querySelector('#site-footer');

        if (footer) {
            var span = document.createElement('span');
            span.id = 'optiyan-line';
            span.textContent = 'OptiYan 已加载 Version: V1.1.0';
            span.style.color = "#fff";
            span.style.float = "left";
            span.style.left = "0";
            span.style.textAlign = "left";
            span.style.width = "fit-content";
            footer.appendChild(span);
        }

        var runBtn = document.getElementById('run-btn-label');
        runBtn.textContent = '运行 (F11 / Ctrl + ↵)';
        unsafeWindow.formatCppCode = formatCppCode;


        var loadBtn = document.getElementById('loadcode');
        loadBtn.className = "ui inverted primary labeled icon blue button";

        let fileNameInputDiv = document.createElement("div");

        fileNameInputDiv.className = "ui action inverted icon input";
        document.querySelectorAll("div.item.fitted.borderless.wide.screen.only")[0].appendChild(fileNameInputDiv);

        var fileNameInput = document.createElement('input');
        fileNameInput.id = "filename";
        fileNameInput.placeholder = "请输入文件名"

        fileNameInputDiv.appendChild(fileNameInput);

        document.getElementById("filename").value = "main.cpp";

        fileNameInputDiv.innerHTML += `
        <button id="saveCodeButton" class="ui icon button">
            <i class="save icon"></i>
        </button>
        `;
        document.getElementById("saveCodeButton").addEventListener('click', function () {
            saveCode();
        });
        // const spans = document.querySelectorAll('span.lm_title');

        // spans.forEach(span => {
        //     if (span.textContent.trim() === 'main.cpp') {
        //         title = span;
        //         console.log(title.innerHTML);
        //     }
        // });
        formatCode();
        classOptimize();
        // if (loading) document.getElementById("site-content").removeChild(loading);
        // document.getElementById("site-content").childNodes[0].style.display = '';
    });

    function updateColor() {
        let status = document.getElementById("status-line");
        if (status) {
            if (status.innerText.includes('Error')) {
                const sitefooter = document.querySelector('#site-footer');
                const linefooter = document.querySelector('#status-line');

                sitefooter.style.backgroundColor = "#c14343";
                linefooter.style.backgroundColor = "#c14343";
            } else if (status.innerText.includes('Accept')) {
                const sitefooter = document.querySelector('#site-footer');
                const linefooter = document.querySelector('#status-line');
                sitefooter.style.backgroundColor = "#05a705";
                linefooter.style.backgroundColor = "#05a705";
            } else {
                const sitefooter = document.querySelector('#site-footer');
                const linefooter = document.querySelector('#status-line');
                sitefooter.style.backgroundColor = "#9775fa";
                linefooter.style.backgroundColor = "#9775fa";
            }
        } else {
            const sitefooter = document.querySelector('#site-footer');
            const linefooter = document.querySelector('#status-line');
            sitefooter.style.backgroundColor = "#9775fa";
            linefooter.style.backgroundColor = "#9775fa";
        }

    }

    let script = document.createElement('script');
    script.src = "https://unpkg.com/mdui@1.0.2/dist/js/mdui.min.js?v=20240817";

    script.onload = function () {
        console.log('mdui 已加载');
    };

    document.body.appendChild(script);
    console.log(GM_getResourceURL("css"), GM_getResourceText("css"));
    GM_addStyle(GM_getResourceText("css"));

    setInterval(updateColor, 100);

    function createTimestampString(text) {
        // 获取当前时间的时间戳
        const timestamp = Math.floor(Date.now() / 1000); // 以秒为单位的时间戳
        console.log(timestamp);
        // 返回格式化字符串
        return `${text}:${timestamp}`;
    }

    function parseTimestampString(timestampString) {
        // 分割字符串，获取 text 和时间戳
        const [text, timestamp] = timestampString.split(':');
        // 将时间戳转换为格式化的时间
        const date = new Date(timestamp * 1000); // 将时间戳转换为毫秒
        const formattedTime = date.toLocaleString().slice(0, 19).replace('T', ' '); // 格式化为 YYYY-MM-DD HH:mm:ss
        return { text, formattedTime };
    }

    var curFileName;

    unsafeWindow.loadFileContent = function loadFileContent(filename) {
        document.getElementById("status-line").innerText = '正在加载文件...';
        fetch(`/load_file_content?filename=${encodeURIComponent(filename)}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // 使用 Monaco 编辑器加载文件内容
                    sourceEditor.setModel(monaco.editor.createModel(data.code, 'plaintext', monaco.Uri.file(filename + Math.floor(Math.random() * (9999 - 1111 + 1)) + 1111)));
                    monaco.editor.setModelLanguage(sourceEditor.getModel(), $selectLanguage.find(":selected").attr("mode"));
                    console.log(title);
                    curFileName = filename;
                    filename = parseTimestampString(filename).text;
                    title.innerText = filename + '.cpp';
                    $('#file-list-modal').modal('hide');
                    document.title = title.innerHTML;
                    document.getElementById("status-line").innerText = `已加载 ${filename}`;
                    document.getElementById("filename").value = filename;
                } else {
                    mdui.snackbar({
                        message: 'Failed to load file content: ' + data.message
                    });
                    document.getElementById("status-line").innerText = `${data.message}`;
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                mdui.snackbar({
                    message: 'An error occurred while loading file content.'
                });
            });
    }

    unsafeWindow.showFileList = function showFileList() {
        fetch('/load_file_list')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    const fileListDiv = document.getElementById('file-list');
                    fileListDiv.innerHTML = '';
                    fileListDiv.className = "ui middle aligned divided list";
                    // 创建文件列表
                    data.files.forEach(file => {
                        const fileItemDiv = document.createElement('div');
                        fileItemDiv.className = 'item';
                        const fileName = document.createElement('div');
                        fileName.classList.add('content')
                        //fileButton.className = 'ui button';
                        const info = parseTimestampString(file.filename);
                        const filename = info.text;
                        const time = info.formattedTime;

                        fileName.innerHTML = `
<a class="header">${filename}</a>
<div class="description">上次修改时间：${time}</div>

`;

                        const icon = document.createElement('i');
                        icon.className = "large file middle aligned icon";

                        const fileManage = document.createElement('div');
                        fileManage.className = "right floated ui content buttons";

                        const fileButton = document.createElement('div');
                        fileButton.className = 'ui icon circular button';
                        fileButton.innerHTML = `<i class="folder open icon"></i>`;;
                        fileButton.onclick = () => loadFileContent(file.filename);

                        const deleteButton = document.createElement('div');
                        deleteButton.className = 'ui icon circular red button';
                        deleteButton.innerHTML = `<i class="trash icon"></i>`;
                        deleteButton.onclick = () => deleteFile(file.filename, false);

                        fileManage.appendChild(fileButton);
                        
                        const orDiv = document.createElement('div');
                        //orDiv.classList.add('or');
                        //orDiv.setAttribute("data-text", "或");
                        //fileManage.appendChild(orDiv);
                        fileManage.appendChild(deleteButton);

                        fileItemDiv.appendChild(fileManage);
                        fileItemDiv.appendChild(icon);
                        fileItemDiv.appendChild(fileName);
                        fileListDiv.appendChild(fileItemDiv);

                    });

                    // 显示模态框
                    $('#file-list-modal').modal({
                        centered: true
                    }).modal('show')
                } else {
                    mdui.snackbar({
                        message: 'Failed to load file list: ' + data.message
                    });
                }
            })
            .catch((error) => {
                console.error('Error:', error);
                mdui.snackbar({
                    message: 'An error occurred while loading file list.'
                });
            });
    }


    unsafeWindow.deleteFile = function deleteFile(filename, enforce) {
        console.log("deleting")
        console.log(enforce);
        if (filename == null || !filename.includes(":")) return;
        const fileName = parseTimestampString(filename).text;
        if (enforce || confirm(`Are you sure you want to delete "${fileName}"?`)) {
            fetch(`/delete_file?filename=${encodeURIComponent(filename)}`, { method: 'DELETE' })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        if (!enforce) mdui.snackbar({
                            message: '删除成功'
                        });
                        if (!enforce) showFileList(); // Refresh the file list
                    } else {
                        mdui.snackbar({
                            message: 'Failed to delete file: ' + data.message
                        });
                    }
                })
                .catch((error) => {
                    console.error('Error:', error);
                    mdui.snackbar({
                        message: 'An error occurred while deleting the file.'
                    });
                });
        }
    }

    unsafeWindow.saveCode = function saveCode() {
        var fileName;
        console.log(title);
        if (title.innerText == "main.cpp" || "SOURCE") fileName = document.getElementById("filename").value;
        else {
            fileName = document.getElementById("filename").value;
        }
        if (fileName && fileName != "Untitled") {
            if (title.innerText != "main.cpp")
                if (document.getElementById("filename").value == title.innerText.replace(/\.[^/.]+$/, "")) unsafeWindow.deleteFile(curFileName, true);
            title.innerText = fileName + '.cpp';
            fileName = createTimestampString(fileName);
            unsafeWindow.saveFile(fileName);
            mdui.snackbar({
                message: '保存成功'
            });
            curFileName = fileName;
            document.title = title.innerHTML;
        } else {
            mdui.snackbar({
                message: '请输入有效的文件名或描述！'
            });
        }
    }
    setInterval(() => {
        const spans = document.querySelectorAll('span.lm_title');
        spans.forEach(span => {
            if (span.textContent.trim() === 'main.cpp' || span.textContent.trim() === "SOURCE") {
                title = span;
                //console.log(title.innerHTML);
            }
        });
        //console.log(title);
        if (title && title.innerText == "SOURCE") {
            title.innerText = parseTimestampString(curFileName || "main:114514").text + '.cpp';
        }
    }, 100);

})();