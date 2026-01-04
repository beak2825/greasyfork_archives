// ==UserScript==
// @name         上财教务系统成绩一键录入
// @namespace    http://tampermonkey.net/
// @version      2025-06-24
// @description  通过上传Excel文件，自动读取并录入平时成绩和期末成绩，并一键保存。
// @author       wyih with Gemini
// @match        https://eams.sufe.edu.cn/eams/teach/grade/course/teacher-ga!input.action*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sufe.edu.cn
// @require      https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js
// @license      MIT
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/540642/%E4%B8%8A%E8%B4%A2%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E6%88%90%E7%BB%A9%E4%B8%80%E9%94%AE%E5%BD%95%E5%85%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/540642/%E4%B8%8A%E8%B4%A2%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E6%88%90%E7%BB%A9%E4%B8%80%E9%94%AE%E5%BD%95%E5%85%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * 创建并注入UI界面到页面
     */
    function createUI() {
        const toolbar = document.querySelector('.toolbar-items');
        if (!toolbar) {
            console.error('上财教务助手：未找到工具栏，无法注入按钮。');
            return;
        }

        const container = document.createElement('div');
        container.id = 'grade-importer-container';
        container.style.display = 'inline-block';
        container.style.marginLeft = '20px';
        container.style.verticalAlign = 'middle';

        // 创建按钮和文件输入框的HTML
        container.innerHTML = `
            <input type="file" id="excel-file-input" accept=".xlsx, .xls, .csv" style="display:none;">
            <button id="upload-excel-btn" class="custom-btn">导入Excel成绩</button>
            <button id="save-grades-btn" class="custom-btn">保存成绩</button>
            <span id="importer-status" style="margin-left: 10px; font-weight: bold;"></span>
        `;

        // 将UI元素添加到工具栏中“后退”按钮的后面
        const backButton = Array.from(toolbar.children).find(el => el.textContent.includes('后退'));
        if (backButton) {
            backButton.after(container);
        } else {
            toolbar.appendChild(container);
        }

        // 添加按钮样式
        GM_addStyle(`
            .custom-btn {
                padding: 3px 12px;
                cursor: pointer;
                border: 1px solid #ccc;
                background-color: #f0f0f0;
                border-radius: 4px;
                font-size: 13px;
                margin: 0 5px;
            }
            .custom-btn:hover {
                background-color: #e0e0e0;
                border-color: #bbb;
            }
        `);

        // 绑定事件
        document.getElementById('upload-excel-btn').addEventListener('click', () => {
            document.getElementById('excel-file-input').value = null; // 允许重复上传同一个文件
            document.getElementById('excel-file-input').click();
        });
        document.getElementById('excel-file-input').addEventListener('change', handleFileSelect, false);
        document.getElementById('save-grades-btn').addEventListener('click', saveGrades);
    }

    /**
     * 处理文件选择和读取
     * @param {Event} event - 文件选择事件
     */
    function handleFileSelect(event) {
        const file = event.target.files[0];
        if (!file) return;
        updateStatus('正在读取文件...', 'blue');

        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const data = new Uint8Array(e.target.result);
                processExcelData(data);
            } catch (error) {
                console.error('文件读取或处理失败:', error);
                updateStatus('文件处理失败，请检查文件格式。', 'red');
                alert('文件处理失败，请检查文件格式或查看控制台(F12)获取更多信息。');
            }
        };
        reader.readAsArrayBuffer(file);
    }

    /**
     * 处理读取到的Excel数据
     * @param {Uint8Array} data - Excel文件数据
     */
    function processExcelData(data) {
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: "" });

        const studentGrades = parseStudentDataFromSheet(jsonData);
        if (studentGrades.length === 0) {
            updateStatus('未在Excel中找到学生数据。请检查文件格式。', 'red');
            alert('未在Excel中找到学生数据。请确保表头包含"学号"、"平时"、"期末"等关键字。');
            return;
        }

        const pageStudents = mapStudentsOnPage();
        fillGrades(studentGrades, pageStudents);
    }

    /**
     * 从工作表数据中解析出学生信息
     * @param {Array<Array<any>>} rows - 工作表数据
     * @returns {Array<{studentId: string, usualScore: string, endScore: string}>}
     */
    function parseStudentDataFromSheet(rows) {
        let headerRowIndex = -1;
        let idCol = -1, usualCol = -1, endCol = -1;

        // 查找包含“学号”、“平时”、“期末”的表头行
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const idIndex = row.findIndex(cell => typeof cell === 'string' && cell.trim().includes('学号'));
            const usualIndex = row.findIndex(cell => typeof cell === 'string' && cell.trim().includes('平时'));
            const endIndex = row.findIndex(cell => typeof cell === 'string' && cell.trim().includes('期末'));

            if (idIndex !== -1 && usualIndex !== -1 && endIndex !== -1) {
                headerRowIndex = i;
                idCol = idIndex;
                usualCol = usualIndex;
                endCol = endIndex;
                break;
            }
        }

        if (headerRowIndex === -1) return [];

        const grades = [];
        for (let i = headerRowIndex + 1; i < rows.length; i++) {
            const row = rows[i];
            if (!row || row.length < Math.max(idCol, usualCol, endCol)) continue;
            
            const studentId = row[idCol] ? String(row[idCol]).trim() : null;
            if (studentId && /^\d+$/.test(studentId)) { // 确保学号是数字字符串
                grades.push({
                    studentId: studentId,
                    usualScore: row[usualCol] ?? '',
                    endScore: row[endCol] ?? ''
                });
            }
        }
        return grades;
    }

    /**
     * 扫描页面，建立学号到学生信息输入框的映射
     * @returns {Object.<string, {usualInput: HTMLElement, endInput: HTMLElement, index: string}>}
     */
    function mapStudentsOnPage() {
        const studentMap = {};
        const rows = document.querySelectorAll('.gridtable > tbody > tr');

        rows.forEach(row => {
            // 跳过表头行
            if (row.querySelector('td').textContent.trim() === '序号') return;

            const cells = row.querySelectorAll('td');
            // 每行有两列学生数据
            if (cells.length === 12) {
                // 处理第一列学生
                processStudentCell(cells, 0, studentMap);
                // 处理第二列学生
                processStudentCell(cells, 6, studentMap);
            }
        });
        return studentMap;
    }

    /**
     * 处理单个学生的数据单元格
     * @param {NodeListOf<HTMLTableCellElement>} cells - 当前行的所有单元格
     * @param {number} startIndex - 学生数据开始的单元格索引 (0 或 6)
     * @param {object} studentMap - 存储映射结果的对象
     */
    function processStudentCell(cells, startIndex, studentMap) {
        const index = cells[startIndex].textContent.trim();
        const studentId = cells[startIndex + 1].textContent.trim();
        const usualInput = document.getElementById(`USUAL_${index}`);
        const endInput = document.getElementById(`END_${index}`);

        if (studentId && usualInput && endInput) {
            studentMap[studentId] = { usualInput, endInput, index };
        }
    }

    /**
     * 将解析出的成绩填入页面表单
     * @param {Array} studentGrades - 从Excel解析的成绩数据
     * @param {Object} pageStudents - 从页面扫描的学生映射
     */
    function fillGrades(studentGrades, pageStudents) {
        let foundCount = 0;
        let notFoundIds = [];

        studentGrades.forEach(grade => {
            if (pageStudents[grade.studentId]) {
                const { usualInput, endInput } = pageStudents[grade.studentId];
                usualInput.value = grade.usualScore;
                endInput.value = grade.endScore;

                // 触发onblur事件以自动计算总评成绩
                usualInput.dispatchEvent(new Event('blur', { bubbles: true }));
                endInput.dispatchEvent(new Event('blur', { bubbles: true }));
                
                foundCount++;
            } else {
                notFoundIds.push(grade.studentId);
            }
        });

        let statusMessage = `成功填入 ${foundCount} 名学生。`;
        if (notFoundIds.length > 0) {
            statusMessage += ` ${notFoundIds.length} 名学生未在页面中找到。`;
            console.warn('未在页面上找到以下学号:', notFoundIds);
        }
        updateStatus(statusMessage, 'green');

        if (notFoundIds.length > 0) {
            alert(statusMessage + '\n\n详细学号列表请查看浏览器控制台 (按F12)。');
        }
    }

    /**
     * 触发页面的保存功能
     */
    function saveGrades() {
        // 页面自带的保存函数是 `subGrade`, 位于全局作用域
        if (typeof window.subGrade === 'function') {
            updateStatus('正在保存...', 'blue');
            // 调用页面自带的保存函数
            window.subGrade(true);
            // 注意：页面会提交并刷新，所以后续的JS可能不会执行
        } else {
            alert('错误：未找到页面的保存功能函数(subGrade)，无法自动保存。');
            updateStatus('保存失败。', 'red');
        }
    }

    /**
     * 更新状态显示文本
     * @param {string} message - 要显示的消息
     * @param {string} color - 文本颜色
     */
    function updateStatus(message, color) {
        const statusEl = document.getElementById('importer-status');
        if (statusEl) {
            statusEl.textContent = message;
            statusEl.style.color = color;
        }
    }

    // --- 主程序入口 ---
    // 等待页面完全加载完毕，确保所有JS对象（如gradeTable）都已初始化
    window.addEventListener('load', createUI);

})();
