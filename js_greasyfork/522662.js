// ==UserScript==
// @name         YouTube Video Downloader 🤩& Ad Blocker| HD/2K/4K Quality | Video&Audio&Cover🔥📥
// @name:zh-CN   YouTube油管视频下载🤩&去广告多合一｜HD/2K/4K｜视频&音频&获取封面 🔥📥
// @name:en      YouTube Video Downloader🤩 & Ad Blocker| HD/2K/4K Quality | Video&Audio&Cover 🔥📥
// @name:ja      YouTube動画ダウンローダー🤩＆広告ブロッカー｜HD/2K/4K高画質｜ビデオ＆オーディオ&カバー 🔥📥
// @name:es      Descargador de YouTube y Bloqueador🤩 de Anuncios | Calidad HD/2K/4K | Video y Audio&Portada🔥📥
// @name:pt      Baixador do YouTube e Bloqueador 🤩de Anúncios | Qualidade HD/2K/4K | Vídeo e Áudio&Capa 🔥📥
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description:zh-cn YouTube视频下载神器，支持1080P/2K高清视频下载，封面下载，支持视频/音频分离下载，合并下载
// @description  Download YouTube videos in HD(1080P/2K), subtitles support, video/audio separate download, shorts download, completely free & no ads
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
// @connect      www.saveanyyoutube.com
// @run-at       document-start
// @supportURL   https://saveanyyoutube.com
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11
// @compatible   chrome
// @compatible   firefox
// @compatible   opera
// @compatible   edge
// @compatible   safari
// @keywords     youtube, download, video, audio, subtitle, shorts, hd, 1080p, 2k, 4k, free, no ads, ad blocker, ad free, remove ads, block ads, addyoutube, 油管, 视频下载, 字幕下载, 高清视频, 免费下载, 无广告, 去广告, 广告拦截, YouTube下载器, 短视频下载, ユーチューブ, ダウンロード, 動画保存, 字幕, 高画質, 無料, 広告ブロック, 広告なし, 유튜브, 다운로드, 동영상, 자막, 고화질, 무료, 광고 차단
// @downloadURL https://update.greasyfork.org/scripts/522662/YouTube%20Video%20Downloader%20%F0%9F%A4%A9%20Ad%20Blocker%7C%20HD2K4K%20Quality%20%7C%20VideoAudioCover%F0%9F%94%A5%F0%9F%93%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/522662/YouTube%20Video%20Downloader%20%F0%9F%A4%A9%20Ad%20Blocker%7C%20HD2K4K%20Quality%20%7C%20VideoAudioCover%F0%9F%94%A5%F0%9F%93%A5.meta.js
// ==/UserScript==
 
(function () {
    "use strict";
    GM_addStyle("#player-ads{display:none !important}");
    GM_addStyle("ytd-ad-slot-renderer{display:none !important}");
    GM_addStyle(
      "ytd-rich-item-renderer:has(ytd-ad-slot-renderer){display:none !important}"
    );
   
    let observer = null;
   
    const hasQueryParamV = () => {
      return /[\?&]v=/.test(location.href);
    };
   
    const skipAd = () => {
      let video = document.querySelector(`.ad-showing video`);
      let skipButton = document.querySelector(`.ytp-ad-skip-button`);
      if (skipButton) {
        skipButton.click();
      }
      if (video) {
        video.currentTime = video.duration;
      }
   
      return;
    };
   
    const startObserve = () => {
      const target = document.querySelector(`.video-ads.ytp-ad-module`);
      if (!target) {
        observer = null;
        return;
      }
      observer = new MutationObserver(skipAd);
      observer.observe(target, {
        childList: true,
        subtree: true,
      });
      return observer;
    };
   
    setInterval(() => {
      if (hasQueryParamV()) {
        if (!observer) {
          startObserve();
        }
      } else {
        if (observer) {
          observer.disconnect();
          observer = null;
        }
      }
    }, 200);
  })();


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
            const newUrl = videoUrl.replace('youtube.com', 'saveanyyoutube.com');
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
