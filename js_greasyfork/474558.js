// ==UserScript==
// @name 浙江工商大学抢课脚本
// @namespace http://tampermonkey.net/
// @version 1.04
// @description 用于浙江工商大学抢课
// @author WangShuaiGe
// @match http://jwxt.zjgsu.edu.cn/jwglxt/*gnmkdm=N253512*
// @match https://jwxt.zjgsu.edu.cn/jwglxt/*gnmkdm=N253512*
// @match http://*/jwglxt/*gnmkdm=N253512*
// @match https://*/jwglxt/*gnmkdm=N253512*
// @match https://uia.zjgsu.edu.cn/cas/login*
// @match https://my.zjgsu.edu.cn/personal-center*

// @icon https://g.csdnimg.cn/static/logo/favicon32.ico
// @grant none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/474558/%E6%B5%99%E6%B1%9F%E5%B7%A5%E5%95%86%E5%A4%A7%E5%AD%A6%E6%8A%A2%E8%AF%BE%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/474558/%E6%B5%99%E6%B1%9F%E5%B7%A5%E5%95%86%E5%A4%A7%E5%AD%A6%E6%8A%A2%E8%AF%BE%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==


(function () {

    if (window.location.href.includes('jwglxt') && window.location.href.includes('gnmkdm=N253512')) {


        
        let dataobjarr = [];
        //设置强制刷新网页的间隔 现在是 40s/每个选课
        const reloadinterval = 40 * 1000

        
        let draggableBox;


        
        function TextAlert(content) {
            if (draggableBox.querySelector('.isok').classList.contains('graberror')) {
                draggableBox.querySelector('.isok').classList.remove('graberror')
            }
            if (draggableBox.querySelector('.isok').classList.contains('grabsuccess')) {
                draggableBox.querySelector('.isok').classList.remove('grabsuccess')
            }
            draggableBox.querySelector('.isok').textContent = content;

            draggableBox.querySelector('.isok').style.visibility = 'visible';
        }

        function TextError(content) {
            draggableBox.querySelector('.isok').textContent = content + "\n本脚本将在30秒后自动刷新网页...";
            draggableBox.querySelector('.isok').style.visibility = 'visible';
            draggableBox.querySelector('.isok').classList.add('graberror');
            const highestTimeoutId = setTimeout(() => { });
            for (let i = 0; i <= highestTimeoutId; i++) {
                clearTimeout(i);
            }
            setTimeout(() => {
                location.reload();
            }, 30000);
        }

        function TextSuccess(content) {
            draggableBox.querySelector('.isok').textContent = content;
            draggableBox.querySelector('.isok').style.visibility = 'visible';
            draggableBox.querySelector('.isok').classList.add('grabsuccess');
        }


        //添加相关图形化界面的代码
        (function () {
            //使页面上内容可选，方便复制


            const style = document.createElement('style');
            style.textContent =
                `
        .grabclasscontainer {
            width: 350px;
            text-align: center;
            position: fixed;
            right: 0px;
            bottom: 0px;
            height: 391px;
            border: 2px #333 solid;
            background-color: #d5e8fc;
            z-index: 999;
        }

        .grabclasscontainer .form-group {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 10px;
        }

        .grabclasscontainer label {
            flex: 1;
            text-align: right;
            margin-right: 10px;
        }

        .grabclasscontainer input {
            flex: 2;
            padding: 10px;
            width: 100%;
        }

        .grabclasscontainer .submit {
            background-color: #007bff;
            color: #fff;
            padding: 10px 20px;
            border: none;
            cursor: pointer;
            margin-bottom: 10px;
        }

        .grabclasscontainer .clear {
            background-color: #79240c;
            color: #fff;
            padding: 10px 20px;
            border: none;
            cursor: pointer;
            margin-bottom: 6px;
        }
        .grabclasscontainer .stop {
            background-color: #79240c;
            color: #fff;
            padding: 10px 20px;
            border: none;
            cursor: pointer;
            margin-bottom: 6px;
        }



        .grabclasscontainer .dragBar {
            height: 30px;
            line-height: 30px;
            background-color: #505860;
            cursor: move;
            margin-bottom: 9px;
        }

        .grabclasscontainer .isok {
            visibility: hidden;
            margin-bottom: 20px;
        }

        .grabclasscontainer .content {
            overflow-y: auto;
            height: 348px;
            padding: 5px
        }

        .grabclasscontainer .copyright {
            text-align: left;
        }

        .grabclasscontainer .graberror {
            color: #e91a0b;
        }

        .grabclasscontainer .grabsuccess {
            color: #0be94e;
        }

        .grabclasscontainer .add-course {
            background-color: #28a745;
            color: #fff;
            padding: 10px 20px;
            border: none;
            cursor: pointer;
            margin-bottom: 10px;
        }

        .grabclasscontainer .remove-course {
            background-color: #dc3545;
            color: #fff;
            padding: 5px 10px;
            border: none;
            cursor: pointer;
            margin-left: 5px;
        }

        .grabclasscontainer .course-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 5px;
        }

        .grabclasscontainer .form-group.hidden {
            display: none;
        }
        `
            document.head.appendChild(style);


            const grabclasscontainer = document.createElement('div');
            grabclasscontainer.className = 'grabclasscontainer';
            grabclasscontainer.id = 'grabclasscontainer';
            grabclasscontainer.innerHTML = `
        <div class="dragBar" id="dragBar">
            我是萌萌哒拖动框O(∩_∩)O
        </div>
        <div class="content">
            <form id="DataForm">
                <div class="form-group">
                    <label for="teacher">老师:</label>
                    <input type="text" id="teacher" name="teacher" placeholder="石敏敏" required autocomplete="off">
                </div>
                <div class="form-group">
                    <label for="time">时间:</label>
                    <input type="text" id="time" name="time" placeholder="星期三第3-5节{1-2周,4-15周}" required
                        autocomplete="off">
                </div>
                <div class="form-group">
                    <label for="category1">一级目录(课程大类):</label>
                    <input type="text" id="category1" name="category1" placeholder="公共课程" required autocomplete="off">
                </div>
                <div class="form-group">
                    <label for="category2">二级目录(课程名或课程代号):</label>
                    <input type="text" id="category2" name="category2" placeholder="马克思主义基本原理或IPT012" required
                        autocomplete="off">
                </div>
                <div class="form-group">
                    <label for="replaceCourse">是否替换原有的课程:</label>
                    <input type="checkbox" id="replaceCourse" name="replaceCourse">
                </div>
                <div class="form-group hidden" id="replaceCourseTimeGroup">
                    <label for="replaceCourseTime">要替换的课程时间:</label>
                    <input type="text" id="replaceCourseTime" name="replaceCourseTime" placeholder="星期五第3-5节{1-16周}" autocomplete="off">
                </div>
                <button type="button" class="add-course">添加课程</button>
            </form>
            <button class="clear">清空</button>
            <button class="stop">暂停</button>
            <div class="isok">提交成功，正在抢课</div>
            <div id="courseList"></div>
            <div class="copyright">
                【警告】<br>
                在选课高峰期，替换课程可能存在退课后仍无法选上新课程的风险。<br>
                请在点击“暂停”按钮后，再进行数据的修改和提交。<br><br>
                【基本使用方式】<br>
                <strong>老师</strong>：粘贴课程教师姓名，例如“石敏敏”。<br>
                <strong>时间</strong>：粘贴课程时间，例如“星期三第3-5节{1-2周,4-15周}”。如果课程时间有多行，只需粘贴其中任意一行即可。<br>
                <strong>一级目录</strong>：粘贴课程大类，例如“公共课程”。<br>
                <strong>二级目录</strong>：粘贴课程名称或课程代码，例如“马克思主义基本原理”或“IPT012”。<br>
                <strong>是否替换原有课程</strong>：勾选此选项后，会弹出<strong>要替换的课程时间</strong>输入框。<br>
                在<strong>要替换的课程时间</strong>中输入已选课程的时间，例如“星期五第3-5节{1-16周}”。脚本会在检测到新课程有空位后，先退选原课程，再选上新课程。如果课程时间有多行，只需粘贴其中任意一行即可。<br>
                <strong>清空</strong>：点击此按钮将清空所有待选课程并停止脚本的选课操作。<br>
                <strong>暂停</strong>：点击此按钮仅停止脚本的选课操作。<br><br>
                【进阶技巧】<br>如需设置脚本自动登录，请访问 <a href="https://my.zjgsu.edu.cn/logout">登录页面</a>  进行登录失效时的设置。<br><br>
                【联系作者】<br>如有疑问，请联系作者QQ：1023097618。<br><br>
                【分享】<br>如果本脚本帮助到了您，请分享给您身边的同学。脚本下载链接(需要开梯子)：<a href="https://greasyfork.org/zh-CN/scripts/474558-%E6%B5%99%E6%B1%9F%E5%B7%A5%E5%95%86%E5%A4%A7%E5%AD%A6%E6%8A%A2%E8%AF%BE%E8%84%9A%E6%9C%AC">脚本下载</a>
            </div>
        </div>
        `
            document.body.appendChild(grabclasscontainer);


            draggableBox = document.getElementById("grabclasscontainer");
            const dragBar = draggableBox.querySelector(".dragBar");
            let isDragging = false;
            let offsetX, offsetY;

            dragBar.addEventListener("mousedown", (e) => {
                isDragging = true;
                offsetX = e.clientX - draggableBox.getBoundingClientRect().left;
                offsetY = e.clientY - draggableBox.getBoundingClientRect().top;
                draggableBox.style.transition = "none";
            });

            document.addEventListener("mousemove", (e) => {
                if (!isDragging) return;
                let x = e.clientX - offsetX;
                let y = e.clientY - offsetY;
                draggableBox.style.left = x + "px";
                draggableBox.style.top = y + "px";
            });

            document.addEventListener("mouseup", () => {
                isDragging = false;
                draggableBox.style.transition = "all 0.3s ease"; // 添加平滑的过渡效果
            });
            grabclasscontainer.addEventListener('click', function(event) {
                event.stopPropagation();
            });

            // Add event listeners for adding and removing courses
            const courseList = document.getElementById('courseList');
            const addCourseButton = document.querySelector('.add-course');

            addCourseButton.addEventListener('click', () => {
                const teacher = document.querySelector('#teacher').value.trim();
                const time = document.querySelector('#time').value.trim();
                const category1 = document.querySelector('#category1').value.trim();
                const category2 = document.querySelector('#category2').value.trim();
                const replaceCourse = document.querySelector('#replaceCourse').checked;
                const replaceCourseTime = document.querySelector('#replaceCourseTime').value.trim();
                if (replaceCourse === true && !replaceCourseTime.trim()) {
                    TextAlert("请填写替换课程时间！");
                    return;
                }
                if (teacher && time && category1 && category2) {
                    const course = {
                        targetTeacher: teacher,
                        targetTime: time,
                        firstmenu: category1,
                        secondmenu: category2,
                        replaceCourse: replaceCourse,
                        replaceCourseTime: replaceCourseTime
                    };

                    dataobjarr.push(course);

                    renderCourseList();
                    TextAlert("课程已添加，刷新页面后脚本会开始抢课，当前要选课程总数：" + dataobjarr.length + "个")

                    // Clear all input fields
                    document.getElementById('DataForm').reset();
                    // Hide the replace course input field if it was shown
                    document.getElementById('replaceCourseTimeGroup').classList.add('hidden');
                } else {
                    TextAlert('请填写所有字段');
                }
            });

            document.getElementById('replaceCourse').addEventListener('change', function () {
                const replaceCourseTimeGroup = document.getElementById('replaceCourseTimeGroup');
                const replaceCourseTimeInput = document.getElementById('replaceCourseTime');
                if (this.checked) {
                    replaceCourseTimeGroup.classList.remove('hidden');
                } else {
                    replaceCourseTimeGroup.classList.add('hidden');
                    replaceCourseTimeInput.value = '';
                }
            });

            function renderCourseList() {
                localStorage.setItem('courses', JSON.stringify(dataobjarr))
                courseList.innerHTML = '';
                dataobjarr.forEach((course, index) => {
                    const courseItem = document.createElement('div');
                    courseItem.className = 'course-item';
                    courseItem.innerHTML = `
                    <span>${course.targetTeacher} - ${course.targetTime} - ${course.firstmenu} - ${course.secondmenu} - 替换: ${course.replaceCourse ? '是' : '否'} ${course.replaceCourse ? '- ' + course.replaceCourseTime : ''}</span>
                    <button class="remove-course" data-index="${index}">移除</button>
                `;
                    courseList.appendChild(courseItem);
                });

                document.querySelectorAll('.remove-course').forEach(button => {
                    button.addEventListener('click', (event) => {
                        const index = event.target.getAttribute('data-index');
                        dataobjarr.splice(index, 1);
                        renderCourseList();
                    });
                });
            }

            // Initialize the course list from localStorage if available
            function initializeCourses() {
                const coursesData = localStorage.getItem('courses');
                const storedCourses = coursesData ? JSON.parse(coursesData) : [];
                if (storedCourses) {
                    dataobjarr = storedCourses;
                    renderCourseList();
                }
                reloadtime = reloadinterval * dataobjarr.length
                if (reloadtime !== 0) {
                    setTimeout(() => {
                        location.reload();
                    }, reloadtime);
                }
            }

            initializeCourses();

            draggableBox.querySelector('.clear').addEventListener('click', () => {
                dataobjarr = [];
                renderCourseList();
                const highestTimeoutId = setTimeout(() => { });
                for (let i = 0; i <= highestTimeoutId; i++) {
                    clearTimeout(i);
                }
                TextAlert('停止抢课');
            });

            draggableBox.querySelector('.stop').addEventListener('click', () => {
                const highestTimeoutId = setTimeout(() => { });
                for (let i = 0; i <= highestTimeoutId; i++) {
                    clearTimeout(i);
                }
                TextAlert('暂停抢课，刷新页面后继续');
            });
        })();
        //选课相关代码
        (function () {
            let nowdataobj;
            let nowi = 0;
            function cancelselect() {
                const closeItems = document.querySelectorAll('.col-sm-9.col-md-9 .col-sm-12.col-md-2 a .close-icon')
                closeItems.forEach(li => {
                    if (li) {
                        li.click();
                    }
                });
                TextAlert(`一级菜单   ${nowdataobj.firstmenu}`);
                setTimeout(getfirstmenu, 2000);
            }
            function getfirstmenu() {
                let issuccess = false;
                const liElements = document.querySelectorAll('.nav-tabs li')
                liElements.forEach(li => {
                    const aElement = li.querySelector('a');
                    if (aElement && aElement.textContent.includes(nowdataobj.firstmenu)) {
                        issuccess = true;
                        if (!li.classList.contains('active')) {
                            aElement.click();
                        }
                        TextAlert(`查询按钮`);
                        setTimeout(clickquerrybtn, 2000);
                    }
                    return
                });
                if (issuccess === false) {
                    TextError(`错误：找不到一级目录  ${nowdataobj.firstmenu}  ，请核对填写的是否正确`);
                }
            }

            function clickquerrybtn() {
                const querrybtn = document.querySelector('button[name="query"]');
                if (querrybtn) {
                    querrybtn.click();
                    TextAlert(`输入内容`);
                    setTimeout(getsearch, 2000);
                }
            }

            function getsearch() {
                var inputElement = document.querySelector('input[name="searchInput"]');
                inputElement.value = nowdataobj.secondmenu;
                TextAlert(`按下搜索确定按钮`);
                setTimeout(getsearchsure, 2000);
            }
            function getsearchsure() {
                const surebtn = document.querySelector('button[name="query"]');
                surebtn.click();
                TextAlert(`二级目录    ${nowdataobj.secondmenu}`);
                setTimeout(getsecondmenu, 2000);
            }
            function getmore() {
                const more = document.querySelector('#more');
                if (more.style.display !== 'none') {
                    more.querySelector('a').click();
                    setTimeout(getmore, 2000);
                } else {
                    TextAlert(`二级目录    ${nowdataobj.secondmenu}`);
                    setTimeout(getsecondmenu, 2000);
                }
            }

            function getsecondmenu() {
                let issuccess = false;
                const tjxk = document.querySelector('.tjxk_list');
                if (tjxk !== null) {
                    const liElements = tjxk.querySelectorAll('.panel.panel-info');
                    liElements.forEach(li => {
                        const clickbox = li.querySelector('.panel-heading.kc_head');
                        const secondmenuname = clickbox.querySelector('.kcmc').textContent;
                        if (clickbox && secondmenuname && secondmenuname.includes(nowdataobj.secondmenu)) {
                            issuccess = true;
                            if (clickbox.querySelector('.expand_close').classList.contains('expand1')) {
                                clickbox.click();
                            }
                            TextAlert(`老师${nowdataobj.targetTeacher}   时间${nowdataobj.targetTime}`);
                            setTimeout(findtarget, 2000);
                        }
                    }
                    )
                }
                if (issuccess === false) {
                    TextError(`错误：找不到二级目录  ${nowdataobj.secondmenu}  ，请核对二级目录填写的是否正确\n这也有可能是当前网络卡顿引起`);
                }
            }
            function findtarget() {
                let issuccess = false;
                const rows = document.querySelectorAll('.body_tr');
                rows.forEach(row => {
                    const teacherCell = row.querySelector('.jsxmzc').textContent;
                    const timeCell = row.querySelector('.sksj').textContent;
                    const rsxxCell = row.querySelector('.rsxx').textContent;
                    const [current, total] = rsxxCell.split('/').map(Number);
                    if (teacherCell.includes(nowdataobj.targetTeacher) && timeCell.includes(nowdataobj.targetTime)) {
                        const button = row.querySelector('.btn');
                        issuccess = true;
                        if (button.textContent === '退选') {
                            TextSuccess(`课程 ${nowdataobj.secondmenu} 已成功选上`);
                            dataobjarr.splice(nowi, 1);
                            nowi--;
                            localStorage.setItem('courses', JSON.stringify(dataobjarr));
                            setTimeout(reloadpage, 2000);
                            return;
                        }
                        if (nowdataobj.replaceCourse) {
                            if (!(rsxxCell.includes('已满') || current >= total)) {
                                // If replacement is needed and the course is full
                                const choosedBox = document.querySelector("#choosedBox > div > div.outer_left");
                                if (choosedBox) {
                                    choosedBox.click();
                                    setTimeout(() => {
                                        replaceExistingCourse(button);
                                    }, 2000);
                                }
                            } else {
                                if (button) {
                                    if (button.textContent === '选课') {
                                        button.click();
                                        setTimeout(clicksurebtn, 2000);
                                    }
                                }
                            }
                        } else {
                            if (button) {
                                if (button.textContent === '选课') {
                                    button.click();
                                    setTimeout(clicksurebtn, 2000);
                                }
                            }
                        }
                        return
                    }
                });
                if (issuccess === false) {
                    TextError(`错误：找不到课程，请检查老师  ${nowdataobj.targetTeacher}  和时间  ${nowdataobj.targetTime}  填写的是否正确`);
                }
            }

            // Function to replace an existing course
            function replaceExistingCourse(surebtn) {
                const replaceTime = nowdataobj.replaceCourseTime;
                const rightDivs = document.querySelectorAll('.right_div .outer_xkxx_list');
                let found = false;

                rightDivs.forEach(div => {
                    const timeCell = div.querySelector('p.time').textContent;
                    if (timeCell.includes(replaceTime)) {
                        if (found) {
                            return
                        }
                        const withdrawButton = div.querySelector('.btn-danger');
                        if (withdrawButton) {
                            withdrawButton.click();
                            const okbtn = document.querySelector("#btn_confirm")
                            okbtn.click()
                            dataobjarr[nowi].replaceCourse = false
                            localStorage.setItem('courses', JSON.stringify(dataobjarr))
                            setTimeout(() => {
                                const choosedBox = document.querySelector("#choosedBox > div > div.outer_left");
                                if (choosedBox) {
                                    choosedBox.click();
                                    setTimeout(() => {
                                        surebtn.click()
                                        setTimeout(clicksurebtn, 2000);
                                    }, 2000);
                                }
                            }, 2000);
                            found = true;
                        }
                    }
                });

                if (!found) {
                    TextError(`错误：找不到要替换的课程时间 ${replaceTime}`);
                }
            }

            function clicksurebtn() {
                const confirmButton = document.getElementById('btn_ok');
                if (confirmButton) {
                    confirmButton.click();
                }
                setTimeout(reloadpage, 2000);
            }

            function reloadpage() {
                nowi++;
                if (nowi >= dataobjarr.length) {
                    location.reload();
                } else {
                    start();
                }
            }

            function start() {
                if (dataobjarr && dataobjarr[nowi] && dataobjarr[nowi].targetTeacher && dataobjarr[nowi].targetTime && dataobjarr[nowi].firstmenu && dataobjarr[nowi].secondmenu) {
                    nowdataobj = dataobjarr[nowi];
                    if (nowi > 0) {
                        TextAlert(`一级菜单   ${nowdataobj.firstmenu}`);
                        setTimeout(getfirstmenu, 2000);
                    } else {
                        TextAlert(`撤销选择标签`);
                        setTimeout(cancelselect, 2000)
                    }
                } else {
                    if (nowi === 0) {
                        TextAlert('请按照提示输入相关内容');
                    } else {
                        location.reload();
                    }
                }
            }

            start();
        })();
    }
    else if (window.location.href.includes('uia.zjgsu.edu.cn/cas/login')) {
        // Login page functionality
        const style = document.createElement('style');

        style.textContent = `
        .grabclasscontainer {
            width: 350px;
            text-align: center;
            position: fixed;
            right: 0px;
            bottom: 0px;
            height: 391px;
            border: 2px #333 solid;
            background-color: #d5e8fc;
            z-index: 999;
        }

        .grabclasscontainer .form-group {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 10px;
        }

        .grabclasscontainer label {
            flex: 1;
            text-align: right;
            margin-right: 10px;
        }

        .grabclasscontainer input {
            flex: 2;
            padding: 10px;
            width: 100%;
        }

        .grabclasscontainer .submit {
            background-color: #007bff;
            color: #fff;
            padding: 10px 20px;
            border: none;
            cursor: pointer;
            margin-bottom: 10px;
        }

        .grabclasscontainer .clear {
            background-color: #79240c;
            color: #fff;
            padding: 10px 20px;
            border: none;
            cursor: pointer;
            margin-bottom: 6px;
        }
        .grabclasscontainer .stop {
            background-color: #79240c;
            color: #fff;
            padding: 10px 20px;
            border: none;
            cursor: pointer;
            margin-bottom: 6px;
        }



        .grabclasscontainer .dragBar {
            height: 30px;
            line-height: 30px;
            background-color: #505860;
            cursor: move;
            margin-bottom: 9px;
        }

        .grabclasscontainer .isok {
            visibility: hidden;
            margin-bottom: 20px;
        }

        .grabclasscontainer .content {
            overflow-y: auto;
            height: 348px;
        }

        .grabclasscontainer .copyright {
            text-align: left;
        }

        .grabclasscontainer .graberror {
            color: #e91a0b;
        }

        .grabclasscontainer .grabsuccess {
            color: #0be94e;
        }

        .grabclasscontainer .remove-course {
            background-color: #dc3545;
            color: #fff;
            padding: 5px 10px;
            border: none;
            cursor: pointer;
            margin-left: 5px;
        }

        .grabclasscontainer .course-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 5px;
        }

        .grabclasscontainer .form-group.hidden {
            display: none;
        }

        .grabclasscontainer .button {
            background-color: #007bff;
                color: #fff;
                padding: 5px 10px;
                border: none;
                cursor: pointer;
                margin-top: 10px;
        }

        .login-container label {
            flex: 1;
            text-align: right;
            margin-right: 10px;
        }
        `;
        document.head.appendChild(style);

        //公共函数
        function TextAlert(content) {
            if (draggableBox.querySelector('.isok').classList.contains('graberror')) {
                draggableBox.querySelector('.isok').classList.remove('graberror')
            }
            if (draggableBox.querySelector('.isok').classList.contains('grabsuccess')) {
                draggableBox.querySelector('.isok').classList.remove('grabsuccess')
            }
            draggableBox.querySelector('.isok').textContent = content;

            draggableBox.querySelector('.isok').style.visibility = 'visible';
        }

        function TextError(content) {
            draggableBox.querySelector('.isok').textContent = content + "\n本脚本将在30秒后自动刷新网页...";
            draggableBox.querySelector('.isok').style.visibility = 'visible';
            draggableBox.querySelector('.isok').classList.add('graberror');
            const highestTimeoutId = setTimeout(() => { });
            for (let i = 0; i <= highestTimeoutId; i++) {
                clearTimeout(i);
            }
            setTimeout(() => {
                location.reload();
            }, 30000);
        }

        function TextSuccess(content) {
            draggableBox.querySelector('.isok').textContent = content;
            draggableBox.querySelector('.isok').style.visibility = 'visible';
            draggableBox.querySelector('.isok').classList.add('grabsuccess');
        }

        const grabclasscontainer = document.createElement('div');
        grabclasscontainer.className = 'grabclasscontainer';
        grabclasscontainer.id = 'grabclasscontainer';
        grabclasscontainer.innerHTML =
            `
            <div class="dragBar" id="dragBar">
                我是萌萌哒拖动框O(∩_∩)O
            </div>
            <div class="content">
                <div class="form-group">
                    <label for="username">账号:</label>
                    <input type="text" id="usernameInput" name="username" placeholder="请输入账号" autocomplete="off">
                </div>
                <div class="form-group">
                    <label for="password">密码:</label>
                    <input type="password" id="passwordInput" name="password" placeholder="请输入密码" autocomplete="off">
                </div>
                <button class="button" id="saveButton">保存</button>
                <button class="button" id="clearButton">清空</button>
                <div class="isok">提交成功，正在抢课</div>
                <div class="copyright">
                    在上方输入框中保存账号和密码，以便在登录失效时，脚本能够自动重新登录。<br><br>
                    如果遇到验证码导致无法登录，请尝试关闭浏览器后重新打开，或者切换到其他浏览器进行操作。<br>
                </div>
            </div>
        `;
        document.body.appendChild(grabclasscontainer);


        draggableBox = document.getElementById("grabclasscontainer");
        const dragBar = draggableBox.querySelector(".dragBar");
        let isDragging = false;
        let offsetX, offsetY;

        dragBar.addEventListener("mousedown", (e) => {
            isDragging = true;
            offsetX = e.clientX - draggableBox.getBoundingClientRect().left;
            offsetY = e.clientY - draggableBox.getBoundingClientRect().top;
            draggableBox.style.transition = "none";
        });

        document.addEventListener("mousemove", (e) => {
            if (!isDragging) return;
            let x = e.clientX - offsetX;
            let y = e.clientY - offsetY;
            draggableBox.style.left = x + "px";
            draggableBox.style.top = y + "px";
        });

        document.addEventListener("mouseup", () => {
            isDragging = false;
            draggableBox.style.transition = "all 0.3s ease"; // 添加平滑的过渡效果
        });

        // Check for error message
        const errorMsg = document.querySelector("#errormsg");
        const errorSpan = errorMsg ? errorMsg.querySelector("#msg") : null;

        // Load saved credentials from localStorage if no error message is present
        if (!errorSpan) {
            // Load saved credentials from localStorage
            const savedUsername = localStorage.getItem('savedUsername');
            const savedPassword = localStorage.getItem('savedPassword');
            if (savedUsername && savedPassword) {
                setTimeout(() => {
                    TextAlert("填写用户名");
                    document.querySelector("#username").value = savedUsername;
                    setTimeout(() => {
                        TextAlert("填写密码");
                        document.querySelector("#ppassword").value = savedPassword;
                        setTimeout(() => {
                            TextAlert("登录");
                            document.querySelector("#dl").click();
                        });
                    }, 2000);
                }, 2000);
            }
        } else {
            TextError("遇到错误了")
        }



        // Save credentials to localStorage
        document.getElementById('saveButton').addEventListener('click', () => {
            const username = document.getElementById('usernameInput').value;
            const password = document.getElementById('passwordInput').value;
            if (username && password) {
                localStorage.setItem('savedUsername', username);
                localStorage.setItem('savedPassword', password);
                TextAlert('账号密码已保存');
                location.reload();
            } else {
                TextAlert('请输入账号和密码');
            }
        });

        // Clear credentials from localStorage
        document.getElementById('clearButton').addEventListener('click', () => {
            const highestTimeoutId = setTimeout(() => { });
            for (let i = 0; i <= highestTimeoutId; i++) {
                clearTimeout(i);
            }
            localStorage.removeItem('savedUsername');
            localStorage.removeItem('savedPassword');
            TextAlert('已清空保存的账号密码');
        });
    } else if (window.location.href.includes('my.zjgsu.edu.cn/personal-center')) {
        // Login page functionality
        const style = document.createElement('style');

        style.textContent = `
        .grabclasscontainer {
            width: 350px;
            text-align: center;
            position: fixed;
            right: 0px;
            bottom: 0px;
            height: 391px;
            border: 2px #333 solid;
            background-color: #d5e8fc;
            z-index: 999;
        }

        .grabclasscontainer .form-group {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 10px;
        }

        .grabclasscontainer label {
            flex: 1;
            text-align: right;
            margin-right: 10px;
        }

        .grabclasscontainer input {
            flex: 2;
            padding: 10px;
            width: 100%;
        }

        .grabclasscontainer .submit {
            background-color: #007bff;
            color: #fff;
            padding: 10px 20px;
            border: none;
            cursor: pointer;
            margin-bottom: 10px;
        }

        .grabclasscontainer .clear {
            background-color: #79240c;
            color: #fff;
            padding: 10px 20px;
            border: none;
            cursor: pointer;
            margin-bottom: 6px;
        }
        .grabclasscontainer .stop {
            background-color: #79240c;
            color: #fff;
            padding: 10px 20px;
            border: none;
            cursor: pointer;
            margin-bottom: 6px;
        }



        .grabclasscontainer .dragBar {
            height: 30px;
            line-height: 30px;
            background-color: #505860;
            cursor: move;
            margin-bottom: 9px;
        }

        .grabclasscontainer .isok {
            visibility: hidden;
            margin-bottom: 20px;
        }

        .grabclasscontainer .content {
            overflow-y: auto;
            height: 348px;
        }

        .grabclasscontainer .copyright {
            text-align: left;
        }

        .grabclasscontainer .graberror {
            color: #e91a0b;
        }

        .grabclasscontainer .grabsuccess {
            color: #0be94e;
        }

        .grabclasscontainer .remove-course {
            background-color: #dc3545;
            color: #fff;
            padding: 5px 10px;
            border: none;
            cursor: pointer;
            margin-left: 5px;
        }

        .grabclasscontainer .course-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 5px;
        }

        .grabclasscontainer .form-group.hidden {
            display: none;
        }

        .grabclasscontainer .button {
            background-color: #007bff;
                color: #fff;
                padding: 5px 10px;
                border: none;
                cursor: pointer;
                margin-top: 10px;
        }

        .login-container label {
            flex: 1;
            text-align: right;
            margin-right: 10px;
        }
        `;
        document.head.appendChild(style);

        //公共函数
        function TextAlert(content) {
            if (draggableBox.querySelector('.isok').classList.contains('graberror')) {
                draggableBox.querySelector('.isok').classList.remove('graberror')
            }
            if (draggableBox.querySelector('.isok').classList.contains('grabsuccess')) {
                draggableBox.querySelector('.isok').classList.remove('grabsuccess')
            }
            draggableBox.querySelector('.isok').textContent = content;

            draggableBox.querySelector('.isok').style.visibility = 'visible';
        }

        function TextError(content) {
            draggableBox.querySelector('.isok').textContent = content + "\n本脚本将在30秒后自动刷新网页...";
            draggableBox.querySelector('.isok').style.visibility = 'visible';
            draggableBox.querySelector('.isok').classList.add('graberror');
            const highestTimeoutId = setTimeout(() => { });
            for (let i = 0; i <= highestTimeoutId; i++) {
                clearTimeout(i);
            }
            setTimeout(() => {
                location.reload();
            }, 30000);
        }

        function TextSuccess(content) {
            draggableBox.querySelector('.isok').textContent = content;
            draggableBox.querySelector('.isok').style.visibility = 'visible';
            draggableBox.querySelector('.isok').classList.add('grabsuccess');
        }

        const grabclasscontainer = document.createElement('div');
        grabclasscontainer.className = 'grabclasscontainer';
        grabclasscontainer.id = 'grabclasscontainer';
        grabclasscontainer.innerHTML =
            `
            <div class="dragBar" id="dragBar">
                我是萌萌哒拖动框O(∩_∩)O
            </div>
            <div class="content">
                <div class="form-group">
                    <label for="replaceCourse">是否自动跳转:</label>
                    <input type="checkbox" id="replaceCourse" name="replaceCourse">
                    </div>
                <button class="button" id="clearButton">清空</button>
                <div class="isok">提交成功，正在抢课</div>
                <div class="copyright">
                上方的复选框可用于设置是否在当前页面时自动跳转到选课界面。
                </div>
            </div>
        `;
        document.body.appendChild(grabclasscontainer);


        draggableBox = document.getElementById("grabclasscontainer");
        const dragBar = draggableBox.querySelector(".dragBar");
        let isDragging = false;
        let offsetX, offsetY;

        dragBar.addEventListener("mousedown", (e) => {
            isDragging = true;
            offsetX = e.clientX - draggableBox.getBoundingClientRect().left;
            offsetY = e.clientY - draggableBox.getBoundingClientRect().top;
            draggableBox.style.transition = "none";
        });

        document.addEventListener("mousemove", (e) => {
            if (!isDragging) return;
            let x = e.clientX - offsetX;
            let y = e.clientY - offsetY;
            draggableBox.style.left = x + "px";
            draggableBox.style.top = y + "px";
        });

        document.addEventListener("mouseup", () => {
            isDragging = false;
            draggableBox.style.transition = "all 0.3s ease"; // 添加平滑的过渡效果
        });

        draggableBox.querySelector('#clearButton').addEventListener('click', () => {
            const highestTimeoutId = setTimeout(() => { });
            for (let i = 0; i <= highestTimeoutId; i++) {
                clearTimeout(i);
            }
            localStorage.removeItem("autoRelocation");
            TextAlert('已清空缓存信息');
        });
        let autoRelocation = localStorage.getItem("autoRelocation") === null ? true : localStorage.getItem("autoRelocation") === "true";
        function changefunc(ischeck){
            if (!ischeck) {
                const highestTimeoutId = setTimeout(() => { });
                for (let i = 0; i <= highestTimeoutId; i++) {
                    clearTimeout(i);
                }
                TextAlert(`已经设置自动跳转为：否`);
            } else {
                TextAlert("已经设置自动跳转为：是   5秒后跳转到选课页面")
                setTimeout(() => {
                    window.location.href = "http://jwxt.zjgsu.edu.cn/jwglxt/xsxk/zzxkyzb_cxZzxkYzbIndex.html?gnmkdm=N253512&layout=default"
                }, 5000)
            }
            localStorage.setItem("autoRelocation", ischeck);
        }

        document.getElementById('replaceCourse').addEventListener('change', function () {
            changefunc(this.checked)
        });
        document.getElementById('replaceCourse').checked = autoRelocation === true;
        changefunc(document.getElementById('replaceCourse').checked);
    }
})();