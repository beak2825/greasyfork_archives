// ==UserScript==
// @name         TOD🚀全平台网课助手【学习通 U校园ai 知到 英华 仓辉 雨课堂 职教云】【学起 青书 柠檬 睿学 慕享 出头科技 慕华】【国开 广开 上海开放大学】等平台 客服微信：WKWK796  自动刷课
// @namespace    https://github.com/wkwk796
// @version      2.9.1
// @description  🐯全网免费仅做一款脚本🐯】、【🚀已完美兼容、智慧树、中国大学mooc、慕课、雨课堂、新国开、超星、学习通、知到、国家开放大学、蓝墨云、职教云、智慧职教、云班课精品课、山东专技、西财在线剩余网站仅支持部分功能🚀】【半兼容、绎通云、U校园、学堂在线】、【😎完美应付测试，全自动答题，一键完成所有资源学习（视频挨个刷时长不存在滴）、视频倍速😎】、
// @author       Wkwk796
// @match        *://*.chaoxing.com/*
// @match        *://*.zhihuishu.com/*
// @match        *://*.chaoxing.com/*
// @match        *://mooc1.chaoxing.com/nodedetailcontroller/*
// @match        *://*.chaoxing.com/mooc-ans/work/doHomeWorkNew*
// @match        *://*.chaoxing.com/work/doHomeWorkNew*
// @match        *://*.edu.cn/work/doHomeWorkNew*
// @match        *://*.asklib.com/*
// @match        *://*.chaoxing.com/*
// @match        *://*.hlju.edu.cn/*
// @match        *://lms.ouchn.cn/*
// @match        *://xczxzdbf.moodle.qwbx.ouchn.cn/*
// @match        *://tongyi.aliyun.com/qianwen/*
// @match        *://chatglm.cn/*
// @match        *://*.zhihuishu.com/*
// @match        *://course.ougd.cn/*
// @match        *://moodle.syxy.ouchn.cn/*
// @match        *://moodle.qwbx.ouchn.cn/*
// @match        *://elearning.bjou.edu.cn/*
// @match        *://whkpc.hnqtyq.cn:5678/*
// @match        *://study.ouchn.cn/*
// @match        *://www.51xinwei.com/*
// @match        *://*.w-ling.cn/*
// @match        *://xuexi.jsou.cn/*
// @match        *://*.edu-edu.com/*
// @match        *://xuexi.jsou.cn/*
// @match        *://spoc-exam.icve.com.cn/*
// @match        *://*.icve.com.cn/*
// @match        *://zice.cnzx.info/*
// @grant        unsafeWindow
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_info
// @grant        GM_addStyle
// @grant        unsafeWindow
// @grant        none
// @license      MIT
// @icon         https://static.zhihuishu.com/static/img/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/530613/TOD%F0%9F%9A%80%E5%85%A8%E5%B9%B3%E5%8F%B0%E7%BD%91%E8%AF%BE%E5%8A%A9%E6%89%8B%E3%80%90%E5%AD%A6%E4%B9%A0%E9%80%9A%20U%E6%A0%A1%E5%9B%ADai%20%E7%9F%A5%E5%88%B0%20%E8%8B%B1%E5%8D%8E%20%E4%BB%93%E8%BE%89%20%E9%9B%A8%E8%AF%BE%E5%A0%82%20%E8%81%8C%E6%95%99%E4%BA%91%E3%80%91%E3%80%90%E5%AD%A6%E8%B5%B7%20%E9%9D%92%E4%B9%A6%20%E6%9F%A0%E6%AA%AC%20%E7%9D%BF%E5%AD%A6%20%E6%85%95%E4%BA%AB%20%E5%87%BA%E5%A4%B4%E7%A7%91%E6%8A%80%20%E6%85%95%E5%8D%8E%E3%80%91%E3%80%90%E5%9B%BD%E5%BC%80%20%E5%B9%BF%E5%BC%80%20%E4%B8%8A%E6%B5%B7%E5%BC%80%E6%94%BE%E5%A4%A7%E5%AD%A6%E3%80%91%E7%AD%89%E5%B9%B3%E5%8F%B0%20%E5%AE%A2%E6%9C%8D%E5%BE%AE%E4%BF%A1%EF%BC%9AWKWK796%20%20%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/530613/TOD%F0%9F%9A%80%E5%85%A8%E5%B9%B3%E5%8F%B0%E7%BD%91%E8%AF%BE%E5%8A%A9%E6%89%8B%E3%80%90%E5%AD%A6%E4%B9%A0%E9%80%9A%20U%E6%A0%A1%E5%9B%ADai%20%E7%9F%A5%E5%88%B0%20%E8%8B%B1%E5%8D%8E%20%E4%BB%93%E8%BE%89%20%E9%9B%A8%E8%AF%BE%E5%A0%82%20%E8%81%8C%E6%95%99%E4%BA%91%E3%80%91%E3%80%90%E5%AD%A6%E8%B5%B7%20%E9%9D%92%E4%B9%A6%20%E6%9F%A0%E6%AA%AC%20%E7%9D%BF%E5%AD%A6%20%E6%85%95%E4%BA%AB%20%E5%87%BA%E5%A4%B4%E7%A7%91%E6%8A%80%20%E6%85%95%E5%8D%8E%E3%80%91%E3%80%90%E5%9B%BD%E5%BC%80%20%E5%B9%BF%E5%BC%80%20%E4%B8%8A%E6%B5%B7%E5%BC%80%E6%94%BE%E5%A4%A7%E5%AD%A6%E3%80%91%E7%AD%89%E5%B9%B3%E5%8F%B0%20%E5%AE%A2%E6%9C%8D%E5%BE%AE%E4%BF%A1%EF%BC%9AWKWK796%20%20%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 自动播放视频函数
    function autoPlayVideo() {
        // 查找所有视频元素
        const videos = document.querySelectorAll('video');
        videos.forEach(video => {
            // 自动播放
            if (video.paused) {
                video.play().catch(err => {
                    console.log('视频播放失败:', err);
                });
            }
            // 静音
            video.muted = true;
        });

        // 处理学习通特定的视频播放按钮
        const playButtons = document.querySelectorAll(
            '.vjs-big-play-button, ' +
            '.cvideo_play_btn, ' +
            '.playButton, ' +
            '[class*="play"][class*="btn"],' +
            '.cvideo_play_button,' +
            '.vjs-play-control'
        );
        playButtons.forEach(button => {
            if (button.style.display !== 'none' && button.offsetParent !== null) {
                button.click();
            }
        });

        // 处理弹窗广告
        const closeButtons = document.querySelectorAll(
            '.close, ' +
            '.closeBtn, ' +
            '.icon-close, ' +
            '[class*="close"][class*="btn"]'
        );
        closeButtons.forEach(button => {
            button.click();
        });
    }

    // 在控制面板添加联系方式
    function addContactInfo() {
        // 查找控制面板元素（适配学习通不同版本）
        const controlSelectors = [
            '.cvideo_control_panel',
            '.vjs-control-bar',
            '.video-controls',
            '.cvideo_control',
            '.player-controls'
        ];

        let controlPanel = null;
        for (const selector of controlSelectors) {
            controlPanel = document.querySelector(selector);
            if (controlPanel) break;
        }

        if (controlPanel && !document.getElementById('contact-info')) {
            const contactDiv = document.createElement('div');
            contactDiv.id = 'contact-info';
            contactDiv.style.cssText = `
                padding: 5px 10px;
                background-color: rgba(0, 0, 0, 0.7);
                color: white;
                font-size: 12px;
                border-radius: 4px;
                margin: 0 5px;
                display: inline-block;
                z-index: 9999;
            `;
            contactDiv.textContent = '联系方式: wkwk796';
            controlPanel.appendChild(contactDiv);
        }

        // 如果找不到控制面板，尝试在视频容器附近添加
        if (!document.getElementById('contact-info')) {
            const videoContainers = document.querySelectorAll(
                '.cvideo, ' +
                '.video-js, ' +
                '.main-video, ' +
                '.video-container'
            );
            videoContainers.forEach(container => {
                if (!container.querySelector('#contact-info')) {
                    const contactDiv = document.createElement('div');
                    contactDiv.id = 'contact-info';
                    contactDiv.style.cssText = `
                        position: absolute;
                        top: 10px;
                        right: 10px;
                        padding: 5px 10px;
                        background-color: rgba(0, 0, 0, 0.7);
                        color: white;
                        font-size: 12px;
                        border-radius: 4px;
                        z-index: 9999;
                    `;
                    contactDiv.textContent = '联系方式: wkwk796';
                    container.style.position = 'relative';
                    container.appendChild(contactDiv);
                }
            });
        }
    }

    // 主函数
    function main() {
        autoPlayVideo();
        addContactInfo();
    }

    // 页面加载完成后执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', main);
    } else {
        main();
    }

    // 监听页面变化，处理动态加载的视频
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(() => {
            main();
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 定时检查视频状态（更频繁的检查）
    setInterval(autoPlayVideo, 2000);

})();