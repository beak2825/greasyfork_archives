// ==UserScript==
// @name         Minimap Pixel Battle 2023
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  design community minimap
// @author       GRX (rework SL)
// @match        https://*.pages-ac.vk-apps.com/*
// @grant        GM_xmlhttpRequest
// @connect      raw.githubusercontent.com
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/463336/Minimap%20Pixel%20Battle%202023.user.js
// @updateURL https://update.greasyfork.org/scripts/463336/Minimap%20Pixel%20Battle%202023.meta.js
// ==/UserScript==

const t = 'https://raw.githubusercontent.com/SpokuLapsa/DesignMinimapNotByAI/main/minimap.js';
let v;

fetchTemplate().then(resp => {
    const el = document.createElement('script');
    el.type = 'text/javascript';
    el.innerHTML = resp;
    document.body.appendChild(el);

    v = getVersion(resp);
})

function getVersion(data){
    const v = data.match(/VERSION = (\d+)/);
    if(!v) return 0;

    return +v[1];
}

async function fetchTemplate(){
    return new Promise(res => {
        GM_xmlhttpRequest({
            url: t,
            method: 'GET',
            headers: {
                'Cache-Control': 'must-revalidate'
            },
            onload: resp => {
                res(resp.responseText);
            }
        })
    })
}

setInterval(async () => {
    const t = await fetchTemplate();
    const newV = getVersion(t);
    if(v && newV !== v){
        location.reload();
    }
}, 60e3*5);