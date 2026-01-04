// ==UserScript==
// @name         Spotify - Append Artist Name and Title to Copied Link
// @description  Spotify - Append Artist Name and Title to Copied Link.
// @author       to
// @namespace    https://github.com/to
// @license      MIT
// @version      0.6
//
// @noframes
// @connect      spotify.com
// @connect      song.link
// @match        https://open.spotify.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=spotify.com
//
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/439820/Spotify%20-%20Append%20Artist%20Name%20and%20Title%20to%20Copied%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/439820/Spotify%20-%20Append%20Artist%20Name%20and%20Title%20to%20Copied%20Link.meta.js
// ==/UserScript==

// SpotifyのAPIを利用すると 日本のアーティストが日本語表記になりやすい
const CLIENT_ID = '';
const CLIENT_SECRET = '';
const MARKETS = ['JP', 'US'];

const PREFIX = "";

let useSpotify = !!CLIENT_ID;
let market = MARKETS[0];

// Clipboard APIではcopyイベントが発生しないため 強制的にexecCommandを利用させる
unsafeWindow.navigator.clipboard.write = null;
unsafeWindow.navigator.clipboard.writeText = null;

// マーケットの国を切り替える
// (海外のアーティストがカタカナ表記になってしまうことがあるため)
MARKETS.forEach(m => {
    GM_registerMenuCommand ('Change Market [' + m + ']', () => {
        market = m;
    });
});

if(useSpotify){
    GM_registerMenuCommand ('Use Odesil', () => {
        useSpotify = false;
    });
}

document.addEventListener('copy', e => {
	// URL以外がコピーされたか、または、通常のテキストコピー操作か？
    let url = e.target.value;
	if(!url || !(/^http/.test(url) || !(e.target instanceof HTMLTextAreaElement)))
		return;

    url = url.replace(/\?.+/, '');

    // SpotifyのAPIを利用するか？
    if(useSpotify){
        let ts = url.match(/\/(track|album)\/(.+)/);
        if(ts){
            requestToSpotify(`https://api.spotify.com/v1/${ts[1]}s/${ts[2]}?market=${market}`, r => {
                GM_setClipboard([
                    r.artists.map(a => a.name).join(', '),
                    '-',
                    r.name,
                    url,
                    'https://' + (r.type == 'track' ? 'song' : r.type) + '.link/s/' + r.id].join(' ') + PREFIX);
            });
        }
    } else {
        // JPロケールが適用されていない(USと同じ値が返される)
        GM_xmlhttpRequest({
            url: `https://api.song.link/v1-alpha.1/links?userCountry=${market}&url=${encodeURIComponent(url)}`,
            onload: function(r){
                r = JSON.parse(r.responseText);

                GM_setClipboard([
                    r.entitiesByUniqueId[r.entityUniqueId].artistName,
                    '-',
                    r.entitiesByUniqueId[r.entityUniqueId].title,
                    url,
                    r.pageUrl].join(' ') + PREFIX);
            }});
    }
}, true);

function requestToSpotify(url, callback){
    GM_xmlhttpRequest({
        url: 'https://accounts.spotify.com/api/token',
        method: 'POST',
        data: 'grant_type=client_credentials',
        headers: {
            'Authorization': 'Basic ' + btoa(CLIENT_ID + ':' + CLIENT_SECRET),
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        onload: function(r){
            r = JSON.parse(r.responseText);

            GM_xmlhttpRequest({
                url: url,
                headers: {
                    'Authorization': r.token_type + ' ' + r.access_token,
                    'Content-Type': 'application/json',
                },
                onload: function(r){
                    callback(JSON.parse(r.responseText));
                }});
        }});
}