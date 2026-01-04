// ==UserScript==
// @name         Refresh youtube videos (uBlock Origin Lite ad workaround)
// @namespace    http://tampermonkey.net/
// @description  When a video starts, this refreshes the new video immediately as workaround to issue of uBlock Origin Lite not blocking the unwanted content and requiring manual refresh.
// @version      2024-12-29_3
// @author       Xcape
// @match        https://www.youtube.com/*
// @icon         https://lh3.googleusercontent.com/lsanoOfx5N_t-7gh5Qg9FGIirVEjdCqalZXyLZYRd5d7Fydm83FQhu4Oq0JmlRyMtyF_LfwuQQZyKRTHs6emnFirsA=s60
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/522225/Refresh%20youtube%20videos%20%28uBlock%20Origin%20Lite%20ad%20workaround%29.user.js
// @updateURL https://update.greasyfork.org/scripts/522225/Refresh%20youtube%20videos%20%28uBlock%20Origin%20Lite%20ad%20workaround%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let checkID = localStorage.getItem('checkID');

      setInterval(() => {
          const videoID = new URLSearchParams(window.location.search).get('v');
          if (videoID !== null) {
            if (videoID !== checkID) {
                checkID = videoID;
                localStorage.setItem('checkID', checkID);
                setTimeout(() => {
                    location.reload();
                }, 500);
            }
          } else {
            localStorage.setItem('checkID', 'blahblah');
          }
      }, 100);

})();