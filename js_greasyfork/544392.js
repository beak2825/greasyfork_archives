// ==UserScript==
// @name         Return YouTube Dislike (PC Only)
// @name:ja      Return YouTube Dislike（PC専用改良版）
// @namespace    https://github.com/koyasi777/return-youtube-dislike-pc-only
// @homepage     https://github.com/koyasi777/return-youtube-dislike-pc-only
// @version      4.1.0
// @encoding     utf-8
// @description  Desktop-only fork of Return YouTube Dislike. Adds Shorts SPA support, visual like/dislike ratio bar, and a class-based architecture.
// @description:ja  デスクトップ専用に改良した Return YouTube Dislike。Shorts対応、評価バー表示、クラスベース設計を追加。
// @icon         https://github.com/Anarios/return-youtube-dislike/raw/main/Icons/Return%20Youtube%20Dislike%20-%20Transparent.png
// @author       Anarios & JRWR (original), koyasi777 (mod)
// @license      AGPL-3.0-only
// @licenseURL   https://www.gnu.org/licenses/agpl-3.0.html
// @match        *://*.youtube.com/*
// @exclude      *://music.youtube.com/*
// @exclude      *://*.music.youtube.com/*
// @compatible   chrome
// @compatible   firefox
// @compatible   opera
// @compatible   safari
// @compatible   edge
// @grant        GM.xmlHttpRequest
// @grant        GM_addStyle
// @connect      youtube.com
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/544392/Return%20YouTube%20Dislike%20%28PC%20Only%29.user.js
// @updateURL https://update.greasyfork.org/scripts/544392/Return%20YouTube%20Dislike%20%28PC%20Only%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    class ReturnYouTubeDislike {
        // --- Static Properties ---
        static config = { disableLogging: true, coloredThumbs: false, coloredBar: false, colorTheme: "classic", numberDisplayFormat: "compactShort", numberDisplayRoundDown: true, tooltipPercentageMode: "none", numberDisplayReformatLikes: false, rateBarEnabled: true };
        static API_URL = 'https://returnyoutubedislikeapi.com/votes?videoId=';
        static VOTE_STATE = { LIKED: 1, DISLIKED: 2, NEUTRAL: 3 };
        static STYLES = `
            #return-youtube-dislike-bar-container { background: var(--yt-spec-icon-disabled); border-radius: 2px; }
            #return-youtube-dislike-bar { background: var(--yt-spec-text-primary); border-radius: 2px; transition: all 0.15s ease-in-out; }
            .ryd-tooltip { position: absolute; display: block; height: 1.5px; bottom: -10px; }
            #ryd-dislike-tooltip { visibility: hidden; opacity: 0; transition: opacity 0.15s ease-in-out; background-color: #616161; color: #fff; padding: 8px; border-radius: 2px; font-size: 12px; text-align: center; white-space: nowrap; }
            .ryd-tooltip:hover #ryd-dislike-tooltip { visibility: visible; opacity: 1; }
            .ryd-tooltip-bar-container { width: 100%; height: 2px; position: absolute; padding-top: 6px; padding-bottom: 12px; top: -6px; }
            ytd-menu-renderer.ytd-watch-metadata { overflow-y: visible !important; }
            #top-level-buttons-computed { position: relative !important; }
            #ryd-shorts-dislike-text { color: var(--yt-spec-text-primary); font-family: "Roboto", "Arial", sans-serif; font-size: 12px; font-weight: 500; text-align: center; margin-top: 4px; }
        `;

        // --- Instance Properties ---
        videoId = null;
        likes = 0;
        dislikes = 0;
        previousState = ReturnYouTubeDislike.VOTE_STATE.NEUTRAL;
        domCache = {};
        initInterval = null;
        rateBarObserver = null;
        debouncedUpdateRateBar = null;

        constructor() {
            this.log('Instance created.');
            this.injectStyles();
            this.debouncedUpdateRateBar = this.debounce(() => this.createOrUpdateRateBar(), 150);
            window.addEventListener('yt-navigate-finish', () => this.run(), true);
            this.run();
        }

        run() {
            if (this.initInterval) clearInterval(this.initInterval);
            this.initInterval = setInterval(() => this.checkForDOMReady(), 100);
        }

        checkForDOMReady() {
            const currentVideoId = this.getVideoId();
            if (!currentVideoId || (currentVideoId === this.videoId && this.domCache.buttons)) return;
            if (!currentVideoId && this.videoId) { this.cleanup(); return; }
            const buttons = this.getButtons();
            if (buttons?.offsetParent && (this.isShorts() || this.isRegularVideoLoaded())) {
                this.log('DOM is ready. Initializing main logic.');
                clearInterval(this.initInterval);
                this.initInterval = null;
                this.cleanup();
                this.main(currentVideoId, buttons);
            }
        }

        async main(videoId, buttons) {
            this.videoId = videoId;
            this.log(`Processing video ID: ${this.videoId}`);
            if (!this.cacheDomElements(buttons)) { this.logError('Required DOM elements not found. Aborting.'); return; }
            try {
                const data = await this.fetchVotes();
                this.dislikes = data.dislikes;
                this.likes = this.getNativeLikeCount() ?? data.likes;
                this.log(`Using like count: ${this.likes}`);
                this.previousState = this.getInitialVoteState();
                this.updateUI();
                this.setupEventListeners();
                this.setupRateBarObserver();
            } catch (error) {
                this.logError('Failed to fetch or process votes.', error);
            }
        }

        cleanup() {
            this.log('Cleaning up previous instance.');
            if (this.initInterval) clearInterval(this.initInterval);
            if (this.rateBarObserver) this.rateBarObserver.disconnect();
            this.initInterval = null;
            this.rateBarObserver = null;
            this.domCache = {};
            this.videoId = null;
        }

        setupRateBarObserver() {
            if (!ReturnYouTubeDislike.config.rateBarEnabled || this.isShorts() || !this.domCache.buttons) return;
            this.rateBarObserver = new MutationObserver(() => {
                this.log('Button container changed. Debouncing rate bar update.');
                this.debouncedUpdateRateBar();
            });
            this.rateBarObserver.observe(this.domCache.buttons, { childList: true, subtree: true, attributes: true });
        }

        /**
         * 🚀 [修正] 永続オブザーバーと自己再試行ポーリングを組み合わせたハイブリッド方式
         */
        createOrUpdateRateBar(retryCount = 0) {
            const { buttons, likeButton, dislikeButton } = this.domCache;
            if (!buttons || this.isShorts() || !likeButton || !dislikeButton) return;

            const likeButtonWidth = likeButton.clientWidth;
            const dislikeButtonWidth = dislikeButton.clientWidth;
            const totalWidth = likeButtonWidth + dislikeButtonWidth;

            // 起動時の描画タイミング問題に対応するため、自己再試行ロジックを復活させる
            if (totalWidth === 0) {
                const maxRetries = 10;
                if (retryCount < maxRetries) {
                    this.log(`Rate bar calculation skipped: button width is zero. Retrying... (${retryCount + 1}/${maxRetries})`);
                    setTimeout(() => this.createOrUpdateRateBar(retryCount + 1), 250);
                } else {
                    this.logError('Failed to get button width for rate bar after multiple retries.');
                }
                return;
            }

            let rateBarContainer = document.getElementById('return-youtube-dislike-bar-container');
            const totalVotes = this.likes + this.dislikes;
            const likePercentage = totalVotes > 0 ? (this.likes / totalVotes) * 100 : 50;

            if (!rateBarContainer) {
                this.log(`Creating rate bar. Width: ${totalWidth}px`);
                const tooltipHtml = this.getTooltipHtml(likePercentage);
                const colorLikeStyle = ReturnYouTubeDislike.config.coloredBar ? `background-color: ${this.getColor(true)};` : '';
                const colorDislikeStyle = ReturnYouTubeDislike.config.coloredBar ? `background-color: ${this.getColor(false)};` : '';
                const barHtml = `<div class="ryd-tooltip" style="width: ${totalWidth}px"><div class="ryd-tooltip-bar-container"><div id="return-youtube-dislike-bar-container" style="width: 100%; height: 2px; ${colorDislikeStyle}"><div id="return-youtube-dislike-bar" style="width: ${likePercentage}%; height: 100%; ${colorLikeStyle}"></div></div></div><tp-yt-paper-tooltip position="top" id="ryd-dislike-tooltip" role="tooltip" tabindex="-1">${tooltipHtml}</tp-yt-paper-tooltip></div>`;
                buttons.insertAdjacentHTML('beforeend', barHtml);
            } else {
                this.log(`Updating rate bar. Width: ${totalWidth}px`);
                document.querySelector('.ryd-tooltip').style.width = `${totalWidth}px`;
                document.getElementById('return-youtube-dislike-bar').style.width = `${likePercentage}%`;
                document.getElementById('ryd-dislike-tooltip').innerHTML = this.getTooltipHtml(likePercentage);
            }
        }

        // --- Unchanged Helper Methods ---
        cacheDomElements(buttonsContainer){this.log("Caching DOM elements..."),this.domCache.buttons=buttonsContainer;const e=this.isShorts()?"#like-button":"ytd-segmented-like-dislike-button-renderer #like-button, ytd-toggle-button-renderer:first-of-type, like-button-view-model",t=this.isShorts()?"#dislike-button":"ytd-segmented-like-dislike-button-renderer #dislike-button, ytd-toggle-button-renderer:nth-of-type(2), dislike-button-view-model";if(this.domCache.likeButton=buttonsContainer.querySelector(e),this.domCache.dislikeButton=buttonsContainer.querySelector(t),!this.domCache.likeButton||!this.domCache.dislikeButton)return!1;if(this.isShorts()){let o=document.getElementById("ryd-shorts-dislike-text");o&&!o.isConnected&&(o=null),o||(o=document.createElement("span"),o.id="ryd-shorts-dislike-text",this.domCache.dislikeButton.insertAdjacentElement("afterend",o)),this.domCache.dislikeText=o}else{if(this.domCache.likeText=this.domCache.likeButton.querySelector("#text, .yt-spec-button-shape-next__button-text-content"),this.domCache.dislikeText=this.domCache.dislikeButton.querySelector("#text, .yt-spec-button-shape-next__button-text-content"),!this.domCache.dislikeText){let i=this.domCache.dislikeButton.querySelector("button")||this.domCache.dislikeButton;if(i.querySelector("#text"))return!0;let s=document.createElement("span");s.id="text",s.className="yt-spec-button-shape-next__button-text-content",s.style.marginLeft="6px",i.style.width="auto",i.appendChild(s),this.domCache.dislikeText=s}}return!0}
        isRegularVideoLoaded(){return document.querySelector(`ytd-watch-grid[video-id='${this.getVideoId()}']`)||document.querySelector(`ytd-watch-flexy[video-id='${this.getVideoId()}']`)}
        getButtons(){if(this.isShorts()){for(const e of document.querySelectorAll("#actions.ytd-reel-player-overlay-renderer")){const t=e.getBoundingClientRect();if(t.top>0&&t.bottom<window.innerHeight&&t.width>0&&t.height>0)return e}return null}return(document.getElementById("menu-container")?.offsetParent===null?document.querySelector("ytd-menu-renderer.ytd-watch-metadata > div")||document.querySelector("ytd-menu-renderer.ytd-video-primary-info-renderer > div"):document.getElementById("menu-container")?.querySelector("#top-level-buttons-computed"))}
        fetchVotes(){return new Promise((e,t)=>{GM.xmlHttpRequest({method:"GET",url:`${ReturnYouTubeDislike.API_URL}${this.videoId}`,onload:o=>{if(o.status>=200&&o.status<300)try{const n=JSON.parse(o.responseText);n&&typeof n.dislikes!="undefined"?(this.log(`Received counts: ${n.dislikes} dislikes, ${n.likes} likes.`),e(n)):t(new Error("Invalid API response format."))}catch(n){t(new Error("Failed to parse API response."))}else t(new Error(`API request failed with status: ${o.status}`))},onerror:e=>t(e),ontimeout:()=>t(new Error("API request timed out.")),timeout:15e3})})}
        getInitialVoteState(){const{likeButton:e,dislikeButton:t}=this.domCache;return e?.getAttribute("aria-pressed")==="true"||e?.classList.contains("style-default-active")?ReturnYouTubeDislike.VOTE_STATE.LIKED:t?.getAttribute("aria-pressed")==="true"||t?.classList.contains("style-default-active")?ReturnYouTubeDislike.VOTE_STATE.DISLIKED:ReturnYouTubeDislike.VOTE_STATE.NEUTRAL}
        getNativeLikeCount(){if(!this.domCache.likeButton)return null;try{const e=this.domCache.likeButton.querySelector("button")||this.domCache.likeButton,t=(e.getAttribute("aria-label")||"").replace(/\D/g,"");return t?parseInt(t,10):null}catch(e){return this.logError("Could not parse native like count from aria-label.",e),null}}
        updateUI(){this.updateDislikeCount(),ReturnYouTubeDislike.config.numberDisplayReformatLikes&&this.updateLikeCount(),ReturnYouTubeDislike.config.rateBarEnabled&&this.createOrUpdateRateBar(),ReturnYouTubeDislike.config.coloredThumbs&&this.applyThumbColors()}
        updateDislikeCount(){this.domCache.dislikeText&&(this.domCache.dislikeText.textContent=this.formatNumber(this.dislikes))}
        updateLikeCount(){this.domCache.likeText&&(this.domCache.likeText.textContent=this.formatNumber(this.likes))}
        applyThumbColors(){}
        setupEventListeners(){this.log("Registering button listeners..."),this.domCache.likeButton?.addEventListener("click",this.handleVoteClick.bind(this)),this.domCache.dislikeButton?.addEventListener("click",this.handleVoteClick.bind(this))}
        handleVoteClick(){if(this.isUserLoggedIn())setTimeout(()=>{const e=this.getInitialVoteState();if(e!==this.previousState)e===ReturnYouTubeDislike.VOTE_STATE.LIKED?(this.likes++,this.previousState===ReturnYouTubeDislike.VOTE_STATE.DISLIKED&&this.dislikes--):e===ReturnYouTubeDislike.VOTE_STATE.DISLIKED?(this.dislikes++,this.previousState===ReturnYouTubeDislike.VOTE_STATE.LIKED&&this.likes--):e===ReturnYouTubeDislike.VOTE_STATE.NEUTRAL&&(this.previousState===ReturnYouTubeDislike.VOTE_STATE.LIKED&&this.likes--,this.previousState===ReturnYouTubeDislike.VOTE_STATE.DISLIKED&&this.dislikes--),this.previousState=e,this.updateUI()},200)}
        debounce(e,t){let o=null;return(...n)=>{window.clearTimeout(o),o=window.setTimeout(()=>{e.apply(null,n)},t)}}
        log(e,t=""){ReturnYouTubeDislike.config.disableLogging||console.log(`[RYD] ${e}`,t)}
        logError(e,t){console.error(`[RYD] ERROR: ${e}`,t||"")}
        injectStyles(){GM_addStyle(ReturnYouTubeDislike.STYLES)}
        getVideoId(){const e=new URL(window.location.href);return e.pathname.startsWith("/shorts/")?e.pathname.split("/")[2]:e.pathname.startsWith("/clip/")?document.querySelector("meta[itemprop='videoId']")?.content||null:e.searchParams.get("v")}
        isShorts(){return window.location.pathname.startsWith("/shorts/")}
        isUserLoggedIn(){return document.querySelector("#avatar-btn")!==null}
        formatNumber(e){const t=ReturnYouTubeDislike.config.numberDisplayRoundDown?this.roundDown(e):e;return this.getNumberFormatter().format(t)}
        roundDown(e){if(e<1e3)return e;const t=Math.floor(Math.log10(e)-2),o=t+(t%3?1:0);return Math.floor(e/10**o)*10**o}
        getNumberFormatter(){const e=document.documentElement.lang||navigator.language||"en",t={compactShort:{notation:"compact",compactDisplay:"short"},compactLong:{notation:"compact",compactDisplay:"long"},standard:{notation:"standard"}};return new Intl.NumberFormat(e,t[ReturnYouTubeDislike.config.numberDisplayFormat]||t.compactShort)}
        getTooltipHtml(e){const t=100-e,o=this.likes.toLocaleString(),n=this.dislikes.toLocaleString();switch(ReturnYouTubeDislike.config.tooltipPercentageMode){case"dash_like":return`${o} / ${n} - ${e.toFixed(1)}%`;case"dash_dislike":return`${o} / ${n} - ${t.toFixed(1)}%`;case"both":return`${e.toFixed(1)}% / ${t.toFixed(1)}%`;case"only_like":return`${e.toFixed(1)}%`;case"only_dislike":return`${t.toFixed(1)}%`;default:return`${o} / ${n}`}}
        getColor(e){const t={classic:{like:"#00FF00",dislike:"#FF0000"},accessible:{like:"#2186F2",dislike:"#F8C100"},neon:{like:"#00FFFF",dislike:"#FF00FF"}},o=t[ReturnYouTubeDislike.config.colorTheme]||t.classic;return e?o.like:o.dislike}
    }

    new ReturnYouTubeDislike();
})();
