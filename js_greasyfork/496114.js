// ==UserScript==
// @name         Elearning Download
// @namespace    https://facaikotei.github.io/
// @version      6.0.2
// @description  高雄科技大學 Elearning 檔案下載（114學年度修復版）
// @author       (c)2025 facaikotei (c)2022 Juirmin
// @match        https://elearning.nkust.edu.tw/moocs/*
// @require      https://update.greasyfork.org/scripts/12228/setMutationHandler.js
// @icon         https://elearning.nkust.edu.tw/moocs/assets/icons/PWA_icon_128.png
// @license      MIT
// @website      https://greasyfork.org/users/1305953
// @downloadURL https://update.greasyfork.org/scripts/496114/Elearning%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/496114/Elearning%20Download.meta.js
// ==/UserScript==

(function () {
    'use strict';

    setMutationHandler(document.querySelector('.cgust-main'), '.course-node__info', async (els) => {
        const courseNodeData = await (await fetch(`/api/v1/courses/${JSON.parse(sessionStorage.assignment).courseId}/node`)).json();
        const urlExtractor = item => [item.blank_url, ...item.items.flatMap(urlExtractor)];
        const urls = courseNodeData.data.items.flatMap(urlExtractor);
        els = [...new Set(els)];
        els.forEach((el, index) => {
            const url = urls[index % urls.length];
            if (url && !el.querySelector(`[href="${url}"]`)) {
                el.insertAdjacentHTML('beforeend', `<a target="_blank" href="${url}">下載</a>`);
            }
        });
    });
})();
