// ==UserScript==
// @name         CHZZK - Ad Blocker (SSAI)
// @name:en      CHZZK - Ad Blocker (SSAI)
// @name:ko      치지직 - 광고 차단기 (SSAI)
// @namespace    https://greasyfork.org/ja/users/941284-ぐらんぴ
// @version      2025-05-17
// @description    Block ads inserted by SSAI.
// @description:en Block ads inserted by SSAI.
// @description:ko SSAI에 의해 삽입되는 광고 차단
// @author       ぐらんぴ
// @match        https://*.naver.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=naver.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/536236/CHZZK%20-%20Ad%20Blocker%20%28SSAI%29.user.js
// @updateURL https://update.greasyfork.org/scripts/536236/CHZZK%20-%20Ad%20Blocker%20%28SSAI%29.meta.js
// ==/UserScript==

HTMLMediaElement.prototype.play = ((originalPlay) =>{
    return function(){
        if(this.src.endsWith(".mp4")) this.src = "";
        return originalPlay.apply(this, arguments);
    };
})(HTMLMediaElement.prototype.play);