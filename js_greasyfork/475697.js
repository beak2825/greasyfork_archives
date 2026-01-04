// ==UserScript==
// @name            TikTok Live Guest
// @name:de         TikTok Live Gast
// @version         1.1.1
// @description     View TikTok Live without Login as Guest
// @description:de  TikTok Live schauen ohne Login als Gast
// @icon            https://www.tiktok.com/favicon.ico
// @author          TalkLounge (https://github.com/TalkLounge)
// @namespace       https://github.com/TalkLounge/tiktok-live-guest
// @license         MIT
// @match           https://www.tiktok.com/*
// @require         https://unpkg.com/mpegts.js@1.7.3/dist/mpegts.js
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/475697/TikTok%20Live%20Guest.user.js
// @updateURL https://update.greasyfork.org/scripts/475697/TikTok%20Live%20Guest.meta.js
// ==/UserScript==

// 24/7 Stream: https://www.tiktok.com/@livehaf.official/live
(async () => {
    let player;

    const div = document.createElement("div"); // Parent Div
    div.style.display = "flex";
    div.style.justifyContent = "center";

    const divResize = document.createElement("div"); // Resize Video Div
    divResize.style.resize = "vertical";
    divResize.style.overflow = "hidden";
    divResize.style.height = "50vh";
    div.append(divResize);

    async function removePopups() {
        for (let i = 0; i < 10 * 4; i++) {
            document.querySelector("#login-modal")?.parentNode?.parentNode?.parentNode?.remove(); // Remove Login Modal
            document.querySelector("tiktok-cookie-banner")?.remove(); // Remove Cookie Banner
            document.body.classList.remove("hidden");
            await new Promise(r => setTimeout(r, 250));
        }
    }

    function initPlayer(url, video) {
        player = mpegts.createPlayer({
            type: "mse",
            isLive: true,
            url
        });
        player.attachMediaElement(video);
        player.load();
        player.play();
    }

    async function initLive() {
        if (!window.location.pathname.startsWith("/@") || !window.location.pathname.endsWith("/live")) {
            return;
        }

        const room_id = document.querySelector('[property="al:ios:url"]').getAttribute("content").split("=")[1];
        let data = await fetch(`https://webcast.tiktok.com/webcast/room/info/?aid=1988&room_id=${room_id}`);
        data = await data.json();
        console.log("[TikTok Live Gast]: Stream URLs", data.data.stream_url);
        data = data.data.stream_url.flv_pull_url;
        data = data.pm_mt_video_1080p60 || data.FULL_HD1 || data.pm_mt_video_720p60 || data.HD1 || data.SD2 || data.SD1;

        if (!mpegts.getFeatureList().mseLivePlayback) {
            return;
        }

        div.style.position = "absolute";
        div.style.width = "90%";
        div.style.zIndex = 2;
        div.style.marginTop = `${document.querySelector("[class*=DivLiveRoomBanner]").getBoundingClientRect().height}px`;

        const parent = document.querySelector("[class*=DivLiveContainer]");
        parent.insertBefore(div, parent.firstChild);

        const video = document.createElement("video");
        video.style.height = "100%";
        video.controls = true;
        video.volume = 0.5;

        divResize.style.height = "75vh";
        divResize.append(video);

        document.querySelector("[class*=DivFeedLivePlayerCoreContainer]").remove();
        document.querySelector("[class*=DivChatRoomAnimationContainer]").remove();

        initPlayer(data, video);

        video.addEventListener("ended", () => { // [MSEController] > MediaSource onSourceEnded
            player.destroy();
            initPlayer(data, video);
        });
    }

    async function initProfile() {
        for (let i = 0; i < 10 * 4; i++) {
            await new Promise(r => setTimeout(r, 250));

            if (!window.location.pathname.startsWith("/@")) {
                continue;
            }

            if (document.querySelector("[data-e2e=user-post-item-list] a[target=tiktok_live_view_window] video")) {
                console.log("[TikTok Live Gast]: Detected Live in List");
                await new Promise(r => setTimeout(r, 2500));

                const parent = document.querySelector("#main-content-others_homepage");
                parent.insertBefore(div, parent.firstChild);

                const video = document.querySelector("[data-e2e=user-post-item-list] a[target=tiktok_live_view_window] video");
                video.style.height = "100%";
                video.style.transform = "";
                video.controls = true;
                video.muted = false;
                video.volume = 0.5;
                divResize.append(video);

                break;
            } else if (document.querySelector("#main-content-others_homepage").parentNode.firstChild.target == "tiktok_live_view_window" && document.querySelector("#main-content-others_homepage").parentNode.firstChild.querySelector("video")) {
                console.log("[TikTok Live Gast]: Detected Live in Banner");
                await new Promise(r => setTimeout(r, 3000));

                const a = document.querySelector("a[target=tiktok_live_view_window]");
                a.querySelector("div").style.height = "100%";
                a.parentNode.insertBefore(div, a.parentNode.firstChild);

                const video = a.querySelector("video");
                video.style.height = "100%";
                video.style.transform = "";
                video.controls = true;
                video.muted = false;
                video.volume = 0.5;
                divResize.append(video);

                div.append(a);

                break;
            }
        }
    }

    initLive();
    initProfile();
    removePopups();
})()
