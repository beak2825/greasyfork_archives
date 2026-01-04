// ==UserScript==
// @name               Youtube Ads BYPASSER👻
// @name:ar            تخطي إعلانات YouTube تلقائيًا بواسطة DarkShadow44
// @name:es            Saltar Automáticamente Anuncios De YouTube por DarkShadow44
// @name:fr            Ignorer Automatiquement Les Publicités YouTube par DarkShadow44
// @name:hi            YouTube विज्ञापन स्वचालित रूप से छोड़ें DarkShadow44 द्वारा
// @name:id            Lewati Otomatis Iklan YouTube oleh DarkShadow44
// @name:ja            YouTube 広告を自動スキップ by DarkShadow44
// @name:ko            YouTube 광고 자동 건너뛰기 by DarkShadow44
// @name:nl            YouTube-Advertenties Automatisch Overslaan door DarkShadow44
// @name:pt-BR         Pular Automaticamente Anúncios Do YouTube por DarkShadow44
// @name:ru            Автоматический Пропуск Рекламы На YouTube от DarkShadow44
// @name:vi            Tự Động Bỏ Qua Quảng Cáo YouTube bởi DarkShadow44
// @name:zh-CN         自动跳过 YouTube 广告 by DarkShadow44
// @name:zh-TW         自動跳過 YouTube 廣告 by DarkShadow44
// @namespace          https://github.com/DarkShadow44/userscripts
// @version            7.2.3
// @description        Automatically skip YouTube ads instantly. Undetected by YouTube ad blocker warnings. Created by DarkShadow44.
// @description:ar     تخطي إعلانات YouTube تلقائيًا على الفور. دون أن يتم اكتشاف ذلك من خلال تحذيرات أداة حظر الإعلانات في YouTube. مُحسَّن بواسطة DarkShadow44.
// @description:es     Omite automáticamente los anuncios de YouTube al instante. Sin que te detecten las advertencias del bloqueador de anuncios de YouTube. Mejorado por DarkShadow44.
// @description:fr     Ignorez automatiquement et instantanément les publicités YouTube. Non détecté par les avertissements du bloqueur de publicités YouTube. Amélioré par DarkShadow44.
// @description:hi     YouTube विज्ञापनों को स्वचालित रूप से तुरंत छोड़ दें। YouTube विज्ञापन अवरोधक चेतावनियों द्वारा पता नहीं लगाया गया। DarkShadow44 द्वारा संवर्धित।
// @description:id     Lewati iklan YouTube secara otomatis secara instan. Tidak terdeteksi oleh peringatan pemblokir iklan YouTube. Ditingkatkan oleh DarkShadow44.
// @description:ja     YouTube 広告を即座に自動的にスキップします。YouTube 広告ブロッカーの警告には検出されません。DarkShadow44 によって強化されました。
// @description:ko     YouTube 광고를 즉시 자동으로 건너뜁니다. YouTube 광고 차단 경고에 감지되지 않습니다. DarkShadow44에 의해 향상되었습니다.
// @description:nl     Sla YouTube-advertenties direct automatisch over. Ongemerkt door YouTube-adblockerwaarschuwingen. Verbeterd door DarkShadow44.
// @description:pt-BR  Pule anúncios do YouTube instantaneamente. Não detectado pelos avisos do bloqueador de anúncios do YouTube. Aprimorado por DarkShadow44.
// @description:ru     Автоматически пропускать рекламу YouTube мгновенно. Не обнаруживается предупреждениями блокировщиков рекламы YouTube. Улучшено DarkShadow44.
// @description:vi     Tự động bỏ qua quảng cáo YouTube ngay lập tức. Không bị phát hiện bởi cảnh báo trình chặn quảng cáo của YouTube. Được cải tiến bởi DarkShadow44.
// @description:zh-CN  立即自动跳过 YouTube 广告。不会被 YouTube 广告拦截器警告检测到。由 DarkShadow44 增强。
// @description:zh-TW  立即自動跳過 YouTube 廣告。 YouTube 廣告攔 chặn器警告未被偵測到。由 DarkShadow44 增強。
// @author             DarkShadow44
// @icon               https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBLAC4_sqnWL80QVwS35yIcoMOOOz4Z63TcM9tyE977As_mXuzVqhitmPMZCrEF-CW74I&usqp=CAU
// @match              https://www.youtube.com/*
// @match              https://m.youtube.com/*
// @match              https://music.youtube.com/*
// @exclude            https://studio.youtube.com/*
// @grant              none
// @license            MIT
// @compatible         firefox
// @compatible         chrome
// @compatible         opera
// @compatible         safari
// @compatible         edge
// @noframes
// @homepage           https://github.com/DarkShadow44/userscripts/tree/main/scripts/Auto-Skip-YouTube-Ads-Enhanced
// @downloadURL https://update.greasyfork.org/scripts/536712/Youtube%20Ads%20BYPASSER%F0%9F%91%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/536712/Youtube%20Ads%20BYPASSER%F0%9F%91%BB.meta.js
// ==/UserScript==

// --- START: DarkShadow44 Popup Enhancement ---
let darkShadowPopupDisplayed = false;

function showDarkShadowPopup() {
    if (darkShadowPopupDisplayed || document.getElementById('darkshadow-popup')) {
        return; // Popup already shown or exists
    }

    const popup = document.createElement('div');
    popup.id = 'darkshadow-popup';
    popup.style.position = 'fixed';
    popup.style.bottom = '20px';
    popup.style.right = '20px';
    popup.style.padding = '15px 20px';
    popup.style.backgroundColor = '#282c34'; // Dark background
    popup.style.color = '#61dafb';          // Light blue text
    popup.style.border = '2px solid #61dafb';
    popup.style.borderRadius = '8px';
    popup.style.zIndex = '99999';
    popup.style.fontSize = '14px';
    popup.style.fontFamily = 'Arial, sans-serif';
    popup.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
    popup.innerHTML = 'Ads Bypasser by DarkShadow44 <span id="darkshadow-popup-close" style="cursor:pointer; margin-left:15px; font-weight:bold; color: #ff6b6b;">×</span>';

    document.body.appendChild(popup);
    darkShadowPopupDisplayed = true;

    document.getElementById('darkshadow-popup-close').addEventListener('click', () => {
        popup.remove();
    });

    // Auto-hide after 7 seconds
    setTimeout(() => {
        if (document.getElementById('darkshadow-popup')) {
            document.getElementById('darkshadow-popup').remove();
        }
    }, 7000);
}

// Method 1: DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.body) showDarkShadowPopup();
});

// Method 2: window.onload
window.addEventListener('load', () => {
    if (document.body) showDarkShadowPopup();
});

// Method 3 & 4: setTimeout fallbacks
setTimeout(() => {
    if (document.body) showDarkShadowPopup();
}, 500);
setTimeout(() => {
    if (document.body) showDarkShadowPopup();
}, 1500);

// Method 5: MutationObserver
const dsObserverOptions = { childList: true, subtree: true };
const dsObserverCallback = function(mutationsList, observer) {
    if (!darkShadowPopupDisplayed && document.body) {
        showDarkShadowPopup();
        // If popup is now displayed, we can disconnect this observer
        // or keep it if the body might be cleared and popup needs to be re-added
        if (darkShadowPopupDisplayed) {
            observer.disconnect();
        }
    }
};
const dsPopupObserver = new MutationObserver(dsObserverCallback);

// Start observing, ensure body exists
function startDsObserver() {
    if (document.body) {
        dsPopupObserver.observe(document.body, dsObserverOptions);
        // Initial attempt in case observer fires late
        showDarkShadowPopup();
    } else {
        // If body is not yet available, wait for DOMContentLoaded
        document.addEventListener('DOMContentLoaded', () => {
            if (document.body) {
                dsPopupObserver.observe(document.body, dsObserverOptions);
                showDarkShadowPopup();
            }
        });
    }
}
startDsObserver();

// Additional Fallback: Interval check
let dsPopupAttempts = 0;
const dsPopupInterval = setInterval(() => {
    if (document.body && !darkShadowPopupDisplayed) {
        showDarkShadowPopup();
    }
    dsPopupAttempts++;
    if (darkShadowPopupDisplayed || dsPopupAttempts > 10) { // Stop after 10s or if shown
        clearInterval(dsPopupInterval);
    }
}, 1000);

// --- END: DarkShadow44 Popup Enhancement ---


// --- ORIGINAL SCRIPT CODE (UNCHANGED) ---
function skipAd() {
    if (checkIsYouTubeShorts()) return

    // This element appears when a video ad appears.
    const adShowing = document.querySelector('.ad-showing')

    // Timed pie countdown ad.
    const pieCountdown = document.querySelector('.ytp-ad-timed-pie-countdown-container')

    // Survey questions in video player.
    const surveyQuestions = document.querySelector('.ytp-ad-survey-questions')

    if (adShowing === null && pieCountdown === null && surveyQuestions === null) return

    let playerEl
    let player
    if (isYouTubeMobile || isYouTubeMusic) {
        playerEl = document.querySelector('#movie_player')
        player = playerEl
    } else {
        playerEl = document.querySelector('#ytd-player')
        player = playerEl && playerEl.getPlayer()
    }

    if (playerEl === null || player === null) {
        console.log({
            message: 'Player not found',
            timeStamp: getCurrentTimeString()
        })
        return
    }

    // ad.classList.remove('ad-showing')

    let adVideo = null

    if (pieCountdown === null && surveyQuestions === null) {
        adVideo = document.querySelector(
            '#ytd-player video.html5-main-video, #song-video video.html5-main-video'
        )

        console.table({
            message: 'Ad video',
            video: adVideo !== null,
            src: adVideo?.src,
            paused: adVideo?.paused,
            currentTime: adVideo?.currentTime,
            duration: adVideo?.duration,
            timeStamp: getCurrentTimeString()
        })

        if (adVideo === null || !adVideo.src || adVideo.paused || isNaN(adVideo.duration)) return

        console.log({
            message: 'Ad video has finished loading',
            timeStamp: getCurrentTimeString()
        })
    }

    if (isYouTubeMusic && adVideo !== null) {
        adVideo.currentTime = adVideo.duration

        console.table({
            message: 'Ad skipped',
            timeStamp: getCurrentTimeString(),
            adShowing: adShowing !== null,
            pieCountdown: pieCountdown !== null,
            surveyQuestions: surveyQuestions !== null
        })
    } else {
        const videoData = player.getVideoData()
        const videoId = videoData.video_id
        const start = Math.floor(player.getCurrentTime())

        if ('loadVideoWithPlayerVars' in playerEl) {
            playerEl.loadVideoWithPlayerVars({ videoId, start })
        } else {
            playerEl.loadVideoByPlayerVars({ videoId, start })
        }

        console.table({
            message: 'Ad skipped',
            videoId,
            start,
            title: videoData.title,
            timeStamp: getCurrentTimeString(),
            adShowing: adShowing !== null,
            pieCountdown: pieCountdown !== null,
            surveyQuestions: surveyQuestions !== null
        })
    }
}

function checkIsYouTubeShorts() {
    return location.pathname.startsWith('/shorts/')
}

function getCurrentTimeString() {
    return new Date().toTimeString().split(' ', 1)[0]
}

function addCss() {
    const adsSelectors = [
        // Ad banner in the upper right corner, above the video playlist.
        '#player-ads',
        '#panels > ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-ads"]',

        // Masthead ad on home page.
        '#masthead-ad',

        // Sponsored ad video items on home page.
        // 'ytd-ad-slot-renderer',

        // '.ytp-suggested-action',
        '.yt-mealbar-promo-renderer',

        // Featured product ad banner at the bottom left of the video.
        '.ytp-featured-product',

        // Products shelf ad banner below the video description.
        'ytd-merch-shelf-renderer',

        // YouTube Music Premium trial promotion dialog, bottom left corner.
        'ytmusic-mealbar-promo-renderer',

        // YouTube Music Premium trial promotion banner on home page.
        'ytmusic-statement-banner-renderer'
    ]
    const adsSelector = adsSelectors.join(',')
    const css = `${adsSelector} { display: none !important; }`
    const style = document.createElement('style')
    style.textContent = css
    document.head.appendChild(style)
}

/**
 * Remove ad elements using JavaScript because these selectors require the use of the CSS
 * `:has` selector which is not supported in older browser versions.
 */
function removeAdElements() {
    const adSelectors = [
        // Sponsored ad video items on home page.
        // ['ytd-rich-item-renderer', '.ytd-ad-slot-renderer'],

        // ['ytd-rich-section-renderer', '.ytd-statement-banner-renderer'],

        // Ad videos on YouTube Shorts.
        ['ytd-reel-video-renderer', '.ytd-ad-slot-renderer']

        // Ad blocker warning dialog.
        // ['tp-yt-paper-dialog', '#feedback.ytd-enforcement-message-view-model'],

        // Survey dialog on home page, located at bottom right.
        // ['tp-yt-paper-dialog', ':scope > ytd-checkbox-survey-renderer'],

        // Survey to rate suggested content, located at bottom right.
        // ['tp-yt-paper-dialog', ':scope > ytd-single-option-survey-renderer']
    ]
    for (const adSelector of adSelectors) {
        const adEl = document.querySelector(adSelector[0])
        if (adEl === null) continue
        const neededEl = adEl.querySelector(adSelector[1])
        if (neededEl === null) continue
        adEl.remove()
    }
}

const isYouTubeMobile = location.hostname === 'm.youtube.com'
const isYouTubeDesktop = !isYouTubeMobile

const isYouTubeMusic = location.hostname === 'music.youtube.com'
const isYouTubeVideo = !isYouTubeMusic

addCss()

if (isYouTubeVideo) {
    window.setInterval(removeAdElements, 1000)
    removeAdElements()
}

window.setInterval(skipAd, 500)
skipAd()

// const observer = new MutationObserver(skipAd) // This was the original ad skipper observer
// observer.observe(document.body, {
// 	attributes: true,
// 	attributeFilter: ['class'],
// 	childList: true,
// 	subtree: true
// })