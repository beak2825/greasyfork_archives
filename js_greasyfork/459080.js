// ==UserScript==
// @name         绅士漫画自适应
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自适应绅士漫画图片!
// @author       zyb
// @match        *://*/photos-slide-aid-*
// @match        *://*/photos-view-id-*
// @match        *://nhentai.net/g/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wnacg.org
// @grant        none
// @require https://greasyfork.org/scripts/479598-myjscodelibrary/code/MyJSCodeLibrary.js?version=1279054
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/459080/%E7%BB%85%E5%A3%AB%E6%BC%AB%E7%94%BB%E8%87%AA%E9%80%82%E5%BA%94.user.js
// @updateURL https://update.greasyfork.org/scripts/459080/%E7%BB%85%E5%A3%AB%E6%BC%AB%E7%94%BB%E8%87%AA%E9%80%82%E5%BA%94.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let myJSCodeLibrary = new MyJSCodeLibrary();

    const styleText = `
      #imgarea img,
      #img_list img{
        width:unset;
        height:99vh;
      }

      html.reader #image-container.fit-horizontal.zoom-100 img{
        width:unset;
        height:99vh;
      }
    `;
    myJSCodeLibrary.createStyleFuc(styleText);

    // Your code here...
})();