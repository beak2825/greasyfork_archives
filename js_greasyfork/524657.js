// ==UserScript==
// @name         YouTube 标题翻译器
// @description  翻译标题
// @namespace    http://tampermonkey.net/
// @version      1.0
// @author       kksskkoopp
// @match        https://www.youtube.com/watch*
// @grant        GM_xmlhttpRequest
// @connect      openapi.youdao.com
// @license      MIT
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.2.0/crypto-js.min.js
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/524657/YouTube%20%E6%A0%87%E9%A2%98%E7%BF%BB%E8%AF%91%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/524657/YouTube%20%E6%A0%87%E9%A2%98%E7%BF%BB%E8%AF%91%E5%99%A8.meta.js
// ==/UserScript==


(function () {
    'use strict';

    let appKey = '6476c7fb....f95a';
    let key = 'ywKVOl13P......NBacDTccmJ7CijjUy';
    let from = 'auto';
    let to = 'zh-CHS';

    let timerId = setInterval(()=>{
        let a = document.querySelectorAll('div#title h1 yt-formatted-string');
        console.log("选中的元素数"+a.length);
        a.forEach(item=> {
            if(item.textContent !== ''){
                clearInterval(timerId);
                translate([item.textContent], from, to, appKey, key, (res)=>{
                    if(res.length > 0){
                        const translation_elem = document.createElement('div');
                        translation_elem.textContent = "[翻译]" + res[0].translation;
                        item.insertAdjacentElement('afterend', translation_elem);
                        item.parentElement.style.maxHeight = '100rem';
                        item.parentElement.style.webkitLineClamp = '100';
                    }

                })
                // 翻译
            }
        });
    },3000);

    function translate(query, from, to, appKey, key, callback) {
        const salt = Date.now();
        const curtime = Math.round(Date.now() / 1000);
        const sign = CryptoJS.SHA256(appKey + truncate(query.join("")) + salt + curtime + key).toString(CryptoJS.enc.Hex);
        GM_xmlhttpRequest({
            method: 'POST',
            url: 'https://openapi.youdao.com/v2/api',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data: `${convertToQueryString(query)}&appKey=${appKey}&salt=${salt}&from=${from}&to=${to}&sign=${sign}&signType=v3&curtime=${curtime}`,
            onload: function (response) {
                let data = JSON.parse(response.responseText);
                if (data.errorCode == 0)
                {
                    console.log(`============================`);

                    data.translateResults.forEach(translateResult => {
                        console.log(`${translateResult.query}  --->   ${translateResult.translation}`);
                    });
                    callback(data.translateResults);

                }
                else
                {
                    console.log(`============================`);
                    console.log(`[错误]errorCode=${data.errorCode}`);
                }
            },
            onerror: function () {
                console.error("网络错误");
            }
        });
    }

    function truncate(q) {
        const len = q.length;
        if (len <= 20) return q;
        return q.substring(0, 10) + len + q.substring(len - 10, len);
    }

    function convertToQueryString(arr) {
        return arr.map(item => `q=${encodeURIComponent(item)}`).join('&');
    }

})();
