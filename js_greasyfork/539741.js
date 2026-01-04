// ==UserScript==
// @name         BUPT教学平台课程提取器 (美化版)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  将本学期所有课程提取到一个美化后的界面中显示
// @author       Xyea
// @match        https://ucloud.bupt.edu.cn/uclass/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539741/BUPT%E6%95%99%E5%AD%A6%E5%B9%B3%E5%8F%B0%E8%AF%BE%E7%A8%8B%E6%8F%90%E5%8F%96%E5%99%A8%20%28%E7%BE%8E%E5%8C%96%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/539741/BUPT%E6%95%99%E5%AD%A6%E5%B9%B3%E5%8F%B0%E8%AF%BE%E7%A8%8B%E6%8F%90%E5%8F%96%E5%99%A8%20%28%E7%BE%8E%E5%8C%96%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待页面完全加载
    window.addEventListener('load', function() {
        // 给脚本一些时间等待动态内容加载
        setTimeout(extractCourses, 500);
        //const originalContainer = document.querySelector('.my-lesson-section');
        //if (originalContainer && originalContainer.parentNode) {
        //    originalContainer.style.display = 'none';
        //}
    });

    function extractCourses() {
        // 获取所有轮播项
        const carouselItems = document.querySelectorAll('.el-carousel__item .my-lesson-group');
        if (!carouselItems || carouselItems.length === 0) {
            console.log('未找到课程项，请确认页面已完全加载');
            // 如果没有找到课程，尝试再次加载
            setTimeout(extractCourses, 2000);
            return;
        }

        // 创建新的课程容器
        const newContainer = document.createElement('div');
        newContainer.className = 'all-courses-container';
        newContainer.style.cssText = `
            margin: 24px auto;
            padding: 24px;
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 4px 16px rgba(0,0,0,0.08);
            max-width: 1200px;
            transition: all 0.3s ease;
        `;

        // 创建标题
        const header = document.createElement('div');
        header.style.cssText = `
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 20px;
            border-bottom: 1px solid #ebeef5;
            padding-bottom: 15px;
        `;

        const titleSection = document.createElement('div');
        titleSection.style.cssText = `
            display: flex;
            align-items: center;
        `;

        // 添加一个小图标
        const icon = document.createElement('div');
        icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: #409EFF;"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></svg>`;
        titleSection.appendChild(icon);

        const title = document.createElement('div');
        title.textContent = '本学期全部课程';
        title.style.cssText = `
            font-size: 18px;
            font-weight: 600;
            color: #303133;
            margin-left: 10px;
        `;
        titleSection.appendChild(title);

        // 添加课程计数
        const courseCount = document.createElement('div');
        courseCount.id = 'course-count';
        courseCount.style.cssText = `
            font-size: 14px;
            color: #909399;
            background-color: #f5f7fa;
            padding: 4px 10px;
            border-radius: 4px;
        `;

        header.appendChild(titleSection);
        header.appendChild(courseCount);
        newContainer.appendChild(header);

        // 创建搜索框
        const searchContainer = document.createElement('div');
        searchContainer.style.cssText = `
            margin-bottom: 20px;
        `;

        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = '搜索课程名称或教师...';
        searchInput.style.cssText = `
            width: 100%;
            padding: 10px 15px;
            border: 1px solid #dcdfe6;
            border-radius: 4px;
            font-size: 14px;
            color: #606266;
            box-sizing: border-box;
            transition: all 0.3s;
            outline: none;
        `;

        searchInput.addEventListener('focus', function() {
            this.style.borderColor = '#409EFF';
            this.style.boxShadow = '0 0 0 2px rgba(64, 158, 255, 0.2)';
        });

        searchInput.addEventListener('blur', function() {
            this.style.borderColor = '#dcdfe6';
            this.style.boxShadow = 'none';
        });

        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const courseItems = document.querySelectorAll('.enhanced-course-item');

            let visibleCount = 0;
            courseItems.forEach(item => {
                const courseName = item.querySelector('.my-lesson-name').textContent.toLowerCase();
                const teacher = item.querySelector('.my-lesson-teachers').textContent.toLowerCase();

                if (courseName.includes(searchTerm) || teacher.includes(searchTerm)) {
                    item.style.display = 'block';
                    visibleCount++;
                } else {
                    item.style.display = 'none';
                }
            });

            // 更新课程计数
            updateCourseCount(visibleCount);
        });

        searchContainer.appendChild(searchInput);
        newContainer.appendChild(searchContainer);

        // 创建课程列表容器
        const coursesContainer = document.createElement('div');
        coursesContainer.style.cssText = `
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 20px;
            justify-content: center;
        `;
        newContainer.appendChild(coursesContainer);

        // 提取所有课程
        let allCourses = [];
        carouselItems.forEach(group => {
            const courses = group.querySelectorAll('.my-lesson-item');
            courses.forEach(course => {
                const clonedCourse = course.cloneNode(true);
                clonedCourse.classList.add('enhanced-course-item');

                // 隐藏原图片
                const img = clonedCourse.querySelector('.my-lesson-post');
                if (img) {
                    img.style.display = 'none';
                }

                // 生成随机浅色背景
                const hue = Math.floor(Math.random() * 360);
                const pastelColor = `hsl(${hue}, 70%, 95%)`;
                const darkerColor = `hsl(${hue}, 70%, 90%)`;

                // 创建一个小图标作为视觉元素
                const courseIcon = document.createElement('div');
                courseIcon.style.cssText = `
                    width: 40px;
                    height: 40px;
                    border-radius: 8px;
                    background-color: ${pastelColor};
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 12px;
                    color: hsl(${hue}, 70%, 40%);
                    font-weight: bold;
                    font-size: 18px;
                `;

                // 获取课程名称的首字母作为图标文本
                const courseName = clonedCourse.querySelector('.my-lesson-name').textContent.trim();
                courseIcon.textContent = courseName.charAt(0);

                // 调整样式以适应新的布局
                clonedCourse.style.cssText = `
                    height: auto;
                    padding: 16px;
                    background-color: #ffffff;
                    border-radius: 8px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
                    margin: 0;
                    transition: all 0.3s;
                    display: flex;
                    flex-direction: column;
                    border: 1px solid #ebeef5;
                    position: relative;
                    overflow: hidden;
                `;

                // 在卡片底部添加一个彩色条纹
                const colorStrip = document.createElement('div');
                colorStrip.style.cssText = `
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    height: 4px;
                    width: 100%;
                    background-color: ${darkerColor};
                `;
                clonedCourse.appendChild(colorStrip);

                // 将现有内容包装在div中
                const contentWrapper = document.createElement('div');

                // 移动现有内容到包装器
                while (clonedCourse.firstChild && clonedCourse.firstChild !== colorStrip) {
                    contentWrapper.appendChild(clonedCourse.firstChild);
                }

                // 重新组织内容
                clonedCourse.appendChild(courseIcon);
                clonedCourse.appendChild(contentWrapper);

                // 确保文本内容可见并样式正确
                const courseNameElem = contentWrapper.querySelector('.my-lesson-name');
                const courseTeachers = contentWrapper.querySelector('.my-lesson-teachers');
                const courseArea = contentWrapper.querySelector('.my-lesson-area');

                if (courseNameElem) {
                    courseNameElem.style.cssText = `
                        font-size: 15px;
                        font-weight: 600;
                        color: #303133;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;  /* 确保文本不换行 */
                        display: block;  /* 使元素为块级元素 */
                        width: 100%;  /* 确保容器宽度限制 */
                        margin-bottom: 8px;
                        line-height: 1.4;
                     `;

                    // 为课程名称添加 title 属性，悬停时显示完整课程名
                    courseNameElem.setAttribute('title', courseName);
                }

                if (courseTeachers) {
                    courseTeachers.style.cssText = `
                        font-size: 13px;
                        color: #606266;
                        margin-top: 5px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        display: flex;
                        align-items: center;
                    `;

                    // 添加教师图标
                    const teacherIcon = document.createElement('span');
                    teacherIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 4px;margin-top: 4px;"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`;
                    courseTeachers.insertBefore(teacherIcon, courseTeachers.firstChild);
                }

                if (courseArea) {
                    courseArea.style.cssText = `
                        font-size: 13px;
                        color: #909399;
                        margin-top: 8px;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                        display: flex;
                        align-items: center;
                    `;

                    // 添加区域图标
                    const areaIcon = document.createElement('span');
                    areaIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 4px;margin-top: 4px;"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`;
                    courseArea.insertBefore(areaIcon, courseArea.firstChild);
                }

                // 鼠标悬停效果
                clonedCourse.addEventListener('mouseover', function() {
                    this.style.backgroundColor = '#f9fafc';
                    this.style.boxShadow = '0 6px 16px rgba(0,0,0,0.1)';
                    this.style.transform = 'translateY(-2px)';
                });

                clonedCourse.addEventListener('mouseout', function() {
                    this.style.backgroundColor = '#ffffff';
                    this.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
                    this.style.transform = 'translateY(0)';
                });

                // 添加点击事件 - 跳转到原课程链接
                clonedCourse.style.cursor = 'pointer';
                clonedCourse.addEventListener('click', function() {
                    // 获取课程名称用于查找原始元素
                    const name = this.querySelector('.my-lesson-name').textContent.trim();

                    // 查找原始课程元素
                    const originalCourses = document.querySelectorAll('.my-lesson-item');
                    for (let i = 0; i < originalCourses.length; i++) {
                        const originalName = originalCourses[i].querySelector('.my-lesson-name').textContent.trim();
                        if (originalName === name) {
                            originalCourses[i].click();
                            break;
                        }
                    }
                });

                allCourses.push(clonedCourse);
            });
        });

        // 将所有课程添加到新容器
        allCourses.forEach(course => {
            coursesContainer.appendChild(course);
        });


        // 获取原始课程容器的父元素
        const originalContainer = document.querySelector('.my-lesson-section');
        if (originalContainer && originalContainer.parentNode) {
            // 在原始容器后面插入新容器
            originalContainer.parentNode.insertBefore(newContainer, originalContainer.nextSibling);
            // 先隐藏原始容器
            originalContainer.style.display = 'none';
        }

        // 更新课程计数
        updateCourseCount(allCourses.length);

        console.log('成功提取并展示了 ' + allCourses.length + ' 门课程');
    }

    // 更新课程计数的辅助函数
    function updateCourseCount(count) {
        const countElement = document.getElementById('course-count');
        if (countElement) {
            countElement.textContent = `共 ${count} 门课程`;
        }
    }
})();