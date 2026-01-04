// ==UserScript==
// @name         TJ抢课辅助
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over TJ!
// @author       shiquda
// @match        https://1.tongji.edu.cn/studentElect
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tongji.edu.cn
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_notification
// @run-at       document-end
// @license      GPL-3.0 license
// @downloadURL https://update.greasyfork.org/scripts/483731/TJ%E6%8A%A2%E8%AF%BE%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/483731/TJ%E6%8A%A2%E8%AF%BE%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==

let intervalID = null;
let submitButton = null;

(function () {
    // GM_xmlhttpRequest({
    //     method: "GET",
    //     url: "https://1.tongji.edu.cn/api/electionservice/student/getRounds?projectId=1",
    //     onload: function (res) {
    //         console.log(res.responseText)
    //     }
    // }
    // )
    function setup() {
        // 创建悬浮在右侧居中的一个框，里面记录所有需要监测人数的课程
        let div = document.createElement("div");
        div.id = "qk_targets";
        div.style.position = "fixed";
        div.style.right = "0px";
        div.style.top = "50%";
        div.style.backgroundColor = "white";
        div.style.width = "200px";
        div.style.height = "300px";
        div.style.border = "1px solid black";

        document.body.appendChild(div);

        let textarea = document.createElement("textarea");
        textarea.id = "qk_tagets_input";
        textarea.style.width = "180px";
        textarea.style.height = "300px";
        textarea.placeholder = '输入课程号，一个一行'
        textarea.style.resize = "both";
        textarea.style.overflow = "auto";
        textarea.style.margin = "10px";
        div.appendChild(textarea);

        let autoElect = document.createElement('input'); // 创建一个input元素
        autoElect.type = 'checkbox'; // 设置元素的类型为checkbox
        autoElect.id = "qk_autoElect"; // 设置元素的id
        div.appendChild(autoElect); // 将元素添加到div中

        // 如果你想要为复选框添加标签，你可以像这样做：
        let label = document.createElement('label'); // 创建一个label元素
        label.htmlFor = 'qk_autoElect'; // 设置label的for属性，使其关联到复选框
        label.textContent = '！！！☠自动抢课☠！！！'; // 设置label的文本内容
        div.appendChild(label); // 将label添加到div中


        submitButton = document.createElement("button");
        submitButton.id = "qk_submit_button";
        submitButton.innerText = "开始监测";
        submitButton.style.margin = "5px";
        intervalID = null;

        submitButton.addEventListener('click', function () {
            if (submitButton.innerText === '开始监测') {
                // 开始检测, 设置定时器
                startCheck();
                intervalID = setInterval(startCheck, 3000);
                // 改变按钮文字
                submitButton.innerText = '终止监测';
            } else {
                // 终止检测, 清除定时器
                clearInterval(intervalID);
                intervalID = null;
                // 改变按钮文字
                submitButton.innerText = '开始监测';
            }
        });

        div.appendChild(submitButton);



        textarea.addEventListener('change', saveConfig)
    }

    function parseCourses() {
        let courses = document.getElementById("qk_tagets_input").value.split("\n");
        console.log(courses);
        return courses;
    }


    function refresh() {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "https://1.tongji.edu.cn/api/electionservice/student/getRounds?projectId=1", true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                console.log(xhr.responseText);
            }
        };
        xhr.send();
    }

    // 定义一个返回 Promise 的延迟函数
    function delay(time) {
        return new Promise(resolve => setTimeout(resolve, time));
    }

    // 将 startCheck 函数定义为 async 函数
    async function startCheck() {
        let coursesIds = parseCourses();
        let generalCoursesIds = coursesIds.map(course => course.slice(0, -2));
        console.log('generalCoursesIds:', generalCoursesIds);
        let courseItems = document.querySelectorAll('div.courseName') // 左侧列表的课程
        for (const item of courseItems) {
            let courseName = item.innerText;
            for (const generalCourseId of generalCoursesIds) {
                if (courseName.includes(generalCourseId)) {
                    console.log(courseName);
                    console.log(generalCourseId);
                    item.click();
                    // 在这里添加 await delay(1000);
                    await delay(1000);
                    let subCourseItems = document.querySelectorAll('td.courseName')
                    for (const subItem of subCourseItems) {
                        let subCourseName = subItem.innerText.split(" ")[0];
                        console.log(subCourseName);
                        if (coursesIds.includes(subCourseName)) {
                            console.log(coursesIds);
                            let str = subItem.parentElement.children[4].innerText;
                            console.log(str);
                            let currentNum = parseInt(str.split("/")[0]);
                            let maxNum = parseInt(str.split("/")[1]);
                            let volume = subItem.parentElement.children[3].innerText;
                            if (currentNum < maxNum || volume > 0) {
                                const Vsound = new Audio('https://blog.chrxw.com/usr/keylol/gas.mp3');
                                subItem.click();
                                GM_notification({
                                    title: '抢课通知',
                                    text: '可以抢课！',
                                    timeout: 10000,
                                    onclick: function () {
                                        window.focus();
                                        clearInterval(intervalID);
                                        intervalID = null;
                                        submitButton.innerText = '开始监测';
                                        let autoElect = document.querySelector('#qk_autoElect').checked;
                                        if (autoElect) {
                                            const btns = document.querySelectorAll('.el-button')
                                            for (const btn of btns) {
                                                if (btn.textContent === '保存课表') {
                                                    btn.click();
                                                    break;
                                                }
                                            }
                                        }
                                    }
                                });
                                Vsound.play();
                                break;
                            }
                        }
                    }
                    break;
                }
            }
        }
    }


    function saveConfig() {
        // 保存选课id配置
        let coursesIds = parseCourses();
        GM_setValue("courseIds", coursesIds);
    }

    function loadConfig() {
        // 加载选课id配置
        let coursesIds = GM_getValue("courseIds");
        document.getElementById("qk_tagets_input").value = coursesIds.join("\n");
    }

    function main() {
        setup();
        loadConfig();
    }
    main();


})();