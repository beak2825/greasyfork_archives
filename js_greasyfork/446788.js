// ==UserScript==
// @name         USTC Teacher Email
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Get Teacher Email
// @author       txtxj
// @match        https://jw.ustc.edu.cn/home*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/446788/USTC%20Teacher%20Email.user.js
// @updateURL https://update.greasyfork.org/scripts/446788/USTC%20Teacher%20Email.meta.js
// ==/UserScript==

$(window).on("load", function() {

    'use strict';

    let title = document.getElementById("e-top-home-page");
    let li = document.createElement("li");
    li.setAttribute("class", "tabLi active");
    let btn = document.createElement("a");
    btn.href = "javascript:void(0)";
    btn.onclick = function() {
        var teacherName = prompt("请输入老师姓名\n搜索需要用时约 30 秒\n搜索结果将以弹窗形式给出\n详细输出可在控制台查看");

        async function getTeacherEmail(teacher, terms=10, interval=3) {
            // 学期 id 配置
            const POOL = ["281", "261", "241", "221", "202", "201", "281", "261", "181", "161", "141", "121", "101", "81", "62", "61", "39", "35", "23", "38", "20", "43", "21", "34", "42", "37", "17", "41", "18", "33", "22", "9", "19", "40", "36", "32", "10", "24", "44", "25", "11", "47", "46", "45", "27", "51", "50", "12", "26", "49", "48", "8", "7", "31", "6", "16", "5", "30", "4", "15", "3", "29", "2", "1", "14", "28", "53", "52", "13"];

            // 首先获取学生查询的标识码
            const queryDoc = await $.ajax({
                url: "https://jw.ustc.edu.cn/for-std/lesson-search",
            });
            const student_id = queryDoc.match(
                /\/for-std\/lesson-search\/index\/(\d*)/
            )[1];

            // 查找老师教的课程 id
            const course_id = await (async () => {
                for (let i = 0; i < terms; i++) {
                    const courses_url = `https://jw.ustc.edu.cn/for-std/lesson-search/semester/${POOL[i]}/search/${student_id}?teacherNameLike=${teacher}`;
                    const courses_info = await $.ajax({ url: courses_url });
                    if (courses_info.data && courses_info.data.length) {
                        const courses_teachers = courses_info.data.map((course) => ({
                            teachers: course.teacherAssignmentList.map((teacher_object) => teacher_object.person.nameZh),
                            id: course.id
                        })).filter((course_teachers) => course_teachers.teachers.includes(teacher))
                        if (courses_teachers)
                            return courses_teachers[0].id;
                    }
                    console.log(`第 ${i + 1} 个学期查询失败，正在等待 ${interval} 秒...`);
                    await new Promise((r) => setTimeout(r, interval * 1000));
                }
            })();

            if (typeof(course_id) == "undefined") {
                alert(`没有找到${teacherName}`);
                return;
            }

            // 根据课程 id，查询邮箱
            const email_url = `https://jw.ustc.edu.cn/ws/course-adjustment-apply/get-teacher-info?lessonId=${course_id}`;
            const email_res = await $.ajax({ url: email_url });

            email_res.forEach((object) => {
                if (object[teacher]) {
                    console.log(object[teacher]);
                    alert(object[teacher]);
                }
            });

        }

        getTeacherEmail(teacherName);
    }
    btn.id = "teacher-email";
    btn.innerHTML = " 邮箱 ";
    title.appendChild(li);
    li.appendChild(btn);

    let space = document.getElementsByClassName("toolbarView nav navbar-nav ")[0];
    space.style.width = "65%";
});