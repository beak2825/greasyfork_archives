// ==UserScript==
// @name         Readable Transparent Image
// @name:ru         Readable Transparent Image
// @namespace    readableimage
// @version      1.0.7
// @description  Make a transparent image in your browser more readable
// @description:ru  Сделайте прозрачное изображение в браузере более читаемым
// @author       Greysoul
// @homepage     https://greysoul.ru
// @match        *://*/*.png
// @match        *://*/*.webp
// @match        *://*/*.ico
// @icon         https://greasyfork.s3.us-east-2.amazonaws.com/vqpodep2svo2dplg8l0u6nhdonx8
// @license MIT
// @compatible   Chrome
// @compatible   Opera
// @compatible   Edge
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/439466/Readable%20Transparent%20Image.user.js
// @updateURL https://update.greasyfork.org/scripts/439466/Readable%20Transparent%20Image.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle('img {background: hsl(0deg 0% 90% / 50%) !important;}');
})();