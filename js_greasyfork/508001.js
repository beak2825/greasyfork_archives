// ==UserScript==
// @name         BOSS Job Filter
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  筛选BOSS直聘上的工作岗位
// @author       Shaojie
// @license      MIT
// @match        https://www.zhipin.com/job_detail/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/508001/BOSS%20Job%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/508001/BOSS%20Job%20Filter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 筛选条件设置
    const filters = {
        jobTitle: ["前端开发", "Java工程师"], // 你想要的职位名称
        minSalary: 15000, // 最低薪资（元）
        maxSalary: 30000, // 最高薪资（元）
        location: ["北京", "上海"], // 工作地点
        experienceRequired: "3-5年" // 经验要求
    };

    // 获取所有岗位
    const jobItems = document.querySelectorAll('.job-list .job-card-wrapper');

    jobItems.forEach(job => {
        const title = job.querySelector('.job-name a').textContent.trim();
        const salaryText = job.querySelector('.red').textContent.trim();
        const locationText = job.querySelector('.job-area').textContent.trim();
        const experienceText = job.querySelector('.info-primary p').textContent.split('|')[1].trim();

        // 解析薪资范围
        const salaryRange = salaryText.split('-').map(s => parseInt(s.replace(/[^0-9]/g, ''), 10));

        // 判断职位是否符合筛选条件
        const isTitleMatched = filters.jobTitle.some(keyword => title.includes(keyword));
        const isSalaryMatched = salaryRange[0] >= filters.minSalary && salaryRange[1] <= filters.maxSalary;
        const isLocationMatched = filters.location.includes(locationText);
        const isExperienceMatched = experienceText === filters.experienceRequired;

        // 如果不符合条件，隐藏该职位
        if (!(isTitleMatched && isSalaryMatched && isLocationMatched && isExperienceMatched)) {
            job.style.display = 'none';
        }
    });
})();
