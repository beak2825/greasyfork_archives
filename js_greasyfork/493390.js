// ==UserScript==
// @name         SJTU/ACMOJ 仙贝智慧收集器
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  在SJTU/ACMOJ的提交记录中快速筛选公开AC代码
// @author       SusieGlitter
// @match        https://acm.sjtu.edu.cn/OnlineJudge/status?*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/493390/SJTUACMOJ%20%E4%BB%99%E8%B4%9D%E6%99%BA%E6%85%A7%E6%94%B6%E9%9B%86%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/493390/SJTUACMOJ%20%E4%BB%99%E8%B4%9D%E6%99%BA%E6%85%A7%E6%94%B6%E9%9B%86%E5%99%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // 进入提示
    console.log('SJTU/ACMOJ 仙贝智慧收集器正在工作喵~')
    console.log(document.cookie);
    console.log(navigator.userAgent);

    // 创建查询按钮
    let start = document.createElement("div");
    start.setAttribute("class", "input-group-append");
    let start_btn = document.createElement("button");
    start_btn.setAttribute("type", "button");
    start_btn.setAttribute("class", "btn btn-outline-primary");
    start_btn.innerText = "筛选公开代码";
    start_btn.onclick = function () {
        console.log("开始获取代码");
        get_AC_code();
    }
    start.appendChild(start_btn);

    // 插入查询按钮
    let serach_col = document.getElementById("status_search");
    serach_col.appendChild(start);

    // 获取代码
    async function get_AC_code() {
        // 清空目前列表
        let code_list = document.getElementsByTagName("tbody")[0];
        code_list.innerHTML = '';

        // 获取一些必要信息
        let user_ID = document.getElementsByClassName("nav-link dropdown-toggle");

        // 获取问题编号
        let para_json = {};
        window.location.href.trim().split(/[&?]/).slice(1).forEach(item => { para_json[item.split('=')[0]] = item.split('=')[1] });
        let problem_id = para_json["problem_id"];
        let page_id = para_json["page"];

        // 获取AC第一页
        start_btn.innerText = "统计中……"
        let response = await fetch(`${window.location.href}&status=accepted&page=1`, {
            method: "GET",
            headers: {
                "User-Agent": navigator.userAgent,
                "Cookie": document.cookie
            }
        });
        let domparser = new DOMParser();
        let response_text = await response.text();
        let response_dom = domparser.parseFromString(response_text, "text/html");

        //获取最大页数
        para_json = {};
        let page_link = response_dom.getElementsByClassName("page-link btn-light");
        let max_page = 0;
        if (page_link[page_link.length - 1].href == "javascript:void(0)") {
            if (!page_id) {
                max_page = 1;
            }
            else {
                max_page = page_id;
            }
        }
        else {
            page_link[page_link.length - 1].href.split(/[&?]/).slice(1).forEach(item => { para_json[item.split('=')[0]] = item.split('=')[1] });
            max_page = Number(para_json["page"]);
        }

        // 小小的保护
        max_page = Math.min(max_page, 256);

        // 获取代码
        let code_cnt = 0;
        let async_cnt = max_page;
        async function get_and_append(page) {
            let response = await fetch(`https://acm.sjtu.edu.cn/OnlineJudge/status?page=${page}&problem_id=${problem_id}&status=accepted`, {
                method: "GET",
                headers: {
                    "User-Agent": navigator.userAgent,
                    "Cookie": document.cookie
                }
            });
            let response_text = await response.text();
            // console.log(page)
            console.log(`正在第${page}页里面找`);
            let domparser = new DOMParser();
            let response_dom = domparser.parseFromString(response_text, "text/html");
            let all_tr = response_dom.getElementsByTagName("tr")
            for (let tr_i = 1; tr_i < all_tr.length; tr_i++) {
                let tr = all_tr[tr_i];
                let tr_link = tr.getElementsByClassName("link--status");
                let tr_text = tr.getElementsByClassName("text-green");
                if (tr_link.length > 0 && tr_text.length > 0) {
                    tr_link[0].setAttribute("target", "_blank");
                    code_list.appendChild(tr);
                    code_cnt++;
                    console.log(`已找到${code_cnt}个公开AC代码`);
                }
            }
            async_cnt--;
            start_btn.innerText = `${max_page - async_cnt}/${max_page}`;
            if (async_cnt == 0) {
                alert(`获取完毕，已找到${code_cnt}个公开AC代码`);
            }
        }
        for (let page = 1; page <= max_page; page++) {
            get_and_append(page);
        }
    }
})();