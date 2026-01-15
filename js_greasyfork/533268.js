// ==UserScript==
// @name         8chanSS
// @version      1.58.6
// @namespace    8chanss
// @description  A userscript to add functionality to 8chan.
// @author       otakudude
// @license      MIT; https://github.com/otacoo/8chanSS/blob/main/LICENSE 
// @match        *://*.8chan.moe/*
// @match        *://*.8chan.st/*
// @match        *://*.8chan.cc/*
// @match        *://alephchvkipd2houttjirmgivro5pxullvcgm4c47ptm7mhubbja6kad.onion/*
// @exclude      *://*.8chan.moe/login.html
// @exclude      *://*.8chan.st/login.html
// @exclude      *://*.8chan.cc/login.html
// @exclude      *://alephchvkipd2houttjirmgivro5pxullvcgm4c47ptm7mhubbja6kad.onion/login.html
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.deleteValue
// @grant        GM.listValues
// @grant        GM.xmlHttpRequest
// @connect      youtube.com
// @connect      i.ytimg.com
// @run-at       document-start
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAAAZlBMVEUAAABdlloAhl758AH58AH58AcAhl758ADj4CYAh14AhV4AhV0Ahl748AcChl4Chl0Ab2H58AIAhl758AD58AAAhl757wL48AD47wL78QL47wcAh1748AF3oFfs5yEAh1/68QDz7BM5qSu8AAAAH3RSTlMA/lg/OYtM8g/onXtoXzAaCdzBsIFzczMeaCXXyrmp9ddA3QAAANpJREFUSMft0tkOgjAQheFjtVCQVVxwnfr+L+kWM5FOC73TxP/6fBedFJwpyx5CtSpqSHXWpns4qYxo1cDtkNp7GoOW9KgSwM4+09KeEhmw4H0IuGJDAbCw79a8nwJYFDQCuO1gT8oLWCiKAXavKA5cZ78I5n/wBx7wfb+1TwOggpD2gxxSpvWBrIbY3AcUPK1lkMNbJ4FV4wd964KsQqBF6oAEwcoh2GAk/QlyjNYx4AeHMicGxxoTOrRvIB5IPtULJJhY+QIFJrd9gCUi0tdZjqgu5yYOGAO5G/kyc3TkciPeAAAAAElFTkSuQmCC
// @downloadURL https://update.greasyfork.org/scripts/533268/8chanSS.user.js
// @updateURL https://update.greasyfork.org/scripts/533268/8chanSS.meta.js
// ==/UserScript==

function onReady(fn) {
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", fn, { once: true });
    } else {
        fn();
    }
}
const debounce = (fn, delay) => {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn.apply(this, args), delay);
    };
};
const observerRegistry = {};
let unloadListenerAdded = false;

function observeSelector(selector, options = { childList: true, subtree: false }) {
    if (observerRegistry[selector]) return observerRegistry[selector];

    const node = document.querySelector(selector);
    if (!node) return null;

    const handlers = [];
    const observer = new MutationObserver(mutations => {
        for (const handler of handlers) {
            try {
                handler(mutations, node);
            } catch (e) {
                console.error(`Observer handler error for ${selector}:`, e);
            }
        }
    });

    observer.observe(node, options);
    if (!unloadListenerAdded) {
        unloadListenerAdded = true;
        window.addEventListener('beforeunload', () => {
            for (const key in observerRegistry) {
                observerRegistry[key].observer.disconnect();
            }
        }, { once: true });
    }

    observerRegistry[selector] = {
        node,
        observer,
        handlers,
        addHandler: fn => handlers.push(fn)
    };
    return observerRegistry[selector];
}
window.pageType = (() => {
    const path = window.location.pathname.toLowerCase();
    const currentHost = window.location.hostname.toLowerCase();

    return {
        isCatalog: /\/catalog\.html$/i.test(path),
        isThread: /\/(res|last)\/[^/]+\.html$/i.test(path),
        isLast: /\/last\/[^/]+\.html$/i.test(path),
        isIndex: /\/[^/]+\/$/i.test(path),
        is8chan: /^8chan\.(moe|st|cc)$/.test(currentHost),
        host: currentHost,
        path: path
    };
})();
(function injectCssAsap() {
    function doInject() {
        if (document.getElementById('8chSShim')) return;
        if (!document.head) {
            setTimeout(doInject, 1);
            return;
        }
        const style = document.createElement('style');
        style.id = '8chSShim';
        style.textContent = "#dynamicAnnouncement,#panelMessage,#postingForm{visibility:hidden}:not(.is-catalog) body{margin:0}.innerUtility.top{margin-top:2em;background:0 0!important;color:var(--link-color)!important}.innerUtility.top a{color:var(--link-color)!important}";
        document.head.appendChild(style);
    }
    doInject();
})();
onReady(async function () {
    "use strict";
    const divThreads = document.getElementById('divThreads');
    const innerOP = document.querySelector('.innerOP');
    const divPosts = document.querySelector('.divPosts');
    const opHeadTitle = document.querySelector('.opHead.title');
    const catalogDiv = document.querySelector('.catalogDiv');
    const HIDDEN_POSTS_KEY = '8chanSS_hiddenPosts';
    const FILTERED_NAMES_KEY = '8chanSS_filteredNames';
    const FILTERED_IDS_KEY = '8chanSS_filteredIDs';
    const VERSION = "1.58.6";
    const scriptSettings = {
        site: {
            _siteTWTitle: { type: "title", label: ":: Thread Watcher" },
            _siteSection1: { type: "separator" },
            alwaysShowTW: {
                label: "Pin Thread Watcher",
                default: false,
                subOptions: {
                    noPinInCatalog: {
                        label: "Don't pin in Catalog",
                        default: false,
                    }
                }
            },
            autoExpandTW: { label: "Auto Expand Thread Watcher", default: false },
            _siteSiteTitle: { type: "title", label: ":: Site" },
            _siteSection2: { type: "separator" },
            customFavicon: {
                label: "Custom Favicon",
                default: false,
                subOptions: {
                    faviconStyle: {
                        label: "Favicon Style",
                        type: "select",
                        default: "default",
                        options: [
                            { value: "default", label: "Default" },
                            { value: "pixel", label: "Pixel" },
                            { value: "pixel_alt", label: "Pixel Alt" },
                            { value: "eight", label: "Eight" },
                            { value: "eight_dark", label: "Eight Dark" }
                        ]
                    }
                }
            },
            enableBottomHeader: { label: "Bottom Header", default: false },
            enableAutoHideHeaderScroll: { label: "Auto-hide Header On Scroll", default: false },
            enableHeaderCatalogLinks: {
                label: "Header Catalog Links",
                default: true,
                subOptions: {
                    openInNewTab: {
                        label: "Always open in new tab",
                        default: false,
                    }
                }
            },
            enableScrollArrows: { label: "Show Up/Down Arrows", default: false },
            _siteMediaTitle: { type: "title", label: ":: Media" },
            _siteSection3: { type: "separator" },
            enableFitImage: { label: "Fit Expanded Images and Videos", default: true },
            blurSpoilers: {
                label: "Blur Spoilers",
                default: false,
                subOptions: {
                    removeSpoilers: {
                        label: "Remove Spoilers",
                        default: false
                    }
                }
            },
            enablePNGstop: { label: "Prevent animated PNG images from playing", default: false },
            enableMediaViewer: {
                label: "Enable Advanced Media Viewer",
                default: false,
                subOptions: {
                    viewerStyle: {
                        label: "Style",
                        type: "select",
                        default: "native",
                        options: [
                            { value: "native", label: "Native" },
                            { value: "topright", label: "Pin Top Right" },
                            { value: "topleft", label: "Pin Top Left" }
                        ]
                    }
                }
            },
            hoverVideoVolume: { label: "Hover Media Volume (0-100%)", default: 50, type: "number", min: 0, max: 100 }
        },
        threads: {
            _threadsNotiTitle: { type: "title", label: ":: Notifications" },
            _threadsSection1: { type: "separator" },
            beepOnYou: { label: "Beep on (You)", default: false },
            notifyOnYou: {
                label: "Tab Notification when (You) (!)",
                default: true,
                subOptions: {
                    customMessage: {
                        label: "Custom Text (max: 8 chars.)",
                        default: "",
                        type: "text",
                        maxLength: 9
                    }
                }
            },
            _threadsNavTitle: { type: "title", label: ":: Navigation & Others" },
            _threadsSection3: { type: "separator" },
            enableThreadImageHover: { label: "Thread Image Hover", default: true },
            enableBacklinkIcons: { label: "Backlink Icons", default: false },
            enableScrollSave: {
                label: "Save Scroll Position",
                default: true,
                subOptions: {
                    showUnreadLine: {
                        label: "Show Unread Line",
                        default: true,
                    }
                }
            },
            quoteThreading: { label: "Quote Threading (Shift + T to toggle)", default: false },
            enableHashNav: { label: "Hash Navigation", default: false },
            threadStatsInHeader: { label: "Thread Stats in Header", default: false },
            watchThreadOnReply: { label: "Watch Thread on Reply", default: true },
            hideHiddenPostStub: { label: "Hide Stubs of Hidden Posts", default: false, },
            _miscelIDTitle: { type: "title", label: ":: IDs" },
            _miscelSection2: { type: "separator" },
            highlightNewIds: {
                label: "Highlight New IDs",
                default: false,
                subOptions: {
                    idHlStyle: {
                        label: "Highlight Style",
                        type: "select",
                        default: "moetext",
                        options: [
                            { value: "moetext", label: "Moe" },
                            { value: "glow", label: "Glow" },
                            { value: "dotted", label: "Border" }
                        ]
                    }
                }
            },
            alwaysShowIdCount: { label: "Always show ID post count", default: false },
            enableIdFilters: {
                label: "Show all posts by ID when ID is clicked",
                type: "checkbox",
                default: true,
                subOptions: {
                    idViewMode: {
                        label: "View Mode",
                        type: "select",
                        default: "showPostsOfIdOnly",
                        options: [
                            { value: "showPostsOfIdOnly", label: "Only ID's posts" },
                            { value: "showIdLinksOnly", label: "Floating list" },
                            { value: "showIdLinksVertical", label: "Vertical list" }
                        ]
                    }
                }
            },
            enableIdToggle: { label: "Add menu entry to toggle IDs as Yours", type: "checkbox", default: false }
        },
        catalog: {
            enableCatalogImageHover: { label: "Catalog Image Hover", default: true },
            enableThreadHiding: { 
                label: "Enable Thread Hiding (Shift + Click to hide/unhide a thread)", 
                default: false,
                subOptions: {
                    enableCatalogFiltering: {
                        label: "Enable Catalog Thread Filtering",
                        default: false
                    }
                }
            },
            openCatalogThreadNewTab: { label: "Always Open Threads in New Tab", default: false },
            enableLastFifty: { label: "Show Last 50 Posts button", default: false }
        },
        styling: {
            _stylingMascotTitle: { type: "title", label: ":: Mascots" },
            _stylingSection1: { type: "separator" },
            enableMascots: {
                label: "Enable Mascots",
                default: false,
                subOptions: {
                    mascotOpacity: {
                        label: "Mascot Opacity (0-100%)",
                        default: 30,
                        type: "number",
                        min: 0,
                        max: 100
                    },
                    mascotUrls: {
                        label: "Mascot Image URLs (one per line)",
                        type: "textarea",
                        default: "",
                        placeholder: "Enter image URLs, one per line\nExample:\n/.media/mascot1.png\n/.media/mascot2.png",
                        rows: 4
                    }
                }
            },
            _stylingSiteTitle: { type: "title", label: ":: Site Styling" },
            _stylingSection2: { type: "separator" },
            hideAnnouncement: { label: "Hide Announcement", default: false },
            hidePanelMessage: { label: "Hide Panel Message", default: false },
            hidePostingForm: {
                label: "Hide Posting Form",
                default: false,
                subOptions: {
                    showCatalogForm: {
                        label: "Don't Hide in Catalog",
                        default: false
                    }
                }
            },
            hideBanner: { label: "Hide Board Banners", default: false },
            hideNoCookieLink: { label: "Hide No Cookie? Link", default: false },
            hideJannyTools: { label: "Hide Janitor Forms", default: false },
            _stylingThreadTitle: { type: "title", label: ":: Thread Styling" },
            _stylingSection3: { type: "separator" },
            enableSidebar: {
                label: "Enable Sidebar",
                default: false,
                subOptions: {
                    leftSidebar: {
                        label: "Sidebar on Left",
                        default: false
                    }
                }
            },
            enableFitReplies: { label: "Fit Replies", default: false },
            highlightOnYou: { label: "Style (You) posts", default: true },
            opBackground: { label: "OP background", default: false },
            enableStickyQR: { label: "Sticky Quick Reply", default: false },
            fadeQuickReply: { label: "Fade Quick Reply", default: false },
            threadHideCloseBtn: { label: "Hide Inline Close Button", default: false },
            hideCheckboxes: { label: "Hide Post Checkbox", default: false }
        },
        miscel: {
            enableShortcuts: { label: "Enable Keyboard Shortcuts", type: "checkbox", default: true },
            enableUpdateNotif: { label: "8chanSS update notifications", default: true },
            enhanceYoutube: {
                label: "Enhanced Youtube Links",
                default: true,
                subOptions: {
                    ytThumbs: {
                        label: "Show Thumbnails on Hover",
                        default: true,
                    }
                }
            },
            switchTimeFormat: { label: "Enable 12-hour Clock (AM/PM)", default: false },
            truncFilenames: {
                label: "Truncate filenames",
                default: false,
                subOptions: {
                    customTrunc: {
                        label: "Max filename length (min: 5, max: 50)",
                        default: 15,
                        type: "number",
                        min: 5,
                        max: 50
                    }
                }
            },
            enableTheSauce: {
                label: "Sauce Links",
                default: false,
                subOptions: {
                    iqdb: {
                        label: "IQDB",
                        default: false,
                    },
                    saucenao: {
                        label: "Saucenao",
                        default: false,
                    },
                    pixiv: {
                        label: "Pixiv (only added if filename matches Pixiv ID)",
                        default: false,
                    }
                }
            },
            _miscelStorageTitle: { type: "title", label: ":: Storage & Sync" },
            _miscelSection2: { type: "separator" },
            saveWatchedThreads: {
                label: "Save Current Watched Threads",
                type: "button"
            },
            saveFavoriteBoards: {
                label: "Save Current Favorite Boards",
                type: "button"
            },
            restoreWatchedThreads: {
                label: "Restore Watched Threads",
                type: "button"
            },
            restoreFavoriteBoards: {
                label: "Restore Favorite Boards",
                type: "button"
            },
        }
    };

    Object.freeze(scriptSettings); 
    function flattenSettings() {
        const result = {};
        Object.keys(scriptSettings).forEach((category) => {
            Object.keys(scriptSettings[category]).forEach((key) => {
                if (key.startsWith('_')) return;
                result[key] = scriptSettings[category][key];
                const subOptions = scriptSettings[category][key].subOptions;
                if (!subOptions || typeof subOptions !== "object") return;
                Object.keys(subOptions).forEach((subKey) => {
                    const fullKey = `${key}_${subKey}`;
                    result[fullKey] = subOptions[subKey];
                });
            });
        });
        return Object.freeze(result);
    }
    let flatSettings = flattenSettings();
    async function getSetting(key) {
        if (!flatSettings[key]) {
            console.warn(`Setting key not found: ${key}`);
            return false;
        }
        let val;
        try {
            val = await GM.getValue("8chanSS_" + key, null);
        } catch (err) {
            console.error(`Failed to get setting for key ${key}:`, err);
            return flatSettings[key]?.default ?? false;
        }
        if (val === null) return flatSettings[key].default;
        switch (flatSettings[key].type) {
            case "number":
                return Number(val);
            case "text":
                return String(val).replace(/[<>"']/g, "").slice(0, flatSettings[key].maxLength || 32);
            case "textarea":
            case "select":
                return String(val);
            default:
                return val === "true";
        }
    }

    async function setSetting(key, value) {
        try {
            await GM.setValue("8chanSS_" + key, String(value));
        } catch (err) {
            console.error(`Failed to set setting for key ${key}:`, err);
        }
    }
    async function getStoredObject(key) {
        let obj = {};
        if (typeof GM !== 'undefined' && GM.getValue) {
            obj = await GM.getValue(key, {});
        }
        return typeof obj === 'object' && obj !== null ? obj : {};
    }
    async function setStoredObject(key, obj) {
        if (typeof GM !== 'undefined' && GM.setValue) {
            await GM.setValue(key, obj);
        }
    }
    function getRawIdFromLabelId(labelIdSpan) {
        return labelIdSpan ? labelIdSpan.textContent.split(/[|\(]/)[0].trim() : null;
    }
    (async function featureCssClassToggles() {
        document.documentElement.classList.add("8chanSS");
        const enableSidebar = await getSetting("enableSidebar");
        const enableSidebar_leftSidebar = await getSetting("enableSidebar_leftSidebar");

        const classToggles = {
            enableFitReplies: "fit-replies",
            enableSidebar_leftSidebar: "ss-leftsidebar",
            enableStickyQR: "sticky-qr",
            fadeQuickReply: "fade-qr",
            enableBottomHeader: "bottom-header",
            hideHiddenPostStub: "hide-stub",
            hideBanner: "disable-banner",
            hidePostingForm: "hide-posting-form",
            hidePostingForm_showCatalogForm: "show-catalog-form",
            hidePanelMessage: "hide-panelmessage",
            highlightOnYou: "highlight-yous",
            threadHideCloseBtn: "hide-close-btn",
            hideCheckboxes: "hide-checkboxes",
            hideNoCookieLink: "hide-nocookie",
            autoExpandTW: "auto-expand-tw",
            hideJannyTools: "hide-jannytools",
            opBackground: "op-background",
            blurSpoilers: "ss-blur-spoilers",
            alwaysShowIdCount: "show-ID-count",
            enableBacklinkIcons: "backlink-icon",
            enableFitImage: "fit-images"
        };
        if (enableSidebar && !enableSidebar_leftSidebar) {
            document.documentElement.classList.add("ss-sidebar");
        } else {
            document.documentElement.classList.remove("ss-sidebar");
        }
        const settingKeys = Object.keys(classToggles);
        const settingValues = await Promise.all(settingKeys.map(getSetting));
        settingKeys.forEach((key, i) => {
            const className = classToggles[key];
            if (settingValues[i]) {
                document.documentElement.classList.add(className);
            } else {
                document.documentElement.classList.remove(className);
            }
        });
        if (window.pageType?.isCatalog) {
            document.documentElement.classList.add("is-catalog");
        } else {
            document.documentElement.classList.remove("is-catalog");
        }
        if (window.pageType?.isThread) {
            document.documentElement.classList.add("is-thread");
        } else {
            document.documentElement.classList.remove("is-thread");
        }
        if (window.pageType?.isIndex) {
            document.documentElement.classList.add("is-index");
        } else {
            document.documentElement.classList.remove("is-index");
        }
    })();
    (async function featureSidebar() {
        const enableSidebar = await getSetting("enableSidebar");
        const enableSidebar_leftSidebar = await getSetting("enableSidebar_leftSidebar");

        const mainPanel = document.getElementById("mainPanel");
        if (!mainPanel) return;

        if (enableSidebar && enableSidebar_leftSidebar) {
            mainPanel.style.marginLeft = "19rem";
            mainPanel.style.marginRight = "0";
        } else if (enableSidebar) {
            mainPanel.style.marginRight = "19rem";
            mainPanel.style.marginLeft = "0";
        } else {
            mainPanel.style.marginRight = "0";
            mainPanel.style.marginLeft = "0";
        }
    })();
    (function injectCustomCss() {
        if (document.getElementById('8chSS')) return;

        let css = "";
        if (window.pageType?.is8chan) {
            css += "#dynamicAnnouncement,#panelMessage,#postingForm{visibility:visible}#navFadeEnd,#navFadeMid,.watchedNotification::before,:root.disable-banner #bannerImage,:root.hide-announcement #dynamicAnnouncement,:root.hide-checkboxes .deletionCheckBox,:root.hide-close-btn .inlineQuote>.innerPost>.postInfo.title>a:first-child,:root.hide-jannytools #actionsForm,:root.hide-jannytools #boardContentLinks,:root.hide-nocookie #captchaBody>table:nth-child(2)>tbody:first-child>tr:nth-child(2),:root.hide-panelmessage #panelMessage,:root.hide-posting-form #postingForm{display:none}#sideCatalogDiv{z-index:200;background:var(--background-gradient)}:root.is-catalog.show-catalog-form #postingForm{display:block!important}:root.is-thread footer{visibility:hidden;height:0}:root.op-background .opCell>.innerOP{padding-top:.25em;width:100%;background:var(--contrast-color);border:1px solid var(--horizon-sep-color);border-top-width:0;border-left-width:0}nav.navHeader{z-index:300}:not(:root.bottom-header) .navHeader{box-shadow:0 1px 2px rgba(0,0,0,.15)}:root.bottom-header nav.navHeader{top:auto!important;bottom:0!important;box-shadow:0 -1px 2px rgba(0,0,0,.15)}:root.highlight-yous .innerOP:has(> .opHead.title > .youName),:root.highlight-yous .innerPost:has(> .postInfo.title > .youName),:root.highlight-yous .yourPost{border-left:dashed #68b723 2px!important}:root.highlight-yous .innerPost:has(>.divMessage>.you),:root.highlight-yous .innerPost:has(>.divMessage>:not(div)>.you),:root.highlight-yous .innerPost:has(>.divMessage>:not(div)>:not(div)>.you),:root.highlight-yous .quotesYou{border-left:solid var(--subject-color) 2px!important}:root.fit-replies :not(.hidden).innerPost{margin-left:10px;display:flow-root}:root.fit-replies :not(.hidden,.inlineQuote).innerPost{margin-left:0}.multipleUploads .uploadCell:not(.expandedCell){max-width:215px}:root.ss-blur-spoilers .quoteTooltip img[src*=\"audioGenericThumb\.png\"],:root.ss-blur-spoilers .quoteTooltip img[src*=\"custom\.spoiler\"],:root.ss-blur-spoilers .quoteTooltip img[src*=\"spoiler\.png\"]{filter:blur(5px)!important;transition:filter .3s ease}:root.fit-images :not(#media-viewer)>.imgExpanded,:root.fit-images :not(#media-viewer)>video{max-height:90vh!important;object-fit:contain;width:auto!important}:not(:root.auto-expand-tw) #watchedMenu .floatingContainer{overflow-x:hidden;overflow-wrap:break-word}:root.auto-expand-tw #watchedMenu .floatingContainer{height:fit-content!important;padding-bottom:10px;resize:horizontal}.watchedCellLabel a::before{content:attr(data-board);color:#aaa;margin-right:4px;font-weight:700}.watchButton.watched-active::before{color:#dd003e!important}#media-viewer,#multiboardMenu,#settingsMenu,#watchedMenu{font-size:smaller;padding:5px!important;box-shadow:-3px 3px 2px 0 rgba(0,0,0,.19)}#watchedMenu,#watchedMenu .floatingContainer{max-width:100vw}.watchedNotification::before{padding-right:2px}#watchedMenu .floatingContainer{scrollbar-width:thin;scrollbar-color:var(--link-color) var(--contrast-color)}.ss-active{font-weight:700}.markAllRead::before{content:\"\\e065\"}.scroll-arrow-btn{position:fixed;right:50px;width:36px;height:35px;background:#222;color:#fff;border:none;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,.18);font-size:22px;cursor:pointer;opacity:.7;z-index:800;display:flex;align-items:center;justify-content:center;transition:opacity .2s,background .2s}:root:not(.is-index,.is-catalog).ss-sidebar .scroll-arrow-btn{right:330px!important}.scroll-arrow-btn:hover{opacity:1;background:#444}#scroll-arrow-up{bottom:80px}#scroll-arrow-down{bottom:32px}.bumpLockIndicator::after{padding-right:3px}.floatingMenu.focused{z-index:305!important}#quick-reply{padding:0}#media-viewer{padding:20px 0 0!important}#media-viewer.topright{top:26px!important;right:0!important;left:auto!important;max-height:97%!important;max-width:max-content!important}#media-viewer.topleft{top:26px!important;left:0!important;right:auto!important;max-height:97%!important;max-width:max-content!important}#media-viewer.topright::after{pointer-events:none}#media-viewer.topleft::after{pointer-events:none}.ss-chevron{transition:transform .2s;margin-left:6px;font-size:12px;display:inline-block}a.imgLink[data-filemime^='audio/'],a.originalNameLink[href$='.m4a'],a.originalNameLink[href$='.mp3'],a.originalNameLink[href$='.ogg'],a.originalNameLink[href$='.wav']{position:relative}.audio-preview-indicator{display:none;position:absolute;background:rgba(0,0,0,.7);color:#fff;padding:5px;font-size:12px;border-radius:3px;z-index:1000;left:0;top:0;white-space:nowrap;pointer-events:none}a.originalNameLink:hover .audio-preview-indicator,a[data-filemime^='audio/']:hover .audio-preview-indicator{display:block}.yt-icon{width:16px;height:13px;vertical-align:middle;margin-right:2px}.id-glow{box-shadow:0 0 12px var(--subject-color)}.id-dotted{border:2px dotted #fff}.apng-canvas-snapshot{display:block;position:absolute;z-index:1}.apng-overlay{position:absolute;z-index:2;cursor:pointer;user-select:none}.chSS-mascot{position:fixed;height:auto;object-fit:contain;pointer-events:none;z-index:-1;user-select:none;-webkit-user-drag:none}#setting_enableMascots_mascotUrls{resize:vertical;min-height:80px}:root.backlink-icon .panelBacklinks>a{display:inline-block;width:12px;height:12px;margin:0 2px;text-decoration:none;font-size:0;vertical-align:middle;color:var(--link-color)}:root.backlink-icon .panelBacklinks>a::before{content:'▶';font-size:12px;display:inline-block;line-height:.6;color:var(--link-color);transform:rotate(0);transition:transform .1s ease-in-out,opacity .1s ease-in-out;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI Symbol',Roboto,Ubuntu,Cantarell,sans-serif}:root.backlink-icon .panelBacklinks>a.inlined::before{transform:rotate(90deg);opacity:.7;color:var(--link-hover-color);line-height:.9}";
        }
        if (window.pageType?.isThread) {
            css += ":root.sticky-qr #quick-reply{display:block;top:auto!important;bottom:0}:root.sticky-qr.ss-sidebar #quick-reply{left:auto!important;right:0!important}:root.sticky-qr.ss-leftsidebar #quick-reply{left:0!important;right:auto!important}:root.sticky-qr #qrbody{resize:vertical;max-height:50vh;height:130px}#selectedDivQr,:root.sticky-qr #selectedDiv{display:inline-flex;overflow:scroll hidden;max-width:300px}#qrbody{min-width:300px}:root.bottom-header #quick-reply{bottom:28px!important}:root.fade-qr #quick-reply{padding:0;opacity:.7;transition:opacity .3s ease}:root.fade-qr #quick-reply:focus-within,:root.fade-qr #quick-reply:hover{opacity:1}#qrFilesBody{max-width:310px}#quick-reply{box-shadow:-3px 3px 2px 0 rgba(0,0,0,.19)}#unread-line{height:2px;border:none!important;pointer-events:none!important;background-image:linear-gradient(to left,rgba(185,185,185,.2),var(--text-color),rgba(185,185,185,.2));margin:-3px auto -3px auto;width:60%}:root.ss-sidebar #bannerImage{width:19rem;right:0;position:fixed;top:26px}:root.ss-sidebar.bottom-header #bannerImage{top:0!important}:root.ss-leftsidebar #bannerImage{width:19rem;left:0;position:fixed;top:26px}:root.ss-leftsidebar.bottom-header #bannerImage{top:0!important}.quoteTooltip{z-index:999}.nestedQuoteLink{text-decoration:underline dashed!important}:root.hide-stub .unhideButton{display:none}.quoteTooltip .innerPost{overflow:hidden}.inlineQuote .innerPost,.quoteTooltip .innerPost{box-shadow:-1px 1px 2px 0 rgba(0,0,0,.19)}.inlineQuote{margin-top:4px}.postInfo.title>.inlineQuote{margin-left:15px}.postCell.is-hidden-by-filter{display:none}.reply-inlined{opacity:.5;text-decoration:underline dashed!important;text-underline-offset:2px}.quote-inlined{opacity:.5;text-decoration:underline dashed!important;text-underline-offset:2px}.target-highlight{background:var(--marked-color);border-color:var(--marked-border-color);color:var(--marked-text-color)}.statLabel{color:var(--link-color)}.statNumb{color:var(--text-color)}.postCell::before{display:inline!important;height:auto!important}.threadedReplies{border-left:1px solid #ccc;padding-left:15px}.ss-idlinks-floating{position:absolute;background:var(--background-color);color:var(--text-color);border:1px solid var(--navbar-text-color);padding:8px 15px 10px 10px;box-shadow:0 2px 12px rgba(0,0,0,.25);max-height:60vh;overflow-y:auto;font-size:14px;max-width:56vw;z-index:990;scrollbar-width:thin}.ss-idlinks-floating .innerPost,.ss-vertical-id-list .innerPost{background:0 0;display:block!important;border:none;box-shadow:none;outline:0;padding:0;margin:0}.ss-idlinks-floating .innerPost{padding:0 1px 2px 0!important}";
        } else if (window.pageType?.isCatalog) {
            css += "#postingForm{margin:2em auto}#divTools>div:nth-child(5),#divTools>div:nth-child(6){float:left!important;margin-top:9px!important;margin-right:8px}";
        }

        if (!css) return;

        const style = document.createElement('style');
        style.id = '8chSS';
        style.textContent = css;
        document.head.appendChild(style);
    })();
    const faviconManager = (() => {
        const STYLES = [
            "default",
            "eight", "eight_dark",
            "pixel", "pixel_alt"
        ];
        const STATES = ["base", "unread", "notif"];
        const FAVICON_DATA = {
            default: {
                base: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAq1BMVEUAAACKtMV2lqSE1PWZ1Oyr1eaqzNp7udPO7vuc3ffh8vmG0/OB0fKv3e+N0e3B4e693+56x+bb6e6YzeOgydl7wd3L3OOwytS35fjZ8fuQ2feB1Pbo9vyy5Pjm9Pmp4PW85fbW7feO1/S55Pbk8/mq3/TY7fbn9Pnf7/bQ6vWS1fDa7fWH0vCb0+rY6/Pc7POBzezA4/GNz+vJ4+662ebH1958wNzD6vqm4Ph4HvJJAAAAN3RSTlMADwXliF4dGP7949HLn5mUhWllVCglJBf6+fn5+Pjo4N3a2NfV1MzIxb28rayinJKOioB7UzEt0Y3/cQAAAIBJREFUGNOVjsUOhVAMRG97BXcePHd3Q/7/y0hhQWDHrDpJT86wIQHo1t/xHGLb8aNvzHnYFC2KFHh+mu1PNTW6GuVB0vlaJvTsTl2xWjgxw5upCOB3ZLEzXvve5IlE8DdJ5K7QL0nts61cEw9Q8p82kmDGt4ZgbTCwrS/0Rw9IBRlvB34XFuslAAAAAElFTkSuQmCC",
                unread: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAolBMVEUAAACG2vyC1/iH1vaB1/mC1PSC2PuC2fuD2fyE2fyG3P2I3Pqn3vWB1PWO1fKD2fuE2vqE2vyH3Puk4PaK1vSg2/OP1vJ/0fGB0/SF1vaC1faB1vmF2vyy5PiP2PbF6vnK6vjU7/m/5/ao3fKF0/K55PaW2PKK1PGA0/SP2PWA1/mC2fuE2fyD2fyx4vaT1e+S1/PX8PrO7vqb3fjh9Pu25fiNN6jgAAAAMXRSTlMAHK7Kmf6CYlc/EAnrxOt4OSwV/f3y8OrQv7afI/7+/f379/Pz8OLhvLmRb1pK+/PUqRXqEQAAALhJREFUGNN1j8cSgkAAQ7c3dykiSLFTpaiA/v+vCXrAi7klM5nkgUWrFfjVWgrhqMVDnkQREeuPURBCEevjSaNurrmcsYbo4dQ/NYMA7GxTlhinGj/OZ+QAxc1m9DwrRHad91cJXJIdgsDb+5igyxzImGYowf5r76d9TlwgK7qtbRRat+NwwVwBB1EaGutucFFE9m4aYVu6OYwBaRjj7kzQoSmxYjG9U1+IllQm4XDBUI5o5QTxB/wNI78Nh2SdMuEAAAAASUVORK5CYII=",
                notif: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAA4VBMVEUAAACE3vuD1veC1veB2PqB2fuD2/2H2/2I3PqP1vOB1faE2vyN1/WD1PSB2PuE2vzQ7Pak4PaB0/OG0/J/0fGn3vSB1vmC2PqE2vmG2vq54vKf3fWrLzam4PaO1fGD1faP2PWE2fyD2fyD2fzW8PrD5PG11+WXtcW55PVvbnqqOj+XmKaT1e+x3e1+obS4AACBjqGH0/F8vNh5hpuQNj+P2PZyX2+C1/SKEBOC2ftjKjApAAAdAAAJAACD1fXkAADg9Pu05/qb3fi1vsefoq+xhIildHu4PECpMjSkLDDPAQHtACoGAAAAPnRSTlMAEsOumWJVGwnuuT39zIMs/f388erpn3k4I/Tz8/Lmz7laSkH++/v7+vr5+PPv7ezk4M7OzcSdkZFwWTIVCIgxa4YAAADDSURBVBjTdY/VrgJBGIP/cWZm3XE77oLLLm7v/0BAgMANvWuapv3gqlwOboU05wm6esEijClHp1AIwVX49BiSxrFmM8vq0/J8s5yElgDIx/i3Yprl9+zNcUgCiGFj5rqV6n9W+pzUmmBT35DSnRZ/slLhoaZBq9QnkVmcLrK1U6A2NFUadGNSlc/b1UubIdDE80wsP/Df6xeO84cRK0hTYyZpZ9di9pGgQQLP8BUffPfOP+tU4YiJ8XB0wUp4XR/CO+B76XMRs7uqu4cAAAAASUVORK5CYII=",
            },
            eight: {
                base: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAA6lBMVEUAAAAxV2oFSGADP1Y1Wm0zWW1EY3Q1VmgpU2g2VWYkUGUyUWIiTWEAKUcFSmErU2c5W24zVWghUWckTmIKSmEZTmUxUmMwUWP1+fxcc4HL6f7j9f/g7PWi1fWWprFJZXUeSl7Z7v6Myu7d4OOjt8SKrcOSrsFMa30/YnT////C5v/Q6PmHz/nt7/Gw1e+bzu+Dx+7A1+d7wOa+ztqtx9m5v8Sds8KDn7J0lqqJl6GEkZtJfZlRb4E5Zn1Ybnw0YHc3V2kPSWAAQVqY0vZpstqMu9mIutjO0tV5rcyru8dfm7xTmLthh51TfpcZngh2AAAAGHRSTlMA1cx8MBoH8fHm5s3Kv5qUiFhYUFDxmpptBtYcAAAAzUlEQVQY0zWOVRKDQBBEB4+77OLB4+5B43b/64QU8P76VddMQwpTyWGFbEAGXTjoaLxWqmlmSRnF9HUl7bSwKO49fO+vyURQsvCMiDZGY+Xfb1JlQ9iENcJDCMf3SqetOe8tgzDaIz0HTH43GfD8sLfcGCI6VKD7laamtYqNIIhygQHudj6qarDi54aMSRrA1jSfqKkWb5WpFhv/cBYzlyNUc7ClkgnF1+hh2x9pcmomou5cRtpUknYlFhKqznsxux7zNGTUi77LdZg0/QBWixhGoJiKLQAAAABJRU5ErkJggg==",
                unread: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAtFBMVEUAAAAAYYUAYYQAXIAAW38AYYMAY4YAXYAAYIQAZIcAY4Udc5MAWX8BZogldJQAWn6L2fIRa4xy0faB2/xt0vqI3Ph+0vBdxO1Wp8c/i6l41fhPwO1Ivu1Lo8dEoMYegaYYcZMEa46X5f1NxvZfyfNZyPOI1OxqwuV3w947rttputpdttldq8porscrmcNRnbtEmLpOmLU9krQFb5MHZIVIueY6tuaAyeJOstp1vNRCp9Auh6qJsLovAAAADnRSTlMAWfLRzujVm5EzHAqLiBrNc7IAAADDSURBVBjTNY9XEsIwEEPd0mFtp4d0eocU+v3vRRic9yeNZldCCtsgIBlGI5aWbMX6JE2lHdoEgRDzh1QZDGGYALzmJ/Y3JhfvyHUCYi1/eWzS2Iv5VAchYLhH4ZpvZvue8yTYEmRrbeT7rjvbx8cwSAxklMuoKA6D43lho9mI7FYl5/3B3cQXoBZCkKW1PuWFn7MJdoYf9T3riM5z/6pasvPiXVWfKKrGknK3SNPVsqWO2mHK8y17lpqFRjCrO2LYSn0BV4wQhK3VgFcAAAAASUVORK5CYII=",
                notif: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAABEVBMVEUAAAAAW38AYoUAYoQAYYQAZYgAYYMAZIYAXoEBZom1AwbrAABGAAAALT4AAAAAYYRHAAAAAAAadJTeAAABZohHGymuAABFAACcAAAAAAAAAAAAUnIAZ4oAAAAQao2M2/Qic5Rw0/pKv+1EoscAXoD5AAB31fhfxO0egaYpdpUAa40AWX3/AgK/AAC6AABNAACX5f2B2/xr0fqH2/dNxvZy0fVfyfNZyPN80e+I1OxQv+x7xuA7rttmu9ldttlorsddqsdUpsZLocMrmcNEmLpPm7g+iqkFb5MZcJJYwu1IueY6tuZoweROstp1vNRdsdBCp9Bwt8xAk7U6kbRYnbEuh6oJZYWZdYM1RF0AKDwAHjhOZ3nrAAAAHnRSTlMA0FnyjRzo1psy/v785K2UiVwL+PLu6OPLyL6nm49luDk4AAAA4ElEQVQY0zWP5XLDMBAGT5YpnJRRkiHGOg0zc7lheP8HiTN29t/t7NzMByGCjBlBHFyIiNMWbfRIKryv0KRUojTfImHD2fX6lNm/+R4KBD8p9F0J27RBzj3Ho0FhoPOJw4Iy/x9i4+G30dH3UW+3vgFBXJlFRakY/ffsm3d8Admqfmhat2J0fJFLCIDbNcvVt13l7yyeAJjadCRe15RhPJaNJgHIlzrDkqsVx8/38TQAoFH5fz7fmKZzex27ewXgSLusNmvVJUrnvIeMn6TI6FP9scQIJB8zwRDkzLAsQMAJImsd3S869hIAAAAASUVORK5CYII=",
            },
            eight_dark: {
                base: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAA2FBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAmKCkAAAADBAQAAAD1+fxMTEzM6v4vLy7i9f/E6P/v8PKMye2frbiFo7aNpLQ1P0b////Z7/+I0PrQ6Pmk1vab0/bi7PXe6fKfz+6w1O2Cxu15veS/1OPY2dq8ydOrwdKHtdK1traZqbSQmqF8kZ+QlJhshJSBhIZ7fH0+YnY9R09GREMOIiwfJivp+f/X7fyYzO3g4OBmrtTMzMt0pcKnsrpWjq1Ii6xUcIEyZX8ENUgYNkYAKD1NaNryAAAADnRSTlMAzPGY5tV8WFAwGge/iAmaI18AAADKSURBVBjTNY7XFoIwEEQ3CR1NQi/23rsC9q7//0fiAe7bzLlndyBHI5ibSIYCVdgMmTM1SZ51tGQplZOZOwpvt9YRv1SmKCukuXWjIubMMf++IpU8a0bLYuQwnt5Du4U/qI4opWs2xKAJq65tG/XDaOa12IYA2TY6fjA26tW91V4KGuBJ85XaY2PgzTlSAULX/YplGhhBSVL09Efc732wSH17IWUT0L12DcNnp7tTskJOzjX32GyskA4ZJHn0e5OtoEKBjOI3Jlqefl82Et7gg4sWAAAAAElFTkSuQmCC",
                unread: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAA6lBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAQEAAADb3NxEQ0IAAAAAAABISEgAAAAAAAAlKCk9NzGurq6cnJwAAAD+/v73+Pi6u7tNTExGREMwLy7N6v61trY1QEfE6P/t7u+dzu6Mye2rwdKForaNpLTy+f/h9f/Z7//S6vuI0Pqk1vbg6/Sw1O2Cxu2+0uCHtdLKzM2qtbycqrV8kaCPl51shJV8f4I+YnYOIiwfJiud1PaY0vbo6Oh+vuR0vOPg4OBmrtS8ydN0pcLAwMBWjq1Ii6yjpaZUcIEyZX88R08ENUgYNkYAKD0sty6hAAAAFXRSTlMAzZjyWeUa1owv/Oe/roh8UAf26MtVcWhmAAAA10lEQVQY0zWP1ZLDMBRDr+04SbkLpjgMZeZ2mfn/f2ebqas3aTQaHTCyMVEaWXBWhW6rIg40Nv4CrTsdIfijNp22Go22nprzAJ2C1rq7YA5RItZlv92qL7tL5lI25+q4h75X+bT3zHQg5QcBm27GUeT3ewuPc8kw4N0wyYvM7089wSW1gcxuvxhjmZ+VQR0gTNM/x2WFX1zGPGgA7B8mv8RhebTCNa8JAOht8BKGn8k4rFXvrlwA6/A0SJOb4QY15et1+Rwf3u8nsx2tQMPQWmj/Q7BtOP8BG/MW/0ZJlAQAAAAASUVORK5CYII=",
                notif: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAABDlBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAQEAAAAAAAAAAAC2AQHrAAA4AAAAAAAAAABIAgIAAAAAAAAlKCneAABDAACuAABFAACcAAADBAQAAAAAAAC8AABNTE3+AQHN6v72+PmKo7QvLy5GAAD+/v/E6P+Myu6rwtLy+f/h9f/Z7//S6vuI0Pqk1vab0/bg6/Sfz+6w1O2Cxu2+0uHc3d2HtdLKzc61tracqrV8kaBshJV8f4I+YnY5R081QUkOIiwfJiv3AADt7u/r7e6YzO1+vuR0vONmrtS8ydN0pcKtucGnsrqQqLeCordWjq1Ii6yjqaqQmqGOk5i3hYhUcIEyZX8ENUgYNkZGREM1PEEAKD1ovUZyAAAAGnRSTlMAzfLlmliSGtYv/v77v66IfFAH+Ozo4suIXxNuy1MAAADcSURBVBjTNY9VjkJBFERvyxMcxud2Pxfc3cfdffa/ESA09VeVk0oOqBicSo9osEuCTbrO+cDTVd8j78Wi4wRdTzEF2WhMfmU/GJDtkH8rPaBJpXPhbfhCPjMsDVFn2A/k+o/MRm6nfIvppPh4pWCwcSsM7Ur53rcsgRz4tNZ8cmO70vHPLMEMoL36FyLGdrwZMgDzKPo3T9C1H9MpK5kFWFy3f6iJbjjiR34OAMhz9W7+99lszQ72U4c6gLa8qUaX9dqY5IQ4PgUAffly1e5NWQKyylYji2/KDeW5AobCG0Lco88iAAAAAElFTkSuQmCC",
            },
            pixel: {
                base: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAYFBMVEUAAAAAAAAAAABiam00WmxcZWlFTE4jQE1GTU8jQU4yV2g8QUIbNkE/WGRWYWY9WGUAAAAAAADg8vnY6fB5yOyA0fW95fi23fB+z/PQ4Od0weNoeYFWcoBSXmNFS00jP0wFxP2oAAAAEnRSTlMAIRHe3v3w8Nzc/ezs/u7u7EbfERAsAAAAcUlEQVQY05VP1wqAMAw0de82TYf7//9SOhBFELy3G1wuyQcYYw8OVVHBzYJUokzBW3VZg+MYFMhI0ThMMm9zlIXnVmmzbFy0iHtSkmq63mhtYuJQthO8X40OHSHR0DwO4UrsoAziDq84HudcO15P/MAJxpAGt0Xg7i0AAAAASUVORK5CYII=",
                unread: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAYFBMVEUAAAAATHcAIGJii6I0gKFFepYjdJVGepYjdJUAXIFeiaEyf6A8dZIbcJJThZ8/f55WhZ89f58AY4YAM2ng8/p/0vbY6/R5zPC95vq23/TQ5O10xelolKxWj6tFepUjdJUJarSxAAAAFHRSTlMAIBHe3vDw3Nwj/f3s7P7+7u7sRkWW9w4AAAB4SURBVBjTlY/ZDoUwCERL3fcNSnsX/f+/tEpjNCYm8nZgMjOoh9FaXxiyJIPTCSKDJoL9lKc5bIx+U3iOmXjoP6asSzSJKjwTWfdrx6lGnFXKVDWds9a1oliImmns/s6Khygq/g69pAQPjiH0kBTPoc7R4/bEi1kBHCgHTIPhydUAAAAASUVORK5CYII=",
                notif: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAhFBMVEUAAAAAV34AIDg0gKEkdJQjdJUUAAMAAEAyf6AbcJI7dZA/f55MAABAgaBEeZVljaVUhJ4AZIZpkKYAQmp5y/B+0fVrS0224PPf8vnP4uu85vqA0/fY6/NUIivtAABNHynjAAB0xelolKxWj6tNgZpFepUjdJVOTU9fREtAREvaAABiAADosgfnAAAAFHRSTlMAIBHe8NzcIP3s3v7x7u7e7uzeRqhOt1sAAACESURBVBjTlY9ZDoMwDERxCHvp6mASSKH7dv/71YWoAiEh4b83Ho3H3swIIUYchaswGqwgta1N4ccQyABgr4tjoTfA7KPCfKtrFsp63bGqDJ2vloXy5klUcZKRMfRsO8e9Uslhl12IXp8HZ/SOGE+5bN4NX3EZ6IPr0SvMrs6/x+SJBfMF/doItAPX5RIAAAAASUVORK5CYII=",
            },
            pixel_alt: {
                base: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAY1BMVEUAAAAATHcAIGJii6I0gKFFepYjdJVGepYjdJUAXIFeiaEyf6A8dZIbcJJThZ8/f55WhZ89f58AY4YAQmoAJGjg8/p/0vbY6/R5zPC95vq23/TQ5O10xelolKxWj6tFepUjdJUOfB3LAAAAFXRSTlMAIBHe3vDw3Nwj/f3s7P7+7u7sRkaqQLDYAAAAeUlEQVQY05WP6Q6EMAiES73vYxdKu4e+/1NapTEaExP598FkZlA3o7U+MWRJBocTRAZNBNspT3NYGf2m8Bwz8dB/TFmXaBJVeCay7teO7xpxUilT1XTOWteKYiZqXmP3d1Y8RFHxd+glJXhwDKGHpHgOdfYelycezAI9gweHH0yPzQAAAABJRU5ErkJggg==",
                unread: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAhFBMVEUAAAAjR1sKChFJeZBBa4FAZ3tCbIEVFRYABA9IeI9OaXlReI1MTExSeo9WcYBxh5RjfYw4WGt0ipcdKTh7y+6A0vdqbm/f8fi85fl+0PTY6vK23fDt7OzP4OdVWFlOUlS44PPj4+NZdITR4+t3xefa2tpyj55jiZ1Ba4BgZ2tiYF9ATFKjqzLCAAAAFHRSTlMAIBHe8O3c3CD93v7x7u7e7uzeRvBdAgMAAACFSURBVBjTlY9ZDoMwDERxIKylqwOBlATo3t7/fjVpVIGQkPDfG4/GY29hGGMTjqNNFI9WkOpOpzAwhEEIcGyKc9HsgNhHgfn+UpNQ1lvLlZDtvdcklL0XoEh4pqRUr846nqLip0P2aNXnbSjj50jwmnNzM3TFZaAProdVBnZ1/j1mT6yYLxHCCNKMC/PDAAAAAElFTkSuQmCC",
                notif: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAAdVBMVEUAAAAkSFwKChFAaX9JeZAABBhCbIEVAABIeI9yiJVObnxReI1MAABSeo9WcYBjfYw4WGsdKTiA0vd7y+5rS0233/JSHiPf8vnP4um85fnY6/LtAABZdobjAAB3xedyj55jiZ1Ba4BOTU9gREtAREvaAABiAADFYUIqAAAAEnRSTlMAIRHv3iDc3P3e3v7x7u7u7EYDRb2ZAAAAgklEQVQY05WPWQ7CMAxE67jpSlnsOk1Kyw73PyJJFCEQUqX6741H43G2MEqpH9blptRfK2jMbBoIDAUWoGvbH3tbg+ecibudHb0wjNvIRE7Ok/HCMGXIVGErzsl9jo4rER727UXk8bqFjOio+NSheYYrKYNzSD2iEjjV+fT4e2LFvAFuzge5hY5wYgAAAABJRU5ErkJggg==",
            }
        };
        let currentStyle = "default";
        let currentState = "base";
        let cachedUserStyle = null;
        function removeFavicons() {
            const head = document.head;
            if (!head) return;
            head.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"]').forEach(link => link.remove());
        }
        function insertFavicon(href) {
            const head = document.head;
            if (!head) return;
            const link = document.createElement('link');
            link.rel = 'icon';
            link.type = 'image/png';
            link.href = href;
            head.appendChild(link);
        }
        async function getUserFaviconStyle() {
            if (cachedUserStyle) return cachedUserStyle;
            let style = "default";
            try {
                style = await getSetting("customFavicon_faviconStyle");
            } catch { }
            if (!STYLES.includes(style)) style = "default";
            cachedUserStyle = style;
            return style;
        }
        async function setFaviconStyle(style, state = "base") {
            if (!STYLES.includes(style)) style = "default";
            if (!STATES.includes(state)) state = "base";
            if (currentStyle === style && currentState === state) return; 

            const url = (FAVICON_DATA?.[style]?.[state]) || FAVICON_DATA.default.base;
            removeFavicons();
            insertFavicon(url);
            currentStyle = style;
            currentState = state;
            document.dispatchEvent(new CustomEvent("faviconStateChanged", {
                detail: { style, state }
            }));
        }
        async function setFavicon(state = "base") {
            if (!STATES.includes(state)) state = "base";
            const style = await getUserFaviconStyle();
            await setFaviconStyle(style, state);
        }
        async function resetFavicon() {
            await setFavicon("base");
        }
        function getCurrentFaviconState() {
            return { style: currentStyle, state: currentState };
        }

        return {
            setFavicon,
            setFaviconStyle,
            resetFavicon,
            getCurrentFaviconState,
            STYLES,
            STATES
        };
    })();
    const featureMap = [
        { key: "enableScrollSave", fn: featureSaveScroll },
        { key: "watchThreadOnReply", fn: featureWatchThreadOnReply },
        { key: "blurSpoilers", fn: featureBlurSpoilers },
        { key: "enableHeaderCatalogLinks", fn: featureHeaderCatalogLinks },
        { key: "openCatalogThreadNewTab", fn: catalogThreadsInNewTab },
        { key: "enableScrollArrows", fn: featureScrollArrows },
        { key: "alwaysShowTW", fn: featureAlwaysShowTW },
        { key: "enableThreadHiding", fn: featureCatalogHiding },
        { key: "switchTimeFormat", fn: featureLabelCreated12h },
        { key: "enableIdFilters", fn: featureIdFiltering },
        { key: "enhanceYoutube", fn: enhanceYouTubeLinks },
        { key: "threadStatsInHeader", fn: threadInfoHeader },
        { key: "enableHashNav", fn: hashNavigation },
        { key: "hideAnnouncement", fn: featureHideAnnouncement },
        { key: "enableAutoHideHeaderScroll", fn: autoHideHeaderOnScroll },
        { key: "enableMediaViewer", fn: mediaViewerPositioning },
        { key: "customFavicon", fn: enableFavicon },
        { key: "highlightNewIds", fn: featureHighlightNewIds },
        { key: "quoteThreading", fn: featureQuoteThreading },
        { key: "enableLastFifty", fn: featureLastFifty },
        { key: "enableIdToggle", fn: featureToggleIdAsYours },
        { key: "enableTheSauce", fn: featureSauceLinks },
        { key: "enableUpdateNotif", fn: updateNotif },
        { key: "alwaysShowIdCount", fn: featureShowIDCount },
        { key: "enablePNGstop", fn: featureAPNGStop },
        { key: "enableMascots", fn: featureMascots },
    ];
    for (const { key, fn } of featureMap) {
        try {
            if (await getSetting(key)) {
                fn();
            }
        } catch (e) {
            console.error(`${fn.name || 'Feature'} failed:`, e);
        }
    }
    if (await getSetting("truncFilenames")) {
        try {
            const filenameLength = await getSetting("truncFilenames_customTrunc");
            truncateFilenames(filenameLength);
        } catch (e) {
            console.error("truncateFilenames failed:", e);
        }
    }
    async function enableFavicon() {
        try {
            const customFaviconEnabled = await getSetting("customFavicon");
            const selectedStyle = await getSetting("customFavicon_faviconStyle");

            if (customFaviconEnabled) {
                if (selectedStyle && typeof selectedStyle === 'string') {
                    await faviconManager.setFaviconStyle(selectedStyle);
                } else {
                    console.warn("Invalid favicon style:", selectedStyle);
                    await faviconManager.setFaviconStyle("eight_dark");
                }
            } else {
                await faviconManager.resetFavicon();
            }
        } catch (e) {
            console.error("Error updating favicon:", e);
        }
    }
    let imageHoverEnabled = false;
    try {
        if (window.pageType?.isCatalog) {
            imageHoverEnabled = await getSetting("enableCatalogImageHover");
        } else {
            imageHoverEnabled = await getSetting("enableThreadImageHover");
        }
        if (imageHoverEnabled) {
            localStorage.setItem("hoveringImage", "false");
            featureImageHover();
        }
    } catch (e) {
        console.error("featureImageHover failed:", e);
    }
    (function () {
        function sanitizeToastHTML(html) {
            html = html.replace(/<(\/?)(?!a\b|b\b|i\b|u\b|strong\b|em\b)[^>]*>/gi, '');
            html = html.replace(/<(b|i|u|strong|em)[^>]*>/gi, '<$1>');
            html = html.replace(/<a\s+([^>]+)>/gi, function (match, attrs) {
                let allowed = '';
                attrs.replace(/(\w+)\s*=\s*(['"])(.*?)\2/gi, function (_, name, q, value) {
                    name = name.toLowerCase();
                    if (['href', 'target', 'rel'].includes(name)) {
                        if (name === 'href' && (/^\s*javascript:/i.test(value) || /^\s*data:/i.test(value))) return;
                        allowed += ` ${name}=${q}${value}${q}`;
                    }
                });
                return `<a${allowed}>`;
            });

            return html;
        }
        function showToast(htmlMessage, color = "black", duration = 1200) {
            if (document.querySelector('.global-toast-notification')) {
                return;
            }

            const colorMap = {
                black: "#222",
                orange: "#cc7a00",
                green: "#339933",
                blue: "#1976d2",
                red: "#c62828"
            };
            const bgColor = colorMap[color] || color;

            const icon = document.getElementById("8chanSS-icon");
            let toast = document.createElement("span");
            toast.className = "global-toast-notification";
            toast.innerHTML = sanitizeToastHTML(htmlMessage);
            toast.style.position = "absolute";
            toast.style.background = bgColor;
            toast.style.color = "#fff";
            toast.style.padding = "4px 12px";
            toast.style.borderRadius = "4px";
            toast.style.fontSize = "13px";
            toast.style.zIndex = 99999;
            toast.style.opacity = "1";
            toast.style.transition = "opacity 0.3s";
            toast.style.pointerEvents = "auto";
            toast.style.boxShadow = "0 2px 8px rgba(0,0,0,0.18)";
            let closeBtn = document.createElement("span");
            closeBtn.textContent = "✕";
            closeBtn.style.marginLeft = "10px";
            closeBtn.style.cursor = "pointer";
            closeBtn.style.fontWeight = "bold";
            closeBtn.style.fontSize = "15px";
            closeBtn.style.opacity = "0.7";
            closeBtn.style.float = "right";
            closeBtn.style.userSelect = "none";

            closeBtn.addEventListener('click', function (e) {
                e.stopPropagation();
                if (toast.parentNode) toast.parentNode.removeChild(toast);
                if (timeout1) clearTimeout(timeout1);
                if (timeout2) clearTimeout(timeout2);
            });
            closeBtn.addEventListener('mouseover', function () { closeBtn.style.opacity = "1"; });
            closeBtn.addEventListener('mouseout', function () { closeBtn.style.opacity = "0.7"; });

            toast.appendChild(closeBtn);

            if (icon && icon.parentNode) {
                toast.style.left = (icon.offsetLeft - 50) + "px";
                toast.style.top = "28px";
                icon.parentNode.appendChild(toast);
            } else {
                toast.style.right = "25px";
                toast.style.top = "25px";
                toast.style.position = "fixed";
                document.body.appendChild(toast);
            }

            let timeout1 = setTimeout(() => { toast.style.opacity = "0"; }, duration - 300);
            let timeout2 = setTimeout(() => { toast.remove(); }, duration);
        }

        window.callPageToast = function (msg, color = 'black', duration = 1200) {
            showToast(msg, color, duration);
        };
    })();
    async function featureSaveScroll() {
        if (!window.pageType?.isThread) return;

        const STORAGE_KEY = "8chanSS_scrollPositions";
        const UNREAD_LINE_ID = "unread-line";
        const MAX_THREADS = 200;
        function getBoardAndThread() {
            const match = window.location.pathname.match(/^\/([^/]+)\/res\/([^/.]+)\.html$/i); 
            if (!match) return null;
            return { board: match[1], thread: match[2] };
        }
        async function getAllSavedScrollData() {
            const saved = await GM.getValue(STORAGE_KEY, null);
            if (!saved) return {};
            try { return JSON.parse(saved); } catch { return {}; }
        }
        async function setAllSavedScrollData(data) {
            await GM.setValue(STORAGE_KEY, JSON.stringify(data));
        }
        function getCurrentPostCount() {
            if (!divPosts) return 0;
            return divPosts.querySelectorAll(":scope > .postCell[id]").length;
        }
        function removeUnreadLineMarker() {
            const oldMarker = document.getElementById(UNREAD_LINE_ID);
            if (oldMarker && oldMarker.parentNode) {
                oldMarker.parentNode.removeChild(oldMarker);
            }
        }
        let lastSeenPostCount = 0;
        let unseenCount = 0;
        let tabTitleBase = null;
        let previousFaviconState = null;
        const customFaviconEnabled = await getSetting("customFavicon");

        async function updateTabTitle() {
            if (window.isNotifying) return;
            if (!tabTitleBase) tabTitleBase = document.title.replace(/^\(\d+\)\s*/, "");
            document.title = unseenCount > 0 ? `(${unseenCount}) ${tabTitleBase}` : tabTitleBase;
            const { style, state } = faviconManager.getCurrentFaviconState();

            if (unseenCount > 0 && customFaviconEnabled) {
                if (state !== "unread") {
                    previousFaviconState = { style, state };
                }
                faviconManager.setFaviconStyle(style, "unread");
            } else if (unseenCount == 0 && customFaviconEnabled) {
                if (state === "unread" && previousFaviconState) {
                    faviconManager.setFaviconStyle(previousFaviconState.style, previousFaviconState.state);
                    previousFaviconState = null;
                } else if (state === "unread") {
                    faviconManager.setFavicon("base");
                }
            }
        }
        async function updateUnseenCountFromSaved() {
            const info = getBoardAndThread();
            if (!info) return;
            const allData = await getAllSavedScrollData();
            const key = `${info.board}/${info.thread}`;
            const saved = allData[key];
            const currentCount = getCurrentPostCount();
            lastSeenPostCount = (saved && typeof saved.lastSeenPostCount === "number") ? saved.lastSeenPostCount : 0;
            unseenCount = Math.max(0, currentCount - lastSeenPostCount);
            updateTabTitle();
        }
        let lastScrollY = window.scrollY;
        async function onScrollUpdateSeen() {
            const info = getBoardAndThread();
            if (!info || !(await getSetting("enableScrollSave"))) return;
            const posts = Array.from(document.querySelectorAll(".divPosts > .postCell[id]"));
            let maxIndex = -1;
            for (let i = 0; i < posts.length; ++i) {
                const rect = posts[i].getBoundingClientRect();
                if (rect.bottom > 0 && rect.top < window.innerHeight) maxIndex = i;
            }
            const currentCount = getCurrentPostCount();
            let newLastSeen = lastSeenPostCount;

            if (window.scrollY > lastScrollY) {
                if (maxIndex >= 0 && currentCount > 0) {
                    if ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 20)) {
                        newLastSeen = currentCount;
                    } else {
                        newLastSeen = Math.max(lastSeenPostCount, maxIndex + 1);
                    }
                }
                if (newLastSeen !== lastSeenPostCount) {
                    lastSeenPostCount = newLastSeen;
                    let allData = await getAllSavedScrollData();
                    const key = `${info.board}/${info.thread}`;
                    if (!allData[key]) allData[key] = {};
                    allData[key].lastSeenPostCount = lastSeenPostCount;
                    allData[key].timestamp = Date.now();
                    if (
                        typeof allData[key].position !== "number" ||
                        window.scrollY > allData[key].position
                    ) {
                        allData[key].position = window.scrollY;
                    }
                    await setAllSavedScrollData(allData);
                }
                unseenCount = Math.max(0, currentCount - lastSeenPostCount);
                updateTabTitle();
            }
            lastScrollY = window.scrollY;
        }
        async function saveScrollPosition() {
            const info = getBoardAndThread();
            if (!info || !(await getSetting("enableScrollSave"))) return;

            const scrollPosition = window.scrollY;
            const timestamp = Date.now();

            let allData = await getAllSavedScrollData();
            const keys = Object.keys(allData);
            if (keys.length >= MAX_THREADS) {
                keys.sort((a, b) => (allData[a].timestamp || 0) - (allData[b].timestamp || 0));
                for (let i = 0; i < keys.length - MAX_THREADS + 1; ++i) delete allData[keys[i]];
            }

            const key = `${info.board}/${info.thread}`;
            if (!allData[key]) allData[key] = {};
            if (
                typeof allData[key].position !== "number" ||
                scrollPosition > allData[key].position
            ) {
                allData[key].position = scrollPosition;
                allData[key].timestamp = timestamp;
                await setAllSavedScrollData(allData);
            }
        }
        function scrollElementToViewportCenter(el) {
            if (!el) return;
            const rect = el.getBoundingClientRect();
            const elTop = rect.top + window.pageYOffset;
            const elHeight = rect.height;
            const viewportHeight = window.innerHeight;
            const scrollTo = elTop - (viewportHeight / 2) + (elHeight / 2);
            window.scrollTo({ top: scrollTo, behavior: "auto" });
        }
        async function restoreScrollPosition() {
            const info = getBoardAndThread();
            if (!info || !(await getSetting("enableScrollSave"))) return;

            const allData = await getAllSavedScrollData();
            const key = `${info.board}/${info.thread}`;
            const saved = allData[key];
            if (!saved || typeof saved.position !== "number") return;

            const anchor = window.location.hash ? window.location.hash.replace(/^#/, "") : null;
            const safeAnchor = anchor && /^[a-zA-Z0-9_-]+$/.test(anchor) ? anchor : null;

            if (safeAnchor) {
                setTimeout(() => {
                    const post = document.getElementById(safeAnchor);
                    if (post && post.classList.contains("postCell")) {
                        scrollElementToViewportCenter(post);
                    }
                    addUnreadLineAtSavedScrollPosition(saved.position, false);
                }, 25);
                return;
            }
            saved.timestamp = Date.now();
            await setAllSavedScrollData(allData);
            window.scrollTo({ top: saved.position, behavior: "auto" });
            setTimeout(() => addUnreadLineAtSavedScrollPosition(saved.position, false), 80);
        }
        async function addUnreadLineAtSavedScrollPosition(scrollPosition, centerAfter = false) {
            if (!(await getSetting("enableScrollSave_showUnreadLine"))) return;
            if (!divPosts) return;
            const margin = 5; 
            const docHeight = document.body.offsetHeight;
            if ((scrollPosition + window.innerHeight) >= (docHeight - margin)) {
                return;
            }
            const posts = Array.from(divPosts.querySelectorAll(":scope > .postCell[id]"));
            let targetPost = null;
            for (let i = 0; i < posts.length; ++i) {
                const postTop = posts[i].offsetTop;
                if (postTop > scrollPosition) break;
                targetPost = posts[i];
            }
            if (!targetPost) return;
            removeUnreadLineMarker();
            const marker = document.createElement("hr");
            marker.id = UNREAD_LINE_ID;
            if (targetPost.nextSibling) {
                divPosts.insertBefore(marker, targetPost.nextSibling);
            } else {
                divPosts.appendChild(marker);
            }
            if (centerAfter) {
                setTimeout(() => {
                    const markerElem = document.getElementById(UNREAD_LINE_ID);
                    if (markerElem) {
                        const rect = markerElem.getBoundingClientRect();
                        const desiredY = window.innerHeight / 3;
                        const scrollY = window.scrollY + rect.top - desiredY;
                        window.scrollTo({ top: scrollY, behavior: "auto" });
                    }
                }, 25);
            }
        }
        let unseenUpdateTimeout = null;
        function debouncedUpdateUnseenCount() {
            if (unseenUpdateTimeout) clearTimeout(unseenUpdateTimeout);
            unseenUpdateTimeout = setTimeout(() => {
                updateUnseenCountFromSaved();
                unseenUpdateTimeout = null;
            }, 100);
        }

        const divPostsObs = observeSelector('.divPosts', { childList: true, subtree: false });
        if (divPostsObs) {
            divPostsObs.addHandler(function saveScrollPostCountHandler() {
                debouncedUpdateUnseenCount();
            });
        }
        async function removeUnreadLineIfAtBottom() {
            if (!(await getSetting("enableScrollSave_showUnreadLine"))) return;
            const margin = 5; 
            if ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight - margin)) {
                removeUnreadLineMarker();
            }
        }
        window.addEventListener("beforeunload", () => {
            saveScrollPosition();
        });

        document.addEventListener("DOMContentLoaded", () => {
            tabTitleBase = document.title.replace(/^\(\d+\)\s*/, "");
            updateTabTitle();
        });
        window.addEventListener("load", async () => {
            await restoreScrollPosition();
            await updateUnseenCountFromSaved();
        });

        let scrollTimeout = null;
        window.addEventListener("scroll", () => {
            if (scrollTimeout) return;
            scrollTimeout = setTimeout(async () => {
                await onScrollUpdateSeen();
                await removeUnreadLineIfAtBottom();
                scrollTimeout = null;
            }, 100); 
        });
        await restoreScrollPosition();
        await updateUnseenCountFromSaved();
    }
    async function featureHeaderCatalogLinks() {
        async function appendCatalogToLinks() {
            const openInNewTab = await getSetting("enableHeaderCatalogLinks_openInNewTab");
            const boardLists = [
                document.getElementById("navBoardsTop"),
                document.getElementById("navBoardsFavorite")
            ];

            for (const navboardsSpan of boardLists) {
                if (navboardsSpan) {
                    const links = navboardsSpan.getElementsByTagName("a");

                    for (let link of links) {
                        if (
                            link.href &&
                            !link.href.endsWith("/catalog.html") &&
                            !link.dataset.catalogLinkProcessed
                        ) {
                            link.href += "/catalog.html";
                            link.dataset.catalogLinkProcessed = "1";
                            if (openInNewTab) {
                                link.target = "_blank";
                                link.rel = "noopener noreferrer"; 
                            } else {
                                link.target = "";
                                link.rel = "";
                            }
                        }
                    }
                }
            }
        }
        appendCatalogToLinks();
        const debouncedAppend = debounce(appendCatalogToLinks, 100);
        const navboardsTopObs = observeSelector('#navBoardsTop', { childList: true, subtree: true });
        if (navboardsTopObs) {
            navboardsTopObs.addHandler(function headerCatalogLinksHandler() {
                debouncedAppend();
            });
        }

        const navboardsFavoriteObs = observeSelector('#navBoardsFavorite', { childList: true, subtree: true });
        if (navboardsFavoriteObs) {
            navboardsFavoriteObs.addHandler(function headerCatalogLinksHandler() {
                debouncedAppend();
            });
        }
    }
    function catalogThreadsInNewTab() {
        if (!window.pageType?.isCatalog) return;
        catalogDiv.querySelectorAll('.catalogCell a.linkThumb').forEach(link => {
            if (link.getAttribute('target') !== '_blank') {
                link.setAttribute('target', '_blank');
            }
        });
        catalogDiv.addEventListener('click', function (e) {
            const link = e.target.closest('.catalogCell a.linkThumb');
            if (link && link.getAttribute('target') !== '_blank') {
                link.setAttribute('target', '_blank');
            }
        });
    }
    function featureImageHover() {
        const MEDIA_MAX_WIDTH = "90vw";
        const MEDIA_OPACITY_LOADING = "0";
        const MEDIA_OPACITY_LOADED = "1";
        const MEDIA_OFFSET = 50; 
        const MEDIA_BOTTOM_MARGIN = 3; 
        const AUDIO_INDICATOR_TEXT = "▶ Playing audio...";
        function getExtensionForMimeType(mime) {
            const map = {
                "image/jpeg": ".jpg",
                "image/jpg": ".jpg",
                "image/jxl": ".jxl",
                "image/png": ".png",
                "image/apng": ".png",
                "image/gif": ".gif",
                "image/avif": ".avif",
                "image/webp": ".webp",
                "image/bmp": ".bmp",
                "video/mp4": ".mp4",
                "video/webm": ".webm",
                "video/x-m4v": ".m4v",
                "audio/ogg": ".ogg",
                "audio/mpeg": ".mp3",
                "audio/x-m4a": ".m4a",
                "audio/x-wav": ".wav",
            };
            return map[mime.toLowerCase()] || null;
        }
        function sanitizeUrl(url) {
            try {
                const parsed = new URL(url, window.location.origin);
                if ((parsed.protocol === "http:" || parsed.protocol === "https:") &&
                    parsed.origin === window.location.origin) {
                    return parsed.href;
                }
            } catch { }
            return "";
        }
        let floatingMedia = null;
        let cleanupFns = [];
        let currentAudioIndicator = null;
        let lastMouseEvent = null; 
        function clamp(val, min, max) {
            return Math.max(min, Math.min(max, val));
        }
        function positionFloatingMedia(event) {
            if (!floatingMedia) return;
            const vw = window.innerWidth;
            const vh = window.innerHeight;
            const mw = floatingMedia.offsetWidth || 0;
            const mh = floatingMedia.offsetHeight || 0;

            const docElement = document.documentElement;
            const SCROLLBAR_WIDTH = window.innerWidth - docElement.clientWidth; 
            const MEDIA_BOTTOM_MARGIN_PX = vh * (MEDIA_BOTTOM_MARGIN / 100);

            let x, y;
            const rightX = event.clientX + MEDIA_OFFSET;
            const leftX = event.clientX - MEDIA_OFFSET - mw;
            if (rightX + mw <= vw - SCROLLBAR_WIDTH) {
                x = rightX;
            }
            else if (leftX >= 0) {
                x = leftX;
            }
            else {
                x = clamp(rightX, 0, vw - mw - SCROLLBAR_WIDTH);
            }

            y = event.clientY;
            const maxY = vh - mh - MEDIA_BOTTOM_MARGIN_PX;
            y = Math.max(0, Math.min(y, maxY));

            floatingMedia.style.left = `${x}px`;
            floatingMedia.style.top = `${y}px`;
        }
        function cleanupFloatingMedia() {
            cleanupFns.forEach(fn => { try { fn(); } catch { } });
            cleanupFns = [];
            if (floatingMedia) {
                if (["VIDEO", "AUDIO"].includes(floatingMedia.tagName)) {
                    try {
                        floatingMedia.pause();
                        floatingMedia.srcObject = null;
                        URL.revokeObjectURL(floatingMedia.src);
                        floatingMedia.removeAttribute("src");
                        floatingMedia.load();
                    } catch { }
                }
                floatingMedia.remove();
                floatingMedia = null;
            }
            if (currentAudioIndicator && currentAudioIndicator.parentNode) {
                currentAudioIndicator.parentNode.removeChild(currentAudioIndicator);
                currentAudioIndicator = null;
            }
        }
        function getFullMediaSrc(thumbNode, filemime) {
            let thumbnailSrc = thumbNode.getAttribute("src");
            if (thumbnailSrc) {
                thumbnailSrc = thumbnailSrc.split('#')[0];
            }
            const parentA = thumbNode.closest("a.linkThumb, a.imgLink");
            const href = parentA ? parentA.getAttribute("href") : "";
            let fileWidth = parentA ? parseInt(parentA.getAttribute("data-filewidth"), 10) : null;
            let fileHeight = parentA ? parseInt(parentA.getAttribute("data-fileheight"), 10) : null;
            if ((!fileWidth || !fileHeight) && thumbNode.naturalWidth && thumbNode.naturalHeight) {
                fileWidth = thumbNode.naturalWidth;
                fileHeight = thumbNode.naturalHeight;
            }
            function hasExtension(str) {
                return /\.[a-z0-9]+$/i.test(str);
            }
            function isTThumb(str) {
                return /\/t_/.test(str);
            }
            function isDirectHash(str) {
                return /^\/\.media\/[a-f0-9]{40,}$/i.test(str) && !hasExtension(str);
            }
            function isSmallImage() {
                return (fileWidth && fileWidth <= 220) || (fileHeight && fileHeight <= 220);
            }
            function isBarePngNoThumb() {
                return (
                    filemime &&
                    filemime.toLowerCase() === "image/png" &&
                    parentA &&
                    !isTThumb(href) &&
                    !hasExtension(href)
                );
            }
            function isSmallBarePngSrc() {
                return (
                    isSmallImage() &&
                    filemime &&
                    filemime.toLowerCase() === "image/png" &&
                    !isTThumb(thumbnailSrc) &&
                    !hasExtension(thumbnailSrc)
                );
            }
            function isGenericThumb() {
                return (
                    /\/spoiler\.png$/i.test(thumbnailSrc) ||
                    /\/custom\.spoiler$/i.test(thumbnailSrc) ||
                    /\/audioGenericThumb\.png$/i.test(thumbnailSrc)
                );
            }
            if (!filemime) {
                if (
                    thumbNode.closest('.catalogCell') ||
                    /^\/\.media\/t?_[a-f0-9]{40,}$/i.test(thumbnailSrc.replace(/\\/g, ''))
                ) {
                    return thumbnailSrc;
                }
                return null;
            }
            if (isBarePngNoThumb()) {
                return thumbnailSrc;
            }
            if (isSmallBarePngSrc()) {
                return thumbnailSrc;
            }
            if (isSmallImage() && hasExtension(thumbnailSrc)) {
                return thumbnailSrc;
            }
            if (isTThumb(thumbnailSrc)) {
                let base = thumbnailSrc.replace(/\/t_/, "/");
                base = base.replace(/\.(jpe?g|jxl|png|apng|gif|avif|webp|webm|mp4|m4v|ogg|mp3|m4a|wav)$/i, "");
                if (filemime && (filemime.toLowerCase() === "image/apng" || filemime.toLowerCase() === "video/x-m4v")) {
                    return base;
                }

                const ext = filemime ? getExtensionForMimeType(filemime) : null;
                if (!ext) return null;
                return base + ext;
            }
            if (isDirectHash(thumbnailSrc)) {
                if (filemime && (filemime.toLowerCase() === "image/apng" || filemime.toLowerCase() === "video/x-m4v")) {
                    return thumbnailSrc;
                }
                const ext = filemime ? getExtensionForMimeType(filemime) : null;
                if (!ext) {
                    return thumbnailSrc;
                }
                return thumbnailSrc + ext;
            }
            if (isGenericThumb()) {
                if (parentA && parentA.getAttribute("href")) {
                    return sanitizeUrl(parentA.getAttribute("href"));
                }
                return null;
            }

            return null;
        }
        function leaveHandler() {
            cleanupFloatingMedia();
        }
        function mouseMoveHandler(ev) {
            lastMouseEvent = ev;
            positionFloatingMedia(ev);
        }
        async function onThumbEnter(e) {
            cleanupFloatingMedia();
            lastMouseEvent = e; 
            const thumb = e.currentTarget;
            let filemime = null, fullSrc = null, isVideo = false, isAudio = false;
            if (thumb.tagName === "IMG") {
                const parentA = thumb.closest("a.linkThumb, a.imgLink");
                if (!parentA) return;
                const href = parentA.getAttribute("href");
                if (!href) return;
                const ext = href.split(".").pop().toLowerCase();
                filemime =
                    parentA.getAttribute("data-filemime") ||
                    {
                        jpg: "image/jpeg",
                        jpeg: "image/jpeg",
                        jxl: "image/jxl",
                        png: "image/png",
                        apng: "image/apng",
                        gif: "image/gif",
                        avif: "image/avif",
                        webp: "image/webp",
                        bmp: "image/bmp",
                        mp4: "video/mp4",
                        webm: "video/webm",
                        m4v: "video/x-m4v",
                        ogg: "audio/ogg",
                        mp3: "audio/mpeg",
                        m4a: "audio/x-m4a",
                        wav: "audio/wav",
                    }[ext];
                fullSrc = getFullMediaSrc(thumb, filemime);
                if (
                    /custom\.spoiler$|spoiler\.png$/i.test(thumb.getAttribute("src") || "") &&
                    parentA && parentA.getAttribute("href")
                ) {
                    fullSrc = parentA.getAttribute("href");
                }
                isVideo = filemime && filemime.startsWith("video/");
                isAudio = filemime && filemime.startsWith("audio/");
            }
            fullSrc = sanitizeUrl(fullSrc);
            if (!fullSrc) return;
            let volume = 0.5;
            try {
                if (typeof getSetting === "function") {
                    const v = await getSetting("hoverVideoVolume");
                    if (typeof v === "number" && !isNaN(v)) {
                        volume = Math.max(0, Math.min(1, v / 100));
                    }
                }
            } catch { }

            if (isAudio) {
                const container = thumb.closest("a.linkThumb, a.imgLink");
                let audioSrc = fullSrc;
                if (
                    thumb.tagName === "IMG" &&
                    container &&
                    /audioGenericThumb\.png$/.test(thumb.getAttribute("src") || "") &&
                    container.getAttribute("href")
                ) {
                    audioSrc = container.getAttribute("href");
                }
                if (container && !container.style.position) {
                    container.style.position = "relative";
                }
                floatingMedia = document.createElement("audio");
                floatingMedia.src = audioSrc;
                floatingMedia.controls = false;
                floatingMedia.style.display = "none";
                floatingMedia.volume = volume;
                document.body.appendChild(floatingMedia);
                floatingMedia.play().catch(() => { });
                const indicator = document.createElement("div");
                indicator.classList.add("audio-preview-indicator");
                indicator.textContent = AUDIO_INDICATOR_TEXT;
                if (container) {
                    container.appendChild(indicator);
                }
                currentAudioIndicator = indicator;
                thumb.addEventListener("mouseleave", leaveHandler, { once: true });
                if (container) container.addEventListener("click", leaveHandler, { once: true });
                window.addEventListener("scroll", leaveHandler, { passive: true, once: true });
                cleanupFns.push(() => thumb.removeEventListener("mouseleave", leaveHandler));
                if (container) cleanupFns.push(() => container.removeEventListener("click", leaveHandler));
                cleanupFns.push(() => window.removeEventListener("scroll", leaveHandler));
                return;
            }
            let videoSrc = fullSrc;
            if (
                isVideo &&
                thumb.tagName === "IMG" &&
                thumb.closest("a.linkThumb, a.imgLink") &&
                (!/\.(mp4|webm|m4v)$/i.test(fullSrc) || /\/\.media\//.test(fullSrc) && !/\.(mp4|webm|m4v)$/i.test(fullSrc))
            ) {
                const parentA = thumb.closest("a.linkThumb, a.imgLink");
                if (parentA && parentA.getAttribute("href")) {
                    videoSrc = parentA.getAttribute("href");
                }
            }
            floatingMedia = isVideo ? document.createElement("video") : document.createElement("img");
            floatingMedia.src = isVideo ? videoSrc : fullSrc;
            floatingMedia.id = "hover-preview-media";
            floatingMedia.style.position = "fixed";
            floatingMedia.style.zIndex = "9999";
            floatingMedia.style.pointerEvents = "none";
            floatingMedia.style.opacity = MEDIA_OPACITY_LOADING;
            floatingMedia.style.left = "-9999px";
            floatingMedia.style.top = "-9999px";
            floatingMedia.style.maxWidth = MEDIA_MAX_WIDTH;
            const availableHeight = window.innerHeight * (1 - MEDIA_BOTTOM_MARGIN / 100);
            floatingMedia.style.maxHeight = `${availableHeight}px`;
            if (isVideo) {
                floatingMedia.autoplay = true;
                floatingMedia.loop = true;
                floatingMedia.muted = false;
                floatingMedia.playsInline = true;
                floatingMedia.volume = volume;
            }
            document.body.appendChild(floatingMedia);
            document.addEventListener("mousemove", mouseMoveHandler, { passive: true });
            thumb.addEventListener("mouseleave", leaveHandler, { passive: true, once: true });
            cleanupFns.push(() => document.removeEventListener("mousemove", mouseMoveHandler));
            if (lastMouseEvent) {
                positionFloatingMedia(lastMouseEvent);
            }
            if (isVideo) {
                floatingMedia.onloadeddata = function () {
                    if (floatingMedia) {
                        floatingMedia.style.opacity = MEDIA_OPACITY_LOADED;
                        if (lastMouseEvent) positionFloatingMedia(lastMouseEvent);
                    }
                };
            } else {
                floatingMedia.onload = function () {
                    if (floatingMedia) {
                        floatingMedia.style.opacity = MEDIA_OPACITY_LOADED;
                        if (lastMouseEvent) positionFloatingMedia(lastMouseEvent);
                    }
                };
            }
            floatingMedia.onerror = cleanupFloatingMedia;
            thumb.addEventListener("mouseleave", leaveHandler, { once: true });
            window.addEventListener("scroll", leaveHandler, { passive: true, once: true });
            cleanupFns.push(() => thumb.removeEventListener("mouseleave", leaveHandler));
            cleanupFns.push(() => window.removeEventListener("scroll", leaveHandler));
        }
        function attachThumbListeners(root = document) {
            root.querySelectorAll("a.linkThumb img, a.imgLink img").forEach(thumb => {
                if (!thumb._fullImgHoverBound) {
                    thumb.addEventListener("mouseenter", onThumbEnter);
                    thumb._fullImgHoverBound = true;
                }
            });
            if (
                root.tagName === "IMG" &&
                root.parentElement &&
                (root.parentElement.closest("a.linkThumb") || root.parentElement.closest("a.imgLink")) &&
                !root._fullImgHoverBound
            ) {
                root.addEventListener("mouseenter", onThumbEnter);
                root._fullImgHoverBound = true;
            }
        }
        attachThumbListeners();
        const divThreadsObs = observeSelector('#divThreads', { childList: true, subtree: true });
        if (divThreadsObs) {
            divThreadsObs.addHandler(function imageHoverHandler(mutations) {
                for (const mutation of mutations) {
                    for (const addedNode of mutation.addedNodes) {
                        if (addedNode.nodeType === 1) {
                            attachThumbListeners(addedNode);
                        }
                    }
                }
            });
        }
    }
    function getExtensionForMimeType(mime) {
        const map = {
            "image/jpeg": ".jpg",
            "image/jpg": ".jpg",
            "image/jxl": ".jxl",
            "image/png": ".png",
            "image/apng": ".png",
            "image/gif": ".gif",
            "image/avif": ".avif",
            "image/webp": ".webp",
            "image/bmp": ".bmp",
        };
        return map[mime.toLowerCase()] || "";
    }

    async function featureBlurSpoilers() {
        if (!(window.pageType?.isThread || window.pageType?.isIndex)) {
            return;
        }

        const removeSpoilers = await getSetting("blurSpoilers_removeSpoilers");
        function applyBlurOrRemoveSpoilers(img, removeSpoilers) {
            if (removeSpoilers) {
                img.style.filter = "";
                img.style.transition = "";
                img.style.border = "1px dotted var(--border-color)";
                img.onmouseover = null;
                img.onmouseout = null;
            } else {
                img.style.filter = "blur(5px)";
                img.style.transition = "filter 0.3s ease";
            }
        }

        function processImgLink(link) {
            if (link.dataset.blurSpoilerProcessed === "1") {
                return;
            }
            const img = link.querySelector("img");
            if (!img) {
                return;
            }
            if (
                /\/\.media\/[^\/]+?\.[a-zA-Z0-9]+$/.test(img.src) &&
                !/\/\.media\/t_[^\/]+?\.[a-zA-Z0-9]+$/.test(img.src)
            ) {
                link.dataset.blurSpoilerProcessed = "1";
                return;
            }
            const isCustomSpoiler = img.src.includes("/custom.spoiler")
                || img.src.includes("/*/custom.spoiler")
                || img.src.includes("/spoiler.png");
            const isNotThumbnail = !img.src.includes("/.media/t_");
            const hasFilenameExtension = !isCustomSpoiler && /\.[a-zA-Z0-9]+$/.test(img.src);

            if (isNotThumbnail || isCustomSpoiler) {
                let href = link.getAttribute("href");
                if (!href) {
                    link.dataset.blurSpoilerProcessed = "1";
                    return;
                }
                const match = href.match(/\/\.media\/([^\/]+)\.[a-zA-Z0-9]+$/);
                if (!match) {
                    link.dataset.blurSpoilerProcessed = "1";
                    return;
                }
                const fileMime = link.getAttribute("data-filemime") || "";
                const ext = getExtensionForMimeType(fileMime);
                let fileWidthAttr = link.getAttribute("data-filewidth");
                let fileHeightAttr = link.getAttribute("data-fileheight");
                let transformedSrc;
                if (
                    (fileWidthAttr && Number(fileWidthAttr) <= 220) ||
                    (fileHeightAttr && Number(fileHeightAttr) <= 220)
                ) {
                    if (fileMime && fileMime.startsWith('video/')) {
                        link.dataset.blurSpoilerProcessed = "1";
                        return;
                    }
                    transformedSrc = `/.media/${match[1]}${ext}`;
                } else if (!hasFilenameExtension && isCustomSpoiler) {
                    transformedSrc = `/.media/t_${match[1]}`;
                } else {
                    link.dataset.blurSpoilerProcessed = "1";
                    return;
                }
                if (isCustomSpoiler && !fileWidthAttr && !fileHeightAttr) {
                    const uploadCell = img.closest('.uploadCell');
                    if (uploadCell) {
                        const dimensionLabel = uploadCell.querySelector('.dimensionLabel');
                        if (dimensionLabel) {
                            const dimensions = dimensionLabel.textContent.trim().split(/x|×/);
                            if (dimensions.length === 2) {
                                const parsedWidth = parseInt(dimensions[0].trim(), 10);
                                const parsedHeight = parseInt(dimensions[1].trim(), 10);
                                if ((parsedWidth <= 220 || parsedHeight <= 220)) {
                                    img.src = href + "#spoiler";
                                    link.dataset.blurSpoilerProcessed = "1";
                                    applyBlurOrRemoveSpoilers(img, removeSpoilers);
                                    return;
                                }
                            }
                        }
                    }
                }
                const initialWidth = img.offsetWidth;
                const initialHeight = img.offsetHeight;
                img.style.width = initialWidth + "px";
                img.style.height = initialHeight + "px";
                img.src = transformedSrc + "#spoiler";
                img.addEventListener('load', function () {
                    img.style.width = img.naturalWidth + "px";
                    img.style.height = img.naturalHeight + "px";
                });

                applyBlurOrRemoveSpoilers(img, removeSpoilers);
                link.dataset.blurSpoilerProcessed = "1";
                return;
            }
            link.dataset.blurSpoilerProcessed = "1";
        }
        document.querySelectorAll("a.imgLink").forEach(link => processImgLink(link));
        let pendingImgLinks = new WeakSet();
        let debounceTimeout = null;
        function processPendingImgLinks() {
            const allLinks = document.querySelectorAll("a.imgLink");
            allLinks.forEach(link => {
                if (pendingImgLinks.has(link)) {
                    processImgLink(link);
                }
            });
            pendingImgLinks = new WeakSet(); 
            debounceTimeout = null;
        }
        const divThreadsObs = observeSelector('#divThreads', { childList: true, subtree: true });
        if (divThreadsObs) {
            divThreadsObs.addHandler(function blurSpoilersHandler(mutations) {
                for (const mutation of mutations) {
                    for (const addedNode of mutation.addedNodes) {
                        if (addedNode.nodeType !== 1) continue;
                        if (addedNode.classList && addedNode.classList.contains('imgLink')) {
                            pendingImgLinks.add(addedNode);
                        } else if (addedNode.querySelectorAll) {
                            addedNode.querySelectorAll('.imgLink').forEach(link => pendingImgLinks.add(link));
                        }
                    }
                }
                if (!debounceTimeout) {
                    debounceTimeout = setTimeout(processPendingImgLinks, 50);
                }
            });
        }
        const bodyObs = observeSelector('body', { childList: true, subtree: true });
        if (bodyObs) {
            bodyObs.addHandler(function quoteTooltipSpoilerHandler(mutations) {
                for (const mutation of mutations) {
                    for (const addedNode of mutation.addedNodes) {
                        if (addedNode.nodeType !== 1) continue;
                        if (addedNode.classList && addedNode.classList.contains('quoteTooltip')) {
                            addedNode.querySelectorAll('a.imgLink').forEach(link => processImgLink(link));
                        } else if (addedNode.querySelectorAll) {
                            addedNode.querySelectorAll('.quoteTooltip a.imgLink').forEach(link => processImgLink(link));
                        }
                    }
                }
            });
        }
        document.body.addEventListener("mouseover", function (e) {
            if (e.target.matches("a.imgLink img[style*='blur(5px)']")) {
                e.target.style.filter = "none";
            }
        });
        document.body.addEventListener("mouseout", function (e) {
            if (e.target.matches("a.imgLink img[style*='transition']")) {
                e.target.style.filter = "blur(5px)";
            }
        });
    }
    function featureAPNGStop() {
        if (window.pageType?.isCatalog) return;
        function createCanvasSnapshot(img) {
            const canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            return canvas;
        }
        function createOverlay(width, height) {
            const overlay = document.createElement('div');
            overlay.className = 'apng-overlay';
            overlay.style.width = width + 'px';
            overlay.style.height = height + 'px';
            return overlay;
        }
        function isAPNG(mime, src) {
            if (mime) {
                const lower = mime.toLowerCase();
                if (lower === 'image/apng' || lower === 'image/png') return true;
            }
            if (src && /\.(a?png)(\?.*)?$/i.test(src)) return true;
            return false;
        }
        function processThumb(img) {
            if (img.dataset.apngProcessed === '1') return;

            const link = img.closest('a.linkThumb, a.imgLink');
            if (!link) return;

            const mime = (link.getAttribute('data-filemime') || '').toLowerCase();
            const href = link.getAttribute('href') || '';

            if (!isAPNG(mime, href)) return;

            const width = parseInt(link.getAttribute('data-filewidth'), 10);
            const height = parseInt(link.getAttribute('data-fileheight'), 10);
            if (width > 220 || height > 220) return;

            if (!img.complete || img.naturalWidth === 0) {
                img.addEventListener('load', () => processThumb(img), { once: true });
                return;
            }

            img.dataset.apngProcessed = '1';

            const canvas = createCanvasSnapshot(img);
            canvas.className = 'apng-canvas-snapshot';

            img.style.visibility = 'hidden';

            const overlay = createOverlay(canvas.width, canvas.height);

            const wrapper = document.createElement('div');
            Object.assign(wrapper.style, {
                position: 'relative',
                display: 'inline-block',
                width: canvas.width + 'px',
                height: canvas.height + 'px',
                marginRight: '1em',
                marginBottom: '0.7em'
            });

            img.parentNode.insertBefore(wrapper, img);
            wrapper.append(img, canvas, overlay);

            overlay.addEventListener('click', () => {
                overlay.remove();
                canvas.remove();
                img.style.visibility = '';
            });

            ['mouseenter', 'mouseleave'].forEach(type => {
                overlay.addEventListener(type, e => {
                    img.dispatchEvent(new MouseEvent(type, {
                        bubbles: false,
                        cancelable: true,
                        clientX: e.clientX,
                        clientY: e.clientY
                    }));
                });
            });
        }
        const SEL = 'a.linkThumb img, a.imgLink img';
        document.querySelectorAll(SEL).forEach(processThumb);
        const obs = observeSelector('#divThreads', { childList: true, subtree: true });
        if (obs) {
            obs.addHandler(function apngStopHandler(mutations) {
                for (const m of mutations) {
                    for (const node of m.addedNodes) {
                        if (node.nodeType !== 1) continue;
                        if (node.matches && node.matches(SEL)) {
                            processThumb(node);
                        } else if (node.querySelectorAll) {
                            node.querySelectorAll(SEL).forEach(processThumb);
                        }
                    }
                }
            });
        }
    }
    async function featureMascots() {
        if (!(window.pageType?.isCatalog || window.pageType?.isThread || window.pageType?.isIndex)) {
            return;
        }
        const opacity = await getSetting("enableMascots_mascotOpacity") || 30;
        const urlsText = await getSetting("enableMascots_mascotUrls") || "";

        if (!urlsText.trim()) return;
        const urlLines = urlsText.split('\n');
        const trimmedUrls = urlLines.map(url => url.trim());
        const validUrls = trimmedUrls.filter(url => url && (url.startsWith('/') || url.startsWith('http')));
        const urls = validUrls.filter(url => /\.(png|apng|jpg|jpeg|gif|webp)$/i.test(url));

        if (urls.length === 0) {
            console.log('8chanSS: No valid mascot URLs found. Check that URLs start with / or http and have valid image extensions (.png, .jpg, .gif, etc.)');
            return;
        }
        const enableSidebar = await getSetting("enableSidebar");
        const leftSidebar = await getSetting("enableSidebar_leftSidebar");
        const randomIndex = Math.floor(Math.random() * urls.length);
        const selectedUrl = urls[randomIndex];

        const mascot = document.createElement('img');
        mascot.className = 'chSS-mascot';
        mascot.src = selectedUrl;
        mascot.style.opacity = opacity / 100;
        if (enableSidebar) {
            if (leftSidebar) {
                mascot.style.left = '0px';
                mascot.style.bottom = '0px';
                mascot.style.maxWidth = '312px';
            } else {
                mascot.style.right = '0px';
                mascot.style.bottom = '0px';
                mascot.style.maxWidth = '312px';
            }
        } else {
            mascot.style.right = '0px';
            mascot.style.bottom = '0px';
            mascot.style.maxWidth = '70vh';
        }

        document.body.appendChild(mascot);
        return () => {
            document.querySelectorAll('.chSS-mascot').forEach(mascot => {
                if (mascot.parentNode) {
                    mascot.parentNode.removeChild(mascot);
                }
            });
        };
    }
    function autoHideHeaderOnScroll() {
        const header = document.getElementById('dynamicHeaderThread');
        if (!header) return;
        const scrollThreshold = 50; 
        let lastScrollY = window.scrollY;
        let scrollDirection = 'none';
        let ticking = false;

        function updateHeaderVisibility() {
            const currentScrollY = window.scrollY;
            scrollDirection = currentScrollY > lastScrollY ? 'down' : 'up';
            lastScrollY = currentScrollY;
            const isNearTop = currentScrollY < 100;
            if (scrollDirection === 'up' || isNearTop) {
                header.classList.remove('nav-hidden');
            } else if (scrollDirection === 'down' && currentScrollY > scrollThreshold) {
                header.classList.add('nav-hidden');
            }

            ticking = false;
        }
        const style = document.createElement('style');
        style.textContent = `
            #dynamicHeaderThread {
                transition: transform 0.3s ease;
            }
            #dynamicHeaderThread.nav-hidden {
                transform: translateY(-100%);
            }
            :root.bottom-header #dynamicHeaderThread.nav-hidden {
                transform: translateY(100%);
            }
        `;
        document.head.appendChild(style);
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(updateHeaderVisibility);
                ticking = true;
            }
        }, { passive: true });
        updateHeaderVisibility();
    }
    const decodeHtmlEntitiesTwice = (() => {
        const txt = document.createElement('textarea');
        return function (html) {
            txt.innerHTML = html;
            const once = txt.value;
            txt.innerHTML = once;
            return txt.value;
        };
    })();
    function highlightMentions() {
        const watchedCells = document.querySelectorAll("#watchedMenu .watchedCell");
        const watchButton = document.querySelector(".opHead .watchButton");
        if (!watchedCells.length) return; 
        watchedCells.forEach((cell) => {
            const notification = cell.querySelector(".watchedNotification");
            if (!notification) return; 

            const labelLink = cell.querySelector(".watchedCellAnchor");
            if (!labelLink) return; 
            if (!labelLink.dataset.board) {
                const href = labelLink.getAttribute("href");
                const match = href?.match(/^(?:https?:\/\/[^\/]+)?\/([^\/]+)\//);
                if (match) {
                    labelLink.dataset.board = `/${match[1]}/ -`;
                }
                if (document.location.href.includes(href)) {
                    if (watchButton) {
                        watchButton.style.color = "var(--board-title-color)";
                        watchButton.title = "Watched";
                    }
                }
                const originalText = labelLink.textContent;
                const decodedText = decodeHtmlEntitiesTwice(originalText);
                if (labelLink.textContent !== decodedText) {
                    labelLink.textContent = decodedText;
                }
            }
            const repliesSpan = notification.querySelector(".watchedNotificationReplies");
            const yousSpan = notification.querySelector(".watchedNotificationYous");
            const hasYou = yousSpan && !yousSpan.classList.contains("hidden");
            const replyCount = repliesSpan ? repliesSpan.textContent.trim() : "";
            if (labelLink.dataset.mentionProcessed === "true") {
                return;
            }
            if (hasYou) {
                labelLink.style.color = "var(--board-title-color)";
                labelLink.style.fontWeight = "bold";
                if (repliesSpan) {
                    repliesSpan.style.color = "var(--board-title-color)";
                    repliesSpan.style.fontWeight = "";
                }
                if (yousSpan) {
                    yousSpan.style.color = "var(--board-title-color)";
                    yousSpan.style.fontWeight = "";
                }
            }
            else if (replyCount && /^\d+$/.test(replyCount)) {
                labelLink.style.color = "var(--link-color)";
                if (repliesSpan) {
                    repliesSpan.style.color = "var(--link-color)";
                    repliesSpan.style.fontWeight = "";
                }
            }
            labelLink.dataset.mentionProcessed = "true";
        });
    }
    highlightMentions();
    function highlightActiveWatchedThread() {
        const currentPath = window.pageType?.path;
        if (!currentPath) return;
        document.querySelectorAll('.watchedCellAnchor').forEach(link => {
            const watchedPath = link.getAttribute('href').replace(/#.*$/, '');
            const cell = link.closest('.watchedCell');
            const repliesSpan = cell?.querySelector('.watchedNotificationReplies');
            const yousSpan = cell?.querySelector('.watchedNotificationYous');
            
            if (watchedPath === currentPath) {
                link.classList.add('ss-active');
                link.style.fontWeight = "bold";
                if (repliesSpan) {
                    repliesSpan.style.fontWeight = "bold";
                }
                if (yousSpan) {
                    yousSpan.style.fontWeight = "bold";
                }
            } else {
                link.classList.remove('ss-active');
                link.style.fontWeight = "";
                if (repliesSpan) {
                    repliesSpan.style.fontWeight = "";
                }
                if (yousSpan) {
                    yousSpan.style.fontWeight = "";
                }
            }
        });
    }
    const watchedMenuObs = observeSelector('#watchedMenu', { childList: true, subtree: true });
    if (watchedMenuObs) {
        watchedMenuObs.addHandler(function highlightMentionsHandler() {
            highlightMentions();
            highlightActiveWatchedThread();
        });
    }
    async function featureWatchThreadOnReply() {
        if ((window.pageType?.isIndex || window.pageType?.isCatalog)) {
            return;
        }
        const getWatchButton = () => document.querySelector(".watchButton");
        function watchThreadIfNotWatched() {
            const btn = getWatchButton();
            if (btn && !btn.classList.contains("watched-active")) {
                btn.click(); 
                setTimeout(() => {
                    btn.classList.add("watched-active");
                }, 100);
            }
        }
        const submitButton = document.getElementById("qrbutton");
        if (submitButton) {
            submitButton.removeEventListener("click", submitButton._watchThreadHandler || (() => { }));
            submitButton._watchThreadHandler = async function () {
                if (await getSetting("watchThreadOnReply")) {
                    setTimeout(watchThreadIfNotWatched, 500); 
                }
            };
            submitButton.addEventListener("click", submitButton._watchThreadHandler);
        }

    }
    async function featureAlwaysShowTW() {
        if (!(await getSetting("alwaysShowTW"))) return;
        if ((await getSetting("alwaysShowTW_noPinInCatalog")) && window.pageType.isCatalog) return;

        const POSITION_STORAGE_KEY = "8chanSS_threadWatcherPosition";

        async function restorePosition() {
            const watchedMenu = document.getElementById("watchedMenu");
            if (!watchedMenu) return;

            try {
                const position = await getStoredObject(POSITION_STORAGE_KEY);
                if (position.left !== undefined && position.top !== undefined) {
                    watchedMenu.style.left = position.left + "px";
                    watchedMenu.style.top = position.top + "px";
                }
            } catch (err) {
                console.error("Failed to restore thread watcher position:", err);
            }
        }

        async function savePosition() {
            const watchedMenu = document.getElementById("watchedMenu");
            if (!watchedMenu) return;

            try {
                const left = parseInt(watchedMenu.style.left) || 0;
                const top = parseInt(watchedMenu.style.top) || 0;
                if (left > 0 || top > 0) {
                    await setStoredObject(POSITION_STORAGE_KEY, { left, top });
                }
            } catch (err) {
                console.error("Failed to save thread watcher position:", err);
            }
        }

        function showThreadWatcher() {
            const watchedMenu = document.getElementById("watchedMenu");
            if (watchedMenu) {
                restorePosition();
            }
        }
        const watcherButton = document.querySelector("#navLinkSpan > .jsOnly > .watcherButton");
        if (watcherButton) {
            watcherButton.click();
        }
        setTimeout(showThreadWatcher, 100);
        setTimeout(restorePosition, 500);
        const watchedMenuObs = observeSelector('#watchedMenu', { attributes: true, attributeFilter: ['style'] });
        if (watchedMenuObs) {
            let saveTimeout = null;
            watchedMenuObs.addHandler(function positionSaveHandler() {
                if (saveTimeout) clearTimeout(saveTimeout);
                saveTimeout = setTimeout(savePosition, 500);
            });
        }
    }
    (function markAllThreadsAsRead() {
        const handleDiv = document.querySelector('#watchedMenu > div.handle');
        if (!handleDiv) return;
        if (handleDiv.querySelector('.markAllRead')) return;
        const btn = document.createElement('span');
        btn.className = 'coloredIcon glowOnHover markAllRead';
        btn.title = 'Mark all threads as read';
        function hasUnreadThreads() {
            const watchedMenu = document.querySelector('#watchedMenu');
            if (!watchedMenu) return false;
            return watchedMenu.querySelector('.watchedNotification:not(.hidden) .watchedCellDismissButton:not(.markAllRead)') !== null;
        }
        function updateButtonState() {
            if (hasUnreadThreads()) {
                btn.classList.remove('disabled');
                btn.style.opacity = '1';
                btn.style.cursor = 'pointer';
                btn.title = 'Mark all threads as read';
            } else {
                btn.classList.add('disabled');
                btn.style.opacity = '0.5';
                btn.style.cursor = 'default';
                btn.title = 'No unread threads';
            }
        }
        function clickAllMarkAsReadButtons(watchedMenu) {
            const markButtons = watchedMenu.querySelectorAll('.watchedNotification:not(.hidden) .watchedCellDismissButton:not(.markAllRead)');
            markButtons.forEach(btn => {
                try {
                    btn.click();
                } catch (e) {
                    console.log("Error clicking button:", e);
                }
            });
            return markButtons.length;
        }
        function markAllThreadsAsReadWithRetry(retriesLeft, callback) {
            setTimeout(function () {
                const watchedMenu = document.querySelector('#watchedMenu');
                if (!watchedMenu) {
                    if (callback) callback();
                    return;
                }
                const clickedCount = clickAllMarkAsReadButtons(watchedMenu);
                if (clickedCount === 0) {
                    updateButtonState();
                    if (callback) callback();
                    return;
                }
                if (retriesLeft > 0) {
                    setTimeout(() => markAllThreadsAsReadWithRetry(retriesLeft - 1, callback), 200);
                } else if (callback) {
                    callback();
                }
            }, 100);
        }
        const watchedMenuObs = observeSelector('#watchedMenu > div.floatingContainer', { childList: true, subtree: true });
        if (watchedMenuObs) {
            const debouncedUpdate = debounce(updateButtonState, 100);
            watchedMenuObs.addHandler(function markAllThreadsAsReadHandler() {
                debouncedUpdate();
            });
        }
        updateButtonState();
        const closeBtn = handleDiv.querySelector('.close-btn');
        if (closeBtn) {
            handleDiv.insertBefore(btn, closeBtn);
        } else {
            handleDiv.appendChild(btn);
        }
        document.body.addEventListener('click', function (e) {
            const closeBtn = e.target.closest('#watchedMenu .close-btn');
            if (closeBtn) {
                const watchedMenu = document.getElementById("watchedMenu");
                if (watchedMenu) watchedMenu.style.display = "none";
                return;
            }
            const markAllBtn = e.target.closest('.markAllRead');
            if (markAllBtn) {
                e.preventDefault();
                e.stopPropagation();
                if (markAllBtn.style.pointerEvents === 'none' || markAllBtn.classList.contains('disabled') || markAllBtn.dataset.processing === 'true') return;
                markAllBtn.dataset.processing = 'true';
                markAllBtn.style.opacity = '0.5';
                markAllThreadsAsReadWithRetry(3, function () {
                    markAllBtn.dataset.processing = 'false';
                    updateButtonState();
                });
            }
        });
    })();
    function hashNavigation() {
        if (!window.pageType?.isThread) return;
        const processedLinks = new WeakSet();
        function addHashLinks(container = document) {
            const links = container.querySelectorAll('.panelBacklinks a, .altBacklinks a, .divMessage .quoteLink');
            links.forEach(link => {
                if (
                    processedLinks.has(link) ||
                    (link.nextSibling && link.nextSibling.classList && link.nextSibling.classList.contains('hash-link-container'))
                ) return;
                const hashSpan = document.createElement('span');
                hashSpan.textContent = ' #';
                hashSpan.className = 'hash-link';
                hashSpan.style.cursor = 'pointer';
                hashSpan.style.color = 'var(--navbar-text-color)';
                hashSpan.title = 'Scroll to post';
                const wrapper = document.createElement('span');
                wrapper.className = 'hash-link-container';
                wrapper.appendChild(hashSpan);

                link.insertAdjacentElement('afterend', wrapper);
                processedLinks.add(link);
            });
        }
        addHashLinks();
        const divThreadsObs = observeSelector('#divThreads', { childList: true, subtree: true });
        if (divThreadsObs) {
            const debouncedAddHashLinks = debounce(() => addHashLinks(), 25);
            divThreadsObs.addHandler(function hashNavigationHandler() {
                debouncedAddHashLinks();
            });
        }
        const postsContainer = document.getElementById('divThreads') || document.body;
        postsContainer.addEventListener('click', function (e) {
            if (e.target.classList.contains('hash-link')) {
                e.preventDefault();
                const link = e.target.closest('.hash-link-container').previousElementSibling;
                if (!link || !link.href) return;
                const hashMatch = link.href.match(/#(\d+)$/);
                if (!hashMatch) return;
                const postId = hashMatch[1];
                const safePostId = /^[0-9]+$/.test(postId) ? postId : null;
                if (!safePostId) return;
                const postElem = document.getElementById(safePostId);
                if (postElem) {
                    window.location.hash = `#${safePostId}`;
                    if (postElem.classList.contains('opCell')) {
                        const offset = 25; 
                        const rect = postElem.getBoundingClientRect();
                        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                        const targetY = rect.top + scrollTop - offset;
                        window.scrollTo({ top: targetY, behavior: "smooth" });
                    } else {
                        postElem.scrollIntoView({ behavior: "smooth", block: "center" });
                    }
                }
            }
        }, true);
    }
    function featureScrollArrows() {
        if (document.getElementById("scroll-arrow-up") || document.getElementById("scroll-arrow-down")) {
            return;
        }
        const upBtn = document.createElement("button");
        upBtn.id = "scroll-arrow-up";
        upBtn.className = "scroll-arrow-btn";
        upBtn.title = "Scroll to top";
        upBtn.innerHTML = "▲";
        upBtn.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
        const downBtn = document.createElement("button");
        downBtn.id = "scroll-arrow-down";
        downBtn.className = "scroll-arrow-btn";
        downBtn.title = "Scroll to bottom";
        downBtn.innerHTML = "▼";
        downBtn.addEventListener("click", () => {
            window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
        });

        document.body.appendChild(upBtn);
        document.body.appendChild(downBtn);
    }
    async function featureHideAnnouncement() {
        async function processElement(selector, settingKey, contentKey) {
            const el = document.querySelector(selector);
            if (!el) return;

            const content = (el.textContent || "").replace(/[^\w\s.,!?-]/g, ""); 
            const shouldHide = await GM.getValue(`8chanSS_${settingKey}`, "false") === "true";
            const storedContent = await GM.getValue(`8chanSS_${contentKey}`, null);
            const root = document.documentElement;

            if (shouldHide) {
                if (storedContent !== null && storedContent !== content) {
                    if (typeof window.setSetting === "function") {
                        await window.setSetting("hideAnnouncement", false);
                    }
                    await GM.setValue(`8chanSS_${settingKey}`, "false");
                    await GM.deleteValue(`8chanSS_${contentKey}`);
                    return;
                }
                root.classList.add("hide-announcement");
                await GM.setValue(`8chanSS_${contentKey}`, content);
            } else {
                root.classList.remove("hide-announcement");
                await GM.deleteValue(`8chanSS_${contentKey}`);
            }
        }

        await processElement("#dynamicAnnouncement", "hideAnnouncement", "announcementContent");
    }
    (async function featureBeepOnYou() {
        if (!divPosts) return;
        let audioContext = null;
        let audioContextReady = false;
        let audioContextPromise = null;
        function ensureAudioContextReady() {
            if (audioContextReady) return Promise.resolve();
            if (audioContextPromise) return audioContextPromise;

            audioContextPromise = new Promise((resolve) => {
                function resumeAudioContext() {
                    if (!audioContext) {
                        audioContext = new (window.AudioContext || window.webkitAudioContext)();
                    }
                    if (audioContext.state === 'suspended') {
                        audioContext.resume().then(() => {
                            audioContextReady = true;
                            window.removeEventListener('click', resumeAudioContext);
                            window.removeEventListener('keydown', resumeAudioContext);
                            resolve();
                        });
                    } else {
                        audioContextReady = true;
                        window.removeEventListener('click', resumeAudioContext);
                        window.removeEventListener('keydown', resumeAudioContext);
                        resolve();
                    }
                }
                window.addEventListener('click', resumeAudioContext);
                window.addEventListener('keydown', resumeAudioContext);
            });
            return audioContextPromise;
        }

        async function createBeepSound() {
            if (!(await getSetting("beepOnYou"))) {
                return;
            }
            await ensureAudioContextReady();

            return function playBeep() {
                try {
                    const oscillator = audioContext.createOscillator();
                    const gainNode = audioContext.createGain();

                    oscillator.type = 'sine';
                    oscillator.frequency.value = 550; 
                    gainNode.gain.value = 0.1; 

                    oscillator.connect(gainNode);
                    gainNode.connect(audioContext.destination);
                    oscillator.start();
                    setTimeout(() => {
                        oscillator.stop();
                    }, 100); 
                } catch (e) {
                    console.warn("Beep failed:", e);
                }
            };
        }
        window.originalTitle = document.title;
        window.isNotifying = false;
        let beepOnYouSetting = false;
        let notifyOnYouSetting = false;
        let customMsgSetting = "(!) ";
        let previousFaviconState = null;
        async function initSettings() {
            beepOnYouSetting = await getSetting("beepOnYou");
            notifyOnYouSetting = await getSetting("notifyOnYou");
            const customMsg = await getSetting("notifyOnYou_customMessage");
            if (customMsg) customMsgSetting = customMsg;
        }
        await initSettings();
        let playBeep = null;
        createBeepSound().then(fn => { playBeep = fn; });
        let scrollHandlerActive = false;
        async function notifyOnYou() {
            if (!window.isNotifying) {
                window.isNotifying = true;
                document.title = customMsgSetting + " " + window.originalTitle;
                if (await getSetting("customFavicon")) {
                    const { style, state } = faviconManager.getCurrentFaviconState();
                    if (state !== "notif") {
                        previousFaviconState = { style, state };
                    }
                    faviconManager.setFaviconStyle(style, "notif");
                }
            }
        }
        function setupNotificationScrollHandler() {
            if (scrollHandlerActive) return;
            scrollHandlerActive = true;
            const BOTTOM_OFFSET = 45;
            function checkScrollPosition() {
                if (!window.isNotifying) return;
                const scrollPosition = window.scrollY + window.innerHeight;
                const documentHeight = document.documentElement.scrollHeight;
                if (scrollPosition >= documentHeight - BOTTOM_OFFSET) {
                    document.title = window.originalTitle;
                    window.isNotifying = false;
                    const { state } = faviconManager.getCurrentFaviconState();
                    if (state === "notif" && previousFaviconState) {
                        faviconManager.setFaviconStyle(previousFaviconState.style, previousFaviconState.state);
                        previousFaviconState = null;
                    } else if (state === "notif") {
                        faviconManager.setFavicon("base");
                    }
                    window.removeEventListener('scroll', checkScrollPosition);
                    scrollHandlerActive = false;
                }
            }
            window.addEventListener('scroll', checkScrollPosition);
        }
        window.addEventListener("focus", () => {
            if (window.isNotifying) {
                setupNotificationScrollHandler();
            }
        });
        const divPostsObs = observeSelector('.divPosts', { childList: true, subtree: false });
        if (divPostsObs) {
            divPostsObs.addHandler(function beepOnYouHandler(mutations) {
                for (const mutation of mutations) {
                    for (const node of mutation.addedNodes) {
                        if (
                            node.nodeType === 1 &&
                            typeof node.matches === "function" &&
                            (node.matches('.postCell') || node.matches('.opCell')) &&
                            node.querySelector("a.quoteLink.you") &&
                            !node.closest('.innerPost')
                        ) {
                            if (beepOnYouSetting && playBeep) {
                                playBeep();
                            }
                            if (notifyOnYouSetting) {
                                notifyOnYou();
                                setupNotificationScrollHandler();
                            }
                        }
                    }
                }
            });
        }
        window.addEventListener("8chanSS_settingChanged", async (e) => {
            if (e.detail && e.detail.key) {
                const key = e.detail.key;
                if (key === "beepOnYou") {
                    beepOnYouSetting = await getSetting("beepOnYou");
                    createBeepSound().then(fn => { playBeep = fn; });
                } else if (key === "notifyOnYou") {
                    notifyOnYouSetting = await getSetting("notifyOnYou");
                } else if (key === "notifyOnYou_customMessage") {
                    const customMsg = await getSetting("notifyOnYou_customMessage");
                    if (customMsg) customMsgSetting = customMsg;
                }
            }
        });
    })();
    async function enhanceYouTubeLinks() {
        if (!(window.pageType?.isThread || window.pageType?.isIndex)) {
            return;
        }
        const ytThumbsEnabled = await getSetting("enhanceYoutube_ytThumbs");
        const ytTitleCache = {};
        const MAX_CACHE_SIZE = 350;
        const ORDER_KEY = "_order";
        const TRACKING_PARAMS = [
            "si", "feature", "ref", "fsi", "source",
            "utm_source", "utm_medium", "utm_campaign", "gclid", "gclsrc", "fbclid"
        ];
        const ytThumbCache = {};
        function loadCache() {
            try {
                const data = localStorage.getItem('ytTitleCache');
                if (data) {
                    const parsed = JSON.parse(data);
                    Object.assign(ytTitleCache, parsed);
                    if (!Array.isArray(ytTitleCache[ORDER_KEY])) {
                        ytTitleCache[ORDER_KEY] = [];
                    }
                } else {
                    ytTitleCache[ORDER_KEY] = [];
                }
            } catch (e) {
                ytTitleCache[ORDER_KEY] = [];
            }
        }
        function saveCache() {
            try {
                localStorage.setItem('ytTitleCache', JSON.stringify(ytTitleCache));
            } catch (e) { }
        }
        loadCache();
        function getYouTubeId(url) {
            try {
                const u = new URL(url);
                if (u.hostname === 'youtu.be') {
                    return u.pathname.slice(1);
                }
                if (u.hostname.endsWith('youtube.com')) {
                    if (u.pathname === '/watch') {
                        return u.searchParams.get('v');
                    }
                    const liveMatch = u.pathname.match(/^\/(live|embed|shorts)\/([a-zA-Z0-9_-]{11})/);
                    if (liveMatch) {
                        return liveMatch[2];
                    }
                }
            } catch (e) { }
            return null;
        }
        function sanitizeYouTubeId(videoId) {
            if (!videoId) return null;
            const match = videoId.match(/([a-zA-Z0-9_-]{11})/);
            return match ? match[1] : null;
        }
        function stripTrackingParams(url) {
            try {
                const u = new URL(url);
                let changed = false;
                const KEEP_PARAMS = new Set(['t', 'start']);
                TRACKING_PARAMS.forEach(param => {
                    if (u.searchParams.has(param) && !KEEP_PARAMS.has(param)) {
                        u.searchParams.delete(param);
                        changed = true;
                    }
                });
                if (u.hash && u.hash.includes('?')) {
                    const [hashPath, hashQuery] = u.hash.split('?');
                    const hashParams = new URLSearchParams(hashQuery);
                    let hashChanged = false;
                    TRACKING_PARAMS.forEach(param => {
                        if (hashParams.has(param) && !KEEP_PARAMS.has(param)) {
                            hashParams.delete(param);
                            hashChanged = true;
                        }
                    });
                    if (hashChanged) {
                        u.hash = hashParams.toString()
                            ? `${hashPath}?${hashParams.toString()}`
                            : hashPath;
                        changed = true;
                    }
                }
                return changed ? u.toString() : url;
            } catch (e) {
                return url;
            }
        }

        async function fetchYouTubeTitle(videoId) {
            const cleanId = sanitizeYouTubeId(videoId);
            if (!cleanId) return null;
            if (ytTitleCache.hasOwnProperty(cleanId)) {
                const idx = ytTitleCache[ORDER_KEY].indexOf(cleanId);
                if (idx !== -1) {
                    ytTitleCache[ORDER_KEY].splice(idx, 1);
                }
                ytTitleCache[ORDER_KEY].push(cleanId);
                saveCache();
                return ytTitleCache[cleanId];
            }
            try {
                const r = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${cleanId}&format=json`);
                if (!r.ok) return null;
                const data = await r.json();
                const title = data ? data.title : null;
                if (title) {
                    ytTitleCache[cleanId] = title;
                    ytTitleCache[ORDER_KEY].push(cleanId);
                    while (ytTitleCache[ORDER_KEY].length > MAX_CACHE_SIZE) {
                        const oldest = ytTitleCache[ORDER_KEY].shift();
                        delete ytTitleCache[oldest];
                    }
                    saveCache();
                }
                return title;
            } catch {
                return null;
            }
        }
        async function fetchAsDataURL(url) {
            return new Promise((resolve) => {
                GM.xmlHttpRequest({
                    method: "GET",
                    url: url,
                    responseType: "blob",
                    timeout: 8000,
                    onload: (response) => {
                        if (response.status === 200 && response.response) {
                            const reader = new FileReader();
                            reader.onloadend = () => resolve(reader.result);
                            reader.onerror = () => resolve(null);
                            reader.readAsDataURL(response.response);
                        } else {
                            resolve(null);
                        }
                    },
                    onerror: () => resolve(null),
                    ontimeout: () => resolve(null)
                });
            });
        }
        async function fetchYouTubeThumbnailAsDataURL(videoId) {
            if (ytThumbCache.hasOwnProperty(videoId)) {
                return ytThumbCache[videoId];
            }
            const webpUrl = `https://i.ytimg.com/vi_webp/${videoId}/hqdefault.webp`;
            const jpgUrl = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

            let dataUrl = await fetchAsDataURL(webpUrl);
            if (!dataUrl) {
                dataUrl = await fetchAsDataURL(jpgUrl);
            }
            ytThumbCache[videoId] = dataUrl;
            return dataUrl;
        }
        function addThumbnailHover(link, videoId) {
            if (link.dataset.ytThumbHover) return;
            link.dataset.ytThumbHover = "1";
            let thumbDiv = null;
            let lastImg = null;
            let lastHoverToken = 0;

            function showThumb(e) {
                if (!thumbDiv) {
                    thumbDiv = document.createElement('div');
                    thumbDiv.style.position = 'fixed';
                    thumbDiv.style.zIndex = 9999;
                    thumbDiv.style.pointerEvents = 'none';
                    thumbDiv.style.background = '#222';
                    thumbDiv.style.border = '1px solid #444';
                    thumbDiv.style.padding = '2px';
                    thumbDiv.style.borderRadius = '4px';
                    thumbDiv.style.boxShadow = '0 2px 8px rgba(0,0,0,0.4)';
                    thumbDiv.style.transition = 'opacity 0.1s';
                    thumbDiv.style.opacity = '0';
                    thumbDiv.style.maxWidth = '280px';
                    thumbDiv.style.maxHeight = '200px';

                    const img = document.createElement('img');
                    img.style.display = 'block';
                    img.style.maxWidth = '280px';
                    img.style.maxHeight = '200px';
                    img.style.borderRadius = '3px';
                    img.alt = "YouTube thumbnail";
                    img.src = "data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQv///wAAACH5BAEAAAMALAAAAAAQABAAAAIgjI+py+0Po5yUFQA7"; 

                    lastImg = img;
                    const hoverToken = ++lastHoverToken;

                    fetchYouTubeThumbnailAsDataURL(videoId).then(dataUrl => {
                        if (lastImg === img && hoverToken === lastHoverToken) {
                            if (dataUrl) {
                                img.src = dataUrl;
                            } else {
                                img.alt = "Failed to load thumbnail";
                            }
                        }
                    });

                    thumbDiv.appendChild(img);
                    document.body.appendChild(thumbDiv);

                    setTimeout(() => {
                        if (thumbDiv) thumbDiv.style.opacity = '1';
                    }, 10);
                }
                const top = Math.min(window.innerHeight - 130, e.clientY + 12);
                const left = Math.min(window.innerWidth - 290, e.clientX + 12);
                thumbDiv.style.top = `${top}px`;
                thumbDiv.style.left = `${left}px`;
            }

            function moveThumb(e) {
                if (thumbDiv) {
                    const top = Math.min(window.innerHeight - 130, e.clientY + 12);
                    const left = Math.min(window.innerWidth - 290, e.clientX + 12);
                    thumbDiv.style.top = `${top}px`;
                    thumbDiv.style.left = `${left}px`;
                }
            }

            function hideThumb() {
                lastHoverToken++;
                if (thumbDiv && thumbDiv.parentNode) {
                    thumbDiv.parentNode.removeChild(thumbDiv);
                    thumbDiv = null;
                }
                lastImg = null;
            }

            link.addEventListener('mouseenter', showThumb);
            link.addEventListener('mousemove', moveThumb);
            link.addEventListener('mouseleave', hideThumb);
        }

        function processLinks(root = document) {
            root.querySelectorAll('a[href*="youtu"]').forEach(link => {
                if (link.dataset.ytEnhanced) return;
                const videoId = getYouTubeId(link.href);
                const cleanId = sanitizeYouTubeId(videoId);
                if (!cleanId) return;
                link.dataset.ytEnhanced = "1";
                const cleanUrl = stripTrackingParams(link.href);
                if (cleanUrl !== link.href) {
                    link.href = cleanUrl;
                }
                fetchYouTubeTitle(cleanId).then(title => {
                    if (title) {
                        link.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" width="18" height="16" style="vertical-align:middle;margin-right:2px;"><path fill="#FF0000" d="M549.7 124.1c-6.3-23.7-24.9-42.4-48.6-48.6C456.5 64 288 64 288 64s-168.5 0-213.1 11.5c-23.7 6.3-42.4 24.9-48.6 48.6C16 168.5 16 256 16 256s0 87.5 10.3 131.9c6.3 23.7 24.9 42.4 48.6 48.6C119.5 448 288 448 288 448s168.5 0 213.1-11.5c23.7-6.3 42.4-24.9 48.6-48.6 10.3-44.4 10.3-131.9 10.3-131.9s0-87.5-10.3-131.9zM232 334.1V177.9L361 256 232 334.1z"/></svg><span></span> ${title}`;
                    }
                });
                if (ytThumbsEnabled) {
                    addThumbnailHover(link, cleanId);
                }
            });
        }
        processLinks(document);
        const divThreadsObs = observeSelector('#divThreads', { childList: true, subtree: true });
        if (divThreadsObs) {
            divThreadsObs.addHandler(function enhanceYoutubeLinksHandler(mutations) {
                for (const mutation of mutations) {
                    for (const addedNode of mutation.addedNodes) {
                        if (addedNode.nodeType === 1) {
                            processLinks(addedNode);
                        }
                    }
                }
            });
        }
    }
    async function featureLabelCreated12h() {
        if (window.pageType?.isCatalog) {
            return;
        }
        
        if (!(await getSetting("switchTimeFormat"))) {
            return;
        }

        function convertLabelCreatedSpan(span) {
            if (span.dataset.timeConverted === "1") return;
            const datetimeAttr = span.getAttribute('datetime');
            if (!datetimeAttr) return;

            try {
                const date = new Date(datetimeAttr);
                if (isNaN(date.getTime())) return;
                let hour = date.getHours();
                const min = date.getMinutes().toString().padStart(2, '0');
                const sec = date.getSeconds().toString().padStart(2, '0');
                const ampm = hour >= 12 ? 'PM' : 'AM';
                let hour12 = hour % 12;
                if (hour12 === 0) hour12 = 12;
                const originalText = span.textContent.trim();
                const datePartMatch = originalText.match(/^(.+?)\s+\d{1,2}:\d{2}:\d{2}/);
                if (!datePartMatch) {
                    span.textContent = `${hour12}:${min}:${sec} ${ampm}`;
                    span.dataset.timeConverted = "1";
                    return;
                }
                const datePart = datePartMatch[1].trim();
                const newText = datePart ? `${datePart} ${hour12}:${min}:${sec} ${ampm}` : `${hour12}:${min}:${sec} ${ampm}`;
                span.textContent = newText;
                span.dataset.timeConverted = "1";
            } catch (e) {
                console.error("Error converting labelCreated time:", e);
            }
        }
        function convertAllLabelCreated(root = document) {
            const timeElements = root.querySelectorAll('time.labelCreated');
            timeElements.forEach(convertLabelCreatedSpan);
        }
        setTimeout(convertAllLabelCreated, 100);

        const divPostsObs = observeSelector('.divPosts', { childList: true, subtree: true });
        if (divPostsObs) {
            divPostsObs.addHandler(function labelCreated12hHandler(mutations) {
                for (const mutation of mutations) {
                    for (const addedNode of mutation.addedNodes) {
                        if (addedNode.nodeType !== 1) continue;
                        if (addedNode.tagName === 'TIME' && 
                            addedNode.classList && addedNode.classList.contains('labelCreated')) {
                            convertLabelCreatedSpan(addedNode);
                        } else if (addedNode.querySelectorAll) {
                            addedNode.querySelectorAll('time.labelCreated').forEach(convertLabelCreatedSpan);
                        }
                    }
                }
            });
        }
    }
    function truncateFilenames(filenameLength) {
        if (window.pageType?.isCatalog) return;
        if (!divThreads) return;
        function processLinks(root = document) {
            const links = root.querySelectorAll('a.originalNameLink');
            links.forEach(link => {
                if (link.dataset.truncated === "1") return;
                const fullFilename = link.getAttribute('download');
                if (!fullFilename) return;
                const lastDot = fullFilename.lastIndexOf('.');
                if (lastDot === -1) return; 
                const name = fullFilename.slice(0, lastDot);
                const ext = fullFilename.slice(lastDot);
                let truncated = fullFilename;
                if (name.length > filenameLength) {
                    truncated = name.slice(0, filenameLength) + '(...)' + ext;
                }
                link.textContent = truncated;
                link.dataset.truncated = "1";
                link.dataset.fullFilename = fullFilename;
                link.dataset.truncatedFilename = truncated;
                link.title = fullFilename;
            });
        }
        processLinks(document);
        divThreads.addEventListener('mouseover', function (e) {
            const link = e.target.closest('a.originalNameLink');
            if (link && link.dataset.fullFilename) {
                link.textContent = link.dataset.fullFilename;
            }
        });
        divThreads.addEventListener('mouseout', function (e) {
            const link = e.target.closest('a.originalNameLink');
            if (link && link.dataset.truncatedFilename) {
                link.textContent = link.dataset.truncatedFilename;
            }
        });
        const divThreadsObs = observeSelector('#divThreads', { childList: true, subtree: true });
        if (divThreadsObs) {
            const debouncedProcess = debounce(() => processLinks(divThreads), 100);
            divThreadsObs.addHandler(function truncateFilenamesHandler() {
                debouncedProcess();
            });
        }
    }
    function threadInfoHeader() {
        const navHeader = document.querySelector('.navHeader');
        const navOptionsSpan = document.getElementById('navOptionsSpan');
        const postCountEl = document.getElementById('postCount');
        const userCountEl = document.getElementById('userCountLabel');
        const fileCountEl = document.getElementById('fileCount');

        if (!(navHeader && navOptionsSpan && postCountEl && userCountEl && fileCountEl)) return;

        function updateHeader() {
            const postCount = postCountEl.textContent || '0';
            const userCount = userCountEl.textContent || '0';
            const fileCount = fileCountEl.textContent || '0';
            let statsDisplay = navHeader.querySelector('.thread-stats-display');
            if (!statsDisplay) {
                statsDisplay = document.createElement('span');
                statsDisplay.className = 'thread-stats-display';
                statsDisplay.style.marginRight = '1px';
            }

            statsDisplay.innerHTML = `
        [ 
        <span class="statLabel">Posts: </span><span class="statNumb">${postCount}</span> | 
        <span class="statLabel">Users: </span><span class="statNumb">${userCount}</span> | 
        <span class="statLabel">Files: </span><span class="statNumb">${fileCount}</span>
        ]
        `;
            if (statsDisplay.parentNode && statsDisplay.parentNode !== navOptionsSpan) {
                statsDisplay.parentNode.removeChild(statsDisplay);
            }
            if (navOptionsSpan.firstChild !== statsDisplay) {
                navOptionsSpan.insertBefore(statsDisplay, navOptionsSpan.firstChild);
            }
        }
        updateHeader();
        const statSelectors = ['#postCount', '#userCountLabel', '#fileCount'];
        statSelectors.forEach(selector => {
            const statObs = observeSelector(selector, { childList: true, subtree: false, characterData: true });
            if (statObs) {
                const debouncedUpdate = debounce(updateHeader, 100);
                statObs.addHandler(function threadInfoHeaderHandler() {
                    debouncedUpdate();
                });
            }
        });
    }
    function mediaViewerPositioning() {
        localStorage.setItem("mediaViewer", "true");

        async function updateMediaViewerClass() {
            const mediaViewer = document.getElementById('media-viewer');
            if (!mediaViewer) return;

            const isEnabled = await getSetting("enableMediaViewer");
            if (!isEnabled) {
                mediaViewer.classList.remove('topright', 'topleft');
                return;
            }

            const viewerStyle = await getSetting("enableMediaViewer_viewerStyle");
            mediaViewer.classList.remove('topright', 'topleft');
            if (viewerStyle === 'topright' || viewerStyle === 'topleft') {
                mediaViewer.classList.add(viewerStyle);
            }
        }
        updateMediaViewerClass();
        const mediaViewerObs = observeSelector('#media-viewer', { childList: false, subtree: false });
        if (mediaViewerObs) {
            mediaViewerObs.addHandler(function mediaViewerPositioningHandler() {
                updateMediaViewerClass();
            });
        }
        const bodyObs = observeSelector('body', { childList: true, subtree: false });
        if (bodyObs) {
            bodyObs.addHandler(function bodyMediaViewerHandler(mutations) {
                for (const mutation of mutations) {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === 1 && node.id === 'media-viewer') {
                            updateMediaViewerClass();
                        }
                    }
                }
            });
        }
    }
    async function featureHighlightNewIds() {
        if (window.pageType?.isLast || window.pageType?.isCatalog) {
            return;
        }

        const hlStyle = await getSetting("highlightNewIds_idHlStyle");
        if (!divPosts) return;
        if (!document.querySelector('.spanId')) return;
        const styleClassMap = {
            moetext: "moeText",
            glow: "id-glow",
            dotted: "id-dotted"
        };
        const styleClass = styleClassMap[hlStyle] || "moeText"; 
        function highlightIds(root = divPosts) {
            const idFrequency = {};
            const labelSpans = root.querySelectorAll('.labelId');
            labelSpans.forEach(span => {
                const id = getRawIdFromLabelId(span);
                idFrequency[id] = (idFrequency[id] || 0) + 1;
            });
            const seen = {};
            labelSpans.forEach(span => {
                const id = getRawIdFromLabelId(span);
                span.classList.remove('moetext', 'id-glow', 'id-dotted');
                if (!seen[id]) {
                    seen[id] = true;
                    span.classList.add(styleClass);
                    span.title = idFrequency[id] === 1
                        ? "This ID appears only once."
                        : "This was the first occurrence of this ID.";
                } else {
                    span.title = "";
                }
            });
        }
        highlightIds();
        const divPostsObs = observeSelector('.divPosts', { childList: true, subtree: true });
        if (divPostsObs) {
            const debouncedHighlightIds = debounce(() => highlightIds(), 50);
            divPostsObs.addHandler(function highlightNewIdsHandler(mutations) {
                let needsUpdate = false;
                for (const mutation of mutations) {
                    for (const node of mutation.addedNodes) {
                        if (
                            node.nodeType === 1 &&
                            (node.matches?.('.labelId') || node.querySelector?.('.labelId'))
                        ) {
                            needsUpdate = true;
                            break;
                        }
                    }
                    if (needsUpdate) break;
                }
                if (needsUpdate) {
                    debouncedHighlightIds();
                }
            });
        }
    }
    async function featureShowIDCount() {
        if (!window.pageType?.isThread) return;
        if (!document.querySelector('.spanId')) return;
        const processedLabels = new WeakSet();

        function processIDLabels() {
            document.querySelectorAll('.labelId').forEach(label => {
                if (processedLabels.has(label)) {
                    return;
                }
                const originalMouseover = label.onmouseover;
                if (originalMouseover) {
                    originalMouseover.call(label);
                }

                const text = label.textContent;
                const match = text.match(/^(.+?)\s*\((\d+)\)$/);

                if (match) {
                    const idText = match[1].trim();
                    const count = match[2];
                    const separator = document.createElement('span');
                    separator.className = 'ss-id-separator';
                    separator.textContent = ' | ';

                    const countSpan = document.createElement('span');
                    countSpan.className = 'ss-id-count';
                    countSpan.textContent = count;
                    label.textContent = idText;
                    label.appendChild(separator);
                    label.appendChild(countSpan);
                    processedLabels.add(label);
                    label.onmouseover = null;
                    label.onmouseout = null;
                    label.addEventListener('mouseover', function (e) {
                        e.stopPropagation();
                        if (!this.querySelector('.ss-id-separator')) {
                            this.textContent = idText;
                            this.appendChild(separator.cloneNode(true));
                            this.appendChild(countSpan.cloneNode(true));
                        }
                    });

                    label.addEventListener('mouseout', function (e) {
                        e.stopPropagation();
                    });
                }
            });
        }
        setTimeout(processIDLabels, 50);
        const divThreadsObs = observeSelector('#divThreads', { childList: true, subtree: true });
        if (divThreadsObs) {
            const debouncedProcess = debounce(processIDLabels, 50);

            divThreadsObs.addHandler(function showIDCountHandler(mutations) {
                let hasNewLabels = false;

                for (const mutation of mutations) {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            if (node.classList?.contains('labelId')) {
                                hasNewLabels = true;
                                break;
                            } else if (node.querySelectorAll) {
                                const newLabels = node.querySelectorAll('.labelId');
                                if (newLabels.length > 0) {
                                    hasNewLabels = true;
                                    break;
                                }
                            }
                        }
                    }
                    if (hasNewLabels) break;
                }

                if (hasNewLabels) {
                    debouncedProcess();
                }
            });
        }
    }
    async function featureQuoteThreading() {
        const isEnabled = typeof getSetting === "function"
            ? await getSetting("quoteThreading")
            : true;

        if (!isEnabled) {
            document.querySelector('.quoteThreadingRefresh')?.remove();
            return;
        }
        function deduplicateCharacterIcons(movedPosts = null) {
            if (!document.querySelector('.characterIdIcon')) {
                return;
            }
            const postsToCheck = movedPosts || document.querySelectorAll('.postCell, .opCell');
            
            postsToCheck.forEach(post => {
                const spanIds = post.querySelectorAll('.spanId');
                spanIds.forEach(spanId => {
                    const icons = spanId.querySelectorAll('.characterIdIcon');
                    if (icons.length > 1) {
                        for (let i = 1; i < icons.length; i++) {
                            icons[i].remove();
                        }
                    }
                });
            });
        }
        function processPosts(posts) {
            const movedPosts = [];
            
            posts.forEach(post => {
                const backlinks = post.querySelectorAll('.panelBacklinks .backLink.postLink');

                backlinks.forEach(backlink => {
                    const targetUri = backlink.getAttribute('data-target-uri');
                    if (!targetUri) return;

                    const targetPostId = targetUri.split('#')[1];
                    if (!targetPostId) return;
                    
                    const targetPost = document.getElementById(targetPostId);

                    if (targetPost) {
                        let repliesContainer = post.nextElementSibling;
                        if (!repliesContainer?.classList.contains('threadedReplies')) {
                            repliesContainer = document.createElement('div');
                            repliesContainer.className = 'threadedReplies';
                            post.parentNode.insertBefore(repliesContainer, post.nextSibling);
                        }
                        if (!repliesContainer.contains(targetPost)) {
                            repliesContainer.appendChild(targetPost);
                            movedPosts.push(targetPost);
                        }
                    }
                });
            });
            setTimeout(() => deduplicateCharacterIcons(movedPosts.length > 0 ? movedPosts : null), 50);
        }
        function threadAllPosts() {
            processPosts(document.querySelectorAll('.divPosts .postCell'));
        }

        function threadNewPosts() {
            const allPosts = document.querySelectorAll('.divPosts .postCell');
            processPosts(Array.from(allPosts).slice(-5));
        }
        const divPostsObs = observeSelector('.divPosts', { childList: true, subtree: false });
        if (divPostsObs) {
            divPostsObs.addHandler(function quoteThreadingHandler(mutations) {
                for (const mutation of mutations) {
                    if (mutation.addedNodes.length) {
                        setTimeout(threadNewPosts, 50);
                    }
                }
            });
        }
        function addRefreshButton() {
            const replyButton = document.querySelector('.threadBottom .innerUtility #replyButton');
            if (!replyButton || replyButton.nextElementSibling?.classList.contains('quoteThreadingBtn')) return;

            const refreshBtn = document.createElement('a');
            refreshBtn.href = "#";
            refreshBtn.className = "quoteThreadingBtn";
            refreshBtn.title = "Refresh quote threading";
            refreshBtn.textContent = "ReThread";

            replyButton.after(' ', refreshBtn);

            refreshBtn.addEventListener('click', e => {
                e.preventDefault();
                threadAllPosts();
            });
        }
        setTimeout(() => {
            threadAllPosts();  
        }, 500);
        addRefreshButton();
    }
    function featureLastFifty() {
        if (!window.pageType?.isCatalog) return;
        if (!catalogDiv) return;
        function addLastLinkButtons(root = document) {
            root.querySelectorAll('.catalogCell').forEach(cell => {
                const linkThumb = cell.querySelector('.linkThumb');
                const threadStats = cell.querySelector('.threadStats');
                if (!linkThumb || !threadStats) return;

                const href = linkThumb.getAttribute('href');
                if (!href || !/\/res\//.test(href)) return;
                const lastHref = href.replace('/res/', '/last/');
                threadStats.querySelectorAll('.last-link-btn').forEach(btn => btn.remove());
                const span = document.createElement('span');
                span.className = 'last-link-btn';
                span.style.marginLeft = '0.5em';
                const a = document.createElement('a');
                a.href = lastHref;
                a.textContent = '[L]';
                a.title = 'Go to last 50 posts of this thread';
                a.style.textDecoration = 'none';
                a.style.fontWeight = 'bold';
                span.appendChild(a);
                const labelPage = threadStats.querySelector('.labelPage');
                if (labelPage && labelPage.parentNode) {
                    labelPage.parentNode.insertBefore(span, labelPage.nextSibling);
                } else {
                    threadStats.appendChild(span);
                }
            });
        }
        addLastLinkButtons(document);
        const catalogDivObs = observeSelector('.catalogDiv', { childList: true, subtree: false });
        if (catalogDivObs) {
            const debouncedUpdate = debounce(() => addLastLinkButtons(document), 50);
            catalogDivObs.addHandler(function lastFiftyHandler() {
                debouncedUpdate();
            });
        }
    }
    function featureToggleIdAsYours() {
        if (!window.pageType?.isThread) return;
        if (!document.querySelector('.spanId')) return;
        function getBoardName() {
            const postCell = document.querySelector('.postCell[data-boarduri], .opCell[data-boarduri]');
            if (postCell) return postCell.getAttribute('data-boarduri');
            const match = location.pathname.match(/^\/([^\/]+)\//);
            return match ? match[1] : 'unknown';
        }
        const BOARD_NAME = getBoardName();
        const T_YOUS_KEY = `${BOARD_NAME}-yous`;
        const MENU_ENTRY_CLASS = "toggleIdAsYoursMenuEntry";
        const MENU_SELECTOR = ".floatingList.extraMenu";
        function getYourPostNumbers() {
            try {
                const val = localStorage.getItem(T_YOUS_KEY);
                return val ? JSON.parse(val).map(Number) : [];
            } catch {
                return [];
            }
        }
        function setYourPostNumbers(arr) {
            localStorage.setItem(T_YOUS_KEY, JSON.stringify(arr.map(Number)));
        }
        document.body.addEventListener('click', function (e) {
            if (e.target.matches('.extraMenuButton')) {
                const postCell = e.target.closest('.postCell, .opCell');
                if (!postCell) return;
                setTimeout(() => {
                    let menu = e.target.parentNode.querySelector('.floatingList.extraMenu');
                    if (!menu) {
                        const menus = Array.from(document.querySelectorAll('.floatingList.extraMenu'));
                        menu = menus[menus.length - 1];
                    }
                    if (menu) {
                        menu.setAttribute('data-post-id', postCell.id);
                        const labelIdSpan = postCell.querySelector('.labelId');
                        if (labelIdSpan) {
                            menu.setAttribute('data-label-id', getRawIdFromLabelId(labelIdSpan));
                        }
                        addMenuEntries(menu.parentNode || menu);
                    }
                }, 0);
            }
        });

        function getLabelIdFromMenu(menu) {
            return menu.getAttribute('data-label-id') || null;
        }
        function toggleYouNameClassForId(labelId, add) {
            document.querySelectorAll('.postCell, .opCell').forEach(postCell => {
                const labelIdSpan = postCell.querySelector('.labelId');
                const rawId = getRawIdFromLabelId(labelIdSpan);
                if (rawId === labelId) {
                    const nameLink = postCell.querySelector(".linkName.noEmailName");
                    if (nameLink) {
                        nameLink.classList.toggle("youName", add);
                    }
                }
            });
        }
        function getAllPostNumbersForId(labelId) {
            const postNumbers = [];
            document.querySelectorAll('.divPosts .postCell').forEach(postCell => {
                const labelIdSpan = postCell.querySelector('.labelId');
                const rawId = getRawIdFromLabelId(labelIdSpan);
                if (rawId === labelId) {
                    const num = Number(postCell.id);
                    if (!isNaN(num)) postNumbers.push(num);
                }
            });
            return postNumbers;
        }
        function addMenuEntries(root = document) {
            root.querySelectorAll(MENU_SELECTOR).forEach(menu => {
                if (!menu.closest('.extraMenuButton')) return;
                const ul = menu.querySelector("ul");
                if (!ul || ul.querySelector("." + MENU_ENTRY_CLASS)) return;
                const menuButton = menu.closest('.extraMenuButton') || (menu.parentNode && menu.parentNode.querySelector('.extraMenuButton'));
                let labelId = null;
                if (menuButton) {
                    const innerPost = menuButton.closest('.innerPost, .innerOP');
                    const labelIdSpan = innerPost ? innerPost.querySelector('.labelId') : null;
                    if (labelIdSpan) {
                        labelId = getRawIdFromLabelId(labelIdSpan);
                    }
                }
                if (!labelId) {
                    labelId = getLabelIdFromMenu(menu);
                    if (!labelId) return;
                    labelId = labelId.split(/[|\\(]/)[0].trim();
                }
                menu.setAttribute('data-label-id', labelId);
                const yourPostNumbers = getYourPostNumbers();
                const postNumbersForId = getAllPostNumbersForId(labelId);
                const isMarked = postNumbersForId.length > 0 && postNumbersForId.every(num => yourPostNumbers.includes(num));

                const li = document.createElement("li");
                li.className = MENU_ENTRY_CLASS;
                li.style.cursor = "pointer";
                li.textContent = "Toggle ID as Yours";

                ul.appendChild(li);

                li.addEventListener("click", function (e) {
                    e.stopPropagation();
                    let labelId = menu.getAttribute('data-label-id');
                    if (!labelId) return;
                    labelId = labelId.split(/[|\(]/)[0].trim();
                    let yourPostNumbers = getYourPostNumbers();
                    const postNumbersForId = getAllPostNumbersForId(labelId);

                    if (postNumbersForId.length === 0) return;

                    const allMarked = postNumbersForId.every(num => yourPostNumbers.includes(num));
                    if (!allMarked) {
                        postNumbersForId.forEach(num => {
                            if (!yourPostNumbers.includes(num)) yourPostNumbers.push(num);
                        });
                        setYourPostNumbers(yourPostNumbers);
                        toggleYouNameClassForId(labelId, true);
                    } else {
                        yourPostNumbers = yourPostNumbers.filter(num => !postNumbersForId.includes(num));
                        setYourPostNumbers(yourPostNumbers);
                        toggleYouNameClassForId(labelId, false);
                    }
                });
                toggleYouNameClassForId(labelId, isMarked);
            });
        }
        window.addEventListener("storage", function (event) {
            if (event.key === T_YOUS_KEY) {
                const yourPostNumbers = getYourPostNumbers();
                document.querySelectorAll('.postCell, .opCell').forEach(postCell => {
                    const nameLink = postCell.querySelector(".linkName.noEmailName");
                    if (nameLink) {
                        const postNum = Number(postCell.id);
                        nameLink.classList.toggle("youName", yourPostNumbers.includes(postNum));
                    }
                });
            }
        });
        const divThreadsObs = observeSelector('#divThreads', { childList: true, subtree: true });
        if (divThreadsObs) {
            const debouncedObserverCallback = debounce((mutations) => {
                for (const mutation of mutations) {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType !== 1) continue;
                        if (node.matches && node.matches(MENU_SELECTOR)) {
                            if (!node.hasAttribute('data-label-id')) {
                                const btn = node.closest('.extraMenuButton');
                                const postCell = btn && btn.closest('.postCell, .opCell');
                                if (postCell) {
                                    const labelIdSpan = postCell.querySelector('.labelId');
                                    if (labelIdSpan) {
                                        node.setAttribute('data-label-id', getRawIdFromLabelId(labelIdSpan));
                                    }
                                }
                            }
                            addMenuEntries(node.parentNode || node);
                        } else if (node.querySelectorAll) {
                            node.querySelectorAll(MENU_SELECTOR).forEach(menu => {
                                if (!menu.hasAttribute('data-label-id')) {
                                    const btn = menu.closest('.extraMenuButton');
                                    const postCell = btn && btn.closest('.postCell, .opCell');
                                    if (postCell) {
                                        const labelIdSpan = postCell.querySelector('.labelId');
                                        if (labelIdSpan) {
                                            menu.setAttribute('data-label-id', getRawIdFromLabelId(labelIdSpan));
                                        }
                                    }
                                }
                                addMenuEntries(menu.parentNode || menu);
                            });
                        }
                    }
                }
            }, 100);
            divThreadsObs.addHandler(debouncedObserverCallback);
        }
        const yourPostNumbers = getYourPostNumbers();
        document.querySelectorAll('.postCell, .opCell').forEach(postCell => {
            const nameLink = postCell.querySelector(".linkName.noEmailName");
            if (nameLink) {
                const postNum = Number(postCell.id);
                nameLink.classList.toggle("youName", yourPostNumbers.includes(postNum));
            }
        });
    }
    async function featureSauceLinks() {
        if (!(window.pageType?.isThread || window.pageType?.isIndex)) {
            return;
        }
        const enabled = await getSetting("enableTheSauce");
        if (!enabled) return;
        const [
            iqdbEnabled,
            saucenaoEnabled,
            pixivEnabled
        ] = await Promise.all([
            getSetting("enableTheSauce_iqdb"),
            getSetting("enableTheSauce_saucenao"),
            getSetting("enableTheSauce_pixiv")
        ]);

        const services = [
            {
                key: "iqdb",
                label: "iqdb",
                enabled: iqdbEnabled,
                method: "post",
                url: "https://iqdb.org/",
                fileField: "file",
            },
            {
                key: "saucenao",
                label: "sauce",
                enabled: saucenaoEnabled,
                method: "post",
                url: "https://saucenao.com/search.php",
                fileField: "file",
            },
            {
                key: "pixiv",
                label: "pixiv",
                enabled: pixivEnabled,
                method: "pixiv",
            },
        ];
        function getImageUrl(detailDiv) {
            let imgSrc = null;
            const imageContainer = detailDiv.closest('.uploadCell, .postCell, .opCell');

            if (imageContainer) {
                const thumbImg = imageContainer.querySelector('.imgLink > img');
                const thumbSrc = thumbImg?.getAttribute("src");
                if (thumbImg && thumbSrc?.startsWith('/.media/t_')) {
                    imgSrc = thumbSrc;
                }
                if (!imgSrc) {
                    const imgLink = imageContainer.querySelector('.imgLink');
                    if (imgLink) {
                        imgSrc = imgLink.getAttribute('href');
                    }
                }
            }

            if (!imgSrc) {
                return null;
            }

            let origin = window.location.origin;
            if (imgSrc.startsWith("//")) {
                return window.location.protocol + imgSrc;
            } else if (imgSrc.startsWith("/")) {
                return origin + imgSrc;
            } else if (/^https?:\/\//.test(imgSrc)) {
                return imgSrc;
            } else {
                return origin + "/" + imgSrc;
            }
        }
        async function fetchImageBlob(url) {
            const response = await fetch(url);
            if (!response.ok) throw new Error("Failed to fetch image");
            return await response.blob();
        }
        function getPixivId(detailDiv) {
            const origNameLink = detailDiv.querySelector('.originalNameLink');
            if (!origNameLink) return null;
            const filename = origNameLink.getAttribute('download') || origNameLink.textContent;
            const match = filename && filename.match(/^(\d+)_p\d+\./);
            return match ? match[1] : null;
        }
        function submitImageToService({ url, fileField, file }) {
            const form = document.createElement("form");
            form.action = url;
            form.method = "POST";
            form.enctype = "multipart/form-data";
            form.target = "_blank";
            form.style.display = "none";

            const input = document.createElement("input");
            input.type = "file";
            input.name = fileField;
            form.appendChild(input);

            const dt = new DataTransfer();
            dt.items.add(file);
            input.files = dt.files;

            document.body.appendChild(form);
            form.submit();
            setTimeout(() => form.remove(), 10000);
        }
        function addSauceLinksToElement(detailDiv) {
            if (detailDiv.classList.contains('sauceLinksProcessed')) {
                return;
            }
            detailDiv.querySelectorAll('.sauceLinksContainer').forEach(el => el.remove());

            const imgUrl = getImageUrl(detailDiv);
            if (!imgUrl) {
                return;
            }

            const container = document.createElement('div');
            container.className = 'sauceLinksContainer';
            container.style.marginBottom = '3px';
            container.style.display = 'inline-flex';
            container.style.flexWrap = 'wrap';
            container.style.gap = '6px';

            let anyLink = false;

            services.forEach(service => {
                if (!service.enabled) {
                    return;
                }

                const a = document.createElement('a');
                a.className = 'sauceLink';
                a.target = '_blank';
                a.style.fontSize = '90%';
                a.textContent = service.label;

                if (service.method === "post") {
                    a.href = "#";
                    a.title = `Upload thumbnail to ${service.label}`;
                    a.addEventListener('click', async (e) => {
                        e.preventDefault();
                        try {
                            const blob = await fetchImageBlob(imgUrl);
                            const file = new File([blob], "image.png", { type: blob.type || "image/png" });
                            submitImageToService({ url: service.url, fileField: service.fileField, file });
                        } catch (err) {
                            callPageToast("Failed to upload thumbnail.", "red", 2500);
                        }
                    });
                } else if (service.method === "pixiv") {
                    const pixivId = getPixivId(detailDiv);
                    if (pixivId) {
                        a.href = `https://www.pixiv.net/artworks/${pixivId}`;
                        a.title = "Open Pixiv artwork";
                    } else {
                        return;
                    }
                }

                container.appendChild(a);
                anyLink = true;
            });

            if (anyLink) {
                detailDiv.classList.add('sauceLinksProcessed');
                detailDiv.after(container);
            }
        }
        function observeAllUploadDetails(container = document) {
            const details = container.querySelectorAll('.uploadDetails:not(.sauceLinksProcessed)');
            details.forEach(detailDiv => addSauceLinksToElement(detailDiv));
        }
        observeAllUploadDetails();

        const pendingUploadDetails = new Set();
        const debouncedProcessUploadDetails = debounce(() => {
            pendingUploadDetails.forEach(detailDiv => addSauceLinksToElement(detailDiv));
            pendingUploadDetails.clear();
        }, 50);

        const divPostsObs = observeSelector('.divPosts', { childList: true, subtree: true });
        if (divPostsObs) {
            divPostsObs.addHandler(function sauceLinksHandler(mutations) {
                for (const mutation of mutations) {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === 1) {
                            if (node.classList && node.classList.contains('uploadDetails')) {
                                pendingUploadDetails.add(node);
                            } else if (node.querySelectorAll) {
                                node.querySelectorAll('.uploadDetails:not(.sauceLinksProcessed)').forEach(n => pendingUploadDetails.add(n));
                            }
                        }
                    }
                }
                debouncedProcessUploadDetails();
            });
        }
        const bodyObs = observeSelector('body', { childList: true, subtree: true });
        if (bodyObs) {
            bodyObs.addHandler(function quoteTooltipSauceLinksHandler(mutations) {
                for (const mutation of mutations) {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType !== 1) continue;
                        if (node.classList && node.classList.contains('quoteTooltip')) {
                            node.querySelectorAll('.uploadDetails:not(.sauceLinksProcessed)').forEach(addSauceLinksToElement);
                        } else if (node.classList && node.classList.contains('innerPost')) {
                            node.querySelectorAll('.uploadDetails:not(.sauceLinksProcessed)').forEach(addSauceLinksToElement);
                        } else if (node.querySelectorAll) {
                            node.querySelectorAll('.quoteTooltip .uploadDetails:not(.sauceLinksProcessed)').forEach(addSauceLinksToElement);
                            node.querySelectorAll('.innerPost .uploadDetails:not(.sauceLinksProcessed)').forEach(addSauceLinksToElement);
                        }
                    }
                }
            });
        }
    }
    async function featureIdFiltering() {
        if (!window.pageType?.isThread) return;
        if (!divThreads) return;

        const postCellSelector = ".postCell, .opCell, .innerOP";
        const labelIdSelector = ".labelId";
        const hiddenClassName = "is-hidden-by-filter";
        let activeFilterColor = null;
        const showIdLinks = await getSetting("enableIdFilters_idViewMode");
        let floatingDiv = null;
        let outsideClickHandler = null;
        function closeFloatingDiv() {
            if (floatingDiv && floatingDiv.parentNode) {
                floatingDiv.parentNode.removeChild(floatingDiv);
                floatingDiv = null;
            }
            if (outsideClickHandler) {
                document.removeEventListener("mousedown", outsideClickHandler, true);
                outsideClickHandler = null;
            }
        }
        function removeNativeLabelIdOnClickHandlers() {
            document.querySelectorAll('.labelId').forEach(label => {
                if (label.hasAttribute('onclick')) {
                    label.removeAttribute('onclick');
                }
                if (typeof label.onclick === 'function') {
                    label.onclick = null;
                }
            });
        }
        function showIdList(id, clickedLabel) {
            closeFloatingDiv();
            const idToMatch = (id.match(/^[a-fA-F0-9]{6}/) || [id.trim()])[0];

            const threadsContainer = document.getElementById('divThreads');
            if (!threadsContainer) {
                return [];
            }

            const allPosts = Array.from(threadsContainer.querySelectorAll('.postCell, .opCell, .innerOP'));

            const matchingPosts = [];
            allPosts.forEach(postEl => {
                const label = postEl.querySelector('.labelId');
                const postId = postEl.id;
                if (label && postId) {
                    const labelId = (label.textContent.match(/^[a-fA-F0-9]{6}/) || [label.textContent.trim()])[0];
                    if (labelId === idToMatch) {
                        matchingPosts.push(postEl);
                    }
                }
            });
            const match = window.location.pathname.match(/^\/([^/]+)\/(res|last)\/(\d+)\.html/);
            const board = match ? match[1] : '';
            const thread = match ? match[3] : '';
            floatingDiv = document.createElement('div');
            floatingDiv.className = 'ss-idlinks-floating';
            const title = document.createElement('div');
            if (showIdLinks === "showIdLinksOnly") {
                title.textContent = `Posts by ID: ${idToMatch} (${matchingPosts.length})`;
                title.style.fontWeight = 'bold';
                title.style.marginBottom = '8px';
                floatingDiv.appendChild(title);
            }
            const linkContainer = document.createElement('div');
            if (showIdLinks === "showIdLinksVertical") {
                linkContainer.classList.add('ss-vertical-id-list');
                linkContainer.style.display = 'block';
            } else {
                linkContainer.style.display = 'flex';
            }
            linkContainer.style.flexWrap = 'wrap';
            linkContainer.style.gap = '0.3em';

            matchingPosts.forEach(postEl => {
                const postId = postEl.id;
                const link = document.createElement('a');
                link.className = 'quoteLink postLink';
                link.href = `/${board}/res/${thread}.html#${postId}`;
                link.textContent = `>>${postId}`;
                link.setAttribute('data-target-uri', `${board}/${thread}#${postId}`);
                link.onclick = function (e) {
                    e.preventDefault();
                    closeFloatingDiv();
                    const target = document.getElementById(postId);
                    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                };
                const wrapper = document.createElement('div');
                wrapper.className = 'innerPost';
                wrapper.dataset.uri = `${board}/${thread}#${postId}`;
                wrapper.appendChild(link);

                linkContainer.appendChild(wrapper);
            });
            floatingDiv.appendChild(linkContainer);
            document.body.appendChild(floatingDiv);
            const rect = clickedLabel.getBoundingClientRect();
            const floatWidth = 320;
            const floatHeight = floatingDiv.offsetHeight || 200;
            let left = rect.left + window.scrollX;
            let top = rect.bottom + window.scrollY + 4;
            if (left + floatWidth > window.innerWidth) left = Math.max(0, window.innerWidth - floatWidth - 10);
            if (top + floatHeight > window.scrollY + window.innerHeight) {
                top = rect.top + window.scrollY - floatHeight - 4;
                if (top < 0) top = 10; 
            }
            floatingDiv.style.top = `${top}px`;
            floatingDiv.style.left = `${left}px`;
            outsideClickHandler = function (e) {
                if (floatingDiv && !floatingDiv.contains(e.target)) {
                    closeFloatingDiv();
                }
            };
            setTimeout(() => {
                document.addEventListener("mousedown", outsideClickHandler, true);
            }, 0);
            return matchingPosts;
        }
        function applyFilter(targetRgbColor) {
            activeFilterColor = targetRgbColor;
            const cells = document.querySelectorAll(postCellSelector); 
            cells.forEach(cell => {
                const label = cell.querySelector(labelIdSelector);
                const matches = label && window.getComputedStyle(label).backgroundColor === targetRgbColor;
                cell.classList.toggle(hiddenClassName, !!targetRgbColor && !matches);
            });
        }
        function handleClick(event) {
            const clickedLabel = event.target.closest(labelIdSelector);
            if (clickedLabel && clickedLabel.closest(postCellSelector) && !clickedLabel.closest(".de-pview")) {
                if (showIdLinks === "showIdLinksOnly" || showIdLinks === "showIdLinksVertical") {
                    event.preventDefault();
                    event.stopPropagation();
                    event.stopImmediatePropagation();
                    if (clickedLabel.hasAttribute('onclick')) clickedLabel.removeAttribute('onclick');
                    if (typeof clickedLabel.onclick === 'function') clickedLabel.onclick = null;
                }

                const id = clickedLabel.textContent.trim();
                if (showIdLinks != "showPostsOfIdOnly") {
                    showIdList(id, clickedLabel);
                } else {
                    const clickedColor = window.getComputedStyle(clickedLabel).backgroundColor;
                    const rect = clickedLabel.getBoundingClientRect();
                    const cursorOffsetY = event.clientY - rect.top;
                    if (activeFilterColor === clickedColor) {
                        applyFilter(null); 
                    } else {
                        applyFilter(clickedColor);
                    }
                    clickedLabel.scrollIntoView({ behavior: "instant", block: "center" });
                    window.scrollBy(0, cursorOffsetY - rect.height / 2);
                }
            }
        }
        const debouncedHandleClick = debounce(handleClick, 50);
        document.body.addEventListener("click", debouncedHandleClick, true);
        if (showIdLinks === "showIdLinksOnly" || showIdLinks === "showIdLinksVertical") {
            removeNativeLabelIdOnClickHandlers();
        }
    }
    async function createSettingsMenu() {
        let menu = document.getElementById("8chanSS-menu");
        if (menu) return menu;
        menu = document.createElement("div");
        menu.id = "8chanSS-menu";
        menu.style.position = "fixed";
        menu.style.zIndex = "99999";
        menu.style.background = "var(--menu-color)";
        menu.style.color = "var(--text-color)";
        menu.style.borderColor = "1px solid var(--border-color)";
        menu.style.padding = "0";
        menu.style.boxShadow = "0 4px 16px rgba(0,0,0,0.25)";
        menu.style.display = "none";
        menu.style.minWidth = "220px";
        menu.style.width = "100%";
        menu.style.maxWidth = "470px";
        menu.style.fontFamily = "sans-serif";
        menu.style.userSelect = "none";
        function positionMenu() {
            const viewportWidth = window.innerWidth;
            const isMobile = viewportWidth < 768;
            
            if (isMobile) {
                menu.style.left = "50%";
                menu.style.transform = "translateX(-50%)";
                menu.style.top = "3rem";
                menu.style.maxWidth = "90vw"; 
            } else {
                menu.style.left = "35rem";
                menu.style.transform = "none";
                menu.style.top = "3rem";
                menu.style.maxWidth = "470px";
            }
        }
        positionMenu();
        window.addEventListener("resize", positionMenu);
        let isDragging = false,
            dragOffsetX = 0,
            dragOffsetY = 0;
        const header = document.createElement("div");
        header.style.display = "flex";
        header.style.justifyContent = "space-between";
        header.style.alignItems = "center";
        header.style.marginBottom = "0";
        header.style.cursor = "move";
        header.style.color = "var(--subject-color)";
        header.style.background = "var(--contrast-color)";
        header.style.padding = "1px 18px 1px";
        header.addEventListener("mousedown", function (e) {
            isDragging = true;
            const rect = menu.getBoundingClientRect();
            dragOffsetX = e.clientX - rect.left;
            dragOffsetY = e.clientY - rect.top;
            document.body.style.userSelect = "none";
        });
        document.addEventListener("mousemove", function (e) {
            if (!isDragging) return;
            let newLeft = e.clientX - dragOffsetX;
            let newTop = e.clientY - dragOffsetY;
            const menuRect = menu.getBoundingClientRect();
            const menuWidth = menuRect.width;
            const menuHeight = menuRect.height;
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            newLeft = Math.max(0, Math.min(newLeft, viewportWidth - menuWidth));
            newTop = Math.max(0, Math.min(newTop, viewportHeight - menuHeight));
            menu.style.left = newLeft + "px";
            menu.style.top = newTop + "px";
            menu.style.right = "auto";
        });
        document.addEventListener("mouseup", function () {
            isDragging = false;
            document.body.style.userSelect = "";
        });
        const title = document.createElement("span");
        title.textContent = "8chanSS Settings";
        title.style.fontWeight = "bold";
        header.appendChild(title);

        const closeBtn = document.createElement("button");
        closeBtn.textContent = "✕";
        closeBtn.style.background = "none";
        closeBtn.style.setProperty("background", "none", "important");
        closeBtn.style.border = "none";
        closeBtn.style.color = "var(--subject-color)";
        closeBtn.style.fontSize = "18px";
        closeBtn.style.cursor = "pointer";
        closeBtn.style.marginLeft = "10px";
        closeBtn.addEventListener("click", () => {
            menu.style.display = "none";
        });
        header.appendChild(closeBtn);

        menu.appendChild(header);
        const closeOnOutsideClick = (e) => {
            if (menu.style.display !== "none" && !menu.contains(e.target)) {
                const menuToggle = document.getElementById("8chanSS-icon");
                if (menuToggle && !menuToggle.contains(e.target)) {
                    menu.style.display = "none";
                }
            }
        };
        Object.defineProperty(menu.style, 'display', {
            set: function (value) {
                const oldValue = this.getPropertyValue('display');
                this.setProperty('display', value);
                if (oldValue === 'none' && value !== 'none') {
                    positionMenu(); 
                    setTimeout(() => { 
                        document.addEventListener('click', closeOnOutsideClick);
                    }, 10);
                }
                else if (oldValue !== 'none' && value === 'none') {
                    document.removeEventListener('click', closeOnOutsideClick);
                }
            },
            get: function () {
                return this.getPropertyValue('display');
            }
        });
        const tabNav = document.createElement("div");
        tabNav.style.display = "flex";
        tabNav.style.borderBottom = "1px solid #444";
        tabNav.style.background = "rgb(from var(--menu-color) r g b / 1)";
        const tabContent = document.createElement("div");
        tabContent.style.padding = "15px 16px";
        tabContent.style.maxHeight = "70vh";
        tabContent.style.overflowY = "auto";
        tabContent.style.scrollbarWidth = "thin";
        tabContent.style.fontSize = "smaller";
        const tempSettings = {};
        await Promise.all(
            Object.keys(flatSettings).map(async (key) => {
                tempSettings[key] = await getSetting(key);
            })
        );
        const tabContentCache = {};
        const shortcutsTabCache = { node: null };
        const tabs = {
            site: {
                label: "Site",
                content: tabContentCache.site || (tabContentCache.site = createTabContent("site", tempSettings)),
            },
            threads: {
                label: "Threads",
                content: tabContentCache.threads || (tabContentCache.threads = createTabContent("threads", tempSettings)),
            },
            catalog: {
                label: "Catalog",
                content: tabContentCache.catalog || (tabContentCache.catalog = createTabContent("catalog", tempSettings)),
            },
            styling: {
                label: "Style",
                content: tabContentCache.styling || (tabContentCache.styling = createTabContent("styling", tempSettings)),
            },
            miscel: {
                label: "Misc.",
                content: tabContentCache.miscel || (tabContentCache.miscel = createTabContent("miscel", tempSettings)),
            },
            shortcuts: {
                label: "⌨️",
                content: shortcutsTabCache.node || (shortcutsTabCache.node = createShortcutsTab()),
            },
        };
        Object.keys(tabs).forEach((tabId, index, arr) => {
            const tab = tabs[tabId];
            const tabButton = document.createElement("button");
            tabButton.textContent = tab.label;
            tabButton.dataset.tab = tabId;
            tabButton.style.background = index === 0 ? "var(--contrast-color)" : "transparent";
            tabButton.style.border = "none";
            tabButton.style.borderRight = "1px solid #444";
            tabButton.style.setProperty("border-left-radius", "0", "important");
            tabButton.style.color = "var(--text-color)";
            tabButton.style.padding = "8px 15px";
            tabButton.style.margin = "5px 0 0 0";
            tabButton.style.setProperty("border-top-right-radius", "0", "important");
            tabButton.style.setProperty("border-bottom-right-radius", "0", "important");
            tabButton.style.cursor = "pointer";
            tabButton.style.flex = "1";
            tabButton.style.fontSize = "14px";
            tabButton.style.transition = "background 0.2s";
            if (index === 0) {
                tabButton.style.setProperty("border-top-left-radius", "8px", "important");
                tabButton.style.setProperty("border-top-right-radius", "0", "important");
                tabButton.style.setProperty("border-bottom-left-radius", "0", "important");
                tabButton.style.setProperty("border-bottom-right-radius", "0", "important");
                tabButton.style.margin = "5px 0 0 5px";
            }
            if (index === arr.length - 1) {
                tabButton.style.setProperty("border-top-right-radius", "8px", "important");
                tabButton.style.setProperty("border-top-left-radius", "0", "important");
                tabButton.style.setProperty("border-bottom-left-radius", "0", "important");
                tabButton.style.setProperty("border-bottom-right-radius", "0", "important");
                tabButton.style.margin = "5px 5px 0 0";
                tabButton.style.borderRight = "none"; 
            }

            tabButton.addEventListener("click", () => {
                Object.values(tabs).forEach((t) => {
                    t.content.style.display = "none";
                });
                tab.content.style.display = "block";
                tabNav.querySelectorAll("button").forEach((btn) => {
                    btn.style.background = "transparent";
                });
                tabButton.style.background = "var(--contrast-color)";
            });

            tabNav.appendChild(tabButton);
        });

        menu.appendChild(tabNav);
        Object.values(tabs).forEach((tab, index) => {
            tab.content.style.display = index === 0 ? "block" : "none";
            tabContent.appendChild(tab.content);
        });

        menu.appendChild(tabContent);
        const buttonContainer = document.createElement("div");
        buttonContainer.style.display = "flex";
        buttonContainer.style.gap = "10px";
        buttonContainer.style.padding = "0 18px 15px";
        const saveBtn = document.createElement("button");
        saveBtn.textContent = "Save";
        saveBtn.style.setProperty("background", "#4caf50", "important");
        saveBtn.style.setProperty("color", "#fff", "important");
        saveBtn.style.border = "none";
        saveBtn.style.borderRadius = "4px";
        saveBtn.style.padding = "8px 18px";
        saveBtn.style.fontSize = "15px";
        saveBtn.style.cursor = "pointer";
        saveBtn.style.flex = "1";
        saveBtn.addEventListener("click", debounce(async function () {
            for (const key of Object.keys(tempSettings)) {
                await setSetting(key, tempSettings[key]);
            }
            saveBtn.textContent = "Saved!";
            setTimeout(() => {
                saveBtn.textContent = "Save";
            }, 900);
            setTimeout(() => {
                window.location.reload();
            }, 400);
        }, 50));
        buttonContainer.appendChild(saveBtn);
        const resetBtn = document.createElement("button");
        resetBtn.textContent = "Reset";
        resetBtn.style.setProperty("background", "#dd3333", "important");
        resetBtn.style.setProperty("color", "#fff", "important");
        resetBtn.style.border = "none";
        resetBtn.style.borderRadius = "4px";
        resetBtn.style.padding = "8px 18px";
        resetBtn.style.fontSize = "15px";
        resetBtn.style.cursor = "pointer";
        resetBtn.style.flex = "1";
        resetBtn.addEventListener("click", debounce(async function () {
            if (confirm("Reset all 8chanSS settings to defaults?")) {
                const keys = await GM.listValues();
                for (const key of keys) {
                    if (key.startsWith("8chanSS_")) {
                        await GM.deleteValue(key);
                    }
                }
                resetBtn.textContent = "Reset!";
                setTimeout(() => {
                    resetBtn.textContent = "Reset";
                }, 900);
                setTimeout(() => {
                    window.location.reload();
                }, 400);
            }
        }, 50));
        buttonContainer.appendChild(resetBtn);

        menu.appendChild(buttonContainer);
        const info = document.createElement("div");
        info.style.fontSize = "11px";
        info.style.padding = "0 18px 12px";
        info.style.opacity = "0.7";
        info.style.textAlign = "center";
        info.innerHTML = 'Press Save to apply changes. Page will reload. - <a href="https://github.com/otacoo/8chanSS/blob/main/CHANGELOG.md" target="_blank" title="Check the changelog." style="color: var(--link-color); text-decoration: underline dashed;">Ver. ' + VERSION + '</a>';
        menu.appendChild(info);

        document.body.appendChild(menu);
        return menu;
    }
    function createTabContent(category, tempSettings) {
        const container = document.createElement("div");
        const categorySettings = scriptSettings[category];
        let hiddenListContainer;

        Object.keys(categorySettings).forEach((key) => {
            const setting = categorySettings[key];
            if (setting.type === "separator") {
                const hr = document.createElement("hr");
                hr.style.border = "none";
                hr.style.borderTop = "1px solid #444";
                hr.style.margin = "12px 0";
                container.appendChild(hr);
                return;
            }
            if (setting.type === "title") {
                const title = document.createElement("div");
                title.textContent = setting.label;
                title.style.fontWeight = "bold";
                title.style.color = "var(--subject-title)";
                title.style.fontSize = "1rem";
                title.style.margin = "10px 0 6px 0";
                title.style.opacity = "0.9";
                container.appendChild(title);
                return;
            }
            if (setting.type === "button") {
                const button = document.createElement("button");
                button.textContent = setting.label;
                button.style.setProperty("background", "var(--contrast-color)", "important");
                button.style.color = "#fff";
                button.style.border = "none";
                button.style.borderRadius = "4px";
                button.style.padding = "8px 12px";
                button.style.cursor = "pointer";
                button.style.width = "100%";
                button.style.marginBottom = "10px";

                if (key === "saveWatchedThreads") {
                    button.addEventListener('click', async () => {
                        const watchedData = localStorage.getItem('watchedData');
                        if (watchedData) {
                            await GM.setValue('8chanSS_watchedData', watchedData);
                            callPageToast('Watched threads saved!', 'green', 2000);
                        } else {
                            callPageToast('No watched threads found in localStorage.', 'orange', 2500);
                        }
                    });
                } else if (key === "restoreWatchedThreads") {
                    button.addEventListener('click', async () => {
                        const savedData = await GM.getValue('8chanSS_watchedData', null);
                        if (savedData) {
                            localStorage.setItem('watchedData', savedData);
                            callPageToast('Watched threads restored. Please reload the page.', 'blue', 3000);
                        } else {
                            callPageToast('No saved watched threads found.', 'orange', 2500);
                        }
                    });
                } else if (key === "saveFavoriteBoards") {
                    button.addEventListener('click', async () => {
                        const favoriteBoardsData = localStorage.getItem('navBoardData');
                        if (favoriteBoardsData) {
                            await GM.setValue('8chanSS_savedFavoriteBoards', favoriteBoardsData);
                            callPageToast('Favorite boards saved!', 'green', 2000);
                        } else {
                            callPageToast('No favorite boards found in localStorage.', 'orange', 2500);
                        }
                    });
                } else if (key === "restoreFavoriteBoards") {
                    button.addEventListener('click', async () => {
                        const savedData = await GM.getValue('8chanSS_savedFavoriteBoards', null);
                        if (savedData) {
                            localStorage.setItem('navBoardData', savedData);
                            callPageToast('Favorite boards restored. Please reload the page.', 'blue', 3000);
                        } else {
                            callPageToast('No saved favorite boards found.', 'orange', 2500);
                        }
                    });
                }
                const isStorageButton = ["saveWatchedThreads", "restoreWatchedThreads", "saveFavoriteBoards", "restoreFavoriteBoards"].includes(key);
                
                if (isStorageButton) {
                    let storageContainer = container.querySelector('.storage-buttons-container');
                    if (!storageContainer) {
                        storageContainer = document.createElement("div");
                        storageContainer.className = "storage-buttons-container";
                        storageContainer.style.display = "grid";
                        storageContainer.style.gridTemplateColumns = "1fr 1fr";
                        storageContainer.style.gap = "10px";
                        storageContainer.style.marginBottom = "10px";
                        container.appendChild(storageContainer);
                        const separator = document.createElement("div");
                        separator.style.position = "absolute";
                        separator.style.left = "50%";
                        separator.style.top = "0";
                        separator.style.bottom = "0";
                        separator.style.width = "1px";
                        separator.style.background = "var(--border-color)";
                        separator.style.opacity = "0.6";
                        storageContainer.style.position = "relative";
                        storageContainer.appendChild(separator);
                    }
                    button.style.width = "100%";
                    button.style.marginBottom = "0";
                    
                    storageContainer.appendChild(button);
                } else {
                    container.appendChild(button);
                }
                return;
            }
            const parentRow = document.createElement("div");
            parentRow.style.display = "flex";
            parentRow.style.alignItems = "center";
            parentRow.style.marginBottom = "0px";
            if (key === "hoverVideoVolume" && setting.type === "number") {
                const label = document.createElement("label");
                label.htmlFor = "setting_" + key;
                label.textContent = setting.label + ": ";
                label.style.flex = "1";

                const sliderContainer = document.createElement("div");
                sliderContainer.style.display = "flex";
                sliderContainer.style.alignItems = "center";
                sliderContainer.style.flex = "1";

                const slider = document.createElement("input");
                slider.type = "range";
                slider.id = "setting_" + key;
                slider.min = setting.min;
                slider.max = setting.max;
                slider.value = Number(tempSettings[key]).toString();
                slider.style.flex = "unset";
                slider.style.width = "100px";
                slider.style.marginRight = "10px";

                const valueLabel = document.createElement("span");
                valueLabel.textContent = slider.value + "%";
                valueLabel.style.minWidth = "40px";
                valueLabel.style.textAlign = "right";

                slider.addEventListener("input", function () {
                    let val = Number(slider.value);
                    if (isNaN(val)) val = setting.default;
                    val = Math.max(setting.min, Math.min(setting.max, val));
                    slider.value = val.toString();
                    tempSettings[key] = val;
                    valueLabel.textContent = val + "%";
                });

                sliderContainer.appendChild(slider);
                sliderContainer.appendChild(valueLabel);

                parentRow.appendChild(label);
                parentRow.appendChild(sliderContainer);
                const wrapper = document.createElement("div");
                wrapper.style.marginBottom = "10px";
                wrapper.appendChild(parentRow);
                container.appendChild(wrapper);
                return; 
            }
            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.id = "setting_" + key;
            checkbox.checked =
                tempSettings[key] === true || tempSettings[key] === "true";
            checkbox.style.marginRight = "8px";
            const label = document.createElement("label");
            label.htmlFor = checkbox.id;
            label.textContent = setting.label;
            label.style.flex = "1";
            let chevron = null;
            let subOptionsContainer = null;
            if (setting?.subOptions) {
                chevron = document.createElement("span");
                chevron.className = "ss-chevron";
                chevron.innerHTML = "&#9654;"; 
                chevron.style.display = "inline-block";
                chevron.style.transition = "transform 0.2s";
                chevron.style.marginLeft = "6px";
                chevron.style.fontSize = "12px";
                chevron.style.userSelect = "none";
                chevron.style.transform = checkbox.checked
                    ? "rotate(90deg)"
                    : "rotate(0deg)";
            }
            checkbox.addEventListener("change", function () {
                tempSettings[key] = checkbox.checked;
                if (!setting?.subOptions) return;
                if (!subOptionsContainer) return;

                subOptionsContainer.style.display = checkbox.checked
                    ? "block"
                    : "none";

                if (!chevron) return;
                chevron.style.transform = checkbox.checked
                    ? "rotate(90deg)"
                    : "rotate(0deg)";
                if (key === "enableThreadHiding") {
                    const catalogFilterContainer = wrapper.querySelector("div[style*='background: var(--menu-color)']");
                    if (catalogFilterContainer) {
                        const subOptionEnabled = tempSettings["enableThreadHiding_enableCatalogFiltering"];
                        catalogFilterContainer.style.display = (checkbox.checked && subOptionEnabled) ? "block" : "none";
                    }
                }
            });

            parentRow.appendChild(checkbox);
            parentRow.appendChild(label);
            if (chevron) parentRow.appendChild(chevron);
            const wrapper = document.createElement("div");
            wrapper.style.marginBottom = "10px";

            wrapper.appendChild(parentRow);
            if (setting?.subOptions) {
                subOptionsContainer = document.createElement("div");
                subOptionsContainer.style.marginLeft = "25px";
                subOptionsContainer.style.marginTop = "5px";
                subOptionsContainer.style.display = checkbox.checked ? "block" : "none";

                Object.keys(setting.subOptions).forEach((subKey) => {
                    const subSetting = setting.subOptions[subKey];
                    const fullKey = `${key}_${subKey}`;

                    const subWrapper = document.createElement("div");
                    subWrapper.style.marginBottom = "5px";

                    if (subSetting.type === "text") {
                        const subLabel = document.createElement("label");
                        subLabel.htmlFor = "setting_" + fullKey;
                        subLabel.textContent = subSetting.label + ": ";

                        const subInput = document.createElement("input");
                        subInput.type = "text";
                        subInput.id = "setting_" + fullKey;
                        subInput.value = tempSettings[fullKey] || "";
                        subInput.maxLength = subSetting.maxLength;
                        subInput.style.width = "60px";
                        subInput.style.marginLeft = "2px";
                        subInput.placeholder = "(!) ";
                        subInput.addEventListener("input", function () {
                            let val = subInput.value.replace(/[<>"']/g, "");
                            if (val.length > subInput.maxLength) {
                                val = val.slice(0, subInput.maxLength);
                            }
                            subInput.value = val;
                            tempSettings[fullKey] = val;
                        });

                        subWrapper.appendChild(subLabel);
                        subWrapper.appendChild(subInput);
                    } else if (subSetting.type === "textarea") {
                        const subLabel = document.createElement("label");
                        subLabel.htmlFor = "setting_" + fullKey;
                        subLabel.textContent = subSetting.label + ": ";

                        const subTextarea = document.createElement("textarea");
                        subTextarea.id = "setting_" + fullKey;
                        subTextarea.value = tempSettings[fullKey] || "";
                        subTextarea.rows = subSetting.rows || 4;
                        subTextarea.style.width = "100%";
                        subTextarea.style.maxWidth = "385px";
                        subTextarea.style.margin = "5px 0 0";
                        subTextarea.placeholder = subSetting.placeholder || "";

                        subTextarea.addEventListener("input", function () {
                            tempSettings[fullKey] = subTextarea.value;
                        });

                        subWrapper.appendChild(subLabel);
                        subWrapper.appendChild(document.createElement("br"));
                        subWrapper.appendChild(subTextarea);
                    } else if (subSetting.type === "number") {
                        const subLabel = document.createElement("label");
                        subLabel.htmlFor = "setting_" + fullKey;
                        subLabel.textContent = subSetting.label + ": ";

                        const subInput = document.createElement("input");
                        subInput.type = "number";
                        subInput.id = "setting_" + fullKey;
                        subInput.value = tempSettings[fullKey] || subSetting.default;
                        if (subSetting.min !== undefined) subInput.min = subSetting.min;
                        if (subSetting.max !== undefined) subInput.max = subSetting.max;
                        subInput.style.width = "60px";
                        subInput.style.marginLeft = "2px";

                        subInput.addEventListener("input", function () {
                            let val = Number(subInput.value);
                            if (isNaN(val)) val = subSetting.default;
                            if (subSetting.min !== undefined) val = Math.max(subSetting.min, val);
                            if (subSetting.max !== undefined) val = Math.min(subSetting.max, val);
                            subInput.value = val;
                            tempSettings[fullKey] = val;
                        });

                        subWrapper.appendChild(subLabel);
                        subWrapper.appendChild(subInput);
                    } else if (subSetting.type === "select") {
                        const subSelect = document.createElement("select");
                        subSelect.id = "setting_" + fullKey;
                        subSelect.style.marginLeft = "5px";
                        subSelect.style.width = "120px";
                        if (Array.isArray(subSetting.options)) {
                            subSetting.options.forEach(option => {
                                const optionEl = document.createElement("option");
                                optionEl.value = option.value;
                                optionEl.textContent = option.label;
                                if (tempSettings[fullKey] === option.value) {
                                    optionEl.selected = true;
                                }
                                subSelect.appendChild(optionEl);
                            });
                        }
                        if (!subSelect.value && subSetting.default) {
                            subSelect.value = subSetting.default;
                            tempSettings[fullKey] = subSetting.default;
                        }
                        subSelect.addEventListener("change", function () {
                            tempSettings[fullKey] = subSelect.value;
                            if (key === "customFavicon" && tempSettings["customFavicon"]) {
                                faviconManager.setFaviconStyle(subSelect.value, "base");
                            }
                            if (key === "faviconStyle" && tempSettings["customFavicon"]) {
                                faviconManager.setFaviconStyle(subSelect.value, "base");
                            }
                        });

                        const subLabel = document.createElement("label");
                        subLabel.htmlFor = "setting_" + fullKey;
                        subLabel.textContent = subSetting.label || fullKey;
                        subLabel.style.marginLeft = "10px";

                        subWrapper.appendChild(subLabel);
                        subWrapper.appendChild(subSelect);
                    } else {
                        const subCheckbox = document.createElement("input");
                        subCheckbox.type = "checkbox";
                        subCheckbox.id = "setting_" + fullKey;
                        subCheckbox.checked = tempSettings[fullKey];
                        subCheckbox.style.marginRight = "8px";

                        subCheckbox.addEventListener("change", function () {
                            tempSettings[fullKey] = subCheckbox.checked;
                            if (fullKey === "enableThreadHiding_enableCatalogFiltering") {
                                const catalogFilterContainer = wrapper.querySelector("div[style*='background: var(--menu-color)']");
                                if (catalogFilterContainer) {
                                    const mainOptionEnabled = tempSettings["enableThreadHiding"];
                                    catalogFilterContainer.style.display = (mainOptionEnabled && subCheckbox.checked) ? "block" : "none";
                                }
                            }
                        });

                        const subLabel = document.createElement("label");
                        subLabel.htmlFor = subCheckbox.id;
                        subLabel.textContent = subSetting.label;

                        subWrapper.appendChild(subCheckbox);
                        subWrapper.appendChild(subLabel);
                    }
                    subOptionsContainer.appendChild(subWrapper);
                });

                wrapper.appendChild(subOptionsContainer);
            }
            if (key === "enableThreadHiding" && setting?.subOptions?.enableCatalogFiltering) {
                const catalogFilterContainer = document.createElement("div");
                catalogFilterContainer.style.display = (tempSettings["enableThreadHiding"] 
                    && tempSettings["enableThreadHiding_enableCatalogFiltering"]) ? "block" : "none";
                catalogFilterContainer.style.margin = "10px 0";
                catalogFilterContainer.style.maxHeight = "300px";
                catalogFilterContainer.style.overflowY = "auto";
                catalogFilterContainer.style.background = "var(--menu-color)";
                catalogFilterContainer.style.border = "1px solid var(--border-color)";
                catalogFilterContainer.style.borderRadius = "6px";
                catalogFilterContainer.style.padding = "8px";
                catalogFilterContainer.style.fontSize = "13px";
                const filterTitle = document.createElement("div");
                filterTitle.innerHTML = "Use <strong>*</strong> as wildcard: <strong>word</strong> (exact), <strong>word*</strong> (starts with), <strong>*word</strong> (ends with), <strong>*word*</strong> (contains)";
                filterTitle.style.fontSize = "10px";
                filterTitle.style.marginBottom = "5px";
                filterTitle.style.color = "var(--text-color)";
                catalogFilterContainer.appendChild(filterTitle);
                const filtersContainer = document.createElement("div");
                filtersContainer.id = "catalog-filters-container";
                catalogFilterContainer.appendChild(filtersContainer);
                const addFilterBtn = document.createElement("button");
                addFilterBtn.textContent = "Add New Filter";
                addFilterBtn.style.background = "var(--contrast-color)";
                addFilterBtn.style.color = "#fff";
                addFilterBtn.style.border = "none";
                addFilterBtn.style.borderRadius = "4px";
                addFilterBtn.style.padding = "6px 12px";
                addFilterBtn.style.cursor = "pointer";
                addFilterBtn.style.marginTop = "8px";
                addFilterBtn.style.width = "100%";
                function createFilterRow(filterData = null) {
                    const filterRow = document.createElement("div");
                    filterRow.style.display = "flex";
                    filterRow.style.alignItems = "center";
                    filterRow.style.gap = "6px";
                    const wordInput = document.createElement("input");
                    wordInput.type = "text";
                    wordInput.placeholder = "Filter word";
                    wordInput.style.flex = "1";
                    wordInput.style.padding = "4px 8px";
                    wordInput.style.border = "1px solid var(--border-color)";
                    wordInput.style.borderRadius = "4px";
                    wordInput.style.background = "var(--background-color)";
                    wordInput.style.color = "var(--text-color)";
                    if (filterData) wordInput.value = filterData.word;
                    const boardsInput = document.createElement("input");
                    boardsInput.type = "text";
                    boardsInput.placeholder = "Boards (comma-separated, leave empty for all)";
                    boardsInput.style.flex = "2";
                    boardsInput.style.padding = "4px 8px";
                    boardsInput.style.border = "1px solid var(--border-color)";
                    boardsInput.style.borderRadius = "4px";
                    boardsInput.style.background = "var(--background-color)";
                    boardsInput.style.color = "var(--text-color)";
                    if (filterData) boardsInput.value = filterData.boards;
                    const removeBtn = document.createElement("button");
                    removeBtn.textContent = "✕";
                    removeBtn.style.background = "none";
                    removeBtn.style.border = "none";
                    removeBtn.style.color = "#c00";
                    removeBtn.style.cursor = "pointer";
                    function saveFilterData() {
                        const word = wordInput.value.trim();
                        const boards = boardsInput.value.trim();
                        if (word) {
                            const filterKey = `filter_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                            const filterData = { word, boards, key: filterKey };
                            tempSettings[filterKey] = filterData;
                            saveCatalogFilters();
                        }
                    }
                    wordInput.addEventListener("blur", saveFilterData);
                    boardsInput.addEventListener("blur", saveFilterData);
                    removeBtn.addEventListener("click", (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        filterRow.remove();
                        saveCatalogFilters();
                    });

                    filterRow.appendChild(wordInput);
                    filterRow.appendChild(boardsInput);
                    filterRow.appendChild(removeBtn);

                    return filterRow;
                }
                async function loadCatalogFilters() {
                    const filters = await getStoredObject("8chanSS_catalogFilters");
                    filtersContainer.innerHTML = "";
                    if (filters && Object.keys(filters).length > 0) {
                        Object.values(filters).forEach(filterData => {
                            const filterRow = createFilterRow(filterData);
                            filtersContainer.appendChild(filterRow);
                        });
                    }
                }
                async function saveCatalogFilters() {
                    const filters = {};
                    const filterRows = filtersContainer.querySelectorAll("div[style*='display: flex']");
                    filterRows.forEach(row => {
                        const wordInput = row.querySelector("input:first-child");
                        const boardsInput = row.querySelector("input:nth-child(2)");
                        if (wordInput && wordInput.value.trim()) {
                            const filterKey = `filter_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
                            filters[filterKey] = {
                                word: wordInput.value.trim(),
                                boards: boardsInput.value.trim(),
                                key: filterKey
                            };
                        }
                    });
                    await setStoredObject("8chanSS_catalogFilters", filters);
                }
                addFilterBtn.addEventListener("click", () => {
                    const filterRow = createFilterRow();
                    filtersContainer.appendChild(filterRow);
                });

                catalogFilterContainer.appendChild(addFilterBtn);
                loadCatalogFilters();
                wrapper.appendChild(catalogFilterContainer);
            }

            container.appendChild(wrapper);
        });

        return container;
    }
    const themeSelector = document.getElementById("themeSelector");
    const sidebarMenu = document.querySelector("#hamburger-menu-icon #sidebar-menu");
    let link = null;
    let openBracketSpan = null;
    let closeBracketSpan = null;
    const isDesktop = themeSelector && window.getComputedStyle(themeSelector).display !== "none";
    if (!isDesktop && sidebarMenu) {
        if (!document.getElementById("8chanSS-icon-mobile")) {
            const listItem = document.createElement("li");
            listItem.className = "jsOnly";
            const mobileLink = document.createElement("a");
            mobileLink.id = "8chanSS-icon-mobile";
            mobileLink.href = "#";
            mobileLink.className = "coloredIcon settingsButton";
            mobileLink.textContent = "8chanSS";
            mobileLink.title = "Open 8chanSS settings";
            listItem.appendChild(mobileLink);
            const settingsButton = sidebarMenu.querySelector("a.settingsButton");
            if (settingsButton && settingsButton.id !== "8chanSS-icon-mobile" && settingsButton.parentElement) {
                settingsButton.parentElement.insertAdjacentElement("afterend", listItem);
            } else {
                const firstUl = sidebarMenu.querySelector("ul");
                if (firstUl) {
                    firstUl.appendChild(listItem);
                }
            }
            mobileLink.style.cursor = "pointer";
            mobileLink.addEventListener("click", async function (e) {
                e.preventDefault();
                let menu = await createSettingsMenu();
                menu.style.display = menu.style.display === "none" ? "block" : "none";
            });
        }
    }
    if (isDesktop && themeSelector) {
        openBracketSpan = document.createElement("span");
        openBracketSpan.textContent = " [";
        link = document.createElement("a");
        link.id = "8chanSS-icon";
        link.href = "#";
        link.textContent = "8chanSS";
        link.style.fontWeight = "bold";

        themeSelector.parentNode.insertBefore(
            openBracketSpan,
            themeSelector.nextSibling
        );
        themeSelector.parentNode.insertBefore(link, openBracketSpan.nextSibling);
        
        closeBracketSpan = document.createElement("span");
        closeBracketSpan.textContent = "\u00A0]";
        themeSelector.parentNode.insertBefore(closeBracketSpan, link.nextSibling);
    }
    function createShortcutsTab() {
        const container = document.createElement("div");
        const title = document.createElement("h3");
        title.textContent = "Keyboard Shortcuts";
        title.style.margin = "0 0 15px 0";
        title.style.fontSize = "16px";
        container.appendChild(title);
        const table = document.createElement("table");
        table.style.width = "100%";
        table.style.borderCollapse = "collapse";
        const tableStyles = {
            th: {
                textAlign: "left",
                padding: "8px 5px",
                borderBottom: "1px solid #444",
                fontSize: "14px",
                fontWeight: "bold",
            },
            td: {
                padding: "8px 5px",
                borderBottom: "1px solid #333",
                fontSize: "13px",
            },
            kbd: {
                background: "#f7f7f7",
                color: "#000",
                border: "1px solid #555",
                borderRadius: "3px",
                padding: "2px 5px",
                fontSize: "12px",
                fontFamily: "monospace",
            },
        };
        const headerRow = document.createElement("tr");
        const shortcutHeader = document.createElement("th");
        shortcutHeader.textContent = "Shortcut";
        Object.assign(shortcutHeader.style, tableStyles.th);
        headerRow.appendChild(shortcutHeader);

        const actionHeader = document.createElement("th");
        actionHeader.textContent = "Action";
        Object.assign(actionHeader.style, tableStyles.th);
        headerRow.appendChild(actionHeader);

        table.appendChild(headerRow);
        const shortcuts = [
            { keys: ["Ctrl", "F1"], action: "Open 8chanSS settings" },
            { keys: ["Tab"], action: "Target Quick Reply text area" },
            { keys: ["R"], action: "Refresh Thread (5 sec. cooldown)" },
            { keys: ["Ctrl", "Q"], action: "Toggle Quick Reply" },
            { keys: ["Ctrl", "Enter"], action: "Submit post" },
            { keys: ["Escape"], action: "Clear QR textarea and hide all dialogs" },
            { keys: ["ALT", "W"], action: "Watch Thread" },
            { keys: ["SHIFT", "T"], action: "Toggle Quote Threading" },
            { keys: ["SHIFT", "CLICK"], action: "Hide Thread in Catalog" },
            { keys: ["CTRL", "UP/DOWN"], action: "Scroll between Your Replies" },
            { keys: ["CTRL", "SHIFT", "UP/DOWN"], action: "Scroll between Replies to You" },
            { keys: ["Ctrl", "B"], action: "Bold text" },
            { keys: ["Ctrl", "I"], action: "Italic text" },
            { keys: ["Ctrl", "U"], action: "Underline text" },
            { keys: ["Ctrl", "S"], action: "Spoiler text" },
            { keys: ["Ctrl", "D"], action: "Srz Bizniz text" },
            { keys: ["Ctrl", "M"], action: "Moe text" },
            { keys: ["Alt", "C"], action: "Code block" },
        ];
        shortcuts.forEach((shortcut) => {
            const row = document.createElement("tr");
            const shortcutCell = document.createElement("td");
            Object.assign(shortcutCell.style, tableStyles.td);
            shortcut.keys.forEach((key, index) => {
                const kbd = document.createElement("kbd");
                kbd.textContent = key;
                Object.assign(kbd.style, tableStyles.kbd);
                shortcutCell.appendChild(kbd);
                if (index < shortcut.keys.length - 1) {
                    const plus = document.createTextNode(" + ");
                    shortcutCell.appendChild(plus);
                }
            });

            row.appendChild(shortcutCell);
            const actionCell = document.createElement("td");
            actionCell.textContent = shortcut.action;
            Object.assign(actionCell.style, tableStyles.td);
            row.appendChild(actionCell);

            table.appendChild(row);
        });

        container.appendChild(table);
        const note = document.createElement("p");
        note.textContent =
            "Text formatting shortcuts work when text is selected or when inserting at cursor position.";
        note.style.fontSize = "12px";
        note.style.marginTop = "15px";
        note.style.opacity = "0.7";
        note.style.fontStyle = "italic";
        container.appendChild(note);

        return container;
    }
    if (link) {
        link.style.cursor = "pointer";
        link.title = "Open 8chanSS settings";
        link.addEventListener("click", async function (e) {
            e.preventDefault();
            let menu = await createSettingsMenu();
            menu.style.display = menu.style.display === "none" ? "block" : "none";
        });
    }
    async function shortcutsGloballyEnabled() {
        return await getSetting("enableShortcuts");
    }
    const bbCodeCombinations = new Map([
        ["s", ["[spoiler]", "[/spoiler]"]],
        ["b", ["'''", "'''"]],
        ["u", ["__", "__"]],
        ["i", ["''", "''"]],
        ["d", ["==", "=="]],           
        ["m", ["[moe]", "[/moe]"]],
        ["c", ["[code]", "[/code]"]],
    ]);
    function applyBBCode(textBox, key) {
        const [openTag, closeTag] = bbCodeCombinations.get(key);
        const { selectionStart, selectionEnd, value } = textBox;

        if (selectionStart === selectionEnd) {
            const before = value.slice(0, selectionStart);
            const after = value.slice(selectionEnd);
            const newCursor = selectionStart + openTag.length;
            textBox.value = before + openTag + closeTag + after;
            textBox.selectionStart = textBox.selectionEnd = newCursor;
        } else {
            const before = value.slice(0, selectionStart);
            const selected = value.slice(selectionStart, selectionEnd);
            const after = value.slice(selectionEnd);
            textBox.value = before + openTag + selected + closeTag + after;
            textBox.selectionStart = selectionStart + openTag.length;
            textBox.selectionEnd = selectionEnd + openTag.length;
        }
        textBox.dispatchEvent(new Event('input', { bubbles: true }));
    }
    let lastHighlighted = null;
    let lastType = null; 
    let lastRefreshTime = 0; 

    function getEligiblePostCells(isOwnReply) {
        const selector = isOwnReply
            ? '.postCell:has(a.youName), .opCell:has(a.youName)'
            : '.postCell:has(a.quoteLink.you), .opCell:has(a.quoteLink.you)';
        return Array.from(document.querySelectorAll(selector));
    }

    function scrollToReply(isOwnReply = true, getNextReply = true) {
        const postCells = getEligiblePostCells(isOwnReply);
        if (!postCells.length) return;
        let currentIndex = -1;
        const expectedType = isOwnReply ? "own" : "reply";
        if (
            lastType === expectedType &&
            lastHighlighted
        ) {
            const container = lastHighlighted.closest('.postCell, .opCell');
            currentIndex = postCells.indexOf(container);
        }
        if (currentIndex === -1) {
            const viewportMiddle = window.innerHeight / 2;
            currentIndex = postCells.findIndex(cell => {
                const rect = cell.getBoundingClientRect();
                return rect.top + rect.height / 2 > viewportMiddle;
            });
            if (currentIndex === -1) {
                currentIndex = getNextReply ? -1 : postCells.length;
            }
        }
        const targetIndex = getNextReply ? currentIndex + 1 : currentIndex - 1;
        if (targetIndex < 0 || targetIndex >= postCells.length) return;

        const postContainer = postCells[targetIndex];
        if (postContainer) {
            postContainer.scrollIntoView({ behavior: "smooth", block: "center" });
            if (lastHighlighted) {
                lastHighlighted.classList.remove('target-highlight');
            }
            let anchorId = null;
            let anchorElem = postContainer.querySelector('[id^="p"]');
            if (anchorElem && anchorElem.id) {
                anchorId = anchorElem.id;
            } else if (postContainer.id) {
                anchorId = postContainer.id;
            }
            if (anchorId && location.hash !== '#' + anchorId) {
                history.replaceState(null, '', '#' + anchorId);
            }
            const innerPost = postContainer.querySelector('.innerPost');
            if (innerPost) {
                innerPost.classList.add('target-highlight');
                lastHighlighted = innerPost;
            } else {
                lastHighlighted = null;
            }
            lastType = isOwnReply ? "own" : "reply";
        }
    }
    window.addEventListener('hashchange', () => {
        if (lastHighlighted) {
            lastHighlighted.classList.remove('target-highlight');
            lastHighlighted = null;
        }
        const hash = location.hash.replace('#', '');
        if (hash) {
            const postElem = document.getElementById(hash);
            if (postElem) {
                const innerPost = postElem.querySelector('.innerPost');
                if (innerPost) {
                    innerPost.classList.add('target-highlight');
                    lastHighlighted = innerPost;
                }
            }
        }
    });
    document.addEventListener("keydown", async function (event) {
        if (!(await shortcutsGloballyEnabled())) return;
        const active = document.activeElement;
        if (
            active &&
            event.key !== "Tab" && 
            (active.tagName === "INPUT" ||
                active.tagName === "TEXTAREA" ||
                active.isContentEditable)
        ) {
            return;
        }
        if (event.ctrlKey && event.key === "F1") {
            event.preventDefault();
            let menu = document.getElementById("8chanSS-menu") || (await createSettingsMenu());
            menu.style.display = menu.style.display === "none" || menu.style.display === "" ? "block" : "none";
            return;
        }
        if (event.ctrlKey && (event.key === "q" || event.key === "Q")) {
            event.preventDefault();
            const hiddenDiv = document.getElementById("quick-reply");
            if (!hiddenDiv) return;
            const isHidden = hiddenDiv.style.display === "none" || hiddenDiv.style.display === "";
            hiddenDiv.style.display = isHidden ? "block" : "none";
            if (isHidden) {
                setTimeout(() => {
                    const textarea = document.getElementById("qrbody");
                    if (textarea) textarea.focus();
                }, 50);
            }
            return;
        }
        if (
            event.key === "Tab" &&
            !event.ctrlKey &&
            !event.altKey &&
            !event.metaKey
        ) {
            const qrbody = document.getElementById("qrbody");
            const captcha = document.getElementById("QRfieldCaptcha");

            if (qrbody) {
                if (document.activeElement === qrbody && captcha) {
                    event.preventDefault();
                    captcha.focus();
                } else if (document.activeElement === captcha) {
                    event.preventDefault();
                    qrbody.focus();
                } else if (document.activeElement !== qrbody) {
                    event.preventDefault();
                    qrbody.focus();
                }
            }
            return;
        }
        if (event.key === "r" || event.key === "R") {
            const isThread = window.pageType?.isThread;
            const isCatalog = window.pageType?.isCatalog;
            const threadRefreshBtn = document.getElementById("refreshButton");
            const catalogRefreshBtn = document.getElementById("catalogRefreshButton");
            const now = Date.now();

            if (
                (isThread && threadRefreshBtn) ||
                (isCatalog && catalogRefreshBtn)
            ) {
                if (now - lastRefreshTime >= 5000) {
                    event.preventDefault();
                    if (isThread && threadRefreshBtn) {
                        threadRefreshBtn.click();
                    } else if (isCatalog && catalogRefreshBtn) {
                        catalogRefreshBtn.click();
                    }
                    lastRefreshTime = now;
                } else {
                    event.preventDefault();
                }
                return;
            }
        }
        if (event.shiftKey && !event.ctrlKey && !event.altKey && (event.key === "t" || event.key === "T")) {
            event.preventDefault();

            const current = await getSetting("quoteThreading");
            const newValue = !current;
            await setSetting("quoteThreading", newValue);
            try {
                const msg = `Quote threading <b>${newValue ? "enabled" : "disabled"}</b>`;
                const color = newValue ? 'blue' : 'black';
                callPageToast(msg, color, 1300);
            } catch { }
            setTimeout(() => window.location.reload(), 1400);
            return;
        }
        if (event.key === "Escape") {
            const textarea = document.getElementById("qrbody");
            if (textarea) textarea.value = "";
            const quickReply = document.getElementById("quick-reply");
            if (quickReply) quickReply.style.display = "none";
            const threadWatcher = document.getElementById("watchedMenu");
            if (threadWatcher) threadWatcher.style.display = "none";
            return;
        }
        if (event.ctrlKey && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
            event.preventDefault();
            const isOwnReply = !event.shiftKey;
            const isNext = event.key === 'ArrowDown';
            scrollToReply(isOwnReply, isNext);
            return;
        }
        if (
            event.altKey &&
            (event.key === "w" || event.key === "W")
        ) {
            event.preventDefault();
            const btn = document.querySelector(".watchButton");
            if (btn && !btn.classList.contains("watched-active")) {
                btn.click();
                setTimeout(() => {
                    btn.classList.add("watched-active");
                }, 100);
            }
            return;
        }
    });
    const bbTextareas = document.querySelectorAll("#qrbody, #fieldMessage");
    if (!(await shortcutsGloballyEnabled())) {
        return;
    } else bbTextareas.forEach((textarea) => {
        textarea.addEventListener("keydown", async function (event) {
            if (event.ctrlKey && event.key === "Enter") {
                event.preventDefault();
                const submitButton = document.getElementById("qrbutton");
                if (submitButton) {
                    submitButton.click();
                    if (await getSetting("watchThreadOnReply")) {
                        setTimeout(() => {
                            const btn = document.querySelector(".watchButton");
                            if (btn && !btn.classList.contains("watched-active")) {
                                btn.click();
                                setTimeout(() => {
                                    btn.classList.add("watched-active");
                                }, 100);
                            }
                        }, 500);
                    }
                }
            }
            const key = event.key.toLowerCase();
            if (key === "c" && event.altKey && !event.ctrlKey && bbCodeCombinations.has(key)) {
                event.preventDefault();
                applyBBCode(event.target, key);
                return;
            }
            if (event.ctrlKey && !event.altKey && bbCodeCombinations.has(key) && key !== "c") {
                event.preventDefault();
                applyBBCode(event.target, key);
                return;
            }
        });
    });
    function featureCatalogHiding() {
        const STORAGE_KEY = "8chanSS_hiddenCatalogThreads";
        let showHiddenMode = false;
        function getBoardAndThreadNumFromCell(cell) {
            const link = cell.querySelector("a.linkThumb[href*='/res/']");
            if (!link) return { board: null, threadNum: null };
            const match = link.getAttribute("href").match(/^\/([^/]+)\/res\/(\d+)\.html/);
            if (!match) return { board: null, threadNum: null };
            return { board: match[1], threadNum: match[2] };
        }
        async function loadHiddenThreadsObj() {
            const raw = await GM.getValue(STORAGE_KEY, "{}");
            try {
                const obj = JSON.parse(raw);
                return typeof obj === "object" && obj !== null ? obj : {};
            } catch {
                return {};
            }
        }
        async function saveHiddenThreadsObj(obj) {
            await GM.setValue(STORAGE_KEY, JSON.stringify(obj));
        }
        async function applyHiddenThreads() {
            const hiddenThreadsObjRaw = await GM.getValue(STORAGE_KEY, "{}");
            let hiddenThreadsObj;
            try {
                hiddenThreadsObj = JSON.parse(hiddenThreadsObjRaw);
                if (typeof hiddenThreadsObj !== "object" || hiddenThreadsObj === null) hiddenThreadsObj = {};
            } catch {
                hiddenThreadsObj = {};
            }
            let catalogFilters = [];
            const enableCatalogFiltering = await getSetting("enableThreadHiding_enableCatalogFiltering");
            if (enableCatalogFiltering) {
                const filtersObj = await getStoredObject("8chanSS_catalogFilters");
                catalogFilters = Object.values(filtersObj || {});
            }
            document.querySelectorAll(".catalogCell").forEach(cell => {
                const { board, threadNum } = getBoardAndThreadNumFromCell(cell);
                if (!board || !threadNum) return;
                const hiddenThreads = hiddenThreadsObj[board] || [];
                let shouldFilter = false;
                if (catalogFilters.length > 0) {
                    const subject = cell.querySelector('.labelSubject')?.textContent || '';
                    const message = cell.querySelector('.divMessage')?.textContent || '';
                    const threadText = (subject + ' ' + message).toLowerCase();
                    
                    for (const filter of catalogFilters) {
                        const word = filter.word.toLowerCase();
                        const boards = filter.boards.toLowerCase().split(',').map(b => b.trim());
                        let matches = false;
                        if (word.includes('*')) {
                            if (word === '*') {
                                matches = true;
                            } else if (word.startsWith('*') && word.endsWith('*')) {
                                const pattern = word.slice(1, -1);
                                matches = threadText.includes(pattern);
                            } else if (word.startsWith('*')) {
                                const pattern = word.slice(1);
                                matches = threadText.endsWith(pattern) || threadText.includes(' ' + pattern);
                            } else if (word.endsWith('*')) {
                                const pattern = word.slice(0, -1);
                                matches = threadText.startsWith(pattern) || threadText.includes(pattern + ' ');
                            }
                        } else {
                            matches = threadText.includes(word);
                        }
                        
                        if (matches) {
                            if (boards.length === 0 || boards[0] === '' || boards.includes(board)) {
                                shouldFilter = true;
                                break;
                            }
                        }
                    }
                }

                if (typeof showHiddenMode !== "undefined" && showHiddenMode) {
                    if (hiddenThreads.includes(threadNum) || shouldFilter) {
                        cell.style.display = "";
                        cell.classList.add("ss-unhide-thread");
                        cell.classList.remove("ss-hidden-thread");
                    } else {
                        cell.style.display = "none";
                        cell.classList.remove("ss-unhide-thread", "ss-hidden-thread");
                    }
                } else {
                    if (hiddenThreads.includes(threadNum) || shouldFilter) {
                        cell.style.display = "none";
                        cell.classList.add("ss-hidden-thread");
                        cell.classList.remove("ss-unhide-thread");
                    } else {
                        cell.style.display = "";
                        cell.classList.remove("ss-hidden-thread", "ss-unhide-thread");
                    }
                }
            });
        }
        async function onCatalogCellClick(e) {
            const cell = e.target.closest(".catalogCell");
            if (!cell) return;
            if (e.shiftKey && e.button === 0) {
                const { board, threadNum } = getBoardAndThreadNumFromCell(cell);
                if (!board || !threadNum) return;

                let hiddenThreadsObj = await loadHiddenThreadsObj();
                if (!hiddenThreadsObj[board]) hiddenThreadsObj[board] = [];
                let hiddenThreads = hiddenThreadsObj[board];

                if (showHiddenMode) {
                    hiddenThreads = hiddenThreads.filter(num => num !== threadNum);
                    hiddenThreadsObj[board] = hiddenThreads;
                    await saveHiddenThreadsObj(hiddenThreadsObj);
                    await applyHiddenThreads();
                } else {
                    if (!hiddenThreads.includes(threadNum)) {
                        hiddenThreads.push(threadNum);
                        hiddenThreadsObj[board] = hiddenThreads;
                    }
                    await saveHiddenThreadsObj(hiddenThreadsObj);
                    cell.style.display = "none";
                    cell.classList.add("ss-hidden-thread");
                }
                e.preventDefault();
                e.stopPropagation();
            }
        }
        async function showAllHiddenThreads() {
            showHiddenMode = true;
            await applyHiddenThreads();
            const btn = document.getElementById("ss-show-hidden-btn");
            if (btn) btn.textContent = "Hide Hidden";
        }
        async function hideAllHiddenThreads() {
            showHiddenMode = false;
            await applyHiddenThreads();
            const btn = document.getElementById("ss-show-hidden-btn");
            if (btn) btn.textContent = "Show Hidden";
        }
        async function toggleShowHiddenThreads() {
            if (showHiddenMode) {
                await hideAllHiddenThreads();
            } else {
                await showAllHiddenThreads();
            }
        }
        function addShowHiddenButton() {
            if (document.getElementById("ss-show-hidden-btn")) return;
            const refreshBtn = document.querySelector("#catalogRefreshButton");
            if (!refreshBtn) return;
            const btn = document.createElement("button");
            btn.id = "ss-show-hidden-btn";
            btn.className = "catalogLabel";
            btn.type = "button";
            btn.textContent = "Show Hidden";
            btn.style.marginRight = "8px";
            btn.addEventListener("click", toggleShowHiddenThreads);
            refreshBtn.parentNode.insertBefore(btn, refreshBtn);
        }
        function hideThreadsOnRefresh() {
            if (!window.pageType?.isCatalog) return;
            onReady(addShowHiddenButton);
            onReady(applyHiddenThreads);
            const catalogContainer = document.querySelector(".catalogWrapper, .catalogDiv");
            if (catalogContainer) {
                catalogContainer.addEventListener("click", onCatalogCellClick, true);
            }
        }
        hideThreadsOnRefresh();
        const catalogDivObs = observeSelector('.catalogDiv', { childList: true, subtree: false });
        if (catalogDivObs) {
            const debouncedApply = debounce(applyHiddenThreads, 50);
            catalogDivObs.addHandler(function catalogHidingHandler() {
                debouncedApply();
            });
        }
    }
    (function noCaptchaHistory() {
        const captchaInput = document.getElementById("QRfieldCaptcha");
        if (captchaInput) {
            captchaInput.autocomplete = "off";
        }
    })();
    (function moveFileUploadsBelowOp() {
        if (window.pageType?.isCatalog) {
            return;
        } else if (opHeadTitle && innerOP) {
            innerOP.insertBefore(opHeadTitle, innerOP.firstChild);
        }
    })();
    async function updateNotif() {
        const VERSION_KEY = "8chanSS_version";
        let storedVersion = null;
        try {
            storedVersion = await GM.getValue(VERSION_KEY, null);
        } catch (err) {
            console.error("[8chanSS] Failed to get stored script version:", err);
        }

        if (storedVersion !== VERSION) {
            if (storedVersion !== null) {
                let tries = 0;
                while (typeof window.callPageToast !== "function" && tries < 20) {
                    await new Promise(res => setTimeout(res, 100));
                    tries++;
                }
                if (typeof window.callPageToast === "function") {
                    window.callPageToast(
                        `8chanSS has updated to v${VERSION}. Check out the <b><a href="https://github.com/otacoo/8chanSS/blob/main/CHANGELOG.md" target="_blank">changelog</a></b>.`,
                        "blue",
                        15000
                    );
                }
            }
            try {
                await GM.setValue(VERSION_KEY, VERSION);
            } catch (err) {
                console.error("[8chanSS] Failed to store script version:", err);
            }
        }
    }
});