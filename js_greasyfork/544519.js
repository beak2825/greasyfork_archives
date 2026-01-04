// ==UserScript==
// @name         网易云音乐转Spotify
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  将网易云音乐歌曲转链到Spotify搜索
// @author       You
// @match        https://music.163.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544519/%E7%BD%91%E6%98%93%E4%BA%91%E9%9F%B3%E4%B9%90%E8%BD%ACSpotify.user.js
// @updateURL https://update.greasyfork.org/scripts/544519/%E7%BD%91%E6%98%93%E4%BA%91%E9%9F%B3%E4%B9%90%E8%BD%ACSpotify.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建悬浮按钮
    function createSpotifyButton() {
        // 创建按钮容器
        const buttonContainer = document.createElement('div');
        buttonContainer.id = 'spotify-button-container';
        
        // 设置容器样式，避免继承页面样式
        buttonContainer.style.cssText = `
            position: fixed;
            z-index: 9999;
            width: 32px;
            height: 32px;
            cursor: move;
        `;
        
        // 恢复保存的位置
        const savedPosition = localStorage.getItem('spotifyButtonPosition');
        if (savedPosition) {
            const position = JSON.parse(savedPosition);
            buttonContainer.style.left = position.x + 'px';
            buttonContainer.style.top = position.y + 'px';
        } else {
            // 默认位置
            buttonContainer.style.right = '20px';
            buttonContainer.style.bottom = '20px';
        }
        
        // 创建按钮元素
        const button = document.createElement('div');
        button.id = 'spotify-convert-button';
        
        // 设置按钮样式
        button.style.cssText = `
            width: 100%;
            height: 100%;
            background-color: #1DB954;
            border-radius: 50%;
            cursor: pointer;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            border: none;
            outline: none;
        `;
        
        // 添加Spotify图标
        button.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
        `;
        
        // 添加悬停效果
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'scale(1.1)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'scale(1)';
        });
        
        // 添加点击事件
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            convertToSpotify();
        });
        
        // 添加拖动功能
        let isDragging = false;
        let offsetX, offsetY;
        
        buttonContainer.addEventListener('mousedown', (e) => {
            // 只有在鼠标左键点击时才触发拖动
            if (e.button !== 0) return;
            
            isDragging = true;
            // 计算鼠标相对于按钮的偏移量
            offsetX = e.clientX - buttonContainer.getBoundingClientRect().left;
            offsetY = e.clientY - buttonContainer.getBoundingClientRect().top;
            
            // 防止拖动时选中文本
            e.preventDefault();
        });
        
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            
            // 计算按钮的新位置
            const x = e.clientX - offsetX;
            const y = e.clientY - offsetY;
            
            // 设置按钮位置
            buttonContainer.style.left = x + 'px';
            buttonContainer.style.top = y + 'px';
            
            // 清除默认位置
            buttonContainer.style.right = 'auto';
            buttonContainer.style.bottom = 'auto';
        });
        
        document.addEventListener('mouseup', () => {
            if (!isDragging) return;
            
            isDragging = false;
            
            // 保存按钮位置
            const rect = buttonContainer.getBoundingClientRect();
            const position = {
                x: rect.left,
                y: rect.top
            };
            localStorage.setItem('spotifyButtonPosition', JSON.stringify(position));
        });
        
        // 将按钮添加到容器
        buttonContainer.appendChild(button);
        
        // 将容器添加到页面
        document.body.appendChild(buttonContainer);
    }
    
    // 从页面标题获取歌曲信息
    function getSongInfoFromTitle() {
        // 获取页面标题
        const title = document.title;
        
        // 网易云音乐标题格式通常是 "歌曲名 - 歌手 - 网易云音乐"
        // 移除最后的"网易云音乐"部分
        let cleanTitle = title.replace(' - 网易云音乐', '');
        
        // 移除可能存在的"单曲"字样
        cleanTitle = cleanTitle.replace('单曲', '').trim();
        
        if (cleanTitle.includes(' - ')) {
            const parts = cleanTitle.split(' - ');
            
            // 通常格式是"歌曲名 - 歌手"或"歌手 - 歌曲名"
            // 我们可以通过一些启发式方法来判断
            
            // 如果第一部分包含常见的歌曲特征词，可能是歌曲名
            const firstPart = parts[0];
            const lastPart = parts[parts.length - 1];
            
            // 常见的歌曲特征词
            const songKeywords = ['(Live)', '(Remix)', '(Acoustic)', '(Cover)', '(Instrumental)', 'Live', 'Remix', 'Acoustic', 'Cover', 'Instrumental'];
            
            // 常见的歌手特征词
            const artistKeywords = ['专辑', '歌手', '精选集'];
            
            // 检查第一部分是否包含歌曲特征词
            const firstPartIsSong = songKeywords.some(keyword => firstPart.includes(keyword));
            
            // 检查最后一部分是否包含歌手特征词
            const lastPartIsArtist = artistKeywords.some(keyword => lastPart.includes(keyword));
            
            if (firstPartIsSong || lastPartIsArtist) {
                // 格式可能是"歌曲名 - 歌手"
                // 移除可能存在的"单曲"字样
                const songTitle = parts[0].replace('单曲', '').trim();
                return {
                    title: songTitle,
                    artist: parts.slice(1).join(' ')
                };
            } else {
                // 格式可能是"歌手 - 歌曲名"
                // 移除可能存在的"单曲"字样
                const songTitle = parts[parts.length - 1].replace('单曲', '').trim();
                return {
                    title: songTitle,
                    artist: parts.slice(0, parts.length - 1).join(' ')
                };
            }
        }
        
        // 如果无法解析，返回null
        return null;
    }
    
    // 转换到Spotify
    function convertToSpotify() {
        // 从页面标题获取歌曲信息
        const songInfo = getSongInfoFromTitle();
        
        if (songInfo) {
            // 构造搜索查询
            const query = `${songInfo.title} ${songInfo.artist}`;
            const encodedQuery = encodeURIComponent(query);
            
            // 构造Spotify搜索URL
            const spotifyUrl = `https://open.spotify.com/search/${encodedQuery}`;
            
            // 在新标签页中打开Spotify
            window.open(spotifyUrl, '_blank');
            
            // 显示简短的反馈
            showFeedback(`正在搜索: ${songInfo.title} - ${songInfo.artist}`);
        } else {
            // 如果无法获取歌曲信息，直接跳转到Spotify主页
            window.open('https://open.spotify.com/', '_blank');
            
            // 显示错误反馈
            showFeedback('无法从页面标题获取歌曲信息，跳转到Spotify主页');
        }
    }
    
    // 显示简短的反馈信息
    function showFeedback(message) {
        // 创建反馈元素
        const feedback = document.createElement('div');
        feedback.id = 'spotify-feedback';
        
        // 设置反馈样式
        feedback.style.cssText = `
            position: fixed;
            bottom: 80px;
            right: 20px;
            background-color: #333;
            color: white;
            padding: 10px 15px;
            border-radius: 4px;
            z-index: 10000;
            font-size: 14px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
        `;
        
        feedback.textContent = message;
        
        // 检查是否已存在反馈元素
        const existingFeedback = document.getElementById('spotify-feedback');
        if (existingFeedback) {
            existingFeedback.remove();
        }
        
        // 将反馈添加到页面
        document.body.appendChild(feedback);
        
        // 显示反馈
        setTimeout(() => {
            feedback.style.opacity = '1';
        }, 10);
        
        // 3秒后隐藏反馈
        setTimeout(() => {
            feedback.style.opacity = '0';
            setTimeout(() => {
                if (feedback.parentNode) {
                    feedback.parentNode.removeChild(feedback);
                }
            }, 300);
        }, 3000);
    }
    
    // 页面加载完成后创建按钮
    window.addEventListener('load', () => {
        // 延迟执行以确保页面完全加载
        setTimeout(createSpotifyButton, 1000);
    });
    
    // 监听页面标题变化
    let lastTitle = document.title;
    const titleObserver = new MutationObserver(() => {
        if (document.title !== lastTitle) {
            lastTitle = document.title;
            // 如果按钮不存在，则创建按钮
            if (!document.getElementById('spotify-convert-button')) {
                setTimeout(createSpotifyButton, 100);
            }
        }
    });
    
    // 观察标题变化
    const titleElement = document.querySelector('title');
    if (titleElement) {
        titleObserver.observe(titleElement, {
            childList: true,
            subtree: true
        });
    }

})();