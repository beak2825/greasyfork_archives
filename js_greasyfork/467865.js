// ==UserScript==
// @name         北大树洞->课程测评
// @namespace    https://guyutongxue.site/
// @version      0.1.0
// @description  给北大树洞成绩页面增加到非官方课程测评的按钮
// @author       Guyutongxue
// @license      MIT
// @match        https://treehole.pku.edu.cn/web/webscore
// @icon         https://pku-score.guyutongxue.site/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/467865/%E5%8C%97%E5%A4%A7%E6%A0%91%E6%B4%9E-%3E%E8%AF%BE%E7%A8%8B%E6%B5%8B%E8%AF%84.user.js
// @updateURL https://update.greasyfork.org/scripts/467865/%E5%8C%97%E5%A4%A7%E6%A0%91%E6%B4%9E-%3E%E8%AF%BE%E7%A8%8B%E6%B5%8B%E8%AF%84.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let operating = false;
    function addIcon() {
        if (operating) return;
        try {
            operating = true;
            const semesters = Array.from(document.querySelectorAll(".semester-block"));
            semesters.forEach((e) => {
                const semesterTitle = e.querySelector(".layout-row-middle .layout-vertical-up")?.innerText?.trim();
                const [_, year, sem] = /^(\d\d)学年 第(\d)学期$/.exec(semesterTitle) ?? [];
                const term = `20${year}-${Number(year)+1}${sem}`;
                const courses = Array.from(e.querySelectorAll(".course-row .layout-row"));
                courses.forEach((e) => {
                    if (e.querySelector(".icon-share")) return;
                    const id = e.querySelector(".layout-vertical-extra-show span")?.innerText;
                    const courseName = e.querySelector(".layout-row-middle .layout-vertical-up")?.innerText?.trim();
                    const score = e.querySelector(".layout-row-right .layout-vertical-up")?.innerText?.trim();
                    const courseDesc = e.querySelector(".layout-row-middle .layout-vertical-down")?.innerText;
                    const teacher = courseDesc ? /- (.*)（/.exec(courseDesc)[1] : void 0;

                    const target = e.querySelector(".course-badge-primary");
                    if (!target) return;
                    const params = new URLSearchParams({
                        course: id,
                        course_name: courseName,
                        term,
                        teacher,
                        score,
                        platform: 'new_web_score/treehole',
                    });
                    const url = `https://courses.pinzhixiaoyuan.com/reviews/post_external?${params}`;
                    const icon = document.createElement("span");
                    icon.classList.add("icon", "icon-share");
                    target.append(icon);
                    target.addEventListener("click", () => {
                        window.open(url, "_blank");
                    });
                    console.log(`icon added for ${courseName}.`);
                });
            });
        } finally {
            operating = false;
        }
    }
    document.addEventListener("DOMNodeInserted", function handler() {
        addIcon();
    });
})();