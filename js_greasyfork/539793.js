// ==UserScript==
// @name         WaCare付費影片解鎖
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  WaCare Paywall Bypass PoC
// @author       Pat
// @match        https://course.wacare.live/course/*
// @grant        GM_xmlhttpRequest
// @connect      course.wacare.live
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/539793/WaCare%E4%BB%98%E8%B2%BB%E5%BD%B1%E7%89%87%E8%A7%A3%E9%8E%96.user.js
// @updateURL https://update.greasyfork.org/scripts/539793/WaCare%E4%BB%98%E8%B2%BB%E5%BD%B1%E7%89%87%E8%A7%A3%E9%8E%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //從網址取得API的三個變數 --------------------------------------------------------------------//
    const associationId = new URLSearchParams(window.location.search).get('associationId');
    const categoryId = new URLSearchParams(window.location.search).get('categoryId');
    const vidId = window.location.pathname.split('/')[2];
    const apiUrl = `https://course.wacare.live/api/V1/Web/course/${associationId}/${categoryId}/${vidId}/`;
    //-------------------------------------------------------------------------------------------//

    //請求API 取得Vimeo影片ID --------------------------------------------------------------------//
    GM_xmlhttpRequest({
        method: "GET",
        url: apiUrl,
        onload: function(response) {
            const videoId = JSON.parse(response.responseText).payLoad.VideoSourceId;
            if (videoId) {
                document.querySelector('.sc-cmthru.nurAl').innerHTML =
                    `<iframe src="https://player.vimeo.com/video/${videoId}" frameborder="0" allowfullscreen style="width:100%; height:500px;"></iframe>`;
            }
        }
    });
    //-------------------------------------------------------------------------------------------//

})();