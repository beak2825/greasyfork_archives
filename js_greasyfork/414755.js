// ==UserScript==
// @name         Livestream detect
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  auto jump to livestream
// @author       none
// @match        https://www.youtube.com/channel/*/videos
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/414755/Livestream%20detect.user.js
// @updateURL https://update.greasyfork.org/scripts/414755/Livestream%20detect.meta.js
// ==/UserScript==

(async function() {
    'use strict';
    const token_list_example = ['abcdef-abcdefghijk', '123456abcdefghijk'];//token_list示例
    let token_list = [];
    if(token_list.length === 0)
    {
        alert("token列表为空，请在油猴脚本页面编辑脚本，在token_list中加入token，token在网址中，形如\"https://www.youtube.com/channel/abcd1234\"中的\"abcd1234\"");
        return;
    }
    let reload_interval = 60;//默认60s刷新

    let token_map = {};
    for(let token of token_list)
    {
        token_map[token] = true;
    }
    let url = window.location.href;
    let pattern = /channel\/(.*)\/videos/;
    let token = url.match(pattern)[1];
    if(token_map[token] !== true)
    {
        console.log(`token:${token} not in token list`);
        return;
    }
    else
    {
        console.log(`token:${token} in token list`);
    }
    let overlay = null;
    while(overlay === null)
    {
        await new Promise(r=>setTimeout(r, 1000));
        overlay = document.querySelector("#overlays > ytd-thumbnail-overlay-time-status-renderer.style-scope.ytd-thumbnail");
    }
    let live_status = overlay?overlay.overlayStyle:null;
    console.log(`live status:${live_status}`);
    if(live_status === "LIVE")
    {
        window.open(document.querySelector("#overlays > ytd-thumbnail-overlay-time-status-renderer.style-scope.ytd-thumbnail").parentElement.parentElement.href, "_self");
    }
    else
    {
        console.log(setTimeout(()=>window.location.reload(), reload_interval * 1000));
    }
})();