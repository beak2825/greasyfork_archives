// ==UserScript==
// @name         WK Review Item Info Level
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Show the level of the reviewed item in the item info panel
// @author       Gorbit99
// @match        https://www.wanikani.com/review/session
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wanikani.com
// @grant        GM.xmlHttpRequest
// @require      https://greasyfork.org/scripts/430565-wanikani-item-info-injector/code/WaniKani%20Item%20Info%20Injector.user.js?@version=1111117
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/458366/WK%20Review%20Item%20Info%20Level.user.js
// @updateURL https://update.greasyfork.org/scripts/458366/WK%20Review%20Item%20Info%20Level.meta.js
// ==/UserScript==

(function(wkItemInfo) {
  'use strict';

  const levelIconCss = `
    display: inline-block;
    width: 48px;
    height: 48px;
    line-height: 48px;
    text-align: center;
    box-shadow: 0 -3px 0 rgba(0,0,0,0.2) inset,0 0 10px rgba(255,255,255,0.5);
    text-decoration: none;
    font-size: 27px;
    border-radius: 3px;
    background-color: #a1a1a1;
    background-image: linear-gradient(#a6a6a6, #999);
    color: #d5d5d5;
    text-shadow: 0 -1px 0 rgba(0,0,0,0.2),0 1px 0 rgba(255,255,255,0.5);
  `;

  wkItemInfo
    .on("review")
    .under("meaning,reading")
    .spoiling()
    .appendSideInfoAtTop(
    "Level",
    (state) => {
      return new Promise((resolve) => {
        GM.xmlHttpRequest({
          method: "GET",
          url: `https://wanikani.com/json/${state.type}/${state.id}`,
          onload: (response) => {
            const result = JSON.parse(response.responseText).stroke;
            const div = document.createElement("div");
            div.style = levelIconCss;
            div.textContent = result;
            resolve(div);
          }
        });
      }
    )}
  );
})(wkItemInfo);