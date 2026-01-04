// ==UserScript==
// @name         Enlarge Pixiv images and remove sidebar
// @namespace    PixivCenterIsBetter
// @version      0.2
// @description  Removes the right sidebar, centers the image, and changes the max width of the image container
// @author       Samu
// @match        https://www.pixiv.net/member_illust.php?mode=medium&illust_id=*
// @match        https://www.pixiv.net/en/artworks/*
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/375106/Enlarge%20Pixiv%20images%20and%20remove%20sidebar.user.js
// @updateURL https://update.greasyfork.org/scripts/375106/Enlarge%20Pixiv%20images%20and%20remove%20sidebar.meta.js
// ==/UserScript==

(function() {
  'use strict';

  var css = `

    #root main + aside {
      display: none !important;
    }

    /*content*/
    #root main {
      width: 100% !important;
    }

    #root main .gtm-expand-full-size-illust img {
      height: auto !important;
    }
  `;

  GM_addStyle(css);

})();