// ==UserScript==
// @name         重庆高等教育智慧教育平台学习助手 || cqooc重庆高等教育智慧教育平台学习助手 || www.cqooc.com
// @namespace    http://tampermonkey.net/
// @version      4.5
// @description  1.看说明就行了。2.反对任何形式牟利，祝各位同学学有所成。3.更新了作业测验作答 4.反馈群：1006332809
// @author       Abstract
// @include      https://*.cqooc.com/*
// @include      https://*.smartedu.cn/*
// @include      https://*.*.smartedu.cn/*
// @grant        none
// @run-at       document-end
// @require      https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js
// @require      https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js
// @require      https://unpkg.com/vue@3/dist/vue.global.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/519976/%E9%87%8D%E5%BA%86%E9%AB%98%E7%AD%89%E6%95%99%E8%82%B2%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B%20%7C%7C%20cqooc%E9%87%8D%E5%BA%86%E9%AB%98%E7%AD%89%E6%95%99%E8%82%B2%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B%20%7C%7C%20wwwcqooccom.user.js
// @updateURL https://update.greasyfork.org/scripts/519976/%E9%87%8D%E5%BA%86%E9%AB%98%E7%AD%89%E6%95%99%E8%82%B2%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B%20%7C%7C%20cqooc%E9%87%8D%E5%BA%86%E9%AB%98%E7%AD%89%E6%95%99%E8%82%B2%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B%20%7C%7C%20wwwcqooccom.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ===============================
    // 常量定义
    // ===============================
    
    const MAIN_PAGE_HOST = 'www.cqooc.com';
    const IFRAME_PAGE_HOST = 'preview.cqooc.com';
    
    // Vue API 变量（稍后初始化）
    let createApp, ref, computed, onMounted, reactive;
    
    const COMPLETION_STATUSES = {
        '未完成': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAABGdBTUEAALGPC/xhBQAACklpQ0NQc1JHQiBJRUM2MTk2Ni0yLjEAAEiJnVN3WJP3Fj7f92UPVkLY8LGXbIEAIiOsCMgQWaIQkgBhhBASQMWFiApWFBURnEhVxILVCkidiOKgKLhnQYqIWotVXDjuH9yntX167+3t+9f7vOec5/zOec8PgBESJpHmomoAOVKFPDrYH49PSMTJvYACFUjgBCAQ5svCZwXFAADwA3l4fnSwP/wBr28AAgBw1S4kEsfh/4O6UCZXACCRAOAiEucLAZBSAMguVMgUAMgYALBTs2QKAJQAAGx5fEIiAKoNAOz0ST4FANipk9wXANiiHKkIAI0BAJkoRyQCQLsAYFWBUiwCwMIAoKxAIi4EwK4BgFm2MkcCgL0FAHaOWJAPQGAAgJlCLMwAIDgCAEMeE80DIEwDoDDSv+CpX3CFuEgBAMDLlc2XS9IzFLiV0Bp38vDg4iHiwmyxQmEXKRBmCeQinJebIxNI5wNMzgwAABr50cH+OD+Q5+bk4eZm52zv9MWi/mvwbyI+IfHf/ryMAgQAEE7P79pf5eXWA3DHAbB1v2upWwDaVgBo3/ldM9sJoFoK0Hr5i3k4/EAenqFQyDwdHAoLC+0lYqG9MOOLPv8z4W/gi372/EAe/tt68ABxmkCZrcCjg/1xYW52rlKO58sEQjFu9+cj/seFf/2OKdHiNLFcLBWK8ViJuFAiTcd5uVKRRCHJleIS6X8y8R+W/QmTdw0ArIZPwE62B7XLbMB+7gECiw5Y0nYAQH7zLYwaC5EAEGc0Mnn3AACTv/mPQCsBAM2XpOMAALzoGFyolBdMxggAAESggSqwQQcMwRSswA6cwR28wBcCYQZEQAwkwDwQQgbkgBwKoRiWQRlUwDrYBLWwAxqgEZrhELTBMTgN5+ASXIHrcBcGYBiewhi8hgkEQcgIE2EhOogRYo7YIs4IF5mOBCJhSDSSgKQg6YgUUSLFyHKkAqlCapFdSCPyLXIUOY1cQPqQ28ggMor8irxHMZSBslED1AJ1QLmoHxqKxqBz0XQ0D12AlqJr0Rq0Hj2AtqKn0UvodXQAfYqOY4DRMQ5mjNlhXIyHRWCJWBomxxZj5Vg1Vo81Yx1YN3YVG8CeYe8IJAKLgBPsCF6EEMJsgpCQR1hMWEOoJewjtBK6CFcJg4Qxwicik6hPtCV6EvnEeGI6sZBYRqwm7iEeIZ4lXicOE1+TSCQOyZLkTgohJZAySQtJa0jbSC2kU6Q+0hBpnEwm65Btyd7kCLKArCCXkbeQD5BPkvvJw+S3FDrFiOJMCaIkUqSUEko1ZT/lBKWfMkKZoKpRzame1AiqiDqfWkltoHZQL1OHqRM0dZolzZsWQ8ukLaPV0JppZ2n3aC/pdLoJ3YMeRZfQl9Jr6Afp5+mD9HcMDYYNg8dIYigZaxl7GacYtxkvmUymBdOXmchUMNcyG5lnmA+Yb1VYKvYqfBWRyhKVOpVWlX6V56pUVXNVP9V5qgtUq1UPq15WfaZGVbNQ46kJ1Bar1akdVbupNq7OUndSj1DPUV+jvl/9gvpjDbKGhUaghkijVGO3xhmNIRbGMmXxWELWclYD6yxrmE1iW7L57Ex2Bfsbdi97TFNDc6pmrGaRZp3mcc0BDsax4PA52ZxKziHODc57LQMtPy2x1mqtZq1+rTfaetq+2mLtcu0W7eva73VwnUCdLJ31Om0693UJuja6UbqFutt1z+o+02PreekJ9cr1Dund0Uf1bfSj9Rfq79bv0R83MDQINpAZbDE4Y/DMkGPoa5hpuNHwhOGoEctoupHEaKPRSaMnuCbuh2fjNXgXPmasbxxirDTeZdxrPGFiaTLbpMSkxeS+Kc2Ua5pmutG003TMzMgs3KzYrMnsjjnVnGueYb7ZvNv8jYWlRZzFSos2i8eW2pZ8ywWWTZb3rJhWPlZ5VvVW16xJ1lzrLOtt1ldsUBtXmwybOpvLtqitm63Edptt3xTiFI8p0in1U27aMez87ArsmuwG7Tn2YfYl9m32zx3MHBId1jt0O3xydHXMdmxwvOuk4TTDqcSpw+lXZxtnoXOd8zUXpkuQyxKXdpcXU22niqdun3rLleUa7rrStdP1o5u7m9yt2W3U3cw9xX2r+00umxvJXcM970H08PdY4nHM452nm6fC85DnL152Xlle+70eT7OcJp7WMG3I28Rb4L3Le2A6Pj1l+s7pAz7GPgKfep+Hvqa+It89viN+1n6Zfgf8nvs7+sv9j/i/4XnyFvFOBWABwQHlAb2BGoGzA2sDHwSZBKUHNQWNBbsGLww+FUIMCQ1ZH3KTb8AX8hv5YzPcZyya0RXKCJ0VWhv6MMwmTB7WEY6GzwjfEH5vpvlM6cy2CIjgR2yIuB9pGZkX+X0UKSoyqi7qUbRTdHF09yzWrORZ+2e9jvGPqYy5O9tqtnJ2Z6xqbFJsY+ybuIC4qriBeIf4RfGXEnQTJAntieTE2MQ9ieNzAudsmjOc5JpUlnRjruXcorkX5unOy553PFk1WZB8OIWYEpeyP+WDIEJQLxhP5aduTR0T8oSbhU9FvqKNolGxt7hKPJLmnVaV9jjdO31D+miGT0Z1xjMJT1IreZEZkrkj801WRNberM/ZcdktOZSclJyjUg1plrQr1zC3KLdPZisrkw3keeZtyhuTh8r35CP5c/PbFWyFTNGjtFKuUA4WTC+oK3hbGFt4uEi9SFrUM99m/ur5IwuCFny9kLBQuLCz2Lh4WfHgIr9FuxYji1MXdy4xXVK6ZHhp8NJ9y2jLspb9UOJYUlXyannc8o5Sg9KlpUMrglc0lamUycturvRauWMVYZVkVe9ql9VbVn8qF5VfrHCsqK74sEa45uJXTl/VfPV5bdra3kq3yu3rSOuk626s91m/r0q9akHV0IbwDa0b8Y3lG19tSt50oXpq9Y7NtM3KzQM1YTXtW8y2rNvyoTaj9nqdf13LVv2tq7e+2Sba1r/dd3vzDoMdFTve75TsvLUreFdrvUV99W7S7oLdjxpiG7q/5n7duEd3T8Wej3ulewf2Re/ranRvbNyvv7+yCW1SNo0eSDpw5ZuAb9qb7Zp3tXBaKg7CQeXBJ9+mfHvjUOihzsPcw83fmX+39QjrSHkr0jq/dawto22gPaG97+iMo50dXh1Hvrf/fu8x42N1xzWPV56gnSg98fnkgpPjp2Snnp1OPz3Umdx590z8mWtdUV29Z0PPnj8XdO5Mt1/3yfPe549d8Lxw9CL3Ytslt0utPa49R35w/eFIr1tv62X3y+1XPK509E3rO9Hv03/6asDVc9f41y5dn3m978bsG7duJt0cuCW69fh29u0XdwruTNxdeo94r/y+2v3qB/oP6n+0/rFlwG3g+GDAYM/DWQ/vDgmHnv6U/9OH4dJHzEfVI0YjjY+dHx8bDRq98mTOk+GnsqcTz8p+Vv9563Or59/94vtLz1j82PAL+YvPv655qfNy76uprzrHI8cfvM55PfGm/K3O233vuO+638e9H5ko/ED+UPPR+mPHp9BP9z7nfP78L/eE8/stRzjPAAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAAJcEhZcwAACxMAAAsTAQCanBgAAADXSURBVBiVjZA7agJRAEXPewHRZViMC5AYZGxN5Sc7mPRJESJoO2JjYdDO2YidWEgI5qMbkIC7mFFHvTYTCBohp7yc5h4jCYBcu3QHPBljbgAkfQL9ZfttRDLg+G63Fnh6/f5QvIsV72JNlzNVh54c3+1IAsd36/XgXuEm0inhJlIt8OT4bsUCjdbtI5lUmlMyqTTN8gPAs72ytlDM5s+kH4rZPMaYawvoogUkX7H7w2E+Wy0uiu+rBZLmFuj3xkOi7fpMCrcRL5MAYPDvPOaP4IWk79fv4Eft841qprSDGwAAAABJRU5ErkJggg==',
        '半完成': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAbVJREFUSEu9ls8rRFEUx7/nzsjvjWQxSSTPJE1Zv0nUjEiIhRQbxQKTUiSr914pK6mJFWUjlqL8ysbCrJWVIWUh/wBF4R3d18w0zMwzi7nztu/7zuee7zn3nEdweQJGV/2H+BqCzf0gNAPwJeQvYDxC0EmZ7T26ta6ec4WhbC9aDd3HBIsZkwB73A4B0DcRdolhxK3Yy19tBqDV0AcZ2GNwtVd4EPJ3IuzvRLvPj7rqWnSshbPyCPRKwETcih2nC34BWszgPGBvgCFk0OWeOTTU1P8KqJl67oQINiAWHszraFKUAsiT28SHBBKLoRlM6+NZA7kC5BcEWzANJzNxAI7nwJ20ZSk8mzO41P4LcBiOXX5ZEwegmfo2M09JW7bG1lxrmg/ASYRo596MTZNsxXd8PnmF8JxH9jM8/0vLFyC7qxwljaRZwTm27c3etm5ER1fdOzJPi1IFFiJCmqGfMrhvfcTAQKCnsADQGWmmHmdm7SJygKbahsICiO4l4JWZq25WLlFZWlFowFtRAIotUl5k1W2q/KIpHxVFGXYJiLpxnbxdShdOEqJ0ZaZB1C399GFUiN+WH16q+w/WuLNCAAAAAElFTkSuQmCC',
        '已完成': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAAXNSR0IArs4c6QAAAfhJREFUSEu9lj1oE2EYx//PqaDYDJHaQlCoH7k4dVYuUMFFERSHQIeCUcxiih/QpXS4u9Gp9MNJwSWC4CAKKgiClgSLg4hkMIkBISFrhwhKPu4p7zWXz7vLXWjMmPd5/r/3+XyP4PKbVS+e+Cc1rsPgqyCcARBqmVfAKEKit4eNg69/6J/KTjJkdxBRlRATdGbcAviA2yUAahLhGTHUnJ6p9NsOACKqco2BFIMD7sK9pwSqErCQ0zNvuk96AGEteg8wVsGQ/Ii3bQkGID0saOl16782QNzcIH41snhH0ZCYbliRmAAz58BPv2lxLqyZrnOiJiZA1pQnzHxnpLQ4OBHR07yWSZBoxb+o/x7eLX7x1DyCQzMk69EkG8amX3cv9iRJiySryjsGX/Hi0G8zHZhEeOo00sWvtu4Eek+ypuSYWfYLOHv8FFLxDRw7GsSltRhKOwMzBiLKC0CVmSf8ALrFPxe+IPF8yT4Coj+ugNsX5vGtlMX3crYt0C9+98Uy6s26K8A2RSeDIXy8/xK1Rg1CZOvXNvyIC+JeilyKvHL5AW6ej5mQRx8eIzkXN3Mu0uJ2885QiyIPaVMLYjl5FTcjEG3qZdAsiB9xscbNQfO6KkRN7FrRcR9Zq+K/LLsWZHzr2gpzrA+OBRnrk9kFGd+j390V+/HZsgvSIhcecicecAAAAABJRU5ErkJggg=='
    };

    const CATEGORY_KEYWORDS = {
        '测验': ['测验', '测试'],
        '课件': ['课件', '小节', '视频'],
        '作业': ['作业'],
        '讨论': ['讨论', '答疑'],
        '考试': ['考试', '期末测试', '补考'],
        '其他': []
    };

    // ===============================
    // 工具函数
    // ===============================
    
    function simulateClick(element) {
        if (!element) return;
        const event = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true
        });
        element.dispatchEvent(event);
    }

    async function waitForElement(selector, timeout = 5000) {
        return new Promise(resolve => {
            const startTime = Date.now();
            const interval = setInterval(() => {
                const element = document.querySelector(selector);
                if (element) {
                    clearInterval(interval);
                    resolve(element);
                } else if (Date.now() - startTime > timeout) {
                    clearInterval(interval);
                    resolve(null);
                }
            }, 100);
        });
    }

    async function expandAllParentsAsync(element) {
        const parents = [];
        let parent = element.parentElement;

        while (parent && parent !== document.body) {
            if (parent.classList.contains('second-level-inner-box') || parent.classList.contains('first-level-inner-box')) {
                parents.push(parent);
            }
            parent = parent.parentElement;
        }

        parents.reverse();

        for (const parent of parents) {
            const toggleButton = parent.previousElementSibling && parent.previousElementSibling.querySelector('.right-icon > i.anticon-down');
            if (toggleButton) {
                const innerBox = parent;
                const height = window.getComputedStyle(innerBox).height;
                if (height === '0px') {
                    simulateClick(toggleButton);
                    await new Promise(resolve => setTimeout(resolve, 500));
                }
            }
        }
    }

    // ===============================
    // Vue 3 Composition API 组合函数
    // ===============================
    
    // 等待内容加载
    async function waitForContentLoaded(maxRetries = 40, intervalTime = 500) {
        return new Promise((resolve) => {
            let retries = 0;
            const interval = setInterval(() => {
                const items = document.querySelectorAll('.third-level-inner-box');
                console.log('[学习助手] 等待课件加载...', items.length, '个元素');
                if (items.length > 0 || retries >= maxRetries) {
                    clearInterval(interval);
                    resolve(items.length);
                }
                retries++;
            }, intervalTime);
        });
    }
    
    // 课程扫描组合函数
    function useCourseScanner() {
        const allCourses = ref([]);
        const currentCourse = ref(null);
        const isScanning = ref(false);
        
        // 扫描所有课件
        const scanAllCourses = async () => {
            isScanning.value = true;
            console.log('[学习助手] 开始扫描课件...');
            
            // 等待内容加载
            const count = await waitForContentLoaded();
            console.log('[学习助手] 内容加载完成，找到', count, '个元素');
            
            const courseElements = document.querySelectorAll('.third-level-inner-box');
            const courses = [];
            
            // 用于处理同名课件的计数器
            const titleCountMap = {};
            
            let index = 0;
            for (const element of courseElements) {
                const titleElement = element.querySelector('p.title, p.title-big');
                if (!titleElement) continue;
                
                const titleText = titleElement.textContent.trim();
                let category = '其他';
                
                // 分类课件
                for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
                    if (keywords.some(keyword => titleText.includes(keyword))) {
                        category = cat;
                        break;
                    }
                }
                
                // 检查完成状态
                let status = '未完成';
                const img = element.querySelector('img.file-complete');
                if (img) {
                    const src = img.getAttribute('src');
                    if (src === COMPLETION_STATUSES['已完成']) {
                        status = '已完成';
                    } else if (src === COMPLETION_STATUSES['半完成']) {
                        status = '半完成';
                    } else if (src === COMPLETION_STATUSES['未完成']) {
                        status = '未完成';
                    }
                }
                
                // 处理同名课件：给每个同名课件分配序号
                if (!titleCountMap[titleText]) {
                    titleCountMap[titleText] = 0;
                }
                titleCountMap[titleText]++;
                const titleIndex = titleCountMap[titleText];
                
                // 生成唯一ID：使用DOM索引
                const uniqueId = 'course_' + index;
                
                // 检查讨论回复状态（从localStorage读取）
                let replyStatus = '未回复';
                if (category === '讨论') {
                    try {
                        const replied = JSON.parse(localStorage.getItem('repliedDiscussions') || '[]');
                        if (replied.includes(titleText)) {
                            replyStatus = '已回复';
                        }
                    } catch {}
                }
                
                courses.push({
                    element,
                    title: titleText,
                    titleIndex: titleIndex,  // 同名课件的序号（1, 2, 3...）
                    uniqueId: uniqueId,      // 唯一ID
                    domIndex: index,         // DOM索引
                    category,
                    status,
                    isCompleted: status === '已完成',
                    replyStatus: replyStatus  // 讨论回复状态
                });
                
                index++;
            }
            
            allCourses.value = courses;
            isScanning.value = false;
            console.log('[学习助手] 扫描完成，共', courses.length, '个课件');
        };
        
        // 获取下一个未完成课件
        const getNextUncompletedCourse = () => {
            return allCourses.value.find(course => !course.isCompleted);
        };
        
        // 统计信息（只统计课件类型）
        const statistics = computed(() => {
            const coursewareOnly = allCourses.value.filter(c => c.category === '课件');
            const total = coursewareOnly.length;
            const completed = coursewareOnly.filter(c => c.isCompleted).length;
            const remaining = total - completed;
            
            return { total, completed, remaining };
        });
        
        // 按分类获取课件
        const getCoursesByCategory = (category) => {
            return allCourses.value.filter(c => c.category === category);
        };
        
        return {
            allCourses,
            currentCourse,
            isScanning,
            scanAllCourses,
            getNextUncompletedCourse,
            getCoursesByCategory,
            statistics
        };
    }
    
    // 自动学习组合函数（队列模式）
    function useAutoLearning() {
        const isLearning = ref(false);
        const currentTask = ref('');
        const progress = ref(0);
        
        // 队列相关状态
        const courseQueue = ref([]);           // 未完成课件队列
        const queueIndex = ref(0);             // 当前处理索引
        const completedCount = ref(0);         // 本轮完成数量
        const failCount = ref(0);              // 连续失败计数
        const totalProcessed = ref(0);         // 总处理数量（用于定期刷新）
        const shouldStop = ref(false);         // 停止标志
        
        // 配置
        const CONFIG = {
            REFRESH_EVERY_N: 10,               // 每处理N个课件刷新一次
            MAX_CONTINUOUS_FAIL: 3,            // 连续失败N次后刷新
            WAIT_AFTER_403: 5 * 60 * 1000,     // 403后等待时间（5分钟）
            RETRY_DELAY: 2000,                 // 重试延迟
        };
        
        // 通过DOM索引查找课件元素（处理同名课件问题）
        const findCourseElementByIndex = (domIndex) => {
            const allItems = document.querySelectorAll('.third-level-inner-box');
            if (domIndex >= 0 && domIndex < allItems.length) {
                return allItems[domIndex];
            }
            return null;
        };
        
        // 通过标题和序号查找课件元素（备用方案）
        const findCourseElementByTitleAndIndex = (title, titleIndex) => {
            const allItems = document.querySelectorAll('.third-level-inner-box');
            let matchCount = 0;
            for (const item of allItems) {
                const titleEl = item.querySelector('p.title, p.title-big');
                if (titleEl && titleEl.textContent.trim() === title) {
                    matchCount++;
                    if (matchCount === titleIndex) {
                        return item;
                    }
                }
            }
            return null;
        };
        
        // 刷新课件的element引用（使用DOM索引）
        const refreshCourseElement = (courseData) => {
            // 优先使用DOM索引查找
            let newElement = findCourseElementByIndex(courseData.domIndex);
            
            // 如果DOM索引失效，尝试用标题+序号查找
            if (!newElement && courseData.titleIndex) {
                newElement = findCourseElementByTitleAndIndex(courseData.title, courseData.titleIndex);
            }
            
            if (newElement) {
                courseData.element = newElement;
                return true;
            }
            console.log('[学习助手] 找不到课件元素:', courseData.title, '索引:', courseData.domIndex);
            return false;
        };
        
        // 检查课件当前是否已完成（使用DOM索引）
        const isCourseCompleted = (courseData) => {
            // 先刷新element引用
            if (!refreshCourseElement(courseData)) {
                return false; // 找不到元素，不能判断为已完成
            }
            
            const img = courseData.element.querySelector('img.file-complete');
            if (img) {
                const src = img.getAttribute('src');
                return src === COMPLETION_STATUSES['已完成'];
            }
            return false;
        };
        
        // 获取课件当前的图标src（使用DOM索引）
        const getCourseIconSrc = (courseData) => {
            if (!refreshCourseElement(courseData)) {
                return null;
            }
            const img = courseData.element.querySelector('img.file-complete');
            if (img) {
                return img.getAttribute('src');
            }
            return null;
        };
        
        // 跳转到课件（带重试）
        const jumpToCourse = async (courseData, retryCount = 2) => {
            for (let i = 0; i <= retryCount; i++) {
                try {
                    // 每次跳转前刷新element引用
                    if (!refreshCourseElement(courseData)) {
                        console.log('[学习助手] 找不到课件元素:', courseData.title);
                        if (i < retryCount) {
                            await new Promise(resolve => setTimeout(resolve, CONFIG.RETRY_DELAY));
                            continue;
                        }
                        return false;
                    }
                    
                    await expandAllParentsAsync(courseData.element);
                    const clickable = courseData.element.querySelector('a') ||
                          courseData.element.querySelector('p.title') ||
                          courseData.element;
                    
                    if (clickable) {
                        clickable.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        await new Promise(resolve => setTimeout(resolve, 500));
                        simulateClick(clickable);
                        return true;
                    }
                } catch (error) {
                    console.error('[学习助手] 跳转失败(尝试' + (i+1) + '):', error);
                    if (i < retryCount) {
                        await new Promise(resolve => setTimeout(resolve, CONFIG.RETRY_DELAY));
                    }
                }
            }
            return false;
        };
        
        // 等待图标变成已完成状态
        const waitForCompletionIcon = async (courseData, maxWaitTime = 15000) => {
            return new Promise((resolve) => {
                const startTime = Date.now();
                const originalSrc = courseData.originalSrc;
                
                console.log('[学习助手] 开始检测图标变化，课件:', courseData.title, '索引:', courseData.domIndex);
                
                const checkInterval = setInterval(() => {
                    const currentSrc = getCourseIconSrc(courseData);
                    
                    if (currentSrc) {
                        if (currentSrc !== originalSrc && currentSrc === COMPLETION_STATUSES['已完成']) {
                            clearInterval(checkInterval);
                            console.log('[学习助手] 检测到图标变为已完成');
                            resolve(true);
                            return;
                        }
                        
                        if (originalSrc === COMPLETION_STATUSES['已完成']) {
                            clearInterval(checkInterval);
                            console.log('[学习助手] 课件原本就是已完成状态');
                            resolve(true);
                            return;
                        }
                    }
                    
                    const elapsed = Date.now() - startTime;
                    if (elapsed > maxWaitTime) {
                        clearInterval(checkInterval);
                        console.log('[学习助手] 等待图标超时');
                        resolve(false);
                    }
                }, 2000);
            });
        };
        
        // 处理视频（传入courseData包含title和originalSrc）
        const handleVideo = async (video, courseData) => {
            return new Promise(async (resolve) => {
                currentTask.value = '正在播放视频: ' + courseData.title;
                
                try {
                    video.muted = true;
                    video.autoplay = true;
                    video.playsInline = true;
                    
                    const applyPlaybackRate = () => {
                        const playbackRate = parseFloat(localStorage.getItem('videoPlaybackSpeed')) || 3;
                        video.playbackRate = playbackRate;
                    };
                    
                    const onTimeUpdate = () => {
                        if (!video.duration) return;
                        const currentProgress = (video.currentTime / video.duration) * 100;
                        progress.value = Math.floor(currentProgress);
                        
                        if (currentProgress >= 99.9) {
                            video.removeEventListener('timeupdate', onTimeUpdate);
                            currentTask.value = '视频播放完成，等待确认...';
                            
                            // 等待图标变化确认完成（传入完整courseData）
                            waitForCompletionIcon(courseData).then(() => {
                                resolve();
                            });
                        }
                    };
                    
                    video.addEventListener('loadedmetadata', applyPlaybackRate, { once: true });
                    video.addEventListener('canplay', applyPlaybackRate, { once: true });
                    video.addEventListener('timeupdate', onTimeUpdate);
                    
                    await video.play();
                    applyPlaybackRate();
                    
                } catch (error) {
                    console.error('视频播放错误:', error);
                    resolve();
                }
            });
        };
        
        // 获取主页面倒计时秒数（更精确定位）
        const getCountdownSeconds = () => {
            // 优先查找带红色样式的倒计时元素
            const allElements = document.querySelectorAll('div');
            for (const el of allElements) {
                const text = el.textContent || '';
                // 匹配 "完成倒计时：XXs" 或 "完成倒计时:XXs"
                const match = text.match(/完成倒计时[：:]\s*(\d+)s/);
                if (match) {
                    // 检查是否是直接包含倒计时文本的元素（避免获取父元素的文本）
                    if (el.childElementCount === 0 || el.innerText.includes('完成倒计时')) {
                        return parseInt(match[1], 10);
                    }
                }
            }
            return 0;
        };
        
        // 等待主页面倒计时结束
        const waitForCountdownEnd = () => {
            return new Promise((resolve) => {
                const initialSeconds = getCountdownSeconds();
                if (initialSeconds <= 0) {
                    console.log('[学习助手] 无倒计时，直接继续');
                    resolve();
                    return;
                }
                
                console.log('[学习助手] 检测到完成倒计时:', initialSeconds, '秒，开始等待...');
                currentTask.value = '等待完成倒计时: ' + initialSeconds + 's';
                
                let lastSeconds = initialSeconds;
                let sameValueCount = 0;  // 连续相同值计数
                let timeoutId = null;
                
                const countdownInterval = setInterval(() => {
                    const seconds = getCountdownSeconds();
                    console.log('[学习助手] 倒计时剩余:', seconds, '秒');
                    currentTask.value = '等待完成倒计时: ' + seconds + 's';
                    
                    // 检测倒计时是否结束
                    if (seconds <= 0) {
                        clearInterval(countdownInterval);
                        if (timeoutId) clearTimeout(timeoutId);
                        console.log('[学习助手] 倒计时结束，等待2秒后继续');
                        currentTask.value = '倒计时结束，等待确认...';
                        setTimeout(() => {
                            resolve();
                        }, 2000);
                        return;
                    }
                    
                    // 检测倒计时是否卡住（连续5次相同值）
                    if (seconds === lastSeconds) {
                        sameValueCount++;
                        if (sameValueCount >= 5) {
                            clearInterval(countdownInterval);
                            if (timeoutId) clearTimeout(timeoutId);
                            console.log('[学习助手] 倒计时卡住，强制继续');
                            currentTask.value = '倒计时异常，继续...';
                            setTimeout(() => {
                                resolve();
                            }, 2000);
                            return;
                        }
                    } else {
                        sameValueCount = 0;
                        lastSeconds = seconds;
                    }
                }, 1000);
                
                // 倒计时超时保护（3分钟）
                timeoutId = setTimeout(() => {
                    clearInterval(countdownInterval);
                    console.log('[学习助手] 倒计时等待超时');
                    resolve();
                }, 180000);
            });
        };
        
        // 处理PPT（通过监听iframe的postMessage来判断完成）
        const handlePPT = async (courseData) => {
            return new Promise((resolve) => {
                currentTask.value = '正在播放PPT: ' + courseData.title;
                console.log('[学习助手] 开始处理PPT，等待iframe完成消息...');
                
                let hasReportedCompletion = false;
                let progressCheckInterval = null;
                let isScrollTypePPT = false;  // 是否是滚轮式PPT（PDF预览）
                
                // PPT翻页完成后的处理（检查倒计时）
                const onPptPagesFinished = async () => {
                    console.log('[学习助手] PPT翻页完成，检查是否有倒计时...');
                    currentTask.value = 'PPT翻页完成，检查倒计时...';
                    
                    // 等待倒计时结束（如果有的话）
                    await waitForCountdownEnd();
                    
                    // 等待图标变化确认完成
                    currentTask.value = 'PPT播放完成，等待图标确认...';
                    await waitForCompletionIcon(courseData);
                    resolve();
                };
                
                // 监听iframe发来的完成消息
                const messageHandler = (event) => {
                    if (!event.origin.includes('cqooc.com')) return;
                    const data = event.data;
                    if (!data || !data.type) return;
                    
                    if (data.type === 'pptCompleted' && !hasReportedCompletion) {
                        hasReportedCompletion = true;
                        console.log('[学习助手] 收到PPT完成消息');
                        window.removeEventListener('message', messageHandler);
                        if (progressCheckInterval) clearInterval(progressCheckInterval);
                        progress.value = 100;
                        
                        onPptPagesFinished();
                    } else if (data.type === 'pptProgress') {
                        progress.value = Math.floor(data.progress || 0);
                    }
                };
                
                window.addEventListener('message', messageHandler);
                
                // 检测是否是滚轮式PPT（无翻页按钮无进度条）
                setTimeout(() => {
                    const progressBar = document.querySelector('.bottom-paging-progress .bar');
                    const nextButton = document.querySelector('.slide-img-container.context-menu-disabled .ppt-turn-right-mask');
                    
                    if (!progressBar && !nextButton) {
                        // 滚轮式PPT（PDF预览），只需等待倒计时
                        isScrollTypePPT = true;
                        console.log('[学习助手] 检测到滚轮式PPT/PDF，只等待倒计时...');
                        currentTask.value = '滚轮式PPT/PDF，等待倒计时...';
                        
                        // 直接等待倒计时结束
                        if (!hasReportedCompletion) {
                            hasReportedCompletion = true;
                            window.removeEventListener('message', messageHandler);
                            if (progressCheckInterval) clearInterval(progressCheckInterval);
                            
                            waitForCountdownEnd().then(() => {
                                currentTask.value = '倒计时结束，等待图标确认...';
                                return waitForCompletionIcon(courseData);
                            }).then(() => {
                                resolve();
                            });
                        }
                    }
                }, 3000);
                
                // 同时也尝试检测主页面上的进度条（备用方案）
                progressCheckInterval = setInterval(() => {
                    if (isScrollTypePPT) return;  // 滚轮式PPT不需要检测进度
                    
                    const progressBar = document.querySelector('.bottom-paging-progress .bar');
                    if (progressBar) {
                        let width = parseFloat(progressBar.style.width) || 0;
                        progress.value = Math.floor(width);
                        
                        // 尝试点击下一页按钮
                        const nextButton = document.querySelector('.slide-img-container.context-menu-disabled .ppt-turn-right-mask');
                        if (width < 100 && nextButton) {
                            simulateClick(nextButton);
                        }
                        
                        if (width >= 100 && !hasReportedCompletion) {
                            hasReportedCompletion = true;
                            console.log('[学习助手] 检测到PPT进度100%');
                            window.removeEventListener('message', messageHandler);
                            clearInterval(progressCheckInterval);
                            
                            onPptPagesFinished();
                        }
                    }
                }, 1000);
                
                // 超时处理（3分钟，考虑倒计时）
                setTimeout(() => {
                    if (!hasReportedCompletion) {
                        hasReportedCompletion = true;
                        console.log('[学习助手] PPT处理超时');
                        window.removeEventListener('message', messageHandler);
                        if (progressCheckInterval) clearInterval(progressCheckInterval);
                        
                        currentTask.value = 'PPT处理超时，等待确认...';
                        waitForCompletionIcon(courseData).then(() => {
                            resolve();
                        });
                    }
                }, 180000);
            });
        };
        
        // 等待元素出现的辅助函数
        const waitForElementWithTimeout = async (selector, timeout = 10000) => {
            return new Promise((resolve) => {
                const startTime = Date.now();
                const interval = setInterval(() => {
                    const element = document.querySelector(selector);
                    if (element) {
                        clearInterval(interval);
                        resolve(element);
                    } else if (Date.now() - startTime > timeout) {
                        clearInterval(interval);
                        resolve(null);
                    }
                }, 500);
            });
        };
        
        // 检测是否有PPT的iframe
        const detectPPTIframe = () => {
            const iframes = document.querySelectorAll('iframe');
            for (const iframe of iframes) {
                if (iframe.src && iframe.src.includes('preview.cqooc.com')) {
                    return iframe;
                }
            }
            return null;
        };
        
        // 处理单个课件（返回: 'success' | 'fail' | 'skip' | 'error'）
        const processSingleCourse = async (courseData) => {
            progress.value = 0;
            
            // 先检查是否已完成（可能被其他方式完成了）
            if (isCourseCompleted(courseData)) {
                console.log('[学习助手] 课件已完成，跳过:', courseData.title, '索引:', courseData.domIndex);
                currentTask.value = '课件已完成，跳过';
                return 'skip';
            }
            
            // 记录原始图标状态
            const originalSrc = getCourseIconSrc(courseData);
            courseData.originalSrc = originalSrc;
            console.log('[学习助手] 开始处理课件:', courseData.title, '索引:', courseData.domIndex);
            
            // 跳转到课件
            const jumpSuccess = await jumpToCourse(courseData);
            if (!jumpSuccess) {
                console.log('[学习助手] 跳转失败:', courseData.title);
                return 'fail';
            }
            
            // 等待页面加载
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            // 检查课件类型并处理
            if (courseData.category === '课件') {
                currentTask.value = '正在检测课件类型...';
                
                const pptIframe = detectPPTIframe();
                if (pptIframe) {
                    console.log('[学习助手] 检测到PPT iframe');
                    await handlePPT(courseData);
                } else {
                    console.log('[学习助手] 等待视频元素...');
                    const video = await waitForElementWithTimeout('.dplayer-video-wrap video', 10000) || 
                                  await waitForElementWithTimeout('#dplayer video', 5000) ||
                                  await waitForElementWithTimeout('.dplayer-video', 3000) ||
                                  await waitForElementWithTimeout('video', 3000);
                    
                    if (video) {
                        console.log('[学习助手] 检测到视频元素');
                        await handleVideo(video, courseData);
                    } else {
                        const pptIframeRetry = detectPPTIframe();
                        if (pptIframeRetry) {
                            console.log('[学习助手] 重试检测到PPT iframe');
                            await handlePPT(courseData);
                        } else {
                            // 非PPT非视频课件（可能是文档、图片等）
                            console.log('[学习助手] 检测到非PPT非视频课件，等待倒计时...');
                            currentTask.value = '非视频课件，等待倒计时...';
                            
                            // 等待倒计时结束（如果有的话）
                            await waitForCountdownEnd();
                            
                            // 等待图标变化确认完成
                            currentTask.value = '等待图标确认...';
                            await waitForCompletionIcon(courseData, 30000);
                        }
                    }
                }
            }
            
            // 最终检查是否完成
            const finalCompleted = isCourseCompleted(courseData);
            return finalCompleted ? 'success' : 'fail';
        };
        
        // 初始化队列
        const initQueue = (courses) => {
            // 过滤出未完成的课件
            const uncompletedCourses = courses.filter(c => 
                c.category === '课件' && !c.isCompleted
            );
            
            courseQueue.value = uncompletedCourses;
            queueIndex.value = 0;
            completedCount.value = 0;
            failCount.value = 0;
            totalProcessed.value = 0;
            shouldStop.value = false;
            
            console.log('[学习助手] 队列初始化完成，待处理课件:', uncompletedCourses.length);
            return uncompletedCourses.length;
        };
        
        // 停止队列
        const stopQueue = () => {
            shouldStop.value = true;
            isLearning.value = false;
            currentTask.value = '已停止';
            console.log('[学习助手] 队列已停止');
        };
        
        // 队列处理主循环
        const processQueue = async () => {
            if (courseQueue.value.length === 0) {
                currentTask.value = '没有待处理的课件';
                return;
            }
            
            isLearning.value = true;
            shouldStop.value = false;
            
            let skipCount = 0;  // 连续跳过计数
            
            while (queueIndex.value < courseQueue.value.length && !shouldStop.value) {
                const courseData = courseQueue.value[queueIndex.value];
                const remaining = courseQueue.value.length - queueIndex.value;
                
                currentTask.value = `处理中 [${queueIndex.value + 1}/${courseQueue.value.length}]: ${courseData.title}`;
                console.log('[学习助手] ========== 处理课件', queueIndex.value + 1, '/', courseQueue.value.length, '索引:', courseData.domIndex, '==========');
                
                try {
                    const result = await processSingleCourse(courseData);
                    
                    if (result === 'success') {
                        completedCount.value++;
                        failCount.value = 0;
                        skipCount = 0;
                        totalProcessed.value++;  // 只有成功才计入刷新计数
                        console.log('[学习助手] 课件完成:', courseData.title);
                        courseData.isCompleted = true;
                    } else if (result === 'skip') {
                        completedCount.value++;
                        skipCount++;
                        // 跳过不计入totalProcessed，不触发定期刷新
                        courseData.isCompleted = true;
                        console.log('[学习助手] 跳过已完成课件，连续跳过:', skipCount);
                    } else {
                        failCount.value++;
                        skipCount = 0;
                        totalProcessed.value++;  // 失败也计入刷新计数
                        console.log('[学习助手] 课件处理失败，连续失败次数:', failCount.value);
                    }
                    
                    queueIndex.value++;
                    
                    // 检查是否需要刷新
                    if (failCount.value >= CONFIG.MAX_CONTINUOUS_FAIL) {
                        console.log('[学习助手] 连续失败次数过多，刷新页面重新扫描');
                        currentTask.value = '连续失败过多，3秒后刷新页面...';
                        localStorage.setItem('autoLearningActive', 'true');
                        localStorage.setItem('autoLearningReason', 'continuous_fail');
                        await new Promise(resolve => setTimeout(resolve, 3000));
                        window.location.reload();
                        return;
                    }
                    
                    // 只有真正处理了的课件才触发定期刷新
                    if (totalProcessed.value > 0 && totalProcessed.value % CONFIG.REFRESH_EVERY_N === 0) {
                        console.log('[学习助手] 已处理', totalProcessed.value, '个课件，刷新页面同步状态');
                        currentTask.value = '定期刷新，3秒后刷新页面...';
                        localStorage.setItem('autoLearningActive', 'true');
                        localStorage.setItem('autoLearningReason', 'periodic_refresh');
                        await new Promise(resolve => setTimeout(resolve, 3000));
                        window.location.reload();
                        return;
                    }
                    
                    // 如果不是跳过，课件之间休息一下
                    if (result !== 'skip' && queueIndex.value < courseQueue.value.length && !shouldStop.value) {
                        currentTask.value = '等待2秒后处理下一个...';
                        await new Promise(resolve => setTimeout(resolve, 2000));
                    }
                    
                } catch (error) {
                    console.error('[学习助手] 处理课件出错:', error);
                    failCount.value++;
                    queueIndex.value++;
                    
                    // 检测是否是403错误
                    if (error.message && error.message.includes('403')) {
                        console.log('[学习助手] 检测到403错误，等待5分钟后刷新');
                        currentTask.value = '检测到403，等待5分钟后刷新...';
                        localStorage.setItem('autoLearningActive', 'true');
                        localStorage.setItem('autoLearningReason', '403_wait');
                        await new Promise(resolve => setTimeout(resolve, CONFIG.WAIT_AFTER_403));
                        window.location.reload();
                        return;
                    }
                }
            }
            
            isLearning.value = false;
            
            if (shouldStop.value) {
                currentTask.value = '已手动停止';
            } else {
                currentTask.value = `队列处理完成！成功: ${completedCount.value}/${courseQueue.value.length}`;
                console.log('[学习助手] 队列处理完成，成功:', completedCount.value, '/', courseQueue.value.length);
                
                // 如果还有失败的，可以选择刷新重试
                const hasRemaining = courseQueue.value.some(c => !c.isCompleted);
                if (hasRemaining) {
                    currentTask.value += ' (仍有未完成课件，建议刷新重试)';
                }
            }
        };
        
        // 兼容旧的startAutoLearning（单个课件）
        const startAutoLearning = async (courseData) => {
            isLearning.value = true;
            const result = await processSingleCourse(courseData);
            isLearning.value = false;
            return result === 'success' || result === 'skip';
        };
        
        return {
            isLearning,
            currentTask,
            progress,
            courseQueue,
            queueIndex,
            completedCount,
            failCount,
            shouldStop,
            startAutoLearning,
            initQueue,
            processQueue,
            stopQueue,
            isCourseCompleted
        };
    }
    
    // ===============================
    // AI自动答题组合函数
    // ===============================
    
    const AI_CONFIG = {
        API_URL: 'https://api.siliconflow.cn/v1/chat/completions',
        API_KEYS: [
            'sk-peexnkvpnlamhdngpakvajcqnpdcmfocseueapqgqsterozy',
            'sk-qajeakmfbzsjscvmxbmoikqxtbmdoshrptizcorswqquekvy',
            'sk-zdtplgujzyjnysuulimlvwvlyagknnjcfwteulraiqqrvmvs',
            'sk-lrnafhwrxmmjbinmayhfncrumaiqqwudvletexqjhchujopa',
            'sk-jhusnrdvsanccasmvkibandsbppzjmctntltnmavowdxhxfl',
            'sk-rlvizdbslclvbnqfvxcpwthnbymwnxzpbmsgaxeboxhunmrd',
            'sk-guelwwaesoafphkjncvgkppqdcygjnbcbfgqkeztmnmowiay',
            'sk-bxignvnkxpnoswzugchqmygyfwebfggbntiicrqjsipgvpoe'
        ],
        disabledKeys: new Set(),
        currentKeyIndex: 0,
        MODEL: 'Qwen/Qwen2.5-7B-Instruct',
        MAX_TOKENS: 1024,
        MAX_SUBMIT_RETRIES: 5,
        REQUEST_INTERVAL: 500,
        MAX_RETRIES: 3,
        lastRequestTime: 0
    };
    
    const getNextApiKey = () => {
        const totalKeys = AI_CONFIG.API_KEYS.length;
        for (let i = 0; i < totalKeys; i++) {
            const index = (AI_CONFIG.currentKeyIndex + i) % totalKeys;
            const key = AI_CONFIG.API_KEYS[index];
            if (!AI_CONFIG.disabledKeys.has(key)) {
                AI_CONFIG.currentKeyIndex = (index + 1) % totalKeys;
                return key;
            }
        }
        AI_CONFIG.disabledKeys.clear();
        console.log('[学习助手] 所有Key已重置');
        const key = AI_CONFIG.API_KEYS[AI_CONFIG.currentKeyIndex];
        AI_CONFIG.currentKeyIndex = (AI_CONFIG.currentKeyIndex + 1) % totalKeys;
        return key;
    };
    
    const disableApiKey = (key) => {
        AI_CONFIG.disabledKeys.add(key);
        console.log(`[学习助手] Key已禁用，剩余可用: ${AI_CONFIG.API_KEYS.length - AI_CONFIG.disabledKeys.size}`);
    };
    
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    
    const waitForRateLimit = async () => {
        const now = Date.now();
        const elapsed = now - AI_CONFIG.lastRequestTime;
        if (elapsed < AI_CONFIG.REQUEST_INTERVAL) {
            await sleep(AI_CONFIG.REQUEST_INTERVAL - elapsed);
        }
        AI_CONFIG.lastRequestTime = Date.now();
    };
    
    function useAutoAnswer() {
        const isAnswering = ref(false);
        const isCompleting = ref(false);
        const autoSubmit = ref(false);
        const autoSave = ref(true);
        const currentStatus = ref('');
        const answeredCount = ref(0);
        const totalQuestions = ref(0);
        const logs = ref([]);
        
        let answerObserver = null;
        let completeObserver = null;
        let submitRetryCount = 0;
        
        const log = (message) => {
            const timestamp = new Date().toLocaleTimeString();
            console.log(`[${timestamp}][自动答题] ${message}`);
            logs.value.unshift({ time: timestamp, msg: message });
            if (logs.value.length > 50) logs.value.pop();
        };
        
        const simulateOptionClick = (optionElement) => {
            const titleElement = optionElement.querySelector('.index, .title');
            if (titleElement) {
                ['mousedown', 'mouseup', 'click'].forEach(eventType => {
                    const event = new MouseEvent(eventType, {
                        view: window,
                        bubbles: true,
                        cancelable: true
                    });
                    titleElement.dispatchEvent(event);
                });
            }
        };
        
        const getAnswerFromAPI = async (prompt, retryCount = 0) => {
            await waitForRateLimit();
            
            const currentKey = getNextApiKey();
            const options = {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${currentKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: AI_CONFIG.MODEL,
                    messages: [{ role: 'user', content: prompt }],
                    stream: false,
                    max_tokens: AI_CONFIG.MAX_TOKENS
                })
            };
            
            try {
                const response = await fetch(AI_CONFIG.API_URL, options);
                if (!response.ok) {
                    if (response.status === 429) {
                        const waitTime = Math.pow(2, retryCount + 1) * 1000;
                        log(`请求频繁(429)，${waitTime/1000}秒后重试...`);
                        await sleep(waitTime);
                        if (retryCount < AI_CONFIG.MAX_RETRIES) {
                            return getAnswerFromAPI(prompt, retryCount + 1);
                        }
                    }
                    if (response.status === 403) {
                        disableApiKey(currentKey);
                        const availableKeys = AI_CONFIG.API_KEYS.length - AI_CONFIG.disabledKeys.size;
                        if (availableKeys > 0) {
                            log(`Key被禁(403)，切换到其他Key，剩余${availableKeys}个`);
                            await sleep(1000);
                            return getAnswerFromAPI(prompt, 0);
                        } else {
                            log(`所有Key都被禁，等待30秒后重置...`);
                            await sleep(30000);
                            AI_CONFIG.disabledKeys.clear();
                            return getAnswerFromAPI(prompt, 0);
                        }
                    }
                    throw new Error(`API请求失败：${response.status}`);
                }
                
                const data = await response.json();
                if (data.choices?.[0]?.message?.content) {
                    return data.choices[0].message.content.trim();
                }
                throw new Error('API返回数据格式错误');
            } catch (err) {
                if (err.message.includes('403') || err.message.includes('429')) {
                    throw err;
                }
                if (retryCount < AI_CONFIG.MAX_RETRIES) {
                    const waitTime = Math.pow(2, retryCount + 1) * 1000;
                    log(`请求出错，${waitTime/1000}秒后重试: ${err.message}`);
                    await sleep(waitTime);
                    return getAnswerFromAPI(prompt, retryCount + 1);
                }
                throw err;
            }
        };
        
        const processSingleChoice = async (node) => {
            const questionElement = node.querySelector('.single-select-title');
            if (!questionElement) return;
            
            const questionText = questionElement.innerText.trim();
            currentStatus.value = `处理单选题: ${questionText.substring(0, 30)}...`;
            log(`处理单选题: ${questionText}`);
            
            const optionsElements = node.querySelectorAll('.single-option-item');
            let optionsText = '';
            let optionMap = {};
            
            optionsElements.forEach(option => {
                const indexEl = option.querySelector('.index');
                const titleEl = option.querySelector('.title');
                if (indexEl && titleEl) {
                    const letter = indexEl.innerText.trim();
                    optionsText += `${letter}. ${titleEl.innerText.trim()}\n`;
                    optionMap[letter.toUpperCase()] = option;
                }
            });
            
            const prompt = `请根据以下问题选择一个最合适的答案，并仅回复答案的选项字母（如A、B、C或D），不要添加任何其他字符或符号：
问题：${questionText}
答案选项：
${optionsText}
回答：`;
            
            try {
                const answer = await getAnswerFromAPI(prompt);
                const match = answer.toUpperCase().trim().match(/[A-D]/);
                if (match && optionMap[match[0]]) {
                    simulateOptionClick(optionMap[match[0]]);
                    node.setAttribute('data-answered', 'true');
                    answeredCount.value++;
                    log(`单选题选择: ${match[0]}`);
                }
            } catch (err) {
                log(`单选题错误: ${err.message}`);
            }
        };
        
        const processMultipleChoice = async (node) => {
            const questionElement = node.querySelector('.multiple-select-title');
            if (!questionElement) return;
            
            const questionText = questionElement.innerText.trim();
            currentStatus.value = `处理多选题: ${questionText.substring(0, 30)}...`;
            log(`处理多选题: ${questionText}`);
            
            const optionsElements = node.querySelectorAll('.multiple-option-item');
            let optionsText = '';
            let optionMap = {};
            
            optionsElements.forEach(option => {
                const indexEl = option.querySelector('.index');
                const titleEl = option.querySelector('.title');
                if (indexEl && titleEl) {
                    const letter = indexEl.innerText.trim();
                    optionsText += `${letter}. ${titleEl.innerText.trim()}\n`;
                    optionMap[letter.toUpperCase()] = option;
                }
            });
            
            const prompt = `请根据以下问题选择所有合适的答案，并仅回复答案的选项字母，用逗号分隔（如A,B,C），不要添加任何其他字符或符号：
问题：${questionText}
答案选项：
${optionsText}
回答：`;
            
            try {
                const answer = await getAnswerFromAPI(prompt);
                const matches = answer.toUpperCase().trim().match(/[A-D]/g);
                if (matches) {
                    const selectedLetters = [...new Set(matches)];
                    selectedLetters.forEach(letter => {
                        if (optionMap[letter]) simulateOptionClick(optionMap[letter]);
                    });
                    node.setAttribute('data-answered', 'true');
                    answeredCount.value++;
                    log(`多选题选择: ${selectedLetters.join(',')}`);
                }
            } catch (err) {
                log(`多选题错误: ${err.message}`);
            }
        };
        
        const processTrueFalse = async (node) => {
            const questionElement = node.querySelector('.bol-select-title');
            if (!questionElement) return;
            
            const questionText = questionElement.innerText.trim();
            currentStatus.value = `处理判断题: ${questionText.substring(0, 30)}...`;
            log(`处理判断题: ${questionText}`);
            
            const optionsElements = node.querySelectorAll('.bol-option-item');
            let optionMap = {};
            
            optionsElements.forEach(option => {
                const titleEl = option.querySelector('.title');
                if (titleEl) {
                    optionMap[titleEl.innerText.trim().toLowerCase()] = option;
                }
            });
            
            const prompt = `请根据以下判断题选择一个最合适的答案，并仅回复"对"或"错"，不要添加任何其他字符：
问题：${questionText}
回答：`;
            
            try {
                const answer = await getAnswerFromAPI(prompt);
                const match = answer.trim().match(/^(对|错)$/i);
                if (match && optionMap[match[1].toLowerCase()]) {
                    simulateOptionClick(optionMap[match[1].toLowerCase()]);
                    node.setAttribute('data-answered', 'true');
                    answeredCount.value++;
                    log(`判断题选择: ${match[1]}`);
                }
            } catch (err) {
                log(`判断题错误: ${err.message}`);
            }
        };
        
        const processEssayQuestion = async (node) => {
            const questionElement = node.querySelector('.essay-select-title');
            if (!questionElement) return;
            
            const questionText = questionElement.innerText.trim();
            currentStatus.value = `处理论述题: ${questionText.substring(0, 30)}...`;
            log(`处理论述题: ${questionText}`);
            
            const textareaElement = node.querySelector('.essay-option-item textarea');
            if (!textareaElement) return;
            
            const prompt = `请根据以下论述题提供一个详细且全面的回答：
问题：${questionText}
回答：`;
            
            try {
                const answer = await getAnswerFromAPI(prompt);
                textareaElement.focus();
                textareaElement.value = answer;
                textareaElement.dispatchEvent(new Event('input', { bubbles: true }));
                node.setAttribute('data-answered', 'true');
                answeredCount.value++;
                log(`论述题已填充答案`);
                
                if (autoSave.value) {
                    const saveBtn = node.querySelector('.submit-inner-box');
                    if (saveBtn) saveBtn.click();
                }
            } catch (err) {
                log(`论述题错误: ${err.message}`);
            }
        };
        
        const handleQuestionNode = async (node) => {
            if (node.getAttribute('data-answered') === 'true') return;
            
            if (node.querySelector('.single-select-container')) {
                await processSingleChoice(node);
            } else if (node.querySelector('.multiple-select-container')) {
                await processMultipleChoice(node);
            } else if (node.querySelector('.bol-select-container')) {
                await processTrueFalse(node);
            } else if (node.querySelector('.essay-select-container')) {
                await processEssayQuestion(node);
            }
            
            if (autoSubmit.value) {
                setTimeout(() => checkAndSubmit(), 2000);
            }
        };
        
        const handleTextTaskNode = async (node) => {
            if (node.getAttribute('data-processed') === 'true') return;
            
            const titleElement = node.querySelector('.question-title');
            const contentElement = node.querySelector('.announce-box .text-box') ||
                                   node.querySelector('.text-box');
            const editorElement = node.querySelector('.editor-box [contenteditable="true"]');
            const saveButton = node.querySelector('.submit-inner-box');
            
            if (!titleElement || !contentElement || !editorElement) return;
            
            const taskTitle = titleElement.innerText.trim();
            const taskContent = contentElement.innerText.trim();
            currentStatus.value = `处理作业: ${taskTitle.substring(0, 30)}...`;
            log(`处理作业: ${taskTitle}`);
            
            const prompt = `请根据以下任务内容完成作答，并直接返回答案文本：
任务标题：${taskTitle}
任务内容：${taskContent}
答案：`;
            
            try {
                const answer = await getAnswerFromAPI(prompt);
                editorElement.focus();
                editorElement.innerHTML = '';
                editorElement.innerText = answer;
                editorElement.dispatchEvent(new Event('input', { bubbles: true }));
                node.setAttribute('data-processed', 'true');
                answeredCount.value++;
                log(`作业已填充答案`);
                
                if (autoSave.value && saveButton) {
                    saveButton.click();
                }
            } catch (err) {
                log(`作业错误: ${err.message}`);
            }
        };
        
        const hasIncompleteQuestions = () => {
            return document.querySelectorAll('.index-dot-item-inner:not(.index-dot-item-inner-active)').length > 0;
        };
        
        const submitAnswers = () => {
            const submitButton = document.querySelector('.submit-button, .submit-btn, .confirm-btn');
            if (submitButton && !submitButton.disabled) {
                submitButton.click();
                log('点击提交按钮');
                
                setTimeout(() => {
                    const confirmBtn = document.querySelector('.ant-modal-content .ant-modal-confirm-btns .ant-btn-primary');
                    if (confirmBtn) {
                        confirmBtn.click();
                        log('点击确认按钮');
                    }
                }, 1000);
            }
        };
        
        const checkAndSubmit = () => {
            if (hasIncompleteQuestions()) {
                const incompleteNodes = document.querySelectorAll('.question-item:not([data-answered="true"])');
                incompleteNodes.forEach(node => handleQuestionNode(node));
                setTimeout(checkAndSubmit, 3000);
            } else {
                log('所有题目已完成，准备提交');
                submitAnswers();
            }
        };
        
        const clickStartButton = async () => {
            const startBtn = document.querySelector('.start-btn');
            if (startBtn && startBtn.offsetParent !== null) {
                log(`点击开始作答按钮`);
                startBtn.click();
                await new Promise(r => setTimeout(r, 3000));
                return true;
            }
            
            const selectors = ['.begin-btn', '.start-answer-btn', '.ant-btn-primary', 'button'];
            const targetTexts = ['开始', '开始答题', '开始作答', '进入答题', '立即答题'];
            
            for (const selector of selectors) {
                try {
                    const elements = document.querySelectorAll(selector);
                    for (const el of elements) {
                        const text = el.textContent.trim();
                        if (targetTexts.some(t => text.includes(t)) && el.offsetParent !== null) {
                            log(`点击按钮: ${text}`);
                            el.click();
                            await new Promise(r => setTimeout(r, 3000));
                            return true;
                        }
                    }
                } catch (e) {}
            }
            return false;
        };
        
        const startAnswering = async () => {
            if (isAnswering.value) {
                isAnswering.value = false;
                currentStatus.value = '已停止';
                if (answerObserver) {
                    answerObserver.disconnect();
                    answerObserver = null;
                }
                log('停止自动答题');
                return;
            }
            
            isAnswering.value = true;
            answeredCount.value = 0;
            currentStatus.value = '扫描题目中...';
            log('开始自动答题');
            
            let questionNodes = document.querySelectorAll('.question-item:not([data-answered="true"])');
            
            if (questionNodes.length === 0) {
                log('未找到题目，尝试点击开始按钮...');
                currentStatus.value = '尝试进入答题页面...';
                const clicked = await clickStartButton();
                if (clicked) {
                    await new Promise(r => setTimeout(r, 2000));
                    questionNodes = document.querySelectorAll('.question-item:not([data-answered="true"])');
                }
            }
            
            totalQuestions.value = questionNodes.length;
            log(`找到 ${questionNodes.length} 个未回答的题目`);
            
            if (questionNodes.length === 0) {
                log('未找到题目，请确认已进入答题页面');
                currentStatus.value = '未找到题目';
                isAnswering.value = false;
                return;
            }
            
            for (let i = 0; i < questionNodes.length; i++) {
                if (!isAnswering.value) break;
                currentStatus.value = `处理题目 ${i + 1}/${questionNodes.length}`;
                await handleQuestionNode(questionNodes[i]);
                if (i < questionNodes.length - 1) {
                    await sleep(1000);
                }
            }
            
            answerObserver = new MutationObserver((mutations) => {
                mutations.forEach(mutation => {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1) {
                            if (node.classList?.contains('question-item')) {
                                handleQuestionNode(node);
                            }
                            node.querySelectorAll?.('.question-item').forEach(child => {
                                handleQuestionNode(child);
                            });
                        }
                    });
                });
            });
            answerObserver.observe(document.body, { childList: true, subtree: true });
        };
        
        const startCompleting = async () => {
            if (isCompleting.value) {
                isCompleting.value = false;
                currentStatus.value = '已停止';
                if (completeObserver) {
                    completeObserver.disconnect();
                    completeObserver = null;
                }
                log('停止自动完成作业');
                return;
            }
            
            isCompleting.value = true;
            answeredCount.value = 0;
            currentStatus.value = '扫描作业中...';
            log('开始自动完成作业');
            
            let taskNodes = document.querySelectorAll('.question-container:not([data-processed="true"])');
            
            if (taskNodes.length === 0) {
                log('未找到作业容器，尝试点击开始按钮...');
                currentStatus.value = '尝试进入答题页面...';
                const clicked = await clickStartButton();
                if (clicked) {
                    await new Promise(r => setTimeout(r, 2000));
                    taskNodes = document.querySelectorAll('.question-container:not([data-processed="true"])');
                }
            }
            
            totalQuestions.value = taskNodes.length;
            log(`找到 ${taskNodes.length} 个未处理的作业`);
            
            if (taskNodes.length === 0) {
                log('未找到作业，请确认已进入作业页面');
                currentStatus.value = '未找到作业';
                isCompleting.value = false;
                return;
            }
            
            for (let i = 0; i < taskNodes.length; i++) {
                if (!isCompleting.value) break;
                currentStatus.value = `处理作业 ${i + 1}/${taskNodes.length}`;
                await handleTextTaskNode(taskNodes[i]);
                if (i < taskNodes.length - 1) {
                    await sleep(1000);
                }
            }
            
            completeObserver = new MutationObserver((mutations) => {
                mutations.forEach(mutation => {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1) {
                            if (node.classList?.contains('question-container')) {
                                handleTextTaskNode(node);
                            }
                            node.querySelectorAll?.('.question-container').forEach(child => {
                                handleTextTaskNode(child);
                            });
                        }
                    });
                });
            });
            completeObserver.observe(document.body, { childList: true, subtree: true });
        };
        
        const toggleAutoSubmit = () => {
            autoSubmit.value = !autoSubmit.value;
            log(`自动提交: ${autoSubmit.value ? '开启' : '关闭'}`);
            if (autoSubmit.value) checkAndSubmit();
        };
        
        const toggleAutoSave = () => {
            autoSave.value = !autoSave.value;
            log(`自动保存: ${autoSave.value ? '开启' : '关闭'}`);
        };
        
        return {
            isAnswering,
            isCompleting,
            autoSubmit,
            autoSave,
            currentStatus,
            answeredCount,
            totalQuestions,
            logs,
            startAnswering,
            startCompleting,
            toggleAutoSubmit,
            toggleAutoSave
        };
    }
    
    // 设置管理组合函数
    function useSettings() {
        // 默认三倍速，如果没有存储值则立即写入
        if (!localStorage.getItem('videoPlaybackSpeed')) {
            localStorage.setItem('videoPlaybackSpeed', '3');
        }
        const videoSpeed = ref(parseFloat(localStorage.getItem('videoPlaybackSpeed')) || 3);
        
        // 保存视频倍速并应用到当前播放的视频
        const saveVideoSpeed = () => {
            localStorage.setItem('videoPlaybackSpeed', videoSpeed.value.toString());
            
            // 立即应用到当前播放的视频
            const videos = document.querySelectorAll('video');
            videos.forEach(video => {
                if (video && !video.paused) {
                    video.playbackRate = videoSpeed.value;
                }
            });
        };
        
        return {
            videoSpeed,
            saveVideoSpeed
        };
    }
    
    // 讨论回复组合函数
    function useDiscussionReply() {
        const isReplying = ref(false);
        const replyProgress = ref({ current: 0, total: 0 });
        
        // 获取已回复的讨论列表
        const getRepliedDiscussions = () => {
            try {
                const data = localStorage.getItem('repliedDiscussions');
                return data ? JSON.parse(data) : [];
            } catch {
                return [];
            }
        };
        
        // 保存已回复的讨论
        const saveRepliedDiscussion = (title) => {
            const replied = getRepliedDiscussions();
            if (!replied.includes(title)) {
                replied.push(title);
                localStorage.setItem('repliedDiscussions', JSON.stringify(replied));
            }
        };
        
        // 检查讨论是否已回复
        const isDiscussionReplied = (title) => {
            return getRepliedDiscussions().includes(title);
        };
        
        // 初始化讨论的回复状态（扫描时调用）
        const initReplyStatus = (courseData) => {
            if (isDiscussionReplied(courseData.title)) {
                courseData.replyStatus = '已回复';
            }
        };
        
        // 重新查找元素（处理DOM更新后元素失效的情况）
        const refreshElement = (courseData) => {
            // 检查元素是否还在DOM中
            if (document.body.contains(courseData.element)) {
                return courseData.element;
            }
            
            // 尝试通过标题重新查找
            const title = courseData.title;
            if (title) {
                const allItems = document.querySelectorAll('.third-level-inner-box');
                for (const item of allItems) {
                    const titleEl = item.querySelector('p.title, p.title-big');
                    if (titleEl && titleEl.textContent.trim() === title) {
                        courseData.element = item;
                        return item;
                    }
                }
            }
            
            return null;
        };
        
        // 跳转到课件
        const jumpToItem = async (courseData) => {
            try {
                // 先刷新元素引用
                const targetElement = refreshElement(courseData);
                if (!targetElement) {
                    console.error('跳转失败：找不到目标元素', courseData.title);
                    return false;
                }
                
                await expandAllParentsAsync(targetElement);
                const clickable = targetElement.querySelector('a') ||
                      targetElement.querySelector('p.title') ||
                      targetElement;
                
                if (clickable) {
                    clickable.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    await new Promise(resolve => setTimeout(resolve, 500));
                    simulateClick(clickable);
                    return true;
                }
            } catch (error) {
                console.error('跳转失败：', error);
            }
            return false;
        };
        
        // 自动回复单个讨论
        const performAutoReply = async (courseData) => {
            try {
                await jumpToItem(courseData);
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                const discussionArea = await waitForElement('.course-courseQaDiscussion-qa', 5000);
                if (!discussionArea) return false;
                
                const replyButton = discussionArea.querySelector('.conv-option .reply');
                if (!replyButton) return false;
                
                replyButton.click();
                
                const replyInput = await waitForElement('.course-courseQaDiscussion-reply textarea.ant-input', 2000);
                const submitButton = await waitForElement('.course-courseQaDiscussion-reply .ant-btn-primary', 2000);
                const firstReply = discussionArea.querySelector('.conv-subtitle');
                
                if (replyInput && submitButton && firstReply) {
                    replyInput.value = firstReply.textContent.trim();
                    replyInput.dispatchEvent(new Event('input', { bubbles: true }));
                    await new Promise(resolve => setTimeout(resolve, 500));
                    submitButton.click();
                    courseData.replyStatus = '已回复';
                    // 保存到localStorage
                    saveRepliedDiscussion(courseData.title);
                    return true;
                }
                
                return false;
            } catch (error) {
                console.error('自动回复失败:', error);
                return false;
            }
        };
        
        // 批量自动回复
        const batchAutoReply = async (discussionItems) => {
            isReplying.value = true;
            replyProgress.value = { current: 0, total: discussionItems.length };
            
            for (let i = 0; i < discussionItems.length; i++) {
                const item = discussionItems[i];
                replyProgress.value.current = i + 1;
                
                await performAutoReply(item);
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
            
            isReplying.value = false;
        };
        
        return {
            isReplying,
            replyProgress,
            performAutoReply,
            jumpToItem,
            batchAutoReply,
            initReplyStatus
        };
    }
    
    // 测验/作业信息获取组合函数
    function useTestAssignmentInfo() {
        const isCollecting = ref(false);
        const collectProgress = ref({ current: 0, total: 0 });
        
        // 重新查找元素（处理DOM更新后元素失效的情况）
        const refreshElement = (courseData) => {
            if (document.body.contains(courseData.element)) {
                return courseData.element;
            }
            
            const title = courseData.title;
            if (title) {
                const allItems = document.querySelectorAll('.third-level-inner-box');
                for (const item of allItems) {
                    const titleEl = item.querySelector('p.title, p.title-big');
                    if (titleEl && titleEl.textContent.trim() === title) {
                        courseData.element = item;
                        return item;
                    }
                }
            }
            
            return null;
        };
        
        // 跳转到课件
        const jumpToItem = async (courseData) => {
            try {
                const targetElement = refreshElement(courseData);
                if (!targetElement) {
                    console.error('跳转失败：找不到目标元素', courseData.title);
                    return false;
                }
                
                await expandAllParentsAsync(targetElement);
                const clickable = targetElement.querySelector('a') ||
                      targetElement.querySelector('p.title') ||
                      targetElement;
                
                if (clickable) {
                    clickable.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    await new Promise(resolve => setTimeout(resolve, 500));
                    simulateClick(clickable);
                    return true;
                }
            } catch (error) {
                console.error('跳转失败：', error);
            }
            return false;
        };
        
        // 获取作答次数信息
        const getAttemptInfo = async () => {
            return new Promise((resolve, reject) => {
                const timeout = 3000;
                const startTime = Date.now();
                
                const interval = setInterval(() => {
                    const attemptElements = document.querySelectorAll('.list-content-text p');
                    for (const p of attemptElements) {
                        if (p.textContent.includes('已作答/可作答次数')) {
                            const span = p.querySelector('span');
                            if (span) {
                                clearInterval(interval);
                                resolve(span.textContent.trim());
                                return;
                            }
                        }
                    }
                    
                    if (Date.now() - startTime > timeout) {
                        clearInterval(interval);
                        resolve('获取失败');
                    }
                }, 100);
            });
        };
        
        // 获取时间信息
        const getTimeInfo = async () => {
            return new Promise((resolve, reject) => {
                const timeout = 3000;
                const startTime = Date.now();
                
                const interval = setInterval(() => {
                    const timeElements = document.querySelectorAll('.list-content-text p');
                    for (const p of timeElements) {
                        if (p.textContent.includes('开始至截止时间：')) {
                            const span = p.querySelector('span');
                            if (span) {
                                clearInterval(interval);
                                resolve(span.textContent.trim());
                                return;
                            }
                        }
                    }
                    
                    if (Date.now() - startTime > timeout) {
                        clearInterval(interval);
                        resolve('获取失败');
                    }
                }, 100);
            });
        };
        
        // 收集测验信息
        const collectTestInfo = async (testItems) => {
            isCollecting.value = true;
            collectProgress.value = { current: 0, total: testItems.length };
            
            for (let i = 0; i < testItems.length; i++) {
                const item = testItems[i];
                collectProgress.value.current = i + 1;
                
                await jumpToItem(item);
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                const attemptInfo = await getAttemptInfo();
                const timeInfo = await getTimeInfo();
                
                item.attemptInfo = attemptInfo;
                item.timeInfo = timeInfo;
                
                await new Promise(resolve => setTimeout(resolve, 500));
            }
            
            isCollecting.value = false;
        };
        
        // 收集作业信息
        const collectAssignmentInfo = async (assignmentItems) => {
            isCollecting.value = true;
            collectProgress.value = { current: 0, total: assignmentItems.length };
            
            for (let i = 0; i < assignmentItems.length; i++) {
                const item = assignmentItems[i];
                collectProgress.value.current = i + 1;
                
                await jumpToItem(item);
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                const attemptInfo = await getAttemptInfo();
                const timeInfo = await getTimeInfo();
                
                item.attemptInfo = attemptInfo;
                item.timeInfo = timeInfo;
                
                await new Promise(resolve => setTimeout(resolve, 500));
            }
            
            isCollecting.value = false;
        };
        
        return {
            isCollecting,
            collectProgress,
            collectTestInfo,
            collectAssignmentInfo,
            jumpToItem
        };
    }

    // ===============================
    // Vue 3 主应用（返回app实例的函数）
    // ===============================
    
    function createVueApp() {
        return createApp({
        setup() {
            // 组合函数
            const courseScanner = useCourseScanner();
            const autoLearning = useAutoLearning();
            const settings = useSettings();
            const discussionReply = useDiscussionReply();
            const testAssignmentInfo = useTestAssignmentInfo();
            const autoAnswer = useAutoAnswer();
            
            // 响应式数据
            const isVisible = ref(true);
            const activeTab = ref('auto');
            const expandedCategories = ref({});
            const panelRef = ref(null);
            const panelPosition = ref({ top: '10%', right: '20px', left: 'auto' });
            const isInitializing = ref(true);  // 初始化状态
            const initMessage = ref('正在扫描课件...');  // 初始化提示消息
            
            // 拖拽功能（带重试机制）
            const initDrag = (retryCount = 0) => {
                const panel = document.getElementById('learning-assistant-panel');
                if (!panel) {
                    if (retryCount < 10) {
                        setTimeout(() => initDrag(retryCount + 1), 200);
                    }
                    return;
                }
                
                const header = panel.querySelector('.panel-drag-header');
                if (!header) {
                    if (retryCount < 10) {
                        setTimeout(() => initDrag(retryCount + 1), 200);
                    }
                    return;
                }
                
                // 防止重复绑定
                if (header.dataset.dragInit === 'true') return;
                header.dataset.dragInit = 'true';
                
                let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
                let isDragging = false;
                
                const startDrag = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    isDragging = true;
                    pos3 = e.clientX;
                    pos4 = e.clientY;
                    document.addEventListener('mouseup', closeDrag);
                    document.addEventListener('mousemove', elementDrag);
                };
                
                const elementDrag = (e) => {
                    if (!isDragging) return;
                    e.preventDefault();
                    pos1 = pos3 - e.clientX;
                    pos2 = pos4 - e.clientY;
                    pos3 = e.clientX;
                    pos4 = e.clientY;
                    
                    let newTop = panel.offsetTop - pos2;
                    let newLeft = panel.offsetLeft - pos1;
                    
                    const windowWidth = window.innerWidth;
                    const windowHeight = window.innerHeight;
                    const elemWidth = panel.offsetWidth;
                    
                    if (newTop < 0) newTop = 0;
                    if (newLeft < 0) newLeft = 0;
                    if (newTop > windowHeight - 50) newTop = windowHeight - 50;
                    if (newLeft + elemWidth > windowWidth) newLeft = windowWidth - elemWidth;
                    
                    panel.style.top = newTop + 'px';
                    panel.style.left = newLeft + 'px';
                    panel.style.right = 'auto';
                };
                
                const closeDrag = () => {
                    isDragging = false;
                    document.removeEventListener('mouseup', closeDrag);
                    document.removeEventListener('mousemove', elementDrag);
                };
                
                header.addEventListener('mousedown', startDrag);
                console.log('[学习助手] 拖拽功能初始化成功');
            };
            
            // 计算属性
            const discussionItems = computed(() => {
                return courseScanner.allCourses.value.filter(course => course.category === '讨论');
            });
            
            const testItems = computed(() => {
                return courseScanner.allCourses.value.filter(course => course.category === '测验');
            });
            
            const assignmentItems = computed(() => {
                return courseScanner.allCourses.value.filter(course => course.category === '作业');
            });
            
            // 检测当前页面是否有可作答的测验/作业（响应式）
            const pageStatus = ref('检测中...');
            const isOnCoursePage = ref(false);
            const hasCourseware = ref(false);
            
            // 检测页面状态的方法
            const checkPageStatus = () => {
                const courseMenuItem = document.querySelector('.menu-item.menu-active-item');
                const currentMenu = courseMenuItem ? courseMenuItem.textContent.trim() : '';
                
                // 检测是否在课程学习页面
                isOnCoursePage.value = currentMenu === '课程学习';
                
                // 检测课件是否加载
                const courseItems = document.querySelectorAll('.chapter-item, .section-item, .course-item');
                hasCourseware.value = courseItems.length > 0;
                
                const startBtns = document.querySelectorAll('.start-btn');
                if (startBtns.length > 0) {
                    pageStatus.value = `检测到 ${startBtns.length} 个可作答项目`;
                } else if (document.querySelector('.question-item')) {
                    pageStatus.value = '已进入答题页面';
                } else if (currentMenu === '作业考试') {
                    pageStatus.value = '在作业考试页面';
                } else if (currentMenu === '课程学习') {
                    pageStatus.value = hasCourseware.value ? '在课程学习页面' : '课件未加载，请等待或刷新';
                } else {
                    pageStatus.value = '请先进入课程学习或作业考试页面';
                }
            };
            
            // 定时检测
            setInterval(checkPageStatus, 2000);
            checkPageStatus(); // 立即执行一次
            
            // 点击菜单跳转
            const goToMenu = (menuName) => {
                const menuItems = document.querySelectorAll('.menu-item');
                for (const item of menuItems) {
                    if (item.textContent.trim() === menuName) {
                        item.click();
                        return true;
                    }
                }
                return false;
            };
            
            // 跳转到课程学习
            const goToCoursePage = () => goToMenu('课程学习');
            
            // 跳转到作业考试
            const goToExamPage = () => goToMenu('作业考试');
            
            const coursewareItems = computed(() => {
                return courseScanner.allCourses.value.filter(course => course.category === '课件');
            });
            
            // 按类别分组的课件
            const categorizedCourses = computed(() => {
                const categories = {};
                courseScanner.allCourses.value.forEach(course => {
                    if (!categories[course.category]) {
                        categories[course.category] = {
                            items: [],
                            completed: 0,
                            halfCompleted: 0,
                            total: 0
                        };
                    }
                    categories[course.category].items.push(course);
                    categories[course.category].total++;
                    if (course.status === '已完成') {
                        categories[course.category].completed++;
                    } else if (course.status === '半完成') {
                        categories[course.category].halfCompleted++;
                    }
                });
                return categories;
            });
            
            // 主要方法
            const toggleVisibility = () => {
                isVisible.value = !isVisible.value;
            };
            
            const toggleCategory = (category) => {
                expandedCategories.value[category] = !expandedCategories.value[category];
            };
            
            // 跳转到课件
            const jumpToCourse = async (courseData) => {
                await discussionReply.jumpToItem(courseData);
            };
            
            // 智能自动刷课（队列模式）
            const startSmartLearning = async () => {
                localStorage.setItem('autoLearningActive', 'true');
                await courseScanner.scanAllCourses();
                
                // 检查是否正常加载了课件
                const totalCourses = courseScanner.allCourses.value.length;
                if (totalCourses === 0) {
                    console.log('[学习助手] 未检测到课件，可能页面未正常加载，5秒后刷新重试...');
                    autoLearning.currentTask.value = '页面异常，5秒后刷新重试...';
                    setTimeout(() => {
                        window.location.reload();
                    }, 5000);
                    return;
                }
                
                // 初始化队列
                const queueSize = autoLearning.initQueue(courseScanner.allCourses.value);
                
                if (queueSize === 0) {
                    // 所有课件都已完成
                    const coursewareCount = courseScanner.allCourses.value.filter(c => c.category === '课件').length;
                    if (coursewareCount === 0) {
                        console.log('[学习助手] 未检测到课件分类，可能页面异常，5秒后刷新重试...');
                        autoLearning.currentTask.value = '未检测到课件，5秒后刷新重试...';
                        setTimeout(() => {
                            window.location.reload();
                        }, 5000);
                        return;
                    }
                    
                    localStorage.removeItem('autoLearningActive');
                    localStorage.removeItem('autoLearningReason');
                    autoLearning.currentTask.value = '所有课件已完成！';
                    alert('恭喜！所有课件都已完成！');
                    return;
                }
                
                console.log('[学习助手] 开始队列处理，待处理课件:', queueSize);
                
                // 开始处理队列
                await autoLearning.processQueue();
                
                // 队列处理完成后，检查是否全部完成
                const remainingCount = autoLearning.courseQueue.value.filter(c => !c.isCompleted).length;
                if (remainingCount === 0) {
                    localStorage.removeItem('autoLearningActive');
                    localStorage.removeItem('autoLearningReason');
                    console.log('[学习助手] 所有课件处理完成！');
                }
            };
            
            // 停止自动刷课
            const stopAutoLearning = () => {
                localStorage.removeItem('autoLearningActive');
                localStorage.removeItem('autoLearningReason');
                autoLearning.stopQueue();
            };
            
            // 检查是否需要自动继续
            const checkAutoResume = async () => {
                const isActive = localStorage.getItem('autoLearningActive');
                if (isActive === 'true') {
                    const reason = localStorage.getItem('autoLearningReason') || 'unknown';
                    console.log('[学习助手] 检测到自动刷课状态，原因:', reason, '，3秒后继续...');
                    autoLearning.currentTask.value = '3秒后自动继续...';
                    setTimeout(() => {
                        startSmartLearning();
                    }, 3000);
                }
            };
            
            // 初始化
            onMounted(async () => {
                // 立即初始化拖拽功能（不等待课件扫描）
                setTimeout(() => initDrag(), 100);
                
                // 开始扫描课件
                initMessage.value = '正在扫描课件...';
                await courseScanner.scanAllCourses();
                
                // 扫描完成
                isInitializing.value = false;
                
                // 检查是否需要自动继续
                checkAutoResume();
            });
            
            // 获取测验信息
            const collectTestInfoBtn = async () => {
                await testAssignmentInfo.collectTestInfo(testItems.value);
            };
            
            // 获取作业信息
            const collectAssignmentInfoBtn = async () => {
                await testAssignmentInfo.collectAssignmentInfo(assignmentItems.value);
            };
            
            return {
                // 数据
                isVisible,
                activeTab,
                expandedCategories,
                isInitializing,
                initMessage,
                
                // 组合函数
                courseScanner,
                autoLearning,
                settings,
                discussionReply,
                testAssignmentInfo,
                autoAnswer,
                
                // 计算属性
                discussionItems,
                testItems,
                assignmentItems,
                coursewareItems,
                categorizedCourses,
                pageStatus,
                isOnCoursePage,
                hasCourseware,
                
                // 方法
                toggleVisibility,
                toggleCategory,
                jumpToCourse,
                startSmartLearning,
                stopAutoLearning,
                collectTestInfoBtn,
                collectAssignmentInfoBtn,
                goToExamPage,
                goToCoursePage,
                checkPageStatus
            };
        },
        
        template: `
            <!-- 控制按钮 -->
            <div v-if="!isVisible" @click="toggleVisibility" 
                 style="position: fixed; bottom: 20px; left: 20px; z-index: 10001; 
                        padding: 12px 20px; background: linear-gradient(135deg, #7EC8E3 0%, #5BA4C9 100%);
                        color: #FFFEF7; border-radius: 20px; cursor: pointer; box-shadow: 0 4px 15px rgba(126,200,227,0.4);
                        font-weight: 600; transition: all 0.3s ease; border: 2px solid rgba(255,255,255,0.3);">
                ☁️ 学习助手
            </div>

            <!-- 主面板 -->
            <div v-if="isVisible" id="learning-assistant-panel" style="position: fixed; top: 20px; right: 20px; width: 380px; max-height: calc(100vh - 40px); z-index: 10000; 
                                       background: #FFFEF7; border-radius: 20px; box-shadow: 0 8px 32px rgba(139,115,85,0.15);
                                       overflow: hidden; font-family: 'Hiragino Sans', 'Microsoft YaHei', sans-serif; border: 2px solid rgba(139,115,85,0.1);
                                       display: flex; flex-direction: column;">
                
                <!-- 头部（可拖拽） -->
                <div class="panel-drag-header" style="background: linear-gradient(135deg, #7EC8E3 0%, #A8D8EA 100%); padding: 18px 20px; color: #FFFEF7; cursor: move; position: relative; overflow: hidden; flex-shrink: 0;">
                    <!-- 装饰云朵 -->
                    <div style="position: absolute; top: -10px; right: 20px; font-size: 40px; opacity: 0.3;">☁️</div>
                    <div style="position: absolute; bottom: -5px; left: 30px; font-size: 25px; opacity: 0.2;">☁️</div>
                    <div style="display: flex; justify-content: space-between; align-items: center; position: relative; z-index: 1;">
                        <div>
                            <h3 style="margin: 0; font-size: 18px; font-weight: 600; text-shadow: 0 1px 2px rgba(0,0,0,0.1);">🌿 CQOOC智慧学习助手</h3>
                            <p style="margin: 4px 0 0; opacity: 0.9; font-size: 12px;">~ 这个班是上不了一点😡 ~</p>
                        </div>
                        <button @click="toggleVisibility" 
                                style="background: rgba(255,255,255,0.25); border: none; color: white; 
                                       width: 28px; height: 28px; border-radius: 14px; cursor: pointer; font-size: 14px;
                                       transition: all 0.2s ease;" title="最小化">🔻</button>
                    </div>
                </div>
                
                <!-- 初始化加载界面 -->
                <div v-if="isInitializing" style="padding: 30px 20px; text-align: center; background: linear-gradient(180deg, #F0F9FF 0%, #FFFEF7 100%);">
                    <div style="font-size: 48px; margin-bottom: 12px; animation: bounce 1s ease infinite;">🌸</div>
                    <div style="font-size: 16px; color: #7EC8E3; font-weight: 600; margin-bottom: 6px;">欢迎使用学习助手</div>
                    <div style="font-size: 13px; color: #8B7355; margin-bottom: 12px;">{{initMessage}}</div>
                    <div style="margin-bottom: 16px;">
                        <div style="width: 200px; height: 4px; background: #E8F5E9; border-radius: 2px; margin: 0 auto; overflow: hidden;">
                            <div style="width: 30%; height: 100%; background: linear-gradient(90deg, #90B77D, #7EC8E3); border-radius: 2px; animation: loading 1.5s ease-in-out infinite;"></div>
                        </div>
                    </div>
                    <div style="font-size: 11px; color: #A99880; margin-bottom: 12px;">如果长时间未加载，请点击下方按钮</div>
                    <div style="display: flex; gap: 10px; justify-content: center;">
                        <button @click="goToCoursePage" 
                                style="padding: 8px 16px; background: linear-gradient(135deg, #7EC8E3 0%, #5BA4C9 100%); color: #FFFEF7; border: none; border-radius: 8px; font-size: 12px; cursor: pointer; font-weight: 500;">
                            前往课程学习
                        </button>
                        <button @click="window.location.reload()" 
                                style="padding: 8px 16px; background: linear-gradient(135deg, #FFAB76 0%, #FF9A5C 100%); color: #FFFEF7; border: none; border-radius: 8px; font-size: 12px; cursor: pointer; font-weight: 500;">
                            刷新页面
                        </button>
                    </div>
                    <style>
                        @keyframes bounce {
                            0%, 100% { transform: translateY(0); }
                            50% { transform: translateY(-10px); }
                        }
                        @keyframes loading {
                            0% { transform: translateX(-100%); }
                            100% { transform: translateX(400%); }
                        }
                    </style>
                </div>
                
                <!-- 统计卡片 -->
                <template v-if="!isInitializing">
                <div style="padding: 15px 20px; background: linear-gradient(180deg, #F0F9FF 0%, #FFFEF7 100%); flex-shrink: 0;">
                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px;">
                        <div style="text-align: center; padding: 12px; background: #FFFEF7; border-radius: 12px; box-shadow: 0 2px 8px rgba(139,115,85,0.08); border: 1px solid rgba(126,200,227,0.2);">
                            <div style="font-size: 22px; font-weight: bold; color: #7EC8E3;">{{courseScanner.statistics.value.total}}</div>
                            <div style="font-size: 11px; color: #8B7355; margin-top: 2px;">总课件</div>
                        </div>
                        <div style="text-align: center; padding: 12px; background: #FFFEF7; border-radius: 12px; box-shadow: 0 2px 8px rgba(139,115,85,0.08); border: 1px solid rgba(144,183,125,0.2);">
                            <div style="font-size: 22px; font-weight: bold; color: #90B77D;">{{courseScanner.statistics.value.completed}}</div>
                            <div style="font-size: 11px; color: #8B7355; margin-top: 2px;">已完成</div>
                        </div>
                        <div style="text-align: center; padding: 12px; background: #FFFEF7; border-radius: 12px; box-shadow: 0 2px 8px rgba(139,115,85,0.08); border: 1px solid rgba(255,171,118,0.2);">
                            <div style="font-size: 22px; font-weight: bold; color: #FFAB76;">{{courseScanner.statistics.value.remaining}}</div>
                            <div style="font-size: 11px; color: #8B7355; margin-top: 2px;">待学习</div>
                        </div>
                    </div>
                    
                    <!-- 公告区域 -->
                    <div style="margin-top: 12px; padding: 10px 14px; background: linear-gradient(135deg, #FFF8E7 0%, #FFEFDB 100%); border-radius: 10px; border: 1px dashed #FFAB76;">
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <span style="font-size: 16px;">🍃</span>
                            <span style="font-size: 12px; color: #8B7355; line-height: 1.5;">
                                1.反馈群：1006332809 <br>
                                2.需要保证窗口可见，不能切到后台  <br>
                                3.讨论回复功能是直接复制讨论区第一条来回复的 <br>
                                4.如果有问题的加群反馈吧，应该有没考虑到的情况 <br>
                                5.默认三倍速<br>
                                6.答题会存在漏答现象
                            </span>
                        </div>
                    </div>
                </div>

                <!-- 主功能区 -->
                <div style="padding: 0 20px 20px; background: #FFFEF7; flex: 1; overflow-y: auto; min-height: 0;">
                    
                    <!-- 智能自动刷课按钮 -->
                    <button v-if="!autoLearning.isLearning.value" @click="startSmartLearning" :disabled="courseScanner.isScanning.value"
                            style="width: 100%; padding: 14px; margin-bottom: 12px; background: linear-gradient(135deg, #90B77D 0%, #7BA86E 100%);
                                   color: #FFFEF7; border: none; border-radius: 12px; font-size: 15px; font-weight: 600; 
                                   cursor: pointer; transition: all 0.3s ease; box-shadow: 0 4px 12px rgba(144,183,125,0.3);
                                   border: 2px solid rgba(255,255,255,0.2);">
                        <span v-if="courseScanner.isScanning.value">🔍 扫描课件中...</span>
                        <span v-else>🌸 开始智能学习</span>
                    </button>
                    
                    <!-- 正在学习时显示状态和停止按钮 -->
                    <div v-else style="margin-bottom: 12px;">
                        <div style="padding: 12px 14px; background: linear-gradient(135deg, #E8F5E9 0%, #F1F8E9 100%); border-radius: 10px; margin-bottom: 10px; border: 1px solid rgba(144,183,125,0.3);">
                            <div style="font-weight: 600; color: #6B8E5F; margin-bottom: 4px; font-size: 13px;">{{autoLearning.currentTask.value}}</div>
                            <div style="display: flex; justify-content: space-between; font-size: 12px; color: #90B77D;">
                                <span>进度: {{autoLearning.progress.value}}%</span>
                                <span v-if="autoLearning.courseQueue.value.length > 0">
                                    队列: {{autoLearning.queueIndex.value + 1}}/{{autoLearning.courseQueue.value.length}}
                                </span>
                            </div>
                            <div v-if="autoLearning.failCount.value > 0" style="font-size: 11px; color: #FFAB76; margin-top: 4px;">
                                ⚠️ 连续失败: {{autoLearning.failCount.value}}次
                            </div>
                        </div>
                        <button @click="stopAutoLearning"
                                style="width: 100%; padding: 10px; background: linear-gradient(135deg, #E57373 0%, #D32F2F 100%); color: #FFFEF7; border: none; border-radius: 8px; font-size: 13px; cursor: pointer;">
                            🛑 停止学习
                        </button>
                    </div>

                    <!-- 进度条 -->
                    <div v-if="autoLearning.isLearning.value" style="margin-bottom: 16px;">
                        <div style="background: #E8F5E9; border-radius: 10px; overflow: hidden; height: 6px;">
                            <div style="background: linear-gradient(90deg, #90B77D, #A8D5A2); height: 100%; transition: width 0.3s ease;"
                                 :style="{width: autoLearning.progress.value + '%'}"></div>
                        </div>
                    </div>

                    <!-- 标签页 -->
                    <div style="display: flex; margin-bottom: 12px; background: #F5F0E8; border-radius: 10px; padding: 4px;">
                        <button @click="activeTab = 'auto'" 
                                :style="{flex: 1, padding: '8px', border: 'none', borderRadius: '8px', cursor: 'pointer',
                                        background: activeTab === 'auto' ? '#FFFEF7' : 'transparent',
                                        color: activeTab === 'auto' ? '#8B7355' : '#A99880', fontWeight: '500', fontSize: '12px',
                                        boxShadow: activeTab === 'auto' ? '0 2px 4px rgba(139,115,85,0.1)' : 'none'}">
                            功能
                        </button>
                        <button @click="activeTab = 'answer'" 
                                :style="{flex: 1, padding: '8px', border: 'none', borderRadius: '8px', cursor: 'pointer',
                                        background: activeTab === 'answer' ? '#FFFEF7' : 'transparent',
                                        color: activeTab === 'answer' ? '#8B7355' : '#A99880', fontWeight: '500', fontSize: '12px',
                                        boxShadow: activeTab === 'answer' ? '0 2px 4px rgba(139,115,85,0.1)' : 'none'}">
                            答题
                        </button>
                        <button @click="activeTab = 'list'" 
                                :style="{flex: 1, padding: '8px', border: 'none', borderRadius: '8px', cursor: 'pointer',
                                        background: activeTab === 'list' ? '#FFFEF7' : 'transparent',
                                        color: activeTab === 'list' ? '#8B7355' : '#A99880', fontWeight: '500', fontSize: '12px',
                                        boxShadow: activeTab === 'list' ? '0 2px 4px rgba(139,115,85,0.1)' : 'none'}">
                            列表
                        </button>
                        <button @click="activeTab = 'settings'" 
                                :style="{flex: 1, padding: '8px', border: 'none', borderRadius: '8px', cursor: 'pointer',
                                        background: activeTab === 'settings' ? '#FFFEF7' : 'transparent',
                                        color: activeTab === 'settings' ? '#8B7355' : '#A99880', fontWeight: '500', fontSize: '12px',
                                        boxShadow: activeTab === 'settings' ? '0 2px 4px rgba(139,115,85,0.1)' : 'none'}">
                            设置
                        </button>
                    </div>

                    <!-- 自动功能标签页 -->
                    <div v-show="activeTab === 'auto'" style="max-height: 350px; overflow-y: auto;">
                        
                        <!-- 讨论自动回复 -->
                        <div v-if="discussionItems.length > 0" style="margin-bottom: 12px; padding: 14px; background: linear-gradient(135deg, #FFF8E7 0%, #FFEFDB 100%); border-radius: 12px; border: 1px solid rgba(255,171,118,0.3);">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                                <span style="font-weight: 600; color: #8B7355; font-size: 13px;">💬 讨论区回复</span>
                                <span style="font-size: 11px; color: #FFAB76; background: rgba(255,171,118,0.2); padding: 2px 8px; border-radius: 10px;">{{discussionItems.length}}个</span>
                            </div>
                            <button @click="discussionReply.batchAutoReply(discussionItems)" :disabled="discussionReply.isReplying.value"
                                    style="width: 100%; padding: 8px; background: linear-gradient(135deg, #FFAB76 0%, #FF9A5C 100%); color: #FFFEF7; border: none; border-radius: 8px; font-size: 13px; cursor: pointer;">
                                <span v-if="discussionReply.isReplying.value">
                                    回复中... ({{discussionReply.replyProgress.value.current}}/{{discussionReply.replyProgress.value.total}})
                                </span>
                                <span v-else>✨ 一键回复</span>
                            </button>
                        </div>

                        <!-- 测验信息 -->
                        <div v-if="testItems.length > 0" style="margin-bottom: 12px; padding: 14px; background: linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%); border-radius: 12px; border: 1px solid rgba(126,200,227,0.3);">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                                <div style="display: flex; align-items: center; gap: 8px;">
                                    <span style="font-weight: 600; color: #5BA4C9; font-size: 13px;">📝 测验信息</span>
                                    <span style="font-size: 11px; color: #7EC8E3; background: rgba(126,200,227,0.2); padding: 2px 8px; border-radius: 10px;">{{testItems.length}}个</span>
                                </div>
                                <button @click="autoAnswer.startAnswering()" 
                                        :style="{padding: '4px 10px', fontSize: '11px', border: 'none', borderRadius: '6px', cursor: 'pointer',
                                                background: autoAnswer.isAnswering ? '#E57373' : 'linear-gradient(135deg, #6200EE 0%, #5000D0 100%)', color: '#FFFEF7'}">
                                    {{ autoAnswer.isAnswering ? '停止' : '一键完成' }}
                                </button>
                            </div>
                            <button @click="collectTestInfoBtn" :disabled="testAssignmentInfo.isCollecting.value"
                                    style="width: 100%; padding: 8px; background: linear-gradient(135deg, #7EC8E3 0%, #5BA4C9 100%); color: #FFFEF7; border: none; border-radius: 8px; font-size: 13px; cursor: pointer; margin-bottom: 8px;">
                                <span v-if="testAssignmentInfo.isCollecting.value">
                                    获取中... ({{testAssignmentInfo.collectProgress.value.current}}/{{testAssignmentInfo.collectProgress.value.total}})
                                </span>
                                <span v-else>🔍 获取作答信息</span>
                            </button>
                            <div v-for="item in testItems" :key="item.title" style="font-size: 11px; padding: 6px 0; border-bottom: 1px solid rgba(126,200,227,0.2);">
                                <div style="display: flex; justify-content: space-between; align-items: center;">
                                    <span style="color: #5BA4C9; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">{{item.title}}</span>
                                    <button @click="jumpToCourse(item)" style="padding: 2px 8px; background: #7EC8E3; color: #FFFEF7; border: none; border-radius: 4px; font-size: 10px; cursor: pointer;">跳转</button>
                                </div>
                                <div v-if="item.attemptInfo" style="color: #8B7355; margin-top: 2px;">📊 {{item.attemptInfo}}</div>
                                <div v-if="item.timeInfo" style="color: #90B77D; margin-top: 2px;">⏰ {{item.timeInfo}}</div>
                            </div>
                        </div>

                        <!-- 作业信息 -->
                        <div v-if="assignmentItems.length > 0" style="margin-bottom: 12px; padding: 14px; background: linear-gradient(135deg, #F3E8FF 0%, #E9D5FF 100%); border-radius: 12px; border: 1px solid rgba(167,139,250,0.3);">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                                <div style="display: flex; align-items: center; gap: 8px;">
                                    <span style="font-weight: 600; color: #7C3AED; font-size: 13px;">📋 作业信息</span>
                                    <span style="font-size: 11px; color: #A78BFA; background: rgba(167,139,250,0.2); padding: 2px 8px; border-radius: 10px;">{{assignmentItems.length}}个</span>
                                </div>
                                <button @click="autoAnswer.startCompleting()" 
                                        :style="{padding: '4px 10px', fontSize: '11px', border: 'none', borderRadius: '6px', cursor: 'pointer',
                                                background: autoAnswer.isCompleting ? '#E57373' : 'linear-gradient(135deg, #03A9F4 0%, #0288D1 100%)', color: '#FFFEF7'}">
                                    {{ autoAnswer.isCompleting ? '停止' : '一键完成' }}
                                </button>
                            </div>
                            <button @click="collectAssignmentInfoBtn" :disabled="testAssignmentInfo.isCollecting.value"
                                    style="width: 100%; padding: 8px; background: linear-gradient(135deg, #A78BFA 0%, #8B5CF6 100%); color: #FFFEF7; border: none; border-radius: 8px; font-size: 13px; cursor: pointer; margin-bottom: 8px;">
                                <span v-if="testAssignmentInfo.isCollecting.value">
                                    获取中... ({{testAssignmentInfo.collectProgress.value.current}}/{{testAssignmentInfo.collectProgress.value.total}})
                                </span>
                                <span v-else>🔍 获取作业信息</span>
                            </button>
                            <div v-for="item in assignmentItems" :key="item.title" style="font-size: 11px; padding: 6px 0; border-bottom: 1px solid rgba(167,139,250,0.2);">
                                <div style="display: flex; justify-content: space-between; align-items: center;">
                                    <span style="color: #7C3AED; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">{{item.title}}</span>
                                    <button @click="jumpToCourse(item)" style="padding: 2px 8px; background: #A78BFA; color: #FFFEF7; border: none; border-radius: 4px; font-size: 10px; cursor: pointer;">跳转</button>
                                </div>
                                <div v-if="item.attemptInfo" style="color: #8B7355; margin-top: 2px;">📊 {{item.attemptInfo}}</div>
                                <div v-if="item.timeInfo" style="color: #90B77D; margin-top: 2px;">⏰ {{item.timeInfo}}</div>
                            </div>
                        </div>

                    </div>

                    <!-- 答题标签页 -->
                    <div v-show="activeTab === 'answer'" style="max-height: 350px; overflow-y: auto;">
                        
                        <!-- 页面检测提示 -->
                        <div style="margin-bottom: 12px; padding: 14px; background: linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%); border-radius: 12px; border: 1px solid rgba(144,183,125,0.3);">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                                <div>
                                    <div style="font-weight: 600; color: #2E7D32; font-size: 13px; margin-bottom: 4px;">📍 当前页面状态</div>
                                    <div style="font-size: 11px; color: #558B2F;">
                                        {{ pageStatus }}
                                    </div>
                                </div>
                            </div>
                            <div style="display: flex; gap: 8px;">
                                <button @click="goToCoursePage" 
                                        style="flex: 1; padding: 8px 12px; background: linear-gradient(135deg, #7EC8E3 0%, #5BA4C9 100%); color: #FFFEF7; border: none; border-radius: 8px; font-size: 12px; cursor: pointer; font-weight: 500;">
                                    课程学习
                                </button>
                                <button @click="goToExamPage" 
                                        style="flex: 1; padding: 8px 12px; background: linear-gradient(135deg, #90B77D 0%, #7BA86E 100%); color: #FFFEF7; border: none; border-radius: 8px; font-size: 12px; cursor: pointer; font-weight: 500;">
                                    作业考试
                                </button>
                            </div>
                        </div>
                        
                        <!-- 说明 -->
                        <div style="margin-bottom: 12px; padding: 10px 12px; background: linear-gradient(135deg, #FFF8E7 0%, #FFEFDB 100%); border-radius: 10px; border: 1px dashed #FFAB76;">
                            <div style="font-size: 11px; color: #8B7355; line-height: 1.6;">
                                1. 支持单选、多选、判断和论述题<br>
                                2. 图片题目无法识别，仅支持纯文本<br>
                                3. 进入作业/测验页面后点击对应按钮<br>
                                4. 使用免费AI模型，准确率有限
                            </div>
                        </div>
                        
                        <!-- 测验/考试区域 -->
                        <div style="margin-bottom: 12px; padding: 14px; background: linear-gradient(135deg, #E8F0FE 0%, #D4E4FC 100%); border-radius: 12px; border: 1px solid rgba(98,0,238,0.2);">
                            <div style="font-weight: 600; color: #6200EE; margin-bottom: 10px; font-size: 13px;">测验/考试</div>
                            
                            <button @click="autoAnswer.startAnswering()"
                                    :style="{width: '100%', padding: '10px', marginBottom: '8px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '500',
                                            background: autoAnswer.isAnswering.value ? 'linear-gradient(135deg, #E57373 0%, #EF5350 100%)' : 'linear-gradient(135deg, #6200EE 0%, #5000D0 100%)',
                                            color: '#FFFEF7'}">
                                {{ autoAnswer.isAnswering.value ? '停止自动答题' : '开始自动答题' }}
                            </button>
                            
                            <button @click="autoAnswer.toggleAutoSubmit()"
                                    :style="{width: '100%', padding: '10px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '500',
                                            background: autoAnswer.autoSubmit.value ? 'linear-gradient(135deg, #009688 0%, #00796B 100%)' : 'linear-gradient(135deg, #03DAC6 0%, #00BFA5 100%)',
                                            color: autoAnswer.autoSubmit.value ? '#FFFEF7' : '#004D40'}">
                                {{ autoAnswer.autoSubmit.value ? '关闭自动提交' : '开启自动提交' }}
                            </button>
                        </div>
                        
                        <!-- 作业区域 -->
                        <div style="margin-bottom: 12px; padding: 14px; background: linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%); border-radius: 12px; border: 1px solid rgba(3,169,244,0.2);">
                            <div style="font-weight: 600; color: #0288D1; margin-bottom: 10px; font-size: 13px;">作业</div>
                            
                            <button @click="autoAnswer.startCompleting()"
                                    :style="{width: '100%', padding: '10px', marginBottom: '8px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '500',
                                            background: autoAnswer.isCompleting.value ? 'linear-gradient(135deg, #E57373 0%, #EF5350 100%)' : 'linear-gradient(135deg, #03A9F4 0%, #0288D1 100%)',
                                            color: '#FFFEF7'}">
                                {{ autoAnswer.isCompleting.value ? '停止自动完成' : '开始自动完成' }}
                            </button>
                            
                            <button @click="autoAnswer.toggleAutoSave()"
                                    :style="{width: '100%', padding: '10px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '500',
                                            background: autoAnswer.autoSave.value ? 'linear-gradient(135deg, #F57C00 0%, #E65100 100%)' : 'linear-gradient(135deg, #FF9800 0%, #FB8C00 100%)',
                                            color: '#FFFEF7'}">
                                {{ autoAnswer.autoSave.value ? '关闭自动保存' : '开启自动保存' }}
                            </button>
                        </div>
                        
                        <!-- 状态显示 -->
                        <div v-if="autoAnswer.currentStatus" style="padding: 10px 12px; background: linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%); border-radius: 10px; margin-bottom: 12px;">
                            <div style="font-size: 12px; color: #2E7D32; margin-bottom: 4px;">{{ autoAnswer.currentStatus }}</div>
                            <div style="font-size: 11px; color: #558B2F;">已完成: {{ autoAnswer.answeredCount }} / {{ autoAnswer.totalQuestions }}</div>
                        </div>
                        
                        <!-- 日志 -->
                        <div v-if="autoAnswer.logs.length > 0" style="padding: 10px 12px; background: #F5F5F5; border-radius: 10px; max-height: 120px; overflow-y: auto;">
                            <div style="font-size: 11px; color: #666; margin-bottom: 6px; font-weight: 600;">日志</div>
                            <div v-for="(log, index) in autoAnswer.logs.slice(0, 10)" :key="index" 
                                 style="font-size: 10px; color: #888; padding: 2px 0; border-bottom: 1px solid #eee;">
                                <span style="color: #aaa;">{{ log.time }}</span> {{ log.msg }}
                            </div>
                        </div>
                        
                    </div>

                    <!-- 课件列表标签页 -->
                    <div v-show="activeTab === 'list'" style="max-height: 350px; overflow-y: auto;">
                        
                        <!-- 分类面板 -->
                        <div v-for="(data, category) in categorizedCourses" :key="category" 
                             style="margin-bottom: 8px; border: 1px solid rgba(139,115,85,0.15); border-radius: 10px; overflow: hidden; background: #FFFEF7;">
                            
                            <!-- 分类头部 -->
                            <div @click="toggleCategory(category)" 
                                 style="display: flex; justify-content: space-between; align-items: center; padding: 10px 12px; background: linear-gradient(135deg, #F8F6F0 0%, #F5F0E8 100%); cursor: pointer;">
                                <span style="font-weight: 600; color: #8B7355; font-size: 13px;">
                                    {{category === '课件' ? '📖' : category === '讨论' ? '💬' : category === '测验' ? '📝' : category === '作业' ? '📋' : '📁'}} {{category}} 
                                    <span v-if="category === '课件'" style="font-size: 11px; color: #A99880;">
                                        ({{data.completed}}/{{data.total}})
                                    </span>
                                    <span v-else style="font-size: 11px; color: #A99880;">({{data.items.length}})</span>
                                </span>
                                <span style="color: #A99880; font-size: 12px;">{{expandedCategories[category] ? '▼' : '▶'}}</span>
                            </div>
                            
                            <!-- 分类内容 -->
                            <div v-show="expandedCategories[category]" style="padding: 8px;">
                                <div v-for="item in data.items" :key="item.title" 
                                     style="display: flex; justify-content: space-between; align-items: center; padding: 8px 10px; margin-bottom: 4px; background: #F8F6F0; border-radius: 8px;">
                                    
                                    <div style="display: flex; align-items: center; flex: 1; overflow: hidden;">
                                        <!-- 状态图标 -->
                                        <span v-if="category === '课件'" 
                                              :style="{width: '8px', height: '8px', borderRadius: '50%', marginRight: '8px',
                                                      background: item.status === '已完成' ? '#90B77D' : item.status === '半完成' ? '#FFAB76' : '#E57373'}">
                                        </span>
                                        <span style="font-size: 12px; color: #8B7355; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                                            {{item.title}}
                                        </span>
                                        <!-- 讨论回复状态 -->
                                        <span v-if="category === '讨论'" 
                                              :style="{marginLeft: '8px', fontSize: '10px', padding: '2px 6px', borderRadius: '8px',
                                                      background: item.replyStatus === '已回复' ? 'rgba(144,183,125,0.2)' : 'rgba(229,115,115,0.2)',
                                                      color: item.replyStatus === '已回复' ? '#90B77D' : '#E57373'}">
                                            {{item.replyStatus || '未回复'}}
                                        </span>
                                    </div>
                                    
                                    <div style="display: flex; gap: 4px;">
                                        <button @click="jumpToCourse(item)" 
                                                style="padding: 3px 8px; background: #7EC8E3; color: #FFFEF7; border: none; border-radius: 6px; font-size: 11px; cursor: pointer;">
                                            跳转
                                        </button>
                                        <!-- 讨论单独回复按钮 -->
                                        <button v-if="category === '讨论'" @click="discussionReply.performAutoReply(item)"
                                                style="padding: 3px 8px; background: #90B77D; color: #FFFEF7; border: none; border-radius: 6px; font-size: 11px; cursor: pointer;">
                                            回复
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                    </div>

                    <!-- 设置标签页 -->
                    <div v-show="activeTab === 'settings'">
                        
                        <!-- 视频倍速设置 -->
                        <div style="margin-bottom: 16px; padding: 14px; background: linear-gradient(135deg, #F8F6F0 0%, #F5F0E8 100%); border-radius: 12px;">
                            <label style="display: block; margin-bottom: 8px; font-weight: 600; color: #8B7355; font-size: 13px;">🎬 视频播放倍速</label>
                            <select v-model="settings.videoSpeed.value" @change="settings.saveVideoSpeed"
                                    style="width: 100%; padding: 10px; border: 1px solid rgba(139,115,85,0.2); border-radius: 8px; font-size: 13px; background: #FFFEF7; color: #8B7355;">
                                <option :value="1">1x 正常速度</option>
                                <option :value="2">2x 两倍速</option>
                                <option :value="3">3x 三倍速</option>
                            </select>
                        </div>
                        
                        <!-- 说明 -->
                        <div style="padding: 14px; background: linear-gradient(135deg, #E8F5E9 0%, #F1F8E9 100%); border-radius: 12px; border: 1px solid rgba(144,183,125,0.2);">
                            <div style="font-weight: 600; color: #6B8E5F; margin-bottom: 8px; font-size: 13px;">🌱 使用说明</div>
                            <div style="font-size: 12px; color: #8B7355; line-height: 1.8;">
                                1. 点击「开始智能学习」<br>
                                2. 自动播放视频/PPT<br>
                                3. 完成后自动继续下一个<br>
                                4. 全部完成会提示
                            </div>
                        </div>

                    </div>

                </div>
                </template>

                <!-- 底部信息 -->
                <div style="padding: 12px 20px; background: linear-gradient(135deg, #F8F6F0 0%, #F5F0E8 100%); border-top: 1px solid rgba(139,115,85,0.1); text-align: center; flex-shrink: 0;">
                    <div style="font-size: 11px; color: #A99880;">
                        Written By Abstract | 反馈群：1006332809
                    </div>
                </div>
            </div>
        `
        });
    }

    // ===============================
    // 视频控制器（PPT处理）
    // ===============================
    
    if (window.location.hostname === IFRAME_PAGE_HOST) {
        // PPT自动翻页处理（iframe中）
        function initPptAutoPaging() {
            const progressBarSelector = '.bottom-paging-progress .bar';
            const nextPageButtonSelector = '.slide-img-container.context-menu-disabled .ppt-turn-right-mask';
            const checkInterval = 1000;
            let hasReportedCompletion = false;

            let pptIntervalId = setInterval(() => {
                const pptBar = document.querySelector(progressBarSelector);
                const nextButton = document.querySelector(nextPageButtonSelector);

                if (pptBar) {
                    let width = parseFloat(pptBar.style.width) || 0;
                    
                    // 发送进度给主页面
                    if (width > 0) {
                        window.parent.postMessage({
                            type: 'pptProgress',
                            progress: width
                        }, '*');
                    }
                    
                    if (width >= 100 && !hasReportedCompletion) {
                        hasReportedCompletion = true;
                        clearInterval(pptIntervalId);
                        console.log('[PPT-iframe] PPT翻页完成，通知主页面');
                        window.parent.postMessage({
                            type: 'pptCompleted',
                            status: 'completed',
                            timestamp: Date.now()
                        }, '*');
                        return;
                    }
                    if (width < 100 && nextButton) {
                        simulateClick(nextButton);
                    }
                }
            }, checkInterval);

            // 超时处理
            setTimeout(() => {
                if (!hasReportedCompletion) {
                    hasReportedCompletion = true;
                    clearInterval(pptIntervalId);
                    window.parent.postMessage({
                        type: 'pptCompleted',
                        status: 'completed',
                        timestamp: Date.now()
                    }, '*');
                }
            }, 120000);
        }

        initPptAutoPaging();
    }

    // ===============================
    // 初始化应用
    // ===============================
    
    // 检查是否在主页面（支持多种域名格式）
    const isMainPage = window.location.hostname === MAIN_PAGE_HOST || 
                       (window.location.hostname.endsWith('.cqooc.com') && 
                        window.location.hostname !== IFRAME_PAGE_HOST) ||
                        window.location.hostname.endsWith('.smartedu.cn');
    
    console.log('[学习助手] 当前域名:', window.location.hostname);
    console.log('[学习助手] 是否主页面:', isMainPage);
    
    // PPT完成消息处理
    let pptResolveCallback = null;
    
    if (isMainPage) {
        // 监听iframe消息（PPT完成通知）
        window.addEventListener('message', (event) => {
            if (event.origin !== `https://${IFRAME_PAGE_HOST}`) return;
            const data = event.data;
            if (!data || !data.type) return;
            
            if (data.type === 'pptCompleted') {
                console.log('[学习助手] PPT完成通知已收到');
                if (pptResolveCallback) {
                    pptResolveCallback();
                    pptResolveCallback = null;
                }
            } else if (data.type === 'pptProgress') {
                console.log('[学习助手] PPT进度:', data.progress);
            }
        }, false);
        
        // 等待Vue加载完成
        const waitForVue = () => {
            // 尝试多种方式检测Vue
            const VueObj = window.Vue || (typeof Vue !== 'undefined' ? Vue : null);
            
            if (VueObj && VueObj.createApp) {
                console.log('[学习助手] Vue已加载，开始初始化');
                
                // 确保Vue在全局可用（模板编译需要）
                window.Vue = VueObj;
                
                // 直接使用检测到的Vue对象
                createApp = VueObj.createApp;
                ref = VueObj.ref;
                computed = VueObj.computed;
                onMounted = VueObj.onMounted;
                reactive = VueObj.reactive;
                console.log('[学习助手] Vue API已解构');
                
                try {
                    // 检查是否已存在容器
                    let appContainer = document.getElementById('vue-learning-assistant');
                    if (appContainer) {
                        console.log('[学习助手] 容器已存在，跳过创建');
                        return;
                    }
                    
                    // 创建Vue应用容器
                    appContainer = document.createElement('div');
                    appContainer.id = 'vue-learning-assistant';
                    document.body.appendChild(appContainer);
                    console.log('[学习助手] 容器已创建');
                    
                    // 创建并挂载Vue应用
                    const app = createVueApp();
                    app.mount('#vue-learning-assistant');
                    
                    console.log('🎉 智能学习助手Vue3版本已启动');
                } catch (error) {
                    console.error('[学习助手] 应用初始化失败:', error);
                }
            } else {
                setTimeout(waitForVue, 100);
            }
        };
        
        // 确保DOM加载完成后再初始化
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', waitForVue);
        } else {
            waitForVue();
        }

        // 自动视频处理（保持兼容）
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) {
                        const videoPlayer = node.id === 'dplayer' ? node : 
                                           node.querySelector('#dplayer') ||
                                           node.querySelector('.dplayer-video-wrap') ||
                                           (node.classList && node.classList.contains('dplayer-video-wrap') ? node : null);
                        if (videoPlayer && !videoPlayer.dataset.autoplayInitialized) {
                            videoPlayer.dataset.autoplayInitialized = 'true';
                            const video = videoPlayer.querySelector('video');
                            if (video) {
                                setTimeout(() => {
                                    const playbackRate = parseFloat(localStorage.getItem('videoPlaybackSpeed')) || 3;
                                    video.playbackRate = playbackRate;
                                    video.muted = true;
                                    video.play().catch(console.error);
                                }, 500);
                            }
                        }
                        
                        // 直接检测video元素
                        const directVideo = node.tagName === 'VIDEO' ? node : node.querySelector('video.dplayer-video');
                        if (directVideo && !directVideo.dataset.autoplayInitialized) {
                            directVideo.dataset.autoplayInitialized = 'true';
                            setTimeout(() => {
                                const playbackRate = parseFloat(localStorage.getItem('videoPlaybackSpeed')) || 3;
                                directVideo.playbackRate = playbackRate;
                                directVideo.muted = true;
                                directVideo.play().catch(console.error);
                            }, 500);
                        }
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

})();
