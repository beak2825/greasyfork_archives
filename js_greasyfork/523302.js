// ==UserScript==
// @name         szu_graduate_student_get_grade
// @namespace    http://tampermonkey.net/
// @version      2025-01-14
// @description  Open the score center and wait for a moment, the score will be displayed in the middle of the screen
// @author       You
// @match        https://ehall.szu.edu.cn/gsapp/sys/szdxwdcjapp/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=szu.edu.cn
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/523302/szu_graduate_student_get_grade.user.js
// @updateURL https://update.greasyfork.org/scripts/523302/szu_graduate_student_get_grade.meta.js
// ==/UserScript==


(function() {
    'use strict';

    const headers = {
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'Accept-Language': 'zh-CN,zh;q=0.9',
        'Connection': 'keep-alive',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Origin': 'https://ehall.szu.edu.cn',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-origin',
        'User-Agent': 'Mozilla/5.0',
        'X-Requested-With': 'XMLHttpRequest',
        'sec-ch-ua': '"Not_A Brand";v="8", "Chromium";v="120", "Google Chrome";v="120"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
    };

    // Function to query grades with score >= score
    function query_gte(score) {
        const data = {
            querySetting: `[{"name":"DYBFZCJ","linkOpt":"AND","builderList":"cbl_Other","builder":"moreEqual","value":${score}},{"name":"CJFZDM","linkOpt":"AND","builderList":"cbl_m_List","builder":"m_value_equal","value":"1","value_display":"百分制"}]`,
            pageSize: 99,
            pageNumber: 1
        };

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: 'https://ehall.szu.edu.cn/gsapp/sys/xscjglapp/modules/xscjcx/xscjcx_dqx.do',
                headers: headers,
                data: new URLSearchParams(data).toString(),
                onload: function(response) {
                    try {
                        const res = JSON.parse(response.responseText);
                        resolve(res.datas.xscjcx_dqx.rows);
                    } catch (error) {
                        reject(error);
                    }
                },
                onerror: reject
            });
        });
    }

    // Binary search for the course score
    async function query(courseName) {
        let lScore = 0;
        let rScore = 100;
        let a = 1;

        while (lScore <= rScore) {
            let mid = Math.round((lScore + rScore) / 2 * 10) / 10;
            const res = await query_gte(mid);

            if (a === 1) {
                console.log(res);
                a = 2;
            }

            if (JSON.stringify(res).includes(courseName)) {
                lScore = mid;
            } else {
                rScore = mid;
            }

            if (rScore - lScore <= 0.11) {
                if (JSON.stringify(await query_gte(rScore)).includes(courseName)) {
                    return rScore;
                } else {
                    return lScore;
                }
            }
        }

        return lScore;
    }

    // Function to calculate GPA based on score
    function getGrade(score) {
        const roundScore = Math.round(score);
        if (roundScore >= 90) return 4.0;
        else if (roundScore >= 85) return 3.5;
        else if (roundScore >= 80) return 3.0;
        else if (roundScore >= 75) return 2.5;
        else if (roundScore >= 70) return 2.0;
        else if (roundScore >= 65) return 1.5;
        else if (roundScore >= 60) return 1.0;
        else return 0.0;
    }

    // Function to create and display the centered output
    function createCenteredOutput(content) {
        const outputDiv = document.createElement('div');
        outputDiv.style.position = 'fixed';
        outputDiv.style.top = '30%';
        outputDiv.style.left = '50%';
        outputDiv.style.transform = 'translate(-50%, -50%)';
        outputDiv.style.backgroundColor = '#fff';
        outputDiv.style.border = '1px solid #000';
        outputDiv.style.padding = '20px';
        outputDiv.style.zIndex = 9999;
        outputDiv.style.maxWidth = '80%';
        outputDiv.style.textAlign = 'center';
        outputDiv.style.fontFamily = 'Arial, sans-serif';
        outputDiv.style.fontSize = '16px';
        outputDiv.innerHTML = content;
        document.body.appendChild(outputDiv);
        return outputDiv;
    }

    // Main function to run the script
    async function run() {
        // Fetch the cookies and set up the cookies object
        let loadingMessage = createCenteredOutput('查询中...，请稍等几分钟，我们是二分查找（一个一个试），所以不能直接一次查询直接成功！');
        const cookie = document.cookie;
        const cookies = {};
        cookie.split(';').forEach(item => {
            const [key, value] = item.trim().split('=');
            cookies[key] = value;
        });

        // Query all courses with a grade of 0 or higher
        const coursesList = await query_gte(0);
        const courseNames = coursesList.map(c => ({
            courseName: c.KCMC,
            score: 0,
            credit: c.XF
        }));

        let output = `共有 ${courseNames.length} 门百分制课程<br><br>`;

        // Query each course for its score
        for (let course of courseNames) {
            course.score = await query(course.courseName);
            output += `${course.courseName}  ${course.score}<br>`;
        }

        output += '<br>----------查询完毕----------<br>';

        // Calculate total credit, total grade, and total score
        let totalCredit = 0;
        let totalGrade = 0;
        let totalScore = 0;
        for (let course of courseNames) {
            totalCredit += course.credit;
            totalGrade += course.credit * getGrade(course.score);
            totalScore += course.credit * course.score;
        }

        output += `总学分: ${totalCredit}<br>`;
        output += `总GPA: ${Math.round(totalGrade / totalCredit * 10000) / 10000}<br>`;
        output += `总百分制分数: ${Math.round(totalScore / totalCredit * 10000) / 10000}<br>`;

        // Display the output in the center of the page
        if (loadingMessage) {
            loadingMessage.remove(); // 使用 remove() 方法移除元素
        }
        createCenteredOutput(output);
    }

    // Run the script
    run().catch(console.error);
})();
