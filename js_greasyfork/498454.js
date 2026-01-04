// ==UserScript==
// @name         Display Homework and Exam Scores for Courses (Filtered & Sorted)
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  在页面上显示各课程的作业和考试分数，并按 activity_id 升序排列，仅显示特定 API 中的作业和考试
// @author       Cold_Ink
// @match        *://courses.zju.edu.cn/course/*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/498454/Display%20Homework%20and%20Exam%20Scores%20for%20Courses%20%28Filtered%20%20Sorted%29.user.js
// @updateURL https://update.greasyfork.org/scripts/498454/Display%20Homework%20and%20Exam%20Scores%20for%20Courses%20%28Filtered%20%20Sorted%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 从 URL 中提取课程 ID
    const courseUrlMatch = window.location.pathname.match(/\/course\/(\d+)\//);
    if (!courseUrlMatch) {
        console.error('无法从 URL 中找到课程 ID。');
        return;
    }
    const courseId = courseUrlMatch[1];

    // 创建一个容器来显示分数
    const scoreContainer = document.createElement('div');
    scoreContainer.id = 'score-container';
    scoreContainer.style.position = 'fixed';
    scoreContainer.style.bottom = '10px';
    scoreContainer.style.right = '10px';
    scoreContainer.style.zIndex = '1000';
    scoreContainer.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
    scoreContainer.style.border = '1px solid #ccc';
    scoreContainer.style.borderRadius = '5px';
    scoreContainer.style.boxShadow = '0 0 5px rgba(0,0,0,0.1)';
    scoreContainer.style.maxHeight = '400px';
    scoreContainer.style.overflowY = 'auto';
    scoreContainer.style.padding = '10px';
    scoreContainer.style.width = '300px';
    scoreContainer.style.fontFamily = 'Arial, sans-serif';
    scoreContainer.style.fontSize = '12px';
    scoreContainer.style.lineHeight = '1.4';
    scoreContainer.style.color = '#333';
    scoreContainer.innerHTML = '<h4 style="margin: 0 0 10px 0; font-size: 14px; text-align: center;">作业与考试分数</h4>';
    document.body.appendChild(scoreContainer);

    // 定义 API URL
    const activityReadsUrl = `https://courses.zju.edu.cn/api/course/${courseId}/activity-reads-for-user`;
    const homeworkScoresUrl = `https://courses.zju.edu.cn/api/course/${courseId}/homework-scores?fields=id,title`;
    const examScoresUrl = `https://courses.zju.edu.cn/api/courses/${courseId}/exam-scores?no-intercept=true`;
    const examsUrl = `https://courses.zju.edu.cn/api/courses/${courseId}/exams`;

    // 同时获取四个 API 的数据
    Promise.all([
        fetch(activityReadsUrl).then(response => {
            if (!response.ok) {
                throw new Error(`无法获取 activity_reads 数据: ${response.statusText}`);
            }
            return response.json();
        }),
        fetch(homeworkScoresUrl).then(response => {
            if (!response.ok) {
                throw new Error(`无法获取 homework_scores 数据: ${response.statusText}`);
            }
            return response.json();
        }),
        fetch(examScoresUrl).then(response => {
            if (!response.ok) {
                throw new Error(`无法获取 exam_scores 数据: ${response.statusText}`);
            }
            return response.json();
        }),
        fetch(examsUrl).then(response => {
            if (!response.ok) {
                throw new Error(`无法获取 exams 数据: ${response.statusText}`);
            }
            return response.json();
        })
    ])
    .then(([activityReadsData, homeworkScoresData, examScoresData, examsData]) => {
        displayScores(activityReadsData, homeworkScoresData, examScoresData, examsData);
    })
    .catch(error => {
        console.error('获取数据时出错:', error);
        scoreContainer.innerHTML += `<p style="color: red; text-align: center; margin: 0;">获取分数数据时出错</p>`;
    });

    function displayScores(activityReadsData, homeworkScoresData, examScoresData, examsData) {
        const activityReads = activityReadsData.activity_reads;
        const homeworkActivities = homeworkScoresData.homework_activities;
        const examScores = examScoresData.exam_scores;
        const exams = examsData.exams;

        if ((!activityReads || activityReads.length === 0) && (!examScores || examScores.length === 0)) {
            scoreContainer.innerHTML += '<p style="text-align: center; margin: 0;"><strong>当前课程没有作业或考试数据。</strong></p>';
            return;
        }

        if ((!homeworkActivities || homeworkActivities.length === 0) && (!exams || exams.length === 0)) {
            scoreContainer.innerHTML += '<p style="text-align: center; margin: 0;"><strong>没有作业或考试活动标题数据。</strong></p>';
            return;
        }

        // 创建一个活动 ID 到作业标题的映射
        const homeworkMap = new Map();
        if (homeworkActivities && homeworkActivities.length > 0) {
            homeworkActivities.forEach(activity => {
                homeworkMap.set(activity.id, activity.title);
            });
        }

        // 创建一个活动 ID 到考试标题的映射
        const examsMap = new Map();
        if (exams && exams.length > 0) {
            exams.forEach(exam => {
                examsMap.set(exam.id, exam.title);
            });
        }

        // 创建一个活动 ID 到作业分数的映射（来自 activity_reads-for-user）
        const homeworkScoresMap = new Map();
        if (activityReads && activityReads.length > 0) {
            activityReads.forEach(activityRead => {
                const activityId = activityRead.activity_id;
                if (homeworkMap.has(activityId)) { // 仅处理在 homeworkMap 中存在的 activity_id
                    const score = (activityRead.data && activityRead.data.score !== undefined && activityRead.data.score !== null) ? activityRead.data.score : '—';
                    homeworkScoresMap.set(activityId, score);
                }
            });
        }

        // 创建一个活动 ID 到考试分数的映射（来自 exam-scores）
        const examScoresMap = new Map();
        if (examScores && examScores.length > 0) {
            examScores.forEach(examScore => {
                const activityId = examScore.activity_id;
                if (activityId !== 0) { // 过滤掉无效的 activity_id
                    const score = (examScore.score !== undefined && examScore.score !== null) ? examScore.score : '—';
                    examScoresMap.set(activityId, score);
                }
            });
        }

        // 合并作业和考试的 activity_id
        const combinedActivityIds = new Set([
            ...homeworkScoresMap.keys(),
            ...examScoresMap.keys()
        ]);

        if (combinedActivityIds.size === 0) {
            scoreContainer.innerHTML += '<p style="text-align: center; margin: 0;"><strong>没有匹配的作业或考试数据。</strong></p>';
            return;
        }

        // 按 activity_id 升序排序
        const sortedActivityIds = Array.from(combinedActivityIds).sort((a, b) => a - b);

        // 使用表格布局来紧凑显示
        const table = document.createElement('table');
        table.style.width = '100%';
        table.style.borderCollapse = 'collapse';

        sortedActivityIds.forEach(activityId => {
            let title = '';
            let score = '—';

            if (homeworkScoresMap.has(activityId)) {
                title = homeworkMap.get(activityId) || `作业 ID ${activityId}`;
                score = homeworkScoresMap.get(activityId);
            } else if (examScoresMap.has(activityId)) {
                title = examsMap.get(activityId) || `考试 ID ${activityId}`;
                score = examScoresMap.get(activityId);
            }

            const row = document.createElement('tr');

            const titleCell = document.createElement('td');
            titleCell.textContent = title;
            titleCell.style.padding = '4px 6px';
            titleCell.style.borderBottom = '1px solid #eee';
            titleCell.style.width = '70%';
            titleCell.style.wordBreak = 'break-word';
            titleCell.style.fontWeight = 'bold';
            titleCell.style.fontSize = '13px';

            const scoreCell = document.createElement('td');
            scoreCell.textContent = score;
            scoreCell.style.padding = '4px 6px';
            scoreCell.style.borderBottom = '1px solid #eee';
            scoreCell.style.textAlign = 'right';
            scoreCell.style.width = '30%';
            scoreCell.style.fontSize = '13px';
            scoreCell.style.color = score === '—' ? '#999' : '#000';

            row.appendChild(titleCell);
            row.appendChild(scoreCell);
            table.appendChild(row);
        });

        scoreContainer.appendChild(table);
    }
})();
