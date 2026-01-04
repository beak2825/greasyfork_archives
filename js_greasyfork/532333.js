// ==UserScript==
// @name         油管切换“已看视频”状态
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  Hides the YouTube Create button, replaces it with a "隐藏" button with a red border, toggles watched video visibility (homepage, subscriptions, search), and persists state
// @author       Grok
// @match        https://www.youtube.com/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/532333/%E6%B2%B9%E7%AE%A1%E5%88%87%E6%8D%A2%E2%80%9C%E5%B7%B2%E7%9C%8B%E8%A7%86%E9%A2%91%E2%80%9D%E7%8A%B6%E6%80%81.user.js
// @updateURL https://update.greasyfork.org/scripts/532333/%E6%B2%B9%E7%AE%A1%E5%88%87%E6%8D%A2%E2%80%9C%E5%B7%B2%E7%9C%8B%E8%A7%86%E9%A2%91%E2%80%9D%E7%8A%B6%E6%80%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 函数：替换“创建”按钮并添加功能
    function replaceCreateButton() {
        // 尝试选择带有 aria-label="Create" 的按钮
        let createButton = document.querySelector('ytd-button-renderer[aria-label="Create"]');
        
        // 如果没找到，尝试基于文本内容“Create”或“创建”选择（多语言兼容）
        if (!createButton) {
            const buttons = document.querySelectorAll('ytd-button-renderer');
            buttons.forEach(button => {
                const textContent = button.textContent.toLowerCase();
                if (textContent.includes('create') || textContent.includes('创建')) {
                    createButton = button;
                }
            });
        }

        // 如果找到按钮，则替换
        if (createButton) {
            const newButton = document.createElement('button');
            
            // 从 localStorage 获取上次状态，默认为 'hidden'
            let isHidden = localStorage.getItem('hideWatchedState') === 'shown';
            
            // 根据状态初始化按钮
            newButton.textContent = isHidden ? '显示' : '隐藏';
            newButton.style.display = 'flex';
            newButton.style.flexDirection = 'row';
            newButton.style.alignItems = 'center';
            newButton.style.justifyContent = 'center';
            newButton.style.fontFamily = 'Roboto, Arial, sans-serif';
            newButton.style.fontSize = '14px';
            newButton.style.fontWeight = '500';
            newButton.style.lineHeight = '36px';
            newButton.style.height = '36px';
            newButton.style.padding = '0px 16px';
            newButton.style.borderRadius = '18px';
            newButton.style.color = 'rgb(15, 15, 15)';
            newButton.style.background = 'rgba(0, 0, 0, 0.05)';
            newButton.style.borderWidth = '3px';
            newButton.style.borderStyle = 'solid';
            newButton.style.borderColor = isHidden ? 'transparent' : 'rgb(255, 0, 0)';
            newButton.style.cursor = 'pointer';
            newButton.style.whiteSpace = 'nowrap';
            newButton.style.textTransform = 'none';
            newButton.style.boxSizing = 'border-box';
            newButton.style.marginRight = '8px';

            // 点击事件：切换状态并保存
            newButton.addEventListener('click', () => {
                if (!isHidden) {
                    // 切换到隐藏状态
                    newButton.textContent = '显示';
                    newButton.style.borderColor = 'transparent';
                    hideWatchedVideos();
                    isHidden = true;
                    localStorage.setItem('hideWatchedState', 'shown');
                } else {
                    // 切换到显示状态
                    newButton.textContent = '隐藏';
                    newButton.style.borderColor = 'rgb(255, 0, 0)';
                    showWatchedVideos();
                    isHidden = false;
                    localStorage.setItem('hideWatchedState', 'hidden');
                }
            });

            // 初始化时应用状态
            if (isHidden) {
                hideWatchedVideos();
            } else {
                showWatchedVideos();
            }

            const parent = createButton.parentNode;
            if (parent) {
                parent.replaceChild(newButton, createButton);
                console.log('Create button replaced successfully with search page support');
            }
        }
    }

    // 函数：隐藏已观看视频（包括主页、订阅页和搜索结果页）
    function hideWatchedVideos() {
        // 隐藏 <ytd-compact-video-renderer>（订阅页）
        const compactVideoItems = document.querySelectorAll('ytd-compact-video-renderer');
        compactVideoItems.forEach(item => {
            const progress = item.querySelector('ytd-thumbnail-overlay-resume-playback-renderer #progress');
            if (progress && progress.style.width && progress.style.width !== '0%') {
                item.style.display = 'none';
            }
        });

        // 隐藏 <ytd-rich-item-renderer>（主页）
        const richVideoItems = document.querySelectorAll('ytd-rich-item-renderer');
        richVideoItems.forEach(item => {
            const progress = item.querySelector('ytd-thumbnail-overlay-resume-playback-renderer #progress');
            if (progress && progress.style.width && progress.style.width !== '0%') {
                item.style.display = 'none';
            }
        });

        // 隐藏 <ytd-video-renderer>（搜索结果页）
        const searchVideoItems = document.querySelectorAll('ytd-video-renderer');
        searchVideoItems.forEach(item => {
            const progress = item.querySelector('ytd-thumbnail-overlay-resume-playback-renderer #progress');
            if (progress && progress.style.width && progress.style.width !== '0%') {
                item.style.display = 'none';
            }
        });
    }

    // 函数：显示已观看视频（包括主页、订阅页和搜索结果页）
    function showWatchedVideos() {
        // 显示 <ytd-compact-video-renderer>（订阅页）
        const compactVideoItems = document.querySelectorAll('ytd-compact-video-renderer');
        compactVideoItems.forEach(item => {
            item.style.display = '';
        });

        // 显示 <ytd-rich-item-renderer>（主页）
        const richVideoItems = document.querySelectorAll('ytd-rich-item-renderer');
        richVideoItems.forEach(item => {
            item.style.display = '';
        });

        // 显示 <ytd-video-renderer>（搜索结果页）
        const searchVideoItems = document.querySelectorAll('ytd-video-renderer');
        searchVideoItems.forEach(item => {
            item.style.display = '';
        });
    }

    // 初次运行
    replaceCreateButton();

    // 使用 MutationObserver 监听 DOM 变化并同步状态
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(() => {
            replaceCreateButton(); // 替换按钮
            // 同步视频隐藏状态
            const isHidden = localStorage.getItem('hideWatchedState') === 'shown';
            if (isHidden) {
                hideWatchedVideos();
            } else {
                showWatchedVideos();
            }
        });
    });

    // 观察整个文档的变化
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 页面加载完成后再次检查状态
    window.addEventListener('load', () => {
        const isHidden = localStorage.getItem('hideWatchedState') === 'shown';
        if (isHidden) {
            hideWatchedVideos();
        } else {
            showWatchedVideos();
        }
    });
})();