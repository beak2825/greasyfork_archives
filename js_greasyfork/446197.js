// ==UserScript==
// @name            HDrezka Improvement
// @name:en         HDrezka Improvement
// @name:uk         HDrezka Improvement
// @name:ru         HDrezka Improvement
// @description     HDrezka Improvement: cleanup, change content width, change player size, remove ads, remove blocks, restyle, subtitles (opensubtitles.com)
// @description:en  HDrezka Improvement: cleanup, change content width, change player size, remove ads, remove blocks, restyle, subtitles (opensubtitles.com)
// @description:uk  HDrezka Improvement: cleanup, change content width, change player size, remove ads, remove blocks, restyle, subtitles (opensubtitles.com)
// @description:ru  HDrezka Improvement: cleanup, change content width, change player size, remove ads, remove blocks, restyle, subtitles (opensubtitles.com)
// @author          rub4ek
// @namespace       http://tampermonkey.net/
// @version         2.1.6
// @include         http*://*rezka*/*
// @include         http*://hdrezka*/*
// @include         http*://rezka*/*
// @include         http*://hdrezka.me/*
// @include         http*://hdrezka.co/*
// @include         http*://rezka.ag/*
// @include         http*://rezkify.com/*
// @include         http*://rezkery.com/*
// @include         http*://kinopub.me/*
// @icon            https://static.hdrezka.ac/templates/hdrezka/images/favicon.ico
// @grant           GM.info
// @grant           GM.addStyle
// @grant           GM.xmlHttpRequest
// @grant           GM.setValue
// @grant           GM.getValue
// @grant           GM.deleteValue
// @grant           GM.listValues
// @run-at          document-start
// @require         https://update.greasyfork.org/scripts/482037/1298684/R4%20Fonts.js
// @require         https://update.greasyfork.org/scripts/482042/1298685/R4%20Images.js
// @require         https://update.greasyfork.org/scripts/482597/1301960/R4%20Utils.js
// @require         https://update.greasyfork.org/scripts/482052/1502912/R4%20Settings.js
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/425494/HDrezka%20Improvement.user.js
// @updateURL https://update.greasyfork.org/scripts/425494/HDrezka%20Improvement.meta.js
// ==/UserScript==


(function () {
    "use strict";

    /* ------------------------------------------------- */
    /* --------------GLOBAL----------------------------- */
    /* ------------------------------------------------- */

    const r4 = {};

    /* ------------------------------------------------- */
    /* --------------VERSION---------------------------- */
    /* ------------------------------------------------- */

    r4.version = GM.info.script.version;
    r4.useragent = `hdrezka-improvement userscript v${r4.version}`;

    /* ------------------------------------------------- */
    /* --------------DEBUG------------------------------ */
    /* ------------------------------------------------- */

    // unsafeWindow.r4 = r4;

    /* ------------------------------------------------- */
    /* --------------GLOBAL-STYLES---------------------- */
    /* ------------------------------------------------- */

    GM.addStyle(`

    /* css */

    /* Body background */
    /* Need it to fix background for not authenticated users */
    body.active-brand #wrapper {
        background-color: #efefef !important;
    }
    .b-seriesupdate__block_list_item {
        background-color: transparent !important;
    }

    /* Padding for content */
    .glory,
    .b-wrapper {
        padding-left: 30px !important;
        padding-right: 30px !important;
        box-sizing: border-box;
    }
    .glory {
        width: 960px !important;
        display: none;
    }
    .b-footer {
        width: auto !important;
    }
    .b-search__form.focused,
    .search-results {
        width: calc(100% - 60px);
        left: 30px;
    }
    .b-content__inline_items {
        width: auto;
        padding-right: 16px;
        box-sizing: border-box;
    }

    /* Remove extra right padding for content page */
    .b-content__columns {
        padding-right: 0 !important;
    }

    /* Remove extra right padding on main content listing */
    .b-content__inline_inner_mainprobar {
        padding-right: 0 !important;
    }
    .b-content__inline_inner_mainprobar .b-content__inline_item {
        margin-left: 16px !important;
    }

    /* Style status (HDrezka tracker block) */
    .b-post__status_wrapper {
        width: auto !important;
        margin: 0px 10px 0px 13px !important;
    }

    /* Style and resize rating block */
    .b-post__rating_table {
        width: 100% !important;
    }
    .b-post__rating_table td > * {
        float: right !important;
    }
    .b-post__rating_table .label {
        display: none !important;
    }

    /* Hide last episode info */
    .b-post__lastepisodeout {
        display: none !important;
    }

    /* Hide support block */
    .b-post__support_holder {
        display: none !important;
    }
    .b-post__support_holder_report .append {
        display: none !important;
    }
    .b-post__wait_status {
        display: none !important;
    }

    /* Hide share label */
    .b-post__social_holder_wrapper .share-label {
        display: none !important;
    }

    /* Hide mixedtext */
    .b-post__mixedtext {
        text-indent: -9999px !important;
        padding: 0 !important;
        height: 0;
    }

    /* !css */

    `);

    /* ------------------------------------------------- */
    /* --------------PLAYER----------------------------- */
    /* ------------------------------------------------- */

    function initPlayer() {
        GM.addStyle(`

        /* css */

        /* Style player */

        .b-container .b-player {
            padding-top: 0 !important;
        }
        @media screen {
            .b-container .b-player {
                padding-top: 0 !important;
            }
        }
        .b-player #cdnplayer-container {
            height: auto !important;
        }
        .b-player #cdnplayer {
            resize: vertical;
            overflow: auto;
            width: 100% !important;
            min-height: 200px !important;
        }
        .b-player #cdnplayer-preloader {
            height: 100%;
            width: 100%;
        }
        .b-player #cdnplayer-preloader.loading.transparent {
            background: transparent !important;
        }
        .b-player .b-simple_seasons__list {
            padding: 10px;
        }
        #oframecdnplayer > pjsdiv[style*="width: 100%; height: 100%;"] {
            /* Somehow after scale it is mess with z-index in safari after scale */
            /* This fixes the issue with controls hovered by the poster */
            z-index: -1 !important;
        }
        #pjsfrrscdnplayer {
            /* Somehow after scale it is mess with z-index in safari after scale */
            /* This fixes the issue with scroll in subtitles and volume scroll */
            z-index: -1 !important;
        }
        /* !css */

        `);

        async function CDNPlayerApi(method, value) {

            // Function that will be executed either in userscipt scope or in page scope
            function call() {
                if (typeof CDNPlayer === "undefined") {
                    console.debug(`CDNPlayer is undefined in page scope.`);
                    return;
                }
                const result = CDNPlayer.api(method, value);
                if (result === undefined) {
                    if (value === undefined) {
                        console.debug(`CDNPlayer.api(${JSON.stringify(method)})`);
                    } else {
                        console.debug(`CDNPlayer.api(${JSON.stringify(method)}, ${JSON.stringify(value)})`);
                    }
                } else {
                    if (value === undefined) {
                        console.debug(`CDNPlayer.api(${JSON.stringify(method)}): ${result}`);
                    } else {
                        console.debug(`CDNPlayer.api(${JSON.stringify(method)}, ${JSON.stringify(value)}): ${result}`);
                    }
                }
                return result;
            }

            // In Safari there is no access to page scope from userscript.
            if (typeof CDNPlayer === "undefined") {

                // Trying to execute on page scope with locatiion hack
                return await r4.utils.executeLocation(
                    // Function to execute
                    call,
                    // Variables used in function
                    {method, value}
                );
            }

            // Otherwise call it in userscript scope
            return call();
        }

        function fit() {
            if (!elements.container || !elements.player) {
                return;
            }

            if (state.fullscreen || state.expanded) {
                return;
            }

            const initial = {
                width: elements.container.offsetWidth,
                height: elements.container.offsetHeight,
            };

            if (state.resized === false && state.size?.width && state.size?.height) {
                initial.width = state.size.width;
                initial.height = state.size.height;

                state.resized = true;
                state.resizing = true;
            }

            const expected = {
                width: elements.player.offsetWidth,
            };
            const resized = {
                width: null,
                height: null,
            };

            initial.ratio = initial.width / initial.height;
            resized.width = expected.width;
            resized.height = expected.width / initial.ratio;

            if (state.resizing && resized.height < state.min.height) {
                resized.height = state.min.height;
            }

            if (!state.resizing && resized.width === initial.width && resized.height === initial.height) {
                return;
            }

            state.resizing = false;

            resize(resized);
        }

        function resize(size) {
            if (!elements.container || !elements.cdnplayer) {
                return;
            }

            if (!size?.width || !size?.height) {
                return;
            }

            elements.container.style.width = `${size.width}px`;
            elements.cdnplayer.style.height = `${size.height}px`;

            console.log(`Player resized to ${size.width | 0}x${size.height | 0}`);
        }

        function scale() {
            if (!elements.oframecdnplayer) return;

            const presantage = {
                width: 100 / state.scale,
                height: 100 / state.scale,
                left: (100 - (100 / state.scale)) / 2,
                top: (100 - (100 / state.scale)) / 2,
            }

            const transform = `scale(${state.scale})`;

            if (elements.oframecdnplayer.style.transform === transform) {
                return;
            }

            elements.oframecdnplayer.style.width = `${presantage.width}%`;
            elements.oframecdnplayer.style.height = `${presantage.height}%`;
            elements.oframecdnplayer.style.left = `${presantage.left}%`;
            elements.oframecdnplayer.style.top = `${presantage.top}%`;
            elements.oframecdnplayer.style.transform = transform;

            console.log(`Player scaled to ${state.scale * 100}%`);
        }

        function title() {
            const titleItem = document.querySelector(".b-b-post__title");
            return titleItem?.innerText;
        }

        function orig_title() {
            const titleItem = document.querySelector(".b-post__origtitle");
            return titleItem?.innerText;
        }

        function season() {
            const seasonItem = document.querySelector(".b-simple_season__item.active");
            return seasonItem && seasonItem.innerText.split(" ")[1];
        }

        function episode() {
            const episodeItem = document.querySelector(".b-simple_episode__item.active");
            return episodeItem && episodeItem.innerText.split(" ")[1];
        }

        function preloader(value) {
            elements.preloader.style.display = value ? "block" : "none";
            elements.preloader.classList.toggle("loading", value);
            elements.preloader.classList.toggle("transparent", value);
        }

        async function start() {
            sof.tv.buildCDNPlayer();
            await vast();
            return await play();
        }

        async function vast() {
            await CDNPlayerApi("update:vast", state.vast);
        }

        async function play() {
            return await CDNPlayerApi("play");
        }

        async function toggle() {
            if (state.playing === true) {
                return await pause();
            }
            return await play();
        }

        async function togglefullscreen() {
            if (state.fullscreen) {
                return await exitfullscreen();
            } else {
                return await enterfullscreen();
            }
        }

        async function volume(level) {
            const volume = await CDNPlayerApi("volume", level);
            return parseFloat(volume || 0);
        }

        function sibling(direction) {
            const activeEpisode = elements.player.querySelector(".b-simple_episode__item.active");
            if (activeEpisode?.[direction]) {
                activeEpisode[direction].click();
                setTimeout(start, 1000);
            } else {
                const activeSeason = elements.player.querySelector(".b-simple_season__item.active");
                if (activeSeason?.[direction]) {
                    activeSeason[direction].click();
                    setTimeout(start, 1000);
                }
            }
        }

        async function adjust(seconds) {
            const current = await CDNPlayerApi("time");
            const duration = await CDNPlayerApi("duration");

            if (current !== undefined && duration !== undefined) {
                const time = parseFloat(seconds + current).toFixed(3);
                return await seek(time < duration ? time : duration - 0.5);
            }
        }

        async function startadjusting(seconds) {
            wake();
            if (state.adjusting != false) {
                return;
            }
            state.adjusting = true;
            await adjust(seconds);
            setTimeout(() => {
                if (!state.interval) {
                    state.interval = setInterval(async () => {
                        if (state.adjusting == true) {
                            await adjust(seconds);
                        } else {
                            clearInterval(state.interval);
                            state.interval = null;
                        }
                    }, 30);
                }
            }, 1000);
        }

        function stopadjusting() {
            state.adjusting = false;
        }

        function wake() {
            elements.oframecdnplayer?.dispatchEvent(new Event("mousemove"));
            elements.oframecdnplayer?.dispatchEvent(new Event("mouseup"));
        }

        const next = () => sibling("nextElementSibling");
        const prev = () => sibling("previousElementSibling");
        const seek = async (seconds) => await CDNPlayerApi("seek", seconds);
        const subtitle = async (url) => await CDNPlayerApi("subtitle", url);
        const pause = async () => await CDNPlayerApi("pause");
        const stop = async () => await CDNPlayerApi("stop");
        const enterfullscreen = async () => await CDNPlayerApi("fullscreen");
        const exitfullscreen = async () => await CDNPlayerApi("exitfullscreen");
        const poster = async (poster) => await CDNPlayerApi("poster", poster);
        const mute = async () => await CDNPlayerApi(await CDNPlayerApi("muted") ? "unmute" : "mute");

        const elements = {
            player: null,
            container: null,
            cdnplayer: null,
            oframecdnplayer: null,
            pjsfrrscdnplayer: null,
            video: null,
        };

        const state = {
            playing: false,         // Player is playing now
            adjusting: false,       // Player is adjusting now (rewind or forward)
            fullscreen: false,      // Player is in fullscreen mode
            expanded: false,        // Player is expanded to full page
            collapsed: false,       // Player was already collapsed, used to prevent ferther collapses if auto expand is enabled
            resized: false,         // Player was already resized to fit the container, used to prevent ferther resizes
            vast: false,            // Player should show ads
            size: {},               // Player size
            min: {},                // Player min size
            scale: 1,               // Player scale
            interval: null,
        };

        function find(mutationsList, observer) {
            // Check for elements
            elements.player = document.querySelector("#player");
            elements.container = elements.player?.querySelector("#cdnplayer-container");
            if (elements.container && !state.size.width && !state.size.height) {
                state.size = {
                    width: elements.container.offsetWidth,
                    height: elements.container.offsetHeight,
                }
            }
            elements.cdnplayer = elements.container?.querySelector("#cdnplayer");
            elements.preloader = elements.container?.querySelector("#cdnplayer-preloader");
            elements.oframecdnplayer = elements.cdnplayer?.querySelector("#oframecdnplayer");
            elements.pjsfrrscdnplayer = elements.oframecdnplayer?.querySelector("#pjsfrrscdnplayer");
            elements.video = elements.oframecdnplayer?.querySelector("video");

            // Check if all elements are found
            const allElementsFound = Object.values(elements).every(element => !!element);

            // If all elements are found, disconnect the observer
            if (allElementsFound) {
                observer?.disconnect();
            }

        }

        // In case of scipt loaded before player loaded
        new MutationObserver(find).observe(document, { childList: true, subtree: true });

        // In case of script loaded after player loaded
        r4.settings?.afterStart(find);

        function ready() {
            return new Promise((resolve) => {
                function check() {
                    // Check if all elements are found
                    if (Object.values(elements).every(element => !!element) ) {
                        // If all elements are found, resolve the promise
                        resolve();
                    } else {
                        // Otherwise check again in 100ms
                        setTimeout(check, 100);
                    }
                }

                check();
            });
        }

        window.addEventListener("message", (event) => {
            switch (event.data?.event) {
                case "volume":
                    break;
                case "time":
                    state.time = event.data.time;
                    state.size = {
                        width: elements?.video?.videoWidth || state.size.width,
                        height: elements?.video?.videoHeight || state.size.height,
                    };
                    fit();
                    scale();
                    break;
                case "init":
                    find();
                    fit();
                    scale();
                    vast();
                    poster("hc-poster");
                    break;
                case "inited":
                    find();
                    fit();
                    scale();
                    vast();
                    poster("hc-poster");
                    elements.cdnplayer.oncontextmenu = undefined;
                    break;
                case "duration":
                    break;
                case "start":
                    break;
                case "started":
                    break;
                case "new":
                    find();
                    fit();
                    scale();
                    vast();
                    state.resized = false;
                    break;
                case "quality":
                    find();
                    fit();
                    scale();
                    state.resized = false;
                    break;
                case "play":
                    break;
                case "resumed":
                    state.playing = true;
                    document.body.classList.add("hc-playing");
                    document.body.classList.remove("hc-paused");
                    break;
                case "buffering":
                    break;
                case "waiting":
                    break;
                case "buffered":
                    find();
                    break;
                case "pause":
                    break;
                case "paused":
                    state.playing = false;
                    state.time = event.data.time;
                    document.body.classList.add("hc-paused");
                    document.body.classList.remove("hc-playing");
                    break;
                case "seek":
                    break;
                case "rewound":
                    break;
                case "fullscreen":
                    state.fullscreen = true;
                    break;
                case "exitfullscreen":
                    state.fullscreen = false;
                    fit();
                    scale();
                    break;
                case "fragment":
                    break;
                case "ui":
                    break;
                default:
                    if (event.data?.event?.startsWith("vast")) {
                        vast();
                    }
                    break;
            }
        });

        return {
            elements,
            state,
            preloader,
            start,
            play,
            pause,
            stop,
            next,
            prev,
            toggle,
            enterfullscreen,
            exitfullscreen,
            togglefullscreen,
            poster,
            fit,
            scale,
            mute,
            volume,
            vast,
            seek,
            adjust,
            startadjusting,
            stopadjusting,
            wake,
            subtitle,
            season,
            episode,
            orig_title,
            title,
            ready,
        };
    }

    /* ------------------------------------------------- */
    /* --------------CONTENT-SIZE----------------------- */
    /* ------------------------------------------------- */

    function initContentSizeTumbler() {
        GM.addStyle(`

        /* css */

        /* Content Size Tumbler */
        .r4-tumbler-content-size .r4-tumbler-point:nth-child(1) {
            border-width: 8px;
        }
        .r4-tumbler-content-size .r4-tumbler-point:nth-child(2) {
            border-width: 7px;
        }
        .r4-tumbler-content-size .r4-tumbler-point:nth-child(3) {
            border-width: 6px;
        }
        .r4-tumbler-content-size .r4-tumbler-point:nth-child(4) {
            border-width: 5px;
        }
        .r4-tumbler-content-size .r4-tumbler-point:nth-child(5) {
            border-width: 4px;
        }

        /* Content Sizes */

        /* Mobile */

        body.hc-content-size-mobile {
            min-width: 580px;
        }
        @media screen {
            body.hc-content-size-mobile {
                min-width: 580px;
            }
        }
        body.hc-content-size-mobile .glory,
        body.hc-content-size-mobile .b-footer__left,
        body.hc-content-size-mobile .glory,
        body.hc-content-size-mobile .b-wrapper {
            width: auto !important;
            min-width: 580px;
            max-width: 580px;
        }
        body.hc-content-size-mobile.hc-player-cover:not(.hc-playing) .hc-player-top-bar {
            padding: 10px;
        }
        body.hc-content-size-mobile.hc-player-cover.hc-hide-info .hc-player-top-bar-heading {
            width: calc(100% - 70px - 10px);
        }
        body.hc-content-size-mobile.hc-player-cover.hc-hide-info:not(.hc-playing) .hc-player-top-bar-cover {
            width: 70px;
        }
        body.hc-content-size-mobile .b-tophead-right {
            width: auto;
        }
        body.hc-content-size-mobile .b-tophead__subscribe-dropdown-inner {
            display: none;
        }
        body.hc-content-size-mobile .b-theme__switcher > .tumbler__wrapper {
            margin-left: 0;
        }
        body.hc-content-size-mobile .b-topnav__item {
            margin-right: 10px;
        }
        body.hc-content-size-mobile .i-sprt.dropdwn {
            display: none;
        }
        body.hc-content-size-mobile .b-search__form:not(.focused) {
            width: 25px;
            right: 30px
        }
        body.hc-content-size-mobile .b-tophead__logo {
            scale: 0.5;
            left: 45%;
        }
        body.hc-content-size-mobile .b-footer__menu_item {
            padding-right: 20px;
        }
        body.hc-content-size-mobile .b-content__filters_types {
            margin-top: 20px;
            float: left;
        }
        body.hc-content-size-mobile .b-favorites_content__sidebar {
            float: none;
        }
        body.hc-content-size-mobile .b-newest_slider_wrapper {
            display: none;
        }
        body.hc-content-size-mobile .b-collections__newest {
            display: none;
        }

        body.hc-content-size-mobile .b-tophead-right > * {
            width: 40px;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        /* 960px */

        body.hc-content-size-default {
            min-width: 960px !important;
        }

        body.hc-content-size-default .glory,
        body.hc-content-size-default .b-newest_slider_wrapper,
        body.hc-content-size-default .b-wrapper {
            width: auto !important;
            min-width: 960px;
            max-width: 960px;
        }

        /* 1150px */

        body.hc-content-size-wide .glory,
        body.hc-content-size-wide .b-newest_slider_wrapper,
        body.hc-content-size-wide .b-wrapper {
            width: auto !important;
            min-width: 960px;
            max-width: 1150px;
        }

        /* 1340px */

        body.hc-content-size-ultrawide .glory,
        body.hc-content-size-ultrawide .b-newest_slider_wrapper,
        body.hc-content-size-ultrawide .b-wrapper {
            width: auto !important;
            min-width: 960px;
            max-width: 1340px;
        }

        /* 1530px */

        body.hc-content-size-ultraultrawide .glory,
        body.hc-content-size-ultraultrawide .b-newest_slider_wrapper,
        body.hc-content-size-ultraultrawide .b-wrapper {
            width: auto !important;
            min-width: 960px;
            max-width: 1530px;
        }

        /* 100% */

        body.hc-content-size-full .glory,
        body.hc-content-size-full .b-newest_slider_wrapper,
        body.hc-content-size-full .b-wrapper {
            width: auto !important;
            min-width: 960px;
        }

        /* Newest Slider */

        .b-newest_slider_wrapper {
            margin: auto
        }

        /* !css */

        `);

        window.addEventListener("resize", () => r4.player.fit());

        r4.settings.afterStart(() => {
            const viewport = document.querySelector("meta[name=viewport]");
            viewport.setAttribute('content', 'width=640');
        });

        function isCssApplied(element, property, value) {
            const styles = window.getComputedStyle(element);
            return styles.getPropertyValue(property) === value;
        }

        async function cssReady(element, property, value) {
            let retries = 0;

            return new Promise((resolve) => {
                function check() {
                    if (isCssApplied(element, property, value)) {
                        console.log(`CSS is ready for`, element);
                        resolve();
                    } else {
                        console.log(`CSS is not ready for`, element);
                        retries++;
                        if (retries > 20) {
                            resolve();
                        } else {
                            setTimeout(check, 100);
                        }
                    }
                }

                check();
            });
        }

        r4.settings?.createTumblerSetting({
            name: "content-size",
            label: "Максимальная ширина",
            submenu: "Интерфейс",
            classes: [],
            options: [
                {
                    value: "hc-content-size-mobile",
                    class: "hc-content-size-mobile",
                    text: "580 px - Мобильный",
                    end: async () => {
                        r4.player.state.resized = false;
                        r4.player.state.min.height = 360;
                        await r4.player.ready();
                        await cssReady(document.querySelector(".b-wrapper"), "max-width", "580px");
                        r4.player.fit();
                    },
                },
                {
                    value: "hc-content-size-default",
                    class: "hc-content-size-default",
                    text: "960 px - Оригинальный",
                    default: true,
                    end: async () => {
                        r4.player.state.resized = false;
                        r4.player.state.min.height = 0;
                        await r4.player.ready();
                        await cssReady(document.querySelector(".b-wrapper"), "max-width", "960px");
                        r4.player.fit();
                    },
                },
                {
                    value: "hc-content-size-wide",
                    class: "hc-content-size-wide",
                    text: "1150 px",
                    end: async () => {
                        r4.player.state.resized = false;
                        r4.player.state.min.height = 0;
                        await r4.player.ready();
                        await cssReady(document.querySelector(".b-wrapper"), "max-width", "1150px");
                        r4.player.fit();
                    },
                },
                {
                    value: "hc-content-size-ultrawide",
                    class: "hc-content-size-ultrawide",
                    text: "1340 px",
                    end: async () => {
                        r4.player.state.resized = false;
                        r4.player.state.min.height = 0;
                        await r4.player.ready();
                        await cssReady(document.querySelector(".b-wrapper"), "max-width", "1340px");
                        r4.player.fit();
                    },
                },
                {
                    value: "hc-content-size-ultraultrawide",
                    class: "hc-content-size-ultraultrawide",
                    text: "1530 px",
                    end: async () => {
                        r4.player.state.resized = false;
                        r4.player.state.min.height = 0;
                        await r4.player.ready();
                        await cssReady(document.querySelector(".b-wrapper"), "max-width", "1530px");
                        r4.player.fit();
                    },
                },
                {
                    value: "hc-content-size-full",
                    class: "hc-content-size-full",
                    text: "100%",
                    end: async () => {
                        r4.player.state.resized = false;
                        r4.player.state.min.height = 0;
                        await r4.player.ready();
                        r4.player.fit();
                    },
                },
            ],
        });
    }

    /* ------------------------------------------------- */
    /* --------------PLAYER-NO-MARGIN------------------- */
    /* ------------------------------------------------- */

    function initPlayerNoMargin() {
        GM.addStyle(`

        /* css */

        body.hc-player-no-margin .b-translators__block,
        body.hc-player-no-margin div:has(>.b-player),
        body.hc-player-no-margin .b-post__social_holder_wrapper {
            margin-left: -30px;
            margin-right: -30px;
        }

        body.hc-player-no-margin .hc-hide-info-button {
            right: -10px;
        }

        body.hc-player-no-margin.hc-hide-info .b-content__columns {
            padding-top: 0 !important;
        }

        /* !css */

        `);

        r4.settings?.createTumblerSetting({
            name: "player-no-margin",
            label: "Без отступов",
            submenu: "Плеер",
            classes: [],
            options: [
                {
                    value: false,
                    text: "Выкл",
                    default: true,
                    end: async () => {
                        r4.player.fit();
                    },
                },
                {
                    value: true,
                    class: "hc-player-no-margin",
                    text: "Вкл",
                    end: async () => {
                        r4.player.fit();
                    },
                },
            ],
        });
    }

    /* ------------------------------------------------- */
    /* --------------PLAYER-SCALE----------------------- */
    /* ------------------------------------------------- */

    function initPlayerScale() {
        GM.addStyle(`

        /* css */

        body.hc-player-scale-1-5-x.hc-player-cover:not(.hc-playing) .hc-player-top-bar {
            padding: 10px;
        }
        body.hc-player-scale-1-5-x.hc-player-cover.hc-hide-info:not(.hc-playing) .hc-player-top-bar-cover {
            width: 100px;
        }
        body.hc-player-scale-1-5-x.hc-player-cover.hc-hide-info .hc-player-top-bar-heading {
            width: calc(100% - 100px - 10px);
        }

        body.hc-player-scale-2-0-x.hc-player-cover:not(.hc-playing) .hc-player-top-bar {
            padding: 10px;
        }
        body.hc-player-scale-2-0-x.hc-player-cover.hc-hide-info:not(.hc-playing) .hc-player-top-bar-cover {
            width: 50px;
        }
        body.hc-player-scale-2-0-x.hc-player-cover.hc-hide-info .hc-player-top-bar-heading {
            width: calc(100% - 50px - 10px);
        }

        /* !css */

        `);

        r4.settings?.createTumblerSetting({
            name: "player-scale",
            label: "Масштабирование",
            submenu: "Плеер",
            classes: [],
            options: [
                {
                    value: "hc-player-scale-1-0-x",
                    text: "1x",
                    default: true,
                    reload: true,
                    end: async () => {},
                },
                {
                    value: "hc-player-scale-1-5-x",
                    class: "hc-player-scale-1-5-x",
                    text: "1.5x",
                    end: async () => {
                        r4.player.state.scale = 1.5;
                        r4.player.scale();
                    },
                },
                {
                    value: "hc-player-scale-2-0-x",
                    class: "hc-player-scale-2-0-x",
                    text: "2x",
                    end: async () => {
                        r4.player.state.scale = 2;
                        r4.player.scale();
                    },
                },
            ],
        });
    }

    /* ------------------------------------------------- */
    /* --------------NAVBAR-LINKS----------------------- */
    /* ------------------------------------------------- */

    function initNavbarLinks() {

        r4.settings?.createTumblerSetting({
            name: "navbar-links",
            label: "Ссылки в панели навигации",
            submenu: "Интерфейс",
            classes: [],
            options: [
                {
                    value: "hc-navbar-links-default",
                    text: "Выкл",
                    end: () => setNavbarLinksDefaultFilter(null),
                },
                {
                    value: "hc-navbar-links-last",
                    class: "hc-navbar-links-last",
                    text: "Последние поступления",
                    end: () => setNavbarLinksDefaultFilter("last"),
                },
                {
                    value: "hc-navbar-links-popular",
                    class: "hc-navbar-links-popular",
                    text: "Популярные",
                    end: () => setNavbarLinksDefaultFilter("popular"),
                },
                {
                    value: "hc-navbar-links-soon",
                    class: "hc-navbar-links-soon",
                    text: "В ожидании",
                    end: () => setNavbarLinksDefaultFilter("soon"),
                },
                {
                    value: "hc-navbar-links-watching",
                    class: "hc-navbar-links-watching",
                    text: "Сейчас смотрят",
                    end: () => setNavbarLinksDefaultFilter("watching"),
                },
            ],
        });

        function setNavbarLinksDefaultFilter(filter) {
            function replace(elem) {
                const url = new URL(elem.href);
                url.search = filter ? new URLSearchParams({ filter }).toString() : "";
                elem.href = url;
            }

            const navbar = document.querySelector(".b-topnav");
            if (navbar) {
                navbar.querySelectorAll(".b-topnav__item-link").forEach(replace);
                navbar.querySelectorAll(".b-topnav__sub_inner .left a").forEach(replace);
            }
        }
    }

    /* ------------------------------------------------- */
    /* --------------PLAYER-SUBTITLES------------------- */
    /* ------------------------------------------------- */
    function initPlayerSubtitles(options = {}) {

        GM.addStyle(`

        /* css */

        /* Subtitles */

        .hc-subtitles-list-wrapper {
            position: absolute;
            left: 0;
            right: 0;
            bottom: 100px;
            max-height: calc(100% - 110px);
            box-sizing: border-box !important;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;
            z-index: 1;
            width: 400px !important;
            right: 0;
            left: auto;
        }

        .hc-subtitles-list-container,
        .hc-subtitles-list-params {
            box-sizing: border-box;
            overflow: hidden;
            overflow-y: auto;
            -webkit-overflow-scrolling: touch;
            background: rgba(23, 35, 34, .7);
            border-radius: 2.3px;
        }

        .hc-subtitles-list-container {
            height: 100%;
            min-height: 120px;
        }

        .hc-subtitles-list-params {
            min-height: 34px;
            margin-bottom: 10px;
        }

        .hc-subtitles-list-error {
            padding: 20px;
            margin-bottom: 5px;
            box-sizing: border-box;
            border: 2px solid red;
            bottom: 0;
            max-height: 100%;
            font-size: 12px;
            background: rgba(23, 35, 34, .5);
            border-radius: 2.3px;
            left: 0;
            right: 0;
        }

        .hc-subtitles-list {
            bottom: 0;
        }

        /* Scrollbars */

        .hc-subtitles-list-wrapper {
            margin: 0 5px 0 10px;
        }

        .hc-subtitles-list-container,
        .hc-subtitles-list-params,
        .hc-subtitles-list-error {
            margin-right: 5px;
            position: relative;
        }

        .hc-subtitles-list-wrapper,
        .hc-subtitles-list-wrapper * {
            scrollbar-width: thin;
            scrollbar-color: rgba(23, 35, 34, .7) rgba(23, 35, 34, .5);
        }

        .hc-subtitles-list-wrapper::-webkit-scrollbar,
        .hc-subtitles-list-wrapper *::-webkit-scrollbar {
            width: 20px;
        }

        .hc-subtitles-list-wrapper::-webkit-scrollbar-track,
        .hc-subtitles-list-wrapper *::-webkit-scrollbar-track {
            background-color: transparent;
        }

        .hc-subtitles-list-wrapper::-webkit-scrollbar-thumb,
        .hc-subtitles-list-wrapper *::-webkit-scrollbar-thumb {
            background-color: rgba(23, 35, 34, .7);
            border-radius: 20px;
            border: 5px solid transparent;
            background-clip: padding-box;
        }

        /* Subtitles params */

        .hc-subtitles-list-param .hc-subtitles-list-param-title {
            float: left;
            font-size: 12px;
            position: relative;
            padding: 10px 15px;
            margin-right: 90px;
            overflow-wrap: break-word;
        }

        .hc-subtitles-list-param .hc-subtitles-list-param-input {
            float: right;
            background: rgba(43, 55, 54, .7);
            border: 0;
            width: 20px;
            color: white;
            text-align: center;
            margin: -2px 0px;
            border-radius: 3px;
            margin: 7px 15px;
        }

        .hc-subtitles-list-param.hc-subtitles-list-param-shift .hc-subtitles-list-param-input::-webkit-outer-spin-button,
        .hc-subtitles-list-param.hc-subtitles-list-param-shift .hc-subtitles-list-param-input::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
        }

        .hc-subtitles-list-param.hc-subtitles-list-param-shift .hc-subtitles-list-param-input {
            -moz-appearance: textfield;
        }

        /* Subtitles head */

        .hc-subtitles-list-container .hc-subtitles-list-head {
            font-size: 12px;
            border-bottom: 1px solid rgba(100, 100, 100, 0.7);
        }

        .hc-subtitles-list-container .hc-subtitles-list-head .hc-subtitles-item-title {
            position: relative;
            padding: 10px 15px;
            margin-right: 100px;
            overflow-wrap: break-word;
        }

        .hc-subtitles-list-container .hc-subtitles-list-head .hc-subtitles-list-params-button {
            font-size: 10px;
            line-height: 20px;
            float: right;
            padding: 7px 15px;
            text-align: center;
            cursor: pointer;
        }

        /* Subtitles loader */

        .hc-subtitles-list-container .hc-subtitles-list-loader {
            content: "";
            background-size: 48px 48px;
            background-repeat: no-repeat;
            background-image: url(${r4.images.loader});
            display: block;
            position: absolute;
            top: calc(50% + 17px);
            left: 50%;
            width: 48px;
            height: 48px;
            margin-top: -24px;
            margin-left: -24px;
            animation: spin 1s infinite linear;
            filter: invert(100%);
        }

        /* Subtitles list */

        .hc-subtitles-list .hc-subtitles-item {
            position: relative;
            display: inline-block;
            cursor: pointer;
            pointer-events: all;
            width: 100%;
            box-sizing: border-box;
            transition: opacity 0.1s linear 0s, background 0.1s linear 0s, transform 0.1s linear 0s;
            font-size: 12px;
        }

        .hc-subtitles-list .hc-subtitles-item:hover {
            background: rgba(0, 173, 239, .7);
        }

        .hc-subtitles-list .hc-subtitles-item.active {
            color: rgba(0, 173, 239, .7);
        }

        .hc-subtitles-list .hc-subtitles-item .hc-subtitles-item-title {
            position: relative;
            padding: 10px 15px;
            margin-right: 40px;
            overflow-wrap: break-word;
        }

        .hc-subtitles-list .hc-subtitles-item .hc-subtitles-item-lang {
            position: relative;
            padding: 7px 15px 7px 0;
            float: right;
            width: 25px;
            text-align: center;
        }

        /* Subtitles settings */

        .hc-setting-opensubtitles-key .r4-setting-text-value {
            display: block;
        }

        .hc-setting-opensubtitles-key .hc-opensubtitles-login,
        .hc-setting-opensubtitles-key .hc-opensubtitles-logout {
            float: right;
        }

        .hc-setting-opensubtitles-key .hc-opensubtitles-login {
            width: 100%;
            display: flex;
        }

        body.hs-opensubtitles-logged-in .hc-opensubtitles-login,
        body:not(.hs-opensubtitles-logged-in) .hc-opensubtitles-logout {
            display: none;
        }

        .hc-setting-opensubtitles-key .hc-opensubtitles-input {
            border: 0;
            border-radius: 20px;
            background: #222d33;
            background-color: #000;
            color: #fff;
            margin: 4px 0;
            width: 70px;
            font-size: 12px;
            padding: 3px 10px;
            margin-right: 10px;
            flex: auto
        }

        body.hc-style.b-theme__template__night .hc-setting-opensubtitles-key .hc-opensubtitles-input {
            background-color: #222d33;
        }

        .hc-setting-opensubtitles-key .hc-opensubtitles-button {
            height: 30px;
            background-color: #000;
            border: #1d92b2;
            border-radius: 30px;
            font-size: 12px;
            color: #fff;
            padding: 3px 10px;
        }

        .hc-setting-opensubtitles-key .hc-opensubtitles-login .hc-opensubtitles-button {
            width: 52px;
        }

        .hc-setting-opensubtitles-key .hc-opensubtitles-logout .hc-opensubtitles-button {
            width: 60px;
        }

        body.hc-style.b-theme__template__night .hc-setting-opensubtitles-key .hc-opensubtitles-button {
            background-color: #222d33;
        }

        .hc-setting-opensubtitles-error {
            padding-top: 5px;
            padding-bottom: 5px;
            float: left;
            color: red;
        }

        /* !css */

        `);

        const HELP_LINK = `<a href="https://www.opensubtitles.com">opensubtitles.com</a>`;
        const HELP_TOOLTIP =
            /* html */
            `
            <!-- html -->
            <span class="r4-tooltip" style="float: right; margin-right: -5px;">
                <span class="r4-tooltip-icon">i</span>
                <div class="tooltiptext">

                    <div>Настройка аккаунта</div>
                    <ol style="list-style: auto; margin-left: 15px;">
                        <li style="margin-top: 5px;">Перейти на сайт ${HELP_LINK}</li>
                        <li style="margin-top: 5px;">Зарегистрироваться</li>
                        <li style="margin-top: 5px;">Подтвердить регистрацию</li>
                        <li style="margin-top: 5px;">Ввести имя/пароль от созданного аккаунта</li>
                    </ol>

                    <div style="margin-top: 5px;">Использование</div>
                    <ol style="list-style: auto; margin-left: 15px;">
                        <li style="margin-top: 5px;">Настройка "Дополнительные элементы управления плеером" должна быть включена</li>
                        <li style="margin-top: 5px;">
                            Для поиска субтитров нажать кнопку расположенную
                            в правом нижнем углу плеера
                        </li>
                        <li style="margin-top: 5px;">
                            Выбрать в списке подходящие субтитры
                        </li>
                        <li style="margin-top: 5px;">
                            После нажатия на пункт списка плеер загрузит и отобразит выбрананые субтитры
                        </li>
                        <li style="margin-top: 5px;">
                            При рассинхранизации есть 2 способа синхронизировать видео и субтитры
                            <ul style="list-style: circle; margin-left: 15px;">
                                <li style="margin-top: 5px;">В настройках плеера (максимум ±5 секунд)</li>
                                <li style="margin-top: 5px;">В списке найденых субтитров перед выбором выставить значение в колонке "Сдвиг" (в секундах)</li>
                            </ul>
                        </li>
                    </ol>


                    <div style="margin-top: 15px;">
                        <small>
                            Способы увеличения количества загрузок:
                            <br>
                            <a href="https://www.opensubtitles.com/en/users/vip">opensubtitles.com/en/users/vip</a>
                        </small>
                    </div>
                </div>
            </span>
            <!-- !html -->
        `;

        const elements = {
            settingWrapper: null,
            subtitlesListWrapper: null,
            subtitlesListError: null,
            subtitlesListParams: null,
            subtitlesListContainer: null,
            subtitlesListLoader: null,
            subtitlesList: null,
        }

        const state = {
            opened: false,
            data: {
                download: {},
            }
        }

        function createSettingWrapper() {
            elements.settingWrapper = r4.utils.fromHTML(
                /* html */
                `
                <!-- html -->
                <div class="r4-setting hc-setting-opensubtitles-key">
                    <span class="r4-setting-text-value hc-setting-opensubtitles-error"></span>
                    <div class="r4-setting-text-block">
                        <span class="r4-setting-text-value">${HELP_LINK}</span>
                        <span class="r4-setting-text-value hc-settings-text-profile"></span>
                        <span class="r4-setting-text-value hc-settings-text-download"></span>
                    </div>
                    ${HELP_TOOLTIP}
                    <form class="hc-opensubtitles-login">
                        <input class="hc-opensubtitles-input" name="username" placeholder="Username" type="text">
                        <input class="hc-opensubtitles-input" name="password" placeholder="Password" type="password">
                        <input class="hc-opensubtitles-button" type="submit" value="Вход">
                    </form>
                    <form class="hc-opensubtitles-logout">
                        <input class="hc-opensubtitles-button" type="submit" value="Выход">
                    </form>
                </div>
                <!-- !html -->
                `
            );

            elements.settingWrapper.querySelector("form.hc-opensubtitles-login").addEventListener("submit", login);
            elements.settingWrapper.querySelector("form.hc-opensubtitles-logout").addEventListener("submit", logout);

            r4.settings?.afterStart(async () => {
                const key = await r4.settings.getSetting("hs-opensubtitles-key");
                if (key) {
                    document.body.classList.add("hs-opensubtitles-logged-in");
                    loadProfile(key);
                }
            });

            return elements.settingWrapper;
        }

        function login(event) {
            event.preventDefault();
            clearError();
            const formData = new FormData(event.target);
            GM.xmlHttpRequest({
                method: "POST",
                url: "https://api.opensubtitles.com/api/v1/login",
                data: JSON.stringify({
                    username: formData.get('username'),
                    password: formData.get('password'),
                }),
                headers: {
                    "Api-Key": options?.key,
                    "Content-Type": "application/json",
                    "User-Agent": r4.useragent,
                },
                onload(response) {
                    console.debug(`Response ${response.status} for ${response.finalUrl}`, {response});
                    if (response.status !== 200) {
                        showError(parseOpensubtitlesError(response));
                        return;
                    }
                    const responseJSON = JSON.parse(response.responseText);
                    r4.settings.setSetting("hs-opensubtitles-key", responseJSON.token);
                    document.body.classList.add("hs-opensubtitles-logged-in");
                    loadProfile(responseJSON.token);
                },
                onerror(e) {
                    console.debug("Error:", {e});
                    showError("Something went wrong");
                },
            });
        }

        function logout(event) {
            event.preventDefault();
            r4.settings.setSetting("hs-opensubtitles-key", "");
            document.body.classList.remove("hs-opensubtitles-logged-in");
            state.data.download = {
                allowed_downloads: null,
                remaining_downloads: null,
                reset_time_utc: null,
            }
            clearUserData();
            clearDownloadData();
            clearError();
        }

        function createRemainingTime(time_utc) {
            const diff = (new Date(time_utc) - new Date()) / 1000;
            const hours = Math.floor(diff / (60 * 60));
            const minutes = `0${Math.floor((diff % (60 * 60)) / 60)}`;
            const seconds = `0${Math.floor(diff % 60)}`;
            return `${hours}:${minutes.slice(minutes.length - 2)}:${seconds.slice(seconds.length - 2)}`;
        }

        function showDownloadData() {
            clearDownloadData();
            const downloadSpan = elements.settingWrapper.querySelector(".hc-settings-text-download");
            if (state.data.download.allowed_downloads) {
                const allowed_downloads = state.data.download.allowed_downloads;
                downloadSpan.innerHTML += `<p>Разрешено загрузок в день: ${allowed_downloads}</p>`;
            }
            if (state.data.download.remaining_downloads) {
                let remaining_downloads = state.data.download.remaining_downloads;
                if (remaining_downloads < 0) {
                    remaining_downloads = 0;
                }
                downloadSpan.innerHTML += `<p>Осталось загрузок: ${remaining_downloads}</p>`;
            }
            if (state.data.download.reset_time_utc) {
                const remaining = createRemainingTime(state.data.download.reset_time_utc);
                if (remaining.startsWith("-")) {
                    state.data.download = {
                        allowed_downloads: state.data.download.allowed_downloads,
                        remaining_downloads: null,
                        reset_time_utc: null,
                    };
                } else {
                    downloadSpan.innerHTML += `<p>Сброс счетчика через ${remaining}</p>`;
                }
            }
        }

        function clearDownloadData() {
            const downloadSpan = elements.settingWrapper.querySelector(".hc-settings-text-download");
            downloadSpan.innerHTML = "";
        }

        function showError(text) {
            const textErrorSpan = elements.settingWrapper.querySelector(".hc-setting-opensubtitles-error");
            textErrorSpan.innerHTML = text;
        }

        function clearError() {
            const textErrorSpan = elements.settingWrapper.querySelector(".hc-setting-opensubtitles-error");
            textErrorSpan.innerHTML = "";
        }

        function clearUserData() {
            const profileSpan = elements.settingWrapper.querySelector(".hc-settings-text-profile");
            profileSpan.innerHTML = "";
            clearDownloadData();
        }

        function showUserData(id) {
            const profileSpan = elements.settingWrapper.querySelector(".hc-settings-text-profile");
            profileSpan.innerHTML = `Идентификатор пользователя: ${id}`;
            showDownloadData();
        }

        function loadProfile(key) {
            GM.xmlHttpRequest({
                method: "GET",
                url: "https://api.opensubtitles.com/api/v1/infos/user",
                headers: {
                    "Api-Key": options?.key,
                    "Authorization": `Bearer ${key || ""}`,
                    "User-Agent": r4.useragent,
                    "Content-Type": "application/json",
                },
                onload(response) {
                    console.debug(`Response ${response.status} for ${response.finalUrl}`, {response});
                    if (response.status !== 200) {
                        showError(parseOpensubtitlesError(response));
                        return;
                    }
                    const responseJSON = JSON.parse(response.responseText);
                    state.data.download = {
                        allowed_downloads: responseJSON.data.allowed_downloads,
                        remaining_downloads: responseJSON.data.remaining_downloads,
                        reset_time_utc: responseJSON.data.reset_time_utc,
                    };
                    showUserData(responseJSON.data.user_id);
                },
                onerror(e) {
                    console.debug("Error:", {e});
                    showError("Something went wrong");
                },
            });
        }

        function parseOpensubtitlesError(response) {
            localStorage.setItem("hc-opensubtitles-error-status", response.status);
            localStorage.setItem("hc-opensubtitles-error-text", response.responseText);
            try {
                const responseJSON = JSON.parse(response.responseText);
                if (responseJSON.message) {
                    return responseJSON.message;
                }
                if (responseJSON.errors) {
                    return responseJSON.errors.join("<br>");
                }
                return responseJSON;
            } catch (e) {
                return response.responseText;
            }
        }

        function showSubtitlesListError(innerHTML) {
            elements.subtitlesListError.classList.remove("hidden");
            elements.subtitlesListError.innerHTML = innerHTML;
        }

        function hideSubtitlesListError() {
            elements.subtitlesListError.classList.add("hidden");
        }

        function getImdbId(imdbUrl) {
            showSubtitlesListLoader();
            return new Promise((resolve) => {
                GM.xmlHttpRequest({
                    method: "POST",
                    headers: {
                        "Referer": location.href,
                        "User-Agent": r4.useragent,
                    },
                    url: imdbUrl,
                    onload(response) {
                        console.debug(`Response ${response.status} for ${response.finalUrl}`, {response});
                        hideSubtitlesListLoader();
                        if (response.status !== 200) {
                            resolve();
                            return;
                        }
                        const pageConstPattern = /<meta property="imdb:pageConst" content="tt(?<id>[^"]*)"[\/]{0,1}>/;
                        const pageConstResult = pageConstPattern.exec(response.responseText);
                        if (!pageConstResult?.groups?.id) {
                            console.debug("Can't find id on imdb");
                            resolve();
                            return;
                        }
                        resolve(pageConstResult.groups.id);
                        hideSubtitlesListError();
                    },
                    onerror(e) {
                        console.debug("Error:", {e});
                        hideSubtitlesListLoader();
                        resolve();
                    },
                });
            });
        }

        async function searchSubtitles(params, key) {
            return new Promise((resolve) => {
                showSubtitlesListLoader();
                GM.xmlHttpRequest({
                    method: "GET",
                    url: `https://api.opensubtitles.com/api/v1/subtitles?${new URLSearchParams(params)}`,
                    headers: {
                        "Api-Key": options?.key,
                        "Authorization": `Bearer ${key || ""}`,
                        "User-Agent": r4.useragent,
                    },
                    onload(response) {
                        console.debug(`Response ${response.status} for ${response.finalUrl}`, {response});
                        hideSubtitlesListLoader();
                        if (response.status !== 200) {
                            showSubtitlesListError(parseOpensubtitlesError(response));
                            resolve();
                            return;
                        }
                        const responseJSON = JSON.parse(response.responseText);
                        if (responseJSON.total_count === 0) {
                            showSubtitlesListError("No subtitles found");
                            resolve();
                            return;
                        }
                        resolve(responseJSON);
                        hideSubtitlesListError();
                    },
                    onerror(e) {
                        console.debug("Error:", {e});
                        showSubtitlesListError("Something went wrong");
                        hideSubtitlesListLoader();
                        resolve();
                    },
                });
            });
        }

        async function loadSubtitlesLink(data, key) {
            return new Promise((resolve) => {
                showSubtitlesListLoader();
                GM.xmlHttpRequest({
                    method: "POST",
                    url: "https://api.opensubtitles.com/api/v1/download",
                    data: JSON.stringify(data),
                    headers: {
                        "Api-Key": options?.key,
                        "Authorization": `Bearer ${key || ""}`,
                        "User-Agent": r4.useragent,
                        "Content-Type": "application/json",
                    },
                    onload(response) {
                        console.debug(`Response ${response.status} for ${response.finalUrl}`, {response});
                        hideSubtitlesListLoader();
                        if (response.status !== 200) {
                            showSubtitlesListError(parseOpensubtitlesError(response));
                            resolve();
                            return;
                        }
                        const responseJSON = JSON.parse(response.responseText);
                        state.data.download = {
                            allowed_downloads: responseJSON.remaining + responseJSON.requests,
                            remaining_downloads: responseJSON.remaining,
                            reset_time_utc: responseJSON.reset_time_utc,
                        };
                        resolve(responseJSON.link);
                        hideSubtitlesListError();
                    },
                    onerror(e) {
                        console.debug("Error:", {e});
                        showSubtitlesListError("Something went wrong");
                        hideSubtitlesListLoader();
                        resolve();
                    },
                });
            });
        }

        function pageSubtitles(data, key) {
            for (const item of data || []) {
                for (const file of item.attributes.files) {
                    const playerSubtitlesItem = r4.utils.fromHTML(
                        /* html */
                        `
                        <!-- html -->
                        <li class="hc-subtitles-item">
                            <div class="hc-subtitles-item-lang">${item.attributes.language}</div>
                            <div class="hc-subtitles-item-title">${file.file_name || item.attributes.release}</div>
                        </li>
                        <!-- !html -->
                        `
                    );

                    playerSubtitlesItem.addEventListener("click", async (event) => {
                        Array.from(playerSubtitlesItem.parentElement.children).forEach((elem) => {
                            elem.classList.remove("active");
                        });
                        playerSubtitlesItem.classList.add("active");
                        const shift = elements.subtitlesListParams.querySelector(
                            ".hc-subtitles-list-param-shift .hc-subtitles-list-param-input"
                        ).value;
                        const link = await loadSubtitlesLink({
                            file_id: file.file_id,
                            timeshift: shift,
                        }, key);
                        if (link) {
                            await r4.player.subtitle(link);
                            closeSubtitles();
                        }
                    });

                    elements.subtitlesList.appendChild(playerSubtitlesItem);
                }
            }
        }

        async function findSubtitles(url) {
            const params = {}
            const id = await getImdbId(url);
            if (id) {
                console.debug(`Search subtitles by imdb id: ${id}`);
                params.imdb_id = id;
            } else {
                const query = r4.player.orig_title() || r4.player.title();
                console.debug(`Search subtitles by query: ${query}`);
                params.query = query;
            }
            params.languages = "en,uk,ru";
            params.page = 1;
            params.season_number = r4.player.season();
            params.episode_number = r4.player.episode();

            const key = await r4.settings.getSetting("hs-opensubtitles-key");

            let data = await searchSubtitles(params, key);
            pageSubtitles(data?.data, key);
            if (data?.total_pages > 1) {
                for (let page = 2; page <= data.total_pages; page++) {
                    params.page = page;
                    data = await searchSubtitles(params, key);
                    pageSubtitles(data?.data, key);
                }
            }
        }

        function openSubtitles() {
            const imdbLink = document.querySelector(".b-post__info_rates.imdb a");
            if (!imdbLink) return;
            if (!r4.player.elements.video) return;

            elements.subtitlesListWrapper.classList.remove("hidden");

            if (Array.from(elements.subtitlesList.querySelectorAll(".hc-subtitles-item")).length === 0) {
                findSubtitles(imdbLink.href);
            }

            state.opened = true;

            const interval = setInterval(() => {
                if (state.opened) {
                    r4.player.elements.oframecdnplayer.dispatchEvent(new Event("mousemove"));
                } else {
                    clearInterval(interval);
                }
            }, 1000);
        }

        function closeSubtitles() {
            if (!r4.player.elements.video) return;
            elements.subtitlesListWrapper.classList.add("hidden");
            state.opened = false;
        }

        function clearSubtitles() {
            elements.subtitlesList.querySelectorAll(".hc-subtitles-item").forEach((elem) => {
                elem.remove();
            });
            closeSubtitles();
        }

        function toggleSubtitles() {
            if (elements.subtitlesListWrapper.classList.contains("hidden")) {
                openSubtitles();
            } else {
                closeSubtitles();
            }
        }

        function showSubtitlesListLoader() {
            elements.subtitlesListLoader.classList.remove("hidden");
        }

        function hideSubtitlesListLoader() {
            elements.subtitlesListLoader.classList.add("hidden");
        }

        window.addEventListener("message", (event) => {
            switch (event.data?.event) {
                case "inited":
                    r4.player.elements.oframecdnplayer?.appendChild(elements.subtitlesListWrapper);
                    break;
            }
        });

        r4.settings?.addElementSetting(createSettingWrapper(), {
            submenu: "Субтитры",
        });

        r4.settings?.afterStart(() => {
            elements.subtitlesListWrapper = r4.utils.fromHTML(
                /* html */
                `
                <!-- html -->
                <div class="hc-subtitles-list-wrapper hidden">
                    <div class="hc-subtitles-list-error hidden"></div>
                    <div class="hc-subtitles-list-params hidden">
                        <div class="hc-subtitles-list-param hc-subtitles-list-param-shift">
                            <input class="hc-subtitles-list-param-input" type="number" value="0">
                            <div class="hc-subtitles-list-param-title">Сдвиг</div>
                        </div>
                    </div>
                    <div class="hc-subtitles-list-container">
                        <div class="hc-subtitles-list-head">
                            <div class="hc-subtitles-list-params-button">Параметры загрузки</div>
                            <div class="hc-subtitles-item-title">Название</div>
                        </div>
                        <ul class="hc-subtitles-list"></ul>
                        <div class="hc-subtitles-list-loader hidden"></div>
                    </div>
                </div>
                <!-- !html -->
                `
            )
            elements.subtitlesListError = elements.subtitlesListWrapper.querySelector(".hc-subtitles-list-error");
            elements.subtitlesListParams = elements.subtitlesListWrapper.querySelector(".hc-subtitles-list-params");
            elements.subtitlesListContainer = elements.subtitlesListWrapper.querySelector(".hc-subtitles-list-container");
            elements.subtitlesListLoader = elements.subtitlesListContainer.querySelector(".hc-subtitles-list-loader");
            elements.subtitlesList = elements.subtitlesListContainer.querySelector(".hc-subtitles-list");

            elements.subtitlesListWrapper.querySelector(".hc-subtitles-list-params-button").addEventListener("click", () => {
                elements.subtitlesListParams.classList.toggle("hidden");
            });
        });

        setInterval(() => {
            showDownloadData();
        }, 1000);

        return {
            toggle: toggleSubtitles,
            clear: clearSubtitles,
        };
    }

    /* ------------------------------------------------- */
    /* --------------PLAYER-EXTRA-CONTROLS-------------- */
    /* ------------------------------------------------- */

    function initPlayerExtraControls() {
        GM.addStyle(`

        /* css */

        body.hc-player-full-page {
            height: 100%;
            overflow: hidden;
        }

        body.hc-player-full-page .b-player {
            display: flex;
            flex-direction: column;
            position: fixed !important;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            width: 100% !important;
            height: 100% !important;
            z-index: 1000;
        }

        body.hc-player-full-page #cdnplayer-container {
            width: 100% !important;
            height: 100% !important;
        }

        body.hc-player-full-page #cdnplayer {
            width: 100% !important;
            height: 100% !important;
        }

        body.hc-player-full-page .b-post__status_wrapper {
            display: none !important;
        }

        body.hc-player-full-page .b-simple_seasons__list {
            margin: 0;
        }

        body.hc-player-full-page .b-simple_seasons__list {
            display: none !important;
        }

        body.hc-player-full-page .b-simple_episodes__list {
            display: none !important;
        }

        body.hc-player-full-page footer {
            display: none !important;
        }

        .hc-player-top-bar {
            display: none;
            box-sizing: border-box !important;
            position: absolute;
            width: 100%;
            top: 0;
            left: 0;
            padding: 10px;
            background: linear-gradient(
                to bottom,
                rgba(0, 0, 0, .6) 0%,
                rgba(0, 0, 0, .1) 70%,
                rgba(0, 0, 0, 0) 100%
            );
            pointer-events: none;
            z-index: 1;
            transition: all .5s ease-out;
        }


        body.hc-player-cover:not(.hc-playing) .hc-player-top-bar {
            padding: 30px;
            transition: all .5s ease-in;
        }

        .hc-player-top-bar-enabled .hc-player-top-bar {
            display: block;
        }

        .hc-player-top-bar:hover {
            display: block !important;
            visibility: visible !important;
        }

        .hc-player-top-bar-heading {
            display: inline-block;
            margin-bottom: 20px;
            width: calc(100% - 200px - 10px);
        }

        .hc-player-top-bar-cover {
            float: left;
            margin-right: 10px;
            width: 43px;
            border-radius: 3px;
            transition: all .5s ease-out;
        }

        body.hc-player-cover.hc-hide-info:not(.hc-playing) .hc-player-top-bar-cover {
            width: 200px;
            border-radius: 7px;
            transition: all .5s ease-in;
        }

        .hc-player-top-bar-title {
            display: inline-block;
            cursor: pointer;
            position: relative;
            text-align: left;
            line-height: 20px;
            font-size: 20px;
            font-weight: bold;
            pointer-events: all;
            padding-left: 10px;
            user-select: none;
        }

        body.hc-player-full-page .hc-player-top-bar-title {
            padding-left: 30px;
        }

        .hc-player-top-bar-origtitle {
            display: inline-block;
            position: relative;
            text-align: left;
            line-height: 14px;
            font-size: 14px;
            pointer-events: all;
            padding-left: 10px;
            user-select: none;
            padding-top: 5px;
            opacity: 70%;
        }

        body.hc-player-full-page .hc-player-top-bar-origtitle {
            padding-left: 30px;
        }

        .hc-player-top-bar-episode {
            display: inline-block;
            position: relative;
            text-align: left;
            line-height: 14px;
            font-size: 12px;
            pointer-events: all;
            padding-left: 10px;
            user-select: none;
            padding-top: 5px;
            opacity: 50%;
        }

        body.hc-player-full-page .hc-player-top-bar-episode {
            padding-left: 30px;
        }

        body.hc-player-full-page .hc-player-top-bar-title:before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 20px;
            height: 20px;
            margin-right: 10px;
            background-size: 20px 20px;
            background-repeat: no-repeat;
            background-image: url(${r4.images.arrow});
            filter: invert(100%) sepia(95%) saturate(21%) hue-rotate(280deg) brightness(106%) contrast(106%);
            transform: rotate(-90deg);
        }

        .hc-player-control {
            display: none;
            content: '';
            position: relative;
            float: left;
            cursor: pointer;
            pointer-events: all;
            z-index: 2;
            border-radius: 2.3px;
            background: rgba(23, 35, 34, .7);
            transition: opacity 0.1s linear 0s, background 0.1s linear 0s, transform 0.1s linear 0s;
            cursor: point;
        }

        .hc-player-control:hover {
            background: rgba(0, 173, 239, .7);
        }

        .hc-player-extra-controls-enabled .hc-player-control {
            display: block;
        }

        .hc-player-extra-controls-enabled .hc-player-extra-controls-hidden {
            display: none !important;
        }

        .hc-player-controls-left {
            position: absolute;
            bottom: 56px;
            left: 10px;
        }

        .hc-player-controls-left .hc-player-control {
            margin-right: 10px;
        }

        .hc-player-controls-right {
            position: absolute;
            bottom: 56px;
            right: 10px;
        }

        .hc-player-controls-right .hc-player-control {
            margin-left: 10px;
        }

        .hc-player-control-prev,
        .hc-player-control-next,
        .hc-player-control-replay,
        .hc-player-control-forward {
            width: 28px;
            height: 35px;
        }

        .hc-player-control-expand,
        .hc-player-control-pip,
        .hc-player-control-subtitles {
            width: 41px;
            height: 35px;
        }

        body:not(.hs-opensubtitles-logged-in) .hc-player-control-subtitles {
            display: none;
        }

        .hc-player-control-icon {
            content: '';
            position: absolute;
            background-repeat: no-repeat;
            filter: invert(100%);
        }

        .hc-player-control-prev-icon {
            top: 10px;
            left: 7px;
            width: 15px;
            height: 15px;
            background-size: 15px 15px;
            background-image: url(${r4.images.next});
            transform: rotate(180deg);
        }

        .hc-player-control-next-icon {
            top: 10px;
            left: 7px;
            width: 15px;
            height: 15px;
            background-size: 15px 15px;
            background-image: url(${r4.images.next});
        }

        .hc-player-control-replay-icon {
            top: 10px;
            left: 7px;
            width: 15px;
            height: 15px;
            background-size: 15px 15px;
            background-image: url(${r4.images.replay});
        }

        .hc-player-control-forward-icon {
            top: 10px;
            left: 7px;
            width: 15px;
            height: 15px;
            background-size: 15px 15px;
            background-image: url(${r4.images.forward});
        }

        .hc-player-control-expand-icon {
            top: 8px;
            right: 11px;
            width: 20px;
            height: 20px;
            background-size: 20px 20px;
            background-image: url(${r4.images.expand});
        }

        .hc-player-control-pip-icon {
            top: 8px;
            right: 11px;
            width: 20px;
            height: 20px;
            background-size: 20px 20px;
            background-image: url(${r4.images.pip});
        }

        .hc-player-control-subtitles-icon {
            top: 8px;
            right: 11px;
            width: 20px;
            height: 20px;
            background-size: 20px 20px;
            background-image: url(${r4.images.subtitles});
        }

        body.hc-player-full-page .hc-player-control-expand-icon {
            background-image: url(${r4.images.collapse}) !important;
            transform: rotate(-90deg);
        }

        body.hc-player-full-page .b-footer {
            margin-top: 0 !important;
        }

        .hc-player-control-large-next,
        .hc-player-control-large-prev {
            position: absolute;
            width: 100%;
            height: 200%;
            top: -50%;
            background: #00000000;
            border-radius: 50%;
            transition: background-color 0.5s ease;
            display: none;
        }

        .hc-player-extra-controls-enabled.hc-player-triple-click-enabled .hc-player-control-large-next,
        .hc-player-extra-controls-enabled.hc-player-triple-click-enabled .hc-player-control-large-prev {
            display: block;
        }

        .hc-player-control-large-next {
            right: -75%;
        }

        .hc-player-control-large-prev {
            left: -75%;
        }

        .hc-player-control-large-prev.active:before,
        .hc-player-control-large-next.active:before {
            content: '';
            background-repeat: no-repeat;
            background-size: 30px 30px;
            background-position: center;
            height: 100%;
            width: 100%;
            position: absolute;
            filter: invert(100%) sepia(95%) saturate(21%) hue-rotate(280deg) brightness(106%) contrast(106%);
            opacity: .5;
        }

        .hc-player-control-large-prev.active:before {
            margin-left: calc(75% / 2);
        }

        .hc-player-control-large-next.active:before {
            margin-left: calc(-75% / 2);
        }

        .hc-player-control-large-prev.replay:before {
            background-image: url(${r4.images.replay});
        }

        .hc-player-control-large-next.forward:before {
            background-image: url(${r4.images.forward});
        }

        .hc-player-control-large-prev.prev:before {
            background-image: url(${r4.images.next});
            transform: rotate(180deg);
        }

        .hc-player-control-large-next.next:before {
            background-image: url(${r4.images.next});
        }

        .hc-player-control-large-prev.active,
        .hc-player-control-large-next.active {
            background: #00000070;
        }

        #oframecdnplayer > pjsdiv {
            z-index: 1;
        }

        #oframecdnplayer > pjsdiv[style*="width: 100%; height: 100%;"] {
            z-index: 0;
        }

        /* !css */

        `);

        const config = {
            multiClick: {
                delay: 500,
                timeout: 350,
            }
        }

        const elements = {
            topBar: null,
            controlsLeft: null,
            controlsRight: null,
            controlsLargePrev: null,
            controlsLargeNext: null,
        };

        r4.settings?.afterStart(() => {

            elements.controlsLeft = r4.utils.fromHTML(
                /* html */
                `
                <!-- html -->
                <div class="hc-player-controls-left">
                    <div class="hc-player-control hc-player-control-prev">
                        <div class="hc-player-control-icon hc-player-control-prev-icon"></div>
                    </div>
                    <div class="hc-player-control hc-player-control-next">
                        <div class="hc-player-control-icon hc-player-control-next-icon"></div>
                    </div>
                    <div class="hc-player-control hc-player-control-replay">
                        <div class="hc-player-control-icon hc-player-control-replay-icon"></div>
                    </div>
                    <div class="hc-player-control hc-player-control-forward">
                        <div class="hc-player-control-icon hc-player-control-forward-icon"></div>
                    </div>
                </div>
                <!-- !html -->
                `
            );

            elements.controlsRight = r4.utils.fromHTML(
                /* html */
                `
                <!-- html -->
                <div class="hc-player-controls-right">
                    <div class="hc-player-control hc-player-control-subtitles">
                        <div class="hc-player-control-icon hc-player-control-subtitles-icon"></div>
                    </div>
                    <div class="hc-player-control hc-player-control-pip">
                        <div class="hc-player-control-icon hc-player-control-pip-icon"></div>
                    </div>
                    <div class="hc-player-control hc-player-control-expand">
                        <div class="hc-player-control-icon hc-player-control-expand-icon"></div>
                    </div>
                </div>
                <!-- !html -->
                `
            );

            elements.controlsLeft.querySelectorAll(".hc-player-control").forEach(playerControlFreeze);
            elements.controlsRight.querySelectorAll(".hc-player-control").forEach(playerControlFreeze);

            elements.controlsLeft.querySelector(".hc-player-control-prev").addEventListener("click", r4.player.prev);
            elements.controlsLeft.querySelector(".hc-player-control-next").addEventListener("click", r4.player.next);
            elements.controlsLeft.querySelector(".hc-player-control-replay").addEventListener("mousedown", () => r4.player.startadjusting(-5));
            elements.controlsLeft.querySelector(".hc-player-control-replay").addEventListener("mouseup", r4.player.stopadjusting);
            elements.controlsLeft.querySelector(".hc-player-control-forward").addEventListener("mousedown", () => r4.player.startadjusting(5));
            elements.controlsLeft.querySelector(".hc-player-control-forward").addEventListener("mouseup", r4.player.stopadjusting);

            elements.controlsRight.querySelector(".hc-player-control-subtitles").addEventListener("click", () => {
                r4.subtitles.toggle();
            });
            elements.controlsRight.querySelector(".hc-player-control-expand").addEventListener("click", toggle);

            const cover = document.querySelector(".b-sidecover img");

            elements.topBar = r4.utils.fromHTML(
                /* html */
                `
                <!-- html -->
                <div class="hc-player-top-bar">
                    <div class="hc-player-top-bar-heading">
                        <div><span class="hc-player-top-bar-title"></span></div>
                        <div><span class="hc-player-top-bar-origtitle"></span></div>
                        <div><span class="hc-player-top-bar-episode"></span></div>
                    </div>
                    <img class="hc-player-top-bar-cover" src="${cover?.src || ''}"></div>
                </div>
                <!-- !html -->
                `
            );

            elements.topBar.querySelector(".hc-player-top-bar-title").addEventListener("click", toggle);

            elements.controlsLargePrev = createControlLarge(
                "hc-player-control-large-prev",
                r4.player.toggle,
                r4.player.togglefullscreen,
                (event) => playerControlLargeAction(event, "prev", r4.player.prev),
                (event) => playerControlLargeAction(event, "replay", () => r4.player.adjust(-5)),
            );

            elements.controlsLargeNext = createControlLarge(
                "hc-player-control-large-next",
                r4.player.toggle,
                r4.player.togglefullscreen,
                (event) => playerControlLargeAction(event, "prev", r4.player.next),
                (event) => playerControlLargeAction(event, "forward", () => r4.player.adjust(5)),
            );
        });

        function appendElements() {
            if (r4.player.elements.oframecdnplayer) {
                r4.player.elements.oframecdnplayer.appendChild(elements.topBar);
                r4.player.elements.oframecdnplayer.appendChild(elements.controlsLeft);
                r4.player.elements.oframecdnplayer.appendChild(elements.controlsRight);
                r4.player.elements.oframecdnplayer.appendChild(elements.controlsLargePrev);
                r4.player.elements.oframecdnplayer.appendChild(elements.controlsLargeNext);
                initPIPControl(r4.player.elements.oframecdnplayer);
                if (!document.querySelector(".b-simple_episodes__list")) {
                    r4.player.elements.oframecdnplayer.querySelector(".hc-player-control-prev").classList.add("hidden");
                    r4.player.elements.oframecdnplayer.querySelector(".hc-player-control-next").classList.add("hidden");
                    r4.player.elements.oframecdnplayer.querySelector(".hc-player-control-large-prev").classList.add("hidden");
                    r4.player.elements.oframecdnplayer.querySelector(".hc-player-control-large-prev").classList.add("hidden");
                }
            }
        }

        function collapse() {
            document.body.classList.remove("hc-player-full-page");
            r4.player.state.expanded = false;
            r4.player.state.collapsed = true;
            r4.player.fit();
        }

        function expand() {
            document.body.classList.add("hc-player-full-page");
            r4.player.state.expanded = true;
        }

        function toggle() {
            if (r4.player.state.fullscreen == false) {
                if (r4.player.state.expanded == true) {
                    collapse();
                } else if (r4.player.state.expanded == false) {
                    expand();
                }
            } else {
                r4.player.exitfullscreen();
            }
        }

        function setTitle() {
            if (!elements.topBar) return;
            const postTitle = document.querySelector(".b-post__title h1");
            if (!postTitle) return;
            elements.topBar.querySelector(".hc-player-top-bar-title").innerText = postTitle.innerText;
        }

        function setOrigTitle() {
            if (!elements.topBar) return;
            const postOrigTitle = document.querySelector(".b-post__origtitle");
            if (!postOrigTitle) return;
            elements.topBar.querySelector(".hc-player-top-bar-origtitle").innerText = postOrigTitle.innerText;
        }

        function setSeasonAndEpisode() {
            if (!elements.topBar) return;
            const season = r4.player.season();
            const episode = r4.player.episode();
            if (!(season && episode)) return;
            elements.topBar.querySelector(".hc-player-top-bar-episode").innerText = `Сезон ${season} - Серия ${episode}`;
        }

        function initPIPControl(player) {
            const playerControlPIP = elements.controlsRight.querySelector(".hc-player-control-pip")
            playerControlPIP.classList.add("hidden");
            Array.from(player.querySelectorAll('pjsdiv[style*="top: 20px;"]')).forEach((elem) => {
                if (!elem) return;

                const pip = elem.querySelector('pjsdiv[style*="top: -17.5px; left: -17.5px;"]');
                if (!pip) return;

                new MutationObserver(() => {
                    if (elem.style.display === "none") {
                        playerControlPIP.classList.add("hidden");
                        elem.classList.remove("hc-player-extra-controls-hidden");
                    } else {
                        playerControlPIP.classList.remove("hidden");
                        elem.classList.add("hc-player-extra-controls-hidden");
                    }
                }).observe(elem, {
                    attributes: true,
                    attributeFilter: ["style"],
                });

                playerControlPIP.addEventListener("click", () => {
                    pip.click();
                });
            });
        }

        function playerControlFreeze(elem) {
            let mouseon = false;

            elem.addEventListener("mouseenter", () => {
                mouseon = true;
                const interval = setInterval(() => {
                    if (mouseon) {
                        r4.player.elements.oframecdnplayer.dispatchEvent(new Event("mousemove"));
                    } else {
                        clearInterval(interval);
                    }
                }, 1000);
            });

            elem.addEventListener("mouseleave", () => {
                mouseon = false;
            });
        }

        function createControlLarge(className, singleClick, doubleClick, tripleClick, multiClick) {
            const playerControlLarge = document.createElement("div");
            playerControlLarge.classList.add(className);

            let clicks = 0;
            let timer;

            playerControlLarge.addEventListener("click", (event) => {
                clearTimeout(timer);
                clicks++;
                if (clicks < 4) {
                    timer = setTimeout(() => {
                        if (clicks == 1) singleClick(event);
                        else if (clicks == 2) doubleClick(event);
                        else if (clicks == 3) tripleClick(event);
                        clicks = 0;
                    }, config.multiClick.timeout);
                } else {
                    multiClick(event);
                    timer = setTimeout(() => {
                        clicks = 0;
                    }, config.multiClick.timeout);
                }
            });

            return playerControlLarge;
        }

        function playerControlLargeAction(event, actionClass, callback) {
            event.target.classList.add("active");
            event.target.classList.add(actionClass);
            setTimeout(() => {
                event.target.classList.remove("active");
                event.target.classList.remove(actionClass);
                callback();
            }, config.multiClick.delay);
        }

        window.addEventListener("message", (event) => {
            switch (event.data?.event) {
                case "init":
                    appendElements();
                    setTitle();
                    setOrigTitle();
                    setSeasonAndEpisode();
                    break;
                case "new":
                    setSeasonAndEpisode();
                    r4.subtitles.clear();
                    break;
                case "play":
                    if (!r4.player.state.collapsed && document.body.classList.contains("hc-player-full-page-enabled")) {
                        expand();
                    }
                    break;
                case "ui":
                    elements.topBar.classList.toggle("hidden", !event.data.data);
                    elements.controlsLeft.classList.toggle("hidden", !event.data.data);
                    elements.controlsRight.classList.toggle("hidden", !event.data.data);
                    break;
            }
        });

        document.addEventListener("keydown", (e) => {
            switch (e.code) {
                case "Escape":
                    if (r4.player.state.fullscreen == false) {
                        collapse();
                    }
                    break;
            }
        });

        r4.settings?.createTumblerSetting({
            name: "player-top-bar",
            label: "Дополнительная панель с заголовком",
            submenu: "Плеер",
            classes: ["r4-on-of-tumbler"],
            options: [
                {
                    value: "hc-player-top-bar-disabled",
                    text: "Выкл",
                },
                {
                    value: "hc-player-top-bar-enabled",
                    class: "hc-player-top-bar-enabled",
                    text: "Вкл",
                    default: true,
                },
            ],
        });
        r4.settings?.createTumblerSetting({
            name: "player-extra-controls",
            label: "Дополнительные элементы управления",
            submenu: "Плеер",
            classes: ["r4-on-of-tumbler"],
            options: [
                {
                    value: "hc-player-extra-controls-disabled",
                    text: "Выкл",
                },
                {
                    value: "hc-player-extra-controls-enabled",
                    class: "hc-player-extra-controls-enabled",
                    text: "Вкл",
                    default: true,
                },
            ],
        });
        r4.settings?.createTumblerSetting({
            name: "player-triple-click",
            label: "Переключение серий тройным кликом",
            submenu: "Плеер",
            classes: ["r4-on-of-tumbler"],
            options: [
                {
                    value: "hc-player-triple-click-disabled",
                    text: "Выкл",
                },
                {
                    value: "hc-player-triple-click-enabled",
                    class: "hc-player-triple-click-enabled",
                    text: "Вкл",
                },
            ],
        });
        r4.settings?.createTumblerSetting({
            name: "player-full-page",
            label: "Автоматическое разворачивание",
            submenu: "Плеер",
            classes: ["r4-on-of-tumbler"],
            options: [
                {
                    value: "hc-player-full-page-disabled",
                    text: "Выкл",
                },
                {
                    value: "hc-player-full-page-enabled",
                    class: "hc-player-full-page-enabled",
                    text: "Вкл",
                },
            ],
        });
    }

    /* ------------------------------------------------- */
    /* --------------PLAYER-AUTO-PLAY-NEXT-------------- */
    /* ------------------------------------------------- */

    function initAutoPlayNext() {
        window.addEventListener("message", (event) => {
            switch (event.data?.event) {
                case "ended":
                    if (document.body.classList.contains("hc-auto-play-next-enabled")) {
                        r4.player.next();
                    }
                    break;
                case "time":
                    if (
                        event.data.data != 0 &&
                        event.data.data >= event.data.duration - 1 &&
                        document.body.classList.contains("hc-auto-play-next-disabled")
                    ) {
                        r4.player.stop();
                    }
                    break;
            }
        });

        r4.settings?.createTumblerSetting({
            name: "auto-play-next",
            label: "Автопереключение серий",
            submenu: "Плеер",
            classes: [],
            options: [
                {
                    value: "hc-auto-play-next-default",
                    text: "Как в настройках профиля (серии или выкл)",
                },
                {
                    value: "hc-auto-play-next-enabled",
                    class: "hc-auto-play-next-enabled",
                    text: "Быстрое переключение (серии и сезоны)",
                },
                {
                    value: "hc-auto-play-next-disabled",
                    class: "hc-auto-play-next-disabled",
                    text: "Выкл",
                },
            ],
        });
    }

    /* ------------------------------------------------- */
    /* --------------HIDE-ADS--------------------------- */
    /* ------------------------------------------------- */

    function initHideAds() {
        GM.addStyle(`

        /* css */

        /* Hide some ads containers */

        body.hc-hide-ads .b-content__main > .b-post__mixedtext + div[style][id],
        body.hc-hide-ads .b-content__main > .b-post__rating_table + div[style][id],
        body.hc-hide-ads .b-content__main > div > .b-player > .b-player__network_issues_holder + div[style]:not([class]),
        body.hc-hide-ads .b-content__main > div > .b-player > a[target='_blank'],
        body.hc-hide-ads .b-content__main + div[id],
        body.hc-hide-ads .b-content__inline > .b-content__inline_inner > .b-content__inline_items + div[id],
        body.hc-hide-ads .b-wrapper .nopadd,
        body.hc-hide-ads .b-seriesupdate__block_list > .b-seriesupdate__block_list_item[data-url=''],
        body.hc-hide-ads > div[style*='position: fixed;'],
        body.hc-hide-ads > ins,
        body.hc-hide-ads .b-post__rating_table + ins,
        body.hc-hide-ads .ad-branding {
            display: none !important;
        }

        /* Active brand fixes */
        body.hc-hide-ads.active-brand,
        body.hc-hide-ads.active-brand.pp {
            padding-top: 0 !important;
        }
        @media screen {
            body.hc-hide-ads.active-brand,
            body.hc-hide-ads.active-brand.pp {
                padding-top: 0 !important;
            }
        }
        body.hc-hide-ads.active-brand #wrapper {
            width: auto !important;
        }

        /* !css */

        `);

        r4.settings?.createTumblerSetting({
            name: "hide-ads",
            label: "Скрытие рекламных блоков",
            submenu: "Интерфейс",
            classes: ["r4-on-of-tumbler"],
            options: [
                {
                    value: "hc-hide-ads-disabled",
                    text: "Выкл",
                    end: () => {
                        r4.player.fit();
                    }
                },
                {
                    value: "hc-hide-ads",
                    class: "hc-hide-ads",
                    text: "Вкл",
                    default: true,
                    end: () => {
                        r4.player.fit();
                    }
                },
            ],
        });
    }

    /* ------------------------------------------------- */
    /* --------------HIDE-PLAYER-ADS-------------------- */
    /* ------------------------------------------------- */

    function initHidePlayerAds() {
        r4.settings?.createTumblerSetting({
            name: "hide-player-ads",
            label: "Отключение рекламных роликов",
            submenu: "Плеер",
            classes: ["r4-on-of-tumbler"],
            options: [
                {
                    value: "hc-player-hide-ads-disabled",
                    text: "Выкл",
                    start() {
                        r4.player.state.vast = 1;
                        r4.player.vast();
                    },
                },
                {
                    value: "hc-player-hide-ads",
                    class: "hc-player-hide-ads",
                    text: "Вкл",
                    default: true,
                    start() {
                        r4.player.state.vast = 0;
                        r4.player.vast();
                    },
                },
            ],
        });
    }

    /* ------------------------------------------------- */
    /* --------------STYLE-IMPROVEMENTS----------------- */
    /* ------------------------------------------------- */

    function initStyleImprovements() {
        GM.addStyle(`

        /* css */

        /* Top Nav */

        body.hc-style .b-topnav__sub_inner a {
            color: #000 !important;
        }

        body.hc-style.b-theme__template__night .b-topnav__sub_inner a {
            color: #fff !important;
        }

        /* Сontent item */

        body.hc-style .b-content__inline_item .b-content__inline_item-link {
            font-weight: normal;
        }

        body.hc-style .b-content__inline_item .b-content__inline_item-link a,
        body.hc-style .b-content__inline_item .b-content__inline_item-link a:visited {
            color: #000;
        }

        body.hc-style.b-theme__template__night .b-content__inline_item .b-content__inline_item-link a,
        body.hc-style.b-theme__template__night .b-content__inline_item .b-content__inline_item-link a:visited {
            color: #fff;
        }

        body.hc-style .b-content__inline_item .cat {
            position: relative;
            top: unset;
            bottom: 0;
            right: 0;
            border-radius: 0;
            width: 100%;
        }

        body.hc-style.b-theme__template__night .b-content__inline_item .cat {
            background-color: #060f13 !important;
        }

        body.hc-style .b-content__inline_item .cat .entity {
            display: inline-block !important;
            margin-right: -8px;
            position: absolute;
            left: 0;
            right: 0;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        body.hc-style .b-content__inline_item:hover .cat .entity,
        body.hc-style .b-content__inline_item.active .cat .entity {
            display: none !important;
            margin-right: -10px;
            position: absolute;
            left: 0;
            right: 0;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        body.hc-style .b-content__inline_item .info {
            background-color: #222d33;
            color: #fff;
            border-radius: 0 !important;
            box-sizing: border-box;
            width: 100%;
            margin-bottom: 26px;
            font-weight: normal;
        }

        body.hc-style .b-content__inline_item .trailer {
            display: none !important;
            left: 0;
        }

        body.hc-style .b-content__inline_item-cover {
            padding: 0;
            border: 0;
        }

        body.hc-style .b-content__inline_item-cover img {
            width: 100%;
            height: auto;
        }

        /* Slider */

        body.hc-style.b-theme__template__night .b-newest_slider {
            border-color: #fff;
            color: #fff;
        }

        body.hc-style.b-theme__template__night .b-newest_slider .b-newest_slider__title span {
            border-color: #fff;
            color: #fff;
        }

        body.hc-style .b-newest_slider .b-content__inline_item .cat {
            display: block;
        }

        /* Сontent page */

        body.hc-style .b-post .b-post__partcontent a,
        body.hc-style .b-post__info a,
        body.hc-style .b-post__info .persons-list-holder .person-name-item a {
            color: #000 !important;
            border-color: #000;
        }

        body.hc-style.b-theme__template__night .b-post .b-post__partcontent a,
        body.hc-style.b-theme__template__night .b-post__info a,
        body.hc-style.b-theme__template__night .b-post__info .persons-list-holder .person-name-item a {
            color: #fff !important;
            border-color: #fff;
        }

        body.hc-style .b-sidecover {
            background: none;
            border: none;
            padding: 0;
            overflow: hidden;
            border-radius: 4px;
        }

        body.hc-style .b-post .b-sidetitle,
        body.hc-style .b-post .b-post__mtitle {
            font-size: 16px;
            font-weight: bold;
            line-height: 18px;
            overflow: hidden;
            padding: 10px 18px;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        body.hc-style .b-post .b-post__actions .btn,
        body.hc-style .b-post .b-sidetitle,
        body.hc-style .b-post .b-post__schedule_block_title,
        body.hc-style .b-post .b-post__schedule_more,
        body.hc-style .b-post .b-post__mtitle {
            background: #ddd;
        }
        body.hc-style .b-post .b-post__actions .btn,
        body.hc-style .b-post .b-sidetitle,
        body.hc-style .b-post .b-post__schedule_block_title .title,
        body.hc-style .b-post .b-post__schedule_more .title,
        body.hc-style .b-post .b-post__mtitle {
            color: #000;
        }
        body.hc-style.b-theme__template__night .b-post .b-post__actions .btn,
        body.hc-style.b-theme__template__night .b-post .b-sidetitle,
        body.hc-style.b-theme__template__night .b-post .b-post__schedule_block_title,
        body.hc-style.b-theme__template__night .b-post .b-post__schedule_more,
        body.hc-style.b-theme__template__night .b-post .b-post__mtitle {
            background: #192125;
        }
        body.hc-style.b-theme__template__night .b-post .b-post__actions .btn,
        body.hc-style.b-theme__template__night .b-post .b-sidetitle,
        body.hc-style.b-theme__template__night .b-post .b-post__schedule_block_title .title,
        body.hc-style.b-theme__template__night .b-post .b-post__schedule_more .title,
        body.hc-style.b-theme__template__night .b-post .b-post__mtitle {
            color: #fff;
        }
        body.hc-style .b-post .b-post__schedule .b-sidetitle {
            display: none;
        }
        body.hc-style .b-post .b-post__partcontent {
            margin-top: 0;
        }
        body.hc-style .b-post .b-post__actions .btn {
            border: 0;
            border-radius: 0;
        }
        body.hc-style .b-post .b-post__social_holder {
            background: #1f1f1f;
        }

        /* Rating stars */

        body.hc-style .b-content__bubble_rating .b-rating > .current,
        body.hc-style .b-post__rating .b-post__rating_layer_current {
            filter: grayscale(100%) !important;
        }
        body.hc-style.b-theme__template__night .b-content__bubble_rating .b-rating > .current,
        body.hc-style.b-theme__template__night .b-post__rating .b-post__rating_layer_current {
            filter: grayscale(100%) brightness(200%) !important;
        }

        body.hc-style .b-content__bubble_rating b {
            color: #000;
        }
        body.hc-style.b-theme__template__night .b-content__bubble_rating b {
            color: #fff;
        }

        body.hc-style .b-post__rating .num {
            color: inherit !important;;
        }

        /* Breadcrumbs */

        body.hc-style .b-content__crumbs a {
            color: #444;
        }

        body.hc-style.b-theme__template__night .b-content__crumbs a {
            color: #fff;
        }

        /* Comments */

        body.hc-style .comments-form {
            background: none;
        }

        body.hc-style .b-comment__like_it > i {
            display: none;
        }

        body.hc-style .b-comment__likes_count {
            margin: 0 !important;
        }

        body.hc-style .b-comment__quoteuser,
        body.hc-style .b-comment__like_it,
        body.hc-style.b-theme__template__night .b-comment__quoteuser,
        body.hc-style.b-theme__template__night .b-comment__like_it {
            color: #888;
            border-color: #888;
        }

        body.hc-style .b-comment .message > .text {
            color: #000;
        }

        body.hc-style.b-theme__template__night .b-comment .message > .text {
            color: #fff;
        }

        /* Content bubble */

        body.hc-style .b-content__bubble_content a {
            color: #000;
        }

        body.hc-style.b-theme__template__night .b-content__bubble_content a {
            color: #fff;
        }

        /* Player translation, season, episode styles */

        body.hc-style .b-translators__block {
            background: #000;
            padding: 5px 10px 10px 10px;
        }

        body.hc-style .b-rgstats__help,
        body.hc-style .b-translators__title {
            padding-top: 10px;
        }

        body.hc-style .b-simple_seasons__list {
            margin: -10px 0 0 0;
            padding: 5px 10px 10px 10px;
        }

        body.hc-style .b-simple_episodes__list {
            margin: 0;
            padding: 5px 10px 10px 10px;
        }

        body.hc-style .b-translator__item,
        body.hc-style .b-simple_episode__item,
        body.hc-style .b-simple_season__item {
            border-radius: 2.3px;
            background: rgba(23, 35, 34, .7);
            transition: opacity 0.1s linear 0s, background 0.1s linear 0s, transform 0.1s linear 0s;
            margin: 5px 5px 0 0;
            text-align: center;
        }

        body.hc-style .b-translator__item:hover,
        body.hc-style .b-simple_episode__item:hover,
        body.hc-style .b-simple_season__item:hover {
            background: rgba(0, 173, 239, .7);
        }

        body.hc-style .b-translator__item.active,
        body.hc-style .b-simple_episode__item.active,
        body.hc-style .b-simple_season__item.active {
            background: rgba(89, 105, 102, .7) !important;
        }

        body.hc-style .hc-toggle-translators-button {
            margin-top: 10px;
        }

        /* Misc */

        body.hc-style .b-newest_slider__title {
            padding-bottom: 20px;
        }

        /* !css */

        `);

        r4.settings?.createTumblerSetting({
            name: "styles",
            label: "Декоративные изменения",
            submenu: "Интерфейс",
            classes: ["r4-on-of-tumbler"],
            options: [
                {
                    value: "hc-style-disabled",
                    text: "Выкл",
                },
                {
                    value: "hc-style",
                    class: "hc-style",
                    text: "Вкл",
                    default: true,
                },
            ],
        });
    }

    /* ------------------------------------------------- */
    /* --------------FONTS------------------------------ */
    /* ------------------------------------------------- */

    function initFonts() {
        function addFont(fontName, fontClass, fontData) {
            Object.keys(fontData).forEach((weight) => {
                const value = fontData[weight];

                GM.addStyle(`

                /* css */

                @font-face {
                    font-family: ${fontName};
                    src: url(data:font/truetype;base64,${value}) format('truetype');
                    font-weight: ${weight};
                    font-style: normal;
                }

                /* !css */

                `);
            });

            GM.addStyle(`

            /* css */

            body.${fontClass} {
                font-family: ${fontName}, sans-serif !important;
            }

            /* !css */

            `);
        }
        r4.settings?.createTumblerSetting({
            name: "font",
            label: "Шрифт",
            submenu: "Интерфейс",
            classes: [],
            options: [
                {
                    value: "hc-font-default",
                    text: "Стандартный",
                },
                {
                    value: "hc-font-averta-cy",
                    class: "hc-font-averta-cy",
                    text: "Averta-CY",
                    start() {
                        addFont("Averta-CY", "hc-font-averta-cy", r4.fonts["Averta-CY"]);
                    },
                },
            ],
        });
    }

    /* ------------------------------------------------- */
    /* --------------PLAYER-COVER----------------------- */
    /* ------------------------------------------------- */

    function initPlayerCover() {
        r4.settings?.afterEnd(() => {
            const img = document.querySelector(".b-sidecover img")?.src;
            if (!img) return;

            GM.addStyle(`

            /* css */

            body.hc-player-cover #cdnplayer [style*='hc-poster'] {
                background-image: url('${img}') !important;
                background-size: 100% auto !important;
                background-position: center !important;
                background-repeat: no-repeat !important;
                filter: blur(30px);
                z-index: -1;
            }

            /* Add a semi-transparent overlay */
            body.hc-player-cover #cdnplayer [style*='hc-poster']::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                z-index: 0;
            }

            /* Add vignette effect */
            body.hc-player-cover #cdnplayer [style*='hc-poster']::after {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: radial-gradient(
                    circle at center,
                    transparent 20%,
                    rgba(0, 0, 0, 0.6) 60%,
                    rgba(0, 0, 0, 0.8) 100%
                );
                z-index: 1;
            }

            /* !css */

            `);
        });

        r4.settings?.createTumblerSetting({
            name: "player-cover",
            label: "Отображение обложки",
            submenu: "Плеер",
            classes: ["r4-on-of-tumbler"],
            options: [
                {
                    value: "hc-player-cover-disabled",
                    text: "Выкл",
                },
                {
                    value: "hc-player-cover",
                    class: "hc-player-cover",
                    text: "Вкл",
                    default: true,
                },
            ],
        });
    }

    /* ------------------------------------------------- */
    /* --------------HIDE-INFO-------------------------- */
    /* ------------------------------------------------- */

    function initHideInfo() {
        GM.addStyle(`

        /* css */

        /* Content hide info (button) */

        .hc-hide-info-button {
            content: '';
            width: 25px;
            height: 25px;
            margin-right: 5px;
            background-size: 25px 25px;
            background-repeat: no-repeat;
            background-image: url(${r4.images.arrow});
            cursor: pointer;
            z-index: 2;
            position: absolute;
            right: 10px;
            top: 15px;
        }
        .b-post__title {
            position: relative;
        }
        .b-translators__title {
            margin-right: 40px;
        }
        body.hc-hide-info .hc-hide-info-button {
            transform: rotate(180deg);
        }

        /* for light theme make arrow white only when info hidden */
        body:not(.b-theme__template__night).hc-hide-info .hc-hide-info-button,
        /* for dark theme always make arrow white */
        body.b-theme__template__night .hc-hide-info-button {
            filter: invert(100%) sepia(95%) saturate(21%) hue-rotate(280deg) brightness(106%) contrast(106%);
        }

        body.hc-hide-info.hc-hide-title .hc-hide-info-button {
            margin-top: -15px;
        }


        /* Content hide info (hidden styles) */

        body.hc-hide-info .b-post__title [itemprop="name"],
        body.hc-hide-info .b-post__origtitle,
        body.hc-hide-info .b-post__infotable,
        body.hc-hide-info .b-post__description,
        body.hc-hide-info .b-post__infolast {
            display: none !important;
        }

        /* Hide Ukraie block info */

        .b-player-block-strip,
        .b-player-block-inform,
        .b-player-block-inform2 {
            top: 0 !important;
            margin: 0 0 10px 0 !important;
        }

        body.hc-hide-info .b-player-block-strip,
        body.hc-hide-info .b-player-block-inform,
        body.hc-hide-info .b-player-block-inform2 {
            display: none !important;
        }

        /* !css */

        `);

        r4.settings?.afterEnd(() => {
            const title = document.querySelector(".b-post__title");
            if (!title) return;

            if (title.querySelector(".hc-hide-info-button")) return;

            const button = r4.utils.fromHTML(
                /* html */
                `
                <!-- html -->
                <div class="hc-hide-info-button pull-right"></div>
                <!-- !html -->
                `
            );

            button.addEventListener("click", () => {
                document.body.classList.toggle("hc-hide-info");
            });
            title.insertBefore(button, title.firstChild);
        });

        r4.settings?.createTumblerSetting({
            name: "hide-info",
            label: "Описание",
            submenu: "Автоматическое сворачивание",
            classes: ["r4-on-of-tumbler"],
            options: [
                {
                    value: "hc-hide-info-disabled",
                    text: "Выкл",
                    start() {
                        document.body.classList.remove("hc-hide-info");
                    },
                },
                {
                    value: "hc-hide-info",
                    class: "hc-hide-info",
                    text: "Вкл",
                    start() {
                        document.body.classList.add("hc-hide-info");
                    },
                },
            ],
        });
    }

    /* ------------------------------------------------- */
    /* --------------HIDE-COMMENTS---------------------- */
    /* ------------------------------------------------- */

    function initHideComments() {
        GM.addStyle(`

        /* css */

        body.hc-comments-hide #hd-comments-list,
        body.hc-comments-hide #hd-comments-navigation {
            display: none;
        }

        .hc-comments-title {
            margin-bottom: 13px;
            overflow: hidden;
        }

        .hc-comments-title .title {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            float: left;
        }

        .hc-act {
            color: #878586;
            cursor: pointer;
            float: right;
            font-size: 12px;
            font-weight: normal;
        }

        .hc-act:hover {
            text-decoration: underline;
        }

        .hc-act-show {
            display: none;
        }

        .hc-act-hide {
            display: block;
        }

        body.hc-comments-hide .hc-act-show {
            display: block;
        }

        body.hc-comments-hide .hc-act-hide {
            display: none;
        }

        body.hc-comments-hide .b-content__crumbs {
            margin-top: 30px;
        }

        /* !css */

        `);

        r4.settings?.afterEnd(() => {
            const addCommentTitle = document.querySelector("#addcomment-title");
            if (addCommentTitle) {
                addCommentTitle.innerText = "Твой отзыв";
            }

            const commentsList = document.querySelector("#hd-comments-list");
            if (!commentsList) return;

            const commentsTitle = r4.utils.fromHTML(
                /* html */
                `
                <!-- html -->
                <div class="b-sidetitle hc-comments-title">
                    <div class="title">Отзывы</div>
                    <div class="hc-act hc-act-show">развернуть</div>
                    <div class="hc-act hc-act-hide">свернуть</div>
                </div>
                <!-- !html -->
                `
            );

            commentsTitle.addEventListener("click", () => {
                document.body.classList.toggle("hc-comments-hide");
            });

            document.querySelector("#comments-list-button").addEventListener("click", () => {
                document.body.classList.remove("hc-comments-hide");
            });

            commentsList.parentNode.insertBefore(commentsTitle, commentsList);
        });

        r4.settings?.createTumblerSetting({
            name: "comments-hide",
            label: "Отзывы",
            submenu: "Автоматическое сворачивание",
            classes: ["r4-on-of-tumbler"],
            options: [
                {
                    value: "hc-comments-hide-disabled",
                    text: "Выкл",
                    start() {
                        document.body.classList.remove("hc-comments-hide");
                    },
                },
                {
                    value: "hc-comments-hide-enabled",
                    class: "hc-comments-hide-enabled",
                    text: "Вкл",
                    start() {
                        document.body.classList.add("hc-comments-hide");
                    },
                },
            ],
        });
    }

    /* ------------------------------------------------- */
    /* --------------HIDE-MORE-------------------------- */
    /* ------------------------------------------------- */

    function initHideMore() {
        GM.addStyle(`

        /* css */

        .hc-more-title {;
            cursor: pointer;
            margin-top: 20px;
        }

        .hc-more-title .title {
            float: left;
        }

        body.hc-more-hide .hc-more-title {
            margin-bottom: 20px;
        }

        body.hc-more-hide .hc-more-holder {
            display: none;
        }

        .hc-more-hide-act {
            color: #878586;
            cursor: pointer;
            float: right;
            font-size: 12px;
            font-weight: normal;
        }

        .hc-more-hide-act:hover {
            text-decoration: underline;
        }

        .hc-more-hide-act-show {
            display: none;
        }

        .hc-more-hide-act-hide {
            display: block;
        }

        body.hc-more-hide .hc-more-hide-act-show {
            display: block;
        }

        body.hc-more-hide .hc-more-hide-act-hide {
            display: none;
        }

        /* !css */

        `);

        r4.settings?.afterEnd(() => {
            document.querySelectorAll(".b-content__main > .b-sidelist__holder").forEach((holder) => {
                if (!holder.querySelector(".b-content__inline_item")) return
                if (!holder.previousElementSibling.classList.contains("b-sidetitle")) return

                holder.classList.add("hc-more-holder");

                const title = r4.utils.fromHTML(
                    /* html */
                    `
                    <!-- html -->
                    <div class="b-sidetitle hc-more-title">
                        <div class="title">Смотреть еще</div>
                        <div class="hc-more-hide-act hc-more-hide-act-show">развернуть</div>
                        <div class="hc-more-hide-act hc-more-hide-act-hide">свернуть</div>
                    </div>
                    <!-- !html -->
                    `
                );

                holder.previousElementSibling.replaceWith(title);

                title.addEventListener("click", () => {
                    document.body.classList.toggle("hc-more-hide");
                });
            });
        });

        r4.settings?.createTumblerSetting({
            name: "more-hide",
            label: "Смотреть еще",
            submenu: "Автоматическое сворачивание",
            classes: ["r4-on-of-tumbler"],
            options: [
                {
                    value: "hc-more-hide-disabled",
                    text: "Выкл",
                    start() {
                        document.body.classList.remove("hc-more-hide");
                    },
                },
                {
                    value: "hc-more-hide",
                    class: "hc-more-hide",
                    text: "Вкл",
                    start() {
                        document.body.classList.add("hc-more-hide");
                    },
                },
            ],
        });
    }

    /* ------------------------------------------------- */
    /* --------------TRANSLATORS------------------------ */
    /* ------------------------------------------------- */

    function initHideTranslators() {
        GM.addStyle(`

        /* css */

        /* Content hide translators */

        .hc-translators-hide-enabled .b-translator__item.active {
            cursor: pointer;
        }
        .hc-translators-hide-enabled .hc-toggle-translators-button {
            content: '';
            float: left;
            width: 20px;
            height: 20px;
            margin-right: 3px;
            margin-top: 8px;
            margin-left: 5px;
            background-size: 20px 20px;
            background-repeat: no-repeat;
            background-image: url(${r4.images.arrow});
            filter: invert(100%) sepia(95%) saturate(21%) hue-rotate(280deg) brightness(106%) contrast(106%);
            transform: rotate(90deg);
            cursor: pointer;
        }
        .hc-translators-hide-enabled .hc-show-translators .hc-toggle-translators-button {
            transform: rotate(-90deg);
        }
        .hc-translators-hide-enabled .b-translator__item:not(.active):not(.hc-toggle-translators-button) {
            display: none;
        }
        .hc-translators-hide-enabled .b-translators__title {
            display: none;
        }
        .hc-translators-hide-enabled .hc-show-translators .b-translator__item:not(.active):not(.hc-toggle-translators-button) {
            display: block;
        }
        .hc-translators-hide-enabled .hc-show-translators .b-translators__title {
            display: block;
        }

        /* !css */

        `);

        r4.settings?.afterEnd(() => {
            function toggle() {
                document.querySelector(".b-translators__block").classList.toggle("hc-show-translators");
            }

            const translators = document.querySelector(".b-translators__block");
            if (!translators) return;

            const translatorsList = translators.querySelector(".b-translators__list");
            if (!translatorsList) return;

            const toggler = r4.utils.fromHTML(
                /* html */
                `
                <!-- html -->
                <li class="hc-toggle-translators-button"></li>
                <!-- !html -->
                `
            );
            toggler.addEventListener("click", toggle);
            translatorsList.appendChild(toggler);

            translatorsList.querySelectorAll(".b-translator__item").forEach((button) => {
                button.addEventListener("click", function () {
                    if (this.classList.contains("active")) {
                        toggle();
                    }
                });
            });
        });

        r4.settings?.createTumblerSetting({
            name: "translators",
            label: "Список переводов",
            submenu: "Автоматическое сворачивание",
            classes: ["r4-on-of-tumbler"],
            options: [
                {
                    value: "hc-translators-hide-disabled",
                    text: "Выкл",
                },
                {
                    value: "hc-translators-hide-enabled",
                    class: "hc-translators-hide-enabled",
                    text: "Вкл",
                },
            ],
        });
    }

    /* ------------------------------------------------- */
    /* --------------IMDB-RATING------------------------ */
    /* ------------------------------------------------- */

    function initIMDbRating() {
        GM.addStyle(`

        /* css */

        /* Rating */

        .b-content__inline_item-link > .rating {
            display: none;
        }

        body.hc-imdb .b-content__inline_item-link > .rating {
            display: block;
        }

        .b-content__inline_item-link > .rating {
            position: relative;
            line-height: 15px;
            font-size: 11px;
            font-weight: normal;
            margin-top: 3px;
        }
        .b-content__inline_item-link > .rating .rating-votes {
            font-size: 9px;
        }
        .b-content__inline_item-link > .rating .rating-value {
            padding-left: 29px;
            background-size: auto 24px;
            background-position: left -6px;
            background-repeat: no-repeat;
            background-image: url(${r4.images.imdb});
            color: black;
            filter: invert(69%) sepia(0%) saturate(576%) hue-rotate(139deg) brightness(88%) contrast(98%);  /* https://codepen.io/sosuke/pen/Pjoqqp */
        }
        .b-content__inline_item-link > .rating .rating-value.low {
            filter: invert(30%) sepia(53%) saturate(2254%) hue-rotate(337deg) brightness(97%) contrast(95%);
        }
        .b-content__inline_item-link > .rating .rating-value.medium {
            filter: invert(66%) sepia(77%) saturate(1448%) hue-rotate(347deg) brightness(99%) contrast(91%);
        }
        .b-content__inline_item-link > .rating .rating-value.high {
            filter: invert(68%) sepia(79%) saturate(5115%) hue-rotate(105deg) brightness(99%) contrast(99%);
        }

        /* !css */

        `);

        function setWithExpiry(key, value, ttl) {
            const now = new Date();

            // `item` is an object which contains the original value
            // as well as the time when it's supposed to expire
            const item = {
                value,
                expiry: now.getTime() + ttl,
            };
            localStorage.setItem(key, JSON.stringify(item));
        }

        function getWithExpiry(key) {
            const itemStr = localStorage.getItem(key);
            // if the item doesn't exist, return null
            if (!itemStr) {
                return null;
            }
            const item = JSON.parse(itemStr);
            const now = new Date();
            // compare the expiry time of the item with the current time
            if (now.getTime() > item.expiry) {
                // If the item is expired, delete the item from storage
                // and return null
                localStorage.removeItem(key);
                return null;
            }
            return item.value;
        }

        function getRating(id) {
            return new Promise((resolve, reject) => {
                console.debug(`IMDB Rating: request quick content for id=${id}.`);
                GM.xmlHttpRequest({
                    method: "POST",
                    url: location.origin + "/engine/ajax/quick_content.php",
                    data: `id=${id}&is_touch=1`,
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        "User-Agent": r4.useragent,
                    },
                    onload(response) {
                        console.debug(`Response ${response.status} for ${response.finalUrl}`, {response});
                        // One week ttl in ms
                        const ttl = 7 * 24 * 60 * 60 * 1000;
                        if (response.status !== 200) {
                            console.debug(
                                `IMDB Rating: request quick content for id=${id} failed with ${response.status} status code.`
                            );
                            // Isn't 200 status code
                            reject();
                            return
                        }
                        // Is 200 status code
                        // Find IMDb block
                        const ratingPattern =
                            /<span class="imdb">IMDb: <b>(?<rating>.*)<\/b> <i>\((?<votes>.*)\)<\/i>\<\/span>/;
                        const ratingResult = ratingPattern.exec(response.responseText);
                        if (!ratingResult?.groups?.rating) {
                            // IMDb block not found
                            // Save empty rating to storage to not make new request in next page load
                            // Resolve with empty rating
                            const data = { rating: "", votes: "", id };
                            setWithExpiry(id, data, ttl);
                            resolve(data);
                            console.debug(
                                `IMDB Rating: request quick content for id=${id} success, but no correct data found.`
                            );
                            return;
                        }
                        // IMDb block found
                        // Get actual rating
                        const rating = ratingResult.groups.rating;
                        // Get actual votes count
                        const votes = ratingResult.groups.votes;
                        // Save real rating to Storage
                        // Resolve with real rating
                        const data = {
                            rating,
                            votes,
                            id,
                        };
                        setWithExpiry(id, data, ttl);
                        resolve(data);
                        console.debug(`IMDB Rating: request quick content for id=${id} success.`);
                    },
                    onerror(e) {
                        console.debug(`IMDB Rating: request quick content for id=${id} failed.`);
                        console.debug("Error:", {e});
                        // Request failed
                        reject();
                    },
                });
            });
        }

        function showRating(ratingObject) {
            if (
                ratingObject &&
                ratingObject.id !== null &&
                ratingObject.rating !== null &&
                ratingObject.rating !== ""
            ) {
                // Got rating
                // Find related elements to append rating
                document
                    .querySelectorAll(`[data-id="${ratingObject.id}"] .b-content__inline_item-link`)
                    .forEach((contentItemLinkElement) => {
                        // Check rating wasn't already appended
                        if (!(contentItemLinkElement && !contentItemLinkElement.querySelector(".rating"))) {
                            return;
                        }
                        // Append rating block
                        const rating = ratingObject.rating;
                        let votes;
                        try {
                            votes = parseInt(ratingObject.votes.replace(/\s/g, ""));
                        } catch (e) {
                            console.debug("Error:", {e});
                            votes = 0;
                        }
                        let level;
                        if (votes >= 1000) {
                            if (rating < 5) {
                                level = "low";
                            } else if (rating < 7) {
                                level = "medium";
                            } else {
                                level = "high";
                            }
                        }
                        contentItemLinkElement.innerHTML +=
                        /* html */
                        `
                            <!-- html -->
                            <span class="rating">
                                <span class="rating-value ${level}"><b>${rating}</b></span>
                                <span> / </span>
                                <span class="rating-votes">${parseInt(votes / 1000)}k</span>
                            </span>
                            <!-- !html -->
                        `;
                    });
            }
        }

        async function getAndShowRating(contentItemElement, callback = () => {}, retries = 0) {
            const id = contentItemElement.dataset.id;
            let ratingObject = getWithExpiry(id);
            if (
                ratingObject !== null &&
                ratingObject.id != null &&
                ratingObject.rating != null &&
                ratingObject.votes != null
            ) {
                // Found vaid saved rating in storage
                // Show rating from storage
                showRating(ratingObject);
                callback();
            } else {
                // Rating not found in storage
                // Request rating and then show
                try {
                    ratingObject = await getRating(id)
                    showRating(ratingObject);
                    callback();
                }
                catch (e) {
                    if (retries <= 3) {
                        retries++;
                        setTimeout(() => {
                            getAndShowRating(contentItemElement, callback, retries);
                        }, 1000);
                    } else {
                        callback();
                    }
                }
            }
        }

        async function getAndShowRatings(contentItemElements) {
            if (contentItemElements.length) {
                await getAndShowRating(contentItemElements.shift(), () => {
                    getAndShowRatings(contentItemElements);
                });
            }
        }

        r4.settings?.createTumblerSetting({
            name: "imdb",
            label: "Рейтинг IMDb",
            submenu: "Интерфейс",
            classes: ["r4-on-of-tumbler"],
            options: [
                {
                    value: "hc-imdb-disabled",
                    text: "Выкл",
                },
                {
                    value: "hc-imdb",
                    class: "hc-imdb",
                    text: "Вкл",
                    end: () => getAndShowRatings(Array.from(document.querySelectorAll(".b-content__inline_item"))),
                },
            ],
        });
    }

    /* ------------------------------------------------- */
    /* --------------HOTKEYS---------------------------- */
    /* ------------------------------------------------- */

    function initHotkeys() {
        const HELP_TOOLTIP =
            /* html */
            `
            <!-- html -->
            <span class="r4-tooltip" style="float: right;">
                <span class="r4-tooltip-icon">i</span>
                <div class="tooltiptext">
                    <div>Список горячих клавиш</div>
                    <ul style="margin-top: 15px;">
                        <li style="margin-top: 5px;">ПРОБЕЛ - Плей/Пауза</li>
                        <li style="margin-top: 5px;">F - Полноэкранный режим</li>
                        <li style="margin-top: 5px;">N - Следующий эпизод</li>
                        <li style="margin-top: 5px;">P - Предыдущий эпизод</li>
                    </ul>
                    <div style="margin-top: 15px;">
                        <small>
                            В отличии от оригинальных работают с
                            разу полсле загрузки страницы.
                            В том числе когда плеер не в фокусе
                            или был не в фокусе на момент перевода
                            в полноэкранный режим.
                        </small>
                    </div>
                </div>
            </span>
            <!-- !html -->
        `;

        function setupHotkeys() {
            function hotkeysEnabled() {
                return document.body.classList.contains("hc-hotkeys-enabled");
            }

            function anyActiveInput() {
                const inputs = document.querySelectorAll("input,textarea");
                return Array.from(inputs).includes(document.activeElement);
            }

            function dispatchKeyboardEvent(type, code) {
                const event = new KeyboardEvent(type, { code: code });
                document.dispatchEvent(event);
            }

            function sleep(ms) {
                return new Promise((resolve) => setTimeout(resolve, ms));
            }

            document.addEventListener("keyup", async (e) => {
                if (!hotkeysEnabled()) {
                    return;
                }
                if (anyActiveInput()) {
                    return;
                }
                switch (e.code) {
                    case "KeyF":
                        r4.player.wake();
                        r4.player.enterfullscreen();
                        e.preventDefault();
                        break;
                }
            });

            document.addEventListener("keydown", (e) => {
                if (!hotkeysEnabled()) {
                    return;
                }
                if (anyActiveInput()) {
                    return;
                }
                switch (e.code) {
                    case "KeyN":
                        r4.player.next();
                        e.preventDefault();
                        break;
                    case "KeyP":
                        r4.player.prev();
                        e.preventDefault();
                        break;
                    case "Space":
                        r4.player.wake();
                        r4.player.toggle();
                        e.preventDefault();
                        break;
                    case "ArrowLeft":
                        r4.player.wake();
                        break;
                    case "ArrowRight":
                        r4.player.wake();
                        break;
                }
            });
        }

        r4.settings?.createTumblerSetting({
            name: "hotkeys",
            label: "Улучшеные горячие клавиши",
            submenu: "Плеер",
            classes: ["r4-on-of-tumbler"],
            options: [
                {
                    value: "hc-hotkeys-disabled",
                    text: "Выкл",
                },
                {
                    end: setupHotkeys,
                    value: "hc-hotkeys-enabled",
                    class: "hc-hotkeys-enabled",
                    text: "Вкл",
                    default: true,
                },
            ],
        }, (tumblerSetting) => {
            tumblerSetting.appendChild(r4.utils.fromHTML(HELP_TOOLTIP));
            return tumblerSetting;
        });
    }

    /* ------------------------------------------------- */
    /* --------------THEME-COLOR------------------------ */
    /* ------------------------------------------------- */

    function initBlackThemeColor() {
        function enableBlackThemeColor() {
            let themeColor = document.querySelector('meta[name="theme-color"]');
            if (themeColor) {
                themeColor.setAttribute('content', 'black');
            } else {
                // Fallback - create new tag if none exists
                themeColor = document.createElement('meta');
                themeColor.setAttribute('name', 'theme-color');
                themeColor.setAttribute('content', 'black');
                document.head.appendChild(themeColor);
            }
        }

        r4.settings?.createTumblerSetting({
            name: "theme-color-black",
            label: "Черная цветовая схема браузера",
            submenu: "Интерфейс",
            classes: ["r4-on-of-tumbler"],
            options: [
                {
                    value: false,
                    text: "Выкл",
                    reload: true,
                },
                {
                    start: enableBlackThemeColor,
                    value: true,
                    class: "hc-theme-color-black-enabled",
                    text: "Вкл",
                    default: false,
                },
            ],
        });
    }

    /* ------------------------------------------------- */
    /* --------------HIDE-COUNTRY----------------------- */
    /* ------------------------------------------------- */

    function initHideCountry() {
        GM.addStyle(`

        /* css */

        .hc-russia {
            display: block;
            width: 100%;
            height: 320px;
            background-color: black;
            background-image: url(${r4.images.russia});
            background-size: auto 260px;
            background-repeat: no-repeat;
            background-position: center;
        }

        body:not(.b-theme__template__night) .hc-russia {
            filter: invert(94%);
        }

        .hc-hode-countries-couner-item {
            position: relative;
            text-align: center;
        }

        .hc-hode-countries-couner-item > .b-content__inline_item-cover {
            box-sizing: border-box;
            height: 100%;
        }

        .hc-hode-countries-couner-item .hc-hode-countries-couner {
            border: 5px solid red;
            border-radius: 50%;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            color: white;width: 50%;
            min-width: 70px;
            aspect-ratio : 1 / 1;
            opacity: 50%
        }

        .hc-hode-countries-couner-item .hc-hode-countries-couner > div {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }

        body:not(.b-theme__template__night) .hc-hode-countries-couner-item  .hc-hode-countries-couner > div {
            color: black;
        }

        .hc-hode-countries-couner-item  .hc-hode-countries-couner > div > span {
            display: block;
            font-size: 30px;
            margin: 10px;
        }

        body:not(.hc-hide-countries-hide) .hc-hode-countries-couner-item {
            display: none !important;
        }

        /* !css */

        `);

        r4.settings?.createTumblerSetting({
            name: "hide-countries-mode",
            label: "Режим",
            submenu: "Фильтр по стране",
            classes: [],
            options: [
                {
                    value: "hc-hide-countries-disabled",
                    text: "Выкл",
                },
                {
                    value: "hc-hide-countries-dim",
                    class: "hc-hide-countries-dim",
                    text: "Затемнять",
                    default: true,
                },
                {
                    value: "hc-hide-countries-hide",
                    class: "hc-hide-countries-hide",
                    text: "Скрыть",
                },
            ],
        });

        r4.settings?.createTumblerSetting({
            name: "hide-countries-invert",
            label: "Инверсия",
            submenu: "Фильтр по стране",
            classes: ["r4-on-of-tumbler"],
            options: [
                {
                    value: "hc-hide-countries-invert-disabled",
                    text: "Выкл",
                    end: () =>  makeHiddenCounters(),
                },
                {
                    value: "hc-hide-countries-invert-enabled",
                    class: "hc-hide-countries-invert-enabled",
                    text: "Вкл",
                    end: () => makeHiddenCounters(),
                },
            ],
        });

        const DEFAULT_COUNTRIES = ["Россия", "СССР"];

        function logCountryItem(elem, country) {
            const title = elem.querySelector(".b-content__inline_item-link a").textContent.trim();
            const year = elem
                .querySelector(".b-content__inline_item-link div")
                .textContent.trim()
                .split(",")[0]
                .trim()
                .split("-")[0]
                .trim();
            console.debug(`Mark "${title}, ${year}" as "${country}" content`);
        }

        function showTerroristBanner() {
            const newest = document.querySelector(".b-collections__newest");
            if (!newest) {
                return;
            }
            const russia = r4.utils.fromHTML(
                /* html */
                `
                <!-- html -->
                <a class="hc-russia" href="https://twitter.com/search?q=%23russiaisaterrorisstate" target="_blank"></a>
                <!-- !html -->
                `
            );
            newest.parentElement.insertBefore(russia, newest);
        }

        function slug(word) {
            switch (word) {
                case "Россия":
                    return "russian";
                case "СССР":
                    return "ussr";
                default:
                    return r4.utils.slugify(r4.utils.transliterate(word));
            }
        }

        function countHiddenItems(countries, containerClass) {
            let counter = 0;

            countries.forEach((country) => {
                const countrySlug = slug(country);
                counter += document.querySelectorAll(
                    `.hc-hide-${countrySlug} .${containerClass} .b-content__inline_item.hc-content-${countrySlug}`
                ).length;
            });

            return counter;
        }

        function makeHiddenCounter(countries, containerClass) {
            const counterItemPrev = document.querySelector(`.${containerClass} .hc-hode-countries-couner-item`);
            if (counterItemPrev) counterItemPrev.remove();

            let hiddenCounter = countHiddenItems(countries, containerClass);

            const contentItems = document.querySelectorAll(`.${containerClass} .b-content__inline_item`);
            const contentCounter = contentItems.length;
            const lastItem = contentItems[contentCounter - 1];

            if (Array.from(document.body.classList).includes("hc-hide-countries-invert-enabled")) {
                hiddenCounter = contentCounter - hiddenCounter;
            }

            if (hiddenCounter === 0) return;

            lastItem.style.display = "block"; // Temporary undo possible display:none to get height and width

            const lastCover = lastItem.querySelector(".b-content__inline_item-cover");
            const width = lastCover.offsetWidth;
            const height = lastCover.offsetHeight;

            const counterItem = r4.utils.fromHTML(
                /* html */
                `
                <!-- html -->
                <div class="b-content__inline_item hc-hode-countries-couner-item" style="width:${width}px;height:${height}px;">
                    <div class="b-content__inline_item-cover">
                        <div class="hc-hode-countries-couner">
                            <div>
                                Скрыто
                                <span>${hiddenCounter}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- !html -->
                `
            );

            counterItem.addEventListener("click", (event) => {
                document.body.classList.remove("hc-hide-countries-hide");
                document.body.classList.add("hc-hide-countries-dim");
            });

            lastItem.style.display = "";

            lastItem.parentNode.insertBefore(counterItem, lastItem.nextSibling);
        }

        async function makeHiddenCounters() {
            const countries = await getEnabledCountries();
            makeHiddenCounter(countries, "b-content__inline_items");
            makeHiddenCounter(countries, "b-sidelist");
        }

        async function getEnabledCountries() {
            const value = await r4.settings.getSetting("hide-country-list");
            return (value || "").split(",").filter((str) => str.trim() !== "");
        }

        async function saveEnabledCountries(countries) {
            const value = countries.filter((str) => str.trim() !== "").join(",");
            await r4.settings.setSetting("hide-country-list", value);
        }

        async function addEnabledCountry(countrySlug) {
            const countries = await getEnabledCountries();
            if (!countries.includes(countrySlug)) {
                countries.push(countrySlug);
                await saveEnabledCountries(countries);
            }
        }

        async function removeEnabledCountry(countrySlug) {
            const countries = await getEnabledCountries();
            const index = countries.indexOf(countrySlug);
            if (index !== -1) {
                countries.splice(index, 1);
                await saveEnabledCountries(countries);
            }
        }

        function handleCountry(country) {
            const countrySlug = slug(country);

            GM.addStyle(`

            /* css */

            body.hc-hide-countries-dim:not(.hc-hide-countries-invert-enabled).hc-hide-${countrySlug} .hc-content-${countrySlug},
            body.hc-hide-countries-dim.hc-hide-countries-invert-enabled:not(.hc-hide-${countrySlug}) .hc-content-${countrySlug} {
                filter: brightness(30%);
            }

            body.hc-hide-countries-dim:not(.hc-hide-countries-invert-enabled).hc-hide-${countrySlug} .hc-content-${countrySlug} .b-content__inline_item-cover img,
            body.hc-hide-countries-dim.hc-hide-countries-invert-enabled:not(.hc-hide-${countrySlug}) .hc-content-${countrySlug} .b-content__inline_item-cover img {
                filter: grayscale(1) brightness(20%);
            }

            body.hc-hide-countries-hide:not(.hc-hide-countries-invert-enabled).hc-hide-${countrySlug} .hc-content-${countrySlug},
            body.hc-hide-countries-hide.hc-hide-countries-invert-enabled:not(.hc-hide-${countrySlug}) .hc-content-${countrySlug} {
                display: none;
            }

            /* !css */
            `);

            r4.settings?.createTumblerSetting({
                name: `hide-${countrySlug}`,
                label: country == "Россия" ? "Россия (страна-оккупант, страна-террорист)" : country,
                submenu: "Фильтр по стране",
                classes: ["r4-on-of-tumbler"],
                options: [
                    {
                        text: "Выкл",
                        end: async () => {
                            await removeEnabledCountry(country);
                            await makeHiddenCounters();
                        },
                    },
                    {
                        value: `hc-hide-${countrySlug}`,
                        class: `hc-hide-${countrySlug}`,
                        text: "Вкл",
                        end: async () => {
                            await addEnabledCountry(country);
                            await makeHiddenCounters();
                        },
                    },
                ],
            });
        }

        r4.settings?.afterEnd(async () => {
            // Start countries list with default countries
            let countries = DEFAULT_COUNTRIES;

            // Not specified country
            const NOT_SPECIFIED_COUNTRY = "Страна не указана";

            // Get enabled countries
            const enabledCountries = await getEnabledCountries();

            // Remove NOT_SPECIFIED_COUNTRY to add it at the end
            delete enabledCountries[enabledCountries.indexOf(NOT_SPECIFIED_COUNTRY)];

            // Add enabled countries if they are not already in countries
            countries = countries.concat(enabledCountries.filter((item) => !countries.includes(item)));

            document.querySelectorAll(".b-content__inline_item .b-content__inline_item-link div").forEach((elem) => {
                let country;

                // Exclude slider
                if (elem.closest(".b-newest_slider__list")) return;

                const parts = elem.textContent.split(",");

                // Generate country name for content item
                country = parts.length === 3 ? parts[1].trim() : NOT_SPECIFIED_COUNTRY;

                // Generate country slug
                const countrySlug = slug(country);

                // Mark country content item with class
                const contentElem = elem.closest(".b-content__inline_item");
                contentElem.classList.add(`hc-content-${countrySlug}`);

                // logCountryItem(contentElem, country);

                // Add found countries if they are not already not in countries
                if (!countries.includes(country) && country !== NOT_SPECIFIED_COUNTRY) {
                    countries.push(country);
                }
            });

            // Add NOT_SPECIFIED_COUNTRY
            countries.push(NOT_SPECIFIED_COUNTRY);

            // Process countries
            countries.forEach(handleCountry);

            showTerroristBanner();
        });
    }

    /* ------------------------------------------------- */
    /* --------------SNAP-SCROLL------------------------- */
    /* ------------------------------------------------- */

    function initSnapScroll() {
        GM.addStyle(`
            /* css */
            
            body.hc-snap-scroll .b-player {
                scroll-margin-top: 0;
            }
    
            /* !css */
        `);
    
        // Helper function for scrolling to content
        function scrollToContent(smooth = true) {
            const contentMain = document.querySelector('.b-player');
            if (!contentMain) return;
            
            window.scrollTo({
                top: contentMain.offsetTop,
                behavior: smooth ? 'smooth' : 'auto'
            });
        }
    
        // Scroll snap during scrolling
        r4.settings?.createTumblerSetting({
            name: "snap-scroll",
            label: "Прилипание при прокрутке",
            submenu: "Плеер",
            classes: ["r4-on-of-tumbler"],
            options: [
                {
                    value: "hc-snap-scroll-disabled",
                    text: "Выкл",
                    reload: true,
                },
                {
                    value: "hc-snap-scroll",
                    class: "hc-snap-scroll",
                    text: "Вкл",
                    end: () => {
                        const contentMain = document.querySelector('.b-player');
                        if (!contentMain) return;
    
                        let scrollTimeout;
                        const SNAP_THRESHOLD = 200;
                        
                        function smoothScrollToContent() {
                            // Don't snap if we're at the top of the page
                            if (window.scrollY < 2) return;
                            
                            const contentTop = contentMain.offsetTop;
                            
                            // Only snap if we've scrolled before the start of the content block
                            if (window.scrollY > contentTop) return;
    
                            const contentRect = contentMain.getBoundingClientRect();
                            if (Math.abs(contentRect.top) <= SNAP_THRESHOLD) {
                                window.scrollTo({
                                    top: window.scrollY + contentRect.top,
                                    behavior: 'smooth'
                                });
                            }
                        }
    
                        document.addEventListener('scroll', () => {
                            clearTimeout(scrollTimeout);
                            scrollTimeout = setTimeout(smoothScrollToContent, 150);
                        });
                    },
                },
            ],
        });
    
        // Initial page load snap
        r4.settings?.createTumblerSetting({
            name: "snap-scroll-onload",
            label: "Автопрокрутка при загрузке",
            submenu: "Плеер",
            classes: ["r4-on-of-tumbler"],
            options: [
                {
                    value: "hc-snap-scroll-onload-disabled",
                    text: "Выкл",
                },
                {
                    value: "hc-snap-scroll-onload",
                    class: "hc-snap-scroll-onload",
                    text: "Вкл",
                    end: () => {
                        // Wait for page to fully load
                        if (document.readyState === 'complete') {
                            scrollToContent(true);
                        } else {
                            window.addEventListener('load', () => scrollToContent(true));
                        }
                    },
                },
            ],
        });
    }

    /* ------------------------------------------------- */
    /* --------------SETTINGS--------------------------- */
    /* ------------------------------------------------- */

    function initSettings() {
        GM.addStyle(`
        /* css */

        /* Night theme */

        body.b-theme__template__night .r4-tumbler {
            background: #222d33;
        }

        body.b-theme__template__night .r4-settings > ul {
            background: #060f13;
        }

        body.b-theme__template__night .r4-settings > ul:after {
            border-bottom-color: #060f13;
        }

        body.b-theme__template__night .r4-tooltip .tooltiptext {
            background: #060f13;
        }

        body.b-theme__template__night .r4-tooltip .tooltiptext:after {
            border-right-color: #060f13;
        }

        /* Resize header (to fit settings tumbler) */

        @media screen and (max-width: 590px) {
            .head-right a,
            .show-login,
            .show-search {
                width: 30px;
            }
        }

        .logo-box {
            background-size: 100px;
        }
        @media screen and (max-width: 760px) {
            .logo-box {
                width: 70px;
            }
        }

        .head-fixed-inner {
            padding: 0 90px;
        }

        .show-login span {
            display: none;
        }

        .show-login i {
            font-size: 18px;
        }

        /* Tumbler Settings */

        .r4-tumbler-settings {
            margin-top: 5px;
            margin-left: 10px;
        }

        /* !css */
        `);

        r4.settings?.afterStart(() => {
            if (r4.settings?.tumbler) {
                document.querySelector(".b-tophead-left")?.appendChild(r4.settings.tumbler);
            }
        });
    }

    function missingSettingHandler(name) {
        // This script previously stored settings in localStorage
        // This function migrates them to GM.config

        const SETTINGS_NAME = "hc-settings";

        function migrateLocalStorageSetting(name, value) {
            if (value == "") {
                value = null;
            }
            GM.setValue(name, value);
            deleteLocalStorageSetting(name);
            console.debug(`Migrated setting ${name}: ${JSON.stringify(value)}`);
            return value;
        }

        function getLocalStorageSetting(name) {
            const settingsStr = localStorage.getItem(SETTINGS_NAME);
            const settings = settingsStr ? JSON.parse(settingsStr) : {};
            return settings[name];
        }

        function deleteLocalStorageSetting(name) {
            const settingsStr = localStorage.getItem(SETTINGS_NAME);
            const settings = settingsStr ? JSON.parse(settingsStr) : {};
            delete settings[name];
            localStorage.setItem(SETTINGS_NAME, JSON.stringify(settings));
        }

        let value = getLocalStorageSetting(name);
        if (value !== undefined) {
            return migrateLocalStorageSetting(name, value);
        }

        return value;
    }

    /* ------------------------------------------------- */
    /* --------------INITIALIZATION--------------------- */
    /* ------------------------------------------------- */

    r4.utils = R4Utils();
    r4.fonts = R4Fonts();
    r4.images = R4Images();
    r4.settings = R4Settings({
        script_homepage: "https://greasyfork.org/en/scripts/425494",
        version_text: "Версия",
        update_text: "Обновить",
        feedback_text: "Отзывы и предложения",
        missingSettingHandler,
    });
    r4.player = initPlayer();

    initSettings();
    initContentSizeTumbler();
    initPlayerScale();
    initPlayerNoMargin();
    initNavbarLinks();
    initFonts();
    initStyleImprovements();
    initHideAds();
    initIMDbRating();
    initAutoPlayNext();
    initHidePlayerAds();
    initPlayerCover();
    initPlayerExtraControls();
    initBlackThemeColor()
    initHideInfo();
    initHideComments();
    initHideMore();
    initHideTranslators();
    initHotkeys();
    initHideCountry();
    initSnapScroll();

    r4.subtitles = initPlayerSubtitles({
        key: "I4RUSehE2lQ5jLgNjteb3gaW31PbJfso",
    });

})();
