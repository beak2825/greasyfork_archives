// ==UserScript==
// @name         Watch9 Reconstruct
// @version      2.5.0
// @description  Restores the old watch layout from before 2019
// @author       Aubrey P.
// @icon         https://www.youtube.com/favicon.ico
// @namespace    aubymori
// @license      Unlicense
// @match        www.youtube.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/447194/Watch9%20Reconstruct.user.js
// @updateURL https://update.greasyfork.org/scripts/447194/Watch9%20Reconstruct.meta.js
// ==/UserScript==

const w9rOptions = {
    oldAutoplay: true,        // Classic autoplay renderer with "Up next" text
    removeBloatButtons: true  // Removes "Clip", "Thanks", "Download", etc.
}

/**
 * Localization strings.
 *
 * See LOCALIZATION.md in the GitHub repo.
 */
 const w9ri18n = {
    en: {
        subSuffixMatch: /( subscribers)|( subscriber)/,
        nonPublishMatch: /(Premier)|(Stream)|(Start)/,
        publishedOn: "Published on %s",
        uploadedOn: "Uploaded on %s",
        upNext: "Up next",
        autoplay: "Autoplay",
        autoplayTip: "When autoplay is enabled, a suggested video will automatically play next."
    },
    ja: {
        subSuffixMatch: /(チャンネル登録者数 )|(人)/g,
        nonPublishMatch: /(公開済)|(開始済)/g,
        publishedOn: "%s に公開",
        uploadedOn: "%s にアップロード",
        upNext: "自動再生",
        autoplay: "次の動画",
        autoplayTip: "自動再生を有効にすると、関連動画が自動的に再生されます。"
    },
    pl: {
        subSuffixMatch: /( subskrybentów)|( subskrybent)/,
        nonPublishMatch: /(Data premiery: )|(adawane na żywo )|(Transmisja zaczęła się )/,
        publishedOn: "Przesłany %s",
        uploadedOn: "Przesłany %s",
        upNext: "Następny",
        autoplay: "Autoodtwarzanie",
        autoplayTip: "Jeśli masz włączone autoodtwarzanie, jako następny włączy się automatycznie proponowany film."
    },
    fil: {
        subSuffixMatch: /(na)|( subscribers)|( subscriber)|(\s)/g,
        nonPublishMatch: /(simula)/,
        publishedOn: "Na-publish noong %s",
        uploadedOn: "Na-upload noong %s",
        upNext: "Susunod",
        autoplay: "I-autoplay",
        autoplayTip: "Kapag naka-enable ang autoplay, awtomatikong susunod na magpe-play ang isang iminumungkahing video."
    },
    fr: {
        subSuffixMatch: /( abonnés)|( abonné)|( d’abonnés)|( d’abonné)/g,
        nonPublishMatch: /(Diffus)|(Sortie)/g,
        publishedOn: "Publiée le %s",
        uploadedOn: "Mise en ligne le %s",
        upNext: "À suivre",
        autoplay: "Lecture automatique",
        autoplayTip: "Lorsque cette fonctionnalité est activée, une vidéo issue des suggestions est automatiquement lancée à la suite de la lecture en cours."
    },
    es: {
        subSuffixMatch: /( de suscriptores)|( suscriptor)/g,
        nonPublishMatch: /(directo)|(Fecha)/g,
        publishedOn: "Publicado el %s",
        uploadedOn: "Subido el %s",
        upNext: "A continuación",
        autoplay: "Reproducción automática",
        autoplayTip: "Si la reproducción automática está habilitada, se reproducirá automáticamente un vídeo a continuación."
    },
    pt: {
        subSuffixMatch: /( de subscritores)|( subscritor)/g,
        nonPublishMatch: /(Stream)|(Estreou)/g,
        publishedOn: "Publicado a %s",
        uploadedOn: "Carregado a %s",
        upNext: "Próximo",
        autoplay: "Reprodução automática",
        autoplayTip: "Quando a reprodução automática é ativada, um vídeo sugerido será executado automaticamente em seguida."
    },
    ru: {
        subSuffixMatch: /( подписчиков)|( подписчик)/g,
        nonPublishMatch: /(Сейчас смотрят:)|(Прямой эфир состоялся)|(Дата премьеры:)/g,
        publishedOn: "Дата публикации: %s",
        uploadedOn: "Дата публикации: %s",
        upNext: "Следующее видео",
        autoplay: "Автовоспроизведение",
        autoplayTip: "Если функция включена, то следующий ролик начнет воспроизводиться автоматически."
    }
};

/**
 * Wait for a selector to exist
 *
 * @param {string}       selector  CSS Selector
 * @param {HTMLElement}  base      Element to search inside
 * @returns {Node}
 */
async function waitForElm(selector, base = document) {
    if (!selector) return null;
    if (!base.querySelector) return null;
    while (base.querySelector(selector) == null) {
        await new Promise(r => requestAnimationFrame(r));
    };
    return base.querySelector(selector);
};

/**
 * Get a string from the localization strings.
 *
 * @param {string} string  Name of string to get
 * @param {string} hl      Language to use.
 * @returns {string}
 */
function getString(string, hl = "en") {
    if (!string) return "ERROR";
    if (w9ri18n[hl]) {
        if (w9ri18n[hl][string]) {
            return w9ri18n[hl][string];
        } else if (w9ri18n.en[string]) {
            return w9ri18n.en[string];
        } else {
            return "ERROR";
        }
    } else {
        if (w9ri18n.en[string]) return w9ri18n.en[string];
        return "ERROR";
    }
}

/**
 * Format upload date string to include "Published on" or "Uploaded on" if applicable.
 *
 * @param {string}  dateStr  dateText from InnerTube ("Sep 13, 2022", "Premiered 2 hours ago", etc.)
 * @param {boolean} isPublic Is the video public?
 * @param {string}  hl       Language to use.
 * @returns {string}
 */
function formatUploadDate(dateStr, isPublic, hl = "en") {
    var nonPublishMatch = getString("nonPublishMatch", hl);
    var string = isPublic ? getString("publishedOn", hl) : getString("uploadedOn", hl);
    if (nonPublishMatch.test(dateStr)) {
        return dateStr;
    } else {
        return string.replace("%s", dateStr);
    }
}

/**
 * Format subscriber count string to only include count.
 *
 * @param {string} count  Subscriber count string from InnerTube ("374K subscribers", "No subscribers", etc.)
 * @param {string} hl     Language to use.
 * @returns {string}
 */
function formatSubCount(count, hl = "en") {
    if (count == null) return "";
    var tmp = count.replace(getString("subSuffixMatch", hl), "");
    return tmp;
}

/**
 * Parse document.cookie
 *
 * @returns {object}
 */
function parseCookies() {
    var c = document.cookie.split(";"), o = {};
    for (var i = 0, j = c.length; i < j; i++) {
        var s = c[i].split("=");
        var n = s[0].replace(" ", "");
        s.splice(0, 1);
        s = s.join("=");
        o[n] = s;
    }
    return o;
}

/**
 * Parse YouTube's PREF cookie.
 *
 * @param {string} pref  PREF cookie content
 * @returns {object}
 */
function parsePref(pref) {
    var a = pref.split("&"), o = {};
    for (var i = 0, j = a.length; i < j; i++) {
        var b = a[i].split("=");
        o[b[0]] = b[1];
    }
    return o;
}

/**
 * Is autoplay enabled?
 *
 * @returns {boolean}
 */
function autoplayState() {
    var cookies = parseCookies();
    if (cookies.PREF) {
        var pref = parsePref(cookies.PREF);
        if (pref.f5) {
            return !(pref.f5 & 8192)
        } else {
            return true; // default
        }
    } else {
        return true;
    }
}

/**
 * Toggle autoplay.
 *
 * @returns {void}
 */
function clickAutoplay() {
    var player = document.querySelector("#movie_player");
    var autoplay;
    if (autoplay = player.querySelector(".ytp-autonav-toggle-button-container")) {
        autoplay.parentNode.click();
    } else {
        var settings = player.querySelector('.ytp-settings-button');
        settings.click();settings.click();
        var item = player.querySelector('.ytp-menuitem[role="menuitemcheckbox"]');
        item.click();
    }
}

/**
 * Should the Autoplay renderer be inserted?
 * (Basically, if there's a playlist active)
 *
 * @returns {boolean}
 */
function shouldHaveAutoplay() {
    var playlist;
    if (playlist = document.querySelector("#playlist.ytd-watch-flexy")) {
        if (playlist.hidden && playlist.hidden == true) {
            return true;
        } else {
            return false;
        }
    } else {
        return true;
    }
}

/**
 * Is a value in an array?
 * 
 * @param {*}     needle    Value to search
 * @param {Array} haystack  Array to search
 * @returns {boolean}
 */
function inArray(needle, haystack) {
    for (var i = 0; i < haystack.length; i++) {
        if (needle == haystack[i]) return true;
    }
    return false;
}

/**
 * Remove bloaty action buttons.
 *
 * @returns {void}
 */
function removeBloatButtons() {
    var primaryInfo = document.querySelector("ytd-video-primary-info-renderer");
    var actionBtns = primaryInfo.data.videoActions.menuRenderer.topLevelButtons;

    // Remove the action buttons accordingly.
    for (var i = 0; i < actionBtns.length; i++) {
        if (actionBtns[i].downloadButtonRenderer) {
            actionBtns.splice(i, 1);
            i--;
        } else if (actionBtns[i].buttonRenderer) {
            if (inArray(actionBtns[i].buttonRenderer.icon.iconType, ["MONEY_HEART", "CONTENT_CUT"])) {
                actionBtns.splice(i, 1);
                i--;
            }
        }
    }

    // Refresh the primary info's data.
    var tmp = primaryInfo.data;
    primaryInfo.data = {};
    primaryInfo.data = tmp;
}

/**
 * Is the current video public? Or is it unlisted/private?
 *
 * @returns {boolean}
 */
function isVideoPublic() {
    const primaryInfo = document.querySelector("ytd-video-primary-info-renderer");
    if (primaryInfo.data.badges == null) return true;
    const badges = primaryInfo.data.badges;

    for (var i = 0; i < badges.length; i++) {
        var iconType = badges[i].metadataBadgeRenderer.icon.iconType;
        if (iconType == "PRIVACY_UNLISTED" || iconType == "PRIVACY_PRIVATE") {
            return false;
        }
    }
    return true;
}

/**
 * Get sidebar data.
 *
 * @returns {object}
 */
async function getSidebarData() {
    const secondaryResults = document.querySelector("ytd-watch-next-secondary-results-renderer");
    const resultData = secondaryResults.data.results;
    var response = {};

    if (yt.config_.LOGGED_IN == false) {
        response.element = await waitForElm("#items.ytd-watch-next-secondary-results-renderer");
        response.data = resultData;
        response.class = "ytd-watch-next-secondary-results-renderer";
        return response;
    } else {
        var tmp;
        if (tmp = resultData[0].relatedChipCloudRenderer) {
            response.element = await waitForElm("#contents.ytd-item-section-renderer", secondaryResults);
            response.data = resultData[1].itemSectionRenderer.contents;
            response.class = "ytd-item-section-renderer";
            return response;
        } else {
            response.element = await waitForElm("#items.ytd-watch-next-secondary-results-renderer");
            response.data = resultData;
            response.class = "ytd-watch-next-secondary-results-renderer";
            return response;
        }
    }
}

/**
 * Build the classic compact autoplay renderer.
 *
 * @returns {void}
 */
async function buildAutoplay() {
    // Prevent it from building autoplay twice
    if (document.querySelector("ytd-compact-autoplay-renderer") != null) return;

    const watchFlexy = document.querySelector("ytd-watch-flexy");
    const sidebarItems = await getSidebarData();
    const language = yt.config_.HL.split("-")[0] ?? "en";
    const autoplayStub = `
    <ytd-compact-autoplay-renderer class="style-scope ${ sidebarItems.class }">
        <div id="head" class="style-scope ytd-compact-autoplay-renderer">
            <div id="upnext" class="style-scope ytd-compact-autoplay-renderer"></div>
            <div id="autoplay" class="style-scope ytd-compact-autoplay-renderer"></div>
            <tp-yt-paper-toggle-button id="toggle" noink="" class="style-scope ytd-compact-autoplay-renderer" role="button" aria-pressed="" tabindex="0" style="touch-action: pan-y;" toggles="" aria-disabled="false" aria-label="">
                <tp-yt-paper-tooltip id="tooltip" class="style-scope ytd-compact-autoplay-renderer" role="tooltip" tabindex="-1">${ getString("autoplayTip", language) }</tp-yt-paper-tooltip>
            </tp-yt-paper-toggle-button>
        </div>
        <div id="contents" class="style-scope ytd-compact-autoplay-renderer"></div>
    </ytd-compact-autoplay-renderer>
    `;


    // Insert the autoplay stub.
    sidebarItems.element.insertAdjacentHTML("beforebegin", autoplayStub);
    var autoplayRenderer = sidebarItems.element.parentNode.querySelector("ytd-compact-autoplay-renderer");

    // Apply the appropriate localized text.
    autoplayRenderer.querySelector("#upnext").innerText = getString("upNext", language);
    autoplayRenderer.querySelector("#autoplay").innerText = getString("autoplay", language);

    // Add event listener to toggle
    autoplayRenderer.querySelector("#toggle").addEventListener("click", clickAutoplay);

    // Copy first video from data into autoplay renderer
    var firstVideo;
    for (var i = 0; i < sidebarItems.data.length; i++) {
        if (sidebarItems.data[i].compactVideoRenderer) {
            firstVideo = sidebarItems.data[i];
            break;
        }
    }

    var videoRenderer = document.createElement("ytd-compact-video-renderer");
    videoRenderer.data = firstVideo.compactVideoRenderer;
    videoRenderer.classList.add("style-scope", "ytd-compact-autoplay-renderer")
    videoRenderer.setAttribute("lockup", "true");
    videoRenderer.setAttribute("thumbnail-width", "168");
    autoplayRenderer.querySelector("#contents").appendChild(videoRenderer);

    // Add the interval to update toggle if it isn't already.
    if (!watchFlexy.getAttribute("autoplay-interval-active")) {
        setInterval(() => {
            if (autoplayState()) {
                autoplayRenderer.querySelector("#toggle").setAttribute("checked", "");
            } else {
                autoplayRenderer.querySelector("#toggle").removeAttribute("checked");
            }
        }, 100);
    }
}

/**
 * Build new Watch9 elements and tweak currently existing elements accordingly.
 *
 * @returns {void}
 */
 function buildWatch9() {
    const watchFlexy = document.querySelector("ytd-watch-flexy");
    const primaryInfo = watchFlexy.querySelector("ytd-video-primary-info-renderer");
    const secondaryInfo = watchFlexy.querySelector("ytd-video-secondary-info-renderer");
    const viewCount = primaryInfo.querySelector("ytd-video-view-count-renderer");
    const subBtn = secondaryInfo.querySelector("#subscribe-button tp-yt-paper-button");
    const uploadDate = secondaryInfo.querySelector(".date.ytd-video-secondary-info-renderer"); // Old unused element that we inject the date into
    const language = yt.config_.HL.split("-")[0] ?? "en";

    // Let script know we've done this initial build
    watchFlexy.setAttribute("watch9-built", "");

    // Publish date
    var newUploadDate = formatUploadDate(primaryInfo.data.dateText.simpleText, isVideoPublic(), language);
    uploadDate.innerText = newUploadDate;

    // Sub count
    var newSubCount;
    if (secondaryInfo.data.owner.videoOwnerRenderer.subscriberCountText) {
        newSubCount = formatSubCount(secondaryInfo.data.owner.videoOwnerRenderer.subscriberCountText.simpleText, language);
    } else {
        newSubCount = "0";
    }
    var w9rSubCount = document.createElement("yt-formatted-string");
    w9rSubCount.classList.add("style-scope", "deemphasize");
    w9rSubCount.text = {
        simpleText: newSubCount
    };
    subBtn.insertAdjacentElement("beforeend", w9rSubCount);

    // Bloat buttons
    if (w9rOptions.removeBloatButtons) removeBloatButtons();

    // Autoplay
    if (w9rOptions.oldAutoplay && shouldHaveAutoplay()) buildAutoplay();
}

/**
 * Update currently existing Watch9 elements.
 *
 * @returns {void}
 */
function updateWatch9() {
    const primaryInfo = document.querySelector("ytd-video-primary-info-renderer");
    const secondaryInfo = document.querySelector("ytd-video-secondary-info-renderer");
    const subCnt = secondaryInfo.querySelector("yt-formatted-string.deemphasize");
    const uploadDate = secondaryInfo.querySelector(".date.ytd-video-secondary-info-renderer");
    const language = yt.config_.HL.split("-")[0] ?? "en";

    // Publish date
    var newUploadDate = formatUploadDate(primaryInfo.data.dateText.simpleText, isVideoPublic(), language);
    uploadDate.innerText = newUploadDate;

    // Sub count
    var newSubCount = formatSubCount(secondaryInfo.data.owner.videoOwnerRenderer.subscriberCountText.simpleText, language);
    subCnt.text = {
        simpleText: newSubCount
    };

    // Bloat buttons
    if (w9rOptions.removeBloatButtons) removeBloatButtons();

    // Autoplay
    if (w9rOptions.oldAutoplay && shouldHaveAutoplay()) buildAutoplay();
}

/**
 * Run the Watch9 build/update functions.
 */
document.addEventListener("yt-page-data-updated", (e) => {
    if (e.detail.pageType == "watch") {
        if (document.querySelector("ytd-compact-autoplay-renderer")) {
            document.querySelector("ytd-compact-autoplay-renderer").remove();
        }

        if (document.querySelector("ytd-watch-flexy").getAttribute("watch9-built") != null) {
            updateWatch9();
        } else {
            buildWatch9();
        }
    }
});

/**
 * Inject styles.
 */
document.addEventListener("DOMContentLoaded", function tmp() {
    document.head.insertAdjacentHTML("beforeend", `
    <style id="watch9-fix">
    /* Hide Watch11 */
    ytd-watch-metadata {
        display: none !important;
    }

    /* Force Watch10 to display */
    #meta-contents[hidden],
    #info-contents[hidden] {
        display: block !important;
    }

    ytd-video-view-count-renderer[small] {
        font-size: 1.6rem !important;
        line-height: 2.2rem !important;
    }

    yt-formatted-string.deemphasize {
        opacity: .85;
        margin-left: 6px;
    }

    yt-formatted-string.deemphasize:empty {
        margin-left: 0;
    }

    /**
     * Prevent sub count from appearing on the "Edit video" button since
     * it uses the same element as subscribe button
     */
    ytd-button-renderer.style-primary yt-formatted-string.deemphasize {
        display: none;
    }

    #info-strings.ytd-video-primary-info-renderer,
    #owner-sub-count.ytd-video-owner-renderer {
        display: none !important;
    }
    </style>
    `);
    if (w9rOptions.oldAutoplay) document.head.insertAdjacentHTML("beforeend", `
    <style id="compact-autoplay-fix">
    yt-related-chip-cloud-renderer {
        display: none;
    }

    ytd-compact-autoplay-renderer {
        padding-bottom: 8px;
        border-bottom: 1px solid var(--yt-spec-10-percent-layer);
        margin-bottom: 16px;
        display: flex;
        flex-direction: column;
    }

    ytd-compact-autoplay-renderer ytd-compact-video-renderer {
        margin: 0 !important;
        padding-bottom: 8px;
    }

    #head.ytd-compact-autoplay-renderer {
        margin-bottom: 12px;
        display: flex;
        align-items: center;
    }

    #upnext.ytd-compact-autoplay-renderer {
        color: var(--yt-spec-text-primary);
        font-size: 1.6rem;
        flex-grow: 1;
    }

    #autoplay.ytd-compact-autoplay-renderer {
        color: var(--yt-spec-text-secondary);
        font-size: 1.3rem;
        font-weight: 500;
        text-transform: uppercase;
        line-height: 1;
    }

    #toggle.ytd-compact-autoplay-renderer {
        margin-left: 8px;
    }

    ytd-watch-next-secondary-results-renderer #contents.ytd-item-section-renderer > * {
        margin-top: 0 !important;
        margin-bottom: var(--ytd-item-section-item-margin,16px);
    }

    #items.ytd-watch-next-secondary-results-renderer > ytd-compact-video-renderer:first-of-type,
    ytd-watch-next-secondary-results-renderer #contents.ytd-item-section-renderer > ytd-compact-video-renderer:first-of-type {
        display: none !important;
    }
    </style>
    `);
    document.removeEventListener("DOMContentLoaded", tmp);
});