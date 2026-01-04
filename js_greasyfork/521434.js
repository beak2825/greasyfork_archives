// ==UserScript==
// @name         YouTube 视频下载助手｜多种清晰度HD/2K/4K🔥｜Video&Audio 📥
// @name:en      YouTube Video Downloader | HD Quality Options | Video&Audio 📥
// @name:ja      YouTube動画ダウンローダー｜HD高画質｜ビデオ＆オーディオ 📥
// @name:es      Descargador de YouTube | Alta Calidad HD | Video y Audio 📥
// @name:pt      Baixador de YouTube | Qualidade HD | Vídeo e Áudio 📥
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  YouTube视频下载神器，支持1080P/2K高清视频下载，支持字幕下载，支持视频/音频分离下载，支持短视频下载，完全免费无广告
// @description:en  Download YouTube videos in HD(1080P/2K), subtitles support, video/audio separate download, shorts download, completely free & no ads
// @description:ja  YouTubeビデオをHD(1080P/2K)でダウンロード、字幕対応、ビデオ/オーディオ分離ダウンロード、ショート動画対応、完全無料＆広告なし
// @description:es  Descarga videos de YouTube en HD(1080P/2K), soporte de subtítulos, descarga separada de video/audio, descarga de shorts, completamente gratis y sin anuncios
// @description:pt  Baixe vídeos do YouTube em HD(1080P/2K), suporte a legendas, download separado de vídeo/áudio, download de shorts, totalmente gratuito e sem anúncios
// @author       YouhouLab
// @license      MIT
// @match        *://*.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @connect      www.ssyoutube.com
// @run-at       document-start
// @supportURL   https://saveany.cn
// @supportURL   https://addyoutube.com
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11
// @compatible   chrome
// @compatible   firefox
// @compatible   opera
// @compatible   edge
// @compatible   safari
// @keywords     youtube, download, video, audio, subtitle, shorts, hd, 1080p, 2k, free, no ads, addyoutube, 油管, 视频下载, 字幕下载, 高清视频, 免费下载, 无广告, YouTube下载器, 短视频下载, ユーチューブ, ダウンロード, 動画保存, 字幕, 高画質, 無料, 유튜브, 다운로드, 동영상, 자막, 고화질, 무료
// @downloadURL https://update.greasyfork.org/scripts/521434/YouTube%20%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B%EF%BD%9C%E5%A4%9A%E7%A7%8D%E6%B8%85%E6%99%B0%E5%BA%A6HD2K4K%F0%9F%94%A5%EF%BD%9CVideoAudio%20%F0%9F%93%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/521434/YouTube%20%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD%E5%8A%A9%E6%89%8B%EF%BD%9C%E5%A4%9A%E7%A7%8D%E6%B8%85%E6%99%B0%E5%BA%A6HD2K4K%F0%9F%94%A5%EF%BD%9CVideoAudio%20%F0%9F%93%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const i18n = {
        'zh': {
            downloadText: 'Free Download',
            error: {
                addNormalButton: '添加普通下载按钮时出错:',
                addShortsButton: '添加Shorts下载按钮时出错:'
            }
        },
        'en': {
            downloadText: 'Free Download',
            error: {
                addNormalButton: 'Error adding normal download button:',
                addShortsButton: 'Error adding Shorts download button:'
            }
        },
        'ja': {
            downloadText: '無料ダウンロード',
            error: {
                addNormalButton: '通常ダウンロードボタンの追加エラー:',
                addShortsButton: 'Shortsダウンロードボタンの追加エラー:'
            }
        },
        'es': {
            downloadText: 'Descarga Gratis',
            error: {
                addNormalButton: 'Error al agregar botón de descarga normal:',
                addShortsButton: 'Error al agregar botón de descarga Shorts:'
            }
        },
        'pt': {
            downloadText: 'Download Grátis',
            error: {
                addNormalButton: 'Erro ao adicionar botão de download normal:',
                addShortsButton: 'Erro ao adicionar botão de download Shorts:'
            }
        }
    };

    GM_addStyle(`
        .youhou-download-btn {
            background: rgb(242, 242, 242);
            border: none;
            border-radius: 18px;
            color: #0f0f0f;
            padding: 0 16px;
            height: 36px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            white-space: nowrap;
        }
        .youhou-download-btn:hover {
            background: rgb(230, 230, 230);
        }
        .youhou-buttons-wrapper {
            display: flex;
            align-items: center;
            gap: 8px;
        }
    `);

    function waitForElement(selector, callback, maxTries = 10) {
        let tries = 0;
        
        function check() {
            const element = document.querySelector(selector);
            if (element) {
                callback(element);
                return;
            }
            
            tries++;
            if (tries < maxTries) {
                setTimeout(check, 1000);
            }
        }
        
        check();
    }

    function createDownloadButton() {
        if (document.querySelector('.youhou-download-btn')) {
            return;
        }
        
        const downloadButton = document.createElement('button');
        downloadButton.className = 'youhou-download-btn';
        downloadButton.textContent = i18n['zh'].downloadText;
        
        downloadButton.addEventListener('click', function() {
            const videoUrl = window.location.href;
            const downloadDomains = ['addyoutube.com'];
            const randomDomain = downloadDomains[Math.floor(Math.random() * downloadDomains.length)];
            const newUrl = videoUrl.replace('youtube.com', randomDomain);
            window.open(newUrl, '_blank');
        });
        
        return downloadButton;
    }

    function tryAddButton() {
        waitForElement('#subscribe-button button', (subscribeButton) => {
            if (!document.querySelector('.youhou-download-btn')) {
                const downloadButton = createDownloadButton();
                const container = subscribeButton.closest('#subscribe-button');
                if (container) {
                    const wrapper = document.createElement('div');
                    wrapper.className = 'youhou-buttons-wrapper';
                    
                    container.parentNode.insertBefore(wrapper, container);
                    wrapper.appendChild(container);
                    
                    wrapper.appendChild(downloadButton);
                }
            }
        });
    }

    document.addEventListener('yt-navigate-finish', function() {
        if (window.location.pathname.includes('/watch')) {
            setTimeout(tryAddButton, 1000);
        }
    });

    if (window.location.pathname.includes('/watch')) {
        setTimeout(tryAddButton, 1000);
    }

})();