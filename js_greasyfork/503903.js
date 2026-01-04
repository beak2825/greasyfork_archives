// ==UserScript==
// @name         OptiYan
// @namespace    http://lunarine.cc/
// @version      2024.1.2
// @description  EYanIDE 优化
// @author       Liu Baicheng
// @match        http://121.36.38.167/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
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
// @downloadURL https://update.greasyfork.org/scripts/503903/OptiYan.user.js
// @updateURL https://update.greasyfork.org/scripts/503903/OptiYan.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const spans = document.querySelectorAll('span.lm_title');
    var title;
    // 遍历并输出内容为 main.cpp 的 span
    spans.forEach(span => {
        if (span.textContent.trim() === 'main.cpp') {
            title = span;
        }
    });

    function classOptimize() {

        let divs = document.querySelectorAll('div.ui.dropdown.selection');

        // 遍历并删除这些 div
        divs.forEach(div => {
            div.remove();
        });

        divs = document.querySelectorAll("div.right.menu");

        // 遍历并删除这些 div
        divs.forEach(div => {
            div.remove();
        });


        var compilerOptionsInput = document.getElementById('compiler-options');
        compilerOptionsInput.value = "-O3";
        var comilerArgsInput = document.getElementById('command-line-arguments');
        comilerArgsInput.remove();
        var navbar = document.getElementById("site-navigation");
        let optibar = document.createElement('div');
        optibar.classList.add("right");
        optibar.classList.add("menu");
        navbar.appendChild(optibar);

        let tdiv = document.createElement('div');
        tdiv.className = "item no-right-padding borderless";
        tdiv.id = "userbar"
        optibar.appendChild(tdiv);

        // let tbutton = document.createElement('button');
        // tbutton.className = "ui labeled icon button";
        // tbutton.id = "optiso";
        // tbutton.innerHTML = `<i class="search icon"></i><span>搜索</span>`;
        // tdiv.appendChild(tbutton);

        // tbutton.onclick = function () {
        //     let input = unsafeWindow.stdinEditor.getValue();
        //     console.log(input);
        //     tbutton.classList.add('loading');
        //     requestGPT(input).then(response => {
        //         unsafeWindow.sourceEditor.setValue(response);
        //         tbutton.classList.remove('loading');
        //     });
        // };
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
            saveFile();
        }
    });

    unsafeWindow.formatCppCode = formatCppCode;
    formatCode();

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
        runBtn.textContent = 'Run (F11 / Ctrl + ↵)';
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

    var userbar = document.getElementById('userbar');
    //var fileList = document.getElementById('fileList');
    var loginButton = document.createElement('button');
    loginButton.className = "ui labeled icon button";
    loginButton.innerHTML = `<i class="user  icon"></i><span>登陆</span>`;
    loginButton.style.marginRight = "5px";
    loginButton.addEventListener('click', function () {
        login();
    });
    var registerButton = document.createElement('button');
    registerButton.className = "ui labeled icon button";
    registerButton.innerHTML = `<i class="add icon"></i><span>注册</span>`;
    registerButton.style.marginRight = "5px";
    registerButton.addEventListener('click', function () {
        register();
    });
    var logoutButton = document.createElement('button');
    logoutButton.innerHTML = `<i class="sign-out icon"></i><span>退出登录</span>`;
    logoutButton.className = "ui labeled icon button";
    logoutButton.addEventListener('click', function () {
        logout();
    });

    var saveButton = document.createElement('button');
    saveButton.innerHTML = `<i class="save icon"></i><span>保存文件 (Ctrl + S)</span>`;
    saveButton.style.marginRight = "5px";
    saveButton.className = "ui labeled icon button";
    saveButton.addEventListener('click', function () {
        saveFile();
    });

    var deleteButton = document.createElement('button');
    deleteButton.innerHTML = `<i class="trash icon"></i><span>删除文件</span>`;
    deleteButton.style.marginRight = "5px";
    deleteButton.className = "ui red labeled icon button";
    deleteButton.addEventListener('click', function () {
        deleteFile();
    });

    var userMessage = document.createElement('div');
    userMessage.classList.add('ui');
    userMessage.classList.add('site-link');
    userMessage.style.marginRight = "30px";

    var openButton = document.createElement('button');
    openButton.innerHTML = `<i class="file icon"></i><span>打开文件</span>`;
    openButton.style.marginRight = "5px";
    openButton.className = "ui labeled icon button";
    openButton.addEventListener('click', function () {
        var filename = prompt('请输入文件名');
        if (filename != null && filename.length >= 1) {
            loadFile(filename);
            mdui.snackbar({
                message: '文件加载成功'
            });
        } else {
            mdui.snackbar({
                message: '文件加载失败'
            });
        }
        openButton.classList.remove('loading');
    });

    // 初始化用户界面
    function updateUI() {
        userbar.innerHTML = '';
        if (isLoggedIn) {
            userMessage.innerText = "已登录为 @" + Gusername;
            userbar.appendChild(userMessage);
            userbar.appendChild(saveButton);
            if(title.innerText != "main.cpp") userbar.appendChild(deleteButton);
            userbar.appendChild(openButton);
            userbar.appendChild(logoutButton);
        } else {
            userbar.appendChild(loginButton);
            userbar.appendChild(registerButton);
        }
    }

    let token = localStorage.getItem('token');
    let Gusername = localStorage.getItem('username');
    let isLoggedIn = !!token; // 如果 token 存在，则 isLoggedIn 为 true

    function login() {
        var username = prompt('请输入用户名');
        var password = prompt('请输入密码');
        loginButton.classList.add('loading');
        GM_xmlhttpRequest({
            method: 'POST',
            url: 'http://api.mkc.icu/login',
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                username: username,
                password: password
            }),
            onload: function (response) {
                var data = JSON.parse(response.responseText);
                if (data.token) {
                    mdui.snackbar({
                        message: '登录成功'
                    });
                    token = data.token;
                    isLoggedIn = true;
                    Gusername = username;
                    localStorage.setItem('token', token); // 保存 token 到 localStorage
                    localStorage.setItem('username', username);
                    loginButton.classList.remove('loading');
                    updateUI();
                    openFile();
                } else {
                    mdui.snackbar({
                        message: '登录失败'
                    });
                }
            },
            onerror: function (error) {
                console.error('登录请求错误:', error);
            }
        });
    }

    function register() {
        var username = prompt('请输入用户名');
        var password = prompt('请输入密码');

        const a = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
        const b = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
        var answer = prompt(`请输入 ${a} + ${b} 的答案`);

        if (answer != a + b) {
            mdui.snackbar({
                message: `注册失败：你是人机嘛？`
            });
            return;
        }
        registerButton.classList.add('loading');
        GM_xmlhttpRequest({
            method: 'POST',
            url: 'http://api.mkc.icu/register',
            headers: {
                'Content-Type': 'application/json'
            },
            data: JSON.stringify({
                username: username,
                password: password
            }),
            onload: function (response) {
                var data = JSON.parse(response.responseText);
                if (data.message === '注册成功') {
                    token = data.token;
                    isLoggedIn = true;
                    Gusername = username;
                    localStorage.setItem('token', token); // 保存 token 到 localStorage
                    localStorage.setItem('username', username);
                    mdui.snackbar({
                        message: '注册成功'
                    });
                    registerButton.classList.remove('loading');
                    updateUI();
                    openFile();
                } else {
                    mdui.snackbar({
                        message: `注册失败：${data.message}`
                    });
                }
            },
            onerror: function (error) {
                console.error('注册请求错误:', error);
            }
        });
    }

    function saveFile() {
        if (!isLoggedIn) {
            mdui.snackbar({
                message: `请先登录！`
            });
            return;
        }
        var filename;
        if (title.innerText == "main.cpp") filename = prompt('请输入文件名');
        else filename = title.innerText;
        if (filename == null || filename == "" || filename.length <= 1) {
            mdui.snackbar({
                message: `文件名不能为空！`
            });
            return;
        }
        var content = unsafeWindow.sourceEditor.getValue();
        saveButton.classList.add('loading');
        GM_xmlhttpRequest({
            method: 'POST',
            url: 'http://api.mkc.icu/files',
            headers: {
                'Content-Type': 'application/json',
            },
            data: JSON.stringify({
                token: token, // 将token放入body中
                filename: filename,
                content: content
            }),
            onload: function (response) {
                try {
                    var data = JSON.parse(response.responseText);
                    title.innerText = filename + ".cpp";
                    if (data.message === '文件保存成功') {
                        openFile();
                        mdui.snackbar({
                            message: `文件保存成功！`
                        });
                        saveButton.classList.remove('loading');
                        updateUI();

                    } else {
                        mdui.snackbar({
                            message: `保存失败：${data.message}`
                        });
                        saveButton.classList.remove('loading');
                    }
                } catch (e) {
                    console.error('解析响应时出错:', e);
                }
            },
            onerror: function (error) {
                console.error('保存文件请求错误:', error);
            }
        });
    }

    function deleteFile() {
        if (!isLoggedIn) {
            alert('请先登录');
            return;
        }
        var filename;
        if (title.innerText == "main.cpp") filename = prompt('请输入文件名');
        else {
            filename = title.innerText;
            filename = filename.replace(/\.[^/.]+$/, "");
        }
        if (filename == '') {
            alert('文件名不能为空！');
            return;
        }
        var content = unsafeWindow.sourceEditor.getValue();
        deleteButton.classList.add('loading');
        GM_xmlhttpRequest({
            method: 'POST',
            url: 'http://api.mkc.icu/delete',
            headers: {
                'Content-Type': 'application/json',
            },
            data: JSON.stringify({
                token: token, // 将token放入body中
                filename: filename
            }),
            onload: function (response) {
                try {
                    var data = JSON.parse(response.responseText);
                    if (data.message === '文件删除成功') {
                        openFile();
                        mdui.snackbar({
                            message: `文件删除成功！`
                        });
                        deleteButton.classList.remove('loading');
                        updateUI();
                    } else {
                        mdui.snackbar({
                            message: `文件删除失败：${data.message}`
                        });
                        deleteButton.classList.remove('loading');
                    }
                } catch (e) {
                    console.error('解析响应时出错:', e);
                }
            },
            onerror: function (error) {
                console.error('删除文件请求错误:', error);
            }
        });
    }

    function openFile() {
        if (!isLoggedIn) {
            mdui.snackbar({
                message: `请先登录！`
            });
            return;
        }

        GM_xmlhttpRequest({
            method: 'GET',
            url: `http://api.mkc.icu/files?token=${encodeURIComponent(token)}`,
            headers: {
                'Content-Type': 'application/json',
            },
            onload: function (response) {
                try {
                    unsafeWindow.stdoutEditor.setValue("当前文件：");
                    var data = JSON.parse(response.responseText);
                    if (data.files && data.files.length > 0) {
                        data.files.forEach(filename => {
                            unsafeWindow.stdoutEditor.setValue(unsafeWindow.stdoutEditor.getValue() + "\n  - " + filename);
                        });
                        unsafeWindow.stdoutEditor.setValue(unsafeWindow.stdoutEditor.getValue() + '\n输入文件名称加载。');
                    } else {
                        mdui.snackbar({
                            message: `你还没有保存过文件......`
                        });
                    }
                } catch (e) {
                    console.error('解析响应时出错:', e);
                }
            },
            onerror: function (error) {
                console.error('打开文件请求错误:', error);
            }
        });
    }

    function loadFile(filename) {
        openButton.classList.add('loading');
        GM_xmlhttpRequest({
            method: 'GET',
            url: `http://api.mkc.icu/files/${filename}?token=${encodeURIComponent(token)}`,
            onload: function (response) {
                var data = JSON.parse(response.responseText);
                unsafeWindow.sourceEditor.setValue(data.file);  // 将文件内容加载到编辑器中
                title.innerText = filename + ".cpp";
                openButton.classList.remove('loading');
                document.title = filename + " - EYanIDE"
                updateUI();
            },
            onerror: function (error) {
                console.error('Error:', error);
                openButton.classList.remove('loading');
            }
        });
    }

    openFile();

    function logout() {
        token = null;
        localStorage.removeItem('token');
        isLoggedIn = false;
        Gusername = '';
        localStorage.removeItem('username');
        updateUI();
        mdui.snackbar({
            message: `已注销`
        });
    }

    updateUI();
})();