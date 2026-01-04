// ==UserScript==
// @name         多站合一音乐搜索
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  地址收集
// @author       You
// @match        http://music.wandhi.com/*
// @require      https://cdn.bootcss.com/jquery/1.7.1/jquery.min.js
// @icon         https://www.google.com/s2/favicons?sz=64&domain=wandhi.com
// @grant        GM_xmlhttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/460340/%E5%A4%9A%E7%AB%99%E5%90%88%E4%B8%80%E9%9F%B3%E4%B9%90%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/460340/%E5%A4%9A%E7%AB%99%E5%90%88%E4%B8%80%E9%9F%B3%E4%B9%90%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==

(function() {

    let t = setInterval(function() {
        let filename = $('#j-src-btn').attr('download');
        let name = filename.split(/[-.]/)[0];
        let author = filename.split(/[-.]/)[1];
        let type = filename.split(/[-.]/)[2];
        filename = `${author} - ${name}.${type}`;
        let url = $('#j-src-btn').attr('href');
        if (filename) {
            console.info(filename);
            console.info(url);
            let key = encodeURI('贝乐虎儿歌');
            let value = encodeURI(`${filename}|${url}`);
            GM_xmlhttpRequest({
                method: 'GET',
                url: `https://node-web.chenweiwen.top:57443/dataInfo/append?key=${key}&value=${value}&token=4NivA2SEhEo1pBSv5XMvVzzHtNAkcsVh`,
                onload: function(data) {
                    let res = JSON.parse(data.response);
                    console.info(res);
                }
            });
            clearInterval(t);
        }
    }, 500);
})();