// ==UserScript==
// @name         掌阅阅读优化助手Pro
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  深度适配掌阅网页版的阅读优化插件，支持微软语音
// @match        https://pc.ireader.com/reader/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/526507/%E6%8E%8C%E9%98%85%E9%98%85%E8%AF%BB%E4%BC%98%E5%8C%96%E5%8A%A9%E6%89%8BPro.user.js
// @updateURL https://update.greasyfork.org/scripts/526507/%E6%8E%8C%E9%98%85%E9%98%85%E8%AF%BB%E4%BC%98%E5%8C%96%E5%8A%A9%E6%89%8BPro.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    // 配置存储
    const CONFIG = {
        width: GM_getValue('ireaderWidth', 1200),
        fontSize: GM_getValue('ireaderFontSize', 18),
        bgColor: GM_getValue('ireaderBgColor', '#F5F5DC'),
        panelX: GM_getValue('panelX', '90%'),
        panelY: GM_getValue('panelY', '50%')
    };

    // 核心样式覆盖
    GM_addStyle(`
        .reader-width[data-v-a8452c92] {
            max-width: ${CONFIG.width}px !important;
            background: ${CONFIG.bgColor} !important;
            margin: 0 auto !important;
        }

        #ireader-helper-panel {
            position: fixed !important;
            top: ${CONFIG.panelY} !important;
            left: ${CONFIG.panelX} !important;
            transform: translate(-100%, -50%);
            background: rgba(255,255,255,0.98) !important;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.2);
            padding: 16px;
            z-index: 2147483647;
            min-width: 260px;
            backdrop-filter: blur(10px);
            transition: all 0.3s;
        }

        .drag-handle {
            position: absolute;
            right: -24px;
            top: 50%;
            transform: translateY(-50%);
            cursor: move;
            padding: 8px;
            border-radius: 4px;
            background: rgba(0,0,0,0.1);
            opacity: 0.6;
        }
    `);

    // 微软语音合成
    const msTTS = {
        audio: null,
        async speak(text) {
            if(this.audio) this.audio.pause();
            this.audio = new Audio();
            this.audio.src = `https://api.ihuan.me/ms/tts?text=${encodeURIComponent(text)}&lang=zh-CN&voice=zh-CN-XiaoxiaoNeural`;
            await this.audio.play().catch(() => {
                alert('请点击页面任意位置后重试语音功能');
            });
        },
        stop() {
            if(this.audio) this.audio.pause();
        }
    };

    // 创建控制面板
    const createPanel = () => {
        $('body').append(`
            <div id="ireader-helper-panel">
                <div class="drag-handle">⋮⋮</div>
                <div class="control-group">
                    <label>页面宽度</label>
                    <input type="range" id="ireader-width" min="800" max="1600" value="${CONFIG.width}">
                </div>
                <div class="control-group">
                    <label>字体大小</label>
                    <input type="range" id="ireader-font" min="12" max="28" value="${CONFIG.fontSize}">
                </div>
                <div class="control-group">
                    <label>背景颜色</label>
                    <input type="color" id="ireader-bgcolor" value="${CONFIG.bgColor}">
                </div>
                <div class="control-group">
                    <button id="ireader-listen">🎧 听书</button>
                    <button id="ireader-stop">⏹ 停止</button>
                </div>
            </div>
        `);

        // 拖动功能
        let isDragging = false;
        let startX, startY;
        const panel = $('#ireader-helper-panel');

        panel.on('mousedown', '.drag-handle', function(e) {
            isDragging = true;
            startX = e.clientX - panel.offset().left;
            startY = e.clientY - panel.offset().top;
            e.preventDefault();
        });

        $(document).on('mousemove', function(e) {
            if (isDragging) {
                const newX = e.clientX - startX;
                const newY = e.clientY - startY;
                panel.css({ left: newX, top: newY });
                GM_setValue('panelX', newX + 'px');
                GM_setValue('panelY', newY + 'px');
            }
        }).on('mouseup', () => isDragging = false);

        // 样式更新
        const updateStyles = () => {
            CONFIG.width = $('#ireader-width').val();
            CONFIG.fontSize = $('#ireader-font').val();
            CONFIG.bgColor = $('#ireader-bgcolor').val();

            GM_setValue('ireaderWidth', CONFIG.width);
            GM_setValue('ireaderFontSize', CONFIG.fontSize);
            GM_setValue('ireaderBgColor', CONFIG.bgColor);

            // 更新外层样式
            $('.reader-width[data-v-a8452c92]')
                .css('max-width', CONFIG.width + 'px')
                .css('background', CONFIG.bgColor);

            // 更新iframe内容
            const iframe = $('#epubjs-container-* iframe')[0];
            if (iframe) {
                const style = `
                    body {
                        max-width: ${CONFIG.width}px !important;
                        font-size: ${CONFIG.fontSize}px !important;
                        background: ${CONFIG.bgColor} !important;
                        line-height: 1.8 !important;
                        margin: 0 auto !important;
                        padding: 20px !important;
                    }
                `;
                $(iframe.contentDocument.head).html(`<style>${style}</style>`);
            }
        };

        // 事件绑定
        $('#ireader-width, #ireader-font, #ireader-bgcolor').on('input', updateStyles);

        // 听书功能
        $('#ireader-listen').click(async () => {
            const iframe = $('#epubjs-container-* iframe')[0];
            if (iframe) {
                const content = $(iframe.contentDocument.body).text().substring(0, 5000);
                await msTTS.speak(content);
            }
        });

        $('#ireader-stop').click(() => msTTS.stop());
    };

    // 初始化流程
    const init = () => {
        createPanel();
        setInterval(() => {
            $('.reader-width[data-v-a8452c92]')
                .css('max-width', CONFIG.width + 'px')
                .css('background', CONFIG.bgColor);
        }, 1000);
    };

    // 智能等待iframe加载
    const waitReady = () => {
        const check = () => {
            if ($('#epubjs-container-*').length) {
                init();
            } else {
                setTimeout(check, 500);
            }
        };
        check();
    };

    // 启动
    $(document).ready(waitReady);
})(jQuery);