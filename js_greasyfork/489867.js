// ==UserScript==
// @name            Fuck YouTube Popup
// @description     Removes the annoying popup message about using an adblocker on YouTube.
// @description:de  Entfernt die lästige Popup-Nachricht zur Verwendung eines Adblockers auf YouTube.
// @description:ru  Удаление всплывающего окна об использовании блокировщика рекламы на YouTube.
// @description:uk  Видалення спливаючого вікна про використання блокувальника реклами на YouTube.
// @description:zh  YouTube 广告拦截器弹出窗口移除器：移除 YouTube 上关于使用广告拦截器的烦人弹出窗口消息。
// @description:ja  YouTube広告ブロッカーポップアップリムーバー：YouTubeで広告ブロッカーを使用する際の迷惑なポップアップメッセージを除去します。
// @description:nl  YouTube Adblock Popup-verwijderaar: Verwijdert het vervelende pop-upbericht over het gebruik van een adblocker op YouTube.
// @description:pt  Removedor de pop-up de bloqueador de anúncios do YouTube: Remove a mensagem irritante de pop-up sobre o uso de um bloqueador de anúncios no YouTube.
// @description:es  Removedor de pop-up del bloqueador de anuncios de YouTube: Elimina el molesto mensaje emergente sobre el uso de un bloqueador de anuncios en YouTube.
// @description:it  Rimozione del popup del blocco pubblicità di YouTube: Rimuove il fastidioso messaggio popup sull'uso di un blocco pubblicità su YouTube.
// @description:ar  إزالة النافذة المنبثقة لمانع الإعلانات على يوتيوب: يزيل الرسالة المنبثقة المزعجة حول استخدام مانع الإعلانات على يوتيوب.
// @description:fr  Supprimeur de popup de bloqueur de publicités YouTube : Supprime le message pop-up ennuyeux sur l'utilisation d'un bloqueur de publicités sur YouTube.
// @namespace       https://greasyfork.org/users/1221433
// @icon            https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @match           *://www.youtube.com/*
// @version         2.3
// @author          Sitego
// @homepageURL     https://ide.onl/
// @supportURL      https://ide.onl/contact.html
// @grant           GM_getValue
// @grant           GM_setValue
// @grant           GM_registerMenuCommand
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/489867/Fuck%20YouTube%20Popup.user.js
// @updateURL https://update.greasyfork.org/scripts/489867/Fuck%20YouTube%20Popup.meta.js
// ==/UserScript==

function handleButtonClick() {
    const button = document.querySelector('.yt-spec-button-shape-next--filled.yt-spec-button-shape-next--overlay');
    if (button) {
        button.click();
    }
}

function observeForButton() {
    const intervalId = setInterval(() => {
        const button = document.querySelector('.yt-spec-button-shape-next--filled.yt-spec-button-shape-next--overlay');
        if (button) {
            button.click();
            clearInterval(intervalId);
        }
    }, 1000);
}

function handleAdSkipping() {
    video = null;
    fineScrubbing = document.querySelector('.ytp-fine-scrubbing');
    if (window.location.pathname.startsWith('/shorts/')) return;
    const player = document.querySelector('#movie_player');
    let hasAd = false;
    if (player) {
        hasAd = player.classList.contains('ad-showing');
        video = player.querySelector('video.html5-main-video');
    }
    if (hasAd) {
        const skipButton = document.querySelector(`.ytp-skip-ad-button, .ytp-ad-skip-button, .ytp-ad-skip-button-modern`);
        if (skipButton) {
            skipButton.click();
            skipButton.remove();
        } else if (video && video.src) {
            video.currentTime = 9999;
        }
    }
    if (video) {
        video.addEventListener('pause', resumeVideoIfPausedUnexpectedly);
        video.addEventListener('mouseup', enableVideoPause);
    }
    const adBlockerWarningDialog = document.querySelector('tp-yt-paper-dialog:has(#feedback.ytd-enforcement-message-view-model)');
    if (adBlockerWarningDialog) {
        adBlockerWarningDialog.remove();
    }
    const adBlockerWarningInner = document.querySelector('.yt-playability-error-supported-renderers:has(.ytd-enforcement-message-view-model)');
    if (adBlockerWarningInner) {
        if (config.allowedReloadPage) {
            adBlockerWarningInner.remove();
            location.reload();
        }
    }
    const playButton = document.querySelector('button.ytp-play-button');
    if (playButton) {
        playButton.addEventListener('click', enableVideoPause);
    }
    const adShortVideos = document.querySelectorAll('ytd-reel-video-renderer:has(.ytd-ad-slot-renderer)');
    for (const adShortVideo of adShortVideos) {
        adShortVideo.remove();
    }

    observeForButton();
    checkForErrorElement(); // Check for error element after ad skipping
}

function checkForErrorElement() {
    const errorElement = document.querySelector('.ytp-error-content-wrap-reason');
    if (errorElement) {
        location.reload();
    }
}

function enableVideoPause() {
    pausedByUser = true;
    window.clearTimeout(allowPauseVideoTimeoutId);
    allowPauseVideoTimeoutId = window.setTimeout(disableVideoPause, 500);
}

function disableVideoPause() {
    pausedByUser = false;
    window.clearTimeout(allowPauseVideoTimeoutId);
}

function resumeVideoIfPausedUnexpectedly() {
    if (isYouTubeMusic) return;
    if (pausedByUser) {
        disableVideoPause();
        return;
    }
    if (document.hidden) return;
    if (fineScrubbing && fineScrubbing.style.display !== 'none') return;
    if (video === null) return;
    if (video.duration - video.currentTime < 0.1) return;
    video.play();
}

function manageGlobalKeyEvents(event) {
    if (isYouTubeMusic) return;
    if (document.activeElement?.matches('input, textarea, select')) return;
    const code = event.code;
    if (event.type === 'keydown') {
        if (code === 'KeyK' || code === 'MediaPlayPause') {
            enableVideoPause();
        }
    } else {
        if (code === 'Space') {
            enableVideoPause();
        }
    }
}

function removeCWizElements() {
    const cWizElements = document.querySelectorAll('c-wiz');
    cWizElements.forEach(element => element.remove());
}

removeCWizElements();

if (window.MutationObserver) {
    const observer = new MutationObserver(() => {
        removeCWizElements();
    });
    observer.observe(document.body, { childList: true, subtree: true });
}

function persistConfig() {
    GM_setValue('config', config);
}

function initializeMenuCommands() {
    GM_registerMenuCommand(
        `Reload page if ad cannot be skipped: ${config.allowedReloadPage ? 'Yes' : 'No'}`,
        () => {
            config.allowedReloadPage = !config.allowedReloadPage;
            persistConfig();
            initializeMenuCommands();
        },
        {
            id: 0,
            autoClose: false
        }
    );
}

const defaultConfig = {
    allowedReloadPage: true
};

const config = GM_getValue('config', defaultConfig);
for (const key in defaultConfig) {
    if (config[key] == null) {
        config[key] = defaultConfig[key];
    }
}

const isYouTubeMusic = location.hostname === 'music.youtube.com';

let video = null;
let fineScrubbing = null;
let pausedByUser = false;
let allowPauseVideoTimeoutId = 0;

if (window.MutationObserver) {
    const observer = new MutationObserver((mutationsList) => {
        handleAdSkipping();
        checkForErrorElement(); // Check for error element on mutations
    });
    observer.observe(document.body, {
        attributes: true,
        attributeFilter: ['class', 'src'],
        childList: true,
        subtree: true
    });
} else {
    window.setInterval(() => {
        handleAdSkipping();
        checkForErrorElement(); // Check for error element on interval
    }, 500);
}

window.addEventListener('keydown', manageGlobalKeyEvents);
window.addEventListener('keyup', manageGlobalKeyEvents);

const style = document.createElement('style');
style.textContent = `
    #player-ads,
    #masthead-ad,
    #panels:has(ytd-ads-engagement-panel-content-renderer),
    ytd-ad-slot-renderer,
    ytd-rich-item-renderer:has(.ytd-ad-slot-renderer),
    ytd-rich-section-renderer:has(.ytd-statement-banner-renderer),
    ytd-reel-video-renderer:has(.ytd-ad-slot-renderer),
    tp-yt-paper-dialog:has(#feedback.ytd-enforcement-message-view-model),
    .ytp-suggested-action,
    .yt-mealbar-promo-renderer,
    ytmusic-mealbar-promo-renderer,
    .ytp-endscreen-content,
    .ytp-scroll-min.ytp-pause-overlay,
    .ytp-ce-covering-shadow-top,
    .ytp-pause-overlay,
    .ytp-ce-covering-overlay,
    .ytp-ce-element,
    c-wiz {
        display: none !important;
    }`;
document.head.appendChild(style);

initializeMenuCommands();
