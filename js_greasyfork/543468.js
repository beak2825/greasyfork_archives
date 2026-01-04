// ==UserScript==
// @name         2025年暑期教师研修|国家智慧教育平台|自动刷课(保活+章节跳转+防挂起增强版)
// @namespace    http://tampermonkey.net/
// @version      2025.07.25.Enhanced
// @description  支持刷课跳转、防黑屏、防后台暂停、课程数量可配置，适用于  https://teacher.vocational.smartedu.cn/h/subject/summer2025/*
// @author       snake
// @match        https://teacher.vocational.smartedu.cn/h/subject/summer2025/*
// @match        https://core.teacher.vocational.smartedu.cn/p/course/vocational/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=smartedu.cn
// @require      https://fastly.jsdelivr.net/npm/sweetalert2@11.12.4/dist/sweetalert2.all.min.js
// @resource     css https://fastly.jsdelivr.net/npm/sweetalert2@11.12.4/dist/sweetalert2.min.css
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @run-at       window-load
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543468/2025%E5%B9%B4%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%7C%E5%9B%BD%E5%AE%B6%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%7C%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%28%E4%BF%9D%E6%B4%BB%2B%E7%AB%A0%E8%8A%82%E8%B7%B3%E8%BD%AC%2B%E9%98%B2%E6%8C%82%E8%B5%B7%E5%A2%9E%E5%BC%BA%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/543468/2025%E5%B9%B4%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%7C%E5%9B%BD%E5%AE%B6%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%B9%B3%E5%8F%B0%7C%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%28%E4%BF%9D%E6%B4%BB%2B%E7%AB%A0%E8%8A%82%E8%B7%B3%E8%BD%AC%2B%E9%98%B2%E6%8C%82%E8%B5%B7%E5%A2%9E%E5%BC%BA%E7%89%88%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

     const CONFIG = {
        homePage: "https://teacher.vocational.smartedu.cn/h/subject/summer2025/",
        courseUrls: [

            // 大力弘扬教育家精神
        "https://core.teacher.vocational.smartedu.cn/p/course/vocational/v_1006810077161279488?itemId=1003783402737631232&type=1&segId=1003783189381775360&projectId=1003782210250866688&orgId=571896669159477248&originP=2&service=https%3A%2F%2Fteacher.vocational.smartedu.cn%2Fh%2Fsubject%2Fsummer2025%2F",
        // 数字素养提升
        "https://core.teacher.vocational.smartedu.cn/p/course/vocational/v_1006810077178056704?itemId=1003783541964902400&type=1&segId=1003783492176969728&projectId=1003782210250866688&orgId=571896669159477248&originP=2&service=https%3A%2F%2Fteacher.vocational.smartedu.cn%2Fh%2Fsubject%2Fsummer2025%2F",

        "https://core.teacher.vocational.smartedu.cn/p/course/vocational/v_1006810077190639616?itemId=1003783661561286656&type=1&segId=1003783607545495552&projectId=1003782210250866688&orgId=571896669159477248&originP=2&service=https%3A%2F%2Fteacher.vocational.smartedu.cn%2Fh%2Fsubject%2Fsummer2025%2F",
        // 心理健康教育能力提升
        "https://core.teacher.vocational.smartedu.cn/p/course/vocational/v_1006810077203222528?itemId=1003783791077199872&type=1&segId=1003783745559068672&projectId=1003782210250866688&orgId=571896669159477248&originP=2&service=https%3A%2F%2Fteacher.vocational.smartedu.cn%2Fh%2Fsubject%2Fsummer2025%2F",
        // 实验室安全管理
        "https://core.teacher.vocational.smartedu.cn/p/course/vocational/v_1006810077215805440?itemId=1003783955703631872&type=1&segId=1003783868238266368&projectId=1003782210250866688&orgId=571896669159477248&originP=2&service=https%3A%2F%2Fteacher.vocational.smartedu.cn%2Fh%2Fsubject%2Fsummer2025%2F",
        // 科创劳动教育的实践路径
        ],
       // 👇 每个课程要刷的视频数量（手动配置）
        courseVideoLimits: [9, 12, 3,5, 9], // 顺序对应上面的课程列表
        playbackRate: 1.0,
        mute: true,
        checkInterval: 3000
    };
    const SELECTORS = {
        videoListItem: ".video-title.clearfix",
        playButtonContainer: ".one",
        videoElement: "video",
        videoContainer: "#video",
        xgplayerStartButton: ".xgplayer-start",
        anyPopupConfirmButton: ".el-button.el-button--primary, .layui-layer-btn0",
    };

    function getCurrentCourseIndex() {
        const currentUrl = window.location.href;
        const currentCourseId = (currentUrl.match(/\/v_(\d+)/) || [])[1];
        for (let i = 0; i < CONFIG.courseUrls.length; i++) {
            const courseId = (CONFIG.courseUrls[i].match(/\/v_(\d+)/) || [])[1];
            if (courseId === currentCourseId) return i;
        }
        return -1;
    }

    function isCourseCompleted() {
        const index = getCurrentCourseIndex();
        const required = CONFIG.courseVideoLimits[index] || 10;
        const watched = document.querySelectorAll(`${SELECTORS.videoListItem}[data-progress="1"]`).length;
        return watched >= required;
    }

    function navigateToNextCourse() {
        const currentIndex = getCurrentCourseIndex();
        const nextIndex = currentIndex + 1;
        if (nextIndex < CONFIG.courseUrls.length) {
            window.location.href = CONFIG.courseUrls[nextIndex];
        } else {
            Swal.fire("🎉 所有课程完成", "挂机结束！", "success");
        }
    }

    function findAndPlayNextVideo() {
        if (isCourseCompleted()) {
            navigateToNextCourse();
            return;
        }
        const nextItem = document.querySelector(`${SELECTORS.videoListItem}:not([data-progress="1"])`);
        if (nextItem) {
            const playBtn = nextItem.querySelector(SELECTORS.playButtonContainer);
            if (playBtn) playBtn.click();
        } else {
            navigateToNextCourse();
        }
    }

    function handleVideoPlayback() {
        const video = document.querySelector(`${SELECTORS.videoContainer} ${SELECTORS.videoElement}`);
        if (!video) return;
        video.muted = CONFIG.mute;
        video.playbackRate = CONFIG.playbackRate;
        video.play().catch(() => {});
        video.addEventListener("ended", () => setTimeout(findAndPlayNextVideo, 1000));
    }

    function observeVideoChanges() {
        const targetNode = document.querySelector(SELECTORS.videoContainer);
        if (!targetNode) return setTimeout(observeVideoChanges, 2000);
        let lastSrc = "";
        const observer = new MutationObserver(() => {
            const video = targetNode.querySelector(SELECTORS.videoElement);
            if (video && video.src && video.src !== lastSrc) {
                lastSrc = video.src;
                handleVideoPlayback();
            }
        });
        observer.observe(targetNode, { childList: true, subtree: true });
    }

    function setupGlobalPopupObserver() {
        const observer = new MutationObserver(() => {
            const btn = document.querySelector(SELECTORS.anyPopupConfirmButton);
            if (btn && btn.offsetParent !== null) {
                observer.disconnect();
                btn.click();
                setTimeout(() => {
                    findAndPlayNextVideo();
                    setupGlobalPopupObserver();
                }, 2000);
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    function simulateUserActivity() {
        let lastTime = 0;
        function step(time) {
            if (time - lastTime > 2000) {
                document.dispatchEvent(new MouseEvent('mousemove'));
                document.dispatchEvent(new Event('scroll'));
                const video = document.querySelector('video');
                if (video && video.paused) {
                    video.play().catch(() => {});
                }
                lastTime = time;
            }
            requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }

    function keepAwakeWhenHidden() {
        document.addEventListener("visibilitychange", () => {
            const video = document.querySelector("video");
            if (video && document.visibilityState === "hidden" && video.paused) {
                video.play().catch(() => {});
            }
        });

        setInterval(() => {
            const video = document.querySelector("video");
            if (document.visibilityState === "hidden" && video && video.paused) {
                video.play().catch(() => {});
            }
        }, 5000);
    }

    function main() {
        GM_addStyle(GM_getResourceText("css"));
        const href = window.location.href;

        if (CONFIG.courseUrls.some(u => href.includes("/" + u.match(/v_\d+/)[0]))) {
            setupGlobalPopupObserver();
            observeVideoChanges();
            setTimeout(findAndPlayNextVideo, 3000);
            keepAwakeWhenHidden();
            simulateUserActivity();
        } else if (href.startsWith(CONFIG.homePage)) {
            Swal.fire({
                title: '是否开启自动刷课？',
                text: '系统将自动播放视频并跳转章节',
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: '是，开始',
                cancelButtonText: '否',
                allowOutsideClick: false
            }).then((result) => {
                if (result.isConfirmed) {
                    Swal.fire("准备跳转...", "", "info");
                    setTimeout(() => {
                        window.location.href = CONFIG.courseUrls[0];
                    }, 1500);
                }
            });
        }
    }

    window.addEventListener('load', main);
})();