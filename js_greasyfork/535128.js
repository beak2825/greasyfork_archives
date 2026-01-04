// ==UserScript==
// @name         YouTube 乾淨短網址分享器
// @name:en      Clean YouTube Short URL Sharer
// @name:zh-TW   YouTube 乾淨短網址分享器
// @name:ja      YouTubeクリーンショートURLシェア
// @name:es      Compartidor limpio de URL corta de YouTube
// @name:de      Sauberer YouTube-Kurzlink-Teiler
// @description  取代 YouTube 分享按鈕，複製不含追蹤參數的短網址到剪貼簿。
// @description:en Replaces the YouTube Share button with a cleaner version that copies a tracking-free short URL using GM_setClipboard.
// @description:zh-TW 取代 YouTube 分享按鈕，複製不含追蹤參數的短網址到剪貼簿。
// @description:ja YouTubeの共有ボタンを置き換え、トラッキングなしの短縮URLをクリップボードにコピーします。
// @description:es Reemplaza el botón de compartir de YouTube por uno que copia una URL corta sin rastreo al portapapeles.
// @description:de Ersetzt die YouTube-Teilen-Schaltfläche durch eine saubere Version, die einen trackingfreien Kurzlink kopiert.

// @author       Max
// @namespace    https://github.com/Max46656
// @license      MPL2.0

// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @match        https://www.youtube.com/*
// @match        https://www.youtube.com/watch*
// @grant        GM_setClipboard
// @grant        GM.info
// @version      1.1.3
// @downloadURL https://update.greasyfork.org/scripts/535128/YouTube%20%E4%B9%BE%E6%B7%A8%E7%9F%AD%E7%B6%B2%E5%9D%80%E5%88%86%E4%BA%AB%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/535128/YouTube%20%E4%B9%BE%E6%B7%A8%E7%9F%AD%E7%B6%B2%E5%9D%80%E5%88%86%E4%BA%AB%E5%99%A8.meta.js
// ==/UserScript==


class YouTubeShortUrlCopier {
    constructor(){
        this.replaceButtonInterval = null;
        this.shareButtonClickListener = null;
        this.shareButtonOfVideoSelector = '#actions yt-button-view-model button-view-model button';
        this.shareButtonOfShortSelector = '#actions dislike-button-view-model+button-view-model+button-view-model';
        this.shareButtonOfPreviewSelector = 'yt-list-item-view-model:has(path[d="M10 3.158V7.51c-5.428.223-8.27 3.75-8.875 11.199-.04.487-.07.975-.09 1.464l-.014.395c-.014.473.578.684.88.32.302-.368.61-.73.925-1.086l.244-.273c1.79-1.967 3-2.677 4.93-2.917a18.011 18.011 0 012-.112v4.346a1 1 0 001.646.763l9.805-8.297 1.55-1.31-1.55-1.31-9.805-8.297A1 1 0 0010 3.158Zm2 6.27v.002-4.116l7.904 6.688L12 18.689v-4.212l-2.023.024c-1.935.022-3.587.17-5.197 1.024a9 9 0 00-1.348.893c.355-1.947.916-3.39 1.63-4.425 1.062-1.541 2.607-2.385 5.02-2.485L12 9.428Z"])';
        this.shareUrlInputSelector = 'input#share-url';
        this.shareWindowSelector = 'div#scrollable';
        this.closeShareWindowSelector = 'div#scrollable button:has([icon="close"])';
        this.notificationDuration = 1200;
        this.pollInterval = 100;
        this.timestampEnabled = false;
        this.init();
    }

    init(){
        this.i18n = new LocalizationManager();
        this.injectStyles();
        this.toggleShareButtonHandler();
    }

    toggleShareButtonHandler(){
        if (this.replaceButtonInterval){
            clearInterval(this.replaceButtonInterval);
            this.replaceButtonInterval = null;
        }
        if (this.shareButtonClickListener){
            document.removeEventListener('click', this.shareButtonClickListener);
            this.shareButtonClickListener = null;
        }

        if (window.location.href.startsWith('https://www.youtube.com/watch?v=') ||
            window.location.href.startsWith('https://www.youtube.com/shorts/')){
            this.waitForShareButton();
        } else {
            this.setupShareButtonClickListener();
        }
    }


    waitForShareButton(){
        this.replaceButtonInterval = setInterval(() => {
            const originalButton = document.querySelector(this.shareButtonOfVideoSelector) || document.querySelector(this.shareButtonOfShortSelector);

            if (originalButton){
                clearInterval(this.replaceButtonInterval);
                this.replaceShareButton(originalButton);
            }
        }, this.pollInterval);
    }

    replaceShareButton(originalButton){
        const wrapper = this.createSegmentedShareButtons(originalButton);
        originalButton.parentNode.replaceChild(wrapper, originalButton);
    }

    createSegmentedShareButtons(originalButton){
        const isShorts = window.location.href.includes('shorts');

        const wrapper = document.createElement('div');
        wrapper.className = 'ytSegmentedLikeDislikeButtonViewModelSegmentedButtonsWrapper';
        wrapper.style.display = 'flex';
        wrapper.style.flexDirection = isShorts ? 'column' : 'row';
        const shareButton = this.createCustomShareButton(originalButton, true);
        const timestampButton = this.createTimestampCheckboxButton();

        wrapper.appendChild(shareButton);
        wrapper.appendChild(timestampButton);

        return wrapper;
    }

    createCustomShareButton(originalButton){
        const button = document.createElement('button');
        button.className = 'yt-spec-button-shape-next yt-spec-button-shape-next--tonal yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m yt-spec-button-shape-next--icon-leading yt-spec-button-shape-next--enable-backdrop-filter-experiment';
        button.classList.add('yt-spec-button-shape-next--segmented-start');
        button.classList.add('yt-spec-button-shape-next--segmented-top');

        const iconContainer = document.createElement('div');
        iconContainer.className = 'yt-spec-button-shape-next__icon';
        const span = document.createElement('span');
        span.className = 'yt-icon-shape style-scope yt-icon yt-spec-icon-shape';

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        svg.setAttribute('height', '24');
        svg.setAttribute('width', '24');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('focusable', 'false');
        svg.setAttribute('aria-hidden', 'true');
        svg.style.pointerEvents = 'none';
        svg.style.display = 'inherit';
        svg.style.width = '100%';
        svg.style.height = '100%';

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M15 5.63 20.66 12 15 18.37V14h-1c-3.96 0-7.14 1-9.75 3.09 1.84-4.07 5.11-6.4 9.89-7.1l.86-.13V5.63M14 3v6C6.22 10.13 3.11 15.33 2 21c2.78-3.97 6.44-6 12-6v6l8-9-8-9z');

        svg.appendChild(path);
        span.appendChild(svg);
        iconContainer.appendChild(span);

        const textDiv = document.createElement('div');
        textDiv.textContent = this.i18n.get('share');

        button.appendChild(iconContainer);
        button.appendChild(textDiv);

        button.addEventListener('click', () => this.handleShareButtonClick());
        return button;
    }

    createTimestampCheckboxButton(){
        const existing = document.querySelector('#yscsb-timestamp-checkbox-wrapper');
        if (existing) return existing;

        const wrapper = document.createElement('label');
        wrapper.id = 'yscsb-timestamp-checkbox-wrapper';
        wrapper.className = 'yt-spec-button-shape-next yt-spec-button-shape-next--tonal yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m yt-spec-button-shape-next--icon-leading yt-spec-button-shape-next--segmented-end yt-spec-button-shape-next--enable-backdrop-filter-experiment';
        wrapper.classList.add('yt-spec-button-shape-next--segmented-end');
        wrapper.classList.add('yt-spec-button-shape-next--segmented-bottom');
        wrapper.style.display = 'inline-flex';
        wrapper.style.alignItems = 'center';
        wrapper.style.cursor = 'pointer';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = 'yscsb-timestamp-checkbox';
        checkbox.style.display = 'none';

        checkbox.addEventListener('change', () => {
            this.timestampEnabled = checkbox.checked;
            wrapper.classList.toggle('selected', this.timestampEnabled);
        });

        const iconContainer = document.createElement('div');
        iconContainer.className = 'yt-spec-button-shape-next__icon';

        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', 'M12 1.5C6.2 1.5 1.5 6.2 1.5 12S6.2 22.5 12 22.5 22.5 17.8 22.5 12 17.8 1.5 12 1.5zm0 19c-4.7 0-8.5-3.8-8.5-8.5S7.3 3.5 12 3.5 20.5 7.3 20.5 12 16.7 20.5 12 20.5zm.75-13v4.25H17v1.5h-5.25V7.5h1.5z');

        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('width', '24');
        svg.setAttribute('height', '24');

        svg.appendChild(path);
        iconContainer.appendChild(svg);

        const textDiv = document.createElement('div');
        textDiv.textContent = this.i18n.get('timestamp');

        wrapper.appendChild(checkbox);
        wrapper.appendChild(iconContainer);
        wrapper.appendChild(textDiv);

        return wrapper;
    }

    handleShareButtonClick(){
        const shortUrl = this.getShortUrl();
        if (shortUrl){
            this.copyToClipboard(shortUrl);
            this.showNotification(this.i18n.get('copied', { name: GM_info.script.name, url: shortUrl }));
        } else {
            this.showNotification(this.i18n.get('format_error', { name: GM_info.script.name }));
        }
    }

    getShortUrl(){
        const currentUrl = new URL(window.location.href);
        const videoId = currentUrl.searchParams.get('v')||currentUrl.pathname.match(/\/shorts\/(.*)/)[1];
        let shortUrl = videoId ? `https://youtu.be/${videoId}` : null;

        if (shortUrl && this.timestampEnabled){
            let videoTime = document.querySelector('video').currentTime;
            let time;
            if(videoTime < 1){
                let videoTime = document.querySelector("span.ytp-time-current")?.textContent || "0:00";
                const [minutes, seconds] = videoTime.split(':').map(Number);
                time = minutes * 60 + seconds;
            }else{
                time = Math.floor(videoTime ? videoTime : 0);
            }
            //console.log("videoTime",videoTime,typeof(videoTime))
            if (time > 0) shortUrl += `?t=${time}`;
        }

        return shortUrl;
    }

    copyToClipboard(text){
        GM_setClipboard(text, 'text');
    }

    showNotification(message){
        const notification = document.createElement('div');
        notification.textContent = message;
        Object.assign(notification.style, {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            padding: '10px 16px',
            borderRadius: '8px',
            zIndex: '10000',
            fontSize: '14px',
            whiteSpace: 'nowrap'
        });

        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), this.notificationDuration);
    }

    injectStyles(){
        const style = document.createElement('style');
        style.textContent = `
          #yscsb-timestamp-checkbox-wrapper.selected {
              background-color: #c4302b;
              color: white;
          }
          #yscsb-timestamp-checkbox-wrapper.selected svg path {
              fill: white;
          }
      `;
        document.head.appendChild(style);
    }

    setupShareButtonClickListener() {
        this.shareButtonClickListener = (event) => {
            console.debug("事件",event.target)
            if (event.target.closest(this.shareButtonOfPreviewSelector)) {
                this.handleFloatingWindow();
            }
        };

        document.addEventListener('click', this.shareButtonClickListener);
    }

    handleFloatingWindow(){
        //等待浮動視窗
        const popupInterval = setInterval(() => {
            const ShareWindow = document.querySelector(this.shareWindowSelector);
            if (ShareWindow){
                clearInterval(popupInterval);

                ShareWindow.style.display = 'none';

                //等待網址載入
                const inputInterval = setInterval(() => {
                    const shareInput = ShareWindow.querySelector(this.shareUrlInputSelector);
                    if (shareInput && shareInput.value){
                        clearInterval(inputInterval);
                        const cleanUrl = shareInput.value.split('?')[0];

                        this.copyToClipboard(cleanUrl);
                        this.showNotification(this.i18n.get('copied', { name: GM_info.script.name, url: cleanUrl }));

                        const closeButton = document.querySelector(this.closeShareWindowSelector);
                        if (closeButton){
                            closeButton.click();
                        } else {
                            console.warn(`${GM_info.script.name}：關閉按鈕選擇器需要更改`);
                        }
                    }
                }, this.pollInterval);
            }
        }, this.pollInterval);
    }
}


class LocalizationManager {
    constructor(){
        const lang = navigator.language.toLowerCase();
        if (lang.startsWith('zh')) this.lang = 'zh';
        else if (lang.startsWith('ja')) this.lang = 'ja';
        else if (lang.startsWith('es')) this.lang = 'es';
        else if (lang.startsWith('de')) this.lang = 'de';
        else this.lang = 'en';
    }

    get(key, replacements = {}){
        const template = this.messages[this.lang][key] || this.messages['en'][key] || key;
        return template.replace(/\{(\w+)\}/g, (_, name) => replacements[name] || '');
    }

    messages = {
        en: {
            copied:        "{name}:short URL copied: {url}",
            format_error:  "{name}:short URL format changed, please wait for script update",
            no_title:      "{name}:could not find <title> element",
            share:         "Share",
            timestamp:     "Timestamp"
        },
        zh: {
            copied:        "{name}：縮網址已被複製: {url}",
            format_error:  "{name}：縮網址格式改變，請等待腳本更新",
            no_title:      "{name}：找不到 <title> 元素",
            max_retry:     "{name}：超過最大重試次數，無法找到分享按鈕",
            share:         "分享",
            timestamp:     "時間戳"
        },
        ja: {
            copied:        "{name}:の短縮URLをコピーしました: {url}",
            format_error:  "{name}:の短縮URL形式が変更されました。スクリプトの更新をお待ちください",
            no_title:      "{name}:は <title> 要素を見つけられませんでした",
            share:         "共有",
            timestamp:     "タイムスタンプ"
        },
        es: {
            copied:        "{name}:URL corta copiada: {url}",
            format_error:  "{name}:El formato de URL corta ha cambiado. Espera una actualización del script",
            no_title:      "{name}:no pudo encontrar el elemento <title>",
            share:         "Compartir",
            timestamp:     "Hora"
        },
        de: {
            copied:        "{name}:Kurzlink wurde kopiert: {url}",
            format_error:  "{name}:Kurzlink-Format wurde geändert. Bitte auf ein Skript-Update warten",
            no_title:      "{name}:konnte das <title>-Element nicht finden",
            share:         "Teilen",
            timestamp:     "Zeitstempel"
        }
    };
}

class TitleObserver {
    constructor(onNavigate){
        this.currentTitle = document.title;
        this.onNavigate = onNavigate;
        this.observe();
    }

    observe(){
        const titleElement = document.querySelector('title');
        if (!titleElement){
            console.warn(`${GM_info.script.name}：'找不到 <title> 元素`);
            return;
        }

        const observer = new MutationObserver(() => {
            if (document.title !== this.currentTitle){
                this.currentTitle = document.title;
                this.onNavigate();
            }
        });

        observer.observe(titleElement, { childList: true });
    }
}


const johnTheTrackingStoper = new YouTubeShortUrlCopier();
new TitleObserver(() => johnTheTrackingStoper.toggleShareButtonHandler());
