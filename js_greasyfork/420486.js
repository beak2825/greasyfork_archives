// ==UserScript==
// @name            Grab Course in SZU
// @name:en         Grab Course in SZU
// @namespace       http://tampermonkey.net/
// @version         0.1.8
// @description     【使用前先看介绍/有问题可反馈】Grab Course in SZU (深圳大学抢课脚本)：用于深圳大学本科生在抢课阶段的选课，【选课界面】增加【更新抢课时间】，【课程卡片】增加【抢/弃】按钮，【已选志愿】增加【抢课课程】版块。
// @description:en  【使用前先看介绍/有问题可反馈】Grab Course in SZU (深圳大学抢课脚本)：用于深圳大学本科生在抢课阶段的选课，【选课界面】增加【更新抢课时间】，【课程卡片】增加【抢/弃】按钮，【已选志愿】增加【抢课课程】版块。
// @author          cc
// @match           http://bkxk.szu.edu.cn/xsxkapp/sys/xsxkapp/*default/*
// @grant           GM_setValue
// @grant           GM_getValue
// @require         https://greasyfork.org/scripts/418193-coder-utils.js
// @downloadURL https://update.greasyfork.org/scripts/420486/Grab%20Course%20in%20SZU.user.js
// @updateURL https://update.greasyfork.org/scripts/420486/Grab%20Course%20in%20SZU.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var config = {};
    function removeEmptyCourse() {
        Object.keys(config.selectedCourse).forEach(courseId => {
            if (config.selectedCourse[courseId].length === 0) {
                delete config.selectedCourse[courseId];
            };
        });
        GM_setValue('config', config);
    };
    function grabCourse() {
        function recAjax(courseList, index=0) {
            let course = courseList[index];
            return $.ajax({
                headers: {
                    token: config.token,
                },
                method: 'POST',
                url: 'http://bkxk.szu.edu.cn/xsxkapp/sys/xsxkapp/elective/volunteer.do',
                data: {
                    addParam: JSON.stringify({
                        data: {
                            operationType: "1",
                            studentCode: config.studentId,
                            electiveBatchCode: config.electiveBatchCode,
                            teachingClassId: course.teachingClassId,
                            isMajor: "1",
                            campus: course.campus,
                            teachingClassType: course.teachingClassType,
                            chooseVolunteer: "1",
                        },
                    }),
                },
            }).then(res => {
                if (res.code === "1") {
                    console.info(`课程号 ${course.courseId} 课室号 ${course.teachingClassId} 抢课成功`);
                    course.selected = true;
                    return course;
                } else {
                    if (index + 1 < courseList.length) {
                        console.warn(`课程号 ${course.courseId} 课室号 ${course.teachingClassId} 抢课失败，进行下一个课室号的抢课`);
                        return recAjax(courseList, index + 1);
                    } else {
                        console.warn(`课程号 ${course.courseId} 课室号 ${course.teachingClassId} 抢课失败，无更多课室号可供抢课，该课程抢课失败`);
                        return undefined;
                    };
                };
            });
        };
        let reqs = [];
        Object.keys(config.selectedCourse).forEach(courseId => {
            let courseList = config.selectedCourse[courseId];
            if (courseList.every(c => c['selected'] !== true))
                reqs.push(recAjax(courseList));
        });
        Promise.all(reqs).then(res => {
            console.info('所有抢课课程完成抢课，请在抢课课程查看结果');
            alert('检测到可以开始抢课，现在脚本已完成抢课，请在【已选志愿】的【抢课课程】版块查看抢课结果');
            config.exec = true;
            GM_setValue('config', config);
        });
    };
    function setGrabCourseTable() {
        function createContainerFluid(course) {
            return HTMLElement.$mkel('div', {class: 'container-fluid'}, {
                innerHTML: `
                    <div class="row bg-primary">
                        <div class="col-md-3">${course.courseId}</div>
                        <div class="col-md-3">${course.courseName}</div>
                        <div class="col-md-2">已选${config.selectedCourse[course.courseId].length}个班级</div>
                        <div class="col-md-2">${course.natureName}</div>
                        <div class="col-md-1">${course.credit}学分</div>
                    </div>
                    <div class="row">
                        <table class="table">
                            <thead>
                                <tr>
                                    <td width="10%" class="text-primary">老师名称</td>
                                    <td width="10%" class="text-center text-primary">课程性质</td>
                                    <td width="10%" class="text-center text-primary">开课单位</td>
                                    <td width="25%" class="text-primary">上课时间地点</td>
                                    <td width="10%" class="text-center text-primary">选择志愿</td>
                                    <td width="15%" class="text-center text-primary">选课说明</td>
                                    <td width="10%" class="text-center text-primary">是否选中</td>
                                    <td width="10%" class="text-center text-primary">操作</td>
                                </tr>
                            </thead>
                            <tbody>
                            </tbody>
                        </table>
                    </div>
                `,
            });
        };
        function createCvRow(course, chooseVolunteer, containerFluid) {
            let tbody = containerFluid.querySelector('tbody');
            let trCvRow = HTMLElement.$mkel('tr', {class: 'cv-row'}, {
                innerHTML: `
                    <tr class="cv-row" teachingclassid="${course.teachingClassId}">
                        <td>${course.teacher}</td>
                        <td class="text-center">${course.natureName}</td>
                        <td class="text-center">${course.deptName}</td>
                        <td>${course.timePlace}</td>
                        <td class="text-center">第${chooseVolunteer + 1}志愿</td>
                        <td class="text-center cv-color-danger">${course.caption.indexOf('无选课说明') >= 0 ? '' : course.caption}</td>
                        <td class="text-center">${course.selected ? '是' : '否'}</td>
                        <td class="text-center">
                            <button type="button" class="btn btn-default btn-xs cv-up" aria-label="up" disabled="disabled" style="outline: none;">上</button>
                            <button type="button" class="btn btn-default btn-xs cv-down" aria-label="down" disabled="disabled" style="outline: none;">下</button>
                            <button type="button" class="btn btn-danger btn-xs delVolunteer" style="outline: none;" teachingclassid="${course.teachingClassId}">移除</button>
                        </td>
                    </tr>
                `,
            });
            let delBtn = trCvRow.querySelector('button.delVolunteer');
            delBtn.onclick = function(event) {
                if (confirm('是否从抢课课程中移除该项，移除不影响真实选课结果，该操作不可撤销')) {
                    let index = config.selectedCourse[course.courseId].$where(sc => sc['teachingClassId'] === course.teachingClassId);
                    if (index >= 0) {
                        config.selectedCourse[course.courseId].splice(index, 1);
                        GM_setValue('config', config);
                        let previousCvRow = trCvRow.previousElementSibling;
                        let nextCvRow = trCvRow.nextElementSibling;
                        if (!previousCvRow && nextCvRow) {
                            nextCvRow.querySelector('button.cv-up').setAttribute('disabled', 'disabled');
                        } else if (previousCvRow && !nextCvRow) {
                            previousCvRow.querySelector('button.cv-down').setAttribute('disabled', 'disabled');
                        };
                        while (nextCvRow) {
                            let td = nextCvRow.querySelectorAll('td')[4];
                            let cv = parseInt(td.innerHTML.match(/\d+/)) - 1;
                            td.innerHTML = td.innerHTML.replace(/\d+/, String(cv));
                            nextCvRow = nextCvRow.nextElementSibling;
                        };
                        console.warn(`课程号 ${course.courseId} 课室号 ${course.teachingClassId} 移除出抢课课程`);
                    } else {
                        console.warn(`课程号 ${course.courseId} 课室号 ${course.teachingClassId} 不在抢课课程，仅从表格移除`);
                    };
                    trCvRow.remove();
                    if (tbody.childElementCount === 0) {
                        let cf = tbody.parentElement.parentElement.parentElement;
                        let tp = cf.parentElement;
                        cf.remove();
                        if (tp.childElementCount === 0)
                            tp.innerHTML = '没有抢课课程选课记录';
                    };
                };
                event.stopPropagation();
            };
            function exchangeBtnState(row1, row2) {
                function _exchangeBtnState(btn1, btn2) {
                    let btns = [btn1, btn2];
                    let states = ['disabled', 'disabled'];
                    btns.forEach((btn, idx) => {
                        if (btn.getAttribute('disabled') !== 'disabled')
                            states[idx] = '';
                    });
                    if (states[0] !== states[1]) {
                        if (states[0] === 'disabled') {
                            btn1.removeAttribute('disabled');
                            btn2.setAttribute('disabled', 'disabled');
                        } else {
                            btn1.setAttribute('disabled', 'disabled');
                            btn2.removeAttribute('disabled');
                        };
                    };
                };
                function exchangeBtnStateByRow(row1, row2, className) {
                    let btn1 = row1.querySelector(className);
                    let btn2 = row2.querySelector(className);
                    _exchangeBtnState(btn1, btn2, className);
                };
                exchangeBtnStateByRow(row1, row2, 'button.cv-up');
                exchangeBtnStateByRow(row1, row2, 'button.cv-down');
            };
            let upBtn = trCvRow.querySelector('button.cv-up');
            let downBtn = trCvRow.querySelector('button.cv-down');
            upBtn.removeAttribute('disabled');
            downBtn.setAttribute('disabled', 'disabled');
            upBtn.onclick = function(event) {
                let i = Array.from(tbody.children).$where(trCvRow);
                let previousCvRow = tbody.children[i - 1];
                tbody.insertBefore(trCvRow, previousCvRow);
                exchangeBtnState(trCvRow, previousCvRow);
                config.selectedCourse[course.courseId].$swap(i, i - 1);
                GM_setValue('config', config);
                event.stopPropagation();
            };
            downBtn.onclick = function(event) {
                let i = Array.from(tbody.children).$where(trCvRow);
                let nextCvRow = tbody.children[i + 1];
                tbody.insertBefore(nextCvRow, trCvRow);
                exchangeBtnState(trCvRow, nextCvRow);
                config.selectedCourse[course.courseId].$swap(i, i + 1);
                GM_setValue('config', config);
                event.stopPropagation();
            };
            if (chooseVolunteer > 0) {
                let previousCvRow = tbody.children[chooseVolunteer - 1];
                let previousDownBtn = previousCvRow.querySelector('button.cv-down');
                previousDownBtn.removeAttribute('disabled');
            } else {
                upBtn.setAttribute('disabled', 'disabled');
            };
            return trCvRow;
        };
        function createTabPane() {
            return HTMLElement.$mkel('div', {class: 'cv-tab-pane cvSelectedReadyToGradCourse'});
        };
        function createTabsContentElement() {
            if ($('#grab-course-content')[0])
                return undefined;
            let tabsContentElement = $('.jqx-tabs-content>.jqx-tabs-content-element')[0].cloneNode(true);
            tabsContentElement.className = tabsContentElement.className.replace(/xsxk-xktx-tab-content-\d/, 'xsxk-xktx-tab-content-5');
            tabsContentElement.querySelector('.courses>.main>article').innerHTML = '';
            tabsContentElement.style.display = 'none';
            tabsContentElement.id = 'grab-course-content';
            return tabsContentElement;
        };
        function createTabsTitle() {
            if ($('li#grab-course-tab')[0])
                return undefined;
            let tabsTitle = $('.jqx-tabs-title-container')[0].children[0].cloneNode(true);
            tabsTitle.id = 'grab-course-tab';
            tabsTitle.className = tabsTitle.className.replace(/\s?jqx-tabs-title-selected-top/, '');
            tabsTitle.className = tabsTitle.className.replace(/\s?jqx-fill-state-pressed/, '');
            tabsTitle.querySelector('.jqx-tabs-titleContentWrapper').innerHTML = '抢课课程';
            return tabsTitle;
        };
        function setTableTitleClick($tabsTitle) {
            let tabsContentElement = $('#grab-course-content')[0];
            $tabsTitle.on({
                mouseenter: function() {
                    let className = $tabsTitle[0].className;
                    if (className.indexOf('jqx-fill-state-hover') < 0)
                        className = className + ' jqx-fill-state-hover';
                    if (className.indexOf('jqx-tabs-title-hover-top') < 0)
                        className = className + ' jqx-tabs-title-hover-top';
                    $tabsTitle[0].className = className;
                },
                mouseleave: function() {
                    let className = $tabsTitle[0].className;
                    if (className.indexOf('jqx-fill-state-hover') >= 0)
                        className = className.replace(/\s?jqx-fill-state-hover/, '');
                    if (className.indexOf('jqx-tabs-title-hover-top') >= 0)
                        className = className.replace(/\s?jqx-tabs-title-hover-top/, '');
                    $tabsTitle[0].className = className;
                },
                click: function(event) {
                    let className = $tabsTitle[0].className;
                    if (className.indexOf('jqx-fill-state-pressed') < 0)
                        className = className + ' jqx-fill-state-pressed';
                    if (className.indexOf('jqx-tabs-title-selected-top') < 0)
                        className = className + ' jqx-tabs-title-selected-top';
                    $tabsTitle[0].className = className;
                    $tabsTitle[0].parentElement.children.$forEach(e => {
                        if (e.id !== 'grab-course-tab') {
                            e.className = e.className.replace(/\s?jqx-fill-state-pressed/, '');
                            e.className = e.className.replace(/\s?jqx-tabs-title-selected-top/, '');
                        };
                    });
                    tabsContentElement.parentElement.children.$forEach(e => {
                        if (e.id !== 'grab-course-content') {
                            e.style.display = 'none';
                        } else {
                            e.style.display = 'block';
                        };
                    });
                    event.stopPropagation();
                },
            });
            $tabsTitle[0].click = function(event) {
                let className = $tabsTitle[0].className;
                if (className.indexOf('jqx-fill-state-pressed') < 0)
                    className = className + ' jqx-fill-state-pressed';
                if (className.indexOf('jqx-tabs-title-selected-top') < 0)
                    className = className + ' jqx-tabs-title-selected-top';
                $tabsTitle[0].className = className;
                $tabsTitle[0].parentElement.children.$forEach(e => {
                    if (e.id !== 'grab-course-tab') {
                        e.className = e.className.replace(/\s?jqx-fill-state-pressed/, '');
                        e.className = e.className.replace(/\s?jqx-tabs-title-selected-top/, '');
                    };
                });
                tabsContentElement.parentElement.children.$forEach(e => {
                    if (e.id !== 'grab-course-content') {
                        e.style.display = 'none';
                    } else {
                        e.style.display = 'block';
                    };
                });
                event.stopPropagation();
            };
            $('.jqx-tabs-title-container>li').toArray().forEach(e => {
                if (e.id !== 'grab-course-tab') {
                    e.$monitor('attributes', function(events) {
                        if (e.className.indexOf('jqx-tabs-title-selected-top') >= 0) {
                            $tabsTitle[0].className = $tabsTitle[0].className.replace(/\s?jqx-tabs-title-selected-top/, '');
                            $tabsTitle[0].className = $tabsTitle[0].className.replace(/\s?jqx-fill-state-pressed/, '');
                            tabsContentElement.style.display = 'none';
                        };
                        return true;
                    });
                };
            });
        };
        let mo = $('.jqx-tabs-content>.jqx-tabs-content-element>.courses')[0].$monitor('childList', function(events) {
            mo.disconnect();
            if (events[0].addedNodes.length >= 1) {
                let tabsTitle = createTabsTitle();
                if (tabsTitle) {
                    $('.jqx-tabs-title-container')[0].appendChild(tabsTitle);
                    let $tabsTitle = $('.jqx-tabs-title-container>li#grab-course-tab');
                    let copiedTabsContentElement = createTabsContentElement();
                    if (copiedTabsContentElement) {
                        $('.jqx-tabs-content')[0].appendChild(copiedTabsContentElement);
                        setTableTitleClick($tabsTitle);
                        let divReadyToGrad = createTabPane();
                        copiedTabsContentElement.querySelector('.courses>.main>article').appendChild(divReadyToGrad);
                        let updateInfoState = updateInfo();
                        Promise.all([updateInfoState]).then(res => {
                            if (res[0]) {
                                console.info('在显示抢课课程前，完成更新抢课课程信息');
                            } else {
                                console.warn('在显示抢课课程前，更新抢课课程信息失败，所显示课程为未更新的抢课课程');
                            };
                            let allGrabCourses = Object.values(config.selectedCourse).$merge();
                            if (allGrabCourses.length > 0) {
                                let courseIdList = Object.keys(config.selectedCourse);
                                for (let i = 0; i < courseIdList.length; i++) {
                                    let courseId = courseIdList[i];
                                    if (config.selectedCourse[courseId] && config.selectedCourse[courseId].length > 0) {
                                        let firstCourse = config.selectedCourse[courseId][0];
                                        let divContainerFluid = createContainerFluid(firstCourse);
                                        for (let j = 0; j < config.selectedCourse[courseId].length; j++) {
                                            let course = config.selectedCourse[courseId][j];
                                            let trCvRow = createCvRow(course, j, divContainerFluid);
                                            divContainerFluid.querySelector('tbody').appendChild(trCvRow);
                                        };
                                        divReadyToGrad.appendChild(divContainerFluid);
                                    };
                                };
                            } else {
                                divReadyToGrad.innerHTML = '没有抢课课程选课记录';
                            };
                        });
                    };
                };
            };
        });
    };
    function setChange() {
        function cardInit(card) {
            let row = card.parentElement.parentElement;
            let courseId = row.getAttribute('coursenumber');
            let teachingClassId = card.querySelector('.cv-caption-text').id.match(/\d+/)[0];
            if (card.getAttribute('isListening') !== 'true') {
                console.info('初始化【卡片】');
                let [unselectedColor, selectedColor] = ['#0eb83a', '#ff2d51'];
                let grabBtn = HTMLElement.$mkel('button', {}, {innerText: '抢'}, {
                    'background-color': unselectedColor,
                    'color': 'white',
                    'font-weight': 'bold',
                    'border': '0',
                    'margin-top': '4px',
                    'outline': 'none',
                    'cursor': 'pointer',
                }, {
                    click: function(event) {
                        if (getComputedStyle(row.querySelector('.cv-num'), ':after').transform !== 'none' && card.getAttribute('isSelected') !== 'true') {
                            alert('你已经选上该门课程，请勿重复选择');
                            event.stopPropagation();
                            return false;
                        };
                        if (card.querySelector('.cv-info').innerText.indexOf('课程冲突') >= 0 && card.getAttribute('isSelected') !== 'true') {
                            alert('该课程冲突，不可加入抢课课程');
                            event.stopPropagation();
                            return false;
                        };
                        config.selectedCourse[courseId] = config.selectedCourse[courseId] || [];
                        let sameItems = config.selectedCourse[courseId].filter(sc => sc['teachingClassId'] === teachingClassId);
                        if (grabBtn.parentElement.getAttribute('isSelected') === 'false') {
                            if (sameItems.length === 0) {
                                let course = {
                                    courseId: courseId,
                                    teachingClassId: teachingClassId,
                                    teachingClassType: sessionStorage.teachingClassType,
                                    typeName: row.querySelector('.cv-type').innerText,
                                    natureName: row.querySelector('.cv-nature').innerText,
                                    deptName: row.querySelector('.cv-department-col').innerText,
                                    courseName: row.querySelector('.cv-course').innerText,
                                    credit: row.querySelector('.cv-credit-col').innerText,
                                    teacher: card.querySelector('.cv-info h5 [title]').innerText,
                                    timePlace: card.querySelector('.cv-info>[title]').innerText,
                                    caption: card.querySelector('.cv-info').children.$filter(div => div.innerText.indexOf('选课说明') >= 0)[0].getAttribute('title'),
                                    campus: JSON.parse(sessionStorage.currentCampus).code,
                                    selected: false,
                                };
                                config.selectedCourse[courseId].push(course);
                                grabBtn.innerText = '弃';
                                grabBtn.style.backgroundColor = selectedColor;
                                grabBtn.parentElement.setAttribute('isSelected', 'true');
                                console.warn(`课程号 ${course.courseId} 课室号 ${course.teachingClassId} 添加至抢课课程`);
                            };
                        } else {
                            if (sameItems.length > 0) {
                                let index = config.selectedCourse[courseId].$where(sc => sc['teachingClassId'] === teachingClassId);
                                let course = config.selectedCourse[courseId].$remove(index);
                                grabBtn.innerText = '抢';
                                grabBtn.style.backgroundColor = unselectedColor;
                                grabBtn.parentElement.setAttribute('isSelected', 'false');
                                console.warn(`课程号 ${course.courseId} 课室号 ${course.teachingClassId} 移除出抢课课程`);
                            };
                        };
                        GM_setValue('config', config);
                        event.stopPropagation();
                    },
                });
                card.appendChild(grabBtn);
                card.style.height = `${card.offsetHeight + 50}px`;
                card.setAttribute('isListening', 'true');
                card.setAttribute('isSelected', 'false');
                if (config.selectedCourse[courseId] && config.selectedCourse[courseId].length > 0) {
                    let sameItems = config.selectedCourse[courseId].filter(sc => sc['teachingClassId'] === teachingClassId);
                    if (sameItems.length > 0) {
                        grabBtn.innerText = '弃';
                        grabBtn.style.backgroundColor = selectedColor;
                        card.setAttribute('isSelected', 'true');
                    };
                };
            } else {
                console.info('【卡片】为已初始化状态，不需要再次进行初始化');
            };
        };
        function rowInit(row) {
            if (row.getAttribute('isListening') !== 'true') {
                console.info('初始化【行项】');
                row.$monitor('attributes', function(events) {
                    let event = events[0];
                    if (event.target.className.indexOf('cv-expand') >= 0) {
                        let cards = row.querySelectorAll('section > div');
                        if (cards.length > 0) {
                            console.info('【行项】发生改变，即将初始化【卡片】');
                            cards.forEach(cardInit);
                        } else {
                            console.info('【行项】发生改变，但无【卡片】需要初始化');
                        };
                    };
                });
                row.querySelectorAll('section > div').forEach(cardInit);
                row.setAttribute('isListening', 'true');
            } else {
                console.info('【行项】为已初始化状态，不需要再次进行初始化');
            };
        };
        function bodyInit(body) {
            if (body.getAttribute('isListening') !== 'true') {
                console.info('初始化【容器】');
                body.$monitor('childList', function(events) {
                    let rows = body.querySelectorAll('.cv-row');
                    if (rows.length > 0) {
                        console.info('【容器】发生改变，即将初始化【行项】');
                        rows.forEach(rowInit);
                    } else {
                        console.info('【容器】发生改变，但无【行项】需要初始化');
                    };
                });
                body.querySelectorAll('.cv-row').forEach(rowInit);
                body.setAttribute('isListening', 'true');
            } else {
                console.info('【容器】为已初始化状态，不需要再次进行初始化');
            };
        };
        function tabInit(tab) {
            function waitBody() {
                let body = tab.querySelector('.cv-body');
                if (body)
                    bodyInit(body);
                else
                    setTimeout(waitBody, 50);
            };
            tab.$monitor('childList', function(events) {
                let event = events[0];
                if (event.type === 'childList')
                    waitBody();
            });
            waitBody();
        };
        document.body.$monitor('childList', function(events) {
            for (let event of events) {
                if (event.addedNodes.length === 1 && event.addedNodes[0].getAttribute('role') === 'dialog') {
                    setGrabCourseTable();
                };
            };
        });
        $('.cv-tab-pane').toArray().forEach(tabInit);
    };
    function setUpdateInfoBar() {
        let defaultHeight = 30;
        let [defaultBtnColor, clickedBtnColor] = ['#047adc', '#2655c8'];
        function createInput(placeholder, width, id_, maxlength=10, marginLeft=0) {
            return HTMLElement.$mkel('input', {
                id: id_,
                type: 'text',
                placeholder: placeholder,
                maxlength: String(maxlength),
            }, {}, {
                'padding': '3px 5px',
                'border': '1px solid grey',
                'border-radius': '0px',
                'font-size': '16px',
                'margin-left': `${marginLeft}px`,
                'width': `${width}px`,
                'height': `${defaultHeight}px`,
            }, {
                input: function(event) {
                    if (event.data && !event.data.match(/\d/))
                        input.value = input.value.slice(0, input.value.length - 1);
                },
            });
        };
        function createButton(innerText, width, marginLeft) {
            let button = HTMLElement.$mkel('button', {type: 'button'}, {innerText: innerText}, {
                'width': `${width}px`,
                'height': `${defaultHeight}px`,
                'background-color': `${defaultBtnColor}`,
                'color': 'white',
                'border': '0px',
                'font-weight': 'bold',
                'margin-left': `${marginLeft}px`,
                'outline': 'none',
                'cursor': 'pointer',
            });
            function changeColor() {
                button.style.backgroundColor = clickedBtnColor;
                setTimeout(() => {
                    button.style.backgroundColor = defaultBtnColor;
                }, 200);
                return true;
            };
            return [button, changeColor];
        };
        function createForm(marginLeft) {
            return HTMLElement.$mkel('div', {}, {}, {
                'width': 'max-content',
                'margin-left': `${marginLeft}px`,
                'margin-top': '20px',
                'display': 'flex',
                'flex-direction': 'row',
            });
        };
        function createGrabDatetimeForm() {
            let yearInput = createInput('年', 80, 'year', 4, 0);
            let monthInput = createInput('月', 50, 'month', 2, 10);
            let dayInput = createInput('日', 50, 'day', 2, 10);
            let hourInput = createInput('时', 50, 'hour', 2, 10);
            let minuteInput = createInput('分', 50, 'minute', 2, 10);
            let secondInput = createInput('秒', 50, 'second', 2, 10);
            let inputs = [yearInput, monthInput, dayInput, hourInput, minuteInput, secondInput];
            let [button, changeColor] = createButton('更新抢课时间', 110, 10);
            if (config.datetime) {
                let configValues = config.datetime.match(/\d+/g);
                inputs.forEach((input, index) => input.value = configValues[index]);
            };
            button.onclick = function(event) {
                changeColor();
                function isValid(value, minlength, maxlength, minValue, maxValue) {
                    if (value.length < minlength || maxlength < value.length)
                        return false;
                    return parseInt(value).$in(minValue, maxValue);
                };
                let values = inputs.map(i => i.value);
                let minlengths = [4, 1, 1, 1, 1, 1];
                let maxlengths = [4, 2, 2, 2, 2, 2];
                let minValues = [new Date().getFullYear(), 1, 1, 0, 0, 0];
                let maxValues = [9999, 12, 31, 23, 59, 59];
                let valids = values.map((v, i) => isValid(v, minlengths[i], maxlengths[i], minValues[i], maxValues[i]));
                for (let i = 0; i < values.length; i++) {
                    if (!valids[i]) {
                        inputs[i].value = '';
                        if (i < 3) {
                            alert('请输入合法的日期');
                        } else {
                            alert('请输入合法的时间');
                        };
                        inputs[i].focus();
                        return false;
                    };
                };
                function getMaxDay(year, month) {
                    [year, month] = [parseInt(year), parseInt(month)];
                    let monthDayMaps = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
                    let isLeapYear = year => (year % 4 == 0) && (year % 100 != 0 || year % 400 == 0);
                    if (isLeapYear(year))
                        monthDayMaps[2] += 1;
                    return monthDayMaps[month];
                };
                let maxDay = getMaxDay(yearInput.value, monthInput.value);
                if (parseInt(dayInput.value) > maxDay) {
                    alert('请输入合法的日期');
                    inputs[2].focus();
                    return false;
                };
                let datetime = `${values[0]}-${values[1]}-${values[2]} ${values[3]}:${values[4]}:${values[5]}`;
                if (new Date(datetime) <= new Date()) {
                    alert('输入的日期必须晚于当前时间');
                    inputs[2].focus();
                    return false;
                };
                inputs.forEach((input, index) => input.value = input.value.$format(-maxlengths[index], '0'));
                values = inputs.map(i => i.value);
                datetime = `${values[0]}-${values[1]}-${values[2]} ${values[3]}:${values[4]}:${values[5]}`;
                config.datetime = datetime;
                config.exec = false;
                GM_setValue('config', config);
                alert(`成功更新抢课日期为 ${datetime} ，请刷新页面以使用最新信息配置`);
                event.stopPropagation();
            };
            let form = createForm(32);
            form.appendChild(yearInput);
            form.appendChild(monthInput);
            form.appendChild(dayInput);
            form.appendChild(hourInput);
            form.appendChild(minuteInput);
            form.appendChild(secondInput);
            form.appendChild(button);
            return form;
        };
        function appendForms(forms) {
            let formContainer = HTMLElement.$mkel('div', {}, {}, {
                'display': 'flex',
                'flex-direction': 'row',
                'width': 'max-content',
            });
            let ns = $('.cv-page-header')[0].nextSibling;
            ns.parentElement.insertBefore(formContainer, ns);
            forms.forEach(form => {
                formContainer.appendChild(form);
            });
        };
        appendForms([createGrabDatetimeForm()]);
    };
    function updateInfo() {
        return $.ajax({
            headers: {
                token: config.token,
            },
            method: 'POST',
            url: `http://bkxk.szu.edu.cn/xsxkapp/sys/xsxkapp/elective/volunteerResult.do?timestamp=${new Date().getTime()}`,
            data: {
                studentCode: config.studentId,
                electiveBatchCode: config.electiveBatchCode,
            },
        }).then(res => {
            if (res.code === "1") {
                let entries = res.dataList.map(el => {
                    let sc = el.tcList[0];
                    return [sc.courseNumber, sc.teachingClassID];
                });
                let selectedCourse = Object.fromEntries(entries);
                Object.values(config.selectedCourse).$merge().forEach(course => {
                    course.selected = selectedCourse[course.courseId] === course.teachingClassId;
                });
                GM_setValue('config', config);
                return true;
            };
            return false;
        });
    };
    function loadInfo() {
        config = GM_getValue('config');
        if (!config) {
            config = {
                datetime: '',
                exec: false,
                selectedCourse: {},
            };
        } else {
            Object.keys(config.selectedCourse).forEach(courseId => {
                if (config.selectedCourse[courseId].length === 0) {
                    delete config.selectedCourse[courseId];
                };
            });
        };
        GM_setValue('config', config);
    };
    function run() {
        setChange();
        if (!config.exec && config.datetime) {
            removeEmptyCourse();
            let needGrab = Object.values(config.selectedCourse).map(scl => scl.$where(sc => sc['selected']) < 0);
            if (needGrab.$where(true) >= 0) {
                let currentTime = new Date().getTime();
                let grabTime = new Date(config.datetime).getTime();
                if (currentTime >= grabTime) {
                    console.info('当前时间晚于抢课时间，即将进入抢课');
                    grabCourse();
                } else {
                    console.info('当前时间早于抢课时间，设定抢课倒计时');
                    setTimeout(grabCourse, grabTime - currentTime);
                };
            } else {
                console.info('抢课课程中的所有课程均已选中，不需要抢课');
            };
        } else {
            console.info('可能已经执行抢课，或可能未设置抢课时间，因此不需要抢课');
        };
    };
    function main() {
        loadInfo();
        setUpdateInfoBar();
        config.token = sessionStorage.token;
        config.studentId = JSON.parse(sessionStorage.studentInfo).code;
        config.electiveBatchCode = JSON.parse(sessionStorage.studentInfo).electiveBatch.code;
        run();
        Promise.all([updateInfo()]).then(res => {
            if (res[0]) {
                console.info('首次加载，完成更新抢课课程信息');
            } else {
                console.warn('首次加载，更新抢课课程信息失败');
            };
        });
    };
    main();
})();