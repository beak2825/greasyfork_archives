// ==UserScript==
// @name         hits_rewards
// @namespace    http://tampermonkey.net/
// @version      2025.05.30.1
// @description  hitsquadgodfather custom rewards
// @author       jacky
// @license      MIT
// @match        https://www.twitch.tv/hitsquadgodfather
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitch.tv
// @require      https://lf26-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.4.0/jquery.min.js
// @run-at       document-start
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/540018/hits_rewards.user.js
// @updateURL https://update.greasyfork.org/scripts/540018/hits_rewards.meta.js
// ==/UserScript==

window.addEventListener("DOMContentLoaded", DOM_ContentReady);
window.addEventListener("load", pageFullyLoaded);

const { fetch: _fetch } = window;
unsafeWindow.fetch = async (...args) => {
    let [resource, config] = args;
    let response = await _fetch(resource, config);
    var m = /gql/.exec(resource);
    if (m){
        try {
            const _json = await response.clone().json();
            m = /customRewards/.exec(JSON.stringify(_json));
            if (m)
                parse(_json);
        }
        catch (e) {
            console.log(e);
        }
    }
    return response;
};

function parse(data){
    $.each(data, function(k, v){
        if (v.data.community && v.data.community.channel && v.data.community.channel.communityPointsSettings && v.data.community.channel.communityPointsSettings.customRewards) {
            if ($('#d').length > 0)
                $('#d').empty();
            else
                $('#live-channel-stream-information').append('<div id="d"></div>');
            $.each(v.data.community.channel.communityPointsSettings.customRewards, function(j, w){
                // 	NOTE - THIS IS A ROW KEY!!! Complete the gleam giveaway by redeeming this channel reward to instantly claim your key! https://gleam.io/upSKd/hitsquadgodfather-bookwalker-thief-of-tales-row-steam-key
                var cost = w.cost;
                var title = w.title;
                var prompt = '';
                var m = /ROW/.exec(w.prompt);
                if (m)
                    prompt = '[ROW]';
                m = /drawing/.exec(w.prompt);
                if (m)
                    prompt = `${prompt}[DRAW]`;
                m = /gog|steam/.exec(w.prompt);
                if (m)
                    prompt = `${prompt}[<b>${m}</b>]`;
                m = /gleam.io\/[a-z0-9]+\/[a-z0-9-]+/i.exec(w.prompt);
                if (m)
                    prompt = `${prompt}https://${m}`;
                else
                    prompt = w.prompt;
                $('#d').append(`<tr><td>${w.title}</td><td>${w.cost}</td><td>${prompt}</td></tr>`);
                //console.log(`${w.title}||||${w.cost}||||${w.prompt}`);
            });
        }
    });
}

function DOM_ContentReady () {

}

function pageFullyLoaded () {

}