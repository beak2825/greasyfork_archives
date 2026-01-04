// ==UserScript==
// @name         YouTube用動画フィルター（再生済み/プレイリスト/低視聴回数/古い動画/ライブ）
// @namespace    http://tampermonkey.net/
// @description  YouTubeのおすすめ・動画一覧で再生済み動画・プレイリスト・低視聴回数・古い動画・ライブ視聴者数が少ない動画を非表示にします。再生済み動画はしきい値％で指定可能。オプションはコードから直接変更、もしくはメニューで変更可能。
// @author       sanpin
// @match        *://*.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        GM_registerMenuCommand
// @version      2.63
// @downloadURL https://update.greasyfork.org/scripts/527643/YouTube%E7%94%A8%E5%8B%95%E7%94%BB%E3%83%95%E3%82%A3%E3%83%AB%E3%82%BF%E3%83%BC%EF%BC%88%E5%86%8D%E7%94%9F%E6%B8%88%E3%81%BF%E3%83%97%E3%83%AC%E3%82%A4%E3%83%AA%E3%82%B9%E3%83%88%E4%BD%8E%E8%A6%96%E8%81%B4%E5%9B%9E%E6%95%B0%E5%8F%A4%E3%81%84%E5%8B%95%E7%94%BB%E3%83%A9%E3%82%A4%E3%83%96%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/527643/YouTube%E7%94%A8%E5%8B%95%E7%94%BB%E3%83%95%E3%82%A3%E3%83%AB%E3%82%BF%E3%83%BC%EF%BC%88%E5%86%8D%E7%94%9F%E6%B8%88%E3%81%BF%E3%83%97%E3%83%AC%E3%82%A4%E3%83%AA%E3%82%B9%E3%83%88%E4%BD%8E%E8%A6%96%E8%81%B4%E5%9B%9E%E6%95%B0%E5%8F%A4%E3%81%84%E5%8B%95%E7%94%BB%E3%83%A9%E3%82%A4%E3%83%96%EF%BC%89.meta.js
// ==/UserScript==

if (window.top !== window.self) return;

const OPTION_STORAGE_KEY = 'YT_VideoFilter_Settings';

//下記コードから値の変更ができます。Tamparmonkeyメニューからも変更できます。
const DEFAULT_SETTINGS = {
    watchedThreshold: 0,// 視聴済み動画のしきい値（0=無効、1～100で視聴済み判定の％しきい値）
    viewThreshold: 1000, // 再生回数のしきい値（0=無効、1000→1000回再生以下の動画を非表示）
    ageThresholdYears: 0, // Y年以上前の動画を非表示（0=無効、1→1年より古い動画を非表示、2→2年より古い動画...）
    liveViewerThreshold: 500,// ライブ視聴者数のしきい値（0=無効、500→視聴者数が500人以下のライブを非表示）
    playlistFilter: 0, // プレイリスト判定の有効無効（0=無効,1=有効）
    disableOnSubs: true, // チャンネル内の動画は無視するか（true=有効、false=無効）
};

// セレクタまとめ
const VIDEO_ITEM_SELECTORS = [
    "ytd-rich-item-renderer",
    "ytd-compact-video-renderer",
    ".yt-lockup-view-model-wiz",
    ".yt-lockup-view-model--compact"
];

const METADATA_SELECTORS = [
    ".inline-metadata-item.style-scope.ytd-video-meta-block",
    "span.yt-core-attributed-string.yt-content-metadata-view-model-wiz__metadata-text",
    "span.yt-core-attributed-string.yt-content-metadata-view-model__metadata-text"
];

const OLD_VIDEO_SELECTORS = [
    ".yt-content-metadata-view-model__metadata-row .yt-core-attributed-string.yt-content-metadata-view-model__metadata-text",
    ".inline-metadata-item.style-scope.ytd-video-meta-block",
    "span.yt-core-attributed-string.yt-content-metadata-view-model-wiz__metadata-text"
];

const LIVE_VIEWER_SELECTORS = [
    ".yt-content-metadata-view-model-wiz__metadata-text",
    "span.yt-core-attributed-string",
    "span.inline-metadata-item.style-scope.ytd-video-meta-block"
];

const WATCHED_PROGRESS_SELECTORS = [
    'ytd-thumbnail-overlay-resume-playback-renderer #progress',
    '.yt-thumbnail-view-model__progress-bar',
    '.ytThumbnailOverlayProgressBarHostWatchedProgressBarSegment'
];

if (!localStorage.getItem(OPTION_STORAGE_KEY)) {
    localStorage.setItem(OPTION_STORAGE_KEY, JSON.stringify(DEFAULT_SETTINGS));
}

function getSettings() {
    try {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(localStorage.getItem(OPTION_STORAGE_KEY)) };
    } catch {
        return { ...DEFAULT_SETTINGS };
    }
}

function saveSettings(settings) {
    localStorage.setItem(OPTION_STORAGE_KEY, JSON.stringify(settings));
}

function parseViewCount(text) {
    if (!text) return 0;
    const multipliers = { "K": 1e3, "M": 1e6, "万": 1e4, "億": 1e8 };
    let numText = text.replace(/[^0-9\.KM万億]/g, "");
    let unit = Object.keys(multipliers).find(u => numText.includes(u)) || "";
    numText = numText.replace(unit, "");
    return numText ? parseFloat(numText) * (multipliers[unit] || 1) : 0;
}

function parseLiveViewerCount(text) {
    if (!text) return 0;
    const m = text.replace(/,/g, "").match(/([0-9]+)/);
    return m ? parseInt(m[1], 10) : 0;
}

function isHistoryPage() {
    return location.pathname === "/feed/history";
}

function isSubscriptionsPage() {
    return location.pathname.startsWith('/@');
}

function isLivePage() {
    return location.pathname.includes('/streams');
}

function isPlaylistElement(element) {
    const playlistThumb = element.querySelector('ytd-playlist-thumbnail:not([hidden])');
    if (playlistThumb) return true;
    const aList = element.querySelectorAll('a[href*="list="]');
    for (const a of aList) {
        const href = a.getAttribute('href');
        if (/list=[^&]+/.test(href) && /v=/.test(href)) return true;
    }
    const stack = element.querySelector('yt-collections-stack');
    if (stack && stack.offsetParent !== null) return true;
    const badge = element.querySelector('.badge-shape-wiz__text');
    if (badge && badge.textContent.match(/^\d+\s*本の動画/)) {
        let p = badge.parentElement;
        while (p) {
            if (p.tagName && p.tagName.toLowerCase() === 'ytd-playlist-thumbnail') return true;
            p = p.parentElement;
        }
    }
    const playlistLabel = element.querySelector('a, span');
    if (playlistLabel && playlistLabel.textContent.trim() === 'プレイリスト') {
        let p = playlistLabel.parentElement;
        while (p) {
            if (p.tagName && p.tagName.toLowerCase() === 'ytd-playlist-thumbnail') return true;
            p = p.parentElement;
        }
    }
    return false;
}

function isLiveVideo(videoElement, settings) {
    if (settings.liveViewerThreshold === 0) return false;
    for (const selector of LIVE_VIEWER_SELECTORS) {
        const elems = videoElement.querySelectorAll(selector);
        for (const elem of elems) {
            if (elem && /[0-9,]+ 人が視聴中/.test(elem.innerText)) {
                const count = parseLiveViewerCount(elem.innerText);
                if (count > 0 && count <= settings.liveViewerThreshold) return true;
                return false;
            }
        }
    }
    return false;
}

function isBadVideo(videoElement, settings) {
    for (const selector of METADATA_SELECTORS) {
        const elems = videoElement.querySelectorAll(selector);
        for (const elem of elems) {
            if (elem && elem.innerText.includes('回視聴')) {
                const viewCount = parseViewCount(elem.innerText);
                if (viewCount >= 0 && viewCount < settings.viewThreshold) return true;
            }
        }
    }
    return false;
}

function isOldVideo(el, settings) {
    if (settings.ageThresholdYears === 0) return false;
    const dateTexts = [];
    OLD_VIDEO_SELECTORS.forEach(sel => el.querySelectorAll(sel).forEach(elm => {
        if (elm.innerText && /前/.test(elm.innerText)) dateTexts.push(elm.innerText);
    }));
    for (const dateText of dateTexts) {
        const yearMatch = /([0-9]+)\s*年.*前/.exec(dateText);
        if (yearMatch && parseInt(yearMatch[1], 10) >= settings.ageThresholdYears) return true;
        const monthMatch = /([0-9]+)\s*ヶ月.*前/.exec(dateText);
        if (monthMatch && parseInt(monthMatch[1], 10) >= settings.ageThresholdYears * 12) return true;
    }
    return false;
}

function isWatchedVideo(videoElement, settings) {
    if (settings.watchedThreshold === 0) return false;
    for (const selector of WATCHED_PROGRESS_SELECTORS) {
        const el = videoElement.querySelector(selector);
        if (el && el.style && el.style.width) {
            const percent = parseFloat(el.style.width);
            if (!isNaN(percent) && percent >= settings.watchedThreshold) return true;
        }
    }
    return false;
}

function hideBadVideo(videoElement, settings) {
    if (!videoElement) return;
    if (isLivePage() || isHistoryPage()) return;
    if (settings.disableOnSubs && isSubscriptionsPage()) return;

    if (settings.playlistFilter === 1 && isPlaylistElement(videoElement)) {
        videoElement.style.display = "none";
        videoElement.dataset.filtered = "1";
        return;
    }

    if (isLiveVideo(videoElement, settings) ||
        isBadVideo(videoElement, settings) ||
        isOldVideo(videoElement, settings) ||
        isWatchedVideo(videoElement, settings)) {
        videoElement.style.display = "none";
        videoElement.dataset.filtered = "1";
    } else {
        videoElement.style.display = "";
        delete videoElement.dataset.filtered;
    }
}

// IntersectionObserver
const observer = new IntersectionObserver(entries => {
    const settings = getSettings();
    if (settings.disableOnSubs && isSubscriptionsPage()) return;
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            hideBadVideo(entry.target, settings);
            observer.unobserve(entry.target);
        }
    });
}, { rootMargin: "300px" });

function update() {
    if (isLivePage() || isHistoryPage()) return;
    const settings = getSettings();
    document.querySelectorAll(VIDEO_ITEM_SELECTORS.join(',')).forEach(video => {
        hideBadVideo(video, settings);
        observer.observe(video);
    });
}

// Tampermonkey メニュー登録
if (!window._yt_video_filter_menu_registered) {
    window._yt_video_filter_menu_registered = true;
    const settings = getSettings();

    function reloadAlert(msg) { alert(msg + '\nページを手動でリロードしてください。'); }

    GM_registerMenuCommand(`チャンネル内の動画無視: ${settings.disableOnSubs ? "ON" : "OFF"}`, () => {
        settings.disableOnSubs = !settings.disableOnSubs;
        saveSettings(settings);
        reloadAlert('チャンネル内動画無視を切り替えました。');
    });
    GM_registerMenuCommand(`古い動画フィルター: ${settings.ageThresholdYears === 0 ? "OFF" : settings.ageThresholdYears + "年以上前を非表示"}`, () => {
        const val = parseInt(prompt('何年以上前の動画を非表示にしますか？\n0で無効化', settings.ageThresholdYears), 10);
        if (!isNaN(val) && val >= 0) { settings.ageThresholdYears = val; saveSettings(settings); reloadAlert(val === 0 ? "古い動画フィルターを無効化しました。" : `古い動画フィルターを${val}年以上前に設定しました。`); } else { alert('無効な値です'); }
    });
    GM_registerMenuCommand(`ライブ視聴者フィルター: ${settings.liveViewerThreshold === 0 ? "OFF" : settings.liveViewerThreshold + "人以下を非表示"}`, () => {
        const val = parseInt(prompt('ライブ視聴者数のしきい値を入力してください。\n0で無効', settings.liveViewerThreshold), 10);
        if (!isNaN(val) && val >= 0) { settings.liveViewerThreshold = val; saveSettings(settings); alert(val === 0 ? 'ライブ視聴者フィルターを無効化しました。' : `ライブ視聴者数しきい値を${val}人に設定しました。`); } else { alert('無効な値です'); }
    });
    GM_registerMenuCommand(`再生済み動画非表示: ${settings.watchedThreshold === 0 ? "OFF" : settings.watchedThreshold + "%"}`, () => {
        const val = parseInt(prompt('再生済み動画非表示％を入力（0で無効）', settings.watchedThreshold), 10);
        if (!isNaN(val) && val >= 0 && val <= 100) { settings.watchedThreshold = val; saveSettings(settings); alert(val === 0 ? '再生済み動画非表示を無効化しました。' : `再生済み動画非表示を${val}%に設定しました。`); } else { alert('無効な値です'); }
    });
    GM_registerMenuCommand(`視聴回数しきい値: ${settings.viewThreshold}回`, () => {
        const val = parseInt(prompt('視聴回数のしきい値を入力（0以上）', settings.viewThreshold), 10);
        if (!isNaN(val) && val >= 0) { settings.viewThreshold = val; saveSettings(settings); reloadAlert(`視聴回数しきい値を${val}回に変更しました。`); } else { alert('無効な値です'); }
    });
    GM_registerMenuCommand(`プレイリスト要素非表示: ${settings.playlistFilter ? "ON" : "OFF"}`, () => {
        settings.playlistFilter = settings.playlistFilter ? 0 : 1; saveSettings(settings); reloadAlert('プレイリスト要素フィルターを切り替えました。');
    });
}

// ブラウザバック時の修正
window.addEventListener("popstate", () => {
    document.querySelectorAll("[data-filtered]").forEach(el => { el.style.display = ""; delete el.dataset.filtered; });
    setTimeout(update, 500);
});

// ページロード＆動的監視
window.addEventListener("load", () => {
    update();
    ["yt-navigate-finish", "yt-page-data-updated", "yt-action"].forEach(event => {
        window.addEventListener(event, () => setTimeout(update, 500));
    });
    const mutationObserver = new MutationObserver(mutations => {
        if (isLivePage() || isHistoryPage()) return;
        const settings = getSettings();
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType !== 1) return;
                if (node.matches?.(VIDEO_ITEM_SELECTORS.join(','))) {
                    hideBadVideo(node, settings);
                    observer.observe(node);
                } else if (node.querySelectorAll) {
                    node.querySelectorAll(VIDEO_ITEM_SELECTORS.join(',')).forEach(video => {
                        hideBadVideo(video, settings);
                        observer.observe(video);
                    });
                }
            });
        });
    });
    mutationObserver.observe(document.body, { childList: true, subtree: true });
});
