// ==UserScript==
// @name        东南大学课表样式调整
// @namespace   http://tampermonkey.net/
// @version     1.0.4
// @description 修改了原东南大学办事大厅“我的课表”的一些愚蠢设计。注意，目前本脚本仅在tampermonkey上测试过，且仅针对本人课表做了优化，保证打印时不会超出页面。如果在您的浏览器中出现周课表横屏打印页面超出，请适当调整代码第383行function printTitle()内的margin-top属性（该属性控制标题离页面顶部的距离），或者，选择竖屏格式打印。如果你有更好的解决方法，欢迎联系我！（联系方式见文档底部）
// @author      wqy
// @license     MIT
// @match       https://ehall.seu.edu.cn/jwapp/sys/wdkb/*default/index.do?*
// @run-at      document-loaded
// @downloadURL https://update.greasyfork.org/scripts/475816/%E4%B8%9C%E5%8D%97%E5%A4%A7%E5%AD%A6%E8%AF%BE%E8%A1%A8%E6%A0%B7%E5%BC%8F%E8%B0%83%E6%95%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/475816/%E4%B8%9C%E5%8D%97%E5%A4%A7%E5%AD%A6%E8%AF%BE%E8%A1%A8%E6%A0%B7%E5%BC%8F%E8%B0%83%E6%95%B4.meta.js
// ==/UserScript==

// 通过立即执行函数在页面载入时运行
(() => {

    'use strict';

    // 状态变量，当状态变量为true时说明页面需要被改写
    let counter = false;

    // 定义一个数组，用来存放每节课的上课时间
    const courseTime = ["08:00-08:45","08:50-09:35","09:50-10:35","10:40-11:25","11:30-12:15","14:00-14:45","14:50-15:35","15:50-16:35","16:40-17:25","17:30-18:15","19:00-19:45","19:50-20:35","20:40-21:25"]

    // 定义一个数组，用于存储星期几
    const days = [];
    // 初始化星期数组
    for (let i = 1; i <= 7; i++) {
        days.push("星期" + i);
    }

    // 从页面获取原课表信息,当该部分长度不为0时说明页面已加载完毕，是"启动监听器"的一部分，在主函数中被用于获取页面课表
    const tables = document.getElementsByClassName("wut_table");

    // "启动监听器"，递归调用，检测页面启动后，调用"变化监听器"，并运行主脚本
    function loadObserver() {
        // 从页面获取所有课程的信息
        if(tables.length===0){
            console.log("课表正在加载...")
            setTimeout(loadObserver, 500);
        }
        else{
            // 是表格的容器，当页面切换时，容器内表格被删除，并添加新的表格
            const activator = document.getElementById("kcb_container")
            // 监测表格内容变化
            observer.observe(activator, { childList: true, subtree: true });
            // 开始脚本运行
            mainScript();
        }
    }

    // "变化监听器"，当表格容器内容变化时运行主脚本
    const observer = new MutationObserver(() => {
        console.log("表格内容已发生变化");
        // 因为脚本本身也会导致表格容器内容变化，所以模拟了D触发器，使脚本间隔启动
        console.log("当前状态为",counter);
        // 当状态为true时启动脚本，并切换状态
        if(counter===true){
            mainScript();
            counter = false;
        }
        // 状态为false时不启动脚本，切换状态
        else{
            counter = true;
        }
    });

    // 主脚本
    function mainScript() {
        console.log("脚本已启动!")
        // 转换页面样式，使打印时表格居中
        printCenter()
        // 检查当前页面是否为学期课表
        const check = checkWeekOrSemester();
        // 从页面获取所有课程的信息
        const courses = getCourses()
        // 将获取的课程信息存入课程表
        const courseTable = setCourseTable(courses)
        // 打印课表详情(用于调试)
        console.log(courseTable);
        // 获取页面上原来的表格(本来这样写可能会出问题，但因为主函数的每次被调用都在页面表格生成后，且速度快于脚本执行速度，所以并没有什么事)
        const table = tables[0];
        table.style.width = "90%";
        // 清空页面原来的课表信息,并修改表头，添加上课时间
        let rows = tableInitialization(table,check)
        // 重新插入课表信息
        tableInsert(rows,courseTable)
        // 修改打印周课表标题
        if(check === false) {
            printTitle();
        }
        if(check === true) {
            // 删除原来插入的课表标题
            deleteTitle();
        }
    }

    // 从页面获取所有课程的信息
    function getCourses() {
        const courses = document.getElementsByClassName("mtt_item_kcmc");
        console.log("已获取",courses.length,"节课")
        return courses;
    }

    // 将获取的课程信息存入课程表
    function setCourseTable(courses) {
        // 创建一个空的json对象，用于存储课程表信息
        let courseTable = {};
        // 初始化课程表信息
        for (let i = 0; i < days.length; i++) {
            courseTable[days[i]] = [];
        }
        for (let i = 0; i < courses.length; i++) {
            console.log("正在读取第",i+1,"节课的详细信息")
            const course = courses[i].childNodes;
            // 临时存储课程详细信息
            let detail = {}
            // 获取课程背景颜色
            const color = courses[i].parentNode.style.backgroundColor
            detail.color = color;
            // 获取课程名称
            detail.name = course[0].data;
            console.log("课程名称：",detail.name)
            // 获取授课老师(可能为空)
            if(course[1].innerText !== ""){
                detail.teacher = course[1].innerText;
                console.log("授课老师：",detail.teacher);
            }
            if(course[1].innerText === ""){
                console.log("未检测到授课老师信息");
            }
            const others = course[3].innerText.split(",");
            const weeks = others[0].split("-");

            // 判断是单一周还是多周
            if (weeks.length === 1) {
                // 单一周
                detail.startWeek = parseInt(weeks[0]);
                detail.endWeek = detail.startWeek;
            } else {
                // 多周
                detail.startWeek = parseInt(weeks[0]);
                detail.endWeek = parseInt(weeks[1].replace(/\(单\)|\(双\)/g, '')); // 去除(单)或(双)
                // 检查是否存在单双周上课情况
                let check = weeks[1].endsWith("(双)") || weeks[1].endsWith("(单)");
                if (check === true) {
                    if (weeks[1].endsWith("(双)") === true) {
                        detail.oddOrEven = "even";
                    } else {
                        detail.oddOrEven = "odd";
                    }
                }
            }
            // 获取上课节次信息
            const time = others[2].split("-");
            detail.startTime = parseInt(time[0]);
            detail.endTime = parseInt(time[1]);
            console.log("上课时间：第",detail.startTime,"节 - 第",detail.endTime,"节")
            // 获取上课地点信息(可能为空)
            if(others[3] !== undefined){
                detail.location = others[3];
                console.log("上课地点：",detail.location)
            }
            if(others[3] === undefined){
                console.log("未检测到上课地点信息")
            }
            // 获取课程群信息(可能为undefined)
            if(others[4] !== undefined){
                // 鉴于偶尔群号会有额外备注，不一定是数字，改用split方法
                // const num = others[4].match(/\d+$/);
                // detail.group = num[0];
                // 把获取的字符串按冒号分开，冒号后的部分就是群号，备注等信息，但考虑到备注中仍有可能含冒号
                const arr = others[4].split("：");
                // 所以先分隔，删除数组第一个元素“教学班群号：”
                arr.shift();
                // 再重新组合数组，换用中文分号，节省空间
                detail.group = arr.join(":");
                console.log("教学班群号：",detail.group)
            }
            if(others[4] === undefined){
                console.log("未检测到课程群信息")
            }
            // 获取上课在星期几，并存入课程表
            const day = others[1];
            courseTable[day].push(detail)
        }
        return courseTable;
    }

    // 清空页面原来的课表信息，如果是周课表，修改表头，添加上课时间
    function tableInitialization(table,check) {
        let rows = table.rows;
        // 清空页面原来的课表信息
        for (let i = 1; i < rows.length; i++) {
            let cells = rows[i].cells;
            if (i % 5 === 1) {
                for (let j = 2; j < cells.length; j++) {
                    rows[i].deleteCell(j);
                    j--;
                }
            }
            else {
                for (let j = 1; j < cells.length; j++) {
                    rows[i].deleteCell(j);
                    j--;
                }
            }
        }
        console.log("已清空原课表信息")
        if(check === false) addTime(rows);
        return rows;
    }

    // 修改表头，添加上课时间
    function addTime(rows) {
        // 修改表头，添加条目,显示上课的具体时间
        rows[0].cells[0].colSpan = 3;
        // 修改表头，改变间距
        for (let i = 1; i < rows[0].cells.length; i++) {
            let cell = rows[0].cells[i];
            cell.style.width = "12%";
        }
        // 逐行添加上课的具体时间，并调整样式，使其符合整体风格
        for (let i = 1; i < rows.length; i++) {
            let cell = document.createElement("td");
            cell.innerHTML = courseTime[i-1];
            cell.classList.add("mtt_bgcolor_grey");
            // 规定宽度，防止打印变形
            cell.style.width = "10%";
            rows[i].appendChild(cell);
        }
        console.log("已修改表头，添加条目,显示上课的具体时间")
    }

    // 逐行插入表格
    function tableInsert(rows,courseTable) {
        for (let k = 1; k <= 13; k++){
            let rowIndex = k;
            let row = rows[rowIndex];
            coursesInsert(courseTable,rowIndex,row)
        }
    }

    // 插入每一行的课程
    function coursesInsert(courseTable,rowIndex,row) {
        // 挨个处理这一行每一天的课程
        for (let i = 0; i < days.length; i++) {
            const day = days[i];
            const cell = cellInsert(courseTable,rowIndex,day)
            if(cell !== null) row.appendChild(cell);
        }
    }

    // 插入每一节课程
    function cellInsert(courseTable,rowIndex,day) {
        // 获取课程表该日所有课程
            let courses = courseTable[day];
            // 遍历该日每节课
            for (let j = 0; j < courses.length; j++) {
                let course = courses[j];
                // 若课程在该节开始，插入课程，返回插入单元格
                if (course.startTime == rowIndex) {
                    // 新建一个单元格并初始化单元格
                    let cell = document.createElement("td");
                    cell.rowSpan = course.endTime - course.startTime + 1;
                    cell.classList.add("mtt_arrange_item")
                    // 插入一个莫名其妙的空div(为了与原页面结构保持一致)
                    let div = document.createElement("div");
                    div.classList.add("mtt_item_tzkcicon")
                    cell.appendChild(div);
                    // 处理cell单元格，添加课程信息
                    cell = courseInsert(cell,course);
                    return cell;
                }
                // 若课程覆盖该节，返回null
                if (course.startTime < rowIndex && course.endTime >= rowIndex) {
                    return null;
                }
            }
            // 若遍历所有课程后仍未返回，说明该节
            if (!status) {
                const cell = document.createElement("td");
                cell.classList.add("mtt_arrange_item")
                return cell;
            }
    }

    // 插入指定课程
    function courseInsert(cell,course) {
        // 新建一个空div并初始化(为原页面格式)，用于存储课程名称(老师)和其他信息(包括周数，地点，课程群)
        let basic = document.createElement("div");
        basic.classList.add("mtt_item_kcmc");
        // 设置背景颜色
        basic.style.backgroundColor = course.color;
        // 设置格内间距
        basic.style.padding = "4px";
        // 设置边框弧度
        basic.style.borderRadius = "8px";
        // 设置高度为父元素的100%
        basic.style.height = "100%";
        // 设置为flex布局(因为只会flex布局)
        basic.style.display = "flex";
        // 设置为flex布局下的按列排列
        basic.style.flexDirection = "column";
        // 设置垂直居中
        basic.style.justifyContent = "center"
        // 新建准备添加的字符串，默认添加课程名称
        let str = course.name
        // 添加老师信息(如果有的话)
        if(course.teacher !== undefined){
            let teacher = '<br/>' + course.teacher;
            str += teacher;
        }
        basic.innerHTML = str;
        // 处理basic块，添加其他信息
        basic = othersInsert(basic,course)
        // 将处理后的basic块插入表格单元格
        cell.appendChild(basic);
        return cell;
    }

    // 插入指定课程的其他信息
    function othersInsert(basic,course) {
        // 新建一个空div并初始化(为原页面格式)，用于存储其他信息(包括周数，地点，课程群)
        let others = document.createElement("div");
        others.classList.add("mtt_item_room");
        // 新建准备添加的字符串，默认为空
        let str = [];
        // 检查当前状态(学期课表/周课表)
        const check = checkWeekOrSemester()
        // 添加周数信息(如果当前展示的是学期课表)
        if(course.startWeek !== false && course.endWeek !== false && check === true){
            if(course.oddOrEven !== undefined) {
                if(course.oddOrEven ==="odd") str.push(course.startWeek + "-" + course.endWeek + "周(单)");
                if(course.oddOrEven ==="even") str.push(course.startWeek + "-" + course.endWeek + "周(双)");
            }
            else str.push(course.startWeek + "-" + course.endWeek + "周");
        }
        // 添加地点信息(如果有的话)
        if(course.location !== undefined){
            str.push(course.location);
        }
        // 添加课程群信息(如果有的话)
        if(course.group !== undefined && check === true){
            str.push("教学班班号:" + course.group)
        }
        others.innerText = str.join(",");
        basic.appendChild(others);
        return basic;
    }

    // 检查当前展示的是否为学期课表
    function checkWeekOrSemester() {
        const check = document.getElementsByClassName("bh-color-primary");
        // check[2]为显示学期课表按钮，若显示学期课表按钮不显示，则返回true
        if(check[2].style.display === "none") return true;
        // check[3]为显示周课表按钮，若显示周课表按钮不展示，则返回false
        if(check[3].style.display === "none") return false;
        // 否则说明出问题了
        else console.log(check);
    }

    // 转换页面样式，使打印时表格居中
    function printCenter() {
        const containers = document.getElementsByClassName("wut_container");
        const container = containers[0];
        container.style.display = "flex";
        container.style.alignItems = "center";
        container.style.justifyContent = "center";
        container.style.width = "100%";
        const printArea = document.getElementById("print_area");
        printArea.style.display = "flex";
        printArea.style.alignItems = "center";
        printArea.style.justifyContent = "center";
        printArea.style.flexDirection = "column";
    }

    // 修改打印周课表标题
    function printTitle() {
        // 隐藏原打印标题
        const kb_title = document.getElementById("kb_title");
        kb_title.style.display = "none";
        // 获取title
        const title = document.getElementById("dqxnxq2");
        // 获取周数
        const week = document.getElementById("zkbzc");
        // 编辑新的课表标题
        const newTitle = '<div id="new-title" style="text-align: center;font-size: 20px; margin-top: 15px; margin-bottom: 4px" >' + title.innerText + " 第" + week.innerText + "周</div>";
        // 删除原来插入的课表标题
        deleteTitle();
        // 把新课表标题插入到原标题前
        kb_title.insertAdjacentHTML('beforebegin', newTitle)
        console.log("已添加标题")
    }

    // 删除原来插入的课表标题
    function deleteTitle() {
        const title = document.getElementById("new-title");
        if(title !== null) title.parentNode.removeChild(title);
    }

    // 启动监听器
    loadObserver();
})()