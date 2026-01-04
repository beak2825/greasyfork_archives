// ==UserScript==
// @name         MCD Rating Colorizer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  colorize profiles by atcoder rating
// @author       MCD
// @match        https://www.mcdigital.jp/team/
// @grant        GM.xmlHttpRequest
// @connect      atcoder.jp
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/440403/MCD%20Rating%20Colorizer.user.js
// @updateURL https://update.greasyfork.org/scripts/440403/MCD%20Rating%20Colorizer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getColorCode(value){
        let colorCode = '#FFFFFF'; // 白
        /**/ if(value <  400) colorCode = '#D9D9D9'; // 灰
        else if(value <  800) colorCode = '#D9C5B2'; // 茶
        else if(value < 1200) colorCode = '#B2D9B2'; // 緑
        else if(value < 1600) colorCode = '#B2ECEC'; // 水
        else if(value < 2000) colorCode = '#B2B2FF'; // 青
        else if(value < 2400) colorCode = '#ECECB2'; // 黄
        else if(value < 2800) colorCode = '#FFD9B2'; // 橙
        else /*value < 3200*/ colorCode = '#FFB2B2'; // 赤
        return colorCode;
    }

    function update(elem, handle){
        GM.xmlHttpRequest({
            url: 'https://atcoder.jp/users/' + handle + '/history/json',
            method: 'GET',
            onload: function(response) {
                const j = JSON.parse(response.responseText);
                const rating = j.slice(-1)[0].NewRating;
                const colorCode = getColorCode(rating);
                console.log(rating, colorCode);
                $(elem).closest(".memberListDetail").parent().prev().attr('style', 'background-color:' + colorCode + ';>');
            }
        });
    }

    $('.memberListDetail-links').find("li").find("a").each(function(i, elem) {
        const href = $(elem).attr("href");
        const atcoder = /https:\/\/atcoder.jp\/users\/(.*)/g
        const result = atcoder.exec(href);
        if(result){
            update(elem, result[1]);
        }
    });

})();
