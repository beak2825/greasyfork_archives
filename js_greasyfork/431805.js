// ==UserScript==
// @name         DiabloData-Unique
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  暗金物品
// @author       班登
// @match        http://wiki.d.163.com/diablo/items/*.htm
// @icon         https://www.google.com/s2/favicons?domain=undefined.localhost
// @grant        GM_setClipboard
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/431805/DiabloData-Unique.user.js
// @updateURL https://update.greasyfork.org/scripts/431805/DiabloData-Unique.meta.js
// ==/UserScript==

const stageMap = {
    normal: '普通',
    exceptional: '扩展',
    elite: '精华',
};

const typeMap = {
    uhelm: '头盔',
};

(function() {
    'use strict';

    const data = [];
    const stageMatch = location.href.match(/items\/(.+)\/.+\.htm/);
    const stage = stageMatch ? stageMatch[1] : '';
    const typeMatch = location.href.match(/(\w+)\.htm/);
    const type = typeMatch ? typeMatch[1] : '';
    console.log(typeMatch);

    // Your code here...
    $('table[cellpadding="5"] > tbody > tr').each(function(index, element) {
        const cells = $(this).children();
        const img = $(cells[0]).find('img').attr('src').replace('../../', 'http://wiki.d.163.com/diablo/');
        const title = $(cells[0]).text().trim().split('\n').map(i => i.replace(/\s+/g, ' ').trim()).filter(i => !!i);
        const name = title[0];
        const base = title[1];
        const attr = $(cells[1]).text().trim().split('\n').map(i => i.replace(/\s+/g, ' ').replace('须要', '需要').trim());

        data.push({
            stage: stageMap[stage],
            type: typeMap[type],
            img,
            name,
            base,
            attr
        });
    });

    console.log(data);

    GM_setClipboard(JSON.stringify(data, null, 2));
})();