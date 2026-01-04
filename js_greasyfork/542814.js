// ==UserScript==
// @name         AutoNhentaiCookie
// @namespace    http://tampermonkey.net/
// @version      2025-07-18
// @description  auto update nhentai cookie
// @author       You
// @license      private
// @match        https://nhentai.net/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=raindrop.io
// @grant        GM_cookie
// @connect      acgfun.fun
// @downloadURL https://update.greasyfork.org/scripts/542814/AutoNhentaiCookie.user.js
// @updateURL https://update.greasyfork.org/scripts/542814/AutoNhentaiCookie.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function parseData(data){
        const regex = /\[cookieBegin\](.*?)\[cookieEnd\]/;
        const result = data.match(regex);
        if (result && result[1]) {
            try{
                const jsonStr = result[1].replace(/&quot;/g, '"');
                return JSON.parse(jsonStr);
            }catch(e){
                return null;
            }
        }
        return null;
    }
    GM_cookie.list({ domain: 'nhentai.net' }, function(cookies, error) {
        if (error) {
            console.error(error);
            throw error;
        }
        let csrftoken = null;
        let sessionid = null;
        for(let i = 0; i < cookies.length;i++){
            let cookie = cookies[i];
            if(cookie.name == 'csrftoken') csrftoken = cookie.value;
            else if(cookie.name == 'sessionid') sessionid = cookie.value;
        }
        if(!csrftoken || !sessionid){
            throw new Error('未登录，无法更新cookie');
        }
        let cookie = 'checkcookieinfo';
        let time = Date.now();
        fetch(`https://rsshub.us.acgfun.fun:888/nhentai/toplist/0/0/0/0/${time}?cookie=${cookie}`)
        .then(response =>{
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(data => {
            const currentCookieData = parseData(data);
            //console.log(currentCookieData);
            let needUpdate = true;
            if(currentCookieData && currentCookieData.time){
                needUpdate = time - currentCookieData.time >= 1000*60*60*24*28;
            }
            if(needUpdate){
                time = Date.now();
                cookie = `csrftoken=${csrftoken};sessionid=${sessionid}`;
                return fetch(`https://rsshub.us.acgfun.fun:888/nhentai/toplist/0/0/0/0/${time}?cookie=${cookie}`);
            }else{
                console.log('无需更新');
                return;
            }
        })
        .then(response => {
            if(!response) return;
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.text();
        })
        .then(data =>{
            if(!data) return;
            if(data.indexOf('result:success')){
                console.log('成功更新');
            }else{
                console.log('更新失败');
            }
        })
        .catch(e =>{
            console.error(e);
        });
    });
})();