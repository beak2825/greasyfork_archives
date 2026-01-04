// ==UserScript==
// @name         Excel 成绩填充（姓名+学号匹配 + 状态写回）
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  读取 Excel，匹配姓名和学号后填充成绩，并写回 Excel 状态列
// @author       You
// @match        https://jwmis.cqwu.edu.cn/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/528502/Excel%20%E6%88%90%E7%BB%A9%E5%A1%AB%E5%85%85%EF%BC%88%E5%A7%93%E5%90%8D%2B%E5%AD%A6%E5%8F%B7%E5%8C%B9%E9%85%8D%20%2B%20%E7%8A%B6%E6%80%81%E5%86%99%E5%9B%9E%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/528502/Excel%20%E6%88%90%E7%BB%A9%E5%A1%AB%E5%85%85%EF%BC%88%E5%A7%93%E5%90%8D%2B%E5%AD%A6%E5%8F%B7%E5%8C%B9%E9%85%8D%20%2B%20%E7%8A%B6%E6%80%81%E5%86%99%E5%9B%9E%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("脚本已加载，等待 iframe#frmReportA 出现...");

    // 监听 DOM 变化，等待 iframe 出现
    const observer = new MutationObserver(() => {
        const iframe = document.getElementById("frmReportA");

        if (iframe && !document.getElementById("excelUploadBtn")) {
            console.log("iframe#frmReportA 已加载，插入上传按钮...");

            // 1. 创建上传按钮
            let fileInput = document.createElement("input");
            fileInput.type = "file";
            fileInput.id = "excelUploadBtn";
            fileInput.accept = ".xlsx, .xls";

            // 2. 设置样式（顶部居中）
            Object.assign(fileInput.style, {
                position: "fixed",
                top: "10px",
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: "9999",
                padding: "10px",
                background: "#007bff",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontSize: "16px"
            });

            document.body.appendChild(fileInput);

            console.log("上传按钮已成功插入！");

            // 3. 监听文件上传
            fileInput.addEventListener("change", function(event) {
                let file = event.target.files[0];
                let reader = new FileReader();

                reader.onload = function(e) {
                    let data = new Uint8Array(e.target.result);
                    let workbook = XLSX.read(data, { type: 'array' });
                    let sheet = workbook.Sheets[workbook.SheetNames[0]];
                    let jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

                    console.log("Excel 数据：", jsonData);

                    // 解析数据（假设 Excel 第一列是姓名，第二列是学号，第三列是成绩）
                    let students = {};
                    jsonData.forEach((row, index) => {
                        if (row.length >= 3) {
                            let name = row[0].trim();  // 姓名
                            let studentId = String(row[1]).trim(); // 学号（转字符串）
                            let score = row[2]; // 成绩
                            students[studentId] = { name, score, index };
                        }
                    });

                    console.log("解析后的学生数据：", students);

                    // 4. 遍历网页，匹配学号和姓名，填充成绩
                    let updateExcel = Array(jsonData.length).fill(null); // 记录状态

                    document.querySelectorAll("td[name='yhxh']").forEach(td => {
                        let studentId = td.innerText.trim(); // 获取学号
                        let rowPrefix = td.id.replace("_yhxh", ""); // 获取行前缀（如 tr0）
                        let nameTd = document.getElementById(`${rowPrefix}_xm`); // 获取姓名单元格

                        if (nameTd) {
                            let studentName = nameTd.innerText.trim(); // 获取网页中的姓名

                            if (students[studentId] && students[studentId].name === studentName) {
                                let scoreInput = document.getElementById(`${rowPrefix}_cj`); // 获取成绩输入框

                                if (scoreInput) {
                                    scoreInput.value = students[studentId].score;
                                    console.log(`✅ 已填充学号 ${studentId}（${studentName}）的成绩: ${students[studentId].score}`);

                                    // Excel 写入 "已完成"
                                    updateExcel[students[studentId].index] = "已完成";
                                } else {
                                    console.warn(`❌ 未找到学号 ${studentId} 的成绩输入框`);
                                    updateExcel[students[studentId].index] = "未找到成绩输入框";
                                }
                            } else {
                                console.warn(`⚠️ 学号 ${studentId} 姓名不匹配，Excel: ${students[studentId]?.name}，网页: ${studentName}`);
                                updateExcel[students[studentId].index] = "信息不匹配";
                            }
                        }
                    });

                    // 5. 把 "状态" 列写回 Excel
                    jsonData.forEach((row, index) => {
                        row[3] = updateExcel[index] || "未匹配";
                    });

                    // 6. 生成新的 Excel
                    let newSheet = XLSX.utils.aoa_to_sheet(jsonData);
                    let newWorkbook = XLSX.utils.book_new();
                    XLSX.utils.book_append_sheet(newWorkbook, newSheet, "成绩填充结果");

                    // 7. 触发下载
                    let excelBlob = XLSX.write(newWorkbook, { bookType: 'xlsx', type: 'blob' });
                    let downloadLink = document.createElement("a");
                    downloadLink.href = URL.createObjectURL(excelBlob);
                    downloadLink.download = "成绩填充结果.xlsx";
                    document.body.appendChild(downloadLink);
                    downloadLink.click();
                    document.body.removeChild(downloadLink);
                };

                reader.readAsArrayBuffer(file);
            });

            // 停止监听，避免重复执行
            observer.disconnect();
        }
    });

    // 监听整个页面
    observer.observe(document.body, { childList: true, subtree: true });

})();
