// ==UserScript==
// @name         上财课程点名册导出（增强版）
// @namespace    
// @version      1.1.0
// @author       wyih
// @description  将上海财经大学课程点名册导出为Excel表格，支持各种班级规模
// @license      ISC
// @match        https://eams.sufe.edu.cn/eams/teacherTask!printAttendanceCheckList.action*
// @require      https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/529292/%E4%B8%8A%E8%B4%A2%E8%AF%BE%E7%A8%8B%E7%82%B9%E5%90%8D%E5%86%8C%E5%AF%BC%E5%87%BA%EF%BC%88%E5%A2%9E%E5%BC%BA%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/529292/%E4%B8%8A%E8%B4%A2%E8%AF%BE%E7%A8%8B%E7%82%B9%E5%90%8D%E5%86%8C%E5%AF%BC%E5%87%BA%EF%BC%88%E5%A2%9E%E5%BC%BA%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // 添加导出按钮到多个可能的位置
    function addExportButton() {
        // 尝试多个可能的工具栏位置
        const toolbarSelectors = [
            '#toolbar14832979851',
            '.toolbar',
            'div[id^="toolbar"]',
            'body'  // 最后的备选位置
        ];
        
        let toolbar = null;
        for(const selector of toolbarSelectors) {
            const element = document.querySelector(selector);
            if(element) {
                toolbar = element;
                break;
            }
        }
        
        if(!toolbar) {
            console.error('找不到工具栏，尝试延迟添加按钮');
            setTimeout(addExportButton, 1000); // 再次尝试
            return;
        }

        // 检查按钮是否已存在
        if(document.getElementById('exportExcelBtn')) return;

        const exportBtn = document.createElement('button');
        exportBtn.id = 'exportExcelBtn';
        exportBtn.textContent = '导出Excel';
        exportBtn.style.marginLeft = '10px';
        exportBtn.style.padding = '3px 8px';
        exportBtn.style.backgroundColor = '#4CAF50';
        exportBtn.style.color = 'white';
        exportBtn.style.border = 'none';
        exportBtn.style.borderRadius = '4px';
        exportBtn.style.cursor = 'pointer';
        exportBtn.onclick = exportToExcel;
        
        toolbar.appendChild(exportBtn);
        console.log('成功添加导出按钮');
    }

    // 从表格中提取数据（更健壮的版本）
    function getTableData() {
        const tables = document.getElementsByClassName('listTable');
        if(!tables || tables.length === 0) {
            console.error('未找到学生名单表格');
            alert('未找到学生名单表格，请确认页面已完全加载');
            return [];
        }
        
        let data = [];
        let studentCount = 0;
        
        // 遍历所有表格
        for(let t = 0; t < tables.length; t++) {
            const table = tables[t];
            const rows = table.getElementsByTagName('tr');
            
            if(rows.length <= 1) {
                console.warn(`表格 #${t+1} 没有足够的行数`);
                continue;
            }
            
            // 获取表头
            const headerRow = rows[0];
            const headerCells = headerRow.getElementsByTagName('td');
            
            // 验证这是学生名单表格
            if(headerCells.length < 6 || 
               !headerCells[0].textContent.includes('序号') || 
               !headerCells[1].textContent.includes('学号')) {
                console.warn(`表格 #${t+1} 不是学生名单表格`);
                continue;
            }
            
            // 处理数据行
            for(let i = 1; i < rows.length; i++) {
                const row = rows[i];
                const cells = row.getElementsByTagName('td');
                
                // 确保有足够的单元格
                if(cells.length < 6) {
                    console.warn(`表格 #${t+1} 行 #${i} 单元格数量不足`);
                    continue;
                }
                
                // 检查是否是有效的学生行（学号单元格应该有内容）
                const studentId = cells[1].textContent.trim();
                if(!studentId || studentId.length < 5) {
                    console.warn(`表格 #${t+1} 行 #${i} 不是有效的学生行`);
                    continue;
                }
                
                // 提取学生数据
                let rowData = {
                    '序号': cells[0].textContent.trim(),
                    '学号': studentId,
                    '姓名': cells[2].textContent.trim(),
                    '性别': cells[3].textContent.trim(),
                    '修读类别': cells[4].textContent.trim(),
                    '班级': cells[5].textContent.trim()
                };
                
                // 检查是否有红色标记(毕业班学生)
                if(row.style && row.style.color === 'red' || 
                   row.className && row.className.includes('red') ||
                   row.getAttribute('style') && row.getAttribute('style').includes('color:red')) {
                    rowData['备注'] = '毕业班学生';
                }
                
                data.push(rowData);
                studentCount++;
            }
        }
        
        console.log(`成功提取 ${studentCount} 名学生的数据`);
        return data;
    }

    // 获取课程信息（更健壮的版本）
    function getCourseInfo() {
        const courseInfo = {
            semester: '',
            courseNo: '',
            courseName: '',
            teacher: '',
            schedule: ''
        };
        
        try {
            // 获取学期信息
            const semesterElems = document.querySelectorAll('.contentTableTitleTextStyle b');
            for(let elem of semesterElems) {
                if(elem.textContent.includes('学年') || elem.textContent.includes('学期')) {
                    courseInfo.semester = elem.textContent.trim();
                    break;
                }
            }
            
            // 获取课程信息
            const infoRows = document.querySelectorAll('.infoTitle');
            for(let row of infoRows) {
                const text = row.textContent || '';
                
                if(text.includes('课程序号')) {
                    const match = text.match(/课程序号：(\d+)/);
                    if(match) courseInfo.courseNo = match[1];
                }
                
                if(text.includes('课程名称')) {
                    const nameMatch = text.match(/课程名称：(.+)/);
                    if(nameMatch) courseInfo.courseName = nameMatch[1].trim();
                }
                
                if(text.includes('授课教师')) {
                    const teacherMatch = text.match(/授课教师：([^课]+)/);
                    if(teacherMatch) courseInfo.teacher = teacherMatch[1].trim();
                }
                
                if(text.includes('课程安排')) {
                    const scheduleMatch = text.match(/课程安排：(.+)/);
                    if(scheduleMatch) courseInfo.schedule = scheduleMatch[1].trim();
                }
            }
            
            // 如果没有找到课程名称，尝试从标题获取
            if(!courseInfo.courseName) {
                const titleElem = document.querySelector('title');
                if(titleElem && titleElem.textContent) {
                    courseInfo.courseName = titleElem.textContent.trim();
                }
            }
        } catch(e) {
            console.error('获取课程信息时出错:', e);
        }
        
        return courseInfo;
    }

    // 导出到Excel
    function exportToExcel() {
        try {
            const data = getTableData();
            if(!data || data.length === 0) {
                alert('未能提取到学生数据，请确认页面已完全加载');
                return;
            }
            
            const courseInfo = getCourseInfo();
            
            // 创建工作簿
            const wb = XLSX.utils.book_new();
            
            // 创建标题数据
            const titleData = [
                ['上海财经大学课程点名册'],
                [`学期: ${courseInfo.semester || '未知学期'}`],
                [`课程: ${courseInfo.courseName || '未知课程'} ${courseInfo.courseNo ? `(${courseInfo.courseNo})` : ''}`],
                [`教师: ${courseInfo.teacher || '未知教师'}`],
                [`课程安排: ${courseInfo.schedule || '未知安排'}`],
                [''] // 空行
            ];
            
            // 创建标题工作表
            const ws = XLSX.utils.aoa_to_sheet(titleData);
            
            // 添加学生数据
            XLSX.utils.sheet_add_json(ws, data, {origin: 'A7'});
            
            // 添加工作表到工作簿
            XLSX.utils.book_append_sheet(wb, ws, "学生名单");
            
            // 生成文件名
            let fileName = '课程点名册';
            if(courseInfo.courseName) fileName = courseInfo.courseName;
            if(courseInfo.courseNo) fileName += `_${courseInfo.courseNo}`;
            fileName += '_学生名单.xlsx';
            
            // 导出文件
            XLSX.writeFile(wb, fileName);
            
            // 显示成功消息
            alert(`已成功导出 ${data.length} 名学生的名单到Excel文件`);
        } catch(e) {
            console.error('导出Excel时出错:', e);
            alert(`导出失败: ${e.message}`);
        }
    }

    // 使用多种方法确保脚本在页面加载后执行
    function init() {
        console.log('初始化导出脚本...');
        
        // 方法1: 使用load事件
        if(document.readyState === 'complete') {
            addExportButton();
        } else {
            window.addEventListener('load', addExportButton);
        }
        
        // 方法2: 使用DOMContentLoaded事件
        document.addEventListener('DOMContentLoaded', addExportButton);
        
        // 方法3: 使用定时器
        setTimeout(addExportButton, 1000);
        setTimeout(addExportButton, 3000);
    }
    
    // 启动脚本
    init();
})();