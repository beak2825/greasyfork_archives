// ==UserScript==
// @name            Download Chinese K12 textbook from smartedu.cn
// @description     Download Chinese K12 textbook from smartedu.cn ;
// @name:zh-CN      国家中小学智慧教育平台下载电子教材
// @namespace       http://tampermonkey.net/
// @description:zh-CN  从国家中小学智慧教育平台下载电子教材。
// @version         1
// @author          dont-be-evil
// @match           https://basic.smartedu.cn/tchMaterial/detail*
// @icon            data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant           GM_openInTab
// @license         GPLv3
// @downloadURL https://update.greasyfork.org/scripts/526286/Download%20Chinese%20K12%20textbook%20from%20smarteducn.user.js
// @updateURL https://update.greasyfork.org/scripts/526286/Download%20Chinese%20K12%20textbook%20from%20smarteducn.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener("load", () => {
        const player_source = document.getElementById("pdfPlayerFirefox").src;
        const player_search = new URL(player_source);
        const player_params = new URLSearchParams(player_search.search);
        const textbook_source = player_params.get("file");
        GM_openInTab(textbook_source, { active: true, insert: true });
    });
})();
