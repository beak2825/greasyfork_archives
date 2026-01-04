// ==UserScript==
// @name         有道答疑助手
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Automatically expand all problem lists and fetch problem titles
// @author       You
// @match        https://oj.youdao.com/course/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/523738/%E6%9C%89%E9%81%93%E7%AD%94%E7%96%91%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/523738/%E6%9C%89%E9%81%93%E7%AD%94%E7%96%91%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义请求间隔时间（毫秒为单位），例如5秒
    const REQUEST_INTERVAL = 5000;  // 每5秒为一个题目发送一次请求


    // 自动展开所有题目单元
    function expandAllUnits() {
        const svgElements = document.querySelectorAll('[class^="_courseId__unit_main__"]');

        svgElements.forEach(svg => {
            let style = svg.getAttribute('style');
            if (style && style.includes('display:none')) {
                svg.setAttribute('style', style.replace('display:none', 'display:block'));
            } else {
                svg.setAttribute('style', 'display:block');
            }
        });
    }

    // 页面加载完成后执行展开操作
    window.addEventListener('load', () => {
        // 定义 localStorage 存储键名
        const STORAGE_KEY = 'problem_titles_cache';

        // 获取 localStorage 中的缓存题目信息
        let cachedTitles = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};

        console.log('Initial cached titles:', cachedTitles);

        console.log('Page loaded, expanding all units...');
        expandAllUnits();

        // 获取页面上所有 <li> 元素
        const listItems = document.querySelectorAll('[class^="CourseStep_step_tags_item__"]');

        // 处理没有缓存的 problemId 数组
        const problemsToFetch = [];

        // 遍历每个 <li> 元素，优先显示缓存中的数据
        listItems.forEach((li) => {
            const aTag = li.querySelector('a');
            const href = aTag.getAttribute('href');

            // 从 href 中提取 courseId、lessonId、lessonProblemType 和 problemId
            const courseAndLessonPart = href.split('#')[0].split('/');
            const problemPart = href.split('#/1/')[1];

            const courseId = courseAndLessonPart[2];  // 提取 courseId
            const lessonId = courseAndLessonPart[3];  // 提取 lessonId
            const lessonProblemType = courseAndLessonPart[4];  // 提取 lessonProblemType
            const problemId = problemPart;  // 提取 problemId

            // 如果本地缓存中有对应的 problemId 数据，立即显示标题
            if (cachedTitles[problemId]) {
                console.log(`Using cached title for problemId ${problemId}: ${cachedTitles[problemId]}`);
                const titleSpan = document.createElement('span');
                titleSpan.textContent = ` - ${cachedTitles[problemId]}`;
                li.appendChild(titleSpan);
            } else {
                // 如果没有缓存，将问题的相关信息添加到待请求的数组中
                problemsToFetch.push({ li, courseId, lessonId, lessonProblemType, problemId });
            }
        });

        // 对于没有缓存的题目，按顺序发送请求，并延时
        problemsToFetch.forEach((problem, index) => {
            setTimeout(() => {
                console.log(`Fetching title for problemId: ${problem.problemId}`);

                // 发送请求获取题目信息
                const requestBody = {
                    courseId: problem.courseId,
                    problemId: problem.problemId,
                    lessonId: problem.lessonId,
                    lessonProblemType: problem.lessonProblemType
                };

                // 输出发送请求的参数
                console.log(`Request parameters for problemId ${problem.problemId}:`, requestBody);

                fetch('https://icodecontest-online-api.youdao.com/api/course/lesson/problem/detail', {
                    method: 'POST',
                    headers: {
                        'accept': 'application/json, text/plain, */*',
                        'content-type': 'application/json;charset=UTF-8',
                    },
                    body: JSON.stringify(requestBody),
                    credentials: 'include',
                })
                .then(response => response.json())
                .then(data => {
                    console.log(`Received response for problemId ${problem.problemId}:`, data);

                    if (data.code === 0) {
                        const title = data.data.title;

                        // 保存到本地缓存
                        cachedTitles[problem.problemId] = title;
                        localStorage.setItem(STORAGE_KEY, JSON.stringify(cachedTitles));

                        console.log(`Title for problemId ${problem.problemId} saved to cache: ${title}`);

                        // 在 <li> 标签中附加题目标题
                        const titleSpan = document.createElement('span');
                        titleSpan.textContent = ` - ${title}`;
                        problem.li.appendChild(titleSpan);
                    } else {
                        console.error(`Failed to fetch title for problemId ${problem.problemId}:`, data.msg);
                    }
                })
                .catch(error => {
                    console.error('Error fetching problem details:', error);
                });
            }, REQUEST_INTERVAL * index);  // 延时发送请求，每个请求的延迟时间由索引决定
        });
    });
})();
