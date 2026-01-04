// ==UserScript==
// @license MIT
// @name         新东方作业检查器
// @namespace    Violentmonkey Scripts
// @version      0.4
// @description  检查学生在code.xdf.cn的作业完成情况并生成HTML表格 2025/3/4 23:22:37
// @author       天津新东方编程杨敖儒GY
// @match        https://code.xdf.cn/oj/home
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/528775/%E6%96%B0%E4%B8%9C%E6%96%B9%E4%BD%9C%E4%B8%9A%E6%A3%80%E6%9F%A5%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/528775/%E6%96%B0%E4%B8%9C%E6%96%B9%E4%BD%9C%E4%B8%9A%E6%A3%80%E6%9F%A5%E5%99%A8.meta.js
// ==/UserScript==



(function() {
    'use strict';

    function createUI() {
        const div = document.createElement('div');
        div.style.position = 'absolute';
        div.style.top = '80px';
        div.style.right = '10px';
        div.style.width = '300px';
        div.style.minHeight = '200px';
        div.style.background = '#fff';
        div.style.padding = '10px';
        div.style.border = '1px solid #ccc';
        div.style.zIndex = '1000';
        div.style.cursor = 'move';
        div.style.boxSizing = 'border-box';

        div.innerHTML = `
            <h3 style="margin: 0; padding-bottom: 5px;">检查作业工具 by:GY</h3>
            <input type="file" id="fileInput" accept=".txt" style="width: 100%;"><br><br>
            <label>请输入题号数量：</label>
            <input type="number" id="problemCount" min="1" style="width: 100%;"><br><br>
            <button id="confirmCount">确认</button>
            <div id="problemInputs"></div>
            <button id="startCheck" style="display:none;">开始检查</button>
            <p id="status"></p>
        `;

        document.body.appendChild(div);

        const fileInput = document.getElementById('fileInput');
        const problemCountInput = document.getElementById('problemCount');
        const confirmButton = document.getElementById('confirmCount');
        const startButton = document.getElementById('startCheck');

        makeDraggable(div);

        confirmButton.addEventListener('click', showProblemInputs);
        startButton.addEventListener('click', startChecking);

        fileInput.addEventListener('change', () => {
            console.log('文件已上传，检查 problemCount 输入框状态：', {
                disabled: problemCountInput.disabled,
                readonly: problemCountInput.readOnly,
                display: problemCountInput.style.display
            });
            problemCountInput.focus();
        });
    }


    function makeDraggable(element) {
        let posX = 0, posY = 0, mouseX = 0, mouseY = 0;

        element.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            mouseX = e.clientX;
            mouseY = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            posX = mouseX - e.clientX;
            posY = mouseY - e.clientY;
            mouseX = e.clientX;
            mouseY = e.clientY;
            element.style.top = (element.offsetTop - posY) + 'px';
            element.style.left = (element.offsetLeft - posX) + 'px';
        }

        function closeDragElement() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    function showProblemInputs() {
        const count = parseInt(document.getElementById('problemCount').value);
        if (!count || count <= 0) {
            alert('请输入有效的题号数量！');
            return;
        }

        const problemInputsDiv = document.getElementById('problemInputs');
        problemInputsDiv.innerHTML = '';
        for (let i = 0; i < count; i++) {
            const input = document.createElement('input');
            input.type = 'text';
            input.placeholder = `请输入第${i+1}题题号（如P1021）`;
            input.id = `problem_${i}`;
            input.style.width = '100%';
            input.style.marginBottom = '5px'; 
            input.disabled = false;
            problemInputsDiv.appendChild(input);
            problemInputsDiv.appendChild(document.createElement('br'));
        }
        document.getElementById('startCheck').style.display = 'block';

       
        const firstInput = document.getElementById('problem_0');
        if (firstInput) {
            console.log('题号输入框生成后状态：', {
                disabled: firstInput.disabled,
                readonly: firstInput.readOnly,
                display: firstInput.style.display
            });
            firstInput.focus(); 
        }
    }

    // 开始检查
    async function startChecking() {
        const fileInput = document.getElementById('fileInput');
        const problemCount = parseInt(document.getElementById('problemCount').value);
        const status = document.getElementById('status');

        if (!fileInput.files.length) {
            alert('请先选择包含学生URL的txt文件！');
            return;
        }

        const problemIds = [];
        for (let i = 0; i < problemCount; i++) {
            const pid = document.getElementById(`problem_${i}`).value.trim();
            if (!pid) {
                alert(`第${i+1}题题号不能为空！`);
                return;
            }
            problemIds.push(pid);
        }

        status.textContent = '正在读取文件...';
        const students = await readFile(fileInput.files[0]);
        if (!students.length) {
            alert('文件内容为空或格式错误！');
            return;
        }

        status.textContent = '正在检查作业完成情况...';
        const results = await checkProblems(students, problemIds);
        generateHTML(students, problemIds, results, fileInput.files[0].name);
        status.textContent = '检查完成，结果已生成！';
    }

    // 读取txt文件
    function readFile(file) {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const lines = e.target.result.split('\n').filter(line => line.trim());
                const students = lines.map(line => {
                    const [name, url] = line.trim().split(/\s+/);
                    return { name, url };
                });
                resolve(students);
            };
            reader.readAsText(file);
        });
    }

    
    async function checkProblems(students, problemIds) {
        const results = {};
        for (const student of students) {
            results[student.name] = {};
            const completedProblems = await getCompletedProblems(student.url);
            for (const pid of problemIds) {
                results[student.name][pid] = completedProblems.includes(pid) ? '完成' : '未完成';
            }
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        return results;
    }

    
    function getCompletedProblems(url) {
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                onload: async function(response) {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(response.responseText, 'text/html');
                    const completedProblems = await waitForDynamicContent(doc, url);
                    resolve(completedProblems);
                },
                onerror: function() {
                    console.error(`无法加载页面: ${url}`);
                    resolve([]);
                }
            });
        });
    }

    
    function waitForDynamicContent(doc, url) {
        return new Promise((resolve) => {
            const problemSpans = doc.querySelectorAll('.problem-btn button span');
            if (problemSpans.length > 0) {
                const completedProblems = Array.from(problemSpans).map(span => span.textContent.trim());
                resolve(completedProblems);
                return;
            }

            const win = window.open(url, '_blank');
            if (!win) {
                console.error('请允许弹出窗口以检查动态内容');
                resolve([]);
                return;
            }

            win.addEventListener('load', () => {
                const checkInterval = setInterval(() => {
                    const spans = win.document.querySelectorAll('.problem-btn button span');
                    if (spans.length > 0) {
                        const completedProblems = Array.from(spans).map(span => span.textContent.trim());
                        clearInterval(checkInterval);
                        win.close();
                        resolve(completedProblems);
                    }
                }, 500);

                setTimeout(() => {
                    clearInterval(checkInterval);
                    win.close();
                    resolve([]);
                }, 10000);
            });
        });
    }

  
    function generateHTML(students, problemIds, results, fileName) {
        const date = new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });
        let htmlContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>${date} 查题情况</title>
                <style>
                    table {
                        border-collapse: collapse;
                        margin: 20px auto;
                    }
                    th, td {
                        border: 1px solid black;
                        padding: 8px;
                        text-align: center;
                    }
                    th {
                        background-color: #f2f2f2;
                    }
                    .title {
                        text-align: center;
                        font-size: 1.2em;
                        margin: 10px 0;
                    }
                </style>
            </head>
            <body>
                <div class="title">${date} 查题情况</div>
                <table>
                    <tr><th>姓名</th>${problemIds.map(pid => `<th>${pid}</th>`).join('')}</tr>
        `;

        for (const student of students) {
            htmlContent += '<tr>';
            htmlContent += `<td>${student.name}</td>`;
            for (const pid of problemIds) {
                htmlContent += `<td>${results[student.name][pid]}</td>`;
            }
            htmlContent += '</tr>';
        }

        htmlContent += `
                </table>
            </body>
            </html>
        `;

        const blob = new Blob([htmlContent], { type: 'text/html' });
        const link = document.createElement('a');
        const dir = fileName.substring(0, fileName.lastIndexOf('/')) || '';
        link.href = URL.createObjectURL(blob);
        link.download = `${dir}/作业检查结果_${Date.now()}.html`;
        link.click();
    }

    
    createUI();
})();