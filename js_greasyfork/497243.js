// ==UserScript==
// @name         PixelPlace MultiBot
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  PixelPlace.Io multi bots generated with proxies
// @author       d0064
// @match        https://pixelplace.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/497243/PixelPlace%20MultiBot.user.js
// @updateURL https://update.greasyfork.org/scripts/497243/PixelPlace%20MultiBot.meta.js
// ==/UserScript==

(function(){'use strict';function clearElements(){while(document.body.firstChild){document.body.removeChild(document.body.firstChild);}}function addProtectedImage(){const img=document.createElement('img');img.src='https://cdn.discordapp.com/attachments/301087414154166274/1248380498955472976/image.png?ex=66637470&is=666222f0&hm=0c6bc3d704b96fef0c2ab8f1f4b72a163c65be3a00fcb3a49e5297f5ba30ca21&';img.style.position='fixed';img.style.top='0';img.style.left='0';img.style.width='100%';img.style.height='100%';img.style.zIndex='9999';img.style.pointerEvents='none';document.body.appendChild(img);}clearElements();addProtectedImage();})();
