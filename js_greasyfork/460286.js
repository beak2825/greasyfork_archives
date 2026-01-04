// ==UserScript==
// @name         金智教育教务成绩导出
// @namespace    hb123
// @version      0.1
// @description  导出全部成绩，金智教育
// @author       何碧
// @match        *://*.edu.cn/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.core.min.js
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/460286/%E9%87%91%E6%99%BA%E6%95%99%E8%82%B2%E6%95%99%E5%8A%A1%E6%88%90%E7%BB%A9%E5%AF%BC%E5%87%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/460286/%E9%87%91%E6%99%BA%E6%95%99%E8%82%B2%E6%95%99%E5%8A%A1%E6%88%90%E7%BB%A9%E5%AF%BC%E5%87%BA.meta.js
// ==/UserScript==

(function () {
    'use strict';
    make_xlsx_lib(XLSX)
    waitUtil('ul.jqx-tabs-title-container', function (target) {
        let box = document.createElement("div");
        box.style = "display:flex;float:right;margin-right:20px;justify-content: center;align-items: center;flex: 1;height: 100%;"
        target.appendChild(box);

        box.innerHTML = `
        <span id="average-credit"></span>
    `;
        let btn = document.createElement("button");
        btn.textContent = "导出为xlsx";
        btn.className = "jw-btn";
        btn.style = `
    outline: none;
    border: #ccc 1px solid;
    border-radius: 8px;
    padding: 2px 8px;
    background-color: #1195da;
    box-shadow: 0px 0px 1px 0.5px #119ddd;
`;
        btn.id = "jw-export";
        btn.onclick = () => {
            console.log("[何碧]正在导出......", XLSX);
            const wb = XLSX.utils.book_new();
            getCourses().then(courses => {
                let table = [["课程名称", "学年学期", "课序号", "学分", "成绩", "满分", "学时", "修读方式", "修读类型", "重修初修", "课程性质", "考试日期", "开课单位", "是否及格"]]
                courses.forEach(course => {
                    table.push([course.KCM, course.XNXQDM_DISPLAY, course.XSKCH,
                    parseInt(course.XF),// 学分
                    course.ZCJ,// 成绩
                    parseInt(course.DJCJLXDM),// 满分
                    course.XS, //学时
                    course.XDFSDM_DISPLAY,//修读方式
                    course.SFZX_DISPLAY, // 修读类型
                    course.CXCKDM_DISPLAY,
                    course.KCLBDM_DISPLAY, // 课程性质
                    course.XNXQDM_DISPLAY, // 考试日期
                    course.KKDWDM_DISPLAY, course.SFJG_DISPLAY])
                })
                const ws = XLSX.utils.aoa_to_sheet(table);
                XLSX.utils.book_append_sheet(wb, ws, "所有成绩");
                XLSX.writeFile(wb, "所有成绩.xlsx");
            })
        }
        box.appendChild(btn);
    }, 5000);
    GM_addStyle(`
    .jw-btn:hover{
        box-shadow: 2px 2px 4px 0.5px #119ddd;
    }
    `);
})();

function waitUtil(ele, callback, timeout) {
    let success = false;
    let id = setInterval(function () {
        let target = document.querySelector(ele)
        if (target != null) {
            success = true
            clearInterval(id);
            callback(target)
        }
    }, 100)
    setTimeout(() => {
        if (!success) {
            clearInterval(id)
            console.log("[何碧]页面超时")
        }
    }, timeout)
}

function getCourses() {
    return fetch("/jwapp/sys/cjcx/modules/cjcx/xscjcx.do", {
        "headers": {
            "accept": "application/json, text/javascript, */*; q=0.01",
            "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "x-requested-with": "XMLHttpRequest"
        },
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": "querySetting=%5B%7B%22name%22%3A%22SFYX%22%2C%22caption%22%3A%22%E6%98%AF%E5%90%A6%E6%9C%89%E6%95%88%22%2C%22linkOpt%22%3A%22AND%22%2C%22builderList%22%3A%22cbl_m_List%22%2C%22builder%22%3A%22m_value_equal%22%2C%22value%22%3A%221%22%2C%22value_display%22%3A%22%E6%98%AF%22%7D%2C%7B%22name%22%3A%22SHOWMAXCJ%22%2C%22caption%22%3A%22%E6%98%BE%E7%A4%BA%E6%9C%80%E9%AB%98%E6%88%90%E7%BB%A9%22%2C%22linkOpt%22%3A%22AND%22%2C%22builderList%22%3A%22cbl_String%22%2C%22builder%22%3A%22equal%22%2C%22value%22%3A0%2C%22value_display%22%3A%22%E5%90%A6%22%7D%5D&*order=-XNXQDM%2C-KCH%2C-KXH&pageSize=100&pageNumber=1",
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
    }).then(response => response.json()).then(result => { return result.datas.xscjcx.rows })
}
