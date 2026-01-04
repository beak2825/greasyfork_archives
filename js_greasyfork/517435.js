// ==UserScript==
// @name         四川云教
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  简化点击
// @author       Your Name
// @match        https://yj.scedu.com.cn/*
// @license      MIT
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/517435/%E5%9B%9B%E5%B7%9D%E4%BA%91%E6%95%99.user.js
// @updateURL https://update.greasyfork.org/scripts/517435/%E5%9B%9B%E5%B7%9D%E4%BA%91%E6%95%99.meta.js
// ==/UserScript==
(function() {
    'use strict';
    console.log("脚本已加载...");

    const defaultOptions = {
        option: 'option1',
        subject: 'chinese'
    };

    // 从GM_getValue读取变量值
    let selectedOption = GM_getValue('option', defaultOptions.option);
    let selectedSubject = GM_getValue('subject', defaultOptions.subject);
    console.log('读取的班级选项:', selectedOption);
    console.log('读取的科目选项:', selectedSubject);

    // 设置classname根据subject
    const subjectMap = {
        chinese: '语文',
        math: '数学',
        english: '英语'
    };
    let classname = subjectMap[selectedSubject] || '';

// 创建方框的函数
function createContainer(id, position, options, selectedValue) {
    const container = document.createElement('div');
    container.id = id;
    container.style = `display: inline-block; position: fixed; left: ${position.left}; top: ${position.top}; z-index: 999999;`;
    container.innerHTML = `
    <div style="border: 2px solid red; padding: 10px; width: auto; display: flex; align-items: center; flex-wrap: nowrap;">
      ${options.map(option => `
      <label style="margin-right: 10px; display: flex; align-items: center;">
        <input type="radio" name="${id}" value="${option.value}" ${selectedValue === option.value ? 'checked' : ''} style="margin-right: 5px;"> ${option.label}
      </label>
      `).join('')}
    </div>`;

    document.body.appendChild(container);

    // 为每个单选按钮添加事件监听器
    options.forEach(option => {
        container.querySelector(`input[value="${option.value}"]`).addEventListener('click', () => {
            const key = id === 'subject-container' ? 'subject' : 'option';
            GM_setValue(key, option.value); // 保存科目或班级
            console.log(`已保存${key === 'subject' ? '科目' : '班级'}: ${option.value}`);
            console.log(`当前保存的班级是: ${GM_getValue('option')}`);
            console.log(`当前保存的科目是: ${GM_getValue('subject')}`);
        });
    });

    return container;
}


    // 创建第一个方框（班级）
    const classOptions = [
        { value: 'option1', label: '2021级1班' },
        { value: 'option2', label: '2020级5班' }
    ];
    createContainer('sp-ac-container', { left: '10px', top: '10px' }, classOptions, selectedOption);

    // 创建第二个方框（科目）
    const subjectOptions = [
        { value: 'chinese', label: '语文' },
        { value: 'math', label: '数学' },
        { value: 'english', label: '英语' }
    ];
    createContainer('subject-container', { left: '10px', top: '70px' }, subjectOptions, selectedSubject);

    const delay = ms => new Promise(resolve => setTimeout(resolve, ms)); // 延时函数

    async function clickFilterItem(group, index) {
        const items = group.querySelectorAll('.filter-item');
        if (items[index]) {
            await delay(1000);
            items[index].click();
            await delay(3000);
            console.log(`点击班级: ${index + 1}`);
            extractCourseAndDate();
        } else {
            console.warn(`索引超出范围: ${index + 1}`);
        }
    }

    function extractCourseAndDate() {
        const today = new Date().toISOString().split('T')[0]; // 获取今天的日期，格式为YYYY-MM-DD
        console.log(today);

        const dates = Array.from(document.querySelectorAll('.contents .d')).slice(0, 5).map(el => el.innerText.trim());
        const courseInfos = Array.from(document.querySelectorAll('.classNumBoxs .times')).slice(0, 5).flatMap((item, index) => {
            const date = dates[index] || '无';
            return Array.from(item.querySelectorAll('.titlename')).map(title => {
                const classTimeElement = title.querySelector('.classtime');
                const classTime = classTimeElement ? classTimeElement.innerText.trim() : '无';
                if (date === today && classTime.includes(classname)) {
                    console.log(`日期: ${date}，即将点击: ${classTime}...`);
                    classTimeElement.click(); // 执行点击操作
                    return { date, classTime, action: 'clicked' };
                }
                return { date, classTime };
            });
        });

        return courseInfos; // 如果需要使用这些信息，可以返回它
    }

    // 页面加载完成后执行
    const intervalId = window.setInterval(() => {
        if (document.readyState !== "complete") return;

        console.log("等待网页加载...");
        const url = window.location.href;

        if (url === "https://yj.scedu.com.cn/#/OnlineEducation/dashboard") {
            if (document.querySelectorAll('.nav-link').length > 5) {
                console.log("重定向到课程页面...");
                window.location.href = "https://yj.scedu.com.cn/#/OnlineEducation/live";
            }
        }

        if (url.includes("OnlineEducation/live")) {
            console.log("进入课程页面...");
            const filterGroup = document.querySelectorAll('.filter-group');
            if (filterGroup.length > 5) {
                clearInterval(intervalId);
                clickFilterItem(filterGroup[5], selectedOption === 'option1' ? 0 : 1); // 根据选项点击班级
            }
        }

        if (url.includes("dashboard/courseDetails?scheduleId")) {
            console.log("进入视频播放页面...");
            const videoExists = document.querySelectorAll('video').length > 0;
            if (videoExists) {
                const layout=document.querySelectorAll('.resource-layout').length > 0;
                if(layout){
                    document.querySelectorAll('.el-card__body').forEach(card => card.click());
                }
                clearInterval(intervalId);
            } else {
                location.reload();
            }
        }
    }, 5000); // 每5000毫秒检查一次

})();
