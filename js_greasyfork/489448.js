// ==UserScript==
// @name         THU-Thesis-Download
// @version      2024-02-26 v3
// @license      MIT
// @description  only for study thesis!
// @author       freedoman
// @match        https://newetds.lib.tsinghua.edu.cn/pdf/generic/web/viewer.html?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tsinghua.edu.cn
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @namespace http://nowhere.com
// @downloadURL https://update.greasyfork.org/scripts/489448/THU-Thesis-Download.user.js
// @updateURL https://update.greasyfork.org/scripts/489448/THU-Thesis-Download.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // console.log('thu-thesis-download work perfectly');
    let l_url = decodeURIComponent(decodeURIComponent(location.href));
    let resp = l_url.match(/https:\/\/newetds\.lib\.tsinghua\.edu\.cn\/pdf\/generic\/web\/viewer\.html\?file\=\/qh\/file\/previewpre\?(path\=.+\/.+\/.+\/(.+\.pdf).+thesisname\=(.+))/);
    let pdfurl = "https://newetds.lib.tsinghua.edu.cn/qh/file/previewpre?" + encodeURI(resp[1]);
    let filename = resp[3] + '_' + resp[2]
    GM_download(pdfurl, filename);
})();