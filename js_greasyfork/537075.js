// ==UserScript==
// @name         岐黄天使刷课助手 - 课程导航模块
// @namespace    http://tampermonkey.net/qhtx-modules
// @version      1.3.1
// @description  岐黄天使刷课助手的课程导航功能模块，负责课程的识别、切换和状态管理。
// @author       AI助手
// ==/UserScript==

// 课程导航模块
(function() {
    'use strict';

    // 收集课程链接，用于上一课/下一课导航
    window.collectCourseLinks = function(doc) {
        try {
            // 收集所有课程链接（包括已完成和未完成的）
            const allCourseLinks = doc.querySelectorAll('.append-plugin-tip > a, .content-unstart a, .content-learning a, .content-finished a');

            if (allCourseLinks.length > 0) {
                console.log('找到课程链接数量:', allCourseLinks.length);

                window.qh.courseList = Array.from(allCourseLinks).map((link, index) => {
                    return {
                        index: index,
                        title: link.textContent.trim() || `课程 ${index + 1}`,
                        element: link,
                        status: link.closest('.content-finished') ? '已完成' : '未完成'
                    };
                });

                // 找到当前正在播放的课程
                const activeLink = doc.querySelector('.active a');
                if (activeLink) {
                    const activeIndex = Array.from(allCourseLinks).findIndex(link => link.href === activeLink.href);
                    if (activeIndex !== -1) {
                        window.qh.currentCourseIndex = activeIndex;
                        console.log('当前课程索引:', window.qh.currentCourseIndex, '课程标题:', window.qh.courseList[window.qh.currentCourseIndex].title);
                    }
                } else {
                    // 如果找不到活动链接，尝试通过其他方式确定当前课程
                    const activeItem = doc.querySelector('.active') || doc.querySelector('.content-learning');
                    if (activeItem) {
                        // 尝试找到最接近的课程链接
                        const nearestLink = activeItem.querySelector('a');
                        if (nearestLink) {
                            const nearestIndex = Array.from(allCourseLinks).findIndex(link =>
                                link.textContent.trim() === nearestLink.textContent.trim());
                            if (nearestIndex !== -1) {
                                window.qh.currentCourseIndex = nearestIndex;
                                console.log('通过活动项找到当前课程索引:', window.qh.currentCourseIndex);
                            }
                        }
                    }
                }

                // 只有在面板已创建的情况下才更新导航按钮
                if (window.qh.panelCreated && document.getElementById('qh-assistant-panel')) {
                    updateNavButtons();
                }
                return;
            } else {
                console.log('未找到标准课程链接，尝试查找其他课程元素');

                // 尝试查找新的课程结构 (.new_bg 元素)
                // 处理多层嵌套目录结构
                const courseSections = doc.querySelectorAll('.muli1, .xulun');
                courseSections.forEach(section => {
                    const titles = section.querySelectorAll('.title');
                    titles.forEach(title => {
                        const chapterId = title.id || '';
                        const chapterNum = title.querySelector('b')?.textContent.trim() || '';
                        const chapterName = title.querySelector('span')?.textContent.trim() || '';

                        // 获取子课程项
                        const courseItems = title.nextElementSibling?.querySelectorAll('.new_bg') || [];
                        courseItems.forEach(item => {
                            const courseId = item.id;
                            const onclickFn = item.getAttribute('onclick') || '';
                            const videoIdMatch = onclickFn.match(/getvideoUrl\((\d+),/);
                            const videoId = videoIdMatch ? videoIdMatch[1] : '';

                            const titleElement = item.querySelector('.new_biaoti');
                            let courseTitle = titleElement?.textContent.replace(/^视频\s*/, '') || '';

                            // 添加data属性
                            item.dataset.courseId = courseId;
                            item.dataset.videoId = videoId;
                            item.dataset.chapterId = chapterId;

                            window.qh.courseList.push({
                                id: courseId,
                                videoId: videoId,
                                chapterId: chapterId,
                                title: `${chapterNum} ${chapterName} - ${courseTitle}`,
                                element: item,
                                status: item.querySelector('.text-primary') ? '已完成' : '进行中'
                            });
                        });
                    });
                });

                if (window.qh.courseList.length > 0) {
                    console.log('解析到嵌套课程结构数量:', window.qh.courseList.length);

                    // 使用getCourseList函数获取按顺序排列的课程列表
                    window.qh.courseList = getCourseList(doc);

                    // 增强活动项检测逻辑
                    const activeItem = doc.querySelector('.new_bg.active, .new_bg[style*="background"], .studystate.text-success');
                    if (activeItem) {
                        const newBgElements = doc.querySelectorAll('.new_bg');
                        const activeIndex = Array.from(newBgElements).indexOf(activeItem);
                        if (activeIndex !== -1) {
                            window.qh.currentCourseIndex = activeIndex;
                            console.log('从新课程结构中找到当前课程索引:', window.qh.currentCourseIndex);
                        }
                    }

                    // 只有在面板已创建的情况下才更新导航按钮
                    if (window.qh.panelCreated && document.getElementById('qh-assistant-panel')) {
                        updateNavButtons();
                    }
                    return;
                }

                // 尝试从其他元素收集课程信息
                const courseItems = doc.querySelectorAll('.course-item, .video-item, li[data-id], .kecheng-item');
                if (courseItems.length > 0) {
                    console.log('找到备选课程项数量:', courseItems.length);

                    window.qh.courseList = Array.from(courseItems).map((item, index) => {
                        const link = item.querySelector('a') || item;
                        let title = '';

                        // 尝试从不同元素获取标题
                        const titleElement = item.querySelector('.title, .name, .course-name, .video-title');
                        if (titleElement) {
                            title = titleElement.textContent.trim();
                        } else {
                            title = item.textContent.trim() || `课程 ${index + 1}`;
                        }

                        // 确定状态
                        const status = item.classList.contains('finished') ||
                                      item.classList.contains('complete') ||
                                      item.querySelector('.complete, .finished, .done') ?
                                      '已完成' : '未完成';

                        return {
                            index: index,
                            title: title,
                            element: link,
                            status: status
                        };
                    });

                    // 尝试找到当前活动项
                    const activeItem = doc.querySelector('.active, .current, .playing, .selected');
                    if (activeItem) {
                        const activeIndex = Array.from(courseItems).indexOf(activeItem);
                        if (activeIndex !== -1) {
                            window.qh.currentCourseIndex = activeIndex;
                            console.log('从备选项中找到当前课程索引:', window.qh.currentCourseIndex);
                        }
                    }

                    // 只有在面板已创建的情况下才更新导航按钮
                    if (window.qh.panelCreated && document.getElementById('qh-assistant-panel')) {
                        updateNavButtons();
                    }
                }
            }
        } catch (e) {
            console.error('收集课程链接时发生错误:', e);
        }
    };

    // 从课程列表中收集课程
    window.collectCoursesFromList = function(doc) {
        try {
            const coursesInList = doc.querySelectorAll('.mycourse-row');

            if (coursesInList.length > 0) {
                window.qh.courseList = Array.from(coursesInList).map((row, index) => {
                    const link = row.querySelector('a');
                    const title = row.innerText.split('\t')[0].split('\n\n')[1]?.replace("\n", "") || `课程 ${index + 1}`;
                    const status = row.innerText.includes('未完成') || row.innerText.includes('未开始') ? '未完成' : '已完成';

                    return {
                        index: index,
                        title: title,
                        element: link,
                        status: status
                    };
                });

                // 只有在面板已创建的情况下才更新导航按钮
                if (window.qh.panelCreated && document.getElementById('qh-assistant-panel')) {
                    updateNavButtons();
                }
            }
        } catch (e) {
            console.error('从课程列表收集课程时发生错误:', e);
        }
    };

    // 更新导航按钮状态
    window.updateNavButtons = function() {
        // 延迟执行，确保面板已创建
        setTimeout(() => {
            const prevBtn = document.getElementById('qh-prev-btn');
            const nextBtn = document.getElementById('qh-next-btn');

            if (!prevBtn || !nextBtn) {
                console.debug('导航按钮元素未找到，可能面板未完全创建');
                return;
            }

            // 确保课程列表和索引已初始化
            if (!window.qh.courseList) {
                window.qh.courseList = [];
            }

            if (typeof window.qh.currentCourseIndex !== 'number') {
                window.qh.currentCourseIndex = 0;
            }

            // 检查课程列表是否有内容
            if (window.qh.courseList.length === 0) {
                prevBtn.disabled = true;
                nextBtn.disabled = true;
                prevBtn.textContent = '上一课';
                nextBtn.textContent = '下一课';
                console.log('课程列表为空，禁用导航按钮');

                // 尝试重新收集课程列表
                if (typeof collectCourseLinks === 'function') {
                    console.log('尝试重新收集课程列表...');
                    collectCourseLinks(document);
                }
            }

            // 更新按钮状态
            const canGoPrev = window.qh.currentCourseIndex > 0;
            const canGoNext = window.qh.currentCourseIndex < window.qh.courseList.length - 1;

            prevBtn.disabled = !canGoPrev;
            nextBtn.disabled = !canGoNext;

            console.log('更新导航按钮状态:',
                        '上一课:', canGoPrev ? '启用' : '禁用',
                        '下一课:', canGoNext ? '启用' : '启用',
                        '当前索引:', window.qh.currentCourseIndex,
                        '课程总数:', window.qh.courseList.length);

            // 更新按钮文本，显示上一课/下一课的标题
            if (window.qh.currentCourseIndex > 0 && window.qh.courseList[window.qh.currentCourseIndex - 1]) {
                const prevTitle = window.qh.courseList[window.qh.currentCourseIndex - 1].title;
                prevBtn.title = prevTitle;
                // 如果标题太长，截断显示
                prevBtn.textContent = '上一课: ' + (prevTitle.length > 10 ? prevTitle.substring(0, 10) + '...' : prevTitle);
            } else {
                prevBtn.textContent = '上一课';
            }

            if (window.qh.currentCourseIndex < window.qh.courseList.length - 1 && window.qh.courseList[window.qh.currentCourseIndex + 1]) {
                const nextTitle = window.qh.courseList[window.qh.currentCourseIndex + 1].title;
                nextBtn.title = nextTitle;
                // 如果标题太长，截断显示
                nextBtn.textContent = '下一课: ' + (nextTitle.length > 10 ? nextTitle.substring(0, 10) + '...' : nextTitle);
            } else {
                nextBtn.textContent = '下一课';
            }

            // 重新绑定按钮点击事件，确保它们能正常工作
            // 先移除旧的事件监听器，避免重复绑定
            const oldPrevHandler = prevBtn.qhPrevHandler;
            const oldNextHandler = nextBtn.qhNextHandler;
            if (oldPrevHandler) prevBtn.removeEventListener('click', oldPrevHandler);
            if (oldNextHandler) nextBtn.removeEventListener('click', oldNextHandler);

            // 添加新的事件监听器
            const newPrevHandler = function() {
                console.log('上一课按钮点击，当前索引:', window.qh.currentCourseIndex);
                if (window.qh.currentCourseIndex > 0) {
                    window.qh.currentCourseIndex--;
                    console.log('新课程索引:', window.qh.currentCourseIndex, '课程标题:', window.qh.courseList[window.qh.currentCourseIndex]?.title);
                    navigateToCourse(window.qh.currentCourseIndex);
                    updateNavButtons();
                }
            };

            const newNextHandler = function() {
                console.log('下一课按钮点击，当前索引:', window.qh.currentCourseIndex);
                if (window.qh.currentCourseIndex < window.qh.courseList.length - 1) {
                    window.qh.currentCourseIndex++;
                    console.log('新课程索引:', window.qh.currentCourseIndex, '课程标题:', window.qh.courseList[window.qh.currentCourseIndex]?.title);
                    navigateToCourse(window.qh.currentCourseIndex);
                    updateNavButtons();
                }
            };

            prevBtn.addEventListener('click', newPrevHandler);
            nextBtn.addEventListener('click', newNextHandler);

            // 保存处理器引用以便后续移除
            prevBtn.qhPrevHandler = newPrevHandler;
            nextBtn.qhNextHandler = newNextHandler;

        }, 100); // 延迟100ms执行
    };

    // 获取课程列表，按照DOM顺序排列
    function getCourseList(doc) {
        try {
            // 尝试查找所有可能的课程元素
            const courseElements = doc.querySelectorAll('.new_bg[onclick*="getvideoUrl"], .new_bg[onclick*="setti"], .kecheng-item[onclick], li[onclick*="getvideoUrl"], li[onclick*="setti"]');

            if (courseElements.length === 0) {
                console.log('未找到课程元素，尝试查找其他类型的课程元素');
            console.log('当前DOM结构:', doc.documentElement.outerHTML.substring(0, 500) + '...');
            console.log('尝试查找的课程元素选择器:', '.new_bg[onclick*="getvideoUrl"], .new_bg[onclick*="setti"], .kecheng-item[onclick], li[onclick*="getvideoUrl"], li[onclick*="setti"]');
                return [];
            }

            console.log(`找到 ${courseElements.length} 个可能的课程元素`);
            if (courseElements.length > 0) {
                console.log('第一个课程元素信息:', {
                    id: courseElements[0].id,
                    onclick: courseElements[0].getAttribute('onclick'),
                    classList: Array.from(courseElements[0].classList),
                    outerHTML: courseElements[0].outerHTML.substring(0, 200) + '...'
                });
            }
            const courses = [];

            // 创建一个映射来存储课程ID和它们的DOM元素
            const courseMap = new Map();

            courseElements.forEach(item => {
                const id = item.id || '';
                const onclickAttr = item.getAttribute('onclick') || '';

                // 提取标题
                const titleElement = item.querySelector('.new_biaoti, .title, .name, .course-name');
                let title = titleElement ? titleElement.textContent.trim() : '';
                // 如果没有找到标题元素，尝试从元素本身获取文本
                if (!title && item.textContent) {
                    title = item.textContent.trim();
                }
                // 移除"视频"等前缀
                title = title.replace(/^(视频|音频|文档)\s*/, '');

                // 确定状态
                const statusElement = item.querySelector('.studystate, .status, .complete, .finished');
                const status = (statusElement && (statusElement.textContent.includes('已学完') || statusElement.textContent.includes('已完成')))
                    || item.classList.contains('finished')
                    || item.classList.contains('complete')
                    ? '已完成' : '未完成';

                // 尝试从onclick属性中提取课程ID和标题
                let courseId = id;
                let matchFound = false;

                // 尝试匹配getvideoUrl模式
                const getvideoUrlMatch = onclickAttr.match(/getvideoUrl\(([^,]+),\s*['"]([^'"]+)['"]\)/);
                if (getvideoUrlMatch) {
                    courseId = getvideoUrlMatch[1];
                    const matchTitle = getvideoUrlMatch[2];
                    if (!title && matchTitle) {
                        title = matchTitle;
                    }
                    matchFound = true;
                }

                // 尝试匹配setti模式
                const settiMatch = onclickAttr.match(/setti\(([^)]+)\)/);
                if (!matchFound && settiMatch) {
                    courseId = settiMatch[1];
                    matchFound = true;
                }

                // 如果找到了匹配，或者onclick属性包含关键字
                if (matchFound || onclickAttr.includes('getvideoUrl') || onclickAttr.includes('setti')) {
                    courseMap.set(courseId, {
                        id: courseId,
                        title: title || `课程 ${courseId}`,
                        element: item,
                        status: status,
                        onclickFn: onclickAttr
                    });
                }
            });

            // 获取所有可能的章节容器
            const chapterContainers = doc.querySelectorAll('.muli1, .chapter, .section, .module');

            // 如果找到章节容器，按照DOM顺序遍历章节和课程
            if (chapterContainers.length > 0) {
                console.log(`找到 ${chapterContainers.length} 个章节容器`);
                let index = 0;
                chapterContainers.forEach(chapter => {
                    // 查找章节内的所有课程元素
                    const courseElementsInChapter = chapter.querySelectorAll('.new_bg[onclick], .kecheng-item[onclick], li[onclick]');
                    courseElementsInChapter.forEach(element => {
                        const id = element.id || '';
                        const onclickAttr = element.getAttribute('onclick') || '';

                        // 尝试从onclick属性中提取课程ID
                        let courseId = id;

                        // 尝试匹配getvideoUrl模式
                        const getvideoUrlMatch = onclickAttr.match(/getvideoUrl\(([^,]+),/);
                        if (getvideoUrlMatch) {
                            courseId = getvideoUrlMatch[1];
                        }

                        // 尝试匹配setti模式
                        const settiMatch = onclickAttr.match(/setti\(([^)]+)\)/);
                        if (settiMatch) {
                            courseId = settiMatch[1];
                        }

                        if (courseMap.has(courseId)) {
                            const course = courseMap.get(courseId);
                            course.index = index++;
                            courses.push(course);
                        } else if (courseMap.has(id)) {
                            const course = courseMap.get(id);
                            course.index = index++;
                            courses.push(course);
                        }
                    });
                });
            }

            // 如果通过章节容器没有找到课程，或者找到的课程数量少于总课程数量的一半，
            // 则直接按照DOM顺序添加所有课程
            if (courses.length === 0 || courses.length < courseMap.size / 2) {
                console.log(`通过章节容器只找到 ${courses.length} 个课程，直接按DOM顺序添加所有课程`);
                courses.length = 0; // 清空数组
                let index = 0;
                courseElements.forEach(element => {
                    const id = element.id || '';
                    const onclickAttr = element.getAttribute('onclick') || '';

                    // 尝试从onclick属性中提取课程ID
                    let courseId = id;

                    // 尝试匹配getvideoUrl模式
                    const getvideoUrlMatch = onclickAttr.match(/getvideoUrl\(([^,]+),/);
                    if (getvideoUrlMatch) {
                        courseId = getvideoUrlMatch[1];
                    }

                    // 尝试匹配setti模式
                    const settiMatch = onclickAttr.match(/setti\(([^)]+)\)/);
                    if (settiMatch) {
                        courseId = settiMatch[1];
                    }

                    if (courseMap.has(courseId)) {
                        const course = courseMap.get(courseId);
                        course.index = index++;
                        courses.push(course);
                    } else if (courseMap.has(id)) {
                        const course = courseMap.get(id);
                        course.index = index++;
                        courses.push(course);
                    }
                });
            }

            console.log(`最终找到 ${courses.length} 个课程，按顺序排列`);
            if (courses.length > 0) {
                console.log('第一个课程详细信息:', {
                    id: courses[0].id,
                    title: courses[0].title,
                    status: courses[0].status,
                    element: courses[0].element ? courses[0].element.outerHTML.substring(0, 200) + '...' : null
                });
            }
            return courses;
        } catch (error) {
            console.error('获取课程列表出错:', error);

            // 如果出错，回退到简单的映射方法
            const courseElements = doc.querySelectorAll('.new_bg[onclick], .kecheng-item[onclick], li[onclick*="getvideoUrl"], li[onclick*="setti"]');
            return Array.from(courseElements).map((item, index) => {
                // 从onclick属性中提取课程ID和标题
                const onclickAttr = item.getAttribute('onclick') || '';
                const courseId = item.id || '';

                // 提取标题
                const titleElement = item.querySelector('.new_biaoti, .title, .name, .course-name');
                let title = titleElement ? titleElement.textContent.trim() : '';
                // 如果没有找到标题元素，尝试从元素本身获取文本
                if (!title && item.textContent) {
                    title = item.textContent.trim();
                }
                // 移除"视频"等前缀
                title = title.replace(/^(视频|音频|文档)\s*/, '');

                // 确定状态
                const statusElement = item.querySelector('.studystate, .status, .complete, .finished');
                const status = (statusElement && (statusElement.textContent.includes('已学完') || statusElement.textContent.includes('已完成')))
                    || item.classList.contains('finished')
                    || item.classList.contains('complete')
                    ? '已完成' : '未完成';

                return {
                    index: index,
                    id: courseId,
                    title: title || `课程 ${index + 1}`,
                    element: item,
                    status: status,
                    onclickFn: onclickAttr
                };
            });
        }
    }

    // 导航到指定索引的课程
    function navigateToCourse(index) {
        console.log('正在切换课程，目标索引:', index);
        try {
            if (index < 0 || index >= window.qh.courseList.length) {
                console.error('无效的课程索引:', index);
                return;
            }

            const targetCourse = window.qh.courseList[index];
            if (targetCourse?.element) {
                console.log('正在跳转至课程:', targetCourse.title);
                targetCourse.element.click();
                // 添加防抖处理防止重复点击
                setTimeout(() => updateNavButtons(), 500);
            }
        } catch (e) {
            console.error('课程切换失败:', e);
        }
    }

    // 导航到上一课
    window.navigateToPrevCourse = function() {
        // 动态更新课程列表
        const mainFrame = document.getElementById('taocan_main_frame');
        const targetDoc = mainFrame ? mainFrame.contentDocument : document;
        collectCourseLinks(targetDoc);

        if (window.qh.currentCourseIndex > 0) {
            console.log('导航到上一课');
            const newIndex = window.qh.currentCourseIndex - 1;

            // 处理iframe嵌套结构
            const targetElement = window.qh.courseList[newIndex].element;
            if (targetElement.closest('iframe')) {
                const iframe = targetElement.closest('iframe');
                iframe.contentWindow.postMessage({
                    type: 'qh-assistant-nav',
                    index: newIndex,
                    courseList: window.qh.courseList
                }, '*');
            }

            // 添加防抖处理
            clearTimeout(window.qh.navigateTimeout);
            window.qh.navigateTimeout = setTimeout(() => {
                window.qh.currentCourseIndex = newIndex;
                navigateToCourse(newIndex);

                setTimeout(() => {
                    updateNavButtons();
                    autoPlayVideo();
                }, 1500);
            }, 500);
        } else {
            console.log('已经是第一课，无法导航到上一课');
        }
    };

    // 导航到下一课
    window.navigateToNextCourse = function() {
        // 防止重复触发
        if (window.qh.isNavigating && window.qh.lastNavigateTime && (Date.now() - window.qh.lastNavigateTime < 3000)) {
            console.log('导航操作过于频繁，忽略本次请求');
            return;
        }

        // 记录导航时间
        window.qh.lastNavigateTime = Date.now();
        window.qh.isNavigating = true;

        console.log('开始下一课导航流程', { currentIndex: window.qh.currentCourseIndex, courseCount: window.qh.courseList?.length });

        // 动态更新课程列表
        const mainFrame = document.getElementById('taocan_main_frame');
        const targetDoc = mainFrame ? mainFrame.contentDocument : document;
        collectCourseLinks(targetDoc);

        if (!window.qh.courseList || window.qh.courseList.length === 0) {
            console.error('课程列表未初始化');
            updateStatus('课程加载中，请稍候...');
            collectCourseLinks(document);
            setTimeout(() => navigateToNextCourse(), 2000);
            return;
        }

        if (window.qh.currentCourseIndex >= window.qh.courseList.length - 1) {
            console.log('已经是最后一课，无法导航到下一课');
            updateStatus('已经是最后一课');
            return;
        }

        const newIndex = window.qh.currentCourseIndex + 1;
        console.log('尝试切换到课程索引:', newIndex, '标题:', window.qh.courseList[newIndex]?.title);

        // 添加iframe支持
        const targetElement = window.qh.courseList[newIndex].element;
        if (targetElement.closest('iframe')) {
            const iframe = targetElement.closest('iframe');
            iframe.contentWindow.postMessage({
                type: 'qh-assistant-nav',
                index: newIndex,
                courseList: window.qh.courseList
            }, '*');
        }

        // 添加防抖处理和状态更新
        clearTimeout(window.qh.navigateTimeout);
        window.qh.navigateTimeout = setTimeout(() => {
            window.qh.currentCourseIndex = newIndex;
            navigateToCourse(newIndex);

            setTimeout(() => {
                if (window.qh.courseList[newIndex]?.element?.offsetParent === null) {
                    console.warn('课程元素不可见，重新收集课程列表');
                    collectCourseLinks(document);
                }
                updateNavButtons();
                autoPlayVideo();

                // 重置导航状态
                setTimeout(() => {
                    window.qh.isNavigating = false;
                    console.log('导航状态已重置');
                }, 3000);
            }, 1500);
        }, 500);
    };
})();