// ==UserScript==
// @name         zzz
// @namespace    https://github.com/pixeltris/TwitchAdSolutions
// @version      1.34
// @description  Multiple solutions for blocking Twitch ads (video-swap-new)
// @author       gr
// @match        *://*.twitch.tv/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/507069/zzz.user.js
// @updateURL https://update.greasyfork.org/scripts/507069/zzz.meta.js
// ==/UserScript==
const origFetch = window.fetch;
window.fetch = async function(url, init) {
    let res = await origFetch(url, init);
    // Check for null body status codes
    if(res.status === 204 || res.status === 205) {
        return res; // Return the response as is for these status codes
    }
    let data;
    try{
        // Check if the response is not empty before parsing
        const text = await res.text();
        data = text ? JSON.parse(text) : {};
    }catch(err){
        console.log('Failed to parse JSON:', err);
        return res;
    }

    let arr = [];
    try{
        if(url.startsWith('https://edge.ads.twitch.tv/ads')){//Prime Pop-up
            data = '';
        }
        if(url === 'https://gql.twitch.tv/gql#origin=twilight' || url == 'https://gql.twitch.tv/gql'){// twilight
            if (data && Array.isArray(data)) {
                data.forEach(i => {
                    if(i.extensions.operationName == 'PlaybackAccessToken'){
                        console.log("pushed")
                    }
                })
            }else{
                let val = data.data.streamPlaybackAccessToken.value
                let parsedVal = JSON.parse(val)

                parsedVal.adblock = "true";
                parsedVal.hide_ads = "true";
                parsedVal.server_ads = "false";
                parsedVal.show_ads = "false";
                parsedVal.subscriber = "true";
                parsedVal.turbo = "true";
                parsedVal.user_ip = "";

                let updatedText = JSON.stringify(parsedVal);
                console.log('ex', updatedText)
            }
        }
    }catch(err){
        console.log('err modifying data:', err);
    }

    return new Response(JSON.stringify(data), {
        headers: res.headers,
        status: res.status,
        statusText: res.statusText,
    });
};