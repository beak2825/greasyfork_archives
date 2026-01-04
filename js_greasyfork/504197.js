// ==UserScript==
// @name         No Ads - YouTube AdBlocker | Ad Skipper | Free YouTube Music | Ad Remover | Remove Adblock Warning
// @namespace    http://tampermonkey.net/
// @version      3.95
// @auuthor      gv3dev
// @description  Skips all YouTube ads instantly and removes banners/overlays. Completely undetectable ad blocker. Enjoy ad-free YouTube music playlists and videos with no interruptions. Removes adblock detection warnings.
// @description:de Überspringt alle YouTube-Werbung sofort und entfernt Banner/Overlays. Völlig unentdeckbarer Werbeblocker. Genießen Sie werbefreie YouTube-Musik-Playlists und Videos ohne Unterbrechungen. Entfernt Adblock-Erkennungswarnungen.
// @description:es Omite todos los anuncios de YouTube al instante y elimina banners/superposiciones. Bloqueador de anuncios completamente indetectable. Disfruta de listas de reproducción y videos de música de YouTube sin interrupciones. Elimina las advertencias de detección de Adblock.
// @description:fr Passe toutes les publicités YouTube instantanément et supprime les bannières/superpositions. Bloqueur de publicité totalement indétectable. Profitez de playlists et vidéos YouTube sans publicité ni interruptions. Supprime les avertissements de détection de bloqueur de publicité.
// @description:ja すべてのYouTube広告を即座にスキップし、バナー/オーバーレイを削除します。完全に検出されない広告ブロッカー。広告なしでYouTubeの音楽プレイリストとビデオを中断なく楽しめます。Adblock検出警告を削除します。
// @description:zh 即时跳过所有YouTube广告并删除横幅/覆盖层。完全无法检测到的广告拦截器。享受无广告的YouTube音乐播放列表和视频，无干扰。移除广告拦截检测警告。
// @description:it Salta tutti gli annunci di YouTube istantaneamente e rimuove banner/sovrapposizioni. Blocco annunci completamente non rilevabile. Goditi playlist e video musicali di YouTube senza interruzioni pubblicitarie. Rimuove gli avvisi di rilevamento di Adblock.
// @description:pt Ignora todos os anúncios do YouTube instantaneamente e remove banners/sobreposições. Bloqueador de anúncios completamente indetectável. Desfrute de playlists e vídeos de música do YouTube sem interrupções. Remove os avisos de detecção de Adblock.
// @description:ru Мгновенно пропускает все объявления на YouTube и удаляет баннеры/наложения. Полностью незаметный блокировщик рекламы. Наслаждайтесь плейлистами и видео на YouTube без рекламы и перерывов. Удаляет предупреждения о блокировке рекламы.
// @description:ko 모든 YouTube 광고를 즉시 건너뛰고 배너/오버레이를 제거합니다. 완전히 탐지되지 않는 광고 차단기. 광고 없이 중단 없는 YouTube 음악 재생목록과 동영상을 즐기십시오. Adblock 감지 경고를 제거합니다.
// @description:hi सभी YouTube विज्ञापनों को तुरंत स्किप करें और बैनर/ओवरले हटा दें। पूरी तरह से अदृश्य विज्ञापन ब्लॉकर। बिना किसी रुकावट के विज्ञापन-मुक्त YouTube संगीत प्लेलिस्ट और वीडियो का आनंद लें। Adblock पहचान चेतावनियों को हटा देता है।
// @match        https://*.youtube.com/*
// @match        https://www.youtube-nocookie.com/*
// @icon         https://i.ibb.co/ZMwwmXm/Screenshot-2024-08-22-at-12-05-51-AM-removebg-preview.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/504197/No%20Ads%20-%20YouTube%20AdBlocker%20%7C%20Ad%20Skipper%20%7C%20Free%20YouTube%20Music%20%7C%20Ad%20Remover%20%7C%20Remove%20Adblock%20Warning.user.js
// @updateURL https://update.greasyfork.org/scripts/504197/No%20Ads%20-%20YouTube%20AdBlocker%20%7C%20Ad%20Skipper%20%7C%20Free%20YouTube%20Music%20%7C%20Ad%20Remover%20%7C%20Remove%20Adblock%20Warning.meta.js
// ==/UserScript==



let ogVolume = 1, pbRate = 1, manualPause = false;

document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
        manualPause = true;
    }
});

document.addEventListener('play', () => {
    manualPause = false;
});

document.addEventListener('pause', () => {
    manualPause = true;
});

const manip = (actions) => {
    actions.forEach(({ selector, action, func }) => {
        let elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            if(element!==null && element!==undefined){
                if(element.style.display!=="none"){
                    if (action === 'remove') {
                        element.remove();
                    } else if (action === 'hide') {
                        element.style.display = "none";
                    } else if (action === 'click') {
                        element.click();
                    } else if (action === 'remove-run') {
                        element.remove();
                        eval(func);
                    }
                }
            }
        });
    });
};

const playVid = () => {
    const video = document.querySelector("video");
    if(video!==null){
        if(!video.playing && !manualPause && video.currentTime<1){
            video.play();
        }
    }
}

Object.defineProperty(HTMLMediaElement.prototype, 'playing', {
    get: function(){
        return !!(this.currentTime > 0 && !this.paused && !this.ended && this.readyState > 2);
    }
});


/*const removeShorts = () => {
    if(should_Remove_Shorts == true){
        document.querySelectorAll(".style-scope.ytd-rich-shelf-renderer #title-container").forEach((shelf) => {
            if (shelf.innerText === "Shorts") {
                shelf.closest('ytd-rich-shelf-renderer').remove();
            }
        });
    }
};*/


const simulateClick = (element)=>{
    try{
        const mouseDownEvent = new MouseEvent('mousedown', {
            bubbles: true,
            cancelable: true,
            view: window,
            clientX: element.getBoundingClientRect().left,
            clientY: element.getBoundingClientRect().top,
            button: 0
        });

        element.dispatchEvent(mouseDownEvent);

        const mouseUpEvent = new MouseEvent('mouseup', {
            bubbles: true,
            cancelable: true,
            view: window,
            clientX: element.getBoundingClientRect().left,
            clientY: element.getBoundingClientRect().top,
            button: 0
        });
        element.dispatchEvent(mouseUpEvent);
        const clickEvent = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window,
            clientX: element.getBoundingClientRect().left,
            clientY: element.getBoundingClientRect().top,
            button: 0
        });
        element.dispatchEvent(clickEvent);
    }catch(e){}
}

const simulateNativeTouch = (element) => {
    try{
        const touchPoint = new Touch({
            identifier: Date.now(),
            target: element,
            clientX: 12,
            clientY: 34,
            radiusX: 56,
            radiusY: 78,
            rotationAngle: 0,
            force: 1
        });

        const touchStart = new TouchEvent('touchstart', {
            bubbles: true,
            cancelable: true,
            view: window,
            touches: [touchPoint],
            targetTouches: [touchPoint],
            changedTouches: [touchPoint]
        });
        element.dispatchEvent(touchStart);

        const touchEnd = new TouchEvent('touchend', {
            bubbles: true,
            cancelable: true,
            view: window,
            touches: [],
            targetTouches: [],
            changedTouches: [touchPoint]
        });
        element.dispatchEvent(touchEnd);
    }catch(e){}
};


const rev = `
    ytd-rich-item-renderer:has(ytd-ad-slot-renderer),
    #player-ads,
    #panels:has(ytd-ads-engagement-panel-content-renderer),
    ytd-ad-slot-renderer,
    #masthead-ad,
    ytd-reel-video-renderer:has(ytd-ad-slot-renderer),
    tp-yt-paper-dialog:has(#feedback.ytd-enforcement-message-view-model),
    .yt-mealbar-promo-renderer {
        visibility: hidden;
        height: 0;
        margin: 0;
        padding: 0;
    }
`;

const styleSheet = document.createElement('style');
styleSheet.type = 'text/css';
styleSheet.innerText = rev;
document.head.appendChild(styleSheet);

setInterval(() => {
    try{

        manip([
            { selector: "tp-yt-paper-dialog:has(#feedback.ytd-enforcement-message-view-model)", action: 'remove-run', func: playVid()},
            { selector: ".ytp-ad-overlay-close-button", action: 'click' },
            { selector: ".style-scope.ytd-watch-next-secondary-results-renderer.sparkles-light-cta.GoogleActiveViewElement", action: 'hide' },
            { selector: ".style-scope.ytd-item-section-renderer.sparkles-light-cta", action: 'hide' },
            { selector: ".ytp-ad-message-container", action: 'hide' },
            { selector: ".style-scope.ytd-companion-slot-renderer", action: 'remove' },
            { selector: "#masthead-ad", action: 'remove' },
            { selector: "ytd-ad-slot-renderer", action: 'remove' },
            { selector: "ytd-reel-shelf-renderer", action: 'remove' },
            { selector: "ytd-player-legacy-desktop-watch-ads-renderer", action: 'hide'},
            { selector: ".ytp-ad-player-overlay-layout", action: 'hide' },
            { selector: "ytd-reel-video-renderer:has(.ytd-ad-slot-renderer)", action: "remove"},
            { selector: "ytd-in-feed-ad-layout-renderer", action: 'remove' },
            { selector: "ytd-engagement-panel-section-list-renderer[target-id='engagement-panel-ads']", action: 'hide' },
            { selector: "ytd-popup-container:has(a[href='/premium'])", action: 'hide' },
            { selector: "yt-mealbar-promo-renderer", action: 'hide' }
        ]);

        let videoStream = document.querySelector("video"),
            skipAdButton = document.querySelector(`.ytp-skip-ad-button,.ytp-ad-skip-button,.ytp-ad-skip-button-modern`);


        if (videoStream) {

            let ad = document.querySelector(".video-ads.ytp-ad-module").firstChild || document.querySelector(".ytp-exp-ppp-update.ad-created.ad-showing.ad-interrupting");
            if (ad !== null) {
                //console.log("ad not null")
                //console.log(ad);
                if(ad.childElementCount > 0){
                    //console.log("ad children higher than 0")
                    //console.log("skipping with speed")
                    videoStream.playbackRate = 16;
                    if (!isNaN(videoStream.duration) && isFinite(videoStream.duration) &&
                        !isNaN(videoStream.currentTime) && isFinite(videoStream.currentTime)) {
                        videoStream.currentTime += videoStream.duration;
                    }
                    videoStream.muted = true;
                }
                else{
                    pbRate = videoStream.playbackRate;
                    videoStream.muted = false;
                }
            }else{
                pbRate = videoStream.playbackRate;
                videoStream.muted = false;
            }
        }

        if (skipAdButton !== null) {
            skipAdButton.click();
            simulateClick(skipAdButton);
            simulateNativeTouch(skipAdButton);
            console.log("skipAd button clicked.");
        }

    }catch(e){}

}, 10);


