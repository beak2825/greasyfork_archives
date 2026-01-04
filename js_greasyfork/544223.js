// ==UserScript==
// @name         CHZZK - ?????????
// @name:en      CHZZK - ?????????
// @name:ko      치지직 - ?????????
// @namespace    https://greasyfork.org/ja/users/941284-ぐらんぴ
// @version      2025-08-01
// @description    Just set the video's controls to true
// @description:en Just set the video's controls to true
// @description:ko 비디오의 컨트롤을 true로 설정했을 뿐입니다.
// @author       ぐらんぴ
// @match        https://*.naver.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=naver.com
// @grant        GM_addStyle
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544223/CHZZK%20-%20.user.js
// @updateURL https://update.greasyfork.org/scripts/544223/CHZZK%20-%20.meta.js
// ==/UserScript==

const origAppendChild = Element.prototype.appendChild;
Element.prototype.appendChild = function(...args){
    if(args[0].className == "webplayer-internal-video"){
        try{ setTimeout(()=>{ document.querySelector('video').controls = true },0) }catch{}
    }
    return origAppendChild.apply(this, args);
}

GM_addStyle(`
.popup_dimmed__zs78t { display: none }
#live_player_layout > div > div.pzp-pc__bottom { display: none }
`);