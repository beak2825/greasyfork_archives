// ==UserScript==
// @name         為什麼你們就是不能加個空格呢？
// @namespace    https://vinta.ws/code/
// @description  自動在網頁中所有的中文字和半形的英文、數字、符號之間插入空白。（攤手）沒辦法，處女座都有強迫症。
// @icon         https://s3-ap-northeast-1.amazonaws.com/vinta/images/paranoid-auto-spacing.png
// @version      4.0.7
// @require      https://cdn.jsdelivr.net/npm/pangu@4.0.7/dist/browser/pangu.min.js
// @run-at       document-idle
// @include      *
// @noframes
//
// @author       Vinta
// @homepageURL  https://github.com/vinta/pangu.js
// @downloadURL https://update.greasyfork.org/scripts/2185/%E7%82%BA%E4%BB%80%E9%BA%BC%E4%BD%A0%E5%80%91%E5%B0%B1%E6%98%AF%E4%B8%8D%E8%83%BD%E5%8A%A0%E5%80%8B%E7%A9%BA%E6%A0%BC%E5%91%A2%EF%BC%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/2185/%E7%82%BA%E4%BB%80%E9%BA%BC%E4%BD%A0%E5%80%91%E5%B0%B1%E6%98%AF%E4%B8%8D%E8%83%BD%E5%8A%A0%E5%80%8B%E7%A9%BA%E6%A0%BC%E5%91%A2%EF%BC%9F.meta.js
// ==/UserScript==

// see:
// https://wiki.greasespot.net/Metadata_Block
// https://tampermonkey.net/documentation.php

pangu.autoSpacingPage();
