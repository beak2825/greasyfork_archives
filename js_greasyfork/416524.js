// ==UserScript==
// @name        TwitchTracker - m3u8
// @namespace   twitch.tv/megiveyoudie
// @match       https://twitchtracker.com/*/streams/*
// @grant       GM.xmlHttpRequest
// @grant       GM.setClipboard
// @version     1.0
// @author      MeGiveYouDie
// @description Get the m3u8 URL of a stream on TwitchTracker 
// @downloadURL https://update.greasyfork.org/scripts/416524/TwitchTracker%20-%20m3u8.user.js
// @updateURL https://update.greasyfork.org/scripts/416524/TwitchTracker%20-%20m3u8.meta.js
// ==/UserScript==

const hostnames = ['vod-secure.twitch.tv', 'd2nvs31859zcd8.cloudfront.net', 'd3c27h4odz752x.cloudfront.net'];

const button = $('<li><a style="cursor:pointer;">Get m3u8</a></li>').appendTo('#app-nav').children();
button.click(async () => {
    const matches = window.location.href.match(/^https?:\/\/twitchtracker\.com\/(\w+)\/streams\/(\d+)$/);
    if (matches) {
        const channel = matches[1];
        const broadcastId = matches[2];
        const timestamp = (new Date($('meta[name="description"]')[0].content.match(/stream on (.*?) -/)[1] + 'Z') / 1000).toFixed(0);
        let suffix = `${channel}_${broadcastId}_${timestamp}`;
        console.log(suffix);
        suffix = `/${await toSha1(suffix)}_${suffix}/chunked/index-dvr.m3u8`;

        let promises = [];
        hostnames.forEach(hostname => {
            promises.push(request(`https://${hostname}${suffix}`));
        });

        const values = await Promise.all(promises);
        for (let i = 0; i < values.length; i++) {
            if (values[i] == 200) {
                GM.setClipboard(`https://${hostnames[i]}${suffix}`);
                button.text("Copied!");
                setTimeout(() => {
                    button.text("Get m3u8");
                }, 1500);
                return;
            }
        }
        button.off();
        button.css('background-color', '#502c2c');
        button.text('Not found');
        console.log('URL Not Found\nSuffix = ' + suffix);
    }
});

async function toSha1(str) {
    const buffer = new TextEncoder('utf-8').encode(str);
    const digest = await crypto.subtle.digest('SHA-1', buffer);
    return Array.from(new Uint8Array(digest)).map(x => x.toString(16).padStart(2, '0')).join('').slice(0, 20);
}

function request(url) {
    return new Promise(resolve => {
        GM.xmlHttpRequest({
            method: "HEAD",
            url: url,
            onerror: response => {
                resolve(response.status);
            },
            onload: response => {
                resolve(response.status);
            }
        });
    });
}