// ==UserScript==
// @name         Utool
// @namespace    http://tampermonkey.net/
// @version      1.19
// @description  工具站使用
// @author       Lrk
// @include      https://utool.iwanshang.cloud/*
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/460883/Utool.user.js
// @updateURL https://update.greasyfork.org/scripts/460883/Utool.meta.js
// ==/UserScript==

(function() {
    'use strict';


    // 直接引入 Axios 库
    var axios = document.createElement('script');
    axios.src = 'https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js';
    document.head.appendChild(axios);
    var data = {
        users: [
            { name: 'Alice', age: 22 },
            { name: 'Bob', age: 30 },
            { name: 'Charlie', age: 26 }
        ]
    };
    // 发送POST请求
    axios.post('https://utool.iwanshang.cloud/index.php?m=Wxcx&a=ttt', data)
        .then(function(response) {
            console.log(response);
        })
        .catch(function(error) {
            console.log(error);
        });

})();