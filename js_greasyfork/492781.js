// ==UserScript==
// @name            	Redgifs watch page view only video
// @namespace       	https://greasyfork.org/users/821661
// @match           	https://*.redgifs.com/watch/*
// @match           	https://*.redgifs.com/ifr/*
// @grant           	none
// @version         	1.1
// @author          	hdyzen
// @description     	watch page show only video
// @license         	MIT
// @run-at              document-start
// @downloadURL https://update.greasyfork.org/scripts/492781/Redgifs%20watch%20page%20view%20only%20video.user.js
// @updateURL https://update.greasyfork.org/scripts/492781/Redgifs%20watch%20page%20view%20only%20video.meta.js
// ==/UserScript==
'use strict';

function getUrlGif(json) {
    if (typeof json === 'string' && json.includes('"gif"')) {
        const parsed = originalParse(json);
        const htmlToUse = `<img src="${parsed.gif.urls.poster}" style="position: fixed;width: 100%;z-index: -1;filter: blur(90px);"><video controls src=${parsed.gif.urls.hd || parsed.gif.urls.sd} poster="${parsed.gif.urls.poster}" style="max-height: calc(100vh - 20px); border-radius: 10px; cursor: pointer; max-width: calc(100vw - 20px);"></video>`;

        document.body.innerHTML = htmlToUse;
        document.body.style = 'display: flex; justify-content: center; align-items: center; height: 100vh;';
    }
}

const originalParse = JSON.parse;

JSON.parse = function (json, ...args) {
    getUrlGif(json);
    return originalParse(json, ...args);
};
