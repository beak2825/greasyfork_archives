// ==UserScript==
// @name         Automatically convert timestamp to time string
// @namespace    http://tampermonkey.net/
// @version      0.4.0
// @description  自动替换时间戳为字符串
// @author       Cizel
// @match        *://cloud.mioffice.cn/next/console/zeus-fe/zeus/query*
// @icon         data:image/gif;base64,AAABAAEAICAAAAEAIABdAwAAFgAAAIlQTkcNChoKAAAADUlIRFIAAAAgAAAAIAgDAAAARKSKxgAAAAFzUkdCAdnJLH8AAAAJcEhZcwAACxMAAAsTAQCanBgAAAGDUExURQAAAGlrc6Cip4eKj0xOVoiJjYuMkISGi3V1d31/hHl7f2ppa3JzdoGEiHN0dmVkZX1/hHFxdGNhYmppa2ttdH5/hWloamFfX21sb21vdm9vclxaWmppa3FxdHp6fWZlZl5cXG1tb3d4fXN0eGtqbGJhYXNzdldXV2xsb19dXVtZWWhnaXp8gWlrcnNzdl1cXG1tbmBfYF9dXmJgYWVjZGJgYmhnand4fnN0eF1bW19dXWFfYG1sboKDiG9vcV9dXWxrbXR1ekVIUVlXV3BxdWJgYWZlZXR2e3h6fmloamFfYHFxdGNkaG1tbmJgYWxrbXR2e4OGi4GChoCBhYCBhXh3emZlZnx+hHR2em1sbmZlZ3FxdGZnbXBxc2JhYmRiY3d3eoCCiHBwdWxrbl9eXm5ub4aIjXBxc2xrbGdmZ3h5fVpaYGxsbmNiYnh5fHl7f2dmZ3V2eIeIjEFDTXR1d3BvcXl6f3Z3enh4eX+BhouNkYuNkFVYX5OWm3d6gFVYX3Z4f8pe6PwAAACBdFJOUwBEGmwCilQ3wiQ/x4sOoPNOWO/uCxvo/40Jk//cSTHa/6UoQMPwRgC4/v/HHQVy/9iHhYWFjHwfIP//+sAhhvnGRAEBRP/sLja593oKku7OKBlvgIHK7zUVu/eBCFz28WQOI5z/ux5g7vg4BdHzakDypRACiMNAL8MoanALcAsVL3JBH2gAAADmSURBVHicY2AgBzASkGdixi/PwsqGXwE7BydeeS5uHrzyvHz8AngVCAoJi+CTFxUTl8AnLyklLSOLT4GcvIKiEh55ZRVpVTU88uoamlraOrjldfX0tbQMDI2MTUzNzLEpsNDWAgNLK2sbW2wK7Oy1oMDB0QlT2tnFFSbv5o5Nv4cnTN7LG5u8j68fTIF/ADYFgUHBQBASqqUVFo7Lm0AQEakVFY1HPiY2Lj4hEY+CpOSU1DQ88gzpGZlZ+OSzc3Lz8Mkz5BcUFuGTLy4pLcNrQHlFJV55hqpq/PI1tXX4FdQ34JfHAQD3xiiO8SjWTAAAAABJRU5ErkJggg==
// @require      https://cdn.bootcss.com/jquery/3.5.1/jquery.min.js
// @require      https://unpkg.com/dayjs@1.8.21/dayjs.min.js
// @grant        none
// @license      GPL License
// @downloadURL https://update.greasyfork.org/scripts/430530/Automatically%20convert%20timestamp%20to%20time%20string.user.js
// @updateURL https://update.greasyfork.org/scripts/430530/Automatically%20convert%20timestamp%20to%20time%20string.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var $ = $ || window.$;
    // Your code here...
    var transTimer = setInterval (translateTimeStampOnPage, 222);

    function translateTimeStampOnPage () {
        $('.ant-table-tbody').children().each(function(i, raw) {
            $(raw).children().each(function (i, td) {
                var value = $(td).text();
                if(/^1[0-6]\d{8}$/.test(value)) {
                    $(td).text(dayjs(value * 1000).format('YYYY-MM-DD HH:mm:ss'));
                }
                if(/^1[0-6]\d{11}$/.test(value)){
                    $(td).text(dayjs(value).format('YYYY-MM-DD HH:mm:ss'));
                }
            });
        });
    }
})();