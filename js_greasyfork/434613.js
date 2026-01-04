// ==UserScript==
// @name         上海大学网站增强 - 刷课助手
// @namespace    https://github.com/panghaibin/shu-web-js
// @version      3.5.2
// @description  <选课系统>1.第二、三轮选课自助刷课，解放双手。【人人有课刷，抵制卖课狗】【支持多门课程同时刷】 2.选课学期自动选择 3.选课排名页面标红排名超过额定人数的课程 4.学分完成情况页面，原始成绩换算绩点，选课学期可标红 5.所有存在显示课程号的页面，支持点击课程号查看课程介绍，右键直接复制课程号 <教务管理>1.教学评估页面可一键赋值，支持全部赋值和单行赋值 2.成绩查询页面在成绩未发布时自动刷新 3.移除主页企业微X广告
// @author       panghaibin
// @match        *://xk.autoisp.shu.edu.cn/*
// @match        *://cj.shu.edu.cn/*
// @grant        none
// @license      MIT
// @supportURL   https://github.com/panghaibin/shu-web-js/issues
// @downloadURL https://update.greasyfork.org/scripts/434613/%E4%B8%8A%E6%B5%B7%E5%A4%A7%E5%AD%A6%E7%BD%91%E7%AB%99%E5%A2%9E%E5%BC%BA%20-%20%E5%88%B7%E8%AF%BE%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/434613/%E4%B8%8A%E6%B5%B7%E5%A4%A7%E5%AD%A6%E7%BD%91%E7%AB%99%E5%A2%9E%E5%BC%BA%20-%20%E5%88%B7%E8%AF%BE%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    //--------刷课配置 开始--------
    // 是否开启刷课 (true: 开启 false: 关闭)
    let START_SELECT = false;

    // 课程设置，可设置多个
    let COURSE_SETTING = [
        // 格式： ['课程号', '教师号'],
        // 以下两个为示例 记得修改或删除，也可增加更多
        ['0085X078', '1091'],
        ['0085X078', '1331'],
    ];

    // 刷课间隔，默认 8000 ，单位毫秒 一般不需要修改
    let SELECT_DELAY = 8000
    //--------刷课配置 结束--------

    if (location.host === 'xk.autoisp.shu.edu.cn') {
        if (location.pathname === '/CourseSelectionStudent/PlanQuery') {
            plan_query_page();
        } else if (location.pathname === '/StudentQuery/QueryEnrollRank') {
            rclick_copy_course_id();
            red_rank();
        } else if (location.pathname === '/CourseSelectionStudent/FuzzyQuery' && START_SELECT) {
            select_course_helper();
        } else if (location.pathname === '/Home/TermIndex' && location.search !== '?auto_select=0') {
            auto_select_term();
        } else if (location.pathname === '/StudentQuery/QueryCourse'
            || location.pathname === '/StudentQuery/QueryCourseTable'
            || location.pathname === '/StudentQuery/QueryDeleteCourse'
        ) {
            rclick_copy_course_id();
        }
        if (location.pathname !== '/Home/TermIndex') {
            manual_select_term();
            add_xk_footer();
        }
    } else if (location.host === 'cj.shu.edu.cn') {
        if (location.pathname === '/StudentPortal/Evaluate') {
            evaluate_helper();
        } else if (location.pathname === '/Home/StudentIndex') {
            remove_cj_ad();
        } else if (location.pathname === '/StudentPortal/ScoreQuery') {
            auto_fresh_score();
        }
    }

    function score_conversion(item) {
        let score_num = item.innerText * 1;
        let score_raw = item.innerText;
        if (score_raw.length > 0) {
            if (score_num >= 90 && score_num <= 100 || score_raw === "A") {
                item.innerText = score_raw + ' / 4.0';
            } else if (score_num >= 85 && score_num <= 89.9 || score_raw === "A-") {
                item.innerText = score_raw + ' / 3.7';
            } else if (score_num >= 82 && score_num <= 84.9 || score_raw === "B+") {
                item.innerText = score_raw + ' / 3.3';
            } else if (score_num >= 78 && score_num <= 81.9 || score_raw === "B") {
                item.innerText = score_raw + ' / 3.0';
            } else if (score_num >= 75 && score_num <= 77.9 || score_raw === "B-") {
                item.innerText = score_raw + ' / 2.7';
            } else if (score_num >= 72 && score_num <= 74.9 || score_raw === "C+") {
                item.innerText = score_raw + ' / 2.3';
            } else if (score_num >= 68 && score_num <= 71.9 || score_raw === "C") {
                item.innerText = score_raw + ' / 2.0';
            } else if (score_num >= 66 && score_num <= 67.9 || score_raw === "C-") {
                item.innerText = score_raw + ' / 1.7';
            } else if (score_num >= 64 && score_num <= 65.9 || score_raw === "D") {
                item.innerText = score_raw + ' / 1.5';
            } else if (score_num >= 60 && score_num <= 63.9 || score_raw === "D-") {
                item.innerText = score_raw + ' / 1.0';
            } else if ((score_num >= 0 && score_num <= 59.9 || score_raw === "F")) {
                item.innerText = score_raw + ' / 0.0';
            } else if (score_raw === "P" || score_raw === "L") {
                item.innerText = score_raw + ' / 不计';
            }
            // 标红压线绩点 暂时不使用
            // if (score_num === 89 || score_num === 84 || score_num === 81 || score_num === 77 || score_num === 74 ||
            //     score_num === 71 || score_num === 67 || score_num === 65 || score_num === 63 || score_num === 59) {
            //     item.style.color = 'red';
            // }
        }
    }

    function red_rank() {
        let elements;
        elements = document.getElementsByName('rowclass');
        for (let i = 0; i < elements.length; ++i) {
            let row = elements[i];
            let room = row.children[4].innerText * 1;
            let _rank = row.children[6].innerText.split('-');
            let rank = _rank[_rank.length - 1] * 1;
            if (rank > room) {
                for (let j = 0; j < row.children.length; ++j) {
                    elements[i].children[j].style.color = 'red';
                    elements[i].children[j].style.fontWeight = 'bold';
                }
            }
        }
    }

    function select_course_helper() {
        let i = 0;
        let select_id = setInterval(function () {
            const index = i % COURSE_SETTING.length;
            const course = COURSE_SETTING[index]
            const course_id = course[0];
            const teacher_id = course[1];
            document.getElementsByName('CID')[0].defaultValue = course_id;
            document.getElementsByName('TeachNo')[0].defaultValue = teacher_id;
            document.getElementById('QueryAction').click();
            setTimeout(function () {
                let tbllist = document.getElementsByClassName('tbllist');
                let room = tbllist[0].children[0].children[1].children[9].innerText * 1;
                let num = tbllist[0].children[0].children[1].children[10].innerText * 1;
                console.log('第' + ++i + '次 课程号' + course_id + ' 教师号' + teacher_id + ' 容量' + room + ' 人数' + num);
                if (room > num) {
                    tbllist[0].children[0].children[1].children[0].children[0].checked = true;
                    document.getElementById('CourseCheckAction').click();
                    let across_campus = document.getElementById('NotCollegeAction');
                    if (across_campus != null) {
                        setTimeout(function () {
                            across_campus.click();
                        }, 1000);
                    }
                    tbllist = document.getElementsByClassName('tbllist');
                    let callback_msg = tbllist[1].children[0].children[1].children[5].innerText
                    if (callback_msg.includes('成功')) {
                        COURSE_SETTING.splice(index, 1);
                        if (COURSE_SETTING.length === 0) {
                            clearInterval(select_id);
                        } else {
                            CloseDialog('divOperationResult');
                        }
                    } else {
                        // 关闭选课失败的窗口
                        CloseDialog('divOperationResult');
                    }
                    console.log(callback_msg);
                }
            }, 1000);
        }, SELECT_DELAY);
    }

    function evaluate_helper() {
        let tbllist = document.getElementsByClassName('tbllist');
        let th = document.createElement('TH');
        th.innerText = '一键评估';
        let heading = tbllist[0].children[0].children[0];
        heading.insertBefore(th, heading.children[4]);

        let evaluate_list = ['结果', '非常大', '比较大', '一般', '很少'];
        let course_count = tbllist[0].children[0].childElementCount - 2;
        for (let i = 1; i <= course_count; ++i) {
            let select = document.createElement('SELECT');
            select.style.backgroundColor = '#ffc';
            for (let j = 0; j < evaluate_list.length; j++) {
                let option = document.createElement('OPTION');
                option.innerText = evaluate_list[j];
                option.value = j;
                if (j === 0) {
                    option.innerText = '单行' + option.innerText;
                    option.selected = true;
                }
                select.appendChild(option);
            }
            select._params = {'row': i - 1};
            select.addEventListener('change', function () {
                let row = event.target._params['row']
                for (let j = 0; j < 4; ++j) {
                    let evaluate_name = 'classlist[' + row + '].ItemValue[' + j + ']';
                    let raw_select = document.getElementsByName(evaluate_name);
                    raw_select[0].children[this.value].selected = true;
                }
            }, false);
            let td = document.createElement('TD');
            td.appendChild(select);
            let cource = tbllist[0].children[0].children[i];
            cource.insertBefore(td, cource.children[4]);
        }

        let all_select = document.createElement('SELECT');
        all_select.style.backgroundColor = '#ffc';
        all_select.style.marginRight = '15px';
        for (let i = 0; i < evaluate_list.length; i++) {
            let option = document.createElement('OPTION');
            option.innerText = evaluate_list[i];
            option.value = i;
            if (i === 0) {
                option.innerText = '全部' + option.innerText;
                option.selected = true;
            }
            all_select.appendChild(option);
        }
        all_select.addEventListener('change', function () {
            let selects = document.getElementsByTagName('SELECT');
            for (let i = 0; i < selects.length; ++i) {
                selects[i].children[this.value].selected = true;
            }
        }, false);
        let row = tbllist[0].children[0].children;
        let last_row = row[row.length - 1].children[0].children[0];
        let save_btn = last_row.children[0];
        last_row.insertBefore(all_select, save_btn);
    }

    function remove_cj_ad() {
        document.getElementsByClassName('div_master_content')[0].remove();
    }

    function auto_select_term() {
        let term_list = document.getElementsByName('rowterm');
        document.getElementById('termId').value = term_list[term_list.length - 1].getAttribute('value');
        document.getElementsByTagName('button')[0].click();
    }

    function manual_select_term() {
        let menu = document.querySelector('.term-menu');
        if (menu !== null) {
            let a_tag = menu.getElementsByTagName('a')[0];
            a_tag.href = a_tag.href + '?auto_select=0';
        }
    }

    function add_xk_footer() {
        setInterval(() => {
            let footer = document.getElementsByClassName('main-footer')[0];
            if (typeof (footer) !== "undefined") {
                let footer_div = footer.children[1];
                if (!footer_div.innerHTML.includes('刷课助手')) {
                    let skzs = document.createElement('A');
                    skzs.innerText = '刷课助手已加载';
                    skzs.href = 'https://greasyfork.org/zh-CN/scripts/434613';
                    skzs.target = '_blank';
                    footer_div.innerHTML = footer_div.innerHTML + ' - ' + skzs.outerHTML;
                }
            }
        }, 0)
    }

    function get_current_grade_term() {
        let term_name = document.getElementsByClassName('dropdownterm')[0].children[0].children[1].innerText;
        let term_year = /(\d{2})学年/.exec(term_name)[1] * 1;
        let term_type = /(.)季学期/.exec(term_name)[1];
        let id_num = document.getElementsByClassName('nav-function-text')[0].innerText;
        let enroll_year = /(\d{2})\d{6}/.exec(id_num)[1] * 1;
        let term_list = {'秋': 1, '冬': 2, '春': 3, '夏': 4};
        let term_num = term_list[term_type];
        let grade_num = term_year - enroll_year;
        return {'class': 'gt-' + grade_num + term_num, 'grade': grade_num, 'term': term_num};
    }

    function onchange_grade_term_select() {
        let all_gt = document.getElementsByClassName('gt');
        for (let i = 0; i < all_gt.length; i++) {
            all_gt[i].style.color = '';
        }
        let grade_choice = document.getElementsByClassName('grade-select')[0].value;
        let term_choice = document.getElementsByClassName('term-select')[0].value;
        let choice_gt = document.getElementsByClassName('gt-' + grade_choice + term_choice);
        for (let i = 0; i < choice_gt.length; i++) {
            choice_gt[i].style.color = 'red';
        }
    }

    function plan_query_page() {
        let grade_list = {'一': 1, '二': 2, '三': 3, '四': 4, '五': 5};
        let term_list = {'秋': 1, '冬': 2, '春': 3, '夏': 4};
        let td_list = document.getElementsByTagName('TD');
        for (let i = 0; i < td_list.length; i++) {
            if (td_list[i].innerText.includes('学期')) {
                td_list[i].innerHTML = td_list[i].innerHTML.replaceAll(/(.)年级(.)季学期/g,
                    function ($0, $1, $2) {
                        let span = document.createElement('SPAN');
                        span.className = 'gt gt-' + grade_list[$1] + '0 gt-' + grade_list[$1] + term_list[$2];
                        span.innerText = $0;
                        return span.outerHTML;
                    });
            } else if (is_cource_id_td(td_list[i])) {
                edit_cource_id_td(td_list[i]);
            } else if (typeof (td_list[i].attributes.name) !== "undefined"
                && ['tdscorecnotpass', 'tdscore', 'tdscorecpass'].includes(td_list[i].attributes.name.value)) {
                score_conversion(td_list[i]);
            }
        }

        let reverse_grade_list = {1: '一', 2: '二', 3: '三', 4: '四', 5: '五'};
        let reverse_term_list = {1: '秋季', 2: '冬季', 3: '春季', 4: '夏季', 0: '全部'};
        let current_grade_term = get_current_grade_term();

        let grade_select = document.createElement('SELECT');
        grade_select.className = 'grade-select';
        grade_select.style.backgroundColor = '#ffc';
        grade_select.addEventListener('change', onchange_grade_term_select);
        let grade_val = current_grade_term['grade'];
        for (let i = 1; i <= 5; i++) {
            let option = document.createElement('OPTION');
            option.innerText = reverse_grade_list[i] + '年级';
            option.value = i;
            if (grade_val === i) {
                option.selected = true;
            }
            grade_select.appendChild(option);
        }

        let term_select = document.createElement('SELECT');
        term_select.className = 'term-select';
        term_select.style.backgroundColor = '#ffc';
        term_select.addEventListener('change', onchange_grade_term_select);
        let term_val = current_grade_term['term'];
        for (let i = 0; i <= 4; i++) {
            let option = document.createElement('OPTION');
            option.innerText = reverse_term_list[i] + '学期';
            option.value = i;
            if (term_val === i) {
                option.selected = true;
            }
            term_select.appendChild(option);
        }

        let th_list = document.getElementsByTagName('TH');
        for (let i = 0; i < th_list.length; i++) {
            if (th_list[i].innerText.includes('教学计划')) {
                th_list[i].appendChild(grade_select);
                th_list[i].appendChild(term_select);
                break;
            }
        }

        let gt_class = document.getElementsByClassName(current_grade_term['class']);
        for (let i = 0; i < gt_class.length; i++) {
            gt_class[i].style.color = 'red';
        }
    }

    function fresh_score(interval_id) {
        let score_table = document.getElementById('divList');
        if (score_table.innerText.includes('学号') && !score_table.innerText.includes('未提交')) {
            if (interval_id !== null) {
                let title = '成绩已发布';
                blink_title(title);
                clearInterval(interval_id);
            }
            return false;
        } else if (score_table.innerText.includes('评估')) {
            let title = '成绩已发布，教学评估完成后可查看';
            blink_title(title);
            clearInterval(interval_id);
            return false;
        } else {
            score_table.innerHTML = score_table.innerHTML + '<br>8秒后自动刷新';
            return true;
        }
    }

    function auto_fresh_score() {
        let interval_id = null;
        if (fresh_score(interval_id)) {
            let i = 0;
            interval_id = setInterval(function () {
                document.title = '已刷新' + ++i + '次成绩';
                document.getElementsByTagName('INPUT')[0].click();
                setTimeout(fresh_score, 2000, interval_id);
            }, 8000);
        }
    }

    function rclick_copy_course_id() {
        setInterval(function () {
            let td_list = document.getElementsByTagName('TD');
            for (let i = 0; i < td_list.length; i++) {
                if (is_cource_id_td(td_list[i])) {
                    edit_cource_id_td(td_list[i]);
                }
            }
        }, 500);
    }

    function is_cource_id_td(item) {
        return item.innerText.length === 8 && /\d.{6}\d/.test(item.innerText);
    }

    function edit_cource_id_td(item) {
        let course_id = item.innerText;
        item.className = 'course-id';
        item.style.cursor = 'pointer';
        item.title = '点击查看课程简介，右键复制课程号';
        item.oncontextmenu = function (e) {
            e.preventDefault();
            copy_to_clipboard(course_id)
                .then(() => toast_msg(item, '已复制'))
                .catch(() => toast_msg(item, '复制失败'));
        }
        item.onclick = function () {
            window.open("../DataQuery/QueryCourseIntro?courseNo=" + course_id);
        }
    }

    function copy_to_clipboard(text) {
        // From https://stackoverflow.com/a/65996386
        if (navigator.clipboard && window.isSecureContext) {
            return navigator.clipboard.writeText(text);
        } else {
            let textArea = document.createElement("textarea");
            textArea.value = text;
            textArea.style.position = "fixed";
            textArea.style.left = "-999999px";
            textArea.style.top = "-999999px";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            return new Promise((res, rej) => {
                document.execCommand('copy') ? res() : rej();
                textArea.remove();
            });
        }
    }

    function toast_msg(item, msg) {
        let toast = document.createElement('span');
        toast.className = 'toast';
        toast.style.fontSize = '0.8em';
        toast.innerText = '\n' + msg;
        item.appendChild(toast);
        setTimeout(function () {
            toast.remove();
        }, 500);
    }

    function blink_title(title_text, times = 0) {
        let space = ('—').repeat(title_text.length);
        if (times === 0) {
            document.title = space;
        } else if (times === 1) {
            document.title = title_text;
        }
        times = (times + 1) % 2;
        setTimeout(function () {
            blink_title(title_text, times);
        }, 800);
    }

})();
