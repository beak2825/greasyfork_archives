// ==UserScript==
// @name         Fudan New XK Display Count
// @namespace    http://tampermonkey.net/
// @version      2025-05-15-2
// @description  Display the number of students selected for each course in the Fudan University "NEW" course selection system.
// @author       Sam Tong
// @match        https://xk.fudan.edu.cn/course-selection/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536080/Fudan%20New%20XK%20Display%20Count.user.js
// @updateURL https://update.greasyfork.org/scripts/536080/Fudan%20New%20XK%20Display%20Count.meta.js
// ==/UserScript==

(function () {
    "use strict";
    let coursedata = [];
    let last_dom_data = null;
    function addXMLRequestCallback(callback) {
        var oldSend, i;
        if (XMLHttpRequest.callbacks) {
            XMLHttpRequest.callbacks.push(callback);
        } else {
            XMLHttpRequest.callbacks = [callback];
            oldSend = XMLHttpRequest.prototype.send;
            XMLHttpRequest.prototype.send = function () {
                for (i = 0; i < XMLHttpRequest.callbacks.length; i++) {
                    XMLHttpRequest.callbacks[i](this);
                }
                oldSend.apply(this, arguments);
            };
        }
    }
    function waitForElm(selector) {
        return new Promise((resolve) => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }

            const observer = new MutationObserver((mutations) => {
                if (document.querySelector(selector)) {
                    observer.disconnect();
                    resolve(document.querySelector(selector));
                }
            });
            observer.observe(document.body, {
                childList: true,
                subtree: true,
            });
        });
    }
    function addCounttoDOMS2(courseCount) {
        const courses = coursedata;
        if (coursedata.length === 0) {
            return;
        }
        for (let i = 0; i < courseCount.length; i++) {
            const courseTD = courseCount[i];
            try {
                const courseID =
                    courseTD.firstChild.firstChild.firstChild.innerText;
                const course = courses.find(
                    (course) => course.code === courseID
                );
                const injected_elem =
                    courseTD.querySelectorAll(".injected_elem");
                for (let j = 0; j < injected_elem.length; j++) {
                    injected_elem[j].remove();
                }
                const div = document.createElement("div");
                div.className = "injected_elem";
                const text = document.createTextNode(
                    `${course.count}/${course.maxCount}`
                );
                div.appendChild(text);
                div.style.padding = "0px 10px 0px 10px";
                const progressBar = document.createElement("div");
                progressBar.className = "el-progress-bar__outer";
                progressBar.style.height = "6px";
                progressBar.style.width = "100%";
                progressBar.style.boxSizing = "border-box";
                progressBar.style.backgroundColor = "rgb(235, 238, 245)";
                const progressBarInner = document.createElement("div");
                progressBarInner.className = "el-progress-bar__inner";
                if (course.count > course.maxCount) {
                    progressBarInner.style.backgroundColor =
                        "rgb(255, 107, 107)";
                    progressBarInner.style.width = `100%`;
                } else {
                    progressBarInner.style.backgroundColor = "rgb(6, 86, 139)";
                    progressBarInner.style.width = `${
                        (course.count / course.maxCount) * 100
                    }%`;
                }

                progressBarInner.appendChild(document.createTextNode(""));
                progressBar.appendChild(progressBarInner);
                div.appendChild(progressBar);

                courseTD.appendChild(div);
            } catch (error) {}
        }
    }
    function addCounttoDOM(courses) {
        const courseCount = document.querySelectorAll(".el-table_1_column_4");
        if (courseCount.length === 0) {
            waitForElm(".el-table_1_column_4").then((elm) => {
                const courseCount = document.querySelectorAll(
                    ".el-table_1_column_4"
                );
                addCounttoDOMS2(courseCount);
            });
        } else {
            addCounttoDOMS2(courseCount);
        }
    }
    async function getCourseSelectedCount(courses) {
        const lessonIds = courses.map((course) => course.id).join(",");
        const url = `https://xk.fudan.edu.cn/api/v1/student/course-select/std-count?lessonIds=${lessonIds}`;
        const headers = {
            Authorization: `${
                document.cookie
                    .split("; ")
                    .find((row) =>
                        row.startsWith("cs-course-select-student-token=")
                    )
                    .split("=")[1]
            }`,
        };
        await fetch(url, {
            method: "GET",
            headers: headers,
        })
            .then((response) => response.json())
            .then((data) => {
                const courseCount = data.data;
                for (const course of courses) {
                    const count = parseInt(
                        courseCount[course.id].split("-")[0]
                    );
                    course.count = count;
                }
            });
        coursedata = courses;
        addCounttoDOM(courses);
    } //bar
    function getCourseIDs(responseBody) {
        try {
            const data = JSON.parse(responseBody);
            const courses = data.data;
            const courseReify = [];
            for (const course of courses) {
                if (course.id) {
                    courseReify.push({
                        id: course.id,
                        code: course.code,
                        maxCount: course.limitCount,
                    });
                }
            }
            getCourseSelectedCount(courseReify);
        } catch (error) {
            console.error("Failed to parse response body:", error);
            return [];
        }
    }

    addXMLRequestCallback(function (xhr) {
        xhr.addEventListener("load", function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                if (
                    xhr.responseURL.startsWith(
                        "https://xk.fudan.edu.cn/api/v1/student/course-select/selected-lessons"
                    )
                ) {
                    getCourseIDs(xhr.responseText);
                }
            }
        });
    });
    waitForElm(".el-tabs__nav-scroll").then((elm) => {
        const targetNode = document.querySelectorAll(".el-tabs__nav-scroll");
        for (const element of targetNode) {
            element.addEventListener("click", function () {
                const courseCount = document.querySelectorAll(
                    ".el-table_1_column_4"
                );
                if (courseCount.length > 0) {
                    addCounttoDOMS2(courseCount);
                }
            });
        }
    });
    waitForElm(".caret-wrapper").then((elm) => {
        setTimeout(() => {
            const targetNode2 = document.querySelectorAll(".caret-wrapper");
            for (const element of targetNode2) {
                element.addEventListener("click", function () {
                    setTimeout(() => {
                        const courseCount = document.querySelectorAll(
                            ".el-table_1_column_4"
                        );
                        if (courseCount.length > 0) {
                            addCounttoDOMS2(courseCount);
                        }
                    }, 50);
                });
            }
        }, 1000);
    });
    waitForElm(".cell").then((elm) => {
        setTimeout(() => {
            const targetNode2 = document.querySelectorAll(".cell");
            for (const element of targetNode2) {
                element.addEventListener("click", function () {
                    setTimeout(() => {
                        const courseCount = document.querySelectorAll(
                            ".el-table_1_column_4"
                        );
                        if (courseCount.length > 0) {
                            addCounttoDOMS2(courseCount);
                        }
                    }, 50);
                });
            }
        }, 1000);
    });
})();
