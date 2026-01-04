// ==UserScript==
// @name         YouTube 弹幕翻译器
// @description  翻译外语弹幕
// @namespace    http://tampermonkey.net/
// @version      1.0
// @author       kksskkoopp
// @match        https://www.youtube.com/live_chat_replay*
// @match        https://www.youtube.com/live_chat*
// @grant        GM_xmlhttpRequest
// @connect      openapi.youdao.com
// @license      MIT
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.2.0/crypto-js.min.js
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/524644/YouTube%20%E5%BC%B9%E5%B9%95%E7%BF%BB%E8%AF%91%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/524644/YouTube%20%E5%BC%B9%E5%B9%95%E7%BF%BB%E8%AF%91%E5%99%A8.meta.js
// ==/UserScript==


(function () {
    'use strict';


    let translate_period_ms = 750; // 每隔一端时间就抓取未翻译的弹幕
    let appKey = '6476c7fb....f95a'; // 自己申请
    let key = 'ywKVOl13Prr....NBacDTccmJ7CijjUy'; // 自己申请
    let from = 'auto';
    let to = 'zh-CHS';

    let chat_num = 0;


    setInterval(translate_all, translate_period_ms);

    function translate(query, from, to, appKey, key, callback) {
        const salt = Date.now();
        const curtime = Math.round(Date.now() / 1000);
        const sign = CryptoJS.SHA256(appKey + truncate(query.join("")) + salt + curtime + key).toString(CryptoJS.enc.Hex);
        let ret;
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

    function translate_all(){
        let elements = document.querySelectorAll('span#message.style-scope.yt-live-chat-text-message-renderer:not(#timestamp):not(#dashboard-deleted-state):not(#deleted-state)');
        if (elements.length > 0) {
            let group=[];
            for (let i = 0; i < elements.length; i++) {

                if (!elements[i].getAttribute('YoutubeChatTranslator')) {
                    let message = elements[i].textContent.trim();
                    group.push({elem:elements[i], text:message});
                    elements[i].setAttribute('YoutubeChatTranslator', chat_num.toString());
                    chat_num++;
                }
            }
            if (group.length > 0) {
                translate(group.map(item => item.text), from, to, appKey, key, (res)=>{
                    for (let i = 0; i < res.length; i++) {
                        group[i].elem.textContent += "【翻译】" + res[i].translation;
                    }
                });
            }
        }
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
