// ==UserScript==
// @name         Codeforces Gym Statistic
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  gym做题信息统计
// @author       Tanphoon
// @match        https://codeforces.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=codeforces.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/495936/Codeforces%20Gym%20Statistic.user.js
// @updateURL https://update.greasyfork.org/scripts/495936/Codeforces%20Gym%20Statistic.meta.js
// ==/UserScript==
(function () {
    'use strict';
    const pathname = window.location.pathname;
    console.log(pathname);
    if (pathname.startsWith("/contests/with/")) {
        gymAnalyze();
    }
    function gymAnalyze() {
        const handle = pathname.substring(pathname.lastIndexOf('/') + 1, pathname.length);
        // 定义请求的URL
        const userDataUrl = `https://codeforces.com/api/user.status?handle=${handle}`;
        const contestListUrl = 'https://codeforces.com/api/contest.list?gym=true';
        // 使用fetch函数获取JSON数据，并将其转换为JSON对象
        async function fetchData(url) {
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            } catch (error) {
                console.error(`Fetch error for ${url}: `, error);
                throw error;
            }
        };
        async function getContestData() {
            const today = new Date().toLocaleDateString();
            // 比赛信息
            let contestData = {};
            if (!localStorage.getItem("ContestDataVersion") || localStorage.getItem("ContestDataVersion") != today) {
                try {
                    const contestList = await fetchData(contestListUrl);
                    contestList.result.forEach(item => {
                        contestData[item.id] = item.name;
                    });
                    localStorage.setItem("ContestDataVersion", today);
                    localStorage.setItem("ContestData", JSON.stringify(contestData));
                } catch (error) {
                    console.error("An error occurred while fetching data:", error);
                }
            } else {
                contestData = JSON.parse(localStorage.getItem("ContestData"));
            }
            return contestData;
        }
        async function main() {
            const contestData = await getContestData();
            const userData = await fetchData(userDataUrl);
            let data = {};
            userData.result.forEach(item => {
                // 提取所需字段
                const commitId = item.id;
                const contestId = item.contestId;
                const time = new Date(item.creationTimeSeconds * 1000).toLocaleString();
                const verdict = item.verdict;
                const problemId = item.problem.index;
                if (contestId > 100000) {
                    if (!data[contestId]) {
                        data[contestId] = { 'name': contestData[contestId], 'correct': [], 'problem': {}, };
                    }
                    // 通过的题目
                    if (verdict == "OK" && !data[contestId]['correct'].includes(problemId))
                        data[contestId]['correct'].push(problemId);
                    // 题目提交信息
                    if (!data[contestId]['problem'][problemId]) {
                        data[contestId]['problem'][problemId] = [];
                    }
                    data[contestId]['problem'][problemId].push({ commitId, time, verdict });
                }
            });
            // 用户信息
            drawTable(data);
            console.log(data);
        }
        function drawTable(data) {
            const facebox = document.createElement('style');
            facebox.textContent = `
        .popup {
            display: none;
            position: fixed;
            z-index: 99;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            overflow: auto;
            background-color: rgba(0, 0, 0, 0.4);
        }

        .popup-content {
            background-color: #fefefe;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding: 10px;
            width: 50%;
            border-radius: 5px;
        }

        .close {
            color: #aaa;
            float: right;
            font-size: 28px;
            font-weight: bold;
        }


        .close:hover,
        .close:focus {
            color: black;
            text-decoration: none;
            cursor: pointer;
        }
        .content {
            border: 1px solid #888;
            padding: 20px;
            border-radius: 5px;
        }

        #gym th, td {
            cursor: pointer;
        }
        `;
            document.head.appendChild(facebox);
            let datatable = `
        <div id="gyms" class="datatable" style="background-color: #E1E1E1; padding-bottom: 3px;">
            <div class="lt">&nbsp;</div>
            <div class="rt">&nbsp;</div>
            <div class="lb">&nbsp;</div>
            <div class="lb">&nbsp;</div>
            <div style="padding: 4px 0 0 6px;font-size:1.4rem;position:relative;">Gyms</div>
            <div style="background-color: white;margin:0.3em 3px 0 3px;position:relative;">
            <div class="ilt">&nbsp;</div>
            <div class="irt">&nbsp;</div>
            <table class="tablesorter user-contests-table">
                <thead>
                    <tr>
                        <th class="top left">#</th>
                        <th class="top">Contest</th>
                        ${Array.from("ABCDEFGHIJKLM").map(problemId => `<th class="top">${problemId}</th>`).join('')}
                        <th class="top right">Solved</th>
                    </tr>
                </thead>
                <tbody>
                    ${Object.keys(data).map((contestId, index) => `
                        <tr>
                            <td>${index + 1}</td>
                            <td><a href="/gym/${contestId}">${data[contestId]['name']}</a></td>
                            ${Array.from("ABCDEFGHIJKLM").map(problemId => {
                const correct = data[contestId]['correct'].includes(problemId);
                const style = correct ? "font-weight: bold;color:#0a0" : "color:#00a";
                if (data[contestId]['problem'][problemId]) {
                    return `
                                    <td style="${style}" problemid=${problemId}>
                                    ${correct ? '+' : '-'}${data[contestId]['problem'][problemId].length}
                                    </td>`;
                }
                else {
                    return `<td problemid=${problemId}></td>`;
                }
            }).join('')}
                            <td>${Object.keys(data[contestId]['problem']).length}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            </div>
        </div>
        `;
            let contests = document.querySelector("#pageContent > .datatable");
            contests.insertAdjacentHTML("afterend", datatable);
            let gyms = document.querySelector("#pageContent > #gyms");
            contests.style.display = 'block';
            gyms.style.display = 'none';
            document.querySelector("#pageContent > div.second-level-menu > ul > li.current.selectedLava").insertAdjacentHTML("afterend", "<li><a id='toggleButton' style='cursor: pointer;'>SWITCH TO GYMS</a></li>")

            const toggleButton = document.getElementById('toggleButton');
            toggleButton.addEventListener('click', () => {
                if (contests.style.display === 'none') {
                    contests.style.display = 'block';
                    gyms.style.display = 'none';
                    toggleButton.textContent = 'SWITCH TO GYMS';
                } else {
                    contests.style.display = 'none';
                    gyms.style.display = 'block';
                    toggleButton.textContent = 'SWITCH TO COMTESTS';
                }
            });

            let popdiv = `
        <div id="mypopup" class="popup">
            <div class="popup-content">
                <span class="close">&times;</span>
                <div class="content" id="popupMessage">
                    <h2>This is the popup content</h2>
                    <p>You can add any content inside the popup.</p>
                </div>
            </div>
        </div>
                `;
            gyms.insertAdjacentHTML('afterend', popdiv);

            const table = document.getElementById("gyms");
            const popup = document.getElementById("mypopup");
            const closeBtn = document.querySelector(".close");
            const popupMessage = document.getElementById("popupMessage");
            const columnNames = Array.from(table.getElementsByTagName("th")).map(th => th.textContent);
            table.addEventListener("click", (event) => {
                const cell = event.target.closest("td");
                if (cell) {
                    const contestId = Object.keys(data)[cell.parentNode.rowIndex - 1];
                    const problemId = cell.getAttribute('problemid');
                    const commitInfos = data[contestId]['problem'][problemId];
                    if (commitInfos) {
                        popupMessage.innerHTML = commitInfos.map(item => `
                            ${item.time}
                            &nbsp;
                            <span style="${item.verdict == "OK" ? "font-weight: bold;color:#0a0" : "color:#00a"}">${item.verdict == "OK" ? "Accepted" : item.verdict.replace("/^\w/", (match) => match.toUpperCase())}</span>
                            →
                            <a href=https://cf.dianhsu.com/gym/${contestId}/submission/${item.commitId} target="_blank">${item.commitId}</a><br>
                            `).join('');
                        popup.style.display = "block";
                    }
                }
            });
            closeBtn.addEventListener("click", () => {
                popup.style.display = "none";
            });
            popup.addEventListener("click", (event) => {
                if (event.target === popup) {
                    popup.style.display = "none";
                }
            });
        }
        main();
    }
})();