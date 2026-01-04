// ==UserScript==
// @name         自动化课程播放脚本（终极增强版+播放修复）
// @namespace    https://greasyfork.org/zh-CN/users/1063320-%E7%AC%94%E7%A0%9A
// @version      7.8  // 版本号更新
// @description  自动跳转课程并确保视频自动播放，避免人工干预，修复下一课程查找问题增强版，新增播放按钮点击功能和未播放课程图标判断，以及检测未播放的课程标题，改进页面元素加载检测逻辑，并优化错误处理及元素查找等方面。
// @author       笔墨纸砚
// @match        *://www.sxjkaqjypx.com:88/#/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/519660/%E8%87%AA%E5%8A%A8%E5%8C%96%E8%AF%BE%E7%A8%8B%E6%92%AD%E6%94%BE%E8%84%9A%E6%9C%AC%EF%BC%88%E7%BB%88%E6%9E%81%E5%A2%9E%E5%BC%BA%E7%89%88%2B%E6%92%AD%E6%94%BE%E4%BF%AE%E5%A4%8D%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/519660/%E8%87%AA%E5%8A%A8%E5%8C%96%E8%AF%BE%E7%A8%8B%E6%92%AD%E6%94%BE%E8%84%9A%E6%9C%AC%EF%BC%88%E7%BB%88%E6%9E%81%E5%A2%9E%E5%BC%BA%E7%89%88%2B%E6%92%AD%E6%94%BE%E4%BF%AE%E5%A4%8D%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 全局定义课程完成图标的 base64
    const COMPLETION_ICON_BASE64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAiCAYAAAFNQDtUAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAIqADAAQAAAABAAAAIgAAAAACeqFUAAAD4UlEQVRYCa2Xu2tUQRTGsxIipgxYKClSaJEi2OQPSLEKYpNCrGxtJJBS0ojYpA4hVYr9A3ZbETQYECFNUMTGRCP4ShMIPiAKIa6/796Zm3nezW4y8O2cx3fO3Dt35szs0JBp3W73t5XTvWXQd8WgexAxMU5VRjFCwyyG1YKBMFZRrYCxaFaPe0PY9jwYo1zY5goSwqxlI/8FxQs4tu45lFvWQH/eka34oRAILtNas+nDrJb8Asd7MOrxMRx6BhRsazaqFTqtDmlPzEnHgNqdsHrUy6vmOvS6YfvpGQg48gyOgm++UBGWHbu1DUtoWAekDrLG3wX3Go2GPxcOsQV5B1Rv5/gWsB+BcWvzehzRhHqEQIG/DJqVGWWnUoyA7Tp4FdpdHf8IaOujrLsOK2MP24r1uT2ktr7LZddYI9/P+Hb1JKNgISRgewPUFkOfq+M/KHSEcVCuSpdRI8MfBvsRBWMT7IGRyGkM+OZBHBwGQNIrrgJtrl9AG63a5yHf0yHqtbSYUnM0iV2LMLsHNcFzoOe8wBkD8cLEqLmINo/3mIESJcKwF3B6qsToicpXQ+iA6Gtg+wJm6rLhL7cLgrZ21GQ3bSNyGgN+TfasJrSdIpkEblfVFZcPYV17Z9M11sifM77pfjZg7ut91+v455MZzn0P5DuZp1D8qn7KXRiwTJJ/9EWhDdyFik/lclRJpkBZrlPMGhtxx0cAyj7IjpjKA38N+AUbg9qJEsFTkU6et3o1PVH21fCpMKveNN2n80bmMNJ+0Bxpsr+Bp0AH1TS4DTpwLtJ7LbkKPQaKEtM9BLpbXAC6Q7wFGkBQU8EXroGr4A94Ah4z8Dv6wZpeG2iKNAUqq9FG75VZMSZWOZTLm8raeMgqkmr6iN601wb2cCqXyUmXWRzKgVNlXk+tZXhmDxA+n3KbMTRWtNy1uHTWZFdqmPC0usYyY5aXcRSdlgcgOvBSg8F7DWxTqVkEA80gcSpFGrsoRzqyt1KDpmxwc+0HjmwBTeWSjZhtUBTXLYSlHDG0wz1JexTG5XSSLYEte97YWpDj92u/20eAxr5kT09VvbNqKxSwK30k09ib+kb6k6gW/Q1IJYNX/KUrIo5/NhAnUvw6GzG6kKiVV0kEXZF0HexZPeHcBF/BSzBTN1Cdj1hV3U/AvxRhaAGV4ujfbl3CQXwaw4yVvgfj1PlyCHIXoUHG9WKU24zR9BwpBaLOGz3Qc3DqGVIOoKNDOdOXkNSDWBtBOn9aQOVfa0iVsOeiFsdwtQYU2wL+uWIHMf2J7iM2hmT6B34D6F6iLWrvIIjV3eQjsu4hz9jGyZuoyGH7D21b86vL5rBAAAAAAElFTkSuQmCC';

    // 最大重试次数（可根据实际情况调整）
    const MAX_RETRIES = 3;

    // 日志打印函数
    function log(message) {
        console.log(`[自动化播放脚本] 课程 - ${message}`);
    }

    // 模拟点击事件函数（增强兼容性处理）
    function simulateClick(element) {
        if (!element) return;
        log('尝试模拟点击事件...');

        if (document.createEvent) {
            const events = ['mouseover', 'mousedown', 'mouseup', 'click'];
            events.forEach(eventType => {
                const event = document.createEvent('MouseEvent');
                event.initMouseEvent(eventType, true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
                element.dispatchEvent(event);
            });
        } else if (document.createEventObject) {  // 兼容IE等旧浏览器
            const event = document.createEventObject();
            element.fireEvent('onclick', event);
        }

        log('模拟点击已完成。');
    }

    // 播放视频的函数（优化错误处理及重试逻辑）
    function playVideo() {
        const video = document.querySelector('video');
        if (video) {
            log('找到视频元素，尝试播放...');
            video.muted = true;  // 静音播放
            video.play().then(() => {
                log('视频已成功播放，接下来尝试自动完成课程...');
                completeCourse();
            }).catch((error) => {
                log(`视频播放失败：${error.message}，开始重试播放...`);
                let retryCount = 0;
                const retryPlay = () => {
                    if (retryCount < MAX_RETRIES) {
                        retryCount++;
                        setTimeout(() => {
                            playVideo();
                        }, 2000);
                    } else {
                        log('已达到最大重试次数，视频播放失败，检查页面或网络情况。');
                    }
                };
                retryPlay();
            });
        } else {
            // 尝试点击播放按钮
            const playButton = document.querySelector('.video-react-big-play-button');
            if (playButton) {
                log('未找到视频元素，尝试点击播放按钮...');
                simulateClick(playButton);
            } else {
                log('未找到视频元素和播放按钮，等待2秒后重试...');
                setTimeout(playVideo, 2000);
            }
        }
    }

    // 点击下一个课程的函数（优化元素加载等待逻辑）
    function clickNextCourse() {
        const waitForCourseItems = (resolve) => {
            const observer = new MutationObserver(() => {
                const courseItems = document.querySelectorAll('.ant-list-item');
                if (courseItems.length > 0) {
                    observer.disconnect();
                    resolve(courseItems);
                }
            });

            observer.observe(document.body, { childList: true, subtree: true });
        };

        return new Promise((resolve, reject) => {
            waitForCourseItems(resolve);
            setTimeout(() => {
                reject(new Error('课程列表项加载超时'));
            }, 10000);  // 设置10秒超时时间，可根据实际情况调整
        });
    }

    // 处理下一个课程的函数（优化错误处理及元素查找判断）
    function processNextCourse(courseItems) {
        let nextCourse = null;
        let uncompletedCourses = [];

        courseItems.forEach(item => {
            const icon = item.querySelector('img[alt="icon"]');
            const title = item.querySelector('.ant-list-item-meta-title');
            if (title && title.textContent.includes('.mp4')) {
                const isCompleted = icon && icon.src !== COMPLETION_ICON_BASE64;
                log(`检查课程状态：课程名称=${title? title.textContent : '未知课程'} - 完成状态=${isCompleted? '已完成' : '未完成'}`);
                if (!isCompleted) {
                    uncompletedCourses.push(title.textContent);
                    if (!nextCourse) {
                        nextCourse = item;
                        log(`找到未完成的课程：${title? title.textContent : '未知课程'}`);
                    }
                }
            }
        });

        if (uncompletedCourses.length > 0) {
            log(`未完成的课程列表：${uncompletedCourses.join(', ')}`);
        }

        if (nextCourse) {
            log('找到下一个未完成的课程，正在尝试跳转...');
            nextCourse.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setTimeout(() => {
                try {
                    const titleDiv = nextCourse.querySelector('.ant-list-item-meta-title span div');
                    if (titleDiv) {
                        titleDiv.click();
                        log('已尝试使用原生 click 方法点击课程元素，期望跳转到下一个未完成课程');
                    } else {
                        log('未能找到课程标题内可点击的元素，无法进行点击操作');
                    }
                } catch (error) {
                    log(`点击课程元素时出错: ${error.message}`);
                }
            }, 1000);
        } else {
            log('未找到下一个未完成的课程，等待页面加载...');
            setTimeout(clickNextCourse, 2000);
        }
    }

    // 重试点击下一个课程的函数（优化重试逻辑及错误处理）
    function retryClickNextCourse(nextCourse, retries) {
        if (retries <= 0) {
            log('已达到最大重试次数，跳转到下一个课程失败。');
            return;
        }

        log(`尝试点击课程，剩余重试次数：${retries}`);

        // 滚动页面确保元素在可视区域内
        nextCourse.scrollIntoView({ behavior: 'smooth', block: 'center' });

        simulateClick(nextCourse);

        const observer = new MutationObserver((mutationsList, observer) => {
            const activeCourse = document.querySelector('.ant-list-item[style*="rgb(75, 75, 75)"]');
            if (activeCourse && activeCourse.contains(nextCourse)) {
                log('成功切换到下一个课程。');
                observer.disconnect();
                playVideo();
            }
        });

        const timeout = setTimeout(() => {
            log(`跳转失败，剩余重试次数：${retries - 1}，重试点击下一个课程...`);
            observer.disconnect();
            retryClickNextCourse(nextCourse, retries - 1);
        }, 5000);

        observer.observe(document.body, { childList: true, subtree: true });
    }

// 检测新课程加载并完成课程的函数
function monitorCourseStatus() {
    const observer = new MutationObserver(() => {
        const activeCourse = document.querySelector('.ant-list-item[style*="rgb(75, 75, 75)"]');
        if (activeCourse) {
            log("检测到新课程加载，尝试完成课程...");
            completeCourse();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
}

    // 修改自动完成课程逻辑
    function completeCourse() {
        const video = document.querySelector('video');
        if (video) {
            log("检测到视频播放器，开始自动完成课程...");
            video.currentTime = video.duration; // 快速跳到视频结尾
            setTimeout(() => {
                video.dispatchEvent(new Event('ended'));
                log("触发视频结束事件，等待完成状态更新...");
                setTimeout(() => {
                    const completionIcon = document.querySelector(`img[alt="icon"][src="${COMPLETION_ICON_BASE64}"]`);
                    if (completionIcon) {
                        log("课程标记为已完成，跳转到下一个课程...");
                        clickNextCourse().then(processNextCourse).catch((error) => {
                            log(`跳转下一个课程失败：${error.message}`);
                        });
                    } else {
                        log("课程未标记为完成，重试完成逻辑...");
                        completeCourse();
                    }
                }, 1000);
            }, 500);
        } else {
            log("未检测到视频播放器，可能是课程尚未加载完成，稍后重试...");
            setTimeout(completeCourse, 2000);
        }
    }

    // 页面加载后触发自动逻辑
    window.addEventListener('load', () => {
        log('页面加载完成，启动自动化课程逻辑...');
        setTimeout(() => {
            monitorCourseStatus(); // 监听课程状态
            playVideo(); // 播放当前课程
            clickNextCourse().then(processNextCourse).catch((error) => {
                log(`点击下一个课程出现错误: ${error.message}`);
            });
        }, 1000);
    });

    // 页面加载完成后的逻辑
    window.addEventListener('load', () => {
        log('页面加载完成，启动自动化课程播放逻辑...');
        setTimeout(() => {
            playVideo();
            clickNextCourse().then(processNextCourse).catch((error) => {
                log(`点击下一个课程出现错误: ${error.message}`);
            });
        }, 1000);
    });
})();