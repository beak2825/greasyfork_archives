// ==UserScript==
// @name         东北大学绩点小助手
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      1.7.1
// @description  帮助东北大学学生进行绩点规划，分时间段绩点计算，便捷查看成绩和绩点变化提醒功能的脚本
// @author       FFSNOW
// @match        http://219.216.96.4/*
// @match        https://webvpn.neu.edu.cn/*
// @match        https://portal.neu.edu.cn/*
// @match        https://eone.neu.edu.cn/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_listValues
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/471378/%E4%B8%9C%E5%8C%97%E5%A4%A7%E5%AD%A6%E7%BB%A9%E7%82%B9%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/471378/%E4%B8%9C%E5%8C%97%E5%A4%A7%E5%AD%A6%E7%BB%A9%E7%82%B9%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';
    /*悬浮窗功能*/
    // 创建按钮
    let button = document.createElement('button');
    button.innerHTML = '绩点助手';
    // 设置按钮样式
    button.style.position = 'fixed';
    button.style.bottom = '20px';
    button.style.right = '20px';
    button.style.zIndex = '9999';
    button.style.backgroundColor = 'rgba(16, 55, 112, 0.7)';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '50%';
    button.style.width = '55px'; // 按钮宽度与高度相等
    button.style.height = '55px'; // 按钮宽度与高度相等
    button.style.padding = '12px';
    button.style.fontSize = '10px';
    button.style.cursor = 'move';
    button.style.boxShadow = '0 0 5px rgba(0,0,0,0.3)';
    // 按钮点击事件处理函数
    function buttonClickHandler() {
        let domain = window.location.hostname;
        if (domain === 'webvpn.neu.edu.cn') {
            window.open('https://webvpn.neu.edu.cn/http/62304135386136393339346365373340e2b0fd71d8941093ab4e2527/eams/teach/grade/course/person!historyCourseGrade.action?projectType=MAJOR');
        } else {
            window.open('http://219.216.96.4/eams/teach/grade/course/person!historyCourseGrade.action?projectType=MAJOR');
        }
    }
    // 右键菜单事件处理函数
    function buttonContextMenuHandler(event) {
        event.preventDefault();
        button.remove();
        floatingWindow.style.display = 'none';
    }
    // 创建悬浮窗
    let floatingWindow = document.createElement('div');
    floatingWindow.innerHTML = '点击进入，右键关闭，本插件作用为绩点计算，你可以输入新的一门课的学分和绩点预测绩点变化，你也可以进入绩点模拟功能随意修改绩点，进一步分析';
    floatingWindow.style.position = 'fixed';
    floatingWindow.style.backgroundColor = 'white';
    floatingWindow.style.color = 'black';
    floatingWindow.style.padding = '10px';
    floatingWindow.style.border = '1px solid black';
    floatingWindow.style.borderRadius = '5px';
    floatingWindow.style.bottom = '20px';
    floatingWindow.style.right = '80px';
    floatingWindow.style.display = 'none';
    // 将悬浮窗添加到页面上
    document.body.appendChild(floatingWindow);
    // 在按钮上绑定鼠标移入事件，显示悬浮窗口
    button.addEventListener('mouseover', function () {
        floatingWindow.style.display = 'block';
    });
    // 在按钮上绑定鼠标移出事件，隐藏悬浮窗口
    button.addEventListener('mouseout', function () {
        floatingWindow.style.display = 'none';
    });
    var flag = true;
    //绩点小助手触发器
    if (window.location.href.indexOf("person!historyCourseGrade.action") !== -1) {
        // 当前域名中包含"person!historyCourseGrade.action"，运行绩点小助手
        GPAHELPER();
        flag = false;
    }
    //学业预警助手触发器
    if (window.location.href.indexOf("myPlanCompl.action") !== -1) {
        // 当前域名中包含"myPlanCompl.action"，运行学业预警小助手
        GPAPlANHELPER();
    }
    if (flag) {
        // 将按钮添加到页面上
        document.body.appendChild(button);
    }


    // 绑定按钮点击事件
    button.addEventListener('click', buttonClickHandler);
    // 绑定右键菜单事件
    button.addEventListener('contextmenu', buttonContextMenuHandler);
    function GPAHELPER() {
        /*学期学年筛选功能*/
        //初始化筛选器
        function addFilter() {
            // 获取表格
            var table = document.querySelector('.gridtable');
            if (!table) {
                return;
            }

            // 创建筛选器输入框
            var input = document.createElement('input');
            input.type = 'text';
            input.placeholder = '筛选学年学期';
            input.style.backgroundColor = 'white'; // 背景颜色
            input.style.border = '1px solid lightgray'; // 边框样式
            input.style.padding = '10px'; // 内边距
            input.addEventListener('input', function () {
                var filterValue = input.value.toLowerCase();
                var rows = table.querySelectorAll('tbody tr');

                // 遍历表格中的每一行，根据输入框的值进行筛选
                rows.forEach(function (row) {
                    var cell = row.querySelector('td:first-child');
                    var value = cell.textContent.toLowerCase();

                    // 根据筛选值隐藏或显示行
                    if (value.indexOf(filterValue) === -1) {
                        row.style.display = 'none';
                    } else {
                        row.style.display = '';
                    }
                });
            });
            return input;
        }
        // 插入筛选器输入框
        var tableHead = document.querySelector('.gridhead');
        var newRow = tableHead.insertRow(0);
        newRow.insertCell().appendChild(addFilter());
        //新科目绩点影响
        var creditInput = document.createElement('input');
        creditInput.type = 'text';
        creditInput.placeholder = '新课学分';
        creditInput.style.backgroundColor = 'white'; // 背景颜色
        creditInput.style.border = '1px solid lightgray'; // 边框样式
        creditInput.style.padding = '10px'; // 内边距
        newRow.insertCell().appendChild(creditInput);
        //学分输入框
        var gradeInput = document.createElement('input');
        gradeInput.type = 'text';
        gradeInput.placeholder = '预估绩点';
        gradeInput.style.backgroundColor = 'white';
        gradeInput.style.border = '1px solid lightgray';
        gradeInput.style.padding = '10px';
        newRow.insertCell().appendChild(gradeInput);
        //预测绩点输入框
        var calculateButton = document.createElement('button');
        calculateButton.textContent = '筛选/预测计算';
        calculateButton.style.backgroundColor = 'white'; // 背景颜色
        calculateButton.style.color = 'black'; // 文字颜色
        calculateButton.style.width = '100%'; // 宽度设置为全宽
        calculateButton.style.padding = '10px'; // 内边距
        calculateButton.style.border = 'none'; // 去除边框
        calculateButton.style.cursor = 'pointer'; // 鼠标指针样式
        // 添加悬停样式
        calculateButton.addEventListener('mouseenter', function () {
            calculateButton.style.backgroundColor = 'lightgray';
        });

        calculateButton.addEventListener('mouseleave', function () {
            calculateButton.style.backgroundColor = 'white';
        });
        newRow.insertCell().appendChild(calculateButton);

        var resultCell = newRow.insertCell();
        resultCell.colSpan = 7;

        //绩点计划按钮
        var planbutten = document.createElement('button');
        planbutten.textContent = '学业预警';
        planbutten.style.backgroundColor = 'white'; // 背景颜色
        planbutten.style.color = 'black'; // 文字颜色
        planbutten.style.width = '100%'; // 宽度设置为全宽
        planbutten.style.padding = '10px'; // 内边距
        planbutten.style.border = 'none'; // 去除边框
        planbutten.style.cursor = 'pointer'; // 鼠标指针样式
        // 添加悬停样式
        planbutten.addEventListener('mouseenter', function () {
            planbutten.style.backgroundColor = 'lightgray';
        });

        planbutten.addEventListener('mouseleave', function () {
            planbutten.style.backgroundColor = 'white';
        });
        newRow.insertCell().appendChild(planbutten);

        //绩点模拟按钮
        var editButton = document.createElement('button');
        editButton.textContent = '绩点模拟';
        editButton.style.backgroundColor = 'white'; // 背景颜色
        editButton.style.color = 'black'; // 文字颜色
        editButton.style.width = '100%'; // 宽度设置为全宽
        editButton.style.padding = '10px'; // 内边距
        editButton.style.border = 'none'; // 去除边框
        editButton.style.cursor = 'pointer'; // 鼠标指针样式
        // 添加悬停样式
        editButton.addEventListener('mouseenter', function () {
            editButton.style.backgroundColor = 'lightgray';
        });

        editButton.addEventListener('mouseleave', function () {
            editButton.style.backgroundColor = 'white';
        });
        newRow.insertCell().appendChild(editButton);

        //绩点模拟计算按钮
        var huanxiangbutten = document.createElement('button');
        huanxiangbutten.textContent = '绩点模拟计算';
        huanxiangbutten.style.backgroundColor = 'white'; // 背景颜色
        huanxiangbutten.style.color = 'black'; // 文字颜色
        huanxiangbutten.style.width = '100%'; // 宽度设置为全宽
        huanxiangbutten.style.padding = '10px'; // 内边距
        huanxiangbutten.style.border = 'none'; // 去除边框
        huanxiangbutten.style.cursor = 'pointer'; // 鼠标指针样式
        // 添加悬停样式
        huanxiangbutten.addEventListener('mouseenter', function () {
            huanxiangbutten.style.backgroundColor = 'lightgray';
        });

        huanxiangbutten.addEventListener('mouseleave', function () {
            huanxiangbutten.style.backgroundColor = 'white';
        });
        newRow.insertCell().appendChild(huanxiangbutten);

        // 显示绩点
        var oldGPA = GM_getValue('GPA');
        //alert(oldGPA);
        var trueGPA = calculateWeightedGPA().toFixed(4);
        // 判断绩点是否发生变化
        if (oldGPA !== trueGPA) {
            alert('你的绩点从' + oldGPA + '变为了' + trueGPA);
        }
        GM_setValue('GPA', trueGPA);

        // 计算加权绩点的函数
        function calculateWeightedGPA(credit_index = 6, grade_index = 12, category_index = 4, courseCode_index = 1) {
            var table = document.querySelector('.gridtable');
            var tableBody = table.querySelector('tbody');
            var rows = tableBody.getElementsByTagName('tr');
            var totalCredit = 0;
            var totalGrade = 0;
            var totalCreditwithoutchose = 0;
            var totalGradewithoutchose = 0;

            // 获取表头单元格
            var tableHead = document.querySelector('.gridhead tr').nextElementSibling;
            var cells = tableHead.querySelectorAll('th');

            // 遍历表头中的每个单元格，查找"绩点"和"学分"所在的列数
            cells.forEach(function (cell, index) {
                var cellText = cell.textContent.trim();

                if (cellText === "绩点") {
                    grade_index = index;
                }

                if (cellText === "学分") {
                    credit_index = index;
                }

                if (cellText === "课程类别") {
                    category_index = index;
                }

                if (cellText === "课程代码") {
                    courseCode_index = index;
                }
            });
            var RWXX = " 当前人文选修（详情进入学业预警）："
            for (var i = 0; i < rows.length; i++) {
                var row = rows[i]; 2024
                var credit = parseFloat(row.cells[credit_index].textContent);
                var grade = parseFloat(row.cells[grade_index].textContent);
                var category = row.cells[category_index].textContent.trim();
                // 获取课程代码元素添加人文选修标记
                var courseCode = row.cells[courseCode_index].textContent;
                // console.log(courseCode)

                if (courseCode.startsWith("A30")) {

                    var thirdFromLast = courseCode[8];


                    if (thirdFromLast == '0') {

                        RWXX += "文化艺术类 ";
                        console.log(RWXX)
                    } else if (['1', '2', '3'].includes(thirdFromLast)) {
                        console.log(thirdFromLast)
                        RWXX += "社会管理类 ";
                    } else if (['4', '5', '6', '7'].includes(thirdFromLast)) {
                        console.log(thirdFromLast)
                        RWXX += "素养塑造类 ";
                    } else {
                        RWXX = RWXX + "未识别（" + courseCode + "） ";
                    }
                }

                if (isNaN(credit) || isNaN(grade)) {
                    continue; // 跳过数据不是数字的行
                }

                if (row.style.display === 'none') {
                    continue; // 跳过被隐藏的行
                }

                if (category != "通识选修类") {
                    totalCreditwithoutchose += credit;
                    totalGradewithoutchose += credit * grade;
                }
                totalCredit += credit;
                totalGrade += credit * grade;
            }

            var inputCredit = parseFloat(creditInput.value);
            var inputGrade = parseFloat(gradeInput.value);
            var newTotalCredit = totalCredit + inputCredit;
            var newTotalGrade = totalGrade + inputCredit * inputGrade;
            var newGPA = newTotalGrade / newTotalCredit;
            var currentGPA = totalGrade / totalCredit;
            var currentGPAwithoutchose = totalGradewithoutchose / totalCreditwithoutchose;
            var gradeChange = newGPA - currentGPA;
            // 显示加权绩点
            resultCell.innerHTML = '当前加权绩点：' + currentGPA.toFixed(4) +
                '， 加上这门课绩点：' + newGPA.toFixed(4) +
                '， 绩点变化：' + gradeChange.toFixed(4);
            if (isNaN(newGPA) || isNaN(gradeChange)) {
                resultCell.innerHTML = '当前加权绩点：' + currentGPA.toFixed(4) +
                    '， 当前总学分：' + totalCredit.toFixed(1) +
                    '，去除通识选修类加权绩点：' + currentGPAwithoutchose.toFixed(4) + '，去除选修学分：' + totalCreditwithoutchose.toFixed(1) + RWXX
            }
            return currentGPA;
        }

        // 监听计算按钮的点击事件
        calculateButton.addEventListener('click', function () {
            calculateWeightedGPA();
        });

        planbutten.addEventListener('click', function () {
            let domain = window.location.hostname;
            if (domain === 'webvpn.neu.edu.cn') {
                window.open('https://webvpn.neu.edu.cn/http/62304135386136393339346365373340e2b0fd71d8941093ab4e2527/eams/myPlanCompl.action');
            } else {
                window.open('http://219.216.96.4/eams/myPlanCompl.action');
            }
        });

        editButton.addEventListener('click', function () {
            if (document.designMode == 'off') {
                document.designMode = 'on'
                editButton.textContent = '结束模拟'
                // 显示绩点
                resultCell.innerHTML = '模拟模式可以随意改变网页内容，当前加权绩点：' + trueGPA;
                var table = document.querySelector('.gridtable');
                var tableBody = table.querySelector('tbody');

                // 获取表头单元格
                var tableHead = document.querySelector('.gridhead tr').nextElementSibling;
                var cells = tableHead.querySelectorAll('th');

                // 查找"考试情况"所在的列数
                var last_index = -1;
                cells.forEach(function (cell, index) {
                    var cellText = cell.textContent.trim();
                    if (cellText === "考试情况") {
                        last_index = index;
                    }
                });

                // 插入行
                for (var i = 0; i < 20; i++) {
                    var row = tableBody.insertRow();
                    row.classList.add('griddata-odd');
                    for (var j = 0; j < last_index + 1; j++) {
                        var celll = row.insertCell();
                        if (j === 3) {
                            celll.textContent = '模拟课程' + (i + 1);
                        } else {
                            celll.textContent = ' ';
                        }
                    }
                }
            }
            else {
                document.designMode = 'off'
                editButton.textContent = '模拟计算'
                location.reload();
            };
        });

        // 监听按钮的点击事件
        huanxiangbutten.addEventListener('click', function () {
            // 显示绩点
            var dreamGPA = calculateWeightedGPA();
            resultCell.innerHTML = '真实加权绩点：' + trueGPA + '，模拟绩点：' + dreamGPA.toFixed(4) + '，变化：' + (dreamGPA - trueGPA).toFixed(4);
        });


    }
    function GPAPlANHELPER() {
        GM_setValue("TRUEGPA", document.querySelector('.infoTable').querySelectorAll('td')[23].innerText);
        var table = document.querySelector('.formTable');
        if (!table) {
            return;
        }
        GM_setValue("KEY", document.querySelector('.infoTable').querySelectorAll('td')[1].innerText);
        //绩点显示列
        var rows = table.querySelectorAll('tr');
        const elements = document.querySelectorAll(".darkColumn");
        elements.forEach(element => {
            element.style.backgroundColor = '#eeeeee';
        });
        // 遍历每一行
        for (var i = 0; i < rows.length; i++) {
            // 忽略class为darkColumn的行
            if (i === 0) {
                var title = document.createElement('td');
                title.innerText = "绩点\n学分";
                title.style.textAlign = 'center';
                title.style.width = '50px';
                title.style.display = 'block';
                title.style.border = 'solid';
                title.style.borderWidth = '0px';
                title.style.borderRightWidth = '0px';
                title.style.borderBottomWidth = '1px';
                title.style.bordertopWidth = '1px';
                rows[i].insertBefore(title, rows[i].querySelectorAll('td')[10]);
            } else if (!rows[i].classList.contains('darkColumn')) {
                // 获取课程代码元素添加人文选修标记
                var courseCode = rows[i].querySelectorAll('td')[1];
                if (courseCode.innerText.startsWith("A30")) {
                    var thirdFromLast = courseCode.innerText[8];
                    if (thirdFromLast == '0') {
                        courseCode.innerText += "\n(文化艺术类)";
                    } else if (['1', '2', '3'].includes(thirdFromLast)) {
                        courseCode.innerText += "\n(社会管理类)";
                    } else if (['4', '5', '6', '7'].includes(thirdFromLast)) {
                        courseCode.innerText += "\n(素养塑造类)";
                    } else {
                        courseCode.innerText += "\n(未识别，请登录教务处网站查询)";
                    }
                }
                // 获取成绩元素
                var gradeCell = rows[i].querySelectorAll('td')[7];
                // 获取学分元素
                var TCreditCell = rows[i].querySelectorAll('td')[4];
                // 获取成绩值并转化
                var grade = gradeCell.innerText;
                var tip = rows[i].querySelectorAll('td')[9].innerText;
                var name = rows[i].querySelectorAll('td')[2].innerText;
                // 获取学分值
                var credit = TCreditCell.innerText;
                // 定义绩点转化函数
                function getGPA(score, tip) {
                    if (score === '优') {
                        return 4.5;
                    } else if (score === '良') {
                        return 3.5;
                    } else if (score === '中') {
                        return 2.5;
                    } else if (score === '及格') {
                        return 1.5;
                    } else if (score === '不及格') {
                        return 0;
                    } else if (score === '合格') {
                        return 3.0;
                    } else if (score === '不合格') {
                        return 0;
                    } else if (score === '--' || score === '') {
                        console.log(tip.toString());
                        if (tip.toString().includes("替代课程")) {
                            return -1;
                        }
                        if (tip.toString().includes("在读")) {
                            return "在读";
                        }
                        return '待读';
                    } else {
                        return (score - 50) / 10;
                    }
                }
                // 创建绩点元素
                var gpaCell = document.createElement('td');
                // 获取成绩对应的绩点
                var gpa = getGPA(grade, tip);
                if (gpa == -1) {
                    if (GM_getValue(name)) {
                        gpa = GM_getValue(name);
                    } else {
                        var gpaInput = window.prompt("查询到替代" + name + "的课程\n请输入[" + rows[i].querySelectorAll('td')[9].innerText + "]绩点\n如果该课程不计入绩点直接确定\n输入后会保存，您可以通过清除记录按钮来重置输入：");
                        var creditInput = window.prompt("请输入替代" + name + "的[" + rows[i].querySelectorAll('td')[9].innerText + "]学分：\n如果该课程学分和被替代的课程一致请取消");

                        if (gpaInput) {
                            gpa = parseFloat(gpaInput);
                        } else if (gpaInput === '') {
                            gpa = "不计入"
                        } else {
                            gpa = "不计入"
                        }
                        if (creditInput) {
                            credit = parseFloat(creditInput);
                        } else if (creditInput === '') {
                            credit = parseFloat(rows[i].querySelectorAll('td')[4].innerText);
                        } else {
                            credit = parseFloat(rows[i].querySelectorAll('td')[4].innerText);
                        }
                        GM_setValue(name, gpa)
                    }
                }
                // 设置绩点元素的内容
                gpaCell.innerText = gpa;
                gpaCell.style.textAlign = 'center';
                gpaCell.style.width = '50px';
                gpaCell.style.display = 'block';
                gpaCell.style.border = 'solid';
                gpaCell.style.borderWidth = '0px';
                gpaCell.style.borderRightWidth = '0px';
                gpaCell.style.borderBottomWidth = '0px';
                gpaCell.style.bordertopWidth = '1px';
                // 将绩点元素插入到行中（注意调整列数）
                rows[i].insertBefore(gpaCell, rows[i].querySelectorAll('td')[10]);
                //创建学分元素
                var CreditCell = document.createElement('td');
                CreditCell.innerText = credit;
                CreditCell.style.textAlign = 'center';
                CreditCell.style.width = '50px';
                CreditCell.style.display = 'block';
                CreditCell.style.border = 'solid';
                CreditCell.style.borderWidth = '0px';
                CreditCell.style.borderRightWidth = '0px';
                CreditCell.style.borderBottomWidth = '1px';
                CreditCell.style.bordertopWidth = '1px';
                CreditCell.style.backgroundColor = '#f7f7f7';

                rows[i].insertBefore(CreditCell, rows[i].querySelectorAll('td')[11]);
            } else {
                var Atitle = document.createElement('td');
                Atitle.innerText = "绩点";
                Atitle.style.textAlign = 'center';
                Atitle.style.width = '50px';
                Atitle.style.display = 'block';
                Atitle.style.border = 'solid';
                Atitle.style.borderWidth = '0px';
                Atitle.style.borderRightWidth = '0px';
                Atitle.style.borderBottomWidth = '1px';
                Atitle.style.bordertopWidth = '1px';
                Atitle.style.backgroundColor = '#eeeeee';
                rows[i].insertBefore(Atitle, rows[i].querySelectorAll('td')[10]);
                var Btitle = document.createElement('td');
                Btitle.innerText = "学分";
                Btitle.style.textAlign = 'center';
                Btitle.style.width = '50px';
                Btitle.style.display = 'block';
                Btitle.style.border = 'solid';
                Btitle.style.borderWidth = '0px';
                Btitle.style.borderRightWidth = '0px';
                Btitle.style.borderBottomWidth = '1px';
                Btitle.style.bordertopWidth = '1px';
                Btitle.style.backgroundColor = '#eeeeee';
                rows[i].insertBefore(Btitle, rows[i].querySelectorAll('td')[11]);
            }

        }

        var tableHead = document.querySelector('.formTable');
        var newRow = tableHead.insertRow(0);
        //清除替代课程记录按钮
        var delButton = document.createElement('button');
        delButton.textContent = '清除记录';
        delButton.style.backgroundColor = 'white'; // 背景颜色
        delButton.style.color = 'black'; // 文字颜色
        delButton.style.width = '100%'; // 宽度设置为全宽
        delButton.style.padding = '10px'; // 内边距
        delButton.style.border = 'none'; // 去除边框
        delButton.style.cursor = 'pointer'; // 鼠标指针样式
        // 添加悬停样式
        delButton.addEventListener('mouseenter', function () {
            delButton.style.backgroundColor = 'lightgray';
        });
        delButton.addEventListener('mouseleave', function () {
            delButton.style.backgroundColor = 'white';
        });
        newRow.insertCell().appendChild(delButton);

        //显示框

        var resultCell = newRow.insertCell();
        resultCell.colSpan = 8;
        resultCell.style.textAlign = 'center';

        //绩点模拟按钮
        var editButton = document.createElement('button');
        editButton.textContent = '编辑，可以修改最后一列绩点';
        editButton.style.backgroundColor = 'white'; // 背景颜色
        editButton.style.color = 'black'; // 文字颜色
        editButton.style.width = '100%'; // 宽度设置为全宽
        editButton.style.padding = '10px'; // 内边距
        editButton.style.border = 'none'; // 去除边框
        editButton.style.cursor = 'pointer'; // 鼠标指针样式

        // 添加悬停样式
        editButton.addEventListener('mouseenter', function () {
            editButton.style.backgroundColor = 'lightgray';
        });

        editButton.addEventListener('mouseleave', function () {
            editButton.style.backgroundColor = 'white';
        });
        newRow.insertCell().appendChild(editButton);
        //绩点模拟计算按钮
        var huanxiangbutten = document.createElement('button');
        huanxiangbutten.textContent = '模拟计算';
        huanxiangbutten.style.backgroundColor = 'white'; // 背景颜色
        huanxiangbutten.style.color = 'black'; // 文字颜色
        huanxiangbutten.style.width = '100%'; // 宽度设置为全宽
        huanxiangbutten.style.padding = '10px'; // 内边距
        huanxiangbutten.style.border = 'none'; // 去除边框
        huanxiangbutten.style.cursor = 'pointer'; // 鼠标指针样式
        // 添加悬停样式
        huanxiangbutten.addEventListener('mouseenter', function () {
            huanxiangbutten.style.backgroundColor = 'lightgray';
        });

        huanxiangbutten.addEventListener('mouseleave', function () {
            huanxiangbutten.style.backgroundColor = 'white';
        });
        newRow.insertCell().appendChild(huanxiangbutten);

        // 计算加权绩点的函数
        calculateWeightedGPA();
        function calculateWeightedGPA(credit_index = 11, grade_index = 10, category_index = 3) {
            var table = document.querySelector('.formTable');
            var rows = table.getElementsByTagName('tr');
            var totalCredit = 0;
            var totalGrade = 0;
            var totalCreditwithoutchose = 0;
            var totalGradewithoutchose = 0;
            for (var i = 2; i < rows.length; i++) {
                if (rows[i].classList.contains('darkColumn')) {
                    console.log(rows[i].classList); // 打印类名列表
                    continue; // 跳过不是成绩的行
                }
                var row = rows[i];
                var credit = parseFloat(row.cells[credit_index].textContent);
                var grade = parseFloat(row.cells[grade_index].textContent);
                var category = row.cells[category_index].textContent.trim();


                if (isNaN(credit) || isNaN(grade)) {
                    row.cells[0].textContent = "×";
                    continue; // 跳过数据不是数字的行
                }

                if (row.style.display === 'none') {
                    continue; // 跳过被隐藏的行
                }
                row.cells[0].textContent = "√";
                //console.log(row.cells[2].textContent + '\t' + row.cells[credit_index].textContent + '\t' + row.cells[grade_index].textContent);
                if (category != "否") {
                    row.cells[0].textContent = "√√";
                    totalCreditwithoutchose += credit;
                    totalGradewithoutchose += credit * grade;
                }
                totalCredit += credit;
                totalGrade += credit * grade;
            }
            var currentGPA = totalGrade / totalCredit;
            var currentGPAwithoutchose = totalGradewithoutchose / totalCreditwithoutchose;
            // 显示加权绩点

            resultCell.innerHTML = '当前加权绩点：' + currentGPA.toFixed(4) +
                '， 当前总学分：' + totalCredit.toFixed(1) +
                '，必修课加权绩点：' + currentGPAwithoutchose.toFixed(4) + '，必修课学分：' + totalCreditwithoutchose.toFixed(1) + '，必修课成绩：' + (currentGPAwithoutchose.toFixed(4) * 10 + 50)
            if (parseFloat(GM_getValue("TRUEGPA")).toFixed(4) !== parseFloat(currentGPA).toFixed(4) && document.designMode == 'off') {
                alert(parseFloat(GM_getValue("TRUEGPA")) + "≠" + parseFloat(currentGPA).toFixed(4) + "绩点计算可能存在错误，请检查替代课程学分和绩点输入是否输入正确,使用清除记录按钮可以重新输入");
            }
            return currentGPA;
        }
        editButton.addEventListener('click', function () {
            if (document.designMode == 'off') {
                document.designMode = 'on'
                editButton.textContent = '结束'
                // 显示绩点
                resultCell.innerHTML = '修改最后一行内容上为绩点下为学分，点击模拟计算即可计算模拟绩点，当前加权绩点：' + GM_getValue('GPA');
            }
            else {
                document.designMode = 'off'
                editButton.textContent = '编辑'
                location.reload();
            };
        });

        // 监听按钮的点击事件
        huanxiangbutten.addEventListener('click', function () {
            // 显示绩点
            calculateWeightedGPA();
            resultCell.innerHTML = '模拟绩点：' + resultCell.innerHTML
        });
        // 监听按钮的点击事件
        delButton.addEventListener('click', function () {
            var t = GM_getValue("GPA");
            var allValues = GM_listValues();
            allValues.forEach(function (key) {
                GM_deleteValue(key);
            });
            GM_setValue("GPA", t);
            alert("清除成功")
            location.reload();
        });
    }

})();