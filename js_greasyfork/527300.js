// ==UserScript==
// @name         PKU 手动抢课小助手
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  过滤选课列表，只显示目标课程，实时高亮课程名额状态，支持一键识别验证码
// @author       goudanZ1
// @license      MIT
// @match        https://elective.pku.edu.cn/elective2008/edu/pku/stu/elective/controller/supplement/supplement.jsp*
// @match        https://elective.pku.edu.cn/elective2008/edu/pku/stu/elective/controller/supplement/SupplyCancel.do*
// @match        https://elective.pku.edu.cn/elective2008/edu/pku/stu/elective/controller/supplement/electSupplement.do*
// @match        https://elective.pku.edu.cn/elective2008/edu/pku/stu/elective/controller/supplement/cancelCourse.do*
// @icon         https://www.pku.edu.cn/pku_logo_red.png
// @grant        GM_xmlhttpRequest
// @connect      api.ttshitu.com
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/527300/PKU%20%E6%89%8B%E5%8A%A8%E6%8A%A2%E8%AF%BE%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/527300/PKU%20%E6%89%8B%E5%8A%A8%E6%8A%A2%E8%AF%BE%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // ******************** 以下 4 项内容需要填写 ********************

    // 1. 填写想抢的课程名与班号，在每页中只会显示 allowedCourses 中的课程，但如果这些课程
    //    分布在不同的页上，仍然需要手动换页来查看。同一个课程名对应的班号（无论一个还是多个）
    //    需要写在数组（方括号）中。
    const allowedCourses = {
        摸鱼学导论: [6],
        划水学原理: [1, 3],
        投点理论与实践: [2],
    };

    // 2. 填写 TT 识图账号的用户名和密码（http://www.ttshitu.com，请确保账户有余额）
    const recognizerConfig = {
        username: "PKUer",
        password: "wasd1234",
    };

    // ******************** 以上 2 项内容需要填写 ********************

    const table = document.querySelector("table.datagrid");
    const header = table.querySelector("tr.datagrid-header");

    // 获取 header 行中特定文字单元格的索引
    function getHeaderColumnIndex(title) {
        for (let i = 0; i < header.children.length; i++) {
            if (header.children[i].textContent.trim() === title) {
                return i;
            }
        }
        return -1;
    }

    const courseNameIndex = getHeaderColumnIndex("课程名");
    const classNumberIndex = getHeaderColumnIndex("班号");
    const limitIndex = getHeaderColumnIndex("限数/已选");
    const refreshIndex = getHeaderColumnIndex("补选");

    if (courseNameIndex < 0 || classNumberIndex < 0 || limitIndex < 0 || refreshIndex < 0) {
        return;
    }

    const rows = table.querySelectorAll("tr.datagrid-even,tr.datagrid-odd");
    const visibleRows = [];

    // Hide unnecessary courses
    rows.forEach((row) => {
        const courseName = row.children[courseNameIndex].textContent.trim();
        const classNumber = parseInt(row.children[classNumberIndex].textContent.trim());
        if (courseName in allowedCourses && allowedCourses[courseName].includes(classNumber)) {
            visibleRows.push(row);
        } else {
            row.style.display = "none";
        }
    });

    // Reset the color style for visible rows
    visibleRows.forEach((row, index) => {
        const newClass = index % 2 === 0 ? "datagrid-even" : "datagrid-odd";
        row.className = newClass;
        row.onmouseover = () => {
            row.className = "datagrid-all";
        };
        row.onmouseout = () => {
            row.className = newClass;
        };
    });

    const underLimitStyle = "background-color: #abebc6; color: #145a32";
    const reachLimitStyle = "background-color: #f5b7b1; color: #7b241c";

    // Set the color style for 'limit/elected' grids and change a grid from red to
    // green when its corresponding '刷新' becomes '补选'
    visibleRows.forEach((row) => {
        const numCell = row.children[limitIndex]; // <td><span id='electedNum**'>* / *</span></td>
        const refreshCell = row.children[refreshIndex].children[0];
        // <a><span>补选</span></a>, <a id='refreshLimit**'><span>刷新</span></a>

        numCell.children[0].style.fontSize = "13px";
        if (refreshCell.textContent.trim() === "补选") {
            numCell.style.cssText = underLimitStyle;
        } else {
            numCell.style.cssText = reachLimitStyle;

            // function refreshLimit() in supplement.js:
            //    var aTag = $('#refreshLimit' + index + index); aTag.html( '<span>补选</span>'); ...
            //
            //    When the latest refresh request indicates that elected < limit, the innerHTML
            // of refreshCell changes, and results in a childList mutation. I don't want to observe
            // numCell, since every refresh request will reset the 'limit/elected' string no matter
            // it has changed or not, which would be too frequent to observe.
            const observer = new MutationObserver((mutationList, observer) => {
                numCell.style.cssText = underLimitStyle;
                observer.disconnect();
                // The text won't be changed again, since clicking '补选' won't trigger refreshLimit()
            });
            observer.observe(refreshCell, { childList: true });
        }
    });

    // Get the base64 form of the captcha image (mostly by DeepSeek)
    function getBase64Data() {
        const image = document.querySelector("#imgname");
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        ctx.drawImage(image, 0, 0);
        return canvas.toDataURL("image/jpeg").split(",")[1]; // 'data:image/jpeg;base64,***...'
    }

    // Write the validation code into the input box
    function setValidationCode(code) {
        const inputBox = document.querySelector("#validCode");
        inputBox.value = code.slice(0, 5);
    }

    // Send a cross-domain request to recognize the captcha image
    function recognizeImage() {
        const base64 = getBase64Data();
        GM_xmlhttpRequest({
            method: "POST",
            url: "http://api.ttshitu.com/predict",
            headers: { "Content-Type": "application/json" },
            data: JSON.stringify({
                username: recognizerConfig.username,
                password: recognizerConfig.password,
                typeid: "1003",
                image: base64,
            }),
            onload: (res) => {
                try {
                    const response = JSON.parse(res.response);
                    if (response.success) {
                        setValidationCode(response.data.result);
                    } else {
                        alert("识别验证码失败：" + response.message);
                    }
                } catch (e) {
                    alert("识图响应解析失败：" + e);
                }
            },
        });
    }

    // Create a button for recognization and insert it before the input box
    const btn = document.createElement("button");
    btn.textContent = "识别验证码";
    btn.style.cssText = "margin-left: 5px; margin-right: 10px; padding: 2px 8px; cursor: pointer";
    btn.onclick = recognizeImage;

    const inputBox = document.querySelector("#validCode");
    inputBox.value = ""; // Clear the cached value
    inputBox.parentNode.insertBefore(btn, inputBox);
})();
