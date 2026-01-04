// ==UserScript==
// @name         CHZZK - ad blocker (SSAI)
// @name:en      CHZZK - ad blocker (SSAI)
// @name:ko      치지직 - 광고 차단기 (SSAI)
// @namespace    https://greasyfork.org/ja/users/941284-ぐらんぴ
// @version      2025-05-13
// @description    Block ads inserted by SSAI.
// @description:en Block ads inserted by SSAI.
// @description:ko SSAI에 의해 삽입되는 광고 차단
// @author       ぐらんぴ
// @match        https://*.naver.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=naver.com
// @grant        GM_addStyle
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/509745/CHZZK%20-%20ad%20blocker%20%28SSAI%29.user.js
// @updateURL https://update.greasyfork.org/scripts/509745/CHZZK%20-%20ad%20blocker%20%28SSAI%29.meta.js
// ==/UserScript==
//.link_btn_area, .skip_area

HTMLMediaElement.prototype.play = ((originalPlay) =>{
    return function(){
        if(this.src.endsWith(".mp4")){
            console.log("AD", this.src);
            this.src = "";
        }else console.log(this.src);
        return originalPlay.apply(this, arguments);
    };
})(HTMLMediaElement.prototype.play);
// pzp-pc__loading-indicator
const origFetch = unsafeWindow.fetch;
unsafeWindow.fetch = async function(url, init) {
    let res = await origFetch(url, init);
    let data;
    if(res.status === 204 || res.status === 205) return res;
    try{
        const text = await res.text();
        data = text ? JSON.parse(text) : {};
    }catch(err){
        log('Failed to parse JSON:', err);
        return res;
    }

    try{
        if(url.startsWith('https://nam')) data = '';
    }catch(err){
        log('err modifying data:', err);
    }

    return new Response(JSON.stringify(data), {
        headers: res.headers,
        status: res.status,
        statusText: res.statusText,
    });
};

GM_addStyle(`
.pzp-pc__loading-indicator { display: none !important; }
.link_btn_area { display: none !important; }
.skip_area { display: none !important; }`);
// chzzk-loading__icon
// ad_link
// ad_skip_area