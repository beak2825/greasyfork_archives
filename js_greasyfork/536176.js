// ==UserScript==
// @name         豆包AI生图无水印下载
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  在豆包AI生图页面自动下载无水印原图
// @author       公众号:代码简单说
// @match        https://www.doubao.com/*
// @match        https://doubao.com/*
// @match        https://*.doubao.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/536176/%E8%B1%86%E5%8C%85AI%E7%94%9F%E5%9B%BE%E6%97%A0%E6%B0%B4%E5%8D%B0%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/536176/%E8%B1%86%E5%8C%85AI%E7%94%9F%E5%9B%BE%E6%97%A0%E6%B0%B4%E5%8D%B0%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
     
    function findAllKeysInJson(obj, key) {
        const results = [];
        function search(current) {
            if (current && typeof current === 'object') {
                if (!Array.isArray(current) && Object.prototype.hasOwnProperty.call(current, key)) {
                    results.push(current[key]);
                }
                const items = Array.isArray(current) ? current : Object.values(current);
                for (const item of items) {
                    search(item);
                }
            }
        }
        search(obj);
        return results;
    }
 
    let _parse = JSON.parse;
    JSON.parse = function(data) {
        let jsonData = _parse(data);
        if (!data.match('creations')) return jsonData;
         
        let creations = findAllKeysInJson(jsonData, 'creations');
        if (creations.length > 0) {
            creations.forEach((creation) => {
                creation.map((item) => {
                    const rawUrl = item.image.image_ori_raw.url;
                    item.image.image_ori.url = rawUrl;
                    return item;
                });
            });
        }
        return jsonData;
    };
})();