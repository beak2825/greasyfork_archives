// ==UserScript==
// @name         装备评价
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  获取装备评价
// @author       You
// @match        https://diablocore-4gkv4qjs9c6a0b40-1307287922.tcloudbaseapp.com/d2data/*.htm
// @icon         https://www.google.com/s2/favicons?domain=undefined.
// @grant        GM_setClipboard
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/432476/%E8%A3%85%E5%A4%87%E8%AF%84%E4%BB%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/432476/%E8%A3%85%E5%A4%87%E8%AF%84%E4%BB%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const uniqueName = document.title;
    const setName = uniqueName.replace('暗金', '绿色');
    // Your code here...
    const uniqueAnchor = $(`span:contains("${uniqueName}")`);
    const setAnchor = $(`span:contains("${setName}")`);

    const uniqueTable = uniqueAnchor.parent().parent().next().text().replace(/\s+/g, ' ').trim().split(/\d+\.\s/).filter(i => !!i);
    const uniqueDataList = [];
    uniqueTable.forEach(i => {
        const uniqueData = {};
        uniqueData.name = i.split(' ')[0];

        const descStart = i.indexOf('描述');
        const upStart = i.indexOf('可升级否');
        const desc = i.slice(descStart, upStart);

        const slotStart = i.indexOf('镶嵌物');
        const ethStart = i.indexOf('无形/有形');
        const slot = i.slice(slotStart, ethStart);

        uniqueData.desc = desc.replace('描述：', '').trim();
        uniqueData.slot = slot.replace('镶嵌物：', '').replace('。', '').trim();

        uniqueDataList.push(uniqueData);
    });

    console.log(uniqueDataList);
})();