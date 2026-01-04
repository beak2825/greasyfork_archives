// ==UserScript==
// @name Youtube API Exposer
// @description Exposes API of Youtube to control Youtube remotely
// @version 2.1.2
// @compatible firefox
// @namespace https://github.com/albionah
// @homepageURL https://github.com/albionah/YoutubeApiExposer
// @author albionah
// @match *://*.youtube.com/*
// @grant unsafeWindow
// @license GNU General Public License v3.0
// @downloadURL https://update.greasyfork.org/scripts/432650/Youtube%20API%20Exposer.user.js
// @updateURL https://update.greasyfork.org/scripts/432650/Youtube%20API%20Exposer.meta.js
// ==/UserScript==

let connection;

function getBasicElements() {
    return new Promise((resolve) => {
        const video = document.querySelector("video");
        const player = unsafeWindow.document.getElementById("movie_player");
        if (video && player) {
            resolve({video, player});
        }
        else {
            setTimeout(() => getBasicElements().then(resolve), 1000);
        }
    });
}

getBasicElements().then(({video, player}) => {
    video.addEventListener("canplaythrough", () => {
        console.debug("event canplaythrough");
        uploadBasicInfo(player);
    });
    video.addEventListener("play", () => {
        console.debug("event play");
        uploadBasicInfo(player);
    });
    video.addEventListener("pause", () => {
        console.debug("event pause");
        uploadBasicInfo(player);
    });

    connect(video, player);
});


function getMediaInfo(player) {
    return new Promise((resolve) => {
        const title = player.getVideoData()?.title;
        if (title) {
            const stats = player.getVideoStats();
            resolve({
                title: title ?? h1s[0].textContent,
                videoId: stats.docid,
                duration: Number.parseFloat(stats.len),
                currentPosition: {
                    position: Number.parseFloat(stats.lct),
                    timestamp: new Date().getTime()
                },
                isPlaying: stats.vpa !== "1"
            });
        } else {
            setTimeout(() => getMediaInfo().then(resolve), 100);
        }
    });
}

function uploadBasicInfo(player) {
    getMediaInfo(player).then((mediaInfo) => {
        console.debug("media info", mediaInfo);
        connection?.send(JSON.stringify(mediaInfo));
    });
}

const videoIdPattern = new RegExp("\/watch\\?v=(.+)");

function findSuitableLink() {
    const links = unsafeWindow.document.querySelectorAll("a.yt-simple-endpoint.ytd-thumbnail");
    const suitableLink = Array.from(links).find((el) => el.href.match(videoIdPattern));
    if (suitableLink) return suitableLink;
    else throw new Error("cannot hot reload");

}

function watchWithHotReload(newVideoId) {
    const element = findSuitableLink();
    element.data.commandMetadata.webCommandMetadata.url = "/watch?v=" + newVideoId;
    element.data.watchEndpoint.videoId = newVideoId;
    element.click();
}

function watchWithHardReload(videoId) {
    location.href = `?v=${videoId}`;
}

function watch(videoId) {
    try {
        watchWithHotReload(videoId);
    } catch (error) {
        console.warn(error.message);
        watchWithHardReload(videoId);
    }
}

function connect(video, player) {
    const websocket = new WebSocket("ws://localhost:7789");

    websocket.onopen = () => {
        console.debug("connected to Youtube controller");
        connection = websocket;
        uploadBasicInfo(player);
    }
    websocket.onmessage = (rawMessage) => {
        try {
            console.debug(rawMessage.data);
            const message = JSON.parse(rawMessage.data);
            switch (message.type) {
                case "playOrPause":
                    const event = new KeyboardEvent('keydown', {'keyCode': 75, 'which': 75});
                    document.dispatchEvent(event);
                    break;

                case "play":
                    video.play();
                    break;

                case "pause":
                    video.pause();
                    break;

                case "stop":
                    video.stop();
                    break;

                case "watchPrevious":
                    player.previousVideo();
                    break;

                case "watchNext":
                    player.nextVideo();
                    break;

                case "watch":
                    console.debug(`watch ${message.id}`);
                    watch(message.id);
                    break;
            }
        } catch (error) {
            console.error(error);
        }
    }

    websocket.onclose = (event) => {
        console.info('Socket is closed. Reconnect will be attempted in 3 seconds.', event.reason);
        connection = undefined;
        setTimeout(() => connect(video, player), 3000);
    };

    websocket.onerror = (error) => {
        console.error('Socket encountered error: ', error.message, 'Closing socket');
        websocket.close();
    };
}

window.addEventListener('beforeunload', () => {
    connection?.close();
});
