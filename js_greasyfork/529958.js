// ==UserScript==
// @name         szu获取详细成绩
// @namespace    https://greasyfork.org/
// @version      1.2
// @description  szu获取详细成绩，包含平时成绩，期末成绩，平时成绩和期末成绩占比
// @author       You
// @run-at      document-start
// @match        *://ehall.szu.edu.cn/jwapp/sys/cjcx/*
// @require   https://scriptcat.org/lib/513/2.1.0/ElementGetter.js#sha256=aQF7JFfhQ7Hi+weLrBlOsY24Z2ORjaxgZNoni7pAz5U=
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/529958/szu%E8%8E%B7%E5%8F%96%E8%AF%A6%E7%BB%86%E6%88%90%E7%BB%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/529958/szu%E8%8E%B7%E5%8F%96%E8%AF%A6%E7%BB%86%E6%88%90%E7%BB%A9.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const url = "https://ehall.szu.edu.cn/jwapp/sys/cjcx/modules/cjcx/xscjcx.do";
    const cookie = document.cookie;

    async function fetchScores() {
        try {
            const headers = { "Cookie": cookie };
            const response = await fetch(url, { method: "GET", headers });
            const data = await response.json();
            return data.datas.xscjcx.rows;
        } catch (error) {
            console.error("获取成绩失败:", error);
            return [];
        }
    }

    async function fetchPSCJ(value) {
        const requestBody = new URLSearchParams();
        requestBody.append("querySetting", `[{"name":"PSCJ","value":${value},"linkOpt":"and","builder":"equal"}]`);
        requestBody.append("pageSize", "100");
        requestBody.append("pageNumber", "1");

        const headers = {
            "Content-Type": "application/x-www-form-urlencoded",
            "Cookie": cookie
        };

        const response = await fetch(url, { method: "POST", headers, body: requestBody });
        const data = await response.json();
        return data.datas.xscjcx.rows;
    }

    async function fetchQMCJ(value) {
        const requestBody = new URLSearchParams();
        requestBody.append("querySetting", `[{"name":"QMCJ","value":${value},"linkOpt":"and","builder":"equal"}]`);
        requestBody.append("pageSize", "100");
        requestBody.append("pageNumber", "1");

        const headers = {
            "Content-Type": "application/x-www-form-urlencoded",
            "Cookie": cookie
        };

        const response = await fetch(url, { method: "POST", headers, body: requestBody });
        const data = await response.json();
        return data.datas.xscjcx.rows;
    }

    async function fetchAllScores() {
        const scores = await fetchScores();
        const nameToRow = {};

        scores.forEach(row => {
            nameToRow[row.KCM + row.XNXQDM_DISPLAY] = row;
        });

        let totalSize = scores.length
        let count = totalSize

        for (let i = 100; i >= 0; i--) {
            const pscjRows = await fetchPSCJ(i);
            pscjRows.forEach(row => {
                const key = row.KCM + row.XNXQDM_DISPLAY;
                if (nameToRow[key]){
                    nameToRow[key].PSCJ = i.toString();
                    count--;
                }
            });
            if (count <= 0) {
                break;
            }
        }

        count = totalSize
        for (let i = 100; i >= 0; i--) {
            const qmcjRows = await fetchQMCJ(i);
            qmcjRows.forEach(row => {
                const key = row.KCM + row.XNXQDM_DISPLAY;
                if (nameToRow[key]){
                    nameToRow[key].QMCJ = i.toString();
                    count--;
                }
            });
            if (count <= 0) {
                break;
            }
        }

        const groupedScores = {};
        Object.values(nameToRow).forEach(row => {
            const term = row.XNXQDM_DISPLAY;
            if (!groupedScores[term]) groupedScores[term] = [];
            groupedScores[term].push(row);
        });


        // Sort the keys of groupedScores
        const sortedTerms = Object.keys(groupedScores).sort((a, b) => {
            // Extract the academic year and semester from the term strings
            const yearRegex = /^(\d{4})-(\d{4})学年/;
            const semesterRegex = /(第一|第二)学期$/;

            const extractYearSemester = (term) => {
                const yearMatch = term.match(yearRegex);
                const semesterMatch = term.match(semesterRegex);

                if (yearMatch && semesterMatch) {
                    const startYear = parseInt(yearMatch[1], 10);
                    const isFirstSemester = semesterMatch[1] === "第一";
                    return { startYear, isFirstSemester };
                }
                return { startYear: 0, isFirstSemester: true }; // Default if no match
            };

            const aTermDetails = extractYearSemester(a);
            const bTermDetails = extractYearSemester(b);

            // Compare years first
            if (aTermDetails.startYear !== bTermDetails.startYear) {
                return bTermDetails.startYear - aTermDetails.startYear;
            }

            // If years are equal, compare the semester (First semester comes before Second semester)
            return aTermDetails.isFirstSemester ? 1 : -1;
        });

        // Now re-sort the groupedScores object by the sorted keys
        const sortedGroupedScores = {};
        sortedTerms.forEach(term => {
            sortedGroupedScores[term] = groupedScores[term];
        });

        return sortedGroupedScores;
    }

    async function addScoreTab() {
        // 获取 <ul class="jqx-tabs-title-container">
        const ul =  await elmGetter.get(".jqx-tabs-title-container");
        if (!ul) {
            console.error("未找到 jqx-tabs-title-container");
            return;
        }

        // 创建新的 <li> 元素
        const newLi = document.createElement("li");
        newLi.setAttribute("role", "tab");
        newLi.className = "jqx-reset jqx-disableselect jqx-tabs-title jqx-item jqx-rc-t  jqx-fill-state-pressed";
        newLi.style.float = "left";

        // 创建 <div class="jqx-tabs-titleWrapper">
        const titleWrapper = document.createElement("div");
        titleWrapper.className = "jqx-tabs-titleWrapper";
        titleWrapper.style.cssText = "outline: none; position: relative; z-index: 15; height: 100%;";

        // 创建 <div class="jqx-tabs-titleContentWrapper">
        const titleContentWrapper = document.createElement("div");
        titleContentWrapper.className = "jqx-tabs-titleContentWrapper jqx-disableselect";
        titleContentWrapper.style.cssText = "float: left; margin-top: -0.5px;";
        titleContentWrapper.textContent = "详细成绩"; // 文字内容

        // 组装 DOM 结构
        titleWrapper.appendChild(titleContentWrapper);
        newLi.appendChild(titleWrapper);

        // 插入到 <ul> 中
        ul.appendChild(newLi);

        // 创建新的内容元素
        const newContentDiv = document.createElement("div");
        newContentDiv.className = "cjcx-tab-content-2 bh-mt-8 jqx-tabs-content-element jqx-rc-b";
        newContentDiv.setAttribute("role", "tabpanel");
        newContentDiv.style.display = "none"; // 初始隐藏



        // 插入到适当的容器中（假设有一个容器用于显示内容）
        const container = document.querySelector(".jqx-widget-content"); // 替换成你实际的容器
        container.appendChild(newContentDiv);

        // 添加点击事件
        newLi.addEventListener("click", async function () {
            // 移除所有 <li> 的 `jqx-tabs-title-selected-top`
            document.querySelectorAll(".jqx-tabs-title-container > li").forEach(li => {
                li.classList.remove("jqx-tabs-title-selected-top");
            });

            // 给当前 <li> 添加 `jqx-tabs-title-selected-top`
            newLi.classList.add("jqx-tabs-title-selected-top");

            // 隐藏所有内容
            document.querySelectorAll(".jqx-tabs-content-element").forEach(content => {
                content.style.display = "none";
            });


            // 显示加载中动画
            const loadingSpinner = createLoadingSpinner();
            newContentDiv.innerHTML = '';  // 清空内容
            newContentDiv.appendChild(loadingSpinner);
            newContentDiv.style.display = 'block';

            // 先检查本地存储是否有 SZU_ALLSCORES
            let allScores = localStorage.getItem("SZU_ALLSCORES");

            if (allScores) {
                // 如果本地存储有数据，解析为 JSON
                allScores = JSON.parse(allScores);
            } else {
                // 如果本地没有数据，请求获取成绩
                allScores = await fetchAllScores();

                // 请求成功后，存储到本地存储
                if (allScores) {
                    localStorage.setItem("SZU_ALLSCORES", JSON.stringify(allScores));
                }
            }

            // 渲染到 `newContentDiv`
            renderScores(allScores, newContentDiv);

            // 隐藏加载中动画
            loadingSpinner.style.display = 'none';

            // 显示 "详细成绩" 的内容
            newContentDiv.style.display = "block";
        });

        const contents = [document.querySelector(".cjcx-tab-content-0"), document.querySelector(".cjcx-tab-content-1")];

        // 监听所有 <li>，确保点击其他标签时，移除 "详细成绩" 选项卡的选中状态
        document.querySelectorAll("ul.jqx-tabs-title-container > li").forEach((li, index) => {
            if (li !== newLi) {
                li.addEventListener("click", function () {
                    // 输出索引
                    contents[index].style.display = "block"
                    li.classList.add("jqx-tabs-title-selected-top");
                    newLi.classList.remove("jqx-tabs-title-selected-top");
                    newContentDiv.style.display = "none"; // 隐藏"详细成绩"内容
                });
            }
        });

    }

    function renderScores(scores, container) {
        container.innerHTML = ""; // 清空内容
        // 创建更新成绩按钮
        const updateButton = document.createElement("button");
        updateButton.innerHTML = "重新获取成绩";

        // 修改按钮样式，添加圆角、阴影、渐变背景等
        updateButton.style.cssText = `
    padding: 8px 20px;
    font-size: 16px;
    background: #E6A23C;
    color: white;
    border: none;
    border-radius: 25px;
    cursor: pointer;
    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1), -2px -2px 10px rgba(255, 255, 255, 0.3);
margin-right: 30px;
`;
        container.appendChild(updateButton); // 添加按钮到 newContentDiv

        // 添加按钮点击事件
        updateButton.addEventListener("click", async function () {
            // 显示加载中动画
            const loadingSpinner = createLoadingSpinner();
            container.innerHTML = '';  // 清空内容
            container.appendChild(loadingSpinner);
            container.style.display = 'block';

            const  newAllScores = await fetchAllScores();

            // 请求成功后，存储到本地存储
            if (newAllScores) {
                localStorage.setItem("SZU_ALLSCORES", JSON.stringify(newAllScores));
            }

            // 渲染到 newContentDiv
            renderScores(newAllScores, container);

            // 隐藏加载中动画
            loadingSpinner.style.display = 'none';
        });

        if (!scores || Object.keys(scores).length === 0) {
            container.innerHTML = "<p style='text-align: center; font-size: 16px;'>暂无成绩数据</p>";
            return;
        }

        Object.entries(scores).forEach(([semester, rows]) => {
            // 创建学期标题
            const semesterTitle = document.createElement("div");
            semesterTitle.style.cssText = "text-align: center; margin: 20px 0; font-size: 20px; font-weight: bold; color: #333;";
            semesterTitle.textContent = semester;
            container.appendChild(semesterTitle);

            // 创建表格
            const table = document.createElement("table");
            table.style.cssText = "width: 100%; border-collapse: collapse; margin-bottom: 20px; background-color: #fff; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);";

            // 表头
            const thead = document.createElement("thead");
            thead.innerHTML = `
            <tr style="background-color: #3498db; color: white;">
                <th style="padding: 10px; text-align: left;">课程名称</th>
                <th style="padding: 10px; text-align: left;">课程性质</th>
                <th style="padding: 10px; text-align: left;">学分</th>
                <th style="padding: 10px; text-align: left;">总成绩</th>
                <th style="padding: 10px; text-align: left;">等级成绩</th>
                <th style="padding: 10px; text-align: left;">平时成绩</th>
                <th style="padding: 10px; text-align: left;">期末成绩</th>
                <th style="padding: 10px; text-align: left;">平时成绩系数</th>
                <th style="padding: 10px; text-align: left;">期末成绩系数</th>
            </tr>
        `;
            table.appendChild(thead);

            // 表体
            const tbody = document.createElement("tbody");
            rows.forEach(row => {
                const tr = document.createElement("tr");
                tr.style.cssText = "transition: background-color 0.3s ease;";
                tr.innerHTML = `
                <td style="padding: 10px; border-top: 1px solid #ddd;">${row.KCM}</td>
                <td style="padding: 10px; border-top: 1px solid #ddd;">${row.KCXZDM_DISPLAY}</td>
                <td style="padding: 10px; border-top: 1px solid #ddd;">${row.XF}</td>
                <td style="padding: 10px; border-top: 1px solid #ddd;">${row.ZCJ}</td>
                <td style="padding: 10px; border-top: 1px solid #ddd;">${row.DJCJMC}</td>
                <td style="padding: 10px; border-top: 1px solid #ddd;">${row.PSCJ}</td>
                <td style="padding: 10px; border-top: 1px solid #ddd;">${row.QMCJ}</td>
                <td style="padding: 10px; border-top: 1px solid #ddd;">${row.PSCJXS}%</td>
                <td style="padding: 10px; border-top: 1px solid #ddd;">${row.QMCJXS}%</td>
            `;

                // 鼠标悬停效果
                tr.addEventListener('mouseenter', () => {
                    tr.style.backgroundColor = "#f1f1f1";
                });
                tr.addEventListener('mouseleave', () => {
                    tr.style.backgroundColor = "";
                });

                tbody.appendChild(tr);
            });

            table.appendChild(tbody);
            container.appendChild(table);
        });
    }


    // 创建加载动画元素
    function createLoadingSpinner() {
        const spinner = document.createElement('div');
        spinner.classList.add('loading-spinner');
        spinner.style.border = '4px solid rgba(0, 0, 0, 0.1)';
        spinner.style.borderLeftColor = '#3498db';
        spinner.style.borderRadius = '50%';
        spinner.style.width = '40px';
        spinner.style.height = '40px';
        spinner.style.animation = 'spin 1s linear infinite';
        spinner.style.margin = '20px auto';
        return spinner;
    }

    // 旋转动画关键帧
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(style);

    addScoreTab();
})();
