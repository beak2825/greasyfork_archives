// ==UserScript==
// @name         YSU教室课表标色
// @version      2.0.5
// @author       Haomin Kong
// @description  燕山大学教室课表标色
// @match        */zjdxgc/mycjcx/*
// @match        http://202.206.243.9/*
// @match        http://202.206.243.9/zjdxgc/mycjcx/wjskbcx.asp
// @match        http://jwc.ysu.edu.cn/*
// @icon         http://ysu.edu.cn/images/favicon.png
// @require	     https://apps.bdimg.com/libs/jquery/2.1.4/jquery.min.js
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_openInTab
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_notification
// @grant	     GM_registerMenuCommand
// @grant	     GM_addStyle
// @license      GPL-3.0 License
// @run-at       document-end
// @namespace    https://gitee.com/yskoala/ysu-web-browser-scripts
// @homepage       https://gitee.com/yskoala/ysu-web-browser-scripts
// @downloadURL https://update.greasyfork.org/scripts/425287/YSU%E6%95%99%E5%AE%A4%E8%AF%BE%E8%A1%A8%E6%A0%87%E8%89%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/425287/YSU%E6%95%99%E5%AE%A4%E8%AF%BE%E8%A1%A8%E6%A0%87%E8%89%B2.meta.js
// ==/UserScript==

(function () {
        ("use strict");

        let done = false

        const cookies_name = "YSUKHMJSCOLOR"

        GM_registerMenuCommand("更新脚本", function () {
            window.location.href = "https://gitee.com/yskoala/ysu-web-browser-scripts";
        });

        let week = 1;

        let mainTable = null;

        let sel1;

        let CourseCount = 0;

        let CurrentConfig = {
            auto: true, //自动执行脚本
            week: 0, //自定义周数,0就是自动获取

            del_form: true, //删除没课

            del_old: true, //删除已经结课的课程
            del_future: false, //删除还未开课的课程
            del_form_weekend: true, //如果周末没课，那就删除整列(主要是给大三大四设计，没错，就是我自己)
            del_form_night: true, //如果晚上没课，那就删除整列(主要是给大三大四设计，没错，就是我自己)

            show_this_week: true,//打印窗口显示第一行

            colornow: true, //标色当前周
            color_now_font: false, //标色当前周
            colorfuture: true, //标色未来周
            color_future_font: false, //标色未来周
            delnow: false, //删除当前周
            delfuture: false, //删除未来周

            ignore_lend: false, //忽略借教室(这么多我调试都不方便，烦死了！)
            ignore_self_learn: true, //忽略自习借教室
            ignore_tuan_ri: false,//忽略团日
            ignore_ping_xuan: false,//忽略评选
            ignore_shuang_xuan_hui: false,//忽略双选会
            ignore_zhao_pin: false,//忽略招聘
            ignore_xue_sheng_hui: false,//忽略学生会
            ignore_class: false,//忽略班会
            ignore_exam: false,//忽略考试

            delignore: true, //删除上述忽略的
            del_ignore_course: true, //删除上述忽略的课程
            //下面是保存上次的选择
            save_last_select: false,//是否要恢复
            last_building: -1,//教学楼
            last_room: -1,//教室
        };
        let DefaultConfig = {
            auto: true, //自动执行脚本
            week: 0, //自定义周数,0就是自动获取

            del_form: true, //删除没课

            del_old: true, //删除已经结课的课程
            del_future: false, //删除还未开课的课程
            del_form_weekend: true, //如果周末没课，那就删除整列(主要是给大三大四设计，没错，就是我自己)
            del_form_night: true, //如果晚上没课，那就删除整列(主要是给大三大四设计，没错，就是我自己)

            show_this_week: true,//打印窗口显示第一行

            colornow: true, //标色当前周
            color_now_font: false, //标色当前周
            colorfuture: true, //标色未来周
            color_future_font: false, //标色未来周
            delnow: false, //删除当前周
            delfuture: false, //删除未来周

            ignore_lend: false, //忽略借教室(这么多我调试都不方便，烦死了！)
            ignore_self_learn: true, //忽略自习借教室
            ignore_tuan_ri: false,//忽略团日
            ignore_ping_xuan: false,//忽略评选
            ignore_shuang_xuan_hui: false,//忽略双选会
            ignore_zhao_pin: false,//忽略招聘
            ignore_xue_sheng_hui: false,//忽略学生会
            ignore_class: false,//忽略班会
            ignore_exam: false,//忽略考试

            delignore: true, //删除上述忽略的
            del_ignore_course: true, //删除上述忽略的课程
            //下面是保存上次的选择
            save_last_select: false,//是否要恢复
            last_building: -1,//教学楼
            last_room: -1,//教室
        };

        function UpdateSettings() {
            let settingString = JSON.stringify(CurrentConfig).trim();
            //GM_setValue("YSUJWConfig", settingString);
            setCookie(cookies_name, settingString);
        }

        function getSettings() {
            let data = getCookie(cookies_name);
            console.log(data)
            if (data !== undefined && data !== null) {
                if (data.trim().length !== 0) {
                    try {
                        CurrentConfig = JSON.parse(data);
                    } catch (e) {
                        CurrentConfig = DefaultConfig;
                    }
                } else {
                    console.log("cookies have error,length is 0")
                    CurrentConfig = DefaultConfig;
                }
            } else {
                console.log("cookies have error")
                CurrentConfig = DefaultConfig;
            }

            // 填充没有的配置
            for (let key in DefaultConfig) {
                if (typeof CurrentConfig[key] == "undefined") {
                    CurrentConfig[key] = DefaultConfig[key];
                }
            }
        }

        function DoJob() {
            //自动恢复上次的选择
            sel1 = document.getElementsByTagName("select");
            if (CurrentConfig.save_last_select) {
                if (CurrentConfig.last_building >= sel1[0].length ||
                    CurrentConfig.last_room >= sel1[1].length) {
                    CurrentConfig.last_building = 0;
                    CurrentConfig.last_room = 0;
                    CurrentConfig.save_last_select = false;
                    UpdateSettings();
                } else if (CurrentConfig.last_building !== sel1[0].selectedIndex ||
                    CurrentConfig.last_room !== sel1[1].selectedIndex) {
                    sel1[0].selectedIndex = CurrentConfig.last_building;
                    sel1[1].selectedIndex = CurrentConfig.last_room;

                    document.getElementsByName("Submit")[0].click()
                }
            }

            let weekText = /本周为第[0-9]+周周[0-9]/.exec(
                document.getElementsByTagName("body")[0].textContent
            );
            if (weekText != null) {
                weekText = weekText[0]
                weekText = /第[0-9]+周/.exec(weekText);
                week = parseInt(/[0-9]+/.exec(weekText)[0]);
                let as = document.getElementsByTagName("table");
                for (let i = 0, j = as.length; i < j; ++i) {
                    let tableObj = as[i];

                    if (tableObj.rows.length >= 8) {
                        mainTable = tableObj;
                        tableObj.setAttribute("id", "maintable");
                        tableObj.setAttribute("border", "0.5");
                        TraverseTable(tableObj);
                    }
                }
            } else {
                document.getElementsByName("Submit")[0].click()
            }

        }

        function TraverseTable(tableObj) {
            CourseCount = 0;

            //删除空行
            let tbody = tableObj.children[0];
            for (let i = 0, j = tbody.children.length; i < j; ++i) {
                if (typeof tbody.children[i] !== "undefined" &&
                    tbody.children[i].innerText.trim().length === 0) {
                    tbody.removeChild(tbody.children[i]);
                    --i;
                }
            }

            for (let i = 0, i1 = tableObj.rows.length; i < i1 && i1 >= 8; i++) {
                for (let j = 0, j1 = tableObj.rows[i].cells.length; j < j1; j++) {
                    // 遍历每一个单元格
                    re(tableObj.rows[i].cells[j]);
                }
            }

            let removeInfo = RemoveNightAndWeekend(tableObj)

            let weekInfoForm = tableObj.rows[0].cells[0];

            let lab1 = document.createElement("strong");
            lab1.innerText = "  当前周总共有 ";
            let lab2 = document.createElement("font");
            lab2.innerText = CourseCount + '';
            lab2.setAttribute("color", "#FF0000")
            let lab3 = document.createElement("strong");
            lab3.innerText = " 节课";

            weekInfoForm.appendChild(lab1);
            lab1.appendChild(lab2);
            lab1.appendChild(lab3);


            let lab_night = document.createElement("strong");
            let lab_night1 = document.createElement("font");
            if (removeInfo[0] === 0) {
                lab_night.innerText = "  晚上 ";
                lab_night1.innerText = "!没课!" + '';
                lab_night1.setAttribute("color", "#FF0000")
            } else {
                lab_night.innerText = "  晚上共有 ";
                lab_night1.innerText = removeInfo[0] + '';
                lab_night1.setAttribute("color", "#FF0000")
                let lab_night2 = document.createElement("strong");
                lab_night2.innerText = " 节课";

                lab_night1.appendChild(lab_night2);
            }
            weekInfoForm.appendChild(lab_night);
            lab_night.appendChild(lab_night1);


            let lab_week = document.createElement("strong");
            let lab_week1 = document.createElement("font");
            if (removeInfo[1] === 0) {
                lab_week.innerText = "  周末 ";
                lab_week1.innerText = "!没课!" + '';
                lab_week1.setAttribute("color", "#FF0000")
            } else {
                lab_week.innerText = "  周末共有 ";
                lab_week1.innerText = removeInfo[1] + '';
                lab_week1.setAttribute("color", "#FF0000")
                let lab_week2 = document.createElement("strong");
                lab_week2.innerText = " 节课";
                lab_week1.appendChild(lab_week2);
            }

            weekInfoForm.appendChild(lab_week);
            lab_week.appendChild(lab_week1);
        }

        function bool2Text(boolType) {
            return boolType ? "有" : "无";
        }

        function RemoveNightAndWeekend(tableObj) {

            ////////////////晚课监测
            //两行都没有才删除
            let count1 = 0;
            let tbody = tableObj.children[0];

            for (let i = 0, i1 = tableObj.rows.length; i < i1; i++) {
                let first = tableObj.rows[i].cells[0].textContent.trim();
                if (first !== "9-10节" && first !== "11-12节") {
                    continue;
                }

                for (let j = 1, j1 = tableObj.rows[i].cells.length; j < j1; j++) {
                    // 遍历每一个单元格
                    let text = tableObj.rows[i].cells[j].textContent.trim();
                    if (text != null && text.length !== 0) {
                        count1++;
                    }
                }
            }

            console.log("count1")
            console.log(count1)

            for (let i = 0, i1 = tableObj.rows.length,
                     condition = ((count1 === 0) && CurrentConfig.del_form_night);
                 i < i1 && condition; i++) {
                let line = tableObj.rows[i];
                if (line == null) {
                    continue;
                }
                let first = line.cells[0].textContent.trim();
                if (first !== "9-10节" && first !== "11-12节") {
                    continue;
                }

                //删除空行

                tbody.removeChild(tbody.children[i]);
                i--;
            }


            /////////////双休日监测
            let count2 = 0;
            for (let i = 2, i1 = tableObj.rows.length; i < i1; i++) {
                for (let j = 6, j1 = tableObj.rows[i].cells.length; j < j1; j++) {
                    let first = tableObj.rows[1].cells[j].textContent.trim();
                    if (first !== "星期6" && first !== "星期7") {
                        continue;
                    }

                    // 遍历每一个单元格
                    let text = tableObj.rows[i].cells[j].textContent.trim();
                    if (text != null && text.length !== 0) {
                        count2++;
                    }
                }
            }

            console.log("count2")
            console.log(count2)

            for (let j = tableObj.rows[1].cells.length,
                     condition = ((count2 === 0) && CurrentConfig.del_form_weekend);
                 j >= 5 && condition; j--) {
                // console.log("j=" + j.toString())
                let cell = tableObj.rows[1].cells[j];
                if (cell == null) {
                    continue;
                }
                let first = cell.textContent.trim();
                if (first !== "星期6" && first !== "星期7") {
                    console.log("j=" + j.toString() + ",text=" + first)
                    continue;
                }
                for (let i = 1, i1 = tableObj.rows.length;
                     i < i1 && condition; i++) {
                    // console.log("i=" + i.toString())
                    tableObj.rows[i].cells[j].remove();
                }
            }

            return [count1, count2]
        }

        function re(td) {
            let text = td.innerText.trim();
            let regExp = /[0-9]+-[0-9]+周/g;
            if (!regExp.test(text)) {
                return;
            }
            let courseSplit = text.split("\n\n");
            let now = week;
            if (CurrentConfig.week > 0) {
                now = CurrentConfig.week;
            }
            //now = 10;

            let state = 0;

            let vaildCourse = false;

            let courseText = ""

            for (let i = 0, j = courseSplit.length; i < j; i++) {
                let current = courseSplit[i].trim();
                // console.log(current);
                // console.log(current.indexOf("考试") !== -1);
                //type:1正常上课 2考试 3借用
                let type = 0;


                if (current.indexOf("正常上课") !== -1) {
                    type = 1;
                } else if (current.indexOf("考试") !== -1) {
                    type = 2;
                } else if (current.indexOf("借用") !== -1) {
                    type = 3;
                }

                let oneLineText = current;
                while (oneLineText.indexOf("\n") !== -1) {
                    oneLineText = oneLineText.replace("\n", "");
                }
                let match = /[0-9]+-[0-9]+周/g.exec(oneLineText);
                match = /[0-9]+-[0-9]+/.exec(match[0].trim())[0].trim();
                let l = match.split("-");
                if (l.length === 2) {
                    let start = parseInt(l[0]);
                    let end = parseInt(l[1]);


                    //这里包括了未开课和还在上的情况
                    if ((type === 3 && now <= end) && (
                            CurrentConfig.ignore_lend ||
                            (CurrentConfig.ignore_self_learn && current.indexOf("自习") !== -1) ||
                            (CurrentConfig.ignore_tuan_ri &&
                                (current.indexOf("团日") !== -1 ||
                                    current.indexOf("团课") !== -1 ||
                                    current.indexOf("团活") !== -1)) ||
                            (CurrentConfig.ignore_ping_xuan && current.indexOf("评选") !== -1) ||
                            (CurrentConfig.ignore_shuang_xuan_hui && current.indexOf("双选会") !== -1) ||
                            (CurrentConfig.ignore_zhao_pin && current.indexOf("招聘") !== -1) ||
                            (CurrentConfig.ignore_class && current.indexOf("班会") !== -1) ||
                            (CurrentConfig.ignore_xue_sheng_hui && current.indexOf("学生会") !== -1)
                        ) ||
                        (CurrentConfig.ignore_exam && type === 2)
                    ) {
                        if (!CurrentConfig.del_ignore_course) {
                            vaildCourse = true;
                        }
                    } else {
                        if (start <= now && now <= end) {
                            //还在上
                            state = 1;
                            ++CourseCount;
                        } else if (now < start && state !== 1) {
                            //未开课
                            state = 2;
                        }

                        vaildCourse = !(
                            (end < now && CurrentConfig.del_old)
                            || (start > now && CurrentConfig.del_future)
                        )


                    }

                    if (vaildCourse) {
                        if (courseText.length === 0) {
                            courseText = courseSplit[i]
                        } else {
                            courseText += "\n\n" + courseSplit[i]
                        }
                    }

                }


            }

            td.innerText = courseText;
            td.align = "center"

            if (courseSplit.length !== 0) {
                if (state === 1) {
                    if (CurrentConfig.colornow) {
                        td.bgColor = "FFFFBB";
                    }
                    if (CurrentConfig.color_now_font) {
                        td.style.color = "red"
                    }
                    if (CurrentConfig.delnow) {
                        td.textContent = "";
                    }
                } else if (state === 2) {
                    if (CurrentConfig.colorfuture) {
                        td.bgColor = "FFDDDD";
                    }
                    if (CurrentConfig.color_future_font) {
                        td.style.color = "blue"
                    }
                    if (CurrentConfig.delfuture) {
                        td.textContent = "";
                    }
                } else {
                    td.bgColor = "FFFFFF";

                    if (CurrentConfig.del_form) {
                        td.textContent = "";
                    }
                }
            }
        }

        function newCheckbox(parent, title, checked, change_listener, before_line, after_line) {
            let cb = document.createElement("input");
            cb.type = "checkbox";
            cb.checked = checked;
            if (change_listener != null) {
                cb.addEventListener("change", change_listener);
            }

            parent.appendChild(cb);

            for (let i = 0; i < after_line; ++i) {
                cb.insertAdjacentHTML("afterend", "<br />");
            }
            cb.insertAdjacentText("afterend", title);

            for (let i = 0; i < before_line; ++i) {
                cb.insertAdjacentHTML("beforebegin", "<br />");
            }
            return cb;
        }

        function newButton(parent, title, click_listener, before_line, after_line) {
            let btn = document.createElement("Button");
            btn.addEventListener("click", click_listener);
            btn.innerText = title;
            parent.appendChild(btn);
            for (let i = 0; i < before_line; ++i) {
                btn.insertAdjacentHTML("beforebegin", "<br />");
            }
            for (let i = 0; i < after_line; ++i) {
                btn.insertAdjacentHTML("afterend", "<br />");
            }
            return btn;
        }

        function addLink() {
            let submit = document.getElementsByName("Submit")[0];
            let parent1 = submit.parentNode;
            let parent2 = submit.parentNode.parentNode.childNodes[1];

            submit.insertAdjacentHTML("afterend", "<br />");

            newCheckbox(parent1, "自动恢复保存的选择", CurrentConfig.save_last_select,
                function (e) {
                    CurrentConfig.save_last_select = e.target.checked;

                    CurrentConfig.last_building = sel1[0].selectedIndex;
                    CurrentConfig.last_room = sel1[1].selectedIndex;

                    UpdateSettings();
                }, 3, 0);

            newButton(parent1, "保存当前的选择",
                function () {

                    CurrentConfig.last_building = sel1[0].selectedIndex;
                    CurrentConfig.last_room = sel1[1].selectedIndex;

                    UpdateSettings();
                }, 0, 1);


            newCheckbox(parent1, "自动执行脚本", CurrentConfig.auto,
                function (e) {
                    CurrentConfig.auto = e.target.checked;
                    UpdateSettings();
                }, 1, 0);

            newCheckbox(parent1, "自动删除没课的格子", CurrentConfig.del_form,
                function (e) {
                    CurrentConfig.del_form = e.target.checked;
                    UpdateSettings();
                }, 1, 2);

            newCheckbox(parent1, "自动删除已经结束的课程", CurrentConfig.del_old,
                function (e) {
                    CurrentConfig.del_old = e.target.checked;
                    UpdateSettings();
                }, 0, 1);

            newCheckbox(parent1, "自动删除还未开始的课程", CurrentConfig.del_future,
                function (e) {
                    CurrentConfig.del_future = e.target.checked;
                    UpdateSettings();
                }, 0, 1);

            newCheckbox(parent1, "若晚上没课则自动删除晚上两行", CurrentConfig.del_form_night,
                function (e) {
                    CurrentConfig.del_form_night = e.target.checked;
                    UpdateSettings();
                }, 1, 0);
            newCheckbox(parent1, "若周末没课则自动删除周末两列", CurrentConfig.del_form_weekend,
                function (e) {
                    CurrentConfig.del_form_weekend = e.target.checked;
                    UpdateSettings();
                }, 1, 2);

            newCheckbox(parent1, "忽略考试", CurrentConfig.ignore_exam,
                function (e) {
                    CurrentConfig.ignore_exam = e.target.checked;
                    UpdateSettings();
                }, 1, 0);

            newCheckbox(parent1, "忽略所有借教室(调试太麻烦了)", CurrentConfig.ignore_lend,
                function (e) {
                    CurrentConfig.ignore_lend = e.target.checked;
                    UpdateSettings();
                }, 1, 0);

            newCheckbox(parent1, "忽略借教室自习(这真没意思！！！)", CurrentConfig.ignore_self_learn,
                function (e) {
                    CurrentConfig.ignore_self_learn = e.target.checked;
                    UpdateSettings();
                }, 1, 0);


            newCheckbox(parent1, "忽略团日/团课活动", CurrentConfig.ignore_tuan_ri, function (e) {
                CurrentConfig.ignore_tuan_ri = e.target.checked;
                UpdateSettings();
            }, 1, 0);

            newCheckbox(parent1, "忽略评选", CurrentConfig.ignore_ping_xuan,
                function (e) {
                    CurrentConfig.ignore_ping_xuan = e.target.checked;
                    UpdateSettings();
                }, 1, 0);
            newCheckbox(parent1, "忽略招聘", CurrentConfig.ignore_zhao_pin,
                function (e) {
                    CurrentConfig.ignore_zhao_pin = e.target.checked;
                    UpdateSettings();
                }, 1, 0);
            newCheckbox(parent1, "忽略双选会", CurrentConfig.ignore_shuang_xuan_hui,
                function (e) {
                    CurrentConfig.ignore_shuang_xuan_hui = e.target.checked;
                    UpdateSettings();
                }, 1, 0);
            newCheckbox(parent1, "忽略学生会", CurrentConfig.ignore_xue_sheng_hui,
                function (e) {
                    CurrentConfig.ignore_xue_sheng_hui = e.target.checked;
                    UpdateSettings();
                }, 1, 0);
            newCheckbox(parent1, "忽略班会", CurrentConfig.ignore_class,
                function (e) {
                    CurrentConfig.ignore_class = e.target.checked;
                    UpdateSettings();
                }, 1, 0);

            newCheckbox(parent1, "自动删除上述忽略的课程", CurrentConfig.del_ignore_course,
                function (e) {
                    CurrentConfig.del_ignore_course = e.target.checked;
                    UpdateSettings();
                }, 1, 0);


            if (!CurrentConfig.auto) {
                newButton(parent1, "执行脚本",
                    function () {
                        DoJob();
                    }, 1, 1);
            }

            //第二个格子

            let keyValue = "Ctrl + P";
            if (isMac()) {
                keyValue = "Command + P";
            }
            let printBtn = newButton(parent2, "简化元素(按" + keyValue + "打印)",
                function () {
                    if (mainTable != null) {
                        let newWindow = window.open("", "print_win",
                            "toolbar = no, scrollbars = yes, menubar = no,location = no");
                        var htmlToPrint = '' +
                            '<style type="text/css">' +
                            'table th, table td {' +
                            'border:1px solid #000;' +
                            // 'padding:0.5em;' +
                            '}' +
                            '</style>';
                        newWindow.document.body.innerHTML = htmlToPrint + mainTable.outerHTML;
                        // newWindow.document.write(mainTable.outerHTML);

                        let room = sel1[1].options[sel1[1].selectedIndex].text;
                        newWindow.document.title = room.trim() + " 课程表(请按" + keyValue + "进行打印)";

                        let as = newWindow.document.getElementsByTagName("table");
                        let tableObj = as[0];
                        let tbody = tableObj.children[0];

                        if (CurrentConfig.show_this_week) {
                            let lab1 = document.createElement("a");
                            lab1.innerText = "点我打印 (By:孔昊旻)";
                            lab1.setAttribute("color", "#FF0000")
                            lab1.setAttribute("href",
                                "javascript:window.print();");


                            // lab1.addEventListener("click", function () {
                            //     window.print();
                            // });

                            tbody.children[0].children[0].appendChild(lab1);
                        } else {
                            tbody.removeChild(tbody.children[0])
                        }
                    }

                }, 0, 0);
            printBtn.insertAdjacentHTML("beforebegin", "打印相关：<br />");

            newCheckbox(parent2, "是否显示当前周数(第一行)", CurrentConfig.show_this_week,
                function (e) {
                    CurrentConfig.show_this_week = e.target.checked;
                    UpdateSettings();
                }, 0, 1);

            newCheckbox(parent2, "当前周有课的文字着色", CurrentConfig.color_now_font,
                function (e) {
                    CurrentConfig.color_now_font = e.target.checked;
                    UpdateSettings();
                }, 1, 0);
            newCheckbox(parent2, "未来周有课的文字着色", CurrentConfig.color_future_font,
                function (e) {
                    CurrentConfig.color_future_font = e.target.checked;
                    UpdateSettings();
                }, 0, 2);

            let text1 = document.createElement("input");
            text1.id = "text_week";
            text1.type = "number";
            text1.max = 20;
            text1.min = 0;
            text1.value = CurrentConfig.week.toString();
            parent2.appendChild(text1);
            text1.insertAdjacentText("afterend", "周(0为自动获取)");
            text1.insertAdjacentHTML("beforebegin", "<br />");
            text1.insertAdjacentHTML("beforebegin", "设置当前周数：");

            newButton(parent2, "保存",
                function () {
                    CurrentConfig.week = parseInt(text1.value);
                    UpdateSettings();
                }, 0, 1);


            newCheckbox(parent2, "标色当前周有课", CurrentConfig.colornow,
                function (e) {
                    CurrentConfig.colornow = e.target.checked;
                    UpdateSettings();
                }, 1, 0);

            newCheckbox(parent2, "删除当前周有课", CurrentConfig.delnow,
                function (e) {
                    CurrentConfig.delnow = e.target.checked;
                    UpdateSettings();
                }, 0, 0).insertAdjacentHTML("beforebegin", "&nbsp;&nbsp;");

            newCheckbox(parent2, "标色未来周有课", CurrentConfig.colorfuture,
                function (e) {
                    CurrentConfig.colorfuture = e.target.checked;
                    UpdateSettings();
                }, 1, 0);

            newCheckbox(parent2, "删除未来周有课", CurrentConfig.delfuture,
                function (e) {
                    CurrentConfig.delfuture = e.target.checked;
                    UpdateSettings();
                }, 0, 1).insertAdjacentHTML("beforebegin", "&nbsp;&nbsp;");


            newButton(parent2, "刷新页面",
                function () {
                    location.reload();
                }, 1, 0)

            newButton(parent2, "重新从教务处网站进入本页面",
                function () {
                    window.location.href = "http://jwc.ysu.edu.cn/?action=jskb";
                }, 1, 0).insertAdjacentHTML("afterend", "刷新页面并不能刷新新周数");


            newButton(parent2, "进入教务系统62",
                function () {
                    window.location.href = "http://jwc.ysu.edu.cn/?action=jwxt62";
                }, 2, 0)

            newButton(parent2, "进入教务系统6(校内)",
                function () {
                    window.location.href = "http://jwc.ysu.edu.cn/?action=jwxt9";
                }, 0, 0)

            newButton(parent2, "进入教务系统9(校内)",
                function () {
                    window.location.href = "http://jwc.ysu.edu.cn/?action=jwxt9";
                }, 0, 0)

            newButton(parent2, "恢复默认设置",
                function () {
                    CurrentConfig = DefaultConfig;
                    UpdateSettings();
                    location.reload();
                }, 4, 2)

            newButton(parent2, "更新脚本",
                function () {
                    window.location.href = 'https://gitee.com/yskoala/ysu-web-browser-scripts';
                }, 2, 0)

            let myVersion = GM_info.script.version;
            console.log('Version: ', myVersion);

            let lab1 = document.createElement("a");
            lab1.innerText = " 脚本版本：" + myVersion;
            lab1.setAttribute("href", "https://gitee.com/a645162");

            parent2.appendChild(lab1);

            let lab2 = document.createElement("a");
            lab2.innerText = " 脚本作者：孔昊旻";
            lab2.setAttribute("href", "https://gitee.com/a645162");

            parent2.appendChild(lab2);
        }

        function isMac() {
            let reg_mac = new RegExp("mac", 'i');
            return navigator.platform.match(reg_mac) !== null;
        }

        //JS操作cookies方法!
        //写cookies
        function setCookie(name, value) {
            // let Days = 30;
            // let exp = new Date();
            // exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
            document.cookie =
                name + "=" + escape(value) + ";"
            // ""expires=" + exp.toGMTString();
            //alert(value)
            console.log(value)
        }

        //读取cookies
        function getCookie(name) {
            let arr,
                reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
            if ((arr = document.cookie.match(reg))) return unescape(arr[2]);
            // else return "";
            else return null;
        }

        //删除cookies
        function delCookie(name) {
            let exp = new Date();
            exp.setTime(exp.getTime() - 1);
            let cval = getCookie(name);
            if (cval != null)
                document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
        }


        const changeFavicon = link => {
            let $favicon = document.querySelector('link[rel="icon"]');
            // If a <link rel="icon"> element already exists,
            // change its href to the given link.
            if ($favicon !== null) {
                $favicon.href = link;
                // Otherwise, create a new element and append it to <head>.
            } else {
                $favicon = document.createElement("link");
                $favicon.rel = "icon";
                $favicon.href = link;
                document.head.appendChild($favicon);
            }
        };


        //DoJob();
        //addLink();
        function LoadJS() {
            getSettings();

            done = true

            let link = window.location.href.trim();
            // alert(link)
            if (link.indexOf("jwc.ysu.edu.cn") !== -1) {
                let regexStr = /\?action=.*/;
                if (regexStr.test(link)) {
                    let command = regexStr.exec(link)[0].trim()
                    if (/=jskb/.test(command)) {
                        window.location.href = "http://202.206.243.9/zjdxgc/mycjcx/wjskbcx.asp";
                    } else if (/=jwxt/.test(command)) {
                        const url_jwct = "http://202.206.243.";
                        let num = /[0-9]+/.exec(/=jwxt.*/.exec(link)[0])
                        window.location.href = url_jwct.trim() + num;
                    }
                }
            } else {
                if (CurrentConfig.auto) {
                    DoJob();
                }
                addLink();
            }
        }

        changeFavicon("http://ysu.edu.cn/images/favicon.png");

        LoadJS();

        window.onload = function () {

            if (!done) {
                LoadJS()
            }

        }

    }

)();
