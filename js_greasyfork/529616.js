// ==UserScript==
// @namespace     https://openuserjs.org/users/George
// @name          Add control in lizhiweike
// @description   Add control of video in lizhiweike
// @copyright     2025, George (https://openuserjs.org/users/George)
// @license       MIT
// @version       0.0.6
// @match        https://*.lizhiweike.com/lecture2/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/529616/Add%20control%20in%20lizhiweike.user.js
// @updateURL https://update.greasyfork.org/scripts/529616/Add%20control%20in%20lizhiweike.meta.js
// ==/UserScript==

// ==OpenUserJS==
// @author George
// ==/OpenUserJS==

(function() {
    'use strict';

    const observer = new MutationObserver((mutationList, observer) => {
        if (window.location.href.startsWith('https://m1.lizhiweike.com/lecture2')) {
            const videoEle = document.querySelector('video');
            
            const oldControlEle = document.querySelector('.VideoPlay-control-wrap');
            const playEle = document.querySelector('.VideoPlay-status');
            const blankEle = document.querySelector('.CommentList-blank');
            const liveEle = document.querySelector('.RecordLiveroom');
            const footerEle = document.querySelector('.AppFooter');
            const messageEle = document.querySelector('.CommentInput-container');
            const shareEle = document.querySelector('.FixedShareCard');
            const moreEle = document.querySelector('.FloatingWindow-wrap-more');
            const headerTitleEle = document.querySelector('.HeaderTitle-container');
            const allCourseEle = document.querySelector('.HeaderVideoLectureList-moreBox');

            [oldControlEle, playEle, blankEle, liveEle, footerEle, messageEle,shareEle, moreEle, headerTitleEle, allCourseEle].map(item => {
                if (item) {
                    item.style.display = 'none';
                }
            });

            const appEle = document.querySelector('.App');
            if (appEle) {
                appEle.style.maxWidth = '100%';
            }

            const appPageEle = document.querySelector('.AppScrollPage');
            if (appPageEle) {
                appPageEle.style.overflow = 'hidden';

                const children = appPageEle.children; // 获取所有子元素
                for (let child of children) {
                    child.style.height = '100%';
                }
            }

            const headerEle = document.querySelector('.Header');
            const containerEle = document.querySelector('.HeaderVideoLectureList-container');
            const listContainerEle = document.querySelector('.HeaderVideoLectureList-list-container');
            const videoContainerEle = document.querySelector('.HeaderVideo-container');

            if (videoContainerEle) {
                const containerWidth = window.innerWidth - 240; // 100% 宽度减去 240px
                videoContainerEle.style.width = `${containerWidth}px`;
            }

            if (listContainerEle) {
                listContainerEle.style.paddingLeft = '0';
            }

            [headerEle, containerEle, listContainerEle, videoContainerEle].map(item => {
                if (item) {
                    item.style.height = '100%';
                }
            });

            if (headerEle) {
                headerEle.style.display = 'flex';
                headerEle.style.flexDirection = 'column';
            }

            const listEle = document.querySelector('.HeaderVideoLectureList-list');

            if (listEle) {
                listEle.style.display = 'block';
            }

            const courseListEle = document.querySelector('.HeaderVideoLectureList-container');

            if (courseListEle) {
                courseListEle.style.position = 'absolute';
                courseListEle.style.top = '0';
                courseListEle.style.right = '0';
                courseListEle.style.zIndex = '2'; // 确保标题在 video 上方
                courseListEle.style.width = '240px';
                courseListEle.style.height = '100vh';
                courseListEle.style.padding = '12px 0';
                courseListEle.style.overflow = 'hidden';
            }

            document.querySelectorAll('.HeaderVideoLectureList-list-item-container')
                .forEach(item => {
                item.style.width = '100%';
                item.style.margin = '0';
                item.style.height = 'auto';
            });

            document.querySelectorAll('.HeaderVideoLectureList-list-item')
                .forEach(item => {
                item.style.width = '100%';
                item.style.padding = '16px 12px';
                item.style.height = 'auto';

                const children = item.children; // 获取所有子元素
                for (let child of children) {
                    child.style.textAlign = 'center';
                }
            });

            if (videoEle) {
                videoEle.controls = true;
            }

            const titleEle = document.querySelector('.HeaderTitle-title');

            if (titleEle) {
                titleEle.style.position = 'absolute';
                titleEle.style.top = '16px';
                titleEle.style.left = '24px';
                titleEle.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'; // 背景半透明
                titleEle.style.color = '#fff'; // 文字颜色为白色
                titleEle.style.zIndex = '1'; // 确保标题在 video 上方
                titleEle.style.opacity = '0.7'; // 设置标题半透明
            }
        }
    })

    observer.observe(document.body, {
        childList: true,
        subtree: true
    })
})();