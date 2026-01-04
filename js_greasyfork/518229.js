// ==UserScript==
// @name         Nhentai 自適應漫畫
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自適應绅士漫畫圖片!
// @author       zyb
// @match        *://*/photos-slide-aid-*
// @match        *://*/photos-view-id-*
// @match        *://nhentai.net/g/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wnacg.org
// @grant        none
// @require      https://greasyfork.org/scripts/479598-myjscodelibrary/code/MyJSCodeLibrary.js?version=1279054
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/518229/Nhentai%20%E8%87%AA%E9%81%A9%E6%87%89%E6%BC%AB%E7%95%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/518229/Nhentai%20%E8%87%AA%E9%81%A9%E6%87%89%E6%BC%AB%E7%95%AB.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let myJSCodeLibrary = new MyJSCodeLibrary();

    const styleText = `
      #imgarea img,
      #img_list img {
        width: unset;
        height: 99vh;
      }

      html.reader #image-container.fit-horizontal.zoom-100 img {
        width: unset;
        height: 99vh;
      }
    `;
    myJSCodeLibrary.createStyleFuc(styleText);
})();
