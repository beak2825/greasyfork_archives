// ==UserScript==
// @name         黑龙江中医药大学自动学生评价
// @namespace    https://github.com/Ohdmire
// @version      1.3
// @description  教务系统自动评价
// @author       Ohdmire
// @match        http://*.jwc.hljucm.net/jsxsd/xspj/xspj_list.do*
// @match        http://*.jwc.hljucm.net/jsxsd/xspj/xspj_edit.do*
// @match        http://jwc.hljucm.net/jsxsd/framework/xsMain.jsp
// @grant        none
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/540474/%E9%BB%91%E9%BE%99%E6%B1%9F%E4%B8%AD%E5%8C%BB%E8%8D%AF%E5%A4%A7%E5%AD%A6%E8%87%AA%E5%8A%A8%E5%AD%A6%E7%94%9F%E8%AF%84%E4%BB%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/540474/%E9%BB%91%E9%BE%99%E6%B1%9F%E4%B8%AD%E5%8C%BB%E8%8D%AF%E5%A4%A7%E5%AD%A6%E8%87%AA%E5%8A%A8%E5%AD%A6%E7%94%9F%E8%AF%84%E4%BB%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function elementExists(selector) {
        return document.querySelector(selector) !== null;
    }

    function handleListPage() {
        let list = document.links;
        let foundEvaluation = false;

        for (let i = 0; i < list.length; i++) {
            if (list[i].text == "评价") {
                console.log("进入评价页面");
                console.log(list[i].href);
                window.location.href = list[i].href;
                foundEvaluation = true;
                return; // 已经跳转
            }
        }

        if (!foundEvaluation) {
            // 没有评价，检查有没有 "查看" + 下一页按钮
            let needNextPage = false;

            for (let i = 0; i < list.length; i++) {
                if (list[i].text == "查看") {
                    let nextPageBtn = document.getElementById("PagingControl1_btnNextPage");

                    if (nextPageBtn && nextPageBtn.disabled !== true && nextPageBtn.getAttribute("disabled") !== "disabled") {
                        console.log("点击下一页...");
                        nextPageBtn.click();
                        needNextPage = true;
                        break;
                    } else {
                        console.log("没有更多分页，或者按钮不可点击");
                    }
                }
            }

            if (needNextPage) {
                // 等待新页面加载后再次执行
                setTimeout(handleListPage, 1000);
            }
        }
    }

    function handleEditPage() {
        if (!elementExists("#qx")) return;

        console.log("正在自动填写评价表单...");

        // 选择评价等级
        let boxes = document.getElementsByName("zbtd");
        let flag_select_other = false;
        for (let i = 0; i < boxes.length; i++) {
            let inputElement;
            if (!flag_select_other) {
                inputElement = boxes[i].querySelectorAll("input")[2]; // 选B
                flag_select_other = true;
            } else {
                inputElement = boxes[i].querySelector("input"); // 选A
            }

            if (inputElement) {
                inputElement.click();
            }
        }

        // 填写“很好”
        let input_boxes = document.getElementsByName("jynr");
        for (let j = 0; j < input_boxes.length; j++) {
            input_boxes[j].value = "很好";
        }

        // 提交表单
        const form = document.getElementById('Form1');
        form.removeAttribute('target');


        setTimeout(() => {
            console.log("提交评价表单...");
            document.getElementById('issubmit').value = 1;
            form.submit();
        }, 2000);
    }

    // 程序主入口
    function Proceed() {
        if (/xspj_list\.do/.test(window.location.href)) {
            console.log("检测到 评价列表页面");
            handleListPage();
        } else if (/xspj_edit\.do/.test(window.location.href)) {
            console.log("检测到 评价编辑页面");
            handleEditPage();
        }

    }

    // 启动
    Proceed();

})();
