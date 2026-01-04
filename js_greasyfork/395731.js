// ==UserScript==
// @version         3.7
// @name            YouTube -> download MP3 or Video from YouTube.
// @namespace       https://greasyfork.org/ru/scripts/386967-youtube-download-mp3-or-video-from-youtube
// @author			A.Vasin
// @description     Simple YouTube MP3 & MP4 download buttons. Simple and fast.
// @compatible      chrome
// @compatible      firefox
// @compatible      opera
// @compatible      safari
// @icon            https://avasin.herokuapp.com/UserScripts/YouTube-Saver/logo.png
// @include         http*://www.youtube.com/*
// @include      	http*://*.youtube.com/*
// @include      	http*://youtube.com/*
// @include      	http*://*.youtu.be/*
// @include      	http*://youtu.be/*
// @grant           GM_addStyle
// @grant           GM_download
// @run-at       	document-idle
// @copyright   	2019-02-11 // a.vasin
// @license         https://creativecommons.org/licenses/by-sa/4.0
// @downloadURL https://update.greasyfork.org/scripts/395731/YouTube%20-%3E%20download%20MP3%20or%20Video%20from%20YouTube.user.js
// @updateURL https://update.greasyfork.org/scripts/395731/YouTube%20-%3E%20download%20MP3%20or%20Video%20from%20YouTube.meta.js
// ==/UserScript==

class YouTubeSaver {
    constructor() {
        this.btnHolderSel = '#meta-contents #subscribe-button';
        this.downloadBtnClass = 'js-ytube-download';
        this.downloadAudioClass = 'js-mp3-download';
        this.language = (navigator.language || navigator.userLanguage).split('-')[0];
        this.defaultLang = 'en';
        this.baseServiceSupportedLangs = ['en', 'ru', 'sk', 'it', 'es', 'fr', 'de', 'nl', 'pt', 'tr', 'no', 'kr', 'jp', 'pl', 'cn', 'hu', 'in', 'ro', 'gr', 'cz', 'bg', 'rs', 'sa', 'id'];
        this.baseServiceLang = this.baseServiceSupportedLangs.includes(this.language) ? this.language : this.defaultLang;
        this.baseServiceUrl = `https://www.flvto.biz/${this.baseServiceLang}/convert?service=youtube&url=`; //https://y2mate.com/ru/youtube/sWgiVmcjt8c
        this.formatMap = {
            mp3: '1',
            mp4: '8',
            mp4HD: '7'
        };
        this.audioServiceBaseUrl = 'https://svr2.flvto.tv/downloader/state?id=';
        this.initInterval = 400;
        this.checkInterval = 1000;
        this.btnSize = '10px';
        this.btnPadding = '10px 5px';
        this.loaderHtml = '<div class="loader"><div class="rect1"></div><div class="rect2"></div><div class="rect3"></div><div class="rect4"></div><div class="rect5"></div></div>';
        this.langProps = {
            en: {
                'download.mp3': 'Download MP3',
                'download.video': 'Download VIDEO',
                'download': 'Download'
            },
            ru: {
                'download.mp3': 'Скачать MP3',
                'download.video': 'Скачать ВИДЕО',
                'download': 'Скачать'
            },
            sk: {
                'download.mp3': 'Stiahnuť MP3',
                'download.video': 'Stiahnuť VIDEO',
                'download': 'Stiahnuť'
            },
            ua: {
                'download.mp3': 'Скачати MP3',
                'download.video': 'Скачати VIDEO',
                'download': 'Скачати'
            }
        }
        this.currentProps = this.langProps[this.language] || this.langProps[this.defaultLang];

        this.init();
    }

    getAudioBtnHtml(link) {
        const apiDownloadUrl = this.getAudioDownloadUrl({url: link});
        const downloadUrl = this.getBaseDownloadUrl({url: link, format: this.formatMap.mp3});

        if(!apiDownloadUrl) {
            return '';
        }

        return `
            <a
                href="${downloadUrl}"
                data-href="${apiDownloadUrl}"
                target="_blank"
                class="${this.downloadBtnClass} ${this.downloadAudioClass}"
            >
                ${this.loaderHtml}
                ${this.getLangProp('download.mp3')}
            </a>
        `;
    }

    getVideoBtnHtml(link) {
        const downloadUrl = this.getBaseDownloadUrl({url: link, format: this.formatMap.mp4});

        return `
            <a
                href="${downloadUrl}"
                target="_blank"
                class="${this.downloadBtnClass}"
            >
                ${this.getLangProp('download.video')}
            </a>
        `;
    }

    init() {
        this.addStyles();
        this.initDownloadBtn();
        this.addDownloadIframe();
    }
    
    initDownloadBtn() {
        setInterval(() => {
            const appendToEl = document.querySelector(this.btnHolderSel);
            const downloadBtn = document.querySelector(`.${this.downloadBtnClass}`);
            
            // Append download buttons in case download mp3 button not available
            // && placeholder exist on page
            if(!downloadBtn && appendToEl) {
                this.appendBtns(appendToEl);
            }
        }, this.initInterval);
    }

    bindEvents(ctx) {
        const audioBtn = ctx.querySelector(`.${this.downloadAudioClass}`);

        audioBtn && audioBtn.addEventListener('click', this.onAudioDownload.bind(this, audioBtn));
    }

    addDownloadIframe() {
        this.downloadFrame = document.createElement('iframe');
        document.body.append(this.downloadFrame);
    }

    addStyles() {
        GM_addStyle(`
            .${this.downloadBtnClass} {
                position: relative;
                border: 2px solid #3f51b5;
                padding: ${this.btnPadding};
                font-size: ${this.btnSize};
                font-weight: 500;
                text-align: center;
                margin: 5px 4px 0;
                color: #3f51b5;
                text-decoration: none;
                flex-grow: 1;
                text-transform: uppercase;
            }

            .${this.downloadAudioClass} {
                border-color: #ff5722;
                color: #ff5722;
            }
            .loading {
                pointer-events: none;
                color: transparent;
            }
            .loading .loader {
                display: block;
            }
            .loader {
                display: none;
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                text-align: center;
                font-size: 10px;
            }
            .loader>div {
                background-color: #ff5722;
                height: 100%;
                width: 6px;
                margin: 0 1px;
                display: inline-block;
                animation: sk-stretchdelay 1.2s infinite ease-in-out;
            }
            .loader .rect2 {
                animation-delay: -1.1s;
            }
            .loader .rect3 {
                animation-delay: -1.0s;
            }
            .loader .rect4 {
                animation-delay: -0.9s;
            }
            .loader .rect5 {
                animation-delay: -0.8s;
            }
            @keyframes sk-stretchdelay {
                0%,
                40%,
                100% {
                    transform: scaleY(0.4);
                }
                20% {
                    transform: scaleY(1.0);
                }
            }

        `);
    }

    getLangProp(id) {
        return this.currentProps[id];
    }

    getAudioDownloadUrl({url} = {}) {
        const id = this.getVideoId(url);

        if(!id) {
            console.warn('Video ID not found/parsed.');
            return id;
        }

        return `${this.audioServiceBaseUrl}${id}`;
    }
    
    getBaseDownloadUrl({url, format = this.formatMap.mp3} = {}) {
        return `${this.baseServiceUrl}${encodeURIComponent(url)}&format=${format}`;
    }

    getNodeFromString(string) {
        const div = document.createElement('div');
        div.innerHTML = string.trim();

        return div.firstChild;
    }

    getVideoId(url) {
        var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
        var match = url.match(regExp);
        return (match && match[7].length==11) ? match[7] : false;
    }

    getVideoTitle() {
        return (document.querySelector('.ytp-title-link') || document.title).innerText;
    }

    appendBtns(appendToEl) {
        const url = document.location.href;
        const audioBtnHtml = this.getAudioBtnHtml(url);
        const videoBtnHtml = this.getVideoBtnHtml(url);
        const downloadWrapper = this.getNodeFromString(`
            <div style="
                display: flex;
            ">
                ${audioBtnHtml}
                ${videoBtnHtml}
            </div>
        `);

        //append buttons to the page
        appendToEl.append(downloadWrapper);

        // TODO: uncomment events for audio button
        // this.bindEvents(appendToEl);
    }

    downloadFile(url, btn) {
        this.downloadFrame.onerror = this.downloadFailed.bind(this, btn);
        /*
            TODO: Update handling error case
            this.downloadFrame.onload = () => {
            if(!this.downloadFrame.innerHTML) {
                this.downloadFailed(btn);
                this.downloadFrame.onload = null;
                this.downloadFrame.onerror = null;
            }
        }; */
        this.downloadFrame.src = url;
    }

    onAudioDownload(btn, e) {
        e.preventDefault();
        const _this = this;
        const url = btn.href;

        this.toggleLoader(btn);

        fetch(url)
            .then(resp => resp.json())
            .then(({dlMusic, status}) => {
                switch (status) {
                    case 'finished':
                        _this.downloadFile(dlMusic, btn);
                        setTimeout(_this.toggleLoader.bind(_this, btn, false), 500);
                        break;
                    case 'error':
                        throw new Error(error);
                    default:
                        setTimeout(_this.onAudioDownload.bind(_this, btn, e), _this.checkInterval);
                        break;
                }
            })
            .catch(_this.downloadFailed.bind(_this, btn));
    }

    downloadFailed(btn) {
        const alternativeUrl = this.getBaseDownloadUrl({url: window.location.href});
        this.toggleLoader(btn, false);

        window.open(alternativeUrl, '_blank');
    }

    toggleLoader(btn, isActivate = true, msg) {
        if(btn) {
            btn.classList.toggle('loading', isActivate);

            if(msg) {
                btn.innerText = msg;
            }
        }
    }
}

// Init downloader
const saver = new YouTubeSaver();