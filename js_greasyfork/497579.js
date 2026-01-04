// ==UserScript==
// @name            [Youtube] Compact sidebar with more buttons
// @namespace       https://greasyfork.org/users/821661
// @version         1.0.2
// @description     Add more buttons in compact sidebar/mini guide
// @author          hdyzen
// @match           https://www.youtube.com/*
// @icon            https://www.google.com/s2/favicons?domain=www.youtube.com/&sz=64
// @grant           GM_registerMenuCommand
// @grant           GM_setValue
// @grant           GM_getValue
// @grant           GM_addStyle
// @license         GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/497579/%5BYoutube%5D%20Compact%20sidebar%20with%20more%20buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/497579/%5BYoutube%5D%20Compact%20sidebar%20with%20more%20buttons.meta.js
// ==/UserScript==

const COMMADS = {
    home: {
        label: "Home",
        state: true,
    },
    shorts: {
        label: "Shorts",
        state: true,
    },
    subscriptions: {
        label: "Subscriptions",
        state: true,
    },
    music: {
        label: "Youtube Music",
        state: true,
    },
    you: {
        label: "You",
        state: true,
    },
    history: {
        label: "History",
        state: true,
    },
    playlists: {
        label: "Playlists",
        state: true,
    },
    yourVideos: {
        label: "Videos",
        state: true,
    },
    yourCourses: {
        label: "Courses",
        state: true,
    },
    watchLater: {
        label: "Later",
        state: true,
    },
    liked: {
        label: "Liked",
        state: true,
    },
    download: {
        label: "Download",
        state: true,
    },
    yourClips: {
        label: "Clips",
        state: true,
    },
};

function renderMenuCommands() {
    for (const key in COMMADS) {
        const state = GM_getValue(key, COMMADS[key].state);
        const label = COMMADS[key].label;

        document.body.classList.toggle(key, !state);

        GM_registerMenuCommand(`${state ? "✅" : "❌"} ${label}`, () => toggleState(key, state), { id: key, autoClose: false });
    }
}
renderMenuCommands();

function toggleState(key, state) {
    COMMADS[key].state = !state;
    GM_setValue(key, COMMADS[key].state);
    renderMenuCommands();
}

const originalParse = JSON.parse;
JSON.parse = (text) => {
    const result = originalParse(text);
    const items = result?.items?.[0]?.guideSectionRenderer?.items?.[4]?.guideCollapsibleSectionEntryRenderer?.sectionItems;

    if (!items) return result;

    for (const item of items) {
        if (item.guideEntryRenderer) item.guideEntryRenderer.isPrimary = true;
        if (item.guideDownloadsEntryRenderer) item.guideDownloadsEntryRenderer.alwaysShow = true;
    }

    return result;
};

GM_addStyle(`
ytd-mini-guide-renderer.ytd-app {
    overflow: auto;
} 
.home ytd-mini-guide-entry-renderer:has(> a[href="/"]),
.shorts ytd-mini-guide-entry-renderer:has(> a[title="Shorts"]),
.subscriptions ytd-mini-guide-entry-renderer:has(> a[href="/feed/subscriptions"]),
.music ytd-mini-guide-entry-renderer:has(> a[href="https://music.youtube.com/"]),
.you ytd-mini-guide-entry-renderer:has(> a[href="/feed/you"]),
.history ytd-mini-guide-entry-renderer:has(> a[href="/feed/history"]),
.playlists ytd-mini-guide-entry-renderer:has(> a[href="/feed/playlists"]),
.yourVideos ytd-mini-guide-entry-renderer:has(> a[href^="https://studio.youtube.com/"]),   
.yourCourses ytd-mini-guide-entry-renderer:has(> a[href="/feed/courses"]),   
.watchLater ytd-mini-guide-entry-renderer:has(> a[href="/playlist?list=WL"]),
.liked ytd-mini-guide-entry-renderer:has(> a[href="/playlist?list=LL"]),
.download ytd-mini-guide-entry-renderer:has(> a[href="/feed/downloads"]),
.yourClips ytd-mini-guide-entry-renderer:has(> a[href="/feed/clips"]) {
    display: none !important;
}
`);
