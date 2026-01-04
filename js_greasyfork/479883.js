// ==UserScript==
// @name         Youtube Shorts to Traditional Video
// @namespace    http://tampermonkey.net/
// @version      1.12
// @description  Simple script to use traditional UI to view Youtube Shorts
// @author       unblue8914
// @match        https://www.youtube.com/*
// @grant        none
// @license      MIT

// @description:zh-TW   Simple script to use traditional UI to view Youtube Shorts
// @description:zh-CN   Simple script to use traditional UI to view Youtube Shorts
// @description:ja      Simple script to use traditional UI to view Youtube Shorts
// @description:ko      Simple script to use traditional UI to view Youtube Shorts
// @description:ru      Simple script to use traditional UI to view Youtube Shorts
// @description:af      Simple script to use traditional UI to view Youtube Shorts
// @description:az      Simple script to use traditional UI to view Youtube Shorts
// @description:id      Simple script to use traditional UI to view Youtube Shorts
// @description:ms      Simple script to use traditional UI to view Youtube Shorts
// @description:bs      Simple script to use traditional UI to view Youtube Shorts
// @description:ca      Simple script to use traditional UI to view Youtube Shorts
// @description:cs      Simple script to use traditional UI to view Youtube Shorts
// @description:da      Simple script to use traditional UI to view Youtube Shorts
// @description:de      Simple script to use traditional UI to view Youtube Shorts
// @description:et      Simple script to use traditional UI to view Youtube Shorts
// @description:es      Simple script to use traditional UI to view Youtube Shorts
// @description:eu      Simple script to use traditional UI to view Youtube Shorts
// @description:fr      Simple script to use traditional UI to view Youtube Shorts
// @description:gl      Simple script to use traditional UI to view Youtube Shorts
// @description:hr      Simple script to use traditional UI to view Youtube Shorts
// @description:zu      Simple script to use traditional UI to view Youtube Shorts
// @description:is      Simple script to use traditional UI to view Youtube Shorts
// @description:it      Simple script to use traditional UI to view Youtube Shorts
// @description:sw      Simple script to use traditional UI to view Youtube Shorts
// @description:lv      Simple script to use traditional UI to view Youtube Shorts
// @description:lt      Simple script to use traditional UI to view Youtube Shorts
// @description:hu      Simple script to use traditional UI to view Youtube Shorts
// @description:nl      Simple script to use traditional UI to view Youtube Shorts
// @description:uz      Simple script to use traditional UI to view Youtube Shorts
// @description:pl      Simple script to use traditional UI to view Youtube Shorts
// @description:pt      Simple script to use traditional UI to view Youtube Shorts
// @description:pt-BR   Simple script to use traditional UI to view Youtube Shorts
// @description:ro      Simple script to use traditional UI to view Youtube Shorts
// @description:sq      Simple script to use traditional UI to view Youtube Shorts
// @description:sk      Simple script to use traditional UI to view Youtube Shorts
// @description:sl      Simple script to use traditional UI to view Youtube Shorts
// @description:sr      Simple script to use traditional UI to view Youtube Shorts
// @description:fi      Simple script to use traditional UI to view Youtube Shorts
// @description:sv      Simple script to use traditional UI to view Youtube Shorts
// @description:vi      Simple script to use traditional UI to view Youtube Shorts
// @description:tr      Simple script to use traditional UI to view Youtube Shorts
// @description:be      Simple script to use traditional UI to view Youtube Shorts
// @description:bg      Simple script to use traditional UI to view Youtube Shorts
// @description:ky      Simple script to use traditional UI to view Youtube Shorts
// @description:kk      Simple script to use traditional UI to view Youtube Shorts
// @description:mk      Simple script to use traditional UI to view Youtube Shorts
// @description:mn      Simple script to use traditional UI to view Youtube Shorts
// @description:uk      Simple script to use traditional UI to view Youtube Shorts
// @description:el      Simple script to use traditional UI to view Youtube Shorts
// @description:hy      Simple script to use traditional UI to view Youtube Shorts
// @description:ur      Simple script to use traditional UI to view Youtube Shorts
// @description:ar      Simple script to use traditional UI to view Youtube Shorts
// @description:fa      Simple script to use traditional UI to view Youtube Shorts
// @description:ne      Simple script to use traditional UI to view Youtube Shorts
// @description:mr      Simple script to use traditional UI to view Youtube Shorts
// @description:hi      Simple script to use traditional UI to view Youtube Shorts
// @description:as      Simple script to use traditional UI to view Youtube Shorts
// @description:bn      Simple script to use traditional UI to view Youtube Shorts
// @description:pa      Simple script to use traditional UI to view Youtube Shorts
// @description:gu      Simple script to use traditional UI to view Youtube Shorts
// @description:or      Simple script to use traditional UI to view Youtube Shorts
// @description:ta      Simple script to use traditional UI to view Youtube Shorts
// @description:te      Simple script to use traditional UI to view Youtube Shorts
// @description:kn      Simple script to use traditional UI to view Youtube Shorts
// @description:ml      Simple script to use traditional UI to view Youtube Shorts
// @description:si      Simple script to use traditional UI to view Youtube Shorts
// @description:th      Simple script to use traditional UI to view Youtube Shorts
// @description:lo      Simple script to use traditional UI to view Youtube Shorts
// @description:my      Simple script to use traditional UI to view Youtube Shorts
// @description:ka      Simple script to use traditional UI to view Youtube Shorts
// @description:am      Simple script to use traditional UI to view Youtube Shorts
// @description:km      Simple script to use traditional UI to view Youtube Shorts
// @downloadURL https://update.greasyfork.org/scripts/479883/Youtube%20Shorts%20to%20Traditional%20Video.user.js
// @updateURL https://update.greasyfork.org/scripts/479883/Youtube%20Shorts%20to%20Traditional%20Video.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (window.location.pathname.match('\/shorts\/.+')) {
        window.location.replace("https://www.youtube.com/watch?v=" + window.location.pathname.split('/shorts/').pop());
    }
    document.addEventListener("yt-navigate-start", (event) => {
        const url = event.detail.url.split('/shorts/');
        if(url.length > 1){
            window.location.replace("https://www.youtube.com/watch?v=" + url.pop());
        }
    });
})();