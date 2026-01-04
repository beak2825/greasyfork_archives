// ==UserScript==
// @name         LinkedIn Learning 字幕大小调整
// @name:en      LinkedIn Learning Subtitle Size Adjuster
// @name:zh-CN   LinkedIn Learning 字幕大小调整
// @name:zh-TW   LinkedIn Learning 字幕大小調整
// @name:ja      LinkedIn Learning 字幕サイズ調整
// @name:ko      LinkedIn Learning 자막 크기 조정
// @name:es      Ajustador de tamaño de subtítulos de LinkedIn Learning
// @name:fr      Ajusteur de taille des sous-titres LinkedIn Learning
// @name:it      Regolatore dimensione sottotitoli LinkedIn Learning
// @name:de      LinkedIn Learning Untertitelgrößen-Anpasser
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description         在 LinkedIn Learning 视频播放器设置菜单中添加字幕大小调整功能
// @description:en      Add subtitle size adjustment to LinkedIn Learning video player settings
// @description:zh-CN   在 LinkedIn Learning 视频播放器设置菜单中添加字幕大小调整功能
// @description:zh-TW   在 LinkedIn Learning 視頻播放器設置菜單中添加字幕大小調整功能
// @description:ja      LinkedIn Learning のビデオプレーヤー設定に字幕サイズ調整機能を追加
// @description:ko      LinkedIn Learning 비디오 플레이어 설정에 자막 크기 조정 기능 추가
// @description:es      Agregar ajuste de tamaño de subtítulos en la configuración del reproductor de LinkedIn Learning
// @description:fr      Ajouter le réglage de la taille des sous-titres dans les paramètres du lecteur LinkedIn Learning
// @description:it      Aggiunge la regolazione della dimensione dei sottotitoli nelle impostazioni del player LinkedIn Learning
// @description:de      Fügt Untertitelgrößenanpassung zu den LinkedIn Learning Player-Einstellungen hinzu
// @author      经本正一
// @license     MIT
// @match       https://www.linkedin.com/learning/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/517587/LinkedIn%20Learning%20%E5%AD%97%E5%B9%95%E5%A4%A7%E5%B0%8F%E8%B0%83%E6%95%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/517587/LinkedIn%20Learning%20%E5%AD%97%E5%B9%95%E5%A4%A7%E5%B0%8F%E8%B0%83%E6%95%B4.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // 创建字幕控制菜单项
    function createSubtitleControls() {
        const settingsMenu = document.querySelector('.vjs-settings-menu .vjs-menu-content');
        if (!settingsMenu) {
            console.log('未找到设置菜单');
            return;
        }

        // 创建字幕控制容器
        const subtitleControlContainer = document.createElement('div');
        subtitleControlContainer.className = 'vjs-menu-item subtitle-size-control';
        subtitleControlContainer.style.cssText = `
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 8px 16px;
            cursor: default;
            border-bottom: 1px solid rgba(255,255,255,0.1);
            color: white;
            font-family: -apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue","Fira Sans",Ubuntu,Oxygen,"Oxygen Sans",Cantarell,"Droid Sans","Apple Color Emoji","Segoe UI Emoji","Segoe UI Emoji","Segoe UI Symbol","Lucida Grande",Helvetica,Arial,sans-serif;
        `;

        // 添加标题
        const title = document.createElement('span');
        title.textContent = '字幕大小';
        title.style.marginRight = '10px';

        // 创建按钮容器
        const buttonContainer = document.createElement('div');
        buttonContainer.style.display = 'flex';
        buttonContainer.style.gap = '5px';

        // 按钮样式
        const buttonStyle = `
            padding: 2px 8px;
            margin: 0 2px;
            border: none;
            border-radius: 3px;
            background: #0a66c2;
            color: white;
            cursor: pointer;
            font-size: 12px;
        `;

        // 创建按钮
        const decreaseBtn = document.createElement('button');
        decreaseBtn.textContent = '小';
        decreaseBtn.style.cssText = buttonStyle;
        
        const defaultBtn = document.createElement('button');
        defaultBtn.textContent = '默认';
        defaultBtn.style.cssText = buttonStyle;
        
        const increaseBtn = document.createElement('button');
        increaseBtn.textContent = '大';
        increaseBtn.style.cssText = buttonStyle;

        // 添加事件监听
        decreaseBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            adjustSubtitleSize(-0.1);
        });
        
        defaultBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            resetSubtitleSize();
        });
        
        increaseBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            adjustSubtitleSize(0.1);
        });

        // 组装控件
        buttonContainer.appendChild(decreaseBtn);
        buttonContainer.appendChild(defaultBtn);
        buttonContainer.appendChild(increaseBtn);
        subtitleControlContainer.appendChild(title);
        subtitleControlContainer.appendChild(buttonContainer);

        // 插入到设置菜单的最前面
        if (settingsMenu.firstChild) {
            settingsMenu.insertBefore(subtitleControlContainer, settingsMenu.firstChild);
        } else {
            settingsMenu.appendChild(subtitleControlContainer);
        }
    }

    // 调整字幕大小
    function adjustSubtitleSize(delta) {
        const subtitles = document.querySelector('.vjs-text-track-display');
        if (!subtitles) {
            console.log('未找到字幕元素');
            return;
        }

        const currentScale = parseFloat(subtitles.style.transform?.match(/scale\((.*?)\)/) ?.[1]) || 1;
        const newScale = Math.max(0.5, Math.min(2, currentScale + delta));
        subtitles.style.transform = `scale(${newScale})`;
        console.log(`字幕大小已调整为: ${newScale}`);
    }

    // 重置字幕大小
    function resetSubtitleSize() {
        const subtitles = document.querySelector('.vjs-text-track-display');
        if (!subtitles) return;
        subtitles.style.transform = 'scale(1)';
    }

    // 初始化
    function init() {
        console.log('正在初始化字幕控制...');
        
        // 监听齿轮按钮的点击事件
        document.addEventListener('click', (e) => {
            // 等待菜单出现
            setTimeout(() => {
                const settingsMenu = document.querySelector('.vjs-settings-menu .vjs-menu-content');
                const existingControls = document.querySelector('.subtitle-size-control');
                
                if (settingsMenu && !existingControls) {
                    console.log('找到设置菜单，添加字幕控制');
                    createSubtitleControls();
                }
            }, 100);
        });
    }

    init();
})(); 